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

// What they tell us about ourselves, the eighth film of What an agent is, the first series on agentic data engineering. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"rough":{"name":"A rough copy","lead":2.2,"tail":1.0,"vo":[
 {"id":"place","gap":0.9,"text":"Melbourne, Australia, 1978.","say":"Melbourne, Australia, nineteen seventy-eight."},
 {"id":"lost","gap":0.8,"text":"Rod Saunders had lost his hearing in a car accident."},
 {"id":"lips","gap":0.8,"text":"He could read his wife Margaret's lips, but he couldn't hear her voice."},
 {"id":"aid","gap":0.8,"text":"A hearing aid only makes sound louder, and his inner ears no longer passed sound to his brain at all."},
 {"id":"cut","gap":0.8,"text":"For people like Rod, deaf as adults, it meant a life cut off from voices."},
 {"id":"doubt","gap":0.3,"text":"Even a pioneer of the field doubted, in 1966, that an adult brain could ever learn to understand speech from electric signals:","say":"Even a pioneer of the field doubted, in nineteen sixty-six, that an adult brain could ever learn to understand speech from electric signals:"},
 {"id":"foreign","gap":0.8,"text":"a ‘foreign language’, he called it."},
 {"id":"change","gap":0.9,"text":"Something had to change."},
 {"id":"father","gap":0.8,"text":"The surgeon Graeme Clark had watched his own father go deaf."},
 {"id":"years","gap":0.3,"text":"For ten years, he and his team worked on a rough copy of the inner ear:"},
 {"id":"implant","gap":0.8,"text":"an implant, a fine wire with ten electrodes, to carry sound to the nerve as electric pulses."},
 {"id":"august","gap":0.8,"text":"On the first of August 1978, it went in.","say":"On the first of August, nineteen seventy-eight, it went in."},
 {"id":"sang","gap":0.8,"text":"When the team played ‘Waltzing Matilda’, Rod sang along."},
 {"id":"december","gap":0.8,"text":"By December, he understood words with no lips to read."},
 {"id":"roughwas","gap":0.8,"text":"The copy was rough: ten electrodes, where a healthy ear has thousands of tiny cells that turn sound into signals."},
 {"id":"rest","gap":0.8,"text":"Rod's brain did the rest: with practice, it learned the ‘foreign language’."},
 {"id":"y2019","gap":0.8,"text":"By 2019, more than seven hundred thousand implants had been fitted worldwide.","say":"By twenty nineteen, more than seven hundred thousand implants had been fitted worldwide."},
 {"id":"same","gap":0.7,"text":"It's the same with the agents we build for data."},
 {"id":"copies","gap":0.8,"text":"They're rough copies too, of neurons and of what people wrote."},
 {"id":"keep","gap":0.8,"text":"Seeing where they're like us, and where they're not, shows a team what to hand them, and what to keep."}
]},
"five":{"name":"Five questions","lead":1.6,"tail":1.2,"vo":[
 {"id":"today","gap":0.8,"text":"Today, at the university."},
 {"id":"counted","gap":0.8,"text":"The agent has counted this term's students, 18,412, and shown the query behind the number.","say":"The agent has counted this term's students, eighteen thousand, four hundred and twelve, and shown the query behind the number."},
 {"id":"signed","gap":0.8,"text":"Mei, in the registrar's office, has checked it and signed."},
 {"id":"coffee","gap":0.8,"text":"Over coffee, the questions start."},
 {"id":"jun","gap":0.7,"text":"Jun wonders if our brains work like this."},
 {"id":"mei","gap":0.7,"text":"Mei, if it could have an idea of its own."},
 {"id":"noor","gap":0.7,"text":"Noor, if a perfect copy of a brain would be a mind."},
 {"id":"sam","gap":0.7,"text":"Sam, if it feels anything."},
 {"id":"yusuf","gap":0.8,"text":"And Yusuf asks what makes us human, then."},
 {"id":"noanswer","gap":0.8,"text":"For some of these questions, there's no answer yet."}
]},
"taught":{"name":"What the copy taught us","lead":1.4,"tail":1.2,"vo":[
 {"id":"first","gap":0.8,"text":"First: what has building them taught us about the brain?"},
 {"id":"perceptron","gap":0.3,"text":"In 1958, the psychologist Frank Rosenblatt described the perceptron, a learning machine made as a rough copy of neurons,","say":"In nineteen fifty-eight, the psychologist Frank Rosenblatt described the perceptron, a learning machine made as a rough copy of neurons,"},
 {"id":"senses","gap":0.8,"text":"to understand how a brain senses, remembers and acts."},
 {"id":"descend","gap":0.8,"text":"Today's models descend from it, and learn mostly by guessing the next word."},
 {"id":"y2022","gap":0.8,"text":"In 2022, scientists recorded the brains of nine people listening to a podcast.","say":"In twenty twenty-two, scientists recorded the brains of nine people listening to a podcast."},
 {"id":"before","gap":0.8,"text":"Before each word came, their brains were already guessing it."},
 {"id":"friston","gap":0.8,"text":"Karl Friston and Andy Clark had long argued that this is what brains do: predict, and learn from the errors."},
 {"id":"rods","gap":0.8,"text":"Rod's brain did something like it, matching ten rough signals to the voices it remembered."},
 {"id":"stops","gap":0.8,"text":"But the copy stops somewhere."},
 {"id":"levels","gap":0.8,"text":"A brain guesses at many levels at once, from the next word to where the story is going."},
 {"id":"cell","gap":0.8,"text":"To imitate one kind of brain cell, researchers needed a network five to eight layers deep."},
 {"id":"nobody","gap":0.8,"text":"And how a brain learns from its errors, nobody knows yet."}
]},
"mixing":{"name":"Mixing, or making?","lead":1.4,"tail":1.2,"vo":[
 {"id":"second","gap":0.8,"text":"Second: when a model writes a poem, is it creating, or mixing what it learned?"},
 {"id":"others","gap":0.8,"text":"We learn from others too, and mix what we learned in new ways."},
 {"id":"lovelace","gap":0.8,"text":"In 1843, Ada Lovelace wrote that the first design for a computer could do only ‘whatever we know how to order it to perform’.","say":"In eighteen forty-three, Ada Lovelace wrote that the first design for a computer could do only whatever we know how to order it to perform."},
 {"id":"boden","gap":0.3,"text":"In 1990, the philosopher Margaret Boden described three ways to be creative:","say":"In nineteen ninety, the philosopher Margaret Boden described three ways to be creative:"},
 {"id":"ways","gap":0.8,"text":"combining ideas, exploring a style, and changing the style's own rules."},
 {"id":"model","gap":0.8,"text":"A model can combine ideas and explore a style."},
 {"id":"brings","gap":0.8,"text":"But a person brings what a mix may not: a life, an intention, a reason to make it."},
 {"id":"reason","gap":0.8,"text":"Clark's reason was his father."},
 {"id":"science","gap":0.8,"text":"Boden said that whether a computer could ever really be creative is not for science alone to settle."},
 {"id":"choice","gap":0.8,"text":"It's partly about what we mean, and partly a choice we'll have to make."}
]},
"wire":{"name":"Wire by wire","lead":1.4,"tail":1.2,"vo":[
 {"id":"third","gap":0.8,"text":"Third: if we copied a brain, wire by wire, would we get a mind?"},
 {"id":"worm","gap":0.8,"text":"By 1986, the wiring of a tiny worm's 302 neurons had been mapped.","say":"By nineteen eighty-six, the wiring of a tiny worm's three hundred and two neurons had been mapped."},
 {"id":"openworm","gap":0.8,"text":"Since 2011, an open project, OpenWorm, has worked on a copy of it on a computer.","say":"Since twenty eleven, an open project, Open Worm, has worked on a copy of it on a computer."},
 {"id":"wriggles","gap":0.8,"text":"It wriggles, but not much more: a map doesn't say how each connection works, or when."},
 {"id":"fly","gap":0.3,"text":"In 2024, a fly's whole brain was mapped, 139,255 neurons,","say":"In twenty twenty-four, a fly's whole brain was mapped, a hundred and thirty-nine thousand, two hundred and fifty-five neurons,"},
 {"id":"sugar","gap":0.8,"text":"and a model built from the map predicted which ones answer to sugar."},
 {"id":"billion","gap":0.8,"text":"We have about 86 billion.","say":"We have about eighty-six billion."},
 {"id":"act","gap":0.8,"text":"And a copy can act like us without working like us."},
 {"id":"ear","gap":0.3,"text":"Rod's implant did part of an ear's work, but not as an ear does:"},
 {"id":"speech","gap":0.8,"text":"it was made for speech, and to many people with implants, music still sounds poor."},
 {"id":"exactly","gap":0.8,"text":"Would a copy that worked exactly like us be a mind?"},
 {"id":"searle","gap":0.8,"text":"The philosopher John Searle wrote that no one supposes a simulated rainstorm ‘will leave us all drenched’."},
 {"id":"others","gap":0.8,"text":"Others say a mind is what a brain does, so a perfect copy would be one."},
 {"id":"who","gap":0.8,"text":"Nobody knows who's right."}
]},
"feels":{"name":"Why it feels like anything","lead":1.4,"tail":1.0,"vo":[
 {"id":"fourth","gap":0.9,"text":"Fourth, and hardest: why does it feel like anything to be us?"},
 {"id":"pulses","gap":0.8,"text":"The implant turned sound into pulses."},
 {"id":"didnt","gap":0.8,"text":"It didn't hear anything."},
 {"id":"roddid","gap":0.8,"text":"Rod did."},
 {"id":"chalmers","gap":0.3,"text":"In 1995, the philosopher David Chalmers called this the hard problem:","say":"In nineteen ninety-five, the philosopher David Chalmers called this the hard problem:"},
 {"id":"why","gap":0.8,"text":"‘Why should physical processing give rise to a rich inner life at all?’"},
 {"id":"theories","gap":0.7,"text":"Scientists have theories."},
 {"id":"one","gap":0.7,"text":"One says experience comes from how tightly a system's parts work as one."},
 {"id":"another","gap":0.8,"text":"Another, from news shared across the whole brain at once."},
 {"id":"test","gap":0.8,"text":"In 2025, a test of both, with 256 people and rules both sides had agreed beforehand, challenged key parts of each.","say":"In twenty twenty-five, a test of both, with two hundred and fifty-six people and rules both sides had agreed beforehand, challenged key parts of each."},
 {"id":"science","gap":0.8,"text":"Science doesn't know yet."}
]},
"machine":{"name":"Could a machine feel?","lead":1.2,"tail":1.2,"vo":[
 {"id":"then","gap":0.8,"text":"Could a machine feel, then?"},
 {"id":"llinas","gap":0.8,"text":"The neuroscientist Rodolfo Llinás, from Colombia, found that awake and dreaming, the brain hums about forty times a second."},
 {"id":"ties","gap":0.7,"text":"He thought this rhythm ties what we sense into one moment."},
 {"id":"sleep","gap":0.8,"text":"In deep sleep, it fades."},
 {"id":"penrose","gap":0.8,"text":"Roger Penrose and Stuart Hameroff look deeper, to quantum effects in microtubules, tiny tubes inside our neurons."},
 {"id":"critics","gap":0.7,"text":"Critics say a warm, wet brain would wipe out such effects far too fast to matter."},
 {"id":"disagree","gap":0.8,"text":"Penrose and Hameroff disagree, and the tests go on."},
 {"id":"y2001","gap":0.7,"text":"In 2001, Llinás wrote that he sincerely doubted the quantum idea.","say":"In two thousand and one, Llinás wrote that he sincerely doubted the quantum idea."},
 {"id":"y2007","gap":0.5,"text":"Yet in 2007, he said he didn't know what in our cells produces feeling.","say":"Yet in two thousand and seven, he said he didn't know what in our cells produces feeling."},
 {"id":"filaments","gap":0.8,"text":"‘Filaments? Microtubules? Quantum mechanics?’"},
 {"id":"y2023","gap":0.7,"text":"In 2023, nineteen researchers checked today's AI for fourteen signs of consciousness, drawn from the leading theories.","say":"In twenty twenty-three, nineteen researchers checked today's AI for fourteen signs of consciousness, drawn from the leading theories."},
 {"id":"none","gap":0.8,"text":"None of the systems seemed conscious, but nothing obvious stops us building ones that show the signs."},
 {"id":"whether","gap":0.8,"text":"Whether showing them means feeling anything, nobody knows."}
]},
"human":{"name":"What makes us human?","lead":1.4,"tail":1.0,"vo":[
 {"id":"last","gap":0.8,"text":"Last: what makes us human, then?"},
 {"id":"descartes","gap":0.3,"text":"In 1637, René Descartes wrote that a machine could never arrange its words in different ways,","say":"In sixteen thirty-seven, René Descartes wrote that a machine could never arrange its words in different ways,"},
 {"id":"dullest","gap":0.8,"text":"to answer whatever is said to it, as even the dullest people can."},
 {"id":"today","gap":0.8,"text":"Today, machines do."},
 {"id":"ifnot","gap":0.7,"text":"If not language, then what?"},
 {"id":"body","gap":0.5,"text":"A body that can be hurt?"},
 {"id":"life","gap":0.5,"text":"A life lived with others?"},
 {"id":"feelings","gap":0.5,"text":"Feelings?"},
 {"id":"choosing","gap":0.8,"text":"Choosing what matters, and answering for it?"},
 {"id":"settled","gap":0.8,"text":"Nobody has settled it."},
 {"id":"heard","gap":0.8,"text":"Rod heard Margaret's voice again, through ten electrodes and a brain that learned."},
 {"id":"building","gap":0.8,"text":"Building copies keeps teaching us about ourselves: where they're like us, where they're not, and how much we still don't know."},
 {"id":"helps","gap":0.8,"text":"Seeing that helps Jun's team decide what to hand the agent, and what to keep."},
 {"id":"answers","gap":0.7,"text":"We don't have the answers yet."},
 {"id":"wonder","gap":0.8,"text":"Keep wondering."}
]}
};

const VODUR={"rough/place": 2.634, "rough/lost": 2.912, "rough/lips": 3.485, "rough/aid": 5.705, "rough/cut": 4.497, "rough/doubt": 8.424, "rough/foreign": 1.763, "rough/change": 1.288, "rough/father": 3.318, "rough/years": 3.941, "rough/implant": 5.999, "rough/august": 3.168, "rough/sang": 3.059, "rough/december": 3.071, "rough/roughwas": 7.094, "rough/rest": 4.111, "rough/y2019": 4.766, "rough/same": 2.67, "rough/copies": 3.477, "rough/keep": 4.699, "five/today": 1.581, "five/counted": 7.262, "five/signed": 3.166, "five/coffee": 1.931, "five/jun": 2.333, "five/mei": 2.087, "five/noor": 2.717, "five/sam": 1.594, "five/yusuf": 2.26, "five/noanswer": 2.671, "taught/first": 2.621, "taught/perceptron": 8.335, "taught/senses": 3.242, "taught/descend": 4.113, "taught/y2022": 5.568, "taught/before": 3.05, "taught/friston": 6.436, "taught/rods": 4.938, "taught/stops": 1.414, "taught/levels": 4.822, "taught/cell": 5.207, "taught/nobody": 3.114, "mixing/second": 4.445, "mixing/others": 3.11, "mixing/lovelace": 8.135, "mixing/boden": 5.088, "mixing/ways": 4.45, "mixing/model": 2.892, "mixing/brings": 5.096, "mixing/reason": 1.641, "mixing/science": 5.904, "mixing/choice": 3.503, "wire/third": 3.841, "wire/worm": 5.697, "wire/openworm": 5.73, "wire/wriggles": 4.947, "wire/fly": 7.699, "wire/sugar": 3.712, "wire/billion": 1.637, "wire/act": 2.538, "wire/ear": 3.889, "wire/speech": 4.769, "wire/exactly": 2.585, "wire/searle": 6.57, "wire/others": 3.981, "wire/who": 1.386, "feels/fourth": 3.427, "feels/pulses": 2.087, "feels/didnt": 1.097, "feels/roddid": 0.751, "feels/chalmers": 4.734, "feels/why": 3.913, "feels/theories": 1.351, "feels/one": 4.003, "feels/another": 3.18, "feels/test": 9.709, "feels/science": 1.336, "machine/then": 1.272, "machine/llinas": 7.616, "machine/ties": 3.184, "machine/sleep": 1.345, "machine/penrose": 7.755, "machine/critics": 4.674, "machine/disagree": 3.099, "machine/y2001": 4.868, "machine/y2007": 4.722, "machine/filaments": 2.873, "machine/y2023": 7.812, "machine/none": 5.767, "machine/whether": 3.108, "human/last": 1.751, "human/descartes": 6.326, "human/dullest": 3.758, "human/today": 1.239, "human/ifnot": 1.519, "human/body": 1.26, "human/life": 1.319, "human/feelings": 0.673, "human/choosing": 2.204, "human/settled": 1.235, "human/heard": 4.526, "human/building": 6.737, "human/helps": 4.278, "human/answers": 1.448, "human/wonder": 0.862};

/* Pauses, used sparingly: the film is longer and slower than the series' others, as the plan allows, and stops where an idea needs a
   moment to land. hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture
   starts at the chapter's "breath" cue. Two wordless endings: the room becoming the title card, and the end card. */
const BREATH={
"rough":{"hold":{"lost":0.4,"lips":0.4,"aid":0.6,"cut":1.4,"foreign":0.4,"change":0.6,"father":1.0,"implant":1.0,"august":0.8,"sang":1.6,"december":0.8,"roughwas":0.6,"rest":1.0,"y2019":0.8,"copies":0.4},"breathe":4.6},
"five":{"hold":{"counted":0.8,"signed":0.6,"coffee":0.6,"jun":0.3,"mei":0.3,"noor":0.3,"sam":0.3,"yusuf":0.6,"noanswer":0.8}},
"taught":{"hold":{"first":0.6,"senses":0.6,"descend":0.8,"y2022":0.4,"before":0.8,"friston":0.6,"rods":0.8,"levels":0.6,"cell":0.6,"nobody":2.0}},
"mixing":{"hold":{"second":0.6,"others":1.2,"lovelace":0.8,"ways":0.8,"model":0.6,"brings":0.8,"reason":1.2,"science":0.4,"choice":1.6}},
"wire":{"hold":{"third":0.6,"worm":0.6,"wriggles":0.6,"sugar":0.8,"billion":0.8,"act":0.4,"speech":0.8,"exactly":0.6,"searle":0.6,"others":0.4,"who":1.6}},
"feels":{"hold":{"fourth":0.6,"pulses":0.4,"didnt":1.2,"roddid":1.6,"why":0.5,"one":0.4,"another":0.4,"test":0.4,"science":0.4}},
"machine":{"hold":{"then":0.6,"llinas":0.8,"ties":0.4,"sleep":0.8,"penrose":0.8,"critics":0.4,"disagree":0.6,"y2001":0.4,"filaments":1.0,"y2023":0.4,"none":0.8,"whether":1.8}},
"human":{"hold":{"last":0.6,"dullest":0.6,"today":0.8,"ifnot":0.4,"body":0.3,"life":0.3,"feelings":0.3,"choosing":0.6,"settled":0.8,"heard":1.6,"building":0.6,"helps":0.6,"answers":0.4},"breathe":5.4}
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

/* ===== What they tell us about ourselves: the film's own places, people and pictures =====
   Everything here is this film's (prefix tt_, for "They tell us"); the module's look, people, agent and cards come from
   films/what-an-agent-is/shared/src/. The places of its stories, each painted once (AG_PLACES): Rod and Margaret's living room in
   Melbourne in 1978, the laboratory where the implant was made, the corridor to the theatre, an office in Buffalo in 1958, a writing
   room in England in 1843 and a study in the Dutch Republic in 1637, by candlelight; and the module's room, with quieter marble where the
   five question cards hang. The people of other times are specs for ag_person, dressed for their time and never likenesses.
   The pictures that carry the film's ideas are drawn live: the inner ear's spiral and the implant's wire, a neuron and its copy, the
   worm, the fly and its map, the brain and its rhythm, and the cards. Living things are drawn with tapering curves, weight and light.
   Sizes are in the 1920 x 1080 frame: every word at least 28 px as seen, and nothing but the captions below y 890. */

/* ---------------------------------------------------------------- words in the corners, tags, and quotations */
// the place and the year, top right, as the series' films have it
function tt_corner(ctx,text,a,o){o=o||{};if(a<=0)return;ag_T(ctx,String(text).toUpperCase(),o.x||1824,o.y||100,{w:700,size:28,ls:3.5,align:"right",col:o.col||AG.violet,a});}
// a small tag on a card: words in a pill, springing in (o.k), o.col its edge and words, o.icon, o.size
function tt_tag(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();if(o.k!=null){ag_about(ctx,x,y,lerp(0.6,1,clamp(o.k,0,1.2)));}
  const b=ag_pill(ctx,x,y,text,{a,col:o.col||null,icon:o.icon,size:o.size||30});ctx.restore();return b;}
// a quotation card: the words in quotation marks (wrapped), then who said it; o.k springs it, o.w its width
function tt_quote(ctx,x,y,words,who,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||900;if(a<=0)return;
  return ag_textCard(ctx,x,y,w,{kick:o.kick,title:words,sub:who},{a,k:o.k,kickCol:o.kickCol||AG.mut});}
// a soft wash of the room's light over a frame: lifts a busy place behind words (o.c the colour)
function tt_wash(ctx,a,o){o=o||{};if(a<=0)return;ctx.save();ctx.fillStyle=rgba(o.c||[244,242,238],clamp(a,0,1));ctx.fillRect(0,0,W,H);ctx.restore();}
// a seeded jitter for hand-drawn things
const tt_rn=(i,k)=>hash(i*13.1+(k||0)*7.7,3.3+(k||0));

/* ---------------------------------------------------------------- people of other times
   Specs for ag_person (see people.js): skin, hair, the top they wear, and anything of their time painted over it. None is a likeness:
   these are the people of the stories, dressed for their time. */
// a moustache and a small beard on the chin, for 1637
function tt_moustache(c,P){c.save();ag_shape(c,AG_F.head);c.clip();const col=P.stache||[60,46,40];
  ag_soft(c,cc=>{cc.moveTo(346,470);cc.bezierCurveTo(356,462,372,462,386,468);cc.bezierCurveTo(390,472,388,476,382,476);cc.bezierCurveTo(372,472,358,474,348,478);cc.closePath();},col,mix(col,[160,150,150],0.4),370,466,30,null);
  ag_soft(c,cc=>{cc.moveTo(352,504);cc.bezierCurveTo(358,498,372,498,378,504);cc.bezierCurveTo(378,520,368,530,362,532);cc.bezierCurveTo(356,524,352,514,352,504);cc.closePath();},col,mix(col,[160,150,150],0.4),366,506,30,null);c.restore();}
// a wide white collar falling over the shoulders, for 1637, and a lace one, for 1843
function tt_band(c,P){ag_soft(c,cc=>{cc.moveTo(222,566);cc.bezierCurveTo(250,610,320,622,366,602);cc.bezierCurveTo(396,640,410,690,400,712);cc.bezierCurveTo(330,730,240,720,180,690);cc.bezierCurveTo(170,650,190,600,222,566);cc.closePath();},
  [238,236,230],[255,255,255],330,640,140,"rgba(60,50,40,0.28)",10);
  c.strokeStyle="rgba(120,110,100,0.35)";c.lineWidth=2;c.beginPath();c.moveTo(292,620);c.quadraticCurveTo(300,670,296,718);c.stroke();}
function tt_lace(c,P){ag_soft(c,cc=>{cc.moveTo(236,568);cc.bezierCurveTo(262,606,322,618,362,602);cc.lineTo(372,622);cc.bezierCurveTo(320,648,250,640,222,592);cc.closePath();},[240,236,228],[255,255,255],320,610,80,"rgba(60,50,40,0.25)",6);
  c.fillStyle="rgba(150,140,130,0.35)";for(let i=0;i<9;i++){const u=i/8,x=lerp(228,368,u),y=lerp(596,622,u)+Math.sin(u*Math.PI)*22;c.beginPath();c.arc(x,y,3,0,TAU);c.fill();}}
// headphones over the head, for 2022: a band over the crown and a cup over the ear
function tt_phones(c,P){const E=AG_FACE.ear;c.save();c.lineCap="round";c.strokeStyle="#3B3C42";c.lineWidth=14;c.beginPath();c.moveTo(E[0]-6,E[1]);c.bezierCurveTo(E[0]-26,330,300,262,372,300);c.stroke();
  ag_soft(c,cc=>ag_rect(cc,E[0]-29,E[1]-36,58,86,24),[70,72,80],[150,152,164],E[0]+5,E[1]-26,50,"rgba(0,0,0,0.4)",8);c.restore();}
const TT_ROD={key:"tt_rod",name:"Rod",skin:[226,184,152],hair:{style:"cropped",c:[118,102,90]},top:{kind:"cardigan",c:[128,108,86],inner:[226,220,204]},breath:0.26};
const TT_MARGARET={key:"tt_margaret",name:"Margaret",skin:[236,198,174],hair:{style:"bob",c:[128,96,72]},earrings:[222,204,170],top:{kind:"sweater",c:[166,130,118]},breath:0.3};
const TT_CLARK={key:"tt_clark",name:"Graeme Clark",skin:[230,190,160],hair:{style:"side",c:[96,76,58]},top:{kind:"blazer",c:[236,234,228],inner:[206,212,220],tie:[104,84,70]},breath:0.27};
const TT_ENG1={key:"tt_eng1",name:"Engineer",skin:[214,170,136],hair:{style:"side",c:[72,56,42]},beard:[76,60,46],top:{kind:"shirt",c:[176,160,130]},breath:0.28};
const TT_ENG2={key:"tt_eng2",name:"Engineer two",skin:[232,196,168],hair:{style:"cropped",c:[60,52,46]},glasses:[60,56,52],top:{kind:"shirt",c:[150,158,150]},breath:0.25};
const TT_AUD={key:"tt_aud",name:"Audiologist",skin:[238,206,180],hair:{style:"bob",c:[92,70,52]},top:{kind:"cardigan",c:[150,148,132],inner:[232,228,216]},breath:0.31};
const TT_PHARM={key:"tt_pharm",name:"Pharmacist",skin:[226,186,156],hair:{style:"side",c:[150,142,134]},glasses:[70,64,58],top:{kind:"blazer",c:[236,234,228],inner:[222,222,216],tie:[90,72,62]},breath:0.24};
// a brimmed hat of the 1950s, over short grey hair
function tt_hat(c,P){const col=P.hatC||[84,78,70];ag_soft(c,cc=>{cc.moveTo(196,352);cc.bezierCurveTo(230,330,330,322,412,340);cc.bezierCurveTo(420,348,410,356,396,354);cc.bezierCurveTo(320,346,250,352,206,366);cc.bezierCurveTo(192,368,188,358,196,352);cc.closePath();},
    ag_dk(col,0.1),ag_lt(col,0.3),340,336,120,"rgba(20,16,12,0.4)",6);
  ag_soft(c,cc=>{cc.moveTo(228,346);cc.bezierCurveTo(226,300,250,270,300,266);cc.bezierCurveTo(350,262,382,290,384,338);cc.bezierCurveTo(330,330,270,334,228,346);cc.closePath();},col,ag_lt(col,0.32),340,280,90,"rgba(20,16,12,0.4)",8);
  c.fillStyle=rgba(ag_dk(col,0.4),1);c.beginPath();c.moveTo(229,338);c.bezierCurveTo(270,326,330,322,383,330);c.lineTo(384,340);c.bezierCurveTo(330,332,270,336,229,348);c.closePath();c.fill();}
const TT_CUST={key:"tt_cust",name:"Customer",skin:[218,176,146],hair:{style:"cropped",c:[170,164,156]},hatC:[96,86,74],hat:{paint:tt_hat},top:{kind:"suit",c:[110,104,96],inner:[220,218,210],tie:[120,90,70]},breath:0.3};
const TT_BOY={key:"tt_boy",name:"Boy",skin:[234,196,168],hair:{style:"side",c:[110,84,60]},top:{kind:"shirt",c:[196,190,174]},breath:0.33};
const TT_ROSEN={key:"tt_rosen",name:"Psychologist",skin:[230,192,162],hair:{style:"side",c:[40,34,30]},top:{kind:"suit",c:[98,96,92],inner:[236,236,232],tie:[78,70,84]},breath:0.27};
const TT_LISTEN={key:"tt_listen",name:"Listener",skin:[176,128,98],hair:{style:"cropped",c:[36,30,28]},top:{kind:"sweater",c:[150,140,124]},hat:{paint:tt_phones},breath:0.29};
// hair of the 1840s: parted in the middle, smoothed down over the ears, gathered in a low bun at the back
function tt_victorian(c,P){const hc=P.hair.c;ag_soft(c,cc=>cc.ellipse(206,468,36,31,0.35,0,TAU),hc,ag_lt(hc,0.3),196,452,40,"rgba(0,0,0,0.45)",8);
  c.strokeStyle=rgba(ag_lt(hc,0.4),0.25);c.lineWidth=2;c.beginPath();c.arc(206,468,20,0.6,2.6);c.stroke();
  c.strokeStyle=rgba(mix(P.skin,[210,170,150],0.5),0.5);c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(334,300);c.quadraticCurveTo(300,292,262,302);c.stroke();}
const TT_ADA={key:"tt_ada",name:"Writer",skin:[238,212,194],hair:{style:"bob",c:[52,40,34]},hat:{paint:tt_victorian},top:{kind:"tunic",c:[72,66,76],paint:tt_lace},breath:0.3};
const TT_DESC={key:"tt_desc",name:"Philosopher",skin:[226,190,162],hair:{style:"long",c:[52,42,36]},stache:[58,46,40],hat:{paint:tt_moustache},top:{kind:"tunic",c:[48,46,50],paint:tt_band},breath:0.26};
const TT_SEARLE={key:"tt_searle",name:"Philosopher of 1980",skin:[230,194,166],hair:{style:"cropped",c:[150,140,132]},top:{kind:"blazer",c:[112,98,82],inner:[230,228,220]},breath:0.27};

/* ---------------------------------------------------------------- places of the stories, painted once
   Each paints the whole frame: a wall, a window on the right (the light comes from there, as in the module's room), a floor, and what
   stays put. People and what moves are drawn live over it. */
// a window on the right: the frame, the glass with what's outside (sky), net curtains or blinds; o.night for a dark one
function tt_window(c,x,y,w,h,o){o=o||{};const fr=o.frame||[226,220,206];
  let g=c.createLinearGradient(0,y,0,y+h);if(o.night){g.addColorStop(0,"#1E2534");g.addColorStop(1,"#2B3344");}else{g.addColorStop(0,"#DCE6EE");g.addColorStop(0.7,"#EEF1EE");g.addColorStop(1,"#E8E2D4");}
  c.fillStyle=g;c.fillRect(x,y,w,h);if(o.outside)o.outside(c,x,y,w,h);
  if(o.panes){c.strokeStyle=rgba(fr,1);c.lineWidth=o.night?5:8;for(let i=1;i<o.panes[0];i++){const xx=x+w*i/o.panes[0];c.beginPath();c.moveTo(xx,y);c.lineTo(xx,y+h);c.stroke();}
    for(let j=1;j<o.panes[1];j++){const yy=y+h*j/o.panes[1];c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke();}}
  if(o.blinds){c.fillStyle="rgba(236,232,222,0.78)";for(let yy=y+8;yy<y+h*o.blinds;yy+=22)c.fillRect(x,yy,w,13);c.fillStyle="rgba(120,110,96,0.3)";for(let yy=y+8;yy<y+h*o.blinds;yy+=22)c.fillRect(x,yy+12,w,1.5);}
  if(o.net){const ng=c.createLinearGradient(x,0,x+w,0);ng.addColorStop(0,"rgba(250,248,244,0.62)");ng.addColorStop(0.5,"rgba(250,248,244,0.48)");ng.addColorStop(1,"rgba(250,248,244,0.6)");c.fillStyle=ng;c.fillRect(x,y,w,h);
    c.strokeStyle="rgba(200,194,182,0.4)";c.lineWidth=2;for(let xx=x+14;xx<x+w;xx+=26){c.beginPath();c.moveTo(xx,y);c.bezierCurveTo(xx+6,y+h*0.3,xx-6,y+h*0.7,xx+3,y+h);c.stroke();}}
  c.strokeStyle=rgba(fr,1);c.lineWidth=18;c.strokeRect(x-9,y-9,w+18,h+18);c.fillStyle=rgba(mix(fr,[255,255,255],0.3),1);c.fillRect(x-30,y+h+9,w+60,16);c.fillStyle="rgba(60,50,40,0.2)";c.fillRect(x-30,y+h+25,w+60,6);
  if(!o.night){g=c.createRadialGradient(x+w/2,y+h/2,20,x+w/2,y+h/2,Math.max(w,h)*1.3);g.addColorStop(0,"rgba(255,250,236,0.2)");g.addColorStop(1,"rgba(255,250,236,0)");c.fillStyle=g;c.fillRect(x-w,y-h,w*3,h*3);}}
// a wall in a colour, lit from the right, with a soft pattern of the time: o.pattern(c) draws it, o.dado a rail's height
function tt_wall(c,hz,col,o){o=o||{};let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(mix(col,[0,0,0],0.16),1));g.addColorStop(0.7,rgba(col,1));g.addColorStop(1,rgba(mix(col,[255,250,240],0.12),1));
  c.fillStyle=g;c.fillRect(0,0,W,hz);if(o.pattern){c.save();c.beginPath();c.rect(0,0,W,hz);c.clip();o.pattern(c);c.restore();}
  if(o.dado){c.fillStyle=rgba(mix(col,[0,0,0],0.14),1);c.fillRect(0,o.dado,W,hz-o.dado);c.fillStyle=rgba(mix(col,[255,255,255],0.3),1);c.fillRect(0,o.dado-8,W,8);c.fillStyle="rgba(40,30,20,0.18)";c.fillRect(0,o.dado,W,3);}
  g=c.createLinearGradient(0,hz-60,0,hz);g.addColorStop(0,"rgba(40,30,20,0)");g.addColorStop(1,"rgba(40,30,20,0.16)");c.fillStyle=g;c.fillRect(0,hz-60,W,60);}
