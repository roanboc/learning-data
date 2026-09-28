/* ===== Older than the systems: the film's own pictures =====
   A museum shelf of credentials, from a clay school tablet to a credential signed with a digital key; the model underneath them;
   the five systems that each hold their own model of it; one learner with four IDs; the logical model as a yardstick; its owners.
   The past is drawn warm (clay, iron, parchment and the film's wax red); the present is the films' dark glass, each system in its colour,
   and the shared model in the credential's gold. The labs and the scenarios draw with these too (LV, at the end). */
const OT_WAX=[228,120,90],OT_GOLD=TRUST,OT_STD=KIND,OT_IT=[150,176,215],OT_PAPER=[238,226,200];
// the five systems at the university, each with its own model of a credential: [who holds it, what is held]
const OT_SYS={sis:{n:"Student system",c:APP.sis.c,holds:"awards",m:["Graduand","Award"]},
  lms:{n:"Learning platform",c:APP.lms.c,holds:"completions",m:["User","Completion"]},
  careers:{n:"Careers",c:OFFICE.careers.c,holds:"badges",m:["Member","Badge"]},
  wallet:{n:"Digital wallet",c:[90,220,205],holds:"signed copies",m:["Holder","Credential"]},
  short:{n:"Short-course platform",c:OFFICE.short.c,holds:"microcredentials",m:["Customer","Certificate"]}};
const OT_KEYS=["sis","lms","careers","wallet","short"];

// Aisha, the learner the film follows through five systems (drawn like the series' other people)
if(!PEOPLE.aisha)PEOPLE.aisha={name:"Aisha Khan",role:"Learner",side:"Learner",does:"uses",edge:KIND,seed:10,
  skin:[168,116,84],hair:{style:"long",c:[30,22,20]},earrings:[230,236,250],
  top:{kind:"sweater",c:[64,128,132]},bottom:{c:[48,52,70]},shoe:[230,230,236],build:{sh:64,hip:58,h:0.94}};

/* ---------- small helpers ---------- */
const ot_ease=(t,a,d)=>fin(t,a,d||0.6);
function ot_tag(ctx,x,y,s,col,a,o){if(a<=0.01)return;withA(ctx,a,()=>tag(ctx,x,y,s,col,Object.assign({align:"center",size:20},o||{})));}
// a label under a line, on a dark pill, so it reads over anything
function ot_pill(ctx,x,y,s,col,o){o=o||{};const sz=o.size||18,w=tw(ctx,s,sz,700,o.f)+22;ctx.save();ctx.fillStyle=o.fill||"rgba(7,12,24,0.92)";rr(ctx,x-w/2,y-sz*0.8,w,sz*1.6,sz*0.8);ctx.fill();
  if(o.edge!==false){ctx.strokeStyle=rgba(col,0.6);ctx.lineWidth=1.2;rr(ctx,x-w/2,y-sz*0.8,w,sz*1.6,sz*0.8);ctx.stroke();}ctx.restore();T(ctx,s,x,y+sz*0.36,{w:700,size:sz,align:"center",color:rgba(col,1),f:o.f});return w;}
// a line from box edge to box edge (b = {x,y,w,h}), with an arrowhead and a verb in the middle
function ot_edge(b,tx,ty){const dx=tx-b.x,dy=ty-b.y,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,k=Math.min(Math.abs(ux)>1e-6?b.w/2/Math.abs(ux):1e9,Math.abs(uy)>1e-6?b.h/2/Math.abs(uy):1e9);return[b.x+ux*(k+8),b.y+uy*(k+8)];}
function ot_verb(ctx,A,B,verb,col,a,p,o){o=o||{};if(a<=0.01)return;const s=ot_edge(A,B.x,B.y),e=ot_edge(B,A.x,A.y);arrowTo(ctx,s[0],s[1],e[0],e[1],col,a,{p:p==null?1:p,lw:o.lw||2.6,head:16,dash:o.dash});
  if(verb&&(p==null||p>0.6))withA(ctx,a*(p==null?1:fin(p,0.6,0.4)),()=>ot_pill(ctx,(s[0]+e[0])/2+(o.dx||0),(s[1]+e[1])/2+(o.dy||0),verb,col,{size:o.size||19}));}
// a tick or a cross in a dark disc
function ot_mark(ctx,x,y,ok,a,r){if(a<=0.01)return;r=r||18;withA(ctx,a,()=>{ctx.fillStyle="rgba(7,12,24,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,ok?GOOD:BAD,1,2);(ok?tick_:cross_)(ctx,x,y+(ok?1:0),r*1.3,ok?GOOD:BAD,1);});}
// a magnifying glass, held over a point
function ot_lens(ctx,x,y,r,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(200,230,255,0.08)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=5;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=12;ctx.stroke();
  ctx.lineCap="round";ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(x+r*0.72,y+r*0.72);ctx.lineTo(x+r*1.5,y+r*1.5);ctx.stroke();ctx.restore();});}
// a key, the modern seal
function ot_key(ctx,x,y,s,col,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=10;
  ctx.beginPath();ctx.arc(-16,0,11,0,TAU);ctx.moveTo(-5,0);ctx.lineTo(24,0);ctx.moveTo(14,0);ctx.lineTo(14,9);ctx.moveTo(22,0);ctx.lineTo(22,7);ctx.stroke();ctx.restore();});}

/* ---------- organic matter: clay, iron, paper, parchment, wood ----------
   Natural materials are drawn with smooth, slightly irregular bezier edges, a light side and a shadow side, and a gentle
   continuous motion (a drifting light, a slow wobble of an edge); the systems of today stay crisp glass. */
// a smooth, slightly irregular outline around a rounded box (a superellipse of half-sizes a and b), which breathes gently with t
function ot_organic(ctx,cx,cy,a,b,o){o=o||{};const n=o.n||6,N=o.N||56,amp=o.amp||2,sd=o.seed||1,t=o.t||0,pts=[];
  for(let i=0;i<N;i++){const th=i/N*TAU,c=Math.cos(th),sn=Math.sin(th),px=a*Math.sign(c)*Math.pow(Math.abs(c),2/n),py=b*Math.sign(sn)*Math.pow(Math.abs(sn),2/n),L=Math.hypot(px,py)||1;
    const w=amp*(0.55*Math.sin(th*3+sd)+0.3*Math.sin(th*7+sd*2.3)+0.25*(hash(i,sd)-0.5)+0.18*Math.sin(t*0.6+th*2+sd));pts.push([cx+px+px/L*w,cy+py+py/L*w]);}
  const m=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2];ctx.beginPath();const s0=m(pts[N-1],pts[0]);ctx.moveTo(s0[0],s0[1]);
  for(let i=0;i<N;i++){const p=pts[i],q=pts[(i+1)%N],mm=m(p,q);ctx.quadraticCurveTo(p[0],p[1],mm[0],mm[1]);}ctx.closePath();}
