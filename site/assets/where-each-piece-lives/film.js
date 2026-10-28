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

// Where each piece lives, film 3 of 3 of Governance on the map. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"copy":{"name":"Nobody writes in a copy","lead":1.6,"tail":1.0,"vo":[
 {"id":"joseon","gap":0.8,"text":"Korea, under the Joseon kings."},
 {"id":"daily","gap":0.8,"text":"Every day, historians at court write down what's said and done."},
 {"id":"king","gap":0.8,"text":"When a king dies, one office makes the record of his reign, his annals, from their notes, and prints them."},
 {"id":"same","gap":0.8,"text":"Every copy is the same, kept in four archives, and nobody may change one, not even a king."},
 {"id":"y1592","gap":0.8,"text":"In 1592, war comes up the roads, and three of the four archives burn.","say":"In fifteen ninety-two, war comes up the roads, and three of the four archives burn."},
 {"id":"left","gap":0.8,"text":"Only Jeonju's copy is left."},
 {"id":"gone","gap":0.8,"text":"If it burns too, 175 years of the kingdom's memory are gone: what was decided, by whom, and why.","say":"If it burns too, a hundred and seventy-five years of the kingdom's memory are gone: what was decided, by whom, and why."},
 {"id":"change","gap":0.8,"text":"Something has to change."},
 {"id":"scholars","gap":0.8,"text":"Two local scholars carry it into the mountains, and guard it, in turns, for more than a year."},
 {"id":"again","gap":0.8,"text":"After the war, the court prints the annals again, from that one copy."},
 {"id":"five","gap":0.8,"text":"Five sets, far apart: one in the capital, four high in the mountains."},
 {"id":"climbs","gap":0.8,"text":"Every few years, a historian climbs to each archive, airs the books, and writes down what he finds."},
 {"id":"survive","gap":0.8,"text":"The annals survive, complete: 472 years, twenty-five kings, 888 books.","say":"The annals survive, complete: four hundred and seventy-two years, twenty-five kings, eight hundred and eighty-eight books."},
 {"id":"today","gap":0.8,"text":"Today, anyone can read them online, free."},
 {"id":"rebuild","gap":0.8,"text":"Jeonju's copy could rebuild the rest because every copy was made from one source, one way, and nobody wrote in one."},
 {"id":"data","gap":0.8,"text":"It's the same with data."},
 {"id":"trusted","gap":0.8,"text":"A copy can be trusted when it's made from its home, one way, and checked."}]},
"nine":{"name":"Nine days","lead":1.0,"tail":1.0,"vo":[
 {"id":"feb","gap":0.8,"text":"February."},
 {"id":"asks","gap":0.8,"text":"A planner in the Faculty of Business asks to read Planning's list of learners near an award, to plan next year's courses."},
 {"id":"names","gap":0.8,"text":"On the data platform, the table's page names its owner: Jun."},
 {"id":"waits","gap":0.8,"text":"So her request goes to Jun, and waits."},
 {"id":"built","gap":0.8,"text":"But Jun only built it."},
 {"id":"since","gap":0.8,"text":"Since October, its owner is Clara, in Planning."},
 {"id":"later","gap":0.8,"text":"Nine days later, Jun sees the request, and passes it on."},
 {"id":"had","gap":0.8,"text":"Had he said yes, someone who isn't the owner would have decided who may see it."},
 {"id":"typed","gap":0.8,"text":"The page was typed by hand when the table was built, and nobody kept it in step."}]},
"seven":{"name":"Seven places","lead":1.0,"tail":1.0,"vo":[
 {"id":"sam","gap":0.8,"text":"Sam runs the data platform, and wants its pages to name the right owner."},
 {"id":"asks","gap":0.8,"text":"So Sam asks Yusuf where governance's pieces live."},
 {"id":"counts","gap":0.8,"text":"Yusuf counts seven places."},
 {"id":"arch","gap":0.8,"text":"The architecture tool, which holds Noor's map."},
 {"id":"gloss","gap":0.8,"text":"The glossary."},
 {"id":"docs","gap":0.8,"text":"The document library, with the policies and the council's minutes."},
 {"id":"repo","gap":0.8,"text":"The data team's repository: owners, classes, tables, checks, decisions, and each product's promise."},
 {"id":"platform","gap":0.8,"text":"The data platform: who may read what, and the record of who read it."},
 {"id":"cat","gap":0.8,"text":"The catalogue, where people find products."},
 {"id":"tracker","gap":0.8,"text":"And the tracker, for issues and requests."},
 {"id":"more","gap":0.8,"text":"Some pieces sit in more than one place."},
 {"id":"drift","gap":0.8,"text":"One copy no longer matched the others: it had drifted."}]},
"home":{"name":"One home each","lead":1.0,"tail":1.0,"vo":[
 {"id":"puts","gap":0.8,"text":"Noor puts each place on her map, as an application, with what it holds."},
 {"id":"rule","gap":0.8,"text":"Then she sets one rule."},
 {"id":"every","gap":0.8,"text":"Every piece has one home, where it's changed, and an owner, who decides it."},
 {"id":"other","gap":0.8,"text":"Every other place keeps a copy, and says where it came from, and when."},
 {"id":"owner","gap":0.8,"text":"A product's owner, for one, lives in the data team's repository."},
 {"id":"copyit","gap":0.8,"text":"The catalogue and the platform's page copy it."},
 {"id":"annals","gap":0.8,"text":"As with the annals, nobody writes in a copy."},
 {"id":"fix","gap":0.8,"text":"A fix goes to its home, and every copy follows."}]},
"way":{"name":"One way","lead":1.0,"tail":1.0,"vo":[
 {"id":"flows","gap":0.8,"text":"Then the flows between them, each one way."},
 {"id":"defs","gap":0.8,"text":"Definitions go from the map to the glossary."},
 {"id":"tools","gap":0.8,"text":"From the glossary, they go to every tool that reads them: the data team's copy, the dashboards, and the assistant."},
 {"id":"concepts","gap":0.8,"text":"The map's concepts, a learner or an award, go to the data team's tables."},
 {"id":"class","gap":0.8,"text":"Each column's class goes from the repository to the platform, where it sets who may read it."},
 {"id":"promise","gap":0.8,"text":"Each product's promise goes from the repository to the catalogue."},
 {"id":"back","gap":0.8,"text":"Nothing flows back."},
 {"id":"never","gap":0.8,"text":"A copy is never a home."}]},
"check":{"name":"Found by a check","lead":1.0,"tail":1.0,"vo":[
 {"id":"drift","gap":0.8,"text":"But a copy can still drift from its home, if someone types into it, or a sync stops."},
 {"id":"night","gap":0.8,"text":"So every night, a check compares each copy with its home."},
 {"id":"first","gap":0.8,"text":"The first night, it finds the old owner's name on the table's page, and wrong names on two more pages, typed by hand last year."},
 {"id":"morning","gap":0.8,"text":"The sync puts them right by morning, and the check tells each owner what changed."},
 {"id":"finds","gap":0.8,"text":"Drift is something a check finds, not something a person remembers."},
 {"id":"climbed","gap":0.8,"text":"The historians climbed to each archive, and wrote down what they found."},
 {"id":"here","gap":0.8,"text":"Here, a check does it every night."}]},
"theirs":{"name":"Theirs to change","lead":1.0,"tail":1.0,"vo":[
 {"id":"own","gap":0.8,"text":"Each team still works in its own tool."},
 {"id":"knows","gap":0.8,"text":"What changes is that everyone knows which copy is theirs to change, and which only to read."},
 {"id":"next","gap":0.8,"text":"The planner's next request goes straight to Clara, who decides it in a day."},
 {"id":"plan","gap":0.8,"text":"And Noor's map becomes the plan for the next series, Governance you can use: each of its films builds a part of it, in the tools."},
 {"id":"lasted","gap":0.8,"text":"The annals lasted because every copy came from one source, one way, and was checked."},
 {"id":"give","gap":0.8,"text":"Give every piece of governance one home, and every copy can be trusted."},
 {"id":"reads","gap":0.8,"text":"Everyone reads the same thing, and every request reaches the person who decides."}]}
};

const VODUR={"copy/joseon": 1.834, "copy/daily": 3.43, "copy/king": 5.881, "copy/same": 5.582, "copy/y1592": 4.86, "copy/left": 1.826, "copy/gone": 7.381, "copy/change": 1.34, "copy/scholars": 5.19, "copy/again": 3.767, "copy/five": 4.0, "copy/climbs": 6.042, "copy/survive": 6.927, "copy/today": 2.341, "copy/rebuild": 6.91, "copy/data": 1.274, "copy/trusted": 3.909, "nine/feb": 0.696, "nine/asks": 7.036, "nine/names": 3.833, "nine/waits": 2.252, "nine/built": 1.367, "nine/since": 2.766, "nine/later": 3.362, "nine/had": 3.951, "nine/typed": 4.46, "seven/sam": 4.276, "seven/asks": 3.138, "seven/counts": 1.726, "seven/arch": 2.6, "seven/gloss": 0.716, "seven/docs": 3.551, "seven/repo": 6.515, "seven/platform": 3.754, "seven/cat": 2.238, "seven/tracker": 2.252, "seven/more": 2.045, "seven/drift": 3.085, "home/puts": 4.126, "home/rule": 1.276, "home/every": 4.12, "home/other": 3.687, "home/owner": 3.985, "home/copyit": 2.435, "home/annals": 2.538, "home/fix": 2.899, "way/flows": 2.213, "way/defs": 2.386, "way/tools": 6.602, "way/concepts": 4.477, "way/class": 5.096, "way/promise": 3.823, "way/back": 1.184, "way/never": 1.376, "check/drift": 4.953, "check/night": 3.327, "check/first": 7.861, "check/morning": 4.25, "check/finds": 3.836, "check/climbed": 3.836, "check/here": 1.832, "theirs/own": 1.874, "theirs/knows": 5.44, "theirs/next": 3.909, "theirs/plan": 7.549, "theirs/lasted": 4.967, "theirs/give": 4.037, "theirs/reads": 4.679};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title card, after the annals; and the end card. */
const BREATH={
"copy":{"hold":{"joseon":0.6,"daily":0.6,"king":0.8,"same":0.8,"y1592":1.2,"left":0.8,"gone":1.0,"change":1.0,"scholars":1.6,"again":0.6,"five":0.8,"climbs":1.0,"survive":0.8,"today":0.6,"rebuild":0.6,"data":0.3},"breathe":5.6},
"nine":{"hold":{"feb":0.3,"asks":0.6,"names":0.6,"waits":1.0,"built":0.3,"since":0.6,"later":1.0,"had":0.8}},
"seven":{"hold":{"sam":0.4,"asks":0.6,"counts":0.6,"arch":0.3,"gloss":0.3,"docs":0.3,"repo":0.4,"platform":0.3,"cat":0.3,"tracker":0.6,"more":0.8}},
"home":{"hold":{"puts":0.8,"rule":0.4,"every":0.8,"other":0.8,"owner":0.4,"copyit":0.8,"annals":0.8}},
"way":{"hold":{"flows":0.6,"defs":0.6,"tools":0.6,"concepts":0.6,"class":0.6,"promise":0.6,"back":0.8}},
"check":{"hold":{"drift":0.8,"night":1.0,"first":1.2,"morning":1.0,"finds":1.0,"climbed":0.8}},
"theirs":{"hold":{"own":0.6,"knows":0.8,"next":1.0,"plan":1.0,"lasted":0.8,"give":0.6},"breathe":5.4}
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

/* ===== Where each piece lives: the opening's places =====
   Korea under the Joseon kings, painted the series' way (master data's wash.js and people.js, the series' rooms.js and people.js): a
   hall of the court in the morning, seen from beside the king's seat; the office that makes a reign's annals from the historians'
   notes; the printers' room; the books laid in their chests; a road through the hills; Jeonju's archive, a raised hall inside its
   walls; a mountain path among pines; a cave's mouth at night, in summer and in snow; an archive high in the mountains, its books
   aired in the sun; and today, a long shelf of the books and a reader in a library. The archives are also small views, pinned on paper
   like a map (oh_view). Nothing on screen is in Korean or Chinese: writing is columns of marks too small to read, and the corner names
   the place. The places are painted once and kept (the series' finish.js); what moves is drawn every frame. Every name starts with oh_
   or OH, because every file of the film shares one script. */

/* ---------- the opening's colours ---------- */
// columns and beams of red-brown wood, white plaster, grey tiles, the soft green-grey under the eaves; stone, wooden floors, paper
// doors; the hills' pines and their red bark, far ridges in blue-grey; night and a fire; the chests, their brass, the books' covers
const OH={wood:[150,76,58],woodDk:[104,54,42],woodLt:[186,116,88],plaster:[238,230,212],tile:[94,98,108],tileDk:[62,64,74],tileLt:[138,142,152],
  eave:[124,142,130],stone:[200,192,176],stoneDk:[150,142,128],maru:[204,166,120],maruDk:[152,114,80],brick:[178,172,160],hanji:[248,243,228],
  lattice:[134,98,70],pine:[66,98,74],pineDk:[44,70,54],pineLt:[112,140,96],bark:[156,92,64],far:[160,176,190],mid:[124,150,136],near:[100,128,94],
  earth:[200,174,136],earthDk:[162,134,98],night:[34,40,64],fire:[255,176,84],snow:[246,248,252],chest:[116,74,50],chestDk:[80,52,36],
  brass:[204,168,96],cover:[216,182,114],coverDk:[176,140,80],cloth:[204,152,82],paper:[250,246,234],ink:[54,48,46],smoke:[118,112,112],
  panel:[176,140,106],rock:[150,146,138],trunk:[120,102,88],leaf:[96,130,82],maple:[[204,84,52],[222,128,58],[188,64,48],[214,156,64]]};
// a place painted at twice the frame's size, for the shots that move in close (its painter draws in frame coordinates)
function oh_hi(key,paint){return wc_kept("ohHi:"+key,W*2,H*2,q=>{q.scale(2,2);paint(q);});}
const oh_placeHi=key=>oh_hi(key,WC_PLACES[key]);

/* ---------- hills, pines and buildings ---------- */
// a ridge of hills, f(x) its line, and mist rising from its foot: a band of paper over the lower part, so the next ridge stands clear
function oh_ridge(ctx,f,col,depth,seed,mist){wc_land(ctx,f,col,depth,{seed,line:false});if(!mist)return;let lo=1e9;for(let x=0;x<=W;x+=40)lo=Math.min(lo,f(x));
  const y0=lo+mist[0],y1=lo+mist[1],g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(WC_PAPER,0));g.addColorStop(1,rgba(WC_PAPER,mist[2]==null?0.85:mist[2]));
  ctx.fillStyle=g;ctx.fillRect(-60,y0,W+120,y1-y0+2+(mist[3]||0));}
// a hill's line: a few sines, their peaks sharpened, between y and y+h
function oh_hillF(y,h,seed,o){o=o||{};const R=wc_rng(seed),k=[R()*6,R()*6,R()*6],s=o.s||1;
  return x=>{const u=x/W;let v=0.5+0.28*Math.sin(u*TAU*0.9*s+k[0])+0.16*Math.sin(u*TAU*2.3*s+k[1])+0.07*Math.sin(u*TAU*6.1*s+k[2]);v=Math.pow(clamp(v,0,1.4),o.sharp||1.25);return y+h*(1-v);};}
// a pine of the hills: a trunk that leans and bends, red-brown and scaly, branches near the top, and flat, layered crowns, darker
// underneath and lit along the top. x, y: its foot; h: its height; o.lean, o.seed, o.depth (haze), o.col (the crowns')
function oh_pine(ctx,x,y,h,o){o=o||{};const R=wc_rng(o.seed||7),d=o.depth==null?1:o.depth,lean=(o.lean==null?R()-0.5:o.lean)*0.32,tw0=Math.max(1.4,h*0.034),col=o.col||OH.pine;
  const C=[];for(let i=0;i<=12;i++){const u=i/12;C.push([x+lean*h*u+Math.sin(u*4.2+R()*0.6)*h*0.035*u,y-h*0.8*u]);}
  const L=[],Rr=[];C.forEach(([px,py],i)=>{const w=lerp(tw0,tw0*0.38,i/12);L.push([px-w,py]);Rr.unshift([px+w,py]);});
  wc_wash(ctx,L.concat(Rr),OH.bark,{depth:d,kind:"trunk",line:d>0.7,lw:1.1,seed:(o.seed||7)+3});
  const n=3+Math.floor(R()*3),pads=[];
  for(let k=0;k<n;k++){const u=0.5+0.5*k/(n-1),p=C[Math.round(u*12)],side=k===n-1?(R()-0.5)*0.6:(k%2?1:-1),len=h*(0.12+R()*0.16)*(k===n-1?0.4:1),
      cx=p[0]+side*len,cy=p[1]-h*(0.02+R()*0.04),rw=h*(0.13+R()*0.09)*(k===n-1?1.2:1),rh=h*(0.045+R()*0.025);
    if(Math.abs(side)>0.3){ctx.save();ctx.strokeStyle=rgba(wc_haze(OH.bark,d),0.9);ctx.lineWidth=Math.max(1,tw0*0.7);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(p[0],p[1]);
      ctx.quadraticCurveTo((p[0]+cx)/2,p[1]-h*0.01,cx,cy+rh*0.4);ctx.stroke();ctx.restore();}
    pads.push([cx,cy,rw,rh]);}
  pads.sort((a,b)=>b[1]-a[1]).forEach(([cx,cy,rw,rh],i)=>{const pts=[];for(let j=0;j<22;j++){const a=j/22*TAU,r=1+0.16*Math.sin(a*5+i*1.7)+0.1*Math.sin(a*9+i);
      pts.push([cx+Math.cos(a)*rw*r,cy+Math.sin(a)*rh*r*(Math.sin(a)<0?0.75:1.15)]);}
    wc_wash(ctx,pts,mix(col,OH.pineDk,0.25),{depth:d,kind:"tree",line:false,seed:(o.seed||7)+11*i});
    if(d>0.4||o.snow){ctx.save();wc_tr(ctx,pts);ctx.clip();const g=ctx.createLinearGradient(0,cy-rh,0,cy+rh);g.addColorStop(0,rgba(wc_haze(OH.pineLt,d),0.55));g.addColorStop(0.5,rgba(OH.pineLt,0));
      ctx.fillStyle=g;ctx.fillRect(cx-rw*1.3,cy-rh*1.4,rw*2.6,rh*2.8);
      // snow lies along the top of each crown
      if(o.snow){ctx.fillStyle="rgba(238,242,250,0.92)";ctx.beginPath();ctx.ellipse(cx,cy-rh*0.75,rw*0.98,rh*0.55,0,0,TAU);ctx.fill();}ctx.restore();}});}
// a row of pines along a line f, between x0 and x1 (o.snow, o.col, as for one pine)
function oh_pines(ctx,f,x0,x1,step,h,depth,seed,o){const R=wc_rng(seed);for(let x=x0;x<x1;x+=step*(0.55+R()*0.9))oh_pine(ctx,x,f(x)+4,h*(0.7+R()*0.55),Object.assign({depth,seed:seed+Math.round(x),lean:(R()-0.5)*1.4},o||{}));}
// a mountain range's line: a few peaks, each rising up to h above y, steep near the top, with a little roughness along it
function oh_peaksF(y,h,seed,n){const R=wc_rng(seed),P=[];for(let i=0;i<(n||4);i++)P.push([R()*W*1.2-W*0.1,(0.45+R()*0.55)*h,240+R()*380]);
  return x=>{let v=0;for(const [px,ph,pw] of P){const u=Math.abs(x-px)/pw;if(u<1)v=Math.max(v,ph*Math.pow(1-u,1.35));}return y-v+7*Math.sin(x/53+seed)+4*Math.sin(x/23+seed*2);};}
// a broad-leaved tree, old and round (o.col: its leaves; o.autumn, a maple's reds and golds): a trunk that forks, and a crown of soft
// clumps, darker underneath and lit along the top, without an outline. x, y: its foot; h: its height
function oh_tree(ctx,x,y,h,o){o=o||{};const R=wc_rng(o.seed||11),d=o.depth==null?1:o.depth,tw=Math.max(2,h*0.035),cy=y-h*0.64,rx=h*0.36,ry=h*0.28;
  const pal=o.autumn?OH.maple:[o.col||OH.leaf],pick=()=>{const c=pal[Math.floor(R()*pal.length)];return o.autumn?mix(c,pal[Math.floor(R()*pal.length)],R()*0.4):mix(c,wc_lit(c,0.22),R()*0.7);};
  wc_wash(ctx,[[x-tw,y],[x-tw*0.7,y-h*0.42],[x-tw*2.2,y-h*0.66],[x-tw*1.2,y-h*0.68],[x,y-h*0.5],[x+tw*1.2,y-h*0.7],[x+tw*2.4,y-h*0.64],[x+tw*0.7,y-h*0.42],[x+tw,y]],OH.trunk,{depth:d,kind:"trunk",line:d>0.7,lw:1,seed:(o.seed||11)+1});
  const blob=(bx,by,r,sd)=>{const k=[R()*6,R()*6,R()*6],P=[];for(let i=0;i<28;i++){const a=i/28*TAU,q=1+0.12*Math.sin(a*5+k[0])+0.08*Math.sin(a*9+k[1])+0.05*Math.sin(a*13+k[2]);
    P.push([bx+Math.cos(a)*r*q,by+Math.sin(a)*r*q*(Math.sin(a)>0?0.72:0.9)]);}return P;};
  // small and far: one wash. Near: lobes of leaves round branches, each its own colour, lit from above, with a few bright dabs
  if(h<120){const crown=blob(x,cy,rx,0);wc_wash(ctx,crown,pick(),{depth:d,kind:"tree",line:false,seed:(o.seed||11)+3});ctx.save();wc_tr(ctx,crown);ctx.clip();
    const g=ctx.createLinearGradient(0,cy-ry,0,cy+ry);g.addColorStop(0,rgba(wc_haze(wc_lit(pal[0],0.4),d),0.45));g.addColorStop(1,rgba(wc_haze(wc_dim(pal[0],0.4),d),0.35));ctx.fillStyle=g;ctx.fillRect(x-rx*1.3,cy-ry*1.3,rx*2.6,ry*2.6);ctx.restore();return;}
  ctx.save();ctx.strokeStyle=rgba(wc_haze(OH.trunk,d),0.95);ctx.lineCap="round";
  for(const [bx,by,lw] of [[-0.62,-0.2,tw*1.1],[0.58,-0.32,tw],[0.08,-0.8,tw*0.9],[-0.3,-0.6,tw*0.7]]){ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(x,y-h*0.42);ctx.quadraticCurveTo(x+bx*rx*0.3,cy+ry*0.3,x+bx*rx,cy+by*ry);ctx.stroke();}ctx.restore();
  const n=6+Math.floor(R()*2),L=[];for(let i=0;i<n;i++){const a=(i/n)*TAU+R()*0.6;L.push([x+Math.cos(a)*rx*0.52,cy+Math.sin(a)*ry*0.5-ry*0.08,rx*(0.4+R()*0.14)]);}
  L.push([x+(R()-0.5)*rx*0.2,cy-ry*0.25,rx*0.46]);
  L.forEach(([bx,by,r],i)=>{const c=pick(),P=blob(bx,by,r);wc_wash(ctx,P,c,{depth:d,kind:"tree",line:false,seed:(o.seed||11)+5+i});ctx.save();wc_tr(ctx,P);ctx.clip();
    const g=ctx.createLinearGradient(bx-r*0.6,by-r,bx+r*0.4,by+r);g.addColorStop(0,rgba(wc_haze(wc_lit(c,0.42),d),0.55));g.addColorStop(0.5,rgba(c,0));g.addColorStop(1,rgba(wc_haze(wc_dim(c,0.45),d),0.5));
    ctx.fillStyle=g;ctx.fillRect(bx-r*1.3,by-r*1.3,r*2.6,r*2.6);
    for(let k=0;k<7;k++){const a=-Math.PI*0.5+(R()-0.5)*2.4,q=r*(0.45+R()*0.45);ctx.fillStyle=rgba(wc_haze(wc_lit(c,0.3+R()*0.2),d),0.45);ctx.beginPath();ctx.ellipse(bx+Math.cos(a)*q,by+Math.sin(a)*q*0.8,r*0.16,r*0.11,a,0,TAU);ctx.fill();}
    if(o.snow&&by<cy){ctx.fillStyle="rgba(240,244,250,0.9)";ctx.beginPath();ctx.ellipse(bx,by-r*0.75,r*0.8,r*0.32,0,0,TAU);ctx.fill();}ctx.restore();});}
// a rock: a lumpy top, flat where it sits, lit along the top and darker at its foot; o.snow puts a cap of snow on it
function oh_rock(ctx,x,y,r,o){o=o||{};const R=wc_rng(o.seed||17),d=o.depth==null?1:o.depth,col=o.col||OH.rock,pts=[];
  for(let i=0;i<=12;i++){const a=Math.PI+i/12*Math.PI,k=0.82+R()*0.3;pts.push([x+Math.cos(a)*r*1.15*k,y+Math.sin(a)*r*0.8*k*(0.75+0.25*Math.sin(i/12*Math.PI))]);}
  pts.push([x+r*1.1,y],[x-r*1.1,y]);wc_contact(ctx,x-r*1.2,x+r*1.2,y+2,d,0.3);wc_wash(ctx,pts,col,{depth:d,kind:"build",lw:1.1,seed:o.seed||17});
  ctx.save();wc_tr(ctx,pts);ctx.clip();const g=ctx.createLinearGradient(0,y-r*0.8,0,y);g.addColorStop(0,rgba(wc_haze(wc_lit(col,0.35),d),0.55));g.addColorStop(0.5,rgba(col,0));g.addColorStop(1,rgba(wc_haze(wc_dim(col,0.4),d),0.45));
  ctx.fillStyle=g;ctx.fillRect(x-r*1.3,y-r,r*2.6,r*1.1);ctx.strokeStyle=rgba(wc_haze(wc_dim(col,0.45),d),0.5);ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x-r*0.2,y-r*0.6);ctx.lineTo(x+r*0.05,y-r*0.3);ctx.lineTo(x-r*0.1,y);ctx.stroke();
  if(o.snow){ctx.fillStyle="rgba(242,245,250,0.95)";ctx.beginPath();ctx.ellipse(x,y-r*0.78,r*0.95,r*0.22,0,0,TAU);ctx.fill();}ctx.restore();}
// a tiled roof from the front, hipped and gabled: its eave curves and lifts at the corners, the hips run up to a short ridge whose ends
// turn up; rows of tiles, the eave's round end tiles, and the shadow under the eave with the rafters' ends. x0..x1 the eave, ye its line
// at the middle, yr the ridge's
function oh_roof(ctx,x0,x1,ye,yr,o){o=o||{};const w=x1-x0,d=o.depth==null?1:o.depth,lift=o.lift==null?w*0.045:o.lift,ov=w*0.02,ri=o.ri==null?0.24:o.ri,
    r0=x0+w*ri,r1=x1-w*ri,col=o.col||OH.tile,eaveY=u=>ye-lift*Math.pow(Math.abs(u-0.5)*2,2.6);
  const eave=[];for(let i=0;i<=36;i++){const u=i/36;eave.push([lerp(x0-ov,x1+ov,u),eaveY(u)]);}
  const hipL=[],hipR=[];for(let i=1;i<=10;i++){const u=i/10,c=Math.sin(u*Math.PI)*w*0.025;hipL.push([lerp(x0-ov,r0,u)+c,lerp(eaveY(0),yr,u)+c*0.4]);hipR.push([lerp(x1+ov,r1,u)-c,lerp(eaveY(1),yr,u)+c*0.4]);}
  // the shadow under the eave, and the rafters' ends in it
  const ud=Math.max(6,(ye-yr)*0.16),und=eave.concat(eave.slice().reverse().map(([x,y])=>[x+(x<(x0+x1)/2?w*0.012:-w*0.012),y+ud]));
  wc_wash(ctx,und,o.under||OH.eave,{depth:d,kind:"build",line:false,seed:(o.seed||5)+1});
  if(d>0.5){ctx.save();ctx.fillStyle=rgba(wc_haze(wc_lit(OH.eave,0.35),d),0.8);const n=Math.round(w/16);for(let i=1;i<n;i++){const u=i/n,x=lerp(x0,x1,u),y=eaveY(u)+ud*0.45;
      ctx.beginPath();ctx.arc(x,y,Math.max(1.4,w*0.0035),0,TAU);ctx.fill();}ctx.restore();}
  const roof=[[x0-ov,eaveY(0)],...hipL,[r1,yr],...hipR.slice().reverse()].concat(eave.slice().reverse().slice(1));
  wc_wash(ctx,roof,col,{depth:d,kind:"build",lw:1.4,seed:(o.seed||5)+2});
  // the rows of tiles, down the roof, bending with it
  ctx.save();wc_tr(ctx,roof);ctx.clip();ctx.strokeStyle=rgba(wc_haze(wc_dim(col,0.35),d),0.55);ctx.lineWidth=Math.max(1,w*0.0026);const n=Math.round(w/(o.tileW||13));
  for(let i=1;i<n;i++){const u=i/n,xe=lerp(x0-ov,x1+ov,u),xr=lerp(r0-w*0.04,r1+w*0.04,u);ctx.beginPath();ctx.moveTo(xr,yr);ctx.quadraticCurveTo(lerp(xr,xe,0.6),lerp(yr,eaveY(u),0.62),xe,eaveY(u));ctx.stroke();}
  const g=ctx.createLinearGradient(0,yr,0,ye);g.addColorStop(0,rgba(wc_lit(col,0.25),0.35));g.addColorStop(1,rgba(wc_dim(col,0.3),0.25));ctx.fillStyle=g;ctx.fillRect(x0-ov,yr-4,w+2*ov,ye-yr+8);ctx.restore();
  // the eave's end tiles, a dark band
  ctx.save();ctx.strokeStyle=rgba(wc_haze(OH.tileDk,d),0.85);ctx.lineWidth=Math.max(2,(ye-yr)*0.05);ctx.beginPath();eave.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore();
  // the ridge, its ends turned up
  const rh=Math.max(4,(ye-yr)*0.1),ext=w*0.03;wc_wash(ctx,[[r0-ext,yr-rh*1.6],[r0,yr-rh*0.7],[r1,yr-rh*0.7],[r1+ext,yr-rh*1.6],[r1+ext*0.9,yr+rh*0.2],[r0-ext*0.9,yr+rh*0.2]],OH.tileDk,{depth:d,kind:"build",lw:1.2,seed:(o.seed||5)+3});}
// a hall from the front on its stone platform: bays between red-brown columns, paper doors with a grid of lattice in each (o.open: the
// bays standing open, dark inside), a band of brackets under the eaves, and the roof. x, w: its extent; base: the platform's top; hc:
// the columns' height. o.two: two storeys, the lower one plastered with small vents, as the archives were built, off the damp ground
function oh_hall(ctx,x,w,base,hc,o){o=o||{};const d=o.depth==null?1:o.depth,n=o.bays||3,ph=o.ph==null?hc*0.22:o.ph,cw=Math.max(3,w*0.018),bay=w/n,seed=o.seed||9;
  // the platform, and steps up to the middle bay
  wc_part(ctx,wc_rect(x-w*0.05,base,w*1.1,ph),OH.stone,d,{seed,lw:1.2});
  if(d>0.5){ctx.save();ctx.strokeStyle=rgba(wc_haze(OH.stoneDk,d),0.5);ctx.lineWidth=1.2;for(let i=1;i<3;i++){ctx.beginPath();ctx.moveTo(x-w*0.05,base+ph*i/3);ctx.lineTo(x+w*1.05,base+ph*i/3);ctx.stroke();}ctx.restore();}
  if(o.steps!==false)for(let i=0;i<3;i++)wc_flat(ctx,wc_rect(x+w/2-bay*0.32+i*bay*0.03,base+ph*(i+1)/3-ph*0.33,bay*0.64-i*bay*0.06,ph*0.33),wc_lit(OH.stone,0.15),d,"trim");
  const top=base-hc;
  // walls in each bay: o.two, plaster below and doors above a ledge; else doors to the floor
  for(let i=0;i<n;i++){const bx=x+i*bay+cw,bw=bay-2*cw,open=o.open&&o.open.includes(i);
    if(o.two){const mid=base-hc*0.42;wc_part(ctx,wc_rect(bx,mid,bw,base-mid),OH.plaster,d,{seed:seed+i,lw:1});
      if(d>0.5)for(let v=0;v<2;v++)wc_flat(ctx,wc_rect(bx+bw*(0.22+v*0.4),mid+(base-mid)*0.4,bw*0.16,(base-mid)*0.22),OH.lattice,d,"trim");
      wc_flat(ctx,wc_rect(bx-cw,mid-hc*0.04,bw+2*cw,hc*0.04),OH.woodDk,d,"trim");oh_doors(ctx,bx,top+hc*0.1,bw,mid-hc*0.04-top-hc*0.1,d,open,seed+i);}
    else oh_doors(ctx,bx,top+hc*0.12,bw,hc*0.88,d,open,seed+i);}
  // the columns and the beam over them
  for(let i=0;i<=n;i++){const cx=x+i*bay;wc_part(ctx,wc_rect(cx-cw,top,2*cw,hc),OH.wood,d,{seed:seed+20+i,lw:1});}
  wc_part(ctx,wc_rect(x-cw*1.5,top,w+cw*3,hc*0.1),OH.woodDk,d,{seed:seed+31,lw:1});
  // the band of brackets under the eaves: blocks over each column and between, on the green-grey
  const bk=hc*0.16;wc_wash(ctx,wc_rect(x-w*0.04,top-bk,w*1.08,bk),OH.eave,{depth:d,kind:"build",seed:seed+33,lw:1});
  if(d>0.45){const m=n*3;for(let i=0;i<=m;i++){const cx=x+w*i/m;wc_flat(ctx,wc_rect(cx-bk*0.32,top-bk*0.85,bk*0.64,bk*0.7),wc_dim(OH.eave,0.25),d,"trim");}}
  oh_roof(ctx,x-w*(o.ov||0.16),x+w*(1+(o.ov||0.16)),top-bk,top-bk-(o.rh||hc*0.62),{depth:d,seed:seed+40,lift:o.lift});}