// a floor from hz down: a flat colour with soft depth, o.lines planks or tiles
function tt_floorFlat(c,hz,col,o){o=o||{};let g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(mix(col,[0,0,0],0.18),1));g.addColorStop(0.3,rgba(col,1));g.addColorStop(1,rgba(mix(col,[0,0,0],0.1),1));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  if(o.tiles){c.strokeStyle="rgba(60,50,40,0.12)";c.lineWidth=1.5;for(let i=-12;i<=12;i++){c.beginPath();c.moveTo(960+i*70,hz);c.lineTo(960+i*260,H);c.stroke();}let d=12;for(let y=hz+d;y<H;y+=d,d*=1.32){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}}
  if(o.weave){const R=ag_rnd(5);c.fillStyle="rgba(255,250,240,0.05)";for(let i=0;i<2400;i++){const x=R()*W,y=hz+R()*(H-hz);c.fillRect(x,y,2+R()*3,1.4);}c.fillStyle="rgba(40,30,20,0.06)";for(let i=0;i<2400;i++){const x=R()*W,y=hz+R()*(H-hz);c.fillRect(x,y,2+R()*3,1.4);}}
  g=c.createLinearGradient(0,hz,0,hz+70);g.addColorStop(0,"rgba(30,22,16,0.22)");g.addColorStop(1,"rgba(30,22,16,0)");c.fillStyle=g;c.fillRect(0,hz,W,70);
  c.fillStyle=rgba(mix(col,[255,255,255],0.25),1);c.fillRect(0,hz-14,W,14);c.fillStyle="rgba(40,30,20,0.28)";c.fillRect(0,hz,W,1.5);}
// the soft shade on the left and the window's warmth on the right, over a whole place
function tt_light(c,warm){let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,24,18,0.2)");g.addColorStop(0.45,"rgba(30,24,18,0.02)");g.addColorStop(1,"rgba(255,246,226,"+(warm||0.08)+")");c.fillStyle=g;c.fillRect(0,0,W,H);}

const TT_HOME={hz:700,table:[500,900,920,110],y:574,s:0.8,rod:1250,mag:670,phone:[1576,646]};   // the living room: the carpet's edge, the table's front edge [x, y, w], where Rod and Margaret sit, the telephone
AG_PLACES.tt_home=c=>{const hz=TT_HOME.hz;
  // a warm cream wallpaper of the seventies, its soft pattern of rounded lozenges barely darker than the paper
  tt_wall(c,hz,[222,206,176],{pattern:cc=>{cc.fillStyle="rgba(150,118,80,0.06)";for(let y=-30;y<hz;y+=96)for(let x=-40+(Math.round(y/96)%2)*60;x<W;x+=120){cc.beginPath();cc.ellipse(x,y,34,44,0,0,TAU);cc.fill();}
    cc.strokeStyle="rgba(150,118,80,0.06)";cc.lineWidth=3;for(let y=-30;y<hz;y+=96)for(let x=-40+(Math.round(y/96)%2)*60;x<W;x+=120){cc.beginPath();cc.ellipse(x,y,48,60,0,0,TAU);cc.stroke();}}});
  // the kitchen through an open doorway on the left: its own wall, tiles, a stove (the kettle on it is drawn live)
  c.fillStyle="#D9D3C2";c.fillRect(70,150,330,hz-150);let g=c.createLinearGradient(70,0,400,0);g.addColorStop(0,"rgba(30,24,18,0.3)");g.addColorStop(1,"rgba(30,24,18,0.08)");c.fillStyle=g;c.fillRect(70,150,330,hz-150);
  c.fillStyle="#E6E1D4";c.fillRect(110,250,250,130);c.fillStyle="rgba(120,110,96,0.25)";for(let i=0;i<5;i++)c.fillRect(118+i*48,258,40,114);
  ag_soft(c,cc=>ag_rect(cc,120,450,230,hz-450,6),[232,228,218],[255,255,255],300,460,200,"rgba(40,30,20,0.25)",12);
  c.fillStyle="#3A3936";c.fillRect(132,436,206,16);c.fillStyle="#2C2B29";for(const x of [170,290]){c.beginPath();c.ellipse(x,438,40,7,0,0,TAU);c.fill();}
  c.fillStyle="rgba(60,56,50,0.5)";for(let i=0;i<4;i++){c.beginPath();c.arc(160+i*50,480,9,0,TAU);c.fill();}c.fillStyle="#BDB6A6";c.fillRect(140,520,190,120);c.strokeStyle="rgba(60,50,40,0.25)";c.lineWidth=2;c.strokeRect(140,520,190,120);
  c.strokeStyle="#C9BFA8";c.lineWidth=22;c.beginPath();c.moveTo(60,hz);c.lineTo(60,140);c.lineTo(410,140);c.lineTo(410,hz);c.stroke();c.strokeStyle="rgba(40,30,20,0.18)";c.lineWidth=3;c.beginPath();c.moveTo(72,hz);c.lineTo(72,152);c.lineTo(398,152);c.lineTo(398,hz);c.stroke();
  // a shelf with the radio on it (the radio's dial is drawn live), above where Margaret sits
  ag_soft(c,cc=>ag_rect(cc,520,246,330,18,4),[150,116,82],[200,170,130],720,250,200,"rgba(40,30,20,0.3)",8);c.fillStyle="rgba(40,30,20,0.18)";c.fillRect(526,264,320,10);
  ag_soft(c,cc=>ag_rect(cc,560,150,180,96,14),[124,92,66],[176,140,104],680,164,120,"rgba(30,20,10,0.4)",10);
  c.fillStyle="#C8BBA2";rr(c,576,166,92,64,8);c.fill();c.strokeStyle="rgba(90,76,60,0.35)";c.lineWidth=2;for(let y=172;y<228;y+=7){c.beginPath();c.moveTo(580,y);c.lineTo(664,y);c.stroke();}
  c.fillStyle="#E8DFC8";c.beginPath();c.arc(704,188,20,0,TAU);c.fill();c.strokeStyle="#5A4A38";c.lineWidth=2.5;c.beginPath();c.moveTo(704,188);c.lineTo(714,176);c.stroke();c.fillStyle="#3E342A";c.beginPath();c.arc(704,226,8,0,TAU);c.fill();
  // the calendar for 1978, between them
  ag_soft(c,cc=>ag_rect(cc,880,130,170,230,6),[244,240,230],[255,255,255],990,150,160,"rgba(40,30,20,0.25)",10);c.fillStyle="#9A8F7E";c.fillRect(962,118,6,18);
  c.fillStyle="#B8A890";c.fillRect(890,140,150,82);c.fillStyle="#E9E1CF";c.beginPath();c.moveTo(890,222);c.lineTo(930,170);c.lineTo(960,198);c.lineTo(994,160);c.lineTo(1040,222);c.closePath();c.fill();
  T(c,"1978",965,262,{w:800,size:34,align:"center",color:"#4A4036"});c.fillStyle="rgba(74,64,54,0.4)";for(let r=0;r<4;r++)for(let k=0;k<7;k++)c.fillRect(898+k*20,278+r*18,12,8);
  // the window on the right with net curtains: the suburb's roofs and a gum tree beyond
  tt_window(c,1390,150,420,470,{panes:[2,1],net:true,frame:[232,226,212],outside:(cc,x,y,w,h)=>{cc.fillStyle="#C9D2C6";cc.beginPath();cc.moveTo(x,y+h*0.74);cc.lineTo(x+w*0.18,y+h*0.62);cc.lineTo(x+w*0.36,y+h*0.74);cc.lineTo(x+w*0.36,y+h*0.66);cc.lineTo(x+w*0.56,y+h*0.6);cc.lineTo(x+w*0.76,y+h*0.68);cc.lineTo(x+w,y+h*0.64);cc.lineTo(x+w,y+h);cc.lineTo(x,y+h);cc.closePath();cc.fill();
    // a gum tree: a pale trunk that forks, and loose clumps of grey-green leaves
    cc.strokeStyle="#B9AE9C";cc.lineCap="round";cc.lineWidth=12;cc.beginPath();cc.moveTo(x+w*0.7,y+h*0.8);cc.bezierCurveTo(x+w*0.7,y+h*0.6,x+w*0.66,y+h*0.5,x+w*0.6,y+h*0.36);cc.stroke();
    cc.lineWidth=7;cc.beginPath();cc.moveTo(x+w*0.69,y+h*0.58);cc.bezierCurveTo(x+w*0.76,y+h*0.48,x+w*0.82,y+h*0.42,x+w*0.86,y+h*0.32);cc.stroke();
    const R=ag_rnd(4);for(let i=0;i<14;i++){const cx=x+w*(0.52+R()*0.4),cy=y+h*(0.18+R()*0.26);cc.fillStyle=rgba(mix([168,182,160],[140,156,134],R()),0.55);cc.beginPath();cc.ellipse(cx,cy,w*(0.05+R()*0.05),h*(0.025+R()*0.03),R()*0.6-0.3,0,TAU);cc.fill();}}});
  // a small side table under the window, for the telephone (drawn live)
  ag_soft(c,cc=>ag_rect(cc,1496,664,160,16,4),[150,116,82],[200,170,130],1600,668,120,"rgba(40,30,20,0.3)",8);c.fillStyle="#8A6A4C";c.fillRect(1508,680,10,hz-680+44);c.fillRect(1634,680,10,hz-680+44);
  tt_floorFlat(c,hz,[146,118,92],{weave:true});
  tt_light(c,0.1);};
// the table, drawn live before the people (they sit behind it, their forearms on it): laminate on a wooden frame
function tt_table(ctx){const T_=TT_HOME.table,x=T_[0],y=T_[1],w=T_[2],d=T_[3];ctx.save();ag_floorShadow(ctx,x+w/2-20,y+150,w*0.56,30,0.3);
  let g=ctx.createLinearGradient(0,y-d,0,y);g.addColorStop(0,"#ECE6D9");g.addColorStop(1,"#DDD4C2");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+50,y-d);ctx.lineTo(x+w-50,y-d);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,"rgba(40,30,20,0.08)");g.addColorStop(1,"rgba(255,250,236,0.12)");ctx.fillStyle=g;ctx.fill();
  ctx.fillStyle="#B9AE96";ctx.fillRect(x,y,w,18);ctx.fillStyle="rgba(60,50,40,0.2)";ctx.fillRect(x,y+18,w,8);ctx.fillStyle="#9C9078";ctx.fillRect(x+30,y+18,16,170);ctx.fillRect(x+w-46,y+18,16,170);
  ctx.restore();}
// what stands on the table, drawn after the people: a teapot between them and a cup in front of each
function tt_tableThings(ctx,o){o=o||{};const T_=TT_HOME.table,x=T_[0],y=T_[1],w=T_[2];ctx.save();
  const px=x+w/2,py=y-40;ag_floorShadow(ctx,px-6,py+28,62,10,0.25);ag_soft(ctx,cc=>{cc.ellipse(px,py,54,40,0,0,TAU);},[214,206,190],[250,248,242],px+18,py-16,60,"rgba(60,50,40,0.3)",10);
  ctx.strokeStyle="#CFC6B2";ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(px+50,py-6);ctx.quadraticCurveTo(px+86,py-20,px+90,py-40);ctx.stroke();ctx.beginPath();ctx.arc(px-60,py,20,Math.PI*0.6,Math.PI*1.45);ctx.stroke();
  ctx.fillStyle="#E4DCCB";ctx.beginPath();ctx.ellipse(px,py-38,24,8,0,0,TAU);ctx.fill();ctx.fillStyle="#BDB29C";ctx.beginPath();ctx.arc(px,py-46,7,0,TAU);ctx.fill();
  for(const cx of [x+300,x+w-300]){const cy=y-30;ag_floorShadow(ctx,cx,cy+2,30,6,0.25);ag_soft(ctx,cc=>{cc.moveTo(cx-24,cy-30);cc.lineTo(cx+24,cy-30);cc.lineTo(cx+18,cy);cc.lineTo(cx-18,cy);cc.closePath();},[236,232,222],[255,255,255],cx+10,cy-28,30,"rgba(60,50,40,0.25)",6);
    ctx.strokeStyle="#DCD5C6";ctx.lineWidth=5;ctx.beginPath();ctx.arc(cx+(cx<px?-26:26),cy-16,9,cx<px?Math.PI*0.5:-Math.PI*0.5,cx<px?Math.PI*1.5:Math.PI*0.5);ctx.stroke();}
  ctx.restore();}
// Rod and Margaret at their table: Margaret on the left, facing him; Rod on the right, facing her, so his left ear (the implant's) is ours to see.
// o: rod {talk, smile, gaze, nod, flip}, mag {...}, their arms down behind the table; drawn with the table (before) and what's on it (after)
function tt_couple(ctx,t,o){o=o||{};const H_=TT_HOME,cut=H_.table[1]-H_.table[3],r=o.rod||{},m=o.mag||{};tt_table(ctx);
  ag_person(ctx,TT_MARGARET,H_.mag,H_.y,H_.s,Object.assign({t:t+1.3,cut,gaze:[3,0]},m));
  ag_person(ctx,TT_ROD,H_.rod,H_.y,H_.s,Object.assign({t,flip:true,cut,gaze:[3,0]},r));
  tt_tableThings(ctx);}
// where a person's mouth and ear are in the frame: who drawn at (x, y, s), facing right unless flip
function tt_at(x,y,s,flip,fx,fy){return[x+(fx-296)*s*(flip?-1:1),y+(fy-596)*s];}
const tt_mouth=(x,y,s,flip)=>tt_at(x,y,s,flip,AG_FACE.mid[0],AG_FACE.mid[1]),tt_ear=(x,y,s,flip)=>tt_at(x,y,s,flip,AG_FACE.ear[0],AG_FACE.ear[1]);

// the lab's shots draw its light over what stands there, so the bare room keeps it while a later moment comes in
AG_BARE.lab=c=>ag_roomLight(c,1);
AG_PLACES.tt_lab78=c=>{const hz=690;
  // an institutional green-grey, a darker dado, a window with blinds on the right
  tt_wall(c,hz,[200,206,194],{dado:470});
  tt_window(c,1430,120,360,300,{blinds:0.62,frame:[214,214,204]});
  // the long bench along the wall, and on it the electronics: grey and beige boxes, dials, an oscilloscope, cables
  c.fillStyle="#6E6152";c.fillRect(0,520,1360,26);c.fillStyle="#5A4E42";c.fillRect(0,546,1360,10);c.fillStyle="#8D8574";c.fillRect(30,556,26,hz-556);c.fillRect(1300,556,26,hz-556);
  const box=(x,y,w,h,col)=>{ag_soft(c,cc=>ag_rect(cc,x,y,w,h,6),col,mix(col,[255,255,255],0.4),x+w*0.7,y+10,w,"rgba(40,30,20,0.32)",10);};
  box(90,360,250,160,[196,188,170]);box(360,300,190,220,[150,152,148]);box(580,390,300,130,[206,198,180]);box(910,330,220,190,[170,172,166]);
  c.fillStyle="#2E3A36";c.beginPath();c.arc(455,380,48,0,TAU);c.fill();c.strokeStyle="#7FA894";c.lineWidth=2.5;c.beginPath();for(let i=0;i<=40;i++){const u=i/40,x=415+u*80,y=380+Math.sin(u*TAU*2)*16;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  c.fillStyle="#E8E2D2";for(let i=0;i<5;i++){c.beginPath();c.arc(130+i*44,420,13,0,TAU);c.fill();}c.fillStyle="#3A3530";for(let i=0;i<5;i++){c.beginPath();c.arc(130+i*44,420,4,0,TAU);c.fill();}
  c.fillStyle="#3A3530";for(let i=0;i<6;i++)c.fillRect(612+i*42,420,10,40);c.fillStyle="#C2B79F";for(let i=0;i<6;i++)c.fillRect(608+i*42,432,18,8);
  c.fillStyle="#E9E4D6";for(let i=0;i<3;i++){c.beginPath();c.arc(960+i*60,400,18,0,TAU);c.fill();}c.fillStyle="#BCC6C0";c.fillRect(950,450,150,40);
  c.strokeStyle="#2F2C28";c.lineWidth=4;c.beginPath();c.moveTo(340,470);c.bezierCurveTo(360,600,520,560,580,470);c.moveTo(880,470);c.bezierCurveTo(900,580,880,600,910,480);c.stroke();
  // a pinboard with drawings of the ear, and a clock
  ag_soft(c,cc=>ag_rect(cc,1170,120,210,170,4),[188,160,120],[220,200,160],1300,130,150,"rgba(40,30,20,0.3)",8);c.fillStyle="#F2EEE4";c.save();c.translate(1200,140);c.rotate(-0.04);c.fillRect(0,0,90,110);c.restore();c.save();c.translate(1290,150);c.rotate(0.05);c.fillRect(0,0,74,96);c.restore();
  c.strokeStyle="rgba(80,70,60,0.5)";c.lineWidth=2;c.beginPath();for(let i=0;i<=60;i++){const a=i/60*TAU*2.4,r=34-i*0.48;const x=1244+Math.cos(a)*r,y=196+Math.sin(a)*r;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  c.fillStyle="#F4F1EA";c.beginPath();c.arc(760,150,52,0,TAU);c.fill();c.strokeStyle="#4A4640";c.lineWidth=5;c.stroke();c.lineWidth=4;c.beginPath();c.moveTo(760,150);c.lineTo(760,112);c.moveTo(760,150);c.lineTo(786,164);c.stroke();
  tt_floorFlat(c,hz,[176,170,156],{tiles:true});
  tt_light(c,0.08);};
// a plain wooden chair's back, behind someone seated facing left at (x, y, s): it shows beside their back
function tt_chair(ctx,x,y,s){ctx.save();const cx=x+150*s,top=y-40*s;ag_soft(ctx,cc=>ag_rect(cc,cx-14*s,top,28*s,360*s,8*s),[120,96,72],[176,150,116],cx+8*s,top+20*s,120*s,"rgba(30,20,10,0.35)",8);
  ag_soft(ctx,cc=>ag_rect(cc,cx-110*s,top+6*s,124*s,30*s,10*s),[132,106,80],[186,160,126],cx-20*s,top+10*s,120*s,"rgba(30,20,10,0.35)",6);ctx.restore();}
// the implant's speech processor on its trolley, and the reel-to-reel tape recorder on top (o.reel: the reels' turn in radians)
function tt_trolley(ctx,x,y,o){o=o||{};ctx.save();ag_floorShadow(ctx,x+150,y+300,210,26,0.28);
  ctx.fillStyle="#8B8F94";ctx.fillRect(x+10,y+150,12,150);ctx.fillRect(x+278,y+150,12,150);ctx.fillRect(x,y+250,300,10);
  ctx.fillStyle="#2C2D31";for(const wx of [x+16,x+284]){ctx.beginPath();ctx.arc(wx,y+304,12,0,TAU);ctx.fill();}
  ag_soft(ctx,cc=>ag_rect(cc,x,y+60,300,96,8),[178,176,166],[226,224,214],x+220,y+70,200,"rgba(40,30,20,0.32)",10);   // the processor
  ctx.fillStyle="#3D3B37";for(let i=0;i<10;i++){ctx.beginPath();ctx.arc(x+30+i*26,y+92,7,0,TAU);ctx.fill();}
  const lit=o.lit||0;for(let i=0;i<10;i++){const a=clamp(lit-i,0,1);if(a<=0)continue;ctx.save();ctx.shadowColor=rgba(AG.blue,0.8);ctx.shadowBlur=12;ctx.fillStyle=rgba(mix(AG.blue,[190,230,250],0.5),a);ctx.beginPath();ctx.arc(x+30+i*26,y+92,6,0,TAU);ctx.fill();ctx.restore();}
  ctx.fillStyle="#E8E4D8";ctx.fillRect(x+24,y+120,120,22);ctx.fillStyle="#5A564F";ctx.fillRect(x+160,y+124,120,14);
  // the tape recorder: a case, two reels, a label
  ag_soft(ctx,cc=>ag_rect(cc,x+10,y-110,280,170,10),[118,112,104],[170,164,154],x+220,y-100,200,"rgba(30,20,10,0.35)",10);
  for(const k of [0,1]){const cx=x+80+k*140,cy=y-40;ctx.fillStyle="#2E2D2B";ctx.beginPath();ctx.arc(cx,cy,48,0,TAU);ctx.fill();ctx.fillStyle="#C9C2B2";ctx.beginPath();ctx.arc(cx,cy,40,0,TAU);ctx.fill();
    ctx.save();ctx.translate(cx,cy);ctx.rotate((o.reel||0)*(k?1:1.12));ctx.fillStyle="#7A746A";for(let s=0;s<3;s++){ctx.rotate(TAU/3);ctx.beginPath();ctx.ellipse(0,-22,9,13,0,0,TAU);ctx.fill();}ctx.restore();
    ctx.fillStyle="#2E2D2B";ctx.beginPath();ctx.arc(cx,cy,8,0,TAU);ctx.fill();}
  ctx.strokeStyle="#4A3A2C";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+80,y+8);ctx.lineTo(x+220,y+8);ctx.stroke();
  ctx.restore();}

AG_PLACES.tt_corridor=c=>{const hz=760;tt_wall(c,hz,[214,214,204],{dado:520});
  // double doors with round windows, and the sign above them
  const x=700,y=230,w=520,h=hz-230;ag_soft(c,cc=>ag_rect(cc,x-24,y-24,w+48,h+24,6),[176,172,160],[214,210,200],x+w,y,300,"rgba(40,30,20,0.35)",12);
  for(const k of [0,1]){const dx=x+k*w/2;ag_soft(c,cc=>cc.rect(dx+6,y,w/2-12,h),[196,192,180],[232,228,218],dx+w/2-60,y+60,260,"rgba(40,30,20,0.3)",14);
    c.fillStyle="#C8D3D6";c.beginPath();c.arc(dx+w/4,y+170,52,0,TAU);c.fill();c.strokeStyle="#8E8A80";c.lineWidth=8;c.stroke();c.fillStyle="#9C988C";c.fillRect(dx+(k?20:w/2-50),y+300,30,90);}
  ag_soft(c,cc=>ag_rect(cc,x+w/2-170,110,340,82,8),[242,240,232],[255,255,255],x+w/2+60,120,200,"rgba(40,30,20,0.3)",8);
  tt_floorFlat(c,hz,[180,176,164],{tiles:true});tt_light(c,0.06);};
// the corridor's sign, drawn live so its word is measured: "Theatre"
function tt_theatreSign(ctx,a){ag_T(ctx,"Theatre",960,166,{w:800,size:44,align:"center",col:[60,58,54],a});}

AG_PLACES.tt_office58=c=>{const hz=690;
  // cream walls over dark wood panelling, a window with blinds, a filing cabinet, a blackboard of the time
  tt_wall(c,hz,[222,214,192],{dado:420,pattern:null});
  c.fillStyle="#6B5038";c.fillRect(0,420,W,hz-420);c.strokeStyle="rgba(30,20,10,0.35)";c.lineWidth=3;for(let x=0;x<W;x+=180){c.strokeRect(x+14,440,152,hz-460);}c.fillStyle="#8A6A4A";c.fillRect(0,410,W,14);
  tt_window(c,1420,110,380,320,{blinds:0.7,frame:[206,198,180]});
  ag_soft(c,cc=>ag_rect(cc,120,130,520,300,6),[52,62,58],[90,104,98],520,140,300,"rgba(0,0,0,0.4)",10);c.strokeStyle="rgba(232,232,224,0.55)";c.lineWidth=3;
  c.beginPath();for(let k=0;k<4;k++){c.moveTo(190,200+k*60);c.lineTo(250,230);}c.moveTo(250,230);c.lineTo(330,232);c.stroke();c.beginPath();c.arc(350,232,22,0,TAU);c.stroke();c.beginPath();c.moveTo(372,232);c.lineTo(450,232);c.stroke();   // a sketch of a unit on the board
  ag_soft(c,cc=>ag_rect(cc,1180,300,170,hz-300+40,6),[142,140,132],[190,188,180],1300,320,150,"rgba(30,20,10,0.35)",10);c.fillStyle="#5E5C56";for(let i=0;i<4;i++)c.fillRect(1236,350+i*92,60,10);
  tt_floorFlat(c,hz,[120,96,72],{});tt_light(c,0.08);};
// a desk of the time, its front edge at (x, y), w wide, with papers on it; o.papers draws on the top page (ctx, x, y, w, h)
function tt_oldDesk(ctx,x,y,w,o){o=o||{};const d=70;ctx.save();ag_floorShadow(ctx,x+w/2,y+150,w*0.55,30,0.28);
  let g=ctx.createLinearGradient(0,y-d,0,y);g.addColorStop(0,"#7A5A3E");g.addColorStop(1,"#5E432E");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+28,y-d);ctx.lineTo(x+w-28,y-d);ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();
  ctx.fillStyle="#4E3826";ctx.fillRect(x,y,w,24);ctx.fillStyle="#3E2C1E";ctx.fillRect(x,y+24,w,170);ctx.strokeStyle="rgba(255,230,200,0.12)";ctx.lineWidth=2;ctx.strokeRect(x+20,y+40,w/2-30,120);ctx.strokeRect(x+w/2+10,y+40,w/2-30,120);
  if(o.papers!==false){ctx.save();ctx.translate(x+w*0.42,y-d*0.5);ctx.rotate(-0.06);ctx.fillStyle="#F2EEE2";ctx.fillRect(-110,-28,220,52);ctx.restore();}
  ctx.restore();}

AG_PLACES.tt_room1843=c=>{const hz=700;
  // a sage damask, a tall window with heavy curtains on the right, a dado and a dark floor
  tt_wall(c,hz,[176,182,160],{dado:500,pattern:cc=>{cc.fillStyle="rgba(70,80,60,0.09)";for(let y=-40;y<500;y+=120)for(let x=-40+(Math.round(y/120)%2)*70;x<W;x+=140){cc.beginPath();cc.moveTo(x,y-38);cc.bezierCurveTo(x+30,y-10,x+30,y+10,x,y+38);cc.bezierCurveTo(x-30,y+10,x-30,y-10,x,y-38);cc.fill();}}});
  tt_window(c,1450,150,300,440,{panes:[2,4],frame:[220,214,200]});
  for(const s of [-1,1]){const cx=s<0?1400:1800;ag_soft(c,cc=>{cc.moveTo(cx-60,124);cc.bezierCurveTo(cx-40,330,cx-70,520,cx-50,hz);cc.lineTo(cx+60,hz);cc.bezierCurveTo(cx+70,520,cx+40,330,cx+60,124);cc.closePath();},[108,92,86],[150,132,124],cx+20,240,260,"rgba(30,20,10,0.4)",18);}
  c.fillStyle="#7A6656";c.fillRect(1360,114,480,18);
  // a framed print on the wall, and a small table with books
  ag_soft(c,cc=>ag_rect(cc,180,170,300,230,4),[150,120,80],[200,170,120],420,180,200,"rgba(30,20,10,0.35)",8);c.fillStyle="#EFE8D6";c.fillRect(200,190,260,190);c.strokeStyle="rgba(90,80,60,0.45)";c.lineWidth=2;
  c.beginPath();c.moveTo(220,350);c.bezierCurveTo(280,280,330,330,440,250);c.stroke();
  tt_floorFlat(c,hz,[96,74,56],{});tt_light(c,0.07);};
// a drawing of columns of gears, an engine that was never built, on a sheet (x, y, w, h); o.turn turns the wheels a little
function tt_engine(ctx,x,y,w,h,o){o=o||{};ctx.save();ag_box(ctx,x,y,w,h,8,{});ctx.beginPath();ctx.rect(x+10,y+10,w-20,h-20);ctx.clip();
  const cols=7,rows=6,cw=(w-60)/cols,rh=(h-90)/rows;ctx.strokeStyle="rgba(70,60,50,0.7)";ctx.lineWidth=2;
  for(let i=0;i<cols;i++){const cx=x+30+cw*(i+0.5);ctx.beginPath();ctx.moveTo(cx,y+24);ctx.lineTo(cx,y+h-50);ctx.stroke();
    for(let j=0;j<rows;j++){const cy=y+40+rh*(j+0.5),r=Math.min(cw,rh)*0.36;ctx.beginPath();ctx.ellipse(cx,cy,r,r*0.38,0,0,TAU);ctx.stroke();
      ctx.save();ctx.translate(cx,cy);ctx.scale(1,0.38);ctx.rotate((o.turn||0)*(i%2?1:-1)+j*0.3);for(let k=0;k<10;k++){ctx.rotate(TAU/10);ctx.beginPath();ctx.moveTo(r,0);ctx.lineTo(r+5,0);ctx.stroke();}ctx.restore();}}
  ctx.fillStyle="rgba(70,60,50,0.55)";ctx.fillRect(x+20,y+h-46,w-40,6);ctx.restore();}

AG_PLACES.tt_study1637=c=>{const hz=720;
  // night, by candlelight: a plaster wall warm where the candle reaches and dark beyond, a beam above, a small leaded window, books
  tt_wall(c,hz,[120,100,80],{});
  c.fillStyle="#3E3024";c.fillRect(0,40,W,46);c.fillStyle="rgba(255,220,170,0.08)";c.fillRect(0,40,W,6);
  tt_window(c,1420,170,260,320,{night:true,panes:[3,4],frame:[70,58,46]});
  c.fillStyle="#4A3A2C";c.fillRect(150,250,460,16);c.fillRect(150,380,460,16);   // shelves of books
  const R=ag_rnd(9);for(const sy of [250,380])for(let x=160;x<600;){const bw=14+R()*20,bh=70+R()*40;c.fillStyle=rgba([[96,62,44],[70,58,46],[110,86,58],[60,50,40]][(R()*4)|0],1);c.fillRect(x,sy-bh,bw,bh);x+=bw+2;}
  tt_floorFlat(c,hz,[70,54,40],{});
  // the candle's light, from where it stands on the desk (850, 560), and the dark at the edges
  let g=c.createRadialGradient(860,520,20,860,520,900);g.addColorStop(0,"rgba(255,206,140,0.42)");g.addColorStop(0.35,"rgba(255,190,120,0.16)");g.addColorStop(1,"rgba(255,190,120,0)");c.save();c.globalCompositeOperation="screen";c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
  g=c.createRadialGradient(860,520,300,860,520,1300);g.addColorStop(0,"rgba(10,8,12,0)");g.addColorStop(1,"rgba(10,8,12,0.6)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// a candle at (x, y), its flame flickering with t
function tt_candle(ctx,x,y,t,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="#E9E0CC";ctx.fillRect(x-12,y-90,24,90);ctx.fillStyle="#7A6248";ctx.beginPath();ctx.ellipse(x,y,34,9,0,0,TAU);ctx.fill();
  const f=1+0.06*Math.sin(t*11)+0.04*Math.sin(t*17.3),sway=Math.sin(t*3.1)*2;ctx.save();ctx.globalCompositeOperation="screen";let g=ctx.createRadialGradient(x,y-120,2,x,y-120,90);g.addColorStop(0,"rgba(255,214,150,0.5)");g.addColorStop(1,"rgba(255,214,150,0)");ctx.fillStyle=g;ctx.fillRect(x-100,y-220,200,200);ctx.restore();
  g=ctx.createLinearGradient(0,y-150,0,y-92);g.addColorStop(0,"#FFF6D8");g.addColorStop(1,"#F6B860");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x,y-92);ctx.bezierCurveTo(x-11,y-104,x-8*f+sway,y-128*f,x+sway,y-92-56*f);ctx.bezierCurveTo(x+8*f+sway,y-128*f,x+11,y-104,x,y-92);ctx.fill();ctx.restore();}
// a small clockwork figure on the desk: a figure on a wind-up base, its key turning
function tt_automaton(ctx,x,y,t,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x,y+4,46,8,0.3);
  ag_soft(ctx,cc=>ag_rect(cc,x-40,y-26,80,26,4),[150,120,70],[210,180,120],x+20,y-22,60,"rgba(30,20,10,0.4)",6);
  const sw=Math.sin(t*2.2)*0.12;ctx.save();ctx.translate(x,y-26);ctx.rotate(sw);ag_soft(ctx,cc=>{cc.moveTo(-14,0);cc.lineTo(14,0);cc.lineTo(9,-56);cc.lineTo(-9,-56);cc.closePath();},[176,150,96],[226,200,140],6,-40,40,"rgba(30,20,10,0.35)",5);
  ag_soft(ctx,cc=>cc.arc(0,-68,13,0,TAU),[196,170,116],[236,214,160],4,-72,16,"rgba(30,20,10,0.3)",4);ctx.strokeStyle="#9A7A44";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-9,-46);ctx.lineTo(-26,-30+Math.sin(t*4)*6);ctx.moveTo(9,-46);ctx.lineTo(26,-30-Math.sin(t*4)*6);ctx.stroke();ctx.restore();
  ctx.save();ctx.translate(x+40,y-13);ctx.rotate(t*1.4);ctx.strokeStyle="#8A6A3A";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(9,0);ctx.stroke();ctx.restore();ctx.restore();}