// fill the current path as a material lit from the upper left: a light side, a shadow side, and a soft light that drifts with t
function ot_matter(ctx,x0,y0,x1,y1,base,o){o=o||{};const t=o.t||0,lt=o.light==null?0.22:o.light;ctx.save();
  if(o.shadow!==false){ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=24;ctx.shadowOffsetY=8;}ctx.fillStyle=rgba(base,1);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,"rgba(255,246,226,"+lt+")");g.addColorStop(0.5,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(30,16,6,"+(lt*1.5)+")");ctx.fillStyle=g;ctx.fill();
  ctx.clip();const lx=lerp(x0,x1,0.35+0.25*Math.sin(t*0.25+(o.seed||0))),ly=lerp(y0,y1,0.3+0.1*Math.cos(t*0.2)),r=Math.max(x1-x0,y1-y0)*0.6,rg=ctx.createRadialGradient(lx,ly,2,lx,ly,r);
  rg.addColorStop(0,"rgba(255,236,200,0.16)");rg.addColorStop(1,"rgba(255,236,200,0)");ctx.fillStyle=rg;ctx.fillRect(x0-20,y0-20,x1-x0+40,y1-y0+40);ctx.restore();}
// the edge of a material: heavier and darker on the shadow side, fine and light on the lit side (the path must still be current)
function ot_rim(ctx,dark,light,w){ctx.save();ctx.lineJoin="round";ctx.translate(1.4,1.8);ctx.strokeStyle=dark;ctx.lineWidth=w||3;ctx.stroke();ctx.translate(-2.4,-2.8);ctx.strokeStyle=light;ctx.lineWidth=(w||3)*0.45;ctx.stroke();ctx.restore();}
// a tapered stroke along a smooth line of points: thin at both tips, full in the middle, like ink from a brush or a reed
function ot_taper(ctx,pts,w,col,o){o=o||{};const n=pts.length;if(n<2)return;const L=[],R=[];
  for(let i=0;i<n;i++){const p=pts[i],q=pts[Math.min(n-1,i+1)],r=pts[Math.max(0,i-1)],dx=q[0]-r[0],dy=q[1]-r[1],d=Math.hypot(dx,dy)||1,u=i/(n-1),ww=w*(o.tip==null?0.12:o.tip)+w*Math.pow(Math.sin(Math.PI*(o.half?u*0.5+0.5:u)),o.k||0.7)*(1-(o.tip==null?0.12:o.tip));
    L.push([p[0]-dy/d*ww/2,p[1]+dx/d*ww/2]);R.push([p[0]+dy/d*ww/2,p[1]-dx/d*ww/2]);}
  ctx.beginPath();ctx.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)ctx.lineTo(L[i][0],L[i][1]);for(let i=n-1;i>=0;i--)ctx.lineTo(R[i][0],R[i][1]);ctx.closePath();ctx.fillStyle=col;ctx.fill();}
// points along a quadratic curve
const ot_curve=(x0,y0,cx,cy,x1,y1,n)=>{const o=[];for(let i=0;i<=(n||12);i++){const u=i/(n||12),v=1-u;o.push([v*v*x0+2*v*u*cx+u*u*x1,v*v*y0+2*v*u*cy+u*u*y1]);}return o;};
// a corner of a sheet lifting slightly: a soft curl whose size breathes with t
function ot_curl(ctx,x,y,sz,paper,t){const k=sz*(0.9+0.1*Math.sin(t*0.8));ctx.save();ctx.beginPath();ctx.moveTo(x-k,y);ctx.quadraticCurveTo(x-k*0.35,y-k*0.2,x,y-k);ctx.quadraticCurveTo(x-k*0.55,y-k*0.55,x-k,y);ctx.closePath();
  const g=ctx.createLinearGradient(x-k,y-k,x,y);g.addColorStop(0,rgba(mix(paper,[255,255,255],0.3),1));g.addColorStop(1,rgba(mix(paper,[0,0,0],0.25),1));ctx.fillStyle=g;ctx.shadowColor="rgba(0,0,0,0.35)";ctx.shadowBlur=6;ctx.fill();ctx.restore();}

