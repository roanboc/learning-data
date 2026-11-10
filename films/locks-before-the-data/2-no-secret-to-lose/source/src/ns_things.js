/* ===== No secret to lose: what the ladders' pictures and the people's chapter show =====
   Drawn live, in the module's colours: a phone of glass and what its screen shows, a fake page (coral: what a thief set up) and the
   real one (cyan), the face and the fingerprint that unlock a passkey, the half of a key the platform keeps, the build service, the
   faces behind a shared account, a number moved to a thief's phone, and the streets' walkers. A secret is only ever a sealed card,
   or, too small to read, its frost and lock; no character of one is ever drawn. Every word is drawn with dp_T, at least 28 px. */

/* ---------------------------------------------------------------- the City's walkers, crossing the street from door to door */
// w: {Z depth in metres, X0 and X1 where he steps out and in (metres from the street's middle), t0 when he steps out, v metres a second,
// ph his step's phase, case 0 or 1}; he fades in and out at the doors
function ns_cross(ctx,t,w,o){o=o||{};const dir=Math.sign(w.X1-w.X0),L=Math.abs(w.X1-w.X0),d=(t-w.t0)*(w.v||1.4);if(d<0||d>L)return;
  const X=w.X0+dir*d,p=ns_streetPoint(X,0,w.Z),s=820*1.75/w.Z,a=Math.min(1,d/0.9,(L-d)/0.9)*(o.a==null?1:o.a);
  ns_walker(ctx,p[0],p[1],s,d/1.5+(w.ph||0),{a,case:w.case==null?(o.case==null?1:o.case):w.case,dir,rim:dir});}
// the morning's messengers, crossing one after another; o.case 0 when they carry nothing
const NS_WALKERS=[{Z:16,X0:-9.4,X1:9.4,t0:0,v:1.45,ph:0.1},{Z:11,X0:9.4,X1:-9.4,t0:2.6,v:1.35,ph:0.6},{Z:24,X0:-9.4,X1:9.4,t0:4.4,v:1.5,ph:0.3},
  {Z:19,X0:9.4,X1:-9.4,t0:9.0,v:1.4,ph:0.8},{Z:28,X0:9.4,X1:-9.4,t0:12.5,v:1.5,ph:0.45},{Z:14,X0:-9.4,X1:9.4,t0:15.0,v:1.4,ph:0.2}];
function ns_walkers(ctx,t,t0,o){o=o||{};for(const w of NS_WALKERS){if(o.far&&w.Z<o.far)continue;ns_cross(ctx,t,Object.assign({},w,{t0:t0+w.t0}),o);}}

/* ---------------------------------------------------------------- a phone of glass */
// a phone, w x h, its screen drawn by draw(ctx, x, y, w, h) inside it; o.col its rim (cyan, or coral for a thief's)
function ns_phone(ctx,x,y,w,h,a,draw,o){o=o||{};if(!(a>0))return;const col=dp_f(o.col||NS_ICE);ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor=rgba(col,0.4);ctx.shadowBlur=30;rr(ctx,x,y,w,h,34);ctx.fillStyle="rgb(8,22,28)";ctx.fill();ctx.restore();
  rr(ctx,x+1,y+1,w-2,h-2,34);ctx.strokeStyle=rgba(mix(col,[255,255,255],0.35),0.95);ctx.lineWidth=2.4;ctx.stroke();
  const sx=x+14,sy=y+40,sw=w-28,sh=h-70;ctx.save();rr(ctx,sx,sy,sw,sh,18);ctx.clip();const g=ctx.createLinearGradient(sx,sy,sx,sy+sh);g.addColorStop(0,"rgb(16,40,48)");g.addColorStop(1,"rgb(10,28,34)");ctx.fillStyle=g;ctx.fillRect(sx,sy,sw,sh);
  const hg=ctx.createLinearGradient(sx,sy,sx+sw,sy+sh);hg.addColorStop(0,"rgba(220,250,250,0.10)");hg.addColorStop(0.4,"rgba(220,250,250,0)");ctx.fillStyle=hg;ctx.fillRect(sx,sy,sw,sh);
  if(draw)draw(ctx,sx,sy,sw,sh);ctx.restore();
  ctx.fillStyle=rgba(mix(col,[255,255,255],0.3),0.6);rr(ctx,x+w/2-34,y+18,68,8,4);ctx.fill();ctx.restore();}
// the phone in Mei's hand, small and with no words (figure space, over her near hand): its screen lit cyan
function ns_heldPhone(c,h){const [x,y]=h.near;c.save();c.translate(x+6,y-118);c.rotate(-0.08);c.save();c.shadowColor="rgba(72,222,244,0.5)";c.shadowBlur=24;rr(c,-34,-6,92,170,16);c.fillStyle="rgb(10,24,30)";c.fill();c.restore();
  rr(c,-34,-6,92,170,16);c.strokeStyle="rgba(200,240,244,0.9)";c.lineWidth=2.4;c.stroke();rr(c,-26,6,76,140,10);const g=c.createLinearGradient(0,6,0,146);g.addColorStop(0,"rgba(72,222,244,0.55)");g.addColorStop(1,"rgba(72,222,244,0.2)");c.fillStyle=g;c.fill();
  c.strokeStyle="rgba(230,255,255,0.85)";c.lineWidth=3;c.beginPath();c.arc(12,60,14,0,TAU);c.stroke();c.beginPath();c.moveTo(26,60);c.lineTo(42,60);c.moveTo(36,60);c.lineTo(36,68);c.stroke();c.restore();}

