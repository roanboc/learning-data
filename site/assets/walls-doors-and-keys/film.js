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

// Walls, doors and keys, the film after No secret to lose in Locks before the data, the first series of Data protection and privacy. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years in words, a title read without its question mark). The few longer stops are in breath.js.
const NARR={
"gates":{"name":"Few gates","lead":1.6,"tail":0.6,"vo":[
 {"id":"ragusa","gap":0.8,"text":"Ragusa, on the Adriatic coast, in the 1370s.","say":"Ragusa, on the Adriatic coast, in the thirteen-seventies."},
 {"id":"today","gap":0.8,"text":"Today it's Dubrovnik, in Croatia."},
 {"id":"republic","gap":0.8,"text":"Then, it's a small republic of merchants, behind high stone walls."},
 {"id":"trade","gap":0.8,"text":"It lives by trade, and its ships sail the whole Mediterranean."},
 {"id":"gates","gap":0.8,"text":"Sailors, merchants and goods come in every day, through only a few gates."},
 {"id":"more","gap":0.8,"text":"But ships can bring more than goods."},
 {"id":"plague","gap":0.8,"text":"In 1348, they brought the plague: a sickness that spread fast, and killed within days.","say":"In thirteen forty-eight, they brought the plague: a sickness that spread fast, and killed within days."},
 {"id":"thousands","gap":0.8,"text":"It killed thousands in the city, and kept coming back."},
 {"id":"tell","gap":0.8,"text":"At the gate, nobody could tell a sick traveller from a well one."},
 {"id":"shut","gap":0.8,"text":"Shut the port, and the city loses its living."},
 {"id":"open","gap":0.8,"text":"Leave it open, and the sickness walks in, to every family behind the walls."},
 {"id":"change","gap":0.8,"text":"Something has to change."}
]},
"apart":{"name":"A month apart","lead":1.2,"tail":0.6,"vo":[
 {"id":"council","gap":0.8,"text":"On 27 July 1377, the Great Council, the nobles who made the city's laws, passed a new one.","say":"On the twenty-seventh of July, thirteen seventy-seven, the Great Council, the nobles who made the city's laws, passed a new one."},
 {"id":"month","gap":0.8,"text":"Anyone coming from a place with plague must first spend a month apart: on the islet of Mrkan, or in the town of Cavtat, down the coast."},
 {"id":"then","gap":0.8,"text":"Only then may they enter the city."},
 {"id":"noone","gap":0.8,"text":"No one from the city may go to them: whoever does, stays the month too."},
 {"id":"officers","gap":0.8,"text":"Later, health officers watch every ship and every gate."},
 {"id":"port","gap":0.8,"text":"The port stays open, and the city keeps its living."},
 {"id":"island","gap":0.8,"text":"When the sickness comes now, it's held on an island, not let loose in the streets."},
 {"id":"first","gap":0.8,"text":"Ragusa is the first city known to have made it a law."},
 {"id":"forty","gap":0.8,"text":"Other ports followed, and the wait grew to forty days: the word quarantine comes from the Italian for forty."},
 {"id":"same","gap":0.8,"text":"The university's data has the same problem: people and jobs must reach it every day, and whoever breaks in shouldn't reach it all."},
 {"id":"needs","gap":0.8,"text":"It needs what Ragusa had: a few doors, each with a rule, and a place apart for what isn't trusted yet."}
]},
"inside":{"name":"If someone got in","lead":1.0,"tail":0.6,"vo":[
 {"id":"token","gap":0.8,"text":"At the university, the nightly job no longer carries Jun's token."},
 {"id":"asks","gap":0.8,"text":"But Sam Okafor, who runs the data platform, asks what an attacker would: if someone did get in, how far could they go?"},
 {"id":"door","gap":0.8,"text":"Today, the platform's door is on the open internet: anyone, anywhere, can reach it."},
 {"id":"one","gap":0.8,"text":"Inside, one workspace holds people's experiments and the nightly job's real records."},
 {"id":"areas","gap":0.8,"text":"From there, every area's data is in reach: the registrar's records, learning, planning, HR and finance."},
 {"id":"files","gap":0.8,"text":"A way runs straight to the files in storage, past the catalog that checks who may read what."},
 {"id":"out","gap":0.8,"text":"Data can be sent anywhere."},
 {"id":"backups","gap":0.8,"text":"The backups sit beside the data, where any admin can delete them."},
 {"id":"key","gap":0.8,"text":"And the cloud provider keeps the data's key, which the university can't take back."},
 {"id":"grew","gap":0.8,"text":"Nobody chose this: the platform started small, and grew."}
]},
"who":{"name":"Who secures what","lead":1.0,"tail":0.6,"vo":[
 {"id":"writes","gap":0.8,"text":"First, Sam writes down who secures what."},
 {"id":"cloud","gap":0.8,"text":"The cloud provider secures its buildings, its machines, and the network between them."},
 {"id":"makers","gap":0.8,"text":"The platform's makers secure its software, and how it checks every request."},
 {"id":"rest","gap":0.8,"text":"The university secures the rest: who gets in, what each may do, its settings, its keys and its copies."},
 {"id":"contract","gap":0.8,"text":"Whatever the contract says, the data is the university's to protect, and the walls are the university's to draw."},
 {"id":"map","gap":0.8,"text":"They follow the areas on the university's map, each with the owner Who decides wrote down."},
 {"id":"trusted","gap":0.8,"text":"A wall doesn't make anyone inside it trusted: every request is still checked, as Who is it, really? showed.","say":"A wall doesn't make anyone inside it trusted: every request is still checked, as Who is it really showed."},
 {"id":"small","gap":0.8,"text":"But walls keep the ways in few and the rooms small, so a mistake, or an intruder, stays where it started."}
]},
"doors":{"name":"Few doors","lead":1.0,"tail":0.6,"vo":[
 {"id":"then","gap":0.8,"text":"Then, the doors."},
 {"id":"internet","gap":0.8,"text":"The platform's door comes off the open internet: people and jobs reach it only by a private path, from the university's own network."},
 {"id":"storage","gap":0.8,"text":"The platform reaches the storage by a private path too."},
 {"id":"out","gap":0.8,"text":"And the way out is watched: data may leave only for places on a short list."},
 {"id":"files","gap":0.8,"text":"Storage keeps files, and knows nothing of who may see which column: no masks, no rules."},
 {"id":"catalog","gap":0.8,"text":"So the catalog becomes the files' only door: it checks every request, and applies every rule on the way."},
 {"id":"back","gap":0.8,"text":"The back door, straight to the files, stays shut."},
 {"id":"admin","gap":0.8,"text":"Only an admin account, switched on to read the storage, opens it, as Power you switch on shows."},
 {"id":"like","gap":0.8,"text":"Like Ragusa's walls: a few gates, and at each one, a rule."}
]},
"rooms":{"name":"Rooms apart","lead":1.0,"tail":0.6,"vo":[
 {"id":"three","gap":0.8,"text":"Next, one workspace becomes three: development, test and production."},
 {"id":"try","gap":0.8,"text":"In development, people try new things; in test, a change is tried as it will run."},
 {"id":"prod","gap":0.8,"text":"Production holds the real records, and runs the nightly load."},
 {"id":"own","gap":0.8,"text":"Each reaches only its own data."},
 {"id":"masked","gap":0.8,"text":"Development and test get made-up or masked data, never a copy of production's."},
 {"id":"mistake","gap":0.8,"text":"So a mistake in development stays there, and an intruder there finds no real records."},
 {"id":"path","gap":0.8,"text":"A change moves one way, along one reviewed path, which From a branch to production builds."},
 {"id":"islet","gap":0.8,"text":"Like the islet off Ragusa: what isn't trusted yet waits apart, and comes in only through the gate, after the wait."}
]},
"keys":{"name":"Keys you can see","lead":1.0,"tail":0.6,"vo":[
 {"id":"locks","gap":0.8,"text":"Now, the locks themselves."},
 {"id":"encrypted","gap":0.8,"text":"The data is kept encrypted, on disk and on the move: unreadable without its key."},
 {"id":"who","gap":0.8,"text":"So what matters is who holds the key."},
 {"id":"until","gap":0.8,"text":"Until now, the cloud provider did."},
 {"id":"own","gap":0.8,"text":"Now it's the university's own, kept by its security team in a vault of its own."},
 {"id":"use","gap":0.8,"text":"The platform may use it, but never take it out, and those who run the platform can't delete it."},
 {"id":"back","gap":0.8,"text":"The security team can take it back: then nobody can read the data, not even the cloud provider."},
 {"id":"lose","gap":0.8,"text":"Lose that key, and the data is lost with it: so every use is recorded, and a deleted key is kept ninety days, which nobody can cut short."},
 {"id":"rector","gap":0.8,"text":"In Ragusa, for centuries, the gates were shut each evening, and their keys taken to the rector, the head of the republic, until morning."},
 {"id":"knew","gap":0.8,"text":"Everyone knew who held them."}
]},
"copies":{"name":"Copies nobody can delete","lead":1.0,"tail":0.6,"vo":[
 {"id":"last","gap":0.8,"text":"Last, the copies."},
 {"id":"first","gap":0.8,"text":"An attacker who gets in often deletes the backups first, then locks the data, and asks for money to unlock it."},
 {"id":"night","gap":0.8,"text":"So every night, a copy of production's data goes to a place apart, with admins of its own."},
 {"id":"locked","gap":0.8,"text":"Each copy is locked for thirty days: nobody can change or delete it before then, not even an admin."},
 {"id":"restore","gap":0.8,"text":"And once a month, Sam's team restores one, to prove it works: a copy nobody has restored is a hope, not a backup."},
 {"id":"ways","gap":0.8,"text":"A lock that strong cuts both ways: a copy can't be deleted early, even when it should be, and Deleted means deleted comes back to that."}
]},
"again":{"name":"The walk again","lead":1.0,"tail":0.6,"vo":[
 {"id":"walks","gap":0.8,"text":"Sam walks the attacker's path once more."},
 {"id":"nodoor","gap":0.8,"text":"From the open internet, there's no door to find."},
 {"id":"stolen","gap":0.8,"text":"With a stolen way in, there's only what that one person may reach, in one workspace, through the catalog's checks."},
 {"id":"no","gap":0.8,"text":"No back door to the files, nowhere to send them, no key to take, and no copy to delete."},
 {"id":"ragusa","gap":0.8,"text":"In 1377, Ragusa stayed open to the world, through a few gates, each with its rule.","say":"In thirteen seventy-seven, Ragusa stayed open to the world, through a few gates, each with its rule."},
 {"id":"open","gap":0.8,"text":"The university's data stays open to the people and jobs that need it."},
 {"id":"few","gap":0.8,"text":"Few doors, each with a lock you can see."}
]}
};

const VODUR={"gates/ragusa": 3.604, "gates/today": 2.107, "gates/republic": 4.083, "gates/trade": 3.393, "gates/gates": 4.239, "gates/more": 1.655, "gates/plague": 5.661, "gates/thousands": 2.901, "gates/tell": 3.164, "gates/shut": 2.41, "gates/open": 4.321, "gates/change": 1.34, "apart/council": 7.405, "apart/month": 8.054, "apart/then": 1.746, "apart/noone": 4.114, "apart/officers": 3.265, "apart/port": 2.765, "apart/island": 4.444, "apart/first": 2.788, "apart/forty": 6.549, "apart/same": 7.717, "apart/needs": 6.127, "inside/token": 4.014, "inside/asks": 7.558, "inside/door": 5.079, "inside/one": 5.596, "inside/areas": 6.872, "inside/files": 5.407, "inside/out": 1.454, "inside/backups": 3.423, "inside/key": 4.701, "inside/grew": 3.359, "who/writes": 2.308, "who/cloud": 4.979, "who/makers": 4.189, "who/rest": 6.468, "who/contract": 6.58, "who/map": 5.398, "who/trusted": 6.256, "who/small": 5.975, "doors/then": 0.937, "doors/internet": 8.265, "doors/storage": 3.015, "doors/out": 4.575, "doors/files": 5.42, "doors/catalog": 6.531, "doors/back": 2.361, "doors/admin": 5.937, "doors/like": 3.44, "rooms/three": 4.233, "rooms/try": 5.206, "rooms/prod": 3.433, "rooms/own": 1.724, "rooms/masked": 4.697, "rooms/mistake": 4.765, "rooms/path": 5.43, "rooms/islet": 6.861, "keys/locks": 1.43, "keys/encrypted": 4.972, "keys/who": 1.911, "keys/until": 2.138, "keys/own": 4.715, "keys/use": 5.177, "keys/back": 5.562, "keys/lose": 8.907, "keys/rector": 7.81, "keys/knew": 1.409, "copies/last": 1.138, "copies/first": 6.635, "copies/night": 5.744, "copies/locked": 6.028, "copies/restore": 7.16, "copies/ways": 8.752, "again/walks": 2.057, "again/nodoor": 2.659, "again/stolen": 6.438, "again/no": 5.367, "again/ragusa": 5.973, "again/open": 4.143, "again/few": 2.254};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title card after the opening story; and the end card. */
const BREATH={
"gates":{"hold":{"ragusa": 0.6, "today": 0.4, "republic": 0.6, "trade": 0.6, "gates": 1.0, "more": 0.8, "plague": 1.0, "thousands": 1.2, "tell": 1.0, "shut": 0.6, "open": 1.0}},
"apart":{"hold":{"council": 0.8, "month": 1.0, "then": 1.2, "noone": 1.0, "officers": 0.8, "port": 0.8, "island": 1.0, "first": 0.6, "forty": 1.2, "same": 0.8},"breathe":4.4},
"inside":{"hold":{"token": 0.4, "asks": 1.2, "door": 0.8, "one": 0.8, "areas": 1.0, "files": 0.8, "out": 0.6, "backups": 0.8, "key": 1.6}},
"who":{"hold":{"writes": 0.4, "cloud": 0.6, "makers": 0.6, "rest": 0.8, "contract": 0.8, "map": 1.0, "trusted": 0.8}},
"doors":{"hold":{"then": 0.4, "internet": 1.0, "storage": 0.6, "out": 1.0, "files": 0.8, "catalog": 1.0, "back": 0.4, "admin": 1.0}},
"rooms":{"hold":{"three": 0.8, "try": 0.4, "prod": 0.6, "own": 0.6, "masked": 0.8, "mistake": 1.0, "path": 1.0}},
"keys":{"hold":{"locks": 0.6, "encrypted": 0.8, "who": 0.8, "until": 1.0, "own": 1.2, "use": 1.2, "back": 1.4, "lose": 1.2, "rector": 1.0}},
"copies":{"hold":{"last": 0.8, "first": 1.4, "night": 1.2, "locked": 1.4, "restore": 1.6}},
"again":{"hold":{"walks": 0.6, "nodoor": 0.8, "stolen": 0.8, "no": 1.4, "ragusa": 1.0, "open": 0.6},"breathe":5.0}
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

/* ===== Data protection and privacy: the module's look, Night glass =====
   The films of the module Data protection and privacy (Locks before the data, Only what you may see, Kept for a reason) share one
   look, chosen by the author on 5 November 2026: Night glass, frosted glass with solid colour (the style prototype's variant GA). A dark
   petrol hall where every boundary is a pane of glass, frosted where what is behind it may not be read, clear where it may; light runs
   along the panes' edges; what is shown (badges, cards, chips, pills, ticks, tags) is frosted glass with words in ice white, and solid,
   bright colour where the colour means something; people stand in the light of what they look at, with a cool rim from the glass
   behind them. The author asked for the colours of what is shown to be "less faded" than the first draft's (the chip clearly gold):
   so bands, pills, ticks and the chip are solid, with dark words on them, and every word is at least 4.5 to 1 against what is behind it.
   The module's files, bundled in this order after The Inner Life of Data's engine and helpers (core.js, style2.js, ui3.js; logos.js and
   this kit's logos.js for a film that shows the tools), A Sharper Sketch's scene() (sketch3.js), and two files of the agent films' kit,
   unchanged: kit.js (text, timing, the camera, places painted once, scratch canvases, matte shapes) and people.js (the people's
   shapes, faces and cast):
     glass.js   the colours and what each means, words, frosted glass, and what is shown on it: panels, bands, pills, ticks and
                crosses, the chip, the seal, badges, cards, tags, slips, hidden values, sealed secrets, locks, the kicker, the title
                and end cards
     hall.js    the hall, painted once as a place, with its panes of glass; panes that stand in a scene
     night.js   the people, lit at night: each painted once in the light of what they look at, with a cool rim
     sphere.js  the agent: the agent films' sphere and band, in glass, the band in the colour of an identity
     pages.js   the tools' pages: a frosted window with the tool's logo and name, rows, fields and switches
     finish.js  what a film needs before it starts, and the video's motion blur
   Every top-level name starts with dp_ or DP_, except ag_model (the agent, named as the agent films name it, so the checks follow
   it). A film's own helpers go in its own source with a prefix of its own; never change these files for one film.
   Sizes are in the 1920 x 1080 frame. Every word is at least 28 px as seen and at least 4.5 to 1 against what is behind it
   (tools/contrast.py checks both ends of what is behind each word); nothing but the captions goes below y 890. */

/* ---------------------------------------------------------------- colours, and what each means in every film of the module
   T: words (ice white, a quieter ice, and the meaning colours made bright enough to read on the hall and on frosted glass);
   F: solid colour (bands, pills, ticks, lines of light, glows); on: the dark words on solid colour. */
const DP={
  T:{ink:[246,251,251],mut:[192,212,213],cyan:[92,226,245],green:[84,230,152],coral:[255,150,136],amber:[255,198,74],violet:[188,168,255],violet2:[198,192,234],grey:[176,194,196]},
  F:{cyan:[72,222,244],green:[70,228,146],coral:[255,106,90],amber:[255,192,56],violet:[176,150,255],violet2:[184,176,226],grey:[150,170,174]},
  on:[4,22,28],          // dark words on solid colour
  rim:[104,216,230],     // the cool light the glass behind throws on people
  ice:[190,245,245],     // light along the panes' edges
  veil:[5,16,20],        // the dark under a title or an end card
  hall:{bg0:[7,20,24],bg1:[13,36,41],floorTop:[15,40,44],floor:[8,24,28]}
};
// a colour by its meaning: cyan an identity (who or what it is), green allowed, coral denied or closed, amber power switched on
// (an admin account raised for a task), violet hidden (personal data, secrets: what only some may see), violet2 an indirect
// identifier, grey what needs no protection. Gold is the chip, which says a card is genuine.
const DP_MEANS={identity:"cyan",allowed:"green",denied:"coral",closed:"coral",power:"amber",hidden:"violet",indirect:"violet2",none:"grey"};
function dp_t(k){return Array.isArray(k)?k:DP.T[DP_MEANS[k]||k]||DP.T.ink;}
function dp_f(k){return Array.isArray(k)?k:DP.F[DP_MEANS[k]||k]||DP.F.cyan;}

/* ---------------------------------------------------------------- words
   dp_T draws with the agent films' ag_T (so the legibility check sees it, and {deco:1} marks decoration), in ice white unless o.col
   names a meaning ("cyan", "mut", "identity", ...) or gives a colour; o.w the weight (600), o.size (28), o.ls letter spacing in px,
   o.align, o.f ("mono"), o.a opacity, o.glow a colour (a key or [r, g, b]) to glow in, o.blur its size. */
function dp_T(ctx,s,x,y,o){o=o||{};const q=Object.assign({},o,{col:dp_t(o.col||"ink"),w:o.w||600,size:o.size||28});delete q.glow;
  if(!o.glow){ag_T(ctx,s,x,y,q);return;}
  ctx.save();ctx.shadowColor=rgba(dp_f(o.glow),0.6);ctx.shadowBlur=o.blur||10;ag_T(ctx,s,x,y,q);ctx.restore();}
function dp_tw(ctx,s,o){o=o||{};return ag_tw(ctx,s,{w:o.w||600,size:o.size||28,f:o.f,ls:o.ls});}
// several lines, lh apart, the first's baseline at y; returns the last baseline
function dp_lines(ctx,lines,x,y,lh,o){lines.forEach((l,i)=>dp_T(ctx,l,x,y+i*lh,o));return y+(lines.length-1)*lh;}

/* ---------------------------------------------------------------- blur and frosted glass
   The glass shows the place behind it, blurred: each place is blurred once, kept small, and drawn back under a pane, card or badge,
   so frosting costs a frame nothing. The place behind is the one the shot drew (ag_shots' shots, or ag_place); a card over a scene
   drawn live, not a place, names what is behind it in o.behind (a place's key, or a canvas the size of the frame), or false for none,
   and then shows the hall's dark. The glass shows the place, not what is drawn over it: keep cards off people. */
let DP_FILTER=null,DP_BEHIND=null;
// whether this browser blurs a canvas with ctx.filter (some don't: then a picture is shrunk and drawn back up, which is soft too)
function dp_hasFilter(){if(DP_FILTER!==null)return DP_FILTER;
  try{const c=mkCanvas(12,12),x=c.getContext("2d");x.filter="blur(2px)";x.fillStyle="#fff";x.fillRect(5,5,2,2);x.filter="none";DP_FILTER=x.getImageData(2,5,1,1).data[3]>0;}
  catch(e){DP_FILTER=false;}return DP_FILTER;}
// draws src (sx, sy, sw, sh of it) into ctx at dx, dy, dw, dh, blurred by about r px of ctx
function dp_blurDraw(ctx,src,sx,sy,sw,sh,dx,dy,dw,dh,r){
  if(!(r>0.4)){ctx.drawImage(src,sx,sy,sw,sh,dx,dy,dw,dh);return;}
  if(dp_hasFilter()){const f=ctx.filter;ctx.filter="blur("+r.toFixed(2)+"px)";ctx.drawImage(src,sx,sy,sw,sh,dx,dy,dw,dh);ctx.filter=f;return;}
  // shrunk in two steps to about a third of r per pixel, then drawn back up, smoothly
  const m=ctx.getTransform(),k=Math.max(1,Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))),f=Math.max(1.5,r*k/2.2),
        w1=Math.max(2,Math.ceil(dw*k/Math.sqrt(f))),h1=Math.max(2,Math.ceil(dh*k/Math.sqrt(f))),w2=Math.max(2,Math.ceil(dw*k/f)),h2=Math.max(2,Math.ceil(dh*k/f));
  const [c1,x1]=ag_buf("dpblur1",w1,h1),[c2,x2]=ag_buf("dpblur2",w2,h2);x1.imageSmoothingQuality="high";x2.imageSmoothingQuality="high";
  x1.drawImage(src,sx,sy,sw,sh,0,0,w1,h1);x2.drawImage(c1,0,0,w1,h1,0,0,w2,h2);
  const sm=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=true;ctx.drawImage(c2,0,0,w2,h2,dx,dy,dw,dh);ctx.imageSmoothingEnabled=sm;}
// a picture the size of the frame, blurred once and kept small (480 x 270): the frost of a place, or of a canvas
const DP_FROSTED=new Map();
function dp_frostOf(src){let c=DP_FROSTED.get(src);if(c)return c;c=mkCanvas(480,270);const x=c.getContext("2d");x.imageSmoothingQuality="high";
  x.drawImage(src,0,0,src.width,src.height,0,0,480,270);dp_blurDraw(x,c,0,0,480,270,0,0,480,270,4.5);DP_FROSTED.set(src,c);return c;}
function dp_frostPlace(key){return dp_frostOf(ag_place(key));}
// the place a shot draws is the one behind its glass
const dp_shot0=ag_shot,dp_place0=ag_place;
ag_shot=function(ctx,S,t,sh){DP_BEHIND=sh&&(sh.behind!==undefined?sh.behind:sh.place)||null;return dp_shot0.apply(this,arguments);};
ag_place=function(key){DP_BEHIND=key;return dp_place0(key);};
// what is behind a piece of glass, frosted, drawn in the place's coordinates (under the shot's camera)
function dp_behind(ctx,b){if(b===false)return;const k=b===undefined||b===null?DP_BEHIND:b;let src=null;
  if(typeof k==="string"&&AG_PLACES[k])src=dp_frostOf(dp_place0(k));else if(k&&k.width)src=dp_frostOf(k);
  if(src)ctx.drawImage(src,0,0,480,270,0,0,W,H);}
// light thrown on what is behind a lit thing
function dp_halo(ctx,x,y,r,col,a){if(!(a>0))return;ctx.save();ctx.globalCompositeOperation="lighter";const c=dp_f(col),g=ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0,rgba(c,a));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}

/* ---------------------------------------------------------------- what is shown: a panel of frosted glass
   dp_panel(ctx, x, y, w, h, {col, r, a, glowA, glowR, behind}): its glow on the hall in its colour, the place behind it frosted, a
   dark film and a faint tint, light along its top edge, and a rim of its colour, brightest at the top left. */
function dp_panel(ctx,x,y,w,h,o){o=o||{};const col=dp_f(o.col||"cyan"),r=o.r==null?22:o.r,a=o.a==null?1:o.a;if(a<=0)return;
  ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(col,0.34*(o.glowA==null?1:o.glowA));ctx.shadowBlur=o.glowR||46;rr(ctx,x,y,w,h,r);ctx.fillStyle="rgba(6,20,26,0.7)";ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,r);ctx.clip();dp_behind(ctx,o.behind);
  ctx.fillStyle="rgba(6,20,26,0.24)";ctx.fillRect(x,y,w,h);
  const tc=mix(col,[150,215,220],0.85),g=ctx.createLinearGradient(x,y,x+w*0.4,y+h);g.addColorStop(0,rgba(tc,0.17));g.addColorStop(1,rgba(tc,0.06));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  const hg=ctx.createLinearGradient(0,y,0,y+60);hg.addColorStop(0,"rgba(225,250,250,0.15)");hg.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=hg;ctx.fillRect(x,y,w,60);ctx.restore();
  const eg=ctx.createLinearGradient(x,y,x+w,y+h);eg.addColorStop(0,rgba(mix(col,[255,255,255],0.45),1));eg.addColorStop(0.5,rgba(col,0.8));eg.addColorStop(1,rgba(col,1));
  rr(ctx,x+1,y+1,w-2,h-2,r);ctx.strokeStyle=eg;ctx.lineWidth=2.2;ctx.stroke();ctx.restore();}
