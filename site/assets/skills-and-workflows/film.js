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

// Skills and workflows, the second film of Agents at work on data, the second series on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (a year in words). The few longer stops are in breath.js.
const NARR={
"book":{"name":"Completion and balancing","lead":1.6,"tail":1.0,"vo":[
 {"id":"city","gap":0.8,"text":"Baghdad, about twelve hundred years ago."},
 {"id":"sums","gap":0.8,"text":"Every day, its people need sums worked out."},
 {"id":"kinds","gap":0.8,"text":"Estates shared within families, legacies, fields divided, lawsuits, trade, land measured and canals dug."},
 {"id":"law","gap":0.8,"text":"The law sets each heir's share, and a legacy can leave part of an estate to someone outside the family."},
 {"id":"own","gap":0.8,"text":"But each problem is worked out on its own, with its own tricks, and a new kind starts from nothing."},
 {"id":"slip","gap":0.8,"text":"One slip, and a widow or a child could get less than the law gives them."},
 {"id":"two","gap":0.8,"text":"And two reckoners could reach two answers for one estate."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"writes","gap":0.8,"text":"Encouraged by the caliph, Muhammad al-Khwarizmi, a scholar of the House of Wisdom, writes a short book."},
 {"id":"require","gap":0.8,"text":"It teaches what people, in his words, constantly require."},
 {"id":"moves","gap":0.8,"text":"Two moves, completion and balancing, bring any problem to one of six forms."},
 {"id":"steps","gap":0.8,"text":"Each form has its own steps, worked through on an example, and proved with a drawn square."},
 {"id":"ex1","gap":0.8,"text":"A square and ten roots make thirty-nine."},
 {"id":"ex2","gap":0.8,"text":"Halve the ten: five. Multiply it by itself: twenty-five. Add the thirty-nine: sixty-four. Take its root: eight. Take away the five: three."},
 {"id":"cases","gap":0.8,"text":"Then come pages of real cases, legacies most of all."},
 {"id":"anyone","gap":0.8,"text":"Now anyone who follows the steps can solve a problem they've never seen, the same way every time."},
 {"id":"latin","gap":0.8,"text":"The book was copied for centuries, and put into Latin in 1145.","say":"The book was copied for centuries, and put into Latin in eleven forty-five."},
 {"id":"words","gap":0.8,"text":"Its first move, al-jabr, gave us the word algebra; his own name gave us algorithm."},
 {"id":"data","gap":0.8,"text":"Data teams have the same problem: a job solved in one chat is solved again in the next, from nothing."},
 {"id":"reuse","gap":0.8,"text":"Solve it once, write it down, and every agent can reuse it."}
]},
"again":{"name":"Solved again, from nothing","lead":1.0,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, at the university, Jun's team keeps the census-day count right: 18,412 students, the number the university reports to the government."},
 {"id":"recon","gap":0.8,"text":"Each time the count's code or its sources change, someone reconciles it."},
 {"id":"matches","gap":0.8,"text":"They check that it still matches the census report, the university's official count."},
 {"id":"differ","gap":0.8,"text":"When the two differ, someone has to find out why."},
 {"id":"causes","gap":0.8,"text":"The same few causes come back."},
 {"id":"three","gap":0.8,"text":"Students who withdrew after census day, and still count; a new degree that no faculty holds; a student counted twice."},
 {"id":"found","gap":0.8,"text":"Each was found before, by a person or an agent, and settled by a person."},
 {"id":"stayed","gap":0.8,"text":"But the answer stayed where it was found: in one chat, one note, one email."},
 {"id":"nothing","gap":0.8,"text":"So each time, the agent starts from nothing, and spends an afternoon finding what the team already knew."},
 {"id":"twice","gap":0.8,"text":"And it may settle a cause another way than last time: two answers for one count."}
]},
"skill":{"name":"A skill, earned by hand","lead":1.0,"tail":1.8,"vo":[
 {"id":"hand","gap":0.8,"text":"So Jun does the job once more, by hand, and writes down each step as he goes."},
 {"id":"file","gap":0.8,"text":"It becomes a skill: a file in the project, with a name, and a line that says when to use it."},
 {"id":"steps","gap":0.8,"text":"Then its steps: build the count, and compare it with the census report."},
 {"id":"behind","gap":0.8,"text":"Find the students behind any difference, and report each cause with its query."},
 {"id":"causes","gap":0.8,"text":"And then every cause met so far: how it shows, what settled it, and who decided."},
 {"id":"loads","gap":0.8,"text":"The agent doesn't read every skill all the time: just each one's name and line. It loads the steps only when a job needs them."},
 {"id":"grows","gap":0.8,"text":"When a new case turns up, it gets a line too. Nothing is solved twice."},
 {"id":"book","gap":0.8,"text":"It's al-Khwarizmi's book again: each form's steps, earned on real cases."}
]},
"router":{"name":"A router picks the skill","lead":1.0,"tail":1.4,"vo":[
 {"id":"seven","gap":0.8,"text":"The project has seven skills, one for each job agents do most here."},
 {"id":"which","gap":0.8,"text":"So which one does a job need?"},
 {"id":"router","gap":0.8,"text":"A router decides: a skill whose only job is to choose."},
 {"id":"reads","gap":0.8,"text":"It reads the job, compares it with each skill's line, and loads the one that fits."},
 {"id":"check","gap":0.8,"text":"Check Jun's change before Noor signs it off: reconcile and diff."},
 {"id":"none","gap":0.8,"text":"When no skill fits, it doesn't guess: it says so, and asks a person."},
 {"id":"next","gap":0.8,"text":"That job is done by hand first, and may become the next skill."},
 {"id":"forms","gap":0.8,"text":"Completion and balancing did the same: they brought each problem to the one form whose steps would solve it."}
]},
"workflow":{"name":"A workflow runs what's known","lead":1.0,"tail":1.0,"vo":[
 {"id":"night","gap":0.8,"text":"Some work needs no choosing. Every night, the count is built again from the day's records."},
 {"id":"fixed","gap":0.8,"text":"A workflow runs it: fixed steps, in order, the same way every time."},
 {"id":"list","gap":0.8,"text":"Build. Count as on census day. Run the tests. Compare with the census report."},
 {"id":"agree","gap":0.8,"text":"When they agree, that's the whole job, and no agent is needed."},
 {"id":"rule","gap":0.8,"text":"Automate what's known with plain steps first; keep the agent for what isn't."},
 {"id":"call","gap":0.8,"text":"Only when the numbers don't agree does the workflow call the agent, as one more step, with the reconcile skill."},
 {"id":"person","gap":0.8,"text":"The agent finds out why. A person decides."},
 {"id":"book","gap":0.8,"text":"In the book, too, a form's steps never change. The thinking is in bringing each problem to its form."}
]},
"night":{"name":"One night, a new case","lead":1.0,"tail":1.0,"vo":[
 {"id":"one","gap":0.8,"text":"One night in October, the numbers don't agree: 18,426 against 18,412."},
 {"id":"tests","gap":0.8,"text":"The tests pass, so the workflow calls the agent."},
 {"id":"loads","gap":0.8,"text":"It loads the reconcile skill, and checks the causes met so far, one by one. None fits."},
 {"id":"finds","gap":0.8,"text":"So it finds the records behind the difference: fourteen, all made last week, and all dated back to February."},
 {"id":"drafts","gap":0.8,"text":"In its sandbox, it drafts a report: the cause, the query that shows it, and a question. Are these students?"},
 {"id":"mei","gap":0.8,"text":"In the morning, Mei, in the registrar's office, decides: they're test records, made to try a new screen, and test records never count."},
 {"id":"adds","gap":0.8,"text":"Jun adds the cause to the skill, with Mei's answer, and turns the rule into one more fixed step, with a test."},
 {"id":"noor","gap":0.8,"text":"Noor approves the change before it runs."},
 {"id":"next","gap":0.8,"text":"The next night, the workflow leaves the fourteen out by itself, and calls no agent."}
]},
"close":{"name":"Solve it once","lead":1.0,"tail":1.0,"vo":[
 {"id":"baghdad","gap":0.8,"text":"In Baghdad, al-Khwarizmi solved each kind of problem once, wrote it down, and people followed his steps for centuries."},
 {"id":"uni","gap":0.8,"text":"At the university, a job done once by hand became a skill. A router finds it. A workflow runs what's known, the same way every night."},
 {"id":"agent","gap":0.8,"text":"The agent is called only where thinking is needed, and a person decides."},
 {"id":"new","gap":0.8,"text":"Each new case is written down, so it's never solved twice."},
 {"id":"once","gap":0.8,"text":"Solve it once, write it down, reuse it."}
]}
};

const VODUR={"book/city": 2.087, "book/sums": 2.617, "book/kinds": 6.729, "book/law": 6.001, "book/own": 5.347, "book/slip": 3.867, "book/two": 3.029, "book/change": 1.288, "book/writes": 5.898, "book/require": 3.325, "book/moves": 4.51, "book/steps": 4.971, "book/ex1": 2.031, "book/ex2": 9.375, "book/cases": 3.592, "book/anyone": 5.643, "book/latin": 4.381, "book/words": 5.267, "book/data": 6.461, "book/reuse": 3.695, "again/today": 10.617, "again/recon": 4.043, "again/matches": 4.659, "again/differ": 2.563, "again/causes": 1.726, "again/three": 7.383, "again/found": 4.43, "again/stayed": 4.407, "again/nothing": 6.158, "again/twice": 4.409, "skill/hand": 4.828, "skill/file": 5.45, "skill/steps": 4.102, "skill/behind": 4.261, "skill/causes": 4.862, "skill/loads": 7.711, "skill/grows": 4.246, "skill/book": 4.734, "router/seven": 4.069, "router/which": 1.512, "router/router": 3.536, "router/reads": 4.838, "router/check": 3.992, "router/none": 4.04, "router/next": 3.44, "router/forms": 6.062, "workflow/night": 5.303, "workflow/fixed": 3.942, "workflow/list": 4.963, "workflow/agree": 3.378, "workflow/rule": 4.141, "workflow/call": 6.455, "workflow/person": 2.877, "workflow/book": 5.868, "night/one": 7.92, "night/tests": 2.745, "night/loads": 5.715, "night/finds": 6.636, "night/drafts": 6.482, "night/mei": 7.609, "night/adds": 6.692, "night/noor": 2.202, "night/next": 4.777, "close/baghdad": 7.559, "close/uni": 8.948, "close/agent": 4.202, "close/new": 3.304, "close/once": 2.193};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the book's square settling into the title card; and the end card. */
const BREATH={
"book":{"hold":{"city":1.0,"kinds":0.8,"law":0.6,"own":0.6,"slip":0.6,"two":0.8,"change":1.0,"require":0.8,"moves":1.4,"steps":0.6,"ex1":0.6,"ex2":1.4,"cases":0.8,"anyone":0.8,"latin":0.6,"words":1.0,"data":0.6},"breathe":4.4},
"again":{"hold":{"today":0.8,"matches":0.8,"differ":0.6,"three":1.2,"found":0.6,"stayed":1.0,"nothing":1.0}},
"skill":{"hold":{"hand":1.2,"file":1.2,"behind":1.4,"causes":1.2,"loads":1.2,"grows":1.2}},
"router":{"hold":{"seven":0.8,"which":0.8,"router":0.6,"reads":0.8,"check":1.2,"none":1.0,"next":0.8}},
"workflow":{"hold":{"night":0.8,"fixed":0.6,"list":1.2,"agree":0.8,"rule":1.0,"call":0.8,"person":1.0}},
"night":{"hold":{"one":0.8,"tests":0.4,"loads":1.0,"finds":0.8,"drafts":1.0,"mei":0.8,"adds":0.8,"noor":0.6,"next":0.8}},
"close":{"hold":{"baghdad":0.8,"uni":0.8,"agent":0.6,"new":0.8},"breathe":5.0}
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
  // the near side of the nose, turned a little from the light: a soft shade down from between the eyes to the nostril
  c.filter="blur(3px)";c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.45),0.12);c.lineWidth=8;c.lineCap="round";c.beginPath();c.moveTo(364,428);c.quadraticCurveTo(369,444,374,454);c.stroke();c.filter="none";
  c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.4),0.2);c.lineWidth=2.4;c.beginPath();c.moveTo(274,490);c.quadraticCurveTo(296,510,322,519);c.stroke();c.restore();
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
  // the nose: its tip on the outline; inside, the curve of the nostril under it, and the near nostril's wing
  c.strokeStyle=C.line;c.lineWidth=2.6;c.beginPath();c.moveTo(384,449);c.quadraticCurveTo(392,459,381,463);c.stroke();
  c.lineWidth=2.2;c.beginPath();c.moveTo(368,458);c.quadraticCurveTo(367,465,375,465);c.stroke();
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

/* ===== Skills and workflows: Baghdad, about 820 =====
   The opening, drawn in the module's matte way and softly lit from the right, with the place and the time on a tag:
     swRiver   the Tigris at Baghdad in the morning: the far bank's flat roofs and palms, the green dome of the Round City beyond them,
               a brick quay on the near bank; a round boat and a sailing boat are drawn live, on the water
     swCourt   a house's courtyard: lime-plastered walls, a pointed arch, a carved wooden screen, a brick floor
     swStudy   a scholar's room in the House of Wisdom: plaster, a tall pointed window on the right, niches of books, a woven mat
     swBook    close on a low desk: the book open on it, its pages ruled and still blank, a reed pen and an ink pot
   SW_FOLK, the people (specs for the module's ag_person): the scholar, a widow, her son and daughter, two reckoners. No portrait of
   al-Khwarizmi survives: he is drawn as a scholar of his time, in a turban and a robe. Pieces drawn live: sw_table (a low table),
   sw_sheet (a sheet of working), sw_codex (a closed book), sw_square (the drawn square that proves the steps), sw_eq (an equation in
   words, on tiles), sw_forms (the six forms), sw_quffa and sw_sail (boats). Words are on the module's cards, in English; the book's
   pages carry only the drawn square, as its own pages do. Every name starts with sw_ or SW_. */

const SW_PAL={brick:[204,182,148],plaster:[232,222,204],trunk:[124,94,66],palm:[110,126,88],palmDark:[74,90,66],water:[168,182,178],deep:[120,140,140],
  bank:[184,158,122],wood:[118,84,56],woodHi:[178,138,98],ink:[58,44,34],paper:[243,236,219],dome:[118,146,124],tag:[70,50,34]};

/* ---------------------------------------------------------------- the opening's tag, in the frame's own coordinates */
// dk (0 to 1): how dark the place under it is; the tag turns from dark ink to the colour of the pages
function sw_place(ctx,S,text,a,dk){if(a<=0.01)return;setScreen(ctx,S);ag_T(ctx,String(text).toUpperCase(),96,100,{w:700,size:28,ls:4,col:mix(SW_PAL.tag,[238,228,208],clamp(dk||0,0,1)),a});}

/* ---------------------------------------------------------------- painting helpers */
function sw_sky(c,hz,sun){let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,"rgb(196,208,214)");g.addColorStop(0.55,"rgb(224,224,214)");g.addColorStop(1,"rgb(242,232,212)");
  c.fillStyle=g;c.fillRect(0,0,W,hz+2);if(sun){g=c.createRadialGradient(sun[0],sun[1],10,sun[0],sun[1],1000);g.addColorStop(0,"rgba(255,246,222,0.8)");g.addColorStop(0.3,"rgba(255,240,210,0.28)");
    g.addColorStop(1,"rgba(255,240,210,0)");c.fillStyle=g;c.fillRect(0,0,W,hz+2);}
  c.save();c.filter="blur(16px)";c.fillStyle="rgba(255,250,240,0.4)";for(const [x,y,w,h] of [[300,120,560,24],[900,70,380,18],[1420,190,460,20],[640,230,300,14]]){c.beginPath();c.ellipse(x,y,w/2,h/2,0,0,TAU);c.fill();}c.restore();}
// a shape along a cubic curve p, w0 wide at its start and w1 at its end, as part of a path
function sw_tube(c,p,w0,w1,n){n=n||16;const L=[],R=[];for(let i=0;i<=n;i++){const u=i/n,q=ag_bz(p,u),q2=ag_bz(p,Math.min(1,u+0.01)),q1=ag_bz(p,Math.max(0,u-0.01)),dx=q2[0]-q1[0],dy=q2[1]-q1[1],d=Math.hypot(dx,dy)||1,w=lerp(w0,w1,u)/2;
    L.push([q[0]-dy/d*w,q[1]+dx/d*w]);R.push([q[0]+dy/d*w,q[1]-dx/d*w]);}
  c.moveTo(L[0][0],L[0][1]);for(const q of L.slice(1))c.lineTo(q[0],q[1]);for(const q of R.reverse())c.lineTo(q[0],q[1]);c.closePath();}
// a date palm: a slender trunk with ring scars, a crown of arching fronds; s its height
function sw_palm(c,x,y,s,lean,seed){const R=ag_rnd(seed||5),tx=x+lean*s*0.3,ty=y-s,p=[x,y,x+lean*s*0.05,y-s*0.4,tx-lean*s*0.05,ty+s*0.3,tx,ty];
  ag_soft(c,cc=>sw_tube(cc,p,s*0.07,s*0.045),SW_PAL.trunk,[214,188,150],tx+s*0.05,ty+s*0.4,s*0.6,"rgba(50,34,20,0.38)",Math.max(3,s*0.03));
  c.save();c.lineCap="round";c.strokeStyle="rgba(70,50,30,0.25)";c.lineWidth=Math.max(1,s*0.006);for(let i=1;i<12;i++){const q=ag_bz(p,i/12),w=s*0.028;c.beginPath();c.moveTo(q[0]-w,q[1]+2);c.lineTo(q[0]+w,q[1]-2);c.stroke();}
  const n=14;for(let i=0;i<n;i++){const an=-Math.PI/2+(i/(n-1)-0.5)*3.5+(R()-0.5)*0.2,L=s*(0.4+R()*0.16),droop=0.55+R()*0.3,
      ex=tx+Math.cos(an)*L,ey=ty+Math.sin(an)*L*0.55+L*droop*0.45,mx=tx+Math.cos(an)*L*0.55,my=ty+Math.sin(an)*L*0.55-L*0.08,lit=Math.cos(an)>0.1;
    c.strokeStyle=rgba(lit?SW_PAL.palm:SW_PAL.palmDark,0.96);c.lineWidth=Math.max(1.5,s*0.012);c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(mx,my,ex,ey);c.stroke();
    c.lineWidth=Math.max(1,s*0.0065);for(let k=2;k<11;k++){const u=k/11,px=(1-u)*(1-u)*tx+2*(1-u)*u*mx+u*u*ex,py=(1-u)*(1-u)*ty+2*(1-u)*u*my+u*u*ey,ll=s*0.07*(1-u*0.5);
      for(const sd of [-1,1]){c.beginPath();c.moveTo(px,py);c.lineTo(px+Math.cos(an+sd*1.9)*ll*0.5,py+Math.sin(an+sd*1.9)*ll*0.5+ll*0.6);c.stroke();}}}
  c.fillStyle=rgba(SW_PAL.palmDark,1);c.beginPath();c.ellipse(tx,ty+s*0.02,s*0.05,s*0.035,0,0,TAU);c.fill();c.restore();}
// a flat-roofed house of mud brick, plastered, lit from the right; v shifts its lightness; far: fewer details
function sw_house(c,x,y,w,h,v,far){const b=mix(SW_PAL.brick,v>0?[255,248,232]:[96,72,50],Math.abs(v||0));c.fillStyle=rgba(b,1);c.fillRect(x,y,w,h);
  let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(70,46,26,0.16)");g.addColorStop(0.6,"rgba(70,46,26,0.02)");g.addColorStop(1,"rgba(255,246,226,0.14)");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.fillStyle=rgba(mix(b,[255,248,232],0.22),1);c.fillRect(x-2,y-6,w+4,8);c.fillStyle="rgba(70,46,26,0.18)";c.fillRect(x-2,y+2,w+4,3);
  const R=ag_rnd((x*7+y)|0),n=far?(w>110?2:1):Math.max(1,Math.round(w/90));
  for(let i=0;i<n;i++){const wx=x+w*(i+0.5)/n-(far?5:9)+(R()-0.5)*w*0.12,wy=y+h*(0.25+R()*0.2),ww=far?10:18,wh=far?16:28;
    c.fillStyle="rgba(52,36,26,0.72)";c.fillRect(wx,wy,ww,wh);c.fillStyle="rgba(255,240,210,0.25)";c.fillRect(wx+ww,wy,2,wh);}
  if(!far){c.fillStyle="rgba(60,40,24,0.18)";for(let bx=x+20;bx<x+w-10;bx+=40){c.beginPath();c.ellipse(bx,y+20,5,4.5,0,0,TAU);c.fill();}}}
// the Round City's green dome on its drum, far off: a soft matte shape, its light from the right
function sw_dome(c,x,base,s){const dw=150*s,dh=46*s,top=base-dh;
  ag_soft(c,cc=>cc.rect(x-dw*0.5,top,dw,dh),mix(SW_PAL.brick,[255,248,232],0.1),[255,246,226],x+dw*0.3,top+10,dw*0.6,"rgba(70,46,26,0.25)",10);
  c.fillStyle="rgba(70,46,26,0.2)";for(let k=0;k<7;k++){const ax=x-dw*0.42+k*dw*0.14;c.beginPath();c.moveTo(ax,base-6*s);c.lineTo(ax,top+18*s);c.arc(ax+6*s,top+18*s,6*s,Math.PI,0);c.lineTo(ax+12*s,base-6*s);c.closePath();c.fill();}
  const r=dw*0.46,sh=cc=>{cc.moveTo(x-r,top);cc.bezierCurveTo(x-r,top-r*0.95,x-r*0.2,top-r*1.18,x,top-r*1.32);cc.bezierCurveTo(x+r*0.2,top-r*1.18,x+r,top-r*0.95,x+r,top);cc.closePath();};
  ag_soft(c,sh,SW_PAL.dome,[214,232,214],x+r*0.45,top-r*0.8,r*1.4,"rgba(30,50,40,0.4)",14);
  c.strokeStyle="rgba(60,50,40,0.6)";c.lineWidth=3*s;c.beginPath();c.moveTo(x,top-r*1.32);c.lineTo(x,top-r*1.62);c.stroke();c.fillStyle="rgba(120,100,70,0.9)";c.beginPath();c.arc(x,top-r*1.5,5*s,0,TAU);c.fill();}
