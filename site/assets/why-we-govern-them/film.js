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

// Why we govern them, film 7 of 9 of What an agent is, the first series of the module on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers in words). The few longer stops are in breath.js.
const NARR={
"line":{"name":"Built into the line","lead":1.4,"tail":1.0,"vo":[
 {"id":"japan","gap":0.8,"text":"Japan, 1964.","say":"Japan, nineteen sixty-four."},
 {"id":"opening","gap":0.3,"text":"The national railway is opening a new line from Tokyo to Osaka:"},
 {"id":"first","gap":0.8,"text":"the world's first high-speed railway, built for trains at 210 kilometres an hour.","say":"the world's first high-speed railway, built for trains at two hundred and ten kilometres an hour."},
 {"id":"speed","gap":0.8,"text":"At that speed, a train covers a kilometre in seventeen seconds."},
 {"id":"signals","gap":0.8,"text":"Its driver can't read the signals beside the track in time, and the train can't slow down at once."},
 {"id":"missed","gap":0.8,"text":"A missed signal could cost lives: in Tokyo in 1962, a train ran past a red one, and in the crashes that followed, 160 people died.","say":"A missed signal could cost lives: in Tokyo in nineteen sixty-two, a train ran past a red one, and in the crashes that followed, a hundred and sixty people died."},
 {"id":"rest","gap":0.8,"text":"Passengers' lives would rest on one person seeing every signal in time."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"build","gap":0.8,"text":"So the railway's engineers build the limits into the line itself."},
 {"id":"cab","gap":0.8,"text":"A signal inside the driver's cab shows the speed allowed, and if the train goes faster, it slows itself down."},
 {"id":"room","gap":0.8,"text":"One control room watches every train on the line."},
 {"id":"driver","gap":0.8,"text":"And the driver still drives, and answers for the train."},
 {"id":"worked","gap":0.8,"text":"It worked."},
 {"id":"trip","gap":0.8,"text":"For passengers, the trip fell from six and a half hours to four."},
 {"id":"safe","gap":0.8,"text":"And since that first day, no passenger on Japan's high-speed lines has died in a derailment or a collision."},
 {"id":"bad","gap":0.8,"text":"The limits weren't there because the trains were bad."},
 {"id":"fast","gap":0.8,"text":"They were there because the trains were fast."},
 {"id":"uni","gap":0.8,"text":"At the university, Jun's agent is fast too, and no one can watch its every step."},
 {"id":"limits","gap":0.8,"text":"So we build its limits into how it works."},
 {"id":"more","gap":0.8,"text":"Then we can let it do more."}
]},
"three":{"name":"Capable, convincing, unaccountable","lead":0.9,"tail":1.0,"vo":[
 {"id":"count","gap":0.8,"text":"Jun's agent helps with the census-day count: the number of students the university sends the government."},
 {"id":"plain","gap":0.8,"text":"A plain job counts them."},
 {"id":"night","gap":0.8,"text":"When it fails at night, the agent finds the cause in test, and people approve its fix."},
 {"id":"more","gap":0.8,"text":"Now the team wonders whether it could do more: work for all of them, or even change the pipeline itself."},
 {"id":"capable","gap":0.8,"text":"An agent is capable: it knows more than any junior, and works faster."},
 {"id":"convincing","gap":0.8,"text":"It's convincing: it sounds sure, and feeling sure is not knowing."},
 {"id":"unacc","gap":0.8,"text":"And it's unaccountable: it can't answer for what it does."},
 {"id":"acts","gap":0.8,"text":"The agent acts; a person answers."},
 {"id":"yusuf","gap":0.8,"text":"So Yusuf, who leads data governance, asks what the university asks of any new colleague."},
 {"id":"who","gap":0.8,"text":"Who answers for it?"},
 {"id":"name","gap":0.8,"text":"Under what name does it work?"},
 {"id":"touch","gap":0.8,"text":"What may it touch?"},
 {"id":"checks","gap":0.8,"text":"And who checks its work?"},
 {"id":"four","gap":0.8,"text":"An owner, an identity, limits and review."}
]},
"owner":{"name":"An owner","lead":0.9,"tail":1.0,"vo":[
 {"id":"first","gap":0.8,"text":"First, an owner."},
 {"id":"must","gap":0.8,"text":"An agent can't answer for what it does, so a person must, as the driver answered for the train."},
 {"id":"jun","gap":0.8,"text":"Jun set this agent up, so he owns it."},
 {"id":"decides","gap":0.8,"text":"He decides what it's for, reads what it did, and can stop it."},
 {"id":"moves","gap":0.8,"text":"If he moves on, he hands it over, or it stops."},
 {"id":"hands","gap":0.8,"text":"And because an agent in the wrong hands does harm faster, not just anyone may own one."}
]},
"identity":{"name":"A name of its own","lead":0.9,"tail":1.0,"vo":[
 {"id":"second","gap":0.8,"text":"Second, an identity: the name it works under."},
 {"id":"today","gap":0.8,"text":"Today, Jun's agent works under Jun's name."},
 {"id":"learning","gap":0.8,"text":"While it's learning, with read-only tools and a sandbox for its drafts, that's fine."},
 {"id":"looks","gap":0.8,"text":"But its work looks like his, and to stop it, you'd have to stop Jun."},
 {"id":"own","gap":0.8,"text":"To work for the team, it needs a name of its own."},
 {"id":"sees","gap":0.8,"text":"Then, as the control room saw each train, the team sees everything it does, and can stop it without stopping anyone else."}
]},
"limits":{"name":"Limits it can't raise","lead":0.9,"tail":1.0,"vo":[
 {"id":"third","gap":0.8,"text":"Third, limits."},
 {"id":"role","gap":0.8,"text":"An agent has no rights of its own, only its role's."},
 {"id":"rails","gap":0.8,"text":"A train can only go where its rails go."},
 {"id":"reach","gap":0.8,"text":"An agent can go wherever its tools reach."},
 {"id":"fewest","gap":0.8,"text":"So each tool gets the fewest rights: read-only when reading is enough, writing only drafts in its sandbox, and no sensitive data."},
 {"id":"choice","gap":0.8,"text":"How much it may do alone is our choice."},
 {"id":"skill","gap":0.8,"text":"Its skill doesn't decide it."},
 {"id":"mandate","gap":0.8,"text":"It's written down as a mandate its owner signs: which tasks, where, and how each is checked."},
 {"id":"cab","gap":0.8,"text":"Like the speed in the cab, it's set from outside, it can be lowered at any time, and the agent can never raise it."}
]},
"review":{"name":"A person checks","lead":0.9,"tail":1.0,"vo":[
 {"id":"fourth","gap":0.8,"text":"Fourth, review."},
 {"id":"checks","gap":0.8,"text":"A person checks the agent's work, and because it sounds sure, checks its evidence, not its tone."},
 {"id":"never","gap":0.8,"text":"It never approves its own work, and no agent approves anyone's: an agent's review is only for reference."},
 {"id":"signal","gap":0.8,"text":"No train turns its own signal green."},
 {"id":"test","gap":0.8,"text":"In test, away from the real work, an agent may do agreed tasks alone, and report what it did."},
 {"id":"prod","gap":0.3,"text":"But every change to production, the work people rely on, is checked by its owner and approved by a second person,"},
 {"id":"same","gap":0.8,"text":"the same as people's changes."}
]},
"rules":{"name":"Like any colleague","lead":0.9,"tail":1.0,"vo":[
 {"id":"most","gap":0.8,"text":"In most ways, an agent is treated like any colleague: a role, the same rules, the same security."},
 {"id":"four","gap":0.8,"text":"Four rules are special."},
 {"id":"rights","gap":0.8,"text":"It has no rights of its own, only a role's."},
 {"id":"owner","gap":0.8,"text":"It always has a human owner."},
 {"id":"approve","gap":0.8,"text":"It never approves its own work: agents are never approvers."},
 {"id":"mandate","gap":0.8,"text":"And its autonomy is a written mandate that can be taken back, with a person approving every change to production."},
 {"id":"names","gap":0.3,"text":"These ideas have names in the field:"},
 {"id":"feng","gap":0.3,"text":"levels of autonomy set by the person's role, from Feng, McDonald and Zhang;"},
 {"id":"iso","gap":0.8,"text":"ISO/IEC 42001; and NIST's AI Risk Management Framework."},
 {"id":"series","gap":0.8,"text":"Series 3 and 4 put them to work.","say":"Series three and four put them to work."}
]},
"capable":{"name":"Because they are capable","lead":0.9,"tail":1.2,"vo":[
 {"id":"sixty","gap":0.8,"text":"More than sixty years on, trains on that first line run at 285 kilometres an hour, and the limits are still built in.","say":"More than sixty years on, trains on that first line run at two hundred and eighty-five kilometres an hour, and the limits are still built in."},
 {"id":"notbad","gap":0.8,"text":"Not because the trains are bad."},
 {"id":"fast","gap":0.8,"text":"Because they are fast."},
 {"id":"govern","gap":0.8,"text":"We govern agents for the same reason: because they are capable, not because they are bad."},
 {"id":"more","gap":0.3,"text":"With an owner, a name, limits and review, Jun's team can let its agent do more,"},
 {"id":"trust","gap":0.8,"text":"and still trust the number the university sends the government."},
 {"id":"next","gap":0.8,"text":"Next, what agents tell us about ourselves."},
 {"id":"series2","gap":0.8,"text":"Then, in series 2, Jun's agent goes to work.","say":"Then, in series two, Jun's agent goes to work."}
]}
};

const VODUR={"line/japan": 1.87, "line/opening": 4.189, "line/first": 5.242, "line/speed": 3.76, "line/signals": 5.683, "line/missed": 10.443, "line/rest": 4.505, "line/change": 1.288, "line/build": 3.379, "line/cab": 6.614, "line/room": 2.844, "line/driver": 2.86, "line/worked": 0.678, "line/trip": 3.647, "line/safe": 6.705, "line/bad": 2.483, "line/fast": 2.138, "line/uni": 5.289, "line/limits": 2.147, "line/more": 1.389, "three/count": 6.202, "three/plain": 1.43, "three/night": 4.959, "three/more": 6.094, "three/capable": 4.209, "three/convincing": 3.687, "three/unacc": 2.986, "three/acts": 2.116, "three/yusuf": 5.739, "three/who": 1.044, "three/name": 1.42, "three/touch": 0.93, "three/checks": 1.234, "three/four": 2.484, "owner/first": 0.917, "owner/must": 5.573, "owner/jun": 2.271, "owner/decides": 3.504, "owner/moves": 2.719, "owner/hands": 5.216, "identity/second": 2.664, "identity/today": 2.661, "identity/learning": 4.646, "identity/looks": 3.852, "identity/own": 2.592, "identity/sees": 7.227, "limits/third": 0.863, "limits/role": 3.067, "limits/rails": 2.264, "limits/reach": 2.353, "limits/fewest": 8.123, "limits/choice": 2.084, "limits/skill": 1.386, "limits/mandate": 5.291, "limits/cab": 6.337, "review/fourth": 0.968, "review/checks": 5.456, "review/never": 6.46, "review/signal": 2.105, "review/test": 6.046, "review/prod": 6.793, "review/same": 1.675, "rules/most": 6.122, "rules/four": 1.255, "rules/rights": 2.476, "rules/owner": 1.489, "rules/approve": 3.596, "rules/mandate": 6.518, "rules/names": 1.958, "rules/feng": 4.621, "rules/iso": 6.092, "rules/series": 1.946, "capable/sixty": 7.943, "capable/notbad": 1.576, "capable/fast": 1.09, "capable/govern": 5.154, "capable/more": 4.912, "capable/trust": 3.337, "capable/next": 2.47, "capable/series2": 2.976};

/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title card after the opening, and the end card. The longer holds let a picture finish: the map card and
   its speed, the 1962 lamp, held in silence, the needle passing the limit and settling under it, the control room's board, the time
   cards and the safety card, the night's fix and its two stamps, the four questions turning to their answers, the owner tag handed
   over, the switch that stops the agent alone, the mandate signed, the box lowered, the second person's yes, the three books, the line
   "We govern agents because they are capable, not because they are bad.", and the count leaving for the government. */
const BREATH={
"line":{"hold":{"japan":0.6,"first":1.2,"speed":0.8,"signals":1.0,"missed":1.6,"rest":1.0,"change":1.2,"build":0.8,"cab":1.6,"room":1.0,"driver":0.8,"trip":1.2,"safe":1.6,"fast":1.2,"uni":0.8,"limits":0.8},"breathe":4.6},
"three":{"hold":{"count":1.0,"plain":0.4,"night":1.6,"more":1.0,"capable":0.4,"convincing":0.4,"acts":0.8,"yusuf":0.4,"who":0.3,"name":0.3,"touch":0.3,"four":1.6}},
"owner":{"hold":{"first":0.4,"must":0.6,"jun":1.0,"decides":1.2,"moves":1.6,"hands":1.4}},
"identity":{"hold":{"second":0.4,"today":0.8,"learning":1.0,"looks":1.2,"own":1.2,"sees":2.4}},
"limits":{"hold":{"third":0.4,"role":0.8,"rails":0.6,"reach":1.0,"fewest":0.8,"choice":0.4,"skill":0.8,"mandate":1.4,"cab":1.8}},
"review":{"hold":{"fourth":0.4,"checks":1.0,"never":1.0,"signal":1.2,"test":1.2,"same":1.4}},
"rules":{"hold":{"most":1.0,"four":0.6,"rights":0.4,"owner":0.4,"approve":0.4,"mandate":0.8,"iso":1.0,"series":1.0}},
"capable":{"hold":{"sixty":1.0,"notbad":0.4,"fast":1.0,"govern":1.6,"trust":1.2,"next":0.4},"breathe":6.2}
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

/* ===== Why we govern them: Japan, 1964, and the line today =====
   The opening's own pictures, drawn once in the module's matte language (soft gradients, matte shapes, the light from the right, the
   same calm palette as the lab), all prefixed wg_ / WG_:
     places (painted once): the platform in morning light, the line along an embankment past fields and low hills, plain track at
     night (Tokyo, 1962), a carriage of passengers, the driver's cab, and the control room;
     live pieces: the train, at rest or gliding (a long white body, a slate band under the windows, a rounded nose, no logo and no
     number; the slate isn't the module's blue, which means tools and structure), today's longer, sleeker train, a signal beside the
     track, the speedometer and the speed allowed above it, the board's lights, the corner tag, and the people of 1964, dressed for
     their time (a driver in a dark uniform and cap, controllers in white shirts and ties, passengers in suits, dresses and coats).
   No Japanese words, patterns, art styles or landmarks: signs are blank, and the corner names the place and the year. */

const WGC={sky0:[186,198,208],sky1:[236,229,214],sun:[255,244,222],haze:[204,208,212],concrete:[214,209,199],concreteDk:[178,173,164],
  body:[244,242,236],bodyShade:[210,207,200],band:[74,86,100],glass:[46,54,66],skirt:[132,136,140],rail:[128,124,118],ballast:[150,145,136],
  grass:[150,160,124],grassDk:[118,130,100],field:[168,176,130],hill:[156,168,156],night0:[30,36,50],night1:[56,62,80],red:[214,58,48]};

/* ---------------------------------------------------------------- people of 1964
   ag_person specs: a cap for the driver, a tie for a shirt; skin and hair as the people of the line, dressed as photographs of the
   time show city people. Each has its own key, so it's painted once. */
function wg_cap(col){return(c,P)=>{const d=ag_dk(col,0.35);
  ag_soft(c,cc=>{cc.moveTo(204,352);cc.bezierCurveTo(198,314,212,278,250,266);cc.bezierCurveTo(300,252,364,258,394,284);cc.bezierCurveTo(406,300,406,330,398,352);cc.closePath();},
    col,ag_lt(col,0.3),352,282,120,rgba(ag_dk(col,0.7),0.4),12);
  ag_soft(c,cc=>{cc.moveTo(206,344);cc.lineTo(398,344);cc.lineTo(396,370);cc.lineTo(210,372);cc.closePath();},d,ag_lt(col,0.12),340,352,80,null);
  ag_soft(c,cc=>{cc.moveTo(350,364);cc.bezierCurveTo(382,360,418,364,440,378);cc.bezierCurveTo(424,388,382,388,350,378);cc.closePath();},[30,32,36],[96,100,108],404,370,40,null);
  ag_soft(c,cc=>cc.ellipse(372,316,11,13,0,0,TAU),[214,206,184],[255,250,236],370,312,12,null);};}
// a brimmed hat, worn on the head: its band just above the ear, the brim over the brow
function wg_hat(col){return(c,P)=>{c.save();c.translate(0,22);
  ag_soft(c,cc=>{cc.moveTo(214,330);cc.bezierCurveTo(212,286,240,258,290,254);cc.bezierCurveTo(342,250,382,268,390,312);cc.lineTo(394,338);cc.closePath();},col,ag_lt(col,0.28),350,270,110,rgba(ag_dk(col,0.7),0.4),12);
  c.strokeStyle=rgba(ag_dk(col,0.4),0.7);c.lineWidth=4;c.beginPath();c.moveTo(262,262);c.quadraticCurveTo(300,282,350,262);c.stroke();
  ag_soft(c,cc=>{cc.moveTo(214,322);cc.lineTo(394,326);cc.lineTo(394,340);cc.lineTo(214,338);cc.closePath();},[34,34,38],[90,90,96],330,330,60,null);
  ag_soft(c,cc=>cc.ellipse(306,340,124,16,-0.04,0,TAU),ag_dk(col,0.12),ag_lt(col,0.25),380,334,120,rgba(ag_dk(col,0.7),0.35),6);c.restore();};}
function wg_tie(col){return(c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();
  ag_soft(c,cc=>{cc.moveTo(302,616);cc.lineTo(324,614);cc.lineTo(330,642);cc.lineTo(338,820);cc.lineTo(320,850);cc.lineTo(304,820);cc.lineTo(306,644);cc.closePath();},
    col,ag_lt(col,0.3),326,680,90,rgba(ag_dk(col,0.7),0.4),8);c.restore();};}
const WG_P={
  driver:{key:"wg_driver",name:"the driver",skin:[226,188,154],hair:{style:"cropped",c:[22,20,24]},top:{kind:"suit",c:[40,48,62],inner:[232,234,236],tie:[34,38,48]},hat:{paint:wg_cap([42,50,64])},breath:0.27},
  ctrlA:{key:"wg_ctrlA",name:"a controller",skin:[222,182,148],hair:{style:"side",c:[24,22,26]},glasses:[40,40,44],top:{kind:"shirt",c:[240,240,236],paint:wg_tie([70,76,92])},breath:0.29},
  ctrlB:{key:"wg_ctrlB",name:"a second controller",skin:[216,176,142],hair:{style:"cropped",c:[30,28,30]},top:{kind:"shirt",c:[236,236,232],paint:wg_tie([96,70,68])},breath:0.26},
  clerk:{key:"wg_clerk",name:"an office worker",skin:[224,186,152],hair:{style:"side",c:[22,20,24]},glasses:[36,36,40],top:{kind:"suit",c:[64,66,72],inner:[234,236,238],tie:[60,64,84]},breath:0.28},
  oldMan:{key:"wg_oldMan",name:"an older man",skin:[214,176,144],hair:{style:"cropped",c:[176,176,178]},glasses:[60,56,52],top:{kind:"suit",c:[96,86,74],inner:[232,230,224],tie:[84,64,60]},breath:0.24},
  oldWoman:{key:"wg_oldWoman",name:"an older woman",skin:[222,186,156],hair:{style:"bun",c:[150,150,154]},earrings:[220,214,200],top:{kind:"cardigan",c:[150,120,118],inner:[236,232,226]},breath:0.25},
  mother:{key:"wg_mother",name:"a mother",skin:[230,194,162],hair:{style:"bob",c:[26,24,28]},top:{kind:"blazer",c:[200,186,160],inner:[240,236,228]},breath:0.3},
  manHat:{key:"wg_manHat",name:"a man in a hat",skin:[220,182,148],hair:{style:"cropped",c:[24,22,24]},top:{kind:"suit",c:[58,60,66],inner:[236,236,238],tie:[52,56,74]},hat:{paint:wg_hat([92,88,80])},breath:0.26},
  womanCoat:{key:"wg_womanCoat",name:"a woman in a light coat",skin:[230,194,164],hair:{style:"bob",c:[28,24,28]},earrings:[226,214,196],top:{kind:"blazer",c:[208,196,172],inner:[232,226,214]},breath:0.31},
  youngMan:{key:"wg_youngMan",name:"a young man",skin:[218,180,146],hair:{style:"side",c:[20,18,22]},top:{kind:"cardigan",c:[120,112,100],inner:[236,236,232]},breath:0.3},
  child:{key:"wg_child",name:"a child",skin:[234,198,166],hair:{style:"side",c:[24,22,26]},top:{kind:"sweater",c:[138,92,96]},breath:0.36}
};

/* ---------------------------------------------------------------- the corner tag: where and when, at the top left */
function wg_corner(ctx,text,a){if(a<=0)return;const w=ag_tw(ctx,text,{w:700,size:30,ls:3})+56;
  ag_box(ctx,72,64,w,62,31,{a:a*0.92});ag_T(ctx,text.toUpperCase(),100,106,{w:700,size:30,ls:3,col:AG.kick,a});}

/* ---------------------------------------------------------------- the sky, hills and ground, shared by the places outside */
function wg_sky(c,top,bot,y0,y1,sunX,sunY,sunA){const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(top,1));g.addColorStop(1,rgba(bot,1));c.fillStyle=g;c.fillRect(0,y0,W,y1-y0);
  if(sunA>0){const s=c.createRadialGradient(sunX,sunY,10,sunX,sunY,900);s.addColorStop(0,rgba(WGC.sun,0.55*sunA));s.addColorStop(0.4,rgba(WGC.sun,0.18*sunA));s.addColorStop(1,rgba(WGC.sun,0));c.fillStyle=s;c.fillRect(0,y0,W,y1-y0);}}
