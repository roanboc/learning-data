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

// The question behind the request, the opening film of Working with people, the second series of Leading data people. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years, dates, sums and shares in words). The few longer stops are in breath.js.
const NARR={
"tower":{"name":"Saving a leaning tower","lead":3.0,"tail":1.0,"vo":[
 {"id":"when","gap":0.8,"text":"Pisa, Italy. Its marble bell tower, begun in 1173, has leaned since it was being built, because the ground beneath it is soft.","say":"Pisa, Italy. Its marble bell tower, begun in eleven seventy-three, has leaned since it was being built, because the ground beneath it is soft."},
 {"id":"lean","gap":0.8,"text":"By 1990, its top hangs about four and a half metres out past its base, and each year it leans a little further.","say":"By nineteen ninety, its top hangs about four and a half metres out past its base, and each year it leans a little further."},
 {"id":"pavia","gap":0.8,"text":"In March 1989, a medieval tower in another Italian city, Pavia, had suddenly collapsed, killing four people.","say":"In March nineteen eighty-nine, a medieval tower in another Italian city, Pavia, had suddenly collapsed, killing four people."},
 {"id":"closed","gap":0.8,"text":"In January 1990, Pisa's tower was closed to visitors, for fear it could fall too.","say":"In January nineteen ninety, Pisa's tower was closed to visitors, for fear it could fall too."},
 {"id":"harm","gap":0.8,"text":"Its stone was fragile: a fall could kill anyone near it, and take from the city the tower people cross the world to see."},
 {"id":"risk","gap":0.8,"text":"And any work was a risk: the slightest disturbance to the ground on its leaning side could bring it down."},
 {"id":"change","gap":0.8,"text":"The tower had to be made safe, without the work itself toppling it."},
 {"id":"committee","gap":0.8,"text":"That spring, Italy's government appointed an international committee: engineers, architects and experts in old monuments."},
 {"id":"meant","gap":0.8,"text":"Before choosing how, they agreed what saving it would mean: a small change, about half a degree, too little for anyone to see."},
 {"id":"enough","gap":0.8,"text":"But enough to ease the strain on its stone, and steady the ground beneath it."},
 {"id":"method","gap":0.8,"text":"Their method: draw a little soil from under the high, north side, so the tower would settle back towards it."},
 {"id":"trial","gap":0.8,"text":"They tried it first on a test footing, while lead weights on the north side held the tower still."},
 {"id":"soil","gap":0.8,"text":"From February 1999, they did it under the tower itself, a little at a time, and it began to lean back.","say":"From February nineteen ninety-nine, they did it under the tower itself, a little at a time, and it began to lean back."},
 {"id":"note","gap":0.8,"text":"Every day, the engineer in charge signed a note: how the tower had moved, and exactly what to take out next."},
 {"id":"less","gap":0.8,"text":"By the summer of 2001, its top had come back about 45 centimetres, to the lean it had in the early 1800s.","say":"By the summer of two thousand and one, its top had come back about forty-five centimetres, to the lean it had in the early eighteen hundreds."},
 {"id":"reopen","gap":0.8,"text":"In December 2001, it reopened to visitors, still leaning, as it always has.","say":"In December two thousand and one, it reopened to visitors, still leaning, as it always has."},
 {"id":"years","gap":0.8,"text":"Its engineers expect at least two hundred years before it leans as far again."},
 {"id":"data","gap":0.8,"text":"At a university, a request for a dashboard hid a decision worth about A$140 million.","say":"At a university, a request for a dashboard hid a decision worth about a hundred and forty million Australian dollars."},
 {"id":"found","gap":0.8,"text":"Half an hour of listening found it, and one page, agreed in writing, turned it into a question the team could answer."}
]},
"ask":{"name":"A dashboard by Easter","lead":1.0,"tail":1.0,"vo":[
 {"id":"series","gap":0.8,"text":"These three films are about working with the people who ask for data."},
 {"id":"email","gap":0.8,"text":"Thursday 11 February 2027: Graham Ellis, new this year as Director of Facilities, emails the data team.","say":"Thursday the eleventh of February, twenty twenty-seven: Graham Ellis, new this year as Director of Facilities, emails the data team."},
 {"id":"asks","gap":0.8,"text":"“Could I have a dashboard of room use, by Easter?”"},
 {"id":"clear","gap":0.8,"text":"It sounds clear: a thing, and a date."},
 {"id":"guess","gap":0.8,"text":"But a request usually names someone's guess at a solution. What it's for, it doesn't say."},
 {"id":"nobody","gap":0.8,"text":"Build exactly what was asked, and a team can deliver on time and still help nobody."},
 {"id":"helena","gap":0.8,"text":"So Helena Novak, the data manager, asks Graham for half an hour, with Noor, the team's data architect."}
]},
"listen":{"name":"Half an hour, mostly listening","lead":1.0,"tail":1.0,"vo":[
 {"id":"meet","gap":0.8,"text":"Tuesday 16 February, in Graham's office. They ask a few open questions, then mostly listen.","say":"Tuesday the sixteenth of February, in Graham's office. They ask a few open questions, then mostly listen."},
 {"id":"decide","gap":0.8,"text":"What will you decide with it? Whether to ask the University Council for a new teaching building: forty rooms, about A$140 million.","say":"What will you decide with it? Whether to ask the University Council for a new teaching building: forty rooms, about a hundred and forty million dollars."},
 {"id":"when","gap":0.8,"text":"By when? His paper is due on 1 June, and the University Council decides on 24 June. Easter was a guess at a safe date.","say":"By when? His paper is due on the first of June, and the University Council decides on the twenty-fourth of June. Easter was a guess at a safe date."},
 {"id":"who","gap":0.8,"text":"Who else decides? The University Council, on his advice. And the academics will read it closely: they say the rooms are always full."},
 {"id":"trust","gap":0.8,"text":"What do you already trust? What he has seen on his walks: empty corridors on Monday mornings and Friday afternoons."},
 {"id":"mind","gap":0.8,"text":"What would change your mind? If rooms are short at every hour, he'll ask to build. If only at some hours, perhaps not."},
 {"id":"schein","gap":0.8,"text":"Edgar Schein called this humble inquiry: asking what you don't already know, out of real interest in the other person."},
 {"id":"rogers","gap":0.8,"text":"Carl Rogers and Richard Farson called the other half active listening: hearing the whole meaning, then saying it back."},
 {"id":"whys","gap":0.8,"text":"Some teams ask “why?” five times over. Asked bluntly, it can sound like doubt; “what will you decide with it?” gets there kindly."}
]},
"agree":{"name":"Say it back, write it down","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"Near the end, Helena says back what she heard: a decision about a building, and a question about how the rooms are used."},
 {"id":"used","gap":0.8,"text":"Graham stops her at one word: by “used”, he means people in the room. A booking isn't use."},
 {"id":"data","gap":0.8,"text":"That one word decides the data: the timetable's bookings, beside the head counts from each room's sensor."},
 {"id":"pisa","gap":0.8,"text":"In Pisa, saving meant half a degree, not a straight tower. Here, use means people in the room, not bookings."},
 {"id":"write","gap":0.8,"text":"Then Noor writes the question down with him, on one page."},
 {"id":"question","gap":0.8,"text":"“Do we have too few rooms, or too few at some hours?”"},
 {"id":"under","gap":0.8,"text":"Under it go the decision, the dates, who decides, what would change his mind, and what “used” means."},
 {"id":"words","gap":0.8,"text":"His own words stay at the top, beside the question, so anyone can see how one became the other."},
 {"id":"reply","gap":0.8,"text":"That afternoon, Graham replies to the page: “Yes, that's it.”"}
]},
"answer":{"name":"What the question gave","lead":1.0,"tail":1.0,"vo":[
 {"id":"wait","gap":0.8,"text":"Then the request waits its turn, like every other, until the team takes it up on Tuesday 30 March.","say":"Then the request waits its turn, like every other, until the team takes it up on Tuesday the thirtieth of March."},
 {"id":"ivy","gap":0.8,"text":"In March, Ivy Reyes, a new graduate analyst, follows that question through the team's work, starting from the page."},
 {"id":"start","gap":0.8,"text":"On 30 March, the team starts from the same page, and by 23 April it has an answer.","say":"On the thirtieth of March, the team starts from the same page, and by the twenty-third of April it has an answer."},
 {"id":"week","gap":0.8,"text":"Across the whole week, the rooms are booked only 38% of the time.","say":"Across the whole week, the rooms are booked only thirty-eight percent of the time."},
 {"id":"peak","gap":0.8,"text":"But between 10:00 and 14:00, Tuesday to Thursday, 93% of them are booked.","say":"But between ten and two, Tuesday to Thursday, ninety-three percent of them are booked."},
 {"id":"empty","gap":0.8,"text":"And one booked hour in five, the sensors counted nobody there."},
 {"id":"so","gap":0.8,"text":"So the answer to his question: not too few rooms, but too few at some hours."},
 {"id":"both","gap":0.8,"text":"The academics were right about the peak, and Graham about Monday mornings: the week's average had hidden both."},
 {"id":"dash","gap":0.8,"text":"A dashboard by Easter might have shown that average, and settled nothing."},
 {"id":"instead","gap":0.8,"text":"Instead, he had an answer to the question his decision turned on, weeks before his paper was due."}
]},
"monday":{"name":"On Monday","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"In Pisa, the committee didn't start by digging. It first agreed what saving the tower would mean."},
 {"id":"daily","gap":0.8,"text":"Then every day, a signed note said how it had moved, and what to do next."},
 {"id":"same","gap":0.8,"text":"Graham's request got the same care: the decision found, the question agreed in writing, and an answer in time."},
 {"id":"form","gap":0.8,"text":"From June, the team's front door, a form, asks five questions like these. A form can ask; listening hears what the answers mean."},
 {"id":"monday","gap":0.8,"text":"On Monday, when someone asks you for a report or a dashboard, ask what they'll decide with it, and by when."},
 {"id":"who","gap":0.8,"text":"Ask who else decides, what they already trust, and what would change their mind."},
 {"id":"listen","gap":0.8,"text":"Listen more than you talk, and say back what you heard."},
 {"id":"write","gap":0.8,"text":"Then write the question down beside their words, and agree it with them."},
 {"id":"take","gap":0.8,"text":"Ask what it's for, and agree it in writing."}
]}
};

const VODUR={"tower/when": 9.148, "tower/lean": 6.888, "tower/pavia": 8.276, "tower/closed": 5.595, "tower/harm": 7.006, "tower/risk": 5.73, "tower/change": 3.451, "tower/committee": 7.594, "tower/meant": 7.396, "tower/enough": 3.88, "tower/method": 5.887, "tower/trial": 4.934, "tower/soil": 6.882, "tower/note": 6.577, "tower/less": 8.394, "tower/reopen": 5.746, "tower/years": 4.411, "tower/data": 7.199, "tower/found": 6.672, "ask/series": 3.687, "ask/email": 8.208, "ask/asks": 2.399, "ask/clear": 2.126, "ask/guess": 5.052, "ask/nobody": 4.897, "ask/helena": 6.605, "listen/meet": 6.664, "listen/decide": 8.698, "listen/when": 9.296, "listen/who": 8.456, "listen/trust": 6.641, "listen/mind": 6.738, "listen/schein": 6.981, "listen/rogers": 6.829, "listen/whys": 8.108, "agree/back": 6.879, "agree/used": 5.671, "agree/data": 6.309, "agree/pisa": 6.527, "agree/write": 3.253, "agree/question": 2.662, "agree/under": 5.56, "agree/words": 5.651, "agree/reply": 3.664, "answer/wait": 6.282, "answer/ivy": 7.275, "answer/start": 6.213, "answer/week": 4.164, "answer/peak": 4.782, "answer/empty": 3.479, "answer/so": 4.58, "answer/both": 6.101, "answer/dash": 3.859, "answer/instead": 5.445, "monday/back": 5.538, "monday/daily": 4.109, "monday/same": 6.744, "monday/form": 7.988, "monday/monday": 5.962, "monday/who": 4.183, "monday/listen": 2.633, "monday/write": 3.503, "monday/take": 2.247};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: Graham's request and the question behind it, side by side on one page, as they become the title card; and the
   film's last line, alone on the page, as it becomes the end card. */
