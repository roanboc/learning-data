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

// The same problem, everywhere, the prologue to the data governance series. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"question":{"name":"One question","lead":1.6,"tail":1.0,"vo":[
 {"id":"autumn","gap":0.8,"text":"Autumn 2008.","say":"Autumn, two thousand and eight."},
 {"id":"ask","gap":0.8,"text":"As the financial crisis spreads, a bank's board asks its risk team one question: if another bank fails, how much do we stand to lose?"},
 {"id":"answer","gap":0.8,"text":"The answer is somewhere in the bank, in every business line, each with its own systems and its own names for the same customers."},
 {"id":"monday","gap":0.8,"text":"By Monday, nobody can add it up."},
 {"id":"one","gap":0.8,"text":"It wasn't just one bank."},
 {"id":"found","gap":0.8,"text":"The regulators later found that many banks couldn't add up their risks quickly or accurately."},
 {"id":"there","gap":0.8,"text":"The numbers were all there."},
 {"id":"trust","gap":0.8,"text":"Nobody could put them together, or say which to trust."}]},
"notnew":{"name":"Not a new problem","lead":1.2,"tail":1.0,"vo":[
 {"id":"either","gap":0.8,"text":"It wasn't a new problem, either."},
 {"id":"sharing","gap":0.8,"text":"In the 1970s, companies began sharing data between departments.","say":"In the nineteen seventies, companies began sharing data between departments."},
 {"id":"questions","gap":0.8,"text":"That raised new questions: who owns this data, and who may see it?"},
 {"id":"job","gap":0.8,"text":"A new job grew up to look after it: data administration, with a dictionary of what each piece of data meant."},
 {"id":"la","gap":0.8,"text":"In 1980, in Los Angeles, the people doing that job started meeting, to share what they'd learned.","say":"In nineteen eighty, in Los Angeles, the people doing that job started meeting, to share what they'd learned."},
 {"id":"chapters","gap":0.8,"text":"Their association, DAMA, soon had chapters in city after city."},
 {"id":"alone","gap":0.8,"text":"Every organisation had been learning the same lessons alone."},
 {"id":"together","gap":0.8,"text":"Now they could learn them together."}]},
"signs":{"name":"Someone signs","lead":1.2,"tail":1.0,"vo":[
 {"id":"law","gap":0.3,"text":"In 2002, after accounting scandals, a law in the United States made chief executives sign for their company's figures,","say":"In two thousand and two, after accounting scandals, a law in the United States made chief executives sign for their company's figures,"},
 {"id":"controls","gap":0.8,"text":"and answer for the controls behind them."},
 {"id":"top","gap":0.8,"text":"Someone at the top now answered for the numbers, and for how they were made."}]},
"written":{"name":"Written down","lead":1.2,"tail":1.0,"vo":[
 {"id":"dmbok","gap":0.8,"text":"In 2009, DAMA published what its members had learned, as a body of knowledge for data management: the DMBOK.","say":"In two thousand and nine, DAMA published what its members had learned, as a body of knowledge for data management: the DMBOK."},
 {"id":"wheel","gap":0.8,"text":"It draws the work as a wheel: architecture, modelling, security, quality, metadata, and more."},
 {"id":"hub","gap":0.8,"text":"At the centre, like a hub, is governance."},
 {"id":"decide","gap":0.8,"text":"The other areas only fit together, and stay in balance, when someone has the authority to decide."},
 {"id":"guides","gap":0.8,"text":"Other guides cover the same ground, or part of it."},
 {"id":"takes","gap":0.8,"text":"This series takes what they agree on, and shows it at work."}]},
"first":{"name":"Governance first","lead":1.2,"tail":1.0,"vo":[
 {"id":"principles","gap":0.8,"text":"After the crisis, the banks' regulators wrote principles for their data, and the first was governance: a condition for all the rest."},
 {"id":"own","gap":0.8,"text":"Someone had to own the bank's risk data, and answer for its quality."},
 {"id":"ten","gap":0.8,"text":"Ten years later, only two of thirty-one of the world's biggest banks met them all."},
 {"id":"programmes","gap":0.8,"text":"Their programmes were often underfunded, narrow, and short of attention from their boards."},
 {"id":"systems","gap":0.8,"text":"Making data add up takes more than systems."},
 {"id":"takes","gap":0.8,"text":"It takes decisions, money, and attention from the top."}]},
"should":{"name":"Should we?","lead":1.2,"tail":1.0,"vo":[
 {"id":"grew","gap":0.8,"text":"As data grew, so did the questions about how it's used."},
 {"id":"ethics","gap":0.8,"text":"In 2017, the DMBOK's second edition gave more room to ethics: not only whether we can use data, but whether we should.","say":"In twenty seventeen, the DMBOK's second edition gave more room to ethics: not only whether we can use data, but whether we should."},
 {"id":"law","gap":0.8,"text":"In 2018, a European law made organisations answer for the personal data they hold, and be able to prove it.","say":"In twenty eighteen, a European law made organisations answer for the personal data they hold, and be able to prove it."},
 {"id":"people","gap":0.8,"text":"Governing data now meant answering to the people it's about, too."}]},
"machines":{"name":"Machines that learn","lead":1.2,"tail":1.0,"vo":[
 {"id":"learn","gap":0.8,"text":"Now machines learn from data, whatever it teaches them."},
 {"id":"ask","gap":0.8,"text":"So the people training them have to ask: where did this data come from, and who decided we could use it?"},
 {"id":"revision","gap":0.8,"text":"In 2024, a revision of the DMBOK added governance and ethics for AI.","say":"In twenty twenty-four, a revision of the DMBOK added governance and ethics for AI."},
 {"id":"act","gap":0.8,"text":"The same year, Europe's law on AI asked for governance of the data that high-risk systems learn from."},
 {"id":"third","gap":0.8,"text":"And a third edition is being written, with new sections on AI governance, data ethics and sustainability."},
 {"id":"living","gap":0.8,"text":"Its makers call it a living body of knowledge."},
 {"id":"planned","gap":0.8,"text":"It's planned for 2027.","say":"It's planned for twenty twenty-seven."}]},
"centre":{"name":"Still at the centre","lead":1.2,"tail":1.0,"vo":[
 {"id":"why","gap":0.8,"text":"So why does the DMBOK still matter today?"},
 {"id":"because","gap":0.8,"text":"Because the question it answers never changed."},
 {"id":"every","gap":0.8,"text":"In 1980, in 2008, and in every system that learns: who decides about this data, and who answers for it?","say":"In nineteen eighty, in two thousand and eight, and in every system that learns: who decides about this data, and who answers for it?"},
 {"id":"grows","gap":0.8,"text":"The book keeps growing, but governance stays at the centre."},
 {"id":"today","gap":0.8,"text":"Today, at a university, a new data governance lead is about to meet the same question."}]}
};

const VODUR={"question/autumn": 1.59, "question/ask": 8.601, "question/answer": 7.338, "question/monday": 1.933, "question/one": 1.297, "question/found": 4.923, "question/there": 1.273, "question/trust": 2.89, "notnew/either": 1.484, "notnew/sharing": 4.343, "notnew/questions": 3.871, "notnew/job": 6.533, "notnew/la": 6.209, "notnew/chapters": 3.823, "notnew/alone": 3.34, "notnew/together": 1.5, "signs/law": 8.291, "signs/controls": 2.039, "signs/top": 3.859, "written/dmbok": 8.124, "written/wheel": 5.744, "written/hub": 2.224, "written/decide": 5.786, "written/guides": 2.709, "written/takes": 2.995, "first/principles": 7.94, "first/own": 3.717, "first/ten": 4.492, "first/programmes": 5.011, "first/systems": 2.542, "first/takes": 3.127, "should/grew": 3.145, "should/ethics": 7.99, "should/law": 7.282, "should/people": 3.741, "machines/learn": 3.18, "machines/ask": 5.771, "machines/revision": 5.191, "machines/act": 6.018, "machines/third": 6.396, "machines/living": 2.476, "machines/planned": 1.84, "centre/why": 2.325, "centre/because": 2.527, "centre/every": 7.549, "centre/grows": 2.976, "centre/today": 5.489};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the last light on the bank's floor, then the title; and Yusuf's office, waiting, then the end card. */
const BREATH={
"question":{"hold":{"ask":0.6,"answer":0.5,"monday":0.9,"one":0.7,"found":0.4,"there":0.3},"breathe":4.6},
"notnew":{"hold":{"questions":0.6,"job":0.5,"la":0.6,"chapters":1.0,"alone":0.3,"together":0.8}},
"signs":{"hold":{"controls":0.6,"top":1.0}},
"written":{"hold":{"dmbok":0.6,"wheel":1.0,"hub":0.8,"decide":1.2,"guides":1.6,"takes":0.8}},
"first":{"hold":{"principles":0.8,"own":0.5,"ten":0.9,"programmes":0.8,"systems":0.3,"takes":1.2}},
"should":{"hold":{"grew":0.3,"ethics":1.0,"law":0.9,"people":1.0}},
"machines":{"hold":{"learn":0.4,"ask":0.6,"revision":0.6,"act":0.6,"third":0.8,"living":0.6,"planned":0.8}},
"centre":{"hold":{"why":0.4,"because":0.4,"every":0.8,"grows":0.8,"today":0.6},"breathe":5.4}
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

/* ===== The same one, everywhere: the watercolour look =====
   Washes of pigment on warm paper, a pencil line, and colours that mean something: each role has its own, the same in every film,
   and the person, as the master record, is left as white paper and banded in her roles' colours. Backgrounds are daylight
   landscapes, soft, so the role colours are the strongest washes on screen. Text is dark ink on paper-light cards.
   Everything costly is painted once and kept: the paper, the pigment's grain, each place's background and each card's paper. Only
   the text and what moves are drawn every frame, so the site's player can draw the film live. Every name here starts with wc_ or WC,
   because every file of the film shares one script. */

/* ---------- colours ---------- */
const WC_PAPER=[251,247,238],WC_PENCIL=[58,54,66],WC_INK=[46,42,56],WC_MUTED=[100,96,112],WC_DARK=[30,26,40],WC_CARD=[253,251,245];
// the roles, the same in every film: student teal, applicant amber, researcher coral, tutor violet, alumna green, donor magenta
const WC_ROLE={student:[14,150,146],applicant:[226,150,10],researcher:[238,96,78],tutor:[126,86,220],alumna:[38,160,96],donor:[200,70,150]};
// text in a role's colour on paper, darkened to keep 4.5:1
const WC_ROLEINK={student:[0,112,108],applicant:[150,92,0],researcher:[184,56,40],tutor:[100,62,190],alumna:[22,120,68]};
// the industries: the university teal (the student's), health red, banking blue, energy yellow, retail orange, the public sector green-blue
const WC_IND={uni:[14,150,146],health:[214,66,74],bank:[52,112,204],energy:[232,184,24],retail:[240,130,40],public:[36,148,168]};
// the soft wash a person is edged in: cyan for the technical side, gold for the business side, a neutral grey-blue for the person herself
const WC_SIDE={tech:[100,176,240],biz:[244,188,70],none:[150,170,200]};
const WC_BADGE=[255,214,90];
// a cross, in red ink
const WC_NO=[184,56,40];
// the landscape, in daylight
const WCP={skyTop:[116,174,226],sun:[255,224,150],farForest:[124,162,154],far:[176,204,176],mid:[156,198,124],mid2:[146,192,118],near:[134,182,104],field:[222,216,142],
  water:[132,182,222],pine:[78,128,104],birchLeaf:[176,210,112],leaf:[114,172,104],leaf2:[146,190,114],trunk:[156,120,92],bark:WC_PAPER,barkMark:[72,68,74],
  wall:[248,242,230],roofDark:[104,108,126],spire:[90,94,114],pane:[112,134,176],door:[176,124,92],falu:[202,86,68],trim:WC_PAPER,roof:[120,108,116],
  farmDoor:[104,144,166],stoneGrey:[184,180,174],brick:[208,126,98],copper:[114,174,154],road:[238,218,176],coat:[112,126,174],skinTiny:[242,206,172],
  hat:[94,86,94],parchment:[250,240,216],parchInk:[64,52,46],leather:[176,112,82],flowerA:[255,255,255],flowerB:[255,214,80],flowerC:[156,146,232],
  city:[194,210,228],stone:[238,210,162],slate:[134,144,164],clock:[255,255,255],glass:[164,208,234],concrete:[228,226,222],plaster:[244,228,198],
  brickHouse:[214,126,102],blueHouse:[164,190,220],chimney:[194,118,98],tile:[134,118,124],blueDoor:[84,134,174],paving:[236,230,218],iron:[92,96,112],
  lampGlow:[255,232,172],mailbox:[218,92,78],lawn:[152,198,122],hedge:[98,152,102],wood:[172,138,102],wallIn:[242,232,214],floor:[214,196,170]};

/* ---------- randomness and textures ---------- */
function wc_rng(seed){let s=(seed>>>0)||1;return()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function wc_noise(seed){const R=wc_rng(seed),N=new Float32Array(1024);for(let i=0;i<1024;i++)N[i]=R();const g=(ix,iy)=>N[((ix*73856093)^(iy*19349663))&1023];
  return(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),tx=x-ix,ty=y-iy,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);return lerp(lerp(g(ix,iy),g(ix+1,iy),sx),lerp(g(ix,iy+1),g(ix+1,iy+1),sx),sy);};}
// the paper's tooth and fibres, near white, to multiply over a whole frame; k is how strongly it shows, and the corners darken a touch
function wc_paperTex(w,h,seed,k){const c=mkCanvas(w,h),x=c.getContext("2d"),im=x.createImageData(w,h),d=im.data,n=wc_noise(seed),R=wc_rng(seed+5);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const q=(j*w+i)*4,v=n(i/2.3,j/2.3)*0.45+n(i/9,j/9)*0.35+n(i/60,j/60)*0.2,t=255-(Math.pow(v,2.4)*46+R()*6)*k,
    e=Math.pow(Math.hypot((i-w/2)/(w*0.62),(j-h*0.48)/(h*0.62)),2.2),vg=1-0.05*clamp(e-0.35,0,1);d[q]=t*vg;d[q+1]=(t-1*k)*(vg-0.003);d[q+2]=(t-3*k)*(vg-0.006);d[q+3]=255;}
  x.putImageData(im,0,0);x.lineCap="round";
  for(let i=0;i<w*h/2400;i++){const x0=R()*w,y0=R()*h,a=R()*TAU,l=5+R()*24;x.strokeStyle="rgba(130,118,100,"+((0.04+R()*0.07)*k)+")";x.lineWidth=0.5+R()*0.7;x.beginPath();x.moveTo(x0,y0);
    x.quadraticCurveTo(x0+Math.cos(a+0.5)*l*0.5,y0+Math.sin(a+0.5)*l*0.5,x0+Math.cos(a)*l,y0+Math.sin(a)*l);x.stroke();}
  return c;}
// pigment that settles in the paper's tooth: white with clustered specks, to multiply into washes
function wc_granTex(w,h,seed){const c=mkCanvas(w,h),x=c.getContext("2d"),im=x.createImageData(w,h),d=im.data,n=wc_noise(seed),R=wc_rng(seed+3);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const q=(j*w+i)*4,v=n(i/4,j/4)*0.55+n(i/19,j/19)*0.45,sp=R()<0.05*v?R()*60:0,t=255-v*36-sp;d[q]=t;d[q+1]=t;d[q+2]=t;d[q+3]=255;}
  x.putImageData(im,0,0);return c;}
// soft blotches, as an alpha mask, for washes that dry unevenly
function wc_blotchTex(w,h,seed,scale,bias){const c=mkCanvas(w,h),x=c.getContext("2d"),im=x.createImageData(w,h),d=im.data,n=wc_noise(seed);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const q=(j*w+i)*4,v=n(i/scale,j/scale)*0.6+n(i/(scale/2.7),j/(scale/2.7))*0.3+n(i/(scale/8),j/(scale/8))*0.1;
    d[q]=255;d[q+1]=255;d[q+2]=255;d[q+3]=clamp((v-0.22+bias)*1.7,0,1)*255;}
  x.putImageData(im,0,0);return c;}
// what is kept: the textures, each place's background, each card's paper, each white figure, and spare canvases
const WC={ready:false,bg:{},paint:{},card:{},tint:{},fig:{},buf:{}};
function wc_prep(){if(WC.ready)return;WC.gran=wc_granTex(W,H,17);WC.paper=wc_paperTex(W,H,23,0.42);WC.blotch=wc_blotchTex(480,270,31,60,0.05);WC.ready=true;}
function wc_buf(k,w,h){let c=WC.buf[k];if(!c)c=WC.buf[k]=mkCanvas(w,h);if(c.width!==w||c.height!==h){c.width=w;c.height=h;}const x=c.getContext("2d");x.setTransform(1,0,0,1,0,0);
  x.globalAlpha=1;x.globalCompositeOperation="source-over";x.filter="none";x.clearRect(0,0,w,h);return[c,x];}
// a texture's alpha, filled with one colour
function wc_tint(tex,col){const k=col.map(v=>v|0).join(",")+"|"+tex.width;if(WC.tint[k])return WC.tint[k];const c=mkCanvas(tex.width,tex.height),x=c.getContext("2d");
  x.fillStyle=rgba(col,1);x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation="destination-in";x.drawImage(tex,0,0);return WC.tint[k]=c;}

/* ---------- shapes: lists of points, so each can be painted as a wash ---------- */
const wc_multi=p=>Array.isArray(p[0][0]);
function wc_tr(ctx,pts){ctx.beginPath();for(const p of wc_multi(pts)?pts:[pts]){ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);ctx.closePath();}}
function wc_trOpen(ctx,p){ctx.beginPath();ctx.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)ctx.lineTo(p[i][0],p[i][1]);}
function wc_bbox(pts){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of wc_multi(pts)?pts:[pts])for(const q of p){x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}
  return{x0,y0,x1,y1,w:x1-x0,h:y1-y0};}
function wc_rect(x,y,w,h){return[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];}
function wc_ell(cx,cy,rx,ry,n){n=n||32;const o=[];for(let i=0;i<n;i++){const a=i/n*TAU;o.push([cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]);}return o;}
function wc_arched(x,y,w,h){const r=w/2,o=[[x,y+h],[x,y+r]];for(let i=1;i<14;i++){const a=Math.PI+i/14*Math.PI;o.push([x+r+Math.cos(a)*r,y+r+Math.sin(a)*r]);}o.push([x+w,y+r],[x+w,y+h]);return o;}
function wc_rrPts(x,y,w,h,r){const o=[],n=6;r=Math.min(r,w/2,h/2);[[x+w-r,y+r,-Math.PI/2],[x+w-r,y+h-r,0],[x+r,y+h-r,Math.PI/2],[x+r,y+r,Math.PI]].forEach(([cx,cy,a0])=>{
  for(let i=0;i<=n;i++){const a=a0+i/n*Math.PI/2;o.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);}});return o;}
function wc_resample(pts,step){if(wc_multi(pts))return pts.map(p=>wc_resample(p,step));const o=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],
  L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(L/step));for(let j=0;j<n;j++)o.push([lerp(a[0],b[0],j/n),lerp(a[1],b[1],j/n)]);}return o;}
function wc_jitter(pts,amp,seed,freq){if(wc_multi(pts))return pts.map((p,i)=>wc_jitter(p,amp,seed+i*7,freq));const n=wc_noise(seed);freq=freq||0.04;
  return pts.map(p=>[p[0]+(n(p[0]*freq,p[1]*freq)-0.5)*2*amp,p[1]+(n(p[1]*freq+31.7,p[0]*freq+11.3)-0.5)*2*amp]);}
// a tapered band along a centre line, for roads and paths
function wc_band(line,w0,w1){const L=[],R=[];for(let i=0;i<line.length;i++){const a=line[Math.max(0,i-1)],b=line[Math.min(line.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,
  w=lerp(w0,w1,i/(line.length-1))/2;L.push([line[i][0]-dy/l*w,line[i][1]+dx/l*w]);R.push([line[i][0]+dy/l*w,line[i][1]-dx/l*w]);}return L.concat(R.reverse());}
function wc_smooth(pts,n){const o=[];for(let i=0;i<pts.length-1;i++){const p0=pts[Math.max(0,i-1)],p1=pts[i],p2=pts[i+1],p3=pts[Math.min(pts.length-1,i+2)];for(let j=0;j<n;j++){const t=j/n,t2=t*t,t3=t2*t;
  o.push([0,1].map(k=>0.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3)));}}o.push(pts[pts.length-1]);return o;}
// a point along a polyline, at u (0..1) of its length
function wc_along(pts,u){let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}let left=clamp(u,0,1)*L;
  for(let i=0;i<seg.length;i++){if(left<=seg[i]||i===seg.length-1){const k=seg[i]?clamp(left/seg[i],0,1):0;return[lerp(pts[i][0],pts[i+1][0],k),lerp(pts[i][1],pts[i+1][1],k)];}left-=seg[i];}return pts[0];}

/* ---------- painting ---------- */
const wc_lit=(c,k)=>mix(c,[255,255,255],k),wc_dim=(c,k)=>mix(c,[0,0,0],k);
// distance pales a colour towards the paper
const wc_haze=(c,depth)=>mix(c,WC_PAPER,(1-clamp(depth==null?1:depth,0,1))*0.55);
const WC_BARE={field:1,chipwash:1,swatch:1,mark:1,ribbon:1,dab:1};
const WC_LINED={build:1,door:1,trim:1,tree:1,trunk:1,cover:1,page:1,wall:1,coat:1,head:1,hat:1,limb:1,arm:1,iron:1,kerb:1,clock:1,paper:1,thing:1};
// a wash: the shape cleared to paper, then three layers of pigment that don't quite agree on the edge, a darker rim where the pigment
// dried, grain in the paper's tooth, and on larger shapes, blotches where it dried unevenly (offset by a remainder kept positive, so a
// wash that starts left of the frame is blotched to its edge); buildings, trees and people get a pencil line
function wc_wash(ctx,pts,col,o){o=o||{};col=wc_haze(col,o.depth);const d=o.depth==null?1:o.depth,a=(o.a==null?1:o.a)*0.95,rp=wc_resample(pts,8),b=wc_bbox(pts),seed=(o.seed||7)+Math.round(b.x0);
  if(!WC_BARE[o.kind]&&!o.bare){wc_tr(ctx,wc_jitter(rp,2,seed,0.022));ctx.fillStyle=rgba(WC_PAPER,1);ctx.fill();}
  ctx.save();ctx.globalCompositeOperation="multiply";
  if(o.flat||b.w<26){wc_tr(ctx,wc_jitter(rp,0.8,seed,0.08));ctx.fillStyle=rgba(col,a*0.85);ctx.fill();}
  else{for(let i=0;i<3;i++){wc_tr(ctx,wc_jitter(rp,2.5+i*2.2,seed+i*13,0.022+i*0.012));ctx.fillStyle=rgba(col,a*0.36);ctx.fill();}
    wc_tr(ctx,wc_jitter(rp,2,seed+99,0.03));ctx.lineWidth=2.4;ctx.strokeStyle=rgba(wc_dim(col,0.18),a*0.4);ctx.stroke();
    ctx.save();wc_tr(ctx,rp);ctx.clip();ctx.globalAlpha=0.55;ctx.drawImage(WC.gran,0,0,W,H);
    if(b.w>220&&o.kind!=="page"){ctx.globalAlpha=0.5*a;ctx.drawImage(wc_tint(WC.blotch,col),-(((seed%420)+420)%420),-((((seed*7)%300)+300)%300),W+420,H+300);
      ctx.globalAlpha=1;ctx.filter="blur(5px)";ctx.lineWidth=16;ctx.strokeStyle=rgba(col,a*0.2);wc_tr(ctx,rp);ctx.stroke();ctx.filter="none";}
    ctx.restore();}
  ctx.restore();
  if((o.kind==="land"||o.kind==="ground")&&!o.flat){const y0=Math.max(b.y0,0),y1=Math.min(b.y1,H);if(y1-y0>120){ctx.save();wc_tr(ctx,rp);ctx.clip();
    const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(WC_PAPER,0));g.addColorStop(0.35,rgba(WC_PAPER,0));g.addColorStop(1,rgba(WC_PAPER,0.3));ctx.fillStyle=g;ctx.fillRect(b.x0,y0,b.w,y1-y0);ctx.restore();}}
  if(o.line!==false&&d>=0.45&&WC_LINED[o.kind])wc_ink(ctx,wc_multi(pts)?pts[0]:pts,true,o.lw||(o.kind==="tree"?1.4:1.7),o.ink||WC_INK,0.75*d,seed,o.kind==="tree"?2:1.1);}
// a pencil line: two passes that don't quite agree
function wc_ink(ctx,pts,closed,lw,col,a,seed,amp){const p=wc_resample(pts,6);ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  for(const [k,aa,ww] of [[0,1,1],[1,0.45,0.55]]){const j=wc_jitter(p,amp==null?1.1:amp,(seed||3)+k*17,0.05);if(closed)wc_tr(ctx,j);else wc_trOpen(ctx,j);ctx.lineWidth=lw*ww;ctx.strokeStyle=rgba(col,a*aa);ctx.stroke();}
  ctx.restore();}
// a pencil line along an open path (o.closed: a loop), drawn on from its start as p goes from 0 to 1; its jitter is worked out once and kept
function wc_resampleOpen(pts,step){const o=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/step));
  for(let j=0;j<n;j++)o.push([lerp(a[0],b[0],j/n),lerp(a[1],b[1],j/n)]);}o.push(pts[pts.length-1]);return o;}
function wc_pencil(ctx,pts,p,o){o=o||{};if(p<=0)return;const q=o.closed?pts.concat([pts[0]]):pts,key=q.map(v=>v[0].toFixed(1)+","+v[1].toFixed(1)).join(";")+"|"+(o.seed||5)+"|"+(o.amp==null?1:o.amp);
  let J=WC.paint[key];if(!J){const r=wc_resampleOpen(q,5),amp=o.amp==null?1.0:o.amp;J=WC.paint[key]=[wc_jitter(r,amp,o.seed||5,0.05),wc_jitter(r,amp,(o.seed||5)+17,0.05)];}
  const n=Math.max(2,Math.round(J[0].length*clamp(p,0,1)));ctx.save();ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);
  J.forEach((pp,i)=>{ctx.beginPath();ctx.moveTo(pp[0][0],pp[0][1]);for(let k=1;k<n;k++)ctx.lineTo(pp[k][0],pp[k][1]);ctx.lineWidth=(o.lw||2.6)*(i?0.55:1);
    ctx.strokeStyle=rgba(o.col||WC_PENCIL,(o.a==null?0.9:o.a)*(i?0.45:1));ctx.stroke();});ctx.restore();}
function wc_glowAt(ctx,x,y,r,col,a){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}

/* ---------- land and sky ---------- */
// the sky: a wet wash of blue, drying unevenly, with clouds lifted out with a tissue, over the paper; hz is the horizon
function wc_sky(ctx,hz,seed,o){o=o||{};ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  const [t,tx]=wc_buf("sky",W,H);const g=tx.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(WCP.skyTop,0.85));g.addColorStop(0.7,rgba(WCP.skyTop,0.35));g.addColorStop(1,rgba(WCP.skyTop,0));
  tx.fillStyle=g;tx.fillRect(0,0,W,hz);tx.globalCompositeOperation="destination-in";tx.drawImage(WC.blotch,0,0,W,H);tx.globalCompositeOperation="destination-out";
  const R=wc_rng(seed*3+1);for(let i=0;i<(o.clouds==null?5:o.clouds);i++){const x=(o.cx||200)+R()*(o.cw||1500),y=(o.cy||90)+R()*(o.ch||220),s=0.6+R()*0.7;
    for(const [dx,dy,r] of [[-80,10,60],[-20,-20,80],[60,0,64],[0,20,90]]){const q=tx.createRadialGradient(x+dx*s,y+dy*s,r*s*0.3,x+dx*s,y+dy*s,r*s);q.addColorStop(0,"rgba(0,0,0,0.95)");q.addColorStop(1,"rgba(0,0,0,0)");
      tx.fillStyle=q;tx.fillRect(x+dx*s-r*s,y+dy*s-r*s,r*s*2,r*s*2);}}
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.drawImage(t,0,0);if(o.sun){wc_glowAt(ctx,o.sun[0],o.sun[1],120,[255,226,150],0.7);}ctx.restore();}
function wc_land(ctx,f,col,depth,o){const pts=[];for(let x=-60;x<=W+60;x+=10)pts.push([x,f(x)]);pts.push([W+60,H+60],[-60,H+60]);wc_wash(ctx,pts,col,Object.assign({depth,kind:"land"},o||{}));return pts;}
function wc_forest(ctx,base,col,depth,seed,o){o=o||{};const R=wc_rng(seed),pts=[];let x=-60;const hmax=o.h||24,wmax=o.w||16;
  while(x<=W+60){const by=base(x),h=hmax*(0.45+R()*0.55),w=wmax*(0.6+R()*0.5);pts.push([x,by]);pts.push([x+w*0.5,by-h]);pts.push([x+w,by]);x+=w*(0.55+R()*0.4);}
  pts.push([W+60,H+60],[-60,H+60]);wc_wash(ctx,pts,col,{depth,kind:"forest",line:false});}
function wc_lake(ctx,y0,x1,depth){const pts=[];for(let x=-60;x<=x1;x+=10)pts.push([x,y0+3*Math.sin(x/90)]);pts.push([x1+40,y0+6],[x1+40,y0+80],[-60,y0+80]);wc_wash(ctx,pts,WCP.water,{depth,kind:"water",line:false});}
function wc_fieldStrips(ctx,f,y0,y1,n,cols,depth,seed){const R=wc_rng(seed||3);let prev=x=>f(x)+y0;for(let i=1;i<=n;i++){const t=i/n,off=lerp(y0,y1,t*t),skew=(R()-0.5)*0.05,cur=x=>f(x)+off+(x-960)*skew;
  const pts=[];for(let x=-60;x<=W+60;x+=16)pts.push([x,prev(x)]);for(let x=W+60;x>=-60;x-=16)pts.push([x,cur(x)]);wc_wash(ctx,pts,cols[i%cols.length],{depth,kind:"field",line:false});prev=cur;}}
// tufts of grass in the near meadow
function wc_tufts(ctx,f,x0,x1,n,depth,seed){const R=wc_rng(seed||8);for(let i=0;i<n;i++){const x=lerp(x0,x1,R()),y=f(x)+20+R()*(H-f(x)-20),s=0.7+R()*0.8*((y-700)/380);
  ctx.save();ctx.strokeStyle=rgba(wc_haze(wc_dim(WCP.near,0.22),depth),0.85);ctx.lineWidth=2.2*s;ctx.lineCap="round";ctx.beginPath();
  for(const a of [-0.5,-0.15,0.2,0.55]){ctx.moveTo(x,y);ctx.quadraticCurveTo(x+a*10*s,y-12*s,x+a*22*s,y-(18+R()*10)*s);}ctx.stroke();ctx.restore();}}
// a soft shadow where something meets the ground
function wc_contact(ctx,x0,x1,y,depth,a){ctx.save();const cx=(x0+x1)/2,rx=(x1-x0)/2*1.08,g=ctx.createRadialGradient(cx,y,1,cx,y,rx);g.addColorStop(0,rgba([110,100,90],(a||0.28)*(0.4+0.6*depth)));
  g.addColorStop(1,rgba([110,100,90],0));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,y,rx,Math.max(6,rx*0.09),0,0,TAU);ctx.fill();ctx.restore();}

/* ---------- trees ---------- */
function wc_spruce(ctx,x,y,h,depth,col){col=col||WCP.pine;const w=h*0.44,tiers=5,L=[],R=[];
  for(let i=0;i<tiers;i++){const t=i/tiers,yy=y-h*0.08-t*h*0.86,hw=w*(1-t)*0.5+2,nx=y-h*0.08-(i+1)/tiers*h*0.86+h*0.06;L.push([x-hw,yy],[x-hw*0.42,nx]);R.unshift([x+hw*0.42,nx],[x+hw,yy]);}
  wc_wash(ctx,wc_rect(x-h*0.03,y-h*0.1,h*0.06,h*0.1),WCP.trunk,{depth,kind:"trunk",line:false});
  wc_wash(ctx,[[x-w*0.08,y-h*0.08]].concat(L,[[x,y-h]],R,[[x+w*0.08,y-h*0.08]]),col,{depth,kind:"tree"});}
function wc_birch(ctx,x,y,h,depth,lean){lean=lean||0;const top=[x+lean*h,y-h*0.82];
  wc_wash(ctx,[[x-h*0.026,y],[top[0]-h*0.01,top[1]],[top[0]+h*0.01,top[1]],[x+h*0.026,y]],WCP.bark,{depth,kind:"trunk",lw:1.5});
  const R=wc_rng(Math.round(x));for(let i=0;i<7;i++){const t=0.1+R()*0.75,cx=lerp(x,top[0],t),cy=lerp(y,top[1],t),ww=h*0.02*(1-t*0.5);
    wc_wash(ctx,[[cx-ww,cy],[cx+ww*0.6,cy-2],[cx+ww,cy+3],[cx-ww*0.4,cy+4]],WCP.barkMark,{depth,kind:"mark",line:false,flat:true});}
  const Q=wc_rng(Math.round(x*3+y)),parts=[];for(let i=0;i<9;i++){const a=Q()*TAU,r=Q()*h*0.17;parts.push(wc_ell(top[0]+Math.cos(a)*r*1.1,top[1]+h*0.12+Math.sin(a)*r*1.3,h*(0.1+Q()*0.06),h*(0.13+Q()*0.07),20));}
  wc_wash(ctx,parts,WCP.birchLeaf,{depth,kind:"tree"});}
function wc_roundTree(ctx,x,y,h,depth,col){col=col||WCP.leaf;wc_wash(ctx,[[x-h*0.04,y],[x-h*0.025,y-h*0.5],[x+h*0.025,y-h*0.5],[x+h*0.04,y]],WCP.trunk,{depth,kind:"trunk"});
  const R=wc_rng(Math.round(x*7+h)),parts=[wc_ell(x,y-h*0.62,h*0.3,h*0.26,30)];for(let i=0;i<6;i++){const a=R()*TAU;parts.push(wc_ell(x+Math.cos(a)*h*0.17,y-h*0.64+Math.sin(a)*h*0.15,h*(0.15+R()*0.07),h*(0.14+R()*0.06),24));}
  wc_wash(ctx,parts,col,{depth,kind:"tree"});}
function wc_treeRow(ctx,f,x0,x1,step,h,depth,seed,col){const R=wc_rng(seed||5);for(let x=x0;x<x1;x+=step*(0.6+R()*0.8)){const hh=h*(0.7+R()*0.5);if(R()<0.35)wc_spruce(ctx,x,f(x)+3,hh*1.3,depth);else wc_roundTree(ctx,x,f(x)+3,hh,depth,col);}}

/* ---------- buildings ---------- */
function wc_part(ctx,pts,col,depth,o){wc_wash(ctx,pts,col,Object.assign({depth,kind:"build"},o||{}));}
function wc_flat(ctx,pts,col,depth,kind){wc_wash(ctx,pts,col,{depth,kind:kind||"trim",line:false,flat:true});}
function wc_bars(ctx,x,y,w,h,col,lw,depth){ctx.save();ctx.strokeStyle=rgba(wc_haze(col,depth),0.95);ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x+w/2,y+h);ctx.moveTo(x,y+h/2);ctx.lineTo(x+w,y+h/2);ctx.stroke();ctx.restore();}
// a Swedish country church: west tower and spire, steep nave roof, a lower chancel
function wc_church(ctx,x,y,k,depth){const P=WCP,tw=66*k,nw=196*k,cw=58*k;
  wc_part(ctx,wc_rect(x+tw+nw,y-64*k,cw,64*k),P.wall,depth);wc_part(ctx,[[x+tw+nw-4*k,y-64*k],[x+tw+nw+cw+8*k,y-64*k],[x+tw+nw+cw-10*k,y-108*k],[x+tw+nw+6*k,y-108*k]],P.roofDark,depth);
  wc_part(ctx,wc_rect(x+tw,y-82*k,nw,82*k),P.wall,depth);wc_part(ctx,[[x+tw-6*k,y-82*k],[x+tw+nw+10*k,y-82*k],[x+tw+nw-22*k,y-152*k],[x+tw+12*k,y-152*k]],P.roofDark,depth);
  for(let i=0;i<3;i++)wc_flat(ctx,wc_arched(x+tw+40*k+i*56*k,y-66*k,18*k,40*k),P.pane,depth,"window");
  wc_part(ctx,wc_rect(x,y-150*k,tw,150*k),P.wall,depth);wc_part(ctx,[[x-5*k,y-150*k],[x+tw+5*k,y-150*k],[x+tw/2+4*k,y-272*k],[x+tw/2-4*k,y-272*k]],P.spire,depth);
  wc_wash(ctx,wc_arched(x+tw/2-14*k,y-50*k,28*k,50*k),P.door,{depth,kind:"door",lw:1.5});wc_flat(ctx,wc_arched(x+tw/2-7*k,y-126*k,14*k,24*k),P.pane,depth,"window");
  wc_flat(ctx,wc_rect(x+tw/2-1.8*k,y-298*k,3.6*k,30*k),P.spire,depth,"cross");wc_flat(ctx,wc_rect(x+tw/2-9*k,y-290*k,18*k,3.4*k),P.spire,depth,"cross");}
// a falu-red farmhouse, long side to us, white corners and window frames
function wc_farmhouse(ctx,x,y,k,depth){const P=WCP,w=200*k,hw=78*k;
  wc_part(ctx,wc_rect(x+138*k,y-114*k,16*k,40*k),P.trim,depth);wc_part(ctx,[[x-10*k,y-hw],[x+w+10*k,y-hw],[x+w-28*k,y-hw-64*k],[x+28*k,y-hw-64*k]],P.roof,depth);
  wc_part(ctx,wc_rect(x,y-hw,w,hw),P.falu,depth);wc_flat(ctx,wc_rect(x,y-hw,7*k,hw),P.trim,depth);wc_flat(ctx,wc_rect(x+w-7*k,y-hw,7*k,hw),P.trim,depth);
  for(const wx of [24,66,152]){wc_flat(ctx,wc_rect(x+wx*k,y-62*k,28*k,32*k),P.trim,depth);wc_flat(ctx,wc_rect(x+wx*k+4*k,y-58*k,20*k,24*k),P.pane,depth,"window");wc_bars(ctx,x+wx*k+4*k,y-58*k,20*k,24*k,P.trim,2*k,depth);}
  wc_flat(ctx,wc_rect(x+104*k,y-56*k,32*k,56*k),P.trim,depth);wc_wash(ctx,wc_rect(x+108*k,y-52*k,24*k,52*k),P.farmDoor,{depth,kind:"door",line:false});
  wc_flat(ctx,wc_rect(x-2*k,y-6*k,w+4*k,8*k),P.stoneGrey,depth,"base");}
// Uppsala's cathedral, far off: two west towers with tall copper spires
function wc_cathedral(ctx,x,y,k,depth){const P=WCP;wc_part(ctx,wc_rect(x+70*k,y-60*k,150*k,60*k),P.brick,depth);wc_part(ctx,[[x+66*k,y-60*k],[x+224*k,y-60*k],[x+210*k,y-92*k],[x+80*k,y-92*k]],P.copper,depth);
  for(const tx of [0,44]){wc_part(ctx,wc_rect(x+tx*k,y-118*k,30*k,118*k),P.brick,depth);wc_part(ctx,[[x+tx*k-2*k,y-118*k],[x+tx*k+32*k,y-118*k],[x+tx*k+16*k,y-210*k]],P.copper,depth);}
  wc_part(ctx,wc_rect(x+30*k,y-96*k,14*k,96*k),P.brick,depth);}
// the university's old building: a sandstone front, two rows of arched windows, and a clock tower
function wc_quad(ctx,x,y,depth,k){ctx.save();ctx.translate(x,y);ctx.scale(k,k);const P=WCP,w=980,top=-300;
  wc_part(ctx,[[30,top-8],[w-30,top-8],[w-90,top-46],[90,top-46]],P.slate,depth);wc_part(ctx,wc_rect(0,top,w,300),P.stone,depth);
  wc_wash(ctx,wc_rect(-10,top-12,w+20,20),wc_lit(P.stone,0.12),{depth,kind:"trim",lw:2});wc_flat(ctx,wc_rect(-6,-150,w+12,10),wc_dim(P.stone,0.06),depth);
  for(const row of [0,1])for(let i=0;i<8;i++){const wx=44+i*120+(i>=4?40:0),wy=top+48+row*150;if(wx>380&&wx<600)continue;wc_wash(ctx,wc_arched(wx,wy,48,84),P.pane,{depth,kind:"window",lw:2});}
  const tx=410,tw=160;wc_part(ctx,wc_rect(tx,-440,tw,440),wc_lit(P.stone,0.04),depth);wc_part(ctx,[[tx-12,-440],[tx+tw+12,-440],[tx+tw/2+8,-560],[tx+tw/2-8,-560]],P.slate,depth);
  wc_flat(ctx,wc_rect(tx+tw/2-3,-596,6,40),P.slate,depth,"cross");wc_wash(ctx,wc_ell(tx+tw/2,-372,40,40,40),P.clock,{depth,kind:"clock",lw:2.5});
  ctx.strokeStyle=rgba(WC_INK,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(tx+tw/2,-372);ctx.lineTo(tx+tw/2,-400);ctx.moveTo(tx+tw/2,-372);ctx.lineTo(tx+tw/2+20,-366);ctx.stroke();
  wc_wash(ctx,wc_arched(tx+tw/2-44,-150,88,150),P.door,{depth,kind:"door",lw:2});wc_flat(ctx,wc_rect(tx-14,-10,tw+28,12),wc_lit(P.stone,0.1),depth);ctx.restore();}
function wc_glassWing(ctx,x,y,w,h,depth){const P=WCP;wc_part(ctx,wc_rect(x,y-h,w,h),P.glass,depth,{kind:"glass"});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(P.glass,0.35),0.7);ctx.lineWidth=3;for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(x+i*w/5,y-h);ctx.lineTo(x+i*w/5,y);ctx.stroke();}
  for(let j=1;j<4;j++){ctx.beginPath();ctx.moveTo(x,y-h+j*h/4);ctx.lineTo(x+w,y-h+j*h/4);ctx.stroke();}ctx.restore();wc_wash(ctx,wc_rect(x-8,y-h-14,w+16,16),P.concrete,{depth,kind:"trim",lw:2});}
// a terraced house, long side to the street
function wc_terrace(ctx,x,y,w,col,depth,o){o=o||{};const k=o.k||1,P=WCP,top=-230;ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  wc_part(ctx,wc_rect(w*0.68,top-112,22,60),P.chimney,depth);wc_part(ctx,[[-6,top],[w+6,top],[w-40,top-80],[40,top-80]],P.tile,depth);wc_part(ctx,wc_rect(0,top,w,230),col,depth);
  for(const [wx,wy] of [[28,40],[w-80,40],[28,140]]){wc_flat(ctx,wc_rect(wx-5,top+wy-5,62,74),P.trim,depth);wc_wash(ctx,wc_rect(wx,top+wy,52,64),P.pane,{depth,kind:"window",line:false});wc_bars(ctx,wx,top+wy,52,64,P.trim,3,depth);}
  wc_wash(ctx,wc_rect(w-86,top+124,62,106),o.door||P.door,{depth,kind:"door",lw:2});wc_flat(ctx,wc_rect(w-64,top+170,20,5),P.trim,depth,"slot");ctx.restore();}
function wc_skyline(ctx,base,col,depth,seed){const R=wc_rng(seed),pts=[[-60,base]];let x=-60;while(x<W+60){const w=60+R()*120,h=50+R()*150;pts.push([x,base-h],[x+w,base-h]);x+=w;
  if(R()<0.3){pts.push([x,base-h-30-R()*40],[x+14,base-h-30-R()*40]);x+=14;}}pts.push([W+60,base],[W+60,H+60],[-60,H+60]);wc_wash(ctx,pts,col,{depth,kind:"skyline",line:false});}
function wc_lamp(ctx,x,y,h,depth){const P=WCP;wc_wash(ctx,wc_rect(x-5,y-h,10,h),P.iron,{depth,kind:"iron",lw:1.5});wc_wash(ctx,[[x-24,y-h-6],[x+24,y-h-6],[x+16,y-h-44],[x-16,y-h-44]],P.iron,{depth,kind:"iron",lw:1.5});
  wc_flat(ctx,wc_rect(x-14,y-h-38,28,28),P.lampGlow,depth,"lampglass");}
// a letterbox, on a post
function wc_mailbox(ctx,x,y,depth){const P=WCP;wc_wash(ctx,wc_rect(x-7,y-150,14,150),P.iron,{depth,kind:"iron",lw:2});
  wc_part(ctx,[[x-48,y-150],[x+48,y-150],[x+48,y-206],[x+36,y-222],[x-36,y-222],[x-48,y-206]],P.mailbox,depth);wc_flat(ctx,wc_rect(x-30,y-196,60,8),wc_dim(P.mailbox,0.4),depth,"slot");}
// a Swedish roundpole fence: pairs of posts, and thin poles laid on the slant
function wc_fence(ctx,f,x0,x1,depth){const P=WCP;for(let x=x0;x<x1;x+=120){const y=f(x);for(const dx of [-4,4])wc_wash(ctx,wc_rect(x+dx-2.5,y-56,5,62),wc_dim(P.wood,0.15),{depth,kind:"post",lw:1.2});}
  for(let x=x0;x<x1;x+=19){const y=f(x);wc_wash(ctx,[[x-2,y-46],[x+3,y-48],[x+46,y-6],[x+41,y-4]],(Math.round(x/19)%3)?P.wood:wc_lit(P.wood,0.12),{depth,kind:"pole",lw:1});}}
// a small figure, for the past: a walker in a coat and hat, carrying a paper in the household ribbon's teal
function wc_walker(ctx,x,y,h,cloth,depth,o){o=o||{};const k=h/100,P=WCP;
  wc_wash(ctx,[[x-6*k,y-46*k],[x-14*k,y],[x-8*k,y],[x+1*k,y-36*k]],wc_dim(cloth,0.35),{depth,kind:"limb",lw:1.2});wc_wash(ctx,[[x+4*k,y-46*k],[x+16*k,y-2*k],[x+10*k,y],[x-3*k,y-38*k]],wc_dim(cloth,0.3),{depth,kind:"limb",lw:1.2});
  wc_wash(ctx,[[x-14*k,y-80*k],[x+12*k,y-80*k],[x+16*k,y-40*k],[x-16*k,y-40*k]],cloth,{depth,kind:"coat",lw:1.4});wc_wash(ctx,wc_ell(x,y-90*k,9*k,10*k,18),P.skinTiny,{depth,kind:"head",lw:1.2});
  wc_wash(ctx,[[x-13*k,y-96*k],[x+13*k,y-96*k],[x+9*k,y-104*k],[x-9*k,y-104*k]],P.hat,{depth,kind:"hat",lw:1.2});
  if(o.paper){wc_wash(ctx,[[x+12*k,y-70*k],[x+34*k,y-74*k],[x+36*k,y-58*k],[x+14*k,y-54*k]],P.parchment,{depth,kind:"paper",lw:1.2,flat:true});wc_flat(ctx,wc_rect(x+22*k,y-73*k,4*k,18*k),WC_ROLE.student,1,"ribbon");}
  wc_wash(ctx,[[x+8*k,y-78*k],[x+20*k,y-60*k],[x+15*k,y-56*k],[x+4*k,y-70*k]],cloth,{depth,kind:"arm",lw:1.2});}

/* ---------- what is kept ---------- */
// a picture painted once, by paint(ctx) on a w×h canvas (default the frame), and kept: every background, and anything still
function wc_kept(key,w,h,paint){let c=WC.bg[key];if(c)return c;wc_prep();c=WC.bg[key]=mkCanvas(w||W,h||H);const x=c.getContext("2d");paint(x);return c;}
// the paper's tooth, and a soft darkening at the corners, over the whole frame: the last thing every scene draws, in the frame's own space
function wc_paperOver(ctx,S){setScreen(ctx,S);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation="multiply";ctx.drawImage(WC.paper,0,0,ctx.canvas.width,ctx.canvas.height);ctx.restore();}
// the film opens out of the paper, and each chapter's first moment
function wc_fadeIn(ctx,S,t,d){d=d||1.2;if(t<d){setScreen(ctx,S);ctx.fillStyle=rgba(WC_PAPER,1-ease(t/d));ctx.fillRect(0,0,W,H);}}
// a veil of paper over the scene, for the title and end cards
function wc_veil(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle=rgba(WC_PAPER,clamp(a,0,1));ctx.fillRect(0,0,W,H);}

/* ---------- text ---------- */
// text in ink; size at least 28, as everywhere in the films
function wc_T(ctx,s,x,y,o){o=Object.assign({},o||{});if(!o.color)o.color=rgba(o.col||WC_INK,o.a==null?1:o.a);T(ctx,s,x,y,o);}
// handwriting: the same face, leaning, as a pen writes; p reveals it letter by letter
function wc_hand(ctx,s,x,y,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return;const n=Math.ceil(s.length*clamp(p,0,1)),sub=s.slice(0,n);ctx.save();ctx.translate(x,y);ctx.transform(1,0,-0.2,1,0,0);
  wc_T(ctx,sub,0,0,{size:o.size||32,w:o.w||600,col:o.col||WCP.parchInk,align:o.align,a:o.a});ctx.restore();}

/* ---------- cards, chips, tags: paper, painted once, with the text drawn every frame ---------- */
// the paper of a card, a chip, a tag, a badge or an envelope: a pale card with a pencil edge; a chip is washed in its role's colour, a
// card wears its role's colour as a brushstroke behind its title (o.sw wide), and a role that hasn't started yet is dashed in its colour
function wc_panelPaint(x,w,h,o){const r=o.kind==="card"||o.kind==="sheet"?12:o.kind==="envelope"?4:h/2,pad=8;
  x.translate(pad,pad);wc_tr(x,wc_rrPts(0,0,w,h,r));x.fillStyle=rgba(o.fill||WC_CARD,o.dashed?0.92:0.95);x.fill();
  if(o.kind==="chip"&&!o.dashed&&o.role)wc_wash(x,wc_resample(wc_rect(4,4,w-8,h-8),10),mix(o.role,[255,255,255],0.2),{kind:"chipwash",line:false,a:0.74,seed:o.seed});
  if(o.kind==="card"&&o.role&&!o.dashed&&o.sw)wc_wash(x,wc_resample(wc_rect(16,o.sy||14,Math.min(w-30,o.sw),o.sh||46),10),o.role,{kind:"swatch",line:false,a:0.58,seed:o.seed});
  if(o.kind==="badge")wc_wash(x,wc_resample(wc_rect(2,2,w-4,h-4),8),o.role||WC_BADGE,{kind:"swatch",line:false,a:0.6,seed:o.seed});
  if(o.wash)wc_wash(x,wc_resample(wc_rect(6,6,w-12,h-12),10),o.wash,{kind:"chipwash",line:false,a:o.washA||0.3,seed:o.seed});
  if(o.dashed){x.save();wc_tr(x,wc_rrPts(2,2,w-4,h-4,r));x.setLineDash([10,9]);x.lineWidth=2.5;x.strokeStyle=rgba(o.role||WC_PENCIL,0.95);x.stroke();x.restore();}
  else wc_ink(x,wc_rrPts(0,0,w,h,Math.min(r,6)),true,o.kind==="tag"||o.kind==="badge"?1.5:2,WC_PENCIL,0.85,o.seed||Math.round(w+h),0.9);}
const WC_SC=2; // cards are kept at twice the frame's resolution, so they stay sharp when the camera moves in
function wc_panel(ctx,x,y,w,h,o){o=o||{};w=Math.round(w);h=Math.round(h);const key=[o.kind,w,h,o.role,o.dashed?1:0,o.sw|0,o.sy|0,o.sh|0,o.wash,o.washA,o.fill,o.seed|0].join("|");let c=WC.card[key];
  if(!c){wc_prep();c=WC.card[key]=mkCanvas((w+16)*WC_SC,(h+16)*WC_SC);const cx=c.getContext("2d");cx.scale(WC_SC,WC_SC);wc_panelPaint(cx,w,h,o);}
  ctx.drawImage(c,x-8,y-8,w+16,h+16);}
// a label: the paper tag, its text at 28 px or more; y is its middle; returns its width
function wc_tag(ctx,x,y,s,o){o=o||{};const size=o.size||30,wt=o.w||700,w=Math.round(tw(ctx,s,size,wt,o.f)+40),h=Math.round(size+22),x0=o.align==="center"?x-w/2:o.align==="right"?x-w:x;
  wc_panel(ctx,x0,y-h/2,w,h,{kind:"tag",role:o.role,wash:o.wash,washA:o.washA,seed:o.seed});wc_T(ctx,s,x0+20,y+size*0.36,{w:wt,size,f:o.f,col:o.col||WC_INK});return w;}
// the year and the place, in the top corner
function wc_year(ctx,x,y,s,a){if(a==null)a=1;if(a<=0.01)return;withA(ctx,a,()=>{const w=Math.round(tw(ctx,s,30,500,"mono")+76),h=56;wc_panel(ctx,x,y-h/2,w,h,{kind:"pill"});
  ctx.fillStyle=rgba([226,150,10],1);ctx.beginPath();ctx.arc(x+30,y,6.5,0,TAU);ctx.fill();wc_T(ctx,s,x+50,y+11,{w:500,size:30,f:"mono"});});}
// a badge: a short word on a yellow wash, such as "old" or "shared"
function wc_badge(ctx,x,y,s,o){o=o||{};const size=o.size||28,w=Math.round(tw(ctx,s,size,700)+28),h=42;wc_panel(ctx,x,y-h/2,w,h,{kind:"badge",role:o.role,seed:o.seed});
  wc_T(ctx,s,x+w/2,y+size*0.36,{w:700,size,align:"center",col:WC_DARK});return w;}
// a record as one system holds it: the role, the system's own key, and the contact it has on file: ticked once it's up to date (o.fresh), or
// with a badge (o.badge) while it's out of date
function wc_roleCard(ctx,x,y,w,h,role,title,id,contact,o){o=o||{};const col=WC_ROLE[role],tW=tw(ctx,title,30,800);
  wc_panel(ctx,x,y,w,h,{kind:"card",role:col,dashed:o.dashed,sw:tW+36,seed:o.seed});const lx=x+32;
  wc_T(ctx,title,lx,y+48,{w:800,size:30,col:o.dashed?WC_INK:WC_DARK});if(id)wc_T(ctx,id,x+w-24,y+48,{w:500,size:28,f:"mono",align:"right"});
  if(contact){const ok=o.fresh,s=(ok?"✓ ":"")+contact;wc_T(ctx,s,lx,y+96,{w:500,size:28,f:"mono",col:ok?WC_ROLEINK.student:WC_MUTED,a:o.ea==null?1:o.ea});
    if(!ok&&o.badge){const bw=tw(ctx,s,28,500,"mono");withA(ctx,o.ba==null?1:o.ba,()=>wc_badge(ctx,lx+bw+12,y+87,o.badge));}}
  else if(o.note)wc_T(ctx,o.note,lx,y+96,{w:600,size:28,col:WC_MUTED});}
// a role, dated: a chip in the role's wash, with its name and its dates
function wc_chip(ctx,x,y,w,h,role,label,sub,o){o=o||{};const col=WC_ROLE[role]||role;wc_panel(ctx,x,y,w,h,{kind:"chip",role:col,dashed:o.dashed,seed:o.seed});
  const lw=tw(ctx,label,30,800);wc_T(ctx,label,x+28,y+h/2+11,{w:800,size:30,col:WC_DARK});if(sub)wc_T(ctx," · "+sub,x+28+lw,y+h/2+10,{w:600,size:28,col:WC_DARK,a:0.88});}
// a contact point or an identifier: a big line, mono, and what it is under it
function wc_info(ctx,x,y,w,h,big,small,o){o=o||{};wc_panel(ctx,x,y,w,h,{kind:"card",seed:o.seed,wash:o.wash,washA:o.washA});const lx=x+30;
  wc_T(ctx,big,lx,y+50,{w:o.mono===false?700:500,size:o.bigSize||30,f:o.mono===false?"sans":"mono",col:WC_DARK});wc_T(ctx,small,lx,y+96,{w:600,size:28,col:WC_MUTED});
  if(o.badge){const bw=tw(ctx,small,28,600);withA(ctx,o.ba==null?1:o.ba,()=>wc_badge(ctx,lx+bw+14,y+87,o.badge));}}
// a lane's name, and what it holds
function wc_laneHead(ctx,x,y,t,sub,o){o=o||{};const w=tw(ctx,t,36,800);wc_T(ctx,t,x,y,{w:800,size:36,col:WC_DARK});if(sub)wc_T(ctx,sub,x+w+20,y,{w:600,size:28,col:WC_MUTED});}
// an envelope; with o.label, a tag under it
function wc_envelope(ctx,x,y,s,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);const w=Math.round(120*s),h=Math.round(80*s);wc_panel(ctx,-w/2,-h/2,w,h,{kind:"envelope"});
  ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-w/2+6,-h/2+6);ctx.lineTo(0,h*0.08);ctx.lineTo(w/2-6,-h/2+6);ctx.stroke();ctx.restore();}
// a dotted pencil line from one thing to another, leaving and arriving level (o.vertical: upright), drawn on as p goes from 0 to 1; returns its tip
function wc_link(ctx,x0,y0,x1,y1,col,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return null;const c1=o.vertical?[x0,(y0+y1)/2]:[(x0+x1)/2,y0],c2=o.vertical?[x1,(y0+y1)/2]:[(x0+x1)/2,y1],pts=[];
  for(let i=0;i<=24;i++){const t=i/24,u=1-t,a=u*u*u,b=3*u*u*t,c=3*u*t*t,d=t*t*t;pts.push([a*x0+b*c1[0]+c*c2[0]+d*x1,a*y0+b*c1[1]+c*c2[1]+d*y1]);}
  const n=Math.max(2,Math.round(pts.length*clamp(p,0,1)));ctx.save();ctx.strokeStyle=rgba(col||WC_PENCIL,o.a==null?0.7:o.a);ctx.lineWidth=o.lw||3;ctx.lineCap="round";ctx.setLineDash(o.dash||[2,11]);
  ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<n;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();ctx.restore();return pts[n-1];}
// a tick, drawn in pencil as p goes from 0 to 1
function wc_tick(ctx,x,y,s,col,p,lw){p=p==null?1:p;if(p<=0)return;const a=[x-s*0.42,y],b=[x-s*0.1,y+s*0.32],c=[x+s*0.46,y-s*0.38],l1=Math.hypot(b[0]-a[0],b[1]-a[1]),l2=Math.hypot(c[0]-b[0],c[1]-b[1]),L=(l1+l2)*clamp(p,0,1);
  ctx.save();ctx.strokeStyle=rgba(col||WC_ROLEINK.alumna,1);ctx.lineWidth=lw||Math.max(3,s*0.15);ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(a[0],a[1]);
  if(L<=l1)ctx.lineTo(lerp(a[0],b[0],L/l1),lerp(a[1],b[1],L/l1));else{ctx.lineTo(b[0],b[1]);ctx.lineTo(lerp(b[0],c[0],(L-l1)/l2),lerp(b[1],c[1],(L-l1)/l2));}ctx.stroke();ctx.restore();}
// a cross, the same way
function wc_cross(ctx,x,y,s,col,p){p=p==null?1:p;if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(col||WC_NO,1);ctx.lineWidth=Math.max(3,s*0.15);ctx.lineCap="round";
  const q=clamp(p*2,0,1),r=clamp(p*2-1,0,1);ctx.beginPath();ctx.moveTo(x-s*0.35,y-s*0.35);ctx.lineTo(lerp(x-s*0.35,x+s*0.35,q),lerp(y-s*0.35,y+s*0.35,q));
  if(r>0){ctx.moveTo(x+s*0.35,y-s*0.35);ctx.lineTo(lerp(x+s*0.35,x-s*0.35,r),lerp(y-s*0.35,y+s*0.35,r));}ctx.stroke();ctx.restore();}
// a pencil circle round something, drawn on: a loop that overshoots its start, as a hand draws one
function wc_ring(ctx,cx,cy,rx,ry,p,o){o=o||{};if(p<=0)return;const pts=[];for(let i=0;i<=60;i++){const u=i/60,a=-2.2+u*TAU*1.08,r=1+0.05*Math.sin(u*9)+0.04*u;pts.push([cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r]);}
  wc_pencil(ctx,pts,p,{col:o.col||WC_PENCIL,lw:o.lw||3.4,a:o.a==null?0.92:o.a,seed:o.seed||9,amp:1.4});}

/* ---------- the person, as the master record ---------- */
// the person cleared to white paper in a pencil line, gathering her roles' colours as bands; kept once per person and size. bands: [{col,
// dashed, a}] from the shoulders down; each band's a (0..1) lets it arrive, and o.a fades the whole figure
function wc_whiteFig(id,s){const key=id+"|"+s;if(WC.fig[key])return WC.fig[key];const P=PEOPLE[id],k=s*P.build.h,pad=44,w=Math.ceil(500*k+pad*2),h=Math.ceil(660*k+pad*2),fy=pad+650*k;
  const fig=mkCanvas(w,h),fx=fig.getContext("2d");WC_RAW=true;try{person(fx,id,w/2,fy,s,{pose:"ease",t:1.2});}finally{WC_RAW=false;}
  const M=mkCanvas(w,h),mx=M.getContext("2d");mx.drawImage(fig,0,0);mx.globalCompositeOperation="source-in";mx.fillStyle="#fff";mx.fillRect(0,0,w,h);
  const G=mkCanvas(w,h),gx=G.getContext("2d");gx.fillStyle="rgba(255,255,255,0.72)";gx.fillRect(0,0,w,h);gx.globalAlpha=0.2;gx.drawImage(fig,0,0);gx.globalAlpha=1;
  gx.globalCompositeOperation="destination-in";gx.drawImage(M,0,0);
  // the pencil line: the silhouette grown a little in pencil, less the silhouette
  const D=mkCanvas(w,h),dx=D.getContext("2d"),Tn=mkCanvas(w,h),tx=Tn.getContext("2d");tx.drawImage(M,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle=rgba(WC_PENCIL,1);tx.fillRect(0,0,w,h);
  for(let i=0;i<24;i++){const a=i/24*TAU;dx.drawImage(Tn,Math.cos(a)*1.8,Math.sin(a)*1.8);}dx.drawImage(Tn,0,0);dx.globalCompositeOperation="destination-out";dx.drawImage(M,0,0);
  return WC.fig[key]={w,h,fy,k,M,G,D};}
function wc_white(ctx,id,x,y,s,bands,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const F=wc_whiteFig(id,s),ox=x-F.w/2,oy=y-F.fy;
  withA(ctx,a,()=>{if(o.shadow!==false){ctx.save();const tg=ctx.createRadialGradient(x,y-4,4,x,y-4,110*F.k);tg.addColorStop(0,rgba([90,80,96],0.14));tg.addColorStop(1,rgba([90,80,96],0));ctx.fillStyle=tg;
      ctx.beginPath();ctx.ellipse(x,y-4,110*F.k,18*F.k,0,0,TAU);ctx.fill();ctx.restore();}
    ctx.save();ctx.globalAlpha*=0.85;ctx.drawImage(F.D,ox,oy);ctx.restore();ctx.drawImage(F.G,ox,oy);
    if(bands&&bands.length){const [bc,bx]=wc_buf("bands",F.w,F.h),by0=F.fy-436*F.k;bands.forEach((b,i)=>{const ba=(b.a==null?1:b.a);if(ba<=0.01)return;
        bx.fillStyle=rgba(b.col,(b.dashed?0.4:1)*0.72*ba);const yy=by0+(b.i==null?i:b.i)*64*F.k;bx.fillRect(0,yy,F.w,42*F.k);});
      bx.globalCompositeOperation="destination-in";bx.drawImage(F.M,0,0);ctx.drawImage(bc,ox,oy);}});}
// the middle of band i on the figure, for lines that run to it
function wc_bandY(id,s,y,i){const k=s*PEOPLE[id].build.h;return y-650*k+(650-436)*k+i*64*k+21*k;}

/* ---------- title and end cards ---------- */
const WC_SERIES="The same one, everywhere";
// five strokes of the role colours, the series' mark
function wc_mark(ctx,cx,cy,w,p,a){if(a<=0.01)return;const cols=["student","applicant","researcher","tutor","alumna"],n=cols.length,sw=w/n;withA(ctx,a,()=>{cols.forEach((r,i)=>{const q=clamp(p*n*0.8-i*0.6,0,1);if(q<=0)return;
  const x=cx-w/2+i*sw,c=wc_kept("mark"+i,Math.round(sw+24),40,x2=>{wc_prep();wc_wash(x2,wc_resample(wc_rect(6,6,sw+10,26),8),WC_ROLE[r],{kind:"swatch",line:false,a:0.85,seed:31+i*7});});
  ctx.save();ctx.beginPath();ctx.rect(x-4,cy-30,(sw+30)*ease(q),60);ctx.clip();ctx.drawImage(c,x-6,cy-20);ctx.restore();});});}
function wc_title(ctx,S,t,t0,title,sub,line){const oA=fin(t,t0,0.8),tA=fin(t,t0+0.5,0.8);if(oA<=0)return;wc_veil(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{wc_T(ctx,WC_SERIES.toUpperCase(),960,400,{w:800,size:30,align:"center",col:WC_MUTED});wc_T(ctx,title,960,510,{w:800,size:92,align:"center",col:WC_DARK});
    wc_mark(ctx,960,572,520,(t-t0-0.6)/1.2,1);if(sub)wc_T(ctx,sub,960,664,{w:600,size:36,align:"center",col:WC_MUTED});
    withA(ctx,fin(t,t0+1.2,0.8),()=>wc_tag(ctx,960,750,line,{align:"center",size:28,w:600}));});}
function wc_end(ctx,S,t,t0,title,line,n){const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;wc_veil(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)wc_T(ctx,line,960,420,{w:700,size:48,align:"center",col:WC_DARK});wc_mark(ctx,960,520,400,(t-t0-0.7)/1.0,1);wc_T(ctx,title,960,622,{w:800,size:44,align:"center",col:WC_DARK});
    wc_T(ctx,WC_SERIES+(n?" · "+n:"")+" · Learning Data",960,680,{w:600,size:28,align:"center",col:WC_MUTED});});}

/* ===== The same one, everywhere: the series' people, in pencil and wash =====
   The films' people (When things go wrong's character sheet), drawn the watercolour way: a fine pencil line, paint that runs a little
   past it, pigment in the paper's tooth, and behind them a loose wash of their side's colour: cyan for the technical side (Noor), gold
   for the business side (Mei, Minh). Linh, the person the data is about, has no side: a neutral edge, so she can wear her roles'
   colours. Minh, her brother, shares his home with her. These replace how the character sheet shades and outlines
   people, for this series only. */

PEOPLE.linh={name:"Linh Nguyen",role:"Student",side:"Person",does:"uses",edge:[236,232,226],seed:21,
  skin:[230,192,156],hair:{style:"bob",c:[30,24,26],streak:[86,72,74]},earrings:[226,230,240],
  top:{kind:"overshirt",c:[88,124,168],inner:[246,242,234]},bottom:{c:[52,56,70]},shoe:[240,240,244],build:{sh:64,hip:58,h:0.93}};
PEOPLE.minh={name:"Minh Nguyen",role:"Student",side:"Business",does:"uses",edge:BIZ,seed:22,
  skin:[218,176,138],hair:{style:"cropped",c:[24,22,24]},glasses:[44,42,50],
  top:{kind:"sweater",c:[178,100,74]},bottom:{c:[62,82,114]},shoe:[46,46,52],build:{sh:70,hip:58,h:0.97}};
// reading a letter in the right hand; standing at ease, hands loose
POSE.letter={L:[0.12,-0.04],R:[0.06,Math.PI+0.95],hold:"envelope",feet:24,shift:-2,tilt:0.06,turn:0.06,gaze:[-0.2,1],look:1};
POSE.ease={L:[0.16,-0.18],R:[0.14,-0.16],feet:26,shift:2,tilt:-0.015,turn:-0.04,gaze:[0,0],look:0};

// softer shading than the glass films: watercolour has little modelling
const WC_SHADE=0.75,WC_SEAM=0.8;
function litFill(ctx,c,x0,y0,x1,y1,k){k=(k||1)*WC_SHADE;const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,rgba(lighten(c,0.16*k),1));g.addColorStop(0.55,rgba(c,1));
  g.addColorStop(1,rgba(darken(c,0.3*k),1));ctx.fillStyle=g;ctx.fill();}
function seam(ctx,c,a,w){ctx.strokeStyle=rgba(darken(c,0.55),(a==null?0.45:a)*WC_SEAM);ctx.lineWidth=w||1.6;ctx.stroke();}
function limb(ctx,pts,w0,w1,c,box){const g=ctx.createLinearGradient(box[0],box[1],box[2],box[3]);g.addColorStop(0,rgba(lighten(c,0.14*WC_SHADE),1));g.addColorStop(1,rgba(darken(c,0.28*WC_SHADE),1));
  ctx.lineCap="round";ctx.lineJoin="round";
  for(let i=0;i<pts.length-1;i++){const w=lerp(w0,w1,i/Math.max(1,pts.length-2));ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i+1][0],pts[i+1][1]);
    ctx.strokeStyle=rgba(darken(c,0.55),0.5*WC_SEAM);ctx.lineWidth=w+2.4;ctx.stroke();}
  for(let i=0;i<pts.length-1;i++){const w=lerp(w0,w1,i/Math.max(1,pts.length-2));ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i+1][0],pts[i+1][1]);ctx.strokeStyle=g;ctx.lineWidth=w;ctx.stroke();}}

// a person, as the character sheet draws one, with a soft shadow on the paper rather than a dark one; WC_RAW draws the figure alone (no
// shadow, no edge), for the white figure (wash.js) to be cut from
let WC_RAW=false;
function person(ctx,id,x,y,s,o){o=o||{};const P=PEOPLE[id],po=blendPose(POSE[o.pose||"stand"],POSE[o.pose2],o.mix),E=EXPR[o.expr||"calm"],t=o.t||0,k=s*P.build.h;
  const br=Math.sin(t*1.7+P.seed)*1.4;
  if(!WC_RAW){ctx.save();ctx.translate(x,y);ctx.scale(k,k);const g=ctx.createRadialGradient(0,-4,4,0,-4,100);g.addColorStop(0,rgba([90,80,96],0.2));g.addColorStop(1,rgba([90,80,96],0));ctx.fillStyle=g;ell(ctx,0,-4,100,16);ctx.fill();ctx.restore();}
  const front=a=>a[1]>Math.PI*0.8;
  outlined(ctx,cx=>{
    if(!front(po.L))arm(cx,P,-1,po.L,br,po);if(!front(po.R))arm(cx,P,1,po.R,br,po);
    legs(cx,P,po);
    limb(cx,[[0,-470+br],[0,-440+br]],30,30,darken(P.skin,0.12),[-20,-470,20,-440]);
    torso(cx,P,br,po.shift);
    cx.save();cx.translate(po.shift*0.2,-452+br);cx.rotate(po.tilt);cx.translate(0,-50+po.look*2);head(cx,P,E,po,t);cx.restore();
    if(front(po.L))arm(cx,P,-1,po.L,br,po);if(front(po.R))arm(cx,P,1,po.R,br,po);
  },x,y,k,P.edge,[-250,-650,250,10],o.glow);}

// the pencil and wash: the figure, drawn into a spare canvas, then a loose wash of its side's colour behind it, the paint bleeding a little
// past the line, pigment in the paper's tooth, and a fine pencil line round it. Blurs are made by shrinking and growing, which is cheap.
const wc_aura=e=>e[0]>200&&e[1]>200&&e[2]>200?WC_SIDE.none:e===TECH?WC_SIDE.tech:e===BIZ?WC_SIDE.biz:e;
function outlined(ctx,draw,x,y,s,edge,box,glowA){const [x0,y0,x1,y1]=box,pad=40,w=Math.ceil((x1-x0)*s+pad*2),h=Math.ceil((y1-y0)*s+pad*2);
  const [c,cx]=pcanvas("p",w,h);cx.translate(pad-x0*s,pad-y0*s);cx.scale(s,s);draw(cx);const ox=x+x0*s-pad,oy=y+y0*s-pad;
  if(WC_RAW){ctx.drawImage(c,ox,oy);return;}
  wc_prep();const q=8,sw=Math.max(2,Math.ceil(w/q)),sh=Math.max(2,Math.ceil(h/q)),col=wc_aura(edge);
  // the silhouette in the side's colour, shrunk: grown again, it is a soft blur
  const [sc,sx]=wc_buf("figS"+sw+"x"+sh,sw,sh);sx.drawImage(c,0,0,sw,sh);sx.globalCompositeOperation="source-in";sx.fillStyle=rgba(col,1);sx.fillRect(0,0,sw,sh);
  ctx.save();ctx.globalAlpha*=0.3;ctx.globalCompositeOperation="multiply";ctx.imageSmoothingEnabled=true;ctx.drawImage(sc,ox-10*s-q,oy+6*s-q,w+2*q,h+2*q);ctx.restore();
  // the paint, with the paper's grain and an uneven dry
  const [fc,fx]=wc_wpaint(c,w,h);
  const [bc,bx]=wc_buf("figB"+w+"x"+h,Math.ceil(w/4),Math.ceil(h/4));bx.drawImage(fc,0,0,bc.width,bc.height);
  ctx.save();ctx.globalAlpha*=0.4;ctx.drawImage(bc,ox+2*s,oy+1*s,w,h);ctx.restore();
  // the pencil line: the silhouette in pencil, a little off in four directions, under the paint
  const [tc,tx]=wc_buf("figT"+w+"x"+h,w,h);tx.drawImage(c,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle=rgba(WC_PENCIL,1);tx.fillRect(0,0,w,h);
  ctx.save();ctx.globalAlpha*=0.8;for(const [dx,dy] of [[1.5*s,0.4*s],[-1.2*s,1.1*s],[0.3*s,-1.4*s],[-0.6*s,-0.9*s]])ctx.drawImage(tc,ox+dx,oy+dy);ctx.restore();
  ctx.drawImage(fc,ox,oy);}
function wc_wpaint(c,w,h){const [fc,fx]=wc_buf("figP"+w+"x"+h,w,h);fx.drawImage(c,0,0);fx.globalCompositeOperation="multiply";fx.globalAlpha=0.5;fx.drawImage(WC.gran,0,0);
  fx.globalAlpha=0.4;fx.drawImage(wc_tint(WC.blotch,[206,196,186]),0,0,W,H);fx.globalAlpha=1;fx.globalCompositeOperation="destination-in";fx.drawImage(c,0,0);
  fx.globalCompositeOperation="source-over";return[fc,fx];}

// an envelope in the hand, for the person who opens someone else's post: the letter half out, the fingers over its edge
function envelopeInHand(ctx,P,h,ang){ctx.save();ctx.translate(h[0]-2,h[1]+4);ctx.rotate(-0.08);const line=[110,100,96];
  ctx.save();ctx.rotate(0.16);ctx.beginPath();rr(ctx,-30,-44,76,60,3);ctx.fillStyle="#ffffff";ctx.fill();ctx.strokeStyle=rgba(line,0.6);ctx.lineWidth=1.6;ctx.stroke();
  ctx.fillStyle=rgba(line,0.5);for(let i=0;i<2;i++)ctx.fillRect(-20,-34+i*10,44-i*12,3.4);ctx.fillStyle=rgba([238,96,78],0.95);ctx.beginPath();ctx.arc(30,-30,6,0,TAU);ctx.fill();ctx.restore();
  ctx.beginPath();rr(ctx,-52,-8,104,66,5);ctx.fillStyle=rgba([250,247,240],1);ctx.fill();ctx.strokeStyle=rgba(line,0.7);ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();ctx.moveTo(-50,-4);ctx.lineTo(0,26);ctx.lineTo(50,-4);ctx.strokeStyle=rgba(line,0.45);ctx.stroke();
  ell(ctx,-30,-4,13,14);litFill(ctx,P.skin,-43,-18,-17,10);ell(ctx,-12,-10,6,10,0.3);litFill(ctx,P.skin,-18,-20,-6,0);
  ctx.restore();}
// the character sheet's hands hold a phone; this lets one hold an envelope too, drawn where the phone would be
const wc_arm0=arm;
arm=function(ctx,P,s,a,br,po){if(po.hold!=="envelope")return wc_arm0(ctx,P,s,a,br,po);const keep=phoneInHand;phoneInHand=envelopeInHand;
  try{return wc_arm0(ctx,P,s,a,br,Object.assign({},po,{hold:"phone"}));}finally{phoneInHand=keep;}};

/* ===== The data governance series: its people =====
   The cast of When things go wrong and In the weeds of data crafting (Mei, Sam, David, Jun), and four more: Yusuf Demir, the
   university's new data governance lead, Clara Jensen, in Planning, Anil Kurian, an analyst in the Faculty of Health, and Marta
   Nowak, who leads the wallet app team. They're drawn the way the master and reference data series draws people (its
   shared/src/people.js, bundled as it is): a pencil line, paint in the paper's grain, and behind each person a soft wash of their
   side's colour, gold for the business side and cyan for the technical side. The people of the past get a warm umber wash, and wear
   their own time: tunics and gowns of wool in 1215, a furred gown in 1497, a frock coat and a top hat, or a waistcoat and an apron,
   in the 1880s. People can hold things (a charter, a jug, a binder, a notebook, a hammer) and face either way. */

// the wash behind people of the past, and the colours of what people hold
const GV_PAST=[184,146,104],GV_HOLD={teal:[64,150,146],walnut:[156,110,74],navy:[66,86,128],gold:[232,176,52]};

PEOPLE.yusuf={name:"Yusuf Demir",role:"Data governance lead",side:"Business",does:"uses",edge:BIZ,seed:15,
  skin:[204,160,124],hair:{style:"side",c:[38,30,28]},beard:[44,34,30],
  top:{kind:"blazer",c:[150,84,62],inner:[236,232,222]},bottom:{c:[52,56,70]},shoe:[70,48,36],build:{sh:74,hip:60,h:1.0}};
PEOPLE.clara={name:"Clara Jensen",role:"Planning",side:"Business",does:"uses",edge:BIZ,seed:16,
  skin:[238,204,180],hair:{style:"bob",c:[170,120,70],streak:[214,176,120]},earrings:[255,214,140],
  top:{kind:"sweater",c:[226,160,70]},bottom:{c:[60,64,84]},shoe:[60,46,40],build:{sh:66,hip:60,h:0.96}};
PEOPLE.anil={name:"Anil Kurian",role:"Faculty of Health",side:"Business",does:"uses",edge:BIZ,seed:17,
  skin:[156,106,78],hair:{style:"cropped",c:[30,26,26]},
  top:{kind:"cardigan",c:[128,74,96],inner:[232,234,238]},bottom:{c:[112,100,82]},shoe:[58,42,34],build:{sh:72,hip:60,h:0.99}};
PEOPLE.marta={name:"Marta Nowak",role:"Wallet app team",side:"Technical",does:"uses",edge:TECH,seed:18,
  skin:[242,214,198],hair:{style:"long",c:[122,64,44]},glasses:[44,40,40],lanyard:TECH,
  top:{kind:"sweater",c:[214,198,170]},bottom:{c:[48,52,62]},shoe:[40,34,32],build:{sh:68,hip:60,h:0.97}};

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
  crier:{name:"",role:"the sheriff's crier",side:"",edge:GV_PAST,seed:31,skin:[226,184,154],hair:{style:"side",c:[120,84,52]},beard:[116,80,50],
    top:{kind:"gown",c:[60,84,140],inner:[226,214,190],belt:[96,64,40],band:[214,170,80],cape:[170,52,44]},bottom:{c:[60,60,70]},shoe:[60,42,30],build:{sh:74,hip:62,h:1.02}},
  vintner:{name:"",role:"wine seller",side:"",edge:GV_PAST,seed:32,skin:[232,190,160],hair:{style:"cropped",c:[60,44,34]},hat:"coif",hatC:[240,234,220],
    top:{kind:"tunic",c:[150,62,58],inner:[230,220,200],belt:[88,60,40],purse:true,apron:[236,226,206]},bottom:{c:[96,104,70]},shoe:[70,50,36],build:{sh:76,hip:64,h:1.0}},
  alewife:{name:"",role:"brewer",side:"",edge:GV_PAST,seed:33,skin:[236,196,170],hair:{style:"cropped",c:[150,96,56]},hat:"veil",hatC:[232,226,206],
    top:{kind:"gown",c:[184,150,72],inner:[236,228,210],belt:[110,74,44],apron:[240,234,220]},bottom:{c:[90,80,70]},shoe:[70,52,40],build:{sh:66,hip:62,h:0.95}},
  miller:{name:"",role:"corn seller",side:"",edge:GV_PAST,seed:34,skin:[214,170,136],hair:{style:"side",c:[52,40,32]},beard:[60,46,36],hat:"straw",hatC:[224,190,120],
    top:{kind:"tunic",c:[176,160,128],inner:[226,218,200],belt:[100,70,46]},bottom:{c:[88,72,60]},shoe:[66,48,34],build:{sh:78,hip:64,h:1.03}},
  buyer:{name:"",role:"townswoman",side:"",edge:GV_PAST,seed:35,skin:[200,150,118],hair:{style:"cropped",c:[40,30,26]},hat:"veil",hatC:[214,222,236],wimpleC:[246,244,238],
    top:{kind:"gown",c:[70,108,150],inner:[230,226,214],belt:[90,62,44],purse:true},bottom:{c:[70,70,80]},shoe:[60,44,34],build:{sh:64,hip:60,h:0.94}},
  // 1497: a clerk of the market in a furred gown and a bonnet; a trader in a hood
  clerk:{name:"",role:"clerk of the market",side:"",edge:GV_PAST,seed:36,skin:[230,190,160],hair:{style:"cropped",c:[90,64,44]},hat:"tudor",hatC:[44,40,46],
    top:{kind:"gown",c:[96,40,44],inner:[60,58,70],fur:[120,86,60]},bottom:{c:[50,46,56]},shoe:[40,32,28],build:{sh:74,hip:62,h:1.0}},
  trader:{name:"",role:"trader",side:"",edge:GV_PAST,seed:37,skin:[210,164,128],hair:{style:"side",c:[70,50,36]},beard:[80,58,40],hat:"hood",hatC:[120,130,90],
    top:{kind:"tunic",c:[150,120,84],inner:[220,210,190],belt:[96,66,44],purse:true},bottom:{c:[96,84,70]},shoe:[66,48,34],build:{sh:76,hip:64,h:1.0}},
  // the 1880s: an inspector of weights and measures, and a grocer
  inspector:{name:"",role:"inspector of weights and measures",side:"",edge:GV_PAST,seed:38,skin:[226,186,156],hair:{style:"side",c:[96,80,70]},beard:[110,92,80],hat:"top",hatC:[36,36,42],hatBand:[24,24,28],
    top:{kind:"frock",c:[48,52,66],vest:[110,96,80],inner:[246,244,238],tie:[30,28,34]},bottom:{c:[70,70,78]},shoe:[24,22,24],build:{sh:76,hip:62,h:1.02}},
  grocer:{name:"",role:"grocer",side:"",edge:GV_PAST,seed:39,skin:[232,196,168],hair:{style:"cropped",c:[60,46,36]},beard:[70,52,40],
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
  shrug:{L:[0.5,1.3],R:[0.5,1.3],hand:"open",feet:30,shift:0,tilt:0.08,turn:0,gaze:[0,0],look:0},
  // a step: the arms swing opposite ways, the stance narrows (people in these films face us, so a walk is a sway and a bob)
  walkA:{L:[0.34,0.3],R:[-0.26,-0.32],feet:14,shift:-5,tilt:0.03,turn:0.06,gaze:[0.3,0],look:0},
  walkB:{L:[-0.26,-0.32],R:[0.34,0.3],feet:14,shift:5,tilt:-0.03,turn:0.06,gaze:[0.3,0],look:0}
});
// where a hand is, in the figure's own units (it's 560 tall), for things it holds
function handAt(P_,s,a,br){const sw=P_.build.sh,sx=s*(sw-12),sy=-416+br,e=[sx+s*Math.sin(a[0])*108,sy+Math.cos(a[0])*108],d=[s*Math.sin(a[1]),Math.cos(a[1])],w=[e[0]+d[0]*100,e[1]+d[1]*100];return[w[0]+d[0]*13,w[1]+d[1]*13];}

// a person, drawn in pencil and wash by the master data series' outlined(), with what the toy figures could do: face the other way
// (o.flip), nod, hold something (o.carry, drawn in the figure's units at its hands, o.carryBehind to put it behind the arms), and room
// for an arm held out (o.wide) or a tall hat. A soft shadow on the paper, except while the white figure is cut from it (WC_RAW).
person=function(ctx,id,x,y,s,o){o=o||{};const P_=PEOPLE[id],po=blendPose(POSE[o.pose||"stand"],POSE[o.pose2],o.mix),E=o.E||EXPR[o.expr||"calm"],t=o.t||0,k=s*P_.build.h;
  const br=Math.sin(t*1.7+P_.seed)*1.4,front=a=>Math.abs(a[1])>Math.PI*0.55;
  if(!WC_RAW&&o.shadow!==false){ctx.save();ctx.translate(x,y);ctx.scale(k,k);const g=ctx.createRadialGradient(0,-4,4,0,-4,110);g.addColorStop(0,rgba([90,80,96],0.22));g.addColorStop(1,rgba([90,80,96],0));
    ctx.fillStyle=g;ell(ctx,0,-4,110,17);ctx.fill();ctx.restore();}
  outlined(ctx,cx=>{if(o.flip){cx.scale(-1,1);}
    if(!front(po.L))arm(cx,P_,-1,po.L,br,po);if(!front(po.R))arm(cx,P_,1,po.R,br,po);legs(cx,P_,po);
    limb(cx,[[0,-470+br],[0,-440+br]],30,30,darken(P_.skin,0.12),[-20,-470,20,-440]);torso(cx,P_,br,po.shift);
    cx.save();cx.translate(po.shift*0.2,-452+br);cx.rotate(po.tilt+(o.nod||0));cx.translate(0,-50+po.look*2);head(cx,P_,E,po,t);cx.restore();
    const hands=()=>[handAt(P_,-1,po.L,br),handAt(P_,1,po.R,br)];
    if(o.carry&&o.carryBehind){if(o.flip)cx.scale(-1,1);o.carry(cx,P_,o.flip?hands().map(h=>[-h[0],h[1]]):hands());if(o.flip)cx.scale(-1,1);}
    if(front(po.L))arm(cx,P_,-1,po.L,br,po);if(front(po.R))arm(cx,P_,1,po.R,br,po);
    if(o.carry&&!o.carryBehind){if(o.flip)cx.scale(-1,1);o.carry(cx,P_,o.flip?hands().map(h=>[-h[0],h[1]]):hands());if(o.flip)cx.scale(-1,1);}},
    x,y,k,P_.edge,[o.wide?-400:-250,P_.hat?-720:-650,o.wide?400:250,10],o.glow);};
// expressions in between: a little relief, a little worry
EXPR.worried={bi:-5,bo:3,arch:-0.5,knit:2.5,eye:0.95,smile:-0.6,open:0,mw:13};
EXPR.smile={bi:-1,bo:-2,arch:-3.5,eye:0.9,smile:0.8,open:0,mw:22};

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
  cx.fillStyle=rgba(GV_HOLD.teal,1);rr(cx,-86,-58,172,116,8);cx.fill();cx.fillStyle="#fffdf6";rr(cx,-80,-52,78,104,4);cx.fill();rr(cx,2,-52,78,104,4);cx.fill();
  cx.strokeStyle="rgba(120,130,160,0.5)";cx.lineWidth=2;for(let i=0;i<5;i++){cx.beginPath();cx.moveTo(-72,-36+i*18);cx.lineTo(-10,-36+i*18);cx.moveTo(10,-36+i*18);cx.lineTo(72-(i===4?30:0),-36+i*18);cx.stroke();}cx.restore();
  fingers(cx,P_,[[mx-84,my+12],[mx+84,my+8]]);}
// a clipboard held up, facing out: fn draws on its paper (in the figure's units, 200 x 250)
function heldBoard(fn){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-30);
  cx.fillStyle=rgba(GV_HOLD.walnut,1);rr(cx,-110,-140,220,280,12);cx.fill();cx.fillStyle="#fffdf6";rr(cx,-98,-120,196,250,6);cx.fill();cx.fillStyle="rgba(170,176,190,1)";rr(cx,-34,-152,68,26,6);cx.fill();
  if(fn)fn(cx);cx.restore();fingers(cx,P_,[[mx-108,my+10],[mx+108,my+6]]);};}
// a box of gold pins
function heldPins(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+10);
  cx.fillStyle=rgba(GV_HOLD.navy,1);rr(cx,-70,-24,140,52,8);cx.fill();cx.fillStyle=rgba(mix(GV_HOLD.navy,[255,255,255],0.2),1);rr(cx,-70,-24,140,14,6);cx.fill();
  for(let i=0;i<9;i++){const x=-56+i*14,y=-30-6*hash(i,4);cx.strokeStyle="rgba(120,110,90,1)";cx.lineWidth=2;cx.beginPath();cx.moveTo(x,y);cx.lineTo(x,y+18);cx.stroke();cx.fillStyle=rgba(GV_HOLD.gold,1);cx.beginPath();cx.arc(x,y,6,0,TAU);cx.fill();cx.fillStyle="rgba(255,250,220,0.8)";cx.beginPath();cx.arc(x-2,y-2,2,0,TAU);cx.fill();}
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

/* ===== The data governance series: the university's rooms, in watercolour =====
   The series paints with the master and reference data series' watercolour (its shared/src/wash.js and people.js, bundled as they
   are), so the two series look like one university. This file adds what the governance films need, all of it the university's own:
   the campus, Yusuf's office, the floor of offices behind glass where the work is done (Planning, the registrar's office, data
   governance, the data team, the platform team), the rooms where the numbers are made, and a desk seen from above for the papers;
   the places the later films share (the stewards' meeting room, the registrar's, the platform team's and a faculty analyst's desks
   close up, and Noor's room with her architecture map); then the things on their walls and desks (binders, papers, screens, cards,
   pins, stamps, speech bubbles), a camera that cuts between shots, and the series' title and end cards. The places are painted
   once and kept (finish.js); only what moves is drawn every frame.
   Every name starts with gv_ or GV, because every file of the film shares one script. */

/* ---------- colours ---------- */
// what the colours mean: gold is governance's decisions (and, behind a person, the business side, as in the master data series); cyan
// the technical side; green what runs in the work; grey what can go; red what nobody owns yet; amber a warning, something to look at
// that hasn't failed (an orange, so it reads apart from gold beside it)
const GV={gold:[236,170,34],goldInk:[146,96,0],green:[40,160,96],greenInk:[22,120,68],grey:[148,156,170],greyInk:[88,94,108],red:[204,62,50],redInk:[176,40,34],amber:[236,136,44],amberInk:[150,66,0],
  cyanInk:[24,104,168],wood:[198,152,106],woodDark:[146,104,72],oak:[222,186,138],cork:[208,166,114],metal:[166,172,184],bezel:[60,64,78],glass:[198,222,238],
  floor:[214,196,170],corridor:[230,224,212],ceiling:[246,242,234],chair:[84,92,112],paper:[253,252,248],screen:[248,250,252]};
// each room's walls: governance warm cream, Planning sage, the registrar's office blue, the data team lilac, the platform team pale teal;
// the meeting room a quiet stone, Noor's room a pale rose, a faculty's office in the old building warm plaster over dark panelling,
// and the learning team's office (Tom's) a soft apricot
const GV_ROOM={gov:[244,230,204],plan:[218,230,206],reg:[212,222,238],data:[226,218,238],plat:[206,230,226],meet:[228,224,214],noor:[238,222,224],fac:[242,228,204],learn:[248,218,192]};
// colours several films share, each with an ink for words on it: the three meanings of award (Who decides, One word, one home):
// violet the glossary's words, rose the words before Monday, olive degrees only; and the classes of personal data (Who may see it):
// plum for direct, a paler plum for pseudonymous (still personal, so the same family), plain paper for none
const GV_MEAN={violet:[110,92,190],rose:[214,96,140],olive:[150,156,56]},GV_MEANINK={violet:[78,58,160],rose:[168,50,98],olive:[94,100,22]};
const GV_CLASS={direct:[146,52,112],pseudonymous:[214,160,198],none:[250,248,242]},GV_CLASSINK={direct:[112,30,84],pseudonymous:[150,84,130]};

/* ---------- timing ---------- */
// when a word of a line is said: the line's start, plus the word's share of the line (a whole word: shared/tools/cues.py checks)
function wAt(sc,id,word,off){const ln=sc.vo.find(v=>v.id===id);if(!ln)return 0;const s=ln.say||ln.text,i=s.indexOf(word),d=sc.ends[id]-sc.cues[id];return sc.cues[id]+(i<0?0:d*i/s.length)+(off||0);}
// 0 to 1 from t0 over d seconds, and back to 0 from t1
const gv_io=(t,t0,t1,d)=>fin(t,t0,d||0.4)*(1-fin(t,t1,d||0.4));

/* ---------- the camera ---------- */
// keys are [time, x, y, zoom], each move eased over d seconds (1.4 at least); push closes in a little more, slowly; kept inside the frame
function gv_focus(ctx,t,keys,d,push){d=Math.max(1.4,d||1.6);let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z*(1+(push||0)));x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// one shot: its place under the camera, then what it draws on top, in the place's coordinates; the shot closes in slowly until the next
function gv_shot(ctx,S,t,sh,till){setScreen(ctx,S);ctx.save();const len=Math.max(1.5,till-sh.at),push=(sh.push==null?0.025:sh.push)*easeCam(clamp((t-sh.at)/len,0,1));
  const cam=gv_focus(ctx,t,sh.keys,sh.d,push);if(sh.place)ctx.drawImage(gv_place(sh.place),0,0,W,H);if(sh.draw)sh.draw(ctx,t,cam);ctx.restore();setScreen(ctx,S);}
// a chapter cut into shots, [{at, place, keys, draw, push, d}]: each dissolves in from the one before over dis seconds; returns the shot
function gv_shots(ctx,S,t,end,shots,dis){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;dis=dis==null?0.5:dis;const u=i>0?clamp((t-shots[i].at)/dis,0,1):1,
    till=k=>shots[k+1]?shots[k+1].at:end;
  if(u<1){gv_shot(ctx,S,t,shots[i-1],shots[i].at);const [bc,bx]=wc_buf("cut",ctx.canvas.width,ctx.canvas.height);gv_shot(bx,S,t,shots[i],till(i));
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ease(u);ctx.drawImage(bc,0,0);ctx.restore();setScreen(ctx,S);}
  else gv_shot(ctx,S,t,shots[i],till(i));return i;}
// a place, painted once by the film's painter (WC_PLACES), and kept
function gv_place(key){return wc_kept("place:"+key,W,H,WC_PLACES[key]);}

/* ---------- rooms ---------- */
// a room's back wall to fy, its floor boards running away from us, and a skirting board
function gv_wallFloor(ctx,wall,fy,o){o=o||{};const fl=o.floor||GV.floor;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,fy+40),wall,{kind:"plaster",line:false,seed:o.seed||3});
  wc_wash(ctx,wc_rect(-40,fy,W+80,H-fy+40),fl,{kind:"ground",line:false,seed:(o.seed||3)+5});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(fl,0.2),0.3);ctx.lineWidth=2;const vx=o.vx||960;for(let i=-16;i<=16;i++){ctx.beginPath();ctx.moveTo(vx+i*64,fy);ctx.lineTo(vx+i*210,H+40);ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_rect(-40,fy-18,W+80,20),wc_dim(wall,0.16),{kind:"trim",line:false,flat:true});}
// a window onto the campus: the sky, the old building's clock tower among trees, the lawn; then its frame, a bar each way, and the sill
function gv_window(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const hz=y+h*0.72;
  wc_sky(ctx,hz,o.seed||4,{clouds:2,cx:x+10,cw:Math.max(40,w-120),cy:y+24,ch:h*0.22});
  wc_land(ctx,xx=>hz+6*Math.sin(xx/80+x),WCP.far,0.3,{line:false});
  if(o.tower!==false){const tx=x+w*(o.tx||0.64),th=h*0.46;wc_part(ctx,wc_rect(tx-24,hz-th,48,th+12),WCP.stone,0.42);wc_part(ctx,[[tx-30,hz-th],[tx+30,hz-th],[tx,hz-th-h*0.14]],WCP.slate,0.42);
    wc_wash(ctx,wc_ell(tx,hz-th+30,11,11,20),WCP.clock,{depth:0.42,kind:"clock",lw:1.2});wc_part(ctx,wc_rect(x+w*0.08,hz-h*0.16,w*0.4,h*0.16+12),WCP.stone,0.36);}
  wc_land(ctx,xx=>hz+34+6*Math.sin(xx/120),WCP.lawn,0.5,{line:false});
  wc_roundTree(ctx,x+w*0.16,hz+44,h*0.36,0.5);wc_roundTree(ctx,x+w*0.9,hz+56,h*0.3,0.5,WCP.leaf2);ctx.restore();
  const f=16;for(const r of [wc_rect(x-f,y-f,w+2*f,f),wc_rect(x-f,y-f,f,h+2*f),wc_rect(x+w,y-f,f,h+2*f),wc_rect(x+w/2-6,y,12,h),wc_rect(x,y+h*0.42-6,w,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(x-30,y+h,w+60,24),wc_dim(o.wall||GV_ROOM.gov,0.1),{kind:"trim",lw:1.5});}
// a door to the corridor: its frame, the door, a narrow pane of glass and a handle; fy is the floor
function gv_door(ctx,x,fy,w,h,col){wc_wash(ctx,wc_rect(x-16,fy-h-16,w+32,h+16),WC_PAPER,{kind:"trim",lw:1.5});wc_wash(ctx,wc_rect(x,fy-h,w,h),col,{kind:"door",lw:1.6});
  wc_flat(ctx,wc_rect(x+w*0.3,fy-h+h*0.1,w*0.4,h*0.36),GV.glass,1,"window");wc_wash(ctx,wc_rect(x+w-36,fy-h*0.5,22,10),GV.metal,{kind:"thing",lw:1.2});}
// a desk from the front: its top at y, on the floor at fy; legs, a panel, and a pedestal of drawers
function gv_desk(ctx,x,y,w,fy,o){o=o||{};const col=o.col||GV.oak;wc_contact(ctx,x-20,x+w+20,fy+2,0.9,0.3);
  wc_part(ctx,wc_rect(x+26,y+20,w-52,(fy-y)*0.62),wc_dim(col,0.14),1);for(const lx of [x+8,x+w-34])wc_part(ctx,wc_rect(lx,y+18,26,fy-y-18),wc_dim(col,0.22),1);
  if(o.drawers!==false){const dx=o.left?x+30:x+w-206;wc_part(ctx,wc_rect(dx,y+18,176,fy-y-18),col,1);for(let i=0;i<3;i++){const dy=y+40+i*(fy-y-40)/3;wc_flat(ctx,wc_rect(dx+60,dy+18,56,8),wc_dim(col,0.4),1,"handle");}}
  wc_part(ctx,wc_rect(x-8,y,w+16,24),wc_lit(col,0.12),1);}
// an office chair's back, seen over a desk
function gv_chair(ctx,cx,y,o){o=o||{};wc_part(ctx,wc_rrPts(cx-74,y,148,o.h||150,26),o.col||GV.chair,1);}
// a bookcase on the floor at fy: its back, shelves at the given heights, sides and plinth
function gv_bookcase(ctx,x,fy,w,h,shelves,o){o=o||{};const col=o.col||GV.wood,top=fy-h;wc_contact(ctx,x-10,x+w+10,fy+2,0.9,0.25);
  wc_part(ctx,wc_rect(x,top,w,h),wc_dim(col,0.3),1,{lw:1.2});for(const sy of shelves)wc_part(ctx,wc_rect(x+14,sy,w-28,16),wc_lit(col,0.06),1);
  wc_part(ctx,wc_rect(x-10,top-16,w+20,20),col,1);wc_part(ctx,wc_rect(x-6,top,22,h),col,1);wc_part(ctx,wc_rect(x+w-16,top,22,h),col,1);wc_part(ctx,wc_rect(x-6,fy-26,w+12,26),wc_dim(col,0.06),1);}
// a screen's frame and its stand; what it shows is drawn every frame (gv_screen)
function gv_monitor(ctx,x,y,w,h,o){o=o||{};if(o.stand!==false){wc_part(ctx,[[x+w/2-16,y+h+8],[x+w/2+16,y+h+8],[x+w/2+22,y+h+56],[x+w/2-22,y+h+56]],GV.metal,1);
    wc_part(ctx,wc_rect(x+w/2-78,y+h+52,156,14),GV.metal,1);}wc_part(ctx,wc_rect(x-12,y-12,w+24,h+24),GV.bezel,1,{kind:"thing"});wc_flat(ctx,wc_rect(x,y,w,h),[230,234,240],1,"screen");}
// a cork board in a wooden frame, speckled
function gv_cork(ctx,x,y,w,h,fw){fw=fw||14;const k=fw/14;wc_part(ctx,wc_rect(x-fw,y-fw,w+2*fw,h+2*fw),GV.woodDark,1);wc_wash(ctx,wc_rect(x,y,w,h),GV.cork,{kind:"build",lw:1.1,seed:x|0});
  const R=wc_rng(x|0);ctx.save();for(let i=0;i<w*h/(260*k*k);i++){ctx.fillStyle=rgba(wc_dim(GV.cork,0.25+R()*0.2),0.35);ctx.beginPath();ctx.arc(x+R()*w,y+R()*h,(0.8+R()*1.6)*k,0,TAU);ctx.fill();}ctx.restore();}
// a plant in a pot, on the floor at fy
function gv_plant(ctx,x,fy,s){s=s||1;wc_contact(ctx,x-50*s,x+50*s,fy+2,0.9,0.25);const R=wc_rng(Math.round(x)),parts=[];for(let i=0;i<9;i++){const a=-Math.PI*0.5+(R()-0.5)*2.2,r=60*s+R()*70*s;
    parts.push(wc_ell(x+Math.cos(a)*r*0.7,fy-150*s+Math.sin(a)*r*0.9,(18+R()*14)*s,(42+R()*20)*s,18));}
  wc_wash(ctx,parts,WCP.leaf,{kind:"tree",seed:Math.round(x)});wc_part(ctx,[[x-46*s,fy-110*s],[x+46*s,fy-110*s],[x+36*s,fy],[x-36*s,fy]],[200,126,96],1);}
// a frame on the wall, with a paper mount; what's in it is drawn every frame
function gv_frame(ctx,x,y,w,h){wc_part(ctx,wc_rect(x-14,y-14,w+28,h+28),GV.woodDark,1);wc_flat(ctx,wc_rect(x,y,w,h),WC_CARD,1,"mount");}
// a ceiling light's glow on the wall
function gv_lightGlow(ctx,x,y,r){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,r,[255,246,222],0.5);ctx.restore();}

/* ---------- the university's places ---------- */
// The campus: the old sandstone building with its clock tower and glass wing, the newer building where the offices are, lawns, a
// path to its door. Nothing but the university's own.
const GV_CP={fy:742,door:[1462,742],path:[[700,1090],[900,980],[1160,880],[1380,800],[1462,750]]};
function gv_paintCampus(ctx){const P=WCP;wc_sky(ctx,700,8,{sun:[1640,160],cx:120,cw:1500});
  wc_forest(ctx,x=>620+12*Math.sin(x/230)+6*Math.sin(x/70),P.farForest,0.08,5,{h:34,w:22});wc_treeRow(ctx,()=>640,-40,1980,62,74,0.22,21,P.leaf2);
  wc_land(ctx,x=>660+5*Math.sin(x/300),P.lawn,0.42);
  wc_contact(ctx,30,640,668,0.46,0.22);wc_quad(ctx,40,668,0.46,0.6);wc_glassWing(ctx,628,668,140,160,0.48);
  // the newer building: a frame of pale concrete, bands of glass, a canopy over the door
  const bx=1040,bw=780,top=300,by=GV_CP.fy;wc_contact(ctx,bx-20,bx+bw+20,by+4,0.6,0.3);wc_part(ctx,wc_rect(bx,top,bw,by-top),P.concrete,0.6);
  for(let r=0;r<4;r++){const ry=top+40+r*100;wc_part(ctx,wc_rect(bx+30,ry,bw-60,64),P.glass,0.6,{kind:"glass"});
    ctx.save();ctx.strokeStyle=rgba(wc_dim(P.glass,0.35),0.6);ctx.lineWidth=3;for(let i=1;i<10;i++){ctx.beginPath();ctx.moveTo(bx+30+i*(bw-60)/10,ry);ctx.lineTo(bx+30+i*(bw-60)/10,ry+64);ctx.stroke();}ctx.restore();}
  wc_part(ctx,wc_rect(bx-14,top-20,bw+28,24),wc_lit(P.concrete,0.1),0.6);
  const [dx]=GV_CP.door;wc_part(ctx,wc_rect(dx-70,by-150,140,150),P.glass,0.62,{kind:"glass"});wc_part(ctx,wc_rect(dx-110,by-176,220,22),P.slate,0.62);
  wc_roundTree(ctx,980,700,230,0.5);wc_roundTree(ctx,1870,712,210,0.5,P.leaf2);
  wc_wash(ctx,[[-60,766],[W+60,754],[W+60,H+60],[-60,H+60]],P.lawn,{depth:0.7,kind:"ground",line:false});
  wc_wash(ctx,wc_band(wc_smooth(GV_CP.path,8),260,46),P.paving,{depth:0.66,kind:"path",line:false});
  wc_lamp(ctx,860,960,320,0.8);wc_lamp(ctx,1690,820,240,0.66);wc_tufts(ctx,x=>760,0,620,40,0.9,6);}

// Yusuf's office: a door to the corridor, a window onto the campus, the chart pinned to a board, the framed score, his desk and chair,
// the shelf of binders. GV_OFF says where each is, for the scenes.
const GV_OFF={fy:850,door:[50,250,520],win:[318,150,330,430],board:[690,150,410,410],score:[1150,200,176,136],
  shelf:{x:1366,w:510,h:690,rows:[372,542,712]},desk:[700,664,600],chair:1000,plant:1318};
function gv_paintOffice(ctx){const O=GV_OFF,wall=GV_ROOM.gov;gv_wallFloor(ctx,wall,O.fy,{seed:11,vx:900});gv_lightGlow(ctx,960,0,520);
  gv_door(ctx,O.door[0],O.fy,O.door[1]-O.door[0],O.door[2],[176,140,108]);gv_window(ctx,O.win[0],O.win[1],O.win[2],O.win[3],{wall,seed:6});
  gv_cork(ctx,O.board[0],O.board[1],O.board[2],O.board[3]);gv_frame(ctx,O.score[0],O.score[1],O.score[2],O.score[3]);
  const S=O.shelf;gv_bookcase(ctx,S.x,O.fy,S.w,S.h,S.rows.concat([O.fy-40]),{});
  // the top shelf's books and boxes, which never move
  const R=wc_rng(9);let bx=S.x+30;while(bx<S.x+S.w-60){const bw=26+R()*22,bh=110+R()*40;wc_part(ctx,wc_rect(bx,S.rows[0]-bh,bw,bh),[[150,90,80],[96,118,150],[120,140,104],[196,170,120]][Math.floor(R()*4)],1,{lw:1.2});bx+=bw+4;
    if(R()<0.15){wc_part(ctx,wc_rect(bx+6,S.rows[0]-80,120,80),[214,196,160],1);bx+=130;}}
  // under the shelves, a cupboard: two doors and their knobs
  for(const j of [0,1]){const dx=S.x+22+j*(S.w/2-18);wc_part(ctx,wc_rect(dx,S.rows[2]+20,S.w/2-26,O.fy-62-S.rows[2]),wc_lit(GV.wood,0.05),1);
    wc_wash(ctx,wc_ell(dx+(j?22:S.w/2-48),S.rows[2]+62,6,6,12),GV.metal,{kind:"thing",lw:1});}
  gv_plant(ctx,O.plant,O.fy,0.9);gv_chair(ctx,O.chair,O.desk[1]-130);gv_desk(ctx,O.desk[0],O.desk[1],O.desk[2],O.fy+6,{left:true});
  // on the desk: a tray of papers and a pot of pens
  const dx=O.desk[0]+O.desk[2];wc_part(ctx,wc_rect(dx-210,O.desk[1]-30,120,30),[226,218,204],1);wc_flat(ctx,wc_rect(dx-200,O.desk[1]-38,100,10),WC_CARD,1,"papers");
  wc_part(ctx,[[dx-70,O.desk[1]],[dx-30,O.desk[1]],[dx-34,O.desk[1]-58],[dx-66,O.desk[1]-58]],[96,118,150],1);
  for(const [px,a,c] of [[-58,-0.2,[60,60,70]],[-48,0.1,[204,62,50]],[-40,0.25,[60,60,70]]]){ctx.save();ctx.translate(dx+px,O.desk[1]-56);ctx.rotate(a);wc_flat(ctx,wc_rect(-2,-40,5,42),c,1,"pen");ctx.restore();}}

// The newest DMBOK (the second edition, revised, 2024), standing on Yusuf's desk against the tray of papers, where the prologue sets
// it down before his first day; every film that shows his office draws it there (not from above: it stands at the desk's end, beside
// the tray, out of the close-ups' frame). A navy cover, its rules and words, the pages' edge: the cover kept, drawn small, so its
// words are decoration. The prologue draws its own copy, the same, as two hands bring it in.
const GV_DMB={x:1034,k:0.34,w:320,h:440,col:[46,58,88]};
function gv_deskBookC(){const D=GV_DMB,w=D.w,h=D.h;return wc_kept("gvDeskBook",w+80,h+80,q=>{q.translate(40,40);
  q.save();q.filter="blur(12px)";q.fillStyle="rgba(40,22,12,0.45)";q.fillRect(-18,16,w,h);q.restore();
  wc_flat(q,wc_rect(8,-8,w,h),[236,228,206],1,"pages");q.strokeStyle="rgba(150,136,112,0.5)";q.lineWidth=1.2;
  for(let i=1;i<4;i++){q.beginPath();q.moveTo(10,-8+i*2);q.lineTo(w+6,-8+i*2);q.stroke();q.beginPath();q.moveTo(w+8-i*2,-6);q.lineTo(w+8-i*2,h-10);q.stroke();}
  wc_wash(q,wc_rrPts(0,0,w,h,8),D.col,{kind:"cover",lw:1.5,seed:443});wc_flat(q,wc_rect(0,4,22,h-8),wc_dim(D.col,0.25),1,"spine");
  for(const ry of [86,318])wc_flat(q,wc_rect(48,ry,w-80,4),[226,214,180],0.9,"rule");});}
function gv_deskBook(ctx){const D=GV_DMB,h=D.h,T=(s,y,w,size,col)=>wc_T(ctx,s,11,y-h,{w,size,align:"center",col,deco:true});
  ctx.save();ctx.translate(D.x,GV_OFF.desk[1]);ctx.rotate(0.05);ctx.scale(D.k,D.k);ctx.drawImage(gv_deskBookC(),-D.w/2-40,-h-40);
  T("DAMA-DMBOK",160,800,40,[246,238,214]);T("Data Management",226,600,28,[226,232,226]);T("Body of Knowledge",266,600,28,[226,232,226]);
  T("Second Edition",364,600,28,[236,226,200]);T("Revised",402,600,28,[236,226,200]);ctx.restore();}

// The floor where the work is done, from the corridor: five offices behind glass, each with its name on the glass. GV_FL gives each
// office's left edge and its person's spot; the people are drawn every frame, then the glass over them (gv_floorGlass), then the names.
const GV_FL={fy:830,top:140,inner:700,rooms:[["plan","Planning"],["reg","Registrar's office"],["gov","Data governance"],["data","Data team"],["plat","Platform team"]],
  x:i=>i*384+16,w:352,spot:i=>i*384+16+(i%2?120:236),walk:905};
function gv_paintFloor(ctx){const F=GV_FL;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,F.top+40),GV.ceiling,{kind:"plaster",line:false,seed:3});
  F.rooms.forEach(([k],i)=>{const x=F.x(i),w=F.w,wall=GV_ROOM[k],odd=i%2;
    // inside: the room's back wall and floor, a window, a desk and a screen, and what each office has of its own
    wc_wash(ctx,wc_rect(x,F.top,w,F.inner-F.top),wall,{kind:"plaster",line:false,seed:7+i*5});wc_wash(ctx,wc_rect(x,F.inner,w,F.fy-F.inner),wc_lit(GV.floor,0.12),{kind:"ground",line:false,seed:9+i});
    wc_flat(ctx,wc_rect(x,F.inner-10,w,12),wc_dim(wall,0.16),1,"skirting");
    const wx=odd?x+w-170:x+34;gv_window(ctx,wx,F.top+130,136,190,{wall,seed:20+i,tx:0.5,tower:i===2});
    const ox=odd?x+20:x+w-176,oy=F.top+140;
    // Planning: a chart of this year's numbers; the registrar's office: archive boxes on a shelf; data governance: two shelves of
    // binders; the data team: a whiteboard, written on; the platform team: a rack of servers under the window
    if(k==="plan"){wc_part(ctx,wc_rect(ox+6,oy,150,120),WC_CARD,0.9,{lw:1.2});[0.5,0.7,0.45,0.85,0.62].forEach((v,j)=>wc_flat(ctx,wc_rect(ox+26+j*24,oy+104-v*80,16,v*80),j===4?GV.gold:[140,176,210],0.9,"bar"));}
    if(k==="reg"){wc_part(ctx,wc_rect(ox,oy+96,160,10),GV.wood,0.9);for(let j=0;j<3;j++){wc_part(ctx,wc_rect(ox+8+j*50,oy+34,44,62),[214,200,170],0.9,{lw:1.1});wc_flat(ctx,wc_rect(ox+18+j*50,oy+48,24,12),WC_CARD,0.9,"label");}}
    if(k==="gov")for(const sy of [oy+60,oy+150]){wc_part(ctx,wc_rect(ox,sy,160,10),GV.wood,0.9);for(let j=0;j<9;j++)wc_part(ctx,wc_rect(ox+6+j*17,sy-64,14,64),[[96,118,150],[150,90,80],[120,140,104],[186,160,110]][j%4],0.9,{lw:1});}
    if(k==="data"){wc_part(ctx,wc_rect(ox,oy,160,116),[248,248,246],0.9,{lw:1.2});ctx.save();ctx.lineWidth=3;ctx.lineCap="round";
      [[[24,30],[70,30]],[[24,52],[110,52]],[[24,74],[90,74]],[[118,40],[140,60]],[[140,60],[118,88]]].forEach(([a,b],j)=>{ctx.strokeStyle=rgba(j>2?[204,62,50]:[60,110,170],0.7);ctx.beginPath();ctx.moveTo(ox+a[0],oy+a[1]);ctx.lineTo(ox+b[0],oy+b[1]);ctx.stroke();});ctx.restore();}
    if(k==="plat"){const rx=x+44,ry=F.inner-236;wc_part(ctx,wc_rect(rx,ry,74,236),[70,76,90],0.9);for(let j=0;j<6;j++){wc_flat(ctx,wc_rect(rx+8,ry+12+j*36,58,26),[96,104,120],0.9,"unit");
      [[120,220,160],[120,200,255]].forEach((c,l)=>{ctx.fillStyle=rgba(c,0.85);ctx.beginPath();ctx.arc(rx+18+l*12,ry+25+j*36,3,0,TAU);ctx.fill();});}}
    const dx=odd?x+20:x+w-190;wc_part(ctx,wc_rect(dx,F.inner-120,170,16),wc_lit(GV.oak,0.1),0.9);wc_part(ctx,wc_rect(dx+10,F.inner-104,14,104),wc_dim(GV.oak,0.2),0.9);wc_part(ctx,wc_rect(dx+146,F.inner-104,14,104),wc_dim(GV.oak,0.2),0.9);
    wc_part(ctx,wc_rect(dx+50,F.inner-212,92,62),GV.bezel,0.9,{kind:"thing"});wc_flat(ctx,wc_rect(dx+56,F.inner-206,80,50),[226,232,240],0.9,"screen");wc_part(ctx,wc_rect(dx+90,F.inner-150,12,30),GV.metal,0.9);});
  // the walls between the offices
  for(let i=0;i<=5;i++){const x=i*384-4;wc_part(ctx,wc_rect(x,F.top-6,24,F.fy-F.top+6),GV.ceiling,1,{lw:1.3});}
  // the corridor's floor, and a long rug where people walk
  wc_wash(ctx,wc_rect(-40,F.fy,W+80,H-F.fy+40),GV.corridor,{kind:"ground",line:false,seed:31});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(GV.corridor,0.18),0.32);ctx.lineWidth=2;for(let i=-16;i<=16;i++){ctx.beginPath();ctx.moveTo(960+i*64,F.fy);ctx.lineTo(960+i*190,H+40);ctx.stroke();}ctx.restore();
  wc_wash(ctx,[[-60,F.fy+28],[W+60,F.fy+28],[W+60,F.fy+100],[-60,F.fy+100]],[176,190,206],{kind:"ground",line:false,seed:33,a:0.75});
  for(let i=0;i<5;i++)gv_lightGlow(ctx,192+i*384,F.top-10,300);}
// the glass in front of the offices, over the people inside: a pale wash, light across it, the door's edge and handle, a bottom rail
function gv_floorGlass(ctx){const F=GV_FL;ctx.drawImage(wc_kept("floorGlass",W,H,c=>{F.rooms.forEach(([k],i)=>{const x=F.x(i),w=F.w,h=F.fy-F.top;
    c.save();c.globalAlpha=0.16;c.fillStyle=rgba(GV.glass,1);c.fillRect(x,F.top,w,h);c.restore();
    c.save();c.beginPath();c.rect(x,F.top,w,h);c.clip();c.globalCompositeOperation="screen";for(const [o,ww] of [[0.16,70],[0.34,24],[0.72,46]]){const g=c.createLinearGradient(x+w*o,0,x+w*o+ww,0);
      g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(0.5,"rgba(255,255,255,0.16)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.beginPath();c.moveTo(x+w*o,F.top);c.lineTo(x+w*o+ww,F.top);c.lineTo(x+w*o+ww-160,F.fy);c.lineTo(x+w*o-160,F.fy);c.closePath();c.fill();}c.restore();
    const dx=i%2?x+w-96:x+96;c.save();c.strokeStyle=rgba(GV.metal,0.9);c.lineWidth=3;c.beginPath();c.moveTo(dx,F.top);c.lineTo(dx,F.fy);c.stroke();c.lineWidth=6;c.lineCap="round";c.beginPath();c.moveTo(dx+(i%2?14:-14),F.top+330);c.lineTo(dx+(i%2?14:-14),F.top+420);c.stroke();c.restore();});
  wc_wash(c,wc_rect(-20,F.fy-14,W+40,16),GV.metal,{kind:"trim",lw:1.2});wc_wash(c,wc_rect(-20,F.top-8,W+40,14),GV.metal,{kind:"trim",lw:1.2});}),0,0);}
// an office's name on its glass, on a frosted band
function gv_floorName(ctx,i,a){if(a<=0.01)return;const F=GV_FL,x=F.x(i),name=F.rooms[i][1];withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(255,255,255,0.62)";ctx.fillRect(x+12,F.top+28,F.w-24,56);ctx.restore();
  wc_T(ctx,name,x+F.w/2,F.top+67,{w:800,size:30,align:"center",col:WC_DARK});});}

// The data team's room: a window, the cork board where the reports go, the poster of the loop they build in, Jun's desk and two
// screens.
const GV_DT={fy:856,win:[70,150,330,440],board:[450,150,430,380],poster:[920,130,560,360],desk:[1470,668,430],mon:[[1490,474,180,126],[1690,474,180,126]]};
function gv_paintData(ctx,o){const D=GV_DT,wall=GV_ROOM.data;gv_wallFloor(ctx,wall,D.fy,{seed:21,vx:1000});gv_lightGlow(ctx,980,0,560);
  gv_window(ctx,D.win[0],D.win[1],D.win[2],D.win[3],{wall,seed:12,tx:0.4});gv_cork(ctx,D.board[0],D.board[1],D.board[2],D.board[3]);
  gv_poster(ctx,D.poster[0],D.poster[1],D.poster[2],D.poster[3],o);
  gv_chair(ctx,1690,D.desk[1]-128,{col:[96,84,120]});gv_desk(ctx,D.desk[0],D.desk[1],D.desk[2],D.fy+6,{});D.mon.forEach(m=>gv_monitor(ctx,m[0],m[1],m[2],m[3]));
  gv_plant(ctx,428,D.fy,0.6);}
// the data team's poster: how they build, in ten steps round a loop (In the weeds of data crafting's loop, as they'd pin it up), from
// a question to a new version. Drawn for a poster 1260 wide (the close-up) and scaled to any other size; gv_loopPos says where step i is.
// The series' first two parts show no technical words, and a step's name ("review · ship") or mark ("PR") is one: so by default each
// name is a grey bar for each word, as text reads from across a room, and each step shows its number. A film of the third part, which
// builds it in the tools, passes {words:true} for the names and marks (to gv_paintData, gv_paintPosterClose or gv_poster).
const GV_LOOPC=[96,160,176];
// a name too far off to read: a rounded grey bar as long as each word, a dot for a "·", on the line where the words would sit
function gv_wordBars(ctx,s,x,y,size,align){ctx.save();ctx.font=font(700,size);const sp=ctx.measureText(" ").width,ws=s.split(" "),
  wd=ws.map(t=>t==="·"?size*0.24:ctx.measureText(t).width),tot=wd.reduce((p,q)=>p+q,0)+sp*(ws.length-1),hh=size*0.42,cy=y-size*0.34;
  let bx=align==="center"?x-tot/2:align==="right"?x-tot:x;ctx.fillStyle=ctx.strokeStyle=rgba(WC_MUTED,0.46);ctx.lineWidth=hh;ctx.lineCap="round";
  ws.forEach((t,i)=>{ctx.beginPath();if(t==="·"){ctx.arc(bx+wd[i]/2,cy,size*0.1,0,TAU);ctx.fill();}
    else{ctx.moveTo(bx+hh/2,cy);ctx.lineTo(bx+Math.max(hh/2,wd[i]-hh/2),cy);ctx.stroke();}bx+=wd[i]+sp;});ctx.restore();}
function gv_loopPos(i,x,y,w,h){const k=w/1260,an=-Math.PI/2+i/10*TAU;return[x+w/2+Math.cos(an)*330*k,y+h*450/810+Math.sin(an)*270*k];}
function gv_loopArt(ctx,x,y,w,h,o){const k=w/1260,cx=x+w/2,cy=y+h*450/810,words=!!(o&&o.words);
  wc_T(ctx,"How we build",cx,y+86*k,{w:800,size:50*k,align:"center",col:WC_DARK});
  // the loop: a pencil line round it, a chevron between each two steps, going round clockwise
  ctx.save();ctx.strokeStyle=rgba(wc_dim(GV_LOOPC,0.2),0.6);ctx.lineWidth=3.2*k;ctx.setLineDash([3*k,11*k]);ctx.lineCap="round";ctx.beginPath();ctx.ellipse(cx,cy,330*k,270*k,0,0,TAU);ctx.stroke();ctx.restore();
  for(let i=0;i<10;i++){const an=-Math.PI/2+(i+0.5)/10*TAU,px=cx+Math.cos(an)*330*k,py=cy+Math.sin(an)*270*k,d=Math.atan2(Math.cos(an)*270,-Math.sin(an)*330);
    ctx.save();ctx.translate(px,py);ctx.rotate(d);ctx.strokeStyle=rgba(wc_dim(GV_LOOPC,0.3),0.8);ctx.lineWidth=3.4*k;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-7*k,-9*k);ctx.lineTo(4*k,0);ctx.lineTo(-7*k,9*k);ctx.stroke();ctx.restore();}
  // each step: a chip with its mark (or its number), and its name (or its bars) outside the loop
  STEPS10.forEach(([nm,sym],i)=>{const [sx,sy]=gv_loopPos(i,x,y,w,h),an=-Math.PI/2+i/10*TAU,c=Math.cos(an),s=Math.sin(an),r=30*k,mk=words?sym:String(i+1);
    wc_wash(ctx,wc_ell(sx,sy,r,r,28),wc_lit(GV_LOOPC,0.5),{kind:"thing",lw:1.4*Math.max(0.6,k),seed:40+i});
    wc_T(ctx,mk,sx,sy+(mk.length>1?8:10)*k,{w:800,size:(mk.length>2?21:mk.length>1?24:28)*k,align:"center",col:wc_dim(GV_LOOPC,0.55)});
    const top=i===0,bot=i===5,al=top||bot?"center":c>0?"left":"right",nx=top||bot?sx:sx+(c>0?1:-1)*(r+16*k),ny=top?sy-r-16*k:bot?sy+r+40*k:sy+10*k;
    if(words)wc_T(ctx,nm,nx,ny,{w:700,size:29*k,align:al,col:WC_INK});else gv_wordBars(ctx,nm,nx,ny,29*k,al);});}
// the poster on the wall: paper, a pin in each top corner, the loop
function gv_poster(ctx,x,y,w,h,o){const k=w/1260;ctx.save();ctx.filter="blur("+Math.max(2,8*k)+"px)";ctx.fillStyle="rgba(70,60,50,0.18)";ctx.fillRect(x+8*k,y+12*k,w,h);ctx.restore();
  wc_wash(ctx,wc_rect(x,y,w,h),[251,250,245],{kind:"paper",lw:Math.max(1,1.6*k),seed:5});gv_loopArt(ctx,x,y,w,h,o);for(const px of [x+30*k,x+w-30*k])gv_pin(ctx,px,y+28*k,GV.red,Math.max(0.5,1.5*k));}

// The platform team's room: two racks of servers, a whiteboard of what's connected to what, a desk and two screens, a window.
const GV_PF={fy:856,win:[1500,150,330,430],rack:[[80,250,170,606],[262,250,170,606]],board:[540,190,420,300],desk:[1000,668,520],mon:[[1060,470,190,130],[1290,470,190,130]]};
// a rack of servers: a dark cabinet, its units, a green and a blue light on each
function gv_rack(ctx,x,y,w,h,seed){wc_contact(ctx,x-10,x+w+10,y+h+2,0.9,0.3);wc_part(ctx,wc_rect(x,y,w,h),[70,76,90],1,{seed});const n=Math.floor((h-40)/52);
  for(let j=0;j<n;j++){const uy=y+22+j*52;wc_flat(ctx,wc_rect(x+14,uy,w-28,40),[96,104,120],1,"unit");ctx.save();ctx.strokeStyle="rgba(40,44,54,0.5)";ctx.lineWidth=2;for(let v=0;v<5;v++){ctx.beginPath();ctx.moveTo(x+70+v*12,uy+10);ctx.lineTo(x+70+v*12,uy+30);ctx.stroke();}ctx.restore();
    [[120,220,160],[120,200,255]].forEach((c,l)=>{ctx.fillStyle=rgba(c,0.9);ctx.beginPath();ctx.arc(x+30+l*18,uy+20,4.5,0,TAU);ctx.fill();});}}
// a whiteboard, written on in marker: boxes and the arrows between them
function gv_whiteboard(ctx,x,y,w,h){wc_part(ctx,wc_rect(x-10,y-10,w+20,h+20),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(x,y,w,h),[250,251,250],1,"board");
  ctx.save();ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";const k=w/420,box=(bx,by,bw,bh,c)=>{ctx.strokeStyle=rgba(c,0.75);ctx.beginPath();ctx.rect(x+bx*k,y+by*k,bw*k,bh*k);ctx.stroke();};
  box(30,40,110,64,[60,110,170]);box(250,30,130,70,[60,110,170]);box(150,180,130,70,[40,140,90]);
  ctx.strokeStyle=rgba([204,62,50],0.75);[[[140,72],[250,64]],[[86,104],[180,180]],[[316,100],[250,180]]].forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(x+a[0]*k,y+a[1]*k);ctx.lineTo(x+b[0]*k,y+b[1]*k);ctx.stroke();});
  ctx.strokeStyle=rgba([60,60,70],0.5);ctx.lineWidth=3;for(const [bx,by,bw] of [[44,66,70],[264,58,90],[166,208,90]]){ctx.beginPath();ctx.moveTo(x+bx*k,y+by*k);ctx.lineTo(x+(bx+bw)*k,y+by*k);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(x+w*0.3,y+h+10,w*0.4,12),GV.metal,1);}
function gv_paintPlatform(ctx){const P=GV_PF,wall=GV_ROOM.plat;gv_wallFloor(ctx,wall,P.fy,{seed:61,vx:960});gv_lightGlow(ctx,960,0,540);
  gv_window(ctx,P.win[0],P.win[1],P.win[2],P.win[3],{wall,seed:18,tx:0.5});P.rack.forEach((r,i)=>gv_rack(ctx,r[0],r[1],r[2],r[3],7+i));
  gv_whiteboard(ctx,P.board[0],P.board[1],P.board[2],P.board[3]);
  gv_chair(ctx,1260,P.desk[1]-128,{col:[70,96,110]});gv_desk(ctx,P.desk[0],P.desk[1],P.desk[2],P.fy+6,{});P.mon.forEach(m=>gv_monitor(ctx,m[0],m[1],m[2],m[3]));
  gv_plant(ctx,1884,P.fy,0.7);}

// Close-ups: a cork board filling the frame, on its room's wall; a screen on a desk; the data team's poster
const GV_BC=[210,50,1500,820],GV_SC=[330,70,1260,690],GV_PC=[330,40,1260,810];
function gv_paintBoardClose(ctx,wall){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:71});
  gv_lightGlow(ctx,960,-80,900);const [x,y,w,h]=GV_BC;gv_cork(ctx,x,y,w,h,34);}
function gv_paintScreenDesk(ctx,wall){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,960),wall,{kind:"plaster",line:false,seed:73});
  wc_wash(ctx,wc_rect(-40,900,W+80,220),GV.oak,{kind:"plaster",line:false,seed:74});wc_wash(ctx,wc_rect(-40,894,W+80,14),wc_dim(GV.oak,0.25),{kind:"trim",line:false,flat:true});
  const [x,y,w,h]=GV_SC;wc_part(ctx,[[x+w/2-40,y+h+12],[x+w/2+40,y+h+12],[x+w/2+52,912],[x+w/2-52,912]],GV.metal,1);wc_wash(ctx,wc_ell(x+w/2,918,190,22,30),GV.metal,{kind:"thing",lw:1.4});
  gv_monitor(ctx,x,y,w,h,{stand:false});
  wc_part(ctx,wc_rect(1660,960,420,160),[226,228,234],1);wc_wash(ctx,wc_ell(160,990,70,40,30),[236,240,244],{kind:"thing",lw:1.4});}
function gv_paintPosterClose(ctx,o){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.data,{kind:"plaster",line:false,seed:75});
  gv_lightGlow(ctx,960,-60,900);const [x,y,w,h]=GV_PC;gv_poster(ctx,x,y,w,h,o);}

// Planning's office: a big screen on the wall, a desk, a window.
const GV_PL={fy:856,screen:[560,172,700,390],win:[1500,150,320,430],desk:[90,668,470]};
function gv_paintPlanning(ctx){const P=GV_PL,wall=GV_ROOM.plan;gv_wallFloor(ctx,wall,P.fy,{seed:31,vx:900});gv_lightGlow(ctx,900,0,520);
  gv_window(ctx,P.win[0],P.win[1],P.win[2],P.win[3],{wall,seed:14,tx:0.3});gv_monitor(ctx,P.screen[0],P.screen[1],P.screen[2],P.screen[3],{stand:false});
  gv_chair(ctx,330,P.desk[1]-128,{col:[90,110,96]});gv_desk(ctx,P.desk[0],P.desk[1],P.desk[2],P.fy+6,{});gv_monitor(ctx,250,476,180,124);gv_plant(ctx,1400,P.fy,0.9);}

// The registrar's office: shelves of archive boxes, a desk, a window.
const GV_RG={fy:856,shelf:[70,520],desk:[700,664,640],win:[1530,150,300,430]};
function gv_paintRegistrar(ctx){const G=GV_RG,wall=GV_ROOM.reg;gv_wallFloor(ctx,wall,G.fy,{seed:41,vx:1000});gv_lightGlow(ctx,1000,0,520);
  gv_window(ctx,G.win[0],G.win[1],G.win[2],G.win[3],{wall,seed:16,tx:0.55});
  gv_bookcase(ctx,G.shelf[0],G.fy,G.shelf[1],680,[350,520,690],{col:[176,150,120]});
  const R=wc_rng(4);for(const sy of [350,520,690])for(let i=0;i<4;i++){const bx=G.shelf[0]+34+i*118;wc_part(ctx,wc_rect(bx,sy-118,104,118),[[214,200,170],[196,186,160],[222,210,184]][i%3],1);
    wc_flat(ctx,wc_rect(bx+28,sy-90,48,28),WC_CARD,1,"label");if(R()<0.5)wc_flat(ctx,wc_rect(bx+40,sy-40,24,10),wc_dim([196,186,160],0.4),1,"hole");}
  gv_chair(ctx,1020,G.desk[1]-128,{col:[70,84,120]});gv_desk(ctx,G.desk[0],G.desk[1],G.desk[2],G.fy+6,{});gv_plant(ctx,1440,G.fy,0.85);}

// Yusuf's desk from above, for the papers on it: oak with its grain, a mug, a pencil, the edge of a keyboard
function gv_paintDesk(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV.oak,{kind:"plaster",line:false,seed:51});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(3);for(let i=0;i<70;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(GV.oak,0.2+R()*0.12),0.18+R()*0.14);ctx.lineWidth=1+R()*2.4;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+6*Math.sin(x/300+i)+3*Math.sin(x/90+i*2));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(1500,-40,460,120),[226,228,234],1);for(let i=0;i<9;i++)for(let j=0;j<2;j++)wc_flat(ctx,wc_rect(1516+i*48,-24+j*44,40,36),[244,245,248],1,"key");
  wc_wash(ctx,wc_ell(150,140,82,82,40),[236,240,244],{kind:"thing",lw:1.6});wc_wash(ctx,wc_ell(150,140,62,62,40),[150,104,70],{kind:"thing",line:false});
  wc_part(ctx,[[1640,980],[1900,900],[1906,912],[1646,994]],[244,196,80],1);wc_flat(ctx,[[1900,900],[1930,892],[1906,912]],[60,54,58],1,"tip");}

/* ---------- people at a table or a desk ---------- */
// a person behind a table or a desk, cut off at its top (cutY), which the place's front layer then draws over them: sitting, the
// top 230·s px of them shows above it (head, shoulders, chest); standing (o.standing), the top 330·s px, from the hips up
const GV_SIT=335,GV_STAND=235;
function gv_behind(ctx,id,x,cutY,s,o){o=o||{};ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,cutY+H);ctx.clip();person(ctx,id,x,cutY+(o.standing?GV_STAND:GV_SIT)*s,s,o);ctx.restore();}

/* ---------- the places the later films share ---------- */
// painted once for every film after the first, so no film changes them for itself
// sticky notes, in four colours
const GV_NOTE=[[252,224,118],[246,178,190],[170,208,240],[184,224,168]];
// a sticky note, square, with two scribbled lines on it (nobody needs to read them)
function gv_note(ctx,x,y,s,col,rot,seed){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.fillStyle="rgba(70,60,50,0.16)";ctx.fillRect(-s/2+3,-s/2+5,s,s);
  wc_wash(ctx,wc_rect(-s/2,-s/2,s,s),col,{kind:"swatch",seed:seed||(x|0)});ctx.strokeStyle=rgba(wc_dim(col,0.55),0.55);ctx.lineWidth=Math.max(1.4,s/26);ctx.lineCap="round";
  const R=wc_rng(seed||(x|0));for(let i=0;i<2;i++){const ly=-s*0.16+i*s*0.24;ctx.beginPath();ctx.moveTo(-s*0.32,ly);for(let k=1;k<=6;k++)ctx.lineTo(-s*0.32+k*s*(0.1+R()*0.012)*(i?0.8:1),ly+(R()-0.5)*s*0.05);ctx.stroke();}ctx.restore();}
// a pendant lamp hanging from the ceiling: its cord, a shade, and the light under it
function gv_pendant(ctx,x,y,s){s=s||1;ctx.save();ctx.strokeStyle=rgba([70,66,64],0.7);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x,-10);ctx.lineTo(x,y);ctx.stroke();ctx.restore();
  wc_part(ctx,[[x-12*s,y],[x+12*s,y],[x+60*s,y+46*s],[x-60*s,y+46*s]],[60,82,74],1,{lw:1.4});ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y+56*s,150*s,[255,240,200],0.42);ctx.restore();}
// a mug on a desk or table, its handle to one side
function gv_mug(ctx,x,y,col,flip){const k=flip?-1:1;wc_wash(ctx,[[x+k*22,y-44],[x+k*38,y-40],[x+k*38,y-18],[x+k*22,y-14]],col,{kind:"thing",lw:1.2,bare:true});
  wc_part(ctx,wc_rect(x-24,y-54,48,54),col,1,{lw:1.3});wc_flat(ctx,wc_ell(x,y-54,24,6,16),wc_dim(col,0.3),1,"rim");}
// a closed notebook lying on a table, seen from the front: a thin block, its cover, an elastic band
function gv_book(ctx,x,y,w,col){wc_part(ctx,wc_rect(x,y-14,w,14),col,1,{lw:1.2});wc_flat(ctx,wc_rect(x+w*0.8,y-14,6,14),wc_dim(col,0.4),1,"band");}

// The meeting room where the stewards meet: a whiteboard of sticky notes, a screen for those who join from elsewhere, two lamps over
// a long table, a window. People sit behind the table (gv_behind at GV_MT.top), and the table is the place's front layer
// (gv_paintMeetingTable, kept like a place: list both in the film's WC_PLACES and draw the table after the people). GV_MT says where
// everything is: the five seats along the table, and a spot to stand at the board, for people at scale s.
const GV_MT={fy:856,board:[110,148,660,388],screen:[934,170,540,304],win:[1610,150,260,420],top:752,table:[290,1340],seats:[480,720,960,1200,1440],stand:[190,905],s:0.8};
function gv_paintMeeting(ctx){const M=GV_MT,wall=GV_ROOM.meet;gv_wallFloor(ctx,wall,M.fy,{seed:81,vx:960});gv_lightGlow(ctx,660,0,560);gv_lightGlow(ctx,1260,0,560);
  gv_window(ctx,M.win[0],M.win[1],M.win[2],M.win[3],{wall,seed:24,tx:0.42});
  // the whiteboard: three groups of notes, and room on its left for what a film adds
  const [bx,by,bw,bh]=M.board;wc_part(ctx,wc_rect(bx-10,by-10,bw+20,bh+20),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(bx,by,bw,bh),[250,251,250],1,"board");
  const R=wc_rng(14);[[bx+300,by+40],[bx+420,by+40],[bx+540,by+40]].forEach(([gx,gy],g)=>{for(let i=0;i<5-(g%2);i++){const nx=gx+(i%2)*56+(R()-0.5)*8,ny=gy+30+Math.floor(i/2)*64+(R()-0.5)*6;
    gv_note(ctx,nx,ny,50,GV_NOTE[(g+i)%4],(R()-0.5)*0.12,30+g*7+i);}});
  ctx.save();ctx.strokeStyle=rgba([60,110,170],0.6);ctx.lineWidth=3.4;ctx.lineCap="round";for(const [lx,ly,lw] of [[bx+290,by+22,84],[bx+410,by+22,70],[bx+530,by+22,90]]){ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+lw,ly+2);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(bx+bw*0.3,by+bh+10,bw*0.4,12),GV.metal,1);for(const [mx,c] of [[bx+bw*0.36,[204,62,50]],[bx+bw*0.42,[60,110,170]],[bx+bw*0.48,[40,140,90]]])wc_flat(ctx,wc_rect(mx,by+bh+2,34,10),c,1,"marker");
  // the screen on the wall, and the lamps over the table
  const [sx,sy,sw,sh]=M.screen;wc_part(ctx,wc_rect(sx-12,sy-12,sw+24,sh+24),GV.bezel,1,{kind:"thing"});wc_flat(ctx,wc_rect(sx,sy,sw,sh),[230,234,240],1,"screen");
  gv_pendant(ctx,720,96,1);gv_pendant(ctx,1200,96,1);
  // the chairs' backs along the far side of the table
  M.seats.forEach((x,i)=>{wc_part(ctx,wc_rrPts(x-70,M.top-150,140,170,30),[74,84,104],1,{seed:90+i});wc_flat(ctx,wc_rect(x-50,M.top-128,100,8),wc_lit([74,84,104],0.18),1,"seam");});
  gv_plant(ctx,1896,M.fy,0.95);}
// the table, over the people sitting at it: its top, its edge, the panel under it to the floor, and what's on it (a jug of water and
// glasses, notebooks, a plate of biscuits, a box of markers), each between two seats
function gv_paintMeetingTable(ctx){const M=GV_MT,[x0,w]=M.table,top=M.top,col=GV.oak;
  wc_contact(ctx,x0-30,x0+w+30,976,0.9,0.34);
  wc_part(ctx,wc_rect(x0+44,top+56,w-88,920-top-56),wc_dim(col,0.26),1);for(const lx of [x0+16,x0+w-58])wc_part(ctx,wc_rect(lx,top+56,42,976-top-56),wc_dim(col,0.32),1);
  wc_part(ctx,wc_rect(x0,top,w,40),wc_lit(col,0.12),1);wc_part(ctx,wc_rect(x0-6,top+38,w+12,20),wc_dim(col,0.06),1);
  // between the seats: the jug and two glasses, notebooks, biscuits, markers
  const S=M.seats,mid=i=>(S[i]+S[i+1])/2,ty=top+26;
  wc_part(ctx,[[mid(0)-30,ty],[mid(0)+30,ty],[mid(0)+34,ty-96],[mid(0)+20,ty-110],[mid(0)-26,ty-110],[mid(0)-34,ty-96]],[214,230,236],1,{kind:"thing",lw:1.3});
  wc_flat(ctx,[[mid(0)-30,ty-4],[mid(0)+30,ty-4],[mid(0)+32,ty-62],[mid(0)-32,ty-62]],[176,208,222],1,"water");
  for(const gx of [mid(0)+60,mid(1)-60]){wc_part(ctx,wc_rect(gx-16,ty-52,32,52),[226,236,240],1,{kind:"thing",lw:1.1});wc_flat(ctx,wc_rect(gx-14,ty-28,28,24),[186,214,226],1,"water");}
  gv_book(ctx,mid(1)-10,ty+6,96,[96,118,150]);gv_book(ctx,mid(1)-2,ty-8,84,[176,96,80]);
  wc_flat(ctx,wc_ell(mid(2),ty+2,74,12,24),[236,236,232],1,"plate");for(const [dx,dy] of [[-34,-8],[0,-12],[30,-8],[-14,-20],[16,-22]])wc_wash(ctx,wc_ell(mid(2)+dx,ty+dy,22,9,16),[212,164,104],{kind:"thing",lw:1});
  wc_part(ctx,wc_rect(mid(3)-46,ty-24,92,30),[226,218,204],1,{lw:1.2});[[204,62,50],[60,110,170],[40,140,90],[40,40,48]].forEach((c,i)=>wc_flat(ctx,wc_rect(mid(3)-38+i*20,ty-46,14,24),c,1,"marker"));}

// A desk close up, the camera at the height of someone sitting: the room's wall behind, the desk's top across the frame, and its
// front below. Shared by the registrar's office, the platform team's room and the faculty office: each paints its own wall and
// what's on it, then the desk (its front layer, drawn over whoever sits there with gv_behind at the place's top).
function gv_deskFront(ctx,top,col,drawers){wc_part(ctx,wc_rect(-40,top+44,W+80,H-top),wc_dim(col,0.2),1,{seed:top});
  wc_part(ctx,wc_rect(-40,top,W+80,52),wc_lit(col,0.1),1,{seed:top+3});wc_flat(ctx,wc_rect(-40,top+46,W+80,10),wc_dim(col,0.3),1,"edge");
  for(const [dx,dw] of drawers||[]){wc_part(ctx,wc_rect(dx,top+76,dw,H-top-60),wc_dim(col,0.12),1,{seed:dx|0});for(const hy of [top+150,top+250])wc_flat(ctx,wc_rect(dx+dw/2-40,hy,80,12),wc_dim(col,0.45),1,"handle");}}
// a screen standing on a desk whose top is at y: bezel, the screen itself, a neck and a foot
function gv_deskScreen(ctx,x,y,w,h,top){wc_part(ctx,[[x+w/2-26,y+h+10],[x+w/2+26,y+h+10],[x+w/2+34,top+12],[x+w/2-34,top+12]],GV.metal,1);
  wc_wash(ctx,wc_ell(x+w/2,top+16,130,14,30),wc_dim(GV.metal,0.06),{kind:"thing",lw:1.3});gv_monitor(ctx,x,y,w,h,{stand:false});}
// a keyboard and a mouse, flat on a desk whose top is at y
function gv_keys(ctx,x,top,w,mx){wc_part(ctx,[[x,top+40],[x+w,top+40],[x+w-10,top+18],[x+10,top+18]],[226,228,234],1,{lw:1.2});
  ctx.save();ctx.fillStyle=rgba([180,184,192],0.6);for(let i=0;i<14;i++)for(let j=0;j<2;j++)ctx.fillRect(x+18+i*(w-36)/14,top+22+j*8,(w-36)/14-4,5);ctx.restore();
  if(mx!=null)wc_wash(ctx,wc_ell(mx,top+30,22,13,20),[232,234,238],{kind:"thing",lw:1.2});}

// The registrar's office, close: Mei's desk. Behind it, the shelves of archive boxes, a framed degree with the university's seal, and
// the year's calendar with its dates marked; on the desk, a tray of certificates, the office's stamp, a screen and a mug. GV_RX: the
// desk's top, a seat for scale s, the screen (what it shows is drawn every frame), the frame and the calendar.
const GV_RX={top:792,seat:[560,1.7],screen:[1140,330,560,350],cert:[420,96,280,200],cal:[820,92,224,240]};
function gv_paintRegistrarClose(ctx){const X=GV_RX,wall=GV_ROOM.reg;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:43});gv_lightGlow(ctx,700,-60,760);
  // the shelves, at the left edge
  gv_bookcase(ctx,-60,X.top+40,400,X.top+120,[250,520,X.top-10],{col:[176,150,120]});
  for(const sy of [250,520,782])for(let i=0;i<3;i++){const bx=-22+i*112;wc_part(ctx,wc_rect(bx,sy-150,100,150),[[214,200,170],[196,186,160],[222,210,184]][(i+sy)%3],1);
    wc_flat(ctx,wc_rect(bx+26,sy-118,48,32),WC_CARD,1,"label");wc_flat(ctx,wc_rect(bx+38,sy-52,24,10),wc_dim([196,186,160],0.4),1,"hole");}
  // a degree in its frame: cream paper, a heading, lines of copperplate, the seal in red wax with its ribbon
  const [cx,cy,cw,ch]=X.cert;gv_frame(ctx,cx,cy,cw,ch);wc_flat(ctx,wc_rect(cx+18,cy+16,cw-36,ch-32),[248,240,220],1,"parchment");
  ctx.save();ctx.strokeStyle=rgba([90,70,50],0.55);ctx.lineCap="round";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx+cw*0.3,cy+50);ctx.lineTo(cx+cw*0.7,cy+50);ctx.stroke();ctx.lineWidth=1.8;
  for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(cx+48,cy+84+i*22);for(let k=0;k<=10;k++)ctx.lineTo(cx+48+k*(cw-96)/10*(i===3?0.6:1),cy+84+i*22+Math.sin(k*1.7+i)*2.2);ctx.stroke();}ctx.restore();
  wc_wash(ctx,[[cx+cw-82,cy+ch-40],[cx+cw-70,cy+ch+6],[cx+cw-62,cy+ch-28],[cx+cw-54,cy+ch+6],[cx+cw-42,cy+ch-40]],[176,40,34],{kind:"ribbon"});
  wc_wash(ctx,wc_ell(cx+cw-62,cy+ch-52,22,22,22),[186,52,44],{kind:"thing",lw:1.2});
  // the calendar: the month's grid, a few days ringed in red
  const [kx,ky,kw,kh]=X.cal;gv_pin(ctx,kx+kw/2,ky-4,GV.red,1.1);wc_flat(ctx,wc_rect(kx,ky,kw,kh),GV.paper,1,"page");wc_flat(ctx,wc_rect(kx,ky,kw,54),[96,118,150],1,"band");
  ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.35);for(let r=0;r<5;r++)for(let c=0;c<7;c++)ctx.fillRect(kx+16+c*30,ky+76+r*32,16,8);ctx.restore();
  for(const [c,r] of [[2,1],[4,3]]){ctx.save();ctx.strokeStyle=rgba([204,62,50],0.8);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(kx+24+c*30,ky+80+r*32,19,15,0.1,0,TAU);ctx.stroke();ctx.restore();}
  // a cabinet of drawers at the right, under the calendar
  wc_part(ctx,wc_rect(1740,560,260,X.top-560+20),[150,160,176],1);for(const dy of [588,668])wc_flat(ctx,wc_rect(1800,dy,80,12),[110,118,134],1,"handle");}
function gv_paintRegistrarDesk(ctx){const X=GV_RX,top=X.top;gv_deskFront(ctx,top,GV.oak,[[110,360],[1520,360]]);
  // the tray of certificates, each in its folder
  wc_part(ctx,wc_rect(120,top-34,260,44),[150,156,168],1,{lw:1.3});for(let i=0;i<4;i++)wc_flat(ctx,wc_rect(132+i*6,top-58+i*6,236,12),[[248,240,220],[176,40,34],[248,240,220],[96,118,150]][i],1,"folder");
  // the office's stamp, on its pad of red ink
  wc_part(ctx,wc_rect(850,top-14,150,26),[70,72,80],1);wc_flat(ctx,wc_rect(862,top-16,126,10),[176,40,34],1,"ink");
  wc_part(ctx,wc_rect(1020,top-20,90,22),[60,52,48],1);wc_part(ctx,[[1046,top-20],[1084,top-20],[1078,top-64],[1052,top-64]],[150,104,70],1);wc_wash(ctx,wc_ell(1065,top-78,24,20,20),[150,104,70],{kind:"thing",lw:1.2});
  // the screen, its keyboard, a pot of pens, a mug
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+70,top,sw-140,sx+sw+30);
  wc_part(ctx,[[1744,top+8],[1784,top+8],[1780,top-50],[1748,top-50]],[96,118,150],1);for(const [px,a,c] of [[-14,-0.2,[60,60,70]],[-4,0.1,[204,62,50]],[6,0.25,[60,60,70]]]){ctx.save();ctx.translate(1764+px,top-48);ctx.rotate(a);wc_flat(ctx,wc_rect(-2,-40,5,42),c,1,"pen");ctx.restore();}
  gv_mug(ctx,1880,top+10,[226,214,190]);}

// The platform team's room, close: Sam's desk. The racks' edge at the left, the whiteboard behind him, two screens side by side
// (what each shows is drawn every frame), a mug, headphones. GV_PX: the desk's top, a seat for scale s, the two screens.
const GV_PX={top:792,seat:[1570,1.7],screens:[[250,344,500,320],[800,344,500,320]],board:[1330,66,546,390]};
function gv_paintPlatformClose(ctx){const X=GV_PX,wall=GV_ROOM.plat;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:63});gv_lightGlow(ctx,1100,-60,760);
  gv_rack(ctx,-50,60,230,X.top+20,9);gv_whiteboard(ctx,X.board[0],X.board[1],X.board[2],X.board[3]);
  // a printed sheet taped to the wall: the on-call rota (nobody needs to read it)
  gv_sheet(ctx,1080,110,150,196,{rot:0.03});gv_lines(ctx,1100,150,110,6,24,0.9);}
function gv_paintPlatformDesk(ctx){const X=GV_PX,top=X.top;gv_deskFront(ctx,top,[206,190,166],[[60,340],[1500,340]]);
  X.screens.forEach(([sx,sy,sw,sh])=>gv_deskScreen(ctx,sx,sy,sw,sh,top));gv_keys(ctx,600,top,440,1110);
  // headphones lying on the desk, and a mug
  ctx.save();ctx.strokeStyle=rgba([50,54,64],0.9);ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.ellipse(1270,top+14,64,40,0,Math.PI*1.05,Math.PI*1.95);ctx.stroke();ctx.restore();
  for(const hx of [1210,1330])wc_wash(ctx,wc_ell(hx,top+16,24,18,18),[60,64,74],{kind:"thing",lw:1.2});
  gv_mug(ctx,160,top+10,[64,150,146],true);}

// A faculty's office in the old building, close: an analyst's desk beside a tall window. Warm plaster over dark panelling, journals on
// the shelves, a lamp for the early hours; on the desk, a screen (what it shows is drawn every frame), printouts under a closed
// laptop, a mug. GV_FX: the desk's top, a seat for scale s, the screen, the window, the lamp.
const GV_FX={top:800,seat:[1330,1.7],screen:[560,300,540,330],win:[60,40,420,600],lamp:[1690,800]};
function gv_paintFaculty(ctx){const X=GV_FX,wall=GV_ROOM.fac;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:91});
  // the panelling, from the dado rail down
  wc_part(ctx,wc_rect(-40,560,W+80,H-520),[128,94,66],1,{seed:92});wc_part(ctx,wc_rect(-40,548,W+80,22),[150,112,80],1);
  for(let i=0;i<7;i++)wc_flat(ctx,wc_rect(-20+i*290+30,600,230,180),[116,84,58],1,"panel");
  // the tall window, arched, onto the lawn and the newer building
  const [wx,wy,ww,wh]=X.win;ctx.save();wc_tr(ctx,wc_arched(wx,wy,ww,wh));ctx.clip();const hz=wy+wh*0.66;wc_sky(ctx,hz,9,{clouds:2,cx:wx+10,cw:ww-60,cy:wy+60,ch:wh*0.2});
  wc_land(ctx,xx=>hz+4*Math.sin(xx/90),WCP.far,0.3,{line:false});wc_part(ctx,wc_rect(wx+ww*0.46,hz-wh*0.24,ww*0.5,wh*0.24+8),WCP.concrete,0.4);
  for(let r=0;r<2;r++)wc_part(ctx,wc_rect(wx+ww*0.5,hz-wh*0.2+r*wh*0.1,ww*0.42,wh*0.05),WCP.glass,0.4,{kind:"glass"});
  wc_land(ctx,xx=>hz+30+5*Math.sin(xx/110),WCP.lawn,0.5,{line:false});wc_roundTree(ctx,wx+ww*0.22,hz+40,wh*0.4,0.5);ctx.restore();
  const A=wc_arched(wx,wy,ww,wh);wc_ink(ctx,A,true,3,WC_INK,0.6,93,1.2);for(const r of [wc_rect(wx+ww/2-7,wy,14,wh),wc_rect(wx,wy+wh*0.5-7,ww,14),wc_rect(wx,wy+wh*0.26-6,ww,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.3});
  wc_wash(ctx,wc_rect(wx-30,wy+wh,ww+60,26),[226,212,190],{kind:"trim",lw:1.5});
  // shelves of journals at the right
  gv_bookcase(ctx,1500,X.top+40,480,X.top+80,[270,540],{col:GV.woodDark});const R=wc_rng(17);for(const sy of [270,540]){let bx=1530;while(bx<1960){const bw=24+R()*20,bh=120+R()*60;
    wc_part(ctx,wc_rect(bx,sy-bh,bw,bh),[[150,90,80],[96,118,150],[120,140,104],[196,170,120],[118,96,140]][Math.floor(R()*5)],1,{lw:1.1});bx+=bw+3;}}
  // a pinboard: the faculty's timetable and two notices
  gv_cork(ctx,640,110,420,150,12);gv_sheet(ctx,660,124,180,120,{rot:-0.02});gv_lines(ctx,676,148,148,4,22,0.9);gv_note(ctx,900,170,64,GV_NOTE[0],0.05,71);gv_note(ctx,990,180,64,GV_NOTE[2],-0.06,72);}
function gv_paintFacultyDesk(ctx){const X=GV_FX,top=X.top;gv_deskFront(ctx,top,[176,128,88],[[1460,380]]);
  // a stack of printouts, a closed laptop on them, a plant on the sill
  for(let i=0;i<5;i++)wc_flat(ctx,wc_rect(150+i*3,top-8-i*7,250,9),i%2?[244,242,236]:[250,250,246],1,"paper");wc_part(ctx,wc_rect(170,top-60,220,16),GV.metal,1,{lw:1.2});
  gv_plant(ctx,420,X.win[1]+X.win[3]+2,0.45);
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+60,top,sw-120,sx+sw+30);
  gv_mug(ctx,470,top+10,[204,86,70]);
  // the lamp: a weighted base, two arms, the shade turned down onto the desk, and its pool of light
  const [ax,ay]=X.lamp;ctx.save();ctx.beginPath();ctx.rect(ax-420,top,640,46);ctx.clip();ctx.globalCompositeOperation="screen";ctx.translate(ax-170,top+22);ctx.scale(1,0.22);wc_glowAt(ctx,0,0,260,[255,236,190],0.55);ctx.restore();
  wc_part(ctx,wc_ell(ax,ay+4,56,14,24),[60,64,72],1);ctx.save();ctx.strokeStyle=rgba([60,64,72],0.95);ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+30,ay-200);ctx.lineTo(ax-90,ay-300);ctx.stroke();ctx.restore();
  wc_part(ctx,[[ax-90,ay-320],[ax-60,ay-300],[ax-130,ay-220],[ax-200,ay-250]],[60,64,72],1,{lw:1.3});}

// Noor's room: the architecture map that fills its wall, her desk and screens, a shelf. GV_NR says where each is. gv_map paints the
// map at any size: one band for each of its layers, in the colours The map before the data gives them, and in each a few of the
// cards already on it. A film pins its own cards in a band's free part (gv_mapFree), here or on the map close up (GV_MC).
const GV_LAYERS=[["Motivation",[200,186,255]],["Strategy",[245,206,140]],["Business",[255,234,130]],["Information",[255,186,150]],["Application",[140,214,255]],["Technology",[160,224,140]]];
const GV_NR={fy:856,board:[100,104,1220,640],desk:[1430,668,440],mon:[[1460,476,180,124],[1666,476,180,124]],shelf:[1440,150,420]};
// band i of a map drawn at [x, y, w, h], and the part of it that's still free, right of the cards already there
function gv_mapBand(x,y,w,h,i){const g=h*0.016,bh=(h-g*7)/6;return[x+g,y+g+i*(bh+g),w-2*g,bh];}
function gv_mapFree(x,y,w,h,i){const [bx,by,bw,bh]=gv_mapBand(x,y,w,h,i);return[bx+bw*0.58,by,bw*0.42,bh];}
function gv_map(ctx,x,y,w,h,o){o=o||{};const k=w/1600;wc_part(ctx,wc_rect(x-12*k,y-12*k,w+24*k,h+24*k),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(x,y,w,h),[250,250,247],1,"board");
  const R=wc_rng(23);GV_LAYERS.forEach(([nm,col],i)=>{const [bx,by,bw,bh]=gv_mapBand(x,y,w,h,i);wc_wash(ctx,wc_rect(bx,by,bw,bh),wc_lit(col,0.66),{kind:"swatch",seed:40+i,a:0.8});
    if(o.labels!==false)wc_hand(ctx,nm,bx+18*k,by+bh*0.5+12*k,{size:34*k,w:700,col:wc_dim(col,0.66)});
    const n=2+(i%2),cw=bw*0.1,ch=bh*0.58;for(let j=0;j<n;j++){const cx=bx+bw*0.17+j*(cw+bw*0.035),cy=by+(bh-ch)/2+(R()-0.5)*bh*0.08;
      wc_panel(ctx,cx,cy,cw,ch,{kind:"card",wash:col,washA:0.4,seed:60+i*5+j});
      ctx.save();ctx.strokeStyle=rgba(wc_dim(col,0.62),0.55);ctx.lineWidth=Math.max(1.2,2.4*k);ctx.lineCap="round";for(let l=0;l<2;l++){ctx.beginPath();ctx.moveTo(cx+cw*0.16,cy+ch*(0.42+l*0.24));ctx.lineTo(cx+cw*(l?0.62:0.84),cy+ch*(0.42+l*0.24));ctx.stroke();}ctx.restore();
      gv_pin(ctx,cx+cw/2,cy+6*k,wc_dim(col,0.3),Math.max(0.45,0.9*k));}});}
function gv_paintNoor(ctx){const N=GV_NR,wall=GV_ROOM.noor;gv_wallFloor(ctx,wall,N.fy,{seed:101,vx:900});gv_lightGlow(ctx,700,0,620);
  gv_map(ctx,N.board[0],N.board[1],N.board[2],N.board[3],{labels:false});
  // her shelf: books and two box files
  const [hx,hy,hw]=N.shelf;wc_part(ctx,wc_rect(hx,hy,hw,14),GV.wood,1);const R=wc_rng(31);let bx=hx+12;while(bx<hx+hw-120){const bw=22+R()*18,bh=90+R()*44;wc_part(ctx,wc_rect(bx,hy-bh,bw,bh),[[118,96,140],[96,118,150],[150,90,80],[120,140,104]][Math.floor(R()*4)],1,{lw:1.1});bx+=bw+3;}
  wc_part(ctx,wc_rect(hx+hw-110,hy-110,46,110),[176,150,120],1);wc_part(ctx,wc_rect(hx+hw-60,hy-110,46,110),[176,150,120],1);
  gv_chair(ctx,1670,N.desk[1]-128,{col:[110,84,100]});gv_desk(ctx,N.desk[0],N.desk[1],N.desk[2],N.fy+6,{});N.mon.forEach(m=>gv_monitor(ctx,m[0],m[1],m[2],m[3]));gv_plant(ctx,1386,N.fy,0.8);}
// the map close: the board filling the frame, each band with its name
const GV_MC=[150,56,1620,830];
function gv_paintMapClose(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.noor,{kind:"plaster",line:false,seed:105});
  gv_lightGlow(ctx,960,-80,900);const [x,y,w,h]=GV_MC;gv_map(ctx,x,y,w,h);}

/* ---------- things: paper painted once and kept, the words drawn every frame ---------- */
// a ring binder's spine, standing: its colour, a label near the top, a finger hole; kept per size and colour
function gv_binder(ctx,x,y,w,h,col,o){o=o||{};const c=wc_kept("binder|"+[w,h,col].join(","),w+24,h+24,q=>{q.translate(12,12);wc_wash(q,wc_rect(0,0,w,h),col,{kind:"cover",lw:1.4,seed:w+h});
    wc_flat(q,wc_rect(w*0.18,h*0.1,w*0.64,h*0.26),WC_CARD,1,"label");wc_wash(q,wc_ell(w/2,h*0.8,w*0.17,w*0.17,16),wc_dim(col,0.45),{kind:"thing",line:false,flat:true});});
  ctx.drawImage(c,x-12,y-12);}
// a sheet of paper, white, with a soft shadow; kept per size; o.rot turns it about its centre
function gv_sheetPaper(w,h,o){o=o||{};return wc_kept("sheet|"+w+"x"+h+"|"+(o.col||"w"),w+40,h+40,q=>{q.translate(20,20);q.save();q.filter="blur(6px)";q.fillStyle="rgba(70,60,50,0.22)";q.fillRect(6,10,w,h);q.restore();
  wc_wash(q,wc_rect(0,0,w,h),o.col||GV.paper,{kind:"page",lw:1.4,seed:w*3+h});});}
function gv_sheet(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.translate(x+w/2,y+h/2);if(o.rot)ctx.rotate(o.rot);ctx.drawImage(gv_sheetPaper(w,h,o),-w/2-20,-h/2-20);ctx.restore();}
// a typed line on paper: a grey bar, for the lines no one needs to read
function gv_lines(ctx,x,y,w,n,gap,a){ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.32*(a==null?1:a));for(let i=0;i<n;i++)ctx.fillRect(x,y+i*gap,w*(i===n-1?0.6:0.92+0.08*Math.sin(i*7)),5);ctx.restore();}
// what a screen shows: a light panel with a title bar; fn draws the rest
function gv_screen(ctx,x,y,w,h,title,fn,o){o=o||{};ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x,y,w,h);ctx.fillStyle=rgba(o.bar||[70,96,140],1);ctx.fillRect(x,y,w,o.barH||40);
  if(title)wc_T(ctx,title,x+18,y+(o.barH||40)*0.72,{w:700,size:o.titleSize||28,col:[255,255,255]});if(fn)fn(ctx);ctx.restore();}
// a speech bubble: a paper card with a pencil edge and a tail towards (tx,ty); k springs it in
function gv_say(ctx,x,y,lines,tx,ty,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||32,lh=Math.round(sz*1.3),w=Math.round(Math.max(...lines.map(l=>tw(ctx,l,sz,o.w||700)))+sz*1.5),
    h=Math.round(lines.length*lh+sz*0.9),k=o.k==null?1:o.k,bx=clamp(tx,x+40,x+w-40),by=ty<y?y:y+h;
  withA(ctx,a,()=>{ctx.save();ctx.translate(tx,ty);ctx.scale(k,k);ctx.translate(-tx,-ty);
    ctx.beginPath();ctx.moveTo(bx-20,by);ctx.lineTo(tx,ty);ctx.lineTo(bx+20,by);ctx.closePath();ctx.fillStyle=rgba(WC_CARD,1);ctx.fill();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2;ctx.stroke();
    wc_panel(ctx,x,y,w,h,{kind:"card",wash:o.wash,washA:o.washA||0.22,seed:o.seed||(w+h)});ctx.fillStyle=rgba(WC_CARD,1);ctx.fillRect(bx-17,by-(ty<y?-1:3),34,4);
    lines.forEach((l,i)=>wc_T(ctx,l,x+sz*0.75,y+sz*0.5+lh*(i+0.74),{w:o.w||700,size:sz,col:WC_DARK}));ctx.restore();});return w;}
// a push pin, seen from the front
function gv_pin(ctx,x,y,col,s){s=s||1;ctx.save();ctx.fillStyle="rgba(60,50,40,0.25)";ctx.beginPath();ctx.ellipse(x+3*s,y+5*s,9*s,5*s,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,9*s,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(wc_dim(col,0.35),0.8);ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle="rgba(255,255,255,0.65)";ctx.beginPath();ctx.arc(x-3*s,y-3*s,3*s,0,TAU);ctx.fill();ctx.restore();}
// a card pinned to a board: paper, a pin at the top, lines of text; o.wash tints it
function gv_card(ctx,x,y,w,h,lines,o){o=o||{};wc_panel(ctx,x,y,w,h,{kind:"card",wash:o.wash,washA:o.washA||0.3,seed:o.seed||(x|0)});const sz=o.size||28;
  lines.forEach((l,i)=>{const big=i===0&&o.head!==false;wc_T(ctx,l,x+(o.align==="center"?w/2:22),y+(o.y0||46)+i*(sz+12),{w:big?800:600,size:big?(o.headSize||sz+2):sz,col:big?WC_DARK:WC_INK,align:o.align});});
  if(o.pin!==false)gv_pin(ctx,x+w/2,y+12,o.pinCol||GV.red);}
// a rubber stamp's impression: the word in ink inside a double rule, landing a little large and settling (p 0 to 1), uneven where it
// pressed less
function gv_stampRule(w,h,col){return wc_kept("stamp|"+[w,h,col].join(","),w*2+20,h*2+20,q=>{q.scale(2,2);q.translate(5,5);
  wc_ink(q,wc_rrPts(0,0,w,h,8),true,3.6,col,0.9,41,0.6);wc_ink(q,wc_rrPts(7,7,w-14,h-14,5),true,1.8,col,0.85,43,0.6);q.globalCompositeOperation="destination-out";q.globalAlpha=0.45;q.drawImage(WC.blotch,-40,-30,w+120,h+90);});}
function gv_stamp(ctx,x,y,s,p,o){o=o||{};if(p<=0)return;const size=o.size||40,col=o.col||GV.redInk,w=Math.round(tw(ctx,s,size,800)+56),h=Math.round(size+36),k=lerp(1.35,1,1-Math.pow(1-clamp(p,0,1),3));
  ctx.save();ctx.translate(x,y);ctx.rotate(o.rot==null?-0.06:o.rot);ctx.scale(k,k);withA(ctx,clamp(p*1.4,0,1)*(o.a==null?1:o.a),()=>{ctx.drawImage(gv_stampRule(w,h,col),-w/2-5,-h/2-5,w+10,h+10);
    wc_T(ctx,s,0,size*0.36,{w:800,size,align:"center",col,a:0.88});});ctx.restore();}
// a question mark in gold, settling with a spring
function gv_qmark(ctx,x,y,s,p){if(p<=0)return;const k=spring(p);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(p*2,0,1),()=>{wc_glowAt(ctx,0,-s*0.3,s*0.9,[255,226,140],0.5);
  wc_T(ctx,"?",0,0,{w:800,size:s,align:"center",col:GV.goldInk});});ctx.restore();}
// a glow round something that lights up: a soft halo in a colour
function gv_halo(ctx,x,y,w,h,col,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=a;const r=Math.max(w,h)*0.7,g=ctx.createRadialGradient(x+w/2,y+h/2,Math.min(w,h)*0.2,x+w/2,y+h/2,r);
  g.addColorStop(0,rgba(wc_lit(col,0.35),0.9));g.addColorStop(1,rgba(wc_lit(col,0.35),0));ctx.fillStyle=g;ctx.fillRect(x+w/2-r,y+h/2-r,r*2,r*2);ctx.restore();}
// a soft wash of colour over a shape, as something lights up (multiplied, so what's under it still shows)
function gv_tint(ctx,x,y,w,h,col,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=a;ctx.fillStyle=rgba(wc_lit(col,0.45),1);ctx.fillRect(x,y,w,h);ctx.restore();}
// a column's class of personal data, as a chip with its word, beside the column (as Who may see it draws it): GV_CLASS's plum, paler
// plum or plain paper; returns its width. gv_classChipAt brings one in at t0, landing a little large and settling
function gv_classChip(ctx,x,y,cls,o){o=o||{};const s=o.size||28,w=Math.round(tw(ctx,cls,s,700)+44),h=s+22;
  wc_panel(ctx,x,y-h/2,w,h,{kind:"chip",fill:GV_CLASS[cls],seed:cls.length+3});wc_T(ctx,cls,x+22,y+s*0.36,{w:700,size:s,col:cls==="direct"?[255,255,255]:WC_DARK});return w;}
function gv_classChipAt(ctx,t,t0,x,y,cls,o){const u=fin(t,t0,0.4);if(u<=0)return;const k=lerp(1.25,1,spring(fin(t,t0,0.55)));ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  withA(ctx,clamp(u*2,0,1),()=>gv_classChip(ctx,0,0,cls,o));ctx.restore();}
// a mask over a value: a plum band with *** in white, sliding in from the left as u goes 0 to 1. The band is laid on solid plum first,
// so nothing of the value shows through it
function gv_mask(ctx,x,y,w,h,u,o){if(u<=0)return;o=o||{};const e=easeCam(clamp(u,0,1)),s=o.size||28;ctx.save();ctx.beginPath();ctx.rect(x-10,y-10,(w+20)*e,h+20);ctx.clip();
  ctx.fillStyle=rgba(GV_CLASS.direct,1);wc_tr(ctx,wc_rrPts(x+2,y+2,w-4,h-4,10));ctx.fill();wc_panel(ctx,x,y,w,h,{kind:"card",fill:GV_CLASS.direct,seed:(w+h)|0});wc_T(ctx,"***",x+18,y+h/2+s*0.5,{w:800,size:s+4,f:"mono",col:[255,255,255]});ctx.restore();}

/* ---------- papers several films share ---------- */
// a sign-off sheet: a change comes back on paper with what's missing in plain words (Who decides, Who may see it, Rules that run and
// Teachers of data share it). Drawn at (x,y), w wide: at 1000, in a close-up, its words are 30 px or more. o.title is the change;
// o.rows its lines, [label, value], with null for a value that's missing; o.ask[i], the question written in red under row i; o.how,
// a line to the guide that says how to fix it; o.stamp, "sent back" (red) or "signed" (green), landing as o.stampP goes 0 to 1;
// o.signer, the name written on the signature line as o.signP goes 0 to 1 ("" leaves the line empty). o.p (0 to 1) brings the rows
// in one by one; o.missA (0 to 1) lights what's missing red; o.askP (0 to 1) writes the questions, wrapped to the value's column.
// gv_signoffH(ctx,rows,o) is its height at 1000 wide. Returns the sheet's height and each row's middle, so a film can point at one.
const GV_SIGN={ink:[34,44,92]};
// where the values start: after the longest label (at 30 px), at 36% of the sheet or more
function gv_signoffVX(ctx,rows,o){return Math.round(Math.min(560,Math.max(1000*((o||{}).split||0.36),48+Math.max(0,...rows.map(r=>tw(ctx,r[0],30,600)))+40)));}
// the question under a row, in lines that fit the value's column (written at 30 px in the sheet's units), as even as they can be;
// a question with line breaks keeps them
function gv_askLines(ctx,s,vx){if(s.includes("\n"))return s.split("\n");const room=952-vx-24,wrap=r=>{const out=[];let cur="";
    s.split(" ").forEach(wd=>{const t=cur?cur+" "+wd:wd;if(cur&&tw(ctx,t,30,700)>r){out.push(cur);cur=wd;}else cur=t;});if(cur)out.push(cur);return out;};
  const L=wrap(room);if(L.length<2)return L;for(let r=tw(ctx,s,30,700)/L.length;r<room;r+=12){const E=wrap(r);if(E.length===L.length)return E;}return L;}
function gv_signoffH(ctx,rows,o){o=o||{};const ask=o.ask||{},vx=gv_signoffVX(ctx,rows,o);return 214+rows.reduce((s,r,i)=>s+66+(ask[i]?8+42*gv_askLines(ctx,ask[i],vx).length:0),0)+
  (o.how?72:0)+(o.signer!=null?92:0)+(o.stamp&&!o.how&&o.signer==null?96:0)+40;}
function gv_signoff(ctx,x,y,w,o){o=o||{};const k=w/1000,rows=o.rows||[],ask=o.ask||{},n=rows.length,p=o.p==null?1:o.p,mA=o.missA==null?1:o.missA,
    vx=gv_signoffVX(ctx,rows,o),h=gv_signoffH(ctx,rows,o),R=[],line=(x0,x1,ly,col,a,lw)=>{ctx.strokeStyle=rgba(col,a);ctx.lineWidth=lw||2;ctx.beginPath();ctx.moveTo(x0,ly);ctx.lineTo(x1,ly);ctx.stroke();};
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);gv_sheet(ctx,0,0,1000,h,{rot:o.rot});ctx.lineCap="round";
  wc_T(ctx,o.kicker||"Sign-off",48,66,{w:800,size:28,col:WC_MUTED});wc_T(ctx,o.title||"",48,124,{w:800,size:42,col:WC_DARK});line(48,952,156,WC_MUTED,0.45,2);
  let ry=172;
  rows.forEach(([lab,val],i)=>{const a=clamp(p*n-i,0,1),miss=val==null;R.push(y+(ry+33)*k);
    if(a>0.01)withA(ctx,a,()=>{
      if(miss&&mA>0.01){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.red,0.72),mA);wc_tr(ctx,wc_rrPts(vx-14,ry+8,952-vx+14,52,8));ctx.fill();ctx.restore();}
      wc_T(ctx,lab,48,ry+44,{w:600,size:30,col:WC_MUTED});
      if(!miss){const s=clamp(32*(952-vx)/Math.max(1,tw(ctx,val,32,600)),28,32);wc_T(ctx,val,vx,ry+44,{w:600,size:s,col:WC_DARK});}
      line(vx,952,ry+58,miss?GV.redInk:WC_MUTED,miss?0.55+0.35*mA:0.3,miss?2.6:1.6);
      if(ask[i]){const L=gv_askLines(ctx,ask[i],vx),q=o.askP==null?1:o.askP;L.forEach((l,j)=>wc_hand(ctx,l,vx+4,ry+102+42*j,{size:30,w:700,col:GV.redInk,p:clamp(q*L.length-j,0,1)}));}});
    ry+=66+(ask[i]?8+42*gv_askLines(ctx,ask[i],vx).length:0);});
  line(48,952,ry+14,WC_MUTED,0.45,2);ry+=14;
  if(o.how){const hy=ry+50;ctx.save();ctx.strokeStyle=rgba(GV.cyanInk,0.9);ctx.lineWidth=2.4;ctx.lineJoin="round";
      ctx.beginPath();ctx.moveTo(48,hy-22);ctx.lineTo(66,hy-26);ctx.lineTo(84,hy-22);ctx.lineTo(84,hy+2);ctx.lineTo(66,hy-2);ctx.lineTo(48,hy+2);ctx.closePath();ctx.moveTo(66,hy-26);ctx.lineTo(66,hy-2);ctx.stroke();ctx.restore();
    wc_T(ctx,o.how,102,hy,{w:700,size:30,col:GV.cyanInk});line(102,102+tw(ctx,o.how,30,700),hy+8,GV.cyanInk,0.7,2);ry+=72;}
  if(o.signer!=null){const sy=ry+58;wc_T(ctx,"Signed",48,sy,{w:600,size:30,col:WC_MUTED});line(vx,vx+340,sy+10,WC_MUTED,0.5,1.6);
    if(o.signer)wc_hand(ctx,o.signer,vx+12,sy,{size:38,w:600,col:GV_SIGN.ink,p:o.signP==null?1:o.signP});ry+=92;}
  if(o.stamp){const ok=o.stamp==="signed";gv_stamp(ctx,952-150,h-66,o.stamp.toUpperCase(),o.stampP==null?1:o.stampP,{size:38,col:ok?GV.greenInk:GV.redInk,rot:ok?-0.05:-0.08});}
  ctx.restore();return{h:h*k,rows:R,x:x+vx*k};}
// a register: a page of the university's own ledger, ruled in columns, kept by whoever owns what it lists (Who decides' owners and
// stewards, Who may see it's classes, Rules that run's rules, Teachers of data's sign-offs). Drawn at (x,y), w wide: at 1000, in a
// close-up, its words are 28 px or more. o.kicker, the register's name, above o.title, the page's; o.cols, the headings, each
// [heading, share of the width]; o.rows, each an array of cells. A cell is words, null for a gap (lit red as o.missA goes 0 to 1),
// or {t, mono, red, hand, strike} (a code, a "TBC" in red, words written by hand as p goes 0 to 1, struck through as strike goes
// 0 to 1), or {chip:"direct", p} for a class chip (popping in as p goes 0 to 1). o.p (0 to 1) brings the rows in one by one; o.hi,
// a row's index or several, washed gold as o.hiA goes 0 to 1; o.foot, a line written by hand at the foot as o.footP goes 0 to 1
// ("classed by Mei Tanaka"). o.turn (0 to 1) turns the page over: it folds from its right edge towards the binding, its blank back
// over its front, so the page a film draws under it shows; o.h, the page's height at 1000 wide, so two pages of one book match (the
// taller one's gv_registerH). A chip is 28 px, so "pseudonymous" needs a column of 0.3 of the width or more. gv_registerH(o) is its
// height at 1000 wide. Returns the page's height, each row's middle and each column's left edge, so a film can point at a cell
const GV_REG={top:172,head:206,row:66,pad:16};
function gv_registerH(o){return GV_REG.head+22+GV_REG.row*(o.rows||[]).length+(o.foot?96:28)+20;}
function gv_register(ctx,x,y,w,o){o=o||{};const k=w/1000,rows=o.rows||[],cols=o.cols||[],n=rows.length,p=o.p==null?1:o.p,mA=o.missA==null?1:o.missA,h=Math.max(gv_registerH(o),o.h||0),
    turn=clamp(o.turn||0,0,1),hi=[].concat(o.hi==null?[]:o.hi),line=(x0,x1,ly,col,a,lw)=>{ctx.strokeStyle=rgba(col,a);ctx.lineWidth=lw||2;ctx.beginPath();ctx.moveTo(x0,ly);ctx.lineTo(x1,ly);ctx.stroke();};
  const cx=[48];cols.forEach(([,s],i)=>cx.push(cx[i]+904*s));const R=rows.map((_,i)=>y+(GV_REG.head+22+GV_REG.row*i+33)*k),C=cx.slice(0,-1).map(c=>x+c*k);
  if(turn>=1)return{h:h*k,rows:R,cols:C};
  const fold=1000*(1-easeCam(turn));ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  if(turn>0){ctx.beginPath();ctx.rect(-30,-30,fold+30,h+60);ctx.clip();}gv_sheet(ctx,0,0,1000,h,{rot:o.rot});ctx.lineCap="round";
  // the binding: the page's left edge sinks into the book
  const gut=ctx.createLinearGradient(0,0,70,0);gut.addColorStop(0,"rgba(70,60,50,0.24)");gut.addColorStop(1,"rgba(70,60,50,0)");ctx.fillStyle=gut;ctx.fillRect(0,0,70,h);
  if(o.kicker)wc_T(ctx,o.kicker,48,66,{w:700,size:28,col:WC_MUTED});wc_T(ctx,o.title||"",48,124,{w:800,size:42,col:WC_DARK});line(48,952,GV_REG.top-16,WC_MUTED,0.45,2);
  cols.forEach(([hd],i)=>wc_T(ctx,hd,i?cx[i]+GV_REG.pad:48,GV_REG.head-12,{w:700,size:28,col:WC_MUTED}));
  line(48,952,GV_REG.head+4,WC_MUTED,0.5,2);line(48,952,GV_REG.head+11,WC_MUTED,0.5,2);
  const bottom=GV_REG.head+22+GV_REG.row*n;ctx.strokeStyle=rgba(WC_MUTED,0.18);ctx.lineWidth=1.6;
  for(let i=1;i<cols.length;i++){ctx.beginPath();ctx.moveTo(cx[i],GV_REG.top);ctx.lineTo(cx[i],bottom);ctx.stroke();}
  rows.forEach((cells,r)=>{const a=clamp(p*n-r,0,1),ry=GV_REG.head+22+GV_REG.row*r,hA=hi.includes(r)?(o.hiA==null?1:o.hiA):0;if(a<=0.01)return;
    withA(ctx,a,()=>{
      if(hA>0.01){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.gold,0.6),hA);wc_tr(ctx,wc_rrPts(40,ry+4,920,GV_REG.row-8,8));ctx.fill();ctx.restore();}
      cells.forEach((c,i)=>{const x0=i?cx[i]+GV_REG.pad:48,room=cx[i+1]-x0-GV_REG.pad,ty=ry+44;
        if(c==null){if(mA>0.01){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.red,0.72),mA);wc_tr(ctx,wc_rrPts(x0-8,ry+8,room+16,GV_REG.row-14,8));ctx.fill();ctx.restore();}
          line(x0,x0+room,ry+GV_REG.row-6,GV.redInk,0.3+0.5*mA,2.6);return;}
        if(c.chip){const q=c.p==null?1:c.p;if(q>0.01){const s=lerp(1.25,1,spring(q));ctx.save();ctx.translate(x0,ry+33);ctx.scale(s,s);withA(ctx,clamp(q*2,0,1),()=>gv_classChip(ctx,0,0,c.chip,{size:28}));ctx.restore();}return;}
        const t=typeof c==="string"?c:c.t,f=c.mono?"mono":undefined,wt=c.mono?500:c.red?700:600,col=c.red?GV.redInk:c.hand?GV_SIGN.ink:WC_DARK,
          s=clamp(30*room/Math.max(1,tw(ctx,t,30,wt,f)),28,30);
        if(c.hand)wc_hand(ctx,t,x0+4,ty,{size:s+2,w:600,col,p:c.p==null?1:c.p});else wc_T(ctx,t,x0,ty,{w:wt,size:s,col,f});
        if(c.strike){const e=easeCam(clamp(c.strike,0,1));line(x0-4,x0-4+(Math.min(room,tw(ctx,t,s,wt,f))+8)*e,ty-s*0.32,GV.redInk,0.85,3);}});
      line(48,952,ry+GV_REG.row,WC_MUTED,0.22,1.6);});});
  if(o.foot)wc_hand(ctx,o.foot,56,bottom+64,{size:32,w:600,col:GV_SIGN.ink,p:o.footP==null?1:o.footP});
  if(turn>0){// the page's back, the same paper folded over at the fold: shaded where it lifts off the front, light where it bends; its
    // shadow on the front beside its edge, and on the page beneath beside the fold
    const x0=Math.max(0,2*fold-1000);if(x0>0){const e=ctx.createLinearGradient(x0-24,0,x0,0);e.addColorStop(0,"rgba(50,40,30,0)");e.addColorStop(1,"rgba(50,40,30,0.2)");ctx.fillStyle=e;ctx.fillRect(x0-24,0,24,h);}
    ctx.save();ctx.beginPath();ctx.rect(x0,-30,fold-x0,h+60);ctx.clip();ctx.translate(2*fold,0);ctx.scale(-1,1);ctx.drawImage(gv_sheetPaper(1000,h),-20,-20);ctx.restore();
    const bk=ctx.createLinearGradient(x0,0,fold,0);bk.addColorStop(0,"rgba(60,50,40,0.16)");bk.addColorStop(0.75,"rgba(60,50,40,0.04)");bk.addColorStop(1,"rgba(255,255,255,0.18)");
    ctx.fillStyle=bk;ctx.fillRect(x0,0,fold-x0,h);ctx.restore();ctx.save();ctx.translate(x,y);ctx.scale(k,k);
    const sh=ctx.createLinearGradient(fold,0,fold+46,0);sh.addColorStop(0,"rgba(50,40,30,0.3)");sh.addColorStop(1,"rgba(50,40,30,0)");ctx.fillStyle=sh;ctx.fillRect(fold,0,46,h);}
  ctx.restore();return{h:h*k,rows:R,cols:C};}
// a register's cover, closed, lying flat: cloth boards in o.col (a deep blue by default), a darker spine and corners, and a paper
// label with its name and whose it is ("Classification register", "registrar's office"); at 700 wide its words are 30 px or more.
// Kept per size and colour, the words drawn every frame
function gv_registerCover(ctx,x,y,w,h,title,sub,o){o=o||{};const col=o.col||[58,82,118],k=w/700,
    c=wc_kept("regcover|"+[w,h,col].join(","),w+40,h+40,q=>{q.translate(20,20);q.save();q.filter="blur(6px)";q.fillStyle="rgba(50,40,30,0.3)";q.fillRect(6,10,w,h);q.restore();
      wc_wash(q,wc_rect(0,0,w,h),col,{kind:"cover",lw:1.4,seed:w+h});const dk=wc_dim(col,0.35),cc=w*0.13;wc_flat(q,wc_rect(0,0,w*0.1,h),dk,1,"spine");
      wc_flat(q,[[w-cc,0],[w,0],[w,cc]],dk,1,"corner");wc_flat(q,[[w,h-cc],[w,h],[w-cc,h]],dk,1,"corner");
      wc_flat(q,wc_rect(w*0.2,h*0.2,w*0.68,Math.max(150*k,h*0.24)),WC_CARD,1,"label");});
  ctx.drawImage(c,x-20,y-20);const lx=x+w*0.2,ly=y+h*0.2,lw=w*0.68;
  wc_T(ctx,title,lx+lw/2,ly+64*k,{w:800,size:Math.max(30,40*k),col:WC_DARK,align:"center"});if(sub)wc_T(ctx,sub,lx+lw/2,ly+114*k,{w:600,size:Math.max(28,30*k),col:WC_MUTED,align:"center"});}

/* ---------- the data quality scorecard several films share ---------- */
// the data quality scorecard on a screen, in plain words, as Rules that run and Fixed where it starts draw it: "last night's checks",
// the areas down the side and the five dimensions across, and in each cell how many checks passed, of how many, on its wash: green,
// passed; amber, with warnings; red, with a failure; grey and hatched, not checked; bare paper, no check of that kind. The words always
// say it too. Under it, what didn't pass and whose it is, in sections ("Failed", "Warnings", "Not checked"), each only when it has
// lines. Each column is as wide as its words; when they don't all fit across the page, a cell breaks after its count. The camera shows
// it in turns (GV_SKV): the whole page (too small to read, on purpose; the washes carry it), then close on a row and the lines under it.
// A cell is "passed/total", then w (warnings), f (failed) or n (not checked), each with how many: "7/7w2", "6/7f1w2", "1/3n2"; ""
// is no check of that kind. Each film keeps its own nights (a row for each area, then a last row for all of them) and sections.
const GV_SKD=["Completeness","Uniqueness","Validity","Consistency","Accuracy","All"];
// where the table is on the screen (GV_SC): its left, its width, its headings' line, a row's height and a second line's, the words'
// size, the room each side of a cell's words, and a section's headings; each state's wash, how pale it is, and its ink
const GV_SK={x:380,w:1160,y:200,rh:31,lh:24,sz:19,pad:12,heads:[["Check",0],["Owner",0.62],["Rows",0.9]]};
const GV_SKST={pass:[GV.green,0.62,WC_INK],warn:[GV.amber,0.3,GV.amberInk],fail:[GV.red,0.36,GV.redInk],skip:[GV.grey,0.55,GV.greyInk]};
function gv_skCell(s){const m=s?/^(\d+)\/(\d+)(.*)$/.exec(s):null;if(!m)return null;const n={};(m[3].match(/[wfn]\d+/g)||[]).forEach(k=>n[k[0]]=+k.slice(1));
  const notes=[];if(n.f)notes.push(n.f+" failed");if(n.w)notes.push(n.w+(n.w>1?" warnings":" warning"));if(n.n)notes.push(n.n+" not checked");
  return{main:m[1]+" of "+m[2],notes,state:n.f?"fail":n.n?"skip":n.w?"warn":"pass"};}
// where everything goes, for the nights drawn (one, or two when one turns into the next): each column's left and width, each row's
// top, height and words' line, the table's foot. Kept for each set of nights, as it's measured once
const GV_SKL=new Map();
function gv_skLay(ctx,nights){const key=JSON.stringify(nights);if(GV_SKL.has(key))return GV_SKL.get(key);const K=GV_SK,cells=nights.map(rows=>rows.map(r=>r.slice(1).map(gv_skCell))),
    last=nights[0].length-1,wt=i=>i===last?800:600,one=c=>c?[[c.main,...c.notes].join(" · ")]:[],two=c=>c?[c.main,c.notes.join(" · ")]:[],
    widths=f=>[Math.max(tw(ctx,"Area",K.sz,700),...nights[0].map((r,i)=>tw(ctx,r[0],K.sz,wt(i)))),
      ...GV_SKD.map((d,j)=>Math.max(tw(ctx,d,K.sz,700),...cells.flatMap(rows=>rows.map((r,i)=>Math.max(0,...f(r[j]).map(s=>tw(ctx,s,K.sz,wt(i))))))))].map(v=>v+2*K.pad);
  let cw=widths(one),wrap=false;if(cw.reduce((a,b)=>a+b,0)>K.w){cw=widths(two);wrap=true;}
  const spare=Math.max(0,K.w-cw.reduce((a,b)=>a+b,0))/cw.length,cx=[K.x];cw=cw.map(v=>v+spare);cw.forEach((v,i)=>cx.push(cx[i]+v));
  let top=K.y+K.rh*0.28;const rows=nights[0].map((_,i)=>{const h=K.rh+(wrap&&cells.some(r=>r[i].some(c=>c&&c.notes.length))?K.lh:0),r={top,h,base:top+K.rh*0.72};top+=h;return r;});
  const L={cx,cw,rows,wrap,bottom:top};GV_SKL.set(key,L);return L;}
// grey hatching over a cell that wasn't checked
function gv_hatch(ctx,x,y,w,h,a){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.strokeStyle=rgba(GV.greyInk,0.34*a);ctx.lineWidth=2;ctx.beginPath();
  for(let k=-h;k<w;k+=10){ctx.moveTo(x+k,y+h);ctx.lineTo(x+k+h,y);}ctx.stroke();ctx.restore();}
// the scorecard: o.rows the night, o.date beside "last night's checks"; o.after, the next night, which it turns into as o.mx goes 0 to
// 1 (the washes change all the way; the old words go in the first half and the new come in the second); o.p (0 to 1) fills it in, the
// headings first, then a wash in each cell as its count arrives; o.hi, a row lit gold as o.hiA goes 0 to 1; o.sections under it (and
// o.afterSections, the next night's): each a title, a state ("fail", "warn" or "skip", for its swatches), its lines (each check in
// plain words, its owner, its rows) and its headings (heads: [heading, where it starts along the table], or false for none); and
// o.clear, said when there are none ("Every check passed."). o.scroll moves the page up by that much, under the screen's title bar,
// so a scene can go from the table down to the lines under it (0, by default). Returns where everything is on the page (gv_skLay's,
// L.sec: each section's title and lines, and its columns, and L.scroll: on the screen, everything is that much higher), so a scene
// can light a cell or an owner
function gv_scorecard(ctx,cam,o){o=o||{};const [x,y,w,h]=GV_SC,K=GV_SK,z=cam&&cam.z?cam.z:1,dz=s=>z*s<27?1:0,deco=dz(K.sz),rows=o.rows||[],after=o.after,
    e=after?easeCam(clamp(o.mx||0,0,1)):0,eo=1-clamp(e*2,0,1),en=clamp(e*2-1,0,1),p=o.p==null?1:clamp(o.p,0,1),secA=o.sections||[],
    secB=after?(o.afterSections||[]):secA,sc=o.scroll||0,barH=54;let L;
  gv_screen(ctx,x,y,w,h,"Data quality scorecard",q=>{if(sc){q.save();q.beginPath();q.rect(x,y+barH,w,h-barH);q.clip();q.translate(0,-sc);}
    L=gv_skLay(q,after?[rows,after]:[rows]);const nd=GV_SKD.length,N=rows.length*nd,hd=clamp(p*8,0,1);
    withA(q,hd,()=>wc_T(q,"last night's checks"+(o.date?" · "+o.date:""),K.x+K.pad,K.y-46,{w:600,size:K.sz+3,col:WC_MUTED,deco:dz(K.sz+3)}));
    if(o.hi!=null&&o.hiA>0.01){const r=L.rows[o.hi];gv_tint(q,K.x,r.top,K.w,r.h,GV.gold,0.55*o.hiA);}
    withA(q,hd,()=>["Area",...GV_SKD].forEach((s,j)=>wc_T(q,s,j?L.cx[j]+L.cw[j]/2:K.x+K.pad,K.y,{w:700,size:K.sz,align:j?"center":"left",col:WC_MUTED,deco})));
    // a cell's words, on one line or broken after its count
    const words=(c,j,r,wt,a,col)=>{if(!c||a<=0.01)return;(L.wrap&&c.notes.length?[c.main,c.notes.join(" · ")]:[[c.main,...c.notes].join(" · ")]).forEach((s,k)=>
      wc_T(q,s,L.cx[j]+L.cw[j]/2,r.base+k*K.lh,{w:wt,size:K.sz,align:"center",col,a,deco}));};
    rows.forEach((row,i)=>{const r=L.rows[i],wt=i===rows.length-1?800:600;withA(q,hd,()=>wc_T(q,row[0],K.x+K.pad,r.base,{w:wt,size:K.sz,col:WC_DARK,deco}));
      for(let j=1;j<=nd;j++){const A=gv_skCell(row[j]),B=after?gv_skCell(after[i][j]):A,u=clamp((p-0.12)/0.88*N-(i*nd+j-1),0,1);if(u<=0||(!A&&!B))continue;
        const SA=A&&GV_SKST[A.state],SB=B&&GV_SKST[B.state],col=SA&&SB?mix(SA[0],SB[0],e):(SA||SB)[0],pale=SA&&SB?lerp(SA[1],SB[1],e):(SA||SB)[1],
          wa=u*(SA&&SB?1:SA?1-e:e),bx=L.cx[j]+6,by=r.top+2,bw=L.cw[j]-12,bh=r.h-5;
        withA(q,wa,()=>{q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(col,pale),1);q.fillRect(bx,by,bw,bh);q.restore();});
        const ha=u*((A&&A.state==="skip"?1-e:0)+(B&&B.state==="skip"?e:0));if(ha>0.01)gv_hatch(q,bx,by,bw,bh,ha);
        if(!after||row[j]===after[i][j])words(A,j,r,wt,u,SA[2]);else{words(A,j,r,wt,u*eo,SA&&SA[2]);words(B,j,r,wt,u*en,SB&&SB[2]);}}});
    // under the table: each section, its title and headings, and a line for each check with a swatch of its colour
    const sections=(S,a)=>{const out=[];let ty=L.bottom+32;S.forEach(s=>{const st=GV_SKST[s.state],heads=s.heads===false?null:s.heads||K.heads,
        hx=(heads||[[null,0]]).map(([,f],k)=>k?K.x+f*K.w:K.x+K.pad+32);let ry=ty;
      withA(q,a,()=>{wc_T(q,s.title,K.x+K.pad,ty,{w:800,size:K.sz+3,col:WC_DARK,deco:dz(K.sz+3)});if(heads){ry+=30;heads.forEach(([hs],k)=>wc_T(q,hs,hx[k],ry,{w:700,size:K.sz,col:WC_MUTED,deco}));}});
      const ys=s.rows.map((cells,k)=>{const yy=ry+K.rh*(k+1);withA(q,a,()=>{q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(st[0],st[1]),1);
          q.fillRect(K.x+K.pad,yy-K.sz*0.8,20,20);q.restore();cells.forEach((c,m)=>wc_T(q,c,hx[m]==null?hx[0]:hx[m],yy,{w:600,size:K.sz,col:m?WC_INK:WC_DARK,deco}));});return yy;});
      out.push({title:ty,rows:ys,cols:hx});ty=(ys.length?ys[ys.length-1]:ry)+50;});return out;};
    const same=secA===secB;L.sec=sections(secA,same?1:eo);L.secB=same?null:sections(secB,en);L.scroll=sc;
    const clr=same?(secA.length?0:1):(secA.length?0:eo)+(secB.length?0:en);
    if(clr>0.01)wc_T(q,o.clear||"Every check passed.",K.x+K.pad,L.bottom+46,{w:700,size:K.sz+3,col:GV.greenInk,a:clr,deco:dz(K.sz+3)});
    if(sc)q.restore();},{titleSize:32,barH});
  return L;}
// where the camera looks for each turn: the whole page; then the learning row (the fifth), near the top of the frame, with the lines
// under it, above the captions
const GV_SKV={all:[960,415,1.02],row:[960,GV_SK.y+5*GV_SK.rh+156,1.55]};

/* ---------- people moving ---------- */
// someone walking from x0 to x1 from t0 at v px a second: where they are, the step's bob and swing, when they arrive, which way they face
function gv_walk(t,t0,x0,x1,v){const L=Math.abs(x1-x0),T_=Math.max(0.3,L/(v||300)),u=clamp((t-t0)/T_,0,1),e=u<0.5?2*u*u:1-2*(1-u)*(1-u),moving=u>0&&u<1,ph=(t-t0)*Math.PI*3.4;
  return{x:lerp(x0,x1,e),moving,bob:moving?Math.abs(Math.sin(ph))*7*Math.sin(u*Math.PI):0,swing:moving?Math.sin(ph)*Math.sin(u*Math.PI):0,end:t0+T_,flip:x1<x0};}
// a person walking: the arms swing and the body bobs while they move
function gv_walker(ctx,id,w,y,s,o){o=o||{};const sw=w.swing;person(ctx,id,w.x,y-w.bob,s,Object.assign({pose:o.pose||"stand",pose2:w.moving&&!o.pose?(sw>0?"walkA":"walkB"):o.pose2,mix:w.moving&&!o.pose?Math.abs(sw):o.mix,flip:w.moving?w.flip:o.flip},o));}

/* ---------- title and end cards ---------- */
// the series' mark: three strokes, the colours of where a line of the binder can end up: green, it runs in the work; gold, a decision
// someone owns; grey, it can go
const GV_MARK=[GV.green,GV.gold,GV.grey];
function gv_mark(ctx,cx,cy,w,p,a){if(a<=0.01)return;const n=GV_MARK.length,sw=w/n;withA(ctx,a,()=>{GV_MARK.forEach((col,i)=>{const q=clamp(p*n*0.8-i*0.6,0,1);if(q<=0)return;
  const x=cx-w/2+i*sw,c=wc_kept("gvmark"+i+"|"+Math.round(sw),Math.round(sw+24),40,x2=>{wc_prep();wc_wash(x2,wc_resample(wc_rect(6,6,sw+10,26),8),col,{kind:"swatch",line:false,a:0.85,seed:31+i*7});});
  ctx.save();ctx.beginPath();ctx.rect(x-4,cy-30,(sw+30)*ease(q),60);ctx.clip();ctx.drawImage(c,x-6,cy-20);ctx.restore();});});}
function gv_title(ctx,S,t,t0,title,sub,line){const oA=fin(t,t0,0.8),tA=fin(t,t0+0.5,0.8);if(oA<=0)return;wc_veil(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{wc_T(ctx,title,960,500,{w:800,size:92,align:"center",col:WC_DARK});gv_mark(ctx,960,566,420,(t-t0-0.6)/1.2,1);
    if(sub)wc_T(ctx,sub,960,660,{w:600,size:36,align:"center",col:WC_MUTED});withA(ctx,fin(t,t0+1.2,0.8),()=>wc_tag(ctx,960,748,line,{align:"center",size:28,w:600}));});}
function gv_end(ctx,S,t,t0,title,line,n){const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;wc_veil(ctx,S,oA*0.94);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)wc_T(ctx,line,960,420,{w:700,size:48,align:"center",col:WC_DARK});gv_mark(ctx,960,520,360,(t-t0-0.7)/1.0,1);wc_T(ctx,title,960,622,{w:800,size:44,align:"center",col:WC_DARK});
    wc_T(ctx,(n?n+" · ":"")+"data governance · Learning Data",960,680,{w:600,size:28,align:"center",col:WC_MUTED});});}

/* ===== The same problem, everywhere: the places, the people and the things =====
   The prologue's places are other organisations' rooms, on purpose, because the point is that the problem is everywhere: a bank's
   risk floor at night in 2008 and the city round it, an office floor in the 1970s, a meeting room in Los Angeles in 1980, a boardroom
   in 2002, the regulators' table in Basel, a team room in 2017, an office's front desk in 2018, a team training a model in 2024; then
   the university, where film 1 begins (the series' rooms.js). No company is named and no logo appears. The thread is a shelf, where
   the body of knowledge arrives edition by edition. The people are invented, and dressed for their time; behind each person of the
   past is a warm umber wash, and from 2024 the business side's gold or the technical side's cyan. Every name starts with sp_ or SP_. */

/* ---------- the people ---------- */
// clothes of their time, from the engine's own (shirt, suit, blazer, cardigan, sweater, overshirt, skirt), with two additions for
// the 1970s and 1980: a wide pointed collar over the neckline (top.collar), and big round glasses (bigGlasses)
const sp_torso0=torso,sp_face0=face;
torso=function(ctx,P,br,sh){sp_torso0(ctx,P,br,sh);const T_=P.top;if(!T_.collar)return;const y0=-448+br,c=T_.collar===true?(T_.inner||lighten(T_.c,0.5)):T_.collar;
  for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*13,y0-3);ctx.quadraticCurveTo(s*30,y0-1,s*44,y0+6);ctx.lineTo(s*58+sh*0.2,y0+40);ctx.quadraticCurveTo(s*34+sh*0.2,y0+34,s*6+sh*0.3,y0+26);ctx.closePath();
    litFill(ctx,c,-58,y0,58,y0+40);seam(ctx,c,0.45,1.4);}};
face=function(ctx,P,E,po,t){if(!P.bigGlasses)return sp_face0(ctx,P,E,po,t);sp_face0(ctx,P,E,po,t);const fx=po.turn*7,ly=po.look*3;
  ctx.strokeStyle=rgba(P.bigGlasses,0.95);ctx.lineWidth=3;for(const s of [-1,1]){ell(ctx,s*17+fx,-1+ly,15.5,14.5);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(-3+fx,-5+ly);ctx.quadraticCurveTo(fx,-8+ly,3+fx,-5+ly);ctx.stroke();ctx.beginPath();ctx.moveTo(-32+fx,-6+ly);ctx.lineTo(-42,-9);ctx.moveTo(32+fx,-6+ly);ctx.lineTo(42,-9);ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.32)";ctx.lineWidth=1.8;for(const s of [-1,1]){ctx.beginPath();ctx.arc(s*17+fx,-1+ly,11,-2.6,-1.7);ctx.stroke();}};
const SP_LAN=[66,84,140];
Object.assign(PEOPLE,{
  // 2008, a bank's risk floor, late: shirtsleeves and lanyards
  spHead:{name:"",role:"head of risk",side:"",edge:GV_PAST,seed:51,skin:[190,140,106],hair:{style:"bob",c:[44,36,34],streak:[150,142,140]},earrings:[226,228,236],lanyard:SP_LAN,
    top:{kind:"shirt",c:[198,214,234]},bottom:{c:[52,56,66]},shoe:[40,34,32],build:{sh:68,hip:60,h:0.97}},
  spDep:{name:"",role:"from the board's office",side:"",edge:GV_PAST,seed:52,skin:[232,196,168],hair:{style:"side",c:[92,70,52]},lanyard:SP_LAN,
    top:{kind:"suit",c:[46,52,68],inner:[244,244,240]},bottom:{c:[46,52,68]},shoe:[30,26,26],build:{sh:76,hip:62,h:1.02}},
  spAn1:{name:"",role:"risk analyst",side:"",edge:GV_PAST,seed:53,skin:[124,86,62],hair:{style:"coily",c:[30,24,24]},lanyard:SP_LAN,
    top:{kind:"cardigan",c:[118,72,84],inner:[236,232,226]},bottom:{c:[48,50,60]},shoe:[36,30,30],build:{sh:66,hip:60,h:0.95}},
  spAn2:{name:"",role:"risk analyst",side:"",edge:GV_PAST,seed:54,skin:[238,206,180],hair:{style:"cropped",c:[168,128,88]},glasses:[40,40,44],lanyard:SP_LAN,
    top:{kind:"shirt",c:[222,232,214]},bottom:{c:[70,74,86]},shoe:[44,36,32],build:{sh:74,hip:62,h:1.0}},
  // the 1970s, an office floor: earth tones, wide collars, big glasses
  spAdmin:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:55,skin:[234,198,170],hair:{style:"long",c:[120,72,42]},bigGlasses:[96,62,40],
    top:{kind:"shirt",c:[228,190,110],collar:[244,226,180]},bottom:{kind:"skirt",c:[138,88,54]},legs:[212,178,152],shoe:[90,60,40],build:{sh:66,hip:62,h:0.96}},
  spSales:{name:"",role:"sales",side:"",edge:GV_PAST,seed:56,skin:[222,180,148],hair:{style:"side",c:[70,50,36]},beard:[80,58,42],
    top:{kind:"suit",c:[148,108,70],inner:[236,220,180],collar:[236,220,180]},bottom:{c:[148,108,70]},shoe:[70,48,34],build:{sh:76,hip:64,h:1.0}},
  spAcct:{name:"",role:"accounts",side:"",edge:GV_PAST,seed:57,skin:[160,110,84],hair:{style:"bun",c:[36,28,26]},
    top:{kind:"cardigan",c:[196,140,70],inner:[244,236,220]},bottom:{kind:"skirt",c:[100,80,60]},legs:[140,98,76],shoe:[66,48,36],build:{sh:64,hip:60,h:0.95}},
  spShip:{name:"",role:"shipping",side:"",edge:GV_PAST,seed:58,skin:[200,160,130],hair:{style:"cropped",c:[40,32,30]},bigGlasses:[50,46,46],
    top:{kind:"shirt",c:[178,198,168],collar:true},bottom:{c:[90,84,70]},shoe:[60,44,34],build:{sh:74,hip:62,h:1.0}},
  // Los Angeles, 1980: the people who looked after data, at an evening meeting
  spLa1:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:61,skin:[214,170,140],hair:{style:"bob",c:[150,100,60],streak:[192,150,110]},bigGlasses:[120,80,60],
    top:{kind:"blazer",c:[174,92,60],inner:[240,226,200],collar:[240,226,200]},bottom:{kind:"skirt",c:[118,90,70]},legs:[196,156,128],shoe:[80,56,40],build:{sh:66,hip:62,h:0.96}},
  spLa2:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:62,skin:[120,84,64],hair:{style:"coily",c:[30,24,22]},
    top:{kind:"suit",c:[120,100,80],inner:[230,210,170],collar:[230,210,170]},bottom:{c:[120,100,80]},shoe:[60,44,34],build:{sh:76,hip:64,h:1.02}},
  spLa3:{name:"",role:"database administrator",side:"",edge:GV_PAST,seed:63,skin:[236,200,176],hair:{style:"long",c:[208,168,100]},
    top:{kind:"sweater",c:[120,138,88]},bottom:{c:[90,80,60]},shoe:[70,52,40],build:{sh:66,hip:60,h:0.95}},
  spLa4:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:64,skin:[226,184,150],hair:{style:"side",c:[100,70,50]},beard:[110,80,56],bigGlasses:[60,50,44],
    top:{kind:"cardigan",c:[150,120,80],inner:[236,220,190],collar:[236,220,190]},bottom:{c:[110,96,74]},shoe:[70,50,36],build:{sh:76,hip:62,h:1.0}},
  spLa5:{name:"",role:"systems analyst",side:"",edge:GV_PAST,seed:65,skin:[190,140,100],hair:{style:"side",c:[40,30,26]},
    top:{kind:"shirt",c:[212,168,108],collar:true},bottom:{c:[80,66,54]},shoe:[60,44,34],build:{sh:74,hip:62,h:0.99}},
  spLa6:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:66,skin:[180,130,100],hair:{style:"coily",c:[50,36,30]},
    top:{kind:"shirt",c:[198,112,88],collar:[244,226,208]},bottom:{kind:"skirt",c:[90,70,60]},legs:[160,116,90],shoe:[70,50,40],build:{sh:64,hip:60,h:0.94}},
  spLa7:{name:"",role:"database administrator",side:"",edge:GV_PAST,seed:67,skin:[238,210,186],hair:{style:"cropped",c:[196,188,178]},bigGlasses:[60,60,60],
    top:{kind:"suit",c:[96,96,90],inner:[240,236,220],collar:[240,236,220]},bottom:{c:[96,96,90]},shoe:[40,36,34],build:{sh:76,hip:62,h:1.01}},
  spLa8:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:68,skin:[140,96,70],hair:{style:"bun",c:[30,24,22]},
    top:{kind:"cardigan",c:[132,104,70],inner:[240,232,220]},bottom:{kind:"skirt",c:[96,74,56]},legs:[120,84,62],shoe:[60,44,34],build:{sh:64,hip:60,h:0.94}},
  spLa9:{name:"",role:"data administrator",side:"",edge:GV_PAST,seed:69,skin:[204,154,122],hair:{style:"side",c:[120,104,88]},beard:[124,106,90],
    top:{kind:"blazer",c:[96,108,130],inner:[236,232,220],collar:[236,232,220]},bottom:{c:[84,84,92]},shoe:[50,40,34],build:{sh:76,hip:62,h:1.0}},
  spLa10:{name:"",role:"database administrator",side:"",edge:GV_PAST,seed:70,skin:[228,186,150],hair:{style:"long",c:[62,42,32]},
    top:{kind:"shirt",c:[164,192,204],collar:[240,240,232]},bottom:{kind:"skirt",c:[92,92,104]},legs:[208,170,140],shoe:[60,44,40],build:{sh:64,hip:60,h:0.95}},
  // 2002, a boardroom: a chief executive and a chief financial officer, in dark suits
  spCeo:{name:"",role:"chief executive",side:"",edge:GV_PAST,seed:71,skin:[232,196,168],hair:{style:"side",c:[150,146,140]},
    top:{kind:"suit",c:[40,44,58],inner:[244,244,246]},bottom:{c:[40,44,58]},shoe:[26,24,24],build:{sh:78,hip:64,h:1.02}},
  spCfo:{name:"",role:"chief financial officer",side:"",edge:GV_PAST,seed:72,skin:[180,128,96],hair:{style:"bob",c:[30,24,22],streak:[86,76,72]},earrings:[230,214,160],
    top:{kind:"suit",c:[50,50,58],inner:[236,236,240]},bottom:{c:[50,50,58]},shoe:[26,24,24],build:{sh:66,hip:60,h:0.96}},
  // 2002, the finance floor behind the boardroom's glass: an accountant, an analyst, a controller
  spFin1:{name:"",role:"accountant",side:"",edge:GV_PAST,seed:77,skin:[198,150,118],hair:{style:"cropped",c:[44,34,30]},
    top:{kind:"shirt",c:[186,204,226]},bottom:{c:[60,64,76]},shoe:[40,36,34],build:{sh:74,hip:62,h:1.0}},
  spFin2:{name:"",role:"financial analyst",side:"",edge:GV_PAST,seed:78,skin:[236,204,178],hair:{style:"bun",c:[120,84,56]},
    top:{kind:"cardigan",c:[176,120,130],inner:[240,236,232]},bottom:{kind:"skirt",c:[70,66,78]},legs:[220,186,160],shoe:[50,40,40],build:{sh:64,hip:60,h:0.95}},
  spFin3:{name:"",role:"financial controller",side:"",edge:GV_PAST,seed:79,skin:[128,88,66],hair:{style:"side",c:[28,24,22]},glasses:[40,40,44],
    top:{kind:"sweater",c:[110,124,146]},bottom:{c:[66,62,58]},shoe:[40,36,34],build:{sh:74,hip:62,h:1.0}},
  // Basel, 2013: the banks' regulators
  spBs1:{name:"",role:"supervisor",side:"",edge:GV_PAST,seed:73,skin:[236,206,184],hair:{style:"bob",c:[180,150,110],streak:[214,192,150]},glasses:[60,60,70],
    top:{kind:"suit",c:[60,70,96],inner:[240,240,244]},bottom:{c:[60,70,96]},shoe:[30,28,30],build:{sh:66,hip:60,h:0.96}},
  spBs2:{name:"",role:"supervisor",side:"",edge:GV_PAST,seed:74,skin:[214,176,144],hair:{style:"cropped",c:[70,60,56]},
    top:{kind:"suit",c:[76,78,86],inner:[236,238,242]},bottom:{c:[76,78,86]},shoe:[30,28,30],build:{sh:76,hip:62,h:1.0}},
  spBs3:{name:"",role:"supervisor",side:"",edge:GV_PAST,seed:75,skin:[150,104,78],hair:{style:"cropped",c:[30,26,24]},beard:[40,32,30],
    top:{kind:"suit",c:[56,60,72],inner:[238,240,244]},bottom:{c:[56,60,72]},shoe:[30,28,30],build:{sh:76,hip:62,h:1.01}},
  spBs4:{name:"",role:"supervisor",side:"",edge:GV_PAST,seed:76,skin:[226,186,160],hair:{style:"long",c:[90,60,40]},
    top:{kind:"blazer",c:[118,42,52],inner:[236,232,226]},bottom:{c:[52,48,56]},shoe:[30,28,30],build:{sh:66,hip:60,h:0.96}},
  // 2017, a team room: smart and casual
  spT1:{name:"",role:"marketing",side:"",edge:GV_PAST,seed:81,skin:[200,150,110],hair:{style:"side",c:[50,40,32]},
    top:{kind:"sweater",c:[70,110,140]},bottom:{c:[60,64,74]},shoe:[50,40,34],build:{sh:76,hip:62,h:1.0}},
  spT2:{name:"",role:"product",side:"",edge:GV_PAST,seed:82,skin:[236,204,180],hair:{style:"long",c:[170,110,60]},
    top:{kind:"blazer",c:[180,140,100],inner:[244,240,232]},bottom:{c:[64,60,70]},shoe:[60,44,36],build:{sh:66,hip:60,h:0.96}},
  spT3:{name:"",role:"analyst",side:"",edge:GV_PAST,seed:83,skin:[130,90,66],hair:{style:"coily",c:[30,24,22]},glasses:[40,40,44],
    top:{kind:"cardigan",c:[210,158,80],inner:[240,236,228]},bottom:{c:[56,56,66]},shoe:[40,34,30],build:{sh:64,hip:60,h:0.95}},
  spT4:{name:"",role:"sales",side:"",edge:GV_PAST,seed:84,skin:[226,190,160],hair:{style:"cropped",c:[120,90,60]},beard:[130,96,64],
    top:{kind:"overshirt",c:[120,130,100],inner:[230,228,220]},bottom:{c:[70,66,60]},shoe:[60,46,36],build:{sh:76,hip:62,h:1.0}},
  // 2018, an office's front desk: its privacy lead, and a customer with a letter
  spPriv:{name:"",role:"privacy lead",side:"",edge:GV_PAST,seed:85,skin:[240,210,190],hair:{style:"bun",c:[70,50,40]},glasses:[50,50,60],
    top:{kind:"blazer",c:[60,90,110],inner:[240,240,236]},bottom:{c:[50,54,64]},shoe:[36,30,30],build:{sh:66,hip:60,h:0.97}},
  spCust:{name:"",role:"customer",side:"",edge:GV_PAST,seed:86,skin:[170,120,90],hair:{style:"side",c:[40,30,28]},
    top:{kind:"overshirt",c:[150,92,72],inner:[220,214,200]},bottom:{c:[60,60,70]},shoe:[50,40,34],build:{sh:76,hip:62,h:1.0}},
  // 2024, a team training a model: the technical side in cyan, the business side in gold
  spMl1:{name:"",role:"machine learning engineer",side:"Technical",edge:TECH,seed:91,skin:[226,190,160],hair:{style:"curly",c:[60,44,36]},
    top:{kind:"sweater",c:[80,100,120]},bottom:{c:[54,58,70]},shoe:[44,40,40],build:{sh:76,hip:62,h:1.0}},
  spMl2:{name:"",role:"product owner",side:"Business",edge:BIZ,seed:92,skin:[176,124,94],hair:{style:"long",c:[36,28,26]},
    top:{kind:"blazer",c:[198,150,90],inner:[240,236,228]},bottom:{c:[60,58,70]},shoe:[50,40,36],build:{sh:66,hip:60,h:0.96}},
  spMl3:{name:"",role:"data scientist",side:"Technical",edge:TECH,seed:93,skin:[236,206,180],hair:{style:"bob",c:[150,80,50],streak:[192,122,90]},glasses:[40,40,48],
    top:{kind:"cardigan",c:[110,140,120],inner:[236,234,226]},bottom:{c:[50,54,64]},shoe:[40,36,36],build:{sh:66,hip:60,h:0.96}}
});
// poses: handing something over, standing, and taking it, seated (the right hand, out and a little down), the seated one looking up
// from her desk first, and reading what she took in one hand; holding a box up to ask about it; at a terminal on one's right, both hands
// on its keys, and looking up from it at something high on the left; holding a cup at the chest; seated, a binder held up at the chest
// with both hands, looking at the one beside, and the right hand out to them, to pass it; standing, the same
Object.assign(POSE,{
  spType:{L:[0.1,-1.9],R:[0.44,1.76],feet:24,shift:0,tilt:0.03,turn:0.35,gaze:[0.85,0.45],look:1},
  spLookCab:{L:[0.12,-0.12],R:[0.16,-0.6],feet:24,shift:0,tilt:-0.04,turn:-0.22,gaze:[-0.7,-0.7],look:0},
  spCup:{L:[0.12,-0.06],R:[0.22,-2.35],feet:28,shift:3,tilt:0.02,turn:0.1,gaze:[0.3,0.1],look:0},
  spGive:{L:[0.13,-0.1],R:[0.8,1.35],feet:28,shift:4,tilt:-0.03,turn:0.2,gaze:[0.6,0.5],look:0},
  spLookUp:{L:[0.16,-2.0],R:[0.3,-1.6],feet:24,shift:0,tilt:0,turn:0.2,gaze:[0.6,-0.3],look:0},
  spTake:{L:[0.16,-2.05],R:[1.25,2.0],feet:24,shift:0,tilt:0.02,turn:0.2,gaze:[0.6,-0.3],look:0},
  spReadOne:{L:[0.16,-2.05],R:[0.2,-2.4],feet:24,shift:0,tilt:0.04,turn:0.05,gaze:[0.3,0.8],look:1},
  spAsk:{L:[0.36,-2.6],R:[0.36,-2.6],feet:28,shift:2,tilt:-0.04,turn:0.05,gaze:[0,-0.3],look:0},
  spShowB:{L:[0.3,-2.5],R:[0.3,-2.5],feet:24,shift:0,tilt:0.02,turn:0.25,gaze:[0.6,0.1],look:0},
  spPassR:{L:[0.12,-0.1],R:[0.1,2.42],feet:24,shift:0,tilt:-0.04,turn:0.3,gaze:[0.7,0.1],look:0},
  spPassS:{L:[0.12,-0.1],R:[0.15,2.5],feet:28,shift:4,tilt:-0.03,turn:0.3,gaze:[0.7,0.1],look:0}
});

/* ---------- the year and the place in the corner ---------- */
// mk: [[time, "place · year"], ...]; the latest one passed, dissolving from the one before
function sp_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1)wc_year(ctx,56,72,mk[i-1][1],a*(1-u));wc_year(ctx,56,72,mk[i][1],a*u);}

/* ---------- a city at night, for the bank's windows and its wide view ---------- */
// the towers of a skyline in a band from x0 to x1 standing on y (base), each [x, w, top, col]; kept with their windows' places
function sp_towers(seed,x0,x1,base,hmin,hmax,wmin,wmax){const R=wc_rng(seed),o=[];let x=x0;while(x<x1){const w=wmin+R()*(wmax-wmin),h=hmin+R()*(hmax-hmin);o.push([x,w,base-h]);x+=w+R()*18;}return o;}
const SP_NIGHT={top:[30,36,72],mid:[58,58,100],low:[122,92,110],glow:[255,206,140],far:[62,70,108],mid2:[46,52,88],near:[36,42,74]};
// a lit window (warm), or a dark one; a tower's windows in rows and columns
function sp_lit(ctx,x,y,w,h,a){ctx.fillStyle=rgba(SP_NIGHT.glow,a);ctx.fillRect(x,y,w,h);}
function sp_paintSky(ctx,x,y,w,h){const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(SP_NIGHT.top,1));g.addColorStop(0.6,rgba(SP_NIGHT.mid,1));g.addColorStop(1,rgba(SP_NIGHT.low,1));
  ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.save();ctx.globalAlpha=0.5;wc_wash(ctx,wc_rect(x,y,w,h),SP_NIGHT.mid,{kind:"plaster",line:false,seed:(x|0)+7});ctx.restore();
  const R=wc_rng((x|0)+11);ctx.fillStyle="rgba(255,250,236,0.5)";for(let i=0;i<w*h/26000;i++){ctx.beginPath();ctx.arc(x+R()*w,y+R()*h*0.5,0.8+R()*0.9,0,TAU);ctx.fill();}}
// a band of towers: each tower a wash, its windows a grid where some are lit (lit is 0 to 1, how many)
function sp_paintTowers(ctx,list,base,col,lit,seed,k){k=k||1;const R=wc_rng(seed);list.forEach(([x,w,top],i)=>{wc_wash(ctx,wc_rect(x,top,w,base-top+20),col,{kind:"build",lw:1.1,seed:seed+i});
    if(R()<0.3)wc_flat(ctx,wc_rect(x+w*0.35,top-26*k,w*0.3,26*k),col,1,"roof");
    const cw=12*k,ch=16*k,gx=8*k,gy=12*k;for(let yy=top+16*k;yy<base-24*k;yy+=ch+gy)for(let xx=x+10*k;xx<x+w-cw-6*k;xx+=cw+gx)if(R()<lit)sp_lit(ctx,xx,yy,cw,ch,0.55+0.4*R());});}
// the night city in a rectangle: the sky, three bands of towers, nearer ones taller and darker; d scales the towers (1 = the wide view)
function sp_paintCity(ctx,x,y,w,h,seed,d){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();sp_paintSky(ctx,x,y,w,h);const base=y+h+10;
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+w/2,base,w*0.7,[150,100,110],0.5);ctx.restore();
  sp_paintTowers(ctx,sp_towers(seed,x-40,x+w+40,base,h*0.18,h*0.42,60*d,120*d),base,SP_NIGHT.far,0.18,seed+1,d*0.8);
  sp_paintTowers(ctx,sp_towers(seed+5,x-60,x+w+60,base,h*0.26,h*0.62,90*d,170*d),base,SP_NIGHT.mid2,0.12,seed+6,d);
  ctx.restore();}

/* ---------- 2008: a bank's risk floor at night ---------- */
// the wide view: the city through tall windows, the floor's far row of desks with their screens' backs and their glow, and the head of
// risk's desk in front (its own layer, riskDesk, drawn over whoever sits at it). SP_RK says where: the windows, the far row, her desk.
const SP_RK={win:[100,590],far:{top:668,foot:840,x0:30,x1:1890},desk:{x0:520,x1:1400,top:792},seat:[960,1.0],lamp:[606,792]};
const SP_WALL08=[198,192,184],SP_CARPET=[98,106,130],SP_OAK08=[212,180,134];
// a screen seen from behind: its dark back and stand; the light it gives off is drawn with the room (sp_screenGlow)
function sp_screenBack(ctx,x,y,w,h){wc_part(ctx,[[x+w/2-12,y+h],[x+w/2+12,y+h],[x+w/2+20,y+h+30],[x+w/2-20,y+h+30]],[58,60,70],1);wc_part(ctx,wc_rrPts(x,y,w,h,8),[52,54,64],1,{kind:"thing",lw:1.2});}
function sp_screenGlow(ctx,x,y,r,a){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,r,[120,170,240],a);ctx.restore();}
// a desk seen from the front: a thin top, two legs, a modesty panel half way down
function sp_deskOpen(ctx,x,w,top,foot,col,seed){wc_contact(ctx,x-10,x+w+10,foot,0.9,0.28);for(const lx of [x+10,x+w-30])wc_part(ctx,wc_rect(lx,top+14,20,foot-top-14),wc_dim(col,0.3),1,{seed:seed+lx});
  wc_part(ctx,wc_rect(x+30,top+16,w-60,(foot-top)*0.46),wc_dim(col,0.12),1,{seed});wc_part(ctx,wc_rect(x-6,top,w+12,18),wc_lit(col,0.14),1,{seed:seed+1});}
// a television hung from the ceiling, its screen dark in the painting; sp_tvNews draws on it, every frame, the markets falling: a red
// line down the screen (u, how far it has run), and a red arrow
const SP_TV=[240,196,300,168];
function sp_tv(ctx){const [x,y,w,h]=SP_TV;wc_part(ctx,wc_rect(x+w/2-6,0,12,y+4),[90,90,96],1,{lw:1});wc_part(ctx,wc_rrPts(x-12,y-12,w+24,h+24,10),[40,42,50],1,{kind:"thing",lw:1.3});
  ctx.fillStyle=rgba([26,34,58],1);ctx.fillRect(x,y,w,h);}
const SP_TVLINE=(()=>{const R=wc_rng(19),o=[];for(let i=0;i<=24;i++){const u=i/24;o.push([u,0.16+0.62*Math.pow(u,1.5)+(R()-0.5)*0.11*(1-0.4*u)]);}return o;})();
function sp_tvNews(ctx,u){const [x,y,w,h]=SP_TV;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+w/2,y+h/2,w*0.8,[90,120,190],0.35);
  ctx.globalCompositeOperation="source-over";ctx.strokeStyle="rgba(150,170,220,0.22)";ctx.lineWidth=1.5;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x+10,y+i*h/4);ctx.lineTo(x+w-10,y+i*h/4);ctx.stroke();}
  const n=Math.max(1,Math.round(u*(SP_TVLINE.length-1)));ctx.strokeStyle=rgba([236,84,70],1);ctx.lineWidth=4;ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();
  for(let i=0;i<=n;i++){const [a,b]=SP_TVLINE[i];if(i)ctx.lineTo(x+18+a*(w-80),y+h*b);else ctx.moveTo(x+18,y+h*b);}ctx.stroke();
  if(u>0.95){ctx.fillStyle=rgba([236,84,70],clamp((u-0.95)/0.05,0,1));ctx.beginPath();ctx.moveTo(x+w-36,y+h-20);ctx.lineTo(x+w-14,y+h-50);ctx.lineTo(x+w-58,y+h-50);ctx.closePath();ctx.fill();}ctx.restore();}
function sp_paintRisk(ctx){const K=SP_RK,[wy0,wy1]=K.win;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  // the city through the windows, the ceiling and its lights, the wall under the windows, the carpet
  sp_paintCity(ctx,0,wy0,W,wy1-wy0,21,0.8);
  wc_wash(ctx,wc_rect(-40,-40,W+80,wy0+40),[110,108,112],{kind:"plaster",line:false,seed:31});for(let x=120;x<W;x+=420){wc_flat(ctx,wc_rect(x,30,220,30),[250,244,226],1,"panel");
    ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+110,70,300,[255,238,200],0.3);ctx.restore();}
  for(let x=0;x<=W;x+=240)wc_part(ctx,wc_rect(x-7,wy0-6,14,wy1-wy0+12),[120,118,122],1,{lw:1});wc_part(ctx,wc_rect(-40,wy0-14,W+80,16),[120,118,122],1);
  sp_tv(ctx);
  wc_wash(ctx,wc_rect(-40,wy1,W+80,K.far.foot-wy1+40),SP_WALL08,{kind:"plaster",line:false,seed:33});wc_part(ctx,wc_rect(-40,wy1,W+80,16),[170,162,152],1);
  wc_wash(ctx,wc_rect(-40,K.far.foot,W+80,H-K.far.foot+40),SP_CARPET,{kind:"ground",line:false,seed:35});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(SP_CARPET,0.2),0.25);ctx.lineWidth=2;for(let i=-16;i<=16;i++){ctx.beginPath();ctx.moveTo(960+i*64,K.far.foot);ctx.lineTo(960+i*210,H+40);ctx.stroke();}ctx.restore();
  // the far row: chairs' backs behind the desks, two screens' backs to each desk and their glow, the desks, a lamp and papers here and there
  const F=K.far,n=6,step=(F.x1-F.x0)/n;for(let i=0;i<n;i++){const x=F.x0+i*step;wc_part(ctx,wc_rrPts(x+step/2-58,F.top-118,116,140,24),[70,74,90],1,{seed:60+i});}
  for(let i=0;i<n;i++){const x=F.x0+i*step;sp_screenGlow(ctx,x+step/2,F.top-80,200,0.32);}
  for(let i=0;i<n;i++){const x=F.x0+i*step;sp_screenBack(ctx,x+step/2-122,F.top-104,112,76);sp_screenBack(ctx,x+step/2+10,F.top-104,112,76);
    sp_deskOpen(ctx,x+12,step-24,F.top,F.foot,[214,206,194],70+i*5);
    if(i%2===0){wc_part(ctx,wc_rect(x+40,F.top-16,90,16),[244,242,236],1,{lw:1});wc_part(ctx,wc_rect(x+46,F.top-28,84,14),[236,234,228],1,{lw:1});}}
  // her chair's back
  const [sx]=K.seat;wc_part(ctx,wc_rrPts(sx-90,K.desk.top-246,180,262,32),[60,64,80],1,{seed:41});}
// her desk, in front of her: a screen's back on the left with its glow, a banker's lamp at the corner in front of it, two stacks of
// printouts on the right, the oak top, the front panel down past the frame's foot
function sp_paintRiskDesk(ctx){const D=SP_RK.desk,top=D.top,[lx,ly]=SP_RK.lamp;sp_screenGlow(ctx,752,top-130,230,0.36);sp_screenBack(ctx,650,top-196,212,150);
  for(const [px,ph,r] of [[1150,46,-0.02],[1244,64,0.03]])wc_part(ctx,[[px-60,top+4],[px+60,top+4],[px+58+r*200,top+4-ph],[px-62+r*200,top+4-ph]],[246,244,238],1,{lw:1.2,seed:px});
  ctx.save();ctx.strokeStyle=rgba([150,146,140],0.6);ctx.lineWidth=1.4;for(const [px,ph] of [[1150,46],[1244,64]])for(let yy=top-6;yy>top+4-ph;yy-=7){ctx.beginPath();ctx.moveTo(px-58,yy);ctx.lineTo(px+58,yy);ctx.stroke();}ctx.restore();
  wc_contact(ctx,D.x0-30,D.x1+30,top+300,0.9,0.3);wc_part(ctx,wc_rect(D.x0+24,top+30,D.x1-D.x0-48,H-top),wc_dim(SP_OAK08,0.18),1,{seed:43});
  // the front: the top's shadow, two raised panels and the grain running across them
  ctx.save();ctx.globalCompositeOperation="multiply";const sg=ctx.createLinearGradient(0,top+30,0,top+90);sg.addColorStop(0,"rgba(90,70,50,0.35)");sg.addColorStop(1,"rgba(90,70,50,0)");
  ctx.fillStyle=sg;ctx.fillRect(D.x0+24,top+30,D.x1-D.x0-48,60);ctx.restore();const pw=(D.x1-D.x0-48-90)/2;
  for(const px of [D.x0+54,D.x0+54+pw+30])wc_part(ctx,wc_rect(px,top+70,pw,H-top-40),wc_dim(SP_OAK08,0.1),1,{lw:1.1,seed:px});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(SP_OAK08,0.35),0.22);ctx.lineWidth=2;for(let y=top+92;y<H;y+=26){ctx.beginPath();ctx.moveTo(D.x0+60,y);for(let x=D.x0+60;x<=D.x1-60;x+=60)ctx.lineTo(x,y+4*Math.sin(x/90+y*0.7));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(D.x0-10,top,D.x1-D.x0+20,34),wc_lit(SP_OAK08,0.1),1,{seed:44});
  // the lamp: a brass foot and stem, a green glass shade, its pull chain
  const brass=[184,146,74],green=[46,112,74];wc_wash(ctx,wc_ell(lx,top+2,52,11,24),brass,{kind:"thing",lw:1.2});wc_part(ctx,wc_rect(lx-5,top-74,10,74),brass,1,{lw:1});
  wc_part(ctx,[[lx-74,top-108],[lx+74,top-108],[lx+92,top-70],[lx-92,top-70]],green,1,{kind:"thing",lw:1.3});wc_flat(ctx,wc_rect(lx-70,top-102,140,8),wc_lit(green,0.45),0.6,"shine");
  wc_part(ctx,wc_rect(lx-94,top-72,188,6),brass,1,{lw:0.8});ctx.save();ctx.strokeStyle=rgba(brass,1);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(lx+50,top-66);ctx.lineTo(lx+50,top-38);ctx.stroke();
  ctx.fillStyle=rgba(brass,1);ctx.beginPath();ctx.arc(lx+50,top-35,4,0,TAU);ctx.fill();ctx.restore();}
// her lamp's light, on (a 0 to 1): warm, on the papers and the desk under it
function sp_lampLight(ctx,a){if(a<=0.01)return;const [lx]=SP_RK.lamp,top=SP_RK.desk.top;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx+20,top-20,320,[255,214,140],0.5*a);
  wc_glowAt(ctx,lx,top-62,90,[255,240,200],0.7*a);ctx.restore();}
// the floor's lights going out, row by row (u 0 to 1): the room darkens, but for her lamp
function sp_lightsOut(ctx,u,lamp){if(u<=0.001)return;ctx.save();ctx.fillStyle=rgba([22,24,44],0.52*u);ctx.fillRect(0,0,W,H);ctx.restore();if(lamp>0){ctx.save();ctx.globalCompositeOperation="screen";
  const [lx]=SP_RK.lamp,top=SP_RK.desk.top;wc_glowAt(ctx,lx+60,top-60,520,[255,206,140],0.3*u*lamp);ctx.restore();}}

// the desk from above, at night: pale laminate under her lamp's warm light, the keyboard's edge, a mug, a pen, the board's card
function sp_paintSpread(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[214,196,166],{kind:"plaster",line:false,seed:51});
  ctx.save();ctx.strokeStyle=rgba([170,146,110],0.22);ctx.lineWidth=2;for(let y=20;y<H;y+=34){ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+3*Math.sin(x/170+y));ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1560,160,1000,[255,224,170],0.32);ctx.restore();ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,1080,900,[110,112,140],0.55);wc_glowAt(ctx,1920,1080,600,[140,140,160],0.35);ctx.restore();
  wc_part(ctx,[[600,-40],[1320,-40],[1310,40],[610,40]],[226,226,230],1,{lw:1.2});ctx.save();ctx.fillStyle=rgba([180,182,190],0.6);for(let i=0;i<14;i++)ctx.fillRect(630+i*48,2,40,26);ctx.restore();
  wc_wash(ctx,wc_ell(1790,196,62,62,30),[236,232,224],{kind:"thing",lw:1.4});wc_wash(ctx,wc_ell(1790,196,48,48,30),[96,66,48],{kind:"thing",line:false,flat:true});
  wc_part(ctx,[[1690,870],[1880,800],[1886,812],[1696,882]],[40,60,110],1,{lw:1.1});}
// the board's card, lying on the desk where she put it down, under the keyboard
function sp_cardOnDesk(ctx,x,y,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(gv_sheetPaper(440,236),-240,-138);
  wc_T(ctx,"From the board",-186,-50,{w:600,size:30,col:WC_MUTED});wc_T(ctx,"How much do we",-186,12,{w:800,size:44,col:WC_DARK});wc_T(ctx,"stand to lose?",-186,66,{w:800,size:44,col:WC_DARK});ctx.restore();}
// a printout from one business line: the line's name on a coloured band at its top, rows of printed figures, and the row with this
// customer, highlighted, under its own code; a, the sheet's arrival (0 to 1), slid up onto the desk from below, never across the board's card; hi, the highlight. SP_SHEET: its size, and where the code is.
const SP_LINES=[["treasury","client 0042",[72,130,190]],["markets","CPTY-A17",[180,96,60]],["lending","acct 9-310",[60,140,100]],["abroad","K-77/2",[140,96,170]]];
const SP_SHEET={w:380,h:470,code:250};
function sp_printout(ctx,i,x,y,rot,a,hi){if(a<=0.01)return;const [line,code,col]=SP_LINES[i],{w,h}=SP_SHEET,cy=SP_SHEET.code,u=easeCam(clamp(a,0,1));
  ctx.save();ctx.translate(x+w/2+(1-u)*(i<2?-160:160),y+h/2+(1-u)*460);ctx.rotate(rot*(0.3+0.7*u));withA(ctx,clamp(a*3,0,1),()=>{
    ctx.drawImage(gv_sheetPaper(w,h),-w/2-20,-h/2-20);wc_flat(ctx,wc_rect(-w/2+14,-h/2+14,w-28,64),col,1,"band");
    wc_T(ctx,line,-w/2+34,-h/2+58,{w:800,size:36,col:[255,255,255]});
    gv_lines(ctx,-w/2+34,-h/2+108,w-80,4,24,0.9);
    if(hi>0)wc_wash(ctx,wc_rect(-w/2+22,-h/2+cy-38,(w-44)*easeCam(clamp(hi,0,1)),56),[252,226,96],{kind:"swatch",line:false,a:0.75,seed:60+i});
    wc_T(ctx,code,-w/2+34,-h/2+cy,{w:600,size:32,f:"mono",col:WC_DARK});
    gv_lines(ctx,-w/2+34,-h/2+cy+56,w-80,6,24,0.9);});
  ctx.restore();}

// the head of risk's whiteboard, close, and the desk calendar on the edge of her desk; what's written on them is drawn every frame
const SP_WB={board:[110,70,1360,700],cal:[1560,606,250,240],top:830};
function sp_paintBoard08(ctx){const B=SP_WB,[bx,by,bw,bh]=B.board;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),SP_WALL08,{kind:"plaster",line:false,seed:55});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1760,860,760,[255,214,150],0.34);ctx.restore();ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,0,900,[150,150,170],0.35);ctx.restore();
  wc_part(ctx,wc_rect(bx-14,by-14,bw+28,bh+28),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(bx,by,bw,bh),[250,251,250],1,"board");
  wc_part(ctx,wc_rect(bx+bw*0.3,by+bh+12,bw*0.4,14),GV.metal,1);for(const [mx,c] of [[bx+bw*0.36,[204,62,50]],[bx+bw*0.42,[50,90,170]],[bx+bw*0.48,[40,40,48]]])wc_flat(ctx,wc_rect(mx,by+bh+2,40,12),c,1,"marker");
  // the desk's edge across the foot of the frame, under the calendar
  wc_part(ctx,wc_rect(-40,B.top+26,W+80,H-B.top+40),wc_dim(SP_OAK08,0.18),1,{seed:57});wc_part(ctx,wc_rect(-40,B.top,W+80,30),wc_lit(SP_OAK08,0.1),1,{seed:58});}
// the calendar: a stand, and the day's page; the page turns over its top from one day to the next (u 0 to 1), its day squashed as it
// goes, so not read then
function sp_calendar(ctx,from,to,u){const [x,y,w,h]=SP_WB.cal;wc_part(ctx,[[x-12,y+h],[x+w+12,y+h],[x+w-20,y+h-30],[x+20,y+h-30]],[60,62,70],1);
  const page=(s,k,a)=>{if(a<=0.01)return;ctx.save();ctx.translate(x+w/2,y);ctx.scale(1,Math.max(0.02,k));withA(ctx,a,()=>{ctx.fillStyle=rgba(WC_CARD,1);ctx.fillRect(-w/2,0,w,h-30);
    ctx.fillStyle=rgba([204,62,50],1);ctx.fillRect(-w/2,0,w,40);ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2;ctx.strokeRect(-w/2,0,w,h-30);
    wc_T(ctx,s,0,(h-30)*0.68,{w:800,size:76,align:"center",col:WC_DARK,deco:k<0.999?1:0});});ctx.restore();};
  if(u<=0||from===to)page(to,1,1);else{page(to,1,1);page(from,Math.cos(u*Math.PI/2),1);}
  for(let i=0;i<9;i++){ctx.fillStyle=rgba([90,90,100],1);ctx.beginPath();ctx.arc(x+24+i*(w-48)/8,y,5,0,TAU);ctx.fill();}}

// the city, wide, at night: the bank's tower near on the left with its one lit floor; towers all round, most of their windows dark
const SP_CT={bank:[90,430,150],floor:[300,446,330,40]},SP_CITY2=sp_towers(75,500,W+60,1100,380,760,140,260);
function sp_paintCityWide(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);sp_paintSky(ctx,0,0,W,H);
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,960,1100,1300,[160,110,120],0.5);ctx.restore();
  sp_paintTowers(ctx,sp_towers(71,-40,W+40,1090,260,520,90,170),1090,SP_NIGHT.far,0.1,72,0.9);
  sp_paintTowers(ctx,SP_CITY2,1100,SP_NIGHT.mid2,0.06,76,1.1);
  // the bank's tower: a dark wash, rows of dark windows, and one floor lit across
  const [bx,bw,bt]=SP_CT.bank;wc_wash(ctx,wc_rect(bx,bt,bw,H-bt+40),SP_NIGHT.near,{kind:"build",lw:1.4,seed:77});wc_flat(ctx,wc_rect(bx+bw*0.3,bt-40,bw*0.4,40),SP_NIGHT.near,1,"roof");
  ctx.fillStyle=rgba([70,78,110],0.7);for(let yy=bt+30;yy<H;yy+=46)for(let xx=bx+20;xx<bx+bw-30;xx+=34)ctx.fillRect(xx,yy,20,24);
  const [fx,fy,fw,fh]=SP_CT.floor;sp_lit(ctx,bx+16,fy,bw-32,fh,0.92);ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,bx+bw/2,fy+fh/2,300,[255,210,140],0.4);ctx.restore();
  // inside, against the light: the backs of the screens along the desks, and one person still at hers, by a lamp
  ctx.fillStyle=rgba([70,56,60],0.75);for(let xx=bx+28;xx<bx+bw-30;xx+=46){ctx.fillRect(xx,fy+fh-15,17,11);ctx.fillRect(xx+7,fy+fh-4,3,4);}
  const px=bx+bw*0.58;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,px+22,fy+fh-14,26,[255,236,190],0.9);ctx.restore();
  ctx.fillStyle=rgba([62,48,54],0.9);ctx.beginPath();ctx.arc(px,fy+fh-24,5,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(px-10,fy+fh);ctx.quadraticCurveTo(px-10,fy+fh-17,px,fy+fh-17);ctx.quadraticCurveTo(px+10,fy+fh-17,px+10,fy+fh);ctx.fill();
  ctx.fillStyle=rgba(SP_NIGHT.near,0.9);for(let xx=bx+16;xx<bx+bw-16;xx+=34)ctx.fillRect(xx+22,fy,6,fh);}
// the windows that light one after another in the other towers, on their own grids: [x, y, when], kept once
const SP_LATE=(()=>{const R=wc_rng(91),o=[],k=1.1,cw=12*k,ch=16*k,gx=8*k,gy=12*k;SP_CITY2.forEach(([x,w,top])=>{for(let yy=top+16*k;yy<1100-24*k;yy+=ch+gy)for(let xx=x+10*k;xx<x+w-cw-6*k;xx+=cw+gx)if(R()<0.16)o.push([xx,yy,R()]);});return o;})();
function sp_lateWindows(ctx,u){if(u<=0)return;const k=1.1;SP_LATE.forEach(([x,y,w])=>{const a=clamp((u-w*0.85)/0.15,0,1);if(a>0)sp_lit(ctx,x,y,12*k,16*k,0.85*a);});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1250,760,900,[255,200,130],0.1*u);ctx.restore();}

/* ---------- the 1970s: an office floor that begins to share its data ---------- */
// three departments round one shared computer: sales on the left, shipping on the right, accounts in front; the computer stands on its
// raised floor at the back, its tape reels behind glass, and each department's sign hangs from the ceiling. The desks and their
// terminals are a layer of their own (desks70), drawn over the people at them. SP_70 says where: the wall's foot, the computer
// [x, y, w, h], and each desk: who sits at it, its span and top, the seat [x, scale], the terminal [x, scale, which way its screen
// faces: 1 to the right], the sign's middle and name.
const SP_70={fy:690,cab:[760,230,400,410],desks:[
  {id:"spSales",x0:60,x1:600,top:770,seat:[400,0.86],term:[110,0.72,1],sign:[420,"sales"]},
  {id:"spShip",x0:1320,x1:1860,top:770,seat:[1520,0.86],term:[1810,0.72,-1],sign:[1520,"shipping"]},
  {id:"spAcct",x0:620,x1:1300,top:870,seat:[1010,0.95],term:[700,0.82,1],sign:[1100,"accounts"]}]};
const SP_WALL70=[232,208,156],SP_WOOD70=[134,90,56],SP_CARPET70=[158,104,60],SP_DESK70=[190,146,98],SP_BEIGE=[228,216,190],SP_CAB=[186,196,202],SP_SIGN70=[150,92,52];
// a window with its venetian blind two thirds down: the far side of the street in daylight, then the slats, the cord
function sp_blinds(ctx,x,y,w,h,seed){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgb(204,218,228)");g.addColorStop(1,"rgb(234,236,228)");
  ctx.fillStyle=g;ctx.fillRect(x,y,w,h);const R=wc_rng(seed);for(let bx=x-20;bx<x+w;bx+=90+R()*60){const bh=h*(0.4+R()*0.5);wc_part(ctx,wc_rect(bx,y+h-bh,80+R()*40,bh+10),[198,190,176],0.4,{line:false,seed:seed+bx});}
  const down=y+h*0.66;for(let sy=y+4;sy<down;sy+=15){ctx.fillStyle="rgba(240,230,206,0.92)";ctx.fillRect(x,sy,w,10);ctx.fillStyle="rgba(150,130,100,0.35)";ctx.fillRect(x,sy+10,w,1.5);}
  ctx.fillStyle="rgba(150,130,100,0.6)";ctx.fillRect(x,down,w,6);ctx.restore();
  for(const r of [wc_rect(x-12,y-12,w+24,12),wc_rect(x-12,y-12,12,h+24),wc_rect(x+w,y-12,12,h+24),wc_rect(x-12,y+h,w+24,12)])wc_part(ctx,r,[176,170,160],1,{lw:1.1});
  ctx.save();ctx.strokeStyle="rgba(120,110,96,0.7)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+w-24,y);ctx.lineTo(x+w-24,y+h*0.8);ctx.stroke();ctx.restore();}
// a video terminal of the time on a desk whose top is at y: a deep beige box, its screen turned to whoever sits beside it (face 1: to
// the right) with lines of green text, and its keyboard in front, towards them
function sp_terminal(ctx,x,y,s,face){ctx.save();ctx.translate(x,y);ctx.scale(face*s,s);
  wc_part(ctx,[[0,-8],[0,-140],[96,-158],[100,0]],wc_dim(SP_BEIGE,0.1),1,{kind:"thing",lw:1.4,seed:3});
  wc_part(ctx,[[0,-140],[34,-152],[150,-166],[96,-158]],wc_lit(SP_BEIGE,0.12),1,{kind:"thing",lw:1.2,seed:5});
  wc_part(ctx,[[96,-158],[150,-166],[154,-10],[100,0]],SP_BEIGE,1,{kind:"thing",lw:1.4,seed:7});
  wc_flat(ctx,[[106,-146],[144,-151],[146,-62],[108,-58]],[24,46,34],1,"screen");
  ctx.strokeStyle="rgba(120,232,150,0.75)";ctx.lineWidth=2.4;for(let i=0;i<6;i++){const yy=-136+i*12,l=0.4+0.5*((i*37)%7)/7;ctx.beginPath();ctx.moveTo(112,yy);ctx.lineTo(112+28*l,yy-1);ctx.stroke();}
  wc_part(ctx,[[106,-2],[214,-14],[228,12],[114,22]],wc_lit(SP_BEIGE,0.05),1,{kind:"thing",lw:1.2,seed:9});
  ctx.fillStyle="rgba(120,108,90,0.55)";for(let r=0;r<3;r++)for(let k=0;k<7;k++)ctx.fillRect(118+k*14+r*3,-2+r*7-k*1.4,10,4);ctx.restore();}
// a terminal screen's green light, on the desk and on whoever sits at it
function sp_termGlow(ctx,d,a){const [x,s,f]=d.term;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+f*s*126,d.top-100*s,190,[110,220,150],0.22*a);ctx.restore();}
// the shared computer on its raised floor: a tape drive's two reels behind glass with the columns under them, a panel of lamps
// (sp_blink lights them, every frame), and plain doors under the lamps
function sp_computer(ctx){const [x,y,w,h]=SP_70.cab,fy=y+h,gx=x+18,gy=y+30,gw=w*0.48,gh=150,px=x+w*0.55,pw=w*0.4;
  wc_part(ctx,wc_rect(x-70,fy,w+140,50),[176,174,166],1,{lw:1.2,seed:81});wc_flat(ctx,wc_rect(x-70,fy,w+140,8),wc_lit([176,174,166],0.2),1,"edge");
  ctx.fillStyle="rgba(90,86,80,0.35)";for(let vx=x-50;vx<x+w+60;vx+=40)ctx.fillRect(vx,fy+20,24,6);wc_contact(ctx,x-20,x+w+20,fy+2,0.9,0.32);
  wc_part(ctx,wc_rect(x,y,w,h),SP_CAB,1,{kind:"thing",lw:1.6,seed:83});wc_part(ctx,wc_rect(x-6,y-14,w+12,24),wc_dim(SP_CAB,0.3),1,{lw:1.2,seed:84});
  wc_flat(ctx,wc_rect(gx,gy,gw,gh),[64,74,86],1,"glass");
  for(const rx of [gx+gw*0.27,gx+gw*0.73]){const ry=gy+gh*0.48;wc_wash(ctx,wc_ell(rx,ry,44,44,30),[214,218,222],{kind:"thing",lw:1.3,seed:rx|0});
    wc_wash(ctx,wc_ell(rx,ry,34,34,30),[70,56,48],{kind:"thing",line:false,flat:true,seed:(rx|0)+1});wc_wash(ctx,wc_ell(rx,ry,12,12,16),[226,230,234],{kind:"thing",lw:1,seed:(rx|0)+2});}
  ctx.save();ctx.globalCompositeOperation="screen";ctx.fillStyle="rgba(255,255,255,0.16)";ctx.beginPath();ctx.moveTo(gx+20,gy);ctx.lineTo(gx+70,gy);ctx.lineTo(gx+20,gy+gh);ctx.lineTo(gx-30,gy+gh);ctx.closePath();ctx.fill();ctx.restore();
  for(const cx of [gx+gw*0.3,gx+gw*0.7])wc_flat(ctx,wc_rect(cx-14,gy+gh+24,28,h-gh-80),[96,104,112],1,"column");
  wc_flat(ctx,wc_rect(px,gy,pw,96),[58,62,72],1,"panel");wc_part(ctx,wc_rect(px,gy+116,pw,h-146),wc_lit(SP_CAB,0.06),1,{lw:1.1,seed:86});
  ctx.save();ctx.strokeStyle="rgba(90,96,104,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px+pw/2,gy+120);ctx.lineTo(px+pw/2,fy-34);ctx.stroke();ctx.restore();
  for(const hx of [px+pw/2-22,px+pw/2+12])wc_flat(ctx,wc_rect(hx,gy+250,10,40),[110,114,120],1,"handle");}
function sp_blink(ctx,t){const [x,y,w]=SP_70.cab,px=x+w*0.55+14,py=y+46,cols=[[236,84,60],[250,190,70],[120,220,120],[240,240,226]];
  for(let j=0;j<4;j++)for(let i=0;i<8;i++){const h=Math.sin(i*12.9898+j*78.233)*43758.5453,f=h-Math.floor(h),on=Math.sin(t*(1.2+f*3.4)+f*20)>0.1;
    ctx.fillStyle=rgba(cols[(i+j*3)%4],on?0.95:0.22);ctx.beginPath();ctx.arc(px+i*18,py+j*20,4.5,0,TAU);ctx.fill();}}
// a department's sign, hanging from the ceiling on two strings: its board painted, its name written every frame (sp_signName)
function sp_signBoard(ctx,x){ctx.save();ctx.strokeStyle="rgba(80,70,60,0.6)";ctx.lineWidth=2;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(x+s*90,20);ctx.lineTo(x+s*90,76);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(x-130,74,260,66),SP_SIGN70,1,{kind:"thing",lw:1.4,seed:x|0});}
function sp_signName(ctx,x,s){wc_T(ctx,s,x,121,{w:700,size:40,align:"center",col:[252,240,214]});}
function sp_paintOffice70(ctx){const K=SP_70,fy=K.fy;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  // the wall, the panelling under the windows, the carpet, the ceiling and its strip lights
  wc_wash(ctx,wc_rect(-40,-40,W+80,fy+40),SP_WALL70,{kind:"plaster",line:false,seed:101});wc_wash(ctx,wc_rect(-40,470,W+80,fy-470),SP_WOOD70,{kind:"build",line:false,seed:103});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(SP_WOOD70,0.35),0.45);ctx.lineWidth=2;for(let gx=20;gx<W;gx+=64){ctx.beginPath();ctx.moveTo(gx,474);ctx.lineTo(gx,fy);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(-40,456,W+80,18),wc_lit(SP_WOOD70,0.1),1,{lw:1.2,seed:104});wc_wash(ctx,wc_rect(-40,fy,W+80,H-fy+40),SP_CARPET70,{kind:"ground",line:false,seed:105});
  wc_wash(ctx,wc_rect(-40,-40,W+80,74),[238,232,214],{kind:"plaster",line:false,seed:107});
  for(const lx of [150,640,1180,1670]){wc_flat(ctx,wc_rect(lx,6,220,20),[252,250,240],1,"tube");ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx+110,40,300,[255,250,226],0.35);ctx.restore();}
  // the windows; between them a print of a sunset and the clock; the computer; the signs
  sp_blinds(ctx,90,150,450,290,111);sp_blinds(ctx,1380,150,450,290,113);
  wc_part(ctx,wc_rect(568,232,164,134),[110,74,46],1,{lw:1.2,seed:115});wc_flat(ctx,wc_rect(580,244,140,110),[244,184,104],1,"print");
  wc_wash(ctx,wc_ell(650,318,28,28,24),[252,226,150],{kind:"thing",line:false,flat:true,seed:116});wc_flat(ctx,[[580,354],[580,330],[612,318],[650,336],[692,314],[720,330],[720,354]],[150,84,56],1,"hills");
  wc_wash(ctx,wc_ell(1270,300,60,60,40),[120,84,52],{kind:"thing",lw:1.4,seed:117});wc_wash(ctx,wc_ell(1270,300,50,50,40),[250,246,236],{kind:"thing",line:false,flat:true,seed:118});
  ctx.save();ctx.strokeStyle="rgba(60,50,44,0.85)";ctx.lineCap="round";for(let i=0;i<12;i++){const a=i*TAU/12;ctx.lineWidth=i%3?2:3.5;ctx.beginPath();ctx.moveTo(1270+Math.cos(a)*40,300+Math.sin(a)*40);
    ctx.lineTo(1270+Math.cos(a)*46,300+Math.sin(a)*46);ctx.stroke();}ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(1270,300);ctx.lineTo(1270+Math.cos(-1.2)*26,300+Math.sin(-1.2)*26);ctx.stroke();
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1270,300);ctx.lineTo(1270+Math.cos(-0.1)*38,300+Math.sin(-0.1)*38);ctx.stroke();ctx.restore();
  sp_computer(ctx);K.desks.forEach(d=>sp_signBoard(ctx,d.sign[0]));
  // the chairs' backs, orange, behind the desks
  K.desks.forEach((d,i)=>{const [sx,s]=d.seat;wc_part(ctx,wc_rrPts(sx-78*s,d.top-250*s,156*s,260*s,30*s),[204,112,54],1,{seed:120+i});});}
// the desks, over the people at them: a laminate top, a panel down to the floor, a pedestal of drawers; on each its terminal, and what
// the department keeps there: a telephone in sales, an in-tray in accounts, a pile of delivery notes in shipping, and mugs
function sp_paintDesks70(ctx){SP_70.desks.forEach((d,i)=>{const {x0,x1,top}=d,foot=top+(top>800?300:190),col=SP_DESK70,dx=d.term[2]>0?x1-190:x0+20;
    wc_contact(ctx,x0-20,x1+20,foot,0.9,0.3);wc_part(ctx,wc_rect(x0+20,top+20,x1-x0-40,foot-top-20),wc_dim(col,0.18),1,{seed:130+i});
    wc_part(ctx,wc_rect(dx,top+20,170,foot-top-20),wc_dim(col,0.08),1,{seed:133+i});for(let k=0;k<3;k++)wc_flat(ctx,wc_rect(dx+55,top+50+k*(foot-top-40)/3,60,8),wc_dim(col,0.45),1,"handle");
    wc_part(ctx,wc_rect(x0-8,top,x1-x0+16,24),wc_lit(col,0.1),1,{seed:136+i});sp_terminal(ctx,d.term[0],top+4,d.term[1],d.term[2]);});
  const red=[214,96,52],px=556,py=774;wc_part(ctx,[[px-44,py],[px+44,py],[px+34,py-34],[px-34,py-34]],red,1,{kind:"thing",lw:1.3,seed:141});
  wc_part(ctx,[[px-50,py-30],[px+50,py-30],[px+42,py-50],[px-42,py-50]],wc_dim(red,0.15),1,{kind:"thing",lw:1.2,seed:142});wc_wash(ctx,wc_ell(px,py-15,17,11,20),[240,232,214],{kind:"thing",lw:1,seed:143});
  wc_part(ctx,wc_rect(1170,836,120,38),[150,150,150],1,{kind:"thing",lw:1.2,seed:144});for(let k=0;k<4;k++)wc_flat(ctx,wc_rect(1178+k*2,842-k*5,104,8),[250,248,240],1,"sheet");
  for(let k=0;k<6;k++)wc_flat(ctx,wc_rect(1360+(k%2)*6,766-k*7,110,8),k%2?[252,222,190]:[250,240,170],1,"sheet");
  gv_mug(ctx,476,774,[110,150,90]);gv_mug(ctx,1240,874-40,[200,120,60],true);}
// a pencil line from each terminal to the computer: where it starts, where it bends towards, where it lands; u draws them one by one
const SP_LINKS70=[[[165,660],[300,120],[905,222]],[[1755,660],[1620,120],[1015,222]],[[762,748],[560,300],[935,226]]];
function sp_links70(ctx,u){SP_LINKS70.forEach(([a,c,b],i)=>{const p=clamp(u*1.9-i*0.45,0,1);if(p<=0)return;const pts=[];
    for(let k=0;k<=24;k++){const v=k/24;pts.push([(1-v)*(1-v)*a[0]+2*v*(1-v)*c[0]+v*v*b[0],(1-v)*(1-v)*a[1]+2*v*(1-v)*c[1]+v*v*b[1]]);}
    wc_pencil(ctx,pts,p,{lw:3.6,col:[70,64,80],seed:41+i});ctx.save();ctx.fillStyle=rgba([70,64,80],0.9);ctx.beginPath();ctx.arc(a[0],a[1],6,0,TAU);ctx.fill();
    if(p>=1){ctx.beginPath();ctx.arc(b[0],b[1],6,0,TAU);ctx.fill();}ctx.restore();});}
// a note stuck on with a strip of tape: handwriting on a coloured slip, landing a little large and settling (p 0 to 1)
function sp_slip(ctx,x,y,w,h,col,rot,lines,size,p,seed){if(p<=0.01)return;const k=lerp(1.25,1,1-Math.pow(1-clamp(p,0,1),3));ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(k,k);
  withA(ctx,clamp(p*2,0,1),()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",wash:col,washA:0.6,seed});ctx.fillStyle="rgba(240,236,220,0.65)";ctx.fillRect(-30,-h/2-10,60,22);
    lines.forEach((l,i)=>wc_hand(ctx,l,-w/2+22,-h/2+size*1.15+i*size*1.18,{size,col:WC_DARK,w:600}));});ctx.restore();}

/* ---------- the 1970s: the data administrator's office ---------- */
// seen from the corridor: her door, its glass lettered with the job's name, and the glass wall of her office; inside, shelves of binders,
// a window with its blind, her desk with a typewriter, a lamp and the dictionary open in front of her. Her desk, the glass, its frame
// and the panel under it are a layer of their own (adminFront70), over her. SP_AD: the door and its pane, the glass, her desk's top
// and span, her seat [x, scale], her lamp.
const SP_AD={door:[60,160,320,700],pane:[92,210,256,262],glass:[420,150,1460,610],floor:860,top:700,desk:[860,1620],seat:[1180,0.9],lamp:[1450,700]};
const SP_AVO=[198,198,148];
function sp_paintAdmin70(ctx){const A=SP_AD,[gx,gy,gw,gh]=A.glass;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,A.floor+40),SP_WALL70,{kind:"plaster",line:false,seed:151});wc_wash(ctx,wc_rect(-40,A.floor,W+80,H-A.floor+40),SP_CARPET70,{kind:"ground",line:false,seed:152});
  wc_wash(ctx,wc_rect(-40,A.floor-16,W+80,18),wc_dim(SP_WALL70,0.25),{kind:"trim",line:false,flat:true});
  // inside, through the glass: her wall, her shelves of binders, her window, her chair's back
  ctx.save();ctx.beginPath();ctx.rect(gx,gy,gw,gh);ctx.clip();wc_wash(ctx,wc_rect(gx-20,gy-20,gw+40,gh+40),SP_AVO,{kind:"plaster",line:false,seed:153});
  gv_bookcase(ctx,470,760,500,560,[330,470,610],{col:[150,104,66]});const R=wc_rng(155),bc=[[200,110,50],[150,84,44],[214,170,70],[120,130,80],[236,220,190],[170,70,50]];
  for(const sy of [330,470,610]){let bx=500;while(bx<930){const bw=26+R()*10,bh=104+R()*16;gv_binder(ctx,bx,sy-bh,bw,bh,bc[Math.floor(R()*bc.length)]);bx+=bw+3;}}
  sp_blinds(ctx,1490,210,330,300,157);wc_part(ctx,wc_rrPts(A.seat[0]-74,A.top-236,148,250,28),[150,84,44],1,{seed:158});ctx.restore();
  // her door: the frame, the wood, the pane of frosted glass with a gold rule under where its lettering goes, the handle
  const [dx,dy,dw,dh]=A.door,[qx,qy,qw,qh]=A.pane;wc_wash(ctx,wc_rect(dx-18,dy-18,dw+36,dh+18),[206,176,124],{kind:"trim",lw:1.5});wc_wash(ctx,wc_rect(dx,dy,dw,dh),[146,98,58],{kind:"door",lw:1.6,seed:159});
  wc_flat(ctx,wc_rect(qx-8,qy-8,qw+16,qh+16),[120,80,48],1,"frame");wc_flat(ctx,wc_rect(qx,qy,qw,qh),[220,226,222],1,"glass");
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,qx+qw*0.6,qy+qh*0.4,200,[255,250,230],0.3);ctx.restore();
  ctx.fillStyle=rgba([170,124,40],0.9);ctx.fillRect(qx+40,qy+176,qw-80,3);wc_part(ctx,wc_rect(dx+dw-46,dy+dh*0.52,30,14),[200,170,100],1,{kind:"thing",lw:1.1});
  wc_part(ctx,wc_rect(dx+30,dy+dh*0.62,dw-60,dh*0.3),wc_dim([146,98,58],0.08),1,{lw:1.1,seed:160});}
// over her: her desk and what's on it, then the glass with its light, its frame and mullion, and the panel under it
function sp_paintAdminFront70(ctx){const A=SP_AD,[gx,gy,gw,gh]=A.glass,[x0,x1]=A.desk,top=A.top,col=[176,128,84];
  ctx.save();ctx.beginPath();ctx.rect(gx,gy,gw,gh);ctx.clip();
  wc_part(ctx,wc_rect(x0+20,top+20,x1-x0-40,200),wc_dim(col,0.2),1,{seed:161});wc_part(ctx,wc_rect(x0-8,top,x1-x0+16,24),wc_lit(col,0.1),1,{seed:162});
  // a typewriter on the left, a stack of binders on the right, the lamp, and the dictionary open in front of her
  const tx=876;wc_part(ctx,[[tx,top+4],[tx+170,top+4],[tx+160,top-50],[tx+10,top-50]],[96,104,96],1,{kind:"thing",lw:1.3,seed:163});
  wc_part(ctx,wc_rect(tx+20,top-92,130,46),[236,234,226],1,{lw:1.1,seed:164});wc_part(ctx,wc_rect(tx-6,top-62,182,14),[70,76,70],1,{lw:1.1,seed:165});
  ctx.fillStyle="rgba(230,226,214,0.6)";for(let r=0;r<3;r++)for(let k=0;k<9;k++){ctx.beginPath();ctx.arc(tx+30+k*14+r*4,top-38+r*11,3.6,0,TAU);ctx.fill();}
  for(let k=0;k<4;k++)gv_book(ctx,1500+(k%2)*8,top+2-k*16,104,[[200,110,50],[120,130,80],[214,170,70],[150,84,44]][k]);
  const [lx]=A.lamp;wc_part(ctx,wc_rect(lx-5,top-120,10,120),[60,54,50],1,{lw:1});wc_wash(ctx,wc_ell(lx,top+2,38,8,20),[60,54,50],{kind:"thing",lw:1.1});
  wc_wash(ctx,[[lx-64,top-96],[lx-48,top-132],[lx,top-148],[lx+48,top-132],[lx+64,top-96]],[226,120,44],{kind:"thing",lw:1.3,seed:166});
  wc_part(ctx,[[1086,top+6],[1180,top+10],[1280,top+6],[1270,top-14],[1180,top-8],[1096,top-14]],[250,248,240],1,{lw:1.2,seed:167});
  wc_part(ctx,[[1070,top+12],[1290,top+12],[1286,top+4],[1074,top+4]],[176,92,48],1,{lw:1,seed:168});ctx.restore();
  // the glass: a cool tint, two streaks of light; the frame, the mullion; the panel under the glass
  ctx.save();ctx.fillStyle="rgba(200,226,232,0.12)";ctx.fillRect(gx,gy,gw,gh);ctx.globalCompositeOperation="screen";
  for(const [sx,sw] of [[520,90],[640,36],[1300,110],[1440,40]]){ctx.fillStyle="rgba(255,255,255,0.13)";ctx.beginPath();ctx.moveTo(sx,gy);ctx.lineTo(sx+sw,gy);ctx.lineTo(sx+sw-260,gy+gh);ctx.lineTo(sx-260,gy+gh);ctx.closePath();ctx.fill();}ctx.restore();
  for(const r of [wc_rect(gx-16,gy-16,gw+32,16),wc_rect(gx-16,gy-16,16,gh+32),wc_rect(gx+gw,gy-16,16,gh+32),wc_rect(1069,gy,12,gh)])wc_part(ctx,r,[184,182,174],1,{lw:1.2});
  wc_part(ctx,wc_rect(gx-16,gy+gh,gw+32,A.floor-gy-gh),[146,104,64],1,{seed:169});ctx.save();ctx.strokeStyle=rgba([100,70,44],0.45);ctx.lineWidth=2;for(let x=gx+40;x<gx+gw;x+=64){ctx.beginPath();ctx.moveTo(x,gy+gh+6);ctx.lineTo(x,A.floor-4);ctx.stroke();}ctx.restore();}
// her lamp's warm light, and the lettering on her door's glass, in gold
function sp_adminLamp(ctx,a){const [lx]=SP_AD.lamp,top=SP_AD.top;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx,top-60,300,[255,200,120],0.42*a);wc_glowAt(ctx,lx,top-100,70,[255,236,190],0.6*a);ctx.restore();}
function sp_doorName(ctx){const [qx,qy,qw]=SP_AD.pane,gold=[132,92,22];wc_T(ctx,"Data",qx+qw/2,qy+112,{w:700,size:40,f:"serif",align:"center",col:gold});
  wc_T(ctx,"administration",qx+qw/2,qy+160,{w:700,size:34,f:"serif",align:"center",col:gold});}

/* ---------- the 1970s: the dictionary, open on her desk ---------- */
// from above: the desk and its green blotter, the binder's covers, two typed pages of words and what they mean, the rings; her mug and
// a pencil. The page's title and the new entry she writes on the right page are drawn every frame.
const SP_DC={left:[300,110,640,860],right:[980,110,640,860],rings:[300,540,780]};
function sp_paintDict70(ctx){const D=SP_DC;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[184,138,92],{kind:"plaster",line:false,seed:171});
  ctx.save();ctx.strokeStyle=rgba([140,100,62],0.25);ctx.lineWidth=2;for(let y=14;y<H;y+=30){ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+3*Math.sin(x/150+y));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(170,20,1580,1100),[62,96,72],1,{seed:172});ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(40,30,20,0.35)";rr(ctx,262,96,1420,930,24);ctx.fill();ctx.restore();
  wc_part(ctx,wc_rrPts(250,72,1420,946,22),[176,92,48],1,{kind:"cover",lw:1.5,seed:173});wc_flat(ctx,wc_rect(938,84,44,920),wc_dim([176,92,48],0.25),1,"spine");
  for(const [x,y,w,h] of [D.left,D.right]){ctx.save();ctx.filter="blur(6px)";ctx.fillStyle="rgba(60,40,30,0.25)";ctx.fillRect(x+6,y+8,w,h);ctx.restore();wc_wash(ctx,wc_rect(x,y,w,h),[252,250,244],{kind:"page",lw:1.3,seed:x});}
  for(const ry of D.rings){for(const hx of [D.left[0]+D.left[2]-26,D.right[0]+26]){ctx.fillStyle="rgba(90,80,70,0.55)";ctx.beginPath();ctx.arc(hx,ry,9,0,TAU);ctx.fill();}
    wc_wash(ctx,wc_ell(960,ry,46,20,24),[206,210,216],{kind:"thing",lw:1.3,seed:ry});wc_wash(ctx,wc_ell(960,ry,34,11,24),[176,92,48],{kind:"thing",line:false,flat:true,seed:ry+1});}
  // the typed entries: each a word in capitals (a short dark bar) and two or three lines of what it means
  const typed=(x,y,n)=>{for(let i=0;i<n;i++){const by=y+i*128;ctx.fillStyle=rgba([60,56,52],0.6);ctx.fillRect(x,by,90+((i*53)%60),9);gv_lines(ctx,x+24,by+30,500,2+(i%2),22,1.1);}};
  typed(360,300,5);typed(1040,170,2);
  // the mug, the pencil, the lamp's light from the right
  wc_wash(ctx,wc_ell(1790,190,64,64,30),[230,130,60],{kind:"thing",lw:1.4,seed:174});wc_wash(ctx,wc_ell(1790,190,50,50,30),[96,66,48],{kind:"thing",line:false,flat:true,seed:175});
  wc_wash(ctx,[[1846,170],[1880,166],[1882,214],[1846,210]],[230,130,60],{kind:"thing",lw:1.2,bare:true,seed:176});
  wc_part(ctx,[[1700,880],[1890,940],[1886,952],[1696,892]],[240,190,60],1,{lw:1.1,seed:177});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1700,300,1100,[255,220,160],0.3);ctx.restore();ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,1080,900,[150,140,160],0.45);ctx.restore();}
// a hand writing, seen from above, the nib at x, y: the pen's tail to the top right, the index finger along it, the thumb's tip beyond
// it, the back of the hand, the curled fingers' knuckles, the wrist and the sleeve going off to the bottom right. who: whose skin and
// sleeve; s: its size. Drawn along the pen (x) and across it (y, toward the hand), then turned.
function sp_penHand(ctx,x,y,s,who){const P_=PEOPLE[who||"spAdmin"],skin=P_.skin,cuff=P_.top.c,ink=[34,40,70];ctx.save();ctx.translate(x,y);ctx.scale(s||1,s||1);ctx.rotate(-Math.PI/4);
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(60,40,30,0.16)";ctx.beginPath();ctx.ellipse(40,100,70,90,0.1,0,TAU);ctx.fill();ctx.restore();
  ctx.beginPath();ctx.moveTo(48,104);ctx.lineTo(126,98);ctx.lineTo(128,170);ctx.lineTo(36,178);ctx.closePath();litFill(ctx,skin,126,98,36,178);seam(ctx,skin,0.35,1.6);
  if(P_.top.kind==="suit"&&P_.top.inner){const sh=P_.top.inner;ctx.beginPath();ctx.moveTo(32,148);ctx.quadraticCurveTo(84,134,134,132);ctx.lineTo(136,170);ctx.lineTo(30,186);ctx.closePath();
    litFill(ctx,sh,134,132,30,186);seam(ctx,sh,0.4,1.6);ctx.save();ctx.translate(0,22);}else ctx.save();
  ctx.beginPath();ctx.moveTo(30,156);ctx.quadraticCurveTo(84,142,136,140);ctx.lineTo(160,900);ctx.lineTo(-30,900);ctx.closePath();litFill(ctx,cuff,160,400,-30,400);seam(ctx,cuff,0.5,2);
  ctx.strokeStyle=rgba(wc_dim(cuff,0.3),0.35);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(52,230);ctx.quadraticCurveTo(70,300,60,380);ctx.stroke();
  ctx.beginPath();ctx.moveTo(30,158);ctx.quadraticCurveTo(84,144,136,142);ctx.strokeStyle=rgba(wc_dim(cuff,0.35),0.8);ctx.lineWidth=5;ctx.stroke();ctx.restore();
  ctx.beginPath();ctx.moveTo(64,2);ctx.quadraticCurveTo(58,-20,38,-21);ctx.quadraticCurveTo(20,-21,18,-10);ctx.quadraticCurveTo(22,0,36,3);ctx.closePath();litFill(ctx,skin,18,-21,64,3);seam(ctx,skin,0.45,1.6);
  ctx.lineCap="round";ctx.strokeStyle=rgba(ink,1);ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(168,0);ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.35)";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(74,-2.5);ctx.lineTo(160,-2.5);ctx.stroke();
  ctx.fillStyle=rgba([200,176,110],1);ctx.beginPath();ctx.moveTo(-1,0);ctx.lineTo(16,-5);ctx.lineTo(16,5);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(44,12);ctx.quadraticCurveTo(84,2,118,14);ctx.quadraticCurveTo(146,34,142,80);ctx.quadraticCurveTo(136,116,108,124);
  ctx.quadraticCurveTo(70,130,48,116);ctx.quadraticCurveTo(26,96,28,60);ctx.quadraticCurveTo(30,26,44,12);ctx.closePath();litFill(ctx,skin,28,2,146,130);seam(ctx,skin,0.45,1.8);
  ctx.strokeStyle=rgba(darken(skin,0.3),0.35);ctx.lineWidth=1.6;for(const [kx,ky] of [[46,58],[48,82],[56,104]]){ctx.beginPath();ctx.arc(kx,ky,12,Math.PI*0.55,Math.PI*1.45);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(70,6);ctx.quadraticCurveTo(44,-6,22,-4);ctx.quadraticCurveTo(10,-2,10,4);ctx.quadraticCurveTo(12,11,24,11);ctx.quadraticCurveTo(48,14,70,26);ctx.closePath();
  litFill(ctx,skin,10,-6,70,26);seam(ctx,skin,0.45,1.6);ctx.fillStyle=rgba(lighten(skin,0.3),0.8);ctx.beginPath();ctx.ellipse(18,3,6,4,0,0,TAU);ctx.fill();ctx.restore();}
// a line of handwriting too small to read, from x along y, w long, written up to p (a heading, a little heavier); returns where the pen is
function sp_scribble(ctx,x,y,w,p,seed,head){const R=wc_rng(seed),n=Math.max(2,Math.round(w/7)),q=clamp(p,0,1),m=Math.round(n*q),pts=[],gap=[];
  for(let i=0;i<=n;i++){pts.push([x+w*i/n,y+Math.sin(i*1.9+R()*2)*5-(R()<0.12?7:0)]);gap.push(i>2&&i<n-2&&R()<0.11);}
  if(m>0){ctx.save();ctx.strokeStyle=rgba([36,56,130],0.92);ctx.lineWidth=head?5:3;ctx.lineJoin=ctx.lineCap="round";ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
    for(let i=1;i<=m;i++){if(gap[i])ctx.moveTo(pts[i][0],pts[i][1]);else ctx.lineTo(pts[i][0],pts[i][1]);}ctx.stroke();ctx.restore();}
  return pts[m];}

/* ---------- Los Angeles, 1980: an office building at dusk, and the meeting in it ---------- */
// a dusk sky, purple above and orange low down, in a rectangle
function sp_duskSky(ctx,x,y,w,h,k){k=k||0;const g=ctx.createLinearGradient(0,y,0,y+h),c=(a,b)=>"rgb("+a.map((v,i)=>Math.round(lerp(v,b[i],k))).join(",")+")";
  g.addColorStop(0,c([84,82,140],[44,46,96]));g.addColorStop(0.45,c([176,118,150],[110,80,128]));g.addColorStop(0.8,c([246,160,110],[206,122,110]));g.addColorStop(1,c([252,198,132],[236,160,112]));
  ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.save();ctx.globalAlpha=0.35;wc_wash(ctx,wc_rect(x,y,w,h),[200,140,150],{kind:"plaster",line:false,seed:(x|0)+3});ctx.restore();}
// a fan palm against the sky, as they stand in Los Angeles: a tall thin trunk curving up from x, y to a small crown h above, the old
// fronds hanging under it as a skirt, the new ones each a stalk with a fan of leaves at its end, the leaves' tips drooping; in col
function sp_palm(ctx,x,y,h,lean,col,seed){const R=wc_rng(seed),tx=x+lean*h,ty=y-h,line=[],k=h/700;for(let i=0;i<=14;i++){const u=i/14;line.push([x+lean*h*u*u+Math.sin(u*3+seed)*h*0.01,y-h*u]);}
  wc_wash(ctx,wc_band(line,h*0.02,h*0.012),col,{kind:"trunk",line:false,flat:true,seed});
  ctx.save();ctx.fillStyle=rgba(col,1);ctx.strokeStyle=rgba(col,1);ctx.lineCap="round";ctx.lineJoin="round";
  const sk=58*k,sw=15*k;ctx.beginPath();ctx.moveTo(tx-sw,ty-4*k);ctx.quadraticCurveTo(tx-sw*1.5,ty+sk*0.5,tx-sw*0.8,ty+sk);ctx.lineTo(tx-sw*0.3,ty+sk*0.9);ctx.lineTo(tx,ty+sk*1.08);
  ctx.lineTo(tx+sw*0.3,ty+sk*0.9);ctx.lineTo(tx+sw*0.8,ty+sk);ctx.quadraticCurveTo(tx+sw*1.5,ty+sk*0.5,tx+sw,ty-4*k);ctx.closePath();ctx.fill();
  const n=15;for(let i=0;i<n;i++){const a=-Math.PI/2+(i/(n-1)-0.5)*Math.PI*1.55+(R()-0.5)*0.2,L=(22+R()*12)*k,ex=tx+Math.cos(a)*L,ey=ty+Math.sin(a)*L*0.8+Math.abs(Math.cos(a))*L*0.3;
    ctx.lineWidth=3*k;ctx.beginPath();ctx.moveTo(tx,ty);ctx.quadraticCurveTo(tx+Math.cos(a)*L*0.55,ty+Math.sin(a)*L*0.55-5*k,ex,ey);ctx.stroke();
    const f=Math.atan2(ey-ty,ex-tx),fl=(24+R()*8)*k;ctx.beginPath();ctx.moveTo(ex,ey);ctx.arc(ex,ey,fl*0.55,f-0.75,f+0.75);ctx.closePath();ctx.fill();
    ctx.lineWidth=2.2*k;for(let j=0;j<9;j++){const b=f+(j/8-0.5)*1.7,l=fl*(0.85+R()*0.3),mx=ex+Math.cos(b)*l*0.6,my=ey+Math.sin(b)*l*0.6,qx=ex+Math.cos(b)*l,qy=ey+Math.sin(b)*l+l*0.28;
      ctx.beginPath();ctx.moveTo(ex,ey);ctx.quadraticCurveTo(mx,my,qx,qy);ctx.stroke();}}
  ctx.beginPath();ctx.arc(tx,ty,8*k,0,TAU);ctx.fill();ctx.restore();}
// the hills and a low skyline at dusk in a band whose foot is base, from x0 to x1: towers here and there, a few windows lit
function sp_duskCity(ctx,x0,x1,base,seed,k){const R=wc_rng(seed);wc_wash(ctx,[[x0-40,base],[x0-40,base-150],[x0+200,base-210],[x0+520,base-170],[x0+800,base-240],[x1+40,base-180],[x1+40,base]],[150,112,150],{kind:"land",line:false,flat:true,seed});
  let x=x0;while(x<x1){const w=50+R()*90,h=(R()<0.25?160+R()*200:30+R()*70)*(k||1);wc_flat(ctx,wc_rect(x,base-h,w,h+4),[104,86,128],1,"build");
    for(let wy=base-h+12;wy<base-10;wy+=16)for(let wx=x+8;wx<x+w-8;wx+=14)if(R()<0.18)sp_lit(ctx,wx,wy,6,8,0.8);x+=w+R()*30;}}
const SP_LAO={bld:[80,420,1080,500],up:[140,480,960,92],down:[140,650,960,92],lit:[380,940]};
function sp_paintLaOut(ctx){const B=SP_LAO,[bx,by,bw,bh]=B.bld;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);sp_duskSky(ctx,0,0,W,760);
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1500,700,700,[255,190,120],0.5);ctx.restore();sp_duskCity(ctx,1000,W+40,720,201);
  // the street beyond the lot: its kerb, the verge, a low hedge; then the parking lot and its lines
  wc_wash(ctx,wc_rect(-40,708,W+80,170),[112,96,116],{kind:"ground",line:false,seed:202});wc_flat(ctx,wc_rect(-40,708,W+80,10),[150,128,140],1,"kerb");
  wc_wash(ctx,[[1150,812],[1150,780],[1300,770],[1500,778],[1700,766],[W+40,774],[W+40,820]],[74,84,80],{kind:"tree",line:false,flat:true,seed:204});
  wc_wash(ctx,wc_rect(-40,860,W+80,H-860+40),[104,90,104],{kind:"ground",line:false,seed:203});ctx.save();ctx.strokeStyle="rgba(236,226,200,0.35)";ctx.lineWidth=5;
  for(let x=1180;x<W;x+=190){ctx.beginPath();ctx.moveTo(x,1080);ctx.lineTo(x+80,900);ctx.stroke();}ctx.restore();
  // the building: stucco in the last light, a flat roof, two long rows of windows; upstairs the meeting's room is lit, people in it
  wc_contact(ctx,bx-30,bx+bw+30,by+bh,0.9,0.4);wc_part(ctx,wc_rect(bx,by,bw,bh),[200,166,160],1,{kind:"build",lw:1.6,seed:207});wc_part(ctx,wc_rect(bx-14,by-24,bw+28,30),[170,136,140],1,{lw:1.3,seed:208});
  for(const [x,y,w,h] of [B.up,B.down]){wc_flat(ctx,wc_rect(x,y,w,h),[66,74,110],1,"glass");}
  const [l0,l1]=B.lit,[ux,uy,,uh]=B.up;wc_flat(ctx,wc_rect(l0,uy,l1-l0,uh),[252,210,146],1,"lit");ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,(l0+l1)/2,uy+uh/2,420,[255,200,120],0.45);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(l0,uy,l1-l0,uh);ctx.clip();ctx.filter="blur(2.5px)";
  [[418,44,0.34],[478,36,0.26],[548,50,0.36],[622,40,0.28],[690,48,0.34],[770,38,0.26],[846,52,0.36],[904,42,0.3]].forEach(([px,ph,a],i)=>{ctx.fillStyle=rgba([104,64,66],a);
    const hx=px+((i*37)%9-4),hy=uy+uh-ph-8;ctx.beginPath();ctx.ellipse(hx,hy,9+ph*0.04,11+ph*0.04,0,0,TAU);ctx.fill();
    ctx.beginPath();ctx.moveTo(px-24-ph*0.1,uy+uh+6);ctx.bezierCurveTo(px-22,hy+16,px+22,hy+16,px+24+ph*0.1,uy+uh+6);ctx.closePath();ctx.fill();});ctx.restore();
  for(let x=ux;x<=ux+B.up[2];x+=80)for(const [y,h] of [[uy,uh],[B.down[1],B.down[3]]])wc_flat(ctx,wc_rect(x-4,y,8,h),[170,136,140],1,"mullion");
  wc_flat(ctx,wc_rect(560,B.down[1],200,by+bh-B.down[1]),[240,214,170],1,"lobby");ctx.save();ctx.strokeStyle=rgba([150,120,110],0.8);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(560,B.down[1]+B.down[3]);ctx.lineTo(760,B.down[1]+B.down[3]);ctx.moveTo(660,B.down[1]+B.down[3]);ctx.lineTo(660,by+bh);ctx.stroke();ctx.restore();for(const px of [544,768])wc_part(ctx,wc_rect(px,640,8,by+bh-640),[120,96,104],1,{lw:1});
  wc_part(ctx,wc_rect(530,620,260,22),[140,110,116],1,{lw:1.2,seed:209});
  for(const px of [180,330,960,1070])wc_wash(ctx,wc_ell(px,by+bh-20,70,34,20),[70,96,72],{kind:"tree",lw:1.1,seed:px});
  // a street lamp coming on, the palms in front of the hills, and a car of the time parked in front of them
  wc_part(ctx,wc_rect(1176,600,10,330),[70,64,76],1,{lw:1});wc_part(ctx,[[1162,600],[1200,600],[1194,584],[1168,584]],[70,64,76],1,{lw:1});ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1181,606,90,[255,226,170],0.6);ctx.restore();
  const pc=[58,44,66];sp_palm(ctx,1250,930,760,0.06,pc,211);sp_palm(ctx,1500,920,620,-0.08,pc,212);sp_palm(ctx,1800,940,820,0.04,pc,213);sp_palm(ctx,24,930,700,0.1,pc,214);
  const cx=1320,cy=1000,car=[150,96,64];wc_contact(ctx,cx-20,cx+400,cy+6,0.9,0.4);wc_part(ctx,[[cx,cy-14],[cx,cy-62],[cx+70,cy-70],[cx+120,cy-118],[cx+270,cy-118],[cx+320,cy-72],[cx+390,cy-64],[cx+392,cy-14]],car,1,{kind:"thing",lw:1.4,seed:205});
  wc_flat(ctx,[[cx+132,cy-110],[cx+190,cy-110],[cx+190,cy-74],[cx+96,cy-74]],[70,80,110],1,"window");wc_flat(ctx,[[cx+204,cy-110],[cx+262,cy-110],[cx+306,cy-74],[cx+204,cy-74]],[70,80,110],1,"window");
  for(const wx of [cx+80,cx+316]){wc_wash(ctx,wc_ell(wx,cy-10,34,34,24),[40,36,40],{kind:"thing",lw:1.2,seed:wx|0});wc_wash(ctx,wc_ell(wx,cy-10,14,14,16),[170,170,176],{kind:"thing",line:false,flat:true});}}
// The meeting: a warm room in the evening, a flip chart on the left, a table across the room, the window behind it onto the palms and
// the lights coming on. People stand at the back, sit at the table (gv_behind at its top) and stand at the flip chart; the table is a
// layer of its own (la80table), over the people at it. SP_LA: the wall's foot, the window, the flip chart's pad, the table's span and
// top, who sits where, who stands at the back [x, who], the one at the flip chart [x, foot, scale], the card on the table.
const SP_LA={fy:700,win:[1160,96,720,500],pad:[90,170,460,470],table:[720,1880,800],
  seats:[[1230,"spAdmin"],[1450,"spLa9"],[1670,"spLa6"]],s:0.84,back:[[790,"spLa2"],[960,"spLa3"],[1120,"spLa4"],[1330,"spLa5"],[1540,"spLa7"],[1760,"spLa8"]],bs:0.72,bf:714,
  chart:[640,840,0.92],card:[750,640,400,160]};
const SP_WALL80=[226,206,178];
function sp_paintLa80(ctx){const L=SP_LA,[wx,wy,ww,wh]=L.win,[px,py,pw,ph]=L.pad;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,L.fy+40),SP_WALL80,{kind:"plaster",line:false,seed:221});wc_wash(ctx,wc_rect(-40,L.fy,W+80,H-L.fy+40),[150,110,90],{kind:"ground",line:false,seed:222});
  wc_wash(ctx,wc_rect(-40,L.fy-16,W+80,18),wc_dim(SP_WALL80,0.25),{kind:"trim",line:false,flat:true});wc_part(ctx,wc_rect(-40,430,wx+40,14),wc_dim(SP_WALL80,0.12),1,{lw:1});
  wc_wash(ctx,wc_rect(-40,-40,W+80,70),[236,230,214],{kind:"plaster",line:false,seed:223});ctx.save();ctx.strokeStyle="rgba(150,140,120,0.3)";ctx.lineWidth=1.5;for(let x=0;x<W;x+=96){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,30);ctx.stroke();}ctx.restore();
  for(const lx of [300,900]){wc_flat(ctx,wc_rect(lx,6,240,18),[252,250,240],1,"tube");ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx+120,40,320,[255,246,220],0.32);ctx.restore();}
  // the window: later dusk, the hills and the skyline lighting up, palms; its frame and mullions
  ctx.save();ctx.beginPath();ctx.rect(wx,wy,ww,wh);ctx.clip();sp_duskSky(ctx,wx,wy,ww,wh,0.45);ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww*0.6,wy+wh,420,[255,170,110],0.35);ctx.restore();
  sp_duskCity(ctx,wx-20,wx+ww+20,wy+wh-30,231,0.7);wc_flat(ctx,wc_rect(wx,wy+wh-34,ww,40),[86,74,96],1,"street");
  const pc=[48,36,58];sp_palm(ctx,wx+120,wy+wh+20,430,0.05,pc,232);sp_palm(ctx,wx+520,wy+wh+30,360,-0.07,pc,233);sp_palm(ctx,wx+680,wy+wh+20,470,0.03,pc,234);ctx.restore();
  for(const r of [wc_rect(wx-16,wy-16,ww+32,16),wc_rect(wx-16,wy-16,16,wh+32),wc_rect(wx+ww,wy-16,16,wh+32),wc_rect(wx+236,wy,12,wh),wc_rect(wx+476,wy,12,wh)])wc_part(ctx,r,[190,186,178],1,{lw:1.2});
  wc_wash(ctx,wc_rect(wx-30,wy+wh,ww+60,22),wc_dim(SP_WALL80,0.1),{kind:"trim",lw:1.4});
  // the flip chart on its easel: three legs, the pad, the sheets already turned over its top, the tray for the markers
  const leg=[150,110,70];for(const [x0,x1] of [[px+30,px-20],[px+pw-30,px+pw+20]])wc_part(ctx,[[x0-7,py+ph],[x0+7,py+ph],[x1+8,860],[x1-8,860]],leg,1,{lw:1.1});
  wc_part(ctx,[[px+pw/2-6,py+ph],[px+pw/2+6,py+ph],[px+pw/2+30,820],[px+pw/2+18,820]],wc_dim(leg,0.2),1,{lw:1});
  wc_part(ctx,wc_rect(px-10,py-20,pw+20,24),leg,1,{lw:1.2});ctx.save();ctx.filter="blur(6px)";ctx.fillStyle="rgba(60,50,40,0.22)";ctx.fillRect(px+8,py+10,pw,ph);ctx.restore();
  wc_wash(ctx,wc_rect(px,py,pw,ph),[252,251,246],{kind:"page",lw:1.4,seed:241});for(let k=0;k<3;k++)wc_part(ctx,[[px+4,py-4-k*7],[px+pw-4,py-4-k*7],[px+pw-10,py+14-k*5],[px+10,py+14-k*5]],[244,242,234],1,{lw:1,seed:242+k});
  wc_part(ctx,wc_rect(px-12,py+ph,pw+24,18),leg,1,{lw:1.1});for(const [mx,c] of [[px+60,[40,60,150]],[px+110,[200,50,40]],[px+160,[40,40,48]]])wc_flat(ctx,wc_rect(mx,py+ph-8,40,10),c,1,"marker");
  // a poster of the city's coast on the wall, over the head of whoever stands at the chart
  wc_part(ctx,wc_rect(590,96,170,200),[90,70,60],1,{lw:1.2,seed:243});wc_flat(ctx,wc_rect(602,108,146,176),[244,200,140],1,"poster");wc_flat(ctx,wc_rect(602,222,146,62),[96,150,180],1,"sea");
  wc_wash(ctx,wc_ell(670,170,26,26,24),[250,140,80],{kind:"thing",line:false,flat:true,seed:244});sp_palm(ctx,720,286,140,-0.1,[90,70,60],245);}
// the table, over the people at it: its top and front, and on it cups, binders, a pot of coffee, and the card with the association's name
function sp_paintLa80Table(ctx){const L=SP_LA,[x0,x1,top]=L.table,col=[160,112,72],[cx,cy,cw,ch]=L.card;
  wc_part(ctx,wc_rect(x0+30,top+24,x1-x0+60,H-top),wc_dim(col,0.2),1,{seed:251});wc_part(ctx,wc_rect(x0-10,top,x1-x0+60,28),wc_lit(col,0.1),1,{seed:252});
  // the card: folded, standing, its face paper; the words are written every frame (sp_cardName)
  ctx.save();ctx.filter="blur(5px)";ctx.fillStyle="rgba(60,40,30,0.28)";ctx.fillRect(cx+10,cy+18,cw,ch-10);ctx.restore();wc_wash(ctx,wc_rect(cx,cy,cw,ch),[250,248,240],{kind:"page",lw:1.4,seed:253});
  wc_flat(ctx,wc_rect(cx+14,cy+12,cw-28,58),[40,70,130],1,"band");
  for(const [x,c] of [[1340,[248,248,244]],[1560,[248,248,244]],[1180,[200,90,60]]])sp_cup(ctx,x,top+12,c);
  gv_book(ctx,1260,top+14,120,[40,70,130]);gv_book(ctx,1268,top,108,[176,92,48]);gv_book(ctx,1480,top+14,118,[120,130,80]);gv_book(ctx,1690,top+14,112,[214,170,70]);
  wc_part(ctx,[[1800,top+12],[1860,top+12],[1868,top-76],[1852,top-92],[1808,top-92],[1792,top-76]],[214,226,232],1,{kind:"thing",lw:1.3,seed:254});
  wc_flat(ctx,[[1800,top+8],[1860,top+8],[1864,top-40],[1796,top-40]],[110,70,44],1,"coffee");wc_part(ctx,wc_rect(1800,top-104,60,16),[40,40,44],1,{lw:1});}
// a cup on a table whose top is at y: plastic foam, white (or a mug's colour), a little coffee showing
function sp_cup(ctx,x,y,c){wc_part(ctx,[[x-15,y],[x+15,y],[x+21,y-46],[x-21,y-46]],c,1,{kind:"thing",lw:1.2,seed:x|0});wc_flat(ctx,wc_ell(x,y-46,21,5,16),[120,80,54],1,"coffee");}
// a cup held in the right hand, in the figure's units
function sp_cupHeld(cx,P_,hands){const [hx,hy]=hands[1];cx.save();cx.translate(hx,hy+6);cx.fillStyle="#f6f4ee";cx.beginPath();cx.moveTo(-15,26);cx.lineTo(15,26);cx.lineTo(21,-30);cx.lineTo(-21,-30);cx.closePath();cx.fill();
  cx.strokeStyle="rgba(58,54,66,0.7)";cx.lineWidth=2;cx.stroke();cx.restore();fingers(cx,P_,[[hx-14,hy+6]]);}
// the card's words, the flip chart's title and what's written under it, in marker (each line's p reveals it)
function sp_cardName(ctx){const [cx,cy,cw]=SP_LA.card;wc_T(ctx,"DAMA",cx+cw/2,cy+58,{w:800,size:48,align:"center",col:[255,255,255]});
  wc_T(ctx,"Data Administration",cx+cw/2,cy+108,{w:600,size:28,align:"center",col:WC_DARK});wc_T(ctx,"Management Association",cx+cw/2,cy+142,{w:600,size:28,align:"center",col:WC_DARK});}
const SP_LEARNED=["one meaning for each word","who owns it?","write it down"];
function sp_chart(ctx,ps){const [px,py]=SP_LA.pad,blue=[40,60,150];wc_hand(ctx,"What we've learned",px+38,py+76,{size:40,col:[200,50,40],w:800});
  SP_LEARNED.forEach((s,i)=>{if(ps[i]>0){wc_hand(ctx,"·",px+22,py+170+i*96,{size:44,col:blue,w:800,a:clamp(ps[i]*4,0,1)});wc_hand(ctx,s,px+46,py+170+i*96,{size:30,col:blue,w:700,p:ps[i]});}});}
// a name badge on someone's chest: white, a red band at its top
function sp_badge(ctx,id,x,foot,s,flip){const k=s*PEOPLE[id].build.h,bx=x+(flip?24:-24)*k-17*k,by=foot-404*k;ctx.save();ctx.fillStyle="rgba(250,250,246,0.95)";ctx.fillRect(bx,by,34*k,24*k);
  ctx.fillStyle=rgba([200,50,40],0.95);ctx.fillRect(bx,by,34*k,7*k);ctx.strokeStyle="rgba(58,54,66,0.5)";ctx.lineWidth=1.2;ctx.strokeRect(bx,by,34*k,24*k);ctx.restore();}

/* ---------- 1980 on: the association's chapters, city after city ---------- */
// a corridor's cork board, where a flyer for each new chapter's meeting is pinned (sp_flyer, every frame)
function sp_paintNotice80(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),SP_WALL80,{kind:"plaster",line:false,seed:261});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,960,0,1100,[255,246,220],0.3);ctx.restore();gv_cork(ctx,150,70,1620,800,22);}
const SP_CITIES=[["San Francisco",[214,120,50]],["Portland",[60,130,140]],["Seattle",[120,96,170]],["Minneapolis",[176,140,40]],["New York",[190,70,60]],["Washington, D.C.",[70,120,80]]];
// a flyer: its paper and coloured band kept, then the association's name, the city, what it's for; pinned, landing as p goes 0 to 1
function sp_flyer(ctx,i,p){if(p<=0.01)return;const [city,col]=SP_CITIES[i],w=470,h=340,x=210+(i%3)*530,y=110+Math.floor(i/3)*390,rot=[-0.03,0.02,-0.015,0.025,-0.02,0.015][i],k=lerp(1.2,1,1-Math.pow(1-clamp(p,0,1),3));
  const c=wc_kept("flyer|"+i,w+40,h+40,q=>{q.translate(20,20);q.save();q.filter="blur(6px)";q.fillStyle="rgba(70,60,50,0.25)";q.fillRect(6,10,w,h);q.restore();wc_wash(q,wc_rect(0,0,w,h),[251,250,245],{kind:"page",lw:1.4,seed:271+i});
    wc_flat(q,wc_rect(14,14,w-28,72),col,1,"band");gv_lines(q,40,h-72,w-120,2,24,1);});
  ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.scale(k,k);withA(ctx,clamp(p*2.2,0,1),()=>{ctx.drawImage(c,-w/2-20,-h/2-20);
    wc_T(ctx,"DAMA",0,-h/2+64,{w:800,size:40,align:"center",col:[255,255,255]});wc_T(ctx,city,0,-h/2+164,{w:800,size:46,align:"center",col:WC_DARK});
    wc_T(ctx,"chapter meeting",0,-h/2+222,{w:600,size:32,align:"center",col:WC_MUTED});gv_pin(ctx,0,-h/2+8,[200,60,50],1.3);});ctx.restore();}

/* ---------- before: each organisation, alone ---------- */
// three office buildings at night, of brick, concrete and glass, each dark but for one window, where someone works late alone at a
// desk with a lamp and a binder (drawn every frame, sp_aloneWindow). SP_AL: each building [x, y, w, h, colour], its lit window, who's in it.
const SP_AL=[{b:[40,250,560,830],col:[110,64,56],win:[170,430,300,200],id:"spAdmin"},{b:[680,120,560,960],col:[96,98,108],win:[810,600,300,200],id:"spLa9"},
  {b:[1320,180,560,900],col:[60,68,96],win:[1460,330,300,200],id:"spLa6"}];
function sp_paintAlone70(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);sp_paintSky(ctx,0,0,W,H);ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,960,1100,1200,[150,100,120],0.4);ctx.restore();
  sp_paintTowers(ctx,sp_towers(301,-40,W+40,1090,300,640,90,170),1090,SP_NIGHT.far,0.04,302,0.9);
  SP_AL.forEach((a,i)=>{const [x,y,w,h]=a.b,[lx,ly,lw,lh]=a.win;wc_wash(ctx,wc_rect(x,y,w,h+40),a.col,{kind:"build",lw:1.4,seed:311+i});wc_flat(ctx,wc_rect(x-10,y-18,w+20,22),wc_dim(a.col,0.2),1,"roof");
    const cw=i===2?120:86,ch=i===2?150:110;for(let yy=y+50;yy<H-40;yy+=ch+46)for(let xx=x+34;xx<x+w-cw-10;xx+=cw+40){if(xx<lx+lw+10&&xx+cw>lx-10&&yy<ly+lh+10&&yy+ch>ly-10)continue;
      wc_flat(ctx,wc_rect(xx,yy,cw,ch),[36,40,62],1,"window");}
    wc_flat(ctx,wc_rect(lx,ly,lw,lh),[236,196,140],1,"lit");ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx+lw/2,ly+lh/2,260,[255,206,140],0.4);ctx.restore();
    wc_part(ctx,wc_rect(lx-10,ly+lh,lw+20,14),wc_lit(a.col,0.2),1,{lw:1.1});});}
// a lit window: inside, the person at a desk under a lamp, writing in a binder; the window's bars over them
function sp_aloneWindow(ctx,i,t,o){const a=SP_AL[i],[lx,ly,lw,lh]=a.win,top=ly+lh-46,s=0.42;ctx.save();ctx.beginPath();ctx.rect(lx,ly,lw,lh);ctx.clip();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,lx+lw*0.78,top-30,120,[255,226,170],0.6);ctx.restore();
  person(ctx,a.id,lx+lw*0.3,top+GV_SIT*s,s,{t,pose:"write",expr:o&&o.expr||"calm"});
  const g=ctx.createLinearGradient(0,top,0,ly+lh);g.addColorStop(0,"rgb(150,104,70)");g.addColorStop(1,"rgb(110,74,50)");ctx.fillStyle=g;ctx.fillRect(lx,top,lw,lh);
  ctx.fillStyle="rgba(250,248,240,1)";ctx.beginPath();ctx.moveTo(lx+lw*0.3,top+4);ctx.lineTo(lx+lw*0.56,top+4);ctx.lineTo(lx+lw*0.54,top-6);ctx.lineTo(lx+lw*0.32,top-6);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([226,120,44],1);ctx.beginPath();ctx.moveTo(lx+lw*0.72,top-44);ctx.lineTo(lx+lw*0.84,top-44);ctx.lineTo(lx+lw*0.88,top-26);ctx.lineTo(lx+lw*0.68,top-26);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(60,54,50,1)";ctx.fillRect(lx+lw*0.78-2,top-26,4,26);ctx.restore();
  ctx.fillStyle=rgba(wc_dim(a.col,0.3),1);ctx.fillRect(lx+lw/2-5,ly,10,lh);ctx.fillRect(lx,ly+lh*0.22-4,lw,8);}

/* ---------- together: she copies a page ---------- */
// from above, on the meeting's table: the binder she borrowed, open at its typed entries, and her own, open at a page she fills to
// match (sp_scribble, every frame); a cup, a pencil. SP_CP: the lines she writes [x, y, length, heading?]
const SP_CP={lines:[[1124,320,150,1],[1124,376,300],[1124,424,264],[1124,520,170,1],[1124,576,300],[1124,624,240]]};
function sp_paintCopy80(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[166,118,78],{kind:"plaster",line:false,seed:341});
  ctx.save();ctx.strokeStyle=rgba([120,80,50],0.25);ctx.lineWidth=2;for(let y=10;y<H;y+=34){ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+3*Math.sin(x/170+y*0.7));ctx.stroke();}ctx.restore();
  // an open binder: its shadow, its cover and spine, two pages, the rings; turned rot about its middle; fill(x, y, page width) types on it
  const open=(cx,cy,w,h,rot,col,seed,fill)=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.save();ctx.filter="blur(12px)";ctx.fillStyle="rgba(50,30,20,0.32)";rr(ctx,-w/2+14,-h/2+20,w,h,20);ctx.fill();ctx.restore();
    wc_part(ctx,wc_rrPts(-w/2,-h/2,w,h,18),col,1,{kind:"cover",lw:1.5,seed});wc_flat(ctx,wc_rect(-20,-h/2+12,40,h-24),wc_dim(col,0.25),1,"spine");
    const pw=w/2-36;for(const px of [-w/2+16,20])wc_wash(ctx,wc_rect(px,-h/2+18,pw,h-36),[252,250,244],{kind:"page",lw:1.3,seed:seed+px});
    for(const ry of [-h*0.3,0,h*0.3]){wc_wash(ctx,wc_ell(0,ry,40,17,24),[206,210,216],{kind:"thing",lw:1.3,seed:seed+ry});wc_wash(ctx,wc_ell(0,ry,29,9,24),col,{kind:"thing",line:false,flat:true,seed:seed+ry+1});}
    fill(-w/2+16,-h/2+18,pw);ctx.restore();};
  const typed=(x,y,n)=>{for(let i=0;i<n;i++){const by=y+i*200;ctx.fillStyle=rgba([60,56,52],0.62);ctx.fillRect(x,by,96+((i*53)%50),10);gv_lines(ctx,x+20,by+48,290,3,48,1.1);}};
  open(560,540,860,720,-0.05,[40,70,130],342,(x,y,pw)=>{typed(x+34,y+80,3);typed(x+pw+74,y+80,3);});
  open(1480,546,800,700,0,[176,92,48],343,(x,y,pw)=>typed(x+pw+74,y+80,3));
  // a cup from above, a pencil
  wc_wash(ctx,wc_ell(1030,120,62,62,30),[246,244,238],{kind:"thing",lw:1.4,seed:344});wc_wash(ctx,wc_ell(1030,120,48,48,30),[110,72,48],{kind:"thing",line:false,flat:true,seed:345});
  wc_part(ctx,[[60,930],[250,990],[246,1002],[56,942]],[240,190,60],1,{lw:1.1,seed:346});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1700,200,1200,[255,220,160],0.28);ctx.restore();ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,1080,900,[150,140,160],0.4);ctx.restore();}

/* ---------- 2002: a boardroom, and the report they sign ---------- */
// The boardroom from across its table: walnut walls, and behind the two who sign, a glass wall onto the finance floor, where people work
// at partitioned desks and a shelf on the far wall holds the company's internal controls, its sign and glow drawn every frame
// (sp_controls). The two sit in high-backed chairs behind the table, a layer of its own (board02table). SP_B2: the table's top, the
// glass [x, y, w, h], its mullions, the seats [x, who], their scale, the shelf of binders [x, y, w, h].
const SP_B2={top:770,glass:[150,80,1620,640],mull:[690,1230],seats:[[760,"spCeo"],[1150,"spCfo"]],s:0.95,shelf:[790,300,340,150]};
function sp_paintBoard02(ctx){const K=SP_B2,[gx,gy,gw,gh]=K.glass,[sx,sy,sw,sh]=K.shelf;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[112,74,54],{kind:"plaster",line:false,seed:401});
  for(const [x,w] of [[14,118],[1788,118]])for(const [y,h] of [[90,300],[420,320]]){wc_part(ctx,wc_rect(x,y,w,h),[124,82,60],1,{lw:1.1,seed:x+y});wc_part(ctx,wc_rect(x+14,y+14,w-28,h-28),[106,68,50],1,{lw:1,seed:x+y+1});}
  // the finance floor through the glass: its ceiling and lights, the windows on its far side, the shelf of binders, the partitioned desks
  ctx.save();ctx.beginPath();ctx.rect(gx,gy,gw,gh);ctx.clip();wc_wash(ctx,wc_rect(gx-20,gy-20,gw+40,gh+40),[214,218,214],{kind:"plaster",line:false,seed:402});
  wc_flat(ctx,wc_rect(gx,gy,gw,112),[232,234,230],1,"ceiling");ctx.strokeStyle=rgba([180,184,186],0.6);ctx.lineWidth=2;
  for(let x=gx;x<gx+gw;x+=100){ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x,gy+112);ctx.stroke();}for(const y of [gy+40,gy+80]){ctx.beginPath();ctx.moveTo(gx,y);ctx.lineTo(gx+gw,y);ctx.stroke();}
  for(let x=gx+20;x<gx+gw;x+=300)wc_flat(ctx,wc_rect(x,gy+44,160,32),[252,252,246],1,"panel");
  for(let x=gx+30;x<gx+gw-120;x+=280){if(x+230>sx-20&&x<sx+sw+20)continue;wc_flat(ctx,wc_rect(x-8,gy+142,246,266),[206,208,210],1,"trim");
    const sky=ctx.createLinearGradient(0,gy+150,0,gy+400);sky.addColorStop(0,"rgb(168,194,220)");sky.addColorStop(1,"rgb(226,232,234)");ctx.fillStyle=sky;ctx.fillRect(x,gy+150,230,250);
    const R=wc_rng(x|0);for(let k=0;k<4;k++){const bx=x+2+k*56+R()*14,bw=34+R()*28,bh=70+R()*140;wc_flat(ctx,wc_rect(bx,gy+400-bh,bw,bh),[148+k*6,162+k*4,184],1,"tower");
      ctx.fillStyle="rgba(232,238,242,0.4)";for(let wy=gy+412-bh;wy<gy+392;wy+=14)ctx.fillRect(bx+6,wy,bw-12,4);}
    ctx.fillStyle="rgb(206,208,210)";ctx.fillRect(x+113,gy+150,5,250);}
  wc_part(ctx,wc_rect(sx-14,sy+sh,sw+28,14),[150,150,154],1,{lw:1.1});
  for(let i=0;i<12;i++)gv_binder(ctx,sx+8+i*27,sy+44,24,sh-44,[236,236,228]);
  const desks=[[290,"spFin1",1],[540,null],[1400,"spFin3",-1],[1640,"spFin2",-1]];
  desks.forEach(([x,id,d])=>{wc_part(ctx,[[x-70,546],[x+70,546],[x+64,476],[x-64,476]],[214,206,184],1,{kind:"thing",lw:1.2,seed:x|0});
    wc_flat(ctx,wc_rect(x-48,488,96,46),[60,96,110],1,"screen");ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,510,90,[120,200,190],0.25);ctx.restore();
    if(id)gv_behind(ctx,id,x+118*d,566,0.36,{t:0,pose:"spType",flip:d>0});});
  wc_part(ctx,wc_rect(gx,560,gw,170),[150,158,172],1,{seed:403});wc_flat(ctx,wc_rect(gx,554,gw,12),[196,198,202],1,"trim");
  ctx.strokeStyle=rgba([120,126,140],0.6);ctx.lineWidth=3;for(let x=gx+220;x<gx+gw;x+=240){ctx.beginPath();ctx.moveTo(x,566);ctx.lineTo(x,gy+gh);ctx.stroke();}ctx.restore();
  // the glass: a cool tint, a frosted band, two streaks of light; its frame and mullions
  ctx.save();ctx.fillStyle="rgba(196,220,226,0.12)";ctx.fillRect(gx,gy,gw,gh);ctx.fillStyle="rgba(240,244,244,0.4)";ctx.fillRect(gx,612,gw,26);ctx.globalCompositeOperation="screen";
  for(const [x,w] of [[400,90],[520,30],[1420,120],[1580,40]]){ctx.fillStyle="rgba(255,255,255,0.12)";ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x+w,gy);ctx.lineTo(x+w-240,gy+gh);ctx.lineTo(x-240,gy+gh);ctx.closePath();ctx.fill();}ctx.restore();
  for(const r of [wc_rect(gx-14,gy-14,gw+28,14),wc_rect(gx-14,gy-14,14,gh+28),wc_rect(gx+gw,gy-14,14,gh+28),...K.mull.map(m=>wc_rect(m-5,gy,10,gh))])wc_part(ctx,r,[176,178,180],1,{lw:1.1});
  // the chairs' high backs, black leather, behind the seats
  K.seats.forEach(([x])=>{wc_part(ctx,wc_rrPts(x-88,K.top-326,176,360,46),[36,34,40],1,{kind:"thing",lw:1.4,seed:x|0});
    wc_flat(ctx,wc_rrPts(x-68,K.top-306,136,250,32),[50,48,56],1,"panel");ctx.save();ctx.strokeStyle="rgba(18,16,22,0.5)";ctx.lineWidth=2;
    for(const dx of [-34,0,34]){ctx.beginPath();ctx.moveTo(x+dx,K.top-298);ctx.lineTo(x+dx,K.top-64);ctx.stroke();}ctx.fillStyle="rgba(96,94,104,0.85)";
    for(const dx of [-34,0,34])for(const dy of [-268,-198,-128]){ctx.beginPath();ctx.arc(x+dx,K.top+dy,3.4,0,TAU);ctx.fill();}ctx.restore();
    ctx.save();ctx.strokeStyle="rgba(255,255,255,0.14)";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x-56,K.top-290);ctx.quadraticCurveTo(x-70,K.top-150,x-62,K.top-40);ctx.stroke();ctx.restore();});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,960,-80,1100,[255,226,180],0.16);ctx.restore();}
// the table, over the two at it: its polished top and front; the report in front of him, her leather folder, glasses, a carafe and the
// conference phone
function sp_paintBoard02Table(ctx){const top=SP_B2.top;wc_part(ctx,wc_rect(-20,top+26,W+40,H-top),[64,34,26],1,{seed:411});
  ctx.save();ctx.strokeStyle="rgba(30,14,10,0.22)";ctx.lineWidth=2;for(let y=top+44;y<H;y+=17){ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+3*Math.sin(x/170+y*0.7));ctx.stroke();}
  ctx.strokeStyle="rgba(140,90,64,0.22)";ctx.lineWidth=3;for(const x of [60,980])ctx.strokeRect(x,top+70,880,H-top-40);ctx.restore();wc_part(ctx,wc_rect(-20,top,W+40,30),[112,62,46],1,{seed:412});
  ctx.save();ctx.fillStyle="rgba(255,230,200,0.3)";ctx.fillRect(-20,top+4,W+40,3);ctx.restore();
  wc_part(ctx,[[606,top+22],[914,top+22],[898,top+6],[622,top+6]],[40,60,110],1,{lw:1.1,seed:413});wc_part(ctx,[[612,top+16],[906,top+16],[894,top+2],[626,top+2]],[246,246,242],1,{lw:1.1,seed:414});
  wc_part(ctx,[[1020,top+22],[1290,top+22],[1276,top+6],[1034,top+6]],[74,42,30],1,{lw:1.1,seed:415});
  for(const x of [470,1420]){ctx.save();ctx.fillStyle="rgba(200,226,236,0.35)";ctx.fillRect(x-20,top-60,40,72);ctx.strokeStyle="rgba(255,255,255,0.7)";ctx.lineWidth=2;ctx.strokeRect(x-20,top-60,40,72);
    ctx.fillStyle="rgba(255,255,255,0.4)";ctx.fillRect(x-14,top-54,6,60);ctx.restore();}
  ctx.save();ctx.fillStyle="rgba(200,226,236,0.32)";ctx.beginPath();ctx.moveTo(1540,top+12);ctx.lineTo(1600,top+12);ctx.lineTo(1606,top-60);ctx.lineTo(1588,top-96);ctx.lineTo(1588,top-122);ctx.lineTo(1552,top-122);
  ctx.lineTo(1552,top-96);ctx.lineTo(1534,top-60);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.7)";ctx.lineWidth=2;ctx.stroke();ctx.restore();
  wc_part(ctx,[[230,top+14],[390,top+14],[350,top-24],[270,top-24]],[58,60,66],1,{kind:"thing",lw:1.2,seed:416});wc_flat(ctx,wc_rect(296,top-14,28,8),[120,200,150],1,"display");}
// the binders lighting gold as u goes 0 to 1, and the shelf's sign with them
function sp_controls(ctx,u){const [sx,sy,sw,sh]=SP_B2.shelf;if(u>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,sx+sw/2,sy+sh*0.6,sw*0.95,[255,200,90],0.55*u);ctx.restore();
    ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.gold,0.45),0.75*u);ctx.fillRect(sx+6,sy+44,sw-12,sh-44);ctx.restore();}
  if(u>0.01){const a=clamp(u*3,0,1);ctx.save();ctx.globalAlpha=a;wc_flat(ctx,wc_rect(sx+14,sy-6,sw-28,42),[30,32,40],1,"plate");ctx.restore();
    wc_T(ctx,"internal controls",sx+sw/2,sy+26,{w:700,size:30,align:"center",a,col:[lerp(236,250,u),lerp(236,196,u),lerp(232,80,u)]});}}
// the report from above, open at its last page on the table: the dark polished wood and the lights in it, the cover and the pages under
// the last; its words, the signatures and the hands that write them are drawn every frame (sp_reportPage). SP_RP: the page, the two
// lines to sign, side by side [x, y, w]
const SP_RP={page:[580,50,800,980],lines:[[640,570,290],[1020,570,290]]};
function sp_paintReport02(ctx){const [px,py,pw,ph]=SP_RP.page;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[92,50,38],{kind:"plaster",line:false,seed:421});
  ctx.save();ctx.strokeStyle=rgba([58,28,18],0.3);ctx.lineWidth=2;for(let y=8;y<H;y+=26){ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=90)ctx.lineTo(x,y+4*Math.sin(x/210+y*0.5));ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";for(const [x,y] of [[260,190],[1660,250],[1500,900]])wc_glowAt(ctx,x,y,200,[255,232,200],0.16);ctx.restore();
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(30,14,10,0.45)";ctx.fillRect(px-6,py+22,pw+40,ph+10);ctx.restore();
  wc_part(ctx,wc_rrPts(px-16,py+12,pw+34,ph+12,10),[40,60,110],1,{kind:"cover",lw:1.3,seed:422});
  [[-0.012,8,6],[0.008,4,3]].forEach(([r,dx,dy],i)=>{ctx.save();ctx.translate(px+pw/2+dx,py+ph/2+dy);ctx.rotate(r);wc_part(ctx,wc_rect(-pw/2,-ph/2,pw,ph),[240,240,236],1,{lw:1,seed:423+i});ctx.restore();});
  wc_wash(ctx,wc_rect(px,py,pw,ph),[252,252,248],{kind:"page",lw:1.3,seed:425});for(const k of [0,1]){ctx.save();ctx.translate(px+40+k*16,py+26);ctx.rotate(-0.7);ctx.fillStyle="rgba(150,150,156,0.9)";ctx.fillRect(-12,-2,24,4);ctx.restore();}
  gv_lines(ctx,px+60,py+880,pw-120,2,30,0.8);}
// a signature: one or two words, each a tall capital and smaller letters that loop, hump and dip below the line, leaning forward and
// trailing off, then a stroke back under the name or a tail rising away; seed makes it someone's. Built once (SP_SIG) as strokes, w
// wide, in units then scaled.
const SP_SIG={};
function sp_sigBuild(seed,w){const R=wc_rng(seed),under=seed%2===1,words=under?[2,3]:[4],raw=[];let X=0,cur=null;
  words.forEach((n,wi)=>{if(wi>0)X+=3.4;cur=[[X-1.6,1.4]];raw.push(cur);
    const cyc=[{c:1.0,k:1.9+R()*0.3,H:8.6+R()*1.2,dir:1}];
    for(let i=0;i<n;i++){const r=R(),f=1-0.22*i/Math.max(1,n-1);
      cyc.push(r<0.2?{c:0.72,k:1.5,H:5.2*f,dir:-1}:r<0.45?{c:0.68,k:1.55,H:(5.8+R())*f,dir:1}:r<0.75?{c:0.9,k:0.6+R()*0.2,H:(2.8+R()*0.5)*f,dir:1}:
        {c:0.7,k:1.3+R()*0.3,H:(2.6+R()*0.6)*f,dir:1});}
    cyc.forEach(q=>{for(let j=1;j<=26;j++){const t=TAU*j/26;cur.push([X+q.c*t+q.k*Math.sin(t),-q.dir*q.H*(1-Math.cos(t))/2]);}X+=q.c*TAU;});});
  const e=cur[cur.length-1],bz=under?[[e[0]+3,e[1]+2.2],[X*0.55,4.6],[-1.2,3.2]]:[[e[0]+2.4,e[1]],[e[0]+4.4,e[1]-2.6],[e[0]+6.2,e[1]-5.4]];
  for(let j=1;j<=30;j++){const u=j/30,v=1-u;cur.push([0,1].map(d=>v*v*v*e[d]+3*v*v*u*bz[0][d]+3*v*u*u*bz[1][d]+u*u*u*bz[2][d]));}
  const sl=raw.map(s=>s.map(([px,py])=>[px-py*0.34,py-px*(under?0.03:-0.02)])),xs=sl.flat().map(q=>q[0]),x0=Math.min(...xs),a=w/(Math.max(...xs)-x0);
  return sl.map(s=>s.map(([px,py])=>[(px-x0)*a,py*a]));}
// a signature written from x on its baseline y as p goes 0 to 1, the pen lifting between words; the ink shines wet until dry reaches 1.
// Returns where the pen is.
function sp_signature(ctx,x,y,w,p,seed,dry){const key=seed+"|"+w,S=SP_SIG[key]||(SP_SIG[key]=sp_sigBuild(seed,w)),pts=[];dry=clamp(dry||0,0,1);let L=0;
  S.forEach(s=>s.forEach((q,j)=>{if(pts.length){const r=pts[pts.length-1];L+=Math.hypot(q[0]-r[0],q[1]-r[1]);}pts.push([q[0],q[1],L,j===0]);}));
  const goal=clamp(p,0,1)*L,at=i=>{const r=pts[i-1],q=pts[i],u=(goal-r[2])/Math.max(1e-6,q[2]-r[2]);return [lerp(r[0],q[0],u),lerp(r[1],q[1],u)];};
  let pen=pts[0];for(let i=1;i<pts.length;i++){pen=pts[i];if(pts[i][2]>=goal){pen=at(i);break;}}
  if(goal>0){ctx.save();ctx.translate(x,y);ctx.lineJoin=ctx.lineCap="round";
    const path=()=>{ctx.beginPath();for(let i=0;i<pts.length;i++){const q=pts[i];if(q[2]>goal){if(!q[3]){const m=at(i);ctx.lineTo(m[0],m[1]);}break;}
      if(q[3])ctx.moveTo(q[0],q[1]);else ctx.lineTo(q[0],q[1]);}};
    path();ctx.strokeStyle=rgba([lerp(18,40,dry),lerp(24,46,dry),lerp(86,98,dry)],0.95);ctx.lineWidth=4;ctx.stroke();
    if(dry<1){ctx.translate(-1.2,-1.4);path();ctx.strokeStyle="rgba(255,255,255,"+(0.5*(1-dry)).toFixed(3)+")";ctx.lineWidth=1.3;ctx.stroke();}ctx.restore();}
  return [x+pen[0],y+pen[1]];}
// the page's words, the two lines to sign and their titles; each signature as its time comes (sg: [[who, start, seconds], ...]), the hand
// that writes it coming in from the bottom right and going; o.dry: the ink drying, 0 to 1; o.gold: each line ruled in gold, 0 to 1
function sp_reportPage(ctx,tt,sg,o){o=o||{};const [px,py,pw]=SP_RP.page,hands=[];wc_T(ctx,"Quarterly report",px+60,py+70,{w:600,size:30,col:WC_MUTED});
  wc_T(ctx,"We certify",px+60,py+150,{w:700,size:56,f:"serif",col:WC_DARK});wc_T(ctx,"that this report fairly presents",px+60,py+206,{w:500,size:34,f:"serif",col:WC_DARK});
  wc_T(ctx,"the company's financial condition.",px+60,py+248,{w:500,size:34,f:"serif",col:WC_DARK});gv_lines(ctx,px+60,py+304,pw-120,2,28,1);
  SP_RP.lines.forEach(([lx,ly,lw],i)=>{ctx.fillStyle=rgba(WC_DARK,0.75);ctx.fillRect(lx,ly,lw,3);const g=o.gold?o.gold[i]:0;if(g>0){ctx.fillStyle=rgba(GV.gold,0.95);ctx.fillRect(lx,ly-2,lw*easeCam(g),7);}
    wc_T(ctx,["Chief Executive Officer","Chief Financial Officer"][i],lx,ly+42,{w:600,size:28,col:WC_DARK});
    const [who,t0,d]=sg[i],pt=sp_signature(ctx,lx+10,ly-16,lw-30,(tt-t0)/d,501+i,o.dry);
    const inn=fin(tt,t0-0.45,0.45),out=fin(tt,t0+d,0.4);if(inn>0&&out<1){const k=1-easeCam(inn)+easeCam(out);hands.push([pt[0]+520*k,pt[1]+640*k,who]);}});
  hands.forEach(([x,y,who])=>sp_penHand(ctx,x,y,1.3,who));}

/* ---------- 2009: the body of knowledge, on its shelf and open at its wheel ---------- */
// A bookcase from the front, at eye level: on its middle shelf, the binders of what the members had learned, then room for the book
// and the editions after it, drawn every frame (sp_book). SP_SH: where things stand, the bookcase's sides, where each edition stands
// (its middle), a book's size. SP_BINDERS: [x, w, h, colour, lean]; the first three are the 1980s' binders.
const SP_SH={top:766,sides:[150,1770],books:[1160,1510],w:320,h:440};
const SP_BINDERS=[[236,70,352,[40,70,130]],[312,64,340,[120,130,80]],[382,74,360,[210,128,64]],[462,62,334,[150,62,66]],[530,70,348,[92,112,124]],
  [606,66,356,[204,170,92]],[678,72,342,[70,112,92]],[756,64,330,[226,222,208],-0.14]];
function sp_paintShelf(ctx,o){o=o||{};const K=SP_SH,[l,r]=K.sides;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[206,192,170],{kind:"plaster",line:false,seed:431});
  // the back panel, its grain, shadowed under each shelf
  wc_part(ctx,wc_rect(l+20,-20,r-l-40,H+40),[128,90,64],1,{lw:1,seed:432});
  ctx.save();ctx.strokeStyle="rgba(70,42,26,0.16)";ctx.lineWidth=2;for(let x=l+40;x<r-30;x+=46){ctx.beginPath();ctx.moveTo(x,-10);for(let y=0;y<=H+20;y+=90)ctx.lineTo(x+3*Math.sin(y/130+x),y);ctx.stroke();}ctx.restore();
  for(const [y0,y1,a] of [[136,340,0.5],[806,H,0.55]]){const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,"rgba(36,20,12,"+a+")");g.addColorStop(1,"rgba(36,20,12,0)");ctx.fillStyle=g;ctx.fillRect(l+20,y0,r-l-40,y1-y0);}
  // the shelf above, seen from under it: the bottoms of its books behind its edge
  const R=wc_rng(433),cols=[[118,62,58],[62,86,112],[152,132,98],[82,102,82],[178,162,132],[96,70,96]];
  for(let x=l+44;x<r-70;){const w=30+R()*40,h=40+R()*70;wc_part(ctx,wc_rect(x,30-h,w,h+90),cols[Math.floor(R()*cols.length)],0.8,{lw:1.1,seed:x|0});x+=w+2+R()*6;}
  wc_part(ctx,wc_rect(l,96,r-l,40),[146,100,68],1,{lw:1.1,seed:435});ctx.fillStyle="rgba(255,236,206,0.3)";ctx.fillRect(l,98,r-l,3);
  // the middle shelf: its top, the binders, a few flyers lying flat, a bookend; then its edge
  wc_part(ctx,wc_rect(l,K.top-14,r-l,20),[184,136,96],1,{lw:1,seed:438});
  SP_BINDERS.slice(0,o.binders==null?SP_BINDERS.length:o.binders).forEach(([x,w,h,col,lean])=>{if(lean){ctx.save();ctx.translate(x+w,K.top);ctx.rotate(lean);gv_binder(ctx,-w,-h,w,h,col);ctx.restore();}else gv_binder(ctx,x,K.top-h,w,h,col);});
  if(o.flyers!==false)for(let i=0;i<4;i++)wc_flat(ctx,wc_rect(832+i*5,K.top-6-i*6,150,6),[242-i*4,236-i*4,222],1,"paper");
  if(o.bookend!==false){wc_part(ctx,wc_rect(1686,K.top-170,14,170),[150,156,168],1,{kind:"thing",lw:1.1,seed:436});wc_part(ctx,wc_rect(1640,K.top-8,60,8),[150,156,168],1,{kind:"thing",lw:1,seed:437});}
  wc_part(ctx,wc_rect(l,K.top+4,r-l,36),[146,100,68],1,{lw:1.1,seed:439});ctx.fillStyle="rgba(255,236,206,0.35)";ctx.fillRect(l,K.top+5,r-l,3);
  // the bookcase's sides, and the light
  for(const x of [l-20,r-20])wc_part(ctx,wc_rect(x,-20,40,H+40),[160,114,78],1,{lw:1.2,seed:440+x});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1500,180,1000,[255,228,186],0.2);ctx.restore();
  ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,H,1000,[150,130,120],0.35);ctx.restore();}
// a book of the body of knowledge, standing face out, its bottom's middle at (x, y): the first edition (2009), the second (2017), the
// revision (2024, its edition on two lines); its cover kept, its words drawn every frame. o.k scales it about its bottom.
const SP_ED={1:{col:[44,92,108]},2:{col:[124,48,54],sub:"Second Edition"}};
function sp_bookCover(ed){const K=SP_SH,w=K.w,h=K.h,E=SP_ED[ed];return wc_kept("spBook"+ed,w+80,h+80,q=>{q.translate(40,40);
  q.save();q.filter="blur(12px)";q.fillStyle="rgba(40,22,12,0.45)";q.fillRect(-18,16,w,h);q.restore();
  wc_flat(q,wc_rect(8,-8,w,h),[236,228,206],1,"pages");q.strokeStyle="rgba(150,136,112,0.5)";q.lineWidth=1.2;
  for(let i=1;i<4;i++){q.beginPath();q.moveTo(10,-8+i*2);q.lineTo(w+6,-8+i*2);q.stroke();q.beginPath();q.moveTo(w+8-i*2,-6);q.lineTo(w+8-i*2,h-10);q.stroke();}
  wc_wash(q,wc_rrPts(0,0,w,h,8),E.col,{kind:"cover",lw:1.5,seed:440+ed});wc_flat(q,wc_rect(0,4,22,h-8),wc_dim(E.col,0.25),1,"spine");
  for(const ry of [86,318])wc_flat(q,wc_rect(48,ry,w-80,4),[226,214,180],0.9,"rule");});}
function sp_book(ctx,x,y,ed,o){o=o||{};const K=SP_SH,w=K.w,h=K.h,E=SP_ED[ed],k=o.k||1,cx=11,deco=!!o.deco;ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.drawImage(sp_bookCover(ed),-w/2-40,-h-40);
  wc_T(ctx,"DAMA-DMBOK",cx,-h+160,{w:800,size:40,align:"center",col:[246,238,214],deco});
  wc_T(ctx,"Data Management",cx,-h+226,{w:600,size:28,align:"center",col:[226,232,226],deco});wc_T(ctx,"Body of Knowledge",cx,-h+266,{w:600,size:28,align:"center",col:[226,232,226],deco});
  if(E.sub)wc_T(ctx,E.sub,cx,-h+(E.sub2?364:380),{w:600,size:28,align:"center",col:[236,226,200],deco});if(E.sub2)wc_T(ctx,E.sub2,cx,-h+402,{w:600,size:28,align:"center",col:[236,226,200],deco});ctx.restore();}
// a hand holding a book by its side at (x, y): the thumb on the cover, the side of the hand round the edge (the index finger curling
// behind it, the base of the thumb, the wrist), a ribbed cuff, the arm going down out of the frame; side -1 holds the left edge, 1 the
// right; s scales it
const SP_HOLD={skin:[214,170,136],sleeve:[92,108,138]};
function sp_holdHand(ctx,x,y,side,s){const {skin,sleeve}=SP_HOLD,crease=rgba(darken(skin,0.35),0.45);ctx.save();ctx.translate(x,y);ctx.scale(side*s,s);
  ctx.beginPath();ctx.moveTo(-10,150);ctx.lineTo(98,156);ctx.lineTo(214,1000);ctx.lineTo(14,1010);ctx.closePath();litFill(ctx,sleeve,214,150,-10,1010);seam(ctx,sleeve,0.3,1.2);
  ctx.beginPath();ctx.moveTo(0,-98);ctx.bezierCurveTo(16,-114,44,-112,56,-90);ctx.bezierCurveTo(64,-76,66,-58,62,-42);ctx.bezierCurveTo(72,-6,72,38,64,78);
  ctx.bezierCurveTo(60,104,56,126,54,150);ctx.lineTo(0,150);ctx.closePath();litFill(ctx,skin,70,-110,0,150);seam(ctx,skin,0.35,1.4);
  ctx.save();ctx.strokeStyle=crease;ctx.lineWidth=2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(2,-50);ctx.quadraticCurveTo(30,-56,60,-44);ctx.stroke();
  ctx.beginPath();ctx.arc(46,-88,9,-0.2,1.6);ctx.stroke();ctx.beginPath();ctx.arc(58,-30,8,-0.6,1.2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(4,22);ctx.quadraticCurveTo(30,30,46,56);ctx.stroke();ctx.restore();
  ctx.beginPath();ctx.moveTo(-12,138);ctx.lineTo(102,144);ctx.lineTo(104,178);ctx.lineTo(-12,174);ctx.closePath();litFill(ctx,darken(sleeve,0.08),104,138,-12,178);seam(ctx,sleeve,0.3,1.2);
  ctx.save();ctx.strokeStyle=rgba(darken(sleeve,0.3),0.35);ctx.lineWidth=2;for(let i=0;i<10;i++){const u=i/9,bx=lerp(-6,98,u);ctx.beginPath();ctx.moveTo(bx,140+u*6);ctx.lineTo(bx+1,174+u*4);ctx.stroke();}ctx.restore();
  const thumb=()=>{ctx.beginPath();ctx.moveTo(8,40);ctx.bezierCurveTo(-16,30,-40,6,-58,-20);ctx.bezierCurveTo(-68,-34,-76,-46,-68,-56);ctx.bezierCurveTo(-60,-64,-48,-58,-40,-48);
    ctx.bezierCurveTo(-26,-32,-8,-20,8,-12);ctx.closePath();};
  ctx.save();ctx.translate(5,7);thumb();ctx.fillStyle="rgba(20,16,12,0.18)";ctx.fill();ctx.restore();thumb();litFill(ctx,skin,-70,-60,10,40);seam(ctx,skin,0.35,1.4);
  ctx.save();ctx.translate(-58,-46);ctx.rotate(-0.85);ell(ctx,0,0,13,8.5);ctx.fillStyle=rgba(lighten(skin,0.3),0.95);ctx.fill();ctx.strokeStyle=rgba(darken(skin,0.3),0.4);ctx.lineWidth=1.2;ctx.stroke();ctx.restore();
  ctx.save();ctx.strokeStyle=crease;ctx.lineWidth=2;ctx.beginPath();ctx.arc(-32,-22,7,0.4,2.0);ctx.stroke();ctx.restore();ctx.restore();}
// the book open at its wheel, close: the paper filling the frame, the fold into the spine on the left, the next pages' edges on the right
function sp_paintWheelPage(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[250,247,238],{kind:"paper",line:false,seed:451});
  const g=ctx.createLinearGradient(0,0,170,0);g.addColorStop(0,"rgba(90,70,50,0.34)");g.addColorStop(0.45,"rgba(90,70,50,0.1)");g.addColorStop(1,"rgba(90,70,50,0)");ctx.fillStyle=g;ctx.fillRect(0,0,170,H);
  ctx.save();ctx.strokeStyle="rgba(150,136,112,0.35)";ctx.lineWidth=1.5;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(W-14+i*2.6,0);ctx.lineTo(W-14+i*2.6,H);ctx.stroke();}ctx.restore();}
// the wheel, painted our own way: ten areas of data management round the centre, data governance; each area's name outside it
const SP_WH={x:960,y:448,r0:122,r1:290,rl:342},SP_WHC=[[188,202,230],[204,196,230]];
const SP_AREAS=[["data","architecture"],["data modelling","& design"],["data storage","& operations"],["data security"],["data integration","& interoperability"],
  ["documents","& content"],["reference","& master data"],["data warehousing","& BI"],["metadata"],["data quality"]];
const sp_whAng=k=>-Math.PI/2+k*TAU/10;
// where each area sits before the centre holds them: out or in, along the rim, larger or smaller ([dr, da, scale])
const SP_UNEVEN=SP_AREAS.map((_,k)=>{const R=wc_rng(460+k);return[(R()-0.5)*44,(R()-0.5)*0.16,0.94+R()*0.1];});
function sp_wedgePts(k,cx,cy){const R=SP_WH,a0=sp_whAng(k)-TAU/20+0.014,a1=sp_whAng(k)+TAU/20-0.014,p=[];
  for(let i=0;i<=12;i++){const a=lerp(a0,a1,i/12);p.push([cx+Math.cos(a)*R.r1,cy+Math.sin(a)*R.r1]);}for(let i=12;i>=0;i--){const a=lerp(a0,a1,i/12);p.push([cx+Math.cos(a)*(R.r0+8),cy+Math.sin(a)*(R.r0+8)]);}return p;}
function sp_wedgeC(k){const s=SP_WH.r1+30;return wc_kept("spWedge"+k,2*s,2*s,q=>wc_wash(q,sp_wedgePts(k,s,s),SP_WHC[k%2],{kind:"thing",lw:1.4,seed:470+k}));}
// o: area(k) brings each area in (0 to 1); off, how far from true they sit (1 uneven, 0 true); turn, the wheel's turn (radians);
// centre lights data governance, pulse brightens it; spokes runs gold from it out to each area (spokeA, their strength); rim draws the
// wheel's edge; labels shows the names; ring goes round the whole wheel; dim pales the areas but those keep(k) holds lit; outlines,
// [[area or "centre", 0 to 1], ...]
function sp_wheel(ctx,o){const R=SP_WH,s=R.r1+30,lab=o.labels==null?1:o.labels,off=o.off||0,turn=o.turn||0,dim=o.dim||0,where=[];
  SP_AREAS.forEach((lines,k)=>{const u=o.area(k);if(u<=0)return;const [dr,da,ds]=SP_UNEVEN[k],an=sp_whAng(k),a2=an+turn+da*off,rr_=dr*off,
      sp=(0.6+0.4*spring(u))*lerp(1,ds,off),a=clamp(u*2.5,0,1)*(1-dim*0.55*(1-(o.keep?o.keep(k):0)));
    ctx.save();ctx.translate(R.x+Math.cos(an)*rr_,R.y+Math.sin(an)*rr_);ctx.rotate(turn+da*off);ctx.scale(sp,sp);withA(ctx,a,()=>ctx.drawImage(sp_wedgeC(k),-s,-s));ctx.restore();
    where[k]=[a2,rr_,sp];
    const c=Math.cos(an),sn=Math.sin(an),lr=R.rl+rr_*0.5,lx=R.x+Math.cos(a2)*lr,ly=R.y+Math.sin(a2)*lr,al=Math.abs(c)<0.3?"center":c>0?"left":"right",n=lines.length,
      y0=al!=="center"?ly-(n-1)*18+10:sn<0?ly-(n-1)*38-6:ly+32;
    if(lab>0.01)withA(ctx,clamp(u*2,0,1)*lab,()=>lines.forEach((l,i)=>wc_T(ctx,l,lx,y0+i*38,{w:i?600:700,size:30,align:al,col:WC_INK})));});
  if(o.spokes>0){ctx.save();ctx.lineCap="round";ctx.strokeStyle=rgba(GV.gold,0.9*(o.spokeA==null?1:o.spokeA));ctx.lineWidth=7;
    where.forEach(([a2,rr_,sp],k)=>{const e=easeCam(clamp(o.spokes*1.6-k*0.06,0,1));if(e<=0)return;const r0=R.r0*0.9,r1=lerp(r0,(R.r1-20)*sp+rr_,e);
      ctx.beginPath();ctx.moveTo(R.x+Math.cos(a2)*r0,R.y+Math.sin(a2)*r0);ctx.lineTo(R.x+Math.cos(a2)*r1,R.y+Math.sin(a2)*r1);ctx.stroke();});ctx.restore();}
  if(o.rim>0){ctx.save();ctx.strokeStyle=rgba(WC_DARK,0.7);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.arc(R.x,R.y,R.r1+10,-Math.PI/2,-Math.PI/2+TAU*easeCam(clamp(o.rim,0,1)));ctx.stroke();ctx.restore();}
  if(o.centre>0){const k=0.7+0.3*spring(o.centre),p=o.pulse||0;ctx.save();ctx.translate(R.x,R.y);ctx.scale(k,k);withA(ctx,clamp(o.centre*2,0,1),()=>{wc_glowAt(ctx,0,0,R.r0*(1.6+0.5*p),[255,226,140],0.45+0.3*p);
    ctx.drawImage(wc_kept("spWhCentre",2*R.r0+40,2*R.r0+40,q=>wc_wash(q,wc_ell(R.r0+20,R.r0+20,R.r0-2,R.r0-2,40),wc_lit(GV.gold,0.2),{kind:"thing",lw:1.6,seed:474})),-R.r0-20,-R.r0-20);
    wc_T(ctx,"data",0,-6,{w:800,size:34,align:"center",col:GV.goldInk});wc_T(ctx,"governance",0,36,{w:800,size:34,align:"center",col:GV.goldInk});});ctx.restore();}
  if(o.ring>0){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=6;ctx.setLineDash([18,12]);ctx.lineCap="round";ctx.beginPath();
    ctx.arc(R.x,R.y,R.r1+22,-Math.PI/2,-Math.PI/2+TAU*easeCam(clamp(o.ring,0,1)));ctx.stroke();ctx.restore();}
  (o.outlines||[]).forEach(([hi,u])=>{if(u<=0)return;ctx.save();ctx.globalAlpha*=clamp(u,0,1);ctx.strokeStyle=rgba(WC_DARK,0.85);ctx.lineWidth=5;ctx.lineJoin="round";ctx.beginPath();
    if(hi==="centre")ctx.arc(R.x,R.y,R.r0+4,0,TAU);else sp_wedgePts(hi,R.x,R.y).forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();ctx.stroke();ctx.restore();});}
// the wheel's two rings sketched in pencil before its areas come in, u 0 to 1: the outer ring, then the inner one round the empty centre
function sp_wheelGuide(ctx,u){if(u<=0)return;const R=SP_WH,ring=(r,p,seed)=>{if(p<=0)return;const pts=[];for(let i=0;i<=90;i++){const a=-Math.PI/2+TAU*i/90;
    pts.push([R.x+Math.cos(a)*r,R.y+Math.sin(a)*r]);}wc_pencil(ctx,pts,p,{lw:2.8,a:0.55,seed});};ring(R.r1+10,clamp(u*1.4,0,1),471);ring(R.r0+4,clamp(u*1.4-0.4,0,1),472);}
// the book closing on its wheel: the cover swings over from the spine at the left (u, 0 to 1), darker while it stands up, its title on
// it once it lies flat
function sp_coverClose(ctx,u,ed){ed=ed||1;if(u<=0)return;const f=Math.sin(Math.PI/2*easeCam(clamp(u,0,1))),x0=40,w=2100;if(f<0.01)return;
  const C=wc_kept("spCoverBig"+(ed>1?ed:""),w,H+240,q=>{const col=SP_ED[ed].col,R=wc_rng(481);q.fillStyle=rgba(col,1);q.fillRect(0,0,w,H+240);
    for(let i=0;i<90;i++){const d=R()<0.5;wc_glowAt(q,R()*w,R()*(H+240),80+R()*220,d?wc_dim(col,0.3):lighten(col,0.18),0.08+R()*0.08);}
    q.fillStyle=rgba(wc_dim(col,0.25),1);q.fillRect(0,0,110,H+240);for(const ry of [280,1000])wc_flat(q,wc_rect(330,ry,1300,8),[226,214,180],0.9,"rule");});
  ctx.save();const g=ctx.createLinearGradient(x0+f*w,0,x0+f*w+260,0);g.addColorStop(0,"rgba(40,26,14,"+(0.3*(1-f)).toFixed(3)+")");g.addColorStop(1,"rgba(40,26,14,0)");
  ctx.fillStyle=g;ctx.fillRect(x0+f*w,-120,260,H+240);ctx.translate(x0,-120);ctx.scale(f,1);ctx.drawImage(C,0,0);ctx.fillStyle="rgba(20,14,10,"+(0.45*(1-f)).toFixed(3)+")";ctx.fillRect(0,0,w,H+240);ctx.restore();
  const a=clamp((f-0.86)/0.14,0,1),E=SP_ED[ed],up=E.sub?50:0;if(a>0)withA(ctx,a,()=>{wc_T(ctx,"DAMA-DMBOK",1000,470-up,{w:800,size:120,align:"center",col:[246,238,214]});
    wc_T(ctx,"Data Management",1000,640-up,{w:600,size:64,align:"center",col:[226,232,226]});wc_T(ctx,"Body of Knowledge",1000,730-up,{w:600,size:64,align:"center",col:[226,232,226]});
    if(E.sub)wc_T(ctx,E.sub+(E.sub2?" · "+E.sub2:""),1000,826,{w:600,size:48,align:"center",col:[236,226,200]});});}

/* ---------- Basel, 2013 and 2023: the regulators' room, the principles, and the progress report ten years on ---------- */
// The meeting room from across its table, high over the old town: three tall windows; four regulators at the table (gv_behind at
// SP_BS.top, at scale s), the table a layer of its own (basel13table). SP_BS: the table's top, the windows, who sits where, the minster's x.
const SP_BS={top:800,wins:[[140,64,500,628],[710,64,500,628],[1280,64,500,628]],seats:[[400,"spBs1"],[760,"spBs2"],[1160,"spBs3"],[1520,"spBs4"]],s:1.02,minster:960};
// the view from a high window: the sky, the hills and the far bank, the river, the minster on its hill, the old town's roofs below
function sp_baselView(ctx,x0,y0,x1,y1){const R=wc_rng(611),mx=SP_BS.minster;
  const sky=ctx.createLinearGradient(0,y0,0,330);sky.addColorStop(0,"rgb(150,186,220)");sky.addColorStop(1,"rgb(230,236,236)");ctx.fillStyle=sky;ctx.fillRect(x0,y0,x1-x0,y1-y0);
  ctx.save();ctx.globalCompositeOperation="screen";for(const [cx,cy,r] of [[300,150,120],[420,130,90],[900,110,140],[1040,140,100],[1500,170,130],[1630,150,90]])wc_glowAt(ctx,cx,cy,r,[255,255,255],0.5);ctx.restore();
  // the far hills, the far bank's houses
  wc_wash(ctx,[[x0-20,300],[x0+200,262],[520,250],[820,272],[1120,246],[1420,268],[1700,252],[x1+20,270],[x1+20,320],[x0-20,320]],[124,150,150],{depth:0.45,kind:"land",line:false,seed:612});
  for(let x=x0-20;x<x1;){const w=14+R()*26,h=8+R()*16;wc_flat(ctx,wc_rect(x,324-h,w,h+6),[[206,188,170],[196,180,170],[218,204,186],[180,150,140]][Math.floor(R()*4)],0.42,"build");x+=w*(0.7+R()*0.5);}
  wc_flat(ctx,wc_rect(x0,318,x1-x0,12),[200,186,170],0.4,"bank");
  // the river, and a bridge across it
  wc_flat(ctx,wc_rect(x0,328,x1-x0,52),[118,152,166],0.8,"water");ctx.save();ctx.strokeStyle="rgba(240,246,248,0.5)";ctx.lineWidth=2;
  for(let i=0;i<34;i++){const x=x0+R()*(x1-x0),y=334+R()*42,l=20+R()*50;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+l,y);ctx.stroke();}ctx.restore();
  wc_flat(ctx,[[430,382],[470,382],[566,326],[540,326]],[206,190,170],0.8,"bridge");ctx.save();ctx.fillStyle="rgba(70,80,90,0.45)";for(let k=0;k<4;k++){const u=0.15+k*0.22,bx=lerp(450,553,u),by=lerp(382,326,u);ctx.beginPath();ctx.ellipse(bx+8,by+2,7,4,0,Math.PI,TAU);ctx.fill();}ctx.restore();
  // the minster on its hill over the river, red sandstone among trees: the nave under its patterned roof, the choir's apse, and the two
  // west towers, each with a gallery, corner pinnacles and an open spire, one face lit and one in shade
  wc_wash(ctx,[[mx-330,430],[mx-300,382],[mx-150,366],[mx+230,364],[mx+380,378],[mx+420,430]],[132,146,98],{kind:"land",line:false,seed:613,depth:0.85});
  const red=[198,120,102],shade=[160,92,80],nv=[mx-40,mx+200],ridge=244,eave=300;
  wc_part(ctx,wc_rect(nv[0],eave,nv[1]-nv[0],78),red,1,{lw:1.1,seed:614});
  ctx.save();ctx.fillStyle=rgba(shade,0.5);for(let k=0;k<7;k++)ctx.fillRect(nv[0]+12+k*33,eave+4,6,74);ctx.fillStyle="rgba(70,40,40,0.5)";
  for(let k=0;k<6;k++){const wx=nv[0]+26+k*33;ctx.beginPath();ctx.moveTo(wx,eave+56);ctx.lineTo(wx,eave+26);ctx.quadraticCurveTo(wx+5,eave+16,wx+10,eave+26);ctx.lineTo(wx+10,eave+56);ctx.closePath();ctx.fill();}ctx.restore();
  const roof=[[nv[0]-6,eave+2],[nv[0]+28,ridge],[nv[1]-18,ridge],[nv[1]+8,eave+2]];wc_part(ctx,roof,[150,138,98],1,{lw:1,seed:618});
  ctx.save();wc_tr(ctx,roof);ctx.clip();const tc=[[96,124,84],[204,172,92],[158,86,64],[72,72,70]];
  for(let r=0;r<10;r++)for(let c=0;c<40;c++){const x=nv[0]-6+c*7+(r%2)*3.5,y=ridge+2+r*6;ctx.fillStyle=rgba(tc[(r+2*c)%4],0.42);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+3.5,y+3);ctx.lineTo(x,y+6);ctx.lineTo(x-3.5,y+3);ctx.closePath();ctx.fill();}ctx.restore();
  wc_part(ctx,[[nv[1]+4,eave+78],[nv[1]+4,eave+8],[nv[1]+30,eave],[nv[1]+52,eave+12],[nv[1]+58,eave+78]],shade,1,{lw:1,seed:615});
  wc_part(ctx,[[nv[1]+2,eave+10],[nv[1]+30,eave-26],[nv[1]+56,eave+12]],[146,132,94],1,{lw:1,seed:619});
  for(const [tx,tw2] of [[mx-138,46],[mx-86,46]]){const top=176,cx2=tx+tw2/2;wc_part(ctx,wc_rect(tx,top,tw2,eave+78-top),red,1,{lw:1.1,seed:tx|0});
    ctx.save();ctx.fillStyle=rgba(shade,0.55);ctx.fillRect(tx+tw2-10,top,10,eave+78-top);ctx.fillRect(tx,top,4,eave+78-top);ctx.strokeStyle=rgba(shade,0.8);ctx.lineWidth=1.4;
    for(const yy of [226,268,314,352]){ctx.beginPath();ctx.moveTo(tx,yy);ctx.lineTo(tx+tw2,yy);ctx.stroke();}ctx.fillStyle="rgba(70,40,40,0.55)";
    for(const [yy,hh] of [[188,30],[236,26],[278,30],[322,24]]){ctx.beginPath();ctx.moveTo(cx2-5,yy+hh);ctx.lineTo(cx2-5,yy+6);ctx.quadraticCurveTo(cx2,yy-2,cx2+5,yy+6);ctx.lineTo(cx2+5,yy+hh);ctx.closePath();ctx.fill();}ctx.restore();
    wc_flat(ctx,wc_rect(tx-4,top-10,tw2+8,12),wc_lit(red,0.12),1,"gallery");ctx.save();ctx.strokeStyle=rgba(shade,0.7);ctx.lineWidth=1.2;for(let k=0;k<=8;k++){const bx=tx-2+k*(tw2+4)/8;ctx.beginPath();ctx.moveTo(bx,top-10);ctx.lineTo(bx,top);ctx.stroke();}ctx.restore();
    for(const px of [tx-3,tx+tw2-3])wc_flat(ctx,[[px,top-10],[px+6,top-10],[px+3,top-30]],shade,1,"pinnacle");
    const sp0=top-10,sp1=58;ctx.save();ctx.beginPath();ctx.moveTo(tx+5,sp0);ctx.lineTo(cx2,sp1);ctx.lineTo(cx2,sp0);ctx.closePath();ctx.fillStyle=rgba(wc_lit(red,0.08),0.95);ctx.fill();
    ctx.beginPath();ctx.moveTo(cx2,sp0);ctx.lineTo(cx2,sp1);ctx.lineTo(tx+tw2-5,sp0);ctx.closePath();ctx.fillStyle=rgba(shade,0.95);ctx.fill();
    ctx.strokeStyle="rgba(250,232,220,0.45)";ctx.lineWidth=1.1;for(let k=1;k<7;k++){const y=sp0-k*(sp0-sp1)/7.4,hw=(tw2/2-5)*(1-k/7.4);ctx.beginPath();ctx.moveTo(cx2-hw,y);ctx.lineTo(cx2+hw,y);ctx.stroke();}
    ctx.strokeStyle=rgba(shade,0.9);ctx.lineWidth=1.2;for(let k=1;k<9;k++){const u=k/9,y=lerp(sp0,sp1,u),hw=(tw2/2-5)*(1-u);for(const sg of [-1,1]){ctx.beginPath();ctx.moveTo(cx2+sg*hw,y);ctx.lineTo(cx2+sg*(hw+4),y-3);ctx.stroke();}}
    ctx.beginPath();ctx.moveTo(cx2,sp1);ctx.lineTo(cx2,sp1-10);ctx.moveTo(cx2-4,sp1-6);ctx.lineTo(cx2+4,sp1-6);ctx.stroke();ctx.restore();}
  sp_treeLine(ctx,mx-330,mx+420,392,40,616);
  // another church's slim spire, further off; the old town's roofs, row on row below, terracotta, with walls of cream and ochre
  wc_part(ctx,wc_rect(1528,300,22,80),[200,186,160],0.8,{lw:1});wc_part(ctx,[[1526,302],[1552,302],[1539,236]],[96,136,120],0.8,{lw:1});
  sp_roofs(ctx,x0,x1,mx);}
// the old town from above, far to near: mostly roofs, terracotta and a few of slate, gable ends facing this way with a window or two,
// long roofs with a dormer, a tree in a courtyard; hazier and smaller with distance
function sp_roofs(ctx,x0,x1,mx){const R=wc_rng(617),roofs=[[182,96,68],[166,90,66],[196,118,82],[148,86,66],[176,108,84],[124,108,100]],
    walls=[[236,220,190],[222,196,150],[232,200,182],[214,208,196],[196,128,104],[240,226,200]];
  [[388,0.5,0.4],[418,0.58,0.48],[452,0.66,0.58],[490,0.76,0.7],[534,0.86,0.86],[584,0.98,0.93],[640,1.1,1],[704,1.24,1]].forEach(([by,k,d],row)=>{let x=x0-60-R()*80;
    while(x<x1+40){const kind=R(),w=(kind<0.45?(46+R()*44):(90+R()*110))*k,wh=(30+R()*30)*k,rh=(kind<0.45?w*(0.5+R()*0.2):(26+R()*14)*k),y=by+(R()-0.5)*14*k;
      if(row<3&&x+w>mx-310&&x<mx+420){x+=w*0.6;continue;}
      const wc=walls[Math.floor(R()*6)],rf=roofs[Math.floor(R()*6)];
      wc_part(ctx,wc_rect(x,y-wh,w,wh+46*k),wc,d,{lw:0.9,seed:(x|0)+row*7});
      if(kind<0.45){wc_part(ctx,[[x-3*k,y-wh+2],[x+w+3*k,y-wh+2],[x+w/2,y-wh-rh]],rf,d,{lw:0.9,seed:(x|0)+row*11});
        ctx.save();ctx.fillStyle=rgba(wc_haze([74,56,48],d),0.55);const nw=w>60*k?2:1;for(let j=0;j<nw;j++)ctx.fillRect(x+w*(nw===1?0.42:0.25+j*0.38),y-wh+10*k,7*k,11*k);ctx.restore();}
      else{const hip=R()<0.5;wc_part(ctx,hip?[[x-4*k,y-wh+2],[x+w+4*k,y-wh+2],[x+w-rh*0.9,y-wh-rh],[x+rh*0.9,y-wh-rh]]:[[x-4*k,y-wh+2],[x+w+4*k,y-wh+2],[x+w+1*k,y-wh-rh],[x-1*k,y-wh-rh]],rf,d,{lw:0.9,seed:(x|0)+row*11});
        if(R()<0.22){const dx=x+w*(0.3+R()*0.4);wc_flat(ctx,wc_rect(dx-8*k,y-wh-rh*0.62,16*k,12*k),wc_lit(walls[0],0),d,"dormer");wc_flat(ctx,[[dx-10*k,y-wh-rh*0.62],[dx+10*k,y-wh-rh*0.62],[dx,y-wh-rh*0.62-7*k]],wc_dim(rf,0.1),d,"dormer");}
        ctx.save();ctx.strokeStyle=rgba(wc_dim(wc_haze(rf,d),0.25),0.35);ctx.lineWidth=1.2;for(let yy=y-wh-rh+6*k;yy<y-wh;yy+=7*k){ctx.beginPath();ctx.moveTo(x+2*k,yy);ctx.lineTo(x+w-2*k,yy);ctx.stroke();}ctx.restore();}
      if(R()<0.25)wc_flat(ctx,wc_rect(x+w*(0.2+R()*0.6),y-wh-rh*0.8,7*k,15*k),wc_dim(rf,0.25),d,"chimney");
      if(R()<0.16)sp_clump(ctx,x+w+10*k,y-wh*0.4,26*k,(x|0)+3,d);
      x+=w*(0.78+R()*0.3);}});}
// trees: a clump with a bumpy edge, or a line of them along a hill (its top bumping from x0 to x1 at y), one wash each so they don't
// darken where they meet, lighter where the light falls
function sp_clump(ctx,x,y,r,seed,d){const pts=[];for(let i=0;i<28;i++){const a=i/28*TAU,rr=r*(0.86+0.14*Math.sin(a*5+seed));pts.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr*0.82]);}
  wc_wash(ctx,pts,[120,146,90],{depth:d==null?1:d,kind:"leaf",line:false,seed});ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x-r*0.3,y-r*0.35,r*0.7,[210,226,160],0.25);ctx.restore();}
function sp_treeLine(ctx,x0,x1,y,h,seed){const R=wc_rng(seed),pts=[[x0,y+h]];let x=x0,tops=[];while(x<x1){const r=12+R()*12;for(let i=0;i<=6;i++){const a=Math.PI+i/6*Math.PI;pts.push([x+r+Math.cos(a)*r,y-R()*6+Math.sin(a)*r*0.9]);}tops.push([x+r,y-r]);x+=r*2*(0.8+R()*0.2);}
  pts.push([x1,y+h]);wc_wash(ctx,pts,[120,146,90],{kind:"leaf",line:false,seed});ctx.save();ctx.globalCompositeOperation="screen";tops.forEach(([tx,ty])=>wc_glowAt(ctx,tx-4,ty+8,18,[214,230,166],0.3));ctx.restore();
  ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(70,90,60,0.35)");ctx.fillStyle=g;ctx.fillRect(x0,y,x1-x0,h);ctx.restore();}
// the room: its pale walls, the view through the windows, their frames and sills, the light they let in, the chairs' backs
function sp_paintBasel13(ctx){const K=SP_BS;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[222,216,206],{kind:"plaster",line:false,seed:601});wc_wash(ctx,wc_rect(-40,-40,W+80,74),[238,234,226],{kind:"plaster",line:false,seed:602});
  ctx.save();ctx.beginPath();K.wins.forEach(([x,y,w,h])=>ctx.rect(x,y,w,h));ctx.clip();sp_baselView(ctx,K.wins[0][0],K.wins[0][1],K.wins[2][0]+K.wins[2][2],K.wins[0][1]+K.wins[0][3]);
  ctx.fillStyle="rgba(214,232,240,0.1)";ctx.fillRect(0,0,W,H);ctx.restore();
  K.wins.forEach(([x,y,w,h])=>{for(const r of [wc_rect(x-12,y-12,w+24,12),wc_rect(x-12,y-12,12,h+24),wc_rect(x+w,y-12,12,h+24),wc_rect(x+w/2-4,y,8,h),wc_rect(x,y+150,w,8)])wc_part(ctx,r,[92,96,106],1,{lw:1});
    wc_part(ctx,wc_rect(x-24,y+h,w+48,16),[236,232,224],1,{lw:1.2});});
  ctx.save();ctx.globalCompositeOperation="screen";K.wins.forEach(([x,y,w,h])=>wc_glowAt(ctx,x+w/2,y+h+20,360,[255,246,226],0.22));ctx.restore();
  // the chairs' backs: charcoal, curved
  K.seats.forEach(([x],i)=>{wc_part(ctx,wc_rrPts(x-66,K.top-218,132,250,36),[64,66,76],1,{lw:1.3,seed:620+i});
    ctx.save();ctx.strokeStyle="rgba(255,255,255,0.12)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-48,K.top-198);ctx.quadraticCurveTo(x-58,K.top-120,x-52,K.top-40);ctx.stroke();ctx.restore();});}
// the table, over the people at it: pale oak; for each, the principles in a white folder, a glass, a microphone on its stem
function sp_paintBasel13Table(ctx){const K=SP_BS,top=K.top,near=990,oak=[220,188,144];
  wc_part(ctx,[[-40,top],[W+40,top],[W+40,near],[-40,near]],oak,1,{seed:632,lw:1.2});ctx.save();const G=wc_rng(633);ctx.lineWidth=1.6;
  for(let y=top+10;y<near;y+=9+G()*14+(y-top)*0.05){ctx.strokeStyle="rgba(130,90,52,"+(0.06+G()*0.08).toFixed(3)+")";ctx.beginPath();const x0=-20+G()*400,x1=W+20-G()*400;ctx.moveTo(x0,y);
    for(let x=x0;x<=x1;x+=60)ctx.lineTo(x,y+2.4*Math.sin(x/(150+G()*60)+y*0.3));ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";K.wins.forEach(([x,,w])=>wc_glowAt(ctx,x+w/2,top+60,340,[255,250,236],0.3));ctx.restore();
  wc_part(ctx,wc_rect(-40,near,W+80,H-near+40),[150,116,82],1,{seed:631});ctx.save();ctx.fillStyle="rgba(255,250,236,0.45)";ctx.fillRect(-40,near-2,W+80,3);ctx.restore();
  K.seats.forEach(([x],i)=>{const fx=x+(i%2?24:-24),y0=top+36,y1=top+110,wb=150,wf=172;ctx.save();ctx.filter="blur(4px)";ctx.fillStyle="rgba(90,60,30,0.22)";
    ctx.beginPath();ctx.moveTo(fx-wb+6,y0+8);ctx.lineTo(fx+wb+6,y0+8);ctx.lineTo(fx+wf+8,y1+10);ctx.lineTo(fx-wf+8,y1+10);ctx.closePath();ctx.fill();ctx.restore();
    wc_part(ctx,[[fx-wb,y0],[fx+wb,y0],[fx+wf,y1],[fx-wf,y1]],[248,248,244],1,{lw:1.1,seed:640+i});
    wc_flat(ctx,[[fx-wb*0.92,y0+12],[fx+wb*0.92,y0+12],[fx+wb*0.94,y0+22],[fx-wb*0.94,y0+22]],[52,84,140],1,"band");
    ctx.save();ctx.strokeStyle="rgba(120,124,136,0.5)";ctx.lineWidth=2;for(let j=0;j<3;j++){const yy=y0+44+j*16,ww=lerp(wb,wf,(yy-y0)/(y1-y0))*0.7;ctx.beginPath();ctx.moveTo(fx-ww,yy);ctx.lineTo(fx+ww*(j===2?0.3:1),yy);ctx.stroke();}ctx.restore();
    const gx=x+(i%2?-200:200),gy=top+70;ctx.save();ctx.fillStyle="rgba(206,228,236,0.4)";ctx.fillRect(gx-17,gy-64,34,66);ctx.strokeStyle="rgba(255,255,255,0.8)";ctx.lineWidth=2;ctx.strokeRect(gx-17,gy-64,34,66);
    ctx.fillStyle="rgba(255,255,255,0.45)";ctx.fillRect(gx-12,gy-58,5,54);ctx.beginPath();ctx.ellipse(gx,gy-64,17,4,0,0,TAU);ctx.strokeStyle="rgba(255,255,255,0.85)";ctx.stroke();ctx.beginPath();ctx.ellipse(gx,gy+2,17,4,0,0,TAU);ctx.fillStyle="rgba(120,100,80,0.18)";ctx.fill();ctx.restore();
    const mx2=x+(i%2?120:-120),my=top+46;wc_part(ctx,wc_rrPts(mx2-30,my-16,60,22,7),[40,42,48],1,{lw:1});ctx.save();ctx.strokeStyle="rgb(36,38,44)";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(mx2,my-14);
    ctx.quadraticCurveTo(mx2,my-150,mx2+(x-mx2)*0.42,my-190);ctx.stroke();ctx.restore();});}

// The principles and the report from above, open on the table: SP_PR is the spread, its spine, top, and one page's size.
const SP_PR={spine:960,y:70,w:640,h:940};
// a table's top from above: pale oak, its grain in long uneven streaks, the light from the windows at the top of the frame (warm: the
// afternoon's, from the right)
function sp_paintOak(ctx,seed,warm){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),warm?[222,186,138]:[226,196,152],{kind:"plaster",line:false,seed});
  const G=wc_rng(seed+1);ctx.save();ctx.lineCap="round";for(let i=0;i<70;i++){const y=G()*H,x0=-60+G()*W*0.6,len=500+G()*1400,amp=2+G()*6,f=120+G()*200;ctx.strokeStyle="rgba(130,88,48,"+(0.05+G()*0.08).toFixed(3)+")";ctx.lineWidth=1+G()*2.2;
    ctx.beginPath();ctx.moveTo(x0,y);for(let x=x0;x<=x0+len;x+=40)ctx.lineTo(x,y+amp*Math.sin(x/f+i)+(x-x0)*0.012);ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";if(warm)wc_glowAt(ctx,W+100,200,1200,[255,224,170],0.3);else wc_glowAt(ctx,960,-200,1300,[255,250,236],0.3);ctx.restore();}
// a booklet open on it, spine at SP_PR.spine: its soft shadow, the cover's edge round the pages, the pages' stacked edges; the pages are
// painted blank and their words written every frame
function sp_spread(ctx,cover){const {spine,y,w,h}=SP_PR;ctx.save();ctx.filter="blur(16px)";ctx.fillStyle="rgba(80,50,20,0.32)";ctx.fillRect(spine-w-4,y+22,2*w+30,h+8);ctx.restore();
  wc_part(ctx,wc_rrPts(spine-w-14,y-10,2*w+28,h+22,8),cover,1,{kind:"cover",lw:1.2,seed:651});
  for(const s of [-1,1])for(let k=3;k>=0;k--){const x0=s<0?spine-w-k*3:spine;wc_flat(ctx,wc_rect(x0,y+k*2,w+k*3,h-k*2),[244-k*6,242-k*6,236-k*6],1,"page");}
  sp_pageBlank(ctx,spine-w,y,w,h,-1);sp_pageBlank(ctx,spine,y,w,h,1);}
// one page's paper, and the shade in its gutter (side -1: a left page, its gutter on the right)
function sp_pageBlank(ctx,x,y,w,h,side){wc_wash(ctx,wc_rect(x,y,w,h),[252,251,246],{kind:"page",line:false,seed:(x|0)+7});const gx=side<0?x+w:x,g=ctx.createLinearGradient(gx,0,gx-side*-90,0);
  g.addColorStop(0,"rgba(120,104,84,0.3)");g.addColorStop(0.35,"rgba(120,104,84,0.08)");g.addColorStop(1,"rgba(120,104,84,0)");ctx.fillStyle=g;ctx.fillRect(side<0?x+w-90:x,y,90,h);}
// paragraphs of small print: [[y, lines], ...] on a page from x, w wide
function sp_print(ctx,x,w,blocks,a){blocks.forEach(([y,n])=>gv_lines(ctx,x,y,w,n,22,a));}
// the list of principles on the left page: the title, then the first six; o.lit: "1 · Governance" lit gold, 0 to 1; o.run: gold
// running from it down to each of the others, 0 to 1
const SP_PRL=["1 · Governance","2 · Data architecture","3 · Accuracy","4 · Completeness","5 · Timeliness","6 · Adaptability"],SP_PRY=[440,540,610,680,750,820];
function sp_prList(ctx,o){o=o||{};const x=SP_PR.spine-SP_PR.w+70,a=o.a==null?1:o.a;
  wc_T(ctx,"Principles for",x,230,{w:800,size:52,f:"serif",col:WC_DARK,a});wc_T(ctx,"banks' risk data",x,292,{w:800,size:52,f:"serif",col:WC_DARK,a});
  ctx.save();ctx.fillStyle=rgba(WC_DARK,0.55*a);ctx.fillRect(x,334,500,3);ctx.restore();
  const lit=o.lit||0,run=o.run||0;if(lit>0){const tw1=tw(ctx,SP_PRL[0],46,800);ctx.save();ctx.globalCompositeOperation="multiply";
    wc_wash(ctx,wc_rrPts(x-16,SP_PRY[0]-46,(tw1+32)*easeCam(lit),62,10),GV.gold,{kind:"swatch",a:0.55*a,seed:661});ctx.restore();}
  if(run>0){const rx=x-30,y0=SP_PRY[0]-14,y1=SP_PRY[5]-10,p=easeCam(run),yy=lerp(y0,y1,p);ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95*a);ctx.lineWidth=5;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(rx,y0);ctx.lineTo(rx,yy);ctx.stroke();for(let i=1;i<6;i++){const ty=SP_PRY[i]-10;if(yy<ty)continue;const q=clamp((yy-ty)/60,0,1);ctx.beginPath();ctx.moveTo(rx,ty);ctx.lineTo(rx+22*q,ty);ctx.stroke();}ctx.restore();}
  SP_PRL.forEach((s,i)=>{if(i===0){wc_T(ctx,s,x,SP_PRY[0],{w:800,size:46,col:mix(WC_DARK,GV.goldInk,lit),a});return;}
    const g=run>0?clamp((lerp(SP_PRY[0]-14,SP_PRY[5]-10,easeCam(run))-(SP_PRY[i]-10))/60,0,1):0;wc_T(ctx,s,x,SP_PRY[i],{w:600,size:30,col:mix(WC_MUTED,GV.goldInk,g*0.7),a:a*(0.85+0.15*g)});});}
// the page about the first principle (the right page; it turns), and the back of it, about the second, where one line is written
// every frame (sp_prOwn); and the page under it. Kept as pictures, so the turning page can be drawn squeezed.
function sp_prFace(key,paint,side){const {w,h}=SP_PR;return wc_kept("spPr"+key,w,h,q=>{sp_pageBlank(q,0,0,w,h,side);paint(q);});}
const sp_prGov=q=>{wc_T(q,"1 · Governance",60,110,{w:800,size:36,col:WC_DARK});sp_print(q,60,520,[[160,6],[330,5],[470,7],[660,4],[790,5]],1);};
const sp_prArch=q=>{wc_T(q,"2 · Data architecture",70,110,{w:800,size:36,col:WC_DARK});sp_print(q,70,500,[[160,5],[300,3],[596,6],[770,5]],1);};
const sp_prNext=q=>sp_print(q,60,520,[[110,7],[290,6],[460,5],[620,7],[810,4]],1);
// the second principle's line: written in word by word as p goes 0 to 1; "ownership" and "quality" lit gold as own and qual do, "risk
// data" underlined as risk does
function sp_prOwn(ctx,p,own,qual,risk){const x=SP_PR.spine-SP_PR.w+70,y=SP_PR.y,L1=["the","ownership","and","quality"],L2=["of","risk","data"],sz=50,sp=tw(ctx," ",sz,500,"serif");
  const words=[...L1.map((s,i)=>[s,0,i]),...L2.map((s,i)=>[s,1,i])];let cx=[x,x];
  words.forEach(([s,ln,i],k)=>{const wd=tw(ctx,s,sz,500,"serif"),wx=cx[ln],wy=y+(ln?530:466);cx[ln]+=wd+sp;const a=clamp(p*words.length-k,0,1);if(a<=0)return;
    const g=s==="ownership"?own:s==="quality"?qual:0;if(g>0){ctx.save();ctx.globalCompositeOperation="multiply";wc_wash(ctx,wc_rrPts(wx-8,wy-44,(wd+16)*easeCam(g),58,8),GV.gold,{kind:"swatch",a:0.55,seed:670+k});ctx.restore();}
    if((s==="risk"||s==="data")&&risk>0){ctx.save();ctx.fillStyle=rgba(GV.goldInk,0.8);ctx.fillRect(wx,wy+10,(wd+(s==="risk"?sp:0))*easeCam(risk),4);ctx.restore();}
    wc_T(ctx,s,wx,wy,{w:500,size:sz,f:"serif",col:mix(WC_DARK,GV.goldInk,g),a});});}
// the right page turning over the spine, th 0 to PI: its front squeezed toward the spine, then its back opening out over the left page;
// shaded as it stands up, and its shadow on the pages under it
function sp_turn(ctx,th,front,back){const {spine,y,w,h}=SP_PR,c=Math.cos(th),up=Math.sin(th),fx=w*Math.abs(c);
  ctx.save();const sx=c>0?spine+fx:spine-fx,g=ctx.createLinearGradient(sx,0,sx+(c>0?1:-1)*140*up,0);g.addColorStop(0,"rgba(80,60,40,"+(0.28*up).toFixed(3)+")");g.addColorStop(1,"rgba(80,60,40,0)");
  ctx.fillStyle=g;ctx.fillRect(c>0?sx:sx-140*up,y,140*up,h);ctx.restore();
  ctx.save();ctx.translate(spine,y+h/2);ctx.scale(Math.max(0.001,Math.abs(c)),1+0.05*up);ctx.drawImage(c>0?front:back,c>0?0:-w,-h/2,w,h);ctx.restore();
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle="rgba(150,140,128,"+(0.32*up*up).toFixed(3)+")";const x0=c>0?spine:spine-fx;ctx.fillRect(x0,y-h*0.025*up,fx,h*(1+0.05*up));ctx.restore();}

// thirty-one small towers in rows on the report's left page, one for each bank, no names (SP_TW: where each stands, its size and shape);
// the two in SP_GREEN met all the principles
const SP_TW=(()=>{const R=wc_rng(681),o=[];for(let i=0;i<31;i++){const row=Math.floor(i/8),col=i%8;o.push({x:SP_PR.spine-SP_PR.w+92+col*62+(row===3?31:0),base:360+row*110,
  w:30+R()*12,h:56+R()*40,top:Math.floor(R()*4),win:R()<0.5?2:3,row,col});}return o;})(),SP_GREEN=[10,21];
// one tower: o.in, how far it has stood up; o.g, how green; o.shine, a light passing over it
function sp_tower(ctx,T,o){const k=o.in==null?1:o.in;if(k<=0.01)return;const {x,base,w,top,win}=T,h=T.h*easeCam(k),g=o.g||0,sh=o.shine||0;
  const body=mix(mix([206,212,224],[150,206,164],g),[255,255,255],0.4*sh),ink=mix([96,104,124],GV.greenInk,g);ctx.save();ctx.globalAlpha=clamp(k*1.5,0,1);
  ctx.beginPath();const l=x-w/2,r=x+w/2,t=base-h;if(top===0){ctx.rect(l,t,w,h);}else if(top===1){ctx.moveTo(l,base);ctx.lineTo(l,t+14);ctx.lineTo(l+w*0.22,t+14);ctx.lineTo(l+w*0.22,t);ctx.lineTo(r-w*0.22,t);ctx.lineTo(r-w*0.22,t+14);ctx.lineTo(r,t+14);ctx.lineTo(r,base);ctx.closePath();}
  else if(top===2){ctx.moveTo(l,base);ctx.lineTo(l,t+12);ctx.lineTo(r,t);ctx.lineTo(r,base);ctx.closePath();}else{ctx.moveTo(l,base);ctx.lineTo(l,t+16);ctx.lineTo(x,t-6);ctx.lineTo(r,t+16);ctx.lineTo(r,base);ctx.closePath();}
  ctx.fillStyle=rgba(body,0.95);ctx.fill();ctx.lineJoin="round";ctx.lineWidth=2.4;ctx.strokeStyle=rgba(ink,0.85);ctx.stroke();
  ctx.fillStyle=rgba(mix([252,252,248],[236,250,240],g),0.9);const cw=(w-10)/win;for(let yy=t+(top===0?8:20);yy<base-12;yy+=13)for(let c=0;c<win;c++)ctx.fillRect(l+5+c*cw+1,yy,cw-3,6);
  if(top===0){ctx.fillStyle=rgba(ink,0.8);ctx.fillRect(x-1,t-12,2,12);}ctx.restore();}
// the green towers' light, under all the towers so it doesn't tint their neighbours
function sp_towerGlow(ctx,T,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,T.x,T.base-T.h*0.5,T.h*0.85,[150,220,170],0.75*a);ctx.restore();}
// the line each row stands on
function sp_rowGround(ctx,a){ctx.save();ctx.fillStyle=rgba([140,148,164],0.5*a);for(let r=0;r<4;r++)ctx.fillRect(SP_PR.spine-SP_PR.w+52,360+r*110,536,3);ctx.restore();}
// a sticky note stuck on as p goes 0 to 1, with words in marker
function sp_sticky(ctx,x,y,rot,lines,p,seed){if(p<=0.01)return;const s=1.18-0.18*spring(clamp(p,0,1)),w=320,h=210;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.globalAlpha=clamp(p*3,0,1);
  ctx.save();ctx.filter="blur(5px)";ctx.fillStyle="rgba(70,60,40,0.25)";ctx.fillRect(-w/2+6,-h/2+10,w,h);ctx.restore();wc_wash(ctx,wc_rect(-w/2,-h/2,w,h),GV_NOTE[0],{kind:"card",line:false,seed});
  ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(-w/2,-h/2,w,26);lines.forEach((l,i)=>wc_hand(ctx,l,-w/2+26,-h/2+(lines.length===1?124:90+i*58),{size:40,col:[44,52,90],w:700}));ctx.restore();}
// the places: the principles open on the pale oak table in the morning; the report open on it in the afternoon, ten years on
function sp_paintPrinciples13(ctx){sp_paintOak(ctx,641,false);sp_spread(ctx,[236,236,232]);}
function sp_paintReport23(ctx){sp_paintOak(ctx,691,true);sp_spread(ctx,[52,98,100]);const {spine,w}=SP_PR;sp_print(ctx,spine-w+70,500,[[234,2]],1);
  sp_print(ctx,spine+60,520,[[110,6],[290,5],[460,7],[650,4],[790,6]],1);}
// the report's page as it's read (o: the times things happen): its title; the towers standing up row by row; a light passing over them
// all; the two that met the principles turning green; what that means, in words; the notes stuck on the facing page; then, ten years
// on from the principles, the two green towers glowing as the decisions are named
function sp_report(ctx,tt,o){const {spine,w}=SP_PR,go=fin(tt,o.go,0.6);wc_T(ctx,"Progress report",spine-w+70,200,{w:700,size:34,col:WC_MUTED});
  const g=i=>i===SP_GREEN[0]?fin(tt,o.two-0.1,0.5):i===SP_GREEN[1]?fin(tt,o.two+0.2,0.5):0,glow=1+0.8*fin(tt,o.dec-0.1,0.9);
  SP_GREEN.forEach(i=>sp_towerGlow(ctx,SP_TW[i],g(i)*glow));sp_rowGround(ctx,fin(tt,o.at+0.2,0.6));
  SP_TW.forEach((T,i)=>sp_tower(ctx,T,{in:fin(tt,o.at+0.3+T.row*0.28+T.col*0.05,0.6),g:g(i),shine:gv_io(tt,o.thirty-0.15+i*0.03,o.thirty+0.2+i*0.03,0.2)}));
  const ca=fin(tt,o.met-0.1,0.5)*(1-go);if(ca>0.01){const s1="2",s2=" of 31 met them all",sz=42,w1=tw(ctx,s1,sz,800),w2=tw(ctx,s2,sz,800),cx=spine-w/2-(w1+w2)/2;
    wc_T(ctx,s1,cx,790,{w:800,size:sz,col:GV.greenInk,a:ca});wc_T(ctx,s2,cx+w1,790,{w:800,size:sz,col:WC_DARK,a:ca});}
  [[1200,300,-0.04,["underfunded"],o.under],[1420,520,0.05,["narrow"],o.narrow],[1230,750,-0.03,["the board's","attention?"],o.att]].forEach(([x,y,r,l,t0],i)=>{
    const p=fin(tt,t0-0.1,0.6);if(p>0.01&&go<0.99)withA(ctx,1-go,()=>sp_sticky(ctx,x,y,r,l,p,701+i));});}


/* ---------- 2017: a team room ---------- */
// The team room: a pale sage wall, a whiteboard on the left where the proposal is stuck up, a window onto the city on the right; one of
// the team stands at the board, three sit at the table, the table a layer of its own (team17table), over them. SP_TR: the wall's foot,
// the whiteboard, the sheet on it, the map on the sheet, the window, the table's left end, far edge and near edge, who sits where,
// their scale, the one standing [x, foot, scale].
const SP_TR={fy:742,board:[64,104,780,580],sheet:[112,136,600,510],map:[146,302,532,318],win:[1072,80,830,600],table:[1000,808,904],
  seats:[[1196,"spT1"],[1476,"spT3"],[1752,"spT4"]],s:0.92,stand:[806,1014,0.95]};
const SP_WALL17=[222,226,212];
// poses: seated, turned to the left or the right, and the same looking down a little (a nod is a swing between them); a hand raised to
// ask; standing, an arm up pointing high on the left, the other arm open to the right while turned to the right, and turned to the right
// with the arms down
Object.assign(POSE,{
  spSitL:{L:[0.14,-0.08],R:[0.1,0.05],feet:24,shift:0,tilt:0.04,turn:-0.32,gaze:[-0.8,-0.05],look:0},
  spSitLNod:{L:[0.14,-0.08],R:[0.1,0.05],feet:24,shift:0,tilt:-0.07,turn:-0.32,gaze:[-0.6,1],look:2.6},
  spSitR:{L:[0.14,-0.08],R:[0.1,0.05],feet:24,shift:0,tilt:-0.04,turn:0.32,gaze:[0.8,-0.05],look:0},
  spAskUp:{L:[0.14,-0.08],R:[0.55,-2.8],hand:"open",feet:24,shift:0,tilt:-0.03,turn:0.06,gaze:[0.1,-0.05],look:0},
  spPointUp:{L:[0.12,-0.06],R:[1.6,2.2],hand:"open",feet:34,shift:6,tilt:-0.05,turn:0.32,gaze:[0.7,-0.4],look:0},
  spPitch:{L:[0.85,2.15],R:[0.12,-0.06],feet:32,shift:-4,tilt:0.03,turn:-0.3,gaze:[-0.7,0],look:0},
  spPitchNod:{L:[0.85,2.15],R:[0.12,-0.06],feet:32,shift:-4,tilt:0.09,turn:-0.3,gaze:[-0.5,1],look:2.6},
  spBackR:{L:[0.12,-0.08],R:[0.14,-0.06],feet:30,shift:4,tilt:0.02,turn:-0.28,gaze:[-0.7,0],look:0}
});
// the city through the window by day: a pale sky, far towers in haze, nearer blocks of offices and flats with their windows, the tops
// of the trees along the street
function sp_dayCity(ctx,x,y,w,h,seed){const R=wc_rng(seed),base=y+h;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  const g=ctx.createLinearGradient(0,y,0,base);g.addColorStop(0,"rgb(176,204,226)");g.addColorStop(0.7,"rgb(222,232,236)");g.addColorStop(1,"rgb(238,236,228)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  ctx.save();ctx.globalCompositeOperation="screen";for(let i=0;i<5;i++)wc_glowAt(ctx,x+R()*w,y+40+R()*h*0.35,120+R()*140,[255,255,255],0.42);ctx.restore();
  for(let X=x-20;X<x+w+20;){const tw_=50+R()*70,th=h*(0.28+R()*0.34);wc_wash(ctx,wc_rect(X,base-th-90,tw_,th+90),[168,182,200],{kind:"build",depth:0.45,lw:0.8,seed:seed+X});X+=tw_+6+R()*30;}
  const cols=[[196,188,174],[176,120,98],[150,170,186],[208,200,184],[164,150,140]];
  for(let X=x-30;X<x+w+30;){const bw=110+R()*150,bh=h*(0.22+R()*0.3),c=cols[Math.floor(R()*cols.length)],top=base-bh-40;
    wc_part(ctx,wc_rect(X,top,bw,bh+40),c,0.75,{lw:1,seed:seed+7+X});
    ctx.save();ctx.fillStyle=rgba(wc_dim(c,0.38),0.55);for(let yy=top+16;yy<base-50;yy+=30)for(let xx=X+12;xx<X+bw-22;xx+=26)ctx.fillRect(xx,yy,14,16);ctx.restore();
    ctx.save();ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(X,top,bw*0.3,bh+40);ctx.restore();X+=bw+4+R()*20;}
  sp_treeLine(ctx,x-20,x+w+20,base-46,60,seed+3);ctx.restore();}
// the proposal's map: streets in a slanted grid, blocks, two parks, a river; the shop's pin and the ring round it are drawn every frame
const SP_SHOP=[420,452],SP_ZONE=[74,84,120];
function sp_mapArt(ctx){const [mx,my,mw,mh]=SP_TR.map;ctx.save();ctx.beginPath();ctx.rect(mx,my,mw,mh);ctx.clip();
  ctx.fillStyle="rgb(238,234,222)";ctx.fillRect(mx,my,mw,mh);
  ctx.fillStyle="rgb(196,222,236)";ctx.beginPath();ctx.moveTo(mx-10,my+mh-60);ctx.bezierCurveTo(mx+160,my+mh-110,mx+320,my+mh-10,mx+mw+10,my+mh-70);ctx.lineTo(mx+mw+10,my+mh-30);
  ctx.bezierCurveTo(mx+320,my+mh+30,mx+160,my+mh-70,mx-10,my+mh-20);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgb(200,224,184)";ctx.fillRect(mx+40,my+30,120,86);ctx.fillRect(mx+380,my+40,100,70);
  ctx.translate(mx+mw/2,my+mh/2);ctx.rotate(-0.12);ctx.strokeStyle="rgb(252,252,248)";ctx.lineCap="round";
  for(let i=-6;i<=6;i++){ctx.lineWidth=i%3===0?12:6;ctx.beginPath();ctx.moveTo(i*62,-mh);ctx.lineTo(i*62,mh);ctx.stroke();}
  for(let j=-4;j<=4;j++){ctx.lineWidth=j%2===0?11:6;ctx.beginPath();ctx.moveTo(-mw,j*58);ctx.lineTo(mw,j*58);ctx.stroke();}
  ctx.restore();ctx.save();ctx.strokeStyle="rgba(120,120,120,0.5)";ctx.lineWidth=2;ctx.strokeRect(mx,my,mw,mh);ctx.restore();}
// the customers' locations on it, in plum, as the series draws personal data: n of them (0 to SP_DOTS.length), each popping in; the
// ring round the shop, dashed, drawn as ring goes 0 to 1; the shop, a pin with a bag in it
const SP_DOTS=(()=>{const R=wc_rng(701),o=[],[mx,my,mw,mh]=SP_TR.map;for(let i=0;i<120;i++){let px,py;
  if(R()<0.55){const a=R()*TAU,r=30+R()*170;px=SP_SHOP[0]+Math.cos(a)*r*1.3;py=SP_SHOP[1]+Math.sin(a)*r*0.8;}else{px=mx+14+R()*(mw-28);py=my+14+R()*(mh-28);}
  o.push([clamp(px,mx+12,mx+mw-12),clamp(py,my+12,my+mh-12)]);}return o;})();
function sp_mapDots(ctx,n,ring){const [mx,my,mw,mh]=SP_TR.map,[sx,sy]=SP_SHOP;ctx.save();ctx.beginPath();ctx.rect(mx,my,mw,mh);ctx.clip();
  if(ring>0){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([238,214,170],0.55*ring);ctx.beginPath();ctx.ellipse(sx,sy,150,96,0,0,TAU);ctx.fill();ctx.restore();
    ctx.save();ctx.strokeStyle=rgba(SP_ZONE,0.85);ctx.lineWidth=4;ctx.setLineDash([14,10]);ctx.beginPath();ctx.ellipse(sx,sy,150,96,0,-Math.PI/2,-Math.PI/2+TAU*easeCam(ring));ctx.stroke();ctx.restore();}
  for(let i=0;i<SP_DOTS.length;i++){const q=clamp(n-i,0,1);if(q<=0)break;const [px,py]=SP_DOTS[i],k=spring(q);
    ctx.fillStyle="rgba(255,255,255,0.9)";ctx.beginPath();ctx.arc(px,py,9*k,0,TAU);ctx.fill();ctx.fillStyle=rgba(GV_CLASS.direct,0.92);ctx.beginPath();ctx.arc(px,py,6.5*k,0,TAU);ctx.fill();}
  ctx.restore();ctx.save();ctx.fillStyle="rgba(40,30,30,0.25)";ctx.beginPath();ctx.ellipse(sx+4,sy+4,12,5,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(WC_DARK,1);ctx.beginPath();ctx.moveTo(sx,sy);ctx.bezierCurveTo(sx-26,sy-30,sx-24,sy-62,sx,sy-62);ctx.bezierCurveTo(sx+24,sy-62,sx+26,sy-30,sx,sy);ctx.fill();
  ctx.fillStyle="rgb(252,250,244)";ctx.fillRect(sx-9,sy-46,18,15);ctx.strokeStyle="rgb(252,250,244)";ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(sx,sy-46,5,Math.PI,0);ctx.stroke();ctx.restore();}
// an office chair, empty, seen from behind: black mesh on a five-star base; its base's middle on the floor at (x, y)
function sp_officeChair(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const blk=[44,46,54],dk=[30,32,38];
  wc_contact(ctx,-150,150,0,1,0.3);
  for(const [ax,ay] of [[-128,-6],[-70,8],[0,12],[78,6],[126,-8]]){wc_part(ctx,[[-8,-34],[8,-34],[ax+6,ay-14],[ax-6,ay-14]],dk,1,{kind:"thing",lw:1,seed:(ax+200)|0});
    ctx.fillStyle="rgb(26,26,30)";ctx.beginPath();ctx.arc(ax,ay-6,10,0,TAU);ctx.fill();}
  wc_part(ctx,wc_rect(-9,-150,18,118),[150,152,160],1,{kind:"thing",lw:1,seed:771});wc_part(ctx,wc_rrPts(-120,-196,240,52,20),blk,1,{kind:"thing",lw:1.2,seed:772});
  wc_part(ctx,wc_rrPts(-104,-430,208,236,48),blk,1,{kind:"thing",lw:1.2,seed:773});
  ctx.save();ctx.strokeStyle="rgba(255,255,255,0.07)";ctx.lineWidth=2;for(let i=-90;i<=90;i+=12){ctx.beginPath();ctx.moveTo(i,-420);ctx.lineTo(i*0.9,-206);ctx.stroke();}ctx.restore();
  for(const sx of [-1,1])wc_part(ctx,[[sx*112,-196],[sx*124,-196],[sx*124,-262],[sx*96,-262]],dk,1,{kind:"thing",lw:1,seed:774+sx});ctx.restore();}
// the room: the wall and the floor, the window and its light, the whiteboard with the sheet stuck on it, the chair she got up from
function sp_paintTeam17(ctx){const K=SP_TR,[bx,by,bw,bh]=K.board,[sx,sy,sw,sh]=K.sheet,[wx,wy,ww,wh]=K.win;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,K.fy+40),SP_WALL17,{kind:"plaster",line:false,seed:711});
  wc_wash(ctx,wc_rect(-40,K.fy,W+80,H-K.fy+40),[132,138,150],{kind:"ground",line:false,seed:712});
  ctx.save();ctx.strokeStyle="rgba(90,96,110,0.16)";ctx.lineWidth=2;for(let yy=K.fy+30;yy<H;yy+=46+(yy-K.fy)*0.18){ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(W,yy);ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_rect(-40,K.fy-14,W+80,16),wc_dim(SP_WALL17,0.3),{kind:"trim",line:false,flat:true});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww/2,wy+wh*0.6,900,[255,250,236],0.32);ctx.restore();
  sp_dayCity(ctx,wx,wy,ww,wh,721);
  for(const r of [wc_rect(wx-14,wy-14,ww+28,14),wc_rect(wx-14,wy-14,14,wh+28),wc_rect(wx+ww,wy-14,14,wh+28),wc_rect(wx+ww/3-5,wy,10,wh),wc_rect(wx+ww*2/3-5,wy,10,wh)])wc_part(ctx,r,[226,226,222],1,{lw:1.1});
  wc_part(ctx,wc_rect(wx-30,wy+wh,ww+60,18),[236,234,228],1,{lw:1.2});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww/2,wy+wh/2,560,[255,255,250],0.18);ctx.restore();
  ctx.save();ctx.filter="blur(8px)";ctx.fillStyle="rgba(60,60,60,0.18)";ctx.fillRect(bx+10,by+14,bw,bh);ctx.restore();
  wc_part(ctx,wc_rect(bx-10,by-10,bw+20,bh+20),[176,180,188],1,{kind:"thing",lw:1.2,seed:713});wc_flat(ctx,wc_rect(bx,by,bw,bh),[250,251,250],1,"board");
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,bx+bw*0.8,by+80,300,[255,255,255],0.4);ctx.restore();
  wc_part(ctx,wc_rect(bx+40,by+bh+10,bw-80,14),[170,174,182],1,{kind:"thing",lw:1,seed:714});for(const [mx2,c] of [[bx+90,[40,60,150]],[bx+150,[200,50,40]],[bx+200,[30,30,36]]])wc_flat(ctx,wc_rect(mx2,by+bh+4,46,10),c,1,"marker");
  // marker left on the board beside the sheet, that nobody needs to read
  ctx.save();ctx.strokeStyle="rgba(40,60,150,0.55)";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sx+sw+30,by+60);ctx.lineTo(sx+sw+100,by+60);ctx.moveTo(sx+sw+30,by+100);ctx.lineTo(sx+sw+80,by+100);
  ctx.moveTo(sx+sw+40,by+170);ctx.quadraticCurveTo(sx+sw+80,by+140,sx+sw+96,by+200);ctx.stroke();ctx.restore();
  ctx.drawImage(gv_sheetPaper(sw,sh),sx-20,sy-20);sp_mapArt(ctx);
  for(const [mx2,my2,c] of [[sx+22,sy+20,[220,70,60]],[sx+sw-22,sy+20,[60,120,200]],[sx+22,sy+sh-18,[60,160,100]],[sx+sw-22,sy+sh-18,[240,180,40]]]){ctx.save();ctx.fillStyle="rgba(40,40,40,0.25)";
    ctx.beginPath();ctx.arc(mx2+3,my2+4,13,0,TAU);ctx.fill();ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(mx2,my2,12,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.5)";ctx.beginPath();ctx.arc(mx2-4,my2-4,4,0,TAU);ctx.fill();ctx.restore();}
  sp_officeChair(ctx,330,1066,0.82);}
// the proposal's title, printed, coming in line by line as p goes 0 to 1
function sp_proposal(ctx,p){const [sx,sy]=SP_TR.sheet;wc_T(ctx,"Use customers' locations",sx+40,sy+84,{w:800,size:42,col:WC_DARK,a:clamp(p*2,0,1)});
  wc_T(ctx,"to time our offers?",sx+40,sy+138,{w:800,size:42,col:WC_DARK,a:clamp(p*2-1,0,1)});}
// the table, over the people at it: a pale top seen from above, its edge, the dark under it; on it a laptop, cups, glasses, a phone, a pad
function sp_paintTeam17Table(ctx){const [x0,top,near]=SP_TR.table,col=[236,232,224];
  ctx.save();ctx.fillStyle="rgba(50,50,60,0.4)";ctx.filter="blur(10px)";ctx.fillRect(x0+40,near+20,W,H-near);ctx.restore();
  wc_part(ctx,[[x0+40,near+34],[W+40,near+34],[W+40,H+40],[x0+70,H+40]],[86,88,98],1,{lw:1,seed:731});wc_part(ctx,wc_rect(x0+70,near+30,26,H-near),[150,152,160],1,{kind:"thing",lw:1,seed:732});
  wc_part(ctx,[[x0+30,top],[W+40,top],[W+40,near],[x0,near]],col,1,{lw:1.2,seed:733});
  wc_part(ctx,wc_rect(x0,near,W+40-x0,30),[196,168,128],1,{lw:1.1,seed:734});ctx.save();ctx.fillStyle="rgba(255,255,255,0.5)";ctx.fillRect(x0,near,W-x0,3);ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1500,top+30,520,[255,255,250],0.35);ctx.restore();
  ctx.save();ctx.filter="blur(4px)";ctx.fillStyle="rgba(60,60,70,0.25)";ctx.fillRect(1306,top+34,190,40);ctx.restore();
  wc_part(ctx,[[1310,top+26],[1480,top+26],[1490,top+66],[1300,top+66]],[196,200,206],1,{kind:"thing",lw:1.1,seed:735});ctx.fillStyle="rgba(255,255,255,0.4)";ctx.fillRect(1312,top+28,166,3);
  wc_part(ctx,[[1590,top+40],[1660,top+40],[1664,top+60],[1586,top+60]],[40,42,50],1,{kind:"thing",lw:1,seed:741});
  wc_part(ctx,[[1074,top+58],[1106,top+58],[1111,top+6],[1069,top+6]],[246,244,238],1,{kind:"thing",lw:1.2,seed:736});wc_part(ctx,wc_rect(1067,top-4,46,12),[60,50,46],1,{kind:"thing",lw:1,seed:737});
  wc_flat(ctx,wc_rect(1070,top+20,40,18),[150,110,80],1,"sleeve");gv_mug(ctx,1700,top+62,[70,130,160]);gv_mug(ctx,1338,top+20,[214,120,70],true);
  wc_part(ctx,[[1810,top+24],[1900,top+24],[1912,top+70],[1800,top+70]],[250,232,120],1,{kind:"thing",lw:1,seed:742});
  ctx.save();ctx.strokeStyle="rgba(80,80,80,0.4)";ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(1814,top+36+i*11);ctx.lineTo(1890,top+36+i*11);ctx.stroke();}
  ctx.strokeStyle="rgb(30,40,90)";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(1790,top+78);ctx.lineTo(1880,top+60);ctx.stroke();ctx.restore();
  for(const [gx,gy] of [[1240,top+64],[1530,top+70]]){ctx.save();ctx.fillStyle="rgba(206,228,236,0.4)";ctx.fillRect(gx-15,gy-56,30,56);ctx.strokeStyle="rgba(255,255,255,0.85)";ctx.lineWidth=2;
    ctx.strokeRect(gx-15,gy-56,30,56);ctx.fillStyle="rgba(255,255,255,0.45)";ctx.fillRect(gx-11,gy-50,5,46);ctx.restore();}}
// someone seated behind a table whose far edge is at cutY, sitting up: as gv_behind, a little higher
function sp_seated(ctx,id,x,cutY,s,o){ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,cutY+H);ctx.clip();person(ctx,id,x,cutY+268*s,s,o);ctx.restore();}
// a tab standing up out of a book's pages, with its word: what that edition added. The book's bottom's middle at (x, y), as sp_book;
// lit gold as lit goes 0 to 1. Drawn before the book, which hides its foot. deco: its word only decoration (the camera cuts it).
function sp_bookTab(ctx,x,y,label,lit,dx,deco){const K=SP_SH,top=y-K.h-8,w=Math.round(tw(ctx,label,34,700)+40),h=86,tx=x+(dx||40);
  ctx.save();ctx.fillStyle="rgba(40,24,12,0.25)";ctx.fillRect(tx+6,top-h+30,w,h);ctx.restore();
  wc_part(ctx,wc_rrPts(tx,top-h+24,w,h,8),mix([248,246,238],GV.gold,0.75*lit),1,{kind:"thing",lw:1.2,seed:label.length+880});
  if(lit>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,tx+w/2,top-h/2+24,w*0.9,[255,214,120],0.5*lit);ctx.restore();}
  wc_T(ctx,label,tx+w/2,top-h+70,{w:700,size:34,align:"center",col:mix(WC_DARK,GV.goldInk,lit),deco:!!deco});}

/* ---------- 2018: an office's front desk in Europe ---------- */
// The front desk: a tall window onto an old street on the left, where the customer stands; the counter across the rest, its oak front
// and pale top, and behind it the office's privacy lead (standing, cut at the counter's top), a print, a clock, a shelf of binders. The
// counter is a layer of its own (front18desk), over her. SP_FD: the wall's foot, the window, the counter's left end, top and front
// edge, the print, the clock, the shelf, the customer [x, foot, scale], the privacy lead [x, foot, scale].
const SP_FD={fy:820,win:[64,70,500,650],desk:[790,694,716],print:[880,170,300,220],clock:[1290,230],shelf:[1440,170,430,400],cust:[640,1046,0.97],priv:[1140,986,0.95]};
const SP_WALL18=[220,222,226];
// poses, standing: a sheet held out, at shoulder height; read, held in both hands at the chest
Object.assign(POSE,{
  spOffer:{L:[0.13,-0.1],R:[0.9,1.75],feet:28,shift:4,tilt:-0.03,turn:0.22,gaze:[0.6,0.1],look:0},
  spReadStand:{L:[0.16,-2.05],R:[0.2,-2.4],feet:26,shift:2,tilt:0.04,turn:0.08,gaze:[0.3,0.8],look:1},
  spReadNod:{L:[0.16,-2.05],R:[0.2,-2.4],feet:26,shift:2,tilt:-0.05,turn:0.08,gaze:[0.3,1],look:2.6}
});
// an old street through the window by day: the houses opposite, pastel, with tall windows, shutters and iron balconies, cornices at
// each floor and dormers in the roof; a shop with a striped awning or a doorway at street level; the tram's wire, a lamp post, a bicycle
function sp_streetEU(ctx,x,y,w,h,seed){const R=wc_rng(seed),gy=y+h-70;ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  const g=ctx.createLinearGradient(0,y,0,y+120);g.addColorStop(0,"rgb(184,210,230)");g.addColorStop(1,"rgb(226,234,238)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  const cols=[[230,200,146],[218,176,164],[200,210,180],[236,226,206]],hw=[200,180,210];let X=x-40,i=0;
  while(X<x+w){const bw=hw[i%3],c=cols[(i+seed)%4],top=y+40+R()*40;
    wc_part(ctx,wc_rect(X,top,bw,gy-top+20),c,0.9,{lw:1,seed:seed+i});
    wc_part(ctx,[[X-6,top],[X+bw+6,top],[X+bw-10,top-34],[X+10,top-34]],[120,104,104],0.9,{lw:1,seed:seed+40+i});
    wc_part(ctx,wc_rect(X+bw/2-22,top-58,44,40),c,0.9,{lw:1,seed:seed+50+i});wc_flat(ctx,wc_rect(X+bw/2-12,top-48,24,28),[90,96,110],0.9,"pane");
    const fl=4,fh=(gy-110-top)/fl;for(let f=0;f<fl;f++){const fy=top+14+f*fh;ctx.fillStyle=rgba(wc_dim(c,0.18),0.8);ctx.fillRect(X,fy+fh-6,bw,5);
      for(let k=0;k<2;k++){const wx=X+bw*(0.2+k*0.42),ww=bw*0.2,wh=fh*0.62,wy=fy+fh*0.18;wc_flat(ctx,wc_rect(wx,wy,ww,wh),[98,108,124],0.9,"pane");
        ctx.fillStyle="rgba(255,255,255,0.22)";ctx.fillRect(wx+3,wy+3,ww*0.35,wh-6);ctx.strokeStyle=rgba([246,242,232],0.9);ctx.lineWidth=2.5;ctx.strokeRect(wx,wy,ww,wh);
        ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh);ctx.stroke();
        if((i+f+k)%3===0){const sc=[96,124,108];wc_flat(ctx,wc_rect(wx-ww*0.42,wy,ww*0.4,wh),sc,0.9,"shutter");wc_flat(ctx,wc_rect(wx+ww*1.02,wy,ww*0.4,wh),sc,0.9,"shutter");}
        if(f===1||f===2){ctx.strokeStyle="rgba(40,40,46,0.85)";ctx.lineWidth=2;const by=wy+wh;ctx.beginPath();ctx.moveTo(wx-10,by);ctx.lineTo(wx+ww+10,by);ctx.moveTo(wx-10,by-26);ctx.lineTo(wx+ww+10,by-26);
          for(let b=wx-10;b<=wx+ww+10;b+=8){ctx.moveTo(b,by);ctx.lineTo(b,by-26);}ctx.stroke();}}}
    const sy=gy-100;if(i%2===0){wc_flat(ctx,wc_rect(X+16,sy+20,bw-32,80),[70,80,92],0.9,"shop");ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,X+bw/2,sy+60,90,[255,226,170],0.35);ctx.restore();
      const aw=[[X+8,sy+4],[X+bw-8,sy+4],[X+bw+4,sy+34],[X-4,sy+34]];wc_part(ctx,aw,[190,80,70],0.9,{lw:1,seed:seed+60+i});ctx.save();wc_tr(ctx,aw);ctx.clip();ctx.fillStyle="rgba(255,250,240,0.7)";
      for(let sx=X;sx<X+bw;sx+=28)ctx.fillRect(sx,sy,14,40);ctx.restore();}
    else wc_flat(ctx,wc_arched(X+bw/2-30,sy+10,60,90),[96,70,60],0.9,"door");
    X+=bw;i++;}
  wc_flat(ctx,wc_rect(x,gy,w,26),[196,190,182],1,"pavement");wc_flat(ctx,wc_rect(x,gy+26,w,50),[150,148,150],1,"street");
  ctx.save();ctx.strokeStyle="rgba(200,196,186,0.8)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,gy+44);ctx.lineTo(x+w,gy+44);ctx.moveTo(x,gy+60);ctx.lineTo(x+w,gy+60);ctx.stroke();
  ctx.strokeStyle="rgba(40,40,46,0.7)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+176);ctx.quadraticCurveTo(x+w/2,y+190,x+w,y+170);ctx.stroke();ctx.restore();
  const lx=x+w*0.72;wc_part(ctx,wc_rect(lx-5,gy-250,10,252),[44,48,52],1,{kind:"iron",lw:1});wc_part(ctx,[[lx-20,gy-250],[lx+20,gy-250],[lx+12,gy-284],[lx-12,gy-284]],[44,48,52],1,{kind:"iron",lw:1});
  const bx=x+w*0.32,by=gy+18;ctx.save();ctx.strokeStyle="rgba(40,46,56,0.9)";ctx.lineWidth=3;for(const wx2 of [bx-34,bx+34]){ctx.beginPath();ctx.arc(wx2,by,24,0,TAU);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(bx-34,by);ctx.lineTo(bx-6,by-34);ctx.lineTo(bx+24,by-34);ctx.lineTo(bx+34,by);ctx.moveTo(bx-6,by-34);ctx.lineTo(bx,by);ctx.lineTo(bx+24,by-34);
  ctx.moveTo(bx-10,by-44);ctx.lineTo(bx-2,by-44);ctx.moveTo(bx+24,by-34);ctx.lineTo(bx+28,by-48);ctx.stroke();ctx.restore();ctx.restore();}
// the room: the wall and the floor, the window and its light, the print, the clock, the shelf of binders, the light from the ceiling
function sp_paintFront18(ctx){const K=SP_FD,[wx,wy,ww,wh]=K.win,[px,py,pw,ph]=K.print,[sx,sy,sw]=K.shelf;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,K.fy+40),SP_WALL18,{kind:"plaster",line:false,seed:801});
  wc_wash(ctx,wc_rect(-40,K.fy,W+80,H-K.fy+40),[180,152,120],{kind:"ground",line:false,seed:802});
  ctx.save();ctx.strokeStyle="rgba(110,80,50,0.18)";ctx.lineWidth=2;for(let xx=-400;xx<W+400;xx+=90){ctx.beginPath();ctx.moveTo(xx,K.fy);ctx.lineTo(xx+(xx-960)*0.9,H);ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_rect(-40,K.fy-14,W+80,16),wc_dim(SP_WALL18,0.28),{kind:"trim",line:false,flat:true});
  sp_streetEU(ctx,wx,wy,ww,wh,811);
  for(const r of [wc_rect(wx-16,wy-16,ww+32,16),wc_rect(wx-16,wy-16,16,wh+32),wc_rect(wx+ww,wy-16,16,wh+32),wc_rect(wx+ww/2-6,wy,12,wh),wc_rect(wx,wy+170,ww,12)])wc_part(ctx,r,[238,236,230],1,{lw:1.1});
  wc_part(ctx,wc_rect(wx-30,wy+wh,ww+60,18),[240,238,232],1,{lw:1.2});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww/2,wy+wh/2,520,[255,252,240],0.2);wc_glowAt(ctx,wx+ww+200,K.fy+120,500,[255,246,224],0.25);wc_glowAt(ctx,wx+ww+260,360,520,[255,248,232],0.22);ctx.restore();
  ctx.save();ctx.filter="blur(6px)";ctx.fillStyle="rgba(60,60,70,0.2)";ctx.fillRect(px+8,py+10,pw,ph);ctx.restore();wc_part(ctx,wc_rect(px-12,py-12,pw+24,ph+24),[60,62,70],1,{kind:"thing",lw:1,seed:812});
  wc_flat(ctx,wc_rect(px,py,pw,ph),[250,248,240],1,"mount");ctx.save();ctx.beginPath();ctx.rect(px+30,py+30,pw-60,ph-60);ctx.clip();wc_flat(ctx,wc_rect(px+30,py+30,pw-60,ph-60),[224,232,236],1,"sky");
  wc_wash(ctx,[[px,py+ph-70],[px+80,py+110],[px+160,py+140],[px+240,py+96],[px+pw,py+130],[px+pw,py+ph],[px,py+ph]],[150,176,150],{kind:"field",line:false,seed:813});
  wc_wash(ctx,[[px,py+ph-40],[px+120,py+150],[px+pw,py+170],[px+pw,py+ph],[px,py+ph]],[110,146,120],{kind:"field",line:false,seed:814});ctx.restore();
  const [cx,cy]=K.clock;ctx.save();ctx.fillStyle="rgba(60,60,70,0.2)";ctx.beginPath();ctx.arc(cx+5,cy+7,62,0,TAU);ctx.fill();ctx.restore();wc_part(ctx,wc_ell(cx,cy,60,60,40),[52,54,60],1,{kind:"thing",lw:1,seed:815});
  wc_flat(ctx,wc_ell(cx,cy,50,50,40),[250,248,242],1,"face");ctx.save();ctx.strokeStyle="rgb(40,40,46)";ctx.lineCap="round";for(let k=0;k<12;k++){const a=k/12*TAU;ctx.lineWidth=k%3===0?4:2;ctx.beginPath();
    ctx.moveTo(cx+Math.cos(a)*40,cy+Math.sin(a)*40);ctx.lineTo(cx+Math.cos(a)*46,cy+Math.sin(a)*46);ctx.stroke();}
  ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+20,cy-14);ctx.stroke();ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx-6,cy-38);ctx.stroke();ctx.restore();
  const bc=[[58,82,118],[160,62,66],[70,112,92],[204,170,92],[92,112,124],[120,92,140]];
  for(const [yy,n] of [[sy+150,7],[sy+330,7]]){wc_part(ctx,wc_rect(sx,yy,sw,16),[196,170,136],1,{lw:1,seed:816+yy});let bx=sx+18;
    for(let k=0;k<n;k++){const bw=48+(k%3)*6,bh=130-(k%2)*10;gv_binder(ctx,bx,yy-bh,bw,bh,bc[(k+(yy>400?2:0))%bc.length]);bx+=bw+4;}}
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1300,-60,700,[255,246,226],0.28);ctx.restore();}
// the counter, over her: its pale top, its front of oak slats; on it the register, a pen pot, a monitor with its back to us, a plant
function sp_paintFront18Desk(ctx){const [x0,top,fr]=SP_FD.desk,wood=[206,170,126];
  wc_contact(ctx,x0-20,W+40,H+10,1,0.3);
  wc_part(ctx,wc_rect(x0,fr,W+40-x0,H-fr+40),wood,1,{lw:1.2,seed:821});ctx.save();ctx.strokeStyle="rgba(110,70,36,0.26)";ctx.lineWidth=2;for(let xx=x0+40;xx<W;xx+=44){ctx.beginPath();ctx.moveTo(xx,fr+8);ctx.lineTo(xx,H);ctx.stroke();}
  ctx.strokeStyle="rgba(255,236,200,0.18)";ctx.lineWidth=4;for(let xx=x0+60;xx<W;xx+=44){ctx.beginPath();ctx.moveTo(xx,fr+8);ctx.lineTo(xx,H);ctx.stroke();}ctx.restore();
  ctx.save();const g=ctx.createLinearGradient(0,fr,0,fr+60);g.addColorStop(0,"rgba(60,36,16,0.3)");g.addColorStop(1,"rgba(60,36,16,0)");ctx.fillStyle=g;ctx.fillRect(x0,fr,W-x0,60);
  const g2=ctx.createLinearGradient(x0,0,x0+500,0);g2.addColorStop(0,"rgba(255,246,226,0.22)");g2.addColorStop(1,"rgba(255,246,226,0)");ctx.fillStyle=g2;ctx.fillRect(x0,fr,500,H-fr);ctx.restore();
  wc_part(ctx,[[x0+14,top],[W+40,top],[W+40,fr+8],[x0,fr+8]],[236,232,224],1,{lw:1.2,seed:822});ctx.save();ctx.fillStyle="rgba(255,255,255,0.6)";ctx.fillRect(x0,fr+6,W-x0,3);ctx.restore();
  wc_part(ctx,[[1700,top+6],[1770,top+6],[1758,top-36],[1712,top-36]],[110,114,122],1,{kind:"thing",lw:1,seed:823});wc_part(ctx,wc_rrPts(1630,top-196,210,160,10),[120,124,134],1,{kind:"thing",lw:1.2,seed:824});
  ctx.save();ctx.fillStyle="rgba(255,255,255,0.12)";ctx.fillRect(1640,top-186,190,4);ctx.restore();
  wc_part(ctx,[[1520,top+10],[1560,top+10],[1564,top-40],[1516,top-40]],[70,110,130],1,{kind:"thing",lw:1,seed:825});
  ctx.save();ctx.strokeStyle="rgb(40,40,50)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(1530,top-40);ctx.lineTo(1524,top-74);ctx.moveTo(1546,top-40);ctx.lineTo(1554,top-70);ctx.stroke();ctx.restore();
  wc_part(ctx,[[1860,top+10],[1910,top+10],[1918,top-40],[1852,top-40]],[204,120,90],1,{kind:"thing",lw:1,seed:826});
  for(let k=0;k<7;k++){const a=-Math.PI/2+(k-3)*0.32;wc_wash(ctx,[[1885,top-40],[1885+Math.cos(a-0.12)*70,top-40+Math.sin(a-0.12)*70],[1885+Math.cos(a)*96,top-40+Math.sin(a)*96],
    [1885+Math.cos(a+0.12)*70,top-40+Math.sin(a+0.12)*70]],[90,140,90],{kind:"leaf",lw:1,seed:827+k});}
  wc_part(ctx,[[1256,top+4],[1460,top+4],[1448,top-30],[1268,top-30]],[58,82,118],1,{kind:"cover",lw:1.2,seed:828});wc_flat(ctx,[[1262,top-6],[1454,top-6],[1450,top-14],[1266,top-14]],[244,240,228],1,"pages");}
// someone standing behind a counter, cut at its top (cutY), their feet at foot
function sp_behindAt(ctx,id,x,cutY,foot,s,o){ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,cutY+H);ctx.clip();person(ctx,id,x,foot,s,o);ctx.restore();}
// a sheet of paper folded once, held in one hand at its corner: its middle at (x, y), turned rot; the thumbs of whoever holds it (hold,
// a list of [x, y, skin]); lines of writing show through it faintly
function sp_sheetHeld(ctx,x,y,rot,s,hold){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.fillStyle="rgba(60,50,40,0.22)";ctx.fillRect(-46,-58,100,128);
  ctx.fillStyle="#fbfaf5";ctx.fillRect(-50,-64,100,128);ctx.strokeStyle="rgba(58,54,66,0.7)";ctx.lineWidth=2;ctx.strokeRect(-50,-64,100,128);
  ctx.strokeStyle="rgba(120,110,100,0.35)";ctx.beginPath();ctx.moveTo(-50,0);ctx.lineTo(50,0);ctx.stroke();ctx.strokeStyle="rgba(40,50,110,0.28)";ctx.lineWidth=2;
  for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-36,-44+k*12);ctx.lineTo(30-k*6,-44+k*12);ctx.stroke();}ctx.restore();
  for(const [hx,hy,skin] of hold){ctx.save();ctx.translate(hx,hy);ctx.scale(s,s);ell(ctx,0,0,12,15);litFill(ctx,skin,-12,-15,12,15);seam(ctx,skin,0.3,1.2);ctx.restore();}}
// the sheet held at the chest in both hands, its back to us (in the figure's units)
function sp_sheetBack(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-10);cx.rotate(0.03);
  cx.fillStyle="rgba(60,50,40,0.22)";cx.fillRect(-58,-74,124,160);cx.fillStyle="#fbfaf5";cx.fillRect(-62,-80,124,160);cx.strokeStyle="rgba(58,54,66,0.7)";cx.lineWidth=2;cx.strokeRect(-62,-80,124,160);
  cx.strokeStyle="rgba(120,110,100,0.3)";cx.beginPath();cx.moveTo(-62,0);cx.lineTo(62,0);cx.stroke();cx.restore();fingers(cx,P_,[[mx-60,my+4],[mx+60,my]]);}

// The counter from above: the customer's letter, open; the office's register, its record of processing open at its page; the reply.
// SP_DK: the letter [x, y, w, h, rot], the register's page (x, y, width), the reply [x, y, w, h]; SP_ROP: the page's title, its
// columns and rows
const SP_DK={letter:[70,104,560,740,-0.03],reg:[880,150,980],reply:[66,150,700,700]};
const SP_ROP={title:"Record of processing",cols:[["what data",0.34],["why",0.38],["who answers",0.28]],
  rows:[["name, address","to deliver orders","orders team"],["email","to send receipts","orders team"],["card details","to take payment","finance"],
    ["purchases","to suggest products","marketing"],["CVs","to hire staff","people team"],["payroll","to pay staff","finance"]]};
// the counter's top: pale stone, flecked, the window's light from the top left; the register's boards and spine under its page, and the
// edges of its pages; a pen
function sp_paintDesk18(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[232,228,220],{kind:"plaster",line:false,seed:851});
  const R=wc_rng(852);ctx.save();for(let i=0;i<900;i++){ctx.fillStyle="rgba("+(R()<0.5?"120,110,100":"255,255,255")+","+(0.08+R()*0.12).toFixed(3)+")";ctx.fillRect(R()*W,R()*H,1.5+R()*2.5,1.5+R()*2.5);}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,-100,-100,1500,[255,250,236],0.35);ctx.restore();
  const [rx,ry,rw]=SP_DK.reg,rh=gv_registerH({rows:SP_ROP.rows})*rw/1000;
  ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(50,40,30,0.3)";ctx.fillRect(rx-40,ry-8,rw+70,rh+44);ctx.restore();
  wc_wash(ctx,wc_rrPts(rx-46,ry-22,rw+72,rh+44,10),[58,82,118],{kind:"cover",lw:1.4,seed:853});wc_flat(ctx,wc_rect(rx-46,ry-22,34,rh+44),[40,58,88],1,"spine");
  for(let i=3;i>0;i--)wc_flat(ctx,wc_rect(rx+i*3,ry+i*3,rw,rh),[240-i*8,236-i*8,226-i*8],1,"pages");
  ctx.save();ctx.translate(1700,940);ctx.rotate(-0.5);ctx.fillStyle="rgba(40,30,20,0.25)";ctx.fillRect(-90,6,190,10);wc_part(ctx,wc_rrPts(-100,-6,200,14,6),[30,40,90],1,{kind:"thing",lw:1,seed:854});
  ctx.fillStyle="rgb(200,200,206)";ctx.fillRect(84,-6,16,14);ctx.restore();}
// the letter, open: its folds, the question in the customer's hand, a greeting and a name scribbled; a, how clearly its words show (as
// the reply covers it)
function sp_letterOpen(ctx,a){a=a==null?1:a;const [x,y,w,h,rot]=SP_DK.letter,ink=[34,44,92];ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.drawImage(gv_sheetPaper(w,h),-w/2-20,-h/2-20);
  ctx.strokeStyle="rgba(120,110,100,0.22)";ctx.lineWidth=2;for(const f of [1/3,2/3]){ctx.beginPath();ctx.moveTo(-w/2,-h/2+h*f);ctx.lineTo(w/2,-h/2+h*f);ctx.stroke();}
  ctx.translate(-w/2,-h/2);sp_scribble(ctx,60,96,170,1,861,false);if(a>0){wc_hand(ctx,"What do you hold",60,236,{size:56,col:ink,w:700,a});wc_hand(ctx,"about me?",60,316,{size:56,col:ink,w:700,a});}
  sp_scribble(ctx,60,420,380,1,862,false);sp_scribble(ctx,60,466,300,1,863,false);sp_scribble(ctx,w-260,620,180,1,864,true);ctx.restore();}
// the customer's rows lit plum, the colour of personal data in the series, one after another as u goes 0 to 1 (r: the register's rows)
function sp_ropLight(ctx,r,u){if(u<=0)return;const k=SP_DK.reg[2]/1000;ctx.save();ctx.globalCompositeOperation="multiply";
  for(let i=0;i<4;i++){const a=clamp(u*4-i,0,1);if(a<=0)continue;ctx.fillStyle=rgba(wc_lit(GV_CLASS.direct,0.74),easeCam(a));wc_tr(ctx,wc_rrPts(SP_DK.reg[0]+40*k,r.rows[i]-29*k,920*k*easeCam(a),58*k,8));ctx.fill();}
  ctx.restore();}
// the reply: slid in from below as d goes 0 to 1, its heading and rule; each of the customer's rows written onto it, what data and why,
// as qs[i] goes 0 to 1, while that row of the register (r) is ringed in plum; the stamp, "answered", landing as st goes 0 to 1
function sp_reply(ctx,r,d,qs,st){if(d<=0)return;const [x,y,w,h]=SP_DK.reply,dy=(1-easeCam(d))*900,k=SP_DK.reg[2]/1000;
  ctx.save();ctx.lineWidth=4;for(let i=0;i<4;i++){const b=Math.sin(Math.PI*clamp(qs[i],0,1));if(b<=0.01)continue;ctx.strokeStyle=rgba(GV_CLASS.direct,0.85*b);
    wc_tr(ctx,wc_rrPts(SP_DK.reg[0]+40*k,r.rows[i]-29*k,920*k,58*k,8));ctx.stroke();}ctx.restore();
  ctx.save();ctx.translate(0,dy);ctx.translate(x+w/2,y+h/2);ctx.rotate(0.05*(1-easeCam(d)));ctx.translate(-x-w/2,-y-h/2);ctx.drawImage(gv_sheetPaper(w,h),x-20,y-20);
  wc_T(ctx,"What we hold about you",x+50,y+96,{w:800,size:40,col:WC_DARK});ctx.fillStyle=rgba(WC_MUTED,0.45);ctx.fillRect(x+50,y+130,w-100,2);
  for(let i=0;i<4;i++){const e=easeCam(clamp(qs[i],0,1));if(e<=0)continue;for(let c=0;c<2;c++)wc_T(ctx,SP_ROP.rows[i][c],x+50+c*250,y+200+i*64+(1-e)*14,{w:600,size:30,col:WC_DARK,a:e});}
  ctx.restore();if(st>0)gv_stamp(ctx,x+500,y+610+dy,"answered",st,{size:40,col:GV.greenInk,rot:-0.06});}
// the register's cover, closed over its page with its name on its label, then swinging open from the spine as open goes 0 to 1, its
// name going with it (and fading, read only while it's closed)
function sp_regCover(ctx,open){if(open>=1)return;const [rx,ry,rw]=SP_DK.reg,rh=gv_registerH({rows:SP_ROP.rows})*rw/1000,x0=rx-46,y0=ry-22,w=rw+72,h=rh+44,col=[58,82,118],
    img=wc_kept("spRegCover",w+40,h+40,q=>{q.translate(20,20);wc_wash(q,wc_rrPts(0,0,w,h,10),col,{kind:"cover",lw:1.4,seed:857});const dk=wc_dim(col,0.35),cc=w*0.08;
      wc_flat(q,wc_rect(0,0,34,h),dk,1,"spine");wc_flat(q,[[w-cc,0],[w,0],[w,cc]],dk,1,"corner");wc_flat(q,[[w,h-cc],[w,h],[w-cc,h]],dk,1,"corner");
      wc_flat(q,wc_rect(w*0.2,h*0.3,w*0.64,150),WC_CARD,1,"label");}),e=easeCam(clamp(open,0,1)),sc=Math.cos(e*Math.PI/2);
  if(sc<0.02)return;ctx.save();ctx.translate(x0,0);ctx.scale(sc,1);ctx.drawImage(img,-20,y0-20);
  const la=clamp(1-e,0,1);if(la>0)wc_T(ctx,SP_ROP.title,w*0.52,y0+h*0.3+94,{w:800,size:50,align:"center",col:WC_DARK,a:la,deco:e>0});
  if(e>0){ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([150,150,170],0.6*e);ctx.fillRect(0,y0,w,h);}ctx.restore();}

/* ---------- 2024: a team training a model, the revised book, Europe's AI law, and the third edition's draft ---------- */
// The training table from above: on the left, a box of examples, "training data", photos of cats and dogs with their labels written on
// their white borders; on the right, the model, drawn as a notebook that copies what each example shows it. SP_TD: the box's front face
// [x, y, w, h] and how deep its open top looks; the notebook open [x, y, w, h]; a photo's size.
const SP_TD={box:[150,520,560,250],depth:250,book:[920,150,900,720],ph:[150,184]};
// the examples, in the order they're shown to the model: what the photo shows, and its label (the fifth's is wrong, and red)
const SP_EX=[["cat","cat"],["dog","dog"],["dog","dog"],["cat","cat"],["dog","cat"],["cat","cat"],["dog","dog"]];
// a cat's or a dog's face in a few pencil lines over a wash, its middle at (x, y), about 100 px across at s 1
function sp_pet(ctx,kind,x,y,s,ink,wash){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.lineCap="round";ctx.lineJoin="round";
  if(wash){ctx.fillStyle=rgba(wash,0.6);ctx.beginPath();if(kind==="cat"){ctx.moveTo(-36,-12);ctx.lineTo(-30,-46);ctx.lineTo(-10,-30);ctx.lineTo(10,-30);ctx.lineTo(30,-46);ctx.lineTo(36,-12);
      ctx.bezierCurveTo(44,26,22,40,0,40);ctx.bezierCurveTo(-22,40,-44,26,-36,-12);}else ctx.ellipse(0,4,36,34,0,0,TAU);ctx.fill();}
  ctx.strokeStyle=rgba(ink,0.92);ctx.fillStyle=rgba(ink,0.92);ctx.lineWidth=3.4;
  if(kind==="cat"){ctx.beginPath();ctx.moveTo(-36,-12);ctx.lineTo(-30,-46);ctx.lineTo(-10,-30);ctx.quadraticCurveTo(0,-33,10,-30);ctx.lineTo(30,-46);ctx.lineTo(36,-12);
      ctx.bezierCurveTo(44,26,22,40,0,40);ctx.bezierCurveTo(-22,40,-44,26,-36,-12);ctx.stroke();
    ctx.lineWidth=2.2;for(const k of [-1,1]){ctx.beginPath();ctx.moveTo(k*12,14);ctx.lineTo(k*48,8);ctx.moveTo(k*12,19);ctx.lineTo(k*48,22);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(-6,9);ctx.lineTo(6,9);ctx.lineTo(0,16);ctx.closePath();ctx.fill();ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(0,16);ctx.quadraticCurveTo(-5,24,-11,21);ctx.moveTo(0,16);ctx.quadraticCurveTo(5,24,11,21);ctx.stroke();}
  else{ctx.beginPath();ctx.ellipse(0,4,36,34,0,0,TAU);ctx.stroke();
    for(const k of [-1,1]){ctx.save();ctx.translate(k*36,2);ctx.rotate(k*0.3);ctx.beginPath();ctx.ellipse(0,10,11,26,0,0,TAU);ctx.fillStyle=rgba(ink,0.8);ctx.fill();ctx.restore();}
    ctx.beginPath();ctx.ellipse(0,13,9,6.5,0,0,TAU);ctx.fill();ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(0,19);ctx.lineTo(0,25);ctx.moveTo(-9,27);ctx.quadraticCurveTo(0,33,9,27);ctx.stroke();}
  for(const k of [-1,1]){ctx.beginPath();ctx.arc(k*14,-4,4.2,0,TAU);ctx.fill();}ctx.restore();}
// a photo from the box, its middle at (x, y), turned rot, scaled s: a white border, the animal on a pale ground, its label written on the
// border below, in red when it's wrong (o.deco: while it flies)
function sp_photo(ctx,x,y,rot,s,ex,a,deco){if(a<=0.01)return;const [kind,label]=ex,[w,h]=SP_TD.ph,bad=kind!==label;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);
  withA(ctx,a,()=>{ctx.fillStyle="rgba(50,40,30,0.22)";ctx.fillRect(-w/2+6,-h/2+9,w,h);ctx.fillStyle="#fbfaf6";ctx.fillRect(-w/2,-h/2,w,h);
    ctx.strokeStyle=rgba(bad?GV.red:[110,104,100],bad?0.95:0.5);ctx.lineWidth=bad?4:1.5;ctx.strokeRect(-w/2,-h/2,w,h);
    ctx.fillStyle=rgba(kind==="cat"?[212,224,236]:[222,232,206],1);ctx.fillRect(-w/2+10,-h/2+10,w-20,w-20);
    sp_pet(ctx,kind,0,-h/2+10+(w-20)/2+6,1.1,[64,54,50],kind==="cat"?[228,164,100]:[178,134,96]);
    wc_T(ctx,label,0,h/2-12,{w:700,size:28,align:"center",col:bad?GV.redInk:WC_DARK,deco});});ctx.restore();}
// where example i lands on the pile beside the notebook: [x, y, turn]
const sp_pile=i=>[815+((i*37)%5-2)*9,330+((i*53)%5-2)*8,((i*29)%7-3)*0.04];
// where the notebook copies example i: the left page first, two to a row, then the right
function sp_slot(i){const [bx,by,bw]=SP_TD.book,pw=bw/2,pg=i<6?0:1,j=i%6,c=j%2,r=Math.floor(j/2);return[bx+pg*pw+pw*(c?0.7:0.3),by+250+r*170];}
// the notebook's copy of example i, as a goes 0 to 1: the animal drawn in pencil from left to right, then its label written under it; the
// wrong one in red
function sp_copy(ctx,i,a){if(a<=0.01)return;const [kind,label]=SP_EX[i],[sx,sy]=sp_slot(i),bad=kind!==label,ink=bad?GV.redInk:[70,66,78],u=clamp(a/0.6,0,1);
  ctx.save();ctx.beginPath();ctx.rect(sx-70,sy-90,140*u,150);ctx.clip();sp_pet(ctx,kind,sx,sy-14,0.9,ink,null);ctx.restore();
  wc_hand(ctx,label,sx-24,sy+72,{size:36,col:ink,w:700,p:clamp((a-0.45)/0.55,0,1)});}
// the box from above and in front: its open top, the photos standing in it in rows, its front with its label
function sp_boxTop(ctx){const [x,y,w,h]=SP_TD.box,d=SP_TD.depth,kr=[196,158,112],R=wc_rng(921);
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(60,40,20,0.35)";ctx.fillRect(x-6,y-d+30,w+40,d+h);ctx.restore();
  wc_wash(ctx,[[x+34,y-d],[x+w-34,y-d],[x+w,y],[x,y]],wc_dim(kr,0.42),{kind:"thing",lw:1.4,seed:922});
  wc_wash(ctx,[[x+34,y-d],[x+w-34,y-d],[x+w-40,y-d+26],[x+40,y-d+26]],wc_dim(kr,0.15),{kind:"thing",line:false,seed:923});
  for(let r=0;r<5;r++){const yy=y-d+52+r*44,inset=34*(1-(yy-(y-d))/d);for(let i=0;i<4;i++){const cx=x+inset+40+i*((w-2*inset-80)/3)+(R()-0.5)*30,ph=SP_EX[(r*4+i)%SP_EX.length];
    ctx.save();ctx.translate(cx,yy);ctx.rotate((R()-0.5)*0.12);ctx.fillStyle="rgba(40,30,20,0.25)";ctx.fillRect(-58,-4,120,10);ctx.fillStyle="#f6f4ee";ctx.fillRect(-60,-30,120,40);
      ctx.fillStyle=rgba(ph[0]==="cat"?[212,224,236]:[222,232,206],1);ctx.fillRect(-52,-24,104,34);ctx.strokeStyle="rgba(110,104,100,0.5)";ctx.lineWidth=1.2;ctx.strokeRect(-60,-30,120,40);ctx.restore();}}
  wc_wash(ctx,wc_rect(x,y,w,h),kr,{kind:"cover",lw:1.5,seed:924});wc_flat(ctx,wc_rect(x,y,w,16),lighten(kr,0.12),1,"rim");
  wc_flat(ctx,wc_rect(x+w/2-170,y+70,340,110),[248,246,238],1,"label");wc_T(ctx,"training data",x+w/2,y+142,{w:700,size:44,align:"center",col:WC_DARK});
  ctx.save();ctx.fillStyle="rgba(40,28,16,0.5)";rr(ctx,x+w/2-50,y+204,100,22,11);ctx.fill();ctx.restore();}
// the notebook open from above: two pages, the gutter, the edges of the pages under them, its ribbon's tail; "model" written at the top left
function sp_notebook(ctx){const [x,y,w,h]=SP_TD.book,pw=w/2;
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(60,40,20,0.3)";ctx.fillRect(x+10,y+24,w,h);ctx.restore();
  wc_wash(ctx,wc_rrPts(x-14,y-10,w+28,h+24,10),[64,74,96],{kind:"cover",lw:1.4,seed:931});
  for(let i=3;i>0;i--){wc_flat(ctx,wc_rect(x-i*3,y+i*2,pw,h),[236-i*6,232-i*6,222-i*6],1,"pages");wc_flat(ctx,wc_rect(x+pw+i*3,y+i*2,pw,h),[236-i*6,232-i*6,222-i*6],1,"pages");}
  ctx.drawImage(gv_sheetPaper(pw,h),x-20,y-20);ctx.drawImage(gv_sheetPaper(pw,h),x+pw-20,y-20);
  const g=ctx.createLinearGradient(x+pw-60,0,x+pw+60,0);g.addColorStop(0,"rgba(90,70,50,0)");g.addColorStop(0.5,"rgba(90,70,50,0.3)");g.addColorStop(1,"rgba(90,70,50,0)");ctx.fillStyle=g;ctx.fillRect(x+pw-60,y,120,h);
  ctx.save();ctx.strokeStyle="rgba(120,150,190,0.22)";ctx.lineWidth=1.5;for(let ly=y+150;ly<y+h-20;ly+=42){for(const px of [x+30,x+pw+30]){ctx.beginPath();ctx.moveTo(px,ly);ctx.lineTo(px+pw-60,ly);ctx.stroke();}}ctx.restore();
  wc_flat(ctx,[[x+pw-8,y+h-20],[x+pw+12,y+h-20],[x+pw+44,y+h+76],[x+pw+28,y+h+64],[x+pw+20,y+h+84]],[150,52,60],1,"ribbon");
  wc_hand(ctx,"model",x+60,y+100,{size:56,col:[40,48,92],w:700});ctx.fillStyle="rgba(40,48,92,0.8)";ctx.fillRect(x+60,y+118,160,4);}
// the training table, from above: pale oak, its grain, the light from the top; the box, the notebook, a laptop's keyboard, a pencil, a cup
function sp_paintDesk24(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[226,206,172],{kind:"ground",line:false,seed:911});
  const R=wc_rng(912);ctx.save();ctx.strokeStyle="rgba(150,110,70,0.16)";ctx.lineWidth=2;for(let i=0;i<34;i++){const y0=R()*H;ctx.beginPath();ctx.moveTo(-20,y0);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y0+10*Math.sin(x/260+i)+R()*3);ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,700,-120,1300,[255,248,232],0.35);ctx.restore();
  // a laptop's keyboard at the top edge, its screen folded up out of sight
  ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(40,30,20,0.3)";ctx.fillRect(330,-40,520,150);ctx.restore();wc_wash(ctx,wc_rrPts(320,-60,520,160,14),[188,192,200],{kind:"thing",lw:1.3,seed:913});
  ctx.fillStyle="rgba(60,64,76,0.35)";for(let r=0;r<3;r++)for(let k=0;k<12;k++)ctx.fillRect(344+k*41,-30+r*34,34,26);ctx.fillRect(500,74,170,18);
  sp_boxTop(ctx);sp_notebook(ctx);
  // a pencil by the notebook, a cup
  ctx.save();ctx.translate(1700,960);ctx.rotate(-0.35);ctx.fillStyle="rgba(40,30,20,0.25)";ctx.fillRect(-120,8,250,10);wc_part(ctx,wc_rect(-130,-6,230,14),[236,186,70],1,{kind:"thing",lw:1,seed:914});
  wc_flat(ctx,[[100,-6],[130,1],[100,8]],[226,200,160],1,"tip");ctx.fillStyle="rgb(50,50,56)";ctx.beginPath();ctx.moveTo(122,-1);ctx.lineTo(130,1);ctx.lineTo(122,3);ctx.fill();ctx.restore();
  ctx.save();ctx.filter="blur(8px)";ctx.fillStyle="rgba(40,30,20,0.3)";ctx.beginPath();ctx.arc(1840,1010,80,0,TAU);ctx.fill();ctx.restore();
  wc_wash(ctx,wc_ell(1830,1000,74,74,40),[70,110,130],{kind:"thing",lw:1.4,seed:915});wc_wash(ctx,wc_ell(1830,1000,58,58,40),[120,84,60],{kind:"thing",line:false,seed:916});}
// The team's room, from across a high table: a brick wall on the left with plants, a wide window onto trees, a glass building and wind
// turbines on the far hills, a screen for calls on the right. The three stand behind the table (team24table, a layer of its own), the box
// of examples on it. SP_T4: the floor's line, the window [x, y, w, h], the table's top and its ends, who stands where (and the scale), the
// line their feet stand on, the box's size and how far it's lifted.
const SP_T4={fy:840,win:[700,70,800,560],top:772,ends:[180,1740],stand:[[560,"spMl1"],[960,"spMl3"],[1360,"spMl2"]],s:1.0,foot:1046,bw:[240,104],lift:28};
const SP_WALL24=[234,231,224];
// an arm's angles [upper, fore] that put side s's hand (s -1 left, 1 right) at (tx, ty), in the figure's units from its feet, the elbow kept
// in by the body: so a held box hides the arm, and only the hands show at its sides
function sp_ik(id,s,tx,ty){const sx=PEOPLE[id].build.sh-12,dx=s*tx-sx,dy=ty+416,D=Math.hypot(dx,dy),L1=108,L2=113,
    al=Math.acos(clamp((L1*L1+D*D-L2*L2)/(2*L1*D),-1,1)),a0=Math.atan2(dx,dy)-al,ex=Math.sin(a0)*L1,ey=Math.cos(a0)*L1;return[a0,Math.atan2(dx-ex,dy-ey)];}
// the hands at the sides of the box in front of the one in the middle, on the table or lifted
function sp_boxArms(up){const K=SP_T4,id=K.stand[1][1],k=K.s*PEOPLE[id].build.h,hx=(K.bw[0]/2-14)/k,hy=(K.top-K.bw[1]/2-(up?K.lift:0)-K.foot)/k;
  return{L:sp_ik(id,-1,-hx,hy),R:sp_ik(id,1,hx,hy)};}
Object.assign(POSE,{
  // the one in the middle: her hands on the box, then lifting it and asking the one on her right, then turning to the one on her left
  spBoxRest:Object.assign({feet:26,shift:0,tilt:0.02,turn:0,gaze:[0,0.7],look:1.5},sp_boxArms(false)),
  spBoxUp:Object.assign({feet:26,shift:-2,tilt:-0.04,turn:-0.16,gaze:[-0.8,0],look:0},sp_boxArms(true)),
  spBoxUpR:Object.assign({feet:26,shift:2,tilt:0.04,turn:0.16,gaze:[0.8,0],look:0},sp_boxArms(true)),
  // looking towards the right of the picture, or the left (the other way for one drawn mirrored); asking with an open hand held out
  spEyesR:{L:[0.12,-0.08],R:[0.14,-0.06],feet:26,shift:0,tilt:0.02,turn:0.14,gaze:[0.75,0.1],look:0},
  spEyesL:{L:[0.12,-0.08],R:[0.14,-0.06],feet:26,shift:0,tilt:-0.02,turn:-0.14,gaze:[-0.75,0.1],look:0},
  spAskOpen:{L:[0.12,-0.06],R:[0.42,1.95],hand:"open",feet:28,shift:3,tilt:-0.06,turn:0.18,gaze:[0.8,0],look:0}});
// the view: sky, the far hills with three wind turbines, a glass building, trees close by
function sp_view24(ctx,x,y,w,h){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const sky=ctx.createLinearGradient(0,y,0,y+h);sky.addColorStop(0,"rgb(160,198,228)");sky.addColorStop(1,"rgb(232,238,236)");
  ctx.fillStyle=sky;ctx.fillRect(x,y,w,h);ctx.save();ctx.globalCompositeOperation="screen";for(const [cx,cy,r] of [[x+160,y+90,110],[x+300,y+70,80],[x+620,y+120,120]])wc_glowAt(ctx,cx,cy,r,[255,255,255],0.5);ctx.restore();
  const hz=y+h*0.6;wc_wash(ctx,[[x-20,hz],[x+150,hz-46],[x+330,hz-30],[x+520,hz-60],[x+700,hz-36],[x+w+20,hz-50],[x+w+20,hz+40],[x-20,hz+40]],[150,176,170],{depth:0.45,kind:"land",line:false,seed:941});
  for(const [tx,s] of [[x+250,1],[x+420,0.8],[x+560,0.9]]){const ty=hz-50*s-10;ctx.strokeStyle="rgba(236,240,240,0.95)";ctx.lineWidth=3*s;ctx.beginPath();ctx.moveTo(tx,ty+90*s);ctx.lineTo(tx,ty);ctx.stroke();
    for(let k=0;k<3;k++){const a=-Math.PI/2+k*TAU/3+0.4;ctx.lineWidth=2.4*s;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx+Math.cos(a)*40*s,ty+Math.sin(a)*40*s);ctx.stroke();}}
  // a glass building, its floors catching the sky
  const gx=x+w-330,gy=y+h*0.18;wc_part(ctx,wc_rect(gx,gy,230,h),[150,176,196],0.85,{lw:1.1,seed:942});ctx.fillStyle="rgba(255,255,255,0.35)";for(let fy2=gy+20;fy2<y+h;fy2+=34)ctx.fillRect(gx+6,fy2,218,3);
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,gx+60,gy+80,120,[255,255,255],0.35);ctx.restore();
  sp_treeLine(ctx,x-30,x+w+30,y+h-150,140,947);ctx.restore();}
// the room
function sp_paintTeam24(ctx){const K=SP_T4,[wx,wy,ww,wh]=K.win;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,K.fy+40),SP_WALL24,{kind:"plaster",line:false,seed:951});
  wc_wash(ctx,wc_rect(-40,K.fy,W+80,H-K.fy+40),[168,166,160],{kind:"ground",line:false,seed:952});
  // the brick wall, up to the window
  const R=wc_rng(953);ctx.save();ctx.beginPath();ctx.rect(0,0,640,K.fy);ctx.clip();wc_wash(ctx,wc_rect(-40,-40,720,K.fy+40),[172,98,74],{kind:"plaster",line:false,seed:954});
  for(let r=0,yy=0;yy<K.fy;r++,yy+=38){for(let xx=(r%2)*-50;xx<660;xx+=100){const v=(R()-0.5)*0.16;ctx.fillStyle=rgba(v>0?lighten([172,98,74],v):wc_dim([172,98,74],-v),0.55);ctx.fillRect(xx+3,yy+3,94,32);}
    ctx.fillStyle="rgba(230,220,206,0.5)";ctx.fillRect(0,yy+35,640,4);}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="multiply";const sh=ctx.createLinearGradient(560,0,660,0);sh.addColorStop(0,"rgba(120,100,90,0)");sh.addColorStop(1,"rgba(120,100,90,0.35)");ctx.fillStyle=sh;ctx.fillRect(560,0,100,K.fy);ctx.restore();
  // a shelf on the bricks with plants on it, one trailing down
  wc_part(ctx,wc_rect(80,300,420,18),[220,206,186],1,{kind:"thing",lw:1.1,seed:955});
  for(const [px,c] of [[140,[84,140,96]],[300,[110,150,90]],[430,[70,120,90]]]){wc_wash(ctx,wc_rrPts(px-34,232,68,68,8),[226,222,214],{kind:"thing",lw:1.2,seed:px});
    for(let k=0;k<9;k++){const a=-Math.PI/2+(k-4)*0.32,l=60+R()*40;wc_flat(ctx,[[px,236],[px+Math.cos(a-0.12)*l*0.6,236+Math.sin(a-0.12)*l*0.6],[px+Math.cos(a)*l,236+Math.sin(a)*l],[px+Math.cos(a+0.12)*l*0.6,236+Math.sin(a+0.12)*l*0.6]],c,0.9,"leaf");}}
  ctx.save();ctx.strokeStyle="rgba(70,120,80,0.85)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(300,300);ctx.bezierCurveTo(310,380,280,460,300,560);ctx.stroke();ctx.restore();
  for(let k=0;k<9;k++){const yy=330+k*26;wc_flat(ctx,wc_ell(300+12*Math.sin(k*1.7)+(k%2?14:-14),yy,14,9,12),[96,150,96],0.9,"leaf");}
  // the window, its light, the frame
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,wx+ww/2,wy+wh*0.6,900,[255,250,236],0.3);ctx.restore();sp_view24(ctx,wx,wy,ww,wh);
  for(const r of [wc_rect(wx-14,wy-14,ww+28,14),wc_rect(wx-14,wy-14,14,wh+28),wc_rect(wx+ww,wy-14,14,wh+28),wc_rect(wx+ww/2-5,wy,10,wh)])wc_part(ctx,r,[64,68,76],1,{lw:1.1});
  wc_part(ctx,wc_rect(wx-24,wy+wh,ww+48,16),[220,218,212],1,{lw:1.2});
  // a screen for calls, off, on the right wall, and a tall plant in the corner
  ctx.save();ctx.filter="blur(8px)";ctx.fillStyle="rgba(40,40,50,0.25)";ctx.fillRect(1570,150,330,200);ctx.restore();wc_part(ctx,wc_rrPts(1560,140,330,196,8),[44,48,58],1,{kind:"thing",lw:1.2,seed:956});
  ctx.save();ctx.globalCompositeOperation="screen";const gl=ctx.createLinearGradient(1560,140,1890,336);gl.addColorStop(0,"rgba(255,255,255,0)");gl.addColorStop(0.45,"rgba(255,255,255,0.12)");gl.addColorStop(0.55,"rgba(255,255,255,0)");ctx.fillStyle=gl;ctx.fillRect(1566,146,318,184);ctx.restore();
  gv_plant(ctx,1840,K.fy+30,1.5);}
// the high table, in front of them: its top, pale, a wooden edge, metal legs; a laptop seen from behind, two cups, a tablet lying flat
function sp_paintTeam24Table(ctx){const K=SP_T4,[l,r]=K.ends,y=K.top;
  for(const lx of [l+40,r-70])wc_part(ctx,wc_rect(lx,y+30,30,H-y),[120,124,134],1,{kind:"thing",lw:1.1,seed:lx});
  ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(40,40,40,0.25)";ctx.fillRect(l,y+30,r-l,24);ctx.restore();
  wc_wash(ctx,wc_rect(l,y,r-l,30),[244,242,236],{kind:"thing",lw:1.3,seed:961});wc_flat(ctx,wc_rect(l,y+22,r-l,8),[206,176,136],1,"edge");
  wc_part(ctx,[[290,y],[520,y],[506,y-150],[304,y-150]],[176,180,190],1,{kind:"thing",lw:1.2,seed:291});
  ctx.fillStyle="rgba(255,255,255,0.25)";ctx.fillRect(310,y-146,190,4);ctx.fillStyle="rgba(230,232,238,0.8)";ctx.beginPath();ctx.arc(405,y-80,10,0,TAU);ctx.fill();
  gv_mug(ctx,700,y,[226,226,222]);gv_mug(ctx,1600,y,[70,110,130],true);
  wc_part(ctx,wc_rect(1150,y-8,190,8),[60,62,70],1,{kind:"thing",lw:1,seed:962});}
// the box of examples from the front, its bottom's middle at (x, y): the photos standing up out of it, the box, its label, a hand hole
function sp_boxFront(ctx,x,y,rot){const [bw,bh]=SP_T4.bw,kr=[196,158,112];ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);
  const R=wc_rng(971);for(let i=0;i<6;i++){const px=-bw/2+26+i*((bw-52)/5),ph=SP_EX[i%SP_EX.length],up=10+R()*10;ctx.save();ctx.translate(px,-bh+4);ctx.rotate((R()-0.5)*0.2);
    ctx.fillStyle="#f6f4ee";ctx.fillRect(-26,-up,52,up+20);ctx.fillStyle=rgba(ph[0]==="cat"?[212,224,236]:[222,232,206],1);ctx.fillRect(-21,-up+5,42,up+10);ctx.restore();}
  ctx.fillStyle="rgba(40,30,20,0.25)";ctx.fillRect(-bw/2+6,-6,bw,10);wc_wash(ctx,wc_rect(-bw/2,-bh,bw,bh),kr,{kind:"cover",lw:1.4,seed:972});wc_flat(ctx,wc_rect(-bw/2,-bh,bw,10),lighten(kr,0.12),1,"rim");
  wc_flat(ctx,wc_rect(-100,-bh+24,200,50),[248,246,238],1,"label");wc_T(ctx,"training data",0,-bh+59,{w:700,size:28,align:"center",col:WC_DARK});
  ctx.fillStyle="rgba(40,28,16,0.5)";rr(ctx,-28,-bh+84,56,12,6);ctx.fill();ctx.restore();}
// a hand gripping the box's side at (x, y), side -1 the left, 1 the right: the palm on the box's side, the fingers over its front
function sp_gripHand(ctx,x,y,side,skin){ctx.save();ctx.translate(x,y);ctx.scale(side,1);ell(ctx,6,0,12,17);litFill(ctx,skin,-6,-17,18,17);seam(ctx,skin,0.32,1.2);
  for(let i=0;i<3;i++){ell(ctx,-4,-9+i*9,7,4.4);litFill(ctx,skin,-11,-14+i*9,3,-4+i*9);seam(ctx,skin,0.25,1);}ctx.restore();}
// the team at the table: o.p[id] = [pose, pose2, mix, expr, mirrored] for each; o.hold, how far she has reached for the box (0 to 1),
// o.lift, how far it's lifted (0 to 1), o.rot, how it's turned
function sp_team24(ctx,tt,o){const K=SP_T4;K.stand.forEach(([sx,id],i)=>{const p=o.p[id];person(ctx,id,sx,K.foot,K.s,{t:tt+i*1.1,pose:p[0],pose2:p[1],mix:p[2],expr:p[3]||"calm",flip:!!p[4]});});
  ctx.drawImage(gv_place("team24table"),0,0);
  const [bx,id]=K.stand[1],k=K.s*PEOPLE[id].build.h,lift=K.lift*easeCam(clamp(o.lift||0,0,1)),by=K.top-lift,rot=o.rot||0;sp_boxFront(ctx,bx,by,rot);
  const g=clamp(((o.hold||0)-0.6)/0.4,0,1);if(g>0)withA(ctx,g,()=>{for(const sd of [-1,1]){const hx=sd*(K.bw[0]/2+2),hy=-K.bw[1]/2;
    sp_gripHand(ctx,bx+hx*Math.cos(rot)-hy*Math.sin(rot),by+hx*Math.sin(rot)+hy*Math.cos(rot),sd,PEOPLE[id].skin);}});}
// The shelf in 2024: the binders and flyers gone, the editions moved along to make room: the first, the second, the revision of 2024;
// then the third edition's draft leans on them, a tag hanging beside it. SP_SH4: the books' middles, the draft's foot (its bottom-left
// corner, against the revision) and its size, how far it leans.
const SP_SH4={books:[400,740,1080],draft:[1262,300,410,0.06]};
// the revision of 2024: navy, "Second Edition", "Revised"
SP_ED[3]={col:[46,58,88],sub:"Second Edition",sub2:"Revised"};
// the draft of the third edition, leaning on the books: a stack of printed pages held by a binder clip, "DAMA-DMBOK 3.0" on the first,
// "draft" written under it in pencil. o.notes: the three sticky notes (0 to 1 each), o.lift: its pages lifting (0 to 1), o.tag: the tag
// dropping in (0 to 1); o.y: how far up from the shelf it's still being lifted, o.lean: how far it has tipped onto the books (0 to 1)
const SP_NOTES3=[["AI governance",GV_NOTE[0],-0.05,[24,252]],["data ethics",GV_NOTE[1],0.04,[118,298]],["sustainability",GV_NOTE[3],-0.03,[30,344]]];
function sp_draft(ctx,o){o=o||{};const [x0,w,h,lean]=SP_SH4.draft,y0=SP_SH.top-(o.y||0),th=lean*(o.lean==null?1:o.lean),lf=o.lift||0;
  ctx.save();ctx.translate(x0,y0);ctx.rotate(-th);
  // the pages under the first, each a little out of line, fanning as they lift
  for(let i=3;i>=1;i--){const f=lf*(0.5+0.5*Math.sin(i*1.7+lf*5));ctx.save();ctx.translate(w/2,-h);ctx.rotate(0.012*i+0.045*f*i);ctx.translate(-w/2,h);
    ctx.drawImage(gv_sheetPaper(w,h),-20+i*2,-h-20+i*3);ctx.restore();}
  ctx.drawImage(gv_sheetPaper(w,h),-20,-h-20);
  wc_T(ctx,"DAMA-DMBOK",w/2,-h+96,{w:800,size:30,align:"center",col:WC_DARK});
  wc_T(ctx,"3.0",w/2,-h+176,{w:800,size:72,align:"center",col:WC_DARK});
  wc_hand(ctx,"draft",w/2-46,-h+232,{size:40,col:[60,70,120],w:700});
  // the notes, small, stuck on one by one
  SP_NOTES3.forEach(([s,col,rot,[nx,ny]],i)=>{const p=(o.notes||[])[i]||0;if(p<=0.01)return;const k=1.15-0.15*spring(clamp(p,0,1)),nw=168,nh=52;
    ctx.save();ctx.translate(nx+nw/2,-h+ny+nh/2);ctx.rotate(rot);ctx.scale(k,k);ctx.globalAlpha*=clamp(p*3,0,1);
    ctx.save();ctx.filter="blur(4px)";ctx.fillStyle="rgba(70,60,40,0.25)";ctx.fillRect(-nw/2+4,-nh/2+6,nw,nh);ctx.restore();
    wc_wash(ctx,wc_rect(-nw/2,-nh/2,nw,nh),col,{kind:"card",line:false,seed:960+i});ctx.fillStyle="rgba(255,255,255,0.2)";ctx.fillRect(-nw/2,-nh/2,nw,10);
    sp_hand(ctx,s,-nw/2+12,9,{size:22,col:[44,52,90],w:700,deco:o.deco});ctx.restore();});
  // the first page's corner curling up as the pages lift
  const cu=lf*(0.6+0.4*Math.sin(lf*7));if(cu>0.02){const c=40+70*cu;ctx.save();ctx.fillStyle="rgba(60,50,40,0.18)";ctx.beginPath();ctx.moveTo(w,-c);ctx.lineTo(w-c,0);ctx.lineTo(w,0);ctx.fill();
    ctx.fillStyle=rgba([234,232,226],1);ctx.beginPath();ctx.moveTo(w,-c);ctx.lineTo(w-c,0);ctx.lineTo(w-c*0.62,-c*0.62);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(110,104,100,0.45)";ctx.lineWidth=1.2;ctx.stroke();ctx.restore();}
  // the binder clip at the top, its wire handles folded up
  ctx.save();ctx.strokeStyle="rgb(170,176,186)";ctx.lineWidth=4;ctx.lineJoin="round";for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(w/2+s*22,-h+4);ctx.lineTo(w/2+s*12,-h-34);ctx.lineTo(w/2+s*30,-h-34);ctx.stroke();}ctx.restore();
  wc_part(ctx,[[w/2-38,-h-10],[w/2+38,-h-10],[w/2+34,-h+20],[w/2-34,-h+20]],[40,40,46],1,{kind:"thing",lw:1,seed:977});
  ctx.restore();}
// handwriting as wc_hand writes it, which can be marked as decoration (o.deco): where a wider shot shows words read close before
function sp_hand(ctx,s,x,y,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return;const sub=s.slice(0,Math.ceil(s.length*clamp(p,0,1)));ctx.save();ctx.translate(x,y);ctx.transform(1,0,-0.2,1,0,0);
  wc_T(ctx,sub,0,0,{size:o.size||32,w:o.w||600,col:o.col||WCP.parchInk,align:o.align,a:o.a,deco:o.deco});ctx.restore();}
// where the draft's clip's right handle is, on the page: for the tag's string
function sp_draftHandle(f){const [x0,w,h,l0]=SP_SH4.draft,lean=l0*(f==null?1:f),px=w/2+30,py=-h-34;return[x0+px*Math.cos(lean)+py*Math.sin(lean),SP_SH.top-px*Math.sin(lean)+py*Math.cos(lean)];}
// a manila tag on a string from the clip's handle, hanging beside the draft, "planned for 2027"; p: dropping in and swinging to rest
function sp_tag(ctx,p,f,deco){if(p<=0.01)return;const [hx,hy]=sp_draftHandle(f),sw=0.35*Math.exp(-3*p)*Math.cos(p*9)*(p<1?1:0),drop=(1-easeCam(clamp(p*2.5,0,1)))*-60,
    ax=hx+132,ay=hy+92+drop,tw_=236,thh=64,rot=0.2+sw;
  ctx.save();ctx.globalAlpha*=clamp(p*4,0,1);ctx.strokeStyle="rgba(200,190,170,0.95)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(hx,hy);ctx.quadraticCurveTo(hx+70,hy-6+drop*0.3,ax+4,ay);ctx.stroke();
  ctx.translate(ax,ay);ctx.rotate(rot);ctx.save();ctx.filter="blur(4px)";ctx.fillStyle="rgba(50,40,30,0.25)";ctx.fillRect(-10,-thh/2+6,tw_,thh);ctx.restore();
  wc_part(ctx,[[0,-thh/2+14],[18,-thh/2],[tw_,-thh/2],[tw_,thh/2],[18,thh/2],[0,thh/2-14]],[222,196,150],1,{kind:"thing",lw:1.2,seed:978});
  ctx.fillStyle="rgba(250,246,236,1)";ctx.beginPath();ctx.arc(16,0,6,0,TAU);ctx.fill();ctx.strokeStyle="rgba(150,120,80,0.8)";ctx.lineWidth=2;ctx.stroke();
  sp_hand(ctx,"planned for 2027",34,9,{size:24,col:[60,46,30],w:700,deco});ctx.restore();}
// the shelf in 2024 (shelf24): the bookcase as in 2009, its middle shelf cleared for the editions
function sp_paintShelf24(ctx){sp_paintShelf(ctx,{binders:0,flyers:false,bookend:false});}
// Europe's AI law, printed, on a desk: a page open at Article 10, its title lit in gold by a highlighter. SP_AC: the page [x, y, w, h, rot],
// the title's line; SP_AC.p2: the opening of paragraph 2, as the law words it (the rest of the page is print too small to read)
const SP_AC={page:[520,36,880,1010,-0.012],head:"AI Act · Regulation (EU) 2024/1689",art:"Article 10",title:"Data and data governance",ty:250,
  p2:["2. Training, validation and testing data sets","shall be subject to data governance and","management practices appropriate for the","intended purpose of the high-risk AI system."]};
// the desk: grey-blue laminate, a little light from the top; the page, blank, its words drawn every frame; reading glasses, a pen
function sp_paintAct24(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[198,204,208],{kind:"plaster",line:false,seed:981});
  const R=wc_rng(982);ctx.save();for(let i=0;i<500;i++){ctx.fillStyle="rgba("+(R()<0.5?"110,116,124":"255,255,255")+","+(0.05+R()*0.08).toFixed(3)+")";ctx.fillRect(R()*W,R()*H,2+R()*3,1.5+R()*2);}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,900,-160,1300,[255,250,240],0.3);ctx.restore();
  const [x,y,w,h,rot]=SP_AC.page;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(40,46,56,0.3)";ctx.fillRect(10,24,w,h);ctx.restore();
  for(let i=3;i>0;i--)wc_flat(ctx,wc_rect(i*4,i*3,w,h),[238-i*6,238-i*6,234-i*6],1,"pages");ctx.drawImage(gv_sheetPaper(w,h),-20,-20);ctx.restore();
  // reading glasses folded on the left, a pen on the right
  ctx.save();ctx.translate(250,760);ctx.rotate(0.25);ctx.strokeStyle="rgba(40,40,48,0.9)";ctx.lineWidth=5;for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(s*58,0,50,40,0,0,TAU);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(-10,-6);ctx.quadraticCurveTo(0,-16,10,-6);ctx.stroke();ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-104,-12);ctx.lineTo(96,-40);ctx.moveTo(104,-12);ctx.lineTo(-90,-44);ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,0.18)";for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(s*58-14,-12,16,10,-0.4,0,TAU);ctx.fill();}ctx.restore();
  ctx.save();ctx.translate(1620,860);ctx.rotate(-0.6);ctx.fillStyle="rgba(40,30,20,0.22)";ctx.fillRect(-100,8,210,10);wc_part(ctx,wc_rrPts(-110,-7,220,15,7),[34,40,58],1,{kind:"thing",lw:1,seed:983});
  ctx.fillStyle="rgb(196,198,204)";ctx.fillRect(70,-7,20,15);ctx.restore();}
// the page's words, and the gold over the title as lit goes 0 to 1 (a highlighter's stroke, from left to right)
function sp_actWords(ctx,lit){const [x,y,w,h,rot]=SP_AC.page,ty=SP_AC.ty;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);
  wc_T(ctx,SP_AC.head,60,74,{w:600,size:28,col:WC_MUTED});ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(60,96,w-120,2);
  const tw_=tw(ctx,SP_AC.title,44,800);if(lit>0.01){const x0=w/2-tw_/2-18,x1=x0+(tw_+36)*clamp(lit,0,1);ctx.save();ctx.globalCompositeOperation="multiply";
    ctx.fillStyle=rgba([250,214,110],0.85);ctx.beginPath();ctx.moveTo(x0,ty-40);ctx.lineTo(x1,ty-42);ctx.lineTo(x1+4,ty+14);ctx.lineTo(x0+2,ty+12);ctx.closePath();ctx.fill();ctx.restore();}
  wc_T(ctx,SP_AC.art,w/2,ty-62,{w:500,size:34,align:"center",col:WC_DARK});wc_T(ctx,SP_AC.title,w/2,ty,{w:800,size:44,align:"center",col:mix(WC_DARK,GV.goldInk,0.35*clamp(lit,0,1))});
  gv_lines(ctx,60,312,w-120,4,44);SP_AC.p2.forEach((l,i)=>wc_T(ctx,l,60,520+i*44,{w:500,size:30,col:WC_DARK}));gv_lines(ctx,60,700,w-120,1,44);gv_lines(ctx,100,744,w-160,2,44);
  ctx.restore();}
// where the highlighter's tip is, on the screen, as lit goes 0 to 1
function sp_actTip(ctx,lit){const [x,y,w,h,rot]=SP_AC.page,ty=SP_AC.ty,tw_=tw(ctx,SP_AC.title,44,800),px=w/2-tw_/2-18+(tw_+36)*clamp(lit,0,1),py=ty-14,cx=x+w/2,cy=y+h/2,
    dx=px-w/2,dy=py-h/2;return[cx+dx*Math.cos(rot)-dy*Math.sin(rot),cy+dx*Math.sin(rot)+dy*Math.cos(rot)];}
// a hand holding a highlighter as one writes, its tip at (x, y), coming in from the bottom right: the pen, gold; the index finger along
// it, the thumb under it, the back of the hand; the sleeve
function sp_highlighter(ctx,x,y,a){if(a<=0.01)return;const sk=[214,170,136],sl=[70,84,110];ctx.save();ctx.globalAlpha*=clamp(a,0,1);ctx.translate(x,y);ctx.rotate(0.62);
  ctx.save();ctx.filter="blur(12px)";ctx.fillStyle="rgba(30,30,40,0.22)";ctx.fillRect(60,30,1640,100);ctx.restore();
  wc_part(ctx,[[0,-6],[24,-15],[24,15],[0,6]],[236,190,60],1,{kind:"thing",lw:1,seed:984});wc_part(ctx,wc_rrPts(24,-16,230,32,8),[244,206,80],1,{kind:"thing",lw:1.1,seed:985});
  ctx.beginPath();ctx.moveTo(214,-50);ctx.lineTo(1700,-84);ctx.lineTo(1700,92);ctx.lineTo(214,46);ctx.closePath();litFill(ctx,sl,214,-84,1700,92);seam(ctx,sl,0.3,1.2);
  ell(ctx,176,-4,74,54,0.08);litFill(ctx,sk,102,-58,250,50);seam(ctx,sk,0.35,1.4);
  ctx.save();ctx.strokeStyle=rgba(darken(sk,0.35),0.4);ctx.lineWidth=2;ctx.lineCap="round";for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(150+i*4,-34+i*22,9,-1.2,1.2);ctx.stroke();}ctx.restore();
  ell(ctx,92,-17,52,12,-0.05);litFill(ctx,sk,40,-29,144,-5);seam(ctx,sk,0.32,1.2);ell(ctx,50,-18,9,7,0);ctx.fillStyle=rgba(lighten(sk,0.3),0.9);ctx.fill();
  ell(ctx,104,17,40,12,0.12);litFill(ctx,sk,64,5,144,29);seam(ctx,sk,0.32,1.2);ctx.restore();}

// ---- 8 · Still at the centre: a pencil sketch of each time the question was asked, and the question; the newest copy of the book, open at
// its wheel; the university, and Yusuf's office before he comes ----
// a pencil sketch of a picture the film has shown: paint(q) composes it at full size, crop [x, y, w, h] is the part sketched, at w by h.
// Lines where it's darker than round about it (the difference of two blurs), short strokes of hatching where it's dark, a second layer
// across them where it's darker, on a sheet's paper
function sp_pencil(paint,crop,w,h,seed){const S=mkCanvas(W,H);paint(S.getContext("2d"));const [sx,sy,sw,sh]=crop,
    lum=sig=>{const B=mkCanvas(w,h),b=B.getContext("2d");b.fillStyle="#fff";b.fillRect(0,0,w,h);b.filter="blur("+sig+"px)";b.drawImage(S,sx,sy,sw,sh,0,0,w,h);
      const d=b.getImageData(0,0,w,h).data,L=new Float32Array(w*h);for(let i=0;i<w*h;i++)L[i]=(0.299*d[i*4]+0.587*d[i*4+1]+0.114*d[i*4+2])/255;return L;};
  const L1=lum(0.6),L2=lum(2.2),L3=lum(5),O=mkCanvas(w,h),q=O.getContext("2d"),R=wc_rng(seed),gr=WC_PENCIL;
  q.fillStyle=rgba(WC_CARD,1);q.fillRect(0,0,w,h);q.lineCap="round";
  for(const [dir,th,amp] of [[1,0.36,0.5],[-1,0.6,0.45]])for(let y=-10;y<h+10;y+=5)for(let x=-10+((y/5)%2)*6;x<w+10;x+=12){const jx=x+(R()-0.5)*4,jy=y+(R()-0.5)*2,
      dk=1-L3[clamp(Math.round(jy),0,h-1)*w+clamp(Math.round(jx),0,w-1)];if(dk<th)continue;const a=clamp((dk-th)/(1-th)*1.6,0,1)*amp,len=7+R()*5,an=dir*(0.78+(R()-0.5)*0.16);
    q.strokeStyle=rgba(gr,a);q.lineWidth=0.9+R()*0.5;q.beginPath();q.moveTo(jx-Math.cos(an)*len,jy+Math.sin(an)*len);q.lineTo(jx+Math.cos(an)*len,jy-Math.sin(an)*len);q.stroke();}
  const id=q.createImageData(w,h),p=id.data;for(let i=0;i<w*h;i++){const v=clamp((L2[i]-L1[i]-0.015)*7,0,1);p[i*4]=gr[0];p[i*4+1]=gr[1];p[i*4+2]=gr[2];p[i*4+3]=Math.round(v*v*(3-2*v)*242);}
  const Lc=mkCanvas(w,h);Lc.getContext("2d").putImageData(id,0,0);q.drawImage(Lc,0,0);return O;}
// the three sketched, as the film showed them: the meeting in Los Angeles (1980), the bank's floor at night (2008), the team with its box of
// examples (2024). Each on a sheet pinned to the board (at: its middle and turn), its year written under it
const SP_SK={w:684,h:385,sheet:[480,346],at:[[470,318,-0.022],[960,310,0.014],[1450,320,-0.012]],years:["1980","2008","2024"],
  crops:[[0,0,1920,1080],[100,90,1680,945],[160,40,1600,900]]};
function sp_sketchPaint(i,q){const tt=2;
  if(i===0){const L=SP_LA;q.drawImage(gv_place("la80"),0,0);
    L.back.forEach(([bx,id],j)=>{const cup=j%2===1;person(q,id,bx,L.bf,L.bs,{t:tt+j,pose:cup?"spCup":"listen",carry:cup?sp_cupHeld:null,flip:true});sp_badge(q,id,bx,L.bf,L.bs,true);});
    const [cx,cf,cs]=L.chart;person(q,"spLa1",cx,cf,cs,{t:tt,pose:"point",flip:true});sp_badge(q,"spLa1",cx,cf,cs,true);
    L.seats.forEach(([sx,id],j)=>gv_behind(q,id,sx,L.table[2],L.s,{t:tt+j,pose:"listen",flip:true}));q.drawImage(gv_place("la80table"),0,0);sp_cardName(q);sp_chart(q,[1,1,1]);}
  else if(i===1){const D=SP_RK.desk,[sx,ss]=SP_RK.seat;q.drawImage(gv_place("risk"),0,0);sp_tvNews(q,1);
    person(q,"spAn1",250,1004,0.86,{t:tt,pose:"listen"});person(q,"spAn2",420,1010,0.88,{t:tt+1,pose:"listen"});
    gv_behind(q,"spHead",sx,D.top,ss,{t:tt,pose:"hold",carry:sp_cardBack,expr:"concerned"});person(q,"spDep",1500,1012,0.9,{t:tt,pose:"stand",flip:true});
    q.drawImage(gv_place("riskDesk"),0,0);sp_lampLight(q,1);}
  else{q.drawImage(gv_place("team24"),0,0);sp_team24(q,tt,{p:{spMl1:["spEyesR","spEyesR",0,"calm"],spMl3:["spBoxUp","spBoxUpR",1,"concerned"],
    spMl2:["spEyesR","spAskOpen",1,"concerned",true]},hold:1,lift:1,rot:0.03});}}
function sp_sketchC(i){const K=SP_SK;return wc_kept("spSketch"+i,K.w,K.h,q=>q.drawImage(sp_pencil(c=>sp_sketchPaint(i,c),K.crops[i],K.w,K.h,601+i),0,0));}
// a sketch on its sheet, pinned up: the paper, the sketch, its year in pencil under it; it lands as it's pinned (u, 0 to 1)
function sp_sketchSheet(ctx,i,u){if(u<=0)return;const K=SP_SK,[cx,cy,rot]=K.at[i],[sw,sh]=K.sheet,k=lerp(1.14,1,easeCam(clamp(u,0,1))),iw=sw-24,ih=Math.round(iw*K.h/K.w);
  ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.scale(k,k);withA(ctx,clamp(u*3,0,1),()=>{gv_sheet(ctx,-sw/2,-sh/2,sw,sh);ctx.drawImage(sp_sketchC(i),-iw/2,-sh/2+26,iw,ih);
    ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=1.5;ctx.strokeRect(-iw/2,-sh/2+26,iw,ih);
    wc_hand(ctx,K.years[i],-iw/2+6,sh/2-12,{size:34,col:WC_PENCIL,w:700});gv_pin(ctx,0,-sh/2+13,GV.red,1.2);});ctx.restore();}
// the question, on a card pinned under them, gold: first a question mark; then Who decides? and Who answers?, each half as it's said
// (a, b, 0 to 1); the card as it lands (u)
const SP_Q={x:960,y:716,w:1040,h:150};
function sp_question(ctx,u,a,b){if(u<=0)return;const Q=SP_Q,k=lerp(1.12,1,easeCam(clamp(u,0,1)));ctx.save();ctx.translate(Q.x,Q.y);ctx.rotate(0.006);ctx.scale(k,k);
  withA(ctx,clamp(u*3,0,1),()=>{wc_panel(ctx,-Q.w/2,-Q.h/2,Q.w,Q.h,{kind:"card",wash:GV.gold,washA:0.35,seed:801});gv_pin(ctx,0,-Q.h/2+14,GV.red,1.3);
    if(a<0.4)withA(ctx,1-clamp(a*2.5,0,1),()=>wc_T(ctx,"?",0,32,{w:800,size:88,align:"center",col:WC_DARK}));
    if(a>0)withA(ctx,clamp(a,0,1),()=>wc_T(ctx,"Who decides?",-256,26,{w:800,size:60,align:"center",col:WC_DARK}));
    if(b>0)withA(ctx,clamp(b,0,1),()=>wc_T(ctx,"Who answers?",256,26,{w:800,size:60,align:"center",col:WC_DARK}));});ctx.restore();}
// a thread from each sketch down to the question, in gold, drawn on (ps[i], 0 to 1)
function sp_threads(ctx,ps){const K=SP_SK,Q=SP_Q;K.at.forEach(([cx,cy],i)=>{const p=ps[i];if(p<=0)return;
  wc_link(ctx,cx,cy+K.sheet[1]/2+4,Q.x+(i-1)*340,Q.y-Q.h/2+4,GV.goldInk,{p,vertical:true,a:0.85,lw:3.5});});}
// the board's wall
const SP_WALL26=[230,220,204];

// the shelf as the last chapter left it: the three editions, the draft leaning on the newest, its tag. Words the frame's left edge cuts
// stay as decoration (cam: the shot's camera). o.take, 0 to 1: two hands take the newest copy from it, and the draft, its prop gone,
// settles upright
function sp_shelfAll(x,cam,o){o=o||{};const KS=SP_SH,B=SP_SH4.books,left=cam.x-960/cam.z,cut=(bx,half)=>left>bx-half&&left<bx+half,tk=o.take||0;
  sp_book(x,B[0],KS.top,1,{deco:cut(B[0]+11,160)});sp_bookTab(x,B[1],KS.top,"ethics",0,40,cut(B[1]+112,80));sp_book(x,B[1],KS.top,2,{deco:cut(B[1]+11,160)});
  const lean=1-easeCam(clamp((tk-0.55)/0.35,0,1));sp_draft(x,{lean,notes:[1,1,1],deco:cam.z<1.3});sp_tag(x,1,lean,cam.z<1.17);
  // the newest copy: the hands come up to it, lift it a little, and take it down and towards us, out of the frame
  const reach=easeCam(clamp(tk/0.3,0,1)),up=easeCam(clamp((tk-0.3)/0.2,0,1)),go=easeCam(clamp((tk-0.5)/0.5,0,1)),dy=-26*up+760*go,k=1+0.16*go;
  x.save();x.translate(B[2],KS.top+dy);x.scale(k,k);sp_bookTab(x,0,0,"AI",0,70,cut(B[2]+112,50));x.restore();sp_book(x,B[2],KS.top+dy,3,{k,deco:cut(B[2]+11,160)});
  if(tk>0){const hx=KS.w/2*k,hy=KS.top+dy-KS.h*0.2*k+700*(1-reach);sp_holdHand(x,B[2]-hx,hy,-1,0.85);sp_holdHand(x,B[2]+hx,hy,1,0.85);}}

// Yusuf's office as film 1 first shows it, the morning he starts: its shelf of 34 binders, the chart on the board, the score on the wall
// (film 1's binders, chart and score, drawn the same way: 17 binders to a shelf, numbered along each row from the left)
const SP_BIND={w:24,h:146,gap:26.6,x:1393,cols:[[96,118,150],[150,90,80],[120,140,104],[186,160,110],[132,136,150],[110,96,130]]};
const SP_RACI=[[1,0,1,0],[1,0,0,1],[0,0,1,1],[1,0,0,1]];
function sp_paintOffice24(ctx){gv_paintOffice(ctx);const B=SP_BIND,O=GV_OFF;
  for(let i=0;i<34;i++)gv_binder(ctx,B.x+(i%17)*B.gap,O.shelf.rows[i<17?1:2]-B.h,B.w,B.h,B.cols[Math.floor(hash(i,17)*B.cols.length)]);
  // the chart of who's responsible for what, small on the board: lines for its words
  const [bx,by]=O.board,x=bx+40,y=by+50,w=330,h=190;gv_sheet(ctx,x,y,w,h);gv_pin(ctx,x+16,y+10,GV.red,0.8);gv_pin(ctx,x+w-16,y+10,GV.red,0.8);
  gv_lines(ctx,x+18,y+28,170,1,0);ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.45);ctx.lineWidth=1.5;for(let i=0;i<=4;i++){ctx.beginPath();ctx.moveTo(x+14,y+56+i*30);ctx.lineTo(x+w-14,y+56+i*30);ctx.stroke();}ctx.restore();
  for(let i=0;i<4;i++){gv_lines(ctx,x+20,y+68+i*30,70,1,0,0.8);SP_RACI[i].forEach((n,j)=>{if(n)gv_lines(ctx,x+128+j*48,y+68+i*30,32,1,0,0.8);});}
  // the framed score: the maturity assessment's result, 2.1 of 5
  const [sx,sy,sw]=O.score,cx=sx+sw/2;wc_T(ctx,"maturity",cx,sy+40,{w:600,size:24,align:"center",col:WC_MUTED,deco:1});wc_T(ctx,"2.1 / 5",cx,sy+88,{w:800,size:42,align:"center",col:WC_DARK,deco:1});
  for(let i=0;i<5;i++){const qx=sx+24+i*26;ctx.fillStyle=rgba(WC_MUTED,0.25);ctx.fillRect(qx,sy+104,22,12);const f=clamp(2.1-i,0,1);if(f>0){ctx.fillStyle=rgba(GV.gold,0.95);ctx.fillRect(qx,sy+104,22*f,12);}}}
// the newest copy of the book, set down on his desk, standing against the tray of papers: brought up by two hands (u, 0 to 1), which let
// go (rel, 0 to 1)
const SP_DB={x:1034,k:0.34};
function sp_deskBook(ctx,u,rel){if(u<=0)return;const KS=SP_SH,D=SP_DB,top=GV_OFF.desk[1],e=easeCam(clamp(u,0,1)),dy=(1-e)*520,k=D.k*(1.04-0.04*spring(fin(u,0.8,0.2)));
  ctx.save();ctx.translate(D.x,top+dy);ctx.rotate(0.05*e);sp_book(ctx,0,0,3,{k,deco:true});ctx.restore();
  if(rel<1){const hx=KS.w/2*k,hy=top+dy-KS.h*0.2*k,o=24*easeCam(clamp(rel*3,0,1)),dn=520*easeCam(rel);sp_holdHand(ctx,D.x-hx-o,hy+dn,-1,0.38);sp_holdHand(ctx,D.x+hx+o,hy+dn,1,0.38);}}
// a name card, as film 1 introduces people: the name, then the role; it rises a little as it comes
function sp_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:3});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}
// the corridor beyond his door (a, 0 to 1): its light under the door and on the floor; and someone coming to it (u, 0 to 1), a shadow
// moving across the door's frosted glass and stopping, their feet crossing the light
function sp_doorLight(ctx,a,u){if(a<=0.01)return;const O=GV_OFF,[x0,x1,dh]=O.door,fy=O.fy,gx=x0+(x1-x0)*0.3,gw=(x1-x0)*0.4,gy=fy-dh+dh*0.1,gh=dh*0.36;
  const g=ctx.createLinearGradient(0,fy,0,fy+46);g.addColorStop(0,rgba([255,226,170],0.5*a));g.addColorStop(1,rgba([255,226,170],0));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x0+6,fy);ctx.lineTo(x1-6,fy);ctx.lineTo(x1+70,fy+46);ctx.lineTo(x0-70,fy+46);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba([255,236,196],0.95*a);ctx.fillRect(x0+6,fy-7,x1-x0-12,7);if(u<=0)return;
  const e=easeCam(clamp(u,0,1)),c=lerp(x0-60,(x0+x1)/2,e),st=Math.sin(u*Math.PI*5)*(1-u)*14,hx=lerp(gx-110,gx+gw/2,e);
  ctx.save();ctx.beginPath();ctx.rect(x0+6,fy-7,x1-x0-12,7);ctx.clip();ctx.fillStyle=rgba([60,48,40],0.7*a);for(const [dx,sd] of [[-22,1],[22,-1]])ctx.fillRect(c+dx+st*sd-15,fy-7,30,7);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(gx,gy,gw,gh);ctx.clip();ctx.filter="blur(9px)";ctx.fillStyle=rgba([62,72,92],0.5*a*clamp(u*3,0,1));
  ctx.beginPath();ctx.ellipse(hx,gy+64,25,31,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(hx,gy+178,64,62,0,0,TAU);ctx.fill();ctx.restore();}

// chapters' places, painted once and kept: the film's, then the series' rooms the end comes back to
const WC_PLACES={risk:sp_paintRisk,riskDesk:sp_paintRiskDesk,spread:sp_paintSpread,board08:sp_paintBoard08,city:sp_paintCityWide,
  office70:sp_paintOffice70,desks70:sp_paintDesks70,admin70:sp_paintAdmin70,adminFront70:sp_paintAdminFront70,dict70:sp_paintDict70,
  laOut:sp_paintLaOut,la80:sp_paintLa80,la80table:sp_paintLa80Table,notice80:sp_paintNotice80,alone70:sp_paintAlone70,copy80:sp_paintCopy80,
  board02:sp_paintBoard02,board02table:sp_paintBoard02Table,report02:sp_paintReport02,shelf09:sp_paintShelf,wheelpage:sp_paintWheelPage,
  basel13:sp_paintBasel13,basel13table:sp_paintBasel13Table,principles13:sp_paintPrinciples13,report23:sp_paintReport23,
  team17:sp_paintTeam17,team17table:sp_paintTeam17Table,front18:sp_paintFront18,front18desk:sp_paintFront18Desk,desk18:sp_paintDesk18,
  desk24:sp_paintDesk24,team24:sp_paintTeam24,team24table:sp_paintTeam24Table,shelf24:sp_paintShelf24,act24:sp_paintAct24,
  board26:c=>gv_paintBoardClose(c,SP_WALL26),campus:gv_paintCampus,office24:sp_paintOffice24};

/* ===== The same problem, everywhere: the eight chapters =====
   Each chapter is a few shots in the places of plan.js and the series' rooms.js, cut together with short dissolves (gv_shots). Times
   inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with the voice if
   it's recorded again. Words on screen are on paper, boards, flyers, books, notes and speech bubbles, at least 28 px as seen, and above
   the captions. */

// made once per chapter, the first time it draws: its cues are known by then
const sp_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a tag that springs in at t0 and goes at t1 (or stays)
function sp_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}

// ---- 1 · One question: a bank's board asks how much it stands to lose, and nobody can add it up ----
// where a person's hand is on the screen, in a pose (or between two): for things that pass from hand to hand
function sp_handAt(id,x,y,s,pose,pose2,mix,flip,side){const P_=PEOPLE[id],po=blendPose(POSE[pose],POSE[pose2],mix),k=s*P_.build.h,h=handAt(P_,side,side<0?po.L:po.R,0);
  return[x+(flip?-1:1)*h[0]*k,y+h[1]*k];}
// the board's card, seen from behind as it's handed over: its middle at x, y, turned rot; the thumbs of whoever holds it (hold, a list
// of [x, y, skin])
function sp_cardFree(ctx,x,y,rot,s,hold){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.fillStyle="rgba(60,50,40,0.22)";rr(ctx,-62,-36,130,80,6);ctx.fill();
  ctx.fillStyle="#f4f1ea";rr(ctx,-66,-40,130,80,6);ctx.fill();ctx.strokeStyle="rgba(58,54,66,0.7)";ctx.lineWidth=2;ctx.stroke();ctx.restore();
  for(const [hx,hy,skin] of hold){ctx.save();ctx.translate(hx,hy);ctx.scale(s,s);ell(ctx,0,0,12,15);litFill(ctx,skin,-12,-15,12,15);seam(ctx,skin,0.3,1.2);ctx.restore();}}
// the card in both hands, read at the chest, its back to us (in the figure's units)
function sp_cardBack(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+14);cx.rotate(-0.02);
  cx.fillStyle="rgba(60,50,40,0.22)";rr(cx,-92,-46,190,100,6);cx.fill();cx.fillStyle="#f4f1ea";rr(cx,-96,-52,190,100,6);cx.fill();cx.strokeStyle="rgba(58,54,66,0.7)";cx.lineWidth=2;cx.stroke();cx.restore();
  fingers(cx,P_,[[mx-90,my+10],[mx+90,my+6]]);}
// the whiteboard, in marker: what each business line stands to lose, the total a red question mark; beside it, the customer's code in
// each line's system. o.q: the total's question mark (0 to 1); o.full: the last figure, written in; o.doubt: when a second figure for
// markets, from another system, is added
const SP_SUMS=[["treasury","155"],["markets","412"],["lending","268"],["abroad","?"]],SP_CODES=["client 0042","= CPTY-A17 ?","= acct 9-310 ?","= K-77/2 ?"];
function sp_board(ctx,t,o){const [bx,by]=SP_WB.board,blue=[44,78,160],red=GV.redInk;
  wc_hand(ctx,"exposure, in millions",bx+90,by+104,{size:50,col:blue,w:700});
  SP_SUMS.forEach(([k,v],i)=>{const y=by+196+i*84;wc_hand(ctx,k,bx+110,y,{size:44,col:blue});
    if(i===3){const f=o.full||0;if(f<1)wc_hand(ctx,"?",bx+540,y,{size:46,col:red,w:800,a:1-clamp(f*3,0,1)});if(f>0)wc_hand(ctx,"97",bx+560,y,{size:44,col:blue,align:"right",p:f});}
    else wc_hand(ctx,v,bx+560,y,{size:44,col:blue,align:"right"});});
  if(o.doubt){const d=clamp((t-o.doubt)/0.9,0,1);if(d>0)wc_hand(ctx,"or 398?",bx+604,by+280,{size:44,col:red,p:d});}
  ctx.save();ctx.strokeStyle=rgba(blue,0.85);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(bx+100,by+540);ctx.lineTo(bx+580,by+544);ctx.stroke();ctx.restore();
  wc_hand(ctx,"total",bx+110,by+626,{size:48,col:blue,w:800});const q=o.q==null?1:o.q;if(q>0){wc_hand(ctx,"?",bx+472,by+646,{size:110,col:red,w:800,p:q});
    wc_ring(ctx,bx+488,by+608,80,80,clamp((q-0.4)/0.6,0,1),{col:red,lw:4,seed:5});}
  wc_hand(ctx,"same client?",bx+800,by+104,{size:50,col:blue,w:700});SP_CODES.forEach((s,i)=>wc_hand(ctx,s,bx+820,by+196+i*84,{size:42,col:blue}));}
// the codes on the printouts, ringed in pencil one by one and joined, each join with a question mark (u, 0 to 1); where each code sits
const SP_SPREAD=[[130,330,-0.04],[560,340,0.03],[990,326,-0.02],[1420,336,0.05]];
function sp_codeSpot(i){const [px,py,r]=SP_SPREAD[i],{w,h}=SP_SHEET,cw=[210,154,192,115][i],dx=34+cw/2-w/2,dy=SP_SHEET.code-12-h/2;
  return[px+w/2+dx*Math.cos(r)-dy*Math.sin(r),py+h/2+dx*Math.sin(r)+dy*Math.cos(r),cw/2+28];}
function sp_codeRings(ctx,u){if(u<=0)return;for(let i=0;i<4;i++){const [x,y,rx]=sp_codeSpot(i),p=clamp(u*4.6-i*1.1,0,1);if(p>0)wc_ring(ctx,x,y,rx,40,p,{col:WC_PENCIL,lw:3.5,seed:11+i});
    if(i<3){const [x2,y2,rx2]=sp_codeSpot(i+1),q=clamp(u*4.6-i*1.1-0.7,0,1);if(q<=0)continue;const ax=x+rx+4,bx=x2-rx2-4,mx=(ax+bx)/2;
      ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=3.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ax,y);for(let k=1;k<=12;k++){const v=k/12*q;
        ctx.lineTo(lerp(ax,bx,v),lerp(y,y2,v)-Math.sin(v*Math.PI)*46);}ctx.stroke();ctx.restore();
      if(q>0.8)wc_hand(ctx,"?",mx-8,(y+y2)/2-62,{size:44,col:WC_PENCIL,w:700,a:(q-0.8)/0.2});}}}

scene("question",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({board:wAt(sc,"ask","board"),some:wAt(sc,"answer","somewhere"),team:wAt(sc,"ask","risk team"),fails:wAt(sc,"ask","another bank"),
    every:wAt(sc,"answer","every business line"),names:wAt(sc,"answer","its own names"),same:wAt(sc,"answer","same customers"),
    add:wAt(sc,"monday","add it up"),trust:wAt(sc,"trust","which to trust"),put:wAt(sc,"trust","put them"),title:c.breath+1.7}));
  const mk=[[0,"2008 · a bank"]],D=SP_RK.desk,[sx,ss]=SP_RK.seat,sy=D.top+GV_SIT*ss,skinH=PEOPLE.spHead.skin,skinD=PEOPLE.spDep.skin;
  // the handover: he holds out the card from give, she takes it at swap, and brings it in to read from read
  const give=P.board-0.6,swap=P.board+0.45,read=swap+0.35;
  gv_shots(ctx,S,t,sc.dur,[
    // the risk floor, late: the news on the television, then the floor; someone from the board's office brings the question to the head of
    // risk's desk, and her team gathers round
    {at:0,place:"risk",keys:[[0,390,290,1.9],[2.2,960,560,1.08]],d:3.4,draw:(x,tt)=>{sp_tvNews(x,clamp(tt/5.5,0,1));
      const dep=gv_walk(tt,1.9,2060,1500,330),a1=gv_walk(tt,P.team-1.4,-160,250,360),a2=gv_walk(tt,P.team-1.0,-160,420,360);
      gv_walker(x,"spAn1",a1,1004,0.86,{t:tt,pose:a1.moving?null:"listen"});gv_walker(x,"spAn2",a2,1010,0.88,{t:tt,pose:a2.moving?null:"listen",flip:false});
      const gm=fin(tt,give,0.5),bk=fin(tt,swap+0.3,0.5),dPose=bk>0?["spGive","listen",bk]:["stand","spGive",gm];
      const up=fin(tt,dep.end-0.4,0.5),tk=fin(tt,give+0.2,0.5),rd=fin(tt,read,0.6),hPose=rd>0?["spTake","spReadOne",rd]:tk>0?["spLookUp","spTake",tk]:["write","spLookUp",up];
      gv_behind(x,"spHead",sx,D.top,ss,{t:tt,pose:hPose[0],pose2:hPose[1],mix:hPose[2],expr:tt>read+0.6?"concerned":"calm"});
      if(dep.moving)gv_walker(x,"spDep",dep,1012,0.9,{t:tt});else gv_walker(x,"spDep",dep,1012,0.9,{t:tt,pose:dPose[0],pose2:dPose[1],mix:dPose[2],flip:true});
      x.drawImage(gv_place("riskDesk"),0,0);sp_lampLight(x,1);
      // the card, in front of the desk's things, held at one end: hanging from his hand as he walks (pointing down), held out to her (pointing at her), passed, and read.
      // A plain card's back looks the same turned half round, so its turn is kept within a half turn as it changes hands.
      const card=(h,ang,s)=>[h[0]+Math.cos(ang)*52*s,h[1]+Math.sin(ang)*52*s],hh=sp_handAt("spHead",sx,sy,ss,hPose[0],hPose[1],hPose[2],false,1),hA=lerp(-0.1,-0.18,rd);
      if(tt<swap+0.15){const dh=dep.moving?sp_handAt("spDep",dep.x,1012-dep.bob,0.9,"stand",dep.swing>0?"walkA":"walkB",Math.abs(dep.swing),true,1)
            :sp_handAt("spDep",dep.x,1012,0.9,dPose[0],dPose[1],dPose[2],true,1),dA=lerp(Math.PI/2+0.1,Math.PI+0.08,dep.moving?0:gm),
          u=easeCam(clamp((tt-(swap-0.3))/0.45,0,1)),[ax,ay]=card(dh,dA,0.92),[bx,by]=card(hh,-0.1,0.97);
        sp_cardFree(x,lerp(ax,bx,u),lerp(ay,by,u),lerp(dA-Math.PI,-0.1,u),lerp(0.92,0.97,u),(u<0.6?[[dh[0],dh[1],skinD]]:[]).concat(u>0.4?[[hh[0],hh[1],skinH]]:[]));}
      else{const [bx,by]=card(hh,hA,0.97);sp_cardFree(x,bx,by,hA,0.97,[[hh[0],hh[1],skinH]]);}}},
    // the desk from above: the board's card, close; then a printout from each business line, each with its own code for the same customer
    {at:P.fails-0.3,place:"spread",keys:[[P.fails-0.3,960,196,2.2],[c.answer-0.5,960,520,1.0]],d:2.6,draw:(x,tt)=>{sp_cardOnDesk(x,960,196,-0.03);
      SP_SPREAD.forEach(([px,py,r],i)=>sp_printout(x,i,px,py,r,fin(tt,P.some-0.1+i*0.5,0.6),fin(tt,P.names+i*0.28,0.5)));
      sp_codeRings(x,clamp((tt-P.same+0.2)/1.6,0,1));
      wc_hand(x,"the same customer?",960,866,{size:46,col:WC_PENCIL,align:"center",p:clamp((tt-P.same-1.0)/0.9,0,1)});}},
    // the whiteboard: the business lines' sums, and the total, a red question mark; the desk calendar turns, Friday to Monday
    {at:c.monday-0.3,place:"board08",keys:[[c.monday-0.3,940,530,1.0],[c.monday+1.6,960,520,1.04]],d:2,draw:(x,tt)=>{
      sp_board(x,tt,{q:clamp((tt-P.add+0.1)/0.7,0,1)});const days=["Fri","Sat","Sun","Mon"],f=[c.monday+0.05,c.monday+0.65,c.monday+1.25];
      let i=0;f.forEach(ft=>{if(tt>=ft+0.4)i++;});const turning=f.findIndex(ft=>tt>=ft&&tt<ft+0.4);
      if(turning>=0)sp_calendar(x,days[turning],days[turning+1],(tt-f[turning])/0.4);else sp_calendar(x,days[i],days[i],0);}},
    // out through the window: the bank's one lit floor, then the city, and window after window lit late in the other towers
    {at:c.one-0.3,place:"city",keys:[[c.one-0.3,300,470,1.7],[c.one+0.2,960,540,1.0]],d:3.4,push:0,draw:(x,tt)=>{sp_lateWindows(x,clamp((tt-c.one-0.5)/(c.there-c.one-1.4),0,1));}},
    // the board again, closer: the last figure comes in, and the total is still a question; then a second figure for one line
    {at:c.there-0.3,place:"board08",keys:[[c.there-0.3,760,470,1.25],[P.put,750,480,1.22]],d:2,draw:(x,tt)=>{
      sp_board(x,tt,{q:1,full:clamp((tt-c.there-0.4)/0.6,0,1),doubt:P.trust-0.3});sp_calendar(x,"Mon","Mon",0);}},
    // the last light on the floor: she reads the question again, as the screens and the ceiling go dark, row by row, but for her lamp
    {at:c.breath-0.2,place:"risk",keys:[[c.breath-0.2,960,560,1.08],[c.breath+0.6,960,560,1.0]],d:2.4,draw:(x,tt)=>{sp_tvNews(x,1);
      gv_behind(x,"spHead",sx,D.top,ss,{t:tt,pose:"hold",carry:sp_cardBack,expr:"worried"});x.drawImage(gv_place("riskDesk"),0,0);sp_lampLight(x,1);sp_lightsOut(x,fin(tt,c.breath+0.1,1.6),1);}}]);
  sp_pill(ctx,t,mk,fin(t,0.5,0.6)*(1-fin(t,c.breath,0.4)));
  wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  gv_title(ctx,S,t,P.title,"The same problem, everywhere","why data governance exists","Prologue · data governance");});

// ---- 2 · Not a new problem: in the 1970s, departments share data, a new job looks after it, and in 1980 its people start meeting ----
// a ring binder, closed, held or passed: its cover, the spine on its left, a label; its middle at x, y, turned rot
function sp_binderFree(ctx,x,y,rot,col,s){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.fillStyle="rgba(60,40,30,0.22)";rr(ctx,-50,-62,108,132,6);ctx.fill();
  ctx.fillStyle=rgba(col,1);rr(ctx,-54,-66,108,132,6);ctx.fill();ctx.strokeStyle="rgba(58,54,66,0.7)";ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=rgba(wc_dim(col,0.3),1);ctx.fillRect(-54,-66,18,132);
  ctx.fillStyle="rgba(250,248,240,0.95)";ctx.fillRect(-20,-40,56,30);ctx.restore();}
scene("notnew",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({share:wAt(sc,"sharing","sharing data"),owns:wAt(sc,"questions","who owns"),see:wAt(sc,"questions","who may see"),
    admin:wAt(sc,"job","data administration"),dict:wAt(sc,"job","dictionary"),la:wAt(sc,"la","Los Angeles"),meet:wAt(sc,"la","started meeting"),share2:wAt(sc,"la","to share"),
    learned:wAt(sc,"la","learned"),dama:wAt(sc,"chapters","DAMA"),city:wAt(sc,"chapters","city after city"),same:wAt(sc,"alone","the same lessons"),them:wAt(sc,"together","learn them"),
    tog:wAt(sc,"together","together")}));
  const mk=[[0,"1970s"],[c.la-0.1,"Los Angeles · 1980"],[P.city-0.6,"1980s"]],L=SP_LA;
  // the meeting in Los Angeles: who stands at the back, at the chart and at the table; o.back and o.seat let a shot pose those standing at
  // the back and those at the table
  const meeting=(x,tt,o)=>{L.back.forEach(([bx,id],i)=>{const cup=i%2===1,bo=Object.assign({t:tt,pose:cup?"spCup":"listen",carry:cup?sp_cupHeld:null,flip:true,expr:o.expr||"calm"},o.back&&o.back(i,id,bx));
      person(x,id,bx,L.bf,L.bs,bo);sp_badge(x,id,bx,L.bf,L.bs,bo.flip);});
    const [cx,cf,cs]=L.chart,writing=tt>P.meet-0.5&&tt<P.learned+1.0;person(x,"spLa1",cx,cf,cs,{t:tt,pose:writing?"point":"listen",flip:writing,expr:o.expr||"calm"});sp_badge(x,"spLa1",cx,cf,cs,writing);
    L.seats.forEach(([sx,id],i)=>{const so=o.seat?o.seat(i,id,sx):{pose:"listen",flip:true};gv_behind(x,id,sx,L.table[2],L.s,Object.assign({t:tt,expr:o.expr||"calm"},so));});
    x.drawImage(gv_place("la80table"),0,0);sp_cardName(x);};
  gv_shots(ctx,S,t,sc.dur,[
    // the office floor: sales, accounts and shipping at their terminals; pencil lines run from each to the one computer they share, then
    // two questions go up on it, and they look up
    {at:0,place:"office70",keys:[[0,960,540,1.0],[c.questions+0.4,960,440,1.42]],d:2.4,draw:(x,tt)=>{sp_blink(x,tt);SP_70.desks.forEach(d=>sp_signName(x,d.sign[0],d.sign[1]));
      sp_slip(x,872,532,214,116,[252,224,118],-0.05,["who owns","this data?"],34,fin(tt,P.owns-0.15,0.5),301);sp_slip(x,1062,470,184,116,[246,178,190],0.05,["who may","see it?"],34,fin(tt,P.see-0.15,0.5),302);
      SP_70.desks.forEach((d,i)=>{const look=fin(tt,c.questions+0.4+i*0.25,0.7)*(i===2?0.7:1);gv_behind(x,d.id,d.seat[0],d.top,d.seat[1],{t:tt,pose:"spType",pose2:"spLookCab",mix:look,flip:d.term[2]>0});});
      SP_70.desks.forEach(d=>sp_termGlow(x,d,1));x.drawImage(gv_place("desks70"),0,0);sp_links70(x,clamp((tt-P.share+0.2)/1.8,0,1));}},
    // her office, from the corridor: she writes in the dictionary; then her door, and the job's name on it
    {at:c.job-0.3,place:"admin70",keys:[[c.job-0.3,900,520,1.08],[P.admin-0.8,640,470,1.3]],d:1.6,draw:(x,tt)=>{
      gv_behind(x,"spAdmin",SP_AD.seat[0],SP_AD.top,SP_AD.seat[1],{t:tt,pose:"write",nod:0.03*Math.sin(tt*2.2)});x.drawImage(gv_place("adminFront70"),0,0);sp_adminLamp(x,1);sp_doorName(x);}},
    // the dictionary, from above: she writes what a customer is
    {at:P.dict-0.4,place:"dict70",keys:[[P.dict-0.4,960,500,1.08],[P.dict+0.6,1210,470,1.42]],d:1.8,draw:(x,tt)=>{const ink=[36,56,130];
      wc_T(x,"Data dictionary",360,224,{w:700,size:44,f:"mono",col:WC_DARK});
      const L3=[["customer:",1040,470,52,P.dict+0.3,0.6],["has bought from us",1070,546,46,P.dict+1.0,1.0],["in the last 3 years",1070,614,46,P.dict+2.1,1.0]];let pen=null;
      L3.forEach(([s,lx,ly,sz,t0,d])=>{const p=clamp((tt-t0)/d,0,1);if(p<=0)return;wc_hand(x,s,lx,ly,{size:sz,col:ink,w:600,p});
        pen=[lx+tw(x,s.slice(0,Math.ceil(s.length*p)),sz,600),ly-sz*0.25];});
      sp_penHand(x,...(pen||[1040,470]),1.25);}},
    // Los Angeles at dusk, 1980: an office building, its upstairs room lit, palms against the sky
    {at:c.la-0.3,place:"laOut",keys:[[c.la-0.3,960,540,1.0],[c.la+0.3,700,560,1.25]],d:2.6},
    // inside, the meeting: what they've learned goes up on the flip chart, line by line; then the card on the table, close
    {at:P.meet-0.7,place:"la80",keys:[[P.meet-0.7,960,540,1.0],[P.dama-0.9,1205,700,1.62]],d:1.6,draw:(x,tt)=>{
      meeting(x,tt,{});sp_chart(x,[fin(tt,P.meet+0.3,1.1),fin(tt,P.share2+0.3,0.8),fin(tt,P.learned,0.8)]);}},
    // the chapters: a flyer for each new chapter's meeting, pinned up one after another
    {at:P.city-0.7,place:"notice80",keys:[[P.city-0.7,960,470,1.0],[P.city+2.5,960,480,1.04]],d:2,draw:(x,tt)=>{for(let i=0;i<6;i++)sp_flyer(x,i,fin(tt,P.city-0.25+i*0.34,0.45));}},
    // before that, each alone: three buildings at night, one lit window in each, someone writing the same lesson down
    {at:c.alone-0.3,place:"alone70",keys:[[c.alone-0.3,960,520,1.0]],d:2,push:0.03,draw:(x,tt)=>{SP_AL.forEach((a,i)=>{sp_aloneWindow(x,i,tt);const [wx,wy,ww]=a.win;
      sp_slip(x,wx+ww/2,wy-58,440,66,null,[-0.02,0.015,-0.01][i],["one meaning for each word"],30,fin(tt,P.same-0.2+i*0.35,0.5),311+i);});}},
    // and now together: two standing at the back hold up their binders, pass them across and swap
    {at:c.together-0.3,place:"la80",keys:[[c.together-0.3,1450,560,1.5],[P.tog+0.5,1440,570,1.56]],d:2,draw:(x,tt)=>{const sw=P.them-0.5,r=fin(tt,sw,0.45)*(1-fin(tt,sw+0.95,0.4)),
        m=easeCam(clamp((tt-sw-0.35)/0.6,0,1)),pair=[[3,"spLa5",false],[4,"spLa7",true]];
      meeting(x,tt,{expr:tt>P.tog?"smile":"calm",seat:i=>i===0?{pose:"write",flip:false,nod:0.03*Math.sin(tt*2)}:{pose:"listen",flip:true},
        back:i=>i===3||i===4?{pose:"spShowB",pose2:"spPassS",mix:r,flip:i===4,carry:null}:null});
      // each binder at its holder's hands: between them at the chest, in the right hand held out; they pass in the middle, one over the
      // other, and the holders' thumbs show on them
      const h=pair.map(([i,id,fl])=>{const bx=L.back[i][0],R_=sp_handAt(id,bx,L.bf,L.bs,"spShowB","spPassS",r,fl,1),L_=sp_handAt(id,bx,L.bf,L.bs,"spShowB","spPassS",r,fl,-1);
        return {id,R:R_,L:L_,c:[lerp((R_[0]+L_[0])/2,R_[0],r),lerp((R_[1]+L_[1])/2,R_[1],r)+lerp(6,-4,r)]};});
      [[1,0,10,[40,70,130],[0.06,-0.04]],[0,1,-28,[120,130,80],[-0.05,0.08]]].forEach(([a,b,arc,col,rot])=>{const p=h[a].c,q=h[b].c;
        sp_binderFree(x,lerp(p[0],q[0],m),lerp(p[1],q[1],m)+Math.sin(m*Math.PI)*arc,lerp(rot[0],rot[1],m),col,0.55);});
      h.forEach(q=>{const sk=PEOPLE[q.id].skin;for(const [p,on] of [[q.R,1],[q.L,1-r]])if(on>0.5){x.save();x.translate(p[0],p[1]-2);x.scale(0.58,0.58);ell(x,0,0,12,15);
        litFill(x,sk,-12,-15,12,15);seam(x,sk,0.3,1.2);x.restore();}});}},
    // from above: she copies a page from the binder she borrowed into her own
    {at:P.them+0.95,place:"copy80",keys:[[P.them+0.95,960,540,1.04],[P.them+1.15,1200,520,1.22]],d:2.6,draw:(x,tt)=>{let pen=null;
      SP_CP.lines.forEach(([lx,ly,w,head],i)=>{const p=clamp((tt-P.them-1.25-i*0.6)/0.52,0,1);if(p>0)pen=sp_scribble(x,lx,ly,w,p,331+i,head);});
      sp_penHand(x,...(pen||SP_CP.lines[0].slice(0,2)),1.25);}}]);
  sp_pill(ctx,t,mk,fin(t,0.4,0.6)*(1-gv_io(t,c.questions+0.3,c.job+0.25,0.4))*(1-gv_io(t,P.dama-0.4,P.city-0.6,0.4))*(1-fin(t,c.alone-0.4,0.4)));});

// ---- 3 · Someone signs: in 2002, a law makes the chief executive and the chief financial officer sign for the figures ----
scene("signs",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({execs:wAt(sc,"law","chief executives"),sign:wAt(sc,"law","sign for"),fig:wAt(sc,"law","figures"),
    ctrl:wAt(sc,"controls","the controls"),ans:wAt(sc,"top","answered")}));
  const K=SP_B2,sg=[["spCeo",P.sign-0.05,1.15],["spCfo",P.fig-0.05,1.1]];
  // the two at the table, the report in front of them
  const room=(x,tt)=>{K.seats.forEach(([sx,id],i)=>gv_behind(x,id,sx,K.top,K.s,{t:tt,pose:"listen",flip:i===1,nod:0.02*Math.sin(tt*1.3+i*2)}));
    x.drawImage(gv_place("board02table"),0,0);};
  gv_shots(ctx,S,t,sc.dur,[
    // the boardroom: the two who sign, the finance floor behind the glass
    {at:0,place:"board02",keys:[[0,960,540,1.0],[0.5,960,560,1.1]],d:6,draw:(x,tt)=>{sp_controls(x,0);room(x,tt);}},
    // the report's last page, from above: he signs, then she does
    {at:P.sign-0.45,place:"report02",keys:[[P.sign-0.45,950,480,1.04],[P.sign-0.25,940,470,1.26]],d:1.5,draw:(x,tt)=>sp_reportPage(x,tt,sg)},
    // the controls behind them: the binders on the finance floor light gold
    {at:sg[1][1]+1.15,place:"board02",keys:[[sg[1][1]+1.15,960,560,1.06],[P.ctrl-0.15,960,420,1.5]],d:2.2,draw:(x,tt)=>{sp_controls(x,fin(tt,P.ctrl,0.8));room(x,tt);}},
    // back to the page, what they certify and the two signatures, as the ink dries; their lines ruled in gold
    {at:c.top-0.45,place:"report02",keys:[[c.top-0.45,940,450,1.3],[c.top-0.25,930,420,1.42]],d:5,draw:(x,tt)=>sp_reportPage(x,tt,sg,{dry:fin(tt,c.top-0.45,4),gold:[fin(tt,P.ans,0.6),fin(tt,P.ans+0.4,0.6)]})}]);
  sp_pill(ctx,t,[[0,"United States · 2002"]],fin(t,0.4,0.6)*(1-fin(t,c.breath,0.4)));});

// ---- 4 · Written down: what the members had learned becomes a book; it draws the work as a wheel, held true by its centre, governance ----
// a note pinned beside the wheel: it springs in at t0, goes at o.out
function sp_note(x,tt,t0,cx,cy,lines,o){o=o||{};const a=fin(tt,t0,0.35)*(o.out==null?1:1-fin(tt,o.out,0.4));if(a<=0.01)return;const sz=30,
    w=Math.round(Math.max(...lines.map(l=>tw(x,l,sz,700)))+48),h=lines.length*(sz+12)+28,k=0.9+0.1*spring(fin(tt,t0,0.5));
  x.save();x.translate(cx,cy);x.scale(k,k);withA(x,a,()=>{wc_panel(x,-w/2,-h/2,w,h,{kind:"card",seed:w});
    lines.forEach((l,i)=>wc_T(x,l,0,-h/2+14+(i+0.8)*(sz+12),{w:700,size:sz,align:"center",col:WC_INK}));});x.restore();}
scene("written",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({members:wAt(sc,"dmbok","members"),know:wAt(sc,"dmbok","knowledge"),dm:wAt(sc,"dmbok","DMBOK"),
    arch:wAt(sc,"wheel","architecture"),mod:wAt(sc,"wheel","modelling"),sec:wAt(sc,"wheel","security"),qual:wAt(sc,"wheel","quality"),meta:wAt(sc,"wheel","metadata"),
    more:wAt(sc,"wheel","more"),hub:wAt(sc,"hub","hub"),gov:wAt(sc,"hub","governance"),fit:wAt(sc,"decide","fit"),bal:wAt(sc,"decide","balance"),
    auth:wAt(sc,"decide","authority"),part:wAt(sc,"guides","part"),agree:wAt(sc,"takes","agree"),shows:wAt(sc,"takes","shows"),
    draws:wAt(sc,"wheel","draws"),whl:wAt(sc,"wheel","wheel")}));
  const K=SP_SH,set=P.know-0.9,pg=P.dm+0.9,shut=P.shows-0.2,back=shut+1.0,out=P.agree-0.5,named=[P.arch,P.mod,0,P.sec,0,0,0,0,P.meta,P.qual],rest=[2,4,5,6,7],
    areaAt=k=>named[k]?named[k]-0.15:P.more-0.1+rest.indexOf(k)*0.16;
  gv_shots(ctx,S,t,sc.dur,[
    // the shelf: the binders of what the members had learned light as they're named; the book is set beside them
    {at:0,place:"shelf09",keys:[[0,960,540,1.0],[set+1.6,1160,546,1.42]],d:2.6,draw:(x,tt)=>{x.save();x.globalCompositeOperation="screen";
      SP_BINDERS.forEach(([bx,w,h],i)=>{const g=gv_io(tt,P.members-0.3+i*0.12,P.members+1.2+i*0.12,0.35);if(g>0)wc_glowAt(x,bx+w/2,K.top-h*0.55,h*0.62,[255,212,140],0.42*g);});x.restore();
      const u=easeCam(clamp((tt-set)/1.1,0,1));if(u<=0)return;const dy=(1-u)*640,k=1.06-0.06*spring(fin(tt,set+0.9,0.6));sp_book(x,K.books[0],K.top+dy,1,{k});
      const rel=fin(tt,set+1.25,0.9);if(rel<1){const hx=K.w/2*k,hy=K.top+dy-K.h*0.2*k,o=40*easeCam(clamp(rel*3,0,1)),dn=700*easeCam(rel);
        sp_holdHand(x,K.books[0]-hx-o,hy+dn,-1,0.85);sp_holdHand(x,K.books[0]+hx+o,hy+dn,1,0.85);}}},
    // the book opens: its wheel's two rings sketched in pencil as it "draws" it; the areas come in as they're named, uneven, until the
    // centre lights and holds them true; it turns once, evenly; the other guides, on the same ground or part of it; then all of it lit,
    // and the book closes
    {at:pg,place:"wheelpage",keys:[[pg,960,540,1.04],[pg+0.1,960,540,1.0]],d:1.6,draw:(x,tt)=>{const cu=Math.max(1-clamp((tt-pg-0.55)/0.9,0,1),clamp((tt-shut)/0.9,0,1));
      if(Math.sin(Math.PI/2*easeCam(cu))<0.86){sp_wheelGuide(x,clamp((tt-P.draws-0.2)/(P.whl-P.draws+0.5),0,1));sp_wheel(x,{area:k=>fin(tt,areaAt(k),0.5),off:1-spring(fin(tt,P.gov-0.05,1.0)),turn:TAU*easeCam(clamp((tt-P.bal+0.1)/2.0,0,1)),centre:fin(tt,P.hub-0.1,0.6),
        pulse:Math.min(1,gv_io(tt,P.auth-0.2,P.auth+1.0,0.4)+gv_io(tt,P.agree-0.3,99,0.6)),spokes:clamp((tt-P.gov+0.1)/0.9,0,1),
        spokeA:0.75+0.25*gv_io(tt,P.fit-0.1,P.fit+1.0,0.3),rim:clamp((tt-P.gov-0.3)/1.0,0,1),labels:1-gv_io(tt,P.bal-0.45,P.bal+2.05,0.3),
        ring:clamp((tt-c.guides+0.1)/1.4,0,1)*(1-fin(tt,out,0.4)),dim:gv_io(tt,c.guides-0.2,out,0.5),keep:k=>k===9?fin(tt,P.part-0.1,0.4):0,
        outlines:[[9,gv_io(tt,P.part-0.1,out,0.4)],["centre",gv_io(tt,P.part+1.2,out,0.4)]]});
      sp_note(x,tt,c.guides+0.15,1660,150,["DCAM","the same ground"],{out});sp_note(x,tt,P.part-0.1,262,150,["ISO 8000","data quality"],{out});
      sp_note(x,tt,P.part+1.2,1660,780,["ISO/IEC 38505","governing data"],{out});}sp_coverClose(x,cu);}},
    // closed, and back on the shelf beside the binders
    {at:back,place:"shelf09",keys:[[back,1160,546,1.42],[back+0.1,1020,540,1.08]],d:2.4,draw:x=>sp_book(x,K.books[0],K.top,1)}]);
  sp_pill(ctx,t,[[0,"2009"]],fin(t,0.4,0.6)*(1-fin(t,P.dm+0.3,0.5)));});

// ---- 5 · Governance first: the banks' regulators put governance first, a condition for all the rest; ten years on, two of thirty-one ----
scene("first",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({pr:wAt(sc,"principles","principles"),first:wAt(sc,"principles","first"),
    cond:wAt(sc,"principles","condition"),own:wAt(sc,"own","own"),risk:wAt(sc,"own","risk"),qual:wAt(sc,"own","quality"),two:wAt(sc,"ten","two"),
    thirty:wAt(sc,"ten","thirty-one"),met:wAt(sc,"ten","met"),under:wAt(sc,"programmes","underfunded"),narrow:wAt(sc,"programmes","narrow"),
    att:wAt(sc,"programmes","attention"),dec:wAt(sc,"takes","decisions")}));
  const K=SP_PR,{spine,y,w}=K,pg=P.pr-0.3,turn=c.own-0.85,tu=1.15,yr=c.ten-0.3,go=c.takes-0.3;
  // the four at the table, the principles in front of them
  const room=(x,tt)=>{SP_BS.seats.forEach(([sx,id],i)=>gv_behind(x,id,sx,SP_BS.top,SP_BS.s,{t:tt,pose:i===1?"spReadOne":"listen",flip:i>=2,nod:0.02*Math.sin(tt*1.2+i*2)}));
    x.drawImage(gv_place("basel13table"),0,0);};
  gv_shots(ctx,S,t,sc.dur,[
    // the regulators' room, high over the old town, the minster and the river
    {at:0,place:"basel13",keys:[[0,960,540,1.0],[0.3,960,520,1.1]],d:4.5,draw:room},
    // the principles: the list; the first lit gold, then gold from it to each of the others; the page turns to the second principle,
    // and one of its lines is written in, its owner and its quality lit
    {at:pg,place:"principles13",keys:[[pg,800,545,1.12],[c.own+0.1,650,470,1.42]],d:2.0,draw:(x,tt)=>{const u=clamp((tt-turn)/tu,0,1),th=Math.PI*easeCam(u),
        lst={a:fin(tt,pg+0.1,0.5),lit:fin(tt,P.first-0.1,0.6),run:clamp((tt-P.cond+0.1)/1.4,0,1)};
      if(u<=0){sp_prList(x,lst);x.drawImage(sp_prFace("gov",sp_prGov,1),spine,y);}
      else if(u<1){sp_prList(x,lst);x.drawImage(sp_prFace("next",sp_prNext,1),spine,y);sp_turn(x,th,sp_prFace("gov",sp_prGov,1),sp_prFace("arch",sp_prArch,-1));}
      else{x.drawImage(sp_prFace("arch",sp_prArch,-1),spine-w,y);x.drawImage(sp_prFace("next",sp_prNext,1),spine,y);
        sp_prOwn(x,fin(tt,turn+tu,0.45),fin(tt,P.own-0.05,0.5),fin(tt,P.qual-0.05,0.5),fin(tt,P.risk-0.05,0.5));}}},
    // ten years on, the same table: the progress report; the camera comes back to the two green towers and rests on them
    {at:yr,place:"report23",keys:[[yr,700,560,1.2],[P.under-0.6,960,540,1.02],[go,629,500,2.0]],d:2.2,
      draw:(x,tt)=>sp_report(x,tt,{at:yr,two:P.two,thirty:P.thirty,met:P.met,under:P.under,narrow:P.narrow,att:P.att,dec:P.dec,go})}]);
  sp_pill(ctx,t,[[0,"Basel · 2013"],[yr+0.2,"Basel · 2023"]],fin(t,0.4,0.6)*(1-fin(t,c.breath,0.4)));});

// ---- 6 · Should we?: a team asks whether it should, not only whether it can; an office answers a customer for the data it holds ----
// a nod: 0 to 1 and back, twice, from t0 (a pose's mix toward its looking-down twin)
const sp_nodMix=(t,t0)=>{const u=(t-t0)/0.5;return u<=0||u>=2?0:Math.pow(Math.sin(Math.PI*u),2);};
// a sheet passing over the front desk (the customer's letter, or the reply), and the two holding it: the giver holds it at the chest,
// holds it out from give, lets go at swap; the taker reaches for it from give, takes it, and from read holds it at the chest to read it.
// o.dir 1: the customer gives, -1: the privacy lead does; o.nod, when the reader nods; o.expr: [customer's, lead's] at each step
function sp_frontPeople(x,tt,o){const K=SP_FD,[cx,cf,cs]=K.cust,[lx,lf,ls]=K.priv,top=K.desk[1],skC=PEOPLE.spCust.skin,skP=PEOPLE.spPriv.skin,
    held=fin(tt,o.give,0.5),back=fin(tt,o.swap+0.2,0.5),reach=fin(tt,o.give+0.2,0.5),rd=fin(tt,o.read,0.5),nd=o.nod?sp_nodMix(tt,o.nod):0;
  let gPose=back>0?["spOffer","listen",back]:["spReadStand","spOffer",held],tPose=rd>0?["spOffer","spReadStand",rd]:["listen","spOffer",reach];
  if(nd>0&&rd>=1)tPose=["spReadStand","spReadNod",nd];
  const cP=o.dir>0?gPose:tPose,lP=o.dir>0?tPose:gPose,cCarry=(o.dir>0?held<=0:rd>=1)?sp_sheetBack:null,lCarry=(o.dir>0?rd>=1:held<=0)?sp_sheetBack:null;
  // the sheet between their hands: in the giver's from give, the taker's from swap, until it's held at the chest again; lifted a little
  // as it crosses the counter, and on the privacy lead's side, drawn behind the counter
  const hC=sp_handAt("spCust",cx,cf,cs,cP[0],cP[1],cP[2],false,1),hL=sp_handAt("spPriv",lx,lf,ls,lP[0],lP[1],lP[2],true,1),[gh,th,gs,ts]=o.dir>0?[hC,hL,skC,skP]:[hL,hC,skP,skC];
  let sheet=null,leadSide=false;
  if(held>0&&rd<1){const u=easeCam(clamp((tt-(o.swap-0.3))/0.45,0,1)),dx=o.dir*44,ax=gh[0]+dx,ay=gh[1]-8,bx=th[0]-dx,by=th[1]-8,lift=Math.sin(Math.PI*u)*26;
    leadSide=o.dir>0?u>=0.5:u<0.5;
    sheet=()=>sp_sheetHeld(x,lerp(ax,bx,u),lerp(ay,by,u)-lift,o.dir*0.08*(1-2*u),1.2,(u<0.6?[[gh[0],gh[1]-lift*(1-u),gs]]:[]).concat(u>0.4?[[th[0],th[1]-lift*u,ts]]:[]));}
  sp_behindAt(x,"spPriv",lx,top,lf,ls,{t:tt,pose:lP[0],pose2:lP[1],mix:lP[2],flip:true,expr:o.lexpr||"calm",carry:lCarry});
  if(sheet&&leadSide)sheet();
  x.drawImage(gv_place("front18desk"),0,0);
  person(x,"spCust",cx,cf,cs,{t:tt,pose:cP[0],pose2:cP[1],mix:cP[2],expr:o.cexpr||"calm",carry:cCarry});
  if(sheet&&!leadSide)sheet();}
scene("should",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({data:wAt(sc,"grew","data"),q:wAt(sc,"grew","questions"),second:wAt(sc,"ethics","second"),
    eth:wAt(sc,"ethics","ethics"),not:wAt(sc,"ethics","not only"),can:wAt(sc,"ethics","can"),should:wAt(sc,"ethics","should"),answer:wAt(sc,"law","answer"),
    pers:wAt(sc,"law","personal"),hold:wAt(sc,"law","hold"),prove:wAt(sc,"law","prove"),people:wAt(sc,"people","people")}));
  const K=SP_TR,[px,pf,ps]=K.stand,top=K.table[1],KS=SP_SH,sh=c.ethics-0.45,set=P.second-0.95,back=P.not+0.2,fd=c.law-0.3,dk=fd+2.15,slide=P.hold-0.35,fd2=c.people-0.75;
  // the team room: the one at the board, and the three at the table; pp, the standing one's pose [pose, pose2, mix] and expression;
  // sp, each seated one's
  const room=(x,tt,pp,sp)=>{person(x,"spT2",px,pf,ps,{t:tt,pose:pp[0],pose2:pp[1],mix:pp[2],flip:true,expr:pp[3]||"calm"});
    K.seats.forEach(([sx,id],i)=>{const s=sp[i];sp_seated(x,id,sx,top,K.s,{t:tt+i*1.3,pose:s[0],pose2:s[1],mix:s[2],expr:s[3]||"calm"});});
    x.drawImage(gv_place("team17table"),0,0);};
  gv_shots(ctx,S,t,sc.dur,[
    // close on the proposal: customers' locations multiply on its map as data grows, and its question comes in; back from it to the team
    {at:0,place:"team17",keys:[[0,430,400,1.6],[P.q-0.4,1000,560,1.04]],d:1.8,draw:(x,tt)=>{
      sp_mapDots(x,SP_DOTS.length*Math.pow(clamp((tt-P.data+0.1)/2.9,0,1),1.7),clamp((tt-P.q)/1.0,0,1));sp_proposal(x,fin(tt,P.q-0.15,1.0));
      room(x,tt,["listen","spPointUp",fin(tt,0.7,0.7),"smile"],[["spSitL"],["spSitL"],["spSitL"]]);}},
    // the shelf: the second edition set beside the first, a tab standing out of it, "ethics", lit gold
    {at:sh,place:"shelf09",keys:[[sh,1240,520,1.12],[set+1.2,1335,470,1.42]],d:2.0,draw:(x,tt)=>{sp_book(x,KS.books[0],KS.top,1);
      const u=easeCam(clamp((tt-set)/1.1,0,1));if(u<=0)return;const dy=(1-u)*640,k=1.06-0.06*spring(fin(tt,set+0.9,0.6));
      x.save();x.translate(KS.books[1],KS.top+dy);x.scale(k,k);sp_bookTab(x,0,0,"ethics",fin(tt,P.eth-0.15,0.5),40);x.restore();sp_book(x,KS.books[1],KS.top+dy,2,{k});
      const rel=fin(tt,set+1.25,0.9);if(rel<1){const hx=KS.w/2*k,hy=KS.top+dy-KS.h*0.2*k,o=40*easeCam(clamp(rel*3,0,1)),dn=700*easeCam(rel);
        sp_holdHand(x,KS.books[1]-hx-o,hy+dn,-1,0.85);sp_holdHand(x,KS.books[1]+hx+o,hy+dn,1,0.85);}}},
    // the team again, closer, the proposal's words out of the frame: she turns to them, they nod, we can; then one of them raises a
    // hand, should we?, and the room goes still
    {at:back,place:"team17",keys:[[back,1310,620,1.574],[back+0.3,1310,600,1.6]],d:2.6,push:0,draw:(x,tt)=>{sp_mapDots(x,SP_DOTS.length,1);sp_proposal(x,1);
      const pitch=fin(tt,back+0.25,0.6),still=fin(tt,P.should-0.25,0.6),ask=fin(tt,P.should-0.45,0.4),turn=fin(tt,P.should+0.1,0.5),
        n1=sp_nodMix(tt,P.can-0.1),n4=sp_nodMix(tt,P.can+0.05),nP=sp_nodMix(tt,P.can+0.15),glad=tt>P.can-0.3&&tt<P.should-0.1?"smile":"calm";
      const pp=still>0?["spPitch","spBackR",still,"calm"]:nP>0?["spPitch","spPitchNod",nP,"smile"]:["spPointUp","spPitch",pitch,"smile"];
      room(x,tt,pp,[turn>0?["spSitL","spSitR",turn]:["spSitL","spSitLNod",n1,glad],["spSitL","spAskUp",ask],["spSitL","spSitLNod",n4,glad]]);
      const b=fin(tt,P.should-0.15,0.5);if(b>0)gv_say(x,1300,340,["We can.","Should we?"],1476,524,{size:38,k:lerp(0.6,1,spring(b)),a:clamp(b*3,0,1)});}},
    // Europe, 2018: a customer brings a letter to an office's front desk, and its privacy lead takes it
    {at:fd,place:"front18",keys:[[fd,900,560,1.04],[fd+0.3,880,600,1.16]],d:2.4,draw:(x,tt)=>sp_frontPeople(x,tt,{dir:1,give:fd+0.55,swap:fd+1.3,read:fd+1.65,
      cexpr:"concerned",lexpr:"calm"})},
    // the counter from above: the letter; the office's register opens at its record of processing; the customer's rows light; a reply
    // comes, the rows are copied onto it, and it's stamped
    {at:dk,place:"desk18",keys:[[dk,880,540,1.07],[dk+0.3,960,540,1.0]],d:2.6,draw:(x,tt)=>{const d=fin(tt,slide,0.6),open=clamp((tt-P.answer+0.1)/0.6,0,1);
      sp_letterOpen(x,d<=0?1:d<1?0.45:0);const [rx,ry,rw]=SP_DK.reg;let r=null;
      if(open>0){r=gv_register(x,rx,ry,rw,{title:SP_ROP.title,cols:SP_ROP.cols,rows:SP_ROP.rows});sp_ropLight(x,r,clamp((tt-P.pers+0.25)/0.8,0,1));}
      sp_regCover(x,open);if(r)sp_reply(x,r,d,[0,1,2,3].map(i=>clamp((tt-slide-0.45-0.18*i)/0.45,0,1)),fin(tt,P.prove-0.08,0.35));}},
    // the reply handed over the counter; the customer reads it, and nods
    {at:fd2,place:"front18",keys:[[fd2,900,560,1.04],[fd2+1.3,690,610,1.42]],d:2.4,draw:(x,tt)=>sp_frontPeople(x,tt,{dir:-1,give:fd2+0.4,swap:fd2+1.0,read:fd2+1.35,
      nod:P.people-0.1,cexpr:tt>P.people-0.4?"smile":"calm",lexpr:tt>fd2+0.3?"smile":"calm"})}]);
  sp_pill(ctx,t,[[0,"2017"],[fd+0.2,"Europe · 2018"]],fin(t,0.4,0.6)*(1-fin(t,c.breath,0.4)));});

// ---- 7 · Machines that learn: a model learns whatever its examples show it; a team asks where the data came from and who decided they
// could use it; the DMBOK's revision adds AI; Europe's AI law asks for data governance; the third edition is being written ----
scene("machines",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({what:wAt(sc,"learn","whatever"),where:wAt(sc,"ask","where"),who:wAt(sc,"ask","who"),
    rev:wAt(sc,"revision","revision"),ai:wAt(sc,"revision","AI"),gov:wAt(sc,"act","governance"),third:wAt(sc,"third","third"),
    notes:["AI governance","data ethics","sustainability"].map(w=>wAt(sc,"third",w)),living:wAt(sc,"living","living"),y27:wAt(sc,"planned","twenty")}));
  const KS=SP_SH,B=SP_SH4.books,[dx0,dw,dh]=SP_SH4.draft,tB=c.ask-0.55,tC=c.revision-0.45,tD=c.act-0.45,tE=c.third-0.5,set=P.rev-0.3,G=P.gov-0.15,dset=P.third-0.1,
    // when each example lands on the pile: the fifth, the wrong one, on "whatever"
    L=[0.65,1.1,1.55,2.0,P.what-0.2,P.what+0.75,P.what+1.2];
  gv_shots(ctx,S,t,sc.dur,[
    // the training table from above: each example taken from the box and laid on the pile, the notebook copying it, the wrong one too
    {at:0,place:"desk24",keys:[[0,940,540,1.0],[1.2,1000,540,1.04]],d:3.0,draw:(x,tt)=>{L.forEach((l,i)=>{const u=clamp((tt-(l-0.42))/0.42,0,1);if(u<=0)return;
      const e=easeCam(u),[px,py,pr]=sp_pile(i),sx=260+((i*97)%380),sy=330+((i*53)%140),top=u>=1&&(i===L.length-1||tt<L[i+1]-0.42);
      sp_photo(x,lerp(sx,px,e),lerp(sy,py,e)-Math.sin(Math.PI*e)*70,lerp(pr+(i%2?0.3:-0.3),pr,e),lerp(0.62,1.12,e),SP_EX[i],1,!top);
      sp_copy(x,i,clamp((tt-(l+0.08))/0.5,0,1));});}},
    // the team at their table: one lifts the box and asks where the data came from; another asks who decided they could use it
    {at:tB,place:"team24",keys:[[tB,1000,560,1.06],[tB+0.4,1080,520,1.16]],d:2.6,draw:(x,tt)=>{const reach=fin(tt,tB+0.25,0.5),lift=clamp((tt-(tB+0.8))/0.6,0,1),
        turn=fin(tt,P.who-0.2,0.5),ask=fin(tt,P.who-0.35,0.45),worry=tt>P.where-0.4;
      const p3=turn>0?["spBoxUp","spBoxUpR",turn,"concerned"]:lift>0?["spBoxRest","spBoxUp",easeCam(lift),worry?"concerned":"calm"]:["stand","spBoxRest",reach,"calm"];
      sp_team24(x,tt,{p:{spMl1:["spEyesR","spEyesR",0,"calm"],spMl3:p3,spMl2:["spEyesR","spAskOpen",ask,tt>P.who-0.4?"concerned":"calm",true]},hold:reach,lift,
        rot:lerp(-0.04,0.03,turn)*easeCam(lift)});
      const b1=fin(tt,P.where-0.15,0.5),b2=fin(tt,P.who-0.15,0.5);
      if(b1>0)gv_say(x,640,300,["Where did this","data come from?"],930,486,{size:38,k:lerp(0.6,1,spring(b1)),a:clamp(b1*3,0,1)});
      if(b2>0)gv_say(x,1240,300,["Who decided","we could use it?"],1372,486,{size:38,k:lerp(0.6,1,spring(b2)),a:clamp(b2*3,0,1)});}},
    // the shelf in 2024: the revision set beside the other two, a new tab standing out of it, "AI", lit gold
    {at:tC,place:"shelf24",keys:[[tC,740,540,1.02],[set+1.2,920,470,1.32]],d:2.0,draw:(x,tt)=>{sp_book(x,B[0],KS.top,1);sp_bookTab(x,B[1],KS.top,"ethics",0,40);sp_book(x,B[1],KS.top,2);
      const u=easeCam(clamp((tt-set)/1.1,0,1));if(u<=0)return;const dy=(1-u)*640,k=1.06-0.06*spring(fin(tt,set+0.9,0.6));
      x.save();x.translate(B[2],KS.top+dy);x.scale(k,k);sp_bookTab(x,0,0,"AI",fin(tt,P.ai-0.15,0.5),70);x.restore();sp_book(x,B[2],KS.top+dy,3,{k});
      const rel=fin(tt,set+1.25,0.9);if(rel<1){const hx=KS.w/2*k,hy=KS.top+dy-KS.h*0.2*k,o=40*easeCam(clamp(rel*3,0,1)),dn=700*easeCam(rel);
        sp_holdHand(x,B[2]-hx-o,hy+dn,-1,0.85);sp_holdHand(x,B[2]+hx+o,hy+dn,1,0.85);}}},
    // Europe, 2024: the AI law, open at Article 10, its title lit gold by a highlighter
    {at:tD,place:"act24",keys:[[tD,960,540,1.0],[tD+0.4,960,440,1.12]],d:2.4,draw:(x,tt)=>{const lit=easeCam(clamp((tt-G)/0.9,0,1));sp_actWords(x,lit);
      const ein=easeCam(clamp((tt-(G-0.9))/0.8,0,1)),eout=easeCam(clamp((tt-(G+1.1))/0.9,0,1)),off=(1-ein)+eout;
      if(off<1.4){const [tx,ty]=sp_actTip(x,lit);sp_highlighter(x,tx+off*760,ty+off*560,1);}}},
    // now: the third edition's draft set beside them, leaning on them; its new sections stuck on it one by one; its pages lift, as if it's
    // still being written; a tag, planned for 2027
    {at:tE,place:"shelf24",keys:[[tE,820,540,1.0],[tE+1.0,1300,560,1.55],[P.living-0.7,1180,545,1.3],[P.y27-0.7,1300,560,1.5]],d:1.8,draw:(x,tt,cam)=>{
      // a book whose words the frame's left edge cuts keeps them as decoration
      const left=cam.x-960/cam.z,cut=(bx,half)=>left>bx-half&&left<bx+half;
      sp_book(x,B[0],KS.top,1,{deco:cut(B[0]+11,160)});sp_bookTab(x,B[1],KS.top,"ethics",0,40,cut(B[1]+112,80));sp_book(x,B[1],KS.top,2,{deco:cut(B[1]+11,160)});
      sp_bookTab(x,B[2],KS.top,"AI",0,70,cut(B[2]+112,50));sp_book(x,B[2],KS.top,3,{deco:cut(B[2]+11,160)});
      const u=easeCam(clamp((tt-dset)/1.1,0,1));if(u<=0)return;const dy=(1-u)*700,rel=clamp((tt-(dset+1.15))/0.5,0,1),lift=Math.sin(Math.PI*clamp((tt-(P.living-0.3))/2.6,0,1));
      sp_draft(x,{y:-dy,lean:easeCam(clamp((tt-(dset+1.15))/0.6,0,1)),notes:P.notes.map(n=>fin(tt,n-0.15,0.45)),lift});sp_tag(x,clamp((tt-(P.y27-0.25))/1.6,0,1));
      if(rel<1){const hy=KS.top+dy-dh*0.3,o=60*easeCam(clamp(rel*3,0,1)),dn=900*rel*rel;sp_holdHand(x,dx0-o,hy+dn,-1,0.8);sp_holdHand(x,dx0+dw+o,hy+dn,1,0.8);}}}]);
  sp_pill(ctx,t,[[0,"2024"],[tD+0.2,"Europe · 2024"],[tE+0.2,"Now"]],fin(t,0.4,0.6)*(1-fin(t,c.breath,0.4)));});

// ---- 8 · Still at the centre: each era asked the same question; the book grows, governance stays at its centre; today, at a university, a
// new data governance lead is about to meet it ----
scene("centre",(ctx,S,t,sc)=>{const c=sc.cues,P=sp_once(sc,"P",()=>({q:wAt(sc,"because","question"),y80:wAt(sc,"every","nineteen"),y08:wAt(sc,"every","two thousand"),sys:wAt(sc,"every","every"),
    who:wAt(sc,"every","who decides"),dec:wAt(sc,"every","decides"),ans:wAt(sc,"every","answers"),book:wAt(sc,"grows","book"),gov:wAt(sc,"grows","governance"),
    centre:wAt(sc,"grows","centre"),lead:wAt(sc,"today","lead"),same:wAt(sc,"today","same"),end:c.breath+1.3}));
  const bd=c.because-0.2,g2=c.grows-0.45,pick=P.book-0.2,op=P.gov-0.85,cp=c.today-0.45,of=P.lead-1.25;
  gv_shots(ctx,S,t,sc.dur,[
    // the shelf as the last chapter left it, close on the draft (its camera, closed in by its push); back from it to all of it: the editions, the draft leaning on the
    // newest, its tag
    {at:0,place:"shelf24",keys:[[0,1300,560,1.5375],[0.9,1000,540,1.08]],d:2.4,draw:(x,tt,cam)=>sp_shelfAll(x,cam)},
    // a board: the question pinned up, a question mark; a pencil sketch of each time it was asked, pinned above it as it's named, a thread
    // from it to the question; then the question's words, as they're said
    {at:bd,place:"board26",keys:[[bd,960,665,1.3],[c.every-1.2,960,500,1.12]],d:1.6,draw:(x,tt)=>{const w=[P.y80,P.y08,P.sys];
      w.forEach((wi,i)=>sp_sketchSheet(x,i,fin(tt,wi-0.2,0.5)));sp_threads(x,w.map(wi=>clamp((tt-(wi+0.25))/0.6,0,1)));
      sp_question(x,fin(tt,P.q-0.15,0.5),fin(tt,P.dec-0.1,0.4),fin(tt,P.ans-0.15,0.4));}},
    // the shelf again: two hands take the newest copy from it; the draft, its prop gone, settles upright
    {at:g2,place:"shelf24",keys:[[g2,820,540,1.02],[pick+0.6,1040,520,1.2]],d:2.0,draw:(x,tt,cam)=>sp_shelfAll(x,cam,{take:clamp((tt-pick)/1.0,0,1)})},
    // it opens at its wheel: every area in its place round the centre, governance, which lights gold, its spokes running out to each
    {at:op,place:"wheelpage",keys:[[op,960,540,1.04],[op+0.1,960,520,1.0]],d:2.4,draw:(x,tt)=>{const cu=1-clamp((tt-op-0.55)/0.9,0,1);
      if(Math.sin(Math.PI/2*easeCam(cu))<0.86)sp_wheel(x,{area:()=>1,rim:1,centre:fin(tt,P.gov+0.1,0.6),pulse:gv_io(tt,P.centre-0.2,P.centre+1.2,0.4),
        spokes:clamp((tt-P.gov)/0.9,0,1),spokeA:0.9});
      sp_coverClose(x,cu,3);}},
    // the university, in the morning
    {at:cp,place:"campus",keys:[[cp,1200,580,1.2],[of,1300,560,1.3]],d:2.6},
    // Yusuf's office, before he comes: the newest copy is set down on his desk; the shelf of policies; the light under the door, and
    // footsteps
    {at:of,place:"office24",keys:[[of,900,560,1.5],[of+1.8,960,540,1.02]],d:2.0,draw:(x,tt)=>{
      sp_deskBook(x,clamp((tt-of-0.15)/1.0,0,1),fin(tt,of+1.2,0.6));sp_nameCard(x,330,640,"Yusuf Demir","data governance lead",gv_io(tt,P.lead-0.1,P.end-0.3,0.4));
      sp_tagAt(x,tt,Math.max(P.same-0.2,of+3.5),null,1621,290,"34 data policies");sp_doorLight(x,fin(tt,c.breath-0.4,0.8),clamp((tt-c.breath-0.2)/1.4,0,1));}}]);
  sp_pill(ctx,t,[[0,"Today"]],fin(t,0.4,0.6)*(1-fin(t,P.end,0.4)));
  // the end: the title, and the film that comes next
  gv_end(ctx,S,t,P.end,"The same problem, everywhere",null,"Prologue");
  if(t>P.end+1.2)withA(ctx,fin(t,P.end+1.4,0.8),()=>wc_tag(ctx,960,780,"Next: Off the shelf",{align:"center",size:30,w:600}));
  wc_paperOver(ctx,S);});

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

/* ===== The data governance series: what the films need before they start, and the video's finishing pass =====
   Loaded after the engine, so its prepAssets is the one the engine calls: the fonts and the tools' logos, then the paper and the
   pigment's grain of the master data series' watercolour (its wash.js), then each place the film paints (WC_PLACES, in the film's own
   pictures). The rendered video and the checks paint every place before they start; the site's player paints the first, then the
   others one by one while the film plays, so it starts quickly. The same as the master data series' post.js, with the logos, but
   each of the others waits until the page is idle (or a second has passed): back to back, the prologue's 38 places held the
   page for seconds at a time on a slow machine, so a click on "Watch again" landed late and the film had run on.
   Then, for the video only (tools/render.py calls renderAt), motion blur: each video frame is the average of MB moments across a third
   of a frame (a 126-degree shutter), so movement reads as filmed. No glow: it would wash out the paper. No film grain: the paper is
   the grain. */
async function prepAssets(){await fontsReady3();await loadLogos();wc_prep();const ks=typeof WC_PLACES!=="undefined"?Object.keys(WC_PLACES):[];
  if(window.__RENDER__){ks.forEach(gv_place);return;}
  if(ks.length)gv_place(ks[0]);let i=1;const idle=f=>window.requestIdleCallback?requestIdleCallback(f,{timeout:1000}):setTimeout(f,60);
  const next=()=>{if(i>=ks.length)return;gv_place(ks[i++]);idle(next);};setTimeout(()=>idle(next),200);}
if(window.__RENDER__){(function(){const MB=8,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    return out.toDataURL("image/jpeg",q||0.9);};})();}