// soft plaster: a fill with broad patches, lighter towards the right
function sw_plaster(c,x,y,w,h,base,seed){c.fillStyle=rgba(base,1);c.fillRect(x,y,w,h);const R=ag_rnd(seed||3);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.filter="blur(22px)";
  for(let i=0;i<26;i++){const px=x+R()*w,py=y+R()*h,pw=60+R()*160,ph=30+R()*90;c.fillStyle=R()<0.5?"rgba(120,90,60,0.025)":"rgba(255,250,238,0.05)";c.beginPath();c.ellipse(px,py,pw,ph,R()*3,0,TAU);c.fill();}
  c.restore();let g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(60,42,26,0.16)");g.addColorStop(0.5,"rgba(60,42,26,0.03)");g.addColorStop(1,"rgba(255,248,230,0.12)");c.fillStyle=g;c.fillRect(x,y,w,h);}
// a pointed arch, as part of a path: its opening from x0 to x1, the springing at ys, the point at yt
function sw_arch(c,x0,x1,ys,yt,yb){const m=(x0+x1)/2,w=x1-x0;c.moveTo(x0,yb);c.lineTo(x0,ys);c.bezierCurveTo(x0,ys-(ys-yt)*0.55,m-w*0.12,yt+(ys-yt)*0.12,m,yt);
  c.bezierCurveTo(m+w*0.12,yt+(ys-yt)*0.12,x1,ys-(ys-yt)*0.55,x1,ys);c.lineTo(x1,yb);c.closePath();}
// a floor of square baked bricks, receding from the wall's foot at y0
function sw_brickFloor(c,y0,col){let g=c.createLinearGradient(0,y0,0,H);g.addColorStop(0,rgba(col,1));g.addColorStop(1,rgba(mix(col,[90,60,40],0.18),1));c.fillStyle=g;c.fillRect(0,y0,W,H-y0);
  c.strokeStyle="rgba(110,80,54,0.2)";c.lineWidth=1.5;for(let y=y0;y<H;){const gp=((y-y0)+50)*0.17;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();y+=gp;}
  for(let i=-30;i<40;i++){const xb=960+i*120;c.beginPath();c.moveTo(960+(xb-960)*0.4,y0);c.lineTo(xb+(xb-960)*0.45,H);c.stroke();}
  g=c.createLinearGradient(0,y0,0,y0+80);g.addColorStop(0,"rgba(70,46,26,0.25)");g.addColorStop(1,"rgba(70,46,26,0)");c.fillStyle=g;c.fillRect(0,y0,W,80);}
// the room's soft shade on the left and warmth on the right, over a whole place
function sw_light(c,k){let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(50,34,20,"+(0.16*k)+")");g.addColorStop(0.45,"rgba(50,34,20,0)");g.addColorStop(1,"rgba(255,236,200,"+(0.08*k)+")");c.fillStyle=g;c.fillRect(0,0,W,H);}

/* ---------------------------------------------------------------- the places */
// the Tigris in the morning: sky, the far bank (and its reflection), the water, the near bank and its quay
AG_PLACES.swRiver=c=>{const bank=500;sw_sky(c,bank,[1680,150]);
  // the far bank drawn on its own layer, so the water can mirror it
  const L=mkCanvas(W,bank+20),lc=L.getContext("2d");sw_dome(lc,1300,410,1.05);
  // a far row of houses, paler with distance, then the nearer row
  const R=ag_rnd(820);let x=-30;while(x<W+40){const w=80+R()*120,h=36+R()*50;sw_house(lc,x,bank-60-h,w,h+60,0.22+R()*0.08,true);x+=w-4;}
  for(const [px,s,ln] of [[120,150,0.1],[520,170,-0.15],[880,140,0.2],[1640,180,-0.1],[1820,150,0.15]])sw_palm(lc,px,bank-20,s,ln,px);
  x=-40;while(x<W+40){const w=110+R()*170,h=52+R()*84;sw_house(lc,x,bank-h,w,h,(R()-0.4)*0.12,true);x+=w-6;}
  for(const [px,s,ln] of [[300,210,0.12],[1090,230,-0.1],[1480,190,0.18]])sw_palm(lc,px,bank+4,s,ln,px+3);
  lc.fillStyle=rgba(SW_PAL.bank,1);lc.fillRect(0,bank-2,W,22);lc.fillStyle="rgba(255,246,226,0.3)";lc.fillRect(0,bank-2,W,2);
  // haze over the far bank: it sits back in the morning air
  let g=lc.createLinearGradient(0,bank-260,0,bank);g.addColorStop(0,"rgba(236,232,220,0.0)");g.addColorStop(1,"rgba(236,230,214,0.22)");lc.fillStyle=g;lc.fillRect(0,0,W,bank+20);
  c.drawImage(L,0,0);
  // the water: deeper and cooler towards us; the far bank mirrored, broken into soft bands
  g=c.createLinearGradient(0,bank+18,0,860);g.addColorStop(0,rgba(mix(SW_PAL.water,[240,232,214],0.3),1));g.addColorStop(1,rgba(SW_PAL.deep,1));c.fillStyle=g;c.fillRect(0,bank+18,W,860-bank-18);
  const Fl=mkCanvas(W/2,110),fc=Fl.getContext("2d");fc.filter="blur(1.5px)";fc.translate(0,110);fc.scale(0.5,-0.5);fc.drawImage(L,0,bank+16-220,W,220,0,0,W,220);
  c.save();c.globalAlpha=0.34;for(let y=0;y<220;y+=6){const dx=Math.sin(y*0.37)*6;c.drawImage(Fl,0,y/2,W/2,3,dx,bank+18+y,W,6);}c.restore();
  c.save();c.globalAlpha=0.5;for(let i=0;i<70;i++){const yy=bank+30+Math.pow(R(),1.4)*300,xx=R()*W,ww=40+R()*180;c.fillStyle=R()<0.6?"rgba(255,250,236,0.35)":"rgba(70,90,92,0.18)";c.fillRect(xx,yy,ww,1.6+(yy-bank)*0.006);}c.restore();
  // the sun's path on the water, off to the right
  c.save();c.translate(1660,640);c.scale(1,0.5);g=c.createRadialGradient(0,0,0,0,0,420);g.addColorStop(0,"rgba(255,248,226,0.3)");g.addColorStop(1,"rgba(255,248,226,0)");c.fillStyle=g;c.fillRect(-500,-500,1000,1000);c.restore();
  // the near bank: earth, reeds at the left; a quay of baked brick on the right, its steps going down into the water
  const nb=cc=>{cc.moveTo(0,820);cc.bezierCurveTo(400,800,800,836,1180,842);cc.lineTo(1180,H);cc.lineTo(0,H);cc.closePath();};
  ag_soft(c,nb,SW_PAL.bank,[232,210,170],700,840,700,"rgba(70,46,26,0.35)",20);
  c.save();c.lineCap="round";for(let t=0;t<16;t++){const cx0=40+R()*900,cy0=830+R()*30;for(let i=0;i<12;i++){const rx=cx0+(R()-0.5)*40,hh=50+R()*80,ln=(R()-0.4)*30;
      c.strokeStyle=rgba(mix(SW_PAL.palmDark,[206,196,150],R()*0.6),0.85);c.lineWidth=2+R()*2;c.beginPath();c.moveTo(rx,cy0);c.quadraticCurveTo(rx+ln*0.2,cy0-hh*0.6,rx+ln,cy0-hh);c.stroke();}}c.restore();
  const qx=1180,qy=772;ag_soft(c,cc=>cc.rect(qx,qy,W-qx,H-qy),[178,140,104],[226,196,160],1700,qy,700,"rgba(70,46,26,0.3)",10);
  for(let k=0;k<4;k++){const sy=qy+k*44,sx=qx+40+k*70;c.fillStyle=rgba(mix([214,184,146],[255,246,226],0.12),1);c.fillRect(sx,sy,W-sx,12);c.fillStyle="rgba(255,248,232,0.55)";c.fillRect(sx,sy,W-sx,1.6);
    c.fillStyle=rgba([170,132,98],1);c.fillRect(sx,sy+12,W-sx,32);c.fillStyle="rgba(70,46,26,0.18)";c.fillRect(sx,sy+12,W-sx,4);
    c.strokeStyle="rgba(110,76,50,0.2)";c.lineWidth=1.2;for(let bx=sx+20+(k%2)*24;bx<W;bx+=48){c.beginPath();c.moveTo(bx,sy+14);c.lineTo(bx,sy+44);c.stroke();}
    c.fillStyle="rgba(70,46,26,0.28)";c.fillRect(sx-6,sy,6,44);}
  c.fillStyle="rgba(255,244,222,0.4)";c.fillRect(qx,qy,W-qx,2);c.fillStyle="rgba(70,46,26,0.3)";c.fillRect(qx,qy,6,H-qy);
  sw_palm(c,250,880,330,0.12,11);sw_palm(c,60,900,400,0.2,17);
  sw_light(c,0.8);};

// a house's courtyard: plaster walls; on the left a deep pointed arch, its stucco band; on the right a carved wooden screen; a brick floor
const SW_COURT={base:720};
AG_PLACES.swCourt=c=>{const base=SW_COURT.base;sw_plaster(c,0,0,W,base,SW_PAL.plaster,21);
  // the arch: its band of carved stucco, the deep shade inside, a glimpse of a room
  const ax0=300,ax1=700;c.fillStyle="rgba(120,92,62,0.14)";c.beginPath();sw_arch(c,ax0-34,ax1+34,330,96,base);c.fill();
  ag_soft(c,cc=>sw_arch(cc,ax0-26,ax1+26,330,104,base),mix(SW_PAL.plaster,[255,250,238],0.2),[255,252,244],ax1,200,400,"rgba(70,46,26,0.25)",12);
  ag_soft(c,cc=>sw_arch(cc,ax0,ax1,330,140,base),[96,72,52],[150,118,86],ax1-60,360,320,"rgba(20,12,6,0.5)",30);
  let g=c.createLinearGradient(ax0,0,ax1,0);g.addColorStop(0,"rgba(20,12,6,0.28)");g.addColorStop(1,"rgba(255,230,190,0.06)");c.fillStyle=g;c.beginPath();sw_arch(c,ax0,ax1,330,140,base);c.fill();
  // the stucco band: two fine lines round the arch, and a row of small lobes between them
  c.save();c.strokeStyle="rgba(120,92,62,0.3)";c.lineWidth=2;c.beginPath();sw_arch(c,ax0-8,ax1+8,330,128,base-2);c.stroke();c.beginPath();sw_arch(c,ax0-20,ax1+20,330,110,base-2);c.stroke();
  c.fillStyle="rgba(120,92,62,0.16)";for(let k=1;k<40;k++){const u=k/40,p=u<0.5?ag_bz([ax0-14,base-12,ax0-14,330-(330-119)*0.55,(ax0+ax1)/2-(ax1-ax0+28)*0.12,119+(330-119)*0.12,(ax0+ax1)/2,119],u*2):
      ag_bz([(ax0+ax1)/2,119,(ax0+ax1)/2+(ax1-ax0+28)*0.12,119+(330-119)*0.12,ax1+14,330-(330-119)*0.55,ax1+14,base-12],u*2-1);c.beginPath();c.arc(p[0],p[1],3.2,0,TAU);c.fill();}c.restore();
  // the wooden screen: a frame, and a lattice of small openings with light behind
  const sx=1330,sy=170,sw=380,sh=420;ag_soft(c,cc=>cc.rect(sx-24,sy-24,sw+48,sh+48),SW_PAL.wood,SW_PAL.woodHi,sx+sw,sy,500,"rgba(30,18,10,0.45)",14);
  c.fillStyle="rgb(250,240,214)";c.fillRect(sx,sy,sw,sh);c.fillStyle=rgba(mix(SW_PAL.wood,[255,240,214],0.08),1);
  for(let yy=sy;yy<sy+sh;yy+=38)for(let xx=sx;xx<sx+sw;xx+=38){c.save();c.translate(xx+19,yy+19);c.beginPath();c.rect(-19,-19,38,38);c.moveTo(0,-13);c.lineTo(13,0);c.lineTo(0,13);c.lineTo(-13,0);c.closePath();c.fill("evenodd");c.restore();}
  c.save();c.globalCompositeOperation="multiply";g=c.createLinearGradient(sx,0,sx+sw,0);g.addColorStop(0,"rgba(180,150,120,1)");g.addColorStop(1,"rgba(255,255,255,1)");c.fillStyle=g;c.fillRect(sx,sy,sw,sh);c.restore();
  c.fillStyle=rgba(mix(SW_PAL.wood,[255,240,214],0.15),1);c.fillRect(sx-40,sy+sh+24,sw+80,18);c.fillStyle="rgba(255,240,214,0.4)";c.fillRect(sx-40,sy+sh+24,sw+80,2);
  // the screen's light on the floor: a soft patch of small diamonds
  sw_brickFloor(c,base,[198,168,130]);
  c.save();c.beginPath();c.rect(0,base,W,H-base);c.clip();c.translate(1440,900);c.scale(1,0.3);g=c.createRadialGradient(0,0,0,0,0,520);g.addColorStop(0,"rgba(255,244,214,0.3)");g.addColorStop(1,"rgba(255,244,214,0)");c.fillStyle=g;c.fillRect(-600,-600,1200,1200);c.restore();
  // the wall's foot: a low plinth
  c.fillStyle=rgba(mix(SW_PAL.plaster,[150,120,90],0.2),1);c.fillRect(0,base-26,W,26);c.fillStyle="rgba(255,250,236,0.4)";c.fillRect(0,base-26,W,2);
  sw_light(c,1);};

// a scholar's room in the House of Wisdom: plaster; niches of books on the left; a tall pointed window on the right, its light on the
// floor; a woven mat
const SW_STUDY={base:700};
AG_PLACES.swStudy=c=>{const base=SW_STUDY.base;sw_plaster(c,0,0,W,base,mix(SW_PAL.plaster,[214,196,166],0.25),33);
  // the window: deep reveal, a pale morning sky, a slim grille; the light it throws across the room
  const wx0=1450,wx1=1720;ag_soft(c,cc=>sw_arch(cc,wx0-30,wx1+30,330,90,640),mix(SW_PAL.plaster,[150,120,90],0.25),[255,246,226],wx0,300,400,"rgba(60,40,24,0.35)",16);
  let g=c.createLinearGradient(0,120,0,620);g.addColorStop(0,"rgb(214,226,232)");g.addColorStop(1,"rgb(246,238,220)");c.fillStyle=g;c.beginPath();sw_arch(c,wx0,wx1,330,120,620);c.fill();
  c.save();c.beginPath();sw_arch(c,wx0,wx1,330,120,620);c.clip();sw_palm(c,1560,640,330,0.1,41);c.fillStyle="rgba(250,244,230,0.35)";c.fillRect(wx0,100,wx1-wx0,540);
  c.strokeStyle="rgba(90,66,44,0.7)";c.lineWidth=5;for(const xx of [wx0+90,wx0+180]){c.beginPath();c.moveTo(xx,100);c.lineTo(xx,620);c.stroke();}for(const yy of [300,460]){c.beginPath();c.moveTo(wx0,yy);c.lineTo(wx1,yy);c.stroke();}c.restore();
  c.fillStyle=rgba(mix(SW_PAL.plaster,[150,120,90],0.3),1);c.fillRect(wx0-44,620,wx1-wx0+88,26);c.fillStyle="rgba(255,248,232,0.45)";c.fillRect(wx0-44,620,wx1-wx0+88,2);
  // niches with books: arched recesses, codices lying flat in piles, a few standing
  for(const [nx,nw] of [[140,280],[480,240]]){const ny0=170,ny1=560;ag_soft(c,cc=>sw_arch(cc,nx,nx+nw,ny0+90,ny0,ny1),mix(SW_PAL.plaster,[120,92,62],0.32),[200,176,140],nx+nw-40,ny0+120,260,"rgba(40,26,14,0.45)",22);
    for(const sy of [ny0+170,ny1-20]){c.fillStyle="rgba(90,64,40,0.35)";c.fillRect(nx,sy,nw,8);c.fillStyle=rgba(SW_PAL.woodHi,1);c.fillRect(nx,sy-4,nw,6);
      const R=ag_rnd(nx+sy);let bx=nx+14;while(bx<nx+nw-70){const piles=2+((R()*4)|0),bw=Math.min(50+R()*34,nx+nw-14-bx);for(let k=0;k<piles;k++){const bh=14+R()*8,by=sy-4-(k+1)*bh;
          const col=[[120,72,52],[92,70,52],[140,104,70],[78,64,58]][(R()*4)|0];ag_soft(c,cc=>ag_rect(cc,bx+(R()-0.5)*6,by,bw,bh-1,3),col,mix(col,[255,236,200],0.4),bx+bw,by,bw,null);
          c.fillStyle="rgba(240,226,196,0.8)";c.fillRect(bx+bw-8+(R()-0.5)*2,by+3,6,bh-7);}bx+=bw+8+R()*8;}}}
  // the floor: a woven reed mat over beaten earth
  g=c.createLinearGradient(0,base,0,H);g.addColorStop(0,"rgb(196,170,132)");g.addColorStop(1,"rgb(168,140,104)");c.fillStyle=g;c.fillRect(0,base,W,H-base);
  c.fillStyle=rgba(mix(SW_PAL.plaster,[150,120,90],0.25),1);c.fillRect(0,base-22,W,22);c.fillStyle="rgba(255,250,236,0.4)";c.fillRect(0,base-22,W,2);
  const mat=cc=>{cc.moveTo(260,base+40);cc.lineTo(1600,base+40);cc.lineTo(1840,H);cc.lineTo(20,H);cc.closePath();};ag_soft(c,mat,[206,180,128],[240,222,178],1300,base+80,900,"rgba(80,56,30,0.3)",16);
  c.save();ag_shape(c,mat);c.clip();c.strokeStyle="rgba(120,92,52,0.22)";c.lineWidth=2;for(let y=base+50;y<H;y+=(y-base)*0.06+8){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  c.strokeStyle="rgba(150,84,60,0.28)";c.lineWidth=10;for(const y of [base+70,H-60]){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}c.restore();
  // the window's light, a slanting patch on the floor
  c.save();c.globalCompositeOperation="screen";g=c.createLinearGradient(1500,base,1100,H);g.addColorStop(0,"rgba(255,236,196,0.22)");g.addColorStop(1,"rgba(255,236,196,0)");c.fillStyle=g;
  c.beginPath();c.moveTo(1460,base+30);c.lineTo(1720,base+30);c.lineTo(1500,H);c.lineTo(1020,H);c.closePath();c.fill();c.restore();
  sw_light(c,1);};

// close on the low desk: dark walnut, the book open on it (its pages ruled faintly, still blank), a reed pen and an ink pot on the right
const SW_BOOK={x0:300,x1:1620,y0:110,y1:860,gut:960};
AG_PLACES.swBook=c=>{const B=SW_BOOK;let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(96,68,46)");g.addColorStop(1,"rgb(72,50,34)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const R=ag_rnd(77);c.save();c.globalAlpha=0.12;c.strokeStyle="rgb(40,26,16)";c.lineWidth=2;for(let i=0;i<60;i++){const y=R()*H;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(600,y+(R()-0.5)*30,1300,y+(R()-0.5)*30,W,y+(R()-0.5)*20);c.stroke();}c.restore();
  g=c.createRadialGradient(1500,200,50,1300,400,1500);g.addColorStop(0,"rgba(255,230,190,0.18)");g.addColorStop(1,"rgba(255,230,190,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the book: the cover's edge under the pages, then two pages curving down into the gutter
  ag_floorShadow(c,960-10,B.y1+10,760,40,0.5);
  ag_soft(c,cc=>ag_rect(cc,B.x0-22,B.y0-14,B.x1-B.x0+44,B.y1-B.y0+34,10),[110,62,44],[160,104,76],1500,B.y0,700,"rgba(30,16,8,0.4)",12);
  for(const side of [-1,1]){const xa=side<0?B.x0:B.gut,xb=side<0?B.gut:B.x1,pg=cc=>{cc.moveTo(xa,B.y0+(side<0?6:0));cc.bezierCurveTo(xa+(xb-xa)*0.4,B.y0-12,xb-(xb-xa)*0.2,B.y0-14,xb,B.y0+(side<0?0:6));
      cc.lineTo(xb,B.y1-(side<0?0:6));cc.bezierCurveTo(xb-(xb-xa)*0.2,B.y1+6,xa+(xb-xa)*0.4,B.y1+8,xa,B.y1-(side<0?6:0));cc.closePath();};
    ag_soft(c,pg,SW_PAL.paper,[255,252,240],side<0?B.x0+300:B.x1-200,B.y0+200,700,"rgba(110,84,50,0.22)",24);
    c.save();ag_shape(c,pg);c.clip();g=c.createLinearGradient(B.gut-110,0,B.gut+110,0);g.addColorStop(0,"rgba(120,90,60,0)");g.addColorStop(0.5,"rgba(120,90,60,0.28)");g.addColorStop(1,"rgba(120,90,60,0)");c.fillStyle=g;c.fillRect(B.gut-110,0,220,H);
      c.strokeStyle="rgba(150,120,90,0.25)";c.lineWidth=1.4;c.strokeRect(xa+(side<0?70:60),B.y0+60,(xb-xa)-130,B.y1-B.y0-120);c.restore();}
  // the reed pen and the ink pot, on the right
  c.save();c.translate(1760,620);c.rotate(-0.9);ag_soft(c,cc=>ag_rect(cc,-170,-7,340,14,6),[196,166,116],[240,220,170],60,-6,200,"rgba(60,40,20,0.4)",6);c.fillStyle="rgb(50,40,32)";c.beginPath();c.moveTo(170,-6);c.lineTo(196,0);c.lineTo(170,6);c.closePath();c.fill();c.restore();
  ag_floorShadow(c,1770,860,70,16,0.5);ag_soft(c,cc=>{cc.moveTo(1716,860);cc.bezierCurveTo(1700,790,1730,770,1770,770);cc.bezierCurveTo(1810,770,1840,790,1824,860);cc.closePath();},[86,74,64],[170,150,130],1800,790,90,"rgba(0,0,0,0.4)",10);
  c.fillStyle="rgb(30,24,20)";c.beginPath();c.ellipse(1770,772,26,7,0,0,TAU);c.fill();
  sw_light(c,0.8);};

/* ---------------------------------------------------------------- what they wear: a turban, a small cap, a shawl over the head
   Painted in figure space (people.js): a hat's paint draws over the head, inside the head's picture ([160, 250] to [440, 560]); a
   top's paint draws over the body, before its near arm and its neck. A shawl is both: the head's part frames the face and leaves the
   throat open; the body's part falls over the far shoulder and behind the near arm, meeting the head's part at figure y 560. */
function sw_turban(col){return(c,P)=>{const sh=cc=>{cc.moveTo(400,358);cc.bezierCurveTo(416,328,414,288,380,264);cc.bezierCurveTo(344,242,262,242,220,264);
      cc.bezierCurveTo(186,284,176,342,190,404);cc.bezierCurveTo(222,394,256,382,290,370);cc.bezierCurveTo(330,356,370,352,400,358);cc.closePath();};
  // the turban's soft shadow on the brow, under its edge
  c.save();ag_shape(c,AG_F.head);c.clip();c.strokeStyle=rgba(ag_dk(P.skin,0.55),0.28);c.lineWidth=14;c.filter="blur(5px)";c.beginPath();c.moveTo(196,410);c.bezierCurveTo(240,396,330,366,400,368);c.stroke();c.restore();
  ag_soft(c,sh,col,ag_lt(col,0.5),352,276,170,rgba(ag_dk(col,0.6),0.5),16);
  // the cloth's turns: each a band rising from the back to the front, its lower edge in shade and its upper edge in light
  c.save();ag_shape(c,sh);c.clip();c.lineCap="round";
  for(const [x0,y0,cx,cy,x1,y1] of [[188,392,250,330,404,330],[192,352,262,294,394,290],[214,300,280,262,370,260],[232,396,300,350,404,350]]){
    c.strokeStyle=rgba(ag_dk(col,0.42),0.55);c.lineWidth=5;c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo(cx,cy,x1,y1);c.stroke();
    c.strokeStyle=rgba(ag_lt(col,0.6),0.6);c.lineWidth=3;c.beginPath();c.moveTo(x0+2,y0-6);c.quadraticCurveTo(cx+2,cy-6,x1+2,y1-6);c.stroke();}
  c.restore();
  c.strokeStyle=rgba(ag_dk(col,0.4),0.7);c.lineWidth=2.4;c.beginPath();c.moveTo(190,404);c.bezierCurveTo(222,394,256,382,290,370);c.bezierCurveTo(330,356,370,352,400,358);c.stroke();};}
function sw_cap(col){return(c,P)=>{const f=cc=>{cc.moveTo(210,372);cc.bezierCurveTo(204,316,248,284,300,282);cc.bezierCurveTo(352,282,392,310,394,360);cc.bezierCurveTo(364,350,330,346,296,348);cc.bezierCurveTo(258,350,230,360,210,372);cc.closePath();};
  ag_soft(c,f,col,ag_lt(col,0.35),330,300,120,rgba(ag_dk(col,0.7),0.45),12);c.strokeStyle=rgba(ag_lt(col,0.25),0.5);c.lineWidth=6;c.beginPath();c.moveTo(212,366);c.bezierCurveTo(250,350,330,342,392,354);c.stroke();};}
// the shawl's outline over the head (outer, then the opening for the face and the throat), in figure space
function sw_shawlHead(cc){cc.moveTo(398,330);cc.bezierCurveTo(398,282,352,256,300,258);cc.bezierCurveTo(230,260,184,296,174,364);cc.bezierCurveTo(166,430,164,500,166,560);cc.lineTo(432,560);
  cc.bezierCurveTo(426,500,416,440,412,392);cc.bezierCurveTo(408,364,404,344,398,330);cc.closePath();
  // the opening: the forehead under the shawl's edge, the far cheek and the chin, the throat, the jaw back to the ear, which it covers
  cc.moveTo(276,356);cc.bezierCurveTo(310,342,356,338,386,348);cc.bezierCurveTo(389,368,390,384,390,396);cc.bezierCurveTo(390,404,387,410,386,415);cc.bezierCurveTo(386,424,390,432,391,440);
  cc.bezierCurveTo(394,446,397,451,397,455);cc.bezierCurveTo(397,460,393,463,388,464);cc.bezierCurveTo(386,470,386,478,385,486);cc.bezierCurveTo(384,498,381,508,377,516);
  cc.bezierCurveTo(373,524,368,530,364,536);cc.lineTo(366,560);cc.lineTo(240,560);cc.bezierCurveTo(246,530,256,508,262,488);cc.bezierCurveTo(260,450,262,410,268,384);cc.bezierCurveTo(270,370,272,362,276,356);cc.closePath();}
function sw_shawlBody(cc){cc.moveTo(166,556);cc.lineTo(240,556);cc.bezierCurveTo(238,580,234,600,226,612);cc.bezierCurveTo(196,622,160,630,126,646);cc.bezierCurveTo(140,612,156,580,166,556);cc.closePath();
  cc.moveTo(364,556);cc.lineTo(434,556);cc.bezierCurveTo(462,600,486,660,488,740);cc.bezierCurveTo(490,800,484,850,476,890);cc.bezierCurveTo(450,904,410,900,384,884);
  cc.bezierCurveTo(388,820,386,760,380,700);cc.bezierCurveTo(376,640,372,600,364,556);cc.closePath();}
function sw_shawl(col,hair){const hi=ag_lt(col,0.42),dk=rgba(ag_dk(col,0.6),0.45);return{
  head:(c,P)=>{// the hair at the brow, under the shawl's edge
    c.save();ag_shape(c,AG_F.head);c.clip();c.fillStyle=rgba(hair,1);c.beginPath();c.moveTo(268,392);c.bezierCurveTo(270,376,272,362,276,356);c.bezierCurveTo(310,342,356,338,386,348);
      c.lineTo(388,358);c.bezierCurveTo(356,352,316,354,290,366);c.bezierCurveTo(280,372,274,382,272,396);c.closePath();c.fill();c.restore();
    c.save();c.beginPath();sw_shawlHead(c);c.fillStyle=rgba(col,1);c.fill("evenodd");c.restore();
    c.save();c.beginPath();sw_shawlHead(c);c.clip("evenodd");let g=c.createRadialGradient(360,300,10,330,330,220);g.addColorStop(0,rgba(hi,0.8));g.addColorStop(1,rgba(hi,0));c.fillStyle=g;c.fillRect(160,250,280,310);
      g=c.createLinearGradient(170,0,300,0);g.addColorStop(0,dk);g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(160,250,140,310);
      c.strokeStyle=rgba(ag_dk(col,0.5),0.35);c.lineWidth=3;c.lineCap="round";for(const f of [[[210,330],[200,430],[214,540]],[[236,300],[226,420],[232,540]],[[404,380],[412,460],[410,550]],[[300,268],[250,290],[218,330]]]){c.beginPath();c.moveTo(f[0][0],f[0][1]);c.quadraticCurveTo(f[1][0],f[1][1],f[2][0],f[2][1]);c.stroke();}
      c.restore();
    // the edge that frames the face: a fold of the cloth, lit on its top
    c.strokeStyle=rgba(ag_dk(col,0.3),0.8);c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(268,384);c.bezierCurveTo(270,370,272,362,276,356);c.bezierCurveTo(310,342,356,338,386,348);c.stroke();
    c.strokeStyle=rgba(hi,0.7);c.lineWidth=2;c.beginPath();c.moveTo(278,350);c.bezierCurveTo(312,336,356,332,386,342);c.stroke();},
  body:(c,P)=>{ag_soft(c,sw_shawlBody,col,hi,440,620,240,dk,16);ag_folds(c,sw_shawlBody,[[[410,610],[440,760],[436,930]],[[394,660],[404,800],[410,940]],[[430,600],[460,700],[456,820]]],rgba(ag_dk(col,0.5),0.3),rgba(hi,0.25));
    c.save();c.beginPath();sw_shawlBody(c);c.clip();c.strokeStyle=rgba(ag_dk(col,0.35),0.6);c.lineWidth=6;c.beginPath();c.moveTo(384,884);c.bezierCurveTo(410,900,450,904,476,890);c.stroke();c.restore();}};}
// a few soft lines of age on a face, in figure space (k 0 to 1): under the near eye, and from the nose to the mouth
function sw_age(c,P,k){c.save();ag_shape(c,AG_F.head);c.clip();c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.5),0.3*k);c.lineWidth=2.2;c.lineCap="round";
  c.beginPath();c.moveTo(322,432);c.quadraticCurveTo(334,438,346,433);c.stroke();c.beginPath();c.moveTo(364,466);c.quadraticCurveTo(352,474,346,490);c.stroke();
  c.beginPath();c.moveTo(300,382);c.quadraticCurveTo(330,376,356,380);c.stroke();c.restore();}

/* ---------------------------------------------------------------- the people: specs for ag_person (people.js) */
const SW_SHAWL={widow:sw_shawl([92,84,72],[128,122,118]),daughter:sw_shawl([166,132,126],[30,24,22])};
const SW_FOLK={
  scholar:{key:"sw-scholar",name:"Muhammad ibn Musa al-Khwarizmi",skin:[196,150,112],hair:{style:"cropped",c:[34,28,24]},beard:[40,32,28],
    top:{kind:"overshirt",c:[106,86,70],inner:[228,218,198]},hat:{paint:sw_turban([238,232,218])},breath:0.25},
  widow:{key:"sw-widow",name:"A widow",skin:[204,160,124],hair:{style:"shaved",c:[86,80,78]},top:{kind:"tunic",c:[118,100,94],paint:SW_SHAWL.widow.body},hat:{paint:(c,P)=>{SW_SHAWL.widow.head(c,P);sw_age(c,P,1);}},breath:0.3},
  son:{key:"sw-son",name:"Her son",skin:[194,148,112],hair:{style:"side",c:[30,26,24]},top:{kind:"tunic",c:[146,128,100]},breath:0.31},
  daughter:{key:"sw-daughter",name:"Her daughter",skin:[202,156,120],hair:{style:"shaved",c:[30,24,22]},top:{kind:"tunic",c:[176,154,120],paint:SW_SHAWL.daughter.body},hat:{paint:SW_SHAWL.daughter.head},breath:0.33},
  reckoner:{key:"sw-reckoner",name:"A reckoner",skin:[184,136,100],hair:{style:"cropped",c:[150,146,140]},beard:[168,162,154],top:{kind:"overshirt",c:[122,108,90],inner:[222,212,192]},
    hat:{paint:(c,P)=>{sw_turban([212,198,172])(c,P);sw_age(c,P,0.8);}},breath:0.24},
  reckoner2:{key:"sw-reckoner2",name:"Another reckoner",skin:[212,170,134],hair:{style:"side",c:[42,34,28]},beard:[46,36,30],top:{kind:"overshirt",c:[142,122,100],inner:[232,224,206]},
    hat:{paint:sw_cap([64,58,54])},breath:0.28}
};

/* ---------------------------------------------------------------- things on the tables and pages, drawn live */
// a low wooden table, its front edge's top at (x, y), w wide, its top receding d up the frame; o.a
function sw_table(ctx,x,y,w,d,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+w/2-14,y+70,w*0.56,30,0.3);
  let g=ctx.createLinearGradient(0,y-d,0,y);g.addColorStop(0,rgba(mix(SW_PAL.woodHi,[255,240,214],0.1),1));g.addColorStop(1,rgba(SW_PAL.woodHi,1));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x+d*0.3,y-d);ctx.lineTo(x+w-d*0.3,y-d);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(255,240,214,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.stroke();
  g=ctx.createLinearGradient(0,y,0,y+26);g.addColorStop(0,rgba(SW_PAL.wood,1));g.addColorStop(1,rgba(ag_dk(SW_PAL.wood,0.3),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,26);
  ctx.fillStyle=rgba(ag_dk(SW_PAL.wood,0.25),1);for(const lx of [x+18,x+w-48])ctx.fillRect(lx,y+26,30,60);ctx.restore();}
// a sheet of working on a table: rows of short ink strokes (decoration, not words), its own layout for each seed; o.blank
function sw_sheet(ctx,x,y,w,h,rot,seed,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);
  ctx.shadowColor="rgba(40,26,14,0.3)";ctx.shadowBlur=10;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=5;ctx.fillStyle=rgba(SW_PAL.paper,1);ctx.fillRect(0,0,w,h);ctx.shadowColor="transparent";
  if(!o.blank){const R=ag_rnd(seed);ctx.strokeStyle=rgba(SW_PAL.ink,0.7);ctx.lineWidth=2;ctx.lineCap="round";const rows=Math.floor((h-24)/18),lay=seed%3;
    for(let r=0;r<rows;r++){let xx=12+(lay===1&&r%3===0?w*0.3:0),yy=18+r*18;const end=w-12-(lay===2?R()*w*0.4:R()*w*0.15);while(xx<end){const L=6+R()*22;ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx+L,yy+(R()-0.5)*2);ctx.stroke();xx+=L+5+R()*6;}}
}
  ctx.restore();}