// a band of solid colour across the top of a card, hb tall (the card's corners r): its kind, in dark capitals
function dp_band(ctx,x,y,w,hb,r,col,text){const c=dp_f(col);ctx.save();rr(ctx,x,y,w,hb+r+2,r);ctx.clip();ctx.beginPath();ctx.rect(x,y,w,hb);ctx.clip();
  const g=ctx.createLinearGradient(x,y,x+w,y);g.addColorStop(0,rgba(mix(c,[255,255,255],0.10),1));g.addColorStop(1,rgba(mix(c,[0,40,56],0.18),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,hb);
  const hg=ctx.createLinearGradient(0,y,0,y+hb);hg.addColorStop(0,"rgba(255,255,255,0.30)");hg.addColorStop(0.5,"rgba(255,255,255,0)");ctx.fillStyle=hg;ctx.fillRect(x,y,w,hb);
  ctx.fillStyle="rgba(0,0,0,0.18)";ctx.fillRect(x,y+hb-1.5,w,1.5);ctx.restore();
  if(text)dp_T(ctx,String(text).toUpperCase(),x+28,y+hb/2+10,{w:800,size:28,ls:4,col:DP.on});}
// a pill of solid colour with dark words; y is the words' baseline; returns its width
function dp_pill(ctx,x,y,text,col,o){o=o||{};const c=dp_f(col),size=o.size||28,w=dp_tw(ctx,text,{w:700,size})+36,h=size+20,a=o.a==null?1:o.a;if(a<=0)return w;
  const x0=o.align==="center"?x-w/2:o.align==="right"?x-w:x;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=o.glow==null?18:o.glow;rr(ctx,x0,y-h+12,w,h,h/2);
  const g=ctx.createLinearGradient(0,y-h+12,0,y+12);g.addColorStop(0,rgba(mix(c,[255,255,255],0.16),1));g.addColorStop(1,rgba(c,1));ctx.fillStyle=g;ctx.fill();ctx.restore();
  rr(ctx,x0+0.6,y-h+12.6,w-1.2,h-1.2,h/2-0.6);ctx.strokeStyle=rgba(mix(c,[255,255,255],0.5),0.9);ctx.lineWidth=1.2;ctx.stroke();
  dp_T(ctx,text,x0+18,y-1,{w:700,size,col:DP.on});ctx.restore();return w;}
// a tick (allowed, a check passes) or a cross (denied) in a disc of solid colour; p draws it on (0 to 1)
function dp_tick(ctx,x,y,col,p){const c=dp_f(col||"green");p=p==null?1:p;if(p<=0)return;ctx.save();ctx.shadowColor=rgba(c,0.75);ctx.shadowBlur=14;ctx.fillStyle=rgba(c,1);
  ctx.beginPath();ctx.arc(x,y,20*ag_eo(Math.min(1,p*1.6)),0,TAU);ctx.fill();ctx.restore();const q=clamp((p-0.35)/0.65,0,1);if(q<=0)return;
  ctx.save();ctx.strokeStyle=rgba(DP.on,1);ctx.lineWidth=4.4;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();const P=[[x-9,y+1],[x-2.5,y+7.5],[x+10,y-7]];
  const L1=Math.hypot(6.5,6.5),L2=Math.hypot(12.5,14.5),u=q*(L1+L2);ctx.moveTo(...P[0]);if(u<=L1)ctx.lineTo(P[0][0]+6.5*u/L1,P[0][1]+6.5*u/L1);else{ctx.lineTo(...P[1]);const v=(u-L1)/L2;ctx.lineTo(P[1][0]+12.5*v,P[1][1]-14.5*v);}
  ctx.stroke();ctx.restore();}
function dp_cross(ctx,x,y,col,p){const c=dp_f(col||"coral");p=p==null?1:p;if(p<=0)return;ctx.save();ctx.shadowColor=rgba(c,0.75);ctx.shadowBlur=14;ctx.fillStyle=rgba(c,1);
  ctx.beginPath();ctx.arc(x,y,20*ag_eo(Math.min(1,p*1.6)),0,TAU);ctx.fill();ctx.restore();const q=clamp((p-0.35)/0.65,0,1);if(q<=0)return;
  ctx.save();ctx.strokeStyle=rgba(DP.on,1);ctx.lineWidth=4.4;ctx.lineCap="round";const a=Math.min(1,q*2),b=clamp(q*2-1,0,1);ctx.beginPath();
  ctx.moveTo(x-8,y-8);ctx.lineTo(x-8+16*a,y-8+16*a);if(b>0){ctx.moveTo(x+8,y-8);ctx.lineTo(x+8-16*b,y-8+16*b);}ctx.stroke();ctx.restore();}
// the chip: gold, as a card's chip is (72 x 56, its top left at cx, cy)
function dp_chip(ctx,cx,cy){ctx.save();ctx.shadowColor="rgba(255,204,92,0.5)";ctx.shadowBlur=14;rr(ctx,cx,cy,72,56,10);
  const g=ctx.createLinearGradient(cx,cy,cx+72,cy+56);g.addColorStop(0,"rgb(255,230,146)");g.addColorStop(0.42,"rgb(236,182,62)");g.addColorStop(0.68,"rgb(250,210,110)");g.addColorStop(1,"rgb(226,168,50)");
  ctx.fillStyle=g;ctx.fill();ctx.restore();rr(ctx,cx+0.7,cy+0.7,70.6,54.6,9.4);ctx.strokeStyle="rgb(160,110,28)";ctx.lineWidth=1.4;ctx.stroke();
  ctx.save();ctx.strokeStyle="rgba(140,94,18,0.95)";ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(cx+24,cy+2);ctx.lineTo(cx+24,cy+54);ctx.moveTo(cx+48,cy+2);ctx.lineTo(cx+48,cy+54);
  ctx.moveTo(cx+2,cy+28);ctx.lineTo(cx+24,cy+28);ctx.moveTo(cx+48,cy+28);ctx.lineTo(cx+70,cy+28);ctx.moveTo(cx+24,cy+18);ctx.lineTo(cx+48,cy+18);ctx.moveTo(cx+24,cy+38);ctx.lineTo(cx+48,cy+38);ctx.stroke();ctx.restore();}
// the seal, a ring of light that says a card is genuine: fine rings turning from the identity's cyan through ice to green; p draws it on
function dp_seal(ctx,x,y,r,t,p){p=p==null?1:p;if(p<=0)return;const c1=DP.F.cyan,c2=mix(c1,[255,255,255],0.6),c3=DP.F.green;ctx.save();ctx.globalCompositeOperation="lighter";
  for(let i=0;i<9;i++){const q=clamp(p*1.5-i*0.06,0,1);if(q<=0)continue;ctx.beginPath();ctx.arc(x,y,r*(0.4+i*0.07),-Math.PI/2,-Math.PI/2+TAU*ag_sine(q));
    if(ctx.createConicGradient){const g=ctx.createConicGradient((t||0)*0.8+i*0.3,x,y);g.addColorStop(0,rgba(c1,0.85));g.addColorStop(0.33,rgba(c2,0.85));g.addColorStop(0.66,rgba(c3,0.85));g.addColorStop(1,rgba(c1,0.85));ctx.strokeStyle=g;}
    else ctx.strokeStyle=rgba(c2,0.6);ctx.lineWidth=1.5;ctx.stroke();}ctx.restore();}
// the line of light that reads a badge: u from 0 (its top) to 1 (its foot), over the card x, y, w, h (corners r)
function dp_scan(ctx,x,y,w,h,u,col,r){const c=dp_f(col||"cyan"),sy=y+u*h;ctx.save();rr(ctx,x,y,w,h,r==null?24:r);ctx.clip();ctx.globalCompositeOperation="lighter";
  const g=ctx.createLinearGradient(0,sy-34,0,sy);g.addColorStop(0,rgba(c,0));g.addColorStop(1,rgba(c,0.26));ctx.fillStyle=g;ctx.fillRect(x,sy-34,w,34);
  ctx.shadowColor=rgba(c,1);ctx.shadowBlur=16;ctx.fillStyle=rgba(mix(c,[255,255,255],0.5),1);ctx.fillRect(x,sy-1.3,w,2.6);ctx.restore();
  ctx.save();ctx.globalCompositeOperation="lighter";for(const ex of [x,x+w]){const eg=ctx.createRadialGradient(ex,sy,0,ex,sy,28);eg.addColorStop(0,rgba(mix(c,[255,255,255],0.6),0.95));eg.addColorStop(1,rgba(c,0));ctx.fillStyle=eg;ctx.fillRect(ex-28,sy-28,56,56);}ctx.restore();}

/* ---------------------------------------------------------------- pictures for a badge: a workload's gear, a person, a lock */
// a gear, as a path (a workload: a job, a pipeline, a service)
function dp_gear(c,x,y,r){c.beginPath();const n=10;for(let i=0;i<=n*4;i++){const a=i/(n*4)*TAU,k=i%4,r2=(k===0||k===1)?r:r*0.8;const X=x+Math.cos(a)*r2,Y=y+Math.sin(a)*r2;i?c.lineTo(X,Y):c.moveTo(X,Y);}c.closePath();
  c.moveTo(x+r*0.36,y);c.arc(x,y,r*0.36,0,TAU,true);}
function dp_gearPic(c,x,y,col){const cc=dp_f(col||"cyan");c.save();dp_gear(c,x,y-6,52);c.fillStyle=rgba(cc,0.30);c.fill("evenodd");c.shadowColor=rgba(cc,0.9);c.shadowBlur=12;
  c.lineWidth=2.4;c.strokeStyle=rgba(mix(cc,[255,255,255],0.4),1);c.stroke();c.shadowBlur=0;c.lineWidth=1.3;c.strokeStyle=rgba(cc,0.6);for(const r of [64,72]){c.beginPath();c.arc(x,y-6,r,0,TAU);c.stroke();}c.restore();}
// a person, head and shoulders, drawn in light (on a badge or a card, not the film's people)
function dp_personPic(c,x,y,col){const cc=dp_f(col||"cyan");c.save();c.fillStyle=rgba(cc,0.30);c.strokeStyle=rgba(mix(cc,[255,255,255],0.4),1);c.lineWidth=2.4;c.shadowColor=rgba(cc,0.9);c.shadowBlur=12;
  c.beginPath();c.arc(x,y-30,24,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(x-50,y+46);c.bezierCurveTo(x-48,y+8,x-26,y-2,x,y-2);c.bezierCurveTo(x+26,y-2,x+48,y+8,x+50,y+46);c.closePath();c.fill();c.stroke();c.restore();}
// a padlock, s its height; open from 0 (shut) to 1 (open); in its colour, drawn in light
function dp_lock(ctx,x,y,s,col,open){const c=dp_f(col||"violet"),k=s/60,u=clamp(open||0,0,1);ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.lineCap="round";
  ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.lineWidth=6;
  ctx.beginPath();ctx.moveTo(-14,-2);ctx.lineTo(-14,-16-8*u);ctx.arc(0,-16-8*u,14,Math.PI,0);ctx.lineTo(14,-16-8*u+(u>0.5?0:14*(1-2*u)));ctx.stroke();
  rr(ctx,-22,-4,44,34,7);ctx.fillStyle=rgba(mix(c,[6,20,26],0.35),1);ctx.fill();ctx.lineWidth=2.4;ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle=rgba(DP.on,0.9);ctx.beginPath();ctx.arc(0,9,4.6,0,TAU);ctx.fill();ctx.fillRect(-2,10,4,10);ctx.restore();}

/* ---------------------------------------------------------------- badges, cards, tags and slips
   dp_badge(ctx, x, y, w, h, {kind, col, title, lines: [[text, colour], ...], mrz, t, scan, pic, behind}): a badge of glass, as an
   identity card is: its kind on a band of solid colour, a picture (pic(ctx, cx, cy): dp_gearPic, dp_personPic, dp_sphereIcon), the
   seal that says it's genuine, the gold chip, its name and what it says, and a machine-readable line along its foot (decoration);
   scan (0 to 1) runs the light that reads it. 600 x 372 is the usual size. */
function dp_badge(ctx,x,y,w,h,o){o=o||{};const col=o.col||"cyan",c=dp_f(col),a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_halo(ctx,x+w/2,y+h/2,Math.max(w,h)*0.9,col,0.10);
  dp_panel(ctx,x,y,w,h,{col,r:24,behind:o.behind});
  dp_band(ctx,x,y,w,62,24,col,o.kind);
  const px=x+28,py=y+88,pw=150,ph=176;ctx.save();rr(ctx,px,py,pw,ph,12);ctx.fillStyle="rgba(6,26,32,0.9)";ctx.fill();ctx.clip();
  const ig=ctx.createRadialGradient(px+pw/2,py+ph*0.45,10,px+pw/2,py+ph/2,ph*0.7);ig.addColorStop(0,rgba(c,0.30));ig.addColorStop(1,rgba(c,0));ctx.fillStyle=ig;ctx.fillRect(px,py,pw,ph);
  if(o.pic)o.pic(ctx,px+pw/2,py+ph/2);ctx.restore();
  rr(ctx,px+0.6,py+0.6,pw-1.2,ph-1.2,12);ctx.strokeStyle=rgba(c,0.85);ctx.lineWidth=1.8;ctx.stroke();
  if(o.seal!==false)dp_seal(ctx,px+pw-16,py+ph-16,34,o.t==null?1.1:o.t,o.seal);
  if(o.chip!==false)dp_chip(ctx,x+w-108,y+92);
  const tx=x+206;if(o.title)dp_T(ctx,o.title,tx,y+180,{w:700,size:42});
  (o.lines||[]).forEach((l,i)=>dp_T(ctx,l[0],tx,y+228+i*44,{w:l[1]?700:600,size:28,col:l[1]||"mut"}));
  if(o.scan!=null&&o.scan>0&&o.scan<1)dp_scan(ctx,x,y,w,h,o.scan,col);
  if(o.mrz)dp_T(ctx,o.mrz,x+28,y+h-24,{w:500,size:22,f:"mono",ls:1,col:"mut",a:0.85,deco:1});
  ctx.restore();}
/* dp_card(ctx, x, y, w, {kick, title, sub}, {col, a, k, measure}): a card of glass that fits its words: a kicker in capitals in its
   colour, a title (36 px) and a line or two under it (28 px, quieter); k springs it in from half its size (ag_spr); returns its box */
const DP_PAD=30;
function dp_card(ctx,x,y,w,words,o){o=o||{};const inner=w-DP_PAD*2,tl=words.title?ag_wrap(ctx,words.title,inner,{w:700,size:36}):[],sl=words.sub?ag_wrap(ctx,words.sub,inner,{w:500,size:28}):[];
  // each line's baseline, from the top: capitals' tops a padding in, then a line every 46 (titles) or 38 px (the lines under them)
  const L=[];let yy=y+DP_PAD;
  if(words.kick){yy+=20;L.push([String(words.kick).toUpperCase(),yy,{w:800,size:28,ls:4,col:o.col||"cyan"}]);}
  tl.forEach((l,i)=>{yy+=i?46:(words.kick?50:27);L.push([l,yy,{w:700,size:36}]);});
  sl.forEach((l,i)=>{yy+=i?38:(tl.length?42:words.kick?44:21);L.push([l,yy,{w:500,size:28,col:"mut"}]);});
  const h=Math.round(yy-y+8+DP_PAD),bb={x,y,w,h};if(o.measure)return bb;
  const a=o.a==null?1:o.a;if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:20,behind:o.behind,glowR:36});
  for(const [s,by,q] of L)dp_T(ctx,s,x+DP_PAD,by,q);
  ctx.restore();return bb;}
// a label on a small panel, in its colour, with a fine line of light to what it names (o.to [x, y]); returns its width
function dp_tag(ctx,x,y,text,col,o){o=o||{};const size=o.size||30,w=dp_tw(ctx,text,{w:700,size})+44,h=size+32,a=o.a==null?1:o.a,hc=dp_f(col);if(a<=0)return w;
  ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col,r:14,glowR:26,behind:o.behind});dp_T(ctx,text,x+22,y+h/2+size*0.36,{w:700,size,col});
  if(o.to){const [lx,ly]=o.to,inY=ly>=y&&ly<=y+h,sy=inY?y+h/2:(ly<y?y:y+h),sx=inY?(lx<x?x:x+w):Math.max(x+24,Math.min(x+w-24,lx)),p=o.p==null?1:o.p;
    const ex=lerp(sx,lx,p),ey=lerp(sy,ly,p);ctx.save();ctx.strokeStyle=rgba(hc,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.shadowColor=rgba(hc,0.8);ctx.shadowBlur=8;
    ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.stroke();if(p>=1){ctx.fillStyle=rgba(mix(hc,[255,255,255],0.35),1);ctx.beginPath();ctx.arc(lx,ly,6,0,TAU);ctx.fill();}ctx.restore();}
  ctx.restore();return w;}
// a slip: one line on a small panel, in its colour; o.align "center" puts its middle at x; returns its box
function dp_slip(ctx,x,y,text,col,o){o=o||{};const size=o.size||30,w=dp_tw(ctx,text,{w:700,size})+48,h=size+40,x0=o.align==="center"?x-w/2:x,a=o.a==null?1:o.a,bb={x:x0,y,w,h};
  if(a<=0||o.measure)return bb;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x0,y,w,h,{col,r:16,glowR:30,behind:o.behind});
  dp_T(ctx,text,x0+24,y+h/2+size*0.36,{w:700,size,col:o.ink?"ink":col});ctx.restore();return bb;}
/* dp_frost(ctx, x, y, w, h, paint, {col, r, behind}): a value that may not be read, under frost in the violet of hidden data: paint(c)
   draws it in the same coordinates (it is drawn small and blurred, so no word of it can be read; the checks don't count it) */
function dp_frost(ctx,x,y,w,h,paint,o){o=o||{};const col=dp_f(o.col||"violet"),r=o.r==null?14:o.r,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(col,0.5);ctx.shadowBlur=20;rr(ctx,x,y,w,h,r);ctx.fillStyle="rgb(14,16,40)";ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,r);ctx.clip();dp_behind(ctx,o.behind);
  if(paint){const m=ctx.getTransform(),ks=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))||1,k=7/ks,bw=Math.ceil(w/k)+6,bh=Math.ceil(h/k)+6,[bc,bx]=ag_buf("dpfrost",bw,bh);
    bx.setTransform(1/k,0,0,1/k,-(x-3*k)/k,-(y-3*k)/k);paint(bx);const sm=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=true;ctx.drawImage(bc,0,0,bw,bh,x-3*k,y-3*k,bw*k,bh*k);ctx.imageSmoothingEnabled=sm;}
  ctx.fillStyle=rgba(col,0.32);ctx.fillRect(x,y,w,h);
  const hg=ctx.createLinearGradient(0,y,0,y+50);hg.addColorStop(0,"rgba(255,255,255,0.16)");hg.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=hg;ctx.fillRect(x,y,w,50);ctx.restore();
  rr(ctx,x+1,y+1,w-2,h-2,r);ctx.strokeStyle=rgba(mix(col,[255,255,255],0.3),1);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
/* dp_sealed(ctx, x, y, w, label, {sub, col, a, revoked}): a secret (a token, a password, a key) as a sealed card: frosted violet glass,
   a lock, what it is and whose (the label), a line under it (sub); never a character of the secret itself. revoked (0 to 1) strikes
   it through in coral: the secret no longer opens anything. 120 tall; returns its box */
function dp_sealed(ctx,x,y,w,label,o){o=o||{};const h=o.sub?120:96,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0||o.measure)return bb;const rv=clamp(o.revoked||0,0,1);
  ctx.save();ctx.globalAlpha*=a;dp_frost(ctx,x,y,w,h,null,{col:o.col||"violet",r:18,behind:o.behind});
  dp_lock(ctx,x+52,y+h/2-4,52,o.col||"violet",0);
  dp_T(ctx,label,x+100,y+(o.sub?52:58),{w:700,size:30});if(o.sub)dp_T(ctx,o.sub,x+100,y+92,{w:600,size:28,col:"mut"});
  if(rv>0){const c=dp_f("coral");ctx.save();ctx.strokeStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.lineWidth=4;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(x+18,y+h-18);ctx.lineTo(x+18+(w-36)*ag_sine(rv),y+h-18-(h-36)*ag_sine(rv));ctx.stroke();ctx.restore();}
  ctx.restore();return bb;}
// a line of light from a to b, drawn on (p 0 to 1), with a dot at its end
function dp_link(ctx,a,b,col,p,o){o=o||{};p=p==null?1:p;if(p<=0)return;const c=dp_f(col||"cyan"),ex=lerp(a[0],b[0],p),ey=lerp(a[1],b[1],p);ctx.save();
  ctx.strokeStyle=rgba(c,o.alpha==null?1:o.alpha);ctx.lineWidth=o.lw||2.4;ctx.lineCap="round";ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=8;if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(ex,ey);ctx.stroke();if(p>=1&&o.dot!==false){ctx.setLineDash([]);ctx.fillStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.beginPath();ctx.arc(b[0],b[1],6,0,TAU);ctx.fill();}ctx.restore();}

/* ---------------------------------------------------------------- the kicker, the mark, the title and end cards */
// a chapter's kicker, top left: its name in capitals, in the identity's cyan, a line of light under it, and a title under that
function dp_kicker(ctx,top,title,o){o=o||{};const x=o.x||72,y=o.y||98,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_T(ctx,String(top).toUpperCase(),x,y,{w:700,size:28,ls:4,col:"cyan"});
  const w=Math.max(dp_tw(ctx,String(top).toUpperCase(),{w:700,size:28,ls:4}),title?dp_tw(ctx,title,{w:700,size:46}):0),c=DP.F.cyan;
  const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(c,1));g.addColorStop(1,rgba(c,0));ctx.fillStyle=g;ctx.fillRect(x,y+16,w,2.4);
  if(title)dp_T(ctx,title,x+0,y+74,{w:700,size:46});ctx.restore();}
// the module's mark: the seal's ring of light drawing itself round a small lock; p from 0 to 1
function dp_mark(ctx,cx,cy,r,p,a){if(!(a>0.01))return;ctx.save();ctx.globalAlpha*=a;dp_halo(ctx,cx,cy,r*2.6,"cyan",0.12*ag_in(p,0,0.5));
  dp_seal(ctx,cx,cy,r,p*2,clamp(p,0,1));dp_lock(ctx,cx,cy+4,r*0.62,"cyan",0);ctx.restore();}
function dp_veil(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle=rgba(DP.veil,clamp(a,0,1));ctx.fillRect(0,0,W,H);}
// the title card: the mark, the film's title, a line under it, and "FILM 1 OF 9 · LOCKS BEFORE THE DATA" (line)
function dp_title(ctx,S,t,t0,title,sub,line){const oA=ag_in(t,t0,0.8),tA=ag_in(t,t0+0.5,0.8);if(oA<=0)return;dp_veil(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{dp_mark(ctx,960,330,62,(t-t0-0.4)/1.6,1);dp_T(ctx,title,960,520,{w:800,size:88,align:"center"});
    if(sub)dp_T(ctx,sub,960,600,{w:600,size:36,align:"center",col:"mut"});withA(ctx,ag_in(t,t0+1.2,0.8),()=>dp_T(ctx,line,960,700,{w:700,size:28,ls:3,align:"center",col:"cyan"}));});}
// the end card: the film's last line, the mark, the title, and "Film 1 of 9 · Locks before the data · Learning Data"
function dp_end(ctx,S,t,t0,title,line,n,series){const oA=ag_in(t,t0,1.0),tA=ag_in(t,t0+0.6,0.9);if(oA<=0)return;dp_veil(ctx,S,oA*0.9);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)dp_T(ctx,line,960,360,{w:700,size:48,align:"center"});dp_mark(ctx,960,500,56,(t-t0-0.7)/1.4,1);dp_T(ctx,title,960,650,{w:800,size:44,align:"center"});
    dp_T(ctx,(n?n+" · ":"")+(series||"Locks before the data")+" · Learning Data",960,708,{w:600,size:28,align:"center",col:"mut"});});}

/* ===== Data protection and privacy: the hall =====
   The films' world: a dark petrol hall, its floor glossy, lights far off behind panes of frosted glass, haze where the floor meets the
   dark, and pools of light where people stand. Painted once as a place (kit.js: AG_PLACES, ag_place), then the camera looks at it.
   dp_paintHall(c, o) paints it; a film makes its own with the hall's own options and names it in its source:
     AG_PLACES.hallBadge = c => dp_paintHall(c, {seed: 7, horizon: 700, vx: 1100, pools: [[430, 990, 540, 0.12], [1060, 780, 640, 0.07]]});
   o: horizon (the floor's far edge, y 700), vx (where the floor's lines meet, x 1180), seed (where the lights and panes fall), lights
   (how many, 18), panes (how many standing panes, 9), pools ([x, y, r, a] each: light on the floor where people stand), haze (0.09).
   "hall" is the plain hall, for a film that needs no other.
   dp_wall(ctx, x, y, w, h, {frosted, col, a, label}) stands a pane in a scene: frosted, what is behind it may not be read; clear, it may. */
function dp_paintHall(c,o){o=o||{};const w=W,h=H,hz=o.horizon||700,vx=o.vx||1180,R=ag_rnd(o.seed||7),P=DP.hall,ice=DP.ice,cy=DP.F.cyan,vi=DP.F.violet,haze=o.haze==null?0.09:o.haze;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(P.bg0,1));g.addColorStop(1,rgba(P.bg1,1));c.fillStyle=g;c.fillRect(0,0,w,hz);
  g=c.createLinearGradient(0,hz,0,h);g.addColorStop(0,rgba(P.floorTop,1));g.addColorStop(1,rgba(P.floor,1));c.fillStyle=g;c.fillRect(0,hz,w,h-hz);
  // lights far off, behind the glass: soft, mostly the hall's own cool light, now and then violet or a warm lamp; and their gloss in the floor
  for(let i=0;i<(o.lights==null?18:o.lights);i++){const x=R()*w,y=hz*(0.22+R()*0.72),r=24+R()*110,u=R(),col=u<0.14?vi:u<0.22?[255,214,160]:[104,216,230],a=0.05+R()*0.11;
    const lg=c.createRadialGradient(x,y,0,x,y,r);lg.addColorStop(0,rgba(col,a));lg.addColorStop(1,rgba(col,0));c.fillStyle=lg;c.fillRect(x-r,y-r,2*r,2*r);
    const ry=hz+(hz-y)*0.22,rg=c.createRadialGradient(x,ry,0,x,ry,r);rg.addColorStop(0,rgba(col,a*0.45));rg.addColorStop(1,rgba(col,0));c.save();c.translate(x,ry);c.scale(0.45,1.6);c.translate(-x,-ry);c.fillStyle=rg;c.fillRect(x-r,ry-r,2*r,2*r);c.restore();}
  for(let i=0;i<46;i++){const x=R()*w,y=R()*hz*0.92,r=0.8+R()*2.2;c.fillStyle="rgba(170,235,235,"+(0.05+R()*0.14).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  // the floor's lines, running back to the middle of the hall
  c.save();c.strokeStyle="rgba(120,200,205,0.045)";c.lineWidth=1;for(let i=-14;i<=14;i++){c.beginPath();c.moveTo(vx,hz);c.lineTo(vx+i*260,h);c.stroke();}
  for(let j=1;j<9;j++){const y=hz+Math.pow(j/9,1.8)*(h-hz);c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}c.restore();
  // panes of frosted glass standing in the hall, far ones first: each blurs what is behind it, its top edge catching the light
  const n=o.panes==null?9:o.panes;for(let k=0;k<n;k++){const d=0.34+k*(0.56/Math.max(1,n-1)),pw=(150+R()*260)*d,ph=(620+R()*260)*d,x=(R()*1.3-0.15)*w,yb=hz+18+d*150,y=yb-ph,pad=16;
    c.save();c.beginPath();c.rect(x,y,pw,ph);c.clip();dp_blurDraw(c,c.canvas,x-pad,y-pad,pw+2*pad,ph+2*pad,x-pad,y-pad,pw+2*pad,ph+2*pad,8+10*d);
    const pg=c.createLinearGradient(0,y,0,yb);pg.addColorStop(0,"rgba(150,220,225,"+(0.05+0.05*d).toFixed(3)+")");pg.addColorStop(1,"rgba(150,220,225,"+(0.02+0.03*d).toFixed(3)+")");c.fillStyle=pg;c.fillRect(x,y,pw,ph);c.restore();
    c.fillStyle=rgba(ice,0.14+0.24*d);c.fillRect(x,y,pw,1.4);c.fillStyle=rgba(ice,0.05+0.13*d);c.fillRect(x,y,1.4,ph);c.fillStyle=rgba(ice,0.03+0.06*d);c.fillRect(x+pw-1.4,y,1.4,ph);
    const rg=c.createLinearGradient(0,yb,0,yb+ph*0.4);rg.addColorStop(0,"rgba(150,220,225,"+(0.05*d+0.02).toFixed(3)+")");rg.addColorStop(1,"rgba(150,220,225,0)");c.fillStyle=rg;c.fillRect(x,yb,pw,ph*0.4);}
  // haze where the floor meets the dark, and pools of light where people stand
  g=c.createLinearGradient(0,hz-150,0,hz+70);g.addColorStop(0,"rgba(80,160,170,0)");g.addColorStop(0.7,"rgba(80,160,170,"+haze+")");g.addColorStop(1,"rgba(80,160,170,0)");c.fillStyle=g;c.fillRect(0,hz-150,w,220);
  for(const [x,y,r,a] of (o.pools||[[520,900,520,0.10],[1250,760,700,0.08]])){const pg=c.createRadialGradient(x,y,0,x,y,r);pg.addColorStop(0,"rgba(120,220,225,"+a+")");pg.addColorStop(1,"rgba(120,220,225,0)");
    c.fillStyle=pg;c.save();c.translate(x,y);c.scale(1,0.42);c.translate(-x,-y);c.fillRect(x-r,y-r,2*r,2*r);c.restore();}
  if(o.after)o.after(c);}
AG_PLACES.hall=c=>dp_paintHall(c,{});
// a pane of glass standing in a scene, from its foot (x, y + h) up: frosted (the place behind it blurred, its colour faint) or clear
// (only its edges and a sheen), in the colour of what it does (cyan, by default: who may pass), with its gloss in the floor
function dp_wall(ctx,x,y,w,h,o){o=o||{};const col=dp_f(o.col||"cyan"),a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  if(o.frosted){dp_behind(ctx,o.behind);ctx.fillStyle="rgba(6,20,26,0.30)";ctx.fillRect(x,y,w,h);const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(mix(col,[150,215,220],0.7),0.16));g.addColorStop(1,rgba(mix(col,[150,215,220],0.7),0.05));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);}
  else{const sg=ctx.createLinearGradient(x,y,x+w,y+h);sg.addColorStop(0,"rgba(200,245,245,0.10)");sg.addColorStop(0.35,"rgba(200,245,245,0.02)");sg.addColorStop(0.5,"rgba(200,245,245,0.08)");sg.addColorStop(1,"rgba(200,245,245,0)");ctx.fillStyle=sg;ctx.fillRect(x,y,w,h);}
  ctx.restore();
  ctx.save();ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=o.frosted?10:16;ctx.fillStyle=rgba(mix(col,[255,255,255],0.4),o.frosted?0.7:0.95);ctx.fillRect(x,y,w,2);ctx.fillRect(x,y,2,h);ctx.fillRect(x+w-2,y,2,h);ctx.restore();
  const rg=ctx.createLinearGradient(0,y+h,0,y+h+h*0.3);rg.addColorStop(0,rgba(col,0.10));rg.addColorStop(1,rgba(col,0));ctx.fillStyle=rg;ctx.fillRect(x,y+h,w,h*0.3);
  if(o.label)dp_T(ctx,o.label,x+w/2,y-20,{w:700,size:28,align:"center",col:o.col||"cyan"});
  ctx.restore();}

/* ===== Data protection and privacy: the people, lit at night =====
   The agent films' people (people.js: their shapes, the face's table AG_FACE, the cast AG_CAST; an adult's proportions, one
   three-quarter head, arms down, a hand only on what the story is about), lit as Night glass lights them: softly, from what they look at
   in front of them, the skin keeping its own colour, with a cool rim of light along their back and the top of their head from the glass
   behind. The light is set in figure space, so it stays in front of a person either way round (flip).
   dp_person(ctx, who, x, y, s, o) draws a person exactly as ag_person does (the same x, y, s and o: t, flip, pose "hold" with hold or
   holdBack, gaze, nod, smile, talk, cut, covered; people.js's head says what each does), lit by o.light: a name in DP_LIGHTS ("glass",
   the default, the hall's cool light from the cards in front of them; "lamp", warm, for a lantern or a fire in an opening at night) or a
   light of the film's own ({key: [x, y] in figure space, kr, kk, amb, kc, shade, rim, rimA, rimW}, from "glass"'s values).
   Each person in each light is painted once: their head and their body (arms down, or the near arm free to hold), lit pixel by pixel,
   the rim added, and kept; then drawn every frame like any person of the agent films, and faded whole. Their eyes and mouth, and an
   arm that holds, are drawn live in the light where the near hand holds. A lanyard is drawn in light: a strap and a glass badge with a
   cyan band, the colour of an identity.
   A film lists who it shows in DP_PEOPLE (DP_PEOPLE.push("sam", ["mei", "lamp"])), so the player paints them while the page is idle
   once Play is near (finish.js), one picture at a time; someone not listed is painted the first time they're drawn.
   The pictures are wider than the agent films' (DP_HEADBOX, DP_BODYBOX), so the rim's glow isn't cut off; a hat still sits inside
   the head's picture (figure x 160 to 440, y 250 to 560), and edges.py checks every picture. */
/* The people this module adds to the agent films' cast, so every film draws them the same: Ingrid Holm, who owns HR's data, and Linh
   Nguyen, the casual tutor whose contract ends on 20 November 2026 (*Kept for a reason*). Both as *Modern data basics* draws them
   (films/data-that-moves/shared/src/people.js, MD_CAST), so they're the same people in both modules. */
Object.assign(AG_CAST,{
  ingrid:{name:"Ingrid Holm",role:"HR",skin:[236,204,182],hair:{style:"bun",c:[196,176,140]},glasses:[70,62,58],top:{kind:"blazer",c:[98,74,104],inner:[238,234,228]},breath:0.28},
  linh:{name:"Linh Nguyen",role:"Casual tutor",skin:[232,196,166],hair:{style:"bob",c:[24,22,26]},earrings:[214,218,226],top:{kind:"cardigan",c:[132,136,142],inner:[236,234,230]},breath:0.3}
});
const DP_LIGHTS={
  glass:{key:[700,450],kr:790,kk:0.97,amb:0.33,kc:[0.97,1.02,1.07],shade:[0.70,0.86,0.98],rim:[104,216,230],rimA:0.75,rimW:5},
  lamp:{key:[800,510],kr:900,kk:1.05,amb:0.29,kc:[1.12,0.97,0.80],shade:[0.62,0.78,1.0],rim:[150,205,230],rimA:0.7,rimW:5}
};
const DP_HEADBOX=[136,226,464,584],DP_BODYBOX=[6,238,524,1108];
const DP_PEOPLE=[],DP_NIGHT={};
function dp_light(L){return typeof L==="string"?(DP_LIGHTS[L]||DP_LIGHTS.glass):Object.assign({},DP_LIGHTS.glass,L||{});}
// the light at a point of figure space, as [r, g, b] factors: what is in front lights near points more, with its own colour
function dp_lightAt(L,X,Y){const d=Math.hypot(X-L.key[0],(Y-L.key[1])*0.9)/L.kr,kf=L.kk*Math.pow(Math.max(0,1-d),1.6),f=L.amb+kf,tw=kf/(f+1e-6);
  return [0,1,2].map(c=>f*(L.shade[c]*(1-tw)+L.kc[c]*tw));}
// a person in a light: a spec of their own (key "<who>@<light>"), whose pictures night.js paints; its colours are the live parts'
function dp_night(who,light){const D=ag_spec(who);if(D&&D.night)return D;const ln=typeof light==="string"?light:light?"own"+JSON.stringify(light):"glass",k=(D.key||D.name)+"@"+ln;
  let N=DP_NIGHT[k];if(N)return N;const L=dp_light(light),f=dp_lightAt(L,330,760),lit=c=>c&&c.map((v,i)=>clamp(Math.round(v*f[i]),0,255));
  N=DP_NIGHT[k]=Object.assign({},D,{key:k,night:{day:D,light:L},skin:lit(D.skin),hair:Object.assign({},D.hair,{c:lit(D.hair.c)}),
    top:Object.assign({},D.top,{c:lit(D.top.c)},D.top.inner?{inner:lit(D.top.inner)}:{}),beard:D.beard&&lit(D.beard)});return N;}
function dp_person(ctx,who,x,y,s,o){o=o||{};return ag_person(ctx,dp_night(who,o.light),x,y,s,o);}
// the steps that paint a person's pictures in a light, for the player to run one at a time (finish.js)
function dp_prepSteps(who,light){const N=dp_night(who,light);return[()=>ag_fig(N),()=>ag_figBody(ag_fig(N),true,true),()=>ag_figBody(ag_fig(N),false,true)];}

/* ---------------------------------------------------------------- painting a person at night, once
   dp_lit(c, paint, L, after): paint(c) as the agent films paint a person, then lit: each pixel by the light where it is (figure space,
   from c's transform), then the rim, the silhouette's back and top edges in L.rim, fading down the body, laid on in light ("lighter"),
   sharp and soft; then after(c), drawn in light and not lit (a lanyard). sil(c), in figure space, adds shapes to the silhouette the rim
   follows without painting them: a head's picture adds the neck and the torso it sits on, so the jaw's edge over the neck isn't lit. Works on any canvas and transform, so edges.py can paint it
   again on a wider one. The light at a point is the ambient in the shade's colour and the key in its own, amb * shade + kf * kc
   (dp_lightAt, worked out); kf is looked up by the square of the distance, so no pixel needs a root or a division. The rim is made at
   half size and drawn back up smoothly, which softens its edge, and again blurred, for its glow. */
function dp_lit(c,paint,L,after,sil){const m=c.getTransform(),cw=c.canvas.width,ch=c.canvas.height,sx=m.a,sy=m.d,ox=m.e,oy=m.f;
  const [bc,bx]=ag_buf("dplit",cw,ch);bx.setTransform(m);paint(bx);bx.setTransform(1,0,0,1,0,0);
  const img=bx.getImageData(0,0,cw,ch),d=img.data,N=4096,tab=new Float32Array(N+1);for(let i=0;i<=N;i++)tab[i]=L.kk*Math.pow(1-Math.sqrt(i/N),1.6);
  const kx=L.key[0],ky=L.key[1],ir2=1/(L.kr*L.kr),a0=L.amb*L.shade[0],a1=L.amb*L.shade[1],a2=L.amb*L.shade[2],k0=L.kc[0],k1=L.kc[1],k2=L.kc[2],stx=1/sx;
  for(let j=0;j<ch;j++){const dy=((j+0.5-oy)/sy-ky)*0.9,dy2=dy*dy*ir2;let p=j*cw*4,dx=(0.5-ox)/sx-kx;
    for(let i=0;i<cw;i++,p+=4,dx+=stx){if(d[p+3]<2)continue;const q=dx*dx*ir2+dy2,kf=q>=1?0:tab[(q*N)|0];
      d[p]=d[p]*(a0+k0*kf);d[p+1]=d[p+1]*(a1+k1*kf);d[p+2]=d[p+2]*(a2+k2*kf);}}
  bx.putImageData(img,0,0);
  // the rim, at half size: what of the silhouette a copy moved forward and down doesn't cover (its back and its top), in the rim's colour
  // (with sil, the silhouette is the picture's and what sil paints, such as the neck under a head, and the rim only on the picture)
  const hw=Math.ceil(cw/2),hh=Math.ceil(ch/2),rw=L.rimW*sx/2,dy=rw*0.35*sy/sx,[sc,sk]=ag_buf("dpsil",hw,hh);sk.imageSmoothingEnabled=true;sk.drawImage(bc,0,0,cw,ch,0,0,cw/2,ch/2);
  if(sil){sk.setTransform(m.a/2,0,0,m.d/2,m.e/2,m.f/2);sk.fillStyle="#000";sk.beginPath();sil(sk);sk.fill();sk.setTransform(1,0,0,1,0,0);}
  const [rc,rx]=ag_buf("dprim",hw,hh);rx.drawImage(sc,0,0);rx.globalCompositeOperation="destination-out";rx.drawImage(sc,rw,dy);
  rx.globalCompositeOperation="source-in";rx.fillStyle=rgba(L.rim,1);rx.fillRect(0,0,hw,hh);
  if(sil){rx.globalCompositeOperation="destination-in";rx.imageSmoothingEnabled=true;rx.drawImage(bc,0,0,cw,ch,0,0,cw/2,ch/2);}
  rx.globalCompositeOperation="destination-in";rx.setTransform(m.a/2,0,0,m.d/2,m.e/2,m.f/2);const fg=rx.createLinearGradient(0,250,0,1110);fg.addColorStop(0,"rgba(0,0,0,1)");fg.addColorStop(0.45,"rgba(0,0,0,0.75)");fg.addColorStop(1,"rgba(0,0,0,0.08)");
  rx.fillStyle=fg;rx.fillRect(-4000,-4000,9000,9000);rx.setTransform(1,0,0,1,0,0);rx.globalCompositeOperation="source-over";
  c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation="source-over";c.drawImage(bc,0,0);
  c.globalCompositeOperation="lighter";c.globalAlpha=L.rimA;c.imageSmoothingEnabled=true;c.drawImage(rc,0,0,hw,hh,0,0,hw*2,hh*2);c.globalAlpha=L.rimA*0.5;dp_softOnto(c,rc,3.5*sx,cw,ch);c.restore();
  if(after){c.save();after(c);c.restore();}}
