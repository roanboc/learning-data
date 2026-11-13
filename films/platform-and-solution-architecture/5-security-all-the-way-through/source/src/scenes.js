/* ===== Security all the way through: scenes =====
   Ten chapters, as in ../script.md. Japan, the early 1600s: a century of war has just ended, and the lords still rule their domains;
   the shogunate keeps their wives and children in Edo as hostages, and on the roads fears a lord's family slipping out and guns going
   in. Around 1619 it sets a checkpoint on the Tōkaidō at Hakone, by Lake Ashi: every traveller passes its gate between dawn and dusk; a
   woman leaving Edo shows a pass from Edo Castle that describes her, and a woman examiner checks her against it, even untying her hair;
   nobody may go round; most men need no pass. Then the utility: one account, data_loader, opens every door on the data platform, its
   key in a script and its name on every line of the log; the regulator asks who read customers' bank details, and nobody can say.
   Ravi gives every person and every job an identity of its own, only the rights it needs, every request checked where the data is, no
   key in the code and a name on every line of the log, and the platform makes the safe way the easy one, from a template.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame, and what's drawn small is texture. Motion: every
   shot drifts slowly and things arrive with a spring; on the map the camera glides; the utility's chapters glide on from one to the
   next in one room, where what stays stays put and only what changes fades; between rooms the whole picture dissolves. Sound: every
   effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- shared by the chapters ---------- */
// the utility's room: dark, quiet, a few motes; and the plain dark a room leaves into, under a title or the end card
function p5_room(ctx,S,t){setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40,col:[150,190,255]});}
function p5_base(ctx,S){setScreen(ctx,S);ctx.fillStyle="rgb(3,5,11)";ctx.fillRect(0,0,W,H);}
// how far someone has walked by t, who sets off at t0 and stops at t1 (each over half a second, so their feet hold), at v px a second;
// and how much of a stride they're taking (amp, for psaWalker and p5_woman)
function p5_go(t,t0,t1,v){const e=0.5;if(t<=t0)return[0,0];const a=Math.min(t,t1)-t0;let d,amp;
  if(a<e){d=v*a*a/(2*e);amp=a/e;}else{d=v*(e/2+(a-e));amp=1;}
  if(t>t1-e){const b=clamp(t-(t1-e),0,e);d-=v*b*b/(2*e);amp=Math.min(amp,1-b/e);}if(t>=t1)amp=0;return[d,clamp(amp,0,1)];}
// a light that travels along a path, with a fading trail: a request on its way to the data
function p5_runner(ctx,pts,u,col,o){o=o||{};if(u<=0||u>=1.0001&&!o.hold)return;const tr=o.trail||0.08,n=12,r=o.r||6;for(let i=n;i>=0;i--){const uu=u-tr*i/n;if(uu<0||uu>1)continue;const[x,y]=psaAlong(pts,uu);withA(ctx,(1-i/n)*0.7,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r*(1-i/n*0.6),0,TAU);ctx.fill();});}
  const[x,y]=psaAlong(pts,Math.min(u,1));glow(ctx,x,y,r*6,col,0.55);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();return[x,y];}
// a small pill: a name, an identity, a service; o.dash draws an outline only; o.icon draws a small sign at its left ("job", "person",
// "key", "group"), o.pass a small pass of paper at its right, o.strike a line through it
function p5_chipW(ctx,name,sz,o){o=o||{};return 30+tw(ctx,name,sz||28,700)+(o.icon?34:0)+(o.pass?40:0);}
function p5_chip(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||28,w=o.w||p5_chipW(ctx,name,sz,o),h=46,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;if(a<=0.01)return w;
  withA(ctx,a,()=>{const col=o.col||TECC;if(o.dash){ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.setLineDash([9,7]);rr(ctx,X,y-h/2,w,h,h/2);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
    else glass(ctx,X,y-h/2,w,h,h/2,col,{glow:8+12*(o.hi||0),ea:0.7,fill:"rgba(8,14,18,0.94)"});
    const ix=X+30,tx=X+(o.icon?34:0)+(w-(o.icon?34:0)-(o.pass?40:0))/2;
    if(o.icon)p5_icon(ctx,o.icon,ix,y,col);
    if(name)T(ctx,name,tx,y+sz*0.36,{w:700,size:sz,align:"center",color:rgba(o.dash?col:INK,0.96)});
    if(o.pass)p5_slip(ctx,X+w-34,y,o.pass,o.passCol);
    if(o.strike>0.01){ctx.save();ctx.strokeStyle=rgba(PS_RED,0.95);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(X+12,y);ctx.lineTo(X+12+(w-24)*clamp(o.strike,0,1),y);ctx.stroke();ctx.restore();}});return w;}
// the small signs in a chip: a job is a cog, a person a head and shoulders, a group three of them, a key a key
function p5_icon(ctx,kind,x,y,col){ctx.save();ctx.fillStyle=rgba(col,1);ctx.strokeStyle=rgba(col,1);
  if(kind==="job")psaCog(ctx,x,y,7.5,col,0);
  else if(kind==="person"){ctx.beginPath();ctx.arc(x,y-6,5.5,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(x,y+9,9.5,6.5,0,Math.PI,0);ctx.fill();}
  else if(kind==="group"){[[-8,0.8],[8,0.8],[0,1]].forEach(([dx,k])=>{ctx.beginPath();ctx.arc(x+dx,y-6*k,4.6*k,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(x+dx,y+8,7.5*k,5.5*k,0,Math.PI,0);ctx.fill();});}
  else if(kind==="key")p5_key(ctx,x,y,26,col,1);
  ctx.restore();}
// a pass of one's own, small: a slip of paper with a short line across it; o.k 0..1 brings it in
function p5_slip(ctx,x,y,k,col){if(k<=0.01)return;withA(ctx,clamp(k,0,1),()=>{const s=0.8+0.2*spring(clamp(k,0,1));ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate(-0.08);
  ctx.fillStyle=rgba(WASHI,1);ctx.fillRect(-10,-14,20,28);ctx.strokeStyle=rgba(col||PS_OK,1);ctx.lineWidth=2.2;[-6,0,6].forEach(yy=>{ctx.beginPath();ctx.moveTo(-6,yy);ctx.lineTo(6,yy);ctx.stroke();});ctx.restore();});}
// a key: its bow a ring, a shaft and two teeth, length s
function p5_key(ctx,x,y,s,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(2,s*0.12);ctx.lineCap="round";
  ctx.beginPath();ctx.arc(-s*0.3,0,s*0.17,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(-s*0.13,0);ctx.lineTo(s*0.5,0);ctx.moveTo(s*0.3,0);ctx.lineTo(s*0.3,s*0.17);ctx.moveTo(s*0.44,0);ctx.lineTo(s*0.44,s*0.2);ctx.stroke();ctx.restore();});}
// a padlock
function p5_lock(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(2,s*0.12);ctx.beginPath();ctx.arc(x,y-s*0.1,s*0.22,Math.PI,0);ctx.stroke();
  rr(ctx,x-s*0.34,y-s*0.1,s*0.68,s*0.52,s*0.08);ctx.fill();ctx.fillStyle="rgba(6,10,16,0.9)";ctx.beginPath();ctx.arc(x,y+s*0.12,s*0.07,0,TAU);ctx.fill();ctx.restore();});}
// a laptop, seen from the front
function p5_laptop(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.fillStyle="rgba(8,14,20,0.95)";rr(ctx,x-s*0.42,y-s*0.5,s*0.84,s*0.52,4);ctx.fill();ctx.stroke();
  ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(x-s*0.5,y+s*0.06);ctx.lineTo(x+s*0.5,y+s*0.06);ctx.lineTo(x+s*0.56,y+s*0.14);ctx.lineTo(x-s*0.56,y+s*0.14);ctx.closePath();ctx.fill();ctx.restore();});}
// a red cross, drawn in two strokes as p goes from 0 to 1
function p5_cross(ctx,x,y,s,p){if(p<=0.01)return;ctx.save();ctx.strokeStyle=rgba(PS_RED,0.95);ctx.lineWidth=Math.max(3,s*0.18);ctx.lineCap="round";const a=clamp(p*2,0,1),b=clamp(p*2-1,0,1);
  ctx.beginPath();ctx.moveTo(x-s/2,y-s/2);ctx.lineTo(x-s/2+s*a,y-s/2+s*a);if(b>0){ctx.moveTo(x+s/2,y-s/2);ctx.lineTo(x+s/2-s*b,y-s/2+s*b);}ctx.stroke();ctx.restore();}
// a line through the points P, drawn up to p of its length, with a head at its end once it's whole; o.lw, o.glow, o.head, o.dash
function p5_len(S){const L=[0];for(let i=1;i<S.length;i++)L.push(L[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));return L;}
function p5_route(ctx,P,col,a,p,o){o=o||{};if(a<=0.01||p<=0)return;const L=p5_len(P),d=clamp(p,0,1)*L[L.length-1];withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||2.4;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);
  if(o.glow){ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=o.glow;}ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);let end=P[0],an=0;
  for(let i=1;i<P.length;i++){if(L[i]<=d){ctx.lineTo(P[i][0],P[i][1]);end=P[i];an=Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]);}else{const f=(d-L[i-1])/((L[i]-L[i-1])||1),x=lerp(P[i-1][0],P[i][0],f),y=lerp(P[i-1][1],P[i][1],f);ctx.lineTo(x,y);end=[x,y];an=Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0]);break;}}
  ctx.stroke();ctx.shadowBlur=0;ctx.setLineDash([]);if(o.head!==false&&p>=0.98){const hs=o.head||9,[x,y]=end;ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(an-0.5)*hs,y-Math.sin(an-0.5)*hs);ctx.lineTo(x-Math.cos(an+0.5)*hs,y-Math.sin(an+0.5)*hs);ctx.closePath();ctx.fill();}ctx.restore();});}
// the people at the side of the diagram: one, at the left; or two, side by side. [x, scale]
const P5_ONE=[210,0.8],P5_TWO=[[130,0.72],[318,0.72]];

/* ---------- the checkpoint at Hakone, from the road, at dusk ---------- */
// The view looks north across the road: the lake behind it, the mountains round the lake beyond, and on the right the steep slope the
// checkpoint's fence climbs, so nobody passes but through its gate. Travellers from Edo come from the right, walking west.
const P5_Y0=800,P5_GX=1010;
// the hill on the right, the fence's line up it, and the side path that would go round
const P5_HILL=[[1120,P5_Y0],[1210,742],[1300,662],[1390,578],[1470,516],[1560,470],[1660,438],[1780,420],[1920,410]];
const P5_FENCE=[[P5_GX+128,P5_Y0-4],[1200,748],[1290,668],[1380,590],[1462,528],[1540,486]];
const P5_SIDE=[[1880,P5_Y0+6],[1800,708],[1700,640],[1640,560],[1560,520],[1470,500],[1380,470]];
// the checkpoint's gate: two heavy posts, a beam across them under a small roof, its two doors open (o.open 1) or shut, a lantern on
// each post (o.lit); a silhouette, lit along its edges by o.rim. Its posts stand s*120 either side of x
function p5_gate(ctx,x,y0,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[14,12,16],rim=o.rim||PSC,lit=o.lit==null?1:o.lit,op=o.open==null?1:o.open;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y0);ctx.scale(s,s);
  if(lit>0.01){glow(ctx,-120,-150,90,PSC,0.45*lit);glow(ctx,120,-150,90,PSC,0.45*lit);}
  ctx.fillStyle=rgba(col,1);
  // the doors: boards hung from each post, swung back toward the post as they open
  [-1,1].forEach(k=>{const wd=lerp(104,30,op);ctx.fillRect(k<0?-108:108-wd,-196,wd,196);ctx.strokeStyle=rgba(mix(col,rim,0.25),0.7);ctx.lineWidth=1.4;for(let i=1;i<4;i++){const xx=k<0?-108+wd*i/4:108-wd*i/4;ctx.beginPath();ctx.moveTo(xx,-192);ctx.lineTo(xx,-4);ctx.stroke();}});
  // the posts, the beam and the tie under it, and the roof
  [-1,1].forEach(k=>{ctx.fillStyle=rgba(col,1);ctx.fillRect(k*120-12,-232,24,232);});ctx.fillRect(-150,-232,300,20);ctx.fillRect(-130,-200,260,10);
  ctx.beginPath();ctx.moveTo(-176,-238);ctx.quadraticCurveTo(-110,-246,-84,-282);ctx.lineTo(84,-282);ctx.quadraticCurveTo(110,-246,176,-238);ctx.lineTo(176,-228);ctx.lineTo(-176,-228);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(rim,0.55);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-176,-238);ctx.quadraticCurveTo(-110,-246,-84,-282);ctx.lineTo(84,-282);ctx.quadraticCurveTo(110,-246,176,-238);ctx.stroke();
  [-1,1].forEach(k=>{ctx.beginPath();ctx.moveTo(k*120-12,-212);ctx.lineTo(k*120-12,0);ctx.stroke();});
  // a lantern on each post
  if(lit>0.01)[-1,1].forEach(k=>{ctx.fillStyle=rgba(mix([80,60,40],[255,214,150],lit),1);rr(ctx,k*120-11-(k<0?20:-20),-170,22,34,7);ctx.fill();});
  ctx.restore();});}
