/* ===== One language, kept: this film's pictures =====
   Chile in 1972, in lamp-light: factories across the country sending their numbers to Santiago by telex, once a day; two factories that
   count workers absent two ways, so the one in trouble looks like the other; one definition of social unease, the same in every
   factory's model; the operations room as it was designed, every factory shown with the same icons; and the daily report, taken by hand
   to the presidential palace. Then the utility: the app team's change and its table called customer; the glossary, where customer means
   three things; the repository, with the map and what the data architecture keeps there; a name built from its parts; the industry's
   reference model and the utility's words mapped to it; a few principles; a decision record; the change kept, checked and fixed, the
   new term defined first; and the data practice on the map. At the end, Cybersyn as it was: how far it reached, what never ran, the
   operations room dismantled and the documents carried out. Everything is drawn to read on a phone: text at least 28 px in the frame,
   unless it's texture. */

/* ---------- from the series' other films: their helpers, copied, so the series' kit doesn't change ---------- */
// the story's room: Chile at night, in lamp-light, a dark blue-grey with a warm haze near the ground, and dust in the air (film 2's)
function d6_night(ctx,S,t){setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#10151f");g.addColorStop(0.62,"#181d29");g.addColorStop(1,"#26201b");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  glow(ctx,960,1180,900,CY_LAMP,0.06);motes(ctx,t,{col:CY_LAMP,a:0.6,n:40});}
// a card in the story: a name and a line under it, on dark glass in lamp-light (film 2's)
function d6_card(ctx,x,y,w,title,sub,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=sub?124:76;if(!w)w=Math.max(tw(ctx,title,o.size||36,800),sub?tw(ctx,sub,28,600):0)+60;glass(ctx,x,y,w,h,18,o.col||CY_LAMP,{glow:14+12*(o.hi||0),ea:0.75,fill:"rgba(20,16,12,0.92)"});
  T(ctx,title,x+28,y+50,{w:800,size:o.size||36,color:rgba(o.col||CY_LAMP,1)});if(sub)T(ctx,sub,x+28,y+96,{w:600,size:28,color:rgba(INK,0.92)});});}
// one line torn from the telex's paper, typed in capitals (film 2's); o.sig lights its edge
function d6_strip(ctx,x,y,w,s,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=o.h||70;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.012:o.rot);
  ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=18;ctx.shadowOffsetY=6;ctx.fillStyle=CY_PAPER;ctx.fillRect(-w/2,-h/2,w,h);ctx.shadowColor="transparent";
  ctx.fillStyle="rgba(0,0,0,0.12)";for(let i=0;i<w;i+=14){ctx.fillRect(-w/2+i,-h/2,7,2+hash(i,7)*3);ctx.fillRect(-w/2+i+5,h/2-3,7,2+hash(i,9)*3);}
  T(ctx,s,-w/2+26,(o.size||30)*0.36,{f:"mono",w:500,size:o.size||30,color:rgba(CY_INK,0.95)});ctx.restore();});}
// a verdict on a chip: a gold tick and its words, or a red cross (film 3's)
function d6_verdict(ctx,x,y,s,ok,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,s,28,700)+86,col=ok?TRUST:BAD;glass(ctx,x,y-30,w,60,30,col,{glow:10+12*(o.hi||0),ea:0.75,fill:"rgba(16,12,10,0.94)"});
  if(ok)kt_gtick(ctx,x+30,y,14,1);else kt_rcross(ctx,x+30,y,14,1);T(ctx,s,x+56,y+10,{w:700,size:28,color:rgba(mix(col,INK,0.35),1)});});}
function d6_verdictW(ctx,s){return tw(ctx,s,28,700)+86;}
// an owner's chip, gold for a business owner (film 5's)
function d6_chip(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||TRUST,w=tw(ctx,name,28,700)+56;if(a<=0.01)return w;
  withA(ctx,a,()=>{glass(ctx,x,y-25,w,50,25,col,{glow:8+12*(o.hi||0),ea:0.8,fill:"rgba(14,13,12,0.95)"});archGlyph(ctx,"role",x+26,y,9,col);T(ctx,name,x+44,y+10,{w:700,size:28,color:rgba(mix(col,INK,0.35),1)});});return w;}
// a note on glass: a title and a few lines under it, wrapped to its width; returns its height (film 5's)
function d6_noteH(ctx,w,title,body,o){o=o||{};const sz=o.size||30;return(title?92:30)+wrapT(ctx,body,0,0,w-56,{size:sz,w:600,measure:true}).length*Math.round(sz*1.3)+18;}
function d6_note(ctx,x,y,w,title,body,a,o){o=o||{};const h=d6_noteH(ctx,w,title,body,o);if(a<=0.01)return h;const col=o.col||CY_LAMP,sz=o.size||30;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:14+12*(o.hi||0),ea:0.75,fill:o.fill||"rgba(20,16,12,0.92)"});if(title)T(ctx,title,x+28,y+52,{w:800,size:o.tsize||34,color:rgba(col,1)});
    wrapT(ctx,body,x+28,y+(title?92:30)+Math.round(sz*0.8),w-56,{size:sz,w:600,lh:Math.round(sz*1.3),color:rgba(INK,0.94)});});return h;}
const D6_RED=[232,96,84],D6_GREY=[150,150,160],D6_RET=[255,150,186],D6_NET=[132,176,255],D6_SHR=[120,206,226],D6_ENT=[196,160,255],D6_CODE=[150,190,235];