// doors of paper in a frame: lattice in a grid over the paper, a wooden panel below; open, the bay is dark inside
function oh_doors(ctx,x,y,w,h,d,open,seed){wc_part(ctx,wc_rect(x,y,w,h),open?[70,52,44]:OH.hanji,d,{seed,lw:1});if(open||d<0.45)return;const n=Math.max(2,Math.round(w/(h*0.42)));
  ctx.save();ctx.strokeStyle=rgba(wc_haze(OH.lattice,d),0.7);ctx.lineWidth=Math.max(1,w*0.012);for(let i=1;i<n;i++){ctx.beginPath();ctx.moveTo(x+w*i/n,y);ctx.lineTo(x+w*i/n,y+h);ctx.stroke();}
  ctx.lineWidth=Math.max(0.8,w*0.006);const cols=n*3,rows=Math.round(h*0.82/(w/cols));for(let i=1;i<cols;i++){if(i%3===0)continue;ctx.beginPath();ctx.moveTo(x+w*i/cols,y);ctx.lineTo(x+w*i/cols,y+h*0.8);ctx.stroke();}
  for(let j=1;j<rows;j++){ctx.beginPath();ctx.moveTo(x,y+h*0.8*j/rows);ctx.lineTo(x+w,y+h*0.8*j/rows);ctx.stroke();}ctx.restore();
  wc_flat(ctx,wc_rect(x,y+h*0.8,w,h*0.2),OH.panel,d,"trim");}
// a compound's wall: stone at its foot, plaster above, a tiled cap; x0..x1 at y (its foot), h high; o.gate: [x, w], a roofed gate in it
function oh_wall(ctx,x0,x1,y,h,o){o=o||{};const d=o.depth==null?1:o.depth,seed=o.seed||13;wc_part(ctx,wc_rect(x0,y-h,x1-x0,h),OH.plaster,d,{seed,lw:1});
  wc_flat(ctx,wc_rect(x0,y-h*0.35,x1-x0,h*0.35),OH.stoneDk,d,"trim");
  if(d>0.5){ctx.save();ctx.strokeStyle=rgba(wc_haze(wc_dim(OH.stoneDk,0.3),d),0.45);ctx.lineWidth=1;const R=wc_rng(seed);for(let xx=x0;xx<x1;xx+=h*0.3+R()*h*0.2){ctx.beginPath();ctx.moveTo(xx,y-h*0.35);ctx.lineTo(xx+R()*4,y);ctx.stroke();}ctx.restore();}
  wc_wash(ctx,[[x0-h*0.25,y-h],[x0+h*0.15,y-h*1.32],[x1-h*0.15,y-h*1.32],[x1+h*0.25,y-h],[x1+h*0.2,y-h*0.94],[x0-h*0.2,y-h*0.94]],OH.tile,{depth:d,kind:"build",lw:1,seed:seed+1});
  if(o.gate){const [gx,gw]=o.gate;wc_part(ctx,wc_rect(gx-gw/2,y-h*1.5,gw,h*1.5),OH.wood,d,{seed:seed+2,lw:1});wc_part(ctx,wc_rect(gx-gw/2+gw*0.1,y-h*1.3,gw*0.8,h*1.3),[86,62,50],d,{seed:seed+3,lw:1});
    oh_roof(ctx,gx-gw*0.85,gx+gw*0.85,y-h*1.5,y-h*1.5-gw*0.42,{depth:d,seed:seed+4,ri:0.3});}}
// a hall inside its walls: the wall in front hides the hall's foot, so only the platform's top shows over it
function oh_compound(ctx,cx,base,w,o){o=o||{};const d=o.depth==null?1:o.depth,hc=o.hc||w*0.3;
  oh_hall(ctx,cx-w/2,w,base,hc,Object.assign({depth:d,seed:o.seed},o.hall||{}));
  oh_wall(ctx,cx-w*0.95,cx+w*0.95,base+hc*(o.wallDy||0.5),hc*(o.wallH||0.42),{depth:d,seed:(o.seed||1)+50,gate:o.gate===false?null:[cx,w*0.16]});}

/* ---------- the court: a hall of the palace in the morning ---------- */
// Seen from beside the king's seat, down the hall to its doors: a floor of square stone tiles, two rows of red-brown columns under
// dark beams, the paper doors at the far end bright with the morning; the seat is behind us. The officials stand in two rows down the hall and the two historians sit at the left with their low desks, drawn
// every frame. OH_CT: the eye (f, the horizon, its height), and oh_ctP(X, Y, Z), a point of the hall, in metres, on the frame
const OH_CT={f:820,hz:430,eye:1.6,far:26,hw:9.5,top:5.6,cols:[7,11,15,19,23]};
const oh_ctP=(X,Y,Z)=>[960+X*OH_CT.f/Z,OH_CT.hz-(Y-OH_CT.eye)*OH_CT.f/Z];
function oh_paintCourt(ctx){const C=OH_CT,P=oh_ctP,R=wc_rng(501),F=C.far;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  const [fl,ft]=P(-C.hw,C.top,F),[fr,fb]=P(C.hw,0,F);
  // the ceiling, dark wood, its beams running to the doors
  wc_wash(ctx,[P(-C.hw,C.top,F),P(C.hw,C.top,F),P(C.hw,C.top,1.2),[W+60,-60],[-60,-60],P(-C.hw,C.top,1.2)],[96,66,52],{kind:"build",line:false,seed:503});
  ctx.save();ctx.strokeStyle=rgba([60,40,32],0.55);ctx.lineCap="round";for(const X of [-6.4,-4.2,-2,0,2,4.2,6.4]){const a=P(X,C.top,F),b=P(X,C.top,2.2);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();
  // the side walls: plaster between wooden posts, a rail along them at the height of a door
  for(const s of [-1,1]){const wall=[P(s*C.hw,0,F),P(s*C.hw,C.top,F),P(s*C.hw,C.top,1.2),P(s*C.hw,0,1.2)];wc_wash(ctx,wall,[216,202,180],{kind:"build",line:false,seed:507+s});
    for(const Z of [9,13,17,21,25]){const a=P(s*C.hw,0,Z),b=P(s*C.hw,C.top,Z),r=0.22*C.f/Z;wc_part(ctx,[[a[0]-r,a[1]],[b[0]-r,b[1]],[b[0]+r,b[1]],[a[0]+r,a[1]]],OH.woodDk,1,{seed:509+Z,lw:1});}
    const r0=P(s*C.hw,2.6,F),r1=P(s*C.hw,2.6,1.2),r2=P(s*C.hw,2.4,1.2),r3=P(s*C.hw,2.4,F);wc_wash(ctx,[r0,r1,r2,r3],OH.woodDk,{kind:"build",line:false,seed:511+s});}
  // the far wall: five bays of paper doors, bright with the morning outside
  const bays=5;for(let i=0;i<bays;i++){const x0=lerp(fl,fr,i/bays),x1=lerp(fl,fr,(i+1)/bays);wc_part(ctx,wc_rect(x0,ft,x1-x0,fb-ft),OH.wood,1,{seed:511+i,lw:1});
    oh_doors(ctx,x0+5,ft+(fb-ft)*0.18,x1-x0-10,(fb-ft)*0.82,1,false,513+i);}
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,960,(ft+fb)/2+20,520,[255,236,196],0.55);ctx.restore();
  // the floor of square stone tiles, in rows to the doors, lighter where the morning falls on it
  const floor=[[fl,fb],[fr,fb],P(C.hw,0,1.2),P(-C.hw,0,1.2)];wc_wash(ctx,floor,OH.brick,{kind:"ground",line:false,seed:515});
  ctx.save();wc_tr(ctx,floor);ctx.clip();ctx.strokeStyle=rgba(wc_dim(OH.brick,0.35),0.42);ctx.lineWidth=1.3;
  for(let X=-12;X<=12;X+=0.9){const a=P(X,0,F),b=P(X,0,1.2);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  for(let Z=F;Z>1.4;Z-=Z*0.075){const y=P(0,0,Z)[1];ctx.beginPath();ctx.moveTo(-60,y);ctx.lineTo(W+60,y);ctx.stroke();}
  const lg=ctx.createRadialGradient(960,fb+60,20,960,fb+120,620);lg.addColorStop(0,"rgba(255,244,214,0.5)");lg.addColorStop(1,"rgba(255,244,214,0)");ctx.globalCompositeOperation="screen";ctx.fillStyle=lg;ctx.fillRect(0,fb,W,H-fb);
  // light from the doors, lying along the floor towards us
  for(const X of [-3.2,-0.6,1.9]){const q=[P(X,0,F),P(X+1.1,0,F),P(X*2.4+2.4,0,4.5),P(X*2.4-0.2,0,4.5)];ctx.fillStyle="rgba(255,240,204,0.13)";wc_tr(ctx,q);ctx.fill();}ctx.restore();
  // the columns, far ones first, each on its stone base, and the beams across them
  for(const Z of C.cols.slice().reverse()){for(const X of [-8.4,-4.2,4.2,8.4]){const [x,yb]=P(X,0,Z),[,yt]=P(X,C.top,Z),r=0.34*C.f/Z;
      wc_part(ctx,wc_rect(x-r*1.35,yb-r*0.55,r*2.7,r*0.7),OH.stone,1,{seed:517+Z+X,lw:1});
      wc_part(ctx,wc_rect(x-r,yt,2*r,yb-r*0.5-yt),OH.wood,1,{seed:521+Z*3+X,lw:1.2});
      ctx.save();const g=ctx.createLinearGradient(x-r,0,x+r,0);g.addColorStop(0,"rgba(255,226,190,0.22)");g.addColorStop(0.4,"rgba(255,226,190,0)");g.addColorStop(1,"rgba(40,20,16,0.22)");
      ctx.fillStyle=g;ctx.fillRect(x-r,yt,2*r,yb-r*0.5-yt);ctx.restore();}
    const a=P(-C.hw,C.top,Z),b=P(C.hw,C.top-0.5,Z);wc_part(ctx,wc_rect(a[0],a[1],b[0]-a[0],b[1]-a[1]),OH.woodDk,1,{seed:531+Z,lw:1});}
}
// where the officials stand: two rows down the hall, facing the seat ([X, Z])
const OH_ROWS=[[-1.7,5.6],[1.7,5.6],[-1.7,7.4],[1.7,7.4],[-1.7,9.2],[1.7,9.2],[-1.7,11],[1.7,11]];
// where the two historians sit at the left, near the seat, with their low desks
const OH_HIST=[[-3.3,3.4],[-2.0,4.6]];

/* ---------- the office that makes the annals, and its printers ---------- */
// a room's back wall of paper doors between posts, bright with the day, a beam over them, and a floor of boards running away from us;
// o.solid: the sections between posts that are plaster, without doors
function oh_room(ctx,fy,o){o=o||{};ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);const posts=o.posts||[110,600,1320,1810];
  wc_wash(ctx,wc_rect(-40,-40,W+80,fy+40),o.wall||[222,208,186],{kind:"plaster",line:false,seed:(o.seed||1)+1});
  for(let i=0;i<posts.length-1;i++){if(o.solid&&o.solid.includes(i))continue;const x0=posts[i]+26,x1=posts[i+1]-26,n=Math.max(2,Math.round((x1-x0)/260));for(let k=0;k<n;k++){const dx=(x1-x0)/n;
      oh_doors(ctx,x0+k*dx+4,o.doorY||170,dx-8,fy-(o.doorY||170)-8,1,false,(o.seed||1)+10+i*5+k);}}
  ctx.save();ctx.globalCompositeOperation="screen";for(let i=0;i<posts.length-1;i++)if(!(o.solid&&o.solid.includes(i)))wc_glowAt(ctx,(posts[i]+posts[i+1])/2,(fy+(o.doorY||170))/2,420,[255,240,206],0.35);ctx.restore();
  posts.forEach((x,i)=>wc_part(ctx,wc_rect(x-24,-40,48,fy+48),OH.wood,1,{seed:(o.seed||1)+30+i,lw:1.2}));
  wc_part(ctx,wc_rect(-40,(o.doorY||170)-58,W+80,46),OH.woodDk,1,{seed:(o.seed||1)+40,lw:1.2});
  const vx=960,vy=o.vy||220;wc_wash(ctx,wc_rect(-40,fy,W+80,H-fy+40),OH.maru,{kind:"ground",line:false,seed:(o.seed||1)+50});
  ctx.save();ctx.strokeStyle=rgba(OH.maruDk,0.45);ctx.lineWidth=1.6;for(let i=-14;i<=14;i++){const x=vx+i*140;ctx.beginPath();ctx.moveTo(lerp(vx,x,(fy-vy)/(H-vy)),fy);ctx.lineTo(x,H+10);ctx.stroke();}
  const g=ctx.createLinearGradient(0,fy,0,H);g.addColorStop(0,"rgba(255,244,220,0.28)");g.addColorStop(1,"rgba(255,244,220,0)");ctx.globalCompositeOperation="screen";ctx.fillStyle=g;ctx.fillRect(0,fy,W,H-fy);ctx.restore();
  wc_flat(ctx,wc_rect(-40,fy-6,W+80,10),OH.woodDk,1,"trim");}
// the office: its back wall and floor; the long low table is its front layer (oh_officeTable), drawn over the members sitting behind it
const OH_OF={fy:600,tb:[300,1620,676,712,800]};
function oh_paintOffice(ctx){oh_room(ctx,OH_OF.fy,{seed:601,vy:260,solid:[0]});
  // shelves on the plaster at the left, with bundles of notes tied with cord
  wc_part(ctx,wc_rect(140,404,330,14),OH.woodDk,1,{seed:611,lw:1});wc_part(ctx,wc_rect(140,520,330,14),OH.woodDk,1,{seed:612,lw:1});
  for(let i=0;i<5;i++){oh_bundle(ctx,170+i*60,404,48,40,613+i);oh_bundle(ctx,176+i*58,520,46,46,623+i);}}
function oh_officeTable(){return wc_kept("ohOfficeTable",W,H,c=>{const [x0,x1,t0,t1,ft]=OH_OF.tb;
  wc_part(c,[[x0,t0],[x1,t0],[x1+24,t1],[x0-24,t1]],OH.maru,1,{seed:631,lw:1.4});wc_part(c,wc_rect(x0-24,t1,x1-x0+48,22),OH.maruDk,1,{seed:633,lw:1.2});
  for(const lx of [x0+20,x1-20,(x0+x1)/2])wc_part(c,wc_rect(lx-12,t1+22,24,ft-t1-22),OH.maruDk,1,{seed:635+lx,lw:1});
  // on it: bundles of the historians' notes, an inkstone, brushes on a rest
  for(const [bx,bw,bh] of [[420,96,40],[560,110,52],[1240,100,44],[1380,96,36]])oh_bundle(c,bx,t0+18,bw,bh,641+bx);
  wc_part(c,[[880,t0+4],[1000,t0+4],[1006,t0+22],[874,t0+22]],[70,70,76],1,{seed:651,lw:1});wc_flat(c,[[892,t0+8],[930,t0+8],[930,t0+18],[892,t0+18]],[30,30,36],1,"trim");
  for(let i=0;i<3;i++){c.save();c.strokeStyle=rgba([150,110,70],1);c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(1040+i*16,t0+6);c.lineTo(1100+i*16,t0-4);c.stroke();c.restore();}});}
// a bundle of sheets, tied with cord: x, y its foot's left and line, w, h its size
function oh_bundle(ctx,x,y,w,h,seed){wc_part(ctx,[[x,y],[x+w,y],[x+w-2,y-h],[x+2,y-h]],OH.paper,1,{seed,lw:1});ctx.save();ctx.strokeStyle=rgba(OH.ink,0.18);ctx.lineWidth=1;
  for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(x+2,y-h*i/6);ctx.lineTo(x+w-2,y-h*i/6);ctx.stroke();}ctx.strokeStyle=rgba([150,60,50],0.9);ctx.lineWidth=2.4;
  ctx.beginPath();ctx.moveTo(x+w*0.5,y);ctx.lineTo(x+w*0.5,y-h);ctx.moveTo(x,y-h*0.5);ctx.lineTo(x+w,y-h*0.5);ctx.stroke();ctx.restore();}
// the printers' room: plaster between posts, a small high window, sheets hung on strings to dry; the bench is its front layer
// (oh_printBench): blank paper, the tray of type, an ink bowl and brush, and a pad to rub with
const OH_PR={fy:640,bench:[520,1400,700,736,812],tray:[860,1060,694],stack:[600,760],pile:[1160,1330]};
function oh_paintPrint(ctx){const R=wc_rng(701);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,OH_PR.fy+40),[214,198,172],{kind:"plaster",line:false,seed:703});
  for(const x of [80,700,1240,1850])wc_part(ctx,wc_rect(x-26,-40,52,OH_PR.fy+48),OH.woodDk,1,{seed:705+x,lw:1.2});
  wc_part(ctx,wc_rect(-40,90,W+80,40),OH.woodDk,1,{seed:707,lw:1.2});
  // the window, high on the right, its lattice bright
  wc_part(ctx,wc_rect(1420,170,300,190),OH.wood,1,{seed:709,lw:1});oh_doors(ctx,1432,182,276,166,1,false,711);
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1570,270,420,[255,240,204],0.5);ctx.restore();
  // strings across the room, sheets hung over them to dry, each with its columns of marks
  for(const [y,x0,x1,n] of [[200,140,640,5],[300,760,1210,4],[420,140,640,4]]){ctx.save();ctx.strokeStyle="rgba(90,70,50,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0-40,y-6);ctx.quadraticCurveTo((x0+x1)/2,y+14,x1+40,y-6);ctx.stroke();ctx.restore();
    for(let i=0;i<n;i++){const sx=lerp(x0,x1,(i+0.5)/n)-36,sy=y+4+Math.sin((i+0.5)/n*Math.PI)*10;wc_part(ctx,wc_rect(sx,sy,72,96),OH.paper,1,{seed:713+Math.round(sx+y),lw:0.9});oh_marks(ctx,sx+8,sy+10,56,78,6,1,717+Math.round(sx));}}
  wc_wash(ctx,wc_rect(-40,OH_PR.fy,W+80,H-OH_PR.fy+40),[176,150,118],{kind:"ground",line:false,seed:721});
  for(let i=0;i<40;i++){ctx.fillStyle=rgba([120,96,70],0.18);ctx.fillRect(R()*W,OH_PR.fy+R()*(H-OH_PR.fy),20+R()*40,2);}}
function oh_printBench(){return wc_kept("ohPrintBench",W,H,c=>{const [x0,x1,t0,t1,ft]=OH_PR.bench;
  wc_part(c,[[x0,t0],[x1,t0],[x1+20,t1],[x0-20,t1]],OH.maru,1,{seed:731,lw:1.4});wc_part(c,wc_rect(x0-20,t1,x1-x0+40,24),OH.maruDk,1,{seed:733,lw:1.2});
  for(const lx of [x0+24,x1-24])wc_part(c,wc_rect(lx-14,t1+24,28,ft-t1),OH.maruDk,1,{seed:735+lx,lw:1});
  // the blank paper, a stack at the left; the tray of type in the middle, dark, its little blocks in rows; the ink bowl at the right front
  const [s0,s1]=OH_PR.stack;for(let i=0;i<6;i++)wc_flat(c,[[s0+i,t0+14-i*3],[s1-i,t0+14-i*3],[s1-i-4,t0+4-i*3],[s0+i+4,t0+4-i*3]],i%2?OH.paper:wc_dim(OH.paper,0.04),1,"page");
  const [r0,r1,ry]=OH_PR.tray;wc_part(c,[[r0,ry],[r1,ry],[r1+10,ry+26],[r0-10,ry+26]],OH.woodDk,1,{seed:741,lw:1.2});
  c.save();c.fillStyle="rgba(40,36,40,0.85)";for(let i=0;i<16;i++)for(let j=0;j<3;j++){const u=(i+0.5)/16,v=(j+0.5)/3,x=lerp(r0+12,r1-12,u)+(v-0.5)*10*(u-0.5),y=lerp(ry+5,ry+21,v);c.fillRect(x-4,y-2.5,8,5);}c.restore();
  wc_part(c,wc_ell(1350,t0+18,30,12,20),[70,66,70],1,{seed:745,lw:1});wc_flat(c,wc_ell(1350,t0+16,22,7,16),[24,22,26],1,"trim");});}
// the floor where the books are laid in their chests: boards from above, a plaster wall at the back with a paper door, light from the left
function oh_paintChests(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,380),[220,206,182],{kind:"plaster",line:false,seed:801});
  for(const x of [150,1000,1800])wc_part(ctx,wc_rect(x-22,-40,44,370),OH.wood,1,{seed:803+x,lw:1.2});oh_doors(ctx,190,40,780,280,1,false,805);oh_doors(ctx,1040,40,730,280,1,false,806);
  wc_wash(ctx,wc_rect(-40,322,W+80,H),OH.maru,{kind:"ground",line:false,seed:807});ctx.save();ctx.strokeStyle=rgba(OH.maruDk,0.42);ctx.lineWidth=1.8;
  for(let i=0;i<12;i++){const y=330+i*i*5.4+i*12;ctx.beginPath();ctx.moveTo(-40,y);ctx.lineTo(W+40,y);ctx.stroke();}ctx.restore();wc_flat(ctx,wc_rect(-40,318,W+80,10),OH.woodDk,1,"trim");
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,200,500,900,[255,242,212],0.32);ctx.restore();}

/* ---------- the land: a road through the hills, Jeonju's archive, a mountain path, a cave by night, an archive in the mountains ---------- */
// layered hills to a horizon: far ridges blue-grey in mist, then nearer ones greener; seed varies them
function oh_hills(ctx,hz,seed,o){o=o||{};const n=o.n||3,cols=o.cols||[OH.far,mix(OH.far,OH.mid,0.5),OH.mid];
  for(let i=0;i<n;i++){const y=hz-(n-i)*(o.step||55)-20,f=oh_hillF(y,(o.h||170)*(1-i*0.18),seed+i*7,{s:1+i*0.35});oh_ridge(ctx,f,cols[i],0.3+i*0.22,seed+i*11,[40,(o.mist||150),0.75]);
    if(o.pines&&i===n-1)oh_pines(ctx,f,-40,W+40,26,22,0.4,seed+i*13);}}
// a road through the hills, coming up from the foot of the frame and over a pass; OH_RD: its line, near to far, and its width there
const OH_RD={pts:[[760,1110],[930,930],[880,800],[1010,700],[1160,632],[1290,588]],w:[260,180,120,80,52,30],hz:640};
function oh_roadAt(u){const P=OH_RD.pts,k=clamp(u,0,0.9999)*(P.length-1),i=Math.floor(k),f=k-i;return[lerp(P[i][0],P[i+1][0],f),lerp(P[i][1],P[i+1][1],f),lerp(OH_RD.w[i],OH_RD.w[i+1],f)];}
function oh_paintRoad(ctx){const R=wc_rng(901);wc_sky(ctx,600,903,{clouds:4,cy:80,ch:180});oh_hills(ctx,640,905,{n:3,h:190});
  const near=x=>600+50*Math.sin(x/260+1)+24*Math.sin(x/90);wc_land(ctx,near,OH.near,0.85,{seed:907});
  const L=[],Rr=[];for(let i=0;i<=60;i++){const [x,y,w]=oh_roadAt(i/60);L.push([x-w/2,y]);Rr.unshift([x+w/2,y]);}
  wc_wash(ctx,L.concat(Rr),OH.earth,{kind:"ground",line:false,seed:909});ctx.save();ctx.strokeStyle=rgba(OH.earthDk,0.5);ctx.lineWidth=2;ctx.beginPath();L.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
  ctx.beginPath();Rr.slice().reverse().forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore();
  for(let i=0;i<60;i++){const u=R(),[x,y,w]=oh_roadAt(u);ctx.fillStyle=rgba(OH.earthDk,0.25);ctx.fillRect(x+(R()-0.5)*w*0.8,y,6+R()*10*w/100,2);}
  // pines and rocks along it, larger near us
  for(const [x,y,h,sd] of [[300,700,260,1],[470,640,170,2],[1500,660,230,3],[1680,720,320,4],[1300,600,110,5],[620,600,90,6],[160,830,420,7],[1850,880,380,8]])oh_pine(ctx,x,y,h,{seed:921+sd});
  for(const [x,y,r] of [[640,980,60],[1180,860,40],[1360,1000,80]])oh_rock(ctx,x,y,r,{seed:931+x});}
// Jeonju's archive in its walled compound in the town: the archive's hall, raised on its lower storey, its upper doors open on the chests;
// roofs of the town and hills behind; old trees inside the walls. OH_AR: the hall, and its open bay
const OH_AR={x:650,w:620,base:800,hc:400,bay:1};
function oh_paintArchive(ctx){const A=OH_AR;wc_sky(ctx,560,951,{clouds:3,cy:60,ch:160});oh_hills(ctx,560,953,{n:2,h:150});
  // the town's roofs behind the walls
  const R=wc_rng(955);for(let i=0;i<14;i++){const x=R()*W,w=110+R()*140,y=640+R()*50;if(x>520&&x<1400)continue;wc_part(ctx,wc_rect(x-w/2,y,w,60),OH.plaster,0.6,{seed:957+i,lw:1});oh_roof(ctx,x-w*0.6,x+w*0.6,y,y-w*0.32,{depth:0.6,seed:961+i,ri:0.3});}
  // the old trees, then the hall, then the wall and its gate in front
  oh_tree(ctx,1760,900,360,{seed:962,col:[96,130,82]});oh_tree(ctx,170,890,320,{seed:964,col:[106,138,88]});
  oh_pine(ctx,420,900,560,{seed:963,lean:0.3});oh_pine(ctx,1520,900,600,{seed:965,lean:-0.4});
  oh_hall(ctx,A.x,A.w,A.base,A.hc,{two:true,bays:3,open:[A.bay],seed:967,rh:190});
  oh_wall(ctx,40,1880,1000,150,{seed:971,gate:[960,200]});
  wc_wash(ctx,wc_rect(-40,1000,W+80,120),OH.earth,{kind:"ground",line:false,seed:973});}
// where the open bay's inside is, on the frame: the chests are drawn in it every frame
function oh_archiveBay(){const A=OH_AR,bay=A.w/3,cw=Math.max(3,A.w*0.018),top=A.base-A.hc,mid=A.base-A.hc*0.42;return[A.x+A.bay*bay+cw,top+A.hc*0.1,bay-2*cw,mid-A.hc*0.04-top-A.hc*0.1];}
// a mountain path, seen from high on it: the slope falls away below us to its brow, the valley's mist and the ranges beyond; the path
// comes up over the brow and climbs towards us in turns, with steps where it's steep; pines at the sides, and the tops of the trees
// below the brow. o.autumn: years later, with red and gold maples among the pines
const OH_PT=[[700,636],[612,690],[770,752],[640,836],[900,920],[1110,1004],[1250,1110]];
function oh_pathAt(u){const P=OH_PT,k=clamp(u,0,0.9999)*(P.length-1),i=Math.floor(k),f=k-i,e=f*f*(3-2*f);return[lerp(P[i][0],P[i+1][0],e),lerp(P[i][1],P[i+1][1],e)];}
function oh_pathW(u){return lerp(30,300,Math.pow(clamp(u,0,1),1.5));}
function oh_paintPath(ctx,o){o=o||{};const R=wc_rng(o.autumn?1011:1001),aut=!!o.autumn;wc_sky(ctx,420,1003,{clouds:3,cy:30,ch:120});
  // the ranges, far to near, each in its mist
  for(let i=0;i<4;i++){const f=oh_peaksF(330+i*62,250-i*40,1005+i*7,5);oh_ridge(ctx,f,mix(OH.far,OH.mid,i/3.5),0.3+i*0.16,1005+i*11,[30,150,0.82,H]);}
  // the tops of the trees far below the brow, small in the valley's mist, then the slope we stand on: it rises to a knoll at the right
  const brow=x=>640+14*Math.sin(x/240+0.6)+8*Math.sin(x/97)-150*Math.exp(-Math.pow((x-1560)/300,2))-40*Math.exp(-Math.pow((x-260)/220,2));
  for(let x=-30;x<W+40;x+=26+R()*30){const h=60+R()*50;if(aut&&R()<0.35)oh_tree(ctx,x,brow(x)+h*0.55,h,{autumn:true,seed:1041+Math.round(x),depth:0.5});else oh_pine(ctx,x,brow(x)+h*0.6,h,{seed:1043+Math.round(x),depth:0.5,lean:(R()-0.5)*0.8});}
  ctx.save();const mg=ctx.createLinearGradient(0,540,0,700);mg.addColorStop(0,rgba(WC_PAPER,0));mg.addColorStop(1,rgba(WC_PAPER,0.55));ctx.fillStyle=mg;ctx.fillRect(0,540,W,160);ctx.restore();
  oh_pines(ctx,brow,1380,1760,46,150,0.8,1045,aut?{}:{});
  wc_land(ctx,brow,aut?mix(OH.near,[176,148,84],0.32):OH.near,0.9,{seed:1007});
  ctx.save();ctx.strokeStyle=rgba(wc_dim(OH.near,0.3),0.35);ctx.lineWidth=1.4;for(let i=0;i<140;i++){const x=R()*W,y=brow(x)+20+Math.pow(R(),0.7)*(H-brow(x)),s=4+(y-600)/40;
    ctx.beginPath();ctx.moveTo(x-s,y);ctx.lineTo(x-s*0.3,y-s*1.2);ctx.moveTo(x,y);ctx.lineTo(x+s*0.2,y-s*1.5);ctx.moveTo(x+s,y);ctx.lineTo(x+s*0.6,y-s);ctx.stroke();}ctx.restore();
  // the path: beaten earth, its edges, and steps where it turns
  const pts=[];for(let i=0;i<=120;i++)pts.push(oh_pathAt(i/120));const L=[],Rr=[];pts.forEach(([x,y],i)=>{const w=oh_pathW(i/120);L.push([x-w/2,y]);Rr.unshift([x+w/2,y]);});
  wc_wash(ctx,L.concat(Rr),OH.earth,{kind:"ground",line:false,seed:1017});ctx.save();ctx.strokeStyle=rgba(OH.earthDk,0.55);ctx.lineWidth=2;
  for(const side of [L,Rr.slice().reverse()]){ctx.beginPath();side.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
  // little stones along its edges
  for(let i=8;i<120;i+=3){const [x,y]=pts[i],w=oh_pathW(i/120),sd=R()<0.5?-1:1;ctx.fillStyle=rgba([130,124,114],0.55);ctx.beginPath();ctx.ellipse(x+sd*w*(0.5+R()*0.08),y,w*0.03+1,w*0.018+1,0,0,TAU);ctx.fill();}ctx.restore();
  // rocks by the path, and the nearest pines, large at the edges
  for(const [x,y,r] of [[470,1000,64],[1500,1040,80],[1010,780,26],[420,760,30],[1420,880,40]])oh_rock(ctx,x,y,r,{seed:1021+x});
  if(aut){oh_tree(ctx,300,960,420,{autumn:true,seed:1051});oh_tree(ctx,1640,900,360,{autumn:true,seed:1053});}
  oh_pine(ctx,80,1110,820,{seed:1031,lean:0.5});oh_pine(ctx,1840,1120,880,{seed:1033,lean:-0.6});oh_pine(ctx,1560,760,300,{seed:1035,lean:-0.3});}
// a cave's mouth at night, in a cliff high on the mountain: the rock in ledges, its dark opening with the chests inside, a little ground
// before it, pines in the dark; o.snow, in winter. The fire, its light and the two who keep watch are drawn every frame. OH_CV: the
// mouth's arch (its foot's middle, half its width, its height), the fire, where the two sit, the chests
const OH_CV={arch:[1100,800,330,430],fire:[960,900],seats:[[700,890],[1250,880]],chests:[[930,792],[1050,786],[1170,790],[1290,796]]};
function oh_caveMouth(){const [cx,fy,rx,ry]=OH_CV.arch,R=wc_rng(1119),P=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI,k=1+0.06*Math.sin(a*7+1)+0.04*Math.sin(a*13);
  P.push([cx-Math.cos(a)*rx*k*(1+0.06*Math.sin(a)),fy-Math.pow(Math.sin(a),0.7)*ry*k]);}return P;}
// the ledges across the cliff: each an open line, left to right, that the snow lies on
const OH_LEDGE=[[[600,560],[760,520],[980,330],[1200,300],[1420,340],[1600,300],[1980,280]],[[700,330],[880,220],[1180,190],[1500,200],[1760,150],[1980,140]],
  [[560,760],[700,720],[760,700]],[[1450,700],[1600,650],[1800,640],[1980,600]],[[1440,520],[1640,470],[1980,450]]];