const BREATH={
"tower":{"hold":{"when":1.2,"lean":1.0,"pavia":1.0,"closed":1.0,"harm":1.0,"risk":1.0,"change":1.2,"committee":0.8,"meant":1.0,"enough":1.2,"method":1.0,"trial":1.0,"soil":1.2,"note":1.2,"less":1.0,"reopen":1.0,"years":1.2,"data":0.8},"breathe":5.6},
"ask":{"hold":{"series":1.0,"email":0.8,"asks":1.2,"clear":0.8,"guess":1.2,"nobody":1.2}},
"listen":{"hold":{"meet":1.0,"decide":1.2,"when":1.2,"who":1.2,"trust":1.2,"mind":1.4,"schein":1.0,"rogers":1.0}},
"agree":{"hold":{"back":1.0,"used":1.4,"data":1.2,"pisa":1.0,"write":0.8,"question":1.4,"under":1.0,"words":1.2}},
"answer":{"hold":{"wait":1.0,"ivy":1.0,"start":1.0,"week":1.0,"peak":1.2,"empty":1.2,"so":1.4,"both":1.2,"dash":1.0}},
"monday":{"hold":{"back":1.0,"daily":1.0,"same":1.2,"form":1.2,"monday":0.8,"who":0.8,"listen":0.8,"write":1.0},"breathe":5.0}
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
  tomas:{name:"Tomás Ortega",role:"Report developer",skin:[206,158,122],hair:{style:"short",c:[52,40,34]},beard:[64,50,44],top:{kind:"sweater",c:[150,96,90]},bottom:{kind:"trousers",c:[70,72,84]},shoe:[58,46,42]},
  // who explains a film's concepts at a board (PK.teach): a consultant who works with the team now and then
  carmen:{name:"Carmen Vidal",role:"Consultant",skin:[176,124,92],hair:{style:"bun",c:[168,164,166]},glasses:[60,44,44],top:{kind:"jacket",c:[236,222,196],inner:[86,112,120]},bottom:{kind:"trousers",c:[98,80,92]},shoe:[70,50,52]}
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
  // what the kit's checks follow about everyone a film draws (tools/people.py sets PK.watch): not a small picture of someone (o.icon),
  // and someone on a screen (o.screen: a tile of a call) is followed as that, not as someone in the room
  const seen=J=>{if(K.watch&&!o.icon)K.watch({who:typeof who==="string"?who:(P.key||P.name||"someone"),kid:!!P.kid,x,floor,h,flip:o.flip===true?1:(o.flip||0),part:o.part||"whole",mode:pose.mode||"stand",screen:!!o.screen,
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
     PK.end(ctx, S, t, t0, title, line, n, series, o)   the end card, the same way: the film ends on a person, with its last line
                                        (on two lines, it breaks evenly, after a comma where one falls near the middle) */
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
  // a tail to something beside the bubble, level with it (a tile of a call, a screen), comes out of its side
  if(tail&&(tail[0]<bx-8||tail[0]>bx+w+8)&&tail[1]>by-8&&tail[1]<by+h+8){const left=tail[0]<bx,base=left?bx:bx+w,dir=left?-1:1,tcy=clamp(tail[1],by+34,by+h-34),tip=[lerp(base,tail[0],0.78),lerp(tcy,tail[1],0.85)];
    ctx.beginPath();pg(ctx,[[base-dir*6,tcy-17],[base-dir*6,tcy+17],tip]);ctx.lineJoin="round";if(ink){ctx.lineWidth=5;ctx.strokeStyle=css(ink);ctx.stroke();}ctx.fillStyle=css(col);ctx.fill();
    K.box(ctx,bx,by,w,h,26,col,1);ctx.fillStyle=css(col);ctx.beginPath();pg(ctx,[[base-dir*5,tcy-14],[base-dir*5,tcy+14],[base+dir*3,tcy+12],[base+dir*3,tcy-12]]);ctx.fill();}
  else if(tail){const below=tail[1]>y,base=below?by+h:by,dir=below?1:-1,tcx=clamp(tail[0],bx+44,bx+w-44),tip=[lerp(tcx,tail[0],0.85),lerp(base,tail[1],0.72)];
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
// a line that needs two lines breaks where it reads best: as evenly as it can, and after a comma or a stop where one falls near the middle,
// never leaving a word or two alone on the second line ("Own what it's for, / not only what you did.")
const even=(ctx,s,maxW,o)=>{const g=ag_wrap(ctx,s,maxW,o);if(g.length!==2)return g;const ws=String(s).split(" ");let best=g,sc=Infinity;
  for(let i=1;i<ws.length;i++){const a=ws.slice(0,i).join(" "),b=ws.slice(i).join(" "),wa=ag_tw(ctx,a,o),wb=ag_tw(ctx,b,o);if(wa>maxW||wb>maxW)continue;
    const v=Math.abs(wa-wb)-(/[,;:.!?]$/.test(a)?maxW*0.25:0);if(v<sc){sc=v;best=[a,b];}}return best;};
K.end=(ctx,S,t,t0,title,line,n,series,o)=>{o=o||{};const oA=pin(t,t0,1.0),tA=pin(t,t0+0.6,0.9);if(oA<=0)return;veil(ctx,S,oA,o.side);setScreen(ctx,S);const x=o.side==="right"?1060:150;
  ctx.save();ctx.globalAlpha*=tA;if(line){const ls=even(ctx,line,760,{w:700,size:46});ls.forEach((l,i)=>tx(ctx,l,x,330+i*62-(ls.length-1)*31,{w:700,size:46}));}
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
// what a place is painted with, for the kit's other files (concepts.js) and a film's own places: PK.paint.wall(ctx, col, y1) and the rest
K.paint={wall,floorAt,skirting,rug,shelf,grad};
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
   o.sx where it stands, o.sw and o.sh its size; o.keysBack (0 to 1): its keyboard pushed back towards it, to make room for a
   notebook) or null. o.on(ctx, D) draws what else is on the desk. The rest as PK.person's.
   Returns the person's joints, with J.desk = D: {x0, x1 (its near and far end), cx, top, floor, dir, w, k}. who null: the desk
   and its chair stand empty. */
K.atDesk=(ctx,who,x,floor,h,o)=>{o=Object.assign({},o||{});const S=K.S,dir=o.flip?-1:1,w=o.w||0.62*h,top=floor-0.43*h,x0=x+dir*0.1*h,x1=x0+dir*w,k=h/660,
    D={x0,x1,cx:(x0+x1)/2,top,floor,dir,w,k},turn=clamp(o.turn||0,0,1),work=(o.work==null?1:o.work)*(1-pin(turn,0,0.3)),pose=K.poseMix(o.pose||"sit",o.workPose||"sitWork",work),
    fl=dir<0?1-turn:turn,lw={lw:clamp(h*0.0056,1.4,6.5),sh:clamp(h*0.0078,1.5,8.5)},po=Object.assign({},o,{flip:fl});
  S.begin(ctx,lw);K.chair(ctx,x-Math.cos(Math.PI*fl)*0.012*h,floor,h,fl,{col:o.chair,swivel:o.swivel!==false});
  if(who)K.person(ctx,who,x,floor,h,pose,Object.assign({},po,{part:"lower",busy:work>=0.5}));
  S.begin(ctx,lw);K.desk(ctx,D.cx,top,w,floor,{col:o.deskCol,k:h/600});
  if(o.screen==="monitor"){K.monitor(ctx,o.sx==null?x0+dir*w*0.6:o.sx,top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    S.begin(ctx,lw);S.fill(ctx,c=>rrect(c,Math.min(x0+dir*0.1*h,x0+dir*0.27*h)+dir*0.17*h*clamp(o.keysBack||0,0,1),top-0.012*h,0.17*h,0.012*h,3),lt(C("laptop"),0.25),{w:0.7});}
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

/* ===== The people kit: the handwriting font =====
   Notes in a book and words on a board are written by hand, so the kit carries a handwriting font of its own: Kalam, by Indian Type
   Foundry, under the SIL Open Font License 1.1 (fonts/OFL-Kalam.txt), in two weights: 400 for a pen, 700 for a heading or a board's
   marker. These are its Latin subsets from Google Fonts (version 18, checked 17 November 2026), carried in the film's own script,
   so the film looks the same in the video, in the site's player and in the checks, with no network. hand.js loads them before the
   film starts. Never edit this file: python tools/font.py writes it again from the two .woff2 files in fonts/. */
(K=>{K.KALAM={
400:"data:font/woff2;base64,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",
700:"data:font/woff2;base64,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"};
})(PK);

/* ===== The people kit: handwriting =====
   A film's key ideas stand apart from its scenes (the author, 17 November 2026: "important information now too merged in the
   scene"). The ideas a film opens with are explained by someone at a board; what to remember, a remark or a conclusion, is a
   person's colourful notes in a book. Both are written by hand as the voice says them, in the kit's handwriting font (kalam.js),
   with a pen's marks round them: a line under a heading, a highlighter's band, a ring, a box, an arrow, a tick. This file holds
   the writing; concepts.js holds the board and the book.

     PK.hand(ctx, s, x, y, o)   words written by hand, their baseline at (x, y). o.size (48), o.w (400; 700 for a heading or a
                                marker), o.col, o.p (0 to 1: how far they are written, from the left), o.a, o.align, o.deco
                                (decoration: too small to read on purpose, as on a board far off). -> {w, x0, x1, pen}
     PK.handW(ctx, s, size, w)  how wide they are
     PK.pen.<mark>(…)           a pen's mark, as rows of points: line, under, hl, strike, box, ring, arrow, tick, cross, star
     PK.strokes(ctx, rows, col, w, p, o)   draws a mark as far as p (0 to 1) -> where the pen is
     PK.ink(ctx, items, t, o)   a board's or a page's writing, item by item, each when its time comes -> where the pen is

   PK.ink's items are rows, drawn in the order given, in the surface's own px from its top left corner:
     {s, x, y, at, d, size, w, col, align, marks}   words. at: when the pen starts, in the scene's seconds (none: they are there
          from the start); d: how long the pen takes (by default from their length). marks: what the pen adds once they are
          written, each [kind, col, at, d]: "under" (a line under them), "under2" (two), "hl" (a highlighter's band), "strike"
          (a line through them: what isn't so), "box" or "ring" (round them). A mark comes right after the words, one after
          the other, unless it has an at of its own. Words with no x go on from the words before them, on their line, a
          space on (gap): a few words of a line in another colour or weight
     {k, at, d, col, …}    a mark of its own: k "line" or "arrow" (x, y, x1, y1, bow), "box" (x, y, w, h), "ring" (x, y, rx, ry),
          "tick", "cross", "star" or "dot" (x, y, r), "hl" or "under" (x, y, w, size)
     {draw(ctx, p, it), at, d, pen(p)}   a drawing of the film's own, p from 0 to 1 (pen: where its pen is)
   A colour is one of the kit's names ("ink", "blue", "green", "amber", "orange", "mut") or [r, g, b]. Colour keeps its meaning
   in handwriting too: ink for the words; blue a plan or a rule, green something done or of value, amber a risk or a cost, orange
   data, for a heading's line, a highlight or a mark. o: {x, y (the surface's corner in the picture), k (its scale), a, lw (the
   pen's width: 5; a marker's 7), deco, aside (1.4: between two items no further apart than this, the pen stays over the page)}.
   -> {pen: [x, y] in the picture, on: 0 to 1 (how far the pen is down on the surface), lift, i (the item), col (its colour)}
   Handwriting is 40 px or more as it is seen: 44 to 56 for a line, 60 to 84 for a heading. */
(K=>{
const {TAU,lerp,clamp,sine,pin,mix,css}=K.u;
K.FT_HAND="Kalam,'Segoe Print','Bradley Hand','Comic Sans MS',cursive";
if(typeof FT!=="undefined")FT.hand=K.FT_HAND;
// the font's two weights, from the film's own script: loading starts here, and the film waits for the page's fonts before it starts
K.handReady=(()=>{try{if(typeof FontFace==="undefined"||typeof document==="undefined"||!document.fonts||!K.KALAM)return Promise.resolve(false);
  return Promise.all([400,700].map(w=>{const f=new FontFace("Kalam","url("+K.KALAM[w]+") format('woff2')",{weight:String(w),style:"normal"});document.fonts.add(f);return f.load();})).then(()=>true,()=>false);}
  catch(e){return Promise.resolve(false);}})();
// a highlighter's colours: the five meanings, light enough to write over
K.HL={blue:[160,204,242],green:[164,222,180],amber:[250,214,122],orange:[250,190,152],violet:[204,194,246],mut:[222,216,206],ink:[222,216,206]};
const colOf=c=>Array.isArray(c)?c:(c&&K.C[c])||K.C.ink,hlOf=c=>Array.isArray(c)?c:(c&&K.HL[c])||K.HL.amber;
K.inkCol=colOf;

K.handW=(ctx,s,size,w)=>ag_tw(ctx,s,{w:w||400,size:size||48,f:"hand"});
K.hand=(ctx,s,x,y,o)=>{o=o||{};const size=o.size||48,wt=o.w||400,W=K.handW(ctx,s,size,wt),p=o.p==null?1:clamp(o.p,0,1),x0=o.align==="center"?x-W/2:o.align==="right"?x-W:x;
  if(p>0&&(o.a==null||o.a>0.004)){ctx.save();if(o.a!=null)ctx.globalAlpha*=clamp(o.a,0,1);
    if(p<1){ctx.beginPath();ctx.rect(x0-8,y-size*1.15,(W+16)*p,size*1.7);ctx.clip();}
    ag_T(ctx,s,x0,y,{w:wt,size,f:"hand",color:css(colOf(o.col)),deco:o.deco||K.inkDeco});ctx.restore();}
  return{w:W,x0,x1:x0+W,pen:[x0+W*p,y-size*0.26]};};

/* ---------------------------------------------------------------- a pen's marks
   A pen's line isn't ruled: its points sway a little, the same way every time. Each mark is rows of points (a row is one stroke),
   so it can be drawn as far as the pen has come. */
const sway=(i,seed,amp)=>(Math.sin(i*0.83+seed*1.7)+0.6*Math.sin(i*2.1+seed*0.9))*amp/1.6;
const seg=(x0,y0,x1,y1,o)=>{o=o||{};const L=Math.hypot(x1-x0,y1-y0)||1,n=Math.max(2,Math.round(L/10)),nx=-(y1-y0)/L,ny=(x1-x0)/L,amp=o.amp==null?1.5:o.amp,out=[];
  for(let i=0;i<=n;i++){const u=i/n,d=(o.bow||0)*Math.sin(Math.PI*u)+(i&&i<n?sway(i,o.seed||0,amp):0);out.push([lerp(x0,x1,u)+nx*d,lerp(y0,y1,u)+ny*d]);}return out;};
K.pen={
  line:(x0,y0,x1,y1,o)=>[seg(x0,y0,x1,y1,o)],
  under:(x,y,w,o)=>{o=o||{};const g=o.gap==null?10:o.gap,a=[seg(x-4,y+g,x+w+6,y+g-2,{seed:x+y,bow:-1.5})];if(o.two)a.push(seg(x+w+2,y+g+9,x-2,y+g+10,{seed:x+y+3,bow:1}));return a;},
  hl:(x,y,w,size)=>[seg(x-8,y-size*0.3,x+w+8,y-size*0.3-1,{seed:x+y,amp:0.8})],          // drawn wide, with a flat end
  strike:(x,y,w,size)=>[seg(x-8,y-size*0.26,x+w+8,y-size*0.32,{seed:x+y,bow:1.5})],
  box:(x,y,w,h,o)=>{const s=x+y,j=i=>sway(i,s,2.4),a=[x+j(1),y+j(2)],b=[x+w+j(3),y+j(4)],c=[x+w+j(5),y+h+j(6)],d=[x+j(7),y+h+j(8)];
    return[[].concat(seg(a[0]+8,a[1],b[0],b[1],{seed:s}),seg(b[0],b[1],c[0],c[1],{seed:s+1}).slice(1),seg(c[0],c[1],d[0],d[1],{seed:s+2}).slice(1),seg(d[0],d[1],a[0]-1,a[1]-2,{seed:s+3}).slice(1),[[a[0]+16,a[1]-3]])];},
  ring:(cx,cy,rx,ry,o)=>{o=o||{};const n=Math.max(26,Math.round((rx+ry)/5)),a0=o.a0==null?-2.5:o.a0,out=[];
    for(let i=0;i<=n;i++){const u=i/n,a=a0+u*TAU*1.07,g=1+0.06*(u-0.5)+0.012*Math.sin(u*9+cx);out.push([cx+Math.cos(a)*rx*g,cy+Math.sin(a)*ry*g]);}return[out];},
  arrow:(x0,y0,x1,y1,o)=>{o=o||{};const b=seg(x0,y0,x1,y1,{bow:o.bow||0,seed:x0+y1,amp:1}),n=b.length,e=b[n-1],q=b[Math.max(0,n-3)],g=Math.atan2(e[1]-q[1],e[0]-q[0]),h=o.head||22;
    return[b,[[e[0]-Math.cos(g-0.5)*h,e[1]-Math.sin(g-0.5)*h],e,[e[0]-Math.cos(g+0.5)*h,e[1]-Math.sin(g+0.5)*h]]];},
  tick:(x,y,r)=>[[[x-r*0.58,y-r*0.02],[x-r*0.34,y+r*0.2],[x-r*0.14,y+r*0.44],[x+r*0.06,y+r*0.12],[x+r*0.34,y-r*0.3],[x+r*0.66,y-r*0.66]]],
  cross:(x,y,r)=>[seg(x-r*0.6,y-r*0.6,x+r*0.6,y+r*0.6,{seed:x,amp:0.8}),seg(x+r*0.6,y-r*0.62,x-r*0.6,y+r*0.58,{seed:y,amp:0.8})],
  star:(x,y,r)=>{const out=[];for(let i=0;i<=5;i++){const a=-Math.PI/2+i*TAU*0.4;out.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}return[out];}
};
const lenOf=rows=>{let L=0;for(const r of rows)for(let i=1;i<r.length;i++)L+=Math.hypot(r[i][0]-r[i-1][0],r[i][1]-r[i-1][1]);return L;};
// the box a mark's points lie in: [x0, y0, x1, y1]
const boxOf=rows=>{const b=[1e9,1e9,-1e9,-1e9];for(const r of rows)for(const q of r){b[0]=Math.min(b[0],q[0]);b[1]=Math.min(b[1],q[1]);b[2]=Math.max(b[2],q[0]);b[3]=Math.max(b[3],q[1]);}return b;};
K.strokes=(ctx,rows,col,w,p,o)=>{o=o||{};p=p==null?1:clamp(p,0,1);let end=rows[0][0];if(p<=0)return end;
  let left=lenOf(rows)*p+0.01;ctx.save();if(o.a!=null)ctx.globalAlpha*=clamp(o.a,0,1);ctx.strokeStyle=css(colOf(col));ctx.lineWidth=w||5;ctx.lineCap=o.cap||"round";ctx.lineJoin="round";ctx.beginPath();
  for(let k=0;k<rows.length&&left>0;k++){const r=rows[k];ctx.moveTo(r[0][0],r[0][1]);end=r[0];
    for(let i=1;i<r.length&&left>0;i++){const d=Math.hypot(r[i][0]-r[i-1][0],r[i][1]-r[i-1][1]);
      if(d>left){const u=left/(d||1);end=[lerp(r[i-1][0],r[i][0],u),lerp(r[i-1][1],r[i][1],u)];ctx.lineTo(end[0],end[1]);left=0;}else{ctx.lineTo(r[i][0],r[i][1]);end=r[i];left-=d;}}}
  ctx.stroke();ctx.restore();return end;};
// where a mark's pen is at p, without drawing it
const penOn=(rows,p)=>{let left=lenOf(rows)*clamp(p,0,1),end=rows[0][0];for(const r of rows){end=r[0];for(let i=1;i<r.length;i++){const d=Math.hypot(r[i][0]-r[i-1][0],r[i][1]-r[i-1][1]);
    if(d>=left)return[lerp(r[i-1][0],r[i][0],left/(d||1)),lerp(r[i-1][1],r[i][1],left/(d||1))];left-=d;end=r[i];}}return end;};

/* ---------------------------------------------------------------- a surface's writing
   Every stroke of the pen on a board or a page, in the order it is drawn: {i (its item), t0, t1, col, draw(ctx, p), at(p), box
   ([x0, y0, x1, y1]: where it lies), text (words), line (a line drawn along something: a writer walks along it)} */
const durOf=s=>clamp(0.3+String(s).length*0.05,0.5,2.6);
function plan(ctx,items,o){const out=[],lw=o.lw||5;let last=null;
  items.forEach((it,i)=>{const timed=it.at!=null,t0=timed?it.at:-1e9;
    if(it.s!=null){const size=it.size||48,wt=it.w||400,W=K.handW(ctx,it.s,size,wt),
        // words with no x go on from the words before them, on their line, a space on (another colour or weight in one line)
        ix=it.x!=null?it.x:last?last.x1+(it.gap==null?size*0.3:it.gap):0,iy=it.y!=null?it.y:last?last.y:0,
        x0=it.align==="center"?ix-W/2:it.align==="right"?ix-W:ix,d=it.d||durOf(it.s),t1=timed?t0+d:-1e9,col=colOf(it.col||o.col);last={x1:x0+W,y:iy};
      const words={i,t0,t1,own:timed,col,text:true,x0,x1:x0+W,box:[x0,iy-size*0.78,x0+W,iy+size*0.24],draw:(c,p)=>K.hand(c,it.s,x0,iy,{size,w:wt,col,p,deco:o.deco}),at:p=>[x0+W*p,iy-size*0.26]},under=[],over=[];let tm=t1+0.18;
      (it.marks||[]).forEach((m,mi)=>{const [kind,mc,mat,md]=m,hl=kind==="hl",c2=hl?hlOf(mc):colOf(mc||it.col),dd=md||(hl?0.5:kind==="ring"||kind==="box"?0.6:0.4),a0=!timed?-1e9:mat!=null?mat:tm;if(timed&&mat==null)tm=a0+dd+0.12;
        const line=kind!=="box"&&kind!=="ring",r0=kind==="hl"?K.pen.hl(x0,iy,W,size):kind==="under"?K.pen.under(x0,iy,W):kind==="under2"?K.pen.under(x0,iy,W,{two:true}):kind==="strike"?K.pen.strike(x0,iy,W,size):
          kind==="box"?K.pen.box(x0-16,iy-size*0.98,W+32,size*1.36):K.pen.ring(x0+W/2,iy-size*0.3,W/2+36,size*0.86),
          // a writer who walks along a board (o.walk) draws a line back along the words, from where they stand
          rows=o.walk&&line?r0.map(r=>r.slice().reverse()):r0;
        (hl?under:over).push({i,m:mi,t0:a0,t1:timed?a0+dd:-1e9,own:timed&&mat!=null,col:c2,line,box:boxOf(rows),draw:(c,p)=>K.strokes(c,rows,c2,hl?size*0.66:lw*(kind==="strike"?1.1:1),p,hl?{cap:"butt",a:0.78}:{}),at:p=>penOn(rows,p)});});
      out.push(...under,words,...over);return;}
    if(it.draw){const d=it.d||0.6,at=p=>it.pen?it.pen(p):[it.x||0,it.y||0];out.push({i,t0,t1:timed?t0+d:-1e9,own:timed,col:colOf(it.col||o.col),box:it.box||boxOf([[at(0),at(0.25),at(0.5),at(0.75),at(1)]]),draw:(c,p)=>it.draw(c,p,it),at});return;}
    const k=it.k,col=k==="hl"?hlOf(it.col):colOf(it.col||o.col),d=it.d||(k==="dot"?0.2:k==="tick"||k==="cross"?0.35:k==="hl"?0.5:0.55),t1=timed?t0+d:-1e9;
    if(k==="dot"){out.push({i,t0,t1,own:timed,col,box:[it.x-(it.r||7),it.y-(it.r||7),it.x+(it.r||7),it.y+(it.r||7)],draw:(c,p)=>{c.save();c.fillStyle=css(col);c.beginPath();c.arc(it.x,it.y,(it.r||7)*sine(p),0,TAU);c.fill();c.restore();},at:()=>[it.x,it.y]});return;}
    const rows=k==="line"?K.pen.line(it.x,it.y,it.x1,it.y1,{bow:it.bow,seed:it.x+it.y}):k==="arrow"?K.pen.arrow(it.x,it.y,it.x1,it.y1,{bow:it.bow,head:it.head}):k==="box"?K.pen.box(it.x,it.y,it.w,it.h):
      k==="ring"?K.pen.ring(it.x,it.y,it.rx,it.ry):k==="tick"?K.pen.tick(it.x,it.y,it.r||18):k==="cross"?K.pen.cross(it.x,it.y,it.r||18):k==="star"?K.pen.star(it.x,it.y,it.r||18):
      k==="hl"?K.pen.hl(it.x,it.y,it.w,it.size||48):k==="under"?K.pen.under(it.x,it.y,it.w,{two:it.two}):null;
    if(!rows)throw new Error("PK.ink: no mark called "+k);
    out.push({i,t0,t1,own:timed,col,line:k==="line"||k==="arrow"||k==="hl"||k==="under",box:boxOf(rows),draw:(c,p)=>K.strokes(c,rows,col,k==="hl"?(it.size||48)*0.66:(it.lw||lw),p,k==="hl"?{cap:"butt",a:0.78}:{}),at:p=>penOn(rows,p)});});
  return out;}
// every timed stroke, in the order the pen draws them: what a writer's hand and feet follow (concepts.js); all: also what is there
// from the start, in the order given
K.inkPlan=(ctx,items,o,all)=>{const P=plan(ctx,items,o||{});return all?P:P.filter(s=>s.t1>-1e8).sort((x,y)=>x.t0-y.t0);};
K.ink=(ctx,items,t,o)=>{o=o||{};const k=o.k||1,ox=o.x||0,oy=o.y||0,P=plan(ctx,items,o),aside=o.aside==null?1.4:o.aside,a=o.a==null?1:clamp(o.a,0,1);
  // what a row draws of its own (a designed board's or page's drawing, PK.sk) is decoration too where the surface is (PK.inkDeco)
  if(a>0.004){const d0=K.inkDeco;K.inkDeco=!!o.deco;ctx.save();try{ctx.translate(ox,oy);ctx.scale(k,k);ctx.globalAlpha*=a;for(const s of P){const p=s.t1<=-1e8?1:clamp((t-s.t0)/((s.t1-s.t0)||1),0,1);if(p>0)s.draw(ctx,p);}}finally{ctx.restore();K.inkDeco=d0;}}
  // where the pen is: on the stroke being drawn; between two strokes close in time, on its way from one to the next; else lifted away
  const T=P.filter(s=>s.t1>-1e8).sort((x,y)=>x.t0-y.t0);let cur=null,pv=null,nx=null;
  for(const s of T){if(t>=s.t0&&t<=s.t1){if(!cur)cur=s;}else if(s.t1<t){if(!pv||s.t1>=pv.t1)pv=s;}else if(!nx||s.t0<nx.t0)nx=s;}
  const out=q=>[ox+q[0]*k,oy+q[1]*k];
  if(cur)return{pen:out(cur.at(clamp((t-cur.t0)/((cur.t1-cur.t0)||1),0,1))),on:1,lift:0,i:cur.i,col:cur.col};
  if(pv&&nx&&nx.t0-pv.t1<=aside){const u=sine((t-pv.t1)/((nx.t0-pv.t1)||1)),A=pv.at(1),B=nx.at(0);return{pen:out([lerp(A[0],B[0],u),lerp(A[1],B[1],u)]),on:1,lift:Math.sin(Math.PI*u),i:u<0.5?pv.i:nx.i,col:u<0.5?pv.col:nx.col};}
  const kOut=pv?1-pin(t,pv.t1+0.2,0.5):0,kIn=nx?pin(t,nx.t0-0.6,0.5):0;
  if(kIn>=kOut&&nx)return{pen:out(nx.at(0)),on:kIn,lift:1-kIn,i:nx.i,col:nx.col};
  if(pv)return{pen:out(pv.at(1)),on:kOut,lift:1-kOut,i:pv.i,col:pv.col};
  return{pen:null,on:0,lift:1,i:-1,col:K.C.ink};};
})(PK);

/* ===== The people kit: key ideas, apart from the scene =====
   A film moves between people and its key ideas (the author, 17 November 2026). Two devices hold the ideas, both written by hand
   (hand.js), and both keep a person in the picture:
     a board   the ideas a film opens with, explained by someone at a board: a consultant, a teacher, a colleague. They write
               each line as the voice says it, then turn to the room.
     a book    what to remember: a remark, a conclusion, the film's takeaway, as someone's colourful notes in their notebook,
               seen from above, their hand writing them.
   A scene shows who writes and where (the consultant at the room's board; Ivy opening her notebook at her desk); then the film
   cuts or dissolves to the board or the page, close enough to read, and back to the people.

     PK.place.board      a wall with a wide board, close enough to read, and floor enough for whoever explains to stand whole.
                         PK.ROOMS.board: eye, floor, h (their height), board {x, y, w, h}, rest (where they stand aside),
                         reach [y0, y1] (the band of the board's own px a hand reaches: keep every line's baseline inside it)
     PK.teach(ctx, who, t, items, o)   someone explains at a board. items: PK.ink's rows, in the board's own px from its top left
                         corner. The explainer faces the board to write, standing to the right of the marker so that what they
                         write stays in view, and walks along as a line grows. Then they turn to the room and step to the right
                         of all that is written, so nobody has to read round them: at once after the last line, and between
                         two lines when the next leaves the time to come back. They start at o.rest, beyond the board.
                         o: x, y (the board's corner), k (the writing's scale), floor, h, rest, face (how far they turn to the
                         room: 0.66), stand ("clasp"), say ([[t0, t1], …]: when they speak), events (PK.face's), deco, a (fades
                         the writing). who null: only the writing. -> their joints, with J.pen (PK.ink's result) and J.late
                         On a board far off (the room's own, in a wide shot) give k and deco: the words are too small to read
                         there on purpose, since the close view shows them.
     PK.pace(ctx, who, rows)   the rows, each moved as much later as whoever writes them needs to walk to it. Give each row the
                         time the voice says it, pace them once, and hand the result to every PK.teach that shows them.
     Lay a board out for someone who walks (the check, people.py, lists what goes against these):
       - they walk about 0.95 of their height a second, so a new row costs its walk back: about 0.8 s for a row 500 px long.
         PK.pace makes the row wait for it, and a row that waits is written after the voice has said it. So write on from left
         to right: a few words in another colour go on along their line (a row with no x); a short row under a long one starts
         where the long one ended, not at the left again; what the voice says first is written first;
       - writing below the top of their head (the board's y 130 and below) is hidden while they stand in front of it. They step
         clear by themselves (about 1 s for 600 px): leave that, and a second to read, before the film cuts away;
       - a line drawn back along words (under them, or through them) leaves the writer at the words' start, in front of the
         rows above. Words in a colour need no walk; a tick or a cross before a row, made before it, needs none either;
       - what is added later to rows that are there (a letter beside each) goes to their right, never to their left, where the
         writer would stand on the rows;
       - a board is written with markers: words in a colour, a line under, a ring, a box, a tick, a cross, an arrow. A
         highlighter's band belongs to a notebook.
     PK.place.notes      a desk seen from above, an open notebook on it: PK.ROOMS.notes: page {x, y, w, h} (the page to write
                         on, in the picture's px), rot (how the book is turned), rest (where the hand waits)
     PK.notes(ctx, who, t, items, o)   someone's notes: items are PK.ink's rows in the page's own px; who gives the hand its skin
                         and its sleeve. The hand writes each item, and waits at the page's corner between two that are far
                         apart. o.a fades the writing; o.hand false: the notes without the hand. -> PK.ink's result
     PK.penHand(ctx, who, tip, o)      a hand holding a pen, seen from above, the pen's point at tip; o.k its size, o.col the pen's
                                       colour, o.lift (0 to 1: raised off the page)
     PK.notebook(ctx, x, y, k, o)      a notebook as a thing, seen from the side: closed on a desk (its near corner at x, y), or
                                       o.open: held open on a knee or a hand; o.rot, o.cover (its colour)
     PK.inHand.pen(col), PK.inHand.marker(col), PK.inHand.notebook(o)   what a hand holds, for PK.person's o.hold and o.underF
   Writing takes a hand: a pen or a marker in it is what the hand holds. Nothing here goes below y 890 but the desk, the floor
   and the hand: the captions are there. */
(K=>{
const {TAU,rad,lerp,clamp,sine,pin,mix,dk,lt,css,hash,polar,capsule,pg,rrect,ell}=K.u,C=K.col;
Object.assign(K.PAL,{page:[254,251,244],dot:[204,210,220],ring:[96,100,112],cover:[70,120,134],tab:[250,214,122],desk:[214,170,124]});

/* ---------------------------------------------------------------- a board someone explains at */
K.ROOMS.board={eye:300,floor:960,h:725,board:{x:150,y:118,w:1250,h:524},rest:1640,reach:[96,470]};
const marker=(c,a,b,col,u)=>{const S=K.S;S.fill(c,cc=>capsule(cc,a,b,9*u,8*u),[70,74,90],{w:0.6});S.fill(c,cc=>capsule(cc,[lerp(a[0],b[0],0.8),lerp(a[1],b[1],0.8)],b,8*u,6*u),col,{w:0.6,flat:true});};
K.place.board=ctx=>{const S=K.S,R=K.ROOMS.board,b=R.board;K.paint.wall(ctx,C("wall"),900);
  S.begin(ctx,{lw:4,far:0.05,sh:6});K.board(ctx,b.x,b.y,b.w,b.h);
  // the markers on its tray, one for each colour the writing uses
  [K.C.blue,K.C.green,K.C.amber].forEach((c,i)=>marker(ctx,[b.x+b.w*0.5-150+i*112,b.y+b.h+3],[b.x+b.w*0.5-150+i*112+84,b.y+b.h+3],c,1));
  K.paint.floorAt(ctx,900,C("floor"),true);K.paint.skirting(ctx,878);};
K.inHand={
  marker:col=>(c,hd,deg,J)=>marker(c,polar(hd,deg,-8*J.u),polar(hd,deg,60*J.u),K.inkCol(col),J.u),
  pen:col=>(c,hd,deg,J)=>{const S=K.S,a=polar(hd,deg-150,34*J.u),b=polar(hd,deg+30,30*J.u);S.fill(c,cc=>capsule(cc,a,b,5.5*J.u,4.5*J.u),K.inkCol(col||"blue"),{w:0.6});},
  notebook:o=>(c,hd,deg,J)=>K.notebook(c,hd[0],hd[1],J.u*1.5,Object.assign({open:true,held:true},o||{}))
};
/* whoever writes at a board, as a body that walks: where they stand for each stroke, and how fast they get there */
/* for the check: the rows written near an edge of their board or page, or past it, each {s, room}: the px left between its ink
   and the nearest edge (less than nothing: past it), in the surface's own px (w by h) */
const nearEdge=(ctx,items,w,h)=>{const out=[];for(const s of K.inkPlan(ctx,items,{},true)){if(!s.box)continue;const room=Math.min(s.box[0],w-s.box[2],s.box[1],h-s.box[3]);
  if(room<60)out.push({s:String(items[s.i].s||items[s.i].k||"a drawing"),room});}return out;};
const boardOf=o=>{const R=K.ROOMS.board;return Object.assign({x:R.board.x,y:R.board.y,k:1,floor:R.floor,h:R.h,rest:R.rest,face:0.66,stand:"clasp",lw:7},o||{});};
const walker=(P,o)=>{const h=o.h,u=h/1000,fl=o.floor,J0=K.rig(P,0,fl,h,"stand",{flip:true,life:0}),sdx=J0.shF[0],sy=J0.shF[1],A=(J0.p.uarm+J0.p.farm+J0.p.hand*0.45)*u,near=0.14*h,
    // where they stand for the marker to be at q: the shoulder as far from it as an arm reaches with ease, and never so near that they hide it
    standX=q=>q[0]-sdx+Math.max(near+sdx,Math.sqrt(Math.max(0.09*A*A,0.7*A*A-(q[1]-sy)*(q[1]-sy)))),
    toPic=q=>[o.x+q[0]*o.k,o.y+q[1]*o.k],box=s=>{const a=toPic([s.box[0],s.box[1]]),b=toPic([s.box[2],s.box[3]]);return[a[0],a[1],b[0],b[1]];},
    // the furthest to the right of q their shoulder can be for the marker to reach it
    far=q=>q[0]-sdx+Math.sqrt(Math.max(0.04*A*A,0.85*A*A-(q[1]-sy)*(q[1]-sy))),
    /* where they stand as a stroke starts, coming from px. Words, and a line drawn along something, they walk along, to the right
       of the marker; a mark of its own (a tick, a ring) they make from one place, to the right of all of it. Where they are
       already will do, or a hand's width from it, when the marker reaches from there and they don't hide the mark: nobody
       walks for a tick */
    stay=(px,lo,hi,best)=>{if(px==null)return best;const c=clamp(px,lo,Math.max(lo,hi));return Math.abs(c-px)<0.06*h?c:best;},
    from=(s,px)=>{if(s.text||s.line){const q=toPic(s.at(0));return stay(px,q[0]+near,far(q),standX(q));}
      const b=box(s),m=[(b[0]+b[2])/2,(b[1]+b[3])/2],lo=b[2]+near,hi=Math.max(lo,far([b[0],m[1]]));return stay(px,lo,hi,Math.max(lo,Math.min(standX(m),hi)));};
  // how long a walk of d px takes at a speed: a step of a hand's width takes no time, since the arm reaches; a real walk has a turn in it
  return{h,u,fl,sdx,sy,A,near,standX,toPic,box,speed:0.95*h,side:0.9*h,dur:(d,sp)=>Math.abs(d)<0.06*h?0:Math.max(0.3,Math.abs(d)/sp+0.1),
    // what they could hide: writing that reaches below the top of their head
    hid:s=>box(s)[3]>fl-0.95*h,from,to:(s,a)=>s.text||s.line?standX(toPic(s.at(1))):a};};
/* PK.pace(ctx, who, rows, o) -> the rows, each line and mark that has a time moved as much later as whoever writes them needs to
   walk to it from where the one before ended, and never earlier than its own at. So give each row the time the voice says it,
   pace the rows once, and hand the result to PK.teach, for the board seen close and for the room's own board alike: both are
   then at the same line at every moment. It paces for the board seen close (PK.ROOMS.board), where the walks are longest. A row
   keeps how far its words were moved as lag (seconds): the check lists a row that comes long after the voice.
   The hand needs time too: between two strokes the pen crosses to the next one's start, and a stroke that began the moment the
   last one ended, a row below, would throw the arm there in one frame. So a stroke also waits until the hand can have crossed.
   With who null it paces a page of notes (PK.notes), where only a hand moves: PK.pace(ctx, null, rows). There one stroke also
   waits for the one before to end, since one pen writes them all. */
K.pace=(ctx,who,items,o)=>{const P=typeof who==="string"?K.CAST[who]:who,out=items.map(it=>Object.assign({},it,it.marks?{marks:it.marks.map(m=>m.slice())}:{})),moved={};
  if(P)o=boardOf(o);
  const G=P?walker(P,o):null,S_=K.inkPlan(ctx,items,P?{x:o.x,y:o.y,k:o.k,lw:o.lw,walk:true}:{}),at=(s,p)=>G?G.toPic(s.at(p)):s.at(p),hand=G?0.7*G.h:1500;
  let px=P?o.rest:0,pt=-1e9,pq=null;
  for(const s of S_){const a=G?G.from(s,px):0,t0=s.t0+(s.own?0:moved[s.i]||0),q0=at(s,0),hop=pq?Math.min(0.35,Math.hypot(q0[0]-pq[0],q0[1]-pq[1])/hand):0,
      t=Math.max(t0,pt+Math.max(G?G.dur(a-px,G.speed)+0.06:0.05,hop)),it=out[s.i];
    if(s.m==null){if(t>t0+1e-6){it.at=t;it.lag=(it.lag||0)+t-t0;}moved[s.i]=t-s.t0;}
    else if(s.own||t>t0+1e-6){const m=it.marks[s.m];m[2]=t;if(m[3]==null)m[3]=s.t1-s.t0;}
    if(G)px=G.to(s,a);pt=t+(s.t1-s.t0);pq=at(s,1);}
  return out;};
/* PK.written(ctx, who, rows) -> every stroke of rows as PK.pace gave them, in the order the pen draws them: {s (a row's words, or
   a mark's kind), mark (true for a pen's mark), t0, t1 (the scene's seconds), x, y (its middle in the picture: on the board seen
   close, or on the page)}. A film's score asks for it (tools/pens.py), so a marker's or a pen's sound falls where the picture
   writes: a paced row's moment isn't a word's time plus an offset. who: as for PK.pace (null for a page of notes) */
K.written=(ctx,who,items)=>{const P=typeof who==="string"?K.CAST[who]:who,o=P?boardOf():null;
  return K.inkPlan(ctx,items,P?{x:o.x,y:o.y,k:o.k,lw:o.lw,walk:true}:{}).map(s=>{const q=s.at(0.5),p=P?[o.x+q[0]*o.k,o.y+q[1]*o.k]:pageAt(K.ROOMS.notes,q),it=items[s.i];
    return{s:s.m!=null?String(it.marks[s.m][0]):String(it.s||it.k||"drawing"),mark:s.m!=null||!it.s,t0:s.t0,t1:s.t1,x:p[0],y:p[1]};});};
K.teach=(ctx,who,t,items,o)=>{o=boardOf(o);
  const io={x:o.x,y:o.y,k:o.k,lw:o.lw,deco:o.deco,a:o.a,walk:true},pen=K.ink(ctx,items,t,io),P=typeof who==="string"?K.CAST[who]:who;if(!P)return{pen};
  const G=walker(P,o),{h,u,fl,sdx,sy,A,toPic,box,hid,from,to,speed,side,dur}=G,all=K.inkPlan(ctx,items,io,true),S_=all.filter(s=>s.t1>-1e8).sort((a,b)=>a.t0-b.t0),
    amp=K.ampOf(P),stride=K.strideOf(h,amp),mv=[],busyAt=[],late=[];
  /* their feet: moves [t0, t1, x0, x1, eased]; between two, they stay where they are. To write, they walk to the line's start,
     facing the board, and along it as it grows. Then they turn to the room, and never stay in front of what is written: they step
     to the right of all of it (right: its right edge, as far as they could hide it) as soon as the next line leaves the time to
     come back; and when the next is written from beyond the words, they go there at once. A line that starts before their legs
     can bring them to it is late: PK.pace moves it, and the check lists one that is left (people.py). */
  let px=o.rest,pt=-1e9,right=-1e9;for(const s of all)if(s.t1<=-1e8&&hid(s))right=Math.max(right,box(s)[2]);
  const go=(t1,x1,sp,busy)=>{if(Math.abs(x1-px)<=0.5)return Math.max(pt,t1);const d=Math.max(0.12,dur(x1-px,sp)),t0=Math.max(pt,t1-d),te=Math.max(t1,t0+0.72*d);mv.push([t0,te,px,x1,1]);if(busy)busyAt.push([t0,te]);px=x1;pt=te;return te;};
  S_.forEach((s,j)=>{const a=from(s,px),b=to(s,a),ta=go(s.t0-0.05,a,speed,true);if(ta>s.t0+0.2)late.push({i:s.i,t:s.t0,by:ta-s.t0});
    if(b!==a&&ta<s.t1-0.05){mv.push([Math.max(s.t0,ta),s.t1,a,b,0]);px=b;}
    pt=Math.max(pt,s.t1);busyAt.push([s.t0-0.2,s.t1+0.1]);if(hid(s))right=Math.max(right,box(s)[2]);
    const nx=S_[j+1],clear=Math.max(px,right+0.26*h);if(clear-px<=0.03*h)return;
    // the hand comes down and they turn, then they go
    if(!nx){go(pt+0.2+dur(clear-px,side),clear,side,false);return;}
    const aN=from(nx,px);
    if(aN>=clear-0.02*h){if(nx.t0-pt>0.5+dur(aN-px,speed))go(pt+0.2+dur(aN-px,speed),aN,speed,false);}
    else if(aN!==px&&nx.t0-0.05-pt>=0.2+dur(clear-px,side)+0.3+dur(aN-clear,speed))go(pt+0.2+dur(clear-px,side),clear,side,false);});
  const xAt=tt=>{let x=o.rest;for(const [t0,t1,x0,x1,e] of mv){if(tt<=t0)break;const q=clamp((tt-t0)/(t1-t0),0,1);x=lerp(x0,x1,e?sine(q):q);}return x;};
  let busy=0;for(const [t0,t1] of busyAt)busy=Math.max(busy,pin(t,t0-0.35,0.4)*(1-pin(t,t1+0.1,0.45)));
  // off: they walk away from the board, to the right, and face the way they go
  const x=xAt(t),vs=(xAt(t+0.04)-xAt(t-0.04))/0.08,v=Math.abs(vs),off=clamp(vs/(0.3*h),0,1)*(1-busy),wr=pen.on*busy,q=pen.pen||[x-0.2*h,sy],
    walk=K.poseMix(K.poseMix(o.stand,"ease",Math.max(busy,off)),K.poseWalk(Math.abs(x-o.rest)/stride,1,amp*lerp(1,0.42,wr)),clamp(v/180,0,1)*0.85),low=clamp((q[1]-sy-0.5*A)/(0.45*A),0,1.3)*wr,
    pose=Object.assign({},walk,{lean:(walk.lean||0)+14*low,aF:[walk.aF[0],walk.aF[1],"grip"]}),
    // the hand, so that the marker's point is on the writing: the marker lies along the forearm, which points about where the shoulder does
    sh=[x+sdx,sy],dl=Math.hypot(q[0]-sh[0],q[1]-sh[1])||1,tg=[q[0]-(q[0]-sh[0])/dl*58*u,q[1]-(q[1]-sh[1])/dl*58*u+Math.sin(t*23)*2.2*(1-pen.lift)*wr],
    F=K.face(t,{expr:o.expr||"neutral",gaze:[lerp(0.1,1,busy),lerp(0,q[1]<sy?-0.4:0.3,wr)]},(o.events||[]).concat((o.say||[]).map(([a,b])=>[a,"say",b-a])));
  const J=K.person(ctx,who,x,fl,h,pose,Object.assign({t:o.t==null?t:o.t,flip:lerp(lerp(o.face,0.25,off),1,busy),reachF:tg,reachFk:wr,underF:K.inHand.marker(pen.col)},F));
  /* for the check: are they in front of words that are written, close enough to read, while they aren't writing; the lines that
     start before they can be there; and the lines PK.pace moved long after the voice */
  if(K.watch){const name=i=>String(items[i].s||items[i].k||"a drawing"),
      over=!o.deco&&busy<0.5&&all.some(s=>{if(!hid(s)||s.t0>t)return false;const b=box(s),x1=s.t1>t&&(s.text||s.line)?toPic(s.at(clamp((t-s.t0)/((s.t1-s.t0)||1),0,1)))[0]:b[2];return b[0]<x+0.1*h&&Math.max(x1,b[0])>x-0.1*h;});
    K.watch({teach:typeof who==="string"?who:(P.key||P.name||"someone"),over,late:o.deco?[]:late.map(l=>({s:name(l.i),t:l.t,by:l.by})),
      lag:o.deco?[]:items.map((it,i)=>it.lag?{s:name(i),t:it.at,by:it.lag}:null).filter(Boolean),
      edge:o.deco?[]:nearEdge(ctx,items,K.ROOMS.board.board.w,K.ROOMS.board.board.h),
      // a board seen close that is only writing: one of the film's people explains at it, and nothing on it is drawn as a designer
      // would (PK.sk.drawn). A board of a story's own folk (who: a row of theirs) is as plain as its time
      plain:!o.deco&&typeof who==="string"&&!items.some(it=>it&&it.drawn),a:1,ctx});}
  J.pen=pen;J.writing=wr;J.late=late;return J;};

/* ---------------------------------------------------------------- a notebook someone writes in
   The desk is seen from straight above; the book lies a little turned, its right page large in the picture, its left page mostly
   out of it. What is written goes on the right page, in the page's own px. */
K.ROOMS.notes={rot:-0.03,pivot:[960,540],page:{x:420,y:70,w:1100,h:1160},rest:[1610,960]};
// the page's own px to the picture's, and back to draw on it
const pageAt=(R,q)=>{const c=Math.cos(R.rot),s=Math.sin(R.rot),x=R.page.x+q[0]-R.pivot[0],y=R.page.y+q[1]-R.pivot[1];return[R.pivot[0]+x*c-y*s,R.pivot[1]+x*s+y*c];};
const onBook=(ctx,R)=>{ctx.translate(R.pivot[0],R.pivot[1]);ctx.rotate(R.rot);ctx.translate(-R.pivot[0],-R.pivot[1]);};
/* o.cover: the book's colour; o.left(ctx, page): what is on the left page (page: its {x, y, w, h}, in the turned book's px; the
   part of it in the picture is about 330 px wide); o.on(ctx): what else lies on the desk, in the picture's px */
K.place.notes=(ctx,o)=>{o=o||{};const S=K.S,R=K.ROOMS.notes,p=R.page,desk=C("desk"),cover=S.tone(o.cover||K.PAL.cover),page=C("page"),g=40,lp={x:p.x-g-1000,y:p.y,w:1000,h:p.h};
  ctx.fillStyle=css(desk);ctx.fillRect(0,0,1920,1080);
  // the desk's grain: a few long lines
  ctx.save();ctx.strokeStyle=css(dk(desk,0.16),0.55);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
  for(let i=0;i<9;i++){const y=40+i*128+(hash(i,3)-0.5)*40,x0=hash(i,5)*600-100,x1=x0+500+hash(i,7)*900;ctx.moveTo(x0,y);ctx.bezierCurveTo(lerp(x0,x1,0.3),y+7,lerp(x0,x1,0.7),y-7,x1,y+3);}ctx.stroke();ctx.restore();
  // the highlighters the notes are coloured with, lying beside the book (o.things false: a bare desk)
  if(o.things!==false){S.begin(ctx,{lw:3.4,sh:6});[["blue",1668,196,82],["green",1752,236,97],["amber",1836,188,88]].forEach(([n,x,y,deg])=>{const c0=mix(K.C[n],[255,255,255],0.3);
      ctx.save();ctx.translate(x,y);ctx.rotate(rad(deg));ctx.fillStyle="rgba(84,52,36,0.2)";ctx.beginPath();capsule(ctx,[8,10],[212,10],24,24);ctx.fill();
      S.poly(ctx,[[-30,-9,1],[2,-15,1],[2,15,1],[-30,4,1]],dk(c0,0.42),{exact:true,w:0.8});S.fill(ctx,c=>capsule(c,[0,0],[206,0],23,23),c0,{});S.fill(ctx,c=>capsule(c,[150,0],[208,0],24,24),dk(c0,0.2),{w:0.8});ctx.restore();});}
  if(o.on)o.on(ctx);
  ctx.save();onBook(ctx,R);S.begin(ctx,{lw:4,sh:8});
  // its shadow on the desk, the cover, the pages under the two that show, the two pages
  ctx.fillStyle="rgba(84,52,36,0.22)";ctx.beginPath();rrect(ctx,lp.x-10,p.y+4,lp.w+g+p.w+44,p.h+30,22);ctx.fill();
  S.fill(ctx,c=>rrect(c,lp.x-22,p.y-18,lp.w+g+p.w+46,p.h+40,20),cover,{});
  S.fill(ctx,c=>rrect(c,p.x-6,p.y-4,p.w+18,p.h+12,10),dk(page,0.1),{w:0.7});S.fill(ctx,c=>rrect(c,p.x-6,p.y-4,p.w+10,p.h+8,10),dk(page,0.05),{w:0.7});
  S.fill(ctx,c=>rrect(c,lp.x,lp.y,lp.w,lp.h,10),dk(page,0.025),{});S.fill(ctx,c=>rrect(c,p.x,p.y,p.w,p.h,10),page,{});
  // a grid of dots to write on
  ctx.fillStyle=css(C("dot"));ctx.beginPath();for(const q of [lp,p])for(let y=q.y+52;y<Math.min(q.y+q.h-20,1240);y+=46)for(let x=q.x+(q===p?46:lp.w-22-46*Math.floor((lp.w-40)/46));x<q.x+q.w-24;x+=46){if(x<-40)continue;ctx.moveTo(x+2.4,y);ctx.arc(x,y,2.4,0,TAU);}ctx.fill();
  if(o.left)o.left(ctx,lp);
  // a tab that marks the page
  S.fill(ctx,c=>rrect(c,p.x+p.w-8,p.y+150,40,84,8),C("tab"),{w:0.7});
  // the rings that hold the pages
  for(let y=p.y+44;y<1240;y+=62){ctx.fillStyle=css(dk(page,0.4));ctx.beginPath();ell(ctx,p.x-g-14,y,7,7);ell(ctx,p.x+14,y,7,7);ctx.fill();
    S.fill(ctx,c=>rrect(c,p.x-g-16,y-6.5,g+32,13,6.5),C("ring"),{w:0.7});}
  ctx.restore();};
/* a hand holding a pen, from above: the pen's point at tip, the hand behind it, the forearm away to the lower right */
K.penHand=(ctx,who,tip,o)=>{o=o||{};const S=K.S,P=typeof who==="string"?K.CAST[who]:(who||{}),k=o.k||1.45,sk=S.tone(P.skin||[230,188,156]),sl=S.tone((P.top&&P.top.c)||[104,112,130]),col=K.inkCol(o.col),lift=clamp(o.lift||0,0,1);
  const a=rad(o.deg==null?54:o.deg),d=[Math.cos(a),Math.sin(a)],n=[-d[1],d[0]],T=[tip[0]+lift*10*k,tip[1]-lift*16*k],at=(u,v)=>[T[0]+(d[0]*u+n[0]*v)*k,T[1]+(d[1]*u+n[1]*v)*k];
  // a soft shadow on the page, under the hand: nearer the hand when it is down
  ctx.save();ctx.fillStyle="rgba(84,60,60,0.085)";ctx.beginPath();const s0=at(158,10);ctx.ellipse(s0[0]+(6+lift*14)*k,s0[1]+(10+lift*18)*k,104*k,70*k,a,0,TAU);ctx.fill();ctx.restore();
  S.begin(ctx,{lw:3.2*k/1.45+0.6,sh:6});
  // the sleeve and its cuff, the back of the hand, the fingers that curl under it
  const w0=at(262,-6),fa=rad((o.deg==null?54:o.deg)+9),w1=[w0[0]+Math.cos(fa)*1500,w0[1]+Math.sin(fa)*1500];
  S.fill(ctx,c=>capsule(c,at(236,-6),w1,62*k,70*k),sl,{});S.fill(ctx,c=>capsule(c,at(232,-52),at(240,42),15*k,15*k),lt(sl,0.12),{w:0.8});
  S.poly(ctx,[at(84,-58),at(128,-84),at(190,-82),at(236,-56),at(252,-4),at(236,46),at(186,62),at(128,52),at(96,20),at(78,-20)],sk,{exact:true});
  S.fill(ctx,c=>{capsule(c,at(132,-74),at(92,-70),17*k,15*k);capsule(c,at(112,-52),at(66,-44),18*k,15*k);},dk(sk,0.04),{w:0.8});
  // the pen, over the hand's web; then the finger and the thumb that hold it
  S.fill(ctx,c=>capsule(c,at(30,0),at(318,0),8.5*k,8.5*k),lt(col,0.82),{w:0.8});
  S.fill(ctx,c=>capsule(c,at(292,0),at(318,0),8.5*k,8.5*k),col,{w:0.8});S.fill(ctx,c=>capsule(c,at(26,0),at(84,0),8*k,9*k),col,{w:0.8});
  S.poly(ctx,[[...at(2,0),1],[...at(28,-7),1],[...at(28,7),1]],dk(col,0.5),{exact:true,w:0.7});
  S.fill(ctx,c=>capsule(c,at(160,-34),at(56,-13),19*k,14*k),sk,{w:0.8});
  S.fill(ctx,c=>capsule(c,at(150,44),at(70,16),20*k,15*k),sk,{w:0.8});
  S.line(ctx,c=>{const p0=at(148,-58),p1=at(186,-50),q0=at(172,30),q1=at(206,14);c.moveTo(p0[0],p0[1]);c.quadraticCurveTo(...at(170,-62),p1[0],p1[1]);c.moveTo(q0[0],q0[1]);c.quadraticCurveTo(...at(192,30),q1[0],q1[1]);},null,0.6);};
K.notes=(ctx,who,t,items,o)=>{o=o||{};const R=K.ROOMS.notes;ctx.save();onBook(ctx,R);const r=K.ink(ctx,items,t,{x:R.page.x,y:R.page.y,lw:o.lw||5.5,a:o.a,aside:o.aside});ctx.restore();
  // the pen's point, turned with the book; the hand waits at the page's corner when nothing is written for a while
  const pic=r.pen?pageAt(R,[r.pen[0]-R.page.x,r.pen[1]-R.page.y]):R.rest,on=r.pen?r.on:0,tip=[lerp(R.rest[0],pic[0],on),lerp(R.rest[1],pic[1],on)];r.tip=tip;
  // for the check: that notes are in the picture, the rows written near the page's edge, and where the hand is
  if(K.watch)K.watch({note:true,who:typeof who==="string"?who:"someone",edge:nearEdge(ctx,items,R.page.w,R.page.h),tip:o.hand!==false?tip:null,
    // a page of the film's own people that is only writing; a page a story's own folk keep (who: a row of theirs) is as plain as its time
    plain:typeof who==="string"&&!items.some(it=>it&&it.drawn),a:1,ctx});
  if(o.hand!==false)K.penHand(ctx,who,[tip[0]+(on>0.98?Math.sin(t*21)*1.6*(1-r.lift):0),tip[1]+(on>0.98?Math.cos(t*17)*1.2*(1-r.lift):0)],{col:r.col,lift:Math.max(r.lift*0.8,(1-on)*0.5),k:o.k});
  return r;};

/* a notebook as a thing, seen from the side: closed, lying flat, its near corner at (x, y); or o.open, held open: (x, y) is then
   under its middle. k scales it; o.rot turns it; o.cover its colour */
K.notebook=(ctx,x,y,k,o)=>{o=o||{};const S=K.S,cover=S.tone(o.cover||K.PAL.cover),page=C("page");ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);
  if(o.open){const w=78*k;S.fill(ctx,c=>pg(c,[[-w,-3*k],[w,-3*k],[w+4*k,7*k],[-w-4*k,7*k]]),cover,{w:0.7});
    S.fill(ctx,c=>pg(c,[[-w+3*k,-12*k],[0,-8*k],[0,-1*k],[-w+3*k,-3*k]]),page,{w:0.6});S.fill(ctx,c=>pg(c,[[w-3*k,-12*k],[0,-8*k],[0,-1*k],[w-3*k,-3*k]]),dk(page,0.04),{w:0.6});}
  else{const w=112*k,h=16*k;S.fill(ctx,c=>rrect(c,0,-h,w,h,3*k),cover,{w:0.7});S.fill(ctx,c=>rrect(c,5*k,-h+4*k,w-3*k,h-8*k,2*k),page,{w:0.5,flat:true});
    S.fill(ctx,c=>rrect(c,w*0.72,-h-1*k,8*k,h+2*k,2*k),C("tab"),{w:0.5,flat:true});}
  ctx.restore();};
})(PK);

/* ===== The people kit: people who talk from where they are =====
   People don't only walk over to each other (the author, 17 November 2026: "show sometimes people communicate with others via
   chat or call, so not only jumping in personally. But personally always at least once should be shown"). A film shows a chat or
   a call where the story has people in two places, and still brings people face to face at least once.
   A chat and a call are panels that come out of a screen or a phone someone in the scene is using: the person stays in the
   picture, whole, at their desk or on the path, and the panel shows what is on their screen, large enough to read.

     PK.callout(ctx, x, y, w, h, tail, a, draw, o)   a panel that comes out of a screen or a phone at tail [x, y]: a box w by h at
                              (x, y), with a tail towards it; draw(ctx, x, y, w, h) fills it. o.col
     PK.chat(ctx, x, y, w, h, d, t, o)   a chat, to draw in a callout (or anywhere): d {title, who: [names] (the others, for the
                              header), me (whose screen it is), msgs: [{who, s (a line) or lines, at, type}]}. A message comes in
                              at its time (at). The others' are on the left, with their picture; me's on the right, and for
                              type seconds before it is sent its words are typed in the field at the foot. The others' typing
                              shows as three dots for o.dots seconds (0.9) before theirs. Words are 30 px (o.size).
                              PK.chatSize(ctx, d, o) -> {w, h}: the panel its words need, as they are drawn
     PK.call(ctx, x, y, w, h, people, t, o)   a video call, to draw in a callout: a tile for each of people: [{who, face
                              (PK.face's base), events (PK.face's), say ([[t0, t1], …]), pose, hold, bg, flip, name, role, a (0 to 1: they join)}].
                              Each is drawn whole and cut by their tile, as a camera frames them. Side by side, their first
                              name is at the tile's foot; o.stack: one above the other, each with their name and what they do
                              (their role; 26 px: keep the camera at 1.1 or closer) beside them, and whoever speaks can say it
                              to the panel's side. -> their joints, one for each: PK.say brings what they say out of their tile
     PK.avatar(ctx, who, x, y, r, a)   someone's picture in a round frame: who they are in a chat
     PK.onScreen.chat(k, o), PK.onScreen.call(n, stack)   what a small screen in the scene shows meanwhile (PK.atDesk's o.show): no words
     PK.inHand.phone(o)       a phone in a hand (PK.person's o.hold); PK.POSES.phone: reading it, PK.POSES.onPhone: at the ear
   Everyone in a tile is on a screen: the kit's checks know (they aren't held to the room's eye line), and still follow their
   faces. A panel is a box of words: keep it off the heads of the people in the scene. */
(K=>{
const {TAU,rad,lerp,clamp,sine,pin,pio,mix,dk,lt,css,hash,polar,capsule,pg,rrect,ell}=K.u,C=K.col;
const tw=(ctx,s,w,size)=>ag_tw(ctx,s,{w,size}),tx=(ctx,s,x,y,o)=>ag_T(ctx,s,x,y,Object.assign({},o,{color:css(o.col||K.C.ink)}));
Object.assign(K.PAL,{chatMe:[226,236,230],chatThem:[255,253,247],tile:[[222,230,226],[238,226,212],[226,224,236]],hang:[204,92,78],phone:[60,64,78]});
Object.assign(K.POSES,{phone:{lean:3,head:9,aN:[22,112,"grip"],aF:[4,14],lN:[-2,-2],lF:[5,4]},onPhone:{lean:0,head:-2,aN:[38,168,"grip"],aF:[4,14],lN:[-2,-2],lF:[5,4]}});

K.callout=(ctx,x,y,w,h,tail,a,draw,o)=>{o=o||{};a=a==null?1:a;if(a<=0.004)return;const S=K.S,col=o.col||C("board"),k=0.94+0.06*a;ctx.save();ctx.globalAlpha*=a;
  if(tail){ctx.translate(tail[0],tail[1]);ctx.scale(k,k);ctx.translate(-tail[0],-tail[1]);
    // the tail, from the side of the box that faces the screen
    const below=tail[1]>y+h,above=tail[1]<y,left=tail[0]<x,pts=below||above?(()=>{const m=clamp(tail[0],x+50,x+w-50),e=below?y+h:y,d=below?1:-1;return{t:[[m-20,e-d*6],[m+20,e-d*6],[lerp(m,tail[0],0.8),lerp(e,tail[1],0.8)]],j:[[m-17,e-d*6],[m+17,e-d*6],[m+15,e+d*3],[m-15,e+d*3]]};})():
      (()=>{const m=clamp(tail[1],y+50,y+h-50),e=left?x:x+w,d=left?-1:1;return{t:[[e-d*6,m-20],[e-d*6,m+20],[lerp(e,tail[0],0.8),lerp(m,tail[1],0.8)]],j:[[e-d*6,m-17],[e-d*6,m+17],[e+d*3,m+15],[e+d*3,m-15]]};})();
    ctx.beginPath();pg(ctx,pts.t);ctx.lineJoin="round";ctx.lineWidth=5;ctx.strokeStyle=css(S.ink);if(S.id==="line")ctx.stroke();ctx.fillStyle=css(col);ctx.fill();
    K.box(ctx,x,y,w,h,18,col,1);ctx.fillStyle=css(col);ctx.beginPath();pg(ctx,pts.j);ctx.fill();}
  else K.box(ctx,x,y,w,h,18,col,1);
  if(draw)draw(ctx,x,y,w,h);ctx.restore();};

/* someone's picture in a round frame, painted once for each size: their head and shoulders, facing us a little */
K.avatar=(ctx,who,x,y,r,a)=>{a=a==null?1:a;if(a<=0.004)return;const P=typeof who==="string"?K.CAST[who]:who,S=K.S,q=3,d=Math.ceil(r*2+8),key="pk:av:"+S.key+":"+(P.key||P.name)+":"+Math.round(r);
  const pic=ag_kept(key,d*q,d*q,c=>{c.scale(q,q);const cx=d/2,h=r*7.4,J0=K.rig(P,0,0,h,"stand",{life:0,flip:0.3}),bg=lt(S.tone(P.top.c),0.62);
    c.save();c.beginPath();c.arc(cx,cx,r,0,TAU);c.clip();c.fillStyle=css(bg);c.fillRect(0,0,d,d);
    K.person(c,P,cx-J0.hc[0]-r*0.06,cx-r*0.08-J0.hc[1],h,"stand",{life:0,flip:0.3,shade:0,part:"upper",expr:"smile",icon:true});c.restore();
    c.lineWidth=Math.max(2,r*0.1);c.strokeStyle=css(S.ink);c.beginPath();c.arc(cx,cx,r,0,TAU);c.stroke();});
  ctx.save();ctx.globalAlpha*=a;ctx.drawImage(pic,x-d/2,y-d/2,d,d);ctx.restore();};

/* ---------------------------------------------------------------- a chat */
const CH={pad:22,head:78,gap:14,size:30,lh:40,bp:[20,13],av:24,field:64};
const bubbleOf=(ctx,m,size)=>{size=size||CH.size;const lines=m.lines||[m.s],lh=size+10,bw=Math.max(...lines.map(l=>tw(ctx,l,600,size)))+CH.bp[0]*2,bh=lines.length*lh+CH.bp[1]*2-6;return{lines,bw,bh,size,lh};};
const THEM=CH.av*2+12;
K.chatSize=(ctx,d,o)=>{const bs=d.msgs.map(m=>[m,bubbleOf(ctx,m,o&&o.size)]),head=CH.av*(1.5*(d.who||[]).length+0.8)+(d.title?tw(ctx,d.title,800,30):0);
  return{w:Math.ceil(Math.max(head,...bs.map(([m,b])=>b.bw+(m.who===d.me?0:THEM)))+CH.pad*2+4),h:Math.ceil(CH.head+CH.field+CH.pad+bs.reduce((s,[m,b])=>s+b.bh+CH.gap,0)+8)};};
K.chat=(ctx,x,y,w,h,d,t,o)=>{o=o||{};if(K.watch)K.watch({talk:"chat",a:1,ctx});const S=K.S,me=d.me,ink=S.ink,dots=o.dots==null?0.9:o.dots,body={x:x+CH.pad,y:y+CH.head,w:w-CH.pad*2,h:h-CH.head-CH.field-10};
  // the header: who the chat is with
  let hx=x+CH.pad+CH.av;(d.who||[]).forEach((n,i)=>{K.avatar(ctx,n,hx,y+CH.head/2,CH.av);hx+=CH.av*1.5;});
  if(d.title)tx(ctx,d.title,hx+CH.av*0.3,y+CH.head/2+11,{w:800,size:30});
  ctx.save();ctx.strokeStyle=css(K.C.mut,0.35);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+12,y+CH.head);ctx.lineTo(x+w-12,y+CH.head);ctx.stroke();ctx.restore();
  // the messages that have come, the newest at the foot; when they are more than the panel holds, the oldest go up and out
  const ms=d.msgs.map((m,i)=>Object.assign({b:bubbleOf(ctx,m,o.size),k:pin(t,m.at,0.28),mine:m.who===me,first:!i||d.msgs[i-1].who!==m.who},m)),shown=ms.filter(m=>m.k>0);
  let tot=0;for(const m of shown)tot+=(m.b.bh+CH.gap)*m.k;const typing=ms.find(m=>!m.mine&&t>=m.at-dots&&t<m.at),tk=typing?pio(t,typing.at-dots,typing.at,0.15):0;tot+=tk*(46+CH.gap);
  let yy=body.y+12-Math.max(0,tot+12-body.h);ctx.save();ctx.beginPath();ctx.rect(x+4,body.y+2,w-8,body.h);ctx.clip();
  const bub=(m,by,k)=>{const b=m.b,bx=m.mine?body.x+body.w-b.bw:body.x+THEM,col=S.tone(K.PAL[m.mine?"chatMe":"chatThem"]);ctx.save();ctx.globalAlpha*=k;const sc=0.9+0.1*k,ax=m.mine?bx+b.bw:bx,ay=by+b.bh;ctx.translate(ax,ay);ctx.scale(sc,sc);ctx.translate(-ax,-ay);
    if(!m.mine&&m.first)K.avatar(ctx,m.who,body.x+CH.av,by+CH.av+2,CH.av);
    ctx.beginPath();rrect(ctx,bx,by,b.bw,b.bh,20);ctx.fillStyle=css(col);ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=css(ink);ctx.stroke();
    b.lines.forEach((l,i)=>tx(ctx,l,bx+CH.bp[0],by+CH.bp[1]+b.lh*(i+0.5)+b.size*0.36-3,{w:600,size:b.size}));ctx.restore();};
  for(const m of shown){bub(m,yy,m.k);yy+=(m.b.bh+CH.gap)*m.k;}
  if(tk>0){const bx=body.x+THEM;ctx.save();ctx.globalAlpha*=tk;K.avatar(ctx,typing.who,body.x+CH.av,yy+46-CH.av+2,CH.av);ctx.beginPath();rrect(ctx,bx,yy,92,46,20);ctx.fillStyle=css(S.tone(K.PAL.chatThem));ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=css(ink);ctx.stroke();
    ctx.fillStyle=css(K.C.mut);for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(bx+26+i*20,yy+23-Math.max(0,Math.sin(t*7-i*0.9))*6,5,0,TAU);ctx.fill();}ctx.restore();}
  ctx.restore();
  // the field at the foot: what me is typing, until it is sent
  const fy=y+h-CH.field-6,fx=x+CH.pad,fw=w-CH.pad*2-66;ctx.beginPath();rrect(ctx,fx,fy,fw,CH.field-10,(CH.field-10)/2);ctx.fillStyle=css(lt(C("board"),0.5));ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=css(K.C.mut,0.6);ctx.stroke();
  const ty=ms.find(m=>m.mine&&m.type&&t>=m.at-m.type&&t<m.at+0.05);
  if(ty){const s=(ty.lines||[ty.s]).join(" "),p=clamp((t-(ty.at-ty.type))/(ty.type*0.86),0,1),vis=fw-44,typed=s.slice(0,Math.round(s.length*p));let k=0;
    // a line longer than the field moves on a word at a time: what shows starts at a word, never at a cut letter
    while(tw(ctx,typed.slice(k),600,28)>vis){const n=typed.indexOf(" ",k);if(n<0)break;k=n+1;}
    const now=typed.slice(k),W=Math.min(vis,tw(ctx,now,600,28));ctx.save();ctx.beginPath();ctx.rect(fx+20,fy,vis+4,CH.field-10);ctx.clip();tx(ctx,now,fx+22,fy+(CH.field-10)/2+10,{w:600,size:28});ctx.restore();
    if(Math.sin(t*9)>0){ctx.fillStyle=css(ink);ctx.fillRect(fx+24+Math.min(vis-4,W),fy+12,3,CH.field-34);}}
  const sx=x+w-CH.pad-25,sy=fy+(CH.field-10)/2,sent=ms.some(m=>m.mine&&Math.abs(t-m.at)<0.18);ctx.beginPath();ctx.arc(sx,sy,25*(sent?0.9:1),0,TAU);ctx.fillStyle=css(K.C.blue);ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=css(ink);ctx.stroke();
  ctx.fillStyle="#fff";ctx.beginPath();pg(ctx,[[sx-9,sy-11],[sx+13,sy],[sx-9,sy+11],[sx-4,sy]]);ctx.fill();};

/* ---------------------------------------------------------------- a call */
K.call=(ctx,x,y,w,h,people,t,o)=>{o=o||{};if(K.watch)K.watch({talk:"call",a:1,ctx});const S=K.S,n=people.length,pad=18,bar=o.bar===false?0:(o.stack?54:64),gap=o.stack?12:14,stack=!!o.stack,
    tw_=stack?w-pad*2:(w-pad*2-gap*(n-1))/n,th=stack?(h-pad*2-bar-gap*(n-1))/n:h-pad*2-bar,out=[];
  people.forEach((p,i)=>{const P=typeof p.who==="string"?K.CAST[p.who]:p.who,X=stack?x+pad:x+pad+i*(tw_+gap),Y=stack?y+pad+i*(th+gap):y+pad,pose=p.pose||"stand",
      fl=p.flip==null?(stack?0.4:n===1?0.42:lerp(0.36,0.64,i/(n-1))):p.flip,hh=p.h||th*(stack?3.5:2.5),
      J0=K.rig(P,0,0,hh,pose,{life:0,flip:fl}),cx=(stack?X+th*0.5:X+tw_/2)-J0.hc[0],fy=Y+th*(stack?0.48:0.4)-J0.hc[1];
    ctx.save();ctx.beginPath();rrect(ctx,X,Y,tw_,th,14);ctx.fillStyle=css(S.tone(p.bg||K.PAL.tile[i%3]));ctx.fill();ctx.clip();
    const F=K.face(t,p.face||{expr:"listen"},(p.events||[]).concat((p.say||[]).map(([a,b])=>[a,"say",b-a])));
    const pa=p.a==null?1:clamp(p.a,0,1),J=K.person(ctx,P,cx,fy,hh,pose,Object.assign({t:t+i*1.3,flip:fl,shade:0,screen:true,hold:p.hold,holds:!!p.hold,a:pa},F));ctx.restore();
    ctx.beginPath();rrect(ctx,X,Y,tw_,th,14);ctx.lineWidth=3;ctx.strokeStyle=css(S.ink);ctx.stroke();
    // a ring round the tile of whoever speaks; their name: beside them in a wide tile, with what they do, or at a tall tile's foot
    const sp=(p.say||[]).reduce((m,[a,b])=>Math.max(m,pio(t,a,b,0.2)),0);if(sp>0){ctx.save();ctx.globalAlpha*=sp;ctx.beginPath();rrect(ctx,X+5,Y+5,tw_-10,th-10,10);ctx.lineWidth=5;ctx.strokeStyle=css(K.C.green);ctx.stroke();ctx.restore();}
    ctx.save();ctx.globalAlpha*=pa;if(p.name!==false){if(stack){const nm=p.name||P.name,nx=X+th*1.02,role=p.role===undefined?P.role:p.role;tx(ctx,nm,nx,Y+th/2+(role?-6:11),{w:800,size:30});if(role)tx(ctx,role,nx,Y+th/2+30,{w:600,size:26,col:K.C.mut});}
      else{const nm=p.name||P.name.split(" ")[0],nw=tw(ctx,nm,700,28)+32;ctx.beginPath();rrect(ctx,X+12,Y+th-56,nw,44,22);ctx.fillStyle=css(C("board"));ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=css(S.ink);ctx.stroke();tx(ctx,nm,X+28,Y+th-24,{w:700,size:28});}}ctx.restore();
    J.tile={x:X,y:Y,w:tw_,h:th,panel:{x,y,w,h}};out.push(J);});
  // the call's own buttons: a microphone, a camera, and the one that ends it
  if(bar){const by=y+h-pad-bar/2+(stack?8:6),bx=x+w/2;[[-70,C("board")],[0,C("board")],[70,S.tone(K.PAL.hang)]].forEach(([dx,c],i)=>{ctx.beginPath();ctx.arc(bx+dx,by,23,0,TAU);ctx.fillStyle=css(c);ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=css(S.ink);ctx.stroke();
      ctx.save();ctx.strokeStyle=css(i===2?[255,255,255]:S.ink);ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
      if(i===0){rrect(ctx,bx+dx-4.5,by-12,9,15,4.5);ctx.fill();ctx.beginPath();ctx.arc(bx+dx,by-2,9,0.15,Math.PI-0.15);ctx.moveTo(bx+dx,by+7);ctx.lineTo(bx+dx,by+12);ctx.stroke();}
      else if(i===1){rrect(ctx,bx+dx-12,by-7,15,14,3);ctx.fill();ctx.beginPath();pg(ctx,[[bx+dx+5,by],[bx+dx+12,by-6],[bx+dx+12,by+6]]);ctx.fill();}
      else{ctx.lineWidth=5.5;ctx.arc(bx+dx,by+10,13,Math.PI*1.2,Math.PI*1.8);ctx.stroke();}ctx.restore();});}
  return out;};

/* something said by someone in a tile of a call (J: one of PK.call's joints; PK.say does this by itself for such a J): the words
   stand beside the call's panel, on the tile's side of it where there is room (o.side "left" or "right" asks for one), with a
   tail into the tile. Put whoever speaks in the tile nearest the free side. o.cam, o.dx, o.dy as PK.say's */
K.sayFrom=(ctx,J,lines,a,o)=>{o=o||{};const T=J.tile,P=T.panel||T,size=o.size||34,w=Math.max(...lines.map(l=>tw(ctx,l,o.weight||700,size)))+56,h=lines.length*size*1.3+32,
    cm=o.cam,m=cm?40/cm.z:40,vx0=cm?cm.x-960/cm.z:0,vx1=cm?cm.x+960/cm.z:1920,vy0=cm?cm.y-540/cm.z:0;
  const want=o.side||(T.x+T.w/2>=P.x+P.w/2?"right":"left"),fits=sd=>sd==="right"?P.x+P.w+46+w<=vx1-m:P.x-46-w>=vx0+m,side=fits(want)?want:(want==="right"?"left":"right"),right=side==="right";
  const x=(right?P.x+P.w+46+w/2:P.x-46-w/2)+(o.dx||0),y=Math.max(vy0+h/2+m,T.y+T.h*0.36+(o.dy||0)),tail=[right?T.x+T.w-10:T.x+10,clamp(T.y+T.h*0.4,y-h/2+12,y+h/2-12)];
  return K.bubble(ctx,x,y,lines,tail,a,o);};
const say0=K.say;K.say=(ctx,J,lines,a,o)=>J&&J.tile?K.sayFrom(ctx,J,lines,a,o):say0(ctx,J,lines,a,o);

/* what a small screen in the scene shows meanwhile: the same chat or call, too small for words (PK.atDesk's o.show).
   chat(k, o): k (0 to 1) how many of its messages have come; o.rows: its messages, each [where it starts, how wide (both a share
   of the screen's width), 1 for mine], when they aren't two people's in turn. Who it is with, at the top, and the field at the
   foot are there before any message is, so an empty chat still reads as one, not as a blank screen */
K.onScreen={
  chat:(k,o)=>(c,x,y,w,h)=>{const rows=(o&&o.rows)||[[0.12,0.5,0],[0.4,0.48,1],[0.2,0.4,0],[0.5,0.38,1]],n=Math.round(clamp(k==null?1:k,0,1)*rows.length),grey=[214,216,212];c.fillStyle=css(lt(C("board"),0.3));c.fillRect(x,y,w,h);
    c.fillStyle=css(grey);c.beginPath();c.arc(x+w*0.1,y+h*0.1,h*0.055,0,TAU);c.fill();c.beginPath();rrect(c,x+w*0.18,y+h*0.065,w*0.3,h*0.07,h*0.035);c.fill();c.fillRect(x+w*0.04,y+h*0.185,w*0.92,Math.max(1.5,h*0.012));
    c.beginPath();rrect(c,x+w*0.06,y+h*0.86,w*0.7,h*0.09,h*0.045);c.fill();c.fillStyle=css(K.C.blue);c.beginPath();c.arc(x+w*0.88,y+h*0.905,h*0.05,0,TAU);c.fill();
    rows.slice(0,n).forEach(([fx,fw,me],i)=>{c.fillStyle=css(me?mix(K.C.green,[255,255,255],0.62):grey);c.beginPath();rrect(c,x+w*fx,y+h*(0.23+i*0.15),w*fw,h*0.1,h*0.05);c.fill();});},
  call:(n,stack)=>(c,x,y,w,h)=>{n=n||2;c.fillStyle=css([70,74,90]);c.fillRect(x,y,w,h);const g=w*0.04,tw2=stack?w-g*2:(w-g*(n+1))/n,H=stack?(h*0.78-g*(n+1))/n:h*0.66;
    for(let i=0;i<n;i++){const X=stack?x+g:x+g+i*(tw2+g),Y=stack?y+g+i*(H+g):y+h*0.1,hx=stack?X+H*0.62:X+tw2/2;c.save();c.beginPath();rrect(c,X,Y,tw2,H,5);c.fillStyle=css(K.S.tone(K.PAL.tile[i%3]));c.fill();c.clip();
      c.fillStyle=css([120,112,116]);c.beginPath();c.arc(hx,Y+H*0.4,H*0.19,0,TAU);c.fill();c.beginPath();c.ellipse(hx,Y+H*1.02,H*0.36,H*0.36,0,Math.PI,TAU);c.fill();
      if(stack){c.fillStyle=css([150,146,150]);c.beginPath();rrect(c,X+H*1.3,Y+H*0.3,tw2*0.34,H*0.14,H*0.07);rrect(c,X+H*1.3,Y+H*0.56,tw2*0.24,H*0.12,H*0.06);c.fill();}c.restore();}
    c.fillStyle=css(K.S.tone(K.PAL.hang));c.beginPath();c.arc(x+w/2,y+h*0.9,h*0.06,0,TAU);c.fill();}
};
/* a phone in a hand: its back to us when it is read (o.back), or its lit face */
K.inHand.phone=o=>(c,hd,deg,J)=>{o=o||{};const S=K.S,u=J.u,a=polar(hd,deg-176,10*u),b=polar(hd,deg+4,o.ear?70*u:86*u),g=Math.atan2(b[1]-a[1],b[0]-a[0]);
  c.save();c.translate(a[0],a[1]);c.rotate(g);const L=Math.hypot(b[0]-a[0],b[1]-a[1]),w=46*u;S.fill(c,cc=>rrect(cc,0,-w/2,L,w,7*u),S.tone(K.PAL.phone),{w:0.8});
  if(!o.back)S.fill(c,cc=>rrect(cc,5*u,-w/2+4*u,L-10*u,w-8*u,4*u),C("screenLit"),{line:false,flat:true});c.restore();};
})(PK);

/* ===== The people kit: boards and pages drawn as a designer would =====
   The author found the boards and the notebooks too plain, "generally just writing" (18 November 2026). He asked for a designer's
   board and notebook, "with proper drawings and charts. Still looking written but very polished. It doesn't need to show they are
   writing and drawing everything, it could be almost done in design and the hand just adds some final words to complete the
   sketch." Of four looks he picked two: a graphic recording, a sheet of paper pinned over the board (board B), and a sketched page
   in the notebook (notebook D). This file holds what both are drawn with.

   A designed board or page is two kinds of rows of PK.ink (hand.js): what is drawn already when it first shows, a row of its own
   (PK.sk.drawn), and the last words, written by hand as the voice says them, as any other row: paced once with PK.pace and shown
   with PK.teach (a board) or PK.notes (a page). The hand may also tick or ring a part of the drawing as the voice comes to it (a
   mark of PK.ink's: tick, ring, star, under), and it writes nothing else.

     PK.sk.drawn(draw, box)     a row that is drawn already: draw(ctx) in the board's or the page's own px; box [x0, y0, x1, y1] is
                                where its ink lies: whoever explains steps clear of it, and the check (people.py) holds it 24 px or
                                more inside the board or the page. On a board far off (PK.teach's deco), its words are decoration
                                too: everything written here takes the surface's deco by itself (PK.inkDeco).
     PK.sk.paper(ctx, o)        the graphic recording's sheet, pinned over PK.place.board's board: cream paper, a pin at each
                                corner. o: x, y, w, h (in the board's px: 14, 16, 1222, 492), col, pins (false: none)
     PK.SK                      the sheet's box and the page's: SK.board {x, y, w, h} (inside the paper, 24 px from every edge of
                                the board), SK.page {x, y, w, h} (a page's room above the captions)

   Words. Each is PK.hand's handwriting (size, w, col, align, a), so a box made from words is made as they are drawn.
     PK.sk.text(ctx, s, x, y, o)          words, their baseline at (x, y) -> {w, x0, x1}
     PK.sk.caps(ctx, s, x, y, o)          a small heading in capitals, its letters spaced (o.size 30, o.ls 3, o.col) -> {w}
     PK.sk.wrap(ctx, s, maxW, o)          the words in lines no wider than maxW, at o.size and o.w -> [line, …]
     PK.sk.lines(ctx, rows, x, y, o)      lines one under another: rows are strings or [s, o]; o.lh (1.25 of the size) -> {w, h}
   Marks and shapes, each drawn once with an even dark line round a flat colour. A colour is a kit name ("ink", "mut", "blue",
   "green", "amber", "orange", "violet") or [r, g, b]; a fill named so is that colour's light tint (PK.TINT).
     PK.sk.line(ctx, pts, o)              a line drawn by hand through points: o.col, o.w (4), o.dash, o.close, o.fill, o.seed
     PK.sk.box(ctx, x, y, w, h, o)        a box drawn with a marker: o.fill (its tint, laid a little off the line, as a marker
                                          does), o.col (the line), o.w (3.5), o.r (12), o.dash
     PK.sk.disc(ctx, cx, cy, r, o)        a round one: o.fill, o.col, o.w
     PK.sk.band(ctx, x, y, w, h, col, a)  a highlighter's band
     PK.sk.arrow(ctx, [x0, y0], [x1, y1], o)   o.col, o.w (4), o.bow (px, to the left of the way it goes), o.head (16), o.dash
     PK.sk.pin(ctx, x, y, o), PK.sk.tape(ctx, x, y, w, o)   a pin; a strip of tape (o.rot, o.col)
     PK.sk.sticky(ctx, x, y, w, h, o)     a sticky note: o.col (yellow), o.rot; o.draw(ctx, x, y, w, h) writes on it, turned with it
     PK.sk.ribbon(ctx, s, x, y, o)        a heading on a ribbon, made from its words: (x, y) its top left (o.align "center": its
                                          top middle); o.size (44), o.col ("blue"), o.ink (its words' colour), o.width (a ribbon
                                          for words the hand writes on it later: s "") -> {x0, x1, y0, y1, base, cx (where words
                                          on it go: their baseline, its middle)}
     PK.sk.stamp(ctx, lines, cx, cy, o)   a reference stamped in a corner, turned a little: lines of [s, o] or strings (the first
                                          bold); o.col ("blue"), o.rot (0.06), o.size (32) -> {w, h}
     PK.sk.face(ctx, who, cx, cy, r, o)   a portrait, head and shoulders, in their own hair, skin and clothes: who a name in
                                          PK.CAST or a row like its rows; o.ring (a colour round it), o.disc (false: no disc)
     PK.sk.icon(ctx, kind, cx, cy, r, o)  a small drawing, r its size: o.fill. The kinds are in PK.sk.ICONS
   A board's and a page's frame:
     PK.sk.head(ctx, title, o)            a graphic recording's frame: the pinned sheet (o.paper: its o), the heading on a ribbon at
                                          (o.x 110, o.y 42), o.col ("blue"), o.size (48); o.ref, the stamp's lines, at (o.rx 1060,
                                          o.ry 98), o.rcol; o.sub, a line in capitals under the ribbon (s, or [s, col]) -> the ribbon's box
     PK.sk.title(ctx, s, x, y, o)         a page's heading on a highlighter's band: o.size (84), o.col ("blue"), o.band -> {w, x0, x1}
     PK.sk.panel(ctx, x, y, w, h, o, body)   a box with a heading in capitals (o.title, o.col), o.fill, o.line, o.dash; then
                                          body(ctx, x, y, w, h): what is inside it, under the heading
   Pieces made of those, each sized from its words unless a width is given, each returning its box {x, y, w, h}:
     PK.sk.card(ctx, x, y, o)             a box with an icon at its left and a line or two: o.icon, o.ifill, o.lines ([s, o] or
                                          strings), o.fill, o.col, o.w (its width), o.size (36), o.pad (18), o.r
     PK.sk.list(ctx, x, y, items, o)      rows one under another, each {s, icon, num, dot, col, sub, ifill}: an icon, a number in a
                                          ring or a dot before it, its words, and a gloss in muted ink after them (sub); o.size (38),
                                          o.gap (the row's height: 1.6 of the size), o.subX (the gloss's column) -> [{x, y, w, h,
                                          base, mark: [x, y] (where a tick beside it goes)}, …]
     PK.sk.faces(ctx, x, y, who, o)       portraits in a row, a name or a word under each (o.names: [s, …], or true for their own
                                          first names): o.r (30), o.gap -> [{cx, cy}, …]
     PK.sk.flow(ctx, x, y, steps, o)      boxes joined by arrows, to the right (o.down: down): steps [{s, icon, fill, col, sub}, …];
                                          o.size (34), o.gap (the arrow's length: 60), o.h (each box's height) -> [{x, y, w, h}, …]
   Charts, sketched:
     PK.sk.bars(ctx, x, y, w, h, bars, o)        bars on a line: [{v, col, label, top}, …] (top: words over the bar); o.max, o.size
     PK.sk.trend(ctx, x, y, w, h, pts, o)        a line over time: pts [[0 to 1, 0 to 1], …]; o.col, o.labels ([[u, s], …] under
                                                 the line's foot), o.dots
     PK.sk.donut(ctx, cx, cy, r, parts, o)       a ring in parts: [{v, col}, …]; o.label (words in its middle), o.size
     PK.sk.cycle(ctx, cx, cy, r, steps, o)       steps round a circle, each [s, col] in a pill, arrows from each to the next
     PK.sk.stairs(ctx, x, y, w, h, steps, o)     steps that climb to the right, [s, …] on each; o.col, o.flag (a flag at the top)
     PK.sk.matrix(ctx, x, y, w, h, o)            two axes and four corners: o.xs, o.ys (each axis's words), o.q ([top left, top
                                                 right, bottom left, bottom right]: words or [s, o]), o.on (the corner shaded:
                                                 0 to 3), o.col
     PK.sk.pyramid(ctx, cx, y, w, h, layers, o)  layers from the top down: [s, col]
     PK.sk.timeline(ctx, x, y, w, marks, o)      a line with marks along it: [{u, s, sub, col, up}, …]
     PK.sk.scale(ctx, cx, cy, w, o)              a balance: o.l, o.r (the words in each pan), o.tilt (-1 to 1: the left pan down),
                                                 o.lcol, o.rcol
     PK.sk.venn(ctx, cx, cy, r, o)               two rounds that overlap: o.l, o.r, o.mid (their words), o.lcol, o.rcol
     PK.sk.dots(ctx, x, y, cols, rows, o)        a field of small rounds: o.gap, o.r, o.on (how many coloured), o.col
     PK.sk.big(ctx, s, cx, cy, o)                a figure, large, in a round burst: o.size (64), o.col, o.r

   Lay a designed board out as a graphic recording: a ribbon for its heading at the top left, the reference stamped at the top
   right, two or three parts below, each a drawing (a chart, a few portraits, cards with icons) with a few words, arrows between
   them, and room left for the last words, at the right or at the foot, so whoever writes them steps clear after. Lay a page out as
   a sketched page: its heading with a highlighter's band, boxes with icons and portraits, a sticky note, and a ribbon or a line at
   its foot for the last words. Words are 30 px or more on a board seen close, 34 or more on a page, and none below the board's or
   the page's room (PK.SK). Colour keeps its meaning (blue a plan or a rule, green something done or of value, amber a risk or a
   cost, orange data); people's portraits wear their own clothes. Nothing here is a box of words for the check: a board's or a
   page's drawing is the writing's, not a card over the scene. */
(K=>{
const {TAU,lerp,clamp,mix,dk,lt,css,hash,rrect}=K.u;
const INK=()=>K.C.ink;
K.TINT={ink:[248,244,236],mut:[238,232,224],blue:[214,228,244],green:[204,234,212],amber:[250,230,196],orange:[250,218,198],violet:[226,218,244],white:[255,255,255],sun:[252,226,140],paper:[250,247,240]};
K.FILL={ink:[226,220,212],mut:[226,220,212],blue:[176,204,236],green:[178,222,190],amber:[250,212,128],orange:[244,186,154],violet:[206,194,242],white:[255,255,255],sun:[252,226,140],paper:[250,247,240]};
const colOf=c=>K.inkCol(c),tintOf=c=>c==null?null:Array.isArray(c)?c:(K.TINT[c]||K.TINT.ink),fillOf=c=>c==null?null:Array.isArray(c)?c:(K.FILL[c]||K.FILL.ink);
// a ribbon's colours: strong enough to carry white words, or light with ink ones (amber)
const RIB={blue:[[104,146,196],[255,255,255]],green:[[88,146,106],[255,255,255]],amber:[[240,200,104],null],orange:[[214,128,86],[255,255,255]],violet:[[132,116,200],[255,255,255]],ink:[[96,86,98],[255,255,255]],mut:[[226,216,200],null]};
const nz=(i,k)=>hash(i*7+3,k*13+1)-0.5;
// the board's px and the page's: where a design's ink may lie
K.SK={board:{x:40,y:36,w:1170,h:450},page:{x:70,y:56,w:960,h:770},paper:{x:14,y:16,w:1222,h:492}};
K.sk={};const D=K.sk;

/* ---------------------------------------------------------------- words */
const deco=o=>o.deco||K.inkDeco;
D.text=(ctx,s,x,y,o)=>K.hand(ctx,s,x,y,o||{});
D.caps=(ctx,s,x,y,o)=>{o=o||{};const size=o.size||30,ls=o.ls==null?3:o.ls,S=String(s).toUpperCase(),w=ag_tw(ctx,S,{w:700,size,f:"hand",ls});
  const x0=o.align==="center"?x-w/2:o.align==="right"?x-w:x;ag_T(ctx,S,x0,y,{w:700,size,f:"hand",ls,color:css(colOf(o.col||"mut")),deco:deco(o),a:o.a});return{w,x0,x1:x0+w};};
D.capsW=(ctx,s,o)=>{o=o||{};return ag_tw(ctx,String(s).toUpperCase(),{w:700,size:o.size||30,f:"hand",ls:o.ls==null?3:o.ls});};
D.wrap=(ctx,s,maxW,o)=>{o=o||{};const size=o.size||38,wt=o.w||400,out=[];let cur="";for(const wd of String(s).split(/\s+/)){const t=cur?cur+" "+wd:wd;if(cur&&K.handW(ctx,t,size,wt)>maxW){out.push(cur);cur=wd;}else cur=t;}if(cur)out.push(cur);return out;};
const rowOf=r=>Array.isArray(r)?[r[0],r[1]||{}]:[r,{}];
D.lines=(ctx,rows,x,y,o)=>{o=o||{};let yy=y,w=0;rows.forEach((r,i)=>{const [s,ro]=rowOf(r),q=Object.assign({size:o.size||38,w:o.w,col:o.col,align:o.align},ro),lh=(o.lh||1.25)*q.size;
    if(i)yy+=lh;const m=D.text(ctx,s,x,yy,q);w=Math.max(w,m.w);});return{w,h:yy-y};};
const widthOf=(ctx,rows,o)=>Math.max(0,...rows.map(r=>{const [s,ro]=rowOf(r);return K.handW(ctx,s,ro.size||o.size||38,ro.w||o.w||400);}));

/* ---------------------------------------------------------------- marks and shapes */
// a hand-drawn line through points: each stretch bowed a little, the same way every time
function wob(ctx,pts,o){const amp=o.amp==null?1.6:o.amp,seed=o.seed||1;ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,k=amp*Math.min(1,L/80)*(1+nz(seed,i));
    ctx.quadraticCurveTo((a[0]+b[0])/2+nx*k*2,(a[1]+b[1])/2+ny*k*2,b[0],b[1]);}
  if(o.close)ctx.closePath();}
const pen=(ctx,c,w)=>{ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=css(colOf(c));ctx.lineWidth=w;};
D.line=(ctx,pts,o)=>{o=o||{};ctx.save();ctx.beginPath();wob(ctx,pts,o);if(o.fill){ctx.fillStyle=css(tintOf(o.fill));ctx.fill();}
  if(o.col!==false){pen(ctx,o.col||"ink",o.w||4);if(o.dash)ctx.setLineDash(o.dash);ctx.stroke();}ctx.restore();};
D.box=(ctx,x,y,w,h,o)=>{o=o||{};const r=o.r==null?12:o.r;ctx.save();
  if(o.fill){ctx.fillStyle=css(tintOf(o.fill));ctx.beginPath();rrect(ctx,x+2,y+3,w,h,r);ctx.fill();}
  if(o.col!==false){pen(ctx,o.col||"ink",o.w||3.5);if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();rrect(ctx,x,y,w,h,r);ctx.stroke();}ctx.restore();return{x,y,w,h};};
D.disc=(ctx,cx,cy,r,o)=>{o=o||{};ctx.save();if(o.fill){ctx.fillStyle=css(tintOf(o.fill));ctx.beginPath();ctx.arc(cx+1.5,cy+2,r,0,TAU);ctx.fill();}
  if(o.col!==false){pen(ctx,o.col||"ink",o.w||3.5);if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();}ctx.restore();};
D.band=(ctx,x,y,w,h,c,a)=>{ctx.save();ctx.fillStyle=css(Array.isArray(c)?c:(K.HL[c]||K.HL.amber),a==null?0.5:a);ctx.beginPath();ctx.moveTo(x,y+h*0.12);ctx.quadraticCurveTo(x+w*0.5,y-h*0.06,x+w,y+h*0.04);
  ctx.lineTo(x+w-4,y+h);ctx.quadraticCurveTo(x+w*0.5,y+h*1.06,x+4,y+h*0.94);ctx.closePath();ctx.fill();ctx.restore();};
D.arrow=(ctx,a,b,o)=>{o=o||{};const bow=o.bow||0,mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,cx=mx-dy/L*bow,cy=my+dx/L*bow;
  ctx.save();pen(ctx,o.col||"ink",o.w||4);if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.quadraticCurveTo(cx,cy,b[0],b[1]);ctx.stroke();ctx.setLineDash([]);
  const an=Math.atan2(b[1]-cy,b[0]-cx),hl=o.head||16;ctx.beginPath();ctx.moveTo(b[0]-Math.cos(an-0.45)*hl,b[1]-Math.sin(an-0.45)*hl);ctx.lineTo(b[0],b[1]);ctx.lineTo(b[0]-Math.cos(an+0.45)*hl,b[1]-Math.sin(an+0.45)*hl);ctx.stroke();ctx.restore();};
D.pin=(ctx,x,y,o)=>{o=o||{};ctx.save();ctx.fillStyle="rgba(60,40,40,0.2)";ctx.beginPath();ctx.arc(x+3,y+4,8,0,TAU);ctx.fill();ctx.fillStyle=css(o.col||[196,70,64]);ctx.beginPath();ctx.arc(x,y,8,0,TAU);ctx.fill();
  pen(ctx,"ink",2);ctx.stroke();ctx.fillStyle="rgba(255,255,255,0.55)";ctx.beginPath();ctx.arc(x-2.5,y-2.5,2.6,0,TAU);ctx.fill();ctx.restore();};
D.tape=(ctx,x,y,w,o)=>{o=o||{};const h=o.h||36,c=o.col||[150,196,186];ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.fillStyle=css(c,0.82);ctx.beginPath();ctx.moveTo(-w/2,-h/2);
  for(let i=0;i<=6;i++)ctx.lineTo(-w/2+i*w/6,-h/2+(i%2?3:0));ctx.lineTo(w/2,h/2);for(let i=6;i>=0;i--)ctx.lineTo(-w/2+i*w/6,h/2-(i%2?3:0));ctx.closePath();ctx.fill();
  ctx.strokeStyle=css(lt(c,0.5),0.7);ctx.lineWidth=2;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(-w/2+i*w/4-8,-h/2);ctx.lineTo(-w/2+i*w/4+8,h/2);ctx.stroke();}ctx.restore();};
D.sticky=(ctx,x,y,w,h,o)=>{o=o||{};const c=tintOf(o.col||"sun");ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.fillStyle="rgba(60,40,40,0.16)";ctx.fillRect(-w/2+5,-h/2+7,w,h);
  ctx.fillStyle=css(c);ctx.fillRect(-w/2,-h/2,w,h);ctx.strokeStyle=css(dk(c,0.25));ctx.lineWidth=2;ctx.strokeRect(-w/2,-h/2,w,h);
  ctx.fillStyle=css(dk(c,0.06));ctx.fillRect(-w/2,-h/2,w,Math.min(26,h*0.18));if(o.draw)o.draw(ctx,-w/2,-h/2,w,h);ctx.restore();return{x,y,w,h};};
D.ribbon=(ctx,s,x,y,o)=>{o=o||{};const size=o.size||44,wt=o.w||700,W=s?K.handW(ctx,s,size,wt):0,pad=o.pad||size*0.6,w=o.width||W+pad*2,h=Math.round(size*1.32),[f0,i0]=RIB[o.col||"blue"]||[colOf(o.col),[255,255,255]],
    fill=Array.isArray(o.fill)?o.fill:f0,ink=o.ink||i0||INK(),x0=o.align==="center"?x-w/2:x,d=h*0.45,fd=dk(fill,0.22);
  ctx.save();ctx.lineJoin="round";ctx.lineWidth=3;ctx.strokeStyle=css(INK());
  if(o.tails!==false)for(const sg of[-1,1]){const ex=sg<0?x0:x0+w;ctx.fillStyle=css(fd);ctx.beginPath();ctx.moveTo(ex,y+d*0.5);ctx.lineTo(ex+sg*h*0.9,y+d*0.5);ctx.lineTo(ex+sg*h*0.55,y+d*0.5+h*0.5);
    ctx.lineTo(ex+sg*h*0.9,y+h+d*0.5);ctx.lineTo(ex,y+h+d*0.5);ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.fillStyle=css(fill);ctx.beginPath();ctx.moveTo(x0,y);ctx.quadraticCurveTo(x0+w/2,y-6,x0+w,y);ctx.lineTo(x0+w,y+h);ctx.quadraticCurveTo(x0+w/2,y+h-6,x0,y+h);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
  if(s)D.text(ctx,s,x0+w/2,y+h*0.72,{size,w:wt,col:ink,align:"center"});return{x0,x1:x0+w,y0:y,y1:y+h,w,h,base:y+h*0.72,cx:x0+w/2};};
D.stamp=(ctx,lines,cx,cy,o)=>{o=o||{};const size=o.size||32,rows=lines.map((r,i)=>{const [s,ro]=rowOf(r);return[s,Object.assign({size:i?size*0.88:size,w:i?400:700,col:o.col||"blue",align:"center"},ro)];}),
    W=Math.max(...rows.map(([s,q])=>K.handW(ctx,s,q.size,q.w))),lh=size*1.12,w=W+size*1.3,h=rows.length*lh+size*0.55;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(o.rot==null?0.06:o.rot);D.box(ctx,-w/2,-h/2,w,h,{col:o.col||"blue",w:3,r:14,fill:o.fill});
  if(o.double!==false)D.box(ctx,-w/2+6,-h/2+6,w-12,h-12,{col:o.col||"blue",w:1.6,r:10});
  rows.forEach(([s,q],i)=>D.text(ctx,s,0,-h/2+size*0.3+lh*(i+0.78),q));ctx.restore();return{w,h};};

/* ---------------------------------------------------------------- a portrait, as a designer sketches one */
D.face=(ctx,who,cx,cy,r,o)=>{o=o||{};const P=typeof who==="string"?K.CAST[who]:who;if(!P)throw new Error("PK.sk.face: nobody called "+who);
  const S=K.S,tone=c=>S.tone?S.tone(c):c,sk=tone(P.skin),hair=P.hair||{style:"short",c:[60,48,44]},hc=tone(hair.c||[60,48,44]),top=tone((P.top&&P.top.c)||[150,140,130]),lw=Math.max(2,r*0.085),st=hair.style;
  ctx.save();ctx.lineJoin="round";ctx.lineCap="round";ctx.lineWidth=lw;ctx.strokeStyle=css(INK());
  if(o.ring){ctx.fillStyle=css(tintOf(o.ring),0.95);ctx.beginPath();ctx.arc(cx,cy+r*0.15,r*1.42,0,TAU);ctx.fill();}
  if(o.disc!==false){ctx.fillStyle=css(o.bg?tintOf(o.bg):[248,244,236]);ctx.beginPath();ctx.arc(cx,cy+r*0.15,r*1.25,0,TAU);ctx.fill();ctx.stroke();ctx.save();ctx.beginPath();ctx.arc(cx,cy+r*0.15,r*1.25-lw/2,0,TAU);ctx.clip();}
  // shoulders, and what shows at the neck
  ctx.fillStyle=css(top);ctx.beginPath();ctx.moveTo(cx-r*1.15,cy+r*1.6);ctx.quadraticCurveTo(cx-r*1.05,cy+r*0.78,cx-r*0.35,cy+r*0.7);ctx.lineTo(cx+r*0.35,cy+r*0.7);ctx.quadraticCurveTo(cx+r*1.05,cy+r*0.78,cx+r*1.15,cy+r*1.6);ctx.closePath();ctx.fill();ctx.stroke();
  if(P.top&&P.top.inner){ctx.fillStyle=css(tone(P.top.inner));ctx.beginPath();ctx.moveTo(cx-r*0.28,cy+r*0.7);ctx.lineTo(cx,cy+r*1.12);ctx.lineTo(cx+r*0.28,cy+r*0.7);ctx.closePath();ctx.fill();ctx.stroke();}
  // hair down the back, a bun, a knot, a scarf round the head
  ctx.fillStyle=css(hc);
  if(st==="long"){ctx.beginPath();ctx.moveTo(cx-r*0.78,cy-r*0.2);ctx.quadraticCurveTo(cx-r*0.95,cy+r*0.7,cx-r*0.62,cy+r*0.98);ctx.lineTo(cx+r*0.62,cy+r*0.98);ctx.quadraticCurveTo(cx+r*0.95,cy+r*0.7,cx+r*0.78,cy-r*0.2);ctx.closePath();ctx.fill();ctx.stroke();}
  if(st==="bun"||st==="knot"){ctx.beginPath();ctx.arc(cx+r*0.05,cy-r*0.98,r*(st==="knot"?0.26:0.32),0,TAU);ctx.fill();ctx.stroke();}
  const scarf=st==="scarf"||st==="covered";
  if(scarf){ctx.fillStyle=css(hc);ctx.beginPath();ctx.moveTo(cx-r*0.86,cy+r*0.72);ctx.quadraticCurveTo(cx-r*1.0,cy-r*0.95,cx,cy-r*0.98);ctx.quadraticCurveTo(cx+r*1.0,cy-r*0.95,cx+r*0.86,cy+r*0.72);ctx.closePath();ctx.fill();ctx.stroke();}
  // the neck and the head
  ctx.fillStyle=css(sk);ctx.beginPath();rrect(ctx,cx-r*0.2,cy+r*0.35,r*0.4,r*0.45,r*0.1);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.ellipse(cx,cy,r*0.66,r*0.76,0,0,TAU);ctx.fill();ctx.stroke();
  // hair on top, by its style
  ctx.fillStyle=css(hc);
  if(scarf){ctx.beginPath();ctx.moveTo(cx-r*0.66,cy-r*0.05);ctx.quadraticCurveTo(cx-r*0.62,cy-r*0.72,cx,cy-r*0.74);ctx.quadraticCurveTo(cx+r*0.62,cy-r*0.72,cx+r*0.66,cy-r*0.05);ctx.quadraticCurveTo(cx+r*0.7,cy-r*0.92,cx,cy-r*0.92);ctx.quadraticCurveTo(cx-r*0.7,cy-r*0.92,cx-r*0.66,cy-r*0.05);ctx.fill();ctx.stroke();}
  else if(st==="coily"||st==="curly"){const n=st==="coily"?7:6;ctx.beginPath();for(let i=0;i<n;i++){const a=Math.PI*(1.05+i*0.9/(n-1)),bx=cx+Math.cos(a)*r*0.62,by=cy+Math.sin(a)*r*0.7;ctx.moveTo(bx+r*0.2,by);ctx.arc(bx,by,r*0.2,0,TAU);}ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.ellipse(cx,cy-r*0.45,r*0.62,r*0.36,0,Math.PI,TAU);ctx.fill();}
  else if(st!=="none"&&st!=="shaved"){const sh=st==="short"||st==="crop"||st==="cropped"||st==="normal"||st==="side"||st==="knot",y0=cy+(sh?-r*0.1:r*0.2);ctx.beginPath();ctx.moveTo(cx-r*0.7,y0);
    ctx.quadraticCurveTo(cx-r*0.78,cy-r*0.92,cx,cy-r*0.86);ctx.quadraticCurveTo(cx+r*0.8,cy-r*0.92,cx+r*0.7,y0-(sh?r*0.02:0));
    ctx.quadraticCurveTo(cx+r*0.42,cy-r*(st==="side"?0.62:0.5),cx-r*0.05,cy-r*0.46);ctx.quadraticCurveTo(cx-r*0.48,cy-r*0.42,cx-r*0.7,y0);ctx.closePath();ctx.fill();ctx.stroke();}
  if(P.beard){ctx.fillStyle=css(tone(P.beard));ctx.beginPath();ctx.moveTo(cx-r*0.6,cy+r*0.05);ctx.quadraticCurveTo(cx-r*0.5,cy+r*0.86,cx,cy+r*0.8);ctx.quadraticCurveTo(cx+r*0.5,cy+r*0.86,cx+r*0.6,cy+r*0.05);ctx.quadraticCurveTo(cx,cy+r*0.42,cx-r*0.6,cy+r*0.05);ctx.fill();ctx.stroke();}
  if(P.earrings&&!scarf){ctx.fillStyle=css(tone(P.earrings));for(const sg of[-1,1]){ctx.beginPath();ctx.arc(cx+sg*r*0.68,cy+r*0.22,Math.max(1.6,r*0.07),0,TAU);ctx.fill();}}
  // eyes, a smile, glasses
  ctx.fillStyle=css(INK());for(const sg of[-1,1]){ctx.beginPath();ctx.arc(cx+sg*r*0.24,cy+r*0.02,Math.max(1.6,r*0.07),0,TAU);ctx.fill();}
  ctx.lineWidth=lw*0.8;ctx.beginPath();ctx.arc(cx,cy+r*0.2,r*0.22,0.25*Math.PI,0.75*Math.PI);ctx.stroke();
  if(P.glasses){ctx.lineWidth=lw*0.7;for(const sg of[-1,1]){ctx.beginPath();ctx.arc(cx+sg*r*0.25,cy+r*0.02,r*0.17,0,TAU);ctx.stroke();}ctx.beginPath();ctx.moveTo(cx-r*0.08,cy);ctx.lineTo(cx+r*0.08,cy);ctx.stroke();}
  if(o.disc!==false)ctx.restore();ctx.restore();};

/* ---------------------------------------------------------------- small drawings */
const PAPER=[250,246,236];
const ICON={
  star:(c,x,y,r)=>{c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*0.45:r;i?c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr):c.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();c.fill();c.stroke();},
  plus:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.5,y);c.lineTo(x+r*0.5,y);c.moveTo(x,y-r*0.5);c.lineTo(x,y+r*0.5);c.stroke();},
  minus:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.5,y);c.lineTo(x+r*0.5,y);c.stroke();},
  check:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.45,y);c.lineTo(x-r*0.1,y+r*0.38);c.lineTo(x+r*0.5,y-r*0.38);c.lineWidth*=1.3;c.stroke();},
  cross:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.4,y-r*0.4);c.lineTo(x+r*0.4,y+r*0.4);c.moveTo(x+r*0.4,y-r*0.4);c.lineTo(x-r*0.4,y+r*0.4);c.lineWidth*=1.2;c.stroke();},
  q:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.beginPath();c.arc(x,y-r*0.22,r*0.3,-Math.PI*0.95,Math.PI*0.4);c.quadraticCurveTo(x,y,x,y+r*0.22);c.stroke();c.beginPath();c.arc(x,y+r*0.52,r*0.07,0,TAU);c.fillStyle=c.strokeStyle;c.fill();},
  warn:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y-r);c.lineTo(x+r*1.05,y+r*0.82);c.lineTo(x-r*1.05,y+r*0.82);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x,y-r*0.38);c.lineTo(x,y+r*0.25);c.stroke();c.beginPath();c.arc(x,y+r*0.52,r*0.07,0,TAU);c.fillStyle=c.strokeStyle;c.fill();},
  rock:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y+r*0.7);c.lineTo(x-r*0.7,y-r*0.2);c.lineTo(x-r*0.1,y-r*0.7);c.lineTo(x+r*0.6,y-r*0.4);c.lineTo(x+r,y+r*0.7);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.1,y-r*0.7);c.lineTo(x+r*0.05,y+r*0.1);c.lineTo(x+r*0.6,y-r*0.4);c.stroke();},
  key:(c,x,y,r)=>{c.beginPath();c.arc(x-r*0.45,y,r*0.45,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x,y);c.lineTo(x+r,y);c.moveTo(x+r*0.7,y);c.lineTo(x+r*0.7,y+r*0.35);c.moveTo(x+r*0.95,y);c.lineTo(x+r*0.95,y+r*0.3);c.stroke();c.fillStyle=css(PAPER);c.beginPath();c.arc(x-r*0.45,y,r*0.16,0,TAU);c.fill();c.stroke();},
  lock:(c,x,y,r)=>{c.beginPath();c.arc(x,y-r*0.2,r*0.42,Math.PI,TAU);c.lineTo(x+r*0.42,y);c.moveTo(x-r*0.42,y);c.lineTo(x-r*0.42,y-r*0.2);c.stroke();c.beginPath();rrect(c,x-r*0.7,y-r*0.05,r*1.4,r*1.0,r*0.14);c.fill();c.stroke();c.beginPath();c.arc(x,y+r*0.38,r*0.12,0,TAU);c.stroke();},
  heart:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y+r*0.8);c.bezierCurveTo(x-r*1.3,y-r*0.1,x-r*0.55,y-r*1.0,x,y-r*0.35);c.bezierCurveTo(x+r*0.55,y-r*1.0,x+r*1.3,y-r*0.1,x,y+r*0.8);c.fill();c.stroke();},
  house:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.8,y+r*0.8);c.lineTo(x-r*0.8,y-r*0.1);c.lineTo(x,y-r*0.85);c.lineTo(x+r*0.8,y-r*0.1);c.lineTo(x+r*0.8,y+r*0.8);c.closePath();c.fill();c.stroke();c.beginPath();c.rect(x-r*0.2,y+r*0.25,r*0.4,r*0.55);c.stroke();},
  building:(c,x,y,r)=>{c.beginPath();c.rect(x-r*0.7,y-r*0.95,r*1.4,r*1.85);c.fill();c.stroke();c.beginPath();for(let i=0;i<3;i++)for(let j=0;j<2;j++)c.rect(x-r*0.42+j*r*0.52,y-r*0.7+i*r*0.46,r*0.32,r*0.26);c.stroke();c.beginPath();c.moveTo(x-r*1.0,y+r*0.9);c.lineTo(x+r*1.0,y+r*0.9);c.stroke();},
  door:(c,x,y,r)=>{c.beginPath();c.rect(x-r*0.55,y-r*0.95,r*1.1,r*1.85);c.fill();c.stroke();c.beginPath();c.arc(x+r*0.3,y,r*0.08,0,TAU);c.stroke();c.beginPath();c.moveTo(x-r*0.9,y+r*0.9);c.lineTo(x+r*0.9,y+r*0.9);c.stroke();},
  clock:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x,y);c.lineTo(x,y-r*0.65);c.moveTo(x,y);c.lineTo(x+r*0.45,y+r*0.2);c.stroke();},
  hourglass:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.6,y-r);c.lineTo(x+r*0.6,y-r);c.lineTo(x+r*0.08,y);c.lineTo(x+r*0.6,y+r);c.lineTo(x-r*0.6,y+r);c.lineTo(x-r*0.08,y);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.75,y-r);c.lineTo(x+r*0.75,y-r);c.moveTo(x-r*0.75,y+r);c.lineTo(x+r*0.75,y+r);c.stroke();},
  cal:(c,x,y,r)=>{c.beginPath();c.rect(x-r,y-r*0.75,r*2,r*1.6);c.fill();c.stroke();c.beginPath();c.moveTo(x-r,y-r*0.3);c.lineTo(x+r,y-r*0.3);c.moveTo(x-r*0.5,y-r);c.lineTo(x-r*0.5,y-r*0.55);c.moveTo(x+r*0.5,y-r);c.lineTo(x+r*0.5,y-r*0.55);c.stroke();
    c.fillStyle=c.strokeStyle;for(let i=0;i<3;i++)for(let j=0;j<2;j++){c.beginPath();c.arc(x-r*0.5+i*r*0.5,y+r*0.1+j*r*0.4,r*0.07,0,TAU);c.fill();}},
  chat:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y-r*0.7);c.lineTo(x+r,y-r*0.7);c.lineTo(x+r,y+r*0.4);c.lineTo(x-r*0.2,y+r*0.4);c.lineTo(x-r*0.6,y+r*0.9);c.lineTo(x-r*0.55,y+r*0.4);c.lineTo(x-r,y+r*0.4);c.closePath();c.fill();c.stroke();},
  people:(c,x,y,r)=>{for(const [dx,s] of[[-0.6,0.8],[0.6,0.8],[0,1]]){c.beginPath();c.arc(x+dx*r,y-r*0.25*s,r*0.28*s,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x+dx*r-r*0.45*s,y+r*0.75);c.quadraticCurveTo(x+dx*r,y-r*0.05,x+dx*r+r*0.45*s,y+r*0.75);c.closePath();c.fill();c.stroke();}},
  person:(c,x,y,r)=>{c.beginPath();c.arc(x,y-r*0.38,r*0.36,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.65,y+r*0.9);c.quadraticCurveTo(x,y-r*0.2,x+r*0.65,y+r*0.9);c.closePath();c.fill();c.stroke();},
  map:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y-r*0.6);c.lineTo(x-r*0.35,y-r*0.85);c.lineTo(x+r*0.3,y-r*0.6);c.lineTo(x+r,y-r*0.85);c.lineTo(x+r,y+r*0.6);c.lineTo(x+r*0.3,y+r*0.85);c.lineTo(x-r*0.35,y+r*0.6);c.lineTo(x-r,y+r*0.85);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.35,y-r*0.85);c.lineTo(x-r*0.35,y+r*0.6);c.moveTo(x+r*0.3,y-r*0.6);c.lineTo(x+r*0.3,y+r*0.85);c.stroke();},
  db:(c,x,y,r)=>{const e=r*0.32;c.beginPath();c.moveTo(x-r*0.75,y-r*0.6);c.lineTo(x-r*0.75,y+r*0.6);c.ellipse(x,y+r*0.6,r*0.75,e,0,Math.PI,0,true);c.lineTo(x+r*0.75,y-r*0.6);c.closePath();c.fill();c.stroke();c.beginPath();c.ellipse(x,y-r*0.6,r*0.75,e,0,0,TAU);c.fill();c.stroke();c.beginPath();c.ellipse(x,y,r*0.75,e,0,0,Math.PI);c.stroke();},
  gear:(c,x,y,r)=>{c.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,rr=i%2?r*0.72:r;i?c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr):c.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();c.fill();c.stroke();c.fillStyle=css(PAPER);c.beginPath();c.arc(x,y,r*0.3,0,TAU);c.fill();c.stroke();},
  shield:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x+r*0.5,y-r*0.72,x+r*0.85,y-r*0.75);c.quadraticCurveTo(x+r*0.9,y+r*0.5,x,y+r);c.quadraticCurveTo(x-r*0.9,y+r*0.5,x-r*0.85,y-r*0.75);c.quadraticCurveTo(x-r*0.5,y-r*0.72,x,y-r);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.35,y);c.lineTo(x-r*0.05,y+r*0.3);c.lineTo(x+r*0.4,y-r*0.3);c.stroke();},
  bars:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y+r*0.85);c.lineTo(x+r,y+r*0.85);c.stroke();for(const [dx,hh] of[[-0.62,0.7],[0,1.3],[0.62,0.95]]){c.beginPath();c.rect(x+dx*r-r*0.22,y+r*0.85-hh*r,r*0.44,hh*r);c.fill();c.stroke();}},
  up:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y+r*0.8);c.lineTo(x+r,y+r*0.8);c.moveTo(x-r,y+r*0.8);c.lineTo(x-r,y-r);c.stroke();c.beginPath();c.moveTo(x-r*0.8,y+r*0.4);c.lineTo(x-r*0.2,y-r*0.1);c.lineTo(x+r*0.15,y+r*0.15);c.lineTo(x+r*0.8,y-r*0.6);c.stroke();c.beginPath();c.moveTo(x+r*0.4,y-r*0.62);c.lineTo(x+r*0.82,y-r*0.62);c.lineTo(x+r*0.82,y-r*0.22);c.stroke();},
  down:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y+r*0.8);c.lineTo(x+r,y+r*0.8);c.moveTo(x-r,y+r*0.8);c.lineTo(x-r,y-r);c.stroke();c.beginPath();c.moveTo(x-r*0.8,y-r*0.6);c.lineTo(x-r*0.2,y-r*0.05);c.lineTo(x+r*0.15,y-r*0.3);c.lineTo(x+r*0.8,y+r*0.4);c.stroke();c.beginPath();c.moveTo(x+r*0.4,y+r*0.42);c.lineTo(x+r*0.82,y+r*0.42);c.lineTo(x+r*0.82,y);c.stroke();},
  wrench:(c,x,y,r)=>{c.save();c.translate(x,y);c.rotate(-0.8);c.beginPath();c.moveTo(-r*0.16,-r*0.4);c.lineTo(-r*0.16,r*0.95);c.quadraticCurveTo(0,r*1.1,r*0.16,r*0.95);c.lineTo(r*0.16,-r*0.4);c.closePath();c.fill();c.stroke();
    c.beginPath();c.arc(0,-r*0.62,r*0.42,0,TAU);c.fill();c.stroke();c.fillStyle=css(PAPER);c.beginPath();c.moveTo(-r*0.13,-r*1.06);c.lineTo(-r*0.13,-r*0.68);c.lineTo(r*0.13,-r*0.68);c.lineTo(r*0.13,-r*1.06);c.fill();c.stroke();c.restore();},
  doc:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.7,y-r);c.lineTo(x+r*0.35,y-r);c.lineTo(x+r*0.7,y-r*0.65);c.lineTo(x+r*0.7,y+r);c.lineTo(x-r*0.7,y+r);c.closePath();c.fill();c.stroke();c.beginPath();for(let i=0;i<3;i++){c.moveTo(x-r*0.4,y-r*0.35+i*r*0.4);c.lineTo(x+r*0.4,y-r*0.35+i*r*0.4);}c.stroke();},
  cards:(c,x,y,r)=>{for(let i=2;i>=0;i--){c.beginPath();c.rect(x-r*0.8+i*r*0.18,y-r*0.7+i*r*0.18,r*1.3,r*1.1);c.fill();c.stroke();}c.beginPath();for(let i=0;i<3;i++){c.moveTo(x-r*0.25,y-r*0.05+i*r*0.25);c.lineTo(x+r*0.55,y-r*0.05+i*r*0.25);}c.stroke();},
  book:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y-r*0.6);c.quadraticCurveTo(x-r*0.5,y-r*0.85,x-r,y-r*0.7);c.lineTo(x-r,y+r*0.7);c.quadraticCurveTo(x-r*0.5,y+r*0.55,x,y+r*0.8);c.quadraticCurveTo(x+r*0.5,y+r*0.55,x+r,y+r*0.7);c.lineTo(x+r,y-r*0.7);c.quadraticCurveTo(x+r*0.5,y-r*0.85,x,y-r*0.6);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x,y-r*0.6);c.lineTo(x,y+r*0.8);c.stroke();},
  pen:(c,x,y,r)=>{c.save();c.translate(x,y);c.rotate(0.78);c.beginPath();c.rect(-r*0.22,-r,r*0.44,r*1.5);c.fill();c.stroke();c.beginPath();c.moveTo(-r*0.22,r*0.5);c.lineTo(0,r);c.lineTo(r*0.22,r*0.5);c.stroke();c.beginPath();c.moveTo(-r*0.22,-r*0.6);c.lineTo(r*0.22,-r*0.6);c.stroke();c.restore();},
  bulb:(c,x,y,r)=>{c.beginPath();c.arc(x,y-r*0.2,r*0.62,Math.PI*0.78,Math.PI*0.22);c.lineTo(x+r*0.28,y+r*0.62);c.lineTo(x-r*0.28,y+r*0.62);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.26,y+r*0.8);c.lineTo(x+r*0.26,y+r*0.8);c.moveTo(x-r*0.18,y+r*0.97);c.lineTo(x+r*0.18,y+r*0.97);c.stroke();
    c.beginPath();for(const a of[-2.4,-1.57,-0.74]){c.moveTo(x+Math.cos(a)*r*0.86,y-r*0.2+Math.sin(a)*r*0.86);c.lineTo(x+Math.cos(a)*r*1.08,y-r*0.2+Math.sin(a)*r*1.08);}c.stroke();},
  target:(c,x,y,r)=>{for(const k of[1,0.64,0.28]){c.beginPath();c.arc(x,y,r*k,0,TAU);if(k!==0.64)c.fill();c.stroke();}c.beginPath();c.moveTo(x,y);c.lineTo(x+r*0.95,y-r*0.95);c.moveTo(x+r*0.95,y-r*0.95);c.lineTo(x+r*0.62,y-r*0.95);c.moveTo(x+r*0.95,y-r*0.95);c.lineTo(x+r*0.95,y-r*0.62);c.stroke();},
  flag:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.6,y+r);c.lineTo(x-r*0.6,y-r);c.stroke();c.beginPath();c.moveTo(x-r*0.6,y-r);c.quadraticCurveTo(x,y-r*1.2,x+r*0.8,y-r*0.85);c.lineTo(x+r*0.8,y-r*0.05);c.quadraticCurveTo(x,y-r*0.3,x-r*0.6,y-r*0.15);c.closePath();c.fill();c.stroke();},
  sprout:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y+r);c.quadraticCurveTo(x+r*0.08,y,x,y-r*0.3);c.stroke();c.beginPath();c.moveTo(x,y-r*0.1);c.quadraticCurveTo(x-r*0.9,y-r*0.2,x-r*0.85,y-r*0.95);c.quadraticCurveTo(x-r*0.15,y-r*0.85,x,y-r*0.1);c.fill();c.stroke();
    c.beginPath();c.moveTo(x+r*0.02,y-r*0.3);c.quadraticCurveTo(x+r*0.85,y-r*0.45,x+r*0.9,y-r*1.0);c.quadraticCurveTo(x+r*0.2,y-r*1.0,x+r*0.02,y-r*0.3);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.7,y+r);c.lineTo(x+r*0.7,y+r);c.stroke();},
  tree:(c,x,y,r)=>{c.beginPath();c.rect(x-r*0.12,y+r*0.2,r*0.24,r*0.8);c.fill();c.stroke();c.beginPath();c.arc(x,y-r*0.25,r*0.62,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.8,y+r);c.lineTo(x+r*0.8,y+r);c.stroke();},
  eye:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r,y);c.quadraticCurveTo(x,y-r*0.95,x+r,y);c.quadraticCurveTo(x,y+r*0.95,x-r,y);c.closePath();c.fill();c.stroke();c.beginPath();c.arc(x,y,r*0.34,0,TAU);c.stroke();c.fillStyle=c.strokeStyle;c.beginPath();c.arc(x,y,r*0.14,0,TAU);c.fill();},
  phone:(c,x,y,r)=>{c.beginPath();rrect(c,x-r*0.52,y-r,r*1.04,r*2,r*0.16);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.16,y+r*0.75);c.lineTo(x+r*0.16,y+r*0.75);c.stroke();},
  laptop:(c,x,y,r)=>{c.beginPath();rrect(c,x-r*0.75,y-r*0.75,r*1.5,r*1.05,r*0.08);c.fill();c.stroke();c.beginPath();c.moveTo(x-r,y+r*0.45);c.lineTo(x+r,y+r*0.45);c.lineTo(x+r*0.85,y+r*0.62);c.lineTo(x-r*0.85,y+r*0.62);c.closePath();c.fill();c.stroke();},
  mail:(c,x,y,r)=>{c.beginPath();c.rect(x-r,y-r*0.65,r*2,r*1.3);c.fill();c.stroke();c.beginPath();c.moveTo(x-r,y-r*0.65);c.lineTo(x,y+r*0.1);c.lineTo(x+r,y-r*0.65);c.stroke();},
  sensor:(c,x,y,r)=>{c.beginPath();rrect(c,x-r*0.45,y-r*0.3,r*0.9,r*0.9,r*0.12);c.fill();c.stroke();c.beginPath();c.arc(x,y+r*0.15,r*0.16,0,TAU);c.stroke();c.beginPath();for(const k of[0.6,0.95]){c.moveTo(x-r*k*0.8,y-r*0.45-r*k*0.3);c.quadraticCurveTo(x,y-r*0.45-r*k*0.85,x+r*k*0.8,y-r*0.45-r*k*0.3);}c.stroke();},
  scale:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y-r*0.8);c.lineTo(x,y+r*0.85);c.moveTo(x-r*0.45,y+r*0.85);c.lineTo(x+r*0.45,y+r*0.85);c.moveTo(x-r*0.9,y-r*0.55);c.lineTo(x+r*0.9,y-r*0.55);c.stroke();
    for(const sg of[-1,1]){c.beginPath();c.moveTo(x+sg*r*0.9,y-r*0.55);c.lineTo(x+sg*r*0.9-r*0.32,y+r*0.12);c.moveTo(x+sg*r*0.9,y-r*0.55);c.lineTo(x+sg*r*0.9+r*0.32,y+r*0.12);c.stroke();c.beginPath();c.moveTo(x+sg*r*0.9-r*0.4,y+r*0.12);c.quadraticCurveTo(x+sg*r*0.9,y+r*0.45,x+sg*r*0.9+r*0.4,y+r*0.12);c.closePath();c.fill();c.stroke();}},
  loop:(c,x,y,r)=>{c.beginPath();c.arc(x,y,r*0.75,-0.3,Math.PI*0.85);c.stroke();c.beginPath();c.arc(x,y,r*0.75,Math.PI-0.3,Math.PI*1.85);c.stroke();
    for(const a of[Math.PI*0.85,Math.PI*1.85]){const px=x+Math.cos(a)*r*0.75,py=y+Math.sin(a)*r*0.75,tg=a+Math.PI/2;c.beginPath();c.moveTo(px+Math.cos(tg-2.4)*r*0.32,py+Math.sin(tg-2.4)*r*0.32);c.lineTo(px,py);c.lineTo(px+Math.cos(tg+2.4)*r*0.32,py+Math.sin(tg+2.4)*r*0.32);c.stroke();}},
  bolt:(c,x,y,r)=>{c.beginPath();c.moveTo(x+r*0.15,y-r);c.lineTo(x-r*0.55,y+r*0.12);c.lineTo(x-r*0.02,y+r*0.12);c.lineTo(x-r*0.18,y+r);c.lineTo(x+r*0.55,y-r*0.15);c.lineTo(x+r*0.02,y-r*0.15);c.closePath();c.fill();c.stroke();},
  anchor:(c,x,y,r)=>{c.beginPath();c.arc(x,y-r*0.72,r*0.2,0,TAU);c.stroke();c.beginPath();c.moveTo(x,y-r*0.52);c.lineTo(x,y+r*0.85);c.moveTo(x-r*0.4,y-r*0.2);c.lineTo(x+r*0.4,y-r*0.2);c.moveTo(x-r*0.8,y+r*0.25);c.quadraticCurveTo(x-r*0.7,y+r*0.9,x,y+r*0.85);c.quadraticCurveTo(x+r*0.7,y+r*0.9,x+r*0.8,y+r*0.25);c.stroke();},
  hat:(c,x,y,r)=>{c.beginPath();c.ellipse(x,y+r*0.45,r,r*0.3,0,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.55,y+r*0.42);c.lineTo(x-r*0.48,y-r*0.55);c.quadraticCurveTo(x,y-r*0.75,x+r*0.48,y-r*0.55);c.lineTo(x+r*0.55,y+r*0.42);c.quadraticCurveTo(x,y+r*0.58,x-r*0.55,y+r*0.42);c.fill();c.stroke();
    c.beginPath();c.moveTo(x-r*0.52,y+r*0.05);c.quadraticCurveTo(x,y+r*0.2,x+r*0.52,y+r*0.05);c.stroke();},
  puzzle:(c,x,y,r)=>{const s=r*0.8;c.beginPath();c.moveTo(x-s,y-s);c.lineTo(x-s*0.25,y-s);c.arc(x,y-s,s*0.25,Math.PI,0);c.lineTo(x+s,y-s);c.lineTo(x+s,y-s*0.25);c.arc(x+s,y,s*0.25,-Math.PI/2,Math.PI/2);c.lineTo(x+s,y+s);c.lineTo(x-s,y+s);c.closePath();c.fill();c.stroke();},
  coin:(c,x,y,r)=>{for(const k of[0.5,0,-0.5]){c.beginPath();c.ellipse(x,y+k*r*0.62,r*0.82,r*0.36,0,0,TAU);c.fill();c.stroke();}},
  drop:(c,x,y,r)=>{c.beginPath();c.moveTo(x,y-r);c.bezierCurveTo(x+r*0.3,y-r*0.5,x+r*0.75,y,x+r*0.75,y+r*0.3);c.arc(x,y+r*0.3,r*0.75,0,Math.PI);c.bezierCurveTo(x-r*0.75,y,x-r*0.3,y-r*0.5,x,y-r);c.fill();c.stroke();},
  hand:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.5,y+r);c.lineTo(x-r*0.5,y+r*0.15);c.quadraticCurveTo(x-r*0.95,y-r*0.2,x-r*0.75,y-r*0.45);c.lineTo(x-r*0.38,y-r*0.1);c.lineTo(x-r*0.38,y-r*0.8);c.quadraticCurveTo(x-r*0.24,y-r*0.98,x-r*0.1,y-r*0.8);
    c.lineTo(x-r*0.1,y-r*0.95);c.quadraticCurveTo(x+r*0.04,y-r*1.12,x+r*0.18,y-r*0.95);c.lineTo(x+r*0.18,y-r*0.85);c.quadraticCurveTo(x+r*0.32,y-r*1.0,x+r*0.46,y-r*0.82);c.lineTo(x+r*0.46,y-r*0.6);c.quadraticCurveTo(x+r*0.6,y-r*0.72,x+r*0.72,y-r*0.55);c.lineTo(x+r*0.72,y+r*0.2);c.quadraticCurveTo(x+r*0.7,y+r*0.6,x+r*0.45,y+r*0.75);c.lineTo(x+r*0.45,y+r);c.closePath();c.fill();c.stroke();},
  road:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.35,y-r);c.lineTo(x-r,y+r);c.lineTo(x+r,y+r);c.lineTo(x+r*0.35,y-r);c.closePath();c.fill();c.stroke();c.beginPath();c.setLineDash([r*0.22,r*0.2]);c.moveTo(x,y-r*0.9);c.lineTo(x,y+r*0.9);c.stroke();c.setLineDash([]);},
  chair:(c,x,y,r)=>{c.beginPath();c.moveTo(x-r*0.45,y-r);c.lineTo(x-r*0.45,y+r);c.moveTo(x-r*0.45,y+r*0.05);c.lineTo(x+r*0.55,y+r*0.05);c.lineTo(x+r*0.55,y+r);c.stroke();c.beginPath();rrect(c,x-r*0.6,y-r*0.1,r*1.25,r*0.22,r*0.08);c.fill();c.stroke();},
  speech:(c,x,y,r)=>{c.beginPath();c.ellipse(x,y-r*0.12,r,r*0.7,0,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-r*0.45,y+r*0.45);c.lineTo(x-r*0.7,y+r*0.98);c.lineTo(x-r*0.05,y+r*0.56);c.fill();c.stroke();}
};
D.ICONS=Object.keys(ICON);
D.icon=(ctx,kind,cx,cy,r,o)=>{o=o||{};const f=ICON[kind];if(!f)throw new Error("PK.sk.icon: no icon called "+kind);ctx.save();pen(ctx,o.col||"ink",o.w||clamp(r*0.13,2.4,4.4));ctx.fillStyle=css(fillOf(o.fill||"white"));f(ctx,cx,cy,r);ctx.restore();};