// an oak table top seen from above, for the three hands drawing
AG_PLACES.tt_tableTop=c=>{const tex=ag_oakTex();c.save();c.translate(W/2,H/2);c.rotate(Math.PI/2);c.drawImage(tex,-H/2-200,-W/2-80,1500,W+160);c.restore();
  const g=c.createRadialGradient(1100,300,100,960,540,1200);g.addColorStop(0,"rgba(255,250,240,0.12)");g.addColorStop(1,"rgba(30,24,18,0.22)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// the module's room with quieter marble where the question cards hang, across the top
AG_PLACES.tt_labCards=c=>ag_paintLab(c,{quiet:[[960,270,900,190,0.7],[480,90,420,46,0.3],[1124,476,250,210,0.4]]});
// the module's room, its marble quietest in the middle: for the pictures of the questions, drawn on the wall
AG_PLACES.tt_labQuiet=c=>ag_paintLab(c,{quiet:[[960,380,1100,420,0.85],[480,90,420,46,0.4]]});

/* ===== What they tell us about ourselves: the pictures that carry the ideas =====
   Drawn live, in the frame's coordinates (1920 x 1080), each a function of where it stands, its size and how far it has come (0 to 1).
   Living things (the ear's spiral, the brain, a neuron, the worm, the fly) are warm and matte, drawn with tapering curves, weight and
   light; the copies (the implant's wire, the perceptron, the network, the worm on a screen, the fly's model) are blue lines, so the
   original and the copy are never confused. What it feels like (Rod hearing, Margaret's voice reaching him) is the window's warm light,
   which belongs to no colour that means something. */

const TT_WARM=[255,226,178],TT_TISSUE=[226,184,170],TT_BONE=[232,224,210];
// a tapering line through points [[x, y], ...], from width w0 to w1, filled (part of nothing else: it begins its own path)
function tt_taper(ctx,pts,w0,w1,fill){const n=pts.length;if(n<2)return;const L=[],R=[];
  for(let i=0;i<n;i++){const p=pts[i],q=pts[Math.min(n-1,i+1)],o=pts[Math.max(0,i-1)],dx=q[0]-o[0],dy=q[1]-o[1],d=Math.hypot(dx,dy)||1,w=lerp(w0,w1,i/(n-1))/2;
    L.push([p[0]-dy/d*w,p[1]+dx/d*w]);R.push([p[0]+dy/d*w,p[1]-dx/d*w]);}
  ctx.beginPath();ctx.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)ctx.lineTo(L[i][0],L[i][1]);const e=pts[n-1],a=Math.atan2(e[1]-pts[n-2][1],e[0]-pts[n-2][0]);
  ctx.arc(e[0],e[1],Math.max(0.3,w1/2),a-Math.PI/2,a+Math.PI/2);for(let i=n-1;i>=0;i--)ctx.lineTo(R[i][0],R[i][1]);const s0=pts[0],b=Math.atan2(pts[1][1]-s0[1],pts[1][0]-s0[0]);
  ctx.arc(s0[0],s0[1],w0/2,b+Math.PI/2,b+Math.PI*1.5);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}}
// points along a cubic [x0,y0, x1,y1, x2,y2, x3,y3] from u0 to u1
function tt_bzPts(p,u0,u1,n){const out=[];n=n||16;for(let k=0;k<=n;k++)out.push(ag_bz(p,lerp(u0,u1,k/n)));return out;}
// the window's warm light: a soft glow at (x, y), radius r
function tt_glow(ctx,x,y,r,a,col){if(a<=0)return;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col||TT_WARM,0.55*a));g.addColorStop(0.45,rgba(col||TT_WARM,0.22*a));g.addColorStop(1,rgba(col||TT_WARM,0));
  ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}

/* ---------------------------------------------------------------- the living room's sounds, and the voices */
// soft waves of sound from a source at (x, y) towards dir (radians): three short arcs close together, moving out and fading,
// so they never reach Rod; o.per the beat, o.gap the space between arcs
function tt_rings(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const per=o.per||1.2,gap=o.gap||30,n=3,dir=o.dir||0,sp=o.spread||1.0,col=o.col||[176,132,84],r0=o.r0||22;
  const u=((t/per)%1+1)%1;ctx.save();ctx.lineCap="round";ctx.shadowColor=rgba([255,226,170],0.7);ctx.shadowBlur=8;
  for(let k=0;k<n;k++){const v=k+u,r=r0+v*gap,al=a*clamp(v,0,1)*clamp(n-v,0,1)*(o.k||0.85);if(al<=0.01)continue;
    ctx.strokeStyle=rgba(col,al);ctx.lineWidth=lerp(5,3,v/n);ctx.beginPath();ctx.arc(x,y,r,dir-sp/2,dir+sp/2);ctx.stroke();}ctx.restore();}
// the kettle on the stove, base at (x, y); o.steam 0 to 1
function tt_kettle(ctx,x,y,t,o){o=o||{};ctx.save();ag_floorShadow(ctx,x,y,46,7,0.3);
  ag_soft(ctx,cc=>{cc.moveTo(x-40,y);cc.bezierCurveTo(x-46,y-30,x-34,y-62,x,y-64);cc.bezierCurveTo(x+34,y-62,x+46,y-30,x+40,y);cc.closePath();},[196,196,190],[250,250,246],x+14,y-46,50,"rgba(40,40,40,0.35)",8);
  ctx.strokeStyle="#9C9A94";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+36,y-24);ctx.quadraticCurveTo(x+60,y-40,x+66,y-58);ctx.stroke();
  ctx.strokeStyle="#3E3B36";ctx.lineWidth=8;ctx.beginPath();ctx.arc(x,y-62,30,Math.PI*1.12,Math.PI*1.88);ctx.stroke();
  const st=o.steam||0;if(st>0){for(let i=0;i<4;i++){const u=((t*0.5+i/4)%1),sx=x+66+Math.sin(t*1.7+i)*6+u*20,sy=y-60-u*90;ctx.fillStyle=rgba([250,248,244],st*0.5*(1-u)*Math.min(1,u*4));ctx.beginPath();ctx.ellipse(sx,sy,8+u*14,6+u*10,0,0,TAU);ctx.fill();}}
  ctx.restore();}
// the telephone on its table, base at (x, y); o.ring 0 to 1 shakes it a little
function tt_phone(ctx,x,y,t,o){o=o||{};const rg=o.ring||0,sh=rg*Math.sin(t*46)*0.03*(Math.sin(t*5.3)>0?1:0.2);ctx.save();ctx.translate(x,y);ctx.rotate(sh);ag_floorShadow(ctx,0,0,62,8,0.3);
  ag_soft(ctx,cc=>{cc.moveTo(-58,0);cc.lineTo(-44,-50);cc.lineTo(44,-50);cc.lineTo(58,0);cc.closePath();},[164,150,112],[214,202,166],20,-40,60,"rgba(40,30,20,0.35)",8);
  ctx.fillStyle="#E9E3D2";ctx.beginPath();ctx.arc(0,-24,19,0,TAU);ctx.fill();ctx.fillStyle="rgba(90,80,60,0.5)";for(let i=0;i<10;i++){const a=-Math.PI*0.2+i*0.52;ctx.beginPath();ctx.arc(Math.cos(a)*12,-24+Math.sin(a)*12,2.6,0,TAU);ctx.fill();}
  ag_soft(ctx,cc=>{cc.moveTo(-64,-50);cc.bezierCurveTo(-70,-70,-50,-78,-34,-66);cc.lineTo(34,-66);cc.bezierCurveTo(50,-78,70,-70,64,-50);cc.lineTo(42,-52);cc.lineTo(-42,-52);cc.closePath();},[150,136,100],[206,192,154],10,-70,70,"rgba(40,30,20,0.3)",6);
  ctx.restore();}
// a speech bubble from (x, y) to (x + w, y + h), its tail to (tx, ty); o.fill 0 (an empty outline) to 1 (soft lines of words), o.k springs it
function tt_bubble(ctx,x,y,w,h,tx,ty,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const f=clamp(o.fill||0,0,1),r=Math.min(h/2,28),cx=x+w/2;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,tx,ty,lerp(0.6,1,o.k));
  const bx=clamp(tx,x+r+20,x+w-r-20),side=ty>y+h?1:-1,ey=side>0?y+h:y;
  const path=c=>{c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.arcTo(x+w,y,x+w,y+r,r);c.lineTo(x+w,y+h-r);c.arcTo(x+w,y+h,x+w-r,y+h,r);
    if(side>0){c.lineTo(bx+18,y+h);c.lineTo(tx,ty);c.lineTo(bx-18,y+h);}c.lineTo(x+r,y+h);c.arcTo(x,y+h,x,y+h-r,r);c.lineTo(x,y+r);c.arcTo(x,y,x+r,y,r);c.closePath();};
  ctx.save();ctx.shadowColor=rgba([255,214,150],0.6);ctx.shadowBlur=18;ctx.beginPath();path(ctx);ctx.fillStyle=rgba([255,246,228],0.16+0.8*f);ctx.fill();ctx.restore();
  ctx.beginPath();path(ctx);ctx.strokeStyle=rgba([196,150,92],0.85);ctx.lineWidth=3.5;ctx.stroke();ctx.strokeStyle="rgba(255,250,236,0.8)";ctx.lineWidth=1.5;ctx.stroke();
  if(f>0){ctx.fillStyle=rgba([176,132,84],0.55*f);const rows=Math.max(1,Math.floor((h-24)/22));for(let i=0;i<rows;i++){const lw=(w-56)*(i===rows-1?0.6:1)*Math.min(1,f*1.6-i*0.2);if(lw<=0)continue;rr(ctx,x+28,y+18+i*22+(h-24-rows*22)/2,lw,10,5);ctx.fill();}}
  ctx.restore();}
// a small bracket of light round a mouth at (x, y): reading lips
function tt_lips(ctx,x,y,s,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.shadowColor=rgba(TT_WARM,0.9);ctx.shadowBlur=10;ctx.strokeStyle=rgba([255,236,196],0.95);ctx.lineWidth=3.5;
  for(const k of [-1,1]){ctx.beginPath();ctx.arc(x,y,28*s,k<0?Math.PI*0.72:-Math.PI*0.28,k<0?Math.PI*1.28:Math.PI*0.28);ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- a memory: a soft-edged card */
// draw(c, w, h) paints the memory in its own w x h space; it is shown at (x, y) with soft, feathered edges, a little faded
function tt_memory(ctx,x,y,w,h,key,draw,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const [bc,bx]=ag_buf("mem:"+key,w,h);draw(bx,w,h);
  bx.fillStyle="rgba(250,238,218,0.22)";bx.fillRect(0,0,w,h);
  const mask=ag_kept("memMask:"+w+"x"+h,w,h,(c)=>{const f=Math.min(w,h)*0.09;c.filter="blur("+Math.round(f*0.55)+"px)";c.fillStyle="#000";rr(c,f,f,w-2*f,h-2*f,f);c.fill();c.filter="none";});
  bx.globalCompositeOperation="destination-in";bx.drawImage(mask,0,0);bx.globalCompositeOperation="source-over";
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.85,1,o.k));
  ctx.save();ctx.globalAlpha*=0.5;ctx.shadowColor="rgba(46,38,28,0.35)";ctx.shadowBlur=40;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=12;ctx.drawImage(bc,x,y);ctx.restore();
  ctx.drawImage(bc,x,y);ctx.restore();}
// a hand cupped behind an ear, over a person drawn at (x, y, s): the hand's own shape, painted over the head
function tt_cupEar(ctx,who,x,y,s,flip){const F=ag_fig(who),P=F.P,C=F.C;ctx.save();ctx.translate(x,y);ctx.scale(flip?-s:s,s);ctx.translate(-AG_FIG.anchor[0],-AG_FIG.anchor[1]);
  ctx.translate(AG_FACE.ear[0]-266,0);   // drawn round an ear at x 266; the ear is at AG_FACE.ear
  const sk=P.skin;ag_soft(ctx,cc=>{cc.moveTo(250,512);cc.bezierCurveTo(228,486,214,446,220,404);cc.bezierCurveTo(224,378,240,362,252,366);cc.bezierCurveTo(262,370,258,392,254,410);
      cc.bezierCurveTo(262,388,272,372,282,378);cc.bezierCurveTo(290,384,284,404,276,420);cc.bezierCurveTo(272,446,274,478,282,512);cc.closePath();},
    mix(sk,ag_dk(sk,0.4),0.12),mix(sk,[255,240,228],0.4),262,400,90,C.skinShade,8);
  ctx.strokeStyle=rgba(mix(sk,[70,24,14],0.5),0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(244,404);ctx.quadraticCurveTo(250,430,256,452);ctx.stroke();
  // the sleeve, coming up from below
  ag_soft(ctx,cc=>{cc.moveTo(236,640);cc.bezierCurveTo(236,590,240,540,248,506);cc.lineTo(286,508);cc.bezierCurveTo(292,550,300,600,306,650);cc.closePath();},ag_dk(P.top.c,0.1),ag_lt(P.top.c,0.3),290,540,120,rgba(ag_dk(P.top.c,0.8),0.4),12);
  ctx.restore();}
// the pharmacy of Clark's boyhood, a memory: a man behind the counter cupping his ear, a customer leaning in, a boy at the end, watching
function tt_pharmacy(c,w,h,t,o){o=o||{};let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"#E6DCC6");g.addColorStop(1,"#D7CBB2");c.fillStyle=g;c.fillRect(0,0,w,h);
  // shelves of bottles and jars behind the counter
  const R=ag_rnd(21);for(const sy of [120,214,308]){c.fillStyle="#8E7356";c.fillRect(40,sy,w-80,10);c.fillStyle="rgba(40,30,20,0.18)";c.fillRect(40,sy+10,w-80,6);
    for(let x=56;x<w-70;){const bw=18+R()*22,bh=34+R()*40,col=[[150,108,70],[118,138,112],[226,222,210],[176,150,110],[132,120,140]][(R()*5)|0];
      c.fillStyle=rgba(col,0.92);rr(c,x,sy-bh,bw,bh,5);c.fill();c.fillStyle="rgba(255,255,255,0.3)";c.fillRect(x+4,sy-bh+6,3,bh-12);c.fillStyle="rgba(60,50,40,0.5)";c.fillRect(x+bw*0.25,sy-bh-6,bw*0.5,7);x+=bw+6+R()*8;}}
  const ct=372;   // the counter's top
  // the pharmacist, behind the counter, facing the customer, his hand cupped behind his ear; the boy at the end of the counter
  ag_person(c,TT_PHARM,600,318,0.5,{t,flip:true,covered:true,nod:0.06,gaze:[2,1]});tt_cupEar(c,TT_PHARM,600,318,0.5,true);
  ag_person(c,TT_BOY,850,396,0.38,{t:t+0.7,flip:true,covered:true,gaze:[-2,0],smile:0.2});
  // the counter
  g=c.createLinearGradient(0,ct,0,h);g.addColorStop(0,"#9A7552");g.addColorStop(1,"#6E5038");c.fillStyle=g;c.fillRect(0,ct,w,h-ct);c.fillStyle="#B48C64";c.fillRect(0,ct-14,w,18);c.fillStyle="rgba(255,240,220,0.25)";c.fillRect(0,ct-14,w,3);
  c.strokeStyle="rgba(40,26,14,0.35)";c.lineWidth=3;for(let x=60;x<w;x+=200)c.strokeRect(x,ct+30,160,h-ct-30);
  // the customer, in front of the counter, leaning in to speak up
  c.save();c.translate(250,560);c.rotate(0.13);c.translate(-250,-560);ag_person(c,TT_CUST,250,330,0.56,{t:t+1.4,covered:true,talk:o.talk==null?0.5:o.talk,gaze:[3,0]});c.restore();}

/* ---------------------------------------------------------------- the inner ear, and the implant
   The cochlea's spiral, seen in a cutaway: a warm tube winding two and a half turns, from its base (bottom left, where sound and the
   implant's wire come in) to its tip, lined with thousands of tiny cells. The implant: a fine blue wire winding in, ten small rings
   along its tip. */
const TT_SP={turns:2.6,k:0.112,base:Math.PI*0.86};
function tt_spPt(R,th){const r=R*Math.exp(-TT_SP.k*th),a=TT_SP.base+th;return[Math.cos(a)*r,Math.sin(a)*r,r,a];}
// the tube, kept as a picture for a size (and grey for the card)
function tt_spTube(R,grey){const S=Math.ceil(R*2.5);return ag_kept("tt_sp:"+R+":"+(grey?1:0),S,S,c=>{c.translate(S/2,S/2);const n=360,thM=TT_SP.turns*TAU,col=grey?[204,202,198]:TT_TISSUE;
  const pts=[];for(let i=0;i<=n;i++){const th=thM*i/n;pts.push(tt_spPt(R,th));}
  const W=p=>p[2]*0.42,off=(k,wk)=>pts.map(p=>[p[0]+Math.cos(p[3])*W(p)*k,p[1]+Math.sin(p[3])*W(p)*k]),line=pts.map(p=>[p[0],p[1]]);
  // a soft shadow under it, then the tube; light along its outer side (towards the window), shade along its inner side
  c.save();c.shadowColor="rgba(60,40,30,0.34)";c.shadowBlur=R*0.06;c.shadowOffsetX=-R*0.02;c.shadowOffsetY=R*0.035;tt_taper(c,line,W(pts[0]),W(pts[n]),rgba(mix(col,[90,50,40],0.1),1));c.restore();
  c.save();c.beginPath();tt_taper(c,line,W(pts[0]),W(pts[n]));c.clip();
  c.filter="blur("+Math.max(1,Math.round(R*0.012))+"px)";
  tt_taper(c,off(0.26),W(pts[0])*0.34,W(pts[n])*0.34,rgba(mix(col,[255,246,236],0.6),0.7));
  tt_taper(c,off(-0.4),W(pts[0])*0.3,W(pts[n])*0.3,rgba(mix(col,[80,40,30],0.45),0.45));c.filter="none";c.restore();
  // a thin membrane line along the middle, where the cells sit
  c.strokeStyle=rgba(mix(col,[90,50,40],0.3),0.35);c.lineWidth=Math.max(1,R*0.004);c.beginPath();off(-0.02).forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  // the base's opening, where things come in
  const b=pts[0];c.fillStyle=rgba(mix(col,[70,40,30],0.35),1);c.beginPath();c.ellipse(b[0],b[1],W(b)*0.46,W(b)*0.2,b[3]+Math.PI/2,0,TAU);c.fill();});}
// the cells along the tube, as thousands of tiny dots: one picture faint, one bright
function tt_spDots(R,bright){const S=Math.ceil(R*2.5);return ag_kept("tt_spd:"+R+":"+(bright?1:0),S,S,c=>{c.translate(S/2,S/2);const thM=TT_SP.turns*TAU,rows=[-0.16,-0.04,0.06,0.15];
  let th=0.05;const col=bright?[255,250,236]:[140,92,80];c.fillStyle=rgba(col,bright?1:0.7);if(bright){c.shadowColor=rgba(TT_WARM,0.9);c.shadowBlur=4;}
  while(th<thM-0.05){const p=tt_spPt(R,th),w=p[2]*0.42,nx=Math.cos(p[3]),ny=Math.sin(p[3]),d=Math.max(0.9,R*0.0055*(p[2]/R*0.6+0.4));
    for(const k of rows){c.beginPath();c.arc(p[0]+nx*w*k,p[1]+ny*w*k,d,0,TAU);c.fill();}th+=Math.max(0.006,R*0.0105/p[2]);}});}
// the spiral at (x, y), size R: o.dots 0 to 1 (faint), o.bright 0 to 1, o.wire 0 to 1 (how far it has wound in), o.rings 0 to 10 (each
// springs into place), o.lit 0 to 10 (each lights), o.grey, o.a; returns the rings' places and the wire's tip
const TT_WIRE={turns:1.35,gap:0.36};
function tt_spiral(ctx,x,y,R,o){o=o||{};const a=o.a==null?1:o.a,res={rings:[],tip:null,base:null};if(a<=0)return res;ctx.save();ctx.globalAlpha*=a;
  const tube=tt_spTube(R,o.grey),S=tube.width;ctx.drawImage(tube,x-S/2,y-S/2);
  if(o.dots>0){ctx.save();ctx.globalAlpha*=o.dots*(1-(o.bright||0));ctx.drawImage(tt_spDots(R,false),x-S/2,y-S/2);ctx.restore();}
  if(o.bright>0){ctx.save();ctx.globalAlpha*=o.bright;ctx.drawImage(tt_spDots(R,true),x-S/2,y-S/2);ctx.restore();}
  const P=th=>{const p=tt_spPt(R,th),w=p[2]*0.42*0.18;return[x+p[0]+Math.cos(p[3])*w,y+p[1]+Math.sin(p[3])*w,p[3]];};
  res.base=P(0);const wu=clamp(o.wire||0,0,1);
  if(wu>0){const thE=TT_WIRE.turns*TAU*wu,n=Math.max(2,Math.ceil(thE/0.06)),pts=[];
    // the lead from outside, to the opening at the base
    const b=P(0),out=[b[0]-R*0.5,b[1]+R*0.44];for(let i=0;i<=12;i++){const u=i/12;pts.push([lerp(out[0],b[0],u)+Math.sin(u*Math.PI)*R*0.06,lerp(out[1],b[1],u)]);}
    for(let i=1;i<=n;i++){const q=P(thE*i/n);pts.push([q[0],q[1]]);}
    ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=rgba(mix(AG.blue,[20,30,40],0.3),0.5);ctx.lineWidth=Math.max(3,R*0.024);ctx.translate(AG.sdx*0.3,2);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore();
    ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=rgba(AG.blue,1);ctx.lineWidth=Math.max(3,R*0.02);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    ctx.strokeStyle="rgba(200,230,245,0.7)";ctx.lineWidth=Math.max(1,R*0.006);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0]-0.8,p[1]-0.8):ctx.moveTo(p[0]-0.8,p[1]-0.8));ctx.stroke();
    res.tip=pts[pts.length-1];
    // ten rings along the tip: each settles into place, then lights
    const thT=TT_WIRE.turns*TAU;for(let i=0;i<10;i++){const th=thT-(9-i)*TT_WIRE.gap;if(th>thE+0.001)continue;const q=P(th),k=clamp((o.rings||0)-i,0,1);res.rings.push([q[0],q[1]]);if(k<=0)continue;
      const kk=ag_spr(k,0,0.55),L=Math.max(10,R*0.064)*lerp(1.8,1,kk),wd=Math.max(4,R*0.022),lit=clamp((o.lit||0)-i,0,1);
      ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(q[2]);ctx.globalAlpha*=clamp(k*2,0,1);
      if(lit>0){ctx.save();ctx.globalCompositeOperation="lighter";const g=ctx.createRadialGradient(0,0,0,0,0,L*1.7);g.addColorStop(0,rgba([170,220,250],0.7*lit));g.addColorStop(1,rgba([170,220,250],0));ctx.fillStyle=g;ctx.fillRect(-L*1.7,-L*1.7,L*3.4,L*3.4);ctx.restore();}
      ctx.fillStyle=rgba(mix(mix(AG.blue,[220,226,230],0.55),[236,250,255],lit),1);rr(ctx,-L/2,-wd/2,L,wd,wd/2);ctx.fill();ctx.strokeStyle=rgba(mix(AG.blue,[20,30,40],0.4),0.7);ctx.lineWidth=1.2;ctx.stroke();ctx.restore();}}
  ctx.restore();return res;}

/* ---------------------------------------------------------------- a calm brain, side view, facing right (o.flip: left)
   A warm matte form: the cerebrum with its folds drawn as tapering lines, the cerebellum under its back, the brainstem. s = 1 is
   about 400 x 320 px. o.glow: warm light inside; o.sweep {u, a}: a fine, fast shimmer sweeping front to back (u 0 to 1 across);
   o.outline: only its outline (and o.centre a bright centre sending lines to every part); o.a. */
const TT_BRAIN={cereb(c){c.moveTo(150,34);c.bezierCurveTo(196,14,204,-58,172,-100);c.bezierCurveTo(140,-142,80,-162,10,-160);c.bezierCurveTo(-72,-160,-150,-130,-186,-70);
    c.bezierCurveTo(-212,-28,-206,22,-178,44);c.bezierCurveTo(-150,62,-104,60,-62,56);c.bezierCurveTo(-14,84,60,96,104,72);c.bezierCurveTo(126,60,128,44,118,38);c.bezierCurveTo(128,32,140,32,150,34);c.closePath();},
  cbl(c){c.moveTo(-182,52);c.bezierCurveTo(-196,80,-170,118,-122,120);c.bezierCurveTo(-84,122,-62,104,-64,80);c.bezierCurveTo(-90,64,-150,58,-182,52);c.closePath();},
  stem(c){c.moveTo(-66,70);c.bezierCurveTo(-58,100,-56,140,-62,176);c.lineTo(-30,176);c.bezierCurveTo(-30,140,-26,104,-14,80);c.closePath();},
  sulci:[[84,-152,74,-110,64,-60,52,-22],[84,-112,110,-104,140,-100,166,-88],[70,-58,100,-50,140,-48,172,-40],[118,-150,126,-138,134,-126,142,-118],[150,-74,160,-70,170,-64,180,-58],[98,-20,112,-12,126,-6,142,2],[122,12,132,14,142,18,152,22],[60,-150,64,-136,60,-124,56,-114],
    [-10,-158,-18,-110,-26,-60,-36,-22],[-28,-100,-60,-96,-100,-90,-132,-78],[-132,-78,-146,-70,-156,-56,-162,-40],[-60,-152,-66,-142,-74,-130,-82,-120],[-100,-142,-106,-132,-112,-120,-118,-110],[-70,-60,-80,-52,-90,-46,-102,-40],
    [-150,-60,-164,-50,-178,-40,-192,-30],[-160,10,-172,6,-184,2,-196,0],[-140,30,-150,34,-160,38,-172,42],[92,54,40,40,-30,20,-110,2],[62,78,10,70,-50,56,-132,40],[18,40,10,48,0,54,-10,62],[-80,30,-86,38,-92,44,-100,50],[150,-112,158,-100,164,-90,170,-80],
    [104,-136,112,-126,116,-114,118,-104],[132,-36,144,-30,156,-26,168,-22],[20,-130,26,-120,28,-108,26,-96],[-44,-130,-50,-118,-52,-104,-50,-92],[-120,-30,-130,-22,-140,-16,-150,-12],[-30,40,-40,46,-50,48,-62,48],[40,20,46,28,48,36,48,44],[-176,-80,-184,-66,-188,-52,-190,-40],[-90,-110,-80,-100,-74,-88,-70,-76],[120,-60,126,-50,128,-38,128,-26]],
  folds:[[[104,40],[40,10],[-50,-8]],[[40,-158],[20,-80],[0,8]],[[78,-150],[62,-90],[36,-24]],[[-6,-158],[-24,-90],[-44,-20]],[[120,-120],[110,-70],[88,-10]],[[160,-60],[130,-30],[120,10]],
    [[-70,-150],[-80,-100],[-110,-60]],[[-140,-110],[-120,-60],[-150,-10]],[[-100,-30],[-60,-20],[-60,30]],[[30,40],[-10,30],[-40,40]],[[70,60],[30,62],[-10,56]],[[-170,0],[-140,20],[-110,30]]]};
