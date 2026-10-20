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

// The map before the data · Rules with a home. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"tartu":{"name":"Once only","lead":1.4,"tail":1.0,"vo":[
 {"id":"born","gap":0.8,"text":"Tartu, Estonia, today. A baby is born, and the birth is entered once, in the population register."},
 {"id":"email","gap":0.8,"text":"Days later, the parents get an email from the Social Insurance Board. A family benefit is theirs, if they accept it."},
 {"id":"never","gap":0.8,"text":"They never applied."},
 {"id":"asks","gap":0.8,"text":"No office asks the parents again. Each one asks the population register, over X-Road, the exchange Estonia's public offices share."},
 {"id":"law","gap":0.8,"text":"By law, no office may build a second database of the same data, and every database is listed, with the office that owns it."},
 {"id":"link","gap":0.8,"text":"Each fact has one home and one owner. It's asked for once, and everyone who needs it asks there: once only."}]},
"bill":{"name":"The bill from day one","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's note asks where each rule belongs. On day one, he was shown one: an estimated reading stands only until the next actual reading."},
 {"id":"flag","gap":0.8,"text":"Beside it was a bill, flagged wrong."},
 {"id":"away","gap":0.8,"text":"Farah brings the household behind that bill. In June, they were away for three weeks, and their smart meter stopped sending readings."},
 {"id":"est","gap":0.8,"text":"The bill estimated those weeks from last year: four hundred and twelve dollars eighty."},
 {"id":"stored","gap":0.8,"text":"When the meter came back, it sent the readings it had stored. They had used almost nothing."},
 {"id":"never","gap":0.8,"text":"The actual readings arrived. The bill was never corrected."}]},
"script":{"name":"A rule on the wall","lead":1.0,"tail":1.0,"vo":[
 {"id":"existed","gap":0.8,"text":"The rule existed. Years ago, an analyst in metering wrote a nightly script, as a stopgap."},
 {"id":"found","gap":0.8,"text":"It found estimates with an actual reading behind them, and queued their bills to be corrected."},
 {"id":"march","gap":0.8,"text":"In March, billing moved to a new system. The script kept writing to the old queue, which nothing reads now."},
 {"id":"clean","gap":0.8,"text":"It ran every night, reported no error, and corrected nothing: about nineteen hundred bills since March."},
 {"id":"wall","gap":0.8,"text":"It lived on the wall between the network and retail, and belonged to neither side."}]},
"five":{"name":"Five places, no home","lead":1.0,"tail":1.0,"vo":[
 {"id":"four","gap":0.8,"text":"Tomás finds the rule written four more ways."},
 {"id":"where","gap":0.8,"text":"In the regulator's retail code, the meter system's settings, the billing team's notes and the complaints team's spreadsheet."},
 {"id":"how","gap":0.8,"text":"The regulator's code says why. The others each say how, a little differently. None of them is its home."},
 {"id":"once","gap":0.8,"text":"He wants for rules what Tartu has for a birth: once only."}]},
"split":{"name":"Two rules, not one","lead":1.0,"tail":1.0,"vo":[
 {"id":"two","gap":0.8,"text":"Day one's rule is really two rules, one on each side of the wall."},
 {"id":"net","gap":0.8,"text":"The network's: an estimate is replaced when the actual reading arrives, and the replacement is sent to the retailer. Grace owns it."},
 {"id":"ret","gap":0.8,"text":"Retail's: a bill based on a replaced estimate is corrected on the next bill. The head of retail owns it."},
 {"id":"cross","gap":0.8,"text":"Between them, the replaced reading crosses the wall on the agreed list, where the script once reached across unseen."}]},
"why":{"name":"Where a rule comes from","lead":1.0,"tail":1.0,"vo":[
 {"id":"reason","gap":0.8,"text":"Each rule has a reason: a regulation, a principle, or the service level of the step it serves."},
 {"id":"these","gap":0.8,"text":"Grace's comes from the metering rules; retail's, from the regulator's retail code."},
 {"id":"safe","gap":0.8,"text":"A rule with no reason can't be changed safely. One with no owner can't be fixed."},
 {"id":"ama","gap":0.8,"text":"Ama corrects day one's draft too. Fair, accurate bills was never one of the utility's goals. It's an obligation, in the regulator's code."}]},
"about":{"name":"What a rule is about","lead":1.0,"tail":1.0,"vo":[
 {"id":"words","gap":0.8,"text":"A rule builds on facts, and facts on concepts."},
 {"id":"terms","gap":0.8,"text":"So it's written in the business's words, about what it governs: a reading, an estimate, a bill, a connection point."},
 {"id":"objects","gap":0.8,"text":"Each becomes a data object, in the domain that owns it: readings and connection points on the network's side, bills on retail's."},
 {"id":"cim","gap":0.8,"text":"The industry's model gives the starting words, such as usage point for a connection point."},
 {"id":"own","gap":0.8,"text":"The map keeps the utility's own words beside them."}]},
"expect":{"name":"What the process expects","lead":1.0,"tail":1.0,"vo":[
 {"id":"step","gap":0.8,"text":"Each rule is attached to its step in meter to cash: the network's to reading, retail's to billing."},
 {"id":"inside","gap":0.8,"text":"Attached, not inside: a rule isn't the process."},
 {"id":"time","gap":0.8,"text":"The step also says what to expect of the data. Timeliness, from its service level: an estimate replaced within two working days."},
 {"id":"comp","gap":0.8,"text":"Completeness, from its steps: every estimate replaced, or explained. Validity, from another rule: every reading marked actual or estimated."}]},
"checks":{"name":"Test the data, track the business","lead":1.2,"tail":1.0,"vo":[
 {"id":"form","gap":0.8,"text":"Written in a set form, a rule says what it applies to, what must be true, its owner, its reason, its home, and what happens when it fails."},
 {"id":"data","gap":0.8,"text":"A rule about the data, such as every reading marked actual or estimated, gets tests: they check the data is right."},
 {"id":"gen","gap":0.8,"text":"They're generated from it, one way: a dbt test, a data contract's quality rule, a shape for linked data."},
 {"id":"hand","gap":0.8,"text":"Nobody edits a check by hand."},
 {"id":"biz","gap":0.8,"text":"Retail's rule is about what the business does: the data can all be right while a bill goes uncorrected."},
 {"id":"track","gap":0.8,"text":"So a tracking table is generated from it instead, listing every bill not corrected on the next bill."},
 {"id":"promise","gap":0.8,"text":"It tracks what the rule promises, not whether a job ran."},
 {"id":"first","gap":0.8,"text":"The first uncorrected bill would have been listed the morning after the move."},
 {"id":"team","gap":0.8,"text":"Each morning, the list goes to the owner's team, not a shared mailbox."}]},
"onto":{"name":"Generally, an ontology","lead":1.0,"tail":1.0,"vo":[
 {"id":"onto","gap":0.8,"text":"Written like this, the concepts, how they relate, and the rules about them are, generally, an ontology."},
 {"id":"owl","gap":0.8,"text":"It's ready for OWL, a language machines reason with."},
 {"id":"views","gap":0.8,"text":"As the film Meaning machines can read shows, the glossary, the models, the ontology and the checks are all views of that one map."},
 {"id":"open","gap":0.8,"text":"But OWL reasons only from what is said. To it, a correction that never happened is simply unknown."},
 {"id":"job","gap":0.8,"text":"Finding the uncorrected bill stays the tracking table's job."}]},
"end":{"name":"Back in Tartu","lead":1.0,"tail":1.0,"vo":[
 {"id":"refund","gap":0.8,"text":"The household gets a hundred and forty-four dollars forty back, and the nineteen hundred bills are found and corrected."},
 {"id":"confirm","gap":0.8,"text":"Grace and the head of retail confirm their rules."},
 {"id":"tartu","gap":0.8,"text":"In Tartu, the benefit is paid, and nobody was asked twice."},
 {"id":"answer","gap":0.8,"text":"Tomás's note has an answer: each rule belongs in the map, written once, at the step where it applies."},
 {"id":"owner","gap":0.8,"text":"Each has an owner and a reason, and its checks are generated from it."},
 {"id":"next","gap":0.8,"text":"Rules hold while the organisation holds still. Next: when strategy moves."}]}
};

const VODUR={"tartu/born": 6.555, "tartu/email": 6.873, "tartu/never": 1.044, "tartu/asks": 8.889, "tartu/law": 7.773, "tartu/link": 6.562, "bill/note": 9.252, "bill/flag": 1.933, "bill/away": 7.658, "bill/est": 4.845, "bill/stored": 4.776, "bill/never": 3.336, "script/existed": 6.037, "script/found": 4.738, "script/march": 6.469, "script/clean": 6.164, "script/wall": 4.366, "five/four": 2.578, "five/where": 6.802, "five/how": 6.211, "five/once": 3.373, "split/two": 3.692, "split/net": 7.946, "split/ret": 6.408, "split/cross": 6.556, "why/reason": 5.979, "why/these": 4.951, "why/safe": 5.022, "why/ama": 8.96, "about/words": 2.805, "about/terms": 6.376, "about/objects": 8.101, "about/cim": 4.855, "about/own": 2.591, "expect/step": 5.574, "expect/inside": 3.046, "expect/time": 7.934, "expect/comp": 9.2, "checks/form": 8.303, "checks/data": 7.062, "checks/gen": 6.961, "checks/hand": 1.719, "checks/biz": 6.047, "checks/track": 5.766, "checks/promise": 3.264, "checks/first": 3.922, "checks/team": 3.927, "onto/onto": 6.0, "onto/owl": 3.597, "onto/views": 7.6, "onto/open": 6.572, "onto/job": 3.657, "end/refund": 6.341, "end/confirm": 2.701, "end/tartu": 3.604, "end/answer": 6.129, "end/owner": 3.829, "end/next": 4.86};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: Tartu's register answering every office that asks, then the title; the two rules settling on their
   sides of the wall, with the replaced reading crossing between them; and the ending. */
const BREATH={
"tartu":{"hold":{"born":0.6,"email":0.6,"never":1.0,"asks":0.6,"law":0.8,"link":0.6},"breathe":4.4},
"bill":{"hold":{"note":0.7,"flag":0.8,"est":0.7,"never":1.0}},
"script":{"hold":{"found":0.6,"march":0.7,"clean":1.0,"wall":0.8}},
"five":{"hold":{"where":0.8,"how":0.9}},
"split":{"hold":{"two":0.8,"net":0.7,"ret":0.7},"breathe":3.0},
"why":{"hold":{"these":0.6,"safe":0.9,"ama":0.8}},
"about":{"hold":{"terms":0.7,"objects":0.8,"own":0.7}},
"expect":{"hold":{"inside":0.9,"time":0.7,"comp":0.8}},
"checks":{"hold":{"form":0.8,"data":0.6,"gen":0.8,"hand":0.6,"biz":1.1,"track":0.9,"promise":0.6,"first":0.9,"team":0.8}},
"onto":{"hold":{"owl":0.9,"views":0.8,"job":1.0}},
"end":{"hold":{"confirm":0.7,"tartu":0.9,"owner":0.9},"breathe":5.0}
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

/* ===== When things go wrong · Silent change: this episode's components =====
   Drawn with the first film's style (glass, luminous edges, one typeface) and the series' characters (people.js). */
// SCENES, cue(), scene(), the sketch's ink (SK) and the diagram components (entBox, ent, relLine, diagram) come from A Sharper Sketch's sketch3.js
const fout=(t,a,d)=>1-sstep(a,a+(d||0.6),t);
const brief=(t,a,d)=>fin(t,a,0.4)*fout(t,a+(d||3));
const AMBER=[255,190,90],GOLDC=LAYER.gold;
const mixc=(a,b,f)=>a.map((v,i)=>Math.round(v+(b[i]-v)*clamp(f,0,1)));
// packets along a lane: small glowing cells, like the cells in the vaults; those that set off after "until" never start, the rest finish their trip
function packets(ctx,t,pts,every,dur,off,col,size,al,until){const L=mk(pts);spawn(t,every,dur,off,(u,k)=>{if(until!=null&&off+k*every>until)return;const q=at(L,u),a=(al==null?1:al)*sstep(0,0.1,u)*(1-sstep(0.85,1,u));if(a<=0.01)return;
  withA(ctx,a,()=>{glow(ctx,q.x,q.y,size*1.4,col,0.45);ctx.fillStyle=rgba(col,0.95);rr(ctx,q.x-size/2,q.y-size/2,size,size,4);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.35)";rr(ctx,q.x-size/2+3,q.y-size/2+3,size*0.4,size*0.25,2);ctx.fill();});});}
function camKeys(ctx,S,keys,t){const cam=camAt(keys,t);setCam(ctx,S,cam);return cam;}
// the background of the platform world, or of a room at dawn (warm light from a window on the left)
function world(ctx,S){setScreen(ctx,S);bg2(ctx);}
function room(ctx,S,t,o){o=o||{};if(o.cam){const q=o.cam;ctx.setTransform(S*q.z,0,0,S*q.z,S*(W/2-q.x*q.z),S*(H/2-q.y*q.z));}else setScreen(ctx,S);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,o.top||"#0c1428");g.addColorStop(1,"#05080f");ctx.fillStyle=g;ctx.fillRect(-W,-H,3*W,3*H);
  const wx=o.wx==null?90:o.wx,wy=150,ww=380,wh=470;ctx.save();rr(ctx,wx,wy,ww,wh,10);ctx.clip();
  const sky=ctx.createLinearGradient(0,wy,0,wy+wh);sky.addColorStop(0,"#16264c");sky.addColorStop(0.55,"#5b4a78");sky.addColorStop(0.85,"#e0876a");sky.addColorStop(1,"#f6c37e");ctx.fillStyle=sky;ctx.fillRect(wx,wy,ww,wh);
  glow(ctx,wx+ww*0.6,wy+wh*0.95,180+10*Math.sin(t*0.4),[255,190,120],0.5);
  ctx.fillStyle="#0d1020";[[0,110,70],[60,70,120],[170,140,50],[210,90,80],[300,120,80]].forEach(([x,h2,w2])=>ctx.fillRect(wx+x,wy+wh-h2,w2,h2));
  ctx.fillStyle="rgba(255,214,150,0.8)";for(let i=0;i<14;i++){const lx=hash(i,1)*ww;if(hash(i,3)>0.5&&(lx<200||lx>330))ctx.fillRect(wx+lx,wy+wh-hash(i,2)*100,4,5);}
  ctx.restore();ctx.strokeStyle="rgba(20,26,44,0.95)";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh);ctx.moveTo(wx,wy+wh*0.45);ctx.lineTo(wx+ww,wy+wh*0.45);ctx.stroke();
  glass(ctx,wx,wy,ww,wh,10,[255,200,150],{glow:24,ga:0.2,fill:"rgba(0,0,0,0)",ea:0.4});
  const spill=ctx.createRadialGradient(wx+ww*0.6,wy+wh,40,wx+ww*0.6,wy+wh,900);spill.addColorStop(0,"rgba(255,170,110,0.16)");spill.addColorStop(1,"rgba(255,170,110,0)");ctx.fillStyle=spill;ctx.fillRect(-W,-H,3*W,3*H);}
// a small clock chip, top left
function clockChip(ctx,S,s,sub,a){setScreen(ctx,S);withA(ctx,a==null?1:a,()=>{const w=28+tw(ctx,s,32,800,"mono")+(sub?18+tw(ctx,sub,20,600):0)+28;glass(ctx,64,52,w,64,18,[170,205,255],{glow:10,ea:0.5,fill:"rgba(8,14,28,0.85)"});
  T(ctx,s,92,96,{w:800,size:32,f:"mono"});if(sub)T(ctx,sub,92+tw(ctx,s,32,800,"mono")+18,94,{w:600,size:20,color:rgba(SOFT,0.95)});});}
// a message bubble: who, what, and a colour for the sender's side; typing dots before it appears
function msg(ctx,x,y,w,who,text,c,a,typing){if(a<=0.01&&!typing)return;const lines=[];ctx.save();ctx.font=font(600,26);let cur="";text.split("\n").forEach(par=>{cur="";par.split(" ").forEach(s=>{const tr=cur?cur+" "+s:s;if(ctx.measureText(tr).width>w-48&&cur){lines.push(cur);cur=s;}else cur=tr;});if(cur)lines.push(cur);});ctx.restore();
  const h=52+lines.length*36;withA(ctx,Math.max(a,typing?1:0),()=>{glass(ctx,x,y,w,typing&&a<0.5?84:h,20,c,{glow:12,ea:0.65,fill:"rgba(9,15,30,0.92)"});T(ctx,who,x+24,y+32,{w:800,size:18,color:rgba(c,0.95)});
    if(a<0.5&&typing){for(let i=0;i<3;i++){ctx.fillStyle=rgba(INK,0.4+0.5*Math.max(0,Math.sin(typing*6-i*0.8)));ctx.beginPath();ctx.arc(x+34+i*20,y+60,5,0,TAU);ctx.fill();}}
    else withA(ctx,a,()=>lines.forEach((l,i)=>T(ctx,l,x+24,y+72+i*36,{w:600,size:26})));});return h;}
// Ana's dashboard, in the style of a Databricks AI/BI dashboard: a light canvas, a header with the logo, an alert banner when the data is old,
// a counter (KPI) widget for class fill with its comparison and a capacity bar, and a bar chart of every class. No pie charts.
const DB={canvas:"#f5f6f8",card:"#ffffff",line:"#d8dee4",text:"#11171c",muted:"#5f7281",blue:"#077a9d",green:"#277c43",greenBg:"#e3f4ea",red:"#c82d4c",warn:"#8a5300",warnBg:"#fcefd9",warnLine:"#f0a33a",track:"#e8ecf0"};
function dbCard(ctx,x,y,w,h){ctx.save();ctx.shadowColor="rgba(0,0,0,0.18)";ctx.shadowBlur=10;ctx.shadowOffsetY=2;ctx.fillStyle=DB.card;rr(ctx,x,y,w,h,8);ctx.fill();ctx.restore();ctx.strokeStyle=DB.line;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,8);ctx.stroke();}
// a counter widget: title, source table, the value, a comparison, a 14-day trend, a capacity bar and places; s scales the type for small copies.
// numA fades the value and comparison (so one number can make way for another)
function kpiCard(ctx,x,y,w,h,o){o=o||{};const s=o.s||1,v=o.value==null?94:o.value,pad=20*s,shown=(o.shown||Math.round(v))+"%",nA=o.numA==null?1:o.numA,col=o.ghost?DB.red:DB.blue;
  if(h/s<250){dbCard(ctx,x,y,w,h);const bw=w-2*pad,by=y+h-pad-30*s;T(ctx,o.title||"Data Science 101",x+pad,y+pad+17*s,{w:700,size:18*s,color:DB.text});
    T(ctx,o.sub||"places filled",x+pad,y+pad+38*s,{w:500,size:15*s,color:DB.muted});withA(ctx,nA,()=>T(ctx,shown,x+pad,y+pad+90*s,{w:700,size:48*s,color:o.ghost?DB.red:DB.text}));
    ctx.fillStyle=DB.track;rr(ctx,x+pad,by,bw,10*s,5*s);ctx.fill();ctx.fillStyle=col;rr(ctx,x+pad,by,bw*Math.min(1,v/100),10*s,5*s);ctx.fill();
    T(ctx,Math.round(v*1.2)+" of 120 places",x+pad,y+h-pad,{w:500,size:16*s,color:DB.muted});return;}
  dbCard(ctx,x,y,w,h);
  T(ctx,o.title||"Places filled · Data Science 101",x+pad,y+pad+16*s,{w:700,size:19*s,color:DB.text});T(ctx,o.source||"fct_offering_fill",x+pad,y+pad+40*s,{w:500,size:14*s,f:"mono",color:DB.muted});
  withA(ctx,nA,()=>{T(ctx,shown,x+pad,y+pad+122*s,{w:700,size:78*s,color:o.ghost?DB.red:DB.text});
    if(o.delta)T(ctx,o.delta,x+pad+tw(ctx,shown,78*s,700)+16*s,y+pad+118*s,{w:700,size:17*s,color:o.deltaCol||DB.green});});
  const by=y+h-pad-44*s,bw=w-2*pad,sy0=y+pad+150*s,sy1=by-30*s;
  if(sy1-sy0>40*s){const tr=o.trend||[71,74,76,79,81,83,85,86,88,90,91,92,93,v],lo=60,hi=Math.max(100,...tr)+4,px=i=>x+pad+bw*i/(tr.length-1),py=q=>sy1-(sy1-sy0)*(q-lo)/(hi-lo);
    ctx.beginPath();tr.forEach((q,i)=>i?ctx.lineTo(px(i),py(q)):ctx.moveTo(px(i),py(q)));ctx.lineTo(px(tr.length-1),sy1);ctx.lineTo(px(0),sy1);ctx.closePath();ctx.fillStyle=o.ghost?"rgba(200,45,76,0.10)":"rgba(7,122,157,0.10)";ctx.fill();
    ctx.beginPath();tr.forEach((q,i)=>i?ctx.lineTo(px(i),py(q)):ctx.moveTo(px(i),py(q)));ctx.strokeStyle=col;ctx.lineWidth=2.5*s;ctx.stroke();
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(px(tr.length-1),py(tr[tr.length-1]),4*s,0,TAU);ctx.fill();T(ctx,"last 14 days",x+pad,sy0-4*s,{w:500,size:13*s,color:DB.muted});}
  ctx.fillStyle=DB.track;rr(ctx,x+pad,by,bw,12*s,6*s);ctx.fill();
  ctx.fillStyle=col;rr(ctx,x+pad,by,bw*Math.min(1,v/100),12*s,6*s);ctx.fill();
  if(v>100){ctx.fillStyle=DB.red;rr(ctx,x+pad+bw-4*s,by-6*s,8*s,24*s,3*s);ctx.fill();}
  ctx.strokeStyle=DB.text;ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(x+pad+bw,by-8*s);ctx.lineTo(x+pad+bw,by+20*s);ctx.stroke();
  T(ctx,o.foot||Math.round(v*1.2)+" of 120 places",x+pad,y+h-pad,{w:500,size:15*s,color:DB.muted});T(ctx,"capacity",x+pad+bw,y+h-pad,{w:500,size:13*s,align:"right",color:DB.muted});}
// a small copy of the counter, for the platform views: the data product the dashboard shows, with a gold edge for the gold layer
function kpiMini(ctx,x,y,w,h,v,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.shadowColor=rgba(GOLDC,0.7);ctx.shadowBlur=18;ctx.strokeStyle=rgba(GOLDC,0.9);ctx.lineWidth=2.5;rr(ctx,x-4,y-4,w+8,h+8,11);ctx.stroke();ctx.restore();
  kpiCard(ctx,x,y,w,h,{s:w/300,value:v||94});});}
// o.num: the value (a number, or text such as "96%"); o.banner and o.ok: the amber note and the green all-clear (0 to 1);
// o.ghost (0 to 1): the number it would have shown, had the waitlist counted
function dashboard(ctx,x,y,w,h,o){o=o||{};const num=o.num==null?94:parseFloat(o.num),g=o.ghost||0,gIn=sstep(0.45,1,g);
  // the screen: a dark bezel around a light dashboard
  glass(ctx,x-12,y-12,w+24,h+24,22,[170,205,255],{glow:18,ea:0.45,fill:"rgba(8,14,28,0.95)"});ctx.save();rr(ctx,x,y,w,h,12);ctx.clip();ctx.fillStyle=DB.canvas;ctx.fillRect(x,y,w,h);
  ctx.fillStyle=DB.card;ctx.fillRect(x,y,w,64);ctx.fillStyle=DB.line;ctx.fillRect(x,y+64,w,1.2);const lw=logo(ctx,"databricks",x+20,y+18,28);
  T(ctx,o.title||"Enrolments · census date tomorrow",x+34+lw,y+41,{w:700,size:21,color:DB.text});T(ctx,o.day||"Tuesday",x+w-22,y+40,{w:500,size:16,align:"right",color:DB.muted});
  let cy=y+84;const alert=(bg,line,col,icon,text,a)=>withA(ctx,a,()=>{ctx.fillStyle=bg;rr(ctx,x+20,cy,w-40,52,6);ctx.fill();ctx.fillStyle=line;rr(ctx,x+20,cy,6,52,3);ctx.fill();
    ctx.fillStyle=col;ctx.font=font(800,20);ctx.fillText(icon,x+40,cy+34);T(ctx,text,x+72,cy+33,{w:600,size:19,color:col});});
  // the note makes room for itself: the cards slide down as it fades in
  const room=ease(clamp((o.banner||0)+(o.ok||0),0,1));if(o.banner>0)alert(DB.warnBg,DB.warnLine,DB.warn,"⚠","Last good data: yesterday, 23:02 · a test stopped today's refresh",o.banner*(1-(o.ok||0))*sstep(0.3,1,room));
  if(o.ok>0)alert(DB.greenBg,DB.green,DB.green,"✓",o.okText||"Up to date: today, 08:40",o.ok);
  cy+=72*room;const gh=y+h-cy-20,kw=w*0.46;
  kpiCard(ctx,x+20,cy,kw,gh,{value:num,delta:o.delta||("▲ "+(Math.round(num)-92)+" pts vs last week"),foot:o.foot,numA:1-sstep(0,0.5,g)});
  if(o.flash>0)withA(ctx,o.flash,()=>{ctx.strokeStyle=DB.blue;ctx.lineWidth=3;rr(ctx,x+20,cy,kw,gh,8);ctx.stroke();});
  if(g>0){withA(ctx,g,()=>{ctx.save();ctx.fillStyle="rgba(255,255,255,0.92)";rr(ctx,x+20,cy,kw,gh,8);ctx.fill();ctx.setLineDash([10,8]);ctx.strokeStyle=DB.red;ctx.lineWidth=3;rr(ctx,x+20,cy,kw,gh,8);ctx.stroke();ctx.restore();});
    withA(ctx,gIn,()=>kpiCard(ctx,x+20,cy,kw,gh,{value:108,ghost:1,delta:"incl. waitlist",deltaCol:DB.red,foot:"130 of 120 places",trend:[71,74,76,79,81,83,85,86,88,90,91,92,94,108]}));}
  // a bar chart of every first-year unit: Data Science 101 highlighted
  const bx=x+40+kw,bwid=w-60-kw;dbCard(ctx,bx,cy,bwid,gh);T(ctx,"Places filled by unit",bx+20,cy+36,{w:700,size:19,color:DB.text});T(ctx,"first-year units · semester 2",bx+20,cy+60,{w:500,size:14,color:DB.muted});
  const rows=[["Data Science 101",num],["Statistics 110",88],["Programming 100",76],["Data Ethics 120",64]],lx=bx+20,bw2=bwid-190,rh=Math.min(56,(gh-100)/rows.length);
  const row=(n,v,i,c,vc)=>{const yy=cy+90+i*rh;T(ctx,n,lx,yy+14,{w:i?500:700,size:15,color:DB.text});ctx.fillStyle=DB.track;rr(ctx,lx,yy+22,bw2,14,4);ctx.fill();
    ctx.fillStyle=c;rr(ctx,lx,yy+22,bw2*Math.min(1,v/100),14,4);ctx.fill();if(v>100){ctx.fillStyle=DB.red;rr(ctx,lx+bw2-3,yy+17,6,24,2);ctx.fill();}T(ctx,Math.round(v)+"%",lx+bw2+14,yy+34,{w:700,size:16,color:vc||DB.text});};
  rows.forEach(([n,v],i)=>row(n,v,i,i?"#8bcae7":DB.blue));
  if(gIn>0)withA(ctx,gIn,()=>{ctx.fillStyle=DB.card;ctx.fillRect(lx-4,cy+90,bwid-36,rh-4);row("Data Science 101",108,0,DB.red,DB.red);});
  ctx.strokeStyle=DB.muted;ctx.setLineDash([4,4]);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(lx+bw2,cy+96);ctx.lineTo(lx+bw2,cy+96+rows.length*rh);ctx.stroke();ctx.setLineDash([]);
  ctx.restore();}
// a person in a video-call tile: head and shoulders, name and role
function callTile(ctx,id,x,y,w,h,o){o=o||{};const P=PEOPLE[id];glass(ctx,x,y,w,h,20,P.edge,{glow:o.hi?22:12,ea:o.hi?0.9:0.55,fill:"rgba(14,22,42,0.92)"});
  ctx.save();rr(ctx,x+3,y+3,w-6,h-6,18);ctx.clip();const s=o.s||h/190,k=s*P.build.h;person(ctx,id,x+w/2,y+h*0.52+505*k,s,{pose:"stand",expr:o.expr||"calm",t:o.t||0,glow:0.3});ctx.restore();
  withA(ctx,o.label==null?1:o.label,()=>{glass(ctx,x+12,y+h-50,tw(ctx,P.name.replace("Prof. ",""),18,700)+30,38,12,P.edge,{glow:6,ea:0.5,fill:"rgba(6,10,20,0.85)"});T(ctx,P.name.replace("Prof. ",""),x+27,y+h-25,{w:700,size:18});});}
// the quarantine tray: rows that failed a test, kept aside to be looked at
function tray(ctx,x,y,w,n,t,a){withA(ctx,a,()=>{glass(ctx,x,y,w,86,16,BAD,{glow:12,ea:0.6,fill:"rgba(40,10,14,0.55)"});T(ctx,"kept aside · "+n+" rows",x+18,y+28,{w:700,size:19,color:"rgba(255,180,170,1)"});
  for(let i=0;i<Math.min(n,15);i++){const bx=x+18+i*((w-36)/15),by=y+42+Math.sin(t*1.3+i)*2;ctx.fillStyle=rgba(AMBER,0.75);rr(ctx,bx,by,(w-36)/15-6,26,5);ctx.fill();}});}
// the lineage, as a row of steps: each step can light up as the red thread reaches it
const LIN=[["exposure","dashboard"],["fct_offering_fill","data product"],["int_offering_enrolments","joins enrolments to units"],["stg_enrolments","staging · tested"],["bronze.enrolments","as it arrived"]];
function lineage(ctx,x0,y,dx,o){o=o||{};const pts=LIN.map((_,i)=>[x0-i*dx,y]);
  ctx.strokeStyle="rgba(170,200,245,0.35)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);pts.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.stroke();
  // the red thread, moving back along the lineage one step at a time
  if(o.k>0){const k=Math.min(o.k,pts.length-1),i=Math.floor(k),f=k-i,end=i<pts.length-1?[lerp(pts[i][0],pts[i+1][0],f),y]:pts[i];
    beam(ctx,[{x:pts[0][0],y},{x:end[0],y}],BAD,[[22,0.08],[9,0.22],[3,0.85],[1.5,1]]);glow(ctx,end[0],y,36,BAD,0.7);}
  pts.forEach((p,i)=>{const [n,sub]=LIN[i],bad=i===3&&o.bad,on=o.k>=i-0.05,c=bad?BAD:i===4?LAYER.bronze:i===0?GOLDC:[170,205,255];const w=Math.max(tw(ctx,n,22,700,"mono"),tw(ctx,sub,17,500))+44;
    glass(ctx,p[0]-w/2,y-48,w,96,18,c,{glow:on?22:8,ea:on?0.95:0.45,fill:"rgba(8,14,28,0.92)"});T(ctx,n,p[0],y-6,{w:700,size:22,f:"mono",align:"center"});T(ctx,sub,p[0],y+26,{w:500,size:17,align:"center",color:rgba(SOFT,0.95)});
    if(i===3){const gc=bad?BAD:GOOD;ctx.strokeStyle=rgba(gc,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p[0],y-75);ctx.lineTo(p[0],y-48);ctx.stroke();gate(ctx,p[0],y-110,70,gc,"tests");
      T(ctx,bad?"test failed":"tests pass",p[0]+42,y-104,{w:700,size:18,color:rgba(gc,1)});}});return pts;}
// the sharper conceptual model from A Sharper Sketch, drawn with that film's components: enrolment status is its own entity,
// "Status change", with a date, and it gains the new status. newA reveals "waitlisted"; hi lights the Status change box.
function sharperSketch(ctx,o){o=o||{};const E={};Object.keys(L3).forEach(k=>{E[k]={x:L3[k][0],y:L3[k][1],name:NAME[k],s:1,a:o.a==null?1:o.a};});
  E.Offering.sub="census date";E.Unit.sub="Data Science 101";E.Class.sub="Tue 9 am tutorial";E.Status.sub="status · date";
  E.Status.attrs=[["enrolled",""],["withdrawn",""],["waitlisted",""]];E.Status.attrA=(2+(o.newA||0))/3;E.Status.hi=o.hi||0;E.Status.hiCol=AMBER;
  const B=diagram(ctx,E,L3R.filter(r=>!(r[0]==="Offering"&&r[1]==="Term")).map(r=>r.concat([{}])));
  elbowRel(ctx,B.Offering,B.Term,B.Class);
  const b=B.Status,top=b.y-b.h/2,yy=top+80+28+2*30,lx=b.x-b.w/2;
  withA(ctx,o.newA||0,()=>{ctx.save();rr(ctx,lx+4,yy-26,b.w-8,34,8);ctx.clip();glow(ctx,lx+90,yy-6,70,AMBER,0.45*(o.glowNew||1));ctx.restore();
    tag(ctx,lx+b.w+14,yy-6,"new",AMBER,{size:18});});return B;}
// a one-to-many line drawn with right angles: down from Unit offering, across below it, and down into Teaching period
function elbowRel(ctx,A,B,below){const x0=A.x+A.w/2-44,y0=A.y+A.h/2,ym=(y0+(below.y-below.h/2))/2,x1=B.x,y1=B.y-B.h/2;
  ctx.save();ctx.shadowColor=rgba(SK,0.8);ctx.shadowBlur=10;ctx.strokeStyle=rgba(SK,0.95);ctx.lineWidth=2.4;ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0,ym);ctx.lineTo(x1,ym);ctx.lineTo(x1,y1);ctx.stroke();
  // many offerings (crow's foot at Unit offering), one teaching period (bar at Teaching period)
  ctx.beginPath();ctx.moveTo(x0-13,y0);ctx.lineTo(x0,y0+20);ctx.lineTo(x0+13,y0);ctx.moveTo(x1-11,y1-14);ctx.lineTo(x1+11,y1-14);ctx.stroke();ctx.restore();}
// the data contract for enrolments: what arrives, what's allowed and what it means, how fresh, and an owner in each corner
function contract(ctx,x,y,w,h,o){o=o||{};const ver=o.ver||"1.0",dA=o.deferred||0;glass(ctx,x,y,w,h,24,[236,243,255],{glow:24+10*(o.glow||0),ea:0.9,fill:"rgba(10,16,32,0.95)"});
  T(ctx,"Data contract · enrolments",x+36,y+60,{w:800,size:34});stampV(ctx,x+w-40,y+50,"v"+ver,o.verFlash||0);
  const key=(k,yy)=>T(ctx,k,x+36,yy,{w:700,size:21,color:rgba(SOFT,0.95)}),vx=x+196,base="enrolled · withdrawn · waitlisted";
  const rows=[[136,()=>{key("Fields",y+136);T(ctx,"student, offering, status, date",vx,y+136,{w:600,size:23});}],
    [192,()=>{key("Statuses",y+192);T(ctx,base,vx,y+192,{w:600,size:22,f:"mono"});if(dA>0)withA(ctx,dA,()=>T(ctx," · deferred",vx+tw(ctx,base,22,600,"mono"),y+192,{w:600,size:22,f:"mono",color:rgba(mixc(INK,GOLDC,o.defHi||0),1)}));}],
    [248,()=>{key("Meaning",y+248);T(ctx,"enrolled = holds a place on census date",vx,y+248,{w:600,size:22});T(ctx,"waitlisted = no place yet · withdrawn = left",vx,y+280,{w:600,size:22});
      if(dA>0)withA(ctx,dA,()=>T(ctx,"deferred = starts in a later term",vx,y+312,{w:600,size:22,color:rgba(mixc(INK,GOLDC,o.defHi||0),1)}));}],
    [364,()=>{key("Freshness",y+364);T(ctx,"by 06:00 every day",vx,y+364,{w:600,size:23});}]];
  rows.forEach(([,draw],i)=>withA(ctx,o.rows==null?1:clamp(o.rows*rows.length-i,0,1),draw));
  // the owners: one on each side of the change, technical and business, producing and using the data
  ctx.strokeStyle="rgba(170,200,245,0.18)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+26,y+398);ctx.lineTo(x+w-26,y+398);ctx.stroke();
  const cx1=x+w*0.44,cx2=x+w*0.7;key("Owners",y+432);T(ctx,"business",cx1,y+432,{w:700,size:18,color:rgba(BIZ,0.95)});T(ctx,"technical",cx2,y+432,{w:700,size:18,color:rgba(TECH,0.95)});
  T(ctx,"produce",vx,y+474,{w:600,size:19,color:rgba(SOFT,0.95)});T(ctx,"use",vx,y+516,{w:600,size:19,color:rgba(SOFT,0.95)});
  [["mei",cx1,y+474],["ben",cx2,y+474],["ana",cx1,y+516],["sam",cx2,y+516]].forEach(([id,cx,cy],i)=>{const P=PEOPLE[id],a=o.sign?clamp(o.sign*4-i,0,1):0,n=o.notice?o.notice:0;
    withA(ctx,0.35+0.65*Math.max(a,n),()=>{led(ctx,cx,cy-15,12,12,P.edge);T(ctx,P.name.split(" ")[0],cx+22,cy,{w:700,size:22,color:rgba(P.edge,0.95)});});});}
function stampV(ctx,x,y,s,flash){const w=tw(ctx,s,22,800,"mono")+26;glass(ctx,x-w,y-22,w,40,12,GOOD,{glow:8+20*flash,ea:0.8,fill:"rgba(10,30,20,0.8)"});T(ctx,s,x-w/2,y+6,{w:800,size:22,f:"mono",align:"center",color:"rgba(200,255,220,1)"});}
// the platform in one row: the student system, the contract at the door, bronze, the dbt test gate, silver, gold and the data product
function platformRow(ctx,t,o){o=o||{};const y=o.y||470;
  sysCard(ctx,70,y-60,290,120,"Student system","events and files",APP.sis.c);
  const lanes=[[360,y],[520,y]],d=o.door||0;
  lane(ctx,[{x:360,y},{x:560,y}],APP.sis.c,0.8);
  if(d>0)withA(ctx,d,()=>{glass(ctx,440,y-92,84,184,16,[236,243,255],{glow:14+8*Math.sin(t*1.5),ea:0.8,fill:"rgba(12,18,34,0.9)"});T(ctx,"contract",482,y+118,{w:700,size:16,align:"center",color:rgba(INK,0.9)});
    for(let i=0;i<4;i++){ctx.fillStyle=rgba(i%2?TECH:BIZ,0.9);ctx.fillRect(452,y-72+i*38,60,6);}});
  const cells=(err)=>(r,c)=>{const k=hash(r*13+c,7);return k<0.08&&err?AMBER:k<0.8?APP.sis.c:null;};
  vault(ctx,560,y-150,240,300,LAYER.bronze,cells(o.err),"Bronze","as it arrived");
  const g=o.gate||GOOD;lane(ctx,[{x:800,y},{x:900,y}],APP.sis.c,0.6);gate(ctx,900,y,150,g,"tests");chip(ctx,900,y-130,"dbt","tests","",{align:"center",edge:g});
  const sk=o.skip||0,lit=o.lit||0,dS=sk*(1-sstep(0.22,0.4,lit)),dG=sk*(1-sstep(0.55,0.72,lit));
  withA(ctx,1-0.65*dS,()=>{lane(ctx,[{x:930,y},{x:1000,y}],[214,228,255],0.6);vault(ctx,1000,y-150,240,300,LAYER.silver,(r,c)=>hash(r*7+c,3)<0.7?[214,228,255]:null,"Silver","consistent");});
  withA(ctx,1-0.65*dG,()=>{lane(ctx,[{x:1240,y},{x:1300,y}],GOLDC,0.6);vault(ctx,1300,y-150,240,300,LAYER.gold,(r,c)=>hash(r*5+c,2)<0.6?GOLDC:null,"Gold","class fill");lane(ctx,[{x:1540,y},{x:1600,y}],GOLDC,0.6);});
  kpiMini(ctx,1590,y-95,270,190,parseInt(o.num||"94"));
  if(dS>0)withA(ctx,dS,()=>tag(ctx,1120,y+182,"skipped",SOFT,{align:"center",size:17}));if(dG>0)withA(ctx,dG,()=>tag(ctx,1420,y+182,"skipped",SOFT,{align:"center",size:17}));
  if(o.banner>0)withA(ctx,o.banner,()=>tag(ctx,1725,y-150,"last good data · yesterday 23:02",AMBER,{align:"center",size:16}));}

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

/* ===== Keeping it true: the film's own pictures =====
   The meaning is written down end to end, then the world changes again. An AI agent watches and drafts, in teal: a geometric orb,
   unlike Genie's round one. A person's approval is gold (TRUST). Drift, the gap between what's written and what's used, is red (EDGE_).
   The past (Johnson's dictionary, the planets, the kilogram) is drawn warm, with the series' histBg; the present is the films' dark glass.
   The labs and the scenarios draw with these too (LV, at the end). */
const KT_AI=[130,230,215],KT_BLUE=[60,110,210],KT_PLAN=[120,190,255];
// the three dashboards that each count completion rate their own way, and the numbers they show
const KT_DASH=[{name:"Short courses",col:OFFICE.short.c,num:"71%",f:"completed ÷ enrolled at census date",v:"their own"},
  {name:"Planning",col:KT_PLAN,num:"64%",f:"completed ÷ all who started",v:"glossary v2"},
  {name:"Learning platform",col:OFFICE.lms.c,num:"58%",f:"finished all modules ÷ logged in",v:"v1, 2019"}];
// the change package the agent drafts: the layer, and one line of what changes in it
const KT_PKG=[["Glossary","completion rate v3","completed ÷ enrolled at census date"],["Ontology","revoked is not completed","a statement"],["Logical model","Enrolment + outcome","an attribute"],
  ["Mapping","outcome → gov. field","MC_OUTCOME"],["Semantic layer","completion_rate","one measure"],["Contract","outcome: 3 values","completed · withdrawn · enrolled"],
  ["Tests","revoked not counted","and 2025 unchanged"],["Change note","why","new field · 3 formulas"]];
// one change, end to end: each layer, and what it says about completion rate
const KT_CHAIN=[["Glossary","one definition"],["Ontology","one statement"],["Logical model","Enrolment.outcome"],["Write · read","both shapes"],["Semantic layer","one measure"],["Contract · test","one test"],["Dashboards · Genie","one number"]];

// when a word of a line is spoken: estimated along the line's voiced length, from the words the voice reads
function kt_w(sc,id,word,off){const ln=sc.vo.find(v=>v.id===id);if(!ln)return 0;const s=ln.say||ln.text,i=s.indexOf(word),d=sc.ends[id]-sc.cues[id];return sc.cues[id]+(i<0?0:d*i/s.length)+(off||0);}
const kt_out=(t,a,d)=>1-sstep(a,a+(d||0.6),t);

/* ---------- the agent: a teal, geometric orb (an icosahedron turning inside a hexagon) ---------- */
const KT_ICO=(()=>{const f=(1+Math.sqrt(5))/2,v=[];for(const a of[1,-1])for(const b of[1,-1])v.push([0,a,b*f],[a,b*f,0],[b*f,0,a]);
  const n=Math.hypot(1,f),V=v.map(p=>p.map(q=>q/n)),E=[];for(let i=0;i<12;i++)for(let j=i+1;j<12;j++){const d=Math.hypot(v[i][0]-v[j][0],v[i][1]-v[j][1],v[i][2]-v[j][2]);if(Math.abs(d-2)<0.01)E.push([i,j]);}return{V,E};})();
function kt_agent(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const busy=o.busy||0;
  withA(ctx,a,()=>{glow(ctx,x,y,r*2.4+Math.sin(t*1.7)*5,KT_AI,0.3+0.2*busy);
    ctx.save();ctx.strokeStyle=rgba(KT_AI,0.4);ctx.lineWidth=1.6;ctx.beginPath();for(let i=0;i<=6;i++){const an=i/6*TAU+t*0.15;ctx.lineTo(x+Math.cos(an)*r*1.45,y+Math.sin(an)*r*1.45);}ctx.stroke();
    for(let i=0;i<6;i++){const an=i/6*TAU+t*0.15;ctx.fillStyle=rgba(KT_AI,0.8);ctx.fillRect(x+Math.cos(an)*r*1.45-3,y+Math.sin(an)*r*1.45-3,6,6);}
    const ay=t*(0.45+busy*1.4)+(o.spin||0),ax=0.5,ca=Math.cos(ay),sa=Math.sin(ay),cb=Math.cos(ax),sb=Math.sin(ax);
    const P=KT_ICO.V.map(([px,py,pz])=>{const X=px*ca+pz*sa,Z0=-px*sa+pz*ca;return[x+X*r,y+(py*cb-Z0*sb)*r,py*sb+Z0*cb];});
    const g=ctx.createRadialGradient(x-r*0.35,y-r*0.35,r*0.1,x,y,r);g.addColorStop(0,rgba(mix(KT_AI,[255,255,255],0.55),0.45));g.addColorStop(1,rgba(KT_AI,0.05));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*0.98,0,TAU);ctx.fill();
    ctx.lineCap="round";ctx.shadowColor=rgba(KT_AI,0.8);ctx.shadowBlur=8;
    KT_ICO.E.map(e=>[e,(P[e[0]][2]+P[e[1]][2])/2]).sort((p,q)=>p[1]-q[1]).forEach(([[i,j],z])=>{const k=(z+1)/2;ctx.strokeStyle=rgba(mix(KT_AI,[255,255,255],0.3*k),0.22+0.72*k);ctx.lineWidth=(1+1.8*k)*Math.max(0.6,r/60);ctx.beginPath();ctx.moveTo(P[i][0],P[i][1]);ctx.lineTo(P[j][0],P[j][1]);ctx.stroke();});
    ctx.shadowBlur=0;P.forEach(p=>{const k=(p[2]+1)/2;ctx.fillStyle=rgba(mix(KT_AI,[255,255,255],0.5),0.3+0.7*k);ctx.beginPath();ctx.arc(p[0],p[1],(1.5+2.5*k)*Math.max(0.6,r/60),0,TAU);ctx.fill();});
    ctx.fillStyle=rgba(mix(KT_AI,[255,255,255],0.75),0.95);ctx.beginPath();ctx.arc(x,y,r*0.14*(1+0.2*Math.sin(t*3.1)),0,TAU);ctx.fill();ctx.restore();
    if(o.label)withA(ctx,o.labelA==null?1:o.labelA,()=>tag(ctx,x,y+r*1.45+34,o.label,KT_AI,{align:"center",size:18}));});}
// the agent reading something: a soft cone of light from the orb to its target, with a line sweeping across it
function kt_scan(ctx,x0,y0,x1,y1,a,t,o){if(a<=0.01)return;o=o||{};const an=Math.atan2(y1-y0,x1-x0),w=o.w||60,nx=Math.cos(an+Math.PI/2),ny=Math.sin(an+Math.PI/2);
  ctx.save();ctx.globalAlpha*=a;const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,rgba(KT_AI,0.28));g.addColorStop(1,rgba(KT_AI,0.05));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1+nx*w,y1+ny*w);ctx.lineTo(x1-nx*w,y1-ny*w);ctx.closePath();ctx.fill();
  const sw=Math.sin(t*2.4+(o.ph||0))*w*0.85;ctx.strokeStyle=rgba(KT_AI,0.85);ctx.lineWidth=2;ctx.shadowColor=rgba(KT_AI,0.9);ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1+nx*sw,y1+ny*sw);ctx.stroke();ctx.restore();}
// a small flag: the agent's mark on something that has drifted
function kt_flag(ctx,x,y,s,a){withA(ctx,a,()=>{ctx.strokeStyle=rgba(KT_AI,1);ctx.lineWidth=3*s;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y+18*s);ctx.lineTo(x,y-20*s);ctx.stroke();
  ctx.fillStyle=rgba(KT_AI,0.95);ctx.shadowColor=rgba(KT_AI,0.9);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(x,y-20*s);ctx.lineTo(x+24*s,y-12*s);ctx.lineTo(x,y-3*s);ctx.closePath();ctx.fill();ctx.shadowBlur=0;});}
// a gold tick in a ring: a person's approval
function kt_gtick(ctx,x,y,r,a){withA(ctx,a,()=>{glow(ctx,x,y,r*2.2,TRUST,0.35);ctx.fillStyle="rgba(26,20,8,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,TRUST,1,2.5);tick_(ctx,x,y+1,r*1.25,TRUST,1);});}
function kt_rcross(ctx,x,y,r,a){withA(ctx,a,()=>{glow(ctx,x,y,r*2.2,BAD,0.3);ctx.fillStyle="rgba(30,8,10,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,BAD,1,2.5);cross_(ctx,x,y,r*1.2,BAD,1);});}
// a rubber stamp, pressed at an angle: press (0..1) brings it down from above
function kt_rstamp(ctx,x,y,s,col,a,press,o){if(a<=0.01)return;o=o||{};const sz=o.size||30,w=tw(ctx,s,sz,800)+40,h=sz+30,pr=ease(clamp(press==null?1:press,0,1));
  withA(ctx,a*pr,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(o.rot==null?-0.12:o.rot);ctx.scale(1.5-0.5*pr,1.5-0.5*pr);ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;rr(ctx,-w/2,-h/2,w,h,8);ctx.stroke();
    ctx.lineWidth=1.5;rr(ctx,-w/2+6,-h/2+6,w-12,h-12,5);ctx.stroke();ctx.shadowBlur=0;T(ctx,s,0,sz*0.36,{w:800,size:sz,align:"center",color:rgba(col,1)});ctx.restore();});}

/* ---------- the past: drawn organically (soft curves, light and shadow, grain, and always a little motion) ---------- */
// a sheet of paper whose edges aren't quite straight, lit from the upper left, with fibres in it and a corner that lifts and settles
function kt_paper(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sd=o.seed||1,base=o.col||[239,230,210],cu=(o.curl==null?1:o.curl)*(0.55+0.45*Math.sin(t*0.9+sd))*Math.min(w,h)*0.08;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);
    const edge=(x0,y0,x1,y1,k)=>{const n=4,nx=-(y1-y0),ny=x1-x0,L=Math.hypot(nx,ny)||1;for(let i=1;i<=n;i++){const um=(i-0.5)/n,u1=i/n,b=(hash(sd*7+k*5+i,3)-0.5)*3.4;ctx.quadraticCurveTo(lerp(x0,x1,um)+nx/L*b,lerp(y0,y1,um)+ny/L*b,lerp(x0,x1,u1),lerp(y0,y1,u1));}};
    const path=()=>{ctx.beginPath();ctx.moveTo(0,0);edge(0,0,w,0,0);edge(w,0,w,h-cu,1);ctx.quadraticCurveTo(w-cu*0.35,h-cu*0.35,w-cu,h);edge(w-cu,h,0,h,2);edge(0,h,0,0,3);ctx.closePath();};
    ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=28;ctx.shadowOffsetY=10;path();ctx.fillStyle=rgba(base,1);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,252,240,0.5)");g.addColorStop(0.55,"rgba(255,250,235,0)");g.addColorStop(1,"rgba(90,66,36,0.24)");path();ctx.fillStyle=g;ctx.fill();
    ctx.save();path();ctx.clip();const n=Math.min(160,Math.floor(w*h/1700));for(let i=0;i<n;i++){const px=hash(i+sd*31,2)*w,py=hash(i+sd*31,5)*h,l=2+hash(i,7)*7,an=hash(i+sd,9)*Math.PI;ctx.strokeStyle="rgba(120,92,56,"+(0.05+0.08*hash(i,11))+")";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px+Math.cos(an+0.4)*l*0.6,py+Math.sin(an+0.4)*l*0.6,px+Math.cos(an)*l,py+Math.sin(an)*l);ctx.stroke();}
    const r=ctx.createRadialGradient(w*0.45,h*0.4,Math.min(w,h)*0.25,w/2,h/2,Math.max(w,h)*0.75);r.addColorStop(0,"rgba(0,0,0,0)");r.addColorStop(1,"rgba(110,78,40,"+(o.age==null?0.14:o.age)+")");ctx.fillStyle=r;ctx.fillRect(0,0,w,h);ctx.restore();
    if(cu>0.8){ctx.beginPath();ctx.moveTo(w,h-cu);ctx.quadraticCurveTo(w-cu*0.35,h-cu*0.35,w-cu,h);ctx.quadraticCurveTo(w-cu*0.8,h-cu*0.6,w-cu*0.92,h-cu*0.92);ctx.quadraticCurveTo(w-cu*0.6,h-cu*0.8,w,h-cu);ctx.closePath();
      const fg=ctx.createLinearGradient(w,h,w-cu,h-cu);fg.addColorStop(0,rgba(mix(base,[255,255,255],0.35),1));fg.addColorStop(1,rgba(mix(base,[120,90,50],0.2),1));ctx.fillStyle=fg;ctx.fill();ctx.strokeStyle="rgba(110,84,50,0.3)";ctx.lineWidth=1;ctx.stroke();}
    ctx.restore();});}
const KT_WORDS=[[["CREDENTIAL",3],["CREDIT",4]],[["DEAN",3],["DEGREE",4]],[["DIPLOMA",4],["ENROL",3]],[["NICE",5],["STUDENT",3]]];
// a heavy book: closed (a leather cover with a rounded spine, gilt, its page block showing its weight), or open on two curved pages of entries
function kt_book(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a,op=clamp(o.open||0,0,1);if(a<=0.01)return;
  withA(ctx,a,()=>{
    if(op<1)withA(ctx,1-op,()=>{const bw=w*0.5,bx=x+w*0.25,s=w/800;
      // the page block, seen at the fore-edge and the foot: curved, cream, with fine lines
      ctx.save();ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=30*s;ctx.shadowOffsetY=12*s;ctx.fillStyle="#d9c7a0";ctx.beginPath();ctx.moveTo(bx+10*s,y+h);ctx.quadraticCurveTo(bx+bw*0.5,y+h+22*s,bx+bw+14*s,y+h+10*s);ctx.lineTo(bx+bw+16*s,y+12*s);ctx.quadraticCurveTo(bx+bw+6*s,y,bx+bw-8*s,y+6*s);ctx.closePath();ctx.fill();ctx.restore();
      ctx.strokeStyle="rgba(150,120,80,0.45)";ctx.lineWidth=1;for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(bx+20*s,y+h+i*2.6*s);ctx.quadraticCurveTo(bx+bw*0.5,y+h+(4+i*3.4)*s,bx+bw+(4+i*2)*s,y+h+(2+i*1.4)*s);ctx.stroke();ctx.beginPath();ctx.moveTo(bx+bw+(2+i*2.4)*s,y+h);ctx.lineTo(bx+bw+(2+i*2.4)*s,y+14*s);ctx.stroke();}
      // the cover: leather, lit from the upper left, with a rounded spine on the left and a little wear
      const cover=()=>{ctx.beginPath();ctx.moveTo(bx+14*s,y);ctx.lineTo(bx+bw-10*s,y);ctx.quadraticCurveTo(bx+bw,y,bx+bw,y+10*s);ctx.lineTo(bx+bw,y+h-10*s);ctx.quadraticCurveTo(bx+bw,y+h,bx+bw-10*s,y+h);ctx.lineTo(bx+14*s,y+h);ctx.bezierCurveTo(bx-8*s,y+h-4*s,bx-8*s,y+4*s,bx+14*s,y);ctx.closePath();};
      const g=ctx.createLinearGradient(bx,y,bx+bw,y+h);g.addColorStop(0,"#7a4629");g.addColorStop(0.5,"#55301b");g.addColorStop(1,"#2e170c");cover();ctx.fillStyle=g;ctx.fill();
      ctx.save();cover();ctx.clip();for(let i=0;i<120;i++){const px=bx+hash(i,21)*bw,py=y+hash(i,22)*h,r=(0.6+hash(i,23)*1.6)*s;ctx.fillStyle=hash(i,24)>0.5?"rgba(20,8,2,0.25)":"rgba(160,110,70,0.12)";ctx.beginPath();ctx.ellipse(px,py,r*1.6,r,hash(i,25)*3,0,TAU);ctx.fill();}
        const sp=ctx.createLinearGradient(bx-4*s,0,bx+34*s,0);sp.addColorStop(0,"rgba(0,0,0,0.35)");sp.addColorStop(0.45,"rgba(255,210,160,0.16)");sp.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sp;ctx.fillRect(bx-10*s,y,50*s,h);
        const sh=ctx.createRadialGradient(bx+bw*(0.3+0.1*Math.sin(t*0.4)),y+h*0.25,10,bx+bw*0.4,y+h*0.35,bw*0.9);sh.addColorStop(0,"rgba(255,220,170,0.14)");sh.addColorStop(1,"rgba(255,220,170,0)");ctx.fillStyle=sh;ctx.fillRect(bx,y,bw,h);ctx.restore();
      ctx.strokeStyle="rgba(222,178,98,0.85)";ctx.lineWidth=3*s;rr(ctx,bx+30*s,y+18*s,bw-48*s,h-36*s,6*s);ctx.stroke();ctx.lineWidth=1.2*s;rr(ctx,bx+40*s,y+28*s,bw-68*s,h-56*s,4*s);ctx.stroke();
      [0.2,0.8].forEach(fy=>{ctx.strokeStyle="rgba(222,178,98,0.6)";ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(bx+2*s,y+h*fy);ctx.quadraticCurveTo(bx+12*s,y+h*fy-4*s,bx+22*s,y+h*fy);ctx.stroke();});
      const gold="rgba(232,192,112,0.95)";[["A",0.24,22],["DICTIONARY",0.33,30],["OF THE",0.42,18],["ENGLISH",0.5,26],["LANGUAGE",0.58,26],["SAMUEL JOHNSON",0.74,17],["1755",0.82,17]].forEach(([q,fy,sz])=>T(ctx,q,bx+bw/2+6*s,y+h*fy,{w:800,size:sz*s,align:"center",color:gold}));});
    if(op>0)withA(ctx,op,()=>{const gx=x+w/2;
      // the boards under the pages
      ctx.save();ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=34;ctx.shadowOffsetY=12;const bg=ctx.createLinearGradient(x,y,x+w,y+h);bg.addColorStop(0,"#6a3a22");bg.addColorStop(1,"#3a1d0f");ctx.fillStyle=bg;ctx.beginPath();ctx.moveTo(x-14,y-4);ctx.quadraticCurveTo(gx,y+10,x+w+14,y-4);ctx.lineTo(x+w+14,y+h+14);ctx.quadraticCurveTo(gx,y+h+26,x-14,y+h+14);ctx.closePath();ctx.fill();ctx.restore();
      // two pages that curve down into the gutter, light at the outer edge and shadowed at the fold; the right page's corner lifts a little
      [0,1].forEach(side=>{const ox=side?x+w:x,dir=side?-1:1,lift=side?(5+4*Math.sin(t*1.1)):0;
        const page=()=>{ctx.beginPath();ctx.moveTo(ox,y+6-lift*0.4);ctx.bezierCurveTo(ox+dir*w*0.2,y-6,gx-dir*w*0.12,y+2,gx,y+18);ctx.lineTo(gx,y+h-4);ctx.bezierCurveTo(gx-dir*w*0.12,y+h+6,ox+dir*w*0.2,y+h+14,ox+dir*2,y+h+6);ctx.quadraticCurveTo(ox-dir*3,y+h/2,ox,y+6-lift*0.4);ctx.closePath();};
        const g=ctx.createLinearGradient(ox,y,gx,y);g.addColorStop(0,"#f3e9d1");g.addColorStop(0.7,"#ead9b6");g.addColorStop(1,"#c2aa7c");page();ctx.fillStyle=g;ctx.fill();
        ctx.save();page();ctx.clip();
        for(let i=0;i<90;i++){const px=Math.min(ox,gx)+hash(i+side*97,2)*w/2,py=y+hash(i+side*97,5)*h,l=2+hash(i,7)*6,an=hash(i+side,9)*Math.PI;ctx.strokeStyle="rgba(120,92,56,"+(0.05+0.07*hash(i,11))+")";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+Math.cos(an)*l,py+Math.sin(an)*l);ctx.stroke();}
        // two columns of entries: a headword, then its definition as lines of type that bend with the page
        const cw=w/4-40;[0,1].forEach(col=>{let yy=y+58;const cx0=Math.min(ox,gx)+(side?44:28)+col*(w/4-10),line=(lx,ly,lw)=>{const bend=(side?1:-1)*0.02;ctx.strokeStyle="rgba(80,64,46,0.32)";ctx.lineWidth=4.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(lx,ly);ctx.quadraticCurveTo(lx+lw/2,ly+lw*bend,lx+lw,ly+lw*bend*1.5);ctx.stroke();};
          KT_WORDS[side*2+col].forEach(([hw,n],k)=>{const hi=o.hi===hw,hwW=tw(ctx,hw,15,800);T(ctx,hw,cx0,yy,{w:800,size:15,color:hi?"rgba(150,70,20,1)":"rgba(52,40,30,0.95)"});
            for(let q=0;q<n*2+2;q++)line(q?cx0:cx0+hwW+8,yy-7+q*15,Math.max(10,(q?cw:cw-hwW-8)*(q===n*2+1?0.5:0.85+0.15*hash(k*9+q+side*31+col*7,3))));yy+=(n*2+2)*15+26;});
          // the column runs on to the foot of the page
          for(let q=0;yy+q*15<y+h-26;q++)line(cx0,yy-7+q*15,cw*(0.8+0.2*hash(q+col*17+side*41,4)));});
        const gs=ctx.createLinearGradient(gx-dir*60,0,gx,0);gs.addColorStop(0,"rgba(80,50,20,0)");gs.addColorStop(1,"rgba(80,50,20,0.35)");ctx.fillStyle=gs;ctx.fillRect(Math.min(gx,gx-dir*60),y-10,60,h+30);ctx.restore();
        ctx.strokeStyle="rgba(120,90,50,0.35)";ctx.lineWidth=1.2;page();ctx.stroke();});
      // letters lifting off the page: a language won't stay pinned down
      const dr=o.drift||0;if(dr>0)for(let i=0;i<34;i++){const u=((t*0.22+hash(i,4))%1),px=x+30+hash(i,2)*(w-60),py=y+60+hash(i,3)*(h-90),ch="aeinorstlcdumphgbfywkv"[i%22],sw=Math.sin(t*1.3+i)*14;
        withA(ctx,dr*Math.sin(Math.PI*u)*0.9,()=>{ctx.save();ctx.translate(px+u*120*(hash(i,5)-0.3)+sw*u,py-u*220);ctx.rotate((hash(i,8)-0.5)*u*2);T(ctx,ch,0,0,{w:700,size:16+hash(i,6)*10,color:"rgba(90,64,40,1)"});ctx.restore();});}});});}
// a padlock over the page: fixing the language in place; open (0..1) lifts its shackle
function kt_lock(ctx,x,y,s,col,a,open){withA(ctx,a,()=>{const u=ease(clamp(open||0,0,1));ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const sg=ctx.createLinearGradient(-26,0,26,0);sg.addColorStop(0,rgba(mix(col,[80,50,20],0.4),1));sg.addColorStop(0.4,rgba(mix(col,[255,255,255],0.4),1));sg.addColorStop(1,rgba(mix(col,[80,50,20],0.5),1));
  ctx.strokeStyle=sg;ctx.lineWidth=8;ctx.lineCap="round";ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(-22,-2);ctx.lineTo(-22,-22-u*22);ctx.bezierCurveTo(-22,-54-u*22,22,-54-u*22,22,-22-u*22);ctx.lineTo(22,-22-u*22+(u>0.3?0:18));ctx.stroke();ctx.shadowBlur=0;
  const bg=ctx.createLinearGradient(-34,-6,34,46);bg.addColorStop(0,rgba(mix(col,[255,255,255],0.3),1));bg.addColorStop(0.5,rgba(col,1));bg.addColorStop(1,rgba(mix(col,[60,30,10],0.55),1));ctx.fillStyle=bg;ctx.beginPath();ctx.moveTo(-30,-6);ctx.quadraticCurveTo(0,-10,30,-6);ctx.quadraticCurveTo(36,20,30,46);ctx.quadraticCurveTo(0,52,-30,46);ctx.quadraticCurveTo(-36,20,-30,-6);ctx.fill();
  ctx.fillStyle="rgba(40,24,10,0.9)";ctx.beginPath();ctx.arc(0,14,6,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-3,16);ctx.lineTo(3,16);ctx.lineTo(4,32);ctx.lineTo(-4,32);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(255,255,255,0.3)";ctx.beginPath();ctx.ellipse(-14,4,5,12,0.3,0,TAU);ctx.fill();ctx.restore();});}
// the Oxford English Dictionary: a modern page of entries (paraphrased), with an editor's revisions in blue pencil (p reveals them):
// "on paper" struck out and "digital, too" written in above a caret, "a unit of study" circled, and a new sense added to "curriculum"
function kt_oed(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a,p=o.p||0;if(a<=0.01)return;withA(ctx,a,()=>{
  [2,1].forEach(k=>{ctx.save();ctx.translate(x+w/2+k*7,y+h/2+k*6);ctx.rotate(0.018*k);kt_paper(ctx,-w/2,-h/2,w,h,t,{seed:k+4,col:k===2?[222,215,200]:[232,226,214],curl:0,age:0.1});ctx.restore();});
  kt_paper(ctx,x,y,w,h,t,{seed:3,col:[246,242,233],age:0.08});
  T(ctx,"OXFORD ENGLISH DICTIONARY",x+w/2,y+36,{w:800,size:14,align:"center",color:"rgba(40,50,70,0.7)"});ctx.fillStyle="rgba(40,50,70,0.25)";ctx.fillRect(x+30,y+48,w-60,1.5);
  const ink="rgba(34,36,44,0.95)",gray="rgba(52,56,68,0.82)",blue=rgba(KT_BLUE,1),rev=k=>fin(p,k*0.18,0.2),L=x+34,S=17;
  const pencil=(pts,lw)=>{ctx.strokeStyle=blue;ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length-1;i++)ctx.quadraticCurveTo(pts[i][0],pts[i][1],(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2);const E=pts[pts.length-1];ctx.lineTo(E[0],E[1]);ctx.stroke();};
  const head=(s,yy)=>T(ctx,s,x+30,yy,{w:800,size:24,color:ink});
  const sense=(s,yy)=>T(ctx,s,L,yy,{w:500,size:S,color:gray});
  const bars=(yy,n,sd)=>{for(let k=0;k<n;k++){ctx.fillStyle="rgba(60,64,76,0.26)";ctx.fillRect(L,yy+k*16-5,(w-68)*(0.6+0.35*hash(sd*5+k,7)),5);}};
  // credential: sense 2 ends "on paper"; the editor strikes it and writes "digital, too" above a caret
  let yy=y+90;head("credential, n.",yy);
  sense("1. a letter or paper that vouches for its bearer",yy+30);
  const s2="2. evidence of what someone has learned, ",s2b="on paper",wA=tw(ctx,s2,S,500),wB=tw(ctx,s2b,S,500),l2=yy+74;
  sense(s2+s2b,l2);
  const r0=rev(0);if(r0>0){const x0=L+wA-3,x1=x0+(wB+6)*r0;pencil([[x0,l2-6],[lerp(x0,x1,0.35),l2-7.5],[lerp(x0,x1,0.7),l2-4.5],[x1,l2-6.5]],3);}
  withA(ctx,rev(1),()=>{const cx=L+wA+wB+10;pencil([[cx-6,l2+6],[cx,l2-4],[cx+6,l2+6]],2.5);T(ctx,"digital, too",cx,l2-26,{w:700,size:21,align:"center",color:blue});});
  bars(l2+22,2,1);
  // credit: the editor circles "a unit of study"
  yy=l2+84;head("credit, n.",yy);
  sense("1. belief in what someone says; trust",yy+30);
  const c1="2.",c2="a unit of study",c3="counted toward a qualification",G=18,wc1=tw(ctx,c1,S,500),wc2=tw(ctx,c2,S,500),l3=yy+58;
  sense(c1,l3);T(ctx,c2,L+wc1+G,l3,{w:500,size:S,color:gray});T(ctx,c3,L+wc1+wc2+2*G,l3,{w:500,size:S,color:gray});
  withA(ctx,rev(2),()=>{const cx=L+wc1+G+wc2/2,cy=l3-5,rx=wc2/2+12,ry=15,q=clamp(rev(2)*1.2,0,1);ctx.strokeStyle=blue;ctx.lineWidth=2.5;ctx.lineCap="round";ctx.beginPath();
    for(let k=0;k<=48*q;k++){const an=-2.4+k/48*TAU*1.04,rr=1+0.03*Math.sin(k*0.9);ctx.lineTo(cx+Math.cos(an)*rx*rr,cy+Math.sin(an)*ry*rr+k*0.04);}ctx.stroke();});
  bars(l3+22,2,2);
  // curriculum: a new sense, written in and highlighted
  yy=l3+84;head("curriculum, n.",yy);
  sense("1. the subjects that make up a course of study",yy+30);
  const l4=yy+56;bars(l4,1,3);const l5=l4+30;
  withA(ctx,rev(3),()=>{ctx.fillStyle=rgba(KT_BLUE,0.1);ctx.beginPath();ctx.moveTo(L-10,l5-24);ctx.quadraticCurveTo(x+w/2,l5-28,x+w-30,l5-23);ctx.quadraticCurveTo(x+w-24,l5-6,x+w-30,l5+11);ctx.quadraticCurveTo(x+w/2,l5+15,L-10,l5+10);ctx.quadraticCurveTo(L-15,l5-7,L-10,l5-24);ctx.fill();
    T(ctx,"3. a pathway of short, stackable courses",L,l5,{w:700,size:S+1,color:blue});T(ctx,"new sense",x+w-38,l5-34,{w:700,size:18,align:"right",color:blue});});
  // in the margin, beside the page's revisions
  withA(ctx,rev(1.5),()=>{ctx.save();ctx.translate(x+w-18,y+150);ctx.rotate(-Math.PI/2);T(ctx,"revised",0,0,{w:700,size:18,align:"center",color:blue});ctx.restore();});});}
// the solar system: a glowing sun, and nine bodies on their orbits, each lit on the side that faces the sun; Pluto's orbit is tilted and off-centre
const KT_PLANETS=[["Mercury",[200,180,160],5],["Venus",[240,210,150],7],["Earth",[110,170,240],7],["Mars",[230,120,80],6],["Jupiter",[230,190,140],14],["Saturn",[235,210,150],12],["Uranus",[160,220,230],10],["Neptune",[100,140,240],10],["Pluto",[210,190,170],4]];
function kt_body(ctx,px,py,r,col,lx,ly,o){o=o||{};const L=Math.hypot(lx,ly)||1,dx=lx/L,dy=ly/L;glow(ctx,px,py,r*2.4,col,0.35);
  if(o.ring){ctx.save();ctx.strokeStyle=rgba(mix(col,[255,255,255],0.3),0.7);ctx.lineWidth=r*0.35;ctx.beginPath();ctx.ellipse(px,py,r*2.1,r*0.6,-0.3,Math.PI,TAU);ctx.stroke();ctx.restore();}
  const g=ctx.createRadialGradient(px+dx*r*0.45,py+dy*r*0.45,r*0.1,px,py,r*1.05);g.addColorStop(0,rgba(mix(col,[255,255,255],0.45),1));g.addColorStop(0.6,rgba(col,1));g.addColorStop(1,rgba(mix(col,[10,10,20],0.7),1));ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill();
  if(o.bands){ctx.save();ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.clip();ctx.strokeStyle=rgba(mix(col,[120,70,40],0.4),0.45);ctx.lineWidth=r*0.14;[-0.4,0.05,0.45].forEach(k=>{ctx.beginPath();ctx.moveTo(px-r,py+k*r);ctx.quadraticCurveTo(px,py+k*r+r*0.12,px+r,py+k*r);ctx.stroke();});ctx.restore();}
  if(o.ring){ctx.save();ctx.strokeStyle=rgba(mix(col,[255,255,255],0.3),0.85);ctx.lineWidth=r*0.35;ctx.beginPath();ctx.ellipse(px,py,r*2.1,r*0.6,-0.3,0,Math.PI);ctx.stroke();ctx.restore();}}
function kt_sky(ctx,cx,cy,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sc=o.s||1;withA(ctx,a,()=>{
  for(let k=0;k<3;k++)glow(ctx,cx,cy,(70+k*40+6*Math.sin(t*1.3+k))*sc,[255,190-k*20,100],0.55-k*0.12);
  const sg=ctx.createRadialGradient(cx-8*sc,cy-8*sc,2,cx,cy,28*sc);sg.addColorStop(0,"#fffbe8");sg.addColorStop(0.6,"#ffe19a");sg.addColorStop(1,"#ffb45a");ctx.fillStyle=sg;ctx.beginPath();for(let q=0;q<=36;q++){const an=q/36*TAU,rr_=26*sc*(1+0.03*Math.sin(an*5+t*2));ctx.lineTo(cx+Math.cos(an)*rr_,cy+Math.sin(an)*rr_);}ctx.fill();
  KT_PLANETS.forEach(([n,col,r],i)=>{const rx=(110+i*108)*sc,ry=rx*0.24,pl=i===8,ox=pl?40*sc:0,rot=pl?0.09:0;ctx.save();ctx.translate(cx+ox,cy);ctx.rotate(rot);ctx.strokeStyle=rgba(pl?[200,190,180]:[230,220,200],pl?0.22:0.16);ctx.lineWidth=1.2;if(pl)ctx.setLineDash([6,6]);ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,TAU);ctx.stroke();ctx.setLineDash([]);
    const an=pl?0.32+t*0.01:(o.ang||0.6)+t*0.5/Math.pow(i+1,1.1)+i*1.9,px=Math.cos(an)*rx,py=Math.sin(an)*ry;kt_body(ctx,px,py,r*sc*1.15,col,-px-ox,-py,{ring:i===5,bands:i===4});
    if(pl&&o.dwarf)withA(ctx,o.dwarf,()=>tag(ctx,px,py-40,"dwarf planet",CLAY,{align:"center",size:19}));ctx.restore();});});}
// the kilogram, 1889 to 2019: a metal cylinder under a glass bell jar, on a wooden base; light slides slowly over the metal and the glass
function kt_kilo(ctx,x,y,s,a,t){t=t||0;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const wb=ctx.createLinearGradient(0,66,0,96);wb.addColorStop(0,"#8a5a36");wb.addColorStop(1,"#3e2414");ctx.fillStyle=wb;ctx.beginPath();ctx.moveTo(-112,74);ctx.quadraticCurveTo(0,62,112,74);ctx.quadraticCurveTo(118,86,108,94);ctx.quadraticCurveTo(0,102,-108,94);ctx.quadraticCurveTo(-118,86,-112,74);ctx.fill();
  ctx.strokeStyle="rgba(40,20,8,0.35)";ctx.lineWidth=1;[80,86].forEach(yy=>{ctx.beginPath();ctx.moveTo(-100,yy);ctx.bezierCurveTo(-40,yy-3,30,yy+3,100,yy-1);ctx.stroke();});
  ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.ellipse(0,72,52,8,0,0,TAU);ctx.fill();
  const m=ctx.createLinearGradient(-40,0,40,0),gl=0.3+0.25*Math.sin(t*0.6);m.addColorStop(0,"#6e6b66");m.addColorStop(Math.max(0.05,gl-0.12),"#b9b5ad");m.addColorStop(gl,"#fbf9f4");m.addColorStop(Math.min(0.95,gl+0.14),"#c4c0b7");m.addColorStop(1,"#5f5c57");
  ctx.fillStyle=m;ctx.beginPath();ctx.moveTo(-40,-10);ctx.lineTo(-40,68);ctx.bezierCurveTo(-40,80,40,80,40,68);ctx.lineTo(40,-10);ctx.closePath();ctx.fill();
  const tp=ctx.createLinearGradient(-40,-18,40,-2);tp.addColorStop(0,"#d8d4cc");tp.addColorStop(gl,"#ffffff");tp.addColorStop(1,"#b5b1a8");ctx.fillStyle=tp;ctx.beginPath();ctx.ellipse(0,-10,40,9,0,0,TAU);ctx.fill();
  // the glass jar: a soft body of light, its edge brighter where it turns, and a highlight that drifts
  ctx.beginPath();ctx.moveTo(-90,72);ctx.bezierCurveTo(-92,20,-94,-40,-88,-70);ctx.bezierCurveTo(-78,-148,78,-148,88,-70);ctx.bezierCurveTo(94,-40,92,20,90,72);
  ctx.fillStyle="rgba(210,230,255,0.06)";ctx.fill();ctx.strokeStyle="rgba(210,230,255,0.5)";ctx.lineWidth=2.5;ctx.stroke();
  const hx=-66+6*Math.sin(t*0.5);ctx.strokeStyle="rgba(255,255,255,0.42)";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(hx,36);ctx.bezierCurveTo(hx-4,-10,hx-2,-60,hx+30,-112);ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.18)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(70,30);ctx.bezierCurveTo(76,-10,74,-50,60,-90);ctx.stroke();
  const kb=ctx.createRadialGradient(-3,-136,1,0,-133,10);kb.addColorStop(0,"rgba(255,255,255,0.9)");kb.addColorStop(1,"rgba(170,200,240,0.5)");ctx.fillStyle=kb;ctx.beginPath();ctx.arc(0,-133,9,0,TAU);ctx.fill();ctx.restore();});}
// the Planck constant, written with a raised exponent
function kt_planck(ctx,x,y,sz,col){const a="h = 6.626 070 15 × 10",b="−34",c=" J s",wa=tw(ctx,a,sz,700,"mono"),wb=tw(ctx,b,sz*0.6,700,"mono"),wc=tw(ctx,c,sz,700,"mono"),x0=x-(wa+wb+wc)/2;
  T(ctx,a,x0,y,{f:"mono",w:700,size:sz,color:col});T(ctx,b,x0+wa+2,y-sz*0.45,{f:"mono",w:700,size:sz*0.6,color:col});T(ctx,c,x0+wa+wb+4,y,{f:"mono",w:700,size:sz,color:col});}
// a parchment list of names, some struck through by hand
function kt_list(ctx,x,y,w,title,items,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||50,t=o.t||0;if(a<=0.01)return;withA(ctx,a,()=>{const h=80+items.length*rh+(o.foot||0);kt_paper(ctx,x,y,w,h,t,{seed:9,col:[236,226,202]});
  T(ctx,title,x+30,y+50,{w:800,size:26,color:"rgba(60,44,30,0.95)"});ctx.strokeStyle="rgba(120,90,50,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,y+64);ctx.quadraticCurveTo(x+w/2,y+62,x+w-30,y+65);ctx.stroke();
  items.forEach((s,i)=>{const yy=y+80+i*rh+rh*0.62,st=(o.strike||{})[i]||0;T(ctx,s,x+44,yy,{w:600,size:24,color:st>0.5?"rgba(60,44,30,0.5)":"rgba(52,40,30,0.95)"});
    if(st>0){const sw=(tw(ctx,s,24,600)+14)*st;ctx.strokeStyle=rgba([180,48,36],0.95);ctx.lineCap="round";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+38,yy-7);ctx.bezierCurveTo(x+38+sw*0.3,yy-11,x+38+sw*0.6,yy-5,x+38+sw,yy-10);ctx.stroke();}});});}

/* ---------- the present: the calendar, the government's form, the dashboards ---------- */
function kt_cal(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const cw=(w-40)/7,rh=52,h=130+5*rh;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[170,205,255],{glow:12,ea:0.5,fill:"rgba(8,14,28,0.92)"});
  T(ctx,o.month||"October 2026",x+24,y+48,{w:800,size:28});"MTWTFSS".split("").forEach((d,i)=>T(ctx,d,x+20+cw*(i+0.5),y+92,{w:700,size:16,align:"center",color:rgba(SOFT,0.9)}));
  const first=3;for(let d=1;d<=31;d++){const k=first+d-1,cx=x+20+cw*((k%7)+0.5),cy=y+130+Math.floor(k/7)*rh,m=(o.marks||[]).find(q=>q.d===d);
    if(m&&m.a>0)withA(ctx,m.a,()=>{glow(ctx,cx,cy-6,34,m.col,0.35);ctx.fillStyle=rgba(m.col,0.22);ctx.beginPath();ctx.arc(cx,cy-6,21,0,TAU);ctx.fill();ring(ctx,cx,cy-6,21,m.col,1,2.5);});
    T(ctx,String(d),cx,cy,{w:m&&m.a>0.5?800:600,size:18,align:"center",color:m&&m.a>0.5?rgba(m.col,1):rgba(INK,0.75)});}
  if(o.today!=null){const k=first+o.today-1,cx=x+20+cw*((k%7)+0.5),cy=y+130+Math.floor(k/7)*rh;ctx.strokeStyle=rgba(INK,0.5);ctx.lineWidth=1.5;rr(ctx,cx-cw/2+3,cy-30,cw-6,40,8);ctx.stroke();}});return h;}
// the government's reporting form for microcredentials, with a new field
function kt_form(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const F=["Provider code","Microcredential code","Learner ID","Volume of learning (hours)"],rh=52,h=112+(F.length+1)*rh+12;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[200,215,240],{glow:14,ea:0.55,fill:"rgba(8,14,28,0.94)"});ctx.fillStyle="rgba(200,215,240,0.12)";rr(ctx,x+2,y+2,w-4,62,16);ctx.fill();
    T(ctx,"Government",x+24,y+30,{w:700,size:15,color:rgba(SOFT,1)});T(ctx,"Microcredential report · 2027",x+24,y+54,{w:800,size:21});
    F.forEach((f,i)=>{const yy=y+100+i*rh;T(ctx,f,x+24,yy,{w:600,size:16,color:rgba(SOFT,1)});ctx.strokeStyle="rgba(170,200,245,0.35)";ctx.lineWidth=1.5;rr(ctx,x+24,yy+8,w-48,26,6);ctx.stroke();});
    const hi=o.hi||0,yy=y+100+F.length*rh;withA(ctx,0.3+0.7*hi,()=>{ctx.fillStyle=rgba(AMBER,0.14*hi);rr(ctx,x+12,yy-24,w-24,rh+14,10);ctx.fill();ctx.strokeStyle=rgba(AMBER,0.9);ctx.lineWidth=2.5;rr(ctx,x+12,yy-24,w-24,rh+14,10);ctx.stroke();
      T(ctx,"Outcome",x+24,yy,{w:800,size:17,color:rgba(AMBER,1)});T(ctx,"completed · withdrawn · enrolled",x+24,yy+30,{f:"mono",w:500,size:18,color:rgba(INK,0.9)});});
    if(hi>0.5)withA(ctx,fin(hi,0.5,0.5),()=>tag(ctx,x+w-80,yy-6,"new",AMBER,{align:"center",size:16}));});return h;}
// a dashboard, in the style of Silent change's (a light canvas in a dark bezel): one number, its name, and optionally its formula
function kt_dash(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[7,122,157],s=h/230,hi=o.hi||0;
  withA(ctx,a,()=>{if(hi>0)glow(ctx,x+w/2,y+h/2,w*0.7,o.hiCol||col,0.3*hi);glass(ctx,x-8,y-8,w+16,h+16,16,o.edge||[170,205,255],{glow:10+14*hi,ea:0.4+0.5*hi,fill:"rgba(8,14,28,0.95)"});
    ctx.save();rr(ctx,x,y,w,h,10);ctx.clip();ctx.fillStyle=DB.canvas;ctx.fillRect(x,y,w,h);ctx.fillStyle=DB.card;ctx.fillRect(x,y,w,46*s);ctx.fillStyle=rgba(col,1);ctx.fillRect(x,y,7*s,46*s);ctx.fillStyle=DB.line;ctx.fillRect(x,y+46*s,w,1.2);
    T(ctx,o.name||"Dashboard",x+20*s,y+30*s,{w:700,size:18*s,color:DB.text});
    T(ctx,o.title||"Completion rate",x+20*s,y+82*s,{w:600,size:18*s,color:DB.muted});
    T(ctx,o.num||"71%",x+18*s,y+152*s,{w:800,size:62*s,color:o.numCol||DB.text});
    if(o.formula)withA(ctx,o.fA==null?1:o.fA,()=>{T(ctx,o.formula,x+20*s,y+h-22*s,{f:"mono",w:500,size:Math.min(18,(w-40*s)/o.formula.length*1.62),color:o.fCol||DB.muted});});
    else{const v=parseFloat(o.num)||0,bw=w-40*s;ctx.fillStyle=DB.track;rr(ctx,x+20*s,y+h-34*s,bw,12*s,6*s);ctx.fill();ctx.fillStyle=rgba(col,1);rr(ctx,x+20*s,y+h-34*s,bw*v/100,12*s,6*s);ctx.fill();}
    ctx.restore();if(o.flag)kt_flag(ctx,x+w-26,y-4,1,o.flag);});}
// a glossary entry: the term, its version and owner, and its definition (lines given, so a phrase can be highlighted)
function kt_gloss(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const L=o.lines||[],h=o.h||(140+L.length*38);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,o.edge||KIND,{glow:14+10*(o.glow||0),ea:0.75,fill:"rgba(7,12,24,0.94)"});T(ctx,o.kind||"Glossary",x+24,y+34,{w:700,size:16,color:rgba(o.edge||KIND,1)});
    T(ctx,o.term||"completion rate",x+24,y+74,{w:800,size:30});if(o.ver)stamp(ctx,x+w-20,y+38,o.ver,o.verCol||KIND,1,o.flick||0);
    L.forEach((l,i)=>{const yy=y+120+i*38;T(ctx,l,x+24,yy,{w:600,size:22,color:rgba(INK,0.92)});
      if(o.hi&&o.hi[0]===i&&o.hiA>0){const p0=l.indexOf(o.hi[1]),x0=x+24+tw(ctx,l.slice(0,p0),22,600),x1=x0+tw(ctx,o.hi[1],22,600);withA(ctx,o.hiA,()=>{ctx.fillStyle=rgba(o.hiCol||EDGE_,0.2);rr(ctx,x0-4,yy-24,x1-x0+8,32,6);ctx.fill();ctx.strokeStyle=rgba(o.hiCol||EDGE_,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,yy+8);ctx.lineTo(x1,yy+8);ctx.stroke();});}});
    if(o.owner)T(ctx,o.owner,x+24,y+h-20,{w:600,size:16,color:rgba(SOFT,1)});});return h;}
// code that calculates a number: a file name and a few lines of SQL, one phrase of which can be highlighted
function kt_code(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=o.h||(78+lines.length*34);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,o.edge||[170,205,255],{glow:12,ea:0.6,fill:"rgba(6,10,20,0.95)"});T(ctx,name,x+22,y+34,{f:"mono",w:500,size:16,color:rgba(o.edge||SOFT,1)});ctx.fillStyle="rgba(170,200,245,0.15)";ctx.fillRect(x+14,y+48,w-28,1.2);
    const n=o.p==null?lines.length:lines.length*o.p;lines.forEach((l,i)=>{if(i>=n)return;const yy=y+84+i*34,q=clamp(n-i,0,1);T(ctx,typeOn(l,q),x+22,yy,{f:"mono",w:500,size:18,color:rgba(i%2?INK:[190,220,255],0.92)});
      if(o.hi&&o.hi[0]===i&&o.hiA>0){const p0=l.indexOf(o.hi[1]),x0=x+22+tw(ctx,l.slice(0,p0),18,500,"mono"),x1=x0+tw(ctx,o.hi[1],18,500,"mono");withA(ctx,o.hiA,()=>{ctx.fillStyle=rgba(o.hiCol||EDGE_,0.22);rr(ctx,x0-4,yy-22,x1-x0+8,30,6);ctx.fill();ctx.strokeStyle=rgba(o.hiCol||EDGE_,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,yy+8);ctx.lineTo(x1,yy+8);ctx.stroke();});}});});return h;}

/* ---------- the model on its board, and the data under it ---------- */
// the sketch: the credential and its kinds, as the films' glass boxes, on a board with its version stamp
function kt_board(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  glass(ctx,0,0,w,h,20,o.edge||SK,{glow:16,ea:0.5,fill:"rgba(10,18,36,0.72)"});if(o.label)tag(ctx,24,0,o.label,o.edge||SK,{size:17});
  const s=o.s||0.5,ox=w/2-960*s,oy=h/2-445*s;credKinds(ctx,{ox,oy,s,hi:o.hi});
  if(o.stamp)stamp(ctx,w-18,42,o.stamp,o.stampCol||[200,170,120],1,o.flick||0);ctx.restore();});}
// the data as it's used: a table of enrolments
const KT_COLS=["learner","microcredential","status","online","completed"],KT_CW=[130,250,190,140,150];
const KT_ROWS=[["L-2041","Data Visualisation","enrolled","live","yes"],["L-2217","SQL Basics","WAITLISTED","live","—"],["L-1180","Data Ethics","withdrawn","recorded","no"]];
const kt_cellX=(x,i)=>x+KT_CW.slice(0,i).reduce((p,q)=>p+q,0);

/* ---------- the change package, and the chain ---------- */
function kt_pcard(ctx,x,y,w,h,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const [lay,l1,l2]=KT_PKG[k],col=o.col||KT_AI;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,12,col,{glow:10+10*(o.hi||0),ea:0.75,fill:"rgba(6,16,20,0.95)"});ctx.fillStyle=rgba(col,0.9);rr(ctx,x+12,y+14,5,h-28,2);ctx.fill();
    T(ctx,lay,x+30,y+32,{w:700,size:17,color:rgba(col,1)});T(ctx,l1,x+30,y+66,{w:700,size:23});if(h>100&&l2)T(ctx,l2,x+30,y+98,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});
    if(o.tick)kt_gtick(ctx,x+w-22,y+22,13,o.tick);});}
function kt_folder(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||KT_AI;withA(ctx,a,()=>{
  ctx.save();ctx.shadowColor=rgba(col,0.5);ctx.shadowBlur=24;ctx.fillStyle="rgba(8,20,24,0.9)";ctx.beginPath();ctx.moveTo(x,y+24);ctx.lineTo(x,y+h-16);ctx.quadraticCurveTo(x,y+h,x+16,y+h);ctx.lineTo(x+w-16,y+h);ctx.quadraticCurveTo(x+w,y+h,x+w,y+h-16);ctx.lineTo(x+w,y+40);ctx.quadraticCurveTo(x+w,y+24,x+w-16,y+24);ctx.lineTo(x+260,y+24);ctx.lineTo(x+236,y);ctx.lineTo(x+16,y);ctx.quadraticCurveTo(x,y,x,y+16);ctx.closePath();ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2;ctx.stroke();T(ctx,o.title||"change package",x+24,y+17,{w:800,size:o.ts||16,color:rgba(col,1)});
  if(o.stamp)stamp(ctx,x+w-18,y+60,o.stamp,o.stampCol||col,o.stampA==null?1:o.stampA,0);});}
// the stack of versions: v1 at the back, the newest in front
function kt_versions(ctx,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{for(let i=0;i<n;i++){const k=clamp((o.p==null?n:o.p)-i,0,1);if(k<=0)continue;const top=i===n-1,xx=x+i*16,yy=y-i*26;
  withA(ctx,k,()=>{glass(ctx,xx,yy,220,110,14,top?(o.col||TRUST):[150,165,190],{glow:top?16:6,ea:top?0.9:0.5,fill:"rgba(8,12,24,0.96)"});T(ctx,"v"+(i+1),xx+22,yy+44,{f:"mono",w:500,size:26,color:top?rgba(o.col||TRUST,1):rgba(SOFT,1)});
    T(ctx,(o.dates||["2019","2025","2026"])[i]||"",xx+198,yy+42,{f:"mono",w:500,size:18,align:"right",color:rgba(SOFT,0.9)});if(top&&o.sub)T(ctx,o.sub,xx+22,yy+86,{w:600,size:18,color:rgba(INK,0.85)});});}});}
// one change, end to end: seven layers in a row, lit up to "lit" (0..7); a light travels along them
function kt_chain(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=KT_CHAIN.length,gap=o.gap||16,bw=(w-gap*(n-1))/n,bh=o.h||110,lit=o.lit||0,sz=o.size||1;
  withA(ctx,a,()=>{const cy=y+bh/2;ctx.strokeStyle="rgba(170,200,245,0.25)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+bw/2,cy);ctx.lineTo(x+w-bw/2,cy);ctx.stroke();
    if(lit>0){const e=x+bw/2+(bw+gap)*Math.min(n-1,lit-0.5);beam(ctx,[{x:x+bw/2,y:cy},{x:Math.max(x+bw/2+1,e),y:cy}],TRUST,[[18,0.06],[7,0.18],[2.6,0.8],[1.2,1]]);}
    KT_CHAIN.forEach(([t1,t2],i)=>{const bx=x+i*(bw+gap),on=clamp(lit-i,0,1),hi=o.hiK===i?1:0,col=mix([150,165,190],TRUST,on);
      glass(ctx,bx,y,bw,bh,14,col,{glow:6+16*on+10*hi,ea:0.35+0.6*on,fill:"rgba(8,12,24,0.95)"});
      T(ctx,t1,bx+bw/2,y+bh*0.44,{w:800,size:Math.min(22*sz,(bw-16)/t1.length*1.9),align:"center",color:on>0.5?rgba(INK,1):rgba(SOFT,0.8)});
      withA(ctx,0.4+0.6*on,()=>T(ctx,(o.sub||[])[i]||t2,bx+bw/2,y+bh*0.74,{w:600,size:Math.min(18*sz,(bw-12)/((o.sub||[])[i]||t2).length*1.75),align:"center",color:on>0.5?rgba(TRUST,1):rgba(SOFT,0.8)}));
      if(o.ticks&&on>0.9)kt_gtick(ctx,bx+bw-14,y+2,11,fin(on,0.9,0.1));});});}
// a report from an earlier year, read with the definitions it was written with
function kt_report(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=o.h||300,t=o.t||0;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.015:o.rot);ctx.translate(-w/2,-h/2);
  kt_paper(ctx,0,0,w,h,t,{seed:o.seed||2,col:[240,233,218],curl:o.curl});
  T(ctx,o.title||"Annual report 2025",30,54,{w:800,size:26,color:"rgba(40,36,34,0.95)"});ctx.strokeStyle="rgba(80,76,70,0.3)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(30,70);ctx.quadraticCurveTo(w/2,68,w-30,71);ctx.stroke();
  (o.rows||[["microcredentials issued","2,960"],["completion rate","62%"]]).forEach(([k,v],i)=>{T(ctx,k,30,120+i*52,{w:600,size:21,color:"rgba(60,56,52,0.9)"});T(ctx,v,w-30,120+i*52,{w:800,size:26,align:"right",color:"rgba(40,36,34,0.95)"});});
  if(o.big)T(ctx,o.big,30,120+(o.rows||[0,0]).length*52+24,{w:800,size:48,color:"rgba(40,36,34,0.95)"});
  if(h>220&&!o.big)for(let i=0;i<3;i++){const lw=(w-60)*(0.5+0.4*hash(i,4)),ly=h-86+i*22;ctx.strokeStyle="rgba(80,76,70,0.22)";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(30,ly);ctx.quadraticCurveTo(30+lw/2,ly+1.5,30+lw,ly);ctx.stroke();}
  if(o.stamp)stamp(ctx,w-16,h-18,o.stamp,o.stampCol||KIND,o.stampA==null?1:o.stampA,0);ctx.restore();});}
// a clay tablet from Uruk, c. 3300 BCE: a soft pillow of clay, speckled and lit from the upper left, ruled into cases. In each case,
// numbers pressed in with the round end of a stylus (notches and circles) and a sign drawn with its point: a jar, an ear of grain,
// a sheep (a circle with a cross), a bowl. Stylised, not a real text; the wedges of cuneiform came centuries later. p presses them
function kt_signPath(ctx,k,s){const P=(pts)=>{ctx.moveTo(pts[0][0]*s,pts[0][1]*s);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0]*s,pts[i][1]*s);};ctx.beginPath();
  if(k===0){ctx.moveTo(-0.45*s,-0.75*s);ctx.lineTo(0.45*s,-0.75*s);ctx.moveTo(-0.33*s,-0.75*s);ctx.lineTo(-0.33*s,-0.45*s);ctx.quadraticCurveTo(-0.66*s,-0.3*s,-0.56*s,0.2*s);ctx.quadraticCurveTo(-0.4*s,0.75*s,0,0.85*s);ctx.quadraticCurveTo(0.4*s,0.75*s,0.56*s,0.2*s);ctx.quadraticCurveTo(0.66*s,-0.3*s,0.33*s,-0.45*s);ctx.lineTo(0.33*s,-0.75*s);}
  else if(k===1){P([[0,0.85],[0,-0.85]]);for(let q=0;q<3;q++){const y=-0.55+q*0.45;P([[0,y+0.18],[-0.36,y-0.12]]);P([[0,y+0.18],[0.36,y-0.12]]);}}
  else if(k===2){ctx.moveTo(0.6*s,0);ctx.arc(0,0,0.6*s,0,TAU);P([[-0.6,0],[0.6,0]]);P([[0,-0.6],[0,0.6]]);}
  else{P([[-0.66,-0.4],[0.66,-0.4],[0.3,0.6],[-0.3,0.6],[-0.66,-0.4]]);}}
function kt_tablet(ctx,x,y,w,h,p,a,t){t=t||0;withA(ctx,a==null?1:a,()=>{ctx.save();ctx.translate(x,y);
  const shape=()=>{const n=96,P=[];for(let i=0;i<n;i++){const an=i/n*TAU,c=Math.cos(an),s_=Math.sin(an),e=0.38,wob=1+0.01*Math.sin(an*3+1.3)+0.006*Math.sin(an*7);P.push([w/2+w/2*Math.sign(c)*Math.pow(Math.abs(c),e)*wob,h/2+h/2*Math.sign(s_)*Math.pow(Math.abs(s_),e)*wob]);}
    ctx.beginPath();ctx.moveTo((P[0][0]+P[n-1][0])/2,(P[0][1]+P[n-1][1])/2);for(let i=0;i<n;i++){const q=P[i],r=P[(i+1)%n];ctx.quadraticCurveTo(q[0],q[1],(q[0]+r[0])/2,(q[1]+r[1])/2);}ctx.closePath();};
  ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=30;ctx.shadowOffsetY=12;shape();ctx.fillStyle="#977250";ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,226,180,0.32)");g.addColorStop(0.5,"rgba(255,226,180,0)");g.addColorStop(1,"rgba(40,20,8,0.42)");shape();ctx.fillStyle=g;ctx.fill();
  ctx.save();shape();ctx.clip();const lx=w*(0.35+0.15*Math.sin(t*0.35)),lg=ctx.createRadialGradient(lx,h*0.3,4,lx,h*0.35,w*0.6);lg.addColorStop(0,"rgba(255,230,190,0.16)");lg.addColorStop(1,"rgba(255,230,190,0)");ctx.fillStyle=lg;ctx.fillRect(0,0,w,h);
    for(let i=0;i<Math.floor(w*h/260);i++){const px=hash(i,31)*w,py=hash(i,32)*h,r=0.5+hash(i,33)*1.8;ctx.fillStyle=hash(i,34)>0.55?"rgba(60,36,18,0.22)":"rgba(255,225,185,0.14)";ctx.beginPath();ctx.ellipse(px,py,r*1.4,r,hash(i,35)*3,0,TAU);ctx.fill();}
    ctx.strokeStyle="rgba(60,36,18,0.28)";ctx.lineWidth=1;[[0.1,0.7,0.3,0.95],[0.82,0.05,0.93,0.3]].forEach(([a0,b0,a1,b1])=>{ctx.beginPath();ctx.moveTo(w*a0,h*b0);ctx.bezierCurveTo(w*(a0+0.03),h*(b0+0.08),w*(a1-0.04),h*(b1-0.06),w*a1,h*b1);ctx.stroke();});
    for(let r=1;r<4;r++){const yy=r*h/4;ctx.strokeStyle="rgba(58,34,16,0.4)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(w*0.05,yy);ctx.bezierCurveTo(w*0.35,yy-2,w*0.65,yy+2,w*0.95,yy);ctx.stroke();ctx.strokeStyle="rgba(255,226,180,0.22)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(w*0.05,yy+2);ctx.bezierCurveTo(w*0.35,yy,w*0.65,yy+4,w*0.95,yy+2);ctx.stroke();}
    const sz=Math.min(w/26,h/9),pp=clamp(p,0,1),dark="rgba(56,32,14,0.82)",lite="rgba(255,226,180,0.32)";
    for(let q=0;q<8;q++){const row=q>>1,col=q&1,dv=w*(0.5+0.12*(hash(row,51)-0.5)),x0=col?dv:w*0.05,x1=col?w*0.95:dv,cy=row*h/4+h/8,u=clamp(pp*8-q,0,1);
      if(col){ctx.strokeStyle="rgba(58,34,16,0.4)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(dv,row*h/4+h*0.02);ctx.quadraticCurveTo(dv+2,cy,dv-1,(row+1)*h/4-h*0.02);ctx.stroke();}
      if(u<=0)continue;const nC=hash(q,52)<0.45?1:0,nD=1+Math.floor(hash(q,53)*4),items=nC+nD+1;let px=x0+sz*0.9;
      for(let m=0;m<items;m++){if(u<=m/items)break;const jy=(hash(q*7+m,54)-0.5)*sz*0.12;ctx.save();
        if(m<nC){ctx.translate(px+sz*0.35,cy+jy);ctx.fillStyle=dark;ctx.beginPath();ctx.arc(0,0,sz*0.52,0,TAU);ctx.fill();ctx.strokeStyle=lite;ctx.lineWidth=Math.max(0.8,sz*0.07);ctx.beginPath();ctx.arc(0,0,sz*0.5,-0.15*Math.PI,0.75*Math.PI);ctx.stroke();px+=sz*1.35;}
        else if(m<nC+nD){ctx.translate(px,cy+jy);ctx.rotate((hash(q*5+m,55)-0.5)*0.12);ctx.fillStyle=dark;ctx.beginPath();ctx.moveTo(-sz*0.26,-sz*0.62);ctx.lineTo(-sz*0.26,sz*0.62);ctx.bezierCurveTo(sz*0.46,sz*0.64,sz*0.46,-sz*0.64,-sz*0.26,-sz*0.62);ctx.fill();
          ctx.strokeStyle=lite;ctx.lineWidth=Math.max(0.8,sz*0.07);ctx.beginPath();ctx.moveTo(sz*0.28,-sz*0.1);ctx.bezierCurveTo(sz*0.3,sz*0.3,sz*0.15,sz*0.55,-sz*0.2,sz*0.6);ctx.stroke();px+=sz*0.78;}
        else{const sx=Math.min(x1-sz*1.1,px+sz*1.2);ctx.translate(sx,cy);ctx.lineCap="round";ctx.lineJoin="round";kt_signPath(ctx,[0,3,1,2,3,0,2,1][q],sz);ctx.strokeStyle=dark;ctx.lineWidth=Math.max(1,sz*0.13);ctx.stroke();
          ctx.translate(sz*0.05,sz*0.06);kt_signPath(ctx,[0,3,1,2,3,0,2,1][q],sz);ctx.strokeStyle="rgba(255,226,180,0.22)";ctx.lineWidth=Math.max(0.6,sz*0.05);ctx.stroke();}
        ctx.restore();}}
  ctx.restore();ctx.restore();});}
// a diploma: a sheet with softly rolled ends, a few lines of script, and a ribbon with a wax seal that sways
function kt_diploma(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const rh=Math.max(8,h*0.09);
  kt_paper(ctx,x,y+rh*0.5,w,h-rh,t,{seed:o.seed||5,col:[242,233,212],curl:0,age:0.12});
  [y+rh*0.5,y+h-rh*0.5].forEach((ry,k)=>{const g=ctx.createLinearGradient(0,ry-rh/2,0,ry+rh/2);g.addColorStop(0,"#b99a6c");g.addColorStop(0.45,"#f6ead0");g.addColorStop(1,"#8e7048");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-rh*0.3,ry-rh/2);ctx.bezierCurveTo(x+w/3,ry-rh/2-1.5,x+2*w/3,ry-rh/2+1.5,x+w+rh*0.3,ry-rh/2);ctx.quadraticCurveTo(x+w+rh*0.9,ry,x+w+rh*0.3,ry+rh/2);ctx.bezierCurveTo(x+2*w/3,ry+rh/2+1.5,x+w/3,ry+rh/2-1.5,x-rh*0.3,ry+rh/2);ctx.quadraticCurveTo(x-rh*0.9,ry,x-rh*0.3,ry-rh/2);ctx.fill();});
  if(o.title)T(ctx,o.title,x+w/2,y+rh+h*0.2,{w:800,size:Math.max(12,h*0.13),align:"center",color:"rgba(70,50,30,0.95)"});
  for(let i=0;i<3;i++){const ly=y+rh+h*(0.36+i*0.13),lw=w*(0.62-i*0.12),lx=x+(w-lw)/2;ctx.strokeStyle="rgba(80,60,40,0.4)";ctx.lineWidth=Math.max(1,h*0.018);ctx.beginPath();ctx.moveTo(lx,ly);for(let q=1;q<=6;q++)ctx.quadraticCurveTo(lx+lw*(q-0.5)/6,ly+((q%2)?-1:1)*h*0.015,lx+lw*q/6,ly);ctx.stroke();}
  const sx=x+w*0.72,sy=y+h*0.8,sw=Math.sin(t*1.4)*h*0.03,rw=Math.max(3,h*0.05);ctx.fillStyle="rgba(150,30,36,0.95)";[-1,1].forEach(d=>{ctx.beginPath();ctx.moveTo(sx+d*rw*0.4,sy);ctx.quadraticCurveTo(sx+d*rw+sw,sy+h*0.14,sx+d*rw*1.6+sw*1.4,sy+h*0.26);ctx.lineTo(sx+d*rw*0.6+sw*1.4,sy+h*0.24);ctx.quadraticCurveTo(sx+sw*0.8,sy+h*0.12,sx-d*rw*0.4,sy);ctx.fill();});
  waxSeal(ctx,sx,sy,Math.max(8,h*0.1),WAX,1,1);});}
// a proposal on its way: a small card carried along a path, for the review and the gate
function kt_prop(ctx,x,y,s,col,a,o){o=o||{};withA(ctx,a,()=>{const w=tw(ctx,s,17,700)+36;glass(ctx,x-w/2,y-22,w,44,12,col,{glow:14,ea:0.85,fill:"rgba(8,12,24,0.95)",lw:o.dash?2:1.6});if(o.dash){ctx.save();ctx.setLineDash([6,5]);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2;rr(ctx,x-w/2,y-22,w,44,12);ctx.stroke();ctx.restore();}
  T(ctx,s,x,y+6,{w:700,size:17,align:"center",color:rgba(col,1)});});}

/* ---------- pictures for the labs and the scenarios (site/assets/keeping-it-true/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW); any text it draws comes from FW.vis
   or the lab's own words, so the Spanish pages show Spanish. Lab pictures are shown at about half size, so their text is 22 px
   or more; scenario pictures at about 70%, so theirs is 18 px or more. */
// several lines of text, split on "\n"
function kt_lines(c,s,x,y,o){String(s).split("\n").forEach((l,i)=>T(c,l,x,y+i*(o.lh||o.size*1.2),o));}
// a sort lab: its buckets as three trays, with a numbered chip for each item placed (green or red once checked)
function kt_trays(c,w,h,st,L,id,cols,icons){const lab=L.labs.find(x=>x.id===id),B=lab.w.buckets,n=B.length,tw_=(w-40-(n-1)*20)/n,pick=st.pick||{};
  B.forEach(([k,name],i)=>{const x=20+i*(tw_+20),y=20,col=cols[i];glass(c,x,y,tw_,h-40,18,col,{glow:12,ea:0.75,fill:"rgba(7,12,24,0.94)"});icons[i](c,x+36,y+44);
    const nl=wrapT(c,name,x+68,y+52,tw_-84,{w:800,size:24,lh:30,color:rgba(col,1)}).length;
    const inB=lab.w.items.map((it,j)=>[it,j]).filter(([it,j])=>pick[j]===k);inB.forEach(([it,j],q)=>{const cx=x+44+(q%4)*((tw_-60)/4),cy=y+130+Math.max(0,nl-2)*30+Math.floor(q/4)*66,ok=it.b===k,cc=st.checked?(ok?GOOD:BAD):[190,205,230];
      glow(c,cx,cy,34,cc,0.25);c.fillStyle="rgba(10,16,30,0.95)";c.beginPath();c.arc(cx,cy,25,0,TAU);c.fill();ring(c,cx,cy,25,cc,1,3);T(c,String(j+1),cx,cy+9,{w:800,size:26,align:"center",color:rgba(cc,1)});});});}
// the chain for the steps lab: eight steps in two rows, the second running back, lit up to the step you're on
function kt_chain2(c,w,h,step,labels){const bw=206,bh=100,gx=(w-4*bw)/5,P=i=>i<4?[gx+i*(bw+gx),30]:[gx+(7-i)*(bw+gx),30+bh+60];
  c.strokeStyle="rgba(170,200,245,0.25)";c.lineWidth=3;c.beginPath();for(let i=0;i<8;i++){const [x,y]=P(i);i?c.lineTo(x+bw/2,y+bh/2):c.moveTo(x+bw/2,y+bh/2);}c.stroke();
  const lit=Math.min(8,step+1);if(lit>1){const pts=[];for(let i=0;i<lit;i++){const [x,y]=P(i);pts.push({x:x+bw/2,y:y+bh/2});}beam(c,pts,TRUST,[[16,0.06],[6,0.2],[2.6,0.85]]);}
  labels.forEach((s,i)=>{const [x,y]=P(i),on=i<lit,cur=i===step,col=on?TRUST:[150,165,190];if(cur)glow(c,x+bw/2,y+bh/2,140,TRUST,0.25);
    glass(c,x,y,bw,bh,16,col,{glow:on?(cur?26:12):4,ea:on?0.95:0.4,fill:"rgba(8,12,24,0.96)"});const ls=String(s).split("\n");kt_lines(c,s,x+bw/2,y+bh/2+9-(ls.length-1)*13,{w:800,size:22,lh:27,align:"center",color:on?rgba(INK,1):rgba(SOFT,0.75)});
    if(on&&!cur)kt_gtick(c,x+bw-8,y+6,14,1);});}
// a small light dashboard row: its name and its number
function kt_dashRow(c,x,y,w,name,num,col){glass(c,x-6,y-6,w+12,72,14,[170,205,255],{glow:8,ea:0.4,fill:"rgba(8,14,28,0.95)"});c.save();rr(c,x,y,w,60,10);c.clip();c.fillStyle=DB.card;c.fillRect(x,y,w,60);c.fillStyle=rgba(col,1);c.fillRect(x,y,8,60);c.restore();
  T(c,name,x+24,y+38,{w:700,size:22,color:DB.text});T(c,num,x+w-20,y+44,{w:800,size:38,align:"right",color:DB.text});}
const LV={
  // Spot the drift: what each change needs (close the gap, nothing to change, or a new version of the meaning)
  drift:(c,w,h,st,L)=>kt_trays(c,w,h,st,L,"drift",[EDGE_,GOOD,TRUST],[(c,x,y)=>{T(c,"≈",x,y+12,{w:800,size:40,align:"center",color:rgba(EDGE_,1)});},(c,x,y)=>tick_(c,x,y,32,GOOD,1),(c,x,y)=>{glass(c,x-22,y-18,48,36,9,TRUST,{glow:8,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,"v3",x+2,y+8,{f:"mono",w:500,size:22,align:"center",color:rgba(TRUST,1)});}]),
  // Approve or reject: the agent's proposals, sorted by the people who decide
  review:(c,w,h,st,L)=>kt_trays(c,w,h,st,L,"review",[TRUST,BAD,AMBER],[(c,x,y)=>kt_gtick(c,x,y,18,1),(c,x,y)=>kt_rcross(c,x,y,18,1),(c,x,y)=>{ring(c,x,y,18,AMBER,1,3);T(c,"?",x,y+9,{w:800,size:24,align:"center",color:rgba(AMBER,1)});}]),
  // Follow one change: the chain, lit up to the step you're on; the last step is the version note
  chain:(c,w,h,st,L)=>kt_chain2(c,w,h,st.step||0,L.vis.chain),
  // scenarios (600 × 320)
  three:(c,w,h,st,L)=>{const V=L.vis;T(c,V.rateQ,300,44,{w:800,size:26,align:"center",color:rgba(EDGE_,1)});KT_DASH.forEach((d,i)=>kt_dashRow(c,60,80+i*80,480,V.dash[i],d.num,d.col));},
  invent:(c,w,h,st,L)=>{const V=L.vis;kt_agent(c,64,96,34,1);glass(c,120,30,460,190,18,KT_AI,{glow:16,ea:0.85,fill:"rgba(6,16,20,0.95)"});T(c,V.draft,146,70,{w:700,size:20,color:rgba(KT_AI,1)});T(c,V.rateEq,146,118,{w:800,size:26});T(c,V.invented,146,166,{f:"mono",w:500,size:19});
    kt_rstamp(c,360,262,V.nobody,EDGE_,1,1,{size:28,rot:-0.06});},
  skip:(c,w,h,st,L)=>{const V=L.vis;glass(c,180,30,200,70,14,TRUST,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.94)"});T(c,V.review,280,73,{w:800,size:24,align:"center",color:rgba(TRUST,1)});
    c.save();c.setLineDash([12,9]);c.strokeStyle=rgba(BAD,0.9);c.lineWidth=3.5;c.beginPath();c.moveTo(40,170);c.bezierCurveTo(200,170,250,190,420,170);c.stroke();c.restore();
    const cw=tw(c,V.change,20,700)+30;glass(c,40,146,cw,48,12,BAD,{glow:12,ea:0.9,fill:"rgba(20,8,10,0.95)"});T(c,V.change,40+cw/2,177,{w:700,size:20,align:"center",color:rgba(BAD,1)});
    T(c,V.notReviewed,280,236,{w:700,size:20,align:"center",color:rgba(BAD,1)});gate(c,470,165,190,BAD,"tests");kt_rcross(c,430,170,18,1);T(c,V.gate,470,296,{w:700,size:20,align:"center",color:rgba(BAD,1)});},
  lastyear:(c,w,h,st,L)=>{const V=L.vis;kt_report(c,24,30,290,{h:250,title:V.report,rows:[[V.rateL,""]],big:"62%",stamp:V.readV2,rot:-0.02});
    glass(c,340,34,240,262,18,TRUST,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.95)"});kt_lines(c,tw(c,V.v3,18,800)>200?V.v3.replace(/ · (\S+)$/,"\n$1"):V.v3,360,70,{w:800,size:18,lh:22,color:rgba(TRUST,1)});T(c,"71%",360,160,{w:800,size:48});wrapT(c,V.v3f,360,200,200,{f:"mono",w:500,size:18,lh:23});},
  spec:(c,w,h,st,L)=>{const V=L.vis;[["2026",0.55],["2027",1]].forEach(([y_,a],i)=>withA(c,a,()=>{const x=50+i*270;glass(c,x,40,230,240,18,[200,215,240],{glow:10,ea:0.6,fill:"rgba(8,14,28,0.94)"});kt_lines(c,V.spec,x+22,80,{w:700,size:19,lh:24,color:rgba(SOFT,1)});T(c,y_,x+22,176,{w:800,size:52});
    if(i)tag(c,x+115,236,V.outcome,AMBER,{align:"center",size:20});}));arrowTo(c,286,160,316,160,SOFT,0.8,{head:10});},
  who:(c,w,h,st,L)=>{const V=L.vis;[["mei",V.meaning,"Mei"],["noor",V.model,"Noor"],["team",V.build,V.teams]].forEach(([id,s,n],i)=>{const x=110+i*190;if(id==="team"){person(c,"sam",x-34,306,0.33,{t:1});person(c,"ben",x+34,306,0.33,{t:2});}else person(c,id,x,306,0.35,{t:1});
    tag(c,x,34,s,TRUST,{align:"center",size:20});T(c,n,x,80,{w:700,size:19,align:"center",color:rgba(SOFT,1)});});},
  ghost:(c,w,h,st,L)=>{const V=L.vis;kt_report(c,20,70,250,{h:210,title:V.report2019,rows:[[V.completion,""]],big:"58%",rot:-0.03,curl:0});
    const wob=Math.sin(1.3)*3;withA(c,0.6,()=>{glass(c,296,30,290,170,18,[200,210,230],{glow:22,ea:0.6,fill:"rgba(10,14,26,0.7)"});T(c,V.v1,316,72,{w:700,size:20,color:rgba(SOFT,1)});wrapT(c,V.v1f,316,118+wob,254,{f:"mono",w:500,size:20,lh:28});});
    kt_agent(c,520,250,34,1);arrowTo(c,270,150,296,120,[200,210,230],0.7,{head:10,dash:[5,5]});},
  order:(c,w,h,st,L)=>{const V=L.vis;kt_folder(c,40,40,520,250,{title:V.pkg,ts:20});[[70,110,-0.06],[250,150,0.05],[360,96,-0.03]].forEach(([x,y,r],i)=>{c.save();c.translate(x,y);c.rotate(r);glass(c,0,0,200,70,12,KT_AI,{glow:10,ea:0.8,fill:"rgba(6,16,20,0.96)"});T(c,V.cards[i],100,44,{w:800,size:21,align:"center",color:rgba(KT_AI,1)});c.restore();});
    T(c,"?",170,262,{w:800,size:50,align:"center",color:rgba(TRUST,1)});},
  // What lasts, what changes: the four answers in one tray, a shape still to come in the other
  remains:(c,w,h,st,L)=>kt_trays(c,w,h,st,L,"remains",[TRUST,[180,195,235]],[(c,x,y)=>[0,1,2,3].forEach(j=>kt_four(c,j,x-10+(j%2)*20,y-10+Math.floor(j/2)*20,9,1)),
    (c,x,y)=>{c.save();c.setLineDash([4,4]);c.strokeStyle=rgba([180,195,235],0.9);c.lineWidth=2;rr(c,x-18,y-18,36,36,7);c.stroke();c.restore();T(c,"?",x,y+8,{w:800,size:22,align:"center",color:rgba([180,195,235],1)});}]),
  // scenarios: a new pattern, pitched, and the four questions to ask it
  pitch:(c,w,h,st,L)=>{const V=L.vis;c.save();c.setLineDash([8,8]);c.strokeStyle=rgba(SOFT,0.8);c.lineWidth=2;rr(c,30,40,230,250,18);c.stroke();c.restore();
    T(c,V.newPat,145,86,{w:800,size:20,align:"center",color:rgba(SOFT,1)});T(c,"?",145,190,{w:800,size:70,align:"center",color:rgba(SOFT,0.55)});wrapT(c,V.pitch,145,250,200,{w:600,size:15,lh:19,align:"center",color:rgba(SOFT,1)});
    T(c,V.ask,300,62,{w:800,size:20,color:rgba(TRUST,1)});KT_FOUR.forEach((f,j)=>{const y=108+j*52;kt_four(c,j,322,y,19,1);T(c,V.four[j],352,y+7,{w:800,size:22,color:rgba(f[2],1)});});},
  // two credentials that look alike, and the question of merging them
  alike:(c,w,h,st,L)=>{const V=L.vis;[["C-88","Aisha K."],["C-91","Aisha R."]].forEach(([id,who],i)=>{const x=24+i*300;glass(c,x,24,252,200,18,TRUST,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});
      T(c,"id "+id,x+22,60,{f:"mono",w:500,size:18,color:rgba(TRUST,1)});c.fillStyle=rgba(TRUST,0.16);rr(c,x+12,74,228,42,8);c.fill();T(c,who,x+22,104,{w:800,size:26});
      wrapT(c,V.micro,x+22,146,210,{w:600,size:18,lh:22,color:rgba(SOFT,1)});T(c,V.date,x+22,204,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});});
    c.save();c.setLineDash([6,6]);c.strokeStyle=rgba(KT_AI,0.85);c.lineWidth=2.5;c.beginPath();c.moveTo(278,124);c.lineTo(322,124);c.stroke();c.restore();
    tag(c,300,258,V.alike,KT_AI,{align:"center",size:19});T(c,V.merge,300,300,{w:700,size:18,align:"center",color:rgba(SOFT,1)});}
};

/* ---------- What remains: the shapes that keep arriving, and the four answers inside each ---------- */
// each pattern as a small crisp glyph, drawn around (0,0) in a box of about 180 × 110; its colour, name and the people who proposed it
const KT_PAT=[["data vault","Linstedt",[180,150,255],"vaults"],["anchor","Rönnbäck and others",[120,205,240],"anchors"],["hook","Foad",[240,175,115],"hooks"],
  ["Puppini bridge","Puppini and Inmon",[140,170,255],"bridges"],["activity stream","Elsamadisi",[250,140,175],"activity"]];
const KT_STAR=[120,215,155];
// the four answers every shape stores: meaning, identity, grain, time
const KT_FOUR=[["meaning","what a credential is",KIND],["identity","what makes it the same one",TRUST],["grain","what one row holds",PARCH],["time","when each thing was true",[200,160,255]]];
function kt_box(ctx,x,y,w,h,col,lab,o){o=o||{};ctx.fillStyle="rgba(8,14,28,0.95)";rr(ctx,x-w/2,y-h/2,w,h,5);ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2;rr(ctx,x-w/2,y-h/2,w,h,5);ctx.stroke();
  if(lab)T(ctx,lab,x,y+5,{w:700,size:o.size||13,align:"center",color:rgba(col,1)});}
function kt_ln(ctx,pts,col,a){ctx.strokeStyle=rgba(col,a==null?0.8:a);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();}
function kt_glyph(ctx,k,x,y,s,t){const col=k==="star"?KT_STAR:KT_PAT[k][2];ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  if(k===0){// hubs hold the keys, a link joins them, satellites stack the history under each hub
    kt_ln(ctx,[[-50,-22],[50,-22]],col);[-50,50].forEach(hx=>{[0,1,2].forEach(i=>{kt_ln(ctx,[[hx,-10],[hx,4+i*18]],col,0.4);ctx.fillStyle=rgba(col,0.28+0.12*i);rr(ctx,hx-24,6+i*18,48,12,3);ctx.fill();});kt_box(ctx,hx,-22,56,26,col,"HUB",{size:11});});
    ctx.fillStyle="rgba(8,14,28,0.95)";ctx.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU;ctx.lineTo(Math.cos(an)*17,-22+Math.sin(an)*17);}ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.stroke();}
  else if(k===1){// an anchor for the identity, and one small table per attribute, each with its own history
    for(let i=0;i<6;i++){const an=-Math.PI/2+i/6*TAU,ex=Math.cos(an)*66,ey=Math.sin(an)*44;kt_ln(ctx,[[0,0],[ex,ey]],col,0.5);ctx.fillStyle="rgba(8,14,28,0.95)";ctx.beginPath();ctx.arc(ex,ey,9,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.stroke();}
    ctx.fillStyle=rgba(col,0.95);rr(ctx,-22,-16,44,32,6);ctx.fill();T(ctx,"ID",0,6,{w:800,size:16,align:"center",color:"rgba(8,14,28,1)"});}
  else if(k===2){// a hook for each business concept, and the source data hung from it in bags
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-70,-44);ctx.lineTo(70,-44);ctx.stroke();
    [-44,0,44].forEach((hx,i)=>{const sw=Math.sin((t||0)*1.4+i)*3;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hx,-44);ctx.lineTo(hx,-26);ctx.arc(hx-7,-26,7,0,Math.PI*0.9);ctx.stroke();
      ctx.fillStyle=rgba(col,0.3);ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hx-14+sw,-12);ctx.quadraticCurveTo(hx-22+sw,26,hx-10+sw,40);ctx.lineTo(hx+10+sw,40);ctx.quadraticCurveTo(hx+22+sw,26,hx+14+sw,-12);ctx.closePath();ctx.fill();ctx.stroke();});}
  else if(k===3){// one bridge table in the middle: every table joins through it, so no number is counted twice
    [-1,1].forEach(sd=>[-34,0,34].forEach(yy=>{kt_ln(ctx,[[sd*20,yy*0.6],[sd*62,yy]],col,0.55);kt_box(ctx,sd*70,yy,34,22,col);}));ctx.fillStyle=rgba(col,0.95);rr(ctx,-18,-48,36,96,6);ctx.fill();T(ctx,"bridge",0,4,{w:800,size:11,align:"center",color:"rgba(8,14,28,1)"});}
  else if(k===4){// one row per thing a learner did, in time order
    kt_ln(ctx,[[-80,20],[80,20]],col,0.7);const L=["enrolled","passed","awarded"];for(let i=0;i<7;i++){const px=-68+i*22.5,on=i%3===0;ctx.fillStyle=rgba(col,on?1:0.5);ctx.beginPath();ctx.arc(px,20,on?7:4.5,0,TAU);ctx.fill();}
    L.forEach((l,i)=>T(ctx,l,-68+i*67.5,-2,{w:700,size:12,align:"center",color:rgba(col,1)}));T(ctx,"time →",80,46,{f:"mono",w:500,size:12,align:"right",color:rgba(SOFT,1)});}
  else if(k==="star"){// a fact at the centre, its dimensions around it
    [[-62,-30],[62,-30],[-62,30],[62,30]].forEach(([dx,dy])=>{kt_ln(ctx,[[0,0],[dx,dy]],col,0.6);kt_box(ctx,dx,dy,44,24,col);});ctx.fillStyle=rgba(col,0.95);rr(ctx,-26,-18,52,36,6);ctx.fill();T(ctx,"fact",0,5,{w:800,size:12,align:"center",color:"rgba(8,14,28,1)"});}
  ctx.restore();}
// the four answers as small icons: a definition, a key, one row, a clock
function kt_four(ctx,j,x,y,r,a){if(a<=0.01)return;const col=KT_FOUR[j][2];withA(ctx,a,()=>{glow(ctx,x,y,r*1.6,col,0.25);ctx.fillStyle="rgba(8,12,24,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2;ctx.stroke();
  const u=r/20;ctx.save();ctx.translate(x,y);ctx.scale(u,u);ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.2;ctx.lineCap="round";
  if(j===0){T(ctx,"Aa",0,5,{w:800,size:15,align:"center",color:rgba(col,1)});ctx.beginPath();ctx.moveTo(-9,10);ctx.lineTo(9,10);ctx.stroke();}
  else if(j===1){ctx.beginPath();ctx.arc(-5,0,6,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(1,0);ctx.lineTo(12,0);ctx.moveTo(8,0);ctx.lineTo(8,5);ctx.moveTo(12,0);ctx.lineTo(12,5);ctx.stroke();}
  else if(j===2){for(let i=0;i<3;i++){ctx.globalAlpha=i===1?1:0.4;ctx.fillRect(-10,-9+i*7,20,4.5);}ctx.globalAlpha=1;}
  else{ctx.beginPath();ctx.arc(0,0,10,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(0,0);ctx.lineTo(5,3);ctx.stroke();}
  ctx.restore();});}
// a pattern's card: its name, who proposed it, its glyph, and (four > 0) the four answers inside it
function kt_patCard(ctx,k,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ghost=k<0,col=ghost?SOFT:k==="star"?KT_STAR:KT_PAT[k][2];
  withA(ctx,a,()=>{if(ghost){ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(SOFT,0.7);ctx.lineWidth=2;rr(ctx,x,y,w,h,18);ctx.stroke();ctx.restore();T(ctx,"next",x+w/2,y+44,{w:800,size:22,align:"center",color:rgba(SOFT,0.9)});T(ctx,"?",x+w/2,y+h/2+22,{w:800,size:64,align:"center",color:rgba(SOFT,0.5)});return;}
    glass(ctx,x,y,w,h,18,col,{glow:12+10*(o.hi||0),ea:0.75,fill:"rgba(7,12,24,0.93)"});
    T(ctx,k==="star"?"star":KT_PAT[k][0],x+w/2,y+44,{w:800,size:22,align:"center",color:rgba(col,1)});if(k!=="star")T(ctx,KT_PAT[k][1],x+w/2,y+70,{w:500,size:15,align:"center",color:rgba(SOFT,1)});
    kt_glyph(ctx,k,x+w/2,y+(o.four?152:162),o.gs||1,t);
    if(o.four)KT_FOUR.forEach((f,j)=>kt_four(ctx,j,x+w/2+(j-1.5)*48,y+h-38,17,o.four[j]||0));});}

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
/* The map before the data: the series' people, drawn like the cast of When things go wrong (its character sheet).
   A new organisation, so a new cast: Tomás Herrera, the enterprise architect in his first weeks at the utility (cyan, the
   technical side), and the people who own parts of the business (gold, the business side), starting with Grace Achieng,
   who runs network operations, Farah Siddiqui, the customer advocate, who speaks for the utility's customers, and Ama Owusu, the regulatory lead, who knows
   what the owner, the regulator and the community expect of it. */
PEOPLE.tomas={name:"Tomás Herrera",role:"Enterprise architect",side:"Technical",does:"produces",edge:TECH,seed:11,
  skin:[214,172,136],hair:{style:"side",c:[44,32,26]},beard:[52,38,30],glasses:[36,40,50],
  top:{kind:"overshirt",c:[78,96,128],inner:[228,232,238]},bottom:{c:[46,50,60]},shoe:[70,52,40],build:{sh:76,hip:60,h:1.0}};
PEOPLE.grace={name:"Grace Achieng",role:"Network operations",side:"Business",does:"produces",edge:BIZ,seed:12,
  skin:[118,80,58],hair:{style:"cropped",c:[30,26,24]},earrings:[255,214,140],
  top:{kind:"blazer",c:[38,98,108],inner:[236,230,220]},bottom:{c:[40,42,50]},shoe:[36,30,30],build:{sh:68,hip:60,h:0.96}};
PEOPLE.farah={name:"Farah Siddiqui",role:"Customer advocate",side:"Business",does:"uses",edge:BIZ,seed:13,
  skin:[196,148,112],hair:{style:"long",c:[34,26,24]},earrings:[255,214,140],
  top:{kind:"cardigan",c:[150,86,104],inner:[238,232,222]},bottom:{c:[46,48,60]},shoe:[40,32,32],build:{sh:66,hip:60,h:0.95}};
PEOPLE.ama={name:"Ama Owusu",role:"Regulatory lead",side:"Business",does:"uses",edge:BIZ,seed:14,
  skin:[132,90,64],hair:{style:"bun",c:[28,24,22]},glasses:[60,46,40],
  top:{kind:"blazer",c:[92,74,128],inner:[236,232,226]},bottom:{c:[44,44,54]},shoe:[40,32,32],build:{sh:68,hip:60,h:0.97}};

/* ===== The map before the data: the series' components =====
   A series on enterprise architecture and why it matters for data. It follows Tomás, a new enterprise architect, through his first
   weeks at a publicly owned energy utility, as he builds a map of how it works. Drawn with the films' primitives (glass, T, tag,
   glow, withA, fin), From words to data's (sheet, pencilText, ring, tick_, arrowTo, wrapT) and In the weeds of data crafting's
   motion (spring, arrive, drift, motes). Everything here is shared by the series' films; each film keeps its own pictures.
   Two materials carry the series' idea: Tomás's drafts are paper (canvases and sticky notes on a wall, slightly crooked), and the
   confirmed model is crisp glass in the layers' conventional colours. A note that moves from the wall to the model changes material. */

/* ---------- colours ---------- */
// the series' colour (sea-green, a map's), and the six layers of the map, in the colours architects conventionally give them
const EAC=[150,222,196];
const LAY6=[["motivation",[200,186,255]],["strategy",[245,206,140]],["business",[255,234,130]],["information",[255,186,150]],["application",[140,214,255]],["technology",[160,224,140]]];
// the three questions that hold the layers, and the layers each one covers
const Q3=[["why, and for whom",0,1],["how it works",2,3],["what runs it",4,5]];
// sticky notes: yellow, pink, blue and green paper
const NOTEC=[[255,228,122],[255,176,196],[164,212,255],[188,236,164]];
const INKD=[40,40,48];

/* ---------- titles ---------- */
// a flat diamond: one layer of the map seen from above
function rhomb(ctx,cx,cy,w,h){ctx.beginPath();ctx.moveTo(cx,cy-h/2);ctx.lineTo(cx+w/2,cy);ctx.lineTo(cx,cy+h/2);ctx.lineTo(cx-w/2,cy);ctx.closePath();}
// the series' mark: three layers stacked, drawn from the top as p goes from 0 to 1, in the colours of the three questions
function eaMark(ctx,x,y,s,a,p){if(a<=0.01)return;p=p==null?1:p;withA(ctx,a,()=>{[0,2,4].forEach((li,i)=>{const q=clamp(p*3-i,0,1);if(q<=0)return;const col=LAY6[li][1],cy=y-s*1.1+i*s*0.62+(1-spring(q*1.4))*-s*0.5;
  withA(ctx,clamp(q*2,0,1),()=>{ctx.save();ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=12;rhomb(ctx,x,cy,s*2.6,s*0.95);ctx.fillStyle=rgba(col,0.16);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=s*0.09;ctx.stroke();ctx.restore();});});});}
// the title card, over whatever the chapter is drawing: the series, the film's title, and where it sits in the series
function eaTitle(ctx,S,t,t0,title,sub,col,n){col=col||EAC;const oA=fin(t,t0,0.8),tA=fin(t,t0+0.5,0.8);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{glow(ctx,960,470,480,col,0.08);eaMark(ctx,960,392,30,1,(t-t0-0.5)/1.4);T(ctx,"THE MAP BEFORE THE DATA",960,458,{w:800,size:30,align:"center",color:rgba(col,0.95)});
    T(ctx,title,960,560,{w:800,size:92,align:"center"});if(sub)T(ctx,sub,960,632,{w:600,size:36,align:"center",color:rgba(SOFT,0.95)});
    withA(ctx,fin(t,t0+1.2,0.8),()=>tag(ctx,960,712,n||"enterprise architecture, for data",col,{align:"center",size:28}));});}
function eaEnd(ctx,S,t,t0,title,col,line,n){col=col||EAC;const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)T(ctx,line,960,410,{w:700,size:44,align:"center"});eaMark(ctx,960,540,20,0.95,1);T(ctx,title,960,622,{w:800,size:44,align:"center",color:rgba(col,1)});
    T(ctx,"The map before the data"+(n?" · "+n:"")+" · Learning Data",960,680,{w:600,size:28,align:"center",color:rgba(SOFT,0.9)});});}

/* ---------- the map: six layers ---------- */
// one layer: a slab seen slightly from above (a parallelogram), with its name; fill (0..1) says how much of it is known
function slab(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const k=o.sk==null?h*0.7:o.sk,fl=o.fill||0,hi=o.hi||0;
  withA(ctx,a,()=>{ctx.save();if(hi>0){ctx.shadowColor=rgba(col,0.7*hi);ctx.shadowBlur=26*hi;}
    ctx.beginPath();ctx.moveTo(x+k,y);ctx.lineTo(x+w+k,y);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fillStyle="rgba(7,12,24,0.9)";ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle=rgba(col,0.07+0.26*fl+0.08*hi);ctx.fill();ctx.strokeStyle=rgba(col,0.55+0.4*Math.max(fl,hi));ctx.lineWidth=2;ctx.stroke();
    // the slab's front edge, for depth
    ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w,y+h+7);ctx.lineTo(x,y+h+7);ctx.closePath();ctx.fillStyle=rgba(mix(col,[0,0,0],0.55),0.8);ctx.fill();ctx.restore();
    if(o.label!==false)T(ctx,name,x+k*0.5+26,y+h/2+(o.size||30)*0.36,{w:800,size:o.size||30,color:rgba(mix(col,INK,0.35),1),deco:o.deco});});}
// the map: six layers from motivation down to technology. o.p draws them from the top; o.fill[i], o.hi[i] per layer; o.br (0..1) the
// three brackets of questions on the left, o.bq[k] each one. Returns each layer's box [x, y, w, h].
function layerStack(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,sh=o.sh||66,gap=o.gap||16,p=o.p==null?1:o.p,R=[];
  LAY6.forEach((L,i)=>R.push([x,y+i*(sh+gap),w,sh]));if(a<=0.01)return R;
  withA(ctx,a,()=>{LAY6.forEach(([nm,col],i)=>{const q=clamp(p*6.5-i*1.0,0,1);if(q<=0)return;const yy=R[i][1]-(1-spring(q*1.4))*40;
      slab(ctx,x,yy,w,sh,nm,col,{a:clamp(q*2.2,0,1),fill:o.fill?o.fill[i]||0:0,hi:o.hi?o.hi[i]||0:0,size:o.size,deco:o.deco});});
    const br=o.br||0;if(br>0)Q3.forEach(([q,i0,i1],k)=>{const v=br*(o.bq?o.bq[k]==null?1:o.bq[k]:1);if(v<=0.01)return;const y0=R[i0][1]+4,y1=R[i1][1]+sh-4,bx=x-28,col=mix(LAY6[i0][1],LAY6[i1][1],0.5);
      withA(ctx,v,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(bx+12,y0);ctx.lineTo(bx,y0);ctx.lineTo(bx,lerp(y0,y1,ease(clamp(v*1.3,0,1))));if(v>0.75){ctx.lineTo(bx+12,y1);}ctx.stroke();ctx.restore();
        T(ctx,q,bx-22,(y0+y1)/2+11,{w:800,size:o.qsize||32,align:"right",color:rgba(col,1)});});});});
  return R;}

/* ---------- paper: the wall, canvases and sticky notes ---------- */
// a wall to pin drafts to: dark, warm, with a little texture
function wallBg(ctx,S,t,o){o=o||{};setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#2b2620");g.addColorStop(1,"#15120f");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(let i=0;i<70;i++){const x=hash(i,31)*W,y=hash(i,32)*H,r=60+hash(i,33)*200,gg=ctx.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,"rgba(255,240,210,"+(0.012+0.02*hash(i,34))+")");gg.addColorStop(1,"rgba(255,240,210,0)");ctx.fillStyle=gg;ctx.fillRect(x-r,y-r,2*r,2*r);}
  const l=ctx.createRadialGradient(W*0.5,H*0.25,40,W*0.5,H*0.4,W*0.7);l.addColorStop(0,"rgba(255,226,180,"+(o.light==null?0.10:o.light)+")");l.addColorStop(1,"rgba(255,226,180,0)");ctx.fillStyle=l;ctx.fillRect(0,0,W,H);}
// how far a note has been validated: hollow (not started), half (a draft), full (confirmed by its owner); v from 0 to 1 fills it round
function statusDot(ctx,x,y,r,v,col,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.6,r*0.2);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();
  if(v>0.01){ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+TAU*clamp(v,0,1));ctx.closePath();ctx.fill();}ctx.restore();});}
// a sticky note, centred at (cx,cy): paper by default, glass as o.glass goes to 1 (confirmed, part of the model).
// o.col: its paper; o.edge: its glass colour; o.rot; o.p: how much of the text is written; o.src: a source tag clipped to it; o.st: its status (0..1), or none
function sticky(ctx,cx,cy,w,h,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||NOTEC[0],gl=clamp(o.glass||0,0,1),edge=o.edge||col,sz=o.size||Math.round(h*0.2),rot=(o.rot==null?(hash(text.length,7)-0.5)*0.08:o.rot)*(1-gl);
  withA(ctx,a,()=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);
    if(gl<1)withA(ctx,1-gl,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=16;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(col,1);ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
      const g=ctx.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,"rgba(0,0,0,0.08)");g.addColorStop(0.18,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(255,255,255,0.10)");ctx.fillStyle=g;ctx.fillRect(-w/2,-h/2,w,h);
      // the corner lifts a little
      ctx.fillStyle="rgba(0,0,0,0.10)";ctx.beginPath();ctx.moveTo(w/2,h/2-16);ctx.lineTo(w/2-16,h/2);ctx.lineTo(w/2,h/2);ctx.closePath();ctx.fill();
      const ls=wrapT(ctx,text,0,0,w-28,{size:sz,w:700,measure:true}),lh=sz*1.18,y0=-((ls.length-1)*lh)/2+sz*0.36;let left=text.length*(o.p==null?1:o.p);
      ls.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;T(ctx,s_,0,y0+i*lh,{w:700,size:sz,align:"center",color:rgba(INKD,0.9),deco:o.deco});});});
    if(gl>0)withA(ctx,gl,()=>{glass(ctx,-w/2,-h/2,w,h,12,edge,{glow:16,ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(edge,0.12);rr(ctx,-w/2,-h/2,w,h,12);ctx.fill();
      const ls=wrapT(ctx,text,0,0,w-28,{size:sz,w:700,measure:true}),lh=sz*1.18,y0=-((ls.length-1)*lh)/2+sz*0.36;ls.forEach((l,i)=>T(ctx,l,0,y0+i*lh,{w:700,size:sz,align:"center",color:rgba(INK,0.96),deco:o.deco}));});
    if(o.st!=null)statusDot(ctx,w/2-15,-h/2+15,9,o.st,mix(INKD,edge,gl),1);
    if(o.src)withA(ctx,o.srcA==null?1:o.srcA,()=>{const ss=o.srcSize||28,tw_=tw(ctx,o.src,ss,700)+26;ctx.save();ctx.translate(-w/2+6,h/2-8);ctx.rotate(0.04);ctx.fillStyle="rgba(238,232,218,0.97)";ctx.shadowColor="rgba(0,0,0,0.4)";ctx.shadowBlur=6;ctx.fillRect(0,0,tw_,ss+16);ctx.shadowBlur=0;
      ctx.fillStyle="rgba(150,150,150,0.9)";ctx.fillRect(5,ss*0.45,6,10);T(ctx,o.src,18,ss+5,{w:700,size:ss,color:"rgba(48,48,56,0.95)"});ctx.restore();});
    ctx.restore();});}
// marker lines on paper (a canvas drawn by hand): a slightly wobbly stroke, drawn up to p
function marker(ctx,pts,p,o){o=o||{};if(p<=0)return;const segs=[];let L=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);segs.push(d);L+=d;}let left=L*clamp(p,0,1);
  ctx.save();ctx.strokeStyle=o.col||rgba(INKD,0.85);ctx.lineWidth=o.lw||3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length&&left>0;i++){const f=Math.min(1,left/segs[i-1]),wob=(hash(i,o.seed||5)-0.5)*1.6;ctx.lineTo(lerp(pts[i-1][0],pts[i][0],f)+wob,lerp(pts[i-1][1],pts[i][1],f)-wob);left-=segs[i-1];}ctx.stroke();ctx.restore();}
function circlePts(cx,cy,r,n){const P=[];for(let i=0;i<=n;i++){const an=-Math.PI/2+i/n*TAU;P.push([cx+Math.cos(an)*r,cy+Math.sin(an)*r]);}return P;}
// the value proposition canvas, drawn in marker on a sheet: the value map (a square) and the customer profile (a circle)
function vpCanvas(ctx,x,y,w,h,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.01:o.rot});
  const s=Math.min(w*0.36,h*0.62),sx=x+w*0.08,sy=y+(h-s)/2+14,cx=x+w*0.92-s/2,cy=sy+s/2,lab={size:15,w:700,color:"rgba(60,58,62,0.85)"};
  T(ctx,"value proposition canvas",x+22,y+38,{w:800,size:24,color:"rgba(60,58,62,0.9)",deco:1});
  marker(ctx,[[sx,sy],[sx+s,sy],[sx+s,sy+s],[sx,sy+s],[sx,sy]],clamp(p*2,0,1));marker(ctx,[[sx+s/2,sy+s/2],[sx+s/2,sy]],clamp(p*3-1.2,0,1),{lw:2});marker(ctx,[[sx+s/2,sy+s/2],[sx,sy+s]],clamp(p*3-1.3,0,1),{lw:2});marker(ctx,[[sx+s/2,sy+s/2],[sx+s,sy+s]],clamp(p*3-1.4,0,1),{lw:2});
  marker(ctx,circlePts(cx,cy,s/2,40),clamp(p*2-0.4,0,1));marker(ctx,[[cx,cy],[cx,cy-s/2]],clamp(p*3-1.6,0,1),{lw:2});marker(ctx,[[cx,cy],[cx-s*0.43,cy+s*0.25]],clamp(p*3-1.7,0,1),{lw:2});marker(ctx,[[cx,cy],[cx+s*0.43,cy+s*0.25]],clamp(p*3-1.8,0,1),{lw:2});
  withA(ctx,clamp(p*3-2,0,1),()=>{T(ctx,"what we offer",sx+s/2,sy+s+28,{...lab,align:"center",deco:1});T(ctx,"who we serve",cx,sy+s+28,{...lab,align:"center",deco:1});});});}
// the business model canvas: nine blocks, drawn in marker on a sheet
const BMC9=[["key partners",0,0,1,2],["key activities",1,0,1,1],["key resources",1,1,1,1],["value propositions",2,0,1,2],["relationships",3,0,1,1],["channels",3,1,1,1],["customer segments",4,0,1,2],["costs",0,2,2.5,1],["revenue",2.5,2,2.5,1]];
function bmCanvas(ctx,x,y,w,h,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?0.012:o.rot});
  T(ctx,"business model canvas",x+22,y+38,{w:800,size:24,color:"rgba(60,58,62,0.9)",deco:1});const gx=x+20,gy=y+52,cw=(w-40)/5,ch=(h-72)/3;
  BMC9.forEach(([nm,c,r,cs,rs],i)=>{const q=clamp(p*10-i,0,1);if(q<=0)return;const bx=gx+c*cw,by=gy+r*ch,bw=cs*cw,bh=rs*ch;marker(ctx,[[bx,by],[bx+bw,by],[bx+bw,by+bh],[bx,by+bh],[bx,by]],q,{lw:2.4,seed:i+3});
    withA(ctx,q,()=>T(ctx,nm,bx+10,by+22,{w:700,size:13,color:"rgba(60,58,62,0.8)",deco:1}));});});}

/* ---------- glass: the model ---------- */
// an element of the model, in its layer's colour, with a small glyph in the corner for its kind (o.gs: the glyph's size, 13 by default;
// o.deco: its name is texture, as in a map drawn small, and the legibility check skips it)
function archGlyph(ctx,kind,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";ctx.lineCap="round";
  if(kind==="capability"){[[0,2],[1,1],[1,2],[2,0],[2,1],[2,2]].forEach(([i,j])=>ctx.strokeRect(x-s*0.75+i*s*0.5,y-s*0.75+j*s*0.5,s*0.5,s*0.5));}
  else if(kind==="process"){ctx.beginPath();ctx.moveTo(x-s*0.8,y-s*0.25);ctx.lineTo(x+s*0.2,y-s*0.25);ctx.lineTo(x+s*0.2,y-s*0.55);ctx.lineTo(x+s*0.8,y);ctx.lineTo(x+s*0.2,y+s*0.55);ctx.lineTo(x+s*0.2,y+s*0.25);ctx.lineTo(x-s*0.8,y+s*0.25);ctx.closePath();ctx.stroke();}
  else if(kind==="stakeholder"||kind==="role"){ctx.beginPath();ctx.ellipse(x+s*0.5,y,s*0.22,s*0.4,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x+s*0.5,y-s*0.4);ctx.lineTo(x-s*0.5,y-s*0.4);ctx.ellipse(x-s*0.5,y,s*0.22,s*0.4,0,-Math.PI/2,Math.PI/2,true);ctx.lineTo(x+s*0.5,y+s*0.4);ctx.stroke();}
  else if(kind==="goal"){[0.8,0.5,0.18].forEach(r=>{ctx.beginPath();ctx.arc(x,y,s*r,0,TAU);ctx.stroke();});}
  else if(kind==="component"){ctx.strokeRect(x-s*0.45,y-s*0.6,s*1.1,s*1.2);ctx.fillStyle="rgba(7,12,24,1)";[-0.3,0.15].forEach(d=>{ctx.fillRect(x-s*0.7,y+d*s,s*0.5,s*0.25);ctx.strokeRect(x-s*0.7,y+d*s,s*0.5,s*0.25);});}
  else if(kind==="node"){ctx.strokeRect(x-s*0.7,y-s*0.4,s*1.1,s*1.0);ctx.beginPath();ctx.moveTo(x-s*0.7,y-s*0.4);ctx.lineTo(x-s*0.4,y-s*0.7);ctx.lineTo(x+s*0.7,y-s*0.7);ctx.lineTo(x+s*0.4,y-s*0.4);ctx.moveTo(x+s*0.7,y-s*0.7);ctx.lineTo(x+s*0.7,y+s*0.3);ctx.lineTo(x+s*0.4,y+s*0.6);ctx.stroke();}
  else if(kind==="object"){ctx.strokeRect(x-s*0.75,y-s*0.55,s*1.5,s*1.1);ctx.beginPath();ctx.moveTo(x-s*0.75,y-s*0.2);ctx.lineTo(x+s*0.75,y-s*0.2);ctx.stroke();}
  else if(kind==="value"){ctx.beginPath();ctx.ellipse(x,y,s*0.8,s*0.45,0,0,TAU);ctx.stroke();}
  // a value stream, as ArchiMate draws it: a chevron
  else if(kind==="stream"){ctx.beginPath();ctx.moveTo(x-s*0.8,y-s*0.45);ctx.lineTo(x+s*0.35,y-s*0.45);ctx.lineTo(x+s*0.8,y);ctx.lineTo(x+s*0.35,y+s*0.45);ctx.lineTo(x-s*0.8,y+s*0.45);ctx.lineTo(x-s*0.35,y);ctx.closePath();ctx.stroke();}
  // the rest of the motivation layer, as ArchiMate draws it: a driver is a wheel, an assessment a magnifying glass, an outcome a target
  // with an arrow in it, a principle an exclamation mark in a box
  else if(kind==="driver"){ctx.beginPath();ctx.arc(x,y,s*0.55,0,TAU);ctx.stroke();ctx.beginPath();for(let i=0;i<8;i++){const an=i*TAU/8;ctx.moveTo(x+Math.cos(an)*s*0.15,y+Math.sin(an)*s*0.15);ctx.lineTo(x+Math.cos(an)*s*0.8,y+Math.sin(an)*s*0.8);}ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*0.15,0,TAU);ctx.fill();}
  else if(kind==="assessment"){ctx.beginPath();ctx.arc(x+s*0.15,y-s*0.15,s*0.45,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.17,y+s*0.17);ctx.lineTo(x-s*0.75,y+s*0.75);ctx.stroke();}
  else if(kind==="outcome"){[0.75,0.45,0.15].forEach(r=>{ctx.beginPath();ctx.arc(x-s*0.1,y+s*0.1,s*r,0,TAU);ctx.stroke();});ctx.beginPath();ctx.moveTo(x-s*0.1,y+s*0.1);ctx.lineTo(x+s*0.8,y-s*0.8);ctx.moveTo(x+s*0.8,y-s*0.8);ctx.lineTo(x+s*0.45,y-s*0.8);ctx.moveTo(x+s*0.8,y-s*0.8);ctx.lineTo(x+s*0.8,y-s*0.45);ctx.stroke();}
  // who does the work, as ArchiMate draws it: an actor is a stick figure; a contract is a business object with a second line
  else if(kind==="actor"){ctx.beginPath();ctx.arc(x,y-s*0.55,s*0.25,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y-s*0.3);ctx.lineTo(x,y+s*0.3);ctx.moveTo(x-s*0.45,y-s*0.08);ctx.lineTo(x+s*0.45,y-s*0.08);ctx.moveTo(x-s*0.4,y+s*0.8);ctx.lineTo(x,y+s*0.3);ctx.lineTo(x+s*0.4,y+s*0.8);ctx.stroke();}
  else if(kind==="contract"){ctx.strokeRect(x-s*0.75,y-s*0.55,s*1.5,s*1.1);ctx.beginPath();ctx.moveTo(x-s*0.75,y-s*0.2);ctx.lineTo(x+s*0.75,y-s*0.2);ctx.moveTo(x-s*0.75,y+s*0.15);ctx.lineTo(x+s*0.75,y+s*0.15);ctx.stroke();}
  // what it has, and the path to a target, as ArchiMate draws them: a resource is a capsule with bars, like a battery; a plateau is
  // three stepped lines; a gap is an ellipse crossed by two lines
  else if(kind==="resource"){rr(ctx,x-s*0.8,y-s*0.42,s*1.5,s*0.84,s*0.3);ctx.stroke();ctx.fillRect(x+s*0.7,y-s*0.16,s*0.14,s*0.32);[-0.45,-0.15,0.15].forEach(d=>{ctx.beginPath();ctx.moveTo(x+d*s,y-s*0.22);ctx.lineTo(x+d*s,y+s*0.22);ctx.stroke();});}
  else if(kind==="plateau"){ctx.beginPath();[[-0.4,-0.45],[-0.1,0],[0.2,0.45]].forEach(([dx,dy])=>{ctx.moveTo(x+(dx-0.45)*s,y+dy*s);ctx.lineTo(x+(dx+0.45)*s,y+dy*s);});ctx.stroke();}
  else if(kind==="gap"){ctx.beginPath();ctx.ellipse(x,y,s*0.6,s*0.45,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.9,y-s*0.15);ctx.lineTo(x+s*0.9,y-s*0.15);ctx.moveTo(x-s*0.9,y+s*0.15);ctx.lineTo(x+s*0.9,y+s*0.15);ctx.stroke();}
  else if(kind==="principle"){ctx.strokeRect(x-s*0.6,y-s*0.7,s*1.2,s*1.4);ctx.beginPath();ctx.moveTo(x,y-s*0.45);ctx.lineTo(x,y+s*0.15);ctx.stroke();ctx.beginPath();ctx.arc(x,y+s*0.42,s*0.08,0,TAU);ctx.fill();}
  ctx.restore();}
function archEl(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const r=kind==="capability"||kind==="process"||kind==="value"?16:6;
  glass(ctx,x,y,w,h,r,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.16+0.1*(o.hi||0));rr(ctx,x,y,w,h,r);ctx.fill();
  const gs=o.gs||13;archGlyph(ctx,kind,x+w-gs-11,y+gs+9,gs,col);const sz=o.size||28,ls=wrapT(ctx,name,0,0,w-64,{size:sz,w:700,measure:true});wrapT(ctx,name,x+w/2-8,y+h/2+sz*0.36-(ls.length-1)*sz*0.58,w-64,{size:sz,w:700,align:"center",color:rgba(INK,0.96),lh:sz*1.15,deco:o.deco});});}

/* ---------- small things ---------- */
// a data rule, as the data series draw one: a card with a monospaced kicker
function ruleCard(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const col=o.col||[170,205,255],sz=o.size||32,ls=wrapT(ctx,text,0,0,w-48,{size:sz,w:700,measure:true}),h=84+ls.length*sz*1.25;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:14+12*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.95)"});T(ctx,o.kicker||"data rule",x+24,y+42,{f:"mono",w:500,size:28,color:rgba(col,1)});
    ls.forEach((l,i)=>T(ctx,l,x+24,y+88+i*sz*1.25,{w:700,size:sz}));});return h;}
// an owner's tick, in gold: a person who owns that part of the business says it's right
function ownerTick(ctx,x,y,r,a){kt_gtick(ctx,x,y,r,a);}

/* ---------- the canvases, labelled, for notes to be pinned into ---------- */
// The value proposition canvas, at a size to work on: the value map (a square: products and services on the left, gain creators
// top right, pain relievers bottom right) and the customer profile (a circle: gains top left, pains bottom left, jobs on the right).
// Returns where each section is, so notes can be placed in it: VPC.where(x,y,w,h)[section] = [cx, cy].
const VPC={secs:["products and services","gain creators","pain relievers","gains","pains","customer jobs"],
  geo(x,y,w,h){const s=Math.min(w*0.38,h*0.74),sx=x+w*0.05,sy=y+(h-s)/2+18,r=s/2,cx=x+w*0.95-r,cy=sy+r;return{s,sx,sy,r,cx,cy};},
  where(x,y,w,h){const g=VPC.geo(x,y,w,h);return{"products and services":[g.sx+g.s*0.25,g.sy+g.s*0.5],"gain creators":[g.sx+g.s*0.75,g.sy+g.s*0.27],"pain relievers":[g.sx+g.s*0.75,g.sy+g.s*0.73],
    "gains":[g.cx-g.r*0.42,g.cy-g.r*0.45],"pains":[g.cx-g.r*0.42,g.cy+g.r*0.45],"customer jobs":[g.cx+g.r*0.48,g.cy]};}};
// p draws it; o.title names it; o.lab (0..1) shows the section names; o.hi[section] lights one
function vpCanvas2(ctx,x,y,w,h,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.006:o.rot});const g=VPC.geo(x,y,w,h),hi=o.hi||{};
  T(ctx,o.title||"value proposition canvas",x+26,y+42,{w:800,size:o.titleSize||28,color:"rgba(60,58,62,0.9)",deco:o.titleSize<28||o.titleDeco});
  const glowSec=(k,fn)=>{const v=hi[k]||0;if(v>0)withA(ctx,v,()=>{ctx.save();fn();ctx.fillStyle="rgba(255,200,90,0.22)";ctx.fill();ctx.restore();});};
  glowSec("products and services",()=>{ctx.beginPath();ctx.rect(g.sx,g.sy,g.s/2,g.s);});glowSec("gain creators",()=>{ctx.beginPath();ctx.rect(g.sx+g.s/2,g.sy,g.s/2,g.s/2);});glowSec("pain relievers",()=>{ctx.beginPath();ctx.rect(g.sx+g.s/2,g.sy+g.s/2,g.s/2,g.s/2);});
  glowSec("gains",()=>{ctx.beginPath();ctx.moveTo(g.cx,g.cy);ctx.arc(g.cx,g.cy,g.r,Math.PI,Math.PI*1.5);ctx.closePath();});glowSec("pains",()=>{ctx.beginPath();ctx.moveTo(g.cx,g.cy);ctx.arc(g.cx,g.cy,g.r,Math.PI*0.5,Math.PI);ctx.closePath();});
  glowSec("customer jobs",()=>{ctx.beginPath();ctx.moveTo(g.cx,g.cy);ctx.arc(g.cx,g.cy,g.r,-Math.PI/2,Math.PI/2);ctx.closePath();});
  marker(ctx,[[g.sx,g.sy],[g.sx+g.s,g.sy],[g.sx+g.s,g.sy+g.s],[g.sx,g.sy+g.s],[g.sx,g.sy]],clamp(p*2,0,1));marker(ctx,[[g.sx+g.s/2,g.sy],[g.sx+g.s/2,g.sy+g.s]],clamp(p*3-1.2,0,1),{lw:2});marker(ctx,[[g.sx+g.s/2,g.sy+g.s/2],[g.sx+g.s,g.sy+g.s/2]],clamp(p*3-1.3,0,1),{lw:2});
  marker(ctx,circlePts(g.cx,g.cy,g.r,48),clamp(p*2-0.4,0,1));marker(ctx,[[g.cx,g.cy-g.r],[g.cx,g.cy+g.r]],clamp(p*3-1.6,0,1),{lw:2});marker(ctx,[[g.cx-g.r,g.cy],[g.cx,g.cy]],clamp(p*3-1.7,0,1),{lw:2});
  withA(ctx,clamp(p*3-2,0,1)*(o.lab==null?1:o.lab),()=>{const L={size:16,w:800,color:"rgba(70,66,70,0.75)",deco:1};
    T(ctx,"products & services",g.sx+12,g.sy+26,L);T(ctx,"gain creators",g.sx+g.s/2+12,g.sy+26,L);T(ctx,"pain relievers",g.sx+g.s/2+12,g.sy+g.s/2+26,L);
    T(ctx,"gains",g.cx-g.r*0.62,g.cy-g.r*0.78,L);T(ctx,"pains",g.cx-g.r*0.62,g.cy+g.r*0.86,L);T(ctx,"customer jobs",g.cx+14,g.cy-g.r*0.78,L);
    T(ctx,"value map",g.sx+g.s/2,g.sy+g.s+30,{...L,align:"center"});T(ctx,"customer profile",g.cx,g.sy+g.s+30,{...L,align:"center"});});});}
// where each block of the business model canvas is, for bmCanvas(x,y,w,h): BMC_AT(x,y,w,h,i) = [bx, by, bw, bh]
function BMC_AT(x,y,w,h,i){const gx=x+20,gy=y+52,cw=(w-40)/5,ch=(h-72)/3,[,c,r,cs,rs]=BMC9[i];return[gx+c*cw,gy+r*ch,cs*cw,rs*ch];}

/* ---------- legibility: big enough for a phone ---------- */
// The films are drawn at 1920 by 1080. A phone held sideways, full screen, shows that about 850 pixels wide, so the smallest text that
// reads comfortably there is about 28 px in the frame: tools/legible.py checks every piece of text against it. Text marked deco:1
// (a scrolling list of systems, a canvas's printed headings) is texture, not something to read, and the check skips it.
const MINT=28;
// a year and place, in the corner, large enough to read
function eaYear(ctx,x,y,s,col,a){if(a==null)a=1;if(a<=0.01)return;withA(ctx,a,()=>{const c=col||CLAY,w=tw(ctx,s,28,500,"mono")+52;glass(ctx,x,y-30,w,60,30,c,{glow:14,ea:0.8,fill:"rgba(26,16,10,0.9)"});
  ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x+24,y,6,0,TAU);ctx.fill();T(ctx,s,x+40,y+10,{f:"mono",w:500,size:28,color:rgba(c,1)});});}
// the camera, moving in on what the narration is about: keys are [time, x, y, zoom], each move eased over d seconds (default 1.4);
// call after the background, before drawing the scene. Combine with drift for the slow push of every shot.
function focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return z;}
// how far the camera is zoomed in at t, for the same keys: a whole canvas seen from afar is context, and its notes are decoration
function focusZ(t,keys,d){d=d||1.4;let z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;z=lerp(z,keys[i][3],u);}return z;}

/* ===== Rules with a home: the film's own pictures (prefixed d9_) =====
   Tartu, today, at dawn: the Emajõgi narrowing to its arch bridge, Kaarsild, with the old town behind it and one window lit; the
   population register, and the offices that ask it over X-Road instead of keeping copies; a parent's phone with the Social
   Insurance Board's offer; the catalogue that lists every database with its owner. At the utility, on the wall and on the films'
   dark glass: day one's data rule and the bill of $412.80; the household away in June and its meter's stored readings; the nightly
   script on the wall between the network and retail, writing to a queue nothing reads; the rule in five places; the rule split in
   two, one on each side, joined by what crosses; where each comes from; what it's about; the step it's attached to and what that
   step expects of the data; the rule in a set form, with the checks generated from it; and the concepts, relationships and rules,
   generally an ontology.
   Tartu is drawn in the series' own style, not in the style of Estonian art (PLAYBOOK §2): the places are real, the family is
   illustrative, and the offices' marks are not drawn. */

const MOT=LAY6[0][1],STR=LAY6[1][1],BUS=LAY6[2][1],INF=LAY6[3][1],APL=LAY6[4][1];
// the two sides of the wall, as in Who does it: the network in blue, retail in rose; red, for what fails; green, for a job that ran
const D9_NET=[132,176,255],D9_RET=[255,150,186],D9_RED=[232,96,84],D9_OK=[120,210,130];
// Tartu: the register's glass, pale as frost, and the dawn
const D9_TAR=[196,222,255],D9_DAWN=[255,196,140];
// someone standing at the right of the frame, drawn facing the other way: the "explain" gesture then points at what they explain
function d9_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}
// no-break spaces: words a note should keep on one line
const d9_nb=s=>s.replace(/ /g," ");

/* ---------- Tartu, at dawn ---------- */
// Looking down the Emajõgi from its bank: the river narrows to Kaarsild, the arch bridge students walk over the top of, with the
// old town behind it (Toome Hill's trees and the cathedral's two towers on the left, the town hall's tower at the bridge's end,
// St John's tower beyond). A sketch, not a survey. u (0..1) brings the light up.
const D9_LB=[[-60,1010],[180,880],[380,770],[520,694],[612,646],[668,624]],D9_RB=[[1480,1100],[1418,930],[1352,800],[1292,700],[1248,646],[1222,624]];
function d9_sky(ctx,t,u){const g=ctx.createLinearGradient(0,-200,0,640);g.addColorStop(0,rgba(mix([5,8,22],[26,38,76],u),1));g.addColorStop(0.5,rgba(mix([12,18,40],[78,84,128],u),1));
  g.addColorStop(0.86,rgba(mix([26,28,52],[204,146,124],u),1));g.addColorStop(1,rgba(mix([34,32,54],[246,182,134],u),1));ctx.fillStyle=g;ctx.fillRect(-600,-400,W+1200,1040);
  for(let i=0;i<110;i++){const x=hash(i,901)*W*1.3-W*0.15,y=hash(i,902)*460-120,tw_=0.55+0.45*Math.sin(t*1.3+i*2.1);ctx.fillStyle="rgba(232,238,255,"+(0.7*(1-u)*tw_*hash(i,903))+")";ctx.fillRect(x,y,1.8,1.8);}
  // the sun, still under the far bank: its glow where it will rise, behind the town
  glow(ctx,1090,640,640,D9_DAWN,0.22*u);glow(ctx,1090,630,240,[255,224,186],0.3*u);
  // thin clouds, lit from below
  for(let i=0;i<7;i++){const cx=((hash(i,904)*2200+t*(3+hash(i,905)*4))%2400)-240,cy=200+hash(i,906)*300,cw=260+hash(i,907)*380;ctx.save();ctx.globalAlpha*=0.16+0.18*u;
    const cg=ctx.createLinearGradient(0,cy-14,0,cy+14);cg.addColorStop(0,"rgba(120,110,150,0)");cg.addColorStop(0.6,rgba(mix([60,64,96],[255,190,160],u),1));cg.addColorStop(1,"rgba(120,110,150,0)");
    ctx.fillStyle=cg;ctx.beginPath();ctx.ellipse(cx,cy,cw/2,12+hash(i,908)*10,0,0,TAU);ctx.fill();ctx.restore();}}
// the old town behind the bridge, as silhouettes in two depths, a few windows lit
function d9_city(ctx,t,u){const base=618,far=mix([16,20,38],[86,72,96],u),mid=mix([12,14,28],[56,46,66],u),lit=[255,206,140],skyc=mix([34,36,64],[214,158,140],u);
  // Toome Hill, and on it the cathedral's ruin: the nave's empty pointed arches, with the sky through them, and its two towers
  ctx.fillStyle=rgba(far,1);ctx.beginPath();ctx.moveTo(-200,base);ctx.bezierCurveTo(-40,560,170,500,360,500);ctx.bezierCurveTo(520,500,600,560,720,base);ctx.closePath();ctx.fill();
  ctx.fillRect(184,456,150,56);for(let k=0;k<4;k++){const ox=194+k*34;ctx.fillStyle=rgba(skyc,0.5);ctx.beginPath();ctx.moveTo(ox,512);ctx.lineTo(ox,478);ctx.quadraticCurveTo(ox,466,ox+9,460);ctx.quadraticCurveTo(ox+18,466,ox+18,478);ctx.lineTo(ox+18,512);ctx.closePath();ctx.fill();}
  ctx.fillStyle=rgba(far,1);[[332,44],[388,44]].forEach(([x,w])=>{ctx.fillRect(x,416,w,100);for(let k=0;k<4;k++)ctx.fillRect(x+k*(w/4)+1,408,w/8,10);
    ctx.fillStyle=rgba(mix(far,[0,0,0],0.45),1);[438,474].forEach(wy=>{ctx.beginPath();ctx.moveTo(x+w/2-5,wy+20);ctx.lineTo(x+w/2-5,wy+6);ctx.quadraticCurveTo(x+w/2,wy-2,x+w/2+5,wy+6);ctx.lineTo(x+w/2+5,wy+20);ctx.closePath();ctx.fill();});ctx.fillStyle=rgba(far,1);});
  // the hill's trees, in front of the ruin's feet
  for(let i=0;i<46;i++){const x=-170+i*19,top=i<6?560-i*9:i<30?506-6*Math.sin(i*0.7)-8*hash(i,921):500+(i-30)*7,r=14+hash(i,922)*12;if(x>720)break;ctx.fillStyle=rgba(mix(far,[30,40,20],0.15+0.2*hash(i,920)),1);ctx.beginPath();ctx.arc(x,top+r*0.5+(x>180&&x<440?14:0),r,0,TAU);ctx.fill();}
  // roofs down to the water, in front of the hill
  ctx.fillStyle=rgba(mid,1);for(let i=0;i<40;i++){const x=40+i*48+hash(i,923)*20,w=54+hash(i,924)*40,h=26+hash(i,925)*36;if(x>880&&x<1040)continue;const y=base-h-(x<700?0:4);
    ctx.beginPath();ctx.moveTo(x,base);ctx.lineTo(x,y);if(hash(i,926)<0.6){ctx.lineTo(x+w/2,y-18-hash(i,927)*10);}ctx.lineTo(x+w,y);ctx.lineTo(x+w,base);ctx.closePath();ctx.fill();
    if(hash(i,928)<0.45){const wx=x+8+hash(i,929)*(w-20),wy=y+8+hash(i,930)*(h-18),f=0.6+0.4*Math.sin(t*0.7+i);ctx.fillStyle=rgba(lit,0.55*f*(1-0.5*u));ctx.fillRect(wx,wy,5,7);ctx.fillStyle=rgba(mid,1);}}
  // the town hall, at the end of the bridge, with its tower and spire
  ctx.fillStyle=rgba(mid,1);ctx.fillRect(868,540,184,base-540);ctx.beginPath();ctx.moveTo(860,542);ctx.lineTo(960,512);ctx.lineTo(1060,542);ctx.closePath();ctx.fill();
  ctx.fillRect(947,470,26,60);ctx.beginPath();ctx.moveTo(943,472);ctx.lineTo(960,420);ctx.lineTo(977,472);ctx.closePath();ctx.fill();ctx.fillRect(959,406,2,16);
  for(let k=0;k<7;k++){const f=0.7+0.3*Math.sin(t*0.5+k*1.3);ctx.fillStyle=rgba(lit,(k%3===1?0.7:0.35)*f*(1-0.4*u));ctx.fillRect(884+k*24,568,8,12);}ctx.fillStyle=rgba(lit,0.6*(1-0.3*u));ctx.beginPath();ctx.arc(960,492,5,0,TAU);ctx.fill();
  // St John's tower, beyond the roofs on the right
  ctx.fillStyle=rgba(far,1);ctx.fillRect(1282,450,52,base-450);ctx.beginPath();ctx.moveTo(1276,454);ctx.lineTo(1308,404);ctx.lineTo(1340,454);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(mix(far,[0,0,0],0.4),1);ctx.beginPath();ctx.moveTo(1302,500);ctx.lineTo(1302,480);ctx.quadraticCurveTo(1308,470,1314,480);ctx.lineTo(1314,500);ctx.closePath();ctx.fill();
  // mist on the water, at the far end
  for(let i=0;i<5;i++){const mx=((i*420+t*(6+i*2))%2400)-300,my=606+i*6;ctx.save();ctx.globalAlpha*=0.1+0.08*u;const mg=ctx.createRadialGradient(mx,my,10,mx,my,320);mg.addColorStop(0,"rgba(230,226,240,1)");mg.addColorStop(1,"rgba(230,226,240,0)");
    ctx.fillStyle=mg;ctx.beginPath();ctx.ellipse(mx,my,320,26,0,0,TAU);ctx.fill();ctx.restore();}}
// trees along both banks, smaller towards the bridge, in their autumn colours
function d9_bankTrees(ctx,t,u){const along=(B,k)=>{let L=0;const D=[0];for(let i=1;i<B.length;i++){L+=Math.hypot(B[i][0]-B[i-1][0],B[i][1]-B[i-1][1]);D.push(L);}const d=L*k;let i=1;while(i<B.length-1&&D[i]<d)i++;const f=(d-D[i-1])/((D[i]-D[i-1])||1);return[lerp(B[i-1][0],B[i][0],f),lerp(B[i-1][1],B[i][1],f)];};
  const tree=(x,y,s,i)=>{const sw=Math.sin(t*0.6+i)*2*s,dark=mix([10,12,16],[40,40,36],u);ctx.fillStyle=rgba(dark,1);ctx.fillRect(x-3*s,y-60*s,6*s,60*s);
    for(let k=0;k<6;k++){const cx=x+(hash(i*7+k,981)-0.5)*44*s+sw,cy=y-70*s-hash(i*7+k,982)*50*s,r=(18+hash(i*7+k,983)*14)*s,warm=hash(i*7+k,984);
      ctx.fillStyle=rgba(mix(mix([14,18,20],[60,64,40],u),mix([60,46,20],[214,156,60],u),warm*0.6),1);ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();}};
  // drawn far to near, so the near ones overlap
  for(let k=9;k>=0;k--){const v=k/9,[x,y]=along(D9_LB.slice().reverse(),v*0.85),s=lerp(0.28,1.25,v*v);tree(x-70*s-24,y-6*s,s,k);}
  for(let k=5;k>=0;k--){const v=k/5,[x,y]=along(D9_RB.slice().reverse(),v*0.5),s=lerp(0.28,0.8,v);tree(x+60*s+20,y-6*s,s,20+k);}}
// the river, from the bridge to our bank: the sky in it, ripples, the dawn's column of light
function d9_river(ctx,t,u){ctx.save();ctx.beginPath();ctx.moveTo(D9_LB[0][0],D9_LB[0][1]);D9_LB.forEach(p=>ctx.lineTo(p[0],p[1]));D9_RB.slice().reverse().forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(1480,1100);ctx.lineTo(-60,1100);ctx.closePath();
  const g=ctx.createLinearGradient(0,618,0,1080);g.addColorStop(0,rgba(mix([30,30,54],[196,150,140],u),1));g.addColorStop(0.25,rgba(mix([16,20,40],[84,86,124],u),1));g.addColorStop(1,rgba(mix([5,8,18],[16,24,46],u),1));ctx.fillStyle=g;ctx.fill();ctx.clip();
  // the dawn's light, laid on the water under where the sun will rise
  const cg=ctx.createLinearGradient(0,620,0,1080);cg.addColorStop(0,rgba(D9_DAWN,0.5*u));cg.addColorStop(1,rgba(D9_DAWN,0));ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(1050,620);ctx.lineTo(1130,620);ctx.lineTo(1330,1100);ctx.lineTo(850,1100);ctx.closePath();ctx.fill();
  // ripples: short strokes, closer together towards the bridge, drifting
  for(let i=0;i<150;i++){const v=hash(i,931),y=622+Math.pow(v,1.7)*470,k=(y-616)/464,x0=lerp(700,-60,k),x1=lerp(1222,1480,k),x=x0+((hash(i,932)*(x1-x0)+t*(8+20*k))%(x1-x0)),len=(10+46*k)*(0.5+hash(i,933));
    const warm=Math.abs(x-lerp(1090,1090,k))<lerp(40,240,k)?1:0;ctx.strokeStyle=warm?rgba(mix([255,220,180],D9_DAWN,0.4),(0.18+0.4*u)*(0.4+0.6*k)):rgba([170,186,230],0.06+0.1*k);ctx.lineWidth=0.8+1.6*k;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+len,y+Math.sin(t+i)*0.6);ctx.stroke();}
  ctx.restore();}
// Kaarsild: a deck on piers, and its arch over the top, with hangers; its reflection under it
function d9_bridge(ctx,t,u){const y=626,x0=604,x1=1290,ax0=648,ax1=1246,top=528,col=mix([110,112,136],[244,226,214],u),sh=mix([24,24,40],[96,84,100],u);
  const arch=(k)=>{const x=lerp(ax0,ax1,k);return[x,y-(y-top)*(1-Math.pow(2*k-1,2))];};
  // the reflection first, rippled and faint
  ctx.save();ctx.globalAlpha*=0.32;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=7;ctx.beginPath();for(let i=0;i<=40;i++){const[x,yy]=arch(i/40),ry=2*y+16-yy+Math.sin(i*1.7+t*2)*2;i?ctx.lineTo(x,ry):ctx.moveTo(x,ry);}ctx.stroke();
  ctx.fillStyle=rgba(col,1);ctx.fillRect(x0,y+12,x1-x0,6);ctx.restore();
  // the deck and its edge
  ctx.fillStyle=rgba(sh,1);ctx.fillRect(x0,y,x1-x0,12);ctx.fillStyle=rgba(col,0.9);ctx.fillRect(x0,y-2,x1-x0,4);
  // hangers, then the arch, catching the light along its top
  ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=2;for(let i=1;i<18;i++){const[x,yy]=arch(i/18);ctx.beginPath();ctx.moveTo(x,yy+6);ctx.lineTo(x,y);ctx.stroke();}
  ctx.strokeStyle=rgba(sh,1);ctx.lineWidth=13;ctx.lineCap="round";ctx.beginPath();for(let i=0;i<=48;i++){const[x,yy]=arch(i/48);i?ctx.lineTo(x,yy):ctx.moveTo(x,yy);}ctx.stroke();
  ctx.strokeStyle=rgba(col,1);ctx.lineWidth=5;ctx.beginPath();for(let i=0;i<=48;i++){const[x,yy]=arch(i/48);i?ctx.lineTo(x,yy-4):ctx.moveTo(x,yy-4);}ctx.stroke();
  // lamps along the deck, warm, and their glow
  for(let i=0;i<9;i++){const x=x0+40+i*(x1-x0-80)/8;glow(ctx,x,y-10,16,[255,214,150],0.5*(1-0.6*u));ctx.fillStyle="rgba(255,226,170,"+(0.9-0.5*u)+")";ctx.fillRect(x-1.5,y-14,3,4);}}
// the banks: the left with its path, lamps and birches; the right under the near building
function d9_banks(ctx,t,u){const gnd=mix([8,10,18],[30,28,40],u),path=mix([30,30,44],[110,96,100],u);
  ctx.fillStyle=rgba(gnd,1);ctx.beginPath();ctx.moveTo(-200,618);ctx.lineTo(700,618);D9_LB.slice().reverse().forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(-200,1100);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(1200,618);ctx.lineTo(2200,618);ctx.lineTo(2200,1100);ctx.lineTo(1480,1100);D9_RB.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.closePath();ctx.fill();
  // the stone edge of the left bank, and its path
  ctx.strokeStyle=rgba(path,1);ctx.lineWidth=3;ctx.beginPath();D9_LB.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]-2):ctx.moveTo(p[0],p[1]-2));ctx.stroke();
  ctx.strokeStyle=rgba(mix(path,[0,0,0],0.3),1);ctx.lineWidth=2;ctx.beginPath();D9_LB.forEach((p,i)=>{const q=[p[0]-80*(p[1]-616)/400,p[1]-20*(p[1]-616)/400];i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.stroke();
  // lamps along the path, smaller towards the bridge
  [[0.15,1],[0.4,0.66],[0.62,0.44],[0.8,0.3]].forEach(([k,s],i)=>{const x=lerp(560,-20,1-k)-60*s,y=lerp(650,1040,s*0.9);ctx.strokeStyle=rgba(mix(gnd,[0,0,0],0.4),1);ctx.lineWidth=5*s;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-230*s);ctx.stroke();
    glow(ctx,x,y-236*s,70*s,[255,206,140],0.55*(1-0.5*u));ctx.fillStyle="rgba(255,230,180,0.95)";ctx.beginPath();ctx.arc(x,y-236*s,7*s,0,TAU);ctx.fill();});}
// a birch, near: a pale trunk with dark marks, tapering branches, the last yellow leaves; it sways a little
function d9_birch(ctx,x,y,s,t,u){ctx.save();ctx.translate(x,y);const sw=Math.sin(t*0.6)*0.012,bark=mix([120,120,130],[226,220,212],u),mark=mix([10,10,16],[40,34,36],u);
  const br=(x0,y0,an,len,w,d,seed)=>{if(d>5||len<14)return;const a2=an+Math.sin(t*0.7+seed)*0.01*d+sw*d,x1=x0+Math.cos(a2)*len,y1=y0+Math.sin(a2)*len,cx=(x0+x1)/2+Math.cos(a2+1.57)*len*0.08,cy=(y0+y1)/2+Math.sin(a2+1.57)*len*0.08;
    ctx.strokeStyle=rgba(d<2?bark:mix(bark,mark,0.5),1);ctx.lineWidth=w;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(cx,cy,x1,y1);ctx.stroke();
    if(d>=3)for(let k=0;k<3;k++){const lx=lerp(x0,x1,0.5+k*0.25),ly=lerp(y0,y1,0.5+k*0.25)+6,on=hash(seed*7+k,941)<0.6;if(!on)continue;ctx.save();ctx.translate(lx,ly);ctx.rotate(hash(seed+k,942)*3+Math.sin(t+seed)*0.2);
      ctx.fillStyle=rgba(mix([150,120,40],[250,204,80],u),0.95);ctx.beginPath();ctx.moveTo(0,-7*s);ctx.quadraticCurveTo(6*s,0,0,7*s);ctx.quadraticCurveTo(-6*s,0,0,-7*s);ctx.fill();ctx.restore();}
    br(x1,y1,a2-0.42-hash(seed,943)*0.2,len*0.72,w*0.62,d+1,seed*2+1);br(x1,y1,a2+0.36+hash(seed,944)*0.2,len*0.66,w*0.6,d+1,seed*2+2);};
  // the trunk, tapering, with its dark marks
  ctx.fillStyle=rgba(bark,1);ctx.beginPath();ctx.moveTo(-16*s,0);ctx.bezierCurveTo(-12*s,-200*s,-8*s,-360*s,-4*s,-520*s);ctx.lineTo(4*s,-520*s);ctx.bezierCurveTo(8*s,-360*s,12*s,-200*s,16*s,0);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(mark,0.85);for(let k=0;k<14;k++){const yy=-20*s-k*36*s,ww=(14-k*0.7)*s;ctx.fillRect(-ww*(0.2+hash(k,945)*0.8),yy,ww*(0.6+hash(k,946)*0.6),3+hash(k,947)*4);}
  br(-2*s,-300*s,-2.2,150*s,7*s,1,1);br(2*s,-380*s,-0.9,140*s,6*s,1,2);br(0,-470*s,-1.8,130*s,5*s,1,3);br(0,-520*s,-1.45,120*s,4*s,2,4);ctx.restore();}
// leaves falling across the foreground
function d9_leaves(ctx,t,a,u){if(a<=0.01)return;withA(ctx,a,()=>{for(let i=0;i<10;i++){const sp=22+hash(i,951)*26,y=((hash(i,952)*1300+t*sp)%1300)-120,x=hash(i,953)*1500+Math.sin(t*0.8+i*2)*60-40,s=0.8+hash(i,954)*0.8;
  ctx.save();ctx.translate(x,y);ctx.rotate(t*(0.6+hash(i,955))+i);ctx.scale(Math.cos(t*1.6+i),1);ctx.fillStyle=rgba(mix([150,110,40],[248,196,70],u),0.9);ctx.beginPath();ctx.moveTo(0,-9*s);ctx.quadraticCurveTo(7*s,0,0,9*s);ctx.quadraticCurveTo(-7*s,0,0,-9*s);ctx.fill();
  ctx.strokeStyle="rgba(120,80,30,0.6)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-8*s);ctx.lineTo(0,8*s);ctx.stroke();ctx.restore();}});}
// the near building on the right bank, its windows dark but one: the family's, warm, the parents holding the baby
const D9_WIN=[1594,466,170,190];
function d9_building(ctx,t,u,o){o=o||{};const wall=mix([10,12,22],[38,34,48],u),edge=mix([30,30,46],[104,94,110],u);ctx.fillStyle=rgba(wall,1);ctx.beginPath();ctx.moveTo(1500,1100);ctx.lineTo(1500,236);ctx.lineTo(2100,190);ctx.lineTo(2100,1100);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(edge,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1500,1100);ctx.lineTo(1500,236);ctx.lineTo(2100,190);ctx.stroke();ctx.fillStyle=rgba(edge,0.8);ctx.fillRect(1494,230,14,12);
  // the other windows: dark glass with the sky in it, a frame and a sill; one or two lit, further in
  for(let r=0;r<4;r++)for(let c=0;c<2;c++){const x=1594+c*230,y=270+r*196,isW=r===1&&c===0;if(isW)continue;const gg=ctx.createLinearGradient(0,y,0,y+190);gg.addColorStop(0,rgba(mix([28,34,60],[110,104,140],u),1));gg.addColorStop(1,rgba(mix([8,10,20],[30,32,50],u),1));
    ctx.fillStyle=gg;ctx.fillRect(x,y,170,190);if(hash(r*2+c,961)<0.3){ctx.fillStyle="rgba(255,206,150,0.2)";ctx.fillRect(x+90,y+40,70,140);}
    ctx.strokeStyle=rgba(edge,0.9);ctx.lineWidth=4;ctx.strokeRect(x,y,170,190);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+85,y);ctx.lineTo(x+85,y+70);ctx.moveTo(x,y+70);ctx.lineTo(x+170,y+70);ctx.stroke();ctx.fillStyle=rgba(edge,1);ctx.fillRect(x-8,y+190,186,8);}
  // the family's window: warm light, a curtain, and their shapes against it
  const[wx,wy,ww,wh]=D9_WIN,lt=o.light==null?1:o.light;glow(ctx,wx+ww/2,wy+wh/2,300,[255,196,120],0.32*lt);ctx.save();rr(ctx,wx,wy,ww,wh,4);ctx.clip();
  const g=ctx.createRadialGradient(wx+ww*0.6,wy+wh*0.35,10,wx+ww/2,wy+wh/2,ww);g.addColorStop(0,"rgba(255,226,170,1)");g.addColorStop(1,"rgba(214,140,86,1)");ctx.fillStyle=g;ctx.fillRect(wx,wy,ww,wh);
  ctx.fillStyle="rgba(250,236,214,0.55)";ctx.beginPath();ctx.moveTo(wx,wy);ctx.lineTo(wx+40,wy);ctx.quadraticCurveTo(wx+26,wy+wh*0.6,wx+34,wy+wh);ctx.lineTo(wx,wy+wh);ctx.closePath();ctx.fill();
  d9_family(ctx,wx+ww*0.55,wy+wh,1,t);ctx.restore();ctx.strokeStyle=rgba(edge,1);ctx.lineWidth=5;ctx.strokeRect(wx,wy,ww,wh);ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh*0.31);ctx.moveTo(wx,wy+wh*0.31);ctx.lineTo(wx+ww,wy+wh*0.31);ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle=rgba(edge,1);ctx.fillRect(wx-8,wy+wh,ww+16,8);}
// the parents, against the light: one holding the baby, swaddled, the other leaning in; they breathe
function d9_family(ctx,x,y,s,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const sil="rgba(70,40,34,0.92)",br=Math.sin(t*1.4)*1.2;
  // the one holding the baby, on the right
  ctx.fillStyle=sil;ctx.beginPath();ctx.moveTo(-6,2);ctx.bezierCurveTo(-10,-60,-4,-96+br,18,-104+br);ctx.bezierCurveTo(44,-110+br,60,-92+br,62,-60);ctx.lineTo(66,2);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(28,-128+br,15,18,0.1,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(20,-114+br);ctx.lineTo(36,-114+br);ctx.lineTo(34,-104+br);ctx.lineTo(22,-104+br);ctx.closePath();ctx.fill();
  // the baby in their arms: a pale swaddle, a small head
  ctx.fillStyle="rgba(252,240,226,0.95)";ctx.beginPath();ctx.ellipse(16,-78+br,26,12,-0.25,0,TAU);ctx.fill();ctx.fillStyle="rgba(236,206,180,1)";ctx.beginPath();ctx.arc(-6,-84+br,8,0,TAU);ctx.fill();
  ctx.fillStyle=sil;ctx.beginPath();ctx.moveTo(-14,-70+br);ctx.quadraticCurveTo(14,-58+br,44,-74+br);ctx.lineTo(46,-66+br);ctx.quadraticCurveTo(14,-50+br,-14,-62+br);ctx.closePath();ctx.fill();
  // the other, leaning in from the left
  const lb=Math.sin(t*1.2+1)*1.2;ctx.beginPath();ctx.moveTo(-96,2);ctx.bezierCurveTo(-100,-50,-88,-86+lb,-62,-94+lb);ctx.bezierCurveTo(-40,-98+lb,-26,-80+lb,-24,-52);ctx.lineTo(-20,2);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(-46,-116+lb,14,17,0.35,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-30,-84+lb);ctx.quadraticCurveTo(-18,-80+lb,-10,-86+lb);ctx.lineTo(-10,-80+lb);ctx.quadraticCurveTo(-20,-72+lb,-32,-76+lb);ctx.closePath();ctx.fill();ctx.restore();}
// the whole view: sky, town, river, bridge, banks, the birch, the near building; o.u, the light; o.dim, darker behind the glass
function d9_tartu(ctx,t,o){o=o||{};const u=o.u==null?0.5:o.u;d9_sky(ctx,t,u);d9_city(ctx,t,u);d9_river(ctx,t,u);d9_bridge(ctx,t,u);d9_banks(ctx,t,u);d9_bankTrees(ctx,t,u);d9_building(ctx,t,u,o);d9_birch(ctx,214,1060,1.15,t,u);d9_leaves(ctx,t,o.leaves==null?1:o.leaves,u);
  if(o.dim>0.01){ctx.fillStyle="rgba(4,6,14,"+clamp(o.dim,0,1)*0.8+")";ctx.fillRect(-600,-400,W+1200,H+800);}}

/* ---------- the register, the offices, X-Road ---------- */
// The population register: glass, pale as frost, with its name and rows of records (texture), one lit (o.row: what it says, o.lit 0..1)
function d9_register(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,D9_TAR,{glow:18+18*(o.hi||0),ea:0.9,fill:"rgba(8,14,30,0.92)"});ctx.fillStyle=rgba(D9_TAR,0.06+0.06*(o.hi||0));rr(ctx,x,y,w,h,22);ctx.fill();
  dbGlyph(ctx,x+46,y+54,D9_TAR,0.9);T(ctx,"population register",x+84,y+64,{w:800,size:32,color:rgba(D9_TAR,1)});
  const rows=Math.floor((h-110)/38);for(let i=0;i<rows;i++){const yy=y+104+i*38;if(o.row&&i===rows-1)continue;ctx.fillStyle=rgba(D9_TAR,0.14);rr(ctx,x+30,yy,w-60,26,8);ctx.fill();
    for(let k=0;k<5;k++){ctx.fillStyle=rgba(D9_TAR,0.28);ctx.fillRect(x+44+k*((w-100)/5),yy+11,(w-100)/5*(0.4+0.4*hash(i*5+k,971)),5);}}
  if(o.row){const yy=y+104+(rows-1)*38,l=o.lit||0;withA(ctx,clamp(l*2,0,1),()=>{glow(ctx,x+w/2,yy+13,w*0.5,D9_DAWN,0.35*pulse_(l));ctx.fillStyle=rgba(mix(D9_TAR,D9_DAWN,0.6),0.22);rr(ctx,x+24,yy-8,w-48,42,10);ctx.fill();
    T(ctx,o.row,x+44,yy+24,{w:700,size:28,color:rgba(mix(INK,D9_DAWN,0.3),1)});});}});}
const pulse_=l=>0.6+0.4*Math.sin(l*Math.PI);
// a public office: a glass card with a building's glyph and its name; o.copy (0..1): the place its own copy would be, empty and crossed
function d9_office(ctx,x,y,w,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=90;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,D9_TAR,{glow:12+14*(o.hi||0),ea:0.8,fill:"rgba(8,14,30,0.93)"});
  d9_bldg(ctx,x+38,y+h/2,1,D9_TAR);const nl=wrapT(ctx,name,0,0,w-92,{size:28,w:700,measure:true}).length;wrapT(ctx,name,x+74,y+h/2+10-(nl-1)*16,w-92,{size:28,w:700,color:rgba(INK,0.96),lh:32});});}
// a public building, as a glyph: a pediment on four columns
function d9_bldg(ctx,gx,gy,s,col){ctx.save();ctx.translate(gx,gy);ctx.scale(s,s);ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.2/s;ctx.beginPath();ctx.moveTo(-18,-6);ctx.lineTo(0,-18);ctx.lineTo(18,-6);ctx.closePath();ctx.stroke();
  [-12,-4,4,12].forEach(d=>{ctx.beginPath();ctx.moveTo(d,-3);ctx.lineTo(d,12);ctx.stroke();});ctx.beginPath();ctx.moveTo(-20,16);ctx.lineTo(20,16);ctx.stroke();ctx.restore();}
// another office that asks the register, unnamed: the register has many users
function d9_officeS(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-34,y-34,68,68,34,D9_TAR,{glow:10+14*(o.hi||0),ea:0.7,fill:"rgba(8,14,30,0.93)"});d9_bldg(ctx,x,y+1,0.9,D9_TAR);});}
// points along a cubic curve, for a road
function d9_bez(p0,p1,p2,p3,n){const P=[];for(let i=0;i<=(n||24);i++){const u=i/(n||24),v=1-u;P.push([v*v*v*p0[0]+3*v*v*u*p1[0]+3*v*u*u*p2[0]+u*u*u*p3[0],v*v*v*p0[1]+3*v*v*u*p1[1]+3*v*u*u*p2[1]+u*u*u*p3[1]]);}return P;}
// X-Road, between an office and the register: a road of two lines with a dashed middle, drawn to p; asks go out along it and answers
// come back (o.ask, o.ans: 0..1 along it, or none)
function d9_road(ctx,pts,p,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a;withA(ctx,a,()=>{const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const D=L[L.length-1]*clamp(p,0,1);
  const at_=d=>{let i=1;while(i<L.length-1&&L[i]<d)i++;const f=clamp((d-L[i-1])/((L[i]-L[i-1])||1),0,1);return[lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f),Math.atan2(pts[i][1]-pts[i-1][1],pts[i][0]-pts[i-1][0])];};
  const path=(off)=>{ctx.beginPath();for(let d=0;d<=D;d+=6){const[x,y,an]=at_(d);const px=x-Math.sin(an)*off,py=y+Math.cos(an)*off;d?ctx.lineTo(px,py):ctx.moveTo(px,py);}};
  ctx.save();ctx.shadowColor=rgba(D9_TAR,0.6);ctx.shadowBlur=10+10*(o.hi||0);ctx.strokeStyle=rgba(D9_TAR,0.75+0.25*(o.hi||0));const hw=7*(o.lw==null?1:o.lw);ctx.lineWidth=2.2;path(-hw);ctx.stroke();path(hw);ctx.stroke();ctx.shadowBlur=0;
  ctx.setLineDash([10,12]);ctx.lineDashOffset=-(o.t||0)*24;ctx.strokeStyle=rgba(D9_TAR,0.4);ctx.lineWidth=1.6;path(0);ctx.stroke();ctx.restore();
  const pk=(u,col,dir)=>{if(u==null||u<0||u>1)return;const[x,y]=at_(L[L.length-1]*u);glow(ctx,x,y,22,col,0.7);ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),1);ctx.fillRect(-6,-6,12,12);ctx.restore();};
  if(p>=1){pk(o.ask,D9_TAR);pk(o.ans,D9_DAWN);}});}
// a catalogue of every database, with the office that owns it: rows of [database, owner], the first legible, the rest texture
function d9_catalogue(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=118+rows.length*46;withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,D9_TAR,{glow:12,ea:0.75,fill:"rgba(8,14,30,0.94)"});
  T(ctx,o.title||"every database, and who owns it",x+28,y+50,{w:800,size:30,color:rgba(D9_TAR,1)});ctx.strokeStyle=rgba(D9_TAR,0.3);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+72);ctx.lineTo(x+w-24,y+72);ctx.stroke();
  rows.forEach(([db,own],i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q<=0)return;const yy=y+110+i*46,big=i===0;withA(ctx,q,()=>{
    T(ctx,db,x+28,yy,{w:700,size:big?28:20,color:rgba(INK,big?0.96:0.5),deco:big?0:1});T(ctx,own,x+w-28,yy,{w:700,size:big?28:20,align:"right",color:rgba(TRUST,big?1:0.5),deco:big?0:1});});});});return h;}

/* ---------- the parents' phone ---------- */
// A parent's hand holding a phone, close up, in the warm room behind the window: the screen shows the Social Insurance Board's
// email, offering the family benefit (o.paid: the benefit paid, instead). o.tap (0..1) lights the button.
function d9_phone(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-8,y-8,w+16,h+16,24,D9_DAWN,{glow:18,ea:0.7,fill:"rgba(8,12,24,0.95)"});
  ctx.save();rr(ctx,x,y,w,h,18);ctx.clip();ctx.translate(x,y);
  // the room: a lamp's warmth, the window with the dawn in it, out of focus
  let g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#3a2a26");g.addColorStop(1,"#1a1214");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);glow(ctx,w*0.12,h*0.26,w*0.55,[255,190,120],0.45);
  g=ctx.createLinearGradient(0,h*0.06,0,h*0.6);g.addColorStop(0,"#3b4d7e");g.addColorStop(1,"#d99b82");ctx.fillStyle=g;rr(ctx,w*0.6,h*0.06,w*0.34,h*0.54,6);ctx.fill();ctx.fillStyle="rgba(30,22,26,0.85)";ctx.fillRect(w*0.765,h*0.06,10,h*0.54);ctx.fillRect(w*0.6,h*0.3,w*0.34,8);
  ctx.fillStyle="rgba(40,34,52,0.7)";ctx.fillRect(w*0.6,h*0.5,w*0.34,h*0.1);
  // the phone, in a hand: palm and fingertips behind it, the thumb in front
  const pw=380,ph=700,px=w*0.5,py=h*0.53+Math.sin(t*1.1)*3;ctx.save();ctx.translate(px,py);ctx.rotate(-0.045+Math.sin(t*0.7)*0.008);
  const skin=[228,186,160],skL=[246,212,190],skD=[176,128,104];
  const skinG=(x0,x1)=>{const gg=ctx.createLinearGradient(x0,0,x1,0);gg.addColorStop(0,rgba(skL,1));gg.addColorStop(1,rgba(skD,1));return gg;};
  ctx.fillStyle=skinG(-pw*0.6,pw*0.6);ctx.beginPath();ctx.moveTo(-pw*0.56,ph*1.1);ctx.bezierCurveTo(-pw*0.6,ph*0.6,-pw*0.52,ph*0.3,-pw*0.36,ph*0.24);ctx.lineTo(pw*0.4,ph*0.26);ctx.bezierCurveTo(pw*0.56,ph*0.32,pw*0.6,ph*0.6,pw*0.54,ph*1.1);ctx.closePath();ctx.fill();
  [[-0.06,0],[0.07,1],[0.2,2],[0.32,3]].forEach(([fy,k])=>{const yy=ph*fy,len=46-k*3;ctx.save();ctx.translate(pw/2-6,yy);ctx.rotate(0.12+k*0.05);ctx.fillStyle=skinG(0,len);ctx.beginPath();ctx.moveTo(-10,-16);ctx.lineTo(len-14,-15);
    ctx.quadraticCurveTo(len+2,-14,len+2,0);ctx.quadraticCurveTo(len+2,14,len-14,15);ctx.lineTo(-10,16);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(skD,0.7);ctx.lineWidth=1.4;ctx.stroke();
    ctx.fillStyle=rgba(mix(skL,[255,236,226],0.4),0.65);ctx.beginPath();ctx.ellipse(len-12,-2,7,9,0,0,TAU);ctx.fill();ctx.restore();});
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=24;ctx.shadowOffsetX=6;ctx.shadowOffsetY=10;ctx.fillStyle="#16181d";rr(ctx,-pw/2,-ph/2,pw,ph,52);ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(255,255,255,0.18)";ctx.lineWidth=2;rr(ctx,-pw/2+2,-ph/2+2,pw-4,ph-4,50);ctx.stroke();
  // the screen
  const sx=-pw/2+14,sy=-ph/2+14,sw_=pw-28,shh=ph-28,L=sx+28,R=sx+sw_-28;ctx.save();rr(ctx,sx,sy,sw_,shh,40);ctx.clip();g=ctx.createLinearGradient(0,sy,0,sy+shh);g.addColorStop(0,"#f7f8fb");g.addColorStop(1,"#e8ebf1");ctx.fillStyle=g;ctx.fillRect(sx,sy,sw_,shh);
  ctx.fillStyle="#16181d";rr(ctx,-46,sy+14,92,26,13);ctx.fill();
  if(!o.paid){T(ctx,"Inbox",L,sy+96,{w:800,size:28,color:"rgba(30,34,44,0.9)"});ctx.fillStyle="rgba(30,34,44,0.12)";ctx.fillRect(sx,sy+118,sw_,2);
    // the sender: a round mark with a building, its name over two lines; then the subject, the text, the button
    ctx.fillStyle="rgba(58,96,156,1)";ctx.beginPath();ctx.arc(L+26,sy+170,26,0,TAU);ctx.fill();ctx.save();ctx.strokeStyle="#fff";ctx.lineWidth=2;const gx=L+26,gy=sy+170;ctx.beginPath();ctx.moveTo(gx-12,gy-3);ctx.lineTo(gx,gy-12);ctx.lineTo(gx+12,gy-3);ctx.closePath();ctx.stroke();
      [-7,0,7].forEach(d=>{ctx.beginPath();ctx.moveTo(gx+d,gy);ctx.lineTo(gx+d,gy+9);ctx.stroke();});ctx.beginPath();ctx.moveTo(gx-13,gy+12);ctx.lineTo(gx+13,gy+12);ctx.stroke();ctx.restore();
    T(ctx,"Social Insurance",L+66,sy+164,{w:800,size:28,color:"rgba(30,34,44,0.95)"});T(ctx,"Board",L+66,sy+198,{w:800,size:28,color:"rgba(30,34,44,0.95)"});
    T(ctx,"A family benefit",L,sy+272,{w:800,size:32,color:"rgba(18,22,32,1)"});T(ctx,"for your child",L,sy+312,{w:800,size:32,color:"rgba(18,22,32,1)"});
    for(let k=0;k<4;k++){ctx.fillStyle="rgba(30,34,44,0.16)";ctx.fillRect(L,sy+350+k*26,(R-L)*(k===3?0.55:0.94-0.06*hash(k,975)),10);}
    const bt=o.tap||0,by=sy+478;ctx.save();if(bt>0.01){ctx.shadowColor="rgba(60,110,200,0.9)";ctx.shadowBlur=26*bt;}ctx.fillStyle=rgba(mix([58,96,156],[74,134,226],bt),1);rr(ctx,L,by,R-L,68,20);ctx.fill();ctx.restore();
    T(ctx,"Accept",(L+R)/2,by+45,{w:800,size:32,align:"center",color:"#fff"});}
  else{ctx.fillStyle="rgba(64,148,94,1)";ctx.beginPath();ctx.arc(0,sy+250,58,0,TAU);ctx.fill();tick_(ctx,0,sy+252,64,[255,255,255],1);
    T(ctx,"Family benefit",0,sy+374,{w:800,size:32,align:"center",color:"rgba(18,22,32,1)"});T(ctx,"paid",0,sy+418,{w:800,size:32,align:"center",color:"rgba(36,120,70,1)"});
    for(let k=0;k<3;k++){ctx.fillStyle="rgba(30,34,44,0.14)";ctx.fillRect(L+20,sy+468+k*26,R-L-40,10);}}
  // a little glare across the glass
  const gl=ctx.createLinearGradient(sx,sy,sx+sw_,sy+shh*0.6);gl.addColorStop(0,"rgba(255,255,255,0.0)");gl.addColorStop(0.5,"rgba(255,255,255,0.10)");gl.addColorStop(0.56,"rgba(255,255,255,0.0)");ctx.fillStyle=gl;ctx.fillRect(sx,sy,sw_,shh);ctx.restore();
  // the thumb, along the left edge, its tip over the glass; and a sleeve at the wrist
  ctx.fillStyle=skinG(-pw*0.7,-pw*0.3);ctx.beginPath();ctx.moveTo(-pw*0.64,ph*0.5);ctx.bezierCurveTo(-pw*0.7,ph*0.32,-pw*0.6,ph*0.16,-pw*0.47,ph*0.07);ctx.bezierCurveTo(-pw*0.42,ph*0.035,-pw*0.35,ph*0.05,-pw*0.36,ph*0.1);
  ctx.bezierCurveTo(-pw*0.37,ph*0.17,-pw*0.42,ph*0.3,-pw*0.4,ph*0.52);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(skD,0.6);ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle=rgba(mix(skL,[255,240,232],0.45),0.7);ctx.beginPath();ctx.ellipse(-pw*0.405,ph*0.075,10,14,-0.5,0,TAU);ctx.fill();
  ctx.fillStyle="#60708e";ctx.beginPath();ctx.moveTo(-pw*0.66,ph*0.62);ctx.quadraticCurveTo(0,ph*0.56,pw*0.6,ph*0.64);ctx.lineTo(pw*0.64,ph*1.2);ctx.lineTo(-pw*0.7,ph*1.2);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=2;for(let k=0;k<8;k++){ctx.beginPath();ctx.moveTo(-pw*0.6+k*pw*0.15,ph*0.6);ctx.lineTo(-pw*0.62+k*pw*0.15,ph*1.2);ctx.stroke();}
  ctx.restore();ctx.restore();});}
// an application never filled in: a form on paper, its fields blank
function d9_form(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?0.02:o.rot,plain:true});ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?0.02:o.rot);ctx.translate(-w/2,-h/2);
  T(ctx,"application",28,56,{w:800,size:30,color:"rgba(60,56,60,0.9)"});T(ctx,"family benefit",28,92,{w:700,size:28,color:"rgba(90,84,86,0.85)"});
  for(let k=0;k<5;k++){const yy=150+k*58;ctx.fillStyle="rgba(60,56,60,0.35)";ctx.fillRect(28,yy-16,90,8);ctx.strokeStyle="rgba(60,56,60,0.35)";ctx.lineWidth=1.5;ctx.strokeRect(134,yy-30,w-162,38);}
  ctx.strokeStyle="rgba(60,56,60,0.4)";ctx.strokeRect(28,h-64,30,30);T(ctx,"sign here",72,h-40,{w:700,size:20,color:"rgba(90,84,86,0.6)",deco:1});ctx.restore();});}
// a line traced through points, drawn up to p, with a bright head while it's drawing
function d9_trace_(ctx,pts,p,col,o){o=o||{};if(p<=0)return;const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const d=L[L.length-1]*clamp(p,0,1);
  ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||3;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);let hx=pts[0][0],hy=pts[0][1];
  for(let i=1;i<pts.length;i++){if(L[i]<=d){ctx.lineTo(pts[i][0],pts[i][1]);hx=pts[i][0];hy=pts[i][1];}else{const f=(d-L[i-1])/((L[i]-L[i-1])||1);hx=lerp(pts[i-1][0],pts[i][0],f);hy=lerp(pts[i-1][1],pts[i][1],f);ctx.lineTo(hx,hy);break;}}ctx.stroke();ctx.restore();
  if(p<1&&!o.nohead){glow(ctx,hx,hy,22,col,0.8);ctx.fillStyle=rgba(mix(col,[255,255,255],0.6),1);ctx.beginPath();ctx.arc(hx,hy,4.5,0,TAU);ctx.fill();}}
// a second copy of a register, as an office might start one: a dashed outline with a database and what it would hold
function d9_ghostDb(ctx,x,y,w,h,what){ctx.save();ctx.setLineDash([9,7]);ctx.strokeStyle=rgba(D9_TAR,0.75);ctx.lineWidth=2.4;rr(ctx,x,y,w,h,16);ctx.stroke();ctx.restore();ctx.fillStyle=rgba(D9_TAR,0.06);rr(ctx,x,y,w,h,16);ctx.fill();
  dbGlyph(ctx,x+42,y+h/2+4,D9_TAR,0.8);T(ctx,what,x+76,y+h/2+10,{w:700,size:28,color:rgba(D9_TAR,0.85)});}

/* ---------- the utility: its two businesses, the wall between them, and the rules ---------- */
// the rules, in the business's words: day one's, the two it really is, and the validity rule
const D9_R0="an estimated reading stands only until the next actual reading";
const D9_R21="An estimate is replaced when the actual reading arrives, and the replacement is sent to the retailer.";
const D9_R22="A bill based on a replaced estimate is corrected on the next bill.";
const D9_R20="Every reading is marked actual or estimated.";
const D9_Q="Where does each rule belong?",D9_NEXT="What does a change in strategy mean for the data?";
const D9_A="In the map: written once, at the step where it applies, with an owner and a reason, and its checks generated from it.";
// the network's side tinted blue and retail's rose, with their names (as in Who does it); o.ly: where the names sit
function d9_sides(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const lg=ctx.createLinearGradient(0,0,960,0);lg.addColorStop(0,rgba(D9_NET,0.0));lg.addColorStop(1,rgba(D9_NET,0.08));ctx.fillStyle=lg;ctx.fillRect(0,0,960,H);
  const rg=ctx.createLinearGradient(960,0,W,0);rg.addColorStop(0,rgba(D9_RET,0.08));rg.addColorStop(1,rgba(D9_RET,0.0));ctx.fillStyle=rg;ctx.fillRect(960,0,960,H);
  const ly=o.ly||96;withA(ctx,o.lab==null?1:o.lab,()=>{T(ctx,"network",480,ly,{w:800,size:40,align:"center",color:rgba(D9_NET,1)});T(ctx,"retail",1440,ly,{w:800,size:40,align:"center",color:rgba(D9_RET,1)});});});}
// the wall between them, drawn down from the top as p goes to 1; o.gate (0..1) opens a gate at o.gy, where what crosses is
// translated; o.hi lights it, o.red flashes it
function d9_wall(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p,y0=o.y0||140,y1=y0+((o.y1||900)-y0)*ease(p),red=o.red||0,gate=o.gate||0,gy=o.gy||560;withA(ctx,a,()=>{
  const col=mix([226,232,246],D9_RED,red);ctx.save();ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=18+20*(red+(o.hi||0));ctx.fillStyle=rgba(col,0.12+0.1*red+0.08*(o.hi||0));
  const gh=gate*150;ctx.fillRect(948,y0,24,Math.max(0,Math.min(y1,gy-gh/2)-y0));if(y1>gy+gh/2)ctx.fillRect(948,gy+gh/2,24,y1-gy-gh/2);ctx.shadowBlur=0;
  ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;ctx.beginPath();[948,972].forEach(x=>{ctx.moveTo(x,y0);ctx.lineTo(x,Math.min(y1,gy-gh/2));if(y1>gy+gh/2){ctx.moveTo(x,gy+gh/2);ctx.lineTo(x,y1);}});ctx.stroke();ctx.restore();
  if(gate>0.05)withA(ctx,gate,()=>d9_conv(ctx,960,gy,34,0.5+0.5*Math.sin(t*3),1));});}
// the gate's translator: a small box that takes the network's words in and gives retail's out
function d9_conv(ctx,x,y,s,g,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,s*2.2,[220,230,255],0.25+0.45*g);ctx.save();ctx.translate(x,y);ctx.fillStyle="rgba(10,14,26,0.95)";rr(ctx,-s,-s*0.7,2*s,s*1.4,s*0.25);ctx.fill();
  ctx.strokeStyle="rgba(230,236,255,0.95)";ctx.lineWidth=Math.max(1.5,s*0.12);rr(ctx,-s,-s*0.7,2*s,s*1.4,s*0.25);ctx.stroke();ctx.lineWidth=Math.max(1.2,s*0.1);
  [[-1,D9_NET,3],[1,D9_RET,2]].forEach(([sd,col,n])=>{ctx.strokeStyle=rgba(col,1);ctx.beginPath();for(let i=0;i<=16;i++){const u=i/16,xx=sd*s*(0.12+u*0.72);const yy=Math.sin(u*TAU*n/2*1.5)*s*0.28;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();});
  ctx.restore();});}
// a list on paper, with a title and its rows (p writes them in); o.hi (0..1) marks the last row as new, in the network's blue
function d9_list(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const h=92+rows.length*52;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.01:o.rot,plain:true});
  T(ctx,title,x+28,y+52,{w:800,size:30,color:"rgba(52,48,46,0.95)"});rows.forEach((r,i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q<=0)return;const nw=i===rows.length-1&&o.hi?o.hi:0;
    withA(ctx,q,()=>{if(nw>0.01)withA(ctx,nw,()=>{ctx.fillStyle="rgba(132,176,255,0.22)";ctx.fillRect(x+20,y+72+i*52,w-40,46);});
      T(ctx,r,x+52,y+104+i*52,{w:700,size:28,color:nw>0.5?"rgba(36,70,150,0.98)":"rgba(52,48,46,0.9)"});ctx.fillStyle="rgba(52,48,46,0.7)";ctx.beginPath();ctx.arc(x+34,y+94+i*52,4,0,TAU);ctx.fill();});});});return h;}
// an envelope: a reading crossing the wall
function d9_msg(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,40*s,col,0.5);ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="#f1ead8";rr(ctx,-28,-19,56,38,4);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.5;rr(ctx,-28,-19,56,38,4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-28,-19);ctx.lineTo(0,4);ctx.lineTo(28,-19);ctx.stroke();ctx.restore();});}
// an owner, named on a gold tag with ArchiMate's actor glyph
function d9_owner(ctx,x,y,name,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const s=(o.pre==null?"owner · ":o.pre)+name,ts=28,w=tw(ctx,s,ts,700)+70,h=48,X=o.align==="center"?x-w/2:x;glass(ctx,X,y-h/2,w,h,h/2,TRUST,{glow:10+12*(o.hi||0),ea:0.85,fill:"rgba(20,16,6,0.92)"});
  archGlyph(ctx,"actor",X+26,y-2,13,TRUST);T(ctx,s,X+48,y+ts*0.36,{w:700,size:ts,color:rgba(TRUST,1)});});}
// ArchiMate's requirement: a parallelogram, leaning right
function d9_reqGlyph(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.11);ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-s*0.45,y-s*0.5);ctx.lineTo(x+s*0.9,y-s*0.5);ctx.lineTo(x+s*0.45,y+s*0.5);ctx.lineTo(x-s*0.9,y+s*0.5);ctx.closePath();ctx.stroke();ctx.restore();}
// an element of the model, with a requirement's glyph where archEl puts its own
function d9_el(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const own=kind==="requirement";archEl(ctx,x,y,w,h,name,col,own?"none":kind,o);
  if(own){const gs=o.gs||13;withA(ctx,a,()=>d9_reqGlyph(ctx,x+w-gs-13,y+gs+9,gs,col));}}
// what kind of rule an id is: RUL-020 is about the data itself; the network's and retail's are about what the business does
const d9_kind=id=>id&&id!=="RUL-020"?"business rule":"data rule";
// A data rule, as the series draws one from here on: dark glass with motivation's purple edge, ArchiMate's requirement glyph, a
// stripe in the colour of the side it belongs to, and its id in a monospaced kicker. o.p writes its words; o.hi lights it; o.ink: its
// words' colour; o.deco: drawn small on purpose. Returns its height.
function d9_rule(ctx,x,y,w,id,text,side,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||30,ls=wrapT(ctx,text,0,0,w-76,{size:sz,w:700,measure:true}),h=86+ls.length*sz*1.25;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,MOT,{glow:14+14*(o.hi||0),ea:0.85,fill:"rgba(9,8,22,0.95)"});
    if(side){ctx.fillStyle=rgba(side,0.95);rr(ctx,x+9,y+14,7,h-28,3.5);ctx.fill();}
    d9_reqGlyph(ctx,x+w-36,y+36,16,MOT);T(ctx,d9_kind(id)+(id?" · "+id:""),x+34,y+46,{f:"mono",w:500,size:28,color:rgba(MOT,1),deco:o.deco});
    let left=text.length*(o.p==null?1:o.p);ls.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;T(ctx,s_,x+34,y+90+i*sz*1.25,{w:700,size:sz,color:o.ink||rgba(INK,0.97),deco:o.deco});});});return h;}
// The rule in a set form: its kicker, then a row for each part, a label in mono and its value. rows: [label, value, colour, kind];
// kind "owner" puts ArchiMate's actor before the value. o.r[i] (0..1) brings in row i; o.hiRow lights one; o.tick: the owner's
// gold tick. Returns its height.
function d9_ruleForm(ctx,x,y,w,id,rows,o){o=o||{};const a=o.a==null?1:o.a,side=o.side||D9_RET,rh=o.rh||100,h=104+rows.length*rh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,MOT,{glow:14+14*(o.hi||0),ea:0.85,fill:"rgba(9,8,22,0.96)"});ctx.fillStyle=rgba(side,0.95);rr(ctx,x+9,y+16,7,h-32,3.5);ctx.fill();
    d9_reqGlyph(ctx,x+w-40,y+42,18,MOT);T(ctx,d9_kind(id)+" · "+id,x+36,y+60,{f:"mono",w:500,size:32,color:rgba(MOT,1)});
    rows.forEach(([lab,val,col,kind],i)=>{const q=o.r?clamp(o.r[i]||0,0,1):1;if(q<=0.01)return;const ry=y+92+i*rh;withA(ctx,q,()=>{
      if(o.hiRow===i){ctx.save();ctx.fillStyle=rgba(col,0.1);rr(ctx,x+22,ry+6,w-44,rh-10,10);ctx.fill();ctx.restore();}
      ctx.strokeStyle="rgba(200,186,255,0.16)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+30,ry);ctx.lineTo(x+w-24,ry);ctx.stroke();
      T(ctx,lab,x+36,ry+38,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});let vx=x+36;if(kind==="owner"){archGlyph(ctx,"actor",vx+12,ry+70,13,col);vx+=36;}
      T(ctx,val,vx,ry+80,{w:700,size:30,color:rgba(col,1)});});});
    if(o.tick>0.01)kt_gtick(ctx,x+w-46,y+h-46,22,o.tick);});return h;}
// a bill, as day one showed it: o.amount, o.note, o.bad (0..1) flags it wrong; o.stamp: a word stamped across it, o.st (0..1), in
// o.stampCol; o.was: the amount it replaces, struck through as o.wa goes to 1
function d9_bill(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,236,18,[200,210,230],{glow:12+14*(o.hi||0),ea:0.7,fill:"rgba(236,240,246,0.97)"});
  T(ctx,"Your bill",x+26,y+48,{w:800,size:30,color:"rgba(40,44,56,1)"});T(ctx,"$"+(o.amount||"412.80"),x+26,y+116,{w:800,size:52,color:rgba(o.good?[40,130,70]:o.bad?[200,50,50]:[40,44,56],1)});
  if(o.was&&o.wa>0.01)withA(ctx,o.wa,()=>{const ww=tw(ctx,"$"+o.was,34,700),wx=x+w-26-ww;T(ctx,"$"+o.was,wx,y+110,{w:700,size:34,color:"rgba(110,116,128,1)"});ctx.save();ctx.strokeStyle="rgba(200,50,50,0.9)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(wx-4,y+98);ctx.lineTo(wx-4+(ww+8)*clamp(o.wa*1.5-0.5,0,1),y+98);ctx.stroke();ctx.restore();});
  T(ctx,o.note||"an estimated reading",x+26,y+162,{w:600,size:28,color:"rgba(90,96,110,1)"});if(o.bad)withA(ctx,o.bad,()=>tag(ctx,x+26,y+204,"wrong",BAD,{size:28}));
  if(o.stamp&&o.st>0.01)withA(ctx,clamp(o.st*1.4,0,1),()=>{const k=1+0.5*(1-ease(clamp(o.st,0,1)));ctx.save();ctx.translate(x+w-156,y+202);ctx.rotate(-0.1);ctx.scale(k,k);const sw=tw(ctx,o.stamp,30,800)+36;
    const sc_=o.stampCol||[200,50,50];ctx.strokeStyle=rgba(sc_,0.9);ctx.lineWidth=4;rr(ctx,-sw/2,-28,sw,56,8);ctx.stroke();T(ctx,o.stamp,0,11,{w:800,size:30,align:"center",color:rgba(sc_,0.95)});ctx.restore();});});}

/* ---------- the household behind the bill ---------- */
// June, day by day: what they used (units a day). Away from the 8th to the 28th, three weeks; last June's same days, from which the
// bill estimated them
const D9_USE=[21.4,23.1,20.2,24.6,22.3,21.0,23.8, 1.4,1.1,1.6,1.2,1.3,1.0,1.5,1.2,1.4,1.1,1.3,1.6,1.2,1.0,1.4,1.3,1.1,1.5,1.2,1.3,1.4, 22.6,21.7];
const D9_LAST=[0,0,0,0,0,0,0, 23.2,22.4,24.8,21.9,23.6,25.1,22.7,24.0,23.3,22.1,24.6,23.9,21.8,22.9,24.4,23.1,22.5,24.9,23.7,22.2,23.4, 0,0];
const D9_AWAY=[7,27];
// a house on paper, drawn in marker, with its smart meter on the outside wall: o.lit lights its windows (someone's home); o.sig (0..1)
// the meter's signal, sending readings; o.off (0..1) crosses it out
function d9_house(ctx,cx,cy,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,cx-180,cy-150,360,300,{rot:-0.008,plain:true});
  marker(ctx,[[cx-90,cy-30],[cx-90,cy+80],[cx+90,cy+80],[cx+90,cy-30]],1,{lw:3.4,seed:3});marker(ctx,[[cx-114,cy-24],[cx,cy-112],[cx+114,cy-24]],1,{lw:3.4,seed:4});
  const lit=o.lit==null?1:o.lit;[[cx-70,cy-6],[cx+2,cy-6]].forEach(([wx,wy])=>{ctx.fillStyle="rgba(40,40,48,0.88)";ctx.fillRect(wx,wy,40,32);if(lit>0.01){ctx.fillStyle=rgba([255,206,120],0.9*lit);ctx.fillRect(wx+3,wy+3,34,26);}});
  ctx.fillStyle="rgba(40,40,48,0.88)";ctx.fillRect(cx-14,cy+36,28,44);
  // the meter, and its signal
  const mx=cx+68,my=cy+52,sig=o.sig||0;ctx.save();if(sig>0)glow(ctx,mx,my,40,D9_NET,0.5*sig);ctx.fillStyle=rgba(mix([210,214,220],D9_NET,sig*0.5),1);rr(ctx,mx-10,my-14,20,28,4);ctx.fill();ctx.strokeStyle="rgba(40,40,48,0.9)";ctx.lineWidth=2;rr(ctx,mx-10,my-14,20,28,4);ctx.stroke();ctx.restore();
  [14,24,34].forEach((r,i)=>{const v=sig*(0.35+0.65*(0.5+0.5*Math.sin(t*5-i*1.1)));if(v<=0.02)return;ctx.save();ctx.strokeStyle=rgba(mix(D9_NET,[30,60,140],0.35),v);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.arc(mx,my-24,r,-Math.PI*0.78,-Math.PI*0.22);ctx.stroke();ctx.restore();});
  if(o.off>0.01)cross_(ctx,mx+6,my-48,34,[200,56,48],o.off);
  T(ctx,"the household",cx,cy+128,{w:800,size:30,align:"center",color:rgba(INKD,0.92)});});}
// where a day's bar sits on the June chart: [x of its centre, the baseline]
function d9_juneAt(x,y,w,h,i){return[x+50+i*((w-80)/30),y+h-56];}
// June on paper, as a bar a day. o.p grows the days they were home; o.away (0..1) marks the three weeks away; o.gap (0..1) says no
// readings came; o.est (0..1) raises last June's days, dashed, as the estimate; o.act[i] (0..1) each away day's actual reading
function d9_june(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:0.006,plain:true});
  T(ctx,"June",x+30,y+52,{w:800,size:34,color:"rgba(52,48,46,0.95)"});const k=5.0,bw=13,[,by]=d9_juneAt(x,y,w,h,0),aw=o.away||0;
  ctx.strokeStyle="rgba(52,48,46,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,by);ctx.lineTo(x+w-24,by);ctx.stroke();
  [0,7,14,21,29].forEach(i=>T(ctx,String(i+1),d9_juneAt(x,y,w,h,i)[0],by+26,{w:600,size:20,align:"center",color:"rgba(52,48,46,0.7)",deco:1}));
  // the weeks away, bracketed
  if(aw>0.01)withA(ctx,aw,()=>{const xa=d9_juneAt(x,y,w,h,D9_AWAY[0])[0]-10,xb=d9_juneAt(x,y,w,h,D9_AWAY[1])[0]+10,yb=y+84;ctx.fillStyle="rgba(120,140,190,0.10)";ctx.fillRect(xa,yb,xb-xa,by-yb);
    marker(ctx,[[xa,yb+14],[xa,yb],[lerp(xa,xb,ease(aw)),yb]],1,{lw:2.6,col:"rgba(52,60,110,0.85)",seed:7});if(aw>0.9)marker(ctx,[[xb,yb],[xb,yb+14]],1,{lw:2.6,col:"rgba(52,60,110,0.85)",seed:8});
    d9_case(ctx,(xa+xb)/2-150,yb-26,0.9);T(ctx,"away, three weeks",(xa+xb)/2-118,yb-16,{w:800,size:28,color:"rgba(52,60,110,0.95)"});});
  for(let i=0;i<30;i++){const[bx]=d9_juneAt(x,y,w,h,i),away=i>=D9_AWAY[0]&&i<=D9_AWAY[1];
    if(!away){const q=clamp((o.p||0)*34-i,0,1);if(q>0){const bh=D9_USE[i]*k*ease(q);ctx.fillStyle="rgba(52,48,46,0.82)";ctx.fillRect(bx-bw/2,by-bh,bw,bh);}continue;}
    const e=clamp((o.est||0)*26-(i-D9_AWAY[0]),0,1);if(e>0){const bh=D9_LAST[i]*k*ease(e);ctx.save();ctx.fillStyle="rgba(214,150,60,0.20)";ctx.fillRect(bx-bw/2,by-bh,bw,bh);ctx.setLineDash([5,4]);ctx.strokeStyle="rgba(190,112,26,0.95)";ctx.lineWidth=2;ctx.strokeRect(bx-bw/2,by-bh,bw,bh);ctx.restore();}
    const g=(o.gap||0)*(1-e);if(g>0.01){ctx.save();ctx.setLineDash([3,4]);ctx.strokeStyle=rgba([180,60,50],0.8*g);ctx.lineWidth=2;ctx.strokeRect(bx-bw/2,by-10,bw,10);ctx.restore();}
    const q=o.act?clamp(o.act[i-D9_AWAY[0]]||0,0,1):0;if(q>0){const bh=D9_USE[i]*k*ease(q);glow(ctx,bx,by-bh,12,[60,150,90],0.5*q*(1-q));ctx.fillStyle="rgba(40,120,70,0.95)";ctx.fillRect(bx-bw/2,by-bh,bw,bh);}}
  const mid=(d9_juneAt(x,y,w,h,D9_AWAY[0])[0]+d9_juneAt(x,y,w,h,D9_AWAY[1])[0])/2,lab=(s,c,yy,v)=>{if(v<=0.01)return;withA(ctx,v,()=>{const tw_=tw(ctx,s,28,800)+24;ctx.fillStyle="rgba(244,238,224,0.94)";ctx.fillRect(mid-tw_/2,yy-30,tw_,40);T(ctx,s,mid,yy,{w:800,size:28,align:"center",color:c});});};
  lab("no readings",rgba([180,60,50],1),by-24,(o.gap||0)*(1-(o.est||0)));lab("estimated from last year",rgba([160,92,18],1),by-142,o.estL||0);lab("actual: almost nothing",rgba([40,120,70],1),by-36,o.actL||0);});}
// a suitcase, drawn small: away from home
function d9_case(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle="rgba(52,60,110,0.9)";ctx.lineWidth=2.6;rr(ctx,-18,-12,36,26,4);ctx.stroke();ctx.beginPath();ctx.moveTo(-7,-12);ctx.lineTo(-7,-18);ctx.lineTo(7,-18);ctx.lineTo(7,-12);ctx.stroke();ctx.restore();}

/* ---------- the script on the wall ---------- */
// the script's code, as texture
const D9_CODE=["-- re-bill estimates that have an actual","select e.reading_id, e.point, e.day","  from readings e","  join readings a on a.point = e.point","   and a.day = e.day","   and a.kind = 'actual'"," where e.kind = 'estimate'","insert into billing_queue_old"];
// A script in a dark window: its name, a moon (it runs at night), its code; o.scan (0..1) runs down its lines; o.hi lights it; o.stop
// (0..1) the yellow note that says it was a stopgap
function d9_script(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,TECH,{glow:12+16*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.96)"});
  ctx.fillStyle="rgba(120,200,255,0.10)";rr(ctx,x+2,y+2,w-4,54,14);ctx.fill();T(ctx,o.name||"nightly script",x+24,y+38,{f:"mono",w:500,size:28,color:rgba(TECH,1)});d9_moon(ctx,x+w-34,y+29,13,TECH,1);
  const lh=Math.min(26,(h-76)/D9_CODE.length);D9_CODE.forEach((l,i)=>{const yy=y+84+i*lh,sc=o.scan==null?-1:o.scan*D9_CODE.length;if(sc>=0&&Math.abs(sc-i-0.5)<0.9){ctx.fillStyle="rgba(120,200,255,0.16)";ctx.fillRect(x+12,yy-lh+6,w-24,lh);}
    T(ctx,l,x+24,yy,{f:"mono",w:500,size:Math.min(18,lh*0.72),color:rgba(i===0?[150,170,150]:SOFT,0.85),deco:1});});
  if(o.stop>0.01){const q=clamp(o.stop,0,1),k=1+0.14*(1-ease(q));ctx.save();ctx.translate(x+w+14,y-4);ctx.scale(k,k);sticky(ctx,0,0,190,70,"stopgap",{col:NOTEC[0],size:30,rot:0.08,a:q});ctx.restore();}});}
// a moon, for every night
function d9_moon(ctx,x,y,r,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.globalCompositeOperation="destination-out";ctx.beginPath();ctx.arc(x+r*0.5,y-r*0.3,r*0.86,0,TAU);ctx.fill();ctx.restore();});}
// meter readings, as rows: [point, day, kind]; o.hi[i] lights a row; o.pairs: [estimate row, actual row] linked by a bracket, o.pp (0..1)
const D9_ROWS=[["point 4417","12 Jun","estimate"],["point 4417","12 Jun","actual"],["point 2093","14 Jun","estimate"],["point 7731","14 Jun","estimate"],["point 7731","14 Jun","actual"]];
function d9_readings(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=56,h=86+D9_ROWS.length*rh;if(a<=0.01)return h;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,D9_NET,{glow:12,ea:0.8,fill:"rgba(6,10,22,0.95)"});
  dbGlyph(ctx,x+36,y+44,D9_NET,0.7);T(ctx,"meter readings",x+64,y+52,{w:800,size:30,color:rgba(D9_NET,1)});
  D9_ROWS.forEach(([pt,day,kind],i)=>{const yy=y+82+i*rh,hi=o.hi?o.hi[i]||0:0;if(hi>0.01){ctx.fillStyle=rgba(kind==="actual"?D9_OK:[255,196,110],0.16*hi);rr(ctx,x+12,yy,w-24,rh-8,8);ctx.fill();}
    T(ctx,pt,x+28,yy+34,{f:"mono",w:500,size:20,color:rgba(SOFT,0.8),deco:1});T(ctx,day,x+178,yy+34,{f:"mono",w:500,size:20,color:rgba(SOFT,0.8),deco:1});
    T(ctx,kind,x+w-28,yy+36,{f:"mono",w:500,size:28,align:"right",color:rgba(kind==="actual"?D9_OK:[255,196,110],1)});
    if(o.ok>0)tick_(ctx,x+w-196,yy+26,26,D9_OK,clamp(o.ok*D9_ROWS.length-i,0,1));});
  (o.pairs||[]).forEach(([e,b],k)=>{const q=o.pp?clamp(o.pp[k]||0,0,1):1;if(q<=0)return;const y0=y+82+e*rh+24,y1=y+82+b*rh+24,bx=x+w+14;ctx.save();ctx.strokeStyle=rgba([255,220,140],0.9);ctx.lineWidth=2.5;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(bx-10,y0);ctx.lineTo(bx,y0);ctx.lineTo(bx,lerp(y0,y1,ease(q)));if(q>0.95)ctx.lineTo(bx-10,y1);ctx.stroke();ctx.restore();});});return h;}
// a queue of bills to be corrected: a tray, its bills stacked, o.n of them; o.dead (0..1) greys it: nothing reads it
function d9_queue(ctx,x,y,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const dead=o.dead||0,col=mix(D9_RET,[130,130,140],dead*0.7);withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:10+12*(o.hi||0),ea:0.8,fill:"rgba(14,8,14,0.95)"});
  T(ctx,name,x+28,y+50,{w:800,size:30,color:rgba(col,1)});const n=Math.min(14,o.n||0);for(let i=0;i<n;i++){const cx=x+62+(i%7)*24,cy=y+118-Math.floor(i/7)*16-(i%7)*2;ctx.save();ctx.translate(cx,cy);ctx.rotate((hash(i,930)-0.5)*0.2);
    ctx.fillStyle=rgba(mix([236,240,246],[150,150,156],dead*0.6),0.95);ctx.fillRect(-26,-17,52,34);ctx.fillStyle="rgba(200,50,50,0.7)";ctx.fillRect(-20,-9,22,4);ctx.restore();}
  if(o.count)withA(ctx,o.cA==null?1:o.cA,()=>{T(ctx,o.count,x+w-30,y+h-66,{w:800,size:64,align:"right",color:rgba(mix([255,120,110],INK,0.15),1)});T(ctx,o.what||"bills",x+w-30,y+h-20,{w:700,size:28,align:"right",color:rgba(SOFT,1)});});});}

/* ---------- five places, no home ---------- */
// The rule, found written five ways: [kind, title, how it's written there]. The regulator's code says why; the rest each say how.
const D9_DOCS=[["script","nightly script","re-bill when an actual arrives"],["code","the regulator's retail code","A bill must reflect actual readings."],
  ["settings","meter system settings","replace estimates after 2 days"],["notes","billing team's notes","correct it on the next bill"],["sheet","complaints spreadsheet","refund if the customer asks"]];
// one of them, drawn as what it is: a script, a code of practice, a settings screen, a page of notes, a spreadsheet; o.hi lights it
function d9_doc(ctx,kind,x,y,w,h,title,line,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  const hi=o.hi||0;if(hi>0.01){ctx.save();ctx.shadowColor=rgba(o.hiCol||TRUST,0.9*hi);ctx.shadowBlur=26*hi;ctx.strokeStyle=rgba(o.hiCol||TRUST,0.9*hi);ctx.lineWidth=4;rr(ctx,-7,-7,w+14,h+14,14);ctx.stroke();ctx.restore();}
  const dark=kind==="script"||kind==="settings",ink=dark?rgba(INK,0.96):"rgba(44,42,46,0.95)",tl=wrapT(ctx,title,0,0,w-(kind==="script"?84:kind==="notes"?60:44),{size:28,w:kind==="script"?500:800,f:kind==="script"?"mono":undefined,measure:true}),th=24+tl.length*32;
  if(dark){glass(ctx,0,0,w,h,14,kind==="script"?TECH:APL,{glow:10,ea:0.8,fill:"rgba(6,10,20,0.96)"});ctx.fillStyle="rgba(120,200,255,0.10)";rr(ctx,2,2,w-4,th+6,12);ctx.fill();}
  else{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=14;ctx.shadowOffsetY=5;ctx.fillStyle=kind==="notes"?"#f3ecd2":kind==="sheet"?"#f4f6f2":"#efe8da";ctx.fillRect(0,0,w,h);ctx.restore();}
  ctx.save();rr(ctx,0,0,w,h,14);ctx.clip();const TT=(col,x0,o2)=>tl.forEach((l,i)=>T(ctx,l,x0,36+i*32,Object.assign({w:800,size:28,color:col},o2||{})));
  if(kind==="script"){TT(rgba(TECH,1),22,{f:"mono",w:500});d9_moon(ctx,w-30,27,11,TECH,1);[0,1,2].forEach(i=>T(ctx,D9_CODE[i+1],22,th+30+i*22,{f:"mono",w:500,size:16,color:rgba(SOFT,0.7),deco:1}));}
  if(kind==="settings"){TT(rgba(APL,1),22);
}
  if(kind==="code"){TT("rgba(70,52,110,1)",22);ctx.strokeStyle="rgba(70,52,110,0.5)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(22,th+4);ctx.lineTo(w-22,th+4);ctx.stroke();
    T(ctx,"§ 21",w-22,th+36,{f:"mono",w:500,size:22,align:"right",color:"rgba(70,52,110,0.8)",deco:1});ctx.strokeStyle="rgba(120,96,180,0.75)";ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(w-40,h-36,20,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(w-40,h-36,13,0,TAU);ctx.stroke();}
  if(kind==="notes"){ctx.strokeStyle="rgba(90,130,190,0.25)";ctx.lineWidth=1;for(let yy=70;yy<h-8;yy+=30){ctx.beginPath();ctx.moveTo(10,yy);ctx.lineTo(w-10,yy);ctx.stroke();}ctx.strokeStyle="rgba(200,70,70,0.4)";ctx.beginPath();ctx.moveTo(30,0);ctx.lineTo(30,h);ctx.stroke();
    TT("rgba(40,60,120,0.95)",42);}
  if(kind==="sheet"){ctx.fillStyle="rgba(60,150,90,0.85)";ctx.fillRect(0,0,w,th+6);TT("#fff",18);ctx.strokeStyle="rgba(60,90,70,0.25)";ctx.lineWidth=1;
    for(let c=1;c<4;c++){ctx.beginPath();ctx.moveTo(c*w/4,th+6);ctx.lineTo(c*w/4,h);ctx.stroke();}for(let yy=th+36;yy<h;yy+=30){ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(w,yy);ctx.stroke();}}
  // how the rule is written there, readable
  const ly=th+(kind==="code"?70:kind==="sheet"?62:kind==="notes"?58:kind==="settings"?48:96),ls=wrapT(ctx,line,0,0,w-(kind==="notes"?64:44),{size:28,w:700,measure:true});
  if(kind==="sheet"){ctx.fillStyle="rgba(255,236,150,0.8)";ctx.fillRect(4,ly-32,w-8,ls.length*32+12);}
  if(kind==="settings"){ctx.fillStyle="rgba(140,214,255,0.10)";rr(ctx,14,ly-36,w-28,ls.length*32+18,8);ctx.fill();const tx=w-62,ty=ly+ls.length*32+30;ctx.fillStyle=rgba(D9_OK,0.9);rr(ctx,tx,ty-14,44,26,13);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(tx+31,ty-1,10,0,TAU);ctx.fill();}
  ls.forEach((l,i)=>T(ctx,l,kind==="notes"?42:22,ly+i*32,{w:700,size:28,color:kind==="notes"?"rgba(30,50,120,0.95)":ink}));
  ctx.restore();ctx.restore();});}
// a dashed place where something should be, empty: with a question mark, or a few words
function d9_slot(ctx,x,y,w,h,col,a,label){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2.5;rr(ctx,x,y,w,h,12);ctx.stroke();ctx.restore();
  if(label)T(ctx,label,x+w/2,y+h/2+11,{w:700,size:30,align:"center",color:rgba(col,0.95)});else T(ctx,"?",x+w/2,y+h/2+18,{w:800,size:52,align:"center",color:rgba(col,0.95)});});}
// Tartu's register, small, with roads from the offices that ask it: once only
function d9_regMini(ctx,cx,cy,t,a){if(a<=0.01)return;withA(ctx,a,()=>{const R=[[-150,-90],[150,-90],[-180,40],[180,40]];R.forEach(([dx,dy],i)=>{d9_road(ctx,[[cx+dx,cy+dy],[cx+dx*0.5,cy+dy*0.5],[cx,cy]],1,{t,lw:0.5,ask:((t*0.4+i*0.25)%1)});d9_officeS(ctx,cx+dx,cy+dy,{});});
  glass(ctx,cx-118,cy-40,236,80,16,D9_TAR,{glow:16,ea:0.85,fill:"rgba(8,14,30,0.95)"});dbGlyph(ctx,cx-82,cy+4,D9_TAR,0.7);T(ctx,"one register",cx-54,cy+12,{w:700,size:28,color:rgba(INK,0.96)});});}

/* ---------- where a rule comes from, and what it's about ---------- */
// an influence, as ArchiMate draws it: a dashed line with an open arrowhead, drawn up to p
function d9_infl(ctx,x0,y0,x1,y1,col,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{const q=ease(clamp(p,0,1)),xe=lerp(x0,x1,q),ye=lerp(y0,y1,q);ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.6;ctx.setLineDash([9,7]);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);if(q>0.98){const an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-Math.cos(an-0.45)*16,y1-Math.sin(an-0.45)*16);ctx.lineTo(x1,y1);ctx.lineTo(x1-Math.cos(an+0.45)*16,y1-Math.sin(an+0.45)*16);ctx.stroke();}ctx.restore();});}
// a realisation, as ArchiMate draws it: a dotted line with a hollow triangle at the end it realises, drawn up to p
function d9_real(ctx,x0,y0,x1,y1,col,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{const q=ease(clamp(p,0,1)),an=Math.atan2(y1-y0,x1-x0),L=Math.hypot(x1-x0,y1-y0),xe=x0+Math.cos(an)*Math.max(0,L*q-18),ye=y0+Math.sin(an)*Math.max(0,L*q-18);
  ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.6;ctx.setLineDash([3,6]);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);
  if(q>0.98){ctx.fillStyle="rgba(9,8,22,1)";ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-Math.cos(an-0.5)*20,y1-Math.sin(an-0.5)*20);ctx.lineTo(x1-Math.cos(an+0.5)*20,y1-Math.sin(an+0.5)*20);ctx.closePath();ctx.fill();ctx.stroke();}ctx.restore();});}
// a clock, for a service level
function d9_clock(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.6,s*0.12);ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,s*0.7,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-s*0.42);ctx.moveTo(x,y);ctx.lineTo(x+s*0.32,y+s*0.1);ctx.stroke();ctx.restore();}
// a kind of reason, as a chip: o.kind "driver", "principle" or "clock", in motivation's purple
function d9_why(ctx,cx,cy,label,kind,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,label,30,700)+86,h=58;glass(ctx,cx-w/2,cy-h/2,w,h,h/2,MOT,{glow:10+12*(o.hi||0),ea:0.85,fill:"rgba(12,10,26,0.94)"});
  if(kind==="clock")d9_clock(ctx,cx-w/2+34,cy,22,MOT);else archGlyph(ctx,kind,cx-w/2+34,cy,15,MOT);T(ctx,label,cx-w/2+62,cy+11,{w:700,size:30,color:rgba(mix(MOT,INK,0.4),1)});});}
// a fact, as a statement about concepts: glass, with a mono kicker
function d9_fact(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ls=wrapT(ctx,text,0,0,w-48,{size:28,w:700,measure:true}),h=70+ls.length*34;withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,[190,200,220],{glow:10+12*(o.hi||0),ea:0.75,fill:"rgba(8,12,24,0.94)"});
  T(ctx,"fact",x+24,y+36,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});ls.forEach((l,i)=>T(ctx,l,x+24,y+76+i*34,{w:700,size:28,color:rgba(INK,0.95)}));});return h;}
// a concept, as a term the business uses: a chip with a small book
function d9_term(ctx,cx,cy,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[214,226,240];withA(ctx,a,()=>{const w=tw(ctx,label,30,800)+82,h=60;glass(ctx,cx-w/2,cy-h/2,w,h,h/2,col,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(10,12,22,0.94)"});
  ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2;const bx=cx-w/2+32,by=cy;ctx.beginPath();ctx.moveTo(bx,by-11);ctx.quadraticCurveTo(bx-8,by-14,bx-14,by-11);ctx.lineTo(bx-14,by+11);ctx.quadraticCurveTo(bx-8,by+8,bx,by+11);ctx.quadraticCurveTo(bx+8,by+8,bx+14,by+11);ctx.lineTo(bx+14,by-11);ctx.quadraticCurveTo(bx+8,by-14,bx,by-11);ctx.lineTo(bx,by+11);ctx.stroke();ctx.restore();
  T(ctx,label,cx-w/2+58,cy+11,{w:800,size:30,color:rgba(INK,0.97),deco:o.deco});});}
// a word from the industry's model, beside the utility's own: a mono kicker and the term
function d9_ind(ctx,cx,cy,term,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const k="industry model",kw=tw(ctx,k,28,500,"mono"),w=kw+tw(ctx,term,30,800)+64,h=56,col=[176,196,222];glass(ctx,cx-w/2,cy-h/2,w,h,12,col,{glow:8+12*(o.hi||0),ea:0.75,fill:"rgba(10,14,24,0.94)"});
  T(ctx,k,cx-w/2+20,cy+10,{f:"mono",w:500,size:28,color:rgba(col,0.9)});T(ctx,term,cx-w/2+kw+44,cy+11,{w:800,size:30,color:rgba(INK,0.97)});});}
// a data object, as ArchiMate draws it, in the information layer's peach: its name, and o.sub (0..1) a second line
function d9_obj(ctx,x,y,w,h,name,sub,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,8,INF,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(16,10,8,0.95)"});ctx.fillStyle=rgba(INF,0.12+0.1*(o.hi||0));rr(ctx,x,y,w,h,8);ctx.fill();
  archGlyph(ctx,"object",x+w-28,y+24,13,INF);const sv=sub?clamp(o.sv==null?1:o.sv,0,1):0;T(ctx,name,x+28,y+(sv>0.01?52:h/2+11),{w:800,size:32,color:rgba(INK,0.97)});
  if(sv>0.01)withA(ctx,sv,()=>T(ctx,sub,x+28,y+98,{w:700,size:28,color:rgba(mix(INF,INK,0.4),1)}));});}

/* ---------- the step, and what it expects ---------- */
// A stage of a value stream, as ArchiMate draws one: a chevron, in strategy's colour. o.first: flat at the back; o.lx, o.ly: where
// its name sits (default the middle); o.hi lights it.
function d9_chev(ctx,x,y,w,h,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=h*0.32,sz=o.size||34;
  const path=()=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-n,y);ctx.lineTo(x+w,y+h/2);ctx.lineTo(x+w-n,y+h);ctx.lineTo(x,y+h);if(!o.first)ctx.lineTo(x+n,y+h/2);ctx.closePath();};
  withA(ctx,a,()=>{ctx.save();ctx.shadowColor=rgba(STR,0.6);ctx.shadowBlur=16+16*(o.hi||0);path();ctx.fillStyle="rgba(7,12,24,0.95)";ctx.fill();ctx.restore();
    path();ctx.fillStyle=rgba(STR,0.13+0.1*(o.hi||0));ctx.fill();ctx.strokeStyle=rgba(STR,0.9);ctx.lineWidth=2.4+1.5*(o.hi||0);path();ctx.stroke();
    archGlyph(ctx,"stream",x+(o.first?32:n+24),y+28,12,STR);
    T(ctx,label,o.lx==null?x+(o.first?w/2-n/4:w/2+n/4):o.lx,o.ly==null?y+h/2+sz*0.36:o.ly,{w:800,size:sz,align:"center",color:rgba(INK,0.96),deco:o.deco});});}
// a rule folded to its kind and id, for when it's there but isn't the subject (its kind names it a rule, so it needs no glyph);
// returns its width
function d9_rulePill(ctx,cx,cy,id,side,o){o=o||{};const a=o.a==null?1:o.a,s=d9_kind(id)+" · "+id,w=tw(ctx,s,28,500,"mono")+52,h=58;if(a<=0.01)return w;withA(ctx,a,()=>{
  glass(ctx,cx-w/2,cy-h/2,w,h,14,MOT,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(9,8,22,0.95)"});ctx.fillStyle=rgba(side,0.95);rr(ctx,cx-w/2+9,cy-h/2+12,6,h-24,3);ctx.fill();
  T(ctx,s,cx-w/2+30,cy+10,{f:"mono",w:500,size:28,color:rgba(MOT,1),deco:o.deco});});return w;}
// the step's own steps, as business processes: an estimate, then replaced or explained; p brings them in, left to right
function d9_steps(ctx,x,cy,p,o){o=o||{};if(p<=0.01)return;let X=x;const q=i=>clamp(p*5-i,0,1),pill=(s,a)=>{const w=tw(ctx,s,28,700)+36;withA(ctx,a,()=>{glass(ctx,X,cy-23,w,46,23,BUS,{glow:8+12*(o.hi||0),ea:0.8,fill:"rgba(20,18,6,0.94)"});T(ctx,s,X+18,cy+10,{w:700,size:28,color:rgba(BUS,1)});});X+=w;};
  pill("estimate",q(0));withA(ctx,q(1),()=>{ctx.save();ctx.strokeStyle=rgba(BUS,0.9);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(X+10,cy);ctx.lineTo(X+40,cy);ctx.moveTo(X+31,cy-8);ctx.lineTo(X+40,cy);ctx.lineTo(X+31,cy+8);ctx.stroke();ctx.restore();});X+=50;
  pill("replace",q(2));X+=14;withA(ctx,q(3),()=>T(ctx,"or",X,cy+10,{w:600,size:28,color:rgba(SOFT,0.95)}));X+=tw(ctx,"or",28,600)+14;pill("explain",q(4));}
// what a step expects of its data: the dimension and where it comes from in a mono kicker, then what's expected (o.p writes it).
// g: the source's glyph, "clock" (a service level), "process" (its steps) or "requirement" (a rule)
function d9_expect(ctx,x,y,w,h,dim,src,text,g,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,INF,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(16,10,8,0.95)"});
  ctx.fillStyle=rgba(INF,0.08+0.08*(o.hi||0));rr(ctx,x,y,w,h,14);ctx.fill();d9_src(ctx,g,x+48,y+h/2,o.gl==null?1:o.gl);
  T(ctx,dim,x+96,y+44,{f:"mono",w:600,size:28,color:rgba(INF,1)});T(ctx,"· "+src,x+96+tw(ctx,dim+" ",28,600,"mono"),y+44,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
  const s=o.p==null?text:text.slice(0,Math.round(text.length*clamp(o.p,0,1)));T(ctx,s,x+96,y+88,{w:700,size:30,color:rgba(INK,0.97)});});}
// a source's glyph: a service level's clock, a process, or a requirement
function d9_src(ctx,g,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{if(g==="clock")d9_clock(ctx,x,y,30,MOT);else if(g==="requirement")d9_reqGlyph(ctx,x,y,22,MOT);else archGlyph(ctx,"process",x,y,26,BUS);});}

/* ---------- written once, checked everywhere ---------- */
// The tests generated from the data rule, RUL-020, as each tool writes its check that a reading's mark, its kind, is one of the two
// the readings hold: [title, lines]. Its id stands out in purple wherever it appears. (Each also requires the mark: the column can't
// be empty.)
const D9_GEN=[["dbt test",["data_tests:","  - accepted_values:","      arguments: {values: [actual, estimate]}","      config: {meta: {rule_id: RUL-020}}"]],
  ["data contract · quality rule",["- id: RUL-020","  metric: invalidValues","  arguments: {validValues: [actual, estimate]}","  mustBe: 0"]],
  ["shape for linked data",["ex:RUL-020 a sh:NodeShape ;","  sh:targetClass ex:Reading ;","  sh:property [ sh:path ex:kind ;",'    sh:in ( "actual" "estimate" ) ] .']]];
// and the tracking table generated from retail's rule, RUL-022, a model like any other: the bills the rule applies to that the next
// bill didn't correct, each with the rule's id and its owner's team, who work through it each morning
const D9_TRK=["select bill_id, next_bill_id,","       'RUL-022' as rule_id,","       'billing team' as owner","  from bills_on_replaced_estimates"," where not corrected_on_next_bill"];
// a padlock
function d9_lock(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.6,s*0.15);ctx.beginPath();ctx.arc(x,y-s*0.18,s*0.36,Math.PI,0);ctx.stroke();rr(ctx,x-s*0.55,y-s*0.18,s*1.1,s*0.78,s*0.12);ctx.fill();ctx.restore();}
// a line of code, in mono, with a rule's id in purple
function d9_code(ctx,s,x,y,col){let X=x;s.split(/(RUL-0[0-9][0-9])/).forEach(p=>{if(!p)return;const id=/^RUL-0[0-9][0-9]$/.test(p);
  T(ctx,p,X,y,{f:"mono",w:id?700:500,size:28,color:id?rgba(MOT,1):col});X+=tw(ctx,p,28,id?700:500,"mono");});}
// a check generated from a rule, as a card of code: its title, a padlock with "generated", and its lines (o.p types them); o.lock
// (0..1) reddens the padlock, for a hand that tries to edit it; o.hiLine lights one line, by o.hl (0..1)
function d9_gen(ctx,x,y,w,h,title,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,TECH,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.96)"});
  if(o.hl>0.01){ctx.save();ctx.fillStyle=rgba(D9_RET,0.16*o.hl);rr(ctx,x+16,y+100+o.hiLine*34-27,w-32,36,8);ctx.fill();ctx.restore();}
  T(ctx,title,x+30,y+48,{w:800,size:30,color:rgba(mix(TECH,INK,0.45),1)});const lc=mix([150,166,190],D9_RED,o.lock||0),gw=tw(ctx,"generated",28,500,"mono");
  if(o.lock>0.01)glow(ctx,x+w-gw-60,y+40,40,D9_RED,0.6*o.lock);d9_lock(ctx,x+w-gw-60,y+40,24,lc);T(ctx,"generated",x+w-gw-28,y+50,{f:"mono",w:500,size:28,color:rgba(lc,1)});
  let left=lines.join(" ").length*(o.p==null?1:clamp(o.p,0,1));lines.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;if(s_)d9_code(ctx,s_,x+30,y+100+i*34,rgba(mix(TECH,INK,0.25),0.95));});});}
// a pencil, its tip at (x, y), lying down and to the right of it
function d9_pencil(ctx,x,y,s,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(0.72);ctx.scale(s,s);ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=14;ctx.shadowOffsetY=6;
  ctx.fillStyle="#e9c46a";ctx.fillRect(30,-11,124,22);ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.fillStyle="#d4a64a";ctx.fillRect(30,3,124,8);ctx.fillStyle="#f1dcb4";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(30,-11);ctx.lineTo(30,11);ctx.closePath();ctx.fill();
  ctx.fillStyle="#3a3f4a";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(10,-3.7);ctx.lineTo(10,3.7);ctx.closePath();ctx.fill();ctx.fillStyle="#b8c0cc";ctx.fillRect(154,-11,16,22);ctx.fillStyle="#e79aa6";rr(ctx,170,-11,20,22,5);ctx.fill();ctx.restore();});}
// a result, round: a tick or a cross, in its colour
function d9_res(ctx,x,y,r,ok,col,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*2.2,col,0.3);ctx.fillStyle="rgba(8,12,22,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,col,1,2.6);
  if(ok)tick_(ctx,x,y+1,r*1.2,col,1);else cross_(ctx,x,y,r*1.5,col,1);});}
// the sun, for a morning
function d9_sun(ctx,x,y,r,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,r*0.42,0,TAU);ctx.fill();
  for(let i=0;i<8;i++){const an=i*TAU/8;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.66,y+Math.sin(an)*r*0.66);ctx.lineTo(x+Math.cos(an)*r,y+Math.sin(an)*r);ctx.stroke();}ctx.restore();}
// a pill with a glyph and a label: kind "mail" (an envelope), "team" (ArchiMate's actor), "ok" (a tick, for a test that passes) or
// "table" (a small table, for a tracking table); returns its width
function d9_pill(ctx,cx,cy,label,col,kind,o){o=o||{};const a=o.a==null?1:o.a,w=tw(ctx,label,30,700)+(kind?86:44),h=58;if(a<=0.01)return w;withA(ctx,a,()=>{glass(ctx,cx-w/2,cy-h/2,w,h,h/2,col,{glow:10+14*(o.hi||0),ea:0.85,fill:"rgba(10,12,22,0.94)"});
  const gx=cx-w/2+36;if(kind==="mail"){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.lineJoin="round";rr(ctx,gx-15,cy-11,30,22,3);ctx.stroke();ctx.beginPath();ctx.moveTo(gx-15,cy-10);ctx.lineTo(gx,cy+2);ctx.lineTo(gx+15,cy-10);ctx.stroke();ctx.restore();}
  else if(kind==="team")archGlyph(ctx,"actor",gx,cy-2,14,col);
  else if(kind==="ok")tick_(ctx,gx,cy+1,26,D9_OK,1);
  else if(kind==="table"){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.2;rr(ctx,gx-16,cy-13,32,26,3);ctx.stroke();ctx.beginPath();ctx.moveTo(gx-16,cy-4);ctx.lineTo(gx+16,cy-4);
    ctx.moveTo(gx-16,cy+5);ctx.lineTo(gx+16,cy+5);ctx.moveTo(gx-4,cy-13);ctx.lineTo(gx-4,cy+13);ctx.stroke();ctx.restore();}
  T(ctx,label,cx-w/2+(kind?64:22),cy+11,{w:700,size:30,color:rgba(col,1)});});return w;}

/* ---------- generally, an ontology ---------- */
// The concepts, as the map holds them: [id, label, x, y]; how they relate: [from, to, label, where the label sits]; the rules about
// them: [id, concept, x, y]. Then one bill, as facts: what was said about it, and the correction nobody said.
const D9_ON=[["cp","connection point",260,330],["rd","reading",820,330],["bl","bill",1310,330],["ac","actual reading",580,590],["es","estimate",1060,590],["nb","next bill",1310,590]];
const D9_OE=[["rd","cp","taken at","above"],["bl","rd","based on","above"],["ac","rd","is a","left"],["es","rd","is a","right"],["es","ac","replaced by","below"],["bl","nb","corrected on","left"]];
const D9_OR=[["RUL-020","rd",820,196],["RUL-021","es",1060,740],["RUL-022","nb",1590,470]];
// a concept's chip: its width, for edges to stop at
function d9_termW(ctx,label){return tw(ctx,label,30,800)+82;}
// a relation between two chips, as an arrow with its name, drawn up to p; o.dash for one nobody said
function d9_rel(ctx,A,B,label,side,p,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a,col=o.col||[176,190,220];withA(ctx,a,()=>{const[ax,ay,aw]=A,[bx,by,bw]=B,dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
  const ex=(w_,u,v)=>{const tx=u===0?1e9:(w_/2+6)/Math.abs(u),ty=v===0?1e9:36/Math.abs(v);return Math.min(tx,ty);},s0=ex(aw,ux,uy),s1=ex(bw,ux,uy),x0=ax+ux*s0,y0=ay+uy*s0,x1=bx-ux*s1,y1=by-uy*s1,q=ease(clamp(p,0,1)),xe=lerp(x0,x1,q),ye=lerp(y0,y1,q);
  ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.6;ctx.lineCap="round";if(o.dash)ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);
  if(q>0.98){const an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-Math.cos(an-0.42)*16,y1-Math.sin(an-0.42)*16);ctx.lineTo(x1,y1);ctx.lineTo(x1-Math.cos(an+0.42)*16,y1-Math.sin(an+0.42)*16);ctx.stroke();}ctx.restore();
  const mx=(x0+x1)/2,my=(y0+y1)/2,la=clamp((p-0.5)*2,0,1);if(la>0)withA(ctx,la,()=>{const P={above:[mx,my-18,"center"],below:[mx,my+42,"center"],left:[mx-18,my+10,"right"],right:[mx+18,my+10,"left"]}[side];
    T(ctx,label,P[0],P[1],{w:700,size:28,align:P[2],color:rgba(mix(col,INK,0.35),1),deco:o.deco});});});}
// a fact about one thing: a chip in the information domain's peach, for an instance rather than a concept
function d9_inst(ctx,cx,cy,label,o){o=o||{};const a=o.a==null?1:o.a,w=tw(ctx,label,30,800)+56,h=60;if(a<=0.01)return w;withA(ctx,a,()=>{glass(ctx,cx-w/2,cy-h/2,w,h,12,INF,{glow:10+14*(o.hi||0),ea:0.85,fill:"rgba(16,10,8,0.95)"});
  ctx.fillStyle=rgba(INF,0.1+0.1*(o.hi||0));rr(ctx,cx-w/2,cy-h/2,w,h,12);ctx.fill();T(ctx,label,cx,cy+11,{w:800,size:30,align:"center",color:rgba(INK,0.97)});});return w;}
// a verdict: who's asked, the question, and the answer, with its mark ("?" unknown, or a cross)
function d9_verdict(ctx,x,y,w,h,who,q,ans,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+16*(o.hi||0),ea:0.85,fill:"rgba(8,10,20,0.95)"});
  T(ctx,who,x+30,y+46,{f:"mono",w:600,size:28,color:rgba(col,1)});T(ctx,q,x+30,y+96,{w:700,size:30,color:rgba(INK,0.9)});
  const v=o.v==null?1:o.v;if(v>0.01)withA(ctx,v,()=>{const mx=x+w-60,my=y+h/2;if(kind==="?"){ctx.fillStyle="rgba(8,12,22,0.95)";ctx.beginPath();ctx.arc(mx,my,30,0,TAU);ctx.fill();ring(ctx,mx,my,30,col,1,2.6);T(ctx,"?",mx,my+12,{w:800,size:34,align:"center",color:rgba(col,1)});}
    else d9_res(ctx,mx,my,30,false,col,1);T(ctx,ans,mx-50,y+96,{w:800,size:34,align:"right",color:rgba(col,1)});});});}
// one of the map's views, as a row: its glyph, its name and what it holds; on the right, a small picture of it (texture, drawn small on
// purpose), except the ontology's, which is the graph itself, shrunk into place; the checks' shows two passing tests and a tracking table
function d9_view(ctx,x,y,w,h,title,sub,g,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col={book:[214,226,240],object:INF,graph:[176,196,222],tick:TECH}[g];withA(ctx,a,()=>{
  glass(ctx,x,y,w,h,16,col,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(8,11,20,0.95)"});const gx=x+52,gy=y+h/2;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.lineJoin="round";
  if(g==="book"){ctx.beginPath();ctx.moveTo(gx,gy-16);ctx.quadraticCurveTo(gx-11,gy-20,gx-20,gy-16);ctx.lineTo(gx-20,gy+16);ctx.quadraticCurveTo(gx-11,gy+12,gx,gy+16);ctx.quadraticCurveTo(gx+11,gy+12,gx+20,gy+16);ctx.lineTo(gx+20,gy-16);ctx.quadraticCurveTo(gx+11,gy-20,gx,gy-16);ctx.lineTo(gx,gy+16);ctx.stroke();}
  else if(g==="object")archGlyph(ctx,"object",gx,gy,22,col);
  else if(g==="graph"){[[-16,-12],[16,-14],[0,14]].forEach(([dx,dy])=>{ctx.beginPath();ctx.arc(gx+dx,gy+dy,6,0,TAU);ctx.fill();});ctx.beginPath();ctx.moveTo(gx-16,gy-12);ctx.lineTo(gx+16,gy-14);ctx.lineTo(gx,gy+14);ctx.closePath();ctx.stroke();}
  else{ctx.beginPath();ctx.arc(gx,gy,18,0,TAU);ctx.stroke();ctx.restore();tick_(ctx,gx,gy+1,22,col,1);ctx.save();}
  ctx.restore();T(ctx,title,x+96,y+56,{w:800,size:34,color:rgba(INK,0.97)});T(ctx,sub,x+96,y+100,{w:600,size:28,color:rgba(mix(col,INK,0.3),0.95)});
  // the small picture
  const px=x+w-330,py=y+16,pw=300,ph=h-32;ctx.save();ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.5;rr(ctx,px,py,pw,ph,10);ctx.stroke();ctx.restore();
  if(g==="book")[["reading",0],["estimate",1],["bill",2]].forEach(([s_,i])=>{const yy=py+28+i*32;T(ctx,s_,px+20,yy,{w:800,size:16,color:rgba(INK,0.85),deco:1});ctx.fillStyle=rgba(col,0.35);ctx.fillRect(px+120,yy-6,150-i*24,4);});
  else if(g==="object")[[px+24,py+18],[px+164,py+36]].forEach(([bx,by],i)=>{ctx.strokeStyle=rgba(INF,0.8);ctx.lineWidth=1.6;ctx.strokeRect(bx,by,112,58);ctx.beginPath();ctx.moveTo(bx,by+18);ctx.lineTo(bx+112,by+18);ctx.stroke();T(ctx,i?"bill":"meter reading",bx+8,by+14,{w:700,size:12,color:rgba(INK,0.85),deco:1});});
  else if(g==="tick")[0,1,2].forEach(i=>{const yy=py+24+i*32;if(i<2)tick_(ctx,px+28,yy,16,D9_OK,1);
    else{ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=1.5;ctx.strokeRect(px+17,yy-9,22,18);ctx.beginPath();ctx.moveTo(px+17,yy-3);ctx.lineTo(px+39,yy-3);ctx.moveTo(px+25,yy-9);ctx.lineTo(px+25,yy+9);ctx.stroke();}
    ctx.fillStyle=rgba(col,0.35);ctx.fillRect(px+50,yy-2,200-i*30,4);});});}

/* ---------- back in Tartu ---------- */
// the 1,900 bills, found and corrected: the count as it rises (n), and a row of ticks
function d9_count(ctx,x,y,w,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,160,18,D9_OK,{glow:12+14*(o.hi||0),ea:0.8,fill:"rgba(8,16,12,0.95)"});
  T(ctx,Math.round(n).toLocaleString("en-US"),x+30,y+82,{w:800,size:64,color:rgba(D9_OK,1)});T(ctx,"bills found and corrected",x+30,y+128,{w:700,size:28,color:rgba(mix(D9_OK,INK,0.4),1)});
  const tk=o.tk||0;for(let i=0;i<5;i++){const q=clamp(tk*5-i,0,1);if(q>0)tick_(ctx,x+w-150+i*28,y+52,22,D9_OK,q);}});}
// Tartu, today, on a card: the register with the offices that ask it, the benefit paid and nobody asked twice. The small drawing is
// texture; the words are full size
function d9_tartuCard(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,D9_TAR,{glow:12+14*(o.hi||0),ea:0.8,fill:"rgba(8,14,30,0.95)"});
  const cx=x+110,cy=y+h/2+6,R=[[-70,-48],[70,-48],[-80,40],[80,40]];R.forEach(([dx,dy],i)=>{d9_road(ctx,[[cx+dx,cy+dy],[cx+dx*0.5,cy+dy*0.5],[cx,cy]],1,{t,lw:0.4,ask:((t*0.4+i*0.25)%1)});ctx.fillStyle="rgba(10,16,32,1)";ctx.beginPath();ctx.arc(cx+dx,cy+dy,13,0,TAU);ctx.fill();ring(ctx,cx+dx,cy+dy,13,D9_TAR,1,2);});
  glass(ctx,cx-34,cy-22,68,44,8,D9_TAR,{glow:10,ea:0.9,fill:"rgba(10,18,36,1)"});ctx.fillStyle=rgba(D9_TAR,0.6);for(let i=0;i<3;i++)ctx.fillRect(cx-22,cy-10+i*9,44,3);
  const tx=x+236;T(ctx,"Tartu · today",tx,y+52,{f:"mono",w:600,size:28,color:rgba(D9_TAR,1)});
  withA(ctx,o.paid||0,()=>{tick_(ctx,tx+14,y+98,24,D9_OK,1);T(ctx,"benefit paid",tx+40,y+108,{w:800,size:30,color:rgba(D9_OK,1)});});
  withA(ctx,o.once||0,()=>T(ctx,"nobody asked twice",tx,y+156,{w:700,size:30,color:rgba(D9_DAWN,1)}));});}

/* ===== Rules with a home: scenes =====
   Eleven chapters, as in ../script.md. Tartu today: a birth entered once in the population register, a benefit offered to parents
   who never applied, and no office asking the parents again, each asking the register over X-Road; then day one's data rule
   and the bill of $412.80 beside it; the household away in June, whose meter stored its readings; the nightly script on the wall
   between the network and retail, writing since March to a queue nothing reads; the rule in five places, none of them its home;
   the rule split in two, one on each side, joined by what crosses; where each comes from, and the goal that was an obligation;
   what a rule is about; the step it's attached to and what that step expects of the data; the rule in a set form and the checks
   generated from it; generally, an ontology; and back in Tartu.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: every
   shot drifts slowly and things arrive with a spring. Sound: every effect in tools/score.py fires at the same moment as the thing
   it belongs to here, so keep the two in step. */

/* ---------- 1. Once only ---------- */
// The offices that ask the register: two named, over it, and others like them on each side, unnamed (the register has many users).
// Named: [name, x, y], each 440 wide; the others: their centres. Each has a road, X-Road, to the register.
const D9_OFF=[["Health Insurance Fund",520,70],["Social Insurance Board",980,70]];
const D9_OTH=[[330,282],[220,382],[330,482],[1590,282],[1700,382],[1590,482]];
const D9_REG=[700,330,520,236];
const D9_ROADS=[d9_bez([740,160],[740,250],[830,240],[830,330]),d9_bez([1200,160],[1200,250],[1090,240],[1090,330])].concat(D9_OTH.map(([x,y],i)=>{const L=x<960,sx=L?x+34:x-34,ex=L?700:1220,ey=[396,448,500][i%3],mx=lerp(sx,ex,0.5);return d9_bez([sx,y],[mx,y],[mx,ey],[ex,ey]);}));
// the camera on Tartu: keys of [time, x, y, zoom], eased over d seconds, as ea.js's focus() moves it; and where a point of the view
// lands on screen, with the scene's drift
function d9_cam(t,keys,d){let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}return{x,y,z};}
function d9_onScreen(c,t,sc,px,py,dz,dy){const zd=1+dz*ease(clamp(t/Math.max(1,sc.dur),0,1)),X=960+(px-c.x)*c.z,Y=540+(py-c.y)*c.z;return[960+(X-960)*zd,dy+(Y-dy)*zd];}
scene("tartu",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);
  const tA=c("asks"),tK=c("link"),u=lerp(0.18,0.66,clamp(t/sc.dur,0,1));
  // Tartu at dawn: the camera pushes towards the family's window, then lifts to the sky over the town, where the offices are
  const tIn=w("email","Days later")-0.6,tOut=w("asks","No office")-0.5,net=ease(fin(t,tOut,1.6)),cam=d9_cam(t,[[0,960,540,1.0],[tIn,1400,560,1.2],[tOut,960,270,1.0]],1.8);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:520});ctx.translate(960,540);ctx.scale(cam.z,cam.z);ctx.translate(-cam.x,-cam.y);
  d9_tartu(ctx,t,{u,dim:0.45*ease(fin(t,tIn,1.4))*(1-net)+0.62*net,light:1+0.4*pulseAt(t,w("born","born"),1.6)});ctx.restore();
  const win=d9_onScreen(cam,t,sc,1679,476,0.03,520);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  // the register: first in the sky, then in the middle of the offices
  const r0=[150,150,560,236],r1=D9_REG,rk=ease(fin(t,tOut+0.2,1.6)),rx=lerp(r0[0],r1[0],rk),ry=lerp(r0[1],r1[1],rk),rw=lerp(r0[2],r1[2],rk),rh=lerp(r0[3],r1[3],rk);
  const tR=w("born","population register")-0.5,ent=w("born","entered"),rec=clamp((t-ent)/1.6,0,1),regA=1-0.85*fin(t,tIn+0.4,0.6)*(1-rk);
  const tHome=w("link","one home"),tOwn=w("link","one owner"),tOnce=w("link","asked for once"),tOnly=w("link","once only");
  arrive(ctx,rx+rw/2,ry+rh/2,t,tR,()=>d9_register(ctx,rx,ry,rw,rh,{a:regA,row:"a birth · Tartu · today",lit:clamp((t-ent-1.5)/0.6,0,1),hi:pulseAt(t,ent+1.6,1.4)+0.7*fin(t,tHome,0.6)+0.5*pulseAt(t,B+0.4,2.2)}),{dy:-16});
  // the birth, entered once: a record rising from the window to the register
  if(rec>0&&rec<1){const sx=1679,sy=530,ex=r0[0]+r0[2]/2,ey=r0[1]+r0[3]-30,q=ease(rec),P=q2=>[lerp(sx,ex,q2),lerp(sy,ey,q2)-Math.sin(q2*Math.PI)*170];
    for(let k=0;k<14;k++){const[x2,y2]=P(Math.max(0,q-k*0.018));glow(ctx,x2,y2,14-k*0.8,D9_DAWN,0.3*(1-k/14));}
    const[x,y]=P(q);glass(ctx,x-74,y-24,148,48,24,D9_DAWN,{glow:18,ea:0.95,fill:"rgba(30,20,12,0.92)"});T(ctx,"a birth",x,y+10,{w:800,size:28,align:"center",color:rgba(D9_DAWN,1)});}
  // the phone, close up: the offer; then the application they never made
  const tP=w("email","the parents")-0.4,ph=fin(t,tP,0.7),sh=ease(fin(t,tOut-0.1,0.9)),tN=c("never");
  if(ph>0.01&&sh<0.999){const k=lerp(1,0.16,sh),px=lerp(900,1152,sh),py=lerp(90,52,sh);ctx.save();ctx.translate(px,py);ctx.scale(k,k);d9_phone(ctx,0,0,600,780,t,{a:ph*(1-sh*sh),tap:pulseAt(t,w("email","accept it"),1.4)});ctx.restore();}
  arrive(ctx,530,490,t,tN-0.2,()=>withA(ctx,1-fin(t,tOut-0.3,0.5),()=>{d9_form(ctx,340,230,380,520,{rot:-0.03});tag(ctx,530,800,"no application",D9_DAWN,{align:"center",size:30});}),{dy:-20,from:1.04});
  // the offices, named and not; the parents aren't asked again; then each office's road to the register, with asks going out and
  // answers coming back
  const tPa=w("asks","parents"),tAsk=w("asks","Each one asks"),tX=w("asks","over X-Road"),tLw=w("law","second database"),tLs=w("law","listed");
  D9_OFF.forEach(([nm,x,y],i)=>arrive(ctx,x+220,y+45,t,tOut+[0.5,0.8][i],()=>d9_office(ctx,x,y,440,nm,{hi:pulseAt(t,tAsk+0.9+i*0.25,1.2)+0.5*pulseAt(t,tOnly+i*0.15,1.4)}),{dy:-12}));
  D9_OTH.forEach(([x,y],i)=>arrive(ctx,x,y,t,tOut+1.0+(i%3)*0.12+(i>2?0.06:0),()=>d9_officeS(ctx,x,y,{hi:pulseAt(t,tAsk+1.4+i*0.18,1.2)+0.5*pulseAt(t,tOnly+0.3+i*0.1,1.4)}),{dy:-10}));
  D9_ROADS.forEach((rd,i)=>{const k=i<2?i:2+(i-2)*0.5,rp=clamp((t-tAsk-0.1-k*0.22)/0.9,0,1),cyc=(t-tAsk-1.3-i*0.41)/2.4,ph_=cyc-Math.floor(cyc),live=t>tAsk+1.2;
    d9_road(ctx,rd,rp,{t,lw:i<2?1:0.6,ask:live&&ph_<0.5?ph_*2:null,ans:live&&ph_>=0.5?1-(ph_-0.5)*2:null,hi:pulseAt(t,tX+0.2,1.4)+0.6*pulseAt(t,tOnly+i*0.15,1.4)+0.5*pulseAt(t,B+0.4+i*0.2,1.6)});});
  arrive(ctx,960,236,t,tX-0.1,()=>tag(ctx,960,236,"X-Road",D9_TAR,{align:"center",size:30}),{dy:8});
  if(t>tPa-0.4&&t<tLw+1){const[wx,wy]=win;arrive(ctx,wx-230,wy+16,t,tPa-0.2,()=>withA(ctx,1-fin(t,c("law")-0.3,0.6),()=>tag(ctx,wx-230,wy+16,"not asked again",D9_DAWN,{align:"center",size:30})),{dy:8});}
  // the law: no second database of the same data; and every database listed, with the office that owns it
  arrive(ctx,270,190,t,tLw-0.3,()=>withA(ctx,1-fin(t,tLs-0.4,0.5),()=>{d9_ghostDb(ctx,160,148,220,84,"births");cross_(ctx,202,194,70,D9_RED,fin(t,tLw+0.5,0.3));tag(ctx,270,104,"no second database",D9_RED,{align:"center",size:30});}),{dy:-12});
  const cat=fin(t,tLs-0.3,0.5)*(1-fin(t,tOwn+0.8,0.6));
  arrive(ctx,360,728,t,tLs-0.3,()=>d9_catalogue(ctx,40,600,640,[["population register","Ministry of the Interior"],["health insurance database","Health Insurance Fund"],["social insurance database","Social Insurance Board"]],{a:cat,p:clamp((t-tLs)/1.4,0,1)}),{dy:-14});
  // each fact has one home and one owner; it's asked for once, and everyone who needs it asks there
  arrive(ctx,960,300,t,tHome-0.1,()=>tag(ctx,960,300,"one home",D9_TAR,{align:"center",size:30}),{dy:8});
  arrive(ctx,960,614,t,tOwn-0.1,()=>tag(ctx,960,614,"owner · Ministry of the Interior",TRUST,{align:"center",size:30}),{dy:8});
  const ln=clamp((t-tOnce+0.2)/0.9,0,1);if(ln>0){const[wx,wy]=win;d9_trace_(ctx,[[wx,wy],[lerp(wx,1180,0.5),lerp(wy,570,0.5)-30],[1180,570]],ln,D9_DAWN);
    arrive(ctx,lerp(wx,1180,0.5),lerp(wy,570,0.5)-34,t,tOnce+0.3,()=>tag(ctx,lerp(wx,1180,0.5),lerp(wy,570,0.5)-34,"asked once",D9_DAWN,{align:"center",size:28}),{dy:8});}
  arrive(ctx,960,760,t,tOnly-0.2,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.9)";ctx.shadowBlur=24;T(ctx,"once only",960,790,{w:800,size:84,align:"center",color:rgba(TRUST,1)});ctx.restore();},{dy:16,from:0.9});
  ctx.restore();
  eaYear(ctx,90,90,"today · Tartu, Estonia",D9_DAWN,fin(t,0.6,0.6)*(1-fin(t,tOut,0.5)));
  fadeIn(ctx,S,t,1.4);vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"Rules with a home","objects, owners and rules",EAC,"Film 9 of 11 · enterprise architecture, for data");});
// a pose held between two moments, eased in and out: for person()'s pose mix
const d9_pz=(t,a,b)=>fin(t,a,0.5)*(1-fin(t,b,0.5));

/* ---------- 2. The bill from day one ---------- */
// The wall, with Tomás's note from the last film. Day one's rule and the bill beside it; then Farah's case: the household, June day by
// day, the three weeks away when the meter went quiet, the estimate from last June, and the readings it sent when it came back.
const D9_HS=[540,548],D9_JN=[776,388,770,320];
scene("bill",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  const tD1=w("note","On day one"),tSh=w("note","shown one"),tF=c("flag"),tFw=w("flag","wrong"),tFa=w("away","Farah"),tHh=w("away","household"),tJ=w("away","In June"),tTw=w("away","three weeks"),tSt=w("away","stopped");
  const tE=c("est"),tE2=w("est","last year"),tAm=w("est","four hundred"),tB=c("stored"),tBs=w("stored","sent the readings"),tNo=w("stored","almost nothing"),tN=c("never"),tNa=w("never","arrived"),tNc=w("never","never corrected");
  ctx.save();drift(ctx,t,sc,{z:0.025,y:440});focus(ctx,t,[[0,960,540,1],[tHh-0.6,990,500,1.08],[tN-0.8,970,510,1.04]],1.6);
  person(ctx,"tomas",250,1030,0.78,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,0.5,3.6),expr:t>tNc-0.2?"concerned":"calm"});
  // the note: where does each rule belong? Then aside, to the corner
  const nt=ease(fin(t,tD1-0.7,1.5));arrive(ctx,960,330,t,0.3,()=>{ctx.save();ctx.translate(lerp(960,1590,nt),lerp(330,118,nt));ctx.scale(lerp(1,0.58,nt),lerp(1,0.58,nt));sticky(ctx,0,0,760,210,D9_Q,{col:NOTEC[0],size:50,st:0,rot:-0.02});ctx.restore();},{dy:-30});
  // day one's rule, and the bill beside it, flagged wrong
  const rA=1-fin(t,tFa-0.3,0.8);if(rA>0.01)arrive(ctx,730,387,t,tSh-0.2,()=>withA(ctx,rA,()=>ruleCard(ctx,330,300-30*(1-rA),800,D9_R0,{kicker:"data rule",size:36,hi:pulseAt(t,tSh+0.4,1.6)})),{dy:-14});
  const bm=ease(fin(t,tFa-0.2,1.5)),bx=lerp(1200,830,bm),by=lerp(280,52,bm),fix=fin(t,tNc+0.1,0.5);
  arrive(ctx,bx+230,by+118,t,tF-0.1,()=>d9_bill(ctx,bx,by,460,{bad:fin(t,tFw-0.1,0.4),hi:pulseAt(t,tAm+0.2,1.6)+0.6*pulseAt(t,tNc,1.4),stamp:"never corrected",st:fix}),{dy:-14});
  // Farah, who speaks for the customers, brings the household behind it
  arrive(ctx,1720,900,t,tFa-0.5,()=>d9_personR(ctx,"farah",1720,1030,0.74,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,tFa,tFa+2.8),expr:t>tNc-0.2?"concerned":"calm"}),{dy:-10});
  const[hx,hy]=D9_HS,home=1-fin(t,tTw-0.2,0.8)+fin(t,tB-0.1,0.6),sig=(1-fin(t,tSt-0.1,0.5))+fin(t,tB-0.2,0.5);
  arrive(ctx,hx,hy,t,tHh-0.1,()=>d9_house(ctx,hx,hy,t,{lit:clamp(home,0,1),sig:clamp(sig,0,1),off:fin(t,tSt+0.2,0.4)*(1-fin(t,tB-0.3,0.4))}),{dy:-16});
  // June, day by day: the stored readings, sent when the meter came back, land on the weeks away
  const[jx,jy,jw,jh]=D9_JN,n=D9_AWAY[1]-D9_AWAY[0]+1,act=[],land=i=>tBs+0.2+i*0.07+0.9;for(let i=0;i<n;i++)act.push(fin(t,land(i),0.35));
  arrive(ctx,jx+jw/2,jy+jh/2,t,tJ-0.3,()=>d9_june(ctx,jx,jy,jw,jh,t,{p:fin(t,tJ-0.1,1.4),away:fin(t,tTw-0.2,0.9),gap:fin(t,tSt+0.3,0.6),est:fin(t,tE2-0.2,1.6),estL:fin(t,tE2+0.6,0.5),act,actL:fin(t,tNo-0.3,0.5)}),{dy:-14});
  const mx=hx+68,my=hy+28;for(let i=0;i<n;i++){const s0=tBs+0.2+i*0.07,q=clamp((t-s0)/0.9,0,1);if(q<=0||q>=1)continue;const[bx_,bb]=d9_juneAt(jx,jy,jw,jh,D9_AWAY[0]+i),e=ease(q),px=lerp(mx,bx_,e),py=lerp(my,bb-12,e)-Math.sin(e*Math.PI)*120;
    glow(ctx,px,py,16,D9_NET,0.7);ctx.fillStyle=rgba(mix(D9_NET,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();}
  // the estimate went into the bill; the actual readings arrived, and nothing went back to it
  const mid=(d9_juneAt(jx,jy,jw,jh,D9_AWAY[0])[0]+d9_juneAt(jx,jy,jw,jh,D9_AWAY[1])[0])/2;
  d9_trace_(ctx,[[mid,jy+150],[mid+40,jy-20],[1060,52+236+4]],clamp((t-tAm+0.6)/0.9,0,1),[214,150,60],{dash:[10,8],a:1-fin(t,tB-0.4,0.6)});
  if(t>tNa-0.3)arrive(ctx,jx+jw-84,jy+46,t,tNa-0.2,()=>tag(ctx,jx+jw-84,jy+46,"arrived",D9_OK,{align:"center",size:28}),{dy:8});
  const back=clamp((t-tNc+0.9)/0.8,0,1);if(back>0){const P=[[jx+jw-84,jy+22],[jx+jw-120,jy-40],[1292,196]];d9_trace_(ctx,P.slice(0,2).concat([[lerp(P[1][0],P[2][0],0.5),lerp(P[1][1],P[2][1],0.5)]]),back,D9_OK,{dash:[10,8]});
    if(back>=1)cross_(ctx,lerp(P[1][0],P[2][0],0.5),lerp(P[1][1],P[2][1],0.5),40,BAD,fin(t,tNc,0.3));}
  ctx.restore();
  eaYear(ctx,90,90,"day one",CLAY,fin(t,tD1-0.2,0.5)*(1-fin(t,tFa-0.4,0.5)));
  eaYear(ctx,90,90,"June · this year",[164,200,255],fin(t,tJ-0.2,0.5)*(1-fin(t,tN-0.2,0.5)));
  vign(ctx,S);});

/* ---------- 3. A rule on the wall ---------- */
// The rule existed: a nightly script, on the wall between the network and retail. It found estimates with an actual reading behind
// them and queued their bills to be corrected; since billing moved in March, it writes to a queue nothing reads. Every night: no error.
const D9_SC=[770,300,380,268],D9_TB=[86,286,524],D9_QU=[1310,548,470,226],D9_BS=[1310,256,470,112];
scene("script",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tYr=w("existed","Years ago"),tAn=w("existed","analyst"),tSg=w("existed","stopgap"),tF=c("found"),tEs=w("found","estimates"),tAc=w("found","actual reading"),tQ=w("found","queued");
  const tM=c("march"),tNs=w("march","new system"),tOq=w("march","old queue"),tNr=w("march","nothing reads"),tC=c("clean"),tNe=w("clean","no error"),tCn=w("clean","corrected nothing"),tNh=w("clean","nineteen hundred"),tW=c("wall"),tNi=w("wall","neither side");
  const sd=fin(t,tW-0.5,1.2);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});focus(ctx,t,[[0,960,434,1.5],[tF-0.7,840,470,1.1],[tQ-0.3,1010,490,1.0],[tW-0.7,960,510,1.0]],1.6);
  d9_sides(ctx,{a:0.3+0.7*sd,lab:sd});d9_wall(ctx,t,{a:0.3+0.7*sd,hi:pulseAt(t,tW+0.4,1.8)});
  // the readings it looks through: estimates, and the actual readings behind some of them
  const[tx,ty,tw_]=D9_TB,eH=fin(t,tEs-0.1,0.4),aH=fin(t,tAc-0.1,0.4),pr=fin(t,tAc+0.4,0.6);
  arrive(ctx,tx+tw_/2,ty+180,t,tF-0.5,()=>d9_readings(ctx,tx,ty,tw_,{hi:[eH,aH,eH*(1-pr*0.7),eH,aH],pairs:[[0,1],[3,4]],pp:[pr,clamp(pr*1.2-0.2,0,1)]}),{dy:-14});
  // the script looks along the rows
  const sw=fin(t,tEs-0.3,0.4)*(1-fin(t,tQ,0.5));if(sw>0.01){const u=((t-tEs)*0.6)%1,ry=ty+82+u*5*56+24;ctx.save();ctx.globalAlpha*=0.5*sw;const g=ctx.createLinearGradient(D9_SC[0],0,tx+tw_,0);g.addColorStop(0,rgba(TECH,0.35));g.addColorStop(1,rgba(TECH,0.05));ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(D9_SC[0],D9_SC[1]+130);ctx.lineTo(tx+tw_,ry-26);ctx.lineTo(tx+tw_,ry+26);ctx.lineTo(D9_SC[0],D9_SC[1]+150);ctx.closePath();ctx.fill();ctx.restore();}
  // the billing system that read the queue, until March; then the new one, which doesn't
  const mv=ease(fin(t,tNs-0.5,1.4)),[bx,by,bw,bh]=D9_BS;
  if(mv<0.99)arrive(ctx,bx+bw/2,by+bh/2,t,tQ-0.2,()=>withA(ctx,1-mv,()=>archEl(ctx,bx+mv*60,by+mv*30,bw,bh,"billing system",mix(APL,[130,130,140],mv),"component",{size:30})),{dy:-12});
  if(mv>0.01)withA(ctx,mv,()=>{archEl(ctx,bx,by-mv*0+(1-mv)*-30,bw,bh,"new billing system",APL,"component",{size:30,hi:pulseAt(t,tNs+0.6,1.4)});tag(ctx,bx+bw/2,by-30,"since March",APL,{align:"center",size:28});});
  const rd=fin(t,tQ-0.1,0.6)*(1-fin(t,tNs-0.3,0.5));if(rd>0.01){ctx.save();ctx.globalAlpha*=rd;ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(APL,0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(bx+bw/2,D9_QU[1]);ctx.lineTo(bx+bw/2,by+bh);ctx.stroke();ctx.restore();
    const u=((t*0.8)%1);glow(ctx,bx+bw/2,lerp(D9_QU[1],by+bh,u),14,APL,0.7*rd);}
  const cut=fin(t,tNr-0.2,0.5);if(cut>0.01){ctx.save();ctx.globalAlpha*=cut;ctx.setLineDash([8,8]);ctx.strokeStyle="rgba(140,140,150,0.6)";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(bx+bw/2,D9_QU[1]);ctx.lineTo(bx+bw/2,D9_QU[1]-60);ctx.stroke();ctx.restore();cross_(ctx,bx+bw/2,D9_QU[1]-80,40,BAD,cut);}
  // the queue it writes to: the old one, which nothing reads now. Every night more bills, and none corrected
  const[qx,qy,qw,qh]=D9_QU,nights=Math.max(0,Math.floor((t-tC)/0.42)),night=1+Math.round(219*ease(clamp((t-tC)/(tNh-tC+1.2),0,1))),cnt=Math.round(1900*ease(clamp((t-tCn+0.6)/(tNh-tCn+1.4),0,1))),old=fin(t,tOq-0.1,0.6);
  arrive(ctx,qx+qw/2,qy+qh/2,t,tQ-0.2,()=>{withA(ctx,1-old,()=>d9_queue(ctx,qx,qy,qw,qh,"billing queue",{n:t<tQ+0.9?0:t<tC?2:2+nights}));withA(ctx,old,()=>d9_queue(ctx,qx,qy,qw,qh,"old billing queue",{n:t<tC?2:2+nights,dead:fin(t,tNr,0.8),count:t>tCn-0.6?cnt.toLocaleString("en-US"):"",cA:fin(t,tCn-0.6,0.5),what:"bills, never corrected",hi:pulseAt(t,tCn,1.4)+0.6*pulseAt(t,tNh,1.6)}));},{dy:-12});
  if(cut>0.01)arrive(ctx,qx+qw/2,qy+qh+40,t,tNr-0.1,()=>tag(ctx,qx+qw/2,qy+qh+40,"nothing reads it",BAD,{align:"center",size:28}),{dy:8});
  // bills it queued: the first two, then every night
  const tok=(s0)=>{const q=clamp((t-s0)/0.9,0,1);if(q<=0||q>=1)return;const e=ease(q),P=[[D9_SC[0]+D9_SC[2],D9_SC[1]+150],[1230,qy-20],[qx+120,qy+110]],x=lerp(lerp(P[0][0],P[1][0],e),lerp(P[1][0],P[2][0],e),e),y=lerp(lerp(P[0][1],P[1][1],e),lerp(P[1][1],P[2][1],e),e);
    glow(ctx,x,y,20,[236,240,246],0.4);ctx.save();ctx.translate(x,y);ctx.rotate(0.1);ctx.fillStyle="rgba(236,240,246,0.95)";ctx.fillRect(-20,-13,40,26);ctx.fillStyle="rgba(200,50,50,0.7)";ctx.fillRect(-15,-6,17,3);ctx.restore();};
  tok(tQ+0.1);tok(tQ+0.35);if(t>tC)for(let k=0;k<=nights;k++){const s0=tC+k*0.42;if(t-s0<1)tok(s0);}
  // the script, on the wall; every night it runs and reports no error
  const[sx,sy,sw_,sh]=D9_SC;arrive(ctx,sx+sw_/2,sy+sh/2,t,0.3,()=>d9_script(ctx,sx,sy,sw_,sh,t,{scan:t>tEs-0.2&&t<tQ?((t-tEs+0.2)*0.5)%1:null,hi:pulseAt(t,tAn,1.4)+0.8*sd*(1-fin(t,tNi+1.2,1.2))+0.5*pulseAt(t,tNe,1.2),stop:fin(t,tSg-0.2,0.5)}),{dy:-16});
  if(t>tC-0.2){const k=(t-tC)/0.42,ph=k-Math.floor(k);arrive(ctx,sx+sw_/2,sy+sh+58,t,tC,()=>{glass(ctx,sx-24,sy+sh+28,sw_+48,60,30,D9_OK,{glow:10+10*(1-ph),ea:0.8,fill:"rgba(8,20,12,0.92)"});tick_(ctx,sx+12,sy+sh+58,30,D9_OK,1);
    T(ctx,"no error",sx+40,sy+sh+68,{w:800,size:28,color:rgba(D9_OK,1)});T(ctx,"night "+night,sx+sw_+4,sy+sh+68,{f:"mono",w:500,size:28,align:"right",color:rgba(SOFT,0.95)});},{dy:10});}
  arrive(ctx,D9_SC[0]+D9_SC[2]/2,D9_SC[1]+D9_SC[3]+44,t,tAn-0.1,()=>withA(ctx,1-fin(t,tF-0.6,0.5),()=>tag(ctx,D9_SC[0]+D9_SC[2]/2,D9_SC[1]+D9_SC[3]+44,"written by metering",D9_NET,{align:"center",size:28})),{dy:8});
  // it lived on the wall, and belonged to neither side
  arrive(ctx,700,720,t,tNi-0.3,()=>tag(ctx,700,720,"the network's?",D9_NET,{align:"center",size:28}),{dy:8});arrive(ctx,1222,720,t,tNi-0.1,()=>tag(ctx,1222,720,"retail's?",D9_RET,{align:"center",size:28}),{dy:8});
  ctx.restore();
  eaYear(ctx,90,90,"years ago",CLAY,fin(t,tYr-0.2,0.5)*(1-fin(t,tF-0.4,0.5)));eaYear(ctx,90,90,"March 2026",[164,200,255],fin(t,tM-0.2,0.5)*(1-fin(t,tC-0.3,0.5)));
  vign(ctx,S);});

/* ---------- 4. Five places, no home ---------- */
// Back at the wall: the rule written five ways, the regulator's code saying why and the rest how, a little differently; and an empty
// place where its home should be, beside Tartu's register, asked once.
scene("five",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  const tFo=w("four","four more"),tW=[0.5,w("where","retail code"),w("where","settings"),w("where","notes"),w("where","spreadsheet")],tWhy=w("how","says why"),tHow=w("how","each say how"),tDif=w("how","differently"),tNone=w("how","None of them"),tO=c("once"),tTa=w("once","Tartu"),tOo=w("once","once only");
  ctx.save();drift(ctx,t,sc,{z:0.025,y:440});
  person(ctx,"tomas",230,1030,0.78,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,0.6,3.2)+d9_pz(t,tO-0.2,tO+2.6),expr:t>tNone-0.3&&t<tO?"concerned":"calm"});
  const dW=332,dH=262,dx=i=>84+i*352,dy=176;
  D9_DOCS.forEach(([k,ti,ln],i)=>{const why=i===1,dim=fin(t,tNone-0.2,0.6)*0.35*(1-fin(t,B-1,1));arrive(ctx,dx(i)+dW/2,dy+dH/2,t,tW[i]-0.15,()=>withA(ctx,1-dim,()=>d9_doc(ctx,k,dx(i),dy,dW,dH,ti,ln,{rot:(hash(i,940)-0.5)*0.03,hi:why?pulseAt(t,tWhy,1.6):pulseAt(t,tDif+0.15*Math.max(0,i-2),1.2)*0.9,hiCol:why?MOT:TRUST})),{dy:-16});
    const lab=why?"why":"how",col=why?MOT:[255,214,140];arrive(ctx,dx(i)+dW/2,dy+dH+44,t,why?tWhy-0.1:tHow+0.1+0.12*Math.max(0,i-1),()=>tag(ctx,dx(i)+dW/2,dy+dH+44,lab,col,{align:"center",size:30}),{dy:8});});
  // none of them is its home
  const sl=fin(t,tNone-0.1,0.6);d9_slot(ctx,700,606,420,140,TRUST,sl,"its home?");
  D9_DOCS.forEach((_,i)=>{const p=clamp((t-tNone-0.1-i*0.08)/0.7,0,1);if(p<=0)return;const x0=dx(i)+dW/2,y0=dy+dH+70,x1=lerp(740,1080,i/4),y1=600;ctx.save();ctx.globalAlpha*=0.5*(1-fin(t,tO,0.6));ctx.setLineDash([6,8]);ctx.strokeStyle=rgba(TRUST,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,0.82*ease(p)),lerp(y0,y1,0.82*ease(p)));ctx.stroke();ctx.restore();});
  // what Tartu has for a birth: one register, asked once
  arrive(ctx,1460,668,t,tTa-0.3,()=>d9_regMini(ctx,1460,668,t,1),{dy:-14});
  arrive(ctx,1460,812,t,tOo-0.2,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.85)";ctx.shadowBlur=18;T(ctx,"once only",1460,846,{w:800,size:52,align:"center",color:rgba(TRUST,1)});ctx.restore();},{dy:12,from:0.9});
  ctx.restore();vign(ctx,S);});
/* ---------- 5. Two rules, not one ---------- */
// Day one's rule, set down on the wall, splits in two: the network's and retail's, each with its owner. The replaced reading crosses
// at the gate, on the agreed list, where the script once reached across unseen.
const D9_C21=[70,200,820],D9_C22=[1030,200,820];
scene("split",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tTw=w("two","two rules"),tSd=w("two","each side"),tN1=w("net","an estimate"),tG=w("net","Grace"),tR1=w("ret","a bill"),tH=w("ret","head of retail"),tX=c("cross"),tL=w("cross","agreed list"),tSc=w("cross","the script"),tU=w("cross","unseen");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  d9_sides(ctx,{a:fin(t,0.1,0.8)});d9_wall(ctx,t,{gate:fin(t,tX-0.3,0.8),gy:520,hi:pulseAt(t,tSd,1.6)});
  // day one's rule cracks down the wall, and its halves part
  const cr=fin(t,tTw-0.35,0.4),pt=ease(fin(t,tTw,1.0)),gone=fin(t,tTw+0.5,0.8);
  if(gone<1)arrive(ctx,960,284,t,0.2,()=>withA(ctx,1-gone,()=>{[[-1,0,960],[1,960,W]].forEach(([d,x0,x1])=>{ctx.save();ctx.beginPath();ctx.rect(x0,0,x1-x0,H);ctx.clip();ctx.translate(d*130*pt,d*6*pt);ruleCard(ctx,560,200,800,D9_R0,{kicker:"data rule · day one",size:34});ctx.restore();});
    if(cr>0.01&&pt<0.6){ctx.save();ctx.globalAlpha*=cr*(1-pt/0.6);ctx.strokeStyle="rgba(240,244,255,0.95)";ctx.lineWidth=3;ctx.shadowColor="rgba(220,230,255,0.9)";ctx.shadowBlur=14;ctx.beginPath();for(let k=0;k<=8;k++){const yy=lerp(196,374,k/8*cr);ctx.lineTo(960+(k%2?-7:7),yy);}ctx.stroke();ctx.restore();}}),{dy:-14});
  // the two rules: the network's, then retail's, each with its owner
  const h21=d9_rule(ctx,0,0,D9_C21[2],"",D9_R21,null,{a:0,size:34}),h22=d9_rule(ctx,0,0,D9_C22[2],"",D9_R22,null,{a:0,size:34});
  arrive(ctx,D9_C21[0]+410,D9_C21[1]+h21/2,t,tTw+0.4,()=>d9_rule(ctx,D9_C21[0],D9_C21[1],D9_C21[2],"RUL-021",D9_R21,D9_NET,{size:34,p:clamp((t-tN1+0.1)/4.4,0,1),hi:pulseAt(t,tG,1.4)}),{dy:-12});
  arrive(ctx,D9_C22[0]+410,D9_C22[1]+h22/2,t,tTw+0.55,()=>d9_rule(ctx,D9_C22[0],D9_C22[1],D9_C22[2],"RUL-022",D9_R22,D9_RET,{size:34,p:clamp((t-tR1+0.1)/3.2,0,1),hi:pulseAt(t,tH,1.4)}),{dy:-12});
  arrive(ctx,480,D9_C21[1]+h21+44,t,tG-0.1,()=>d9_owner(ctx,480,D9_C21[1]+h21+44,"Grace",1,{align:"center",hi:pulseAt(t,tG+0.2,1.4)}),{dy:8});
  arrive(ctx,1440,D9_C22[1]+h22+44,t,tH-0.1,()=>d9_owner(ctx,1440,D9_C22[1]+h22+44,"head of retail",1,{align:"center",hi:pulseAt(t,tH+0.2,1.4)}),{dy:8});
  arrive(ctx,210,900,t,tG-0.7,()=>person(ctx,"grace",210,1030,0.72,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,tG-0.2,tG+2.4)}),{dy:-10});
  // the gate opens and the replaced reading crosses through it; below, the agreed list of what crosses, with the replaced reading on it
  arrive(ctx,960,710,t,tL-0.5,()=>d9_list(ctx,660,590,600,"what crosses, and how",["which connection point","planned outages","replaced readings"],{p:clamp((t-tL+0.4)/1.5,0,1),hi:fin(t,tL+0.7,0.5),rot:0.004}),{dy:12});
  if(t>tX+0.6){const u=((t-tX-0.6)/2.6)%1,e=ease(clamp(u*1.15,0,1)),x=lerp(700,1220,e),a=sstep(0,0.08,u)*(1-sstep(0.86,0.98,u));d9_msg(ctx,x,520+Math.sin(u*TAU)*4,0.9,mix(D9_NET,D9_RET,sstep(0.42,0.58,e)),a);}
  // where the script once reached across, unseen
  const gh=fin(t,tSc-0.3,0.6)*(1-fin(t,tU+1.2,0.8));if(gh>0.01){d9_trace_(ctx,[[720,476],[840,428],[960,416],[1080,428],[1200,476]],clamp((t-tSc+0.3)/1.0,0,1),[210,170,170],{dash:[8,8],a:0.8*gh,nohead:true});
    withA(ctx,gh,()=>{ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle="rgba(210,170,170,0.8)";ctx.lineWidth=2;rr(ctx,898,390,124,52,10);ctx.fillStyle="rgba(10,12,22,0.9)";ctx.fill();ctx.stroke();ctx.restore();T(ctx,"script",960,425,{f:"mono",w:500,size:28,align:"center",color:"rgba(210,170,170,0.9)"});});
    arrive(ctx,960,346,t,tU-0.2,()=>withA(ctx,gh,()=>tag(ctx,960,346,"unseen",[200,200,210],{align:"center",size:28})),{dy:8});}
  ctx.restore();vign(ctx,S);});

/* ---------- 6. Where a rule comes from ---------- */
// Each rule's reason, above it in motivation's purple: the metering rules for the network's, the regulator's retail code for retail's.
// Without its reason, a rule can't be changed safely; without its owner, it can't be fixed. Then Ama corrects day one's draft: its
// goal was an obligation.
const D9_RS=[[170,150,620,92,"the metering rules"],[1130,150,620,92,"the regulator's retail code"]];
scene("why",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tReg=w("reason","a regulation"),tPr=w("reason","a principle"),tSl=w("reason","service level"),tT=c("these"),tMr=w("these","metering rules"),tRc=w("these","retail code"),tNr=w("safe","no reason"),tCs=w("safe","changed safely"),tNo=w("safe","no owner"),tCf=w("safe","be fixed"),tA=c("ama"),tFa=w("ama","Fair, accurate"),tGo=w("ama","goals"),tOb=w("ama","obligation"),tCo=w("ama","regulator's code");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});d9_sides(ctx,{});d9_wall(ctx,t,{});
  // the two rules, moved down to make room for their reasons; then, while Ama speaks, the network's dims and retail's goes
  const mv=ease(fin(t,0.1,1.4)),off=fin(t,tA-0.4,0.9),aL=1-0.75*off,aR=1-off,h21=d9_rule(ctx,0,0,D9_C21[2],"",D9_R21,null,{a:0,size:34}),h22=d9_rule(ctx,0,0,D9_C22[2],"",D9_R22,null,{a:0,size:34}),y21=lerp(D9_C21[1],320,mv),y22=lerp(D9_C22[1],320,mv);
  const noR=fin(t,tNr-0.2,0.5)*(1-fin(t,tCs+1.0,0.6)),noO=fin(t,tNo-0.2,0.5)*(1-fin(t,tCf+1.0,0.6));
  withA(ctx,aL,()=>{d9_rule(ctx,D9_C21[0],y21,D9_C21[2],"RUL-021",D9_R21,D9_NET,{size:34});d9_owner(ctx,480,y21+h21+44,"Grace",1,{align:"center"});});
  withA(ctx,aR,()=>{d9_rule(ctx,D9_C22[0],y22,D9_C22[2],"RUL-022",D9_R22,D9_RET,{size:34});d9_owner(ctx,1440,y22+h22+44,"head of retail",1-noO,{align:"center"});});
  // without its owner, a rule can't be fixed
  if(noO>0.01){d9_slot(ctx,1300,y22+h22+20,280,48,TRUST,noO,"owner?");arrive(ctx,1440,y22+h22+110,t,tCf-0.4,()=>withA(ctx,noO,()=>tag(ctx,1440,y22+h22+110,"can't be fixed",BAD,{align:"center",size:30})),{dy:8});}
  // the kinds of reason, then each rule's own; without its reason, a rule can't be changed safely
  const gen=1-fin(t,tT-0.3,0.6);[["a regulation","driver",420,tReg],["a principle","principle",960,tPr],["a service level","clock",1500,tSl]].forEach(([l,k,x,t0])=>arrive(ctx,x,196,t,t0-0.1,()=>d9_why(ctx,x,196,l,k,gen,{hi:pulseAt(t,t0+0.2,1.2)}),{dy:-10}));
  D9_RS.forEach(([x,y,w_,h_,nm],i)=>{const t0=i?tRc:tMr,a=i?1:(1-noR)*aL;if(i&&off>0.01)return;arrive(ctx,x+w_/2,y+h_/2,t,t0-0.3,()=>{d9_el(ctx,x,y,w_,h_,nm,MOT,"driver",{size:30,a,hi:pulseAt(t,t0,1.4)});d9_infl(ctx,x+w_/2,y+h_,x+w_/2,(i?y22:y21)-4,MOT,clamp((t-t0)/0.7,0,1),a);},{dy:-12});});
  if(noR>0.01){d9_slot(ctx,170,150,620,92,MOT,noR,"reason?");arrive(ctx,480,284,t,tCs-0.6,()=>withA(ctx,noR,()=>tag(ctx,480,284,"can't be changed safely",BAD,{align:"center",size:30})),{dy:8});}
  // the retail code stays: day one's goal was really an obligation in it
  if(off>0.01){const[x,y,w_,h_,nm]=D9_RS[1];d9_el(ctx,x,y,w_,h_,nm,MOT,"driver",{size:30,hi:pulseAt(t,tCo,1.4)});d9_infl(ctx,x+w_/2,y+h_,x+w_/2,y22-4,MOT,1,aR);
    const ob=fin(t,tOb-0.3,0.7),ex=1130,ey=470,ew=620,eh=100;arrive(ctx,ex+ew/2,ey+eh/2,t,tFa-0.3,()=>{glass(ctx,ex,ey,ew,eh,8,MOT,{glow:12+14*pulseAt(t,tOb,1.6),ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(MOT,0.16);rr(ctx,ex,ey,ew,eh,8);ctx.fill();
      const gx=ex+56,gy=ey+eh/2;withA(ctx,1-ob,()=>archGlyph(ctx,"goal",gx,gy,26,MOT));withA(ctx,ob,()=>d9_reqGlyph(ctx,gx,gy,30,MOT));T(ctx,"fair, accurate bills",ex+108,ey+eh/2+12,{w:800,size:34,color:rgba(INK,0.97)});},{dy:-12});
    arrive(ctx,ex+ew/2,ey-34,t,tFa-0.1,()=>tag(ctx,ex+ew/2,ey-34,"day one's draft",PARCH,{align:"center",size:28}),{dy:8});
    const gl=fin(t,tGo-0.6,0.5)*(1-fin(t,tOb-0.55,0.3));if(gl>0.01){withA(ctx,gl,()=>{tag(ctx,ex+ew/2,ey+eh+44,"a goal",MOT,{align:"center",size:30});});const st=clamp((t-tGo+0.1)/0.4,0,1);if(st>0)withA(ctx,gl,()=>{ctx.save();ctx.strokeStyle=rgba(BAD,0.95);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(ex+ew/2-70,ey+eh+44);ctx.lineTo(ex+ew/2-70+140*st,ey+eh+44);ctx.stroke();ctx.restore();});}
    if(ob>0.01)arrive(ctx,ex+ew/2,ey+eh+44,t,tOb-0.15,()=>tag(ctx,ex+ew/2,ey+eh+44,"an obligation",MOT,{align:"center",size:30}),{dy:8});
    d9_infl(ctx,x+w_/2,y+h_,ex+ew/2,ey-62,MOT,clamp((t-tCo+0.2)/0.7,0,1),off);}
  arrive(ctx,1770,900,t,tA-0.6,()=>d9_personR(ctx,"ama",1770,1030,0.74,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,tA,tA+3.0)+d9_pz(t,tOb-0.2,tOb+2.2)}),{dy:-10});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. What a rule is about ---------- */
// A rule builds on facts, and facts on concepts: retail's rule, the facts it rests on, and the concepts beneath them, in the business's
// words. Each concept becomes a data object on the side that owns it; the industry's model gives starting words, kept beside the
// utility's own.
const D9_FACTS=[[90,"a reading is taken at a connection point",[0,1]],[690,"a reading is actual or estimated",[1,2]],[1290,"a bill is based on readings",[1,3]]];
const D9_TERMS=[["connection point",290],["reading",650],["estimate",1010],["bill",1520]];
scene("about",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tF=w("words","on facts"),tC=w("words","on concepts"),tBw=w("terms","business's words"),tT=[w("terms","a connection point"),w("terms","a reading"),w("terms","an estimate"),w("terms","a bill")],tO=c("objects"),tDo=w("objects","data object"),tNs=w("objects","network's side"),tRs=w("objects","bills on"),tCi=c("cim"),tUp=w("cim","usage point"),tOw=w("own","own words");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const sd=fin(t,tO-0.3,1.0),mvO=ease(fin(t,tDo-0.6,1.4)),pyr=1-fin(t,tO-0.5,0.8);
  d9_sides(ctx,{a:sd});d9_wall(ctx,t,{a:sd});
  // the rule, the facts it builds on, and the concepts beneath them
  if(pyr>0.01)withA(ctx,pyr,()=>{const hR=d9_rule(ctx,510,96,900,"RUL-022",D9_R22,D9_RET,{a:fin(t,0.3,0.6),hi:pulseAt(t,tBw,1.6)});
    D9_FACTS.forEach(([x,s_,to],i)=>{const t0=tF+i*0.2,q=fin(t,t0-0.1,0.5);if(q<=0.01)return;d9_trace_(ctx,[[960,96+hR],[x+270,360]],clamp((t-t0)/0.6,0,1),[150,160,190],{lw:2,nohead:true,a:0.7});
      arrive(ctx,x+270,420,t,t0,()=>d9_fact(ctx,x,360,540,s_,{}),{dy:-10});});
    D9_FACTS.forEach(([x,,to],i)=>to.forEach(j=>{const p=clamp((t-tC-0.2-j*0.1)/0.6,0,1);if(p>0)d9_trace_(ctx,[[x+270,360+104],[D9_TERMS[j][1],640-30]],p,[150,160,190],{lw:2,nohead:true,a:0.6});}));});
  // each concept: a term, then a data object on the side that owns it; the estimate becomes part of the reading
  const OBJ={reading:[150,250,640,130],"connection point":[150,480,640,100],bill:[1130,250,640,100]};
  D9_TERMS.forEach(([nm,x],j)=>{const t0=tC+j*0.15,hi=pulseAt(t,tT[j]+0.1,1.2);if(t<t0-0.2)return;const o=OBJ[nm];
    if(o){const k=nm==="reading"?0:nm==="connection point"?1:2,mo=ease(fin(t,tDo-0.6+k*0.25,1.2)),cx=lerp(x,o[0]+o[2]/2,mo),cy=lerp(640,o[1]+o[3]/2,mo);
      if(mo<0.5)arrive(ctx,x,640,t,t0,()=>withA(ctx,1-mo*2,()=>d9_term(ctx,cx,cy,nm,{hi})),{dy:-10});
      if(mo>0.3){const sv=nm==="reading"?fin(t,tDo+1.4,0.6):0;withA(ctx,clamp((mo-0.3)/0.5,0,1),()=>d9_obj(ctx,lerp(cx-o[2]/2,o[0],mo),lerp(cy-o[3]/2,o[1],mo),o[2],o[3],nm==="reading"?"meter reading":nm,nm==="reading"?"actual or estimated":null,{sv,hi:pulseAt(t,nm==="bill"?tRs:tNs,1.4)+0.6*pulseAt(t,tOw+(k===1?0:0.4),1.4)}));}}
    else{const me=ease(fin(t,tDo+0.6,1.0)),tx=OBJ.reading[0]+180,ty=OBJ.reading[1]+92;arrive(ctx,x,640,t,t0,()=>withA(ctx,1-sstep(0.7,1,me),()=>{ctx.save();ctx.translate(lerp(x,tx,me),lerp(640,ty,me));ctx.scale(lerp(1,0.6,me),lerp(1,0.6,me));d9_term(ctx,0,0,nm,{hi,deco:me>0.02?1:0});ctx.restore();}),{dy:-10});}});
  // the industry's model gives the starting words; the map keeps the utility's own beside them
  arrive(ctx,470,420,t,tCi+0.6,()=>d9_ind(ctx,470,420,"reading quality",1,{hi:pulseAt(t,tOw+0.4,1.4)}),{dy:-8});
  arrive(ctx,470,624,t,tUp-0.2,()=>d9_ind(ctx,470,624,"usage point",1,{hi:pulseAt(t,tUp,1.4)+pulseAt(t,tOw,1.4)}),{dy:-8});
  ctx.restore();vign(ctx,S);});
/* ---------- 8. What the process expects ---------- */
// Meter to cash, as the series draws a value stream: read on the network's side, bill and paid on retail's, crossing at the gate.
// Each rule is attached to its step by a realisation, not written inside it. Then the read step: what it expects of the data, each
// from where it comes: timeliness from its service level, completeness from its steps, validity from another rule.
const D9_VS=[["read",80,830],["bill",1010,490],["paid",1470,390]],D9_VY=290,D9_VH=150,D9_RY=510,D9_EX=[80,600,830,110,126];
scene("expect",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tMc=w("step","meter to cash"),tNw=w("step","network's"),tRt=w("step","retail's"),tAt=w("inside","Attached,"),tNi=w("inside","not inside"),tIp=w("inside","isn't the process"),
    tTi=c("time"),tEx=w("time","what to expect"),tTl=w("time","Timeliness"),tSl=w("time","service level"),tEr=w("time","an estimate replaced"),
    tCo=c("comp"),tSt=w("comp","its steps"),tEv=w("comp","every estimate"),tVa=w("comp","Validity"),tAr=w("comp","another rule"),tMk=w("comp","every reading");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});focus(ctx,t,[[0,960,540,1],[tTi-0.9,560,670,1.04]],1.8);
  // the read step becomes the subject: retail's side steps back, and both rules fold to their ids to make room
  const fo=ease(fin(t,tTi-0.6,1.2)),dimR=1-0.6*fo,op=ease(fin(t,tTi+0.2,1.2)),RY=D9_RY,PY=RY+29,mid=D9_VY+D9_VH/2;
  d9_sides(ctx,{});d9_wall(ctx,t,{gate:1,gy:mid,a:1-0.4*fo});
  withA(ctx,fin(t,tMc-0.3,0.5),()=>T(ctx,"meter to cash",84,D9_VY-24,{f:"mono",w:600,size:30,color:rgba(STR,1)}));
  D9_VS.forEach(([nm,x,w_],i)=>{const r=i===0,lx=r?lerp(x+w_/2-12,196,op):null,ly=r?lerp(mid+12,D9_VY+62,op):null;
    arrive(ctx,x+w_/2,mid,t,tMc-0.2+i*0.18,()=>d9_chev(ctx,x,D9_VY,w_,D9_VH,nm,{first:r,a:r?1:dimR+0.1*fo,deco:!r&&fo>0.3?1:0,lx,ly,hi:pulseAt(t,r?tNw+0.2:tRt+0.2,1.4)*(r||i===1?1:0)}),{dy:-14});});
  // each rule, attached to its step by a realisation: it rises to meet the line
  const h21=d9_rule(ctx,0,0,830,"",D9_R21,null,{a:0,size:30}),h22=d9_rule(ctx,0,0,850,"",D9_R22,null,{a:0,size:30}),rx=lerp(495,300,fo),u21=26*(1-ease(fin(t,tNw+0.2,0.6))),u22=26*(1-ease(fin(t,tRt+0.2,0.6)));
  withA(ctx,1-fo,()=>arrive(ctx,495,RY+h21/2,t,0.4,()=>d9_rule(ctx,80,RY+u21,830,"RUL-021",D9_R21,D9_NET,{size:30,hi:pulseAt(t,tNw+0.5,1.4)}),{dy:-12}));
  withA(ctx,(1-fo)*dimR,()=>arrive(ctx,1435,RY+h22/2,t,0.6,()=>d9_rule(ctx,1010,RY+u22,850,"RUL-022",D9_R22,D9_RET,{size:30,hi:pulseAt(t,tRt+0.5,1.4)}),{dy:-12}));
  d9_rulePill(ctx,300,PY,"RUL-021",D9_NET,{a:fo});d9_rulePill(ctx,1255,PY,"RUL-022",D9_RET,{a:fo*dimR,deco:fo>0.3?1:0});
  d9_real(ctx,rx,D9_VY+D9_VH+2,rx,RY+u21,MOT,clamp((t-tNw+0.1)/0.7,0,1),1);d9_real(ctx,1255,D9_VY+D9_VH+2,1255,RY+u22,MOT,clamp((t-tRt+0.1)/0.7,0,1),dimR);
  // written inside the step, a rule would be the process: it doesn't go there
  const gq=clamp((t-tAt+0.2)/1.1,0,1),gOut=fin(t,tIp+0.5,0.6);
  if(gq>0&&gOut<1){const e=ease(gq),cx=lerp(495,700,e),cy=lerp(RY+h21/2,mid,e),k=lerp(1,0.4,e);ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);ctx.translate(-495,-(RY+h21/2));
    withA(ctx,0.8*(1-gOut),()=>d9_rule(ctx,80,RY,830,"RUL-021",D9_R21,D9_NET,{size:30,deco:1}));ctx.restore();cross_(ctx,700,mid,74,BAD,fin(t,tNi+0.2,0.3)*(1-gOut));}
  arrive(ctx,520,RY-36,t,tNi-0.1,()=>withA(ctx,1-fin(t,tTi-0.6,0.5),()=>tag(ctx,520,RY-36,"attached, not inside",MOT,{size:28})),{dy:8});
  // what the step expects of the data: a bracket from the step to each expectation
  const br=clamp((t-tEx+0.2)/1.2,0,1),[ex,ey,ew,eh,eg]=D9_EX;
  if(br>0){ctx.save();ctx.strokeStyle=rgba(STR,0.85);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(100,D9_VY+D9_VH+2);ctx.lineTo(56,D9_VY+D9_VH+40);ctx.lineTo(56,lerp(D9_VY+D9_VH+40,ey+2*eg+eh/2,ease(br)));ctx.stroke();ctx.restore();}
  // where each comes from: the step's service level, its own steps, and another rule attached to it
  arrive(ctx,700,D9_VY+48,t,tSl-0.3,()=>d9_why(ctx,700,D9_VY+48,"2 working days","clock",1,{hi:pulseAt(t,tSl,1.4)+pulseAt(t,tEr+0.4,1.2)}),{dy:-8});
  d9_steps(ctx,130,D9_VY+112,clamp((t-tSt+0.4)/1.0,0,1),{hi:pulseAt(t,tEv+0.4,1.2)});
  if(t>tAr-0.4){d9_real(ctx,728,D9_VY+D9_VH+2,728,RY,MOT,clamp((t-tAr)/0.7,0,1),1);arrive(ctx,728,PY,t,tAr-0.2,()=>d9_rulePill(ctx,728,PY,"RUL-020",D9_NET,{hi:pulseAt(t,tMk+0.4,1.2)}),{dy:-8});}
  [["timeliness","from its service level","an estimate replaced within 2 working days","clock",tTl,tEr],["completeness","from its steps","every estimate replaced, or explained","process",tCo,tEv],
   ["validity","from another rule","every reading marked actual or estimated","requirement",tVa,tMk]].forEach(([d,s_,txt,g,t0,t1],i)=>{const y=ey+i*eg;
    if(br>0)withA(ctx,fin(t,t0-0.3,0.4),()=>{ctx.save();ctx.strokeStyle=rgba(STR,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(56,y+eh/2);ctx.lineTo(ex,y+eh/2);ctx.stroke();ctx.restore();});
    arrive(ctx,ex+ew/2,y+eh/2,t,t0-0.2,()=>d9_expect(ctx,ex,y,ew,eh,d,s_,txt,g,{p:clamp((t-t1)/1.3,0,1),hi:pulseAt(t,t1+0.4,1.4)}),{dy:-12});
    // the step hands it down: a light runs from the step along the bracket into it
    const fl=clamp((t-t1+0.5)/1.0,0,1);if(fl>0&&fl<1){const P=[[100,D9_VY+D9_VH+2],[56,D9_VY+D9_VH+40],[56,y+eh/2],[ex+20,y+eh/2]],L=[0];for(let k=1;k<P.length;k++)L.push(L[k-1]+Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]));
      const d_=L[3]*ease(fl);let k=1;while(k<3&&L[k]<d_)k++;const u=(d_-L[k-1])/Math.max(1,L[k]-L[k-1]),x=lerp(P[k-1][0],P[k][0],u),yy=lerp(P[k-1][1],P[k][1],u);glow(ctx,x,yy,34,STR,0.8*Math.sin(Math.PI*fl));}});
  ctx.restore();vign(ctx,S);});
/* ---------- 9. Test the data, track the business ---------- */
// Retail's rule in its set form, each part as it's named. Then the two kinds of rule, each with what's generated from it, one way.
// The data rule, RUL-020, gets its tests, as each tool writes them, and a hand that would edit one is stopped. Retail's rule is about
// what the business does: every test passes while a bill goes uncorrected, so a tracking table is generated from it instead. Then what
// it tracks: not whether the nightly job ran (it always did), but whether each bill was corrected; the morning after billing moved,
// the first one listed, and the list sent each morning to the owner's team, not to a shared mailbox.
const D9_FROWS=[["applies to","bills based on a replaced estimate",INF],["must be true","corrected on the next bill",INK],["owner","head of retail",TRUST,"owner"],
  ["reason","the regulator's retail code",MOT],["home","bill, in meter to cash",STR],["when it fails","listed for the billing team",D9_RED]];
const D9_GY=[116,358,600],D9_COL=[540,760,980,1200,1420,1640],D9_MV=1090,D9_L1=450,D9_L2=610,D9_TY=792;
// the two kinds of rule, on the left, each with what's generated from it to its right: the data rule above, level with the first test
// and the pills the tests fold into; retail's below, level with its tracking table
const D9_Y20=165,D9_Y22=490,D9_PY=227,D9_TK=[1010,437,850,266],D9_TP=["dbt test","data contract","SHACL shape"];
// an arrow from a rule to what's generated from it: right, down a spine at x 966 if it must, and right again into it, drawn up to p
function d9_feed(ctx,y0,y1,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{const P=y0===y1?[[934,y0],[1002,y1]]:[[934,y0],[966,y0],[966,y1],[1002,y1]],L=[0];
  for(let k=1;k<P.length;k++)L.push(L[k-1]+Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]));const d=L[L.length-1]*ease(clamp(p,0,1));
  ctx.save();ctx.strokeStyle=rgba(MOT,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);
  for(let k=1;k<P.length;k++){if(L[k]<=d)ctx.lineTo(P[k][0],P[k][1]);else{const u=(d-L[k-1])/Math.max(1,L[k]-L[k-1]);ctx.lineTo(lerp(P[k-1][0],P[k][0],u),lerp(P[k-1][1],P[k][1],u));break;}}ctx.stroke();
  if(p>=1){ctx.beginPath();ctx.moveTo(990,y1-9);ctx.lineTo(1003,y1);ctx.lineTo(990,y1+9);ctx.stroke();}ctx.restore();});}
scene("checks",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tR=[w("form","applies to"),w("form","must be true"),w("form","its owner"),w("form","its reason"),w("form","its home"),w("form","when it fails")],
    tD=c("data"),tDa=w("data","about the data"),tEr=w("data","every reading"),tRt=w("data","data is right"),tG=c("gen"),tOw=w("gen","one way"),tGn=[w("gen","a dbt test"),w("gen","quality rule"),w("gen","a shape")],
    tH=c("hand"),tBh=w("hand","by hand"),tBr=w("biz","Retail's rule"),tBd=w("biz","what the business"),tAr=w("biz","all be right"),tUn=w("biz","uncorrected"),
    tTt=w("track","tracking table"),tLi=w("track","listing"),tP=c("promise"),tPr=w("promise","what the rule"),tJr=w("promise","not whether"),
    tF=c("first"),tMa=w("first","morning after"),tT=c("team"),tTl=w("team","the list goes"),tOt=w("team","owner's team"),tMb=w("team","mailbox");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  // the set form, centred; then it folds into retail's rule, below on the left, as the data rule arrives above it (it dims to half
  // before it shrinks, so none of its words is read smaller than it's drawn)
  const sh=ease(fin(t,tD-0.9,1.4)),fA=(1-fin(t,tD-0.6,0.9))*(1-0.52*fin(t,tD-1.25,0.3)),fB=ease(fin(t,tP-1.1,1.0)),bA=1-fB,tA=1-fin(t,tP-1.2,0.5);
  let hr=-1;tR.forEach((t0,i)=>{if(t>t0-0.15&&t<t0+1.3)hr=i;});
  if(fA>0.01){ctx.save();const k=lerp(1,0.3,sh);ctx.translate(lerp(960,500,sh),lerp(472,570,sh));ctx.scale(k,k);ctx.translate(-960,-472);
    withA(ctx,fA,()=>arrive(ctx,960,472,t,0.3,()=>d9_ruleForm(ctx,530,120,860,"RUL-022",D9_FROWS,{r:tR.map(t0=>fin(t,t0-0.15,0.5)),hiRow:hr}),{dy:-16}));ctx.restore();}
  // retail's rule: waiting, dimmed, while the data rule is tested; lit as it's named; then up to the top, for what it tracks
  const h22=d9_rule(ctx,0,0,860,"",D9_R22,null,{a:0,size:30}),y22=lerp(D9_Y22,110,fB),r22=fin(t,tD-0.5,0.8)*lerp(0.45,1,fin(t,tBr-0.2,0.5));
  d9_rule(ctx,70,y22,860,"RUL-022",D9_R22,D9_RET,{size:30,a:r22,hi:pulseAt(t,tBr,1.4)+pulseAt(t,tPr+0.2,1.4)});
  withA(ctx,bA*fin(t,tBd-0.2,0.5),()=>tag(ctx,70,y22-34,"a rule about what the business does",D9_RET,{size:28}));
  // the data rule, and its tests, generated from it, one way, as each tool writes them
  withA(ctx,tA,()=>{arrive(ctx,500,D9_Y20+62,t,tDa-0.3,()=>d9_rule(ctx,70,D9_Y20,860,"RUL-020",D9_R20,D9_NET,{size:30,hi:pulseAt(t,tDa,1.4)+pulseAt(t,tAr,1.4)}),{dy:-12});
    withA(ctx,fin(t,tDa-0.1,0.5),()=>tag(ctx,70,D9_Y20-34,"a rule about the data",D9_NET,{size:28}));
    withA(ctx,fin(t,tOw-0.3,0.5)*(1-fin(t,tAr-0.3,0.6)),()=>tag(ctx,970,80,"generated, one way",MOT,{align:"center",size:28}));});
  // the pills the tests fold into, side by side from the arrow
  // the readings it's about, each marked actual or estimate; a test passes every mark
  const rA=1-fin(t,tG-0.5,0.5);if(rA>0.01)withA(ctx,rA*tA,()=>arrive(ctx,1435,333,t,tEr-0.3,()=>d9_readings(ctx,1010,150,850,{hi:D9_ROWS.map((_,i)=>fin(t,tEr+0.3+i*0.15,0.4)),ok:clamp((t-tRt+0.1)/0.9,0,1)}),{dy:-14}));
  const cl=ease(fin(t,tAr-0.3,0.9)),pw=D9_TP.map(l=>tw(ctx,l,30,700)+86),pX=pw.map((w_,i)=>1012+pw.slice(0,i).reduce((a,b)=>a+b,0)+28*i+w_/2);
  D9_GEN.forEach(([ti,ls],i)=>{const y=D9_GY[i],t0=tGn[i],my=y+111,pl=D9_TP[i],px=pX[i];
    d9_feed(ctx,D9_PY,my,clamp((t-t0+0.2)/0.6,0,1),1-cl);
    if(cl<0.99){ctx.save();const k=lerp(1,0.25,cl);ctx.translate(lerp(1435,px,cl),lerp(my,D9_PY,cl));ctx.scale(k,k);ctx.translate(-1435,-my);
      withA(ctx,1-cl,()=>arrive(ctx,1435,my,t,t0-0.1,()=>d9_gen(ctx,1010,y,850,222,ti,ls,{p:clamp((t-t0-0.1)/1.4,0,1),hi:pulseAt(t,t0+0.3,1.4),lock:i===0?pulseAt(t,tBh,1.6):0}),{dy:-14}));ctx.restore();}
    // every test passes: the data is right
    withA(ctx,tA*cl,()=>d9_pill(ctx,px,D9_PY,pl,TECH,"ok",{hi:pulseAt(t,tAr+0.3+i*0.15,1.2)}));});
  d9_feed(ctx,D9_PY,D9_PY,1,tA*cl);
  // nobody edits a check by hand: a pencil comes for the code, and stops at it
  const pin=ease(fin(t,tH-0.5,1.2)),pout=ease(fin(t,tBh+0.6,0.9));if(pin>0&&pout<1){const px=lerp(1900,1520,pin)+380*pout,py=lerp(1040,250,pin)+790*pout;
    d9_pencil(ctx,px,py,1.1,1);cross_(ctx,1520,250,64,D9_RED,fin(t,tBh-0.1,0.3)*(1-pout));}
  // ... while a bill goes uncorrected
  arrive(ctx,260,716,t,tUn-0.3,()=>withA(ctx,tA,()=>{const iw=d9_inst(ctx,0,0,"June bill · $412.80",{a:0}),x0=70;d9_inst(ctx,x0+iw/2,716,"June bill · $412.80",{hi:pulseAt(t,tUn,1.4)});
    d9_res(ctx,x0+iw+40,716,26,false,D9_RED,fin(t,tUn,0.4));withA(ctx,fin(t,tUn+0.1,0.4),()=>T(ctx,"not corrected",x0+iw+80,727,{w:700,size:30,color:rgba(D9_RED,1)}));}),{dy:8});
  // so from retail's rule, a tracking table is generated: the bills it applies to that the next bill didn't correct, with the rule
  // and its owner's team; it folds into a pill as the rule goes up
  const[kx,ky,kw,kh]=D9_TK,tpw=tw(ctx,"tracking table",30,700)+86,tcx=1012+tpw/2;
  d9_feed(ctx,y22+h22/2,y22+h22/2,clamp((t-tTt+0.4)/0.6,0,1),1);
  if(fB<0.99){ctx.save();const k=lerp(1,0.25,fB);ctx.translate(lerp(kx+kw/2,tcx,fB),lerp(ky+kh/2,190,fB));ctx.scale(k,k);ctx.translate(-(kx+kw/2),-(ky+kh/2));
    withA(ctx,1-fB,()=>arrive(ctx,kx+kw/2,ky+kh/2,t,tTt-0.1,()=>d9_gen(ctx,kx,ky,kw,kh,"tracking table",D9_TRK,{p:clamp((t-tTt-0.1)/1.8,0,1),hi:pulseAt(t,tTt+0.3,1.4),hiLine:4,hl:fin(t,tLi,0.5)}),{dy:-14}));ctx.restore();}
  withA(ctx,fin(t,tP-0.5,0.4),()=>d9_pill(ctx,tcx,190,"tracking table",TECH,"table",{hi:pulseAt(t,tPr+0.4,1.2)}));
  // did the job run? every night, yes: that isn't what the rule promised
  const l1=fin(t,tP-0.2,0.5)*(1-0.55*fin(t,tJr+0.1,0.6)),l2=fin(t,tPr-0.3,0.5),st=clamp((t-tJr-0.1)/0.5,0,1);
  withA(ctx,l1,()=>{d9_moon(ctx,92,D9_L1,16,TECH,1);T(ctx,"did the job run?",124,D9_L1+11,{w:700,size:30,color:rgba(TECH,1)});});
  if(st>0){const w_=tw(ctx,"did the job run?",30,700);ctx.save();ctx.strokeStyle=rgba(D9_RED,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(118,D9_L1);ctx.lineTo(118+(w_+12)*st,D9_L1);ctx.stroke();ctx.restore();}
  D9_COL.forEach((x,i)=>arrive(ctx,x,D9_L1,t,tP+0.1+i*0.12,()=>d9_res(ctx,x,D9_L1,26,true,[150,170,200],l1),{dy:-8}));
  // is each bill corrected? yes, until billing moves; the morning after, the first one isn't, and it's listed
  withA(ctx,l2,()=>{d9_sun(ctx,92,D9_L2,20,STR);T(ctx,"is each bill corrected?",124,D9_L2+11,{w:700,size:30,color:rgba(INK,0.97)});});
  D9_COL.slice(0,3).forEach((x,i)=>arrive(ctx,x,D9_L2,t,tPr+0.2+i*0.15,()=>d9_res(ctx,x,D9_L2,26,true,D9_OK,1),{dy:-8}));
  const mv=fin(t,tF+0.2,0.6);if(mv>0)withA(ctx,mv,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(D9_RET,0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(D9_MV,372);ctx.lineTo(D9_MV,700);ctx.stroke();ctx.restore();
    tag(ctx,D9_MV,346,"billing moves · March 2026",D9_RET,{align:"center",size:28});});
  const fx_=D9_COL[3];glow(ctx,fx_,D9_L2,90,D9_RED,0.55*pulseAt(t,tMa+0.2,1.6)+0.5*pulseAt(t,tTl+0.2,1.4));
  arrive(ctx,fx_,D9_L2,t,tMa-0.2,()=>d9_res(ctx,fx_,D9_L2,30,false,D9_RED,1),{dy:-10});
  arrive(ctx,fx_,530,t,tMa,()=>tag(ctx,fx_,530,"the morning after",D9_RED,{align:"center",size:28}),{dy:8});
  arrive(ctx,fx_,688,t,tMa+0.5,()=>tag(ctx,fx_,688,"1 bill not corrected",D9_RED,{align:"center",size:28}),{dy:8});
  // each morning, the list goes to the owner's team, not to a shared mailbox
  arrive(ctx,1440,D9_TY,t,tT-0.2,()=>{d9_pill(ctx,1440,D9_TY,"billing team",TRUST,"team",{hi:pulseAt(t,tOt,1.4)});withA(ctx,fin(t,tT,0.5),()=>tag(ctx,1440,D9_TY+58,"each morning",TRUST,{align:"center",size:28}));},{dy:-10});
  arrive(ctx,620,D9_TY,t,tMb-0.5,()=>{const st=fin(t,tMb+0.2,0.4),pw=d9_pill(ctx,620,D9_TY,"a shared mailbox",[150,160,180],"mail",{a:1-0.35*st});
    if(st>0){const x0=620-pw/2+60,x1=620+pw/2-18;ctx.save();ctx.strokeStyle=rgba(D9_RED,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,D9_TY+2);ctx.lineTo(lerp(x0,x1,ease(st)),D9_TY+2);ctx.stroke();ctx.restore();}},{dy:-10});
  const al=clamp((t-tTl-0.1)/1.0,0,1);if(al>0&&al<1){const e=ease(al),x=lerp(fx_,1440,e),y=lerp(D9_L2+34,D9_TY-34,e)-Math.sin(e*Math.PI)*70;d9_msg(ctx,x,y,0.8,D9_RED,1);}
  ctx.restore();vign(ctx,S);});
/* ---------- 10. Generally, an ontology ---------- */
// The concepts the rules are about, how they relate, and the rules attached: generally, an ontology, ready for OWL. Then the map as the
// one source, with the glossary, the models, the ontology (the graph, shrunk into place) and the checks as its views, as in Meaning
// machines can read. Then one bill, as facts: OWL, reasoning only from what is said, finds its correction unknown; the tracking table
// finds none.
const D9_VW=[["glossary","terms and their definitions","book"],["models","data objects and their keys","object"],["ontology","concepts, relations and rules, in OWL","graph"],["checks","tests and tracking tables","tick"]];
const D9_VR=[860,166,980,138,22],D9_IN=[["June bill · $412.80",330,360],["June estimate",900,360],["actual readings",1470,360]];
scene("onto",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tCo=w("onto","the concepts"),tRel=w("onto","how they relate"),tRu=w("onto","the rules about"),tOn=w("onto","an ontology"),tOwl=w("owl","ready for OWL"),
    tV=c("views"),tGl=w("views","the glossary"),tMo=w("views","the models"),tOt=w("views","the ontology"),tCh=w("views","the checks"),tOm=w("views","one map"),
    tO=c("open"),tSaid=w("open","what is said"),tNev=w("open","never happened"),tUnk=w("open","simply unknown"),tFind=w("job","Finding"),tJob=w("job","tracking table's job");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const[vx,vy0,vw,vh,vg]=D9_VR,shr=ease(fin(t,tV-0.4,1.6)),gone=fin(t,tO-0.9,0.7),k=lerp(1,0.17,shr),gx=lerp(975,vx+vw-180,shr),gy=lerp(455,vy0+2*(vh+vg)+vh/2,shr),dc=shr>0.001?1:0;
  // the map, the one source; each view drawn from it as it's named
  const vA=fin(t,tV-0.1,0.6)*(1-gone);
  if(vA>0.01)withA(ctx,vA,()=>{layerStack(ctx,110,250,520,{sh:56,gap:16,size:28,p:clamp((t-tV)/1.4,0,1),hi:[0,0,0,0,0,0].map((_,i)=>0.5*pulseAt(t,tOm+i*0.08,1.4))});
    tag(ctx,370,196,"one map",EAC,{align:"center",size:30});withA(ctx,fin(t,tOm-0.2,0.5),()=>tag(ctx,1350,100,"one map, many views",EAC,{align:"center",size:28}));});
  D9_VW.forEach(([ti,sub,g],i)=>{const y=vy0+i*(vh+vg),t0=[tGl,tMo,tOt,tCh][i],q=fin(t,t0-0.3,0.5)*(1-gone);if(q<=0.01)return;const fp=clamp((t-t0+0.3)/0.6,0,1);
    withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(EAC,0.8);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(716,466);ctx.lineTo(lerp(716,vx-6,ease(fp)),lerp(466,y+vh/2,ease(fp)));ctx.stroke();ctx.restore();});
    arrive(ctx,vx+vw/2,y+vh/2,t,t0-0.2,()=>d9_view(ctx,vx,y,vw,vh,ti,sub,g,{a:1-gone,hi:pulseAt(t,t0+0.2,1.4)+0.6*pulseAt(t,tOm+0.3,1.4)}),{dy:-10});});
  // the graph: the concepts, then how they relate, then the rules about them; then it shrinks into the ontology's view of the map
  if(gone<0.99){ctx.save();ctx.translate(gx,gy);ctx.scale(k,k);ctx.translate(-975,-455);withA(ctx,1-gone,()=>{
    const P={};D9_ON.forEach(([id,l,x,y])=>P[id]=[x,y,d9_termW(ctx,l)]);
    D9_OE.forEach(([f,to,l,sd],i)=>d9_rel(ctx,P[f],P[to],l,sd,clamp((t-tRel-0.1-i*0.22)/0.7,0,1),{deco:dc}));
    D9_ON.forEach(([id,l,x,y],i)=>arrive(ctx,x,y,t,tCo-0.2+i*0.14,()=>d9_term(ctx,x,y,l,{deco:dc,hi:pulseAt(t,tCo+0.2+i*0.14,1.2)}),{dy:-10}));
    D9_OR.forEach(([id,cid,x,y],i)=>{const t0=tRu+i*0.25,q=fin(t,t0-0.2,0.5);if(q<=0)return;const[cx,cy]=P[cid],side=x>cx+200;
      withA(ctx,q,()=>{ctx.save();ctx.setLineDash([6,7]);ctx.strokeStyle=rgba(MOT,0.75);ctx.lineWidth=2.2;ctx.beginPath();if(side){ctx.moveTo(x-212,y);ctx.lineTo(cx+6,y);}else{ctx.moveTo(x,y<cy?y+29:y-29);ctx.lineTo(cx,y<cy?cy-32:cy+32);}ctx.stroke();ctx.restore();});
      arrive(ctx,x,y,t,t0,()=>d9_rulePill(ctx,x,y,id,id==="RUL-022"?D9_RET:D9_NET,{deco:dc,hi:pulseAt(t,t0+0.2,1.2)}),{dy:-8});});
    const ttl=1-fin(t,tV-1.0,0.5);withA(ctx,fin(t,tOn-0.2,0.5)*ttl,()=>T(ctx,"an ontology",90,150,{w:800,size:44,color:rgba(INK,0.97),deco:dc}));
    arrive(ctx,470,138,t,tOwl-0.2,()=>withA(ctx,ttl,()=>tag(ctx,470,138,"ready for OWL",[176,196,222],{size:28})),{dy:8});});ctx.restore();}
  // one bill, as facts: what was said about it, and the correction nobody said
  const iA=fin(t,tO-0.4,0.6);if(iA>0.01){const W=D9_IN.map(([l])=>tw(ctx,l,30,800)+56),[b,e,ac]=D9_IN;
    d9_rel(ctx,[b[1],b[2],W[0]],[e[1],e[2],W[1]],"based on","above",clamp((t-tO)/0.7,0,1),{a:iA});
    d9_rel(ctx,[e[1],e[2],W[1]],[ac[1],ac[2],W[2]],"replaced by","above",clamp((t-tO-0.4)/0.7,0,1),{a:iA});
    d9_rel(ctx,[b[1],b[2],W[0]],[b[1],604,140],"corrected on","right",clamp((t-tNev+0.6)/0.7,0,1),{a:iA,dash:true,col:[150,160,180]});
    D9_IN.forEach(([l,x,y],i)=>arrive(ctx,x,y,t,tO-0.3+i*0.15,()=>d9_inst(ctx,x,y,l,{hi:pulseAt(t,tSaid+0.1+i*0.12,1.3)+(i===0?pulseAt(t,tJob,1.4):0)}),{dy:-10}));
    arrive(ctx,b[1],604,t,tNev-0.3,()=>d9_slot(ctx,b[1]-70,574,140,60,[150,160,180],1,null),{dy:-8});
    arrive(ctx,b[1]+260,604,t,tNev+0.1,()=>tag(ctx,b[1]+110,604,"never said",[150,160,180],{size:28}),{dy:8});
    arrive(ctx,495,770,t,tUnk-0.6,()=>d9_verdict(ctx,90,700,810,140,"OWL","was it corrected?","unknown",[176,186,206],"?",{v:fin(t,tUnk-0.1,0.5),hi:pulseAt(t,tUnk,1.4)}),{dy:-12});
    arrive(ctx,1425,770,t,tFind-0.3,()=>d9_verdict(ctx,1020,700,810,140,"the tracking table","was it corrected?","no",D9_RED,"x",{v:fin(t,tJob-0.5,0.5),hi:pulseAt(t,tJob,1.4)}),{dy:-12});}
  ctx.restore();vign(ctx,S);});
/* ---------- 11. Back in Tartu ---------- */
// The wall again, toured left to right: the household's bill corrected and the 1,900 found; the two rules, confirmed by their owners;
// Tartu, where the benefit is paid and nobody was asked twice; Tomás's note answered; then the whole wall, and the next question.
const D9_E21=[590,110,560],D9_E22=[590,400,560],D9_ETC=[590,676,560,186];
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  const tBk=w("refund","forty back"),t19=w("refund","nineteen hundred"),tFc=w("refund","found and corrected"),tC=c("confirm"),tG=w("confirm","Grace"),tHr=w("confirm","head of retail"),
    tT=c("tartu"),tPd=w("tartu","is paid"),tTw=w("tartu","asked twice"),tA=c("answer"),tAn=w("answer","an answer"),tGf=w("owner","generated from it"),tN=c("next"),tNx=w("next","Next:");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});focus(ctx,t,[[0,330,330,1.3],[tC-0.9,840,385,1.25],[tT-0.9,870,560,1.1],[tA-0.9,1420,450,1.15],[tN-0.4,960,520,1.0]],1.6);
  // what the camera leaves behind dims as it goes, and comes back for the whole wall (the bill and the count once they are back in frame)
  const back=fin(t,tN-0.4,0.8),zB=1-0.7*fin(t,tT-0.9,0.8)*(1-fin(t,tN+0.7,0.7)),zR=1-0.7*fin(t,tA-0.9,0.8)*(1-back);
  // the household's bill, corrected on the next bill: $144.40 back; and the 1,900 like it, found and corrected
  const fix=fin(t,tBk-0.6,0.6);arrive(ctx,310,228,t,0.3,()=>d9_bill(ctx,90,110,440,{a:zB,amount:fix>0.5?"268.40":"412.80",good:fix>0.5,was:"412.80",wa:fix,note:fix>0.5?"corrected on the next bill":"an estimated reading",
    stamp:"$144.40 back",st:fin(t,tBk,0.5),stampCol:[40,130,70],hi:pulseAt(t,tBk,1.6)}),{dy:-14});
  arrive(ctx,310,480,t,t19-0.4,()=>d9_count(ctx,90,400,440,1900*ease(clamp((t-t19)/1.6,0,1)),{a:zB,tk:clamp((t-tFc)/0.9,0,1),hi:pulseAt(t,tFc+0.3,1.4)}),{dy:-12});
  // the two rules, each confirmed by its owner
  [[D9_E21,"RUL-021",D9_R21,D9_NET,"Grace",tG],[D9_E22,"RUL-022",D9_R22,D9_RET,"head of retail",tHr]].forEach(([[x,y,w_],id,txt,side,who,t0],i)=>{
    const h=d9_rule(ctx,0,0,w_,"",txt,null,{a:0,size:28}),g=fin(t,t0+0.2,0.5);
    arrive(ctx,x+w_/2,y+h/2,t,tC-0.4+i*0.2,()=>d9_rule(ctx,x,y,w_,id,txt,side,{size:28,a:zR,hi:pulseAt(t,t0+0.3,1.4)}),{dy:-12});
    if(g>0)withA(ctx,g*zR,()=>{kt_gtick(ctx,x+22,y+h+30,18,1);T(ctx,"confirmed · "+who,x+52,y+h+40,{w:700,size:28,color:rgba(TRUST,1)});});});
  // Tartu: the benefit paid, and nobody asked twice
  arrive(ctx,D9_ETC[0]+D9_ETC[2]/2,D9_ETC[1]+D9_ETC[3]/2,t,tT-0.6,()=>d9_tartuCard(ctx,...D9_ETC,t,{a:zR,paid:fin(t,tPd-0.2,0.5),once:fin(t,tTw-0.4,0.5),hi:pulseAt(t,tPd,1.4)}),{dy:-14});
  // Tomás's note, and its answer; then the next question
  person(ctx,"tomas",1790,1030,0.74,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,tA,tA+2.6)});
  arrive(ctx,1480,150,t,tA-1.0,()=>sticky(ctx,1480,150,500,120,D9_Q,{col:NOTEC[0],size:32,st:fin(t,tAn+0.4,0.5),rot:-0.03}),{dy:-20});
  arrive(ctx,1480,440,t,tAn-0.2,()=>sticky(ctx,1480,440,540,300,D9_A,{col:NOTEC[0],size:30,p:clamp((t-tAn)/(tGf-tAn+0.8),0,1),rot:0.012}),{dy:-30,from:1.06});
  arrive(ctx,1460,770,t,tNx-0.1,()=>sticky(ctx,1460,770,460,150,D9_NEXT,{col:NOTEC[0],size:30,st:0,rot:0.03}),{dy:-30,from:1.06});
  ctx.restore();vign(ctx,S);
  eaEnd(ctx,S,t,B+0.8,"Rules with a home",EAC,"Write each rule once, where it applies, with an owner and a reason.","Film 9 of 11");});

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

/* ===== In the weeds of data crafting: the video's finishing pass =====
   Loaded after the engine. Only the rendered video uses it (tools/render.py calls renderAt); the site's player draws live, as before.
   Motion blur: each video frame is the average of MB moments across a third of a frame (a 126-degree shutter), so movement reads as filmed; eight moments keep fast things smooth rather than doubled.
   Then a soft glow on the bright parts. Stills (tools/stills.py) don't show it.
   No film grain: noise doesn't compress, and a fine grain made the video more than twice as large (123 MB against 53 MB without it).
   The drift and the blur themselves double the size of a still-framed cut (53 MB against 27 MB): still small. */
if(window.__RENDER__){(function(){const MB=8,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d"),B=mkCanvas(W/4,H/4),bx=B.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    // glow: a blurred, darkened copy of the bright parts, added softly
    bx.filter="blur(6px) brightness(0.85) contrast(1.6)";bx.clearRect(0,0,B.width,B.height);bx.drawImage(A,0,0,B.width,B.height);bx.filter="none";
    ox.globalCompositeOperation="screen";ox.globalAlpha=0.16;ox.drawImage(B,0,0,W,H);
    ox.globalCompositeOperation="source-over";ox.globalAlpha=1;return out.toDataURL("image/jpeg",q||0.9);};})();}