/* ---------- 1. The same words: Chile, in lamp-light ---------- */
// the factories' telex strips, as they come in to Santiago: p (0..1) brings them in, one after another, onto a pile
const D6_STRIPS=["FROM FACTORY 12","FROM FACTORY 31","FROM FACTORY 47","FROM FACTORY 58"];
function d6_strips(ctx,x,y,p,a){if(a<=0.01)return;withA(ctx,a,()=>{D6_STRIPS.forEach((s,i)=>{const q=clamp(p*D6_STRIPS.length-i,0,1);if(q<=0.01)return;const k=spring(q*1.3);
  d6_strip(ctx,x+(1-k)*120,y+i*84,430,s,clamp(q*2,0,1),{rot:(hash(i,31)-0.5)*0.05});});});}
// a factory's sheet: how many workers were absent, and how it's counted; o.v the number shown, o.how the way it's counted (pencilled),
// o.def (0..1) the one definition pinned over the old way; o.v2: the number with it; o.bad (0..1) rings it red
function d6_count(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const w=440,h=300,df=o.def||0;sheet(ctx,x,y,w,h,{rot:o.rot||0.01,fill:CY_PAPER});
  T(ctx,o.title||"workers absent",x+28,y+54,{w:700,size:30,color:"rgba(52,48,46,0.95)"});
  withA(ctx,1-df,()=>{T(ctx,o.v||"4%",x+28,y+150,{w:800,size:76,color:"rgba(52,48,46,0.95)"});pencilText(ctx,o.how||"",x+28,y+214,{size:28,w:600,p:o.howP==null?1:o.howP});});
  if(df>0.01)withA(ctx,df,()=>{T(ctx,o.v2||"4%",x+28,y+150,{w:800,size:76,color:o.bad>0.5?"rgba(150,52,40,0.98)":"rgba(52,48,46,0.95)"});
    ctx.save();ctx.fillStyle="rgba(196,150,60,0.22)";rr(ctx,x+20,y+186,w-40,66,10);ctx.fill();ctx.restore();T(ctx,"social unease, defined once",x+34,y+230,{w:700,size:28,color:"rgba(110,76,24,0.98)"});});
  if((o.bad||0)>0.01){ctx.save();ctx.strokeStyle=rgba(D6_RED,0.9*o.bad);ctx.lineWidth=3;rr(ctx,x+14,y+84,164,84,16);ctx.stroke();ctx.restore();}});}
// the one definition, on a card in lamp-light: its name, how it's worked out (o.f, 0..1), and that it's the same in every factory's
// model (o.same, 0..1)
function d6_def(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=1000,h=230;glass(ctx,x,y,w,h,20,CY_LAMP,{glow:16+14*(o.hi||0),ea:0.8,fill:"rgba(20,16,12,0.94)"});
  T(ctx,"social unease",x+36,y+62,{w:800,size:40,color:rgba(CY_LAMP,1)});
  withA(ctx,o.f==null?1:o.f,()=>T(ctx,"share of the workers on the payroll absent that day",x+36,y+124,{w:700,size:32,color:rgba(INK,0.96)}));
  withA(ctx,o.same==null?1:o.same,()=>T(ctx,"the same in every factory's model",x+36,y+184,{w:600,size:28,color:rgba(SOFT,0.95)}));});}
// the operations room, as it was designed: a room of six sides, seven chairs facing screens on its walls, every factory on the screens
// shown with the same few icons. o.screens (0..1) lights the screens; o.icons (0..1) brings in each factory's icons; o.gone (0..1)
// takes the room away, chairs and screens, as it was dismantled
function d6_icon(ctx,x,y,s,k,col){ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.fillStyle=rgba(col,0.9);ctx.lineWidth=2;
  // a factory: a roof of teeth and a chimney
  ctx.beginPath();ctx.moveTo(x-s,y+s*0.6);ctx.lineTo(x-s,y-s*0.1);ctx.lineTo(x-s*0.5,y-s*0.5);ctx.lineTo(x-s*0.5,y-s*0.1);ctx.lineTo(x,y-s*0.5);ctx.lineTo(x,y-s*0.1);ctx.lineTo(x+s*0.4,y-s*0.1);ctx.lineTo(x+s*0.4,y-s*0.9);ctx.lineTo(x+s*0.7,y-s*0.9);ctx.lineTo(x+s*0.7,y+s*0.6);ctx.closePath();ctx.stroke();
  // its numbers, as a bar each, and a dot that would light for a warning
  for(let i=0;i<3;i++){const bh=s*(0.3+0.5*hash(k,i+5));ctx.fillRect(x+s*1.1+i*s*0.42,y+s*0.6-bh,s*0.26,bh);}ctx.beginPath();ctx.arc(x+s*2.4,y-s*0.5,s*0.18,0,TAU);ctx.fill();ctx.restore();}