// a closed book: a leather cover with a tooled border, its pages' edge showing; (x, y) its top left, w by h; col the leather
function sw_codex(ctx,x,y,w,h,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+w/2-6,y+h+4,w*0.6,10,0.35);
  ag_soft(ctx,c=>ag_rect(c,x,y,w,h,6),col,mix(col,[255,236,200],0.35),x+w,y,w,null);ctx.fillStyle="rgba(240,226,196,0.9)";ctx.fillRect(x+4,y+h-8,w-8,5);
  ctx.strokeStyle=rgba(ag_dk(col,0.35),0.6);ctx.lineWidth=2;ctx.strokeRect(x+8,y+6,w-16,h-18);ctx.restore();}

/* the drawn square that proves the steps for "a square and ten roots make thirty-nine": a square of unknown side, two strips five wide
   on two of its sides (half the ten roots each), and the corner of five by five that completes it. (x, y) the top left, u the length of
   the unknown side (the side of five is u*5/3, as the root is 3); o.p (0 to 1) draws the square, o.strips, o.corner, o.side (the whole
   side, 8), o.root (the answer, 3), each 0 to 1; o.a. In ink on the page; the labels are the module's words, at least 28 px */
function sw_square(ctx,x,y,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const f=u*5/3,ink=rgba(SW_PAL.ink,0.92);ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.lineJoin="round";
  const drawRect=(rx,ry,rw,rh,p,fill)=>{if(p<=0)return;if(fill){ctx.fillStyle=fill;ctx.globalAlpha*=clamp(p*2,0,1);ctx.fillRect(rx,ry,rw,rh);ctx.globalAlpha/=Math.max(0.001,clamp(p*2,0,1));}
    ctx.strokeStyle=ink;ctx.lineWidth=4;const per=2*(rw+rh),L=per*p;ctx.beginPath();ctx.moveTo(rx,ry);const pts=[[rx+rw,ry],[rx+rw,ry+rh],[rx,ry+rh],[rx,ry]];let left=L,px=rx,py=ry;
    for(const q of pts){const d=Math.hypot(q[0]-px,q[1]-py);if(left>=d){ctx.lineTo(q[0],q[1]);left-=d;px=q[0];py=q[1];}else{ctx.lineTo(px+(q[0]-px)*left/d,py+(q[1]-py)*left/d);break;}}ctx.stroke();};
  const p=o.p||0,st=o.strips||0,co=o.corner||0;
  drawRect(x,y,u,u,p,"rgba(38,102,132,0.08)");
  drawRect(x+u,y,f,u,st,"rgba(38,102,132,0.05)");drawRect(x,y+u,u,f,st,"rgba(38,102,132,0.05)");
  drawRect(x+u,y+u,f,f,co,"rgba(156,100,18,0.12)");
  const lab=(s,lx,ly,al,col)=>{if(al>0.01)ag_T(ctx,s,lx,ly,{w:700,size:30,align:"center",col:col||SW_PAL.ink,a:al});};
  lab("a square",x+u/2,y+u/2+10,ag_in(p,0.7,0.3));lab("5",x+u+f/2,y-16,st);lab("5",x-24,y+u+f/2+10,st);
  lab("25",x+u+f/2,y+u+f/2+10,co,AG.amber);
  const sd=o.side||0;if(sd>0){ctx.strokeStyle=rgba(AG.green,sd);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y+u+f+30);ctx.lineTo(x+u+f,y+u+f+30);ctx.stroke();
    for(const ex of [x,x+u+f]){ctx.beginPath();ctx.moveTo(ex,y+u+f+20);ctx.lineTo(ex,y+u+f+40);ctx.stroke();}lab("8",x+(u+f)/2,y+u+f+74,sd,AG.green);}
  // the answer: the square's own side, 3, marked in green along its left
  const rt=o.root||0;if(rt>0){ctx.strokeStyle=rgba(AG.green,rt);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-30,y);ctx.lineTo(x-30,y+u*ag_eo(rt));ctx.stroke();
    for(const ey of [y,y+u]){ctx.beginPath();ctx.moveTo(x-40,ey);ctx.lineTo(x-20,ey);ctx.stroke();}lab("3",x-64,y+u/2+10,rt,AG.green);}
  ctx.restore();}

// an equation in words, on tiles: parts [[text, side, state, edge, ink, join]] (side 0 left, 1 right; state 1 shown, 0 gone; join, such
// as "+", is drawn before the tile when a tile before it on its side shows), "=" between; centred on (cx, y); o.col the tiles' edge;
// o.noEq leaves the "=" out, to show one side alone
function sw_eq(ctx,cx,y,parts,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const gap=18,pad=26,size=30,jw=46,ws=parts.map(p=>ag_tw(ctx,p[0],{w:700,size})+pad*2),eqW=ag_tw(ctx,"=",{w:700,size:40})+40;
  const L=parts.map((p,i)=>i).filter(i=>parts[i][1]===0),Rr=parts.map((p,i)=>i).filter(i=>parts[i][1]===1);
  // how much each tile's join shows: as much as the tile, and no more than the tiles before it on its side
  const jk=ix=>{let seen=0;return ix.map(i=>{const k=clamp(parts[i][2],0,1),j=parts[i][5]?Math.min(k,seen):0;seen=Math.max(seen,k);return j;});};
  const JL=jk(L),JR=jk(Rr),wid=(ix,J)=>ix.reduce((s,i,n)=>s+(ws[i]+gap)*clamp(parts[i][2],0,1)+jw*J[n],0)-gap;
  const eq=o.noEq?0:eqW;let x=cx-(Math.max(0,wid(L,JL))+eq+Math.max(0,wid(Rr,JR)))/2;ctx.save();ctx.globalAlpha*=a;
  const tile=(i,j)=>{const p=parts[i],k=clamp(p[2],0,1);if(j>0.01){ag_T(ctx,p[5],x+jw*j/2-gap*0.25,y+12,{w:700,size:34,align:"center",a:j*j,col:AG.ink});x+=jw*j;}
    if(k<=0.01)return;const w=ws[i]*k;ag_box(ctx,x,y-34,w,68,16,{edge:p[3]||o.col||null,a:k});
    ag_T(ctx,p[0],x+w/2,y+11,{w:700,size,align:"center",a:k*k,col:p[4]||AG.ink});x+=w+gap*k;};
  L.forEach((i,n)=>tile(i,JL[n]));if(!o.noEq){ag_T(ctx,"=",x+eqW/2-(L.length?gap/2:0),y+14,{w:700,size:40,align:"center"});x+=eqW;}Rr.forEach((i,n)=>tile(i,JR[n]));ctx.restore();}

// the six forms the two moves bring every problem to, in words, as cards in two columns from (x, y); o.lit (index, or -1), o.litA (or
// o.lits {index: 0 to 1} to light more than one), o.a,
// o.k (spring), o.each (each card's own a); returns each card's box
const SW_FORMS=["Squares equal roots","Squares equal numbers","Roots equal numbers","Squares and roots equal numbers","Squares and numbers equal roots","Roots and numbers equal squares"];
function sw_forms(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return[];const cw=520,ch=104,gx=28,gy=24,out=[];
  for(let i=0;i<6;i++){const col=i%2,row=(i/2)|0,bx=x+col*(cw+gx),by=y+row*(ch+gy),lit=o.lits?clamp(o.lits[i]||0,0,1):o.lit===i?(o.litA==null?1:o.litA):0,ai=a*(o.each?o.each[i]:1);out.push({x:bx,y:by,w:cw,h:ch});if(ai<=0.01)continue;
    ctx.save();if(o.k!=null)ag_about(ctx,bx+cw/2,by+ch/2,lerp(0.6,1,clamp(o.k,0,1.2)));
    ag_box(ctx,bx,by,cw,ch,18,{a:ai,edge:lit>0.05?AG.blue:null,edgeA:0.9*lit,glow:lit>0.05?AG.blue:null,glowA:lit});
    ag_T(ctx,String(i+1),bx+30,by+64,{w:500,size:30,f:"mono",col:lit>0.5?AG.blue:AG.mut,a:ai});
    const lines=ag_wrap(ctx,SW_FORMS[i],cw-110,{w:700,size:30});lines.forEach((l,k)=>ag_T(ctx,l,bx+76,by+(lines.length>1?46:64)+k*38,{w:700,size:30,col:lit>0.5?AG.blue:AG.ink,a:ai}));
    ctx.restore();}
  return out;}

/* ---------------------------------------------------------------- boats on the Tigris, drawn live */
// a round boat of woven reed, sealed with pitch, a boatman standing with a long pole; (x, y) where it sits on the water, s its scale
function sw_quffa(ctx,x,y,s,t){const bob=Math.sin(t*1.3)*2*s;ctx.save();ctx.translate(x,y+bob);ctx.scale(s,s);
  ctx.fillStyle="rgba(60,70,70,0.25)";ctx.beginPath();ctx.ellipse(-6,10,96,16,0,0,TAU);ctx.fill();
  ag_soft(ctx,c=>{c.moveTo(-84,-6);c.bezierCurveTo(-84,30,84,30,84,-6);c.closePath();},[64,52,44],[140,120,100],40,0,90,"rgba(0,0,0,0.4)",6);
  ctx.fillStyle="rgb(92,78,64)";ctx.beginPath();ctx.ellipse(0,-6,84,16,0,0,TAU);ctx.fill();ctx.fillStyle="rgb(46,38,32)";ctx.beginPath();ctx.ellipse(0,-4,74,12,0,0,TAU);ctx.fill();
  // the boatman, a small figure in a light tunic and head cloth, the pole slanting into the water
  ag_soft(ctx,c=>{c.moveTo(-10,-8);c.lineTo(-14,-74);c.bezierCurveTo(-14,-92,20,-92,20,-74);c.lineTo(16,-8);c.closePath();},[214,200,176],[245,236,220],16,-70,50,"rgba(60,40,20,0.3)",4);
  ag_soft(ctx,c=>c.arc(3,-102,13,0,TAU),[176,128,94],[220,180,140],8,-106,14,null);ctx.fillStyle="rgb(232,226,212)";ctx.beginPath();ctx.ellipse(1,-111,15,8,0,0,TAU);ctx.fill();
  ctx.strokeStyle="rgb(96,74,52)";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(26,-150);ctx.lineTo(-24,44);ctx.stroke();
  ctx.strokeStyle="rgb(206,192,168)";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(14,-80);ctx.quadraticCurveTo(20,-62,10,-50);ctx.stroke();
  ag_soft(ctx,c=>c.arc(9,-50,4.5,0,TAU),[176,128,94],[220,180,140],8,-52,6,null);ctx.restore();}