// a soft ridge of hills: a wandering top edge, filled down to y1, a little lighter at the top (the haze)
function wg_ridge(c,base,amp,col,y1,seed,fr,hazeA){const R=ag_rnd(seed);const ph=[R()*9,R()*9,R()*9];c.beginPath();c.moveTo(0,y1);
  for(let x=0;x<=W;x+=12){const y=base-amp*(0.55*Math.sin(x*fr+ph[0])+0.3*Math.sin(x*fr*2.3+ph[1])+0.15*Math.sin(x*fr*5.1+ph[2]));c.lineTo(x,y);}
  c.lineTo(W,y1);c.closePath();const g=c.createLinearGradient(0,base-amp,0,y1);g.addColorStop(0,rgba(mix(col,WGC.haze,hazeA),1));g.addColorStop(1,rgba(col,1));c.fillStyle=g;c.fill();}

/* ---------------------------------------------------------------- the platform, in morning light (the place "wgPlatform")
   Seen across the track from our platform: a far platform under a long low roof, the city soft in the haze beyond, the track, and our
   own platform's edge in front, which hides the train's wheels, as it does from where a passenger stands. The train is drawn live,
   then wg_platformFront over it. */
const WG_PLAT={rail:708,edge:694};
function wg_paintPlatform(c,o){o=o||{};const ev=!!o.dusk;if(ev)wg_sky(c,[176,170,186],[246,206,164],0,560,1820,420,1.3);else wg_sky(c,[198,208,214],[240,232,216],0,560,1700,180,1);
  // the city, soft in the haze: plain low blocks, no landmark
  const R=ag_rnd(64);for(let i=0;i<34;i++){const x=R()*W,w=60+R()*150,h=30+R()*90;c.fillStyle=rgba(mix([176,184,192],[226,224,218],0.35+R()*0.3),0.75);c.fillRect(x,470-h,w,h+40);}
  // the far platform: its roof, a long low slab, on slim columns; the shade under it
  c.fillStyle=rgba([196,196,192],1);c.fillRect(0,268,W,30);c.fillStyle=rgba([150,150,148],1);c.fillRect(0,296,W,8);
  let g=c.createLinearGradient(0,304,0,520);g.addColorStop(0,"rgba(80,78,74,0.32)");g.addColorStop(1,"rgba(80,78,74,0.12)");c.fillStyle=g;c.fillRect(0,304,W,216);
  for(let x=60;x<W;x+=330){ag_soft(c,cc=>cc.rect(x,304,14,216),[176,176,172],[230,228,222],x+10,320,60,null);}
  c.fillStyle=rgba([206,202,194],1);c.fillRect(0,512,W,22);c.fillStyle=rgba([170,166,158],1);c.fillRect(0,532,W,6);
  // the track bed between the platforms, in soft shade
  g=c.createLinearGradient(0,538,0,WG_PLAT.rail+20);g.addColorStop(0,rgba([120,116,110],1));g.addColorStop(1,rgba(WGC.ballast,1));c.fillStyle=g;c.fillRect(0,538,W,WG_PLAT.rail+20-538);
  // morning light across everything from the right
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,ev?"rgba(40,30,44,0.22)":"rgba(40,34,28,0.12)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,ev?"rgba(255,190,120,0.2)":"rgba(255,246,226,0.14)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // our own roof's edge across the top of the frame
  g=c.createLinearGradient(0,0,0,86);g.addColorStop(0,"rgba(96,94,90,1)");g.addColorStop(1,"rgba(132,130,126,1)");c.fillStyle=g;c.fillRect(0,0,W,78);c.fillStyle="rgba(255,255,255,0.35)";c.fillRect(0,76,W,2);}
function wg_platformFront(ctx,dusk){const y=WG_PLAT.edge;
  // our platform: pale concrete, its edge a little lighter, seen a little from above, running out of the frame's foot
  ctx.save();let g=ctx.createLinearGradient(0,y,0,H);g.addColorStop(0,rgba(WGC.concrete,1));g.addColorStop(1,rgba(WGC.concreteDk,1));ctx.fillStyle=g;ctx.fillRect(0,y,W,H-y);
  ctx.fillStyle="rgba(255,255,255,0.55)";ctx.fillRect(0,y,W,3);ctx.fillStyle="rgba(60,54,46,0.18)";ctx.fillRect(0,y+3,W,10);
  ctx.fillStyle="rgba(240,236,226,0.7)";ctx.fillRect(0,y+46,W,6);
  if(dusk){g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,40,0.18)");g.addColorStop(1,"rgba(255,186,120,0.12)");ctx.fillStyle=g;ctx.fillRect(0,y,W,H-y);}
  ctx.restore();}

/* ---------------------------------------------------------------- the line along an embankment (the place "wgCountry") */
const WG_LINE={rail:690};
function wg_paintCountry(c){wg_sky(c,[184,198,212],[236,232,220],0,520,1600,140,0.8);
  // two soft clouds, very faint
  for(const [x,y,r] of [[420,150,170],[1340,110,130]]){const g=c.createRadialGradient(x,y,10,x,y,r);g.addColorStop(0,"rgba(255,255,255,0.32)");g.addColorStop(1,"rgba(255,255,255,0)");c.save();c.translate(x,y);c.scale(1.8,0.5);c.translate(-x,-y);c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.restore();}
  wg_ridge(c,452,50,[162,174,172],600,11,0.0036,0.55);wg_ridge(c,500,36,[146,160,140],620,23,0.0052,0.3);
  // the fields: long bands, wider towards us, each a little different
  const R=ag_rnd(5);let y=540,h=6;while(y<WG_LINE.rail+6){c.fillStyle=rgba(mix(WGC.field,[146,160,118],R()*0.8),1);c.fillRect(0,y,W,h+1);c.fillStyle="rgba(255,255,240,0.1)";c.fillRect(0,y,W,1);y+=h;h*=1.32;}
  // the embankment: ballast on top, the rails' bed, the grassy slope below
  c.fillStyle=rgba(WGC.ballast,1);c.fillRect(0,WG_LINE.rail-4,W,18);c.fillStyle="rgba(255,255,255,0.25)";c.fillRect(0,WG_LINE.rail-4,W,2);
  let g=c.createLinearGradient(0,WG_LINE.rail+14,0,WG_LINE.rail+90);g.addColorStop(0,rgba(WGC.grassDk,1));g.addColorStop(1,rgba(WGC.grass,1));c.fillStyle=g;c.fillRect(0,WG_LINE.rail+14,W,76);
  // the near field, out of focus, darker towards the foot of the frame
  g=c.createLinearGradient(0,WG_LINE.rail+90,0,H);g.addColorStop(0,rgba([158,168,128],1));g.addColorStop(1,rgba([120,132,100],1));c.fillStyle=g;c.fillRect(0,WG_LINE.rail+90,W,H-WG_LINE.rail-90);
  c.fillStyle="rgba(255,255,240,0.14)";c.fillRect(0,WG_LINE.rail+90,W,2);
  // the light from the right
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.1)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,246,226,0.12)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// the rails and the masts that carry the wires, drawn live so they can pass: off is how far the scenery has moved to the left
function wg_lineFront(ctx,off,o){o=o||{};const r=WG_LINE.rail;ctx.save();
  ctx.fillStyle=rgba(WGC.rail,1);ctx.fillRect(0,r-2,W,4);ctx.fillStyle="rgba(255,255,255,0.4)";ctx.fillRect(0,r-2,W,1);
  // the overhead wire and its masts
  ctx.strokeStyle="rgba(70,72,76,0.55)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,r-232);ctx.lineTo(W,r-232);ctx.stroke();
  const P=520,x0=((-off)%P+P)%P-P;for(let x=x0;x<W+P;x+=P){ag_soft(ctx,cc=>cc.rect(x,r-262,10,262),[112,114,118],[170,172,176],x+8,r-250,40,null);ctx.fillStyle="rgba(90,92,96,1)";ctx.fillRect(x-6,r-248,46,6);}
  ctx.restore();}

/* ---------------------------------------------------------------- the train
   wg_train(ctx, x, y, o): x is the tip of its nose, y the top of the rails, o.k its size (1: a body 214 px tall), o.cars how many cars
   reach back from the nose (the frame is the limit), o.today today's train, longer and sleeker; o.lamp the headlight's glow (0 to 1);
   o.people faint passengers in the windows; o.driver the driver's head in the cab's window; o.a. Light from the right; no logo,
   no number. */
function wg_noseShape(k,today){return today?
  c=>{c.moveTo(-1260*k,-196*k);c.bezierCurveTo(-900*k,-196*k,-620*k,-186*k,-420*k,-150*k);c.bezierCurveTo(-240*k,-118*k,-80*k,-82*k,-8*k,-52*k);
    c.bezierCurveTo(6*k,-44*k,4*k,-30*k,-12*k,-24*k);c.lineTo(-1260*k,-24*k);c.closePath();}:
  c=>{c.moveTo(-460*k,-214*k);c.bezierCurveTo(-270*k,-214*k,-120*k,-196*k,-48*k,-130*k);c.bezierCurveTo(-14*k,-100*k,2*k,-76*k,0,-58*k);
    c.bezierCurveTo(-2*k,-42*k,-16*k,-30*k,-44*k,-26*k);c.lineTo(-460*k,-26*k);c.closePath();};}