function d6_opsroom(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const gone=o.gone||0,sc=o.screens==null?1:o.screens,ic=o.icons==null?1:o.icons;
  // the walls: six sides, three seen, in lamp-light; dismantled, they go too, after the screens and chairs
  withA(ctx,1-clamp(gone*1.25-0.25,0,1),()=>{ctx.save();ctx.strokeStyle=rgba(CY_LAMP,0.35);ctx.lineWidth=2;ctx.fillStyle="rgba(26,24,28,0.9)";ctx.beginPath();ctx.moveTo(160,700);ctx.lineTo(300,170);ctx.lineTo(1620,170);ctx.lineTo(1760,700);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(300,170);ctx.lineTo(560,240);ctx.lineTo(1360,240);ctx.lineTo(1620,170);ctx.stroke();ctx.beginPath();ctx.moveTo(560,240);ctx.lineTo(500,700);ctx.moveTo(1360,240);ctx.lineTo(1420,700);ctx.stroke();ctx.restore();});
  // the screens: one on each wall, every factory on them shown with the same icons
  const SCR=[[350,300,130,250,-0.18],[620,280,680,300,0],[1440,300,130,250,0.18]];
  withA(ctx,sc*(1-gone),()=>{SCR.forEach(([sx,sy,sw,sh,sk],k)=>{ctx.save();ctx.translate(sx+sw/2,sy+sh/2);ctx.transform(1,sk,0,1,0,0);ctx.fillStyle="rgba(10,14,18,0.96)";rr(ctx,-sw/2,-sh/2,sw,sh,8);ctx.fill();
    ctx.strokeStyle=rgba(CY_LAMP,0.5);ctx.lineWidth=2;rr(ctx,-sw/2,-sh/2,sw,sh,8);ctx.stroke();glow(ctx,0,0,sw*0.6,[200,220,255],0.06);
    if(k===1){for(let i=0;i<6;i++){const q=clamp(ic*6-i,0,1);if(q<=0.01)continue;withA(ctx,q,()=>d6_icon(ctx,-sw/2+70+(i%3)*220,-sh/2+90+Math.floor(i/3)*130,28,i,[220,232,255]));}}
    else{for(let i=0;i<2;i++){const q=clamp(ic*2-i,0,1);if(q<=0.01)continue;withA(ctx,q,()=>d6_icon(ctx,-sw/2+30,-sh/2+80+i*100,18,i+7,[220,232,255]));}}
    ctx.restore();});});
  // seven chairs in a ring, their backs to us, each a shell on a stem, with the buttons in its arm
  const CH=[[470,800],[700,760],[960,744],[1220,760],[1450,800],[820,860],[1100,860]];
  CH.forEach(([cx,cy],i)=>{const q=1-clamp(gone*1.6-i*0.09,0,1);if(q<=0.01)return;withA(ctx,q,()=>{ctx.save();ctx.fillStyle="rgba(214,208,196,0.9)";ctx.strokeStyle=rgba(CY_LAMP,0.5);ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(cx,cy-40,52,46,0,Math.PI,0);ctx.lineTo(cx+52,cy-6);ctx.quadraticCurveTo(cx,cy+16,cx-52,cy-6);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle="rgba(60,56,52,0.95)";ctx.fillRect(cx-5,cy+4,10,36);ctx.beginPath();ctx.ellipse(cx,cy+42,30,7,0,0,TAU);ctx.fill();
    ctx.fillStyle=rgba(CY_SIG,0.7);for(let b=0;b<3;b++){ctx.beginPath();ctx.arc(cx+38,cy-30+b*10,3,0,TAU);ctx.fill();}ctx.restore();});});});}
// the daily report, a sheet of small charts: national production (o.bars, 0..1, draws its bars), the points of crisis on a map
// (o.pts, 0..1) and, pencilled under them, how old its numbers are (o.old, 0..1)
function d6_report(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const w=560,h=420,bp=o.bars==null?1:o.bars,pp=o.pts==null?1:o.pts;sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.02:o.rot,fill:CY_PAPER});
  T(ctx,"the daily report",x+30,y+56,{w:800,size:32,color:"rgba(52,48,46,0.95)"});T(ctx,"national production",x+30,y+110,{w:600,size:28,color:"rgba(70,64,60,0.95)"});
  const B=[0.5,0.62,0.58,0.7,0.66,0.74,0.69,0.78];B.forEach((b,i)=>{const q=clamp(bp*8-i,0,1);if(q<=0)return;ctx.fillStyle="rgba(60,90,130,0.8)";const bh=110*b*q;ctx.fillRect(x+40+i*34,y+250-bh,22,bh);});
  T(ctx,"points of crisis",x+330,y+110,{w:600,size:28,color:"rgba(70,64,60,0.95)"});ctx.save();ctx.strokeStyle="rgba(52,48,46,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+420,y+132);ctx.bezierCurveTo(x+400,y+190,x+420,y+260,x+400,y+330);ctx.stroke();ctx.restore();
  [[412,170],[406,236],[402,300]].forEach(([px,py],i)=>{const q=clamp(pp*3-i,0,1);if(q<=0)return;ctx.fillStyle=rgba([150,52,40],0.9*q);ctx.beginPath();ctx.arc(x+px,y+py,7,0,TAU);ctx.fill();});
  pencilText(ctx,"a few days old, not six months",x+30,y+372,{size:28,w:600,p:o.old==null?1:o.old});});}
// the presidential palace, far off: a long, low front of columns, lit from below; la (0..1) its name under it
function d6_palace(ctx,x,y,a,la){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();const w=560,h=150;ctx.fillStyle="#1d1e24";ctx.fillRect(x,y-h,w,h);
  ctx.fillStyle="#25262d";ctx.fillRect(x-10,y-h-14,w+20,14);ctx.fillRect(x+w/2-70,y-h-46,140,32);   // the cornice, and the raised block over the door
  for(let r=0;r<2;r++)for(let i=0;i<11;i++){if(r===1&&(i===5))continue;const wx=x+22+i*48,wy=y-h+24+r*58;ctx.fillStyle=rgba(CY_LAMP,0.22+0.1*hash(i,r+3));ctx.fillRect(wx,wy,20,34);}
  ctx.fillStyle=rgba(CY_LAMP,0.35);ctx.fillRect(x+w/2-22,y-58,44,58);ctx.strokeStyle=rgba(CY_LAMP,0.45);ctx.lineWidth=2;ctx.strokeRect(x,y-h,w,h);ctx.restore();glow(ctx,x+w/2,y,320,CY_LAMP,0.08);
  withA(ctx,la==null?1:la,()=>T(ctx,"the presidential palace",x+w/2,y+46,{w:700,size:28,align:"center",color:rgba(CY_LAMP,0.95)}));});}