// the brain's picture, kept: its folds are short meandering grooves (seeded), the two deep ones drawn on purpose
const TT_BK=1.6;
function tt_brainPic(col){const key=col.join(",");return ag_kept("tt_brain:"+key,760,640,c=>{c.translate(380,300);c.scale(TT_BK,TT_BK);const base=col;
  ag_soft(c,TT_BRAIN.stem,ag_dk(base,0.14),ag_lt(base,0.3),-40,90,60,"rgba(90,50,40,0.3)",8);
  ag_soft(c,TT_BRAIN.cbl,ag_dk(base,0.08),ag_lt(base,0.35),-120,70,80,"rgba(90,50,40,0.3)",10);
  c.save();ag_shape(c,TT_BRAIN.cbl);c.clip();c.strokeStyle=rgba(ag_dk(base,0.4),0.32);c.lineWidth=1.6;for(let i=0;i<9;i++){c.beginPath();c.moveTo(-200,58+i*7.5);c.quadraticCurveTo(-130,72+i*8.5,-60,66+i*7.5);c.stroke();}c.restore();
  c.save();c.shadowColor="rgba(80,46,36,0.3)";c.shadowBlur=20;c.shadowOffsetX=-5;c.shadowOffsetY=10;ag_shape(c,TT_BRAIN.cereb);c.fillStyle=rgba(base,1);c.fill();c.restore();
  ag_soft(c,TT_BRAIN.cereb,base,ag_lt(base,0.45),90,-110,280,"rgba(90,50,40,0.32)",20,0.55);
  c.save();ag_shape(c,TT_BRAIN.cereb);c.clip();const dark=rgba(ag_dk(base,0.34),0.5),lite=rgba(ag_lt(base,0.55),0.5);
  let gi=0;const groove=(q,w0,w1)=>{const raw=tt_bzPts(q,0,1,24);let len=0;for(let i=1;i<raw.length;i++)len+=Math.hypot(raw[i][0]-raw[i-1][0],raw[i][1]-raw[i-1][1]);
    const cyc=len/52,amp=2.6*clamp((len-30)/70,0,1),ph=gi++*1.7;
    const pts=raw.map((p,i)=>{const a=raw[Math.max(0,i-1)],b=raw[Math.min(raw.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,w=Math.sin(i/(raw.length-1)*TAU*cyc+ph)*amp;return[p[0]-dy/d*w,p[1]+dx/d*w];});
    tt_taper(c,pts,w0,w1,dark);c.save();c.translate(1.5,-2);tt_taper(c,pts,w0*0.45,w1*0.45,lite);c.restore();};
  // the deep grooves: the lateral one, and the central one; then the lobes' own folds, as anatomy draws them
  groove([106,36,60,10,0,-4,-58,-14],7,2);groove([38,-158,26,-100,18,-40,6,8],6,1.6);
  for(const q of TT_BRAIN.sulci)groove(q,4.4,1.3);
  c.restore();});}
function tt_brain(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);
  if(o.outline){ctx.lineJoin="round";ctx.strokeStyle=rgba(o.col||AG.ink,0.55);ctx.lineWidth=3/s;ctx.beginPath();TT_BRAIN.cereb(ctx);ctx.stroke();ctx.beginPath();TT_BRAIN.cbl(ctx);ctx.stroke();ctx.beginPath();TT_BRAIN.stem(ctx);ctx.stroke();
    ctx.restore();ctx.restore();return;}
  const pic=tt_brainPic(o.col||[226,198,188]);ctx.drawImage(pic,-380/TT_BK,-300/TT_BK,760/TT_BK,640/TT_BK);
  ctx.save();ag_shape(ctx,TT_BRAIN.cereb);ctx.clip();
  // light from inside
  if(o.glow>0){ctx.globalCompositeOperation="lighter";const g=ctx.createRadialGradient(0,-40,10,0,-40,230);g.addColorStop(0,rgba(TT_WARM,0.42*o.glow));g.addColorStop(1,rgba(TT_WARM,0));ctx.fillStyle=g;ctx.fillRect(-240,-260,480,420);ctx.globalCompositeOperation="source-over";}
  // a fine shimmer sweeping through it, front to back: a soft band of light with fine lines in it
  if(o.sweep&&o.sweep.a>0){const u=o.sweep.u,cx=lerp(240,-250,u),sa=o.sweep.a;ctx.globalCompositeOperation="screen";const g=ctx.createLinearGradient(cx-90,0,cx+90,0);
    g.addColorStop(0,"rgba(255,244,222,0)");g.addColorStop(0.5,rgba([255,240,214],0.8*sa));g.addColorStop(1,"rgba(255,244,222,0)");ctx.fillStyle=g;ctx.fillRect(cx-90,-200,180,320);
    ctx.lineWidth=1.1;for(let i=-5;i<=5;i++){const xx=cx+i*9,al=0.8*sa*(1-Math.abs(i)/6);ctx.strokeStyle=rgba([255,244,224],al);ctx.beginPath();ctx.moveTo(xx,-180);ctx.bezierCurveTo(xx+12,-90,xx-12,0,xx+4,100);ctx.stroke();}ctx.globalCompositeOperation="source-over";}
  ctx.restore();ctx.restore();}
// a bright centre in a brain's outline sending lines to every part at once (u 0 to 1 how far they've gone)
function tt_broadcast(ctx,x,y,s,u,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);const pts=[[150,-60],[110,-130],[30,-150],[-60,-150],[-140,-110],[-180,-40],[-160,30],[-80,40],[0,60],[80,50],[160,10],[-120,-60],[60,-80],[-20,-60]];
  ctx.lineCap="round";for(const p of pts){const q=[lerp(0,p[0],u),lerp(-40,p[1],u)];ctx.strokeStyle=rgba([255,214,140],0.8);ctx.lineWidth=3/s;ctx.beginPath();ctx.moveTo(0,-40);ctx.lineTo(q[0],q[1]);ctx.stroke();
    if(u>0.95){ctx.fillStyle=rgba([255,232,190],1);ctx.beginPath();ctx.arc(p[0],p[1],5/s,0,TAU);ctx.fill();}}
  ctx.restore();tt_glow(ctx,x,y-40*s,70*s,a);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="#FFF6E2";ctx.beginPath();ctx.arc(x,y-40*s,12*s,0,TAU);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the card of why a hearing aid couldn't help, and the pulses of 1966 */
// a sound wave from x0 to x1 at y, amp high, moving with t
function tt_wave(ctx,x0,x1,y,amp,t,col,lw,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.lineWidth=lw||3;ctx.lineCap="round";ctx.beginPath();
  for(let i=0;i<=60;i++){const u=i/60,xx=lerp(x0,x1,u),e=Math.sin(Math.PI*u);ctx.lineTo(xx,y+Math.sin(u*TAU*3-t*6)*amp*e);}ctx.stroke();ctx.restore();}
// a small hearing aid that sits behind the ear: a curved case and its hook
function tt_aid(ctx,x,y,s,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ag_soft(ctx,cc=>{cc.moveTo(-14,40);cc.bezierCurveTo(-30,10,-26,-34,0,-46);cc.bezierCurveTo(18,-52,26,-40,20,-26);cc.bezierCurveTo(10,-6,10,22,14,40);cc.bezierCurveTo(8,52,-6,52,-14,40);cc.closePath();},[206,190,170],[246,238,226],10,-30,40,"rgba(60,40,30,0.3)",6);
  ctx.strokeStyle="#B9A890";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(4,-46);ctx.bezierCurveTo(16,-70,44,-66,48,-40);ctx.stroke();ctx.restore();}
// the card: a wave, a hearing aid, a bigger wave, the grey spiral, and a line to the brain that stops short. o.p 0 to 1 reveals it in
// that order; o.pulses 0 to 1: a row of small pulses runs to the brain; o.q 0 to 1, a soft question mark between them. Returns its box.
function tt_aidCard(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a,w=1180,h=300;if(a<=0)return{x,y,w,h};const p=o.p==null?1:o.p;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,24,{});const cy=y+h/2,st=u=>clamp((p-u)/0.18,0,1);
  tt_wave(ctx,x+50,x+210,cy,16,t,rgba([110,96,80],0.85),3,st(0));
  tt_aid(ctx,x+280,cy,1,st(0.15));
  tt_wave(ctx,x+340,x+560,cy,40,t,rgba([110,96,80],0.85),4,st(0.3));
  tt_spiral(ctx,x+680,cy,92,{grey:true,dots:0.5,a:st(0.45)});
  tt_brain(ctx,x+1030,cy+6,0.32,{a:st(0.62),col:[214,206,198]});
  // the line from the spiral towards the brain, stopping short, with a gap
  const lu=st(0.75);if(lu>0){ctx.save();ctx.lineCap="round";ctx.strokeStyle=rgba([150,140,130],0.9);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+790,cy);ctx.lineTo(x+790+lu*70,cy);ctx.stroke();
    ctx.setLineDash([2,12]);ctx.strokeStyle=rgba([150,140,130],0.5*lu);ctx.beginPath();ctx.moveTo(x+872,cy);ctx.lineTo(x+944,cy);ctx.stroke();ctx.restore();}
  // 1966: a row of small electric pulses runs from the spiral towards the brain, and a question mark hangs between them
  const pu=o.pulses||0;if(pu>0){for(let i=0;i<6;i++){const u=((t*0.55+i/6)%1),px=lerp(x+760,x+930,u),al=pu*Math.sin(Math.PI*u);ctx.fillStyle=rgba(AG.blue,al);rr(ctx,px-4,cy-38,8,30,3);ctx.fill();}}
  if(o.q>0)ag_T(ctx,"?",x+905,cy-60,{w:700,size:48,align:"center",col:AG.mut,a:o.q});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- Rod's implant, the lab's lead, and his brain doing the rest */
// the implant under the skin behind his left ear, over Rod drawn facing left at (x, y, s): a soft outline of the receiver, and the blue
// wire curling inwards to a small spiral; o.a, o.wire 0 to 1 (how far the wire is drawn), o.pulse 0 to 1 (blue pulses along it), o.t
function tt_implant(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const E=tt_ear(x,y,s,true),k=s;ctx.save();ctx.globalAlpha*=a;
  const rc=[E[0]+50*k,E[1]-62*k];
  // the receiver: a soft rounded outline under the skin
  ctx.save();ctx.shadowColor="rgba(255,240,220,0.8)";ctx.shadowBlur=8*k;ctx.strokeStyle=rgba([140,100,88],0.7);ctx.lineWidth=2.6*k;ctx.setLineDash([8*k,5*k]);ctx.beginPath();ctx.ellipse(rc[0],rc[1],30*k,25*k,-0.3,0,TAU);ctx.stroke();ctx.restore();
  ctx.fillStyle=rgba([150,110,96],0.16);ctx.beginPath();ctx.ellipse(rc[0],rc[1],30*k,25*k,-0.3,0,TAU);ctx.fill();ctx.fillStyle=rgba([140,100,88],0.35);ctx.beginPath();ctx.arc(rc[0],rc[1],7*k,0,TAU);ctx.fill();
  // the wire: from the receiver, forward and down past the ear, curling into a small spiral inside
  const w=[rc[0]-14*k,rc[1]+14*k,rc[0]-34*k,E[1]-8*k,E[0]-6*k,E[1]+30*k,E[0]-24*k,E[1]+14*k],sp=[E[0]-24*k,E[1]+14*k],wu=o.wire==null?1:o.wire;
  ctx.lineCap="round";ctx.strokeStyle=rgba(AG.blue,0.95);ctx.lineWidth=3.4*k;ag_bzPath(ctx,w,0,Math.min(1,wu*1.4),30);ctx.stroke();
  const cu=clamp(wu*1.4-1,0,0.4)/0.4;if(cu>0){ctx.beginPath();for(let i=0;i<=40*cu;i++){const th=i/40*TAU*1.7,r=11*k*Math.exp(-0.32*th);ctx.lineTo(sp[0]+Math.cos(th+Math.PI)*r,sp[1]+Math.sin(th+Math.PI)*r);}ctx.stroke();}
  if(o.pulse>0){for(let i=0;i<4;i++){const u=((o.t||0)*0.9+i/4)%1,q=ag_bz(w,u);ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=rgba([150,210,245],0.9*o.pulse*Math.sin(Math.PI*u));ctx.beginPath();ctx.arc(q[0],q[1],4.5*k,0,TAU);ctx.fill();ctx.restore();}}
  ctx.restore();return{receiver:rc,ear:E};}
// the coil worn behind the ear, and its lead down to the processor at (bx, by)
function tt_coil(ctx,x,y,s,bx,by,a){a=a==null?1:a;if(a<=0)return;const E=tt_ear(x,y,s,true),c=[E[0]+40*s,E[1]-50*s];ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle="#2F2C29";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(c[0]+4*s,c[1]+10*s);ctx.bezierCurveTo(c[0]+40*s,c[1]+160*s,bx-180,by-60,bx,by);ctx.stroke();
  ag_soft(ctx,cc=>{cc.arc(c[0],c[1],15*s,0,TAU);},[64,62,60],[150,146,140],c[0]+5*s,c[1]-6*s,18*s,"rgba(0,0,0,0.4)",4);ctx.fillStyle="#9C978E";ctx.beginPath();ctx.arc(c[0],c[1],4*s,0,TAU);ctx.fill();ctx.restore();return c;}
// his brain doing the rest: warm light branching out from (x, y), richer as u goes from 0 to 1 (seeded, kept)
const TT_BRANCH=(()=>{const R=ag_rnd(77),segs=[];const grow=(x,y,a,len,w,d,t0)=>{const n=6,pts=[[x,y]];let h=a;for(let i=0;i<n;i++){h+=(R()-0.5)*0.36;x+=Math.cos(h)*len/n;y+=Math.sin(h)*len/n;pts.push([x,y]);}
  segs.push({pts,w0:w,w1:w*0.55,t0,t1:t0+0.24,d});if(d<5){const k=d<3?2:(R()<0.55?2:1);for(let j=0;j<k;j++)grow(x,y,h+(j?1:-1)*(0.3+R()*0.35),len*(0.72+R()*0.12),w*0.62,d+1,t0+0.17);}};
  for(let i=0;i<9;i++){const a=i*TAU/9+(R()-0.5)*0.3;grow(0,0,a,80+R()*40,9,0,R()*0.08);}return segs;})();
// drawn behind a head: a warm glow, and warm branches spreading through it (u 0 to 1), soft and calm, never a spark
function tt_branchLight(ctx,x,y,s,u,a){a=a==null?1:a;if(a<=0||u<=0)return;const [bc,bx]=ag_buf("branch",900,900);bx.translate(450,450);bx.scale(s,s);
  bx.lineCap="round";for(const sg of TT_BRANCH){const v=clamp((u*1.1-sg.t0)/(sg.t1-sg.t0),0,1);if(v<=0)continue;const n=sg.pts.length,m=Math.max(2,Math.ceil((n-1)*v)+1);
    const pts=sg.pts.slice(0,m);tt_taper(bx,pts,sg.w0,lerp(sg.w0,sg.w1,v),rgba([255,214,150],0.95-sg.d*0.1));}
  ctx.save();ctx.globalCompositeOperation="screen";const g=ctx.createRadialGradient(x,y,0,x,y,330*s);g.addColorStop(0,rgba(TT_WARM,0.7*a*clamp(u*2,0,1)));g.addColorStop(0.5,rgba(TT_WARM,0.28*a*clamp(u*2,0,1)));g.addColorStop(1,rgba(TT_WARM,0));
  ctx.fillStyle=g;ctx.fillRect(x-330*s,y-330*s,660*s,660*s);ctx.filter="blur(6px)";ctx.globalAlpha*=0.8*a;ctx.drawImage(bc,x-450,y-450);ctx.filter="none";ctx.globalAlpha=0.5*a;ctx.drawImage(bc,x-450,y-450);ctx.restore();}

/* ---------------------------------------------------------------- a pale map of the world, and the implants' lights spreading over it */
const TT_LAND=[[[-168,66],[-162,70],[-140,70],[-120,72],[-95,72],[-80,67],[-62,60],[-56,52],[-66,45],[-70,42],[-76,35],[-80,26],[-82,25],[-84,30],[-90,29],[-97,26],[-97,20],[-90,16],[-84,10],[-80,8],[-78,8],[-86,12],[-92,15],[-105,20],[-110,24],[-115,30],[-118,34],[-124,40],[-124,48],[-130,55],[-140,60],[-152,58],[-160,58],[-166,62]],
  [[-78,8],[-72,12],[-62,10],[-52,4],[-44,-2],[-35,-6],[-38,-14],[-41,-22],[-48,-26],[-54,-34],[-58,-38],[-65,-42],[-66,-50],[-70,-54],[-73,-50],[-73,-40],[-71,-30],[-70,-18],[-76,-12],[-80,-4],[-80,2]],
  [[-10,36],[-9,43],[-2,44],[-4,48],[2,51],[8,54],[6,58],[8,62],[14,66],[20,70],[30,71],[45,68],[60,70],[75,72],[90,76],[110,76],[130,72],[150,70],[170,68],[180,66],[178,62],[162,58],[156,52],[142,54],[140,46],[132,42],[128,36],[122,32],[121,25],[114,22],[108,18],[106,10],[100,8],[100,14],[98,16],[94,18],[90,22],[86,20],[80,14],[78,8],[74,16],[72,22],[66,25],[58,25],[56,22],[52,17],[44,12],[42,16],[36,28],[34,32],[36,36],[28,36],[26,40],[22,38],[20,40],[16,40],[12,44],[8,44],[3,43],[0,40],[-6,36]],
  [[-17,21],[-16,28],[-10,30],[-6,36],[10,37],[20,32],[30,31],[33,31],[34,28],[38,22],[43,12],[51,12],[50,2],[42,-4],[40,-12],[40,-16],[35,-24],[32,-29],[26,-34],[20,-35],[18,-30],[14,-22],[12,-14],[13,-6],[9,-1],[9,4],[5,6],[-4,5],[-8,4],[-13,8],[-17,14]],
  [[114,-22],[114,-30],[116,-35],[124,-34],[130,-32],[136,-35],[140,-38],[146,-39],[150,-37],[153,-30],[153,-25],[146,-19],[142,-11],[136,-12],[132,-11],[128,-15],[122,-18]],
  [[-50,60],[-42,60],[-22,70],[-20,80],[-40,83],[-60,80],[-72,78],[-56,72]],[[-6,50],[2,51],[0,54],[-2,57],[-5,58],[-6,55],[-5,52]],[[130,32],[134,34],[140,36],[142,40],[141,44],[140,42],[138,38],[134,35],[130,34]],
  [[166,-46],[172,-41],[174,-37],[178,-38],[176,-42],[170,-46]],[[95,5],[104,-6],[106,-6],[98,2]],[[109,1],[117,7],[119,1],[116,-4],[110,-3]],[[131,-1],[141,-3],[150,-10],[141,-9],[132,-4]],[[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]]];
// where implants were fitted, roughly in the order the lights come on: Melbourne first
const TT_LIGHTS=[[145,-38],[151,-34],[153,-27],[116,-32],[174,-37],[-0.1,51.5],[2,48.8],[13,52],[-74,40.7],[-87,42],[-118,34],[-79,43.6],[9,45.5],[-3.7,40.4],[16,48],[4.9,52.4],[18,59.3],[24,60],[139.7,35.7],[135.5,34.7],[127,37.5],[121.5,31.2],[116.4,39.9],[114,22.3],[103.8,1.3],[77.2,28.6],[72.8,19],[80.2,13],[-46.6,-23.5],[-58.4,-34.6],[-70.6,-33.4],[-99,19.4],[-74,4.6],[28,-26],[31.2,30],[35,32],[51.4,35.7],[46.7,24.7],[55.3,25.2],[37.6,55.8],[30.3,59.9],[21,52.2],[14.4,50.1],[19,47.5],[23.7,37.9],[29,41],[-122.4,37.8],[-122.3,47.6],[-104.9,39.7],[-95.4,29.8],[-80.2,25.8],[-71,42.4],[-77,38.9],[-84.4,33.7],[-93.3,45],[100.5,13.8],[106.8,-6.2],[121,14.6],[-43.2,-22.9],[36.8,-1.3],[3.4,6.5],[-6.8,34],[10.2,36.8],[44.4,33.3]];
function tt_worldMap(ctx,x,y,w,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*0.42,P=(lo,la)=>[x+(lo+180)/360*w,y+(80-la)/138*h];
  const pic=ag_kept("tt_map:"+w,Math.ceil(w)+40,Math.ceil(h)+40,c=>{c.translate(20-x,20-y);c.save();c.shadowColor="rgba(46,38,28,0.18)";c.shadowBlur=14;c.shadowOffsetX=-4;c.shadowOffsetY=6;
    c.fillStyle="#E9E3D6";for(const L of TT_LAND){c.beginPath();L.forEach((p,i)=>{const q=P(p[0],p[1]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.closePath();c.fill();}c.restore();
    c.strokeStyle="rgba(120,104,86,0.35)";c.lineWidth=1.5;c.lineJoin="round";for(const L of TT_LAND){c.beginPath();L.forEach((p,i)=>{const q=P(p[0],p[1]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.closePath();c.stroke();}});
  ctx.save();ctx.globalAlpha*=a;ctx.drawImage(pic,x-20,y-20);
  const n=TT_LIGHTS.length;for(let i=0;i<n;i++){const v=clamp(u*n*1.05-i,0,1);if(v<=0)continue;const q=P(TT_LIGHTS[i][0],TT_LIGHTS[i][1]),k=ag_spr(v,0,0.5);
    tt_glow(ctx,q[0],q[1],22*k,0.9*v);ctx.fillStyle=rgba([255,244,220],v);ctx.beginPath();ctx.arc(q[0],q[1],4*k,0,TAU);ctx.fill();}
  ctx.restore();return P;}

/* ---------------------------------------------------------------- the agent as a rough copy: neurons in its band, pages flowing in */
// over ag_model at (x, y, r): faint neurons glowing in its violet band (a), and tiny pages flowing into it from the left (u, t)
function tt_roughCopy(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  // neurons in the band: small bodies and branches, lit violet-white
  const bw=r*1.3,bh=r*0.32,by=y-r*0.11;ctx.save();rr(ctx,x-bw/2+r*0.05,by-bh/2+2,bw-r*0.1,bh-4,bh/2);ctx.clip();ctx.globalCompositeOperation="lighter";ctx.strokeStyle=rgba([200,192,255],0.55*(o.neurons==null?1:o.neurons));ctx.lineWidth=1.3;
  const R=ag_rnd(5);for(let i=0;i<7;i++){const cx=x-bw/2+bw*(i+0.5)/7+(R()-0.5)*8,cy=by+(R()-0.5)*bh*0.3,ph=t*1.3+i;ctx.fillStyle=rgba([220,214,255],0.5+0.3*Math.sin(ph));ctx.beginPath();ctx.arc(cx,cy,2.2,0,TAU);ctx.fill();
    for(let j=0;j<4;j++){const an=R()*TAU,l=6+R()*9;ctx.beginPath();ctx.moveTo(cx,cy);ctx.quadraticCurveTo(cx+Math.cos(an+0.4)*l*0.6,cy+Math.sin(an+0.4)*l*0.6,cx+Math.cos(an)*l,cy+Math.sin(an)*l);ctx.stroke();}}
  ctx.restore();
  // pages flowing in along a curve from the left (o.from "right": from the right)
  const pu=o.pages||0;if(pu>0){const sd=o.from==='right'?-1:1,p=[x-sd*r*5.2,y-r*1.6,x-sd*r*3.4,y-r*2.2,x-sd*r*2,y-r*0.2,x-sd*r*0.6,y-r*0.1];for(let i=0;i<9;i++){const u=((t*0.32+i/9)%1),q=ag_bz(p,u),al=pu*Math.sin(Math.PI*Math.min(1,u*1.15))*(u<0.9?1:(1-u)*10);
      if(al<=0.01)continue;const sc=lerp(1,0.35,u*u);ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(Math.sin(i*2.1+t)*0.25);ctx.scale(sc,sc);ctx.globalAlpha*=al;ag_box(ctx,-20,-26,40,52,4,{});ctx.fillStyle="rgba(86,92,100,0.45)";for(let l=0;l<4;l++)ctx.fillRect(-12,-16+l*9,l===3?14:24,3);ctx.restore();}}
  ctx.restore();}

/* ---------------------------------------------------------------- the five questions, pinned to the wall */
const TT_Q=[["Do our brains work like this?","jun"],["Could it have an idea of its own?","mei"],["Would a perfect copy of a brain be a mind?","noor"],["Does it feel anything?","sam"],["What makes us human, then?","yusuf"]];
const TT_QTAG=["much still unknown","not for science alone","nobody knows","nobody knows yet","nobody has settled it"];
const TT_QW=316,TT_QY=150,TT_QX=i=>128+i*(TT_QW+34);   // each card's width, where the row hangs, each card's left edge
// a question card at (x, y) (its top left), w wide: its number in a small round badge, the question, a pin at the top; o.k springs it,
// o.lift 0 to 1 (off the wall: a deeper shadow), o.tag the words of the tag that settles under it, o.tagA, o.lit 0 to 1 (its edge glows
// violet: the question being asked); returns its box
function tt_qcard(ctx,i,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||TT_QW,q=TT_Q[i][0];const lines=ag_wrap(ctx,q,w-56,{w:700,size:32}),h=28+52+3*42+18;const bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y,lerp(0.4,1,o.k));
  const lift=o.lift||0;if(lift>0){ctx.save();ctx.globalAlpha*=0.5*lift;ctx.shadowColor="rgba(46,38,28,0.4)";ctx.shadowBlur=50*lift;ctx.shadowOffsetX=-14*lift;ctx.shadowOffsetY=30*lift;ctx.fillStyle="#EEECE7";rr(ctx,x,y,w,h,22);ctx.fill();ctx.restore();}
  ag_box(ctx,x,y,w,h,22,{edge:o.lit>0?AG.violet:null,edgeA:0.8*(o.lit||0),glow:o.lit>0?AG.violet:null});
  // the badge with its number, then the question
  ctx.fillStyle=rgba(AG.violet,0.12);ctx.beginPath();ctx.arc(x+50,y+52,24,0,TAU);ctx.fill();ag_T(ctx,String(i+1),x+50,y+63,{w:800,size:30,align:"center",col:AG.violet});
  lines.forEach((l,j)=>ag_T(ctx,l,x+28,y+80+42*(j+1)-8,{w:700,size:32}));
  // the pin
  if(o.pin!==false){ctx.save();ctx.shadowColor="rgba(46,38,28,0.35)";ctx.shadowBlur=6;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=3;const g=ctx.createRadialGradient(x+w/2-3,y+10,1,x+w/2,y+14,11);g.addColorStop(0,rgba(AG_OAK.hi,1));g.addColorStop(1,rgba(AG_OAK.dark,1));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x+w/2,y+14,10,0,TAU);ctx.fill();ctx.restore();}
  ctx.restore();
  if(o.tag&&o.tagA>0){const tw=ag_tw(ctx,o.tag,{w:700,size:28})+56;tt_tag(ctx,x+w/2,y+h+44,o.tag,{a:a*o.tagA,k:o.tagK,size:28});}
  return bb;}
// the row on the wall: o.out the card that's off the wall (its index), o.tags [0 to 1 for each], o.k [spring for each], o.a
function tt_qrow(ctx,o){o=o||{};for(let i=0;i<5;i++){if(o.out===i)continue;const k=o.k?o.k[i]:1;if(k<=0)continue;tt_qcard(ctx,i,TT_QX(i),TT_QY,{k,a:o.a,tag:TT_QTAG[i],tagA:o.tags?o.tags[i]:0,tagK:o.tagK?o.tagK[i]:null});}}
// the sign-off under the agent's answer: drafted by the agent, then Mei's signature, then her approval; sg 0 to 1 how far she has
// signed; 214 tall
function tt_signoff(ctx,x,y,w,sg,a){a=a==null?1:a;if(a<=0)return;ag_box(ctx,x,y,w,214,20,{a,edge:sg>0.9?AG.green:null,edgeA:0.6*clamp((sg-0.9)*10,0,1)});ctx.save();ctx.globalAlpha*=a;
  ag_pen(ctx,x+44,y+48,26,rgba(AG.violet,1));ag_T(ctx,"drafted by the agent",x+72,y+58,{w:600,size:28,col:AG.mut});
  ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+84);ctx.lineTo(x+w-24,y+84);ctx.stroke();
  // her signature, written along a faint line
  ctx.setLineDash([3,7]);ctx.strokeStyle="rgba(60,50,40,0.22)";ctx.beginPath();ctx.moveTo(x+72,y+142);ctx.lineTo(x+w-60,y+142);ctx.stroke();ctx.setLineDash([]);
  const su=clamp(sg/0.7,0,1);if(su>0){ctx.strokeStyle=rgba(AG.ink,0.78);ctx.lineWidth=2.8;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
    for(let i=0;i<=80*su;i++){const u=i/80,xx=x+84+u*230,yy=y+130-Math.sin(u*TAU*2.6)*12*Math.sin(Math.PI*u)-u*8+Math.sin(u*TAU*7)*3;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();}
  const ap=clamp((sg-0.7)/0.3,0,1);if(ap>0){withA(ctx,ap,()=>{ag_tick(ctx,x+44,y+180,24,rgba(AG.green,1),4);ag_T(ctx,"approved · Mei Tanaka",x+72,y+190,{w:700,size:28,col:AG.green});});}
  ctx.restore();}

/* ---------------------------------------------------------------- a neuron, and its copy
   A living neuron: a rounded body, branches thinning to their tips (seeded, kept per seed), an axon. Warm rose, matte; never a meaning
   colour. Its copy, the perceptron: lines coming in, a small dial on each, a sum, a small light that fires, in blue. */
const TT_NEUR={};
function tt_neurGeo(seed){if(TT_NEUR[seed])return TT_NEUR[seed];const R=ag_rnd(seed),segs=[];
  const grow=(x,y,a,len,w,d)=>{const n=5,pts=[[x,y]];let h=a;for(let i=0;i<n;i++){h+=(R()-0.5)*0.4;x+=Math.cos(h)*len/n;y+=Math.sin(h)*len/n;pts.push([x,y]);}segs.push({pts,w0:w,w1:Math.max(1.2,w*0.55),d});
    if(d<3){const k=R()<0.8?2:1;for(let j=0;j<k;j++)grow(x,y,h+(j?1:-1)*(0.35+R()*0.45),len*(0.66+R()*0.14),Math.max(1.2,w*0.6),d+1);}};
  // the dendrites: one reaching up, and five round the body; the axon down and to the right, with small endings
  grow(0,-26,-Math.PI/2,120,12,0);for(let i=0;i<5;i++)grow(0,6,Math.PI*(0.15+i*0.18)+(R()-0.5)*0.2+(i>2?0.1:0),70+R()*30,9,1);
  const ax=[[6,24]];let x=6,y=24,h=Math.PI*0.32;for(let i=0;i<14;i++){h+=(R()-0.5)*0.15;x+=Math.cos(h)*18;y+=Math.sin(h)*18;ax.push([x,y]);}
  const axon={pts:ax,w0:5,w1:3};const ends=[];for(let i=0;i<4;i++){const a=h+(i-1.5)*0.45;const p=[[x,y]];let xx=x,yy=y,hh=a;for(let k=0;k<4;k++){hh+=(R()-0.5)*0.3;xx+=Math.cos(hh)*12;yy+=Math.sin(hh)*12;p.push([xx,yy]);}ends.push({pts:p,w0:2.6,w1:1.2});}
  return TT_NEUR[seed]={segs,axon,ends};}
// at (x, y), size s: o.grow 0 to 1 draws its branches out from the body, o.fire 0 to 1 sends a light down its axon, o.col, o.a
function tt_neuron(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const G=tt_neurGeo(o.seed||3),col=o.col||[204,140,136],gr=o.grow==null?1:o.grow;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.lineCap="round";
  const part=(sg,v,fill)=>{if(v<=0)return;const n=sg.pts.length,m=Math.max(2,Math.ceil((n-1)*v)+1);tt_taper(ctx,sg.pts.slice(0,m),sg.w0,lerp(sg.w0,sg.w1,v),fill);};
  const each=(fn)=>{for(const sg of G.segs)fn(sg,clamp(gr*4-sg.d*0.8,0,1));fn(G.axon,clamp(gr*2.2-0.6,0,1));for(const e of G.ends)fn(e,clamp(gr*2.2-1.5,0,1));};
  // shadow, body colour, then the light along the upper side
  ctx.save();ctx.translate(-5,7);each((sg,v)=>part(sg,v,rgba(AG.shadow,0.12)));ctx.restore();
  each((sg,v)=>part(sg,v,rgba(col,1)));
  ctx.save();ctx.translate(1.2,-1.6);each((sg,v)=>{if(v<=0)return;const n=sg.pts.length,m=Math.max(2,Math.ceil((n-1)*v)+1);tt_taper(ctx,sg.pts.slice(0,m),sg.w0*0.35,sg.w1*0.3,rgba(ag_lt(col,0.5),0.7));});ctx.restore();
  ag_soft(ctx,cc=>{cc.moveTo(0,-34);cc.bezierCurveTo(18,-18,26,10,16,24);cc.bezierCurveTo(6,32,-10,32,-18,22);cc.bezierCurveTo(-26,8,-16,-18,0,-34);cc.closePath();},col,ag_lt(col,0.5),8,-12,30,rgba(ag_dk(col,0.6),0.4),8);
  ctx.fillStyle=rgba(ag_dk(col,0.25),0.7);ctx.beginPath();ctx.arc(1,2,6,0,TAU);ctx.fill();
  if(o.fire>0){const u=o.fire,pts=G.axon.pts,i=Math.min(pts.length-1,Math.floor(u*(pts.length-1))),q=pts[i];ctx.restore();ctx.save();
    const X=x+q[0]*s,Y=y+q[1]*s;tt_glow(ctx,X,Y,34*s,Math.sin(Math.PI*u));ctx.restore();return;}
  ctx.restore();}
// the perceptron: n inputs from the left, a dial on each, a sum, a light; centred on (x, y), size s; o.p 0 to 1 draws it on, o.fire 0 to 1
// lights it, o.needles [radians], o.col (blue by default; violet for the model)
function tt_perceptron(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const n=o.n||5,p=o.p==null?1:o.p,col=o.col||AG.blue,fire=o.fire||0;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.lineCap="round";ctx.lineWidth=3;
  const sx=40,ox=230;for(let i=0;i<n;i++){const yy=(i-(n-1)/2)*56,v=clamp(p*2-i*0.12,0,1);if(v<=0)continue;ctx.strokeStyle=rgba(col,0.9);ctx.beginPath();ctx.moveTo(-220,yy);ctx.lineTo(lerp(-220,sx-30,v),lerp(yy,0,v*v));ctx.stroke();
    // the dial: a small round face with a needle
    const dx=-140,dy=yy+(0-yy)*((dx+220)/(sx-30+220));ctx.fillStyle="#F4F2EE";ctx.beginPath();ctx.arc(dx,dy,15,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.5;ctx.stroke();
    const nd=(o.needles?o.needles[i]:(-0.8+i*0.4));ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+Math.cos(nd-Math.PI/2)*11,dy+Math.sin(nd-Math.PI/2)*11);ctx.stroke();ctx.lineWidth=3;
    ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(-220,yy,6,0,TAU);ctx.fill();}
  const v2=clamp(p*2-0.8,0,1);if(v2>0){ctx.fillStyle="#F4F2EE";ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.beginPath();ctx.arc(sx,0,30,0,TAU);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx-13,0);ctx.lineTo(sx+13,0);ctx.moveTo(sx,-13);ctx.lineTo(sx,13);ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx+30,0);ctx.lineTo(lerp(sx+30,ox-18,clamp(p*2-1,0,1)),0);ctx.stroke();}
  const v3=clamp(p*2-1.6,0,1);if(v3>0){ctx.restore();ctx.save();ctx.globalAlpha*=a*v3;const LX=x+ox*s,LY=y;if(fire>0)tt_glow(ctx,LX,LY,60*s,fire,mix(col,[255,255,255],0.5));
    ctx.fillStyle=rgba(mix([244,242,238],mix(col,[230,240,250],0.4),fire),1);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3*s;ctx.beginPath();ctx.arc(LX,LY,18*s,0,TAU);ctx.fill();ctx.stroke();}
  ctx.restore();return{light:[x+ox*s,y],sum:[x+sx*s,y]};}
// copies of it, multiplying into a lattice: layers of small nodes and the lines between them, blue turning violet (u 0 to 1 how many),
// gathering into the agent's band at (bx, by) as g goes 0 to 1
function tt_lattice(ctx,x,y,w,h,u,g,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||u<=0)return;const L=Math.max(2,Math.round(lerp(2,14,u))),N=Math.max(2,Math.round(lerp(3,9,u))),bx=o.bx||x,by=o.by||y;
  const col=mix(AG.blue,AG.violet,clamp(u*1.4-0.3,0,1)),P=(i,j)=>{const px=x+(i/(L-1)-0.5)*w,py=y+(j/(N-1)-0.5)*h;return[lerp(px,bx+(i/(L-1)-0.5)*100,ag_sine(g)),lerp(py,by+(j/(N-1)-0.5)*20,ag_sine(g))];};
  ctx.save();ctx.globalAlpha*=a*(1-0.8*g);ctx.strokeStyle=rgba(col,0.16);ctx.lineWidth=1.2;for(let i=0;i<L-1;i++)for(let j=0;j<N;j++)for(let k=0;k<N;k++){if((j+k+i)%2)continue;const A=P(i,j),B=P(i+1,k);ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();}
  ctx.fillStyle=rgba(col,0.85);for(let i=0;i<L;i++)for(let j=0;j<N;j++){const q=P(i,j);ctx.beginPath();ctx.arc(q[0],q[1],lerp(5,2,g),0,TAU);ctx.fill();}ctx.restore();}
// a row of words, each first a soft violet guess, then the word written into it: words at (x, y) 36 px; o.at [the moment each comes],
// t; o.guess how long before its word a guess lights; returns the right edge of the last word shown
function tt_wordRow(ctx,words,x,y,t,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||36,gl=o.guess||0.45;let xx=x;if(a<=0)return x;ctx.save();ctx.globalAlpha*=a;
  words.forEach((w,i)=>{const at=o.at[i],ww=ag_tw(ctx,w,{w:700,size}),gu=ag_io(t,at-gl,at+0.5,0.25),wv=ag_in(t,at,0.3);
    if(gu>0){ctx.save();ctx.globalAlpha*=gu;ctx.shadowColor=rgba(AG.violet,0.6);ctx.shadowBlur=16;ctx.fillStyle=rgba(AG.violet,0.22);rr(ctx,xx-8,y-size*0.86,ww+16,size*1.2,12);ctx.fill();ctx.restore();}
    if(wv>0)ag_T(ctx,w,xx,y,{w:700,size,col:o.col||AG.violet,a:wv});xx+=ww+size*0.36;});ctx.restore();return xx;}
// the agent's ring in miniature round a guess and an error: predict, compare, learn; o.p draws it, o.dotted 0 to 1 turns its way back
// (learn to predict) into a dotted line with a question mark
function tt_miniLoop(ctx,x,y,R,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const p=o.p==null?1:o.p,dt=o.dotted||0;
  ag_ring(ctx,x,y,R,{p:p*(dt>0?lerp(1,0.66,clamp(dt*3,0,1)):1),from:-90,arrows:[-30,90,210].filter(d=>(d+90)/360<p)});
  if(dt>0){ctx.save();ctx.globalAlpha*=clamp(dt*3,0,1);ctx.strokeStyle=rgba(AG_OAK.dark,0.9);ctx.lineWidth=5*R/180;ctx.setLineDash([3,12*R/180]);ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,R,-90*Math.PI/180+TAU*0.665,-90*Math.PI/180+TAU);ctx.stroke();ctx.restore();
    ag_T(ctx,"?",x-R*0.92,y-R*0.62,{w:800,size:52,align:"center",col:AG.amber,a:clamp(dt*2-0.6,0,1)});}
  const st=[["predict",-90],["compare",30],["learn",150]];st.forEach((sx,i)=>{const d=sx[1]*Math.PI/180,v=clamp(p*3-i,0,1);if(v>0)ag_step(ctx,x+Math.cos(d)*R,y+Math.sin(d)*R,sx[0],{a:v,on:o.lit===i?AG.violet:null});});
  // in the middle: a guess (violet) and the error (amber), side by side
  const gv=o.guess==null?1:o.guess;if(gv>0){ctx.save();ctx.globalAlpha*=gv;ctx.shadowColor=rgba(AG.violet,0.5);ctx.shadowBlur=12;ctx.fillStyle=rgba(AG.violet,0.85);ctx.beginPath();ctx.arc(x-22,y,13,0,TAU);ctx.fill();ctx.restore();}
  const ev=o.error==null?1:o.error;if(ev>0){ctx.save();ctx.globalAlpha*=ev;ctx.strokeStyle=rgba(AG.amber,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+14,y-10);ctx.lineTo(x+34,y+10);ctx.moveTo(x+34,y-10);ctx.lineTo(x+14,y+10);ctx.stroke();ctx.restore();}
  ctx.restore();}