// a fence of stakes along the points P, two rails across them; drawn up to p of its length
function p5_fence(ctx,P,col,rim,p){if(p<=0.01)return;const L=p5_len(P),T_=L[L.length-1]*clamp(p,0,1);ctx.save();ctx.fillStyle=rgba(col,1);
  for(let d=0;d<=T_;d+=13){let i=1;while(i<L.length-1&&L[i]<d)i++;const f=(d-L[i-1])/((L[i]-L[i-1])||1),x=lerp(P[i-1][0],P[i][0],f),y=lerp(P[i-1][1],P[i][1],f),h=74+8*hash(Math.round(d),3);
    ctx.beginPath();ctx.moveTo(x-4,y+4);ctx.lineTo(x-4,y-h+6);ctx.lineTo(x,y-h);ctx.lineTo(x+4,y-h+6);ctx.lineTo(x+4,y+4);ctx.closePath();ctx.fill();}
  ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;[22,54].forEach(dy=>{ctx.beginPath();P.forEach(([x,y],i)=>{const q=L[i]<=T_;if(!q&&i>0&&L[i-1]<=T_){const f=(T_-L[i-1])/(L[i]-L[i-1]);ctx.lineTo(lerp(P[i-1][0],x,f),lerp(P[i-1][1],y,f)-dy);}else if(q)i?ctx.lineTo(x,y-dy):ctx.moveTo(x,y-dy);});ctx.stroke();});
  ctx.strokeStyle=rgba(rim,0.3);ctx.lineWidth=1.4;ctx.beginPath();P.forEach(([x,y],i)=>{if(L[i]<=T_)i?ctx.lineTo(x,y-78):ctx.moveTo(x,y-78);});ctx.stroke();ctx.restore();}
// the guardhouse: a long low house with deep eaves and an open front, its raised floor lit from inside, and the officials who sit on it
function p5_guard(ctx,x,y0,s,o){o=o||{};const lit=o.lit==null?1:o.lit;ctx.save();ctx.translate(x,y0);ctx.scale(s,s);if(lit>0.01)glow(ctx,0,-110,300,PSC,0.2*lit);
  ctx.fillStyle="rgba(20,16,18,1)";ctx.fillRect(-300,-170,600,170);
  const g=ctx.createLinearGradient(0,-138,0,-46);g.addColorStop(0,rgba(mix([40,30,28],[255,196,128],lit*0.9),0.95));g.addColorStop(1,rgba(mix([24,18,18],[150,96,62],lit*0.9),0.95));ctx.fillStyle=g;ctx.fillRect(-270,-138,540,92);
  // the officials, seated in a row on the raised floor, facing the road
  ctx.fillStyle="rgba(16,12,14,1)";[-170,-60,60].forEach((sx,i)=>{ctx.beginPath();ctx.arc(sx,-108,11,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(sx-26,-46);ctx.quadraticCurveTo(sx-24,-92,sx,-96);ctx.quadraticCurveTo(sx+24,-92,sx+26,-46);ctx.closePath();ctx.fill();});
  // the floor's edge, the posts of the open front, and the roof
  ctx.fillStyle="rgba(14,10,12,1)";ctx.fillRect(-286,-46,572,14);[-270,-135,0,135,264].forEach(px=>ctx.fillRect(px,-150,8,104));
  ctx.beginPath();ctx.moveTo(-342,-160);ctx.quadraticCurveTo(-180,-170,-150,-238);ctx.lineTo(150,-238);ctx.quadraticCurveTo(180,-170,342,-160);ctx.lineTo(342,-148);ctx.lineTo(-342,-148);ctx.closePath();ctx.fillStyle="rgba(12,10,14,1)";ctx.fill();
  ctx.strokeStyle=rgba(mix([90,70,60],PSC,0.4*lit),0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-342,-160);ctx.quadraticCurveTo(-180,-170,-150,-238);ctx.lineTo(150,-238);ctx.quadraticCurveTo(180,-170,342,-160);ctx.stroke();ctx.restore();}
// a cedar, tall and narrow, its crown in tiers
function p5_cedar(ctx,x,y,h,seed,col,rim){const w=h*(0.24+0.08*hash(seed,1)),n=5;ctx.save();ctx.translate(x,y);ctx.fillStyle=rgba(col,1);ctx.fillRect(-h*0.035,-h*0.18,h*0.07,h*0.2);
  ctx.beginPath();ctx.moveTo(0,-h);for(let i=1;i<=n;i++){const yy=-h+h*0.84*i/n,ww=w*(0.25+0.75*i/n)*(0.85+0.3*hash(seed,10+i));ctx.lineTo(ww,yy);ctx.lineTo(ww*0.5,yy-h*0.03);}
  for(let i=n;i>=1;i--){const yy=-h+h*0.84*i/n,ww=w*(0.25+0.75*i/n)*(0.85+0.3*hash(seed,20+i));ctx.lineTo(-ww*0.5,yy-h*0.03);ctx.lineTo(-ww,yy);}ctx.closePath();ctx.fill();
  if(rim){ctx.strokeStyle=rgba(rim,0.22);ctx.lineWidth=1.2;ctx.stroke();}ctx.restore();}
// the whole place: sky, the mountains round the lake, the lake, the hill and its cedars, the fence, the guardhouse, the gate and the road.
// o.d: dusk 0..1; o.lit: lanterns; o.side: the path that would go round (0..1 drawn), o.cross: it struck out; o.gate: the gate lit
function p5_check(ctx,S,t,o){o=o||{};const d=o.d==null?1:o.d,y0=P5_Y0,lit=o.lit==null?1:o.lit;
  const g=ctx.createLinearGradient(0,0,0,600);g.addColorStop(0,rgba(mix([10,14,30],[22,26,56],d),1));g.addColorStop(0.7,rgba(mix([18,20,40],[96,62,78],d),1));g.addColorStop(1,rgba(mix([30,26,38],[208,136,94],d),1));ctx.fillStyle=g;ctx.fillRect(0,0,W,610);
  glow(ctx,300,560,700,[230,150,100],0.2*d);
  // the mountains round the lake: two ranges, the further paler
  [[[34,32,52],548,40,0.4],[[26,24,38],586,26,2.2]].forEach(([c,yb,amp,ph])=>{ctx.fillStyle=rgba(mix(c,[70,54,70],d*0.25),1);ctx.beginPath();ctx.moveTo(0,640);for(let x=0;x<=W;x+=16){const y=yb-amp*(0.55+0.45*Math.sin(x*0.0034+ph))*(0.7+0.3*Math.sin(x*0.009+ph*1.7))-28*Math.exp(-Math.pow((x-640-ph*90)/170,2));ctx.lineTo(x,y);}ctx.lineTo(W,640);ctx.closePath();ctx.fill();});
  // the lake: the sky's light on its water, a few long glints
  const lg=ctx.createLinearGradient(0,600,0,712);lg.addColorStop(0,rgba(mix([120,96,126],[196,146,128],d*0.5),1));lg.addColorStop(1,rgba([30,30,52],1));ctx.fillStyle=lg;ctx.fillRect(0,604,1240,108);
  ctx.strokeStyle=rgba([255,220,190],0.28);ctx.lineWidth=1.6;for(let i=0;i<14;i++){const yy=612+i*7,x0=60+hash(i,51)*1000,w_=40+70*hash(i,52)+(t*6+i*13)%30;ctx.beginPath();ctx.moveTo(x0,yy);ctx.lineTo(x0+w_,yy);ctx.stroke();}
  ctx.strokeStyle=rgba([255,226,200],0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,604.5);ctx.lineTo(1240,604.5);ctx.stroke();
  // the near shore and the ground up to the road, and the hill on the right, which the fence climbs
  ctx.fillStyle="rgba(24,20,24,1)";ctx.beginPath();ctx.moveTo(0,712);ctx.quadraticCurveTo(600,700,1240,690);ctx.lineTo(1240,y0);ctx.lineTo(0,y0);ctx.closePath();ctx.fill();
  const hg=ctx.createLinearGradient(0,400,0,y0);hg.addColorStop(0,"rgba(30,26,34,1)");hg.addColorStop(1,"rgba(16,14,18,1)");ctx.fillStyle=hg;ctx.beginPath();ctx.moveTo(1060,y0);P5_HILL.forEach(([x,y])=>ctx.lineTo(x,y));ctx.lineTo(W,y0);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(mix([120,96,110],PSC,0.4),0.38);ctx.lineWidth=2;ctx.beginPath();P5_HILL.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
  [[1250,700,70],[1350,616,84],[1600,470,96],[1700,452,80],[1820,430,92],[1480,536,74],[150,712,120],[60,714,96]].forEach(([x,y,h],i)=>p5_cedar(ctx,x,y+4,h,i+31,[16,14,20],PSC));
  // the path that would go round the checkpoint, over the hill: drawn, then struck out
  if(o.side>0.01){ctx.save();ctx.strokeStyle=rgba(PSC,0.75);ctx.lineWidth=3;ctx.setLineDash([10,10]);const L=p5_len(P5_SIDE),T_=L[L.length-1]*clamp(o.side,0,1);ctx.beginPath();
    P5_SIDE.forEach(([x,y],i)=>{if(L[i]<=T_)i?ctx.lineTo(x,y):ctx.moveTo(x,y);else if(i>0&&L[i-1]<T_){const f=(T_-L[i-1])/(L[i]-L[i-1]);ctx.lineTo(lerp(P5_SIDE[i-1][0],x,f),lerp(P5_SIDE[i-1][1],y,f));}});ctx.stroke();ctx.setLineDash([]);ctx.restore();
    if(o.cross>0.01)p5_cross(ctx,1640,566,62,o.cross);}
  // the fence, the guardhouse and the gate
  p5_fence(ctx,P5_FENCE,[16,14,18],PSC,1);p5_fence(ctx,[[560,y0-6],[P5_GX-128,y0-4]],[16,14,18],PSC,1);
  p5_guard(ctx,300,y0-6,0.78,{lit});
  p5_gate(ctx,P5_GX,y0,1,{lit,rim:PSC,open:1});if(o.gate>0.01)glow(ctx,P5_GX,y0-150,220,PSC,0.25*o.gate);
  // the road, beaten earth catching the last light
  const rg=ctx.createLinearGradient(0,y0,0,y0+70);rg.addColorStop(0,rgba(mix([70,58,50],[150,112,84],d),1));rg.addColorStop(1,rgba([40,34,32],1));ctx.fillStyle=rg;ctx.fillRect(0,y0,W,64);
  const gg=ctx.createLinearGradient(0,y0+64,0,H);gg.addColorStop(0,"rgba(34,28,28,1)");gg.addColorStop(1,"rgba(12,10,12,1)");ctx.fillStyle=gg;ctx.fillRect(0,y0+64,W,H-y0-64);}
// a woman's step: short and quick in a robe to the ankle; her pace matches it (a foot planted moves back 4 x step a stride), so her
// feet hold on the road
const P5_STEP=18,P5_RATE=1.3,P5_VWO=4*P5_STEP*P5_RATE;
// a woman travelling, in profile (o.dir 1 faces right), feet at (x,y0), about 176 px tall at s=1: her robe to her ankles, so a walk
// shows only her steps and the hem's sway; a sash tied in a bow at her back; her hair up in a knot, which o.down (0..1) lets fall down
// her back. A silhouette like every figure on the road, lit along her back by o.rim. To turn, o.dir goes from 1 to -1 (or back): she
// narrows to two fifths of her width as she turns, never to an edge-on line. o.reach (0..1) raises her near arm to o.to, in the frame;
// o.old: the examiner's stoop.
function p5_woman(ctx,x,y0,s,t,o){o=o||{};const a=o.a==null?1:o.a,d0=o.dir==null?1:o.dir,dir=(d0<0?-1:1)*Math.max(Math.abs(d0),0.4);if(a<=0.01)return;const col=o.col||[14,12,16],rim=o.rim||PSC,far=mix(col,[0,0,0],0.4),dn=clamp(o.down||0,0,1);
  const amp=o.still?0:o.amp==null?1:clamp(o.amp,0,1),c=((o.ph||0)+t*(o.rate||P5_RATE))*TAU,bob=(1-Math.abs(Math.cos(c)))*1.6*amp,old=o.old||0,stp=o.step||P5_STEP;
  psaWhole(ctx,a,[x-90*s,y0-210*s,x+90*s,y0+14*s],ctx=>{ctx.save();ctx.translate(x,y0);ctx.scale(s*dir,s);const th=old*0.06+clamp(o.reach||0,0,1)*0.07;ctx.rotate(th);
    // her steps: short, the far foot darker, each sandal just showing under the hem
    [1,0].forEach(k=>{const sg=Math.sin(c+k*Math.PI)*amp,lift=Math.max(0,Math.cos(c+k*Math.PI))*amp;ctx.fillStyle=rgba(k?far:col,1);const fx=sg*stp+(k?-3:3)*(1-amp),fy=-lift*5;
      ctx.beginPath();ctx.moveTo(fx-7,fy-3);ctx.lineTo(fx+12,fy-2);ctx.quadraticCurveTo(fx+15,fy+2,fx+10,fy+3);ctx.lineTo(fx-8,fy+3);ctx.closePath();ctx.fill();});
    ctx.fillStyle=rgba(col,1);const sw=Math.sin(c)*3*amp;
    // the robe: narrow at the ankle, the hem swaying a little with her step; the sleeves hanging
    ctx.beginPath();ctx.moveTo(-9,-140+bob);ctx.bezierCurveTo(-17,-130+bob,-16,-110+bob,-15,-96+bob);ctx.quadraticCurveTo(-14,-46+bob,-14+sw,-6);ctx.lineTo(16+sw,-6);ctx.quadraticCurveTo(16,-50+bob,15,-96+bob);
    ctx.bezierCurveTo(17,-112+bob,16,-130+bob,9,-140+bob);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(-14,-128+bob);ctx.quadraticCurveTo(-24,-104+bob,-21,-80+bob);ctx.lineTo(-9,-80+bob);ctx.lineTo(-6,-118+bob);ctx.closePath();ctx.fill();
    // the sash, and its bow at her back
    ctx.fillStyle=rgba(mix(col,[60,44,40],0.25),1);ctx.fillRect(-16,-106+bob,32,14);ctx.beginPath();ctx.ellipse(-22,-99+bob,9,11,0.2,0,TAU);ctx.fill();ctx.fillStyle=rgba(col,1);
    // the head, the line of the nose, the neck; her hair up in a knot at the back, or let down her back
    ctx.fillRect(-4,-148+bob,8,10);ctx.beginPath();ctx.arc(1,-155+bob,10,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(10.5,-154+bob,3,2.4,0.3,0,TAU);ctx.fill();
    ctx.beginPath();ctx.ellipse(-4,-163+bob,11*(1-dn*0.5),7*(1-dn*0.5),-0.3,0,TAU);ctx.fill();if(dn<0.98){ctx.beginPath();ctx.ellipse(-12,-162+bob,6.5*(1-dn),6*(1-dn),0,0,TAU);ctx.fill();}
    if(dn>0.01){const len=lerp(6,86,dn),fl=lerp(0,8,dn);ctx.beginPath();ctx.moveTo(-6,-166+bob);ctx.quadraticCurveTo(-18,-164+bob,-19-fl*0.4,-148+bob);ctx.quadraticCurveTo(-23-fl,-120+bob,-21-fl,-150+len+bob);
      ctx.quadraticCurveTo(-15,-146+len+bob,-9,-150+len+bob);ctx.quadraticCurveTo(-11,-140+bob,-4,-158+bob);ctx.closePath();ctx.fill();
      ctx.strokeStyle=rgba(rim,0.6*dn);ctx.lineWidth=1.8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-14,-163+bob);ctx.quadraticCurveTo(-19-fl*0.4,-158+bob,-19-fl*0.4,-148+bob);ctx.quadraticCurveTo(-23-fl,-120+bob,-21-fl,-150+len+bob);ctx.stroke();}
    // the light along her back and over her head
    ctx.strokeStyle=rgba(rim,0.45);ctx.lineWidth=1.8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-9,-140+bob);ctx.bezierCurveTo(-17,-130+bob,-16,-110+bob,-15,-96+bob);ctx.quadraticCurveTo(-14,-46+bob,-14+sw,-8);ctx.stroke();
    ctx.beginPath();ctx.arc(-4,-163+bob,11*(1-dn*0.5),Math.PI*1.05,Math.PI*1.75);ctx.stroke();
    // the near arm: down at her side, or (o.reach, 0..1) raised to the point o.to, given in the frame
    const sh=[2,-132+bob];if(o.reach>0.01&&o.to){const tx0=(o.to[0]-x)/(s*dir),ty0=(o.to[1]-y0)/s,tx=tx0*Math.cos(th)+ty0*Math.sin(th),ty=-tx0*Math.sin(th)+ty0*Math.cos(th),r=clamp(o.reach,0,1),hand=[lerp(8,tx,r),lerp(-74+bob,ty,r)],el=[lerp(6,(sh[0]+hand[0])/2+6,r),lerp(-104+bob,(sh[1]+hand[1])/2+16,r)];
      ctx.fillStyle=rgba(col,1);psaLimb(ctx,[sh,el,hand],[11,9,7]);
      ctx.strokeStyle=rgba(rim,0.55*r);ctx.lineWidth=1.8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sh[0],sh[1]-5);ctx.lineTo(el[0],el[1]-5);ctx.lineTo(hand[0],hand[1]-4);ctx.stroke();}
    else{ctx.fillStyle=rgba(col,1);psaLimb(ctx,[sh,[6,-104+bob],[8,-76+bob]],[11,9,7]);}
    ctx.restore();});}