/* ---------- the utility: the app team's change, the glossary and the repository ---------- */
// a change, as the repository shows it: who opened it, what it adds, and the table it would make, with its name and columns. o.name, o.cols:
// the table's; o.fix (0..1) turns them to the agreed ones; o.flag (0..1) marks the name; o.checks: [[label, ok, a, row], ...] under it, each
// in its own row (by default, its place in the list)
function d6_change(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const w=780,h=o.h||520,fx=o.fix||0,fl=o.flag||0;
  glass(ctx,x,y,w,h,20,D6_CODE,{glow:12+12*(o.hi||0),ea:0.8,fill:"rgba(8,12,18,0.96)"});
  T(ctx,"change · opened by the app team",x+32,y+50,{f:"mono",w:500,size:28,color:rgba(D6_CODE,1)});T(ctx,"add the app's first table",x+32,y+108,{w:800,size:34,color:rgba(INK,0.97)});
  ctx.save();ctx.fillStyle="rgba(255,255,255,0.04)";rr(ctx,x+24,y+140,w-48,250,12);ctx.fill();ctx.restore();T(ctx,"table",x+48,y+184,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});
  withA(ctx,1-fx,()=>{T(ctx,o.name||"customer",x+160,y+188,{f:"mono",w:600,size:40,color:rgba(mix(INK,D6_RED,fl),1)});
    if(fl>0.01){ctx.save();ctx.strokeStyle=rgba(D6_RED,fl);ctx.lineWidth=3;rr(ctx,x+150,y+150,tw(ctx,o.name||"customer",40,600,"mono")+24,52,10);ctx.stroke();ctx.restore();}
    (o.cols||["customer_id","name","email","account"]).forEach((c,i)=>T(ctx,c,x+48+(i%2)*330,y+260+Math.floor(i/2)*58,{f:"mono",w:500,size:28,color:rgba(INK,0.85)}));});
  if(fx>0.01)withA(ctx,fx,()=>{T(ctx,"app_user",x+160,y+188,{f:"mono",w:600,size:40,color:rgba(mix(INK,TRUST,0.4),1)});
    ["app_user_id","account_id","signed_in_at"].forEach((c,i)=>T(ctx,c,x+48+(i%2)*330,y+260+Math.floor(i/2)*58,{f:"mono",w:500,size:28,color:rgba(INK,0.85)}));});
  (o.checks||[]).forEach(([s,ok,q,r],i)=>{if(q<=0.01)return;const ry=y+430+(r==null?i:r)*66;withA(ctx,q,()=>{if(ok)kt_gtick(ctx,x+52,ry,13,1);else kt_rcross(ctx,x+52,ry,13,1);T(ctx,s,x+80,ry+10,{w:600,size:28,color:rgba(ok?mix(TRUST,INK,0.35):mix(D6_RED,INK,0.3),1)});});});});}
// the people a table of everyone who signs in would hold, each a small figure with a phone: p (0..1) brings them in
const D6_WHO=["account holder","partner","tenant","grown-up child"];
function d6_who(ctx,x,y,p,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{D6_WHO.forEach((s,i)=>{const q=clamp(p*D6_WHO.length-i,0,1);if(q<=0.01)return;const cx=x+i*230,hi=i===0?(o.hi0||0):0;
  withA(ctx,q,()=>{const col=i===0?TRUST:D6_RET;ctx.save();ctx.fillStyle=rgba(col,0.85);ctx.beginPath();ctx.arc(cx,y-58,20,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(cx-30,y);ctx.quadraticCurveTo(cx-30,y-30,cx,y-32);ctx.quadraticCurveTo(cx+30,y-30,cx+30,y);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgba(12,14,18,1)";rr(ctx,cx+20,y-40,16,26,3);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2;rr(ctx,cx+20,y-40,16,26,3);ctx.stroke();ctx.restore();
    if(hi>0.01)glow(ctx,cx,y-30,60,TRUST,0.3*hi);T(ctx,s,cx,y+40,{w:700,size:28,align:"center",color:rgba(mix(col,INK,0.4),1)});});});});}
