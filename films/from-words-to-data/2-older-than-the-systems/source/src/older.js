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

/* ---------- the museum's exhibits: each drawn standing on the shelf, (x,y) at its foot, s its scale ---------- */
function ot_wedge(ctx,x,y,s,vert,col){ctx.fillStyle=col;ctx.beginPath();if(vert){ctx.moveTo(x-5*s,y-7*s);ctx.lineTo(x+5*s,y-7*s);ctx.lineTo(x,y+1*s);ctx.closePath();ctx.fill();ctx.fillRect(x-1*s,y,2*s,9*s);}
  else{ctx.moveTo(x-7*s,y-5*s);ctx.lineTo(x-7*s,y+5*s);ctx.lineTo(x+1*s,y);ctx.closePath();ctx.fill();ctx.fillRect(x,y-1*s,10*s,2*s);}}
// a school tablet: the teacher's model on the left, the student's copy on the right, pressed in as p goes from 0 to 1
function ot_tablet(ctx,x,y,s,o){o=o||{};const p=o.p==null?1:o.p;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=26;ctx.shadowOffsetY=8;ctx.fillStyle="#a07650";rr(ctx,-150,-232,300,212,30);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const g=ctx.createLinearGradient(-150,-232,150,-20);g.addColorStop(0,"rgba(255,230,190,0.28)");g.addColorStop(1,"rgba(40,20,10,0.38)");ctx.fillStyle=g;rr(ctx,-150,-232,300,212,30);ctx.fill();
  ctx.strokeStyle="rgba(70,44,24,0.55)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-222);ctx.lineTo(0,-30);ctx.stroke();
  const ink="rgba(58,34,16,0.9)";let n=0;const total=20,shown=Math.floor(total*clamp(p,0,1));
  for(let r=0;r<4;r++)for(let k=0;k<5;k++){const vert=hash(r*5+k,4)>0.6,bx=-128+k*23,by=-196+r*44;ot_wedge(ctx,bx,by,1.1,vert,ink);if(hash(r*5+k,6)>0.55)ot_wedge(ctx,bx+8,by+14,0.8,!vert,ink);
    if(n<shown){const jx=(hash(n,8)-0.5)*7,jy=(hash(n,9)-0.5)*7;ot_wedge(ctx,bx+150+jx,by+jy,1.2,vert,"rgba(58,34,16,0.8)");if(hash(r*5+k,6)>0.55)ot_wedge(ctx,bx+158+jx,by+14+jy,0.9,!vert,"rgba(58,34,16,0.75)");}n++;}
  // a smoothed patch where the student rubbed out a mistake
  ctx.fillStyle="rgba(200,160,110,0.35)";ctx.beginPath();ctx.ellipse(76,-104,26,12,0.2,0,TAU);ctx.fill();
  if(p>0&&p<1){const k=shown%5,r=Math.floor(shown/5),sx=22+k*23+8,sy=-196+r*44;ctx.strokeStyle="rgba(214,188,140,0.95)";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+90,sy-150);ctx.stroke();}
  ctx.restore();}
