/* ===== Who owns which data: this film's pictures =====
   Chile in 1972, in lamp-light: Cybersyn's engineers at a factory, choosing its few numbers; one of them out of its range, and the
   warning the software would send; then the levels a warning could go to, the centre in Santiago, the industry's committee at CORFO
   and the factories with their managers: every warning sent to the centre, which buries it, or, in Beer's design, each warning first to
   the factory's own manager, with a clock for the time they have, and only up to the committee when the time runs out. Then the
   utility: the platform's catalogue, its tables and their owners; hosting capacity, the engineers' method, the table, the website and
   the families who bought panels; the rule, each capability's data product and its owner; the data product and its five things; the
   four words, warehouse, lakehouse, mesh and fabric; the baseline, the target, their gaps and the roadmap; and the data practice on the
   map, its domains and their products. Everything is drawn to read on a phone: text at least 28 px in the frame, unless it's texture. */

/* ---------- from the series' other films: their helpers, copied, so the series' kit doesn't change ---------- */
// the story's room: Chile at night, in lamp-light, a dark blue-grey with a warm haze near the ground, and dust in the air (film 2's)
function d5_night(ctx,S,t){setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#10151f");g.addColorStop(0.62,"#181d29");g.addColorStop(1,"#26201b");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  glow(ctx,960,1180,900,CY_LAMP,0.06);motes(ctx,t,{col:CY_LAMP,a:0.6,n:40});}
// a card in the story: a name and a line under it, on dark glass in lamp-light (film 2's)
function d5_card(ctx,x,y,w,title,sub,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=sub?124:76;if(!w)w=Math.max(tw(ctx,title,o.size||36,800),sub?tw(ctx,sub,28,600):0)+60;glass(ctx,x,y,w,h,18,o.col||CY_LAMP,{glow:14+12*(o.hi||0),ea:0.75,fill:"rgba(20,16,12,0.92)"});
  T(ctx,title,x+28,y+50,{w:800,size:o.size||36,color:rgba(o.col||CY_LAMP,1)});if(sub)T(ctx,sub,x+28,y+96,{w:600,size:28,color:rgba(INK,0.92)});});}
// how wide d5_card draws a card with no width given
function d5_cardW(ctx,title,sub,size){return Math.max(tw(ctx,title,size||36,800),sub?tw(ctx,sub,28,600):0)+60;}
// one line torn from the telex's paper, typed in capitals (film 2's); o.sig lights its edge
function d5_strip(ctx,x,y,w,s,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const h=o.h||96;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.012:o.rot);
  ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=18;ctx.shadowOffsetY=6;ctx.fillStyle=CY_PAPER;ctx.fillRect(-w/2,-h/2,w,h);ctx.shadowColor="transparent";
  ctx.fillStyle="rgba(0,0,0,0.12)";for(let i=0;i<w;i+=14){ctx.fillRect(-w/2+i,-h/2,7,2+hash(i,7)*3);ctx.fillRect(-w/2+i+5,h/2-3,7,2+hash(i,9)*3);}
  T(ctx,s,-w/2+30,(o.size||34)*0.36,{f:"mono",w:500,size:o.size||34,color:rgba(CY_INK,0.95)});
  if(o.sig>0.01){ctx.strokeStyle=rgba(o.scol||CY_SIG,o.sig);ctx.lineWidth=4;ctx.strokeRect(-w/2+3,-h/2+3,w-6,h-6);}
  ctx.restore();});}
// a verdict on a chip: a gold tick and its words, or a red cross (film 3's)
function d5_verdict(ctx,x,y,s,ok,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,s,28,700)+86,col=ok?TRUST:BAD;glass(ctx,x,y-30,w,60,30,col,{glow:10+12*(o.hi||0),ea:0.75,fill:"rgba(16,12,10,0.94)"});
  if(ok)kt_gtick(ctx,x+30,y,14,1);else kt_rcross(ctx,x+30,y,14,1);T(ctx,s,x+56,y+10,{w:700,size:28,color:rgba(mix(col,INK,0.35),1)});});}
function d5_verdictW(ctx,s){return tw(ctx,s,28,700)+86;}
// a calendar's page: the month, large, under a red strip; months: [[name, alpha], ...] on the same page, for a month that turns (film 3's)
function d5_cal(ctx,x,y,months,a){if(a<=0.01)return;withA(ctx,a,()=>{const w=240,h=170;sheet(ctx,x,y,w,h,{rot:-0.015,fill:CY_PAPER});ctx.fillStyle="rgba(150,52,40,0.9)";ctx.fillRect(x,y,w,48);
  for(let k=0;k<5;k++){ctx.fillStyle="#2a2624";ctx.beginPath();ctx.arc(x+40+k*40,y+9,5,0,TAU);ctx.fill();}
  T(ctx,"month",x+w/2,y+36,{f:"mono",w:500,size:28,align:"center",color:"rgba(250,240,225,0.95)"});
  months.forEach(([nm,q])=>{if(q>0.01)withA(ctx,q,()=>T(ctx,nm,x+w/2,y+124,{w:800,size:daFit(ctx,nm,46,800,w-36),align:"center",color:"rgba(46,42,40,0.95)"}));});});}
// the months a page shows as the story goes, each turning to the next at its moment: ts[i] is when month i comes (film 3's)
function d5_months(t,names,ts){return names.map((nm,i)=>{const on=i===0?1:fin(t,ts[i]-0.15,0.3),off=i<names.length-1?fin(t,ts[i+1]-0.45,0.3):0;return[nm,on*(1-off)];});}
// a clock face, for time going by; p (0..1) sweeps its hand round once, the time used shaded behind it (film 2's); o.col its colour
function d5_clock(ctx,x,y,r,p,a,o){o=o||{};if(a<=0.01)return;const col=o.col||CY_LAMP;withA(ctx,a,()=>{ctx.fillStyle="rgba(14,16,22,0.94)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,col,0.9,3);
  for(let i=0;i<12;i++){const q=i/12*TAU;ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+Math.sin(q)*r*0.78,y-Math.cos(q)*r*0.78);ctx.lineTo(x+Math.sin(q)*r*0.9,y-Math.cos(q)*r*0.9);ctx.stroke();}
  if(p>0.001){ctx.fillStyle=rgba(col,0.22);ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r*0.74,-Math.PI/2,-Math.PI/2+TAU*clamp(p,0,1));ctx.closePath();ctx.fill();}
  const q=TAU*clamp(p,0,1);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(q)*r*0.7,y-Math.cos(q)*r*0.7);ctx.stroke();ctx.lineCap="butt";});}