// draws src onto c's whole canvas (cw by ch), blurred by about r of src's pixels: blurred on a copy as much smaller as the blur allows,
// then drawn back up smoothly, which is as soft and far quicker than a blur at full size
function dp_softOnto(c,src,r,cw,ch){const k=Math.max(1,r/1.2),w=Math.max(2,Math.ceil(src.width/k)),h=Math.max(2,Math.ceil(src.height/k)),[bc,bx]=ag_buf("dpsoft",w,h);
  bx.imageSmoothingEnabled=true;bx.imageSmoothingQuality="high";dp_blurDraw(bx,src,0,0,src.width,src.height,0,0,w,h,r/k);
  const sm=c.imageSmoothingEnabled;c.imageSmoothingEnabled=true;c.drawImage(bc,0,0,w,h,0,0,cw||src.width,ch||src.height);c.imageSmoothingEnabled=sm;}
// a lanyard drawn in light, in figure space: the strap, and a badge of glass with a cyan band (an identity), inside the torso
function dp_lanyard(c){const col=DP.F.cyan;c.save();c.beginPath();AG_F.torso(c);c.clip();
  c.strokeStyle=rgba(mix(col,[10,30,34],0.2),1);c.lineWidth=6;c.lineCap="round";c.beginPath();c.moveTo(246,586);c.bezierCurveTo(262,680,290,760,304,806);c.moveTo(352,612);c.bezierCurveTo(342,690,326,760,314,806);c.stroke();
  c.shadowColor=rgba(col,0.8);c.shadowBlur=14;rr(c,276,800,62,80,8);c.fillStyle="rgb(16,40,46)";c.fill();c.shadowBlur=0;c.strokeStyle=rgba(mix(col,[255,255,255],0.3),1);c.lineWidth=2;c.stroke();
  c.save();rr(c,276,800,62,80,8);c.clip();c.fillStyle=rgba(col,1);c.fillRect(276,800,62,18);c.restore();
  c.fillStyle="rgba(225,242,242,0.75)";c.fillRect(286,834,42,4);c.fillRect(286,846,30,4);c.restore();}
// a night spec's pictures: the agent films' painters, lit (ag_fig and ag_figBody are the agent films', taken over only for night specs)
const dp_fig0=ag_fig,dp_figBody0=ag_figBody;
ag_fig=function(who){const P=ag_spec(who);if(!P||!P.night)return dp_fig0(who);let F=AG_PEOPLE[P.key];if(F)return F;
  const D=Object.assign({},P.night.day,{lanyard:false}),DC=ag_colours(D),L=P.night.light;
  F=AG_PEOPLE[P.key]={P,C:ag_colours(P),night:true,head:null,bodies:{}};F.head=ag_layer(c=>dp_lit(c,cc=>ag_paintHead(cc,D,DC),L,null,cc=>{AG_F.neck(cc);AG_F.torso(cc);if(D.hair.style==="long")AG_HAIR.longBack(cc);}),DP_HEADBOX);return F;};
ag_figBody=function(F,near,far){if(!F.night)return dp_figBody0(F,near,far);const k=(near?1:0)+(far?2:0);if(F.bodies[k])return F.bodies[k];
  const P=F.P,D=Object.assign({},P.night.day,{lanyard:false}),DC=ag_colours(D),L=P.night.light,lan=!!P.night.day.lanyard;
  return F.bodies[k]=ag_layer(c=>dp_lit(c,cc=>ag_paintBody(cc,D,DC,near,far),L,lan?dp_lanyard:null),DP_BODYBOX);};

/* ===== Data protection and privacy: the agent =====
   The agent films' agent, a sphere with a band of light, drawn in glass: dark, glossy, its band lit in the colour of an identity
   (cyan: an agent is an identity, with its own badge and its owner; in the agent films the band is violet, which here means hidden
   data). The module links to AI agents in data work for what agents are and do, and never teaches its films again.
   ag_model(ctx, x, y, r, {t, a, col, halo}) draws the agent itself (the checks follow it: it is in one place at a time, and never
   two); dp_sphereIcon(ctx, x, y, r, t) draws its picture, small, on a badge or a card, which the checks don't take for the agent. */
function dp_sphere(ctx,x,y,r,o){o=o||{};const t=o.t||0,col=dp_f(o.col||"cyan"),a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  if(o.halo!==false)dp_halo(ctx,x,y,r*3.2,col,0.10);
  ctx.save();let g=ctx.createRadialGradient(x-r*0.35,y-r*0.45,r*0.05,x,y,r*1.02);g.addColorStop(0,"rgb(100,146,150)");g.addColorStop(0.35,"rgb(32,64,70)");g.addColorStop(0.8,"rgb(10,26,30)");g.addColorStop(1,"rgb(6,16,20)");
  ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=r*0.4;ctx.shadowOffsetY=r*0.2;ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();
  const rg=ctx.createRadialGradient(x+r*0.1,y+r*0.1,r*0.72,x,y,r);rg.addColorStop(0,"rgba(120,220,225,0)");rg.addColorStop(1,"rgba(150,235,240,0.5)");ctx.fillStyle=rg;ctx.fillRect(x-r,y-r,2*r,2*r);
  ctx.strokeStyle="rgba(150,220,225,0.35)";ctx.lineWidth=Math.max(1,r/58);ctx.beginPath();ctx.ellipse(x,y+r*0.09,r,r*0.28,0,0,Math.PI);ctx.stroke();
  // the band: dark glass, and in it a light that moves slowly along it
  const bw=r*1.3,bh=r*0.32,by=y-r*0.11;rr(ctx,x-bw/2,by-bh/2,bw,bh,bh/2);ctx.fillStyle="rgba(2,8,10,0.94)";ctx.fill();
  const ih=bh-r*0.11,sc=0.5+0.5*Math.sin(t*1.8*TAU/4);g=ctx.createLinearGradient(x-bw/2,0,x+bw/2,0);g.addColorStop(0,rgba(col,0.3));g.addColorStop(clamp(sc,0.01,0.99),rgba(mix(col,[255,255,255],0.55),1));g.addColorStop(1,rgba(col,0.3));
  ctx.shadowColor=rgba(col,1);ctx.shadowBlur=r*0.3;rr(ctx,x-bw/2+r*0.045,by-ih/2,bw-r*0.09,ih,ih/2);ctx.fillStyle=g;ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle="rgba(230,250,250,0.32)";ctx.beginPath();ctx.ellipse(x-r*0.42,y-r*0.56,r*0.22,r*0.09,-0.6,0,TAU);ctx.fill();ctx.restore();
  ctx.beginPath();ctx.arc(x,y,r-0.5,0,TAU);ctx.strokeStyle="rgba(170,240,240,0.5)";ctx.lineWidth=1.4;ctx.stroke();ctx.restore();}
function ag_model(ctx,x,y,r,o){dp_sphere(ctx,x,y,r,o);}
function dp_sphereIcon(ctx,x,y,r,t){dp_sphere(ctx,x,y,r,{t,halo:false});}

/* ===== Data protection and privacy: the tools' pages =====
   The tool films show Databricks, GitHub, dbt and Azure as their docs name them on the day, drawn, not filmed (the author, 5 November
   2026): a tool's page is a window of frosted glass, its header the tool's logo, unaltered, and the tool's or service's full name
   beside it, with where in the tool the page is on the right; then the page's title, and what it holds, drawn with the calls below.
   The logos come from The Inner Life of Data's logos.js (databricks, dbt) and this kit's logos.js (github, azure, entra, pim,
   managedIdentity, keyVault, storage, privateEndpoint, groups, users): a film that shows them says "logos": true in its film.json.
   The ideas films name no tool and draw none of this.
   dp_page(ctx, x, y, w, h, {tool, name, where, title, col, a, behind}) draws the window and returns the box its content goes in.
   dp_rows(ctx, x, y, cols, rows, {lh, a, line}) a table: cols [{t: "Group", w: 360}, ...], rows of cells, each a string, or {t, col}
   (words in a meaning's colour), {pill, col} (a pill), {mono: true, t} (a name as the tool writes it), {tick: "green"}, {cross: "coral"};
   returns the y under it. dp_field(ctx, x, y, label, value, {col, mono}) a label over its value. dp_switch(ctx, x, y, u, {col, label})
   a switch, from off (u 0) to on (u 1), in the colour of what it switches on. */
function dp_page(ctx,x,y,w,h,o){o=o||{};const col=o.col||"cyan",a=o.a==null?1:o.a,box={x:x+32,y:y+76+(o.title?90:28),w:w-64,h:0};box.h=y+h-box.y-24;if(a<=0)return box;
  ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col,r:18,behind:o.behind,glowA:0.8});
  const hb=76;ctx.save();rr(ctx,x,y,w,h,18);ctx.clip();ctx.fillStyle="rgba(4,16,20,0.55)";ctx.fillRect(x,y,w,hb);ctx.fillStyle=rgba(dp_f(col),0.55);ctx.fillRect(x,y+hb-1.5,w,1.5);ctx.restore();
  let lx=x+28;const im=o.tool&&typeof LOGO!=="undefined"&&LOGO[o.tool];
  if(im&&im.width){const lh=o.logoH||38,lw=lh*im.width/im.height;ctx.drawImage(im,lx,y+(hb-lh)/2,lw,lh);lx+=lw+20;}
  if(o.name)dp_T(ctx,o.name,lx,y+49,{w:700,size:30});
  if(o.where)dp_T(ctx,o.where,x+w-28,y+49,{w:600,size:28,col:"mut",align:"right"});
  if(o.title)dp_T(ctx,o.title,x+32,y+hb+58,{w:700,size:36});
  ctx.restore();return box;}
function dp_rows(ctx,x,y,cols,rows,o){o=o||{};const lh=o.lh||58,a=o.a==null?1:o.a,W_=cols.reduce((s,c)=>s+c.w,0);if(a<=0)return y+lh*(rows.length+1);
  ctx.save();ctx.globalAlpha*=a;let cx=x;for(const c of cols){if(c.t)dp_T(ctx,c.t,cx,y+30,{w:700,size:28,col:"mut"});cx+=c.w;}
  ctx.fillStyle=rgba(DP.T.mut,0.4);ctx.fillRect(x,y+lh-14,W_,1.4);
  rows.forEach((r,j)=>{const ry=y+lh*(j+1)+30;let cx2=x;r.forEach((cell,i)=>{const cw=cols[i]?cols[i].w:200,ra=cell&&cell.a!=null?cell.a:1;if(cell==null||ra<=0){cx2+=cw;return;}
      ctx.save();ctx.globalAlpha*=ra;
      if(typeof cell==="string")dp_T(ctx,cell,cx2,ry,{w:600,size:28});
      else if(cell.pill)dp_pill(ctx,cx2,ry,cell.pill,cell.col||"grey",{size:28,glow:8});
      else if(cell.tick)dp_tick(ctx,cx2+20,ry-10,cell.tick,cell.p);
      else if(cell.cross)dp_cross(ctx,cx2+20,ry-10,cell.cross,cell.p);
      else dp_T(ctx,cell.t,cx2,ry,{w:cell.w||(cell.mono?500:600),size:cell.size||28,f:cell.mono?"mono":undefined,col:cell.col||"ink"});
      ctx.restore();cx2+=cw;});
    if(o.line!==false&&j<rows.length-1){ctx.fillStyle=rgba(DP.T.mut,0.22);ctx.fillRect(x,y+lh*(j+2)-14,W_,1.2);}});
  ctx.restore();return y+lh*(rows.length+1);}
function dp_field(ctx,x,y,label,value,o){o=o||{};dp_T(ctx,label,x,y,{w:600,size:28,col:"mut",a:o.a});dp_T(ctx,value,x,y+44,{w:o.mono?500:700,size:30,f:o.mono?"mono":undefined,col:o.col||"ink",a:o.a});}
function dp_switch(ctx,x,y,u,o){o=o||{};u=clamp(u||0,0,1);const c=dp_f(o.col||"amber"),off=[40,62,68],tc=mix(off,c,u),a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();if(u>0.02){ctx.shadowColor=rgba(c,0.6*u);ctx.shadowBlur=14;}rr(ctx,x,y,72,40,20);ctx.fillStyle=rgba(tc,1);ctx.fill();ctx.restore();
  rr(ctx,x+0.6,y+0.6,70.8,38.8,19.4);ctx.strokeStyle=rgba(mix(tc,[255,255,255],0.4),0.9);ctx.lineWidth=1.2;ctx.stroke();
  const kx=x+20+32*ag_sine(u);ctx.fillStyle=u>0.5?rgba(DP.on,1):"rgb(196,214,215)";ctx.beginPath();ctx.arc(kx,y+20,14,0,TAU);ctx.fill();
  if(o.label)dp_T(ctx,o.label,x+92,y+30,{w:600,size:28,col:o.labelCol||"ink"});ctx.restore();}

/* ===== Walls, doors and keys: Ragusa, 1377 =====
   The opening story's places, painted once in the module's night light (Night glass): the same petrol sky as the hall, the stone of
   the walls cool, the windows warm, the sea dark and slow. Only the shapes of walls, gates, ships and roofs: nothing is borrowed from
   the city's own arts or crafts, no motifs and no lettering. Every name here starts with wd_ or WD_ (the film's own).
     wdRagusa, wdRagusaNight, wdRagusaDawn   the walled city from the sea, at dusk, at night and at dawn (one room)
     wdGate, wdGateNight                     a gate in the walls, from the quay outside (one room)
     wdStreet, wdStreetNight                 the street up from the gate to the rector's palace (one room)
     wdCouncil                               the Great Council's hall
     wdTable                                 the table where the law is written, from just above
     wdCoast                                 the coast as a frosted map: the city, the open sea, Mrkan and Cavtat
   What moves is drawn live over them: ships, the gates' light and their doors, small people far off (wd_walker), lanterns, the haze
   of the sickness (coral, the module's colour for what must be kept out), windows going dark, the moon, the council's parchment. */

/* ---------------------------------------------------------------- the night's colours, and a few painting helpers */
const WD={
  sky:{dusk:[[6,17,22],[13,35,43],[40,66,74],[124,98,90]],night:[[4,12,17],[8,24,31],[18,40,48],[30,48,56]],dawn:[[12,30,40],[40,72,84],[118,136,138],[232,164,124]]},
  stone:[104,120,124],stoneLit:[150,166,168],stoneDark:[52,66,70],roof:[104,70,62],roofLit:[140,96,80],
  warm:[255,198,122],lamp:[255,214,150],sea:[[6,20,26],[4,14,19]],rock:[30,44,48],
  haze:[255,106,90],ice:[190,245,245]
};
// the light of each time of day on what is painted: f scales the stone and roofs, w the windows' warmth, rim the sky's light on top edges
const WD_TOD={dusk:{f:1,w:1,rim:0.32,stars:0.5},night:{f:0.62,w:1.1,rim:0.2,stars:1},dawn:{f:1.18,w:0.45,rim:0.42,stars:0.1}};
const wd_sc=(c,k)=>c.map(v=>clamp(Math.round(v*k),0,255));
function wd_glow(c,x,y,r,col,a){if(!(a>0))return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}
function wd_sky(c,tod,h){const S=WD.sky[tod],g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,rgba(S[0],1));g.addColorStop(0.45,rgba(S[1],1));g.addColorStop(0.85,rgba(S[2],1));g.addColorStop(1,rgba(mix(S[2],S[3],0.5),1));
  c.fillStyle=g;c.fillRect(0,0,W,h);
  // a low glow where the sun went down (or comes up), behind the hills
  const gx=tod==="dawn"?1560:340,gy=h*0.62;c.save();c.translate(gx,gy);c.scale(1.9,0.55);const gl=c.createRadialGradient(0,0,0,0,0,700);
  gl.addColorStop(0,rgba(S[3],tod==="night"?0.10:tod==="dawn"?0.62:0.46));gl.addColorStop(0.5,rgba(S[3],tod==="night"?0.04:0.16));gl.addColorStop(1,rgba(S[3],0));c.fillStyle=gl;c.fillRect(-700,-700,1400,1400);c.restore();
  const R=ag_rnd(41),st=WD_TOD[tod].stars;for(let i=0;i<120;i++){const x=R()*W,y=R()*h*0.62,r=0.6+R()*1.5,a=(0.05+R()*0.3)*st*(1-y/(h*0.7));if(a>0.01){c.fillStyle=rgba([210,240,240],a);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}}}
// a ridge of hills: points [[x, y], ...] joined smoothly, filled to the foot, with the sky's light along its top
function wd_ridge(c,pts,foot,col,rimA){c.beginPath();c.moveTo(pts[0][0],foot);c.lineTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];c.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}
  const L=pts[pts.length-1];c.lineTo(L[0],L[1]);c.lineTo(L[0],foot);c.closePath();c.fillStyle=rgba(col,1);c.fill();
  if(rimA>0){c.save();c.strokeStyle=rgba(WD.ice,rimA);c.lineWidth=1.6;c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];c.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}c.stroke();c.restore();}}
// a wall of stone: a box with courses of ashlar, lit from the sky on its top, darker to its foot; o.k the time's light
function wd_stoneBox(c,x,y,w,h,k,o){o=o||{};const base=wd_sc(o.col||WD.stone,k),g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(mix(base,WD.stoneLit,0.35),1));g.addColorStop(1,rgba(mix(base,WD.stoneDark,0.55),1));
  c.fillStyle=g;c.fillRect(x,y,w,h);if(o.courses!==false){const ch=o.course||10,R=ag_rnd(Math.round(x*7+y*3));c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
    c.strokeStyle=rgba(wd_sc(WD.stoneDark,k),0.22);c.lineWidth=1;for(let yy=y+ch;yy<y+h;yy+=ch){c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke();
      const off=R()*ch*2;for(let xx=x+off;xx<x+w;xx+=ch*(1.6+R()*1.4)){c.beginPath();c.moveTo(xx,yy-ch);c.lineTo(xx,yy);c.stroke();}}c.restore();}
  c.fillStyle=rgba(WD.ice,o.rim==null?0.25:o.rim);c.fillRect(x,y,w,1.5);}
// battlements along a wall's top: merlons every step px
function wd_merlons(c,x,y,w,k,step,mh){step=step||14;mh=mh||7;c.fillStyle=rgba(mix(wd_sc(WD.stone,k),WD.stoneLit,0.3),1);for(let xx=x;xx<x+w-step*0.4;xx+=step){c.fillRect(xx,y-mh,step*0.55,mh);}
  c.fillStyle=rgba(WD.ice,0.16);for(let xx=x;xx<x+w-step*0.4;xx+=step)c.fillRect(xx,y-mh,step*0.55,1.2);}
// a warm window: a small lit opening, with its glow; lit 0 to 1
function wd_window(c,x,y,w,h,lit,k){if(lit<=0){c.fillStyle=rgba(wd_sc([24,30,34],k),1);c.fillRect(x,y,w,h);return;}
  c.fillStyle=rgba(mix([40,36,34],WD.warm,lit),1);c.fillRect(x,y,w,h);wd_glow(c,x+w/2,y+h/2,Math.max(w,h)*2.2,WD.warm,0.16*lit);}
// a round arch: the path of an opening w wide, h high to its crown, from its foot at (x, y)
function wd_archPath(c,x,y,w,h){const r=w/2;c.moveTo(x,y);c.lineTo(x,y-h+r);c.arc(x+r,y-h+r,r,Math.PI,0);c.lineTo(x+w,y);c.closePath();}

/* ---------------------------------------------------------------- the city from the sea
   The city on its rocks, from the sea a little way out: the hill behind it, the landward walls along the top with a great round
   tower, the roofs rising between, the sea walls along the shore, the harbour on the right with its mole, and three gates, the only
   ways in (WD_GATES: the land gate on the west, the harbour gate, the land gate on the east), whose light and doors are drawn live. */
const WD_GATES=[[318,682,40,52],[1386,712,42,54],[1716,676,38,48]];   // each gate: x of its left side, y of its foot, w, h
const WD_HARBOUR={x0:1300,x1:1690,y:752};                             // the basin, where ships lie
// rocks along a shore: a jagged band from x0 to x1, its top near y0, its foot at y1, faceted and lit along their tops
function wd_rocks(c,x0,x1,y0,y1,k,seed){const R=ag_rnd(seed),pts=[];for(let x=x0;x<=x1;x+=14+R()*22)pts.push([x,y0+R()*16-4]);
  c.fillStyle=rgba(wd_sc(WD.rock,k),1);c.beginPath();c.moveTo(x0,y1);pts.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(x1,y1);c.closePath();c.fill();
  for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],m=[(a[0]+b[0])/2,(a[1]+b[1])/2+10+R()*12];
    c.fillStyle=rgba(mix(wd_sc(WD.rock,k),[60,80,84],0.25+R()*0.3),1);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(m[0],m[1]);c.closePath();c.fill();
    c.strokeStyle=rgba(WD.ice,0.10+R()*0.08);c.lineWidth=1.2;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}}
function wd_paintRagusa(c,tod){const T=WD_TOD[tod],k=T.f,R=ag_rnd(1377),stone=wd_sc(WD.stone,k);
  wd_sky(c,tod,650);
  // thin clouds low over the hills, catching what light is left
  c.save();c.globalCompositeOperation="lighter";for(let i=0;i<7;i++){const x=R()*W,y=110+R()*200,w=300+R()*500;c.save();c.translate(x,y);c.scale(1,0.08);wd_glow(c,0,0,w,mix(WD.sky[tod][3],WD.ice,0.4),0.05);c.restore();}c.restore();
  // the hill behind the city, and a nearer slope, with the scrub on it as soft dark patches
  wd_ridge(c,[[0,430],[180,400],[420,330],[640,268],[860,236],[1060,250],[1260,300],[1500,360],[1720,392],[1920,420]],660,wd_sc([22,42,48],k*0.9),0.12);
  wd_ridge(c,[[0,500],[200,470],[420,440],[700,404],[980,392],[1240,420],[1500,452],[1760,470],[1920,486]],660,wd_sc([15,31,37],k*0.9),0.14);
  for(let i=0;i<900;i++){const x=R()*W,y=270+R()*380,r=1+R()*2.6;c.fillStyle=rgba([4,12,16],0.10+R()*0.16);c.beginPath();c.ellipse(x,y,r*1.5,r,0,0,TAU);c.fill();}
  // the sea
  let g=c.createLinearGradient(0,620,0,H);g.addColorStop(0,rgba(mix(WD.sea[0],WD.sky[tod][2],0.5),1));g.addColorStop(0.3,rgba(WD.sea[0],1));g.addColorStop(1,rgba(WD.sea[1],1));c.fillStyle=g;c.fillRect(0,620,W,H-620);
  // the slope the city climbs, inside the walls
  c.fillStyle=rgba(wd_sc([28,42,46],k),1);c.beginPath();c.moveTo(250,700);c.lineTo(300,470);c.lineTo(1500,486);c.lineTo(1660,700);c.closePath();c.fill();
  // houses, back to front, rising up the slope: each a wall of plastered stone, a tiled roof, and its windows, most of them lit;
  // the farther rows a little darker and cooler, as the air between dims them
  for(let row=0;row<9;row++){const y=482+row*23,x0=316,x1=1490,dk=0.72+0.28*row/8,cool=0.35*(1-row/8);
    for(let x=x0+R()*20;x<x1;){const w=30+R()*44,h=24+R()*18,top=y+R()*8,face=mix(mix([132,124,114],WD.stone,0.4),[70,92,102],cool);
      const fg=c.createLinearGradient(0,top,0,top+h+18);fg.addColorStop(0,rgba(wd_sc(face,k*dk*1.02),1));fg.addColorStop(1,rgba(wd_sc(face,k*dk*0.62),1));c.fillStyle=fg;c.fillRect(x,top,w,h+18);
      c.fillStyle=rgba(wd_sc([20,26,30],1),0.35);c.fillRect(x+w-3,top,3,h+18);
      const rc=mix(mix(WD.roof,WD.roofLit,R()*0.6),[60,70,80],cool);c.fillStyle=rgba(wd_sc(rc,k*dk),1);c.beginPath();c.moveTo(x-3,top+2);c.lineTo(x+w*0.5,top-9-R()*6);c.lineTo(x+w+3,top+2);c.closePath();c.fill();
      c.fillStyle=rgba(wd_sc(rc,k*dk*0.7),1);c.beginPath();c.moveTo(x+w*0.5,top-9);c.lineTo(x+w+3,top+2);c.lineTo(x+w*0.5,top+2);c.closePath();c.fill();
      c.fillStyle=rgba(WD.ice,0.05+0.05*T.rim);c.fillRect(x+w*0.15,top-4,w*0.32,1);
      const wl=()=>R()<0.66?T.w*(0.7+0.3*R()):0;
      if(R()<0.8)wd_window(c,x+w*0.28,top+9,4,6,wl(),k);if(R()<0.55)wd_window(c,x+w*0.64,top+10,4,6,wl(),k);if(R()<0.3)wd_window(c,x+w*0.46,top+h-2,4,6,wl(),k);
      x+=w+1+R()*5;}}
  // the bell tower by the harbour gate, and a church's long roof
  wd_stoneBox(c,1196,384,42,232,k*0.92,{course:12,rim:0.3});c.fillStyle=rgba(wd_sc(WD.roof,k),1);c.beginPath();c.moveTo(1190,386);c.lineTo(1217,322);c.lineTo(1244,386);c.closePath();c.fill();
  c.fillStyle=rgba(wd_sc(WD.roof,k*0.7),1);c.beginPath();c.moveTo(1217,322);c.lineTo(1244,386);c.lineTo(1217,386);c.closePath();c.fill();
  for(const yy of [404,466])wd_window(c,1209,yy,16,28,0,k);
  wd_stoneBox(c,820,470,150,88,k*0.86,{course:12,rim:0.2});c.fillStyle=rgba(wd_sc(WD.roof,k),1);c.beginPath();c.moveTo(812,472);c.lineTo(895,430);c.lineTo(978,472);c.closePath();c.fill();
  c.fillStyle=rgba(wd_sc(WD.roof,k*0.72),1);c.beginPath();c.moveTo(895,430);c.lineTo(978,472);c.lineTo(895,472);c.closePath();c.fill();wd_window(c,880,500,12,24,T.w*0.8,k);
  // the landward walls along the top, and their towers; the great round tower on the north-west corner
  wd_stoneBox(c,300,458,1200,28,k*0.86,{course:9});wd_merlons(c,300,458,1200,k*0.86,14,7);
  for(const tx of [700,980,1262,1460]){wd_stoneBox(c,tx-22,428,44,62,k*0.9,{course:10});wd_merlons(c,tx-22,428,44,k*0.9,11,6);}
  g=c.createLinearGradient(430,0,610,0);g.addColorStop(0,rgba(wd_sc(stone,0.62),1));g.addColorStop(0.32,rgba(mix(stone,WD.stoneLit,0.3),1));g.addColorStop(1,rgba(wd_sc(stone,0.5),1));
  const tower=cc=>{cc.beginPath();cc.moveTo(430,502);cc.lineTo(440,382);cc.quadraticCurveTo(520,364,600,382);cc.lineTo(610,502);cc.closePath();};
  tower(c);c.fillStyle=g;c.fill();c.save();tower(c);c.clip();c.strokeStyle=rgba(wd_sc(WD.stoneDark,k),0.28);c.lineWidth=1;
  for(let yy=392;yy<502;yy+=11){c.beginPath();c.moveTo(428,yy);c.quadraticCurveTo(520,yy+7,612,yy);c.stroke();}
  const sg=c.createLinearGradient(0,382,0,502);sg.addColorStop(0,"rgba(0,0,0,0)");sg.addColorStop(1,"rgba(0,0,0,0.3)");c.fillStyle=sg;c.fillRect(420,370,200,140);c.restore();
  wd_merlons(c,444,384,152,k*0.95,13,8);c.fillStyle=rgba(WD.ice,0.24);c.fillRect(444,382,152,1.4);
  // the walls down each side to the sea
  c.fillStyle=rgba(wd_sc(stone,0.66),1);c.beginPath();c.moveTo(284,706);c.lineTo(300,458);c.lineTo(328,458);c.lineTo(320,706);c.closePath();c.fill();
  c.fillStyle=rgba(WD.ice,0.16);c.fillRect(300,458,28,1.3);
  c.fillStyle=rgba(wd_sc(stone,0.62),1);c.beginPath();c.moveTo(1470,458);c.lineTo(1500,458);c.lineTo(1652,694);c.lineTo(1610,694);c.closePath();c.fill();
  c.strokeStyle=rgba(WD.ice,0.16);c.lineWidth=1.3;c.beginPath();c.moveTo(1500,458);c.lineTo(1652,694);c.stroke();
  // the land west and east, under the walls, and cypresses on it
  c.fillStyle=rgba(wd_sc([18,34,38],k),1);c.beginPath();c.moveTo(0,636);c.lineTo(220,636);c.lineTo(290,712);c.lineTo(170,780);c.lineTo(0,792);c.closePath();c.fill();
  c.beginPath();c.moveTo(1650,694);c.lineTo(1920,652);c.lineTo(1920,766);c.lineTo(1850,762);c.lineTo(1650,736);c.closePath();c.fill();
  for(const [x,y,h] of [[110,640,96],[150,648,72],[206,638,112],[1812,662,84],[1866,664,66]]){c.fillStyle=rgba(wd_sc([12,26,24],k),1);c.beginPath();c.moveTo(x,y-h);
    c.bezierCurveTo(x+12,y-h*0.6,x+14,y-h*0.2,x+8,y);c.lineTo(x-8,y);c.bezierCurveTo(x-14,y-h*0.2,x-12,y-h*0.6,x,y-h);c.fill();
    c.strokeStyle=rgba(WD.ice,0.10);c.lineWidth=1.2;c.beginPath();c.moveTo(x,y-h);c.bezierCurveTo(x-12,y-h*0.6,x-14,y-h*0.2,x-8,y);c.stroke();}
  // the rocks the city stands on, then the sea walls along the shore, a little sloped at their foot, with their towers
  wd_rocks(c,150,1320,714,754,k,77);
  const sea=(x,y,w,h)=>{wd_stoneBox(c,x,y,w,h,k*0.95,{course:10});const bg=c.createLinearGradient(0,y+h-22,0,y+h);bg.addColorStop(0,"rgba(0,0,0,0)");bg.addColorStop(1,"rgba(4,12,16,0.45)");c.fillStyle=bg;c.fillRect(x,y+h-22,w,22);};
  sea(290,646,1030,74);wd_merlons(c,290,646,1030,k*0.95,14,7);
  for(const [tx,th] of [[380,118],[640,104],[900,112],[1140,100]]){sea(tx-26,720-th,52,th);wd_merlons(c,tx-26,720-th,52,k*0.95,13,7);c.fillStyle=rgba([14,20,24],0.8);c.fillRect(tx-3,720-th+26,6,12);}
  // the harbour: its walls round the basin, a fortress at its mouth, the mole, and the quay
  sea(1310,670,240,64);wd_merlons(c,1310,670,240,k*0.95,14,6);
  sea(1540,646,120,90);wd_merlons(c,1540,646,120,k*0.95,13,7);
  sea(1650,662,110,74);wd_merlons(c,1650,662,110,k*0.95,13,6);
  c.fillStyle=rgba(wd_sc([66,80,84],k),1);c.fillRect(1300,734,300,12);c.fillStyle=rgba(WD.ice,0.14);c.fillRect(1300,734,300,1.2);
  c.fillStyle=rgba(wd_sc([74,88,92],k),1);c.beginPath();c.moveTo(1592,746);c.lineTo(1860,746);c.lineTo(1880,762);c.lineTo(1600,762);c.closePath();c.fill();c.fillStyle=rgba(WD.ice,0.16);c.fillRect(1592,746,268,1.3);
  // the gates: dark openings in the walls, a stone frame round each, and a bridge to the west one
  for(const [x,y,w,h] of WD_GATES){c.fillStyle=rgba(wd_sc([14,20,24],k),1);c.beginPath();wd_archPath(c,x,y,w,h);c.fill();
    c.strokeStyle=rgba(mix(wd_sc(WD.stoneLit,k),WD.ice,0.2),0.45);c.lineWidth=2.4;c.beginPath();c.moveTo(x-3,y);c.lineTo(x-3,y-h+w/2);c.arc(x+w/2,y-h+w/2,w/2+3,Math.PI,0);c.lineTo(x+w+3,y);c.stroke();}
  c.fillStyle=rgba(wd_sc([70,84,88],k),1);c.fillRect(222,682,98,10);c.fillStyle=rgba(WD.ice,0.12);c.fillRect(222,682,98,1.2);
  for(const x of [236,262,288])c.fillRect(x,692,6,22);
  // a few lanterns on the walls
  for(const [x,y] of [[338,630],[1408,656],[1734,622],[905,600]]){wd_glow(c,x,y,26,WD.lamp,0.32*T.w);c.fillStyle=rgba(WD.lamp,0.95*Math.min(1,T.w));c.beginPath();c.arc(x,y,2.6,0,TAU);c.fill();}
  // the sea: the city mirrored, blurred and broken by slow ripples; light lying on the swell
  const [ref,rx]=ag_buf("wdref",W,320);rx.save();rx.translate(0,750);rx.scale(1,-1);rx.drawImage(c.canvas,0,0,W,H,0,0,W,H);rx.restore();
  const [rb,rbx]=ag_buf("wdrefb",W,320);dp_blurDraw(rbx,ref,0,0,W,320,0,0,W,320,3);
  for(let y=0;y<320;y+=2){const off=Math.sin(y*0.23)*4+Math.sin(y*0.061+1)*7;c.globalAlpha=0.36*Math.pow(1-y/320,1.3);c.drawImage(rb,0,y,W,2,off,750+y,W,2);}c.globalAlpha=1;
  c.save();c.globalCompositeOperation="lighter";for(let i=0;i<260;i++){const x=R()*W,y=764+Math.pow(R(),1.5)*316,w=16+R()*80;c.fillStyle=rgba(WD.ice,0.015+R()*0.04*(1-(y-764)/330));c.fillRect(x,y,w,1.2);}c.restore();
  c.fillStyle="rgba(0,0,0,0.22)";c.fillRect(0,748,W,4);}