/* ---------- the museum's exhibits: each drawn standing on the shelf, (x,y) at its foot, s its scale ---------- */
// a wedge pressed into clay: a dark triangular head with a tail, and a lit lower edge where the clay was pushed up
function ot_wedge(ctx,x,y,s,vert,col){ctx.save();ctx.translate(x,y);if(vert)ctx.rotate(Math.PI/2);ctx.scale(s,s);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(-7,-5.5);ctx.quadraticCurveTo(-3,0,-7,5.5);ctx.quadraticCurveTo(-2,1.5,1,0.4);ctx.lineTo(11,0.6);ctx.lineTo(11,-0.6);ctx.lineTo(1,-0.4);ctx.quadraticCurveTo(-2,-1.5,-7,-5.5);ctx.fill();
  ctx.strokeStyle="rgba(255,226,180,0.3)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-6,6.5);ctx.quadraticCurveTo(-1,2.6,11,1.8);ctx.stroke();ctx.restore();}
// a school tablet: the teacher's model on the left, the student's copy on the right, pressed in as p goes from 0 to 1
function ot_tablet(ctx,x,y,s,o){o=o||{};const p=o.p==null?1:o.p,t=o.t||0;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ot_organic(ctx,0,-126,152,108,{n:4.2,amp:4,seed:3,t});ot_matter(ctx,-150,-234,150,-18,[160,118,80],{t,seed:1});ot_organic(ctx,0,-126,152,108,{n:4.2,amp:4,seed:3,t});ot_rim(ctx,"rgba(70,40,18,0.55)","rgba(255,226,180,0.4)",4);
  ot_taper(ctx,ot_curve(-2,-224,4,-126,-1,-30,14),5,"rgba(70,44,24,0.55)",{tip:0.3});
  const ink="rgba(58,34,16,0.88)";let n=0;const total=20,shown=Math.floor(total*clamp(p,0,1));
  for(let r=0;r<4;r++)for(let k=0;k<5;k++){const vert=hash(r*5+k,4)>0.6,bx=-128+k*23,by=-196+r*44;ot_wedge(ctx,bx,by,1.05,vert,ink);if(hash(r*5+k,6)>0.55)ot_wedge(ctx,bx+8,by+14,0.8,!vert,ink);
    if(n<shown){const jx=(hash(n,8)-0.5)*7,jy=(hash(n,9)-0.5)*7;ot_wedge(ctx,bx+150+jx,by+jy,1.15,vert,"rgba(58,34,16,0.8)");if(hash(r*5+k,6)>0.55)ot_wedge(ctx,bx+158+jx,by+14+jy,0.9,!vert,"rgba(58,34,16,0.75)");}n++;}
  // a smoothed patch where the student rubbed out a mistake
  const pg=ctx.createRadialGradient(76,-104,2,76,-104,30);pg.addColorStop(0,"rgba(214,176,126,0.55)");pg.addColorStop(1,"rgba(214,176,126,0)");ctx.fillStyle=pg;ctx.beginPath();ctx.ellipse(76,-104,32,16,0.2,0,TAU);ctx.fill();
  // the reed stylus, pressing the next wedge
  if(p>0&&p<1){const k=shown%5,r=Math.floor(shown/5),sx=22+k*23+6,sy=-196+r*44,wob=Math.sin(t*9)*2;ot_taper(ctx,ot_curve(sx,sy,sx+44+wob,sy-80,sx+96+wob,sy-156,12),9,"rgba(206,180,128,0.97)",{tip:0.25,half:true,k:0.5});
    ot_taper(ctx,ot_curve(sx+3,sy-4,sx+46+wob,sy-82,sx+97+wob,sy-154,12),3,"rgba(255,240,200,0.5)",{tip:0.2});}
  ctx.restore();}
// a guild masterpiece: a hand-forged iron lock with a key, and the guild's mark struck once the masters accept it (mark 0..1)
function ot_lock(ctx,x,y,s,o){o=o||{};const t=o.t||0;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ot_organic(ctx,0,-138,121,99,{n:7,amp:1.6,seed:5,t});ot_matter(ctx,-120,-236,120,-40,[84,82,90],{t,seed:2,light:0.28});ot_organic(ctx,0,-138,121,99,{n:7,amp:1.6,seed:5,t});ot_rim(ctx,"rgba(10,10,14,0.7)","rgba(230,226,236,0.4)",3.5);
  ot_organic(ctx,0,-138,108,86,{n:7,amp:1.2,seed:6,t});ctx.strokeStyle="rgba(210,200,190,0.35)";ctx.lineWidth=2;ctx.stroke();
  [[-100,-216],[100,-216],[-100,-60],[100,-60]].forEach(([rx,ry])=>{const rg=ctx.createRadialGradient(rx-2,ry-2,1,rx,ry,7);rg.addColorStop(0,"#d6d2d8");rg.addColorStop(1,"#5a575e");ctx.fillStyle=rg;ctx.beginPath();ctx.arc(rx,ry,6.5,0,TAU);ctx.fill();});
  // scrollwork, filed by hand: strokes that swell and thin
  const scr="rgba(232,216,192,0.75)";[-1,1].forEach(sd=>{ot_taper(ctx,[...ot_curve(0,-200,sd*40,-216,sd*58,-186,8),...ot_curve(sd*58,-186,sd*50,-160,sd*36,-176,6).slice(1)],6,scr);
    ot_taper(ctx,ot_curve(sd*84,-120,sd*104,-156,sd*64,-142,10),5,scr);ot_taper(ctx,ot_curve(sd*84,-120,sd*104,-84,sd*64,-98,10),5,scr);});
  // the keyhole
  ctx.fillStyle="#0c0b10";ctx.beginPath();ctx.arc(0,-134,13,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-7,-130);ctx.quadraticCurveTo(-9,-110,-11,-92);ctx.lineTo(11,-92);ctx.quadraticCurveTo(9,-110,7,-130);ctx.closePath();ctx.fill();
  // the key, lying in front
  const kg=ctx.createLinearGradient(-50,-30,60,-6);kg.addColorStop(0,"#e0cf9c");kg.addColorStop(1,"#8a7446");ctx.strokeStyle=kg;ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.ellipse(-40,-18,15,13,0,0,TAU);ctx.stroke();
  ot_taper(ctx,ot_curve(-25,-18,15,-17,60,-18,8),8,"#b8a882",{tip:0.7});ctx.lineWidth=5;ctx.strokeStyle="#b8a882";ctx.beginPath();ctx.moveTo(46,-18);ctx.lineTo(46,-6);ctx.moveTo(56,-18);ctx.lineTo(56,-8);ctx.stroke();
  // the guild's mark, struck into the plate: a small shield with a key
  const m=o.mark==null?1:o.mark;if(m>0){const mx=78,my=-194;if(m<1)glow(ctx,mx,my,60,OT_WAX,0.8*Math.sin(Math.PI*m));
    ctx.save();ctx.globalAlpha*=clamp(m*1.5,0,1);ctx.strokeStyle=rgba(mix(OT_WAX,[255,230,200],0.3),1);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(mx-15,my-17);ctx.quadraticCurveTo(mx,my-20,mx+15,my-17);ctx.lineTo(mx+15,my-2);ctx.quadraticCurveTo(mx+13,my+14,mx,my+20);ctx.quadraticCurveTo(mx-13,my+14,mx-15,my-2);ctx.closePath();ctx.stroke();
    ctx.beginPath();ctx.arc(mx,my-7,4.5,0,TAU);ctx.moveTo(mx,my-2.5);ctx.lineTo(mx,my+11);ctx.moveTo(mx,my+6);ctx.lineTo(mx+5,my+6);ctx.moveTo(mx,my+10);ctx.lineTo(mx+4,my+10);ctx.stroke();ctx.restore();}
  ctx.restore();}
// wooden rollers for a scroll
function ot_roller(ctx,rx,y0,y1){const rg=ctx.createLinearGradient(rx-10,0,rx+10,0);rg.addColorStop(0,"#4a2e1a");rg.addColorStop(0.45,"#a8804e");rg.addColorStop(1,"#3c2414");ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(rx-9,y0);ctx.quadraticCurveTo(rx-11,(y0+y1)/2,rx-9,y1);ctx.lineTo(rx+9,y1);ctx.quadraticCurveTo(rx+11,(y0+y1)/2,rx+9,y0);ctx.closePath();ctx.fill();
  [y0-4,y1+4].forEach(ky=>{const kg=ctx.createRadialGradient(rx-3,ky-3,1,rx,ky,9);kg.addColorStop(0,"#f0d49a");kg.addColorStop(1,"#8a6a3a");ctx.fillStyle=kg;ctx.beginPath();ctx.ellipse(rx,ky,9,8,0,0,TAU);ctx.fill();});}
// an examination scroll: columns of writing, read right to left, in brush strokes, and a red seal; rank (0..1) lights the seal
function ot_scroll(ctx,x,y,s,o){o=o||{};const t=o.t||0;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ot_organic(ctx,0,-129,142,94,{n:12,amp:1.6,seed:7,t});ot_matter(ctx,-140,-222,140,-36,[234,220,184],{t,seed:3,light:0.18});
  ctx.save();ot_organic(ctx,0,-129,142,94,{n:12,amp:1.6,seed:7,t});ctx.clip();ctx.fillStyle="rgba(120,90,50,0.16)";ctx.fillRect(-150,-230,20,200);ctx.fillRect(130,-230,20,200);ctx.restore();
  ot_organic(ctx,0,-129,142,94,{n:12,amp:1.6,seed:7,t});ot_rim(ctx,"rgba(110,80,40,0.35)","rgba(255,250,235,0.5)",2.5);
  ot_roller(ctx,-150,-236,-22);ot_roller(ctx,150,-236,-22);
  // columns of text, as brush strokes of different lengths (not real characters)
  for(let c=0;c<10;c++){const cx=112-c*22;let yy=-206,k=0;while(yy<-60){const L=10+hash(c*13+k,2)*26,y1=Math.min(-56,yy+L);ot_taper(ctx,ot_curve(cx,yy,cx+(hash(c+k,5)-0.5)*4,(yy+y1)/2,cx,y1,6),6.5,"rgba(36,28,24,0.82)",{tip:0.25});yy+=L+7+hash(c+k,3)*8;k++;}}
  const r=o.rank==null?1:o.rank;if(r>0){if(r<1)glow(ctx,-104,-86,60,[230,60,50],0.7*Math.sin(Math.PI*r));ctx.save();ctx.globalAlpha*=clamp(r*1.5,0,1);ot_organic(ctx,-104,-88,22,22,{n:8,amp:1.2,seed:9,t:0});ctx.fillStyle="rgba(196,40,36,0.92)";ctx.fill();
    ctx.strokeStyle="rgba(250,220,200,0.85)";ctx.lineWidth=2.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-112,-96);ctx.lineTo(-96,-96);ctx.moveTo(-104,-96);ctx.lineTo(-104,-78);ctx.moveTo(-113,-80);ctx.lineTo(-95,-80);ctx.stroke();ctx.restore();}
  ctx.restore();}