// a guild masterpiece: an iron lock with a key, and the guild's mark stamped once the masters accept it (mark 0..1)
function ot_lock(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=24;ctx.shadowOffsetY=8;const g=ctx.createLinearGradient(-120,-240,120,-40);g.addColorStop(0,"#7c7a80");g.addColorStop(0.5,"#4c4b52");g.addColorStop(1,"#2c2b31");ctx.fillStyle=g;rr(ctx,-120,-236,240,196,14);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.strokeStyle="rgba(210,200,190,0.45)";ctx.lineWidth=2;rr(ctx,-108,-224,216,172,10);ctx.stroke();
  [[-100,-216],[100,-216],[-100,-60],[100,-60]].forEach(([rx,ry])=>{ctx.fillStyle="#9a969c";ctx.beginPath();ctx.arc(rx,ry,6,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.4)";ctx.beginPath();ctx.arc(rx-2,ry-2,2,0,TAU);ctx.fill();});
  // scrollwork, filed by hand
  ctx.strokeStyle="rgba(230,214,190,0.7)";ctx.lineWidth=3;ctx.lineCap="round";[-1,1].forEach(sd=>{ctx.beginPath();ctx.moveTo(0,-200);ctx.bezierCurveTo(sd*40,-214,sd*70,-190,sd*56,-170);ctx.bezierCurveTo(sd*46,-156,sd*30,-168,sd*38,-178);ctx.stroke();
    ctx.beginPath();ctx.moveTo(sd*84,-120);ctx.bezierCurveTo(sd*96,-150,sd*66,-160,sd*64,-140);ctx.stroke();ctx.beginPath();ctx.moveTo(sd*84,-120);ctx.bezierCurveTo(sd*96,-90,sd*66,-80,sd*64,-100);ctx.stroke();});
  // the keyhole
  ctx.fillStyle="#0c0b10";ctx.beginPath();ctx.arc(0,-134,13,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-7,-130);ctx.lineTo(7,-130);ctx.lineTo(11,-92);ctx.lineTo(-11,-92);ctx.closePath();ctx.fill();
  // the key, lying in front
  ctx.strokeStyle="#b8a882";ctx.lineWidth=6;ctx.beginPath();ctx.arc(-40,-18,14,0,TAU);ctx.moveTo(-26,-18);ctx.lineTo(60,-18);ctx.moveTo(46,-18);ctx.lineTo(46,-6);ctx.moveTo(56,-18);ctx.lineTo(56,-8);ctx.stroke();
  // the guild's mark, struck into the plate: a small shield with a key
  const m=o.mark==null?1:o.mark;if(m>0){const mx=78,my=-194;if(m<1)glow(ctx,mx,my,60,OT_WAX,0.8*Math.sin(Math.PI*m));
    ctx.save();ctx.globalAlpha*=clamp(m*1.5,0,1);ctx.strokeStyle=rgba(mix(OT_WAX,[255,230,200],0.3),1);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(mx-15,my-17);ctx.lineTo(mx+15,my-17);ctx.lineTo(mx+15,my-2);ctx.quadraticCurveTo(mx+13,my+14,mx,my+20);ctx.quadraticCurveTo(mx-13,my+14,mx-15,my-2);ctx.closePath();ctx.stroke();
    ctx.beginPath();ctx.arc(mx,my-7,4.5,0,TAU);ctx.moveTo(mx,my-2.5);ctx.lineTo(mx,my+11);ctx.moveTo(mx,my+6);ctx.lineTo(mx+5,my+6);ctx.moveTo(mx,my+10);ctx.lineTo(mx+4,my+10);ctx.stroke();ctx.restore();}
  ctx.restore();}
// an examination scroll: columns of writing, read right to left, and a red seal; rank (0..1) lights the seal
function ot_scroll(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=22;ctx.shadowOffsetY=8;ctx.fillStyle="#eadcb8";ctx.fillRect(-140,-222,280,186);ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const g=ctx.createLinearGradient(-140,0,140,0);g.addColorStop(0,"rgba(120,90,50,0.18)");g.addColorStop(0.5,"rgba(255,255,255,0.05)");g.addColorStop(1,"rgba(120,90,50,0.18)");ctx.fillStyle=g;ctx.fillRect(-140,-222,280,186);
  [-150,150].forEach(rx=>{const rg=ctx.createLinearGradient(rx-10,0,rx+10,0);rg.addColorStop(0,"#5a3a22");rg.addColorStop(0.5,"#a2764a");rg.addColorStop(1,"#4a2e1a");ctx.fillStyle=rg;rr(ctx,rx-10,-236,20,214,8);ctx.fill();ctx.fillStyle="#caa56a";ctx.beginPath();ctx.arc(rx,-240,8,0,TAU);ctx.arc(rx,-18,8,0,TAU);ctx.fill();});
  // columns of text, as lines of ink of different lengths (not real characters)
  ctx.strokeStyle="rgba(40,32,28,0.8)";ctx.lineCap="round";for(let c=0;c<10;c++){const cx=112-c*22;let yy=-206;ctx.lineWidth=5;while(yy<-60){const L=10+hash(c*13+yy,2)*28;ctx.beginPath();ctx.moveTo(cx,yy);ctx.lineTo(cx,Math.min(-58,yy+L));ctx.stroke();yy+=L+7+hash(c+yy,3)*8;}}
  const r=o.rank==null?1:o.rank;if(r>0){if(r<1)glow(ctx,-104,-86,60,[230,60,50],0.7*Math.sin(Math.PI*r));ctx.save();ctx.globalAlpha*=clamp(r*1.5,0,1);ctx.fillStyle="rgba(196,40,36,0.92)";rr(ctx,-126,-110,44,44,4);ctx.fill();ctx.strokeStyle="rgba(250,220,200,0.85)";ctx.lineWidth=2.5;rr(ctx,-120,-104,32,32,2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-112,-96);ctx.lineTo(-96,-96);ctx.moveTo(-104,-96);ctx.lineTo(-104,-78);ctx.moveTo(-113,-80);ctx.lineTo(-95,-80);ctx.stroke();ctx.restore();}
  ctx.restore();}
// a licence to teach: parchment, lines of script, a cord and a wax seal (press 0..1)
function ot_licence(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=22;ctx.shadowOffsetY=8;ctx.fillStyle="#e2cfa6";ctx.beginPath();ctx.moveTo(-112,-246);for(let i=0;i<=10;i++)ctx.lineTo(-112+i*22.4,-246+(hash(i,3)-0.5)*5);ctx.lineTo(112,-96);ctx.lineTo(-112,-96);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.fillStyle="rgba(150,110,60,0.22)";ctx.fillRect(-112,-120,224,24);ctx.strokeStyle="rgba(120,90,50,0.5)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-112,-120);ctx.lineTo(112,-120);ctx.stroke();
  ctx.strokeStyle="rgba(60,40,26,0.85)";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-70,-222);ctx.bezierCurveTo(-40,-232,-10,-212,20,-224);ctx.bezierCurveTo(40,-230,60,-218,72,-222);ctx.stroke();
  ctx.lineWidth=2;for(let i=0;i<7;i++){const yy=-196+i*13,x1=90-(i===6?70:hash(i,5)*20);ctx.beginPath();ctx.moveTo(-92,yy);for(let xx=-92;xx<x1;xx+=6)ctx.lineTo(xx,yy+Math.sin(xx*0.9+i)*2.2);ctx.stroke();}
  ctx.strokeStyle="rgba(150,40,34,0.9)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-8,-100);ctx.quadraticCurveTo(-14,-70,-4,-52);ctx.moveTo(8,-100);ctx.quadraticCurveTo(14,-70,4,-52);ctx.stroke();
  waxSeal(ctx,0,-36,28,WAX,1,o.press==null?1:o.press);ctx.restore();}
// a diploma: a sheet folded in two, standing open
function ot_diploma(ctx,x,y,s,o){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=22;ctx.shadowOffsetY=8;
  ctx.fillStyle="#efe6d2";ctx.beginPath();ctx.moveTo(-130,-214);ctx.lineTo(0,-200);ctx.lineTo(0,-44);ctx.lineTo(-130,-56);ctx.closePath();ctx.fill();ctx.fillStyle="#dcd0b6";ctx.beginPath();ctx.moveTo(0,-200);ctx.lineTo(120,-218);ctx.lineTo(120,-54);ctx.lineTo(0,-44);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.strokeStyle="rgba(120,90,50,0.55)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-200);ctx.lineTo(0,-44);ctx.stroke();
  ctx.strokeStyle="rgba(60,50,40,0.7)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-104,-178);ctx.lineTo(-26,-172);ctx.stroke();ctx.lineWidth=1.6;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(-110,-150+i*16);ctx.lineTo(-20,-143+i*16);ctx.stroke();}
  ctx.beginPath();ctx.moveTo(20,-176);ctx.lineTo(100,-186);ctx.stroke();ctx.beginPath();ctx.moveTo(20,-156);ctx.lineTo(90,-164);ctx.stroke();
  // a signature, and a gold foil seal with a ribbon
  ctx.strokeStyle="rgba(30,40,90,0.85)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(24,-96);ctx.bezierCurveTo(36,-120,44,-80,54,-104);ctx.bezierCurveTo(60,-116,66,-90,86,-104);ctx.stroke();
  ctx.fillStyle="rgba(170,40,40,0.9)";ctx.beginPath();ctx.moveTo(-70,-80);ctx.lineTo(-80,-40);ctx.lineTo(-70,-48);ctx.lineTo(-62,-40);ctx.closePath();ctx.fill();
  const gg=ctx.createRadialGradient(-74,-90,2,-70,-86,20);gg.addColorStop(0,"#fff0b0");gg.addColorStop(1,"#c89a2a");ctx.fillStyle=gg;ctx.beginPath();for(let i=0;i<=24;i++){const an=i/24*TAU,r=i%2?16:19;ctx.lineTo(-70+Math.cos(an)*r,-86+Math.sin(an)*r);}ctx.fill();ctx.restore();}
// a transcript: every unit, and its grade
function ot_transcript(ctx,x,y,s,o){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=22;ctx.shadowOffsetY=8;ctx.fillStyle="#f4f1ea";ctx.fillRect(-100,-240,200,200);ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  ctx.fillStyle="rgba(40,60,110,0.85)";ctx.fillRect(-100,-240,200,28);ctx.fillStyle="rgba(255,255,255,0.8)";ctx.fillRect(-84,-230,90,6);
  const gr=["A","B+","A","C","B","A−","B+","A"];for(let i=0;i<8;i++){const yy=-196+i*19;ctx.fillStyle="rgba(60,60,70,0.55)";ctx.fillRect(-86,yy,80+hash(i,4)*40,6);T(ctx,gr[i],72,yy+8,{f:"mono",w:500,size:13,align:"center",color:"rgba(40,40,50,0.9)"});
    ctx.strokeStyle="rgba(100,110,130,0.2)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-90,yy+12);ctx.lineTo(90,yy+12);ctx.stroke();}ctx.restore();}
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
    T(ctx,S_.n,x+w/2,y+62,{w:800,size:w<300?21:24,align:"center"});
    withA(ctx,o.holdsA==null?1:o.holdsA,()=>T(ctx,"holds "+S_.holds,x+w/2,y+94,{w:600,size:19,align:"center",color:rgba(c,1)}));
    withA(ctx,ma,()=>{const s=o.ms||0.9,top={x:x+w/2,y:y+h*0.47,name:nm[0],col:c,s,hi:o.hiTop||0},bot={x:x+w/2,y:y+h*0.8,name:nm[1],col:c,s,hi:o.hiBot||0};
      ctx.strokeStyle=rgba(c,0.25);ctx.lineWidth=1;ctx.setLineDash([4,6]);rr(ctx,x+18,y+116,w-36,h-134,12);ctx.stroke();ctx.setLineDash([]);
      T(ctx,"its model",x+32,y+140,{f:"mono",w:500,size:14,color:rgba(SOFT,0.9)});
      const b1=entBox(ctx,top),b2=entBox(ctx,bot);relLine(ctx,b1,b2,"1","*",{col:c,s});ent(ctx,top);ent(ctx,bot);B={top:b1,bot:b2};});});
  return B;}