AG_PLACES.wdRagusa=c=>wd_paintRagusa(c,"dusk");
AG_PLACES.wdRagusaNight=c=>wd_paintRagusa(c,"night");
AG_PLACES.wdRagusaDawn=c=>wd_paintRagusa(c,"dawn");
AG_ROOMS.wdRagusaNight="wdRagusa";AG_ROOMS.wdRagusaDawn="wdRagusa";

/* ---------------------------------------------------------------- a gate in the walls, from the quay outside
   The walls fill the frame above the quay; the gate's arch in the middle, its passage, and at its far end the street inside, lit
   warm; a tower to the left; the harbour and its water to the right, where a ship can lie at the quay (wd_ship, drawn live); a lantern
   on a bracket by the gate. The gate's doors (wd_gateDoors) and the light in its passage are drawn live: open, shut, or swinging. */
const WD_GATE={x:780,y:780,w:330,h:430};                        // the arch: its left side, its foot, its width, its height to the crown
function wd_paintGate(c,tod){const T=WD_TOD[tod],k=T.f*0.95,R=ag_rnd(1348),G=WD_GATE,stone=wd_sc(WD.stone,k);
  wd_sky(c,tod,700);
  // the far shore across the harbour, low, and the water
  wd_ridge(c,[[1380,560],[1520,520],[1700,540],[1920,500]],700,wd_sc([18,36,42],k),0.12);
  let g=c.createLinearGradient(0,640,0,H);g.addColorStop(0,rgba(mix(WD.sea[0],WD.sky[tod][2],0.4),1));g.addColorStop(1,rgba(WD.sea[1],1));c.fillStyle=g;c.fillRect(1380,640,540,H-640);
  c.save();c.globalCompositeOperation="lighter";for(let i=0;i<90;i++){const x=1390+R()*530,y=660+R()*420,w=14+R()*60;c.fillStyle=rgba(WD.ice,0.02+R()*0.05);c.fillRect(x,y,w,1.2);}c.restore();
  // the wall: big courses of dressed stone, lit from above, darker towards the quay
  const wall=cc=>{cc.beginPath();cc.moveTo(0,0);cc.lineTo(1440,0);cc.lineTo(1440,640);cc.lineTo(1400,800);cc.lineTo(0,800);cc.closePath();};
  wall(c);g=c.createLinearGradient(0,0,0,800);g.addColorStop(0,rgba(wd_sc(stone,0.78),1));g.addColorStop(0.55,rgba(stone,1));g.addColorStop(1,rgba(wd_sc(stone,0.62),1));c.fillStyle=g;c.fill();
  c.save();wall(c);c.clip();for(let y=0;y<800;){const ch=34+R()*14;let x=-R()*90;while(x<1440){const w=60+R()*110;c.fillStyle=rgba(mix(stone,R()<0.5?WD.stoneLit:WD.stoneDark,0.06+R()*0.2),0.55);c.fillRect(x+2,y+2,w-4,ch-4);
      c.fillStyle=rgba(wd_sc(WD.stoneDark,k*0.8),0.5);c.fillRect(x,y,w,2);c.fillRect(x,y,2,ch);c.fillStyle=rgba(WD.ice,0.045);c.fillRect(x+3,y+2,w-6,1.2);x+=w;}y+=ch;}
  // weathering: soft darker streaks down from the top, and the dusk's shade over the whole wall
  for(let i=0;i<26;i++){const x=R()*1440,w=10+R()*50,h=100+R()*500;const sg=c.createLinearGradient(0,0,0,h);sg.addColorStop(0,"rgba(10,20,24,0.08)");sg.addColorStop(1,"rgba(10,20,24,0)");c.fillStyle=sg;c.fillRect(x,0,w,h);}
  c.fillStyle=rgba([6,16,20],0.3);c.fillRect(0,0,1440,800);c.restore();
  // the tower to the left, standing out from the wall, its own shadow on the wall beside it
  g=c.createLinearGradient(160,0,560,0);g.addColorStop(0,rgba(wd_sc(stone,0.55),1));g.addColorStop(0.4,rgba(mix(stone,WD.stoneLit,0.25),1));g.addColorStop(1,rgba(wd_sc(stone,0.7),1));
  c.fillStyle=g;c.fillRect(160,0,400,800);c.save();c.beginPath();c.rect(160,0,400,800);c.clip();for(let y=0;y<800;y+=40){c.fillStyle=rgba(wd_sc(WD.stoneDark,k),0.4);c.fillRect(160,y,400,2);
    for(let x=160+((y/40)%2)*60;x<560;x+=120)c.fillRect(x,y,2,40);}c.restore();
  const ts=c.createLinearGradient(560,0,640,0);ts.addColorStop(0,"rgba(4,12,16,0.5)");ts.addColorStop(1,"rgba(4,12,16,0)");c.fillStyle=ts;c.fillRect(560,0,80,800);
  c.fillStyle=rgba([10,16,20],0.9);rr(c,330,240,22,70,8);c.fill();rr(c,330,470,22,70,8);c.fill();
  // the arch: its stones round the opening, the passage going in, and the street beyond (its light drawn live)
  c.save();c.beginPath();wd_archPath(c,G.x,G.y,G.w,G.h);c.clip();
  g=c.createLinearGradient(0,G.y-G.h,0,G.y);g.addColorStop(0,"rgb(14,18,20)");g.addColorStop(1,"rgb(22,24,24)");c.fillStyle=g;c.fillRect(G.x,G.y-G.h,G.w,G.h);
  // the passage's inner arch, smaller, and the street through it: house fronts, warm windows, paving
  const ix=G.x+70,iw=G.w-140,ih=G.h-120;c.fillStyle="rgb(30,34,34)";c.beginPath();wd_archPath(c,ix,G.y-30,iw,ih);c.fill();
  c.save();c.beginPath();wd_archPath(c,ix+8,G.y-30,iw-16,ih-12);c.clip();g=c.createLinearGradient(0,G.y-30-ih,0,G.y-30);g.addColorStop(0,"rgb(26,36,40)");g.addColorStop(1,"rgb(60,50,40)");c.fillStyle=g;c.fillRect(ix,G.y-30-ih,iw,ih);
  for(let i=0;i<4;i++){const hx=ix+8+i*(iw/4),hy=G.y-30-ih*0.66;c.fillStyle=rgba([84,74,64],1);c.fillRect(hx,hy,iw/4-4,ih*0.66);wd_window(c,hx+10,hy+20,10,16,0.9,1);wd_window(c,hx+10,hy+70,10,16,0.8,1);}
  c.fillStyle="rgb(70,58,46)";c.fillRect(ix,G.y-40,iw,12);c.restore();
  c.restore();
  // voussoirs: the wedge stones of the arch, lit along their faces
  const cx=G.x+G.w/2,cy=G.y-G.h+G.w/2,r0=G.w/2,r1=G.w/2+44;for(let i=0;i<13;i++){const a0=Math.PI+i*Math.PI/13,a1=a0+Math.PI/13;c.beginPath();c.arc(cx,cy,r1,a0+0.01,a1-0.01);c.arc(cx,cy,r0,a1-0.01,a0+0.01,true);c.closePath();
    c.fillStyle=rgba(wd_sc(mix(stone,i%2?WD.stoneLit:WD.stone,0.3),0.86),1);c.fill();c.strokeStyle=rgba(wd_sc(WD.stoneDark,k),0.6);c.lineWidth=1.5;c.stroke();}
  for(const side of [G.x-44,G.x+G.w]){c.fillStyle=rgba(mix(stone,WD.stoneLit,0.2),1);c.fillRect(side,cy,44,G.y-cy);for(let y=cy;y<G.y;y+=46){c.fillStyle=rgba(wd_sc(WD.stoneDark,k),0.6);c.fillRect(side,y,44,1.6);}}
  c.fillStyle=rgba(WD.ice,0.18);c.beginPath();c.arc(cx,cy,r1,Math.PI,TAU);c.lineWidth=1.4;c.strokeStyle=rgba(WD.ice,0.2);c.stroke();
  // the lantern's bracket by the gate (its flame drawn live)
  c.strokeStyle="rgb(30,30,32)";c.lineWidth=5;c.beginPath();c.moveTo(G.x+G.w+60,480);c.lineTo(G.x+G.w+110,480);c.lineTo(G.x+G.w+110,500);c.stroke();
  // the quay: big slabs going away from us, wet and catching the light
  g=c.createLinearGradient(0,780,0,H);g.addColorStop(0,rgba(wd_sc([66,74,74],k),1));g.addColorStop(1,rgba(wd_sc([36,44,46],k),1));c.fillStyle=g;c.beginPath();c.moveTo(0,780);c.lineTo(1400,780);c.lineTo(1520,H);c.lineTo(0,H);c.closePath();c.fill();
  c.save();c.beginPath();c.moveTo(0,780);c.lineTo(1400,780);c.lineTo(1520,H);c.lineTo(0,H);c.closePath();c.clip();c.strokeStyle=rgba([10,16,18],0.4);c.lineWidth=1.5;
  for(let j=1;j<9;j++){const y=780+Math.pow(j/9,1.6)*300;c.beginPath();c.moveTo(0,y);c.lineTo(1520,y);c.stroke();}
  for(let i=-10;i<16;i++){c.beginPath();c.moveTo(G.x+G.w/2+i*90,780);c.lineTo(G.x+G.w/2+i*190,H);c.stroke();}
  c.restore();
  // the quay's edge over the water, and a few bollards and bales waiting
  c.fillStyle=rgba(wd_sc([90,100,100],k),1);c.beginPath();c.moveTo(1400,780);c.lineTo(1440,780);c.lineTo(1560,H);c.lineTo(1520,H);c.closePath();c.fill();
  for(const [x,y,s] of [[1330,820,1],[1420,930,1.5]]){c.fillStyle="rgb(20,24,26)";rr(c,x-10*s,y-30*s,20*s,30*s,6*s);c.fill();c.fillStyle=rgba(WD.ice,0.15);c.fillRect(x-8*s,y-30*s,16*s,1.5);}
  c.fillStyle="rgba(0,0,0,0.28)";c.fillRect(0,776,1400,6);}
AG_PLACES.wdGate=c=>wd_paintGate(c,"dusk");
AG_PLACES.wdGateNight=c=>wd_paintGate(c,"night");
AG_ROOMS.wdGateNight="wdGate";
// the light in the gate's passage and the street beyond (0 dark, 1 lit), and the haze drifting in (coral, 0 to 1, u how far in)
function wd_gateLight(ctx,a){if(a<=0)return;const G=WD_GATE;ctx.save();ctx.globalCompositeOperation="lighter";ctx.beginPath();wd_archPath(ctx,G.x,G.y,G.w,G.h);ctx.clip();
  wd_glow(ctx,G.x+G.w/2,G.y-120,320,WD.lamp,0.16*a);ctx.restore();}
// the gate's two doors of oak planks with iron bands: open 1 (folded back into the passage), shut 0; a lock in the middle when shut
function wd_gateDoors(ctx,open,o){o=o||{};const G=WD_GATE,u=clamp(open,0,1);if(u>=0.999)return;const cx=G.x+G.w/2,top=G.y-G.h;ctx.save();ctx.beginPath();wd_archPath(ctx,G.x,G.y,G.w,G.h);ctx.clip();
  for(const side of [-1,1]){const w=G.w/2*(1-u*0.86),x0=side<0?G.x:cx+(G.w/2-w)*0;ctx.save();
    // a door seen turning on its hinge: it narrows as it opens, darker as it turns away
    const x=side<0?G.x:G.x+G.w-w;const g=ctx.createLinearGradient(x,0,x+w,0),base=mix([58,44,34],[30,24,20],u*0.8);g.addColorStop(0,rgba(base,1));g.addColorStop(1,rgba(mix(base,[0,0,0],0.25),1));
    ctx.fillStyle=g;ctx.fillRect(x,top,w,G.h);ctx.strokeStyle="rgba(12,8,6,0.6)";ctx.lineWidth=1.5;for(let i=1;i<6;i++){const px=x+w*i/6;ctx.beginPath();ctx.moveTo(px,top);ctx.lineTo(px,G.y);ctx.stroke();}
    ctx.fillStyle="rgb(26,26,28)";for(const by of [G.y-80,G.y-220,G.y-340])ctx.fillRect(x,by,w,9);
    ctx.fillStyle="rgba(200,220,220,0.18)";for(const by of [G.y-80,G.y-220,G.y-340])ctx.fillRect(x,by,w,1.2);ctx.restore();}
  if(u<0.05&&o.lock!==false){ctx.fillStyle="rgb(30,28,28)";rr(ctx,cx-16,G.y-200,32,46,5);ctx.fill();ctx.fillStyle="rgba(220,200,160,0.35)";ctx.fillRect(cx-14,G.y-198,28,1.4);ctx.fillStyle="rgb(8,8,8)";ctx.beginPath();ctx.arc(cx,G.y-184,4,0,TAU);ctx.fill();ctx.fillRect(cx-1.5,G.y-182,3,10);}
  ctx.restore();}
// the lantern by the gate: its flame and its light on the wall and the quay
function wd_gateLantern(ctx,t,a){if(a<=0)return;const G=WD_GATE,x=G.x+G.w+110,y=528,f=1+0.05*Math.sin(t*7.3)+0.03*Math.sin(t*13.1);ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,x,y,240*f,WD.lamp,0.22);wd_glow(ctx,x,y+300,260,WD.lamp,0.06);ctx.restore();
  ctx.fillStyle="rgb(26,24,22)";ctx.beginPath();ctx.moveTo(x-16,y-26);ctx.lineTo(x+16,y-26);ctx.lineTo(x+20,y+22);ctx.lineTo(x-20,y+22);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(WD.lamp,0.95);ctx.fillRect(x-12,y-20,24,38);ctx.fillStyle="rgb(255,244,214)";ctx.beginPath();ctx.ellipse(x,y+2,4,9*f,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(26,24,22)";ctx.fillRect(x-1.5,y-20,3,38);ctx.fillRect(x-18,y-30,36,6);ctx.restore();}

/* ---------------------------------------------------------------- people far off, ships, haze
   wd_walker(ctx, x, y, s, o): a person seen far off, as a lit silhouette (no face at this size): a cloak or a tunic to the knee, a
   hood or a cap, walking (o.ph, the step's phase; o.walk 0 to 1) or standing; facing right, or left with o.flip; o.back seen from
   behind. What they carry: o.carry "bale" (on the near shoulder), "barrel" (rolled before them), "lantern" (held low, lit), "keys"
   (a ring of great iron keys held before them). (x, y) is between the feet; s 1 is 180 px from the feet to the crown. o.light: the
   warm side's strength (from a lantern or a lit door), o.col the cloak's colour. */
function wd_walker(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const ph=o.ph||0,wk=o.walk==null?1:o.walk,bob=-Math.abs(Math.sin(ph))*1.8*wk,sw=Math.sin(ph)*0.34*wk,
    col=o.col||[52,58,62],lit=o.light==null?0.5:o.light,dir=o.flip?-1:1;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(dir*s*1.74,s*1.74);ctx.translate(0,bob);
  const dark=mix(col,[6,12,16],0.5),warm=mix(col,[255,200,140],0.32*lit),hose=mix(dark,[0,0,0],0.25),ice=[180,235,235];
  // legs under the hem, stepping, feet a little apart when standing (the far one darker)
  const leg=(ang,dx,c0)=>{ctx.save();ctx.translate(dx,-29);ctx.rotate(ang);ctx.fillStyle=rgba(c0,1);ctx.beginPath();ctx.moveTo(-3.1,0);ctx.bezierCurveTo(-3.4,10,-2.8,20,-2.2,27);ctx.lineTo(2.4,27);ctx.bezierCurveTo(3,20,3.4,10,3.1,0);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgb(16,14,14)";ctx.beginPath();ctx.moveTo(-2.6,26);ctx.bezierCurveTo(-3,29.5,4,30.5,6.4,29);ctx.lineTo(2.6,26);ctx.closePath();ctx.fill();ctx.restore();};
  leg(-sw,-2.6*(1-wk*0.6),mix(hose,[0,0,0],0.3));leg(sw,2.6*(1-wk*0.6),hose);
  // the barrel, on its side, rolled before them: its end towards us, its hoops, a mark that turns as it rolls
  if(o.carry==="barrel"){ctx.save();ctx.translate(19,-14);ctx.fillStyle="rgb(86,62,42)";ctx.beginPath();ctx.ellipse(0,0,13,14,0,0,TAU);ctx.fill();ctx.strokeStyle="rgb(40,32,28)";ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(0,0,13,14,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,9,10,0,0,TAU);ctx.stroke();ctx.rotate(ph*0.7);ctx.strokeStyle="rgba(30,24,20,0.7)";ctx.lineWidth=1.2;
    for(let i=0;i<4;i++){ctx.rotate(Math.PI/4);ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(9,0);ctx.stroke();}ctx.restore();
    ctx.fillStyle="rgba(200,235,235,0.25)";ctx.beginPath();ctx.arc(19,-14,13.5,-2.6,-1.6);ctx.lineTo(19,-14);ctx.fill();}
  // the cloak, from the shoulders to mid-calf, falling in an A from them, its hem a soft curve; folds down it; lit on the side facing
  // the light, a cool rim along its back
  const cloak=cc=>{cc.beginPath();cc.moveTo(-4,-87);cc.bezierCurveTo(-9.5,-86,-11,-81,-11.4,-74);cc.bezierCurveTo(-12,-60,-13.4,-44,-14.4,-28);cc.quadraticCurveTo(0,-24.5,14,-28.4);
    cc.bezierCurveTo(13,-44,11.6,-60,10.8,-74);cc.bezierCurveTo(10.4,-81,8.6,-86,4,-87);cc.closePath();};
  cloak(ctx);let g=ctx.createLinearGradient(-14,0,14,0);g.addColorStop(0,rgba(dark,1));g.addColorStop(0.55,rgba(col,1));g.addColorStop(1,rgba(warm,1));ctx.fillStyle=g;ctx.fill();
  ctx.save();cloak(ctx);ctx.clip();
  for(const [x0,x1,d] of [[-5,-8,0.35],[3,4,0.3],[8,10,0.22]]){ctx.strokeStyle=rgba(mix(dark,[0,0,0],0.5),d);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x0*0.6,-74);ctx.quadraticCurveTo(x0,-50,x1,-27);ctx.stroke();
    ctx.strokeStyle=rgba(mix(col,[255,255,255],0.2),d*0.4);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x0*0.6+1.4,-74);ctx.quadraticCurveTo(x0+1.4,-50,x1+1.4,-27);ctx.stroke();}
  // the near arm, hanging under the cloak, a little darker at its edge
  if(o.carry!=="barrel"){ctx.strokeStyle=rgba(mix(dark,[0,0,0],0.3),0.45);ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(8.8,-80);ctx.quadraticCurveTo(10.6,-64,9.6,-50);ctx.stroke();}
  const sg=ctx.createLinearGradient(0,-90,0,-26);sg.addColorStop(0,"rgba(255,255,255,0.05)");sg.addColorStop(1,"rgba(0,0,0,0.18)");ctx.fillStyle=sg;ctx.fillRect(-16,-90,32,66);ctx.restore();
  ctx.strokeStyle=rgba(ice,0.4);ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-10.6,-80);ctx.bezierCurveTo(-11.6,-66,-13,-46,-14,-30);ctx.stroke();
  // the head: a hood framing the face, or a cap; seen from behind, only the hood
  const skin=mix([152,112,88],[40,40,46],0.3);
  if(o.hood!==false){const hood=cc=>{cc.beginPath();cc.moveTo(-8.4,-83);cc.bezierCurveTo(-11.4,-90,-10.4,-102,-1.6,-104.6);cc.bezierCurveTo(5.6,-105.6,10.6,-100,10.2,-91);cc.bezierCurveTo(9.6,-86,7.6,-83,4.8,-82);cc.quadraticCurveTo(-2,-80.6,-8.4,-83);cc.closePath();};
    hood(ctx);const hg=ctx.createLinearGradient(-10,0,10,0);hg.addColorStop(0,rgba(mix(dark,[0,0,0],0.1),1));hg.addColorStop(1,rgba(mix(col,warm,0.5),1));ctx.fillStyle=hg;ctx.fill();
    if(!o.back){ctx.fillStyle="rgba(10,8,8,0.55)";ctx.beginPath();ctx.ellipse(3.6,-92,4.6,6.6,0.08,0,TAU);ctx.fill();ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(4.4,-91.6,3.4,5.4,0.08,0,TAU);ctx.fill();}
    else{ctx.strokeStyle=rgba(mix(dark,[0,0,0],0.4),0.5);ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(0.6,-103);ctx.quadraticCurveTo(-0.6,-94,0.4,-84);ctx.stroke();}
    ctx.strokeStyle=rgba(ice,0.45);ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-8.6,-84);ctx.bezierCurveTo(-11.2,-90,-10.2,-101,-2,-104);ctx.stroke();}
  else{ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.moveTo(-1,-86);ctx.lineTo(3.4,-86);ctx.lineTo(3,-83);ctx.lineTo(-1.4,-83);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.ellipse(1.6,-93.4,5,6.4,0,0,TAU);ctx.fill();ctx.fillStyle=rgba(mix(skin,[0,0,0],0.3),1);ctx.beginPath();ctx.ellipse(-1.6,-93,1.4,2.2,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(mix(col,[10,10,10],0.55),1);ctx.beginPath();ctx.ellipse(0.8,-98.6,6.2,3.6,0,Math.PI,TAU);ctx.fill();ctx.fillRect(-5.6,-99.2,13.2,2.2);
    ctx.strokeStyle=rgba(ice,0.35);ctx.lineWidth=1;ctx.beginPath();ctx.arc(1.6,-93.4,5.4,2.2,3.9);ctx.stroke();}
  // what the near hand holds
  const hand=(hx,hy)=>{ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(hx,hy,2.5,2.2,0,0,TAU);ctx.fill();};
  if(o.carry==="bale"){ctx.fillStyle="rgb(146,124,94)";rr(ctx,-1,-104,22,19,4);ctx.fill();ctx.strokeStyle="rgb(86,68,50)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-1,-95);ctx.lineTo(21,-95);ctx.moveTo(10,-104);ctx.lineTo(10,-85);ctx.stroke();
    ctx.fillStyle="rgba(10,8,6,0.3)";ctx.fillRect(-1,-88,22,3);hand(10.5,-84);}
  else if(o.carry==="barrel")hand(10.4,-44);
  else if(o.carry==="lantern"){const lx=11.6,ly=-46;ctx.strokeStyle="rgb(24,22,20)";ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(lx,ly-10);ctx.lineTo(lx,ly-4.5);ctx.stroke();
    ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,lx,ly+3,50,WD.lamp,0.32);ctx.restore();ctx.fillStyle="rgb(24,22,20)";ctx.fillRect(lx-4.5,ly-4.5,9,14);ctx.fillStyle=rgba(WD.lamp,1);ctx.fillRect(lx-3,ly-2.5,6,9.5);hand(lx,ly-11);}
  else if(o.carry==="keys"){const kx=10,ky=-50;ctx.strokeStyle="rgb(160,140,104)";ctx.lineWidth=1.7;ctx.beginPath();ctx.arc(kx,ky,5.4,0,TAU);ctx.stroke();
    for(const [dx,ang] of [[-2,0.5],[1,0.15],[3,-0.2],[5,-0.5]]){ctx.save();ctx.translate(kx+dx*0.6,ky+4.4);ctx.rotate(ang+Math.sin(ph)*0.08);ctx.strokeStyle="rgb(126,108,82)";ctx.lineWidth=1.9;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,17);ctx.stroke();
      ctx.fillStyle="rgb(126,108,82)";ctx.fillRect(0,13,4,2.6);ctx.fillRect(0,16,3,2);ctx.restore();}
    ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,kx,ky+6,14,[255,214,150],0.18);ctx.restore();hand(kx,ky-6.4);}
  ctx.restore();}
// a ship of the time, a cog: a round hull, a castle at the stern, one mast with its sail furled (sail 0) or set (sail 1); lantern at the stern;
// facing right (flip: left); (x, y) is where its hull meets the water; s 1 is about 300 px long. o.rim: a coral rim (the sickness aboard)
function wd_ship(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const k=o.k||1,sail=o.sail==null?0:o.sail,rock=Math.sin((o.t||0)*0.9+(o.seed||0))*0.012;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(rock);ctx.scale(o.flip?-s:s,s);
  const hull=cc=>{cc.beginPath();cc.moveTo(-150,-62);cc.bezierCurveTo(-140,-10,-90,14,0,16);cc.bezierCurveTo(90,14,140,-6,156,-70);cc.lineTo(140,-62);cc.bezierCurveTo(90,-44,-60,-44,-130,-56);cc.closePath();};
  hull(ctx);let g=ctx.createLinearGradient(0,-70,0,16);g.addColorStop(0,rgba(wd_sc([88,66,48],k),1));g.addColorStop(1,rgba(wd_sc([30,24,20],k),1));ctx.fillStyle=g;ctx.fill();
  ctx.save();hull(ctx);ctx.clip();ctx.strokeStyle="rgba(10,8,6,0.5)";ctx.lineWidth=1.6;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-160,-50+i*12);ctx.bezierCurveTo(-90,-26+i*10,90,-26+i*10,160,-56+i*12);ctx.stroke();}ctx.restore();
  // the stern castle, and a small one at the bow
  ctx.fillStyle=rgba(wd_sc([70,54,40],k),1);ctx.fillRect(-150,-104,62,46);ctx.fillRect(112,-96,40,30);ctx.fillStyle="rgba(200,235,235,0.18)";ctx.fillRect(-150,-104,62,1.6);ctx.fillRect(112,-96,40,1.4);
  ctx.fillStyle="rgb(20,16,14)";for(let i=0;i<5;i++)ctx.fillRect(-146+i*12,-112,6,8);
  // the mast, its yard, and the sail
  ctx.fillStyle=rgba(wd_sc([60,46,34],k),1);ctx.fillRect(-4,-330,8,290);
  const yy=-300,sw=sail;if(sw>0.02){ctx.fillStyle=rgba(wd_sc([170,156,130],k),1);ctx.beginPath();ctx.moveTo(-96,yy);ctx.lineTo(96,yy);ctx.quadraticCurveTo(110,yy+110*sw,90,yy+200*sw);ctx.lineTo(-90,yy+200*sw);ctx.quadraticCurveTo(-80,yy+100*sw,-96,yy);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgba(10,12,14,0.18)";ctx.fillRect(-90,yy+200*sw-20,180,20);}
  ctx.fillStyle=rgba(wd_sc([74,58,44],k),1);ctx.fillRect(-100,yy-6,200,8);ctx.fillStyle=rgba(wd_sc([150,138,116],k),1);if(sw<=0.02)rr(ctx,-92,yy-2,184,12,6),ctx.fill();
  ctx.strokeStyle="rgba(30,28,26,0.8)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(0,-330);ctx.lineTo(-150,-104);ctx.moveTo(0,-330);ctx.lineTo(152,-96);ctx.moveTo(-100,yy);ctx.lineTo(-140,-60);ctx.moveTo(100,yy);ctx.lineTo(140,-62);ctx.stroke();
  // the stern lantern
  if(o.lamp!==false){ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,-150,-118,40,WD.lamp,0.4);ctx.restore();ctx.fillStyle=rgba(WD.lamp,1);ctx.fillRect(-154,-126,8,10);}
  // the sickness aboard: a faint coral rim along the hull and the castle
  if(o.rim>0){ctx.save();ctx.strokeStyle=rgba(WD.haze,0.9*o.rim);ctx.shadowColor=rgba(WD.haze,1);ctx.shadowBlur=14;ctx.lineWidth=3;hull(ctx);ctx.stroke();ctx.strokeRect(-150,-104,62,46);ctx.restore();}
  ctx.restore();}
// the haze of the sickness, coral, soft: blobs drifting along a path pts [[x, y], ...] up to how far u (0 to 1), at strength a
function wd_haze(ctx,pts,u,a,t,o){if(!(a>0)||u<=0)return;o=o||{};const R=ag_rnd(o.seed||5),n=o.n||22,r0=o.r||70;ctx.save();ctx.globalCompositeOperation="lighter";
  const L=[];let tot=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(d);tot+=d;}
  const at=v=>{let d=v*tot;for(let i=0;i<L.length;i++){if(d<=L[i]||i===L.length-1){const f=L[i]?d/L[i]:0;return[lerp(pts[i][0],pts[i+1][0],f),lerp(pts[i][1],pts[i+1][1],f)];}d-=L[i];}return pts[0];};
  for(let i=0;i<n;i++){const v=(i/n)*u,p=at(v),dx=Math.sin((t||0)*0.4+i*1.7)*r0*0.4,dy=Math.cos((t||0)*0.33+i*2.3)*r0*0.25,r=r0*(0.6+R()*0.8);wd_glow(ctx,p[0]+dx,p[1]+dy,r,WD.haze,0.05*a);}
  ctx.restore();}

/* ---------------------------------------------------------------- the street up to the rector's palace
   One straight street from just inside a gate up to the rector's palace, in one-point perspective: house fronts on both sides, three
   floors of windows (their light drawn live, wd_streetWindows), the paving between, and the palace across the far end, its arcade lit
   and its door (drawn live) in the middle. Depth z runs from 1 (here) to 4 (the palace); wd_st gives a point on it. */
const WD_ST={vx:960,hz:470,g:610,top:1600,half:700};
// a point of the street: side -1 the left fronts, 1 the right, 0 the middle of the paving; h the height (0 the ground, 1 the roofs)
function wd_st(side,h,z,dx){const S=WD_ST;return[S.vx+(side*S.half+(dx||0))/z,S.hz+(S.g-h*S.top)/z];}
// the windows: small openings, irregular, three floors on each house; each knows its house's depth and floor
const WD_SWIN=(()=>{const L=[],R=ag_rnd(9);for(const side of [-1,1])for(const z of [0.9,1.08,1.3,1.56,1.86,2.2,2.6,3.04])for(const h of [0.36,0.56,0.76]){if(R()<0.12)continue;
  const wz=0.032*z*z;L.push({side,z:z+R()*0.04*z,h:h+(R()-0.5)*0.03,wz,hh:0.07});}return L;})();