// the pass a woman leaving Edo shows: written by officials in Edo Castle, it says who she is, where she's going and why, and describes
// her hair and any marks on her face, hands and feet. Its lines, typed as p goes from 0 to 1; o.ticks: a tick beside each line
const P5_PASS=["A woman's pass · from Edo Castle","who she is","where she's going, and why","her hair","marks on her face, hands and feet"];
function p5_pass(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=650,h=270;psaPaper(ctx,x,y,w,h,P5_PASS,{kicker:true,size:32,p:o.p==null?1:o.p,a,rot:o.rot||-0.012});
  const tk=o.ticks||[];withA(ctx,a,()=>tk.forEach((q,i)=>{if(q>0.01)tick_(ctx,x+w-52,y+48+32*1.5+i*32*1.3-10,26,[40,140,80],q);}));}

/* ---------- the map: Japan, Edo and the road west, and the checkpoint by the lake ---------- */
const P5_I=n=>PSA_TKD.findIndex(s=>s[0]===n);
// Lake Ashi as a mapmaker would draw it at a glance: a long oval from north to south, its southern end by the road; and where the
// checkpoint stood, on its south-eastern shore
const P5_LAKE=[139.005,35.217],P5_CK=[139.031,35.193];
function p5_map(ctx,t,z,o){o=o||{};const TK=psaMap(ctx,PSA_VIEW,t,{lit:o.lit||0.3,tkd:o.tkd==null?1:o.tkd,st:0,ends:o.ends==null?1:o.ends,namesA:o.namesA,nameSize:34/z});
  const st=o.st||0;if(st>0.01)TK.forEach(([x,y],i)=>{if(i===0||i===TK.length-1)return;psaStop(ctx,x,y,{a:st,lit:0.25,r:4.4/Math.sqrt(z)});});
  const la=o.lake||0;if(la>0.01)withA(ctx,la,()=>{const[lx,ly]=psaJP(...P5_LAKE);ctx.save();ctx.translate(lx,ly);ctx.rotate(0.18);ctx.fillStyle="rgba(110,150,214,0.85)";ctx.beginPath();ctx.ellipse(0,0,5.2,13,0,0,TAU);ctx.fill();
    ctx.strokeStyle="rgba(200,220,255,0.6)";ctx.lineWidth=1.2/z;ctx.stroke();ctx.restore();});
  return TK;}
// the checkpoint on the map: a small gate, in the lantern's amber, scaled so it stays the same size in the frame as the camera moves
function p5_mapGate(ctx,x,y,z,a,hi){if(a<=0.01)return;withA(ctx,a,()=>{const s=0.11/z;glow(ctx,x,y-12/z,48/z,PSC,0.5+0.4*(hi||0));p5_gate(ctx,x,y,s,{col:[40,30,24],rim:PSC,lit:1});});}

/* ---------- the utility: who asks, the catalogue that checks, the tables, and the files under them ---------- */
// the tables, a domain each, spread evenly along the data platform: [name, x of its centre]
const P5_TABS=["billing","customers","network","metering","outages","retail"].map((n,i)=>[n,Math.round(560+1280*(i+0.5)/6)]);
const P5_TX=i=>P5_TABS[i][1],P5_TY=470,P5_TW=190,P5_TH=78;
const P5_DP={x:520,y:560,w:1360,h:60,fh:52},P5_BEAM=392,P5_IDY=232,P5_GRP=324,P5_FILES=712;
// a table: a header with its domain's name and a few rows; o.lock (the bank details, locked), o.red (open to anyone: red), o.hi
function p5_tab(ctx,i,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[name,cx]=P5_TABS[i],x=cx-P5_TW/2,y=P5_TY;withA(ctx,a,()=>{const col=o.red>0.01?mix(APPC,PS_RED,o.red):APPC;
  glass(ctx,x,y,P5_TW,P5_TH,10,col,{glow:10+14*(o.hi||0)+10*(o.red||0),ea:0.85,fill:"rgba(7,12,24,0.95)"});ctx.fillStyle=rgba(col,0.18);ctx.fillRect(x+4,y+4,P5_TW-8,36);
  T(ctx,name,cx,y+32,{w:700,size:28,align:"center",color:rgba(INK,0.96)});ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.4;[52,64].forEach(dy=>{ctx.beginPath();ctx.moveTo(x+14,y+dy);ctx.lineTo(x+P5_TW-14,y+dy);ctx.stroke();});
  if(o.lock>0.01)p5_lock(ctx,x+P5_TW-22,y-8,30,BIZ,o.lock);});}
// the catalogue, drawn as a gate across every way to the data: a beam on posts, under which every request passes; o.hi lights it,
// o.lamp(x) lights it where a request passes. The Hakone gate's own shape, in the platform's green
function p5_cat(ctx,t,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const y=P5_BEAM,x0=P5_DP.x,x1=P5_DP.x+P5_DP.w,hi=o.hi||0;ctx.save();
  if(hi>0.01)glow(ctx,(x0+x1)/2,y,600,TECC,0.18*hi);
  ctx.fillStyle="rgba(8,16,14,0.96)";ctx.strokeStyle=rgba(mix(TECC,INK,0.2*hi),0.9);ctx.lineWidth=2.2;
  [x0+10,x1-10].forEach(px=>{ctx.fillRect(px-9,y-18,18,P5_DP.y-y+16);ctx.strokeRect(px-9,y-18,18,P5_DP.y-y+16);});
  ctx.beginPath();ctx.moveTo(x0-24,y-22);ctx.quadraticCurveTo(x0+60,y-30,x0+90,y-58);ctx.lineTo(x1-90,y-58);ctx.quadraticCurveTo(x1-60,y-30,x1+24,y-22);ctx.lineTo(x1+24,y-8);ctx.lineTo(x0-24,y-8);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillRect(x0,y-8,x1-x0,14);ctx.strokeRect(x0,y-8,x1-x0,14);
  T(ctx,"the catalogue: who's asking, and may they?",(x0+x1)/2,y-24,{w:700,size:28,align:"center",color:rgba(mix(TECC,INK,0.45+0.4*hi),1)});
  if(o.lamp)for(let k=0;k<6;k++){const px=P5_TX(k),q=o.lamp(k);if(q>0.01)glow(ctx,px,y,46,TECC,0.6*q);}
  ctx.restore();});}
// the data platform with its tables; the files under them (o.files), with a lock on them (o.enc)
function p5_dp(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const D=P5_DP;psaPlatform(ctx,D.x,D.y,D.w,D.h,{fh:D.fh,label:"the data platform",lsize:30,hi:o.hi||0});
  for(let i=0;i<6;i++)p5_tab(ctx,i,{a:o.tabs?o.tabs[i]:1,red:o.red?o.red[i]:0,hi:o.thi?o.thi[i]:0,lock:i===1?(o.lock||0):0});
  const fA=o.files||0;if(fA>0.01)withA(ctx,fA,()=>{const y=P5_FILES;ctx.fillStyle="rgba(10,14,20,0.9)";rr(ctx,D.x,y-26,D.w,52,12);ctx.fill();ctx.strokeStyle=rgba(SOFT,0.5);ctx.lineWidth=1.6;ctx.setLineDash([6,6]);rr(ctx,D.x,y-26,D.w,52,12);ctx.stroke();ctx.setLineDash([]);
    for(let i=0;i<22;i++){const fx=D.x+640+i*32;ctx.fillStyle=rgba(SOFT,0.35);ctx.beginPath();ctx.moveTo(fx,y-14);ctx.lineTo(fx+14,y-14);ctx.lineTo(fx+20,y-8);ctx.lineTo(fx+20,y+14);ctx.lineTo(fx,y+14);ctx.closePath();ctx.fill();}
    T(ctx,"the files under the tables",D.x+30,y+10,{w:700,size:28,color:rgba(SOFT,0.95)});
    if(o.enc>0.01)p5_lock(ctx,D.x+D.w-40,y-2,34,PS_OK,o.enc);});});}
// a request from (x0,y0) down to table i, through the catalogue; u from 0 to 1. ok: let through (green); false: stopped at the beam
function p5_req(ctx,x0,y0,i,u,ok,col){if(u<=0)return;const xt=P5_TX(i),P=[[x0,y0],[x0,P5_BEAM-70],[xt,P5_BEAM-30],[xt,P5_TY-2]];
  if(ok){const f=1-clamp((u-1)/0.3,0,1);if(f>0.01)withA(ctx,f,()=>p5_runner(ctx,P,Math.min(u,0.999),col||[236,243,255],{r:6,trail:0.1}));}
  else{const Lr=p5_len(P),stop=(L=>L[2]/L[3])(Lr),uu=Math.min(u,stop),f=1-clamp((u-stop-0.25)/0.2,0,1);if(f>0.01)withA(ctx,f,()=>p5_runner(ctx,P,uu,col||[236,243,255],{r:6,trail:0.1,hold:true}));}}