function wg_train(ctx,x,y,o){o=o||{};const k=o.k||1,a=o.a==null?1:o.a,today=!!o.today,carL=(today?1700:1500)*k,cars=o.cars||3,top=today?-196*k:-214*k,bot=today?-24*k:-26*k;
  if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);
  const back=-carL*cars;
  // its shadow on the track bed
  ag_floorShadow(ctx,(back)/2,6*k,(-back)/2,10*k,0.3);
  // wheels and bogies under the skirt, in shadow
  ctx.fillStyle=rgba([46,48,52],1);for(let i=0;i<cars;i++){const cx=-carL*i;for(const b of [-carL+190*k,-180*k])for(const d of [-46*k,46*k]){ctx.beginPath();ctx.arc(cx+b+d,-14*k,14*k,0,TAU);ctx.fill();}}
  const nose=wg_noseShape(k,today),noseL=today?1260*k:460*k;
  // the body: the cars behind the nose's own, then the lead car with its nose
  const body=c=>{c.moveTo(back,bot);c.lineTo(back,top+14*k);c.quadraticCurveTo(back,top,back+14*k,top);c.lineTo(-noseL,top);c.lineTo(-noseL,bot);c.closePath();};
  const fillBody=(fn)=>{ag_soft(ctx,fn,WGC.body,[255,255,252],-200*k,top+20*k,900*k,"rgba(70,64,56,0.22)",18*k);};
  fillBody(body);fillBody(nose);
  // shade on the lower half, light along the roof
  ctx.save();ctx.beginPath();body(ctx);nose(ctx);ctx.clip();
  let g=ctx.createLinearGradient(0,top,0,bot);g.addColorStop(0,"rgba(255,255,255,0.5)");g.addColorStop(0.18,"rgba(255,255,255,0)");g.addColorStop(0.62,"rgba(60,56,50,0)");g.addColorStop(1,"rgba(60,56,50,0.2)");
  ctx.fillStyle=g;ctx.fillRect(back,top,-back+10*k,bot-top);
  // the slate band under the windows (today's train: a thin line), round the nose
  const b0=today?-80*k:-86*k,b1=today?-70*k:-60*k;ctx.fillStyle=rgba(WGC.band,1);ctx.fillRect(back,b0,-back+10*k,b1-b0);
  if(!today){ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(back,b0,-back,2*k);}
  // the skirt
  ctx.fillStyle=rgba(WGC.skirt,1);ctx.fillRect(back,bot-14*k,-back+10*k,14*k);
  // windows: a row of small ones (1964), or one long band (today)
  const wy0=today?-150*k:-160*k,wy1=today?-112*k:-118*k;
  for(let i=0;i<cars;i++){const c0=-carL*(i+1),c1=-carL*i-(i===0?noseL+40*k:60*k);
    if(today){ctx.fillStyle=rgba(WGC.glass,1);rr(ctx,c0+120*k,wy0,c1-c0-160*k,wy1-wy0,10*k);ctx.fill();}
    else for(let wx=c0+150*k;wx<c1-40*k;wx+=56*k){ctx.fillStyle=rgba(WGC.glass,1);rr(ctx,wx,wy0,36*k,wy1-wy0,7*k);ctx.fill();
      if(o.people&&hash(Math.round(wx),7)>0.35){ctx.fillStyle="rgba(150,140,130,0.45)";ctx.beginPath();ctx.arc(wx+18*k,wy1-17*k,8*k,0,TAU);ctx.fill();ctx.fillRect(wx+6*k,wy1-9*k,24*k,9*k);}
      ctx.fillStyle="rgba(255,255,255,0.18)";ctx.fillRect(wx+3*k,wy0+3*k,10*k,wy1-wy0-6*k);}
    // doors near each end of the car, and the gap between cars
    ctx.strokeStyle="rgba(90,86,80,0.4)";ctx.lineWidth=2;for(const dx of [c0+70*k,c1-10*k]){if(dx<-noseL+20*k||i>0){ctx.strokeRect(dx,-196*k+(today?20*k:0),40*k,170*k-(today?20*k:0));}}
    if(i>0||cars>1){ctx.fillStyle="rgba(50,48,46,0.85)";ctx.fillRect(-carL*(i+1)-6*k,top+10*k,12*k,bot-top-10*k);}}
  ctx.restore();
  // the nose's windscreen and its headlights
  ctx.save();ctx.beginPath();nose(ctx);ctx.clip();
  if(today){ctx.fillStyle=rgba(WGC.glass,1);ctx.beginPath();ctx.moveTo(-760*k,-178*k);ctx.lineTo(-560*k,-172*k);ctx.lineTo(-440*k,-146*k);ctx.lineTo(-700*k,-150*k);ctx.closePath();ctx.fill();}
  else{const ws=cc=>{cc.moveTo(-318*k,-212*k);cc.bezierCurveTo(-240*k,-210*k,-170*k,-200*k,-122*k,-170*k);cc.lineTo(-104*k,-150*k);cc.bezierCurveTo(-170*k,-154*k,-250*k,-158*k,-300*k,-160*k);cc.closePath();};
    ag_soft(ctx,ws,WGC.glass,[120,132,148],-170*k,-200*k,120*k,null);
    if(o.driver){ctx.save();ctx.beginPath();ws(ctx);ctx.clip();ctx.fillStyle="rgba(20,22,26,0.75)";ctx.beginPath();ctx.ellipse(-214*k,-176*k,14*k,16*k,0,0,TAU);ctx.fill();ctx.fillRect(-232*k,-196*k,38*k,9*k);ctx.fillRect(-236*k,-160*k,48*k,20*k);ctx.restore();}
    ctx.fillStyle="rgba(255,255,255,0.2)";ctx.beginPath();ctx.moveTo(-290*k,-209*k);ctx.lineTo(-268*k,-208*k);ctx.lineTo(-246*k,-159*k);ctx.lineTo(-266*k,-159*k);ctx.closePath();ctx.fill();}
  const hl=today?[-40*k,-50*k]:[-26*k,-80*k];ctx.fillStyle=rgba([226,228,226],1);ctx.beginPath();ctx.ellipse(hl[0],hl[1],12*k,9*k,0,0,TAU);ctx.fill();
  ctx.restore();
  if(o.lamp>0){const gg=ctx.createRadialGradient(hl[0],hl[1],0,hl[0],hl[1],80*k);gg.addColorStop(0,"rgba(255,248,220,"+(0.8*o.lamp)+")");gg.addColorStop(1,"rgba(255,248,220,0)");ctx.fillStyle=gg;ctx.fillRect(hl[0]-80*k,hl[1]-80*k,160*k,160*k);}
  // a pantograph on the second car's roof
  if(cars>1){const px=-carL*1.5;ctx.strokeStyle="rgba(70,72,76,0.85)";ctx.lineWidth=3*k;ctx.beginPath();ctx.moveTo(px-50*k,top);ctx.lineTo(px,top-50*k);ctx.lineTo(px+50*k,top);ctx.moveTo(px-30*k,top-50*k);ctx.lineTo(px+30*k,top-50*k);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- a signal beside the track
   wg_signal(ctx, x, y, h, lamp, o): a slim mast from the ground at (x, y), h tall, with a hooded lamp: lamp "red", "green" or null
   (dark); o.glow 0 to 1; o.blur smears it sideways, as it passes the window. */
function wg_signal(ctx,x,y,h,lamp,o){o=o||{};const s=o.s||1,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const draw=(dx,al)=>{ctx.save();ctx.globalAlpha*=al;ctx.translate(dx,0);
    ag_soft(ctx,cc=>cc.rect(x-5*s,y-h,10*s,h),[96,98,102],[150,152,156],x+4,y-h+20,40,null);
    ag_soft(ctx,cc=>ag_rect(cc,x-26*s,y-h-96*s,52*s,96*s,12*s),[40,42,46],[96,100,106],x+10,y-h-90*s,60*s,null);
    const col=lamp==="red"?WGC.red:lamp==="green"?[86,200,130]:[70,72,76];ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y-h-48*s,14*s,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(30,30,34,1)";ctx.fillRect(x-22*s,y-h-70*s,44*s,7*s);ctx.restore();};
  if(o.blur){for(let i=0;i<9;i++)draw(i*o.blur/8,0.16);}else draw(0,1);
  if(lamp&&o.glow>0){const col=lamp==="red"?WGC.red:[86,200,130],g=ctx.createRadialGradient(x,y-h-48*s,0,x,y-h-48*s,120*s);g.addColorStop(0,rgba(col,0.6*o.glow));g.addColorStop(1,rgba(col,0));
    ctx.globalCompositeOperation="screen";ctx.fillStyle=g;ctx.fillRect(x-120*s,y-h-168*s,240*s,240*s);}
  ctx.restore();}

/* ---------------------------------------------------------------- plain track at night (the place "wgNight"): Tokyo, 1962 */
function wg_paintNight(c){wg_sky(c,WGC.night0,WGC.night1,0,560,0,0,0);
  let g=c.createLinearGradient(0,540,0,H);g.addColorStop(0,"rgb(44,46,54)");g.addColorStop(1,"rgb(26,28,34)");c.fillStyle=g;c.fillRect(0,540,W,H-540);
  // a faint glow of the city along the horizon
  g=c.createLinearGradient(0,470,0,560);g.addColorStop(0,"rgba(120,110,120,0)");g.addColorStop(1,"rgba(120,110,120,0.22)");c.fillStyle=g;c.fillRect(0,470,W,90);
  // the track, running away from us to the right: sleepers, then the rails
  // the track, running away from us: one vanishing point for the sleepers and the rails (depth z, 1 at the frame's foot)
  const vp=[1180,546],P=(z,side)=>[lerp(vp[0],660,1/z)+side*380/z,lerp(vp[1],H+30,1/z)];
  for(let z=1;z<40;z*=1.16){const a=P(z,-1.5),b=P(z,1.5),th=Math.max(1,22/z);c.fillStyle="rgba(76,72,68,"+clamp(1.1-z*0.03,0.25,0.9)+")";c.fillRect(a[0],a[1]-th/2,b[0]-a[0],th);}
  c.strokeStyle="rgba(156,156,162,0.75)";c.lineWidth=5;for(const sd of [-1,1]){c.beginPath();for(let z=1;z<60;z*=1.1){const q=P(z,sd);z===1?c.moveTo(q[0],q[1]):c.lineTo(q[0],q[1]);}c.stroke();}}

/* ---------------------------------------------------------------- a carriage of passengers (the place "wgCarriage")
   Seen from the side, as the passengers face the way the train goes: the far wall with its windows and the luggage rack, and each
   row's seat back; the passengers and the armrests are drawn live, in front of their seat backs. */
const WG_ROWS=[140,520,900,1280,1660],WG_SEAT={top:470,seat:792};
function wg_paintCarriage(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(226,222,212)");g.addColorStop(1,"rgb(204,198,186)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the windows, bright, the country blurred past them
  for(let x=-80;x<W+200;x+=380){const wx=x+70,wy=250,ww=250,wh=210;c.save();rr(c,wx,wy,ww,wh,26);c.clip();
    const s=c.createLinearGradient(0,wy,0,wy+wh);s.addColorStop(0,"rgb(232,238,240)");s.addColorStop(0.55,"rgb(214,224,216)");s.addColorStop(0.62,"rgb(170,184,150)");s.addColorStop(1,"rgb(150,166,128)");c.fillStyle=s;c.fillRect(wx,wy,ww,wh);
    c.fillStyle="rgba(255,255,255,0.25)";for(let i=0;i<5;i++)c.fillRect(wx,wy+130+i*16,ww,3);c.restore();
    c.strokeStyle="rgba(150,142,128,0.9)";c.lineWidth=10;rr(c,wx,wy,ww,wh,26);c.stroke();c.strokeStyle="rgba(255,255,255,0.5)";c.lineWidth=2;rr(c,wx+5,wy+5,ww-10,wh-10,22);c.stroke();}
  // the luggage rack above them, and the ceiling's soft light
  c.fillStyle="rgb(170,164,152)";c.fillRect(0,196,W,10);c.fillStyle="rgba(255,255,255,0.4)";c.fillRect(0,196,W,2);
  g=c.createLinearGradient(0,0,0,190);g.addColorStop(0,"rgba(255,255,250,0.6)");g.addColorStop(1,"rgba(255,255,250,0)");c.fillStyle=g;c.fillRect(0,0,W,190);
  // the wall under the windows, and the floor
  c.fillStyle="rgb(196,188,174)";c.fillRect(0,500,W,330);c.fillStyle="rgb(120,112,104)";c.fillRect(0,830,W,H-830);
  // each row's seat back, in profile: a tall soft slab, leaning back a little
  for(const x of WG_ROWS)wg_seatBack(c,x);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.14)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,248,232,0.12)");c.fillStyle=g;c.fillRect(0,0,W,H);}
function wg_seatBack(c,x){const col=[112,122,124];ag_soft(c,cc=>{cc.moveTo(x-10,WG_SEAT.top+10);cc.bezierCurveTo(x-6,WG_SEAT.top-14,x+40,WG_SEAT.top-18,x+50,WG_SEAT.top+6);
    cc.lineTo(x+72,WG_SEAT.seat);cc.lineTo(x+14,WG_SEAT.seat+10);cc.closePath();},col,ag_lt(col,0.35),x+40,WG_SEAT.top+30,180,rgba(ag_dk(col,0.6),0.4),14);
  ag_soft(c,cc=>ag_rect(cc,x+10,WG_SEAT.seat-6,250,44,14),ag_dk(col,0.06),ag_lt(col,0.3),x+200,WG_SEAT.seat,140,rgba(ag_dk(col,0.6),0.35),10);}
// the armrest in front of a passenger
function wg_armrest(ctx,x){ag_soft(ctx,cc=>ag_rect(cc,x+40,WG_SEAT.seat-58,190,22,11),[150,140,124],[214,204,186],x+180,WG_SEAT.seat-58,90,"rgba(60,50,40,0.3)",6);
  ctx.fillStyle="rgba(90,84,76,0.9)";ctx.fillRect(x+210,WG_SEAT.seat-38,12,44);}
// a folded newspaper in a hand: in figure space, at the wrist
function wg_paper(c,h){if(!h||!h.near)return;const [x,y]=h.near;c.save();c.translate(x+60,y-10);c.rotate(-0.25);
  ag_soft(c,cc=>ag_rect(cc,-20,-110,150,180,6),[236,232,220],[255,255,250],60,-100,120,"rgba(60,50,40,0.25)",8);
  c.fillStyle="rgba(80,78,74,0.55)";for(let i=0;i<7;i++)c.fillRect(0,-90+i*22,(i%3?100:70),6);c.restore();}

/* ---------------------------------------------------------------- the driver's cab (the place "wgCab")
   Seen from the side: the cab's wall, its side window with the country streaming past (drawn live), the windscreen ahead, and the
   console in front of the driver, with the speedometer and, above it, the speed allowed (wg_speedo, live). */
const WG_CAB={win:[150,150,1060,330],dial:[1430,690,118],box:[1430,486]};
function wg_paintCab(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(178,182,184)");g.addColorStop(1,"rgb(140,144,146)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the side window's frame (the view through it is live)
  const [wx,wy,ww,wh]=WG_CAB.win;c.fillStyle="rgb(110,114,118)";rr(c,wx-18,wy-18,ww+36,wh+36,34);c.fill();
  // the windscreen, ahead, sloping: sky and the line ahead, bright
  c.save();c.beginPath();c.moveTo(1290,120);c.lineTo(W,60);c.lineTo(W,430);c.lineTo(1420,430);c.closePath();c.clip();
  g=c.createLinearGradient(0,60,0,430);g.addColorStop(0,"rgb(214,224,232)");g.addColorStop(0.7,"rgb(236,234,224)");g.addColorStop(0.71,"rgb(176,186,150)");g.addColorStop(1,"rgb(160,170,136)");c.fillStyle=g;c.fillRect(1280,60,700,380);
  c.strokeStyle="rgba(120,118,112,0.8)";c.lineWidth=4;c.beginPath();c.moveTo(1560,430);c.lineTo(1770,326);c.moveTo(1960,430);c.lineTo(1782,326);c.stroke();c.restore();
  c.strokeStyle="rgb(100,104,108)";c.lineWidth=22;c.beginPath();c.moveTo(1290,120);c.lineTo(1420,430);c.stroke();
  // the console: a sloped desk in front of the driver, matte grey-green
  const col=[118,130,126];ag_soft(c,cc=>{cc.moveTo(1040,1080);cc.lineTo(1100,560);cc.lineTo(1720,520);cc.lineTo(W,540);cc.lineTo(W,1080);cc.closePath();},col,ag_lt(col,0.35),1500,560,600,rgba(ag_dk(col,0.6),0.4),26);
  c.fillStyle="rgba(255,255,255,0.3)";c.beginPath();c.moveTo(1100,560);c.lineTo(1720,520);c.lineTo(W,540);c.lineTo(W,546);c.lineTo(1720,527);c.lineTo(1100,567);c.closePath();c.fill();
  // the seat's back behind the driver
  ag_soft(c,cc=>ag_rect(cc,150,560,220,560,40),[86,90,96],[140,146,152],330,600,200,"rgba(0,0,0,0.3)",14);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,26,22,0.18)");g.addColorStop(0.6,"rgba(30,26,22,0)");g.addColorStop(1,"rgba(255,248,232,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// the view through the side window: the country streaming past (off: how far it has moved), a signal now and then
function wg_cabWindow(ctx,off,draw){const [wx,wy,ww,wh]=WG_CAB.win;ctx.save();rr(ctx,wx,wy,ww,wh,22);ctx.clip();
  let g=ctx.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"rgb(214,224,232)");g.addColorStop(0.5,"rgb(232,232,224)");g.addColorStop(0.52,"rgb(170,182,144)");g.addColorStop(1,"rgb(136,150,116)");ctx.fillStyle=g;ctx.fillRect(wx,wy,ww,wh);
  // far hills hardly move; the near ground streams
  ctx.fillStyle="rgba(150,164,150,0.8)";for(let i=0;i<6;i++){const x=((i*260-off*0.04)%1560+1560)%1560-200;ctx.beginPath();ctx.ellipse(wx+x,wy+wh*0.5,180,26,0,Math.PI,0);ctx.fill();}
  ctx.fillStyle="rgba(240,240,226,0.35)";for(let i=0;i<14;i++){const x=((i*97-off*1.2)%1200+1200)%1200;ctx.fillRect(wx+x-100,wy+wh*0.62+((i*37)%5)*18,220,3);}
  if(draw)draw(ctx);ctx.restore();
  ctx.strokeStyle="rgba(255,255,255,0.4)";ctx.lineWidth=2;rr(ctx,wx+3,wy+3,ww-6,wh-6,20);ctx.stroke();}
/* the speedometer, and above it the speed allowed: wg_speedo(ctx, v, o): v the speed (km/h), o.allow the speed allowed, o.state
   "set" (blue), "over" (amber) or "under" (green), o.today a screen instead of a dial; o.a. The box's words are at least 30 px. */
function wg_speedo(ctx,v,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const [cx,cy,R]=WG_CAB.dial,[bx,by]=WG_CAB.box;ctx.save();ctx.globalAlpha*=a;
  // the dial: matte cream face, graphite ticks every 50, a needle
  ag_soft(ctx,cc=>cc.arc(cx,cy,R+16,0,TAU),[70,74,78],[130,134,138],cx+30,cy-40,R,null);
  ag_soft(ctx,cc=>cc.arc(cx,cy,R,0,TAU),[238,234,222],[255,255,248],cx+20,cy-30,R,"rgba(60,50,40,0.25)",14);
  const ang=u=>Math.PI*(0.8+1.4*u);for(let s=0;s<=250;s+=10){const u=s/250,a1=ang(u),r0=s%50?R-16:R-28;ctx.strokeStyle="rgba(50,52,56,0.9)";ctx.lineWidth=s%50?2:4;
    ctx.beginPath();ctx.moveTo(cx+Math.cos(a1)*r0,cy+Math.sin(a1)*r0);ctx.lineTo(cx+Math.cos(a1)*(R-6),cy+Math.sin(a1)*(R-6));ctx.stroke();}
  for(const s of [0,100,200]){const a1=ang(s/250);ag_T(ctx,String(s),cx+Math.cos(a1)*(R-54),cy+Math.sin(a1)*(R-54)+10,{w:700,size:28,align:"center",col:[60,62,66],deco:1});}
  // the allowed speed marked on the dial's edge, in the box's colour
  const col=o.state==="over"?AG.amber:o.state==="under"?AG.green:AG.blue,aa=ang((o.allow||0)/250);
  if(o.allow!=null){ctx.strokeStyle=rgba(col,0.95*(o.boxA==null?1:o.boxA));ctx.lineWidth=8;ctx.beginPath();ctx.arc(cx,cy,R-4,aa-0.05,aa+0.05);ctx.stroke();}
  const na=ang(clamp(v,0,250)/250);ctx.strokeStyle="rgb(40,40,44)";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx-Math.cos(na)*16,cy-Math.sin(na)*16);ctx.lineTo(cx+Math.cos(na)*(R-24),cy+Math.sin(na)*(R-24));ctx.stroke();
  ctx.fillStyle="rgb(50,52,56)";ctx.beginPath();ctx.arc(cx,cy,12,0,TAU);ctx.fill();
  ctx.restore();
  wg_allowBox(ctx,bx,by,o.allow,o.state,{a:a*(o.boxA==null?1:o.boxA),k:o.k});}