// the glossary's entry for a word: its meanings here, each a term with its domain and owner; o.fourth (0..1) a fourth meaning, dashed
// and in question; o.p(i) brings in meaning i; o.hiR(i) lights it; o.appUser (0..1) the new term, app user, with its owner
const D6_MEAN=[["account holder","pays the bill for an account","retail","head of retail"],["connection point","where power is delivered","network","Grace"],["contact","someone who called us","retail","head of retail"]];
function d6_gloss(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const w=o.w||1000,h=150+(3+Math.max(o.fourth||0,o.appUser||0))*92;  // a fourth row opens as it comes in
  glass(ctx,x,y,w,h,20,BUSC,{glow:12+12*(o.hi||0),ea:0.8,fill:"rgba(12,10,6,0.96)"});T(ctx,"glossary",x+32,y+50,{f:"mono",w:500,size:28,color:rgba(BUSC,1)});
  T(ctx,o.word||"customer",x+32,y+104,{w:800,size:40,color:rgba(INK,0.98)});withA(ctx,o.sub==null?1:o.sub,()=>T(ctx,"three meanings here: say which",x+32+tw(ctx,o.word||"customer",40,800)+30,y+102,{w:600,size:28,color:rgba(SOFT,0.95)}));
  D6_MEAN.forEach(([term,m,dom,own],i)=>{const q=o.p?o.p(i):1;if(q<=0.01)return;const ry=y+170+i*92,hi=o.hiR?o.hiR(i):0;withA(ctx,q,()=>{if(hi>0.01){ctx.fillStyle=rgba(TRUST,0.08*hi);rr(ctx,x+16,ry-36,w-32,80,12);ctx.fill();}
    daBO(ctx,x+28,ry-30,300,58,term,{size:28});T(ctx,m,x+350,ry+8,{w:600,size:28,color:rgba(INK,0.9)});const ow=tw(ctx,own,28,700)+56;d6_chip(ctx,x+w-28-ow,ry,own,{});});});
  const fo=o.fourth||0;if(fo>0.01){const ry=y+170+3*92;withA(ctx,fo*(1-(o.appUser||0)),()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(D6_RED,0.9);ctx.lineWidth=2.4;rr(ctx,x+28,ry-30,300,58,6);ctx.stroke();ctx.restore();
    T(ctx,"customer?",x+178,ry+10,{w:700,size:28,align:"center",color:rgba(D6_RED,1)});T(ctx,"whoever signs in to the app",x+350,ry+8,{w:600,size:28,color:rgba(mix(D6_RED,INK,0.3),1)});});}
  const au=o.appUser||0;if(au>0.01){const ry=y+170+3*92;withA(ctx,au,()=>{ctx.fillStyle=rgba(TRUST,0.08*(o.auHi||0));rr(ctx,x+16,ry-36,w-32,80,12);ctx.fill();daBO(ctx,x+28,ry-30,300,58,"app user",{size:28,hi:o.auHi||0});
    T(ctx,"signs in for an account",x+350,ry+8,{w:600,size:28,color:rgba(INK,0.92)});const ow=tw(ctx,"head of retail",28,700)+56;d6_chip(ctx,x+w-28-ow,ry,"head of retail",{hi:o.auHi||0});});}});}
// the repository: the map, and what the data architecture keeps beside it, a folder each; o.p(i) brings in folder i, o.hiR(i) lights it
const D6_REPO=[["map/","the enterprise map"],["names/","how names are built"],["reference-model/","the industry's words, mapped"],["principles/","a few short rules"],["decisions/","each one, with its reasons"]];
function d6_repo(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const w=o.w||820,h=110+D6_REPO.length*70;glass(ctx,x,y,w,h,20,D6_CODE,{glow:12,ea:0.8,fill:"rgba(8,12,18,0.96)"});
  T(ctx,"repository · architecture",x+32,y+52,{f:"mono",w:500,size:28,color:rgba(D6_CODE,1)});
  D6_REPO.forEach(([f,s],i)=>{const q=o.p?o.p(i):1;if(q<=0.01)return;const ry=y+112+i*70,hi=o.hiR?o.hiR(i):0;withA(ctx,q,()=>{if(hi>0.01){ctx.fillStyle=rgba(D6_CODE,0.1*hi);rr(ctx,x+16,ry-30,w-32,60,10);ctx.fill();}
    ctx.save();ctx.fillStyle=rgba(D6_CODE,0.75);ctx.beginPath();ctx.moveTo(x+36,ry-12);ctx.lineTo(x+50,ry-12);ctx.lineTo(x+55,ry-7);ctx.lineTo(x+70,ry-7);ctx.lineTo(x+70,ry+14);ctx.lineTo(x+36,ry+14);ctx.closePath();ctx.fill();ctx.restore();
    T(ctx,f,x+88,ry+10,{f:"mono",w:500,size:28,color:rgba(INK,0.95)});T(ctx,s,x+380,ry+10,{w:600,size:28,color:rgba(SOFT,0.95)});});});});}

/* ---------- 3. Names with parts ---------- */
// a name built from its parts: the thing, from the glossary; what about it; and the kind of value. o.p(i) brings in part i; o.whole
// (0..1) the name they make, and as a column
const D6_PARTS=[["account holder","the thing · from the glossary",BUSC],["start","what about it",INFC],["date","the kind of value",D6_CODE]];
function d6_parts(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{let cx=x;D6_PARTS.forEach(([s,cap,col],i)=>{const q=o.p?o.p(i):1,bw=tw(ctx,s,40,800)+80;if(q>0.01){const k=spring(q*1.3);
    withA(ctx,clamp(q*2,0,1),()=>{ctx.save();ctx.translate(0,(1-k)*-16);glass(ctx,cx,y,bw,96,16,col,{glow:12+12*(o.hiP?o.hiP(i):0),ea:0.85,fill:"rgba(10,10,14,0.96)"});T(ctx,s,cx+bw/2,y+62,{w:800,size:40,align:"center",color:rgba(mix(col,INK,0.25),1)});ctx.restore();
      T(ctx,cap,cx+bw/2,y+150,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)});});}
    if(i<2&&q>0.01)withA(ctx,q,()=>T(ctx,"+",cx+bw+30,y+66,{w:700,size:40,align:"center",color:rgba(SOFT,0.8)}));cx+=bw+60;});
  const wh=o.whole||0;if(wh>0.01)withA(ctx,wh,()=>{T(ctx,"account holder start date",x,y+262,{w:800,size:44,color:rgba(INK,0.98)});T(ctx,"as a column: account_holder_start_date",x,y+320,{f:"mono",w:500,size:28,color:rgba(D6_CODE,1)});});});}