// the identities the film follows: four jobs and a person, each with its own sign; and what each may reach, [table, "w" or "r"]
const P5_ID=[["billing load","job"],["direct debits","job"],["refunds","job"],["outage dashboard","job"],["billing analyst","person"]];
const P5_GR=[[[0,"w"]],[[1,"r"],[0,"r"]],[[1,"r"],[0,"r"]],[[4,"r"],[2,"r"]],[[0,"r"],[1,"r"]]];
// where each identity's chip sits in its row, [centre, width]; and the row, drawn: o.a(i), o.col(i), o.hi(i), o.pass(i) (a pass of its
// own, a slip of paper over the chip's corner), o.strike(i)
function p5_idX(ctx){const gp=16,ws=P5_ID.map(([n_,k])=>p5_chipW(ctx,n_,28,{icon:k})),tot=ws.reduce((a,b)=>a+b,0)+gp*(P5_ID.length-1);let x=1200-tot/2;return ws.map(w_=>{const c=x+w_/2;x+=w_+gp;return[c,w_];});}
function p5_ids(ctx,t,o){o=o||{};const X=p5_idX(ctx);P5_ID.forEach(([n_,k],i)=>{const q=o.a?o.a(i):1;if(q<=0.01)return;const[cx,w_]=X[i];p5_chip(ctx,cx,P5_IDY,n_,{align:"center",icon:k,col:o.col?o.col(i):TECC,a:q,hi:o.hi?o.hi(i):0,strike:o.strike?o.strike(i):0});
  const ps=o.pass?o.pass(i):0;if(ps>0.01)withA(ctx,q,()=>p5_slip(ctx,cx+w_/2-10,P5_IDY-30,ps));});return X;}
// a grant: a line from identity i's chip (or from y0 below it: its group) to table j, its end marked w (writes) or r (reads); p draws it
function p5_grant(ctx,X,i,j,kind,a,p,col,y0){if(a<=0.01||p<=0)return;const[cx]=X[i],x1=P5_TX(j);p5_route(ctx,[[cx,y0||P5_IDY+24],[x1,P5_TY-6]],col||mix(TECC,INK,0.2),a,p,{lw:2.4,head:9});}
// the platform's log: a row for each read, its time, what was done, the table and who did it. o.whoCol colours the names; o.hiWho
// rings their column; o.p shows the rows one by one
function p5_log(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a,lh=46,h=82+rows.length*lh;if(a<=0.01)return h;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,SOFT,{glow:12,ea:0.85,fill:"rgba(6,10,20,0.95)"});
  T(ctx,title,x+24,y+42,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});const cols=[24,236,340,540];
  rows.forEach((r,i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q<=0.01)return;withA(ctx,q,()=>{const yy=y+94+i*lh;r.forEach((s_,j)=>T(ctx,s_,x+cols[j],yy,{f:"mono",w:500,size:28,color:j===3?rgba(o.whoCol||INK,1):rgba(INK,0.85)}));});});
  if(o.hiWho>0.01)withA(ctx,o.hiWho,()=>{ctx.strokeStyle=rgba(o.whoCol||PS_RED,0.9);ctx.lineWidth=2.6;rr(ctx,x+cols[3]-12,y+62,w-cols[3]-6,rows.length*lh+8,10);ctx.stroke();});});return h;}
// a few lines of code in a card: o.red (a line's index) marks one in red, as o.redA
function p5_code(ctx,x,y,w,title,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=44,h=78+lines.length*lh,col=o.col||SOFT;if(a<=0.01)return h;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12,ea:0.85,fill:"rgba(6,10,20,0.95)"});T(ctx,title,x+24,y+42,{f:"mono",w:500,size:28,color:rgba(col,1)});
  lines.forEach((l,i)=>{const yy=y+92+i*lh,red=o.red===i?(o.redA==null?1:o.redA):0;if(red>0.01)withA(ctx,red,()=>{ctx.fillStyle=rgba(PS_RED,0.16);rr(ctx,x+12,yy-31,w-24,42,8);ctx.fill();ctx.strokeStyle=rgba(PS_RED,0.85);ctx.lineWidth=2;rr(ctx,x+12,yy-31,w-24,42,8);ctx.stroke();});
    const ok=o.ok===i?(o.okA==null?1:o.okA):0;if(ok>0.01)withA(ctx,ok,()=>{ctx.fillStyle=rgba(PS_OK,0.14);rr(ctx,x+12,yy-31,w-24,42,8);ctx.fill();});
    T(ctx,l,x+24,yy,{f:"mono",w:500,size:28,color:rgba(l.startsWith("#")?SOFT:INK,0.95)});});});return h;}
// the regulator's question, on paper
function p5_letter(ctx,x,y,month,a,p){psaPaper(ctx,x,y,760,250,["From the regulator","Who read customers' bank details","in "+month+"?"],{kicker:true,size:34,a,p:p==null?1:p,rot:-0.01});}

/* ---------- 1. A pass that matches ---------- */
scene("pass",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tHo=c("hostages"),tFe=c("fear"),tNe=c("need"),tCk=c("checkpoint"),tPa=c("pass"),tCh=c("check"),tRo=c("round"),tMe=c("men"),tBe=c("better"),tOn=c("one"),tEv=c("every");
  // which room: the map; the checkpoint by the lake at dusk; then the utility. Under the title, the last room leaves whole
  const tTr=w("gate","Every traveller"),outA=1-fin(t,B+0.9,0.7),kA0=fin(t,tTr-1.0,0.9)*(1-fin(t,tOn-0.8,0.9)),uA0=fin(t,tOn-0.8,0.9);
  const kA=kA0*outA,uA=uA0*outA,mA=Math.max(0,1-kA0-uA0)*outA;if(outA<1)p5_base(ctx,S);
  psaRooms(ctx,[[mA,ctx=>{psaSea(ctx,S,{dusk:0.2});ctx.save();
    const[ex,ey]=psaTkd(0,PSA_VIEW),[hx,hy]=psaJP(...P5_CK),CK=[[0,1040,560,1.0],[tHo-0.6,ex-150,ey+40,2.2],[tCk-0.2,hx+20,hy-20,4.6]],z=focusZ(t,CK,2.6);focus(ctx,t,CK,2.6);
    const TK=p5_map(ctx,t,z,{lit:0.3,tkd:clamp((t-0.6)/2.6,0,1),ends:fin(t,0.8,0.8),namesA:fin(t,0.8,0.8),lake:fin(t,tCk-0.2,1.0)});
    // the lords' families, kept in Edo; the two fears on the road out of it: a family slipping out, guns going in
    const hA=fin(t,tHo-0.2,0.8);if(hA>0.01){glow(ctx,ex,ey,70/z,PSC,0.6*hA);withA(ctx,hA,()=>{ctx.strokeStyle=rgba(PSC,0.9);ctx.lineWidth=2.2/z;ctx.beginPath();ctx.arc(ex,ey,26/z,0,TAU);ctx.stroke();});}
    const W5=TK.slice(0,10),o0=w("fear","slipping"),g0=w("fear","guns");
    for(let k=0;k<2;k++){const u=(t-o0-k*1.6)/2.6;if(u>0&&u<1&&t<tCk)p5_runner(ctx,W5,u,PS_RED,{r:5/z,trail:0.12});}
    for(let k=0;k<2;k++){const u=(t-g0-k*1.6)/2.6;if(u>0&&u<1&&t<tCk)p5_runner(ctx,W5.slice().reverse(),u,PS_RED,{r:5/z,trail:0.12});}
    // the checkpoint by the lake
    const[lx,ly]=psaJP(...P5_LAKE);withA(ctx,fin(t,tCk+0.6,0.6),()=>{psaName(ctx,"Lake Ashi",lx-16/z,ly-4/z,{size:30/z,align:"right",color:rgba([170,200,240],1)});psaName(ctx,"Hakone",hx+18/z,hy+30/z,{size:30/z});});
    p5_mapGate(ctx,hx,hy,z,fin(t,w("checkpoint","sets")-0.3,0.6),pulseAt(t,w("checkpoint","checkpoint"),1.6));
    ctx.restore();
    eaYear(ctx,80,80,t<tCk+0.2?"Japan · the early 1600s":"about 1619",CLAY,fin(t,0.5,0.8)*(1-fin(t,tCk-0.4,0.4))+fin(t,tCk+0.2,0.5));
    withA(ctx,fin(t,w("year","century")-0.2,0.6)*(1-fin(t,w("year","lords")-0.4,0.4)),()=>tag(ctx,960,160,"a century of war, just ended",PSC,{align:"center",size:32}));
    withA(ctx,fin(t,w("year","lords")-0.2,0.6)*(1-fin(t,tHo-0.4,0.4)),()=>tag(ctx,960,160,"the lords still rule their own domains",PSC,{align:"center",size:32}));
    withA(ctx,fin(t,w("hostages","wives")-0.2,0.6)*(1-fin(t,tFe-0.4,0.4)),()=>{tag(ctx,960,160,"their wives and children, kept in Edo",PSC,{align:"center",size:32});withA(ctx,fin(t,w("hostages","hostages")-0.2,0.5),()=>tag(ctx,960,226,"as hostages",AMBER,{align:"center",size:30}));});
    withA(ctx,fin(t,tFe-0.2,0.5)*(1-fin(t,tNe-0.4,0.4)),()=>{tag(ctx,960,160,"what the shogunate fears on the road",AMBER,{align:"center",size:32});
      const F=["a lord's family slipping out","guns going in"],gp=24,ws=F.map(s_=>p5_chipW(ctx,s_)),tot=ws[0]+ws[1]+gp;let x=960-tot/2;F.forEach((s_,i)=>{const xx=x;withA(ctx,fin(t,i?g0-0.2:o0-0.2,0.4),()=>p5_chip(ctx,xx,234,s_,{col:PS_RED}));x+=ws[i]+gp;});});
    withA(ctx,fin(t,tNe-0.2,0.5)*(1-fin(t,tCk-0.4,0.4)),()=>{tag(ctx,960,160,"see who leaves Edo",PS_OK,{align:"center",size:32});withA(ctx,fin(t,w("need","stop")-0.2,0.5),()=>tag(ctx,960,226,"and stop anyone who has no right to",PS_OK,{align:"center",size:32}));});
    withA(ctx,fin(t,w("checkpoint","sets")-0.2,0.5),()=>tag(ctx,960,160,"a checkpoint on the Tōkaidō, by Lake Ashi",PSC,{align:"center",size:32}));}],
  /* the checkpoint at dusk: travellers through its gate; a woman and her pass; the examiner; the path round it; men passing. One camera
     for the place and its people: wide, in to the two women for the check, out again for the path round it */
  [kA,ctx=>{const tSd=w("round","side road"),tCr=w("round","crime"),tUn=w("check","unties"),G=P5_Y0+6,vW=psaPace("walker",1.0,1.0);
    setScreen(ctx,S);ctx.save();focus(ctx,t,[[0,960,540,1.0],[tCh-1.2,712,650,1.8],[tRo-0.6,960,540,1.0]],1.8);drift(ctx,t-tTr+1.0,{dur:60},{z:0.02,y:700,x:900});
    p5_check(ctx,S,t,{d:1,lit:1,side:clamp((t-tSd+0.3)/1.6,0,1)*(1-fin(t,tMe-0.3,0.5)),cross:clamp((t-tCr)/0.6,0,1),gate:pulseAt(t,tBe+0.4,2.4)});
    // every traveller through the gate: a walker, a porter and a pilgrim, already on the road as the place comes in, walking west
    [["walker",1250,0.1],["porter",1480,0.5],["pilgrim",1720,0.8]].forEach(([k,x0,ph])=>{const x=x0-vW*(t-tTr+1.0);if(x>-140&&x<2080)psaWalker(ctx,x,G,1.0,t,{kind:k,dir:-1,ph,rate:1.0});});
    // the woman: in from the right, through the gate, to stand before the guardhouse; on her way once she's been checked
    const tIn=tPa-3.4,xs=2060,xw=740,tGo=tRo-0.4,[dW,aW]=p5_go(t,tIn,tIn+(xs-xw)/P5_VWO+0.5,P5_VWO),[dO,aO]=p5_go(t,tGo,tGo+40,P5_VWO),xW=xs-dW-dO,aWo=t<tGo?aW:aO;
    // the examiner: out of the guardhouse to stand before her, a hand to the knot of her hair to untie it; then she turns, and goes in.
    // She stands nearer the camera, so her arm shows over the woman's hair
    const xe0=480,De=200,tEo=tCh-1.2,tEt=tRo-2.2,tEb=tEt+0.4,[d1,a1]=p5_go(t,tEo,tEo+De/P5_VWO+0.5,P5_VWO),[d2,a2]=p5_go(t,tEb,tEb+De/P5_VWO+0.5,P5_VWO),xE=xe0+d1-d2,aE=Math.max(a1,a2),
      dirE=Math.cos(Math.PI*easeCam(clamp((t-tEt)/0.4,0,1))),exA=fin(t,tEo-0.3,0.5)*(1-fin(t,tEb+De/P5_VWO-0.1,0.6)),rch=fin(t,tUn-0.6,0.6)*(1-fin(t,tUn+1.4,0.6)),down=clamp((t-tUn)/1.2,0,1);
    // the woman turns her back to the examiner for her hair to be untied, and turns again to go on her way
    const tTa=tUn-1.0,tTb=tGo-0.6,dirW=t<tTb?-Math.cos(Math.PI*easeCam(clamp((t-tTa)/0.4,0,1))):Math.cos(Math.PI*easeCam(clamp((t-tTb)/0.4,0,1)));
    p5_woman(ctx,xW,G,1.05,t,{dir:dirW,ph:0.6,amp:aWo,still:aWo<=0,down});
    if(exA>0.01)p5_woman(ctx,xE,G,1.0,t,{dir:dirE,ph:0.3,amp:aE,still:aE<=0,old:1,a:exA,reach:rch,to:[xW-9,G-172]});
    // two men pass without stopping
    [["walker",0,0.35],["porter",1.3,0.75]].forEach(([k,dt,ph])=>{const[dd,aa]=p5_go(t,tMe-0.5+dt,tMe+40,vW);const x=2040-dd;if(x>-140&&x<2080)psaWalker(ctx,x,G,1.0,t,{kind:k,dir:-1,ph,amp:aa,still:aa<=0,rate:1.0});});
    ctx.restore();
    // the words over the place
    const tags=[[tTr-0.2,tPa-0.4,"every traveller, through its gate",PSC],[tPa-0.2,tCh-0.4,"a woman leaving Edo shows her pass",PSC],[tCh-0.2,tRo-0.4,"checked against her pass",PSC],
      [tRo-0.2,tMe-0.4,"nobody may go round",AMBER],[tMe-0.2,tBe-0.4,"most men need no pass at all",SOFT],[tBe-0.2,tOn-0.9,"whoever leaves Edo: seen and checked",PS_OK]];
    tags.forEach(([a0,a1,s_,col])=>withA(ctx,fin(t,a0,0.5)*(1-fin(t,a1,0.4)),()=>tag(ctx,960,120,s_,col,{align:"center",size:32})));
    withA(ctx,fin(t,w("gate","dawn")-0.2,0.5)*(1-fin(t,tPa-0.4,0.4)),()=>p5_chip(ctx,960,186,"its gate open from dawn to dusk",{align:"center",col:PSC}));
    // her pass, above where she'll stand: its lines as they're said; then a tick for each as the examiner checks her against it
    const pA=fin(t,tPa+0.3,0.6)*(1-fin(t,tRo-0.6,0.5));if(pA>0.01){const L=P5_PASS,tot=L.join(" ").length,at=[0,w("says","who she is"),w("says","where she's going"),w("says","her hair"),w("says","any marks")],
        i=at.filter(x=>t>=x-0.1).length,n0=L.slice(0,Math.max(1,i)).join(" ").length,p=Math.min(1,n0/tot+0.0001);
      arrive(ctx,395,295,t,tPa+0.3,()=>p5_pass(ctx,70,160,t,{a:pA,p:i>=5?1:p,ticks:[0,1,2,3].map(k=>k===2?fin(t,tUn+0.6,0.4):fin(t,w("check","checks her")+k*0.35,0.4))}),{dy:-12});}
    withA(ctx,fin(t,w("check","doesn't match")-0.2,0.5)*(1-fin(t,tRo-0.4,0.4)),()=>p5_chip(ctx,960,186,"no match: she goes no further",{align:"center",col:PS_RED}));
    withA(ctx,fin(t,tCr-0.2,0.5)*(1-fin(t,tMe-0.4,0.4)),()=>p5_chip(ctx,960,186,"a side road past a checkpoint: a crime",{align:"center",col:PS_RED}));
    withA(ctx,fin(t,w("men","looks hardest")-0.2,0.5)*(1-fin(t,tBe-0.4,0.4)),()=>p5_chip(ctx,960,186,"it looks hardest at what the shogunate fears",{align:"center",col:PSC}));
    withA(ctx,fin(t,w("better","open")-0.2,0.5)*(1-fin(t,tOn-0.9,0.4)),()=>p5_chip(ctx,960,186,"and the road open to everyone else",{align:"center",col:PSC}));
    eaYear(ctx,80,80,t<c("stands")-0.3?"Hakone · about 1619":"about 250 years, until 1869",CLAY,fin(t,tTr-0.4,0.6)*(1-fin(t,c("stands")-0.7,0.4))+fin(t,c("stands")-0.2,0.5));}],
  /* the utility: one account opens every door; then every job and every person with a pass of its own, checked where the data is */
  [uA,ctx=>{const u=t-tOn+0.8;p5_room(ctx,S,t);ctx.save();drift(ctx,u,{dur:20},{z:0.016,y:500,x:1100});
    person(ctx,"ravi",P5_ONE[0],1030,P5_ONE[1],{t});psaWho(ctx,P5_ONE[0]-10,510,"Ravi Menon","platform lead",TECH,fin(t,w("every","Ravi")-0.2,0.6));
    const tK=w("copy","key"),tL=w("copy","log"),tS=w("every","pass"),split=fin(t,tS-0.3,0.8),red=(1-split)*fin(t,tOn+0.4,0.8);
    p5_dp(ctx,t,{red:[0,1,2,3,4,5].map(i=>red*fin(t,tOn+0.6+i*0.12,0.4)),tabs:[0,1,2,3,4,5].map(i=>fin(t,tOn-0.6+i*0.1,0.5))});
    // one account, its lines to every table
    const dA=fin(t,tOn+0.2,0.6)*(1-split);if(dA>0.01){const x0=1210,y0=P5_IDY;for(let i=0;i<6;i++)p5_route(ctx,[[x0,y0+24],[P5_TX(i),P5_TY-4]],PS_RED,dA*0.8,clamp((t-tOn-0.5-i*0.1)/0.6,0,1),{lw:2.4,head:8});
      p5_chip(ctx,x0,y0,"data_loader",{align:"center",col:PS_RED,icon:"key",a:dA,hi:pulseAt(t,tOn+0.3,1.4)});}
    withA(ctx,fin(t,tOn+0.4,0.5)*(1-fin(t,tK-0.4,0.4)),()=>tag(ctx,1180,120,"one account opens every door",PS_RED,{align:"center",size:32}));
    withA(ctx,fin(t,tK-0.2,0.5)*(1-fin(t,tL-0.4,0.4)),()=>tag(ctx,1180,120,"its key, in a script anyone could copy",PS_RED,{align:"center",size:32}));
    withA(ctx,fin(t,tL-0.2,0.5)*(1-fin(t,tS-0.6,0.4)),()=>tag(ctx,1180,120,"and the log can't say who used it",AMBER,{align:"center",size:32}));
    // every job and every person, a pass of its own; every request checked at the catalogue
    p5_cat(ctx,t,fin(t,w("every","checked")-0.4,0.7),{hi:pulseAt(t,w("every","checked"),1.6),lamp:k=>pulseAt(t,w("every","checked")+0.5+k*0.18,1.0)});
    const X=p5_ids(ctx,t,{a:i=>fin(t,tS-0.3+i*0.12,0.5),pass:i=>fin(t,tS+0.2+i*0.12,0.4)});
    X.forEach(([cx],i)=>{if(t>tS-0.3+i*0.12)p5_req(ctx,cx,P5_IDY+24,P5_GR[i][0][0],(t-w("every","checked")-0.3-i*0.2)/1.4,true);});
    withA(ctx,fin(t,tS-0.2,0.5),()=>tag(ctx,1180,120,"a pass of their own, checked where the data is",PS_OK,{align:"center",size:32}));
    ctx.restore();}]]);
  vign(ctx,S);
  psaTitle(ctx,S,t,B+0.9,"Security all the way through","who's asking, checked where the data is","Film 5 of 8 · platform and solution architecture");});