// the speed allowed: a box that fits its words, "allowed 210", in blue while set, amber while the train is over it, green once under
function wg_allowBox(ctx,x,y,allow,state,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||allow==null)return;const col=state==="over"?AG.amber:state==="under"?AG.green:AG.blue,
  t1="allowed",t2=String(allow),w=ag_tw(ctx,t1,{w:600,size:30})+ag_tw(ctx,t2,{w:800,size:46})+86,h=84;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,o.k));ag_box(ctx,x-w/2,y-h/2,w,h,16,{edge:col,edgeA:0.95,lw:3.4,glow:col,glowA:state==="over"?1:0.4});
  ag_T(ctx,t1,x-w/2+28,y+11,{w:600,size:30,col:AG.mut});ag_T(ctx,t2,x+w/2-28,y+17,{w:800,size:46,col,align:"right"});ctx.restore();}

/* ---------------------------------------------------------------- the control room (the place "wgControl")
   A long pale board on the wall, the line drawn along it from Tokyo to Osaka, a station marked on it here and there; desks in front
   with telephones. The board's lights (one for each train) and the controllers are live. */
const WG_BOARD={x0:190,x1:1730,y:300};
function wg_paintControl(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(214,216,210)");g.addColorStop(1,"rgb(190,192,186)");c.fillStyle=g;c.fillRect(0,0,W,H);
  ag_soft(c,cc=>ag_rect(cc,110,150,1700,300,14),[236,236,230],[255,255,252],1500,170,900,"rgba(60,56,50,0.2)",18);
  c.strokeStyle="rgba(150,148,140,0.9)";c.lineWidth=6;rr(c,110,150,1700,300,14);c.stroke();
  const B=WG_BOARD;c.strokeStyle="rgb(70,72,78)";c.lineWidth=8;c.lineCap="round";c.beginPath();c.moveTo(B.x0,B.y);c.lineTo(B.x1,B.y);c.stroke();
  c.strokeStyle="rgba(70,72,78,0.5)";c.lineWidth=3;c.beginPath();c.moveTo(B.x0,B.y+30);c.lineTo(B.x1,B.y+30);c.stroke();
  for(let i=0;i<=11;i++){const x=lerp(B.x0,B.x1,i/11);c.fillStyle="rgb(70,72,78)";c.beginPath();c.arc(x,B.y+15,i===0||i===11?14:9,0,TAU);c.fill();c.fillStyle="rgb(236,236,230)";c.beginPath();c.arc(x,B.y+15,i===0||i===11?7:4,0,TAU);c.fill();}
  // the wall under the board, and the floor
  c.fillStyle="rgb(176,178,172)";c.fillRect(0,600,W,10);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.14)");g.addColorStop(0.5,"rgba(40,34,28,0)");g.addColorStop(1,"rgba(255,248,232,0.1)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// the board's live parts: the two ends' names, and a light for each train, creeping along the line (u: how far each has gone)
function wg_board(ctx,t,o){o=o||{};const B=WG_BOARD;ag_T(ctx,"Osaka",B.x0,B.y+92,{w:700,size:32,col:[60,62,68]});ag_T(ctx,"Tokyo",B.x1,B.y+92,{w:700,size:32,col:[60,62,68],align:"right"});
  const trains=[[0.08,1],[0.31,1],[0.55,-1],[0.77,1],[0.92,-1]];for(const [u0,dir] of trains){const u=((u0+dir*t*0.004)%1+1)%1,x=lerp(B.x0,B.x1,u),y=dir>0?B.y:B.y+30;
    const g=ctx.createRadialGradient(x,y,0,x,y,26);g.addColorStop(0,"rgba(255,244,210,0.95)");g.addColorStop(1,"rgba(255,244,210,0)");ctx.fillStyle=g;ctx.fillRect(x-26,y-26,52,52);
    ctx.fillStyle="rgb(255,250,232)";ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fill();}}
// a desk seen from the front, its top's front edge at y, from x0 to x1; a telephone on it (lift 0 to 1: the handset rises)
function wg_ctrlDesk(ctx,x0,x1,y,phones){ag_desk(ctx,x0,y,x1-x0,{depth:60});for(const [px,lift] of phones)wg_phone(ctx,px,y-24,lift);}
function wg_phone(ctx,x,y,lift){ag_soft(ctx,cc=>{cc.moveTo(x-46,y+12);cc.lineTo(x-34,y-18);cc.lineTo(x+34,y-18);cc.lineTo(x+46,y+12);cc.closePath();},[36,36,40],[96,98,104],x+20,y-10,60,null);
  if(lift<1){ctx.save();ctx.translate(x,y-24);ag_soft(ctx,cc=>{ag_rect(cc,-52,-8,104,16,8);cc.moveTo(-52,0);cc.arc(-46,6,12,0,TAU);cc.moveTo(52,0);cc.arc(46,6,12,0,TAU);},[30,30,34],[90,92,98],20,-6,60,null);ctx.restore();}}

/* ---------------------------------------------------------------- the driver's controller: the lever in his hand (figure space, under the hand) */
function wg_lever(c,h){if(!h||!h.near)return;const [x,y]=h.near;c.save();
  ag_soft(c,cc=>ag_rect(cc,x+2,y+10,30,420,12),[54,56,60],[120,124,130],x+24,y+30,80,null);
  ag_soft(c,cc=>cc.arc(x+18,y+8,34,0,TAU),[40,42,46],[120,124,130],x+30,y-8,34,null);c.restore();}

/* ---------------------------------------------------------------- cards of the opening (words at least 28 px; no colour of the series' meanings
   but the green of the trip that got shorter, as the script has it)
   wg_mapCard: the new line, Osaka on the left and Tokyo on the right, as the map has them; p draws the line from Tokyo. */
function wg_mapCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=560,h=210,p=clamp(o.p==null?1:o.p,0,1);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,"THE NEW LINE",x+28,y+52,{w:700,size:28,ls:4,col:AG.kick});
  const B=[x+w-76,y+112,x+w-210,y+150,x+220,y+86,x+76,y+124];
  ctx.strokeStyle="rgba(70,72,78,0.22)";ctx.lineWidth=10;ctx.lineCap="round";ag_bzPath(ctx,B,0,1);ctx.stroke();
  if(p>0){ctx.strokeStyle="rgb(60,62,68)";ctx.lineWidth=7;ag_bzPath(ctx,B,0,p);ctx.stroke();}
  for(const [u,name,al] of [[0,"Tokyo","right"],[1,"Osaka","left"]]){const q=ag_bz(B,u),on=u===0?1:ag_in(p,0.9,0.1);
    ctx.fillStyle="rgb(60,62,68)";ctx.beginPath();ctx.arc(q[0],q[1],13,0,TAU);ctx.fill();ctx.fillStyle=rgba([238,236,230],1);ctx.beginPath();ctx.arc(q[0],q[1],6,0,TAU);ctx.fill();
    ag_T(ctx,name,al==="right"?q[0]+20:q[0]-20,y+184,{w:700,size:32,align:al,a:on});}
  ctx.restore();}
// a calm card of the opening: words {kick, title, sub}, the kicker in the room's grey (not the model's violet), o.edge for a meaning
function wg_card(ctx,x,y,w,words,o){o=o||{};return ag_textCard(ctx,x,y,w,words,Object.assign({kickCol:AG.kick},o));}

/* ---------------------------------------------------------------- the line seen from beside it: a long arrow ahead of the train, along the rails
   (it can't stop at once); and the thin blue line of the limits, drawn along the rails as far as we can see */
function wg_ahead(ctx,x0,x1,y,p,a){if(p<=0||a<=0)return;const xe=lerp(x0,x1,ag_eo(p));ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=8;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(xe-18,y);ctx.stroke();ag_arrowHead(ctx,xe,y,0,22,rgba(AG.amber,0.95));ctx.restore();}
function wg_blueLine(ctx,x0,x1,y,p,a){if(p<=0||a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.shadowColor=rgba(AG.blue,0.8);ctx.shadowBlur=18;ctx.strokeStyle=rgba(AG.blue,0.95);
  ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,x1,ag_sine(p)),y);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the control room's people and desks, live
   wg_controlRoom(ctx, t, o): the two controllers at their desks in front of the board, facing it from either side (people face us in
   three-quarter view), a telephone on each desk. They watch the board, their arms down behind the desks: a handset lifted to the ear
   put a hand on the face, and read as wrong. */
function wg_controlRoom(ctx,t,o){o=o||{};wg_board(ctx,t,{});
  ag_person(ctx,WG_P.ctrlA,520,700,0.72,{t,gaze:[3,-3],cut:900});
  ag_person(ctx,WG_P.ctrlB,1400,700,0.72,{t:t+1.3,flip:true,gaze:[3,-3],cut:900});
  for(const x0 of [200,1080]){const g=ctx.createLinearGradient(0,984,0,H);g.addColorStop(0,"rgb(150,154,150)");g.addColorStop(1,"rgb(126,130,126)");ctx.fillStyle=g;ctx.fillRect(x0+24,984,592,H-984);
    ctx.fillStyle="rgba(255,255,255,0.25)";ctx.fillRect(x0+24,984,592,2);ag_desk(ctx,x0,962,640,{depth:62});}
  wg_phone(ctx,700,930,0);wg_phone(ctx,1220,930,0);}

/* ---------------------------------------------------------------- the places, painted once */
AG_PLACES.wgPlatform=c=>wg_paintPlatform(c);
AG_PLACES.wgDusk=c=>wg_paintPlatform(c,{dusk:true});
AG_PLACES.wgCountry=c=>wg_paintCountry(c);
AG_PLACES.wgNight=c=>wg_paintNight(c);
AG_PLACES.wgCarriage=c=>wg_paintCarriage(c);
AG_PLACES.wgCab=c=>wg_paintCab(c);
AG_PLACES.wgControl=c=>wg_paintControl(c);

/* ===== Why we govern them: the room's own pieces =====
   The film's pieces in the module's lab, all prefixed wg_ / WG_ (shared/src is never changed for one film):
     the room's usual shot (WR): Jun standing at the left, the cards he talks about beside him, the agent in its ring in the middle,
     its tools at the wall's right, the four needs along the top of the wall, the switch on the wall below the cards, the oak tray on
     the floor, and production behind glass at the right;
     its pieces: the four question cards that turn over to their answers, the census count with its check, the plain job, a draft,
     the marks a person gives it, the outlined cards of what more it could do, the word cards from the series' earlier films, the owner
     tag, the switch and its wire, the log, the role card, the rails along the agent's arms, two bars, the mandate, the approve box,
     the frame on the floor where it works in test, the report, the shelf of three references, the cards that flick past, and the
     cards for what comes next. Colours keep the module's meanings: blue tools and structure (and limits), violet the model and what it
     does, orange data and evidence, green a check that passes or an approval, amber a check that fails. */

// a value worked out once per chapter (the cue times its scene uses)
function wg_once(sc,k,fn){sc.__wg=sc.__wg||{};if(!(k in sc.__wg))sc.__wg[k]=fn();return sc.__wg[k];}

/* ---------------------------------------------------------------- where things stand in the room's usual shot
   As the style prototype (style X) has it: Jun standing at the left, from the waist up; the cards he talks about beside him; the agent
   in its ring, floating on the wall with its shadow on the floor; its tools at the wall's right; the oak tray on the floor; production
   behind glass at the right, below the tools. The four needs run along the top of the wall, each lighting in its chapter. */
const WR={agent:{x:1140,y:470,R:150,r:78},jun:{x:250,y:610,s:0.98},cards:{x:476,y:250,w:430},
  four:{x1:1872,y:132,h:76,gap:14},tools:{x:1600,w:262,h:116,y:[270,420,570]},
  tray:{x:1400,y:792,w:300},glass:{x:1564,y:712,w:308,h:168},sw:{x:880,y:604}};
WR.hook=WR.agent.y+WR.agent.R;
// the lab with quieter marble where this film puts its words: the cards beside Jun, the four needs, the agent, the kicker, the tools
const WG_QUIET=[[690,445,260,230,0.55],[1240,170,660,70,0.5],[1140,470,250,230,0.45],[420,96,360,46,0.3],[1730,480,170,260,0.45]];
AG_PLACES.wgLab=c=>ag_paintLab(c,{quiet:WG_QUIET});
AG_PLACES.wgLabNight=c=>ag_paintLab(c,{quiet:WG_QUIET,night:true,lamp:[860,780]});
AG_ROOMS.wgLabNight="wgLab";                               // the lab by night is the lab: the camera glides from one to the other

/* ---------------------------------------------------------------- the agent
   wg_agent(ctx, t, o): the loop (ag_loop) at WR.agent unless o.x, o.y, o.R, o.r; o.core, o.think, o.lit, o.p, o.pulse, o.a, o.dim (0 to
   1: the band goes dark, as when it's stopped); its shadow on the floor; no label (A model, reasoning, hands and a loop names the model). Returns the steps' boxes. */
function wg_agent(ctx,t,o){o=o||{};const A=WR.agent,x=o.x==null?A.x:o.x,y=o.y==null?A.y:o.y,R=o.R||A.R,r=o.r||A.r,a=o.a==null?1:o.a,dim=clamp(o.dim||0,0,1);
  if(a<=0)return[];if(o.floor!==false)withA(ctx,a,()=>ag_floorShadow(ctx,x+AG.sdx*3,o.floorY||Math.max(y+R+130,700),R*1.15,22,0.2));
  return ag_loop(ctx,x,y,{R,r,t,a,p:o.p,core:(o.core==null?1:o.core)*(1-dim*0.92),think:(o.think||0)*(1-dim),lit:o.lit,col:o.col,pulse:o.pulse,label:o.label===undefined?null:o.label,stepA:o.stepA,stepK:o.stepK});}
// an arm from the ring's right towards a point: the curve ag_reach takes
function wg_armTo(x1,y1,o){o=o||{};const A=WR.agent,x=o.x==null?A.x:o.x,y=o.y==null?A.y:o.y,R=o.R||A.R,x0=x+R*0.62,y0=y+R*0.42+(o.dy||0);
  return[x0,y0,lerp(x0,x1,0.35),y0+(o.bow==null?60:o.bow),lerp(x0,x1,0.75),y1+(o.bow2==null?20:o.bow2),x1,y1];}
// the tools at the wall's right, read only: o.touch[i], o.a[i] (each), o.sub[i] a line of its own
function wg_tools(ctx,o){o=o||{};const T_=WR.tools,names=["Catalog","Query","Docs"];names.forEach((n,i)=>{const a=o.a?o.a[i]:1;if(a<=0)return;
  ag_tool(ctx,T_.x,T_.y[i],T_.w,T_.h,n,{a,touch:o.touch?o.touch[i]:0,sub:o.sub?o.sub[i]:undefined});});}

/* ---------------------------------------------------------------- the four needs, along the top of the wall
   wg_four(ctx, st): st.q[i] (0 to 1) each card arriving (it springs), st.flip[i] (0 the question, 1 the answer, turning between),
   st.lit[i] (0 to 1, a blue edge and glow: the chapter's own), st.pop[i] (0 to 1, a short swell as it's named), st.a; the row ends at WR.four.x1. Each card fits its words, and the row
   closes up as the questions turn into their shorter answers. Returns the boxes. */
const WG_ASK=["Who answers for it?","Under what name?","What may it touch?","Who checks its work?"],WG_NEED=["An owner","An identity","Limits","Review"];
function wg_four(ctx,st){st=st||{};const F=WR.four,a=st.a==null?1:st.a,out=[];
  const fl=i=>st.flip?clamp(st.flip[i],0,1):1,wq=WG_ASK.map(s=>ag_tw(ctx,s,{w:600,size:28})+56),wa=WG_NEED.map(s=>ag_tw(ctx,s,{w:800,size:30})+60);
  const ws=wq.map((q,i)=>lerp(q,wa[i],ag_sine(fl(i)))),tot=ws.reduce((s,w)=>s+w,0)+F.gap*3;let x=(st.x1||F.x1)-tot;
  for(let i=0;i<4;i++){const w=ws[i],y=st.y||F.y,b={x,y,w,h:F.h};out.push(b);x+=w+F.gap;const q=st.q?st.q[i]:1;if(q<=0||a<=0)continue;
    const f=fl(i),lit=st.lit?clamp(st.lit[i]||0,0,1):0,sx=Math.max(0.02,Math.abs(Math.cos(Math.PI*f))),qk=clamp(q,0,1.2);
    ctx.save();ctx.globalAlpha*=a*clamp(q*1.4,0,1);ctx.translate(b.x+w/2,y+F.h/2);const pp=1+0.12*clamp(st.pop?st.pop[i]||0:0,0,1);ctx.scale(sx*lerp(0.7,1,qk)*pp,lerp(0.7,1,qk)*pp);ctx.translate(-w/2,-F.h/2);
    ag_box(ctx,0,0,w,F.h,18,{edge:lit>0.02?AG.blue:null,edgeA:0.95*lit,lw:3,glow:lit>0.02?AG.blue:null,glowA:lit});
    // the words show only while the card faces us at nearly full size: turning edge-on or springing in, they'd read under 28 px
    const ta=clamp((lerp(0.7,1,qk)*pp*Math.sqrt(sx)-0.9)/0.08,0,1);
    if(f<0.5)ag_T(ctx,WG_ASK[i],w/2,F.h/2+10,{w:600,size:28,col:AG.ink,align:"center",a:ta});else ag_T(ctx,WG_NEED[i],w/2,F.h/2+11,{w:800,size:30,col:lit>0.5?AG.blue:AG.ink,align:"center",a:ta});
    ctx.restore();}
  return out;}