// rows of guesses at three levels, each lighting at its own pace: the next word, the sentence, the story
function tt_levels(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const rows=[["the next word",1.6,14],["the sentence",0.6,6],["the story",0.22,2]];ctx.save();ctx.globalAlpha*=a;
  rows.forEach((r,i)=>{const v=o.rows?o.rows[i]:1;if(v<=0)return;const yy=y+i*86;ag_T(ctx,r[0],x,yy+10,{w:700,size:30,col:AG.ink,a:v});const n=r[2],x0=x+260,w=560,bw=w/n-10;
    for(let k=0;k<n;k++){const ph=((t*r[1]-k/n)%1+1)%1,lit=Math.pow(Math.max(0,1-ph*n*0.9),1.5);ctx.save();ctx.globalAlpha*=v;ctx.fillStyle=rgba(AG.violet,0.14+0.6*lit);if(lit>0.2){ctx.shadowColor=rgba(AG.violet,0.6);ctx.shadowBlur=12*lit;}rr(ctx,x0+k*(bw+10),yy-14,bw,30,12);ctx.fill();ctx.restore();}});
  ctx.restore();}
// a network's layers, columns of small blue nodes and the lines between them: n layers (5 to 8, fractional as one more comes in)
function tt_layers(ctx,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const L=Math.ceil(n),N=6,gap=58,hh=56;ctx.save();ctx.globalAlpha*=a;
  const P=(i,j)=>[x+i*gap,y+(j-(N-1)/2)*hh];for(let i=0;i<L-1;i++){const v=clamp(n-i-1,0,1);if(v<=0)continue;ctx.strokeStyle=rgba(AG.blue,0.18*v);ctx.lineWidth=1.2;for(let j=0;j<N;j++)for(let k=0;k<N;k++){const A=P(i,j),B=P(i+1,k);ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();}}
  for(let i=0;i<L;i++){const v=clamp(n-i,0,1);if(v<=0)continue;const k=ag_spr(v,0,0.5);for(let j=0;j<N;j++){const q=P(i,j);ctx.fillStyle=rgba(AG.blue,v);ctx.beginPath();ctx.arc(q[0],q[1],9*k,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.45)";ctx.beginPath();ctx.arc(q[0]-2.5,q[1]-2.5,3*k,0,TAU);ctx.fill();}}
  ctx.restore();return{w:(L-1)*gap,h:(N-1)*hh};}

/* ---------------------------------------------------------------- three hands at a table, seen from above, and what they draw
   A hand holding a pencil, its arm coming in from the frame's edge: the grandmother's, the parent's, the child's. The drawing grows on
   one sheet: a house, a tree, a sun with a face no one else would have drawn. */
// a hand from above at (x, y) (the pencil's tip), its arm coming in from angle ang (radians, pointing from the tip back to the arm),
// size s, drawn like the module's hands (one soft shape for the fingers, the thumb, faint creases); o.skin, o.sleeve, o.age (fine lines
// and spots on the back of the hand), o.pencil false for an empty hand, o.a
function tt_handTop(ctx,x,y,ang,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const sk=o.skin||[226,186,156],sl=o.sleeve||[150,140,124],shade=rgba(mix(sk,[60,20,10],0.55),0.36);
  const base=mix(sk,ag_dk(sk,0.4),0.12),hi=mix(sk,[255,240,228],0.42);ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);
  // (local: +x runs back up the pencil towards the arm, the tip at 0, 0; -y is the thumb's side)
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.3)";ctx.shadowBlur=28;ctx.shadowOffsetX=-12;ctx.shadowOffsetY=18;
  ag_soft(ctx,cc=>{cc.moveTo(262,-62);cc.bezierCurveTo(500,-72,700,-80,1000,-86);cc.lineTo(1000,96);cc.bezierCurveTo(700,90,500,80,262,62);cc.bezierCurveTo(248,28,248,-30,262,-62);cc.closePath();},sl,ag_lt(sl,0.28),460,-50,320,rgba(ag_dk(sl,0.6),0.4),18);
  // the hand: the back of it and the fingers curled under, one soft shape, with its shadow on the table
  const body=cc=>{cc.moveTo(250,-48);cc.bezierCurveTo(212,-50,170,-46,128,-38);cc.bezierCurveTo(98,-32,72,-20,62,-2);cc.bezierCurveTo(54,14,62,34,82,44);cc.bezierCurveTo(110,58,150,60,186,54);cc.bezierCurveTo(212,50,232,48,250,48);cc.closePath();};
  ag_soft(ctx,body,base,hi,150,-20,130,shade,12);ctx.restore();
  ctx.strokeStyle=rgba(mix(sk,[70,24,14],0.5),0.3);ctx.lineWidth=2.2;ctx.lineCap="round";for(const k of [[78,8],[86,26],[104,42]]){ctx.beginPath();ctx.moveTo(k[0],k[1]);ctx.quadraticCurveTo(k[0]+16,k[1]-2,k[0]+28,k[1]+4);ctx.stroke();}
  // the pencil, from its point back past the web of the hand
  if(o.pencil!==false){ctx.save();const L=220;ctx.rotate(-0.25);ctx.fillStyle="#4C4A48";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(12,-3);ctx.lineTo(12,3);ctx.closePath();ctx.fill();
    ctx.fillStyle="#E8CFA2";ctx.beginPath();ctx.moveTo(10,-3.4);ctx.lineTo(34,-8);ctx.lineTo(34,8);ctx.lineTo(10,3.4);ctx.closePath();ctx.fill();
    ctx.fillStyle=o.pencilCol||"#C9A13A";ctx.fillRect(34,-8,L,16);ctx.fillStyle="rgba(255,255,255,0.32)";ctx.fillRect(36,-7,L-4,4);ctx.fillStyle="rgba(0,0,0,0.12)";ctx.fillRect(36,3,L-4,4);
    ctx.fillStyle="#B9B4AC";ctx.fillRect(34+L,-8.5,16,17);ctx.fillStyle="#D88A8A";rr(ctx,50+L,-8,14,16,4);ctx.fill();ctx.restore();}
  // the index finger along the pencil, and the thumb beside it
  const pen=o.pencil!==false;
  ag_soft(ctx,cc=>{cc.moveTo(140,-40);cc.bezierCurveTo(110,-40,72,-34,46,-22);cc.bezierCurveTo(34,-16,32,-4,42,-2);cc.bezierCurveTo(70,0,104,-6,136,-12);cc.closePath();},mix(sk,ag_dk(sk,0.4),pen?0.06:0.1),hi,96,-30,60,shade,7);
  ag_soft(ctx,cc=>{cc.moveTo(214,-50);cc.bezierCurveTo(176,-62,128,-64,92,-54);cc.bezierCurveTo(74,-49,70,-38,82,-34);cc.bezierCurveTo(116,-30,166,-30,206,-30);cc.closePath();},mix(sk,ag_dk(sk,0.4),0.04),hi,130,-54,56,shade,6);
  ctx.fillStyle=rgba(ag_lt(sk,0.5),0.55);ctx.beginPath();ctx.ellipse(48,-12,9,6,-0.3,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(88,-44,10,6,-0.15,0,TAU);ctx.fill();
  if(o.age){ctx.strokeStyle=rgba(mix(sk,[80,30,16],0.5),0.22);ctx.lineWidth=1.6;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(150+i*18,-28+i*4);ctx.quadraticCurveTo(160+i*18,0,154+i*18,30);ctx.stroke();}
    ctx.fillStyle=rgba(mix(sk,[130,80,46],0.5),0.3);for(const p of [[160,-14],[186,16],[150,30],[204,-20]]){ctx.beginPath();ctx.arc(p[0],p[1],4,0,TAU);ctx.fill();}}
  ctx.restore();}
// the drawing on the sheet: a house (h 0 to 1), a tree (r), a sun with a face (u), each drawn stroke by stroke; returns where the
// pencil is (null when no stroke is being drawn)
const TT_DRAW=(()=>{const crown=[];for(let i=0;i<=44;i++){const an=Math.PI*0.5+i/44*TAU,rad=74*(1+0.1*Math.sin(an*6));crown.push([40+Math.cos(an)*rad*1.05,-28+Math.sin(an)*rad]);}
  const sun=[];for(let i=0;i<=28;i++){const an=-Math.PI/2+i/28*TAU;sun.push([250+Math.cos(an)*48,-60+Math.sin(an)*48]);}
  return{house:[[[-300,-10],[-300,120],[-180,120],[-180,-10],[-300,-10]],[[-312,-2],[-240,-82],[-168,-2]],[[-226,120],[-226,60],[-198,60],[-198,120]],[[-282,14],[-252,14],[-252,42],[-282,42],[-282,14]]],
    tree:[[[30,120],[34,44]],[[50,120],[46,44]],crown],sun:[sun]};})();
function tt_drawing(ctx,x,y,s,h,r,u){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle="rgba(70,66,62,0.88)";ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";let tip=null;
  const len=pts=>{let L=0;for(let i=1;i<pts.length;i++)L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return L;};
  const path=(pts,left)=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);let last=pts[0];for(let i=1;i<pts.length&&left>0;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]),f=Math.min(1,left/d);
      last=[lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f)];ctx.lineTo(last[0],last[1]);left-=d;}ctx.stroke();return last;};
  const strokes=(list,v)=>{if(v<=0)return;const Ls=list.map(len),tot=Ls.reduce((p,q)=>p+q,0);let left=tot*clamp(v,0,1);list.forEach((pts,i)=>{if(left<=0)return;const q=path(pts,left);if(left<Ls[i]&&v<1)tip=q;left-=Ls[i];});};
  strokes(TT_DRAW.house,h);strokes(TT_DRAW.tree,r);strokes(TT_DRAW.sun,clamp(u*2,0,1));
  for(let i=0;i<8;i++){const an=i/8*TAU+0.2,v=clamp((u*2-1-i*0.06)/0.32,0,1);if(v>0){const q=path([[250+Math.cos(an)*62,-60+Math.sin(an)*62],[250+Math.cos(an)*90,-60+Math.sin(an)*90]],28*v);if(v<1)tip=q;}}
  // the face: two eyes and a wide smile, and one eyebrow raised, the child's own idea
  const f=clamp(u*3-2.1,0,1);if(f>0){ctx.fillStyle="rgba(70,66,62,0.88)";ctx.globalAlpha*=f;ctx.beginPath();ctx.arc(234,-70,5,0,TAU);ctx.arc(266,-70,5,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(250,-56,24,0.25,Math.PI-0.25);ctx.stroke();ctx.beginPath();ctx.moveTo(258,-84);ctx.lineTo(276,-90);ctx.stroke();if(f<1)tip=[262,-40];}
  ctx.restore();return tip?[x+tip[0]*s,y+tip[1]*s]:null;}

/* ---------------------------------------------------------------- three ways to be creative (Boden): three cards */
// combine: two shapes join into a new one; explore: a path winding inside a fenced field; change the rules: the fence itself lifted and
// moved. Each card w x 300 at (x, y); u 0 to 1 plays its picture; v 0 to 1 the agent's violet lines in it (and its glow)
function tt_bodenCard(ctx,kind,x,y,w,u,v,o){o=o||{};const a=o.a==null?1:o.a,h=330;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:v>0.05?AG.violet:null,edgeA:0.8*v,glow:v>0.05?AG.violet:null});const cx=x+w/2,cy=y+130;ctx.lineCap="round";ctx.lineJoin="round";
  const ink="rgba(70,66,62,0.85)",vio=rgba(AG.violet,0.9*v);
  if(kind==="combine"){const d=lerp(70,26,ag_sine(u));ctx.strokeStyle=ink;ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx-d,cy,52,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+d,cy-56);ctx.lineTo(cx+d+56,cy+44);ctx.lineTo(cx+d-56,cy+44);ctx.closePath();ctx.stroke();
    if(v>0){ctx.strokeStyle=vio;ctx.lineWidth=5;const e=lerp(26,10,v);ctx.beginPath();ctx.arc(cx-e,cy+6,40,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+e+8,cy-40);ctx.lineTo(cx+e+50,cy+36);ctx.lineTo(cx+e-34,cy+36);ctx.closePath();ctx.stroke();}}
  else{const fx=cx-110,fw=220+(kind==="rules"?ag_sine(u)*0:0),fy=cy-80,fh=160,mv=kind==="rules"?ag_sine(u):0;
    // the fence: posts and a rail; in "change the rules" its right side lifts and moves out
    ctx.strokeStyle="rgba(150,116,82,0.95)";ctx.lineWidth=4;const right=fx+fw+mv*70,lift=Math.sin(Math.PI*mv)*-26;
    ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+fw,fy);ctx.moveTo(fx,fy+fh);ctx.lineTo(fx+fw,fy+fh);ctx.moveTo(fx,fy);ctx.lineTo(fx,fy+fh);ctx.stroke();
    if(mv>0){ctx.setLineDash([4,8]);ctx.strokeStyle="rgba(150,116,82,0.5)";ctx.beginPath();ctx.moveTo(fx+fw,fy);ctx.lineTo(right,fy);ctx.moveTo(fx+fw,fy+fh);ctx.lineTo(right,fy+fh);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle="rgba(150,116,82,0.95)";}
    ctx.beginPath();ctx.moveTo(right,fy+lift);ctx.lineTo(right,fy+fh+lift);ctx.stroke();for(let i=0;i<5;i++){ctx.fillStyle="rgba(150,116,82,0.95)";ctx.fillRect(fx-4+i*(fw/4),fy-8,8,16);ctx.fillRect(fx-4+i*(fw/4),fy+fh-8,8,16);}
    for(let i=0;i<3;i++)ctx.fillRect(right-4,fy+i*(fh/2)-8+lift,8,16);
    // a path winding inside it
    const pth=[fx+20,fy+fh-24,fx+80,fy+20,fx+140,fy+fh-10,fx+fw-24,fy+30];ctx.strokeStyle=ink;ctx.lineWidth=3.5;ctx.setLineDash([2,10]);ag_bzPath(ctx,pth,0,kind==="explore"?Math.max(0.15,ag_sine(u)):1,40);ctx.stroke();ctx.setLineDash([]);
    if(kind==="rules"&&mv>0){ctx.strokeStyle=ink;ctx.setLineDash([2,10]);ag_bzPath(ctx,[fx+fw-24,fy+30,fx+fw+10,fy+60,right-20,fy+40,right-26,fy+fh-30],0,mv,20);ctx.stroke();ctx.setLineDash([]);}
    if(v>0&&kind==="explore"){ctx.strokeStyle=vio;ctx.lineWidth=4;ag_bzPath(ctx,[fx+24,fy+30,fx+110,fy+fh-10,fx+120,fy+20,fx+fw-30,fy+fh-24],0,v,40);ctx.stroke();}}
  ag_T(ctx,kind==="combine"?"combine":kind==="explore"?"explore":"change the rules",cx,y+h-36,{w:700,size:32,align:"center"});ctx.restore();}
// a short poem the agent writes, in violet: each word made of a few small pages that fly out of the sphere at o.src and settle into it.
// Its words come one after another from t0 (o.rate seconds apart, a longer rest at each line's end); at (x, y), lines 62 px apart
const TT_POEM=["Morning light on the steps,","a term begins again:","new names in the register,","old trees by the gate."];
function tt_poemAt(t0,o){o=o||{};const rate=o.rate||0.3,out=[];let k=0;TT_POEM.forEach((ln,i)=>{ln.split(" ").forEach(()=>{out.push(t0+k*rate+i*0.45);k++;});});return out;}
function tt_poem(ctx,x,y,t,t0,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const size=o.size||40,src=o.src||[x+900,y],at=tt_poemAt(t0,o),fly=0.6;let k=0;ctx.save();ctx.globalAlpha*=a;
  TT_POEM.forEach((ln,i)=>{let xx=x;const yy=y+i*62;ln.split(" ").forEach(w=>{const tw=at[k],ww=ag_tw(ctx,w,{w:700,size}),cx=xx+ww/2,cy=yy-size*0.32;
    // the pages: four for each word, from the sphere on an arc, shrinking as they come in
    for(let j=0;j<4;j++){const u=clamp((t-(tw-fly)+j*0.05)/fly,0,1);if(u<=0||u>=1)continue;const q=ag_sine(u),px=lerp(src[0],cx+(j-1.5)*ww*0.22,q),py=lerp(src[1],cy,q)-Math.sin(Math.PI*q)*(60+j*18),sc=lerp(0.9,0.45,q);
      ctx.save();ctx.translate(px,py);ctx.rotate((1-q)*(j%2?0.7:-0.5));ctx.scale(sc,sc);ctx.globalAlpha*=Math.min(1,u*5)*(1-Math.max(0,(u-0.8)/0.2));ag_box(ctx,-14,-18,28,36,3,{});
      ctx.fillStyle=rgba(AG.violet,0.6);for(let l=0;l<3;l++)ctx.fillRect(-8,-10+l*8,l===2?9:16,2.5);ctx.restore();}
    const wv=ag_in(t,tw-0.12,0.3);if(wv>0)ag_T(ctx,w,xx,yy,{w:700,size,col:AG.violet,a:wv});xx+=ww+size*0.3;k++;});});
  ctx.restore();}

/* ---------------------------------------------------------------- the worm, its copy and its map */
// a worm a millimetre long, drawn L px long, centred on (x, y), wriggling with t: a translucent body tapering to a sharp tail, the gut
// inside, its 302 neurons as dots (most in a ring near the head) and fine lines; o.blue draws it as the copy, in blue lines only
function tt_wormPts(x,y,L,t,amp){const pts=[];for(let i=0;i<=40;i++){const u=i/40,xx=x-L/2+u*L,w=Math.sin(TAU*(u*1.3-t*0.45))*amp*(0.4+u*0.8);pts.push([xx,y+w]);}return pts;}
function tt_worm(ctx,x,y,L,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const amp=o.amp==null?L*0.045:o.amp,pts=tt_wormPts(x,y,L,t,amp),n=pts.length-1;
  const W=u=>L*0.05*(u<0.08?Math.sqrt(u/0.08)*0.85+0.15:u>0.75?Math.max(0.04,1-(u-0.75)/0.25):1);
  const side=(k)=>pts.map((p,i)=>{const q=pts[Math.min(n,i+1)],r=pts[Math.max(0,i-1)],dx=q[0]-r[0],dy=q[1]-r[1],d=Math.hypot(dx,dy)||1,w=W(i/n)*k;return[p[0]-dy/d*w,p[1]+dx/d*w];});
  const L1=side(1),R1=side(-1),body=c=>{c.moveTo(L1[0][0],L1[0][1]);for(let i=1;i<=n;i++)c.lineTo(L1[i][0],L1[i][1]);for(let i=n;i>=0;i--)c.lineTo(R1[i][0],R1[i][1]);c.closePath();};
  ctx.save();ctx.globalAlpha*=a;
  if(o.blue){ctx.strokeStyle=rgba(AG.blue,0.95);ctx.lineWidth=3;ctx.lineJoin="round";ctx.beginPath();body(ctx);ctx.stroke();ctx.strokeStyle=rgba(AG.blue,0.5);ctx.lineWidth=2;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    ctx.fillStyle=rgba(AG.blue,0.8);for(let i=1;i<14;i++){const u=i<6?0.06+i*0.012:0.15+i*0.055,p=pts[Math.round(u*n)];ctx.beginPath();ctx.arc(p[0],p[1]+(i%2?3:-3),3.2,0,TAU);ctx.fill();}ctx.restore();return;}
  // its shadow on the floor, then the body, see-through
  ctx.save();ctx.translate(-8,14);ctx.filter="blur(6px)";ctx.beginPath();body(ctx);ctx.fillStyle=rgba(AG.shadow,0.22);ctx.fill();ctx.restore();
  ctx.beginPath();body(ctx);ctx.fillStyle="rgba(246,238,222,0.62)";ctx.fill();ctx.strokeStyle="rgba(150,126,100,0.6)";ctx.lineWidth=2;ctx.stroke();
  ctx.save();ctx.beginPath();body(ctx);ctx.clip();ctx.strokeStyle="rgba(255,255,255,0.4)";ctx.lineWidth=L*0.008;ctx.filter="blur(2px)";ctx.beginPath();R1.forEach((p,i)=>{const q=[lerp(p[0],pts[i][0],0.4),lerp(p[1],pts[i][1],0.4)];i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.stroke();ctx.filter="none";
    // the gut, and the pharynx's two bulbs near the head
    ctx.strokeStyle="rgba(190,160,120,0.45)";ctx.lineWidth=L*0.022;ctx.beginPath();pts.slice(Math.round(n*0.12),Math.round(n*0.86)).forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    for(const u of [0.05,0.1]){const p=pts[Math.round(u*n)];ctx.fillStyle="rgba(196,160,120,0.45)";ctx.beginPath();ctx.ellipse(p[0],p[1],L*0.016,L*0.022,0,0,TAU);ctx.fill();}
    // the neurons: a ring near the head, a cord along the belly, a few at the tail; fine lines between
    const R=ag_rnd(11),dots=[];for(let i=0;i<70;i++){const u=i<34?0.075+R()*0.05:i<60?0.14+R()*0.62:0.82+R()*0.06,p=pts[Math.round(u*n)],off=(R()-0.5)*W(u)*1.2;dots.push([p[0],p[1]+off]);}
    ctx.strokeStyle="rgba(170,110,100,0.28)";ctx.lineWidth=1;for(let i=0;i<dots.length-1;i++){if(i%3===2)continue;ctx.beginPath();ctx.moveTo(dots[i][0],dots[i][1]);ctx.lineTo(dots[i+1][0],dots[i+1][1]);ctx.stroke();}
    ctx.fillStyle="rgba(178,104,96,0.75)";for(const d of dots){ctx.beginPath();ctx.arc(d[0],d[1],Math.max(1.6,L*0.0042),0,TAU);ctx.fill();}
  ctx.restore();ctx.restore();}
// the map of a wiring, flat, in the worm's shape: a ring of nodes near its head and two cords along its body, the lines between them;
// on each of many lines a small blank dial (dials 0 to 1): how strong? when? Centred on (x, y), w by h
const TT_WMAP=(()=>{const N=[],E=[];for(let i=0;i<6;i++){const an=i/6*TAU;N.push([0.1+Math.cos(an)*0.045,Math.sin(an)*0.5]);}
  for(let i=0;i<6;i++)E.push([i,(i+1)%6]);const top=[],bot=[];for(let k=0;k<7;k++){const u=0.24+k*0.11;top.push(N.length);N.push([u,-0.32+(k%2)*0.06]);bot.push(N.length);N.push([u+0.05,0.36-(k%2)*0.06]);}
  E.push([0,top[0]],[2,top[0]],[3,bot[0]],[5,bot[0]]);for(let k=0;k<7;k++){E.push([top[k],bot[k]]);if(k<6){E.push([top[k],top[k+1]],[bot[k],bot[k+1]]);if(k%2===0)E.push([top[k],bot[k+1]]);}}
  return{N,E};})();
function tt_wireMap(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const M=TT_WMAP,P=i=>{const n=M.N[i];return[x+(n[0]-0.5)*w,y+n[1]*h+Math.sin(n[0]*TAU*0.9)*h*0.18];},col=o.col||AG.blue,dr=o.draw==null?1:o.draw;ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=rgba(col,0.75);ctx.lineWidth=3;ctx.lineCap="round";M.E.forEach((e,k)=>{const v=clamp(dr*1.4-k/M.E.length*0.4,0,1);if(v<=0)return;const A=P(e[0]),B=P(e[1]);ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(lerp(A[0],B[0],v),lerp(A[1],B[1],v));ctx.stroke();});
  const d=o.dials||0;if(d>0){M.E.forEach((e,k)=>{if(k%2)return;const v=clamp(d*1.6-k*0.025,0,1);if(v<=0)return;const A=P(e[0]),B=P(e[1]),m=[(A[0]+B[0])/2,(A[1]+B[1])/2],r=16*ag_spr(v,0,0.4);
    ctx.fillStyle="#F6F4F0";ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(m[0],m[1],r,0,TAU);ctx.fill();ctx.stroke();ctx.lineWidth=2;for(let q=0;q<5;q++){const an=Math.PI*(0.8+q*0.35);ctx.beginPath();ctx.moveTo(m[0]+Math.cos(an)*r*0.6,m[1]+Math.sin(an)*r*0.6);ctx.lineTo(m[0]+Math.cos(an)*r*0.84,m[1]+Math.sin(an)*r*0.84);ctx.stroke();}
    ctx.fillStyle=rgba(col,0.35);ctx.beginPath();ctx.arc(m[0],m[1],2.5,0,TAU);ctx.fill();});}
  M.N.forEach((n,i)=>{const v=clamp(dr*2-i/M.N.length,0,1);if(v<=0)return;const q=P(i);ctx.fillStyle=rgba(col,v);ctx.beginPath();ctx.arc(q[0],q[1],9,0,TAU);ctx.fill();ctx.fillStyle=rgba([255,255,255],0.5*v);ctx.beginPath();ctx.arc(q[0]-2.5,q[1]-2.5,3,0,TAU);ctx.fill();});
  ctx.restore();}

/* ---------------------------------------------------------------- a page of notepaper, and words that arrive at a listener */
// a sheet of notepaper (x, y, w, h), its faint rules and margin, a soft shadow; o.rot turns it a little about its centre
function tt_page(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.26)";ctx.shadowBlur=30;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=14;ctx.fillStyle="#F4F0E4";ctx.fillRect(0,0,w,h);ctx.restore();
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,255,255,0.35)");g.addColorStop(1,"rgba(120,100,70,0.08)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  if(o.rules!==false){ctx.strokeStyle="rgba(110,140,170,0.16)";ctx.lineWidth=2;for(let yy=110;yy<h-30;yy+=52){ctx.beginPath();ctx.moveTo(24,yy);ctx.lineTo(w-24,yy);ctx.stroke();}
  ctx.strokeStyle="rgba(190,110,100,0.2)";ctx.beginPath();ctx.moveTo(110,20);ctx.lineTo(110,h-20);ctx.stroke();}ctx.restore();}
// the words of a story arriving at a listener who faces them: a row that starts at x0 at t0 and moves left (o.speed px a second) into
// the head at hx, each word fading as it goes in. Just before each word arrives (o.lead seconds), a soft violet guess lights where it
// will land, the word itself faint inside it, and the word arrives into it. Returns how strongly a guess is lit now (0 to 1)
function tt_listen(ctx,words,x0,hx,y,t,t0,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||36,sp=o.speed||150,lead=o.lead||0.55;let g=0,xx=x0;const off=sp*Math.max(0,t-t0);
  ctx.save();ctx.globalAlpha*=a;for(const w of words){const ww=ag_tw(ctx,w,{w:700,size}),left=xx-off,arrive=t0+(xx-hx)/sp,v=ag_in(t,arrive-lead,0.25)*(1-ag_in(t,arrive+0.05,0.3));g=Math.max(g,v);
    if(v>0.01){ctx.save();ctx.globalAlpha*=v;ctx.shadowColor=rgba(AG.violet,0.6);ctx.shadowBlur=18;ctx.fillStyle=rgba(AG.violet,0.2);rr(ctx,hx-10,y-size*0.86,ww+20,size*1.2,14);ctx.fill();ctx.restore();
      ag_T(ctx,w,hx,y,{w:700,size,col:AG.violet,a:v*0.45*(1-ag_in(t,arrive-0.15,0.2))});}
    if(left<W+40&&left+ww>hx-10){const fade=clamp((left-hx+ww*0.3)/(ww*0.3),0,1)*(1-ag_in(t,arrive+0.05,0.3))*clamp((W-20-left-ww)/80,0,1);if(fade>0)ag_T(ctx,w,left,y,{w:700,size,col:AG.ink,a:fade});}
    xx+=ww+size*0.36;}ctx.restore();return g*a;}
// a guess lighting in a head at (x, y): a soft violet light (v 0 to 1, r its radius)
function tt_headGuess(ctx,x,y,r,v){if(v<=0.01)return;ctx.save();const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(AG.violet,0.24*v));g.addColorStop(0.6,rgba(AG.violet,0.08*v));g.addColorStop(1,rgba(AG.violet,0));
  ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}

/* ---------------------------------------------------------------- the fly, its brain's map, and ours
   A fruit fly seen from above: six legs tapering at each joint, veined wings folded back, brick-red eyes. Its brain's map, a dense
   tangle: warm for the real brain, blue for the model built from the map. A human head's outline beside it, for scale in words. */