// the vendor's box: a closed carton that slides in, then opens (op 0..1)
function ot_crate(ctx,x,y,w,h,op,col,a){if(a<=0.01)return;withA(ctx,a,()=>{const lid=ease(op);ctx.save();
  ctx.fillStyle="rgba(122,92,64,0.96)";rr(ctx,x,y+h*0.18,w,h*0.82,10);ctx.fill();ctx.strokeStyle="rgba(230,200,160,0.5)";ctx.lineWidth=2;rr(ctx,x,y+h*0.18,w,h*0.82,10);ctx.stroke();
  ctx.fillStyle="rgba(210,180,130,0.6)";ctx.fillRect(x+w/2-18,y+h*0.18,36,h*0.82);
  T(ctx,"off the shelf",x+w/2,y+h*0.62,{w:800,size:24,align:"center",color:"rgba(40,26,16,0.9)"});T(ctx,"vendor",x+w/2,y+h*0.62+32,{f:"mono",w:500,size:18,align:"center",color:"rgba(40,26,16,0.8)"});
  // the lid, folding back as it opens
  ctx.translate(x,y+h*0.18);ctx.rotate(-1.9*lid);ctx.fillStyle="rgba(150,114,80,0.97)";rr(ctx,0,-h*0.18,w,h*0.18,8);ctx.fill();ctx.strokeStyle="rgba(230,200,160,0.5)";rr(ctx,0,-h*0.18,w,h*0.18,8);ctx.stroke();ctx.restore();});}