function wd_quad(c,side,h0,h1,z0,z1){const a=wd_st(side,h1,z0),b=wd_st(side,h1,z1),d=wd_st(side,h0,z1),e=wd_st(side,h0,z0);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.lineTo(d[0],d[1]);c.lineTo(e[0],e[1]);c.closePath();}
function wd_paintStreet(c,tod){const T=WD_TOD[tod],k=T.f*0.86,R=ag_rnd(1417);
  wd_sky(c,tod,600);
  // the fronts: plastered stone, each house its own shade and height, a cornice under the roofs, a door at the foot of some
  for(const side of [-1,1]){const zs=[0.7,0.98,1.2,1.43,1.7,2.03,2.4,2.82,3.3,4];for(let i=0;i<zs.length-1;i++){const z0=zs[i],z1=zs[i+1],base=mix([120,112,100],[90,102,108],R()*0.7),top=0.94+R()*0.06;
      wd_quad(c,side,0,top,z0,z1);const p0=wd_st(side,0,z0),p1=wd_st(side,0,z1),g=c.createLinearGradient(p0[0],0,p1[0],0);g.addColorStop(0,rgba(wd_sc(base,k*0.8),1));g.addColorStop(1,rgba(wd_sc(base,k*0.5),1));c.fillStyle=g;c.fill();
      // stone courses on the lower floor
      c.save();wd_quad(c,side,0,0.26,z0,z1);c.clip();c.strokeStyle="rgba(10,14,16,0.22)";c.lineWidth=1;for(let h=0.03;h<0.26;h+=0.045){const a=wd_st(side,h,z0),b=wd_st(side,h,z1);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}c.restore();
      wd_quad(c,side,0,top,z0,z1);c.strokeStyle="rgba(8,14,16,0.55)";c.lineWidth=2;c.stroke();
      wd_quad(c,side,top-0.04,top,z0,z1);c.fillStyle=rgba(wd_sc(base,k*0.4),1);c.fill();
      if(R()<0.6){const dz0=z0+(z1-z0)*0.3,dz1=dz0+(z1-z0)*0.3;wd_quad(c,side,0,0.17,dz0,dz1);c.fillStyle="rgb(30,24,20)";c.fill();}
      wd_quad(c,side,0,0.04,z0,z1);c.fillStyle="rgba(10,14,16,0.35)";c.fill();}}
  // the windows' frames and shutters, dark; the light in them is drawn live
  for(const w of WD_SWIN){wd_quad(c,w.side,w.h-0.012,w.h+w.hh+0.012,w.z-0.012*w.z,w.z+w.wz+0.012*w.z);c.fillStyle=rgba(wd_sc([88,90,86],k),1);c.fill();
    wd_quad(c,w.side,w.h,w.h+w.hh,w.z,w.z+w.wz);c.fillStyle="rgb(16,20,24)";c.fill();
    wd_quad(c,w.side,w.h-0.004,w.h+w.hh+0.004,w.z+w.wz+0.002*w.z,w.z+w.wz*1.45);c.fillStyle=rgba(wd_sc([52,60,56],k),1);c.fill();}
  // the paving, polished by feet, catching the sky's light down its middle
  const f0=wd_st(-1,0,0.7),f1=wd_st(-1,0,4),f2=wd_st(1,0,4),f3=wd_st(1,0,0.7);c.beginPath();c.moveTo(f0[0],f0[1]);c.lineTo(f1[0],f1[1]);c.lineTo(f2[0],f2[1]);c.lineTo(f3[0],f3[1]);c.closePath();
  let g=c.createLinearGradient(0,f1[1],0,H);g.addColorStop(0,rgba(wd_sc([86,88,84],k),1));g.addColorStop(1,rgba(wd_sc([44,50,52],k),1));c.fillStyle=g;c.fill();
  c.save();c.clip();c.strokeStyle="rgba(10,14,16,0.35)";c.lineWidth=1.4;for(let z=0.7;z<4;z*=1.09){const a=wd_st(-1,0,z),b=wd_st(1,0,z);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  for(let i=-6;i<=6;i++){const a=wd_st(0,0,0.7,i*120),b=wd_st(0,0,4,i*120);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  c.globalCompositeOperation="lighter";const sh=c.createLinearGradient(700,0,1220,0);sh.addColorStop(0,"rgba(150,200,205,0)");sh.addColorStop(0.5,"rgba(150,200,205,0.08)");sh.addColorStop(1,"rgba(150,200,205,0)");c.fillStyle=sh;c.fillRect(0,600,W,480);c.restore();
  // the rector's palace across the far end of the street: an arcade of five round arches on columns, a row of paired
  // windows over it, a cornice and the roof
  const pl=[wd_st(-1,0,4)[0],wd_st(-1,0,4)[1]],pr=[wd_st(1,0,4)[0],0],pt=wd_st(-1,1.02,4)[1],ar=wd_st(-1,0.36,4)[1],pw=pr[0]-pl[0];
  g=c.createLinearGradient(0,pt,0,pl[1]);g.addColorStop(0,rgba(wd_sc([140,134,120],k*0.8),1));g.addColorStop(1,rgba(wd_sc([110,104,94],k*0.8),1));c.fillStyle=g;c.fillRect(pl[0],pt,pw,pl[1]-pt);
  c.fillStyle=rgba(wd_sc([96,66,56],k*0.8),1);c.fillRect(pl[0]-10,pt-16,pw+20,18);c.fillStyle=rgba(WD.ice,0.14);c.fillRect(pl[0]-10,pt-16,pw+20,1.2);
  c.fillStyle=rgba(wd_sc([120,114,102],k*0.75),1);c.fillRect(pl[0],ar-12,pw,10);
  for(let i=0;i<5;i++){const aw=pw/5,ax=pl[0]+i*aw+aw*0.14,w=aw*0.72;c.fillStyle="rgb(24,22,20)";c.beginPath();wd_archPath(c,ax,pl[1],w,pl[1]-ar);c.fill();}
  for(let i=0;i<=5;i++){const cx=pl[0]+i*pw/5;c.fillStyle=rgba(wd_sc([158,152,138],k*0.8),1);c.fillRect(cx-5,ar,10,pl[1]-ar);c.fillRect(cx-8,ar,16,6);}
  for(let i=0;i<5;i++){const wx=pl[0]+pw*(i+0.5)/5;for(const dx of [-11,4]){c.fillStyle="rgb(20,22,26)";c.beginPath();wd_archPath(c,wx+dx,pt+70,9,34);c.fill();}}
  c.fillStyle="rgba(0,0,0,0.3)";c.fillRect(pl[0],pl[1]-3,pw,4);}
AG_PLACES.wdStreet=c=>wd_paintStreet(c,"dusk");
AG_PLACES.wdStreetNight=c=>wd_paintStreet(c,"night");
AG_ROOMS.wdStreetNight="wdStreet";
// the street's windows, lit by lit(i, w) (0 dark to 1 lit), each with its glow
function wd_streetWindows(ctx,lit){ctx.save();WD_SWIN.forEach((w,i)=>{const a=lit(i,w);if(a<=0)return;wd_quad(ctx,w.side,w.h,w.h+w.hh,w.z,w.z+w.wz);ctx.fillStyle=rgba(mix([30,28,26],mix(WD.warm,[230,160,90],0.3),a*0.92),1);ctx.fill();
  const m=wd_st(w.side,w.h+w.hh/2,w.z+w.wz/2);ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,m[0],m[1],110/w.z,WD.warm,0.12*a);ctx.restore();});ctx.restore();}
// the palace's arcade lit from within (a), its door in the middle arch (open 1, shut 0), and one window lit over it (w)
function wd_palace(ctx,a,open,w){const pl=[wd_st(-1,0,4)[0],wd_st(-1,0,4)[1]],pr=[wd_st(1,0,4)[0],0],pt=wd_st(-1,1.02,4)[1],ar=wd_st(-1,0.36,4)[1],pw=pr[0]-pl[0];
  for(let i=0;i<5;i++){const aw=pw/5,ax=pl[0]+i*aw+aw*0.14,wd=aw*0.72;ctx.save();ctx.beginPath();wd_archPath(ctx,ax,pl[1],wd,pl[1]-ar);ctx.clip();
    if(a>0){const g=ctx.createLinearGradient(0,ar,0,pl[1]);g.addColorStop(0,rgba(mix([24,22,20],[110,82,56],a),1));g.addColorStop(1,rgba(mix([24,22,20],[150,112,74],a),1));ctx.fillStyle=g;ctx.fillRect(ax,ar,wd,pl[1]-ar);}
    if(i===2){const dw=wd*0.62,dx=ax+wd*0.19,dh=(pl[1]-ar)*0.66,u=clamp(open,0,1);ctx.fillStyle="rgb(20,16,14)";ctx.fillRect(dx,pl[1]-dh,dw,dh);
      if(u<0.999){ctx.fillStyle="rgb(58,42,30)";ctx.fillRect(dx,pl[1]-dh,dw/2*(1-u),dh);ctx.fillRect(dx+dw-dw/2*(1-u),pl[1]-dh,dw/2*(1-u),dh);ctx.fillStyle="rgba(0,0,0,0.4)";ctx.fillRect(dx+dw/2*(1-u)-1,pl[1]-dh,2,dh);}}
    ctx.restore();}
  if(w>0){const wx=pl[0]+pw*2.5/5;for(const dx of [-11,4]){ctx.fillStyle=rgba(mix([20,22,26],WD.warm,w),1);ctx.beginPath();wd_archPath(ctx,wx+dx,pt+70,9,34);ctx.fill();}
    ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,wx,pt+54,70,WD.warm,0.24*w);ctx.restore();}}

/* ---------------------------------------------------------------- the Great Council's hall
   A long vaulted hall at evening: stone walls, the vault's ribs going back, two tall windows at the far end with the evening's cool
   light, the nobles of the council on benches along both walls as dark shapes against it (no faces at this distance), and a table
   here, where the law is written (wd_parchment, drawn live, with its candle). */
function wd_seated(c,x,y,s,flip,col){c.save();c.translate(x,y);c.scale(flip?-s:s,s);const cc=col||[34,38,44];
  c.fillStyle=rgba(cc,1);c.beginPath();c.moveTo(-12,0);c.bezierCurveTo(-14,-20,-12,-40,-9,-52);c.bezierCurveTo(-6,-60,6,-60,9,-52);c.bezierCurveTo(12,-40,16,-20,20,0);c.closePath();c.fill();
  c.beginPath();c.ellipse(1,-63,6.4,7.6,0,0,TAU);c.fill();c.beginPath();c.ellipse(1,-70,7.4,3.6,0,0,TAU);c.fill();
  c.strokeStyle="rgba(150,200,210,0.22)";c.lineWidth=1.2;c.beginPath();c.moveTo(-9,-52);c.bezierCurveTo(-12,-40,-14,-20,-12,0);c.stroke();c.beginPath();c.arc(1,-63,7,2.4,4.2);c.stroke();c.restore();}
function wd_paintCouncil(c){const R=ag_rnd(1377),vx=960,vy=430;
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(10,18,22)");g.addColorStop(1,"rgb(16,24,26)");c.fillStyle=g;c.fillRect(0,0,W,H);
  for(const side of [-1,1]){c.fillStyle=side<0?"rgb(26,34,38)":"rgb(22,30,34)";c.beginPath();c.moveTo(vx+side*960,0);c.lineTo(vx+side*260,250);c.lineTo(vx+side*260,650);c.lineTo(vx+side*960,H);c.closePath();c.fill();}
  c.fillStyle="rgb(18,26,30)";c.beginPath();c.moveTo(0,0);c.lineTo(W,0);c.lineTo(vx+260,250);c.lineTo(vx-260,250);c.closePath();c.fill();
  // the vault: ribs from the walls up over the hall, going back (the far wall is drawn over their far ends)
  for(let i=0;i<7;i++){const z=1+i*0.55,hw=960/z,top=430-520/z,wy=430+40/z;c.strokeStyle=rgba([90,120,126],0.3-i*0.03);c.lineWidth=Math.max(1.5,10/z);
    c.beginPath();c.moveTo(vx-hw,wy);c.bezierCurveTo(vx-hw,top-120/z,vx+hw,top-120/z,vx+hw,wy);c.stroke();}
  // the far wall and its two windows, the evening light through them
  g=c.createLinearGradient(0,250,0,650);g.addColorStop(0,"rgb(24,32,36)");g.addColorStop(1,"rgb(36,46,50)");c.fillStyle=g;c.fillRect(700,250,520,400);
  for(const wx of [800,1060]){c.fillStyle="rgb(70,104,118)";c.beginPath();wd_archPath(c,wx,560,62,250);c.fill();
    c.save();c.beginPath();wd_archPath(c,wx,560,62,250);c.clip();const wg=c.createLinearGradient(0,310,0,560);wg.addColorStop(0,"rgb(120,160,170)");wg.addColorStop(1,"rgb(60,90,104)");c.fillStyle=wg;c.fillRect(wx,300,62,260);
      c.strokeStyle="rgba(20,30,34,0.8)";c.lineWidth=3;c.beginPath();c.moveTo(wx+31,300);c.lineTo(wx+31,560);c.moveTo(wx,440);c.lineTo(wx+62,440);c.stroke();c.restore();}
  c.save();c.globalCompositeOperation="lighter";wd_glow(c,960,430,520,[110,160,175],0.12);
  // the light falling from the windows across the floor
  for(const wx of [831,1091]){c.fillStyle="rgba(120,170,185,0.05)";c.beginPath();c.moveTo(wx-28,560);c.lineTo(wx+28,560);c.lineTo(wx+180,1080);c.lineTo(wx-120,1080);c.closePath();c.fill();}c.restore();
  // the side walls and the vault: ribs from the walls up over the hall, going back
  // the floor
  g=c.createLinearGradient(0,650,0,H);g.addColorStop(0,"rgb(34,40,40)");g.addColorStop(1,"rgb(20,24,26)");c.fillStyle=g;c.beginPath();c.moveTo(vx-260,650);c.lineTo(vx+260,650);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
  // the benches along both walls, and the council on them, far ones smaller
  for(const side of [-1,1])for(let i=6;i>=0;i--){const z=1.25+i*0.42,x=vx+side*(820/z),y=430+560/z,s=2.3/z;
    c.fillStyle="rgb(40,32,26)";c.fillRect(Math.min(x,x+side*-60*s)-20*s,y-6*s,120*s,10*s);
    for(let j=0;j<2;j++)wd_seated(c,x+side*(-30-j*40)*s,y,s,side>0,mix([30,34,40],[44,40,46],R()));}
  // the table here, at the foot of the frame
  c.fillStyle="rgb(46,36,28)";c.beginPath();c.moveTo(380,880);c.lineTo(1540,880);c.lineTo(1660,H);c.lineTo(260,H);c.closePath();c.fill();
  c.fillStyle="rgba(200,230,230,0.12)";c.fillRect(380,880,1160,2);}
AG_PLACES.wdCouncil=c=>wd_paintCouncil(c);
// the table where the law is written, from just above: dark oak boards, warm in a candle's light (the parchment and the candle are
// drawn live, wd_parchment)
function wd_paintTable(c){const R=ag_rnd(27);let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(34,24,18)");g.addColorStop(1,"rgb(22,16,12)");c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let y=-40;y<H;y+=118){const k=0.85+R()*0.3;c.fillStyle=rgba(wd_sc([58,40,28],k),1);c.fillRect(0,y+2,W,114);
    c.strokeStyle="rgba(20,12,8,0.35)";c.lineWidth=1.2;for(let i=0;i<9;i++){const yy=y+10+R()*96,ph=R()*6;c.beginPath();c.moveTo(0,yy);for(let x=0;x<=W;x+=60)c.lineTo(x,yy+Math.sin(x*0.004+ph)*4+R()*1.5);c.stroke();}
    c.fillStyle="rgba(8,5,3,0.7)";c.fillRect(0,y,W,3);c.fillStyle="rgba(255,220,180,0.05)";c.fillRect(0,y+3,W,1.2);}
  c.save();c.globalCompositeOperation="lighter";wd_glow(c,1450,250,900,[255,190,120],0.15);wd_glow(c,1000,480,760,[255,190,120],0.06);c.restore();
  const v=c.createRadialGradient(1000,480,300,960,540,1200);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.62)");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.wdTable=c=>wd_paintTable(c);
// the law on its parchment, on the table: a few lines of writing as texture (no words to read), the seal pressed at p (0 to 1), and
// a candle; at (x, y) its top left, w wide
function wd_parchment(ctx,x,y,w,a,seal,t){if(a<=0)return;const h=w*0.62;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=18;ctx.fillStyle="rgb(196,182,150)";ctx.beginPath();ctx.moveTo(x,y+6);ctx.lineTo(x+w,y);ctx.lineTo(x+w+6,y+h);ctx.lineTo(x+4,y+h+6);ctx.closePath();ctx.fill();ctx.restore();
  ctx.save();ctx.globalCompositeOperation="lighter";wd_glow(ctx,x+w+90,y+20,260,WD.lamp,0.16);ctx.restore();
  const R=ag_rnd(77);ctx.strokeStyle="rgba(70,52,36,0.55)";ctx.lineWidth=2.2;ctx.lineCap="round";for(let i=0;i<9;i++){const ly=y+30+i*(h-80)/8;let lx=x+30;ctx.beginPath();while(lx<x+w-40){const sw=10+R()*34;ctx.moveTo(lx,ly);ctx.lineTo(lx+sw,ly+(R()-0.5)*1.5);lx+=sw+6+R()*6;}ctx.stroke();}
  if(seal>0){const sx=x+w*0.78,sy=y+h-34,k=ag_spr(seal,0,0.4);ctx.save();ctx.translate(sx,sy);ctx.scale(lerp(1.4,1,clamp(k,0,1)),lerp(1.4,1,clamp(k,0,1)));ctx.fillStyle="rgb(150,46,40)";ctx.beginPath();
    for(let i=0;i<14;i++){const an=i/14*TAU,r=24+(i%2)*3;ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r);}ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(90,20,18,0.8)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,14,0,TAU);ctx.stroke();ctx.restore();}
  // the candle
  const cx=x+w+90,cy=y+40,f=1+0.06*Math.sin((t||0)*8.1);ctx.fillStyle="rgb(214,204,180)";ctx.fillRect(cx-9,cy,18,70);ctx.fillStyle="rgb(255,236,190)";ctx.beginPath();ctx.ellipse(cx,cy-10,5,12*f,0,0,TAU);ctx.fill();
  ctx.restore();}

/* ---------------------------------------------------------------- the coast, as a frosted map
   The coast south-east of the city, drawn in light on dark frosted glass: the land above, the open sea below, the city on the coast to
   the left, the town of Cavtat on its small headland to the right, and the islet of Mrkan off it. Their names, the ship, the lines and
   the moon are drawn live. WD_MAP holds where each is. */
const WD_MAP={city:[430,402],cavtat:[1424,612],mrkan:[1290,744],sea:[760,830],gate:[452,388]};
function wd_paintCoast(c){const R=ag_rnd(1377);let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(8,22,28)");g.addColorStop(1,"rgb(4,14,19)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the sea's faint swell lines, and a fine grid, as on a chart
  c.strokeStyle="rgba(120,200,210,0.05)";c.lineWidth=1;for(let x=0;x<W;x+=120){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}for(let y=0;y<H;y+=120){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  // the land: the coast from the north-west to the south-east, with the city's small headland and Cavtat's
  const land=cc=>{cc.beginPath();cc.moveTo(0,0);cc.lineTo(W,0);cc.lineTo(W,560);cc.bezierCurveTo(1820,560,1700,590,1600,600);cc.bezierCurveTo(1540,604,1500,640,1470,650);
    cc.bezierCurveTo(1430,664,1380,660,1384,630);cc.bezierCurveTo(1390,600,1420,590,1430,560);cc.bezierCurveTo(1440,520,1360,500,1250,500);cc.bezierCurveTo(1080,500,900,470,760,450);
    cc.bezierCurveTo(640,432,560,450,500,440);cc.bezierCurveTo(450,434,410,440,396,420);cc.bezierCurveTo(384,400,420,380,400,360);cc.bezierCurveTo(360,330,200,330,0,300);cc.closePath();};
  land(c);g=c.createLinearGradient(0,0,0,660);g.addColorStop(0,"rgb(22,40,46)");g.addColorStop(1,"rgb(30,52,58)");c.fillStyle=g;c.fill();
  c.save();land(c);c.clip();for(let i=0;i<16;i++){c.strokeStyle=rgba([120,200,210],0.035);c.lineWidth=1.2;c.beginPath();c.moveTo(0,250-i*18);c.bezierCurveTo(600,420-i*22,1200,470-i*22,W,520-i*24);c.stroke();}c.restore();
  // the islet of Mrkan, low, off Cavtat
  const islet=cc=>{cc.beginPath();cc.moveTo(1246,742);cc.bezierCurveTo(1256,724,1300,722,1322,734);cc.bezierCurveTo(1340,744,1322,760,1290,762);cc.bezierCurveTo(1262,762,1240,756,1246,742);cc.closePath();};
  islet(c);c.fillStyle="rgb(30,52,58)";c.fill();
  // the coastline in light, ice, as a frosted pane's edge catches it
  c.save();c.strokeStyle=rgba(WD.ice,0.75);c.lineWidth=2.4;c.shadowColor=rgba(WD.ice,0.6);c.shadowBlur=10;land(c);c.stroke();islet(c);c.stroke();c.restore();
  // contour lines inland, following the coast, fainter as they climb
  c.save();land(c);c.clip();for(let i=1;i<6;i++){c.save();c.translate(0,-i*34);c.strokeStyle=rgba(WD.ice,0.10-i*0.014);c.lineWidth=1.2;land(c);c.stroke();c.restore();}c.restore();
  // swell lines in the sea along the coast
  c.save();c.globalAlpha=0.5;for(let i=1;i<4;i++){c.save();c.translate(0,i*26);c.strokeStyle=rgba(WD.ice,0.07-i*0.015);c.lineWidth=1;land(c);c.stroke();c.restore();}c.restore();
  // the city: its ring of walls and towers on its headland, small; Cavtat: a few houses on theirs
  c.save();c.strokeStyle=rgba(WD.ice,0.9);c.fillStyle=rgba([40,64,70],1);c.lineWidth=2.2;c.beginPath();c.moveTo(404,414);c.lineTo(404,386);c.lineTo(436,378);c.lineTo(462,388);c.lineTo(462,416);c.closePath();c.fill();c.stroke();
  for(const [x,y] of [[404,386],[436,378],[462,388],[462,416],[404,414]]){c.fillStyle=rgba(WD.ice,0.9);c.fillRect(x-4,y-4,8,8);}c.restore();
  for(const [x,y] of [[1404,604],[1418,598],[1428,610],[1412,616],[1440,600]]){c.fillStyle=rgba(WD.ice,0.7);c.fillRect(x-4,y-4,8,7);}}
AG_PLACES.wdCoast=c=>wd_paintCoast(c);

/* ===== Walls, doors and keys: the hall =====
   The university's scenes, in the module's hall of frosted panes. The platform is a tall block of clear glass in the middle of the
   hall (WD_BK); what this film gives it is drawn live, over the hall, in the hall's own coordinates, so the camera can glide over it:
     the room or rooms at the top (WD_RM), with the five areas' panes at the back (Registrar, Learning, Planning, HR, Finance),
     the catalog's band under them, a ring round the way down to the files (WD_CT),
     a narrow side door beside it, the back door straight to the files (WD_SD),
     storage at the foot (WD_SG), where the files are, and at first the copies,
     the front door on the left wall (WD_DOOR), facing the open internet, a dark plain beyond the hall's glass on the left, and later a
     door on the right wall (WD_DOOR2), where the corridor from the university's network comes in.
   Round it: the cloud provider's case at the top left, where the key is kept at first; the university's own vault at the top right;
   the corridor on the right; the copies' place apart, far off, at the bottom right. Sam stands at the bottom left.
   Places: wdHall (the hall, with the plain), wdBoard (the corner of the hall where Sam writes who secures what), wdMap (the
   university's map on a pane of its own). Every name starts with wd_ or WD_. */

const WD_BK={x:470,y:110,w:930,h:750};      // the block: 470 to 1400 across, 110 to 860 down
const WD_RM={x:490,y:132,w:890,h:348};      // the room (or rooms), 490 to 1380, 132 to 480
const WD_CT={x:950,y:534,rx:96,ry:22};      // the ring round the way down, in the catalog's band (492 to 576); the way down is 904 to 996
const WD_SD={x:1112,w:40,y:480,h:118};      // the side door: the back door to the files, past the catalog
const WD_SG={x:490,y:598,w:890,h:244};      // storage, 490 to 1380, 598 to 842
const WD_DOOR={x:470,y:330,h:120},WD_DOOR2={x:1400,y:330,h:120};
const WD_PROV={x:30,y:36,w:420,h:210},WD_VAULT={x:1470,y:40,w:420,h:252};   // the cloud provider's case; the university's vault
const WD_COR={y:342,h:96};                  // the corridor from the university's network, 1400 to the frame's right edge
const WD_APART={x:1548,y:520,w:300,h:230};  // the copies' place apart, far off
const WD_PLAIN={x:24,y:296,w:420,h:584};    // the open internet, beyond the hall's glass

/* ---------------------------------------------------------------- the places */
// the open internet: a dark plain seen through the hall's glass on the left, under a night sky, scattered with faint lights that
// could be anyone, anywhere; a frame of glass round it
function wd_paintPlain(c){const P=WD_PLAIN,R=ag_rnd(2026),hz=P.y+150;c.save();rr(c,P.x,P.y,P.w,P.h,18);c.clip();
  let g=c.createLinearGradient(0,P.y,0,hz);g.addColorStop(0,"rgb(3,9,12)");g.addColorStop(1,"rgb(10,24,30)");c.fillStyle=g;c.fillRect(P.x,P.y,P.w,hz-P.y);
  g=c.createLinearGradient(0,hz,0,P.y+P.h);g.addColorStop(0,"rgb(9,20,24)");g.addColorStop(1,"rgb(3,8,10)");c.fillStyle=g;c.fillRect(P.x,hz,P.w,P.y+P.h-hz);
  c.save();c.globalCompositeOperation="lighter";wd_glow(c,P.x+P.w*0.55,hz,260,[80,140,150],0.10);c.restore();
  for(let i=0;i<40;i++){const x=P.x+R()*P.w,y=P.y+R()*(hz-P.y-10),r=0.5+R()*1.1;c.fillStyle=rgba([200,235,235],0.08+R()*0.2);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  // the lights on the plain: many, small and faint near the horizon, fewer and larger towards us; a few warm, most cool
  c.save();c.globalCompositeOperation="lighter";for(let i=0;i<260;i++){const d=Math.pow(R(),1.7),y=hz+4+d*(P.y+P.h-hz-12),x=P.x+R()*P.w,r=0.6+d*2.6,
      col=R()<0.2?[255,214,160]:[170,225,232],a=(0.10+R()*0.32)*(0.55+0.45*(1-d));
    c.fillStyle=rgba(col,a);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();if(d>0.35&&R()<0.5)wd_glow(c,x,y,r*7,col,a*0.18);}c.restore();
  c.strokeStyle="rgba(150,210,215,0.10)";c.lineWidth=1.2;c.beginPath();c.moveTo(P.x,hz);c.lineTo(P.x+P.w,hz);c.stroke();c.restore();
  // the hall's glass in front of it: a sheen and an edge of light
  c.save();rr(c,P.x,P.y,P.w,P.h,18);c.clip();const sg=c.createLinearGradient(P.x,P.y,P.x+P.w,P.y+P.h);sg.addColorStop(0,"rgba(200,245,245,0.06)");sg.addColorStop(0.4,"rgba(200,245,245,0)");
  sg.addColorStop(0.55,"rgba(200,245,245,0.04)");sg.addColorStop(1,"rgba(200,245,245,0)");c.fillStyle=sg;c.fillRect(P.x,P.y,P.w,P.h);c.restore();
  c.save();c.shadowColor="rgba(104,216,230,0.6)";c.shadowBlur=10;c.strokeStyle="rgba(190,245,245,0.42)";c.lineWidth=1.6;rr(c,P.x+0.8,P.y+0.8,P.w-1.6,P.h-1.6,18);c.stroke();c.restore();}
AG_PLACES.wdHall=c=>dp_paintHall(c,{seed:23,horizon:700,vx:930,panes:6,lights:14,haze:0.08,pools:[[930,930,700,0.10],[250,1000,330,0.09],[1700,990,380,0.07]],after:wd_paintPlain});
// the corner of the hall where Sam writes who secures what: the same hall, nearer a wall of glass, a board standing in it (drawn live)
AG_PLACES.wdBoard=c=>dp_paintHall(c,{seed:61,horizon:720,vx:760,panes:7,lights:16,haze:0.09,pools:[[820,960,640,0.10],[1560,990,420,0.10]]});
// the university's map, on a pane of its own (its areas and their owners drawn live)
AG_PLACES.wdMap=c=>dp_paintHall(c,{seed:5,horizon:760,vx:960,panes:5,lights:12,haze:0.07,pools:[[960,980,760,0.08]]});

/* ---------------------------------------------------------------- glass */
// a box of clear glass: a faint tint, a soft sheen across it, edges of light, brightest along the top; o.col its rim's colour (cyan),
// o.frost (0 to 1) frosts it, so the hall behind it blurs; o.edge the rim's strength; o.r its corners
function wd_glass(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const col=dp_f(o.col||"cyan"),r=o.r==null?10:o.r,fr=clamp(o.frost||0,0,1),ed=o.edge==null?1:o.edge;
  c.save();c.globalAlpha*=a;c.save();rr(c,x,y,w,h,r);c.clip();
  if(fr>0){c.save();c.globalAlpha*=fr;dp_behind(c,o.behind);c.fillStyle="rgba(6,20,26,0.30)";c.fillRect(x,y,w,h);c.restore();}
  const g=c.createLinearGradient(x,y,x+w*0.5,y+h);g.addColorStop(0,rgba(mix(col,[200,245,245],0.6),0.08+0.08*fr));g.addColorStop(1,rgba(mix(col,[200,245,245],0.6),0.025+0.05*fr));c.fillStyle=g;c.fillRect(x,y,w,h);
  if(o.sheen!==false){const s=c.createLinearGradient(x,y,x+w,y+h);s.addColorStop(0,"rgba(220,250,250,0)");s.addColorStop(0.3,"rgba(220,250,250,0.045)");s.addColorStop(0.36,"rgba(220,250,250,0)");
    s.addColorStop(0.62,"rgba(220,250,250,0)");s.addColorStop(0.7,"rgba(220,250,250,0.03)");s.addColorStop(0.74,"rgba(220,250,250,0)");c.fillStyle=s;c.fillRect(x,y,w,h);}
  c.restore();
  c.save();c.shadowColor=rgba(col,0.75*ed);c.shadowBlur=o.blur||12;c.strokeStyle=rgba(mix(col,[255,255,255],0.4),0.75*ed);c.lineWidth=o.lw||2;rr(c,x+1,y+1,w-2,h-2,r);c.stroke();c.restore();
  c.fillStyle=rgba(DP.ice,0.5*ed);c.fillRect(x+r,y+0.5,w-2*r,1.6);
  c.restore();}
// a pane of frosted glass standing in a room: the hall behind it blurred, its rim in its colour, lit (0 to 1) brighter; col2 and mix
// turn its rim towards another colour (coral, where something reached it)
function wd_pane(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const lit=o.lit||0,col=mix(dp_f(o.col||"cyan"),dp_f(o.col2||"coral"),clamp(o.mix||0,0,1));
  c.save();c.globalAlpha*=a;c.save();if(lit>0){c.shadowColor=rgba(col,0.55*lit);c.shadowBlur=26;}rr(c,x,y,w,h,8);c.fillStyle="rgba(6,20,26,0.55)";c.fill();c.restore();
  c.save();rr(c,x,y,w,h,8);c.clip();dp_behind(c,o.behind);c.fillStyle="rgba(6,20,26,0.26)";c.fillRect(x,y,w,h);
  const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(mix(col,[160,220,225],0.55),0.16+0.12*lit));g.addColorStop(1,rgba(mix(col,[160,220,225],0.55),0.05+0.06*lit));c.fillStyle=g;c.fillRect(x,y,w,h);
  const hg=c.createLinearGradient(0,y,0,y+40);hg.addColorStop(0,"rgba(225,250,250,0.14)");hg.addColorStop(1,"rgba(225,250,250,0)");c.fillStyle=hg;c.fillRect(x,y,w,40);c.restore();
  rr(c,x+1,y+1,w-2,h-2,8);c.strokeStyle=rgba(mix(col,[255,255,255],0.35),0.5+0.45*lit);c.lineWidth=1.8+1.2*lit;c.stroke();
  if(o.label&&o.la!==0)wd_T(c,o.label,x+w/2,y+44,{w:700,size:28,align:"center",a:o.la==null?1:o.la});
  c.restore();}
// a fine even frost laid over a pane, the data encrypted (a, 0 to 1): a grain of small marks, and a violet film; full (0 to 1) frosts it
// over completely, so nothing behind it shows
function wd_cipher(c,x,y,w,h,a,full){if(!(a>0)&&!(full>0))return;c.save();rr(c,x,y,w,h,8);c.clip();
  if(a>0){const R=ag_rnd(Math.round(x*3+y)),n=Math.round(w*h/260);c.fillStyle=rgba(DP.F.violet,0.20*a);c.fillRect(x,y,w,h);c.fillStyle=rgba([220,214,255],0.32*a);
    for(let i=0;i<n;i++)c.fillRect(x+R()*w,y+R()*h,1.6+R()*2.6,1.4);}
  if(full>0){c.fillStyle=rgba([40,34,74],0.92*full);c.fillRect(x,y,w,h);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(DP.F.violet,0.30*full));g.addColorStop(1,rgba(DP.F.violet,0.10*full));c.fillStyle=g;c.fillRect(x,y,w,h);}
  c.restore();}

/* ---------------------------------------------------------------- the platform's block
   wd_block(c, t, o) draws the block and what is inside it; o says how each part is now (each from 0 to 1 unless said):
     a          the whole block
     split      one room (0) to three side by side (1): development, test and production
     walls      the walls of frosted glass rising along the areas' edges, five rooms where there was one
     labels     the areas' names on their panes; rooms the rooms' names over the block ("one workspace", or the three)
     lit(e, i)  how lit area i's pane is in room e (0 development, 1 test, 2 production; with one room, e is 2), and coral(e, i), how
                coral its rim has turned; veil(e, i) violet frost over its values (made-up or masked data)
     cipher, full, dim   the fine frost of encryption over every pane, frosted over completely (the key taken back), all dimmed
     ring       the catalog's ring lit cyan, as it checks; catalog its name
     shaft      the way down lit as a private path
     store      storage's name; files its frost cleared to show the files; sections storage split into three, with the rooms
     side       the side door open (1) or shut (0); sideShut its shut door coral; amber an amber glow at it (an admin account switched on)
     door       the front door open and lit (1) or closed (0); doorShut it coral, closed; door2 the right-hand door
     copies     the stack of copies beside the files; crack them cracked; admin the admin's badge by them
     work       people's half-finished work in the room (and "trying new things"); job the nightly job (and "the real records")
     prodCoral  production's panes coral, locked by an attacker */
const WD_ENV=["Development","Test","Production"];
// room e's box, as the one room becomes three (split 0 to 1); with one room (split 0) only production's (e 2) is the whole room
function wd_roomBox(e,split){const R=WD_RM,u=ag_sine(split),w3=(R.w-24)/3,x3=R.x+e*(w3+12);if(e===2)return{x:lerp(R.x,x3,u),y:R.y,w:lerp(R.w,w3,u),h:R.h};return{x:x3,y:R.y,w:w3,h:R.h};}
// area i's pane in room e: across the whole room with one room, smaller in each of three
function wd_paneBox(e,i,split){const one={x:512+i*172,y:152,w:158,h:148},b=wd_roomBox(2,1),pw=(b.w-18-4*10)/5,three={x:wd_roomBox(e,1).x+9+i*(pw+10),y:186,w:pw,h:114};
  if(e!==2)return three;const u=ag_sine(clamp((split-0.25)/0.75,0,1));return{x:lerp(one.x,three.x,u),y:lerp(one.y,three.y,u),w:lerp(one.w,three.w,u),h:lerp(one.h,three.h,u)};}