// a fruit fly at (x, y) facing up, size s (its body about 260 s px long); o.t twitches its legs a little, o.a
function tt_fly(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const t=o.t||0;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.lineCap="round";ctx.lineJoin="round";
  const leg=[60,50,44];ag_floorShadow(ctx,-6,30,150,40,0.22);
  // the legs: three pairs, each three segments thinning to the foot
  const legs=[[[-30,-40],[-80,-80],[-110,-150],[-122,-196]],[[-34,-10],[-100,-14],[-150,24],[-190,30]],[[-30,16],[-86,60],[-118,130],[-140,190]]];
  for(const L of legs)for(const sd of [-1,1]){const tw=Math.sin(t*3+L[0][1]*0.1+sd)*3;const p=L.map((q,i)=>[q[0]*(sd<0?1:-1)+(i>1?tw*sd:0),q[1]+(i>2?tw:0)]);
    for(let i=0;i<3;i++)tt_taper(ctx,[p[i],p[i+1]],lerp(11,4,i/2),lerp(8,2.4,i/2),rgba(leg,1));ctx.fillStyle=rgba(leg,1);for(let i=1;i<3;i++){ctx.beginPath();ctx.arc(p[i][0],p[i][1],lerp(5,2.6,i/2),0,TAU);ctx.fill();}}
  // the abdomen with its dark bands, the thorax with a few bristles, the head with its two big eyes
  const abd=cc=>cc.ellipse(0,74,50,78,0,0,TAU);ag_soft(ctx,abd,[196,154,96],[236,206,150],-14,50,80,"rgba(70,40,20,0.35)",12);
  ctx.save();ag_shape(ctx,abd);ctx.clip();ctx.fillStyle="rgba(78,54,38,0.75)";for(const yy of [62,92,120,146]){ctx.beginPath();ctx.ellipse(0,yy,60,9,0,0,TAU);ctx.fill();}ctx.restore();
  const thx=cc=>cc.ellipse(0,-14,44,48,0,0,TAU);ag_soft(ctx,thx,[176,132,80],[226,190,136],-12,-30,60,"rgba(70,40,20,0.35)",10);
  ctx.strokeStyle="rgba(50,36,26,0.8)";ctx.lineWidth=2;for(const b of [[-20,-40,-30,-58],[20,-40,30,-58],[-12,-20,-18,-40],[12,-20,18,-40],[-24,4,-36,-6],[24,4,36,-6]]){ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(b[2],b[3]);ctx.stroke();}
  const hd=cc=>cc.ellipse(0,-72,42,26,0,0,TAU);ag_soft(ctx,hd,[186,140,86],[226,190,136],-6,-80,40,"rgba(70,40,20,0.35)",8);
  for(const sd of [-1,1]){const ey=cc=>cc.ellipse(sd*30,-74,20,24,sd*0.3,0,TAU);ag_soft(ctx,ey,[166,48,38],[226,110,90],sd*26,-84,22,"rgba(60,10,10,0.4)",6);
    ctx.save();ag_shape(ctx,ey);ctx.clip();ctx.fillStyle="rgba(90,20,16,0.35)";for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){ctx.beginPath();ctx.arc(sd*30+i*6+(j%2)*3,-74+j*6,1.4,0,TAU);ctx.fill();}ctx.restore();
    ctx.strokeStyle="rgba(60,40,30,0.85)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sd*8,-94);ctx.lineTo(sd*14,-110);ctx.quadraticCurveTo(sd*26,-122,sd*34,-118);ctx.stroke();}
  // the wings, folded back in a V over the abdomen: see-through, with their veins
  for(const sd of [-1,1]){ctx.save();ctx.translate(sd*16,-6);ctx.rotate(sd*0.32);const wg=cc=>{cc.moveTo(0,0);cc.bezierCurveTo(sd*40,30,sd*48,150,sd*20,206);cc.bezierCurveTo(sd*4,226,sd*-20,214,sd*-14,170);cc.bezierCurveTo(sd*-10,110,sd*-8,40,0,0);cc.closePath();};
    ctx.beginPath();wg(ctx);ctx.fillStyle="rgba(226,232,236,0.42)";ctx.fill();ctx.strokeStyle="rgba(120,110,100,0.55)";ctx.lineWidth=1.8;ctx.stroke();
    ctx.save();ctx.beginPath();wg(ctx);ctx.clip();const sh=ctx.createLinearGradient(sd*-20,40,sd*40,180);sh.addColorStop(0,"rgba(255,255,255,0.35)");sh.addColorStop(0.5,"rgba(200,220,255,0.12)");sh.addColorStop(1,"rgba(255,230,240,0.2)");ctx.fillStyle=sh;ctx.fillRect(-80,-10,160,240);
      ctx.strokeStyle="rgba(110,96,84,0.5)";ctx.lineWidth=1.4;for(const v of [[4,10,sd*30,120,sd*24,200],[2,14,sd*14,110,sd*8,206],[0,16,sd*-2,100,sd*-8,190],[sd*6,8,sd*36,60,sd*34,150]]){ctx.beginPath();ctx.moveTo(v[0],v[1]);ctx.quadraticCurveTo(v[2],v[3],v[4],v[5]);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(sd*6,120);ctx.lineTo(sd*26,118);ctx.moveTo(sd*2,160);ctx.lineTo(sd*20,156);ctx.stroke();ctx.restore();ctx.restore();}
  ctx.restore();}
// the fly brain's map at (x, y), w wide: a central brain between two optic lobes, filled with a dense tangle of fine lines (kept once per
// colour). o.blue: the model built from the map (blue on pale); o.lit 0 to 1 lights a path of neurons from the taste centre at the
// bottom up into the brain; returns the path's points
const TT_FLYB=(()=>{const R=ag_rnd(41),lines=[],cells=[];const lobes=[[0,0,0.25,0.29],[-0.37,0.02,0.14,0.35],[0.37,0.02,0.14,0.35]];
  const which=(px,py)=>lobes.findIndex(e=>((px-e[0])**2)/(e[2]**2)+((py-e[1])**2)/(e[3]**2)<1);
  // short fine strokes: in the optic lobes they run in columns towards the middle, in the central brain every way, densest at its heart
  for(let i=0;i<1700;i++){let px,py,k;do{px=(R()-0.5)*1.06;py=(R()-0.5)*0.86;k=which(px,py);}while(k<0);const e=lobes[k];let an;
    if(k===0)an=R()*TAU;else an=(R()-0.5)*0.5+(py-e[1])*1.6*Math.sign(px);const l=0.012+R()*(k===0?0.03:0.04);lines.push([px,py,px+Math.cos(an)*l,py+Math.sin(an)*l,px+Math.cos(an+(R()-0.5))*l*2,py+Math.sin(an+(R()-0.5))*l*2,k]);}
  for(let i=0;i<120;i++){const k=i%3,e=lobes[k],an=R()*TAU,r=0.82+R()*0.16;cells.push([e[0]+Math.cos(an)*e[2]*r,e[1]+Math.sin(an)*e[3]*r]);}
  return{lines,cells,lobes,path:[[0,0.3],[0.03,0.2],[-0.02,0.1],[0.04,0.0],[0.0,-0.1],[0.06,-0.18],[0.11,-0.25]]};})();
function tt_flyBrain(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return[];const blue=!!o.blue,h=w*0.86,key="tt_flyb:"+(blue?1:0)+":"+Math.round(w);
  const pic=ag_kept(key,Math.ceil(w*1.12),Math.ceil(h*1.12),c=>{c.translate(w*0.56,h*0.56);const col=blue?AG.blue:[206,104,84];
    // a soft glow (the real brain) or a pale ground (the model), the outline of the three parts, then the strokes and the cells
    c.save();c.filter="blur("+Math.round(w*0.03)+"px)";c.fillStyle=blue?"rgba(206,222,234,0.55)":"rgba(255,196,160,0.45)";for(const e of TT_FLYB.lobes){c.beginPath();c.ellipse(e[0]*w,e[1]*w,e[2]*w*1.05,e[3]*w*1.05,0,0,TAU);c.fill();}c.restore();
    c.strokeStyle=rgba(col,0.3);c.lineWidth=2;for(const e of TT_FLYB.lobes){c.beginPath();c.ellipse(e[0]*w,e[1]*w,e[2]*w,e[3]*w,0,0,TAU);c.stroke();}
    c.lineCap="round";c.lineWidth=Math.max(1,w/520);for(const L of TT_FLYB.lines){c.strokeStyle=rgba(col,(blue?0.4:0.42)+(L[6]===0?0.12:0));c.beginPath();c.moveTo(L[0]*w,L[1]*w);c.quadraticCurveTo(L[2]*w,L[3]*w,L[4]*w,L[5]*w);c.stroke();}
    c.fillStyle=rgba(col,0.7);for(const q of TT_FLYB.cells){c.beginPath();c.arc(q[0]*w,q[1]*w,Math.max(1.6,w/260),0,TAU);c.fill();}});
  ctx.save();ctx.globalAlpha*=a;ctx.drawImage(pic,x-w*0.56,y-h*0.56);
  const P=TT_FLYB.path.map(q=>[x+q[0]*w,y+q[1]*w]),lit=o.lit||0;if(lit>0){const col=blue?[120,190,255]:[255,214,150],n=P.length;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=16;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);const m=lit*(n-1);
    for(let i=1;i<n;i++){if(i-1>m)break;const f=Math.min(1,m-(i-1));ctx.lineTo(lerp(P[i-1][0],P[i][0],f),lerp(P[i-1][1],P[i][1],f));}ctx.stroke();
    ctx.fillStyle="#FFFFFF";for(let i=0;i<n;i++){if(i>m+0.01)break;ctx.beginPath();ctx.arc(P[i][0],P[i][1],7,0,TAU);ctx.fill();}}
  ctx.restore();return P;}
// a drop of sugar water at (x, y), size r: a glossy bead with its highlight and shadow
function tt_drop(ctx,x,y,r,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x-r*0.2,y+r*0.7,r*1.1,r*0.3,0.25);
  const g=ctx.createRadialGradient(x-r*0.3,y-r*0.4,r*0.1,x,y,r*1.1);g.addColorStop(0,"rgba(255,255,255,0.85)");g.addColorStop(0.4,"rgba(236,226,200,0.55)");g.addColorStop(1,"rgba(200,180,140,0.5)");
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,r*1.15,r*0.85,0,0,TAU);ctx.fill();ctx.strokeStyle="rgba(170,150,110,0.6)";ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,0.9)";ctx.beginPath();ctx.ellipse(x-r*0.4,y-r*0.36,r*0.26,r*0.14,-0.5,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(255,252,240,0.95)";for(const q of [[0.2,0.1],[-0.1,0.3],[0.42,-0.1],[0.05,-0.2]]){ctx.save();ctx.translate(x+q[0]*r,y+q[1]*r);ctx.rotate(0.6);ctx.fillRect(-2.5,-2.5,5,5);ctx.restore();}ctx.restore();}
// a human head's outline in profile at (x, y) (its centre), h tall, facing right; inside it a fine field of points (o.fill 0 to 1)
function tt_headOutline(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const k=h/600;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(k,k);
  const hp=cc=>{cc.moveTo(-40,300);cc.bezierCurveTo(-40,240,-60,210,-120,170);cc.bezierCurveTo(-200,110,-220,-40,-170,-150);cc.bezierCurveTo(-120,-260,20,-300,120,-250);cc.bezierCurveTo(200,-210,220,-120,206,-60);
    cc.bezierCurveTo(230,-20,250,10,236,24);cc.bezierCurveTo(226,34,214,36,212,50);cc.bezierCurveTo(222,62,214,74,206,80);cc.bezierCurveTo(212,92,206,110,190,120);cc.bezierCurveTo(176,160,120,170,80,170);cc.bezierCurveTo(70,220,80,260,90,300);};
  const f=o.fill||0;if(f>0){const pic=ag_kept("tt_headDots",520,640,c=>{c.translate(260,320);c.beginPath();hp(c);c.closePath();c.clip();const g=c.createRadialGradient(0,-60,20,0,-60,300);g.addColorStop(0,"rgba(255,214,190,0.5)");g.addColorStop(1,"rgba(255,214,190,0.08)");c.fillStyle=g;c.fillRect(-260,-320,520,640);
      const R=ag_rnd(17);for(let i=0;i<4200;i++){const px=(R()-0.5)*480,py=(R()-0.5)*600;c.fillStyle=rgba([204,120,110],0.18+R()*0.4);c.beginPath();c.arc(px,py,0.8+R()*1.3,0,TAU);c.fill();}});
    ctx.save();ctx.globalAlpha*=f;ctx.drawImage(pic,-260,-320);ctx.restore();}
  ctx.strokeStyle=rgba(AG.ink,0.7);ctx.lineWidth=4/k*0.6;ctx.lineCap="round";ctx.beginPath();hp(ctx);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- music that comes through blurred, a rainstorm on a screen, a balance */
// an eighth note at (x, y) (its head), size s, its stem up
function tt_note(ctx,x,y,s,col,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=col;ctx.strokeStyle=col;ctx.lineWidth=3.2;ctx.lineCap="round";
  ctx.save();ctx.rotate(-0.4);ctx.beginPath();ctx.ellipse(0,0,11,8,0,0,TAU);ctx.fill();ctx.restore();ctx.beginPath();ctx.moveTo(9,-3);ctx.lineTo(9,-44);ctx.quadraticCurveTo(14,-30,26,-26);ctx.stroke();ctx.restore();}
// notes from (x0, y0) to (x1, y1), a few at a time; they blur and waver as they near the end (o.blur 0 to 1 how much)
function tt_notes(ctx,x0,y0,x1,y1,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const n=5,bl=o.blur==null?1:o.blur,col=o.col||"rgba(96,82,70,0.85)";
  for(let i=0;i<n;i++){const u=((t*0.22+i/n)%1+1)%1,x=lerp(x0,x1,u),y=lerp(y0,y1,u)+Math.sin(u*TAU*1.5+i)*30,b=bl*ag_ss(0.35,0.95,u),al=a*Math.sin(Math.PI*u);
    ctx.save();if(b>0.02)ctx.filter="blur("+(b*7).toFixed(1)+"px)";const wob=b*Math.sin(t*9+i)*6;tt_note(ctx,x+wob,y,1.1,col,al*(1-0.45*b));ctx.restore();}}
// a rainstorm inside a screen's glass, for ag_screen's draw: a grey sky, slanting rain, rings where it lands (t moves it)
function tt_rain(c,x,y,w,h,t){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();let g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#5E6A74");g.addColorStop(0.6,"#7C8790");g.addColorStop(1,"#5A6268");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.fillStyle="rgba(40,46,52,0.35)";c.fillRect(x,y+h*0.78,w,h*0.22);c.save();c.filter="blur("+Math.round(h*0.05)+"px)";c.fillStyle="rgba(210,218,226,0.12)";for(let i=0;i<5;i++){c.beginPath();c.ellipse(x+w*(0.1+i*0.22),y+h*0.1,w*0.18,h*0.1,0,0,TAU);c.fill();}c.restore();
  const R=ag_rnd(23);c.strokeStyle="rgba(226,234,240,0.55)";c.lineWidth=2;c.lineCap="round";for(let i=0;i<90;i++){const sx=R(),sp=0.7+R()*0.6,ph=R(),u=((t*sp*1.3+ph)%1),px=x+((sx*1.2-0.1)*w+u*h*0.18)%w,py=y+u*h*0.86;
    c.beginPath();c.moveTo(px,py);c.lineTo(px-6,py-26);c.stroke();}
  c.strokeStyle="rgba(226,234,240,0.4)";c.lineWidth=1.5;for(let i=0;i<14;i++){const u=((t*0.9+i/14)%1),px=x+w*((i*0.377)%1),py=y+h*(0.82+((i*0.29)%1)*0.14);c.globalAlpha=1-u;c.beginPath();c.ellipse(px,py,6+u*22,2+u*5,0,0,TAU);c.stroke();}
  c.restore();}
// a balance: an oak beam on a post at (x, y) (the pivot), w wide, tilted (radians); a card hangs by a cord from each end: words
// {title, sub} each, o.cw the cards' width; o.k springs it in; returns the cards' boxes
function tt_balance(ctx,x,y,w,tilt,L,R,o){o=o||{};const a=o.a==null?1:o.a,cw=o.cw||520;if(a<=0)return[];ctx.save();ctx.globalAlpha*=a;
  ag_soft(ctx,cc=>ag_rect(cc,x-10,y,20,o.post||300,6),AG_OAK.dark,AG_OAK.hi,x+4,y+40,80,"rgba(30,20,10,0.3)",6);
  const ends=[-1,1].map(sd=>[x+Math.cos(tilt)*sd*w/2,y+Math.sin(tilt)*sd*w/2]);ctx.save();ctx.translate(x,y);ctx.rotate(tilt);ag_soft(ctx,cc=>ag_rect(cc,-w/2,-10,w,20,10),AG_OAK.base,AG_OAK.hi,0,-6,w*0.4,"rgba(30,20,10,0.3)",6);ctx.restore();
  ctx.fillStyle=rgba(AG_OAK.dark,1);ctx.beginPath();ctx.arc(x,y,13,0,TAU);ctx.fill();const out=[];
  [L,R].forEach((wd,i)=>{if(!wd)return;const e=ends[i],cy=e[1]+70;ctx.strokeStyle="rgba(90,80,70,0.7)";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(e[0],e[1]);ctx.lineTo(e[0],cy);ctx.stroke();
    const k=o.k?o.k[i]:null,ca=o.ca?o.ca[i]:1;out.push(ag_textCard(ctx,e[0]-cw/2,cy,cw,wd,{k,a:ca}));});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- the pictures of feeling: two theories, a test, sleep and waking */
// a net of nodes woven tightly, every node tied to many (integrated information, in plain words: parts that work as one); at (x, y),
// radius r; o.k draws it in, o.t a slow shimmer along its ties
const TT_NET=(()=>{const R=ag_rnd(53),N=[];for(let i=0;i<22;i++){const an=i*2.4,rr=Math.sqrt((i+0.5)/22);N.push([Math.cos(an)*rr,Math.sin(an)*rr*0.86]);}
  const E=[];for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){const d=Math.hypot(N[i][0]-N[j][0],N[i][1]-N[j][1]);if(d<0.62||R()<0.06)E.push([i,j]);}return{N,E};})();
function tt_net(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const k=o.k==null?1:o.k,t=o.t||0,col=o.col||AG.violet;ctx.save();ctx.globalAlpha*=a;
  const P=i=>[x+TT_NET.N[i][0]*r,y+TT_NET.N[i][1]*r];ctx.lineCap="round";TT_NET.E.forEach((e,j)=>{const v=clamp(k*1.6-j/TT_NET.E.length*0.6,0,1);if(v<=0)return;const A=P(e[0]),B=P(e[1]),sh=0.5+0.5*Math.sin(t*2+j*0.7);
    ctx.strokeStyle=rgba(col,0.18+0.22*sh);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(lerp(A[0],B[0],v),lerp(A[1],B[1],v));ctx.stroke();});
  TT_NET.N.forEach((n,i)=>{const v=clamp(k*2-i/TT_NET.N.length,0,1);if(v<=0)return;const q=P(i),rr=10*ag_spr(v,0,0.5);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(q[0],q[1],rr,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.5)";ctx.beginPath();ctx.arc(q[0]-3,q[1]-3,rr*0.3,0,TAU);ctx.fill();});
  ctx.restore();}
// the 2025 test: a large sheet of predictions in two columns, one under each theory's picture (drawn small at the top of each column);
// rows of grey lines; marks (0 to 1 how many) come up on both, green where a prediction held and amber where it didn't
const TT_TEST=[[1,0],[0,1],[1,1],[0,0],[1,0]];   // for each row: [held for the first theory, held for the second]
function tt_testSheet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const m=o.marks||0;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,24,{});const cw=w/2;ctx.strokeStyle="rgba(120,116,110,0.25)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+cw,y+30);ctx.lineTo(x+cw,y+h-30);ctx.stroke();
  tt_net(ctx,x+cw*0.5,y+92,62,{});tt_brain(ctx,x+cw*1.5,y+96,0.26,{outline:1});tt_broadcast(ctx,x+cw*1.5,y+96,0.26,1,1);
  const rows=TT_TEST.length,top=y+190,rh=(h-230)/rows;TT_TEST.forEach((r,i)=>{for(let c=0;c<2;c++){const cx=x+c*cw,yy=top+i*rh;ctx.fillStyle="rgba(150,146,140,0.35)";rr(ctx,cx+40,yy,cw-150,14,7);ctx.fill();rr(ctx,cx+40,yy+26,(cw-150)*0.62,14,7);ctx.fill();
      const v=clamp(m*(rows+1)-i-c*0.4,0,1);if(v>0){const mx=cx+cw-66,my=yy+20,col=r[c]?AG.green:AG.amber;ctx.save();ctx.globalAlpha*=v;ag_about(ctx,mx,my,lerp(0.4,1,ag_spr(v,0,0.5)));
        if(r[c])ag_tick(ctx,mx,my,30,rgba(col,1),5);else{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(mx-12,my-12);ctx.lineTo(mx+12,my+12);ctx.moveTo(mx+12,my-12);ctx.lineTo(mx-12,my+12);ctx.stroke();}ctx.restore();}}});
  ctx.restore();}
// the sky over the brain: day (a sun), then night (a moon), then the dark of deep sleep (sky 0 day, 1 dreaming, 2 deep sleep, between
// them it dissolves); drawn in a soft rounded window (x, y, w, h)
function tt_sky(ctx,x,y,w,h,sky,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,28,{});ctx.save();rr(ctx,x+10,y+10,w-20,h-20,20);ctx.clip();
  const day=clamp(1-sky,0,1),dream=clamp(1-Math.abs(sky-1),0,1),deep=clamp(sky-1,0,1);const g=ctx.createLinearGradient(0,y,0,y+h);
  const top=mix(mix([150,196,232],[52,58,96],clamp(sky,0,1)),[18,20,34],deep),bot=mix(mix([226,236,240],[96,98,140],clamp(sky,0,1)),[30,32,48],deep);g.addColorStop(0,rgba(top,1));g.addColorStop(1,rgba(bot,1));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  const cx=x+w*0.5,cy=y+h*0.48;if(day>0){tt_glow(ctx,cx,cy,90,day,[255,240,190]);ctx.fillStyle=rgba([255,226,140],day);ctx.beginPath();ctx.arc(cx,cy,34,0,TAU);ctx.fill();}
  if(dream>0){ctx.fillStyle=rgba([240,236,220],dream);ctx.beginPath();ctx.arc(cx,cy,32,0,TAU);ctx.fill();ctx.fillStyle=rgba(mix(top,[40,44,80],0.3),dream);ctx.beginPath();ctx.arc(cx+14,cy-8,28,0,TAU);ctx.fill();
    ctx.fillStyle=rgba([240,236,220],0.8*dream);for(const q of [[-0.3,0.3],[0.32,0.22],[-0.18,0.7],[0.26,0.68],[0.4,0.45]]){ctx.beginPath();ctx.arc(x+w*(0.5+q[0]),y+h*q[1],2.4,0,TAU);ctx.fill();}}
  ctx.restore();ctx.restore();}
// three small signs (an eye, an ear, a hand) that slide in from three sides and settle into one frame at (x, y) (its centre): u 0 to 1
function tt_signs(ctx,x,y,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const fw=420,fh=170,k=ag_sine(clamp(u,0,1)),fa=clamp((u-0.7)/0.3,0,1);
  if(fa>0){ctx.save();ctx.globalAlpha*=fa;ctx.strokeStyle=rgba(AG.violet,0.8);ctx.lineWidth=4;rr(ctx,x-fw/2,y-fh/2,fw,fh,26);ctx.stroke();ctx.restore();}
  const S=[[-130,0,-700,0],[0,0,0,-560],[130,0,700,0]],ink=rgba(AG.ink,0.85);S.forEach((p,i)=>{const px=x+lerp(p[2],p[0],k),py=y+lerp(p[3],p[1],k);ctx.save();ctx.translate(px,py);ag_box(ctx,-56,-56,112,112,22,{});
    ctx.strokeStyle=ink;ctx.fillStyle=ink;ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";
    if(i===0){ctx.beginPath();ctx.moveTo(-34,0);ctx.quadraticCurveTo(0,-30,34,0);ctx.quadraticCurveTo(0,30,-34,0);ctx.stroke();ctx.beginPath();ctx.arc(0,0,10,0,TAU);ctx.fill();}
    else if(i===1){ctx.beginPath();ctx.moveTo(-14,26);ctx.bezierCurveTo(-16,38,4,40,8,26);ctx.bezierCurveTo(12,14,26,8,26,-10);ctx.bezierCurveTo(26,-32,8,-40,-6,-38);ctx.bezierCurveTo(-24,-36,-30,-20,-28,-8);ctx.stroke();ctx.beginPath();ctx.moveTo(-10,-10);ctx.bezierCurveTo(-8,-24,10,-24,10,-10);ctx.bezierCurveTo(10,0,0,2,0,10);ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(-22,34);ctx.lineTo(-22,-4);ctx.moveTo(-22,-4);ctx.lineTo(-22,-30);ctx.moveTo(-8,-4);ctx.lineTo(-8,-38);ctx.moveTo(6,-4);ctx.lineTo(6,-36);ctx.moveTo(20,0);ctx.lineTo(20,-28);ctx.moveTo(-22,34);ctx.quadraticCurveTo(24,40,26,10);ctx.lineTo(20,-2);ctx.moveTo(-22,6);ctx.quadraticCurveTo(-36,-6,-40,-18);ctx.stroke();}
    ctx.restore();});ctx.restore();}
// a bundle of tiny tubes inside a neuron, drawn as fine lattices (microtubules): n tubes across (x, y, w, h); o.pearl 0 to 1 a pearly
// shimmer moving along them (o.t); o.a
function tt_tubes(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const n=o.n||5,t=o.t||0,pe=o.pearl||0;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<n;i++){const ty=y+h*(i+0.5)/n,rad=h/n*0.3,tilt=Math.sin(i*2.3)*0.012;ctx.save();ctx.translate(x+w/2,ty);ctx.rotate(tilt);
    ag_soft(ctx,cc=>ag_rect(cc,-w/2,-rad,w,rad*2,rad),[214,208,214],[248,246,250],0,-rad*0.5,w*0.6,"rgba(80,70,90,0.3)",8);
    ctx.save();rr(ctx,-w/2,-rad,w,rad*2,rad);ctx.clip();ctx.fillStyle="rgba(120,110,130,0.4)";const sp=rad*0.34;for(let gx=-w/2;gx<w/2;gx+=sp)for(let k=-4;k<=4;k++){const gy=k*rad*0.22,off=(k%2)*sp/2,sq=Math.sqrt(Math.max(0,1-(gy/rad)**2));ctx.beginPath();ctx.ellipse(gx+off,gy,sp*0.3*sq+0.6,rad*0.08,0,0,TAU);ctx.fill();}
      if(pe>0){const px=((t*0.5+i*0.23)%1)*w*1.4-w*0.7;const g=ctx.createLinearGradient(px-120,0,px+120,0);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(0.5,"rgba(236,240,255,"+(0.75*pe)+")");g.addColorStop(1,"rgba(255,230,250,0)");ctx.fillStyle=g;ctx.fillRect(-w/2,-rad,w,rad*2);}
      ctx.restore();ctx.restore();}
  ctx.restore();}
// a book lying on the oak desk, its plain cover with the title (original design): at (x, y) its centre
function tt_book(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||-0.05);ag_floorShadow(ctx,8,150,260,26,0.3);
  ctx.fillStyle="#E6E0D2";ctx.beginPath();ctx.moveTo(-190,140);ctx.lineTo(214,140);ctx.lineTo(214,-136);ctx.lineTo(200,-150);ctx.lineTo(200,140);ctx.closePath();ctx.fill();ctx.fillStyle="#D8D0BE";ctx.fillRect(-190,140,404,14);
  ctx.strokeStyle="rgba(150,140,120,0.5)";ctx.lineWidth=1;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(-190,140+i*3.5);ctx.lineTo(214,140+i*3.5);ctx.stroke();}
  ag_soft(ctx,cc=>ag_rect(cc,-200,-150,400,290,8),[62,72,96],[96,108,136],-60,-100,320,"rgba(10,10,20,0.35)",10);
  ctx.strokeStyle="rgba(220,214,200,0.55)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(110,-30,64,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(110,-30,40,0.5,TAU-0.3);ctx.stroke();ctx.beginPath();ctx.arc(110,-30,18,1,TAU-0.6);ctx.stroke();
  ag_T(ctx,"I of the Vortex",-170,-60,{w:800,size:40,col:[240,236,226]});ag_T(ctx,"Llinás · 2001",-170,-14,{w:500,size:30,col:[214,210,200]});ctx.restore();}
// a checklist of signs, its rows grey (none ticked): n rows at (x, y), w wide; o.k springs it in; returns its height
function tt_checklist(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,n=o.n||14,rh=30,h=60+n*rh;if(a<=0)return h;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});for(let i=0;i<n;i++){const yy=y+34+i*rh;ctx.strokeStyle="rgba(140,136,130,0.6)";ctx.lineWidth=2;ctx.strokeRect(x+30,yy,18,18);ctx.fillStyle="rgba(150,146,140,0.32)";rr(ctx,x+64,yy+4,(w-110)*(0.55+0.4*((i*37)%10)/10),11,5);ctx.fill();}
  ctx.restore();return h;}

/* ===== What they tell us about ourselves: the eight chapters =====
   Each chapter is a few shots (ag_shots), cut together with short dissolves. Times inside a chapter come from its cues (when each
   line starts) and the words of its lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on
   cards, tags and pages, at least 28 px as seen, and above the captions; a place's year and name sit in the corner of the screen, so
   the camera doesn't move them. Things first, then the room's light, then cards and words. */

// made once per chapter, the first time it draws: its cues are known by then
const tt_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const TT_TITLE="What they tell us about ourselves";
// a corner label: in from t0, out at t1 (or it stays)
const tt_cornerAt=(ctx,t,text,t0,t1,o)=>tt_corner(ctx,text,t1==null?ag_in(t,t0,0.5):ag_io(t,t0,t1,0.5),o);
// a card that springs in at t0 and goes at t1 (or stays): its k and a
const tt_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// a draw-on from t0 over d seconds, eased
const tt_on=(t,t0,d)=>ag_sine(clamp((t-t0)/(d||1),0,1));
// the room's paper-pale veil inside a shot
function tt_veil(x,a){if(a<=0.01)return;x.save();x.fillStyle="rgba(240,238,233,"+clamp(a,0,1)+")";x.fillRect(-200,-200,W+400,H+400);x.restore();}
// a soft line of sound rising from (x, y): a wavering stroke that drifts up and fades (u 0 to 1 how far), for singing
function tt_song(x,px,py,tt,u,col){if(u<=0)return;x.save();x.lineCap="round";for(let k=0;k<3;k++){const v=((tt*0.4+k/3)%1),yy=py-v*220,al=u*Math.sin(Math.PI*v)*0.8;if(al<=0.01)continue;
  x.strokeStyle=rgba(col||[196,150,92],al);x.lineWidth=3.5;x.beginPath();for(let i=0;i<=30;i++){const w=i/30,xx=px-40+w*170+v*40,y2=yy-w*30+Math.sin(w*TAU*1.5+tt*3+k)*12;i?x.lineTo(xx,y2):x.moveTo(xx,y2);}x.stroke();}x.restore();}

/* ---------------------------------------------------------------- Rod and Margaret's living room, live
   The kettle, the radio and the telephone, each giving off soft rings of sound that fade before they reach Rod; Margaret's speech
   bubbles drifting to him (empty, or, once he hears, filled with soft lines of words). */
const TT_RADIO=[650,206];
// a memory's light: warm, soft at the edges
function tt_memWash(x){const g=x.createRadialGradient(960,540,320,960,540,1160);g.addColorStop(0,"rgba(250,238,218,0)");g.addColorStop(1,"rgba(236,220,196,0.88)");
  x.fillStyle=g;x.fillRect(0,0,W,H);x.fillStyle="rgba(250,238,218,0.14)";x.fillRect(0,0,W,H);}
// o.talk: Margaret talking (0 to 1); o.rings {kettle, radio, phone} 0 to 1; o.ring the telephone's own ringing; o.bubbles [{t0, fill}]: a
// bubble leaves her at t0 and reaches him 2.6 s later; o.rod, o.mag: options for each; o.turn 0 to 1 Rod turning to the telephone
function tt_homeLive(x,tt,o){o=o||{};const H_=TT_HOME,R=o.rings||{};
  tt_kettle(x,290,434,tt,{steam:R.kettle||0});tt_phone(x,H_.phone[0],H_.phone[1]+18,tt,{ring:o.ring||0});
  const talk=(o.talk||0)*(0.35+0.35*Math.sin(tt*9.3)*Math.sin(tt*3.1+1));
  tt_couple(x,tt,{mag:Object.assign({talk:Math.max(0,talk),smile:0.5,gaze:[3,0]},o.mag||{}),rod:Object.assign({gaze:[-3,0]},o.rod||{})});
  // rings of sound: from the kettle, the radio and the telephone, towards Rod, fading before they reach him
  const ear=tt_ear(H_.rod,H_.y,H_.s,true);
  if(R.kettle>0)tt_rings(x,366,368,tt,{a:R.kettle,dir:-0.7,spread:1.1,per:1.5});
  if(R.radio>0)tt_rings(x,TT_RADIO[0]+70,TT_RADIO[1],tt+0.4,{a:R.radio,dir:0.1,spread:1.1,per:1.3});
  if(R.phone>0)tt_rings(x,H_.phone[0]-50,H_.phone[1]-20,tt+0.8,{a:R.phone,dir:Math.PI*1.12,spread:1.1,per:0.9});
  // Margaret's bubbles: they leave her mouth and drift to his ear
  const m=tt_mouth(H_.mag,H_.y,H_.s,false);for(const b of (o.bubbles||[])){const u=(tt-b.t0)/2.6;if(u<=0||u>=1.15)continue;const q=ag_sine(Math.min(1,u)),
    bx=lerp(m[0]+16,ear[0]-(o.reach?285:260),q),by=lerp(m[1]-66,ear[1]-40,q)-Math.sin(Math.PI*q)*26,al=Math.min(1,u*5)*(1-clamp((u-(o.reach?0.85:0.7))/(o.reach?0.15:0.3),0,1));
    tt_bubble(x,bx,by,132,54,bx+66,by,{fill:b.fill==null?0.6:b.fill,a:al});}
  return ear;}