// the short list the kind of value comes from
const D6_KINDS=["date","amount","count","identifier","name"];
function d6_kinds(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{T(ctx,"kinds of value",x,y,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});let cx=x;D6_KINDS.forEach((k,i)=>{const w=tw(ctx,k,28,700)+40;
  glass(ctx,cx,y+24,w,52,26,D6_CODE,{glow:6+12*(i===0?(o.hi||0):0),ea:0.75,fill:"rgba(8,12,18,0.95)"});T(ctx,k,cx+w/2,y+60,{w:700,size:28,align:"center",color:rgba(mix(D6_CODE,INK,0.3),1)});cx+=w+16;});});}
// an older system's own name, mapped once to the glossary's: billing's premise is a connection point
function d6_oldName(ctx,x,y,p,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,330,70,14,D6_CODE,{glow:8,ea:0.7,fill:"rgba(8,12,18,0.95)"});T(ctx,"billing: premise",x+24,y+46,{f:"mono",w:500,size:28,color:rgba(INK,0.9)});
  arrowTo(ctx,x+340,y+35,x+460,y+35,TRUST,0.9,{p:clamp(p,0,1),lw:2.6,head:11});if(p>0.5)withA(ctx,clamp(p*2-1,0,1),()=>{daBO(ctx,x+474,y+6,300,58,"connection point",{size:28});T(ctx,"mapped once",x+474,y+104,{w:600,size:28,color:rgba(SOFT,0.95)});});});}

/* ---------- 4. The industry's words ---------- */
// the Common Information Model's classes this film needs, as a reference model draws them: a class's box with its name, and a line on
// what it is; o.p(i) brings in class i
const D6_CIM=[["UsagePoint","where power is delivered"],["ServiceLocation","the premises"],["Customer","receives the service"],["CustomerAccount","for billing"]];
const D6_CIMY=[150,290,430,570];
function d6_cim(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{T(ctx,"Common Information Model · IEC",x,y+60,{w:800,size:30,color:rgba(D6_CODE,1)});
  D6_CIM.forEach(([n,s],i)=>{const q=o.p?o.p(i):1;if(q<=0.01)return;const by=y+D6_CIMY[i];withA(ctx,q,()=>{ctx.save();ctx.fillStyle="rgba(10,14,20,0.96)";ctx.strokeStyle=rgba(D6_CODE,0.9);ctx.lineWidth=2.4;rr(ctx,x,by,560,104,6);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(x,by+52);ctx.lineTo(x+560,by+52);ctx.stroke();ctx.restore();T(ctx,n,x+280,by+38,{f:"mono",w:600,size:30,align:"center",color:rgba(INK,0.97)});T(ctx,s,x+280,by+88,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)});});});});}
// the utility's own words, on the left, each mapped to the model's class by a dashed line as o.m(i) (0..1) goes to 1
const D6_UW=[["connection point",0],["location",1],["account holder",2]];
function d6_words(ctx,x,y,cx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{T(ctx,"the utility's words",x,y+60,{w:800,size:30,color:rgba(BUSC,1)});
  D6_UW.forEach(([s,k],i)=>{const q=o.p?o.p(i):1;if(q<=0.01)return;const by=y+D6_CIMY[k]+22;withA(ctx,q,()=>daBO(ctx,x,by,380,60,s,{size:28,hi:o.hiW?o.hiW(i):0}));
    const m=o.m?o.m(i):0;if(m>0.01){arrowTo(ctx,x+392,by+30,cx-12,by+30,TRUST,0.85,{p:m,dash:[9,7],lw:2.4,head:10});if(k===2)arrowTo(ctx,x+392,by+40,cx-12,y+D6_CIMY[3]+52,TRUST,0.7,{p:m,dash:[9,7],lw:2.2,head:10});}});
  // whoever signs in to the app: a fourth, with no class to map to
  const nw=o.none||0;if(nw>0.01)withA(ctx,nw,()=>{const by=y+D6_CIMY[3]+130;ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(D6_RED,0.9);ctx.lineWidth=2.4;rr(ctx,x,by,380,60,6);ctx.stroke();ctx.restore();
    T(ctx,"whoever signs in",x+190,by+40,{w:700,size:28,align:"center",color:rgba(D6_RED,1)});T(ctx,"none of the three: a new concept, its own name and owner",x+410,by+40,{w:600,size:28,color:rgba(mix(D6_RED,INK,0.35),1)});});});}

/* ---------- 5. A few principles ---------- */
// a principle, on a card: the rule, why it holds, and what follows; o.why, o.so (0..1) bring in its lines
const D6_PRIN=[["One concept, one name, from the glossary","six names: 180 households without a text","every name says which concept it is"],
  ["Each fact has one home","copies made on their own drift apart","every copy traces back to its home"],
  ["Data crosses a domain's edge only by a published flow","eleven paths, only four of them on the map","each flow with its contract"],
  ["Every table belongs to a data product","300 tables owned by whoever built them","an owner who knows what its data means"]];