// ArchiMate's glyphs this film needs that the series' kit doesn't draw: a product (a box with a tab) and a grouping (a dashed box
// with a tab), as Business architecture for data draws them (its baGlyph); the rest are the kit's own
function d5_glyph(ctx,kind,x,y,s,col){if(kind==="product"){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.strokeRect(x-s*0.8,y-s*0.55,s*1.6,s*1.1);ctx.strokeRect(x-s*0.8,y-s*0.55,s*0.7,s*0.32);ctx.restore();}
  else archGlyph(ctx,kind,x,y,s,col);}

/* ---------- 1. Designing freedom: Chile, in lamp-light ---------- */
// a note on glass: a title and a few lines under it, wrapped to its width; returns its height
function d5_noteH(ctx,w,title,body,o){o=o||{};const sz=o.size||30;return(title?92:30)+wrapT(ctx,body,0,0,w-56,{size:sz,w:600,measure:true}).length*Math.round(sz*1.3)+18;}
function d5_note(ctx,x,y,w,title,body,a,o){o=o||{};const h=d5_noteH(ctx,w,title,body,o);if(a<=0.01)return h;const col=o.col||CY_LAMP,sz=o.size||30;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:14+12*(o.hi||0),ea:0.75,fill:o.fill||"rgba(20,16,12,0.92)"});if(title)T(ctx,title,x+28,y+52,{w:800,size:o.tsize||34,color:rgba(col,1)});
    wrapT(ctx,body,x+28,y+(title?92:30)+Math.round(sz*0.8),w-56,{size:sz,w:600,lh:Math.round(sz*1.3),color:rgba(INK,0.94)});});return h;}
// one of a factory's few numbers, day by day: the last day out of its range
const D5_IND=[0.52,0.56,0.5,0.58,0.53,0.49,0.57,0.54,0.51,0.59,0.55,0.88];
// the five numbers the engineers chose, on a sheet, each ringed as it's chosen; p (0..1) writes them
function d5_five(ctx,x,y,p,a){if(a<=0.01)return;withA(ctx,a,()=>{const w=300,h=286;sheet(ctx,x,y,w,h,{rot:0.012,fill:CY_PAPER});pencilText(ctx,"five numbers",x+28,y+54,{size:30,w:700,p:clamp(p*3,0,1)});
  for(let i=0;i<5;i++){const q=clamp(p*6-i-0.6,0,1);if(q<=0)continue;const yy=y+96+i*38;ctx.save();ctx.strokeStyle="rgba(52,48,46,0.75)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x+56,yy);ctx.lineTo(x+56+(90+hash(i,13)*110)*q,yy);ctx.stroke();ctx.restore();
    withA(ctx,q,()=>{ctx.save();ctx.strokeStyle="rgba(150,52,40,0.85)";ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x+36,yy,9,0,TAU*q);ctx.stroke();ctx.restore();});}});}