/* ---------------------------------------------------------------- the graphic recording's sheet */
D.paper=(ctx,o)=>{o=Object.assign({},K.SK.paper,o||{});const {x,y,w,h}=o,c=o.col||[240,229,206];ctx.save();ctx.fillStyle="rgba(60,40,40,0.18)";ctx.fillRect(x+8,y+10,w,h);ctx.fillStyle=css(c);ctx.fillRect(x,y,w,h);
  ctx.strokeStyle=css(dk(c,0.22));ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);ctx.restore();if(o.pins!==false)for(const [px,py] of[[x+24,y+18],[x+w-24,y+18],[x+24,y+h-18],[x+w-24,y+h-18]])D.pin(ctx,px,py);};
D.drawn=(draw,box)=>({draw:c=>draw(c),box:box||[K.SK.board.x,K.SK.board.y,K.SK.board.x+K.SK.board.w,K.SK.board.y+K.SK.board.h],d:0.1,drawn:true});

/* ---------------------------------------------------------------- a board's and a page's frame */
// a page's heading on a highlighter's band: (x, y) its baseline's start; o.size (84), o.col ("blue"), o.band (its colour: o.col)
D.title=(ctx,s,x,y,o)=>{o=o||{};const size=o.size||84,col=o.col||"blue",W=K.handW(ctx,s,size,700);D.band(ctx,x-14,y-size*0.66,W+28,size*0.8,o.band||col,o.a==null?0.42:o.a);
  D.text(ctx,s,x,y,{size,w:700,col});return{w:W,x0:x,x1:x+W};};