// a system as a node in a ring: a pill with its colour and name
function ot_node(ctx,k,x,y,a,hi,o){o=o||{};if(a<=0.01)return;const S_=OT_SYS[k]||o.sys,c=S_.c,n=o.name||S_.n,w=tw(ctx,n,22,800)+70;withA(ctx,a,()=>{if(hi)glow(ctx,x,y,w*0.7,c,0.3*hi);glass(ctx,x-w/2,y-32,w,64,32,c,{glow:14+10*(hi||0),ea:0.85,fill:"rgba(7,12,24,0.94)"});
  ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x-w/2+30,y,8,0,TAU);ctx.fill();T(ctx,n,x-w/2+48,y+8,{w:800,size:22});});return{x,y,w,h:64};}
// the shared model, as a hub: a gold disc with three small boxes inside
function ot_hub(ctx,x,y,r,t,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*2.4,OT_GOLD,0.28+0.08*Math.sin(t*2));ctx.save();ctx.fillStyle="rgba(10,14,28,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(OT_GOLD,1);ctx.lineWidth=3.5;ctx.shadowColor=rgba(OT_GOLD,0.9);ctx.shadowBlur=18;ctx.stroke();ctx.restore();
  T(ctx,o.title||"shared model",x,y-r*0.36,{w:800,size:24,align:"center",color:rgba(OT_GOLD,1)});
  const bx=[[x-r*0.5,y+r*0.2],[x+r*0.5,y+r*0.2],[x,y+r*0.58]];ctx.save();ctx.strokeStyle=rgba(OT_GOLD,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx[0][0],bx[0][1]);ctx.lineTo(bx[2][0],bx[2][1]);ctx.lineTo(bx[1][0],bx[1][1]);ctx.stroke();
  bx.forEach(([px,py])=>{ctx.fillStyle="rgba(10,14,28,1)";rr(ctx,px-24,py-12,48,24,5);ctx.fill();ctx.strokeStyle=rgba(OT_GOLD,1);ctx.lineWidth=2;rr(ctx,px-24,py-12,48,24,5);ctx.stroke();});ctx.restore();});}