// a sailing boat far off, its triangular sail lit from the right
function sw_sail(ctx,x,y,s,t){const bob=Math.sin(t*0.9+1)*1.5*s;ctx.save();ctx.translate(x,y+bob);ctx.scale(s,s);ctx.fillStyle="rgba(60,70,70,0.2)";ctx.beginPath();ctx.ellipse(0,8,110,10,0,0,TAU);ctx.fill();
  ag_soft(ctx,c=>{c.moveTo(-110,-10);c.lineTo(100,-10);c.bezierCurveTo(90,10,60,14,40,14);c.lineTo(-80,14);c.bezierCurveTo(-96,10,-104,0,-110,-10);c.closePath();},[110,80,56],[170,130,96],60,-6,120,"rgba(0,0,0,0.35)",6);
  ctx.strokeStyle="rgb(90,66,46)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(0,-190);ctx.stroke();
  ag_soft(ctx,c=>{c.moveTo(-6,-196);c.bezierCurveTo(60,-150,96,-80,90,-24);c.lineTo(-70,-24);c.bezierCurveTo(-30,-80,-14,-140,-6,-196);c.closePath();},[236,226,204],[255,250,238],70,-90,140,"rgba(90,70,40,0.25)",10);
  ctx.restore();}

/* ===== Skills and workflows: the lab's pieces =====
   The module's room, Jun at his desk on the left, and what this film adds to it:
     sw_jun      the oak desk across the bottom left and Jun behind it, cut at its back edge, his arms down out of sight
     sw_file     a file from the example project, on a card: its path, then its lines (frontmatter in mono, headings, steps), each of
                 which can light up while the voice names it; the card scrolls when the file is longer than it
     sw_slim     a skill folded to what the agent reads of it all the time: its name and the line that says when to use it
     sw_cause    one of the causes met so far: how it shows, what settled it, who decided
     sw_rail     the nightly workflow: fixed steps in order on an oak rail, each idle, running, passed or failed; a step that calls the
                 agent is violet
     sw_chat, sw_note, sw_mail   where answers used to stay: one chat, one note, one email
     sw_clock    the time, on a tag
   Colours keep the module's meanings: blue a tool, a skill or a fixed step; violet the model; orange data coming back; green a check
   that passes; amber one that fails. Words are drawn live with ag_T, at least 28 px, above y 890. */

const SW_LAB={jun:[300,600,1],ring:[1124,476]};
const SW_DESK={x:-80,y:1000,w:800,depth:150};
function sw_jun(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const [jx,jy,js]=SW_LAB.jun,D=SW_DESK;ctx.save();ctx.globalAlpha*=a;
  ag_desk(ctx,D.x,D.y,D.w,{depth:D.depth});
  ag_person(ctx,"jun",jx,jy,js,{t,gaze:o.gaze,nod:o.nod||0,talk:o.talk||0,smile:o.smile||0,cut:D.y-D.depth});
  ctx.restore();}

// the example project's seven skills, as their files have them: the name, and the sentence of its description that says when to use it
// (the description's last, copied exactly, so "…" stands for the sentence before it); the router, the eighth file, is SW_ROUTER
const SW_SKILLS=[
  ["draft-a-model","… Use when a model's grain, contract and tests exist, or should, and the SQL doesn't yet."],
  ["draft-the-conceptual-model","… Use when a new question arrives, or an entity, key or identity rule needs writing down."],
  ["profile-a-source","… Use when a new source or table arrives, or before mapping its keys and codes to the model."],
  ["reconcile-and-diff","… Use before asking an owner to approve a change to the core or the marts."],
  ["review-for-governance","… Use on every pull request that changes models, sources, seeds or conceptual models."],
  ["review-metadata","… Use when docs change, before a release, or when someone asks where a definition lives."],
  ["sync-the-glossary","… Use on the scheduled review, when data governance announces a changed term, or when someone asks where a definition comes from."]];
const SW_RECON=3,SW_ROUTER=["choose-the-skill","… Use at the start of any job in this project, before any other skill."];
// the causes met so far, as the skill's file has them (skills/reconcile-and-diff/SKILL.md); the fourth is added on the night of the film
const SW_CAUSES=[
  {title:"Withdrew after census day",shows:"the count is under the census report.",settled:"they still count, as at census (DEC-PLN-02).",by:"Planning, the wallet app team and Noor."},
  {title:"A degree in no faculty",shows:"students under no faculty, beside a new degree.",settled:"every degree belongs to a faculty; the registrar's office names it.",by:"Mei Tanaka, registrar's office."},
  {title:"A student counted twice",shows:"one person with two learner keys.",settled:"a person decides two keys are one (DEC-STU-04).",by:"Mei Tanaka, registrar's office."},
  {title:"Test records",shows:"records made in one week, dated back months.",settled:"they never count (DEC-SIS-05).",by:"Mei Tanaka, registrar's office, 22 October 2026."}];
// the nightly workflow's fixed steps, in order; "Leave out test records" comes in on the night of the film, after Build
const SW_STEPS_NIGHT=["Build","Count as on census day","Run the tests","Compare with the census report"],SW_NEWSTEP="Leave out test records";
// the lab at night, its lamp in the far left corner, so the workflow's rail runs clear of its shade; sw_night lays the night's light over
// what stands in the room (the agent, the sandbox, a tool), drawn before it; the words and cards come after it, at full contrast
const SW_LAMP=[110,770];AG_PLACES.swNight=c=>ag_paintLab(c,{night:true,lamp:SW_LAMP});
const sw_night=x=>ag_roomLight(x,1,{night:true,lamp:SW_LAMP});
// something made of parts, faded as one: drawn whole into a scratch canvas, then laid on at opacity a. Drawn straight at a part
// opacity, each part fades on its own, and the agent's dark band shows through its sphere like a ghost
function sw_fade(ctx,a,fn){if(a<=0.004)return;if(a>=0.996){fn(ctx);return;}const [bc,bx]=ag_buf("swFade",ctx.canvas.width,ctx.canvas.height);
  bx.setTransform(ctx.getTransform());fn(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}
// the agent, faded as one (o.only "light", its band's glow over the night, is drawn straight)
function sw_model(ctx,x,y,r,o){o=o||{};if(o.only)return ag_model(ctx,x,y,r,o);sw_fade(ctx,o.a==null?1:o.a,c=>ag_model(c,x,y,r,Object.assign({},o,{a:1})));}
// a dashed line from (x0, y0) to (x1, y1) with an arrowhead at its end; curve bends it through the corner (x0, y1)
function sw_link(ctx,x0,y0,x1,y1,col,a,curve){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,0.75);ctx.lineWidth=3;ctx.setLineDash([9,9]);ctx.beginPath();ctx.moveTo(x0,y0);
  let ang;if(curve){ctx.quadraticCurveTo(x0,y1,x1,y1);ang=x1<x0?Math.PI:0;}else{ctx.lineTo(x1,y1);ang=Math.atan2(y1-y0,x1-x0);}ctx.stroke();ctx.setLineDash([]);
  ag_arrowHead(ctx,x1,y1,ang,12,rgba(col,0.85));ctx.restore();}
// a row in a list: its words centred in a slim card; o.dashed (the next one, not met yet), o.edge, o.a, o.k; returns its box
function sw_row(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a,h=76;if(a<=0.01)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,18,{edge:o.edge||null,edgeA:0.85});if(o.dashed)sw_dash(ctx,x,y,w,h,o.edge||AG.blue,1);ag_T(ctx,text,x+28,y+h/2+11,{w:700,size:32});ctx.restore();return{x,y,w,h};}
// a line from a problem, above the six forms, round the right margin to its form b (a card in the right column); a, its opacity
function sw_toForm(ctx,x0,y0,b,a){if(a<=0.01)return;const ex=b.x+b.w+10,ey=b.y+b.h/2,mx=b.x+b.w+86;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.blue,0.75);ctx.lineWidth=3;ctx.setLineDash([9,9]);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.bezierCurveTo(mx,y0,mx,ey,ex+6,ey);ctx.stroke();ctx.setLineDash([]);ag_arrowHead(ctx,ex,ey,Math.PI,12,rgba(AG.blue,0.85));ctx.restore();}
// a card whose words have gone: soft grey lines where they were (an answer, filed away); la, the lines' own opacity
function sw_blank(ctx,x,y,w,h,a,la){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,22,{});la=la==null?1:la;if(la<=0.01){ctx.restore();return;}ctx.globalAlpha*=la;ctx.strokeStyle="rgba(60,50,40,0.26)";ctx.lineWidth=7;ctx.lineCap="round";
  for(const [f,lw] of [[0.4,0.62],[0.64,0.4]]){const ly=y+h*f;ctx.beginPath();ctx.moveTo(x+30,ly);ctx.lineTo(x+30+(w-60)*lw,ly);ctx.stroke();}ctx.restore();}
// a small rail of three steps, as an icon: plain, fixed steps
function sw_miniRail(ctx,cx,cy,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  for(const [c,lw] of [[AG_OAK.dark,8],[AG_OAK.base,5]]){ctx.strokeStyle=rgba(c,1);ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(cx-82,cy);ctx.lineTo(cx+82,cy);ctx.stroke();}
  for(let i=-1;i<=1;i++)ag_box(ctx,cx+i*52-20,cy-20,40,40,10,{edge:AG.blue,edgeA:0.9});ctx.restore();}
// the rail's steps laid out across the frame: n slots from x0 to x1 at y; returns [{x, y, w}]
function sw_slots(n,y,x0,x1){x0=x0==null?220:x0;x1=x1==null?1850:x1;const gap=24,w=(x1-x0-gap*(n-1))/n;return Array.from({length:n},(_,i)=>({x:x0+i*(w+gap),y,w}));}
// a number on a card: its kick, the number large, a line under it; o.num2 and o.m (0 to 1) turn it into another number; o.edge, o.a, o.k
function sw_num(ctx,x,y,w,kick,num,sub,o){o=o||{};const a=o.a==null?1:o.a,h=sub?200:160;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:0.9});
  ag_T(ctx,String(kick).toUpperCase(),x+28,y+52,{w:700,size:28,ls:4,col:o.kickCol||AG.kick});const m=o.num2?clamp(o.m||0,0,1):0;
  if(m<1)ag_T(ctx,num,x+28,y+124,{w:800,size:62,col:AG.ink,a:1-m});if(m>0)ag_T(ctx,o.num2,x+28,y+124,{w:800,size:62,col:o.col2||AG.ink,a:m});
  if(sub)ag_T(ctx,sub,x+28,y+170,{w:500,size:28,col:AG.mut});ctx.restore();return{x,y,w,h};}
// a mark at (x, y): "no" a grey cross (it doesn't fit), "yes" a green tick
function sw_mark(ctx,x,y,kind,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;if(kind==="yes")ag_tick(ctx,x,y,26,rgba(AG.green,1),4.5);
  else{ctx.strokeStyle=rgba(AG.mut,0.95);ctx.lineWidth=4.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-11,y-11);ctx.lineTo(x+11,y+11);ctx.moveTo(x+11,y-11);ctx.lineTo(x-11,y+11);ctx.stroke();}ctx.restore();}
// a dashed edge round a card: a draft, not yet approved
function sw_dash(ctx,x,y,w,h,col,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(col||AG.blue,0.85);ctx.lineWidth=2.6;rr(ctx,x+6,y+6,w-12,h-12,17);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- a file on a card
   lines: [{k, t, hi, a}] k "front" (frontmatter, mono: "key: value", the key in blue), "h1", "h2", "li" (a step), "p", "gap"; t the
   words; hi 0 to 1 lights it (a soft blue band and a bar at its left); a its own fade. The card is w by h from (x, y); its path heads it in
   mono; o.scroll moves the lines up by that many px inside it; o.a, o.k (springs from its centre), o.edge (a colour), o.draft (a dashed
   edge: a draft not yet approved). Returns each line's top, as drawn, in the frame */
const SW_FS={front:{w:500,size:28,f:"mono",lh:40},h1:{w:800,size:36,lh:54},h2:{w:700,size:32,lh:50},li:{w:500,size:28,lh:40},p:{w:500,size:28,lh:40},gap:{lh:18}};
function sw_layout(ctx,lines,inner){return lines.map(l=>{const st=SW_FS[l.k]||SW_FS.p;if(l.k==="gap")return{l,rows:[],h:st.lh};
  const rows=ag_wrap(ctx,l.t,inner-(l.k==="li"?34:0),{w:st.w,size:st.size,f:st.f});return{l,rows,h:rows.length*st.lh+(l.k==="h2"?6:0)};});}
function sw_file(ctx,x,y,w,h,path,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return[];const head=74,inner=w-56,L=sw_layout(ctx,lines,inner),tops=[];
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:0.85});
  if(o.draft){ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(o.edge||AG.blue,0.8);ctx.lineWidth=2.4;rr(ctx,x+6,y+6,w-12,h-12,18);ctx.stroke();ctx.restore();}
  ag_T(ctx,path,x+28,y+48,{w:500,size:28,f:"mono",col:AG.blue});
  ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+head);ctx.lineTo(x+w-24,y+head);ctx.stroke();
  ctx.save();ctx.beginPath();ctx.rect(x+2,y+head+2,w-4,h-head-6);ctx.clip();let yy=y+head+18-(o.scroll||0);
  for(const it of L){const l=it.l,st=SW_FS[l.k]||SW_FS.p,la=l.a==null?1:l.a,hi=clamp(l.hi||0,0,1);tops.push(yy);
    if(la>0.01&&it.rows.length){if(hi>0.01){ctx.fillStyle=rgba(AG.blue,0.1*hi*la);ctx.fillRect(x+14,yy-2,w-28,it.h+2);ctx.fillStyle=rgba(AG.blue,0.85*hi*la);ctx.fillRect(x+14,yy-2,5,it.h+2);}
      it.rows.forEach((r,i)=>{const by=yy+st.size+(st.lh-st.size)/2-4+i*st.lh;
        if(l.k==="front"){const c=r.indexOf(":");if(i===0&&c>0){const key=r.slice(0,c+1);ag_T(ctx,key,x+28,by,{w:500,size:28,f:"mono",col:AG.blue,a:la});
            ag_T(ctx,r.slice(c+1),x+28+ag_tw(ctx,key,{w:500,size:28,f:"mono"}),by,{w:500,size:28,f:"mono",a:la});}else ag_T(ctx,r,x+28,by,{w:500,size:28,f:"mono",a:la});}
        else if(l.k==="li")ag_T(ctx,r,x+28+(i?34:0),by,{w:st.w,size:st.size,a:la});
        else ag_T(ctx,r,x+28,by,{w:st.w,size:st.size,a:la,col:l.k==="h2"?AG.blue:AG.ink});});}
    yy+=it.h*(l.k==="gap"?1:clamp(l.grow==null?1:l.grow,0,1));}
  ctx.restore();
  // a soft fade where the lines leave the card at its foot
  const g=ctx.createLinearGradient(0,y+h-46,0,y+h-6);g.addColorStop(0,"rgba(238,236,231,0)");g.addColorStop(1,"rgba(238,236,231,0.95)");ctx.fillStyle=g;ctx.fillRect(x+4,y+h-46,w-8,40);
  ctx.restore();return tops;}
// the height a file's lines take, laid out at width w
function sw_fileH(ctx,w,lines){return sw_layout(ctx,lines,w-56).reduce((s,it)=>s+it.h,0)+74+36;}

/* ---------------------------------------------------------------- a skill, folded: its name and its line
   o.read 0 to 1 (a soft light passes over it: the agent reads its line), o.lit 0 to 1 (a blue edge: chosen), o.dim, o.a, o.k; o.rows 2
   gives its line two rows (the card is then 142 high, not 104) */
function sw_slim(ctx,x,y,w,name,desc,o){o=o||{};const a=o.a==null?1:o.a,h=o.rows===2?142:104;if(a<=0)return{x,y,w,h};const lit=clamp(o.lit||0,0,1),rd=clamp(o.read||0,0,1);
  ctx.save();ctx.globalAlpha*=a*(1-0.55*(o.dim||0));if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,18,{edge:lit>0.05?AG.blue:null,edgeA:0.9*lit,glow:lit>0.05?AG.blue:null,glowA:lit});
  if(rd>0.01&&rd<0.99){const sx=x+w*rd;const g=ctx.createLinearGradient(sx-120,0,sx+40,0);g.addColorStop(0,rgba(AG.violet,0));g.addColorStop(0.75,rgba(AG.violet,0.12));g.addColorStop(1,rgba(AG.violet,0));
    ctx.save();ctx.beginPath();rr(ctx,x,y,w,h,18);ctx.clip();ctx.fillStyle=g;ctx.fillRect(sx-120,y,160,h);ctx.restore();}
  ag_T(ctx,name,x+26,y+44,{w:500,size:28,f:"mono",col:lit>0.5?AG.blue:AG.ink});
  const mw=w-52,cut=d=>{if(ag_tw(ctx,d,{w:500,size:28})<=mw)return d;while(d.length>4&&ag_tw(ctx,d+"…",{w:500,size:28})>mw)d=d.slice(0,-1);return d.replace(/[ ,.;:]+$/,"")+"…";};
  if(o.rows===2){const L=ag_wrap(ctx,desc,mw,{w:500,size:28});ag_T(ctx,L[0],x+26,y+84,{w:500,size:28,col:AG.mut});if(L[1])ag_T(ctx,cut(L.slice(1).join(" ")),x+26,y+122,{w:500,size:28,col:AG.mut});}
  else ag_T(ctx,cut(desc),x+26,y+84,{w:500,size:28,col:AG.mut});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a cause met so far
   c {title, shows, settled, by}: three lines under its title; o.parts 0 to 3 (how many lines show), o.mark ("no": a grey cross, it doesn't
   fit; "yes": a green tick) with o.markA, o.edge, o.dashed (a new one, still a draft), o.a, o.k; returns its box */
function sw_causeH(ctx,w,c){const L=[["Shows",c.shows],["Settled",c.settled],["Decided by",c.by]];let n=0;for(const [k,v] of L)n+=ag_wrap(ctx,k+": "+v,w-56,{w:500,size:28}).length;return 28+44+n*38+22;}
function sw_cause(ctx,x,y,w,c,o){o=o||{};const a=o.a==null?1:o.a,h=sw_causeH(ctx,w,c);if(a<=0)return{x,y,w,h};const parts=o.parts==null?3:o.parts;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,18,{edge:o.edge||null,edgeA:0.85});
  if(o.dashed){ctx.save();ctx.setLineDash([10,9]);ctx.strokeStyle=rgba(o.edge||AG.blue,0.8);ctx.lineWidth=2.2;rr(ctx,x+5,y+5,w-10,h-10,14);ctx.stroke();ctx.restore();}
  ag_T(ctx,c.title,x+28,y+28+32,{w:700,size:32});let yy=y+28+44;
  [["Shows",c.shows],["Settled",c.settled],["Decided by",c.by]].forEach(([k,v],i)=>{const rows=ag_wrap(ctx,k+": "+v,w-56,{w:500,size:28}),pa=clamp(parts-i,0,1);
    rows.forEach((r,j)=>{if(pa>0.01){if(j===0){const kw=ag_tw(ctx,k+":",{w:700,size:28});ag_T(ctx,k+":",x+28,yy+30,{w:700,size:28,col:AG.mut,a:pa});ag_T(ctx,r.slice(k.length+1),x+28+kw,yy+30,{w:500,size:28,a:pa});}
      else ag_T(ctx,r,x+28,yy+30,{w:500,size:28,a:pa});}yy+=38;});});
  const mA=o.markA==null?1:o.markA;if(o.mark&&mA>0.01){const mx=x+w-44,my=y+46;ctx.save();ctx.globalAlpha*=mA;
    if(o.mark==="yes")ag_tick(ctx,mx,my,26,rgba(AG.green,1),4.5);else{ctx.strokeStyle=rgba(AG.mut,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(mx-10,my-10);ctx.lineTo(mx+10,my+10);ctx.moveTo(mx+10,my-10);ctx.lineTo(mx-10,my+10);ctx.stroke();}
    ctx.restore();}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the nightly workflow
   steps [{x, y, w, num, label, state, a, k, test}] on one rail: state 0 idle, 1 running (a blue light), 2 passed (green, a tick),
   3 failed (amber), 4 the agent's step (violet); test 0 to 1 hangs a small "test" tag under it. o.p 0 to 1 draws the rail; o.a */
function sw_rail(ctx,steps,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||!steps.length)return;ctx.save();ctx.globalAlpha*=a;const h=124,p=o.p==null?1:o.p;
  const y=steps[0].y+h/2,x0=steps[0].x-30,x1=steps[steps.length-1].x+steps[steps.length-1].w+30,xe=lerp(x0,x1,ag_sine(p));
  if(p>0){ctx.lineCap="round";ctx.strokeStyle=rgba(AG.shadow,0.14);ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(x0+AG.sdx,y+10);ctx.lineTo(xe+AG.sdx,y+10);ctx.stroke();
    ctx.strokeStyle=rgba(AG_OAK.dark,1);ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(xe,y);ctx.stroke();ctx.strokeStyle=rgba(AG_OAK.base,1);ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(xe,y);ctx.stroke();
    ctx.strokeStyle=rgba(AG_OAK.hi,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y-3);ctx.lineTo(xe,y-3);ctx.stroke();}
  for(const s of steps){const sa=s.a==null?1:s.a;if(sa<=0.01)continue;const col=s.state===2?AG.green:s.state===3?AG.amber:s.state===4?AG.violet:s.state===1?AG.blue:null;
    ctx.save();ctx.globalAlpha*=sa;if(s.k!=null)ag_about(ctx,s.x+s.w/2,s.y+h/2,lerp(0.6,1,clamp(s.k,0,1.2)));
    ag_box(ctx,s.x,s.y,s.w,h,20,{edge:col,edgeA:0.9,glow:s.state===1||s.state===4?col:null,glowA:s.state===1||s.state===4?0.8:0});
    ag_T(ctx,String(s.num),s.x+26,s.y+46,{w:500,size:28,f:"mono",col:col||AG.blue});
    const rows=ag_wrap(ctx,s.label,s.w-40,{w:700,size:30});rows.slice(0,2).forEach((r,i)=>ag_T(ctx,r,s.x+26,s.y+(rows.length>1?82:90)+i*34,{w:700,size:30,col:s.state===4?AG.violet:AG.ink}));
    if(s.state===2)ag_tick(ctx,s.x+s.w-38,s.y+38,24,rgba(AG.green,1),4);else if(s.state===3)ag_warn(ctx,s.x+s.w-38,s.y+38,30,rgba(AG.amber,1));
    if(s.test>0.01)ag_pill(ctx,s.x+s.w/2,s.y+h+44,"with a test",{col:AG.green,icon:"tick",a:s.test,size:28});
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- where an answer used to stay */
// a chat: a window with two bubbles, the person's (o.ask, its words, if given) and the agent's (its edge violet); o.a, o.k, o.label
// (on a tag under it)
function sw_chat(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,18,{});ctx.fillStyle="rgba(60,50,40,0.08)";ctx.fillRect(x+2,y+2,w-4,30);for(let i=0;i<3;i++){ctx.fillStyle="rgba(60,50,40,0.25)";ctx.beginPath();ctx.arc(x+22+i*18,y+17,5,0,TAU);ctx.fill();}
  if(o.ask){ag_box(ctx,x+20,y+50,w-40,66,14,{});ag_T(ctx,o.ask,x+42,y+93,{w:700,size:28,col:AG.ink});ag_box(ctx,x+w*0.2,y+134,w*0.76,h-134-22,14,{edge:AG.violet,edgeA:0.5});
    ctx.strokeStyle="rgba(60,50,40,0.3)";ctx.lineWidth=3;ctx.lineCap="round";for(const [f,lw] of [[0.3,0.56],[0.5,0.62],[0.7,0.4]]){const ly=y+134+(h-156)*f;ctx.beginPath();ctx.moveTo(x+w*0.2+22,ly);ctx.lineTo(x+w*0.2+22+w*lw,ly);ctx.stroke();}
    ctx.restore();if(o.label)ag_label(ctx,x+w/2,y+h+50,o.label,{align:"center",col:AG.mut,a});return;}
  ag_box(ctx,x+20,y+50,w*0.62,h*0.24,14,{});ag_box(ctx,x+w*0.32,y+60+h*0.28,w*0.6,h*0.26,14,{edge:AG.violet,edgeA:0.5});
  ctx.strokeStyle="rgba(60,50,40,0.3)";ctx.lineWidth=3;ctx.lineCap="round";for(const [lx,ly,lw] of [[x+36,y+50+h*0.1,w*0.4],[x+w*0.32+16,y+60+h*0.38,w*0.4],[x+w*0.32+16,y+60+h*0.46,w*0.28]]){ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+lw,ly);ctx.stroke();}
  ctx.restore();if(o.label)ag_label(ctx,x+w/2,y+h+50,o.label,{align:"center",col:AG.mut,a});}