// Rod's head, close, facing left, for the implant and his brain doing the rest: the camera is 2.2 times closer on (1250, 420)
function tt_rodClose(x,tt,o){o=o||{};if(o.branch>0)tt_branchLight(x,1290,370,0.8,o.branch,1);
  ag_person(x,TT_ROD,1250,600,1.0,{t:tt,flip:true,covered:true,gaze:o.gaze||[-2,0],smile:o.smile||0.2,talk:o.talk||0});
  tt_implant(x,1250,600,1.0,{t:tt,wire:o.wire==null?1:o.wire,pulse:o.pulse||0,a:o.implant==null?1:o.implant});}

// ---- 1 · A rough copy: Rod, deaf, reads Margaret's lips; a hearing aid can't help; a pioneer's doubt; Clark's father; ten years and a
//          rough copy of the inner ear; August 1978; Waltzing Matilda; December; the copy was rough, his brain did the rest; 2019; the
//          same with agents; like us, and not ----
/* ---------------------------------------------------------------- today: the team at the long oak table, the agent at rest at its
   right end, the five questions on the wall above them. Each question's chapter takes its card off the wall (tt_cardFwd: forward,
   larger, the room veiled behind it) and puts it back with its tag */
const TT_SEATS=[["jun",270,false],["mei",580,false],["noor",890,false],["sam",1200,true],["yusuf",1500,true]];
const TT_REST=[1750,560,105,52];   // the agent at rest: x, y, the ring's radius, the sphere's
// a cup of coffee on the table, its foot at (x, y)
function tt_cup(ctx,x,y,s){s=s||1;ctx.save();ag_floorShadow(ctx,x+4,y+2,26*s,5*s,0.25);
  ag_soft(ctx,cc=>{cc.moveTo(x-20*s,y-36*s);cc.lineTo(x+20*s,y-36*s);cc.bezierCurveTo(x+20*s,y-10*s,x+14*s,y,x,y);cc.bezierCurveTo(x-14*s,y,x-20*s,y-10*s,x-20*s,y-36*s);cc.closePath();},[226,222,214],[250,248,244],x+8*s,y-30*s,30*s,"rgba(40,40,40,0.25)",6);
  ctx.strokeStyle="#D8D2C6";ctx.lineWidth=5*s;ctx.beginPath();ctx.arc(x+22*s,y-22*s,9*s,-Math.PI/2,Math.PI/2);ctx.stroke();
  ctx.fillStyle="#7A5A40";ctx.beginPath();ctx.ellipse(x,y-35*s,17*s,4*s,0,0,TAU);ctx.fill();ctx.restore();}
// the team: o.talk, o.gaze, o.smile, o.nod, o.pose2, o.mix, o.hold (each a list by seat: a hand that lifts something, from arms
// down), o.core and o.think for the agent
function tt_team(x,tt,o){o=o||{};const [rx,ry,R,r]=TT_REST;
  ag_loop(x,rx,ry,{t:tt,R,r,label:null,stepA:[0,0,0],core:o.core==null?0.4:o.core,think:o.think||0});
  ag_desk(x,60,1060,1800,{depth:190,th:30});
  TT_SEATS.forEach(([w,px,f],i)=>ag_person(x,w,px,740,0.5,{t:tt+px/100,flip:f,pose:o.pose2&&o.pose2[i]?"hang":null,cut:870,gaze:(o.gaze&&o.gaze[i])||[3,0],
    talk:o.talk?o.talk[i]||0:0,smile:o.smile?o.smile[i]:0.25,nod:o.nod?o.nod[i]||0:0,pose2:o.pose2?o.pose2[i]||null:null,mix:o.mix?o.mix[i]||0:0,
    hold:o.hold?o.hold[i]||null:null}));
  TT_SEATS.forEach(([w,px,f])=>tt_cup(x,px+(f?-80:80),950,1.1));}
// the room as a chapter opens or closes: the team, and the row with card i off the wall (tags: 0 to 1 for each card's tag)
function tt_roomRow(x,tt,i,tags,o){o=o||{};tt_team(x,tt,Object.assign({gaze:TT_SEATS.map(()=>[3,-1.5])},o));tt_qrow(x,{out:i,tags});ag_roomLight(x,1);}
// card i off the wall, in screen space: u 0 on the wall to 1 forward (in the middle, larger); the room veiled behind it as it comes
function tt_cardFwd(ctx,i,u,a){if(a<=0.01||u<=0)return;const w=TT_QW,h=224,q=ag_sine(clamp(u,0,1)),s=lerp(1,1.5,q),
  cx=lerp(TT_QX(i)+w/2,960,q),cy=lerp(TT_QY+h/2,470,q)-Math.sin(Math.PI*q)*40;
  tt_veil(ctx,0.72*q*a);ctx.save();ctx.globalAlpha*=a;ctx.translate(cx,cy);ctx.scale(s,s);tt_qcard(ctx,i,-w/2,-h/2,{lift:Math.min(1,u*3),pin:q<0.04,lit:q});ctx.restore();}
const tt_tagsBefore=i=>[0,1,2,3,4].map(j=>j<i?1:0);
// a chapter's first shot: the room, card i about to come forward; its last, from t0: card i goes back to the wall and its tag settles
const tt_openShot=i=>({at:0,place:"lab",keys:[[0,960,540,1]],d:2,push:0,draw:(x,tt)=>tt_roomRow(x,tt,i,tt_tagsBefore(i))});
const tt_closeShot=(i,t0)=>({at:t0,place:"lab",keys:[[t0,960,540,1]],d:2,push:0,draw:(x,tt)=>tt_roomRow(x,tt,tt<t0+1.9?i:-1,[0,1,2,3,4].map(j=>j<i?1:j===i?ag_in(tt,t0+1.9,0.5):0))});
// over the shots: card i forward as the chapter opens (it fades as the shot at t1 comes in), and back to the wall from t0
function tt_cardMoves(ctx,t,i,t1,t0){tt_cardFwd(ctx,i,tt_on(t,0.3,1.5),1-ag_in(t,t1,0.6));if(t0!=null&&t>=t0&&t<t0+1.9)tt_cardFwd(ctx,i,1-tt_on(t,t0+0.4,1.5),ag_in(t,t0,0.6));}
// a memory, full frame: the pharmacy where Graeme Clark watched his father go deaf
const tt_pharmShot=(t0,d)=>({at:t0,keys:[[t0,960,540,1.02],[t0+0.4,960,530,1.07]],d:d||5,push:0.01,draw:(x,tt)=>{x.save();x.scale(2,2);tt_pharmacy(x,960,540,tt,{});x.restore();tt_memWash(x);}});

scene("rough",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({lips:wAt(sc,"lips","lips"),voice:wAt(sc,"lips","voice"),louder:wAt(sc,"aid","louder"),
    inner:wAt(sc,"aid","inner ears"),brain:wAt(sc,"aid","brain"),voices:wAt(sc,"cut","voices"),y66:wAt(sc,"doubt","nineteen sixty-six"),sig:wAt(sc,"doubt","electric signals"),
    deaf:wAt(sc,"father","deaf"),rough:wAt(sc,"years","rough copy"),wire:wAt(sc,"implant","a fine wire"),ten:wAt(sc,"implant","ten electrodes"),pulses:wAt(sc,"implant","pulses"),
    went:wAt(sc,"august","went in"),played:wAt(sc,"sang","played"),along:wAt(sc,"sang","sang along"),words:wAt(sc,"december","words"),
    tenE:wAt(sc,"roughwas","ten electrodes"),thou:wAt(sc,"roughwas","thousands"),learned:wAt(sc,"rest","learned"),neurons:wAt(sc,"copies","neurons"),
    wrote:wAt(sc,"copies","what people wrote"),like:wAt(sc,"keep","like us"),not:wAt(sc,"keep","where they're not")}));
  const H_=TT_HOME,talkUntil=c.cut+1.5,bub=[1.4,4.6,8.2,11.6,15.6,19.4].map(t0=>({t0}));
  const homeO=tt=>({talk:ag_io(tt,0.8,talkUntil,0.5),bubbles:bub,rings:{kettle:ag_io(tt,c.cut,c.doubt+2,0.6),radio:ag_io(tt,c.cut+0.8,c.doubt+2,0.6),phone:ag_io(tt,c.cut+1.6,c.doubt+3,0.6)},
    ring:ag_io(tt,c.cut+1.6,c.doubt+3,0.3),rod:{gaze:tt>P.lips-0.2&&tt<c.aid+1?[-3,1.2]:[-3,0],smile:0.15}});
  const shots=[
    // the living room, the afternoon: she talks, he watches her lips; then wide, the kettle, the radio and the telephone
    {at:0,place:"tt_home",keys:[[0,1000,560,1.1],[c.cut-0.6,960,540,1.0]],d:7,push:0,draw:(x,tt)=>{tt_homeLive(x,tt,homeO(tt));
      const m=tt_mouth(H_.mag,H_.y,H_.s,false);tt_lips(x,m[0],m[1],H_.s,ag_io(tt,P.lips-0.2,c.aid+0.6,0.4));}},
    {cut:true,at:c.change-0.6,place:"tt_home",keys:[[c.change-0.6,960,540,1.0],[c.change-0.2,1500,400,1.5]],d:2.4,push:0.01,draw:(x,tt)=>tt_homeLive(x,tt,homeO(tt))},
    // a memory rises over the window: a small-town pharmacy (drawn as a soft card, in the screen's space)
    tt_pharmShot(c.father-0.3),
    {at:c.years-0.4,place:"tt_lab78",keys:[[c.years-0.4,960,560,1.04],[c.years,980,560,1.08]],d:6,push:0.01,draw:(x,tt)=>{
      tt_trolley(x,1060,560,{lit:0,reel:1});ag_person(x,TT_ENG2,1500,664,0.86,{t:tt+2,flip:true});
      ag_person(x,TT_CLARK,560,640,0.92,{t:tt,talk:0.4*ag_io(tt,c.years,c.implant+3,0.5)});ag_person(x,TT_ENG1,920,664,0.86,{t:tt+1,flip:true});}},
    // the rough copy of the inner ear: the spiral in a cutaway, its thousands of cells drawn faint; the wire winds in, ten rings settle
    {at:P.rough-0.3,place:"tt_labQuiet",keys:[[P.rough-0.3,960,520,1.0],[P.rough,960,500,1.04]],d:8,push:0.01,draw:(x,tt)=>{
      tt_spiral(x,960,500,330,{dots:0.55,wire:tt_on(tt,P.wire-0.2,2.4),rings:clamp((tt-P.ten+0.2)/0.35,0,10)});}},
    // 1 August 1978: the theatre's doors; then Rod's head, the implant under the skin behind his ear, the wire curling inwards
    {at:c.august-0.3,place:"tt_corridor",keys:[[c.august-0.3,960,540,1.0],[c.august,960,520,1.06]],d:4,push:0.01,draw:(x,tt)=>tt_theatreSign(x,1)},
    {cut:true,at:P.went-0.1,place:"tt_corridor",keys:[[P.went-0.1,1250,420,2.2]],d:3,push:0.02,draw:(x,tt)=>tt_rodClose(x,tt,{wire:tt_on(tt,P.went+0.2,1.6),smile:0.1})},
    // the lab: Rod in a chair with the coil behind his ear; the engineer starts the tape; ten lights, one after another; Rod sings
    {cut:true,at:c.sang-0.5,place:"tt_lab78",keys:[[c.sang-0.5,980,560,1.06],[P.along,900,520,1.14]],d:3,push:0.01,draw:(x,tt)=>{const lit=clamp((tt-P.played)/0.22,0,10),sing=ag_in(tt,P.along-0.1,0.5);
      tt_trolley(x,1060,560,{lit,reel:1});tt_chair(x,820,700,0.85);
      ag_person(x,TT_ROD,820,700,0.85,{t:tt,flip:true,talk:sing*(0.4+0.3*Math.sin(tt*6)),smile:lerp(0.1,0.9,ag_in(tt,P.played+1.6,0.8)),gaze:[-2,-0.6]});tt_coil(x,820,700,0.85,1080,640);
      ag_person(x,TT_ENG1,1520,664,0.86,{t:tt+1,flip:true});ag_person(x,TT_CLARK,330,660,0.9,{t:tt+2,smile:0.6*ag_in(tt,P.along,1)});
      const m=tt_mouth(820,700,0.85,true);tt_song(x,m[0]-210,m[1]-30,tt,sing,[196,150,92]);
      tt_tag(x,1210,470,"Waltzing Matilda",{a:ag_in(tt,c.sang,0.4),size:28});}},
    // December 1978: the audiologist hides her mouth behind a card (held before her face: front, not hold) and says a word; Rod says it back
    // (a later moment in the same room, later:true: the summer's people leave, then December's come in)
    {later:true,at:c.december-0.3,place:"tt_lab78",keys:[[c.december-0.3,960,560,1.1],[c.december,960,540,1.16]],d:4,push:0.01,draw:(x,tt)=>{
      tt_chair(x,1260,700,0.85);ag_person(x,TT_ROD,1260,700,0.85,{t:tt,flip:true,talk:0.5*ag_io(tt,P.words+0.9,P.words+2.2,0.2),smile:0.6,gaze:[-3,0]});
      ag_person(x,TT_AUD,640,690,0.86,{t:tt+1,pose:"hold",talk:0.5*ag_io(tt,P.words-0.4,P.words+0.6,0.2),front:(c2,h)=>{const n=h.near;ag_box(c2,n[0]-10,n[1]-310,200,290,10,{});}});
      tt_bubble(x,840,300,170,64,920,300,{a:ag_io(tt,P.words-0.3,P.words+1.0,0.3),fill:0.9});tt_bubble(x,1000,280,170,64,1080,280,{a:ag_io(tt,P.words+0.9,P.words+2.6,0.3),fill:0.9});}},
    // the copy was rough: the spiral again, its thousands of cells bright beside the ten blue rings
    {at:c.roughwas-0.3,place:"tt_labQuiet",keys:[[c.roughwas-0.3,960,500,1.04],[c.roughwas,960,520,1.0]],d:6,push:0.01,draw:(x,tt)=>{
      tt_spiral(x,960,500,330,{dots:1,bright:tt_on(tt,P.thou-0.2,1.2),wire:1,rings:10,lit:clamp((tt-P.tenE+0.2)/0.12,0,10)});}},
    // Rod's brain did the rest: warm light branching behind his head from the ten pulses
    {at:c.rest-0.3,place:"tt_home",keys:[[c.rest-0.3,1250,420,2.2]],d:3,push:0.03,draw:(x,tt)=>tt_rodClose(x,tt,{branch:tt_on(tt,c.rest+0.2,3.6),pulse:1,smile:0.5})},
    // 2019: a pale map of the world, and lights spreading across it
    {at:c.y2019-0.3,place:"tt_labQuiet",keys:[[c.y2019-0.3,960,520,1.0],[c.y2019,960,500,1.04]],d:6,push:0.01,draw:(x,tt)=>tt_worldMap(x,180,170,1560,tt_on(tt,c.y2019,4.6))},
    // the same with agents: the spiral dissolves into the agent's sphere in its ring; neurons in its band, pages flowing in
    {at:c.same-0.3,dis:0.9,place:"lab",keys:[[c.same-0.3,1124,500,1.12],[c.copies,1060,520,1.0]],d:2.6,push:0.01,draw:(x,tt)=>{const [rx,ry]=[1124,476],u=tt_on(tt,c.same+0.2,1.6);
      if(u<1)tt_spiral(x,rx,ry,lerp(200,90,u),{dots:0.8,wire:1,rings:10,a:1-u});
      ag_loop(x,rx,ry,{t:tt,a:u,label:null,stepA:[0,0,0],core:u});tt_roughCopy(x,rx,ry,88,tt,{a:u,neurons:ag_in(tt,P.neurons-0.2,0.8),pages:ag_in(tt,P.wrote-0.3,0.8)});
      ag_roomLight(x,1);
      const L=tt_pop(tt,P.like),N=tt_pop(tt,P.not);tt_tag(x,rx-420,ry-40,"like us",{a:L.a,k:L.k,col:AG.green});tt_tag(x,rx-420,ry+60,"not like us",{a:N.a,k:N.k,col:AG.amber});}}];
  // the window and the memory: a camera move inside the first shot (to the window at "change"), then the pharmacy card
  ag_shots(ctx,S,t,sc.dur,shots,0.6);setScreen(ctx,S);
  // over the living room: the hearing-aid card, then in 1966 the pulses and the doubt, the 'foreign language' tag
  const card=ag_io(t,c.aid-0.5,c.cut-0.2,0.5)+ag_io(t,c.doubt-0.3,c.change-0.3,0.5),cp=clamp((t-c.aid+0.2)/5.0,0,1);
  if(card>0.01){ctx.save();ctx.translate(70,60);ctx.scale(0.82,0.82);tt_aidCard(ctx,0,0,t,{a:card,p:t<c.doubt-0.4?cp:1,pulses:ag_in(t,P.sig-0.4,0.6),q:ag_in(t,c.foreign+0.4,0.6)});ctx.restore();
    tt_tag(ctx,812,262,"‘foreign language’",{a:card*ag_in(t,c.foreign-0.1,0.4),k:clamp(ag_spr(t,c.foreign-0.1,0.8),0,1.2),size:28});}
  // the memory: a small-town pharmacy, a man cupping his ear, a customer leaning in, a boy watching
    // the corner: the place and year of each scene
  tt_cornerAt(ctx,t,"Melbourne, Australia · 1978",1.6,c.doubt-0.4);tt_cornerAt(ctx,t,"1966",P.y66-0.2,c.change-0.4);
  tt_cornerAt(ctx,t,"1967–1977",c.years-0.2,c.august-0.4);tt_cornerAt(ctx,t,"1 August 1978",c.august-0.1,c.sang-0.5);tt_cornerAt(ctx,t,"December 1978",c.december-0.1,c.roughwas-0.4);
  // the copy's two tags, and the 'foreign language' tag that fades as his brain learns it; 2019's count
  const tg=ag_io(t,P.thou-0.2,c.rest-0.4,0.4);if(tg>0.01){tt_tag(ctx,1420,250,"thousands of cells",{a:tg,k:clamp(ag_spr(t,P.thou-0.2,0.8),0,1.2)});tt_tag(ctx,1420,760,"10 electrodes",{a:ag_io(t,P.tenE-0.1,c.rest-0.4,0.4),col:AG.blue});}
  const fl=ag_io(t,c.rest-0.2,P.learned+0.6,0.4);if(fl>0.01)tt_tag(ctx,700,200,"‘foreign language’",{a:fl*(1-ag_in(t,P.learned,1.2))});
  const yt=ag_io(t,c.y2019+0.3,c.same-0.4,0.4);if(yt>0.01)tt_tag(ctx,960,820,"2019 · more than 700,000 implants",{a:yt,k:clamp(ag_spr(t,c.y2019+0.3,0.8),0,1.2)});
  ag_title(ctx,S,t,c.breath,TT_TITLE,"five open questions","FILM 9 OF 10 · WHAT AN AGENT IS");});

scene("five",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({counted:wAt(sc,"counted","counted"),query:wAt(sc,"counted","query"),checked:wAt(sc,"signed","checked"),
    signed:wAt(sc,"signed","signed"),noans:wAt(sc,"noanswer","no answer")}));
  const ask=[c.jun,c.mei,c.noor,c.sam,c.yusuf].map(v=>v+0.5),A={x:300,y:120,w:500},RG=[1480,430];
  const shots=[
    // the answer comes out of the agent with its evidence; Mei checks it and signs at its foot
    {at:0,place:"lab",keys:[[0,1180,470,1.16],[c.counted-0.6,960,520,1.0]],d:2.8,push:0.01,draw:(x,tt)=>{const out=tt_on(tt,P.counted-0.2,1.1);
      ag_loop(x,RG[0],RG[1],{t:tt,R:170,r:83,label:null,stepA:[0,0,0],think:ag_io(tt,c.counted-0.2,P.counted+0.6,0.3)});
      ag_desk(x,180,1060,1000,{depth:190,th:30});
      ag_person(x,"mei",980,770,0.72,{t:tt,flip:true,cut:870,gaze:tt>c.signed-0.6?[3,-2.2]:[2,-1],nod:0.05*ag_io(tt,P.signed,P.signed+1.2,0.3)});
      if(out>0)ag_evidence(x,lerp(RG[0]-A.w/2,A.x,out),lerp(RG[1]-104,A.y,out),A.w,{title:"18,412 students",sub:"this term"},[{title:"the query",col:AG.orange}],
        {side:"right",ew:300,open:clamp((tt-P.query+0.1)/1.2,0,1),k:clamp(ag_spr(tt,P.counted-0.2,0.8),0,1.2),a:ag_in(tt,P.counted-0.2,0.3)});
      const so=ag_in(tt,c.signed+0.2,0.5);if(so>0.01)tt_signoff(x,A.x,A.y+232+20*(1-so),A.w,clamp((tt-P.checked)/(P.signed+0.9-P.checked),0,1),so);
      ag_roomLight(x,1);}},
    // over coffee: each question rises from the one who asks it and pins itself to the wall, in a row (a later moment: Mei and her
    // cards leave, then the team comes in)
    {later:true,at:c.coffee-0.4,place:"lab",keys:[[c.coffee-0.4,960,620,1.14],[c.coffee,960,540,1.0]],d:2.6,push:0,draw:(x,tt)=>{
      const cur=ask.reduce((k,a,i)=>tt>=a-0.5?i:k,-1),talk=ask.map((a,i)=>0.45*ag_io(tt,a-0.5,a+1.7,0.25)*(0.55+0.45*Math.sin(tt*8.7+i)));
      tt_team(x,tt,{talk,gaze:TT_SEATS.map((_,i)=>i===cur?[3,-2.5]:[3,0]),smile:TT_SEATS.map((_,i)=>i===cur?0.5:0.25)});
      ask.forEach((a,i)=>{const u=clamp((tt-a)/1.5,0,1);if(u<=0)return;const q=ag_sine(u),px=TT_SEATS[i][1];
        tt_qcard(x,i,lerp(px-TT_QW/2,TT_QX(i),q),lerp(470,TT_QY,q)-Math.sin(Math.PI*q)*30,{k:clamp(ag_spr(tt,a,0.9),0,1.2),lift:1-ag_in(tt,a+1.3,0.4),
          lit:ag_io(tt,a,(ask[i+1]||P.noans)-0.3,0.4),a:ag_in(tt,a,0.3),pin:u>0.92});});
      const oq=ag_in(tt,P.noans,0.5);if(oq>0.01)tt_tag(x,960,440,"open questions",{a:oq,k:clamp(ag_spr(tt,P.noans,0.8),0,1.2)});
      ag_roomLight(x,1);}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);
  tt_cornerAt(ctx,t,"Today",c.today-0.2,sc.dur-0.8);});