/* ---------- the lost spacecraft, 1999 ---------- */
function ot_mars(ctx,x,y,r,t){const g=ctx.createRadialGradient(x-r*0.35,y-r*0.35,r*0.1,x,y,r);g.addColorStop(0,"#e3906a");g.addColorStop(0.6,"#b0543a");g.addColorStop(1,"#4a1c14");glow(ctx,x,y,r*1.5,[255,140,100],0.25);
  ctx.save();ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.globalAlpha=0.25;ctx.fillStyle="#5a2418";[[0.2,-0.3,0.25],[-0.3,0.2,0.18],[0.35,0.35,0.12],[-0.1,-0.55,0.1]].forEach(([dx,dy,rr_])=>{ctx.beginPath();ctx.ellipse(x+dx*r,y+dy*r,rr_*r*1.4,rr_*r,0.3,0,TAU);ctx.fill();});ctx.restore();
  ctx.save();ctx.strokeStyle="rgba(255,190,150,0.35)";ctx.lineWidth=r*0.1;ctx.beginPath();ctx.arc(x,y,r*1.05,0,TAU);ctx.stroke();ctx.restore();}
function ot_craft(ctx,x,y,s,rot,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);ctx.fillStyle="#c8ccd6";rr(ctx,-12,-10,24,20,3);ctx.fill();ctx.fillStyle="#4a6aa8";ctx.fillRect(-46,-6,30,12);ctx.fillRect(16,-6,30,12);
  ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineWidth=1;for(let i=-40;i<-16;i+=6){ctx.beginPath();ctx.moveTo(i,-6);ctx.lineTo(i,6);ctx.stroke();}for(let i=22;i<46;i+=6){ctx.beginPath();ctx.moveTo(i,-6);ctx.lineTo(i,6);ctx.stroke();}
  ctx.fillStyle="#e8e2c8";ctx.beginPath();ctx.arc(0,-14,7,Math.PI,TAU);ctx.fill();ctx.restore();});}