function d6_prin(ctx,i,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[r,why,so]=D6_PRIN[i],w=840,h=300;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,D6_ENT,{glow:12+14*(o.hi||0),ea:0.8,fill:"rgba(12,10,18,0.96)"});
  archGlyph(ctx,"principle",x+40,y+50,15,D6_ENT);wrapT(ctx,r,x+74,y+60,w-110,{size:32,w:800,lh:40,color:rgba(mix(D6_ENT,INK,0.35),1)});
  withA(ctx,o.why==null?1:o.why,()=>{T(ctx,"why",x+36,y+178,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});wrapT(ctx,why,x+120,y+178,w-150,{size:28,w:600,lh:36,color:rgba(INK,0.93)});});
  withA(ctx,o.so==null?1:o.so,()=>{T(ctx,"so",x+36,y+256,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});wrapT(ctx,so,x+120,y+256,w-150,{size:28,w:600,lh:36,color:rgba(INK,0.93)});});});}

/* ---------- 6. Decisions, written down ---------- */
// the decisions folder, its files listed; the seventh lit
const D6_FILES=["005-each-fact-has-one-home","006-flows-have-contracts","007-customer-is-never-a-name"];
function d6_files(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const w=640,h=96+D6_FILES.length*64;glass(ctx,x,y,w,h,18,D6_CODE,{glow:10,ea:0.8,fill:"rgba(8,12,18,0.96)"});
  T(ctx,"decisions/",x+30,y+50,{f:"mono",w:500,size:28,color:rgba(D6_CODE,1)});D6_FILES.forEach((f,i)=>{const ry=y+104+i*64,hi=i===2?(o.hi||0):0;if(hi>0.01){ctx.fillStyle=rgba(D6_CODE,0.12*hi);rr(ctx,x+14,ry-30,w-28,56,10);ctx.fill();}
    T(ctx,f,x+30,ry+8,{f:"mono",w:500,size:28,color:rgba(i===2?INK:SOFT,i===2?0.98:0.85)});});});}
// the decision record, on a sheet: its number (o.num, 0..1) and what was decided (o.head), then its fields: who and when, why, what else
// was considered and what follows; o.k(i) brings in field i's name, o.v(i) what it says (0 decided, 1 why, 2 considered, 3 so); o.hiR(i)
const D6_REC=[["decided","14 October · Grace, head of retail, Ama"],["why","customer means three things here"],["considered","one definition for everyone: fits neither side"],["so","every name says which: account holder, connection point or contact"]];
function d6_record(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const w=1080,h=660;sheet(ctx,x,y,w,h,{rot:-0.006,plain:true});
  withA(ctx,o.num==null?1:o.num,()=>T(ctx,"decision 7",x+44,y+64,{f:"mono",w:600,size:30,color:"rgba(110,76,24,0.98)"}));
  withA(ctx,o.head==null?1:o.head,()=>T(ctx,"customer is never a name on its own",x+44,y+128,{w:800,size:40,color:"rgba(46,42,40,0.98)"}));
  D6_REC.forEach(([k,v],i)=>{const qk=o.k?o.k(i):1,qv=o.v?o.v(i):1;if(qk<=0.01&&qv<=0.01)return;const ry=y+232+i*100,hi=o.hiR?o.hiR(i):0;if(hi>0.01){ctx.fillStyle="rgba(196,150,60,"+(0.18*hi)+")";rr(ctx,x+24,ry-40,w-48,84,10);ctx.fill();}
    withA(ctx,qk,()=>T(ctx,k,x+44,ry,{f:"mono",w:600,size:28,color:"rgba(110,76,24,0.95)"}));withA(ctx,qv,()=>wrapT(ctx,v,x+250,ry,w-300,{size:30,w:600,lh:38,color:"rgba(52,48,46,0.95)"}));});});}
// a meeting, in silhouette round a table; it fades while the record stays (o.a)
function d6_meeting(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(60,56,52,0.55)";ctx.beginPath();ctx.ellipse(x,y,170,40,0,0,TAU);ctx.fill();ctx.restore();
  [[-150,-20],[-60,-46],[60,-46],[150,-20]].forEach(([dx,dy],i)=>{ctx.save();ctx.fillStyle="rgba(150,140,130,0.7)";ctx.beginPath();ctx.arc(x+dx,y+dy-54,18,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(x+dx-28,y+dy);ctx.quadraticCurveTo(x+dx-28,y+dy-30,x+dx,y+dy-32);ctx.quadraticCurveTo(x+dx+28,y+dy-30,x+dx+28,y+dy);ctx.closePath();ctx.fill();ctx.restore();});});}

/* ---------- 7. Kept with every change ---------- */
// a ticket: the question, who asks and who answers
function d6_ticket(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=600,h=230;glass(ctx,x,y,w,h,18,D6_RET,{glow:12+12*(o.hi||0),ea:0.8,fill:"rgba(16,10,14,0.96)"});
  T(ctx,"ticket · retail",x+30,y+50,{f:"mono",w:500,size:28,color:rgba(D6_RET,1)});T(ctx,"What is an app user?",x+30,y+110,{w:800,size:34,color:rgba(INK,0.97)});
  T(ctx,"from the app team",x+30,y+168,{w:600,size:28,color:rgba(SOFT,0.95)});const ow=tw(ctx,"head of retail",28,700)+56;d6_chip(ctx,x+w-30-ow,y+196,"head of retail",{a:o.own==null?1:o.own});});}