function oh_paintCave(ctx,o){o=o||{};const R=wc_rng(1101),snow=!!o.snow;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(22,28,54)");g.addColorStop(1,"rgb(48,54,80)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle="rgba(255,255,240,0.8)";for(let i=0;i<80;i++){const x=R()*620,y=R()*420,r=R()*1.6+0.4;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}
  // the far ranges, dark; then the mountain's flank rising to the right, and the cliff in it
  wc_land(ctx,oh_peaksF(470,220,1103,4),[40,48,72],1,{seed:1105,line:false});wc_land(ctx,x=>560-x*0.32+20*Math.sin(x/120),[44,50,58],1,{seed:1107,line:false});
  const cliff=[[520,1140],[540,760],[600,560],[700,330],[880,220],[1180,190],[1500,200],[1760,150],[W+60,130],[W+60,1140]];wc_wash(ctx,cliff,[92,88,90],{kind:"build",line:false,seed:1111});
  ctx.save();wc_tr(ctx,cliff);ctx.clip();
  // the rock in ledges: each ledge's lit top, and its shadow under it; cracks down the faces
  for(const L of OH_LEDGE){const sm=oh_smoothPts(L);ctx.strokeStyle="rgba(30,28,32,0.55)";ctx.lineWidth=3;ctx.beginPath();sm.forEach(([x,y],i)=>i?ctx.lineTo(x,y+6):ctx.moveTo(x,y+6));ctx.stroke();
    ctx.strokeStyle="rgba(170,166,166,0.35)";ctx.lineWidth=2;ctx.beginPath();sm.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
  ctx.strokeStyle="rgba(30,28,32,0.4)";ctx.lineWidth=1.8;for(let i=0;i<34;i++){const x=600+R()*1360,y=180+R()*560;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(R()-0.5)*30,y+30+R()*70);ctx.lineTo(x+(R()-0.5)*40,y+60+R()*90);ctx.stroke();}
  const sh=ctx.createLinearGradient(520,0,W,0);sh.addColorStop(0,"rgba(20,18,24,0.35)");sh.addColorStop(0.4,"rgba(20,18,24,0)");ctx.fillStyle=sh;ctx.fillRect(0,0,W,H);ctx.restore();
  // the mouth: its dark, deeper further in, and the rock's lip around it
  const M=oh_caveMouth();wc_wash(ctx,M,[46,40,40],{kind:"build",line:false,seed:1113});ctx.save();wc_tr(ctx,M);ctx.clip();
  const [cx,fy,rx,ry]=OH_CV.arch,ig=ctx.createRadialGradient(cx,fy-ry*0.3,20,cx,fy-ry*0.35,rx*1.1);ig.addColorStop(0,"rgb(12,10,12)");ig.addColorStop(1,"rgba(40,34,34,1)");ctx.fillStyle=ig;ctx.fillRect(cx-rx*1.2,fy-ry*1.2,rx*2.4,ry*1.3);
  ctx.fillStyle="rgba(58,50,46,1)";ctx.beginPath();ctx.ellipse(cx,fy+6,rx*0.98,46,0,Math.PI,TAU);ctx.fill();ctx.restore();
  wc_ink(ctx,M.concat([[cx+rx,fy]]),false,2.2,[24,22,26],0.7,1121,1.4);
  // the chests inside, in the dark
  for(const [x,y] of OH_CV.chests)oh_chest(ctx,x,y,0.56,{dark:true,seed:x});
  // the ground before the mouth, and its stones
  const ground=[[-60,850],[300,820],[700,800],[1100,806],[1500,820],[W+60,800],[W+60,H+60],[-60,H+60]];wc_wash(ctx,ground,snow?[206,214,232]:[72,64,58],{kind:"ground",line:false,seed:1115});
  for(const [x,y,r] of [[380,960,50],[1560,1000,70],[1760,900,40]])oh_rock(ctx,x,y,r,{seed:1125+x,col:snow?[120,120,130]:[96,90,88],snow});
  // pines in the dark at the left, on the flank
  for(const [x,y,h] of [[110,880,560],[300,800,380],[440,740,240]])oh_pine(ctx,x,y,h,{seed:1117+x,col:[34,48,44],depth:1,snow});
  if(snow){// snow along the ledges, thick on their tops, and drifts on the ground
    ctx.save();wc_tr(ctx,cliff);ctx.clip();for(const L of OH_LEDGE){const sm=oh_smoothPts(L);const top=sm.map(([x,y],i)=>[x,y-6-5*Math.sin(i*0.9)-4]);
      wc_tr(ctx,sm.concat(top.slice().reverse()));ctx.fillStyle="rgba(236,240,248,0.92)";ctx.fill();}ctx.restore();
    ctx.save();ctx.filter="blur(6px)";ctx.fillStyle="rgba(248,250,255,0.4)";for(let i=0;i<9;i++){ctx.beginPath();ctx.ellipse(R()*W,860+R()*200,120+R()*160,8+R()*6,0,0,TAU);ctx.fill();}ctx.restore();}
  // the night over everything: a cool veil, which the fire's light lifts (drawn every frame)
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=snow?"rgba(128,138,178,0.55)":"rgba(112,118,162,0.6)";ctx.fillRect(0,0,W,H);ctx.restore();}
// a smooth line through a few points
function oh_smoothPts(P){const o=[];for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],a0=P[i-1]||a,b1=P[i+2]||b;for(let k=0;k<8;k++){const t=k/8,t2=t*t,t3=t2*t;
  o.push([0.5*((2*a[0])+(-a0[0]+b[0])*t+(2*a0[0]-5*a[0]+4*b[0]-b1[0])*t2+(-a0[0]+3*a[0]-3*b[0]+b1[0])*t3),0.5*((2*a[1])+(-a0[1]+b[1])*t+(2*a0[1]-5*a[1]+4*b[1]-b1[1])*t2+(-a0[1]+3*a[1]-3*b[1]+b1[1])*t3)]);}}
  o.push(P[P.length-1]);return o;}
// a chest for the books: dark wood, brass at its corners and lock; x, y: the middle of its foot; s its scale; o.open (0 to 1) lifts its
// lid; o.dark, in the dark of a cave
function oh_chest(ctx,x,y,s,o){o=o||{};const w=200*s,h=120*s,c=o.dark?[56,44,38]:OH.chest,b=o.dark?[110,96,70]:OH.brass,op=clamp(o.open||0,0,1);
  wc_part(ctx,wc_rect(x-w/2,y-h,w,h),c,1,{seed:(o.seed||1)+Math.round(x),lw:1.1});wc_flat(ctx,wc_rect(x-w/2,y-h,w,h*0.22),wc_dim(c,0.2),1,"trim");
  for(const [cx,cy] of [[x-w/2,y-h],[x+w/2-18*s,y-h],[x-w/2,y-20*s],[x+w/2-18*s,y-20*s]])wc_flat(ctx,wc_rect(cx,cy,18*s,20*s),b,1,"trim");
  wc_flat(ctx,wc_rect(x-14*s,y-h*0.78,28*s,30*s),b,1,"trim");
  if(op>0.01){const lh=h*0.22,ly=y-h-lh*op*2.2;wc_part(ctx,[[x-w/2,y-h],[x+w/2,y-h],[x+w/2+6*s,ly],[x-w/2-6*s,ly]],wc_lit(c,0.1),1,{seed:(o.seed||1)+7,lw:1});}}
// an archive high in the mountains: its hall raised on its lower storey, among pines, a yard of beaten earth in front where the books
// are aired on racks in the sun (drawn every frame), mist in the valley below. OH_AI: the hall, the yard, the racks, the historian's mat
const OH_AI={x:130,w:600,base:640,hc:350,yard:612,racks:[[960,712,380],[1400,712,380],[940,860,420],[1420,860,420]],mat:[1600,940]};
function oh_paintAiring(ctx){const R=wc_rng(1201);wc_sky(ctx,360,1203,{clouds:4,cy:40,ch:120});oh_hills(ctx,380,1205,{n:3,h:200,step:60});
  const back=x=>300+80*Math.sin(x/300+2)+30*Math.sin(x/110);wc_land(ctx,back,OH.mid,0.75,{seed:1207});oh_pines(ctx,back,-40,W+40,60,150,0.75,1209);
  // the yard's wall behind the racks, the yard, the hall standing in it, and the pines at its sides
  oh_wall(ctx,800,W+60,618,86,{seed:1213,gate:false});
  wc_wash(ctx,wc_rect(-40,OH_AI.yard,W+80,H-OH_AI.yard+40),[206,184,146],{kind:"ground",line:false,seed:1215});
  oh_hall(ctx,OH_AI.x,OH_AI.w,OH_AI.base,OH_AI.hc,{two:true,bays:3,open:[0,1,2],seed:1211,rh:170});
  ctx.save();ctx.globalCompositeOperation="screen";const g=ctx.createLinearGradient(0,OH_AI.yard,0,H);g.addColorStop(0,"rgba(255,246,214,0.4)");g.addColorStop(1,"rgba(255,246,214,0)");ctx.fillStyle=g;ctx.fillRect(0,OH_AI.yard,W,H);ctx.restore();
  for(const [x,y,w] of OH_AI.racks){for(const s of [-1,1])wc_part(ctx,wc_rect(x+s*w*0.46-6,y-6,12,70),OH.woodDk,1,{seed:1217+x+y+s,lw:1});
    wc_part(ctx,[[x-w/2,y-14],[x+w/2,y-14],[x+w/2+10,y+6],[x-w/2-10,y+6]],OH.maru,1,{seed:1219+x+y,lw:1.2});}
  wc_part(ctx,[[OH_AI.mat[0]-200,OH_AI.mat[1]-40],[OH_AI.mat[0]+260,OH_AI.mat[1]-40],[OH_AI.mat[0]+300,OH_AI.mat[1]+60],[OH_AI.mat[0]-240,OH_AI.mat[1]+60]],[214,192,140],1,{seed:1221,lw:1});
  oh_pine(ctx,1880,900,700,{seed:1223,lean:-0.5});}

/* ---------- the archives as small views, pinned on paper like a map ---------- */
// Each painted on a sheet OH_VW x OH_VH, its edges soft, as if painted straight onto the paper: the capital, a city in its walls under a
// rocky peak, with its great gate; three towns, each with its archive's tall hall inside a walled compound (Chungju by its river,
// Seongju among hills and fields, Jeonju on its plain among old trees); and four mountains, each with its archive high on a slope among
// pines (Mani above the sea)
const OH_VW=440,OH_VH=300;
// the sheet they're pinned on: paper over the whole frame, a soft wash, its fibres
function oh_paintBoard(ctx){const R=wc_rng(1291);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),OH.hanji,{kind:"plaster",line:false,seed:1293});
  ctx.save();ctx.strokeStyle="rgba(150,130,100,0.12)";ctx.lineWidth=1;for(let i=0;i<260;i++){const x=R()*W,y=R()*H,a=R()*TAU,l=10+R()*30;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+Math.cos(a)*l*0.5+4,y+Math.sin(a)*l*0.5,x+Math.cos(a)*l,y+Math.sin(a)*l);ctx.stroke();}ctx.restore();}
function oh_view(k){return wc_kept("ohView:"+k,OH_VW,OH_VH,q=>{const w=OH_VW,h=OH_VH,R=wc_rng(1301+k.length*13+k.charCodeAt(0)),c=mkCanvas(w,h);
  const v=c.getContext("2d");v.fillStyle=rgba(WC_PAPER,1);v.fillRect(0,0,w,h);const sky=v.createLinearGradient(0,0,0,h*0.6);sky.addColorStop(0,"rgba(176,204,228,0.9)");sky.addColorStop(1,"rgba(236,236,226,0.4)");
  v.fillStyle=sky;v.fillRect(0,0,w,h);const sc=h/H;v.save();v.translate((w-W*sc)/2,0);v.scale(sc,sc);// paint in frame units: a frame's worth, shrunk to the sheet's height
  const town=k==="capital"||k==="chungju"||k==="seongju"||k==="jeonju";
  if(town){// a town on its plain: hills behind, the land, houses, the compound in the middle; Chungju's river and Seongju's fields in front
    oh_hills(v,560,1311+k.length,{n:2,h:200,step:60,mist:120});const g0=720;
    if(k==="capital"){const peak=oh_peaksF(600,400,1321,3);oh_ridge(v,peak,[156,154,146],0.85,1323,[60,240,0.6,H]);}
    wc_wash(v,[[-60,g0],[W+60,g0-30],[W+60,1140],[-60,1140]],k==="seongju"?[196,200,132]:[184,194,128],{kind:"land",line:false,seed:1371});
    if(k==="chungju")wc_wash(v,[[-60,930],[700,900],[1300,920],[W+60,890],[W+60,1140],[-60,1140]],WCP.water,{kind:"water",line:false,seed:1341});
    if(k==="seongju")for(let i=0;i<5;i++)wc_wash(v,[[-60,880+i*44],[W+60,850+i*44],[W+60,884+i*44],[-60,914+i*44]],i%2?[206,196,120]:[176,192,112],{kind:"field",line:false,seed:1351+i});
    for(let i=0;i<10;i++){const x=R()*W,ww=120+R()*120,y=g0+20+R()*60;if(Math.abs(x-960)<330)continue;wc_part(v,wc_rect(x-ww/2,y-50,ww,50),OH.plaster,0.9,{seed:1373+i,lw:1.2});oh_roof(v,x-ww*0.6,x+ww*0.6,y-50,y-50-ww*0.34,{depth:0.9,seed:1377+i,ri:0.3});}
    if(k==="jeonju"){oh_tree(v,560,g0+150,380,{seed:1395});oh_tree(v,1380,g0+160,420,{seed:1397,col:[106,138,88]});}
    if(k==="capital"){oh_roof(v,960-300,960+300,g0-60,g0-200,{seed:1383,ri:0.26});wc_part(v,wc_rect(960-200,g0-60,400,90),OH.wood,1,{seed:1385,lw:1.2});oh_wall(v,-60,W+60,g0+150,110,{seed:1381,gate:[960,300]});}
    else oh_compound(v,960,g0+40,560,{hc:300,seed:1391+k.length,hall:{two:true,bays:3,rh:140}});}
  else{// a mountain, its own shape, the archive small and high on its slope among pines; Mani's above the sea
    const sh={odae:[1.7,1.25],taebaek:[0.95,0.8],myohyang:[1.2,1],mani:[1.15,1]}[k],cx=k==="mani"?1060:880,pk=k==="myohyang"?oh_peaksF(700,560,1337,6):null;
    oh_hills(v,520,1311+k.length,{n:2,h:200,step:80,mist:120});
    const g=x=>{const c=120+Math.pow(Math.abs(x-cx)/(900*sh[1]),sh[0])*640+10*Math.sin(x/61+k.length);return pk?Math.min(c,pk(x)):c;};
    wc_land(v,g,OH.mid,0.95,{seed:1331+k.length});oh_pines(v,g,0,W,40,120,0.85,1333+k.length);
    if(k==="mani")wc_wash(v,[[-60,860],[W+60,840],[W+60,1140],[-60,1140]],WCP.water,{kind:"water",line:false,seed:1361});
    // the archive on a terrace on the slope, the peak behind it
    const ax=cx+(k==="mani"?-230:210),gy=k==="mani"?720:660;wc_wash(v,wc_ell(ax,gy+40,300,60,24),mix(OH.mid,OH.earth,0.4),{kind:"land",line:false,seed:1387});
    for(let i=0;i<5;i++)oh_pine(v,ax-280+i*140,gy-120+(i%2)*30,170,{seed:1388+i,depth:0.9});
    oh_compound(v,ax,gy,300,{hc:160,seed:1391+k.length,hall:{two:true,bays:3,rh:90},wallH:0.36});
    for(let i=0;i<9;i++){const x=R()*W;if(Math.abs(x-ax)<240)continue;oh_pine(v,x,gy+120+R()*260,220+R()*160,{seed:1399+i});}}
  v.restore();
  // soft edges: the paint fades into the paper
  v.globalCompositeOperation="destination-in";const m=v.createRadialGradient(w/2,h/2,Math.min(w,h)*0.32,w/2,h/2,Math.max(w,h)*0.58);m.addColorStop(0,"rgba(0,0,0,1)");m.addColorStop(0.7,"rgba(0,0,0,0.9)");m.addColorStop(1,"rgba(0,0,0,0)");
  v.fillStyle=m;v.fillRect(0,0,w,h);q.fillStyle=rgba(WC_PAPER,1);q.fillRect(0,0,w,h);q.drawImage(c,0,0);});}

/* ---------- today: a long shelf of the books, and a reader in a library ---------- */
// a quiet room of the archive: a long case with glass doors across the frame, the books lying flat in its shelves, a cool light
function oh_paintShelf(ctx){const R=wc_rng(1401);ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,860),[226,226,220],{kind:"plaster",line:false,seed:1403});
  wc_wash(ctx,wc_rect(-40,850,W+80,300),[188,182,172],{kind:"ground",line:false,seed:1405});gv_lightGlow(ctx,960,-60,900);
  wc_part(ctx,wc_rect(60,190,1800,690),[150,112,80],1,{seed:1407,lw:1.4});
  for(let r=0;r<4;r++){const y=228+r*160;wc_flat(ctx,wc_rect(84,y,1752,130),[96,70,52],1,"trim");
    for(let x=100;x<1820;){const n=3+Math.floor(R()*4),bw=96+R()*20;for(let j=0;j<n;j++){const by=y+126-j*13;wc_flat(ctx,[[x,by],[x+bw,by],[x+bw-2,by-12],[x+2,by-12]],j%2?OH.cover:wc_dim(OH.cover,0.08),1,"page");}
      x+=bw+8+R()*10;}}
  ctx.save();ctx.globalCompositeOperation="screen";ctx.fillStyle="rgba(220,236,246,0.16)";ctx.fillRect(84,228,1752,640);ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineWidth=3;
  for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(140+i*320,240);ctx.lineTo(60+i*320,860);ctx.stroke();}ctx.restore();
  for(let i=1;i<6;i++)wc_flat(ctx,wc_rect(60+i*300-5,196,10,684),[150,112,80],1,"trim");}
// a reading room: tall windows, shelves on the right; the desk is its front layer (oh_libraryDesk), with a screen on it at the right
const OH_LB={fy:800,desk:[200,1500,756],seat:[600,0.95],screen:[960,380,520,330]};
function oh_paintLibrary(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,OH_LB.fy+40),[236,230,218],{kind:"plaster",line:false,seed:1501});
  for(const x of [80,520])gv_window(ctx,x,90,340,560,{seed:1503+x});gv_lightGlow(ctx,500,300,700);
  wc_wash(ctx,wc_rect(-40,OH_LB.fy,W+80,H-OH_LB.fy+40),[176,160,140],{kind:"ground",line:false,seed:1505});
  const sh=[250,400,550,700],R=wc_rng(1507);gv_bookcase(ctx,1520,OH_LB.fy,360,680,sh);
  for(const y of sh)for(let x=1540;x<1860;){const w=14+R()*14,h=86+R()*44;if(x+w>1862)break;wc_flat(ctx,wc_rect(x,y-h,w,h),[[150,70,58],[70,96,130],[96,120,80],[196,160,96],[120,100,130]][Math.floor(R()*5)],1,"page");x+=w+2+(R()<0.1?20:0);}}
function oh_libraryDesk(){return wc_kept("ohLibDesk",W,H,c=>{const [x0,x1,top]=OH_LB.desk;gv_deskScreen(c,OH_LB.screen[0],OH_LB.screen[1],OH_LB.screen[2],OH_LB.screen[3],top);
  wc_part(c,[[x0,top],[x1,top],[x1+30,top+40],[x0-30,top+40]],[196,160,118],1,{seed:1511,lw:1.4});wc_part(c,wc_rect(x0-30,top+40,x1-x0+60,22),[150,116,84],1,{seed:1513,lw:1.2});
  for(const lx of [x0,x1])wc_part(c,wc_rect(lx-12,top+62,24,H),[150,116,84],1,{seed:1515+lx,lw:1});});}

/* ===== Where each piece lives: the people of the opening =====
   Korea under the Joseon kings, and a reader today, drawn as the series draws people (its people.js), a warm umber wash behind each
   person of the past. At court, officials in long robes with round collars, red, blue or green by rank, a stiff belt worn loose, and
   the black hat of an official with its two flat wings; each holds a tablet at the chest. The historians, in green, sit on the floor at
   low desks and write with brushes. The office's members, the printers in short jackets with a band round the forehead, the archive's
   keepers; two scholars from the town in white robes with a cord at the waist and the wide black hat of a gentleman; a historian sent
   to air the books, in a travelling robe. Their robes have wide sleeves. Nothing they hold is written in a language: the marks are too
   small to read. Every name starts with oh or oh_. */

// ---- clothes of the Joseon court and town: the series' engine stays as it is; these wrap its torso, arms and head for their own kinds only
const oh_torso0=torso,oh_arm0=arm,oh_head0=head;
// a long robe to the ankles (kind "robe"): o.collar "round" (an official's, with a white collar inside) or "cross" (a gentleman's, the
// left side over the right, a white band along its edge); o.belt "stiff" (an official's, worn loose and low, with plates) or a cord
// (o.cord, its colour, tied with two ends hanging). A short jacket (kind "jacket"), to the hips, crossed and tied, over trousers.
torso=function(ctx,P,br,sh){const T_=P.top;if(T_.kind!=="robe"&&T_.kind!=="jacket")return oh_torso0(ctx,P,br,sh);
  const c=T_.c,sw=P.build.sh,hw=P.build.hip,y0=-448+br,robe=T_.kind==="robe",hem=robe?-34:-276,fl=robe?46:10;
  const path=()=>{ctx.beginPath();ctx.moveTo(-16,y0);ctx.bezierCurveTo(-30,y0+4,-sw+26,y0+10,-sw+12,y0+20);ctx.quadraticCurveTo(-sw-2,y0+28,-sw-2,y0+50);
    ctx.bezierCurveTo(-sw-2,y0+84,-hw-4,-352,-hw,-322);ctx.quadraticCurveTo(-hw-fl*0.5+sh*0.4,-230,-hw-fl+sh*0.5,hem);
    ctx.quadraticCurveTo(sh*0.5,hem+10,hw+fl+sh*0.5,hem);ctx.quadraticCurveTo(hw+fl*0.5+sh*0.4,-230,hw,-322);
    ctx.bezierCurveTo(hw+4,-352,sw+2,y0+84,sw+2,y0+50);ctx.quadraticCurveTo(sw+2,y0+28,sw-12,y0+20);ctx.bezierCurveTo(sw-26,y0+10,30,y0+4,16,y0);ctx.closePath();};
  path();litFill(ctx,c,-sw,y0,sw,hem);seam(ctx,c,0.5);ctx.save();path();ctx.clip();
  // the folds of the cloth, falling from the chest
  ctx.strokeStyle=rgba(darken(c,0.36),0.3);ctx.lineWidth=2.4;ctx.lineCap="round";
  for(const k of [-0.66,-0.24,0.2,0.62]){ctx.beginPath();ctx.moveTo(k*hw*0.7+sh*0.3,-370);ctx.quadraticCurveTo(k*hw*1.05+sh*0.4,-240,k*(hw+fl)*0.95+sh*0.5,hem+6);ctx.stroke();}
  ctx.strokeStyle=rgba(lighten(c,0.22),0.22);ctx.lineWidth=5;for(const k of [-0.42,0.44]){ctx.beginPath();ctx.moveTo(k*hw*0.7+sh*0.3,-360);ctx.quadraticCurveTo(k*hw+sh*0.4,-240,k*(hw+fl)*0.9+sh*0.5,hem+6);ctx.stroke();}
  const inner=T_.inner||[248,246,240];
  if(T_.collar==="round"){// a round collar standing a little off the neck, a white collar inside it, and the front's overlap running down the right side
    ctx.fillStyle=rgba(inner,1);ctx.beginPath();ctx.moveTo(-19,y0-2);ctx.quadraticCurveTo(0,y0+26,19,y0-2);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(darken(c,0.3),0.9);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-24,y0);ctx.quadraticCurveTo(0,y0+34,24,y0);ctx.stroke();
    ctx.strokeStyle=rgba(darken(c,0.4),0.55);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(20,y0+18);ctx.quadraticCurveTo(sw*0.62,y0+70,sw*0.66+sh*0.3,-330);ctx.stroke();}
  else{// a crossed collar: the left side over the right, the white band along its edge, the tie at the chest
    ctx.fillStyle=rgba(inner,1);ctx.beginPath();ctx.moveTo(-18,y0-2);ctx.lineTo(18,y0-2);ctx.lineTo(sh*0.2,y0+40);ctx.closePath();ctx.fill();
    const band=T_.band||[250,248,244];ctx.strokeStyle=rgba(band,1);ctx.lineWidth=9;ctx.lineCap="butt";ctx.beginPath();ctx.moveTo(-17,y0-1);ctx.lineTo(sh*0.2+6,y0+42);ctx.lineTo(sw*0.55+sh*0.3,y0+86);ctx.stroke();
    ctx.strokeStyle=rgba(darken(c,0.3),0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-12,y0-6);ctx.lineTo(sh*0.2+8,y0+36);ctx.moveTo(sh*0.2-2,y0+48);ctx.lineTo(sw*0.55+sh*0.3,y0+94);ctx.stroke();
    ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(19,y0-1);ctx.lineTo(sh*0.2+8,y0+38);ctx.stroke();
    if(!robe||T_.tie){const tc=T_.tie||darken(c,0.15);ctx.strokeStyle=rgba(tc,1);ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sw*0.32+sh*0.3,y0+70);ctx.quadraticCurveTo(sw*0.4,y0+110,sw*0.28+sh*0.3,y0+150);
      ctx.moveTo(sw*0.32+sh*0.3,y0+70);ctx.quadraticCurveTo(sw*0.5,y0+100,sw*0.5+sh*0.3,y0+130);ctx.stroke();}}
  if(T_.belt==="stiff"){// an official's belt: stiff, worn loose and a little low, dark with pale plates
    const bc=T_.beltC||[40,36,40];ctx.fillStyle=rgba(bc,1);ctx.beginPath();ctx.moveTo(-hw-14,-318);ctx.quadraticCurveTo(sh*0.4,-292,hw+14,-318);ctx.lineTo(hw+14,-302);ctx.quadraticCurveTo(sh*0.4,-276,-hw-14,-302);ctx.closePath();ctx.fill();
    ctx.fillStyle=rgba(T_.plate||[214,198,160],0.95);for(const k of [-0.62,-0.2,0.22,0.64]){const bx=k*hw+sh*0.4,by=-306+Math.abs(k)*-10+12;ctx.fillRect(bx-7,by-5,14,10);}}
  if(T_.cord){ctx.strokeStyle=rgba(T_.cord,1);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-hw-2,-318);ctx.quadraticCurveTo(sh*0.4,-310,hw+2,-318);ctx.stroke();
    ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(hw*0.3+sh*0.4,-314);ctx.quadraticCurveTo(hw*0.34+sh*0.45,-260,hw*0.26+sh*0.5,-206);ctx.moveTo(hw*0.36+sh*0.4,-314);ctx.quadraticCurveTo(hw*0.46+sh*0.45,-262,hw*0.44+sh*0.5,-214);ctx.stroke();
    ctx.fillStyle=rgba(T_.cord,1);for(const [x,y] of [[hw*0.26+sh*0.5,-206],[hw*0.44+sh*0.5,-214]]){ctx.beginPath();ctx.moveTo(x-5,y);ctx.lineTo(x+5,y);ctx.lineTo(x+7,y+22);ctx.lineTo(x-7,y+22);ctx.closePath();ctx.fill();}}
  if(T_.apron){ctx.fillStyle=rgba(T_.apron,0.95);ctx.beginPath();ctx.moveTo(-hw+4,-318);ctx.lineTo(hw-4,-318);ctx.lineTo(hw+6+sh*0.5,-150);ctx.quadraticCurveTo(sh*0.5,-142,-hw-6+sh*0.5,-150);ctx.closePath();ctx.fill();seam(ctx,T_.apron,0.3);}
  ctx.restore();};
// wide sleeves, for a robe: the upper arm in its sleeve, then the sleeve widening from the elbow to the cuff and hanging below the
// forearm; a jacket's sleeves are only a little wider than the arm
arm=function(ctx,P,s,a,br,po){const T_=P.top;if(T_.kind!=="robe"&&T_.kind!=="jacket")return oh_arm0(ctx,P,s,a,br,po);
  const sw=P.build.sh,sx=s*(sw-12),sy=-416+br,L1=108,L2=100,e=[sx+s*Math.sin(a[0])*L1,sy+Math.cos(a[0])*L1],d=[s*Math.sin(a[1]),Math.cos(a[1])],w=[e[0]+d[0]*L2,e[1]+d[1]*L2];
  const robe=T_.kind==="robe",c=T_.c,wu=robe?22:16,wc=robe?34:18,box=[Math.min(sx,w[0])-60,sy-40,Math.max(sx,w[0])+60,w[1]+60];
  // the side the sleeve hangs from: the forearm's underside (outwards, for an arm that hangs straight)
  let nn=[-d[1],d[0]];if(nn[1]<-0.2||(Math.abs(nn[1])<=0.2&&nn[0]*s<0))nn=[d[1],-d[0]];const u=[-nn[0],-nn[1]],drop=robe?30*(0.35+0.65*Math.abs(d[0])):0;
  limb(ctx,[[sx,sy],e],wu*2,wu*2.1,c,box);
  const p0=[e[0]+u[0]*wu,e[1]+u[1]*wu],p1=[w[0]+u[0]*wc,w[1]+u[1]*wc],p2=[w[0]+nn[0]*wc,w[1]+nn[1]*wc],p3=[e[0]+nn[0]*wu,e[1]+nn[1]*wu],
    mid=[(e[0]+w[0])/2+nn[0]*(wc+drop),(e[1]+w[1])/2+nn[1]*(wc+drop)+drop*0.7];
  const sl=()=>{ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.lineTo(p2[0],p2[1]);ctx.quadraticCurveTo(mid[0],mid[1],p3[0],p3[1]);ctx.arc(e[0],e[1],wu,Math.atan2(nn[1],nn[0]),Math.atan2(u[1],u[0]),s<0);ctx.closePath();};
  sl();litFill(ctx,c,box[0],box[1],box[2],box[3]);seam(ctx,c,0.45);
  ctx.save();sl();ctx.clip();ctx.strokeStyle=rgba(darken(c,0.35),0.28);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(e[0]+nn[0]*wu*0.4,e[1]+nn[1]*wu*0.4);ctx.quadraticCurveTo((mid[0]+e[0])/2,(mid[1]+e[1])/2,w[0]+nn[0]*wc*0.55,w[1]+nn[1]*wc*0.55);ctx.stroke();ctx.restore();
  // the cuff, a white edge where the inner sleeve shows
  ctx.strokeStyle=rgba(T_.inner||[244,240,232],robe?0.95:0.6);ctx.lineWidth=robe?5:3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(p1[0]-d[0]*3,p1[1]-d[1]*3);ctx.lineTo(p2[0]-d[0]*3,p2[1]-d[1]*3);ctx.stroke();
  const h=[w[0]+d[0]*13,w[1]+d[1]*13],ang=Math.atan2(d[1],d[0])-Math.PI/2;ctx.save();ctx.translate(h[0],h[1]);ctx.rotate(ang);
  ell(ctx,0,2,12,15);litFill(ctx,P.skin,-12,-13,12,17);seam(ctx,P.skin,0.3,1.2);ell(ctx,-s*9,-4,4.5,8,s*0.35);litFill(ctx,P.skin,-14,-12,-4,4);ctx.restore();};
// hats: an official's black hat with its two flat wings; a gentleman's wide hat of fine black horsehair, its brim see-through, tied
// under the chin; a band round the forehead, and the knot of hair on top, for those who work bareheaded
head=function(ctx,P,E,po,t){const h=P.hat;
  if(h==="samo"){// the wings stand out from the back of the hat: drawn first, behind the head
    for(const s of [-1,1]){ctx.save();ctx.translate(s*30,-94);ctx.rotate(-s*0.1);ell(ctx,s*30,0,32,13);litFill(ctx,[38,36,42],-70,-14,70,14);ctx.strokeStyle="rgba(10,10,14,0.6)";ctx.lineWidth=1.4;ctx.stroke();
      ctx.fillStyle="rgba(255,255,255,0.12)";ell(ctx,s*28,-4,20,3);ctx.fill();ctx.restore();}}
  oh_head0(ctx,P,E,po,t);
  if(h==="band"||h==="gat"){const hc=P.bandC||[44,40,44];ctx.fillStyle=rgba(hc,1);ctx.beginPath();ctx.moveTo(-45,-30);ctx.quadraticCurveTo(0,-44,45,-30);ctx.lineTo(44,-20);ctx.quadraticCurveTo(0,-34,-44,-20);ctx.closePath();ctx.fill();}
  if(h==="samo"){const k=[34,32,38];ctx.beginPath();ctx.moveTo(-46,-24);ctx.bezierCurveTo(-50,-64,-34,-80,0,-80);ctx.bezierCurveTo(34,-80,50,-64,46,-24);ctx.quadraticCurveTo(0,-36,-46,-24);ctx.closePath();litFill(ctx,k,-50,-82,50,-24);
    ctx.strokeStyle="rgba(10,10,14,0.6)";ctx.lineWidth=1.6;ctx.stroke();
    // the taller back of the hat, rising behind the front
    ctx.beginPath();ctx.moveTo(-30,-76);ctx.bezierCurveTo(-34,-112,34,-112,30,-76);ctx.closePath();litFill(ctx,k,-34,-112,34,-76);ctx.stroke();
    ctx.fillStyle="rgba(255,255,255,0.14)";ctx.beginPath();ctx.ellipse(-16,-62,12,5,-0.3,0,TAU);ctx.fill();}
  if(h==="gat"){const k=P.hatC||[30,28,32];
    // the crown, a little narrower at its flat top, and the brim, wide and see-through, with the light catching its edge
    ctx.beginPath();ctx.moveTo(-34,-44);ctx.lineTo(-30,-128);ctx.quadraticCurveTo(0,-134,30,-128);ctx.lineTo(34,-44);ctx.quadraticCurveTo(0,-38,-34,-44);ctx.closePath();ctx.fillStyle=rgba(k,0.86);ctx.fill();
    ctx.strokeStyle="rgba(10,10,14,0.7)";ctx.lineWidth=1.4;ctx.stroke();ctx.fillStyle=rgba(k,0.9);ctx.beginPath();ctx.ellipse(0,-129,30,6,0,0,TAU);ctx.fill();
    ctx.beginPath();ctx.ellipse(0,-44,112,19,0,0,TAU);ctx.fillStyle=rgba(k,0.55);ctx.fill();ctx.strokeStyle=rgba(k,0.95);ctx.lineWidth=2.2;ctx.stroke();
    ctx.strokeStyle="rgba(255,255,255,0.18)";ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,-45,104,15,0,Math.PI*1.05,Math.PI*1.95);ctx.stroke();
    ctx.strokeStyle=rgba(P.stringC||[40,36,40],0.85);ctx.lineWidth=1.6;for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*30,-40);ctx.quadraticCurveTo(s*40,10,s*14,58);ctx.stroke();}}
  if(h==="band")oh_knot(ctx,P);};