// the levels a warning could go to, in the hierarchy's place: the centre in Santiago at the top, the industry's committee at CORFO, and
// five factories, each with its manager. Drawn in its own frame (the caller moves there): o.cen, o.com, o.fac (0..1) bring in each level;
// o.warn(i) (0..1) a warning at factory i; o.mgr(i) (0..1) lights its manager; o.clock(i): {a, p, col, ok} the clock over it; o.flood
// (0..1) every warning sent to the centre; o.pile (0..1) the warnings piled on it; o.wait (0..1) the factories waiting; o.up(i) (0..1)
// a warning climbing from factory i to the committee
const D5_FX=[360,660,960,1260,1560],D5_FY=740,D5_FS=0.3,D5_CEN=[760,96,400],D5_COM=[620,300,680],D5_RED=[232,96,84],D5_MINT=[150,220,190];
function d5_hier(ctx,t,o){o=o||{};const cen=o.cen==null?1:o.cen,com=o.com==null?1:o.com,fac=o.fac==null?1:o.fac,fl=o.flood||0;
  // the lines between the levels, faint, in lamp-light
  withA(ctx,Math.min(com,fac)*(1-0.6*fl),()=>{ctx.save();ctx.strokeStyle=rgba(CY_LAMP,0.32);ctx.lineWidth=2;D5_FX.forEach((x,i)=>{ctx.beginPath();ctx.moveTo(x,606);ctx.lineTo(lerp(700,1220,i/4),424);ctx.stroke();});
    ctx.beginPath();ctx.moveTo(960,300);ctx.lineTo(960,220);ctx.stroke();ctx.restore();});
  d5_card(ctx,D5_CEN[0],D5_CEN[1],D5_CEN[2],"the centre","Santiago",cen,{hi:o.cenHi||0,col:mix(CY_LAMP,D5_RED,o.red||0)});
  d5_card(ctx,D5_COM[0],D5_COM[1],D5_COM[2],"that industry's committee","at CORFO",com,{hi:o.comHi||0});
  D5_FX.forEach((x,i)=>{daFactory(ctx,x,D5_FY,D5_FS,{lit:0.85,t:t+i*3,a:fac});const mh=o.mgr?o.mgr(i):0;daSil(ctx,x+100,D5_FY+14,124,{a:fac,dir:-1,rim:mix(CY_LAMP,[255,240,210],mh)});
    if(mh>0.01)glow(ctx,x+100,D5_FY-50,70,CY_LAMP,0.35*mh);
    const wq=o.warn?o.warn(i):0;if(wq>0.01){glow(ctx,x-40,600,34,CY_SIG,0.6*wq);withA(ctx,wq,()=>{ctx.fillStyle=rgba(CY_SIG,1);ctx.beginPath();ctx.arc(x-40,600,9,0,TAU);ctx.fill();ring(ctx,x-40,600,16+6*Math.sin(t*5),CY_SIG,0.6,2);});}
    const ck=o.clock?o.clock(i):null;if(ck&&ck.a>0.01){d5_clock(ctx,x,540,30,ck.p||0,ck.a,{col:ck.col||CY_LAMP});if(ck.ok>0.01)kt_gtick(ctx,x+44,520,13,ck.ok);}
    const wt=o.wait||0;if(wt>0.01)withA(ctx,wt,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.9);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x-14,520);ctx.lineTo(x+14,520);ctx.lineTo(x-14,562);ctx.lineTo(x+14,562);ctx.closePath();ctx.stroke();
      ctx.fillStyle=rgba(SOFT,0.6);ctx.beginPath();ctx.moveTo(x-7,556);ctx.lineTo(x+7,556);ctx.lineTo(x,546);ctx.closePath();ctx.fill();ctx.restore();});
    const up=o.up?o.up(i):0;if(up>0.01&&up<1){const ex=lerp(700,1220,i/4),u=ease(up),px=lerp(x,ex,u),py=lerp(606,428,u);ctx.save();ctx.strokeStyle=rgba(CY_SIG,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,606);ctx.lineTo(px,py);ctx.stroke();ctx.restore();
      glow(ctx,px,py,26,CY_SIG,0.7);ctx.fillStyle=rgba(CY_SIG,1);ctx.beginPath();ctx.arc(px,py,7,0,TAU);ctx.fill();}
    if(up>=1)withA(ctx,1,()=>{const ex=lerp(700,1220,i/4);ctx.save();ctx.strokeStyle=rgba(CY_SIG,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,606);ctx.lineTo(ex,428);ctx.stroke();ctx.restore();});});
  // every warning sent straight to the centre: dots from every factory, and the pile they make on it
  if(fl>0.01)D5_FX.forEach((x,k)=>{for(let n=0;n<4;n++){const u=((t*0.42+hash(k,n+3)+n/4)%1);if(u<0.04||u>0.96)continue;const q=fl*Math.sin(Math.PI*u),px=lerp(x,960,u)+Math.sin(u*Math.PI)*(k-2)*40,py=lerp(600,214,u);
    glow(ctx,px,py,18,CY_SIG,0.5*q);ctx.fillStyle=rgba(CY_SIG,q);ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();}});
  const pl=o.pile||0;if(pl>0.01){const n=Math.floor(pl*16);for(let j=0;j<n;j++){const px=990+hash(j,21)*124,py=178-hash(j,22)*44-(j%4)*5;ctx.save();ctx.translate(px,py);ctx.rotate((hash(j,23)-0.5)*0.5);
    ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=8;ctx.fillStyle=CY_PAPER;ctx.fillRect(-34,-8,68,16);ctx.shadowColor="transparent";ctx.fillStyle=rgba(CY_SIG,0.8);ctx.fillRect(-28,-3,22,6);ctx.restore();}}}

/* ---------- the utility: the platform's catalogue ---------- */
// the catalogue, at K: every table on the platform, a few named in rows with their owners on chips (grey for the data team, by default,
// gold for a business owner), and all 412 as small squares under them, 300 of them the data team's
const D5_KX=110,D5_KY=110,D5_KW=1380,D5_KH=700,D5_GREY=[150,150,160];
const D5_ROWS=[["hosting capacity",null,"Grace"],["daily readings",null,"Grace"],["accounts","head of retail","head of retail"],["outage events","Grace","Grace"],["contacts, copy 2",null,null]];
const D5_DT=(()=>{const idx=[...Array(412).keys()].sort((i,j)=>hash(i,57)-hash(j,57));return new Set(idx.slice(0,300));})();
const D5_ARCH=(()=>{const dt=[...D5_DT].sort((i,j)=>hash(i,61)-hash(j,61));return new Set(dt.slice(0,54));})();
// an owner's chip: gold for a business owner, grey for the data team by default; o.mix (0..1) turns a grey chip gold, to o.to's name
function d5_chip(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,m=o.mix||0,nm=m>0.5&&o.to?o.to:name,biz=o.biz||m>0.5,col=biz?TRUST:D5_GREY,w=tw(ctx,nm,28,700)+56;if(a<=0.01)return w;
  withA(ctx,a,()=>{glass(ctx,x,y-25,w,50,25,col,{glow:8+12*(o.hi||0),ea:0.8,fill:"rgba(14,13,12,0.95)"});archGlyph(ctx,"role",x+26,y,9,col);T(ctx,nm,x+44,y+10,{w:700,size:28,color:rgba(mix(col,INK,0.35),1)});
    if(o.strike>0.01){ctx.save();ctx.strokeStyle=rgba(D5_RED,o.strike);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+8,y);ctx.lineTo(x+8+(w-16)*o.strike,y);ctx.stroke();ctx.restore();}});return w;}