const WD_AREAS=["Registrar","Learning","Planning","HR","Finance"];
function wd_block(c,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const B=WD_BK,R=WD_RM,S=WD_SG,sp=clamp(o.split||0,0,1),f=k=>clamp(o[k]||0,0,1);c.save();c.globalAlpha*=a;
  // its gloss in the floor, and the shell
  const rg=c.createLinearGradient(0,B.y+B.h,0,B.y+B.h+120);rg.addColorStop(0,"rgba(120,215,225,0.10)");rg.addColorStop(1,"rgba(120,215,225,0)");c.fillStyle=rg;c.fillRect(B.x,B.y+B.h,B.w,120);
  wd_glass(c,B.x,B.y,B.w,B.h,{r:14,edge:1});
  // the floors: under the room, and over storage
  for(const yy of [R.y+R.h,S.y]){const g=c.createLinearGradient(B.x,0,B.x+B.w,0);g.addColorStop(0,"rgba(190,245,245,0.10)");g.addColorStop(0.5,"rgba(190,245,245,0.42)");g.addColorStop(1,"rgba(190,245,245,0.10)");
    c.fillStyle=g;c.fillRect(B.x+12,yy-1,B.w-24,2.4);c.fillStyle="rgba(120,215,225,0.05)";c.fillRect(B.x+12,yy+1.4,B.w-24,12);}
  // the rooms: one, or three side by side, each with its own frosted walls
  const nE=sp>0.001?3:1;for(let e=3-nE;e<3;e++){const b=wd_roomBox(e,sp),ra=e===2?1:ag_in(sp,0.35,0.5);if(ra<=0)continue;
    c.save();c.globalAlpha*=ra;if(sp>0.001){const fa=ag_in(sp,0.2,0.6);c.save();rr(c,b.x,b.y,b.w,b.h,8);c.clip();c.globalAlpha*=fa;c.fillStyle="rgba(150,215,220,0.04)";c.fillRect(b.x,b.y,b.w,b.h);c.restore();
      c.save();c.globalAlpha*=fa;c.strokeStyle="rgba(190,245,245,0.5)";c.lineWidth=2;c.shadowColor="rgba(104,216,230,0.7)";c.shadowBlur=8;rr(c,b.x+1,b.y+1,b.w-2,b.h-2,8);c.stroke();c.restore();}
    // the walls along the areas' edges: thin frosted panes between the areas, rising from the floor
    const wl=f("walls");if(wl>0)for(let i=1;i<5;i++){const p0=wd_paneBox(e,i-1,sp),p1=wd_paneBox(e,i,sp),x=(p0.x+p0.w+p1.x)/2,hh=(b.h-10)*ag_sine(wl),y1=b.y+b.h-2;
      c.save();c.globalAlpha*=ag_in(wl,0,0.3);const ww=sp>0.5?8:12;c.fillStyle="rgba(150,220,225,0.16)";c.fillRect(x-ww/2,y1-hh,ww,hh);
      const g=c.createLinearGradient(0,y1-hh,0,y1);g.addColorStop(0,"rgba(200,250,250,0.85)");g.addColorStop(1,"rgba(190,245,245,0.30)");c.fillStyle=g;c.shadowColor="rgba(104,216,230,0.8)";c.shadowBlur=10;
      c.fillRect(x-ww/2-1,y1-hh,2,hh);c.fillRect(x+ww/2-1,y1-hh,2,hh);c.fillRect(x-ww/2-1,y1-hh-1,ww+2,2.4);c.restore();}
    // the areas' panes
    for(let i=0;i<5;i++){const p=wd_paneBox(e,i,sp),lit=o.lit?o.lit(e,i):0,cm=o.coral?o.coral(e,i):0,vl=o.veil?o.veil(e,i):0;
      wd_pane(c,p.x,p.y,p.w,p.h,{lit,mix:Math.max(cm,f("prodCoral")*(e===2?1:0)),label:WD_AREAS[i],la:e===2?(typeof o.labels==="function"?o.labels(i):f("labels"))*(1-ag_in(sp,0,0.25)):0});
      if(vl>0)dp_frost(c,p.x+6,p.y+p.h*0.5,p.w-12,p.h*0.42,null,{a:vl,r:6});
      wd_cipher(c,p.x,p.y,p.w,p.h,f("cipher"),f("full"));
      if(f("dim")>0){c.save();rr(c,p.x,p.y,p.w,p.h,8);c.fillStyle=rgba([2,8,10],0.62*f("dim"));c.fill();c.restore();}}
    c.restore();}
  // the catalog's band: the way down from each room to the files, through a ring that checks each request
  wd_ways(c,t,sp,f("ring"),f("shaft"));
  // the side door, beside the ring: a narrow way straight down to the files, open, or shut
  wd_sideDoor(c,t,f("side"),f("sideShut"),f("amber"));
  // storage, at the foot: frosted, its files under the frost; in three, with the rooms
  wd_storage(c,t,f("files"),f("sections")*ag_in(sp,0.3,0.6));
  // the copies, beside the files, and the admin's badge by them
  wd_copies(c,t,f("copies"),f("crack"),f("admin"));
  // the doors in its walls
  wd_door(c,WD_DOOR.x,WD_DOOR.y,WD_DOOR.h,f("door"),f("doorShut"),1);
  if(f("door2")>0)wd_door(c,WD_DOOR2.x,WD_DOOR2.y,WD_DOOR2.h,f("door2"),0,-1);
  // what is in the room: people's half-finished work, and the nightly job with the real records
  wd_work(c,t,f("work"),sp,o.finished||0,o.test==null?1:f("test"));wd_job(c,t,f("job"),sp,f("real"));
  // the rooms' names, over the block
  if(f("rooms")>0){const ra=f("rooms");if(sp<0.5){const tw=dp_tw(c,"one workspace",{w:700,size:28})+44;dp_tag(c,R.x,40,"one workspace","cyan",{a:ra*(1-ag_in(sp,0,0.3))*wd_boxA(c,R.x,40,R.x+tw,100),size:28});}
    if(sp>0.3)for(let e=0;e<3;e++){const b=wd_roomBox(e,1);wd_T(c,WD_ENV[e],b.x+b.w/2,92,{w:700,size:30,align:"center",col:e===2?"ink":"mut",a:ra*ag_in(sp,0.55,0.4)});}}
  c.restore();}
// the ways down: a tube of glass from each room through the catalog's band to the files, with a ring round it
function wd_ways(c,t,sp,ring,shaft){const n=sp>0.001?3:1;for(let e=3-n;e<3;e++){const b=wd_roomBox(e,sp),a=e===2?1:ag_in(sp,0.35,0.5);if(a<=0)continue;
  const cx=e===2?lerp(WD_CT.x,b.x+b.w/2,ag_sine(sp)):b.x+b.w/2,rx=lerp(WD_CT.rx,62,ag_sine(sp)),tw=lerp(92,58,ag_sine(sp)),y0=WD_RM.y+WD_RM.h,y1=WD_SG.y;c.save();c.globalAlpha*=a;
  // the tube
  const g=c.createLinearGradient(cx-tw/2,0,cx+tw/2,0);g.addColorStop(0,"rgba(190,245,245,0.16)");g.addColorStop(0.5,"rgba(190,245,245,0.04)");g.addColorStop(1,"rgba(190,245,245,0.12)");c.fillStyle=g;c.fillRect(cx-tw/2,y0,tw,y1-y0);
  c.fillStyle="rgba(190,245,245,0.45)";c.fillRect(cx-tw/2,y0,1.6,y1-y0);c.fillRect(cx+tw/2-1.6,y0,1.6,y1-y0);
  if(shaft>0){c.save();c.globalCompositeOperation="lighter";const sg=c.createLinearGradient(0,y0,0,y1);sg.addColorStop(0,rgba(DP.F.cyan,0.20*shaft));sg.addColorStop(0.5,rgba(DP.F.cyan,0.36*shaft));sg.addColorStop(1,rgba(DP.F.cyan,0.20*shaft));
    c.fillStyle=sg;c.fillRect(cx-tw/2+3,y0,tw-6,y1-y0);c.restore();}
  // the ring: its far half behind the tube, its near half in front; grey at rest, cyan when it checks
  const col=mix(DP.F.grey,DP.F.cyan,ring),cy=WD_CT.y;c.save();c.lineCap="round";c.shadowColor=rgba(col,0.4+0.5*ring);c.shadowBlur=8+12*ring;
  c.strokeStyle=rgba(mix(col,[255,255,255],0.2),0.55+0.4*ring);c.lineWidth=5;c.beginPath();c.ellipse(cx,cy,rx,WD_CT.ry,0,Math.PI,TAU);c.stroke();
  c.strokeStyle=rgba(mix(col,[255,255,255],0.35),0.75+0.25*ring);c.lineWidth=6;c.beginPath();c.ellipse(cx,cy,rx,WD_CT.ry,0,0,Math.PI);c.stroke();c.restore();c.restore();}}
// the side door: a narrow way from the room straight down to the files, beside the catalog's band; open (a dark slot), sliding shut
// (shut 1, coral), and an amber glow at it once (an admin account switched on)
function wd_sideDoor(c,t,open,shut,amber){const D=WD_SD;c.save();
  const g=c.createLinearGradient(0,D.y,0,D.y+D.h);g.addColorStop(0,"rgba(4,12,16,0.92)");g.addColorStop(1,"rgba(20,40,44,0.92)");c.fillStyle=g;c.fillRect(D.x,D.y,D.w,D.h);
  c.save();c.globalCompositeOperation="lighter";const lg=c.createLinearGradient(0,D.y,0,D.y+D.h);lg.addColorStop(0,"rgba(150,220,225,0)");lg.addColorStop(1,rgba([150,220,225],0.16*clamp(open,0,1)));c.fillStyle=lg;c.fillRect(D.x,D.y,D.w,D.h);c.restore();
  c.save();c.shadowColor="rgba(104,216,230,0.6)";c.shadowBlur=6;c.fillStyle="rgba(190,245,245,0.6)";c.fillRect(D.x-3,D.y,3,D.h);c.fillRect(D.x+D.w,D.y,3,D.h);c.restore();
  const u=1-clamp(open,0,1);if(u>0){const hh=D.h*ag_sine(u),col=mix([120,150,156],DP.F.coral,shut);c.save();c.shadowColor=rgba(col,0.6*shut);c.shadowBlur=14;
    c.fillStyle=rgba(mix([30,44,48],mix(col,[20,10,8],0.35),shut),1);c.fillRect(D.x,D.y,D.w,hh);c.restore();c.fillStyle=rgba(mix(col,[255,255,255],0.3),0.9);c.fillRect(D.x,D.y+hh-2,D.w,2);
    c.strokeStyle=rgba(col,0.6+0.3*shut);c.lineWidth=1.6;c.strokeRect(D.x+0.8,D.y+0.8,D.w-1.6,hh-1.6);}
  if(amber>0)dp_halo(c,D.x+D.w/2,D.y+D.h/2,120,"amber",0.5*amber);
  c.restore();}
// storage: a vault of frosted glass along the block's foot; files (0 to 1) clears its frost, so its files show, rows and rows of them,
// plain, with no ring on any; sections (0 to 1) walls it into three, under the three rooms
function wd_storage(c,t,files,sections){const S=WD_SG;wd_glass(c,S.x,S.y,S.w,S.h,{r:10,frost:1-0.85*files,col:"grey",edge:0.7,sheen:true});
  if(files>0){c.save();rr(c,S.x,S.y,S.w,S.h,10);c.clip();c.globalAlpha*=files;const R=ag_rnd(55);for(let r=0;r<5;r++)for(let k=0;k<11;k++){const x=S.x+40+k*62+(r%2)*14,y=S.y+66+r*34;
      if(x>S.x+S.w-160)continue;c.fillStyle="rgba(170,200,204,0.30)";rr(c,x,y,44,24,4);c.fill();c.fillStyle="rgba(220,240,240,0.45)";c.fillRect(x+7,y+8,22+R()*10,2.4);c.fillRect(x+7,y+14,14+R()*12,2.4);}
    c.restore();}
  if(sections>0){c.save();c.globalAlpha*=sections;for(const e of [1,2]){const b=wd_roomBox(e,1),x=b.x-6;c.fillStyle="rgba(190,245,245,0.5)";c.fillRect(x-1.5,S.y+6,3,S.h-12);c.fillStyle="rgba(150,220,225,0.06)";c.fillRect(x-7,S.y+6,14,S.h-12);}c.restore();}}
// the copies: a stack of thin slabs of glass at storage's right end, and an admin's badge by them; crack (0 to 1) cracks them
function wd_copies(c,t,a,crack,admin){if(a<=0&&admin<=0)return;const x=1236,y0=820;c.save();
  if(a>0){c.save();c.globalAlpha*=a;for(let i=0;i<6;i++){const y=y0-i*24,w=124;c.save();c.shadowColor="rgba(104,216,230,0.5)";c.shadowBlur=8;rr(c,x,y-16,w,16,4);
      const g=c.createLinearGradient(0,y-16,0,y);g.addColorStop(0,"rgba(190,240,240,0.42)");g.addColorStop(1,"rgba(120,180,186,0.22)");c.fillStyle=g;c.fill();c.restore();
      c.fillStyle="rgba(230,250,250,0.6)";c.fillRect(x+6,y-16,w-12,1.4);
      if(crack>0){const R=ag_rnd(90+i);c.save();c.strokeStyle=rgba(DP.F.coral,0.95*crack);c.lineWidth=2;c.shadowColor=rgba(DP.F.coral,0.8);c.shadowBlur=8;c.beginPath();let px=x+20+R()*80,py=y-16;c.moveTo(px,py);
        for(let k=0;k<4;k++){px+=(R()-0.5)*22;py+=4;c.lineTo(px,py);}c.stroke();c.restore();}}
    dp_T(c,"copies",x+62,y0-6*24-14,{w:700,size:28,align:"center"});c.restore();}
  if(admin>0){c.save();c.globalAlpha*=admin;wd_mini(c,1194,760,"person","cyan",1);c.restore();}
  c.restore();}
// a door in the block's wall: an opening, lit warm-white when open (1), its leaf sliding shut (0), coral when closed for good (shut)
function wd_door(c,x,y,h,open,shut,side){const w=16,u=clamp(open,0,1);c.save();
  c.fillStyle=rgba(mix([6,14,18],[200,240,240],0.22*u),1);c.fillRect(x-w/2,y,w,h);
  if(u>0){c.save();c.globalCompositeOperation="lighter";const g=c.createLinearGradient(x,0,x-side*120,0);g.addColorStop(0,rgba([190,245,245],0.22*u));g.addColorStop(1,"rgba(190,245,245,0)");
    c.fillStyle=g;c.beginPath();c.moveTo(x,y);c.lineTo(x-side*120,y-30);c.lineTo(x-side*120,y+h+30);c.lineTo(x,y+h);c.closePath();c.fill();c.restore();}
  const lh=h*(1-ag_sine(u));if(lh>0.5){const col=mix([120,150,156],DP.F.coral,shut);c.save();c.shadowColor=rgba(col,0.4+0.5*shut);c.shadowBlur=10+8*shut;c.fillStyle=rgba(mix([40,56,60],mix(col,[30,12,10],0.3),shut),1);
    c.fillRect(x-w/2,y,w,lh);c.restore();c.fillStyle=rgba(mix(col,[255,255,255],0.3),0.8);c.fillRect(x-w/2,y+lh-2,w,2);}
  c.fillStyle="rgba(190,245,245,0.6)";c.fillRect(x-w/2-2,y-2,w+4,2);c.fillRect(x-w/2-2,y+h,w+4,2);c.restore();}
// a small badge of glass with a picture and no words: a person, or a gear (a job), in its colour; s its size
function wd_mini(c,x,y,kind,col,s){s=s||1;const cc=dp_f(col||"cyan");c.save();c.translate(x,y);c.scale(s,s);
  c.save();c.shadowColor=rgba(cc,0.55);c.shadowBlur=14;rr(c,-26,-34,52,68,10);c.fillStyle="rgba(6,24,30,0.85)";c.fill();c.restore();
  c.save();rr(c,-26,-34,52,68,10);c.clip();c.fillStyle=rgba(cc,1);c.fillRect(-26,-34,52,13);c.restore();
  rr(c,-25.2,-33.2,50.4,66.4,9.4);c.strokeStyle=rgba(mix(cc,[255,255,255],0.35),0.95);c.lineWidth=1.8;c.stroke();
  c.save();c.fillStyle=rgba(cc,0.45);c.strokeStyle=rgba(mix(cc,[255,255,255],0.4),1);c.lineWidth=1.6;
  if(kind==="gear"){dp_gear(c,0,8,15);c.fill("evenodd");c.stroke();}
  else{c.beginPath();c.arc(0,0,8,0,TAU);c.fill();c.stroke();c.beginPath();c.moveTo(-15,26);c.bezierCurveTo(-14,14,-8,10,0,10);c.bezierCurveTo(8,10,14,14,15,26);c.closePath();c.fill();c.stroke();}
  c.restore();c.restore();}
// people's half-finished work in the room: a few loose cards, dashed, part-drawn; finished (0 to 1) makes them whole (in test)
function wd_work(c,t,a,sp,finished,test){if(a<=0)return;test=test==null?1:test;c.save();c.globalAlpha*=a;
  const u=ag_sine(clamp((sp-0.25)/0.75,0,1)),bx=lerp(526,wd_roomBox(0,1).x+18,u),by=lerp(330,330,u),k=lerp(1,0.78,u);
  const one=(x0,y0,f)=>{for(const [dx,dy,w,h,r] of [[0,18,150,96,-0.05],[118,0,140,104,0.04],[60,62,130,80,0.02]]){c.save();c.translate(x0+dx*k+w*k/2,y0+dy*k+h*k/2);c.rotate(r);c.scale(k,k);
      rr(c,-w/2,-h/2,w,h,8);c.fillStyle="rgba(10,28,34,0.88)";c.fill();c.save();if(f<1)c.setLineDash([7,6]);c.strokeStyle=rgba(mix(DP.F.grey,DP.F.green,f),0.85);c.lineWidth=1.8;rr(c,-w/2+1,-h/2+1,w-2,h-2,8);c.stroke();c.restore();
      c.fillStyle="rgba(200,225,228,0.45)";const R=ag_rnd(Math.round(w+h));for(let l=0;l<4;l++){const lw=(w-34)*(l<2||f>=1?0.5+R()*0.5:0.2+R()*0.25);c.fillRect(-w/2+16,-h/2+20+l*17,lw,3);}
      c.restore();}};
  one(bx,by,0);if(sp>0.5&&test>0){const b=wd_roomBox(1,1);c.save();c.globalAlpha*=ag_in(sp,0.6,0.4)*test;one(b.x+18,by,clamp(finished,0,1));c.restore();}
  const la=1-ag_in(sp,0,0.25);if(la>0)dp_slip(c,526,404,"trying new things","grey",{a:la,size:28});
  c.restore();}
// the nightly job in the room: its badge, small (a gear, cyan), and its name; the real records beside it (violet: personal data)
function wd_job(c,t,a,sp,real){if(a<=0)return;c.save();c.globalAlpha*=a;const u=ag_sine(clamp((sp-0.25)/0.75,0,1)),b=wd_roomBox(2,1),x=lerp(1080,b.x+14,u),y=lerp(332,322,u);
  dp_slip(c,x,y,"registrar-loader","cyan",{size:28});
  if(real>0)dp_slip(c,x,y+80,"the real records","violet",{size:28,a:real});
  c.restore();}

/* ---------------------------------------------------------------- words near the frame's edge
   The hall is bigger than most shots: when the camera comes in on the block, the names round it (the open internet, the cases, the
   corridor, the rooms' names over it) would be cut by the frame's edge. wd_boxA gives how far a box (x0, y0 to x1, y1, in the hall's
   coordinates) is inside the frame, wherever the camera puts it: 1 from 48 px in, 0 at the edge; wd_T draws words like dp_T, faded by
   it. The camera glides, so they fade smoothly, and words cut by the frame are never seen. */
function wd_boxA(c,x0,y0,x1,y1){const m=c.getTransform(),cw=c.canvas.width,ch=c.canvas.height,k=cw/W,
  l=m.a*x0+m.c*y0+m.e,r=m.a*x1+m.c*y0+m.e,t=m.b*x0+m.d*y0+m.f,b=m.b*x0+m.d*y1+m.f;return clamp((Math.min(l,cw-r,t,ch-b)-4*k)/(44*k),0,1);}
function wd_edgeA(c,s,x,y,o){const tw=dp_tw(c,s,o),sz=o.size||28,x0=o.align==="center"?x-tw/2:x;return wd_boxA(c,x0,y-sz*0.75,x0+tw,y+sz*0.2);}
function wd_T(c,s,x,y,o){const e=wd_edgeA(c,s,x,y,o);if(e>0)dp_T(c,s,x,y,Object.assign({},o,{a:(o.a==null?1:o.a)*e}));}

/* ---------------------------------------------------------------- round the block */
// the key: a sealed card with a gold chip, never a character of the key itself; (x, y) its top left, 300 wide, 96 tall
function wd_key(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;dp_halo(c,x+150,y+48,190,"violet",0.08);
  dp_sealed(c,x,y,300,"",{behind:o.behind});wd_T(c,"the key",x+100,y+58,{w:700,size:30});dp_chip(c,x+212,y+20);
  if(o.dim>0){c.save();rr(c,x,y,300,96,18);c.fillStyle=rgba([2,8,10],0.6*o.dim);c.fill();c.restore();}c.restore();}
// a case of glass where a key is kept: its words at the top (title 36 px, or a line of 28), the key under them
function wd_case(c,B,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;
  dp_panel(c,B.x,B.y,B.w,B.h,{col:o.col||"grey",r:20,glowR:30});
  if(o.title){wd_T(c,o.title,B.x+30,B.y+56,{w:700,size:36});if(o.sub)wd_T(c,o.sub,B.x+30,B.y+96,{w:600,size:28,col:"mut"});}
  else if(o.sub)wd_T(c,o.sub,B.x+30,B.y+50,{w:700,size:28});
  c.restore();}
// where the key's card sits in each case
const WD_KEY0=[WD_PROV.x+60,WD_PROV.y+90],WD_KEY1=[WD_VAULT.x+60,WD_VAULT.y+128];
// the corridor of glass from the university's network: from the frame's right edge to the block's right-hand door, lit, its name over
// it; badges (cyan) walk along it towards the door (flow, 0 to 1, how many)
function wd_corridor(c,t,a,flow,o){if(a<=0)return;o=o||{};const y=WD_COR.y,h=WD_COR.h,x0=WD_DOOR2.x+8,x1=W,u=ag_sine(a);c.save();
  const xa=lerp(x1,x0,u);c.save();rr(c,xa,y,x1-xa+20,h,14);c.clip();const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgba(120,215,225,0.16)");g.addColorStop(0.5,"rgba(120,215,225,0.05)");g.addColorStop(1,"rgba(120,215,225,0.12)");
  c.fillStyle=g;c.fillRect(xa,y,x1-xa,h);c.strokeStyle="rgba(190,245,245,0.12)";c.lineWidth=1.2;for(let x=x1-((t*40)%120);x>xa;x-=120){c.beginPath();c.moveTo(x,y);c.lineTo(x-20,y+h);c.stroke();}c.restore();
  c.save();c.shadowColor="rgba(104,216,230,0.8)";c.shadowBlur=10;c.fillStyle="rgba(200,250,250,0.85)";c.fillRect(xa,y,x1-xa,2);c.fillRect(xa,y+h-2,x1-xa,2);c.restore();
  if(o.label!==false)wd_T(c,"the university's network",1452,y-16,{w:700,size:28,a:ag_in(a,0.6,0.4)*(o.la==null?1:o.la)});
  if(flow>0)for(let k=0;k<4;k++){const p=((t*0.16+k*0.25)%1),x=lerp(x1+30,x0+40,p),fa=Math.min(1,p*6,(1-p)*6)*flow;if(fa<=0.01||x<xa+20)continue;
    c.save();c.globalAlpha*=fa;wd_mini(c,x,y+h/2+2,k===2?"gear":"person","cyan",0.82);c.restore();}
  c.restore();}
// the copies' place apart: a smaller block of glass far off, with its own door and its own admins' badge; its name over it
function wd_apart(c,t,a,o){if(a<=0)return;o=o||{};const A=WD_APART;c.save();c.globalAlpha*=a;
  const rg=c.createLinearGradient(0,A.y+A.h,0,A.y+A.h+70);rg.addColorStop(0,"rgba(120,215,225,0.08)");rg.addColorStop(1,"rgba(120,215,225,0)");c.fillStyle=rg;c.fillRect(A.x,A.y+A.h,A.w,70);
  wd_glass(c,A.x,A.y,A.w,A.h,{r:12,frost:0.35});
  // its own door, on its left wall, and its own admins' badge beside it
  c.fillStyle="rgba(4,12,16,0.9)";c.fillRect(A.x-6,A.y+A.h-96,12,86);c.fillStyle="rgba(190,245,245,0.6)";c.fillRect(A.x-8,A.y+A.h-98,16,2);
  wd_mini(c,A.x+44,A.y+A.h-50,"person","cyan",0.8);
  if(o.label!==false){dp_T(c,"a place apart",A.x+A.w/2,A.y-48,{w:700,size:30,align:"center",a:o.la==null?1:o.la});dp_T(c,"its own admins",A.x+A.w/2,A.y-12,{w:600,size:28,align:"center",col:"mut",a:o.la==null?1:o.la});}
  c.restore();}
// a thin slab: one night's copy of production's data (x, y its top left), lit; locked (0 to 1) rims it coral with a small lock
function wd_slab(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=o.w||150,h=18;c.save();c.globalAlpha*=a;
  c.save();c.shadowColor="rgba(104,216,230,0.6)";c.shadowBlur=10;rr(c,x,y,w,h,5);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"rgba(200,245,245,0.55)");g.addColorStop(1,"rgba(120,185,190,0.30)");c.fillStyle=g;c.fill();c.restore();
  c.fillStyle="rgba(240,252,252,0.7)";c.fillRect(x+6,y,w-12,1.4);
  const lk=o.locked||0;if(lk>0){c.save();c.globalAlpha*=lk;rr(c,x-2,y-2,w+4,h+4,6);c.strokeStyle=rgba(DP.F.coral,0.95);c.lineWidth=2.4;c.shadowColor=rgba(DP.F.coral,0.8);c.shadowBlur=8;c.stroke();c.restore();}
  c.restore();}
// the intruder, never shown: a coral dotted line walking along a path pts [[x, y], ...], drawn to u (0 to 1), its head a small light
function wd_walk(c,pts,u,o){o=o||{};if(u<=0)return;const a=o.a==null?1:o.a;if(a<=0)return;const L=[];let tot=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(d);tot+=d;}
  let left=clamp(u,0,1)*tot;c.save();c.globalAlpha*=a;c.strokeStyle=rgba(DP.F.coral,0.95);c.lineWidth=5;c.lineCap="round";c.setLineDash([0.1,15]);c.shadowColor=rgba(DP.F.coral,0.9);c.shadowBlur=10;
  c.beginPath();c.moveTo(pts[0][0],pts[0][1]);let hx=pts[0][0],hy=pts[0][1];for(let i=0;i<L.length&&left>0;i++){const f=Math.min(1,left/L[i]);hx=lerp(pts[i][0],pts[i+1][0],f);hy=lerp(pts[i][1],pts[i+1][1],f);c.lineTo(hx,hy);left-=L[i];}
  c.stroke();c.setLineDash([]);if(u<1||o.head){dp_halo(c,hx,hy,46,"coral",0.5);c.fillStyle=rgba(mix(DP.F.coral,[255,255,255],0.4),1);c.beginPath();c.arc(hx,hy,7,0,TAU);c.fill();}
  c.restore();return[hx,hy];}
// a request that passes the catalog's ring: a light coming down the way to the files, a tick by the ring, and, where a rule applies, the
// rows it brings back, with a violet frost over the values the rule hides; p from 0 to 1.6; k the ring's size (1, or smaller in three)
function wd_request(c,cx,p,o){o=o||{};if(p<=0||p>=1.7)return;const k=o.k||1,y0=WD_RM.y+WD_RM.h-6,y1=WD_SG.y+34,d=clamp(p/0.7,0,1),y=lerp(y0,y1,ag_sine(d)),fa=1-ag_in(p,1.25,0.4);c.save();c.globalAlpha*=fa;
  if(d<1){dp_halo(c,cx,y,40,"cyan",0.6);c.fillStyle=rgba(mix(DP.F.cyan,[255,255,255],0.5),1);c.beginPath();c.arc(cx,y,7,0,TAU);c.fill();}
  dp_tick(c,cx+WD_CT.rx*k+30,WD_CT.y,"green",clamp((p-0.3)/0.4,0,1));
  if(o.rule){const ra=ag_in(p,0.7,0.3);if(ra>0){const x=cx-70,yy=y1+6;c.save();c.globalAlpha*=ra;dp_panel(c,x,yy,140,70,{col:"cyan",r:10,glowR:16});
    c.fillStyle="rgba(220,240,240,0.55)";for(let r=0;r<3;r++)c.fillRect(x+14,yy+16+r*16,46,4);
    dp_frost(c,x+72,yy+10,56,50,cc=>{cc.fillStyle="#fff";for(let r=0;r<3;r++)cc.fillRect(x+80,yy+16+r*16,40,5);},{r:6});c.restore();}}
  c.restore();}

/* ---------------------------------------------------------------- the hall, as a chapter finds it
   wd_hallWorld(c, t, s) draws everything round the block and the block itself, from a state s (each 0 to 1 unless said):
     inet       "the open internet" over the plain
     prov       the cloud provider's case; vault the university's own, and vaultCoral its rim turned coral (taken back)
     keyU       where the key is: 0 in the provider's case, 1 in the university's vault (it glides across the hall); keyA, keyDim
     corridor   the corridor from the university's network, flow the badges walking it
     apart      the copies' place apart, far off
     thread     the way out drawn from the room to "anywhere"; threadCut it cut at the wall, coral, and gone outside
     catalog, store   the names of the catalog and of storage
     block      wd_block's own options */
const WD_THREAD=[[640,226],[470,226],[340,290],[244,420]];
function wd_hallWorld(c,t,s){const f=k=>clamp(s[k]||0,0,1);
  if(f("inet")>0)wd_T(c,"the open internet",44,282,{w:700,size:28,col:"mut",a:f("inet")});
  if(f("prov")>0)wd_case(c,WD_PROV,{col:"grey",sub:"kept by the cloud provider",a:f("prov")});
  if(f("vault")>0){const vc=f("vaultCoral");wd_case(c,WD_VAULT,{col:vc>0.5?"coral":"cyan",title:"the university's key",sub:"kept by the security team",a:f("vault")});
    if(vc>0){c.save();c.globalAlpha*=vc;dp_halo(c,WD_VAULT.x+WD_VAULT.w/2,WD_VAULT.y+WD_VAULT.h/2,300,"coral",0.18);c.restore();}}
  wd_corridor(c,t,f("corridor"),f("flow"),{la:s.corLabel==null?1:s.corLabel});
  wd_apart(c,t,f("apart"),{la:s.apartLabel==null?1:s.apartLabel});
  wd_thread(c,t,f("thread"),f("threadCut"),s.anyLabel==null?1:s.anyLabel);
  wd_block(c,t,s.block||{});
  if(f("catalog")>0)dp_T(c,"the catalog",640,544,{w:700,size:28,col:"mut",a:f("catalog")});
  if(f("store")>0)dp_T(c,"storage",520,644,{w:700,size:28,a:f("store")});
  if(f("keyA")>0){const u=ag_sine(f("keyU")),x=lerp(WD_KEY0[0],WD_KEY1[0],u),y=lerp(WD_KEY0[1],WD_KEY1[1],u)-Math.sin(Math.PI*u)*90;wd_key(c,x,y,{a:f("keyA"),dim:f("keyDim")});}}
// the way out: a thread of light from the room through the block's left wall into the dark plain, "anywhere" at its end; cut (0 to 1)
// turns the part outside coral and takes it away, leaving a short end inside the wall
function wd_thread(c,t,a,cut,la){if(a<=0)return;const P=WD_THREAD;c.save();const L=[];let tot=0;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);L.push(d);tot+=d;}
  const path=(u0,u1)=>{let d0=u0*tot,d1=u1*tot,acc=0;c.beginPath();let started=false;for(let i=0;i<L.length;i++){const s0=acc,s1=acc+L[i];acc=s1;if(s1<d0||s0>d1)continue;
    const fa=clamp((d0-s0)/L[i],0,1),fb=clamp((d1-s0)/L[i],0,1),ax=lerp(P[i][0],P[i+1][0],fa),ay=lerp(P[i][1],P[i+1][1],fa),bx=lerp(P[i][0],P[i+1][0],fb),by=lerp(P[i][1],P[i+1][1],fb);
    if(!started){c.moveTo(ax,ay);started=true;}c.lineTo(bx,by);}};
  const uw=L[0]/tot,u=ag_sine(a);c.lineCap="round";c.lineJoin="round";
  // inside the wall: stays
  c.save();c.shadowColor="rgba(104,216,230,0.8)";c.shadowBlur=10;c.strokeStyle="rgba(190,245,245,0.9)";c.lineWidth=3;path(0,Math.min(u,uw));c.stroke();c.restore();
  // outside: the same light, turning coral and fading as it's cut
  const oa=1-ag_in(cut,0.35,0.65);if(u>uw&&oa>0){c.save();c.globalAlpha*=oa;const col=mix([190,245,245],DP.F.coral,ag_in(cut,0,0.35));c.shadowColor=rgba(col,0.8);c.shadowBlur=10;c.strokeStyle=rgba(col,0.9);c.lineWidth=3;path(uw,u);c.stroke();
    if(u>=0.999){c.fillStyle=rgba(mix(col,[255,255,255],0.3),1);c.beginPath();c.arc(P[3][0],P[3][1],6,0,TAU);c.fill();wd_T(c,"anywhere",P[3][0]-24,P[3][1]+52,{w:700,size:28,align:"center",a:la*ag_in(a,0.85,0.15)});}c.restore();}
  if(cut>0){c.save();c.globalAlpha*=ag_in(cut,0,0.3);const x=P[1][0],y=P[1][1];c.strokeStyle=rgba(DP.F.coral,1);c.lineWidth=3.4;c.lineCap="round";c.shadowColor=rgba(DP.F.coral,0.9);c.shadowBlur=10;
    c.beginPath();c.moveTo(x-12,y-14);c.lineTo(x-12,y+14);c.stroke();c.restore();}
  c.restore();}