// a graphic recording's frame: the pinned sheet, its heading on a ribbon at the top left, where the idea comes from stamped at the
// top right, and a line in capitals under the ribbon
D.head=(ctx,title,o)=>{o=o||{};D.paper(ctx,o.paper);const x=o.x||110,r=D.ribbon(ctx,title,x,o.y||42,{col:o.col||"blue",size:o.size||48});
  if(o.ref)D.stamp(ctx,o.ref,o.rx||1060,o.ry||98,{col:o.rcol||"blue",size:o.rsize||30,rot:o.rot});
  if(o.sub){const [s,col]=Array.isArray(o.sub)?o.sub:[o.sub,"mut"];D.caps(ctx,s,x,r.y1+50,{col,size:30});}
  return r;};
// a part of a board or a page: a box, a heading in capitals at its top, and body(ctx, x, y, w, h) for what is inside, under the heading
D.panel=(ctx,x,y,w,h,o,body)=>{o=o||{};D.box(ctx,x,y,w,h,{fill:o.fill==null?"paper":o.fill,col:o.line||"ink",w:3,r:o.r==null?16:o.r,dash:o.dash});
  let top=y+14;if(o.title){D.caps(ctx,o.title,x+w/2,y+46,{align:"center",col:o.col||"ink",size:o.size||30});top=y+60;}
  if(body)body(ctx,x,top,w,y+h-top);return{x,y,w,h};};