// the data practice on the map, its business layer as Who owns which data left it: each domain a grouping, with its concepts and its
// owner, gold for a business owner; the enterprise domain holds the measures that cross domains. o.app (0..1) the new concept, app user,
// joins retail's; o.appHi lights it; o.ownHi lights retail's owner; o.link (0..1) its link to decision 7
const D6_GR=[["network",D6_NET,60,["connection point","meter reading","hosting capacity"],"Grace"],["retail",D6_RET,560,["account","account holder","bill","contact"],"head of retail"],
  ["shared",D6_SHR,1000,["location"],"Grace"],["enterprise",D6_ENT,1380,[],"Ama","measures that cross domains"]];
const D6_GW=[460,400,340,480];
function d6_map(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  tag(ctx,960,62,"the data practice on the map",DAC,{align:"center",size:30});
  ctx.save();ctx.fillStyle=rgba(BUSC,0.06);ctx.strokeStyle=rgba(BUSC,0.5);ctx.lineWidth=2;rr(ctx,30,100,1860,620,18);ctx.fill();ctx.stroke();ctx.restore();tag(ctx,54,100,"business",BUSC,{size:28});
  D6_GR.forEach(([nm,col,gx,cs,own,sub],gi)=>{const gw=D6_GW[gi],gy=130,gh=560;
    ctx.save();ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2.5;rr(ctx,gx,gy,gw,gh,14);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=rgba(col,0.05);rr(ctx,gx,gy,gw,gh,14);ctx.fill();ctx.restore();
    T(ctx,nm,gx+20,gy+40,{w:800,size:30,color:rgba(col,1)});if(sub)T(ctx,sub,gx+20,gy+86,{w:600,size:28,color:rgba(mix(col,INK,0.45),0.96)});
    cs.forEach((c,ci)=>daBO(ctx,gx+20,gy+64+ci*70,gw-40,58,c,{size:28}));
    const ow=tw(ctx,own,28,700)+56;d6_chip(ctx,gx+gw-20-ow,gy+30,own,{hi:gi===1?(o.ownHi||0):0});});
  const ap=o.app||0;if(ap>0.01){const gx=D6_GR[1][2],gw=D6_GW[1],ay=130+64+4*70,k=spring(ap*1.2);
    withA(ctx,clamp(ap*2,0,1),()=>{ctx.save();ctx.translate(0,(1-k)*-14);daBO(ctx,gx+20,ay,gw-40,58,"app user",{size:28,hi:o.appHi||0});ctx.restore();});
    const lk=o.link||0;if(lk>0.01)withA(ctx,lk,()=>{const lw=tw(ctx,"decision 7",28,600,"mono")+48,lx=gx+gw/2-lw/2,ly=ay+58+26;
      ctx.save();ctx.strokeStyle=rgba(D6_CODE,0.9);ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(gx+gw/2,ay+58);ctx.lineTo(gx+gw/2,ly);ctx.stroke();ctx.restore();
      glass(ctx,lx,ly,lw,52,12,D6_CODE,{glow:8,ea:0.75,fill:"rgba(8,12,18,0.95)"});T(ctx,"decision 7",gx+gw/2,ly+36,{f:"mono",w:600,size:28,align:"center",color:rgba(mix(D6_CODE,INK,0.3),1)});});}});}
// the first year's count, as chips under the map: o.p(i) brings in chip i
const D6_YEAR=["9 names stopped before a table","14 decisions written down"];
function d6_year(ctx,y,o){o=o||{};D6_YEAR.forEach((s,i)=>{const q=o.p?o.p(i):1;if(q<=0.01)return;withA(ctx,q,()=>tag(ctx,i===0?620:1300,y,s,TRUST,{align:"center",size:30}));});}

/* ---------- 8. Never finished: Cybersyn as it was ---------- */
// what was built and what wasn't: each a row with a tick for what ran, a cross for what didn't; o.p(i) brings in row i
const D6_BUILT=[["the operations room","could do very little",0],["the simulator","never left the experimental stage",0],["the telex network","used regularly",1]];
function d6_built(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const w=1100,h=90+D6_BUILT.length*84;glass(ctx,x,y,w,h,18,CY_LAMP,{glow:12,ea:0.75,fill:"rgba(20,16,12,0.94)"});
  T(ctx,"never ran as designed",x+32,y+54,{w:800,size:34,color:rgba(CY_LAMP,1)});D6_BUILT.forEach(([n,s,ok],i)=>{const q=o.p?o.p(i):1;if(q<=0.01)return;const ry=y+124+i*84;
    withA(ctx,q,()=>{if(ok)kt_gtick(ctx,x+48,ry,13,1);else kt_rcross(ctx,x+48,ry,13,1);T(ctx,n,x+82,ry+10,{w:700,size:30,color:rgba(INK,0.96)});T(ctx,s,x+460,ry+10,{w:600,size:28,color:rgba(SOFT,0.95)});});});});}
// the documents, carried out: a silhouette walking away with folders under the arm; p (0..1) how far it has walked
function d6_carry(ctx,x,y,p,a){if(a<=0.01)return;withA(ctx,a,()=>{const ex=lerp(x,x+520,ease(clamp(p,0,1))),walking=p>0.01&&p<0.99;daSil(ctx,ex,y,300,{dir:1,walk:walking?p*40:null,board:0});
  ctx.save();ctx.translate(ex+30,y-168);ctx.rotate(-0.32);[0,1,2,3].forEach(i=>{ctx.fillStyle=i%2?"#d8cfb8":CY_PAPER;ctx.fillRect(-34,-6+i*7,68,6);});ctx.restore();});}