// o.rows (0..1) writes the rows in; o.grid (0..1) the squares; o.dtHi (0..1) lights the data team's; o.claim (0..1) turns the claimed
// ones gold; o.arch (0..1) sends the 54 nobody claimed to the archive; o.count (0..1) the counts under them; o.hiRow(i) lights row i
function d5_catalogue(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const x=D5_KX,y=D5_KY,cl=o.claim||0,ar=o.arch||0;withA(ctx,a,()=>{
  glass(ctx,x,y,D5_KW,D5_KH,20,DAC,{glow:14,ea:0.8,fill:"rgba(8,10,18,0.95)"});T(ctx,"catalogue · every table on the platform",x+36,y+52,{f:"mono",w:500,size:28,color:rgba(DAC,1)});
  T(ctx,"table",x+40,y+104,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});T(ctx,"owner",x+760,y+104,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});
  D5_ROWS.forEach(([nm,own,to],i)=>{const q=o.rows==null?1:clamp(o.rows*D5_ROWS.length-i,0,1);if(q<=0.01)return;const ry=y+160+i*60,hi=o.hiRow?o.hiRow(i):0;
    withA(ctx,q,()=>{if(hi>0.01){ctx.fillStyle=rgba(TRUST,0.08*hi);rr(ctx,x+20,ry-28,D5_KW-40,56,10);ctx.fill();}
      const gone=to==null?ar:0;withA(ctx,1-0.6*gone,()=>T(ctx,nm,x+40,ry+10,{w:700,size:30,color:rgba(INK,0.95)}));
      if(own)d5_chip(ctx,x+760,ry,own,{biz:true});else d5_chip(ctx,x+760,ry,"data team",{mix:to?cl:0,to,strike:to?0:ar,hi:(o.dtHi||0)});});});
  // all 412 tables, as small squares: grey the data team's, gold the business owners'
  const gx=x+40,gy=y+478,n=412,cols=59,sp=21,gp=o.grid==null?1:o.grid;
  for(let i=0;i<n;i++){const q=clamp(gp*1.3-i/n*0.3,0,1)*clamp(gp*n/40-i/40,0,1);if(q<=0.01)continue;const dt=D5_DT.has(i),arc=D5_ARCH.has(i),cx=gx+(i%cols)*sp,cy=gy+Math.floor(i/cols)*sp;
    const c=dt?(arc?D5_GREY:mix(D5_GREY,TRUST,cl)):TRUST,al=q*(dt&&arc?1-0.75*ar:1)*(dt?0.75+0.25*(o.dtHi||0):0.9);ctx.fillStyle=rgba(c,al);rr(ctx,cx,cy,15,15,3);ctx.fill();}
  const ct=o.count||0;if(ct>0.01)withA(ctx,ct,()=>{T(ctx,"412 tables",x+40,y+672,{w:800,size:30,color:rgba(INK,0.96)});const s="300 owned by the data team, by default";d5_chip(ctx,x+240,y+662,s,{hi:o.dtHi||0});});
  const cc=o.claimed||0;if(cc>0.01)withA(ctx,cc,()=>{ctx.fillStyle="rgba(8,10,18,0.96)";ctx.fillRect(x+30,y+630,D5_KW-60,64);T(ctx,"246 claimed, in 31 data products",x+40,y+672,{w:800,size:30,color:rgba(mix(TRUST,INK,0.3),1)});
    withA(ctx,fin(cc,0.5,0.5),()=>T(ctx,"54 archived",x+760,y+672,{w:700,size:30,color:rgba(SOFT,0.95)}));});});}

/* ---------- 2. Owned by default ---------- */
// the table, on a card of glass in the catalogue: its name, its owner's chip and the method it was built from; o.own (0..1) turns its
// owner from the data team to Grace; o.ver: the method's version, o.bad (0..1) marks it out of date
function d5_table(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||520,h=250;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,DAC,{glow:12+14*(o.hi||0),ea:0.8,fill:"rgba(8,10,18,0.95)"});
  T(ctx,"catalogue",x+28,y+46,{f:"mono",w:500,size:28,color:rgba(DAC,1)});T(ctx,o.name||"hosting capacity",x+28,y+96,{w:800,size:34,color:rgba(INK,0.97)});
  T(ctx,"owner",x+28,y+156,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});d5_chip(ctx,x+160,y+148,"data team",{mix:o.own||0,to:"Grace",hi:o.ownHi||0});
  T(ctx,"method",x+28,y+214,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});const v=o.ver||"v1",bad=o.bad||0,vc=mix(INFC,D5_RED,bad),vm=o.vmix||0;  // o.vmix (0..1): the version leaves, then o.ver2 comes in
  withA(ctx,1-clamp(vm*2,0,1),()=>tag(ctx,x+160,y+206,v,vc,{size:28}));if(vm>0.5)withA(ctx,clamp(vm*2-1,0,1),()=>tag(ctx,x+160,y+206,o.ver2,TRUST,{size:28}));
  if(bad>0.01)withA(ctx,bad,()=>T(ctx,"out of date",x+160+tw(ctx,v,28,700)+50,y+214,{w:700,size:28,color:rgba(D5_RED,1)}));});}
// the engineers' method, on paper: how hosting capacity is worked out, and its version; o.v2 (0..1) turns it to the new one, o.v3 to
// the one after
function d5_method(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=500,h=200;if(a<=0.01)return;const v2=o.v2||0,v3=o.v3||0;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:-0.01,plain:true});
  T(ctx,"engineers' method",x+28,y+52,{w:800,size:30,color:"rgba(52,48,46,0.95)"});
  withA(ctx,1-v2,()=>{T(ctx,"cable and voltage limits",x+28,y+104,{w:600,size:28,color:"rgba(70,64,60,0.95)"});tag(ctx,x+28,y+156,"v1",INFC,{size:28});});
  withA(ctx,v2*(1-v3),()=>{T(ctx,"older cables carry less",x+28,y+104,{w:700,size:28,color:"rgba(150,52,40,0.95)"});tag(ctx,x+28,y+156,"v2",TRUST,{size:28});});
  withA(ctx,v3,()=>{T(ctx,"home batteries counted",x+28,y+104,{w:700,size:28,color:"rgba(52,104,66,0.95)"});tag(ctx,x+28,y+156,"v3",TRUST,{size:28});});});}