/* ---------------------------------------------------------------- pieces */
D.card=(ctx,x,y,o)=>{o=o||{};const size=o.size||36,pad=o.pad==null?18:o.pad,rows=(o.lines||[]).map(rowOf),ir=o.icon?(o.ir||size*0.62):0,
    lh=(o.lh||1.22),hs=rows.map(([,ro])=>(ro.size||size)*lh),th=hs.reduce((a,b)=>a+b,0)-(rows.length?((rows[rows.length-1][1].size||size)*(lh-1)):0),
    tw=widthOf(ctx,o.lines||[],{size}),ix=o.icon?ir*2+pad*0.7:0,w=o.w||Math.ceil(tw+ix+pad*2),h=o.h||Math.ceil(Math.max(th+pad*1.5,ir*2+pad*1.2));
  D.box(ctx,x,y,w,h,{fill:o.fill==null?"paper":o.fill,col:o.col||"ink",w:o.lw||3,r:o.r==null?14:o.r,dash:o.dash});
  if(o.icon)D.icon(ctx,o.icon,x+pad+ir,y+h/2,ir,{fill:o.ifill||o.fill||"white"});
  let yy=y+(h-th)/2;rows.forEach(([s,ro],i)=>{const sz=ro.size||size;yy+=sz*0.8;D.text(ctx,s,x+pad+ix,yy,Object.assign({size,col:o.ink},ro));yy+=sz*(lh-0.8);});return{x,y,w,h};};
