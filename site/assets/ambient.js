/* Learning Data: the moving light behind each page's hero (.cine canvas.fx), in the films' own language: light is data.
   Streams of light drift along a few lanes in the films' colours, with a soft glow where they meet the pointer.
   It only draws while the hero is on screen and the tab is visible, and draws one still frame for prefers-reduced-motion. */
(()=>{"use strict";
const cv=document.querySelector(".cine canvas.fx");if(!cv||!cv.getContext)return;
const cx=cv.getContext("2d"),hero=cv.closest(".cine");
const COLS=["120,200,255","255,209,102","201,167,255","127,240,180","255,143,134"];
const still=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
let W=0,H=0,dpr=1,lanes=[],dots=[],px=-1e3,py=-1e3,on=true,raf=0,t0=performance.now();
function size(){const r=cv.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);W=Math.max(1,r.width);H=Math.max(1,r.height);
  cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);cx.setTransform(dpr,0,0,dpr,0,0);
  const n=Math.max(4,Math.min(8,Math.round(H/70)));lanes=[];
  for(let i=0;i<n;i++)lanes.push({y:H*(i+.5)/n,a:14+Math.random()*26,f:.002+Math.random()*.003,p:Math.random()*6.3,c:COLS[i%COLS.length]});
  const m=Math.round(Math.min(90,W/14));dots=[];for(let i=0;i<m;i++)dots.push(spawn(true));}
function spawn(any){const l=lanes[(Math.random()*lanes.length)|0];return{l,x:any?Math.random()*W:-20,v:.35+Math.random()*1.1,r:1+Math.random()*1.8,o:.35+Math.random()*.55};}
function laneY(l,x,t){return l.y+Math.sin(x*l.f+l.p+t*.00025)*l.a;}
function frame(now){const t=now-t0;cx.clearRect(0,0,W,H);
  // the lanes: faint paths the light follows
  cx.lineWidth=1;for(const l of lanes){cx.strokeStyle=`rgba(${l.c},.07)`;cx.beginPath();for(let x=0;x<=W;x+=16){const y=laneY(l,x,t);x?cx.lineTo(x,y):cx.moveTo(x,y);}cx.stroke();}
  cx.globalCompositeOperation="lighter";
  for(const d of dots){d.x+=still?0:d.v;if(d.x>W+20)Object.assign(d,spawn(false));
    let y=laneY(d.l,d.x,t);const dx=d.x-px,dy=y-py,near=Math.max(0,1-Math.hypot(dx,dy)/160);
    y+=dy*near*.35;const r=d.r*(1+near*1.6),o=Math.min(1,d.o+near*.5);
    const g=cx.createLinearGradient(d.x-34*d.v,y,d.x,y);g.addColorStop(0,`rgba(${d.l.c},0)`);g.addColorStop(1,`rgba(${d.l.c},${o*.55})`);
    cx.strokeStyle=g;cx.lineWidth=r;cx.beginPath();cx.moveTo(d.x-34*d.v,y);cx.lineTo(d.x,y);cx.stroke();
    cx.fillStyle=`rgba(${d.l.c},${o})`;cx.beginPath();cx.arc(d.x,y,r,0,6.283);cx.fill();}
  if(px>-1e3){const g=cx.createRadialGradient(px,py,0,px,py,180);g.addColorStop(0,"rgba(120,170,255,.10)");g.addColorStop(1,"rgba(120,170,255,0)");cx.fillStyle=g;cx.fillRect(px-180,py-180,360,360);}
  cx.globalCompositeOperation="source-over";
  if(!still&&on&&!document.hidden)raf=requestAnimationFrame(frame);else raf=0;}
function go(){if(!raf&&!still&&on&&!document.hidden)raf=requestAnimationFrame(frame);}
size();frame(performance.now());
let rt=0;window.addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(()=>{size();if(still)frame(performance.now());},150);});
hero.addEventListener("pointermove",e=>{const r=cv.getBoundingClientRect();px=e.clientX-r.left;py=e.clientY-r.top;
  hero.style.setProperty("--mx",(px/W-.5).toFixed(3));hero.style.setProperty("--my",(py/H-.5).toFixed(3));});
hero.addEventListener("pointerleave",()=>{px=py=-1e3;hero.style.setProperty("--mx",0);hero.style.setProperty("--my",0);});
if("IntersectionObserver"in window)new IntersectionObserver(es=>{on=es[0].isIntersecting;go();}).observe(hero);
document.addEventListener("visibilitychange",go);
})();