// a note: a square of paper, a little turned, its corner folded
function sw_note(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+w/2);ctx.rotate(-0.04);if(o.k!=null){const s=lerp(0.6,1,clamp(o.k,0,1.2));ctx.scale(s,s);}ctx.translate(-w/2,-w/2);
  ctx.shadowColor=AG.card.shadow;ctx.shadowBlur=26;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=12;ctx.fillStyle="#EFE6C8";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(w,0);ctx.lineTo(w,w-34);ctx.lineTo(w-34,w);ctx.lineTo(0,w);ctx.closePath();ctx.fill();
  ctx.shadowColor="transparent";ctx.fillStyle="#D9CDA8";ctx.beginPath();ctx.moveTo(w,w-34);ctx.lineTo(w-34,w-34);ctx.lineTo(w-34,w);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(60,50,40,0.35)";ctx.lineWidth=3;ctx.lineCap="round";for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(24,36+i*30);ctx.lineTo(w-30-(i%2)*30,36+i*30);ctx.stroke();}
  ctx.restore();if(o.label)ag_label(ctx,x+w/2,y+w+50,o.label,{align:"center",col:AG.mut,a});}
// an email: an envelope
function sw_mail(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=w*0.64;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,12,{});ctx.strokeStyle="rgba(60,50,40,0.3)";ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x+8,y+8);ctx.lineTo(x+w/2,y+h*0.56);ctx.lineTo(x+w-8,y+8);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+8,y+h-8);ctx.lineTo(x+w*0.4,y+h*0.46);ctx.moveTo(x+w-8,y+h-8);ctx.lineTo(x+w*0.6,y+h*0.46);ctx.stroke();ctx.restore();
  if(o.label)ag_label(ctx,x+w/2,y+h+50,o.label,{align:"center",col:AG.mut,a});}

// the time on a tag, with a small clock face; (x, y) its centre
function sw_clock(ctx,x,y,text,a){if(a<=0.01)return;const b=ag_pill(ctx,x,y,text,{a,size:30,icon:"clock"});ctx.save();ctx.globalAlpha*=a;const cx=b.x+40,cy=y;
  ctx.strokeStyle=rgba(AG.ink,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,13,0,TAU);ctx.stroke();ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,cy-8);ctx.moveTo(cx,cy);ctx.lineTo(cx+6,cy+2);ctx.stroke();ctx.restore();}

/* ===== Skills and workflows: the seven chapters =====
   Each chapter is a few shots, in the places of sw_past.js and the module's lab, cut together with short dissolves (sw_shots); a shot
   that shows the same place or people as the one before comes in on a cut. Times inside a chapter come from its cues and the words of
   its lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on cards, labels and pills, at least
   28 px as seen, and above the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const sw_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the shared ag_shots, with a dissolve of each shot's own (sh.dis, seconds; 0.5 by default); a shot marked cut comes in on a cut
function sw_shots(ctx,S,t,end,shots){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;
  const dis=i>0?(shots[i].dis||0.5):0.5,u=i>0&&!shots[i].cut?clamp((t-shots[i].at)/dis,0,1):1,till=k=>shots[k+1]?shots[k+1].at:end;
  if(u<1){ag_shot(ctx,S,t,shots[i-1],shots[i].at);const [bc,bx]=ag_buf("cut",ctx.canvas.width,ctx.canvas.height);ag_shot(bx,S,t,shots[i],till(i));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ease(u);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
  else ag_shot(ctx,S,t,shots[i],till(i));return i;}
// a card that springs in at t0 and goes at t1 (or stays): its k and a
const sw_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
const SW_TITLE="Skills and workflows";
// the film's kicker over the lab's chapters, in the frame's own coordinates
function sw_kick(ctx,S,a,dark){if(a<=0.01)return;setScreen(ctx,S);ag_kicker(ctx,"2.2",SW_TITLE,{a,dark});}
// a value of each shot (f), blended across the dissolve into the shot on screen at t, as sw_shots blends their pictures
function sw_mix(shots,t,f){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;const sh=shots[i];if(i===0||sh.cut)return f(sh);
  return lerp(f(shots[i-1]),f(sh),ease(clamp((t-sh.at)/(sh.dis||0.5),0,1)));}
// a person drawn whole, then laid on the picture at a: a person fading in or out never shows through themselves
function sw_whole(ctx,a,fn){if(a<=0.004)return;if(a>=0.996){fn(ctx);return;}ctx.save();ctx.globalAlpha*=a;fn(ctx);ctx.restore();}

// the shares of the estate in the courtyard's wide shot: where each heir stands, and their card
const SW_HEIRS=[{who:"widow",x:1200,y:705,s:0.8,kick:"Widow",title:"an eighth",sub:"120 dirhams"},
  {who:"son",x:1450,y:690,s:0.84,kick:"Son",title:"two parts",sub:"560 dirhams"},
  {who:"daughter",x:1700,y:712,s:0.8,kick:"Daughter",title:"one part",sub:"280 dirhams"}];
const SW_CARDW=236;
function sw_family(x,tt,o){o=o||{};for(const k of [2,1,0]){const h=SW_HEIRS[k];ag_person(x,SW_FOLK[h.who],h.x,h.y,h.s,{t:tt+k*1.3,flip:true,gaze:o.gaze||[2,0.4]});}}
function sw_reckonerAt(x,tt,who,px,o){o=o||{};sw_table(x,px-290,960,560,120);ag_person(x,SW_FOLK[who],px,730,0.84,{t:tt,flip:!!o.flip,cut:840,gaze:o.gaze||[2,0.6]});
  const R=ag_rnd(px);for(let i=0;i<(o.sheets==null?2:o.sheets);i++)sw_sheet(x,px-250+i*190,872+R()*6,150,86,(R()-0.5)*0.2,(px+i*7)|0);
  if(o.book)sw_codex(x,px+40,870,120,74,[120,72,52],{a:o.book});}

// ---- 1 · Completion and balancing: Baghdad about 820; the sums of every day, the law's shares; each problem on its own, a slip, two
// answers; al-Khwarizmi's book: two moves, six forms, steps, an example, a drawn square; real cases; anyone, the same way; copied, into
// Latin, two words; today's data teams; solve it once ----
scene("book",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    sums:["Estates","legacies","fields","lawsuits","trade","land","canals"].map(w=>wAt(sc,"kinds",w)),
    court:c.law-0.5,heir:wAt(sc,"law","each heir"),legacy:wAt(sc,"law","legacy"),outside:wAt(sc,"law","outside"),
    own:c.own-0.4,tricks:wAt(sc,"own","own tricks"),newk:wAt(sc,"own","new kind"),nothing:wAt(sc,"own","nothing"),
    slip:c.slip-0.4,slipW:wAt(sc,"slip","slip"),less:wAt(sc,"slip","less"),
    two:c.two-0.4,tw1:wAt(sc,"two","two reckoners"),tw2:wAt(sc,"two","two answers"),
    study:c.writes-0.6,caliph:c.writes,khw:wAt(sc,"writes","Muhammad"),book:wAt(sc,"writes","short book"),require:wAt(sc,"require","constantly"),
    moves:c.moves-0.5,comp:wAt(sc,"moves","completion"),bal:wAt(sc,"moves","balancing"),six:wAt(sc,"moves","six forms"),
    steps:wAt(sc,"steps","steps"),example:wAt(sc,"steps","example"),drawn:wAt(sc,"steps","drawn square"),
    ex1:c.ex1,halve:wAt(sc,"ex2","Halve"),mult:wAt(sc,"ex2","Multiply"),add:wAt(sc,"ex2","Add"),root:wAt(sc,"ex2","Take its root"),away:wAt(sc,"ex2","Take away"),
    cases:c.cases-0.3,legs:wAt(sc,"cases","legacies"),
    anyone:c.anyone-0.4,never:wAt(sc,"anyone","never seen"),same:wAt(sc,"anyone","same way"),
    latin:c.latin-0.4,copied:wAt(sc,"latin","copied"),lat:wAt(sc,"latin","Latin"),year:wAt(sc,"latin","eleven forty-five"),
    words:c.words-0.3,jabr:wAt(sc,"words","al-jabr"),algebra:wAt(sc,"words","algebra"),name:wAt(sc,"words","his own name"),algo:wAt(sc,"words","algorithm"),
    lab:c.data-0.5,chat1:wAt(sc,"data","one chat"),again:wAt(sc,"data","solved again"),nothingD:wAt(sc,"data","from nothing"),
    once:c.reuse,write:wAt(sc,"reuse","write it down"),every:wAt(sc,"reuse","every agent"),
    title:c.breath+0.2}));
  const shots=[
    // the Tigris in the morning: the round boat crossing, a sail far off; the sums of every day, one by one, over the city
    {at:0,place:"swRiver",keys:[[0,880,540,1.04],[0.1,1040,520,1.08]],d:14,push:0.01,draw:(x,tt)=>{
      sw_sail(x,1560-tt*6,600,0.7,tt);sw_quffa(x,640+tt*9,664,0.9,tt);
      const L=[["Estates shared",330,300],["Legacies",640,226],["Fields divided",960,300],["Lawsuits",1250,214],["Trade",1560,290],["Land measured",820,412],["Canals dug",1180,420]];
      L.forEach(([s,px,py],i)=>{const p=sw_pop(tt,P.sums[i]-0.15,P.court-0.3);if(p.a>0.01){x.save();ag_about(x,px,py,lerp(0.6,1,p.k));ag_pill(x,px,py,s,{a:p.a,size:30});x.restore();}});}},
    // a house's courtyard: a family, a reckoner at his table; the estate, and the law's share for each heir; a legacy can go outside
    {at:P.court,place:"swCourt",dis:0.7,keys:[[P.court,980,540,1.0],[P.court+0.1,1000,530,1.03]],d:6,push:0.01,draw:(x,tt)=>{
      sw_reckonerAt(x,tt,"reckoner",470,{});sw_family(x,tt,{gaze:[2,0.2]});ag_roomLight(x,0.5);
      const e=sw_pop(tt,P.court+0.5,null);ag_textCard(x,640,130,400,{kick:"The estate",title:"960 dirhams"},{k:e.k,a:e.a,kickCol:SW_PAL.tag});
      SW_HEIRS.forEach((h,i)=>{const p=sw_pop(tt,P.heir+0.25*i,null);ag_textCard(x,h.x-SW_CARDW/2,236,SW_CARDW,{kick:h.kick,title:h.title,sub:h.sub},{tail:{side:"bottom",at:0.5,px:h.x,py:h.y-262*h.s},k:p.k,a:p.a,kickCol:SW_PAL.tag});});
      const lg=sw_pop(tt,P.legacy,null);ag_textCard(x,640,400,400,{kick:"A legacy can leave",title:"up to a third",sub:"to someone outside the family"},{k:lg.k,a:lg.a,kickCol:SW_PAL.tag});}},
    // close on the reckoner: each problem on its own sheet, each worked its own way; a new kind, a blank sheet
    {cut:true,at:P.own,place:"swCourt",keys:[[P.own,500,736,1.42],[P.own+0.1,520,740,1.46]],d:5,push:0.01,draw:(x,tt)=>{
      sw_table(x,180,960,560,120);ag_person(x,SW_FOLK.reckoner,470,730,0.84,{t:tt,cut:840,gaze:[2,1.2],nod:0.04});
      [[220,872,-0.12,3],[372,866,0.06,4],[520,874,-0.04,5]].forEach(([sx,sy,r,sd],i)=>sw_sheet(x,sx,sy,140,84,r,sd,{a:ag_in(tt,P.own+0.2+i*0.5,0.4)}));
      const nb=ag_in(tt,P.newk-0.1,0.6);if(nb>0)sw_sheet(x,lerp(820,650,ag_eo(nb)),842,140,84,0.1,9,{blank:true,a:nb});
      const p=sw_pop(tt,P.nothing-0.1,null);x.save();ag_about(x,870,600,lerp(0.6,1,p.k));ag_pill(x,870,600,"a new kind: from nothing",{col:AG.amber,icon:"warn",a:p.a,size:28});x.restore();}},
    // the family again: one slip, and the daughter's share comes out less than the law gives her
    {cut:true,at:P.slip,place:"swCourt",keys:[[P.slip,1300,560,1.12],[P.slip+0.1,1320,560,1.15]],d:5,push:0.01,draw:(x,tt)=>{
      sw_reckonerAt(x,tt,"reckoner",470,{});sw_family(x,tt,{gaze:[2,0.2]});ag_roomLight(x,0.5);
      const sl=ag_in(tt,P.less-0.2,0.5);
      SW_HEIRS.forEach((h,i)=>{const d=i===2;ag_textCard(x,h.x-SW_CARDW/2,236,SW_CARDW,{kick:h.kick,title:h.title,sub:d&&sl>0.5?"240 dirhams":h.sub},{tail:{side:"bottom",at:0.5,px:h.x,py:h.y-262*h.s},edge:d&&sl>0.5?AG.amber:null,kickCol:SW_PAL.tag});});
      const p=sw_pop(tt,P.less+0.1,null);ag_pill(x,1620,188,"less than the law gives her",{col:AG.amber,icon:"warn",a:p.a,size:28});}},
    // two reckoners, one estate, two answers
    {cut:true,at:P.two,place:"swCourt",keys:[[P.two,960,560,1.02],[P.two+0.1,960,550,1.06]],d:6,push:0.01,draw:(x,tt)=>{
      sw_reckonerAt(x,tt,"reckoner",560,{gaze:[3,0.4]});sw_reckonerAt(x,tt+2,"reckoner2",1400,{flip:true,gaze:[3,0.4]});ag_roomLight(x,0.5);
      const p1=sw_pop(tt,P.tw1,null),p2=sw_pop(tt,P.tw1+0.4,null);
      ag_textCard(x,300,190,470,{kick:"One reckoner",title:"Her share: 280 dirhams"},{tail:{side:"bottom",at:0.6,px:580,py:470},k:p1.k,a:p1.a,kickCol:SW_PAL.tag});
      ag_textCard(x,1150,190,470,{kick:"Another reckoner",title:"Her share: 240 dirhams"},{tail:{side:"bottom",at:0.4,px:1380,py:470},k:p2.k,a:p2.a,kickCol:SW_PAL.tag});
      const v=ag_in(tt,P.tw2,0.5);ag_verdict(x,960,560,"two answers for one estate","fail",v);}},
    // the House of Wisdom: al-Khwarizmi, his book in his hand; his name, and what the book is for, in his words
    {at:P.study,place:"swStudy",dis:0.8,keys:[[P.study,900,560,1.0],[P.study+0.1,920,540,1.05]],d:8,push:0.012,draw:(x,tt)=>{
      ag_person(x,SW_FOLK.scholar,700,650,1.0,{t:tt,pose:"hold",gaze:[3,0],holdBack:(c,h)=>sw_codex(c,h.near[0]-34,h.near[1]-112,128,160,[118,70,50])});ag_roomLight(x,0.4);
      const p0=sw_pop(tt,P.caliph+0.1,null);ag_pill(x,1360,150,"Encouraged by the caliph",{a:p0.a,size:28});
      const p1=sw_pop(tt,P.khw-0.1,null);ag_textCard(x,1020,230,700,{kick:"A scholar of the House of Wisdom",title:"Muhammad ibn Musa al-Khwarizmi"},{k:p1.k,a:p1.a,kickCol:SW_PAL.tag});
      const p2=sw_pop(tt,P.require-0.8,null);ag_textCard(x,1020,440,700,{kick:"His short book, in his words",title:"“such as men constantly require”",sub:"in inheritance, legacies, partition, lawsuits and trade"},{k:p2.k,a:p2.a,kickCol:SW_PAL.tag});}},
    // the book open: two moves bring a problem to its form; the six forms
    {at:P.moves,place:"swBook",dis:0.7,keys:[[P.moves,960,520,1.0],[P.moves+0.1,960,510,1.02]],d:6,push:0.01,draw:(x,tt)=>sw_moves(x,tt,P)},
    // one form's steps, an example, and the square drawn on the page as each step is said
    {cut:true,at:P.steps-0.3,place:"swBook",keys:[[P.steps-0.3,960,500,1.0],[P.steps,960,490,1.03]],d:8,push:0.01,draw:(x,tt)=>sw_steps(x,tt,P)},
    // pages of real cases, legacies most of all
    {cut:true,at:P.cases,place:"swBook",keys:[[P.cases,960,500,1.03],[P.cases+0.1,960,500,1.06]],d:4,push:0.01,draw:(x,tt)=>{
      const turn=ag_sine(clamp((tt-P.cases)/1.0,0,1));if(turn<1)sw_pageTurn(x,turn);
      const p=sw_pop(tt,P.legs-0.2,null);ag_textCard(x,560,300,800,{kick:"Legacies",title:"A man dies, leaving two sons, and leaves a third of his capital to a stranger.",sub:"How much does each one get?"},{k:p.k,a:p.a,kickCol:SW_PAL.tag});}},
    // the two reckoners again, each with the book: the same steps, the same answer
    {at:P.anyone,place:"swCourt",dis:0.6,keys:[[P.anyone,960,560,1.02],[P.anyone+0.1,960,550,1.06]],d:6,push:0.01,draw:(x,tt)=>{
      sw_reckonerAt(x,tt,"reckoner",560,{gaze:[3,0.8],book:1,sheets:1});sw_reckonerAt(x,tt+2,"reckoner2",1400,{flip:true,gaze:[3,0.8],book:1,sheets:1});ag_roomLight(x,0.5);
      const p1=sw_pop(tt,P.anyone+0.6,null),p2=sw_pop(tt,P.anyone+1.0,null);
      ag_textCard(x,300,190,470,{kick:"One reckoner",title:"Her share: 280 dirhams"},{tail:{side:"bottom",at:0.6,px:580,py:470},k:p1.k,a:p1.a,edge:AG.green,icon:"tick",kickCol:SW_PAL.tag});
      ag_textCard(x,1150,190,470,{kick:"Another reckoner",title:"Her share: 280 dirhams"},{tail:{side:"bottom",at:0.4,px:1380,py:470},k:p2.k,a:p2.a,edge:AG.green,icon:"tick",kickCol:SW_PAL.tag});
      const v=ag_in(tt,P.same-0.2,0.5);ag_verdict(x,960,560,"the same steps, the same answer","pass",v);}},
    // copied for centuries: copies of the book along the years from about 820; then into Latin, in Segovia in 1145
    {at:P.latin,place:"swWood",dis:0.6,keys:[[P.latin,960,540,1.0],[P.latin+0.1,960,530,1.04]],d:6,push:0.01,draw:(x,tt)=>sw_copies(x,tt,P)},
    // two words: al-jabr, algebra; al-Khwarizmi, algorithm
    {at:P.words,place:"swWood",cut:true,keys:[[P.words,960,540,1.04],[P.words+0.1,960,540,1.07]],d:5,push:0.01,draw:(x,tt)=>{
      const row=(y,a0,a1,kick,from,to)=>{const p=sw_pop(tt,a0,null),q=sw_pop(tt,a1,null);ag_textCard(x,330,y,520,{kick,title:from},{k:p.k,a:p.a,kickCol:SW_PAL.tag});
        if(q.a>0.01){x.save();x.globalAlpha*=q.a;x.strokeStyle="rgba(238,228,208,0.8)";x.lineWidth=4;x.lineCap="round";x.beginPath();x.moveTo(880,y+66);x.lineTo(1036,y+66);x.stroke();ag_arrowHead(x,1052,y+66,0,14,"rgba(238,228,208,0.9)");x.restore();}
        ag_textCard(x,1090,y,500,{kick:"The word",title:to},{k:q.k,a:q.a,kickCol:AG.kick});};
      row(250,P.jabr-0.2,P.algebra-0.1,"His book's first move","al-jabr","algebra");
      row(500,P.name-0.2,P.algo-0.1,"His own name","al-Khwarizmi","algorithm");}},
    // today: a data team's job, solved in one chat, then again in the next, from nothing; then written down once, and every agent reads it
    {at:P.lab,place:"lab",dis:0.8,keys:[[P.lab,960,540,1.0],[P.lab+0.1,960,530,1.03]],d:8,push:0.01,draw:(x,tt)=>sw_reuse(x,tt,P)},
    // the book's square again, settling under the title
    {at:c.breath-0.6,place:"swBook",dis:0.9,keys:[[c.breath-0.6,960,500,1.06],[c.breath-0.5,960,500,1.1]],d:4,push:0.01,draw:(x,tt)=>{
      sw_square(x,760,270,150,{p:1,strips:1,corner:1,side:1,root:1});}}
  ];
  sw_shots(ctx,S,t,sc.dur,shots);const dk=sw_mix(shots,t,sh=>sh.place==="swBook"||sh.place==="swWood"?1:0);
  sw_place(ctx,S,"Baghdad · about 820",ag_io(t,0.5,P.latin-0.2,0.6),dk);
  sw_place(ctx,S,"Today",ag_io(t,P.lab+0.4,c.breath-0.6,0.5),0);
  ag_title(ctx,S,t,P.title,SW_TITLE,null,"AGENTS AT WORK ON DATA · FILM 2 OF 9");});

// the two moves, each on one of the book's own kinds of example, on cards over the open book: completion takes what is subtracted to
// the other side ("a square equals forty roots less four squares": five squares equal forty roots); balancing takes the same from both
// sides ("a square and fourteen roots equal thirty-nine and four roots": a square and ten roots equal thirty-nine); then the six forms,
// and the balanced problem goes to its own, the fourth, whose steps come next
function sw_moves(x,tt,P){const ca=ag_io(tt,P.comp-0.4,P.six-0.55,0.3),ba=ag_io(tt,P.bal-0.3,P.six-0.55,0.3);
  if(ca>0.01){ag_box(x,330,190,1260,200,22,{a:ca});ag_label(x,370,246,"Completion",{col:AG.blue,a:ca});
    const m=ag_in(tt,P.comp+0.5,0.5);
    sw_eq(x,960,320,[["a square",0,1-m],["5 squares",0,m,AG.blue],["40 roots",1,1],["less 4 squares",1,1-m,AG.amber]],{a:ca});}
  if(ba>0.01){ag_box(x,330,430,1260,200,22,{a:ba});ag_label(x,370,486,"Balancing",{col:AG.blue,a:ba});
    const m=ag_in(tt,P.bal+0.6,0.5);
    sw_eq(x,960,560,[["a square",0,1],["14 roots",0,1-m,AG.amber,null,"+"],["10 roots",0,m,AG.blue,null,"+"],["39",1,1],["4 roots",1,1-m,AG.amber,null,"+"]],{a:ba});}
  const fa=ag_in(tt,P.six-0.25,0.45);if(fa>0.01){const lit=ag_in(tt,P.six+1.1,0.5),boxes=sw_forms(x,426,300,{a:fa,k:ag_spr(tt,P.six-0.25,0.8),lit:3,litA:lit});
    ag_label(x,960,266,"Six forms",{align:"center",col:AG.blue,a:fa});
    const da=ag_in(tt,P.six-0.1,0.4);if(da>0.01){sw_eq(x,1265,190,[["a square",0,1],["10 roots",0,1,null,null,"+"],["39",1,1]],{a:da,col:AG.blue});
      sw_toForm(x,1578,190,boxes[3],ag_in(tt,P.six+0.4,0.7)*da);}}}
// one form's steps on a card on the left page; the example; the square drawn on the right page as each step is said
const SW_STEPS=[["Halve the roots","5"],["Multiply it by itself","25"],["Add the numbers","64"],["Take its root","8"],["Take away the half","3"]];
function sw_steps(x,tt,P){const B=SW_BOOK;
  // the form, lit, at the top of the left page
  ag_textCard(x,360,150,560,{kick:"Form 4",title:"Squares and roots equal numbers"},{edge:AG.blue,kickCol:AG.blue,a:ag_in(tt,P.steps-0.3,0.4)});
  const times=[P.halve,P.mult,P.add,P.root,P.away];
  SW_STEPS.forEach(([s,v],i)=>{const a=ag_in(tt,P.steps+0.2+i*0.25,0.4);if(a<=0.01)return;const y=370+i*74,on=ag_io(tt,times[i]-0.1,times[i+1]?times[i+1]-0.1:1e9,0.25);
    ag_box(x,370,y,540,60,16,{a,edge:on>0.05?AG.blue:null,edgeA:0.9*on});ag_T(x,(i+1)+". "+s,394,y+41,{w:600,size:28,a,col:on>0.5?AG.blue:AG.ink});
    const va=ag_in(tt,times[i]+0.4,0.3)*a;if(va>0.01)ag_T(x,v,880,y+41,{w:800,size:30,align:"right",col:i===4?AG.green:AG.ink,a:va});});
  // the example, under the steps
  const ea=ag_in(tt,P.example-0.1,0.4),k=ag_spr(tt,P.example-0.1,0.8);if(ea>0.01){x.save();ag_about(x,640,790,lerp(0.6,1,k));ag_box(x,360,750,560,90,18,{a:ea});
    ag_T(x,"A square and ten roots",392,790,{w:700,size:30,a:ea});ag_T(x,"make thirty-nine",392,826,{w:600,size:28,col:AG.mut,a:ea});x.restore();}
  // the square, on the right page
  const u=170,sx=1110,sy=236;sw_square(x,sx,sy,u,{p:clamp((tt-P.drawn)/1.2,0,1),strips:clamp((tt-P.halve-0.3)/1.0,0,1),corner:clamp((tt-P.mult-0.2)/0.8,0,1),side:ag_in(tt,P.root,0.5),root:ag_in(tt,P.away+0.2,0.6)});
  const l39=ag_in(tt,P.add-0.1,0.4);if(l39>0.01)ag_pill(x,sx+(u+u*5/3)/2,sy-66,"39 + 25 = 64",{a:l39,size:30});
  const ans=sw_pop(tt,P.away+0.5,null);x.save();ag_about(x,1300,800,lerp(0.6,1,ans.k));ag_verdict(x,1300,800,"the root is 3","pass",ans.a);x.restore();}
// a page turning from right to left over the open book (u 0 to 1)
function sw_pageTurn(x,u){const B=SW_BOOK,g=B.gut,ex=lerp(B.x1,B.x0,u),lift=Math.sin(u*Math.PI)*60;x.save();
  x.fillStyle="rgba(40,26,14,"+(0.25*Math.sin(u*Math.PI))+")";x.fillRect(Math.min(g,ex),B.y0,Math.abs(ex-g),B.y1-B.y0);
  x.beginPath();x.moveTo(g,B.y0);x.quadraticCurveTo((g+ex)/2,B.y0-lift,ex,B.y0+lift*0.2);x.lineTo(ex,B.y1-lift*0.2);x.quadraticCurveTo((g+ex)/2,B.y1+lift*0.3,g,B.y1);x.closePath();
  const gr=x.createLinearGradient(g,0,ex,0);gr.addColorStop(0,"rgb(226,216,196)");gr.addColorStop(1,"rgb(246,240,226)");x.fillStyle=gr;x.fill();x.restore();}
// today: three chats, each solving the same job from nothing; then the job written down once, and every agent reading it
function sw_reuse(x,tt,P){ag_roomLight(x,1);const fa=ag_in(tt,P.write-0.2,0.6),at=[P.lab+0.6,P.again-0.2,P.again+0.5];
  [[150,170],[710,170],[1270,170]].forEach(([cx,cy],i)=>{const a=ag_in(tt,at[i],0.5)*(1-fa);if(a<=0.01)return;sw_chat(x,cx,cy,500,320,{a,k:ag_spr(tt,at[i],0.8),ask:"Reconcile the count"});
    const sp=ag_in(tt,P.nothingD-0.1+i*0.25,0.4);ag_pill(x,cx+250,cy+384,"solved from nothing",{col:AG.amber,icon:"loop",a:a*sp,size:28});
    sw_model(x,cx+452,cy+272,30,{t:tt+i,core:0.6,a});});
  if(fa>0.01){const k=ag_spr(tt,P.write-0.2,0.8);sw_file(x,560,210,800,330,"skills/…/SKILL.md",[{k:"front",t:"name: the job"},{k:"front",t:"description: when to use it"},{k:"h2",t:"Its steps"},{k:"li",t:"1. …"}],{a:fa,k,edge:AG.blue});
    const ev=ag_in(tt,P.every-0.1,0.5);[[560,720],[960,760],[1360,720]].forEach(([mx,my],i)=>{const a=ev*ag_in(tt,P.every+i*0.2,0.4);if(a<=0.01)return;
      x.save();x.globalAlpha*=a;x.strokeStyle=rgba(AG.blue,0.5);x.lineWidth=3;x.setLineDash([8,8]);x.beginPath();x.moveTo(960,540);x.lineTo(mx,my-48);x.stroke();x.restore();sw_model(x,mx,my,44,{t:tt+i,core:0.8,a});});}}

// copied for centuries: copies of the book along the years, from about 820, one after another; then the Latin one, in 1145, in a
// lighter binding, and its card
function sw_copies(x,tt,P){const xa=300,xb=1560,yr=v=>lerp(xa,xb,(v-820)/(1145-820)),ry=660,L=[238,228,208];
  const rp=ag_sine(clamp((tt-P.copied+0.3)/2.8,0,1));x.save();x.strokeStyle=rgba(L,0.5);x.lineWidth=5;x.lineCap="round";x.beginPath();x.moveTo(xa-50,ry);x.lineTo(lerp(xa-50,xb+50,rp),ry);x.stroke();x.restore();
  const cols=[[118,70,50],[96,74,56],[132,96,64],[84,66,60],[110,84,58]];
  [820,865,910,955,1000,1045,1090].forEach((v,i)=>{const t0=P.copied-0.3+i*0.36,a=ag_in(tt,t0,0.4);if(a<=0.01)return;const px=yr(v),lift=(1-ag_eo(clamp((tt-t0)/0.6,0,1)))*24;
    sw_codex(x,px-62,ry-200-lift,124,150,cols[i%5],{a});x.save();x.globalAlpha*=a;x.fillStyle=rgba(L,0.7);x.beginPath();x.arc(px,ry,7,0,TAU);x.fill();x.restore();});
  ag_T(x,"about 820",yr(820),ry+58,{w:600,size:28,align:"center",col:L,a:ag_in(tt,P.copied-0.3,0.4)});
  const la=ag_in(tt,P.lat-0.2,0.5);if(la>0.01){const px=yr(1145),lift=(1-ag_eo(clamp((tt-P.lat+0.2)/0.6,0,1)))*24;sw_codex(x,px-62,ry-200-lift,124,150,[178,150,110],{a:la});
    x.save();x.globalAlpha*=la;x.fillStyle=rgba(L,0.95);x.beginPath();x.arc(px,ry,9,0,TAU);x.fill();x.restore();ag_T(x,"1145",px,ry+58,{w:600,size:28,align:"center",col:L,a:la});}
  const p=sw_pop(tt,P.lat+0.3,null);ag_textCard(x,960,170,560,{kick:"Segovia, 1145",title:"Into Latin",sub:"Robert of Chester's translation"},{k:p.k,a:p.a,kickCol:SW_PAL.tag});}

// the walnut desk alone, for the copies and the words
AG_PLACES.swWood=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(96,68,46)");g.addColorStop(1,"rgb(72,50,34)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const R=ag_rnd(78);c.save();c.globalAlpha=0.12;c.strokeStyle="rgb(40,26,16)";c.lineWidth=2;for(let i=0;i<60;i++){const y=R()*H;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(600,y+(R()-0.5)*30,1300,y+(R()-0.5)*30,W,y+(R()-0.5)*20);c.stroke();}c.restore();
  g=c.createRadialGradient(1500,200,50,1300,400,1500);g.addColorStop(0,"rgba(255,230,190,0.18)");g.addColorStop(1,"rgba(255,230,190,0)");c.fillStyle=g;c.fillRect(0,0,W,H);sw_light(c,0.8);};

/* ===== chapters 2 to 7, in the lab: the module's room, Jun at his desk on the left, and by night the same room with its lamp ===== */
// the kicker over a lab chapter's first seconds
const sw_kickA=t=>ag_io(t,0.3,4.6,0.5);
// the three causes as short cards: their titles, then o.sub (a line under each), o.k springs
function sw_causeCards(x,tt,at,o){o=o||{};const out=[];for(let i=0;i<3;i++){const p=sw_pop(tt,at[i],o.till==null?null:o.till),y=(o.y||200)+i*(o.dy||150);
    const b=ag_textCard(x,o.x||580,y,o.w||760,{title:SW_CAUSES[i].title,sub:o.sub?o.sub(i):null},{k:p.k,a:p.a*(o.a==null?1:o.a),edge:o.edge||null});out.push(b);}return out;}