D.list=(ctx,x,y,items,o)=>{o=o||{};const size=o.size||38,gap=o.gap||size*1.6,out=[];
  items.forEach((it,i)=>{const base=y+i*gap,mid=base-size*0.3,r=size*0.42,c=it.col||o.col||"blue";let tx=x;
    if(it.icon){D.icon(ctx,it.icon,x+r*1.2,mid,r*1.2,{fill:it.ifill||c});tx=x+r*2.4+size*0.45;}
    else if(it.num!=null){D.disc(ctx,x+r,mid,r,{fill:fillOf(c),col:"ink",w:3});D.text(ctx,String(it.num),x+r,mid+size*0.26,{size:size*0.72,w:700,align:"center"});tx=x+r*2+size*0.45;}
    else if(it.dot){D.disc(ctx,x+r*0.5,mid,r*0.42,{fill:c,col:c,w:2});tx=x+r+size*0.35;}
    const m=D.text(ctx,it.s,tx,base,Object.assign({size,col:it.ink},it.o||{}));let x1=m.x1;
    if(it.sub){const sx=o.subX!=null?x+o.subX:m.x1+size*0.45,ms=D.text(ctx,it.sub,sx,base,Object.assign({size:o.subSize||size*0.84,col:"mut"},it.subO||{}));x1=ms.x1;}
    out.push({x,y:base-size,w:x1-x,h:size*1.3,base,mark:[x1+size*0.7,mid]});});return out;};
D.faces=(ctx,x,y,who,o)=>{o=o||{};const r=o.r||30,gap=o.gap||r*3.1,out=[];who.forEach((k,i)=>{const cx=x+i*gap;D.face(ctx,k,cx,y,r,o.ring?{ring:o.ring}:{});
    const nm=o.names===true?(typeof k==="string"&&K.CAST[k]?K.CAST[k].name.split(" ")[0]:""):(o.names||[])[i];if(nm)D.text(ctx,nm,cx,y+r*1.55+(o.size||30)*0.9,{size:o.size||30,w:700,align:"center",col:o.ncol});out.push({cx,cy:y});});return out;};
D.flow=(ctx,x,y,steps,o)=>{o=o||{};const size=o.size||34,gap=o.gap||60,out=[];let cx=x,cy=y;
  steps.forEach((st,i)=>{const s=typeof st==="string"?{s:st}:st,b=D.card(ctx,cx,cy,{icon:s.icon,lines:[[s.s,Object.assign({w:s.w||700},s.o||{})]].concat(s.sub?[[s.sub,{size:size*0.86,col:"mut"}]]:[]),size,fill:s.fill||"paper",col:s.col||"ink",h:o.h,w:s.bw||o.bw,ifill:s.ifill});out.push(b);
    if(i<steps.length-1){if(o.down){D.arrow(ctx,[b.x+b.w/2,b.y+b.h+8],[b.x+b.w/2,b.y+b.h+gap-8],{col:o.acol||"ink",w:3.5,head:14});cy=b.y+b.h+gap;}
      else{D.arrow(ctx,[b.x+b.w+8,b.y+b.h/2],[b.x+b.w+gap-8,b.y+b.h/2],{col:o.acol||"ink",w:3.5,head:14});cx=b.x+b.w+gap;}}});return out;};

/* ---------------------------------------------------------------- charts */
D.bars=(ctx,x,y,w,h,bars,o)=>{o=o||{};const n=bars.length,max=o.max||Math.max(...bars.map(b=>b.v)),slot=w/n,bw=o.bw||slot*0.56,size=o.size||30,base=y+h;
  bars.forEach((b,i)=>{const bh=Math.max(4,h*b.v/max),bx=x+slot*(i+0.5)-bw/2;D.box(ctx,bx,base-bh,bw,bh,{fill:fillOf(b.fill||b.col||"blue"),col:"ink",w:3,r:4});
    if(b.top)D.text(ctx,b.top,bx+bw/2,base-bh-size*0.4,{size:b.topSize||size,w:700,align:"center",col:b.ink||b.col||"ink"});
    if(b.label)D.text(ctx,b.label,bx+bw/2,base+size*1.1,{size,align:"center",col:b.lcol||"mut"});});
  D.line(ctx,[[x-10,base],[x+w+10,base]],{col:"ink",w:3.5,seed:7});return{x,y,w,h};};
D.trend=(ctx,x,y,w,h,pts,o)=>{o=o||{};const P=pts.map(([u,v])=>[x+u*w,y+h-v*h]);D.line(ctx,[[x,y-6],[x,y+h],[x+w+12,y+h]],{col:"ink",w:3,seed:3});
  D.line(ctx,P,{col:o.col||"blue",w:o.w||5,seed:11});if(o.dots!==false)for(const q of[P[0],P[P.length-1]])D.disc(ctx,q[0],q[1],8,{fill:fillOf(o.col||"blue"),col:"ink",w:2.5});
  for(const [u,s] of o.labels||[])D.text(ctx,s,x+u*w,y+h+(o.size||30)*1.1,{size:o.size||30,align:"center",col:"mut"});return{x,y,w,h};};
D.donut=(ctx,cx,cy,r,parts,o)=>{o=o||{};const tot=parts.reduce((a,p)=>a+p.v,0);let a=-Math.PI/2;ctx.save();pen(ctx,"ink",3);
  for(const p of parts){const b=a+TAU*p.v/tot;ctx.beginPath();ctx.arc(cx,cy,r,a,b);ctx.arc(cx,cy,r*0.56,b,a,true);ctx.closePath();ctx.fillStyle=css(fillOf(p.col||"blue"));if(p.strong)ctx.fillStyle=css(colOf(p.col));ctx.fill();ctx.stroke();a=b;}ctx.restore();
  if(o.label)D.text(ctx,o.label,cx,cy+(o.size||40)*0.34,{size:o.size||40,w:700,align:"center",col:o.lcol});return{x:cx-r,y:cy-r,w:r*2,h:r*2};};
D.cycle=(ctx,cx,cy,r,steps,o)=>{o=o||{};const n=steps.length,size=o.size||32,a0=o.a0==null?-Math.PI/2:o.a0,pos=steps.map((s,i)=>{const a=a0+TAU*i/n;return[cx+Math.cos(a)*r,cy+Math.sin(a)*r*(o.flat||1),a];}),
    ws=steps.map(st=>{const [s]=rowOf(st);return K.handW(ctx,s,size,700)+size*0.9;});
  // arrows along the circle, between each pill and the next
  for(let i=0;i<n;i++){const [x0,y0,a]=pos[i],[x1,y1,b0]=pos[(i+1)%n],b=b0<=a?b0+TAU:b0,m0=a+(b-a)*0.3,m1=a+(b-a)*0.7,rr=r*1.02;
    D.arrow(ctx,[cx+Math.cos(m0)*rr,cy+Math.sin(m0)*rr*(o.flat||1)],[cx+Math.cos(m1)*rr,cy+Math.sin(m1)*rr*(o.flat||1)],{col:o.acol||"ink",w:3.5,head:14,bow:-(rr*(o.flat||1))*0.12});}
  steps.forEach((st,i)=>{const [s,ro]=rowOf(st),[px,py]=pos[i],w=ws[i],h=size*1.5;D.box(ctx,px-w/2,py-h/2,w,h,{fill:fillOf(ro.col||o.col||"blue"),col:"ink",w:3,r:h/2});D.text(ctx,s,px,py+size*0.33,{size,w:700,align:"center"});});
  if(o.mid)D.text(ctx,o.mid,cx,cy+size*0.35,{size:o.midSize||size,w:700,align:"center",col:o.midCol||"mut"});return pos;};
D.stairs=(ctx,x,y,w,h,steps,o)=>{o=o||{};const n=steps.length,sw=w/n,size=o.size||30;ctx.save();
  steps.forEach((st,i)=>{const [s,ro]=rowOf(st),sh=h*(i+1)/n,bx=x+i*sw;D.box(ctx,bx,y+h-sh,sw,sh,{fill:fillOf(ro.col||o.col||"blue"),col:"ink",w:3,r:3});D.text(ctx,s,bx+sw/2,y+h-sh-size*0.45,{size,w:700,align:"center"});});
  if(o.flag)D.icon(ctx,"flag",x+w-sw*0.3,y-size*2.2,size*0.8,{fill:o.flag});ctx.restore();return{x,y,w,h};};
D.matrix=(ctx,x,y,w,h,o)=>{o=o||{};const size=o.size||30,q=o.q||[];
  if(o.on!=null){const i=o.on,qx=x+(i%2)*w/2,qy=y+(i>>1)*h/2;D.box(ctx,qx+6,qy+6,w/2-12,h/2-12,{fill:o.col||"green",col:false,r:10});}
  D.arrow(ctx,[x,y+h],[x,y-8],{col:"ink",w:3.5,head:14});D.arrow(ctx,[x,y+h],[x+w+8,y+h],{col:"ink",w:3.5,head:14});
  D.line(ctx,[[x+w/2,y+6],[x+w/2,y+h-6]],{col:"mut",w:2.5,dash:[8,8],seed:5});D.line(ctx,[[x+6,y+h/2],[x+w-6,y+h/2]],{col:"mut",w:2.5,dash:[8,8],seed:6});
  // each corner's words, wrapped to the corner with room on each side
  q.forEach((r,i)=>{const [s,ro]=rowOf(r),sz=ro.size||size,L=D.wrap(ctx,s,w/2-40,{size:sz,w:700}),lh=sz*1.12,cx=x+(i%2+0.5)*w/2,cy=y+((i>>1)+0.5)*h/2;
    L.forEach((l,j)=>D.text(ctx,l,cx,cy+(j-(L.length-1)/2)*lh+sz*0.3,Object.assign({size:sz,w:700,align:"center"},ro)));});
  if(o.xs)D.text(ctx,o.xs,x+w,y+h+size*1.15,{size,align:"right",col:"mut"});if(o.ys)D.text(ctx,o.ys,x+12,y-size*0.5,{size,col:"mut"});return{x,y,w,h};};
D.pyramid=(ctx,cx,y,w,h,layers,o)=>{o=o||{};const n=layers.length,size=o.size||32,lh=h/n,at=yy=>w*(yy-y)/h;
  layers.forEach((l,i)=>{const [s,ro]=rowOf(l),t0=i/n,t1=(i+1)/n,y0=y+i*lh,y1=y0+lh;ctx.save();ctx.beginPath();ctx.moveTo(cx-w/2*t0,y0);ctx.lineTo(cx+w/2*t0,y0);ctx.lineTo(cx+w/2*t1,y1);ctx.lineTo(cx-w/2*t1,y1);ctx.closePath();
    ctx.fillStyle=css(fillOf(ro.col||o.col||"blue"));ctx.fill();pen(ctx,"ink",3);ctx.stroke();ctx.restore();if(!s)return;
    // the words go in their layer where it is wide enough at their top; else beside it, with a line to it
    const W=K.handW(ctx,s,size,700),base=y0+lh*(i===0?0.78:0.5)+size*0.34;
    if(W+24<=at(base-size*0.72))D.text(ctx,s,cx,base,{size,w:700,align:"center"});
    else{const ym=y0+lh*0.62,ex=cx+at(ym)/2;D.line(ctx,[[ex+6,ym],[ex+48,ym]],{col:"ink",w:2.5,seed:i+3});D.text(ctx,s,ex+58,ym+size*0.32,{size,w:700});}});return{x:cx-w/2,y,w,h};};
D.timeline=(ctx,x,y,w,marks,o)=>{o=o||{};const size=o.size||30;D.arrow(ctx,[x,y],[x+w,y],{col:"ink",w:3.5,head:16});
  for(const m of marks){const px=x+m.u*w,up=m.up!=null?m.up:true;D.disc(ctx,px,y,9,{fill:fillOf(m.col||"blue"),col:"ink",w:2.5});
    if(m.s)D.text(ctx,m.s,px,up?y-size*0.75:y+size*1.35,{size,w:700,align:"center",col:m.ink});if(m.sub)D.text(ctx,m.sub,px,up?y-size*1.95:y+size*2.45,{size:size*0.9,align:"center",col:"mut"});}return{x,y,w};};
D.scale=(ctx,cx,cy,w,o)=>{o=o||{};const t=clamp(o.tilt||0,-1,1)*0.2,size=o.size||30,hw=w/2,lx=cx-Math.cos(t)*hw,ly=cy+Math.sin(t)*hw,rx=cx+Math.cos(t)*hw,ry=cy-Math.sin(t)*hw;
  D.line(ctx,[[cx,cy-14],[cx,cy+w*0.42]],{col:"ink",w:4,seed:2});D.line(ctx,[[cx-w*0.16,cy+w*0.42],[cx+w*0.16,cy+w*0.42]],{col:"ink",w:4,seed:3});D.line(ctx,[[lx,ly],[rx,ry]],{col:"ink",w:4.5,seed:4});D.disc(ctx,cx,cy,8,{fill:fillOf("amber"),col:"ink",w:2.5});
  for(const [px,py,s,c] of[[lx,ly,o.l,o.lcol||"amber"],[rx,ry,o.r,o.rcol||"green"]]){const pw=Math.max(w*0.36,(s?K.handW(ctx,s,size,700):0)+size*0.8),ph=size*1.45;
    D.line(ctx,[[px,py],[px-pw*0.4,py+w*0.18]],{col:"ink",w:2.5,seed:5});D.line(ctx,[[px,py],[px+pw*0.4,py+w*0.18]],{col:"ink",w:2.5,seed:6});
    D.box(ctx,px-pw/2,py+w*0.18,pw,ph,{fill:fillOf(c),col:"ink",w:3,r:ph/2});if(s)D.text(ctx,s,px,py+w*0.18+ph*0.5+size*0.33,{size,w:700,align:"center"});}return{x:cx-w/2,y:cy,w};};
D.venn=(ctx,cx,cy,r,o)=>{o=o||{};const size=o.size||32,d=r*0.62;ctx.save();ctx.globalAlpha*=0.85;for(const [x0,c] of[[cx-d,o.lcol||"blue"],[cx+d,o.rcol||"green"]]){ctx.fillStyle=css(tintOf(c));ctx.beginPath();ctx.arc(x0,cy,r,0,TAU);ctx.fill();}ctx.restore();
  for(const x0 of[cx-d,cx+d])D.disc(ctx,x0,cy,r,{col:"ink",w:3.5});
  // each side's words in the middle of what is only its own, the shared words where the two overlap: smaller to fit, never under
  // 28 px; words that don't fit even so go over their round (a side's) or under the overlap (the shared words)
  const fit=(s,room,sz)=>{const W=K.handW(ctx,s,sz,700),k=Math.min(1,room/Math.max(1,W));return sz*k>=28?sz*k:0;};
  for(const [s,sg] of[[o.l,-1],[o.r,1]])if(s){const f=fit(s,2*d-24,size);if(f)D.text(ctx,s,cx+sg*r,cy+f*0.3,{size:f,w:700,align:"center"});else D.text(ctx,s,cx+sg*d,cy-r-size*0.45,{size,w:700,align:"center"});}
  if(o.mid){const ms=o.midSize||size*0.9,f=fit(o.mid,2*(r-d)-14,ms),col=o.midCol||"ink";if(f)D.text(ctx,o.mid,cx,cy+f*0.3,{size:f,w:700,align:"center",col});
    else{D.line(ctx,[[cx,cy+r*0.55],[cx,cy+r+12]],{col:"ink",w:2.5,seed:9});D.text(ctx,o.mid,cx,cy+r+12+ms*1.0,{size:ms,w:700,align:"center",col});}}
  return{x:cx-d-r,y:cy-r,w:2*(d+r),h:2*r};};
D.dots=(ctx,x,y,cols,rows,o)=>{o=o||{};const g=o.gap||22,r=o.r||7,on=o.on||0;let k=0;ctx.save();pen(ctx,"ink",1.8);
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++,k++){ctx.beginPath();ctx.arc(x+i*g,y+j*g,r,0,TAU);ctx.fillStyle=css(k<on?fillOf(o.col||"blue"):tintOf(o.off||"white"));ctx.fill();ctx.stroke();}ctx.restore();return{x,y,w:(cols-1)*g,h:(rows-1)*g};};
D.big=(ctx,s,cx,cy,o)=>{o=o||{};const size=o.size||64,W=K.handW(ctx,s,size,700),r=o.r||Math.max(size*0.95,W*0.62+size*0.3);ctx.save();ctx.beginPath();
  for(let i=0;i<=24;i++){const a=i*TAU/24,rr=r*(i%2?0.94:1.06);i?ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr):ctx.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}ctx.closePath();
  ctx.fillStyle=css(fillOf(o.fill||o.col||"amber"));ctx.fill();pen(ctx,"ink",3);ctx.stroke();ctx.restore();D.text(ctx,s,cx,cy+size*0.34,{size,w:700,align:"center",col:o.col||"ink"});return{x:cx-r,y:cy-r,w:r*2,h:r*2};};
})(PK);

/* ===== The question behind the request: Pisa, 1989 to 2001, in ink line =====
   The opening story's places, people and things (prefix qbp_). The people kit draws the people and the rooms' things and is never
   changed for this film. Checked against the script's Rigour (Burland, Jamiolkowski and Viggiani, 2009; Jamiolkowski, 2001).
     qbpSquare      the lawn below the tower on a clear day, seen from where visitors stand: the eye line low (QBP_E), so the tower
                    stands far off, whole, and people near are large
     qbpSite        the tower's foot seen from nearer (QBP_SE): the lawn, a site's fence, the tower's lower floors going up out of frame
     qbpPavia       a square in another city, Pavia, in 1989: brick houses, and a fenced heap where a tower stood
     qbpOffice      the room in 1990 where the committee meets: a table, a window with the tower far off, a sheet on the wall
     qbp_tower(ctx, x, y, k, lean)   the bell tower as built: the tall ground floor's blind arches, six open galleries of columns, the
                    narrower bell chamber; its foot's middle at (x, y), k px a metre, leaning lean degrees to the right (south)
     qbp_lead(ctx, x, y, k, a)       the lead ingots stacked on a concrete ring on the north side (o: how much is there, 0 to 1)
     qbp_drill(ctx, x, y, k, a, run) a small drilling rig, its auger slanting under the tower's north side
   Nothing is a likeness or a copy of a photograph; nobody is shown hurt. Colour keeps the module's meaning: amber the danger, blue
   the plan, green what was done; the marble, the lawn and the sky carry none. Every name this file declares starts with qbp_ or QBP_. */
const QBP_E=600,QBP_SE=470;                                   // the eye lines: on the lawn, and at the site
const QBP_TW=[1220,616],QBP_K=8.2,QBP_LEAN0=5.5,QBP_LEAN1=5.0;   // where the tower stands on the lawn, its px a metre, its lean before and after
const qbp_h=fl=>PK.hAt(fl,QBP_E),qbp_hs=fl=>PK.hAt(fl,QBP_SE);
const QBP_PAL={sky:[206,224,236],sky2:[240,236,222],hill:[176,180,166],roof:[196,120,92],wallc:[232,214,186],lawn:[150,170,120],lawn2:[132,154,106],
  path:[224,214,192],marble:[240,236,224],shade:[176,170,158],brick:[184,106,82],brick2:[160,92,70],fence:[200,140,60],lead:[110,116,124],concrete:[196,192,184],
  rig:[220,170,70],wall:[232,226,212],floor:[176,150,124],wood:[150,110,78]};
const qbp_c=k=>PK.S.tone(QBP_PAL[k]);

/* ---------------------------------------------------------------- the tower */
function qbp_tower(ctx,x,y,k,lean,o){o=o||{};const S=PK.S,U=PK.u,R=7.7*k,G0=11*k,GS=6.5*k,BR=5.2*k,BH=6*k,mar=qbp_c("marble"),sh=qbp_c("shade");
  ctx.save();ctx.translate(x,y);ctx.rotate(lean*Math.PI/180);if(o.a!=null)ctx.globalAlpha*=o.a;
  S.begin(ctx,{lw:Math.max(1.4,k*0.22),sh:0});
  // the body, the ground floor's blind arches
  S.fill(ctx,c=>c.rect(-R,-(G0+6*GS),2*R,G0+6*GS),mar,{grad:[-R,0,R,0,0.12]});
  const nA=5;for(let i=0;i<nA;i++){const ax=-R+(i+0.5)*2*R/nA,aw=2*R/nA*0.34;S.line(ctx,c=>{c.moveTo(ax-aw,0);c.lineTo(ax-aw,-G0*0.7);c.arc(ax,-G0*0.7,aw,Math.PI,0);c.lineTo(ax+aw,0);},sh,0.6);}
  // six open galleries: the shade inside, the columns and their arches, a cornice under each
  for(let g=0;g<6;g++){const y0=-(G0+g*GS),y1=y0-GS;
    S.fill(ctx,c=>c.rect(-R*0.94,y1+GS*0.18,R*1.88,GS*0.72),sh,{w:0.5});
    const nC=7;for(let i=0;i<=nC;i++){const cx=-R*0.94+i*R*1.88/nC;S.fill(ctx,c=>c.rect(cx-k*0.28,y1+GS*0.3,k*0.56,GS*0.6),mar,{w:0.4});}
    S.line(ctx,c=>{for(let i=0;i<nC;i++){const cx=-R*0.94+(i+0.5)*R*1.88/nC,r=R*0.94/nC;c.moveTo(cx-r,y1+GS*0.34);c.arc(cx,y1+GS*0.34,r,Math.PI,0);}},mar,0.7);
    S.fill(ctx,c=>c.rect(-R*1.03,y0-GS*0.1,R*2.06,GS*0.12),mar,{w:0.6});}
  // the bell chamber
  const top=-(G0+6*GS);S.fill(ctx,c=>c.rect(-BR,top-BH,2*BR,BH),mar,{});
  S.line(ctx,c=>{for(let i=0;i<4;i++){const cx=-BR+(i+0.5)*2*BR/4,r=BR/5;c.moveTo(cx-r,top-BH*0.1);c.lineTo(cx-r,top-BH*0.6);c.arc(cx,top-BH*0.6,r,Math.PI,0);c.lineTo(cx+r,top-BH*0.1);}},sh,0.7);
  S.fill(ctx,c=>c.rect(-BR*1.08,top-BH-k*0.6,BR*2.16,k*0.7),mar,{w:0.6});
  ctx.restore();
  // the tower's top, where it is: [x, y], for a line from the foot
  const a=lean*Math.PI/180,Ht=G0+6*GS+BH;return{top:[x+Math.sin(a)*Ht,y-Math.cos(a)*Ht],foot:[x,y]};}

// the lead ingots on their concrete ring, at the north side's foot (x: the ring's middle; a: how much lead, 0 to 1)
function qbp_lead(ctx,x,y,k,a){if(a<=0.004)return;const S=PK.S;S.begin(ctx,{lw:Math.max(1.4,k*0.1),sh:2});
  S.fill(ctx,c=>c.rect(x-4*k,y-1.2*k,8*k,1.2*k),qbp_c("concrete"),{});
  const n=Math.round(10*a);for(let i=0;i<n;i++){const row=Math.floor(i/5),col=i%5,w=1.5*k;S.fill(ctx,c=>c.rect(x-3.8*k+col*w+row*0.6*k,y-1.2*k-(row+1)*0.55*k,w*0.94,0.52*k),qbp_c("lead"),{w:0.5});}}
// a small drilling rig at the north side, its auger slanting down under the tower (run: 0 to 1, how far the auger has gone in)
function qbp_drill(ctx,x,y,k,a,run){if(a<=0.004)return;const S=PK.S;ctx.save();ctx.globalAlpha*=a;S.begin(ctx,{lw:Math.max(1.4,k*0.1),sh:2});
  S.fill(ctx,c=>c.rect(x-2.4*k,y-1.4*k,3.4*k,1.4*k),qbp_c("rig"),{});S.fill(ctx,c=>c.rect(x-2.0*k,y-3.0*k,1.4*k,1.6*k),PK.u.dk(qbp_c("rig"),0.15),{});
  const L=2.4*k+run*1.6*k;S.line(ctx,c=>{c.moveTo(x+1.0*k,y-0.8*k);c.lineTo(x+1.0*k+L*0.92,y-0.8*k+L*0.38);},[90,86,82],1.4);
  ctx.restore();}

/* ---------------------------------------------------------------- places */
function qbp_sky(ctx,hz){const U=PK.u,g=ctx.createLinearGradient(0,0,0,hz);g.addColorStop(0,U.css(qbp_c("sky")));g.addColorStop(1,U.css(qbp_c("sky2")));ctx.fillStyle=g;ctx.fillRect(0,0,1920,hz+4);}
function qbp_city(ctx,hz,k){const S=PK.S;S.begin(ctx,{lw:2,far:0.6,sh:2});
  S.fill(ctx,c=>{c.moveTo(-20,hz-60*k);c.quadraticCurveTo(500,hz-120*k,900,hz-70*k);c.quadraticCurveTo(1400,hz-30*k,1940,hz-90*k);c.lineTo(1940,hz);c.lineTo(-20,hz);c.closePath();},qbp_c("hill"),{});
  S.begin(ctx,{lw:2,far:0.35,sh:2});for(let i=0;i<14;i++){const x0=-40+i*142,w=120+(i*37)%40,h=(40+(i*23)%30)*k;
    S.fill(ctx,c=>c.rect(x0,hz-h,w,h),qbp_c("wallc"),{w:0.5});S.fill(ctx,c=>{c.moveTo(x0-6,hz-h);c.lineTo(x0+w/2,hz-h-14*k);c.lineTo(x0+w+6,hz-h);c.closePath();},qbp_c("roof"),{w:0.5});}}
function qbp_lawn(ctx,hz){const S=PK.S;S.begin(ctx,{lw:2.6,sh:4});S.poly(ctx,[[-20,hz,1],[1940,hz,1],[1940,1100,1],[-20,1100,1]],qbp_c("lawn"),{exact:true,grad:[0,hz,0,1080,0.12]});}
AG_PLACES.qbpSquare=ctx=>{const S=PK.S,hz=QBP_E+8;qbp_sky(ctx,hz);qbp_city(ctx,hz,1);qbp_lawn(ctx,hz);
  // the path across the lawn, and the stone ring at the tower's foot
  S.begin(ctx,{lw:2.4,sh:3});S.poly(ctx,[[300,1100,1],[860,hz+6,1],[960,hz+6,1],[1500,1100,1]],qbp_c("path"),{exact:true});
  S.fill(ctx,c=>c.ellipse(QBP_TW[0],QBP_TW[1]+2,110,14,0,0,7),qbp_c("path"),{w:0.6});};
AG_PLACES.qbpSite=ctx=>{const S=PK.S,hz=QBP_SE+6;qbp_sky(ctx,hz);qbp_city(ctx,hz,0.7);qbp_lawn(ctx,hz);
  // a site's fence across the lawn, behind where the engineers stand
  S.begin(ctx,{lw:2.4,sh:3});S.line(ctx,c=>{c.moveTo(-20,hz+70);c.lineTo(1940,hz+70);c.moveTo(-20,hz+100);c.lineTo(1940,hz+100);for(let x=0;x<1960;x+=120){c.moveTo(x,hz+50);c.lineTo(x,hz+116);}},qbp_c("fence"),1.0);};
AG_PLACES.qbpPavia=ctx=>{const S=PK.S,hz=500;qbp_sky(ctx,hz);
  S.begin(ctx,{lw:2.6,far:0.15,sh:3});
  for(const [x0,x1,top,col] of [[-40,420,170,"brick"],[420,760,230,"wallc"],[1220,1560,200,"brick2"],[1560,1960,150,"wallc"]]){
    S.fill(ctx,c=>c.rect(x0,top,x1-x0,hz-top+10),qbp_c(col),{grad:[0,top,0,hz,0.08]});
    for(let x=x0+50;x<x1-40;x+=110)S.fill(ctx,c=>c.rect(x,top+60,46,80),PK.u.dk(qbp_c(col),0.3),{w:0.5});}
  S.begin(ctx,{lw:2.6,sh:4});S.poly(ctx,[[-20,hz,1],[1940,hz,1],[1940,1100,1],[-20,1100,1]],[200,190,176],{exact:true,grad:[0,hz,0,1080,0.1]});
  // where the tower stood: a stump of brick, the heap round it, and a fence in front
  S.fill(ctx,c=>{c.moveTo(800,hz+40);c.lineTo(860,hz-150);c.lineTo(900,hz-120);c.lineTo(940,hz-170);c.lineTo(1000,hz-110);c.lineTo(1050,hz+40);c.closePath();},qbp_c("brick2"),{});
  S.fill(ctx,c=>{c.moveTo(620,hz+70);c.quadraticCurveTo(930,hz-90,1240,hz+70);c.closePath();},qbp_c("brick"),{});
  S.line(ctx,c=>{for(const [x,y] of [[700,hz+40],[800,hz+10],[1000,hz+20],[1120,hz+50],[900,hz-10]]){c.moveTo(x,y);c.lineTo(x+40,y-8);}},PK.u.dk(qbp_c("brick"),0.3),0.6);
  S.line(ctx,c=>{c.moveTo(560,hz+110);c.lineTo(1320,hz+110);c.moveTo(560,hz+140);c.lineTo(1320,hz+140);for(let x=560;x<=1320;x+=95){c.moveTo(x,hz+90);c.lineTo(x,hz+160);}},qbp_c("fence"),1.0);};