/* ---------- 2. One account, every door ---------- */
// where the jobs that run as data_loader sit round it, and the laptops of the people who sign in as it
const P5_DL=[1200,300],P5_JOBS=(()=>{const P=[];for(let i=0;i<47;i++){const side=i<24?-1:1,k=i<24?i:i-24,n=i<24?24:23,an=(k+0.5)/n*Math.PI*0.9+Math.PI*0.05,r=250+60*(k%2);P.push([P5_DL[0]+side*Math.sin(an)*r*1.9,P5_DL[1]-Math.cos(an)*r*0.36+20]);}return P;})();
const P5_LAPS=[[740,470],[860,500],[1540,500],[1660,470]];
scene("account",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p5_room(ctx,S,t);
  const tTi=c("ticket"),tLo=c("log"),tJo=c("jobs"),tKe=c("key"),tRi=c("rights"),tHa=c("harm"),tHo=c("how"),tSl=c("slow");ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  // Ama, the regulatory lead, who asks the data team
  psaWhole(ctx,fin(t,0.2,0.7),[0,380,440,1080],ctx=>person(ctx,"ama",P5_ONE[0],1030,P5_ONE[1],{t}));psaWho(ctx,P5_ONE[0]-10,510,"Ama Owusu","regulatory lead",BIZ,fin(t,w("ticket","Ama")-0.2,0.6));
  // the regulator's question, then Ama's ticket
  const lA=fin(t,0.5,0.6)*(1-fin(t,tLo-0.5,0.5));if(lA>0.01)arrive(ctx,1180,250,t,0.5,()=>p5_letter(ctx,800,110,"February",lA,clamp((t-0.6)/Math.max(1,w("ask","February")-0.4),0,1)),{dy:-12});
  const kA=fin(t,tTi-0.1,0.6)*(1-fin(t,tLo-0.5,0.5));if(kA>0.01)arrive(ctx,1180,500,t,tTi-0.1,()=>psaCard(ctx,800,410,760,"ticket · to the data team",["Who read customers' bank details","in February? For the regulator."],BIZ,{size:30,a:kA}),{dy:-10});
  // the log: every line names the same account
  const R=[["Feb 3  08:14","read","customers","data_loader"],["Feb 9  22:40","read","customers","data_loader"],["Feb 17 13:02","read","customers","data_loader"],["Feb 24 07:55","read","customers","data_loader"]];
  const gA=fin(t,tLo-0.1,0.6)*(1-fin(t,tJo-0.5,0.5));if(gA>0.01)arrive(ctx,1180,330,t,tLo-0.1,()=>p5_log(ctx,760,150,860,"the platform's log · February",R,{a:gA,p:clamp((t-tLo)/1.6,0,1),whoCol:mix(INK,PS_RED,fin(t,w("log","same account")-0.2,0.6)),hiWho:fin(t,w("log","same account")-0.1,0.5)}),{dy:-10});
  // one account: the 47 jobs that run as it, and four people who sign in as it from their laptops
  const jA=fin(t,tJo-0.3,0.6),cA=jA*(1-fin(t,tRi-0.6,0.6)),dlY=lerp(P5_DL[1],P5_IDY,easeCam(clamp((t-tRi+0.6)/1.2,0,1)));
  if(cA>0.01)withA(ctx,cA,()=>{P5_JOBS.forEach(([x,y],i)=>{const q=fin(t,w("jobs","forty-seven")-0.3+i*0.012,0.4);if(q<=0.01)return;withA(ctx,q,()=>{ctx.strokeStyle=rgba(PS_RED,0.28);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(P5_DL[0],dlY);ctx.stroke();psaCog(ctx,x,y,7,mix(TECC,SOFT,0.4),t*0.5+i);});});
    P5_LAPS.forEach(([x,y],i)=>{const q=fin(t,w("jobs","four people")-0.2+i*0.12,0.4);if(q<=0.01)return;withA(ctx,q,()=>{ctx.strokeStyle=rgba(PS_RED,0.4);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x,y-20);ctx.lineTo(P5_DL[0],dlY+20);ctx.stroke();p5_laptop(ctx,x,y,58,SOFT,1);});});
    withA(ctx,fin(t,w("jobs","forty-seven")-0.2,0.5),()=>p5_chip(ctx,960,560,"47 jobs run as it",{align:"center",col:SOFT}));withA(ctx,fin(t,w("jobs","four people")-0.2,0.5),()=>p5_chip(ctx,1440,560,"4 people sign in as it",{align:"center",col:SOFT}));
    withA(ctx,fin(t,w("jobs","first month")-0.3,0.5)*(1-fin(t,tKe-0.7,0.4)),()=>p5_chip(ctx,1200,640,"made in the platform's first month",{align:"center",col:CLAY}));});
  // its key, in a script in the repository, with no end date
  const sA=fin(t,tKe-0.2,0.6)*(1-fin(t,tRi-0.6,0.5));if(sA>0.01)arrive(ctx,1200,700,t,tKe-0.2,()=>{ctx.fillStyle="rgba(3,5,11,0.6)";ctx.fillRect(560,590,1300,300);
    p5_code(ctx,760,600,880,"load_all.py · in the repository",["user = \"data_loader\"","key  = \"dl-7f3c9a2e…\"","# no end date"],{a:sA,red:1,redA:fin(t,w("key","Its key")-0.1,0.5)});},{dy:-10});
  withA(ctx,fin(t,w("key","Anyone")-0.2,0.5)*(1-fin(t,tRi-0.6,0.4)),()=>tag(ctx,1180,120,"anyone who can read the script can use it",PS_RED,{align:"center",size:32}));
  // every table, in every domain: read and change
  const dpA=fin(t,tRi-0.4,0.8),red=fin(t,w("rights","every table")-0.2,0.6);p5_dp(ctx,t,{a:dpA,red:[0,1,2,3,4,5].map(i=>red*fin(t,w("rights","every table")+i*0.1,0.4)),thi:[0,1,0,0,0,0].map(k=>k*pulseAt(t,tHa+0.2,2.0))});
  const dlA=jA;if(dlA>0.01){if(t>tRi-0.4)for(let i=0;i<6;i++)p5_route(ctx,[[P5_DL[0],dlY+24],[P5_TX(i),P5_TY-6]],PS_RED,0.8*dpA,clamp((t-w("rights","every table")-i*0.1)/0.6,0,1),{lw:2.4,head:8});
    p5_chip(ctx,P5_DL[0],dlY,"data_loader",{align:"center",col:PS_RED,icon:"key",a:dlA,hi:pulseAt(t,tJo,1.4)+pulseAt(t,tHo+0.4,1.6)});}
  withA(ctx,fin(t,w("rights","read and change")-0.2,0.5)*(1-fin(t,tHa-0.4,0.4)),()=>tag(ctx,1180,120,"read and change: every table, in every domain",PS_RED,{align:"center",size:32}));
  // the harm: nobody can tell the regulator who read them; a copied key could still read them today
  withA(ctx,fin(t,tHa-0.2,0.5)*(1-fin(t,tHo-0.4,0.4)),()=>tag(ctx,1180,120,"who read the bank details? nobody can say",AMBER,{align:"center",size:32}));
  withA(ctx,fin(t,w("harm","copied")-0.2,0.5)*(1-fin(t,tHo-0.4,0.4)),()=>p5_chip(ctx,1180,800,"a copied key could still read them today",{align:"center",col:PS_RED}));
  // how it happened: a new account took a ticket and two weeks; data_loader worked at once. The safe way was the slow way
  withA(ctx,fin(t,tHo-0.2,0.5)*(1-fin(t,tSl-0.4,0.4)),()=>tag(ctx,1180,120,"nobody meant harm",SOFT,{align:"center",size:32}));
  const H2=[["a new account: a ticket, and two weeks",w("how","new account"),SOFT],["data_loader: at once",w("how","at once"),PS_RED]],gp=24,ws=H2.map(([s_])=>p5_chipW(ctx,s_)),tot=ws[0]+ws[1]+gp;let xx=1180-tot/2;
  H2.forEach(([s_,t0,col],i)=>{const x_=xx;withA(ctx,fin(t,t0-0.3,0.5)*(1-fin(t,sc.dur-1.0,0.5)),()=>p5_chip(ctx,x_,800,s_,{col}));xx+=ws[i]+gp;});
  withA(ctx,fin(t,tSl-0.2,0.5)*(1-fin(t,sc.dur-1.0,0.5)),()=>tag(ctx,1180,120,"the safe way was the slow way",AMBER,{align:"center",size:32}));
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Who is asking ---------- */
scene("who",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p5_room(ctx,S,t);
  const tPe=c("people"),tJo=c("jobs"),tSt=c("story"),sOut=fin(t,sc.dur-1.8,0.5),back=fin(t,sc.dur-1.25,0.6);ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  // Ama, where the chapter before left her, goes; Ravi comes in
  psaWhole(ctx,1-fin(t,0.3,0.7),[0,380,440,1080],ctx=>person(ctx,"ama",P5_ONE[0],1030,P5_ONE[1],{t}));withA(ctx,1-fin(t,0.2,0.5),()=>psaWho(ctx,P5_ONE[0]-10,510,"Ama Owusu","regulatory lead",BIZ));
  psaWhole(ctx,fin(t,0.8,0.7),[0,380,440,1080],ctx=>person(ctx,"ravi",P5_ONE[0],1030,P5_ONE[1],{t}));psaWho(ctx,P5_ONE[0]-10,510,"Ravi Menon","platform lead",TECH,fin(t,1.0,0.6));
  // the tables stay; data_loader's lines go, and the account with them
  const off=fin(t,0.6,1.0),stA=Math.max(1-fin(t,tSt-0.75,0.5),back),sA=fin(t,tSt-0.2,0.6)*(1-sOut);p5_dp(ctx,t,{a:stA,red:[0,1,2,3,4,5].map(()=>1-off)});
  if(off<0.99){for(let i=0;i<6;i++)p5_route(ctx,[[P5_DL[0],P5_IDY+24],[P5_TX(i),P5_TY-6]],PS_RED,0.8*(1-off),1,{lw:2.4,head:8});p5_chip(ctx,P5_DL[0],P5_IDY,"data_loader",{align:"center",col:PS_RED,icon:"key",a:1-off});}
  withA(ctx,fin(t,w("start","identity")-0.2,0.5)*(1-fin(t,tPe-0.4,0.4)),()=>tag(ctx,1180,120,"every request says who's asking",PS_OK,{align:"center",size:32}));
  // people sign in as themselves: single sign-on, and a second check on the phone
  withA(ctx,stA,()=>{const X=p5_ids(ctx,t,{a:i=>i===4?fin(t,tPe-0.3,0.5):fin(t,tJo-0.3+i*0.15,0.5),pass:i=>i===4?0:fin(t,w("jobs","pass")-0.2+i*0.15,0.4),hi:i=>i===4?pulseAt(t,tPe,1.6):pulseAt(t,w("jobs","identity")+i*0.15,1.2)});
    const pA=fin(t,w("people","single sign-on")-0.3,0.5)*(1-fin(t,tJo-0.4,0.4));if(pA>0.01){const[cx]=X[4];p5_route(ctx,[[cx,P5_IDY+24],[cx,P5_IDY+100]],PS_OK,pA,1,{lw:2.4,head:false});
      p5_chip(ctx,cx,P5_IDY+130,"single sign-on",{align:"center",col:PS_OK,a:pA});withA(ctx,fin(t,w("people","second check")-0.3,0.5)*pA,()=>p5_chip(ctx,cx-20,P5_IDY+196,"a second check, on the phone",{align:"right",col:PS_OK}));}
    withA(ctx,fin(t,tPe-0.2,0.5)*(1-fin(t,tJo-0.4,0.4)),()=>tag(ctx,1180,120,"people sign in as themselves",PS_OK,{align:"center",size:32}));
    // each job an identity of its own; each run a pass that lasts an hour; no key to keep, or to copy
    withA(ctx,fin(t,tJo-0.2,0.5)*(1-fin(t,tSt-0.5,0.4)),()=>tag(ctx,1180,120,"each of the 47 jobs: an identity of its own",PS_OK,{align:"center",size:32}));
    const hA=fin(t,w("jobs","lasts an hour")-0.3,0.5)*(1-fin(t,tSt-0.5,0.4));if(hA>0.01)withA(ctx,hA,()=>{const cw=p5_chip(ctx,1160,800,"each run: a pass that lasts an hour",{align:"center",col:PS_OK}),k=clamp((t-w("jobs","lasts an hour"))/Math.max(1,tSt-0.5-w("jobs","lasts an hour")),0,1),cx_=1160+cw/2+40;
      ctx.save();ctx.strokeStyle=rgba(PS_OK,0.3);ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx_,800,19,0,TAU);ctx.stroke();ctx.strokeStyle=rgba(PS_OK,0.95);ctx.lineWidth=5;ctx.beginPath();ctx.arc(cx_,800,19,-Math.PI/2,-Math.PI/2+TAU*(1-k)*0.999);ctx.stroke();ctx.restore();});
    withA(ctx,fin(t,w("jobs","no key")-0.3,0.5)*(1-fin(t,tSt-0.5,0.4)),()=>{p5_chip(ctx,1180,866-6,"no key to keep, or to copy",{align:"center",col:SOFT});});});
  // at Hakone, a pass described the one woman it was for; a key in a script works for whoever holds it
  // (the platform and its tables step back while the story is told, and come back for the chapter after)
  if(sA>0.01){
    arrive(ctx,885,285,t,tSt-0.3,()=>{p5_pass(ctx,560,150,t,{a:sA,rot:-0.02});withA(ctx,fin(t,w("story","one woman")-0.2,0.5)*sA,()=>tag(ctx,885,486,"described the one woman it was for",PSC,{align:"center",size:30}));},{dy:-10});
    arrive(ctx,1530,330,t,w("story","A key")-0.3,()=>{const q=fin(t,w("story","A key")-0.3,0.6)*sA;p5_code(ctx,1290,190,520,"a script",["key = \"dl-7f3c…\""],{a:q,red:0});p5_key(ctx,1550,420,90,PS_RED,q);
      withA(ctx,fin(t,w("story","whoever")-0.2,0.5)*sA,()=>tag(ctx,1550,486,"works for whoever holds it",PS_RED,{align:"center",size:30}));},{dy:-10});}
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Only what it needs ---------- */
scene("least",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p5_room(ctx,S,t);
  const tJo=c("jobs"),tGr=c("groups"),tBa=c("bank"),tSt=c("story"),sOut=fin(t,sc.dur-1.8,0.5),back=fin(t,sc.dur-1.25,0.6),out=Math.max(1-fin(t,tSt-0.75,0.5),back),gl=1-fin(t,tSt-0.75,0.5);ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  person(ctx,"ravi",P5_ONE[0],1030,P5_ONE[1],{t});psaWho(ctx,P5_ONE[0]-10,510,"Ravi Menon","platform lead",TECH,1);
  const bank=fin(t,w("bank","bank details")-0.3,0.6);
  withA(ctx,out,()=>{p5_dp(ctx,t,{lock:bank,thi:[0,pulseAt(t,w("bank","bank details"),1.8),0,0,0,0]});
    const X=p5_ids(ctx,t,{a:()=>1,pass:i=>i<4?1:0,hi:i=>i===0?pulseAt(t,w("jobs","billing load"),1.4):i===3?pulseAt(t,w("jobs","outage dashboard"),1.4):i===4?pulseAt(t,tGr,1.4):0});
    // each identity's grants, drawn as it's named: the billing load writes billing's raw tables, the dashboard reads two; the rest after
    const at=i=>i===0?w("jobs","billing load"):i===3?w("jobs","outage dashboard"):i===4?w("groups","groups"):w("rights","rights")+0.4+i*0.2;
    P5_GR.forEach((G,i)=>G.forEach(([j,k],m)=>{const t0=at(i)+m*0.25;p5_grant(ctx,X,i,j,k,fin(t,t0-0.2,0.4)*gl,clamp((t-t0)/0.7,0,1),j===1&&bank>0.01?mix(mix(TECC,INK,0.2),BIZ,bank):null,i===4?P5_GRP+23:0);}));
    withA(ctx,fin(t,w("jobs","nothing else")-0.2,0.5)*(1-fin(t,tGr-0.4,0.4)),()=>{const[cx]=X[0];p5_chip(ctx,P5_TX(0),800,"billing load: writes billing's raw tables",{align:"center",col:TECC});});
    withA(ctx,fin(t,w("jobs","reads two")-0.2,0.5)*(1-fin(t,tGr-0.4,0.4)),()=>p5_chip(ctx,1520,800,"outage dashboard: reads two tables",{align:"center",col:TECC}));
    // people, through groups: the analyst is in the billing team (a dashed line down to it), and the team holds the rights
    const gA=fin(t,w("groups","groups")-0.2,0.5)*gl;if(gA>0.01){const[cx]=X[4];withA(ctx,gA,()=>{ctx.save();ctx.strokeStyle=rgba(BIZ,0.85);ctx.lineWidth=2.4;ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(cx,P5_IDY+24);ctx.lineTo(cx,P5_GRP-23);ctx.stroke();ctx.setLineDash([]);ctx.restore();
      p5_chip(ctx,cx,P5_GRP,"the billing team",{align:"center",icon:"group",col:BIZ});});}
    withA(ctx,fin(t,tGr-0.2,0.5)*(1-fin(t,tBa-0.4,0.4)),()=>tag(ctx,1180,120,"people: through groups, by their role",BIZ,{align:"center",size:32}));
    withA(ctx,fin(t,w("rights","only the rights")-0.2,0.5)*(1-fin(t,tGr-0.4,0.4)),()=>tag(ctx,1180,120,"each identity: only the rights it needs",PS_OK,{align:"center",size:32}));
    // the bank details: two jobs and the billing team, nobody else
    withA(ctx,fin(t,tBa-0.2,0.5)*gl,()=>tag(ctx,1180,120,"customers' bank details: two jobs and the billing team",BIZ,{align:"center",size:32}));
    withA(ctx,fin(t,w("bank","Nobody else")-0.2,0.5)*gl,()=>p5_chip(ctx,1180,800,"nobody else",{align:"center",col:BIZ}));});
  // a woman's pass named one journey, not every road
  const sA=fin(t,tSt-0.2,0.6)*(1-sOut);if(sA>0.01)withA(ctx,sA,()=>{const R0=[600,560],R1=[1800,560],n=9;ctx.save();ctx.strokeStyle=rgba(PSC,0.3);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(...R0);ctx.lineTo(...R1);ctx.stroke();
    [[R0[0]+200,560,R0[0]+150,440],[R0[0]+600,560,R0[0]+700,430],[R0[0]+900,560,R0[0]+980,690]].forEach(([x0,y0,x1,y1])=>{ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();});ctx.restore();
    for(let i=0;i<n;i++)psaStop(ctx,lerp(R0[0],R1[0],i/(n-1)),560,{lit:i>=4?1:0.2,r:7});
    p5_route(ctx,[[R1[0],560],[lerp(R0[0],R1[0],4/(n-1)),560]],PSC,1,clamp((t-w("story","one journey")+0.2)/1.2,0,1),{lw:6,glow:14,head:12});
    psaName(ctx,"Edo",R1[0]-6,604,{size:30,align:"right"});
    psaPaper(ctx,720,160,600,190,["A woman's pass","one journey: from Edo,","to where she's going, and why"],{kicker:true,size:32,a:1,rot:-0.015});
    withA(ctx,fin(t,w("story","not every road")-0.2,0.5),()=>tag(ctx,1180,700,"one journey, not every road",PSC,{align:"center",size:30}));});
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Checked where the data is ---------- */
// the office network, round a laptop at the left of the row; the side road that would go round the catalogue to the files
const P5_LAP=[270,300],P5_SIDEP=[[P5_LAP[0]-40,P5_LAP[1]+40],[440,520],[440,P5_FILES],[P5_DP.x+300,P5_FILES]];
scene("checked",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p5_room(ctx,S,t);
  const tNe=c("net"),tSi=c("side"),tEn=c("enc"),tSt=c("story");ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  person(ctx,"ravi",P5_ONE[0],1030,P5_ONE[1],{t});psaWho(ctx,P5_ONE[0]-10,510,"Ravi Menon","platform lead",TECH,1-fin(t,tNe-0.6,0.5)+fin(t,sc.dur-1.4,0.6));
  const tC=w("every","checked"),files=fin(t,tSi-0.2,0.6),enc=fin(t,w("enc","encrypted")-0.2,0.5),hk=pulseAt(t,tSt+0.2,2.4);
  p5_dp(ctx,t,{lock:1,files,enc});
  // the catalogue, across every way to the data; every request through it, checked; one that may not, stopped
  const X=p5_ids(ctx,t,{pass:i=>i<4?1:0});
  p5_cat(ctx,t,fin(t,tC-0.5,0.7),{hi:pulseAt(t,tC,1.8)+hk,lamp:k=>{let q=0;for(let r=0;r<3;r++)q=Math.max(q,pulseAt(t,tC+0.9+r*2.2+k*0.2,0.8));return q*(1-fin(t,sc.dur-1.4,0.6));}});
  const rq=1-fin(t,sc.dur-1.4,0.6);if(rq>0.01)withA(ctx,rq,()=>{P5_GR.forEach((G,i)=>{const[j]=G[0],[cx]=X[i];for(let r=0;r<3;r++)p5_req(ctx,cx,P5_IDY+24,j,(t-tC-0.4-r*2.2-i*0.2)/1.3,true);});
    // the dashboard asks for the bank details: stopped at the catalogue
    const tB=w("every","what they may")-0.4,[cx]=X[3],u=(t-tB)/1.3;p5_req(ctx,cx,P5_IDY+24,1,u,false,PS_RED);const st=fin(t,tB+0.9,0.3)*(1-fin(t,tNe-0.4,0.4));if(st>0.01){const L=[[cx,P5_IDY+24],[cx,P5_BEAM-70],[P5_TX(1),P5_BEAM-30]];const[px,py]=L[2];p5_cross(ctx,px,py-8,30,clamp((t-tB-0.9)/0.4,0,1)*st);}});
  withA(ctx,fin(t,tC-0.3,0.5)*(1-fin(t,tNe-0.4,0.4)),()=>tag(ctx,1180,120,"every request checked where the data is",PS_OK,{align:"center",size:32}));
  withA(ctx,fin(t,w("every","row")-0.3,0.5)*(1-fin(t,tNe-0.4,0.4)),()=>p5_chip(ctx,1180,800,"before a single row is read",{align:"center",col:TECC}));
  // the office network proves nothing: a laptop in it is checked like any other
  const nA=fin(t,tNe-0.3,0.6)*(1-fin(t,tSt-0.5,0.5));if(nA>0.01)withA(ctx,nA,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=2.2;ctx.setLineDash([8,7]);rr(ctx,P5_LAP[0]-150,P5_LAP[1]-110,300,190,18);ctx.stroke();ctx.setLineDash([]);ctx.restore();
    T(ctx,"the office network",P5_LAP[0],P5_LAP[1]-72,{w:700,size:28,align:"center",color:rgba(SOFT,1)});p5_laptop(ctx,P5_LAP[0],P5_LAP[1]+10,70,SOFT,1);
    const tL=w("net","a laptop")-0.2,P=[[P5_LAP[0]+60,P5_LAP[1]-10],[P5_TX(0)-40,P5_BEAM-80],[P5_TX(0)-40,P5_TY-4]],uL=(t-tL)/1.4,fL=1-clamp((uL-1)/0.3,0,1);if(fL>0.01)withA(ctx,fL,()=>p5_runner(ctx,P,clamp(uL,0,0.999),[236,243,255],{r:6,trail:0.1}));
    const tk=fin(t,tL+0.7,0.3);if(tk>0.01)tick_(ctx,P5_TX(0)-60,P5_BEAM-36,22,PS_OK,tk*(1-fin(t,tSi-0.4,0.4)));});
  withA(ctx,fin(t,tNe-0.2,0.5)*(1-fin(t,tSi-0.4,0.4)),()=>tag(ctx,1180,120,"being on the network proves nothing",AMBER,{align:"center",size:32}));
  // no side roads: round the catalogue to the files, struck out
  const sdA=fin(t,tSi-0.2,0.4)*(1-fin(t,tEn-0.4,0.5));if(sdA>0.01){p5_route(ctx,P5_SIDEP,AMBER,sdA,clamp((t-w("side","files")+0.4)/1.2,0,1),{lw:3,dash:[10,9],head:10});p5_cross(ctx,440,620,48,clamp((t-w("side","without")-0.1)/0.5,0,1)*sdA);}
  withA(ctx,fin(t,tSi-0.2,0.5)*(1-fin(t,tEn-0.4,0.4)),()=>tag(ctx,1180,120,"no side roads: the files only through the catalogue",PS_RED,{align:"center",size:32}));
  // encrypted where it's kept and as it moves, set once by the platform
  withA(ctx,fin(t,tEn-0.2,0.5)*(1-fin(t,tSt-0.4,0.4)),()=>tag(ctx,1180,120,"encrypted where it's kept, and as it moves",PS_OK,{align:"center",size:32}));
  withA(ctx,fin(t,w("enc","set once")-0.3,0.5)*(1-fin(t,sc.dur-1.4,0.5)),()=>p5_chip(ctx,1180,800,"set once, by the platform, for every domain",{align:"center",col:TECC}));
  // as at Hakone, nobody goes round the checkpoint: the gate's own shape, in the lantern's amber, behind the catalogue
  const gA=fin(t,tSt-0.3,0.6)*(1-fin(t,sc.dur-1.4,0.6));if(gA>0.01){p5_gate(ctx,1780,170,0.42,{a:gA,col:[40,30,24],rim:PSC,lit:1});withA(ctx,gA,()=>tag(ctx,1180,120,"as at Hakone, nobody goes round",PSC,{align:"center",size:32}));}
  ctx.restore();vign(ctx,S);});