// ---- 2 · Solved again, from nothing: the census-day count and the census report; when they differ, the same few causes, each found
// before and settled by a person, but kept in one chat, one note, one email; the agent starts from nothing, and may answer another way ----
scene("again",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    team:wAt(sc,"today","Jun's team"),count:wAt(sc,"today","18,412"),gov:wAt(sc,"today","government"),
    recon:c.recon,change:wAt(sc,"recon","code"),reconW:wAt(sc,"recon","reconciles"),
    still:wAt(sc,"matches","still matches"),report:wAt(sc,"matches","census report"),official:wAt(sc,"matches","official"),
    differ:c.differ,why:wAt(sc,"differ","why"),
    causes:c.causes,c1:wAt(sc,"three","withdrew"),c2:wAt(sc,"three","new degree"),c3:wAt(sc,"three","counted twice"),
    found:wAt(sc,"found","found before"),settled:wAt(sc,"found","settled"),
    stayed:c.stayed,chat:wAt(sc,"stayed","one chat"),note:wAt(sc,"stayed","one note"),mail:wAt(sc,"stayed","one email"),
    nothing:c.nothing,start:wAt(sc,"nothing","starts from nothing"),aft:wAt(sc,"nothing","afternoon"),knew:wAt(sc,"nothing","already knew"),
    twice:c.twice,another:wAt(sc,"twice","another way"),two:wAt(sc,"twice","two answers")}));
  const shots=[
    // Jun at his desk: the census-day count, the number the university reports to the government
    {at:0,place:"lab",keys:[[0,960,540,1.0],[0.1,970,530,1.02]],d:12,push:0.01,draw:(x,tt)=>{
      sw_jun(x,tt,{gaze:[3,0.3],nod:0.06*ag_io(tt,P.team-0.2,P.team+0.9,0.3),smile:0.3});ag_roomLight(x,1);
      const p=sw_pop(tt,P.count-0.3,null);sw_num(x,1000,250,700,"The census-day count","18,412 students",null,{k:p.k,a:p.a});
      const q=sw_pop(tt,P.gov-0.4,null);ag_pill(x,1350,500,"the number reported to the government",{a:q.a,size:28});}},
    // the count beside the census report: they match; then, after a change, they differ by 37
    {at:P.recon-0.4,place:"lab",cut:true,keys:[[P.recon-0.4,960,540,1.0],[P.recon-0.3,960,532,1.03]],d:12,push:0.01,draw:(x,tt)=>{ag_roomLight(x,1);
      const m=ag_in(tt,P.differ+0.2,0.6),L=sw_pop(tt,P.recon-0.2,null);sw_num(x,160,260,660,"The count","18,412",null,{k:L.k,a:L.a,num2:"18,375",m,col2:AG.amber,edge:m>0.5?AG.amber:null});
      const ch=sw_pop(tt,P.change-0.2,null);ag_pill(x,490,490,"its code or a source changed",{a:ch.a,size:28});
      const R=sw_pop(tt,P.report-0.3,null);sw_num(x,1100,260,660,"The census report","18,412","the university's official count",{k:R.k,a:R.a});
      const eq=ag_in(tt,P.still-0.1,0.4);if(eq>0.01){ag_T(x,"=",960,382,{w:700,size:64,align:"center",a:eq,col:m>0.5?AG.amber:AG.ink});
        if(m>0.01){x.save();x.globalAlpha*=eq*m;x.strokeStyle=rgba(AG.amber,1);x.lineWidth=5;x.lineCap="round";x.beginPath();x.moveTo(978,330);x.lineTo(942,398);x.stroke();x.restore();}}
      ag_verdict(x,960,580,"they match","pass",ag_io(tt,P.still+0.3,P.differ+0.1,0.4));ag_verdict(x,960,580,"37 fewer: why?","fail",ag_in(tt,P.why-0.3,0.4));}},
    // the same few causes, each found before and settled by a person; each answer kept where it was found; the agent starts from nothing
    {at:P.causes-0.3,place:"lab",cut:true,keys:[[P.causes-0.3,960,540,1.0],[P.causes-0.2,960,536,1.02]],d:30,push:0.008,draw:(x,tt)=>sw_kept(x,tt,P)},
    // two answers for one count
    {at:P.twice-0.4,place:"lab",cut:true,keys:[[P.twice-0.4,960,540,1.0],[P.twice-0.3,960,530,1.03]],d:6,push:0.01,draw:(x,tt)=>{ag_roomLight(x,1);
      const p=sw_pop(tt,P.twice,null),q=sw_pop(tt,P.another-0.1,null);
      sw_model(x,520,250,46,{t:tt,core:0.8,a:p.a});ag_textCard(x,240,350,560,{kick:"One afternoon",title:"Leave the 37 out"},{k:p.k,a:p.a,kickCol:AG.kick,tail:{side:"top",at:0.5,px:520,py:300}});
      sw_model(x,1400,250,46,{t:tt+1,core:0.8,a:q.a});ag_textCard(x,1120,350,560,{kick:"Another afternoon",title:"They still count"},{k:q.k,a:q.a,kickCol:AG.kick,tail:{side:"top",at:0.5,px:1400,py:300}});
      ag_verdict(x,960,640,"two answers for one count","fail",ag_in(tt,P.two-0.1,0.5));}}];
  sw_shots(ctx,S,t,sc.dur,shots);sw_kick(ctx,S,sw_kickA(t));});
// the causes: three cards; then each answer flies into where it stayed (a chat, a note, an email), and the agent below starts from nothing
function sw_kept(x,tt,P){ag_roomLight(x,1);
  const hd=ag_io(tt,P.causes,P.stayed-0.2,0.4);ag_label(x,960,170,"The same few causes",{align:"center",col:AG.kick,a:hd});
  const fly=[P.chat,P.note,P.mail].map(w=>ag_eo(clamp((tt-w+0.2)/0.9,0,1))),home=[[400,330],[960,330],[1520,340]];
  for(let i=0;i<3;i++){const p=sw_pop(tt,[P.c1,P.c2,P.c3][i]-0.2,null),u=fly[i];if(p.a<=0.01||u>=0.99)continue;const y=220+i*170,sub=ag_in(tt,P.found+0.2*i,0.4);
    const words={title:SW_CAUSES[i].title,sub:sub>0.5?"found before, and settled by a person":null},h=ag_textCard(x,580,y,760,words,{measure:true}).h,w0=[P.chat,P.note,P.mail][i],ta=1-ag_in(tt,w0-0.6,0.3),la=ag_in(tt,w0-0.3,0.2);
    x.save();const cx=lerp(960,home[i][0],u),cy=lerp(y+h/2,home[i][1],u);x.translate(cx-960,cy-(y+h/2));ag_about(x,960,y+h/2,lerp(1,0.2,u));
    if(ta<0.999)sw_blank(x,580,y,760,h,p.a*(1-u*0.6),la);if(ta>0.001)ag_textCard(x,580,y,760,words,{k:p.k,a:p.a*ta});x.restore();}
  // where each answer stayed
  const ca=ag_in(tt,P.chat-0.3,0.4),na=ag_in(tt,P.note-0.3,0.4),ma=ag_in(tt,P.mail-0.3,0.4),dim=1-0.35*ag_in(tt,P.knew-0.6,0.6);
  sw_chat(x,200,190,400,260,{a:ca*dim,k:ag_spr(tt,P.chat-0.3,0.8),label:"one chat"});sw_note(x,850,200,220,{a:na*dim,k:ag_spr(tt,P.note-0.3,0.8),label:"one note"});
  sw_mail(x,1340,210,360,{a:ma*dim,k:ag_spr(tt,P.mail-0.3,0.8),label:"one email"});
  // the agent, starting from nothing, going round and round for an afternoon
  const ga=ag_in(tt,P.nothing-0.2,0.5);if(ga>0.01){const R=118,cx=960,cy=700,lit=Math.floor(Math.max(0,tt-P.start)*1.6)%3;
    sw_fade(x,ga,c2=>ag_loop(c2,cx,cy,{R,r:46,t:tt,core:0.8,think:0.6,lit:tt>P.start?lit:null,label:null,p:1,stepA:[1,1,1]}));
    const pa=ag_in(tt,P.aft-0.2,0.4);ag_pill(x,1430,700,"an afternoon, from nothing",{col:AG.amber,icon:"loop",a:pa*ga,size:28});
    const ka=ag_in(tt,P.knew-0.3,0.5);if(ka>0.01){ag_label(x,960,110,"What the team already knew",{align:"center",col:AG.kick,a:ka});}}}