// a licence to teach: parchment, lines of script, a cord and a wax seal (press 0..1), the cord swaying slightly
function ot_licence(ctx,x,y,s,o){o=o||{};const t=o.t||0,P=[226,207,166];ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ot_organic(ctx,0,-171,114,77,{n:9,amp:3.2,seed:11,t});ot_matter(ctx,-114,-248,114,-94,P,{t,seed:4});
  ctx.save();ot_organic(ctx,0,-171,114,77,{n:9,amp:3.2,seed:11,t});ctx.clip();[[-60,-210,40],[70,-150,34]].forEach(([sx,sy,sr])=>{const sg=ctx.createRadialGradient(sx,sy,2,sx,sy,sr);sg.addColorStop(0,"rgba(150,110,60,0.18)");sg.addColorStop(1,"rgba(150,110,60,0)");ctx.fillStyle=sg;ctx.fillRect(sx-sr,sy-sr,sr*2,sr*2);});
    ctx.fillStyle="rgba(150,110,60,0.2)";ctx.fillRect(-120,-122,240,30);ctx.restore();
  ot_organic(ctx,0,-171,114,77,{n:9,amp:3.2,seed:11,t});ot_rim(ctx,"rgba(120,86,44,0.45)","rgba(255,246,222,0.55)",2.6);
  ot_taper(ctx,ot_curve(-112,-121,0,-123,112,-120,10),2.2,"rgba(120,90,50,0.55)");
  ot_taper(ctx,[...ot_curve(-70,-222,-40,-236,-10,-222,6),...ot_curve(-10,-222,30,-212,72,-224,6).slice(1)],5.5,"rgba(60,40,26,0.88)",{tip:0.2});
  for(let i=0;i<7;i++){const yy=-196+i*13,x1=90-(i===6?70:hash(i,5)*20),pts=[];for(let xx=-92;xx<x1;xx+=6)pts.push([xx,yy+Math.sin(xx*0.9+i)*2]);ot_taper(ctx,pts,2.6,"rgba(60,40,26,0.8)",{tip:0.4,k:0.3});}
  ot_curl(ctx,112,-96,20,P,t);
  const sw=Math.sin(t*1.1)*3;ot_taper(ctx,ot_curve(-8,-100,-15+sw*0.5,-72,-5+sw,-54,10),4,"rgba(150,40,34,0.92)",{tip:0.6});ot_taper(ctx,ot_curve(8,-100,15+sw*0.5,-72,5+sw,-54,10),4,"rgba(150,40,34,0.92)",{tip:0.6});
  waxSeal(ctx,sw,-36,28,WAX,1,o.press==null?1:o.press);ctx.restore();}
// a diploma: a sheet folded in two, standing open, its panels gently bowed
function ot_diploma(ctx,x,y,s,o){o=o||{};const t=o.t||0,bw=Math.sin(t*0.7)*2;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const panel=(pts,base,seed)=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=0;i<4;i++){const a=pts[i],b=pts[(i+1)%4],mx=(a[0]+b[0])/2+(i%2?bw:0),my=(a[1]+b[1])/2+(i%2?0:2+bw*0.5);ctx.quadraticCurveTo(mx,my,b[0],b[1]);}ctx.closePath();ot_matter(ctx,-130,-218,120,-44,base,{t,seed,light:0.16});};
  panel([[-130,-214],[0,-200],[0,-44],[-130,-56]],[239,230,210],5);panel([[0,-200],[120,-218],[120,-54],[0,-44]],[222,210,184],6);
  ot_taper(ctx,ot_curve(0,-200,-1.5,-122,0,-44,10),2.4,"rgba(120,90,50,0.6)",{tip:0.5});
  ot_taper(ctx,ot_curve(-104,-178,-65,-177,-26,-172,8),4,"rgba(60,50,40,0.75)");for(let i=0;i<5;i++)ot_taper(ctx,ot_curve(-110,-150+i*16,-65,-147+i*16,-20,-143+i*16,8),2.2,"rgba(60,50,40,0.6)",{tip:0.4});
  ot_taper(ctx,ot_curve(20,-176,60,-183,100,-186,8),2.6,"rgba(60,50,40,0.6)");ot_taper(ctx,ot_curve(20,-156,55,-162,90,-164,8),2.2,"rgba(60,50,40,0.55)");
  // a signature in ink, and a gold foil seal with a ribbon
  ot_taper(ctx,[...ot_curve(24,-96,36,-122,44,-96,6),...ot_curve(44,-96,52,-78,58,-104,6).slice(1),...ot_curve(58,-104,66,-120,86,-104,6).slice(1)],3.2,"rgba(30,40,90,0.85)",{tip:0.2});
  ctx.fillStyle="rgba(170,40,40,0.9)";ctx.beginPath();ctx.moveTo(-72,-80);ctx.quadraticCurveTo(-78,-60,-80+bw,-40);ctx.lineTo(-70,-48);ctx.lineTo(-62+bw,-40);ctx.quadraticCurveTo(-64,-60,-66,-80);ctx.closePath();ctx.fill();
  const gg=ctx.createRadialGradient(-74,-90,2,-70,-86,20);gg.addColorStop(0,"#fff0b0");gg.addColorStop(1,"#c89a2a");ctx.fillStyle=gg;ctx.beginPath();for(let i=0;i<=24;i++){const an=i/24*TAU,r=i%2?16:19;ctx.lineTo(-70+Math.cos(an)*r,-86+Math.sin(an)*r);}ctx.fill();ctx.restore();}
// a transcript: every unit, and its grade
function ot_transcript(ctx,x,y,s,o){o=o||{};const t=o.t||0,P=[244,240,232];ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ot_organic(ctx,0,-140,101,101,{n:14,amp:1.2,seed:13,t});ot_matter(ctx,-100,-240,100,-40,P,{t,seed:6,light:0.14});ot_organic(ctx,0,-140,101,101,{n:14,amp:1.2,seed:13,t});ot_rim(ctx,"rgba(120,120,130,0.35)","rgba(255,255,255,0.5)",2);
  ctx.fillStyle="rgba(40,60,110,0.85)";ctx.fillRect(-92,-232,184,26);ctx.fillStyle="rgba(255,255,255,0.8)";ctx.fillRect(-80,-222,90,6);
  const gr=["A","B+","A","C","B","A-","B+","A"];for(let i=0;i<8;i++){const yy=-196+i*19;ctx.fillStyle="rgba(60,60,70,0.55)";ctx.fillRect(-86,yy,80+hash(i,4)*40,6);T(ctx,gr[i],72,yy+8,{f:"mono",w:500,size:13,align:"center",color:"rgba(40,40,50,0.9)"});
    ctx.strokeStyle="rgba(100,110,130,0.2)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-90,yy+12);ctx.lineTo(90,yy+12);ctx.stroke();}
  ot_curl(ctx,100,-40,18,P,t+1);ctx.restore();}
// a digital badge: a glowing medal of glass
function ot_badge(ctx,x,y,s,o){o=o||{};const col=o.col||OFFICE.careers.c;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle=rgba(mix(col,[0,0,0],0.3),0.9);ctx.beginPath();ctx.moveTo(-40,-80);ctx.lineTo(-56,-24);ctx.lineTo(-36,-36);ctx.lineTo(-24,-18);ctx.lineTo(-10,-80);ctx.fill();ctx.beginPath();ctx.moveTo(40,-80);ctx.lineTo(56,-24);ctx.lineTo(36,-36);ctx.lineTo(24,-18);ctx.lineTo(10,-80);ctx.fill();
  glow(ctx,0,-150,130,col,0.35);ctx.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU-Math.PI/2;ctx.lineTo(Math.cos(an)*82,-150+Math.sin(an)*82);}ctx.closePath();ctx.fillStyle="rgba(10,14,30,0.94)";ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=16;ctx.stroke();ctx.shadowBlur=0;
  ctx.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU-Math.PI/2;ctx.lineTo(Math.cos(an)*64,-150+Math.sin(an)*64);}ctx.closePath();ctx.strokeStyle=rgba(col,0.45);ctx.lineWidth=2;ctx.stroke();
  T(ctx,"★",0,-132,{w:800,size:52,align:"center",color:rgba(col,1)});ctx.restore();}