/* ---------------------------------------------------------------- the census count, its check, the plain job, a draft and its marks */
// the count (the answer of A model, reasoning, hands and a loop): o.fail 0 (green, "Matches the source") to 1 (amber, "Check failed"); o.gov (0 to 1) the line under its
// pill, "to the government"; o.w its width (520); o.k springs it in
function wg_count(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||520;if(a<=0)return null;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+90,lerp(0.6,1,o.k));
  const b=ag_textCard(ctx,x,y,w,{kick:"Census-day count",title:"18,412 students"},{kickCol:AG.kick});
  const f=clamp(o.fail||0,0,1);
  if(f<1)ag_pill(ctx,x+28+ag_tw(ctx,"Matches the source",{w:700,size:30})/2+48,b.y+b.h+44,"Matches the source",{icon:"tick",col:AG.green,a:1-f});
  if(f>0)ag_pill(ctx,x+28+ag_tw(ctx,"Check failed",{w:700,size:30})/2+48,b.y+b.h+44,"Check failed",{icon:"warn",col:AG.amber,a:f});
  if(o.gov>0)ag_T(ctx,"to the government",x+28,b.y+b.h+118,{w:600,size:28,col:AG.mut,a:o.gov});
  ctx.restore();return b;}
// the plain job that counts them: a blue card (tools and structure), with a green tick while it passes
function wg_plain(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+240,y+60,lerp(0.6,1,o.k));
  const b=ag_textCard(ctx,x,y,470,{kick:"Plain job",title:"every census day"},{kickCol:AG.blue,edge:AG.blue,edgeA:0.6});
  if(o.tick>0)withA(ctx,o.tick,()=>ag_tick(ctx,b.x+b.w-48,b.y+b.h/2,30,rgba(AG.green,1),5));ctx.restore();}
// a draft card, as it lies in the tray (x, y its centre): a pen and its words
function wg_draft(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=ag_tw(ctx,text,{w:700,size:28})+92,h=58;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,o.k));ag_box(ctx,x-w/2,y-h/2,w,h,14,{edge:AG.violet,edgeA:0.5});
  ag_pen(ctx,x-w/2+34,y,26,rgba(AG.violet,1));ag_T(ctx,text,x-w/2+60,y+10,{w:700,size:28});ctx.restore();}
// a person's mark: "reviewed · Jun" (a plain tick) or, approved, in green; it springs in like a stamp
function wg_mark(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,k=o.k==null?1:o.k;if(a<=0||k<=0)return;ctx.save();ctx.globalAlpha*=a*clamp(k*2,0,1);ag_about(ctx,x,y,lerp(1.5,1,clamp(k,0,1.3)));
  ag_pill(ctx,x,y,text,{icon:"tick",col:o.ok?AG.green:AG.ink});ctx.restore();}

/* ---------------------------------------------------------------- what more it could do: outlined cards, filled in at the end */
function wg_ghost(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=ag_tw(ctx,text,{w:700,size:30})+64,h=78,f=clamp(o.fill||0,0,1);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  if(f>0)ag_box(ctx,x,y,w,h,20,{a:f,edge:AG.violet,edgeA:0.5});
  ctx.strokeStyle=rgba(AG.mut,0.7*(1-f));ctx.lineWidth=2.4;ctx.setLineDash([10,9]);rr(ctx,x,y,w,h,20);ctx.stroke();ctx.setLineDash([]);
  ag_T(ctx,text,x+32,y+h/2+11,{w:700,size:30,col:mix(AG.mut,AG.ink,f)});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the word cards: what the series' earlier films showed */
function wg_word(ctx,x,y,w,film,title,sub,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+40,y+60,lerp(0.6,1,o.k));
  const b=ag_textCard(ctx,x,y,w,{kick:film,title,sub},{kickCol:AG.kick,edge:o.hl>0?AG.violet:null,edgeA:0.8*(o.hl||0)});ctx.restore();return b;}

/* ---------------------------------------------------------------- the owner tag, the badge, the switch and its wire
   wg_tag(ctx, hx, hy, text, o): a paper tag on a string from a hook at (hx, hy); o.dx, o.dy where the tag's middle hangs, o.sw a
   swing (radians), o.a. wg_hand: an empty, hand-shaped outline, "next owner". */
function wg_tag(ctx,hx,hy,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const dx=o.dx==null?-120:o.dx,dy=o.dy==null?70:o.dy,w=ag_tw(ctx,text,{w:700,size:28})+70,h=56;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(hx,hy);ctx.rotate(o.sw||0);
  ctx.strokeStyle="rgba(87,82,76,0.85)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(dx*0.4,dy*0.3,dx+w/2-22,dy);ctx.stroke();
  ctx.translate(dx,dy);ag_card(ctx,c=>{c.moveTo(-w/2+16,-h/2);c.lineTo(w/2,-h/2);c.lineTo(w/2,h/2);c.lineTo(-w/2+16,h/2);c.lineTo(-w/2,0);c.closePath();},{x:-w/2,y:-h/2,w,h},{});
  ctx.fillStyle="rgba(87,82,76,0.6)";ctx.beginPath();ctx.arc(w/2-22,0,5,0,TAU);ctx.fill();
  ag_T(ctx,text,-w/2+26,10,{w:700,size:28});ctx.restore();}
function wg_hand(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=3;ctx.setLineDash([9,8]);ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(x-46,y+60);ctx.lineTo(x-50,y-6);ctx.quadraticCurveTo(x-50,y-30,x-34,y-30);ctx.lineTo(x-30,y-64);ctx.quadraticCurveTo(x-22,y-80,x-14,y-64);ctx.lineTo(x-12,y-40);
  ctx.lineTo(x-8,y-84);ctx.quadraticCurveTo(x,y-100,x+8,y-84);ctx.lineTo(x+8,y-40);ctx.lineTo(x+16,y-76);ctx.quadraticCurveTo(x+24,y-90,x+30,y-74);ctx.lineTo(x+28,y-30);
  ctx.lineTo(x+40,y-56);ctx.quadraticCurveTo(x+52,y-64,x+54,y-48);ctx.lineTo(x+40,y+10);ctx.quadraticCurveTo(x+34,y+44,x+30,y+60);ctx.stroke();ctx.setLineDash([]);
  ag_T(ctx,"next owner",x,y+104,{w:700,size:28,col:AG.mut,align:"center"});ctx.restore();}
// a pale oak switch with a graphite lever: on 1 (up: the agent runs, a small violet light) to 0 (down: stopped)
function wg_switch(ctx,x,y,on,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;on=clamp(on,0,1);ctx.save();ctx.globalAlpha*=a;
  ag_soft(ctx,cc=>ag_rect(cc,x-48,y-30,96,60,12),AG_OAK.base,AG_OAK.hi,x+20,y-24,70,rgba(AG_OAK.dark,0.55),8);
  const ang=lerp(0.75,-0.75,on),L=46;ctx.strokeStyle="#36373C";ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y+6);ctx.lineTo(x+Math.sin(ang)*L,y+6-Math.cos(ang)*L*0.9);ctx.stroke();
  ctx.fillStyle="#2B2B32";ctx.beginPath();ctx.arc(x+Math.sin(ang)*L,y+6-Math.cos(ang)*L*0.9,9,0,TAU);ctx.fill();
  const lc=mix([150,148,144],AG.violet,on);ctx.save();if(on>0.5){ctx.shadowColor=rgba(AG.violet,0.7*on);ctx.shadowBlur=12;}ctx.fillStyle=rgba(lc,1);ctx.beginPath();ctx.arc(x+32,y-14,6,0,TAU);ctx.fill();ctx.restore();
  ctx.restore();}