function oh_knot(ctx,P){const c=P.hair.c;ell(ctx,0,-70,15,13);litFill(ctx,c,-15,-83,15,-57);seam(ctx,c,0.4);}

// ---- poses: holding a tablet at the chest, writing with a brush at a low desk, carrying on the back, asleep sitting up ----
Object.assign(POSE,{
  oh_tablet:{L:[0.24,-2.0],R:[0.24,-2.0],feet:22,shift:0,tilt:0.0,turn:0,gaze:[0,0.4],look:0},
  oh_brush:{L:[0.3,-1.55],R:[0.42,-1.2],feet:24,shift:0,tilt:0.06,turn:0.05,gaze:[0.1,1],look:1},
  oh_brushUp:{L:[0.3,-1.55],R:[0.5,-1.62],feet:24,shift:0,tilt:0.03,turn:0.05,gaze:[0.1,1],look:1},
  oh_carry:{L:[0.5,-2.8],R:[0.5,-2.8],feet:22,shift:0,tilt:0.04,turn:0,gaze:[0,0.3],look:0},
  oh_ink:{L:[0.3,-1.5],R:[0.5,-1.0],feet:24,shift:0,tilt:0.1,turn:0.06,gaze:[0.2,1],look:1},
  oh_lay:{L:[0.55,-1.25],R:[0.55,-1.25],feet:24,shift:0,tilt:0.12,turn:0,gaze:[0,1],look:1},
  oh_lift:{L:[0.5,-2.2],R:[0.5,-2.2],feet:24,shift:0,tilt:0.0,turn:0,gaze:[0,0.6],look:1},
  oh_reach:{L:[0.2,-0.1],R:[0.8,-1.0],feet:24,shift:2,tilt:0.08,turn:0.1,gaze:[0.3,0.8],look:1},
  oh_sleep:{L:[0.3,-1.3],R:[0.3,-1.3],feet:24,shift:0,tilt:0.22,turn:0,gaze:[0,1],look:1},
  oh_watch:{L:[0.3,-1.4],R:[0.3,-1.4],feet:24,shift:0,tilt:0.0,turn:0.1,gaze:[0.3,0],look:0}
});
EXPR.oh_asleep={bi:-1,bo:0,arch:-2,eye:0.08,smile:0.1,open:0,mw:14};

// ---- who they are ----
const OH_SKIN=[[232,196,160],[226,188,152],[218,178,142],[236,202,168],[212,172,136],[228,192,158]];
const OH_RED=[166,58,52],OH_BLUE=[62,84,138],OH_GREEN=[70,120,94],OH_WHITE=[240,236,226],OH_HEMP=[222,210,184];
const oh_off=(seed,skin,c,o)=>Object.assign({name:"",role:"official",side:"",edge:GV_PAST,seed,skin,hair:{style:"bun",c:[34,30,30]},hat:"samo",
  top:{kind:"robe",collar:"round",c,belt:"stiff",inner:[246,244,236]},bottom:{c:[60,56,60]},shoe:[30,28,30],build:{sh:76,hip:66,h:1.0}},o||{});
Object.assign(PEOPLE,{
  // the officials at court, two rows of four, in the colours of their ranks; some bearded
  ohO1:oh_off(201,OH_SKIN[0],OH_RED,{beard:[200,198,194]}),ohO2:oh_off(202,OH_SKIN[1],OH_RED,{beard:[60,52,48]}),
  ohO3:oh_off(203,OH_SKIN[2],OH_BLUE),ohO4:oh_off(204,OH_SKIN[3],OH_BLUE,{beard:[150,146,142]}),
  ohO5:oh_off(205,OH_SKIN[4],OH_BLUE,{beard:[44,38,36]}),ohO6:oh_off(206,OH_SKIN[5],OH_GREEN),
  ohO7:oh_off(207,OH_SKIN[1],OH_GREEN,{beard:[70,62,58]}),ohO8:oh_off(208,OH_SKIN[3],OH_GREEN),
  // the two historians, young, in green
  ohH1:oh_off(211,OH_SKIN[3],OH_GREEN,{role:"historian",build:{sh:72,hip:64,h:0.98}}),ohH2:oh_off(212,OH_SKIN[0],mix(OH_GREEN,[90,130,110],0.4),{role:"historian",build:{sh:72,hip:64,h:0.99}}),
  // the office that makes the annals: four members round its table
  ohS1:oh_off(221,OH_SKIN[2],OH_RED,{role:"member of the office",beard:[214,212,208]}),ohS2:oh_off(222,OH_SKIN[0],OH_BLUE,{role:"member of the office",beard:[80,70,64]}),
  ohS3:oh_off(223,OH_SKIN[4],OH_BLUE,{role:"member of the office"}),ohS4:oh_off(224,OH_SKIN[5],OH_GREEN,{role:"member of the office"}),
  // the printers, in short jackets of hemp, sleeves a little wide, a band round the forehead
  ohPr1:{name:"",role:"printer",side:"",edge:GV_PAST,seed:231,skin:[214,170,132],hair:{style:"bun",c:[30,28,28]},hat:"band",bandC:[236,232,220],
    top:{kind:"jacket",c:OH_HEMP,tie:[196,180,150],inner:[236,228,210]},bottom:{c:[208,198,174]},shoe:[150,130,100],build:{sh:74,hip:62,h:0.98}},
  ohPr2:{name:"",role:"printer",side:"",edge:GV_PAST,seed:232,skin:[222,180,142],hair:{style:"bun",c:[40,36,34]},hat:"band",bandC:[60,56,60],beard:[50,44,42],
    top:{kind:"jacket",c:[198,186,160],tie:[170,150,120],inner:[236,228,210]},bottom:{c:[196,186,164]},shoe:[150,130,100],build:{sh:76,hip:64,h:1.0}},
  // the archive's keepers
  ohK1:{name:"",role:"keeper of the archive",side:"",edge:GV_PAST,seed:241,skin:[210,166,128],hair:{style:"bun",c:[34,30,30]},hat:"band",bandC:[70,64,66],
    top:{kind:"jacket",c:[176,160,132],tie:[140,120,96],inner:[230,222,204]},bottom:{c:[186,172,146]},shoe:[130,110,84],build:{sh:76,hip:64,h:1.0}},
  ohK2:{name:"",role:"keeper of the archive",side:"",edge:GV_PAST,seed:242,skin:[220,176,138],hair:{style:"bun",c:[60,54,52]},hat:"band",bandC:[230,226,214],beard:[90,82,76],
    top:{kind:"jacket",c:[206,194,166],tie:[160,140,110],inner:[236,228,210]},bottom:{c:[190,178,152]},shoe:[130,110,84],build:{sh:74,hip:62,h:0.98}},
  // the two scholars of the town who saved Jeonju's copy, An Ui and Son Hong-rok, older men, in white, with the wide black hat
  ohAn:{name:"An Ui",role:"scholar",side:"",edge:GV_PAST,seed:251,skin:[222,184,150],hair:{style:"bun",c:[150,146,142]},beard:[206,204,200],hat:"gat",
    top:{kind:"robe",collar:"cross",c:OH_WHITE,cord:[70,90,140],band:[255,255,252],inner:[250,248,244]},bottom:{c:[226,222,212]},shoe:[60,54,50],build:{sh:72,hip:64,h:0.97}},
  ohSon:{name:"Son Hong-rok",role:"scholar",side:"",edge:GV_PAST,seed:252,skin:[214,174,140],hair:{style:"bun",c:[80,74,70]},beard:[110,104,98],hat:"gat",
    top:{kind:"robe",collar:"cross",c:[232,228,216],cord:[150,70,60],band:[255,255,252],inner:[250,248,244]},bottom:{c:[220,216,206]},shoe:[60,54,50],build:{sh:74,hip:64,h:0.99}},
  // a historian sent to air the books, in a travelling robe and the wide hat
  ohAir:{name:"",role:"historian",side:"",edge:GV_PAST,seed:261,skin:[228,190,156],hair:{style:"bun",c:[36,32,32]},hat:"gat",
    top:{kind:"robe",collar:"cross",c:[96,110,136],cord:[60,50,48],band:[240,238,232],inner:[244,240,232]},bottom:{c:[90,96,108]},shoe:[50,44,40],build:{sh:74,hip:64,h:1.0}},
  // today: a reader in a library
  ohReader:{name:"",role:"reader",side:"",edge:[236,232,226],seed:271,skin:[236,204,174],hair:{style:"long",c:[30,26,28]},glasses:[60,56,62],
    top:{kind:"cardigan",c:[150,170,150],inner:[244,240,232]},bottom:{c:[60,64,80]},shoe:[50,44,44],build:{sh:64,hip:58,h:0.94}}
});

// ---- things they hold, in the figure's own units ----
// an official's tablet, held upright at the chest
function oh_heldTablet(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+6);
  cx.fillStyle=rgba([238,226,196],1);rr(cx,-9,-66,18,96,7);cx.fill();cx.strokeStyle="rgba(120,100,70,0.6)";cx.lineWidth=1.4;cx.stroke();cx.restore();fingers(cx,P_,[l,r]);}
// a brush in the right hand, its tip dark with ink (wet: how much ink is on it)
function oh_heldBrush(cx,P_,hands){const r=hands[1];cx.save();cx.translate(r[0],r[1]);cx.rotate(0.2);cx.fillStyle=rgba([170,130,80],1);cx.fillRect(-3,-70,6,76);
  cx.fillStyle=rgba([40,36,36],1);cx.beginPath();cx.moveTo(-5,6);cx.lineTo(5,6);cx.lineTo(0,26);cx.closePath();cx.fill();cx.restore();fingers(cx,P_,[r]);}
// a sheet, held up in both hands, its columns of marks
function oh_heldSheet(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+50);cx.fillStyle=rgba(OH.paper,1);cx.fillRect(-80,-56,160,120);
  cx.strokeStyle="rgba(120,110,90,0.5)";cx.lineWidth=1.2;cx.strokeRect(-80,-56,160,120);oh_marks(cx,-66,-44,132,96,9,0.75,271);cx.restore();fingers(cx,P_,[l,r]);}
// a stack of books, carried in both hands
function oh_heldStack(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;oh_bookStack(cx,mx,my+30,150,6);fingers(cx,P_,[l,r]);}
// a book, held open in both hands
function oh_heldBook(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-20);
  for(const s of [-1,1]){cx.fillStyle=rgba(OH.paper,1);cx.beginPath();cx.moveTo(0,-50);cx.lineTo(s*96,-56);cx.lineTo(s*96,30);cx.lineTo(0,36);cx.closePath();cx.fill();cx.strokeStyle="rgba(120,110,90,0.5)";cx.lineWidth=1.2;cx.stroke();
    oh_marks(cx,s>0?10:-86,-44,76,68,6,0.7,281+s);}cx.restore();fingers(cx,P_,[l,r]);}

// ---- sitting on the floor ----
// someone sitting on the floor, their robe spread round them: the figure cut at the hips, which sit fy above the floor's line at the
// person's place, and the robe's skirt over the cut (its colour the robe's); o: the person's options
function oh_floorSit(ctx,id,x,fy,s,o){o=o||{};const P_=PEOPLE[id],k=s*P_.build.h,hip=fy-64*k,c=P_.top.c;
  ctx.save();ctx.beginPath();ctx.rect(-W,-H*2,3*W,hip+16*k+H*2);ctx.clip();person(ctx,id,x,hip+322*k,s,Object.assign({shadow:false},o));ctx.restore();
  const hw=P_.build.hip*k,L=[];for(let i=0;i<=20;i++){const a=Math.PI+i/20*Math.PI,r=1+0.06*Math.sin(i*1.7);L.push([x+Math.cos(a)*hw*2.1*r,fy-6*k+Math.sin(a)*58*k*(0.75+0.25*Math.abs(Math.cos(a)))]);}
  L.push([x+hw*2.25,fy+4*k],[x-hw*2.25,fy+4*k]);
  ctx.save();ctx.fillStyle="rgba(80,70,60,0.18)";ctx.beginPath();ctx.ellipse(x,fy+6*k,hw*2.4,16*k,0,0,TAU);ctx.fill();ctx.restore();
  ctx.save();wc_tr(ctx,L);ctx.fillStyle=rgba(c,1);ctx.fill();const g=ctx.createLinearGradient(0,fy-60*k,0,fy);g.addColorStop(0,rgba(lighten(c,0.12),0.6));g.addColorStop(1,rgba(darken(c,0.25),0.5));ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle=rgba(darken(c,0.5),0.5);ctx.lineWidth=1.6;ctx.stroke();ctx.strokeStyle=rgba(darken(c,0.35),0.3);ctx.lineWidth=2;for(const u of [-0.5,0.1,0.6]){ctx.beginPath();ctx.moveTo(x+u*hw,fy-50*k);ctx.quadraticCurveTo(x+u*hw*1.4,fy-24*k,x+u*hw*1.8,fy);ctx.stroke();}ctx.restore();}
// a low desk for writing, on the floor: its top at fy-th, legs to the floor; centred on x, w wide (all in frame units)
function oh_lowDesk(ctx,x,fy,w,th,seed){const t=th*0.16;wc_part(ctx,[[x-w/2,fy-th],[x+w/2,fy-th],[x+w/2-6,fy-th+t],[x-w/2+6,fy-th+t]],OH.maru,1,{seed,lw:1.2});
  for(const s of [-1,1]){wc_part(ctx,[[x+s*w*0.44-6,fy-th+t],[x+s*w*0.44+6,fy-th+t],[x+s*w*0.44+8,fy],[x+s*w*0.44-8,fy]],OH.maruDk,1,{seed:seed+s,lw:1});}
  wc_flat(ctx,wc_rect(x-w*0.44,fy-th+t,w*0.88,t*0.6),OH.maruDk,1,"trim");}
// columns of marks, too small to read, written top to bottom and right to left: in [x, y, w, h], n columns; p, how many are written
// columns of writing, right to left, too small to read: p of the n columns written, the last one part way down; each column its own
// random marks, so a column never changes as the next is written. Returns where the brush last wrote, [x, y]
function oh_marks(ctx,x,y,w,h,n,p,seed){const cw=w/n,pp=clamp(p==null?1:p,0,1),full=Math.floor(pp*n+1e-6),f=pp*n-full;let last=null;
  ctx.save();ctx.fillStyle=ctx.strokeStyle=rgba(OH.ink,0.82);ctx.lineCap=ctx.lineJoin="round";
  for(let i=0;i<Math.min(n,full+1);i++){if(i===full&&f<=0.001)break;const R=wc_rng((seed||3)*131+i*7919),cx=x+w-cw*(i+0.5);let yy=y+R()*cw*0.3;
    const end=y+h*(0.86+R()*0.14),stop=i<full?end:yy+(end-yy)*f;
    while(yy<stop){const s=cw*(0.5+R()*0.2);if(s<7)ctx.fillRect(cx-s/2,yy,s,s*(0.5+R()*0.5));
      // big enough to see: a loose brush line and a dot, as handwriting looks from a step away; no letter of any script
      else{const th=Math.max(1,s*0.13),k=2+Math.floor(R()*2),N=k*6;let px=cx-s*0.45+R()*s*0.5,py=yy+R()*s*0.25,lx=px,ly=py,q=0;
        // the brush presses at the start and lifts off: each piece of the line a little thinner
        for(let j=0;j<k;j++){const bx=cx-s*0.5+R()*s,by=yy+R()*s*0.9,ex=cx-s*0.45+R()*s*0.9,ey=yy+s*(j+1)/k*(0.75+R()*0.25);
          for(let u=1;u<=6;u++){const v=u/6,a=(1-v)*(1-v),b=2*(1-v)*v,c=v*v,nx=a*px+b*bx+c*ex,ny=a*py+b*by+c*ey;
            ctx.lineWidth=Math.max(0.8,th*(1.35-0.95*q/N));ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(nx,ny);ctx.stroke();lx=nx;ly=ny;q++;}
          px=ex;py=ey;}
        if(R()<0.4){ell(ctx,cx-s*0.3+R()*s*0.6,yy+R()*s*0.8,s*0.09,s*0.065,R()*3);ctx.fill();}}
      last=[cx,yy+s*0.8];yy+=s*1.25;}}
  ctx.restore();return last;}

/* ===== Where each piece lives: what moves in the opening =====
   The court's officials and historians, the office and its printers at work, the books laid in their chests, the archives pinned on
   paper as small views (smoke over three of them, chests landing on the five, the gold lines from Jeonju's copy), the road in 1592,
   Jeonju's archive, the scholars and the keepers carrying the chests up the mountain, the cave by night, the books aired in the sun,
   the shelf and the reader today. What doesn't move is painted once (plan.js); what does is drawn here every frame, kept as a sprite
   when it's painted in watercolour, so a frame stays quick. Every name starts with oh_ or OH. */

// ---- sprites: a thing painted once, then drawn where it is ----
function oh_sprite(key,w,h,fn){return wc_kept("ohS:"+key,Math.round(w),Math.round(h),fn);}
// a chest, centred on x with its foot on y, at size s (oh_chest's); o.open (0 to 1) lifts its lid; o.dark, in a cave; o.seal, the paper
// seal across its lid
function oh_chestAt(ctx,x,y,s,o){o=o||{};const op=o.open||0,k=op<0.25?0:op<0.75?0.5:1,w=Math.round(220*s+40),h=Math.round(200*s+30),
    c=oh_sprite(["chest",s,k,o.dark?1:0,o.seal?1:0].join("|"),w,h,q=>{oh_chest(q,w/2,h-6,s,{open:k,dark:o.dark,seed:7});if(o.seal)oh_seal(q,w/2,h-6-120*s,s);});
  ctx.drawImage(c,x-w/2,y-h+6);}
// the seal: a strip of paper down over the lid's edge, its marks, and a red stamp across the join
function oh_seal(ctx,x,y,s){wc_part(ctx,wc_rect(x-16*s,y-10*s,32*s,62*s),OH.paper,1,{seed:91,lw:0.9});oh_marks(ctx,x-10*s,y-4*s,20*s,48*s,2,1,93);
  ctx.save();ctx.fillStyle=rgba([196,52,44],0.85);ctx.fillRect(x-12*s,y+14*s,24*s,22*s);ctx.restore();}
// a stack of bound books lying flat, seen from the front a little above: covers of yellow-brown paper, stitched at the spine
function oh_bookStack(ctx,x,y,w,n,o){o=o||{};const bh=Math.max(4,w*0.09),c=o.col||OH.cover;ctx.save();
  for(let i=0;i<n;i++){const yy=y-i*bh,dx=Math.sin(i*2.3)*w*0.02;ctx.fillStyle=rgba(i%2?c:wc_dim(c,0.06),1);ctx.fillRect(x-w/2+dx,yy-bh,w,bh-1);
    ctx.fillStyle=rgba(OH.paper,0.9);ctx.fillRect(x-w/2+dx+w*0.04,yy-bh*0.62,w*0.92,bh*0.3);ctx.fillStyle=rgba([150,60,50],0.7);for(const k of [0.2,0.45,0.7])ctx.fillRect(x-w/2+dx+w*k,yy-bh,2,bh-1);}
  ctx.fillStyle=rgba(wc_lit(c,0.12),1);ctx.fillRect(x-w/2,y-n*bh-w*0.18,w,w*0.18);ctx.strokeStyle=rgba(wc_dim(c,0.4),0.6);ctx.lineWidth=1.2;ctx.strokeRect(x-w/2,y-n*bh-w*0.18,w,w*0.18);ctx.restore();}

// ---- the court: the officials in two rows down the hall, the historians at their desks at the left ----
// o.write: how far the historians' sheets are written (0 to 1)
function oh_courtDesks(){return wc_kept("ohCourtDesks",W*2,H*2,q=>{q.scale(2,2);OH_HIST.forEach(([X,Z],i)=>{const Zd=Z-0.5,[dx,dy]=oh_ctP(X+0.1,0,Zd),k=OH_CT.f/Zd;
  oh_lowDesk(q,dx,dy,0.95*k,0.34*k,301+i);const [ix,iy]=oh_ctP(X+0.45,0.34,Zd+0.12);wc_part(q,wc_rect(ix-0.08*k,iy-0.03*k,0.16*k,0.05*k),[60,60,66],1,{seed:305+i,lw:0.8});});});}
function oh_court(x,tt,o){o=o||{};const C=OH_CT,P=oh_ctP,L=[];x.drawImage(oh_placeHi("court"),0,0,W,H);
  OH_ROWS.forEach(([X,Z],i)=>L.push([Z,()=>{const [px,py]=P(X,0,Z);person(x,"ohO"+(i+1),px,py,1.62*C.f/Z/560,{pose:"oh_tablet",t:tt+i*0.9,flip:X>0,carry:oh_heldTablet});}]));
  OH_HIST.forEach(([X,Z],i)=>L.push([Z,()=>{const [px,py]=P(X,0,Z),s=1.62*C.f/Z/560,up=Math.sin(tt*1.7+i*2)>0.6;
    oh_floorSit(x,"ohH"+(i+1),px,py,s,{pose:up?"oh_brushUp":"oh_brush",t:tt+i*1.3,flip:false,carry:oh_heldBrush});}]));
  L.sort((a,b)=>b[0]-a[0]).forEach(e=>e[1]());x.drawImage(oh_courtDesks(),0,0,W,H);
  // the sheets on the desks, written as the line goes on
  OH_HIST.forEach(([X,Z],i)=>{const Zd=Z-0.5,a=P(X-0.2,0.345,Zd+0.18),b=P(X+0.25,0.345,Zd+0.18),c=P(X+0.25,0.345,Zd-0.05),d=P(X-0.2,0.345,Zd-0.05);
    x.fillStyle=rgba(OH.paper,1);x.beginPath();[a,b,c,d].forEach(([px,py],j)=>j?x.lineTo(px,py):x.moveTo(px,py));x.closePath();x.fill();
    const w=b[0]-a[0],p=o.write==null?0.5:o.write;x.save();x.fillStyle=rgba(OH.ink,0.55);const n=6,m=Math.round(n*p);for(let k=0;k<m;k++){const cx=b[0]-w*(k+0.5)/n;x.fillRect(cx-1,c[1]-2,2,-(c[1]-a[1])*0.7);}x.restore();});}
// close, from above: a historian's sheet on the low desk, columns of marks written top to bottom and right to left as p goes from 0 to 1,
// the brush in a hand in a green sleeve, the inkstone beside it
const OH_WR={x:520,y:150,w:760,h:640,n:9};
function oh_paintDeskTop(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),OH.maru,{kind:"plaster",line:false,seed:331});
  ctx.save();ctx.strokeStyle=rgba(OH.maruDk,0.35);ctx.lineWidth=2;for(let i=0;i<14;i++){const y=40+i*80+Math.sin(i)*10;ctx.beginPath();ctx.moveTo(-20,y);ctx.bezierCurveTo(600,y+16,1200,y-12,W+20,y+6);ctx.stroke();}ctx.restore();
  const R=OH_WR;ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(70,46,26,0.3)";ctx.fillRect(R.x+16,R.y+20,R.w,R.h);ctx.restore();wc_part(ctx,wc_rect(R.x,R.y,R.w,R.h),OH.hanji,1,{seed:333,lw:1});
  // the inkstone, dark, with its well, and a water dropper; a rest for the brush
  wc_part(ctx,wc_rrPts(1420,320,300,420,30),[70,70,78],1,{seed:335,lw:1.2});wc_flat(ctx,wc_rrPts(1450,350,240,120,24),[24,24,30],1,"trim");wc_flat(ctx,wc_rrPts(1450,490,240,220,20),[48,48,56],1,"trim");
  wc_part(ctx,wc_ell(1560,860,70,56,24),[96,140,150],1,{seed:337,lw:1.1});wc_part(ctx,wc_rect(200,820,240,30),[120,80,56],1,{seed:339,lw:1});}
function oh_writeClose(x,tt,p,o){o=o||{};const R=OH_WR;x.drawImage(gv_place("deskTop"),0,0,W,H);const pp=clamp(p,0,1),done=pp>=1;
  const last=oh_marks(x,R.x+40,R.y+50,R.w-80,R.h-100,R.n,pp,o.seed||341)||[R.x+R.w-80,R.y+70];
  // the brush's point on the mark it's writing, moving a little; lifted off the page when it's done
  const tx=last[0]+(done?18:Math.sin(tt*9)*4),ty=last[1]+(done?30:Math.cos(tt*7)*4);
  oh_hand(x,tx,ty,o.sleeve||OH_GREEN,done);}
// the writer's right hand from above, the arm coming in from below, as if we look over the writer's shoulder: the brush held upright, its
// point at (tx, ty); the robe's wide sleeve, its white cuff
function oh_hand(x,tx,ty,sc,lifted){x.save();x.translate(tx,ty);x.rotate(-0.42);
  if(lifted){x.save();x.filter="blur(6px)";x.fillStyle="rgba(40,30,20,0.18)";x.beginPath();x.ellipse(-10,6,10,6,0,0,TAU);x.fill();x.restore();x.translate(14,-26);}
  // the sleeve, wide and soft, out past the frame's edge
  const sl=[[-62,168],[-90,320],[-150,620],[-210,1000],[300,1000],[220,620],[150,320],[84,170]];wc_wash(x,sl,sc,{kind:"robe",line:true,lw:1.2,seed:351});
  x.save();wc_tr(x,sl);x.clip();x.strokeStyle=rgba(darken(sc,0.3),0.45);x.lineWidth=5;x.lineCap="round";
  for(const [a0,a1] of [[-20,-60],[40,30],[96,130]]){x.beginPath();x.moveTo(a0,200);x.quadraticCurveTo((a0+a1)/2+16,480,a1,900);x.stroke();}
  const g=x.createLinearGradient(-200,0,300,0);g.addColorStop(0,rgba(wc_lit(sc,0.25),0.35));g.addColorStop(0.5,rgba(sc,0));g.addColorStop(1,rgba(darken(sc,0.35),0.35));x.fillStyle=g;x.fillRect(-260,150,620,900);x.restore();
  // the white cuff of the inner robe
  x.fillStyle=rgba([246,242,232],1);x.beginPath();x.moveTo(-58,150);x.quadraticCurveTo(12,136,80,152);x.lineTo(86,178);x.quadraticCurveTo(12,164,-64,176);x.closePath();x.fill();
  x.strokeStyle=rgba([150,140,124],0.6);x.lineWidth=1.5;x.stroke();
  // the brush: wet black point, bamboo shaft
  x.fillStyle=rgba([22,20,22],1);x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(-9,22,-7,46);x.lineTo(7,46);x.quadraticCurveTo(9,22,0,0);x.fill();
  x.fillStyle=rgba([196,170,112],1);x.fillRect(-7,44,14,10);x.fillStyle=rgba([150,112,66],1);x.fillRect(-6,54,12,128);x.fillStyle=rgba([120,86,50],0.8);x.fillRect(-6,118,12,3);
  // the hand: the back of it, the knuckles round the shaft, the thumb on the near side
  const sk=OH_SKIN[3];x.beginPath();x.ellipse(10,126,46,50,0.15,0,TAU);litFill(x,sk,-36,76,56,176);x.strokeStyle=rgba(darken(sk,0.35),0.5);x.lineWidth=1.6;x.stroke();
  x.beginPath();x.ellipse(-34,104,15,24,-0.5,0,TAU);litFill(x,sk,-50,80,-18,128);x.stroke();
  for(const [fx,fy,r] of [[22,86,15],[38,102,14],[46,122,13]]){x.beginPath();x.ellipse(fx,fy,r,r*0.8,0.4,0,TAU);litFill(x,sk,fx-r,fy-r,fx+r,fy+r);x.stroke();}
  x.strokeStyle=rgba(darken(sk,0.3),0.4);x.lineWidth=2;for(const [fx,fy] of [[4,104],[16,118],[22,138]]){x.beginPath();x.moveTo(fx-10,fy+6);x.quadraticCurveTo(fx,fy,fx+10,fy+8);x.stroke();}
  x.restore();}

// ---- the office that makes the annals: four members behind the long table, with the historians' notes ----
const OH_OFS=[["ohS1",520,"oh_lift",oh_heldSheet],["ohS2",820,"oh_brush",oh_heldBrush],["ohS3",1110,"oh_watch",null],["ohS4",1400,"oh_lay",null]];
function oh_office(x,tt,o){o=o||{};x.drawImage(gv_place("annalsOffice"),0,0,W,H);
  OH_OFS.forEach(([id,px,pose,carry],i)=>oh_floorSit(x,id,px,690,0.9,{pose:o.pose&&o.pose(i)||pose,t:tt+i,flip:i>=2,carry}));x.drawImage(oh_officeTable(),0,0,W,H);}

// ---- the printers: the block inked, a sheet laid on it and rubbed, lifted to the pile ----
// o.pile: how many printed sheets are on the pile; o.source (0 to 1): Jeonju's copy, open on a stand at the left, glowing gold
function oh_print(x,tt,o){o=o||{};x.drawImage(gv_place("print"),0,0,W,H);const B=OH_PR.bench,ph=((tt*0.42)%1+1)%1,
    p1=ph<0.35?"oh_ink":ph<0.6?"oh_lay":"oh_reach",p2=ph<0.55?"oh_watch":"oh_lift";
  // they sit on the floor at the low bench, as printers did
  x.save();x.beginPath();x.rect(-W,-H,3*W,B[2]+H);x.clip();oh_floorSit(x,"ohPr1",900,760,0.95,{pose:p1,t:tt,flip:false});
  oh_floorSit(x,"ohPr2",1240,760,0.95,{pose:p2,t:tt+1,flip:true,carry:p2==="oh_lift"?oh_heldSheet:null});x.restore();x.drawImage(oh_printBench(),0,0,W,H);
  // a sheet on the block while it's printed; the pile
  if(ph>0.4&&ph<0.72){const [r0,r1,ry]=OH_PR.tray;x.fillStyle=rgba(OH.paper,0.96);x.fillRect(r0+8,ry-2,r1-r0-16,22);}
  const [q0,q1]=OH_PR.pile,n=Math.round(o.pile==null?6:o.pile);for(let i=0;i<n;i++){x.fillStyle=rgba(i%2?OH.paper:wc_dim(OH.paper,0.05),1);x.fillRect(q0+(i%3),B[2]+10-i*3,q1-q0,3);}
  if(n){x.save();x.fillStyle=rgba(OH.ink,0.35);for(let k=0;k<6;k++)x.fillRect(q0+16+k*24,B[2]+12-n*3-14,10,10);x.restore();}
  const sa=clamp(o.source||0,0,1);if(sa>0.01){withA(x,sa,()=>{x.save();x.globalCompositeOperation="screen";wc_glowAt(x,330,560,260,[255,214,120],0.6);x.restore();
    x.fillStyle=rgba(OH.woodDk,1);x.fillRect(250,600,160,14);x.fillRect(318,614,24,150);
    for(const s of [-1,1]){x.fillStyle=rgba(OH.paper,1);x.beginPath();x.moveTo(330,596);x.lineTo(330+s*110,586);x.lineTo(330+s*110,500);x.lineTo(330,508);x.closePath();x.fill();
      x.strokeStyle=rgba(OH.coverDk,0.8);x.lineWidth=2;x.stroke();oh_marks(x,s>0?342:228,516,88,64,5,1,351+s);}});}}