/* ---------- 6. No key in the code ---------- */
const P5_VAULT=[1560,640];
// the secret store: a heavy box with a dial, on the platform's side
function p5_vault(ctx,x,y,a,hi){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-150,y-90,300,180,16,TECC,{glow:12+16*(hi||0),ea:0.85,fill:"rgba(6,14,12,0.96)"});ctx.save();ctx.strokeStyle=rgba(TECC,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+70,y-6,30,0,TAU);ctx.stroke();
  for(let i=0;i<8;i++){const an=i/8*TAU;ctx.beginPath();ctx.moveTo(x+70+Math.cos(an)*30,y-6+Math.sin(an)*30);ctx.lineTo(x+70+Math.cos(an)*38,y-6+Math.sin(an)*38);ctx.stroke();}ctx.restore();
  T(ctx,"secret",x-56,y-10,{w:700,size:28,align:"center",color:rgba(INK,0.95)});T(ctx,"store",x-56,y+26,{w:700,size:28,align:"center",color:rgba(INK,0.95)});});}
scene("secrets",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p5_room(ctx,S,t);
  const tSo=c("store"),tPr=c("pr"),tOf=c("off"),end=fin(t,sc.dur-1.4,0.6),hide=Math.max(1-fin(t,0.3,0.6),end),dim=0.25+0.75*hide;ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  person(ctx,"ravi",P5_ONE[0],1030,P5_ONE[1],{t});psaWho(ctx,P5_ONE[0]-10,510,"Ravi Menon","platform lead",TECH,1);
  withA(ctx,dim,()=>p5_dp(ctx,t,{lock:1}));withA(ctx,hide,()=>{p5_ids(ctx,t,{pass:i=>i<4?1:0});p5_cat(ctx,t,1,{});});
  // two keys that can't go away; into the store with them
  const K=[["the old billing system's password",w("some","password")],["a supplier's key to its service",w("some","supplier's")]],into=clamp((t-w("store","secret store")+0.2)/1.2,0,1),kA=1-fin(t,tPr-0.4,0.4);
  // each key keeps its own line as it goes in, fades as it nears the store and shrinks into it, so the two never cross
  K.forEach(([s_,t0],i)=>{const q=fin(t,t0-0.3,0.5)*kA;if(q<=0.01)return;const e=easeCam(into),x=lerp(1180,P5_VAULT[0],e),y=lerp(250+i*76,P5_VAULT[1]-40+i*80,e),
      f=1-clamp((e-0.25)/0.4,0,1),k=1-0.5*clamp((e-0.45)/0.55,0,1);if(q*f<=0.01)return;
    withA(ctx,q*f,()=>{ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.translate(-x,-y);p5_chip(ctx,x,y,s_,{align:"center",icon:"key",col:AMBER});ctx.restore();});});
  withA(ctx,fin(t,w("some","can't go away")-0.3,0.5)*(1-fin(t,tSo-0.4,0.4)),()=>tag(ctx,1180,120,"some keys can't go away",AMBER,{align:"center",size:32}));
  p5_vault(ctx,P5_VAULT[0],P5_VAULT[1],fin(t,w("store","secret store")-0.5,0.6)*(1-end),pulseAt(t,w("store","by name"),1.6));
  // a job asks for one by name as it runs: never written in the code
  const cA=fin(t,w("store","asks")-0.3,0.6)*(1-fin(t,tPr-0.7,0.4));if(cA>0.01)arrive(ctx,950,300,t,w("store","asks")-0.3,()=>p5_code(ctx,600,220,700,"direct_debits.py",["# asked for by name, as it runs","password = secret(\"old-billing\")"],{a:cA,col:TECC,ok:1,okA:fin(t,w("store","never written")-0.2,0.5)}),{dy:-10});
  withA(ctx,fin(t,tSo-0.2,0.5)*(1-fin(t,tPr-0.4,0.4)),()=>tag(ctx,1180,120,"in the platform's secret store: never in the code",PS_OK,{align:"center",size:32}));
  // every pull request checked for keys before it's merged
  const pA=fin(t,tPr-0.2,0.6)*(1-fin(t,tOf-0.7,0.4));if(pA>0.01)arrive(ctx,950,300,t,tPr-0.2,()=>psaCard(ctx,600,220,700,"pull request · before it's merged",["checked for keys: none found"],TECC,{size:30,a:pA,foot:"merged",footA:fin(t,w("pr","merged")-0.1,0.5),footTick:fin(t,w("pr","merged")-0.1,0.5),footCol:PS_OK}),{dy:-10});
  withA(ctx,fin(t,tPr-0.2,0.5)*(1-fin(t,tOf-0.4,0.4)),()=>tag(ctx,1180,120,"every pull request, checked for keys",PS_OK,{align:"center",size:32}));
  // the old key cancelled; six weeks after Ama's ticket, data_loader switched off
  const oA=fin(t,tOf-0.3,0.6)*(1-end);if(oA>0.01)withA(ctx,oA,()=>{p5_code(ctx,620,200,520,"load_all.py",["key = \"dl-7f3c…\""],{red:0,redA:1});const k=clamp((t-w("off","cancelled")+0.2)/0.5,0,1);ctx.save();ctx.strokeStyle=rgba(PS_RED,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(650,292);ctx.lineTo(650+440*k,292);ctx.stroke();ctx.restore();
    withA(ctx,fin(t,w("off","cancelled")-0.1,0.4),()=>p5_chip(ctx,880,390,"cancelled",{align:"center",col:PS_RED}));
    p5_chip(ctx,1500,280,"data_loader",{align:"center",icon:"key",col:mix(PS_RED,SOFT,fin(t,w("off","switched off"),0.6)),strike:clamp((t-w("off","switched off")+0.1)/0.6,0,1)});
    withA(ctx,fin(t,w("off","switched off")-0.1,0.5),()=>p5_chip(ctx,1500,350,"switched off",{align:"center",col:SOFT}));});
  withA(ctx,fin(t,w("off","six weeks")-0.3,0.5)*(1-end),()=>tag(ctx,1180,120,"six weeks after the ticket",SOFT,{align:"center",size:32}));
  ctx.restore();vign(ctx,S);});