// a graphite wire through points (a smooth line), drawn as far as p (0 to 1); o.lit lights it violet (current flows)
function wg_wire(ctx,pts,p,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a;if(a<=0)return;let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
  let left=L*clamp(p,0,1);ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.lineJoin="round";
  const path=()=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);let r=left;for(let i=1;i<pts.length&&r>0;i++){const u=Math.min(1,r/seg[i-1]);ctx.lineTo(lerp(pts[i-1][0],pts[i][0],u),lerp(pts[i-1][1],pts[i][1],u));r-=seg[i-1];}};
  ctx.strokeStyle=rgba(AG.shadow,0.16);ctx.lineWidth=7;ctx.save();ctx.translate(AG.sdx*0.6,6);path();ctx.stroke();ctx.restore();
  ctx.strokeStyle="#3A3B40";ctx.lineWidth=4.5;path();ctx.stroke();
  if(o.lit>0){ctx.strokeStyle=rgba(AG.violet,0.85*o.lit);ctx.lineWidth=2;path();ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- the log: what the agent did, line by line, and under whose name
   rows: [{text, who, agent (true: its own name, violet), a, hl (0 to 1, lit)}]; o.kick ("Log"); o.n how many rows tall it is (it grows as
   one arrives; all of them unless given); returns the card */
function wg_log(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const lh=44,h=28+38+(o.n==null?rows.length:o.n)*lh+18;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,(o.kick||"Log").toUpperCase(),x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});
  rows.forEach((r,i)=>{const ry=y+66+i*lh,ra=r.a==null?1:r.a;if(ra<=0)return;
    if(r.hl>0){ctx.fillStyle=rgba(AG.violet,0.08*r.hl);rr(ctx,x+14,ry+2,w-28,lh-4,10);ctx.fill();}
    ag_T(ctx,r.text,x+28,ry+32,{w:600,size:28,a:ra});
    if(r.who)ag_T(ctx,r.who,x+w-28,ry+32,{w:700,size:28,align:"right",col:r.agent?AG.violet:AG.mut,a:ra});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the role card: rights from a role
   lines [{text, lock (a blue lock before it), a, hl}]; o.k */
function wg_role(ctx,x,y,w,role,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;lines=lines||[];const h=28+38+44+lines.length*42+(lines.length?20:0)+18;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.55});
  ag_T(ctx,"ROLE",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,role,x+28,y+98,{w:700,size:36});
  lines.forEach((l,i)=>{const ly=y+108+i*42+34,la=l.a==null?1:l.a;if(la<=0)return;
    if(l.hl>0){ctx.fillStyle=rgba(AG.blue,0.09*l.hl);rr(ctx,x+14,ly-30,w-28,40,10);ctx.fill();}
    if(l.lock)ag_lock(ctx,x+42,ly-6,26,rgba(AG.blue,la));ag_T(ctx,l.text,x+(l.lock?68:28),ly,{w:600,size:28,a:la});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the rails: oak rails along the agent's arms to its tools, and no further */
function wg_rail(ctx,p,u,a){if(u<=0||a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  ctx.strokeStyle=rgba(AG.shadow,0.14);ctx.lineWidth=26;ctx.save();ctx.translate(AG.sdx,10);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  ctx.strokeStyle=rgba(AG_OAK.dark,1);ctx.lineWidth=24;ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.strokeStyle=rgba(AG_OAK.base,1);ctx.lineWidth=19;ag_bzPath(ctx,p,0,u);ctx.stroke();
  ctx.strokeStyle=rgba(AG_OAK.hi,0.9);ctx.lineWidth=3;ctx.save();ctx.translate(0,-5);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  // its end: a small oak stop
  if(u>0.98){const q=ag_bz(p,1);ag_soft(ctx,cc=>cc.arc(q[0],q[1],16,0,TAU),AG_OAK.base,AG_OAK.hi,q[0]+4,q[1]-6,16,rgba(AG_OAK.dark,0.6),5);}
  ctx.restore();}

/* ---------------------------------------------------------------- two bars: what it can do, and what it may do alone (set by a person) */
function wg_bars(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const bar=(yy,label,fill,col,knob)=>{ag_T(ctx,label,x,yy,{w:700,size:30});const by=yy+22,bh=30;
    ag_soft(ctx,cc=>ag_rect(cc,x,by,w,bh,bh/2),[222,219,212],[240,238,233],x+w*0.8,by,w,"rgba(46,38,28,0.25)",8);
    if(fill>0){ctx.save();ctx.shadowColor=rgba(col,0.35);ctx.shadowBlur=10;ctx.fillStyle=rgba(col,0.9);rr(ctx,x+3,by+3,Math.max(bh-6,(w-6)*fill),bh-6,(bh-6)/2);ctx.fill();ctx.restore();}
    if(knob>0){const kx=x+3+Math.max(bh-6,(w-6)*fill);ctx.save();ctx.globalAlpha*=knob;ag_soft(ctx,cc=>cc.arc(kx,by+bh/2,22,0,TAU),AG_OAK.base,AG_OAK.hi,kx+6,by+4,22,rgba(AG_OAK.dark,0.6),6);ctx.restore();}};
  bar(y,"what it can do",clamp(o.can||0,0,1),AG.violet,0);bar(y+120,"what it may do alone",clamp(o.alone||0,0,1),AG.blue,o.knob||0);ctx.restore();}

/* ---------------------------------------------------------------- the mandate: the shape of one, its headings with blank lines; signed by its owner */
function wg_mandate(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const heads=["which tasks","where","how each is checked","signed by its owner"],rowH=62,last=84,h=28+38+3*rowH+last+52+20;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.5});
  ag_T(ctx,"MANDATE",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});
  heads.forEach((s,i)=>{const hy=y+66+i*rowH,ly=hy+(i<3?56:last-8);ag_T(ctx,s,x+28,hy+30,{w:700,size:28,col:AG.mut});ctx.strokeStyle="rgba(60,50,40,0.25)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28,ly);ctx.lineTo(x+w-28,ly);ctx.stroke();});
  // the owner's signature on the last line: one loose stroke, drawn as far as o.sign
  const sg=clamp(o.sign||0,0,1);if(sg>0){const sy=y+66+3*rowH+last-22,sx=x+w*0.3;ctx.strokeStyle=rgba(AG.ink,0.85);ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
    const n=60;for(let k=0;k<=n*sg;k++){const u=k/n,px=sx+u*w*0.46,py=sy-14*Math.sin(u*TAU*3.2)*(1-u*0.5)-u*6;k?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();}
  const fy=y+66+3*rowH+last+40;ag_T(ctx,"can be withdrawn at any time",x+28,fy,{w:600,size:28,col:AG.blue});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- review: the approve box an agent never has, the frame where it works in
   test, its report, and the marks of the people who check */
function wg_approve(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const g=clamp(o.grey||0,0,1),w=ag_tw(ctx,"approve",{w:700,size:30})+100,h=60;
  ctx.save();ctx.globalAlpha*=a*(1-0.55*g);ag_box(ctx,x-w/2,y-h/2,w,h,16,{edge:mix(AG.green,[150,148,144],g),edgeA:0.8});
  ctx.strokeStyle=rgba(mix(AG.green,[150,148,144],g),1);ctx.lineWidth=3;rr(ctx,x-w/2+24,y-14,28,28,6);ctx.stroke();
  ag_T(ctx,"approve",x-w/2+68,y+11,{w:700,size:30,col:mix(AG.ink,[140,138,134],g)});
  if(g>0){ctx.strokeStyle=rgba([120,118,114],0.9*g);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-w/2+20,y);ctx.lineTo(lerp(x-w/2+20,x+w/2-20,g),y);ctx.stroke();}ctx.restore();}
// a pale blue frame on the floor, in perspective: (x, y) its front edge's middle, w wide, d deep; o.label under it
function wg_testFrame(ctx,x,y,w,d,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const ins=d*0.4;ctx.save();ctx.globalAlpha*=a;
  ctx.beginPath();ctx.moveTo(x-w/2+ins,y-d);ctx.lineTo(x+w/2-ins,y-d);ctx.lineTo(x+w/2,y);ctx.lineTo(x-w/2,y);ctx.closePath();ctx.fillStyle=rgba(AG.blue,0.07);ctx.fill();
  ctx.strokeStyle=rgba(AG.blue,0.85);ctx.lineWidth=3.4;ctx.setLineDash([16,10]);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  if(o.label)ag_pill(ctx,x,y+46,o.label,{col:AG.blue,a});}
// production behind its glass: the word "Production", and the tables the real work reads, small, in rows
function wg_production(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_T(ctx,"Production",x+28,y+96,{w:700,size:30,col:AG.mut});
  const tw=170,th=118,g=26,nc=Math.max(1,Math.floor((w-56+g)/(tw+g))),nr=Math.max(1,Math.floor((h-160+g)/(th+g))),x0=x+(w-(nc*tw+(nc-1)*g))/2;
  for(let r=0;r<nr;r++)for(let i=0;i<nc;i++){const tx=x0+i*(tw+g),ty=y+128+r*(th+g);ag_box(ctx,tx,ty,tw,th,10,{});
    ctx.fillStyle=rgba(AG.blue,0.3);rr(ctx,tx+10,ty+12,tw-20,14,5);ctx.fill();
    for(let k=0;k<4;k++){ctx.fillStyle="rgba(60,50,40,0.13)";ctx.fillRect(tx+12,ty+42+k*18,(tw-24)*(k%2?0.8:1),6);}}
  ctx.restore();}

/* ---------------------------------------------------------------- the shelf of references: an oak shelf, three books lying on it, spines out
   books [title, ...]; o.k[i] each book sliding in (0 to 1) from the right; returns the shelf's top */
function wg_shelf(ctx,x,y,w,books,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2+AG.sdx*2,y+40,w*0.52,16,0.2);
  ag_soft(ctx,cc=>ag_rect(cc,x,y,w,22,6),AG_OAK.base,AG_OAK.hi,x+w*0.8,y,w,rgba(AG_OAK.dark,0.55),6);
  const cols=[[226,222,214],[214,220,224],[222,214,206]],bh=62;let top=y;
  books.forEach((s,i)=>{const k=o.k?o.k[i]:1;if(k<=0)return;const bw=Math.min(w-60,ag_tw(ctx,s,{w:700,size:30})+90),bx=x+30+i*10+(1-ag_eo(k))*600,by=y-(i+1)*bh;
    ctx.save();ctx.globalAlpha*=clamp(k*2,0,1);ag_soft(ctx,cc=>ag_rect(cc,bx,by,bw,bh-4,8),cols[i%3],[255,255,252],bx+bw*0.8,by,bw,"rgba(46,38,28,0.28)",10);
    ctx.fillStyle="rgba(60,50,40,0.18)";ctx.fillRect(bx+18,by+6,4,bh-16);ctx.fillRect(bx+bw-22,by+6,4,bh-16);
    ag_T(ctx,s,bx+40,by+bh/2+8,{w:700,size:30});ctx.restore();top=by;});
  ctx.restore();return top;}

/* ---------------------------------------------------------------- the people of the room, as this film poses them */
// Jun standing at the left, as the prototype has him, his arms down: o.p (ag_person's gaze, nod, talk), o.dx (a step), o.a (at night he has gone home)
function wg_jun(ctx,t,o){o=o||{};const J=WR.jun,a=o.a==null?1:o.a;if(a<=0.01)return null;let h=null;
  withA(ctx,a,()=>{h=ag_person(ctx,"jun",J.x+(o.dx||0),J.y,J.s,Object.assign({t,gaze:[3,0]},o.p||{}));});return h;}
// a hand's place in the frame, from ag_person's figure-space hands: who drawn at (x, y), size s, flip
function wg_handAt(h,x,y,s,flip){if(!h||!h.near)return null;const A=AG_FIG.anchor;return[x+(flip?-1:1)*(h.near[0]-A[0])*s,y+(h.near[1]-A[1])*s];}

/* ---------------------------------------------------------------- the room's usual things, in their places
   wg_tagOn: the owner tag on the ring's hook (o.dy lifts it, o.sw swings it); wg_badgeOn: the badge beside it, its name turning over
   (flip 0 "Jun Park", 1 "census agent"); wg_switchWire: the switch on the wall, wired to the badge's hook. */
function wg_tagOn(x,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;wg_tag(x,WR.agent.x-30+(o.mx||0),WR.hook-2+(o.dy||0),"owner · Jun Park",{dx:-170,dy:80,sw:o.sw||0,a});}
function wg_badgeOn(x,tt,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const f=clamp(o.flip||0,0,1),sx=Math.max(0.03,Math.abs(Math.cos(Math.PI*f)));
  const hx=WR.agent.x+50,hy=WR.hook-2;x.save();x.globalAlpha*=a;x.translate(hx,hy+(o.dy||0));x.scale(sx,1);x.translate(-hx,-hy);
  wg_badge(x,hx,hy,f<0.5?"Jun Park":"census agent",{t:tt,drop:56,ta:clamp((Math.sqrt(sx)-0.9)/0.08,0,1)});x.restore();}
// the series' badge (ag_badge in shared/src/agent.js), drawn here so its name can fade while it turns edge-on (o.ta), where it would
// read under 28 px; the same badge otherwise
function wg_badge(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const drop=o.drop||90,sw=Math.sin((o.t||0)*1.3)*0.025,w=ag_tw(ctx,text,{w:700,size:28})+48,h=58;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(sw);
  ctx.strokeStyle=rgba(AG.blue,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-26,0);ctx.lineTo(-8,drop-10);ctx.moveTo(26,0);ctx.lineTo(8,drop-10);ctx.stroke();
  ctx.fillStyle="#9AA0A8";ctx.fillRect(-9,drop-14,18,14);
  ag_box(ctx,-w/2,drop,w,h,10,{});ctx.fillStyle=rgba(AG.blue,0.85);ctx.fillRect(-w/2+10,drop+4,w-20,5);
  ag_T(ctx,text,0,drop+h/2+15,{w:700,size:28,align:"center",a:o.ta==null?1:o.ta});ctx.restore();}
function wg_switchWire(x,on,o){o=o||{};const S_=WR.sw,a=o.a==null?1:o.a;if(a<=0)return;
  wg_wire(x,[[S_.x+40,S_.y],[1000,S_.y],[1060,646],[WR.agent.x+50,WR.hook+4]],o.p==null?1:o.p,{lit:on*(o.lit==null?1:o.lit),a});wg_switch(x,S_.x,S_.y,on,{a});}
// one of the four rules of its own: a card at the wall's right (x, y its top left, w wide), its number in a blue disc, then the rule
// in lines of its own; returns its height
function wg_rule(ctx,x,y,w,n,lines,o){o=o||{};const a=o.a==null?1:o.a,h=Math.max(84,44+lines.length*40);if(a<=0)return h;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,18,{edge:AG.blue,edgeA:0.45});
  ctx.fillStyle=rgba(AG.blue,0.92);ctx.beginPath();ctx.arc(x+48,y+42,20,0,TAU);ctx.fill();ag_T(ctx,String(n),x+48,y+52,{w:800,size:28,col:[255,255,255],align:"center"});
  lines.forEach((l,i)=>ag_T(ctx,l,x+86,y+52+i*40,{w:600,size:30}));ctx.restore();return h;}
// the agent, its owner tag and its badge, moved as one to (cx, cy) and scaled by s: for a shot that frames the room differently
function wg_group(x,tt,cx,cy,s,o){o=o||{};const A=WR.agent;x.save();x.translate(cx,cy);x.scale(s,s);x.translate(-A.x,-A.y);
  wg_agent(x,tt,o);wg_tagOn(x,{});wg_badgeOn(x,tt,{flip:1});x.restore();}

/* ===== Why we govern them: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): a place painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice. */

// the kicker, on the frame (not in the room, where the camera would move it): the same in every shot, so a glide between two shots of
// the room never shows it twice
const WG_KICK=(x,S,o)=>{x.save();setScreen(x,S);ag_kicker(x,"1.7","Why we govern them",o);x.restore();};
// where something that moves between two shots of the room is: where it was until the shot's dissolve is over, then on its way (1 s)
const wg_slide=(tt,t0,a,b,d)=>{const u=ag_sine((tt-t0)/(d||1.0));return{x:lerp(a.x,b.x,u),y:lerp(a.y,b.y,u)};};

/* ---------------------------------------------------------------- pieces the scenes share */
// the train at rest at the platform, or easing out: u 0 (at rest) to 1 (gone); dusk at evening
function wg_platformShot(x,tt,o){o=o||{};const u=clamp(o.u||0,0,1),nose=1660+1900*u*u;
  wg_train(x,nose,WG_PLAT.rail,{k:1,cars:2,people:1,driver:1,lamp:o.dusk?0.6:0.25});wg_platformFront(x,o.dusk);
  if(o.people!==false){ag_person(x,WG_P.manHat,250,712,0.95,{t:tt,gaze:[4,-1]});ag_person(x,WG_P.womanCoat,470,700,0.92,{t:tt+0.7,gaze:[4,-1]});}}
// the line seen from beside it, riding with the train: the masts whip past (off grows with time), the train stays in frame
function wg_lineShot(x,tt,o){o=o||{};const off=(o.off||0),k=o.k||0.8;
  wg_lineFront(x,off);
  if(o.signal){const P=1700,sx=((o.signal-off)%P+P)%P;wg_signal(x,sx-200,WG_LINE.rail+6,180,o.lamp||null,{s:0.8,glow:o.lamp?0.5:0});}
  wg_train(x,o.nose==null?1500:o.nose,WG_LINE.rail,{k,cars:4,today:!!o.today,lamp:0.2});}
// the cab: the side window streaming, the driver, the speedometer (o.v the speed, o.allow, o.state, o.boxA), o.hand his hand on the lever
function wg_cabShot(x,tt,o){o=o||{};wg_cabWindow(x,tt*1500,o.sig?(q=>o.sig(q)):null);
  ag_person(x,WG_P.driver,560,600,1.05,{t:tt,gaze:o.gaze||[4,0],pose:o.hand?{near:[64,96,"hold"]}:null,holdBack:o.hand?wg_lever:null});
  wg_speedo(x,o.v==null?205:o.v,{allow:o.allow,state:o.state,boxA:o.boxA});}
// cards that circle the agent too fast to read, then slow to a stop and close up in an arc at its left, where they can be read:
// t0 when they come, T0 when they start to slow, D how long that takes. The phase is the speed's integral, so they never run backwards.
const WG_FLICK=["loop","check","read","plan"];
function wg_flick(x,tt,t0,T0,D){const A=WR.agent,X=clamp((tt-T0)/D,0,1),s=ag_sine(X),K=TAU/2.2*2.6,
  rest=tt<T0?(T0-tt)+D/2:D*(0.5-0.5*X-Math.sin(Math.PI*X)/(2*Math.PI));
  WG_FLICK.forEach((w,i)=>{const ph=2.44+lerp(i*TAU/4,i*0.454,s)-K*rest,px=A.x+Math.cos(ph)*(A.R+230),py=A.y+Math.sin(ph)*(A.R+70),a=ag_in(tt,t0+i*0.15,0.3);
    if(a<=0)return;x.save();if(s<0.7)x.filter="blur("+lerp(5,0,clamp(s/0.7,0,1))+"px)";ag_pill(x,px,py,w,{a,size:30});x.restore();});}
// the blue line round the tray: the limits built into how it works
function wg_trayLine(x,p,a){if(p<=0||a<=0)return;const T_=WR.tray,x0=T_.x-T_.w/2-26,x1=T_.x+T_.w/2+26,y0=T_.y-70-20,y1=T_.y+16+18;
  const pts=[[x0+30,y0],[x1-30,y0],[x1,y1],[x0,y1],[x0+30,y0]];x.save();x.globalAlpha*=a;x.shadowColor=rgba(AG.blue,0.6);x.shadowBlur=12;
  wg_wire(x,pts,p,{});x.restore();x.save();x.globalAlpha*=a;x.strokeStyle=rgba(AG.blue,0.95);x.lineWidth=5;x.lineJoin="round";x.lineCap="round";
  let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
  let r=L*p;x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length&&r>0;i++){const u=Math.min(1,r/seg[i-1]);x.lineTo(lerp(pts[i-1][0],pts[i][0],u),lerp(pts[i-1][1],pts[i][1],u));r-=seg[i-1];}x.stroke();x.restore();}

/* ---------------------------------------------------------------- 1 · Built into the line */
scene("line",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({tokyo:wAt(sc,"opening","Tokyo"),fast:wAt(sc,"first","two hundred and ten"),out:wAt(sc,"first","built for"),
    km:wAt(sc,"speed","a kilometre"),sig:wAt(sc,"signals","the signals"),slow:wAt(sc,"signals","and the train"),tok:wAt(sc,"missed","in Tokyo"),
    faster:wAt(sc,"cab","goes faster"),slows:wAt(sc,"cab","slows itself down"),answers:wAt(sc,"driver","answers"),
    six:wAt(sc,"trip","six and a half"),four:wAt(sc,"trip","to four"),since:wAt(sc,"safe","since that first day"),watch:wAt(sc,"uni","no one can watch"),
    round:wAt(sc,"limits","its limits")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Japan, 1964: the platform in morning light, the train waiting; the new line on a map, and the speed it was built for
    {at:0,place:"wgPlatform",keys:[[0,960,540,1.04],[P.tokyo,960,540,1]],push:0.02,draw:(x,tt)=>{wg_platformShot(x,tt,{u:clamp((tt-P.out-0.6)/(c.speed-P.out-0.6),0,1)});
      wg_corner(x,"Japan · 1964",ag_in(tt,0.8,0.8));wg_mapCard(x,640,150,{a:ag_in(tt,P.tokyo-0.2,0.4),k:ag_spr(tt,P.tokyo-0.2),p:ag_sine((tt-P.tokyo)/1.8)});
      ag_pill(x,920,416,"built for 210 km/h",{a:ag_in(tt,P.fast,0.5)});}},
    // at that speed: riding beside it, the masts whip past
    {at:c.speed,place:"wgCountry",keys:[[c.speed,960,540,1]],push:0.02,draw:(x,tt)=>{wg_lineShot(x,tt,{off:tt*2400});
      ag_pill(x,560,300,"1 km every 17 seconds",{a:ag_in(tt,P.km,0.5)});wg_corner(x,"Japan · 1964",1);}},
    // the driver can't read a signal beside the track in time: it smears past the window before his eyes reach it
    {at:c.signals,place:"wgCab",keys:[[c.signals,960,540,1]],push:0.02,draw:(x,tt)=>{const us=[(tt-P.sig+0.4)/0.8,(tt-P.sig-1.3)/0.8];
      wg_cabShot(x,tt,{v:208,gaze:[lerp(4,-5,ag_sine((tt-P.sig-0.1)/0.7)),0],sig:q=>{for(const u of us)if(u>-0.1&&u<1.1)wg_signal(q,lerp(1320,-80,u),560,240,"green",{s:0.8,blur:150,glow:0.7});}});}},
    // and it can't slow down at once: an arrow runs on ahead of it, past the next signal
    {at:P.slow,place:"wgCountry",keys:[[P.slow,960,540,1]],push:0.015,draw:(x,tt)=>{wg_lineShot(x,tt,{off:tt*2400,nose:1000});
      wg_signal(x,1640,WG_LINE.rail+6,180,null,{s:0.8});wg_ahead(x,1010,1850,WG_LINE.rail-44,(tt-P.slow-0.3)/2.4,1);}},
    // Tokyo, 1962: one red signal over plain track, at night, and what a missed one cost
    {at:c.missed,place:"wgNight",keys:[[c.missed,1000,540,1],[P.tok,1060,520,1.06]],push:0.03,draw:(x,tt)=>{wg_signal(x,1330,700,330,"red",{s:1.2,glow:0.7+0.3*ag_in(tt,c.missed+0.4,1.2)});
      wg_card(x,230,250,600,{kick:"Tokyo · 1962",title:"A red signal missed",sub:"160 people died"},{a:ag_in(tt,P.tok,0.8)});}},
    // passengers' lives rest on one person: the carriage, slowly, row by row
    {at:c.rest,place:"wgCarriage",keys:[[c.rest,760,560,1.14],[c.rest+0.2,1160,560,1.14]],d:5.6,push:0,draw:(x,tt)=>{wg_passengers(x,tt);}},
    // something had to change: the driver alone at the front
    {at:c.change,place:"wgCab",keys:[[c.change,700,560,1.12]],push:0.03,draw:(x,tt)=>{wg_cabShot(x,tt,{v:208,gaze:[4,0]});}},
    // the limits built into the line itself: a thin blue line along the rails, ahead of the train, as far as we can see
    {at:c.build,place:"wgCountry",keys:[[c.build,960,540,1]],push:0.02,draw:(x,tt)=>{wg_lineShot(x,tt,{off:tt*2400,nose:900});
      wg_blueLine(x,900,1960,WG_LINE.rail-1,(tt-wAt(sc,"build","the limits"))/1.8,1);}},
    // the signal in the cab: the speed allowed; faster, and it turns amber, and the train slows itself; then lower for what's ahead
    {at:c.cab,place:"wgCab",keys:[[c.cab,1120,560,1.08],[c.cab+0.4,1360,600,1.3]],d:1.8,push:0.02,draw:(x,tt)=>{
      const f=P.faster,dn=c.room-2.2,v=ag_keys(tt,[[c.cab,200],[f,203],[f+0.9,221],[f+1.3,221],[f+2.6,204],[f+3.0,206.5],[f+3.4,205],[dn+0.3,205],[dn+1.5,157],[dn+1.8,158.5],[dn+2.1,158]]);
      const allow=tt<dn?210:160,state=v>allow?"over":tt>f+0.5?"under":"set";
      wg_cabShot(x,tt,{v,allow,state,boxA:ag_in(tt,wAt(sc,"cab","the speed allowed"),0.5),gaze:[5,-1]});}},
    // one control room watches every train on the line
    {at:c.room,place:"wgControl",keys:[[c.room,960,540,1]],push:0.025,draw:(x,tt)=>{wg_controlRoom(x,tt,{});}},
    // and the driver still drives, and answers for the train
    {at:c.driver,place:"wgCab",keys:[[c.driver,820,580,1.1]],push:0.03,draw:(x,tt)=>{wg_cabShot(x,tt,{v:206,allow:210,state:"under",hand:true,gaze:[5,-1]});
      ag_pill(x,880,860,"the driver drives, and answers for the train",{a:ag_in(tt,P.answers,0.5)});}},
    // it worked: the train in full daylight, the trip from six and a half hours to four, and no passenger lost since
    {at:c.worked,place:"wgCountry",keys:[[c.worked,960,540,1]],push:0.02,draw:(x,tt)=>{wg_lineShot(x,tt,{off:tt*2400,nose:1180});
      const ta=1-ag_in(tt,P.since-0.4,0.5);
      wg_card(x,150,170,300,{kick:"before",title:"6 h 30"},{a:ag_in(tt,P.six,0.5)*ta,k:ag_spr(tt,P.six)});
      wg_card(x,480,170,300,{kick:"1964",title:"4 h 00"},{a:ag_in(tt,P.four,0.5)*ta,k:ag_spr(tt,P.four),edge:AG.green,kickCol:AG.green});
      wg_card(x,150,170,780,{kick:"since 1964",title:"No passenger has died",sub:"in a derailment or a collision"},{a:ag_in(tt,P.since,0.7),k:ag_spr(tt,P.since)});}},
    // the limits weren't there because the trains were bad: evening at the platform, the train at rest
    {at:c.bad,place:"wgDusk",keys:[[c.bad,1100,540,1.06]],push:0.03,draw:(x,tt)=>{wg_platformShot(x,tt,{dusk:true,people:false});}},
    // at the university, Jun's agent is fast too: cards flick past it, too fast to follow; the limits built into how it works
    {at:c.uni,place:"wgLab",keys:[[c.uni,960,540,1]],push:0,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.8),()=>{const st=ag_sine((tt-P.round-0.4)/2.2);
      ag_sandbox(x,WR.tray.x,WR.tray.y,WR.tray.w);wg_trayLine(x,(tt-P.round)/2.0,1);
      wg_agent(x,tt,{think:1-st*0.7,pulse:{deg:(tt*lerp(520,90,st))%360,a:1}});
      if(tt>c.more+0.4)for(const i of [0,1]){const u=ag_sine((tt-c.more-0.4-i*0.5)/1.3);ag_reach(x,wg_armTo(WR.tools.x,WR.tools.y[i]+58),u,{data:clamp((tt-c.more-1.6-i*0.5)/1.2,0,1)});}
      wg_tools(x,{a:[0,1].map(i=>ag_in(tt,c.more+0.2+i*0.3,0.5)).concat([0]),touch:[0,1].map(i=>ag_in(tt,c.more+1.5+i*0.5,0.4)).concat([0])});
      wg_jun(x,tt,{p:{gaze:[lerp(6*Math.sin(tt*7),3,st),lerp(-2+2*Math.cos(tt*5),0,st)]}});
      ag_roomLight(x,1);WG_KICK(x,S);wg_flick(x,tt,P.watch-0.4,P.round+0.4,2.2);})}
  ],0.6);
  ag_title(ctx,S,t,c.breath,"Why we govern them","because they're capable, not because they're bad","FILM 7 OF 9 · WHAT AN AGENT IS");});