// ---- the books laid in four chests, each set the same ----
// o.fill(i): how full chest i is (0 to 1); the keepers lay the books in, one chest after another
const OH_CH=[330,750,1170,1590];
function oh_chestOpen(ctx,x,y,s,fill,seed){const w=200*s,h=110*s,d=h*0.5,c=OH.chest;
  // the lid, standing open behind; the opening, dark, the books' top cover rising in it; then the front
  ctx.fillStyle=rgba(wc_dim(c,0.1),1);ctx.fillRect(x-w/2,y-h-d-h*0.7,w,h*0.7);ctx.fillStyle=rgba(OH.brass,1);ctx.fillRect(x-w/2,y-h-d-h*0.7,16*s,16*s);ctx.fillRect(x+w/2-16*s,y-h-d-h*0.7,16*s,16*s);
  ctx.fillStyle=rgba([36,26,20],1);ctx.beginPath();ctx.moveTo(x-w/2,y-h);ctx.lineTo(x+w/2,y-h);ctx.lineTo(x+w/2-8*s,y-h-d);ctx.lineTo(x-w/2+8*s,y-h-d);ctx.closePath();ctx.fill();
  const f=clamp(fill,0,1);if(f>0.01){const rise=lerp(d*0.2,d*0.9,f);ctx.save();ctx.beginPath();ctx.moveTo(x-w/2,y-h);ctx.lineTo(x+w/2,y-h);ctx.lineTo(x+w/2-8*s,y-h-d);ctx.lineTo(x-w/2+8*s,y-h-d);ctx.closePath();ctx.clip();
    ctx.fillStyle=rgba(OH.cover,1);ctx.fillRect(x-w/2+10*s,y-h-rise,w-20*s,rise-4*s);ctx.fillStyle=rgba(wc_dim(OH.cover,0.25),0.8);for(let i=1;i<4;i++)ctx.fillRect(x-w/2+10*s,y-h-rise+i*(rise/4),w-20*s,1.5);
    ctx.fillStyle=rgba([150,60,50],0.7);for(const k of [0.25,0.5,0.75])ctx.fillRect(x-w/2+w*k,y-h-rise,2,rise-4*s);ctx.restore();}
  ctx.drawImage(oh_sprite("chestFront"+s,w+20,h+20,q=>{wc_part(q,wc_rect(10,10,w,h),c,1,{seed,lw:1.1});wc_flat(q,wc_rect(10,10,w,h*0.18),wc_dim(c,0.2),1,"trim");
    for(const [cx,cy] of [[10,10],[10+w-18*s,10],[10,10+h-20*s],[10+w-18*s,10+h-20*s]])wc_flat(q,wc_rect(cx,cy,18*s,20*s),OH.brass,1,"trim");wc_flat(q,wc_rect(10+w/2-14*s,10+h*0.22,28*s,30*s),OH.brass,1,"trim");}),x-w/2-10,y-h-10);}
function oh_chests(x,tt,o){o=o||{};x.drawImage(gv_place("chestRoom"),0,0,W,H);const fill=o.fill||(()=>1);
  // the keepers between the chests, books in their arms
  [["ohK1",540],["ohK2",1380]].forEach(([id,px],k)=>person(x,id,px,800,0.82,{pose:"oh_lay",t:tt+k,flip:k===1,carry:oh_heldStack}));
  OH_CH.forEach((cx,i)=>oh_chestOpen(x,cx,880,1.25,fill(i),361+i));}

// ---- the archives, pinned on paper as small views ----
// The sheet is the place "board"; each view hangs on it at [x, y] (its middle), at scale k, with its name on a tag under it. o.views: the
// keys shown; o.a(k): each view's strength (0 to 1); o.smoke(k), o.dim(k): smoke over a view, and how dark it's gone; o.lit(k): a warm
// glow round a view; o.chest(k): a chest landing on it (0 to 1); o.gold (0 to 1): the gold lines from Jeonju's copy, in the middle, to
// each of the five, round it (o.ring); t, for the smoke
const OH_VIEWS={capital:[700,270,0.82,"the capital"],chungju:[1220,300,0.82,"Chungju"],seongju:[1250,640,0.82,"Seongju"],jeonju:[660,650,0.82,"Jeonju"]};
const OH_VIEWS5={capital:[430,470,1.0,"the capital"],odae:[1060,250,0.78,"Mount Odae"],taebaek:[1500,250,0.78,"Mount Taebaek"],myohyang:[1060,650,0.78,"Mount Myohyang"],mani:[1500,650,0.78,"Mount Mani"]};
const OH_VIEWS5R={capital:[400,290,0.66,"the capital"],myohyang:[960,180,0.62,"Mount Myohyang"],odae:[1520,290,0.66,"Mount Odae"],mani:[430,700,0.66,"Mount Mani"],taebaek:[1490,700,0.66,"Mount Taebaek"]};
function oh_viewAt(ctx,k,V,a,o){o=o||{};if(a<=0.01)return;const [cx,cy,s,name]=V[k],w=OH_VW*s,h=OH_VH*s,u=spring(clamp(a,0,1)),kk=0.9+0.1*u;
  ctx.save();ctx.translate(cx,cy);ctx.scale(kk,kk);withA(ctx,clamp(a*2,0,1),()=>{const lit=clamp(o.lit||0,0,1);if(lit>0.01){ctx.save();ctx.globalCompositeOperation="multiply";const g=ctx.createRadialGradient(0,0,w*0.3,0,0,w*0.85);
      g.addColorStop(0,rgba(wc_lit(GV.gold,0.3),0.9*lit));g.addColorStop(1,rgba(wc_lit(GV.gold,0.3),0));ctx.fillStyle=g;ctx.fillRect(-w,-h,2*w,2*h);ctx.restore();}
    ctx.fillStyle="rgba(60,44,30,0.2)";ctx.fillRect(-w/2+8,-h/2+10,w,h);ctx.drawImage(oh_view(k),-w/2,-h/2,w,h);
    const dm=clamp(o.dim||0,0,1);if(dm>0.01){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([120,96,84],0.75*dm);ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();}
    gv_pin(ctx,0,-h/2+12,GV.red,1.1);wc_tag(ctx,0,h/2+40,name,{align:"center",size:30});});ctx.restore();}
function oh_board(x,tt,o){o=o||{};x.drawImage(gv_place("board"),0,0,W,H);const V=o.ring?OH_VIEWS5R:o.five?OH_VIEWS5:OH_VIEWS,f=(fn,k)=>fn==null?0:typeof fn==="function"?fn(k):fn;
  // the gold lines from Jeonju's copy, under the views
  const gd=clamp(o.gold||0,0,1);if(gd>0.01){Object.keys(V).forEach((k,i)=>{const [vx,vy]=V[k],u=clamp(gd*1.6-i*0.15,0,1);if(u<=0.01)return;x.save();x.strokeStyle=rgba(GV.gold,0.9);x.lineWidth=7;x.lineCap="round";
    x.beginPath();x.moveTo(960,540);x.lineTo(lerp(960,vx,easeCam(u)),lerp(540,vy,easeCam(u)));x.stroke();x.restore();});}
  Object.keys(V).forEach(k=>{oh_viewAt(x,k,V,o.a?o.a(k):1,{dim:f(o.dim,k),lit:f(o.lit,k)});const sm=f(o.smoke,k);if(sm>0.01){const [vx,vy,s]=V[k];oh_smoke(x,vx,vy+OH_VH*s*0.2,260*s,tt,sm,{seed:k.length*7});}
    const ch=f(o.chest,k);if(ch>0.01){const [vx,vy,s]=V[k],drop=(1-easeCam(clamp(ch*1.4,0,1)))*-120;withA(x,clamp(ch*3,0,1),()=>oh_chestAt(x,vx+OH_VW*s*0.32,vy+OH_VH*s*0.42+drop,0.42));}});
  if(gd>0.01||o.copy){const a=Math.max(gd>0.01?1:0,clamp(o.copy||0,0,1));withA(x,a,()=>{x.save();x.globalCompositeOperation="screen";wc_glowAt(x,960,540,200,[255,214,120],0.7*a);x.restore();
    oh_bookStack(x,960,600,200,6);wc_tag(x,960,680,"Jeonju's copy",Object.assign({align:"center",size:30},OH_GOLDTAG));});}}
// smoke rising from a place: soft puffs that billow up and drift, dark near the fire, paler as they rise; x, y its foot, h how high it goes
function oh_smoke(ctx,x,y,h,t,a,o){o=o||{};const R=wc_rng(o.seed||5),n=14;ctx.save();
  ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,h*0.35,[255,150,70],0.45*a);ctx.globalCompositeOperation="source-over";
  for(let i=0;i<n;i++){const ph=((t*0.12+i/n+R()*0.05)%1+1)%1,yy=y-ph*h,xx=x+Math.sin(ph*3+i)*h*0.08+ph*h*0.25,r=h*(0.08+ph*0.22),al=a*(1-ph)*0.55;
    const g=ctx.createRadialGradient(xx,yy,0,xx,yy,r);g.addColorStop(0,rgba(mix([70,64,64],[150,146,146],ph),al));g.addColorStop(1,rgba([150,146,146],0));ctx.fillStyle=g;ctx.fillRect(xx-r,yy-r,2*r,2*r);}ctx.restore();}

// ---- not even a king: the sealed chest, close, and a hand in a red sleeve that reaches for it and stops ----
function oh_paintSealRoom(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,560),[214,198,170],{kind:"plaster",line:false,seed:371});
  wc_wash(ctx,wc_rect(-40,520,W+80,H),OH.maru,{kind:"ground",line:false,seed:373});ctx.save();ctx.strokeStyle=rgba(OH.maruDk,0.4);ctx.lineWidth=2;for(let i=0;i<8;i++){const y=540+i*i*9+i*14;ctx.beginPath();ctx.moveTo(-40,y);ctx.lineTo(W+40,y);ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(120,-40,60,580),OH.wood,1,{seed:375,lw:1.2});wc_part(ctx,wc_rect(1740,-40,60,580),OH.wood,1,{seed:376,lw:1.2});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,700,200,900,[255,240,206],0.3);ctx.restore();
  oh_chest(ctx,960,900,3.4,{seed:377});oh_seal(ctx,960,900-120*3.4,3.4);}
// reach: 0 to 1, the hand comes in and stops short of the seal; back: 0 to 1, it draws away
function oh_kingHand(x,reach,back){const r=easeCam(clamp(reach,0,1))*(1-easeCam(clamp(back,0,1))),hx=lerp(2200,1140,r),hy=lerp(260,380,r),c=[176,42,40];if(r<=0.01)return;
  x.save();x.beginPath();x.moveTo(hx+40,hy-50);x.lineTo(hx+900,hy-260);x.lineTo(hx+960,hy+80);x.lineTo(hx+60,hy+60);x.closePath();litFill(x,c,hx,hy-200,hx+700,hy+80);x.strokeStyle=rgba(darken(c,0.5),0.5);x.lineWidth=2;x.stroke();
  x.strokeStyle=rgba([226,184,90],0.95);x.lineWidth=12;x.beginPath();x.moveTo(hx+46,hy-46);x.lineTo(hx+64,hy+58);x.stroke();
  // the hand, open, fingers out towards the seal; they curl a little as it stops
  const curl=clamp((reach-0.85)/0.15,0,1)*0.5;x.translate(hx,hy);x.beginPath();x.ellipse(0,0,46,36,0.1,0,TAU);litFill(x,OH_SKIN[1],-46,-36,46,36);seam(x,OH_SKIN[1],0.3,1.4);
  for(let i=0;i<4;i++){const a=Math.PI+0.25-i*0.17+curl;x.beginPath();x.ellipse(Math.cos(a)*60,Math.sin(a)*40+i*6-10,30,10,a,0,TAU);litFill(x,OH_SKIN[1],-90,-50,0,40);seam(x,OH_SKIN[1],0.3,1.2);}
  x.restore();}

// ---- 1592: men marching up the road from the pass, and smoke beyond the hills ----
// u0: where the column's head is along the road (1, the pass; 0, the foot of the frame); they come on as t goes
function oh_march(x,tt,u0,a){if(a<=0.01)return;withA(x,a,()=>{const n=26;for(let i=n-1;i>=0;i--){const u=1-(u0+0)+i*0.022;if(u<0.32||u>1)continue;
  const [px,py,w]=oh_roadAt(u),s=w/240,ph=tt*5+i*1.3,sw=Math.sin(ph),lane=(i%3-1)*w*0.22,cx=px+lane,col=[64,58,58];
  x.save();x.translate(cx,py);x.scale(s,s);x.fillStyle=rgba(col,0.92);x.strokeStyle=rgba(col,0.92);x.lineCap="round";
  x.lineWidth=16;x.beginPath();x.moveTo(-8,-90);x.lineTo(-8+sw*14,-4);x.moveTo(8,-90);x.lineTo(8-sw*14,-4);x.stroke();
  x.beginPath();x.moveTo(-22,-180);x.lineTo(22,-180);x.lineTo(26,-86);x.lineTo(-26,-86);x.closePath();x.fill();x.beginPath();x.arc(0,-204,20,0,TAU);x.fill();
  x.lineWidth=4;x.beginPath();x.moveTo(30,-60);x.lineTo(30,-300);x.stroke();x.beginPath();x.moveTo(30,-316);x.lineTo(24,-298);x.lineTo(36,-298);x.closePath();x.fill();x.restore();}});}

// ---- Jeonju's archive: the chests in its open bay ----
function oh_jeonju(x,tt,o){o=o||{};x.drawImage(oh_placeHi("archive"),0,0,W,H);const [bx,by,bw,bh]=oh_archiveBay();
  x.save();x.globalCompositeOperation="screen";wc_glowAt(x,bx+bw/2,by+bh*0.7,bw*0.7,[255,214,150],0.35);x.restore();
  for(const [dx,dy,s] of [[0.3,0.94,0.3],[0.7,0.94,0.3],[0.5,0.62,0.28]])oh_chestAt(x,bx+bw*dx,by+bh*dy,s);
  if(o.cast)o.cast(x);}

// ---- what would be gone: a page of the annals, open, close ----
function oh_paintBook(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),[96,70,52],{kind:"plaster",line:false,seed:381});
  ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(30,20,10,0.45)";ctx.fillRect(250,130,1440,800);ctx.restore();
  wc_part(ctx,wc_rect(230,110,1460,800),OH.cover,1,{seed:383,lw:1.4});
  for(const s of [-1,1]){const x0=s<0?260:968,w=692;wc_part(ctx,wc_rect(x0,130,w,760),OH.hanji,1,{seed:385+s,lw:1});
    ctx.save();ctx.strokeStyle=rgba([170,70,60],0.55);ctx.lineWidth=2;ctx.strokeRect(x0+40,170,w-80,680);for(let i=1;i<10;i++){ctx.beginPath();ctx.moveTo(x0+40+(w-80)*i/10,170);ctx.lineTo(x0+40+(w-80)*i/10,850);ctx.stroke();}ctx.restore();
    oh_marks(ctx,x0+44,180,w-88,660,10,1,387+s);}
  ctx.save();const g=ctx.createLinearGradient(900,0,1020,0);g.addColorStop(0,"rgba(60,40,20,0)");g.addColorStop(0.5,"rgba(60,40,20,0.3)");g.addColorStop(1,"rgba(60,40,20,0)");ctx.fillStyle=g;ctx.fillRect(900,130,120,760);ctx.restore();}

// ---- into the mountains: the two scholars lead, the keepers carry the chests on frames on their backs, up the path towards us ----
// each walker: [id, where along the path at t0 (0, the brow; 1, the foot of the frame), a chest on the back?]
function oh_walkers(x,tt,list,v,o){o=o||{};list.map(([id,u0,load],i)=>[id,clamp(u0+v*tt,0,1.05),load,i]).sort((a,b)=>a[1]-b[1]).forEach(([id,u,load,i])=>{if(u<0.02||u>1.04)return;
  const [px,py]=oh_pathAt(Math.min(u,1)),s=oh_pathW(Math.min(u,1))/420,sw=Math.sin(tt*5.2+i*1.7),bob=Math.abs(sw)*6*s,yy=py+(u>1?(u-1)*600:0);
  if(load){// the frame's two poles, and the chest on it, behind the bearer, showing over the shoulders
    x.save();x.strokeStyle=rgba(OH.woodDk,1);x.lineWidth=Math.max(2,11*s);x.lineCap="round";for(const k of [-1,1]){x.beginPath();x.moveTo(px+k*70*s,yy-600*s-bob);x.lineTo(px+k*58*s,yy-170*s-bob);x.stroke();}x.restore();
    oh_chestAt(x,px,yy-430*s-bob,0.95*s*1.6);}
  person(x,id,px,yy-bob,s,{pose:load?"oh_carry":"stand",pose2:sw>0?"walkA":"walkB",mix:Math.abs(sw)*(load?0.5:0.8),t:tt+i,flip:i%2===1});
  if(load){x.save();x.strokeStyle=rgba([120,96,70],1);x.lineWidth=Math.max(1.5,7*s);for(const k of [-1,1]){x.beginPath();x.moveTo(px+k*40*s,yy-470*s-bob);x.quadraticCurveTo(px+k*58*s,yy-420*s-bob,px+k*50*s,yy-330*s-bob);x.stroke();}x.restore();}});}

// ---- the cave by night: the fire, one keeps watch while the other sleeps, in turns ----
// o.swap (0 to 1): they change over; o.snow: winter, snow falling
function oh_fire(x,tt,cx,cy,s){x.save();x.globalCompositeOperation="screen";wc_glowAt(x,cx,cy-40*s,700*s,[255,150,60],0.55);wc_glowAt(x,cx,cy-30*s,260*s,[255,196,110],0.7);x.restore();
  x.fillStyle=rgba([70,50,40],1);for(const k of [-1,1]){x.save();x.translate(cx,cy);x.rotate(k*0.3);x.fillRect(-90*s,-8*s,180*s,16*s);x.restore();}
  for(let i=0;i<7;i++){const ph=tt*3.1+i*1.9,h=(90+30*Math.sin(ph))*s*(1-Math.abs(i-3)/5),w=(26-Math.abs(i-3)*3)*s,fx=cx+(i-3)*16*s+Math.sin(ph*1.3)*6*s;
    x.fillStyle=rgba(i%2?[255,170,70]:[255,214,120],0.9);x.beginPath();x.moveTo(fx-w,cy-6*s);x.quadraticCurveTo(fx-w*0.6,cy-h*0.6,fx+Math.sin(ph)*8*s,cy-h);x.quadraticCurveTo(fx+w*0.6,cy-h*0.6,fx+w,cy-6*s);x.closePath();x.fill();}
  for(let i=0;i<5;i++){const ph=((tt*0.6+i*0.21)%1),sx=cx+Math.sin(i*3+tt)*30*s,sy=cy-60*s-ph*260*s;x.fillStyle=rgba([255,200,120],(1-ph)*0.8);x.fillRect(sx,sy,3*s,3*s);}}
function oh_cave(x,tt,o){o=o||{};x.drawImage(gv_place(o.snow?"caveSnow":"cave"),0,0,W,H);const [fx,fy]=OH_CV.fire,sw=clamp(o.swap||0,0,1),m=easeCam(clamp((sw-0.3)/0.4,0,1));
  [["ohAn",0],["ohSon",1]].forEach(([id,i])=>{const [sx,sy]=OH_CV.seats[i],asleep=i===0?1-m:m;
    oh_floorSit(x,id,sx,sy,0.88,{pose:"oh_watch",pose2:"oh_sleep",mix:asleep,expr:asleep>0.5?"oh_asleep":"calm",t:tt+i,flip:i===1});});
  oh_fire(x,tt,fx,fy,1);
  // the fire lights them warm on its side
  x.save();x.globalCompositeOperation="screen";for(const [sx,sy] of OH_CV.seats)wc_glowAt(x,lerp(sx,fx,0.35),sy-220,260,[255,170,90],0.22);x.restore();
  if(o.snow){x.save();x.fillStyle="rgba(240,244,252,0.85)";for(let i=0;i<120;i++){const R=(i*9301+49297)%233280/233280,sx=((R*W+tt*24*(0.5+R))%W+W)%W,sy=((i*97+tt*(60+R*50))%H+H)%H;x.beginPath();x.arc(sx,sy,1.4+R*2.2,0,TAU);x.fill();}x.restore();}}

// ---- the books aired in the sun, and the historian writing down what he finds ----
// o.books (0 to 1): how many are laid open on the racks; o.list: how far his list is written
function oh_openBook(ctx,x,y,w){const h=w*0.42;ctx.fillStyle="rgba(60,44,30,0.18)";ctx.fillRect(x-w/2+4,y-h+6,w,h);for(const s of [-1,1]){ctx.fillStyle=rgba(OH.paper,1);ctx.beginPath();ctx.moveTo(x,y-h+2);ctx.lineTo(x+s*w/2,y-h);
  ctx.lineTo(x+s*w/2,y);ctx.lineTo(x,y+2);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(OH.coverDk,0.7);ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle=rgba(OH.ink,0.35);
  for(let k=1;k<4;k++)ctx.fillRect(x+s*w*k/8-1,y-h*0.8,2,h*0.6);}}
function oh_airing(x,tt,o){o=o||{};x.drawImage(gv_place("airing"),0,0,W,H);const nb=clamp(o.books==null?1:o.books,0,1),tot=OH_AI.racks.length*6;let k=0;
  OH_AI.racks.forEach(([rx,ry,rw])=>{for(let j=0;j<6;j++){if(k++>=Math.round(nb*tot))return;oh_openBook(x,rx-rw/2+rw*(j+0.5)/6,ry-12,rw/7.2);}});
  // a keeper bringing out more books, the historian at his mat with a low desk, writing
  const kx=lerp(700,880,(Math.sin(tt*0.5)+1)/2);person(x,"ohK1",kx,700,0.7,{pose:"oh_carry",t:tt,flip:false});oh_bookStack(x,kx,700-380*0.7,60,4);
  const [mx,my]=OH_AI.mat;oh_floorSit(x,"ohAir",mx,my-20,0.82,{pose:Math.sin(tt*1.6)>0.5?"oh_brushUp":"oh_brush",t:tt,carry:oh_heldBrush});
  x.drawImage(oh_sprite("airDesk",300,140,q=>oh_lowDesk(q,150,130,260,100,391)),mx-150,my+40-130);
  x.fillStyle=rgba(OH.paper,1);x.fillRect(mx-70,my-66,140,14);}

// ---- today: the reader at the library's screen, a page of the annals on it ----
function oh_reading(x,tt,o){o=o||{};x.drawImage(gv_place("library"),0,0,W,H);const [sx,sy,sw,sh]=OH_LB.screen;
  gv_behind(x,"ohReader",OH_LB.seat[0],OH_LB.desk[2],OH_LB.seat[1],{pose:"listen",t:tt,flip:false});x.drawImage(oh_libraryDesk(),0,0,W,H);
  gv_screen(x,sx,sy,sw,sh,null,q=>{q.fillStyle=rgba([238,240,244],1);q.fillRect(sx,sy,sw,40);q.fillStyle=rgba([255,255,255],1);rr(q,sx+70,sy+10,sw-140,20,10);q.fill();
    const k=clamp(o.page==null?1:o.page,0,1);withA(q,k,()=>{q.fillStyle=rgba(OH.hanji,1);q.fillRect(sx+40,sy+60,sw-80,sh-80);q.strokeStyle=rgba([170,70,60],0.5);q.lineWidth=1.5;q.strokeRect(sx+56,sy+74,sw-112,sh-108);
      oh_marks(q,sx+60,sy+80,sw-120,sh-118,12,1,401);});},{bar:[238,240,244],barH:40});}

/* ===== Where each piece lives: the university =====
   The university's rooms as the series paints them (its rooms.js): the planner's desk in the Faculty of Business, the data team's room,
   Planning's room, the platform team's desk, Yusuf's desk from above, Noor's room, the floor where the work is done; and what's on them:
   the table's page on the data platform, the planner's request, the calendar, the seven places Yusuf counts, the night's check and what
   it puts right. Every name starts with oh_ or OH. */

/* ---------- moments, tags and the corner pill (Who does what, end to end's, in this film's own names) ---------- */
// small type, drawn on purpose as part of a picture, that the legibility check (tools/legible.py) leaves out: it reads PH_OFF, the name the
// From words to data tools give it
let PH_OFF=0;
// fn draws with each word fading as the frame comes to cut it, from 30 px inside the frame's edge to gone at it, so the frame never cuts
// a word, as the playbook asks (A capability, not a project's cp_fadeCut). blocks: [x0, y0, x1, y1] where ctx is now, each a card's lines;
// a word in one fades with the whole block, so a card never shows half its words
function oh_fadeCut(ctx,fn,blocks){const T0=T,cw=ctx.canvas.width,ch=ctx.canvas.height,r=30*cw/1920,M=ctx.getTransform(),
    Bk=(blocks||[]).map(([x0,y0,x1,y1])=>[M.a*x0+M.e,M.d*y0+M.f,M.a*x1+M.e,M.d*y1+M.f]);
  T=(c,s2,x,y,o)=>{o=o||{};const sz=o.size||24,w=tw(c,String(s2),sz,o.w,o.f),al=o.align||"left",x0=al==="center"?x-w/2:al==="right"?x-w:x,m=c.getTransform();
    let l=1e9,rt=-1e9,tp=1e9,bt=-1e9;for(const [px,py] of [[x0,y-0.75*sz],[x0+w,y-0.75*sz],[x0,y+0.2*sz],[x0+w,y+0.2*sz]]){const X=m.a*px+m.c*py+m.e,Y=m.b*px+m.d*py+m.f;
      l=Math.min(l,X);rt=Math.max(rt,X);tp=Math.min(tp,Y);bt=Math.max(bt,Y);}
    const mx=(l+rt)/2,my=(tp+bt)/2,b=Bk.find(([a,q,e,d])=>mx>=a-6&&mx<=e+6&&my>=q-6&&my<=d+6);if(b){l=Math.min(l,b[0]);tp=Math.min(tp,b[1]);rt=Math.max(rt,b[2]);bt=Math.max(bt,b[3]);}
    const a=clamp(Math.min(l/r,(cw-rt)/r,tp/r,(ch-bt)/r),0,1);if(a>=0.99)return T0(c,s2,x,y,o);if(a>0.01)withA(c,a,()=>T0(c,s2,x,y,o));};
  try{return fn();}finally{T=T0;}}
// the block a card's lines make, for oh_fadeCut: L centred on cx, the first on y, lh apart
function oh_block(ctx,L,cx,y,lh,sz,w){const m=Math.max(...L.map(l=>tw(ctx,l,sz,w)));return[cx-m/2,y-0.75*sz,cx+m/2,y+(L.length-1)*lh+0.2*sz];}
// made once per chapter, the first time it draws: its cues are known by then
const oh_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a tag that springs in at t0 and goes at t1 (or stays)
function oh_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// a gold tag: governance's colour, for the word the story follows
const OH_GOLDTAG={wash:GV.gold,washA:0.55,col:GV.goldInk};
// the place and the time in the top corner, changing at the times given ([[t, words], ...]; null words: no pill), the old one fading as the
// new comes in
function oh_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1&&mk[i-1][1])wc_year(ctx,56,72,mk[i-1][1],a*(1-u));if(mk[i][1])wc_year(ctx,56,72,mk[i][1],a*u);}
// a name card: the name, and the role under it
function oh_nameCard(ctx,cx,cy,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60),h=104,k=0.92+0.08*spring(clamp(a,0,1));
  ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);withA(ctx,clamp(a*2,0,1),()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:Math.round(cx)});
    wc_T(ctx,name,0,-h/2+44,{w:800,size:32,align:"center",col:WC_DARK});wc_T(ctx,role,0,-h/2+82,{w:600,size:28,align:"center",col:WC_MUTED});});ctx.restore();}
// a sheet of paper over the whole frame, for the shots drawn on paper (the ring, the year's list)
function oh_paper(x){x.fillStyle=rgba(WC_PAPER,1);x.fillRect(-W,-H,3*W,3*H);}
// a paper on the desk, seen from above, at (x, y), its size, tipped; drawn through fn in its own coordinates (A capability, not a
// project's cp_onPaper)
function oh_onPaper(ctx,x,y,w,h,rot,fn,o){o=o||{};ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot||0);ctx.fillStyle="rgba(60,44,30,0.22)";ctx.fillRect(-w/2+10,-h/2+12,w,h);
  wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:o.seed||Math.round(x+y),wash:o.wash,washA:o.washA||0.2});ctx.translate(-w/2,-h/2);fn(ctx);ctx.restore();}
// a smooth path through points (Catmull-Rom), as a polyline of n points to a span; and the point a fraction u along a polyline
function oh_smooth(P,n){n=n||12;const out=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
  for(let k=0;k<n;k++){const u=k/n,u2=u*u,u3=u2*u;out.push([0,1].map(j=>0.5*(2*p1[j]+(-p0[j]+p2[j])*u+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*u2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*u3)));}}
  out.push(P[P.length-1]);return out;}
function oh_along(pts,u){let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
  let left=L*clamp(u,0,1);for(let i=1;i<pts.length;i++){if(left<=seg[i-1]||i===pts.length-1){const v=seg[i-1]?clamp(left/seg[i-1],0,1):0;return[lerp(pts[i-1][0],pts[i][0],v),lerp(pts[i-1][1],pts[i][1],v)];}left-=seg[i-1];}
  return pts[0];}
// Clara's request, small and bright as it travels: a gold card with three lines on it, a soft glow round it (o.held: no glow)
function oh_flyCard(ctx,x,y,s,rot,a,o){if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);withA(ctx,a,()=>{
  if(!(o&&o.held)){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,0,0,150,[255,222,120],0.95);wc_glowAt(ctx,0,0,80,[255,240,190],0.8);ctx.restore();}ctx.fillStyle="rgba(60,44,30,0.22)";ctx.fillRect(-54,-36,120,84);
  wc_panel(ctx,-60,-42,120,84,{kind:"card",seed:753,wash:GV.gold,washA:0.5});gv_lines(ctx,-42,-16,84,3,18,1);});ctx.restore();}
// a screen drawn as the screen close is (GV_SC, 1260 x 690), scaled into a smaller screen's box; its words are too small to read there,
// so they're decoration (Teachers of data's tt_onScreen)
function oh_onScreen(ctx,box,fn){const [sx,sy,sw,sh]=box,k=sw/GV_SC[2];ctx.save();ctx.translate(sx-GV_SC[0]*k,sy+(sh-GV_SC[3]*k)/2-GV_SC[1]*k);ctx.scale(k,k);
  ctx.beginPath();ctx.rect(GV_SC[0],GV_SC[1],GV_SC[2],GV_SC[3]);ctx.clip();const p=PH_OFF;PH_OFF=1;try{fn(ctx);}finally{PH_OFF=p;ctx.restore();}}
// a pen lying at an angle, its point at (x, y) (A product with an owner's, in this film's own name)
function oh_pen(ctx,x,y,a,rot){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot==null?0.62:rot);ctx.fillStyle="rgba(60,44,30,0.2)";ctx.fillRect(22,14,210,16);
  ctx.fillStyle=rgba([196,200,210],1);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(26,-7);ctx.lineTo(26,7);ctx.closePath();ctx.fill();ctx.fillStyle=rgba(GV_SIGN.ink,1);ctx.fillRect(0.5,-1.2,7,2.4);
  ctx.fillStyle=rgba([44,56,104],1);rr(ctx,24,-9,190,18,8);ctx.fill();ctx.fillStyle=rgba([206,176,92],1);ctx.fillRect(150,-9,8,18);ctx.fillStyle=rgba([90,104,160],0.7);ctx.fillRect(30,-6,170,3);ctx.restore();});}

/* ---------- 1 · the same with data: a home, and its copies ---------- */
// The table's owner, at home in the data team's repository (a card with a house mark), and three copies made from it one way (the
// table's page on the data platform, the catalogue, a dashboard), each saying where it came from; a gold arrow out to each as it's made
// (o.way, 0 to 1), the home lit (o.home), a tick on each as it's checked (o.check(i))
const OH_DC={home:[200,330,600,300],copies:[[1160,140],[1160,380],[1160,620]],cw:600,ch:180,names:["the table's page","the catalogue","a dashboard"]};
function oh_house(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=rgba([255,253,246],0.95);ctx.strokeStyle=rgba(WC_DARK,0.8);ctx.lineWidth=2.6;ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(-16,-2);ctx.lineTo(0,-16);ctx.lineTo(16,-2);ctx.lineTo(16,16);ctx.lineTo(-16,16);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(-5,16);ctx.lineTo(-5,5);ctx.lineTo(5,5);ctx.lineTo(5,16);ctx.stroke();ctx.restore();}
function oh_tick(ctx,x,y,u){if(u<=0.01)return;const k=0.7+0.3*spring(clamp(u,0,1));ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(u*2,0,1),()=>{ctx.fillStyle=rgba(GV.green,0.95);
  ctx.beginPath();ctx.arc(0,0,26,0,TAU);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=6;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-11,1);ctx.lineTo(-3,10);ctx.lineTo(13,-9);ctx.stroke();});ctx.restore();}
function oh_arrow(ctx,a,b,p,o){o=o||{};if(p<=0.01)return;const e=[lerp(a[0],b[0],p),lerp(a[1],b[1],p)],an=Math.atan2(b[1]-a[1],b[0]-a[0]);ctx.save();ctx.strokeStyle=rgba(o.col||GV.gold,o.a==null?0.95:o.a);
  ctx.lineWidth=o.lw||7;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();ctx.setLineDash([]);
  // the head travels with the line's end, so a flow's way is clear while it's drawn
  if(p>0.05){const L=(o.head||22)*clamp(p/0.25,0.4,1);ctx.beginPath();ctx.moveTo(e[0]-Math.cos(an-0.5)*L,e[1]-Math.sin(an-0.5)*L);ctx.lineTo(e[0],e[1]);ctx.lineTo(e[0]-Math.cos(an+0.5)*L,e[1]-Math.sin(an+0.5)*L);ctx.stroke();}ctx.restore();}