function ot_stars(ctx,t,n){for(let i=0;i<(n||90);i++){const x=hash(i,11)*W,y=hash(i,12)*H*0.9,tw_=0.4+0.6*Math.abs(Math.sin(t*0.8+i));ctx.fillStyle="rgba(230,236,255,"+(0.15+0.45*hash(i,13))*tw_+")";ctx.fillRect(x,y,1.8,1.8);}}

/* ---------- one learner, many records ---------- */
// a record in one system: its colour, the system, the kind of ID and the ID
function ot_idCard(ctx,x,y,w,k,kind,id,a,o){o=o||{};if(a<=0.01)return;const c=(OT_SYS[k]||{c:OT_IT}).c,n=(OT_SYS[k]||{n:"IT directory"}).n,h=o.h||92;withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,c,{glow:12+10*(o.hi||0),ea:0.75,fill:"rgba(7,12,24,0.94)"});led(ctx,x+14,y+16,5,h-32,c);
  T(ctx,n+" · "+kind,x+34,y+34,{w:700,size:18,color:rgba(c,1)});T(ctx,id,x+34,y+72,{f:"mono",w:500,size:27,color:rgba(INK,1)});});}
// a code list: one set of values every system uses
function ot_codeList(ctx,x,y,a,hi){if(a<=0.01)return;withA(ctx,a,()=>{const w=640,h=104;if(hi)glow(ctx,x+w/2,y+h/2,380,OT_STD,0.2*hi);glass(ctx,x,y,w,h,16,OT_STD,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.95)"});
  T(ctx,"credential kind",x+24,y+36,{f:"mono",w:500,size:20,color:rgba(OT_STD,1)});T(ctx,"one shared list",x+w-24,y+36,{w:600,size:17,align:"right",color:rgba(SOFT,1)});
  ["award","microcredential","badge"].forEach((s,i)=>ot_pill(ctx,x+104+i*196,y+74,s,OT_STD,{size:21}));});}

/* ---------- the logical model, and the yardstick ---------- */
const OT_LM={learner:[360,290],issuer:[360,560],cred:[930,410],evidence:[1500,250],micro:[1300,720],award:[1700,720]};
const OT_CRED_ATTRS=[["credential id","id"],["issuer id",""],["learner id",""],["claim",""],["awarded on: date",""],["level: 1–10",""],["volume of learning: hours",""],["status: valid | expired | revoked",""]];
// the ruler: our logical model's parts, marked along a gold bar
function ot_ruler(ctx,x0,x1,y,marks,a,p){if(a<=0.01)return;withA(ctx,a,()=>{const w=x1-x0,q=p==null?1:p;ctx.save();ctx.shadowColor=rgba(OT_GOLD,0.8);ctx.shadowBlur=18;const g=ctx.createLinearGradient(0,y-30,0,y+30);g.addColorStop(0,"#f6d98a");g.addColorStop(1,"#b8862e");ctx.fillStyle=g;rr(ctx,x0,y-30,w*q,60,8);ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(60,40,10,0.8)";ctx.lineWidth=2;for(let i=0;i<=80;i++){const xx=x0+i*w/80;if(xx>x0+w*q)break;ctx.beginPath();ctx.moveTo(xx,y-30);ctx.lineTo(xx,y-30+(i%10===0?26:i%5===0?18:10));ctx.stroke();}
  marks.forEach((m,i)=>{const xx=x0+(i+0.5)*w/marks.length;if(xx>x0+w*q)return;T(ctx,m,xx,y+20,{w:800,size:19,align:"center",color:"rgba(50,32,8,0.95)"});});});}