// ---- 3 · A skill, earned by hand: Jun does the job once more and writes down each step; the skill file, its name and its line; its
// steps; its causes met so far; the agent reads only names and lines, and loads a skill's steps when a job needs them; a new case gets a
// line; al-Khwarizmi's book again ----
const SW_NOTES=["1. Build the count","2. Compare it with the census report","3. Find the students behind the difference","4. Report each cause, with its query"];
const SW_FRONT=[{k:"front",t:"name: reconcile-and-diff"},{k:"front",t:"description: Validate a change before sign-off, by reconciling with the census report and diffing against the previous version. Use before asking an owner to approve a change to the core or the marts."}];
const SW_RECON_STEPS=["1. Build on the development target …","2. The singular test reconcile_planning_with_census_report must pass. It compares Planning's mart with … census_report.csv, faculty by faculty.","3. For the sign-off, show every row, not just the failures …","4. If they differ, find the learners behind the difference … Report each cause with its query."];
scene("skill",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    hand:c.hand,byHand:wAt(sc,"hand","by hand"),writes:wAt(sc,"hand","writes down"),
    file:c.file,skillW:wAt(sc,"file","a skill"),fileW:wAt(sc,"file","a file"),name:wAt(sc,"file","a name"),line:wAt(sc,"file","a line"),
    steps:c.steps,build:wAt(sc,"steps","build the count"),compare:wAt(sc,"steps","compare"),
    behind:c.behind,find:wAt(sc,"behind","Find the students"),report:wAt(sc,"behind","report each cause"),
    causes:c.causes,shows:wAt(sc,"causes","how it shows"),settled:wAt(sc,"causes","what settled"),decided:wAt(sc,"causes","who decided"),
    loads:c.loads,every:wAt(sc,"loads","every skill"),just:wAt(sc,"loads","name and line"),loadsW:wAt(sc,"loads","loads the steps"),job:wAt(sc,"loads","a job"),
    grows:c.grows,newc:wAt(sc,"grows","new case"),aline:wAt(sc,"grows","a line too"),twice:wAt(sc,"grows","Nothing is solved"),
    book:c.book,forms:wAt(sc,"book","each form"),real:wAt(sc,"book","real cases")}));
  const shots=[
    // Jun at his desk, writing down each step as he goes
    {at:0,place:"lab",keys:[[0,960,540,1.0],[0.1,970,530,1.02]],d:7,push:0.01,draw:(x,tt)=>{
      sw_jun(x,tt,{gaze:[3,0.6],nod:0.05*ag_io(tt,P.writes-0.3,P.writes+1.6,0.4),smile:0.25});ag_roomLight(x,1);
      const p=sw_pop(tt,P.byHand-0.2,null);if(p.a>0.01){x.save();ag_about(x,1300,420,lerp(0.6,1,p.k));x.globalAlpha*=p.a;ag_box(x,860,190,880,400,22,{});
        ag_T(x,"JUN'S NOTES",900,250,{w:700,size:28,ls:4,col:AG.kick});
        SW_NOTES.forEach((s,i)=>ag_T(x,s,900,330+i*70,{w:600,size:32,a:ag_in(tt,P.writes+i*0.45,0.35)}));x.restore();}}},
    // the skill: a file in the project, its name, and the line that says when to use it; then its steps
    {at:P.file-0.4,place:"lab",cut:true,keys:[[P.file-0.4,960,540,1.0],[P.file-0.3,960,534,1.02]],d:18,push:0.008,draw:(x,tt)=>{ag_roomLight(x,1);
      const k=ag_spr(tt,P.skillW-0.2,0.8),a=ag_in(tt,P.skillW-0.2,0.5),sa=ag_in(tt,P.steps-0.3,0.5);
      const L=[{k:"front",t:SW_FRONT[0].t,hi:ag_io(tt,P.name-0.1,P.line-0.2,0.3)},{k:"front",t:SW_FRONT[1].t,hi:ag_io(tt,P.line-0.1,P.steps-0.3,0.3)},{k:"gap"},{k:"h2",t:"Reconcile",a:sa}]
        .concat(SW_RECON_STEPS.map((s,i)=>({k:"li",t:s,a:ag_in(tt,P.steps+0.1+i*0.2,0.4),hi:[ag_io(tt,P.build-0.1,P.compare-0.2,0.3),ag_io(tt,P.compare-0.1,P.find-0.3,0.3),0,ag_in(tt,P.find-0.1,0.3)][i]})));
      sw_file(x,260,180,1400,560,"skills/reconcile-and-diff/SKILL.md",L,{a,k,edge:AG.blue});}},
    // its causes met so far: how each shows, what settled it, who decided
    {at:P.causes-0.4,place:"lab",cut:true,keys:[[P.causes-0.4,960,540,1.0],[P.causes-0.3,960,536,1.02]],d:7,push:0.008,draw:(x,tt)=>{ag_roomLight(x,1);
      ag_T(x,"skills/reconcile-and-diff/SKILL.md · Causes met so far",960,150,{w:500,size:28,f:"mono",col:AG.blue,align:"center",a:ag_in(tt,P.causes-0.3,0.4)});
      const parts=ag_in(tt,P.shows-0.2,0.4)+ag_in(tt,P.settled-0.2,0.4)+ag_in(tt,P.decided-0.2,0.4);let y=190;
      for(let i=0;i<3;i++){const p=sw_pop(tt,P.causes-0.2+i*0.3,null);const b=sw_cause(x,360,y,1200,SW_CAUSES[i],{parts,a:p.a,k:p.k});y+=b.h+16;}}},
    // the agent reads only each skill's name and line; a job comes, and it loads the steps of the one it needs
    {at:P.loads-0.4,place:"lab",cut:true,keys:[[P.loads-0.4,960,540,1.0],[P.loads-0.3,960,536,1.02]],d:9,push:0.008,draw:(x,tt)=>sw_loads(x,tt,P)},
    // a new case gets a line too
    {at:P.grows-0.4,place:"lab",cut:true,keys:[[P.grows-0.4,960,540,1.0],[P.grows-0.3,960,536,1.02]],d:6,push:0.008,draw:(x,tt)=>{ag_roomLight(x,1);
      ag_T(x,"skills/reconcile-and-diff/SKILL.md · Causes met so far",960,150,{w:500,size:28,f:"mono",col:AG.blue,align:"center"});
      for(let i=0;i<3;i++)ag_textCard(x,480,190+i*130,960,{title:SW_CAUSES[i].title});
      const n=sw_pop(tt,P.newc-0.1,null);if(n.a>0.01){const b=ag_textCard(x,480,580,960,{title:"The next new case",sub:"how it shows, what settled it, who decided"},{k:n.k,a:n.a,kickCol:AG.kick});sw_dash(x,b.x,b.y,b.w,b.h,AG.blue,n.a);}
      ag_verdict(x,960,800,"nothing is solved twice","pass",ag_in(tt,P.twice-0.1,0.5));}},
    // al-Khwarizmi's book again: a form and a skill, its steps and the skill's steps, real cases and the causes met so far
    {at:P.book-0.4,place:"swBook",dis:0.8,keys:[[P.book-0.4,960,500,1.0],[P.book-0.3,960,496,1.02]],d:7,push:0.008,draw:(x,tt)=>{
      const rows=[["A form","A skill",P.book],["Its steps","Its steps",P.forms],["Real cases","Causes met so far",P.real]];
      ag_label(x,630,200,"In the book",{align:"center",col:SW_PAL.tag,a:ag_in(tt,P.book-0.2,0.4)});ag_label(x,1290,200,"In the skill",{align:"center",col:AG.blue,a:ag_in(tt,P.book,0.4)});
      rows.forEach(([l,r,w],i)=>{const p=sw_pop(tt,w-0.2,null),q=sw_pop(tt,w+0.2,null),y=250+i*170;ag_textCard(x,380,y,500,{title:l},{k:p.k,a:p.a});
        ag_textCard(x,1040,y,500,{title:r},{k:q.k,a:q.a,edge:AG.blue});if(q.a>0.01)ag_T(x,"=",960,y+58,{w:700,size:44,align:"center",a:q.a,col:SW_PAL.ink});});}}];
  sw_shots(ctx,S,t,sc.dur,shots);sw_kick(ctx,S,sw_kickA(t));});
// the seven skills folded to their names and lines, in two columns; the agent reads each line in turn; a job comes, and the one it needs
// unfolds to its steps while the others dim
const SW_GRID=SW_SKILLS.map((s,i)=>({x:i<4?640:1270,y:150+(i%4)*156,w:600}));
function sw_loads(x,tt,P){ag_roomLight(x,1);const ma=ag_in(tt,P.loads-0.3,0.5);sw_model(x,330,450,62,{t:tt,core:0.7+0.3*ag_in(tt,P.just,0.4),think:ag_io(tt,P.just,P.loadsW+1,0.4),a:ma});
  const open=ag_eo(clamp((tt-P.job-0.2)/0.9,0,1));
  SW_SKILLS.forEach(([n,d],i)=>{const g=SW_GRID[i],p=sw_pop(tt,P.loads-0.2+i*0.12,null),rd=clamp((tt-P.just+0.3-i*0.28)/0.5,0,1),me=i===SW_RECON;
    if(me&&open>0.01)return;sw_slim(x,g.x,g.y,g.w,n,d,{rows:2,a:p.a,k:p.k,read:rd,dim:me?0:open*1.4});});
  const ja=sw_pop(tt,P.job-0.4,null);ag_pill(x,330,640,"a job needs it",{a:ja.a,size:28});
  if(open>0.01){const g=SW_GRID[SW_RECON],X=lerp(g.x,640,open),Y=lerp(g.y,150,open),Wd=lerp(g.w,1230,open),Hd=lerp(142,470,open);
    if(open<0.5)sw_slim(x,X,Y,Wd,SW_SKILLS[SW_RECON][0],SW_SKILLS[SW_RECON][1],{rows:2,lit:1,a:1-open*2});
    else sw_file(x,X,Y,Wd,Hd,"skills/reconcile-and-diff/SKILL.md",[{k:"h2",t:"Reconcile"}].concat(SW_RECON_STEPS.map(s=>({k:"li",t:s}))),{a:(open-0.5)*2,edge:AG.blue});}}

// ---- 4 · A router picks the skill: seven skills; which one does a job need? a router, a skill whose only job is to choose; it reads
// the job, compares it with each skill's line, loads the one that fits; when none fits, it says so and asks a person; that job is done
// by hand first, and may become the next skill; the book's two moves did the same ----
scene("router",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    seven:wAt(sc,"seven","seven skills"),eachJob:wAt(sc,"seven","one for each job"),which:c.which,
    router:c.router,choose:wAt(sc,"router","only job"),reads:wAt(sc,"reads","reads the job"),compares:wAt(sc,"reads","compares"),fits:wAt(sc,"reads","loads the one"),
    check:c.check,recon:wAt(sc,"check","reconcile and diff"),
    none:c.none,noFit:wAt(sc,"none","no skill fits"),guess:wAt(sc,"none","doesn't guess"),says:wAt(sc,"none","says so"),asks:wAt(sc,"none","asks a person"),
    next:c.next,hand:wAt(sc,"next","by hand"),nextW:wAt(sc,"next","next skill"),
    forms:c.forms,same:wAt(sc,"forms","did the same"),brought:wAt(sc,"forms","brought each problem"),solve:wAt(sc,"forms","would solve")}));
  const shots=[
    {at:0,place:"lab",keys:[[0,960,540,1.0],[0.1,960,536,1.02]],d:34,push:0.006,draw:(x,tt)=>sw_route(x,tt,P)},
    // the job no skill fits, done by hand first: Jun, and the next skill, still a draft
    {at:P.next-0.4,place:"lab",cut:true,keys:[[P.next-0.4,960,540,1.0],[P.next-0.3,970,530,1.02]],d:5,push:0.01,draw:(x,tt)=>{
      sw_jun(x,tt,{gaze:[3,0.6],nod:0.05*ag_io(tt,P.hand-0.3,P.hand+1.2,0.4),smile:0.25});ag_roomLight(x,1);
      const p=sw_pop(tt,P.next-0.2,null);ag_textCard(x,860,190,820,{kick:"A job, done by hand first",title:"Forecast next year's intake"},{k:p.k,a:p.a,kickCol:AG.kick});
      const q=sw_pop(tt,P.nextW-0.2,null);if(q.a>0.01){x.save();ag_about(x,1270,520,lerp(0.6,1,q.k));const b=sw_slim(x,970,450,600,"the next skill?","… Use when …",{a:q.a});sw_dash(x,b.x,b.y,b.w,b.h,AG.blue,q.a);x.restore();}}},
    // the book: completion and balancing brought each problem to the one form whose steps would solve it
    {at:P.forms-0.4,place:"swBook",dis:0.8,keys:[[P.forms-0.4,960,500,1.0],[P.forms-0.3,960,496,1.02]],d:7,push:0.008,draw:(x,tt)=>{
      const fa=ag_in(tt,P.forms-0.2,0.5),lit1=ag_in(tt,P.brought+0.9,0.4),lit4=ag_in(tt,P.brought+1.6,0.4);
      const boxes=sw_forms(x,426,300,{a:fa,k:ag_spr(tt,P.forms-0.2,0.8),lits:{0:lit1,3:lit4}});
      ag_label(x,960,266,"Six forms",{align:"center",col:AG.blue,a:fa});
      const a1=sw_pop(tt,P.brought-0.4,null),a2=sw_pop(tt,P.brought+0.4,null),b1=boxes[0];
      if(a1.a>0.01){x.save();ag_about(x,600,190,lerp(0.6,1,a1.k));sw_eq(x,600,190,[["5 squares",0,1],["40 roots",1,1]],{a:a1.a,col:AG.blue});x.restore();
        sw_link(x,600,236,600,b1.y-8,AG.blue,ag_in(tt,P.brought+0.4,0.4)*fa);}
      if(a2.a>0.01){x.save();ag_about(x,1265,190,lerp(0.6,1,a2.k));sw_eq(x,1265,190,[["a square",0,1],["10 roots",0,1,null,null,"+"],["39",1,1]],{a:a2.a,col:AG.blue});x.restore();
        sw_toForm(x,1578,190,boxes[3],ag_in(tt,P.brought+1.1,0.6)*fa);}}}];
  sw_shots(ctx,S,t,sc.dur,shots);sw_kick(ctx,S,sw_kickA(t));});
// the router at work: the agent on the left with the job and the router above it; the seven skills on the right
function sw_route(x,tt,P){ag_roomLight(x,1);const ma=ag_in(tt,0.2,0.6);sw_model(x,330,660,54,{t:tt,core:0.8,think:ag_io(tt,P.reads,P.fits+0.6,0.4)+ag_io(tt,P.none,P.says,0.4),a:ma});
  // the job: first Jun's change, then one no skill fits
  const j2=ag_in(tt,P.none-0.3,0.5),j1=sw_pop(tt,P.which-0.2,null);
  const rj=clamp((tt-P.reads+0.1)/0.6,0,1),fitA=ag_in(tt,P.fits-0.1,0.4)*(1-j2);
  if(j1.a*(1-j2)>0.01){x.save();ag_about(x,330,230,lerp(0.6,1,j1.k));const b=ag_textCard(x,70,140,520,{kick:"A job",title:"Check Jun's change before Noor signs it off"},{a:j1.a*(1-j2),kickCol:AG.kick,edge:fitA>0.5?AG.blue:null});
    if(rj>0.01&&rj<0.99){x.save();x.beginPath();rr(x,b.x,b.y,b.w,b.h,22);x.clip();const sx=b.x+b.w*rj,g=x.createLinearGradient(sx-140,0,sx+40,0);g.addColorStop(0,rgba(AG.violet,0));g.addColorStop(0.75,rgba(AG.violet,0.14));g.addColorStop(1,rgba(AG.violet,0));x.fillStyle=g;x.fillRect(sx-140,b.y,180,b.h);x.restore();}x.restore();}
  if(j2>0.01){const p=sw_pop(tt,P.none-0.3,null);ag_textCard(x,70,140,520,{kick:"Another job",title:"Forecast next year's intake"},{k:p.k,a:p.a,kickCol:AG.kick});}
  // the router: a skill whose only job is to choose
  const ra=sw_pop(tt,P.router-0.2,null);sw_slim(x,40,410,580,SW_ROUTER[0],SW_ROUTER[1],{rows:2,a:ra.a,k:ra.k,lit:ag_in(tt,P.choose,0.4)});
  // the seven skills, each line read in turn, twice: for the first job, and for the job none fits
  const ask=sw_pop(tt,P.asks-0.2,null);
  SW_SKILLS.forEach(([n,d],i)=>{const g=SW_GRID[i],p=sw_pop(tt,P.seven-0.3+i*0.12,null),rd1=clamp((tt-P.compares+0.2-i*0.22)/0.45,0,1),rd2=clamp((tt-P.noFit+0.2-i*0.18)/0.4,0,1);
    const me=i===SW_RECON,lit=me?ag_in(tt,P.fits,0.4)*(1-j2):0;sw_slim(x,g.x,g.y,g.w,n,d,{rows:2,a:p.a,k:p.k,read:j2>0.5?rd2:rd1,lit,dim:Math.max(lit>0.5?0:(fitA>0.5?0.8:0),ask.a)});});
  // "So which one?" over the skills
  ag_pill(x,1240,790,"So which one does a job need?",{a:ag_io(tt,P.which-0.2,P.router-0.3,0.4),size:28});
  // the one that fits: a line from the router to it
  const la=fitA;if(la>0.01){const g=SW_GRID[SW_RECON];x.save();x.globalAlpha*=la;x.strokeStyle=rgba(AG.blue,0.7);x.lineWidth=3;x.setLineDash([9,9]);x.beginPath();x.moveTo(620,481);x.lineTo(g.x,g.y+71);x.stroke();x.setLineDash([]);ag_arrowHead(x,g.x-2,g.y+71,Math.atan2(g.y+71-481,g.x-620),12,rgba(AG.blue,0.85));x.restore();}
  ag_verdict(x,1240,830,"reconcile-and-diff","pass",ag_io(tt,P.recon-0.4,P.none-0.4,0.4));
  // none fits: it says so, and asks a person
  ag_verdict(x,1240,790,"No skill fits","fail",ag_in(tt,P.says-0.3,0.4));
  ag_textCard(x,700,560,620,{kick:"To Jun",title:"No skill fits this job. Can you do it first?"},{k:ask.k,a:ask.a,kickCol:AG.kick,edge:AG.violet,tail:{side:"left",at:0.5,px:400,py:640}});}

// ---- 5 · A workflow runs what's known: every night the count is built again; fixed steps, in order; when the count and the census
// report agree, no agent; the rule; when they don't, the workflow calls the agent with the reconcile skill, and a person decides; in
// the book, a form's steps never change: the thinking is in bringing each problem to its form ----
scene("workflow",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    choose:wAt(sc,"night","no choosing"),every:wAt(sc,"night","Every night"),built:wAt(sc,"night","built again"),recs:wAt(sc,"night","day's records"),
    fixed:c.fixed,wf:wAt(sc,"fixed","workflow"),steps:wAt(sc,"fixed","fixed steps"),order:wAt(sc,"fixed","in order"),same:wAt(sc,"fixed","same way"),
    s1:wAt(sc,"list","Build"),s2:wAt(sc,"list","Count as"),s3:wAt(sc,"list","Run the tests"),s4:wAt(sc,"list","Compare"),
    agree:c.agree,whole:wAt(sc,"agree","whole job"),noagent:wAt(sc,"agree","no agent"),
    rule:c.rule,plain:wAt(sc,"rule","plain steps"),keep:wAt(sc,"rule","keep the agent"),
    call:c.call,dont:wAt(sc,"call","don't agree"),callW:wAt(sc,"call","call the agent"),more:wAt(sc,"call","one more step"),skill:wAt(sc,"call","reconcile skill"),
    person:c.person,why:wAt(sc,"person","finds out why"),decides:wAt(sc,"person","A person decides"),
    book:c.book,never:wAt(sc,"book","never change"),thinking:wAt(sc,"book","thinking"),bring:wAt(sc,"book","bringing")}));
  const slots=sw_slots(5,250),four=sw_slots(4,250,330,1810);
  const rail=(x,tt,o)=>{const st=o.states(tt),sl=o.four?four:slots;sw_rail(x,sl.map((s,i)=>({x:s.x,y:s.y,w:s.w,num:i+1,label:i<4?SW_STEPS_NIGHT[i]:"Call the agent",state:st[i],a:o.stepA(i),k:o.stepK?o.stepK(i):null})),{p:o.p});};
  const shots=[
    // the lab at night: every night, the count is built again from the day's records
    {at:0,place:"swNight",keys:[[0,960,540,1.0],[0.1,960,536,1.02]],d:8,push:0.008,draw:(x,tt)=>{sw_night(x);
      sw_clock(x,960,170,"Every night · 02:00",ag_in(tt,P.every-0.2,0.4));
      const ra=sw_pop(tt,P.recs-0.6,null);ag_textCard(x,260,330,560,{kick:"The day's records",title:"from the student system"},{k:ra.k,a:ra.a,kickCol:AG.kick});
      const ca=sw_pop(tt,P.built-0.3,null);sw_num(x,1100,330,560,"The count","18,412","built again every night",{k:ca.k,a:ca.a});
      if(ra.a>0.5&&ca.a>0.5){for(let i=0;i<5;i++){const u=((tt-P.recs)*0.5+i/5)%1;if(tt<P.recs)break;ag_pellet(x,lerp(840,1080,u),410+Math.sin(u*Math.PI)*-24,Math.sin(u*Math.PI));}}}},
    // the workflow: fixed steps, in order, the same way every time; when the count and the report agree, no agent is needed
    {at:P.fixed-0.4,place:"swNight",cut:true,keys:[[P.fixed-0.4,960,540,1.0],[P.fixed-0.3,960,536,1.02]],d:14,push:0.006,draw:(x,tt)=>{
      const sa=ag_in(tt,P.noagent-0.5,0.5);sw_model(x,1640,690,46,{t:tt,core:0,a:sa});sw_night(x);
      const on=[P.s1,P.s2,P.s3,P.s4];
      rail(x,tt,{four:true,p:clamp((tt-P.wf+0.3)/1.2,0,1),stepA:i=>i<4?ag_in(tt,P.steps-0.2+i*0.25,0.35):0,stepK:i=>ag_spr(tt,P.steps-0.2+i*0.25,0.8),
        states:tt=>on.map((w,i)=>tt<w-0.1?0:tt<(on[i+1]||P.agree)-0.2?1:2)});
      ag_pill(x,960,500,"the same way every time",{a:ag_io(tt,P.same-0.2,P.s1-0.3,0.4),size:28});
      ag_verdict(x,960,560,"18,412 · matches the census report","pass",ag_in(tt,P.agree-0.3,0.4));
      ag_pill(x,1640,800,"no agent needed",{a:sa,size:28});}},
    // the rule: plain steps for what's known; the agent for what isn't
    {at:P.rule-0.4,place:"swNight",cut:true,keys:[[P.rule-0.4,960,540,1.0],[P.rule-0.3,960,536,1.02]],d:6,push:0.008,draw:(x,tt)=>{
      const p=sw_pop(tt,P.plain-0.3,null),q=sw_pop(tt,P.keep-0.2,null);
      sw_model(x,440,539,48,{t:tt,core:0.8,a:q.a});sw_night(x);ag_model(x,440,539,48,{only:"light",t:tt,core:0.8,a:q.a});
      sw_miniRail(x,440,319,p.a);
      ag_textCard(x,560,250,800,{kick:"First",title:"Plain steps for what's known"},{k:p.k,a:p.a,kickCol:AG.blue,edge:AG.blue});
      ag_textCard(x,560,470,800,{kick:"Then",title:"The agent for what isn't"},{k:q.k,a:q.a,kickCol:AG.violet,edge:AG.violet});}},
    // when the numbers don't agree, one more step calls the agent, with the reconcile skill; it finds out why, and a person decides
    {at:P.call-0.4,place:"swNight",cut:true,keys:[[P.call-0.4,960,540,1.0],[P.call-0.3,960,536,1.02]],d:12,push:0.006,draw:(x,tt)=>{
      const fail=ag_in(tt,P.dont-0.2,0.3)>0.5,g=slots[4],ax=g.x+g.w/2,ay=560,ma=ag_in(tt,P.more-0.3,0.4),wa=ag_in(tt,P.callW,0.5);
      sw_model(x,ax,ay,56,{t:tt,core:wa,think:wa*0.7,a:ma});sw_night(x);ag_model(x,ax,ay,56,{only:"light",t:tt,core:wa,think:wa*0.7,a:ma*wa});
      rail(x,tt,{p:1,stepA:i=>i<4?1:ma,stepK:i=>i<4?null:ag_spr(tt,P.more-0.3,0.8),states:tt=>[2,2,2,fail?3:2,4]});
      sw_link(x,ax,g.y+136,ax,ay-70,AG.violet,ag_in(tt,P.callW-0.1,0.4));
      ag_verdict(x,slots[3].x+slots[3].w/2,440,"the numbers don't agree","fail",ag_in(tt,P.dont,0.4));
      const sk=sw_pop(tt,P.skill-0.3,null);sw_slim(x,560,ay-52,880,SW_SKILLS[SW_RECON][0],SW_SKILLS[SW_RECON][1],{a:sk.a,k:sk.k,lit:1});sw_link(x,1452,ay,ax-72,ay,AG.blue,sk.a);
      const rp=sw_pop(tt,P.why-0.2,null);if(rp.a>0.01){const b=ag_textCard(x,560,650,880,{kick:"The agent's draft",title:"Why they differ"},{k:rp.k,a:rp.a,kickCol:AG.violet});
        sw_dash(x,b.x,b.y,b.w,b.h,AG.violet,rp.a);sw_link(x,ax-24,ay+66,b.x+b.w+12,b.y+b.h/2,AG.violet,rp.a,true);}
      ag_verdict(x,1000,846,"A person decides","pass",ag_in(tt,P.decides-0.2,0.4));}},
    // the book: a form's steps never change; the thinking is in bringing each problem to its form
    {at:P.book-0.4,place:"swBook",dis:0.8,keys:[[P.book-0.4,960,500,1.0],[P.book-0.3,960,496,1.02]],d:7,push:0.008,draw:(x,tt)=>sw_bookFixed(x,tt,P)}];
  sw_shots(ctx,S,t,sc.dur,shots);sw_kick(ctx,S,sw_kickA(t),true);});