// the website, on a laptop: "can my street take solar?", and a map of streets, each coloured by the room the table says it has: green,
// room; amber, a little; o.wrong (0..1) rings the streets that show room they don't have; o.fix (0..1) shows them as they should be
const D5_STREETS=[[[40,70],[460,90]],[[60,150],[440,130]],[[90,40],[120,250]],[[210,30],[230,250]],[[330,40],[300,250]],[[400,60],[440,240]],[[40,210],[460,230]]];
const D5_WRONG=[1,3,5];
function d5_site(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=520,h=400;if(a<=0.01)return;const wr=o.wrong||0,fx=o.fix||0;withA(ctx,a,()=>{
  ctx.save();ctx.fillStyle="#1d2028";rr(ctx,x-24,y+h,w+48,22,8);ctx.fill();ctx.restore();glass(ctx,x,y,w,h,14,[200,206,220],{glow:10,ea:0.7,fill:"rgba(10,12,18,0.97)"});
  ctx.fillStyle="rgba(255,255,255,0.06)";ctx.fillRect(x+2,y+2,w-4,40);[0,1,2].forEach(i=>{ctx.fillStyle=rgba([[232,96,84],[240,190,90],[120,200,130]][i],0.8);ctx.beginPath();ctx.arc(x+22+i*20,y+22,6,0,TAU);ctx.fill();});
  T(ctx,"Can my street take solar?",x+26,y+84,{w:800,size:30,color:rgba(INK,0.96)});
  const mx=x+30,my=y+108;ctx.save();ctx.fillStyle="rgba(30,34,40,0.9)";rr(ctx,mx-10,my-6,w-40,268,10);ctx.fill();ctx.restore();
  D5_STREETS.forEach(([[x0,y0],[x1,y1]],i)=>{const bad=D5_WRONG.includes(i),c=bad?mix([120,210,130],[240,170,80],fx):(i%3===2?[240,190,90]:[120,210,130]);ctx.save();ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=9;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(mx+x0*0.98,my+y0);ctx.lineTo(mx+x1*0.98,my+y1);ctx.stroke();ctx.restore();
    if(bad&&wr>0.01){const cx=mx+(x0+x1)/2*0.98,cy=my+(y0+y1)/2;ring(ctx,cx,cy,24,D5_RED,wr,3);}});});}
// ninety families' homes, each a small roof with a panel on it; p (0..1) brings them in; o.part (0..1) shows each sending back only part
function d5_homes(ctx,x,y,p,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const pt=o.part||0;for(let i=0;i<90;i++){const q=clamp(p*90/12-i/12,0,1);if(q<=0.01)continue;const cx=x+(i%15)*36,cy=y+Math.floor(i/15)*34;
  withA(ctx,q,()=>{ctx.fillStyle="#3a3236";ctx.beginPath();ctx.moveTo(cx-14,cy);ctx.lineTo(cx,cy-12);ctx.lineTo(cx+14,cy);ctx.closePath();ctx.fill();ctx.fillStyle="#c9bfa8";ctx.fillRect(cx-11,cy,22,14);
    ctx.fillStyle=rgba([90,130,190],1);ctx.save();ctx.translate(cx-4,cy-6);ctx.rotate(-0.7);ctx.fillRect(-6,-3,12,5);ctx.restore();
    if(pt>0.01){ctx.fillStyle=rgba(TRUST,0.9*pt);ctx.fillRect(cx+9,cy-10,3,8*(1-0.5*pt));}});}});}

/* ---------- 3. The business that knows ---------- */
// a data product, as a gold card in the business layer with ArchiMate's product glyph; o.owner: its owner's chip under it
function d5_prod(ctx,x,y,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const col=o.col||BUSC;glass(ctx,x,y,w,h,8,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(12,10,6,0.95)"});
  ctx.fillStyle=rgba(col,0.14+0.1*(o.hi||0));rr(ctx,x,y,w,h,8);ctx.fill();d5_glyph(ctx,"product",x+w-30,y+24,14,col);const sz=o.size||30,ls=wrapT(ctx,name,0,0,w-80,{size:sz,w:700,measure:true});
  wrapT(ctx,name,x+w/2-10,y+h/2+sz*0.36-(ls.length-1)*sz*0.58,w-80,{size:sz,w:700,align:"center",color:rgba(INK,0.96),lh:sz*1.15});
  if(o.kicker)T(ctx,o.kicker,x+20,y-14,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.2),0.95)});});}

/* ---------- 4. Data as a product ---------- */
// the five things a product has before it's published, each a row with its name, what it says for hosting capacity, and a tick as
// it's said: o.p(i) (0..1) row i; o.hiR(i) lights it
const D5_FIVE=[["owner","Grace · network operations"],["documentation","what it means, and how it's worked out"],["lineage","from the network map's cables"],
  ["contract","fresh every Monday; a new method, a new version"],["access","asked for in the catalogue; the owner decides"]];
function d5_productCard(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=1060,h=620;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,BUSC,{glow:16+12*(o.hi||0),ea:0.85,fill:"rgba(12,10,6,0.96)"});
  T(ctx,"data product",x+36,y+52,{f:"mono",w:500,size:28,color:rgba(BUSC,1)});d5_glyph(ctx,"product",x+w-46,y+42,18,BUSC);T(ctx,"hosting capacity",x+36,y+112,{w:800,size:44,color:rgba(INK,0.98)});
  // o.keys (0..1) shows the five things' names, faint, before each is said
  D5_FIVE.forEach(([k,v],i)=>{const q=o.p?o.p(i):1,kk=Math.max(q,0.5*(o.keys||0)),ry=y+190+i*86,hi=o.hiR?o.hiR(i):0;if(kk<=0.01)return;
    if(hi>0.01&&q>0.01)withA(ctx,q,()=>{ctx.fillStyle=rgba(TRUST,0.07*hi);rr(ctx,x+20,ry-34,w-40,70,12);ctx.fill();});
    withA(ctx,kk,()=>{ctx.save();ctx.strokeStyle=rgba(BUSC,0.55);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+52,ry,14,0,TAU);ctx.stroke();ctx.restore();
      T(ctx,k,x+86,ry+10,{f:"mono",w:500,size:28,color:rgba(mix(BUSC,INK,0.25+0.4*hi),1)});});
    if(q>0.01)withA(ctx,q,()=>{kt_gtick(ctx,x+52,ry,14,clamp(q*1.4-0.3,0,1));T(ctx,v,x+330,ry+10,{w:700,size:30,color:rgba(INK,0.95)});});});});}