// the carriage's passengers, row by row, in front of their seats (each row's armrest in front of them)
function wg_passengers(x,tt){const R=WG_ROWS,y=WG_SEAT.seat-212,cut=WG_SEAT.seat-4;
  const seat=[[0,WG_P.oldWoman,0.4,70,-16,{}],[0,WG_P.oldMan,0.44,0,0,{}],[1,WG_P.clerk,0.44,0,0,{pose:{near:[34,120,"hold"]},hold:wg_paper}],
    [2,WG_P.child,0.32,80,26,{gaze:[-3,-1]}],[2,WG_P.mother,0.44,0,0,{}],[3,WG_P.youngMan,0.44,0,0,{}],[4,WG_P.womanCoat,0.43,0,0,{}],[4,WG_P.manHat,0.44,80,-6,{}]];
  for(const [i,who,s,dx,dy,o] of seat)ag_person(x,who,R[i]+110+dx,y+dy,s,Object.assign({t:tt+i*0.7,cut},o));
  for(const r of R)wg_armrest(x,r);}

/* ---------------------------------------------------------------- 2 · Capable, convincing, unaccountable */
scene("three",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({cnt:wAt(sc,"count","census-day count"),gov:wAt(sc,"count","sends the government"),
    cause:wAt(sc,"night","finds the cause"),test:wAt(sc,"night","in test"),appr:wAt(sc,"night","people approve"),dm:wAt(sc,"more","do more"),
    team:wAt(sc,"more","work for all of them"),pipe:wAt(sc,"more","change the pipeline"),pa:wAt(sc,"acts","a person answers"),asks:wAt(sc,"yusuf","asks what"),
    q:[c.who,c.name,c.touch,c.checks],f:[c.four,wAt(sc,"four","an identity"),wAt(sc,"four","limits"),wAt(sc,"four","review")]}));
  const tools=(x,tt,o)=>{wg_tools(x,{a:[0,1,2].map(i=>o.a),touch:[0,1,2].map(i=>o.touch?o.touch[i]:0)});};
  const reach=(x,tt)=>{for(let i=0;i<3;i++){const t0=P.cause+i*0.7,u=ag_sine((tt-t0)/0.6)*(1-ag_sine((tt-t0-1.2)/0.6));if(u>0.01)ag_reach(x,wg_armTo(WR.tools.x,WR.tools.y[i]+58),u,{data:clamp((tt-t0-0.5)/0.8,0,1)});}};
  const touch=tt=>[0,1,2].map(i=>ag_io(tt,P.cause+i*0.7+0.5,P.cause+i*0.7+1.4,0.25));
  const cards=(x,tt,fail,okA,night)=>{const out=1-ag_in(tt,P.dm,0.6);if(out<=0)return;withA(x,out,()=>{
    wg_count(x,WR.cards.x,WR.cards.y,{w:470,k:ag_spr(tt,P.cnt),a:ag_in(tt,P.cnt,0.4),fail,gov:night?0:ag_in(tt,P.gov,0.5)});
    wg_plain(x,WR.cards.x,WR.cards.y+290,{k:ag_spr(tt,c.plain),a:ag_in(tt,c.plain,0.4),tick:okA});});};
  ag_shots(ctx,S,t,sc.dur,[
    // the census-day count, the number the university sends the government, and the plain job that counts it
    {at:0,place:"wgLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{wg_agent(x,tt,{});wg_jun(x,tt,{});
      ag_sandbox(x,WR.tray.x,WR.tray.y,WR.tray.w);ag_roomLight(x,1);WG_KICK(x,S);cards(x,tt,0,ag_in(tt,c.plain+0.6,0.4));}},
    // at night it fails: the agent finds the cause with its read-only tools, and puts a fix, as a draft, in its tray
    {cut:true,at:c.night,place:"wgLabNight",keys:[[c.night,1060,520,1.04]],push:0.02,draw:(x,tt)=>{const A=WR.agent;
      ag_sandbox(x,WR.tray.x,WR.tray.y,WR.tray.w);wg_draft(x,WR.tray.x,WR.tray.y-36,"draft fix",{a:ag_in(tt,P.test,0.3),k:ag_spr(tt,P.test)});
      tools(x,tt,{a:ag_in(tt,c.night+0.3,0.6),touch:touch(tt)});wg_agent(x,tt,{think:ag_io(tt,P.cause-0.3,P.test+0.8,0.4)});reach(x,tt);
      ag_roomLight(x,1,{night:true,lamp:[860,780]});ag_model(x,A.x,A.y,A.r,{only:"light",t:tt,think:ag_io(tt,P.cause-0.3,P.test+0.8,0.4)});
      WG_KICK(x,S,{dark:true});cards(x,tt,ag_in(tt,c.night+0.5,0.5),0,true);}},
    // in the morning, people approve its fix: Jun reviews it, Noor approves it, and the count matches again; then, could it do more?
    {cut:true,at:P.appr,place:"wgLab",keys:[[P.appr,960,540,1]],push:0.02,draw:(x,tt)=>{const yi=ag_sine((tt-P.team)/2.0);
      ag_sandbox(x,WR.tray.x,WR.tray.y,WR.tray.w);wg_draft(x,WR.tray.x,WR.tray.y-36,"draft fix",{a:1-ag_in(tt,P.dm,0.5)});
      tools(x,tt,{a:1-ag_in(tt,P.dm-0.4,0.6)});wg_agent(x,tt,{});
      wg_jun(x,tt,{p:{gaze:[3,tt>P.team?-2:0]}});
      if(yi>0)ag_person(x,"yusuf",lerp(-260,640,yi),640,0.92,{t:tt,gaze:[3,-2]});
      ag_roomLight(x,1);WG_KICK(x,S);
      const mk=1-ag_in(tt,P.dm,0.5);wg_mark(x,WR.tray.x,612,"reviewed · Jun",{k:ag_spr(tt,P.appr+0.5,0.6),a:mk});wg_mark(x,WR.tray.x,680,"approved · Noor",{ok:1,k:ag_spr(tt,P.appr+1.2,0.6),a:mk});
      cards(x,tt,1-ag_in(tt,P.appr+1.6,0.5),ag_in(tt,P.appr+1.8,0.4));
      wg_ghost(x,1400,300,"Work for the whole team?",{a:ag_in(tt,P.team,0.6),k:ag_spr(tt,P.team)});wg_ghost(x,1400,420,"Change the pipeline itself?",{a:ag_in(tt,P.pipe,0.6),k:ag_spr(tt,P.pipe)});}},
    // what the series' earlier films showed, each card under a phrase from its film's title: capable, convincing, unaccountable
    {cut:true,at:c.capable,place:"wgLab",keys:[[c.capable,960,540,1]],push:0.02,draw:(x,tt)=>{wg_agent(x,tt,wg_slide(tt,c.capable+0.6,WR.agent,{x:1320,y:460}));ag_roomLight(x,1);WG_KICK(x,S);
      const W_=[["More than a junior","Capable","knows more · works faster",c.capable],["It feels like understanding","Convincing","sounds sure · feeling sure is not knowing",c.convincing],["Accountability it can't hold","Unaccountable","the agent acts · a person answers",c.unacc]];
      W_.forEach(([f,ti,su,t0],i)=>wg_word(x,150,170+i*196,800,f,ti,su,{a:ag_in(tt,t0+0.1,0.4),k:ag_spr(tt,t0+0.1),hl:i===2?ag_in(tt,P.pa,0.5):0}));}},
    // Yusuf asks what the university asks of any new colleague; the four questions, and their answers
    {cut:true,at:c.yusuf,place:"wgLab",keys:[[c.yusuf,960,540,1]],push:0,draw:(x,tt)=>{wg_agent(x,tt,wg_slide(tt,c.yusuf+0.6,{x:1320,y:460},WR.agent));
      wg_jun(x,tt,{p:{gaze:[4,-3]}});ag_person(x,"yusuf",640,640,0.92,{t:tt,gaze:[4,-3]});
      ag_roomLight(x,1);WG_KICK(x,S);
      wg_ghost(x,1400,300,"Work for the whole team?",{});wg_ghost(x,1400,420,"Change the pipeline itself?",{});
      wg_four(x,{q:P.q.map(q=>ag_spr(tt,q+0.1,0.6)),flip:P.f.map(f=>ag_sine((tt-f)/0.6))});}}
  ],0.6);});

/* ---------------------------------------------------------------- 3 · An owner */
scene("owner",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({drv:wAt(sc,"must","as the driver"),owns:wAt(sc,"jun","so he owns it"),
    for_:wAt(sc,"decides","what it's for"),reads:wAt(sc,"decides","reads what it did"),stop:wAt(sc,"decides","can stop it"),
    over:wAt(sc,"moves","hands it over"),stops:wAt(sc,"moves","or it stops"),wrong:wAt(sc,"hands","the wrong hands"),anyone:wAt(sc,"hands","not just anyone")}));
  const lit=tt=>[ag_in(tt,c.first,0.6),0,0,0];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wgLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{wg_agent(x,tt,{});wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});}},
    // as the driver answered for the train
    {at:P.drv,place:"wgCab",keys:[[P.drv,820,580,1.1]],push:0.03,draw:(x,tt)=>{wg_cabShot(x,tt,{v:206,allow:210,state:"under",hand:true,gaze:[5,-1]});}},
    // Jun set it up, so he owns it: what it's for, what it did, and a switch to stop it; handed over, or stopped; not just anyone may own one
    {at:c.jun,place:"wgLab",keys:[[c.jun,960,540,1]],push:0,draw:(x,tt)=>{
      const go=ag_sine((tt-P.over)/1.0),back=ag_sine((tt-P.stops-1.4)/0.9),dim=ag_in(tt,P.stops,0.5)*(1-ag_in(tt,P.stops+1.6,0.6));
      const sw=0.32*Math.exp(-1.6*Math.max(0,tt-P.wrong))*Math.sin(Math.max(0,tt-P.wrong)*7)*(tt>P.wrong?1:0);
      wg_switchWire(x,1-dim,{a:ag_in(tt,P.stop,0.4),p:ag_sine((tt-P.stop-0.2)/0.9),lit:ag_in(tt,P.stop+1.0,0.4)});
      wg_agent(x,tt,{dim});
      // the tag: tied on, then out towards the next owner's hand, and back
      const ta=ag_in(tt,P.owns-0.3,0.4),dy=lerp(-70,0,ag_spr(tt,P.owns-0.3,0.7));
      if(go<0.02||back>0.98)wg_tagOn(x,{a:ta,dy:go<0.02?dy:0,sw:sw});
      else{const u=back>0?1-back:go,fade=tt>P.stops&&back<=0?1-ag_in(tt,P.stops,0.5):1;withA(x,fade,()=>wg_tag(x,lerp(WR.agent.x-30,700,u),lerp(WR.hook-2,470,u),"owner · Jun Park",{dx:lerp(-170,-20,u),dy:lerp(80,60,u)}));}
      wg_hand(x,690,560,{a:ag_io(tt,c.moves-0.2,P.stops+2.4,0.4)});
      wg_jun(x,tt,{p:{gaze:[4,0]}});
      ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});
      wg_card(x,WR.cards.x,WR.cards.y,470,{kick:"For",title:"the census-day count"},{a:ag_in(tt,P.for_,0.4),k:ag_spr(tt,P.for_)});
      wg_log(x,1400,300,470,[{text:"read the failed check"},{text:"found the cause"},{text:"drafted a fix, in test"}],{a:ag_in(tt,P.reads,0.4),k:ag_spr(tt,P.reads)});
      ag_pill(x,940,786,"who may own an agent · decided",{a:ag_in(tt,P.anyone,0.5)});}}
  ],0.6);});

/* ---------------------------------------------------------------- 4 · A name of its own */
scene("identity",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({name:wAt(sc,"today","under Jun's name"),looks:wAt(sc,"looks","looks like his"),
    stopJ:wAt(sc,"looks","to stop it"),jun:wAt(sc,"looks","stop Jun"),own:wAt(sc,"own","a name of its own"),ctrl:wAt(sc,"sees","as the control room"),
    team:wAt(sc,"sees","the team sees"),stop:wAt(sc,"sees","can stop it"),noone:wAt(sc,"sees","without stopping")}));
  const lit=tt=>[1,ag_in(tt,c.second,0.6),0,0];
  const log=(x,tt,re,hl)=>{const r=(s,i)=>({text:s,who:re>0.5?"census agent":"Jun Park",agent:re>0.5,a:ag_in(tt,P.name+0.3+i*0.35,0.3),hl});
    const rows=[r("read a table",0),r("ran a query",1),r("wrote a draft",2),{text:"changed a model",who:"Jun Park",a:ag_in(tt,P.looks+0.2,0.4)}];
    wg_log(x,WR.cards.x,WR.cards.y,470,rows,{a:ag_in(tt,P.name,0.4),k:ag_spr(tt,P.name),n:3+ag_sine((tt-P.looks)/0.4)});};
  ag_shots(ctx,S,t,sc.dur,[
    // it works under Jun's name: a badge with his name, and a log where every line says "Jun Park"
    {at:0,place:"wgLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{wg_switchWire(x,1,{});wg_agent(x,tt,{});wg_tagOn(x,{});
      wg_badgeOn(x,tt,{a:ag_in(tt,P.name,0.4),dy:lerp(-60,0,ag_spr(tt,P.name,0.7))});wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});log(x,tt,0,0);}},
    // while it's learning: read-only tools, its drafts in a sandbox, and production behind glass
    {cut:true,at:c.learning,place:"wgLab",keys:[[c.learning,960,540,1]],push:0.025,draw:(x,tt)=>{
      wg_production(x,1120,236,700,560);ag_glass(x,1120,236,700,560);
      ag_sandbox(x,700,800,380);wg_draft(x,700,764,"draft fix",{});
      wg_agent(x,tt,wg_slide(tt,c.learning+0.6,WR.agent,{x:700,y:400}));ag_roomLight(x,1);WG_KICK(x,S);
      for(let i=0;i<2;i++)ag_tool(x,170,300+i*150,300,116,["Query","Docs"][i],{a:ag_in(tt,c.learning+0.4+i*0.3,0.5)});}},
    // its work looks like his; to stop it, you'd have to stop Jun; then a name of its own
    {cut:true,at:c.looks,place:"wgLab",keys:[[c.looks,960,540,1]],push:0.02,draw:(x,tt)=>{const fl=ag_sine((tt-P.own)/0.7),wj=ag_sine((tt-P.jun+0.3)/1.0)*(1-ag_in(tt,P.own,0.5));
      wg_switchWire(x,1,{});wg_wire(x,[[WR.agent.x+50,WR.hook+70],[1000,800],[640,800],[400,700]],wj,{lit:1});
      const back=ag_in(tt,c.looks+1.5,0.4);wg_agent(x,tt,wg_slide(tt,c.looks+0.6,{x:700,y:400},WR.agent));wg_tagOn(x,{a:back});wg_badgeOn(x,tt,{flip:fl,a:back});
      wg_jun(x,tt,{p:{gaze:tt>P.jun&&tt<P.own+0.6?[6,3]:[3,0],smile:tt>P.jun&&tt<P.own+0.6?0:0.3}});
      ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});log(x,tt,fl,0);}},
    // as the control room saw each train
    {at:P.ctrl,place:"wgControl",keys:[[P.ctrl,960,400,1.12]],push:0.03,draw:(x,tt)=>{wg_controlRoom(x,tt,{});}},
    // the team sees everything it does, and can stop it without stopping anyone else
    {at:P.team,place:"wgLab",keys:[[P.team,960,540,1]],push:0.02,draw:(x,tt)=>{const off=ag_in(tt,P.noone,0.3)*(1-ag_in(tt,sc.dur-2.2,0.3));
      wg_switchWire(x,1-off,{});wg_agent(x,tt,{dim:off});wg_tagOn(x,{});wg_badgeOn(x,tt,{flip:1});
      wg_jun(x,tt,{});
      ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});log(x,tt,1,ag_in(tt,P.team+0.3,0.5));}}
  ],0.6);});