function oh_dataCopies(x,tt,o){o=o||{};oh_paper(x);const D=OH_DC,[hx,hy,hw,hh]=D.home,hl=clamp(o.home||0,0,1);
  if(hl>0.01){x.save();x.globalCompositeOperation="multiply";const g=x.createRadialGradient(hx+hw/2,hy+hh/2,hw*0.3,hx+hw/2,hy+hh/2,hw*0.8);g.addColorStop(0,rgba(wc_lit(GV.gold,0.3),0.9*hl));g.addColorStop(1,rgba(wc_lit(GV.gold,0.3),0));
    x.fillStyle=g;x.fillRect(hx-hw,hy-hh,hw*3,hh*3);x.restore();}
  wc_panel(x,hx,hy,hw,hh,{kind:"card",seed:501,wash:GV.gold,washA:0.2});oh_house(x,hx+hw-40,hy+40,1.1);
  wc_T(x,"the data team's repository",hx+36,hy+62,{w:800,size:30,col:WC_MUTED});x.fillStyle=rgba(WC_PENCIL,0.4);x.fillRect(hx+36,hy+84,hw-72,2);
  wc_T(x,"Learners near an award",hx+36,hy+150,{w:800,size:34,col:WC_DARK});wc_T(x,"owner: Clara Jensen",hx+36,hy+210,{w:800,size:34,col:GV.goldInk});
  D.copies.forEach(([cx,cy],i)=>{const w=o.way==null?1:clamp(o.way*1.5-i*0.25,0,1);oh_arrow(x,[hx+hw+10,hy+hh/2],[cx-14,cy+D.ch/2],w);
    withA(x,lerp(0.3,1,clamp((w-0.7)/0.3,0,1)),()=>{wc_panel(x,cx,cy,D.cw,D.ch,{kind:"card",dashed:true,seed:511+i});wc_T(x,D.names[i],cx+30,cy+52,{w:800,size:30,col:WC_MUTED});
      wc_T(x,"owner: Clara Jensen",cx+30,cy+104,{w:800,size:32,col:WC_DARK});if(w>0.95)wc_T(x,"from the repository",cx+30,cy+150,{w:800,size:28,col:GV.goldInk});});
    oh_tick(x,cx+D.cw-40,cy+40,o.check?o.check(i):0);});}

/* ---------- the people this film adds, and the floor ---------- */
// the planner in the Faculty of Business, who asks to read Planning's product
PEOPLE.ohPlanner={name:"",role:"Planner, Faculty of Business",side:"Business",does:"uses",edge:BIZ,seed:83,
  skin:[176,124,92],hair:{style:"bun",c:[40,30,28]},earrings:[255,214,140],
  top:{kind:"blazer",c:[52,104,96],inner:[238,234,226]},bottom:{c:[50,52,64]},shoe:[44,34,30],build:{sh:66,hip:62,h:0.95}};
// who works in which room of the floor, and how (Who does what, end to end's ee_floor, in this film's own names)
const OH_AT={clara:0,mei:1,yusuf:2,jun:3,sam:4},OH_WORK={clara:{pose:"reach"},mei:{pose:"reach"},yusuf:{pose:"write",carry:heldNotebook},jun:{pose:"reach"},sam:{pose:"reach"}};
function oh_floor(x,tt,o){o=o||{};const F=GV_FL;if(o.under)o.under(x);Object.keys(OH_AT).forEach(id=>{const i=OH_AT[id];if((o.out||[]).includes(id))return;
    person(x,id,F.spot(i),806,0.5,Object.assign({pose:"stand",t:tt+i,flip:i%2===1},OH_WORK[id],(o.pose||{})[id]||{}));});
  if(o.extra)o.extra(x);gv_floorGlass(x);const m=x.getTransform(),vl=-m.e/m.a,vr=(x.canvas.width-m.e)/m.a,a=o.names==null?1:o.names;
  F.rooms.forEach((r,i)=>{const cx=F.x(i)+F.w/2,hw=tw(x,r[1],30,800)/2+6;gv_floorName(x,i,a*clamp(Math.min(cx-hw-vl,vr-cx-hw)/30,0,1));});}
// the screen on each room's desk lit with a page (a(i), 0 to 1): a band at its head in col (or col(i), each room's own), lines under it
const oh_floorScr=i=>{const F=GV_FL,x=F.x(i),dx=i%2?x+20:x+F.w-190;return[dx+56,F.inner-206];};
function oh_floorScreens(ctx,a,col){GV_FL.rooms.forEach((r,i)=>{const u=clamp(a(i),0,1);if(u<=0.01)return;const [sx,sy]=oh_floorScr(i),cl=typeof col==="function"?col(i):col;
  withA(ctx,u,()=>{ctx.fillStyle=rgba([252,252,248],1);ctx.fillRect(sx,sy,80,50);ctx.fillStyle=rgba(cl||GV.gold,0.95);ctx.fillRect(sx,sy,80,10);ctx.fillStyle=rgba(WC_MUTED,0.6);
    for(let l=0;l<3;l++)ctx.fillRect(sx+8,sy+18+l*10,l===0?56:44,4);ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,sx+40,sy+25,70,[255,214,140],0.6*u);ctx.restore();});});}
// night over the whole frame (a, 0 to 1: the blue of a dark office); dawn (0 to 1) lifts it with a warm light from low down
function oh_night(ctx,a,dawn){a=clamp(a,0,1)*(1-0.85*clamp(dawn||0,0,1));if(a<=0.01&&!(dawn>0.01))return;ctx.save();ctx.setTransform(1,0,0,1,0,0);const cw=ctx.canvas.width,ch=ctx.canvas.height;
  if(a>0.01){ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(mix([255,255,255],[74,86,132],a),1);ctx.fillRect(0,0,cw,ch);}
  const d=clamp(dawn||0,0,1)*(1-clamp(((dawn||0)-0.6)/0.4,0,1));if(d>0.01){ctx.globalCompositeOperation="screen";const g=ctx.createLinearGradient(0,ch,0,0);
    g.addColorStop(0,rgba([255,186,120],0.3*d));g.addColorStop(0.6,rgba([255,214,160],0.1*d));g.addColorStop(1,rgba([255,214,160],0));ctx.fillStyle=g;ctx.fillRect(0,0,cw,ch);}
  ctx.restore();}

/* ---------- 2 · nine days ---------- */
// the data platform's page for the table, as the screen close shows it (GV_SC): its name, its owner, a button to ask to read it.
// o.owner (default "Jun Park"); o.swap (0 to 1): the owner's name turns, like a card, to o.to; o.from (0 to 1): "· from the repository"
// after it, gold; o.hand (0 to 1): "typed by hand · when the table was built", grey, under it; o.ownerLit, o.amber, o.green: a glow round the
// owner's line; o.typed (0 to 1): someone typing the owner's name into it, with a caret; o.press (0 to 1): the button pressed; o.why,
// o.until (0 to 1): what she types; o.sent (0 to 1): her request, under the page, "request · waiting" (or o.sentText)
const OH_PG={lab:410,title:196,owner:292,hand:348,ask:[410,392,250,62],val:560,why:520,until:584,sent:[410,624,460,64]};
function oh_tablePage(ctx,t,o){o=o||{};const [x,y,w,h]=GV_SC,G=OH_PG;
  gv_screen(ctx,x,y,w,h,"the data platform",q=>{
    wc_T(q,"Learners near an award",G.lab,G.title,{w:800,size:52,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.4);q.fillRect(G.lab,G.title+22,w-160,2);
    const nm0=o.owner||"Jun Park",nm1=o.to||"Clara Jensen",sw=clamp(o.swap||0,0,1),ty=o.typed==null?1:clamp(o.typed,0,1),
      nm=(sw<0.5?nm0:nm1).slice(0,Math.ceil((sw<0.5?nm0:nm1).length*ty)),ow=tw(q,"owner: ",36,600),nw=tw(q,nm,36,800),fr=clamp(o.from||0,0,1);
    for(const [k,col] of [["ownerLit",GV.gold],["amber",GV.amber],["green",GV.green]])oh_halo(q,G.lab-8,G.owner-40,ow+Math.max(nw,60)+16,54,o[k]||0,col);
    wc_T(q,"owner:",G.lab,G.owner,{w:600,size:36,col:WC_MUTED});
    const fl=Math.abs(Math.cos(Math.PI*sw));q.save();q.translate(0,G.owner-12);q.scale(1,Math.max(0.03,fl));q.translate(0,-(G.owner-12));wc_T(q,nm,G.lab+ow,G.owner,{w:800,size:36,col:WC_DARK});q.restore();
    if(ty<1&&Math.sin(t*14)>-0.4){q.fillStyle=rgba(WC_DARK,0.85);q.fillRect(G.lab+ow+nw+4,G.owner-29,3,35);}
    if(fr>0.01)withA(q,fr,()=>wc_T(q,"· from the repository",G.lab+ow+tw(q,nm1,36,800)+14,G.owner,{w:600,size:32,col:GV.goldInk}));
    const hd=clamp(o.hand||0,0,1);if(hd>0.01)withA(q,hd,()=>wc_T(q,"typed by hand · when the table was built",G.lab,G.hand,{w:600,size:30,col:GV.greyInk}));
    const [bx,by,bw,bh]=G.ask,pr=clamp(o.press||0,0,1);wc_panel(q,bx,by+3*pr,bw,bh,{kind:"pill",wash:mix([110,140,190],[60,84,130],pr),washA:0.85,seed:771});
    wc_T(q,"Ask to read",bx+bw/2,by+bh/2+11+3*pr,{w:800,size:30,align:"center",col:[255,255,255]});
    const typed=(s,tx,ty,u,op)=>{if(u<=0.01)return;const n=Math.ceil(s.length*u),sub=s.slice(0,n);wc_T(q,sub,tx,ty,op);
      if(u<1){const cw=tw(q,sub,op.size,op.w);q.fillStyle=rgba(WC_DARK,0.8);q.fillRect(tx+cw+4,ty-op.size*0.78,3,op.size*0.95);}};
    const wy=clamp(o.why||0,0,1),ut=clamp(o.until||0,0,1);
    if(wy>0.01||ut>0.01){withA(q,clamp(Math.max(wy,ut)*4,0,1),()=>{wc_T(q,"why",G.lab,G.why,{w:600,size:30,col:WC_MUTED});wc_T(q,"until",G.lab,G.until,{w:600,size:30,col:WC_MUTED});
      q.fillStyle=rgba(WC_PENCIL,0.25);q.fillRect(G.val,G.why+12,640,2);q.fillRect(G.val,G.until+12,640,2);});
      typed("to plan next year's courses",G.val,G.why,wy,{w:600,size:32,col:WC_INK});typed("30 June",G.val,G.until,ut,{w:600,size:32,col:WC_INK});}
    const se=clamp(o.sent||0,0,1);if(se>0.01){const [sx,sy,sw_,sh]=G.sent;oh_land(q,se,sx+sw_/2,sy+sh/2,()=>{wc_panel(q,sx,sy,sw_,sh,{kind:"pill",wash:o.sentCol||GV.grey,washA:0.4,seed:781});
      wc_T(q,o.sentText||"request · waiting",sx+28,sy+sh/2+11,{w:700,size:30,col:o.sentInk||GV.greyInk});});}});}
// the planner's request held: a gold card, as it flies (Who does what, end to end's ee_heldReq)
function oh_heldReq(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-26);cx.rotate(-0.05);oh_flyCard(cx,0,0,0.92,0,1,{held:true});cx.restore();fingers(cx,P_,[l,r]);}
// the requests on Jun's desk, a pile of small cards seen edge on, the planner's gold one near the bottom (o.out: it's been taken out)
function oh_pile(ctx,x,y,o){o=o||{};const R=wc_rng(801),n=13,gi=2;
  for(let i=0;i<n;i++){const dx=(R()-0.5)*18,rot=(R()-0.5)*0.1,yy=y-i*8;if(i===gi&&o.out)continue;ctx.save();ctx.translate(x+dx,yy);ctx.rotate(rot);ctx.fillStyle="rgba(60,44,30,0.16)";ctx.fillRect(-62,-4,128,8);
    ctx.fillStyle=rgba(i===gi?wc_lit(GV.gold,0.25):[250,248,240],1);ctx.fillRect(-64,-9,128,9);ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=1.3;ctx.strokeRect(-64,-9,128,9);ctx.restore();}
  if(!o.out&&(o.lit||0)>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y-gi*8-4,90,[255,214,120],0.7*clamp(o.lit,0,1));ctx.restore();}}
// Planning's product, on its card (A product with an owner's, smaller): its name, what it is, its owner ringed in gold (o.ring, 0 to 1)
function oh_productCard(ctx,x,y,o){o=o||{};const w=620,h=360;ctx.save();ctx.filter="blur(8px)";ctx.fillStyle="rgba(60,44,30,0.24)";ctx.fillRect(x+12,y+16,w,h);ctx.restore();
  wc_panel(ctx,x,y,w,h,{kind:"card",seed:791});wc_T(ctx,"Learners near an award",x+36,y+70,{w:800,size:42,col:WC_DARK});wc_T(ctx,"data product",x+36,y+112,{w:600,size:28,col:WC_MUTED});
  ctx.fillStyle=rgba(WC_MUTED,0.45);ctx.fillRect(x+36,y+134,w-72,3);wc_T(ctx,"owner",x+36,y+214,{w:700,size:30,col:WC_MUTED});wc_hand(ctx,"Clara Jensen, Planning",x+160,y+214,{size:32,w:600,col:GV_SIGN.ink});
  const r=clamp(o.ring||0,0,1);if(r>0){const tw_=tw(ctx,"Clara Jensen, Planning",32,600),cx=x+160+tw_/2-4,cy=y+202;ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=5;ctx.lineCap="round";
    ctx.beginPath();ctx.ellipse(cx,cy,tw_/2+30,36,-0.03,-Math.PI*0.6,-Math.PI*0.6+TAU*r*1.04);ctx.stroke();ctx.restore();}
  wc_T(ctx,"version",x+36,y+300,{w:700,size:30,col:WC_MUTED});wc_hand(ctx,"1 · active",x+160,y+300,{size:30,w:600,col:GV_SIGN.ink});}
// the faculty's wall calendar, close: February 2027; the planner's days of waiting crossed off one by one (o.cross, 0 to 9, from the 2nd),
// and the day Jun sees her request circled (o.ring, 0 to 1)
const OH_CAL={x:470,y:96,w:980,h:740,cw:128,ch:116,gx:536,gy:330};
function oh_calendarC(){const C=OH_CAL;return wc_kept("ohCal",W,H,q=>{q.fillStyle=rgba(WC_PAPER,1);q.fillRect(0,0,W,H);wc_wash(q,wc_rect(-40,-40,W+80,H+80),GV_ROOM.fac,{kind:"plaster",line:false,seed:793});
  gv_lightGlow(q,300,0,800);q.save();q.filter="blur(10px)";q.fillStyle="rgba(60,44,30,0.25)";q.fillRect(C.x+14,C.y+18,C.w,C.h);q.restore();wc_part(q,wc_rect(C.x,C.y,C.w,C.h),[252,250,244],1,{seed:795,lw:1.2});
  wc_T(q,"February 2027",C.x+C.w/2,C.y+112,{w:800,size:52,align:"center",col:WC_DARK});
  ["M","T","W","T","F","S","S"].forEach((d,i)=>wc_T(q,d,C.gx+C.cw*(i+0.5),C.gy-26,{w:700,size:30,align:"center",col:WC_MUTED}));
  q.strokeStyle=rgba(WC_PENCIL,0.35);q.lineWidth=1.5;for(let r=0;r<=4;r++){q.beginPath();q.moveTo(C.gx,C.gy+r*C.ch);q.lineTo(C.gx+7*C.cw,C.gy+r*C.ch);q.stroke();}
  for(let c=0;c<=7;c++){q.beginPath();q.moveTo(C.gx+c*C.cw,C.gy);q.lineTo(C.gx+c*C.cw,C.gy+4*C.ch);q.stroke();}
  for(let d=1;d<=28;d++){const i=(d-1)%7,r=Math.floor((d-1)/7);wc_T(q,String(d),C.gx+i*C.cw+14,C.gy+r*C.ch+40,{w:700,size:32,col:i>=5?WC_MUTED:WC_DARK});}
  gv_pin(q,C.x+C.w/2,C.y+26,GV.red,0.9);});}
function oh_calendar(x,tt,o){o=o||{};const C=OH_CAL,cx=d=>C.gx+((d-1)%7+0.55)*C.cw,cy=d=>C.gy+(Math.floor((d-1)/7)+0.58)*C.ch;x.drawImage(oh_calendarC(),0,0,W,H);
  for(let k=0;k<9;k++){const u=clamp((o.cross||0)-k,0,1);if(u<=0.01)continue;const d=2+k,X=cx(d),Y=cy(d),s=32,a=clamp(u*2,0,1),b=clamp(u*2-1,0,1);
    x.save();x.strokeStyle=rgba([196,58,48],0.85);x.lineWidth=6;x.lineCap="round";x.beginPath();x.moveTo(X-s,Y-s);x.lineTo(X-s+2*s*a,Y-s+2*s*a);if(b>0){x.moveTo(X+s,Y-s);x.lineTo(X+s-2*s*b,Y-s+2*s*b);}x.stroke();x.restore();}
  const r=clamp(o.ring||0,0,1);if(r>0.01){x.save();x.strokeStyle=rgba(GV.gold,0.95);x.lineWidth=6;x.lineCap="round";x.beginPath();x.ellipse(cx(11)-6,cy(11)-6,54,48,-0.1,-Math.PI*0.6,-Math.PI*0.6+TAU*r*1.03);x.stroke();x.restore();}}
// a hand coming up from below the frame, its finger pointing at (x, y): Jun's, in his sleeve, or another's (id)
function oh_pointHand(ctx,x,y,id){const P_=PEOPLE[id||"jun"],sl=P_.top.c,sk=P_.skin;ctx.save();ctx.translate(x,y);ctx.rotate(-0.12);
  ctx.beginPath();ctx.moveTo(-6,96);ctx.lineTo(70,96);ctx.lineTo(96,700);ctx.lineTo(-40,700);ctx.closePath();litFill(ctx,sl,-40,96,96,700);
  ctx.beginPath();ctx.ellipse(30,74,46,40,0,0,TAU);litFill(ctx,sk,-16,34,76,114);seam(ctx,sk,0.3,1.4);
  rr(ctx,-10,-6,24,74,12);litFill(ctx,sk,-10,-6,14,68);seam(ctx,sk,0.3,1.4);ctx.restore();}
// had he said yes: Jun's screen, close and pale, a picture of what didn't happen: the request and two buttons, his hand on "approve"
// (o.hand, 0 to 1), and a gold "no" across it, then "not the owner" (o.no, 0 to 1; o.tagAt, when its tag comes)
function oh_approve(x,tt,o){o=o||{};const [sx,sy,sw,sh]=GV_SC;
  gv_screen(x,sx,sy,sw,sh,"request to read",q=>{wc_T(q,"Learners near an award",410,200,{w:800,size:48,col:WC_DARK});
    [["from","a planner, Faculty of Business"],["why","to plan next year's courses"],["until","30 June"]].forEach(([l,v],i)=>{wc_T(q,l,410,290+i*62,{w:600,size:30,col:WC_MUTED});wc_T(q,v,560,290+i*62,{w:600,size:32,col:WC_INK});});
    wc_panel(q,410,500,250,64,{kind:"pill",wash:GV.green,washA:0.7,seed:811});wc_T(q,"approve",535,543,{w:800,size:30,align:"center",col:[255,255,255]});
    wc_panel(q,690,500,250,64,{kind:"pill",wash:GV.grey,washA:0.45,seed:813});wc_T(q,"pass on",815,543,{w:800,size:30,align:"center",col:GV.greyInk});});
  const hd=easeCam(clamp(o.hand||0,0,1));if(hd>0.01)oh_pointHand(x,lerp(760,548,hd),lerp(1120,548,hd));
  x.save();x.fillStyle=rgba(WC_PAPER,0.36);x.fillRect(-W,-H,3*W,3*H);x.restore();
  const no=clamp(o.no||0,0,1);if(no>0.01){x.save();x.strokeStyle=rgba(GV.gold,0.95);x.lineWidth=12;x.lineCap="round";const cx=535,cy=532,r=118,a=clamp(no*1.6,0,1),b=clamp((no*1.6-1)/0.6,0,1);
    x.beginPath();x.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*a);x.stroke();if(b>0){x.beginPath();x.moveTo(cx-r*0.7,cy-r*0.7);x.lineTo(cx-r*0.7+r*1.4*b,cy-r*0.7+r*1.4*b);x.stroke();}x.restore();
    oh_tagAt(x,tt,o.tagAt||0,null,535,712,"not the owner",OH_GOLDTAG);}}

/* ---------- 3 · seven places ---------- */
// Yusuf's seven cards on his desk, from above, each written as it's named (o.w(i), 0 to 1: the pen's way through its words) and laid
// down (o.lay(i)); a gold "owner" chip on the three that hold a product's owner (o.owner, 0 to 1); on o.drift (0 to 1), the name each
// gives: the platform's "Jun Park", amber, against the others' "Clara Jensen"
const OH_DK=[
  {b:[250,140,420,300],r:-0.02,L:["The architecture tool","Noor's map","capabilities, services,","roles, steps, information","definitions"]},
  {b:[710,130,380,250],r:0.015,L:["The glossary","definitions,","for everyone to read"]},
  {b:[1130,146,400,250],r:-0.01,L:["The document library","policies","the council's minutes"]},
  {b:[1570,160,300,620],r:0.012,n:2,L:["The data team's","repository","owners","classes","tables","checks","decisions","each product's","promise"],own:true},
  {b:[250,480,420,320],r:0.01,L:["The data platform","who may read what","who read it, and when","each table's page"],own:true},
  {b:[710,460,380,280],r:-0.015,L:["The catalogue","products","where to ask"],own:true},
  {b:[1130,480,400,230],r:0.02,L:["The tracker","issues","requests"]}];
// returns where the pen is, as a card is written, in ctx's coordinates (null when none is)
function oh_deskCards(x,tt,o){o=o||{};const M0=x.getTransform().inverse(),D=clamp(o.drift||0,0,1);let pen=null;
  OH_DK.forEach((c,i)=>{const u=o.lay?clamp(o.lay(i),0,1):1;if(u<=0.01)return;const [cx,cy,cw,ch]=c.b,e=easeCam(u),nt=c.n||1,dr=i===4?D:0;if(dr>0.01)oh_halo(x,cx,cy,cw,ch,dr*0.9,GV.amber,20);
    x.save();x.translate((1-e)*40,(1-e)*-50);withA(x,clamp(u*2.5,0,1),()=>oh_onPaper(x,cx,cy,cw,ch,c.r*(2-e),q=>{const p=o.w?clamp(o.w(i),0,1):1,n=c.L.reduce((s,l)=>s+l.length,0);let done=0,y=58;
      c.L.forEach((l,j)=>{const pp=clamp((p*n-done)/l.length,0,1),sz=j<nt?31:28,wt=j<nt?800:600;done+=l.length;if(pp>0)wc_hand(q,l,28,y,{size:sz,w:wt,col:j<nt?WC_DARK:GV_SIGN.ink,p:pp});
        if(pp>0&&pp<1&&!pen){const m=q.getTransform(),px=28+tw(q,l.slice(0,Math.ceil(l.length*pp)),sz,wt),py=y-4,X=m.a*px+m.c*py+m.e,Y=m.b*px+m.d*py+m.f;pen=[M0.a*X+M0.c*Y+M0.e,M0.b*X+M0.d*Y+M0.f];}
        y+=j<nt?44:40;if(j===nt-1)y+=8;});
      if(c.own){const ow=clamp(o.owner||0,0,1);if(ow>0.01)oh_land(q,ow,cw-86,ch-40,()=>{const col=mix(GV.gold,GV.amber,dr),ink=mix(GV.goldInk,GV.amberInk,dr);
        wc_panel(q,cw-156,ch-64,132,48,{kind:"pill",wash:col,washA:0.75,seed:831+i});wc_T(q,"owner",cw-90,ch-30,{w:800,size:28,align:"center",col:ink});});
        if(D>0.01)withA(q,D,()=>wc_T(q,i===4?"Jun Park":"Clara Jensen",cw-24,ch-82,{w:800,size:28,align:"right",col:i===4?GV.amberInk:GV.goldInk}));}},{seed:821+i}));x.restore();});
  return pen;}
// the planner's request as Jun passed it on, on Sam's screen: what she asked, and who passed it on (drawn as the screen close is, GV_SC)
function oh_fwdPage(ctx){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"request to read",q=>{wc_T(q,"Learners near an award",410,200,{w:800,size:48,col:WC_DARK});
  [["from","a planner, Faculty of Business"],["why","to plan next year's courses"],["passed on by","Jun Park"]].forEach(([l,v],i)=>{wc_T(q,l,410,300+i*66,{w:600,size:30,col:WC_MUTED});wc_T(q,v,640,300+i*66,{w:600,size:32,col:WC_INK});});});}

/* ---------- 4 · one home each ---------- */
// the seven cards on Noor's map, as her room sees it: small, in the application band, each pinned as she goes (pin(i), 0 to 1)
function oh_roomCards(x,pin){const N=GV_NR.board,[bx,by,bw,bh]=gv_mapBand(N[0],N[1],N[2],N[3],4);
  for(let i=0;i<7;i++){const u=clamp(pin(i),0,1);if(u<=0.01)continue;const cw=bw*0.1,ch=bh*0.66,cx=bx+bw*(0.04+i*0.135),cy=by+(bh-ch)/2;
    oh_land(x,u,cx+cw/2,cy+ch/2,()=>{wc_panel(x,cx,cy,cw,ch,{kind:"card",wash:OH_APPC,washA:0.5,seed:911+i});gv_pin(x,cx+cw/2,cy+6,GV.red,0.45);gv_lines(x,cx+10,cy+ch*0.5,cw-20,2,10,1);});}}
// Noor's rule, as a table on a card over the map: each piece, its home, where it's changed, and its owner, who decides it. o.a (the card);
// o.piece(i), o.home(i), o.owner(i) (0 to 1): each cell as it's said
const OH_RT={x:290,y:150,w:1340,h:600,c:[60,470,930],rows:[["definitions","the architecture tool","owners of each area"],["a product's owner","the repository","the product's owner"],
  ["classes","the repository","each column's owner"],["who read it","the data platform","the platform team"]]};
function oh_ruleTable(x,tt,o){o=o||{};const R=OH_RT,a=clamp(o.a||0,0,1);if(a<=0.01)return;oh_land(x,a,R.x+R.w/2,R.y+R.h/2,()=>{x.save();x.filter="blur(12px)";x.fillStyle="rgba(60,44,30,0.22)";
  x.fillRect(R.x+14,R.y+18,R.w,R.h);x.restore();wc_panel(x,R.x,R.y,R.w,R.h,{kind:"card",seed:841});const X=c=>R.x+R.c[c],f=fn=>(i=>fn?clamp(fn(i),0,1):1);
  [["piece",0],["its home, where it's changed",1],["its owner, who decides it",2]].forEach(([s,c])=>wc_T(x,s,X(c),R.y+80,{w:600,size:28,col:WC_MUTED}));x.fillStyle=rgba(WC_PENCIL,0.4);x.fillRect(R.x+50,R.y+104,R.w-100,2);
  R.rows.forEach((r,i)=>{const y=R.y+180+i*104,pc=f(o.piece)(i),hm=f(o.home)(i),ow=f(o.owner)(i);
    if(pc>0.01)withA(x,pc,()=>wc_T(x,r[0],X(0),y,{w:700,size:32,col:WC_DARK}));
    if(hm>0.01)withA(x,hm,()=>{oh_house(x,X(1)+16,y-12,0.8);wc_T(x,r[1],X(1)+48,y,{w:700,size:32,col:WC_DARK});});
    if(ow>0.01)withA(x,ow,()=>wc_T(x,r[2],X(2),y,{w:700,size:32,col:GV.goldInk}));
    if(i<3){x.fillStyle=rgba(WC_PENCIL,0.15);x.fillRect(R.x+50,y+40,R.w-100,1.5);}});});}
// a product's owner, close: its home, the data team's repository, and its two copies, the catalogue and the platform's page. o.home,
// o.copies (0 to 1); o.way (0 to 1: the gold arrow out to the catalogue); o.tag (0 to 1: "from the repository, last night"); o.hand (0 to 1:
// the platform's page, "typed by hand"); o.platLit (an amber glow round it)
const OH_OC={home:[150,330,660,320],cat:[1100,170,680,220],plat:[1100,560,680,220]};
function oh_ownerCopies(x,tt,o){o=o||{};oh_paper(x);const D=OH_OC,[hx,hy,hw,hh]=D.home;
  oh_land(x,o.home==null?1:o.home,hx+hw/2,hy+hh/2,()=>{oh_glow(x,hx,hy,hw,hh,o.homeLit||0);wc_panel(x,hx,hy,hw,hh,{kind:"card",seed:851,wash:GV.gold,washA:0.2});oh_house(x,hx+hw-44,hy+44,1.1);
    wc_T(x,"The data team's repository",hx+36,hy+62,{w:800,size:30,col:WC_MUTED});x.fillStyle=rgba(WC_PENCIL,0.4);x.fillRect(hx+36,hy+84,hw-72,2);
    wc_T(x,"Learners near an award",hx+36,hy+160,{w:800,size:36,col:WC_DARK});wc_T(x,"owner: Clara Jensen",hx+36,hy+232,{w:800,size:36,col:GV.goldInk});});
  const cp=o.copies==null?1:o.copies,w=clamp(o.way||0,0,1);oh_arrow(x,[hx+hw+14,hy+hh/2-40],[D.cat[0]-18,D.cat[1]+D.cat[3]/2],w);
  [["The catalogue",D.cat,"owner: Clara Jensen",1],["The data platform's page",D.plat,"owner: Jun Park",0]].forEach(([nm,[cx,cy,cw,ch],ow,tagged],i)=>oh_land(x,clamp(cp*1.5-i*0.4,0,1),cx+cw/2,cy+ch/2,()=>{
    oh_glow(x,cx,cy,cw,ch,i===1?(o.platLit||0):0,GV.amber);wc_panel(x,cx,cy,cw,ch,{kind:"card",dashed:true,seed:861+i});wc_T(x,nm,cx+30,cy+56,{w:800,size:30,col:WC_MUTED});
    wc_T(x,ow,cx+30,cy+118,{w:800,size:34,col:WC_DARK});const tg=clamp(tagged?o.tag||0:o.hand||0,0,1);
    if(tg>0.01)withA(x,tg,()=>wc_T(x,tagged?"from the repository, last night":"typed by hand",cx+30,cy+176,{w:600,size:30,col:tagged?GV.goldInk:GV.greyInk}));}));}

/* ---------- 6 · found by a check ---------- */
// the night's check, on the platform's screen (GV_SC): each page that doesn't match its home, the name it gives and its home's (o.row(i),
// 0 to 1); o.hand (0 to 1): "typed by hand, last year" beside the last two; o.fix(i) (0 to 1): put right by morning, green, with its home's
// name; o.note(i) (0 to 1): a note to the owner, saying what changed
const OH_RP=[["Learners near an award","Jun Park","Clara Jensen","Clara Jensen"],["Fees by term","Sam Okafor","Finance","Finance"],
  ["Course completions","Jun Park","Learning team","the learning team"]];