/* ---------- 7. A name on every line ---------- */
scene("log",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p5_room(ctx,S,t);
  const tAg=c("again"),tWh=c("who"),tCl=c("closed"),end=fin(t,sc.dur-1.4,0.6),hide=Math.max(1-fin(t,0.3,0.6),end),dim=0.25+0.75*hide;ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  // Ravi steps back as Ama comes in; at the end, the other way round
  const am=fin(t,tAg-0.6,0.7)*(1-end);psaWhole(ctx,1-am,[0,380,440,1080],ctx=>person(ctx,"ravi",P5_ONE[0],1030,P5_ONE[1],{t}));withA(ctx,1-am,()=>psaWho(ctx,P5_ONE[0]-10,510,"Ravi Menon","platform lead",TECH));
  psaWhole(ctx,am,[0,380,440,1080],ctx=>person(ctx,"ama",P5_ONE[0],1030,P5_ONE[1],{t}));withA(ctx,am,()=>psaWho(ctx,P5_ONE[0]-10,510,"Ama Owusu","regulatory lead",BIZ));
  withA(ctx,dim,()=>p5_dp(ctx,t,{lock:1}));withA(ctx,hide,()=>{p5_ids(ctx,t,{pass:i=>i<4?1:0});p5_cat(ctx,t,1,{});});
  // every line of the log names who asked
  const R=[["May 6  08:14","read","customers","direct debits"],["May 6  09:30","read","customers","refunds"],["May 12 14:05","read","customers","billing analyst"],["May 12 14:20","read","outages","outage dashboard"]];
  const gA=fin(t,0.3,0.6)*(1-fin(t,tAg-0.5,0.5));if(gA>0.01)arrive(ctx,1180,330,t,0.3,()=>p5_log(ctx,740,178,900,"the platform's log · May",R,{a:gA,p:clamp((t-0.4)/1.6,0,1),whoCol:mix(INK,PS_OK,fin(t,w("log","names")-0.2,0.6)),hiWho:fin(t,w("log","names")-0.1,0.5)}),{dy:-10});
  withA(ctx,fin(t,w("log","names")-0.2,0.5)*(1-fin(t,tAg-0.4,0.4)),()=>tag(ctx,1180,120,"a person, or a job's own identity",PS_OK,{align:"center",size:32}));
  // the regulator asks again, about May; the answer in ten minutes; Ama checks it and closes her ticket
  const lA=fin(t,tAg-0.2,0.6)*(1-fin(t,tWh-0.5,0.5));if(lA>0.01)arrive(ctx,1180,300,t,tAg-0.2,()=>p5_letter(ctx,800,175,"May",lA,1),{dy:-12});
  const aA=fin(t,tWh-0.3,0.6)*(1-end);if(aA>0.01)arrive(ctx,1180,330,t,tWh-0.3,()=>psaCard(ctx,760,170,840,"ticket · the regulator's question, May",["two billing jobs: direct debits, refunds","one billing analyst, working on a ticket"],BIZ,{size:30,a:aA,p:clamp((t-w("who","two billing"))/2.6,0,1),foot:"checked by Ama · closed",footA:fin(t,w("closed","closes")-0.1,0.5),footTick:fin(t,w("closed","closes")-0.1,0.5),footCol:PS_OK}),{dy:-10});
  withA(ctx,fin(t,w("who","ten minutes")-0.3,0.5)*(1-end),()=>p5_chip(ctx,1180,800,"the answer: ten minutes",{align:"center",col:PS_OK}));
  withA(ctx,fin(t,tAg-0.2,0.5)*(1-fin(t,tWh-0.4,0.4)),()=>tag(ctx,1180,120,"June: the regulator asks again, about May",SOFT,{align:"center",size:32}));
  ctx.restore();vign(ctx,S);});