// a credential signed with a digital key: a glass card, and its signature
function ot_signed(ctx,x,y,s,o){o=o||{};const col=o.col||OT_GOLD;ctx.save();ctx.translate(x,y);ctx.scale(s,s);glow(ctx,0,-140,150,col,0.2);
  glass(ctx,-104,-244,208,200,20,col,{glow:18,ea:0.9,fill:"rgba(8,13,28,0.95)"});ctx.fillStyle=rgba(col,0.9);ctx.fillRect(-80,-216,110,8);ctx.fillStyle="rgba(200,215,240,0.5)";for(let i=0;i<4;i++)ctx.fillRect(-80,-190+i*18,120-i*18,5);
  ot_key(ctx,-42,-86,1.3,col,1);const sx=58,sy=-86;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.6;ctx.beginPath();for(let i=0;i<6;i++){const an=i/6*TAU+Math.PI/6;ctx.lineTo(sx+Math.cos(an)*24,sy+Math.sin(an)*24);}ctx.closePath();ctx.stroke();T(ctx,"✓",sx,sy+8,{w:800,size:24,align:"center",color:rgba(col,1)});ctx.restore();}
const OT_DRAW={tablet:ot_tablet,lock:ot_lock,scroll:ot_scroll,licence:ot_licence,diploma:ot_diploma,transcript:ot_transcript,badge:ot_badge,signed:ot_signed};
function ot_ex(ctx,k,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>OT_DRAW[k](ctx,x,y,s,o));}
// the exhibits, in the order the film shows them: [drawing, name, what it is, when and where, its material]
const OT_EX=[["tablet","School tablet","teacher's model · student's copy","c. 1800 BCE · Mesopotamia","clay"],
  ["lock","Guild masterpiece","judged by the masters of the guild","medieval Europe","iron"],
  ["scroll","Imperial examination","a rank that opened the way to office","605–1905 · China","paper and ink"],
  ["licence","Licence to teach","granted under a wax seal","medieval universities","parchment · wax"],
  ["diploma","Diploma","a sheet folded in two","","paper"],["transcript","Transcript","every unit, every grade","","paper"],
  ["badge","Digital badge","","","pixels"],["signed","Signed credential","checked with a digital key","today","a digital key"]];
const OT_MATCOL=[CLAY,[170,170,180],[236,220,180],[228,120,90],PARCH,[220,226,236],OFFICE.careers.c,TRUST];

/* ---------- the museum: a long shelf, lit from above ---------- */
function ot_shelf(ctx,x0,x1,y){const g=ctx.createLinearGradient(0,y,0,y+34);g.addColorStop(0,"#5a3f2a");g.addColorStop(1,"#2a1c12");ctx.fillStyle=g;ctx.fillRect(x0,y,x1-x0,34);
  ctx.fillStyle="rgba(255,220,170,0.35)";ctx.fillRect(x0,y,x1-x0,2);const sh=ctx.createLinearGradient(0,y+34,0,y+120);sh.addColorStop(0,"rgba(0,0,0,0.5)");sh.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sh;ctx.fillRect(x0,y+34,x1-x0,86);}
// a museum label on the shelf's edge
function ot_label(ctx,x,y,title,sub,a){if(a<=0.01)return;withA(ctx,a,()=>{const w=Math.max(260,tw(ctx,title,22,800)+40,sub?tw(ctx,sub,16,600)+40:0);ctx.fillStyle="rgba(30,20,14,0.92)";rr(ctx,x-w/2,y,w,sub?70:46,8);ctx.fill();ctx.strokeStyle=rgba(CLAY,0.6);ctx.lineWidth=1.4;rr(ctx,x-w/2,y,w,sub?70:46,8);ctx.stroke();
  T(ctx,title,x,y+30,{w:800,size:22,align:"center",color:rgba(PARCH,1)});if(sub)T(ctx,sub,x,y+56,{w:600,size:16,align:"center",color:rgba(CLAY,1)});});}

/* ---------- today: the systems, each with a model inside ---------- */
// a system's card: its name, what it holds, and its own little model (who holds what); o.open lifts it out of the vendor's box
function ot_sysCard(ctx,k,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return null;const S_=OT_SYS[k],c=S_.c,ma=o.modelA==null?1:o.modelA,hi=o.hi||0;
  const nm=o.names||S_.m;let B=null;
  withA(ctx,a,()=>{if(hi>0)glow(ctx,x+w/2,y+h/2,w*0.8,c,0.25*hi);glass(ctx,x,y,w,h,18,c,{glow:16+10*hi,ea:0.75,fill:"rgba(7,12,24,0.93)"});led(ctx,x+20,y+18,w-40,4,c);
    T(ctx,o.title||S_.n,x+w/2,y+62,{w:800,size:o.ts||(w<300?21:24),align:"center"});
    withA(ctx,o.holdsA==null?1:o.holdsA,()=>T(ctx,o.holdsText||"holds "+S_.holds,x+w/2,y+94,{w:600,size:19,align:"center",color:rgba(c,1)}));
    withA(ctx,ma,()=>{const s=o.ms||0.9,top={x:x+w/2,y:y+h*0.47,name:nm[0],col:c,s,hi:o.hiTop||0},bot={x:x+w/2,y:y+h*0.8,name:nm[1],col:c,s,hi:o.hiBot||0};
      ctx.strokeStyle=rgba(c,0.25);ctx.lineWidth=1;ctx.setLineDash([4,6]);rr(ctx,x+18,y+116,w-36,h-134,12);ctx.stroke();ctx.setLineDash([]);
      T(ctx,o.modelLabel==null?"its model":o.modelLabel,x+32,y+140,{f:"mono",w:500,size:14,color:rgba(SOFT,0.9)});
      const b1=entBox(ctx,top),b2=entBox(ctx,bot);relLine(ctx,b1,b2,"1","*",{col:c,s});ent(ctx,top);ent(ctx,bot);B={top:b1,bot:b2};});});
  return B;}