function oh_checkPage(ctx,t,o){o=o||{};const [x,y,w,h]=GV_SC,L=OH_PG.lab,R=x+w-60;
  gv_screen(ctx,x,y,w,h,"last night's check",q=>{
    wc_T(q,"Each copy, compared with its home",L,190,{w:800,size:44,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.4);q.fillRect(L,214,R-L,2);
    OH_RP.forEach(([pg,has,home,to],i)=>{const u=o.row?clamp(o.row(i),0,1):1;if(u<=0.01)return;const ry=302+i*150,fx=o.fix?clamp(o.fix(i),0,1):0,nt=o.note?clamp(o.note(i),0,1):0;
      withA(q,clamp(u*2,0,1),()=>{oh_halo(q,L-24,ry-50,R-L+48,122,(1-fx)*0.5*u,GV.amber,22);oh_halo(q,L-24,ry-50,R-L+48,122,fx*0.5,GV.green,22);
        wc_T(q,pg,L,ry,{w:800,size:36,col:WC_DARK});
        if(fx<0.99)withA(q,1-fx,()=>wc_T(q,"owner: "+has+" · home says: "+home,L,ry+50,{w:700,size:30,col:GV.amberInk}));
        if(fx>0.01)withA(q,fx,()=>wc_T(q,"owner: "+home+" · from the repository, this morning",L,ry+50,{w:700,size:30,col:GV.greenInk}));
        const hd=i>0?clamp(o.hand||0,0,1)*(1-nt):0;if(hd>0.01)withA(q,hd,()=>wc_T(q,"typed by hand, last year",R,ry,{w:600,size:28,align:"right",col:GV.greyInk}));
        if(nt>0.01){const s="note · to "+to,nw=tw(q,s,28,700)+48;oh_land(q,nt,R-nw/2,ry-10,()=>{wc_panel(q,R-nw,ry-36,nw,52,{kind:"pill",wash:GV.gold,washA:0.4,seed:885+i});
          wc_T(q,s,R-nw+24,ry,{w:700,size:28,col:GV.goldInk});});}});});});}
// Yusuf's morning sheet, pinned on his board beside a photograph of Noor's map: what the check did last night (u, 0 to 1: it goes up)
function oh_officeSheet(x,u){const [bx,by]=GV_OFF.board;x.save();x.translate(bx+30,by+40);x.rotate(-0.03);x.fillStyle="rgba(60,44,30,0.22)";x.fillRect(6,8,150,108);
  x.fillStyle=rgba([252,252,248],1);x.fillRect(0,0,150,108);GV_LAYERS.forEach(([,c],i)=>{x.fillStyle=rgba(wc_lit(c,0.5),1);x.fillRect(8,8+i*16,134,13);});gv_pin(x,75,6,GV.red,0.5);x.restore();
  if(u<=0.01)return;const k=0.9+0.1*spring(clamp(u,0,1));x.save();x.translate(bx+300,by+180);x.scale(k,k);x.rotate(0.02);withA(x,clamp(u*2.5,0,1),()=>{x.fillStyle="rgba(60,44,30,0.24)";x.fillRect(-100,-118,210,250);
  wc_panel(x,-104,-124,208,250,{kind:"card",seed:891});wc_T(x,"Copies checked",0,-70,{w:800,size:22,align:"center",col:WC_DARK});wc_T(x,"last night",0,-40,{w:800,size:22,align:"center",col:WC_DARK});
  x.fillStyle=rgba(WC_PENCIL,0.35);x.fillRect(-80,-22,160,2);wc_T(x,"3",0,40,{w:800,size:48,align:"center",col:GV.greenInk});wc_T(x,"put right",0,80,{w:800,size:24,align:"center",col:GV.greenInk});
  gv_pin(x,0,-112,GV.red,0.55);});x.restore();}

/* ---------- 7 · theirs to change ---------- */
// the plan for the next series, pinned on the map: a heading card, and six cards, each a part of the map one of its films builds in
// the tools (o.head, o.card(i), 0 to 1)
const OH_NX=["who owns what, with the work","who may read what","one meaning, everywhere","checks with owners","promises in an open format","finding and asking"];
function oh_nextCards(x,tt,o){o=o||{};const hd=clamp(o.head||0,0,1);
  if(hd>0.01)oh_land(x,hd,960,150,()=>{const w=tw(x,"Next: Governance you can use",40,800)+90;wc_panel(x,960-w/2,104,w,92,{kind:"card",wash:GV.gold,washA:0.5,seed:897});gv_pin(x,960,114,GV.red,0.7);
    wc_T(x,"Next: Governance you can use",960,166,{w:800,size:40,align:"center",col:GV.goldInk});});
  OH_NX.forEach((s,i)=>{const u=o.card?clamp(o.card(i),0,1):1;if(u<=0.01)return;const c=i%3,r=Math.floor(i/3),w=520,h=112,cx=960+(c-1)*560,cy=352+r*168;
    oh_land(x,u,cx,cy,()=>{wc_panel(x,cx-w/2,cy-h/2,w,h,{kind:"card",seed:901+i});gv_pin(x,cx,cy-h/2+12,GV.red,0.6);wc_T(x,s,cx,cy+16,{w:700,size:30,align:"center",col:WC_DARK});});});}

/* ===== Where each piece lives: Noor's map, close =====
   The board on Noor's wall drawn large: its application band, in the colour The map before the data gives it, with the edges of the
   information band above and the technology band below. On it, the seven places Yusuf counts, each a card with the pieces it holds as
   chips, and the three tools that read the glossary. A home is drawn solid, with a house mark at its corner; a copy dashed, and its
   card says where its copies came from, and when. The flows run between the cards, one way each, with one arrowhead. The board is
   painted once (the place ohMap); the cards are drawn every frame. Every word on it is 28 px or more at the zoom the film reads it at.
   Every name starts with oh_ or OH. */

const OH_MB={x:56,w:1808,band:[30,870],lab:100},OH_APPC=GV_LAYERS[4][1];
// the cards: key, box, name (one or two lines), its pieces: [words, home (1) or copy (0)]; a card with copies says where they came from
const OH_APPS=[
  {k:"arch",b:[150,60,360,270],name:["The architecture tool"],chips:[["the map",1],["concepts",1],["definitions",1]]},
  {k:"gloss",b:[640,60,330,270],name:["The glossary"],chips:[["definitions",0]],from:"from the map,"},
  {k:"docs",b:[1510,60,300,270],name:["The document","library"],chips:[["policies",1],["minutes",1]]},
  {k:"repo",b:[150,450,360,340],name:["The data team's","repository"],chips:[["owners",1],["decisions",1],["classes",1],["promises",1],["tables",1],["checks",1]]},
  {k:"plat",b:[640,450,330,340],name:["The data platform"],chips:[["owners",0],["classes",0],["who may read",1],["who read it",1]],from:"from the repository,"},
  {k:"cat",b:[1100,450,330,340],name:["The catalogue"],chips:[["owners",0],["promises",0]],from:"from the repository,"},
  {k:"tracker",b:[1510,450,300,340],name:["The tracker"],chips:[["issues",1],["requests",1]]}];
const OH_APP=k=>OH_APPS.find(a=>a.k===k);
// the three tools that read the glossary's copy: small cards, dashed, in the third column
const OH_USE=[["the data team's copy",[1100,60,330,82]],["the dashboards",[1100,154,330,82]],["the assistant",[1100,248,330,82]]];
// the flows, as the points each arrow runs through: the map's definitions to the glossary; from the glossary to each tool that reads it;
// the map's concepts to the repository's tables; the repository's classes (and owners) to the platform; its promises (and owners) to the
// catalogue, round the platform's card; and the one Noor starts back, and stops
const OH_FLOWS={defs:[[518,195],[632,195]],use0:[[978,180],[1092,101]],use1:[[978,195],[1092,195]],use2:[[978,210],[1092,289]],
  concepts:[[330,338],[330,442]],classes:[[518,620],[632,620]],promises:[[518,520],[590,520],[590,390],[1265,390],[1265,442]],back:[[632,736],[518,736]]};
const OH_CP={h:46,s:28,gap:10,rg:16,pad:16};

function oh_paintMap(ctx){const M=OH_MB;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.noor,{kind:"plaster",line:false,seed:607});
  gv_lightGlow(ctx,960,-80,900);wc_part(ctx,wc_rect(M.x-14,-120,M.w+28,H+240),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(M.x,-100,M.w,H+200),[250,250,247],1,"board");
  [[-160,M.band[0]-12,3],[M.band[0],M.band[1],4],[M.band[1]+12,1140,5]].forEach(([y0,y1,li],k)=>wc_wash(ctx,wc_rect(M.x+12,y0,M.w-24,y1-y0),wc_lit(GV_LAYERS[li][1],0.66),{kind:"swatch",seed:611+k,a:0.8}));
  ctx.save();ctx.translate(M.lab,(M.band[0]+M.band[1])/2);ctx.rotate(-Math.PI/2);wc_T(ctx,"Application",0,10,{w:700,size:30,align:"center",col:wc_dim(OH_APPC,0.66)});ctx.restore();}

// where each chip of a card sits: in rows under its name, left to right, a new row when one is full (worked out once)
function oh_chipRects(ctx,a){if(a.cr)return a.cr;const [x,y,w]=a.b,out=[];let cx=x+OH_CP.pad,cy=y+(a.name.length>1?112:78);
  a.chips.forEach(([s])=>{const cw=Math.round(tw(ctx,s,OH_CP.s,700)+32);if(cx+cw>x+w-OH_CP.pad+1){cx=x+OH_CP.pad;cy+=OH_CP.h+OH_CP.rg;}out.push([cx,cy,cw,OH_CP.h]);cx+=cw+OH_CP.gap;});
  return a.cr=out;}
const oh_chipAt=(ctx,k,i)=>{const r=oh_chipRects(ctx,OH_APP(k))[i];return[r[0]+r[2]/2,r[1]+r[3]/2];};
// a soft glow behind a box (a, 0 to 1; col, gold unless given)
function oh_glow(ctx,x,y,w,h,a,col){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=clamp(a,0,1);const r=Math.max(w,h)*0.75,
  g=ctx.createRadialGradient(x+w/2,y+h/2,Math.min(w,h)*0.3,x+w/2,y+h/2,r),c=wc_lit(col||GV.gold,0.3);g.addColorStop(0,rgba(c,0.95));g.addColorStop(1,rgba(c,0));
  ctx.fillStyle=g;ctx.fillRect(x+w/2-r,y+h/2-r,2*r,2*r);ctx.restore();}
// a chip: before the rule, plain (kind u at 0); a home, solid, with a house mark at its corner; a copy, dashed, its words softer.
// o.lit (gold glow), o.amber (found by the check), o.green (put right), o.pen (a pen at its corner: theirs to change), o.eye (an eye:
// only to read)
function oh_chip(ctx,r,s,home,u,o){o=o||{};const [x,y,w,h]=r,v=clamp(u,0,1);
  oh_halo(ctx,x,y,w,h,o.lit||0,GV.gold);oh_halo(ctx,x,y,w,h,o.amber||0,GV.amber);oh_halo(ctx,x,y,w,h,o.green||0,GV.green);
  if(v<0.99)withA(ctx,1-v,()=>{wc_panel(ctx,x,y,w,h,{kind:"chip",seed:Math.round(x*3+y)});wc_T(ctx,s,x+16,y+h/2+10,{w:700,size:OH_CP.s,col:WC_DARK});});
  if(v>0.01)withA(ctx,v,()=>{if(home){wc_panel(ctx,x,y,w,h,{kind:"chip",wash:[255,253,246],washA:0.9,seed:Math.round(x*3+y)});wc_T(ctx,s,x+16,y+h/2+10,{w:700,size:OH_CP.s,col:WC_DARK});oh_house(ctx,x+7,y+5,0.72);}
    else{wc_panel(ctx,x,y,w,h,{kind:"chip",dashed:true,seed:Math.round(x*3+y)});wc_T(ctx,s,x+16,y+h/2+10,{w:700,size:OH_CP.s,col:WC_MUTED});}});
  const am=clamp(o.amber||0,0,1),gr=clamp(o.green||0,0,1);
  if(am>0.01||gr>0.01){ctx.save();ctx.lineWidth=4;ctx.strokeStyle=rgba(gr>am?GV.green:GV.amber,Math.max(am,gr));rr(ctx,x-4,y-4,w+8,h+8,(h+8)/2);ctx.stroke();ctx.restore();}
  if((o.pen||0)>0.01)oh_penMark(ctx,x+w-6,y-1,o.pen);if((o.eye||0)>0.01)oh_eye(ctx,x+w-6,y-1,o.eye);}
// a soft glow hugging a chip (or a card, with its corners' radius r), so only the one that's named lights
function oh_halo(ctx,x,y,w,h,a,col,r){if(a<=0.01)return;ctx.save();ctx.filter="blur(9px)";ctx.fillStyle=rgba(wc_lit(col,0.15),0.75*clamp(a,0,1));rr(ctx,x-9,y-9,w+18,h+18,r==null?(h+18)/2:r);ctx.fill();ctx.restore();}
// a small round badge at a chip's corner: a pen, this team changes it here (gold ring); an eye, this team only reads it here (grey)
function oh_badge(ctx,x,y,u,col){const k=0.7+0.3*spring(clamp(u,0,1));ctx.translate(x,y);ctx.scale(k,k);ctx.fillStyle="rgba(60,44,30,0.2)";ctx.beginPath();ctx.arc(1.5,2.5,15,0,TAU);ctx.fill();
  ctx.fillStyle=rgba([255,253,246],1);ctx.beginPath();ctx.arc(0,0,15,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3;ctx.stroke();}
function oh_penMark(ctx,x,y,u){ctx.save();withA(ctx,clamp(u*2,0,1),()=>{oh_badge(ctx,x,y,u,GV.gold);ctx.rotate(0.75);ctx.fillStyle=rgba([44,56,104],1);rr(ctx,-3.5,-11,7,16,2.5);ctx.fill();
  ctx.fillStyle=rgba([206,176,92],1);ctx.fillRect(-3.5,-5,7,3);ctx.fillStyle=rgba(WC_DARK,0.9);ctx.beginPath();ctx.moveTo(-3.5,5);ctx.lineTo(3.5,5);ctx.lineTo(0,11);ctx.closePath();ctx.fill();});ctx.restore();}
function oh_eye(ctx,x,y,u){ctx.save();withA(ctx,clamp(u*2,0,1),()=>{oh_badge(ctx,x,y,u,WC_MUTED);ctx.strokeStyle=rgba(WC_DARK,0.85);ctx.lineWidth=2.2;
  ctx.beginPath();ctx.moveTo(-9,0);ctx.quadraticCurveTo(0,-9,9,0);ctx.quadraticCurveTo(0,9,-9,0);ctx.closePath();ctx.stroke();ctx.fillStyle=rgba(WC_DARK,0.85);ctx.beginPath();ctx.arc(0,0,3.2,0,TAU);ctx.fill();});ctx.restore();}
// a card on the map: its name, its chips, and, for a card with copies, where they came from (o.from, 0 to 1). o.lit: a gold glow;
// o.chip(i): each chip's {lit, amber, green, pen, eye}; o.home, o.copy (0 to 1): the chips turn solid or dashed
function oh_appCard(ctx,a,o){o=o||{};const [x,y,w,h]=a.b,R=oh_chipRects(ctx,a);oh_halo(ctx,x,y,w,h,o.lit||0,GV.gold,24);
  wc_panel(ctx,x,y,w,h,{kind:"card",wash:OH_APPC,washA:0.3,seed:631+Math.round(x+y)});
  a.name.forEach((l,i)=>wc_T(ctx,l,x+16,y+46+i*34,{w:800,size:28,col:WC_DARK}));
  a.chips.forEach(([s,hm],i)=>oh_chip(ctx,R[i],s,!!hm,hm?(o.home||0):(o.copy||0),o.chip?o.chip(i)||{}:{}));
  const f=clamp(o.from||0,0,1);if(a.from&&f>0.01)withA(ctx,f,()=>{wc_T(ctx,a.from,x+16,y+h-48,{w:600,size:28,col:GV.goldInk});wc_T(ctx,o.when||"last night",x+16,y+h-14,{w:600,size:28,col:GV.goldInk});});}
function oh_useCard(ctx,i,u,o){o=o||{};if(u<=0.01)return;const [s,[x,y,w,h]]=OH_USE[i];oh_land(ctx,u,x+w/2,y+h/2,()=>{oh_halo(ctx,x,y,w,h,o.lit||0,GV.gold,20);oh_halo(ctx,x,y,w,h,o.green||0,GV.green,20);
  wc_panel(ctx,x,y,w,h,{kind:"card",dashed:true,seed:651+i});wc_T(ctx,s,x+18,y+h/2+10,{w:700,size:28,col:WC_MUTED});if((o.eye||0)>0.01)oh_eye(ctx,x+w-30,y+h/2,o.eye);});}
// a card springing in: k its scale as it lands, a its opacity
function oh_land(ctx,u,cx,cy,fn){if(u<=0.01)return;const k=0.86+0.14*spring(clamp(u,0,1));ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);ctx.translate(-cx,-cy);withA(ctx,clamp(u*2.2,0,1),fn);ctx.restore();}

// a flow: a line along its points, drawn to p of the way, its head at the end that's reached; lit (gold), or ink
function oh_polyLen(P){let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);return L;}
function oh_flow(ctx,P,p,o){o=o||{};if(p<=0.01)return;const L=oh_polyLen(P),end=oh_along(P,clamp(p,0,1)),lit=clamp(o.lit||0,0,1),col=mix(o.col||[70,64,58],GV.gold,lit),lw=o.lw||6;
  const pts=[P[0]];let acc=0;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);if(acc+d<=L*p){pts.push(P[i]);acc+=d;}else break;}pts.push(end);
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";if(lit>0.01){ctx.strokeStyle=rgba(wc_lit(GV.gold,0.5),0.5*lit);ctx.lineWidth=lw+10;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();}
  ctx.strokeStyle=rgba(col,o.a==null?0.92:o.a);ctx.lineWidth=lw;if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.setLineDash([]);
  if(!o.noHead){const a=pts[pts.length-2],b=pts[pts.length-1],an=Math.atan2(b[1]-a[1],b[0]-a[0]),hl=(o.head||20)*clamp(p/0.2,0.4,1);
    ctx.beginPath();ctx.moveTo(b[0]-Math.cos(an-0.5)*hl,b[1]-Math.sin(an-0.5)*hl);ctx.lineTo(b[0],b[1]);ctx.lineTo(b[0]-Math.cos(an+0.5)*hl,b[1]-Math.sin(an+0.5)*hl);ctx.stroke();}
  ctx.restore();}
// a small light at u along a flow's points (a: its strength)
function oh_lightAt(ctx,P,u,a,r){if(a<=0.01)return;const [x,y]=oh_along(P,clamp(u,0,1));ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,r||70,[255,226,140],0.8*a);wc_glowAt(ctx,x,y,(r||70)*0.4,[255,246,214],0.9*a);ctx.restore();}
// a cross, drawn stroke by stroke (u, 0 to 1), where an arrow's head would have been
function oh_cross(ctx,x,y,u){if(u<=0.01)return;const s=18;ctx.save();ctx.strokeStyle=rgba(GV.red,0.95);ctx.lineWidth=6;ctx.lineCap="round";const a=clamp(u*2,0,1),b=clamp(u*2-1,0,1);
  ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x-s+2*s*a,y-s+2*s*a);if(b>0){ctx.moveTo(x+s,y-s);ctx.lineTo(x+s-2*s*b,y-s+2*s*b);}ctx.stroke();ctx.restore();}

// Noor's map, close. st (each a number or a function of the card's key, or of the chip):
//   card(k): the card landing; home, copy: the chips turn solid or dashed; from(k): where its copies came from; when: "last night" or another;
//   cardLit(k); chip(k, i): a chip's {lit, amber, green, pen, eye}; use(i), useLit(i), useEye: the tools that read the glossary;
//   flow(f), flowLit(f): each flow drawn and lit; back, cross: the flow Noor starts back and stops; lights: [[flow, u, a], ...];
//   dim: a sheet of paper over all of it (0 to 1)
function oh_map(ctx,st){const f=(v,...a)=>v==null?0:typeof v==="function"?v(...a):v,d=f(st.dim);
  // dimmed (behind a card laid over it), the map is drawn faint, then washed with paper: nothing on it reads through the card
  withA(ctx,1-0.55*clamp(d,0,1),()=>{
  OH_APPS.forEach(a=>{const u=st.card==null?1:f(st.card,a.k);if(u<=0.01)return;const [x,y,w,h]=a.b;
    oh_land(ctx,u,x+w/2,y+h/2,()=>oh_appCard(ctx,a,{lit:f(st.cardLit,a.k),home:st.home,copy:st.copy,from:f(st.from,a.k),when:st.when,chip:i=>st.chip?st.chip(a.k,i):null}));});
  OH_USE.forEach((_,i)=>oh_useCard(ctx,i,f(st.use,i),{lit:f(st.useLit,i),eye:f(st.useEye,i),green:f(st.useGreen,i)}));
  Object.keys(OH_FLOWS).forEach(k=>{if(k==="back")return;oh_flow(ctx,OH_FLOWS[k],f(st.flow,k),{lit:f(st.flowLit,k),lw:k.startsWith("use")?4:6,head:k.startsWith("use")?16:20});});
  const bk=f(st.back);if(bk>0.01){oh_flow(ctx,OH_FLOWS.back,bk*0.62,{col:WC_PENCIL,lw:5,dash:[10,8],noHead:true});const e=oh_along(OH_FLOWS.back,0.62);oh_cross(ctx,e[0]-14,e[1],f(st.cross));}
  (st.lights||[]).forEach(([k,u,a])=>oh_lightAt(ctx,OH_FLOWS[k],u,a));});
  if(d>0.01){ctx.save();ctx.fillStyle=rgba(WC_PAPER,0.5*d);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}}

/* ===== Where each piece lives: the seven chapters =====
   Each chapter is a few shots in the places of plan.js, uni.js, map.js and the series' rooms.js, cut together with short dissolves
   (gv_shots). Times inside a chapter come from its cues (when each line starts) and the words of its lines (wAt), so the pictures stay with
   the voice if it's recorded again. Words on screen are on paper, cards, boards and tags, at least 28 px as seen, and above the captions. */

// ---- 1 · Nobody writes in a copy: Korea under the Joseon kings; the annals made, kept in four archives, three burnt in 1592; Jeonju's
// copy carried into the mountains, printed again, kept in five places, aired and checked, read by anyone today; then the same for data ----
scene("copy",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    write:w("daily","write down"),prints:w("king","and prints"),kept:w("same","kept in"),nobody:w("same","and nobody"),notKing:w("same","not even"),three:w("y1592","and three"),
    years:w("gone","a hundred"),what:w("gone","what was"),whom:w("gone","by whom"),why:w("gone","and why"),guard:w("scholars","and guard"),year:w("scholars","for more"),
    capital:w("five","one in"),mount:w("five","four high"),airs:w("climbs","airs"),writes:w("climbs","and writes"),y472:w("survive","four hundred"),kings:w("survive","twenty-five"),
    b888:w("survive","eight hundred"),free:w("today","free"),one:w("rebuild","one source"),way:w("rebuild","one way"),home:w("trusted","from its home"),oneway:w("trusted","one way"),
    checked:w("trusted","checked")};});
  const s2=c.daily-0.3,s2b=P.write-0.2,s3=c.king-0.3,s3b=P.prints-0.2,s4=c.same-0.3,s4b=P.kept-0.3,s4c=P.nobody-0.3,s5=c.y1592-0.3,s5b=P.three-0.3,
    s6=c.left-0.3,s7=c.gone-0.3,s8=c.change-0.3,s9=c.scholars-0.3,s9b=P.guard-0.3,s9c=P.year-0.2,s10=c.again-0.3,s11=c.five-0.3,s12=c.climbs-0.3,s12b=P.airs-0.3,s12c=P.writes-0.3,
    s13=c.survive-0.3,s14=c.today-0.3,s15=c.rebuild-0.3,s16=c.data-0.3,s17=c.breath,M4=["capital","chungju","seongju","jeonju"],M5=["odae","taebaek","myohyang","mani"],
    // the two shots of the cave share one slow camera, so the dissolve between them never lays the scene over itself a little apart
    CAVE=[[s9b,1000,620,1.15],[s9b+0.01,1000,620,1.18]];
  gv_shots(ctx,S,t,sc.dur,[
    // the court in the morning: down the hall from beside the seat, the officials in their rows, the historians at their desks at the left
    {at:0,keys:[[0,960,520,1.0]],push:0.03,draw:(x,tt)=>oh_court(x,tt,{write:0.3})},
    // the historians, closer, at their brushes; then close, from above, a sheet being written
    {at:s2,keys:[[s2,430,640,1.9]],push:0.03,draw:(x,tt)=>oh_court(x,tt,{write:clamp((tt-s2)/4,0.3,0.8)})},
    {at:s2b,keys:[[s2b,960,480,1.0]],push:0.03,draw:(x,tt)=>oh_writeClose(x,tt,clamp((tt-s2b)/5.5,0.05,1))},
    // the office that makes the annals: its members round the long table, the historians' notes in bundles; one reads, one writes
    {at:s3,keys:[[s3,960,500,1.0]],push:0.03,draw:(x,tt)=>oh_office(x,tt)},
    // the printers: the block inked, a sheet laid on it and rubbed, lifted to the pile, which grows
    {at:s3b,keys:[[s3b,1000,480,1.15]],push:0.02,draw:(x,tt)=>oh_print(x,tt,{pile:4+Math.floor((tt-s3b)*0.42)})},
    // four sets, each the same, laid in four chests
    {at:s4,keys:[[s4,960,560,1.0]],push:0.02,draw:(x,tt)=>oh_chests(x,tt,{fill:i=>clamp((tt-s4-0.3-i*0.45)/0.8,0,1)})},
    // the four archives, pinned on the sheet as small views, each with its name
    {at:s4b,keys:[[s4b,960,520,1.0]],push:0.02,draw:(x,tt)=>oh_board(x,tt,{a:k=>clamp((tt-s4b-0.1-M4.indexOf(k)*0.3)/0.5,0,1)})},
    // nobody may change one: a sealed chest, close; a hand in a red sleeve reaches for it, and stops
    {at:s4c,keys:[[s4c,960,560,1.0]],push:0.03,draw:(x,tt)=>{x.drawImage(gv_place("sealRoom"),0,0,W,H);oh_kingHand(x,clamp((tt-P.notKing+0.4)/1.1,0,1),clamp((tt-P.notKing-1.4)/1.2,0,1));}},
    // 1592: men come up the road over the pass; smoke rises beyond the hills
    {at:s5,keys:[[s5,1020,560,1.1],[s5+0.2,1060,580,1.16]],d:3,push:0,draw:(x,tt)=>{x.drawImage(gv_place("road"),0,0,W,H);oh_smoke(x,1500,560,420,tt,clamp((tt-s5)/1.5,0,1),{seed:11});
      oh_smoke(x,380,600,340,tt,clamp((tt-s5-0.6)/1.5,0,1),{seed:13});oh_march(x,tt,(tt-s5)*0.06,clamp((tt-s5)/0.6,0,1));}},
    // three of the four archives burn: smoke over three of the views; Jeonju's stays as it was
    {at:s5b,keys:[[s5b,960,520,1.0]],push:0.02,draw:(x,tt)=>{const b=k=>k==="jeonju"?0:clamp((tt-s5b-0.2-M4.indexOf(k)*0.35)/1.0,0,1);
      oh_board(x,tt,{smoke:b,dim:b,lit:k=>k==="jeonju"?clamp((tt-c.left+0.8)/1,0,1):0});}},
    // Jeonju's archive: the chests in its open bay
    {at:s6,keys:[[s6,960,560,1.0],[s6+0.1,960,520,1.12]],d:4,push:0,draw:(x,tt)=>oh_jeonju(x,tt)},
    // a page of the annals, close: what would be gone
    {at:s7,keys:[[s7,960,520,1.0]],push:0.04,draw:(x,tt)=>{x.drawImage(gv_place("book"),0,0,W,H);
      oh_tagAt(x,tt,P.years,null,960,210,"175 years",Object.assign({size:36},OH_GOLDTAG));
      [[P.what,"what was decided",560],[P.whom,"by whom",960],[P.why,"and why",1360]].forEach(([t0,s,tx])=>oh_tagAt(x,tt,t0,null,tx,840,s,{size:32}));}},
    // something has to change: two scholars of the town come to the archive's gate
    {at:s8,keys:[[s8,960,700,1.5]],push:0.02,draw:(x,tt)=>oh_jeonju(x,tt,{cast:q=>{const u=clamp((tt-s8)/2.2,0,1),m=u<1?0.7:0;
      person(q,"ohAn",lerp(1500,1080,easeCam(u)),1060,0.62,{pose:u<1?"stand":"listen",pose2:Math.sin(tt*5)>0?"walkA":"walkB",mix:m,t:tt,flip:true});
      person(q,"ohSon",lerp(1640,1250,easeCam(u)),1070,0.62,{pose:u<1?"stand":"listen",pose2:Math.sin(tt*5+1)>0?"walkA":"walkB",mix:m,t:tt+1,flip:true});}})},
    // into the mountains: the two scholars lead, the keepers carry the chests up the path towards us
    {at:s9,keys:[[s9,960,560,1.0]],push:0.03,draw:(x,tt)=>{x.drawImage(gv_place("path"),0,0,W,H);oh_walkers(x,tt-s9,[["ohAn",0.56],["ohSon",0.5],["ohK1",0.38,true],["ohK2",0.3,true]],0.06);
      oh_nameCard(x,1480,250,"An Ui · Son Hong-rok","local scholars",gv_io(tt,s9+0.6,s9b-0.2,0.4));}},
    // the cave by night: one keeps watch, the other sleeps; then the snow, and they change over (only once both shots show the same
    // two, so the dissolve between them never lays one pose over another)
    {at:s9b,keys:CAVE,d:s10-s9b,push:0,draw:(x,tt)=>oh_cave(x,tt,{swap:0})},
    {at:s9c,keys:CAVE,d:s10-s9b,push:0,draw:(x,tt)=>oh_cave(x,tt,{snow:true,swap:clamp((tt-s9c-0.9)/1.2,0,1)})},
    // 1603: the court prints them again, from that one copy, open on its stand
    {at:s10,keys:[[s10,880,500,1.12]],push:0.02,draw:(x,tt)=>oh_print(x,tt,{pile:3+Math.floor((tt-s10)*0.42),source:clamp((tt-s10-0.4)/0.8,0,1)})},
    // five sets, far apart: one in the capital, four high in the mountains, a chest landing on each
    {at:s11,keys:[[s11,960,520,1.0]],push:0.02,draw:(x,tt)=>oh_board(x,tt,{five:true,a:k=>clamp((tt-s11-0.2-(M5.indexOf(k)+1)*0.2)/0.5,0,1),
      chest:k=>k==="capital"?clamp((tt-P.capital-0.2)/0.8,0,1):clamp((tt-P.mount-0.4-M5.indexOf(k)*0.25)/0.8,0,1)})},
    // a historian climbs, years later, among the maples; airs the books in the sun; writes down what he finds
    {at:s12,keys:[[s12,960,560,1.0]],push:0.03,draw:(x,tt)=>{x.drawImage(gv_place("pathAutumn"),0,0,W,H);oh_walkers(x,tt-s12,[["ohAir",0.45]],0.08);}},
    {at:s12b,keys:[[s12b,960,520,1.0]],push:0.03,draw:(x,tt)=>oh_airing(x,tt,{books:clamp((tt-s12b+0.4)/2.0,0.2,1)})},
    {at:s12c,keys:[[s12c,960,480,1.0]],push:0.03,draw:(x,tt)=>oh_writeClose(x,tt,clamp((tt-s12c)/3.5,0.05,1),{seed:421,sleeve:[96,110,136]})},
    // the annals survive, complete
    {at:s13,keys:[[s13,960,520,1.0],[s13+0.1,960,540,1.08]],d:6,push:0,draw:(x,tt)=>{x.drawImage(gv_place("shelf"),0,0,W,H);
      [[P.y472,"472 years",560],[P.kings,"25 kings",960],[P.b888,"888 books",1360]].forEach(([t0,s,tx])=>oh_tagAt(x,tt,t0-0.1,null,tx,130,s,Object.assign({size:40},OH_GOLDTAG)));}},
    // today: a reader at a library's screen, a page of the annals on it
    {at:s14,keys:[[s14,960,540,1.0],[s14+0.1,1100,520,1.2]],d:3,push:0,draw:(x,tt)=>{oh_reading(x,tt,{page:clamp((tt-s14-0.3)/0.6,0,1)});oh_tagAt(x,tt,P.free,null,1220,300,"free",OH_GOLDTAG);}},
    // Jeonju's copy could rebuild the rest: gold lines from it to the five
    {at:s15,keys:[[s15,960,500,1.0]],push:0.02,draw:(x,tt)=>oh_board(x,tt,{ring:true,copy:clamp((tt-s15)/0.6,0,1),gold:clamp((tt-P.one+0.3)/2.2,0,1),lit:k=>clamp((tt-P.way)/1.2,0,1)})},
    // the same with data: a home, and copies made from it one way, and checked
    {at:s16,keys:[[s16,960,520,1.0]],push:0.02,draw:(x,tt)=>oh_dataCopies(x,tt,{home:clamp((tt-P.home+0.3)/0.8,0,1),way:clamp((tt-P.oneway+0.2)/1.4,0,1),check:i=>clamp((tt-P.checked-0.1-i*0.25)/0.5,0,1)})}
  ]);
  setScreen(ctx,S);oh_pill(ctx,t,[[0,"Joseon Korea"],[s5,"1592"],[s10,"1603"],[s14,"Today"],[s16,null]],1-fin(t,s17,0.6));
  gv_title(ctx,S,t,s17,"Where each piece lives","one home, and its copies","Film 3 of 3 · data governance");
  wc_paperOver(ctx,S);});