// the one catalogue's list of products, each with its owner's chip; p (0..1) writes them in
const D5_PRODS=[["hosting capacity","Grace"],["accounts","head of retail"],["locations","Grace"],["minutes without power","Ama"]];
function d5_prodList(ctx,x,y,p,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=640,h=96+D5_PRODS.length*66+20;glass(ctx,x,y,w,h,18,DAC,{glow:12,ea:0.8,fill:"rgba(8,10,18,0.95)"});
  T(ctx,"the one catalogue",x+30,y+50,{f:"mono",w:500,size:28,color:rgba(DAC,1)});D5_PRODS.forEach(([nm,own],i)=>{const q=clamp(p*D5_PRODS.length-i,0,1);if(q<=0.01)return;const ry=y+112+i*66;
    withA(ctx,q,()=>{d5_glyph(ctx,"product",x+44,ry,12,BUSC);T(ctx,nm,x+72,ry+10,{w:700,size:30,color:rgba(INK,0.95)});const cw=tw(ctx,own,28,700)+56;d5_chip(ctx,x+w-30-cw,ry,own,{biz:true});});});});}

/* ---------- 5. Four words ---------- */
// one of the four words, on a card: its name, a small picture of it, two lines on what it is (o.full, 0..1, as its line is said), and the
// question it answers, on a chip (o.qa)
const D5_STYLES=[["warehouse","one store, modelled for reports","usually one central team","where is it kept?"],["lakehouse","open files, with tables and controls on top","reports and machine learning alike","where is it kept?"],
  ["mesh","each domain owns its data, as products","one self-serve platform, rules agreed","who owns it?"],["fabric","metadata finds, connects and governs","across many stores, automated","how is it found?"]];
const D5_SW=420,D5_SH=640,D5_SXS=[60,520,980,1440];
function d5_style(ctx,k,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[nm,l1,l2,q]=D5_STYLES[k],col=k===2?TRUST:k===3?[196,160,255]:INFC;withA(ctx,a*(1-0.55*(o.dim||0)),()=>{
  glass(ctx,x,y,D5_SW,D5_SH,20,col,{glow:12+14*(o.hi||0),ea:0.8,fill:"rgba(8,10,18,0.95)"});T(ctx,nm,x+D5_SW/2,y+64,{w:800,size:40,align:"center",color:rgba(mix(col,INK,0.3),1)});
  const cx=x+D5_SW/2,cy=y+216;ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.fillStyle=rgba(col,0.18);ctx.lineWidth=3;ctx.lineJoin="round";
  if(k===0){ctx.beginPath();ctx.moveTo(cx-130,cy+80);ctx.lineTo(cx-130,cy-30);ctx.lineTo(cx,cy-96);ctx.lineTo(cx+130,cy-30);ctx.lineTo(cx+130,cy+80);ctx.closePath();ctx.fill();ctx.stroke();
    for(let r=0;r<3;r++){ctx.beginPath();ctx.moveTo(cx-104,cy-8+r*32);ctx.lineTo(cx+104,cy-8+r*32);ctx.stroke();for(let b=0;b<5;b++){ctx.fillStyle=rgba(col,0.55);ctx.fillRect(cx-96+b*40,cy-30+r*32,28,20);}}}
  else if(k===1){for(let i=0;i<5;i++){const fx=cx-120+i*52,fy=cy+40;ctx.fillStyle=rgba(col,0.2);ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+30,fy);ctx.lineTo(fx+40,fy+10);ctx.lineTo(fx+40,fy+52);ctx.lineTo(fx,fy+52);ctx.closePath();ctx.fill();ctx.stroke();}
    ctx.fillStyle=rgba(col,0.14);rr(ctx,cx-140,cy-96,280,104,10);ctx.fill();ctx.stroke();for(let r=1;r<3;r++){ctx.beginPath();ctx.moveTo(cx-140,cy-96+r*35);ctx.lineTo(cx+140,cy-96+r*35);ctx.stroke();}
    for(let c=1;c<4;c++){ctx.beginPath();ctx.moveTo(cx-140+c*70,cy-96);ctx.lineTo(cx-140+c*70,cy+8);ctx.stroke();}}
  else if(k===2){ctx.fillStyle=rgba(col,0.12);rr(ctx,cx-150,cy+50,300,36,10);ctx.fill();ctx.stroke();const N=[[cx-96,cy-40],[cx+96,cy-40],[cx,cy-104+18]];
    ctx.beginPath();N.forEach(([a1,b1],i)=>{const[a2,b2]=N[(i+1)%3];ctx.moveTo(a1,b1);ctx.lineTo(a2,b2);});ctx.stroke();N.forEach(([nx,ny])=>{ctx.fillStyle="rgba(10,10,14,1)";ctx.beginPath();ctx.arc(nx,ny,32,0,TAU);ctx.fill();ctx.stroke();d5_glyph(ctx,"product",nx,ny,13,col);
      ctx.beginPath();ctx.moveTo(nx,ny+32);ctx.lineTo(nx,cy+50);ctx.stroke();});}
  else{const P=[[cx-120,cy-60],[cx+120,cy-60],[cx-120,cy+60],[cx+120,cy+60]];ctx.setLineDash([6,6]);ctx.beginPath();P.forEach(([a1,b1],i)=>P.forEach(([a2,b2],j)=>{if(j>i){ctx.moveTo(a1,b1);ctx.lineTo(a2,b2);}}));ctx.stroke();ctx.setLineDash([]);
    P.forEach(([px,py])=>{ctx.fillStyle="rgba(10,10,14,1)";ctx.beginPath();ctx.ellipse(px,py-16,30,10,0,0,TAU);ctx.fill();ctx.fillRect(px-30,py-16,60,34);ctx.beginPath();ctx.ellipse(px,py+18,30,10,0,0,TAU);ctx.fill();
      ctx.beginPath();ctx.ellipse(px,py-16,30,10,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(px-30,py-16);ctx.lineTo(px-30,py+18);ctx.moveTo(px+30,py-16);ctx.lineTo(px+30,py+18);ctx.stroke();ctx.beginPath();ctx.ellipse(px,py+18,30,10,0,0,Math.PI);ctx.stroke();});
    // at the centre, a label: the metadata that finds and connects the stores (a drawn label, not a letter, so it isn't read as mesh)
    ctx.fillStyle="rgba(10,10,14,1)";ctx.beginPath();ctx.arc(cx,cy,26,0,TAU);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-15,cy);ctx.lineTo(cx-5,cy-10);ctx.lineTo(cx+14,cy-10);ctx.lineTo(cx+14,cy+10);ctx.lineTo(cx-5,cy+10);ctx.closePath();ctx.fillStyle=rgba(col,0.35);ctx.fill();ctx.stroke();
    ctx.fillStyle="rgba(10,10,14,1)";ctx.beginPath();ctx.arc(cx-4,cy,3,0,TAU);ctx.fill();}
  ctx.restore();
  withA(ctx,o.full==null?1:o.full,()=>{wrapT(ctx,l1,x+D5_SW/2,y+384,D5_SW-56,{size:30,w:700,align:"center",lh:38,color:rgba(INK,0.95)});wrapT(ctx,l2,x+D5_SW/2,y+478,D5_SW-56,{size:28,w:600,align:"center",lh:36,color:rgba(SOFT,0.95)});});
  withA(ctx,o.qa==null?1:o.qa,()=>tag(ctx,x+D5_SW/2,y+D5_SH-46,q,mix(col,INK,0.15),{align:"center",size:28}));});}