scene("taught",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({rough:wAt(sc,"perceptron","rough copy"),sense:wAt(sc,"senses","senses"),rem:wAt(sc,"senses","remembers"),
    act:wAt(sc,"senses","acts"),guess:wAt(sc,"descend","guessing"),predict:wAt(sc,"friston","predict"),errors:wAt(sc,"friston","errors"),ten:wAt(sc,"rods","ten rough signals"),
    voices:wAt(sc,"rods","voices"),next:wAt(sc,"levels","the next word"),story:wAt(sc,"levels","where the story"),five:wAt(sc,"cell","five to eight"),nk:wAt(sc,"nobody","nobody knows"),
    end:sc.dur-2.8}));
  const words=["Once","upon","a","time,","in","a","town","by","the","sea,","there","lived","a","girl","who","kept","a","lighthouse,","and","every","night","she"];
  const lt0=c.y2022+0.9,rodE=tt_ear(1250,700,0.85,true);
  const shots=[
    tt_openShot(0),
    // Buffalo, 1958: a man at a desk with papers, and on his page a neuron beside its copy
    {at:c.perceptron-0.5,place:"tt_office58",keys:[[c.perceptron-0.5,960,540,1.04],[c.perceptron,960,520,1.08]],d:5,push:0.01,draw:(x,tt)=>{
      tt_oldDesk(x,560,880,800,{});ag_person(x,TT_ROSEN,960,574,0.8,{t:tt,cut:790,gaze:[0,2.5]});}},
    {cut:true,at:P.rough-0.5,place:"tt_office58",keys:[[P.rough-0.5,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{tt_wash(x,0.4,{c:[60,48,36]});tt_page(x,300,160,1320,680,{rot:-0.012});
      tt_neuron(x,600,480,0.9,{grow:tt_on(tt,P.rough-0.3,1.6),fire:ag_io(tt,P.sense,P.act+1.2,0.4)});
      tt_perceptron(x,1190,480,1.15,{p:tt_on(tt,P.rough+0.9,1.6),fire:ag_io(tt,P.act-0.1,c.descend-0.6,0.3)});
      const tg=(w,at,X,Y)=>{const q=tt_pop(tt,at);tt_tag(x,X,Y,w,{a:q.a,k:q.k});};tg("sense",P.sense-0.1,1190-253,300);tg("remember",P.rem-0.1,1190-161,670);tg("act",P.act-0.1,1190+265,570);}},
    // today's models descend from it: the copy multiplies into a lattice that becomes the agent's band; words come out, each guessed first
    {at:c.descend-0.4,place:"lab",keys:[[c.descend-0.4,1060,500,1.06],[c.descend+3,960,540,1.0]],d:3,push:0,draw:(x,tt)=>{const [rx,ry]=[1124,476],g=tt_on(tt,c.descend+2.4,1.4);
      ag_loop(x,rx,ry,{t:tt,think:0.4+0.4*g,label:null,stepA:[0,0,0]});tt_lattice(x,520,430,640,380,tt_on(tt,c.descend,2.4),g,{bx:rx,by:ry,a:1-ag_in(tt,c.descend+3.6,0.6)});
      ag_roomLight(x,1);const w0=P.guess+0.2;tt_wordRow(x,["The","census","counts","every","student"],240,800,tt,{at:[w0,w0+0.55,w0+1.1,w0+1.65,w0+2.2]});}},
    // 2022: a person listening; a soft violet guess lights just before each word arrives
    {at:c.y2022-0.4,place:"tt_labQuiet",keys:[[c.y2022-0.4,960,540,1.0]],d:2,push:0.015,draw:(x,tt)=>{
      ag_person(x,TT_LISTEN,560,640,1.05,{t:tt,covered:true,gaze:[3,0]});const la=1-ag_in(tt,c.friston,0.6);
      const g=tt_listen(x,words,880,700,430,tt,lt0,{a:la});tt_headGuess(x,590,410,140,g*la);
      const lp=tt_on(tt,c.friston+0.3,1.6);if(lp>0)tt_miniLoop(x,1280,430,170,{p:lp,a:ag_in(tt,c.friston+0.2,0.4),lit:tt>P.errors?2:tt>P.predict+0.6?1:0});}},
    // Rod in 1978: ten rough signals, settling into the voice he remembers
    {at:c.rods-0.4,place:"tt_lab78",keys:[[c.rods-0.4,1000,540,1.04],[c.rods,1000,520,1.08]],d:5,push:0.01,draw:(x,tt)=>{
      tt_chair(x,1250,700,0.85);ag_person(x,TT_ROD,1250,700,0.85,{t:tt,flip:true,gaze:[-3,-0.5],smile:0.2+0.4*ag_in(tt,P.voices,1)});tt_coil(x,1250,700,0.85,1760,620);
      const mk=ag_in(tt,P.ten-0.3,0.8),glow=ag_in(tt,P.voices-0.2,1.2);
      if(mk>0.01){tt_glow(x,570,360,300,0.5*glow,TT_WARM);tt_memory(x,330,200,480,320,"margaret",(c2,w,h)=>{c2.drawImage(ag_place("tt_home"),-380,-300);
        ag_person(c2,TT_MARGARET,w*0.42,h*1.05,0.95,{t:tt+1,covered:true,talk:0.3*(0.5+0.5*Math.sin(tt*7)),smile:0.6,gaze:[3,0]});},{a:mk});}
      for(let i=0;i<10;i++){const u=(tt-P.ten-i*0.14)/1.3;if(u<=0||u>=1.1)continue;const q=ag_sine(Math.min(1,u)),px=lerp(rodE[0],760,q),py=lerp(rodE[1],380,q)-Math.sin(Math.PI*q)*170,
        al=Math.min(1,u*6)*(1-clamp((u-0.85)/0.25,0,1));x.save();x.shadowColor=rgba(AG.blue,0.8);x.shadowBlur=10;x.fillStyle=rgba(AG.blue,al);x.beginPath();x.arc(px,py,9,0,TAU);x.fill();x.restore();}}},
    // the copy stops somewhere: a brain guesses at many levels at once
    {at:c.stops-0.4,place:"tt_labQuiet",keys:[[c.stops-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{
      ag_person(x,TT_LISTEN,560,640,1.05,{t:tt,covered:true,gaze:[3,0]});tt_headGuess(x,590,410,140,0.5+0.3*Math.sin(tt*3));
      tt_levels(x,860,330,tt,{rows:[ag_in(tt,P.next-0.2,0.5),ag_in(tt,P.next+0.9,0.5),ag_in(tt,P.story-0.2,0.5)]});}},
    // one kind of brain cell, and the network it took to imitate it
    {at:c.cell-0.4,place:"tt_labQuiet",keys:[[c.cell-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{
      tt_neuron(x,600,440,0.95,{grow:tt_on(tt,c.cell,1.6)});tt_layers(x,1090,430,5+3*tt_on(tt,P.five+0.4,1.8),{a:ag_in(tt,P.five-0.4,0.5)});
      const q=tt_pop(tt,P.five+0.6);tt_tag(x,960,820,"1 brain cell · a network 5 to 8 layers deep",{a:q.a,k:q.k});}},
    // how a brain learns from its errors: the loop's way back turns to a dotted line, and a question mark
    {at:c.nobody-0.4,place:"tt_labQuiet",keys:[[c.nobody-0.4,960,540,1.0]],d:2,push:0.015,draw:(x,tt)=>tt_miniLoop(x,960,460,190,{p:1,dotted:tt_on(tt,P.nk-0.4,1.2)})},
    tt_closeShot(0,P.end)];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);
  tt_cardMoves(ctx,t,0,c.perceptron-0.5,P.end);
  tt_cornerAt(ctx,t,"Buffalo, New York · 1958",c.perceptron-0.1,c.descend-0.6);tt_cornerAt(ctx,t,"2022 · 9 people · a podcast",c.y2022-0.1,c.friston-0.2);
  const pc=ag_io(t,P.predict-0.2,c.rods-0.6,0.4);if(pc>0.01)tt_tag(ctx,1280,700,"predict · compare · learn",{a:pc,k:clamp(ag_spr(t,P.predict-0.2,0.8),0,1.2)});});

scene("mixing",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({whatever:wAt(sc,"lovelace","whatever"),combining:wAt(sc,"ways","combining"),exploring:wAt(sc,"ways","exploring"),
    changing:wAt(sc,"ways","changing"),mcomb:wAt(sc,"model","combine"),mexpl:wAt(sc,"model","explore"),life:wAt(sc,"brings","a life"),intention:wAt(sc,"brings","an intention"),
    reasonW:wAt(sc,"brings","a reason"),notsci:wAt(sc,"science","not for science"),mean:wAt(sc,"choice","what we mean"),achoice:wAt(sc,"choice","a choice"),end:sc.dur-2.8,three:wAt(sc,"boden","three ways")}));
  const H0=c.others+0.15,seg=[[H0,H0+1.4],[H0+1.75,H0+2.85],[H0+3.2,H0+4.3]];
  const shots=[tt_openShot(1),
    // the agent writes a short poem: each word made of small pages that stream into the ring and come out as words
    {cut:true,at:2.4,place:"lab",keys:[[2.4,1000,500,1.04]],d:2,push:0.012,draw:(x,tt)=>{const [rx,ry]=[1124,476];ag_loop(x,rx,ry,{t:tt,think:0.8,label:null,stepA:[0,0,0]});
      tt_roughCopy(x,rx,ry,88,tt,{pages:1,neurons:0,from:"right"});ag_roomLight(x,1);tt_poem(x,180,330,tt,3.0,{src:[rx-60,ry],rate:0.2});}},
    // a grandmother draws a house and passes the pencil; a parent adds a tree; a child adds a sun with a face no one else would have drawn
    {at:c.others-0.4,place:"tt_tableTop",keys:[[c.others-0.4,960,520,1.0]],d:2,push:0.02,draw:(x,tt)=>{
      tt_page(x,560,190,800,640,{rot:0.02,rules:false});const pr=k=>tt_on(tt,seg[k][0],seg[k][1]-seg[k][0]),tip=tt_drawing(x,980,560,1.0,pr(0),pr(1),pr(2));
      const hand=(k,first,last,ang,s,o)=>{const [a,b]=seg[k],io=ag_io(tt,a-0.5,b+0.25,0.45);if(io<=0.01)return;const p=tt>=a&&tt<=b&&tip?tip:tt<a?first:last,d=760*(1-io);
        tt_handTop(x,p[0]+Math.cos(ang)*d,p[1]+Math.sin(ang)*d,ang,s,o);};
      hand(0,[680,550],[698,574],-2.4,1.0,{age:1,sleeve:[120,110,130],skin:[228,194,170]});
      hand(1,[1010,680],[1020,606],0.15,1.0,{sleeve:[90,110,130],skin:[200,150,116]});
      hand(2,[1230,452],[1305,450],1.25,0.72,{sleeve:[200,120,90],skin:[236,204,178]});}},
    // England, 1843: Lovelace writing her notes, a drawing of the engine's columns of gears beside her
    {at:c.lovelace-0.4,place:"tt_room1843",keys:[[c.lovelace-0.4,960,560,1.06],[c.lovelace,960,540,1.0]],d:4,push:0.01,draw:(x,tt)=>{
      tt_engine(x,150,150,360,300,{turn:tt});tt_oldDesk(x,560,880,760,{});ag_person(x,TT_ADA,940,574,0.8,{t:tt,cut:790,gaze:[0,2.5]});
      const q=tt_pop(tt,P.whatever-0.2);tt_quote(x,600,110,"‘whatever we know how to order it to perform’","Ada Lovelace",{w:720,a:q.a,k:q.k});}},
    // Boden's three ways; the agent's violet lines rearrange inside the first two
    {at:c.boden-0.4,place:"tt_labQuiet",keys:[[c.boden-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{
      [["combine",P.combining,P.mcomb],["explore",P.exploring,P.mexpl],["rules",P.changing,null]].forEach(([k,at,vat],i)=>{const q=tt_pop(tt,P.three+i*0.3);
        tt_bodenCard(x,k,150+i*570,250,480,tt_on(tt,at+0.1,1.6),vat?ag_in(tt,vat-0.1,0.8):0,{a:q.a,k:q.k});});}},
    // what a person brings: a life, an intention, a reason
    {at:c.brings-0.4,place:"lab",keys:[[c.brings-0.4,1060,540,1.0]],d:2,push:0.015,draw:(x,tt)=>{tt_glow(x,980,420,520,0.5*ag_in(tt,P.life-0.3,1.2),TT_WARM);
      ag_person(x,"mei",1480,620,0.92,{t:tt,flip:true,gaze:[3,-1],smile:0.35});
      [["a life",P.life],["an intention",P.intention],["a reason",P.reasonW]].forEach(([w,at],i)=>{const q=tt_pop(tt,at-0.15);
        if(q.a>0.01)ag_textCard(x,780,170+i*160+30*(1-ag_sine(clamp((tt-at+0.15)/0.8,0,1))),380,{title:w},{a:q.a,k:q.k});});
      ag_roomLight(x,1);}},
    tt_pharmShot(c.reason-0.4,4),
    // Boden's answer
    {at:c.science-0.4,place:"tt_labQuiet",keys:[[c.science-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{const X=430,Y=220,Wd=1060;
      ag_box(x,X,Y,Wd,400,26,{});ag_T(x,"whether a computer could really be creative",X+56,Y+92,{w:700,size:40});
      x.strokeStyle="rgba(60,50,40,0.14)";x.lineWidth=1.5;x.beginPath();x.moveTo(X+56,Y+134);x.lineTo(X+Wd-56,Y+134);x.stroke();
      [["not for science alone",P.notsci],["partly what we mean",P.mean],["partly a choice",P.achoice]].forEach(([w,at],i)=>{const v=ag_in(tt,at-0.15,0.45);if(v<=0.01)return;
        const yy=Y+200+i*70;x.save();x.globalAlpha*=v;x.fillStyle=rgba(AG_OAK.dark,1);x.beginPath();x.arc(X+70,yy-11,7,0,TAU);x.fill();x.restore();
        ag_T(x,w,X+96+16*(1-v),yy,{w:600,size:34,a:v});});}},
    tt_closeShot(1,P.end)];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);tt_cardMoves(ctx,t,1,2.4,P.end);
  tt_cornerAt(ctx,t,"England · 1843",c.lovelace-0.1,c.boden-0.5);tt_cornerAt(ctx,t,"1990 · Margaret Boden",c.boden-0.1,c.brings-0.5);});

scene("wire",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({w302:wAt(sc,"worm","three hundred and two"),wrig:wAt(sc,"wriggles","wriggles"),notmuch:wAt(sc,"wriggles","not much more"),
    map:wAt(sc,"wriggles","a map"),how:wAt(sc,"wriggles","how each"),n139:wAt(sc,"fly","a hundred and thirty-nine"),sugar:wAt(sc,"sugar","sugar"),predicted:wAt(sc,"sugar","predicted"),
    b86:wAt(sc,"billion","eighty-six billion"),madefor:wAt(sc,"speech","made for speech"),music:wAt(sc,"speech","music"),rain:wAt(sc,"searle","simulated rainstorm"),
    mind:wAt(sc,"others","a mind is"),nobody:wAt(sc,"who","Nobody knows"),end:sc.dur-2.8}));
  const H_=TT_HOME;
  const shots=[tt_openShot(2),
    // a worm a millimetre long, drawn large, its 302 neurons inside it
    {at:c.worm-0.4,place:"tt_tableTop",keys:[[c.worm-0.4,960,480,1.0],[c.worm,960,470,1.1]],d:4,push:0.01,draw:(x,tt)=>{tt_worm(x,960,470,1200,tt,{});
      const q=tt_pop(tt,P.w302-0.1);tt_tag(x,960,800,"302 neurons · 1986",{a:q.a,k:q.k});}},
    // its copy on a computer: it wriggles, but not much more
    {at:c.openworm-0.4,place:"lab",keys:[[c.openworm-0.4,960,540,1.0]],d:2,push:0.015,draw:(x,tt)=>{ag_desk(x,260,1060,1400,{depth:300,th:30});
      ag_screen(x,560,250,800,500,{stand:60,draw:(c2,X,Y,w,h)=>tt_worm(c2,X+w/2,Y+h/2,w*0.8,tt,{blue:1})});ag_roomLight(x,1);
      const a1=tt_pop(tt,P.wrig-0.3),a2=tt_pop(tt,P.notmuch-0.2);tt_tag(x,1600,420,"wriggles",{a:a1.a,k:a1.k});tt_tag(x,1600,520,"much more · not yet",{a:a2.a,k:a2.k});}},
    // a map doesn't say how each connection works, or when
    {at:P.how-0.5,place:"tt_labQuiet",keys:[[P.how-0.5,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{tt_wireMap(x,960,430,1400,560,{draw:tt_on(tt,P.how-0.4,1.2),dials:tt_on(tt,P.how+0.6,1.2)});
      const q=tt_pop(tt,P.how+1.0);tt_tag(x,960,800,"how strong? when?",{a:q.a,k:q.k});}},
    // 2024: a fly, and its whole brain's map
    {at:c.fly-0.4,place:"tt_labQuiet",keys:[[c.fly-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{tt_fly(x,960,500,0.55,{t:tt});
      tt_flyBrain(x,960,240,520,{lit:0,a:ag_in(tt,c.fly+0.8,1.0)});const q=tt_pop(tt,P.n139-0.1);tt_tag(x,1480,240,"139,255 neurons",{a:q.a,k:q.k});}},
    // sugar: in the model of the map a path of neurons lights, and in the real fly's brain the same ones
    {at:c.sugar-0.4,place:"tt_labQuiet",keys:[[c.sugar-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{tt_fly(x,880,560,0.5,{t:tt});tt_drop(x,1040,600,34,ag_in(tt,P.sugar-0.4,0.5));
      tt_flyBrain(x,560,300,460,{lit:tt_on(tt,P.sugar+0.4,1.2)});tt_flyBrain(x,1360,300,460,{blue:1,lit:tt_on(tt,P.predicted,1.2)});
      const tk=ag_in(tt,P.sugar+1.4,0.4);if(tk>0.01)ag_tick(x,960,250,40*clamp(ag_spr(tt,P.sugar+1.4,0.6),0,1.2),rgba(AG.green,tk),6);}},
    // we have about 86 billion: the fly's map shrinks to a dot beside a human head
    {at:c.billion-0.4,place:"tt_labQuiet",keys:[[c.billion-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{const u=tt_on(tt,c.billion-0.3,1.3);
      if(u<1)tt_flyBrain(x,lerp(960,640,u),lerp(300,560,u),lerp(460,14,u),{lit:1,a:1-0.6*u});
      tt_headOutline(x,1100,430,620,{fill:ag_in(tt,P.b86-0.3,1.4),a:ag_in(tt,c.billion,0.8)});
      if(u>0.8){tt_glow(x,640,560,30,ag_in(tt,c.billion+0.8,0.4),[255,200,160]);x.fillStyle=rgba([206,104,84],1);x.beginPath();x.arc(640,560,7,0,TAU);x.fill();}
      const q=tt_pop(tt,P.b86);tt_tag(x,1100,820,"about 86 billion",{a:q.a,k:q.k});}},
    // a copy can act like us without working like us: Rod's implant was made for speech; music comes through blurred
    {at:c.act-0.4,place:"tt_home",keys:[[c.act-0.4,960,540,1.0],[c.ear,1050,480,1.12]],d:3,push:0.01,draw:(x,tt)=>{
      tt_homeLive(x,tt,{talk:ag_io(tt,c.act,c.speech+1.2,0.5),bubbles:[0.3,3.3,6.3,9.3,12.3].map(v=>({t0:c.act+v,fill:0.8})),reach:true,rod:{gaze:[-3,0],smile:0.45}});
      tt_implant(x,H_.rod,H_.y,H_.s,{t:tt,pulse:1});
      const nb=ag_io(tt,P.music-0.4,c.exactly-0.3,0.4);if(nb>0.01){tt_rings(x,TT_RADIO[0]+70,TT_RADIO[1],tt,{a:nb*0.7,dir:0.1,spread:1.1,per:1.3});tt_notes(x,700,230,1180,380,tt,{a:nb,blur:1});}
      const q=tt_pop(tt,P.madefor-0.1);tt_tag(x,1500,180,"made for speech",{a:q.a,k:q.k});}},
    // 1980: a simulated rainstorm, and a man in front of it, dry
    {at:c.exactly-0.4,place:"lab",keys:[[c.exactly-0.4,960,540,1.0]],d:2,push:0.015,draw:(x,tt)=>{
      ag_screen(x,420,170,900,560,{stand:0,draw:(c2,X,Y,w,h)=>tt_rain(c2,X,Y,w,h,tt)});ag_person(x,TT_SEARLE,1500,600,1.0,{t:tt,flip:true,gaze:[3,-0.5]});ag_roomLight(x,1);
      const q=tt_pop(tt,P.rain-0.2);tt_tag(x,870,800,"a simulated rainstorm · nobody gets wet",{a:q.a,k:q.k});}},
    // the other side comes down to balance it; nobody knows who's right
    {at:c.others-0.4,place:"tt_labQuiet",keys:[[c.others-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{const rIn=ag_in(tt,P.mind-0.3,0.6),
      tilt=lerp(lerp(-0.16,0.05,ag_sine(tt_on(tt,P.mind,1.2))),0,ag_sine(tt_on(tt,P.nobody,1.6)));
      tt_balance(x,960,230,1100,tilt,{title:"a simulated rainstorm",sub:"nobody gets wet"},{title:"a mind is what a brain does"},{cw:560,post:420,ca:[1,rIn],k:[null,clamp(ag_spr(tt,P.mind-0.3,0.8),0,1.2)]});}},
    tt_closeShot(2,P.end)];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);tt_cardMoves(ctx,t,2,c.worm-0.4,P.end);
  tt_cornerAt(ctx,t,"since 2011",c.openworm-0.1,P.how-0.6);tt_cornerAt(ctx,t,"2024",c.fly-0.1,c.billion-0.5);tt_cornerAt(ctx,t,"1980 · John Searle",c.exactly-0.1,c.others-0.5);});

scene("feels",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({one:wAt(sc,"one","work as one"),news:wAt(sc,"another","news shared"),chal:wAt(sc,"test","challenged"),
    hard:wAt(sc,"chalmers","the hard problem"),phys:wAt(sc,"why","physical"),rich:wAt(sc,"why","rich inner life")}));
  const H_=TT_HOME;
  const shots=[tt_openShot(3),
    // Rod and Margaret, close: pulses run along the wire; the implant hears nothing; Rod does, and laughs at what she says
    {at:c.pulses-0.4,place:"tt_home",keys:[[c.pulses-0.4,960,440,1.42],[c.pulses,960,430,1.5]],d:4,push:0.01,draw:(x,tt)=>{
      tt_glow(x,960,410,360,0.75*ag_in(tt,c.roddid-0.1,1.4),TT_WARM);
      const laugh=ag_io(tt,c.roddid+0.3,c.chalmers,0.3);
      tt_homeLive(x,tt,{talk:ag_io(tt,c.pulses-0.4,c.roddid+0.4,0.4),bubbles:[0.2,3.0,5.8].map(v=>({t0:c.pulses+v,fill:0.8})),reach:true,
        rod:{gaze:[-3,0],smile:lerp(0.25,1,ag_in(tt,c.roddid+0.1,0.6)),talk:laugh*(0.35+0.3*Math.abs(Math.sin(tt*11))),nod:0.04*laugh*Math.sin(tt*9)},mag:{smile:lerp(0.5,0.9,laugh)}});
      tt_implant(x,H_.rod,H_.y,H_.s,{t:tt,pulse:ag_in(tt,c.pulses+0.6,0.5)});}},
    // 1995, the hard problem: a brain at work on one side, a life felt from inside on the other, and a question between them
    {at:c.chalmers-0.4,place:"tt_labQuiet",keys:[[c.chalmers-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{
      const ba=ag_in(tt,c.chalmers+0.3,0.7),pa=ag_in(tt,P.hard-0.2,0.8),qm=tt_pop(tt,P.hard+0.4),q=tt_pop(tt,c.why-0.3),t1=tt_pop(tt,P.phys),t2=tt_pop(tt,P.rich);
      tt_brain(x,500,540,0.95,{a:ba,sweep:{u:((tt*0.9)%1+1)%1,a:ba}});tt_couplePic(x,1180,330,560,420,tt,pa);tt_gapLine(x,720,1120,560,qm.a,960);
      ag_T(x,"?",960,590,{w:800,size:84,align:"center",col:AG.amber,a:qm.a});
      tt_tag(x,500,830,"physical processing",{a:t1.a,k:t1.k});tt_tag(x,1460,830,"a rich inner life",{a:t2.a,k:t2.k});
      tt_quote(x,330,160,"‘Why should physical processing give rise to a rich inner life at all?’",null,{w:1260,a:q.a,k:q.k});}},
    // two theories: parts that work as one; news shared across the brain
    {at:c.theories-0.4,place:"tt_labQuiet",keys:[[c.theories-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{
      tt_net(x,700,420,230,{k:tt_on(tt,c.one+0.3,1.8),t:tt});const ba=ag_in(tt,c.another-0.2,0.6);
      tt_brain(x,1320,420,0.62,{outline:1,a:ba});tt_broadcast(x,1320,420,0.62,tt_on(tt,P.news-0.2,1.4),ba);
      const q1=tt_pop(tt,P.one),q2=tt_pop(tt,P.news+0.2);tt_tag(x,700,780,"parts that work as one",{a:q1.a,k:q1.k});tt_tag(x,1320,780,"news shared across the brain",{a:q2.a,k:q2.k});}},
    // 2025: a test of both, with rules agreed beforehand; marks on both columns, amber on both
    {at:c.test-0.4,place:"tt_labQuiet",keys:[[c.test-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{tt_testSheet(x,460,140,1000,720,{marks:tt_on(tt,P.chal-0.4,2.4),k:clamp(ag_spr(tt,c.test-0.2,0.8),0,1.2),a:ag_in(tt,c.test-0.3,0.4)});}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);tt_cardMoves(ctx,t,3,c.pulses-0.4,null);
  tt_cornerAt(ctx,t,"1995 · David Chalmers · the hard problem",c.chalmers-0.1,c.theories-0.5);tt_cornerAt(ctx,t,"2025 · 256 people · rules agreed beforehand",c.test-0.1,sc.dur-0.4);});

scene("machine",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({awake:wAt(sc,"llinas","awake"),dream:wAt(sc,"llinas","dreaming"),forty:wAt(sc,"llinas","forty times"),
    micro:wAt(sc,"penrose","microtubules"),wipe:wAt(sc,"critics","wipe out"),tests:wAt(sc,"disagree","tests go on"),none:wAt(sc,"none","None"),obvious:wAt(sc,"none","nothing obvious"),
    end:sc.dur-2.8}));
  const sheet={at:0,place:"tt_labQuiet",keys:[[0,960,540,1]],d:2,push:0,draw:(x,tt)=>tt_testSheet(x,460,140,1000,720,{marks:1})};
  const shots=[sheet,
    {at:0.05,place:"lab",keys:[[0,960,540,1]],d:2,push:0,draw:(x,tt)=>tt_roomRow(x,tt,3,tt_tagsBefore(3))},
    // a calm brain, a fast shimmer sweeping through it, awake and dreaming; in deep sleep it fades
    {at:c.llinas-0.4,place:"tt_labQuiet",keys:[[c.llinas-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{
      const sky=clamp((tt-P.dream+0.2)/1.0,0,1)+clamp((tt-c.sleep-0.2)/1.4,0,1),slow=lerp(1,0.25,clamp(sky-1,0,1)),sa=1-0.85*clamp(sky-1,0,1);
      tt_sky(x,760,80,400,210,sky);tt_brain(x,960,500,0.8,{sweep:{u:((tt*1.25*slow)%1+1)%1,a:sa*ag_in(tt,c.llinas+0.6,0.8)}});
      const aw=ag_io(tt,P.awake-0.1,c.sleep,0.4),dr=ag_io(tt,P.dream-0.1,c.sleep,0.4),ds=ag_in(tt,c.sleep+0.3,0.5);
      tt_tag(x,640,190,"awake",{a:aw*(sky<0.5?1:0.55)});tt_tag(x,1280,190,"dreaming",{a:dr*(sky>0.5?1:0.55)});tt_tag(x,1280,250,"deep sleep",{a:ds});
      const q=tt_pop(tt,P.forty-0.1);tt_tag(x,1490,520,"about 40 times a second",{a:q.a*(1-0.5*ds),k:q.k});
      tt_signs(x,960,800,tt_on(tt,c.ties+0.3,1.8),{a:ag_io(tt,c.ties,c.penrose-0.6,0.5)});}},
    // into a neuron, to its tiny tubes, a pearly shimmer moving in them
    {cut:true,at:c.penrose-0.4,place:"tt_labQuiet",keys:[[c.penrose-0.4,960,520,1.0],[c.penrose+0.6,960,522,3.0]],d:2.8,push:0,draw:(x,tt)=>tt_neuron(x,960,520,1.5,{grow:1})},
    {cut:true,at:P.micro-0.5,place:"tt_labQuiet",keys:[[P.micro-0.5,960,500,1.08],[P.micro,960,520,1.0]],d:2.4,push:0.01,draw:(x,tt)=>{const gone=tt>P.wipe+0.1;
      tt_tubes(x,360,240,1200,420,{pearl:gone?0:ag_in(tt,P.micro,0.6),t:tt});const m=tt_pop(tt,P.micro+0.2);tt_tag(x,960,700,"microtubules",{a:m.a,k:m.k});
      const g=tt_pop(tt,P.wipe+0.3),n=tt_pop(tt,c.disagree+0.3),o=tt_pop(tt,P.tests-0.1);
      tt_tag(x,560,790,"gone too fast to matter?",{a:g.a,k:g.k,col:AG.amber});tt_tag(x,1360,790,"not so fast",{a:n.a,k:n.k});tt_tag(x,960,790,"tests go on",{a:o.a,k:o.k});}},
    // what Llinás wrote, and what he later asked
    {at:c.y2001-0.4,place:"lab",keys:[[c.y2001-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{ag_desk(x,120,1060,1680,{depth:300,th:30});tt_book(x,600,780,{});ag_roomLight(x,1);
      const q1=tt_pop(tt,c.y2001+1.2),q2=tt_pop(tt,c.y2007+0.4);
      tt_quote(x,980,150,"‘I sincerely doubt it is a plausible scenario worth pursuing at any serious level.’","Rodolfo Llinás · 2001",{w:820,a:q1.a,k:q1.k});
      tt_quote(x,980,470,"‘Filaments? Microtubules? Quantum mechanics?’",null,{w:820,kick:"2007",a:q2.a,k:q2.k});}},
    // 2023: fourteen signs, none of today's systems showing enough of them
    {at:c.y2023-0.4,place:"lab",keys:[[c.y2023-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{const [rx,ry]=[1124,476];ag_loop(x,rx,ry,{t:tt,label:null,stepA:[0,0,0]});ag_roomLight(x,1);
      tt_checklist(x,300,150,420,{k:clamp(ag_spr(tt,c.y2023+0.6,0.8),0,1.2),a:ag_in(tt,c.y2023+0.5,0.4)});
      const q1=tt_pop(tt,P.none),q2=tt_pop(tt,P.obvious);tt_tag(x,960,770,"no current system conscious",{a:q1.a,k:q1.k});
      tt_tag(x,960,840,"no obvious barrier to building ones that show the signs",{a:q2.a,k:q2.k});}},
    // showing the signs, and feeling anything: a gap of bare marble between them
    {at:c.whether-0.4,place:"tt_labQuiet",keys:[[c.whether-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{const u=ag_sine(tt_on(tt,c.whether,1.6));
      tt_checklist(x,lerp(300,200,u),150,420,{});
      tt_couplePic(x,lerp(1100,1180,u),170,560,420,tt,ag_in(tt,c.whether+0.2,0.6));}},
    tt_closeShot(3,P.end)];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);
  tt_cardFwd(ctx,3,1,ag_in(t,0.1,0.6)*(1-ag_in(t,c.llinas-0.4,0.6)));if(t>=P.end&&t<P.end+1.9)tt_cardFwd(ctx,3,1-tt_on(t,P.end+0.4,1.5),ag_in(t,P.end,0.6));
  const nm=ag_io(t,c.llinas,c.penrose-0.5,0.5);if(nm>0.01)ag_textCard(ctx,96,60,340,{title:"Rodolfo Llinás"},{a:nm});
  const ph=ag_io(t,c.penrose-0.1,c.y2001-0.5,0.5);if(ph>0.01)ag_textCard(ctx,96,60,700,{title:"Roger Penrose · Stuart Hameroff",sub:"a physicist · an anaesthesiologist"},{a:ph});
  tt_cornerAt(ctx,t,"2023 · 19 researchers",c.y2023-0.1,c.whether-0.5);});

// Rod and Margaret at their table, framed, in a warm light: a life felt from inside
function tt_couplePic(x,X,Y,w,h,tt,a){if(a<=0.01)return;ag_picture(x,X,Y,w,h,{a,draw:(c2,PX,PY,pw,ph)=>{c2.save();c2.beginPath();c2.rect(PX,PY,pw,ph);c2.clip();c2.translate(PX,PY);
  c2.scale(pw/1100,pw/1100);c2.translate(-560,-260);c2.drawImage(ag_place("tt_home"),0,0);
  tt_couple(c2,tt,{mag:{talk:0.4*(0.5+0.5*Math.sin(tt*7))},rod:{smile:1}});tt_glow(c2,960,520,420,1,[255,220,170]);c2.restore();}});}
// a dotted line from x0 to x1 at y, broken around m (the middle by default) where a question mark stands
function tt_gapLine(ctx,x0,x1,y,a,m){if(a<=0.01)return;m=m==null?(x0+x1)/2:m;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG_OAK.dark,0.75);ctx.lineWidth=5;ctx.lineCap="round";ctx.setLineDash([2,16]);
  ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(m-70,y);ctx.moveTo(m+70,y);ctx.lineTo(x1,y);ctx.stroke();ctx.restore();}
// the sign-off Mei keeps: a small card in her near hand, with the agent's pen, her signature and a green tick (no words: too small to
// read); drawn in figure space, over her hand
function tt_heldSign(a){return (c2,h)=>{if(a<=0.01)return;const n=h.near;c2.save();c2.globalAlpha*=a;c2.translate(n[0]-70,n[1]-200);c2.rotate(-0.05);
  ag_box(c2,0,0,340,230,22,{edge:AG.green,edgeA:0.75});ag_pen(c2,44,50,34,rgba(AG.violet,1));c2.fillStyle="rgba(120,112,104,0.4)";rr(c2,92,40,200,16,8);c2.fill();
  c2.strokeStyle=rgba(AG.ink,0.75);c2.lineWidth=5;c2.lineCap="round";c2.beginPath();
  for(let i=0;i<=40;i++){const u=i/40,xx=60+u*220,yy=122-Math.sin(u*TAU*2.4)*14*Math.sin(Math.PI*u);i?c2.lineTo(xx,yy):c2.moveTo(xx,yy);}c2.stroke();
  ag_tick(c2,56,186,34,rgba(AG.green,1),7);c2.fillStyle=rgba(AG.green,0.5);rr(c2,100,176,180,16,8);c2.fill();c2.restore();};}
const TT_LIFT={near:[10,128,"hold"]};   // Mei's near hand up, holding the sign-off; her far arm stays down

scene("human",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({settled:wAt(sc,"settled","Nobody has settled"),like:wAt(sc,"building","like us"),not:wAt(sc,"building","where they're not"),
    dk:wAt(sc,"building","still don't know"),hand:wAt(sc,"helps","what to hand"),keep:wAt(sc,"helps","what to keep")}));
  const H_=TT_HOME,cards=[["a body that can be hurt",c.body],["a life lived with others",c.life],["feelings",c.feelings],["choosing what matters, and answering for it",c.choosing]];
  const ans=["Yes:","we","count","each","student","once,","on","census","day."],a0=c.today+1.5;
  const shots=[tt_openShot(4),
    // the Dutch Republic, 1637: a study at night, a candle, a man writing, a small clockwork figure on his desk
    {at:c.descartes-0.4,place:"tt_study1637",keys:[[c.descartes-0.4,960,560,1.06],[c.descartes,960,540,1.0]],d:4,push:0.01,draw:(x,tt)=>{
      tt_oldDesk(x,520,880,780,{});ag_person(x,TT_DESC,900,574,0.8,{t:tt,cut:790,gaze:[0,2.5]});tt_candle(x,1180,820,tt,1);tt_automaton(x,700,830,tt,1);
      const q=tt_pop(tt,c.descartes+2.4);tt_quote(x,360,110,"a machine could never arrange its words to answer whatever is said to it",null,{w:860,a:q.a,k:q.k});}},
    // today, machines do: a question goes into the ring, and an answer comes straight out, word by word
    {at:c.today-0.4,place:"lab",keys:[[c.today-0.4,960,540,1.0]],d:2,push:0,draw:(x,tt)=>{const [rx,ry]=[1124,476],u=ag_sine(tt_on(tt,c.today+0.6,0.8));
      ag_loop(x,rx,ry,{t:tt,think:ag_io(tt,c.today+1.1,a0+2.2,0.3),label:null,stepA:[0,0,0]});ag_roomLight(x,1);
      if(u<1){x.save();x.globalAlpha*=1-clamp((u-0.75)/0.25,0,1);const qx=lerp(470,rx,u),qy=lerp(250,ry,u)-Math.sin(Math.PI*u)*30,s=lerp(1,0.25,u*u);x.translate(qx,qy);x.scale(s,s);
        ag_textCard(x,-230,-60,460,{title:"Can you say that more simply?"},{});x.restore();}
      tt_wordRow(x,ans,560,800,tt,{at:ans.map((_,i)=>a0+i*0.22)});}},
    // if not language, then what? four cards float in, unlit, one at a time
    {at:c.body-0.6,place:"lab",keys:[[c.body-0.6,960,540,1.0]],d:2,push:0.015,draw:(x,tt)=>{ag_roomLight(x,1);
      cards.forEach(([w,at],i)=>{const q=tt_pop(tt,at-0.1),X=[330,1010,330,1010][i],Y=[230,230,470,470][i]+Math.sin(tt*0.9+i*1.7)*6;
        if(q.a>0.01)ag_textCard(x,X,Y+24*(1-ag_sine(clamp((tt-at+0.1)/0.9,0,1))),580,{title:w},{a:q.a*0.94,k:q.k});});}},
    // Melbourne, 1978: her words reach him, filled; he answers; the telephone rings, and he hears it
    {at:c.heard-0.4,place:"tt_home",keys:[[c.heard-0.4,960,540,1.06],[c.heard,960,540,1.0]],d:5,push:0.01,draw:(x,tt)=>{const rg=ag_io(tt,c.heard+4.0,c.building,0.3);
      tt_homeLive(x,tt,{talk:ag_io(tt,c.heard-0.2,c.heard+2.6,0.4),bubbles:[0.0,1.8].map(v=>({t0:c.heard+v,fill:0.85})),reach:true,ring:rg,
        rings:{phone:rg},rod:{gaze:tt>c.heard+4.3?[-3,-1.4]:[-3,0],smile:0.7,talk:0.4*ag_io(tt,c.heard+2.8,c.heard+4.2,0.3)*(0.5+0.5*Math.sin(tt*8))}});
      tt_implant(x,H_.rod,H_.y,H_.s,{t:tt,pulse:1});}},
    // the spiral and its wire, and the agent: like us, not like us, and how much we still don't know
    {at:c.building-0.4,place:"lab",keys:[[c.building-0.4,960,540,1.0]],d:2,push:0.012,draw:(x,tt)=>{
      tt_spiral(x,520,470,230,{dots:1,wire:1,rings:10,lit:10});ag_loop(x,1400,470,{t:tt,label:null,stepA:[0,0,0],think:0.3});tt_roughCopy(x,1400,470,88,tt,{neurons:0.6,pages:0.6});ag_roomLight(x,1);
      const L=tt_pop(tt,P.like),N=tt_pop(tt,P.not),D=tt_pop(tt,P.dk),go=1-ag_in(tt,c.helps-0.9,0.4);
      tt_tag(x,960,520,"like us",{a:L.a*go,k:L.k,col:AG.green});tt_tag(x,960,610,"not like us",{a:N.a*go,k:N.k,col:AG.amber});tt_tag(x,960,700,"still don't know",{a:D.a*go,k:D.k});}},
    // the room: Jun hands the agent a task, read only; the sign-off stays with Mei; the five questions on the wall, each with its tag
    {cut:true,at:c.helps-0.4,place:"lab",keys:[[c.helps-0.4,1000,560,1.08],[c.answers,960,540,1.0]],d:4,push:0,draw:(x,tt)=>{const t0=c.helps-0.4,back=tt>=t0+1.9,lift=ag_sine(tt_on(tt,P.keep-0.3,0.8));
      tt_team(x,tt,{pose2:[null,TT_LIFT],mix:[0,lift],hold:[null,tt_heldSign(clamp(lift*2.5,0,1))],
        gaze:TT_SEATS.map((_,i)=>i===0?[3,-1]:[3,0]),smile:[0.5,0.45,0.35,0.35,0.35],core:0.4+0.5*ag_io(tt,P.hand+1.4,c.answers,0.6)});
      tt_qrow(x,{out:back?-1:4,tags:[1,1,1,1,ag_in(tt,t0+1.9,0.5)],a:1-ag_in(tt,c.breath,0.8)});
      const u=tt_on(tt,P.hand-0.4,1.6);if(u>0&&u<1){const q=ag_sine(u),s=lerp(1,0.3,clamp((u-0.82)/0.18,0,1));x.save();x.globalAlpha*=1-clamp((u-0.76)/0.1,0,1);
        x.translate(lerp(330,TT_REST[0],q),lerp(520,TT_REST[1],q)-Math.sin(Math.PI*q)*30);x.scale(s,s);ag_textCard(x,-170,-60,340,{title:"count students",sub:"read only"},{edge:AG.blue});x.restore();}
      const fl=ag_in(tt,c.answers-0.4,2.4);if(fl>0.01){x.save();const g=x.createLinearGradient(1920,0,700,0);g.addColorStop(0,"rgba(255,236,200,"+(0.22*fl)+")");g.addColorStop(1,"rgba(255,236,200,0)");
        x.fillStyle=g;x.fillRect(0,653,W,H-653);x.restore();}
      ag_roomLight(x,1);
      // the fifth card goes back to the wall in the room, under the shot's camera, so it lands where the row is drawn: over the shots, in
      // the frame, it landed 22 px from it while the camera was still closing in, and jumped there in one frame
      if(!back)tt_cardFwd(x,4,1-tt_on(tt,c.helps,1.5),ag_in(tt,t0,0.6));}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.7);setScreen(ctx,S);tt_cardMoves(ctx,t,4,c.descartes-0.4,null);
  tt_cornerAt(ctx,t,"The Dutch Republic · 1637",c.descartes-0.1,c.today-0.5,{col:[236,222,200]});
  ag_end(ctx,S,t,c.breath,TT_TITLE,"We don't have the answers yet. Keep wondering.","Film 9 of 10");});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["five", "taught", "mixing", "wire", "feels", "human"]);

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