/* ---------------------------------------------------------------- the board, and the university's map */
// the board: a pane of clear glass standing in the hall, where Sam writes who secures what
const WD_BOARD={x:200,y:96,w:1140,h:700};
// a row of the board: a card of glass with a band of solid colour naming who, and what it secures under it; p brings it in
function wd_row(c,y,who,what,col,p){if(p<=0)return;const x=WD_BOARD.x+50,w=WD_BOARD.w-100,h=128;c.save();c.globalAlpha*=ag_in(p,0,0.4);c.translate(0,(1-ag_eo(clamp(p/0.6,0,1)))*14);
  dp_panel(c,x,y,w,h,{col,r:18,glowR:28});dp_band(c,x,y,w,54,18,col,who);dp_T(c,what,x+28,y+100,{w:600,size:30});c.restore();}
// the marker Sam holds, in figure space at the near hand (hands.near)
function wd_marker(c,h){const [x,y]=h.near;c.save();c.translate(x+16,y-30);c.rotate(-0.5);c.fillStyle="rgb(30,36,40)";rr(c,-9,-58,18,96,7);c.fill();
  c.fillStyle="rgb(72,222,244)";rr(c,-9,-74,18,22,6);c.fill();c.fillStyle="rgba(220,250,250,0.35)";c.fillRect(-6,-54,3,86);c.restore();}
// the university's map, on a pane: its five areas, each with its name, its owner's badge and a tick once the owner is named
const WD_MAPAREAS=[["Registrar",300,212,460,280],["Learning",780,212,420,280],["Planning",1220,212,400,280],["HR",300,512,600,290],["Finance",920,512,700,290]];
function wd_uniMap(c,t,a,owners,o){if(a<=0)return;o=o||{};c.save();c.globalAlpha*=a;dp_panel(c,260,96,1400,736,{col:"cyan",r:24});dp_T(c,"the university's map",300,160,{w:700,size:36});
  WD_MAPAREAS.forEach(([name,x,y,w,h],i)=>{const la=o.areas?o.areas(i):1;if(la<=0)return;c.save();c.globalAlpha*=la;
    rr(c,x,y,w,h,16);c.fillStyle="rgba(120,215,225,0.08)";c.fill();c.strokeStyle="rgba(190,245,245,0.55)";c.lineWidth=2;c.stroke();
    dp_T(c,name,x+26,y+50,{w:700,size:32});
    const ow=owners?owners(i):0;if(ow>0){c.save();c.globalAlpha*=ag_in(ow,0,0.4);wd_mini(c,x+w-64,y+h-62,"person","cyan",1);c.restore();dp_tick(c,x+w-118,y+h-50,"green",clamp(ow,0,1));}
    c.restore();});
  c.restore();}

/* ===== Walls, doors and keys: the scenes =====
   Nine chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (wd_city.js: Ragusa; wd_hall.js: the hall, the board's corner, the map); what moves is drawn live in the shots of ag_shots, which
   glide the camera in one room and dissolve, or cut, between rooms. A place's tag is drawn in screen space inside its shot, so it
   leaves with it. In the hall the camera glides from chapter to chapter (ag_cutInto, at the end), and each chapter finds the block as
   the one before left it (wd_base), so nothing jumps. */
DP_PEOPLE.push("sam");

// draw in screen space, whatever the camera is doing
function wd_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// a place's tag, top left in screen space: the place and the year, and a line under it
function wd_tag(ctx,text,a,sub,sa){if(a<=0)return;const w=dp_tw(ctx,text,{w:700,size:30})+48;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,72,56,w,66,{col:"grey",r:14,glowR:24});
  dp_T(ctx,text,96,100,{w:700,size:30});ctx.restore();if(sub&&sa>0){const w2=dp_tw(ctx,sub,{w:600,size:28})+44;ctx.save();ctx.globalAlpha*=a*sa;dp_panel(ctx,72,134,w2,58,{col:"grey",r:14,glowR:20});
    dp_T(ctx,sub,94,173,{w:600,size:28,col:"mut"});ctx.restore();}}
// a pill that springs in at t0 and fades at t1 (its middle at x, y its baseline)
function wd_pillAt(ctx,x,y,text,col,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y-12,lerp(0.7,1,clamp(k,0,1.2)));dp_pill(ctx,x,y,text,col,Object.assign({align:"center"},o||{}));ctx.restore();}
// a card that springs in at t0 and fades at t1
function wd_cardAt(ctx,x,y,w,words,t,t0,t1,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;
  return dp_card(ctx,x,y,w,words,Object.assign({},o||{},{a,k:Math.min(1,ag_spr(t,t0,0.5))}));}
// a speech card with a small tail towards whoever speaks (tx, ty)
function wd_sayAt(ctx,x,y,w,text,tx,ty,t,t0,t1){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return;const b=dp_card(ctx,x,y,w,{title:text},{measure:true});
  ctx.save();ctx.globalAlpha*=a;const bx=clamp(tx,x+40,x+w-40);ctx.save();ctx.shadowColor="rgba(72,222,244,0.5)";ctx.shadowBlur=14;ctx.fillStyle="rgba(10,30,36,0.92)";ctx.strokeStyle="rgba(150,235,245,0.9)";ctx.lineWidth=2.2;
  ctx.beginPath();ctx.moveTo(bx-18,y+b.h-2);ctx.lineTo(tx,ty);ctx.lineTo(bx+18,y+b.h-2);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
  dp_card(ctx,x,y,w,{title:text},{col:"cyan",k:Math.min(1,ag_spr(t,t0,0.5))});ctx.restore();}
// how long ago something started, as a draw-on from 0 to 1 over d seconds
const wd_on=(t,t0,d)=>clamp((t-t0)/(d||1),0,1);

/* ---------------------------------------------------------------- the hall, as each chapter finds it
   What the chapters before have left on the block and round it, so each chapter opens on what the last one ended on. */
function wd_base(ch){const b={labels:1,rooms:1,work:1,job:1,real:1,side:1,copies:1,admin:1,door:1,lit:()=>0.15};
  const s={inet:1,prov:1,keyA:1,keyU:0,thread:1,catalog:1,store:1,block:b};
  if(ch>=5)b.walls=1;
  // while the walls and doors go up, the room's own things step back: people's work and the nightly job come back in their rooms
  if(ch===4||ch===5)Object.assign(b,{work:0,job:0,real:0});
  if(ch>=6){Object.assign(b,{door:0,doorShut:1,door2:1,shaft:1,ring:1,side:0,sideShut:1});Object.assign(s,{corridor:1,flow:1,threadCut:1});}
  if(ch>=7){Object.assign(b,{split:1,sections:1,veil:(e)=>e<2?1:0,finished:1,lit:(e)=>e===2?0.3:0.15});s.catalog=0;}
  if(ch>=8){Object.assign(s,{prov:0,keyU:1,vault:1});}
  if(ch>=9){Object.assign(s,{apart:1});Object.assign(b,{copies:0,admin:0});}
  return s;}
// a state and changes to it: the block's own changes go in b
function wd_state(ch,o,b){const s=wd_base(ch);Object.assign(s,o||{});s.block=Object.assign({},s.block,b||{});return s;}
// Sam, at the bottom left of the hall, facing the block, faded whole
function wd_samHall(ctx,t,a,o){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;dp_person(ctx,"sam",250,830,0.62,Object.assign({t,gaze:[3,-2]},o||{}));ctx.restore();}

/* ---------------------------------------------------------------- 1 · Few gates */
scene("gates",(ctx,S,t,sc)=>{
  const T={today:wAt(sc,"today","Today"),walls:wAt(sc,"republic","behind high"),trade:wAt(sc,"trade","It lives"),ships:wAt(sc,"trade","its ships"),
    gates:wAt(sc,"gates","Sailors"),few:wAt(sc,"gates","through only"),more:wAt(sc,"more","more than"),plague:wAt(sc,"plague","thirteen forty-eight"),fast:wAt(sc,"plague","spread fast"),
    thousands:wAt(sc,"thousands","It killed"),back:wAt(sc,"thousands","kept coming"),tell:wAt(sc,"tell","At the gate"),nobody:wAt(sc,"tell","nobody could"),
    shut:wAt(sc,"shut","Shut"),loses:wAt(sc,"shut","loses"),open:wAt(sc,"open","Leave it"),walks:wAt(sc,"open","walks in"),change:wAt(sc,"change","Something")};
  ag_shots(ctx,S,t,sc.dur,[
    // the city from the sea at dusk; along its walls, three gates light in turn; two ships come into the harbour
    {at:0,place:"wdRagusa",keys:[[0,960,560,1.1],[T.walls-0.4,760,600,1.28],[T.walls+2.0,1260,620,1.28],[T.ships-0.2,1380,640,1.22]],d:2.6,push:0,draw:(c,tt)=>{
      WD_GATES.forEach(([x,y,w,h],i)=>{const a=ag_in(tt,T.walls+0.5+i*0.7,0.6);if(a>0){c.save();c.globalCompositeOperation="lighter";wd_glow(c,x+w/2,y-h/2,70,WD.lamp,0.5*a);c.restore();
        c.save();c.beginPath();wd_archPath(c,x,y,w,h);c.clip();c.fillStyle=rgba(WD.lamp,0.55*a);c.fillRect(x,y-h,w,h);c.restore();}});
      wd_ship(c,1450,786,0.3,{t:tt,seed:1});wd_ship(c,1340,792,0.26,{t:tt,seed:2,flip:true});
      for(const [i,y0,s] of [[0,800,0.34],[1,812,0.3]]){const u=ag_eo(wd_on(tt,T.ships-0.6+i*1.0,5.2)),x=lerp(2120+i*90,1560+i*40,u);if(u>0)wd_ship(c,x,y0,s,{t:tt,seed:3+i,flip:true,sail:1-0.8*u});}
      wd_scr(c,S,()=>wd_tag(c,"Ragusa · 1377",ag_in(tt,1.0,0.6),"today: Dubrovnik, Croatia",ag_in(tt,T.today,0.5)));}},
    // a gate from the quay: porters with bales and barrels go in, one at a time; a ship at the quay takes a faint coral rim;
    // the plague's year
    {at:T.gates-0.3,place:"wdGate",keys:[[0,1000,560,1.06],[T.more-0.6,1200,600,1.14]],d:2.4,draw:(c,tt)=>{
      wd_gateLight(c,1);wd_gateLantern(c,tt,1);
      wd_ship(c,1700,914,0.74,{t:tt,flip:true,rim:ag_in(tt,T.more+0.2,1.2)*0.85,seed:4});
      for(let k=0;k<5;k++){const t0=T.gates-0.6+k*1.6,u=wd_on(tt,t0,5.2);if(u<=0||u>=1)continue;const q=ag_sine(u),x=lerp(1340,945,q),y=lerp(1050,786,q),s=lerp(1.45,0.82,q),
          fa=Math.min(1,u*6)*(1-ag_in(u,0.86,0.14));wd_walker(c,x,y,s,{flip:true,ph:tt*5.2+k,carry:k%2?"barrel":"bale",a:fa,col:k%2?[58,56,60]:[50,58,64],light:0.6});}
      wd_scr(c,S,()=>wd_cardAt(c,1328,64,520,{kick:"1348",title:"the plague"},tt,T.plague,null,{col:"coral",behind:false}));}},
    // a street: warm windows go dark, one by one, slowly; nothing else is shown
    {at:T.thousands-0.4,place:"wdStreet",keys:[[0,960,560,1.0],[T.thousands+0.2,960,520,1.16]],d:6,push:0,draw:(c,tt)=>{const R=ag_rnd(12);
      const dark=WD_SWIN.map(()=>T.thousands+0.6+R()*5.4);wd_streetWindows(c,(i,w)=>(i%5===3?0:1)*(1-ag_in(tt,dark[i],1.0)*(i%4===1?0:1)));wd_palace(c,0.6,0,0.6);}},
    // the gate again: two travellers, alike; shut, and the harbour empties; open, and the sickness drifts in
    {at:T.tell-0.4,place:"wdGate",keys:[[0,960,540,1.12],[T.shut-0.4,1060,520,1.06]],d:2.2,push:0,draw:(c,tt)=>{
      const shut=ag_in(tt,T.shut,1.0)*(1-ag_in(tt,T.open,1.2)),light=1-0.75*shut;
      wd_gateLight(c,light);wd_gateLantern(c,tt,1);
      // the ship leaves when the port shuts, and the harbour lies empty
      const go=ag_in(tt,T.shut+0.2,2.6),back=ag_in(tt,T.open+0.2,0.1);if(go<1||back>0)wd_ship(c,1700+ag_sine(go)*420*(1-back),914,0.74,{t:tt,flip:go<=0.001,a:(1-go)+back*0,seed:4,rim:0.85*(1-go)});
      wd_gateDoors(c,1-shut);
      // two travellers at the gate, cloaked alike, and the question no one could answer
      const tv=ag_in(tt,T.tell+0.2,0.6)*(1-ag_in(tt,T.shut-0.6,0.6));if(tv>0){wd_walker(c,872,808,1.02,{walk:0,a:tv,col:[70,74,78],light:0.6});wd_walker(c,1018,808,1.02,{walk:0,flip:true,a:tv,col:[70,74,78],light:0.6});
        const q=ag_in(tt,T.nobody,0.5)*tv;if(q>0){c.save();c.globalAlpha*=q;c.translate(0,(1-ag_eo(wd_on(tt,T.nobody,0.8)))*30);const sh=c.createRadialGradient(945,628,0,945,628,96);sh.addColorStop(0,"rgba(4,12,16,0.82)");sh.addColorStop(0.6,"rgba(4,12,16,0.6)");sh.addColorStop(1,"rgba(4,12,16,0)");
          c.fillStyle=sh;c.fillRect(849,532,192,192);dp_T(c,"?",945,668,{w:800,size:120,align:"center",col:"coral"});c.restore();}}
      wd_pillAt(c,945,300,"no trade","coral",tt,T.loses-0.2,T.open);
      // open: a faint coral haze comes in from the harbour, through the gate, and stays where it is
      const hz=ag_in(tt,T.open+0.4,6.0)*0.7+ag_in(tt,T.walks,3.0)*0.3;wd_haze(c,[[1880,960],[1500,900],[1180,820],[945,740],[945,560]],Math.min(hz,0.92),ag_in(tt,T.open+0.3,1.2)*3.2,tt<T.change?tt:T.change,{seed:9,n:30,r:92});}}
  ]);
});

/* ---------------------------------------------------------------- 2 · A month apart */
scene("apart",(ctx,S,t,sc)=>{
  const T={council:wAt(sc,"council","Great Council"),passed:wAt(sc,"council","passed"),anyone:wAt(sc,"month","Anyone"),mrkan:wAt(sc,"month","on the islet"),cavtat:wAt(sc,"month","Cavtat"),
    then:wAt(sc,"then","Only then"),enter:wAt(sc,"then","enter"),noone:wAt(sc,"noone","No one"),stays:wAt(sc,"noone","stays the month"),officers:wAt(sc,"officers","health officers"),
    port:wAt(sc,"port","The port"),island:wAt(sc,"island","held on"),first:wAt(sc,"first","the first"),forty:wAt(sc,"forty","forty days"),word:wAt(sc,"forty","the word"),
    same:wAt(sc,"same","The university's"),people:wAt(sc,"same","people and jobs"),breaks:wAt(sc,"same","whoever breaks"),doors:wAt(sc,"needs","a few doors"),apart:wAt(sc,"needs","a place apart")};
  T.sea=T.anyone+2.4;
  ag_shots(ctx,S,t,sc.dur,[
    // the Great Council's hall, its nobles on their benches
    {at:0,place:"wdCouncil",keys:[[0,960,520,1.0],[2.0,960,560,1.08]],d:4.0,push:0.02,draw:(c,tt)=>{wd_scr(c,S,()=>wd_tag(c,"27 July 1377",ag_in(tt,0.8,0.6)));}},
    // the table: the law written on its parchment, and sealed; what it says
    {at:T.passed-0.5,place:"wdTable",keys:[[0,960,520,1.04],[T.anyone,960,540,1.0]],d:2.4,push:0.02,draw:(c,tt)=>{
      wd_parchment(c,560,130,760,ag_in(tt,T.passed-0.5,0.6),clamp((tt-T.passed-0.3)/0.7,0,1),tt);
      wd_cardAt(c,380,520,1160,{kick:"The law",title:"Whoever comes from a place with plague: a month apart, on Mrkan or in Cavtat, before entering"},tt,T.anyone,null,{col:"cyan"});}},
    // the coast as a map: the city, the open sea, Mrkan and Cavtat; a month apart, then in through the gate; and no one goes to them
    {at:T.mrkan-0.4,place:"wdCoast",keys:[[0,900,560,1.08],[T.noone-0.4,880,560,1.04]],d:2.2,draw:(c,tt)=>wd_coastLaw(c,S,tt,T,false)},
    // the quay and the gate: health officers with lanterns, one by a ship, one at the gate
    {at:T.officers-0.4,place:"wdGate",keys:[[0,1040,560,1.06]],push:0.03,draw:(c,tt)=>{wd_gateLight(c,1);wd_gateLantern(c,tt,1);wd_ship(c,1700,914,0.74,{t:tt,flip:true,seed:4});
      const a=ag_in(tt,T.officers,0.6);wd_walker(c,1380,960,1.42,{walk:0,carry:"lantern",hood:false,light:1,col:[44,52,64],a});wd_walker(c,1190,812,1.02,{walk:0,flip:true,carry:"lantern",hood:false,light:1,col:[44,52,64],a});}},
    // the port open: ships in the harbour again, the windows lit
    {at:T.port-0.4,place:"wdRagusa",keys:[[0,1160,600,1.18],[T.port+0.2,1260,620,1.24]],d:3.0,push:0,draw:(c,tt)=>{
      wd_ship(c,1450,786,0.3,{t:tt,seed:1});wd_ship(c,1340,792,0.26,{t:tt,seed:2,flip:true});
      for(const [i,x0,y0,s] of [[0,1560,800,0.34],[1,1640,812,0.3],[2,1250,806,0.28]]){const u=ag_eo(wd_on(tt,T.port-0.2+i*0.7,3.4));wd_ship(c,lerp(x0+520,x0,u),y0,s,{t:tt,seed:5+i,flip:true,sail:1-0.8*u});}}},
    // the map again: the sickness held on the island; the first known law; forty days
    {at:T.island-0.4,place:"wdCoast",keys:[[0,1080,620,1.16],[T.first-0.4,900,560,1.04]],d:2.4,draw:(c,tt)=>{wd_coastLaw(c,S,tt,T,true);
      wd_scr(c,S,()=>{wd_cardAt(c,560,170,800,{kick:"1377",title:"the first known quarantine law"},tt,T.first,T.forty-0.3,{col:"cyan"});
        wd_cardAt(c,560,170,800,{kick:"40 days",title:"quaranta · quarantine"},tt,T.forty+0.4,T.same-0.6,{col:"cyan"});});}},
    // the university's hall: people and jobs reach the platform every day; whoever breaks in comes too; a few doors, each with a
    // rule, and a place apart; then the title
    {at:T.same-0.4,place:"wdHall",keys:[[0,930,500,1.04],[T.doors-0.6,980,520,1.0]],d:2.4,draw:(c,tt)=>{
      const s=wd_state(3,{prov:0,keyA:0,thread:0,catalog:0,store:0,inet:ag_in(tt,T.people,0.6)},{labels:0,rooms:0,work:0,job:0,real:0,copies:0,admin:0,lit:()=>0.15,
        door2:ag_in(tt,T.doors+0.5,0.8)});s.apart=ag_in(tt,T.apart,0.8);s.apartLabel=0;wd_hallWorld(c,tt,s);
      for(let k=0;k<5;k++){const u=wd_on(tt,T.people-0.2+k*0.9,3.4);if(u<=0||u>=1)continue;const x=lerp(150,470,ag_sine(u)),y=lerp(640,392,ag_sine(u));c.save();c.globalAlpha*=Math.min(1,u*5,(1-u)*5);wd_mini(c,x,y,k%2?"gear":"person","cyan",0.8);c.restore();}
      wd_walk(c,[[120,760],[300,560],[440,440]],wd_on(tt,T.breaks,2.2),{a:1-ag_in(tt,T.doors-0.4,0.6)});
      // the two doors, each with its ring: a rule at each
      for(const [x,i] of [[WD_DOOR.x,0],[WD_DOOR2.x,1]]){const a=ag_in(tt,T.doors+0.2+i*0.5,0.5);if(a<=0)continue;c.save();c.globalAlpha*=a;c.strokeStyle=rgba(DP.F.cyan,1);c.lineWidth=4;c.shadowColor=rgba(DP.F.cyan,0.9);c.shadowBlur=12;
        c.beginPath();c.ellipse(x,WD_DOOR.y+WD_DOOR.h/2,30,72,0,0,TAU);c.stroke();c.restore();}}}
  ]);
  dp_title(ctx,S,t,sc.cues.breath,"Walls, doors and keys",null,"FILM 3 OF 9 · LOCKS BEFORE THE DATA");
});
// the coast's map, as the law is said (T the chapter's moments); held: the haze rests on the islet
function wd_coastLaw(c,S,tt,T,held){const M=WD_MAP;
  const nm=(text,x,y,t0,o)=>{const a=held?1:ag_in(tt,t0,0.5);if(a>0)dp_T(c,text,x,y,Object.assign({w:700,size:30,align:"center",a},o||{}));};
  nm("Ragusa",M.city[0]-40,M.city[1]+78,T.mrkan-0.6);nm("the open sea",M.sea[0],M.sea[1],T.sea,{col:"mut",w:600});nm("Mrkan",M.mrkan[0],M.mrkan[1]+64,T.mrkan+0.2);nm("Cavtat",M.cavtat[0]+96,M.cavtat[1]+8,T.cavtat);
  // the ship at sea, and its line to the islet; a month of moons over it; then on to the city's gate, green
  const ship=[700,800],isl=[1270,742],gate=[M.gate[0]+8,M.gate[1]+14];
  if(!held){wd_ship(c,ship[0],ship[1],0.2,{t:tt,seed:7,sail:1});
    const l1=wd_on(tt,T.then,1.4);if(l1>0)dp_link(c,[ship[0]+30,ship[1]-14],isl,"grey",l1,{dash:[8,9],dot:false});
    for(let k=0;k<4;k++){const a=ag_in(tt,T.then+1.0+k*0.55,0.4);if(a>0){const x=isl[0]-230+k*62,y=isl[1]-70-Math.sin((k+0.5)/4*Math.PI)*36;wd_moon(c,x,y,15,k,a);}}
    const l2=wd_on(tt,T.enter+0.4,1.6);if(l2>0)dp_link(c,isl,gate,"green",ag_sine(l2),{dash:[10,8]});
    // no one from the city goes to them: whoever does stays the month too
    const g=wd_on(tt,T.noone+0.2,2.6);if(g>0){const a=1-ag_in(tt,T.officers-1.0,0.6),A=[gate[0]+24,gate[1]+56],C=[860,760],B=[isl[0]-26,isl[1]+12],bz=u=>[(1-u)*(1-u)*A[0]+2*(1-u)*u*C[0]+u*u*B[0],(1-u)*(1-u)*A[1]+2*(1-u)*u*C[1]+u*u*B[1]];
      c.save();c.globalAlpha*=a;c.strokeStyle="rgba(200,230,232,0.8)";c.lineWidth=2.4;c.setLineDash([3,9]);c.lineCap="round";c.beginPath();const ug=ag_sine(g);for(let k=0;k<=40;k++){const p=bz(ug*k/40);k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.stroke();c.setLineDash([]);
      const p=bz(ug);c.fillStyle="rgb(240,250,250)";c.beginPath();c.arc(p[0],p[1],7,0,TAU);c.fill();c.restore();}
    wd_scr(c,S,()=>wd_cardAt(c,1060,170,700,{title:"Whoever goes to them stays the month too"},tt,T.stays-0.4,T.officers-0.8,{col:"cyan"}));}
  else{const a=ag_in(tt,T.island,1.4);wd_haze(c,[[isl[0]-40,isl[1]],[isl[0]+40,isl[1]-6]],1,a*1.4,tt,{seed:3,n:14,r:46});
    }}
// a moon of the month: phase k (0 a crescent, 1 a half, 2 full, 3 a half waning), drawn in light
function wd_moon(c,x,y,r,k,a){if(a<=0)return;c.save();c.globalAlpha*=a;dp_halo(c,x,y,r*3,[220,240,240],0.18);c.fillStyle="rgba(230,245,245,0.95)";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
  if(k!==2){c.fillStyle="rgb(8,22,28)";c.beginPath();const off=k===0?r*0.62:k===1?r:-r;if(k===3){c.rect(x-r,y-r,r,2*r);}else if(k===1){c.rect(x-r,y-r,r,2*r);}else c.arc(x-off,y,r,0,TAU);c.fill();}
  c.restore();}

/* ---------------------------------------------------------------- 3 · If someone got in */
// the intruder's walk, through the block as it is: from the plain to the door, into the room, to each pane, down the side door to the
// files; out along the thread; and to the copies
const WD_WALK1=[[200,560],[470,390],[560,392],[591,300],[763,300],[935,300],[1107,300],[1279,300],[1132,470],[1132,650],[900,720]];
const WD_WALK2=[[600,330],[620,226],[470,226],[340,290],[244,420]],WD_WALK3=[[900,720],[1180,720],[1236,700]];
scene("inside",(ctx,S,t,sc)=>{
  const T={job:wAt(sc,"token","nightly job"),longer:wAt(sc,"token","no longer"),sam:wAt(sc,"asks","Sam Okafor"),attacker:wAt(sc,"asks","what an attacker"),
    door:wAt(sc,"door","Today"),inet:wAt(sc,"door","open internet"),anyone:wAt(sc,"door","anyone"),one:wAt(sc,"one","one workspace"),exp:wAt(sc,"one","experiments"),real:wAt(sc,"one","real records"),
    areas:wAt(sc,"areas","every area's"),reg:wAt(sc,"areas","registrar's"),learn:wAt(sc,"areas","learning"),plan:wAt(sc,"areas","planning"),hr:wAt(sc,"areas","HR"),fin:wAt(sc,"areas","finance"),
    files:wAt(sc,"files","straight to"),store:wAt(sc,"files","storage"),past:wAt(sc,"files","past the catalog"),out:wAt(sc,"out","Data can"),backups:wAt(sc,"backups","The backups"),admin:wAt(sc,"backups","any admin"),
    key:wAt(sc,"key","the data's key"),cant:wAt(sc,"key","can't take"),grew:wAt(sc,"grew","Nobody"),small:wAt(sc,"grew","started small")};
  T.walk=T.cant+0.6;
  const lit=[T.reg,T.learn,T.plan,T.hr,T.fin];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",keys:[[0,960,540,1.0],[0.5,1060,400,1.34],[T.sam-0.2,780,560,1.06],[T.inet-0.8,520,500,1.16],[T.one-0.6,930,330,1.42],[T.areas+0.6,930,300,1.36],
        [T.files-0.2,930,640,1.3],[T.out-0.3,600,420,1.14],[T.backups-0.2,1120,640,1.34],[T.key-0.3,560,330,1.02],[T.walk-0.4,960,540,1.0]],d:1.8,push:0,draw:(c,tt)=>{
      const walking=ag_in(tt,T.walk,0.3)*(1-ag_in(tt,T.grew+0.2,0.8));
      const s=wd_state(3,{inet:ag_in(tt,T.inet,0.5),prov:ag_in(tt,T.key,0.6),keyA:ag_in(tt,T.key+0.3,0.6),thread:wd_on(tt,T.out+0.2,1.4),catalog:ag_in(tt,T.past,0.5),store:ag_in(tt,T.store,0.5)},
        {labels:i=>ag_in(tt,lit[i],0.4),rooms:ag_in(tt,T.one,0.5),work:ag_in(tt,T.exp,0.5),job:ag_in(tt,T.job-0.4,0.6),real:ag_in(tt,T.real,0.5),
         lit:(e,i)=>0.15+0.85*ag_in(tt,lit[i],0.4)*(1-ag_in(tt,T.files-0.6,0.8)),coral:(e,i)=>walking*ag_in(tt,T.walk+0.5+i*0.32,0.25),
         side:1,copies:ag_in(tt,T.backups,0.5),admin:ag_in(tt,T.admin,0.5),crack:ag_in(tt,T.walk+2.6,0.4)*(1-ag_in(tt,T.grew+0.2,0.8)),door:1});
      wd_hallWorld(c,tt,s);
      // the job no longer carries Jun's token: the token's sealed card, struck through, and gone
      const tk=ag_in(tt,0.6,0.5)*(1-ag_in(tt,T.longer+1.6,0.6));if(tk>0)dp_sealed(c,744,328,300,"Jun's token",{a:tk,revoked:wd_on(tt,T.longer+0.2,0.8)});
      // the intruder's walk through it all
      if(walking>0){c.save();c.globalAlpha*=walking;wd_walk(c,WD_WALK1,wd_on(tt,T.walk,2.6));wd_walk(c,WD_WALK2,wd_on(tt,T.walk+1.2,1.0));wd_walk(c,WD_WALK3,wd_on(tt,T.walk+2.2,0.6));c.restore();}
      // it started small, and grew: a block of the size it began, growing to what it is
      const gr=wd_on(tt,T.small-0.4,2.2),ga=ag_in(tt,T.small-0.4,0.3)*(1-ag_in(tt,T.small+1.9,0.6));if(ga>0){const B=WD_BK,w=lerp(330,B.w,ag_sine(gr)),h=lerp(270,B.h,ag_sine(gr));
        c.save();c.globalAlpha*=ga;c.setLineDash([12,10]);c.strokeStyle="rgba(200,250,250,0.9)";c.lineWidth=3;c.shadowColor="rgba(104,216,230,0.8)";c.shadowBlur=10;rr(c,B.x-8,B.y-8,w+16,h+16,16);c.stroke();c.restore();}
      // Sam, and the question
      wd_samHall(c,tt,ag_in(tt,T.sam-0.3,0.6)*(1-ag_in(tt,T.inet-1.4,0.6)));
      wd_sayAt(c,40,430,520,"If someone got in, how far could they go?",300,612,tt,T.attacker,T.door-0.2);}}
  ]);
});

/* ---------------------------------------------------------------- 4 · Who secures what */
scene("who",(ctx,S,t,sc)=>{
  const T={writes:wAt(sc,"writes","Sam writes"),cloud:wAt(sc,"cloud","The cloud"),makers:wAt(sc,"makers","The platform's"),rest:wAt(sc,"rest","The university"),
    contract:wAt(sc,"contract","Whatever"),data:wAt(sc,"contract","the data is"),walls:wAt(sc,"contract","the walls"),map:wAt(sc,"map","They follow"),areas:wAt(sc,"map","the areas"),
    owner:wAt(sc,"map","the owner"),decides:wAt(sc,"map","Who decides"),trusted:wAt(sc,"trusted","A wall"),checked:wAt(sc,"trusted","still checked"),
    small:wAt(sc,"small","But walls"),mistake:wAt(sc,"small","a mistake"),started:wAt(sc,"small","where it started")};
  ag_shots(ctx,S,t,sc.dur,[
    // the board: Sam writes who secures what, a marker in hand
    {at:0,place:"wdBoard",keys:[[0,860,520,1.04],[T.rest+0.4,820,500,1.08]],d:3,push:0,draw:(c,tt)=>{const B=WD_BOARD;
      dp_wall(c,B.x,B.y,B.w,B.h,{col:"cyan"});
      wd_row(c,150,"The cloud provider","buildings, machines, the network between them","grey",wd_on(tt,T.cloud,0.8));
      wd_row(c,300,"The platform's makers","its software, how it checks every request","grey",wd_on(tt,T.makers,0.8));
      wd_row(c,450,"The university","who gets in, what each may do, settings, keys, copies",[190,245,245],wd_on(tt,T.rest,0.8));
      wd_pillAt(c,452,672,"its data: always",[190,245,245],tt,T.data,null,{size:30,glow:28});
      dp_person(c,"sam",1590,830,0.84,{t:tt,flip:true,pose:"hold",hold:(x,h)=>wd_marker(x,h),gaze:[2,0]});}},
    // the university's map: five areas, each with its named owner
    {at:T.map-0.4,place:"wdMap",keys:[[0,960,470,1.06]],push:0.03,draw:(c,tt)=>{
      wd_uniMap(c,tt,1,i=>wd_on(tt,T.owner+i*0.3,0.6),{areas:i=>ag_in(tt,T.areas-0.2+i*0.2,0.4)});
      wd_cardAt(c,1180,712,440,{kick:"owners",title:"Who decides"},tt,T.decides,null,{col:"cyan"});}},
    // the block again: walls rise along the areas' edges, five rooms where there was one; every request still checked; a spill stays put
    {at:T.trusted-0.4,cut:true,place:"wdHall",keys:[[0,930,415,1.3],[T.small+0.4,930,425,1.27]],d:2,push:0,draw:(c,tt)=>{
      const s=wd_state(4,{},{walls:wd_on(tt,T.trusted+0.3,2.2)});wd_hallWorld(c,tt,s);
      // a request in each room, one at a time: a badge reaches a pane, through a small ring, and a tick
      for(let i=0;i<5;i++){const t0=T.checked-0.6+i*0.9,p=wd_on(tt,t0,1.4),fa=ag_in(tt,t0,0.3)*(1-ag_in(tt,t0+1.6,0.4));if(fa<=0)continue;const pb=wd_paneBox(2,i,0),cx=pb.x+pb.w/2;
        c.save();c.globalAlpha*=fa;wd_mini(c,cx,lerp(450,400,ag_sine(p)),"person","cyan",0.72);c.strokeStyle=rgba(DP.F.cyan,0.95);c.lineWidth=3;c.shadowColor=rgba(DP.F.cyan,0.8);c.shadowBlur=8;
        c.beginPath();c.ellipse(cx,pb.y+pb.h+14,34,8,0,0,TAU);c.stroke();c.restore();dp_tick(c,cx+44,pb.y+pb.h+14,"green",clamp((p-0.4)/0.5,0,1)*fa);}
      // a mistake, or an intruder: a coral spill in one room, held there by its walls
      const sp=ag_in(tt,T.mistake,0.8)*(1-ag_in(tt,sc.dur-0.9,0.5));if(sp>0){const pb=wd_paneBox(2,3,0);wd_haze(c,[[pb.x+30,410],[pb.x+pb.w-30,400]],1,sp*1.6,tt,{seed:21,n:12,r:46});
        wd_pane(c,pb.x,pb.y,pb.w,pb.h,{lit:0.6*sp,mix:1,label:"HR"});}}}
  ]);
});