/* ---------- 6. The target and its gaps ---------- */
// a panel: the baseline, as it is, or the target, as it should be; its rows written in as o.p(i) goes to 1; o.hiR(i) lights row i
function d5_panel(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a,h=110+rows.length*100;if(a<=0.01)return h;const col=o.col||DAC;withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,col,{glow:12+12*(o.hi||0),ea:0.8,fill:"rgba(8,10,18,0.95)"});
  T(ctx,title,x+32,y+56,{w:800,size:36,color:rgba(mix(col,INK,0.25),1)});rows.forEach((r,i)=>{const q=o.p?o.p(i):1;if(q<=0.01)return;const ry=y+130+i*100,hi=o.hiR?o.hiR(i):0;
    withA(ctx,q,()=>{if(hi>0.01){ctx.fillStyle=rgba(col,0.09*hi);rr(ctx,x+16,ry-30,w-32,92,12);ctx.fill();}ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.arc(x+40,ry,6,0,TAU);ctx.fill();
      wrapT(ctx,r,x+64,ry+10,w-96,{size:30,w:700,lh:38,color:rgba(INK,0.95)});});});});return h;}
// the roadmap: a line through four quarters, and each gap on it as a card with its owner, in the quarter it's closed; o.p(i) brings in item i
const D5_QS=["Q1","Q2","Q3","Q4"],D5_ROAD=[["claim the tables","each domain",0,0],["hosting capacity","Grace",0,1],["most-read products","their owners",1,1],["every product's contract","their owners",2,0]];
function d5_road(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const qw=w/4;ctx.save();ctx.strokeStyle=rgba(INK,0.6);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.stroke();ctx.restore();
  D5_QS.forEach((s,i)=>{ctx.fillStyle=rgba(INK,0.8);ctx.beginPath();ctx.arc(x+i*qw,y,6,0,TAU);ctx.fill();T(ctx,s,x+i*qw+16,y-16,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});});
  D5_ROAD.forEach(([nm,own,qi,row],i)=>{const q=o.p?o.p(i):1;if(q<=0.01)return;const cx=x+qi*qw+12,cy=y+28+row*96,cw=Math.max(tw(ctx,nm,28,800),tw(ctx,own,28,600))+48;
    withA(ctx,q,()=>{glass(ctx,cx,cy,cw,84,14,TRUST,{glow:10+12*(o.hiI?o.hiI(i):0),ea:0.8,fill:"rgba(14,12,8,0.95)"});T(ctx,nm,cx+24,cy+36,{w:800,size:28,color:rgba(INK,0.96)});T(ctx,own,cx+24,cy+72,{w:600,size:28,color:rgba(mix(TRUST,INK,0.35),1)});});});});}
// the archive: a box the tables nobody claimed go into, with its label; o.fill (0..1) how many have gone in; o.ret (0..1) retired
function d5_archive(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const w=300,h=150;ctx.save();ctx.fillStyle="rgba(40,36,32,0.95)";ctx.strokeStyle=rgba(SOFT,0.9);ctx.lineWidth=2.4;
  ctx.beginPath();ctx.moveTo(x,y+30);ctx.lineTo(x+w,y+30);ctx.lineTo(x+w-16,y+h);ctx.lineTo(x+16,y+h);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle="rgba(60,54,48,0.98)";rr(ctx,x-8,y+8,w+16,30,6);ctx.fill();ctx.stroke();ctx.restore();
  const n=Math.floor((o.fill||0)*18);for(let i=0;i<n;i++){ctx.fillStyle=rgba(D5_GREY,0.7);rr(ctx,x+30+(i%9)*28,y+60+Math.floor(i/9)*26,18,18,3);ctx.fill();}
  T(ctx,o.ret>0.5?"archived, then retired":"archived",x+w/2,y+h+40,{w:700,size:28,align:"center",color:rgba(SOFT,0.95)});});}