// the vendor's box: a closed carton that slides in, then opens (op 0..1)
function ot_crate(ctx,x,y,w,h,op,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const lid=ease(op);ctx.save();
  ctx.fillStyle="rgba(122,92,64,0.96)";rr(ctx,x,y+h*0.18,w,h*0.82,10);ctx.fill();ctx.strokeStyle="rgba(230,200,160,0.5)";ctx.lineWidth=2;rr(ctx,x,y+h*0.18,w,h*0.82,10);ctx.stroke();
  ctx.fillStyle="rgba(210,180,130,0.6)";ctx.fillRect(x+w/2-18,y+h*0.18,36,h*0.82);
  T(ctx,o.title||"off the shelf",x+w/2,y+h*0.62,{w:800,size:24,align:"center",color:"rgba(40,26,16,0.9)"});T(ctx,o.sub||"vendor",x+w/2,y+h*0.62+32,{f:"mono",w:500,size:18,align:"center",color:"rgba(40,26,16,0.8)"});
  // the lid, folding back as it opens
  ctx.translate(x,y+h*0.18);ctx.rotate(-1.9*lid);ctx.fillStyle="rgba(150,114,80,0.97)";rr(ctx,0,-h*0.18,w,h*0.18,8);ctx.fill();ctx.strokeStyle="rgba(230,200,160,0.5)";rr(ctx,0,-h*0.18,w,h*0.18,8);ctx.stroke();ctx.restore();});}
// a system as a node in a ring: a pill with its colour and name
function ot_node(ctx,k,x,y,a,hi,o){o=o||{};if(a<=0.01)return;const S_=OT_SYS[k]||o.sys,c=S_.c,n=o.name||S_.n,w=tw(ctx,n,22,800)+70;withA(ctx,a,()=>{if(hi)glow(ctx,x,y,w*0.7,c,0.3*hi);glass(ctx,x-w/2,y-32,w,64,32,c,{glow:14+10*(hi||0),ea:0.85,fill:"rgba(7,12,24,0.94)"});
  ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x-w/2+30,y,8,0,TAU);ctx.fill();T(ctx,n,x-w/2+48,y+8,{w:800,size:22});});return{x,y,w,h:64};}
// the shared model, as a hub: a gold disc with three small boxes inside
function ot_hub(ctx,x,y,r,t,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*2.4,OT_GOLD,0.28+0.08*Math.sin(t*2));ctx.save();ctx.fillStyle="rgba(10,14,28,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(OT_GOLD,1);ctx.lineWidth=3.5;ctx.shadowColor=rgba(OT_GOLD,0.9);ctx.shadowBlur=18;ctx.stroke();ctx.restore();
  T(ctx,o.title||"shared model",x,y-r*0.36,{w:800,size:o.size||24,align:"center",color:rgba(OT_GOLD,1)});
  const bx=[[x-r*0.5,y+r*0.2],[x+r*0.5,y+r*0.2],[x,y+r*0.58]];ctx.save();ctx.strokeStyle=rgba(OT_GOLD,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx[0][0],bx[0][1]);ctx.lineTo(bx[2][0],bx[2][1]);ctx.lineTo(bx[1][0],bx[1][1]);ctx.stroke();
  bx.forEach(([px,py])=>{ctx.fillStyle="rgba(10,14,28,1)";rr(ctx,px-24,py-12,48,24,5);ctx.fill();ctx.strokeStyle=rgba(OT_GOLD,1);ctx.lineWidth=2;rr(ctx,px-24,py-12,48,24,5);ctx.stroke();});ctx.restore();});}

/* ---------- the lost spacecraft, 1999 ---------- */
function ot_mars(ctx,x,y,r,t){glow(ctx,x,y,r*1.5,[255,140,100],0.25);ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();
  const g=ctx.createRadialGradient(x-r*0.35,y-r*0.35,r*0.1,x,y,r*1.05);g.addColorStop(0,"#e8966e");g.addColorStop(0.6,"#b0543a");g.addColorStop(1,"#4a1c14");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);
  // surface features, drifting slowly as the planet turns
  ctx.fillStyle="rgba(90,36,24,0.3)";[[0.2,-0.3,0.25],[-0.3,0.2,0.18],[0.35,0.35,0.12],[-0.1,-0.55,0.1],[0.7,0.1,0.16],[-0.75,-0.2,0.14]].forEach(([dx,dy,rr_],i)=>{let fx=((dx+t*0.012+1.2)%2.4)-1.2;const sq=Math.sqrt(Math.max(0,1-fx*fx));
    ctx.beginPath();ctx.moveTo(x+fx*r+rr_*r*1.3*sq,y+dy*r);ctx.bezierCurveTo(x+fx*r+rr_*r*sq,y+dy*r-rr_*r*0.9,x+fx*r-rr_*r*1.2*sq,y+dy*r-rr_*r*0.7,x+fx*r-rr_*r*1.4*sq,y+dy*r+rr_*r*0.1);ctx.bezierCurveTo(x+fx*r-rr_*r*sq,y+dy*r+rr_*r*0.9,x+fx*r+rr_*r*0.9*sq,y+dy*r+rr_*r*0.8,x+fx*r+rr_*r*1.3*sq,y+dy*r);ctx.fill();});
  const sh=ctx.createRadialGradient(x-r*0.55,y-r*0.5,r*0.6,x-r*0.2,y-r*0.2,r*1.55);sh.addColorStop(0,"rgba(0,0,0,0)");sh.addColorStop(1,"rgba(8,2,2,0.72)");ctx.fillStyle=sh;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();
  const ag=ctx.createRadialGradient(x,y,r*0.96,x,y,r*1.12);ag.addColorStop(0,"rgba(255,190,150,0.0)");ag.addColorStop(0.35,"rgba(255,190,150,"+(0.3+0.05*Math.sin(t*1.3))+")");ag.addColorStop(1,"rgba(255,190,150,0)");ctx.fillStyle=ag;ctx.beginPath();ctx.arc(x,y,r*1.12,0,TAU);ctx.fill();}
function ot_craft(ctx,x,y,s,rot,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);ctx.fillStyle="#c8ccd6";rr(ctx,-12,-10,24,20,3);ctx.fill();ctx.fillStyle="#4a6aa8";ctx.fillRect(-46,-6,30,12);ctx.fillRect(16,-6,30,12);
  ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineWidth=1;for(let i=-40;i<-16;i+=6){ctx.beginPath();ctx.moveTo(i,-6);ctx.lineTo(i,6);ctx.stroke();}for(let i=22;i<46;i+=6){ctx.beginPath();ctx.moveTo(i,-6);ctx.lineTo(i,6);ctx.stroke();}
  ctx.fillStyle="#e8e2c8";ctx.beginPath();ctx.arc(0,-14,7,Math.PI,TAU);ctx.fill();ctx.restore();});}
function ot_stars(ctx,t,n){for(let i=0;i<(n||90);i++){const x=hash(i,11)*W,y=hash(i,12)*H*0.9,tw_=0.4+0.6*Math.abs(Math.sin(t*0.8+i));ctx.fillStyle="rgba(230,236,255,"+(0.15+0.45*hash(i,13))*tw_+")";ctx.fillRect(x,y,1.8,1.8);}}

/* ---------- one learner, many records ---------- */
// a record in one system: its colour, the system, the kind of ID and the ID
function ot_idCard(ctx,x,y,w,k,kind,id,a,o){o=o||{};if(a<=0.01)return;const c=(OT_SYS[k]||{c:OT_IT}).c,n=(OT_SYS[k]||{n:"IT directory"}).n,h=o.h||92;withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,c,{glow:12+10*(o.hi||0),ea:0.75,fill:"rgba(7,12,24,0.94)"});led(ctx,x+14,y+16,5,h-32,c);
  T(ctx,(o.sysName||n)+" · "+kind,x+34,y+34,{w:700,size:18,color:rgba(c,1)});T(ctx,id,x+34,y+72,{f:"mono",w:500,size:27,color:rgba(INK,1)});});}