// ---- 2 · Nine days: February; a planner in the Faculty of Business asks to read Planning's product; the table's page on the data platform
// names its owner as Jun, so her request goes to him, and waits; he only built it, and Clara has owned it since October; nine days later he
// passes it on; had he said yes, the wrong person would have decided; the page was typed by hand, and nobody kept it in step ----
scene("nine",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    askTo:w("asks","asks to read"),plan:w("asks","to plan"),own:w("names","its owner"),goes:w("waits","goes to"),wait:w("waits","and waits"),built:w("built","only built"),
    clara:w("since","is Clara"),sees:w("later","sees"),passes:w("later","passes"),yes:w("had","said yes"),isnt:w("had","isn't"),decided:w("had","would have"),
    byHand:w("typed","typed by hand"),nobody:w("typed","nobody")};});
  const s2=P.askTo-0.35,s3=P.wait-0.4,s4=c.since-0.3,s5=c.later-1.3,s6=P.sees+0.3,s7=c.had-0.3,s8=c.typed-0.3;
  gv_shots(ctx,S,t,sc.dur,[
    // the Faculty of Business: a planner at her desk, the data platform's page for the table on her screen
    {at:0,place:"faculty",keys:[[0,1010,520,1.1],[0.1,1040,516,1.14]],d:4,draw:(x,tt)=>{
      gv_behind(x,"ohPlanner",GV_FX.seat[0],GV_FX.top,GV_FX.seat[1],{pose:"listen",t:tt,flip:true});x.drawImage(gv_place("facDesk"),0,0,W,H);
      oh_onScreen(x,GV_FX.screen,q=>oh_tablePage(q,tt,{}));oh_nameCard(x,1330,330,"Planner","Faculty of Business",gv_io(tt,0.6,s2-0.1,0.4));}},
    // her screen, close: she asks to read it, and writes why, and until when; the owner's line, "owner: Jun Park"; her request goes to him
    {at:s2,place:"screenFac",keys:[[s2,960,430,1.0],[s2+0.1,940,424,1.05],[c.names-0.2,780,450,1.38]],d:2.2,draw:(x,tt)=>oh_tablePage(x,tt,{
      press:gv_io(tt,P.askTo+0.05,P.askTo+0.45,0.15),why:clamp((tt-P.plan+0.15)/1.3,0,1),until:clamp((tt-P.plan-1.35)/0.5,0,1),
      ownerLit:gv_io(tt,P.own-0.1,s3+0.5,0.4),sent:fin(tt,P.goes-0.15,0.5),sentText:"request · to Jun Park"})},
    // the data team's room: Jun, busy, on the phone; at his elbow, a pile of requests, hers near the bottom; he built the table
    {at:s3,place:"data",keys:[[s3,1182,540,1.3],[s3+0.1,1190,536,1.33]],d:3,draw:(x,tt)=>{oh_pile(x,1540,668,{lit:fin(tt,s3+0.4,0.6)});
      person(x,"jun",1330,905,0.8,{pose:"phone",t:tt});oh_nameCard(x,960,640,"Jun Park","data team",gv_io(tt,s3+0.4,P.built-0.2,0.4));
      oh_tagAt(x,tt,P.built,null,1050,560,"built the table",{size:30});}},
    // Planning's room: the product's card on the wall, its owner, Clara Jensen, ringed in gold, since October; Clara beside it
    {at:s4,place:"planning",keys:[[s4,900,450,1.2],[s4+0.1,910,446,1.23]],d:3,draw:(x,tt)=>{oh_productCard(x,600,190,{ring:clamp((tt-P.clara+0.1)/0.7,0,1)});
      person(x,"clara",1400,905,0.8,{pose:"listen",pose2:"point",mix:gv_io(tt,P.clara-0.3,s5,0.5),t:tt,flip:true});
      oh_nameCard(x,1400,330,"Clara Jensen","Planning",gv_io(tt,s4+0.4,s5,0.4));oh_tagAt(x,tt,s4+0.6,null,910,620,"since October",OH_GOLDTAG);}},
    // nine days later: the faculty's wall calendar, nine days crossed off one by one, and the day he sees it ringed
    {at:s5,keys:[[s5,960,470,1.0]],push:0.02,draw:(x,tt)=>oh_calendar(x,tt,{cross:clamp((tt-s5-0.3)/0.17,0,9),ring:clamp((tt-P.sees+0.25)/0.5,0,1)})},
    // Jun finds her request, frowns, and passes it on, to Clara
    {at:s6,place:"data",keys:[[s6,1182,540,1.3]],push:0.02,draw:(x,tt)=>{const go=clamp((tt-P.passes+0.1)/0.9,0,1),has=go<=0;oh_pile(x,1540,668,{out:true});
      person(x,"jun",1330,905,0.8,has?{pose:"hold",t:tt,expr:"concerned",carry:oh_heldReq}:{pose:"listen",pose2:"point",mix:gv_io(tt,P.passes-0.1,P.passes+1.6,0.4),t:tt});
      if(!has){const e=easeCam(go);oh_flyCard(x,lerp(1330,1990,e),lerp(640,330,e)-Math.sin(e*Math.PI)*60,0.9,0.1*e,1-clamp((go-0.85)/0.15,0,1));}
      oh_tagAt(x,tt,P.passes+0.35,null,1640,430,"to Clara Jensen",OH_GOLDTAG);}},
    // had he said yes: a pale picture of what didn't happen, his hand on "approve", a gold "no" across it, "not the owner"
    {at:s7,place:"screenData",keys:[[s7,960,470,1.0],[s7+0.1,950,474,1.05]],d:3,draw:(x,tt)=>oh_approve(x,tt,{hand:clamp((tt-P.yes+0.3)/0.8,0,1),no:clamp((tt-P.isnt+0.1)/0.9,0,1),tagAt:P.decided})},
    // the page, close: typed by hand when the table was built, and nobody kept it in step
    {at:s8,place:"screenFac",keys:[[s8,800,415,1.3],[s8+0.1,790,415,1.34]],d:3,draw:(x,tt)=>oh_tablePage(x,tt,{hand:fin(tt,P.byHand-0.1,0.5),amber:fin(tt,P.nobody-0.1,0.6)})}
  ]);
  setScreen(ctx,S);oh_pill(ctx,t,[[0,null],[c.feb-0.25,"February"]],1-fin(t,c.breath,0.5));wc_paperOver(ctx,S);});

// ---- 3 · Seven places: Sam, who runs the data platform, wants its pages to name the right owner, and asks Yusuf where governance's pieces
// live; Yusuf counts seven, and writes a card for each as it's named; three hold a product's owner, and one of them has drifted ----
scene("seven",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    wants:w("sam","and wants"),right:w("sam","the right"),more:w("more","more than"),no:w("drift","no longer")};});
  const s2=P.wants-0.25,s3=c.asks-0.3,s4=c.counts-0.35,K=["arch","gloss","docs","repo","platform","cat","tracker"],
    wr=(tt,i)=>{const t0=c[K[i]]+0.1,t1=Math.max(t0+1.6,sc.ends[K[i]]+0.4);return clamp((tt-t0)/(t1-t0),0,1);};
  gv_shots(ctx,S,t,sc.dur,[
    // the platform team: Sam at the desk; on one screen the planner's request, passed on after nine days; on the other, the table's page
    {at:0,place:"platClose",keys:[[0,1000,520,1.1],[0.1,1030,516,1.13]],d:4,draw:(x,tt)=>{
      gv_behind(x,"sam",GV_PX.seat[0],GV_PX.top,GV_PX.seat[1],{pose:"listen",t:tt,flip:true});x.drawImage(gv_place("platDesk"),0,0,W,H);
      oh_onScreen(x,GV_PX.screens[0],q=>oh_fwdPage(q));oh_onScreen(x,GV_PX.screens[1],q=>oh_tablePage(q,tt,{}));
      oh_nameCard(x,1570,300,"Sam Okafor","platform team",gv_io(tt,0.5,s2-0.1,0.4));oh_tagAt(x,tt,0.9,null,500,300,"waited 9 days",OH_GOLDTAG);}},
    // the table's page, close: the owner's line, "owner: Jun Park", which Sam taps
    {at:s2,place:"screenPlat",keys:[[s2,960,430,1.0],[s2+0.1,820,415,1.3]],d:2.2,draw:(x,tt)=>{oh_tablePage(x,tt,{amber:fin(tt,P.right,0.5)});
      const h=gv_io(tt,P.right-0.5,c.asks-0.6,0.5);if(h>0.01)oh_pointHand(x,lerp(700,610,h),lerp(1150,300,easeCam(h)),"sam");}},
    // Yusuf's office: Sam comes in, and asks where governance's pieces live
    {at:s3,place:"office",keys:[[s3,800,560,1.2],[s3+0.1,810,556,1.23]],d:3,draw:(x,tt)=>{const wk=gv_walk(tt,s3+0.1,60,520,280);
      gv_behind(x,"yusuf",1000,GV_OFF.desk[1],0.8,{standing:true,pose:"listen",t:tt,flip:true});
      gv_walker(x,"sam",wk,905,0.8,wk.moving?{t:tt}:{t:tt,pose:"listen",pose2:"explain",mix:gv_io(tt,wk.end,c.counts-0.6,0.5)});}},
    // his desk, from above: seven blank cards, one for each place; each written as it's named; a gold "owner" on three; one has drifted
    {at:s4,place:"desk",keys:[[s4,1047,491,1.1]],push:0.02,draw:(x,tt)=>{
      const pen=oh_deskCards(x,tt,{lay:i=>(tt-s4-0.3-i*0.2)/0.45,w:i=>wr(tt,i),owner:fin(tt,P.more-0.1,0.5),drift:fin(tt,P.no,0.7)});if(pen)oh_pen(x,pen[0],pen[1]+2,1,0.62);}}
  ]);
  setScreen(ctx,S);wc_paperOver(ctx,S);});

// ---- 4 · One home each: Noor puts each place on her map, as an application, with what it holds; one rule: every piece has one home, where
// it's changed, and an owner, who decides it; every other place keeps a copy, and says where it came from, and when; a product's owner, for
// one; as with the annals, nobody writes in a copy; a fix goes to its home, and every copy follows ----
scene("home",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    asApp:w("puts","as an application"),oneRule:w("rule","one rule"),oneHome:w("every","one home"),anOwner:w("every","an owner"),keeps:w("other","keeps a copy"),
    came:w("other","came from"),lives:w("owner","lives in"),copyIt:w("copyit","copy it"),pf:w("copyit","the platform"),nobody:w("annals","nobody"),
    itsHome:w("fix","its home"),follows:w("fix","follows")};});
  const s2=P.asApp-0.3,s3=c.rule-0.3,s4=c.other-0.3,s5=c.owner-0.3,s6=c.annals-0.3,s7=c.fix-0.3,FROM=["gloss","plat","cat"],
    // the way a fix runs, from the definitions at home on the map to the glossary's copy
    r1=oh_chipRects(ctx,OH_APP("arch"))[2],r2=oh_chipRects(ctx,OH_APP("gloss"))[0],LIT=[[r1[0]+r1[2]+6,r1[1]+r1[3]/2],[r2[0]-6,r2[1]+r2[3]/2]],
    // the three shots of the map in a row share one slow camera, so a dissolve never lays the map over itself a little apart
    MK=[[s2,960,514,1.05],[s2+0.01,960,514,1.08]];
  gv_shots(ctx,S,t,sc.dur,[
    // Noor's room: she puts each of the seven places on her map, in its application band
    {at:0,place:"noor",keys:[[0,900,520,1.15],[0.1,920,516,1.18]],d:4,draw:(x,tt)=>{oh_roomCards(x,i=>(tt-0.6-i*0.3)/0.4);
      person(x,"noor",1420,905,0.8,{pose:"listen",pose2:"reach",mix:gv_io(tt,0.4,s2-0.2,0.5),t:tt,flip:true});
      oh_nameCard(x,1420,330,"Noor Rahman","data architect",gv_io(tt,0.5,s2-0.1,0.4));}},
    // her map, close: each place a card, with the pieces it holds
    {at:s2,place:"ohMap",keys:MK,d:s5-s2,push:0,draw:(x,tt)=>oh_map(x,{card:k=>(tt-s2-0.1-OH_APPS.findIndex(a=>a.k===k)*0.16)/0.5})},
    // one rule: every piece has one home, where it's changed, and an owner, who decides it
    {at:s3,place:"ohMap",keys:MK,d:s5-s2,push:0,draw:(x,tt)=>{oh_map(x,{home:fin(tt,P.oneHome,0.6),dim:fin(tt,s3+0.1,0.5)});
      oh_ruleTable(x,tt,{a:fin(tt,P.oneRule-0.2,0.5),piece:i=>fin(tt,c.every+0.1+i*0.22,0.4),home:i=>fin(tt,P.oneHome-0.1+i*0.22,0.4),owner:i=>fin(tt,P.anOwner-0.1+i*0.22,0.4)});}},
    // every other place keeps a copy, dashed, and says where it came from, and when
    {at:s4,place:"ohMap",keys:MK,d:s5-s2,push:0,draw:(x,tt)=>oh_map(x,{home:1,copy:fin(tt,P.keeps,0.6),from:k=>fin(tt,P.came-0.1+FROM.indexOf(k)*0.2,0.5),
      cardLit:k=>FROM.includes(k)?gv_io(tt,P.keeps,s5,0.5)*0.7:0})},
    // a product's owner, for one: at home in the data team's repository; the catalogue copies it, from the repository; the platform's page
    // was typed by hand
    {at:s5,keys:[[s5,960,540,1.0]],push:0.03,draw:(x,tt)=>oh_ownerCopies(x,tt,{home:fin(tt,s5+0.2,0.6),homeLit:gv_io(tt,P.lives,c.copyit,0.5),copies:fin(tt,c.copyit-0.1,0.7),
      way:clamp((tt-P.copyIt+0.6)/0.8,0,1),tag:fin(tt,P.copyIt+0.1,0.5),hand:fin(tt,P.pf+0.6,0.5),platLit:fin(tt,P.pf+0.6,0.6)})},
    // as with the annals: the sealed chest, and a hand that reaches for it, and stops
    {at:s6,place:"sealRoom",keys:[[s6,960,560,1.0]],push:0.03,draw:(x,tt)=>oh_kingHand(x,clamp((tt-s6-0.2)/1.1,0,1),clamp((tt-P.nobody-0.3)/1.2,0,1))},
    // a fix goes to its home: a pen at the map's definitions, and a light runs out to the glossary's copy; the camera holds still, so the
    // next chapter, which opens on the map as it's framed here, dissolves in without laying the map over itself a little apart
    {at:s7,place:"ohMap",keys:[[s7,960,514,1.05]],push:0,draw:(x,tt)=>{const pn=gv_io(tt,P.itsHome-0.3,P.follows+0.9,0.4);
      oh_map(x,{home:1,copy:1,from:1,chip:(k,i)=>k==="arch"&&i===2?{lit:pn,pen:pn}:k==="gloss"&&i===0?{green:fin(tt,P.follows-0.1,0.5)}:null});
      oh_flow(x,LIT,1,{dash:[3,9],a:0.4,lw:3,noHead:true});oh_lightAt(x,LIT,clamp((tt-P.itsHome-0.2)/1.1,0,1),gv_io(tt,P.itsHome+0.1,P.follows+0.2,0.3));}}
  ]);
  setScreen(ctx,S);oh_pill(ctx,t,[[0,null],[s6,"Joseon Korea"],[s7,null]],1);wc_paperOver(ctx,S);});

// ---- 5 · One way: the flows between the places, each one way: definitions from the map to the glossary, and on to every tool that reads
// them; the map's concepts to the data team's tables; each column's class to the platform, where it sets who may read it; each product's
// promise to the catalogue; nothing flows back; a copy is never a home ----
scene("way",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    defGo:w("defs","go from"),gloss:w("defs","the glossary"),u0:w("tools","the data team"),u1:w("tools","the dashboards"),u2:w("tools","the assistant"),
    cMap:w("concepts","concepts"),learner:w("concepts","a learner"),award:w("concepts","an award"),tables:w("concepts","tables"),clGo:w("class","goes from"),
    clPlat:w("class","to the platform"),sets:w("class","sets who"),prGo:w("promise","goes from"),cat:w("promise","the catalogue"),back:w("back","back")};});
  const U=[P.u0,P.u1,P.u2],g=(tt,t0,t1)=>gv_io(tt,t0,t1,0.4),
    // when each flow is drawn, how long it takes, and until when it stays lit
    ON={defs:[P.defGo,1.0,c.tools],use0:[P.u0-0.7,0.6,c.concepts-0.5],use1:[P.u1-0.7,0.6,c.concepts-0.5],use2:[P.u2-0.7,0.6,c.concepts-0.5],
      concepts:[P.cMap,0.9,c.class-0.5],classes:[P.clGo,0.8,c.promise-0.5],promises:[P.prGo,1.4,c.back-0.4]},
    // which chip lights, from when to when, as its flow is said: [card, chip, from, to]
    CL=[["arch",2,c.defs,c.tools],["gloss",0,P.gloss,c.concepts-0.5],["arch",1,c.concepts,c.class-0.5],["repo",4,P.tables,c.class-0.5],["repo",2,c.class,c.promise-0.5],
      ["plat",1,P.clPlat+0.3,c.promise-0.5],["plat",2,P.sets,c.promise-0.5],["repo",3,c.promise,c.back-0.4],["cat",1,P.cat,c.back-0.4]];
  gv_shots(ctx,S,t,sc.dur,[
    // Noor's map: each flow drawn as it's named, lit while it's said, the chips at its two ends lit with it
    {at:0,place:"ohMap",keys:[[0,960,514,1.05]],push:0.03,draw:(x,tt)=>{const nw=fin(tt,c.never+0.1,0.6);
      oh_map(x,{home:1,copy:1,from:1,use:i=>fin(tt,U[i]-0.1,0.5),useLit:i=>Math.max(g(tt,U[i]-0.1,c.concepts-0.5)*0.8,nw*0.7),
        flow:k=>ON[k]?clamp((tt-ON[k][0])/ON[k][1],0,1):0,flowLit:k=>ON[k]?g(tt,ON[k][0],ON[k][2]):0,back:clamp((tt-c.back-0.1)/0.9,0,1),cross:clamp((tt-P.back-0.1)/0.5,0,1),
        chip:(k,i)=>{let lit=0;for(const [ck,ci,t0,t1] of CL)if(ck===k&&ci===i)lit=Math.max(lit,g(tt,t0,t1));if(!OH_APP(k).chips[i][1])lit=Math.max(lit,nw*0.75);return{lit};}});
      // a learner and an award, two of the map's concepts, travel down to the data team's tables
      const cp=[oh_chipAt(x,"arch",1),OH_FLOWS.concepts[0],OH_FLOWS.concepts[1],oh_chipAt(x,"repo",4)];
      [[P.learner,"a learner"],[P.award,"an award"]].forEach(([t0,s])=>{const u=clamp((tt-t0)/1.5,0,1);if(u<=0||u>=1)return;const [X,Y]=oh_along(cp,easeCam(u));
        withA(x,Math.min(1,u*5,(1-u)*5),()=>wc_tag(x,X+24,Y-30,s,{align:"left",size:28,wash:GV.gold,washA:0.5,col:GV.goldInk}));});
      // a column's class, as the series draws it, slides along to the platform, where it sets who may read it
      const kp=[oh_chipAt(x,"repo",2),OH_FLOWS.classes[0],OH_FLOWS.classes[1],oh_chipAt(x,"plat",1)],ku=clamp((tt-P.clGo-0.3)/1.4,0,1),ka=Math.min(1,ku*6)*(1-fin(tt,c.promise-0.6,0.4));
      if(ku>0&&ka>0.01){const [X,Y]=oh_along(kp,easeCam(ku));withA(x,ka,()=>{x.save();x.translate(X-64,Y-44);gv_classChip(x,0,0,"direct",{size:28});x.restore();});}}}
  ]);
  setScreen(ctx,S);wc_paperOver(ctx,S);});

// ---- 6 · Found by a check: a copy can still drift, if someone types into it or a sync stops; every night a check compares each copy with
// its home; the first night it finds three names wrong; the sync puts them right by morning, and each owner is told; drift is found, not
// remembered, as the historians climbed to each archive; here a check does it every night ----
scene("check",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    types:w("drift","if someone"),stops:w("drift","a sync stops"),every:w("night","every night"),old:w("first","the old owner"),page:w("first","the table's"),
    two:w("first","two more"),hand:w("first","typed by hand"),right:w("morning","right by"),tells:w("morning","tells each"),wrote:w("climbed","wrote down")};});
  const s2=P.types-0.3,s3=P.stops-0.4,s4=c.night-0.3,sR=P.page-0.4,s5=c.finds-0.3,s6=c.climbed-0.3,s7=P.wrote-0.3,s8=c.here-0.3,
    // the check walks each flow in turn, from its home to the copies it feeds, and looks at each copy there
    WALK=["defs","use0","use1","use2","concepts","classes","promises"],TO={defs:[["gloss",0]],concepts:[["repo",4]],classes:[["plat",0],["plat",1]],promises:[["cat",0],["cat",1]]},
    w0=k=>P.every-0.3+WALK.indexOf(k)*0.62,dawn=tt=>clamp((tt-c.morning+0.3)/2.2,0,1),
    // the two shots of the map at night share one slow camera, so the dissolve between them never lays the map over itself a little apart
    MK=[[s3,960,514,1.05],[s3+0.01,960,514,1.08]],
    // the map at night: the board dark, the cards a little dimmer; dawn lifts it
    night=(x,tt,fn)=>{oh_night(x,1,dawn(tt));fn(x);oh_night(x,0.4,dawn(tt));};
  gv_shots(ctx,S,t,sc.dur,[
    // night on the floor where the work is done: the offices dark, nobody there
    {at:0,place:"floor",keys:[[0,960,540,1.0],[0.1,960,530,1.04]],d:4,draw:(x,tt)=>{oh_floor(x,tt,{out:Object.keys(OH_AT),names:0.6});oh_night(x,1);}},
    // someone types into a copy: the owner's line on the platform's page, in the dark
    {at:s2,place:"screenPlat",keys:[[s2,820,415,1.3]],push:0.02,draw:(x,tt)=>{oh_night(x,0.9);oh_tablePage(x,tt,{typed:clamp((tt-s2-0.3)/1.0,0,1)});}},
    // a sync stops: the light along one of the map's arrows flickers, and goes out
    {at:s3,place:"ohMap",keys:MK,d:sR-s3,push:0,draw:(x,tt)=>{const off=clamp((tt-P.stops-0.4)/0.8,0,1),fl=off<=0?1:off<1?(Math.sin(tt*38)>0?0.9:0.15):0;
      night(x,tt,q=>oh_map(q,{home:1,copy:1,from:1,use:1,flow:k=>k==="promises"?0:1}));
      oh_flow(x,OH_FLOWS.promises,1,off>=1?{col:WC_PENCIL,dash:[8,10],a:0.55}:{lit:fl});if(off<1)oh_lightAt(x,OH_FLOWS.promises,((tt-s3)*0.7)%1,fl);}},
    // every night, a check walks each arrow in turn and compares each copy with its home; the first night it stops at the platform's page
    {at:s4,place:"ohMap",keys:MK,d:sR-s3,push:0,draw:(x,tt)=>{const am=fin(tt,P.old-0.1,0.5);
      night(x,tt,q=>oh_map(q,{home:1,copy:1,from:1,use:1,flow:1,useLit:i=>{const t0=w0("use"+i)+0.5;return gv_io(tt,t0,t0+0.6,0.2)*0.8;},
        chip:(k,i)=>{let lit=0;for(const f of WALK)for(const [ck,ci] of (TO[f]||[]))if(ck===k&&ci===i){const t0=w0(f)+0.5;lit=Math.max(lit,gv_io(tt,t0,t0+0.6,0.2)*0.8);}
          return k==="plat"&&i===0?{lit,amber:am}:{lit};}}));
      WALK.forEach(f=>{const u=(tt-w0(f))/0.55;if(u>0&&u<1)oh_lightAt(x,OH_FLOWS[f],u,Math.min(1,u*6,(1-u)*6)+0.2);});
      // the first night: once more along to the platform's page, where it stops
      const u2=(tt-P.old+0.9)/0.75;if(u2>0&&u2<1.6)oh_lightAt(x,OH_FLOWS.classes,Math.min(u2,1),Math.min(1,u2*6)*(1-fin(tt,P.old+0.4,0.4)));
    }},
    // what it found, on the platform's screen in the dark: the table's page and two more; by morning, as the light comes up, they're put
    // right, and a note goes to each owner
    {at:sR,place:"screenPlat",keys:[[sR,960,420,1.04],[sR+0.1,960,416,1.1]],d:9,draw:(x,tt)=>{oh_night(x,0.9,dawn(tt));
      oh_checkPage(x,tt,{row:i=>fin(tt,i?P.two+0.1+(i-1)*0.35:P.page,0.5),hand:fin(tt,P.hand,0.5),fix:i=>fin(tt,P.right-0.1+i*0.35,0.6),note:i=>fin(tt,P.tells-0.1+i*0.3,0.5)});}},
    // the morning: Yusuf's office; on his board, beside the photograph of Noor's map, the night's sheet: three put right
    {at:s5,place:"office",keys:[[s5,900,380,1.5],[s5+0.1,910,376,1.54]],d:3,draw:(x,tt)=>{oh_officeSheet(x,fin(tt,c.finds+0.4,0.6));
      person(x,"yusuf",1230,905,0.8,{pose:"listen",pose2:"reach",mix:gv_io(tt,s5+0.1,c.finds+1.0,0.5),t:tt,flip:true});}},
    // as the historians climbed to each archive: the books aired on their racks, and what he found, written down
    {at:s6,keys:[[s6,960,520,1.0]],push:0.03,draw:(x,tt)=>oh_airing(x,tt,{books:clamp((tt-s6+0.6)/1.6,0.2,1)})},
    {at:s7,keys:[[s7,960,480,1.0]],push:0.03,draw:(x,tt)=>oh_writeClose(x,tt,clamp((tt-s7)/3.0,0.05,1),{seed:421,sleeve:[96,110,136]})},
    // here, a check does it every night: the floor in the dark, a light going from room to room; the camera draws back to the whole
    // floor, framed as the next chapter opens on it by day, so the two dissolve into each other without doubling
    {at:s8,place:"floor",keys:[[s8,960,530,1.03],[s8+0.1,960,540,1.0]],d:4,push:0,draw:(x,tt)=>{oh_floor(x,tt,{out:Object.keys(OH_AT),names:0.6});oh_night(x,1);
      for(let i=0;i<5;i++){const t0=s8+0.5+i*0.5,a=gv_io(tt,t0,t0+0.7,0.25);if(a>0.01){const [sx,sy]=oh_floorScr(i);x.save();x.globalCompositeOperation="screen";wc_glowAt(x,sx+40,sy+25,90,[255,214,140],0.8*a);x.restore();}}}}
  ]);
  setScreen(ctx,S);oh_pill(ctx,t,[[0,null],[s6,"Joseon Korea"],[s8,null]],1);wc_paperOver(ctx,S);});

// ---- 7 · Theirs to change: each team still works in its own tool, and knows which copy is its own to change, and which only to read; the
// planner's next request goes straight to Clara, who decides it in a day; Noor's map becomes the plan for the next series; the annals
// lasted; one home for every piece, and every copy can be trusted ----
scene("theirs",(ctx,S,t,sc)=>{const c=sc.cues,P=oh_once(sc,"P",()=>{const w=(id,s)=>wAt(sc,id,s);return{
    toChange:w("knows","theirs to change"),toRead:w("knows","only to read"),straight:w("next","goes straight"),toClara:w("next","to Clara"),decides:w("next","decides"),
    inADay:w("next","in a day"),series:w("plan","the next series"),eachOf:w("plan","each of its"),every:w("lasted","every copy"),oneHome:w("give","one home"),
    same:w("reads","the same"),request:w("reads","every request")};});
  const s2=c.knows-0.3,s3=c.next-0.3,s4=P.toClara-0.3,s5=c.plan-0.3,s6=c.lasted-0.3,s7=P.every+0.6,s8=c.give-0.3,s9=c.reads-0.3,
    // each team's own tool on its screen: Planning's reports, the registrar's office at the glossary, governance at the map, the data team
    // at its repository, the platform team at the platform
    TOOL=[GV.green,[96,140,200],GV.gold,[150,120,190],[70,160,150]],K=k=>OH_APPS.findIndex(a=>a.k===k);
  gv_shots(ctx,S,t,sc.dur,[
    // the floor by day: each team at its own screens
    {at:0,place:"floor",keys:[[0,960,540,1.0],[0.1,960,530,1.03]],d:4,draw:(x,tt)=>oh_floor(x,tt,{under:q=>oh_floorScreens(q,i=>fin(tt,0.3+i*0.2,0.4),i=>TOOL[i])})},
    // Noor's map: a pen at each piece's home, theirs to change; an eye at each copy, only to read
    {at:s2,place:"ohMap",keys:[[s2,960,514,1.05],[s2+0.1,960,514,1.07]],d:4,draw:(x,tt)=>oh_map(x,{home:1,copy:1,from:1,use:1,flow:1,useEye:fin(tt,P.toRead-0.1,0.5),
      chip:(k,i)=>OH_APP(k).chips[i][1]?{pen:fin(tt,P.toChange-0.2+K(k)*0.08,0.5)}:{eye:fin(tt,P.toRead-0.2+K(k)*0.08,0.5)}})},
    // the planner's next request: the page names Clara now, from the repository, and the request goes straight to her
    {at:s3,place:"screenFac",keys:[[s3,960,430,1.0],[s3+0.1,880,430,1.2]],d:2,draw:(x,tt)=>oh_tablePage(x,tt,{owner:"Clara Jensen",from:1,press:gv_io(tt,c.next+0.2,c.next+0.6,0.15),
      sent:fin(tt,P.straight-0.2,0.5),sentText:"request · to Clara Jensen",sentCol:GV.gold,sentInk:GV.goldInk})},
    // Planning's room: Clara reads it, and approves it, in a day
    {at:s4,place:"planning",keys:[[s4,1100,520,1.25],[s4+0.1,1110,516,1.28]],d:3,draw:(x,tt)=>{oh_productCard(x,600,190,{ring:0});
      person(x,"clara",1400,905,0.8,{pose:"hold",t:tt,carry:oh_heldReq,flip:true});
      oh_tagAt(x,tt,P.decides+0.1,null,1400,400,"approved · until 30 June",{size:30,wash:GV.green,washA:0.45,col:GV.greenInk});}},
    // the plan for the next series: over Noor's map, a card for each part its films build, in the tools
    {at:s5,place:"ohMap",keys:[[s5,960,514,1.05]],push:0.02,draw:(x,tt)=>{oh_map(x,{home:1,copy:1,from:1,use:1,flow:1,flowLit:gv_io(tt,s5+0.2,P.series,0.4),dim:fin(tt,P.series-0.4,0.6)});
      oh_nextCards(x,tt,{head:fin(tt,P.series+0.1,0.5),card:i=>fin(tt,P.eachOf+i*0.28,0.5)});}},
    // the annals lasted: the long shelf of books; and a reader today, at her screen
    {at:s6,place:"shelf",keys:[[s6,960,540,1.0],[s6+0.1,960,530,1.05]],d:4},
    {at:s7,keys:[[s7,960,540,1.0],[s7+0.1,1100,520,1.2]],d:3,push:0,draw:(x,tt)=>oh_reading(x,tt,{page:1})},
    // one home for every piece: the map, each home solid, each copy dashed, each arrow with one head, the platform's page put right
    {at:s8,place:"ohMap",keys:[[s8,960,514,1.05],[s8+0.1,960,514,1.08]],d:4,draw:(x,tt)=>oh_map(x,{home:1,copy:1,from:1,use:1,flow:1,flowLit:fin(tt,P.oneHome-0.2,0.8)*0.8,
      chip:(k,i)=>k==="plat"&&i===0?{green:fin(tt,s8+0.3,0.6)}:null})},
    // everyone reads the same thing: the same page on every screen on the floor; and a request goes to the one who decides it
    {at:s9,place:"floor",keys:[[s9,960,540,1.0],[s9+0.1,960,530,1.03]],d:4,draw:(x,tt)=>{
      oh_floor(x,tt,{under:q=>oh_floorScreens(q,()=>1,i=>mix(TOOL[i],GV.gold,fin(tt,P.same-0.2+i*0.12,0.5)))});
      const u=clamp((tt-P.request)/1.3,0,1);if(u>0&&u<1){const e=easeCam(u);oh_flyCard(x,lerp(1960,GV_FL.spot(0)+40,e),lerp(520,560,e)-Math.sin(e*Math.PI)*90,0.6,0,Math.min(1,u*5,(1-u)*5));}}}
  ]);
  setScreen(ctx,S);oh_pill(ctx,t,[[0,null],[s3,"8 March"],[P.inADay,"9 March"],[s5,null],[s6,"Joseon Korea"],[s7,"Today"],[s8,null]],1-fin(t,c.breath,0.4));
  gv_end(ctx,S,t,c.breath+0.2,"Where each piece lives","One home for every piece. Every copy follows it.","Film 3 of 3");
  if(t>c.breath+1.4)withA(ctx,fin(t,c.breath+1.6,0.8),()=>wc_tag(ctx,960,780,"Next: Governance you can use",{align:"center",size:30,w:600}));
  wc_paperOver(ctx,S);});

const WC_PLACES={court:oh_paintCourt,deskTop:oh_paintDeskTop,annalsOffice:oh_paintOffice,print:oh_paintPrint,chestRoom:oh_paintChests,board:oh_paintBoard,sealRoom:oh_paintSealRoom,
  road:oh_paintRoad,archive:oh_paintArchive,book:oh_paintBook,path:c=>oh_paintPath(c,{}),cave:c=>oh_paintCave(c,{}),caveSnow:c=>oh_paintCave(c,{snow:true}),
  pathAutumn:c=>oh_paintPath(c,{autumn:true}),airing:oh_paintAiring,shelf:oh_paintShelf,library:oh_paintLibrary,
  // the university, as the series paints it
  faculty:gv_paintFaculty,facDesk:gv_paintFacultyDesk,screenFac:c=>gv_paintScreenDesk(c,GV_ROOM.fac),data:c=>gv_paintData(c,{}),screenData:c=>gv_paintScreenDesk(c,GV_ROOM.data),
  planning:gv_paintPlanning,boardPlan:c=>gv_paintBoardClose(c,GV_ROOM.plan),platClose:gv_paintPlatformClose,platDesk:gv_paintPlatformDesk,screenPlat:c=>gv_paintScreenDesk(c,GV_ROOM.plat),
  office:gv_paintOffice,desk:gv_paintDesk,floor:gv_paintFloor,noor:gv_paintNoor,ohMap:oh_paintMap};

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
