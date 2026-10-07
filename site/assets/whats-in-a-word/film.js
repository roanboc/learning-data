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

// From words to data · What's in a word. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"answers":{"name":"Four answers","lead":1.6,"tail":1.0,"vo":[
 {"id":"q","gap":0.8,"text":"It's graduation week, and the Deputy Vice-Chancellor wants one number for the speech: how many credentials did we award this year?"},
 {"id":"four","gap":0.8,"text":"Four offices answer, with four numbers."},
 {"id":"nums","gap":0.8,"text":"The registrar says 7,420. Short courses says 10,600. Careers says 14,650. The learning platform says 26,900.","say":"The registrar says seven thousand, four hundred and twenty. Short courses says ten thousand, six hundred. Careers says fourteen thousand, six hundred and fifty. The learning platform says twenty-six thousand, nine hundred."},
 {"id":"none","gap":0.8,"text":"Nobody is wrong. Each office is counting a different idea, under the same word."},
 {"id":"back","gap":0.8,"text":"To see why, we have to go back. Before computers, before writing, before words."}]},
"kinds":{"name":"Kinds without words","lead":1.0,"tail":1.0,"vo":[
 {"id":"pigeons","gap":0.8,"text":"In the 1960s, researchers showed pigeons hundreds of photos. The birds learned to peck at the ones with people in them, even photos they had never seen.","say":"In the nineteen sixties, researchers showed pigeons hundreds of photos. The birds learned to peck at the ones with people in them, even photos they had never seen."},
 {"id":"bees","gap":0.8,"text":"Honeybees can learn the idea of same and different, and use it on colours and patterns they've never met."},
 {"id":"noword","gap":0.8,"text":"No words at all. Yet each of them sorts the world into kinds."},
 {"id":"first","gap":0.8,"text":"Concepts come first. Words come later, to point at them."}]},
"calls":{"name":"Calls that point","lead":1.0,"tail":1.0,"vo":[
 {"id":"vervets","gap":0.8,"text":"Vervet monkeys give different alarm calls for different hunters."},
 {"id":"leopard","gap":0.6,"text":"A leopard call sends the group up into the trees."},
 {"id":"eagle","gap":0.6,"text":"An eagle call makes them look up, and dive into the bushes."},
 {"id":"snake","gap":0.8,"text":"A snake call has them stand tall and search the grass."},
 {"id":"kind","gap":0.8,"text":"Each call stands for a kind of thing, and everyone who hears it knows what to do."},
 {"id":"names","gap":0.8,"text":"Some animals go further. Dolphins, elephants and marmosets use calls that work like names, for one individual."},
 {"id":"ids","gap":0.8,"text":"A kind of thing, and one particular thing: categories, and identifiers. Every data model needs both."}]},
"words":{"name":"What words add","lead":1.0,"tail":1.0,"vo":[
 {"id":"point","gap":0.8,"text":"A baby points before it can talk, to share what it's looking at with you."},
 {"id":"root","gap":0.8,"text":"That shared attention is the root of every word: this one, here, that."},
 {"id":"combine","gap":0.8,"text":"Human words go further than any call. They combine without limit, and they reach things that aren't here: yesterday, a promise, a rule."},
 {"id":"know","gap":0.8,"text":"Even what someone knows. You can't see it. So people have always needed words, and later records, to show it."},
 {"id":"fossil","gap":0.8,"text":"When did speech begin? Nobody knows exactly. Words leave no fossils."}]},
"forms":{"name":"One idea, many forms","lead":1.0,"tail":1.0,"vo":[
 {"id":"cell","gap":0.8,"text":"Inside the human brain, researchers have found single cells that respond to one person: to photos of them, a drawing of them, even their written name."},
 {"id":"one","gap":0.8,"text":"Many forms, one idea."},
 {"id":"tri","gap":0.8,"text":"Think of it as a triangle. A word points to an idea in someone's mind, and the idea points to things in the world."},
 {"id":"gap","gap":0.8,"text":"The word never touches the thing directly. That gap is where misunderstandings live."}]},
"gavagai":{"name":"Which part do you mean?","lead":1.0,"tail":1.0,"vo":[
 {"id":"rabbit","gap":0.8,"text":"A philosopher imagined a stranger pointing at a running rabbit, and saying: gavagai!"},
 {"id":"mean","gap":0.8,"text":"Does it mean the rabbit? Its ears? This moment of running?"},
 {"id":"kids","gap":0.8,"text":"Children solve this every day. They guess the whole thing first."},
 {"id":"grain","gap":0.8,"text":"But every word hides a choice: what counts as one. Data modellers call it the grain."},
 {"id":"mei","gap":0.8,"text":"Credentials have a grain, too. Mei has a degree and two microcredentials. Count graduates, and she's one. Count credentials, and she's three."}]},
"edges":{"name":"Fuzzy edges","lead":1.0,"tail":1.0,"vo":[
 {"id":"robin","gap":0.8,"text":"Ask people to picture a bird, and most will think of a robin or a sparrow. Hardly anyone thinks of a penguin."},
 {"id":"typical","gap":0.8,"text":"Categories have typical members in the middle, and fuzzy edges."},
 {"id":"agree","gap":0.8,"text":"We agree about the middle. We argue at the edges."},
 {"id":"cred","gap":0.8,"text":"Is a degree a credential? Of course. A microcredential? Probably. A badge for turning up to a workshop? That's where the four offices part ways."}]},
"drift":{"name":"Words drift","lead":1.0,"tail":1.0,"vo":[
 {"id":"nice","gap":0.8,"text":"Words move, too. Nice once meant foolish."},
 {"id":"cred","gap":0.8,"text":"Credential comes from the Latin for belief. Enrol meant writing a name on a roll. A diploma was a sheet of paper, folded in two."},
 {"id":"still","gap":0.8,"text":"Ambassadors still present their credentials: letters asking their host to trust the person who carries them."},
 {"id":"move","gap":0.8,"text":"Meaning moves slowly, and a word's history often explains its edges."}]},
"paper":{"name":"Agreed on paper","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"Back at the university, there's no system in sight. Just four offices, and a sheet of paper."},
 {"id":"def","gap":0.8,"text":"First, what is a credential? A trusted statement, that others can check, that someone has shown what they know or can do."},
 {"id":"kinds","gap":0.8,"text":"Awards and microcredentials are credentials. So are badges, when the learning was assessed. A badge for turning up isn't one."},
 {"id":"recipe","gap":0.8,"text":"The recipe is Aristotle's: name the kind of thing, then say what sets it apart."},
 {"id":"owner","gap":0.8,"text":"Each word gets an owner and a date, and the sketch gains a box, in pencil. Version three, draft."},
 {"id":"answer","gap":0.8,"text":"The answer for the speech is 11,890. And each of the four numbers now has a name.","say":"The answer for the speech is eleven thousand, eight hundred and ninety. And each of the four numbers now has a name."},
 {"id":"gap","gap":0.8,"text":"Two of them counted things that aren't credentials: badges for turning up, and certificates of completion. Nobody lied. Until today, there was no agreed question."}]},
"end":{"name":"Pull back","lead":1.0,"tail":1.0,"vo":[
 {"id":"why","gap":0.8,"text":"None of this needed a computer. Contracts open with their definitions. Mergers stall on what counts as a customer. Funding depends on who is counted."},
 {"id":"cost","gap":0.8,"text":"Agreeing on words is real work: people with different needs, trade-offs, and time. Disagreeing costs far more."},
 {"id":"clay","gap":0.8,"text":"About five thousand years ago, people began pressing marks into clay, to keep records that outlast memory."},
 {"id":"last","gap":0.8,"text":"From minds, to marks, to systems. But before you can count anything, you have to agree what it is."}]}
};

const VODUR={"answers/q": 7.646, "answers/four": 2.254, "answers/nums": 14.076, "answers/none": 4.903, "answers/back": 4.671, "kinds/pigeons": 9.656, "kinds/bees": 5.974, "kinds/noword": 3.709, "kinds/first": 3.343, "calls/vervets": 3.565, "calls/leopard": 2.659, "calls/eagle": 3.311, "calls/snake": 2.839, "calls/kind": 4.236, "calls/names": 7.207, "calls/ids": 6.329, "words/point": 3.772, "words/root": 3.839, "words/combine": 7.768, "words/know": 6.213, "words/fossil": 4.754, "forms/cell": 9.377, "forms/one": 1.399, "forms/tri": 7.103, "forms/gap": 4.902, "gavagai/rabbit": 5.21, "gavagai/mean": 3.04, "gavagai/kids": 3.461, "gavagai/grain": 5.121, "gavagai/mei": 8.714, "edges/robin": 6.626, "edges/typical": 3.534, "edges/agree": 2.662, "edges/cred": 9.042, "drift/nice": 2.51, "drift/cred": 8.279, "drift/still": 6.341, "drift/move": 3.988, "paper/back": 5.562, "paper/def": 6.928, "paper/kinds": 7.718, "paper/recipe": 4.661, "paper/owner": 6.101, "paper/answer": 6.527, "paper/gap": 9.98, "end/why": 9.67, "end/cost": 6.809, "end/clay": 6.558, "end/last": 5.712};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: the title, the four offices' circles on the credentials, and the ending. */
const BREATH={
"answers":{"hold":{"nums":0.6,"none":0.5},"breathe":3.6},
"kinds":{"hold":{"pigeons":0.6,"bees":0.6,"noword":0.5}},
"calls":{"hold":{"leopard":0.4,"eagle":0.4,"snake":0.3,"kind":0.6,"names":0.6}},
"words":{"hold":{"point":0.5,"root":0.6,"combine":0.7,"know":0.7}},
"forms":{"hold":{"cell":0.4,"one":0.6,"tri":0.5}},
"gavagai":{"hold":{"mean":0.8,"grain":0.5,"mei":0.6}},
"edges":{"hold":{"agree":0.4},"breathe":3.0},
"drift":{"hold":{"cred":0.5}},
"paper":{"hold":{"back":0.4,"def":0.9,"kinds":0.8,"recipe":0.6,"owner":0.5,"answer":0.4}},
"end":{"hold":{"cost":0.6,"clay":0.8},"breathe":4.2}
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

/* ===== What's in a word: the film's own pictures =====
   The icon every creature is drawn with, the pigeons' photos, the bees' cards, a dolphin's whistle, three portraits, a roll of names,
   and LV, the pictures of the labs and scenarios. The living world has files of its own: land.js (the ground, plants, rock and clay),
   beasts.js (the mammals and the snake), birds.js (the birds and the bee) and body.js (a baby, a pointing arm, a hand with a stylus, a brain).
   The labs and the scenarios draw with all of them. */
const WA_INK=[255,190,110],LEO=[255,176,64],EAG=[120,190,255],SNK=[120,230,140],NAMEC=[190,150,255];

// an icon: a path in its own units (about 100 tall), drawn at (x,y) and size s, filled dark and outlined in light
function icon(ctx,x,y,s,path,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*(o.flip?-1:1),s);if(o.rot)ctx.rotate(o.rot);
  ctx.beginPath();path(ctx);const g=ctx.createLinearGradient(-50,-60,50,60);g.addColorStop(0,rgba(mix(col,[20,26,40],0.55),0.95));g.addColorStop(1,"rgba(8,12,22,0.95)");ctx.fillStyle=o.fill||g;ctx.fill(o.rule||"nonzero");
  ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=(o.glow||12);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=(o.lw||2.4)/s;ctx.lineJoin="round";ctx.lineCap="round";ctx.stroke();ctx.shadowBlur=0;
  if(o.detail){ctx.beginPath();o.detail(ctx);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=(o.dlw||1.8)/s;ctx.stroke();}
  if(o.eye){ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(o.eye[0],o.eye[1],o.eye[2]||2.6,0,TAU);ctx.fill();}
  ctx.restore();}


// a photo in a pigeon experiment: a landscape, with or without a person in it
function photoTile(ctx,x,y,w,h,k,person_,a,mark){withA(ctx,a,()=>{ctx.save();rr(ctx,x,y,w,h,8);ctx.clip();const sky=[[92,130,190],[200,150,110],[110,160,170],[150,140,200]][k%4],gr=[[70,110,70],[120,96,70],[80,120,110],[96,110,70]][k%4];
  let g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,rgba(sky,1));g.addColorStop(0.62,rgba(mix(sky,[255,255,255],0.3),1));g.addColorStop(0.62,rgba(gr,1));g.addColorStop(1,rgba(mix(gr,[0,0,0],0.4),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  if(hash(k,3)>0.4){ctx.fillStyle="rgba(40,60,40,0.8)";ctx.beginPath();ctx.arc(x+w*(0.2+0.6*hash(k,4)),y+h*0.58,w*0.14,0,TAU);ctx.fill();}
  if(person_){const px=x+w*(0.3+0.4*hash(k,5)),py=y+h*0.6,ps=h/140;ctx.fillStyle="rgba(30,24,30,0.95)";ctx.beginPath();ctx.arc(px,py-38*ps,9*ps,0,TAU);ctx.fill();rr(ctx,px-10*ps,py-28*ps,20*ps,34*ps,8*ps);ctx.fill();ctx.fillRect(px-8*ps,py+4*ps,6*ps,18*ps);ctx.fillRect(px+2*ps,py+4*ps,6*ps,18*ps);}
  ctx.restore();ctx.strokeStyle="rgba(230,240,255,0.5)";ctx.lineWidth=1.5;rr(ctx,x,y,w,h,8);ctx.stroke();
  if(mark)withA(ctx,mark,()=>{ctx.strokeStyle=rgba(GOOD,1);ctx.lineWidth=4;ctx.shadowColor=rgba(GOOD,0.9);ctx.shadowBlur=12;rr(ctx,x-4,y-4,w+8,h+8,10);ctx.stroke();ctx.shadowBlur=0;});});}
// a card a bee chooses from: a colour or a pattern of stripes
function beeCard(ctx,x,y,s,kind,a,hi){withA(ctx,a,()=>{glass(ctx,x-s/2,y-s/2,s,s,12,hi?GOOD:[170,200,245],{glow:hi?16:0,ea:hi?0.9:0.4,fill:"rgba(10,16,30,0.9)"});ctx.save();rr(ctx,x-s/2+10,y-s/2+10,s-20,s-20,8);ctx.clip();
  if(kind==="blue"||kind==="yellow"){ctx.fillStyle=kind==="blue"?"rgb(90,140,255)":"rgb(255,210,70)";ctx.fillRect(x-s/2,y-s/2,s,s);}
  else{ctx.fillStyle="rgb(20,24,36)";ctx.fillRect(x-s/2,y-s/2,s,s);ctx.fillStyle="rgb(230,236,250)";for(let i=-6;i<6;i++){if(kind==="hstripes")ctx.fillRect(x-s/2,y+i*16,s,8);else ctx.fillRect(x+i*16,y-s/2,8,s);}}
  ctx.restore();});}
// a signature: a whistle's shape, the same every time, like a name
function nameWave(ctx,x,y,w,h,seed,col,a,p){if(a<=0.01)return;withA(ctx,a,()=>{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=10;ctx.beginPath();const n=60,q=p==null?1:p;
  for(let i=0;i<=n*q;i++){const u=i/n,v=Math.sin(u*Math.PI*(2+seed))*Math.sin(u*Math.PI)*0.8+0.2*Math.sin(u*Math.PI*9*(1+seed*0.3));const px=x+u*w,py=y-v*h/2;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();ctx.shadowBlur=0;});}

// three forms of one person: a photo, a drawing, a written name
const PORTRAIT={};
function portraitBmp(kind){if(PORTRAIT[kind])return PORTRAIT[kind];const c=mkCanvas(240,280),x=c.getContext("2d");
  if(kind==="name"){x.fillStyle="#f3ecdc";x.fillRect(0,0,240,280);x.fillStyle="#2a2420";x.font=font(700,34);x.textAlign="center";x.fillText("Mei",120,130);x.fillText("Tanaka",120,172);}
  else{const g=x.createLinearGradient(0,0,0,280);g.addColorStop(0,kind==="photo"?"#6f86ad":"#f3ecdc");g.addColorStop(1,kind==="photo"?"#2d3a52":"#e6dcc8");x.fillStyle=g;x.fillRect(0,0,240,280);
    if(typeof person==="function"){x.save();if(kind==="drawing")x.filter="grayscale(1) contrast(1.6) brightness(1.35)";person(x,"mei",120,860,1.45,{t:0.4,expr:"calm"});x.restore();}}
  PORTRAIT[kind]=c;return c;}
function portrait(ctx,x,y,kind,a,hi){withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=18;ctx.drawImage(portraitBmp(kind),x,y,200,234);ctx.restore();ctx.strokeStyle=hi?rgba([255,236,160],1):"rgba(230,236,250,0.6)";ctx.lineWidth=hi?4:2;ctx.strokeRect(x,y,200,234);
  if(hi)glow(ctx,x+100,y+117,150,[255,236,160],0.2*hi);});}

/* ---------- things for the end ---------- */
// a scroll with names on it: to enrol was to write a name on the roll
function roll(ctx,x,y,w,h,names,p,a){withA(ctx,a,()=>{ctx.fillStyle="#e8dcc0";ctx.fillRect(x,y,w,h);[y,y+h].forEach(yy=>{const g=ctx.createLinearGradient(x,yy-10,x,yy+10);g.addColorStop(0,"#b89a6a");g.addColorStop(0.5,"#f0e2c4");g.addColorStop(1,"#8a6c44");ctx.fillStyle=g;rr(ctx,x-12,yy-12,w+24,24,12);ctx.fill();});
  names.forEach((nm,i)=>withA(ctx,clamp(p*names.length-i,0,1),()=>T(ctx,nm,x+28,y+44+i*34,{w:600,size:22,color:"rgba(60,44,30,0.92)"})));});}

/* ---------- pictures for the labs and the scenarios (site/assets/whats-in-a-word/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW); any text it draws comes from FW.vis,
   so the Spanish pages show Spanish. Lab pictures are shown at about half size: text is 22 px or more. */
const WA_NUM=(n,L)=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,L.lang==="es"?".":",");
const WA_HEX=h=>h.match(/\w\w/g).map(q=>parseInt(q,16));
const LV={
  // Count the credentials: what's ticked, as one bar, with each office's answer marked under it
  count:(c,w,h,st,L)=>{const lab=L.labs.find(x=>x.kind==="count"),it=lab.w.items,max=it.reduce((a,x)=>a+x.n,0),x0=30,x1=w-30,y=110,bh=86,sc=v=>x0+(x1-x0)*v/max;let acc=0;
    T(c,lab.w.unit+": "+WA_NUM(st.total,L),x0,70,{w:800,size:44,color:rgba(TRUST,1)});
    it.forEach((x,i)=>{const on=st.on.has(x.k),a=sc(acc),b=sc(acc+x.n),col=[TRUST,OFFICE.short.c,OFFICE.careers.c,[150,120,200],OFFICE.lms.c][i];c.fillStyle=rgba(col,on?0.85:0.14);rr(c,a+1,y,b-a-2,bh,10);c.fill();c.strokeStyle=rgba(col,0.8);c.lineWidth=2;rr(c,a+1,y,b-a-2,bh,10);c.stroke();
      if(b-a>90)T(c,WA_NUM(x.n,L),(a+b)/2,y+bh/2+9,{w:800,size:24,align:"center",color:on?"#0a1020":rgba(SOFT,0.9)});acc+=x.n;});
    lab.w.targets.forEach((tg,i)=>{const v=it.filter(x=>tg.set.includes(x.k)).reduce((a,x)=>a+x.n,0),xx=sc(v),col=WA_HEX(tg.c),yy=y+bh+46+i*44,right=xx>w*0.6;
      c.strokeStyle=rgba(col,0.9);c.lineWidth=3;c.setLineDash([6,6]);c.beginPath();c.moveTo(xx,y-6);c.lineTo(xx,yy-10);c.stroke();c.setLineDash([]);T(c,tg.name,xx+(right?-10:10),yy,{w:800,size:24,align:right?"right":"left",color:rgba(col,1)});});},
  // Same word, same thing? One word, two ideas, two birds
  trio:(c,w,h,st,L)=>{const V=L.vis,wx=w/2,wy=h-40;
    [[200,V.ideaUK,[140,200,255],200],[w-200,V.ideaUS,[255,170,120],w-200]].forEach(([ix,lab,col,bx],i)=>{c.strokeStyle=rgba(col,0.9);c.lineWidth=3;c.beginPath();c.moveTo(wx,wy-30);c.lineTo(ix,90);c.stroke();
      glow(c,ix,90,70,col,0.5);c.fillStyle=rgba(mix(col,[255,255,255],0.5),1);c.beginPath();c.arc(ix,90,16,0,TAU);c.fill();T(c,lab,ix,48,{w:800,size:26,align:"center",color:rgba(col,1)});
      c.beginPath();c.moveTo(ix,106);c.lineTo(bx+(i?-150:150),h-110);c.stroke();robin(c,bx+(i?-150:150),h-90,i?1.5:1.2,i?{col:[200,150,120],american:true}:{});});
    const ww=tw(c,V.word,34,800)+50;glass(c,wx-ww/2,wy-30,ww,56,14,KIND,{glow:12,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,V.word,wx,wy+9,{w:800,size:34,align:"center"});},
  // What counts as one? Three rabbits, and what one row stands for
  grain:(c,w,h,st,L)=>{const g=c.createLinearGradient(0,h*0.62,0,h);g.addColorStop(0,"rgba(40,56,34,0.9)");g.addColorStop(1,"rgba(8,12,8,0.9)");c.fillStyle=g;c.fillRect(0,h*0.62,w,h*0.38);grass(c,0,w,h*0.62+4,1,0.8);
    [[w*0.2,h*0.6],[w*0.5,h*0.62],[w*0.8,h*0.58]].forEach(([x,y],i)=>{rabbit(c,x,y,1.3,[235,225,205],0.2+i*0.3,{run:0.4});
      if(st.pick==="rabbit")ring(c,x,y-12,86,KIND,0.9,4);
      if(st.pick==="ear"){ring(c,x+32,y-72,22,KIND,0.9,4);ring(c,x+48,y-76,22,KIND,0.9,4);}
      if(st.pick==="second"){for(let k=0;k<12;k++){c.fillStyle=rgba(KIND,0.8);c.fillRect(x-90+k*15,y+50,10,18);}}});
    T(c,(L.vis.grain||{})[st.pick]||"",30,56,{w:800,size:34,color:rgba(TRUST,1)});},
  // scenarios (600 × 320)
  two:(c,w,h,st,L)=>{const V=L.vis.two;officeCard(c,20,40,270,"lms","9,800".replace(",",L.lang==="es"?".":","),{name:V[0],big:56,h:210,meaning:V[1]});officeCard(c,310,40,270,"reg","9,350".replace(",",L.lang==="es"?".":","),{name:V[2],big:56,h:210,meaning:V[3]});T(c,V[4],300,296,{w:800,size:22,align:"center",color:rgba(TRUST,1)});},
  learner:(c,w,h,st,L)=>{const V=L.vis.learner;fuzzyRing(c,300,170,140,KIND,0.5,30);ring(c,300,170,140,KIND,0.9,3);ring(c,300,200,68,TRUST,0.9,3);T(c,V[0],300,58,{w:800,size:26,align:"center",color:rgba(KIND,1)});T(c,V[1],300,208,{w:800,size:24,align:"center",color:rgba(TRUST,1)});T(c,V[2],440,140,{w:700,size:18,align:"center",color:rgba(SOFT,1)});},
  rows:(c,w,h,st,L)=>{const V=L.vis.rows;table(c,40,16,V[0],[V[1],V[2]],[["Aisha K.","DS101"],["Aisha K.","STAT110"],["Aisha K.","WRIT100"],["Ben O.","DS101"],["Ben O.","MATH120"]],{col:KIND});T(c,V[3],360,290,{w:800,size:22,color:rgba(EDGE_,1)});},
  gloss:(c,w,h,st,L)=>{const V=L.vis.gloss;glass(c,30,30,540,260,18,TRUST,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(c,V[0],60,88,{w:800,size:32,color:rgba(TRUST,1)});wrapT(c,V[1],60,140,480,{w:600,size:24});T(c,V[2],60,260,{w:800,size:24,color:rgba(EDGE_,1)});},
  badges:(c,w,h,st,L)=>{const V=L.vis.badges;credCard(c,20,40,270,{era:"badge",title:V[0],holder:"Aisha K.",claim:V[1],evidence:V[2],h:230,col:OFFICE.careers.c,rh:40});credCard(c,310,40,270,{era:"badge",title:V[3],holder:"Aisha K.",claim:V[4],evidence:V[5],h:230,col:[150,140,170],rh:40});},
  owner:(c,w,h,st,L)=>{const V=L.vis.owner;person(c,"mei",120,320,0.44,{t:1,pose:"explain"});glass(c,230,60,340,160,18,TRUST,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(c,V[0],260,118,{w:800,size:34,color:rgba(TRUST,1)});T(c,V[1],260,164,{w:700,size:22});stamp(c,570,262,V[2],TRUST,1);},
  drift:(c,w,h,st,L)=>{const V=L.vis.drift;c.strokeStyle=rgba(CLAY,0.7);c.lineWidth=4;c.beginPath();c.moveTo(80,200);c.lineTo(520,200);c.stroke();[[80,"2015",V[1]],[520,"2026",V[2]]].forEach(([x,y_,m])=>{c.fillStyle=rgba(CLAY,1);c.beginPath();c.arc(x,200,9,0,TAU);c.fill();T(c,y_,x,246,{f:"mono",w:500,size:22,align:"center",color:rgba(CLAY,1)});wrapT(c,m,x-110,130,220,{w:700,size:20,align:"left"});});tag(c,300,64,V[0],KIND,{align:"center",size:28});},
  paper:(c,w,h,st,L)=>{sheet(c,60,16,480,290,{rot:-0.02});L.vis.paper.forEach((s,i)=>pencilText(c,(i+1)+". "+s,96,66+i*50,{size:21}));}
};

/* ===== What's in a word: the land =====
   The ground of the grassland, its grass, trees and bushes, a branch for a bird, layers of rock with fossils in them, and a clay tablet.
   Scenes place these; each draws in the frame's own units (1920 × 1080), and moves with t where the world would move.
   Whatever holds still (bark, leaves, rock, clay) is painted once into offscreen canvases, and each frame only places them, on whole
   pixels when the frame is drawn 1:1; leaves and grass bend with one breeze, ln_wind(x,t), whose gusts roll across from the left. */

/* ---------- shared: caches, noise, the breeze ---------- */
const LN_C=new Map();
function ln_cv(w,h){return mkCanvas(Math.max(1,Math.ceil(w)),Math.max(1,Math.ceil(h)));}
// smooth noise in -1..1, in one and two dimensions, and a few octaves of it
function ln_n1(x,s){const i=Math.floor(x),f=x-i;return lerp(hash(i,s),hash(i+1,s),f*f*(3-2*f))*2-1;}
function ln_fbm(x,s,o){let v=0,a=0.5,f=1;for(let k=0;k<(o||4);k++){v+=a*ln_n1(x*f+k*13.1,s+k);f*=2.03;a*=0.5;}return v;}
function ln_n2(x,y,s){const i=Math.floor(x),j=Math.floor(y),u=x-i,v=y-j,su=u*u*(3-2*u),sv=v*v*(3-2*v),h=(a,b)=>hash(a*57.31+b*131.7,s);
  return lerp(lerp(h(i,j),h(i+1,j),su),lerp(h(i,j+1),h(i+1,j+1),su),sv)*2-1;}
// the breeze at x, about 0.3 to 1.2: a steady lean, and gusts that roll across from the left at uneven speed
function ln_wind(x,t){const g=0.5+0.5*Math.sin(x*0.0062-t*1.15+1.3*Math.sin(t*0.21)),h=0.5+0.5*Math.sin(x*0.0023-t*0.47+1.7);return 0.3+0.9*g*g*(0.3+0.7*h);}
// a point on the cubic p=[x0,y0,x1,y1,x2,y2,x3,y3]
function ln_bz(p,u){const m=1-u,a=m*m*m,b=3*m*m*u,c=3*m*u*u,d=u*u*u;return[a*p[0]+b*p[2]+c*p[4]+d*p[6],a*p[1]+b*p[3]+c*p[5]+d*p[7]];}
// adds to the path a tapering tube along the cubic p, w0 wide at its start and w1 at its end, its end rounded
function ln_tube(c,p,w0,w1,n){n=n||18;const L=[],R=[];for(let i=0;i<=n;i++){const u=i/n,a=ln_bz(p,Math.max(0,u-0.02)),b=ln_bz(p,Math.min(1,u+0.02)),q=ln_bz(p,u);
    let tx=b[0]-a[0],ty=b[1]-a[1];const l=Math.hypot(tx,ty)||1;tx/=l;ty/=l;const w=lerp(w0,w1,Math.pow(u,0.85))/2;L.push([q[0]+ty*w,q[1]-tx*w]);R.push([q[0]-ty*w,q[1]+tx*w]);}
  const e=ln_bz(p,1);c.moveTo(L[0][0],L[0][1]);for(let i=1;i<=n;i++)c.lineTo(L[i][0],L[i][1]);c.quadraticCurveTo(e[0]+(e[0]-ln_bz(p,0.97)[0])*w1*0.3,e[1]+(e[1]-ln_bz(p,0.97)[1])*w1*0.3,R[n][0],R[n][1]);
  for(let i=n-1;i>=0;i--)c.lineTo(R[i][0],R[i][1]);c.closePath();}
// draws V[k] (the same picture shifted k/V.length px right) with its corner at (x,y): on whole device pixels when drawn 1:1, where it is sharpest and fastest
function ln_put(ctx,V,x,y,m){m=m||ctx.getTransform();if(m.a===1&&m.d===1&&m.b===0&&m.c===0){const n=V.length,q=Math.round((x+m.e)*n),ix=Math.floor(q/n);ctx.drawImage(V[q-ix*n],ix-m.e,Math.round(y+m.f)-m.f);}else ctx.drawImage(V[0],x,y);}
// the rim of a mask M (same size as c's canvas): its edges that face (-dx,-dy), in colour col, with a soft glow
function ln_rim(c,M,dx,dy,col,a,blur){const R=ln_cv(M.width,M.height),r=R.getContext("2d");r.drawImage(M,0,0);r.globalCompositeOperation="destination-out";r.drawImage(M,dx,dy);
  r.globalCompositeOperation="source-in";r.fillStyle=col;r.fillRect(0,0,R.width,R.height);c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=a;if(blur){c.shadowColor=col;c.shadowBlur=blur;}c.drawImage(R,0,0);c.restore();}
// a mask painted in colour: the shapes of M filled with fill (a colour or gradient), drawn onto c
function ln_tint(c,M,fill,a){const R=ln_cv(M.width,M.height),r=R.getContext("2d");r.drawImage(M,0,0);r.globalCompositeOperation="source-in";r.fillStyle=fill;r.fillRect(0,0,R.width,R.height);
  c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=a==null?1:a;c.drawImage(R,0,0);c.restore();return R;}

/* ---------- leaves: clumps of puffs, lit from the upper left ---------- */
// the puffs of a cluster of leaves sp {rx,ry,clumps,seed,r,dens,flat}: a few clumps side by side, domed above and (if flat) cut flat below
function ln_puffs(sp){const P=[],nc=sp.clumps;for(let k=0;k<nc;k++){const q=j=>hash(k+sp.seed*17,sp.seed+j),u=nc>1?-1+2*(k+0.5)/nc:0,cx=(u*0.74+(q(1)-0.5)*0.2)*sp.rx,e=Math.sqrt(Math.max(0.05,1-(cx/sp.rx)*(cx/sp.rx))),
    crx=sp.rx/nc*(1.1+0.45*q(2)),cry=sp.ry*(0.55+0.4*e)*(0.8+0.35*q(3)),cy=-sp.ry*0.22*e+(q(4)-0.5)*sp.ry*0.4,n=Math.round((sp.dens||1)*3.4*crx*cry/(sp.r*sp.r))+6;
    for(let i=0;i<n;i++){const h=j=>hash(i+k*131+sp.seed*7,sp.seed*3+j),a=h(5)*TAU,d=Math.sqrt(h(6));let x=cx+Math.cos(a)*d*crx,y=cy+Math.sin(a)*d*cry;
      if(sp.flat)y=Math.min(y,cy+cry*(0.35+0.2*h(8)));P.push({x,y,r:sp.r*(0.5+0.6*h(7))*(1.15-0.45*d),k,cx,cy,crx,cry});}}
  return P;}
// a cluster of leaves painted into its own canvas, sub px right of centre; returns {c,ox,oy}, (ox,oy) being where its centre lies.
// Each clump is one mass, shaded as a whole from its lit upper left to its dark lower right, with a lobe or two showing, and fine leaves on it
function ln_leaves(sp,s,sub){const pal=sp.pal,sq=sp.sq||0.78,m=Math.ceil((14+0.35*sp.rx)*s),W=Math.ceil(2*sp.rx*s)+2*m+2,H=Math.ceil(2*sp.ry*s)+2*m,ox=m+Math.ceil(sp.rx*s),oy=m+Math.ceil(sp.ry*s);
  const c=ln_cv(W,H),x=c.getContext("2d"),M=ln_cv(W,H),mx=M.getContext("2d"),P=ln_puffs(sp),T=q=>q.setTransform(s,0,0,s,ox+(sub||0),oy);
  const blob=(q,p,dx,dy,k)=>{const r=p.r*k;q.moveTo(p.x+dx+r,p.y+dy);q.ellipse(p.x+dx,p.y+dy,r,r*sq,0,0,TAU);};
  T(mx);mx.fillStyle="#fff";mx.beginPath();P.forEach(p=>blob(mx,p,0,0,1));mx.fill();
  T(x);const ks=[];P.forEach(p=>{if(!ks.includes(p.k))ks.push(p.k);});ks.sort((a,b)=>P.find(p=>p.k===a).cy-P.find(p=>p.k===b).cy);
  ks.forEach(k=>{const Q=P.filter(p=>p.k===k),p0=Q[0],path=(dx,dy)=>{x.beginPath();Q.forEach(p=>blob(x,p,dx,dy,1));};
    // its shadow on what lies behind, then the mass
    path(0.8,1.8);x.fillStyle=rgba(pal.dark,0.85);x.fill();
    path(0,0);const g=x.createLinearGradient(p0.cx-p0.crx*0.55,p0.cy-p0.cry*1.1,p0.cx+p0.crx*0.45,p0.cy+p0.cry*0.9);g.addColorStop(0,rgba(pal.lit,1));g.addColorStop(0.42,rgba(pal.body,1));g.addColorStop(1,rgba(pal.dark,1));x.fillStyle=g;x.fill();
    x.save();x.clip();
    // lobes: the lit upper edge of some puffs inside the mass
    x.lineWidth=0.9;Q.forEach((p,i)=>{if(hash(i,sp.seed+50)>0.3)return;const l=(p.x-p.cx)/p.crx*0.7+(p.y-p.cy)/p.cry;x.strokeStyle=rgba(l<0.2?pal.hi:pal.lit,l<0.2?0.35:0.3);x.beginPath();x.ellipse(p.x,p.y,p.r*0.95,p.r*sq*0.95,0,Math.PI*1.02,Math.PI*1.6);x.stroke();
      x.strokeStyle=rgba(pal.dark,0.45);x.beginPath();x.ellipse(p.x,p.y,p.r*0.95,p.r*sq*0.95,0,Math.PI*0.05,Math.PI*0.6);x.stroke();});
    // the leaves: fine flecks, pale where the light falls, dark in the shade
    const nf=Math.round(p0.crx*p0.cry*(sp.leaf?0.55:0.9));for(let i=0;i<nf;i++){const h=j=>hash(i+k*997+sp.seed*13,j+40),a=h(0)*TAU,d=Math.sqrt(h(1)),fx=p0.cx+Math.cos(a)*d*p0.crx*1.1,fy=p0.cy+Math.sin(a)*d*p0.cry*1.1,
      l=(fx-p0.cx)/p0.crx*0.7+(fy-p0.cy)/p0.cry+(h(2)-0.5)*0.9;x.fillStyle=l<-0.1?rgba(pal.hi,0.35+0.4*h(3)):l>0.5?rgba(pal.dark,0.55):rgba(pal.lit,0.35);x.beginPath();
      if(sp.leaf)x.ellipse(fx,fy,sp.leaf*(0.7+0.5*h(4)),sp.leaf*0.42,h(5)*3,0,TAU);else x.ellipse(fx,fy,0.5+0.6*h(4),0.35+0.3*h(4),h(5)*3,0,TAU);x.fill();}
    x.restore();});
  ln_rim(x,M,-1.4*s,-1.8*s,rgba(pal.deep||[4,8,8],1),0.6,0);
  ln_rim(x,M,1.2*s,1.4*s,rgba(pal.rim,1),pal.ra||0.6,3*s);
  return{c,ox,oy};}
// the same cluster in four sub-pixel shifts, so that it can sway smoothly on whole pixels
function ln_cluster(key,sp,s){let F=LN_C.get(key);if(F)return F;const V=[0,1,2,3].map(k=>ln_leaves(sp,s,k/4));F={V:V.map(v=>v.c),ox:V[0].ox,oy:V[0].oy};LN_C.set(key,F);return F;}

/* ---------- the ground ---------- */
const LN_FAR=[[1300,0.56],[1742,0.64],[64,0.46],[586,0.4]];
// a far acacia on the horizon, k its size: a short trunk forking under a flat crown, dark against the hills, its top catching the last light
function ln_farTree(c,x,y,k,col){c.fillStyle=col;c.strokeStyle=col;c.lineCap="round";c.lineWidth=2.4*k;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-1*k,y-9*k,x+1*k,y-15*k);c.moveTo(x,y-6*k);c.quadraticCurveTo(x-6*k,y-11*k,x-10*k,y-15*k);c.moveTo(x+0.5*k,y-8*k);c.quadraticCurveTo(x+7*k,y-12*k,x+12*k,y-15.5*k);c.stroke();
  const P=[];for(let i=0;i<11;i++){const u=i/10-0.5;P.push([x+u*46*k+(hash(i,x)-0.5)*4*k,y-18*k-(1-4*u*u)*2.6*k+(hash(i,x+1)-0.5)*2*k,(4.6+2.4*hash(i,x+2))*k]);}
  c.beginPath();P.forEach(([px,py,r])=>{c.moveTo(px+r,py);c.ellipse(px,py,r,r*0.5,0,0,TAU);});c.fill();
  c.strokeStyle="rgba(255,196,140,0.3)";c.lineWidth=0.9;c.beginPath();P.forEach(([px,py,r])=>{c.moveTo(px-r*0.8,py-r*0.3);c.ellipse(px,py,r,r*0.5,0,Math.PI*1.12,Math.PI*1.88);});c.stroke();}
function ln_groundKit(y){const key="gd"+y;let G=LN_C.get(key);if(G)return G;const top=Math.floor(y-120),c=ln_cv(1920,1080-top),x=c.getContext("2d");x.translate(0,-top);
  // the last warmth of the day, low over the land
  let g=x.createLinearGradient(0,y-120,0,y+4);g.addColorStop(0,"rgba(255,170,110,0)");g.addColorStop(0.7,"rgba(255,160,100,0.035)");g.addColorStop(1,"rgba(255,150,96,0.08)");x.fillStyle=g;x.fillRect(0,y-120,1920,124);
  // far hills, a nearer ridge, and a line of bush with acacias on it; the farther, the paler and bluer
  const hill=(X,c,w,h)=>h*Math.exp(-((X-c)/w)*((X-c)/w)),far=X=>y-10-hill(X,300,220,30)-hill(X,820,300,20)-hill(X,1180,260,44)-hill(X,1560,190,26)-hill(X,1890,260,36)-12*(0.5+0.5*ln_fbm(X*0.004,11,4))-2.5*ln_fbm(X*0.02,12,2),
    mid=X=>y-5-hill(X,620,240,13)-hill(X,1420,320,17)-5*(0.5+0.5*ln_fbm(X*0.006,13,3)),near=X=>y-2-6*(0.5+0.5*ln_fbm(X*0.0042,23,3));
  const ridge=(f,c0,c1,h)=>{x.beginPath();x.moveTo(0,y+6);for(let X=0;X<=1920;X+=4)x.lineTo(X,f(X));x.lineTo(1920,y+6);x.closePath();g=x.createLinearGradient(0,y-h,0,y);g.addColorStop(0,c0);g.addColorStop(1,c1);x.fillStyle=g;x.fill();};
  ridge(far,"rgb(28,34,52)","rgb(18,22,34)",70);x.beginPath();for(let X=0;X<=1920;X+=4)X?x.lineTo(X,far(X)):x.moveTo(X,far(X));x.strokeStyle="rgba(160,168,210,0.16)";x.lineWidth=1.1;x.stroke();
  ridge(mid,"rgb(21,26,38)","rgb(16,20,28)",30);x.beginPath();for(let X=0;X<=1920;X+=4)X?x.lineTo(X,mid(X)):x.moveTo(X,mid(X));x.strokeStyle="rgba(150,150,170,0.08)";x.lineWidth=1;x.stroke();
  LN_FAR.forEach(([X,k])=>ln_farTree(x,X,near(X)+1,k,"rgb(8,11,14)"));
  x.beginPath();x.moveTo(0,y+6);for(let X=0;X<=1920;X+=4)x.lineTo(X,near(X));x.lineTo(1920,y+6);x.closePath();x.fillStyle="rgb(14,18,20)";x.fill();
  // the plain: a gently rolling edge, lit a little from the upper left, darker toward us
  const edge=X=>y+2.6*ln_fbm(X*0.005,5,3);x.beginPath();x.moveTo(0,1080);for(let X=0;X<=1920;X+=4)x.lineTo(X,edge(X));x.lineTo(1920,1080);x.closePath();
  g=x.createLinearGradient(0,y-4,0,1080);g.addColorStop(0,"rgb(50,58,38)");g.addColorStop(0.1,"rgb(34,42,28)");g.addColorStop(0.45,"rgb(19,24,17)");g.addColorStop(1,"rgb(7,9,8)");x.fillStyle=g;x.fill();
  x.save();x.clip();
  g=x.createLinearGradient(0,0,1920,0);g.addColorStop(0,"rgba(255,220,160,0.05)");g.addColorStop(0.5,"rgba(255,220,160,0)");g.addColorStop(1,"rgba(0,0,0,0.12)");x.fillStyle=g;x.fillRect(0,y-10,1920,1090-y);
  // patches of darker and paler grass, seen in perspective: noise laid on the plain, stretched with distance
  const tw=480,th=Math.max(1,Math.ceil((1080-y)/4)),N=ln_cv(tw,th),nx=N.getContext("2d"),D=nx.createImageData(tw,th);
  for(let j=0;j<th;j++){const dy=j*4+2,z=900/(dy+6),fade=Math.min(1,dy/50);for(let i=0;i<tw;i++){const wx=(i*4+2-960)/(dy+6),v=ln_n2(wx*1.1,z*1.1,7)*0.65+ln_n2(wx*3.1,z*3.1,8)*0.35,o=(j*tw+i)*4;
    if(v<0){D.data[o]=0;D.data[o+1]=0;D.data[o+2]=0;D.data[o+3]=Math.round(255*fade*Math.min(0.22,-v*0.5));}else{D.data[o]=150;D.data[o+1]=150;D.data[o+2]=92;D.data[o+3]=Math.round(255*fade*Math.min(0.06,Math.max(0,v-0.12)*0.22));}}}
  nx.putImageData(D,0,0);x.imageSmoothingEnabled=true;x.drawImage(N,0,y,1920,th*4);
  // grass all over the plain, seen in perspective: tapered blades, tiny near the horizon, taller and warmer toward us; the nearest in shade
  const bl=(px,py,h,w,lean,col)=>{x.fillStyle=col;x.beginPath();x.moveTo(px-w/2,py);x.quadraticCurveTo(px-w*0.2+lean*h*0.4,py-h*0.55,px+lean*h,py-h);x.quadraticCurveTo(px+w*0.2+lean*h*0.4,py-h*0.55,px+w/2,py);x.closePath();x.fill();};
  for(let i=0;i<9000;i++){const d=Math.pow(hash(i,311),1.5),px=hash(i,312)*1940-10,py=y+5+d*(1085-y),h=(0.8+1.6*hash(i,313))*(1+14*Math.pow(d,1.4)),w=0.6+2.4*d,lean=(hash(i,314)-0.4)*0.55,q=hash(i,315),
      lt=clamp(1.1-0.9*d,0.25,1),a=(0.1+0.22*d)*(0.6+0.4*hash(i,316));
    bl(px,py,h,w,lean,q<0.45?rgba(mix([96,100,60],[164,144,96],d),a*lt):q<0.75?rgba([4,6,4],0.35+0.25*d):rgba(mix([60,70,44],[120,100,66],d),a*1.3*lt));}
  // a few stones, lit from the upper left
  for(let i=0;i<16;i++){const d=0.35+0.65*hash(i,321),px=hash(i,322)*1920,py=y+10+d*(1080-y-20),r=(1.5+3*hash(i,323))*(0.5+1.4*d);
    x.fillStyle="rgba(3,4,3,0.5)";x.beginPath();x.ellipse(px+r*0.3,py+r*0.25,r*1.1,r*0.5,0,0,TAU);x.fill();x.fillStyle="rgba(46,50,40,0.8)";x.beginPath();x.ellipse(px,py,r,r*0.5,0,0,TAU);x.fill();
    x.fillStyle="rgba(150,150,120,0.16)";x.beginPath();x.ellipse(px-r*0.3,py-r*0.16,r*0.5,r*0.2,0,0,TAU);x.fill();}
  x.restore();
  // the rim of the land, where the light catches it
  x.save();x.beginPath();for(let X=0;X<=1920;X+=4)X?x.lineTo(X,edge(X)):x.moveTo(X,edge(X));g=x.createLinearGradient(0,0,1920,0);g.addColorStop(0,"rgba(190,205,140,0.42)");g.addColorStop(1,"rgba(160,180,130,0.22)");
  x.strokeStyle=g;x.lineWidth=1.3;x.shadowColor="rgba(170,200,120,0.6)";x.shadowBlur=6;x.stroke();x.restore();
  G={c,top};LN_C.set(key,G);return G;}
// the ground of a scene, from y down to the bottom of the frame: a grassland at dusk, with hills and acacias far off
function ground(ctx,y,t,a){const G=ln_groundKit(Math.round(y));withA(ctx,a==null?1:a,()=>ln_put(ctx,[G.c],0,G.top));}

/* ---------- grass ---------- */
// three depths of grass, back to front: spacing of clumps, blade heights, blades a clump, blade widths, sway (px at the tip), rooting depth,
// spread of a clump, share of empty places, and how many kinds of clump
const LN_GR=[{d:6,h:[5,12],n:[6,10],w:[1.0,1.6],A:1.4,dy:[-6,-1],sp:9,skip:0.03,V:8,dim:0.5},
  {d:11,h:[10,24],n:[6,10],w:[1.4,2.3],A:4,dy:[-1,4],sp:13,skip:0.08,V:10,dim:0.76},
  {d:20,h:[16,38],n:[5,10],w:[1.8,3.0],A:7,dy:[3,13],sp:16,skip:0.22,V:12,dim:1}];
// tones of blades, from the base (in shade) to the tip (in the last light): olive, straw, rust, grey-green
const LN_GT=[[[20,24,16],[62,70,40],[134,136,80]],[[26,24,16],[98,86,50],[184,164,104]],[[24,20,16],[94,70,46],[160,122,82]],[[16,24,20],[54,72,54],[104,128,92]]];
// a blade: its centre line bends by its lean, its own curl, and the wind D, most near the tip; it tapers to a point
function ln_blade(c,b,D,hr,lit){const f=Math.pow(b.h/hr,1.5),bend=b.cu*b.h+D*f,tip=b.lean*b.h+bend,k=1-0.14*Math.min(1,(tip/b.h)*(tip/b.h)),n=7,L=[],R=[];
  for(let i=0;i<=n;i++){const u=i/n,x=b.bx+b.lean*b.h*u+bend*u*u,y=-b.h*k*u,dx=b.lean*b.h+2*bend*u,dy=-b.h*k,l=Math.hypot(dx,dy),nx=-dy/l,ny=dx/l,hw=b.w/2*Math.pow(1-u,0.75);
    L.push([x-nx*hw,y-ny*hw]);R.push([x+nx*hw,y+ny*hw]);}
  c.beginPath();c.moveTo(L[0][0],L[0][1]);for(let i=1;i<=n;i++)c.lineTo(L[i][0],L[i][1]);for(let i=n-1;i>=0;i--)c.lineTo(R[i][0],R[i][1]);c.closePath();c.fill();
  if(lit){c.beginPath();c.moveTo(L[2][0],L[2][1]);for(let i=3;i<n;i++)c.lineTo(L[i][0],L[i][1]);c.stroke();}
  return[b.bx+tip,-b.h*k,b.lean*b.h+2*bend,-b.h*k];}
// cuts the cells [x,y,w,h] of the atlas c into canvases of their own, each trimmed to what shows in it, with its offset (ox,oy) in the cell:
// a whole small canvas is drawn several times faster than a piece of a big one
function ln_cut(c,cells){const W=c.width,D=c.getContext("2d").getImageData(0,0,W,c.height).data;return cells.map(([x,y,w,h])=>{let a=w,b=h,e=-1,f=-1;
  for(let j=0;j<h;j++){const r=((y+j)*W+x)*4+3;for(let i=0;i<w;i++)if(D[r+i*4]>1){if(i<a)a=i;if(i>e)e=i;if(j<b)b=j;f=j;}}
  if(e<0){a=0;b=0;e=0;f=0;}const q=ln_cv(e-a+1,f-b+1);q.getContext("2d").drawImage(c,x+a,y+b,e-a+1,f-b+1,0,0,e-a+1,f-b+1);return{c:q,ox:a,oy:b};});}
// the clumps of each depth, painted once at every lean the breeze can give them (0.5 px apart at the tip), into one atlas a depth
function ln_grassKit(){let K=LN_C.get("gr");if(K)return K;
  K=LN_GR.map((G,li)=>{const hr=G.h[1],D0=G.A*0.12,NL=Math.ceil((G.A*1.35-D0)*2)+1,vars=[];
    for(let v=0;v<G.V;v++){const q=j=>hash(v+li*50,j),n=G.n[0]+Math.floor(q(1)*(G.n[1]-G.n[0]+1)),B=[];
      for(let i=0;i<n;i++){const r=j=>hash(v*31+i+li*977,j+10),bx=(r(2)-0.5)*G.sp*(0.35+0.65*r(3));B.push({bx,h:lerp(G.h[0],hr,Math.pow(r(4),0.75)),lean:bx/G.sp*0.55+(r(5)-0.5)*0.3,cu:(r(6)-0.4)*0.28,w:lerp(G.w[0],G.w[1],r(7)),tone:Math.floor(r(8)*4)});}
      B.mean=B.reduce((s,b)=>s+b.h,0)/n;B.sort((a,b)=>b.h-a.h);vars.push(B);}
    vars.sort((a,b)=>a.mean-b.mean);  // shortest clumps first, so that a scene can pick taller ones where the grass grows lush
    // how far any blade reaches, at the least and the most wind
    let x0=0,x1=0;vars.forEach(B=>B.forEach(b=>[D0,D0+(NL-1)*0.5].forEach(D=>{const f=Math.pow(b.h/hr,1.5),tip=b.bx+b.lean*b.h+b.cu*b.h+D*f;x0=Math.min(x0,tip-4,b.bx-3);x1=Math.max(x1,tip+4,b.bx+3);})));
    const cw=Math.ceil(x1-x0)+4,ax=Math.ceil(-x0)+2,rows=[];let yy=0;vars.forEach(B=>{const h=Math.ceil(B[0].h)+7;rows.push({y:yy,h,ay:h-2});yy+=h;});
    const c=ln_cv(cw*NL,yy),x=c.getContext("2d"),dimC=col=>mix([10,14,22],col,G.dim);
    const grads=LN_GT.map(T=>{const g=x.createLinearGradient(0,0,0,-hr*1.15);g.addColorStop(0,rgba(dimC(T[0]),1));g.addColorStop(0.45,rgba(dimC(T[1]),1));g.addColorStop(1,rgba(dimC(T[2]),1));return g;});
    x.lineWidth=0.6;x.strokeStyle=rgba(dimC([220,214,160]),0.32);
    vars.forEach((B,v)=>{for(let l=0;l<NL;l++){x.setTransform(1,0,0,1,l*cw+ax,rows[v].y+rows[v].ay);B.forEach(b=>{x.fillStyle=grads[b.tone];ln_blade(x,b,D0+l*0.5,hr,li>0);});}});
    const sp=li<2?null:ln_cut(c,rows.flatMap(r=>Array.from({length:NL},(_,l)=>[l*cw,r.y,cw,r.h])));
    return{c:li<2?c:null,cw,ax,rows,NL,D0,hr,sp};});
  LN_C.set("gr",K);return K;}

/* seed stems, standing above the clumps here and there: a culm with a leaf or two, and a head */
// an airy panicle (Panicum): a nodding axis with hair-thin branches in whorls, longest below, drooping, a spikelet at each tip
function ln_panicle(c,tip,sd){const [x,y,dx,dy]=tip,dr=dx>=0?1:-1,L=22+8*hash(sd,1),n=8,ax=[];let px=x,py=y,a=Math.atan2(dy,dx);
  for(let i=0;i<=n;i++){ax.push([px,py,a]);a+=dr*0.17;px+=Math.cos(a)*L/n;py+=Math.sin(a)*L/n;}
  const sp=(qx,qy,e)=>{c.fillStyle="rgba(196,178,132,0.95)";c.beginPath();c.ellipse(qx,qy,1.5,0.65,e,0,TAU);c.fill();c.fillStyle="rgba(240,228,190,0.55)";c.beginPath();c.ellipse(qx-0.3,qy-0.35,0.7,0.3,e,0,TAU);c.fill();};
  c.lineCap="round";c.strokeStyle="rgba(156,140,102,0.8)";c.lineWidth=0.6;c.beginPath();ax.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  for(let i=1;i<n;i++)for(let k=0;k<(i<4?2:1);k++){const [bx,by,ba]=ax[i],sde=(i+k)%2?1:-1,bl=(5+13*(1-i/n))*(0.75+0.5*hash(i*2+k,sd+2));let qx=bx,qy=by,qa=ba+sde*(0.85+0.4*hash(i*2+k,sd+3));const P=[[qx,qy]];
    for(let j=0;j<5;j++){qx+=Math.cos(qa)*bl/5;qy+=Math.sin(qa)*bl/5+0.02*j*j*bl;P.push([qx,qy]);}
    c.strokeStyle="rgba(156,140,102,0.55)";c.lineWidth=0.42;c.beginPath();P.forEach((p,j)=>j?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
    const e=Math.atan2(P[5][1]-P[4][1],P[5][0]-P[4][0]);sp(P[5][0]+Math.cos(e)*1.2,P[5][1]+Math.sin(e)*1.2,e);if(bl>9&&hash(i*2+k,sd+4)<0.7){const m=P[3],e2=e+sde*0.7;c.beginPath();c.moveTo(m[0],m[1]);c.lineTo(m[0]+Math.cos(e2)*2.5,m[1]+Math.sin(e2)*2.5);c.stroke();sp(m[0]+Math.cos(e2)*3.6,m[1]+Math.sin(e2)*3.6,e2);}}
  const e=ax[n];sp(e[0],e[1],e[2]);}
// red oat grass (Themeda): clusters of rusty spikelets in narrow sheaths, nodding from the top of the culm on short stalks,
// each with a long dark awn, twisted, bent at the knee
function ln_themeda(c,S,sd){c.lineCap="round";[[0.66,-1],[0.82,1],[1,-1]].forEach(([u,sde],j)=>{const p=S(u),q=S(Math.max(0,u-0.02)),ta=Math.atan2(p[1]-q[1],p[0]-q[0]),
    pa=ta+sde*(j===2?0.5:1.0),pl=j===2?2.5:4,x=p[0]+Math.cos(pa)*pl,y=p[1]+Math.sin(pa)*pl,ha=Math.PI/2-sde*0.35;  // the cluster hangs, a little outward
    c.strokeStyle="rgba(100,76,50,0.9)";c.lineWidth=0.5;c.beginPath();c.moveTo(p[0],p[1]);c.quadraticCurveTo(p[0]+Math.cos(pa)*pl*1.2,p[1]+Math.sin(pa)*pl*1.2-1,x,y);c.stroke();
    // the sheath (a spathe), then the spikelets in its mouth
    c.fillStyle="rgba(84,56,40,0.95)";c.beginPath();c.ellipse(x+Math.cos(ha)*3.4,y+Math.sin(ha)*3.4,3.8,0.9,ha,0,TAU);c.fill();
    for(let k=0;k<3;k++){const a=ha+(k-1)*0.28,cx=x+Math.cos(a)*5,cy=y+Math.sin(a)*5;c.fillStyle="rgba(116,74,50,0.95)";c.beginPath();c.ellipse(cx,cy,2.3,0.75,a,0,TAU);c.fill();
      c.fillStyle="rgba(170,114,78,0.45)";c.beginPath();c.ellipse(cx-0.3,cy-0.3,1.2,0.35,a,0,TAU);c.fill();}
    // the awn of the fertile spikelet
    const ex=x+Math.cos(ha)*7,ey=y+Math.sin(ha)*7,a1=ha-sde*0.5,l1=5+2*hash(j,sd),kx=ex+Math.cos(a1)*l1,ky=ey+Math.sin(a1)*l1,b2=a1-sde*(0.9+0.3*hash(j,sd+5)),l2=7+4*hash(j,sd+6);
    c.strokeStyle="rgba(50,36,26,0.95)";c.lineWidth=0.5;c.beginPath();c.moveTo(ex,ey);for(let s=1;s<=4;s++){const w=s%2?0.45:-0.45;c.lineTo(lerp(ex,kx,s/4)+w*Math.sin(a1),lerp(ey,ky,s/4)-w*Math.cos(a1));}c.lineTo(kx+Math.cos(b2)*l2,ky+Math.sin(b2)*l2);c.stroke();
    c.strokeStyle="rgba(150,110,76,0.4)";c.lineWidth=0.4;c.beginPath();c.moveTo(kx,ky);c.lineTo(kx+Math.cos(b2)*l2,ky+Math.sin(b2)*l2);c.stroke();});}
const LN_ST={V:6,A:6,hr:38};
function ln_stemKit(){let K=LN_C.get("gs");if(K)return K;const G=LN_ST,D0=G.A*0.12,NL=Math.ceil((G.A*1.35-D0)*2)+1,vars=[];
  for(let v=0;v<G.V;v++){const q=j=>hash(v,j+60),h=G.hr*1.55*(0.72+0.56*q(1)),kind=v%2;
    vars.push({h,kind,lean:(q(2)-0.45)*0.22,cu:0.05+0.08*q(3),w:1.25,tone:1,bx:0,leaves:[[0.18+0.12*q(4),q(5)<0.5?-1:1,12+8*q(6)],[0.42+0.1*q(7),q(5)<0.5?1:-1,9+6*q(8)]]});}
  const cw=110,ax=48,ch=Math.ceil(G.hr*1.55*1.28)+34,c=ln_cv(cw*NL,ch*G.V),x=c.getContext("2d");
  vars.forEach((b,v)=>{for(let l=0;l<NL;l++){x.setTransform(1,0,0,1,l*cw+ax,v*ch+ch-3);const D=D0+l*0.5,f=1,bend=b.cu*b.h+D*f,k=1-0.1*Math.min(1,((b.lean*b.h+bend)/b.h)**2);
      const S=u=>[b.lean*b.h*u+bend*u*u,-b.h*k*u],Sd=u=>[b.lean*b.h+2*bend*u,-b.h*k];
      // the leaves at its nodes, arching away
      b.leaves.forEach(([u,sde,L])=>{const p=S(u),d=Sd(u),a=Math.atan2(d[1],d[0])+sde*0.55,ex=p[0]+Math.cos(a)*L*0.55+sde*L*0.35+D*0.3,ey=p[1]+Math.sin(a)*L*0.55+L*0.25;
        x.fillStyle="rgb(56,58,34)";x.beginPath();x.moveTo(p[0]-0.6,p[1]);x.quadraticCurveTo(p[0]+Math.cos(a)*L*0.5,p[1]+Math.sin(a)*L*0.5-1,ex,ey);x.quadraticCurveTo(p[0]+Math.cos(a)*L*0.45+0.8,p[1]+Math.sin(a)*L*0.45+0.4,p[0]+0.6,p[1]+0.6);x.fill();});
      // the culm, straw-coloured toward its top
      const g=x.createLinearGradient(0,0,0,-b.h);g.addColorStop(0,"rgb(40,40,26)");g.addColorStop(0.5,"rgb(112,100,62)");g.addColorStop(1,"rgb(170,152,104)");x.fillStyle=g;
      x.beginPath();for(let i=0;i<=12;i++){const p=S(i/12),hw=0.65*(1-i/14);i?x.lineTo(p[0]-hw,p[1]):x.moveTo(p[0]-hw,p[1]);}for(let i=12;i>=0;i--){const p=S(i/12),hw=0.65*(1-i/14);x.lineTo(p[0]+hw,p[1]);}x.closePath();x.fill();
      const e=S(1),d=Sd(1);if(b.kind===0)ln_panicle(x,[e[0],e[1],d[0],d[1]],v*7+3);else ln_themeda(x,S,v*7+3);}});
  K={cw,ax,ch,NL,D0,vars,sp:ln_cut(c,vars.flatMap((_,v)=>Array.from({length:NL},(_,l)=>[l*cw,v*ch,cw,ch])))};LN_C.set("gs",K);return K;}

/* where the clumps and stems of one stretch of grass stand; the back two depths are baked into strips, one per lean, cut into slices each frame */
function ln_grassLay(x0,x1,y){const key=x0+"_"+x1+"_"+y,LC=LN_C.get("gl")||new Map();LN_C.set("gl",LC);let P=LC.get(key);if(P){LC.delete(key);LC.set(key,P);return P;}
  const K=ln_grassKit();
  P=K.map((L,li)=>{const G=LN_GR[li],s=li*7,cl=[];
    for(let i=Math.floor((x0-40)/G.d),i1=Math.ceil((x1+40)/G.d);i<=i1;i++){const cx=(i+0.15+0.7*hash(i,s+4))*G.d,lush=0.5+0.5*ln_fbm(cx*0.0045+li*2.3,91,2);
      if(hash(i,s+3)<G.skip+(0.5-lush)*0.3||cx<x0-24||cx>x1+24)continue;
      const v=Math.floor(clamp(lush*0.9+(hash(i,s+5)-0.5)*0.7,0,0.999)*G.V);cl.push({cx,v,R:L.rows[v],dy:lerp(G.dy[0],G.dy[1],hash(i,s+6)),ph:hash(i,s+7)*TAU});}
    if(li===2)return{cl};
    // a strip: every clump of this depth at each lean, stacked
    const X0=Math.floor(x0-40-L.cw),W=Math.ceil(x1+40+L.cw)-X0;let top=1e9,bot=-1e9;cl.forEach(k=>{const yy=Math.round(y+k.dy-k.R.ay);top=Math.min(top,yy);bot=Math.max(bot,yy+k.R.h);});
    const SH=bot-top,cs=[];
    for(let l=0;l<L.NL;l++){const c=ln_cv(W,SH),x=c.getContext("2d");cl.forEach(k=>x.drawImage(L.c,l*L.cw,k.R.y,L.cw,k.R.h,Math.round(k.cx-L.ax)-X0,Math.round(y+k.dy-k.R.ay)-top,L.cw,k.R.h));cs.push(c);}
    return{cs,X0,W,top,SH};});
  // the stems: a few, in loose groups where the grass grows lush
  const SK=ln_stemKit(),st=[];for(let i=Math.floor(x0/70)-1,i1=Math.ceil(x1/70)+1;i<=i1;i++){const lush=0.5+0.5*ln_fbm(i*70*0.0045+4.6,91,2);if(hash(i,501)>0.22+0.5*lush)continue;
    const n=1+Math.floor(hash(i,502)*3);for(let j=0;j<n;j++){const cx=(i+hash(i*5+j,503))*70;if(cx<x0-10||cx>x1+10)continue;st.push({cx,v:Math.floor(hash(i*5+j,504)*SK.vars.length),dy:6+8*hash(i*5+j,505),ph:hash(i*5+j,506)*TAU});}}
  P.st=st;LC.set(key,P);if(LC.size>4)LC.delete(LC.keys().next().value);return P;}
// grass along y from x0 to x1: tapered blades of many heights, leans and tones, in clumps, at three depths, with a few seed heads;
// gusts roll across from the left, the near blades moving most
function grass(ctx,x0,x1,y,t,a){const K=ln_grassKit(),P=ln_grassLay(x0,x1,y),SK=ln_stemKit();withA(ctx,a==null?1:a,()=>{const m=ctx.getTransform(),un=m.a===1&&m.d===1&&m.b===0&&m.c===0,flat=m.b===0&&m.c===0&&m.a>0&&m.d>0;
  // drawn 1:1 on whole pixels, the sprites need no resampling
  if(un)ctx.imageSmoothingEnabled=false;const X=v=>flat?(Math.round(m.a*v+m.e)-m.e)/m.a:v,Y=v=>flat?(Math.round(m.d*v+m.f)-m.f)/m.d:v;  // on whole device pixels
  // the back depths: slices 16 px wide, each at the lean of the breeze at its middle, neighbouring slices of one lean drawn as one,
  // each a strip seen through a clip whose edges lie on whole device pixels
  [0,1].forEach(li=>{const L=K[li],S=P[li],A=LN_GR[li].A,n=Math.ceil(S.W/16),lv=[];
    for(let k=0;k<n;k++){const xc=S.X0+k*16+8,w=ln_wind(xc,t)+0.05*Math.sin(t*2.3+xc*0.043);lv.push(clamp(Math.round((w*A-L.D0)*2),0,L.NL-1));}
    const ox=X(S.X0),oy=Y(S.top),dv=(u,sy)=>flat?(Math.round(sy?m.d*u+m.f:m.a*u+m.e)-(sy?m.f:m.e))/(sy?m.d:m.a):u;
    for(let k=0;k<n;){let j=k+1;while(j<n&&lv[j]===lv[k])j++;if(k===0&&j===n)ctx.drawImage(S.cs[lv[k]],ox,oy);
      else{const u0=dv(ox+k*16,0),u1=dv(ox+Math.min(S.W,j*16),0),v0=dv(oy,1),v1=dv(oy+S.SH,1);ctx.save();ctx.beginPath();ctx.rect(u0,v0,u1-u0,v1-v0);ctx.clip();ctx.drawImage(S.cs[lv[k]],ox,oy);ctx.restore();}k=j;}});
  // the stems, then the nearest clumps over their feet, each clump with its own flutter
  P.st.forEach(s=>{const w=ln_wind(s.cx,t)+0.08*Math.sin(t*1.9+s.ph)+0.04*Math.sin(t*3.1+s.ph*1.7),l=clamp(Math.round((w*LN_ST.A-SK.D0)*2),0,SK.NL-1),r=SK.sp[s.v*SK.NL+l];
    ctx.drawImage(r.c,X(s.cx-SK.ax+r.ox),Y(y+s.dy-SK.ch+3+r.oy));});
  const L=K[2],G=LN_GR[2];P[2].cl.forEach(k=>{const w=ln_wind(k.cx,t)+0.07*Math.sin(t*2.3+k.ph)+0.035*Math.sin(t*3.7+k.ph*1.7),lv=clamp(Math.round((w*G.A-L.D0)*2),0,L.NL-1),r=L.sp[k.v*L.NL+lv];
    ctx.drawImage(r.c,X(k.cx-L.ax+r.ox),Y(y+k.dy-k.R.ay+r.oy));});});}

/* ---------- an umbrella thorn acacia ---------- */
// in its own units (about 380 wide, 265 tall), its foot at (0,0): a short trunk forks into limbs that rise steeply, fork again, and fan out
// in thin branches under a broad flat crown, with a lower tier on each side and a raised one on top. Monkeys climbing it sit on the limbs at
// (-47,-140), (27,-167), (-20,-200) and (60,-120), so the limbs pass just under those points
const LN_TREE={
  limbs:[[[0,4,-3,-18,3,-36,1,-54],26,17],
    [[-3,-50,-18,-84,-34,-116,-62,-154],12,8],[[-62,-154,-76,-170,-90,-186,-106,-204],8,4.5],[[-100,-198,-116,-200,-132,-202,-156,-209],3.4,1.4],[[-90,-186,-88,-200,-84,-212,-80,-228],3.6,1.6],
    [[-1,-52,-6,-110,-14,-170,-24,-228],10,4],[[-16,-180,-30,-196,-44,-208,-62,-224],3.2,1.3],
    [[2,-52,12,-100,24,-148,40,-226],10,4],[[30,-180,44,-196,58,-208,76,-224],3.2,1.3],[[36,-205,34,-220,31,-236,30,-250],2.4,1.2],
    [[5,-50,22,-76,42,-104,76,-132],11,7],[[76,-132,96,-150,116,-172,140,-194],7,3.2],[[96,-150,100,-170,102,-192,100,-226],3.6,1.6],[[124,-176,140,-182,156,-186,178,-196],2,1],
    [[-128,-202,-140,-202,-152,-204,-168,-210],1.6,0.8]],
  // the crown's tiers, back to front: the far side in shade, a raised tier on top, the broad main mat, and a lower tier each side
  back:{x:22,y:-244,rx:138,ry:14},
  pads:[{x:36,y:-255,rx:80,ry:9,sw:1.15},{x:-4,y:-236,rx:152,ry:17,sw:1},{x:-142,y:-213,rx:50,ry:10,sw:0.8},{x:142,y:-196,rx:52,ry:10,sw:0.75}]};
const LN_LEAF_TREE={dark:[16,20,14],body:[40,47,29],lit:[80,86,52],hi:[150,148,94],rim:[200,186,124],ra:0.55,deep:[6,8,7]};
const LN_LEAF_BACK={dark:[7,10,11],body:[16,22,20],lit:[30,36,30],hi:[62,70,54],rim:[108,112,86],ra:0.32,deep:[3,4,5]};
// a flat mat of fine leaves (an acacia's crown tier) {rx,ry,seed,pal}, sub px right of centre: a gently domed, lobed top of many small
// leaf clusters, a flat underside in deep shade, fine leaflets over it; returns {c,ox,oy}, (ox,oy) where its centre lies
function ln_mat(sp,s,sub){const {rx,ry,pal}=sp,sd=sp.seed,m=Math.ceil(12*s),W=Math.ceil(2*rx*s)+2*m+2,H=Math.ceil(2.4*ry*s)+2*m,ox=m+Math.ceil(rx*s),oy=m+Math.ceil(1.4*ry*s);
  const c=ln_cv(W,H),x=c.getContext("2d"),M=ln_cv(W,H),mx=M.getContext("2d"),T=q=>q.setTransform(s,0,0,s,ox+(sub||0),oy);
  const lob=X=>0.5+0.5*ln_fbm(X*0.028+sd*1.7,sd,3),e=X=>Math.sqrt(Math.max(0,1-(X/rx)*(X/rx))),top=X=>-ry*(0.3+0.7*Math.pow(e(X),0.55))*(0.7+0.55*lob(X)),bot=X=>ry*(0.5+0.08*ln_n1(X*0.06,sd+3))*Math.min(1,e(X)*2.6);
  const P=[],N=Math.round(2.3*rx*ry/3);for(let i=0;i<N;i++){const h=j=>hash(i+sd*1013,sd+j),X=(2*h(1)-1)*rx*0.98,tp=top(X),bt=bot(X),v=Math.pow(h(2),0.8);if(lob(X)<0.3&&v<0.35&&h(6)<0.7)continue;
    const Y=lerp(tp,bt,v),r=(2.2+2.6*h(3))*(0.75+0.35*e(X));P.push({x:X,y:Y+r*0.3,r,v});}
  // the mask: the core, and the clusters round it
  T(mx);mx.fillStyle="#fff";mx.beginPath();for(let X=-rx*0.97;X<=rx*0.97;X+=3)mx.lineTo(X,top(X)*0.55);for(let X=rx*0.97;X>=-rx*0.97;X-=3)mx.lineTo(X,bot(X)-1);mx.closePath();mx.fill();
  mx.beginPath();P.forEach(p=>{mx.moveTo(p.x+p.r,p.y);mx.ellipse(p.x,p.y,p.r,p.r*0.6,0,0,TAU);});mx.fill();
  // shaded as one mass: lit on top, darkening down to a flat underside in deep shade; a little brighter to the left, where the light comes from
  let g=x.createLinearGradient(0,oy-ry*s*1.1,0,oy+ry*0.6*s);g.addColorStop(0,rgba(pal.lit,1));g.addColorStop(0.42,rgba(pal.body,1));g.addColorStop(0.78,rgba(pal.dark,1));g.addColorStop(1,rgba(pal.deep,1));ln_tint(x,M,g,1);
  const L=ln_cv(W,H),lx=L.getContext("2d");T(lx);
  g=lx.createLinearGradient(-rx,0,rx,0);g.addColorStop(0,rgba(pal.hi,0.16));g.addColorStop(0.45,rgba(pal.hi,0));g.addColorStop(1,"rgba(0,0,0,0.22)");lx.fillStyle=g;lx.fillRect(-rx-20,-ry*3,2*rx+40,ry*5);
  // each cluster: a lit crescent on its upper left, a shadow on its lower right; fine leaflets over them
  lx.lineWidth=0.8/s*1.2;P.forEach((p,i)=>{if(p.v>0.75||hash(i,sd+40)>0.55)return;lx.strokeStyle=rgba(pal.hi,0.14+0.2*(1-p.v));lx.beginPath();lx.ellipse(p.x,p.y,p.r*0.9,p.r*0.54,0,Math.PI*1.05,Math.PI*1.7);lx.stroke();
    lx.strokeStyle=rgba(pal.dark,0.35);lx.beginPath();lx.ellipse(p.x,p.y,p.r*0.9,p.r*0.54,0,Math.PI*0.1,Math.PI*0.7);lx.stroke();});
  const nf=Math.round(rx*ry*1.3);for(let i=0;i<nf;i++){const h=j=>hash(i+sd*577,j+70),X=(2*h(0)-1)*rx,tp=top(X),bt=bot(X),v=h(1),Y=lerp(tp,bt,v),l=v-0.35*(X/rx)+(h(2)-0.5)*0.6;
    lx.fillStyle=l<0.2?rgba(pal.hi,0.22+0.3*h(3)):l>0.62?rgba(pal.deep,0.5):rgba(pal.lit,0.28);lx.beginPath();lx.ellipse(X,Y,0.7+0.5*h(4),0.3+0.2*h(4),h(5)*3,0,TAU);lx.fill();}
  lx.setTransform(1,0,0,1,0,0);lx.globalCompositeOperation="destination-in";lx.drawImage(M,0,0);x.drawImage(L,0,0);
  // a few leaflets hanging below the underside, so that its edge is soft
  T(x);for(let i=0;i<rx*0.5;i++){const h=j=>hash(i+sd*331,j+90),X=(2*h(0)-1)*rx*0.9,Y=bot(X)+0.3+1.2*h(1);if(bot(X)<1)continue;x.fillStyle=rgba(pal.dark,0.8);x.beginPath();x.ellipse(X,Y,0.9,0.4,0.3+h(2),0,TAU);x.fill();}
  ln_rim(x,M,-1.2*s,-1.6*s,rgba(pal.deep,1),0.6,0);ln_rim(x,M,1.0*s,1.3*s,rgba(pal.rim,1),pal.ra,2.5*s);
  return{c,ox,oy};}
function ln_treeKit(s){const key="tr"+s;let K=LN_C.get(key);if(K)return K;
  const m=24,X0=Math.floor(-196*s-m),Y0=Math.floor(-270*s-m),W=Math.ceil(392*s+2*m),H=Math.ceil(282*s+2*m),c=ln_cv(W,H),x=c.getContext("2d"),T=q=>q.setTransform(s,0,0,s,-X0,-Y0);
  // its shadow on the ground
  T(x);x.save();x.translate(10,1);x.scale(1,0.06);let g=x.createRadialGradient(0,0,0,0,0,160);g.addColorStop(0,"rgba(0,0,0,0.5)");g.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=g;x.beginPath();x.arc(0,0,160,0,TAU);x.fill();x.restore();
  // the crown's far side, in shade
  const b=LN_TREE.back,BL=ln_mat(Object.assign({seed:80,pal:LN_LEAF_BACK},b),s,0);x.setTransform(1,0,0,1,0,0);x.drawImage(BL.c,Math.round(-X0+b.x*s-BL.ox),Math.round(-Y0+b.y*s-BL.oy));
  // trunk and limbs: dark grey-brown bark, fissured, lit from the upper left
  const M=ln_cv(W,H),mx=M.getContext("2d");T(mx);mx.fillStyle="#fff";mx.beginPath();LN_TREE.limbs.forEach(l=>ln_tube(mx,l[0],l[1],l[2]));
  mx.moveTo(-21,4);mx.quadraticCurveTo(-12,0,-11,-16);mx.lineTo(11,-16);mx.quadraticCurveTo(12,0,23,4);mx.closePath();mx.fill();
  g=x.createLinearGradient(-X0-150*s,-Y0-250*s,-X0+150*s,-Y0);g.addColorStop(0,"rgb(66,58,50)");g.addColorStop(1,"rgb(34,30,28)");ln_tint(x,M,g,1);
  const F=ln_cv(W,H),fx=F.getContext("2d");T(fx);fx.lineCap="round";
  LN_TREE.limbs.forEach((l,li)=>{if(l[1]<4)return;[-0.3,-0.05,0.22,0.4].forEach((o,j)=>{fx.beginPath();let on=false;for(let i=0;i<=30;i++){const u=i/30,q=ln_bz(l[0],u),q2=ln_bz(l[0],Math.min(1,u+0.03)),tx=q2[0]-q[0],ty=q2[1]-q[1],tl=Math.hypot(tx,ty)||1,w=lerp(l[1],l[2],u),px=q[0]-ty/tl*o*w,py=q[1]+tx/tl*o*w,vis=ln_n1(u*9+j*3,li*5+j)>-0.2;
      if(vis&&on)fx.lineTo(px,py);else if(vis)fx.moveTo(px,py);on=vis;}fx.strokeStyle=j===3?"rgba(130,118,100,0.42)":"rgba(14,11,10,0.75)";fx.lineWidth=j===3?0.6:0.8;fx.stroke();});});
  const Fr=F.getContext("2d");Fr.globalCompositeOperation="destination-in";Fr.setTransform(1,0,0,1,0,0);Fr.drawImage(M,0,0);x.save();x.setTransform(1,0,0,1,0,0);x.drawImage(F,0,0);x.restore();
  ln_rim(x,M,-1.6*s,-1.2*s,"rgb(8,6,5)",0.6,0);ln_rim(x,M,1.1*s,1.2*s,"rgb(210,180,136)",0.55,2.5*s);
  // pale thorns in pairs on the thin branches
  T(x);x.strokeStyle="rgba(232,224,204,0.5)";x.lineWidth=0.45;LN_TREE.limbs.forEach((l,li)=>{if(l[2]>1.7)return;for(let k=1;k<4;k++){const q=ln_bz(l[0],k/4.4);x.beginPath();x.moveTo(q[0],q[1]);x.lineTo(q[0]-2.2,q[1]-1.9);x.moveTo(q[0],q[1]);x.lineTo(q[0]+1.9,q[1]-2.3);x.stroke();}});
  const pads=LN_TREE.pads.map((p,j)=>{const key="tp"+s+"_"+j;let F=LN_C.get(key);if(!F){const V=[0,1,2,3].map(k=>ln_mat(Object.assign({seed:20+j*3,pal:LN_LEAF_TREE},p),s,k/4));F={V:V.map(v=>v.c),ox:V[0].ox,oy:V[0].oy};LN_C.set(key,F);}
    return{V:F.V,ox:F.ox,oy:F.oy,x:p.x*s,y:p.y*s,h:-p.y/250*p.sw,ph:hash(j,5)*TAU};});
  K={c,X0,Y0,pads};LN_C.set(key,K);return K;}
// an umbrella thorn acacia, its foot at (x,y), s its size; with t, its crown sways in the breeze (its tiers each a little differently), its trunk and limbs hold still
function tree(ctx,x,y,s,a,t){t=t||0;const K=ln_treeKit(s);withA(ctx,a==null?1:a,()=>{const m=ctx.getTransform();ln_put(ctx,[K.c],x+K.X0,y+K.Y0,m);const w=ln_wind(x,t)-0.7;
  K.pads.forEach(p=>{const dx=s*p.h*(3.2*w+0.9*Math.sin(t*1.1+p.ph)+0.45*Math.sin(t*2.1+p.ph*2));ln_put(ctx,p.V,x+p.x-p.ox+dx,y+p.y-p.oy,m);});});}

/* ---------- a bush ---------- */
// its clusters of leaves, back to front: the upper ones behind, then the low ones in front (f), which can also be drawn alone, over whatever hides in the bush
const LN_BUSH={clumps:[{x:-58,y:-26,rx:28,ry:20,clumps:3},{x:52,y:-40,rx:30,ry:22,clumps:3},{x:-24,y:-44,rx:32,ry:24,clumps:3},{x:14,y:-52,rx:34,ry:24,clumps:3},
    {x:-80,y:-12,rx:15,ry:12,clumps:2,f:1},{x:84,y:-22,rx:19,ry:16,clumps:2,f:1},{x:30,y:-18,rx:38,ry:16,clumps:3,f:1},{x:-30,y:-13,rx:34,ry:14,clumps:3,f:1}],
  twigs:[[[-8,-50,-10,-62,-13,-74,-18,-86],2,0.8],[[38,-52,42,-62,47,-72,55,-82],1.8,0.8],[[-66,-36,-72,-44,-78,-50,-86,-58],1.8,0.8],[[88,-28,94,-32,99,-36,106,-42],1.6,0.7],
    [[-4,0,-6,-12,-4,-22,-8,-34],3.2,1.6],[[12,0,14,-10,18,-20,16,-30],3,1.4],[[-36,0,-38,-8,-42,-14,-46,-22],2.6,1.2]]};
const LN_LEAF_BUSH={dark:[11,17,12],body:[32,45,28],lit:[66,84,48],hi:[136,152,90],rim:[180,196,118],ra:0.55,deep:[4,7,5]};
function ln_bushKit(s){const key="bu"+s;let K=LN_C.get(key);if(K)return K;
  const m=20,X0=Math.floor(-112*s-m),Y0=Math.floor(-96*s-m),W=Math.ceil(226*s+2*m),H=Math.ceil(104*s+2*m),c=ln_cv(W,H),x=c.getContext("2d"),T=q=>q.setTransform(s,0,0,s,-X0,-Y0);
  T(x);x.save();x.translate(4,0);x.scale(1,0.08);let g=x.createRadialGradient(0,0,0,0,0,110);g.addColorStop(0,"rgba(0,0,0,0.5)");g.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=g;x.beginPath();x.arc(0,0,110,0,TAU);x.fill();x.restore();
  const L=ln_leaves({x:0,y:-32,rx:86,ry:30,clumps:5,seed:61,r:6,pal:LN_LEAF_BACK,leaf:1.6},s,0);x.setTransform(1,0,0,1,0,0);x.drawImage(L.c,Math.round(-X0-L.ox),Math.round(-Y0-32*s-L.oy));
  // stems and bare twigs
  T(x);x.fillStyle="rgb(40,32,26)";x.beginPath();LN_BUSH.twigs.forEach(l=>ln_tube(x,l[0],l[1],l[2],10));x.fill();
  LN_BUSH.twigs.slice(0,4).forEach((l,i)=>{for(let k=0;k<5;k++){const q=ln_bz(l[0],0.5+k*0.12),a=(k%2?1:-1)*1.0-1.45+(hash(k,i)-0.5)*0.5;x.fillStyle=k%2?"rgb(24,38,24)":"rgb(40,58,34)";x.beginPath();x.ellipse(q[0]+Math.cos(a)*2.4,q[1]+Math.sin(a)*2.4,2.4,1.05,a,0,TAU);x.fill();
    x.strokeStyle="rgba(150,190,110,0.45)";x.lineWidth=0.4;x.beginPath();x.ellipse(q[0]+Math.cos(a)*2.4,q[1]+Math.sin(a)*2.4,2.4,1.05,a,Math.PI*1.1,Math.PI*1.9);x.stroke();}});
  const sd=[5,15,20,25,0,10,30,35],clumps=LN_BUSH.clumps.map((p,j)=>{const F=ln_cluster("bc"+s+"_"+j,Object.assign({seed:40+sd[j],r:5.2,pal:LN_LEAF_BUSH,leaf:1.5,sq:0.85},p),s);return{V:F.V,ox:F.ox,oy:F.oy,x:p.x*s,y:p.y*s,h:0.4-p.y/80,ph:hash(j,9)*TAU,f:p.f};});
  K={c,X0,Y0,clumps};LN_C.set(key,K);return K;}
// a bush: an uneven mound of leaf clusters with a few bare twigs, its foot at (x,y); with t, its leaves stir in the breeze.
// o.front: only its low front clusters, to draw over animals that dive into it
function bush(ctx,x,y,s,a,t,o){t=t||0;const K=ln_bushKit(s),fr=o&&o.front;withA(ctx,a==null?1:a,()=>{const m=ctx.getTransform();if(!fr)ln_put(ctx,[K.c],x+K.X0,y+K.Y0,m);const w=ln_wind(x,t)-0.7;
  K.clumps.forEach(p=>{if(fr&&!p.f)return;const dx=s*p.h*(1.3*w+0.6*Math.sin(t*1.7+p.ph)+0.28*Math.sin(t*3.1+p.ph*1.3));ln_put(ctx,p.V,x+p.x-p.ox+dx,y+p.y-p.oy,m);});});}

/* ---------- a branch for a bird ---------- */
// relative to the foothold (0,0) and the length w: a limb running in from the upper right, a thinning end with a tip, twigs with leaves, a knot, a stub
function ln_perchGeo(w){const S1=[3.0*w,-0.66*w,2.0*w,-0.5*w,0.75*w,-0.06*w,0,0.025*w],S2=[0,0.025*w,-0.18*w,0.035*w,-0.34*w,0.02*w,-0.47*w,-0.04*w],
    at=(p,u)=>ln_bz(p,u),b1=at(S1,0.42),b2=at(S1,0.2),b3=at(S1,0.8),tip=at(S2,1);
  return{limbs:[[S1,0.1*w,0.047*w],[S2,0.047*w,0.01*w],[[b1[0],b1[1],b1[0]+0.05*w,b1[1]-0.1*w,b1[0]+0.12*w,b1[1]-0.18*w,b1[0]+0.2*w,b1[1]-0.25*w],0.022*w,0.005*w],
      [[b2[0],b2[1],b2[0]+0.08*w,b2[1]+0.05*w,b2[0]+0.15*w,b2[1]+0.12*w,b2[0]+0.2*w,b2[1]+0.22*w],0.02*w,0.005*w],
      [[b3[0],b3[1]-0.01*w,b3[0]-0.01*w,b3[1]-0.03*w,b3[0]-0.02*w,b3[1]-0.045*w,b3[0]-0.03*w,b3[1]-0.06*w],0.022*w,0.017*w]],
    stub:[b3[0]-0.03*w,b3[1]-0.06*w],knot:at(S1,0.56),
    leaves:[[b1[0]+0.2*w,b1[1]-0.25*w,-0.6,1],[b1[0]+0.2*w,b1[1]-0.25*w,0.5,0.9],[b1[0]+0.12*w,b1[1]-0.18*w,-1.9,0.85],[b1[0]+0.06*w,b1[1]-0.11*w,0.2,0.8],
      [b2[0]+0.2*w,b2[1]+0.22*w,1.9,1],[b2[0]+0.2*w,b2[1]+0.22*w,0.9,0.9],[b2[0]+0.15*w,b2[1]+0.12*w,0.4,0.85],[b2[0]+0.1*w,b2[1]+0.07*w,2.3,0.8],
      [tip[0],tip[1],-2.9,0.8],[tip[0]+0.03*w,tip[1]+0.01*w,2.6,0.7]]};}
const LN_BARK={body:[[70,54,42],[40,31,25]],rim:[214,172,124],dark:[16,12,10]};
function ln_leafSprite(L,Wd){const key="lf"+L+"_"+Wd;let F=LN_C.get(key);if(F)return F;const c=ln_cv(L+10,Wd*2+10),x=c.getContext("2d"),o=[4,Wd+5];x.translate(o[0],o[1]);
  const shape=()=>{x.beginPath();x.moveTo(3,0);x.bezierCurveTo(3+L*0.22,-Wd*0.95,3+L*0.72,-Wd*0.72,L+3,0);x.bezierCurveTo(3+L*0.72,Wd*0.6,3+L*0.22,Wd*0.9,3,0);x.closePath();};
  x.strokeStyle="rgb(46,56,36)";x.lineWidth=1;x.beginPath();x.moveTo(0,0);x.lineTo(4,0);x.stroke();
  shape();let g=x.createLinearGradient(0,-Wd,0,Wd);g.addColorStop(0,"rgb(64,88,52)");g.addColorStop(1,"rgb(22,34,24)");x.fillStyle=g;x.fill();
  x.strokeStyle="rgba(150,184,112,0.55)";x.lineWidth=0.7;x.beginPath();x.moveTo(3,0);x.quadraticCurveTo(L*0.5,-0.6,L+2,0);for(let k=1;k<5;k++){const u=3+L*k/5.4;x.moveTo(u,0);x.quadraticCurveTo(u+L*0.08,-Wd*0.3,u+L*0.16,-Wd*0.55);x.moveTo(u,0);x.quadraticCurveTo(u+L*0.08,Wd*0.25,u+L*0.15,Wd*0.48);}x.stroke();
  x.save();shape();x.clip();x.strokeStyle="rgba(176,214,128,0.75)";x.lineWidth=1.4;x.beginPath();x.moveTo(3,0);x.bezierCurveTo(3+L*0.22,-Wd*0.95,3+L*0.72,-Wd*0.72,L+3,0);x.stroke();x.restore();
  F={c,o};LN_C.set(key,F);return F;}
function ln_perchKit(w){const key="pc"+w;let K=LN_C.get(key);if(K)return K;const G=ln_perchGeo(w),m=16,X0=Math.floor(-0.62*w-m),Y0=Math.floor(-0.95*w-m);
  const c=ln_cv(3.2*w-X0+m,0.35*w-Y0+m),x=c.getContext("2d"),T=q=>q.setTransform(1,0,0,1,-X0,-Y0);
  const M=ln_cv(c.width,c.height),mx=M.getContext("2d");T(mx);mx.fillStyle="#fff";mx.beginPath();G.limbs.forEach(l=>ln_tube(mx,l[0],l[1],l[2],30));mx.fill();
  T(x);let g=x.createLinearGradient(0,-0.7*w,0,0.1*w);g.addColorStop(0,rgba(LN_BARK.body[0],1));g.addColorStop(1,rgba(LN_BARK.body[1],1));ln_tint(x,M,g,1);
  // bark: fine fissures along the limb, lenticels across it
  const F=ln_cv(c.width,c.height),fx=F.getContext("2d");T(fx);fx.lineCap="round";
  G.limbs.slice(0,2).forEach((l,li)=>{for(let j=0;j<7;j++){const o=-0.42+j*0.14;fx.beginPath();let on=false;for(let i=0;i<=80;i++){const u=i/80,q=ln_bz(l[0],u),q2=ln_bz(l[0],Math.min(1,u+0.01)),tx=q2[0]-q[0],ty=q2[1]-q[1],tl=Math.hypot(tx,ty)||1,wd=lerp(l[1],l[2],Math.pow(u,0.85)),px=q[0]-ty/tl*o*wd,py=q[1]+tx/tl*o*wd,vis=ln_n1(u*26+j*5,li*9+j)>0.05;
      if(vis&&on)fx.lineTo(px,py);else if(vis)fx.moveTo(px,py);on=vis;}fx.strokeStyle=o<0?"rgba(150,124,96,0.35)":"rgba(18,13,10,0.6)";fx.lineWidth=0.7;fx.stroke();}
    // lenticels: short lens-shaped pores across the limb, in loose clusters, of varied length, fading on the shaded underside
    for(let i=0;i<23;i++){const cu=hash(Math.floor(i/4),li+72),u=clamp(cu+(hash(i,li+70)-0.5)*0.09,0.02,0.98),q=ln_bz(l[0],u),q2=ln_bz(l[0],Math.min(1,u+0.01)),tx=q2[0]-q[0],ty=q2[1]-q[1],tl=Math.hypot(tx,ty)||1,wd=lerp(l[1],l[2],Math.pow(u,0.85)),
        ov=(hash(i,li+71)-0.5)*0.72,o=ov*wd,px=q[0]-ty/tl*o,py=q[1]+tx/tl*o,ll=(0.05+0.1*hash(i,li+73))*wd,lit=ov<0?1:0.35,an=Math.atan2(ty,tx)+Math.PI/2;
      fx.fillStyle="rgba(186,160,122,"+(0.25+0.3*hash(i,li+74))*lit+")";fx.beginPath();fx.ellipse(px,py,ll,Math.max(0.45,ll*0.22),an,0,TAU);fx.fill();
      fx.fillStyle="rgba(20,14,10,"+0.35*lit+")";fx.beginPath();fx.ellipse(px+tx/tl*0.6,py+ty/tl*0.6,ll*0.8,0.35,an,0,TAU);fx.fill();}});
  // a knot, with rings of grain round it, and the cut end of a broken twig
  const [kx,ky]=G.knot;fx.save();fx.translate(kx,ky+0.004*w);fx.rotate(-0.33);fx.fillStyle="rgba(22,15,11,0.85)";fx.beginPath();fx.ellipse(0,0,0.034*w,0.02*w,0,0,TAU);fx.fill();
  fx.strokeStyle="rgba(150,120,90,0.5)";fx.lineWidth=0.8;for(let k=1;k<4;k++){fx.beginPath();fx.ellipse(0.002*w,0.002*w,0.034*w+k*2.6,0.02*w+k*1.7,0,Math.PI*1.05,Math.PI*1.95);fx.stroke();}
  fx.strokeStyle="rgba(10,7,5,0.6)";for(let k=1;k<3;k++){fx.beginPath();fx.ellipse(0,0,0.034*w+k*2.6,0.02*w+k*1.7,0,0.05*Math.PI,0.95*Math.PI);fx.stroke();}fx.restore();
  fx.setTransform(1,0,0,1,0,0);fx.globalCompositeOperation="destination-in";fx.drawImage(M,0,0);x.save();x.setTransform(1,0,0,1,0,0);x.drawImage(F,0,0);x.restore();
  ln_rim(x,M,-1.6,-2.2,rgba(LN_BARK.dark,1),0.7,0);ln_rim(x,M,1.1,1.6,rgba(LN_BARK.rim,1),0.7,4);
  T(x);const [sx,sy]=G.stub;x.fillStyle="rgb(150,120,86)";x.beginPath();x.ellipse(sx,sy,0.008*w,0.005*w,-0.5,0,TAU);x.fill();
  K={c,X0,Y0,G};LN_C.set(key,K);return K;}
// a branch for a bird to sit on: the bird's foothold at x, its top at y; w sets its size; it runs in from the upper right and thins to a tip at the left
function perch(ctx,x,y,w,t,a){t=t||0;const K=ln_perchKit(Math.round(w));withA(ctx,a==null?1:a,()=>{const m=ctx.getTransform(),y0=y-0.0015*w;ln_put(ctx,[K.c],x+K.X0,y0+K.Y0,m);
  const L=ln_leafSprite(Math.round(0.085*w),Math.round(0.03*w));K.G.leaves.forEach(([lx,ly,an,k],i)=>{const f=0.06*Math.sin(t*1.9+i*1.7)+0.04*Math.sin(t*3.3+i*2.9)+0.05*(ln_wind(x+lx,t)-0.7);
    ctx.save();ctx.translate(x+lx,y0+ly);ctx.rotate(an+f);ctx.scale(k,k);ctx.drawImage(L.c,-L.o[0],-L.o[1]);ctx.restore();});});}

/* ---------- layers of rock ---------- */
// the tops of the layers, from the ground down: soil, a cross-bedded sandstone, a dark shale (it pinches out to the left and swells into a lens
// where a fern lies in it), a pale limestone with shells, a conglomerate whose base cuts channels into the red mudstone under it, a dark siltstone.
// Each contact has its own lie and its own roughness, so the layers thicken and thin
function ln_bedY(k,X){const F=(f,s,o)=>ln_fbm(X*f,s,o||2);
  if(k===0)return 300+4*Math.sin(X*0.004+0.7)+2*F(0.02,2);
  if(k===1)return 344+6*Math.sin(X*0.0031+2.0)+3.5*F(0.021,5,3);
  if(k===2)return Math.max(ln_bedY(1,X)+30,402+22*Math.sin(X*0.0019+1.1)+8*F(0.006,7,3)+3*F(0.022,8));
  if(k===3)return ln_bedY(2,X)+Math.max(0,(34+6*F(0.01,9))*sstep(40,420,X)+52*Math.exp(-((X-1510)/190)*((X-1510)/190))+2*F(0.03,16));
  if(k===4)return 684+12*Math.sin(X*0.0024+0.3)+6*F(0.007,10,3)+3*F(0.02,11);
  if(k===5)return ln_bedY(4,X)+40+8*F(0.01,12)+64*Math.exp(-((X-520)/150)*((X-520)/150))+38*Math.exp(-((X-1680)/110)*((X-1680)/110))+4*F(0.025,13);
  if(k===6)return 922+14*Math.sin(X*0.0028+2.2)+6*F(0.008,14,3)+3*F(0.02,15);
  return 1090;}
// kept clear, for the question the scene asks there
const LN_QZ=(x,y)=>Math.abs(x-1000)<190&&Math.abs(y-560)<110,LN_QF=(x,y)=>sstep(1.25,0.85,Math.hypot((x-1000)/230,(y-560)/140));  // LN_QF: 1 in the middle of it, fading to 0 round it
// an ammonite, embossed in the rock and lit from the upper left: a coil that grows W times a whorl, turns whorls showing, its ribs splitting in two
// on the outer whorl if fork
function ln_ammonite(c,cx,cy,R,rot,o){o=o||{};const W=o.W||1.7,b=Math.log(W)/TAU,TH=(o.turns||5)*TAU,r=th=>R*Math.exp(b*(th-TH)),P=(th,rr)=>[cx+Math.cos(th+rot)*rr,cy+Math.sin(th+rot)*rr],nr=o.ribs||44;
  const outline=(dx,dy)=>{c.beginPath();for(let th=TH-TAU;th<=TH+0.001;th+=0.04){const p=P(th,r(th));c.lineTo(p[0]+dx,p[1]+dy);}const e=P(TH-TAU,r(TH-TAU));c.lineTo(e[0]+dx,e[1]+dy);c.closePath();};
  c.save();c.fillStyle="rgba(10,6,4,0.55)";outline(2.2,2.6);c.fill();
  outline(0,0);const g=c.createRadialGradient(cx-R*0.4,cy-R*0.45,R*0.1,cx,cy,R*1.1);g.addColorStop(0,"rgb(234,220,190)");g.addColorStop(0.6,"rgb(194,176,144)");g.addColorStop(1,"rgb(126,108,84)");c.fillStyle=g;c.fill();c.clip();
  c.lineCap="round";
  // ribs across each whorl, leaning a little forward; on the outer whorl each splits in two two-thirds of the way out
  for(let i=0;;i++){const th=TH-i*TAU/nr+0.03*Math.sin(i*1.7),ro=r(th),ri=r(th-TAU),hw=ro-ri;if(hw<1.6||th<0.5)break;const lw=Math.max(0.45,hw*0.075),fk=o.fork&&th>TH-TAU*1.05,st=TAU/nr;
    const seg=(u0,u1,a0,a1)=>{const pts=[];for(let j=0;j<=5;j++){const u=lerp(u0,u1,j/5),rr=lerp(ri+0.5,ro-0.3,u);pts.push(P(th+lerp(a0,a1,j/5)+0.05*u*u,rr));}return pts;};
    const L=fk?[seg(0,0.58,0,0),seg(0.58,1,0,-st*0.3),seg(0.58,1,0,st*0.3)]:[seg(0,1,0,0)];
    L.forEach(pts=>{c.strokeStyle="rgba(78,60,42,0.62)";c.lineWidth=lw*1.3;c.beginPath();pts.forEach((p,j)=>j?c.lineTo(p[0]+lw*0.6,p[1]+lw*0.7):c.moveTo(p[0]+lw*0.6,p[1]+lw*0.7));c.stroke();
      c.strokeStyle="rgba(252,242,218,0.6)";c.lineWidth=lw;c.beginPath();pts.forEach((p,j)=>j?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();});}
  // the seams between the whorls, each a groove with a lit lip
  for(let w=1;w<8;w++){if(r(TH-TAU*w)<1.5)break;c.beginPath();for(let th=TH-TAU*w;th>0.3;th-=0.05){const p=P(th,r(th));c.lineTo(p[0],p[1]);}c.strokeStyle="rgba(66,50,36,0.75)";c.lineWidth=Math.max(0.8,1.4-w*0.12);c.stroke();
    c.beginPath();for(let th=TH-TAU*w;th>0.3;th-=0.05){const p=P(th,r(th)+0.9);c.lineTo(p[0]-0.5,p[1]-0.6);}c.strokeStyle="rgba(250,238,210,0.45)";c.lineWidth=0.7;c.stroke();}
  // the tiny first whorls, and the mouth of the shell
  const p0=P(0.3,r(0.3));c.fillStyle="rgba(70,54,38,0.7)";c.beginPath();c.arc(p0[0],p0[1],Math.max(0.8,r(0.3)*0.9),0,TAU);c.fill();
  c.restore();c.lineWidth=1.2;const g2=c.createLinearGradient(cx-R,cy-R,cx+R,cy+R);g2.addColorStop(0,"rgba(255,246,222,0.7)");g2.addColorStop(1,"rgba(40,28,18,0.7)");c.strokeStyle=g2;outline(0,0);c.stroke();}
// a thigh bone, seen from the front, in the rock: a ball of a head on a neck set at an angle to the shaft, the great trochanter squared off beside it,
// the lesser one a knob below; a shaft thickening toward its ends; two unequal condyles at the knee with a shallow notch between them.
// Its shapes are merged, blurred and shaded as one relief, so that they flow into each other as bone does
function ln_bone(c,cx,cy,k,rot){const PW=Math.ceil(330*k),PH=Math.ceil(190*k),M=ln_cv(PW,PH),mx=M.getContext("2d");mx.setTransform(1,0,0,1,PW/2,PH/2);mx.rotate(rot);mx.scale(k,k);mx.fillStyle="#fff";
  mx.beginPath();ln_tube(mx,[-92,-3,-60,0,-30,2,4,2],30,25);ln_tube(mx,[4,2,40,3,70,2,100,0],25,33);ln_tube(mx,[-90,-3,-97,-11,-105,-20,-113,-28],21,18);mx.fill();
  mx.beginPath();mx.arc(-117,-32,15.5,0,TAU);mx.fill();                                    // the head
  mx.beginPath();mx.ellipse(-104,8,18,13,-0.15,0,TAU);mx.fill();rr(mx,-123,-5,32,24,7);mx.fill();  // the great trochanter
  mx.beginPath();mx.ellipse(-71,-15,8,5,-0.6,0,TAU);mx.fill();                              // the lesser trochanter
  rr(mx,82,-25,36,48,9);mx.fill();mx.beginPath();mx.ellipse(112,-12,11,12.5,0.1,0,TAU);mx.fill();mx.beginPath();mx.ellipse(109,12,10,10.5,-0.1,0,TAU);mx.fill();  // the knee: epicondyles and two unequal condyles
  mx.beginPath();mx.ellipse(96,-23,9,6,0.3,0,TAU);mx.fill();mx.beginPath();mx.ellipse(96,21,8,5.5,-0.3,0,TAU);mx.fill();
  mx.globalCompositeOperation="destination-out";mx.beginPath();mx.ellipse(122,1,4.5,3.5,0,0,TAU);mx.fill();
  const D=mx.getImageData(0,0,PW,PH).data,A=new Float32Array(PW*PH);for(let i=0;i<PW*PH;i++)A[i]=D[i*4+3]/255;
  const B=ln_blur(A,PW,PH,Math.max(1,Math.round(3*k))),Ms=new Float32Array(PW*PH);for(let i=0;i<PW*PH;i++)Ms[i]=sstep(0.38,0.62,B[i]);
  const B2=ln_blur(Ms,PW,PH,Math.max(1,Math.round(6*k))),Hh=new Float32Array(PW*PH);for(let i=0;i<PW*PH;i++)Hh[i]=11*Math.sqrt(B2[i])*Ms[i];
  const S=ln_shade(Hh,PW,PH),O=ln_cv(PW,PH),ox=O.getContext("2d"),I=ox.createImageData(PW,PH);
  for(let j=0;j<PH;j++)for(let i=0;i<PW;i++){const q=j*PW+i,m=Ms[q];if(m<=0)continue;const n=ln_n2(i*0.05,j*0.05,33),sh=clamp(0.36+0.78*S[q],0.25,1.22),o=q*4;
    I.data[o]=Math.min(255,(192+10*n)*sh);I.data[o+1]=Math.min(255,(172+8*n)*sh);I.data[o+2]=Math.min(255,(138+4*n)*sh);I.data[o+3]=Math.round(255*m);}
  ox.putImageData(I,0,0);
  // grain along the shaft, a crack across it, and a few pits
  ox.globalCompositeOperation="source-atop";ox.setTransform(1,0,0,1,PW/2,PH/2);ox.rotate(rot);ox.scale(k,k);ox.lineCap="round";
  for(let i=0;i<9;i++){const yy=-8+i*2+hash(i,41)-0.5;ox.strokeStyle=i%2?"rgba(110,90,66,0.22)":"rgba(255,246,224,0.12)";ox.lineWidth=0.7;ox.beginPath();ox.moveTo(-70+hash(i,42)*20,yy);ox.bezierCurveTo(-20,yy+1,30,yy+1,80-hash(i,43)*20,yy*1.2);ox.stroke();}
  ox.strokeStyle="rgba(46,32,22,0.85)";ox.lineWidth=1.3;ox.beginPath();ox.moveTo(24,-12);ox.lineTo(27,-6);ox.lineTo(23,-1);ox.lineTo(28,4);ox.lineTo(25,9);ox.lineTo(27,14);ox.stroke();
  ox.strokeStyle="rgba(255,244,220,0.45)";ox.lineWidth=0.6;ox.beginPath();ox.moveTo(25.6,-12);ox.lineTo(28.6,-6);ox.lineTo(24.6,-1);ox.lineTo(29.6,4);ox.lineTo(26.6,9);ox.stroke();
  for(let i=0;i<14;i++){ox.fillStyle="rgba(80,60,42,0.35)";ox.beginPath();ox.arc(-110+hash(i,44)*225,-10+hash(i,45)*20,0.5+0.7*hash(i,46),0,TAU);ox.fill();}
  // its shadow in its bed, then the bone
  const Sd=ln_cv(PW,PH),sx=Sd.getContext("2d");sx.drawImage(O,0,0);sx.globalCompositeOperation="source-in";sx.fillStyle="rgba(10,6,4,0.55)";sx.fillRect(0,0,PW,PH);
  c.drawImage(Sd,Math.round(cx-PW/2+2.5),Math.round(cy-PH/2+3));c.drawImage(O,Math.round(cx-PW/2),Math.round(cy-PH/2));}
// a scallop: a fan of ribs from its beak, growth lines across them, and at the hinge two low flat ears, the front one the larger
function ln_shell(c,cx,cy,R,rot){c.save();c.translate(cx,cy);c.rotate(rot);const hy=-0.74*R,sh=(dx,dy)=>{c.beginPath();c.moveTo(dx-0.54*R,dy+hy);c.lineTo(dx+0.42*R,dy+hy);
    c.quadraticCurveTo(dx+0.43*R,dy+hy+0.12*R,dx+0.36*R,dy+hy+0.2*R);c.bezierCurveTo(dx+0.86*R,dy-0.2*R,dx+0.84*R,dy+0.5*R,dx,dy+0.62*R);c.bezierCurveTo(dx-0.84*R,dy+0.5*R,dx-0.9*R,dy-0.2*R,dx-0.36*R,dy+hy+0.22*R);
    c.quadraticCurveTo(dx-0.46*R,dy+hy+0.2*R,dx-0.5*R,dy+hy+0.25*R);c.quadraticCurveTo(dx-0.56*R,dy+hy+0.1*R,dx-0.54*R,dy+hy);c.closePath();};
  c.fillStyle="rgba(10,6,4,0.5)";sh(1.8,2.2);c.fill();sh(0,0);const g=c.createLinearGradient(-R,-R,R,R);g.addColorStop(0,"rgb(228,214,184)");g.addColorStop(1,"rgb(140,120,92)");c.fillStyle=g;c.fill();c.save();c.clip();
  // the ribs of the disc
  for(let i=-8;i<=8;i++){const a=Math.PI/2+i*0.15,ex=Math.cos(a)*R*1.5,ey=hy+Math.sin(a)*R*1.5;c.strokeStyle="rgba(90,70,50,0.55)";c.lineWidth=1;c.beginPath();c.moveTo(0.6,hy+0.6);c.lineTo(ex+0.6,ey+0.6);c.stroke();
    c.strokeStyle="rgba(255,246,222,0.5)";c.lineWidth=0.7;c.beginPath();c.moveTo(0,hy);c.lineTo(ex,ey);c.stroke();}
  // growth lines round the beak, and fine lines along the ears
  for(let k=1;k<5;k++){c.strokeStyle="rgba(90,70,50,0.3)";c.lineWidth=0.7;c.beginPath();c.ellipse(0,hy,R*0.28*k,R*0.33*k,0,0.12*Math.PI,0.88*Math.PI);c.stroke();}
  c.strokeStyle="rgba(90,70,50,0.35)";c.lineWidth=0.6;for(let k=1;k<3;k++){const yy=hy+k*0.07*R;c.beginPath();c.moveTo(-0.5*R,yy);c.lineTo(-0.12*R,yy+0.02*R);c.moveTo(0.1*R,yy+0.02*R);c.lineTo(0.38*R,yy);c.stroke();}
  c.restore();c.strokeStyle="rgba(255,246,222,0.35)";c.lineWidth=0.8;sh(0,0);c.stroke();c.restore();}
// a fern frond (Pecopteris) pressed flat in the shale: a thin film, pale on the dark rock; a rachis tapering to a curled tip, with narrow pinnae
// on both sides, each a row of small rounded pinnules
function ln_fern(c,x0,y0,x1,y1,bend){const p=[x0,y0,lerp(x0,x1,0.33),lerp(y0,y1,0.33)-bend,lerp(x0,x1,0.7),lerp(y0,y1,0.7)-bend*0.8,x1,y1];c.save();c.lineCap="round";c.lineJoin="round";
  const tan=u=>{const a=ln_bz(p,Math.max(0,u-0.01)),b=ln_bz(p,Math.min(1,u+0.01));return Math.atan2(b[1]-a[1],b[0]-a[0]);},n=38,film="rgba(172,174,162,0.72)",lit="rgba(236,236,222,0.3)",vein="rgba(34,34,32,0.6)";
  for(let i=1;i<n;i++){const u=i/n,q=ln_bz(p,u),sd=i%2?1:-1,Lp=(3+21*Math.pow(1-u,0.8))*(u<0.1?0.82+u*1.8:1)*(0.94+0.12*hash(i,78)),a=tan(u)+sd*(1.02+0.08*hash(i,79)),pw=Math.min(4.3,1.6+Lp*0.16),sp=2.9;
    c.save();c.translate(q[0],q[1]);c.rotate(a);
    // the pinna: a strip whose edges swell into rounded pinnules, those of one side between those of the other
    const hw=(X,ph)=>pw*(1-0.45*X/Lp)*(0.62+0.38*Math.abs(Math.sin(Math.PI*(X+ph)/sp)));c.beginPath();c.moveTo(0,-pw*0.5);
    for(let X=0;X<=Lp;X+=0.5)c.lineTo(X,-hw(X,0));c.arc(Lp,0,hw(Lp,0)*0.9,-Math.PI/2,Math.PI/2);for(let X=Lp;X>=0;X-=0.5)c.lineTo(X,hw(X,sp/2));c.closePath();c.fillStyle=film;c.fill();
    c.strokeStyle=lit;c.lineWidth=0.5;c.beginPath();for(let X=0.5;X<=Lp;X+=0.5)c.lineTo(X,-hw(X,0)+0.3);c.stroke();
    c.strokeStyle=vein;c.lineWidth=0.45;c.beginPath();c.moveTo(0.5,0);c.lineTo(Lp,0);for(let X=sp*0.5;X<Lp-1;X+=sp){c.moveTo(X,0);c.lineTo(X+1.2,-pw*0.6);c.moveTo(X+sp/2,0);c.lineTo(X+sp/2+1.2,pw*0.6);}c.stroke();c.restore();}
  // the rachis, thinning to a crozier at its tip
  for(let i=0;i<n;i++){const u0=i/n,u1=(i+1)/n,a=ln_bz(p,u0),b=ln_bz(p,u1);c.strokeStyle=film;c.lineWidth=Math.max(0.7,3.2*(1-u0));c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  const e=ln_bz(p,1),ta=tan(1);c.lineWidth=0.8;c.beginPath();for(let j=0;j<=12;j++){const an=ta+j*0.45,rr=4.5*(1-j/16);const cx=e[0]+Math.cos(ta+Math.PI/2)*4.5,cy=e[1]+Math.sin(ta+Math.PI/2)*4.5;const px=cx+Math.cos(an-Math.PI/2)*rr,py=cy+Math.sin(an-Math.PI/2)*rr;j?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();
  c.restore();}
function ln_strataKit(){let K=LN_C.get("st");if(K)return K;const Y0=280,c=ln_cv(1920,1080-Y0),x=c.getContext("2d");x.translate(0,-Y0);
  const LAY=[[34,26,20],[112,86,58],[52,48,47],[124,114,96],[96,78,58],[100,58,44],[40,34,30]],N=7,top=(k,X)=>k<N?ln_bedY(k,X):1090;
  // the contacts, sampled every 4 px
  const XS=[];for(let X=-12;X<=1932;X+=4)XS.push(X);const TOP=[];for(let k=0;k<=N;k++)TOP.push(XS.map(X=>top(k,X)));const at=(k,X)=>{const f=(X+12)/4,i=clamp(Math.floor(f),0,XS.length-2),u=f-i;return lerp(TOP[k][i],TOP[k][i+1],u);};
  const band=k=>{x.beginPath();XS.forEach((X,i)=>i?x.lineTo(X,TOP[k][i]):x.moveTo(X,TOP[k][i]));for(let i=XS.length-1;i>=0;i--)x.lineTo(XS[i],TOP[k+1][i]);x.closePath();};
  for(let k=0;k<N;k++){band(k);x.fillStyle=rgba(LAY[k],1);x.fill();x.save();band(k);x.clip();const y0=Math.min(...TOP[k])-4,y1=Math.max(...TOP[k+1])+4;
    // grains
    const n=k===1?5200:k===0?1500:k===3?2000:2600;for(let i=0;i<n;i++){const px=hash(i,k*10+5)*1920,py=lerp(y0,y1,hash(i,k*10+6)),r=0.4+(k===1?0.7:1)*hash(i,k*10+7);if(k===3&&hash(i,k*10+4)<0.6*LN_QF(px,py))continue;
      x.fillStyle=hash(i,k*10+8)<0.5?"rgba(255,236,200,"+(0.08+0.12*hash(i,k*10+9))+")":"rgba(10,6,4,"+(0.1+0.18*hash(i,k*10+9))+")";x.fillRect(px,py,r*1.6,r);}
    if(k===1){// trough cross-bedding: scoops cut into each other, each later one erasing what it cuts, each filled with laminae that follow its curved floor
      for(let i=0;i<16;i++){const cx=-80+i*132+hash(i,31)*70,w=230+190*hash(i,32),t1=at(1,cx),t2=at(2,cx),d=(t2-t1)*(0.45+0.4*hash(i,33)),y0s=t1+(t2-t1)*(0.05+0.4*hash(i,34))-d*0.15,sc=X=>{const u=(X-cx)/(w/2);return y0s+d*(1-u*u);};
        x.save();x.beginPath();for(let X=cx-w/2;X<=cx+w/2;X+=6)x.lineTo(X,sc(X));x.lineTo(cx+w/2,y0s-60);x.lineTo(cx-w/2,y0s-60);x.closePath();x.clip();
        if(i){x.fillStyle=rgba(mix(LAY[1],[90,66,42],0.3*hash(i,35)),0.55);x.fillRect(cx-w/2,y0s-60,w,d+62);}
        const nl=5+Math.floor(4*hash(i,36));for(let j=1;j<=nl;j++){const f=j/(nl+1);x.beginPath();for(let X=cx-w/2;X<=cx+w/2;X+=6){const u=(X-cx)/(w/2);x.lineTo(X,y0s+d*(1-f)*(1-u*u)+d*0.02*ln_n1(X*0.05+j,i*9+j));}
          x.strokeStyle=j%2?"rgba(60,40,22,0.34)":"rgba(186,154,108,0.16)";x.lineWidth=j%2?1:0.8;x.stroke();}
        x.beginPath();for(let X=cx-w/2;X<=cx+w/2;X+=6)x.lineTo(X,sc(X));x.strokeStyle="rgba(46,30,18,0.45)";x.lineWidth=1.1;x.stroke();x.restore();}}
    if(k===2){// shale: fine laminae, a few paler silty ones
      for(let j=1;j<22;j++){x.beginPath();for(let X=0;X<=1920;X+=8){const yy=lerp(at(2,X),at(3,X),j/22+0.012*ln_n1(X*0.01+j,j+40))+0.7*ln_n1(X*0.03+j,j);X?x.lineTo(X,yy):x.moveTo(X,yy);}
        x.strokeStyle=hash(j,44)<0.2?"rgba(150,142,132,0.22)":j%2?"rgba(18,16,16,0.32)":"rgba(140,132,124,0.12)";x.lineWidth=0.8;x.stroke();}}
    if(k===3){// limestone: two stylolites, broken shells, crinoid ossicles
      [0.35,0.72].forEach((f,si)=>{x.beginPath();let on=false;for(let X=0;X<=1920;X+=3){const yy=lerp(at(3,X),at(4,X),f)+4*ln_fbm(X*0.004,50+si,2)+(hash(X,51+si)-0.5)*2.6;const ok=LN_QF(X,yy)<0.02&&ln_n1(X*0.006+si*7,52+si)>-0.35;if(ok&&on)x.lineTo(X,yy);else if(ok)x.moveTo(X,yy);on=ok;}
        x.strokeStyle="rgba(40,34,28,0.35)";x.lineWidth=0.8;x.stroke();});
      for(let i=0;i<70;i++){const px=hash(i,91)*1920,py=lerp(at(3,px)+12,at(4,px)-12,hash(i,92));if(LN_QZ(px,py))continue;x.strokeStyle="rgba(236,224,200,0.3)";x.lineWidth=1;x.beginPath();x.arc(px,py,2+4*hash(i,93),hash(i,94)*6,hash(i,94)*6+1.4+hash(i,95));x.stroke();}
      for(let i=0;i<24;i++){const px=hash(i,96)*1920,py=lerp(at(3,px)+14,at(4,px)-14,hash(i,97));if(LN_QZ(px,py))continue;x.strokeStyle="rgba(236,224,200,0.4)";x.lineWidth=1;x.beginPath();x.arc(px,py,2.4,0,TAU);x.stroke();x.fillStyle="rgba(40,30,20,0.5)";x.beginPath();x.arc(px,py,0.8,0,TAU);x.fill();}}
    if(k===4){// conglomerate: pebbles packed against each other, of many rocks and sizes, rounded but not round, their long sides tilted the same way
      const G=new Map(),CL=[[196,190,176],[74,70,68],[128,78,62],[128,124,118],[164,140,108],[108,112,96],[182,166,140]],pl=[];
      for(let i=0;i<5200&&pl.length<900;i++){const px=hash(i,101)*1950-15,t4=at(4,px),t5=at(5,px);const r=2.6+11*Math.pow(hash(i,103),2.2),py=lerp(t4+r*0.5,t5-r*0.4,hash(i,102));if(t5-t4<6)continue;
        const gx=Math.floor(px/24),gy=Math.floor(py/24);let ok=true;for(let a=-1;a<=1&&ok;a++)for(let b=-1;b<=1&&ok;b++)(G.get((gx+a)+","+(gy+b))||[]).forEach(q=>{if(Math.hypot(q[0]-px,(q[1]-py)*1.3)<(q[2]+r)*0.82)ok=false;});
        if(!ok)continue;const key=gx+","+gy;G.set(key,(G.get(key)||[]).concat([[px,py,r]]));pl.push([px,py,r,i]);}
      pl.forEach(([px,py,r,i])=>{const rot=-0.3+(hash(i,104)-0.5)*0.7,e=0.6+0.35*hash(i,106),cl=CL[Math.floor(hash(i,105)*CL.length)],pts=[];
        for(let j=0;j<9;j++){const a=j/9*TAU,rr=r*(1+0.16*(hash(i*9+j,107)-0.5));pts.push([px+Math.cos(a)*rr*Math.cos(rot)-Math.sin(a)*rr*e*Math.sin(rot),py+Math.cos(a)*rr*Math.sin(rot)+Math.sin(a)*rr*e*Math.cos(rot)]);}
        const path=(dx,dy)=>{x.beginPath();for(let j=0;j<9;j++){const a=pts[j],b=pts[(j+1)%9],m=[(a[0]+b[0])/2+dx,(a[1]+b[1])/2+dy];j?x.quadraticCurveTo(a[0]+dx,a[1]+dy,m[0],m[1]):x.moveTo(m[0],m[1]);}const a=pts[0],b=pts[1];x.quadraticCurveTo(a[0]+dx,a[1]+dy,(a[0]+b[0])/2+dx,(a[1]+b[1])/2+dy);x.closePath();};
        path(r*0.16,r*0.2);x.fillStyle="rgba(14,10,8,0.55)";x.fill();path(0,0);x.fillStyle=rgba(cl,1);x.fill();
        x.save();x.clip();x.fillStyle="rgba(0,0,0,0.22)";x.beginPath();x.ellipse(px+r*0.35,py+r*0.35,r,r*0.8,0,0,TAU);x.fill();x.fillStyle="rgba(255,246,226,0.26)";x.beginPath();x.ellipse(px-r*0.3,py-r*0.3,r*0.45,r*0.28,rot,0,TAU);x.fill();x.restore();});}
    if(k===5){// red mudstone, with pale green spots where the iron was reduced, soft-edged
      for(let i=0;i<50;i++){const px=hash(i,111)*1920,py=lerp(at(5,px)+10,at(6,px)-10,hash(i,112)),r=2+7*hash(i,113);x.fillStyle="rgba(150,160,120,0.1)";x.beginPath();x.ellipse(px,py,r*1.5,r*1.2,0,0,TAU);x.fill();
        x.fillStyle="rgba(150,160,120,0.14)";x.beginPath();x.ellipse(px,py,r,r*0.8,0,0,TAU);x.fill();}}
    if(k===6){for(let i=0;i<16;i++){const px=hash(i,121)*1920;x.strokeStyle="rgba(0,0,0,0.3)";x.lineWidth=1;x.beginPath();x.moveTo(px,at(6,px)+4);for(let j=1;j<8;j++)x.lineTo(px+(hash(i*8+j,122)-0.5)*16,at(6,px)+j*24);x.stroke();}}
    x.restore();}
  // mottling: soft patches of darker and paler rock, stretched along the beds
  {const tw=480,th=Math.ceil((1080-Y0)/4),Nc=ln_cv(tw,th),nx=Nc.getContext("2d"),D=nx.createImageData(tw,th),AMP=[0.5,0.7,0.4,0.55,0.35,0.7,0.5];
    for(let i=0;i<tw;i++){const X=i*4+2,tp=[];for(let k=0;k<=N;k++)tp.push(at(k,X));for(let j=0;j<th;j++){const Y=Y0+j*4+2;let k=0;while(k<N-1&&Y>=tp[k+1])k++;if(Y<tp[0])continue;
      const v=(ln_n2(X*0.006,Y*0.02,60+k)*0.65+ln_n2(X*0.018,Y*0.05,70+k)*0.35)*AMP[k]*(k===3?1-0.6*LN_QF(X,Y):1),o=(j*tw+i)*4;
      if(v<0){D.data[o+3]=Math.round(255*Math.min(0.2,-v*0.4));}else{D.data[o]=255;D.data[o+1]=232;D.data[o+2]=196;D.data[o+3]=Math.round(255*Math.min(0.08,v*0.16));}}}
    nx.putImageData(D,0,0);x.imageSmoothingEnabled=true;x.drawImage(Nc,0,Y0,tw*4,th*4);}
  // bedding planes: a dark seam, and a lit lip just under it; the contacts are rough, a few px up and down
  for(let k=1;k<N;k++){x.beginPath();XS.forEach((X,i)=>i?x.lineTo(X,TOP[k][i]):x.moveTo(X,TOP[k][i]));x.strokeStyle="rgba(8,5,4,0.6)";x.lineWidth=1.6;x.stroke();
    x.beginPath();XS.forEach((X,i)=>i?x.lineTo(X,TOP[k][i]+2):x.moveTo(X,TOP[k][i]+2));x.strokeStyle="rgba(255,232,196,0.14)";x.lineWidth=1.2;x.stroke();}
  // roots reaching down from the soil
  x.lineCap="round";for(let i=0;i<30;i++){let px=hash(i,131)*1920,py=at(0,px)+14;const L=20+60*hash(i,132);x.strokeStyle="rgba(150,120,90,0.3)";x.lineWidth=1.2;x.beginPath();x.moveTo(px,py);for(let j=0;j<8;j++){px+=(hash(i*9+j,133)-0.5)*8;py+=L/8;x.lineTo(px,py);}x.stroke();}
  // the surface: soil, tufts of grass along it, lit at its edge
  x.beginPath();XS.forEach((X,i)=>i?x.lineTo(X,TOP[0][i]):x.moveTo(X,TOP[0][i]));x.strokeStyle="rgba(190,205,140,0.4)";x.lineWidth=1.3;x.shadowColor="rgba(170,200,120,0.6)";x.shadowBlur=6;x.stroke();x.shadowBlur=0;
  for(let i=0;i<150;i++){const px=hash(i,141)*1930,py=at(0,px)+1,n=3+Math.floor(hash(i,142)*4);for(let j=0;j<n;j++){const h=4+9*hash(i*7+j,143),l=(hash(i*7+j,144)-0.5)*7;x.strokeStyle=hash(i*7+j,145)<0.5?"rgba(98,110,64,0.8)":"rgba(40,48,30,0.9)";x.lineWidth=1;x.beginPath();x.moveTo(px+j*1.4,py);x.quadraticCurveTo(px+j*1.4+l*0.3,py-h*0.6,px+j*1.4+l,py-h);x.stroke();}}
  // the fossils: ammonites and scallops in the limestone, a fern in the shale, a thigh bone in the mudstone
  ln_ammonite(x,350,574,50,0.4,{W:1.7,turns:5,ribs:46,fork:1});ln_ammonite(x,1560,600,32,2.2,{W:1.85,turns:4,ribs:34});ln_ammonite(x,1262,630,16,4.1,{W:1.9,turns:3.5,ribs:26});
  ln_shell(x,660,590,22,-0.3);ln_shell(x,1792,562,15,0.45);
  ln_fern(x,1398,440,1622,420,10);
  ln_bone(x,1150,834,1.0,-0.08);
  // light from the upper left, over everything
  let g=x.createLinearGradient(0,280,1500,1300);g.addColorStop(0,"rgba(255,226,180,0.08)");g.addColorStop(0.5,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.35)");x.fillStyle=g;x.fillRect(0,280,1920,800);
  g=x.createLinearGradient(0,300,0,1080);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0.3)");x.fillStyle=g;x.fillRect(0,280,1920,800);
  K={c,top:Y0};LN_C.set("st",K);return K;}
// layers of rock filling the frame from y ≈ 300 down, with shells and bones in them, but no words
function strata(ctx,t){const K=ln_strataKit();ln_put(ctx,[K.c],0,K.top);}

/* ---------- a clay tablet ---------- */
// the numerals, row by row: O a round hole (the round end of the stylus pressed straight in), D a notch (pressed in at a slant);
// three cases of four in each row, the bigger units first
const LN_MARKS="OODDODDDOOOD"+"ODDDOODDDDDD"+"OOODODDDOODD"+"OODDOOODODDD";
const LN_LIGHT=(()=>{const l=Math.hypot(-0.5,-0.62,0.6);return[-0.5/l,-0.62/l,0.6/l];})();
// the outline of the tablet's face, in its own units (the rows of numerals are laid out in w × h; the clay reaches a little above them):
// a softened, slightly uneven rectangle that bulges at its sides, with a nick or two knocked out of its edge
const LN_NICKS=[[1.62,0.022,0.06],[2.95,0.018,0.05],[0.52,0.014,0.07]];
function ln_slab(w,h){const P=[],n=200,t0=-18,H=h-t0-8;for(let i=0;i<n;i++){const th=i/n*TAU,ct=Math.cos(th),st=Math.sin(th),e=4.4,px=Math.sign(ct)*Math.pow(Math.abs(ct),2/e),py=Math.sign(st)*Math.pow(Math.abs(st),2/e);
    let wob=1+0.011*ln_n1(th*2.2,71)+0.005*ln_n1(th*7,72);LN_NICKS.forEach(([c,d,s])=>{const dt=Math.atan2(Math.sin(th-c),Math.cos(th-c));wob-=d*Math.exp(-(dt/s)*(dt/s));});
    P.push([w/2+(px*w/2+0.012*w*st*(1+ct))*wob,t0+H/2+(py*H/2-0.01*H*ct)*wob]);}return P;}
function ln_path(c,P,dx,dy){c.moveTo(P[0][0]+dx,P[0][1]+dy);for(let i=1;i<P.length;i++)c.lineTo(P[i][0]+dx,P[i][1]+dy);c.closePath();}
// relief shading: the light a surface of heights H (W×H2, row by row) catches from the upper left
function ln_shade(H,W,H2){const L=LN_LIGHT,out=new Float32Array(W*H2);for(let j=0;j<H2;j++)for(let i=0;i<W;i++){const k=j*W+i,gx=(H[j*W+Math.min(W-1,i+1)]-H[j*W+Math.max(0,i-1)])/2,gy=(H[Math.min(H2-1,j+1)*W+i]-H[Math.max(0,j-1)*W+i])/2,
    l=Math.hypot(gx,gy,1);out[k]=(-gx*L[0]-gy*L[1]+L[2])/l;}return out;}
// a box blur of radius r over the array A (W×H), three times, which is close to a gaussian: the same in every browser, unlike a canvas filter
function ln_blur(A,W,H,r,n){let a=Float32Array.from(A),b=new Float32Array(W*H);const d=2*r+1;
  for(let p=0;p<(n||3);p++){for(let j=0;j<H;j++){const o=j*W;let s=0;for(let i=-r;i<=r;i++)s+=a[o+clamp(i,0,W-1)];for(let i=0;i<W;i++){b[o+i]=s/d;s+=a[o+Math.min(W-1,i+r+1)]-a[o+Math.max(0,i-r)];}}
    for(let i=0;i<W;i++){let s=0;for(let j=-r;j<=r;j++)s+=b[clamp(j,0,H-1)*W+i];for(let j=0;j<H;j++){a[j*W+i]=s/d;s+=b[Math.min(H-1,j+r+1)*W+i]-b[Math.max(0,j-r)*W+i];}}}
  return a;}
// fingerprints left in the clay by the hands that held it: where (in parts of w × h), how big (a fingertip, about 1.3 cm), turned how far
const LN_PRINTS=[[0.015,0.8,40,-0.35],[0.985,0.22,36,0.5],[0.62,1.0,34,0.1]];
// the frieze of a cylinder seal rolled along the bottom band: cattle walking, and the ring-post of Inanna between them
function ln_seal(c,x0,y0,len){c.fillStyle="#fff";for(let X=x0;X<x0+len;X+=132){const cow=(x,s)=>{c.beginPath();c.ellipse(x,y0+1,15*s,6.5*s,0,0,TAU);c.fill();
      c.beginPath();c.ellipse(x+15*s,y0-3*s,5*s,3.4*s,-0.5,0,TAU);c.fill();c.lineCap="round";c.lineWidth=2.6*s;c.strokeStyle="#fff";c.beginPath();
      [[-11,5,-12,17],[-7,5,-6,17],[8,5,9,17],[12,5,13,17]].forEach(([a,b,cc,d])=>{c.moveTo(x+a*s,y0+b*s);c.lineTo(x+cc*s,y0+d*s);});c.moveTo(x-15*s,y0);c.quadraticCurveTo(x-20*s,y0+3*s,x-19*s,y0+11*s);
      c.moveTo(x+16*s,y0-6*s);c.quadraticCurveTo(x+14*s,y0-14*s,x+8*s,y0-16*s);c.moveTo(x+18*s,y0-5*s);c.quadraticCurveTo(x+22*s,y0-13*s,x+27*s,y0-14*s);c.stroke();};
    cow(X+26,1);cow(X+82,0.92);
    // the ring-post: a reed bundle with a loop at its top and a streamer
    c.lineWidth=3;c.beginPath();c.moveTo(X+118,y0+17);c.lineTo(X+118,y0-8);c.stroke();c.lineWidth=2.4;c.beginPath();c.arc(X+118,y0-12,4,0,TAU);c.stroke();
    c.lineWidth=1.8;c.beginPath();c.moveTo(X+120,y0-12);c.quadraticCurveTo(X+127,y0-8,X+126,y0+2);c.stroke();}}
function ln_tabletKit(w,h){const key="tb"+w+"x"+h;let K=LN_C.get(key);if(K)return K;const M=56,CW=w+2*M,CH=h+2*M,c=ln_cv(CW,CH),x=c.getContext("2d"),P=ln_slab(w,h);
  // the face's shape; blurred a little it rounds the edges, blurred a lot it gives the pillow its dome
  const Fm=ln_cv(CW,CH),fm=Fm.getContext("2d");fm.translate(M,M);fm.fillStyle="#fff";fm.beginPath();ln_path(fm,P,0,0);fm.fill();
  const mA=fm.getImageData(0,0,CW,CH).data,A0=new Float32Array(CW*CH);for(let k=0;k<CW*CH;k++)A0[k]=mA[k*4+3]/255;
  const B1=ln_blur(A0,CW,CH,6),B2=ln_blur(A0,CW,CH,24);
  // the seal's rolling: raised figures, softened as clay is
  const Sm=ln_cv(CW,CH),sm=Sm.getContext("2d");sm.translate(M,M);sm.save();sm.beginPath();sm.rect(18,h-68,w-36,54);sm.clip();ln_seal(sm,-40+hash(w,7)*30,h-44,w+80);sm.restore();
  const sA=sm.getImageData(0,0,CW,CH).data,S0=new Float32Array(CW*CH);for(let k=0;k<CW*CH;k++)S0[k]=sA[k*4+3]/255;const SB=ln_blur(S0,CW,CH,1,2);
  const Hh=new Float32Array(CW*CH);
  for(let j=0;j<CH;j++)for(let i=0;i<CW;i++){const k=j*CW+i,X=i-M,Y=j-M,b=B1[k];if(b<0.01){Hh[k]=0;continue;}
    // rounded edges, a low dome, the unevenness of hand-pressed clay, and the seal's figures standing a little proud
    let H=10*Math.pow(clamp((b-0.3)/0.7,0,1),0.6)+14*Math.pow(B2[k],1.6)+1.3*ln_n2(X*0.011,Y*0.011,5)+0.5*ln_n2(X*0.03,Y*0.03,6)+0.18*ln_n2(X*0.1,Y*0.1,7)+0.7*ln_n2(X*0.004,Y*0.03,11)+1.1*SB[k]*(0.75+0.25*ln_n2(X*0.05,Y*0.05,12))+18*(1-Math.min(1,((X-w/2)/(w/2))**2*0.8+((Y-h/2+14)/(h/2+10))**2*0.8));
    // fingerprints: a shallow dimple, and faint ridges in whorls, only partly there
    for(const [pu,pv,R,rot] of LN_PRINTS){const dx=X-pu*w,dy=Y-pv*h;if(dx*dx+dy*dy>R*R*1.7)continue;const cs=Math.cos(rot),sn=Math.sin(rot),a=(dx*cs+dy*sn)/1.25,bb=-dx*sn+dy*cs,d=Math.hypot(a,bb),f=Math.max(0,1-d/R);
      const vis=clamp(0.5+0.9*ln_n2(X*0.035+pu*9,Y*0.035,13),0,1);H+=-1.2*f*f+0.2*vis*Math.sin(d*TAU/3.1+0.35*Math.sin(Math.atan2(bb,a)*2))*Math.min(1,f*3)*Math.min(1,d/6);}
    Hh[k]=H;}
  const S=ln_shade(Hh,CW,CH),F=ln_cv(CW,CH),fx=F.getContext("2d"),D=fx.createImageData(CW,CH);
  for(let j=0;j<CH;j++)for(let i=0;i<CW;i++){const k=j*CW+i,a=mA[k*4+3];if(!a)continue;const X=i-M,Y=j-M,tone=ln_n2(X*0.006,Y*0.006,9),red=ln_n2(X*0.02,Y*0.02,10),sh=clamp(0.42+0.72*S[k],0.2,1.25),
    r=(168+10*tone+5*red)*sh,g=(128+6*tone-2*red)*sh,bl=(90+2*tone-5*red)*sh,o=k*4;D.data[o]=Math.min(255,r);D.data[o+1]=Math.min(255,g);D.data[o+2]=Math.min(255,bl);D.data[o+3]=a;}
  fx.putImageData(D,0,0);
  // its shadow, and the thickness of the slab showing at its lower edge
  x.translate(M,M);x.save();x.shadowColor="rgba(0,0,0,0.55)";x.shadowBlur=34;x.shadowOffsetX=10;x.shadowOffsetY=18;x.fillStyle="rgb(64,42,28)";x.beginPath();ln_path(x,P,3,10);x.fill();x.restore();
  x.fillStyle="rgb(80,54,36)";x.beginPath();ln_path(x,P,3,10);x.fill();x.fillStyle="rgb(104,72,48)";x.beginPath();ln_path(x,P,1.5,5);x.fill();
  x.drawImage(F,-M,-M);
  // clay: grit and pores
  x.save();x.beginPath();ln_path(x,P,0,0);x.clip();
  for(let i=0;i<4200;i++){const px=hash(i,201)*w,py=-18+hash(i,202)*(h+10),r=0.5+1.0*hash(i,203);x.fillStyle=hash(i,204)<0.5?"rgba(255,236,206,"+(0.05+0.12*hash(i,205))+")":"rgba(60,34,18,"+(0.06+0.14*hash(i,205))+")";x.fillRect(px,py,r,r);}
  for(let i=0;i<150;i++){const px=hash(i,206)*w,py=-18+hash(i,207)*(h+10),r=0.6+1.1*hash(i,208);x.fillStyle="rgba(58,32,16,0.4)";x.beginPath();x.arc(px,py,r,0,TAU);x.fill();x.fillStyle="rgba(255,240,214,0.3)";x.beginPath();x.arc(px+r*0.7,py+r*0.7,r*0.55,0,TAU);x.fill();}
  // ruled lines between the rows and round the cases, drawn with the edge of the stylus: a groove, dark on its upper side, lit on its lower lip
  const rule=(x0,y0,x1,y1,sd)=>{const n=30,hz=y0===y1,pt=(i,o)=>{const u=i/n,j=ln_n1(u*6,sd)*1.3;return[lerp(x0,x1,u)+(hz?0:j)+o[0],lerp(y0,y1,u)+(hz?j:0)+o[1]];};
    [[[-0.4,-0.6],"rgba(58,32,14,0.55)",2.1],[[0.9,1.2],"rgba(255,236,206,0.32)",1.1]].forEach(([o,col,lw])=>{x.strokeStyle=col;x.lineWidth=lw;x.beginPath();for(let i=0;i<=n;i++){const p=pt(i,o),wv=0.75+0.35*ln_n1(i*0.7,sd+5);if(i){x.lineWidth=lw*wv;x.lineTo(p[0],p[1]);}else x.moveTo(p[0],p[1]);}x.stroke();});};
  x.lineCap="round";for(let r=1;r<5;r++){const yy=r*h/5+2+(hash(r,302)-0.5)*3;rule(24+hash(r,301)*8,yy,w-24-hash(r,303)*8,yy,300+r);}
  [3.5,7.5].forEach((cc,i)=>{const cx=40+cc*(w-80)/12+11;rule(cx,2,cx+2,4*h/5+2,310+i);});
  x.restore();
  K={c,M};LN_C.set(key,K);return K;}
// one pressed mark, as a shading to lay over the clay: O a round hole, D a notch pressed at a slant, deepest at its round end where the stylus went in,
// shallowing to a point where it came out; the clay it pushed aside stands as a low lip round it. Dark where its walls turn from the light,
// pale where they face it, darker with depth; the sprite fades to nothing well inside its edges
function ln_markKit(kind,v){const key="mk"+kind+v;let F=LN_C.get(key);if(F)return F;const S=64,o=S/2,sz=0.93+0.14*hash(v,3),an=-1.22+(hash(v,4)-0.5)*0.22,ca=Math.cos(an),sa=Math.sin(an),Hh=new Float32Array(S*S),dep=new Float32Array(S*S);
  const R=8.4*sz,r0=5.4*sz,Lt=17*sz;
  for(let j=0;j<S;j++)for(let i=0;i<S;i++){const X=i+0.5-o,Y=j+0.5-o;let d=0,sd,lip=0.9;
    if(kind==="O"){const r=Math.hypot(X,Y);sd=r-R;if(r<R)d=5.2*Math.pow(1-(r/R)*(r/R),0.6);}
    else{const a=X*ca+Y*sa,b=-X*sa+Y*ca;
      if(a<0){const r=Math.hypot(a,b);sd=r-r0;if(r<r0)d=4.8*Math.sqrt(1-(r/r0)*(r/r0));}
      else{const f=(a/Lt)*(a/Lt)+(b/r0)*(b/r0)-1,gx=2*a/(Lt*Lt),gy=2*b/(r0*r0);sd=f/Math.max(0.08,Math.hypot(gx,gy));const u=Math.min(1,a/Lt),wd=r0*Math.sqrt(Math.max(0,1-u*u));
        if(wd>0&&Math.abs(b)<wd)d=4.8*Math.pow(1-u,0.8)*Math.sqrt(1-(b/wd)*(b/wd));lip=0.7*(1-0.55*u);}}
    const win=1-sstep(o-14,o-4,Math.hypot(X,Y)),rim=lip*Math.exp(-((sd-1.3)/1.5)*((sd-1.3)/1.5));Hh[j*S+i]=(rim-d)*win;dep[j*S+i]=d;}
  const Sh=ln_shade(Hh,S,S),c=ln_cv(S,S),x=c.getContext("2d"),D=x.createImageData(S,S),flat=LN_LIGHT[2];
  for(let k=0;k<S*S;k++){const s=Sh[k]-flat-0.06*dep[k],q=k*4;if(s<0){D.data[q]=46;D.data[q+1]=24;D.data[q+2]=10;D.data[q+3]=Math.min(255,-s*420);}else{D.data[q]=255;D.data[q+1]=238;D.data[q+2]=208;D.data[q+3]=Math.min(255,s*300);}}
  x.putImageData(D,0,0);F={c,o};LN_C.set(key,F);return F;}
// a clay tablet from Uruk, c. 3300 BCE, with rows of numerals pressed in as p goes from 0 to 1: mark k lies at
// x+40+(k%12)*(w-80)/12 (+ a little), y+row*h/5+h/10+8; each is pressed in while the stylus rests on it
function tablet(ctx,x,y,w,h,p,a){const K=ln_tabletKit(Math.round(w),Math.round(h));withA(ctx,a==null?1:a,()=>{const m=ctx.getTransform();ln_put(ctx,[K.c],x-K.M,y-K.M,m);
  const n=48,q=clamp(p,0,1)*n;for(let i=0;i<n&&i<q;i++){const row=Math.floor(i/12),col_=i%12,px=x+40+col_*(w-80)/12+hash(i,2)*6,py=y+row*h/5+h/10+8,d=clamp(q-i,0,1),F=ln_markKit(LN_MARKS[i]||"D",i%5);
    ctx.save();ctx.globalAlpha*=d;ln_put(ctx,[F.c],px+8-F.o,py-6-F.o,m);ctx.restore();}});}

/* ---------- warming the caches ---------- */
// The pictures that take long to paint the first time (the acacia, the rocks, the tablet...) are painted soon after the film's page loads,
// one at a time with pauses between, so that playing or seeking into their scenes never stalls. Only on a page with the film's player:
// not while rendering the video, and not on the labs' pages
(function(){if(typeof window==="undefined"||typeof document==="undefined"||typeof setTimeout!=="function")return;
  const jobs=[()=>ln_groundKit(760),()=>ln_groundKit(700),()=>ln_grassKit(),()=>ln_stemKit(),()=>ln_grassLay(0,1920,770),()=>ln_grassLay(0,1920,710),()=>ln_treeKit(1.5),()=>ln_bushKit(1.5),
    ()=>ln_perchKit(320),()=>ln_leafSprite(27,10),()=>ln_strataKit(),()=>ln_tabletKit(600,380)];
  for(let v=0;v<5;v++)["O","D"].forEach(k=>jobs.push(()=>ln_markKit(k,v)));
  const next=()=>{const f=jobs.shift();if(!f)return;try{f();}catch(e){}setTimeout(next,40);};
  const go=()=>{if(window.__RENDER__||!document.getElementById("film"))return;setTimeout(next,300);};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();})();

/* ===== What's in a word: the beasts =====
   The vervet monkeys and their hunters (a leopard, a snake), the animals with names (a dolphin, an elephant, a marmoset), and the gavagai rabbit.
   Each takes (ctx, x, y, size, colour, options) (the rabbit takes t before its options); options.a fades it, options.t (seconds) brings it to
   life (breath, blinks, a turning head, a swaying tail), options.flip turns it to face left. They keep icon()'s look: a dark body lit from the
   upper left, a glowing rim in the colour that carries the meaning (thicker on the shadow side), fine inner details in that colour and a small
   bright eye; but their shapes come from their anatomy: smooth contours, tapering limbs, a darker far leg behind the body. Every pose and gait is
   a function of t and the options, so any frame draws alone. */

/* ---------- the drawing kit ---------- */
const BS_INK=[20,26,40],BS_ST={f:1,s:1,z:1},BS_LAY={},BS_CACHE={};
// while a beast fades (its own a, or the scene's alpha), draw it whole on a layer first, so its overlapping parts don't show through each other;
// b is its reach in its own units [left, top, right, bottom] (as it faces, before o.flip); o.bs_mask(c), drawn in the beast's own units, wipes part of it (a monkey half
// hidden in a bush). True when it's done (or there's nothing to draw).
function bs_layered(ctx,x,y,s,o,b,fn){const a=o.a==null?1:o.a,ga=ctx.globalAlpha*Math.min(1,a);if(a<=0.01||ga<=0.004||!(s>0))return true;if(o.bs_in||(ga>0.985&&!o.bs_mask))return false;
  const m=ctx.getTransform(),fl=o.flip?-1:1,X=[],Y=[];for(const u of [b[0]*fl,b[2]*fl])for(const v of [b[1],b[3]]){const px=x+s*u,py=y+s*v;X.push(m.a*px+m.c*py+m.e);Y.push(m.b*px+m.d*py+m.f);}
  const x0=Math.floor(Math.min(...X)-14),y0=Math.floor(Math.min(...Y)-14),w=Math.ceil(Math.max(...X)+14)-x0,h=Math.ceil(Math.max(...Y)+14)-y0;if(w<1||h<1||w*h>9e6)return false;
  // a few layers, taken in turn, so a layer is never redrawn while the frame still holds its last picture
  BS_LAY.i=((BS_LAY.i||0)+1)%6;let L=BS_LAY[BS_LAY.i];if(!L||L.c.width<w||L.c.height<h){const c=mkCanvas(Math.max(w,L?L.c.width:0),Math.max(h,L?L.c.height:0));L=BS_LAY[BS_LAY.i]={c,x:c.getContext("2d")};}
  const c=L.x;c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation="source-over";c.clearRect(0,0,w,h);c.setTransform(m.a,m.b,m.c,m.d,m.e-x0,m.f-y0);fn(c,Object.assign({},o,{a:1,bs_in:1}));
  if(o.bs_mask){c.save();c.translate(x,y);c.scale(s,s);c.globalCompositeOperation="destination-out";o.bs_mask(c);c.restore();}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ga;ctx.drawImage(L.c,0,0,w,h,x0,y0,w,h);ctx.restore();return true;}
// begin a beast: fade, place, scale, flip (fx narrows it while it turns round, never below 0.35); false if there's nothing to draw
function bs_begin(ctx,x,y,s,o,fx){const a=o.a==null?1:o.a;if(a<=0.01||!(s>0))return false;ctx.save();ctx.globalAlpha*=Math.min(1,a);ctx.translate(x,y);
  fx=fx==null?1:fx;fx=fx<0?Math.min(-0.35,fx):Math.max(0.35,fx);BS_ST.f=(o.flip?-1:1)*fx;BS_ST.s=s;ctx.scale(s*BS_ST.f,s);if(o.rot)ctx.rotate(o.rot);ctx.lineJoin="round";ctx.lineCap="round";return true;}
// a closed smooth curve through points (Catmull-Rom, as beziers); every loop winds the same way as the tubes, so the parts of a form fill as one
function bs_loop(c,p){const n=p.length;let A=0;for(let i=0;i<n;i++){const a=p[i],b=p[(i+1)%n];A+=a[0]*b[1]-b[0]*a[1];}if(A>0)p=p.slice().reverse();c.moveTo(p[0][0],p[0][1]);
  for(let i=0;i<n;i++){const a=p[(i+n-1)%n],b=p[i],d=p[(i+1)%n],e=p[(i+2)%n];c.bezierCurveTo(b[0]+(d[0]-a[0])/6,b[1]+(d[1]-a[1])/6,d[0]-(e[0]-b[0])/6,d[1]-(e[1]-b[1])/6,d[0],d[1]);}c.closePath();}
// an open smooth curve through points; m===false carries on the current subpath
function bs_line(c,p,m){const n=p.length;if(m===false)c.lineTo(p[0][0],p[0][1]);else c.moveTo(p[0][0],p[0][1]);for(let i=0;i<n-1;i++){const a=p[i?i-1:0],b=p[i],d=p[i+1],e=p[i+2<n?i+2:n-1];
  c.bezierCurveTo(b[0]+(d[0]-a[0])/6,b[1]+(d[1]-a[1])/6,d[0]-(e[0]-b[0])/6,d[1]-(e[1]-b[1])/6,d[0],d[1]);}}
// a limb, tail, trunk or ear: a smooth tube along points p, w its half-width at each point, rounded at both ends
function bs_tube(c,p,w){const n=p.length,L=[],R=[];let a0=0,a1=0;for(let i=0;i<n;i++){const a=p[i?i-1:0],b=p[i<n-1?i+1:n-1];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
    const r=Math.max(0.05,w[i]);L.push([p[i][0]-dy*r,p[i][1]+dx*r]);R.push([p[i][0]+dy*r,p[i][1]-dx*r]);if(!i)a0=Math.atan2(dy,dx);if(i===n-1)a1=Math.atan2(dy,dx);}
  bs_line(c,L);c.arc(p[n-1][0],p[n-1][1],Math.max(0.05,w[n-1]),a1+Math.PI/2,a1-Math.PI/2,true);bs_line(c,R.reverse(),false);c.arc(p[0][0],p[0][1],Math.max(0.05,w[0]),a0-Math.PI/2,a0+Math.PI/2,true);c.closePath();}
// a tapering stroke, w0 to w1 (half-widths)
function bs_taper(c,p,w0,w1){const n=p.length,w=[];for(let i=0;i<n;i++)w.push(lerp(w0,w1,n>1?i/(n-1):0));bs_tube(c,p,w);}
// a body along a spine (rump to neck): dw, vw its depth on the back and on the belly side at each spine point, re and fe how far it rounds off at each end
function bs_torso(c,sp,dw,vw,re,fe){const n=sp.length,D=[],V=[],T=[];for(let i=0;i<n;i++){const a=sp[i?i-1:0],b=sp[i<n-1?i+1:n-1];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;T.push([dx,dy]);
    D.push([sp[i][0]+dy*dw[i],sp[i][1]-dx*dw[i]]);V.push([sp[i][0]-dy*vw[i],sp[i][1]+dx*vw[i]]);}
  bs_loop(c,[[sp[0][0]-T[0][0]*re,sp[0][1]-T[0][1]*re]].concat(D,[[sp[n-1][0]+T[n-1][0]*fe,sp[n-1][1]+T[n-1][1]*fe]],V.reverse()));}
// the dark fill of a form, lit from the upper left of the screen whichever way the beast faces; k darkens it (the far legs); b [x0,y0,x1,y1] its
// reach; lo (0..1) keeps a little of its colour in the shadow
function bs_fill(ctx,col,k,b,lo){const g=BS_ST.f<0?-1:1,G=ctx.createLinearGradient(b[0]*g,b[1],b[2]*g,b[3]),d=lo?mix(col,[8,12,22],lo):[8,12,22];
  G.addColorStop(0,rgba(mix(mix(col,BS_INK,0.55),[6,9,16],k),1));G.addColorStop(1,rgba(mix(d,[4,6,12],k),1));return G;}
// one form: build(p) adds its parts to a path. Its rim, in col, is heavier on the shadow side: the silhouette in the rim's colour nudged down and
// right (glowing, gl the blur in px, 0 for none) and, thinner, up and left (not for the dim far limbs), a fine line all round, and the dark body
// over them. Returns the path.
function bs_form(ctx,build,col,fill,ra,lw,gl){const s=BS_ST.s,f=BS_ST.f,P=new Path2D(),z=(lw||2.6)/2.6;ra=ra==null?1:ra;build(P);
  ctx.save();ctx.translate(1.05*z/(s*f),1.45*z/s);ctx.fillStyle=rgba(col,0.92*ra);if(gl){ctx.shadowColor=rgba(col,0.72*ra);ctx.shadowBlur=gl*BS_ST.z;}ctx.fill(P);ctx.restore();
  if(ra>0.5){ctx.save();ctx.translate(-0.6*z/(s*f),-0.6*z/s);ctx.fillStyle=rgba(col,0.85*ra);ctx.fill(P);ctx.restore();}
  ctx.lineWidth=1/s;ctx.strokeStyle=rgba(col,ra);ctx.stroke(P);ctx.fillStyle=fill;ctx.fill(P);return P;}
// a still part of a beast, drawn once at 2x into its own canvas (with room for its glow) and then placed: key names it, b [x0,y0,x1,y1] is its
// reach in the beast's own units and draw(c) draws it there (at the beast's scale and facing, which the key includes)
function bs_still(ctx,key,b,draw){const s=BS_ST.s,f=BS_ST.f;key+=":"+s.toFixed(3)+":"+f.toFixed(3);let S=BS_CACHE[key];
  if(!S){const Z=2*s,pad=16,W=Math.ceil((b[2]-b[0])*Z+2*pad),H=Math.ceil((b[3]-b[1])*Z+2*pad),c=mkCanvas(W,H),g=c.getContext("2d");
    g.translate(pad-b[0]*Z,pad-b[1]*Z);g.scale(Z,Z);g.lineJoin="round";g.lineCap="round";BS_ST.z=2;draw(g);BS_ST.z=1;BS_ST.s=s;BS_ST.f=f;
    S=BS_CACHE[key]={c,x:b[0]-pad/Z,y:b[1]-pad/Z,w:W/Z,h:H/Z};}
  ctx.drawImage(S.c,S.x,S.y,S.w,S.h);}
// fine inner lines: each a list of points, a tapering stroke of w0 → w1 screen pixels (half-widths), drawn as one light polygon per line
function bs_lines(ctx,list,col,a,w0,w1){if(a<=0.01||!list.length)return;const s=BS_ST.s;ctx.beginPath();
  for(const p of list){const n=p.length,L=[],R=[];for(let i=0;i<n;i++){const q=p[i?i-1:0],r=p[i<n-1?i+1:n-1];let dx=r[0]-q[0],dy=r[1]-q[1];const d=Math.hypot(dx,dy)||1,w=lerp(w0,w1,n>1?i/(n-1):0)/s;
      L.push(p[i][0]-dy/d*w,p[i][1]+dx/d*w);R.push(p[i][0]+dy/d*w,p[i][1]-dx/d*w);}
    const e=p[n-1],b=p[0],d0=Math.hypot(p[1][0]-b[0],p[1][1]-b[1])||1,d1=Math.hypot(e[0]-p[n-2][0],e[1]-p[n-2][1])||1,k0=w0/s/d0,k1=w1/s/d1;
    ctx.moveTo(b[0]-(p[1][0]-b[0])*k0,b[1]-(p[1][1]-b[1])*k0);for(let i=0;i<n;i++)ctx.lineTo(L[2*i],L[2*i+1]);ctx.lineTo(e[0]+(e[0]-p[n-2][0])*k1,e[1]+(e[1]-p[n-2][1])*k1);
    for(let i=n-1;i>=0;i--)ctx.lineTo(R[2*i],R[2*i+1]);ctx.closePath();}
  ctx.fillStyle=rgba(col,a);ctx.fill();}
// a bright eye with a soft glow round it; op 1 open, 0 shut
function bs_eye(ctx,x,y,r,col,op,a){if(a!=null&&a<=0.02)return;const k=a==null?1:a;glow(ctx,x,y,r*2.4,col,0.24*k);ctx.save();ctx.globalAlpha*=k;ctx.translate(x,y);ctx.scale(1,Math.max(0.12,op==null?1:op));
  ctx.fillStyle=rgba(mix(col,[255,255,255],0.45),1);ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.restore();}
// a joint between a and b (bones l1, l2); bend 1 or -1 picks the side it bends to
function bs_ik(a,b,l1,l2,bend){const dx=b[0]-a[0],dy=b[1]-a[1],d0=Math.hypot(dx,dy)||1e-6,d=clamp(d0,Math.abs(l1-l2)+0.01,l1+l2-0.01),x=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-x*x)),ux=dx/d0,uy=dy/d0;
  return [a[0]+ux*x-uy*h*bend,a[1]+uy*x+ux*h*bend];}
const bs_mid=(a,b,k)=>[a[0]+(b[0]-a[0])*(k==null?0.5:k),a[1]+(b[1]-a[1])*(k==null?0.5:k)];
// a side of a limb: the points of p pushed out by w on one side (1 or -1)
function bs_side(p,w,sd){const o=[];for(let i=0;i<p.length;i++){const a=p[i?i-1:0],b=p[i<p.length-1?i+1:p.length-1];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;o.push([p[i][0]-dy/d*w[i]*sd,p[i][1]+dx/d*w[i]*sd]);}return o;}
// two poses blended (numbers, points and lists of points)
function bs_blend(A,B,k){if(k<=0)return A;if(k>=1)return B;const o={};for(const q in A){const a=A[q],b=B[q];
  o[q]=typeof a==="number"?a+(b-a)*k:a.map((v,i)=>typeof v==="number"?v+(b[i]-v)*k:[v[0]+(b[i][0]-v[0])*k,v[1]+(b[i][1]-v[1])*k]);}return o;}
// four poses through a smooth (Catmull-Rom) curve, at u between the middle two
function bs_cr(A,B,C,D,u){const u2=u*u,u3=u2*u,wa=-0.5*u3+u2-0.5*u,wb=1.5*u3-2.5*u2+1,wc=-1.5*u3+2*u2+0.5*u,wd=0.5*u3-0.5*u2,f=(a,b,c,d)=>wa*a+wb*b+wc*c+wd*d,o={};
  for(const q in A){const a=A[q];o[q]=typeof a==="number"?f(a,B[q],C[q],D[q]):a.map((v,i)=>typeof v==="number"?f(v,B[q][i],C[q][i],D[q][i]):[f(v[0],B[q][i][0],C[q][i][0],D[q][i][0]),f(v[1],B[q][i][1],C[q][i][1],D[q][i][1])]);}return o;}
// a looping gait: keys [[phase, pose], ...] sorted, phase in 0..1
function bs_gait(keys,ph){ph-=Math.floor(ph);const n=keys.length;let k=n-1;for(let i=0;i<n;i++)if(keys[i][0]<=ph)k=i;const k1=(k+1)%n,p0=keys[k][0],p1=k1?keys[k1][0]:1,u=(ph-p0)/((p1-p0)||1);
  return bs_cr(keys[(k+n-1)%n][1],keys[k][1],keys[k1][1],keys[(k+2)%n][1],clamp(u,0,1));}
// a smooth value through keys [[u, v], ...] (a Hermite curve whose slopes follow the neighbouring keys)
function bs_curve(K,u){let k=0;while(k<K.length-2&&K[k+1][0]<u)k++;const a=K[Math.max(0,k-1)],b=K[k],c=K[k+1],d=K[Math.min(K.length-1,k+2)],h=(c[0]-b[0])||1,f=clamp((u-b[0])/h,0,1);
  const m1=(c[1]-a[1])/((c[0]-a[0])||1)*h,m2=(d[1]-b[1])/((d[0]-b[0])||1)*h,f2=f*f,f3=f2*f;return(2*f3-3*f2+1)*b[1]+(f3-2*f2+f)*m1+(3*f2-2*f3)*c[1]+(f3-f2)*m2;}
// a blink now and then (1 open, 0 shut), and a slow wandering value in -1..1 that rests, then eases to the next
function bs_blink(t,k){if(t==null)return 1;const P=3.3+hash(k,7)*2.6,u=((t+hash(k,8)*P)%P+P)%P;return u<0.2?1-0.92*Math.sin(Math.PI*u/0.2):1;}
function bs_drift(t,k,per){if(t==null)return 0;const u=t/per+hash(k,9)*7,i=Math.floor(u);return lerp(hash(i,k)*2-1,hash(i+1,k)*2-1,sstep(0.55,1,u-i));}
// a chain of points bent a little along its length (a tail swaying, a trunk curling): amp radians, ph the wave's phase
function bs_bend(p,amp,ph,sp){const o=[p[0]];let ang=0;for(let k=1;k<p.length;k++){const dx=p[k][0]-p[k-1][0],dy=p[k][1]-p[k-1][1];ang+=amp*Math.sin(ph-k*(sp||0.9))*k/p.length;
  const c=Math.cos(ang),s=Math.sin(ang),q=o[k-1];o.push([q[0]+dx*c-dy*s,q[1]+dx*s+dy*c]);}return o;}
// points turned by a and moved to o: the frame of a head, a paw
const bs_rot=(o,a,sc)=>{const c=Math.cos(a)*(sc||1),s=Math.sin(a)*(sc||1);return p=>[o[0]+p[0]*c-p[1]*s,o[1]+p[0]*s+p[1]*c];};


/* ---------- vervet monkey (Chlorocebus): slender, grizzled grey-olive, a black face with a short muzzle, framed by a thin white brow band and
   white cheek whiskers, small dark ears; a long tail with a dark tip; sitting on its haunches. Options: t, i (which monkey: each sits its own
   way, and is a little bigger or smaller), tree / bush / tall (0..1: perched in a tree, crouched in a bush looking up, standing tall), look (0..1,
   head up); dir (-1 while its next move is to the left: it turns and leaps that way). In the calls scene, calls [leopard, eagle, snake cue] and
   path [home, tree spot, bush spot] let each monkey keep the troop's moves a moment early or late, and turn round before it leaps ---------- */
const BS_MK={
  sit:{P:[-6,35],M:[-9,16],S:[3,-2],N:[8,-7],H:[13,-15],hp:0.1,K:[16,22],A:[10,44],T:[22,47.5],K2:[19,24],A2:[14,45],T2:[26,48],E:[8,22],Hn:[19,45.5],E2:[13,21],Hn2:[24,46.5],
    tl:[[-12,40],[-20,46.5],[-28,47.5],[-35,46.5],[-39,43],[-40,38.5]],dw:[12,10,8,5],vw:[10,10,9,5]},
  perch:{P:[-6,35],M:[-9,16],S:[3,-2],N:[8,-7],H:[13,-15],hp:0.18,K:[16,24],A:[12,43],T:[19,50],K2:[19,26],A2:[16,44],T2:[22,50.5],E:[8,22],Hn:[18,46],E2:[13,21],Hn2:[23,47],
    tl:[[-12,40],[-15,53],[-16,66],[-15,79],[-16,91],[-19,101]],dw:[12,10,8,5],vw:[10,10,9,5]},
  crouch:{P:[-8,38],M:[-7,22],S:[7,11],N:[12,6],H:[18,-1],hp:-0.62,K:[12,30],A:[6,45],T:[17,47.5],K2:[15,32],A2:[10,46],T2:[21,48],E:[15,28],Hn:[23,46.5],E2:[19,28],Hn2:[28,47],
    tl:[[-14,42],[-23,47],[-32,47.5],[-39,45.5],[-42,41],[-42,36]],dw:[11,9,8,5],vw:[10,10,9,5]},
  tall:{P:[0,11],M:[-4,-7],S:[2,-27],N:[6,-33],H:[10,-41],hp:0.5,K:[7,29],A:[1,45],T:[13,47.5],K2:[4,30],A2:[-3,46],T2:[9,48],E:[5,-9],Hn:[11,7],E2:[1,-8],Hn2:[8,9],
    tl:[[-7,15],[-13,27],[-16,38],[-22,46.5],[-31,47.5],[-37,44]],dw:[10,8,8,5],vw:[9,7.5,8,5]},
  leap:{P:[-16,16],M:[0,5],S:[16,11],N:[22,9],H:[30,3],hp:0.05,K:[-6,28],A:[-24,31],T:[-35,35],K2:[-10,30],A2:[-28,35],T2:[-39,39],E:[24,25],Hn:[36,35],E2:[20,27],Hn2:[30,39],
    tl:[[-22,13],[-34,11],[-47,13],[-58,17],[-67,24],[-72,32]],dw:[10,9,8,5],vw:[9,9,8,5]}};
// each monkey's own way of sitting: its size, and a change to the sitting pose (one upright with its tail curled round its feet, a youngster hunched
// over, grooming, one with its face turned toward us); d staggers its moves (s); pr: in the tree it reaches up to hold a branch above
const BS_MKI=[{sc:1.03,d:0.04,fa:1},
  {sc:1.07,d:0.16,fa:1,tf:1,pr:1,P:[-5,35],M:[-7,15],S:[5,-5],N:[9,-10],H:[13,-18],hp:0.06,E:[10,17],Hn:[16,25],E2:[15,16],Hn2:[21,26],
    tl:[[-10,42],[-8,47.5],[2,49],[14,49.5],[26,48.5],[31,44.5]]},
  {sc:0.85,d:0.09,fa:1,gr:1,S:[5,1],M:[-8,18],N:[10,-2],H:[16,-8],hp:0.62,E:[13,24],Hn:[15,17],tl:[[-12,40],[-20,46.5],[-27,47.5],[-33,45.5],[-35,41],[-34,36.5]]},
  {sc:0.97,d:0.22,fa:0.4,pr:1,H:[12,-15],hp:0.04}];
function monkey(ctx,x,y,s,col,o){o=o||{};col=col||[220,200,170];const t=o.t,live=t!=null,i=o.i||0,V=BS_MKI[((i%4)+4)%4];
  // the troop's moves, a moment early or late for each monkey; its size; the way it faces
  let tr=o.tree||0,bu=o.bush||0,ta=o.tall||0,F=null,dx=0,dy=0;const sc=V.sc,sv=s*sc;
  if(o.calls&&o.path&&live&&!o.bs_in){const [cL,cE,cS]=o.calls,d=V.d,m=o.path[0],T=o.path[1],B=o.path[2],trI=fin(t,cL+1+d,1.2)*(1-fin(t,cE+0.3+d*0.7,0.8)),buI=fin(t,cE+1.4+d*0.35,1.1)*(1-fin(t,cS+0.3+d*0.45,0.8));
    dx=(T[0]-m[0])*(trI-tr)+(B[0]-m[0])*(buI-bu);dy=(T[1]-m[1])*(trI-tr)+(B[1]-m[1])*(buI-bu);tr=trI;bu=buI;ta=fin(t,cS+0.8+d*1.2,0.8);
    const L1=fin(t,cL+0.35+d*1.4,0.55),R1=fin(t,cL+2.15+d*1.5,0.6),L2=fin(t,cS-0.2+d*0.8,0.45),R2=fin(t,cS+1.05+d*1.2,0.6);F=1-2*(L1*(1-R1)+L2*(1-R2));}
  if(F==null){const turn=w=>sstep(0,0.14,w)*(1-sstep(0.86,1,w));F=(o.dir||1)<0?1-2*Math.max(turn(tr),turn(bu)):1;}
  if(o.face!=null)F=o.face;
  x+=dx;y+=dy+47.5*s*(1-sc);
  const oo=Object.assign({},o,{face:F,tree:tr,bush:bu,tall:ta,calls:null,dir:1});
  // in the bush: its legs among the leaves
  const hid=bu>0.9&&!o.bs_in&&o.bs_mask==null?sstep(0.9,1,bu)*(1-sstep(0.9,1,ta)):0;
  if(hid>0.01)oo.bs_mask=c=>{const g=c.createLinearGradient(0,6,0,34);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,"+(0.62*hid)+")");c.fillStyle=g;c.fillRect(-60,6,120,80);};
  // turning round: a narrower body, the two facings blended through the middle of the turn
  if(!o.bs_in&&Math.abs(F)<0.55){const k=(0.55-F)/1.1,a=o.a==null?1:o.a;
    bs_mkDraw(ctx,x,y,sv,col,Object.assign({},oo,{face:0.55,turning:1,a:a*(1-k)}),t,i,V);bs_mkDraw(ctx,x,y,sv,col,Object.assign({},oo,{face:-0.55,turning:1,a:a*k}),t,i,V);return;}
  bs_mkDraw(ctx,x,y,sv,col,oo,t,i,V);}
function bs_mkDraw(ctx,x,y,s,col,o,t,i,V){const tr=o.tree||0,bu=o.bush||0,ta=o.tall||0,F=o.face==null?1:o.face,hop=w=>w>0&&w<1?Math.sin(Math.PI*w):0,lp=clamp(1.7*Math.max(hop(tr),hop(bu)),0,1);
  const bx=[-54-34*lp,-42-16*ta-24*lp,46+8*lp,58+50*sstep(0.3,1,tr)];
  if(bs_layered(ctx,x,y,s,o,F<0?[-bx[2],bx[1],-bx[0],bx[3]]:bx,(c,oo)=>bs_mkDraw(c,x,y,s,col,oo,t,i,V)))return;
  const live=t!=null;
  let sit=BS_MK.sit;if(V.P||V.tl||V.H)sit=Object.assign({},sit,V);
  let q=bs_blend(sit,V.pr?Object.assign({},BS_MK.perch,{E:[12,-9],Hn:[15,-25]}):BS_MK.perch,sstep(0.75,1,tr));q=bs_blend(q,BS_MK.crouch,Math.max(sstep(0.65,1,bu),o.look||0));q=bs_blend(q,BS_MK.tall,ta);q=bs_blend(q,BS_MK.leap,lp);
  // while it turns round, it lifts a little and its face comes round toward us
  const tu=o.turning?1:clamp((1-Math.abs(F))/0.45,0,1);
  if(!bs_begin(ctx,x,y-(16*Math.max(hop(tr),hop(bu))+2.5*tu)*s,s,o,F))return;
  const rot=0.35*(F<0?-1:1)*clamp(1.7*hop(tr),0,1);if(rot){ctx.translate(0,20);ctx.rotate(rot);ctx.translate(0,-20);}
  // life: breath, a head that turns and tilts (now and then toward the leopard's side, or toward us), blinks, a grooming hand, the tail
  const idle=(1-lp)*(1-ta*0.5),br=live?1+0.035*Math.sin(TAU*t/(3.1+0.4*i)+i*1.9):1,bl=bs_blink(t,5+i);
  const yd=live?bs_drift(t,21+i,1.9+0.37*i):0,fa0=V.fa,yaw=lerp(clamp(fa0+(fa0<0.8?0.3*yd:0.5*Math.min(0,yd)+0.12*Math.max(0,yd))*idle,0.12,1),0.15,tu);
  const pt=live?0.2*bs_drift(t,41+i,2.5+0.3*i)*idle:0,gr=V.gr&&live?(1-sstep(0,0.3,tr+bu+ta))*Math.max(0,Math.sin(TAU*t/2.3)):0;
  if(gr>0)q=Object.assign({},q,{Hn:[q.Hn[0]-1.5*gr,q.Hn[1]+2.5*gr*Math.sin(TAU*t*1.6)]});
  const hang=sstep(0.75,1,tr)*(1-lp),tl=live?bs_bend(q.tl,(V.tf?0.07:0.14)+0.1*hang,TAU*t/(3.1+0.4*i)+i*2,0.8):q.tl;
  const box=[-30,-40,40,60],cf=mix(col,[130,140,105],0.4),dw=q.dw.map(v=>v*br),vw=q.vw.map(v=>v*br);
  const arm=[[q.S[0]-1,q.S[1]+2],bs_mid(q.S,q.E,0.55),q.E,bs_mid(q.E,q.Hn,0.5),q.Hn],aw=[5.9,5,4.4,3.3,2.9],leg=[q.P,q.K,q.A,q.T],lw=[9.5,5.4,3.1,2.6];
  const arm2=[q.S,q.E2,q.Hn2],leg2=[q.P,q.K2,q.A2,q.T2];
  // the head's frame: yaw 1 in profile, less as it turns toward us (the muzzle shortens, the face comes round, the far eye and cheek show)
  const hp=bs_rot(q.H,q.hp+pt,0.88),m=0.25+0.75*yaw,fx=-(1-yaw)*6;
  const skull=[[-8.5,6],[-10,0],[-8.8,-6],[-3.5,-9.8],[2.5,-10.3],[7,-8.6],[9.8+0.8*m,-6.4],[10.2+1.6*m,-4.7],[11+3.2*m,-3.7],[11.4+4.4*m,-1.4],[11.2+4.2*m,1.2],[9.8+3.2*m,2.8],[8.8+2.4*m,5],[6,7.4],[1,8.8],[-4,8.6]].map(hp);
  const nape=[bs_mid(q.S,q.N,0.2),q.N,hp([-6.8,-1.5])];
  // the far arm and leg (and a tail curled round the feet), behind
  bs_form(ctx,c=>{bs_tube(c,arm2,[4.6,3.4,2.8]);bs_tube(c,leg2,[8,5,2.8,2.4]);if(V.tf)bs_tube(c,tl,[3.2,2.9,2.6,2.2,1.9,1.5]);},col,bs_fill(ctx,cf,0.6,box),0.42,2.2,0);
  // body, head and nape, near leg, near arm and the tail, as one form
  bs_form(ctx,c=>{bs_torso(c,[q.P,q.M,q.S,q.N],dw,vw,7,3);bs_tube(c,nape,[7,6.6,6.2]);bs_loop(c,skull);bs_tube(c,leg,lw);bs_tube(c,arm,aw);
    bs_loop(c,[bs_mid(q.Hn,q.E,0.12),[q.Hn[0]+2.4,q.Hn[1]-1.2],[q.Hn[0]+3.4,q.Hn[1]+1.2],[q.Hn[0]+0.6,q.Hn[1]+2.2]]);if(!V.tf)bs_tube(c,tl,[3.4,3,2.6,2.2,1.8,1.4]);},col,bs_fill(ctx,cf,0,box),1,2.5,8);
  // the tail's dark tip; the grizzled back; the arm against the body; the thigh
  ctx.beginPath();bs_tube(ctx,[bs_mid(tl[4],tl[5],0.05),tl[5]],V.tf?[1.6,1.2]:[1.7,1.35]);ctx.fillStyle="rgba(3,4,8,0.9)";ctx.fill();
  const back=bs_side([q.P,q.M,q.S],[dw[0]*0.7,dw[1]*0.7,dw[2]*0.7],1),fl=[];for(let k=0;k<7;k++){const u=0.12+k*0.12,p=bs_mid(back[u<0.5?0:1],back[u<0.5?1:2],u<0.5?u*2:u*2-1),a=0.9+0.5*hash(k+i*7,3);fl.push([p,[p[0]-2.2*Math.cos(a),p[1]+2.2*Math.sin(a)]]);}
  bs_lines(ctx,fl,mix(col,[255,255,255],0.2),0.28,0.35,0.15);
  const armB=bs_side(arm,aw,1),legT=bs_side(leg,lw,-1);bs_lines(ctx,[[bs_mid(armB[1],armB[2],0.2),armB[2],bs_mid(armB[2],armB[3],0.6)],[bs_mid(legT[0],legT[1],0.45),legT[1],bs_mid(legT[1],legT[2],0.3)]],col,0.38,0.2,0.6);
  // the face: black skin round the eyes and over the short muzzle, a thin white brow band above it, white whiskers down the cheek, and a small
  // dark ear half hidden behind them
  const wh=mix(col,[255,255,255],0.62),fe=fx*0.8;
  const ear=[[-3.8+fx*0.4,-3.2],[-1.6+fx*0.4,-4],[-0.3+fx*0.4,-1.6],[-1+fx*0.4,1.4],[-3.2+fx*0.4,1]].map(hp);ctx.beginPath();bs_loop(ctx,ear);ctx.fillStyle="rgba(10,12,16,0.9)";ctx.fill();bs_lines(ctx,[[ear[4],ear[0],ear[1],ear[2]]],col,0.45,0.35,0.2);
  ctx.beginPath();bs_loop(ctx,[[4.4+fe,-5.4],[7.6+fx*0.4,-6.5],[9.7+0.8*m,-6.1],[10+1.6*m,-4.6],[10.8+3.2*m,-3.6],[11.2+4.4*m,-1.4],[11+4.2*m,1.2],[9.7+3.2*m,2.8],[8.6+2.4*m,4.9],[6.2+fx*0.5,5.2],[4.4+fe,3],[3.8+fe,-1.2]].map(hp));ctx.fillStyle="rgba(3,4,7,0.82)";ctx.fill();bs_lines(ctx,[[hp([10.6+4.2*m,-1.2]),hp([9.8+3.8*m,0.2])]],col,0.35,0.35,0.2);ctx.beginPath();bs_loop(ctx,[[5.6+fx*0.5,5.8],[8.6+2.2*m,5.2],[6.8,7.4],[3.6,8.4],[2.8,6.8]].map(hp));ctx.fillStyle=rgba(wh,0.42);ctx.fill();
  ctx.beginPath();bs_loop(ctx,[[3.6+fe,-5.4],[2.4+fe,-2],[2+fe,2],[3.3+fe,5.6],[5.6+fx*0.5,7.2],[6+fx*0.5,6.2],[4.2+fe,4],[3.6+fe,0],[4+fe,-4.4]].map(hp));ctx.fillStyle=rgba(wh,0.72);ctx.fill();
  const fr=[];for(let k=0;k<5;k++){const u=k/4,p=[lerp(2.8,2.2,u)+fe-0.6*Math.sin(Math.PI*u),lerp(-4.2,6.4,u)],a=Math.PI*0.95-0.9*u;fr.push([hp(p),hp([p[0]+2.2*Math.cos(a),p[1]+2.2*Math.sin(a)])]);}
  bs_lines(ctx,fr,wh,0.5,0.35,0.1);
  bs_lines(ctx,[[hp([3.4+fe,-5.9]),hp([6+fx*0.5,-6.9]),hp([9.2+fx*0.3,-6.2])]],wh,0.85,0.55,0.25);
  if(yaw<0.75){const k=clamp((0.75-yaw)*3,0,1);ctx.beginPath();bs_loop(ctx,[[10.2+m,-4.6],[11.4+2.6*m,-2.4],[12+3.2*m,1.2],[11+2.4*m,4.6],[10.4+2*m,3.4],[10.8+2.4*m,0]].map(hp));ctx.fillStyle=rgba(wh,0.6*k);ctx.fill();}
  bs_lines(ctx,[[hp([10+3.2*m,2.6]),hp([8.2+2.2*m,3.4])]],col,0.3,0.4,0.25);
  const e1=hp([6.4+fx*0.85,-3.4]),e2=hp([9.8+fx*0.25+m*0.6,-3.2]);bs_eye(ctx,e1[0],e1[1],1.2,col,bl);bs_eye(ctx,e2[0],e2[1],1,col,bl,clamp((0.9-yaw)*3.5,0,1));
  ctx.restore();}
/* ---------- leopard (Panthera pardus): a slow stalking walk (a lateral-sequence walk, the diagonal legs nearly together), head low, shoulder
   blades rolling, the long tail low with its tip curled up. Options: t, walk (px walked, negative until the spot where it stops: the feet keep
   time with the ground and it stops with all four planted), flip ---------- */
const BS_LEO={S:74,D:0.78,off:[0,0.3,0.5,0.8],stand:0.54};
function bs_leoFoot(ph,lift){const S=BS_LEO.S,D=BS_LEO.D;ph-=Math.floor(ph);if(ph<D)return[S*D*(0.5-ph/D),0,0];const u=(ph-D)/(1-D),e=u*u*(3-2*u);return[S*D*(e-0.5),-lift*Math.sin(Math.PI*u)*(1-0.25*u),u];}
// the coat, drawn once at 2x for each size and colour, in the body's own units: rosettes (open, broken rings of three or four blotches round a
// tawny centre; large on the flank, smaller and closer toward the spine and the shoulder), small solid spots along the spine and low on the belly
const BS_LEO_TOP=[[-54,-4],[-46,-9.5],[-30,-9.5],[-12,-7.5],[6,-8],[22,-11.4],[31,-12],[42,-8],[52,-4]],BS_LEO_BOT=[[-57,2],[-48,10],[-34,14],[-22,12.5],[-10,14.5],[6,18],[24,22],[38,21],[48,14],[60,11]];
function bs_leoEdge(E,x){for(let k=0;k<E.length-1;k++)if(x<=E[k+1][0])return lerp(E[k][1],E[k+1][1],clamp((x-E[k][0])/(E[k+1][0]-E[k][0]),0,1));return E[E.length-1][1];}
function bs_leoCoat(col,s){const key="leo"+s.toFixed(3)+col.join();if(BS_CACHE[key])return BS_CACHE[key];
  const X0=-56,Y0=-14,W=110,H=38,Z=2*s,c=mkCanvas(Math.ceil(W*Z),Math.ceil(H*Z)),g=c.getContext("2d");g.scale(Z,Z);g.translate(-X0,-Y0);g.lineCap="round";
  const cen=[],arcs=[],spots=[];let n=0;
  for(let j=0;j<6;j++)for(let i=0;i<14;i++){n++;const x=-50+i*7.3+(j%2)*3.65+(hash(n,1)-0.5)*3.2,top=bs_leoEdge(BS_LEO_TOP,x),bot=bs_leoEdge(BS_LEO_BOT,x),y=top+2.2+j*4.7+(hash(n,2)-0.5)*2.6,d=(y-top)/(bot-top);
    if(x<-51||x>45)continue;const sz=(x>24?0.7:x<-42?0.8:1)*(0.8+0.4*hash(n,3));
    if(d<0.13){if(hash(n,4)<0.8)spots.push([x,y+0.6,(0.55+0.35*hash(n,5))*sz]);continue;}
    if(d>0.8){if(d<0.94&&hash(n,4)<0.75)spots.push([x,y,(0.6+0.45*hash(n,5))*sz]);continue;}
    const r=(1.3+2*sstep(0.1,0.5,d))*sz;if(y-r*1.2<top+1.3)continue;
    cen.push([x,y,r*0.62]);const k=hash(n,6)>0.4?4:3,a0=hash(n,7)*TAU;
    for(let q=0;q<k;q++){if(k===4&&hash(n,20+q)<0.15)continue;const rr=r*(0.8+0.42*hash(n,8+q)),a=a0+q*TAU/k+(hash(n,12+q)-0.5)*0.5,sp=TAU/k*(0.5+0.25*hash(n,16+q));arcs.push([x,y,rr,a,a+sp,0.22*r+0.28]);}}
  g.fillStyle=rgba(col,0.12);g.beginPath();for(const [x,y,r] of cen){g.moveTo(x+r,y);g.arc(x,y,r,0,TAU);}g.fill();
  g.strokeStyle=rgba(col,0.66);for(const [x,y,r,a0,a1,w] of arcs){g.beginPath();g.arc(x,y,r,a0,a1);g.lineWidth=w;g.stroke();}
  g.fillStyle=rgba(col,0.62);g.beginPath();for(const [x,y,r] of spots){g.moveTo(x+r,y);g.arc(x,y,r,0,TAU);}g.fill();
  return BS_CACHE[key]={c,X0,Y0,W,H};}
function leopard(ctx,x,y,s,col,o){o=o||{};if(bs_layered(ctx,x,y,s,o,[-128,-30,96,50],(c,oo)=>leopard(c,x,y,s,col,oo)))return;
  col=col||LEO;const t=o.t,live=t!=null,walk=o.walk==null?0:o.walk;if(!bs_begin(ctx,x,y,s,o))return;
  const ph=BS_LEO.stand+walk/(BS_LEO.S*s),mov=clamp(Math.abs(walk)/(0.4*BS_LEO.S*s),0,1),br=live?Math.sin(TAU*t/3.6):0,bl=bs_blink(t,3);
  const feet=BS_LEO.off.map((d,k)=>bs_leoFoot(ph-d,k%2?6:7)),sc=k=>{const f=((ph-BS_LEO.off[k])%1+1)%1;return f<BS_LEO.D?Math.sin(Math.PI*f/BS_LEO.D):0;};
  const bob=0.9*Math.cos(TAU*2*ph)*mov,sb=1.4+2.2*Math.max(sc(1),sc(3)*0.8),hb=bob*0.3+(live?0.5*bs_drift(t,5,3.2):0);
  const Sj=[34,2+bob*0.6],Hj=[-38,0+bob],box=[-100,-36,80,50],fill=bs_fill(ctx,col,0,box,0.84);
  const fore=(f,dx,gy)=>{const P=[Sj[0]+2+dx+f[0],42+gy+f[1]],sw=Math.sin(Math.PI*f[2]),W=[P[0]-1-4*sw,P[1]-6.5+1.5*sw],E=bs_ik(Sj,W,17,20,1);return{P,W,E,toe:[P[0]+5-3*sw,P[1]+1.4*sw]};};
  const hind=(f,dx,gy)=>{const P=[Hj[0]+4+dx+f[0],42+gy+f[1]],al=f[2]?lerp(0.65,0.2,f[2])+0.35*Math.sin(Math.PI*f[2]):0.2+0.45*clamp(0.5-f[0]/(BS_LEO.S*BS_LEO.D),0,1),
    J=[P[0]-14*Math.sin(al),P[1]-14*Math.cos(al)],K=bs_ik(Hj,J,20,21,-1);return{P,J,K,toe:[P[0]+4.5,P[1]]};};
  const LF=fore(feet[1],0,0),RF=fore(feet[3],3,-1.5),LH=hind(feet[0],0,0),RH=hind(feet[2],3,-1.5);
  const foreT=L=>[[Sj[0]-3,Sj[1]-7],Sj,L.E,L.W,L.P,L.toe],foreW=[8,8.8,6.2,4.4,4.6,4.1],hindT=L=>[[Hj[0]+2,Hj[1]-1],Hj,bs_mid(Hj,L.K,0.5),L.K,L.J,L.P,L.toe],hindW=[10,10.5,9.5,5.8,3.6,4.3,3.9];
  const tw=live?0.12+0.1*(1-mov):0.1,tlp=live?TAU*t/4.2+ph*TAU*0.5:1.2,tail=bs_bend([[-54,-3],[-62,6],[-70,15],[-82,21],[-96,22],[-108,18],[-116,10],[-118,1]],tw,tlp,0.7);
  const hd=[68,4.5+hb],ha=0.08+(live?0.06*bs_drift(t,9,3.8):0),hs=1.08,hp=p=>[hd[0]+hs*(p[0]*Math.cos(ha)-p[1]*Math.sin(ha)),hd[1]+hs*(p[0]*Math.sin(ha)+p[1]*Math.cos(ha))],ef=live?0.4*Math.max(0,bs_drift(t,17,1.7)):0;
  // the far legs, darker, behind the body
  bs_form(ctx,c=>{bs_tube(c,foreT(RF),foreW);bs_tube(c,hindT(RH),hindW);},col,bs_fill(ctx,col,0.6,box,0.85),0.4,2.2,0);
  // body (a deep chest, a tucked flank), near legs, tail and head as one form
  const ey=br*0.5,top=[[-54,-4],[-46,-9.5],[-30,-9.5+bob*0.4],[-12,-7.5+bob*0.6-ey],[6,-8+bob*0.6-ey],[22,-10-sb+bob*0.6],[31,-11-sb*0.8+bob*0.6],[42,-8+bob*0.5],[52,-4+hb*0.6]];
  const bot=[[60,11+hb],[48,14+bob*0.5],[38,21+bob*0.6+ey],[24,22+bob*0.6+ey],[6,18+bob*0.6+ey],[-10,14.5+bob*0.7],[-22,12.5+bob*0.8],[-34,14+bob],[-48,10+bob],[-57,2+bob]];
  const head=[[-11,-2],[-6,-8.5],[3,-9.2],[10,-6.6],[15.5,-3.6],[18.6,-0.3],[18.4,3],[16.6,5.2],[14.6,8.2],[8,10.6],[0,11],[-7,9]].map(hp),ear=[[-8,-7],[-7.6-ef,-11.6],[-5-ef,-13.6],[-2.4,-12.2],[-1.8,-8.4]].map(hp);
  bs_form(ctx,c=>{bs_loop(c,top.concat(bot));bs_tube(c,foreT(LF),foreW);bs_tube(c,hindT(LH),hindW);bs_tube(c,tail,[5,4.4,3.9,3.6,3.4,3.3,3.2,3.1]);bs_loop(c,head);bs_loop(c,ear);},col,fill,1,2.8,8);
  // rosettes on the body (each a broken ring round a tawny centre), solid spots on the legs, belly and head, rings toward the tail's tip
  const coat=bs_leoCoat(col,s);ctx.drawImage(coat.c,coat.X0,coat.Y0+bob*0.6,coat.W,coat.H);
  const dots=[],dot=(p,r)=>{dots.push(p,r);};
  [[0.25,0.3],[0.5,0.55],[0.75,0.45]].forEach(([u,v])=>{dot(bs_mid(Sj,LF.E,u),0.9);dot(bs_mid(LF.E,LF.W,v),0.75);dot(bs_mid(Hj,LH.K,u*0.9),1);dot(bs_mid(LH.K,LH.J,v),0.75);});
  [[-2,-6],[2,-7],[5.5,-6],[-4,-3],[1,-4.5],[4,3],[7,2],[13,3.8],[14.8,2.8],[12.2,5.2]].forEach(p=>dot(hp(p),0.5));
  ctx.beginPath();for(let k=0;k<dots.length;k+=2){const p=dots[k],r=dots[k+1];ctx.moveTo(p[0]+r,p[1]);ctx.arc(p[0],p[1],r,0,TAU);}ctx.fillStyle=rgba(col,0.66);ctx.fill();
  const rings=[];for(let k=2;k<7;k++){const a=tail[k],b=tail[k+1],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,m=bs_mid(a,b,0.5),w=3.2;
    if(k<4)rings.push([[m[0]+nx*w*0.6,m[1]+ny*w*0.6],[m[0]+nx*w*0.1+dx/d*1.2,m[1]+ny*w*0.1+dy/d*1.2]]);else rings.push([[m[0]+nx*w*0.95,m[1]+ny*w*0.95],[m[0]+dx/d*1.1,m[1]+dy/d*1.1],[m[0]-nx*w*0.95,m[1]-ny*w*0.95]]);}
  bs_lines(ctx,rings,col,0.66,0.9,0.5);
  // the shoulder blade and the thigh rolling under the skin; mouth, chin, cheek and nose
  bs_lines(ctx,[[[Sj[0]-6,Sj[1]-11-sb*0.5],[Sj[0]-6.5,Sj[1]-4],[Sj[0]-3,Sj[1]+5]],[[Hj[0]+10,Hj[1]+13],[Hj[0]+12.5,Hj[1]+3],[Hj[0]+9,Hj[1]-7]]],col,0.4,0.2,0.7);
  bs_lines(ctx,[[hp([16.6,5]),hp([13.8,5.9]),hp([11,5.4])],[hp([14.3,8]),hp([11.5,7.3])],[hp([8,10.4]),hp([2,7.4]),hp([-3,3])]],col,0.5,0.55,0.25);
  const ns=[hp([18.8,-0.6]),hp([16.8,-0.8]),hp([17.8,1.4])];ctx.beginPath();ctx.moveTo(ns[0][0],ns[0][1]);ctx.lineTo(ns[1][0],ns[1][1]);ctx.lineTo(ns[2][0],ns[2][1]);ctx.closePath();ctx.fillStyle=rgba(col,0.75);ctx.fill();
  const ep=hp([8.2,-3.4]);bs_eye(ctx,ep[0],ep[1],1.65,col,bl);
  ctx.restore();}

/* ---------- snake: a heavy python-like snake in the grass, the front of its body raised, its head broader than its neck, tasting the air with a
   forked tongue (snakes have no eyelids: the eye stays open); its body lies along its own winding track and tapers to a fine tail. Options: t, crawl (seconds it has been gliding forward along that track), flip ---------- */
function bs_snkPath(){if(BS_CACHE.snk)return BS_CACHE.snk;const P=[];let x=0,y=0;for(let k=0;k<=400;k++){const th=1.05*Math.sin(k*2*TAU/74+0.6);P.push([x,y]);x+=2*Math.cos(th);y+=2*Math.sin(th)*0.62;}return BS_CACHE.snk=P;}
function snake(ctx,x,y,s,col,o){o=o||{};if(bs_layered(ctx,x,y,s,o,[-100,-40,150,32],(c,oo)=>snake(c,x,y,s,col,oo)))return;
  col=col||SNK;const t=o.t,live=t!=null;if(!bs_begin(ctx,x,y,s,o))return;
  const P=bs_snkPath(),L=150,h0=420+clamp(o.crawl||0,-4,40)*4.5,at=g=>{const k=clamp(g/2,0,P.length-1.001),i=Math.floor(k),f=k-i;return[P[i][0]+(P[i+1][0]-P[i][0])*f,P[i][1]+(P[i+1][1]-P[i][1])*f];};
  const H=at(420),N=36,sp=[],w=[],br=live?1+0.03*Math.sin(TAU*t/3.4):1,wob=live?0.9*Math.sin(TAU*t/5.2):0,nod=live?1.5*bs_drift(t,31,2.2):0;
  const k9=Math.round(N*0.86),p9=at(h0-0.86*L),p8=at(h0-0.84*L),g9=[p9[0]-p8[0],p9[1]-p8[1]];
  for(let k=0;k<=N;k++){const u=k/N,e=sstep(0.86,1,u);let p=at(h0-u*L);if(e>0){const q=[p9[0]+g9[0]*(u-0.86)/0.02,p9[1]+g9[1]*(u-0.86)/0.02*0.4];p=bs_mid(p,q,e);}
    const lift=u<0.24?Math.pow(1-u/0.24,2)*(12+nod):0;sp.push([p[0]-H[0]+66,p[1]-H[1]+4-lift+wob*Math.sin(u*9)*u*(1-e)]);
    w.push(Math.max(0.3,(u<0.08?3.3+u*18.75:u<0.4?4.8+(u-0.08)*8.4:u<0.7?7.5-(u-0.4)*3:0.3+6.3*Math.pow(1-(u-0.7)/0.3,1.25))*br));}
  const hd=sp[0],nk=sp[2],ang=Math.atan2(hd[1]-nk[1],hd[0]-nk[0])*0.5+(live?0.06*bs_drift(t,33,1.9):0),hp=p=>[hd[0]+p[0]*Math.cos(ang)-p[1]*Math.sin(ang),hd[1]+p[0]*Math.sin(ang)+p[1]*Math.cos(ang)];
  const head=[[-7.5,-3.6],[-2.5,-5.4],[3.5,-5.6],[9.5,-4.2],[14,-1.6],[14.8,0.9],[13,3.2],[6.5,4.9],[-1.5,5.6],[-7.5,3.8]].map(hp),box=[-40,-30,40,30];
  bs_form(ctx,c=>{bs_tube(c,sp.slice(1),w.slice(1));bs_loop(c,head);},col,bs_fill(ctx,col,0,box),1,2.5,9);
  // the pattern: irregular dark saddles across the back, each with a fine pale edge, smaller blotches low on the flank, the edge of the belly scales
  const sad=new Path2D();for(let k=4;k<N-4;k+=3){const j=k+Math.round(hash(k,44)-0.5),a=sp[j-1],b=sp[j+1],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,tx=dx/d,ty=dy/d,nx=-ty,ny=tx,ww=w[j],m=sp[j];
    const ln=ww*(0.45+0.25*hash(k,41)),dp=ww*(0.52+0.22*hash(k,42)),q=[];for(let i=0;i<7;i++){const a2=i/7*TAU,r=0.75+0.4*hash(k*7+i,43);q.push([m[0]+nx*ww*0.3+(tx*Math.cos(a2)*ln+nx*Math.sin(a2)*dp)*r,m[1]+ny*ww*0.3+(ty*Math.cos(a2)*ln+ny*Math.sin(a2)*dp)*r]);}
    bs_loop(sad,q);if(k+5<N-4&&hash(k,45)>0.3){const c=bs_mid(sp[j+1],sp[j+2]),r=ww*(0.2+0.12*hash(k,46)),q2=[];for(let i=0;i<5;i++){const a2=i/5*TAU;q2.push([c[0]-nx*ww*0.5+Math.cos(a2)*r*1.5*(0.8+0.4*hash(i,k)),c[1]-ny*ww*0.5+Math.sin(a2)*r]);}bs_loop(sad,q2);}}
  ctx.fillStyle=rgba(mix(col,[0,0,0],0.72),0.45);ctx.fill(sad);ctx.lineWidth=1/s;ctx.strokeStyle=rgba(col,0.34);ctx.stroke(sad);
  bs_lines(ctx,[bs_side(sp.slice(4,N-2),w.slice(4,N-2).map(v=>v*0.62),-1)],col,0.3,0.5,0.3);
  // brow ridge, mouth, eye
  bs_lines(ctx,[[hp([5,-3.9]),hp([8,-4.1]),hp([10.8,-3.2])],[hp([13.6,2.2]),hp([9,2.9]),hp([4.5,2.6])]],col,0.5,0.5,0.25);
  // the forked tongue, flicking now and then
  if(live){const P2=2.3,u=((t+0.7)%P2+P2)%P2;if(u<0.55){const e=Math.sin(Math.PI*u/0.55),f=Math.sin(u*TAU*5)*0.9,b=hp([14.4,1.2]),m=hp([14.4+6*e,1.2+f*0.6]),f1=hp([14.4+9.5*e,-0.5+f]),f2=hp([14.4+9.5*e,2.9+f]);
    bs_lines(ctx,[[b,m,f1],[m,f2]],mix(col,[255,120,140],0.55),0.95,0.7,0.3);}}
  const ep=hp([7.8,-2.2]);bs_eye(ctx,ep[0],ep[1],1.35,col,1);
  ctx.restore();}

/* ---------- bottlenose dolphin (Tursiops): a short thick rostrum, a rounded melon, a tall curved dorsal fin, long swept-back flippers, a
   narrow tail stock and horizontal flukes, seen almost edge-on, that beat up and down; a darker cape. Options: t (a slow swimming stroke, the
   body bobbing and bending with it) ---------- */
// along the body from the beak's tip (0) to the flukes' root (1): the depth above and below the midline
const BS_DOL=[[0,1.3,1.3],[0.03,2.7,2.6],[0.062,3.6,3.8],[0.09,8,5.6],[0.125,13.5,8.7],[0.17,17.5,12],[0.24,20.5,15.6],[0.34,22,18.2],[0.44,21.2,17.9],[0.52,19.4,16.4],
  [0.6,16.2,13.6],[0.68,12.2,10.4],[0.76,8.4,7.2],[0.84,5.4,4.6],[0.92,3.6,3],[1,2.7,2.3]];
function dolphin(ctx,x,y,s,col,o){o=o||{};if(bs_layered(ctx,x,y,s,o,o.flip?[-90,-48,104,50]:[-104,-48,90,50],(c,oo)=>dolphin(c,x,y,s,col,oo)))return;
  col=col||[120,210,255];const t=o.t,live=t!=null;if(!bs_begin(ctx,x,y,s,o))return;
  const ph=live?t*TAU/2.8:0.9,bob=live?1.6*Math.sin(ph+1.1):0,X=u=>80-158*u,C=u=>-4*Math.sin(Math.PI*u)+0.8+bob+(0.6+5.5*Math.pow(u,2.4))*Math.sin(ph-2.3*u);
  const top=BS_DOL.map(([u,a])=>[X(u),C(u)-a]),bot=BS_DOL.map(([u,a,b])=>[X(u),C(u)+b]).reverse(),R=[X(1)+0.5,C(1)],box=[-96,-32,82,34],fill=bs_fill(ctx,col,0,box,0.88);
  // the flukes: a thin blade behind the tail stock, tilting with the stroke; as it tilts we see a little more of it, and of the far fluke under it
  const st=Math.sin(ph-2.3),fa=-0.42*Math.cos(ph-2.3)-0.05,th=0.55+0.6*Math.abs(Math.cos(ph-2.3)),fp=p=>[R[0]+p[0]*Math.cos(fa)-p[1]*th*Math.sin(fa),R[1]+p[0]*Math.sin(fa)+p[1]*th*Math.cos(fa)];
  const flk=[[1,-2.4],[-5,-3.4],[-11.5,-4.6],[-17.5,-5],[-22,-3.8],[-20.4,-1.2],[-16.2,0.4],[-12.6,1],[-7,1.9],[1,2.2]].map(fp),flk2=[[-6,1.4],[-12,2.8],[-17.5,4.2],[-20,4.4],[-17.2,2.6],[-12,1.6]].map(fp);
  const tp=u=>{let k=0;while(k<BS_DOL.length-2&&BS_DOL[k+1][0]<u)k++;const a=BS_DOL[k],b=BS_DOL[k+1],f=(u-a[0])/(b[0]-a[0]);return[lerp(a[1],b[1],f),lerp(a[2],b[2],f)];},T=u=>C(u)-tp(u)[0];
  const dorsal=[[X(0.39),T(0.39)+1.5],[X(0.44),T(0.44)-6],[X(0.49),T(0.5)-13],[X(0.555),T(0.56)-17.5],[X(0.585),T(0.58)-16],[X(0.575),T(0.58)-9],[X(0.58),T(0.6)-3],[X(0.6),T(0.6)+1.5]];
  // the flippers: long, swept back about 35 degrees, hanging well below the belly; the stroke sways them a little
  const y0=C(0.23)+tp(0.23)[1]*0.35,sw=0.08*st,fl=(r,ln,wd)=>{const a=0.61+sw,d=[-Math.sin(a),Math.cos(a)],n=[Math.cos(a),Math.sin(a)],P=(u,v)=>[r[0]+d[0]*u+n[0]*v,r[1]+d[1]*u+n[1]*v];
    return[P(-2,wd),P(ln*0.42,wd*0.9),P(ln*0.8,wd*0.5),P(ln,-0.05*wd),P(ln*0.8,-0.62*wd),P(ln*0.4,-0.9*wd),P(-2,-wd)];};
  // the far flipper and the far fluke, behind
  bs_form(ctx,c=>{bs_loop(c,fl([X(0.25),y0+1.2],19,3.4));bs_loop(c,flk2);},col,bs_fill(ctx,col,0.6,box,0.9),0.4,2,0);
  // body, dorsal fin and flukes as one form; the near flipper lies over the flank
  bs_form(ctx,c=>{bs_loop(c,top.concat(flk.slice(1,9),bot));bs_loop(c,dorsal);},col,fill,1,2.6,9);
  const f0=fl([X(0.215),y0-1.5],25,4.2);bs_form(ctx,c=>bs_loop(c,f0),col,fill,0.9,2.3,0);
  // mouth line, melon crease, blowhole, the cape of the back, the flipper against the flank, the fluke's leading edge
  bs_lines(ctx,[[[X(0.012),C(0.012)+0.3],[X(0.05),C(0.05)+0.9],[X(0.085),C(0.085)+1.6],[X(0.105),C(0.105)+0.6]]],col,0.75,0.75,0.35);
  bs_lines(ctx,[[[X(0.066),C(0.066)-3.4],[X(0.075),C(0.075)-1.6]],[[X(0.165),T(0.165)+1.2],[X(0.178),T(0.178)+1]]],col,0.5,0.5,0.3);
  bs_lines(ctx,[[[X(0.13),C(0.13)-7],[X(0.2),C(0.2)-4.3],[X(0.32),C(0.32)-1.6],[X(0.46),C(0.46)+1.6],[X(0.62),C(0.62)+0.8],[X(0.76),C(0.76)-0.8],[X(0.88),C(0.88)-0.3]]],col,0.42,0.25,0.6);
  bs_lines(ctx,[[bs_mid(f0[0],f0[6],0.5),bs_mid(f0[1],f0[5],0.5),bs_mid(f0[2],f0[4],0.5)],[flk[1],flk[3],flk[4]]],col,0.45,0.2,0.5);
  bs_eye(ctx,X(0.118),C(0.118)-1.2,1.5,col,bs_blink(t,4));
  ctx.restore();}

/* ---------- African elephant (Loxodonta africana): great ears shaped like the continent, a high shoulder and a dipping back, pillar legs on broad
   flat soles with toenails, a long wrinkled trunk, tusks; options: t (the ear fans, the trunk sways and curls, the tail swishes, it blinks). With t,
   the body and legs, which don't move, are drawn once and kept ---------- */
function elephant(ctx,x,y,s,col,o){o=o||{};if(bs_layered(ctx,x,y,s,o,o.flip?[-82,-62,76,46]:[-76,-62,82,46],(c,oo)=>elephant(c,x,y,s,col,oo)))return;
  col=col||[190,200,220];const t=o.t,live=t!=null;if(!bs_begin(ctx,x,y,s,o))return;
  const ef=live?0.5-0.5*Math.cos(TAU*t/4.6):0.3,bl=bs_blink(t,6),box=[-64,-56,64,42],fill=bs_fill(ctx,col,0,box,0.9);
  const trunk=bs_bend([[57,-26],[61.5,-12],[63,3],[62,17],[63,28],[66.5,35],[71,34]],live?0.16:0.1,live?TAU*t/5.3:1,0.7),tw=[7.4,6.1,5.1,4.3,3.7,3.2,2.7];
  const tail=bs_bend([[-60,-25],[-65,-12],[-66.5,1],[-66,9]],live?0.28:0.15,live?TAU*t/3.1:1,0.9);
  // the tail and the trunk, under the body and head (their roots hide there)
  bs_form(ctx,c=>{bs_tube(c,tail,[1.8,1.4,1.15,1]);bs_loop(c,[[tail[3][0]-1.6,tail[3][1]-1],[tail[3][0]+1.8,tail[3][1]-0.6],[tail[3][0]+1.3,tail[3][1]+4.6],[tail[3][0]-0.9,tail[3][1]+5.4]]);bs_tube(c,trunk,tw);},col,fill,1,2.6,6);
  const wr=[];for(let k=2;k<trunk.length-1;k++)for(const f of [0.15,0.45,0.75]){const a=bs_mid(trunk[k-1],trunk[k],f),b=trunk[k],dx=b[0]-trunk[k-1][0],dy=b[1]-trunk[k-1][1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,ww=lerp(tw[k-1],tw[k],f)*0.82;
    wr.push([[a[0]+nx*ww,a[1]+ny*ww],[a[0]+dx/d*0.9,a[1]+dy/d*0.9],[a[0]-nx*ww*0.55,a[1]-ny*ww*0.55]]);}
  bs_lines(ctx,wr,col,0.38,0.5,0.2);
  // body, legs, head and tusk: still, so drawn once
  const draw=live&&!o.bs_nostill?(c,fn)=>bs_still(c,"ele"+col.join(),[-72,-58,76,43],fn):(c,fn)=>fn(c);
  draw(ctx,g=>bs_eleBody(g,col,box));
  // the ear, fanning out from the side of the head, and its veins
  ctx.save();ctx.translate(35,0);ctx.scale(1-0.16*ef,1);ctx.rotate(-0.03*ef);ctx.translate(-35,0);
  bs_form(ctx,c=>bs_loop(c,[[35,-51],[24,-57.5],[9,-55.5],[-1,-47],[-3.5,-32],[0.5,-18],[6.5,-6],[12.5,7.5],[18.5,1.5],[25,-9],[31,-20],[35,-36]]),col,bs_fill(ctx,col,0,[-10,-58,40,8],0.9),1,2.6,7);
  bs_lines(ctx,[[[31,-46],[22,-44],[12,-40],[6,-30]],[[30,-34],[20,-28],[12,-16],[13,-2]],[[22,-44],[17,-34],[10,-26]],[[24,-50],[14,-51],[5,-46]]],col,0.34,0.5,0.2);
  bs_lines(ctx,[[[34,-48],[33,-34],[30,-22],[24,-9]]],col,0.5,0.8,0.3);
  ctx.restore();
  // eye, with its fold, and the mouth under the trunk
  bs_eye(ctx,50.5,-34,1.45,col,bl);bs_lines(ctx,[[[46.5,-37.5],[50.5,-38.8],[54,-37]],[[56,-14],[52,-13],[48,-14]]],col,0.5,0.5,0.25);
  ctx.restore();}
// the still part: far legs; body (high shoulder, dipping back, rounded rump, the belly sagging a little), near legs on broad flat soles, the head;
// the tusk; wrinkles at the knees and ankles, folds on the shoulder, behind the elbow and on the belly; toenails
function bs_eleBody(ctx,col,box){
  const leg=(c,p,w,fx)=>{bs_tube(c,p,w);bs_loop(c,[[fx-8.8,31.5],[fx+8.8,31.5],[fx+10.6,37.2],[fx+9.8,40],[fx-9.8,40],[fx-10.6,37.2]]);};
  const legs=[[[18,-12],[20,8],[21,20],[21.3,30.5]],[[-44,-14],[-42,8],[-43.5,20],[-43,30.5]]],lw=[[12,9.4,8.6,9.6],[13,9.8,8.6,9.6]];
  bs_form(ctx,c=>{leg(c,[[8,-10],[9,10],[10,21],[9.8,30]],[10,8.2,7.6,8.6],9.8);leg(c,[[-52,-12],[-51,10],[-53,21],[-52.2,30]],[11,8.4,7.6,8.6],-52.2);},col,bs_fill(ctx,col,0.6,box,0.95),0.4,2.2,0);
  const body=[[-62,-12],[-60,-28],[-50,-41],[-32,-44],[-14,-41],[2,-45],[16,-50],[28,-49],[37,-43],[40,-12],[32,3],[20,8.5],[4,11.5],[-12,11.5],[-32,7],[-50,2],[-60,-4]];
  const head=[[30,-50],[40,-54],[50,-51],[56.5,-42],[59.5,-32],[60,-22],[55,-13],[45,-12],[37,-17],[32,-32]];
  bs_form(ctx,c=>{bs_loop(c,body);legs.forEach((p,k)=>leg(c,p,lw[k],p[3][0]));bs_loop(c,head);},col,bs_fill(ctx,col,0,box,0.9),1,2.6,10);
  ctx.beginPath();bs_tube(ctx,[[55,-16],[59.5,-9],[65.5,-5],[71,-6.5]],[2.3,2.1,1.6,0.5]);glow(ctx,64,-7,7,col,0.25);ctx.fillStyle=rgba(mix(col,[255,248,230],0.7),0.95);ctx.fill();
  const wr=[];legs.forEach(p=>{const a=bs_mid(p[1],p[2],0.7),b=bs_mid(p[2],p[3],0.55);wr.push([[a[0]-6.5,a[1]+0.5],[a[0],a[1]+1.3],[a[0]+6,a[1]+0.3]],[[a[0]-5.5,a[1]+3.2],[a[0],a[1]+3.8],[a[0]+5,a[1]+3]],[[b[0]-6.5,b[1]],[b[0],b[1]+0.8],[b[0]+6,b[1]+0.2]]);});
  wr.push([[-4,-34],[-2,-22],[-5,-10]],[[-18,8.5],[-8,7],[4,8]],[[34,-40],[35,-30],[33,-20]],[[28,-3],[25,2.5],[24.5,8]],[[-36,-2],[-38,4]]);
  bs_lines(ctx,wr,col,0.38,0.55,0.2);
  ctx.beginPath();legs.forEach(p=>{const f=p[3][0];for(let k=0;k<3;k++){const nx=f+0.5+k*3.6,r=1.5+0.2*k;ctx.moveTo(nx+r,39);ctx.arc(nx,39,r,0,Math.PI,true);}});ctx.lineWidth=0.9/BS_ST.s;ctx.strokeStyle=rgba(col,0.45);ctx.stroke();}

/* ---------- common marmoset (Callithrix jacchus): a small monkey hunched on a branch, its head (a little wider than tall, sunk into the
   shoulders) turned toward us: a dark brown face with paler rings round the eyes, a white blaze on the forehead, fans of white fur round the ears;
   a grizzled, barred back; a long tail ringed pale and dark; claws gripping the branch. Options: t (breath, a head that tilts and turns, blinks,
   the ear tufts stirring, the tail swaying) ---------- */
function marmoset(ctx,x,y,s,col,o){o=o||{};if(bs_layered(ctx,x,y,s,o,[-80,-50,80,62],(c,oo)=>marmoset(c,x,y,s,col,oo)))return;
  col=col||[230,210,180];const t=o.t,live=t!=null;if(!bs_begin(ctx,x,y,s,o))return;
  const Z=1.16;ctx.translate(0,40);ctx.scale(Z,Z);ctx.translate(0,-40);BS_ST.s=s*Z;
  const br=live?1+0.04*Math.sin(TAU*t/2.6):1,tilt=live?0.16*bs_drift(t,51,1.9):0.06,turn=live?0.5+0.5*bs_drift(t,53,2.6):0.5,bl=bs_blink(t,9),box=[-40,-40,40,50],fill=bs_fill(ctx,col,0,box,0.85);
  // the branch, with a twig: still
  const brn=c=>bs_form(c,g=>{bs_tube(g,[[-66,45],[-36,41.5],[-6,40.5],[26,42],[62,39.5]],[2.6,3.6,4,3.6,2.8]);bs_tube(g,[[34,41.5],[44,34],[50,31]],[2,1.4,0.9]);},col,bs_fill(c,col,0.5,box),0.4,2,0);
  if(live&&!o.bs_in)bs_still(ctx,"mbr"+col.join(),[-70,28,66,50],brn);else brn(ctx);
  const tl=bs_bend([[-11,32],[-17,40.5],[-25,46.5],[-35,50],[-45.5,50.5],[-54.5,47.5],[-59.5,41.5],[-58,35.5]],live?0.08:0.04,live?TAU*t/3.7:0.5,0.8),tw=[3.4,3.3,3.2,3.1,3,2.8,2.5,2.1];
  const P=[-6,31],M=[-11,16],S=[-2,1],N=[3,-3],leg=[P,[10,23],[4.5,35.5],[11.5,38.5]],arm=[[S[0]+1,S[1]+2],[5,16],[11.5,32.5],[15.5,37.5]],aw=[4.4,3.3,2.3,2.2];
  const H=[8.5,-12],hp=bs_rot(H,tilt),fx=(turn-0.5)*2.4;
  const skull=[[-10.8,1.5],[-10,-4.6],[-6.2,-8.3],[0,-9],[6.2,-8.3],[10,-4.6],[10.8,1.5],[8.6,5.8],[4.4,8.4],[1.4+fx*0.3,10.2],[-1.4+fx*0.3,10.2],[-4.4,8.4],[-8.6,5.8]].map(hp);
  // the white fans of fur round the ears, behind the head, stirring a little
  const tu=live?0.07*Math.sin(TAU*t/2.2):0,wh=mix(col,[255,255,255],0.72),fan=sd=>{const q=[[7.6,-6.8],[11.6,-12.2],[14+tu*16,-14.6],[16.2,-12.8],[18.6,-12.4+tu*10],[19.4,-9.4],[21,-7],[20.4,-4.2+tu*6],[21,-1.2],[18.8,1.2],[17.6,3.6],[14.2,3],[10,3.4]].map(p=>hp([sd*(p[0]+(sd>0?fx:-fx)*0.3),p[1]]));return q;};
  for(const sd of [-1,1]){const q=fan(sd);ctx.beginPath();bs_loop(ctx,q);ctx.fillStyle=rgba(wh,0.7);ctx.fill();
    const c0=hp([sd*9,-2]),L=[];for(let k=0;k<4;k++){const a=-1.1+k*0.62,r=8.5+2*Math.sin(k*1.7);L.push([c0,[c0[0]+sd*Math.cos(a)*r*0.55,c0[1]+Math.sin(a)*r*0.55],[c0[0]+sd*Math.cos(a)*r,c0[1]+Math.sin(a)*r]]);}bs_lines(ctx,L,wh,0.9,0.35,0.12);}
  // the far arm and leg, behind
  bs_form(ctx,c=>{bs_tube(c,[[S[0]+3,S[1]+3],[12,17],[18,34],[21,38.5]],[4,2.9,2.1,2]);bs_tube(c,[P,[12.5,26],[8,36.5],[15,39.5]],[7,4,2.3,2]);},col,bs_fill(ctx,col,0.6,box),0.4,2,0);
  // body, head, near limbs and the tail, as one form
  bs_form(ctx,c=>{bs_torso(c,[P,M,S,N],[10*br,8.5*br,7,5.5],[9*br,9*br,8,6],6,3);bs_loop(c,skull);bs_tube(c,leg,[7.5,4.4,2.6,2.1]);bs_tube(c,arm,aw);bs_tube(c,tl,tw);},col,fill,1,2.4,8);
  // pale rings round the dark tail, bars across the back, the arm and thigh against the body, claws over the branch
  const bands=[];for(let k=0;k<tl.length-1;k++)for(const f of [0.2,0.7]){const a=bs_mid(tl[k],tl[k+1],f),dx=tl[k+1][0]-tl[k][0],dy=tl[k+1][1]-tl[k][1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,ww=lerp(tw[k],tw[k+1],f)*0.88;
    bands.push([[a[0]+nx*ww,a[1]+ny*ww],[a[0]+dx/d*0.7,a[1]+dy/d*0.7],[a[0]-nx*ww,a[1]-ny*ww]]);}
  bs_lines(ctx,bands,wh,0.62,1.05,0.8);
  const bars=[];for(let k=0;k<5;k++){const a=bs_mid(P,M,0.12+k*0.2),dx=M[0]-P[0],dy=M[1]-P[1],d=Math.hypot(dx,dy),nx=dy/d,ny=-dx/d;bars.push([[a[0]+nx*9,a[1]+ny*9],[a[0]+nx*5+dx/d,a[1]+ny*5+dy/d],[a[0]+nx*1.5,a[1]+ny*1.5]]);}
  bs_lines(ctx,bars,mix(col,[255,255,255],0.25),0.42,0.6,0.2);
  const lt=bs_side(leg,[7.5,4.4,2.6,2.1],-1),ab=bs_side(arm,aw,1);bs_lines(ctx,[[bs_mid(lt[0],lt[1],0.4),lt[1]],[bs_mid(ab[0],ab[1],0.35),ab[1],bs_mid(ab[1],ab[2],0.5)],
    [[16.5,37.8],[18,39.6],[17.4,41.6]],[[12.6,38.9],[13.8,40.8],[13,42.4]]],col,0.5,0.3,0.25);
  // the face: dark brown, paler round the eyes, a white blaze above, a small dark muzzle with its nostrils
  ctx.beginPath();bs_loop(ctx,[[-7.4+fx,-2.6],[-3.6+fx,-5.2],[0+fx,-4.4],[3.6+fx,-5.2],[7.4+fx,-2.6],[7.8+fx,2.2],[4.6+fx,6.8],[0+fx,8.6],[-4.6+fx,6.8],[-7.8+fx,2.2]].map(hp));ctx.fillStyle="rgba(24,16,12,0.8)";ctx.fill();
  ctx.beginPath();for(const sd of [-1,1]){const e=hp([sd*3.5+fx,-1.2]);ctx.moveTo(e[0]+2.5,e[1]);ctx.arc(e[0],e[1],2.5,0,TAU);}ctx.fillStyle=rgba(mix(col,[120,90,60],0.4),0.26);ctx.fill();
  ctx.beginPath();bs_loop(ctx,[[0+fx*0.8,-8.6],[1.4+fx*0.8,-6.4],[0.9+fx*0.9,-3.6],[0+fx,-2.8],[-0.9+fx*0.9,-3.6],[-1.4+fx*0.8,-6.4]].map(hp));ctx.fillStyle=rgba(wh,0.92);ctx.fill();
  ctx.beginPath();bs_loop(ctx,[[-2.2+fx,3.2],[2.2+fx,3.2],[1.6+fx,5.6],[-1.6+fx,5.6]].map(hp));ctx.fillStyle="rgba(8,6,6,0.75)";ctx.fill();
  ctx.beginPath();for(const sd of [-1,1]){const n=hp([sd*0.8+fx,3.9]);ctx.moveTo(n[0]+0.45,n[1]);ctx.arc(n[0],n[1],0.45,0,TAU);}ctx.fillStyle=rgba(col,0.55);ctx.fill();
  for(const sd of [-1,1]){const e=hp([sd*3.5+fx,-1.2]);bs_eye(ctx,e[0],e[1],1.1,col,bl);}
  ctx.restore();}
/* ---------- European rabbit (Oryctolagus cuniculus): options.run 0 sits alert, 1 runs a half-bound (the hind feet land together ahead of the
   front feet's prints, the back rounds and stretches, the ears lie back, the white scut shows); in between it lollops. options.dist, the px it
   has travelled, keeps its feet in step with the ground (it gets up from sitting over its first stride); without it the gait keeps time with t ---------- */
const BS_RB={S:96,hd:0.36,fd:0.3,fo:0.44,hl:4,fl:34,f0:1.44};
// hip and shoulder joints, the back's arch, the neck (the head's centre from the shoulder), the head's tilt, the ears (tilt back; the far one's
// spread forward), the tail cocked
const BS_RB_SIT={H:[-10,6],S:[14,-4],ar:8,nk:[15,-17],ha:0.3,ea:0.16,es:0.42,tu:0};
const BS_RB_RUN=[ // phase 0: the hind feet land
  [0,   {H:[-6,-1], S:[16,-6], ar:7, nk:[15,-15],ha:0.42,ea:0.72,es:0.3,tu:1}],
  [0.18,{H:[-8,-8], S:[21,-10],ar:3, nk:[15,-15],ha:0.38,ea:0.78,es:0.3,tu:1}],
  [0.36,{H:[-9,-14],S:[25,-13],ar:-1,nk:[14,-14],ha:0.32,ea:0.84,es:0.3,tu:1}],
  [0.43,{H:[-10,-16],S:[25,-12],ar:-1,nk:[14,-14],ha:0.36,ea:0.82,es:0.3,tu:1}],
  [0.52,{H:[-10,-13],S:[23,-8], ar:1, nk:[15,-15],ha:0.44,ea:0.78,es:0.3,tu:1}],
  [0.66,{H:[-8,-8], S:[20,-6], ar:4, nk:[15,-16],ha:0.48,ea:0.74,es:0.3,tu:1}],
  [0.78,{H:[-6,-7], S:[18,-8], ar:6, nk:[15,-16],ha:0.46,ea:0.72,es:0.3,tu:1}],
  [0.89,{H:[-6,-8], S:[17,-10],ar:8, nk:[15,-16],ha:0.44,ea:0.72,es:0.3,tu:1}]];
// a foot through one cycle (ph from its touchdown): planted for d of it and sliding back at the ground's speed, then a swing that trails, swings
// through, reaches and settles back; returns [x, y, stance progress (0..1) or swing progress (-1..0)]
function bs_rbFoot(ph,d,land,h){ph-=Math.floor(ph);const S=BS_RB.S;if(ph<d)return[land-S*ph,24,ph/d];const u=(ph-d)/(1-d),lift=land-S*d,B=S*(1-d)/Math.PI,sn=Math.sin(Math.PI*u);
  return[lift+(land-lift)*u*u*(3-2*u)-B*sn*(1-u)*(1-u)+B*sn*u*u,24-h*sn,-Math.max(1e-4,u)];}
const BS_RB_HA=[[0,2.05],[0.25,2.45],[0.45,2],[0.65,0.9],[0.85,0.3],[1,0.1]],BS_RB_FA=[[0,1.9],[0.2,2.3],[0.5,1.75],[0.8,0.55],[1,0.2]];
function rabbit(ctx,x,y,s,col,t,o){o=o||{};if(bs_layered(ctx,x,y,s,o,[-56,-80,62,32],(c,oo)=>rabbit(c,x,y,s,col,t,oo)))return;
  col=col||[230,220,200];const R=BS_RB,tt=t||0,live=t!=null,hasD=o.dist!=null;let run=clamp(o.run==null?1:o.run,0,1);if(hasD)run*=sstep(0,0.4*R.S*s,o.dist);
  if(!bs_begin(ctx,x,y,s,o))return;
  const ph=hasD?o.dist/(R.S*s):tt*R.f0+0.05,q=run>0?bs_blend(BS_RB_SIT,bs_gait(BS_RB_RUN,ph),run):BS_RB_SIT;
  const sniff=live?(1-run)*Math.max(0,Math.sin(TAU*tt*2.4))*Math.max(0,bs_drift(tt,63,1.3)):0,ew=live?0.07*bs_drift(tt,61,1.6)*(1-run)+0.05*Math.sin(TAU*(ph-0.15))*run:0,bl=bs_blink(live?tt:null,14);
  const br=live?(1-run)*0.6*Math.sin(TAU*tt/1.7):0;
  const H=q.H,S=q.S,th=Math.atan2(S[1]-H[1],S[0]-H[0]),L=Math.hypot(S[0]-H[0],S[1]-H[1]),lp=bs_rot(H,th),ar=q.ar;
  // the body: a round haunch behind, a deep chest in front, the back rounded (more when it bunches)
  const torso=[[-3,15+br*0.3],[-13,8],[-15.5,-2],[-10,-10.5-br*0.3],[L*0.36,-12.5-ar-br],[L*0.72,-12-ar*0.5-br*0.6],[L+2,-9.5],[L+7.5,-3],[L+8,5],[L+2,11],[L*0.55,12.5-ar*0.2+br*0.5],[L*0.18,15.5]].map(lp);
  // the head: a blunt muzzle, a rounded brow, the cheek full; the neck is part of the body
  const Hd=[S[0]+q.nk[0],S[1]+q.nk[1]],hp=bs_rot(Hd,q.ha),head=[[-10.5,0],[-8,-6.5],[-1.5,-9],[5,-8],[10.5,-5.2],[13.8,-1.6],[14.3,1.4],[12.6,3.8],[8.5,6.6],[1,8.4],[-6,7]].map(hp);
  const neck=[lp([L-4,-4]),bs_mid(lp([L-2,-6]),hp([-5,3]),0.5),hp([-4,3])];
  // the ears, from the top of the head: long (a little longer than the head), rounded at the tips; they tilt back as it runs
  const ear=(b,e,ln)=>{const B=hp(b),dx=-Math.sin(e),dy=-Math.cos(e),bw=0.2;return[B,[B[0]+dx*ln*0.3-dy*bw,B[1]+dy*ln*0.3+dx*bw],[B[0]+dx*ln*0.68-dy*1.2,B[1]+dy*ln*0.68+dx*1.2],[B[0]+dx*ln,B[1]+dy*ln]];},ewd=[2.8,4.7,4.6,2.8];
  const eN=ear([-3,-7.8],q.ea+ew,30),eF=ear([0.5,-8.5],q.ea-q.es-ew*0.6,29);
  // legs: the sitting pose's and the gait's, blended
  const hSit=dx=>[[1+dx,24],0.04],fSit=dx=>[[S[0]+8+dx,24],0.12];
  const hRun=k=>{const f=bs_rbFoot(ph-k*0.035,R.hd,R.hl+k*2,9);return[[f[0],f[1]],f[2]>=0?lerp(0.1,2.05,sstep(0.3,1,f[2])):bs_curve(BS_RB_HA,-f[2])];};
  const fRun=k=>{const f=bs_rbFoot(ph-R.fo-k*0.05,R.fd,R.fl+k*2.5,9);return[[f[0],f[1]],f[2]>=0?lerp(0.2,1.9,sstep(0.35,1,f[2])):bs_curve(BS_RB_FA,-f[2])];};
  const mixL=(a,b)=>run<=0?a:run>=1?b:[bs_mid(a[0],b[0],run),lerp(a[1],b[1],run)];
  const hindLeg=(root,f)=>{const T=f[0],J=[T[0]-15*Math.cos(f[1]),T[1]-15*Math.sin(f[1])],K=bs_ik(root,J,15,18,-1);return[root,K,J,T];};
  const foreLeg=(root,f)=>{const P=f[0],W=[P[0]-6*Math.cos(f[1]),P[1]-6*Math.sin(f[1])],E=bs_ik(root,W,11,13,1);return[root,E,W,P];};
  const hN=hindLeg(lp([0,3]),mixL(hSit(0),hRun(0))),hF=hindLeg(lp([2,2]),mixL(hSit(4),hRun(1))),fN=foreLeg(lp([L-3,7]),mixL(fSit(0),fRun(0))),fF=foreLeg(lp([L-1,6]),mixL(fSit(4),fRun(1)));
  const hw=[12.5,6.4,3,2.5],fw=[5.4,3.4,2.5,2.4],box=[-40,-40,40,30];
  // the far legs and far ear, darker, behind
  bs_form(ctx,c=>{bs_tube(c,hF,[9,5.4,2.6,2.2]);bs_tube(c,fF,[4.6,3,2.2,2.2]);bs_tube(c,eF,ewd);},col,bs_fill(ctx,col,0.6,box),0.4,2.2,0);
  // body, neck, head, near ear and near legs, as one form
  bs_form(ctx,c=>{bs_loop(c,torso);bs_tube(c,neck,[8.5,8,7]);bs_loop(c,head);bs_tube(c,eN,ewd);bs_tube(c,hN,hw);bs_tube(c,fN,fw);},col,bs_fill(ctx,col,0,box),1,2.6,9);
  // the white scut: a soft puff over the rump
  const sc=lp([-13.5,-2-3.5*q.tu]),sr=2.8+1.4*q.tu,puff=[];for(let k=0;k<7;k++){const a=k/7*TAU+0.3,r=sr*(0.82+0.3*hash(k,71));puff.push([sc[0]+r*Math.cos(a),sc[1]+r*Math.sin(a)]);}
  glow(ctx,sc[0],sc[1],sr*2.2,col,0.18*q.tu);ctx.beginPath();bs_loop(ctx,puff);ctx.fillStyle=rgba(mix(col,[255,255,255],0.3+0.3*q.tu),0.8+0.15*q.tu);ctx.fill();
  // the haunch and the near foreleg against the body, the ear's inner edge, the cheek
  const th2=bs_side(hN,hw,-1),fr=bs_side(fN,fw,1);
  bs_lines(ctx,[[bs_mid(th2[0],th2[1],0.25),bs_mid(th2[0],th2[1],0.7),th2[1]],[bs_mid(fr[0],fr[1],0.35),fr[1],bs_mid(fr[1],fr[2],0.5)],[bs_mid(eN[0],eN[1],0.7),eN[1],eN[2],bs_mid(eN[2],eN[3],0.55)],
    [hp([-3.5,6.6]),hp([-6,2.2]),hp([-4.8,-2.4])]],col,0.45,0.25,0.7);
  // nose, mouth, whiskers, eye
  const n0=hp([14,0.4+sniff*0.5]);bs_lines(ctx,[[hp([13.4,-0.8]),n0,hp([12.6,2.4])],[hp([12.8,2.6]),hp([10.4,4.4]),hp([8,4.6])]],col,0.6,0.5,0.3);
  bs_lines(ctx,[[hp([11.5,1.6]),hp([16.5,0.4+sniff]),hp([21,0+sniff])],[hp([11.5,2.2]),hp([16.5,3]),hp([20.5,4.4])]],col,0.22,0.3,0.12);
  const ep=hp([2,-2.6]);bs_eye(ctx,ep[0],ep[1],1.6,col,bl);
  ctx.restore();}

/* ===== What's in a word: the birds =====
   The pigeons that sorted photos, a honeybee, the eagle the vervets fear, and the birds of the category "bird": a robin, a sparrow, a penguin and an ostrich.
   They keep icon()'s look (a dark body lit from the upper left, a glowing rim in the colour that carries the meaning, fine inner details
   and a small bright eye), but their shapes come from their anatomy: smooth contours, tapering legs and toes, feathers that overlap,
   a darker far leg behind the body. options.a fades one; options.t (seconds) brings it to life: breath, blinks, a head that tilts and turns,
   a tail that flicks, wings that beat. Every pose is a function of t and the options, so any frame draws alone.
   A blur is the costliest thing a canvas draws, so a bird's soft glow is blurred once into a sprite (kept by what the bird is, its pose
   and how big it is on screen) and drawn under it: the eagle's for each heading it soars at, the pigeon's wings' for each moment of a wingbeat,
   two neighbours blended so the glow moves smoothly. */

/* ---------- the drawing kit ---------- */
const BD_INK=[20,26,40],BD_S={f:1,s:1},BD_LAY={c:null,x:null},BD_GL=new Map(),BD_GR=new Map();
// a smooth closed curve through points (Catmull-Rom, as beziers); a point [x,y,1] is a sharp corner (a bill tip, a feather tip)
function bd_loop(c,p){const n=p.length;c.moveTo(p[0][0],p[0][1]);
  for(let i=0;i<n;i++){const a=p[(i+n-1)%n],b=p[i],d=p[(i+1)%n],e=p[(i+2)%n],kb=b[2]?0:1/6,kd=d[2]?0:1/6;
    c.bezierCurveTo(b[0]+(d[0]-a[0])*kb,b[1]+(d[1]-a[1])*kb,d[0]-(e[0]-b[0])*kd,d[1]-(e[1]-b[1])*kd,d[0],d[1]);}c.closePath();}
// a stretch of the closed curve bd_loop draws through p: its segments from point i0 to point i1 (indices past the end wrap round), as an open path
function bd_seg(c,p,i0,i1){const n=p.length,P=i=>p[((i%n)+n)%n];c.moveTo(P(i0)[0],P(i0)[1]);
  for(let i=i0;i<i1;i++){const a=P(i-1),b=P(i),d=P(i+1),e=P(i+2),kb=b[2]?0:1/6,kd=d[2]?0:1/6;
    c.bezierCurveTo(b[0]+(d[0]-a[0])*kb,b[1]+(d[1]-a[1])*kb,d[0]-(e[0]-b[0])*kd,d[1]-(e[1]-b[1])*kd,d[0],d[1]);}}
// a smooth open curve through points; m===false carries on the current subpath
function bd_path(c,p,m){const n=p.length;if(m===false)c.lineTo(p[0][0],p[0][1]);else c.moveTo(p[0][0],p[0][1]);
  for(let i=0;i<n-1;i++){const a=p[i?i-1:0],b=p[i],d=p[i+1],e=p[i+2<n?i+2:n-1],kb=b[2]?0:1/6,kd=d[2]?0:1/6;
    c.bezierCurveTo(b[0]+(d[0]-a[0])*kb,b[1]+(d[1]-a[1])*kb,d[0]-(e[0]-b[0])*kd,d[1]-(e[1]-b[1])*kd,d[0],d[1]);}}
// a tube along points p with half-widths w, rounded at both ends: legs, toes, necks, feather lines
function bd_tube(c,p,w){const n=p.length,L=[],R=[];let a0=0,a1=0;for(let i=0;i<n;i++){const a=p[i?i-1:0],b=p[i<n-1?i+1:n-1];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
    const r=Math.max(0.02,w[i]);L.push([p[i][0]-dy*r,p[i][1]+dx*r]);R.push([p[i][0]+dy*r,p[i][1]-dx*r]);if(!i)a0=Math.atan2(dy,dx);if(i===n-1)a1=Math.atan2(dy,dx);}
  bd_path(c,L);c.arc(p[n-1][0],p[n-1][1],Math.max(0.02,w[n-1]),a1+Math.PI/2,a1-Math.PI/2,true);bd_path(c,R.reverse(),false);c.arc(p[0][0],p[0][1],Math.max(0.02,w[0]),a0-Math.PI/2,a0+Math.PI/2,true);c.closePath();}
function bd_taper(c,p,w0,w1){const n=p.length,w=[];for(let i=0;i<n;i++)w.push(lerp(w0,w1,n>1?i/(n-1):0));bd_tube(c,p,w);}
// points turned by a about (px,py), then moved by (dx,dy); corner flags kept
function bd_rot(p,px,py,a,dx,dy){const c=Math.cos(a),s=Math.sin(a);dx=dx||0;dy=dy||0;return p.map(q=>{const x=q[0]-px,y=q[1]-py,r=[px+x*c-y*s+dx,py+x*s+y*c+dy];if(q[2])r.push(q[2]);return r;});}
const bd_mv=(p,dx,dy)=>p.map(q=>q[2]?[q[0]+dx,q[1]+dy,q[2]]:[q[0]+dx,q[1]+dy]);
// a gradient made once and kept (its coordinates are in the bird's own units, so it serves every frame)
function bd_g(ctx,key,make){let g=BD_GR.get(key);if(!g){g=make(ctx);if(BD_GR.size>300)BD_GR.clear();BD_GR.set(key,g);}return g;}
function bd_lin(ctx,key,x0,y0,x1,y1,stops){return bd_g(ctx,key,c=>{const g=c.createLinearGradient(x0,y0,x1,y1);stops.forEach(s=>g.addColorStop(s[0],s[1]));return g;});}
function bd_rad(ctx,key,x,y,r,stops){return bd_g(ctx,key,c=>{const g=c.createRadialGradient(x,y,0,x,y,r);stops.forEach(s=>g.addColorStop(s[0],s[1]));return g;});}
// the dark fill of a bird, lit from the upper left of the screen whichever way it faces; k darkens it (a far leg, a far wing)
function bd_fill(ctx,col,k,b){k=k||0;return bd_g(ctx,"f"+col+"|"+k+"|"+b+"|"+BD_S.f,c=>{const g=c.createLinearGradient(b[0]*BD_S.f,b[1],b[2]*BD_S.f,b[3]);
  g.addColorStop(0,rgba(mix(mix(col,BD_INK,0.55),[6,9,16],k),0.97));g.addColorStop(1,rgba(mix([8,12,22],[3,5,10],k),0.97));return g;});}
// one form, from its outline (points of a closed smooth curve): its rim in col, thin where the light falls (upper left) and thicker in shadow,
// made as two fills, the outline in col and then its body inset from it (a wide stroke costs a canvas several times more)
function bd_formP(ctx,p,col,fill,lw,ra){const s=BD_S.s,n=p.length,w=(lw||2.2)/s,lx=0.6*BD_S.f,ins=[];ra=ra==null?1:ra;let A=0;
  for(let i=0;i<n;i++){const a=p[i],b=p[(i+1)%n];A+=a[0]*b[1]-b[0]*a[1];}const sg=A>0?1:-1;
  for(let i=0;i<n;i++){const a=p[(i+n-1)%n],b=p[(i+1)%n];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1,nx=sg*dy/d,ny=-sg*dx/d,k=w*(0.3+0.75*Math.max(0,nx*lx+ny*0.8));
    const kk=p[i][3]==null?k:k*p[i][3],q=[p[i][0]-nx*kk,p[i][1]-ny*kk];if(p[i][2])q.push(1);ins.push(q);}
  if(ra>0.01){ctx.beginPath();bd_loop(ctx,p);ctx.fillStyle=rgba(col,ra);ctx.fill();}
  if(fill){ctx.beginPath();bd_loop(ctx,ra>0.01?ins:p);ctx.fillStyle=fill;ctx.fill();}}
// a bird's glow: its outlines (builds, in its own units, within box, or a function giving it) stroked once with a blur onto a sprite, kept by key and by its size on
// screen, and drawn under the bird (al: how much). Drawn with the bird's transform, it follows the bird wherever it goes.
function bd_glow(ctx,key,box,builds,col,lw,al,soft){const m=ctx.getTransform(),ds=Math.hypot(m.c,m.d);if(!(ds>0.02)||al<=0.01)return;
  const q=Math.max(0.02,Math.round(ds*24)/24),k=key+"|"+q+"|"+BD_S.s.toFixed(2)+"|"+col;let G=BD_GL.get(k);
  if(!G){if(typeof box==="function")box=box();const x0=box[0]-22/q,y0=box[1]-22/q,W=Math.max(2,Math.ceil((box[2]-box[0])*q+44)),Hh=Math.max(2,Math.ceil((box[3]-box[1])*q+44)),cv=mkCanvas(W,Hh),g=cv.getContext("2d");
    const off=soft?W+64:0;g.setTransform(q,0,0,q,-x0*q+0.5-off,-y0*q+0.7);g.lineJoin="round";g.beginPath();builds.forEach(b=>b(g));g.lineWidth=(lw||2.2)*1.3/BD_S.s;
    // (soft: only the blur, no line at its heart, for a bird whose pose strays from the sprite's: a halo that's a pixel or two off shows no seam)
    if(soft){g.shadowOffsetX=off;g.strokeStyle=rgba(col,1);g.shadowColor=rgba(col,0.5);g.shadowBlur=5;g.stroke();g.shadowColor=rgba(col,0.6);g.shadowBlur=13;g.stroke();}
    else{g.strokeStyle=rgba(col,0.5);g.shadowColor=rgba(col,0.85);g.shadowBlur=11;g.stroke();}G={cv,x0,y0,w:W/q,h:Hh/q};if(BD_GL.size>240)BD_GL.delete(BD_GL.keys().next().value);BD_GL.set(k,G);}
  // (sampled nearest while it lands pixel for pixel, upright and at its own size: a canvas resamples a sprite several times faster that way;
  // turned (a cocked tail, a tilted head, a pitched bird) or squeezed (a bird turning), smoothed, or its edges would step and crawl)
  const sm=Math.abs(m.b)>1e-4||Math.abs(m.c)>1e-4||Math.abs(Math.abs(m.a)/q-1)>0.04||Math.abs(Math.abs(m.d)/q-1)>0.04;
  ctx.save();if(al!=null&&al<1)ctx.globalAlpha*=al;ctx.imageSmoothingEnabled=sm;ctx.drawImage(G.cv,G.x0,G.y0,G.w,G.h);ctx.restore();}
// a glow made fresh each frame, for a bird whose whole shape keeps changing (the soaring eagle, a pigeon beating its wings or turning): its
// outlines blurred once, at a quarter of their size on screen (a blur costs by the pixel, and a glow is soft anyway), onto a small canvas kept
// for it, then drawn under the bird, smoothed
const BD_LG={c:null,x:null};
function bd_glowLive(ctx,box,builds,col,lw,al){const m=ctx.getTransform(),ds=Math.hypot(m.c,m.d);if(!(ds>0.02)||al<=0.01)return;
  const k=4,q=ds/k,pad=26/ds,x0=box[0]-pad,y0=box[1]-pad,W=Math.max(2,Math.ceil((box[2]-box[0]+2*pad)*q)),Hh=Math.max(2,Math.ceil((box[3]-box[1]+2*pad)*q));if(W*Hh>4e6)return;
  if(!BD_LG.c||BD_LG.c.width<W||BD_LG.c.height<Hh){BD_LG.c=mkCanvas(Math.max(W,BD_LG.c?BD_LG.c.width:0),Math.max(Hh,BD_LG.c?BD_LG.c.height:0));BD_LG.x=BD_LG.c.getContext("2d");}
  const g=BD_LG.x,off=W+32;g.save();g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W+3,Hh+3);g.setTransform(q,0,0,q,-x0*q-off,-y0*q);g.lineJoin="round";g.beginPath();builds.forEach(b=>b(g));
  g.lineWidth=(lw||2.2)*1.6/BD_S.s;g.strokeStyle=rgba(col,1);g.shadowOffsetX=off;g.shadowColor=rgba(col,0.7);g.shadowBlur=9/k;g.stroke();g.restore();
  ctx.save();if(al!=null&&al<1)ctx.globalAlpha*=al;ctx.imageSmoothingEnabled=true;ctx.drawImage(BD_LG.c,0,0,W,Hh,x0,y0,W/q,Hh/q);ctx.restore();}
// fine lines drawn as plain strokes (for the smallest details): w in screen pixels
function bd_strk(ctx,list,col,a,w){if(a<=0.01||!list.length)return;ctx.beginPath();for(const p of list)bd_path(ctx,p);ctx.lineWidth=w/BD_S.s;ctx.strokeStyle=rgba(col,a);ctx.stroke();}
// fine inner lines, tapering: each a list of points, from w0 to w1 screen pixels (half-widths)
function bd_lines(ctx,list,col,a,w0,w1){if(a<=0.01||!list.length)return;const s=BD_S.s;ctx.beginPath();for(const p of list)bd_taper(ctx,p,w0/s,w1/s);ctx.fillStyle=rgba(col,a);ctx.fill();}
// an eye: a bright bead (or a dark one with a glint and a fine ring, on a pale face); op 1 open, 0 shut
function bd_eye(ctx,x,y,r,col,op,dark){op=op==null?1:op;ctx.save();ctx.translate(x,y);ctx.scale(1,Math.max(0.1,op));
  if(dark){ctx.fillStyle="rgb(12,9,8)";ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.lineWidth=0.7/BD_S.s;ctx.strokeStyle=rgba(col,0.6);ctx.stroke();
    if(op>0.4){ctx.fillStyle=rgba(mix(col,[255,255,255],0.7),0.95);ctx.beginPath();ctx.arc(r*0.32*BD_S.f,-r*0.36,r*0.34,0,TAU);ctx.fill();}}
  else{ctx.fillStyle=rgba(col,0.35);ctx.beginPath();ctx.arc(0,0,r*1.7,0,TAU);ctx.fill();ctx.fillStyle=rgba(mix(col,[255,255,255],0.45),1);ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();}
  ctx.restore();}
// draw a bird fn(c) at (x,y), size s, facing o.face (1 right, -1 left; in between it squeezes as it turns) or o.flip; box its reach in its units.
// While it's see-through (a fade), it's drawn whole on a layer first, so its overlapping parts don't show through each other.
function bd_draw(ctx,x,y,s,o,box,fn){const a=o.a==null?1:o.a,ga=ctx.globalAlpha*Math.min(1,a);if(a<=0.01||ga<=0.004||!(s>0))return;
  let fx=(o.flip?-1:1)*(o.face==null?1:o.face);fx=(fx<0?-1:1)*Math.max(0.2,Math.abs(fx));BD_S.f=fx<0?-1:1;BD_S.s=s;
  const put=c=>{c.translate(x,y);c.scale(s*fx,s);if(o.rot)c.rotate(o.rot);c.lineJoin="round";c.lineCap="round";};
  if(o.rot){const r=Math.hypot(Math.max(-box[0],box[2]),Math.max(-box[1],box[3]));box=[-r,-r,r,r];}
  if(ga<0.985){const m=ctx.getTransform(),X=[],Y=[];
    for(const u of [box[0]*fx,box[2]*fx])for(const v of [box[1],box[3]]){const px=x+s*u,py=y+s*v;X.push(m.a*px+m.c*py+m.e);Y.push(m.b*px+m.d*py+m.f);}
    const x0=Math.floor(Math.min(...X)-24),y0=Math.floor(Math.min(...Y)-24),w=Math.ceil(Math.max(...X)+24)-x0,h=Math.ceil(Math.max(...Y)+24)-y0;
    if(w>=1&&h>=1&&w*h<9e6){if(!BD_LAY.c||BD_LAY.c.width<w||BD_LAY.c.height<h){BD_LAY.c=mkCanvas(Math.max(w,BD_LAY.c?BD_LAY.c.width:0),Math.max(h,BD_LAY.c?BD_LAY.c.height:0));BD_LAY.x=BD_LAY.c.getContext("2d");}
      const c=BD_LAY.x;c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.clearRect(0,0,w,h);c.setTransform(m.a,m.b,m.c,m.d,m.e-x0,m.f-y0);put(c);fn(c);c.restore();
      ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ga;ctx.imageSmoothingEnabled=false;ctx.drawImage(BD_LAY.c,0,0,w,h,x0,y0,w,h);ctx.restore();return;}}
  ctx.save();put(ctx);fn(ctx);ctx.restore();}
// a joint between a and b (bones l1, l2); bend 1 or -1 picks the side it bends to
function bd_ik(a,b,l1,l2,bend){const dx=b[0]-a[0],dy=b[1]-a[1],d0=Math.hypot(dx,dy)||1e-6,d=clamp(d0,Math.abs(l1-l2)+0.01,l1+l2-0.01),x=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-x*x)),ux=dx/d0,uy=dy/d0;
  return [a[0]+ux*x-uy*h*bend,a[1]+uy*x+ux*h*bend];}

/* ---------- life: every value a smooth function of t (null t: a still pose) ---------- */
// a value in -1..1 that holds, then moves quickly (over dur seconds) to the next, about every per seconds: a bird's head
function bd_hold(t,k,per,dur){if(t==null)return 0;const u=t/per+hash(k,5)*13,i=Math.floor(u),si=i+0.7*hash(i,k),v=j=>hash(j,k+0.37)*2-1;
  return u>=si?lerp(v(i-1),v(i),ease(clamp((u-si)*per/dur,0,1))):v(i-1);}
// a flick now and then (0 → 1 → 0): up in rise seconds, back in fall; about every per seconds
// (the rise starts at once and slows to a stop: a Hermite curve whose speed never tops 4/3 of the average, so no frame jumps)
function bd_pulse(t,k,per,rise,fall){if(t==null)return 0;const u=t/per+hash(k,6)*11,i=Math.floor(u);let m=0;
  for(let j=i-1;j<=i;j++){const d=(u-j-0.15-0.7*hash(j,k+0.71))*per;if(d>0){const v=clamp(d/rise,0,1);m=Math.max(m,d<rise?v*(1-v)*(1-v)+v*v*(3-2*v):1-sstep(0,1,(d-rise)/fall));}}return m;}
// a blink now and then: 1 open, 0 shut
function bd_blink(t,k){if(t==null)return 1;const P=2.9+hash(k,7)*2.2,u=((t+hash(k,8)*P)%P+P)%P;return u<0.16?1-0.95*Math.sin(Math.PI*u/0.16):1;}

/* ---------- a small songbird, perched: one contour for the head and body, a tail and a folded wing that overlap it, slender legs whose toes
   curl over a branch. G holds its shape (head points turn with the head about G.pv), paint(c,H,Bm,dip) its plumage inside the contour
   (H(p) places head points, Bm(p) body points). L is its life: br breath, ha head tilt, hx head reach, fl a flick of tail and wings, bl blink ---------- */
function bd_perchGeo(G,L){const dip=(L.dp==null?L.fl:L.dp)*1.1,ha=L.ha-L.fl*0.05,pv=G.pv,H=p=>bd_rot(p,pv[0],pv[1],ha,L.hx,dip),Bm=p=>bd_mv(p,0,dip);
  const B=Bm(G.body),hd=H(G.head);B[0][0]+=L.br*0.45;B[1][0]+=L.br*0.65;B[2][1]+=L.br*0.35;
  const ta=G.ta+L.fl*0.36,tb=[G.tb[0],G.tb[1]+dip],tl=G.tail[4][0],bw=(G.tbow||0.9)*(1-L.fl*0.6);
  const T=p=>bd_rot(p.map(q=>{const u=q[0]/tl,r=[q[0],q[1]+bw*u*(1-u)*4];if(q[2])r.push(1);return r;}),0,0,ta,tb[0],tb[1]);
  return{dip,H,Bm,sil:hd.slice(0,G.nf).concat(B,hd.slice(G.nf)),T};}
const BD_L0={br:0.5,ha:0.03,hx:0,fl:0,bl:1},BD_LH={br:0.5,ha:0,hx:0,fl:0,bl:1};
function bd_perch(c,col,G,L,paint,key){const{dip,H,Bm,sil,T}=bd_perchGeo(G,L),bx=G.box,fill=bd_fill(c,col,0,bx);
  // the glow, blurred once: the body's, the head's apart (it follows the head as it tilts and reaches), and the tail's (it turns with the tail as it's cocked)
  // (each an open stretch of the resting outline, so the two meet at the throat and the nape without a seam)
  const nb=G.body.length,rs=()=>bd_perchGeo(G,BD_LH).sil;
  c.save();c.translate(0,dip);bd_glow(c,key,[bx[0]-6,bx[1]-4,bx[2]+2,bx[3]+2],[q=>bd_seg(q,rs(),G.nf,G.nf+nb-1)],col,2.3);c.restore();
  c.save();c.translate(G.pv[0]+L.hx,G.pv[1]+dip);c.rotate(L.ha-L.fl*0.05);c.translate(-G.pv[0],-G.pv[1]);
  bd_glow(c,key+"h",()=>{const X=G.head.map(q=>q[0]),Y=G.head.map(q=>q[1]);return[Math.min(...X)-4,Math.min(...Y)-4,Math.max(...X)+4,Math.max(...Y)+4];},
    [q=>{const S=rs();bd_seg(q,S,G.nf+nb-1,S.length+G.nf);}],col,2.3);c.restore();
  c.save();c.translate(G.tb[0],G.tb[1]+dip);c.rotate(L.fl*0.36);c.translate(-G.tb[0],-G.tb[1]);
  bd_glow(c,key+"t",()=>{const P=bd_perchGeo(G,BD_L0).T(G.tail),X=P.map(q=>q[0]),Y=P.map(q=>q[1]);return[Math.min(...X)-3,Math.min(...Y)-3,Math.max(...X)+3,Math.max(...Y)+3];},
    [q=>bd_loop(q,bd_perchGeo(G,BD_L0).T(G.tail))],col,2.3);c.restore();
  // the legs, behind the belly: the far one darker; three toes forward, one back
  const legc=G.leg||mix(col,[190,140,120],0.55),lg=G.legs;
  const legs=(dx,dy,dim)=>{const kn=[lg[0][0]+dx,lg[0][1]+dip+dy],md=[lg[1][0]+dx,lg[1][1]+dip*0.5+dy],ft=[lg[2][0]+dx,lg[2][1]+dy];c.beginPath();bd_tube(c,[kn,md,ft],[0.95,0.6,0.52]);
    const tt=(q,w)=>bd_taper(c,[ft].concat(q.map(v=>[v[0]+dx,v[1]+dy])),w,0.2);tt(G.toes[0],0.48);tt(G.toes[1],0.44);tt(G.toes[2],0.48);
    c.fillStyle=rgba(mix(legc,[10,12,20],dim),0.96);c.fill();};
  legs(-3.2,-0.35,0.55);legs(0,0,0);
  // the tail, behind the body, flicked up now and then
  bd_formP(c,T(G.tail),col,fill,1.8,0.9);
  bd_strk(c,G.tlines.map(T),col,0.28,0.55);
  // head and body: one contour; then the plumage inside it
  bd_formP(c,sil,col,fill,2.3,1);
  c.save();c.beginPath();bd_loop(c,sil);c.clip();paint(c,H,Bm,dip);c.restore();
  // the folded wing: coverts, then the flight feathers to a tip over the tail; a flick lifts it a little
  const wd=L.fl*0.5,Wg=p=>bd_rot(Bm(p),G.wp[0],G.wp[1],-wd*0.08,0,wd);
  bd_formP(c,Wg(G.wing),col,bd_fill(c,col,0.18,bx),1.5,0.85);
  if(G.wpaint)G.wpaint(c,Wg);
  bd_lines(c,G.wlines.map(Wg),col,0.42,0.4,0.1);
  // the bill and the eye
  bd_formP(c,H(G.bill),col,G.billc||"rgb(24,19,17)",1,0.6);
  if(G.gape)bd_strk(c,[H(G.gape)],[10,8,8],0.8,0.5);
  const e=H([G.eye])[0];bd_eye(c,e[0],e[1],G.er,col,L.bl,G.darkEye);}
// a songbird's life: slow breath, a head that tilts and reaches in quick moves, a flick of tail and wings now and then, a blink
function bd_perchLife(t,k){return{br:t==null?0.5:0.5+0.5*Math.sin(t*TAU*0.5+k),ha:0.13*bd_hold(t,11+k,2.4,0.2)+0.03,hx:0.5*bd_hold(t,13+k,3.1,0.4),
  fl:bd_pulse(t,21+k,4.6,0.18,0.9),dp:bd_pulse(t==null?t:t+0.04,21+k,4.6,0.18,0.9),bl:bd_blink(t,31+k)};}

/* ---------- a European robin (Erithacus rubecula), perched: plump and round-headed, an orange-red face and breast edged with blue-grey,
   olive-brown above, a pale belly, a thin dark bill, a big dark eye, slender legs; its toes at y 22.5 (a branch's top).
   Options: t, col (its rim), breast (false: no orange), american (true: the American robin instead), seed ---------- */
const BD_RB={pv:[5,-15],nf:7,box:[-24,-32,20,24],darkEye:true,er:1.75,eye:[11.9,-24.6],ta:2.26,tb:[-8.4,5.4],wp:[3,-14],
  head:[[1.5,-29.8],[7.5,-30.6],[13.6,-28.2],[16.9,-25.1],[18,-22.9,1],[17.8,-20.3,1],[16.3,-17.3],[-3.6,-25.2]],
  body:[[17.2,-11.6],[17.2,-3.2],[11.8,6.4],[3.2,11.6],[-6.4,10.2],[-11.4,2.6],[-9.6,-8.8],[-6.6,-17.8]],
  wing:[[3.4,-16.2],[-3,-15.4],[-9.6,-8.4],[-15.2,-0.6],[-18.8,6.2,1],[-13.4,4.2],[-5.2,2.4],[1.8,-2],[5.4,-9.2]],
  wlines:[[[3.6,-9.4],[-1.6,-6.8],[-7,-4.6],[-10.6,-3]],[[-9.6,-3.4],[-13.2,0.6],[-16.6,4.8]],[[-7,-2.6],[-10.6,1.4],[-14.2,4.6]],[[-3.4,-1.6],[-6.8,1.4],[-10.6,3.6]]],
  bill:[[17.6,-23.2],[20.6,-22.5],[23.6,-21.35,1],[20.4,-20.75],[17.5,-20.5]],gape:[[18.4,-21.3],[20.4,-21.3],[22.2,-21.2]],
  tail:[[0,-1.6],[6,-2.4],[12.6,-3.1],[18,-3.7],[20.3,-3.3],[21.3,-2.1],[21.4,-0.8],[21.1,0.1],[21.4,1],[21.2,2.4],[20.1,3.4],[17.6,3.6],[12.2,2.9],[5.6,2.1],[0,1.6]],
  tlines:[[[3,0.1],[11,0.05],[19.6,0.1]],[[4,-1.1],[12,-2],[19.6,-2.7]],[[4,1.1],[12,1.9],[19.4,2.6]]],
  legs:[[4.4,8],[3.9,15],[3.1,21.8]],toes:[[[5.8,22],[8,22.8],[9,24.2]],[[5.4,22.5],[6.8,24.1]],[[0.6,22.2],[-1.2,23.2],[-1.8,24.4]]]};
function robin(ctx,x,y,s,o){o=o||{};if(o.american)return bd_amRobin(ctx,x,y,s,o);const col=o.col||[255,160,110],L=bd_perchLife(o.t,o.seed||1);
  bd_draw(ctx,x,y,s,o,[-30,-36,30,28],c=>bd_perch(c,col,BD_RB,L,(c,H,Bm,dip)=>{if(o.breast===false)return;
    // a pale belly, the blue-grey border, then the orange-red face and breast
    c.save();c.translate(0,dip);c.fillStyle=bd_rad(c,"rb-belly",6.4,6.4,11.5,[[0,"rgba(238,234,224,0.6)"],[0.55,"rgba(236,230,218,0.44)"],[1,"rgba(236,230,218,0)"]]);c.fillRect(-7,-6,28,24);c.restore();
    c.beginPath();bd_tube(c,H([[17.5,-29.6],[14.6,-29.2],[10.6,-29.4],[6.4,-27],[3.7,-22],[3.8,-15.6]]).concat(Bm([[5.6,-7.5],[8.4,-0.6],[12.2,3.3]])),[0.4,1,1.25,1.35,1.35,1.3,1.05,0.7,0.25]);
    c.fillStyle="rgba(146,166,194,0.6)";c.fill();c.beginPath();
    bd_loop(c,H([[17.6,-28.4],[14.8,-28.2],[10.9,-28.1],[7.1,-25.8],[4.9,-21.5]]).concat(Bm([[5,-15.2],[6.8,-7.2],[9.6,-0.4],[14,3.6],[24,6],[26,-14]]),H([[24,-33]])));
    c.fillStyle=bd_lin(c,"rb-breast",8,-26,16,6,[[0,"rgba(255,130,72,0.88)"],[1,"rgba(230,94,46,0.82)"]]);c.fill();},"rb"));}
/* the American robin (Turdus migratorius), for robin(..., {american: true}): the other bird English calls a robin, a thrush half as long again:
   slimmer and longer-tailed, a blackish head with broken white eye-rings, a yellow bill, a white-streaked throat, a brick-orange breast
   and a white vent, grey-brown above */
const BD_AR=(()=>{const X=(p,k)=>p.map(q=>{const r=[q[0]*k,q[1]];if(q[2])r.push(1);return r;}),R=BD_RB;
  return Object.assign({},R,{body:X(R.body,1.12),head:X(R.head,1.05),wing:X(R.wing,1.14),wlines:R.wlines.map(p=>X(p,1.14)),ta:2.36,tb:[-9.6,5],eye:[12.4,-24.6],er:1.6,
    tail:R.tail.map(q=>{const r=[q[0]*1.3,q[1]*1.05];if(q[2])r.push(1);return r;}),tlines:R.tlines.map(p=>p.map(q=>[q[0]*1.3,q[1]])),
    bill:[[18.4,-23.3],[21.8,-22.7],[25.4,-21.5,1],[21.6,-20.7],[18.3,-20.4]],billc:"rgb(222,178,56)",gape:null,box:[-26,-32,22,24],leg:[120,96,84]});})();
function bd_amRobin(ctx,x,y,s,o){const col=o.col||[200,150,120],L=bd_perchLife(o.t,(o.seed||1)+9);
  bd_draw(ctx,x,y,s,o,[-34,-36,32,28],c=>bd_perch(c,col,BD_AR,L,(c,H,Bm,dip)=>{
    // brick-orange from throat to belly, a white vent, a blackish head
    c.beginPath();bd_loop(c,H([[17.4,-17.6],[11.6,-18.6]]).concat(Bm([[6.4,-15],[5.6,-6],[8.6,2.6],[14,7.4],[24,8],[26,-14]]),H([[24,-20]])));
    c.fillStyle=bd_lin(c,"ar-breast",8,-18,16,8,[[0,"rgba(214,104,52,0.86)"],[1,"rgba(186,80,40,0.82)"]]);c.fill();
    c.save();c.translate(0,dip);c.fillStyle=bd_rad(c,"ar-vent",2,11,8,[[0,"rgba(240,236,228,0.6)"],[1,"rgba(240,236,228,0)"]]);c.fillRect(-8,2,20,14);c.restore();
    c.beginPath();bd_loop(c,H([[19,-19.4],[15.4,-17.6],[11,-18.8],[6.6,-20.4],[2.4,-22.6],[-2,-24],[-6,-33],[20,-33]]));c.fillStyle="rgba(14,14,18,0.8)";c.fill();
    // white arcs above and below the eye, white streaks on the throat
    const e=H([BD_AR.eye])[0];c.save();c.translate(e[0],e[1]);c.lineWidth=0.75;c.strokeStyle="rgba(244,242,236,0.95)";c.beginPath();c.arc(0,0,2.5,-2.7,-0.5);c.stroke();c.beginPath();c.arc(0,0,2.5,0.5,2.6);c.stroke();c.restore();
    bd_strk(c,[H([[16.4,-18.4],[15.6,-16]]),H([[14.6,-18.6],[13.8,-16.2]]),H([[12.8,-18.8],[12.2,-16.6]])],[244,242,236],0.75,0.6);},"ar"));}

/* ---------- a house sparrow (Passer domesticus), a male: chunky and big-headed, a grey crown, a chestnut band from the eye round the nape,
   pale cheeks, a black bib and lores, a stout conical bill, a streaked brown back, a white wing bar, pale grey below, short legs.
   Options: t, col (its rim), female (plain: no bib, a buff stripe over the eye), seed ---------- */
const BD_SP={pv:[4,-14],nf:7,box:[-26,-30,20,24],er:1.45,eye:[10.4,-21.9],darkEye:true,tbow:-0.5,ta:2.72,tb:[-10.6,3.6],wp:[2,-12],
  head:[[0.4,-26.6],[6.6,-28],[12.6,-26.3],[15.2,-23.8],[16.4,-22.4,1],[16.2,-17.6,1],[14.6,-15],[-4.6,-22.4]],
  body:[[16.2,-9.4],[16.4,-1.8],[11.6,6.6],[2.6,10.8],[-7.4,8.6],[-13.6,0.8],[-11.6,-9],[-7.2,-16.6]],
  wing:[[2.8,-14.2],[-4,-14.2],[-11,-7.8],[-16.4,-1.6],[-20.4,3.6,1],[-14,4.4],[-6,3.6],[1,-0.6],[4.6,-7.6]],
  wlines:[[[-9.4,-3.6],[-13.8,0.2],[-18,3.2]],[[-7.2,-2.6],[-11.2,1.2],[-15.2,3.9]],[[-4.6,-1.8],[-8.2,1.6],[-12,3.8]]],
  bill:[[16.3,-22.7],[19.4,-21.7],[22.4,-19.9,1],[19.4,-18.6],[16.2,-17.7]],gape:[[16.8,-19.9],[19,-19.8],[21.2,-19.8]],
  tail:[[0,-1.8],[5.5,-2.4],[11,-3],[15.2,-3.5],[17.3,-3.1],[18.1,-1.9],[17.9,-0.7],[17.45,0.1],[17.9,0.9],[18.1,2],[17.2,3.2],[15.2,3.5],[11,3],[5.5,2.3],[0,1.8]],
  tlines:[[[3,0.1],[10,0.05],[16.4,0.1]],[[4,-1.2],[10,-2],[16.6,-2.6]],[[4,1.2],[10,2],[16.4,2.6]]],
  legs:[[3.6,8],[3.3,12.6],[2.8,18.2]],toes:[[[5.2,18.4],[7.3,19.1],[8.2,20.4]],[[4.9,18.9],[6.1,20.3]],[[0.4,18.6],[-1.4,19.5],[-2,20.7]]],
  leg:[196,150,128],
  // the wing: chestnut coverts, a white bar, dark centres to the tertials edged buff, the scapulars streaked black and buff
  wpaint:(c,W)=>{c.save();c.beginPath();bd_loop(c,W(BD_SP.wing));c.clip();
    c.fillStyle=bd_lin(c,"sp-cov",-6,-14,2,2,[[0,"rgba(150,86,46,0.55)"],[1,"rgba(120,70,38,0.35)"]]);c.beginPath();bd_loop(c,W([[3,-15],[-5,-15],[-8,-9],[-6,-7.2],[-2,-8.4],[2,-9.4],[5,-10]]));c.fill();
    c.beginPath();bd_loop(c,W([[-6.4,-5.8],[-9.6,-3],[-13,1],[-15,3.6],[-10,3.4],[-6,1.8],[-3.2,-1.8],[-2.6,-5]]));c.fillStyle="rgba(10,8,8,0.55)";c.fill();c.restore();
    c.beginPath();bd_tube(c,W([[3.2,-9.6],[0.4,-8.6],[-3.2,-7.6],[-6.6,-6.6]]),[0.45,0.8,0.8,0.35]);c.fillStyle="rgba(244,240,230,0.9)";c.fill();
    bd_lines(c,[W([[-2.4,-6],[-5.6,-1.4],[-9.4,2.4]]),W([[-5.2,-6.4],[-8.6,-2.4],[-12.4,1.4]])],[222,190,140],0.7,0.35,0.15);
    bd_lines(c,[W([[-1,-13.4],[-5.2,-11.4],[-9.4,-8]]),W([[-3.4,-12.2],[-7.6,-9.4]])],[10,8,8],0.85,0.55,0.2);bd_lines(c,[W([[-0.6,-12.2],[-4.6,-10.2],[-8.6,-7.2]])],[230,196,146],0.75,0.4,0.15);}};
function sparrow(ctx,x,y,s,o){o=o||{};const col=o.col||[210,170,120],L=bd_perchLife(o.t,(o.seed||2)+3),fem=!!o.female;
  bd_draw(ctx,x,y,s,o,[-30,-32,26,28],c=>bd_perch(c,col,BD_SP,L,(c,H,Bm,dip)=>{
    // pale grey below, the mantle streaked
    c.save();c.translate(0,dip);c.fillStyle=bd_rad(c,"sp-belly",9,2,14,[[0,"rgba(214,210,200,0.34)"],[1,"rgba(214,210,200,0)"]]);c.fillRect(-6,-14,30,34);c.restore();
    bd_lines(c,[Bm([[-6.2,-15.6],[-8.6,-12.4],[-10.4,-9.2]]),Bm([[-3.6,-15.8],[-6.2,-12.2],[-8.2,-9.8]])],[12,9,8],0.8,0.55,0.2);
    bd_lines(c,[Bm([[-4.8,-16.2],[-7.4,-12.6],[-9.4,-9.6]])],[226,190,140],0.7,0.4,0.15);
    if(fem){c.beginPath();bd_loop(c,H([[16,-24.6],[12,-25.6],[6,-25],[0,-24],[-6,-22],[-6,-32],[18,-32]]));c.fillStyle="rgba(120,96,70,0.5)";c.fill();
      c.beginPath();bd_tube(c,H([[12.2,-23.4],[8.6,-23.6],[4.4,-23.2],[0.6,-22]]),[0.3,0.75,0.75,0.3]);c.fillStyle="rgba(226,204,160,0.7)";c.fill();return;}
    // grey crown, chestnut band behind the eye, pale cheek
    c.beginPath();bd_loop(c,H([[16.6,-24.4],[12.6,-24.6],[8.4,-24.2],[3.4,-23.6],[-1.2,-23.8],[-6.4,-22.6],[-8,-32],[18,-32]]));c.fillStyle="rgba(146,154,168,0.62)";c.fill();
    c.beginPath();bd_loop(c,H([[11.6,-23.3],[6.2,-24.2],[1,-23.6],[-3.4,-21.6],[-5.2,-17.8],[-4.4,-14.8],[-1.4,-16.8],[2.8,-19.6],[7.4,-21.2]]));c.fillStyle="rgba(150,82,42,0.9)";c.fill();
    c.beginPath();bd_loop(c,H([[11.4,-20.4],[7.4,-20.6],[3.6,-19.2],[2.2,-15.6],[5.4,-13],[10.4,-13.8],[13.2,-17]]));c.fillStyle="rgba(216,212,204,0.6)";c.fill();
    // the black bib and lores, a white spot behind the eye
    c.beginPath();bd_loop(c,H([[16.2,-18],[13.6,-17.2]]).concat(Bm([[11.8,-12.4],[10.4,-7.4],[10.8,-3],[13.6,-1.6],[16.6,-3.4],[20,-8]]),H([[20,-18.6]])));
    bd_tube(c,H([[16.2,-21],[13.8,-21.3],[11.6,-21.7]]),[0.95,0.9,0.6]);c.fillStyle="rgba(5,5,7,0.95)";c.fill();
    const sp=H([[8,-23.4]])[0];c.beginPath();c.ellipse(sp[0],sp[1],0.9,0.6,-0.3,0,TAU);c.fillStyle="rgba(240,238,232,0.85)";c.fill();},"sp"+(fem?"f":"")));}

/* ---------- a rock dove (Columba livia), the pigeon of the photo experiments: plump, a small head, a short dark bill with a pale cere,
   an orange eye, a green and purple sheen on the neck, pale grey wings with two black bars, a dark band at the tail's tip, short coral-pink legs.
   It stands, walks (its head holding still while its body walks past, then darting forward), pecks, and flies short hops: its wing unfolds
   from its side into a beating wing (a small 3D model, seen a little from above). It turns as a round bird: each part is foreshortened by its
   own depth, so face on its body and head stay round, its bill points at us, both eyes and both legs show. Options: a, t, face (1 right,
   -1 left, between: turning, by way of facing us), and the pose, usually from bd_route(): walk (0..1) and step (its gait, in strides),
   fly (0..1) and flap (wingbeats), peck (0..1), pitch. Its origin is the middle of its body; its toes rest at y 36 ---------- */
const BD_PI={head:[[17.6,-31.8],[22.6,-34.8],[28.6,-33.4],[32,-29.9,1],[31.8,-27.5,1],[29.4,-25.8],[25.6,-23.4]],pv:[22,-26],
  body:[[30.4,-7.4],[29,3.6],[22,12.4],[10,18.4],[-4,19.2],[-14,16.4],[-21,11],[-24.6,3.4],[-21,-4.6],[-10.6,-12.6],[2,-19.4]],
  bill:[[31.6,-30.2],[34.6,-29.6],[37.6,-28.6],[38.6,-27.6,1],[36.6,-27.4],[34,-27.3],[31.6,-27.4]],
  wingF:[[15,-7],[12,-1],[5,5],[-5,8.6],[-17,8.6],[-29,6.4],[-37,4.4],[-42.4,2.4,1],[-33,-1.2],[-21,-5.8],[-8,-11],[4,-14.6],[13,-13]],
  wingE:[[12,0],[13.6,14],[13.2,29],[10,43],[4,57],[-4,70.5],[-11,81.5],[-16.6,89.5,1],[-20.2,80.5],[-20.8,67],[-22.6,53],[-22,36],[-16.6,6]],
  barF:[[[-4,-10.6],[-9.6,-8.6],[-15.2,-6.2],[-20.6,-3.6]],[[-6.4,-5.2],[-12,-3.2],[-17.6,-0.8],[-22.8,1.8]]],
  barE:[[[-3.6,6],[-5.6,16],[-6.6,26],[-6.2,36]],[[-9.6,6],[-11.8,16],[-12.8,26],[-12.4,36]]]};
function pigeon(ctx,x,y,s,col,o){o=o||{};col=col||[200,215,240];const t=o.t,k=o.seed||6,fc=(o.flip?-1:1)*(o.face==null?1:o.face);
  const L={t,br:t==null?0.5:0.5+0.5*Math.sin(t*TAU*0.45+k),ha:0.1*bd_hold(t,71+k,2.2,0.22),bl:bd_blink(t,77+k),walk:o.walk||0,step:o.step||0,fly:o.fly||0,flap:o.flap||0,
    peck:o.peck||0,pitch:o.pitch||0,sheen:t==null?0:Math.sin(t*0.8+k),cz:Math.min(1,Math.abs(fc))};
  bd_draw(ctx,x,y,s,Object.assign({},o,{flip:false,face:fc<0?-1:1,rot:(o.rot||0)-L.pitch}),[-60,-80,50,46],c=>bd_pigeon(c,col,L));}
// its tail, in its own frame (x from its base along it): the feathers fanned by f (0 folded, 1 spread in flight) from a narrow base under the
// coverts, the outer ones a little shorter so the tip is rounded, a shallow notch between the feathers' ends
function bd_piFe(f,u,r){const A=0.04+0.58*f,th=u*A,l=r*(1-0.035*u*u);return[l*Math.cos(th),(3*u+l*Math.sin(th))*(1-0.25*f)];}
function bd_piTailPts(f){const vs=1-0.25*f,b=3,len=30,nd=0.3+0.8*f,fe=(u,r)=>bd_piFe(f,u,r);
  return[[0,-b*vs],fe(-1,len*0.5),fe(-1,len*0.86)].concat([-1,-0.5,0,0.5,1].map((u,i)=>fe(u,i%2?len-nd:len)),[fe(1,len*0.86),fe(1,len*0.5),[0,b*vs]]);}
function bd_pigeon(c,col,L){const G=BD_PI,fly=clamp(L.fly,0,1),wk=clamp(L.walk,0,1),el=0.42*fly;
  // turning (cz: how much of its side we see), each part keeps its girth: seen end on, a part of length l and girth g shows sqrt(cz²l² + (1-cz²)g²)
  const cz=L.cz==null?1:clamp(L.cz,0,1),tn=cz<0.999,sn=Math.sqrt(Math.max(0,1-cz*cz)),K=r=>Math.sqrt(cz*cz+r*r*sn*sn);
  // the gait: each leg planted for 60% of a stride, then swung forward; the head holds still (moving back against the body) then darts ahead
  const sl=11,ph=L.step,hb=(()=>{const q=((ph*2)%1+1)%1;return q<0.6?1-2*q/0.6:-1+2*ease((q-0.6)/0.4);})()*wk*5.2;
  const bob=wk*0.7*Math.abs(Math.sin(ph*TAU)),pk=L.peck,hx=hb+pk*8.6,hy=-pk*13.6+bob*0.4,ha=L.ha*(1-pk)-pk*0.34+fly*0.08;
  const H=p=>bd_rot(p,G.pv[0],G.pv[1],ha,hx,hy+bob),Bm=p=>bd_mv(p,0,bob);
  // each part's own foreshortening, about its middle (x0 goes to x0·cz, the rest squeezed by k): body, head, bill, tail
  const hc=H([[24.8,-29]])[0][0],bc=3,tb=[-21,3.4+bob],kB=K(0.62),kH=K(0.85),kT=K(0.3),mB=x=>bc*cz+(x-bc)*kB,mH=x=>hc*cz+(x-hc)*kH,mT=x=>tb[0]*cz+(x-tb[0])*kT,
    MP=(p,m)=>tn?p.map(q=>{const r=[m(q[0]),q[1]];if(q[2])r.push(1);return r;}):p,mN=(q,w)=>tn?[lerp(mB(q[0]),mH(q[0]),w),q[1]]:q,
    at=(x0,k,fn)=>{if(!tn)return fn();c.save();c.translate(x0*cz,0);c.scale(k,1);c.translate(-x0,0);fn();c.restore();};
  const B=Bm(G.body);B[0][0]+=L.br*0.6;B[1][0]+=L.br*0.8;if(tn){B[2][1]+=1.2*sn;B[3][1]+=2*sn;B[4][1]+=2*sn;B[5][1]+=1.4*sn;}
  const nf=[lerp(27.4,27.4+hx,0.55)+L.br*0.3,lerp(-17,-17+hy,0.5)+bob],nb=[lerp(12,12+hx,0.45),lerp(-25,-25+hy,0.6)+bob];
  const sil=MP(H(G.head),mH).concat([mN(nf,0.6)],MP(B,mB),[mN(nb,0.45)]),fill=bd_fill(c,col,0.25,[-40,-40,36,30]);
  const Tp=bd_rot(bd_piTailPts(fly),0,0,2.92+0.1*fly-L.br*0.01,tb[0],tb[1]);
  // the wings: folded against its side, or spread and beating (down fast, up flexed); the far one behind the body
  const qf=((L.flap%1)+1)%1,th=fly>0.01?(qf<0.5?lerp(1.2,-0.55,ease(qf/0.5)):lerp(-0.55,1.2,ease((qf-0.5)/0.5))):0,fx=fly>0.01&&qf>=0.5?Math.sin(Math.PI*(qf-0.5)/0.5):0;
  const zb=8.4,y0=-11.4,se=Math.sin(el),wc=-14,kW=lerp(K(0.2),cz,fly);
  const wpt=(F,E,side)=>{const sp=E[1]*(1-0.3*fx),ex=E[0]-fx*sp*0.16,ey=y0-sp*Math.sin(th),ez=zb+sp*Math.cos(th),fz=zb+1;
    let X=lerp(F[0],ex,fly);const Y=lerp(F[1]+bob,ey+bob,fly),Z=lerp(fz,ez,fly)*side;if(tn)X=wc*cz+(X-wc)*kW-Z*sn;
    const r=[X,Y+Z*se];if(F[2]&&E[2])r.push(1);return r;};
  const wing=side=>G.wingF.map((F,i)=>wpt(F,G.wingE[i],side)),bars=side=>G.barF.map((bf,j)=>bf.map((F,i)=>wpt(F,G.barE[j][i],side)));
  const Wn=wing(1),Wf=fly>0.01?wing(-1):null,gf=sstep(0,0.3,fly),gs=tn?sstep(0.9,0.999,cz):1;
  // the glow, blurred once into sprites while it stands side on: the body, the folded tail and, apart, the head, which moves on its own;
  // turning, and in flight for the beating wings and the fanned tail, it glows as it is, drawn fresh each frame (the two cross-fade)
  if(gs>0.01){c.save();c.translate(0,bob);bd_glow(c,"pi-b",[-30,-30,34,24],[q=>bd_loop(q,[[27.4,-17]].concat(G.body,[[12,-25]]))],col,2.3,gs);
    if(gf<0.99)bd_glow(c,"pi-t",[-54,-4,-17,16],[q=>bd_loop(q,bd_rot(bd_piTailPts(0),0,0,2.915,-21,3.4))],col,2.3,(1-gf)*gs);c.restore();
    c.save();c.translate(G.pv[0]+hx,G.pv[1]+hy+bob);c.rotate(ha);c.translate(-G.pv[0],-G.pv[1]);bd_glow(c,"pi-h",[14,-38,36,-20],[q=>bd_loop(q,G.head)],col,2.3,gs);c.restore();}
  const gl=Math.max(gf,1-gs);if(gl>0.01){const TpM=MP(Tp,mT),P=[].concat(gs<0.99?sil:[],gf>0.01?Wn:[],Wf||[],TpM),X=P.map(q=>q[0]),Y=P.map(q=>q[1]);
    bd_glowLive(c,[Math.min(...X),Math.min(...Y),Math.max(...X),Math.max(...Y)],[q=>{if(gs<0.99)bd_loop(q,sil);if(gf>0.01)bd_loop(q,Wn);if(Wf)bd_loop(q,Wf);bd_loop(q,TpM);}],col,gs<0.99?2.3:1.9,gl);}
  // legs: a knee hidden in the belly, the heel bending back, the foot planted, stepping or tucked in flight; set apart across its body
  // (seen face on, both show, side by side)
  const leg=(j,dim)=>{const q=((ph+j*0.5)%1+1)%1,d=sl*0.6*wk,hip=[5-3*j,15+bob],z=j?-5.2:5.2,M=(p,dz)=>tn?[p[0]*cz-(z+(dz||0)*Math.sign(z))*sn,p[1]]:p;let fx,fy,lift=0;
    if(q<0.6){fx=d-2*d*q/0.6;fy=0;}else{const v=(q-0.6)/0.4;fx=-d+2*d*ease(v);lift=Math.sin(Math.PI*v)*wk;fy=-3.4*lift;}
    const ft=[hip[0]+fx-1-fly*12,36+fy-fly*15],kn=bd_ik(hip,ft,11.8,11.4,1),cl=lift*0.8+fly;
    c.beginPath();bd_tube(c,[hip,kn,ft].map(M),[1.6,1.05,0.95]);
    const Tt=(dx,dy,w,dz)=>{const tx=ft[0]+dx*(1-cl*0.7),ty=ft[1]+dy+cl*3.2*Math.sign(dx);bd_taper(c,[M(ft),M([lerp(ft[0],tx,0.55),lerp(ft[1],ty,0.5)-0.4],dz*0.55),M([tx,ty],dz)],w,0.3);};
    Tt(8.6,0.4,0.85,0.4);Tt(6.4,1.2,0.75,3.4);Tt(6.2,1,0.7,-2.6);Tt(-4.4,0.3,0.7,0);c.fillStyle=rgba(mix([236,120,120],[12,10,16],dim),0.96);c.fill();};
  const wtop=mix(mix(mix(col,BD_INK,0.55),[6,9,16],0.1),[190,202,222],0.26),wbot=mix(mix([8,12,22],[3,5,10],0.1),[190,202,222],0.26);
  const drawWing=(W,side,far)=>{const d=far?0.3:0;
    bd_formP(c,W,col,bd_lin(c,"pi-w"+col+far+BD_S.f,-40*BD_S.f,-40,36*BD_S.f,30,[[0,rgba(mix(wtop,[4,6,10],d),0.97)],[1,rgba(mix(wbot,[4,6,10],d),0.97)]]),1.6,far?0.62:0.9);
    const tg=c.createLinearGradient(W[2][0],W[2][1],W[7][0],W[7][1]);tg.addColorStop(0.55,"rgba(8,10,18,0)");tg.addColorStop(1,"rgba(8,10,18,"+(far?0.55:0.72)+")");
    c.fillStyle=tg;c.fill();if(far)return;bd_lines(c,bars(side),[4,5,8],0.9,1.25*BD_S.s,0.95*BD_S.s);
    bd_strk(c,[[W[7],W[9]],[W[6],W[10]],[W[5],W[11]]].map(([a,b])=>[a,[lerp(a[0],b[0],0.34),lerp(a[1],b[1],0.34)]]),mix(col,[255,255,255],0.2),0.3,0.6);};
  if(Wf)drawWing(Wf,-1,1);
  leg(1,0.5*cz);
  // the tail: grey, darkening softly to a band at its tip; fanned in flight, its feathers' shafts showing
  at(-21,kT,()=>{bd_formP(c,Tp,col,fill,1.8,0.95);c.save();c.beginPath();bd_loop(c,Tp);c.clip();
    const g=c.createRadialGradient(tb[0],tb[1],0,tb[0],tb[1],30);g.addColorStop(0.62,"rgba(6,8,14,0)");g.addColorStop(0.8,"rgba(6,8,14,0.58)");g.addColorStop(1,"rgba(6,8,14,0.74)");
    c.fillStyle=g;c.fillRect(tb[0]-34,tb[1]-34,68,68);c.restore();
    if(fly>0.05)bd_strk(c,[-0.6,-0.2,0.2,0.6].map(u=>bd_rot([bd_piFe(fly,u,3),bd_piFe(fly,u,15),bd_piFe(fly,u,26)],0,0,2.92+0.1*fly-L.br*0.01,tb[0],tb[1])),mix(col,[255,255,255],0.2),0.3*fly,0.55);});
  leg(0,0);
  // body and head: one contour; the head darker; the neck's sheen, green above and purple below, shifting as it moves; a paler breast
  bd_formP(c,sil,col,fill,2.3,1);
  c.save();c.beginPath();bd_loop(c,sil);c.clip();
  at(hc,kH,()=>{c.save();c.translate(hx,hy+bob);c.fillStyle=bd_lin(c,"pi-hd",16,-34,24,-20,[[0,"rgba(120,134,160,0.28)"],[1,"rgba(120,134,160,0)"]]);c.fillRect(8,-42,30,26);c.restore();});
  const sh=L.sheen*0.5+0.5,g0=mN([18,-26+hy*0.5],0.6),g1=mN([24,-6],0),ng=c.createLinearGradient(g0[0],g0[1],g1[0],g1[1]);ng.addColorStop(0,"rgba(70,200,150,0)");ng.addColorStop(0.25,"rgba(80,206,160,"+(0.34+0.2*sh)+")");
  ng.addColorStop(0.62,"rgba(170,96,210,"+(0.46-0.18*sh)+")");ng.addColorStop(1,"rgba(170,96,210,0)");c.beginPath();
  bd_loop(c,[mN([lerp(13,13+hx,0.6),lerp(-25,-25+hy,0.6)+bob],0.6),mN([lerp(22,22+hx,0.8),lerp(-22,-22+hy,0.8)+bob],0.8),mN([nf[0]+2,nf[1]],0.55),mN([31,-6+bob],0),mN([22,-3+bob],0),mN([10,-10+bob],0.1),mN([7,-17+bob],0.3)]);c.fillStyle=ng;c.fill();
  at(bc,kB,()=>{c.translate(0,bob);c.fillStyle=bd_rad(c,"pi-br",24,2,13,[[0,"rgba(190,196,214,0.2)"],[1,"rgba(190,196,214,0)"]]);c.fillRect(8,-12,30,30);});c.restore();
  // the folded wing over its side (turning to face us, it goes edge on at the flank, and fades there)
  if(fly<=0.01){const wv=tn?sstep(0.05,0.45,cz):1;if(wv>0.01){c.save();c.globalAlpha*=wv;drawWing(Wn,1,0);c.restore();}}
  // the bill with its pale cere (face on, a stub pointing at us), the orange eyes (face on, one each side of the head)
  const bcx=H([[35,-28.6]])[0][0],kBl=K(0.4),mBl=x=>bcx*cz+(x-bcx)*kBl;
  bd_formP(c,MP(H(G.bill),mBl),col,"rgb(30,32,40)",1,0.6);
  const ce=H([[33.2,-29.9]])[0];c.beginPath();c.ellipse(tn?mBl(ce[0]):ce[0],ce[1],1.7*Math.max(0.55,kBl),0.95,-0.12+ha,0,TAU);c.fillStyle="rgba(236,236,230,0.92)";c.fill();
  const e=H([[27.4,-30.6]])[0],ek=tn?Math.sqrt(cz*cz+0.3*sn*sn):1,eye=(ex,al)=>{c.save();c.globalAlpha*=al;c.translate(ex,e[1]);c.scale(ek,Math.max(0.1,L.bl));
    c.fillStyle="rgba(255,150,60,0.35)";c.beginPath();c.arc(0,0,2.8,0,TAU);c.fill();c.fillStyle="rgb(255,138,40)";c.beginPath();c.arc(0,0,1.9,0,TAU);c.fill();
    c.fillStyle="rgb(14,10,8)";c.beginPath();c.arc(0.1,0,1,0,TAU);c.fill();c.fillStyle="rgba(255,250,240,0.9)";c.beginPath();c.arc(0.55*BD_S.f,-0.55,0.38,0,TAU);c.fill();c.restore();};
  eye(tn?e[0]*cz-4.2*sn:e[0],1);if(tn&&cz<0.5)eye(e[0]*cz+4.2*sn,1-sstep(0,0.5,cz));
  if(fly>0.01)drawWing(Wn,1,0);}
/* a flight through timed points, for a scene: keys [[time, x, y, face], ...]; a smooth curve through them (Catmull-Rom), hovering with a
   little wander where it's slow. Returns {x, y, vx, vy, face} (vx, vy in px a second) */
function bd_flight(t,keys){const n=keys.length,K=i=>keys[clamp(i,0,n-1)],R={x:keys[0][1],y:keys[0][2],vx:0,vy:0,face:keys[0][3]==null?1:keys[0][3]};if(t==null)return R;
  let k=0;while(k<n-2&&t>keys[k+1][0])k++;const a=K(k-1),b=K(k),c=K(k+1),d=K(k+2),T0=b[0],T1=c[0],dt=(T1-T0)||1,u=clamp((t-T0)/dt,0,1);
  const cr=(p0,p1,p2,p3)=>0.5*(2*p1+(-p0+p2)*u+(2*p0-5*p1+4*p2-p3)*u*u+(-p0+3*p1-3*p2+p3)*u*u*u),dcr=(p0,p1,p2,p3)=>0.5*((-p0+p2)+2*(2*p0-5*p1+4*p2-p3)*u+3*(-p0+3*p1-3*p2+p3)*u*u);
  if(t<=keys[0][0]||t>=keys[n-1][0]){const e=t<=keys[0][0]?keys[0]:keys[n-1];R.x=e[1];R.y=e[2];R.face=e[3]==null?1:e[3];}
  else{R.x=cr(a[1],b[1],c[1],d[1]);R.y=cr(a[2],b[2],c[2],d[2]);R.vx=dcr(a[1],b[1],c[1],d[1])/dt;R.vy=dcr(a[2],b[2],c[2],d[2])/dt;
    R.face=lerp(b[3]==null?1:b[3],c[3]==null?1:c[3],sstep(0,1,u));}
  const w=1-clamp(Math.hypot(R.vx,R.vy)/220,0,1);R.x+=w*(4*Math.sin(t*2.3)+2*Math.sin(t*5.1+1));R.y+=w*(5*Math.sin(t*3.1+1)+2*Math.sin(t*6.7));
  R.vx+=w*(9.2*Math.cos(t*2.3));R.vy+=w*(15.5*Math.cos(t*3.1+1));return R;}
/* a bird's errands, for a scene: keys [[time, x, y, peck], ...], the times it arrives. Between two keys it walks (short, level moves, at a
   pigeon's pace: about three steps a second) or flies a hop (long or steep ones: a second or more, low), in the last moments before it's due;
   if it must turn to go, it turns first, on the ground, by way of facing us; it pecks on arriving if peck. s is its size (for its stride).
   Returns its place and pose, for pigeon(): {x, y, face, walk, step, fly, flap, peck, pitch} */
function bd_route(t,keys,s){s=s||1;const n=keys.length,R={x:keys[0][1],y:keys[0][2],face:1,walk:0,step:0,fly:0,flap:0,peck:0,pitch:0};if(t==null||n<2)return R;
  const seg=[];let face=1;{const d0=keys[1][1]-keys[0][1];if(Math.abs(d0)>24&&d0<0)face=-1;}
  for(let k=1;k<n;k++){const A=keys[k-1],B=keys[k],dx=B[1]-A[1],dy=B[2]-A[2],dist=Math.hypot(dx,dy),fl=dist>150||Math.abs(dy)>40,f0=face;
    if(Math.abs(dx)>24)face=dx<0?-1:1;const tu=f0!==face?0.45:0,room=B[0]-A[0]-(A[3]?0.38:0.05)-tu;
    const D=Math.max(0.05,Math.min(fl?clamp(0.75+dist/800,1,1.4):Math.max(0.4,dist/(s*33)),room));seg.push({A,B,dx,dy,dist,fl,T0:B[0]-D,T1:B[0],f0,f1:face,tu});}
  let j=0;while(j<seg.length-1&&t>=seg[j+1].T0-seg[j+1].tu-0.02)j++;const S=seg[j];
  R.face=S.tu?lerp(S.f0,S.f1,sstep(S.T0-S.tu,S.T0-0.05,t)):S.f1;
  // pecking just after arriving somewhere it meant to peck: a quick jab, the bill striking about 0.13 s in, and back
  keys.forEach(K=>{if(K[3]){const d=t-K[0];if(d>-0.02&&d<0.38)R.peck=Math.max(R.peck,d<0.13?sstep(-0.02,0.13,d):1-sstep(0.15,0.38,d));}});
  if(t<=S.T0){R.x=S.A[1];R.y=S.A[2];return R;}
  if(t>=S.T1){R.x=S.B[1];R.y=S.B[2];return R;}
  const u=(t-S.T0)/(S.T1-S.T0);
  if(S.fl){const e=ease(u),arc=0.1*S.dist;R.x=lerp(S.A[1],S.B[1],e);R.y=lerp(S.A[2],S.B[2],e)-Math.sin(Math.PI*u)*arc;
    R.fly=sstep(0,0.2,u)*(1-sstep(0.8,1,u));R.flap=(t-S.T0)*4.6;R.pitch=0.2*sstep(0,0.12,u)*(1-sstep(0.12,0.45,u))-0.16*sstep(0.7,0.9,u)*(1-sstep(0.9,1,u));}
  else{const e=u-Math.sin(TAU*u)/TAU;R.x=lerp(S.A[1],S.B[1],e);R.y=lerp(S.A[2],S.B[2],e);R.walk=sstep(0,0.12,u)*(1-sstep(0.88,1,u));R.step=S.dist*e/(22*s);}
  return R;}

/* ---------- a honeybee (Apis mellifera), a forager in flight: head with a big compound eye and elbowed antennae, a round furry thorax,
   a narrow waist, a banded abdomen tapering to its tip, legs hanging (the hind ones carry pollen), and two pairs of wings beating too fast
   to see: a blur, with the wing caught now here, now there. Options: a, col (its rim), face (1 right, -1 left, between: turning),
   pitch (radians, nose up), vx and vy (its speed, px a second: it leans into its flight) ---------- */
const BD_BEE={thx:[[-6.4,-2.4],[-4.4,-6.2],[0.4,-7.4],[4.8,-5.6],[6.8,-1],[5.8,3.8],[1.2,6.2],[-4.2,4.8]],
  head:[[7.2,-1.8],[8.8,-4],[11,-4.2],[13,-2],[13.8,1.4],[12.8,4.6],[10.2,5.6],[8,3.6]],
  eye:[[8.6,-2.8],[10,-3.6],[11.2,-2.4],[11.2,0.6],[10.6,3.2],[9.4,3.4],[8.8,0.6]],
  abd:[[-6.2,-1.6],[-10.2,-5.4],[-16.4,-6.8],[-22.2,-5.4],[-26.4,-1.8],[-28.8,3.2,1],[-25.2,6.4],[-19,8],[-12.6,7.4],[-8,4]],
  fw:[[0,0],[5,-1.9],[11,-2.7],[16.6,-2.2],[20.2,-0.4],[20.4,1.4],[17,2.6],[10,2.7],[4,2]],hw:[[0,0],[4,-1.2],[9,-1.6],[12.6,-0.8],[13,0.8],[9,1.8],[3,1.4]],
  fuzz:[[-5.4,-4],[-3.6,-6.6],[-0.8,-7.8],[2,-7.6],[4.4,-6.2],[6.2,-3.6],[-6.8,0.8],[6.6,1.6],[3.8,5.6]].map(([px,py],i)=>{const a=Math.atan2(py+0.5,px),r=0.9+0.5*hash(i,3);
    return[[px,py],[px+Math.cos(a+0.3)*r,py+Math.sin(a+0.3)*r]];})};
function bee(ctx,x,y,s,t,o){o=o||{};const col=o.col||[255,214,90];t=t||0;
  const vx=o.vx||0,vy=o.vy||0,fc=o.face==null?(vx<0?-1:1):o.face,sp=Math.hypot(vx,vy);
  // it hovers nose up, abdomen low; flying fast it levels out and leans into the climb or the dive
  const pitch=o.pitch!=null?o.pitch:0.34*(1-clamp(sp/260,0,1))+clamp(-vy/420,-0.3,0.3)+0.04*Math.sin(t*2.3);
  // turning (face between -1 and 1), it's foreshortened part by part, so its round head and thorax stay round as it faces us
  bd_draw(ctx,x,y,s,Object.assign({},o,{face:fc<0?-1:1,rot:-pitch}),[-32,-26,28,24],c=>bd_bee(c,col,t,Math.min(1,Math.abs(fc))));}
function bd_bee(c,col,t,cz){const G=BD_BEE,fill=bd_fill(c,col,0.45,[-26,-10,16,10]);cz=cz==null?1:clamp(cz,0,1);
  // (the wing caught by the eye: somewhere new each frame of the film, as a strobe would catch a beat of 230 a second)
  const wb=[-0.4,-7],fr=Math.floor(t*30+1e-6),A0=-2.45,A1=-0.5,wa=lerp(A0+0.12,A1-0.12,hash(fr,9)),wf=lerp(A0+0.12,A1-0.12,hash(fr,13));
  // turned from us by the angle whose cosine is cz, each part keeps its girth: seen end on, a part of length l and girth g shows sqrt(cz²l² + (1-cz²)g²)
  // and its paired limbs, set out at an angle b to either side, swing apart: the near one's reach is cos(ph+b), the far one's cos(ph-b) (sg 1, -1),
  // so face on its wings, legs and antennae spread to both sides
  // (a limb pointing back, a hind leg or a wing at the back of its beat, swings the other way from one pointing forward: sg flips for it)
  const sn=1-cz*cz,K=r=>Math.max(0.04,Math.sqrt(cz*cz+r*r*sn)),kH=K(1.3),kT=K(0.92),kA=K(0.58),ph=Math.acos(cz),
    sk=(b,sg)=>{const k=Math.cos(ph+sg*b)/Math.cos(b);return(k<0?-1:1)*Math.max(0.04,Math.abs(k));};
  const at=(x0,x1,k,fn)=>{if(cz>0.999)return fn();c.save();c.translate(x1,0);c.scale(k,1);c.translate(-x0,0);fn();c.restore();};
  const HD=f=>at(10.5,10.5*cz,kH,f),TX=f=>at(0.2,0.2*cz,kT,f),AB=f=>at(-17.5,-17.5*cz,kA,f),
    WG=(sg,an,f)=>at(wb[0],0.2*cz+(wb[0]-0.2)*kT,sk(0.7,Math.cos(an)>=0?sg:-sg),f),LG=(sg,f)=>at(0.2,0.2*cz,sk(0.6,sg),f),AN=(sg,f)=>at(11.8,10.5*cz+1.3*kH,sk(0.5,sg),f);
  // the beat, too fast to see: a faint fan where the wings sweep, the wing at the end of its beat, and caught once between
  const fan=(sg,dim)=>[[A0-0.1,-Math.PI/2],[-Math.PI/2,A1+0.1]].forEach(([a0,a1])=>WG(sg,(a0+a1)/2,()=>{c.save();c.translate(wb[0],wb[1]);c.globalAlpha*=dim;c.fillStyle=bd_g(c,"bee-fan",q=>{const g=q.createRadialGradient(0,0,3,0,0,20.5);g.addColorStop(0,"rgba(210,232,255,0)");
      g.addColorStop(0.55,"rgba(210,232,255,0.035)");g.addColorStop(1,"rgba(210,232,255,0.075)");return g;});c.beginPath();c.moveTo(0,0);c.arc(0,0,20.5,a0,a1);c.closePath();c.fill();c.restore();}));
  const wing=(sg,pts,an,a)=>WG(sg,an,()=>{c.save();c.translate(wb[0],wb[1]);c.rotate(an);c.beginPath();bd_loop(c,pts);c.fillStyle="rgba(214,236,255,"+0.14*a+")";c.fill();
    c.lineWidth=0.8/BD_S.s;c.strokeStyle="rgba(222,240,255,"+0.7*a+")";c.stroke();c.beginPath();bd_path(c,[[1.6,-0.4],[8,-1.3],[14,-1]]);bd_path(c,[[2.4,0.7],[8,0.7],[12.4,1.6]]);
    c.lineWidth=0.45/BD_S.s;c.strokeStyle="rgba(222,240,255,"+0.45*a+")";c.stroke();c.restore();});
  fan(-1,0.35);wing(-1,G.fw,wf,0.3);
  // the legs, slender and hanging: the far ones darker; the hind leg's broad shin carries a ball of pollen
  // (the fore and middle legs reach forward, the hind leg back: face on, each side's legs spread to its own side)
  const legs=(sg,dx,dy,dim)=>{const fs=rgba(mix(mix(col,[70,50,24],0.55),[6,8,12],dim),0.96);
    LG(sg,()=>{c.beginPath();bd_tube(c,[[3.2+dx,4.6+dy],[5.4+dx,7.6+dy],[8+dx,8+dy],[9.6+dx,9.6+dy]],[0.5,0.42,0.32,0.22]);
      bd_tube(c,[[0.8+dx,5.4+dy],[1.6+dx,9.4+dy],[0.2+dx,12.6+dy],[0.8+dx,15.4+dy]],[0.5,0.42,0.32,0.22]);c.fillStyle=fs;c.fill();});
    LG(-sg,()=>{c.beginPath();bd_tube(c,[[-2.4+dx,4.6+dy],[-4.8+dx,9+dy],[-7.4+dx,13.6+dy],[-8.8+dx,17.2+dy],[-9.4+dx,19.6+dy]],[0.55,0.5,0.95,0.4,0.22]);c.fillStyle=fs;c.fill();});};
  // (both hind legs carry a load of pollen, a lump that stays round however the leg turns: the far one's darker)
  const pol=(sg,x,y,fs)=>{const k=cz>0.999?1:sk(0.6,-sg);c.beginPath();c.ellipse(0.2*cz+(x-0.2)*k,y,1.5*Math.max(0.75,Math.abs(k)),2.1,0.5*Math.sign(k),0,TAU);c.fillStyle=fs;c.fill();};
  legs(-1,-1.8,-0.4,0.6);pol(-1,-8.8,13,"rgba(128,86,34,0.95)");
  AB(()=>bd_glow(c,"bee-a",[-30,-9,-5,9],[q=>bd_loop(q,G.abd)],col,1.8));TX(()=>bd_glow(c,"bee-t",[-8,-9,8,8],[q=>bd_loop(q,G.thx)],col,1.8));
  HD(()=>bd_glow(c,"bee-h",[6,-6,15,7],[q=>bd_loop(q,G.head)],col,1.8));
  // the abdomen: each band amber in front, dark behind, a line of pale hair at its front edge
  AB(()=>{bd_formP(c,G.abd,col,fill,1.8,1);
    c.save();c.beginPath();bd_loop(c,G.abd);c.clip();c.beginPath();
    [[-9.4,1],[-13.2,0.85],[-17,0.55],[-20.8,0.3],[-24.4,0.14]].forEach(([bx,k])=>{c.beginPath();bd_tube(c,[[bx+0.4,-8],[bx-0.6,-3],[bx-0.9,1.6],[bx-0.4,6],[bx+0.4,9]],[1,1.05,1.1,1.05,1]);
      c.fillStyle="rgba(226,150,58,"+0.7*k+")";c.fill();});
    bd_strk(c,[[[-8,-7],[-9.2,-2],[-9.5,2.4],[-8.8,7]],[[-11.8,-7],[-13,-2],[-13.3,2.4],[-12.6,7]],[[-15.6,-7],[-16.8,-2],[-17.1,2.4],[-16.4,7]]],[255,232,180],0.3,0.55);
    c.fillStyle=bd_lin(c,"bee-hl",-18,-7,-18,8,[[0,"rgba(255,240,200,0.16)"],[0.45,"rgba(255,240,200,0)"]]);c.fillRect(-30,-8,26,18);c.restore();});
  // the thorax: round and furry, lit ginger at the top; the near legs, the pollen
  TX(()=>{bd_formP(c,G.thx,col,fill,1.8,1);
    c.beginPath();bd_loop(c,G.thx);c.fillStyle=bd_rad(c,"bee-thx",-1,-5,9,[[0,"rgba(214,160,86,0.72)"],[1,"rgba(214,160,86,0)"]]);c.fill();
    bd_strk(c,G.fuzz,[240,200,130],0.6,0.4);});
  legs(1,0,0,0);pol(1,-7,13.4,"rgb(246,182,70)");c.beginPath();const pk=cz>0.999?1:sk(0.6,-1);c.ellipse(0.2*cz+(-7.4-0.2)*pk,12.7,0.6,0.8,0.5,0,TAU);c.fillStyle="rgba(255,236,150,0.85)";c.fill();
  // the head: a big compound eye, elbowed antennae (the far one darker), mouthparts folded under
  const aw=0.12*Math.sin(t*1.9)+0.06*Math.sin(t*3.7),ant=(dx,dy,ph,cl)=>{c.beginPath();bd_tube(c,[[11.8+dx,-2.4+dy],[13+dx,-5+dy],[14+dx,-7.2+dy]],[0.36,0.32,0.3]);
    bd_tube(c,bd_rot([[14+dx,-7.2+dy],[16.6+dx,-7.4+dy],[19+dx,-6+dy],[20.4+dx,-3.8+dy]],14+dx,-7.2+dy,aw+ph),[0.32,0.3,0.28,0.26]);c.fillStyle=cl;c.fill();};
  AN(-1,()=>ant(-1.2,0.2,0.25,rgba(mix(col,[20,16,10],0.6),1)));
  const Hq=cz>0.999?G.head:G.head.map(q=>[10.5+(q[0]-10.5)*(1-0.34*(1-cz)*clamp((q[1]+1)/6.5,0,1)),q[1]]),Sn=Math.sqrt(sn),ek=Math.sqrt(cz*cz+0.3*sn),
    eye=(ex,al)=>{if(al<=0.01)return;c.save();c.globalAlpha*=al;c.translate(ex,0);c.scale(ek,1);c.translate(-10,0);c.beginPath();bd_loop(c,G.eye);
      c.fillStyle=bd_lin(c,"bee-eye",9,-4,13,4,[[0,"rgba(92,80,64,0.95)"],[1,"rgba(26,22,20,0.95)"]]);c.fill();c.fillStyle="rgba(255,244,210,0.5)";c.beginPath();c.ellipse(9.9,-2,0.6,0.4,-0.5,0,TAU);c.fill();c.restore();};
  HD(()=>{bd_formP(c,Hq,col,fill,1.7,1);bd_strk(c,[[[11.8,-2.6],[12.9,-3.2]],[[12.6,-0.4],[13.8,-0.6]],[[12.4,2.4],[13.4,2.8]]],[240,200,130],0.55,0.35);
    // (face on, the hairy face between the eyes)
    if(cz<0.6){c.save();c.globalAlpha*=1-sstep(0.05,0.6,cz);c.beginPath();bd_loop(c,Hq);c.clip();c.fillStyle=bd_rad(c,"bee-face",10.8,0.4,4.4,[[0,"rgba(214,160,86,0.5)"],[1,"rgba(214,160,86,0)"]]);c.fillRect(5,-6,12,13);c.restore();}});
  eye(10*cz-3.1*Sn,1);if(cz<0.6)eye(10*cz+3.1*Sn,1-sstep(0.05,0.6,cz));
  AN(1,()=>ant(0,0,0,rgba(mix(col,[40,30,16],0.3),1)));
  HD(()=>bd_lines(c,[[[11.6,5.2],[12.2,7],[11.4,8.4]]],mix(col,[40,30,16],0.45),0.9,0.4,0.2));
  // the near wings over the body: at the back of the beat, and caught
  fan(1,0.45);wing(1,G.fw,A0,0.24);wing(1,G.fw,lerp(A0,A1,0.5),0.16);wing(1,G.fw,A1,0.22);wing(1,G.hw,wa+0.2,0.35);wing(1,G.fw,wa,0.55);}

/* ---------- a martial eagle (Polemaetus bellicosus), soaring, seen from below as the vervets see it: long broad wings with six slotted
   "fingers" at each tip curling up, a short broad tail, a big head with a hooked bill; a dark head and bib, a white belly with dark spots,
   a dark underwing (coverts darkest) with barred flight feathers. It's a small 3D model (x forward, y to its right wing, z up), turned and
   banked, projected for a viewer looking up; the wings flex, the tail twists to steer, the head turns. Options: a, t, yaw (its heading:
   0 toward us, negative to our left), bank (radians, right wing down), elev (how steeply we look up), seed ---------- */
// a wing, in its own frame (x forward, y out along it): long and broad, the leading edge nearly straight out to a broad hand, the trailing edge
// held back, bulging a little at the secondaries and pinched at the body; six slotted primaries ("fingers") spread across the hand's whole
// width, the middle ones longest, fanned by sp
function bd_eagleWing(sp){const o=[[7,6.2],[10.4,16],[12,27],[12.4,38],[11.8,48],[10.8,56],[9.4,62]],F=[],n=6;
  // the six emarginated primaries (P10, the outermost, first), their roots across the hand
  for(let i=0;i<n;i++){const u=i/(n-1),rx=lerp(7.4,-19.6,u),ry=lerp(63.4,66.2,u)+2.4*u*(1-u),an=(-0.34+u*0.98)*sp,l=[13.4,18.6,21,20.4,17.2,12.6][i],
    w0=[2.45,2.85,3.05,3.05,2.95,2.85][i],dx=-Math.sin(an),dy=Math.cos(an),nx=dy,ny=-dx,q=(k,v)=>{const b=-0.1*l*k*k;return[rx+dx*l*k+nx*(v+b),ry+dy*l*k+ny*(v+b),k*k*l];};
    F.push({f:[q(0.02,w0),q(0.45,w0*0.93),q(0.8,w0*0.72)],tip:[q(0.95,w0*0.4),q(1,-w0*0.06),q(0.94,-w0*0.52)],b:[q(0.5,-w0*0.9),q(0.1,-w0)],axis:[q(0.1,0),q(0.55,0),q(0.9,0)],dk:[q(0.62,0),q(0.8,0),q(0.96,0)],
      tp:q(1.02,-w0*0.1),l});}
  const tr=[[-22.2,66],[-23.2,58],[-24,48],[-24.4,37],[-23.4,25],[-19.8,14],[-14.4,6.4]];return{lead:o,F,tr};}
const BD_EG={body:[[30.8,0,1],[29,3.4],[25,6],[19.8,7.6],[12.6,9.8],[3,11.2],[-7,10.6],[-14.4,8.4],[-19.2,6.6],[-19.2,-6.6],[-14.4,-8.4],[-7,-10.6],[3,-11.2],[12.6,-9.8],[19.8,-7.6],[25,-6],[29,-3.4]],
  tail:[[-16.6,6.6],[-26,8.2],[-34.6,9],[-39,7.2],[-40.8,3.4],[-41.2,0],[-40.8,-3.4],[-39,-7.2],[-34.6,-9],[-26,-8.2],[-16.6,-6.6]],
  spots:[[-3,3.4],[-6,-4],[-9.6,1.2],[-12.6,4.6],[-12,-3],[-2,-2],[-15.2,-0.8],[-7.6,6.4],[-5,-7],[0.6,5.8]],
  cov:[[6.6,7],[9.8,17],[11.2,28],[11.6,39],[11,49],[9.8,57],[7.2,62],[-1.4,60.4],[-7.6,47],[-9,28],[-6.8,8]],W1:bd_eagleWing(1),
  belly:[[7,-9.4],[1.6,-5.4],[0.4,0],[1.6,5.4],[7,9.4],[3,10.4],[-7,9.9],[-14,7.9],[-18.4,6],[-18.4,-6],[-14,-7.9],[-7,-9.9],[3,-10.4]]};
function eagle(ctx,x,y,s,col,o){o=o||{};col=col||EAG;const t=o.t,k=o.seed||5,tt=t==null?0:t,b0=o.bank==null?0.12:o.bank;
  const L={yaw:(o.yaw==null?-0.62:o.yaw)*(o.flip?-1:1)+(t==null?0:0.07*Math.sin(tt*0.31+k)),bank:b0+(t==null?0:0.05*Math.sin(tt*0.47+k)),b0,
    elev:o.elev==null?1.2:o.elev,pitch:0.08,dih:0.11+(t==null?0:0.022*Math.sin(tt*0.74+k)),curl:0.018+(t==null?0:0.0045*Math.sin(tt*0.74+k+0.9)),
    sp:1+(t==null?0:0.05*Math.sin(tt*0.93+k)),flex:t==null?0:0.035*Math.sin(tt*0.61+k),tw:t==null?0:0.14*Math.sin(tt*0.57+k*2),hd:t==null?0.1:0.34*bd_hold(t,61+k,2.8,0.5)};
  // (its pose first, so it's drawn within its actual reach: a fading eagle is drawn whole on a layer, and a smaller layer costs less)
  const E=bd_eagleGeo(L),P=[].concat(...E.wings.map(w=>w.Q),E.tl,E.bb),X=P.map(q=>q[0]),Y=P.map(q=>q[1]);
  bd_draw(ctx,x,y,s,Object.assign({},o,{flip:false,face:1}),[Math.min(...X)-6,Math.min(...Y)-6,Math.max(...X)+6,Math.max(...Y)+6],c=>bd_eagle(c,col,L,E));}
// the eagle in 3D, for a pose L: its projection P, its wings (outline, feather lines), tail and body (with the turned head), each on screen
function bd_eagleGeo(L){
  // the frame: heading, pitch, bank; then a viewer looking up at elev
  const cy=Math.cos(L.yaw),sy=Math.sin(L.yaw),f0=[sy,0,cy],r0=[-cy,0,sy],u0=[0,1,0],cp=Math.cos(L.pitch),spp=Math.sin(L.pitch);
  const f1=[f0[0]*cp+u0[0]*spp,f0[1]*cp+u0[1]*spp,f0[2]*cp+u0[2]*spp],u1=[u0[0]*cp-f0[0]*spp,u0[1]*cp-f0[1]*spp,u0[2]*cp-f0[2]*spp];
  const cb=Math.cos(L.bank),sb=Math.sin(L.bank),r2=[r0[0]*cb-u1[0]*sb,r0[1]*cb-u1[1]*sb,r0[2]*cb-u1[2]*sb],u2=[u1[0]*cb+r0[0]*sb,u1[1]*cb+r0[1]*sb,u1[2]*cb+r0[2]*sb];
  const ce=Math.cos(L.elev),se=Math.sin(L.elev);
  const P=(x,y,z)=>{const X=x*f1[0]+y*r2[0]+z*u2[0],Y=x*f1[1]+y*r2[1]+z*u2[1],Z=x*f1[2]+y*r2[2]+z*u2[2];return[X,-(Y*ce+Z*se),Y*se-Z*ce];};
  const PP=(pts,z,side)=>pts.map(q=>{const r=P(q[0],q[1]*(side||1),(q[2]||0)+(z||0));const o=[r[0],r[1]];if(q[3])o.push(1);return o;});
  // a wing: its outline in 3D, lifted in a shallow V (dih) and curling up toward the tips; side 1 right, -1 left
  const W=Math.abs(L.sp-1)<1e-6?BD_EG.W1:bd_eagleWing(L.sp),wz=y=>L.dih*y+L.curl*Math.max(0,y-44)*Math.max(0,y-44)*0.5,fx=(x,y)=>x-L.flex*Math.max(0,y-30);
  const lift=q=>[fx(q[0],q[1]),q[1],wz(q[1])+(q[2]||0)*L.curl*14],on=(q,sd)=>{const r=P(q[0],q[1]*sd,q[2]);return[r[0],r[1]];};
  const wing=side=>{const pts=[],bars=[];
    W.lead.forEach(q=>pts.push(lift([q[0],q[1]])));
    W.F.forEach(F=>{F.f.forEach(q=>{const v=lift(q);v.push(0.5,0);pts.push(v);});F.tip.forEach((q,j)=>{const v=lift(q);v.push(0.45,j===1?1:0);pts.push(v);});F.b.forEach(q=>{const v=lift(q);v.push(0.5,0);pts.push(v);});bars.push(F.axis.map(lift));});
    W.tr.forEach(q=>pts.push(lift([q[0],q[1]])));
    const hull=[].concat(W.lead,W.F.map(F=>F.tp),W.tr).map(q=>on(lift(q),side));
    return{Q:pts.map(q=>{const o=on(q,side);if(q[4]||q[3])o.push(q[4]?1:0,q[3]||1);return o;}),hull,bars:bars.map(b=>b.map(q=>on(q,side))),dk:W.F.map(F=>F.dk.map(q=>on(lift(q),side))),
      cov:PP(BD_EG.cov.map(lift),-0.2,side),bl:[0.35,0.62,0.88].map(v=>PP([[lerp(-9,-13.6,v),9],[lerp(-9,-22.2,v),24],[lerp(-9,-23.2,v),40],[lerp(-8.4,-22.6,v),54],[lerp(-6,-21,v),64]].map(lift),0,side)),
      side,depth:P(-4,40*side,wz(40))[2]};};
  const hr=L.hd,c2=Math.cos(hr),s2=Math.sin(hr),R=q=>{const x0=q[0]-13,r=[13+x0*c2-q[1]*s2,x0*s2+q[1]*c2];if(q[2])r.push(0,1);return r;};
  return{P,PP,wings:[wing(1),wing(-1)].sort((a,b)=>b.depth-a.depth),tl:PP(BD_EG.tail.map(q=>[q[0],q[1]*(1+0.08*Math.abs(L.tw)),L.tw*4*q[1]/9]),-1.2),
    bb:PP(BD_EG.body.map(q=>q[0]<13?q:R(q)),-3.2),bodyDepth:P(0,0,-3.2)[2],c2,s2};}
function bd_eagle(c,col,L,E){E=E||bd_eagleGeo(L);const{P,PP,wings,tl,bb,bodyDepth,c2,s2}=E;
  const fill=bd_fill(c,col,0.3,[-60,-60,60,60]),dk=rgba(mix(mix(col,BD_INK,0.55),[6,9,16],0.72),0.95),
    wf=bd_lin(c,"eg-w"+col,-60,-60,60,60,[[0,rgba(mix(mix(mix(col,BD_INK,0.55),[6,9,16],0.3),[180,198,222],0.2),0.97)],[1,rgba(mix([8,12,22],[180,198,222],0.2),0.97)]]),
    tf=bd_lin(c,"eg-t"+col,-60,-60,60,60,[[0,rgba(mix(mix(mix(col,BD_INK,0.55),[6,9,16],0.3),[200,218,240],0.26),0.97)],[1,rgba(mix([8,12,22],[200,218,240],0.26),0.97)]]);
  // its glow, made fresh from its pose each frame (it flexes, banks and turns its head, so no kept sprite would fit it)
  {const P=[].concat(...wings.map(w=>w.Q),tl,bb),X=P.map(q=>q[0]),Y=P.map(q=>q[1]);
    bd_glowLive(c,[Math.min(...X),Math.min(...Y),Math.max(...X),Math.max(...Y)],[q=>{wings.forEach(w=>bd_loop(q,w.hull));bd_loop(q,tl);bd_loop(q,bb);}],col,2.1,1);}
  // a wing: coverts darkest, the flight feathers barred, a dark band near the trailing edge; the fingers darken to their tips
  const drawWings=ws=>{if(!ws.length)return;ws.forEach(w=>{bd_formP(c,w.Q,col,wf,2.1,1);c.beginPath();bd_loop(c,w.cov);c.fillStyle=dk;c.fill();});
    bd_strk(c,[].concat(...ws.map(w=>w.bl.slice(0,2).concat(w.bars))),[20,30,48],0.45,0.8);bd_lines(c,[].concat(...ws.map(w=>[w.bl[2]].concat(w.dk))),[10,16,28],0.66,1.1,0.8);};
  drawWings(wings.filter(w=>w.depth>=bodyDepth-2));
  // the tail, barred, twisting as it steers
  bd_formP(c,tl,col,tf,1.9,1);
  bd_strk(c,[[-24,7.4],[-30,8],[-36,7.6]].map(([xx,h])=>PP([[xx,-h],[xx-0.6,0],[xx,h]].map(q=>[q[0],q[1],L.tw*4*q[1]/9]),-1.2)),[20,30,48],0.55,0.9);
  // the body and head: a dark hood and bib, a white belly with dark spots; the head turns
  bd_formP(c,bb,col,fill,2.1,1);
  c.beginPath();bd_loop(c,PP(BD_EG.belly,-3.2));c.fillStyle="rgba(214,228,246,0.5)";c.fill();
  c.beginPath();BD_EG.spots.forEach(q=>{const p=P(q[0],q[1],-3.4);c.moveTo(p[0]+0.9,p[1]);c.ellipse(p[0],p[1],0.9,0.75,0,0,TAU);});c.fillStyle="rgba(12,18,30,0.8)";c.fill();
  drawWings(wings.filter(w=>w.depth<bodyDepth-2));
  // the hooked bill; the eye on the side it shows
  const R=q=>{const x0=q[0]-13;return[13+x0*c2-q[1]*s2,x0*s2+q[1]*c2,q[2]];};
  const B=PP([[26.6,1.8,0],[30.2,1.1,-0.4],[32.2,0,-1.7],[30.2,-1.1,-0.4],[26.6,-1.8,0]].map(R),-3.2);c.beginPath();bd_loop(c,B);c.fillStyle="rgba(24,28,36,0.95)";c.fill();
  c.lineWidth=0.9/BD_S.s;c.strokeStyle=rgba(col,0.8);c.stroke();
  const Ey=[1,-1].map(sd=>{const x0=23.6-13,yy=4.8*sd;return P(13+x0*c2-yy*s2,x0*s2+yy*c2,-1.4);}).sort((a,b)=>a[2]-b[2])[0];bd_eye(c,Ey[0],Ey[1],0.95,col,1);}

/* ---------- an emperor penguin (Aptenodytes forsteri), standing: upright and heavy-bellied, black head and back, a white front washed yellow on
   the upper breast, a bright orange-yellow patch at the side of the neck, a long slender down-curved bill with an orange-pink plate below,
   narrow flippers, a short stiff tail propping it, short black feet. It sways on its feet, turns its head, stirs a flipper.
   Options: t, col (its rim), seed ---------- */
const BD_PG={head:[[-6,-50.4],[0,-53.2],[6,-52.2],[10.4,-49.6],[12.6,-47.3,1],[12.2,-44.1,1],[10,-41.4],[-8.8,-44.8]],
  body:[[9.2,-37],[12.4,-28.6],[16,-15],[19.8,0.6],[21.6,17.2],[18.4,32.4],[11.8,40.8],[1,42.8],[-8.8,41.4],[-16.6,31],[-19,12.6],[-16.6,-10],[-12.2,-27.4],[-9.6,-39]],
  flip:[[-2.6,-27.4],[0.6,-22],[3.4,-12.6],[5.4,-2],[6.8,7.6],[7.2,13.6,1],[4.6,9.4],[0.8,1],[-2.6,-8.4],[-4.8,-17.8],[-5,-24.6]],
  bill:[[12,-47.9],[16.8,-47.5],[21.8,-46.1],[26.6,-43.4,1],[21.8,-44.1],[16.8,-44.3],[12,-44.4]],
  tail:[[-8.6,36.6],[-13.4,41.2],[-18.2,45.2,1],[-14.2,44.6],[-9.4,42.6]],
  foot:[[0,40],[6,41.4],[11,43],[14.2,44.8,1],[10,45.4],[4,45.6],[-1,44.8]]};
function penguin(ctx,x,y,s,o){o=o||{};const col=o.col||[200,220,245],t=o.t,k=o.seed||3;
  const L={br:t==null?0.5:0.5+0.5*Math.sin(t*TAU*0.3+k),sw:t==null?0:0.022*Math.sin(t*0.9+k)+0.008*Math.sin(t*2.1),ha:0.1*bd_hold(t,41+k,3.2,0.45),hy:bd_hold(t,43+k,4.1,0.6),
    fl:t==null?0:0.06*Math.sin(t*1.3+k)+0.1*bd_pulse(t,45+k,5.5,0.3,1.2),bl:bd_blink(t,47+k)};
  bd_draw(ctx,x,y,s,o,[-22,-58,30,50],c=>bd_penguin(c,col,L));}
function bd_penguin(c,col,L){const G=BD_PG;
  // it sways on its feet (the whole bird turns about them); its head turns toward us (hy>0) or away, the bill shortening as it does
  c.translate(2,44);c.rotate(L.sw);c.translate(-2,-44);
  const yw=L.hy*0.35,Hf=p=>bd_rot(p.map(q=>{const r=[q[0]>4?4+(q[0]-4)*(1-Math.abs(yw)*0.35):q[0],q[1]];if(q[2])r.push(1);return r;}),2,-40,L.ha,yw*1.5,0);
  const B=G.body.map((q,i)=>i>=1&&i<=4?[q[0]+L.br*0.6*(i===3?1:0.6),q[1]]:q),hd=Hf(G.head),sil=hd.slice(0,7).concat(B,hd.slice(7));
  const fill=bd_fill(c,col,0.35,[-20,-50,20,40]),inkF=bd_fill(c,col,0.6,[-20,-50,20,40]),Fp=p=>bd_rot(p,-3.6,-25.4,-L.fl,0,0);
  bd_glow(c,"pg",[-20,-56,24,47],[q=>{bd_loop(q,G.tail);bd_loop(q,G.head.slice(0,7).concat(G.body,G.head.slice(7)));}],col,2.3);
  // the far foot, the tail, the near foot
  const ft=(dx,dim)=>{c.beginPath();bd_loop(c,bd_mv(G.foot,dx,0));c.fillStyle=rgba(mix([40,44,56],[6,8,12],dim),1);c.fill();
    c.lineWidth=0.9/BD_S.s;c.strokeStyle=rgba(col,0.55*(1-dim));c.stroke();};
  ft(-5,0.6);bd_formP(c,G.tail,col,inkF,1.4,0.7);
  bd_formP(c,sil,col,fill,2.3,1);ft(1,0);
  c.save();c.beginPath();bd_loop(c,sil);c.clip();
  // the white front, lit from the upper left, shadowed toward the lower right
  c.beginPath();bd_loop(c,Hf([[9,-39.4],[4.4,-38.6]]).concat([[1.4,-30],[0.6,-18],[2.4,-2],[3.2,14],[1.6,30],[-1.6,40],[4,48],[30,48],[30,-38]]));
  c.fillStyle=bd_lin(c,"pg-front",0,-30,24,40,[[0,"rgba(244,247,252,0.95)"],[0.55,"rgba(214,224,238,0.92)"],[1,"rgba(150,166,190,0.9)"]]);c.fill();
  // a wash of pale yellow on the upper breast, and the ear patch, yellow-orange behind the eye, paling as it runs down into it
  c.fillStyle=bd_rad(c,"pg-yel",11,-29,13,[[0,"rgba(255,222,140,0.72)"],[0.6,"rgba(255,226,150,0.3)"],[1,"rgba(255,226,150,0)"]]);c.fillRect(-10,-46,36,36);
  c.beginPath();bd_loop(c,Hf([[-1.8,-46.6],[2,-47.6],[4.8,-44.4],[7.2,-40.4]]).concat([[10,-35.4],[11.8,-30.6],[8.6,-32],[4.6,-35.6]],Hf([[0.8,-40.2],[-1.4,-43.2]])));
  c.fillStyle=bd_lin(c,"pg-ear",0,-46,10,-31,[[0,"rgba(255,190,84,0.92)"],[0.55,"rgba(255,212,120,0.78)"],[1,"rgba(255,228,160,0.2)"]]);c.fill();
  // a dark line down the flank, where the black back meets the white
  bd_lines(c,[[[0.8,-26],[0.2,-12],[1.8,4],[2.2,20],[0.6,34]]],[4,6,10],0.8,0.9,0.4);c.restore();
  // the near flipper, hanging a little away from the body
  bd_formP(c,Fp(G.flip),col,inkF,1.6,0.9);
  bd_lines(c,[Fp([[-3.8,-20],[-1.4,-9],[1.8,0.6],[4.8,8.4],[6.8,12.6]])],[226,234,248],0.55,0.45,0.2);
  // the bill (an orange-pink plate along the lower mandible) and the eye
  const bl=Hf(G.bill);bd_formP(c,bl,col,"rgb(14,14,18)",1,0.6);
  c.beginPath();bd_taper(c,Hf([[13.6,-44.9],[17.2,-44.8],[20.6,-44.7]]),0.75,0.3);c.fillStyle="rgba(255,140,104,0.95)";c.fill();
  const e=Hf([[5.6,-46.8]])[0];bd_eye(c,e[0],e[1],0.95,mix(col,[120,130,150],0.4),L.bl,true);}

/* ---------- an ostrich (Struthio camelus), a male, standing: a big body of loose, shaggy black plumage, white plumes at the wings and the tail,
   a long bare neck, a small flat head with a big lashed eye and a broad flat bill, long bare legs: thick thighs, the heel high, scaled shanks,
   two toes (a big one with a stout claw, a small one outside). Its neck sways, its head turns, its plumes stir. Options: t, col (its rim), seed ---------- */
const BD_OS={body:(()=>{const yb=x=>x>-6?16.5-6.5*((x+6)/24)**2:16.5-11*((x+6)/27)**2,P=[[14.6,-14.2],[19.6,-9],[22.4,-2.4],[21.2,4.8],[18.6,9.6]];
    // lobes hanging from the plumage's lower edge, each its own length and width, their tips drooping back
    let x=16.4;for(let i=0;x>-29;i++){const w=5+2.6*hash(i,41),d=1.3+2.2*hash(i,43)+(i===2||i===4?1.4:0);
      P.push([x-w*0.08,yb(x-w*0.08)-0.2]);P.push([x-w*0.42,yb(x-w*0.42)+d*0.8]);P.push([x-w*0.7,yb(x-w*0.7)+d]);x-=w;}
    return P.concat([[-31.4,5.6],[-33.8,0.4],[-36.2,-4.4],[-34,-9.6],[-28.6,-13.8],[-19.4,-17],[-8.6,-18.8],[1.6,-18.4],[9.4,-16.8]]);})()};
function ostrich(ctx,x,y,s,o){o=o||{};const col=o.col||[220,200,180],t=o.t,k=o.seed||4;
  const L={br:t==null?0.5:0.5+0.5*Math.sin(t*TAU*0.22+k),nk:t==null?0:Math.sin(t*0.55+k)*0.7+0.3*Math.sin(t*1.3+k*2),ha:0.1*bd_hold(t,51+k,3,0.5),
    hy:bd_hold(t,53+k,3.7,0.5),bl:bd_blink(t,57+k),pl:t==null?0:Math.sin(t*1.1+k)};
  bd_draw(ctx,x,y,s,o,[-48,-78,42,60],c=>bd_ostrich(c,col,L));}
function bd_ostrich(c,col,L){const G=BD_OS,nk=L.nk,pl=L.pl,skin=[206,170,160],fill=bd_fill(c,col,0.5,[-40,-30,30,20]);
  const br=L.br*0.6,nb=G.body.length,body=G.body.map((q,i)=>i>=nb-4&&i<=nb-2?[q[0],q[1]-br]:q);
  bd_glow(c,"os",[-40,-24,26,22],[q=>bd_loop(q,G.body)],col,2.2);
  // legs: the far one first, darker; thigh, heel, shank, two toes
  const leg=(dx,dy,dim)=>{const hip=[4+dx,8+dy],heel=[-3.2+dx,28.4+dy],ft=[2.6+dx,52.6+dy],sk=rgba(mix(skin,[12,12,18],dim),0.97),ln=rgba(mix(col,[10,12,20],dim),0.5*(1-dim));
    c.beginPath();bd_tube(c,[hip,[1.8+dx,16.4+dy],[-1.2+dx,23.4+dy],heel],[7.5,6,3.8,2.4]);bd_tube(c,[heel,[-1.4+dx,34+dy],[0.9+dx,43+dy],ft],[2.3,1.8,1.55,1.6]);c.fillStyle=sk;c.fill();c.lineWidth=0.9/BD_S.s;c.strokeStyle=ln;c.stroke();
    c.beginPath();bd_taper(c,[[ft[0]-1,ft[1]],[ft[0]+4,ft[1]+0.4],[ft[0]+9.4,ft[1]+1]],1.7,0.8);bd_taper(c,[[ft[0],ft[1]-0.6],[ft[0]+3,ft[1]-0.5],[ft[0]+5.2,ft[1]-0.1]],1.1,0.6);c.fillStyle=sk;c.fill();
    c.beginPath();bd_taper(c,[[ft[0]+9,ft[1]+0.6],[ft[0]+11,ft[1]+1.2]],0.8,0.3);c.fillStyle=rgba(mix([50,40,36],[8,8,10],dim),1);c.fill();
    if(dim<0.5)bd_strk(c,[0,1,2,3,4,5].map(i=>{const u=0.14+i*0.14,px=lerp(heel[0],ft[0],u)+0.2,py=lerp(heel[1],ft[1],u);return[[px+0.5,py],[px+1.8,py+0.3]];}),col,0.45,0.45);};
  leg(-7,-1.5,0.6);
  // the neck: bare, S-curved, swaying gently; the head turns and tilts at its top
  const N=[[12.6,-6],[19.4,-19],[22,-32],[20.4+nk*0.8,-45],[21+nk*1.5,-56],[24.2+nk*2,-64.4]],hp=N[5],yw=L.hy*0.4;
  c.beginPath();bd_tube(c,N,[6.6,4.6,3.6,3.2,3,3.1]);c.fillStyle=bd_lin(c,"os-neck",12,-60,26,-10,[[0,rgba(mix(skin,[240,220,215],0.2),0.97)],[1,rgba(mix(skin,[40,30,34],0.5),0.97)]]);
  c.fill();c.lineWidth=1/BD_S.s;c.strokeStyle=rgba(col,0.85);c.stroke();
  bd_lines(c,[[[16.2,-15],[19.6,-25]],[[19.6,-30],[19.4,-40]],[[18.6,-45],[19+nk*1.2,-53]]],[250,240,236],0.35,0.35,0.12);
  const Hd=p=>bd_rot(p.map(q=>{const r=[q[0]>hp[0]?hp[0]+(q[0]-hp[0])*(1-Math.abs(yw)*0.3):q[0],q[1]];if(q[2])r.push(1);return r;}),hp[0],hp[1],L.ha,hp[0]-24.6+yw*1.2,hp[1]+64.6);
  const head=Hd([[21.4,-66.4],[23.2,-69.4],[27,-70.6],[30.4,-69.2],[32,-67.4],[31.4,-64.6],[27,-63],[23,-63.2]]),bill=Hd([[30.6,-67.6],[34.8,-67],[37.8,-66.1],[38.4,-64.9],[37,-64],[33,-63.6],[30.2,-63.8]]);
  bd_formP(c,head,col,rgba(mix(skin,[60,50,56],0.35),0.97),1.4,0.9);bd_formP(c,bill,col,"rgba(222,196,176,0.95)",1,0.7);
  bd_strk(c,[Hd([[31,-65.3],[34.4,-65.2],[37.6,-65]])],[70,50,48],0.7,0.5);
  const e=Hd([[27.2,-67.4]])[0];bd_eye(c,e[0],e[1],1.55,col,L.bl,true);if(L.bl>0.5)bd_strk(c,[Hd([[25.6,-68.9],[27.2,-69.5],[28.9,-69]])],[20,14,14],0.9,0.45);
  // a plume: soft white feathers, each a drooping tapered wisp from a common base, swaying a little
  const plume=(x0,y0,ang,len,n,spread,a)=>{c.beginPath();const tips=[];for(let i=0;i<n;i++){const u=n>1?i/(n-1):0.5,an=ang+(u-0.5)*spread+pl*0.05*(1+u),l=len*(0.8+0.3*Math.sin(i*2.3+1)),dr=0.28+0.1*u;
      const p=[[x0,y0]];for(let j=1;j<=4;j++){const v=j/4,aa=an+dr*v*v;p.push([x0+Math.cos(aa)*l*v,y0+Math.sin(aa)*l*v]);}bd_tube(c,p,[1.6,2.6,2.8,2.2,0.6]);tips.push(p.slice(0,4));}
    c.fillStyle=bd_lin(c,"os-pl"+a,x0,y0,x0-len,y0+len*0.5,[[0,"rgba(236,232,224,"+a*0.9+")"],[1,"rgba(250,248,242,"+a+")"]]);c.fill();c.lineWidth=0.7/BD_S.s;c.strokeStyle=rgba(col,0.5*a);c.stroke();
    bd_strk(c,tips,[150,144,136],0.45*a,0.3);};
  plume(-31,-8,2.72,15,5,0.9,0.92);
  // the near leg, its bare drumstick coming out from under the plumage
  leg(0,0,0);
  // the body: loose black plumage, its lower edge hanging in soft, shaggy lobes
  bd_formP(c,body,col,fill,2.2,1);
  c.save();c.beginPath();bd_loop(c,body);c.clip();
  bd_strk(c,[[[4,-16],[-2,-12.6],[-9,-11]],[[-4,-6],[-11,-3],[-18,-1.4]],[[8,2],[1,6],[-6,8.4]],[[-14,6],[-20,8.4],[-25,6.2]],[[12,-8],[6,-5],[0,-4.4]]],col,0.26,0.6);
  c.restore();
  {const sw=pl*0.5;c.beginPath();[[8.6,10,3.2,9.5,2.6],[3.2,12.2,2.4,7.5,2.2],[-20,9.4,2.6,8,2.2]].forEach(([x0,y0,dx,l,w])=>bd_taper(c,[[x0,y0],[x0-dx*0.3+sw*0.3,y0+l*0.55],[x0-dx+sw,y0+l]],w,0.35));
    c.fillStyle=fill;c.fill();c.lineWidth=0.6/BD_S.s;c.strokeStyle=rgba(col,0.3);c.stroke();}
  plume(-15,1,2.62,17,6,0.7,0.95);}

/* ===== What's in a word: bodies and minds =====
   A baby who points before she can talk, and the grandmother who looks where she looks; a hand that points (or hands over a letter);
   a scribe's hand pressing a reed into clay; and a brain with one concept cell that lights up.
   People follow the series' character style (people.js: litFill, seam, outlined); the brain is an icon, like the film's creatures.
   Everything moves with t alone, and static detail is drawn once into offscreen canvases. */

/* ---------- shapes: smooth outlines, tapering tubes ---------- */
// a smooth curve through points (Catmull-Rom, as beziers); closed or open
function by_curve(ctx,pts,closed){const n=pts.length;if(n<2)return;const Q=i=>closed?pts[(i+n)%n]:pts[Math.max(0,Math.min(n-1,i))];
  ctx.moveTo(pts[0][0],pts[0][1]);const m=closed?n:n-1;
  for(let i=0;i<m;i++){const p0=Q(i-1),p1=Q(i),p2=Q(i+1),p3=Q(i+2);
    ctx.bezierCurveTo(p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6,p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6,p2[0],p2[1]);}
  if(closed)ctx.closePath();}
// samples of a smooth centreline, with widths eased between the given ones: [[x,y,w],...]
function by_samples(pts,ws,k){const n=pts.length,out=[],Q=i=>pts[Math.max(0,Math.min(n-1,i))];k=k||6;
  for(let i=0;i<n-1;i++){const p0=Q(i-1),p1=Q(i),p2=Q(i+1),p3=Q(i+2);
    for(let j=0;j<k;j++){const u=j/k,u2=u*u,u3=u2*u,f=(a,b,c,d)=>0.5*(2*b+(c-a)*u+(2*a-5*b+4*c-d)*u2+(3*b-a-3*c+d)*u3),e=0.5-0.5*Math.cos(Math.PI*u);
      out.push([f(p0[0],p1[0],p2[0],p3[0]),f(p0[1],p1[1],p2[1],p3[1]),Math.max(0.01,lerp(ws[i],ws[i+1],e))]);}}
  out.push([pts[n-1][0],pts[n-1][1],Math.max(0.01,ws[n-1])]);return out;}
// a limb, a finger or a tail: the outline around a centreline with half-widths ws, and round ends
function by_tube(ctx,pts,ws,k){const S=by_samples(pts,ws,k),n=S.length,L=[],R=[];
  for(let i=0;i<n;i++){const a=S[Math.max(0,i-1)],b=S[Math.min(n-1,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
    L.push([S[i][0]-dy*S[i][2],S[i][1]+dx*S[i][2]]);R.push([S[i][0]+dy*S[i][2],S[i][1]-dx*S[i][2]]);}
  const e=S[n-1],e0=S[n-2],ae=Math.atan2(e[1]-e0[1],e[0]-e0[0]),s0=S[0],s1=S[1],a0=Math.atan2(s1[1]-s0[1],s1[0]-s0[0]);
  ctx.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)ctx.lineTo(L[i][0],L[i][1]);
  ctx.arc(e[0],e[1],e[2],ae+Math.PI/2,ae-Math.PI/2,true);
  for(let i=n-1;i>=0;i--)ctx.lineTo(R[i][0],R[i][1]);
  ctx.arc(s0[0],s0[1],s0[2],a0-Math.PI/2,a0+Math.PI/2,true);ctx.closePath();}
// a stroke that swells in the middle and tapers to fine points: a crease, a fold, a sulcus
function by_taper(ctx,pts,w,k){const S=by_samples(pts,pts.map(()=>1),k||5),n=S.length,L=[],R=[];
  for(let i=0;i<n;i++){const a=S[Math.max(0,i-1)],b=S[Math.min(n-1,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1,q=w*Math.pow(Math.sin(Math.PI*(0.04+0.92*i/(n-1))),0.6);
    L.push([S[i][0]-dy/d*q,S[i][1]+dx/d*q]);R.push([S[i][0]+dy/d*q,S[i][1]-dx/d*q]);}
  ctx.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)ctx.lineTo(L[i][0],L[i][1]);for(let i=n-1;i>=0;i--)ctx.lineTo(R[i][0],R[i][1]);ctx.closePath();}
// fill the current path lit from the upper left, like the series' people, with a soft darker seam

/* ---------- sprites: drawn once, then placed pixel for pixel ---------- */
// Static detail is drawn once into an offscreen canvas, already turned and scaled to the pixels it lands on, so a frame only copies pictures
// (a copy that lands on whole pixels is many times cheaper than one that is turned or scaled). Slow movements stay smooth: a sprite is kept
// for each quarter-pixel offset. A part can carry the luminous edge of the series' people: a figure puts down all its parts' edges first,
// then all their fills, so the edge shows only round the whole silhouette, as outlined() does.
// The cache is bounded by the pixels it holds (about 48 MB of canvases): the least recently used pictures are dropped first, and their memory
// is given back at once (width 0), which matters on phones, where the browser caps the memory of all canvases together.
const BY_CACHE=new Map(),BY_TMP=new Map(),BY_BUDGET=12e6;let BY_PX=0,BY_SCR=null;
function by_evict(keep){for(const [k,sp] of BY_CACHE){if(BY_PX<=BY_BUDGET)break;if(k===keep)continue;BY_CACHE.delete(k);BY_PX-=sp.px;sp.cv.width=sp.cv.height=0;if(sp.rim)sp.rim.width=sp.rim.height=0;}}
// one scratch canvas, reused for every tinting pass (it only grows)
function by_scratch(W,H){if(!BY_SCR||BY_SCR.width<W||BY_SCR.height<H)BY_SCR=mkCanvas(Math.max(W,BY_SCR?BY_SCR.width:0),Math.max(H,BY_SCR?BY_SCR.height:0));
  const c=BY_SCR.getContext("2d");c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation="source-over";c.clearRect(0,0,W,H);return c;}
// draw(c,D) in local units (D: device pixels per unit) inside box, anchored at (x,y) of the context's units and turned by rot.
// o: rim {col,glow,ring,blur} (sizes in units), edge (put down the edge, not the fill: simply drawn over, a blend mode costs three times as much), op (a compositing mode), rq (the turning step), sub:false (whole pixels only),
// live (one picture, drawn unturned, then placed and turned as it is copied: for parts that keep moving, so the cache doesn't fill with near-copies;
// a turned copy costs about 0.1 ms for a small part, 0.4 ms for a long limb), merge and rimCut (below)
function by_blit(ctx,key,x,y,rot,box,draw,o){o=o||{};const m=ctx.getTransform(),d=Math.hypot(m.a,m.b)||1,base=Math.atan2(m.b,m.a),D=Math.round(d*32)/32,live=!!o.live;
  const px=m.a*x+m.c*y+m.e,py=m.b*x+m.d*y+m.f;let R=0,fx=0,fy=0,ix=0,iy=0,k;
  if(live)k=key+"|"+D+"|L";
  else{const rq=o.rq||0.004;R=Math.round((rot+base)/rq)*rq;ix=Math.floor(px);iy=Math.floor(py);if(o.sub!==false){fx=Math.round((px-ix)*4)/4;fy=Math.round((py-iy)*4)/4;}k=key+"|"+D+"|"+R.toFixed(4)+"|"+fx+"|"+fy;}
  let sp=BY_CACHE.get(k);
  if(sp&&sp.cv.width){BY_CACHE.delete(k);BY_CACHE.set(k,sp);}
  else{const rim=o.rim,g=rim?rim.blur*1.05+rim.ring+1:1,cs=Math.cos(R)*D,sn=Math.sin(R)*D;
    const C=[[box[0]-g,box[1]-g],[box[2]+g,box[1]-g],[box[0]-g,box[3]+g],[box[2]+g,box[3]+g]].map(([u,v])=>[u*cs-v*sn+fx,u*sn+v*cs+fy]);
    const X0=Math.floor(Math.min(...C.map(q=>q[0]))),Y0=Math.floor(Math.min(...C.map(q=>q[1]))),W=Math.max(1,Math.ceil(Math.max(...C.map(q=>q[0])))-X0),H=Math.max(1,Math.ceil(Math.max(...C.map(q=>q[1])))-Y0);
    const cv=mkCanvas(W,H),c=cv.getContext("2d");c.setTransform(cs,sn,-sn,cs,fx-X0,fy-Y0);c.lineJoin="round";c.lineCap="round";draw(c,D);sp={cv,X0,Y0,px:W*H};
    if(rim){const tx=by_scratch(W,H);tx.drawImage(cv,0,0);tx.globalCompositeOperation="source-in";tx.fillStyle=rgba(rim.col,1);tx.fillRect(0,0,W,H);
      const rc=mkCanvas(W,H),rx=rc.getContext("2d");rx.save();rx.shadowColor=rgba(rim.col,rim.glow);rx.shadowBlur=rim.blur*D;rx.globalAlpha=0.65;rx.drawImage(BY_SCR,0,0,W,H,0,0,W,H);rx.restore();
      rx.globalAlpha=0.85;const r=Math.max(0.6,rim.ring*D);for(let i=0;i<8;i++){const a=i/8*TAU;rx.drawImage(BY_SCR,0,0,W,H,Math.cos(a)*r,Math.sin(a)*r,W,H);}
      // only outside the part itself: its fill covers the rest anyway, and while fading nothing tinted shows through it
      rx.globalAlpha=1;rx.globalCompositeOperation="destination-out";rx.drawImage(cv,0,0);
      // o.rimCut: where the part joins another, its edge is taken away (in the part's units)
      if(o.rimCut){rx.save();rx.setTransform(cs,sn,-sn,cs,fx-X0,fy-Y0);rx.fillStyle="#000";o.rimCut(rx);rx.restore();}
      // o.merge: the edge and the fill in one picture, copied once (for a part drawn over the others)
      if(o.merge){rx.globalCompositeOperation="source-over";rx.drawImage(cv,0,0);cv.width=cv.height=0;sp.cv=rc;}else{sp.rim=rc;sp.px*=2;}}
    BY_CACHE.set(k,sp);BY_PX+=sp.px;by_evict(k);}
  if(o.edge&&o.merge)return;const img=o.edge?sp.rim:sp.cv;if(!img||!img.width)return;ctx.save();
  if(live){ctx.setTransform(1,0,0,1,px,py);ctx.rotate(rot+base);}else ctx.setTransform(1,0,0,1,ix,iy);
  if(o.op)ctx.globalCompositeOperation=o.op;ctx.drawImage(img,sp.X0,sp.Y0);ctx.restore();}
// the luminous edge of a part drawn live (a path, not a picture): a soft glow and a fine line in the edge's colour, outside the silhouette once
// the fills go on. The glow is a wide, faint stroke rather than a blur: a blur of a long limb costs about 0.4 ms, a stroke a fifth of that
function by_liveRim(c,path,rim){c.save();c.beginPath();path(c);c.lineJoin="round";const b=rim.blur,k=rim.glow/0.4;
  c.strokeStyle=rgba(rim.col,0.12*k);c.lineWidth=b*1.2;c.stroke();
  c.strokeStyle=rgba(rim.col,0.85);c.lineWidth=2*rim.ring;c.stroke();c.restore();}
// a figure of parts: draw(c,edge) is called for the edges, then for the fills. While it is see-through (fading), it is composed apart first,
// so its parts don't show through each other (unless direct: for figures whose parts barely overlap). box: its extent, in the context's current units.
function by_figure(ctx,box,draw,direct){const a=ctx.globalAlpha;if(a<=0.002)return;if(a>0.985||direct){draw(ctx,true);draw(ctx,false);return;}
  const m=ctx.getTransform(),P=[[box[0],box[1]],[box[2],box[1]],[box[0],box[3]],[box[2],box[3]]].map(([u,v])=>[m.a*u+m.c*v+m.e,m.b*u+m.d*v+m.f]),cw=ctx.canvas.width,ch=ctx.canvas.height;
  const X0=Math.max(0,Math.floor(Math.min(...P.map(p=>p[0])))),Y0=Math.max(0,Math.floor(Math.min(...P.map(p=>p[1])))),X1=Math.min(cw,Math.ceil(Math.max(...P.map(p=>p[0])))),Y1=Math.min(ch,Math.ceil(Math.max(...P.map(p=>p[1]))));
  // a spare canvas close to the figure's size: copying a canvas costs by its whole area, so each size keeps its own
  if(X1<=X0||Y1<=Y0)return;const w=X1-X0,h=Y1-Y0,tk=Math.ceil(w/48)*48+"x"+Math.ceil(h/48)*48;let T=BY_TMP.get(tk);
  if(T){BY_TMP.delete(tk);BY_TMP.set(tk,T);}else{T=mkCanvas(Math.ceil(w/48)*48,Math.ceil(h/48)*48);BY_TMP.set(tk,T);if(BY_TMP.size>3){const [k0,T0]=BY_TMP.entries().next().value;BY_TMP.delete(k0);T0.width=T0.height=0;}}
  const c=T.getContext("2d");c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation="source-over";c.clearRect(0,0,w,h);c.setTransform(m.a,m.b,m.c,m.d,m.e-X0,m.f-Y0);
  draw(c,true);draw(c,false);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(T,0,0,w,h,X0,Y0,w,h);ctx.restore();}
// lit from the upper left of the picture, like the series' people (mir = -1 when the drawing is mirrored)
function by_L(mir,kd){return(c,col,cx,cy,rad,k)=>{const g=c.createLinearGradient(cx-rad*0.8*mir,cy-rad,cx+rad*0.8*mir,cy+rad);g.addColorStop(0,rgba(lighten(col,0.17*(k||1)),1));g.addColorStop(0.55,rgba(col,1));g.addColorStop(1,rgba(darken(col,(kd||0.3)*(k||1)),1));c.fillStyle=g;c.fill();};}

/* ---------- hands ---------- */
// a hand in its own units: the wrist at (0,0), the fingers towards +x, the thumb side towards -y; about 100 from the wrist to the middle fingertip.
// We see its back. pose: "point" (the index out, the others curled under the thumb), "grip" (holding a sheet: the fingers behind it, the thumb on its face),
// "open" (reaching to take something), "rest" (relaxed). o.L: the direction of the light in these units ([-0.7,-0.7] when the hand is upright);
// o.chub: a baby's hand; o.part: "back" (all but the thumb), "thumb" (the thumb alone), or everything
const BY_HANDS={
  point:{palm:[[0,-14],[16,-15],[32,-16],[44,-16],[52,-14],[56,-8],[57,0],[55,8],[51,15],[44,19.5],[30,20.2],[16,18.8],[5,16],[0,13.5]],
    fingers:[{p:[[40,13],[50,15],[55,18]],w:[4.4,4.2,4]},{p:[[43,6],[55,7],[61,10]],w:[4.8,4.7,4.4]},{p:[[45,-2],[58,-2],[65,1]],w:[5.2,5,4.7]},
      {p:[[42,-10],[56,-11],[72,-11],[84,-10.4],[95,-9.2]],w:[5.8,5.4,4.9,4.5,4.1],nail:true,joints:[72,84]}],
    thumb:{p:[[11,-7],[21,-13.5],[31,-17],[42,-17.5],[51,-14.8],[56,-10.5]],w:[5.6,5.3,5,4.7,4.4,4.1],nail:true}},
  grip:{palm:[[0,-14],[16,-15],[32,-16],[44,-16],[53,-14],[57,-8],[58,0],[56,8],[52,15],[45,19.5],[30,20.2],[16,18.8],[5,16],[0,13.5]],
    fingers:[{p:[[41,14],[56,17],[68,19],[76,20]],w:[4.2,3.9,3.6,3.3]},{p:[[44,7],[62,9],[78,11],[88,12]],w:[4.8,4.4,4,3.7]},{p:[[46,-1],[66,0],[84,2],[96,3]],w:[5.2,4.9,4.4,4]},
      {p:[[44,-10],[62,-10],[80,-8],[92,-6]],w:[5.6,5.1,4.6,4.2]}],
    thumb:{p:[[11,-7],[22,-13.5],[35,-16.5],[49,-16],[60,-12],[68,-7]],w:[5.6,5.3,5,4.8,4.6,4.3],nail:true}},
  open:{palm:[[0,-14],[16,-15],[32,-16],[44,-16],[53,-14],[57,-8],[58,0],[56,8],[52,15],[45,19.5],[30,20.2],[16,18.8],[5,16],[0,13.5]],
    fingers:[{p:[[41,14],[56,19],[68,23],[76,26]],w:[4.2,3.9,3.6,3.3]},{p:[[44,7],[62,10],[78,14],[88,16]],w:[4.8,4.4,4,3.7]},{p:[[46,-1],[66,0],[84,1],[96,2]],w:[5.2,4.9,4.4,4]},
      {p:[[44,-10],[62,-12],[80,-12],[92,-11]],w:[5.6,5.1,4.6,4.2]}],
    thumb:{p:[[11,-7],[20,-15],[29,-22],[40,-26.5],[50,-28],[58,-27]],w:[5.6,5.3,5,4.8,4.6,4.3],nail:true}},
  rest:{palm:[[0,-14],[16,-15],[32,-16],[44,-16],[52,-14],[56,-8],[57,0],[55,8],[51,15],[44,19.5],[30,20.2],[16,18.8],[5,16],[0,13.5]],
    fingers:[{p:[[40,14],[54,18],[63,24],[67,30]],w:[4.2,3.9,3.6,3.3]},{p:[[43,7],[59,10],[70,16],[76,23]],w:[4.8,4.4,4,3.7]},{p:[[45,-1],[63,1],[76,7],[84,14]],w:[5.2,4.9,4.4,4]},
      {p:[[43,-10],[61,-10],[76,-6],[86,1]],w:[5.6,5.1,4.6,4.2],nail:true,joints:[61,76]}],
    thumb:{p:[[11,-7],[21,-13],[31,-16.5],[42,-16.5],[51,-13.5],[56,-9]],w:[5.6,5.3,5,4.7,4.4,4.1],nail:true}}};
// a loose fist: the pointing hand with its index curled too (a baby's hand at rest, before it points: only the index moves between the two)
BY_HANDS.fist=Object.assign({},BY_HANDS.point,{fingers:BY_HANDS.point.fingers.slice(0,3).concat([{p:[[42,-10],[50,-10.8],[56,-10.4],[59.5,-8.4],[60,-5.2]],w:[5.8,5.6,5.3,5,4.7]}])});
// a scribe's grip: the reed between the thumb and the curled index, resting on the middle finger; BY_PEN is the reed's line in the hand's units
BY_HANDS.pen={palm:BY_HANDS.point.palm,
  fingers:[{p:[[40,13],[50,15.5],[55,19]],w:[4.4,4.2,4]},{p:[[43,6],[55,8],[61,12]],w:[4.8,4.7,4.4]},{p:[[45,-2],[60,0],[70,5],[75,10]],w:[5.2,5,4.7,4.4]},
    {p:[[42,-10],[58,-11],[71,-7],[79,0],[82,5]],w:[5.8,5.4,4.9,4.5,4.1],nail:true,joints:[71]}],
  thumb:{p:[[11,-7],[22,-13],[35,-15],[48,-12],[59,-6],[66,0]],w:[5.6,5.3,5,4.7,4.4,4.1],nail:true}};
const BY_PEN={pinch:[74,3],dir:[0.84,0.54]};
// a pose between two poses of the same shape (k from 0 to 1)
function by_handMix(a,b,k){if(!b||k<=0)return a;if(k>=1)return b;const P2=(p,q)=>p.map((v,i)=>[lerp(v[0],q[i][0],k),lerp(v[1],q[i][1],k)]),F=(f,g)=>Object.assign({},k>0.5?g:f,{p:P2(f.p,g.p),w:f.w.map((w,i)=>lerp(w,g.w[i],k))});
  return{palm:P2(a.palm,b.palm),fingers:a.fingers.map((f,i)=>F(f,b.fingers[i])),thumb:F(a.thumb,b.thumb)};}
function by_hand(ctx,pose,skin,o){o=o||{};const H=typeof pose==="object"?pose:(BY_HANDS[pose]||BY_HANDS.point),L=o.L||[-0.7,-0.7],ch=o.chub?1:0,part=o.part||"all";
  const shape=pts=>ch?pts.map(([x,y])=>[x<40?x:40+(x-40)*0.78,y*1.08]):pts,wide=ws=>ch?ws.map(w=>w*1.22):ws;
  const lit=(cx,cy,r,c,k)=>{const g=ctx.createLinearGradient(cx+L[0]*r,cy+L[1]*r,cx-L[0]*r,cy-L[1]*r);g.addColorStop(0,rgba(lighten(c,0.18*(k||1)),1));g.addColorStop(0.5,rgba(c,1));g.addColorStop(1,rgba(darken(c,0.3*(k||1)),1));ctx.fillStyle=g;ctx.fill();};
  const line=rgba(darken(skin,0.5),0.5),crease=rgba(darken(skin,0.45),0.45);
  const finger=(f,dim)=>{const p=shape(f.p),w=wide(f.w),c=dim?darken(skin,dim):skin;ctx.beginPath();by_tube(ctx,p,w,4);
    const m=p[Math.floor(p.length/2)];lit(m[0],m[1],9,c);ctx.strokeStyle=line;ctx.lineWidth=1.1;ctx.stroke();
    if(f.nail){const e=p[p.length-1],e0=p[p.length-2],an=Math.atan2(e[1]-e0[1],e[0]-e0[0]),wn=w[w.length-1];ctx.save();ctx.translate(e[0],e[1]);ctx.rotate(an);
      ctx.beginPath();ctx.ellipse(-wn*0.7,-wn*0.12,wn*1.05,wn*0.62,0,0,TAU);ctx.fillStyle=rgba(mix(skin,[255,226,214],0.45),0.9);ctx.fill();ctx.strokeStyle=rgba(darken(skin,0.35),0.5);ctx.lineWidth=0.8;ctx.stroke();ctx.restore();}
    if(f.joints)f.joints.forEach(jx=>{const q=p.reduce((b,v)=>Math.abs(v[0]-jx)<Math.abs(b[0]-jx)?v:b,p[0]);ctx.beginPath();ctx.moveTo(q[0]-1.5,q[1]-w[0]*0.5);ctx.quadraticCurveTo(q[0]+1,q[1],q[0]-1.5,q[1]+w[0]*0.45);ctx.strokeStyle=crease;ctx.lineWidth=0.9;ctx.stroke();});};
  if(part!=="thumb"){
    // the curled or trailing fingers first, a touch darker, then the back of the hand, then the index
    const F=H.fingers;for(let i=0;i<F.length-1;i++)finger(F[i],0.05*(F.length-1-i));
    ctx.beginPath();by_curve(ctx,shape(H.palm),false);ctx.closePath();lit(28,0,26,skin,1);ctx.strokeStyle=line;ctx.lineWidth=1.1;ctx.stroke();
    // tendons and knuckles on the back of the hand, very faint
    ctx.lineWidth=1.3;[-10,-2,6,13].forEach((y1,i)=>{ctx.beginPath();ctx.moveTo(8,y1*0.25);ctx.quadraticCurveTo(28,y1*0.6,46-i*2,y1);ctx.strokeStyle=rgba(lighten(skin,0.3),0.13);ctx.stroke();});
    ctx.fillStyle=rgba(lighten(skin,0.35),0.09);[[50,-11],[52,-2],[50,7],[46,15]].forEach(([x,y])=>{ctx.beginPath();ctx.ellipse(x,y,3.2,2.4,0,0,TAU);ctx.fill();});
    if(o.mid)o.mid(ctx);
    if(!o.thumbUnder)finger(F[F.length-1],0);}
  if(part!=="back")finger(H.thumb,0);
  if(o.thumbUnder&&part!=="thumb")finger(H.fingers[H.fingers.length-1],0);}

/* ---------- arms ---------- */
const BY_SKIN={stranger:[134,90,62],envoy:[228,186,152],host:[146,98,70],scribe:[170,118,80]};
const BY_HOFF=[-4,-2],BY_WEAVE=[192,160,116],BY_CORD=[176,88,58],BY_WARMRIM=[255,214,170];
// pointArm(ctx,x0,y0,x1,y1,s,a[,o]): an arm from (x0,y0), off the picture's edge, to the wrist at (x1,y1); s = 1 for a hand about 90 px long.
// The arm has an elbow: a forearm of about 1.3 hands, then the upper arm, bent a little (o.bend, in radians) so that the elbow hangs below the
// line from (x0,y0) to the wrist. o.pose: "point" | "give" | "take" (a hand holding out a sheet, or closing on it); o.dress: "bare" (the edge of
// a coarse woven sleeve, a cord at the wrist) or "coat" (a dark sleeve and a shirt cuff). o.at: a point the index aims at (the wrist bends
// towards it); o.k: how far a "take" hand has closed (0 to 1); o.card: [x,y,w,h,rot] of the sheet it holds, so the fingers pass behind it; o.t: seconds.
// A hand coming from the right is mirrored, so its thumb stays on top.
function pointArm(ctx,x0,y0,x1,y1,s,a,o){o=o||{};withA(ctx,a==null?1:a,()=>by_arm(ctx,x0,y0,x1,y1,s,o));}
// a path round a centreline (pts, half-widths ws), cut straight at its far end and at its near end, the near cut slanted by sl
function by_band(c,pts,ws,sl){const S=by_samples(pts,ws,6),n=S.length,L=[],R=[];
  for(let i=0;i<n;i++){const a=S[Math.max(0,i-1)],b=S[Math.min(n-1,i+1)];let dx=b[0]-a[0],dy=b[1]-a[1];const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;L.push([S[i][0]-dy*S[i][2],S[i][1]+dx*S[i][2]]);R.push([S[i][0]+dy*S[i][2],S[i][1]-dx*S[i][2]]);}
  const e=S[n-1],e0=S[n-2],tx=(e[0]-e0[0]),ty=(e[1]-e0[1]),td=Math.hypot(tx,ty)||1;
  c.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)c.lineTo(L[i][0]-(i===n-1?tx/td*sl:0),L[i][1]-(i===n-1?ty/td*sl:0));
  c.lineTo(R[n-1][0]+tx/td*sl,R[n-1][1]+ty/td*sl);for(let i=n-2;i>=0;i--)c.lineTo(R[i][0],R[i][1]);c.closePath();}
// the arm, in units with the wrist at (0,0), the forearm along -x to the elbow at (-Fa,0), and the upper arm leaving the elbow towards angle dir, Ua long
function by_armShape(c,Fa,Ua,dir,coat,skin,cloth,La,o){const E=[-Fa,0],U=a=>[E[0]+Math.cos(dir)*a,E[1]+Math.sin(dir)*a],inn=Math.sin(dir)<0?-1:1;
  const lit=(c,col,k,w)=>{const g=c.createLinearGradient(La[0]*w,La[1]*w,-La[0]*w,-La[1]*w);g.addColorStop(0,rgba(lighten(col,0.16*(k||1)),1));g.addColorStop(0.55,rgba(col,1));g.addColorStop(1,rgba(darken(col,0.34*(k||1)),1));c.fillStyle=g;c.fill();};
  const tap=(q,w,col,a)=>{c.beginPath();by_taper(c,q,w);c.fillStyle=col;c.globalAlpha=a;c.fill();c.globalAlpha=1;};
  if(coat){// the coat's sleeve: the forearm, the elbow with its folds on the inside of the bend, the upper arm; its hem cut straight, a little slanted
    const pts=[U(Ua),U(Ua*0.5),E,[-Fa*0.45,0],[-4,0]],ws=[29,28.6,27.4,25,23.2];
    c.beginPath();by_band(c,pts,ws,2.6);lit(c,cloth,1.3,28);seam(c,cloth,0.55,1.4);
    c.save();c.beginPath();by_band(c,pts,ws,2.6);c.clip();
    // folds: fanning from the inside of the elbow, a soft one along the forearm, a sheen along the lit edge
    const ie=[E[0]+6,E[1]+inn*22];[[0,-1],[18,-0.4],[-16,0.5]].forEach(([dx_,k],i)=>{const a0=[ie[0]+dx_*0.3,ie[1]],a1=[ie[0]+dx_+26*(i===0?1:0.8),ie[1]-inn*(10+4*i)],a2=[ie[0]+dx_*1.6+40,ie[1]-inn*(14+6*i)];
      tap([a0,a1,a2],2.4-0.4*i,rgba(darken(cloth,0.55),1),0.5);c.save();c.translate(-0.8,-1.2);tap([a0,a1,a2],1.1,rgba(lighten(cloth,0.28),1),0.32);c.restore();});
    [U(18),U(40)].forEach((p,i)=>{const q=[[p[0]+6,p[1]+inn*18],[p[0]-4,p[1]+inn*6],[p[0]-10,p[1]-inn*4]];tap(q,1.6,rgba(darken(cloth,0.5),1),0.35);});
    tap([[-Fa*0.9,-inn*14],[-Fa*0.5,-inn*16],[-18,-inn*14]],3,rgba(lighten(cloth,0.22),1),0.18);
    // the lining's shadow just inside the hem
    c.beginPath();c.moveTo(-6.5,-22);c.lineTo(-1.5,22);c.strokeStyle=rgba(darken(cloth,0.6),0.55);c.lineWidth=1.6;c.stroke();c.restore();
return;}
  // a bare arm: the forearm swelling below the elbow and slim at the wrist, the elbow, the upper arm going out of the picture
  const pts=[U(Ua),U(Ua*0.6),U(22),E,[-Fa*0.72,0],[-Fa*0.35,0],[0,0]],ws=[21,20.2,17.6,16.4,18.6,15.4,12.8];
  c.beginPath();by_tube(c,pts,ws,6);lit(c,skin,1.1,20);seam(c,skin,0.4,1.3);
  c.save();c.beginPath();by_tube(c,pts,ws,6);c.clip();
  tap([[-Fa*0.82,-13],[-Fa*0.5,-11],[-18,-8]],3.2,rgba(lighten(skin,0.3),1),0.28);
  tap([[E[0]+4,E[1]+inn*8],[E[0]+10,E[1]+inn*12],[E[0]+18,E[1]+inn*13]],1.3,rgba(darken(skin,0.5),1),0.4);
  c.beginPath();c.ellipse(E[0]-2,E[1]-inn*10,5,3.6,0,0,TAU);c.fillStyle=rgba(lighten(skin,0.2),0.18);c.fill();c.restore();
  // the sleeve: a coarse, undyed cloth woven by hand, its threads uneven, a few thick slubs, loose threads at its edge
  if(o.sleeve!==false){const h0=18,a=dir;c.save();c.translate(E[0],E[1]);c.rotate(a);const X1=Ua+40,wv=BY_WEAVE,edge=[];
    for(let i=0;i<=16;i++){const v=i/16;edge.push([h0+Math.sin(v*9+1)*1.8+(hash(i,7)-0.5)*4.4,-26+v*52]);}
    c.beginPath();c.moveTo(X1,-27);c.lineTo(edge[0][0],-26);edge.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(X1,27);c.closePath();
    const g=c.createLinearGradient(0,-26*inn,0,26*inn);g.addColorStop(0,rgba(lighten(wv,0.14),1));g.addColorStop(0.55,rgba(wv,1));g.addColorStop(1,rgba(darken(wv,0.36),1));c.fillStyle=g;c.fill();seam(c,wv,0.5,1.3);
    c.save();c.clip();let x=h0-2;for(let i=0;x<X1;i++){x+=2.2+hash(i,11)*2.2;const k=hash(i,12);c.beginPath();c.moveTo(x+hash(i,13)*1.5,-28);c.quadraticCurveTo(x+1.2*(hash(i,14)-0.5)*2,0,x+hash(i,15)*1.5,28);
      c.strokeStyle=k<0.5?rgba(darken(wv,0.38),0.34):rgba(lighten(wv,0.28),0.3);c.lineWidth=0.7+k*0.6;c.stroke();}
    let y=-27;for(let i=0;y<27;i++){y+=3+hash(i,21)*3.4;c.beginPath();c.moveTo(h0,y);c.lineTo(X1,y+(hash(i,22)-0.5)*1.4);c.strokeStyle=rgba(darken(wv,0.3),0.14);c.lineWidth=0.6;c.stroke();}
    for(let i=0;i<5;i++){const sx=h0+8+hash(i,31)*(X1-h0-20),sy=-20+hash(i,32)*40;c.beginPath();by_taper(c,[[sx,sy-4],[sx+0.6,sy],[sx,sy+4]],1.1);c.fillStyle=rgba(lighten(wv,0.25),0.5);c.fill();}c.restore();
    // loose threads hanging from the edge, pale against the arm
    c.lineWidth=0.9;edge.forEach((p,i)=>{if(i===0||i===16)return;const l=3+hash(i,41)*5,an=(hash(i,42)-0.5)*0.9;c.strokeStyle=rgba(lighten(wv,0.1+0.2*hash(i,44)),0.85);c.beginPath();c.moveTo(p[0]+1.5,p[1]);c.quadraticCurveTo(p[0]-l*0.5,p[1]+an*2,p[0]-l*Math.cos(an),p[1]+l*Math.sin(an)+1.5);c.stroke();
      if(hash(i,43)>0.55){c.beginPath();c.moveTo(p[0]+1.5,p[1]+1.6);c.lineTo(p[0]-l*0.55,p[1]+2.6+an*3);c.stroke();}});c.restore();}
  // a plain twisted cord at the wrist
  if(o.cord!==false){c.save();c.translate(-11,0);c.beginPath();c.moveTo(-3,-14.4);c.quadraticCurveTo(1,0,-3,14.4);c.lineTo(2.4,14);c.quadraticCurveTo(6.4,0,2.4,-14);c.closePath();lit(c,BY_CORD,1.2,6);seam(c,BY_CORD,0.6,1);
    c.strokeStyle=rgba(darken(BY_CORD,0.45),0.6);c.lineWidth=0.8;for(let i=0;i<7;i++){const yy=-12+i*4;c.beginPath();c.moveTo(-2.2+Math.abs(yy)*0.05,yy);c.lineTo(3+Math.abs(yy)*0.05,yy+2.6);c.stroke();}c.restore();}}
// the shirt's cuff, showing below the coat's sleeve and over the wrist, with a cufflink: in units with the wrist at (0,0), the hand towards +x
function by_cuff(c,silver){c.beginPath();c.moveTo(-4,-17.5);c.quadraticCurveTo(-2,0,-1,17.5);c.lineTo(9.5,16.6);c.quadraticCurveTo(12,0,10.8,-16.8);c.closePath();
  const g=c.createLinearGradient(0,-17,0,17);g.addColorStop(0,"rgba(246,248,252,1)");g.addColorStop(1,"rgba(190,196,210,1)");c.fillStyle=g;c.fill();seam(c,[200,206,216],0.6,1);
  c.beginPath();c.moveTo(4.2,-16.8);c.quadraticCurveTo(6.2,0,6.6,16.8);c.strokeStyle="rgba(150,158,176,0.4)";c.lineWidth=0.8;c.stroke();
  c.beginPath();c.ellipse(4.5,-9,2.3,2.3,0,0,TAU);c.fillStyle=silver?"rgba(214,214,222,1)":"rgba(222,190,110,1)";c.fill();c.strokeStyle="rgba(90,80,60,0.5)";c.lineWidth=0.6;c.stroke();}
// the arm itself, from (x0,y0) to the wrist at (x1,y1)
function by_arm(ctx,x0,y0,x1,y1,s,o){
  const pose=o.pose||"point",coat=(o.dress||(pose==="point"||pose==="pen"?"bare":"coat"))==="coat",t=o.t||0,fl=x1<x0?-1:1;o=Object.assign({silver:fl<0},o);
  const skin=o.skin||(coat?(fl<0?BY_SKIN.host:BY_SKIN.envoy):BY_SKIN.stranger),cloth=o.cloth||(fl<0?[62,62,70]:[42,54,84]);
  // the elbow: the forearm Fa units long, bent by beta at the elbow, which hangs below the line from the shoulder's side to the wrist
  const Fa=coat?132:120,beta=o.bend!=null?o.bend:(coat?0.24:0.08),D=Math.hypot(x1-x0,y1-y0),th=Math.atan2(y1-y0,x1-x0),aS=Math.asin(clamp(Fa*s*Math.sin(beta)/D,-1,1)),aW=beta-aS;
  const an=th-fl*aW,E=[x1-Math.cos(an)*Fa*s,y1-Math.sin(an)*Fa*s],thu=Math.atan2(y0-E[1],x0-E[0]);let rel=thu-an;rel=Math.atan2(Math.sin(rel),Math.cos(rel));
  const dir=fl<0?-rel:rel,Ua=Math.hypot(x0-E[0],y0-E[1])/s+60;
  // the light comes from the upper left of the picture: the same direction, in the arm's own turned (and perhaps mirrored) units
  const rot=(v,r)=>[v[0]*Math.cos(r)-v[1]*Math.sin(r),v[0]*Math.sin(r)+v[1]*Math.cos(r)],La=rot([-0.7,-0.7],-an);La[1]*=fl;
  const calm=o.still||o.card;let bend=0;
  if(o.at){const d=Math.atan2(o.at[1]-y1,o.at[0]-x1)-an;bend=clamp(Math.atan2(Math.sin(d),Math.cos(d))*fl,-0.5,0.5);}
  if(!calm)bend+=Math.sin(t*0.7+x0)*0.012;
  // a hand closing on a sheet: 16 steps, each faded into the next (smooth, and the cache holds only 17 pictures of it)
  const kk=pose==="take"?clamp(o.k==null?1:o.k,0,1)*16:16,k0=Math.floor(kk),kf=kk-k0,HK=q=>BY_HANDS[pose]||(pose==="give"?BY_HANDS.grip:by_handMix(BY_HANDS.open,BY_HANDS.grip,ease(q)));
  const hs=0.9,off=BY_HOFF[coat?1:0],rim={col:o.edge||BY_WARMRIM,glow:0.35,ring:1.2/s,blur:10/s};
  const id=[coat?"coat":"bare",skin.join(","),cloth.join(","),o.sleeve!==false,o.cord!==false,o.silver,fl].join("|"),gid=[Fa,Math.round(Ua),dir.toFixed(3),an.toFixed(3)].join("|");
  const lq=Math.round(bend/0.25),Lh=rot(La,-lq*0.25),hk0="hand|"+pose+"|"+id+"|"+an.toFixed(3)+"|"+lq,hb0=[-8,-44,116,36],hb=(fl<0?[hb0[0],-hb0[3],hb0[2],-hb0[1]]:hb0).map(v=>v*hs);hb[0]=Math.min(hb[0],-8);
  const hx=x1+Math.cos(an)*off*s,hy=y1+Math.sin(an)*off*s;
  // the arm is one picture (its shape does not change), placed on whole pixels; the hand is turned into place when it follows something
  const armPut=(c,e)=>{c.save();c.translate(Math.round(x1),Math.round(y1));c.scale(s,s);by_blit(c,"arm|"+id+"|"+gid,0,0,an,[-Fa-Ua-40,-34,12,34].map((v,i)=>i%2?v:v),cc=>{if(fl<0)cc.scale(1,-1);by_armShape(cc,Fa,Ua,dir,coat,skin,cloth,La,o);},{rim,edge:e,sub:false});c.restore();};
  const handPut=(c,e,part)=>{for(const [kq,al] of [[k0/16,1],[Math.min(16,k0+1)/16,kf]]){if(al<0.01)continue;const H=HK(kq);c.save();c.globalAlpha*=al;c.translate(calm?Math.round(hx):hx,calm?Math.round(hy):hy);c.scale(s,s);by_blit(c,hk0+"|"+kq+"|"+part,0,0,an+fl*bend,hb,(cc,D)=>{
    if(part==="thumb"){cc.shadowColor="rgba(40,24,10,0.35)";cc.shadowBlur=3*hs*D;cc.shadowOffsetY=1.6*hs*D;}cc.save();cc.scale(hs,hs*fl);by_hand(cc,H,skin,{L:Lh,part,thumbUnder:false});cc.restore();if(coat&&part!=="thumb"){cc.scale(1,fl);by_cuff(cc,o.silver);}},
    {rim:part==="thumb"?null:rim,edge:e,sub:false,live:!calm,merge:!calm,rimCut:q=>q.fillRect(-60,-60,64,120)});c.restore();}};
  const mg=48*s,X=[x0,E[0],x1+Math.cos(an)*110*s],Y=[y0,E[1],y1+Math.sin(an)*110*s];
  // fingers behind the sheet: the hand is cut away where the sheet is (the clip spans only the hand's reach), and the thumb lies on its face
  const hr=120*s,near=o.card&&Math.abs(hx-(o.card[0]+o.card[2]/2))<o.card[2]/2+hr&&Math.abs(hy-(o.card[1]+o.card[3]/2))<o.card[3]/2+hr;
  by_figure(ctx,[Math.min(...X)-mg,Math.min(...Y)-mg,Math.max(...X)+mg,Math.max(...Y)+mg],(c,e)=>{armPut(c,e);c.save();
    if(near){const [cx_,cy_,cw,ch,cr]=o.card;c.beginPath();c.rect(hx-hr,hy-hr,2*hr,2*hr);c.save();c.translate(cx_+cw/2,cy_+ch/2);c.rotate(cr||0);c.rect(-cw/2,-ch/2,cw,ch);c.restore();c.clip("evenodd");}
    handPut(c,e,o.card?"back":"all");c.restore();
    if(!e&&o.card)handPut(c,false,"thumb");},true);}

/* ---------- the brain: a side view, facing left, with one concept cell ---------- */
const BY_VIOLET=[200,170,255],BY_WARM=[255,236,160];
// outlines in brain units (the brain is about 240 wide and 200 tall; s scales it): the cortex, the cerebellum tucked under its back, the brainstem
const BY_CORTEX=[[-114,-8],[-111,-30],[-104,-50],[-90,-70],[-72,-84],[-52,-94],[-32,-100],[-12,-102],[10,-102],[21,-100.5],[32,-99],[52,-93],[70,-84],[87,-72],[101,-58],[112,-43],[119,-27],[123,-10],[124,6],[116,26],[102,34],[88,40],[74,45],[60,50],[44,56],[28,60],[10,62],[-6,63],[-22,62],[-36,58],[-48,53],[-58,45],[-65,34],[-62,23],[-70,22],[-80,24],[-92,21],[-104,13]];
const BY_CEREB=[[34,48],[52,39],[76,33],[100,33],[117,41],[123,55],[120,72],[104,86],[80,91],[58,88],[42,76]];
const BY_STEM=[[16,46],[44,46],[49,58],[47,74],[42,88],[38,102],[37,124],[25,124],[25,104],[22,92],[12,86],[7,74],[9,60]];
// the sulci: [weight, points]. The lateral (Sylvian) and central sulci are deepest; then the frontal, parietal and temporal sulci; then small folds
const BY_SULCI=[
  [3.1,[[-62,23],[-44,15],[-26,11],[-8,8],[10,5],[26,1],[42,-5],[52,-13],[58,-23],[60,-33]]],[1.6,[[-44,15],[-45,6],[-49,-2]]],[1.6,[[-48,16],[-58,10],[-66,9]]],
  [2.8,[[21,-100],[16,-90],[15,-80],[18,-72],[12,-64],[8,-54],[4,-44],[0,-34],[-4,-24],[-8,-15],[-10,-7]]],
  [2.1,[[-5,-100],[-9,-90],[-12,-80],[-15,-70],[-16,-62]]],[2.1,[[-20,-58],[-24,-48],[-28,-38],[-30,-26],[-33,-15],[-34,-7]]],
  [2.1,[[44,-95],[40,-84],[39,-74],[35,-64],[33,-52],[30,-40],[27,-29],[25,-18]]],
  [2,[[-17,-80],[-30,-81],[-44,-77],[-58,-74],[-72,-66],[-84,-58],[-96,-46]]],[2,[[-24,-46],[-38,-50],[-52,-46],[-66,-42],[-80,-35],[-94,-26],[-104,-16]]],
  [2.1,[[33,-54],[46,-58],[58,-56],[72,-54],[86,-48],[98,-40],[110,-32]]],
  // the superior temporal sulcus runs below the concept cell, which sits in the superior temporal gyrus; the inferior one lower, broken in pieces
  [2.4,[[-54,41],[-40,38.5],[-26,41],[-12,39],[2,41.5],[16,40],[30,37.5],[44,31],[56,24],[64,15],[70,5],[75,-5],[78,-18]]],
  [1.7,[[-46,53],[-34,51.5],[-22,53.5],[-14,52]]],[1.6,[[-6,57],[6,55.5],[16,57]]],[1.8,[[26,52],[38,49.5],[50,46],[60,40],[70,35],[82,30]]],[1.1,[[38,49.5],[42,43],[40,37]]],[1.1,[[-34,51.5],[-30,46]]],
  [1.7,[[103,-12],[108,-2],[110,8],[106,20]]],[1.4,[[93,-70],[97,-62],[98,-54]]],[1.5,[[86,-6],[94,-12],[100,-24],[104,-38]]],
  // small folds and dimples, giving each gyrus its wander
  [1.2,[[-34,-92],[-46,-90],[-60,-86]]],[1.2,[[-68,-80],[-78,-74],[-88,-66]]],[1.2,[[-40,-64],[-50,-62],[-58,-58],[-68,-52]]],[1.2,[[-80,-48],[-90,-42],[-100,-34]]],[1.1,[[-6,-70],[-2,-62]]],
  [1.2,[[-56,-26],[-64,-22],[-74,-18]]],[1.2,[[-82,-12],[-90,-6],[-100,-2]]],[1.2,[[-78,10],[-88,12],[-98,8]]],[1.1,[[-50,-30],[-48,-20],[-46,-12]]],[1.1,[[-60,-6],[-68,2]]],
  [1.2,[[46,-32],[52,-40],[60,-44],[68,-38]]],[1.2,[[80,-22],[88,-30],[94,-24]]],[1.2,[[56,-82],[66,-78],[78,-72]]],[1.1,[[50,-72],[60,-68],[66,-66]]],[1.1,[[80,-62],[88,-58]]],
  [1.1,[[112,-44],[116,-36],[118,-26]]],[1.1,[[94,14],[102,20],[110,24]]],[1.1,[[84,6],[92,4],[98,-2]]],[1.1,[[70,14],[80,12]]],
  [1.1,[[-40,47],[-30,46.5],[-22,47.5]]],[1.1,[[34,20],[42,17],[48,12]]],[1.1,[[54,36],[62,32]]],[1.1,[[-36,22],[-26,21]]],[1.1,[[-16,48],[-6,47]]]];
(function(){for(const q of BY_SULCI){if(q[0]<1.9||q[0]>2.7)continue;const P=q[1],out=[P[0]];for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,m=(hash(i,77+P.length)-0.5)*Math.min(6,d*0.3);
  out.push([(a[0]+b[0])/2-dy/d*m,(a[1]+b[1])/2+dx/d*m],b);}q[1]=out;}})();
const BY_BMP={};
function by_brainBmp(q){const s=q/2,key="brain"+q;if(BY_BMP[key])return BY_BMP[key];
  const X0=-140,Y0=-126,X1=146,Y1=134,Wc=Math.ceil((X1-X0)*q),Hc=Math.ceil((Y1-Y0)*q),cv=mkCanvas(Wc,Hc),c=cv.getContext("2d"),col=BY_VIOLET;
  const tf=cx=>{cx.setTransform(q,0,0,q,-X0*q,-Y0*q);cx.lineJoin="round";cx.lineCap="round";};tf(c);
  const layer=()=>{const l=mkCanvas(Wc,Hc).getContext("2d");tf(l);return l;},put=(l,op,a,dx,dy)=>{c.save();c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation=op||"source-over";c.globalAlpha=a==null?1:a;c.drawImage(l.canvas,(dx||0)*q,(dy||0)*q);c.restore();};
  const body=(x,pts,g0,g1,x0,y0,x1,y1)=>{x.beginPath();by_curve(x,pts,true);const g=x.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,g0);g.addColorStop(1,g1);x.fillStyle=g;x.fill();};
  const rim=(pts,a,lw)=>{c.save();c.beginPath();by_curve(c,pts,true);c.shadowColor=rgba(col,0.9);c.shadowBlur=10*s;c.strokeStyle=rgba(col,a);c.lineWidth=lw;c.stroke();c.restore();};
  // the shadow side of an outline: a crescent inside the edge, away from the light, so the rim is heavier at the lower right
  const crescent=(pts,d,a)=>{const l=layer();l.beginPath();by_curve(l,pts,true);l.fillStyle=rgba(col,a);l.fill();
    l.globalCompositeOperation="destination-out";l.translate(-d,-d*0.9);l.beginPath();by_curve(l,pts,true);l.fill();put(l);};
  const dark=a=>rgba(mix(col,[20,26,40],a),0.96);
  // the brainstem: the pons swelling in front, the medulla narrowing, fading as it leaves the picture
  let l=layer();body(l,BY_STEM,dark(0.74),"rgba(8,12,22,0.96)",0,46,50,110);
  l.save();l.beginPath();by_curve(l,BY_STEM,true);l.clip();l.strokeStyle=rgba(col,0.2);l.lineWidth=0.6;
  for(let i=0;i<6;i++){l.beginPath();l.moveTo(4,58+i*5);l.quadraticCurveTo(24,63+i*5.2,52,57+i*4.4);l.stroke();}
  l.strokeStyle=rgba(col,0.4);l.lineWidth=0.9;l.beginPath();l.moveTo(22,88);l.bezierCurveTo(28,94,31,104,31,124);l.stroke();l.restore();
  l.save();l.beginPath();by_curve(l,BY_STEM,true);l.shadowColor=rgba(col,0.9);l.shadowBlur=10*s;l.strokeStyle=rgba(col,0.85);l.lineWidth=1;l.stroke();l.restore();
  let g=l.createLinearGradient(0,92,0,122);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,1)");l.globalCompositeOperation="destination-out";l.fillStyle=g;l.fillRect(-10,90,80,50);put(l);
  // the cerebellum, with its fine folia and the deep horizontal fissure
  body(c,BY_CEREB,dark(0.72),"rgba(8,12,22,0.97)",40,30,110,95);
  c.save();c.beginPath();by_curve(c,BY_CEREB,true);c.clip();
  for(let k=0;k<15;k++){const r=k/14,deep=k===7;c.strokeStyle=rgba(col,deep?0.75:0.3+0.1*hash(k,3));c.lineWidth=deep?1.2:0.55;c.beginPath();
    for(let i=0;i<=30;i++){const u=i/30,an=lerp(0.02,1.0,u)*Math.PI,x=84+Math.cos(an)*(16+r*42),y=28+Math.sin(an)*(9+r*60)+Math.sin(u*11+k*1.7)*0.7;i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}
  c.restore();crescent(BY_CEREB,1.6,0.55);rim(BY_CEREB,0.9,1.1);
  // the cortex: lit from the upper left
  body(c,BY_CORTEX,dark(0.74),"rgba(9,11,24,0.97)",-90,-100,100,70);
  c.save();c.beginPath();by_curve(c,BY_CORTEX,true);c.clip();
  g=c.createRadialGradient(-56,-66,4,-40,-44,130);g.addColorStop(0,rgba(mix(col,[255,255,255],0.2),0.18));g.addColorStop(1,rgba(col,0));c.fillStyle=g;c.fillRect(-130,-120,260,200);
  // the folds, in relief: each groove is shadowed on its upper-left wall and lit on its lower-right one, so the gyri between them round out
  const grooves=layer();BY_SULCI.forEach(([w,pts])=>{grooves.beginPath();by_taper(grooves,pts,w*1.5);grooves.fillStyle="#000";grooves.fill();});
  const soft=layer();soft.setTransform(1,0,0,1,0,0);soft.filter="blur("+(4.2*q).toFixed(1)+"px)";soft.drawImage(grooves.canvas,0,0);soft.filter="none";
  const tint=(src,cc)=>{const t_=layer();t_.setTransform(1,0,0,1,0,0);t_.drawImage(src.canvas,0,0);t_.globalCompositeOperation="source-in";t_.fillStyle=cc;t_.fillRect(0,0,Wc,Hc);return t_;};
  c.restore();
  const clipTo=(lay)=>{lay.globalCompositeOperation="destination-in";lay.setTransform(q,0,0,q,-X0*q,-Y0*q);lay.beginPath();by_curve(lay,BY_CORTEX,true);lay.fill();return lay;};
  const sh=tint(soft,"rgb(2,3,10)"),hi=tint(soft,rgba(mix(col,[255,255,255],0.35),1));
  const shL=layer();shL.setTransform(1,0,0,1,0,0);shL.drawImage(sh.canvas,-2*q,-2*q);put(clipTo(shL),"source-over",1);put(clipTo(shL),"source-over",0.5);
  const hiL=layer();hiL.setTransform(1,0,0,1,0,0);hiL.drawImage(hi.canvas,2.2*q,2.2*q);put(clipTo(hiL),"source-over",0.24);
  c.save();c.beginPath();by_curve(c,BY_CORTEX,true);c.clip();
  BY_SULCI.forEach(([w,pts])=>{c.beginPath();by_taper(c,pts,w*0.95);c.fillStyle="rgba(4,6,14,0.7)";c.fill();});
  BY_SULCI.forEach(([w,pts])=>{c.beginPath();by_taper(c,pts,w*0.4);c.fillStyle=rgba(col,w>2?0.95:0.72);c.fill();});
  c.restore();
  crescent(BY_CORTEX,2,0.6);rim(BY_CORTEX,1,1.05);
  // round the concept cell the folds recede, so that the cell reads first
  c.save();c.beginPath();by_curve(c,BY_CORTEX,true);c.clip();g=c.createRadialGradient(14,24,0,14,24,32);g.addColorStop(0,"rgba(6,8,18,0.42)");g.addColorStop(0.6,"rgba(6,8,18,0.26)");g.addColorStop(1,"rgba(6,8,18,0)");c.fillStyle=g;c.fillRect(-20,-10,70,70);c.restore();
  return BY_BMP[key]={cv,X0,Y0,q};}
// the concept cell: a pyramidal neuron, its apical dendrite rising, basal dendrites spreading, an axon leaving below
function by_neuronPaths(){if(BY_BMP.npaths)return BY_BMP.npaths;const out=[];
  // each path keeps its route from the soma (base + its points), so that a spark can run along it all the way in, or out
  const grow=(x,y,a,len,w,depth,seed,wig,kind,base)=>{const n=5,pts=[[x,y]];let an=a;for(let i=1;i<=n;i++){an+=(hash(seed,i)-0.5)*(wig||0.5);const p=pts[i-1];pts.push([p[0]+Math.cos(an)*len/n,p[1]+Math.sin(an)*len/n]);}
    const route=base.concat(pts.slice(1));out.push({pts,w0:w,w1:Math.max(0.18,w*0.55),d:depth,kind,route});if(depth>0){const e=pts[n],sp=0.32+0.3*hash(seed,9),lean=(hash(seed,11)-0.5)*0.3;
      grow(e[0],e[1],an-sp+lean,len*(0.62+0.12*hash(seed,12)),w*0.62,depth-1,seed*3+1,wig,kind,route);grow(e[0],e[1],an+sp+lean,len*(0.58+0.12*hash(seed,13)),w*0.6,depth-1,seed*3+2,wig,kind,route);}};
  // the apical dendrite, with oblique branches and a tuft
  const ap=[[0,-5]];for(let i=1;i<=6;i++)ap.push([Math.sin(i*0.9)*1.2,-5-i*4.4]);out.push({pts:ap,w0:1.25,w1:0.6,d:3,kind:"apical",route:ap});
  [[2,-0.5,7,5],[3,Math.PI+0.6,6,6],[4,-0.35,6,7],[5,Math.PI+0.4,5,8]].forEach(([i,a,l,sd])=>grow(ap[i][0],ap[i][1],a-Math.PI*0.08,l,0.5,1,sd,0.5,"apical",ap.slice(0,i+1)));
  [-0.6,-0.1,0.45].forEach((d,i)=>grow(ap[6][0],ap[6][1],-Math.PI/2+d,6,0.5,1,20+i,0.5,"apical",ap));
  // basal dendrites
  [[-3.4,2.6,Math.PI*0.86,11],[-2.4,3.6,Math.PI*0.66,12],[2.6,3.6,Math.PI*0.33,13],[3.4,2.4,Math.PI*0.1,14],[0.6,4,Math.PI*0.52,15]].forEach(([x,y,a,sd])=>grow(x,y,a,8+hash(sd,1)*3,0.8,2,sd,0.5,"basal",[[0,0]]));
  // the axon, thin and long, with a collateral
  const ax=[[0.4,4.4]];for(let i=1;i<=7;i++)ax.push([0.4+Math.sin(i*0.7)*1.6,4.4+i*3.4]);out.push({pts:ax,w0:0.5,w1:0.3,d:0,kind:"axon",route:ax});grow(ax[4][0],ax[4][1],Math.PI*0.2,7,0.3,0,31,0.3,"axon",ax.slice(0,5));
  // the routes the sparks take while the cell fires: in along two apical and two basal dendrites, from their far tips, and out along the axon
  const tipOf=k=>out.filter(b=>b.kind===k&&b.d===0),A=tipOf("apical"),B=tipOf("basal");
  out.sparks=[[A[A.length-2].route,-1],[A[1].route,-1],[B[1].route,-1],[B[B.length-3].route,-1],[ax,1]];
  return BY_BMP.npaths=out;}
function by_neuronBmp(q){const s=q/2,key="cell"+q;if(BY_BMP[key])return BY_BMP[key];const R=36,cv=mkCanvas(Math.ceil(2*R*q),Math.ceil(2*R*q)),c=cv.getContext("2d");
  c.setTransform(q,0,0,q,R*q,R*q);c.lineJoin="round";c.lineCap="round";c.shadowColor=rgba(BY_WARM,0.9);c.shadowBlur=4*s;c.fillStyle=rgba(BY_WARM,1);
  by_neuronPaths().forEach(b=>{c.beginPath();by_tube(c,b.pts,b.pts.map((_,i)=>lerp(b.w0,b.w1,i/(b.pts.length-1))),3);c.fill();});
  // the soma: a rounded pyramid
  c.beginPath();by_curve(c,[[0,-8],[3.4,-1],[4.6,3.6],[0,5],[-4.6,3.6],[-3.4,-1]],true);c.fill();
  return BY_BMP[key]={cv,R,q};}
function brain(ctx,x,y,s,t,act,a){withA(ctx,a==null?1:a,()=>{const k=clamp(act||0,0,1);t=t||0;
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);by_blit(ctx,"brain",0,0,0,[-140,-126,146,134],(c,D)=>{const B=by_brainBmp(D);c.drawImage(B.cv,B.X0,B.Y0,B.cv.width/D,B.cv.height/D);});
  // the concept cell at (x+14s, y+26s): a warm halo, the neuron, and while it fires, sparks running in along its dendrites and out along its axon
  const cx=14,cy=26,halo=(0.16+0.04*Math.sin(t*1.2))*(1-k)+0.75*k;
  if(halo>0.01)withA(ctx,halo,()=>by_blit(ctx,"cellhalo",cx,cy,0,[-72,-72,72,72],c=>{const g=c.createRadialGradient(0,0,0,0,0,72);g.addColorStop(0,rgba(BY_WARM,0.55));g.addColorStop(0.25,rgba(BY_WARM,0.22));g.addColorStop(0.6,rgba(BY_WARM,0.06));g.addColorStop(1,rgba(BY_WARM,0));c.fillStyle=g;c.fillRect(-72,-72,144,144);},{op:"lighter"}));
  withA(ctx,0.42+0.58*k,()=>by_blit(ctx,"cell",cx,cy,0,[-36,-36,36,36],(c,D)=>{const N=by_neuronBmp(D);c.drawImage(N.cv,-N.R,-N.R,N.cv.width/D,N.cv.height/D);}));
  ctx.restore();
  const gx=x+cx*s,gy=y+cy*s;
  if(k>0.02){const R=by_neuronPaths().sparks;R.forEach(([r,dirn],j)=>{const u=((t*0.8+j*0.37+hash(j,5)*0.2)%1),f=dirn>0?u:1-u,n=r.length-1,i=Math.min(n-1,Math.floor(f*n)),q=f*n-i,pa=r[i],pb=r[i+1];
      glow(ctx,gx+lerp(pa[0],pb[0],q)*s,gy+lerp(pa[1],pb[1],q)*s,5*s,BY_WARM,k*0.85*Math.sin(Math.PI*u));});}
  glow(ctx,gx,gy-s,(9+5*k)*s,[255,250,225],0.35+0.6*k);});}

/* ---------- a baby ---------- */
// a baby of about a year, sitting on the ground in a cloth wrap, pointing: the root of reference. pt (0 to 1) raises the pointing arm.
// t: seconds (a breath, a blink, the head turning up to what she points at); o.at: the point she points at (default: up and to the right; to the left, she is mirrored).
// At s = 2, sitting at (520,720), her fingertip reaches about (680,640) when pt = 1.
const BY_BABY={skin:[176,122,88],hair:[44,30,26],wrap:[226,208,176],edge:[255,214,170]},BY_LEAN=0.07;
const by_line=(c,col,al,w)=>seam(c,col,al==null?0.4:al,w||1.1);
// her parts, each in her own units, facing right (mirrored by the caller)
function by_babyFar(c,skin,L){const line=by_line;
    // the far leg, behind: thigh, knee, a chubby calf, the foot with its toes up
    c.beginPath();by_tube(c,[[8,60],[26,55],[40,54],[54,58],[63,59]],[12,9.5,8.2,7.4,5.2],5);L(c,darken(skin,0.14),36,56,14);line(c,skin);
    c.beginPath();by_curve(c,[[58,62],[66,65],[74,60],[78,50],[76,43],[71,42],[66,50],[60,55]],true);L(c,darken(skin,0.12),68,54,10);line(c,skin);
}
function by_babyTorso(c,skin,B,L){const line=by_line;c.translate(4,76);c.rotate(BY_LEAN);c.translate(-4,-76);
    // the body: round belly, rounded back, sitting firmly (leaning a little towards what she points at)
    c.beginPath();by_curve(c,[[6,0],[22,4],[30,18],[34,38],[32,56],[22,70],[4,78],[-12,76],[-21,64],[-23,44],[-18,22],[-9,6]],true);L(c,skin,4,36,40);line(c,skin);
    // the wrap: a cloth round the body and over one shoulder, knotted there
    c.save();c.beginPath();by_curve(c,[[-14,6],[-6,2],[2,6],[10,12],[20,16],[30,22],[35,42],[32,60],[22,72],[4,80],[-14,78],[-24,64],[-25,42],[-21,20]],true);L(c,B.wrap,0,40,42,1.2);line(c,B.wrap,0.5);
    c.clip();[[[-20,40],[2,33],[27,36]],[[-22,57],[4,50],[31,53]],[[-8,12],[8,20],[26,26]],[[-16,26],[4,24],[24,30]]].forEach(q=>{c.beginPath();by_taper(c,q,0.9);c.fillStyle=rgba(darken(B.wrap,0.35),0.45);c.fill();});
    c.strokeStyle=rgba(darken(B.wrap,0.15),0.16);c.lineWidth=0.5;for(let i=-4;i<10;i++){c.beginPath();c.moveTo(-30,8+i*7);c.lineTo(40,4+i*7);c.stroke();}c.restore();
    c.beginPath();c.ellipse(-9,7,4.4,3.4,0.4,0,TAU);L(c,darken(B.wrap,0.06),-9,7,4,1.2);line(c,B.wrap,0.6);
    c.beginPath();by_taper(c,[[-11,9],[-14,15],[-13,21]],1.3);c.fillStyle=rgba(darken(B.wrap,0.1),0.95);c.fill();
}
function by_babyNear(c,skin,L){const line=by_line;
    // the near leg, stretched out in front: a fat thigh with its crease, the knee, the calf, the foot
    c.beginPath();by_tube(c,[[-4,70],[16,70],[32,72],[46,75],[58,78],[64,78]],[13,12,9.6,9,7.8,5.6],5);L(c,skin,30,72,16);line(c,skin);
    c.beginPath();by_taper(c,[[14,61],[17,70],[15,80]],1);c.fillStyle=rgba(darken(skin,0.45),0.45);c.fill();
    c.beginPath();by_taper(c,[[58,71],[60,78],[58,85]],0.8);c.fillStyle=rgba(darken(skin,0.45),0.4);c.fill();
    c.beginPath();by_curve(c,[[60,72],[68,72],[78,70],[84,62],[84,54],[79,52],[74,59],[66,64],[60,64]],true);L(c,skin,72,64,12);line(c,skin);
    c.fillStyle=rgba(lighten(skin,0.25),0.9);[[84,55,2.4],[83,59.5,2],[81,63.4,1.8],[78,66.6,1.6]].forEach(([tx,ty,tr])=>{c.beginPath();c.ellipse(tx,ty,tr*0.8,tr,0.3,0,TAU);c.fill();});
}
function by_babyArm(c,skin,L,mir){const line=by_line;c.translate(4,76);c.rotate(BY_LEAN);c.translate(-4,-76);
    // the near arm, resting on her leg
    const NS=[-8,12],NE=[-10,32],NW=[6,46];c.beginPath();by_tube(c,[NS,[-10,22],NE,[-2,41],NW],[7.8,7.4,6.2,6.2,4.8],5);L(c,skin,-6,30,14);line(c,skin);
    c.beginPath();by_taper(c,[[-15,32],[-10,34],[-5,32]],0.7);c.fillStyle=rgba(darken(skin,0.45),0.4);c.fill();
    c.save();c.translate(NW[0],NW[1]);c.rotate(0.5);c.scale(0.27,0.27);by_hand(c,"rest",skin,{chub:1,L:[-0.7*mir*Math.cos(0.5)-0.7*Math.sin(0.5),0.7*mir*Math.sin(0.5)-0.7*Math.cos(0.5)]});c.restore();
}
function by_babyHead(c,skin,B,L){const line=by_line;
    // the head: a big round skull, the face small and low, full cheeks
    const HP=[[-2,-24],[10,-21],[18,-13],[21,-4],[22,4],[22.5,9],[19,15],[12,19],[4,20],[-6,18],[-15,12],[-21,2],[-22,-8],[-17,-18]];
    c.beginPath();by_curve(c,HP,true);L(c,skin,2,-4,24);line(c,skin,0.35);
    c.beginPath();by_curve(c,[[-22,-8],[-2,-24],[18,-13],[21,-4],[15,-12],[4,-15],[-6,-12],[-14,-6],[-16,4],[-20,4]],true);c.fillStyle=rgba(B.hair,0.28);c.fill();
    // a little soft, curly hair, above the ear
    c.save();c.beginPath();by_curve(c,HP,true);c.clip();c.beginPath();bumpy(c,-1,-7,21.5,19,Math.PI*0.97,Math.PI*1.93,24,0.09,3);c.quadraticCurveTo(10,-15,0,-14);c.quadraticCurveTo(-11,-12,-15,-6);c.quadraticCurveTo(-19,-4,-22,-5);c.closePath();
    const hg=c.createLinearGradient(-14,-24,8,-6);hg.addColorStop(0,rgba(lighten(B.hair,0.12),0.8));hg.addColorStop(1,rgba(B.hair,0.62));c.fillStyle=hg;c.fill();
    c.fillStyle=rgba(lighten(B.hair,0.3),0.28);for(let i=0;i<34;i++){const ha_=Math.PI*(1.02+0.86*hash(i,4)),hr_=11+hash(i,5)*10;c.beginPath();c.arc(-1+Math.cos(ha_)*hr_,-7+Math.sin(ha_)*hr_*0.95,0.75,0,TAU);c.fill();}c.restore();
    // the near ear, on the side of the head
    c.beginPath();by_curve(c,[[-9,-6],[-4,-7.5],[-2.5,-1],[-4,5],[-8.5,5.5],[-10.5,0]],true);L(c,skin,-6,-1,6);line(c,skin,0.45);c.beginPath();c.arc(-6,-0.5,2.4,-1.3,1.7);c.strokeStyle=rgba(darken(skin,0.4),0.5);c.lineWidth=0.9;c.stroke();
    // cheeks, nose, mouth
    c.fillStyle="rgba(214,110,96,0.16)";c.beginPath();c.ellipse(13,8,5,3.6,0,0,TAU);c.fill();
    c.beginPath();c.moveTo(21.5,1);c.quadraticCurveTo(25,4,21.6,6.2);c.strokeStyle=rgba(darken(skin,0.45),0.7);c.lineWidth=1.2;c.stroke();
}
// where her arm and hand are: the shoulder S, elbow E, wrist W (her units, facing right) and the angles of the upper arm, forearm and hand
function by_babyArm2(dx,dy,r,br,t){const lean=BY_LEAN,rotP=(p_)=>{const c_=Math.cos(lean),s_=Math.sin(lean),X=p_[0]-4,Y=p_[1]-76;return[4+X*c_-Y*s_,76+X*s_+Y*c_];};
  const S=rotP([24,6+br*0.3]),aim=Math.atan2(dy-S[1],dx-S[0])+Math.sin(t*1.3)*0.015,ua=lerp(1.25,aim-0.14,r),fa=lerp(0.2,aim+0.04,r),ha=lerp(0.05,aim,r);
  const E=[S[0]+Math.cos(ua)*23.5,S[1]+Math.sin(ua)*23.5],W=[E[0]+Math.cos(fa)*20.5,E[1]+Math.sin(fa)*20.5];return{S,E,W,ua,fa,ha,rotP};}
// the tip of her index finger, in the picture (for placing her): the same arguments as baby()
function by_babyTip(x,y,s,pt,t,o){o=o||{};t=t||0;const r=clamp(pt==null?1:pt,0,1),at=o.at||[x+260*s,y-190*s],mir=at[0]<x?-1:1,A=by_babyArm2((at[0]-x)*mir/s,(at[1]-y)/s,r,Math.sin(t*2.1)*0.6,t);
  const tip=[24.05,-2.88],c=Math.cos(A.ha),sn=Math.sin(A.ha),X=A.W[0]+tip[0]*c-tip[1]*sn,Y=A.W[1]+tip[0]*sn+tip[1]*c;return[x+X*s*mir,y+Y*s];}
function baby(ctx,x,y,s,a,pt,t,o){o=o||{};withA(ctx,a==null?1:a,()=>{t=t||0;const B=BY_BABY,skin=o.skin||B.skin,r=clamp(pt==null?1:pt,0,1);
  const at=o.at||[x+260*s,y-190*s],mir=at[0]<x?-1:1,dx=(at[0]-x)*mir/s,dy=(at[1]-y)/s,L=by_L(mir),line=by_line;
  const br=Math.sin(t*2.1)*0.6,bl=(t+0.8)%3.7,blink=bl<0.18?Math.abs(bl-0.09)/0.09:1;
  // the pointing arm, from the far shoulder, aimed at the target as it rises
  const A=by_babyArm2(dx,dy,r,br,t),S=A.S,E=A.E,Wr=A.W,ha=A.ha,lean=BY_LEAN;
  // the head turns up towards the target as the arm rises
  const look=clamp(Math.atan2(dy+22,dx-8)*0.5,-0.45,0.1),tilt=lerp(0.02,look,r)+Math.sin(t*0.9)*0.02,NP=A.rotP([8,-4+br*0.4]);
  // her edge is as fine as the grown-ups': about a pixel, with a soft glow of 10
  const key="baby|"+mir+"|"+skin.join(","),rim={col:o.edge||B.edge,glow:0.45,ring:1.2/s,blur:10/s},mb=b=>mir<0?[-b[2],b[1],-b[0],b[3]]:b;
  const part=(c,e,name,box,fn)=>{c.save();c.translate(x,y);c.scale(s,s);by_blit(c,key+"|"+name,0,0,0,mb(box),cc=>{cc.scale(mir,1);fn(cc);},{rim,edge:e});c.restore();};
  // the hand opens from a loose fist to a point as the arm rises: only the index moves
  const kq=Math.round(clamp((r-0.2)/0.3,0,1)*16)/16,lq=Math.round(ha/0.3),Lh=(()=>{const q=lq*0.3;return[-0.7*mir*Math.cos(-q)+0.7*Math.sin(-q),-0.7*mir*Math.sin(-q)-0.7*Math.cos(-q)];})();
  const armPath=cc=>by_tube(cc,[S,[(S[0]+E[0])/2,(S[1]+E[1])/2],E,[(E[0]+Wr[0])/2,(E[1]+Wr[1])/2],Wr],[8.8,8.4,7.2,7.2,5.6],4);
  by_figure(ctx,[x-(mir<0?110:50)*s,y-72*s,x+(mir<0?50:110)*s,y+100*s],(c,e)=>{
    part(c,e,"far",[4,38,84,72],cc=>by_babyFar(cc,skin,L));
    // the pointing arm is drawn as it is (it keeps moving), its hand is a picture turned into place
    c.save();c.translate(x,y);c.scale(s*mir,s);
    if(e)by_liveRim(c,armPath,rim);
    else{c.beginPath();armPath(c);L(c,skin,E[0],E[1],16);line(c,skin);
      const d=Math.atan2(Wr[1]-E[1],Wr[0]-E[0]);c.beginPath();c.arc(Wr[0]-Math.cos(d)*2.4,Wr[1]-Math.sin(d)*2.4,5.8,d+1.2,d-1.2,true);c.strokeStyle=rgba(darken(skin,0.45),0.35);c.lineWidth=0.9;c.stroke();}
    c.restore();
    c.save();c.translate(x+Wr[0]*s*mir,y+Wr[1]*s);c.scale(s,s);by_blit(c,key+"|hand|"+kq+"|"+lq,0,0,mir*ha,mir<0?[-30,-16,10,16]:[-10,-16,30,16],cc=>{cc.scale(mir,1);cc.scale(0.29,0.29);by_hand(cc,by_handMix(BY_HANDS.fist,BY_HANDS.point,kq),skin,{chub:1,L:Lh});},{rim,edge:e,live:true,merge:true,rimCut:q=>q.fillRect(mir<0?-3:-40,-40,43,80)});c.restore();
    part(c,e,"front",[-30,-4,90,92],cc=>{cc.save();by_babyTorso(cc,skin,B,L);cc.restore();by_babyNear(cc,skin,L);cc.save();by_babyArm(cc,skin,L,mir);cc.restore();});
    // the head, tilted up to what she sees; her eyes and mouth are drawn live
    const R=mir*(lean+tilt);c.save();c.translate(x+NP[0]*s*mir,y+NP[1]*s);c.scale(s,s);by_blit(c,key+"|head",0,0,R,[-27,-46,27,6],cc=>{cc.scale(mir,1);cc.translate(0,-18);by_babyHead(cc,skin,B,L);},{rim,edge:e,live:true});
    if(!e){c.rotate(R);c.scale(mir,1);c.translate(0,-18);
      c.beginPath();c.ellipse(17,11.6,2.1,1.5+0.3*r,0.2,0,TAU);c.fillStyle="rgba(110,44,46,0.85)";c.fill();
      // the eyes: big and dark, the iris filling most of the opening, looking where the finger points; a lid of skin comes down as she blinks
      const gz=[lerp(0.15,0.42,r),lerp(-0.05,-0.3,r)],lid=rgba(darken(skin,0.04),1);
      [[7.5,-1,3.3],[17.5,-1.5,2.4]].forEach(([ex,ey,er])=>{c.save();c.beginPath();c.ellipse(ex,ey,er*1.1,er*0.96,0,0,TAU);c.fillStyle="rgba(236,226,218,0.95)";c.fill();c.clip();
        const ix=ex+gz[0]*er*0.55,iy=ey+gz[1]*er*0.5;c.beginPath();c.arc(ix,iy,er*0.86,0,TAU);c.fillStyle="rgba(40,24,18,1)";c.fill();
        if(blink>0.5){c.beginPath();c.arc(ix+er*0.28,iy-er*0.32,er*0.28,0,TAU);c.fillStyle="rgba(255,255,255,0.92)";c.fill();}
        if(blink<1){c.fillStyle=lid;c.fillRect(ex-er*1.3,ey-er*1.1,er*2.6,er*2.12*(1-blink));}c.restore();
        // the lashes: along the top of the open eye, or along the closed lid
        const ly=ey-er*0.96+er*1.92*(1-blink);c.beginPath();c.moveTo(ex-er*1.15,ey-er*0.1+(1-blink)*er*0.2);c.quadraticCurveTo(ex,blink<1?ly+er*0.35:ey-er*1.3,ex+er*1.15,ey-er*0.2+(1-blink)*er*0.2);
        c.strokeStyle=rgba(darken(skin,0.6),blink<1?0.85:0.6);c.lineWidth=blink<1?1:0.8;c.stroke();
        c.beginPath();c.moveTo(ex-er*1.1,ey-er*1.5);c.quadraticCurveTo(ex,ey-er*2.2,ex+er*1.1,ey-er*1.6);c.strokeStyle=rgba(darken(skin,0.4),0.5);c.lineWidth=0.9;c.stroke();});
    }
    c.restore();});});}

/* ---------- an elder of the first speakers ---------- */
// A grandmother, one of the first people who spoke: a modern human of long ago, resting at the child's level, sitting back on one heel with
// the other knee raised and her forearm across it, in a wrap of soft hide over one shoulder, a cord belt, a string of shell beads; bare arms
// and feet, short grey coiled hair. She turns her head up to look at o.look. Drawn like the series' people (s = 1 would be about 560 px
// standing); her foot, knee and shin rest on y; her eye is about 340*s above it, near x. t: seconds, for her breath, blinks and a slow sway of the head.
const BY_ELDER={skin:[140,94,66],hide:[182,142,98],hair:[196,192,188],cord:[184,150,98],beads:[240,230,212],edge:[255,206,150]};
function by_elderBody(c,skin,E){const hide=E.hide,L=by_L(1,0.32),line=(c,col,al,w)=>seam(c,col,al==null?0.45:al,w||1.3),
    crease=(c,q,w,al,col)=>{c.beginPath();by_taper(c,q,w);c.fillStyle=rgba(darken(col||skin,0.45),al||0.4);c.fill();},
    shine=(c,q,w,al,col)=>{c.beginPath();by_taper(c,q,w);c.fillStyle=rgba(lighten(col||skin,0.3),al||0.3);c.fill();},dk=darken(skin,0.16);
  // the kneeling leg, furthest: the knee on the ground, the shin rising a little to the ankle, the foot upright under her with the toes bent on the ground
  c.beginPath();by_curve(c,[[-94,-6],[-86,-26],[-56,-38],[-14,-46],[24,-54],[42,-60],[54,-60],[60,-46],[61,-26],[64,-10],[74,-4],[86,-2],[84,1],[60,1],[48,-6],[34,-20],[10,-16],[-30,-8],[-70,-1],[-90,1]],true);L(c,dk,0,-30,50);line(c,dk);
  shine(c,[[-80,-28],[-50,-38],[-14,-44]],1.4,0.22,dk);c.strokeStyle=rgba(darken(skin,0.5),0.4);c.lineWidth=1;[[74,-2.5],[80,-2]].forEach(([a,b])=>{c.beginPath();c.moveTo(a,b);c.lineTo(a-2,b-4.5);c.stroke();});
  // the raised leg: the shin standing, the calf round at the back, the ankle, the foot flat on the ground with its arch and toes
  c.beginPath();by_curve(c,[[-116,-168],[-119,-120],[-117,-70],[-113,-36],[-118,-18],[-134,-10],[-156,-6],[-170,-3],[-167,1],[-128,1],[-96,1],[-86,-3],[-88,-14],[-92,-30],[-90,-62],[-80,-104],[-76,-136],[-84,-164]],true);
  L(c,skin,-100,-90,70);line(c,skin);
  shine(c,[[-113,-156],[-115,-110],[-113,-62]],1.6,0.3);crease(c,[[-86,-30],[-90,-18],[-88,-8]],0.9,0.35);
  c.strokeStyle=rgba(darken(skin,0.5),0.4);c.lineWidth=1.1;[[-164,-2],[-157,-4],[-150,-5.5]].forEach(([a,b])=>{c.beginPath();c.moveTo(a,b);c.lineTo(a+1,b-5);c.stroke();});
  // the neck, stretched a little as she looks up: the throat in front, the nape and the slope of the shoulders behind
  const NK=[[-14,-262],[-10,-282],[-4,-300],[10,-315],[28,-311],[38,-296],[48,-278],[46,-262],[20,-256]];
  c.beginPath();by_curve(c,NK,true);L(c,darken(skin,0.05),16,-286,34);line(c,skin);
  c.save();c.beginPath();by_curve(c,NK,true);c.clip();shine(c,[[22,-306],[8,-290],[-6,-272]],2.2,0.24);crease(c,[[-4,-296],[-8,-284],[-10,-270]],1,0.3);crease(c,[[36,-300],[42,-284],[46,-270]],1.2,0.3);c.restore();
  // the body under the wrap: a back rounded with the years, the waist, the hips resting on the heel; the chest and the collarbone
  c.beginPath();by_curve(c,[[12,-292],[36,-280],[54,-258],[58,-228],[52,-196],[48,-182],[54,-150],[62,-112],[65,-76],[60,-50],[40,-40],[-10,-86],[-38,-132],[-44,-170],[-46,-200],[-42,-228],[-30,-250],[-12,-266],[2,-280]],true);L(c,skin,6,-200,80);line(c,skin);
  shine(c,[[-24,-260],[-10,-268],[4,-270]],1.2,0.28);
  // the raised thigh, from the hip to the knee
  c.beginPath();by_tube(c,[[26,-88],[-30,-124],[-72,-150],[-100,-164]],[27,25,22,19.5],5);L(c,skin,-40,-130,50);line(c,skin);
  c.beginPath();c.ellipse(-106,-166,12,10,-0.5,0,TAU);c.fillStyle=rgba(lighten(skin,0.22),0.25);c.fill();
  // the wrap of soft hide: over the far shoulder, across the breast under the near arm, round the hips and over the thigh. It follows the round
  // of the back, is drawn in at the waist by the belt and bunches there, lies over the thigh and breaks towards the knee, and hangs in soft points
  // below the thigh and behind her, where she sits on it
  const W=[[20,-292],[40,-286],[56,-266],[63,-236],[57,-202],[50,-184],[57,-160],[64,-126],[70,-94],[72,-64],[69,-42],[62,-28],[50,-31],[38,-25],[22,-40],[6,-56],[-12,-72],[-28,-86],[-42,-98],[-54,-104],[-60,-118],[-61,-138],[-55,-156],[-48,-168],[-48,-184],[-50,-204],[-48,-224],[-40,-240],[-26,-252],[-10,-264],[6,-282]];
  c.beginPath();by_curve(c,W,true);L(c,hide,4,-160,120,1.1);line(c,hide,0.55,1.4);
  c.save();c.beginPath();by_curve(c,W,true);c.clip();
  // the round of the thigh under the hide, lit along its top
  c.beginPath();by_taper(c,[[10,-104],[-26,-136],[-56,-154]],5);c.fillStyle=rgba(lighten(hide,0.25),0.22);c.fill();
  // folds: from the far shoulder across the breast and down the back; from the belt's knot over the thigh, down its side, round the hips; where she sits
  const folds=[[2.2,[[24,-286],[8,-272],[-8,-258],[-24,-248]]],[1.8,[[32,-282],[22,-264],[10,-244],[-4,-228]]],[1.5,[[44,-278],[50,-258],[52,-232]]],[1.2,[[18,-268],[20,-246],[18,-222]]],
    [1.8,[[-30,-176],[-42,-166],[-54,-160]]],[1.9,[[-24,-174],[-32,-150],[-42,-128],[-50,-112]]],[1.5,[[-16,-174],[-14,-148],[-16,-118],[-22,-94]]],[1.7,[[-8,-176],[6,-150],[16,-124],[20,-98]]],
    [1.6,[[2,-178],[22,-162],[40,-140],[52,-114]]],[1.4,[[34,-172],[50,-150],[60,-120],[63,-90]]],[1.4,[[58,-66],[48,-50],[32,-42]]],[1.2,[[-36,-104],[-42,-98],[-48,-96]]],
    [1.5,[[-50,-152],[-57,-140],[-58,-124]]],[1.1,[[-4,-84],[-10,-72],[-16,-66]]],[1.1,[[40,-92],[36,-64],[40,-42]]]];
  folds.forEach(([w,q])=>{c.beginPath();by_taper(c,q,w);c.fillStyle=rgba(darken(hide,0.45),0.42);c.fill();c.save();c.translate(-2,-1.4);c.beginPath();by_taper(c,q,w*0.55);c.fillStyle=rgba(lighten(hide,0.3),0.28);c.fill();c.restore();});
  // the hide bunched above and below the belt
  [[-42,-188],[-28,-191],[-10,-192],[8,-191],[26,-189],[42,-186]].forEach(([px,py],i)=>{crease(c,[[px-4,py-8],[px,py-2],[px+3,py+2]],0.9,0.35,hide);crease(c,[[px+2,py+10],[px+4+hash(i,7)*3,py+17],[px+3,py+24]],0.9,0.3,hide);});
  // the grain and the marks of the skin
  c.fillStyle=rgba(darken(hide,0.3),0.1);for(let i=0;i<26;i++){c.beginPath();c.ellipse(-60+hash(i,21)*130,-280+hash(i,22)*240,3+hash(i,23)*6,2+hash(i,24)*3,hash(i,25)*3,0,TAU);c.fill();}
  c.restore();
  // stitches of sinew where two skins were sewn, and a thin edge of fur along the hem
  c.fillStyle=rgba(lighten(hide,0.45),0.7);for(let i=0;i<9;i++){const u=i/8,px=lerp(6,-36,u),py=lerp(-274,-242,u);c.beginPath();c.ellipse(px+1,py+6,1.3,1,0.6,0,TAU);c.fill();}
  const hm=by_samples(W.slice(10,23),W.slice(10,23).map(()=>1),5);c.strokeStyle=rgba(mix(hide,[236,222,196],0.35),0.5);c.lineWidth=1;
  for(let i=1;i<hm.length-1;i++){const A=hm[i-1],B=hm[i+1],nx=-(B[1]-A[1]),ny=B[0]-A[0],d=Math.hypot(nx,ny)||1,l=1.2+1.4*hash(i,52);for(let k=0;k<2;k++){const px=lerp(hm[i][0],B[0],k*0.5),py=lerp(hm[i][1],B[1],k*0.5);
    c.beginPath();c.moveTo(px-nx/d*1.2,py-ny/d*1.2);c.lineTo(px+nx/d*l+(hash(i,53+k)-0.5)*1.2,py+ny/d*l);c.stroke();}}
  // the belt: a cord of twisted plant fibre round the waist, knotted, its ends hanging
  c.beginPath();by_tube(c,[[52,-182],[24,-188],[-10,-190],[-48,-186]],[3.4,3.6,3.6,3.2],4);L(c,E.cord,0,-188,10,1.2);line(c,E.cord,0.6,1);
  c.strokeStyle=rgba(darken(E.cord,0.45),0.55);c.lineWidth=0.8;for(let i=0;i<18;i++){const px=50-i*5.6,py=-183-5*Math.sin(Math.PI*(i/17));c.beginPath();c.moveTo(px,py-3);c.lineTo(px-2.4,py+3);c.stroke();}
  c.beginPath();by_tube(c,[[-30,-186],[-35,-170],[-32,-154]],[2.6,2.3,2],3);L(c,E.cord,-33,-170,8);line(c,E.cord,0.6,1);
  c.beginPath();by_tube(c,[[-24,-186],[-21,-172],[-24,-161]],[2.6,2.3,2],3);L(c,E.cord,-22,-172,8);line(c,E.cord,0.6,1);
  c.beginPath();c.ellipse(-27,-188,6,5,0,0,TAU);L(c,E.cord,-27,-188,6,1.2);line(c,E.cord,0.6,1);
  // shell beads on a string, round the neck
  c.strokeStyle=rgba(darken(E.cord,0.3),0.8);c.lineWidth=1;c.beginPath();c.moveTo(24,-284);c.quadraticCurveTo(4,-250,-26,-258);c.stroke();
  for(let i=0;i<9;i++){const u=(i+0.5)/9,bx=(1-u)*(1-u)*24+2*u*(1-u)*4+u*u*-26,by=(1-u)*(1-u)*(-284)+2*u*(1-u)*(-250)+u*u*(-258);c.beginPath();c.ellipse(bx,by+1,2.6,3.2,0.2,0,TAU);L(c,E.beads,bx,by,3,1.2);line(c,E.beads,0.5,0.8);}
  // the near arm, bare: the round of the shoulder, the upper arm dropping to the elbow over the thigh (its point showing), the forearm across the knee,
  // bent at about 110 degrees, the hand hanging over it
  c.beginPath();by_tube(c,[[-50,-186],[-78,-191],[-106,-195],[-134,-199]],[12.8,12,10.6,8.8],5);L(c,skin,-90,-194,26);line(c,skin);
  shine(c,[[-64,-200],[-92,-204],[-120,-206]],1.6,0.3);
  const UA=[[-4,-282],[12,-283],[25,-272],[27,-254],[18,-236],[4,-222],[-16,-204],[-32,-190],[-40,-178],[-50,-174],[-58,-180],[-58,-192],[-48,-204],[-32,-222],[-18,-242],[-12,-260],[-10,-274]];
  c.beginPath();by_curve(c,UA,true);L(c,skin,-10,-236,50);line(c,skin);
  c.save();c.beginPath();by_curve(c,UA,true);c.clip();
  // the deltoid's round, lit; the line where it meets the arm; the triceps in shade; the point of the elbow, and the crease inside it
  shine(c,[[-4,-276],[12,-274],[22,-260]],2.4,0.36);crease(c,[[20,-246],[10,-236],[-2,-232]],1,0.3);
  crease(c,[[8,-236],[-12,-212],[-30,-194]],1.8,0.22);c.beginPath();c.ellipse(-46,-179,6,5,0.3,0,TAU);c.fillStyle=rgba(lighten(skin,0.2),0.22);c.fill();
  crease(c,[[-50,-198],[-55,-193],[-58,-188]],0.8,0.4);c.restore();
  c.save();c.translate(-134,-200);c.rotate(1.8);c.scale(0.62,-0.62);by_hand(c,"rest",skin,{L:[0.5,0.85]});c.restore();}
// her head, in its own units: turned three-quarters to the left, the eyes up and to the left
function by_elderHead(c,skin,E,blink,L,line){
  const HD=[[4,-50],[-16,-48],[-30,-38],[-37,-24],[-39,-13],[-38,-7],[-44,3],[-48,9],[-43,13],[-41,15],[-42,19],[-39,23],[-40,27],[-36,36],[-27,44],[-12,45],[4,40],[16,28],[26,12],[36,-6],[37,-28],[26,-44]];
  c.beginPath();by_curve(c,HD,true);L(c,skin,-8,-4,52);line(c,skin,0.4);
  // the ear, behind the cheek
  c.beginPath();by_curve(c,[[12,-14],[18,-16],[23,-8],[22,4],[18,12],[13,10],[11,0]],true);L(c,darken(skin,0.05),16,-2,10);line(c,skin,0.5);
  c.beginPath();c.moveTo(19,-8);c.quadraticCurveTo(13,-2,18,6);c.strokeStyle=rgba(darken(skin,0.45),0.5);c.lineWidth=1.2;c.stroke();
  // short grey hair, tightly coiled: an uneven cap of coils of every size, a few breaking its outline; at the hairline it thins and the scalp shows
  const hr=E.hair,C=[2,-19],cap=[];for(let i=0;i<=34;i++){const a=Math.PI*(1.0+1.08*i/34),k=1+0.05*(hash(i,41)-0.5)+(hash(i,42)>0.7?0.05*hash(i,43):0);cap.push([C[0]+Math.cos(a)*39*k,C[1]+Math.sin(a)*34*k]);}
  cap.push([36,-12],[30,-9],[24,-16],[16,-23],[4,-28],[-10,-31],[-22,-31],[-32,-29]);
  c.save();c.beginPath();by_curve(c,cap,true);const hg=c.createLinearGradient(-30,-54,30,-10);hg.addColorStop(0,rgba(darken(hr,0.12),1));hg.addColorStop(1,rgba(darken(hr,0.42),1));c.fillStyle=hg;c.fill();
  c.restore();
  // at the hairline: a thin, soft fringe of coils on the skin, the scalp showing between them
  for(let i=0;i<26;i++){const u=i/25,px=lerp(-36,32,u)+hash(i,61)*3,py=(u<0.5?lerp(-27,-32,u*2):lerp(-32,-8,(u-0.5)*2))+hash(i,62)*3.5;c.beginPath();c.arc(px,py,1.3+hash(i,63)*1.2,0,TAU);c.fillStyle=rgba(darken(hr,0.3),0.55);c.fill();}
  // coils over the whole cap, and some just beyond its edge; each a small curl, lit on its upper left, shadowed on its lower right
  const coil=(px,py,r,a)=>{c.lineWidth=Math.max(0.9,r*0.55);c.beginPath();c.arc(px,py,r,Math.PI*0.85+a,Math.PI*1.75+a);c.strokeStyle=rgba(lighten(hr,0.22),0.6);c.stroke();
    c.beginPath();c.arc(px,py,r,Math.PI*1.9+a,Math.PI*2.7+a);c.strokeStyle=rgba(darken(hr,0.55),0.6);c.stroke();};
  for(let i=0;i<150;i++){const a=Math.PI*(1.0+1.08*hash(i,31)),rr=0.25+0.8*Math.sqrt(hash(i,32)),px=C[0]+Math.cos(a)*38*rr,py=C[1]+Math.sin(a)*33*rr;if(py>-24+(px>20?(px-20)*1.0:0)&&px<30)continue;coil(px,py,1.3+hash(i,34)*1.6,hash(i,35)*2);}
  for(let i=0;i<22;i++){const a=Math.PI*(1.02+1.02*i/21+0.02*hash(i,36)),k=1.0+0.04*hash(i,37),px=C[0]+Math.cos(a)*39*k,py=C[1]+Math.sin(a)*34*k,r=2+hash(i,38)*1.8;
    c.beginPath();c.arc(px,py,r,0,TAU);c.fillStyle=rgba(darken(hr,0.25),1);c.fill();coil(px,py,r*0.75,hash(i,39)*2);}
  // brow, lines of a long life, the eyes looking up at the bird
  c.strokeStyle=rgba(darken(skin,0.4),0.3);c.lineWidth=1;[[-30,-25,-12,-26],[-28,-21,-14,-22]].forEach(([a,b,d,e])=>{c.beginPath();c.moveTo(a,b);c.quadraticCurveTo((a+d)/2,b-2,d,e);c.stroke();});
  c.strokeStyle=rgba(mix(E.hair,skin,0.35),0.9);c.lineWidth=2.4;c.lineCap="round";c.beginPath();c.moveTo(-29,-17);c.quadraticCurveTo(-20,-21,-9,-17);c.stroke();c.lineWidth=2;c.beginPath();c.moveTo(-40,-15);c.quadraticCurveTo(-37,-18,-34,-17);c.stroke();
  [[-19,-9,7.4,1],[-37,-9.5,3.4,0.6]].forEach(([ex,ey,ew,k])=>{const op=Math.max(0.08,blink);c.save();c.beginPath();c.moveTo(ex-ew,ey);c.quadraticCurveTo(ex,ey-6*op,ex+ew,ey+0.4);c.quadraticCurveTo(ex,ey+3.6*op,ex-ew,ey);c.closePath();c.fillStyle="rgba(236,226,214,0.95)";c.fill();c.clip();
    c.beginPath();c.arc(ex-ew*0.32,ey-1.4,3.9*Math.min(1,k+0.3),0,TAU);c.fillStyle="rgba(46,28,20,1)";c.fill();c.beginPath();c.arc(ex-ew*0.32-1,ey-2.6,1.1,0,TAU);c.fillStyle="rgba(255,255,255,0.9)";c.fill();c.restore();
    c.beginPath();c.moveTo(ex-ew-0.5,ey);c.quadraticCurveTo(ex,ey-6.4*op,ex+ew+0.5,ey+0.2);c.strokeStyle=rgba(darken(skin,0.55),0.9);c.lineWidth=1.7;c.stroke();});
  c.strokeStyle=rgba(darken(skin,0.4),0.4);c.lineWidth=0.9;[[-9,-9,-5,-11],[-9,-7,-4,-6],[-10,-5,-6,-2]].forEach(([a,b,d,e])=>{c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.stroke();});
  // nose, the fold beside it, a quiet smile
  c.strokeStyle=rgba(darken(skin,0.45),0.55);c.lineWidth=1.3;c.beginPath();c.moveTo(-38,8);c.quadraticCurveTo(-33,6,-34,11);c.stroke();
  c.beginPath();by_taper(c,[[-33,9],[-30,17],[-31,27]],1.1);c.fillStyle=rgba(darken(skin,0.4),0.45);c.fill();
  c.beginPath();c.moveTo(-41,20.5);c.quadraticCurveTo(-35,21.5,-29,18.5);c.strokeStyle=rgba(darken(skin,0.55),0.85);c.lineWidth=1.6;c.stroke();
  c.fillStyle="rgba(200,110,90,0.14)";c.beginPath();c.ellipse(-22,8,8,5,0,0,TAU);c.fill();}
// the head's pivot (at the top of the neck), in her units, and her eye relative to it
const BY_EHEAD=[18,-302];
function by_elder(ctx,x,y,s,t,o){o=o||{};t=t||0;const E=BY_ELDER,skin=o.skin||E.skin,L=by_L(1,0.32),line=(c,col,al,w)=>seam(c,col,al==null?0.45:al,w||1.4);
  const breath=Math.sin(t*1.5+0.7),bl=(t+2.1)%4.6,blink=bl<0.15?Math.abs(bl-0.075)/0.075:1;
  // where she looks: the head turns up towards it
  const look=o.look||[x-460*s,y-560*s],hx=x+BY_EHEAD[0]*s,hy=y+BY_EHEAD[1]*s,la=Math.atan2(look[1]-hy,-(look[0]-hx)),R=clamp(-la*0.6,-0.12,0.4)+Math.sin(t*0.6)*0.012;
  const key="elder|"+skin.join(","),rim={col:o.edge||E.edge,glow:0.4,ring:1.2/s,blur:10.5/s},nx=BY_EHEAD[0],ny=BY_EHEAD[1]-breath*1.2;
  by_figure(ctx,[x-190*s,y-420*s,x+110*s,y+20*s],(c,e)=>{
    c.save();c.translate(x,y);c.scale(s,s);by_blit(c,key+"|body",0,0,0,[-180,-300,96,6],cc=>by_elderBody(cc,skin,E),{rim,edge:e});c.restore();
    c.save();c.translate(x+nx*s,y+ny*s);c.scale(s,s);by_blit(c,key+"|head",0,0,R,[-62,-106,50,8],cc=>{cc.translate(-4,-44);by_elderHead(cc,skin,E,1,L,line);},{rim,edge:e,live:true});
    // a blink: the lids close over the eyes
    if(!e&&blink<0.75){c.rotate(R);c.translate(-4,-44);[[-19,-9,7.4],[-37,-9.5,3.4]].forEach(([ex,ey,ew])=>{c.beginPath();c.moveTo(ex-ew-0.6,ey+0.2);c.quadraticCurveTo(ex,ey-6.8,ex+ew+0.6,ey+0.6);c.quadraticCurveTo(ex,ey+4.2,ex-ew-0.6,ey+0.2);c.closePath();c.fillStyle=rgba(darken(skin,0.08),1);c.fill();
      c.beginPath();c.moveTo(ex-ew-0.5,ey+0.6);c.quadraticCurveTo(ex,ey+2.4,ex+ew+0.5,ey+0.8);c.strokeStyle=rgba(darken(skin,0.55),0.85);c.lineWidth=1.5;c.stroke();});}
    c.restore();});}

/* ---------- a scribe's arm ---------- */
// A scribe's bare forearm and hand from the upper right, holding a cut reed. The arm has two bones: the shoulder is off the picture, and the elbow
// is found each frame from where the reed's tip must be (the upper arm about 1.15 times the forearm, the forearm about 1.45 times the hand),
// so the arm pivots at the shoulder and bends at the elbow as the hand moves along the rows.
const BY_REED=[204,176,118],BY_SCR_F=130,BY_SCR_U=150,BY_SCR_X=70;
// the reed, in the hand's units: a length of reed, tapering a little to a tip cut straight across (pressed upright it leaves a round hole,
// at a slant a notch), with two nodes and fine fibres along it
function by_reed(c){const P0=[BY_PEN.pinch[0]+BY_PEN.dir[0]*36,BY_PEN.pinch[1]+BY_PEN.dir[1]*36],d=BY_PEN.dir,len=128;
  c.save();c.translate(P0[0],P0[1]);c.rotate(Math.atan2(d[1],d[0])+Math.PI);
  c.beginPath();c.moveTo(0.4,-2.5);c.quadraticCurveTo(0,0,0.4,2.5);c.lineTo(20,3.1);c.lineTo(len,3.5);c.quadraticCurveTo(len+2.4,0,len,-3.5);c.lineTo(20,-3.1);c.closePath();
  const g=c.createLinearGradient(0,-3.5,0,3.5);g.addColorStop(0,rgba(lighten(BY_REED,0.3),1));g.addColorStop(0.5,rgba(BY_REED,1));g.addColorStop(1,rgba(darken(BY_REED,0.35),1));c.fillStyle=g;c.fill();c.strokeStyle=rgba(darken(BY_REED,0.55),0.6);c.lineWidth=0.7;c.stroke();
  // the cut end: the pale ring of the reed's wall
  c.beginPath();c.ellipse(1.1,0,1.1,2.4,0,0,TAU);c.fillStyle=rgba(mix(BY_REED,[244,232,200],0.55),1);c.fill();
  [58,112].forEach(nx=>{c.beginPath();c.ellipse(nx,0,1.6,3.8,0,0,TAU);c.fillStyle=rgba(darken(BY_REED,0.3),0.9);c.fill();c.beginPath();c.moveTo(nx+1.4,-3.3);c.lineTo(nx+1.4,3.3);c.strokeStyle=rgba(lighten(BY_REED,0.35),0.7);c.lineWidth=0.6;c.stroke();});
  c.strokeStyle=rgba(darken(BY_REED,0.3),0.35);c.lineWidth=0.4;[-1.6,0.4,2].forEach(yy=>{c.beginPath();c.moveTo(6,yy*0.8);c.lineTo(len-2,yy*1.1);c.stroke();});c.restore();}
// the reed's tip in the forearm's frame: the elbow at (0,0), the wrist at (F,0), the thumb's side towards +y (the hand is mirrored)
const BY_SCRT=[BY_SCR_F-4+(BY_PEN.pinch[0]+BY_PEN.dir[0]*36)*0.9,-(BY_PEN.pinch[1]+BY_PEN.dir[1]*36)*0.9];
// The two bones are drawn as they are each frame (their outlines are simple, and a long picture turned into place would cost more), each with
// its luminous edge put down first; the hand and the reed are one picture, turned with the forearm.
// the forearm's outline, in its frame (the elbow at 0,0, the wrist at (F,0)); its back end, round the elbow, lies under the upper arm
const BY_SCRF=[[BY_SCR_F+2,-13.4],[BY_SCR_F-12,-14.6],[104,-15.6],[76,-18],[48,-20.4],[22,-22],[4,-20.5],[-10,-12],[-15,0],[-9,12],[6,20],[26,25.5],[52,23.5],[80,18.8],[106,15.2],[BY_SCR_F+2,13.6]];
// the upper arm's outline, in its frame (the elbow at 0,0, the shoulder at (U,0) and beyond, off the picture). Over the forearm at the elbow:
// its round end makes the elbow's point (+y, away from the bend), and where it crosses the forearm, the crease inside the elbow
const BY_SCRU=[[-6,-13],[8,-20],[BY_SCR_U*0.3,-24.6],[BY_SCR_U*0.62,-23.8],[BY_SCR_U,-24.6],[BY_SCR_U+BY_SCR_X,-28],[BY_SCR_U+BY_SCR_X,28],[BY_SCR_U,25],[BY_SCR_U*0.55,23.4],[BY_SCR_U*0.2,21.6],[8,20.5],[-7,16.5],[-15.5,6],[-14,-5]];
// the light comes from the thumb's side of the forearm (+y), and from the biceps' side of the upper arm (-y), when the arm lies as in the end scene
function by_scribeFore(c,skin){const F=BY_SCR_F,out=BY_SCRF;
  c.beginPath();by_curve(c,out,true);const g=c.createLinearGradient(0,25,0,-21);g.addColorStop(0,rgba(lighten(skin,0.2),1));g.addColorStop(0.45,rgba(skin,1));g.addColorStop(1,rgba(darken(skin,0.34),1));c.fillStyle=g;c.fill();seam(c,skin,0.42,1.2);
  // the long muscle on the thumb's side catching the light; the ulna's ridge in shadow
  c.beginPath();by_taper(c,[[10,15],[36,18],[72,13.5],[108,9.5]],3.6);c.fillStyle=rgba(lighten(skin,0.3),0.3);c.fill();
  c.beginPath();by_taper(c,[[34,-14],[74,-13.4],[120,-11.2]],1.8);c.fillStyle=rgba(darken(skin,0.5),0.26);c.fill();
}
function by_scribeUpper(c,skin){const U=BY_SCR_U,out=BY_SCRU;
  c.beginPath();by_curve(c,out,true);const g=c.createLinearGradient(0,-25,0,25);g.addColorStop(0,rgba(lighten(skin,0.17),1));g.addColorStop(0.5,rgba(skin,1));g.addColorStop(1,rgba(darken(skin,0.36),1));c.fillStyle=g;c.fill();seam(c,skin,0.4,1.2);
  c.beginPath();by_taper(c,[[16,-15],[U*0.38,-18],[U*0.8,-17]],3.8);c.fillStyle=rgba(lighten(skin,0.28),0.26);c.fill();
  c.beginPath();by_taper(c,[[22,13],[U*0.5,15.5],[U*0.9,16.5]],2.2);c.fillStyle=rgba(darken(skin,0.5),0.24);c.fill();
  c.beginPath();by_taper(c,[[-8,-10],[0,-15],[10,-19]],1.2);c.fillStyle=rgba(darken(skin,0.5),0.4);c.fill();
  c.beginPath();c.ellipse(-7,9,6,4.4,-0.6,0,TAU);c.fillStyle=rgba(lighten(skin,0.22),0.14);c.fill();
  c.beginPath();by_taper(c,[[-12,2],[-9,11],[-2,16]],1);c.fillStyle=rgba(darken(skin,0.5),0.3);c.fill();}
// the hand and the reed, mirrored so that the thumb lies on the lit side; in units with the wrist at (0,0)
function by_scribeHand(c,skin){c.scale(0.9,-0.9);by_hand(c,"pen",skin,{L:[0.09,-0.99],mid:by_reed,thumbUnder:true});}
// the shadow on the clay of the hand, the reed and the forearm, soft, from the reed's tip (where the reed touches, its shadow meets it): the reed's
// drawn as it is, the hand's and the forearm's a blurred picture placed on whole pixels (turned in steps of 2 degrees: a soft shadow hides them)
function by_scribeShadow(c,x,y,phi,s,lift){const T=BY_SCRT,px=x+lift*0.3,py=y+lift*1.3,cs=Math.cos(phi)*s,sn=Math.sin(phi)*s,P=(u,v)=>[px+(u-T[0])*cs-(v-T[1])*sn,py+(u-T[0])*sn+(v-T[1])*cs];
  const r1=P(124+1.5,40-30);c.save();c.lineCap="round";[[7,0.07],[2.6,0.12]].forEach(([w,a])=>{c.strokeStyle="rgba(24,12,4,"+a+")";c.lineWidth=w*s;c.beginPath();c.moveTo(px,py);c.lineTo(r1[0],r1[1]);c.stroke();});c.restore();
  const q=Math.round(phi/0.035)*0.035;c.save();c.translate(px,py);c.scale(s,s);by_blit(c,"scrshadow",0,0,q,[-130,-50,10,20],(cc,D)=>{cc.translate(-T[0],-T[1]);cc.fillStyle="#000";
    cc.beginPath();cc.ellipse(166,-13,46,18,0.05,0,TAU);cc.fill();cc.globalAlpha=0.4;cc.beginPath();cc.ellipse(118,-22,36,14,-0.1,0,TAU);cc.fill();cc.globalAlpha=1;
    const W=cc.canvas.width,H=cc.canvas.height,sc=by_scratch(W,H);sc.drawImage(cc.canvas,0,0);cc.setTransform(1,0,0,1,0,0);cc.clearRect(0,0,W,H);cc.filter="blur("+(7*D).toFixed(1)+"px)";cc.globalAlpha=0.3;cc.drawImage(BY_SCR,0,0,W,H,0,0,W,H);cc.filter="none";cc.globalAlpha=1;},{sub:false,rq:0.035});c.restore();}
// Where the scribe's reed is, u seconds after the writing on a tablet(ctx,x,y,w,h,p) began (p going from 0 to 1 in 5 s): mark i forms while
// u*9.6 goes from i to i+1 (see tablet() in land.js). The hand glides along each row, dipping the reed into every mark as it starts to form,
// swings back in an eased arc of 0.3 s between rows, and after the last mark lifts away up and to the right (0.7 s). Returns what stylus()
// takes (x, y, alpha, and the options: the shoulder S and the lift), or null once the hand has gone.
function by_scribe(u,x,y,w,h){const q=u*9.6,c=0.82,d0=0.4,run=11*c,mk=i=>[x+48+(i%12)*(w-80)/12+hash(i,2)*6,y+Math.floor(i/12)*h/5+h/10+2];
  const at=m=>{const i=Math.floor(m),f=m-i,A=mk(i),B=mk(Math.min(47,i+1));return[lerp(A[0],B[0],f),lerp(A[1],B[1],f)];};
  let P,lift=0,leave=0;
  if(q<d0){P=mk(0);lift=7*(1-ease(clamp((q+5)/(5+d0),0,1)));}
  else{const r=Math.min(3,Math.floor((q-d0)/12)),ql=q-d0-12*r;
    if(ql<=run){const m=ql/c,f=m-Math.floor(m);P=at(12*r+Math.min(11,m));lift=1.5*(0.5-0.5*Math.cos(TAU*f));}
    else if(r<3){const v=(ql-run)/(12-run),e=v*v*(3-2*v),A=mk(12*r+11),B=mk(12*r+12);P=[lerp(A[0],B[0],e),lerp(A[1],B[1],e)-26*Math.sin(Math.PI*v)];lift=16*Math.sin(Math.PI*v);}
    else{P=mk(47);leave=clamp((ql-run)/6.72,0,1);lift=4*Math.sin(Math.PI*0.5*clamp((ql-run)/1.5,0,1));}}
  if(leave>=1)return null;
  // the shoulder: off the picture above, following the row, and part of the way along it, so that the arm pivots and bends as the hand travels
  const S=[x+370+0.42*(P[0]-x-48),P[1]-460],lv=leave*leave*(3-2*leave),L=[0.29,-0.96];
  const D=[lv*760,-lv*560];
  return{x:P[0]+L[0]*lift+D[0],y:P[1]+L[1]*lift+D[1],a:1-lv*lv,S:[S[0]+D[0],S[1]+D[1]],lift};}
// stylus(ctx,x,y,t,a[,o]): the reed's tip at (x,y) (exactly, whenever it presses). o.S: the shoulder (default: up and a little to the right),
// o.lift: how high the tip is above the clay, in px (for the shadow), o.s: the size (1.6: a hand about 145 px long), o.skin
function stylus(ctx,x,y,t,a,o){o=o||{};withA(ctx,a==null?1:a,()=>{const s=o.s||1.6,lift=o.lift||0,U=BY_SCR_U*s,T=BY_SCRT,B2=Math.hypot(T[0],T[1])*s,al=Math.atan2(T[1],T[0]),skin=o.skin||BY_SKIN.scribe;
  let S=o.S||[x+190*s/1.6,y-460*s/1.6];const dx=x-S[0],dy=y-S[1],D=Math.hypot(dx,dy)||1,ux=dx/D,uy=dy/D,Dc=clamp(D,Math.abs(U-B2)+1,U+B2-1);
  // out of reach (or too close), the shoulder comes along the line to the tip
  S=[x-ux*Dc,y-uy*Dc];const aa=(U*U-B2*B2+Dc*Dc)/(2*Dc),hh=Math.sqrt(Math.max(0,U*U-aa*aa)),E1=[S[0]+aa*ux+hh*uy,S[1]+aa*uy-hh*ux],E2=[S[0]+aa*ux-hh*uy,S[1]+aa*uy+hh*ux],E=E1[0]>E2[0]?E1:E2;
  const phi=Math.atan2(y-E[1],x-E[0])-al,thu=Math.atan2(S[1]-E[1],S[0]-E[0]),rim={col:BY_WARMRIM,glow:0.35,ring:1.2/s,blur:10/s};
  // the shadow first, on the clay
  by_scribeShadow(ctx,x,y,phi,s,lift);
  const X=[S[0],E[0],x],Y=[S[1],E[1],y],mg=70*s,W=[E[0]+Math.cos(phi)*(BY_SCR_F-4)*s,E[1]+Math.sin(phi)*(BY_SCR_F-4)*s];
  const bone=(c,ang,fn)=>{c.save();c.translate(E[0],E[1]);c.rotate(ang);c.scale(s,s);fn(c);c.restore();};
  by_figure(ctx,[Math.min(...X)-mg,Math.min(...Y)-mg,Math.max(...X)+mg+BY_SCR_X*s,Math.max(...Y)+mg],(c,e)=>{
    // both bones' edges in one go: their outlines, placed in the picture, as one path
    if(e){const pl=(P,a)=>{const cs=Math.cos(a)*s,sn=Math.sin(a)*s;return P.map(([u,v])=>[E[0]+u*cs-v*sn,E[1]+u*sn+v*cs]);};
      by_liveRim(c,q=>{by_curve(q,pl(BY_SCRF,phi),true);by_curve(q,pl(BY_SCRU,thu),true);},{col:rim.col,glow:rim.glow,ring:rim.ring*s,blur:rim.blur*s});return;}
    bone(c,phi,cc=>by_scribeFore(cc,skin));
    // the hand and the reed: its edge left out at the wrist, where it lies on the forearm
    c.save();c.translate(W[0],W[1]);c.scale(s,s);by_blit(c,"scrH|"+skin,0,0,phi,[-8,-26,100,46],cc=>by_scribeHand(cc,skin),{live:true,merge:true,rim,rimCut:q=>q.fillRect(-60,-60,64,120)});c.restore();
    bone(c,thu,cc=>by_scribeUpper(cc,skin));});});}

/* ---------- warming the caches ---------- */
// The pictures of these figures take 5 to 60 ms each to draw the first time (the brain, the baby's hand as it opens, the host's hand as it closes,
// the scribe's shadow at each angle...). Soon after the film's page loads they are drawn once, off screen, at the player's size, one small batch
// at a time with pauses between, so that playing or seeking into their scenes never stalls. Only on a page with the film's player: not while
// rendering the video, and not on the labs' pages.
(function(){if(typeof window==="undefined"||typeof document==="undefined"||typeof setTimeout!=="function")return;
  const ctx=()=>{const cv=document.getElementById("film"),S=clamp(((cv&&cv.width)||1280)/1920,0.2,1),c=mkCanvas(8,8).getContext("2d");c.setTransform(S,0,0,S,0,0);return c;};
  const card=[840,380,420,286,-0.03],jobs=[c=>by_elder(c,1487,925,1.02,1,{look:[1040,340]}),c=>brain(c,1380,470,2.4,1,0.5,1),c=>baby(c,1120,780,1.3,1,0.8,1,{at:[910,670]}),
    c=>pointArm(c,-60,560,236,500,1.35,1,{at:[900,630],t:1}),c=>pointArm(c,-60,680,740,598,2.0,1,{pose:"give",dress:"coat",card,t:1}),
    c=>{ground(c,600,1);grass(c,0,1920,610,1,0.8);}];
  for(let j=0;j<5;j++)jobs.push(c=>{for(let k=j*4;k<=Math.min(16,j*4+3);k++)baby(c,565,701,1.5,1,k<16?0.2+0.3*k/16:1,1,{at:[1040,340]});});
  for(let j=0;j<5;j++)jobs.push(c=>{for(let k=j*4;k<=Math.min(16,j*4+3);k++)pointArm(c,1360+760,680,1360,556,2.0,1,{pose:"take",dress:"coat",k:k/16,card,t:1});});
  for(let j=0;j<6;j++)jobs.push(c=>{for(let k=0;k<5;k++){const W=by_scribe((j*5+k)*0.19,660,230,600,380);if(W)stylus(c,W.x,W.y,1,W.a,W);}});
  const next=()=>{const f=jobs.shift();if(!f)return;try{f(ctx());}catch(e){}setTimeout(next,40);};
  const go=()=>{if(window.__RENDER__||!document.getElementById("film"))return;setTimeout(next,900);};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();})();

/* ===== What's in a word: scenes =====
   Ten chapters, as in ../script.md. Graduation week: four offices give four answers to "how many credentials did we award?".
   To see why, the film goes back before writing and before words: kinds without words, calls that point, what words add,
   one idea in many forms, the grain of a word, fuzzy edges and drifting meanings. Then the offices agree, on paper. */
const CRED_Q="How many credentials did we award this year?";
const ANS=[["reg",7420],["short",10600],["careers",14650],["lms",26900]];
const ANS_MEANING={reg:"awards: degrees and diplomas",short:"awards and microcredentials",careers:"plus every badge, even for turning up",lms:"plus every certificate of completion"};
const ANS_GAP={careers:"✗ 2,760 aren't credentials",lms:"✗ 15,010 aren't credentials"};

/* ---------- 1. Four answers ---------- */
scene("answers",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const back=fin(t,c("back")+0.4,1.4);
  withA(ctx,1-back*0.96,()=>{
    tag(ctx,120,120,"Graduation week",TRUST,{size:22});
    // gowns and caps drifting down, for the week that's in it
    for(let i=0;i<14;i++){const x=(hash(i,2)*1920+t*12)%1920,y=((hash(i,3)*1200+t*(24+hash(i,4)*20))%1300)-120,r=Math.sin(t*0.8+i)*0.6;ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.fillStyle="rgba(255,209,102,0.10)";ctx.fillRect(-16,-4,32,8);ctx.fillRect(-4,-4,8,14);ctx.restore();}
    person(ctx,"david",300,880,0.62,{t,pose:t>c("q")&&t<c("four")?"explain":"stand",expr:t>c("none")?"relieved":"calm"});
    withA(ctx,fin(t,c("q")+0.6,0.6),()=>bubble(ctx,140,210,560,CRED_Q,TRUST,{size:30}));
    // four offices, four numbers, counted up as the narrator reads them
    const nT=c("nums"),gap=[0.2,2.4,4.6,6.9];
    ANS.forEach(([k,v],i)=>{const x=860+(i%2)*500,y=190+Math.floor(i/2)*250,a=fin(t,c("four")+0.3+i*0.25,0.5),n=countTo(t,nT+gap[i],0,v);
      officeCard(ctx,x,y,460,k,t>nT+gap[i]?fmtNum(n):"…",{a,ok:fin(t,c("none")+1.0+i*0.3,0.4),hi:pulseAt(t,nT+gap[i]+0.3,1.2)});});
    // one word over all four
    const w1=fin(t,c("none")+2.6,0.6);if(w1>0){withA(ctx,w1,()=>{[[1090,190],[1590,190],[1090,440],[1590,440]].forEach(([x,y])=>{ctx.strokeStyle=rgba(TRUST,0.35);ctx.lineWidth=1.5;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(1340,112);ctx.lineTo(x,y+2);ctx.stroke();ctx.setLineDash([]);});
      tag(ctx,1340,100,"“credential”",TRUST,{align:"center",size:26});});}});
  // going back: the years roll back, past writing, to before words
  if(back>0){const u=clamp((t-c("back")-0.6)/3.4,0,1),stops=["2026","1964","1494","c. 3300 BCE","before words"],k=Math.min(stops.length-1,Math.floor(ease(u)*stops.length));
    withA(ctx,back*(1-fin(t,B,0.6)),()=>{glow(ctx,960,470,260,WA_INK,0.12);T(ctx,stops[k],960,500,{w:800,size:k===4?72:96,align:"center",color:rgba(k>=3?CLAY:INK,1)});
      motifDots(ctx,960,580,10,WA_INK,0.6,u);});}
  seriesTitle(ctx,S,t,B,"What's in a word","how minds and words make the first data model",WA_INK);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Kinds without words ---------- */
const PHOTOS=[[0,1],[1,0],[2,1],[3,0],[4,0],[5,1],[6,1],[7,0],[8,0],[9,1],[10,0],[11,1]];
scene("kinds",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const nw=fin(t,c("noword")+0.2,0.8),fs=fin(t,c("first")+0.2,0.8);
  // left: the pigeons and the photos
  yearTag(ctx,120,120,"1964 · pigeons and photos",CLAY,fin(t,0.3,0.6));
  const pk=Math.floor(Math.max(0,t-c("pigeons")-1.5)/1.1);
  // sorted without words: photos with people gather on the right, the others on the left, three by two
  const slot=i=>{const has=PHOTOS[i][1],j=PHOTOS.filter((q,n)=>q[1]===has&&n<i).length,gx=has?640:250,gy=600;return[gx-180+(j%3)*120,gy-90+Math.floor(j/3)*90];};
  PHOTOS.forEach(([k,has],i)=>{const cx=150+(i%4)*175,cy=180+Math.floor(i/4)*135,sorted=slot(i);
    const x=lerp(cx,sorted[0],nw),y=lerp(cy,sorted[1],nw),w=lerp(150,110,nw),h=lerp(110,80,nw);
    const order=PHOTOS.filter(q=>q[1]).indexOf(PHOTOS[i]),mk=has&&order>=0&&order<=pk?fin(t,c("pigeons")+1.5+order*1.1,0.3):0;
    photoTile(ctx,x,y,w,h,k,has,fin(t,0.4+i*0.08,0.4),mk*(1-nw));});
  withA(ctx,1-nw,()=>{const tgt=PHOTOS.filter(q=>q[1])[Math.min(5,pk)]||PHOTOS[0],ti=PHOTOS.indexOf(tgt),px=150+(ti%4)*175+75,py=180+Math.floor(ti/4)*135+140,bob=Math.abs(Math.sin((t-c("pigeons"))*5.7))*14;
    {const c0=c("pigeons"),LIT=PHOTOS.filter(q=>q[1]),st=k=>{const i=PHOTOS.indexOf(LIT[k]);return[c0+1.38+k*1.1,190+(i%4)*175,350+Math.floor(i/4)*135,1];},R=bd_route(t,[[c0-0.55,120,350,0],st(0),st(3),st(5),[c0+11.1,630,620,0],[c0+16.05,700,620,0]],1.45);pigeon(ctx,R.x,R.y,1.45,[210,220,240],Object.assign({a:fin(t,0.6,0.6),t},R));}
    withA(ctx,fin(t,c("pigeons")+4.0,0.6),()=>tag(ctx,450,640,"people? peck",GOOD,{align:"center",size:20}));});
  // right: the bee, choosing the same
  const bT=c("bees"),ph2=fin(t,bT+3.4,0.3),sample=ph2>0.5?"hstripes":"blue",opts=ph2>0.5?["vstripes","hstripes"]:["blue","yellow"],ok=ph2>0.5?1:0;
  withA(ctx,fin(t,bT-0.2,0.6)*(1-nw),()=>{T(ctx,"the sample",1450,210,{w:700,size:20,align:"center",color:rgba(SOFT,1)});beeCard(ctx,1450,300,130,sample,1,false);
    opts.forEach((k,i)=>beeCard(ctx,1300+i*300,560,130,k,1,i===ok&&t>bT+(ph2>0.5?5.2:2.2)));
    {const F=bd_flight(t,[[bT-0.4,1590,285,-1],[bT+0.5,1588,292,-1],[bT+1.1,1560,405,-1],[bT+1.5,1450,430,-1],[bT+2,1305,426,-1],[bT+2.7,1300,428,-1],[bT+3,1330,440,1],[bT+3.4,1525,445,1],[bT+3.8,1596,300,1],[bT+4.2,1590,292,-1],[bT+5.1,1605,426,-1]]);bee(ctx,F.x,F.y,2.4,t,{a:1,vx:F.vx,vy:F.vy,face:F.face});}
    withA(ctx,fin(t,bT+(ph2>0.5?5.4:2.4),0.3),()=>tag(ctx,1300+ok*300,665,"same",GOOD,{align:"center",size:20}));});
  // no words: two kinds, sorted without a single word
  withA(ctx,nw,()=>{bubble(ctx,760,110,400,"no words",BAD,{size:30});cross_(ctx,1100,150,40,BAD,1);
    [[635,595,"with people",GOOD],[245,595,"without",SOFT]].forEach(([x,y,s,col])=>{ring(ctx,x,y,215,col,0.55,2,[8,10]);T(ctx,s,x,y+245,{w:700,size:20,align:"center",color:rgba(col,1)});});
    [["same",1350],["different",1650]].forEach(([s,x],i)=>{beeCard(ctx,x-60,470,90,i?"yellow":"blue",1,false);beeCard(ctx,x+50,470,90,i?"vstripes":"hstripes",1,false);ring(ctx,x,470,140,i?SOFT:GOOD,0.5,2,[8,10]);});});
  // concepts first, then words that point at them
  withA(ctx,fs,()=>{[[635,330],[1350,300],[1650,300]].forEach(([x,y],i)=>{glow(ctx,x,y,70,KIND,0.5+0.2*Math.sin(t*2+i));ctx.fillStyle=rgba(mix(KIND,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,y,16,0,TAU);ctx.fill();});
    T(ctx,"a concept",980,318,{w:700,size:22,align:"center",color:rgba(KIND,1)});arrowTo(ctx,900,312,680,326,KIND,0.6,{head:10,lw:1.6});arrowTo(ctx,1060,312,1310,300,KIND,0.6,{head:10,lw:1.6});
    withA(ctx,fin(t,c("first")+1.8,0.6),()=>{[["person",635,230],["same",1350,200],["different",1650,200]].forEach(([s,x,y])=>{tag(ctx,x,y,s,WA_INK,{align:"center",size:22});arrowTo(ctx,x,y+24,x,y+78,WA_INK,0.8,{head:10,lw:2});});});});
  vign(ctx,S);});

/* ---------- 3. Calls that point ---------- */
const MONK=[[500,745],[600,752],[700,742],[800,750]];
const TREE_SPOTS=[[230,560],[340,520],[270,470],[390,590]],BUSH_SPOTS=[[990,768],[1060,760],[1130,768],[1200,764]];
scene("calls",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const nm=fin(t,c("names")-0.2,0.9),idA=fin(t,c("ids")+0.2,0.8),cL=c("leopard"),cE=c("eagle"),cS=c("snake");
  const wL=fin(t,cL+1.0,1.2)*(1-fin(t,cE+0.3,0.8)),wE=fin(t,cE+1.4,1.1)*(1-fin(t,cS+0.3,0.8)),wS=fin(t,cS+0.8,0.8);
  withA(ctx,1-nm,()=>{
    // the grassland at dusk
    ground(ctx,760,t);
    tree(ctx,300,770,1.5,1,t);bush(ctx,1085,770,1.5,1,t);grass(ctx,0,1920,770,t,0.9);
    yearTag(ctx,120,120,"vervet monkeys · alarm calls",CLAY,fin(t,0.3,0.6));
    // the hunters, each with its own call
    leopard(ctx,lerp(2000,1500,fin(t,cL-0.5,3.4)),700,2.2,LEO,{a:fin(t,cL-0.4,0.5)*(1-fin(t,cE,0.6)),t,flip:1,walk:-500*(1-fin(t,cL-0.5,3.4))});
    {const u=fin(t,cE-0.7,4.4);eagle(ctx,lerp(1990,1060,u)-Math.max(0,t-cE-3.7)*12,lerp(440,360,u)+Math.sin(t*1.2)*6,1.3,EAG,{a:fin(t,cE-0.3,0.5)*(1-fin(t,cS,0.6)),t,yaw:lerp(-0.95,-0.6,u),bank:0.15,elev:1.2});}
    snake(ctx,1420,748,1.3,SNK,{a:fin(t,cS-0.2,0.5)*(1-fin(t,c("kind")+2,0.8)),t,flip:1,crawl:t-cS});
    [[cL,LEO],[cE,EAG],[cS,SNK]].forEach(([c0,col])=>{const u=clamp((t-c0-0.3)/1.4,0,1);if(u>0&&u<1)for(let k=0;k<3;k++){const r=40+u*260+k*40;ring(ctx,MONK[1][0]+30,MONK[1][1]-40,r,col,(1-u)*0.7,3);}});
    MONK.forEach((m,i)=>{let x=m[0],y=m[1];x+=(TREE_SPOTS[i][0]-m[0])*wL+(BUSH_SPOTS[i][0]-m[0])*wE;y+=(TREE_SPOTS[i][1]-m[1])*wL+(BUSH_SPOTS[i][1]-m[1])*wE-30*wS;
      monkey(ctx,x,y-44+30*wS,1.4,[225,205,175],{a:1,t,i,tree:wL,bush:wE,tall:wS,calls:[cL,cE,cS],path:[m,TREE_SPOTS[i],BUSH_SPOTS[i]]});if(wE>0.2&&wE<0.99)withA(ctx,wE,()=>T(ctx,"↑",x,y-100,{w:800,size:26,align:"center",color:rgba(EAG,1)}));if(wS>0.2)withA(ctx,wS,()=>T(ctx,"↓",x+16,y-96,{w:800,size:24,align:"center",color:rgba(SNK,1)}));});
    // the low front of the bush, over the monkeys that dive into it
    bush(ctx,1085,770,1.5,wE,t,{front:1});
    // the three calls, and what each one means
    [[cL,LEO,"leopard call","up into the trees"],[cE,EAG,"eagle call","look up, into the bushes"],[cS,SNK,"snake call","stand tall, search the grass"]].forEach(([c0,col,a1,a2],i)=>
      withA(ctx,fin(t,c0+0.4,0.5),()=>{glass(ctx,1240,110+i*96,560,76,16,col,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.92)"});ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(1276,148+i*96,9,0,TAU);ctx.fill();
        T(ctx,a1,1300,140+i*96,{w:800,size:22,color:rgba(col,1)});T(ctx,"→ "+a2,1300,168+i*96,{w:600,size:19});}));
    withA(ctx,fin(t,c("kind")+0.6,0.6),()=>{ctx.strokeStyle=rgba(KIND,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(1812,112);ctx.lineTo(1830,112);ctx.lineTo(1830,378);ctx.lineTo(1812,378);ctx.stroke();tag(ctx,1640,420,"each call: a kind of thing",KIND,{align:"center",size:20});});});
  // names: one particular animal
  withA(ctx,nm*(1-idA),()=>{[[dolphin,"dolphins",330],[elephant,"elephants",960],[marmoset,"marmosets",1590]].forEach(([f,s,x],i)=>{const a=fin(t,c("names")+0.4+i*0.7,0.6);
    withA(ctx,a,()=>{glass(ctx,x-250,230,500,440,22,NAMEC,{glow:14,ea:0.6,fill:"rgba(7,12,24,0.9)"});f(ctx,x,420,1.7,undefined,{a:1,t:t+i*1.3});T(ctx,s,x,300,{w:800,size:28,align:"center",color:rgba(NAMEC,1)});
      nameWave(ctx,x-160,560,320,70,i,NAMEC,1,clamp((t-c("names")-0.7-i*0.7)/1.4,0,1));T(ctx,"a call like a name",x,640,{w:600,size:19,align:"center",color:rgba(SOFT,1)});});});});
  // categories and identifiers
  withA(ctx,idA,()=>{glass(ctx,240,220,660,440,24,LEO,{glow:16,ea:0.75,fill:"rgba(7,12,24,0.92)"});leopard(ctx,570,420,1.5,LEO,{a:1,t});T(ctx,"a kind of thing",570,300,{w:800,size:30,align:"center",color:rgba(LEO,1)});T(ctx,"category",570,580,{f:"mono",w:500,size:26,align:"center",color:rgba(INK,0.95)});
    glass(ctx,1020,220,660,440,24,NAMEC,{glow:16,ea:0.75,fill:"rgba(7,12,24,0.92)"});dolphin(ctx,1350,410,1.5,NAMEC,{a:1,t});nameWave(ctx,1230,500,240,40,0,NAMEC,1,1);T(ctx,"one particular thing",1350,300,{w:800,size:30,align:"center",color:rgba(NAMEC,1)});T(ctx,"identifier",1350,580,{f:"mono",w:500,size:26,align:"center",color:rgba(INK,0.95)});
    withA(ctx,fin(t,c("ids")+3.2,0.6),()=>tag(ctx,960,740,"every data model needs both",KIND,{align:"center",size:26}));});
  vign(ctx,S);});

/* ---------- 4. What words add ---------- */
const TILES=["yesterday","a promise","a rule","tomorrow","we","if","never","here","not","will","keep","made"];
const PHRASES=[[4,1,0],[2,3],[5,6]];
scene("words",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cb=fin(t,c("combine")-0.2,0.8),kn=fin(t,c("know")-0.2,0.8),fo=fin(t,c("fossil")-0.2,0.8);
  // pointing: a baby, a bird, and someone looking where the baby looks
  withA(ctx,1-cb,()=>{ground(ctx,600,t);grass(ctx,0,1920,610,t,0.8);const bx=1040,by=330;robin(ctx,bx,by,1.6,{a:1,t});perch(ctx,bx,by+36,320,t);
    baby(ctx,565,701,1.5,fin(t,0.3,0.6),fin(t,c("point")+0.4,0.9),t,{at:[bx,by+10]});withA(ctx,fin(t,0.3,0.6),()=>by_elder(ctx,1487,925,1.02,t,{look:[bx,by+10]}));
    const ja=fin(t,c("point")+2.0,0.8);withA(ctx,ja,()=>{[[680,640],[1500,560]].forEach(([x,y])=>{ctx.strokeStyle=rgba(WA_INK,0.8);ctx.lineWidth=2.2;ctx.setLineDash([6,9]);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(bx,by+10);ctx.stroke();ctx.setLineDash([]);});tag(ctx,1060,520,"shared attention",WA_INK,{align:"center",size:22});});
    withA(ctx,fin(t,c("root")+0.6,0.6),()=>{[["this one",850,220],["here",1230,210],["that",1300,380]].forEach(([s,x,y],i)=>withA(ctx,fin(t,c("root")+0.8+i*0.5,0.4),()=>tag(ctx,x,y,s,KIND,{align:"center",size:24})));});});
  // combining without limit, and reaching what isn't here
  withA(ctx,cb*(1-kn),()=>{const u=clamp((t-c("combine")-1.2)/3,0,1);TILES.forEach((s,i)=>{let x=240+(i%6)*250,y=250+Math.floor(i/6)*110;
      PHRASES.forEach((ph,r)=>{const j=ph.indexOf(i);if(j>=0){const tx=520+j*230,ty=470+r*100;x=lerp(x,tx,ease(clamp(u*3-r,0,1)));y=lerp(y,ty,ease(clamp(u*3-r,0,1)));}});
      glass(ctx,x-95,y-30,190,60,12,WA_INK,{glow:8,ea:0.5,fill:"rgba(26,18,12,0.92)"});T(ctx,s,x,y+9,{w:700,size:24,align:"center",color:rgba(PARCH,1)});});
    withA(ctx,fin(t,c("combine")+5.0,0.6),()=>tag(ctx,960,160,"words reach what isn't here",KIND,{align:"center",size:24}));});
  // what someone knows: invisible, until a record shows it
  withA(ctx,kn*(1-fo),()=>{person(ctx,"mei",560,900,0.8,{t,expr:"calm"});const u=0.5+0.5*Math.sin(t*1.6);
    ctx.save();ctx.setLineDash([8,10]);ctx.strokeStyle=rgba(KIND,0.35+0.2*u);ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(560,230,220,90,0,0,TAU);ctx.stroke();ctx.restore();
    T(ctx,"what she knows",560,238,{w:700,size:26,align:"center",color:rgba(KIND,0.5+0.3*u)});T(ctx,"(you can't see it)",560,272,{w:600,size:18,align:"center",color:rgba(SOFT,0.8)});
    const rA=fin(t,c("know")+3.4,0.8);arrowTo(ctx,800,300,1010,360,TRUST,rA,{bend:-0.2});
    credCard(ctx,1050,280,560,{a:rA,era:"paper",title:"Diploma of Languages",issuer:"the university",holder:"Mei Tanaka",claim:"Spanish, advanced",date:"2019",press:fin(t,c("know")+4.2,0.5)});
    withA(ctx,fin(t,c("know")+4.8,0.6),()=>tag(ctx,1330,700,"a record shows it",TRUST,{align:"center",size:22}));});
  // no fossils
  withA(ctx,fo,()=>{strata(ctx,t);
    const qa=fin(t,c("fossil")+2.4,0.6);withA(ctx,qa,()=>{ctx.save();ctx.setLineDash([10,10]);ctx.strokeStyle=rgba(KIND,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(1000,560,120,70,0,0,TAU);ctx.stroke();ctx.restore();T(ctx,"?",1000,582,{w:800,size:64,align:"center",color:rgba(KIND,1)});});
    withA(ctx,fin(t,c("fossil")+3.2,0.6),()=>tag(ctx,960,180,"words leave no fossils",CLAY,{align:"center",size:26}));});
  vign(ctx,S);});

/* ---------- 5. One idea, many forms ---------- */
scene("forms",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const tr=fin(t,c("tri")-0.2,0.9),cT=c("cell"),hits=[cT+2.6,cT+4.2,cT+6.0],act=Math.max(...hits.map(h=>pulseAt(t,h,1.2)),fin(t,c("one"),0.6)*0.8);
  withA(ctx,1-tr,()=>{yearTag(ctx,120,120,"2005 · concept cells",CLAY,fin(t,0.3,0.6));brain(ctx,1380,470,2.4,t,act,fin(t,0.4,0.8));
    [["photo","a photo"],["drawing","a drawing"],["name","her written name"]].forEach(([k,l],i)=>{const x=120+i*240,y=300,a=fin(t,cT+1.0+i*0.5,0.5),hi=pulseAt(t,hits[i],1.2);portrait(ctx,x,y,k,a,hi);withA(ctx,a,()=>T(ctx,l,x+100,y+270,{w:700,size:20,align:"center",color:rgba(SOFT,1)}));
      const u=clamp((t-hits[i]+0.6)/0.6,0,1);if(u>0&&t<hits[i]+1.2){ctx.strokeStyle="rgba(255,236,160,"+(0.8*(1-fin(t,hits[i]+0.6,0.6)))+")";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+200,y+117);ctx.lineTo(lerp(x+200,1414,u),lerp(y+117,532,u));ctx.stroke();}});
    withA(ctx,fin(t,c("one")+0.2,0.6),()=>tag(ctx,1414,680,"many forms, one idea",[255,236,160],{align:"center",size:24}));});
  withA(ctx,tr,()=>{const e1=fin(t,c("tri")+1.6,1.0),e2=fin(t,c("tri")+3.6,1.0),e3=fin(t,c("gap")+0.4,1.2);
    trio(ctx,960,470,1.15,{t,word:"Mei Tanaka",idea:"the idea of Mei",thing:(cx,x,y,s)=>person(cx,"mei",x,y+40*s,0.36*s,{t}),thingLab:"Mei herself",thingDy:92,e1,e2,e3,wa:fin(t,c("tri")+0.6,0.5),ia:fin(t,c("tri")+1.2,0.5),ha:fin(t,c("tri")+3.0,0.5),gapNote:fin(t,c("gap")+1.6,0.6),gapText:"the word never touches the thing"});
    withA(ctx,fin(t,c("gap")+3.2,0.6),()=>tag(ctx,960,800,"misunderstandings live in the gap",EDGE_,{align:"center",size:24}));});
  vign(ctx,S);});

/* ---------- 6. Which part do you mean? ---------- */
scene("gavagai",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const mz=fin(t,c("mei")-0.2,0.9);
  withA(ctx,1-mz,()=>{ground(ctx,700,t);grass(ctx,0,1920,710,t,0.8);
  yearTag(ctx,120,120,"1960 · a philosopher's puzzle",CLAY,fin(t,0.3,0.6));
  const run=fin(t,0.6,4.0),rx=lerp(200,900,run),ry=660;rabbit(ctx,rx,ry,1.9,[235,225,205],t,{run:1,dist:rx-200+(t>2.6?175*Math.pow(Math.min(1,(t-2.6)/2),3)+262.5*Math.max(0,t-4.6):0)});
  // the stranger's pointing arm, and the word
  pointArm(ctx,-60,560,236,500,1.35,fin(t,c("rabbit")+0.8,0.6),{at:[rx,ry-30],t});
  withA(ctx,fin(t,c("rabbit")+3.2,0.4),()=>bubble(ctx,300,250,340,"gavagai!",WA_INK,{size:44}));
  // three things the word could mean
  const mT=c("mean"),opt=[["the rabbit",mT+0.4],["its ears",mT+1.6],["this moment of running",mT+2.8]];
  opt.forEach(([s,t0],i)=>{const a=fin(t,t0,0.5),hi=pulseAt(t,t0,1.6);withA(ctx,a,()=>{
    if(i===0)ring(ctx,rx,ry-10,120,KIND,0.5+0.5*hi,3);if(i===1){ring(ctx,rx+56,ry-96,44,KIND,0.5+0.5*hi,3);}if(i===2){ctx.strokeStyle=rgba(KIND,0.5+0.5*hi);ctx.lineWidth=3;ctx.strokeRect(rx-150,ry-150,300,230);for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(rx-200-k*30,ry-80+k*30);ctx.lineTo(rx-160-k*30,ry-80+k*30);ctx.stroke();}}
    glass(ctx,1240,230+i*120,560,86,18,KIND,{glow:10+10*hi,ea:0.6+0.4*hi,fill:"rgba(7,12,24,0.92)"});T(ctx,s,1270,283+i*120,{w:700,size:28});});});
  // children guess the whole thing
  withA(ctx,fin(t,c("kids")+1.0,0.6),()=>{baby(ctx,1120,780,1.3,1,0.8,t,{at:[rx+10,ry+10]});tick_(ctx,1770,273,34,GOOD,1);tag(ctx,1500,190,"children: the whole thing",GOOD,{align:"center",size:22});});
  // the grain
  withA(ctx,fin(t,c("grain")+1.8,0.6),()=>{glass(ctx,1240,630,560,150,20,TRUST,{glow:16,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(ctx,"the grain",1270,680,{w:800,size:28,color:rgba(TRUST,1)});T(ctx,"what counts as one?",1270,722,{w:600,size:24});T(ctx,"one rabbit? one ear? one moment?",1270,758,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});});});
  // back at the university: the same choice, for credentials
  if(mz>0)withA(ctx,mz,()=>{const mT=c("mei");
    tag(ctx,960,110,"the grain: what counts as one?",TRUST,{align:"center",size:24});
    person(ctx,"mei",330,940,0.6,{t,pose:t>mT+2.4&&t<mT+5.6?"explain":"stand",expr:"calm"});
    [["Degree","BA, Languages",OFFICE.reg.c],["Microcredential","Data ethics",OFFICE.short.c],["Microcredential","SQL basics",OFFICE.short.c]].forEach(([ti,cl,col],i)=>
      credCard(ctx,600+i*370,190,330,{a:fin(t,mT+2.2+i*0.5,0.5),title:ti,holder:"Mei Tanaka",claim:cl,col,signed:false}));
    // one person, or three credentials: two counts of the same cards
    const g1=fin(t,mT+5.0,0.5),g2=fin(t,mT+7.0,0.5);
    withA(ctx,g1,()=>{glass(ctx,600,520,520,170,20,KIND,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.94)"});T(ctx,"count graduates",630,568,{w:700,size:24,color:rgba(SOFT,1)});T(ctx,"1",630,660,{w:800,size:72,color:rgba(KIND,1)});T(ctx,"one row per person",760,650,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});
      // one person
      arrowTo(ctx,440,640,586,605,KIND,0.8,{head:10});});
    withA(ctx,g2,()=>{glass(ctx,1180,520,520,170,20,TRUST,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.94)"});T(ctx,"count credentials",1210,568,{w:700,size:24,color:rgba(SOFT,1)});T(ctx,"3",1210,660,{w:800,size:72,color:rgba(TRUST,1)});T(ctx,"one row per credential",1340,650,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});
      // a line from each card: three credentials
      [0,1,2].forEach(i=>arrowTo(ctx,765+i*370,424,1380+i*60,512,TRUST,0.8,{head:10}));});
    withA(ctx,fin(t,mT+9.0,0.6),()=>tag(ctx,1150,760,"the same person, a different grain",TRUST,{align:"center",size:22}));});
  vign(ctx,S);});

/* ---------- 7. Fuzzy edges ---------- */
const BIRDS=[[(c,x,y,s,a,t)=>robin(c,x,y,s,{a,t}),0,0,1.3],[(c,x,y,s,a,t)=>sparrow(c,x,y,s,{a,t}),-110,40,1.1],[(c,x,y,s,a,t)=>pigeon(c,x,y,s,undefined,{a,t}),190,-120,0.9],[(c,x,y,s,a,t)=>eagle(c,x,y,s,undefined,{a,t}),-230,-150,0.8],[(c,x,y,s,a,t)=>penguin(c,x,y,s,{a,t}),290,150,1.2],[(c,x,y,s,a,t)=>ostrich(c,x,y,s,{a,t}),-300,160,1.1]];
const CREDS=[["degree",-40,-18,0],["diploma",45,32,0],["microcredential",-135,-105,1],["badge · assessed",175,-135,2],["badge · turned up",180,150,3],["certificate of completion",-235,200,4]];
const RINGS=[["reg",95],["short",185],["careers",262],["lms",345]];
scene("edges",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const cx=900,cy=450,cr=fin(t,c("cred")-0.2,0.9);
  withA(ctx,1-cr,()=>{fuzzyRing(ctx,cx,cy,330,KIND,fin(t,c("typical"),0.8),70);glow(ctx,cx,cy,200,TRUST,0.2*fin(t,c("typical"),0.8));
    BIRDS.forEach(([f,dx,dy,s],i)=>{const a=fin(t,0.4+i*0.5,0.5),edge=Math.hypot(dx,dy)>250;f(ctx,cx+dx+Math.sin(t*0.45+i*1.9)*4,cy+dy+Math.sin(t*0.6+i*2.7)*5,s,a*(edge?0.75:1),t+i*7);});
    T(ctx,"bird",cx,180,{w:800,size:30,align:"center",color:rgba(KIND,1)});
    withA(ctx,fin(t,c("typical")+0.6,0.5),()=>{tag(ctx,cx,cy+90,"typical",TRUST,{align:"center",size:20});tag(ctx,cx+330,cy-20,"fuzzy edge",KIND,{align:"center",size:20});});
    withA(ctx,fin(t,c("agree")+0.2,0.5),()=>{tag(ctx,1500,380,"agree in the middle",GOOD,{align:"center",size:24});tag(ctx,1500,470,"argue at the edges",EDGE_,{align:"center",size:24});});});
  withA(ctx,cr,()=>{fuzzyRing(ctx,cx,cy,300,KIND,0.45,60);
    CREDS.forEach(([s,dx,dy,lv],i)=>{const a=fin(t,c("cred")+0.4+i*0.35,0.5);withA(ctx,a,()=>{const w=tw(ctx,s,20,700)+36;glass(ctx,cx+dx-w/2,cy+dy-22,w,44,22,lv<1?TRUST:lv<2?OFFICE.short.c:lv<4?OFFICE.careers.c:OFFICE.lms.c,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.92)"});T(ctx,s,cx+dx,cy+dy+7,{w:700,size:20,align:"center"});});});
    T(ctx,"credential",cx-520,120,{w:800,size:34,align:"center",color:rgba(TRUST,1)});T(ctx,"one word, and what it takes in",cx-520,156,{w:600,size:19,align:"center",color:rgba(SOFT,1)});
    // each office draws its own boundary
    RINGS.forEach(([k,r],i)=>{const a=fin(t,c("cred")+6.5+i*0.9,0.7),col=OFFICE[k].c;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=3;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(cx,cy,Math.max(0,r*clamp(a*1.2,0,1)+Math.sin(t*1.5+i)*2),0,TAU);ctx.stroke();ctx.restore();
      withA(ctx,a,()=>{const ly=cy-r-6,w=tw(ctx,OFFICE[k].n,17,700)+24;ctx.fillStyle="rgba(7,12,24,0.9)";rr(ctx,cx-w/2,ly-16,w,30,15);ctx.fill();T(ctx,OFFICE[k].n,cx,ly+5,{w:700,size:17,align:"center",color:rgba(col,1)});
        T(ctx,fmtNum(ANS[i][1]),1560,300+i*110,{w:800,size:48,color:rgba(col,1)});T(ctx,OFFICE[k].n,1560,330+i*110,{w:600,size:18,color:rgba(SOFT,1)});});});});
  withA(ctx,fin(t,B+0.4,0.8),()=>tag(ctx,1500,760,"four boundaries, one word",TRUST,{align:"center",size:22}));
  vign(ctx,S);});

/* ---------- 8. Words drift ---------- */
scene("drift",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);histBg(ctx,S,t);
  const st=fin(t,c("still")-0.2,0.8),mv=fin(t,c("move")-0.2,0.8);
  withA(ctx,1-st,()=>{etym(ctx,240,210,{a:fin(t,c("nice")+0.3,0.5),p:clamp((t-c("nice")-0.4)/1.6,0,1),old:"foolish",lang:"nice, in the 1300s",word:"nice",gloss:"then: foolish · now: pleasant",gap:300});
    const cT=c("cred");
    etym(ctx,240,410,{a:fin(t,cT+0.2,0.5),p:clamp((t-cT-0.3)/1.4,0,1),old:"credere",lang:"Latin",word:"credential",gloss:"to believe",gap:280});
    etym(ctx,240,570,{a:fin(t,cT+2.6,0.5),p:clamp((t-cT-2.7)/1.4,0,1),old:"en rolle",lang:"Old French",word:"enrol",gloss:"on the roll",gap:280});
    etym(ctx,240,730,{a:fin(t,cT+4.9,0.5),p:clamp((t-cT-5.0)/1.4,0,1),old:"diplōma",lang:"Greek",word:"diploma",gloss:"folded in two",gap:280});
    roll(ctx,1350,340,380,200,["Tanaka, M.","Okafor, S.","Ruiz, A.","Carter, B."],clamp((t-cT-2.8)/2,0,1),fin(t,cT+2.6,0.6));
    // a sheet, folding in two
    const fd=clamp((t-cT-5.4)/1.2,0,1);withA(ctx,fin(t,cT+4.9,0.5),()=>{ctx.save();ctx.translate(1540,700);ctx.fillStyle="#efe6d2";ctx.fillRect(-150,-90,150,180);ctx.save();ctx.scale(Math.cos(fd*Math.PI*0.96),1);ctx.fillStyle=fd>0.5?"#d8ccb2":"#efe6d2";ctx.fillRect(0,-90,150,180);ctx.restore();ctx.strokeStyle="rgba(120,90,50,0.5)";ctx.beginPath();ctx.moveTo(0,-90);ctx.lineTo(0,90);ctx.stroke();ctx.restore();});});
  // an ambassador's letters of credence
  withA(ctx,st*(1-mv),()=>{yearTag(ctx,120,120,"today · letters of credence",CLAY,1);const u=ease(clamp((t-c("still")-0.6)/1.8,0,1));
    const lx=700+u*140;
    credCard(ctx,700+u*140,380,420,{a:1,era:"wax",title:"Letter of credence",issuer:"a head of state",holder:"the ambassador",claim:"trust this person",rot:-0.03,rh:40});
    // the letter changes hands: the envoy's fingers behind it and thumb on its face; the host's hand comes in open and closes on it
    pointArm(ctx,lx-900,680,lx-100,598,2.0,1,{pose:"give",dress:"coat",card:[lx,380,420,286,-0.03],t});const rx_=lx+520+(1-u)*900;pointArm(ctx,rx_+760,680,rx_,556,2.0,1,{pose:"take",dress:"coat",k:clamp(u*1.6-0.6,0,1),card:[lx,380,420,286,-0.03],t});
    withA(ctx,fin(t,c("still")+2.6,0.6),()=>tag(ctx,960,800,"credential: the letter that asks for trust",TRUST,{align:"center",size:24}));});
  // meaning moves along a line of years
  withA(ctx,mv,()=>{const x0=200,x1=1720,y=560;ctx.strokeStyle=rgba(CLAY,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();
    [["1300",0],["1600",0.3],["1800",0.55],["1900",0.72],["2026",1]].forEach(([s,u])=>{ctx.fillStyle=rgba(CLAY,1);ctx.beginPath();ctx.arc(lerp(x0,x1,u),y,6,0,TAU);ctx.fill();T(ctx,s,lerp(x0,x1,u),y+44,{f:"mono",w:500,size:18,align:"center",color:rgba(CLAY,1)});});
    const u=ease(clamp((t-c("move")-0.4)/3.2,0,1)),m=["foolish","shy","precise","pleasant"][Math.min(3,Math.floor(u*4))];
    tag(ctx,lerp(x0,x1,u),y-80,"nice: "+m,KIND,{align:"center",size:24});
    withA(ctx,fin(t,c("move")+2.0,0.6),()=>tag(ctx,lerp(x0,x1,0.9),y-170,"credential → microcredential",TRUST,{align:"center",size:22}));});
  vign(ctx,S);});

/* ---------- 9. Agreed on paper ---------- */
const DEF="credential: a trusted statement, that others can check, that someone has shown what they know or can do.";
scene("paper",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);
  // a quiet room: warm light on a board, the four offices around it
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#15110d");g.addColorStop(1,"#07060a");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);glow(ctx,820,380,700,[255,220,170],0.08);
  const ans=fin(t,c("answer")-0.2,0.8);
  sheet(ctx,300,70,1040,760,{a:fin(t,0.3,0.8),rot:-0.008});
  const sx=300,sy=70;
  // the definition, written out
  const dA=clamp((t-c("def")-0.2)/4.2,0,1),lines=wrapT(ctx,DEF,0,0,900,{size:30,w:600,measure:true});let left=Math.round(DEF.length*dA);
  lines.forEach((l,i)=>{const n=Math.max(0,Math.min(l.length,left));left-=l.length+1;if(n>0)pencilText(ctx,l.slice(0,n),sx+90,sy+92+i*44,{size:30});});
  // the kind, and what sets it apart: underlines on the exact words, measured on the lines as written
  const under=(phrase,col,p,lab,dy)=>{if(p<=0)return;let from=DEF.indexOf(phrase),to=from+phrase.length,off=0;ctx.save();ctx.font=font(600,30);let first=null,last=null;
    lines.forEach((l,i)=>{const a0=Math.max(from,off),a1=Math.min(to,off+l.length);if(a1>a0){const x0=sx+90+ctx.measureText(l.slice(0,a0-off)).width,x1=sx+90+ctx.measureText(l.slice(0,a1-off)).width,y=sy+100+i*44;
      ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,x1,p),y);ctx.stroke();if(!first)first=[x0,x1,y];last=[x0,x1,y];}off+=l.length+1;});ctx.restore();
    const at=dy<0?first:last;if(at&&lab)withA(ctx,p,()=>T(ctx,lab,(at[0]+at[1])/2,at[2]+dy,{w:700,size:19,align:"center",color:rgba(col,1)}));};
  under("statement",[40,90,200],fin(t,c("recipe")+0.4,0.6),"the kind of thing",-40);
  ["trusted","that others can check","that someone has shown what they know or can do"].forEach((ph,k)=>under(ph,[200,110,20],fin(t,c("recipe")+1.8+k*0.4,0.5),k===2?"what sets it apart":null,30));
  // the kinds, in pencil
  const kT=c("kinds"),ox=52,oy=136,s=0.8;
  credKinds(ctx,{paper:true,ox,oy,s,p:{cred:clamp((t-kT-0.2)/0.9,0,1),award:clamp((t-kT-0.8)/0.9,0,1),micro:clamp((t-kT-1.8)/0.9,0,1),badge:clamp((t-kT-3.2)/0.9,0,1)}});
  const ca=clamp((t-kT-5.2)/0.9,0,1);pencilBox(ctx,940,690,320,64,"Certificate of completion",ca,{size:22});if(ca>0.9){cross_(ctx,1290,722,40,[190,50,40],fin(t,kT+6.0,0.3));withA(ctx,fin(t,kT+6.3,0.4),()=>pencilText(ctx,"shows you finished, not what you learned",940,788,{size:19}));}
  // owners, and a new version of the sketch
  const oT=c("owner");withA(ctx,fin(t,oT+0.4,0.5),()=>{pencilText(ctx,"owner: Registrar",564,650,{size:19,align:"center",color:"rgba(150,100,20,0.95)"});pencilText(ctx,"owner: Short courses",820,650,{size:19,align:"center",color:"rgba(170,60,90,0.95)"});pencilText(ctx,"agreed 28 Sep",480,760,{size:19,color:"rgba(80,80,80,0.95)"});});
  withA(ctx,fin(t,oT+2.4,0.5),()=>stamp(ctx,sx+1010,sy+40,"sketch v3 · draft",[150,90,30],1,t<oT+3.2?t-oT:0));
  // people around the board
  person(ctx,"mei",150,960,0.55,{t,pose:t>c("def")&&t<c("kinds")?"explain":"stand",expr:t>c("answer")?"relieved":"calm"});
  person(ctx,"tom",1480,960,0.55,{t,pose:t>c("kinds")&&t<c("recipe")?"explain":"stand",expr:t>c("answer")?"relieved":"calm"});
  withA(ctx,fin(t,c("back")+1.0,0.6)*(1-ans),()=>{["reg","short","careers","lms"].forEach((k,i)=>tag(ctx,1400+(i%2)*260,150+Math.floor(i/2)*70,OFFICE[k].n,OFFICE[k].c,{size:18}));});
  // the answer, and a name for each number
  withA(ctx,ans,()=>{glass(ctx,1380,90,480,170,20,TRUST,{glow:18,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(ctx,"credentials awarded",1408,138,{w:700,size:22,color:rgba(SOFT,1)});T(ctx,fmtNum(countTo(t,c("answer")+1.0,0,11890)),1408,222,{w:800,size:72,color:rgba(TRUST,1)});
    T(ctx,"7,420 awards + 3,180 microcredentials + 1,290 assessed badges",1408,250,{f:"mono",w:500,size:12,color:rgba(SOFT,1)});
    ANS.forEach(([k,v],i)=>withA(ctx,fin(t,c("answer")+4.0+i*0.5,0.5),()=>{const y=300+i*120;glass(ctx,1380,y,480,100,16,OFFICE[k].c,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.93)"});T(ctx,fmtNum(v),1404,y+50,{w:800,size:36,color:rgba(OFFICE[k].c,1)});T(ctx,ANS_MEANING[k],1404,y+80,{w:600,size:17});
      // the two that counted things the definition leaves out
      if(ANS_GAP[k])withA(ctx,fin(t,c("gap")+(k==="careers"?3.2:4.9),0.5),()=>{const gw=tw(ctx,ANS_GAP[k],17,700)+24;ctx.fillStyle="rgba(40,10,14,0.95)";rr(ctx,1844-gw,y+12,gw,32,16);ctx.fill();ctx.strokeStyle=rgba(BAD,0.9);ctx.lineWidth=1.5;rr(ctx,1844-gw,y+12,gw,32,16);ctx.stroke();T(ctx,ANS_GAP[k],1844-gw/2,y+34,{w:700,size:17,align:"center",color:rgba(BAD,1)});});}));});
  fadeIn(ctx,S,t,0.8);vign(ctx,S);});

/* ---------- 10. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");const cl=fin(t,c("clay")-0.3,1.0),la=fin(t,c("last")+0.2,0.8);
  if(cl<1){setScreen(ctx,S);bg2(ctx);withA(ctx,1-cl,()=>{const wT=c("why");
    // a contract's definitions
    withA(ctx,fin(t,wT+0.4,0.6),()=>{sheet(ctx,180,220,420,520,{rot:-0.02});T(ctx,"AGREEMENT",390,290,{w:800,size:24,align:"center",color:"rgba(40,36,34,0.95)"});T(ctx,"1. Definitions",214,350,{w:800,size:22,color:"rgba(40,36,34,0.95)"});
      ["“Customer” means…","“Credential” means…","“Census date” means…"].forEach((s,i)=>T(ctx,s,230,398+i*40,{w:600,size:19,color:"rgba(60,56,52,0.9)"}));for(let i=0;i<5;i++){ctx.fillStyle="rgba(80,76,70,0.25)";ctx.fillRect(214,540+i*30,300-hash(i,2)*90,8);}});
    // a merger, stalled on one word
    withA(ctx,fin(t,wT+2.6,0.6),()=>{[[700,"Company A","a customer is a person"],[1010,"Company B","a customer is an account"]].forEach(([x,n,d],i)=>{glass(ctx,x,300,280,200,18,i?[255,150,110]:[120,190,255],{glow:14,ea:0.8,fill:"rgba(7,12,24,0.92)"});T(ctx,n,x+24,344,{w:800,size:22});wrapT(ctx,d,x+24,392,240,{w:600,size:20,color:rgba(SOFT,1)});});
      withA(ctx,0.6+0.4*Math.sin(t*4),()=>T(ctx,"≠",990,420,{w:800,size:44,align:"center",color:rgba(BAD,1)}));T(ctx,"merger: on hold",990,560,{w:700,size:20,align:"center",color:rgba(BAD,1)});});
    // funding, by who is counted
    withA(ctx,fin(t,wT+4.6,0.6),()=>{glass(ctx,1400,260,380,400,18,TRUST,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.92)"});T(ctx,"funding",1430,306,{w:800,size:24,color:rgba(TRUST,1)});
      [0.55,0.8,0.68].forEach((h,i)=>{ctx.fillStyle=rgba(TRUST,0.75);rr(ctx,1450+i*100,620-h*240,70,h*240,8);ctx.fill();});T(ctx,"depends on who is counted",1590,650,{w:600,size:17,align:"center",color:rgba(SOFT,1)});});
    // the work of agreeing, against the cost of not
    withA(ctx,fin(t,c("cost")+0.2,0.6),()=>{tag(ctx,700,720,"agreeing: people, trade-offs, time",GOOD,{size:24});tag(ctx,1160,720,"disagreeing: disputes, rework, wrong decisions",BAD,{size:24});});});}
  if(cl>0){histBg(ctx,S,t,{light:0.14});withA(ctx,cl*(1-la*0.6),()=>{const p=clamp((t-c("clay")-0.6)/5,0,1);tablet(ctx,660,230,600,380,p,1);
      const k=Math.floor(p*48),sx=660+40+(k%12)*(600-80)/12,sy=230+Math.floor(k/12)*76+46;{const W_=by_scribe(t-c("clay")-0.6,660,230,600,380);if(W_)stylus(ctx,W_.x,W_.y,t,W_.a,W_);}
      yearTag(ctx,120,120,"c. 3300 BCE · Uruk",CLAY,1);});
    withA(ctx,la,()=>{[["minds",560],["marks",960],["systems",1360]].forEach(([s,x],i)=>withA(ctx,fin(t,c("last")+0.4+i*0.6,0.5),()=>{const col=[KIND,CLAY,CYAN][i];glass(ctx,x-150,690,300,110,20,col,{glow:16,ea:0.85,fill:"rgba(7,12,24,0.93)"});T(ctx,s,x,758,{w:800,size:34,align:"center",color:rgba(col,1)});if(i<2)arrowTo(ctx,x+160,745,x+240,745,SOFT,0.8,{head:12});}));});}
  endCard(ctx,S,t,B+0.3,"What's in a word",WA_INK,"Before you can count anything, you have to agree what it is.");
  vign(ctx,S);});

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