/* ---------------------------------------------------------------- 5 · Limits it can't raise */
scene("limits",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({only:wAt(sc,"role","only its role's"),reach:wAt(sc,"reach","wherever its tools reach"),
    ro:wAt(sc,"fewest","read-only"),dr:wAt(sc,"fewest","writing only drafts"),sens:wAt(sc,"fewest","no sensitive data"),ours:wAt(sc,"choice","our choice"),
    signs:wAt(sc,"mandate","its owner signs"),low:wAt(sc,"cab","lowered"),raise:wAt(sc,"cab","never raise it")}));
  const lit=tt=>[1,1,ag_in(tt,c.third,0.6),0];
  const base=(x,tt,o)=>{o=o||{};wg_switchWire(x,1,{});wg_agent(x,tt,{});wg_tagOn(x,{});wg_badgeOn(x,tt,{flip:1});};
  const role=(x,tt)=>wg_role(x,WR.cards.x,WR.cards.y,470,"census agent",[{text:"read: the tables it needs",lock:1,a:ag_in(tt,P.ro,0.4),hl:ag_io(tt,P.ro,P.dr,0.3)},
    {text:"write: drafts, in its sandbox",a:ag_in(tt,P.dr,0.4),hl:ag_io(tt,P.dr,P.sens,0.3)},{text:"sensitive data: none",a:ag_in(tt,P.sens,0.4),hl:ag_in(tt,P.sens,0.3)}],{a:ag_in(tt,P.only,0.4),k:ag_spr(tt,P.only)});
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wgLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{base(x,tt);wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});role(x,tt);}},
    // a train can only go where its rails go
    {at:c.rails,place:"wgCountry",keys:[[c.rails,960,540,1]],push:0.02,draw:(x,tt)=>{wg_lineShot(x,tt,{off:tt*2400,nose:1100});wg_blueLine(x,0,1960,WG_LINE.rail-1,1,1);}},
    // an agent can go wherever its tools reach: rails to its tools, and no further; the fewest rights on each
    {at:c.reach,place:"wgLab",keys:[[c.reach,960,540,1]],push:0.02,draw:(x,tt)=>{
      ag_sandbox(x,WR.tray.x,WR.tray.y,WR.tray.w);
      for(let i=0;i<3;i++)wg_rail(x,wg_armTo(WR.tools.x,WR.tools.y[i]+58),ag_sine((tt-c.reach-0.2-i*0.3)/1.0),1);
      base(x,tt);
      for(let i=0;i<3;i++){const t0=P.reach+i*0.9,u=ag_sine((tt-t0)/0.7)*(1-ag_sine((tt-t0-0.9)/0.5)*(i<2?1:0));if(u>0.01)ag_reach(x,wg_armTo(WR.tools.x,WR.tools.y[i]+58),u,{});}
      wg_tools(x,{a:[0,1,2].map(i=>ag_in(tt,c.reach+0.3+i*0.3,0.4)),touch:[0,1,2].map(i=>Math.max(ag_io(tt,P.reach+i*0.9+0.5,P.reach+i*0.9+1.2,0.2),ag_io(tt,P.ro,P.dr,0.3)))});
      wg_trayLine(x,ag_io(tt,P.dr,P.sens+1.5,0.4),1);
      wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});role(x,tt);}},
    // how much it may do alone is our choice; its skill doesn't decide it
    {cut:true,at:c.choice,place:"wgLab",keys:[[c.choice,960,540,1]],push:0,draw:(x,tt)=>{base(x,tt);
      wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});
      wg_bars(x,476,320,460,{a:ag_in(tt,c.choice,0.4),can:ag_sine((tt-c.choice-0.3)/1.2),alone:ag_sine((tt-P.ours)/0.9)*0.3,knob:ag_in(tt,P.ours,0.4)});}},
    // written down as a mandate its owner signs
    {at:c.mandate,place:"wgLab",keys:[[c.mandate,960,540,1]],push:0,draw:(x,tt)=>{base(x,tt);wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});
      wg_mandate(x,476,148,470,{a:ag_in(tt,c.mandate,0.4),k:ag_spr(tt,c.mandate),sign:(tt-P.signs)/1.3});}},
    // like the speed in the cab: set from outside, lowered at any time, and the agent can never raise it
    {at:c.cab,place:"wgLab",keys:[[c.cab,960,540,1]],push:0,draw:(x,tt)=>{base(x,tt);
      const r=ag_sine((tt-P.raise)/0.8)*(1-ag_sine((tt-P.raise-1.6)/0.8));if(r>0.01){const A=WR.agent;ag_reach(x,[A.x-A.R*0.62,A.y+A.R*0.42,990,620,900,500,876,452],r*0.82,{});}
      wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});
      const low=tt>P.low+0.2;wg_allowBox(x,700,420,low?160:210,"set",{a:ag_in(tt,c.cab+0.2,0.4),k:low?ag_spr(tt,P.low+0.2,0.6):ag_spr(tt,c.cab+0.2)});
      if(tt>P.raise+0.5)ag_lock(x,830,404,30,rgba(AG.blue,ag_io(tt,P.raise+0.5,sc.dur,0.3)));}}
  ],0.6);});

/* ---------------------------------------------------------------- 6 · A person checks */
scene("review",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({ev:wAt(sc,"checks","checks its evidence"),own:wAt(sc,"never","its own work"),
    noag:wAt(sc,"never","no agent approves"),ref:wAt(sc,"never","only for reference"),alone:wAt(sc,"test","agreed tasks alone"),rep:wAt(sc,"test","report what it did"),
    ownr:wAt(sc,"prod","checked by its owner"),sec:wAt(sc,"prod","approved by a second person")}));
  const lit=tt=>[1,1,1,ag_in(tt,c.fourth,0.6)];
  const base=(x,tt)=>{wg_switchWire(x,1,{});wg_agent(x,tt,{});wg_tagOn(x,{});wg_badgeOn(x,tt,{flip:1});};
  const change=(x,tt,a,open)=>ag_evidence(x,476,182,470,{kick:"Change",title:"Fix a failing step"},[{kick:"before",title:"3 checks fail",col:AG.orange},{kick:"after",title:"3 checks pass",col:AG.orange}],
    {a,open,ew:240,kickCol:AG.violet});
  ag_shots(ctx,S,t,sc.dur,[
    // a person checks its evidence, not its tone; it never approves, and no agent approves anyone's
    {at:0,place:"wgLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{base(x,tt);
      wg_jun(x,tt,{p:{gaze:[4,-2]}});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});
      const r=change(x,tt,ag_in(tt,c.checks,0.4),ag_sine((tt-P.ev+0.2)/1.2));
      // Jun's eye runs down the evidence, not the title
      const hi=ag_io(tt,P.ev+0.9,P.ev+3.0,0.3);if(hi>0)r.items.forEach((it,i)=>{const on=ag_io(tt,P.ev+0.9+i*0.8,P.ev+1.9+i*0.8,0.25);if(on>0){x.save();x.globalAlpha*=on*hi;x.strokeStyle=rgba(AG.orange,0.95);x.lineWidth=4;rr(x,it.to.x-6,it.to.y-6,it.to.w+12,it.to.h+12,20);x.stroke();x.restore();}});
      wg_approve(x,1500,560,{a:ag_in(tt,P.own-0.2,0.4),grey:ag_sine((tt-P.noag)/0.8)});
      ag_pill(x,1560,650,"agent's review · for reference",{col:AG.violet,a:ag_in(tt,P.ref,0.4)});}},
    // no train turns its own signal green: it's set from the line
    {at:c.signal,place:"wgCab",keys:[[c.signal,1120,560,1.08]],push:0.03,draw:(x,tt)=>{const g=tt>c.signal+0.9;wg_cabShot(x,tt,{v:g?206:150,allow:g?210:120,state:g?"under":"over",hand:true,gaze:[5,-1]});}},
    // in test, away from the real work, it may do agreed tasks alone, and report what it did
    {at:c.test,place:"wgLab",keys:[[c.test,960,540,1]],push:0,draw:(x,tt)=>{
      wg_testFrame(x,1140,800,460,96,{label:"in test",a:ag_in(tt,c.test+0.2,0.5)});
      for(let i=0;i<2;i++)ag_verdict(x,1060+i*170,774,"check","pass",ag_in(tt,P.alone+i*0.6,0.3));
      base(x,tt);wg_jun(x,tt,{p:{gaze:[3,-1]}});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});
      const rk=ag_sine((tt-P.rep)/0.8);wg_card(x,476,lerp(276,260,rk),470,{kick:"Report",title:"2 checks rerun · 1 draft",sub:"nothing changed in production"},{a:ag_in(tt,P.rep,0.3),kickCol:AG.violet});}},
    // every change to production: checked by its owner, approved by a second person, the same as people's changes
    {at:c.prod,place:"wgLab",keys:[[c.prod,960,540,1]],push:0.02,draw:(x,tt)=>{const pass=ag_sine((tt-P.sec-1.2)/1.2),jp=ag_sine((tt-c.same)/1.0);
      wg_production(x,880,180,560,620);ag_glass(x,880,180,560,620,{label:null});
      ag_person(x,"noor",1690,640,0.94,{t:tt,flip:true,gaze:[4,0]});
      ag_roomLight(x,1);WG_KICK(x,S);
      const cx=lerp(240,980,pass),ca=1-0.55*pass;
      withA(x,ca,()=>{wg_card(x,cx,300,460,{kick:"by census agent",title:"Fix a failing step"},{kickCol:AG.violet});
        wg_mark(x,cx+230,530,"reviewed · Jun",{k:ag_spr(tt,P.ownr,0.6)});wg_mark(x,cx+230,600,"approved · Noor",{ok:1,k:ag_spr(tt,P.sec,0.6)});});
      withA(x,ag_in(tt,c.same,0.4),()=>{const jx=lerp(-300,240,jp);wg_card(x,jx,300,460,{kick:"by Jun Park",title:"Rename a column"},{});
        wg_mark(x,jx+230,530,"reviewed · Mei",{k:ag_spr(tt,c.same+0.9,0.6)});wg_mark(x,jx+230,600,"approved · Noor",{ok:1,k:ag_spr(tt,c.same+1.5,0.6)});});}}
  ],0.6);});

/* ---------------------------------------------------------------- 7 · Like any colleague */
scene("rules",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({role:wAt(sc,"most","a role"),rules:wAt(sc,"most","the same rules"),sec:wAt(sc,"most","the same security"),
    iso:c.iso,nist:wAt(sc,"iso","NIST's")}));
  ag_shots(ctx,S,t,sc.dur,[
    // in most ways, a colleague like any other: a role, the same rules, the same security
    {at:0,place:"wgLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{wg_group(x,tt,960,470,1,{});
      wg_jun(x,tt,{});ag_person(x,"noor",1690,640,0.94,{t:tt,flip:true,gaze:[4,0]});ag_roomLight(x,1);WG_KICK(x,S);
      [[110,"analytics engineer"],[745,"census agent"],[1380,"data architect"]].forEach(([rx,rn],i)=>wg_role(x,rx,140,430,rn,[],{a:ag_in(tt,P.role+i*0.3,0.4),k:ag_spr(tt,P.role+i*0.3)}));
      ag_pill(x,810,806,"the same rules",{col:AG.blue,a:ag_in(tt,P.rules,0.4)});ag_pill(x,1110,806,"the same security",{col:AG.blue,a:ag_in(tt,P.sec,0.4)});}},
    // four rules of its own, beside the four needs
    {cut:true,at:c.four,place:"wgLab",keys:[[c.four,960,540,1]],push:0,draw:(x,tt)=>{const A=WR.agent,m=wg_slide(tt,c.four+0.6,{x:960,y:470},A);
      wg_switchWire(x,1,{a:ag_in(tt,c.four+1.5,0.4)});wg_group(x,tt,m.x,m.y,1,{});
      wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);
      // each rule swells the need (or needs) it belongs to
      const R4=[[c.rights,["No rights of its own,","only a role's"],[2]],[c.owner,["Always a human owner"],[0]],[c.approve,["Never an approver"],[3]],
        [c.mandate,["A written mandate","that can be taken back;","a person approves every","change to production"],[2,3]]],pop=[0,0,0,0];
      R4.forEach(([t0,ls,ns])=>{for(const n of ns)pop[n]=Math.max(pop[n],Math.sin(Math.PI*clamp((tt-t0)/0.8,0,1)));});
      const L=ag_in(tt,c.four,0.5);wg_four(x,{lit:[L,L,L,L],pop});
      let ry=244;R4.forEach(([t0,ls],i)=>{ry+=wg_rule(x,1392,ry,480,i+1,ls,{a:ag_in(tt,t0,0.4),k:ag_spr(tt,t0)})+12;});}},
    // these ideas have names in the field; series 3 and 4 put them to work
    {at:c.names,place:"wgLab",keys:[[c.names,960,540,1]],push:0.02,draw:(x,tt)=>{ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:[1,1,1,1]});
      wg_shelf(x,300,600,1320,["Levels of autonomy · Feng, McDonald and Zhang, 2025","ISO/IEC 42001","NIST AI Risk Management Framework"],{k:[c.feng,P.iso,P.nist].map(q=>ag_sine((tt-q)/0.9))});
      ag_T(x,"IN THE FIELD",330,372,{w:700,size:28,ls:4,col:AG.kick,a:ag_in(tt,c.names+0.2,0.5)});
      ag_pill(x,1340,568,"Series 3",{a:ag_in(tt,c.series,0.4)});ag_pill(x,1530,568,"Series 4",{a:ag_in(tt,c.series+0.3,0.4)});}}
  ],0.6);});

/* ---------------------------------------------------------------- 8 · Because they are capable */
scene("capable",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({k285:wAt(sc,"sixty","two hundred and eighty-five"),dm:wAt(sc,"more","do more"),
    num:wAt(sc,"trust","the number"),named:[wAt(sc,"more","an owner"),wAt(sc,"more","a name"),wAt(sc,"more","limits"),wAt(sc,"more","review")]}));
  const base=(x,tt)=>{wg_switchWire(x,1,{});wg_agent(x,tt,{});wg_tagOn(x,{});wg_badgeOn(x,tt,{flip:1});};
  ag_shots(ctx,S,t,sc.dur,[
    // today: longer, sleeker, faster, and the limits still built in
    {at:0,place:"wgCountry",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{wg_lineShot(x,tt,{off:tt*2800,nose:1560,today:true,k:0.78});
      wg_corner(x,"Today",ag_in(tt,0.6,0.6));wg_allowBox(x,1440,380,285,"set",{a:ag_in(tt,P.k285,0.4),k:ag_spr(tt,P.k285)});}},
    // not because the trains are bad: the first one, at rest, in the morning
    {at:c.notbad,place:"wgPlatform",keys:[[c.notbad,1000,540,1.04]],push:0.03,draw:(x,tt)=>{wg_platformShot(x,tt,{people:false});x.save();setScreen(x,S);wg_corner(x,"Japan · 1964",1);x.restore();}},
    // we govern agents because they are capable, not because they are bad; then more, and a number still trusted
    {at:c.govern,place:"wgLab",keys:[[c.govern,960,540,1]],push:0.02,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.9),()=>{base(x,tt);
      const fill=ag_sine((tt-P.dm)/0.9),gone=ag_sine((tt-P.num-0.2)/1.6);
      for(let i=0;i<2;i++){const u=ag_sine((tt-P.dm-0.3-i*0.4)/0.9);if(u>0.01)ag_reach(x,wg_armTo(1400,340+i*120),u,{});}
      wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:[1,1,1,1],pop:P.named.map(q=>Math.sin(Math.PI*clamp((tt-q)/0.8,0,1)))});
      const la=ag_in(tt,c.govern+0.3,0.6)*(1-ag_in(tt,c.next-0.2,0.5));
      ["We govern agents","because they are capable,","not because they are bad."].forEach((s,i)=>ag_T(x,s,476,292+i*50,{w:700,size:36,a:la}));
      wg_ghost(x,1400,300,"Work for the whole team",{a:ag_in(tt,c.more,0.4),fill});wg_ghost(x,1400,420,"Change the pipeline itself",{a:ag_in(tt,c.more+0.2,0.4),fill});
      if(gone<1)withA(x,ag_in(tt,c.trust,0.4)*(1-gone*0.2),()=>{x.save();x.translate(lerp(0,700,gone*gone),lerp(0,-260,gone*gone));x.rotate(gone*0.06);
        wg_count(x,1400,556,{w:470,gov:1});x.restore();});
      wg_card(x,476,200,470,{kick:"Next",title:"What they tell us about\u00a0ourselves"},{a:ag_in(tt,c.next,0.4),k:ag_spr(tt,c.next)});
      wg_card(x,476,398,470,{kick:"Series 2",title:"Agents at work on data"},{a:ag_in(tt,c.series2,0.4),k:ag_spr(tt,c.series2)});})}
  ],0.6);
  ag_end(ctx,S,t,c.breath,"Why we govern them","We govern agents because they're capable, not bad.","Film 7 of 9");});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["limits", "rules"]);

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