const QBP_RF=800,QBP_IE=380,qbp_hi=fl=>PK.hAt(fl,QBP_IE);
AG_PLACES.qbpOffice=ctx=>{const S=PK.S,U=PK.u;ctx.fillStyle=U.css(qbp_c("wall"));ctx.fillRect(0,0,1920,QBP_RF);
  S.begin(ctx,{lw:2.6,sh:4});S.fill(ctx,c=>c.rect(-20,QBP_RF-60,1960,60),U.dk(qbp_c("wall"),0.1),{w:0.6});
  S.poly(ctx,[[-20,QBP_RF,1],[1940,QBP_RF,1],[1940,1100,1],[-20,1100,1]],qbp_c("floor"),{exact:true,grad:[0,QBP_RF,0,1080,0.1]});
  // the window, the tower small and far beyond the roofs
  PK.window(ctx,1240,140,460,380,(c,x,y,w,h)=>{qbp_sky(c,y+h);c.save();c.translate(x,y+h*0.25);c.scale(w/1920,w/1920);qbp_city(c,QBP_E+300,1.4);c.restore();
    qbp_tower(c,x+w*0.56,y+h*0.86,4.6,QBP_LEAN0);},{});
  // the committee's sheet on the wall, where a hand can reach it (drawn on by the board's rows)
  S.begin(ctx,{lw:2.6,sh:4});PK.board(ctx,QBP_BD.x,QBP_BD.y,QBP_BD.w,QBP_BD.h,{});};
// the committee's sheet: a board's 1250 by 524 px at k
const QBP_BD={x:180,y:250,k:0.5,w:1250*0.5,h:524*0.5,floor:930,rest:900};

/* ---------------------------------------------------------------- the people of Pisa and Pavia: nobody's likeness */
const QBP_FOLK={
  eng1:{key:"eng1",name:"",skin:[226,188,160],hair:{style:"short",c:[176,170,166]},glasses:[60,52,50],top:{kind:"jacket",c:[120,124,136],inner:[236,232,222]},bottom:{kind:"trousers",c:[70,72,84]},shoe:[60,50,46]},
  eng2:{key:"eng2",name:"",skin:[232,196,166],hair:{style:"bob",c:[70,48,40]},top:{kind:"jacket",c:[60,88,120],inner:[240,236,226]},bottom:{kind:"trousers",c:[80,84,96]},shoe:[56,48,46]},
  eng3:{key:"eng3",name:"",skin:[212,170,136],hair:{style:"crop",c:[40,32,30]},beard:[54,42,36],top:{kind:"sweater",c:[150,120,96]},bottom:{kind:"trousers",c:[86,80,74]},shoe:[70,56,48]},
  com1:{key:"com1",name:"",skin:[238,206,180],hair:{style:"short",c:[214,210,206]},glasses:[60,52,50],top:{kind:"jacket",c:[86,90,104],inner:[236,232,222]},bottom:{kind:"trousers",c:[60,62,72]},shoe:[50,44,42]},
  com2:{key:"com2",name:"",skin:[180,130,100],hair:{style:"bun",c:[50,40,36]},top:{kind:"jacket",c:[150,80,74],inner:[240,232,220]},bottom:{kind:"skirt",c:[70,70,86]},shoe:[60,48,46]},
  guard:{key:"guard",name:"",skin:[220,180,150],hair:{style:"short",c:[50,40,34]},top:{kind:"jacket",c:[50,60,90],inner:[220,224,232]},bottom:{kind:"trousers",c:[46,52,76]},shoe:[40,36,36]},
  res1:{key:"res1",name:"",skin:[230,196,170],hair:{style:"long",c:[90,60,44]},top:{kind:"jacket",c:[196,170,120],inner:[240,236,226]},bottom:{kind:"skirt",c:[110,90,80]},shoe:[80,60,50]},
  res2:{key:"res2",name:"",skin:[214,176,146],hair:{style:"short",c:[60,50,44]},top:{kind:"sweater",c:[130,150,130]},bottom:{kind:"trousers",c:[90,90,100]},shoe:[60,50,46]}};
const qbp_row=w=>typeof w==="string"?(QBP_FOLK[w]||PK.CAST[w]):w;
const qbp_person=(ctx,who,x,fl,pose,o,hf)=>PK.person(ctx,qbp_row(who),x,fl,(hf||qbp_h)(fl),pose,o);
const qbp_walk=(ctx,who,t,w,o,hf)=>PK.walk(ctx,qbp_row(who),t,Object.assign({h:(hf||qbp_h)(w.floor)},w),o);
const qbp_seat=(ctx,who,x,fl,pose,o)=>PK.seated(ctx,qbp_row(who),x,fl,qbp_hi(fl),pose||"sit",o);

/* ===== The question behind the request: the university, February to June 2027 (imagined) =====
   The places are the people kit's (films/people-first/shared/src/places.js): the team's room, Helena's corner, the campus and a
   teaching room; and, apart from the scene, a board seen close and a page of Helena's notebook (concepts.js). This file holds what is
   this film's own in them: where the team works, the boards' rows Carmen Vidal writes, and the pages Noor, Ivy and Helena keep.
   Every time comes from the voice: sc is the chapter, w a word's time in a line. Colour means what it means in the module: blue a plan
   or a rule, orange data, green something done or agreed, amber a risk. */
AG_PLACES.qbTeam=PK.place.team;AG_PLACES.qbCorner=PK.place.corner;AG_PLACES.qbCampus=PK.place.campus;AG_PLACES.qbLecture=PK.place.lecture;
AG_PLACES.qbBoard=PK.place.board;AG_PLACES.qbNotes=c=>PK.place.notes(c,{});
const QB_T=PK.ROOMS.team,QB_CA=PK.ROOMS.campus,QB_CO=PK.ROOMS.corner,QB_LE=PK.ROOMS.lecture;
const qb_hT=fl=>PK.hAt(fl,QB_T.eye),qb_hC=fl=>PK.hAt(fl,QB_CA.eye),qb_hL=fl=>PK.hAt(fl,QB_LE.eye);
// a face that speaks from t0 to t1, on a base expression
const qb_says=(base,tt,t0,t1)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,PK.talk(tt,t0,t1)*0.75);return e;};
const qb_lis=(tt,g)=>PK.face(tt,{expr:"listen",gaze:[1,g==null?-0.2:g]},[]);
// poses of this film's own: writing in a notebook held in the far hand; holding a sheet out to show it
const QB_NOTE={lean:6,head:14,aN:[34,96,"grip"],aF:[30,92,"grip"],lN:[-2,-2],lF:[5,4]};
const QB_SHOW={lean:2,head:6,aN:[44,82,"grip"],aF:[8,16],lN:[-2,-2],lF:[5,4]};
const QB_CARRY={lean:-2,head:0,aN:[24,70,"grip"],aF:[6,14],lN:[-2,-2],lF:[4,3]};
const qb_sheet=(c,h)=>{const S=PK.S;S.begin(c,{lw:2.2});PK.sheet(c,h[0]-6,h[1]-58,56,74,{rot:0.06});};

// a desk with its screen drawn in o.on, so the person at it is never taken for someone on a screen: o.screen "monitor" or "laptop"
function qb_desk(x,who,px,fl,h,o){o=Object.assign({},o||{});const kind=o.screen,on2=o.on;
  o.screen=null;o.on=(cc,D)=>{if(kind==="monitor")PK.monitor(cc,o.sx==null?D.x0+D.dir*D.w*0.6:o.sx,D.top,o.sw||0.36*h,o.sh||0.23*h,{draw:o.show});
    else if(kind==="laptop")PK.laptop(cc,D.x0+D.dir*0.21*h,D.top,{k:D.k,flip:D.dir<0});if(on2)on2(cc,D);};
  return PK.atDesk(x,who,px,fl,h,o);}

/* ---------------------------------------------------------------- the team's room
   Who works where: Sam at the desk at the back, Jun at the desk at the back right, turned the other way, and Marta at the desk by the
   window. Everything is drawn far to near (by floor), so nobody is drawn over someone nearer: o.people is a list of {fl, draw(x)} for
   whoever else is in the room (the floor they stand or sit on); o.sam, o.jun, o.marta: what PK.atDesk takes for each (null: the desk
   stands empty); o.show: what Marta's screen shows, o.showJ Jun's; o.clock: the time on the wall. Returns their joints. */
const QB_DESK={sam:[1230,QB_T.back],jun:[1808,QB_T.back],marta:[560,QB_T.mid]};
function qb_team(x,tt,o){o=o||{};const r={},HB=qb_hT(QB_T.back),HM=qb_hT(QB_T.mid);PK.clock(x,QB_T.clock[0],QB_T.clock[1],QB_T.clock[2],o.clock===undefined?9:o.clock);
  const items=[{fl:QB_T.back,i:0,draw:c=>{r.sam=PK.atDesk(c,o.sam===null?null:(o.samWho||"sam"),QB_DESK.sam[0],QB_T.back,HB,Object.assign({t:tt,w:0.45*HB},o.sam||{}));}},
    {fl:QB_T.back,i:1,draw:c=>{r.jun=PK.atDesk(c,o.jun===null?null:"jun",QB_DESK.jun[0],QB_T.back,HB,Object.assign({t:tt+3,flip:true,w:0.45*HB,show:o.showJ},o.jun||{}));}},
    {fl:QB_T.mid,i:2,draw:c=>{r.marta=qb_desk(c,o.marta===null?null:(o.deskWho||"marta"),QB_DESK.marta[0],QB_T.mid,HM,Object.assign({t:tt+1,flip:true,w:0.84*HM,sx:205,screen:"monitor",show:o.show||PK.onScreen.chat(0,{}),
      on:(cc,D)=>{PK.S.begin(cc,{lw:2.6,sh:3});PK.mug(cc,D.x1+34,D.top,0.7,PK.col("mug"),tt,o.steam!==false);}},o.marta||{}));}}];
  (o.people||[]).forEach((p,i)=>items.push(Object.assign({i:10+i},p)));
  items.sort((a,b)=>a.fl-b.fl||a.i-b.i).forEach(it=>it.draw(x));return r;}
AG_BARE.qbTeam=(x,tt)=>qb_team(x,tt,{sam:null,jun:null,marta:null,clock:null});

/* ---------------------------------------------------------------- the team's board, and Carmen Vidal at it
   Carmen Vidal, a consultant who works with the team now and then, explains the film's ideas at the team's board (PK.teach). The film
   cuts between the room, where its board shows the rows small, and the board seen close (naBoard): both draw the same rows at the
   same times. In the room, Helena stands to the side with her notebook, clear of where Carmen walks and rests, and whoever is at
   their desk has turned to the board. */
const QB_RB={x:742,y:262,k:0.35,deco:true,floor:848,rest:1212};
const qb_roomBoard=(cx,tt,rows,who,o)=>{const q=Object.assign({},QB_RB,{h:qb_hT(QB_RB.floor)});for(const k in o||{})if(o[k]!==undefined)q[k]=o[k];return PK.teach(cx,who,tt,rows,q);};
const QB_SIDE={x:1690,floor:900},QB_SAMC={x:1480,floor:905};
// o.rows, o.say, o.events: the board's; o.note (0 to 1): Helena looks down and writes; o.helena, o.sam, o.jun: faces. Returns joints
function qb_lesson(x,tt,o){o=o||{};let Jc=null,R2=null,Js=null;const wr=o.note||0,R=qb_team(x,tt,{clock:o.clock,marta:o.marta===undefined?null:o.marta,sam:null,
    jun:Object.assign({work:0,pose:"sit"},o.jun||qb_lis(tt,-0.2)),people:[
    {fl:QB_SAMC.floor,draw:c=>{Js=PK.seated(c,"sam",QB_SAMC.x,QB_SAMC.floor,qb_hT(QB_SAMC.floor),"sit",Object.assign({t:tt+2,flip:true},o.sam||qb_lis(tt,-0.25)));}},
    {fl:QB_RB.floor,draw:c=>{Jc=qb_roomBoard(c,tt,o.rows||[],o.who||"carmen",{say:o.say,events:o.events});}},
    {fl:QB_SIDE.floor,draw:c=>{R2=PK.person(c,"helena",QB_SIDE.x,QB_SIDE.floor,qb_hT(QB_SIDE.floor),PK.poseMix("clasp",QB_NOTE,wr),Object.assign({t:tt+4,flip:true,underF:PK.inHand.notebook({}),hold:wr>0.3?PK.inHand.pen("blue"):null,holds:true},o.helena||qb_lis(tt,-0.2),wr>0.004?{gaze:[1,0.6*wr]}:{}));}}]});
  R.helena=R2;R.at=Jc;R.sam=Js;return R;}

/* ---------------------------------------------------------------- Helena's corner
   Helena at the round table: alone, with her two sheets (o.sheets), or with someone across from her (o.who2). o.lean (0 to 1): she
   leans in; o.he, o.ie: their faces; o.write (0 to 1): her pen on the sheet; o.t0: when the shot starts (two people cross the lawn
   outside once, from then). Returns {helena, who2}: their joints. */
const QB_SITH={mode:"sit",lean:2,head:0,aN:[24,76],aF:[28,80],lN:[86,3],lF:[82,-5]},QB_SITH2={mode:"sit",lean:13,head:-5,aN:[40,80,"open"],aF:[36,78],lN:[86,5],lF:[82,-6]};
const QB_SITI={mode:"sit",lean:6,head:6,aN:[26,74,"grip"],aF:[30,78,"grip"],lN:[86,8],lF:[82,-2]};
function qb_corner(x,tt,o){o=o||{};const U=PK.u,S=PK.S,{F,H,hx,ix,tx,rx,ty,win}=QB_CO,lean=o.lean||0,t0=o.t0||0,lw={lw:3.4,far:0,sh:5},r={},wr=o.write||0;
  x.save();x.beginPath();x.rect(win[0],win[1],win[2],win[3]);x.clip();
  for(const [i,ts,d,left,dy,h] of [[3,t0+1,22,false,34,92],[9,t0+8,26,true,24,96]]){if(tt<ts||tt>ts+d)continue;
    PK.walk(x,PK.extra(i),tt,{x0:left?win[0]+win[2]+40:win[0]-40,x1:left?win[0]-40:win[0]+win[2]+40,t0:ts,t1:ts+d,floor:win[1]+win[3]-dy,h},{far:0.55,shade:0});}
  x.restore();PK.windowFrame(x,win[0],win[1],win[2],win[3],{});
  const hp=PK.poseMix(QB_SITH,QB_SITH2,Math.max(lean,0.6*wr)),W2=o.who2;
  S.begin(x,lw);PK.chair(x,hx-10,F,H,false,{});if(W2)PK.chair(x,ix+10,F,H,true,{col:PK.PAL.chair2});
  const W1=o.who1||"helena";PK.person(x,W1,hx,F,H,hp,{t:tt,part:"lower"});if(W2)PK.person(x,W2,ix,F,H,QB_SITI,{t:tt+1,flip:true,part:"lower"});
  S.begin(x,lw);PK.table(x,tx,ty,rx,F);
  S.begin(x,{lw:2.6,far:0,sh:3});PK.mug(x,tx+150,ty+10,0.9,PK.col("mug2"),tt,true);
  // the two sheets on the table: the chart (its boxes in blue) and the list (its lines in orange)
  if(o.sheets){S.begin(x,{lw:2.4,sh:3});for(const [sx,col,k] of [[tx-150,PK.C.orange,1],[tx-10,PK.C.blue,0]]){S.poly(x,[[sx-60,ty-4,1],[sx+60,ty-10,1],[sx+84,ty+8,1],[sx-40,ty+16,1]],[250,248,240],{exact:true});
    S.line(x,c=>{for(let i=0;i<3;i++){c.moveTo(sx-34+i*6,ty+2-i*5);c.lineTo(sx+50+i*6,ty-2-i*5);}},col,0.6);}}
  if(o.book){S.begin(x,{lw:2.6,far:0,sh:3});PK.notebook(x,tx-200,ty+4,1.1,{});}
  if(o.laptop){S.begin(x,{lw:2.6,far:0,sh:3});PK.laptop(x,tx-150,ty+6,{k:1.25,glow:true});r.laptop=[tx-150,ty-70];}
  const pen=[U.lerp(790,tx-130,wr),ty-6];
  r.helena=r.who1=PK.person(x,W1,hx,F,H,hp,Object.assign({t:tt,part:"upper",expr:o.he,gaze:o.hg||[1,0.25],reachN:o.handN||(wr>0.01?pen:[790,ty-4]),reachF:o.handF||[806,ty-12],hold:o.hold||(wr>0.3?PK.inHand.pen("blue"):null),holds:!!(o.hold||wr>0.3)},o.hf||{}));
  if(W2)r.who2=PK.person(x,W2,ix,F,H,QB_SITI,Object.assign({t:tt+1,flip:true,part:"upper",expr:o.ie,gaze:o.ig||[1,0.3],reachN:[1150,ty-6],reachF:[1128,ty-2]},o.iface||{}));
  return r;}



/* ---------------------------------------------------------------- a teaching room: the door with its room's name, the sensor above it
   Ivy and Sam look at the sensor over the door, which counts the people in the room every hour.
   o.people: [{fl, draw(x)}], drawn far to near; o.plate (0 to 1): the room's name by the door */
const QB_LE2=PK.ROOMS.lecture;
function qb_room(x,tt,o){o=o||{};if((o.plate||0)>0.004)PK.tag(x,560,420,"B-204",o.plate,{});
  (o.people||[]).slice().sort((a,b)=>a.fl-b.fl).forEach(p=>p.draw(x));}

/* ---------------------------------------------------------------- what a screen shows, close: a callout's rows of words, and bars.
   rows: [text, col, size]; bars: [[label, n, of, col]] */
function qb_panel(cc,bx,by,bw,bh,head,rows,bars,hc){const U=PK.u;let y=by+54;
  if(head){ag_T(cc,head.toUpperCase(),bx+30,y,{w:800,size:28,ls:3,color:U.css(hc||PK.C.amber)});y+=52;}
  for(const [s,col,size] of rows||[]){ag_T(cc,s,bx+30,y,{w:700,size:size||34,color:U.css(col||PK.C.ink)});y+=(size||34)+16;}
  for(const [lab,n,of,col] of bars||[]){const w=(bw-60)*n/of;PK.S.begin(cc,{lw:2});PK.S.fill(cc,c=>c.rect(bx+30,y-6,w,30),col,{w:0.6});
    ag_T(cc,lab,bx+30,y+62,{w:700,size:30,color:U.css(PK.C.ink)});y+=96;}}





/* ---------------------------------------------------------------- the boards' rows (the board's own px, 1250 by 524; a hand reaches
   baselines from 96 to 470). Laid out for someone who walks: on from left to right, a row's parts along it. */
// 0. the committee's sheet in 1990 (an engineer): what saving the tower would mean, and how
const qb_boardO=(sc,w)=>[
  {s:"Saving it means",x:70,y:120,size:72,col:"blue",at:w("meant","agreed",-0.2),d:0.9},
  {s:"about ½ a degree",x:70,y:250,size:72,col:"green",at:w("meant","half a degree",-0.3),d:1.0},
  {s:"too little to see",x:640,y:250,size:56,at:w("meant","too little",-0.2),d:0.9},
  {s:"less strain · steadier ground",x:70,y:370,size:56,at:w("enough","ease",-0.3),d:1.2},
  {s:"soil out, north side",x:520,y:470,size:60,col:"blue",at:w("method","draw",-0.2),d:1.0}];
// 1. what a request says, and doesn't (Carmen): drawn as a designer would, a graphic recording pinned over the board (PK.sk.drawn),
// almost done; she rings what the request names, then adds the last words on the right as the voice says them, the last at the edge
const qb_boardA=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"What a request says");
    D.panel(c,70,140,500,290,{},(cc,x,y)=>{D.face(cc,"graham",x+56,y+36,34);D.text(cc,"Graham Ellis",x+104,y+34,{size:32,w:700});D.text(cc,"Thursday 11 February",x+104,y+70,{size:28,col:"mut"});
      D.icon(cc,"mail",x+446,y+36,22,{fill:"blue"});D.text(cc,"Could I have a dashboard",x+30,y+148,{size:36});D.text(cc,"of room use, by Easter?",x+30,y+196,{size:36});});
    // the request is the tip; what it's for lies under the water
    D.line(c,[[610,262],[660,256],[710,264],[760,256],[810,264],[860,256],[910,262]],{col:"blue",w:3,seed:3});
    D.line(c,[[680,262],[716,176],[744,192],[772,150],[816,262]],{close:true,fill:"white",col:"ink",w:3,seed:5});
    D.line(c,[[648,268],[860,268],[904,330],[870,404],[748,418],[650,394],[618,330]],{close:true,fill:"blue",col:"ink",w:3,seed:7});
    D.text(c,"?",760,368,{size:76,w:700,align:"center",col:"blue"});}),
  {k:"ring",x:432,y:290,rx:92,ry:30,col:"blue",at:w("clear","a thing",-0.2),d:0.5},{k:"ring",x:408,y:338,rx:96,ry:30,col:"blue",at:w("clear","a date",-0.2),d:0.5},
  {s:"someone's guess",x:850,y:196,size:40,w:700,col:"amber",at:w("guess","guess",-0.2),d:0.8},
  {s:"what it's for",x:930,y:350,size:40,w:700,col:"amber",at:w("guess","What it's for",-0.2),d:0.7},
  {s:"on time, and no help",x:1180,y:468,size:44,w:700,col:"mut",align:"right",at:w("nobody","on time",-0.2),d:0.9}];
// 2. how to ask, and how to listen (Carmen)
const qb_boardB=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.head(c,"How to ask, how to listen");
    D.panel(c,70,140,520,290,{title:"humble inquiry",col:"blue",fill:"blue"},(cc,x,y)=>{D.icon(cc,"speech",x+70,y+50,36,{fill:"white"});D.text(cc,"?",x+70,y+64,{size:40,w:700,align:"center",col:"blue"});
      D.text(cc,"real interest",x+130,y+44,{size:34,w:700});D.text(cc,"in the other person",x+130,y+84,{size:30,col:"mut"});D.text(cc,"Edgar Schein",x+260,y+150,{size:28,col:"mut",align:"center"});});
    D.panel(c,630,140,550,290,{title:"active listening",col:"green",fill:"green"},(cc,x,y)=>{D.face(cc,"helena",x+60,y+50,32);D.face(cc,"graham",x+184,y+50,32);
      D.arrow(cc,[x+100,y+30],[x+144,y+30],{col:"green",w:3,head:10});D.arrow(cc,[x+144,y+72],[x+100,y+72],{col:"green",w:3,head:10});
      D.text(cc,"the whole meaning",x+240,y+60,{size:32,w:700});D.text(cc,"Carl Rogers, Richard Farson",x+275,y+150,{size:28,col:"mut",align:"center"});});}),
  {s:"ask what you don't know",x:90,y:400,size:42,w:700,col:"blue",at:w("schein","asking",-0.2),d:1.0},
  {s:"hear it all, say it back",x:1170,y:400,size:42,w:700,col:"green",align:"right",at:w("rogers","whole meaning",-0.2),d:1.0}];

/* ---------------------------------------------------------------- pages of a notebook (the page's own px): drawn as a designer would,
   a sketched page almost done when it first shows; the pen adds the last marks and words as the voice says them. One pen writes a page. */
// 1. what Graham said (Noor, in his office): the questions are on the page; his answers go in as he gives them
const QB_ASK=[["building","decides",["a new building, A$140m",{w:700}]],["cal","by when",["paper by 1 June",{w:700}]],["people","who else"],["eye","trusts"],["scale","changes his mind"]];
const qb_note1=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"Graham · 16 February",86,124,{size:72});D.face(c,"graham",860,96,40);
    QB_ASK.forEach(([ic,lab,ans],k)=>{const x=110+(k%2)*460,y=180+Math.floor(k/2)*176;D.box(c,x,y,436,152,{fill:k<2?"blue":"paper",col:"ink",w:2.5,r:14});
      D.icon(c,ic,x+40,y+42,22,{fill:"white"});D.caps(c,lab,x+76,y+52,{size:28,col:"mut"});if(ans)D.text(c,ans[0],x+28,y+118,Object.assign({size:36},ans[1]));});},[60,40,1040,800]),
  {s:"the Council; academics",x:138,y:474,size:38,w:700,col:"blue",at:w("who","University Council",-0.2),d:1.0},
  {s:"his walks",x:598,y:474,size:40,w:700,col:"orange",at:w("trust","walks",-0.3),d:0.6},
  {s:"short at every hour?",x:138,y:650,size:38,w:700,col:"amber",at:w("mind","every hour",-0.3),d:0.9}];
// 2. the one page, written down with Graham (Noor): his words at the top, the question in his hand, and what goes under it
const qb_note2=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.face(c,"graham",140,110,32);D.text(c,"“A dashboard of room use, by Easter”",190,124,{size:38,col:"mut"});
    D.arrow(c,[300,160],[300,214],{col:"mut"});D.box(c,100,226,880,196,{fill:"blue",col:"blue",w:3,r:16,dash:[12,9]});D.caps(c,"the question",128,262,{size:28,col:"blue"});
    ["decision","dates","who decides","his mind"].reduce((x,s)=>{const W=PK.sk.capsW(c,s,{size:28})+40;D.box(c,x,474,W,46,{fill:"white",col:"ink",w:2.5,r:23});D.caps(c,s,x+20,506,{size:28});return x+W+16;},110);},[60,40,1040,800]),
  {s:"Too few rooms, or too few",x:130,y:330,size:56,w:700,col:"blue",at:w("question","too few rooms",-0.2),d:1.0},
  {s:"at some hours?",x:130,y:400,size:56,w:700,col:"blue",at:w("question","some hours",-0.2),d:0.7},
  {k:"tick",x:960,y:470,r:22,col:"green",at:w("under","change his mind",-0.3),d:0.3},
  {s:"used = people in the room",x:110,y:620,size:52,w:700,col:"green",at:w("under","what “used” means",-0.2),d:0.9}];
// 3. what the data said (Ivy): the week, hour by hour, and where it's short
const qb_note3=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"Room use, spring 2027",86,124,{size:72});
    ["Mon","Tue","Wed","Thu","Fri"].forEach((d,i)=>D.text(c,d,180+i*62,214,{size:28,align:"center",col:"mut"}));[["8",246],["12",370],["6",524]].forEach(([s,y])=>D.text(c,s,124,y,{size:28,col:"mut"}));
    for(let j=0;j<10;j++)for(let i=0;i<5;i++){const peak=i>=1&&i<=3&&j>=2&&j<=5,k=(i*3+j*5)%7;D.box(c,152+i*62,228+j*30,54,24,{fill:peak?PK.FILL.orange:k<3?"white":"orange",col:"ink",w:1.6,r:3});}
    [["38%","booked, the whole week","orange"],["93%","10 to 2, Tue to Thu","orange"],["1 in 5","booked hours: nobody","amber"]].forEach(([n,s,col],i)=>{const y=284+i*104;
      D.text(c,n,520,y,{size:48,w:700,col});D.text(c,s,520,y+38,{size:28,col:"mut"});});},[60,40,1040,800]),
  {k:"ring",x:276,y:350,rx:118,ry:78,col:"green",at:w("so","some hours",-0.6),d:0.6},
  {s:"too few at some hours",x:110,y:650,size:58,w:700,col:"green",at:w("so","some hours",-0.3),d:0.9}];
// 4. on Monday (Helena): the questions to ask, a tick as the voice comes to each; the last two in her hand
const QB_MON=[["What will you decide, by when?","monday","decide"],["Who else decides? What do you trust?","who","who else"],["What would change your mind?","who","change their mind"]];
const qb_note4=(sc,w)=>[PK.sk.drawn(c=>{const D=PK.sk;D.title(c,"On Monday",86,122,{size:88});
    QB_MON.forEach(([s],i)=>{const y=186+i*96;D.box(c,110,y,800,70,{fill:"blue",col:"ink",w:2.5,r:35});D.line(c,[[150,y+68],[138,y+92],[178,y+70]],{col:"ink",w:2.5,seed:i+2});
      D.text(c,s,150,y+48,{size:38});});
    D.icon(c,"pen",130,610,24,{fill:"green"});},[60,40,1040,800]),
  ...QB_MON.map(([, id,word],i)=>({k:"tick",x:960,y:206+i*96,r:22,col:"green",at:w(id,word,0.4),d:0.3})),
  {s:"Listen, and say it back",x:110,y:540,size:50,w:700,col:"blue",at:w("listen","Listen",0),d:0.9},
  {s:"Write it beside their words",x:170,y:626,size:50,w:700,col:"green",at:w("write","write the question",0),d:1.0}];
// 5. the engineer's note, each day in 1999 to 2001
const qb_note5=(sc,w)=>[
  {s:"The tower · today",x:70,y:124,size:76,w:760,col:"blue",at:w("note","signed a note",-0.6),d:0.7,marks:[["under","blue",null,0.3]]},
  {s:"moved north, a little",x:110,y:262,size:58,col:"green",at:w("note","moved",-0.3),d:0.9},
  {s:"take out: hole 7, slowly",x:110,y:370,size:58,at:w("note","exactly what",-0.2),d:1.0},
  {s:"signed, the engineer",x:110,y:480,size:52,col:"mut",at:w("note","take out",0.4),d:0.8}];

/* ===== The question behind the request: the chapters, shot by shot =====
   The film moves between people and its key ideas (the author, 17 November 2026). In a scene, people are whole and do what the line
   says, and the words on the frame are where and when, a name, or what someone says; what a screen shows is in a callout from it. The
   ideas are written by hand: the committee's sheet in 1990, Carmen Vidal's board, and Noor's, Ivy's and Helena's notebooks (qb_uni.js).
   Pisa is in qbp_pisa.js. Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt). */
const qb_kick=(ctx,S,a)=>{if(a>0.004){setScreen(ctx,S);PK.kicker(ctx,1,"The question behind the request",a);}};
function qb_card(ctx,S,t,t0,t1,d,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;setScreen(ctx,S);PK.card(ctx,o.mid?960:o.right?1848:72,o.y==null?146:o.y,d,a,{align:o.mid?"center":o.right?"right":"left"});}
const qb_imagined=(ctx,S,t,t0,t1,text)=>{const a=ag_io(t,t0,t1,0.5);if(a>0.004){setScreen(ctx,S);PK.sceneTag(ctx,text,a);}};
const qb_bub=(x,J,tt,t0,t1,lines,cam,o)=>{if(J)PK.say(x,J,lines,ag_io(tt,t0,t1==null?1e9:t1,0.3),Object.assign({cam},o||{}));};
const qb_name=(x,J,tt,t0,t1,name,role,dy,dx)=>{if(J)PK.nameTag(x,J.hc[0]+(dx||0),J.hc[1]-(dy||150),name,role,ag_io(tt,t0,t1,0.4));};
const qb_apart=(t,spans)=>spans.reduce((m,[a,b])=>Math.max(m,ag_in(t,a-0.4,0.35)*(1-ag_in(t,b,0.35))),0);
// someone who stays a while takes in what goes on: a look, a nod, a smile, every few seconds (i: who they are, so no two move together)
const qb_alive=(tt,base,i,t0)=>{base=Object.assign({expr:"neutral",gaze:[1,0]},base||{});const g=base.gaze[1],ev=[],K=["look","nod","smile"];
  for(let k=0;k<30;k++){const at=(t0||0)+1.8+i*1.1+k*5.6,kind=K[(k+Math.round(i))%3];ev.push(kind==="look"?[at,"look",2.2,[1,g+((k+Math.round(i))%2?0.45:-0.35)]]:kind==="smile"?[at,"smile",2.4]:[at,"nod"]);}
  return PK.face(tt,base,ev);};