// the open book: on the left page, form 4's steps, the same every time; on the right, the thinking: a problem brought to that form
function sw_bookFixed(x,tt,P){ag_label(x,640,190,"The same steps every time",{align:"center",col:AG.blue,a:ag_in(tt,P.never-0.3,0.4)});
  ag_textCard(x,370,226,540,{kick:"Form 4",title:"Squares and roots equal numbers"},{edge:AG.blue,kickCol:AG.blue,a:ag_in(tt,P.book-0.2,0.4)});
  SW_STEPS.forEach(([s],i)=>{const a=ag_in(tt,P.book+i*0.15,0.35);if(a<=0.01)return;const y=430+i*72;ag_box(x,380,y,520,58,16,{a,edge:AG.blue,edgeA:0.6});ag_T(x,(i+1)+". "+s,404,y+40,{w:600,size:28,a,col:AG.ink});});
  ag_label(x,1290,190,"The thinking",{align:"center",col:SW_PAL.tag,a:ag_in(tt,P.thinking-0.3,0.4)});
  const m=ag_in(tt,P.bring+0.2,0.6),ea=ag_in(tt,P.thinking-0.2,0.4);
  sw_eq(x,1290,330,[["a square",0,1],["14 roots",0,1-m,AG.amber,null,"+"],["10 roots",0,m,AG.blue,null,"+"]],{a:ea,noEq:true});
  sw_eq(x,1290,420,[["39",1,1],["4 roots",1,1-m,AG.amber,null,"+"]],{a:ea});
  const ar=ag_in(tt,P.bring+0.9,0.5);if(ar>0.01){x.save();x.globalAlpha*=ar;x.strokeStyle=rgba(AG.blue,0.75);x.lineWidth=3;x.setLineDash([9,9]);x.beginPath();x.moveTo(1064,330);x.quadraticCurveTo(1000,292,926,290);x.stroke();x.setLineDash([]);ag_arrowHead(x,920,290,Math.PI,12,rgba(AG.blue,0.85));x.restore();}}

// ---- 6 · One night, a new case: 18,426 against 18,412; the tests pass, the workflow calls the agent; it loads the skill, checks the
// causes met so far, none fits; it finds the records behind the difference, and drafts a report in its sandbox with a question; in the
// morning Mei decides; Jun adds the cause and a fixed step with a test; Noor approves; the next night, no agent ----
scene("night",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    oct:wAt(sc,"one","October"),dont:wAt(sc,"one","don't agree"),n1:wAt(sc,"one","18,426"),n2:wAt(sc,"one","18,412"),
    tests:c.tests,pass:wAt(sc,"tests","pass"),calls:wAt(sc,"tests","calls the agent"),
    loads:c.loads,skill:wAt(sc,"loads","reconcile skill"),checks:wAt(sc,"loads","checks the causes"),one:wAt(sc,"loads","one by one"),none:wAt(sc,"loads","None fits"),
    finds:c.finds,fourteen:wAt(sc,"finds","fourteen"),week:wAt(sc,"finds","last week"),feb:wAt(sc,"finds","February"),
    drafts:c.drafts,report:wAt(sc,"drafts","drafts a report"),cause:wAt(sc,"drafts","the cause"),query:wAt(sc,"drafts","the query"),question:wAt(sc,"drafts","a question"),are:wAt(sc,"drafts","Are these"),
    mei:c.mei,decides:wAt(sc,"mei","decides"),test:wAt(sc,"mei","test records"),screen:wAt(sc,"mei","new screen"),never:wAt(sc,"mei","never count"),
    adds:c.adds,answer:wAt(sc,"adds","Mei's answer"),rule:wAt(sc,"adds","turns the rule"),fixed:wAt(sc,"adds","fixed step"),withT:wAt(sc,"adds","with a test"),
    noor:c.noor,appr:wAt(sc,"noor","approves"),
    next:c.next,leaves:wAt(sc,"next","leaves the fourteen"),noag:wAt(sc,"next","calls no agent")}));
  const s5=sw_slots(5,230);
  const shots=[
    // the night of 21 October: the numbers don't agree; the tests pass, so the workflow calls the agent
    {at:0,place:"swNight",keys:[[0,960,540,1.0],[0.1,960,536,1.02]],d:14,push:0.006,draw:(x,tt)=>{
      const g=s5[4],ax=g.x+g.w/2,ay=580,wa=ag_in(tt,P.calls,0.5),ma=ag_in(tt,P.calls-0.2,0.4);
      sw_model(x,ax,ay,54,{t:tt,core:wa,think:wa*0.7,a:ma});sw_night(x);ag_model(x,ax,ay,54,{only:"light",t:tt,core:wa,think:wa*0.7,a:ma*wa});
      sw_clock(x,1560,110,"Night of 21 October",ag_in(tt,P.oct-0.3,0.4));sw_link(x,ax,g.y+136,ax,ay-68,AG.violet,ag_in(tt,P.calls-0.1,0.4));
      const fail=tt>P.dont;ag_pill(x,s5[2].x+s5[2].w/2,410,"the tests pass",{col:AG.green,icon:"tick",a:ag_in(tt,P.pass-0.2,0.4),size:28});
      sw_rail(x,s5.map((s,i)=>({x:s.x,y:s.y,w:s.w,num:i+1,label:i<4?SW_STEPS_NIGHT[i]:"Call the agent",state:i<3?2:i===3?(fail?3:1):4,a:i<4?1:ag_in(tt,P.calls-0.2,0.4),k:i<4?null:ag_spr(tt,P.calls-0.2,0.8)})),{p:1});
      const a=sw_pop(tt,P.n1-0.3,null),b=sw_pop(tt,P.n2-0.2,null);
      sw_num(x,260,540,520,"The count","18,426",null,{k:a.k,a:a.a,edge:AG.amber});sw_num(x,840,540,520,"The census report","18,412",null,{k:b.k,a:b.a});}},
    // the agent loads the skill and checks the causes met so far, one by one: none fits; it finds the records behind the difference
    {at:P.loads-0.4,place:"swNight",cut:true,keys:[[P.loads-0.4,960,540,1.0],[P.loads-0.3,960,536,1.02]],d:15,push:0.006,draw:(x,tt)=>sw_finds(x,tt,P)},
    // in its sandbox, a draft report, and a question: are these students?
    {at:P.drafts-0.4,place:"swNight",cut:true,keys:[[P.drafts-0.4,960,540,1.0],[P.drafts-0.3,960,536,1.02]],d:8,push:0.006,draw:(x,tt)=>{
      sw_model(x,470,420,64,{t:tt,core:1,think:0.5});ag_sandbox(x,1120,780,1080,{depth:96});sw_night(x);ag_model(x,470,420,64,{only:"light",t:tt,core:1,think:0.5});
      const p=sw_pop(tt,P.report-0.3,null),L=[{k:"h2",t:"Why the count is 14 over"},{k:"p",t:"Cause: 14 records, all made last week, all dated back to February.",a:ag_in(tt,P.cause-0.2,0.4)},
        {k:"p",t:"Query: the one that finds them, attached.",a:ag_in(tt,P.query-0.2,0.4)},{k:"gap"},{k:"h2",t:"Question: are these students?",a:ag_in(tt,P.are-0.3,0.4)}];
      sw_file(x,660,390,920,350,"sandbox/report.md",L,{a:p.a,k:p.k,edge:AG.violet,draft:true});}},
    // in the morning, Mei decides
    {at:P.mei-0.4,place:"lab",dis:0.8,keys:[[P.mei-0.4,960,540,1.0],[P.mei-0.3,950,536,1.02]],d:9,push:0.008,draw:(x,tt)=>{
      ag_person(x,"mei",1500,610,1.0,{t:tt+5,flip:true,gaze:[4,0.2],smile:0.35,nod:0.05*ag_io(tt,P.decides-0.2,P.decides+1.0,0.4),talk:ag_talk(sc,"mei",tt)*0});ag_roomLight(x,1);
      sw_clock(x,1600,110,"22 October · morning",ag_in(tt,P.mei-0.2,0.4));
      const q=sw_pop(tt,P.mei+0.3,null);if(q.a>0.01){const b=sw_file(x,140,210,760,250,"sandbox/report.md",[{k:"h2",t:"Question: are these students?"}],{a:q.a*0.9,k:q.k,edge:AG.violet,draft:true});}
      const p=sw_pop(tt,P.test-0.4,null);ag_textCard(x,140,500,860,{kick:"Mei Tanaka, registrar's office",title:"They're test records, made to try a new screen.",sub:"Test records never count."},{k:p.k,a:p.a,kickCol:AG.kick,edge:AG.green,tail:{side:"right",at:0.3,px:1360,py:480}});}},
    // Jun adds the cause to the skill, with Mei's answer
    {at:P.adds-0.4,place:"lab",cut:true,keys:[[P.adds-0.4,960,540,1.0],[P.adds-0.3,970,530,1.02]],d:4,push:0.01,draw:(x,tt)=>{
      sw_jun(x,tt,{gaze:[3,0.6],nod:0.05*ag_io(tt,P.adds,P.adds+1.2,0.4),smile:0.3});ag_roomLight(x,1);
      ag_T(x,"skills/reconcile-and-diff/SKILL.md · Causes met so far",1290,180,{w:500,size:28,f:"mono",col:AG.blue,align:"center"});
      for(let i=0;i<3;i++)sw_row(x,860,216+i*94,860,SW_CAUSES[i].title,{a:0.8});
      const n=sw_pop(tt,P.adds+0.1,null);sw_cause(x,860,512,860,SW_CAUSES[3],{a:n.a,k:n.k,edge:AG.blue,parts:1+ag_in(tt,P.answer-0.2,0.4)*2});}},
    // and turns the rule into one more fixed step, with a test; Noor approves it before it runs
    {at:P.rule-0.4,place:"lab",cut:true,keys:[[P.rule-0.4,960,540,1.0],[P.rule-0.3,960,536,1.02]],d:11,push:0.006,draw:(x,tt)=>{ag_roomLight(x,1);
      const ins=ag_eo(clamp((tt-P.fixed+0.4)/1.0,0,1)),s4=sw_slots(4,230),s5b=s5;
      const steps=SW_STEPS_NIGHT.map((l,i)=>{const from=s4[i],to=s5b[i===0?0:i+1];return{x:lerp(from.x,to.x,ins),y:230,w:lerp(from.w,to.w,ins),num:i===0?1:Math.round(lerp(i+1,i+2,ins)),label:l,state:0};});
      const nw=s5b[1];steps.splice(1,0,{x:nw.x,y:230,w:nw.w,num:2,label:SW_NEWSTEP,state:0,a:ag_in(tt,P.fixed-0.1,0.4),k:ag_spr(tt,P.fixed-0.1,0.8),test:ag_in(tt,P.withT-0.1,0.4)});
      sw_rail(x,steps,{p:1});const pa=sw_pop(tt,P.noor-0.3,null);
      sw_whole(x,pa.a,c2=>ag_person(c2,"noor",1660,690,0.8,{t:tt,flip:true,gaze:[3,0.3],smile:0.35}));
      ag_textCard(x,780,560,660,{kick:"Noor Rahman, data architect",title:"Approved, before it runs"},{k:pa.k,a:ag_in(tt,P.appr-0.3,0.4),kickCol:AG.kick,edge:AG.green,icon:"tick",tail:{side:"right",at:0.5,px:1530,py:600}});}},
    // the next night: the fourteen are left out by a fixed step; the count matches; no agent called
    {at:P.next-0.4,place:"swNight",dis:0.8,keys:[[P.next-0.4,960,540,1.0],[P.next-0.3,960,536,1.02]],d:8,push:0.006,draw:(x,tt)=>{
      const sa=ag_in(tt,P.noag-0.5,0.5);sw_model(x,1640,690,46,{t:tt,core:0,a:sa});sw_night(x);
      sw_clock(x,1560,110,"Night of 22 October",ag_in(tt,P.next-0.2,0.4));const on=clamp((tt-P.next)/2.4,0,1)*5;
      const labels=[SW_STEPS_NIGHT[0],SW_NEWSTEP].concat(SW_STEPS_NIGHT.slice(1));
      sw_rail(x,s5.map((s,i)=>({x:s.x,y:s.y,w:s.w,num:i+1,label:labels[i],state:on>i+1?2:on>i?1:0})),{p:1});
      ag_pill(x,s5[1].x+s5[1].w/2,410,"14 left out",{col:AG.green,icon:"tick",a:ag_in(tt,P.leaves,0.4),size:28});
      ag_verdict(x,960,560,"18,412 · matches the census report","pass",ag_in(tt,P.next+2.6,0.4));
      ag_pill(x,1640,800,"no agent called",{a:sa,size:28});}}];
  sw_shots(ctx,S,t,sc.dur,shots);sw_kick(ctx,S,sw_kickA(t),true);});
// the agent at work on the night: the skill's causes checked one by one, none fits; then a read-only query, the records it finds
function sw_finds(x,tt,P){const ax=520,ay=520,fa=ag_in(tt,P.finds-0.3,0.5),u=ag_eo(clamp((tt-P.finds)/0.9,0,1)),d=tt>P.finds+0.9?((tt-P.finds-0.9)*0.5)%1:0;
  sw_model(x,ax,ay,66,{t:tt,core:1,think:0.6});
  // the query tool: read only; the hand reaches it, and the records come back
  if(fa>0.01){ag_tool(x,1300,170,440,130,"Query",{a:fa,touch:ag_in(tt,P.finds+0.6,0.4)});ag_reach(x,[ax+60,ay-30,760,320,1060,240,1290,236],u,{grip:u>0.95?1:0,data:tt<P.feb+1.5?d:0});}
  sw_night(x);ag_model(x,ax,ay,66,{only:"light",t:tt,core:1,think:0.6});
  const ca=ag_io(tt,P.loads-0.2,P.finds-0.2,0.4),sk=sw_pop(tt,P.skill-0.3,null);
  if(ca>0.01){x.save();x.globalAlpha*=ca;sw_slim(x,760,140,1040,SW_SKILLS[SW_RECON][0],SW_SKILLS[SW_RECON][1],{a:sk.a,k:sk.k,lit:1});
    for(let i=0;i<3;i++){const p=sw_pop(tt,P.checks+i*0.3,null),y=290+i*150,b=ag_textCard(x,760,y,1040,{title:SW_CAUSES[i].title,sub:"Shows: "+SW_CAUSES[i].shows},{k:p.k,a:p.a});
      sw_mark(x,b.x+b.w-48,b.y+48,"no",ag_in(tt,P.one+i*0.55,0.3));}
    x.restore();ag_verdict(x,1280,790,"None fits","fail",ag_io(tt,P.none-0.2,P.finds-0.2,0.4));}
  if(fa>0.01){const r=sw_pop(tt,P.fourteen-0.2,null);ag_textCard(x,860,500,760,{kick:"Behind the difference",title:"14 records",sub:tt>P.week-0.2?(tt>P.feb-0.3?"all made last week, all dated back to February":"all made last week"):null},{k:r.k,a:r.a,kickCol:AG.orange,edge:AG.orange});}}

// ---- 7 · Solve it once: al-Khwarizmi's steps followed for centuries; a skill, a router, a workflow; the agent only where thinking is
// needed, and a person decides; each new case written down; solve it once, write it down, reuse it ----
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    once1:wAt(sc,"baghdad","once"),wrote:wAt(sc,"baghdad","wrote it down"),followed:wAt(sc,"baghdad","followed"),
    uni:c.uni,skillW:wAt(sc,"uni","a skill"),router:wAt(sc,"uni","A router"),wf:wAt(sc,"uni","A workflow"),night:wAt(sc,"uni","every night"),
    agent:c.agent,thinking:wAt(sc,"agent","thinking"),decides:wAt(sc,"agent","a person decides"),
    neu:c.new,written:wAt(sc,"new","written down"),never:wAt(sc,"new","never solved"),
    once:c.once,write:wAt(sc,"once","write it down"),reuse:wAt(sc,"once","reuse it")}));
  const shots=[
    // al-Khwarizmi, his book in his hand; his steps followed for centuries
    {at:0,place:"swStudy",keys:[[0,900,560,1.0],[0.1,910,550,1.04]],d:9,push:0.01,draw:(x,tt)=>{
      ag_person(x,SW_FOLK.scholar,700,650,1.0,{t:tt,pose:"hold",gaze:[3,0],holdBack:(c2,h)=>sw_codex(c2,h.near[0]-34,h.near[1]-112,128,160,[118,70,50])});ag_roomLight(x,0.4);
      const p=sw_pop(tt,P.followed-0.3,null);ag_textCard(x,1060,300,640,{kick:"His steps",title:"followed for centuries"},{k:p.k,a:p.a,kickCol:SW_PAL.tag});}},
    // at the university: a skill, a router, a workflow
    {at:P.uni-0.4,place:"lab",dis:0.8,keys:[[P.uni-0.4,960,540,1.0],[P.uni-0.3,960,536,1.02]],d:10,push:0.006,draw:(x,tt)=>{ag_roomLight(x,1);
      [["Done once by hand","A skill",P.skillW],["Finds it","A router",P.router],["Runs what's known","A workflow",P.wf]].forEach(([k,ti,w],i)=>{const p=sw_pop(tt,w-0.2,null);
        ag_textCard(x,160+i*560,300,480,{kick:k,title:ti},{k:p.k,a:p.a,kickCol:AG.blue,edge:AG.blue});});
      sw_clock(x,960,560,"the same way every night",ag_in(tt,P.night-0.3,0.4));}},
    // the agent called only where thinking is needed, and a person decides; each new case written down
    {at:P.agent-0.4,place:"lab",cut:true,keys:[[P.agent-0.4,960,540,1.0],[P.agent-0.3,960,536,1.02]],d:10,push:0.006,draw:(x,tt)=>{ag_roomLight(x,1);
      const s5=sw_slots(5,200),labels=[SW_STEPS_NIGHT[0],SW_NEWSTEP].concat(SW_STEPS_NIGHT.slice(1)),ra=ag_io(tt,P.agent-0.3,P.neu-0.3,0.4);
      if(ra>0.01){x.save();x.globalAlpha*=ra;sw_rail(x,s5.map((s,i)=>({x:s.x,y:s.y,w:s.w,num:i+1,label:labels[i],state:2})),{p:1});
        const g=s5[4],th=ag_in(tt,P.thinking-0.3,0.4);x.save();x.globalAlpha*=th;x.strokeStyle=rgba(AG.violet,0.7);x.lineWidth=3;x.setLineDash([9,9]);x.beginPath();x.moveTo(g.x+g.w/2,330);x.lineTo(g.x+g.w/2,470);x.stroke();x.restore();
        sw_model(x,g.x+g.w/2,530,48,{t:tt,core:th,think:th*0.6,a:th});ag_pill(x,1120,540,"only where thinking is needed",{a:th,size:28});
        ag_verdict(x,1120,640,"a person decides","pass",ag_in(tt,P.decides-0.2,0.4));x.restore();}
      const na=ag_in(tt,P.neu-0.3,0.5);if(na>0.01){ag_T(x,"skills/reconcile-and-diff/SKILL.md · Causes met so far",960,180,{w:500,size:28,f:"mono",col:AG.blue,align:"center",a:na});
        for(let i=0;i<4;i++)sw_row(x,480,220+i*96,960,SW_CAUSES[i].title,{a:na});
        const n=sw_pop(tt,P.written-0.3,null);if(n.a>0.01){const b=sw_row(x,480,604,960,"The next new case",{k:n.k,a:n.a*na});sw_dash(x,b.x,b.y,b.w,b.h,AG.blue,n.a*na*(1-ag_in(tt,P.never,0.5)));}}}},
    // solve it once, write it down, reuse it: the skill, and every agent reading it
    {at:P.once-0.4,place:"lab",cut:true,keys:[[P.once-0.4,960,540,1.0],[P.once-0.3,960,536,1.03]],d:8,push:0.008,draw:(x,tt)=>{ag_roomLight(x,1);
      const k=ag_spr(tt,P.once-0.3,0.8),fa=ag_in(tt,P.once-0.3,0.5)*(1-ag_in(tt,sc.cues.breath-0.3,0.8));sw_file(x,460,170,1000,330,"skills/reconcile-and-diff/SKILL.md",SW_FRONT,{a:fa,k,edge:AG.blue});
      const ev=ag_in(tt,P.reuse-0.2,0.5)*(1-ag_in(tt,sc.cues.breath-0.3,0.8));[[560,720],[960,760],[1360,720]].forEach(([mx,my],i)=>{const a=ev*ag_in(tt,P.reuse-0.2+i*0.2,0.4);if(a<=0.01)return;
        x.save();x.globalAlpha*=a;x.strokeStyle=rgba(AG.blue,0.5);x.lineWidth=3;x.setLineDash([8,8]);x.beginPath();x.moveTo(960,500);x.lineTo(mx,my-48);x.stroke();x.restore();sw_model(x,mx,my,44,{t:tt+i,core:0.8,a});});}}];
  const i=sw_shots(ctx,S,t,sc.dur,shots);
  sw_place(ctx,S,"Baghdad · about 820",ag_io(t,0.4,P.uni-0.4,0.5),0);sw_place(ctx,S,"Today",ag_io(t,P.uni,c.breath,0.5),0);
  ag_end(ctx,S,t,c.breath,SW_TITLE,"Solve it once, write it down, reuse it.","Film 2 of 9","Agents at work on data");});

// the skill chapter opens in the same lab the last one ends in: it comes in on a cut
ag_cutInto(["skill"]);

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