/* ---------------------------------------------------------------- 5 · Few doors */
scene("doors",(ctx,S,t,sc)=>{
  const T={off:wAt(sc,"internet","comes off"),reach:wAt(sc,"internet","reach it only"),priv:wAt(sc,"internet","private path"),net:wAt(sc,"internet","university's own"),
    storage:wAt(sc,"storage","reaches the storage"),too:wAt(sc,"storage","too"),out:wAt(sc,"out","the way out"),list:wAt(sc,"out","short list"),
    files:wAt(sc,"files","Storage keeps"),masks:wAt(sc,"files","no masks"),catalog:wAt(sc,"catalog","the catalog"),checks:wAt(sc,"catalog","checks every"),rule:wAt(sc,"catalog","applies every"),
    back:wAt(sc,"back","The back door"),shut:wAt(sc,"back","stays shut"),admin:wAt(sc,"admin","an admin"),on:wAt(sc,"admin","switched on"),like:wAt(sc,"like","Like Ragusa's"),rule2:wAt(sc,"like","a rule")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",keys:[[0,930,425,1.27],[T.off-1.2,560,430,1.18],[T.priv-0.2,1360,420,1.12],[T.storage-0.4,960,540,1.24],[T.out-0.3,480,420,1.12],
        [T.files-0.3,930,700,1.36],[T.catalog-0.3,960,560,1.3],[T.back-0.2,1060,560,1.3],[T.like-1.4,960,540,1.0]],d:1.8,push:0,draw:(c,tt)=>{
      const s=wd_state(5,{corridor:ag_in(tt,T.priv,1.4),flow:ag_in(tt,T.net,1.0),threadCut:wd_on(tt,T.out+0.4,1.2),catalog:1},
        {door:1-ag_in(tt,T.off+0.2,1.0),doorShut:ag_in(tt,T.off+0.6,0.6),door2:ag_in(tt,T.reach,1.0),shaft:ag_in(tt,T.storage+0.4,0.8),
         files:ag_in(tt,T.masks-1.2,0.8)*(1-ag_in(tt,T.catalog-0.2,0.8)),ring:ag_in(tt,T.catalog+0.2,0.6),side:1-ag_in(tt,T.back+0.2,0.9),sideShut:ag_in(tt,T.shut,0.5),amber:ag_io(tt,T.on-0.2,T.on+1.6,0.5)});
      wd_hallWorld(c,tt,s);
      wd_pillAt(c,WD_DOOR.x,WD_DOOR.y+WD_DOOR.h+62,"closed to the internet","coral",tt,T.off+0.8,T.priv-0.4);
      wd_pillAt(c,1080,500,"private","cyan",tt,T.too-0.4,T.out+0.2);
      // the short list of places data may leave for
      wd_cardAt(c,40,470,404,{kick:"may leave for",sub:"the government's returns, the university's reports, the backups' place apart"},tt,T.list,T.files-0.6,{col:"green"});
      // the catalog, the files' only door: each request checked on the way, and a rule's values hidden
      for(let k=0;k<3;k++)wd_request(c,WD_CT.x,wd_on(tt,T.checks-0.4+k*1.3,1.0),{rule:k>0});
      wd_pillAt(c,1132,450,"back door: shut","coral",tt,T.shut,T.admin-0.2);
      wd_pillAt(c,1132,450,"an admin account, switched on","amber",tt,T.on-0.2,T.on+1.8);}},
    // Ragusa's walls: three gates lit, an officer with a lantern at each
    {at:T.like-0.3,place:"wdRagusa",keys:[[0,1000,600,1.16],[T.rule2,1040,610,1.2]],d:3,push:0,draw:(c,tt)=>{
      WD_GATES.forEach(([x,y,w,h],i)=>{c.save();c.globalCompositeOperation="lighter";wd_glow(c,x+w/2,y-h/2,70,WD.lamp,0.5);c.restore();c.save();c.beginPath();wd_archPath(c,x,y,w,h);c.clip();c.fillStyle=rgba(WD.lamp,0.55);c.fillRect(x,y-h,w,h);c.restore();
        wd_walker(c,x+w+14,y+2,0.3,{walk:0,carry:"lantern",hood:false,light:1,col:[44,52,64],flip:i===2,a:ag_in(tt,T.like+0.4+i*0.4,0.5)});});
      wd_ship(c,1450,786,0.3,{t:tt,seed:1});wd_ship(c,1340,792,0.26,{t:tt,seed:2,flip:true});wd_ship(c,1560,800,0.34,{t:tt,seed:3,flip:true,sail:0.2});
      wd_scr(c,S,()=>wd_tag(c,"Ragusa",ag_in(tt,T.like,0.5)));}}
  ]);
});

/* ---------------------------------------------------------------- 6 · Rooms apart */
scene("rooms",(ctx,S,t,sc)=>{
  const T={three:wAt(sc,"three","becomes three"),dev:wAt(sc,"three","development"),try:wAt(sc,"try","try new"),test:wAt(sc,"try","in test"),run:wAt(sc,"try","as it will run"),
    prod:wAt(sc,"prod","Production"),real:wAt(sc,"prod","the real records"),nightly:wAt(sc,"prod","runs the nightly"),own:wAt(sc,"own","Each reaches"),masked:wAt(sc,"masked","made-up"),never:wAt(sc,"masked","never a copy"),
    mistake:wAt(sc,"mistake","a mistake"),intruder:wAt(sc,"mistake","an intruder"),path:wAt(sc,"path","one reviewed"),builds:wAt(sc,"path","From a branch"),islet:wAt(sc,"islet","Like the islet"),gate:wAt(sc,"islet","through the gate")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",keys:[[0,930,420,1.16],[T.three,930,360,1.3],[T.own-0.2,930,470,1.24],[T.path-0.4,1100,450,1.2]],d:2,push:0,draw:(c,tt)=>{
      const sp=wd_on(tt,T.three+0.3,2.4),own=ag_in(tt,T.own,0.6),vl=ag_in(tt,T.masked,0.8);
      const s=wd_state(6,{catalog:1-ag_in(tt,T.three+0.2,0.5),store:1-ag_in(tt,T.masked+0.3,0.4)*(1-ag_in(tt,T.mistake-0.4,0.5))},{split:sp,sections:ag_in(tt,T.own,0.8),work:ag_in(tt,T.try,0.6),test:ag_in(tt,T.test,0.6),finished:ag_in(tt,T.run,0.8),job:ag_in(tt,T.nightly,0.6),real:ag_in(tt,T.real,0.6),
        lit:(e,i)=>e===2?0.15+0.6*own*Math.max(0,Math.sin(Math.min(Math.PI,(tt-T.own-i*0.15)*2))):0.15+0.5*own*Math.max(0,Math.sin(Math.min(Math.PI,(tt-T.own-0.4-e*0.3-i*0.12)*2))),
        veil:e=>e<2?vl:0,coral:(e,i)=>e===0&&i===2?ag_in(tt,T.mistake,0.6)*(1-ag_in(tt,T.path-0.6,0.6)):0});
      wd_hallWorld(c,tt,s);
      wd_cardAt(c,520,560,520,{kick:"made-up or masked",sub:"never a copy of production's"},tt,T.masked+0.3,T.mistake-0.4,{col:"violet"});
      // a mistake in development stays there; an intruder there finds only frost
      const ma=ag_in(tt,T.mistake,0.6)*(1-ag_in(tt,T.path-0.6,0.6));if(ma>0){const b=wd_roomBox(0,1);wd_haze(c,[[b.x+60,400],[b.x+b.w-60,390]],1,ma*1.5,tt,{seed:31,n:10,r:40});}
      const ia=ag_in(tt,T.intruder,0.3)*(1-ag_in(tt,T.path-0.6,0.6));if(ia>0){const b=wd_roomBox(0,1),pb=wd_paneBox(0,2,1);c.save();c.globalAlpha*=ia;wd_walk(c,[[b.x+20,470],[pb.x+pb.w/2,pb.y+pb.h+6]],wd_on(tt,T.intruder,1.2));c.restore();}
      // one reviewed path: development, test, production
      const pa=wd_on(tt,T.path+0.2,1.6),pf=1-ag_in(tt,T.islet-0.6,0.5);if(pa>0&&pf>0){c.save();c.globalAlpha*=pf;const y=92,half=[101,46,91];for(let e=0;e<2;e++){const a=wd_roomBox(e,1),b=wd_roomBox(e+1,1),u=clamp(pa*2-e,0,1);
          if(u>0)dp_link(c,[a.x+a.w/2+half[e],y],[b.x+b.w/2-half[e+1],y],"green",ag_sine(u),{lw:4});}
        wd_T(c,"one reviewed path",935,46,{w:700,size:28,align:"center",col:"green",a:ag_in(pa,0.8,0.2)});c.restore();}
      wd_cardAt(c,1424,520,420,{kick:"built in",title:"From a branch to production"},tt,T.builds,T.islet-0.6,{col:"green"});}},
    // the coast: what isn't trusted yet waits apart, then comes in only through the gate
    {at:T.islet-0.3,place:"wdCoast",keys:[[0,860,560,1.04]],push:0.03,draw:(c,tt)=>{const M=WD_MAP,isl=[1270,742],gate=[M.gate[0]+8,M.gate[1]+14],ship=[700,800];
      for(const [n,x,y] of [["Ragusa",M.city[0]-40,M.city[1]+78],["Mrkan",M.mrkan[0],M.mrkan[1]+64]])dp_T(c,n,x,y,{w:700,size:30,align:"center"});
      wd_ship(c,ship[0],ship[1],0.2,{t:tt,seed:7,sail:1});dp_link(c,[ship[0]+30,ship[1]-14],isl,"grey",wd_on(tt,T.islet+0.2,1.0),{dash:[8,9],dot:false});
      for(let k=0;k<4;k++)wd_moon(c,isl[0]-230+k*62,isl[1]-70-Math.sin((k+0.5)/4*Math.PI)*36,15,k,ag_in(tt,T.islet+1.0+k*0.4,0.3));
      const l2=wd_on(tt,T.gate-0.4,1.4);if(l2>0)dp_link(c,isl,gate,"green",ag_sine(l2),{dash:[10,8]});}}
  ]);
});

/* ---------------------------------------------------------------- 7 · Keys you can see */
scene("keys",(ctx,S,t,sc)=>{
  const T={encrypted:wAt(sc,"encrypted","encrypted"),unread:wAt(sc,"encrypted","unreadable"),who:wAt(sc,"who","who holds"),until:wAt(sc,"until","Until now"),own:wAt(sc,"own","the university's own"),
    team:wAt(sc,"own","security team"),use:wAt(sc,"use","may use"),take:wAt(sc,"use","never take"),del:wAt(sc,"use","can't delete"),back:wAt(sc,"back","take it back"),nobody:wAt(sc,"back","nobody can read"),
    lose:wAt(sc,"lose","Lose that"),rec:wAt(sc,"lose","every use"),ninety:wAt(sc,"lose","ninety days"),rector:wAt(sc,"rector","In Ragusa"),shut:wAt(sc,"rector","shut each"),
    taken:wAt(sc,"rector","keys taken"),morning:wAt(sc,"rector","until morning"),knew:wAt(sc,"knew","Everyone")};
  T.street=T.taken-0.6;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",keys:[[0,930,420,1.12],[T.encrypted-0.4,930,450,1.2],[T.until-0.6,960,400,1.0],[T.use-0.4,1420,330,1.14],[T.back-0.3,1180,380,1.06],
        [T.lose-0.2,1240,330,1.12]],d:1.8,push:0,draw:(c,tt)=>{
      const ku=wd_on(tt,T.own+0.2,2.4),taken=ag_io(tt,T.back+0.6,T.nobody+2.6,0.6),dim=ag_io(tt,T.lose,T.rec+0.6,0.6);
      const s=wd_state(7,{prov:1-ag_in(tt,T.team+1.0,0.8),vault:ag_in(tt,T.own,0.8),keyU:ku,keyDim:dim,vaultCoral:taken,corLabel:0,store:1-ag_in(tt,T.encrypted+0.4,0.4)*(1-ag_in(tt,T.who-0.2,0.5))},
        {cipher:ag_in(tt,T.encrypted,1.0),full:taken,dim:dim});
      wd_hallWorld(c,tt,s);
      wd_cardAt(c,520,560,560,{kick:"encrypted",title:"on disk, and on the move"},tt,T.encrypted+0.4,T.who-0.2,{col:"violet"});
      // a request that may read passes through the frost, and what it may see is clear for it
      const rq=wd_on(tt,T.unread-0.8,2.2),ra=ag_in(tt,T.unread-0.8,0.3)*(1-ag_in(tt,T.who-0.4,0.4));if(ra>0){const pb=wd_paneBox(2,4,1);c.save();c.globalAlpha*=ra;wd_mini(c,pb.x+pb.w/2,lerp(470,pb.y+pb.h+40,ag_sine(rq)),"person","cyan",0.7);
        dp_tick(c,pb.x+pb.w/2+40,pb.y+pb.h+30,"green",clamp(rq*2-1,0,1));const clear=clamp(rq*2-1,0,1);if(clear>0){c.save();rr(c,pb.x,pb.y,pb.w,pb.h,8);c.clip();c.globalAlpha*=clear;
          c.fillStyle="rgba(200,240,240,0.35)";c.fillRect(pb.x,pb.y,pb.w,pb.h);c.fillStyle="rgba(240,252,252,0.8)";for(let r=0;r<5;r++)c.fillRect(pb.x+8,pb.y+14+r*18,pb.w-16,3);c.restore();}c.restore();}
      // the platform may use it, never take it out: a thread to the vault, and back with "open"
      const ua=ag_io(tt,T.use,T.back-0.2,0.4);if(ua>0){const a=[1390,250],b=[WD_VAULT.x+20,WD_VAULT.y+200],u=wd_on(tt,T.use+0.1,1.0);c.save();c.globalAlpha*=ua;dp_link(c,a,b,"cyan",ag_sine(u),{dot:u>=1});
        const back=wd_on(tt,T.use+1.2,1.2);if(back>0){const x=lerp(b[0],a[0],ag_sine(back)),y=lerp(b[1],a[1],ag_sine(back));dp_pill(c,x,y+12,"open","cyan",{align:"center",a:ag_in(back,0,0.2)});}c.restore();}
      wd_pillAt(c,WD_VAULT.x+WD_VAULT.w/2,WD_VAULT.y+WD_VAULT.h+30,"the platform team: can't delete","coral",tt,T.del,T.back-0.2);
      wd_pillAt(c,WD_VAULT.x+WD_VAULT.w/2,WD_VAULT.y+WD_VAULT.h+30,"taken back","coral",tt,T.back+0.8,T.nobody+2.6);
      // every use recorded, and a deleted key kept ninety days
      const la=ag_io(tt,T.rec,sc.cues.rector-0.6,0.5);if(la>0){c.save();c.globalAlpha*=la;dp_panel(c,1510,456,330,190,{col:"grey",r:16,glowR:20});
        ["02:00 · used","02:01 · used","09:14 · used"].forEach((l,i)=>dp_T(c,l,1540,506+i*46,{w:600,size:28,f:"mono",a:ag_in(tt,T.rec+0.2+i*0.35,0.3)}));c.restore();}
      const da=ag_io(tt,T.ninety-0.2,sc.cues.rector-0.4,0.5);if(da>0){const b=wd_cardAt(c,1490,666,410,{kick:"a deleted key",title:"kept 90 days"},tt,T.ninety-0.2,sc.cues.rector-0.4,{col:"violet"});
        if(b){c.save();c.globalAlpha*=da;const cx=b.x+b.w-70,cy=b.y+b.h/2,r=38;c.strokeStyle="rgba(190,245,245,0.35)";c.lineWidth=6;c.beginPath();c.arc(cx,cy,r,0,TAU);c.stroke();
          c.strokeStyle=rgba(DP.F.violet,1);c.shadowColor=rgba(DP.F.violet,0.8);c.shadowBlur=8;c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*(1-0.25*wd_on(tt,T.ninety+0.4,3)));c.stroke();c.restore();}}}},
    // Ragusa at night: the gate shut, its keys lifted from the lock and carried up the street to the rector's palace
    {at:T.rector-0.3,place:"wdGateNight",keys:[[0,945,600,1.12],[T.shut,945,620,1.2]],d:2.4,push:0,draw:(c,tt)=>{
      const sh=ag_in(tt,T.shut-0.6,1.6);wd_gateLight(c,0.4*(1-sh));wd_gateLantern(c,tt,1);wd_gateDoors(c,1-sh,{lock:true});
      const kb=ag_in(tt,T.shut+0.9,0.6);wd_walker(c,1060,800,1.04,{walk:0,flip:true,carry:"keys",col:[50,52,60],a:kb,light:0.8});
      wd_scr(c,S,()=>wd_tag(c,"Ragusa · at night",ag_in(tt,T.rector,0.5)));}},
    {at:T.street,cut:true,place:"wdStreetNight",keys:[[0,960,580,1.0],[T.street+0.4,960,480,1.3]],d:5.6,push:0,draw:(c,tt)=>{
      wd_streetWindows(c,(i,w)=>i%3===0?0.9:0);
      const u=wd_on(tt,T.street+0.2,T.morning-T.street+0.4),z=lerp(1.1,3.7,ag_sine(u)),p=wd_st(0,0,z,40),closing=ag_in(tt,T.morning+0.4,1.2);
      wd_palace(c,1-0.6*closing,1-closing,ag_in(tt,T.knew-0.6,1.0));
      wd_walker(c,p[0],p[1],1.3/z,{back:true,ph:tt*4.6,carry:"keys",col:[50,52,60],a:1-ag_in(tt,T.morning+0.1,0.6),light:0.5});
      wd_scr(c,S,()=>dp_T(c,"the rector's palace",960,170,{w:700,size:30,align:"center",a:ag_in(tt,T.morning-0.8,0.6)}));}}
  ]);
});

/* ---------------------------------------------------------------- 8 · Copies nobody can delete */
scene("copies",(ctx,S,t,sc)=>{
  const T={first:wAt(sc,"first","deletes the backups"),locks:wAt(sc,"first","locks the data"),money:wAt(sc,"first","asks for money"),night:wAt(sc,"night","every night"),
    apart:wAt(sc,"night","a place apart"),admins:wAt(sc,"night","admins of"),locked:wAt(sc,"locked","locked for"),even:wAt(sc,"locked","not even"),restore:wAt(sc,"restore","restores one"),
    hope:wAt(sc,"restore","a hope"),ways:wAt(sc,"ways","cuts both"),early:wAt(sc,"ways","deleted early"),dmd:wAt(sc,"ways","Deleted means")};
  // the slabs that leave production for the place apart, one each night
  const A=WD_APART,slot=k=>[A.x+76,A.y+A.h-44-k*30],from=[1236,640];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",keys:[[0,1100,500,1.12],[T.first-0.2,1120,500,1.22],[T.night-0.6,1300,560,1.08],[T.restore-0.4,1360,640,1.16],[T.ways-0.4,1500,600,1.22]],d:1.8,push:0,draw:(c,tt)=>{
      const atk=ag_io(tt,T.locks,T.money+1.4,0.5),gone=k=>ag_in(tt,T.first+0.3+k*0.25,0.3)*(1-ag_in(tt,T.money+1.4,0.6)),newA=ag_in(tt,T.night,0.8);
      const s=wd_state(8,{apart:newA,apartLabel:ag_in(tt,T.apart,0.5)},{copies:1-ag_in(tt,T.night+1.2,0.8),admin:1-ag_in(tt,T.night+1.2,0.8),prodCoral:atk});
      // the attacker's first move: each copy taken, one by one (each crossed and gone, then all back)
      s.block.crack=0;wd_hallWorld(c,tt,s);
      for(let k=0;k<6;k++){const g=gone(k);if(g<=0)continue;const y=820-k*24-8;c.save();c.globalAlpha*=g;c.fillStyle="rgba(8,18,22,0.92)";c.fillRect(1230,y-12,136,22);c.restore();dp_cross(c,1220,y,"coral",g);}
      wd_pillAt(c,1236,150,"locked: pay to unlock","coral",tt,T.locks+0.3,T.money+1.4);
      wd_cardAt(c,1480,480,400,{title:"what an attacker does first"},tt,T.money+1.6,T.night-0.4,{col:"coral"});
      // every night, a copy goes to the place apart, and is locked thirty days; the next night's follows
      for(let k=0;k<3;k++){const t0=T.night+0.8+k*(k<2?3.2:2.6),u=wd_on(tt,t0,2.2);if(u<=0)continue;const q=ag_sine(u),p=slot(k),x=lerp(from[0],p[0],q),y=lerp(from[1],p[1],q)-Math.sin(Math.PI*q)*120;
        wd_slab(c,x,y,{locked:ag_in(tt,T.locked+k*1.6,0.4)*(k===0||u>=1?1:0)});}
      wd_pillAt(c,A.x+A.w/2,A.y+A.h+76,"locked 30 days","coral",tt,T.locked+0.3,T.early-0.9);
      // not even an admin can delete one before then
      const ta=ag_io(tt,T.even-0.2,T.even+1.6,0.3);if(ta>0){const p=slot(1);dp_cross(c,p[0]+168,p[1]+9,"coral",ta);}
      wd_pillAt(c,A.x+A.w/2,A.y-96,"locked","coral",tt,T.even+0.1,T.even+1.6);
      // once a month, one restored beside production, and checked
      const r=wd_on(tt,T.restore+0.2,1.8),ra=ag_in(tt,T.restore,0.3)*(1-ag_in(tt,T.ways-0.4,0.6));if(ra>0){const p=slot(0),q=ag_sine(r),x=lerp(p[0],1214,q),y=lerp(p[1],690,q)-Math.sin(Math.PI*q)*100;
        c.save();c.globalAlpha*=ra;wd_slab(c,x,y,{w:150});const op=wd_on(tt,T.restore+2.0,0.8);if(op>0){c.save();c.globalAlpha*=op;dp_panel(c,1196,620,180,150,{col:"green",r:14,glowR:20});
          c.fillStyle="rgba(220,245,240,0.6)";for(let i=0;i<4;i++)c.fillRect(1216,648+i*24,120,4);c.restore();}c.restore();}
      wd_pillAt(c,1286,598,"restored · checked","green",tt,T.restore+2.6,T.ways-0.4);
      // the lock cuts both ways
      wd_pillAt(c,A.x+A.w/2,A.y+A.h+76,"can't be deleted early","coral",tt,T.early-0.4,null);
      wd_cardAt(c,1056,880-240,440,{kick:"comes back in",title:"Deleted means deleted"},tt,T.dmd,null,{col:"violet",behind:false});}}
  ]);
});

/* ---------------------------------------------------------------- 9 · The walk again */
scene("again",(ctx,S,t,sc)=>{
  const T={walks:wAt(sc,"walks","Sam walks"),more:wAt(sc,"walks","once more"),nodoor:wAt(sc,"nodoor","no door"),stolen:wAt(sc,"stolen","With a stolen"),one:wAt(sc,"stolen","that one person"),
    checks:wAt(sc,"stolen","catalog's checks"),back:wAt(sc,"no","No back door"),send:wAt(sc,"no","nowhere to send"),key:wAt(sc,"no","no key"),copy:wAt(sc,"no","no copy"),
    ragusa:wAt(sc,"ragusa","Ragusa stayed"),gates:wAt(sc,"ragusa","a few gates"),open:wAt(sc,"open","stays open"),need:wAt(sc,"open","that need it"),few:wAt(sc,"few","Few doors")};
  const A=WD_APART;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wdHall",keys:[[0,1500,600,1.22],[0.4,960,540,1.0],[T.stolen-0.4,1146,470,1.24],[T.back-0.4,960,540,1.0]],d:1.8,push:0,draw:(c,tt)=>{
      const s=wd_state(9,{corLabel:1-ag_in(tt,T.back-0.8,0.5)},{});wd_hallWorld(c,tt,s);wd_samHall(c,tt,ag_in(tt,0.2,0.8)*(1-ag_io(tt,T.stolen-0.7,T.back-0.5,0.5)));
      // from the open internet: no door to find
      wd_walk(c,[[180,600],[300,480],[452,400]],wd_on(tt,T.more,1.4),{a:1-ag_in(tt,T.stolen-0.6,0.5),head:true});
      wd_pillAt(c,330,560,"no door","coral",tt,T.nodoor,T.stolen-0.6);
      // a stolen way in: only what that one person may reach, in one room, through production's ring: a tick, and the rule's values hidden
      const pr=wd_roomBox(2,1),pcx=pr.x+pr.w/2,sa=ag_in(tt,T.stolen,0.4)*(1-ag_in(tt,T.back-0.6,0.5));if(sa>0){c.save();c.globalAlpha*=sa;wd_mini(c,1520,390,"person","coral",0.8);
        wd_walk(c,[[1490,392],[1408,392],[1400,500]],wd_on(tt,T.one-0.6,1.4),{head:true});wd_request(c,pcx,wd_on(tt,T.checks-0.6,1.6),{k:62/WD_CT.rx,rule:true});c.restore();}
      // and nothing more: each way it tries, stopped
      const stops=[[T.back,[1132,640],"shut",[WD_SD.x+WD_SD.w/2,532]],[T.send,[300,190],"not on the list",[WD_THREAD[1][0]-6,WD_THREAD[1][1]]],
        [T.key,[WD_VAULT.x+WD_VAULT.w/2,WD_VAULT.y+WD_VAULT.h+30],"not yours",[WD_VAULT.x+30,WD_VAULT.y+WD_VAULT.h-20]],[T.copy,[A.x+A.w/2,A.y+A.h+76],"locked",[A.x+40,A.y+A.h-60]]];
      const end=T.ragusa-0.6;stops.forEach(([t0,p,word,at])=>{const a=1-ag_in(tt,end,0.5);if(a<=0)return;c.save();c.globalAlpha*=a;wd_walk(c,[[at[0]-60,at[1]+60],at],wd_on(tt,t0-0.3,0.4),{head:true});c.restore();
        wd_pillAt(c,p[0],p[1],word,"coral",tt,t0,end);});}},
    // Ragusa at dawn: the gates open, ships in the harbour, officers with lanterns at each gate
    {at:T.ragusa-0.4,place:"wdRagusaDawn",keys:[[0,960,560,1.08],[T.gates,1060,600,1.16]],d:3,push:0,draw:(c,tt)=>{
      WD_GATES.forEach(([x,y,w,h],i)=>{const a=ag_in(tt,T.ragusa+0.2+i*0.5,0.8);c.save();c.beginPath();wd_archPath(c,x,y,w,h);c.clip();c.fillStyle=rgba(WD.lamp,0.5*a);c.fillRect(x,y-h,w,h);c.restore();
        wd_walker(c,x+w+14,y+2,0.3,{walk:0,carry:"lantern",hood:false,light:1,col:[44,52,64],flip:i===2});});
      wd_ship(c,1450,786,0.3,{t:tt,seed:1});wd_ship(c,1340,792,0.26,{t:tt,seed:2,flip:true});
      for(const [i,x0,y0,s] of [[0,1560,800,0.34],[1,1640,812,0.3]]){const u=ag_eo(wd_on(tt,T.ragusa+0.6+i*0.8,4));wd_ship(c,lerp(x0+520,x0,u),y0,s,{t:tt,seed:5+i,flip:true,sail:1-0.8*u});}
      wd_scr(c,S,()=>wd_tag(c,"Ragusa · 1377",ag_in(tt,T.ragusa,0.5)));}},
    // the university's data, open to the people and jobs that need it; the network's name leaves as the end card comes in, so the end
    // card's line, on the same row, has it to itself
    {at:T.open-0.4,place:"wdHall",keys:[[0,1180,420,1.1]],push:0.03,draw:(c,tt)=>{const s=wd_state(9,{flow:1,corLabel:1-ag_in(tt,T.few-0.4,0.8)},{lit:(e,i)=>e===2?0.45+0.35*Math.sin(tt*1.4+i):0.2});wd_hallWorld(c,tt,s);}}
  ]);
  dp_end(ctx,S,t,T.few-0.4,"Walls, doors and keys",null,"Film 3 of 9","Locks before the data");
  const la=ag_in(t,T.few-0.4+0.6,0.9);if(la>0){setScreen(ctx,S);dp_T(ctx,"Few doors, each with a lock you can see.",960,360,{w:700,size:48,align:"center",a:la});}
  const na=ag_in(t,T.few+1.6,0.6);if(na>0){setScreen(ctx,S);dp_T(ctx,"Next: Power you switch on",960,790,{w:600,size:30,align:"center",col:"mut",a:na});}
});

// chapters that open on what the one before ends on: in the hall, the camera glides on; from the hall to the board, a cut (Sam is in both)
ag_cutInto(["inside","who","doors","again"]);

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

/* ===== Data protection and privacy: what a film needs before it starts, and the video's motion blur =====
   prepAssets takes the place of the engine's: the fonts, and the tools' logos for a film that shows them; then the film's pictures,
   each made once and kept: each place (AG_PLACES) and its frost (glass.js), and each person the film lists in DP_PEOPLE, in their light
   (night.js). The video and the checks make them all before they start. The site's player makes the first place and its frost at once
   (the poster covers the film until then), and the rest one picture at a time while the page is idle, once the film has started, so
   nothing holds the page or the soundtrack for long; whatever is drawn before its turn comes is made the first time it's drawn. */
function dp_prepList(){const L=[];Object.keys(AG_PLACES).forEach(k=>{L.push(()=>ag_place(k),()=>dp_frostPlace(k));});
  DP_PEOPLE.forEach(p=>{const [who,light]=Array.isArray(p)?p:[p];L.push(...dp_prepSteps(who,light));});return L;}
async function prepAssets(){await fontsReady3();if(typeof LOGO_SRC!=="undefined")await loadLogos();const steps=dp_prepList();
  if(window.__RENDER__){steps.forEach(f=>f());return;}
  const cv=document.getElementById("film");if(cv&&Object.keys(AG_PLACES).length){steps.shift()();steps.shift()();}
  let i=0;const idle=f=>window.requestIdleCallback?requestIdleCallback(f,{timeout:1000}):setTimeout(f,60);
  const next=()=>{if(i>=steps.length)return;steps[i++]();idle(next);},go=()=>setTimeout(()=>idle(next),200);
  const box=cv&&cv.closest(".player");if(!box)return;if(box.classList.contains("started")){go();return;}
  const mo=new MutationObserver(()=>{if(box.classList.contains("started")){mo.disconnect();go();}});mo.observe(box,{attributes:true,attributeFilter:["class"]});}
// the video's motion blur, as the agent films': each frame is the average of eight moments while a shutter is open a third of a frame
if(window.__RENDER__){(function(){const MB=8,SHUT=0.35/30,out=document.querySelector("canvas"),ox=out.getContext("2d"),
    M=mkCanvas(W,H),mx=M.getContext("2d"),A=mkCanvas(W,H),ax=A.getContext("2d");
  window.renderAt=function(t,q){
    for(let i=0;i<MB;i++){const tt=Math.max(0,t-SHUT*i/(MB-1));mx.setTransform(1,0,0,1,0,0);mx.globalAlpha=1;mx.globalCompositeOperation="source-over";renderFrame(mx,1,tt);ax.globalAlpha=1/(i+1);ax.drawImage(M,0,0);}
    ax.globalAlpha=1;ox.setTransform(1,0,0,1,0,0);ox.globalAlpha=1;ox.globalCompositeOperation="source-over";ox.drawImage(A,0,0);
    return out.toDataURL("image/jpeg",q||0.9);};})();}