// a code list: one set of values every system uses
function ot_codeList(ctx,x,y,a,hi){if(a<=0.01)return;withA(ctx,a,()=>{const w=640,h=104;if(hi)glow(ctx,x+w/2,y+h/2,380,OT_STD,0.2*hi);glass(ctx,x,y,w,h,16,OT_STD,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.95)"});
  T(ctx,"credential kind",x+24,y+36,{f:"mono",w:500,size:20,color:rgba(OT_STD,1)});T(ctx,"one shared list",x+w-24,y+36,{w:600,size:17,align:"right",color:rgba(SOFT,1)});
  ["award","microcredential","badge"].forEach((s,i)=>ot_pill(ctx,x+104+i*196,y+74,s,OT_STD,{size:21}));});}

/* ---------- the logical model, and the yardstick ---------- */
const OT_LM={learner:[360,330],issuer:[360,600],cred:[930,450],evidence:[1560,270],micro:[1180,770],award:[1700,770]};
const OT_CRED_ATTRS=[["credential id","id"],["issuer id",""],["learner id",""],["claim",""],["awarded on: date",""],["level: 1–10",""],["volume of learning: hours",""],["status: valid | expired | revoked",""]];
// the ruler: our logical model's parts, marked along a gold bar
function ot_ruler(ctx,x0,x1,y,marks,a,p,sz){if(a<=0.01)return;withA(ctx,a,()=>{const w=x1-x0,q=p==null?1:p;ctx.save();ctx.shadowColor=rgba(OT_GOLD,0.8);ctx.shadowBlur=18;const g=ctx.createLinearGradient(0,y-30,0,y+30);g.addColorStop(0,"#f6d98a");g.addColorStop(1,"#b8862e");ctx.fillStyle=g;rr(ctx,x0,y-30,w*q,60,8);ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(60,40,10,0.8)";ctx.lineWidth=2;for(let i=0;i<=80;i++){const xx=x0+i*w/80;if(xx>x0+w*q)break;ctx.beginPath();ctx.moveTo(xx,y-30);ctx.lineTo(xx,y-30+(i%10===0?26:i%5===0?18:10));ctx.stroke();}
  marks.forEach((m,i)=>{const xx=x0+(i+0.5)*w/marks.length;if(xx>x0+w*q)return;T(ctx,m,xx,y+(sz||19)*0.4+12,{w:800,size:sz||19,align:"center",color:"rgba(50,32,8,0.95)"});});});}