const qb_talk=(base,tt,spans)=>{const e=PK.exprMix(base,base,0);e.open=Math.max(e.open||0,...spans.map(([a,b])=>PK.talk(tt,a,b)*0.75));return e;};
const qb_sp=(tt,i,spans,base,g)=>qb_alive(tt,{expr:qb_talk(base||"listen",tt,spans),gaze:[1,g==null?-0.2:g]},i);
const qb_come=(cc,who,tt,x0,x1,t0,t1,fl,h,o)=>{o=o||{};const flip=o.flip!=null?o.flip:x1<x0;if(tt<t0)return null;if(tt<t1)return PK.walk(cc,who,tt,{x0,x1,t0,t1,floor:fl,h,then:o.then||"stand"},Object.assign({flip:x1<x0},o.face||{}));
  return PK.person(cc,who,x1,fl,h,o.then||"stand",Object.assign({t:tt,flip},o.face||{},o.hold?{hold:o.hold,holds:true}:{}));};
const QB_HEV=Array.from({length:40},(_,k)=>k%2?[1.6+k*4.8,"nod"]:[1.6+k*4.8,"look",2.2,[1,0.35]]);
const QB_LAST="Ask what it's for, and agree it in writing.";
// a screen's callout from the monitor at the desk by the window
const qb_screenCall=(x,R,a,head,rows,hc,o)=>{o=o||{};const D=R&&R.marta&&R.marta.desk;const tip=D?[150,D.top-120]:[150,620];
  PK.callout(x,o.bx==null?720:o.bx,o.by==null?110:o.by,o.bw||720,o.bh||250,tip,a,(cc,bx,by,bw,bh)=>qb_panel(cc,bx,by,bw,bh,head,rows,o.bars||null,hc));};
// the team's room with someone at the desk by the window (o.at, default Ivy); o.ivy: their face
const qb_atRoom=(x,tt,t0,o)=>{o=o||{};return qb_team(x,tt,{clock:o.clock==null?10:o.clock,deskWho:o.at||"ivy",marta:Object.assign({work:o.work==null?1:o.work,turn:0},o.ivy||qb_alive(tt,{expr:"think",gaze:[1,0.3]},3,t0)),
  sam:o.sam===null?null:Object.assign({work:1},qb_alive(tt,{},1,t0)),jun:o.jun===null?null:Object.assign({work:1},qb_alive(tt,{},2,t0)),show:PK.onScreen.chat(0,{}),people:o.people||[]});};
// Graham's office: Graham and Helena at the round table, Noor beside them with her notebook (o.nw: she writes, 0 to 1)
const qb_office=(x,tt,t0,o)=>{o=o||{};let Jn=null;const R=qb_corner(x,tt,{t0,who1:"graham",who2:"helena",he:o.ge,hf:o.gf||qb_alive(tt,{expr:"listen",gaze:[1,0.3]},1,t0),
  iface:o.hf||qb_alive(tt,{expr:"listen",gaze:[1,0.3]},2,t0),laptop:o.laptop});
  const nw=o.nw||0;Jn=PK.person(x,"noor",1790,950,PK.hAt(950,QB_CO.eye),PK.poseMix("clasp",QB_NOTE,nw),Object.assign({t:tt+3,flip:true,underF:PK.inHand.notebook({}),hold:nw>0.3?PK.inHand.pen("blue"):null,holds:true},o.nf||qb_alive(tt,{expr:"listen",gaze:[1,0.2]},4,t0),nw>0.004?{gaze:[1,0.6*nw]}:{}));
  R.noor=Jn;return R;};

/* ---------------------------------------------------------------- 1. Saving a leaning tower */
scene("tower",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tP=c.pavia-0.4,tC=c.closed-0.4,tM=c.committee-0.4,tZ=w("meant","agreed",-1.4),tT=c.trial-0.4,tS=c.soil-0.4,tN=c.note-0.4,tL=c.less-0.4,tR=c.reopen-0.4,tD=c.data-0.4,tF=c.found-0.4;
  const BO=PK.pace(ctx,QBP_FOLK.eng1,qb_boardO(sc,w)),N5=PK.pace(ctx,null,qb_note5(sc,w));
  const lean=tt=>PK.u.lerp(QBP_LEAN0,QBP_LEAN1,ag_in(tt,c.soil+2,(c.reopen-1)-(c.soil+2)));
  const tower=(x,tt)=>qbp_tower(x,QBP_TW[0],QBP_TW[1],QBP_K,lean(tt));
  const visitors=(x,tt,t0,n)=>{
    for(const [i,x0,x1,ts,d,fl] of [[2,-120,700,t0+0.4,9,700],[8,2060,1500,t0+2.0,8,690]].slice(0,n))qbp_walk(x,PK.extra(i),tt,{x0,x1,t0:ts,t1:ts+d,floor:fl,then:"stand"},{flip:x1<x0,t:tt});
    qbp_person(x,PK.extra(4),420,820,"clasp",Object.assign({t:tt},qb_alive(tt,{expr:"smile",gaze:[1,-0.6]},1,t0)));
    qbp_person(x,PK.extra(11),1620,880,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"neutral",gaze:[1,-0.5]},2,t0)));};
  ag_shots(ctx,S,t,sc.dur,[
    // Pisa: the bell tower, leaning, and visitors on the lawn
    {at:0,place:"qbpSquare",keys:[[0,960,540,1.0],[c.lean,1000,540,1.08]],d:3,draw:(x,tt,cam)=>{tower(x,tt);visitors(x,tt,0,2);
      const J=qbp_person(x,"eng1",1060,1000,"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},qb_sp(tt,1,[[w("lean","each year",-0.6),E.lean]],"worry",-0.4)));
      qb_bub(x,J,tt,w("lean","each year",-0.6),tP-0.3,["Further out, every year."],cam,{lean:-160});}},
    // Pavia, March 1989: where a tower stood
    {at:tP,place:"qbpPavia",dis:0.8,keys:[[tP,960,540,1.0],[tC,960,520,1.06]],d:3,draw:(x,tt,cam)=>{
      qbp_person(x,PK.extra(5),620,880,"clasp",Object.assign({t:tt},PK.face(tt,{expr:"worry",gaze:[1,-0.2]},[[tP+2.6,"look",2.4,[1,0.2]]])));
      qbp_person(x,PK.extra(6),1440,930,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"worry",gaze:[1,0.1]},2,tP)));
      qbp_person(x,PK.extra(7),820,1000,"clasp",Object.assign({t:tt},qb_alive(tt,{expr:"worry",gaze:[1,-0.3]},3,tP)));}},
    // January 1990: Pisa's tower is closed; any work is a risk
    {at:tC,place:"qbpSquare",dis:0.8,keys:[[tC,960,540,1.0],[c.risk,1060,540,1.08]],d:3,draw:(x,tt,cam)=>{tower(x,tt);let Jr=null,Je=null;
      PK.S.begin(x,{lw:2.2,sh:2});PK.S.line(x,c2=>{c2.moveTo(1060,650);c2.lineTo(1380,650);for(let k=0;k<=8;k++){c2.moveTo(1060+k*40,636);c2.lineTo(1060+k*40,662);}},qbp_c("fence"),0.8);
      qbp_person(x,"guard",1300,760,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"neutral",gaze:[1,0.1]},1,tC)));
      Jr=qbp_person(x,"res1",520,860,"clasp",Object.assign({t:tt},qb_sp(tt,2,[[c.harm+0.2,E.harm]],"worry",-0.3)));
      qbp_person(x,PK.extra(4),760,800,"clasp",Object.assign({t:tt},qb_alive(tt,{expr:"worry",gaze:[1,-0.5]},3,tC)));
      Je=qbp_person(x,"eng1",1500,1000,"clasp",Object.assign({t:tt,flip:true,underF:PK.inHand.notebook({}),holds:true},qb_sp(tt,4,[[c.risk+0.2,E.risk]],"worry",-0.3)));
      qb_bub(x,Jr,tt,c.harm+0.2,c.risk-0.2,["If it fell, on a busy day…"],cam,{lean:140});
      qb_bub(x,Je,tt,c.risk+0.2,tM-0.3,["Even digging near it","could bring it down."],cam,{lean:-180});}},
    // spring 1990: an international committee agrees what saving it would mean, and how
    {at:tM,place:"qbpOffice",cut:true,keys:[[tM,960,540,1.0],[tZ,960,540,1.0],[tZ+1.6,500,440,1.8],[c.trial-1.8,500,440,1.8]],d:3,draw:(x,tt,cam)=>{
      qbp_seat(x,"com2",1480,860,"sit",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"listen",gaze:[1,0.1]},1,tM)));
      PK.teach(x,QBP_FOLK.eng1,tt,BO,{x:QBP_BD.x,y:QBP_BD.y,k:QBP_BD.k,deco:true,floor:QBP_BD.floor,rest:QBP_BD.rest,h:qbp_hi(QBP_BD.floor),say:[[c.meant,E.method]],events:QB_HEV});
      qbp_seat(x,"eng2",1200,960,"sit",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"listen",gaze:[1,0.1]},2,tM)));
      qbp_seat(x,"com1",1680,1010,"sit",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"think",gaze:[1,0.1]},3,tM)));}},
    // they try it on a test footing, with lead on the tower's north side
    {at:tT,place:"qbpSite",cut:true,keys:[[tT,960,540,1.0],[tS,1000,540,1.04]],d:3,draw:(x,tt,cam)=>{
      qbp_tower(x,1100,QBP_SE+8,25,lean(tt));qbp_lead(x,940,QBP_SE+10,25,1);
      PK.S.begin(x,{lw:2.4,sh:2});PK.S.fill(x,c2=>c2.rect(300,QBP_SE+10,160,40),qbp_c("concrete"),{});
      qbp_person(x,"eng2",520,900,"clasp",Object.assign({t:tt,underF:PK.inHand.notebook({}),holds:true},qb_alive(tt,{expr:"think",gaze:[1,-0.2]},1,tT)),qbp_hs);
      qbp_person(x,"eng3",820,980,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"listen",gaze:[1,-0.1]},2,tT)),qbp_hs);}},
    // from February 1999, under the tower itself, a little at a time
    {at:tS,place:"qbpSite",later:true,keys:[[tS,1000,540,1.04]],d:2,draw:(x,tt,cam)=>{
      qbp_tower(x,1100,QBP_SE+8,25,lean(tt));qbp_lead(x,940,QBP_SE+10,25,1);qbp_drill(x,700,QBP_SE+12,25,1,ag_in(tt,tS+1,6));
      qbp_person(x,"eng1",420,960,"clasp",Object.assign({t:tt,underF:PK.inHand.notebook({}),holds:true},qb_alive(tt,{expr:"think",gaze:[1,-0.2]},1,tS)),qbp_hs);
      qbp_person(x,"eng3",1460,900,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"listen",gaze:[1,-0.1]},2,tS)),qbp_hs);}},
    // every day, the engineer in charge signs a note
    {at:tN,place:"qbNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,QBP_FOLK.eng1,tt,N5,{});}},
    // by the summer of 2001, it has come back about 45 centimetres; in December, it reopens
    {at:tL,place:"qbpSquare",dis:1.0,keys:[[tL,960,540,1.0],[c.years,1000,540,1.06]],d:3,draw:(x,tt,cam)=>{tower(x,tt);
      qbp_person(x,"eng1",1060,1000,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"smile",gaze:[1,-0.4]},1,tL)));
      if(tt>=tR)visitors(x,tt,tR,2);}},
    // at a university, a request for a dashboard hid a decision
    {at:tD,place:"qbTeam",dis:1.0,keys:[[tD,960,540,1.0],[c.found-0.2,760,560,1.08]],d:3,draw:(x,tt,cam)=>{
      const R=qb_atRoom(x,tt,tD,{at:"helena",ivy:qb_alive(tt,{expr:"think",gaze:[1,0.3]},3,tD)});
      qb_screenCall(x,R,ag_io(tt,w("data","dashboard",-0.3),tF-0.3,0.4),"Email · Graham Ellis",[["A dashboard of room use,",PK.C.ink,34],["by Easter?",PK.C.ink,34]],PK.C.blue);}},
    // half an hour of listening found it
    {at:tF,place:"qbCorner",cut:true,keys:[[tF,960,540,1.0]],d:2,draw:(x,tt,cam)=>{qb_office(x,tt,tF,{});}}
  ]);
  qb_card(ctx,S,t,c.when+0.3,c.lean-0.2,{kick:"Pisa, Italy",title:"The bell tower"},{y:40,mid:true});
  qb_card(ctx,S,t,tP+0.4,tC-0.2,{kick:"Pavia, March 1989",title:"A tower collapses"},{y:40,mid:true});
  qb_card(ctx,S,t,tC+0.4,c.harm-0.2,{kick:"January 1990",title:"Closed to visitors"},{y:40,mid:true});
  qb_card(ctx,S,t,tM+0.4,tZ+0.6,{kick:"Spring 1990",title:"An international committee"},{y:40,mid:true});
  qb_card(ctx,S,t,tT+0.4,tS-0.2,{kick:"First",title:"A test footing"},{y:40,mid:true});
  qb_card(ctx,S,t,tS+0.3,tN-0.2,{kick:"From February 1999",title:"Soil out, a little at a time"},{y:40,mid:true});
  qb_card(ctx,S,t,tL+0.4,tR-0.2,{kick:"Summer 2001",title:"About 45 cm back"},{y:40,mid:true});
  qb_card(ctx,S,t,tR+0.3,tD-0.2,{kick:"December 2001",title:"Open again"},{y:40,mid:true});
  PK.title(ctx,S,t,c.breath+0.2,"The question behind the request","Find the decision; agree the question","Leading data people · Working with people",{side:"right",size:52});
});

/* ---------------------------------------------------------------- 2. A dashboard by Easter */
scene("ask",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,CA=PK.ROOMS.campus;
  const tE=c.email-0.4,tB=c.clear-0.4,tZ=w("guess","guess",-1.2),tH=c.helena-0.4,BA=PK.pace(ctx,"carmen",qb_boardA(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // these films: the people who ask for data, and the team who answers
    {at:0,place:"qbTeam",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      qb_atRoom(x,tt,0,{at:"helena",ivy:qb_alive(tt,{expr:"think",gaze:[1,0.3]},3,0)});}},
    // Graham emails the data team from his office
    {at:tE,place:"qbCorner",cut:true,keys:[[tE,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=qb_corner(x,tt,{t0:tE,who1:"graham",laptop:true,hf:qb_alive(tt,{expr:"think",gaze:[1,0.6]},1,tE),handN:[830,616],handF:[856,606]});
      qb_name(x,R.who1,tt,w("email","Graham Ellis",0),c.asks-0.2,"Graham Ellis","Director of Facilities",170);
      PK.callout(x,1060,90,720,250,R.laptop,ag_io(tt,c.asks-0.2,tB-0.3,0.4),(cc,bx,by,bw,bh)=>qb_panel(cc,bx,by,bw,bh,"To the data team",[["Could I have a dashboard",PK.C.ink,34],["of room use, by Easter?",PK.C.ink,34]],null,PK.C.blue));}},
    // a request names a guess at a solution (Carmen, at the team's board)
    {at:tB,place:"qbTeam",dis:0.6,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{const R=qb_lesson(x,tt,{rows:BA,clock:11,events:QB_HEV});
      qb_name(x,R.at,tt,tB+0.4,tZ-0.3,"Carmen Vidal","Consultant",160);}},
    {at:tZ,cut:true,place:"qbBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BA,{say:[[c.clear,E.nobody]],events:QB_HEV});}},
    // so Helena asks Graham for half an hour, with Noor
    {at:tH,place:"qbCampus",dis:0.6,keys:[[tH,900,570,1.1]],d:2,draw:(x,tt,cam)=>{
      const CH={title:"Helena Novak",who:["helena"],me:"graham",msgs:[{who:"helena",s:"Half an hour, with Noor? To hear what it's for.",at:w("helena","asks Graham",-0.2),type:1.4},{who:"graham",s:"Tuesday at 10.",at:E.helena+0.3,type:0.8}]},cs=PK.chatSize(x,CH,{size:28});
      const Jg=PK.person(x,"graham",1060,CA.near,qb_hC(CA.near),"phone",Object.assign({t:tt,flip:true,hold:PK.inHand.phone({back:true}),holds:true},PK.face(tt,{expr:"think",gaze:[1,0.9]},[[E.helena+0.5,"smile",2.0]])));
      PK.callout(x,200,160,cs.w,cs.h,[Jg.hdN[0]-20,Jg.hdN[1]-30],ag_in(tt,tH+0.3,0.4),(cc,bx,by,bw,bh)=>PK.chat(cc,bx,by,bw,bh,CH,tt,{size:28}));}}
  ]);
  qb_imagined(ctx,S,t,0.4,tE,"The university, 2027 · imagined");
  qb_card(ctx,S,t,tE+0.3,w("email","Graham Ellis",-0.3),{kick:"Thursday 11 February 2027",title:"An email"},{y:40,mid:true});
  qb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-qb_apart(t,[[0,c.asks],[tH,1e9]])));
});

/* ---------------------------------------------------------------- 3. Half an hour, mostly listening */
scene("listen",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tN=c.who-0.4,tM=c.mind-0.4,tB=c.schein-0.4,tZ=c.schein+2.0,N1=PK.pace(ctx,null,qb_note1(sc,w)),BB=PK.pace(ctx,"carmen",qb_boardB(sc,w));
  const qa=[["decide","Whether",["What will you decide with it?"],["Whether to ask","for a new building."]],["when","His paper",["By when?"],["My paper's due 1 June."]],
    ["mind","If rooms",["What would change your mind?"],["Short at every hour:","then I'd build."]]];
  const office=(x,tt,t0,cam,list)=>{const sp=[],gsp=[];for(const [id,ans] of list){sp.push([c[id]+0.1,w(id,ans,-0.4)]);gsp.push([w(id,ans,-0.2),E[id]]);}
    const R=qb_office(x,tt,t0,{nw:Math.max(...list.map(([id,ans])=>ag_in(tt,w(id,ans,0.2),0.4)*(1-ag_in(tt,E[id]+0.6,0.4)))),
      gf:qb_sp(tt,1,gsp,"think",0.3),hf:qb_sp(tt,2,sp,"listen",0.3)});
    for(const [id,ans,q,a] of qa.filter(r=>list.some(l=>l[0]===r[0]))){qb_bub(x,R.who2,tt,c[id]+0.1,w(id,ans,-0.3),q,cam,{lean:-120});qb_bub(x,R.who1,tt,w(id,ans,-0.2),E[id]+0.6,a,cam,{lean:160});}
    return R;};
  ag_shots(ctx,S,t,sc.dur,[
    // Tuesday 16 February, in Graham's office: a few open questions, then mostly listening
    {at:0,place:"qbCorner",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{office(x,tt,0,cam,[["decide","Whether"],["when","His paper"]]);}},
    // Noor writes down what he says
    {at:tN,place:"qbNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"noor",tt,N1,{});}},
    {at:tM,place:"qbCorner",dis:0.6,keys:[[tM,960,540,1.0]],d:2,draw:(x,tt,cam)=>{office(x,tt,tM,cam,[["mind","If rooms"]]);}},
    // humble inquiry and active listening (Carmen, at the team's board)
    {at:tB,place:"qbTeam",cut:true,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{qb_lesson(x,tt,{rows:BB,clock:14,events:QB_HEV});}},
    {at:tZ,cut:true,place:"qbBoard",keys:[[tZ,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.teach(x,"carmen",tt,BB,{say:[[c.schein,E.whys]],events:QB_HEV});}}
  ]);
  qb_card(ctx,S,t,0.3,c.decide-0.2,{kick:"Tuesday 16 February",title:"Graham's office"},{y:40,mid:true});
  qb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-qb_apart(t,[[0,c.decide],[tB,1e9]])));
});

/* ---------------------------------------------------------------- 4. Say it back, write it down */
scene("agree",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tP=c.pisa-0.4,tW=c.write-0.4,tN=c.question-0.4,tR=c.reply-0.4,N2=PK.pace(ctx,null,qb_note2(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // Helena says back what she heard; Graham stops her at one word; Noor names the data it decides
    {at:0,place:"qbCorner",later:true,keys:[[0,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=qb_office(x,tt,0,{gf:qb_sp(tt,1,[[c.used+0.1,E.used]],"think",0.3),hf:qb_sp(tt,2,[[c.back+0.2,c.used-0.2],[c.data+0.2,E.data]],"listen",0.3)});
      qb_bub(x,R.who2,tt,c.back+0.2,c.used-0.1,["So: a decision about a building,","and how the rooms are used?"],cam,{lean:-160});
      qb_bub(x,R.who1,tt,c.used+0.1,c.data-0.1,["Used: people in the room.","A booking isn't use."],cam,{lean:160});
      qb_bub(x,R.who2,tt,c.data+0.2,tP-0.3,["Then: bookings, beside","the sensors' head counts."],cam,{lean:-160});}},
    // in Pisa, saving meant half a degree
    {at:tP,place:"qbpSquare",dis:0.8,keys:[[tP,1000,540,1.08]],d:2,draw:(x,tt,cam)=>{qbp_tower(x,QBP_TW[0],QBP_TW[1],QBP_K,QBP_LEAN1);
      qbp_person(x,PK.extra(4),420,820,"clasp",Object.assign({t:tt},qb_alive(tt,{expr:"smile",gaze:[1,-0.6]},1,tP)));
      qbp_person(x,PK.extra(11),1620,880,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"neutral",gaze:[1,-0.5]},2,tP)));}},
    // Noor writes the question down with him, on one page
    {at:tW,place:"qbCorner",dis:0.8,keys:[[tW,960,540,1.0]],d:2,draw:(x,tt,cam)=>{qb_office(x,tt,tW,{nw:ag_in(tt,tW+0.6,0.4)});}},
    {at:tN,place:"qbNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"noor",tt,N2,{});}},
    // that afternoon, Graham replies
    {at:tR,place:"qbTeam",dis:0.6,keys:[[tR,700,560,1.12]],d:2,draw:(x,tt,cam)=>{
      const R=qb_atRoom(x,tt,tR,{at:"noor",ivy:PK.face(tt,{expr:PK.exprMix("think","smile",ag_in(tt,w("reply","Yes",0),0.6)),gaze:[1,0.3]},[])});
      qb_screenCall(x,R,ag_in(tt,w("reply","replies",-0.2),0.4),"Graham Ellis · re: the question",[["“Yes, that's it.”",PK.C.green,40]],PK.C.green);}}
  ]);
  qb_card(ctx,S,t,tR+0.3,w("reply","replies",-0.4),{kick:"That afternoon",title:"A reply"},{y:40,mid:true});
  qb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-qb_apart(t,[[tP,tW],[tR,1e9]])));
});

/* ---------------------------------------------------------------- 5. What the question gave */
scene("answer",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u,CA=PK.ROOMS.campus;
  const tI=c.ivy-0.4,tN=c.so-0.4,tB=c.both-0.4,tG=c.dash-0.4,N3=PK.pace(ctx,null,qb_note3(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // the request waits its turn; Ivy follows the question, starting from the page
    {at:0,place:"qbTeam",later:true,keys:[[0,960,540,1.0],[tI,700,560,1.12]],d:3,draw:(x,tt,cam)=>{
      const R=qb_atRoom(x,tt,0,{sam:null,ivy:qb_alive(tt,{expr:"think",gaze:[1,0.3]},3,0)});
      qb_name(x,R.marta,tt,w("ivy","Ivy Reyes",0),c.start-0.2,"Ivy Reyes","Data analyst",170);
      qb_screenCall(x,R,ag_io(tt,w("ivy","page",-0.3),c.start-0.1,0.4),"The page · agreed 16 Feb",[["Too few rooms,",PK.C.blue,36],["or too few at some hours?",PK.C.blue,36]],PK.C.blue);
      qb_screenCall(x,R,ag_io(tt,c.week,tN-0.3,0.4),"Rooms booked",[],PK.C.orange,{bh:380,bars:[["the whole week · 38%",38,100,PK.C.orange],["10 to 2, Tue to Thu · 93%",93,100,PK.C.orange],["booked, nobody there · 1 in 5",20,100,PK.C.amber]]});}},
    // so: not too few rooms, but too few at some hours (Ivy's notebook)
    {at:tN,place:"qbNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"ivy",tt,N3,{});}},
    // the academics were right about the peak, and Graham about Monday mornings
    {at:tB,place:"qbCampus",dis:0.6,keys:[[tB,960,540,1.0]],d:2,draw:(x,tt,cam)=>{let Ja=null,Jg=null;
      Ja=PK.person(x,PK.extra(6),760,960,qb_hC(960),"clasp",Object.assign({t:tt},qb_sp(tt,1,[[tB+0.6,tB+2.4]],"smile",0.1)));
      Jg=PK.person(x,"graham",1120,CA.near,qb_hC(CA.near),"clasp",Object.assign({t:tt,flip:true},qb_sp(tt,2,[[tB+2.8,tG-0.4]],"smile",0.1)));
      qb_bub(x,Ja,tt,tB+0.6,tB+2.6,["Tuesdays at eleven: all full."],cam,{lean:-160});
      qb_bub(x,Jg,tt,tB+2.8,tG-0.3,["And Monday mornings: empty."],cam,{lean:160});}},
    // a dashboard by Easter might have settled nothing; instead, an answer in time
    {at:tG,place:"qbCorner",cut:true,keys:[[tG,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      const R=qb_corner(x,tt,{t0:tG,who1:"graham",who2:"helena",laptop:true,hf:qb_sp(tt,1,[[c.instead+0.4,E.instead]],"smile",0.4),iface:qb_alive(tt,{expr:"smile",gaze:[1,0.3]},2,tG),handN:[830,616],handF:[856,606]});
      qb_bub(x,R.who1,tt,c.instead+0.4,1e9,["Now I know what to ask the Council."],cam,{lean:160});}}
  ]);
  qb_card(ctx,S,t,0.3,tI,{kick:"Tuesday 30 March",title:"The team takes it up"},{y:40,mid:true});
  qb_card(ctx,S,t,c.start+0.2,c.week-0.3,{kick:"By 23 April",title:"An answer"},{y:40,mid:true});
  qb_kick(ctx,S,ag_in(t,0.6,0.6)*(1-qb_apart(t,[[0,tI],[tI,tN]])));
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,E=sc.ends,w=(id,word,off)=>wAt(sc,id,word,off),U=PK.u;
  const tD=c.daily-0.4,tS=c.same-0.4,tF=c.form-0.4,tN=c.monday-0.1,tL=c.take-0.4,tE=c.breath+0.6,N4=PK.pace(ctx,null,qb_note4(sc,w));
  ag_shots(ctx,S,t,sc.dur,[
    // in Pisa, they first agreed what saving the tower would mean
    {at:0,place:"qbpSquare",keys:[[0,960,540,1.0],[tD-0.2,1000,540,1.06]],d:3,draw:(x,tt,cam)=>{qbp_tower(x,QBP_TW[0],QBP_TW[1],QBP_K,QBP_LEAN1);
      qbp_person(x,PK.extra(4),420,820,"clasp",Object.assign({t:tt},qb_alive(tt,{expr:"smile",gaze:[1,-0.6]},1,0)));
      qbp_person(x,"eng1",1060,1000,"clasp",Object.assign({t:tt,flip:true},qb_alive(tt,{expr:"smile",gaze:[1,-0.4]},2,0)));}},
    // every day, a signed note
    {at:tD,place:"qbpSite",cut:true,keys:[[tD,1000,540,1.04]],d:2,draw:(x,tt,cam)=>{
      qbp_tower(x,1100,QBP_SE+8,25,QBP_LEAN1);qbp_lead(x,940,QBP_SE+10,25,1);
      qbp_person(x,"eng1",620,960,PK.poseMix("clasp",QB_NOTE,ag_in(tt,tD+0.6,0.4)),Object.assign({t:tt,underF:PK.inHand.notebook({}),hold:PK.inHand.pen("blue"),holds:true},qb_alive(tt,{expr:"think",gaze:[1,0.6]},1,tD)),qbp_hs);}},
    // Graham's request got the same care
    {at:tS,place:"qbCorner",dis:0.8,keys:[[tS,960,540,1.0]],d:2,draw:(x,tt,cam)=>{qb_office(x,tt,tS,{gf:qb_alive(tt,{expr:"smile",gaze:[1,0.3]},1,tS),hf:qb_alive(tt,{expr:"smile",gaze:[1,0.3]},2,tS)});}},
    // from June, the team's front door, a form
    {at:tF,place:"qbTeam",cut:true,keys:[[tF,700,560,1.12]],d:2,draw:(x,tt,cam)=>{
      const R=qb_atRoom(x,tt,tF,{at:"helena",sam:null,ivy:qb_alive(tt,{expr:"think",gaze:[1,0.3]},3,tF)});
      qb_screenCall(x,R,ag_in(tt,tF+0.4,0.4),"Ask the data team",[["What will you decide with it?",PK.C.ink,32],["By when? Who decides?",PK.C.ink,32],["… five questions",PK.C.mut,30]],PK.C.blue,{bh:300});}},
    {at:tN,place:"qbNotes",dis:0.6,keys:[[tN,960,540,1.0]],d:2,draw:(x,tt,cam)=>{PK.notes(x,"helena",tt,N4,{});}},
    // ask what it's for, and agree it in writing
    {at:tL,place:"qbTeam",dis:0.6,keys:[[tL,960,540,1.0]],d:2,draw:(x,tt,cam)=>{
      qb_atRoom(x,tt,tL,{at:"noor",ivy:qb_alive(tt,{expr:"smile",gaze:[1,0.3]},3,tL),people:[{fl:990,draw:cc=>{PK.person(cc,"helena",960,990,qb_hT(990),"clasp",Object.assign({t:tt},qb_alive(tt,{expr:"smile",gaze:[1,0.2]},5,tL)));}}]});}}
  ]);
  qb_kick(ctx,S,(1-ag_in(t,tE-0.2,0.6))*(1-qb_apart(t,[[0,tS],[tF,tL]])));
  PK.end(ctx,S,t,tE,"The question behind the request",QB_LAST,"Film 1 of 3","Working with people",{side:"right"});
});
ag_cutInto(["ask","listen","agree","answer"]);

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