/* ---------- 8. The safe way, the easy way ---------- */
const P5_TPL=["its own identity","only the rights it needs","its secrets, in the store","its log, by name"];
scene("default",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p5_room(ctx,S,t);
  const tTe=c("template"),tQu=c("quick"),tHa=c("handoff"),end=fin(t,sc.dur-1.4,0.6),hide=Math.max(1-fin(t,0.3,0.6),end),dim=0.25+0.75*hide;ctx.save();drift(ctx,t,sc,{z:0.012,y:500,x:1100});
  person(ctx,"ravi",P5_ONE[0],1030,P5_ONE[1],{t});psaWho(ctx,P5_ONE[0]-10,510,"Ravi Menon","platform lead",TECH,1);
  withA(ctx,dim,()=>p5_dp(ctx,t,{lock:1}));withA(ctx,hide,()=>{p5_ids(ctx,t,{pass:i=>i<4?1:0});p5_cat(ctx,t,1,{});});
  // left to each domain, the quick way would win again
  const gA=fin(t,w("why","quick way")-0.3,0.5)*(1-fin(t,tTe-0.5,0.4));if(gA>0.01)withA(ctx,gA,()=>{p5_chip(ctx,1180,800,"data_loader, again",{align:"center",icon:"key",col:PS_RED,dash:true});});
  withA(ctx,fin(t,c("why")-0.2,0.5)*(1-fin(t,tTe-0.4,0.4)),()=>tag(ctx,1180,120,"why it's the platform's job",SOFT,{align:"center",size:32}));
  withA(ctx,fin(t,w("why","Left to each")-0.2,0.5)*(1-fin(t,tTe-0.4,0.4)),()=>p5_chip(ctx,1180,186,"left to each domain, the quick way wins again",{align:"center",col:AMBER}));
  // the template: a new job starts with its own identity, its rights, its secrets and its log, from the first day
  const tA=fin(t,c("start")-0.3,0.6)*(1-end);if(tA>0.01)arrive(ctx,1180,410,t,c("start")-0.3,()=>{const h=psaCard(ctx,800,232,760,"a new job · from the platform's template",P5_TPL.map(s_=>"     "+s_),TECC,{size:30,a:tA});
    P5_TPL.forEach((s_,i)=>{const t0=w("start",["identity","rights","secrets","log"][i])-0.1;tick_(ctx,836,318+i*37.5-10,24,PS_OK,fin(t,t0,0.4)*tA);});},{dy:-10});
  withA(ctx,fin(t,tTe-0.2,0.5)*(1-fin(t,tQu-0.4,0.4)),()=>tag(ctx,1180,120,"the safe way, made the easy way",PS_OK,{align:"center",size:32}));
  // minutes, not two weeks; since June, twelve new jobs and not one borrowed account
  withA(ctx,fin(t,tQu-0.2,0.5)*(1-fin(t,tHa-0.6,0.4)),()=>tag(ctx,1180,120,"minutes, not a ticket and two weeks",PS_OK,{align:"center",size:32}));
  const nA=fin(t,w("quick","twelve")-0.3,0.5)*(1-end);if(nA>0.01)withA(ctx,nA,()=>{for(let i=0;i<12;i++){const q=fin(t,w("quick","twelve")-0.2+i*0.08,0.3);withA(ctx,q,()=>psaCog(ctx,1000+i*32,720,9,PS_OK,t*0.4+i));}
    withA(ctx,fin(t,w("quick","not one")-0.2,0.5),()=>p5_chip(ctx,1180,800,"since June: 12 new jobs, not one borrowed account",{align:"center",col:PS_OK}));});
  // how each lock is built is the series Locks before the data
  const hA=fin(t,tHa-0.15,0.5)*(1-end);if(hA>0.01)withA(ctx,hA,()=>{tag(ctx,1180,120,"how each lock is built, one by one",SOFT,{align:"center",size:32});p5_chip(ctx,1180,186,"the series: Locks before the data",{align:"center",col:BIZ,icon:"key"});});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. The data practice on the map ---------- */
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p5_room(ctx,S,t);
  const tPa=c("parts"),tUs=c("uses"),tPr=c("principle");ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  const MOT=LAY6[0][1];
  psaBand(ctx,30,130,"motivation",MOT,fin(t,0.2,0.8));psaBand(ctx,180,250,"application layer",APPC,fin(t,0.3,0.8));psaBand(ctx,450,360,"technology layer",TECC,fin(t,0.5,0.8));
  // the application layer: two domains' data products, and a job that builds one
  const AP=[["billing data products",300,240,400],["a job, from the template",820,240,420],["network data products",1360,240,420]];
  AP.forEach(([nm,x,y,w_],i)=>psaEl(ctx,x,y,w_,84,nm,APPC,"component",{a:fin(t,0.8+i*0.12,0.6),size:28}));
  // the technology layer: the identity provider, and the data platform's own security services
  const node=(x,w_,name,o)=>{psaEl(ctx,x,520,w_,260,"",TECC,"node",o);withA(ctx,o.a==null?1:o.a,()=>T(ctx,name,x+26,566,{w:800,size:30,color:rgba(INK,0.95)}));};
  const tI=w("services","identity provider"),tC=w("services","catalogue"),tSs=w("services","secret store"),tAl=w("services","audit log");
  node(140,420,"identity provider",{a:fin(t,tI-0.4,0.6)});node(640,1140,"the data platform",{a:fin(t,tPa-0.2,0.6)});
  const SV=[["sign-in",170,tI,240],["access check",680,tC,250],["secret store",960,tSs,250],["audit log",1240,tAl,230]];
  SV.forEach(([nm,x,t0,w_])=>psaEl(ctx,x,640,w_,64,nm,TECC,"service",{a:fin(t,t0-0.3,0.5),size:28,hi:pulseAt(t,t0,1.4)}));
  withA(ctx,fin(t,tC-0.2,0.5),()=>T(ctx,"the catalogue",805,740,{w:600,size:28,align:"center",color:rgba(SOFT,1)}));
  // every data product, and every job that builds one, served by the same services (from the node's edge above each service)
  const SR=[[340,520,500,324],[805,520,1030,324],[1085,520,1030,324],[1355,520,1570,324],[805,520,500,324]];
  SR.forEach(([x0,y0,x1,y1],i)=>{const t0=w("uses","uses")-0.6+i*0.15;psaRel(ctx,x0,y0,x1,y1,"serve",TECC,fin(t,t0,0.4),clamp((t-t0)/0.6,0,1));});
  withA(ctx,fin(t,tUs-0.2,0.5)*(1-fin(t,tPr-0.4,0.4)),()=>tag(ctx,960,860,"every data product and every job: the same services",TECC,{align:"center",size:28}));
  // the rule, as a principle
  archEl(ctx,280,50,1360,90,"every request says who's asking, and is checked where the data is",MOT,"principle",{size:28,a:fin(t,w("principle","principle")-0.3,0.6),hi:pulseAt(t,w("principle","principle"),1.4)});
  ctx.restore();vign(ctx,S);});

/* ---------- 10. Nobody goes round ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tD=c("data"),tN=c("next"),outA=1-fin(t,B+0.6,0.8),rA=(1-fin(t,tD-0.6,0.9))*outA,pA=fin(t,tD-0.6,0.9)*outA;if(outA<1)p5_base(ctx,S);
  psaRooms(ctx,[[rA,ctx=>{setScreen(ctx,S);ctx.save();drift(ctx,t,{dur:tD+1},{z:0.02,y:700,x:900});p5_check(ctx,S,t,{d:1,lit:1,gate:pulseAt(t,1.0,2.4)});const G=P5_Y0+6,vW=psaPace("walker",1.0,1.0);
    // travellers through the gate, a woman among them; the road open
    [["walker",0.2,0.1],["porter",1.4,0.5],["pilgrim",3.6,0.8]].forEach(([k,dt,ph])=>{const[dd,aa]=p5_go(t,dt,40,vW);const x=2020-dd;if(x>-140&&x<2080)psaWalker(ctx,x,G,1.0,t,{kind:k,dir:-1,ph,amp:aa,rate:1.0});});
    const[dW,aW]=p5_go(t,2.4,40,P5_VWO);p5_woman(ctx,2060-dW,G,1.05,t,{dir:-1,ph:0.6,amp:aW});
    ctx.restore();
    withA(ctx,fin(t,w("road","looked hardest")-0.3,0.6),()=>tag(ctx,960,120,"it looked hardest at the few the shogunate feared",PSC,{align:"center",size:32}));
    withA(ctx,fin(t,w("road","everyone else")-0.3,0.6),()=>p5_chip(ctx,960,186,"and let everyone else go on",{align:"center",col:PSC}));
    eaYear(ctx,80,80,"Hakone",CLAY,fin(t,0.4,0.6));}],
  [pA,ctx=>{p5_room(ctx,S,t);ctx.save();drift(ctx,t-tD,{dur:12},{z:0.012,y:500,x:1100});
    person(ctx,"ravi",P5_ONE[0],1030,P5_ONE[1],{t});psaWho(ctx,P5_ONE[0]-10,510,"Ravi Menon","platform lead",TECH,1);
    p5_dp(ctx,t,{lock:1});const X=p5_ids(ctx,t,{pass:i=>i<4?1:0});p5_cat(ctx,t,1,{hi:pulseAt(t,w("data","checked")+0.1,1.8),lamp:k=>pulseAt(t,tD+0.8+k*0.25,1.0)});
    P5_GR.forEach((G,i)=>p5_req(ctx,X[i][0],P5_IDY+24,G[0][0],(t-tD-0.6-i*0.25)/1.3,true));
    withA(ctx,fin(t,w("data","by name")-0.3,0.6),()=>tag(ctx,1180,120,"checked where the data is: by name, only what it needs",PS_OK,{align:"center",size:30}));
    withA(ctx,fin(t,w("domains","by default")-0.3,0.6)*(1-fin(t,tN-0.5,0.4)),()=>p5_chip(ctx,1180,800,"for every domain, by default",{align:"center",col:TECC}));
    ctx.restore();
    withA(ctx,fin(t,tN-0.1,0.6),()=>tag(ctx,1180,800,"Next: One solution, end to end",PSC,{align:"center",size:34}));}]]);
  vign(ctx,S);
  psaEnd(ctx,S,t,B+0.6,"Security all the way through","Every request says who's asking, and is checked where the data is.","film 5 of 8");});

/* where the chapters meet: the utility's chapters glide on from one to the next in one room (From words to data's joins.js); what
   stays stays put, and whoever comes or goes does so after the join */
const CHAPTER_JOINS={glide:["who","least","checked","secrets","log","default"]};