/* ---------- pictures for the labs and the scenarios (site/assets/older-than-the-systems/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW); every word it draws comes from FW.vis. */
const ot_hex=h_=>h_.match(/\w\w/g).map(q=>parseInt(q,16));
const OT_PARTPOS={issuer:[190,92],verifier:[770,92],claim:[480,206],holder:[190,320],evidence:[770,320]};
const OT_SRCCOL={sis:APP.sis.c,it:OT_IT,short:OFFICE.short.c,careers:OFFICE.careers.c};
const LV={
  // Same idea, new materials: the model's five parts, with what you placed in each
  parts:(c,w,h,st,L)=>{const lab=L.labs.find(x=>x.id==="parts"),V=L.vis.parts,it=lab.w.items,B={};
    Object.keys(OT_PARTPOS).forEach(k=>{const[x,y]=OT_PARTPOS[k];B[k]={x,y,w:230,h:66};});
    [["issuer","claim"],["holder","claim"],["claim","evidence"],["verifier","claim"]].forEach(([a,b])=>{const s_=ot_edge(B[a],B[b].x,B[b].y),e_=ot_edge(B[b],B[a].x,B[a].y);arrowTo(c,s_[0],s_[1],e_[0],e_[1],OT_GOLD,0.5,{lw:2,head:12});});
    Object.keys(OT_PARTPOS).forEach(k=>{const b=B[k],n=it.filter((q,i)=>st.pick[i]===k),ok=st.checked&&it.every((q,i)=>(st.pick[i]===k)===(q.b===k));const col=k==="claim"?OT_GOLD:OT_WAX;
      glass(c,b.x-b.w/2,b.y-b.h/2,b.w,b.h,14,col,{glow:12,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,V.names[k],b.x-b.w/2+20,b.y+9,{w:800,size:26,color:rgba(col,1)});
      n.forEach((q,j)=>{c.fillStyle=rgba(col,0.95);c.beginPath();c.arc(b.x+b.w/2-24-j*20,b.y,7,0,TAU);c.fill();});
      if(st.checked)ot_mark(c,b.x+b.w/2+4,b.y-b.h/2+2,ok,1,16);});},
  // Who is the source? One learner's facts, each drawn from the system you chose
  source:(c,w,h,st,L)=>{const lab=L.labs.find(x=>x.id==="source"),V=L.vis.source,it=lab.w.items,bk=lab.w.buckets,x0=24,y0=20,cw=500;
    glass(c,x0,y0,cw,h-40,16,OT_GOLD,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(c,V.title,x0+22,y0+40,{w:800,size:24,color:rgba(OT_GOLD,1)});
    const sy=k=>70+bk.findIndex(b=>b[0]===k)*((h-110)/(bk.length-1));
    bk.forEach(([k,n])=>{const col=OT_SRCCOL[k]||SOFT,y=sy(k),ww=tw(c,V.src[k],22,800)+48;glass(c,w-24-ww,y-24,ww,48,24,col,{glow:10,ea:0.85,fill:"rgba(7,12,24,0.95)"});c.fillStyle=rgba(col,1);c.beginPath();c.arc(w-24-ww+22,y,7,0,TAU);c.fill();T(c,V.src[k],w-24-ww+36,y+8,{w:800,size:22});});
    V.rows.forEach((r,i)=>{const y=y0+84+i*((h-120)/V.rows.length),k=st.pick[i];T(c,r,x0+22,y+8,{w:700,size:22,color:rgba(INK,0.95)});
      if(k){const col=OT_SRCCOL[k]||SOFT,ww=tw(c,V.src[k],22,800)+48;arrowTo(c,w-24-ww-6,sy(k),x0+cw+8,y,col,0.8,{lw:2.2,head:11,bend:0.04});}
      if(st.checked)ot_mark(c,x0+cw-28,y,k===it[i].b,1,14);});},
  // Fit and gap: our logical model, the yardstick, held against the platform you picked
  fit:(c,w,h,st,L)=>{const lab=L.labs.find(x=>x.id==="fit"),V=L.vis.fit,r=lab.w.res[st.pick],x0=30,x1=w-30,cw=(x1-x0)/V.marks.length;
    T(c,V.ours,x0,40,{w:800,size:24,color:rgba(OT_GOLD,1)});ot_ruler(c,x0,x1,100,V.marks,1,1,22);
    r.forEach((v,i)=>{const x=x0+(i+0.5)*cw;if(v===0.5){c.fillStyle="rgba(7,12,24,0.95)";c.beginPath();c.arc(x,172,18,0,TAU);c.fill();ring(c,x,172,18,[255,196,92],1,2);T(c,"~",x,181,{w:800,size:26,align:"center",color:rgba([255,196,92],1)});}else ot_mark(c,x,172,!!v,1,18);});
    T(c,V.names[st.pick],x0,236,{w:800,size:24,color:rgba(OFFICE.short.c,1)});glass(c,x0,252,x1-x0,86,14,OFFICE.short.c,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});
    V.vend[st.pick].forEach((v,i)=>T(c,v,x0+(i+0.5)*cw,303,{w:700,size:22,align:"center",color:v==="—"?rgba(SOFT,0.7):rgba(INK,1)}));},
  // scenarios, on 600 × 320
  vendor:(c,w,h,st,L)=>{const V=L.vis.vendor;ot_crate(c,40,110,220,180,0,OFFICE.short.c,1,{title:V.crate,sub:V.vendor});bubble(c,270,30,300,V.says,OFFICE.short.c,{size:22});ot_ruler(c,300,570,250,V.marks,1,1,18);T(c,V.ours,300,300,{w:700,size:18,color:rgba(OT_GOLD,1)});},
  ten:(c,w,h,st,L)=>{const V=L.vis.ten,cx=170,cy=160,R=110,P=i=>[cx+R*Math.cos(-Math.PI/2+i*TAU/6),cy+R*Math.sin(-Math.PI/2+i*TAU/6)],cols=[APP.sis.c,APP.lms.c,OFFICE.careers.c,[90,220,205],OFFICE.short.c,[255,236,160]];
    for(let i=0;i<6;i++)for(let j=i+1;j<6;j++){const a=P(i),b=P(j);c.strokeStyle=rgba(i===5||j===5?BAD:SOFT,i===5||j===5?0.8:0.4);c.lineWidth=2;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
    for(let i=0;i<6;i++){const p=P(i);c.fillStyle="rgba(7,12,24,1)";c.beginPath();c.arc(p[0],p[1],16,0,TAU);c.fill();ring(c,p[0],p[1],16,cols[i],1,3);}
    T(c,"15",430,140,{w:800,size:72,align:"center",color:rgba(BAD,1)});T(c,V.pairs,430,176,{w:700,size:20,align:"center",color:rgba(SOFT,1)});T(c,"6",430,258,{w:800,size:52,align:"center",color:rgba(OT_GOLD,1)});T(c,V.hub,430,290,{w:700,size:20,align:"center",color:rgba(SOFT,1)});},
  email:(c,w,h,st,L)=>{const V=L.vis.email;ot_idCard(c,30,50,540,"lms",V.email,"aisha.k@mail.example",1,{h:96,sysName:V.lms});ot_idCard(c,30,190,540,"it",V.email,"aisha.khan@uni.example",1,{h:96,sysName:V.it});T(c,"≠",550,172,{w:800,size:44,align:"center",color:rgba(BAD,1)});},
  customer:(c,w,h,st,L)=>{const V=L.vis.customer;const B1=ot_sysCard(c,"short",10,20,290,290,{ms:0.85,ts:19,title:V.platform,holdsText:V.holds,modelLabel:"",names:V.names});const Lx={x:480,y:130,name:V.learner,col:OT_GOLD,s:0.95};const bL=entBox(c,Lx);ent(c,Lx);
    if(B1)arrowTo(c,B1.top.x+B1.top.w/2+8,B1.top.y,bL.x-bL.w/2-10,bL.y,OT_GOLD,0.9,{bend:0.08,lw:3,head:14,dash:[9,7]});T(c,V.maps,400,96,{w:700,size:20,align:"center",color:rgba(OT_GOLD,1)});T(c,V.shared,470,214,{w:700,size:19,align:"center",color:rgba(SOFT,1)});},
  revoked:(c,w,h,st,L)=>{const V=L.vis.revoked;glass(c,30,40,300,150,16,OT_GOLD,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,V.count,54,84,{w:700,size:20,color:rgba(SOFT,1)});T(c,V.n,54,160,{w:800,size:56,color:rgba(OT_GOLD,1)});
    glass(c,370,40,200,150,16,OFFICE.short.c,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,V.cert,470,82,{w:800,size:22,align:"center",color:rgba(OFFICE.short.c,1)});glass(c,395,108,150,44,10,BAD,{glow:10,ea:0.95,fill:"rgba(40,8,8,0.9)"});T(c,V.rev,470,137,{w:800,size:20,align:"center",color:rgba(BAD,1)});
    glass(c,70,230,460,60,14,BAD,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,V.rule,300,268,{w:800,size:22,align:"center"});},
  migrate:(c,w,h,st,L)=>{const V=L.vis.migrate;glass(c,10,60,200,170,16,SOFT,{glow:8,ea:0.6,fill:"rgba(7,12,24,0.95)"});T(c,V.old,110,152,{w:800,size:20,align:"center",color:rgba(SOFT,1)});
    glass(c,390,60,200,170,16,APP.sis.c,{glow:14,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,V.nw,490,152,{w:800,size:20,align:"center",color:rgba(APP.sis.c,1)});
    ot_ruler(c,220,380,145,[V.model],1,1,18);arrowTo(c,190,252,410,252,OT_GOLD,0.8,{lw:3,head:14,bend:0.12});T(c,V.through,300,300,{w:700,size:18,align:"center",color:rgba(OT_GOLD,1)});},
  notice:(c,w,h,st,L)=>{const V=L.vis.notice;glass(c,20,50,270,160,14,SOFT,{glow:8,ea:0.6,fill:"rgba(7,12,24,0.95)"});c.strokeStyle=rgba(SOFT,0.8);c.lineWidth=2;c.beginPath();c.moveTo(20,56);c.lineTo(155,140);c.lineTo(290,56);c.stroke();T(c,V.email,155,196,{w:700,size:18,align:"center",color:rgba(SOFT,1)});
    glass(c,310,50,270,160,14,OFFICE.short.c,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(c,V.word,328,96,{w:800,size:24,color:rgba(OFFICE.short.c,1)});T(c,V.owner,328,130,{w:600,size:18,color:rgba(SOFT,1)});stamp(c,566,180,"v1.1 · 28 Sep",TRUST,1);
    T(c,V.q,300,270,{w:700,size:20,align:"center",color:rgba(INK,1)});},
  connect:(c,w,h,st,L)=>{const V=L.vis.connect;ot_hub(c,300,160,92,1.2,1,{title:V.model,size:18});const ks=["sis","lms","careers","wallet","short"];ks.forEach((k,i)=>{const an=-Math.PI/2+i*TAU/6,x=300+200*Math.cos(an)*1.3,y=160+120*Math.sin(an);c.strokeStyle=rgba(OT_GOLD,0.8);c.lineWidth=2.5;c.beginPath();c.moveTo(300+80*Math.cos(an),160+80*Math.sin(an));c.lineTo(x,y);c.stroke();c.fillStyle="rgba(7,12,24,1)";c.beginPath();c.arc(x,y,15,0,TAU);c.fill();ring(c,x,y,15,OT_SYS[k].c,1,3);});
    const an=-Math.PI/2+5*TAU/6,x=300+200*Math.cos(an)*1.3,y=160+120*Math.sin(an);c.save();c.setLineDash([7,6]);c.strokeStyle=rgba(OT_GOLD,0.8);c.lineWidth=2.5;c.beginPath();c.moveTo(300+80*Math.cos(an),160+80*Math.sin(an));c.lineTo(x,y);c.stroke();c.restore();ring(c,x,y,15,[255,236,160],1,3,[5,4]);T(c,V.nw,x,y-26,{w:800,size:18,align:"center",color:rgba([255,236,160],1)});}
};