/* ---------------------------------------------------------------- the face and the fingerprint that unlock a passkey */
function ns_faceIcon(ctx,x,y,r,col,a){if(!(a>0))return;const c=dp_f(col||"cyan");ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.lineWidth=3.4;ctx.lineCap="round";
  const k=r*0.42;for(const [sx,sy] of [[-1,-1],[1,-1],[1,1],[-1,1]]){ctx.beginPath();ctx.moveTo(x+sx*r,y+sy*(r-k));ctx.lineTo(x+sx*r,y+sy*r);ctx.lineTo(x+sx*(r-k),y+sy*r);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(x-r*0.32,y-r*0.3);ctx.lineTo(x-r*0.32,y-r*0.14);ctx.moveTo(x+r*0.32,y-r*0.3);ctx.lineTo(x+r*0.32,y-r*0.14);ctx.moveTo(x+r*0.02,y-r*0.22);ctx.lineTo(x+r*0.02,y+r*0.08);ctx.lineTo(x-r*0.1,y+r*0.08);ctx.stroke();
  ctx.beginPath();ctx.arc(x,y+r*0.12,r*0.36,0.35,Math.PI-0.35);ctx.stroke();ctx.restore();}
function ns_fingerIcon(ctx,x,y,r,col,a){if(!(a>0))return;const c=dp_f(col||"cyan");ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=10;ctx.lineWidth=3;ctx.lineCap="round";
  for(let i=0;i<5;i++){const rr2=r*(0.22+i*0.19);ctx.beginPath();ctx.ellipse(x,y+r*0.12,rr2*0.82,rr2,0,Math.PI*(1.05+i*0.02),Math.PI*(1.95-i*0.06)+(i%2?0.5:0.9));ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- pages: the real site, and a fake one */
// a page of glass: its name (coral for a fake), and a field where a sign-in would go; o.draw(x, y, w, h) draws what arrives in the field
function ns_page(ctx,x,y,w,h,title,col,a,o){o=o||{};if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,w,h,{col,r:18,glowR:34,behind:o.behind});
  dp_T(ctx,title,x+26,y+48,{w:700,size:30});const fy=y+70,fh=h-96;ctx.save();rr(ctx,x+24,fy,w-48,fh,12);ctx.fillStyle="rgba(4,14,18,0.55)";ctx.fill();ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(dp_f(col),0.55);ctx.lineWidth=2;ctx.stroke();ctx.restore();
  if(o.draw)o.draw(x+24,fy,w-48,fh);ctx.restore();}

/* ---------------------------------------------------------------- the half of a key the platform keeps */
// the bow and half the blade of a key, drawn in outline: it opens nothing on its own
function ns_halfKey(ctx,x,y,s,a){if(!(a>0))return;const c=DP.F.cyan;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=12;
  ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.arc(-40,0,22,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(-18,0);ctx.lineTo(16,0);ctx.stroke();
  ctx.setLineDash([7,9]);ctx.globalAlpha*=0.5;ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(54,0);ctx.moveTo(40,0);ctx.lineTo(40,14);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the build service: a block of glass with a gear, where the job's code is built (or, label, where a job runs) */
function ns_builder(ctx,x,y,a,t,label){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;dp_panel(ctx,x,y,330,150,{col:NS_ICE,r:18,glowR:30});
  ctx.save();ctx.translate(x+70,y+82);ctx.rotate((t||0)*0.6);dp_gear(ctx,0,0,30);ctx.fillStyle=rgba(DP.F.cyan,0.3);ctx.fill("evenodd");ctx.lineWidth=2;ctx.strokeStyle=rgba(mix(DP.F.cyan,[255,255,255],0.4),1);ctx.stroke();ctx.restore();
  dp_T(ctx,label||"Build service",x+124,y+92,{w:700,size:label?28:30});ctx.restore();}

/* ---------------------------------------------------------------- people's pictures for the people's ladder */
// a shared account: one card, three people behind it, and nobody can tell which of them did what
function ns_shared(ctx,x,y,a,k){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<3;i++){const px=x+90+i*150,py=y+70;ctx.save();ctx.globalAlpha*=0.9;ctx.translate(px,py);ctx.scale(1.25,1.25);dp_personPic(ctx,0,0,"coral");ctx.restore();}
  dp_panel(ctx,x+30,y+140,500,120,{col:"coral",r:18,glowR:30});dp_T(ctx,"One account",x+60,y+190,{w:700,size:30});dp_T(ctx,"three people",x+60,y+234,{w:600,size:28,col:"mut"});
  ctx.restore();}
// a number that moves to a thief's phone: a pill that leaves one phone for the other (u 0 to 1)
function ns_numberMove(ctx,a0,b0,u,a){if(!(a>0)||!(u>0))return;const e=ag_sine(u),x=lerp(a0[0],b0[0],e),y=lerp(a0[1],b0[1],e)-Math.sin(Math.PI*e)*60;
  ctx.save();ctx.globalAlpha*=a;dp_pill(ctx,x,y,"Your number",u<0.5?"violet":"coral",{align:"center"});ctx.restore();}
// a card that arrives and holds nothing: a dashed outline
function ns_emptyCard(ctx,x,y,w,h,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(DP.F.coral,0.9);ctx.lineWidth=2.4;rr(ctx,x,y,w,h,14);ctx.stroke();ctx.restore();}
// a dashed line along which something passes on (a fake page relaying), drawn on by p
function ns_relay(ctx,a,b,p,col,al){if(!(al>0))return;ctx.save();ctx.globalAlpha*=al;dp_link(ctx,a,b,col||"coral",p,{dash:[10,9],dot:false});ctx.restore();}