/* ---------- 7. On the map ---------- */
// the data practice on the map, at M: the business layer, its domains as groupings, each with its concepts (from Business architecture
// for data) and now its data products; the enterprise domain joins; hosting capacity's product brings together its contract and its
// data, in the information layer below; and the catalogue's tables, each pointing to its product
const D5_GR=[["network",[132,176,255],60,["connection point","meter reading","hosting capacity"],"Grace"],["retail",[255,150,186],560,["account","bill"],"head of retail"],
  ["shared",[120,206,226],1000,["location"],"Grace"],["enterprise",[196,160,255],1380,[],"Ama","measures that cross domains"]];
const D5_GW=[460,400,340,480],D5_MPY=412,D5_MPH=84;
// o.band, o.groups, o.concepts, o.owners, o.ent (0..1) bring them in; o.same (0..1) lets the map's label leave; o.p0 to o.p3 (0..1) the
// products, in a row under the concepts; o.agg (0..1) hosting capacity's contract and data; o.point (0..1) the tables pointing to their products
function d5_map(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  withA(ctx,o.band==null?1:o.band,()=>{withA(ctx,1-(o.same||0),()=>tag(ctx,960,62,"the data practice on the map",DAC,{align:"center",size:30}));
    ctx.save();ctx.fillStyle=rgba(BUSC,0.06);ctx.strokeStyle=rgba(BUSC,0.5);ctx.lineWidth=2;rr(ctx,30,100,1860,560,18);ctx.fill();ctx.stroke();ctx.restore();tag(ctx,54,100,"business",BUSC,{size:28});
    ctx.save();ctx.fillStyle=rgba(INFC,0.06);ctx.strokeStyle=rgba(INFC,0.5);ctx.lineWidth=2;rr(ctx,30,690,1860,160,18);ctx.fill();ctx.stroke();ctx.restore();tag(ctx,54,690,"information",INFC,{size:28});});
  D5_GR.forEach(([nm,col,gx,cs,own,sub],gi)=>{const ga=gi===3?(o.ent||0):(o.groups==null?1:o.groups);if(ga<=0.01)return;const gw=D5_GW[gi],gy=130,gh=500;
    withA(ctx,ga,()=>{ctx.save();ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2.5;rr(ctx,gx,gy,gw,gh,14);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=rgba(col,0.05);rr(ctx,gx,gy,gw,gh,14);ctx.fill();ctx.restore();
      T(ctx,nm,gx+20,gy+40,{w:800,size:30,color:rgba(col,1)});
      if(sub)T(ctx,sub,gx+20,gy+86,{w:600,size:28,color:rgba(mix(col,INK,0.45),0.96)});
      cs.forEach((c,ci)=>{const cy=gy+64+ci*70;daBO(ctx,gx+20,cy,gw-40,58,c,{size:28,a:o.concepts==null?1:o.concepts});});
      const ow=tw(ctx,own,28,700)+56;d5_chip(ctx,gx+gw-20-ow,gy+30,own,{biz:true,a:o.owners==null?1:o.owners});});});
  // the data products, one in each domain, in a row under the concepts
  const P=[[0,"hosting capacity",o.p0||0],[1,"accounts",o.p1||0],[2,"locations",o.p2||0],[3,"minutes without power",o.p3||0]];
  P.forEach(([gi,nm,q])=>{if(q<=0.01)return;const gx=D5_GR[gi][2],gw=D5_GW[gi];const k=spring(q*1.2);ctx.save();ctx.translate(0,(1-k)*-12);
    d5_prod(ctx,gx+20,D5_MPY,gw-40,D5_MPH,nm,{a:clamp(q*2,0,1),hi:gi===0?(o.prodHi||0):0});ctx.restore();});
  // hosting capacity's product brings together its contract, under it, and its data, in the information layer: ArchiMate's
  // aggregation, a line with a hollow diamond where it meets the product
  const ag=o.agg||0;if(ag>0.01){const px=60+20,pw=D5_GW[0]-40,pb=D5_MPY+D5_MPH;withA(ctx,ag,()=>{archEl(ctx,px,pb+20,Math.round(pw*0.62),70,"its contract",BUSC,"contract",{size:28});
    daDO(ctx,px,720,pw,110,"hosting capacity","lakehouse",{size:30,hi:o.doHi||0});
    const dia=(x0,y0,y1)=>{ctx.save();ctx.strokeStyle=rgba(BUSC,0.9);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x0,y0+12);ctx.lineTo(x0,y1);ctx.stroke();ctx.fillStyle="rgba(12,10,6,1)";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0+8,y0+6);ctx.lineTo(x0,y0+12);ctx.lineTo(x0-8,y0+6);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();};
    dia(px+Math.round(pw*0.31),pb,pb+20);dia(px+Math.round(pw*0.82),pb,720);});}
  // the catalogue's tables, each pointing to its product: retail's under accounts, the shared domain's under locations, the enterprise
  // domain's under its measure
  const pt=o.point||0;if(pt>0.01)withA(ctx,pt,()=>{const xs=[680,760,840,1130,1210,1500,1580,1660,1740],pb=D5_MPY+D5_MPH;xs.forEach((x,i)=>{const q=clamp(pt*xs.length-i,0,1);if(q<=0.01)return;withA(ctx,q,()=>{ctx.fillStyle=rgba(D5_GREY,0.25);ctx.strokeStyle=rgba(DAC,0.9);ctx.lineWidth=2;rr(ctx,x-26,752,52,40,6);ctx.fill();ctx.stroke();
      for(let r=0;r<3;r++){ctx.fillStyle=rgba(DAC,0.7);ctx.fillRect(x-18,760+r*10,36,3);}arrowTo(ctx,x,748,x,pb+8,DAC,0.75,{p:clamp(q*1.4,0,1),lw:2,head:9,dash:[5,6]});});});
    T(ctx,"catalogue",985,782,{f:"mono",w:500,size:28,align:"center",color:rgba(DAC,1)});});});}
