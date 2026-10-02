/* ===== An agent on the team: the film's own pictures (prefixed ag_) =====
   England, 1766: the Nautical Almanac, its pages of figures, instructions posted across a map of England, two quills far
   apart, a comparer's desk and a pencil, and a wooden press. Drawn as materials: laid paper with a curl and a shadow side,
   goose quills with barbs, an oak desk with its grain, a cedar pencil, a press of oak and iron.
   The present: the series' dark glass. Code cards carry the label that says where they run; teal is the AI agent's work,
   gold a person's approval; red a test that stopped something, green one that passed, amber a warning. */

const AG_DUCK="runs on dbt Core · DuckDB",AG_DBX="Databricks only",AG_DRAFT="the agent's draft · never merged";
const AG_AMB=[255,200,70],AG_RED=BAD,AG_GRN=GOOD,AG_PLN=[255,170,110],AG_INK="rgba(52,36,24,0.92)",AG_GREY=[150,160,178];

/* ---------- code, as files: names and labels at 18 px, code at 18 px or more ---------- */
// a file card with the label that says where it runs; lines type out as p goes 0..1.
// o.lit {i:0..1} highlights a line (o.litCol); o.lineCol {i:colour}; o.strike {i:0..1} strikes a line through in red;
// o.dim {i:0..1} fades a line; o.diff colours "+" lines teal and "-" lines red; o.label overrides the label ("" for none).
function ag_code(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||18,lh=o.lh||Math.round(sz*1.5),col=o.edge||[170,205,255];
  const lab=o.label===undefined?AG_DUCK:o.label,draft=!!o.draft||lab===AG_DRAFT,dbx=lab===AG_DBX,lc=draft?AG_AMB:dbx?[150,176,214]:WEED,nw=tw(ctx,name,18,500,"mono"),lw=lab?tw(ctx,lab,18,700)+28:0,two=!!lab&&nw+lw+64>w,hh=two?88:56,h=o.h||(hh+18+lines.length*lh);
  if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12+10*(o.hi||0),ea:0.65,fill:"rgba(6,10,20,0.96)"});
    if(draft){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG_AMB,0.75);ctx.lineWidth=2;rr(ctx,x-7,y-7,w+14,h+14,18);ctx.stroke();ctx.restore();}
    ctx.fillStyle=rgba(col,0.9);rr(ctx,x+18,y+22,10,10,3);ctx.fill();T(ctx,name,x+38,y+34,{f:"mono",w:500,size:18,color:rgba(col,1)});
    if(lab){const lx=two?x+38:x+w-16-lw,ly=two?y+68:y+28,pa=o.labA==null?1:o.labA;withA(ctx,pa,()=>{if(o.labHi)glow(ctx,lx+lw/2,ly,lw*0.6,lc,0.35*o.labHi);ctx.fillStyle="rgba(8,14,24,0.95)";rr(ctx,lx,ly-15,lw,30,15);ctx.fill();
      ctx.save();if(draft)ctx.setLineDash([5,4]);ctx.strokeStyle=rgba(lc,0.8);ctx.lineWidth=1.5;rr(ctx,lx,ly-15,lw,30,15);ctx.stroke();ctx.restore();T(ctx,lab,lx+14,ly+6,{w:700,size:18,color:rgba(lc,1)});});}
    ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+hh-6,w-28,1.2);
    const n=o.p==null?lines.length:lines.length*o.p;lines.forEach((l,i)=>{if(i>=n)return;const yy=y+hh+12+lh*0.72+i*lh,q=clamp(n-i,0,1),cm=/^\s*(--|#|<!--)/.test(l),on=o.lit?o.lit[i]||0:0,dm=o.dim?o.dim[i]||0:0;
      let lc2=o.lineCol&&o.lineCol[i];if(!lc2&&o.diff){if(/^\+/.test(l))lc2=KT_AI;else if(/^-/.test(l))lc2=[255,150,140];}
      withA(ctx,1-0.75*dm,()=>{if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.17);rr(ctx,x+10,yy-lh*0.74,w-20,lh*0.98,6);ctx.fill();});
        T(ctx,typeOn(l,q),x+22,yy,{f:"mono",w:500,size:sz,color:lc2?rgba(lc2,1):cm?rgba(SOFT,0.85):rgba(mix([205,225,255],o.litCol||TRUST,on*0.55),0.96)});
        const st=o.strike?o.strike[i]||0:0;if(st>0){const lw2=tw(ctx,l,sz,500,"mono");ctx.save();ctx.strokeStyle=rgba(AG_RED,1);ctx.lineWidth=3;ctx.shadowColor=rgba(AG_RED,0.6);ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(x+18,yy-sz*0.32);ctx.lineTo(x+18+(lw2+8)*ease(st),yy-sz*0.32);ctx.stroke();ctx.restore();}});});});
  return h;}
function ag_codeH(ctx,w,name,n,o){o=o||{};const sz=o.size||18,lh=o.lh||Math.round(sz*1.5),lab=o.label===undefined?AG_DUCK:o.label,two=!!lab&&tw(ctx,name,18,500,"mono")+tw(ctx,lab,18,700)+28+64>w;return (two?88:56)+18+n*lh;}
// a short label on its own dark pill (tag at 20 px by default)
function ag_tag(ctx,x,y,s,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>tag(ctx,x,y,s,col,{align:o.align||"center",size:o.size||20}));}
// a person's name and role, at sizes that read at 1920x1080
function ag_role(ctx,x,y,id,a,o){o=o||{};withA(ctx,a==null?1:a,()=>{const P=PEOPLE[id];T(ctx,o.name||P.name.split(" ")[0],x,y,{w:800,size:24,align:"center"});T(ctx,o.role||P.role,x,y+27,{w:600,size:18,align:"center",color:rgba(SOFT,1)});});}
// Planning, a consumer: three people, head and shoulders, softly drawn in the consumer's colour, breathing a little
function ag_team(ctx,x,y,s,col,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  [[-46,6,0.86,1],[46,6,0.86,2],[0,0,1,0]].forEach(([dx,dy,k,i])=>{const b=Math.sin(t*1.6+i*1.3)*1.2,cx=x+dx*s,cy=y+dy*s+b*s,r=24*s*k,skin=[[214,170,140],[150,104,78],[232,196,168]][i];
    ctx.save();const g=ctx.createLinearGradient(cx-50*s*k,cy,cx+50*s*k,cy+80*s*k);g.addColorStop(0,rgba(mix(col,[255,255,255],0.15),1));g.addColorStop(1,rgba(mix(col,[10,14,30],0.55),1));ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(cx-52*s*k,cy+84*s*k);ctx.bezierCurveTo(cx-54*s*k,cy+40*s*k,cx-34*s*k,cy+22*s*k,cx,cy+22*s*k);ctx.bezierCurveTo(cx+34*s*k,cy+22*s*k,cx+54*s*k,cy+40*s*k,cx+52*s*k,cy+84*s*k);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;ctx.stroke();
    const hg=ctx.createRadialGradient(cx-r*0.35,cy-r*0.4,r*0.2,cx,cy,r*1.1);hg.addColorStop(0,rgba(mix(skin,[255,255,255],0.18),1));hg.addColorStop(1,rgba(mix(skin,[40,24,16],0.35),1));ctx.fillStyle=hg;
    ctx.beginPath();ctx.ellipse(cx,cy,r*0.86,r,0,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle=["rgba(40,28,22,0.95)","rgba(20,16,18,0.95)","rgba(150,110,60,0.95)"][i];ctx.beginPath();ctx.ellipse(cx,cy-r*0.45,r*0.9,r*0.6,0,Math.PI,TAU);ctx.quadraticCurveTo(cx+r*0.6,cy-r*0.6,cx-r*0.2,cy-r*0.55);ctx.closePath();ctx.fill();ctx.restore();});});}

/* ---------- the past: England, 1766 ---------- */
// figures in a computer's hand: mono digits in iron-gall ink, a little uneven; slant gives each hand its own lean
function ag_fig(ctx,s,x,y,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.transform(1,0,o.slant||-0.12,1,0,0);ctx.rotate((hash(o.seed||1,x|0)-0.5)*0.03);
  T(ctx,s,0,0,{f:"mono",w:500,size:o.size||18,align:o.align||"left",color:o.col||AG_INK});ctx.restore();}
// the lunar distances for a month, as the almanac printed them: day, then the Moon's distance from the Sun at noon and every three hours
const AG_DAYS=[["1","61.42.18","63.16.40","64.51.05","66.25.33"],["2","73.37.52","75.11.54","76.45.53","78.19.49"],["3","85.43.11","87.16.20","88.49.26","90.22.29"],["4","97.32.06","99.04.30","100.36.52","102.09.11"],
  ["5","109.06.47","110.38.30","112.10.12","113.41.51"],["6","120.30.20","122.01.29","123.32.37","125.03.42"],["7","131.46.02","133.16.44","134.47.25","136.18.04"]];
// a page of the almanac: laid paper with a heading, the Moon's glyph, and columns of figures drawn up as p goes 0..1 (column by column).
// o.wrong: [row,col] of a figure computed wrongly; o.fix (0..1) writes the corrected figure over it; o.slant gives the hand
function ag_page(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a,pos=(r,c)=>{const k=w/620,rh=(h/k-160)/(o.rows||AG_DAYS.length);return[x+(c===0?44:96+(c-1)*(w/k-150)/4+60)*k,y+(156+r*rh)*k];};if(a<=0.01)return pos;withA(ctx,a,()=>{const p=o.p==null?1:o.p,sd=o.seed||1,cols=o.cols||5;
  ctx.save();ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);kt_paper(ctx,0,0,w,h,t,{seed:sd,col:o.col||[236,224,196],curl:o.curl==null?0.6:o.curl,age:0.3});
  const k=w/620,hd=o.head==null?1:o.head;
  withA(ctx,hd,()=>{T(ctx,o.title||"JANUARY 1767",w/2,46*k,{w:800,size:22*k,align:"center",color:"rgba(60,40,24,0.95)"});
    T(ctx,"Distances of the Moon from the Sun",w/2,74*k,{w:600,size:16*k,align:"center",color:"rgba(80,56,34,0.9)"});
    // the Moon's glyph: a crescent, lit on its outer edge
    const mx=w-60*k,my=52*k,mr=16*k;ctx.fillStyle="rgba(70,48,28,0.9)";ctx.beginPath();ctx.arc(mx,my,mr,0,TAU);ctx.fill();ctx.fillStyle=rgba(o.col||[236,224,196],1);ctx.beginPath();ctx.arc(mx+mr*0.45,my-mr*0.1,mr*0.9,0,TAU);ctx.fill();
    ctx.strokeStyle="rgba(90,62,36,0.6)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(30*k,92*k);ctx.lineTo(w-30*k,92*k);ctx.stroke();
    ["Day","Noon","III h","VI h","IX h"].slice(0,cols).forEach((s,c)=>T(ctx,s,(c===0?44:96+(c-1)*(w/k-150)/4+60)*k,118*k,{w:700,size:15*k,align:"center",color:"rgba(80,56,34,0.9)"}));
    ctx.beginPath();ctx.moveTo(30*k,128*k);ctx.lineTo(w-30*k,128*k);ctx.stroke();});
  const rows=o.rows||AG_DAYS.length,rh=(h/k-160)/rows;
  for(let c=0;c<cols;c++){const q=clamp(p*cols-c,0,1);if(q<=0)break;
    for(let r=0;r<rows;r++){const u=clamp(q*rows-r,0,1);if(u<=0)break;const s=AG_DAYS[r%AG_DAYS.length][c],cx=(c===0?44:96+(c-1)*(w/k-150)/4+60)*k,cy=(156+r*rh)*k;
      const bad=o.wrong&&o.wrong[0]===r&&o.wrong[1]===c;let txt=typeOn(s,u);if(bad&&o.bad)txt=typeOn(o.bad,u);
      withA(ctx,bad&&o.fix?1-0.55*o.fix:1,()=>ag_fig(ctx,txt,cx,cy,{size:17*k,align:"center",slant:o.slant,seed:sd+r*7+c}));
      if(bad&&o.fix>0){ctx.save();ctx.strokeStyle="rgba(60,40,24,0.85)";ctx.lineWidth=1.6*k;ctx.beginPath();ctx.moveTo(cx-40*k,cy-6*k);ctx.lineTo(cx-40*k+80*k*ease(clamp(o.fix*2,0,1)),cy-6*k);ctx.stroke();ctx.restore();
        withA(ctx,clamp(o.fix*2-1,0,1),()=>ag_fig(ctx,s,cx,cy-16*k,{size:14*k,align:"center",slant:o.slant,seed:sd+3,col:"rgba(40,30,70,0.95)"}));}}}
  if(o.printed)withA(ctx,o.printed,()=>{ctx.strokeStyle="rgba(60,40,24,0.35)";ctx.lineWidth=1;ctx.strokeRect(22*k,22*k,w-44*k,h-44*k);});
  ctx.restore();});
  return pos;}
// England and Wales, from the coast's longitudes and latitudes, drawn on old paper in ink with short hatching along the shore
const AG_GB=[[-2.0,55.77],[-1.8,55.67],[-1.7,55.6],[-1.57,55.33],[-1.42,55.02],[-1.37,54.9],[-1.18,54.69],[-1.05,54.62],[-0.61,54.49],[-0.4,54.28],[-0.08,54.12],[-0.19,54.08],[-0.16,53.91],[0.12,53.58],[-0.07,53.57],[0.26,53.34],[0.34,53.14],[0.2,52.92],[0.49,52.95],[1.3,52.93],[1.53,52.82],[1.73,52.6],[1.76,52.47],[1.6,52.15],[1.35,51.95],[1.15,51.79],[0.95,51.6],[0.7,51.53],[0.5,51.5],[0.77,51.44],[1.02,51.36],[1.45,51.38],[1.4,51.22],[1.31,51.12],[0.97,50.91],[0.6,50.85],[0.25,50.74],[-0.14,50.82],[-0.79,50.73],[-1.1,50.79],[-1.4,50.85],[-1.55,50.75],[-1.98,50.7],[-2.06,50.58],[-2.45,50.52],[-2.95,50.72],[-3.4,50.62],[-3.53,50.43],[-3.64,50.22],[-4.15,50.35],[-4.64,50.33],[-4.8,50.22],[-5.05,50.15],[-5.2,49.96],[-5.53,50.1],[-5.71,50.07],[-5.48,50.21],[-5.08,50.42],[-4.95,50.55],[-4.55,50.83],[-4.53,51.02],[-4.25,51.05],[-4.12,51.21],[-3.47,51.21],[-2.98,51.35],[-2.7,51.5],[-2.4,51.75],[-2.6,51.62],[-2.98,51.55],[-3.17,51.45],[-3.3,51.39],[-3.7,51.48],[-3.95,51.6],[-4.3,51.56],[-4.25,51.68],[-4.7,51.67],[-4.93,51.6],[-5.15,51.7],[-5.3,51.9],[-5.07,52.03],[-4.68,52.12],[-4.36,52.21],[-4.09,52.41],[-4.05,52.55],[-4.05,52.72],[-4.41,52.88],[-4.76,52.79],[-4.55,52.94],[-4.33,53.12],[-4.5,53.15],[-4.68,53.3],[-4.55,53.42],[-4.2,53.32],[-3.84,53.33],[-3.5,53.33],[-3.1,53.35],[-3.15,53.42],[-3.03,53.48],[-3.02,53.65],[-3.05,53.82],[-3.0,53.93],[-2.85,54.07],[-3.23,54.08],[-3.4,54.25],[-3.64,54.49],[-3.56,54.65],[-3.4,54.87],[-3.1,54.95],[-2.9,55.03],[-2.6,55.12],[-2.3,55.3],[-2.05,55.65]];
function ag_ll(lon,lat,x,y,s){return[x+(lon+5.8)*0.6*s,y+(55.9-lat)*s];}
function ag_map(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const P=AG_GB.map(([lo,la])=>ag_ll(lo,la,x,y,s)),p=o.p==null?1:o.p;
  // the sheet the map is drawn on
  kt_paper(ctx,x-50,y-40,0.6*7.6*s+100,6*s+80,t,{seed:9,col:[232,218,186],curl:0.5,age:0.35});
  ctx.save();ctx.beginPath();const n=Math.max(2,Math.floor(P.length*p));P.slice(0,n).forEach(([px,py],i)=>{i?ctx.lineTo(px,py):ctx.moveTo(px,py);});if(p>=1)ctx.closePath();
  if(p>=1){const g=ctx.createLinearGradient(x,y,x+300,y+6*s);g.addColorStop(0,"rgba(196,170,120,0.55)");g.addColorStop(1,"rgba(170,140,96,0.5)");ctx.fillStyle=g;ctx.fill();}
  ctx.strokeStyle="rgba(70,48,28,0.9)";ctx.lineWidth=2;ctx.lineJoin="round";ctx.stroke();
  // short strokes off the shore, as an engraver shades the sea
  ctx.strokeStyle="rgba(70,48,28,0.28)";ctx.lineWidth=1;for(let i=0;i<n-1;i+=1){const[x0,y0]=P[i],[x1,y1]=P[i+1],dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1,nx=dy/L,ny=-dx/L;for(let k=0;k<2;k++){const u=(k+0.5)/2,bx=lerp(x0,x1,u),by=lerp(y0,y1,u);ctx.beginPath();ctx.moveTo(bx+nx*4,by+ny*4);ctx.lineTo(bx+nx*(9+hash(i,k)*5),by+ny*(9+hash(i,k)*5));ctx.stroke();}}
  ctx.restore();
  // the Isle of Wight
  if(p>=1){const[wx,wy]=ag_ll(-1.3,50.67,x,y,s);ctx.fillStyle="rgba(196,170,120,0.6)";ctx.strokeStyle="rgba(70,48,28,0.85)";ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(wx,wy,0.16*s,0.07*s,0,0,TAU);ctx.fill();ctx.stroke();}
  if(o.scot)withA(ctx,o.scot,()=>T(ctx,"ENGLAND",x+0.6*4.6*s,y+2.2*s,{w:700,size:20,align:"center",color:"rgba(80,56,34,0.6)"}));});}
// a small cottage, where a computer worked at home: stone walls, a thatched roof, a lit window
function ag_cottage(ctx,x,y,s,a,t){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const g=ctx.createLinearGradient(-20,-14,20,10);g.addColorStop(0,"#d9c8a6");g.addColorStop(1,"#9c8460");ctx.fillStyle=g;ctx.fillRect(-18,-12,36,22);ctx.strokeStyle="rgba(60,40,24,0.8)";ctx.lineWidth=1.4;ctx.strokeRect(-18,-12,36,22);
  ctx.fillStyle="#8a6a3a";ctx.beginPath();ctx.moveTo(-24,-10);ctx.quadraticCurveTo(-8,-34,0,-34);ctx.quadraticCurveTo(8,-34,24,-10);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle="rgba(255,214,140,"+(0.75+0.2*Math.sin(t*2+x))+")";ctx.fillRect(-11,-5,8,8);ctx.fillStyle="rgba(60,40,24,0.85)";ctx.fillRect(5,-2,7,12);ctx.restore();});}
// a folded sheet of instructions, sealed, at (x,y), turned by rot
function ag_letter(ctx,x,y,s,rot,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);ctx.shadowColor="rgba(0,0,0,0.4)";ctx.shadowBlur=8;ctx.shadowOffsetY=3;
  const g=ctx.createLinearGradient(-30,-20,30,20);g.addColorStop(0,"#f4ead2");g.addColorStop(1,"#cdbb94");ctx.fillStyle=g;ctx.fillRect(-30,-20,60,40);ctx.restore();ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);
  ctx.strokeStyle="rgba(90,62,36,0.6)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-30,-20);ctx.lineTo(0,4);ctx.lineTo(30,-20);ctx.stroke();waxSeal(ctx,0,4,7,WAX,1,1,"");ctx.restore();});}
// a goose quill, its nib at (x,y): a curved vane in two halves (the far one in shadow), barbs, a lit shaft; it moves as it writes
function ag_quill(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s*(o.flip?-1:1),s);ctx.rotate((o.rot==null?-0.6:o.rot)+0.035*Math.sin(t*(o.speed||7)+(o.seed||0)));
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.35)";ctx.shadowBlur=14;ctx.shadowOffsetX=10;ctx.shadowOffsetY=12;
  ctx.strokeStyle="#ece2c8";ctx.lineWidth=4.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,-6);ctx.quadraticCurveTo(4,-150,14,-300);ctx.stroke();ctx.restore();
  ctx.fillStyle="#2c2016";ctx.beginPath();ctx.moveTo(-1.5,0);ctx.lineTo(1.6,-26);ctx.lineTo(4.4,-26);ctx.closePath();ctx.fill();
  const vane=(side,c0,c1)=>{ctx.beginPath();ctx.moveTo(4,-70);ctx.bezierCurveTo(side*40,-110,side*54,-220,14+side*30,-300);ctx.bezierCurveTo(14+side*8,-322,16,-312,14,-300);ctx.quadraticCurveTo(8,-180,4,-70);ctx.closePath();
    const g=ctx.createLinearGradient(side*50,-300,0,-70);g.addColorStop(0,c0);g.addColorStop(1,c1);ctx.fillStyle=g;ctx.fill();};
  vane(1,"rgba(186,170,144,0.96)","rgba(122,108,88,0.92)");vane(-1,"rgba(252,247,234,0.98)","rgba(216,202,178,0.96)");
  ctx.strokeStyle="rgba(112,98,80,0.45)";ctx.lineWidth=1;for(let k=0;k<22;k++){const u=k/22,yy=-80-u*215,xx=4+u*10;[-1,1].forEach(sd=>{ctx.beginPath();ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx+sd*18,yy-10,xx+sd*(26+18*Math.sin(Math.PI*u)),yy-22+hash(k,sd+5)*6);ctx.stroke();});}
  // a few barbs come apart near the base, as a real feather's do
  ctx.strokeStyle="rgba(240,232,214,0.7)";[[-1,0.1],[1,0.06],[-1,0.16]].forEach(([sd,u],i)=>{const yy=-80-u*215;ctx.beginPath();ctx.moveTo(4,yy);ctx.quadraticCurveTo(4+sd*22,yy+6,4+sd*30,yy+16+i*3);ctx.stroke();});
  ctx.restore();});}
// an inkwell of glass, with its shadow
function ag_inkwell(ctx,x,y,s,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.ellipse(8,4,34,9,0,0,TAU);ctx.fill();
  const g=ctx.createLinearGradient(-26,0,26,0);g.addColorStop(0,"rgba(60,70,80,0.95)");g.addColorStop(0.35,"rgba(150,165,175,0.9)");g.addColorStop(1,"rgba(30,36,44,0.95)");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-26,0);ctx.bezierCurveTo(-30,-28,-18,-34,-10,-36);ctx.lineTo(10,-36);ctx.bezierCurveTo(18,-34,30,-28,26,0);ctx.closePath();ctx.fill();
  ctx.fillStyle="#141018";ctx.beginPath();ctx.ellipse(0,-36,10,3.5,0,0,TAU);ctx.fill();ctx.restore();});}
// an oak desk top: warm planks with grain, a lit front edge and a shadow under it
function ag_desk(ctx,x,y,w,h,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(0,0,0,0.45)";ctx.fillRect(x+10,y+h,w-20,18);
  const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,"#7a5232");g.addColorStop(1,"#4a301c");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.strokeStyle="rgba(40,24,12,0.35)";ctx.lineWidth=1.2;for(let i=0;i<14;i++){const yy=y+(i+0.5)*h/14;ctx.beginPath();ctx.moveTo(x,yy);for(let k=0;k<=24;k++){const xx=x+k*w/24;ctx.lineTo(xx,yy+Math.sin(k*0.9+i*1.7)*2.5+(hash(i,k%5)-0.5)*1.5);}ctx.stroke();}
  for(let i=1;i<4;i++){ctx.strokeStyle="rgba(30,18,8,0.55)";ctx.beginPath();ctx.moveTo(x,y+i*h/4);ctx.lineTo(x+w,y+i*h/4);ctx.stroke();}
  for(let i=0;i<3;i++){const kx=x+hash(i,31)*w,ky=y+hash(i,32)*h;ctx.strokeStyle="rgba(40,22,10,0.4)";ctx.beginPath();ctx.ellipse(kx,ky,14,5,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.ellipse(kx,ky,7,2.5,0,0,TAU);ctx.stroke();}
  ctx.restore();ctx.fillStyle="rgba(255,214,160,0.25)";ctx.fillRect(x,y,w,2);ctx.fillStyle="#3a2414";ctx.fillRect(x,y+h-10,w,10);});}
// a cedar pencil with a sharpened point at (x,y), pointing down-left
function ag_pencil(ctx,x,y,s,a,rot){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot==null?-2.3:rot);ctx.scale(s,s);ctx.shadowColor="rgba(0,0,0,0.4)";ctx.shadowBlur=10;ctx.shadowOffsetY=8;
  const g=ctx.createLinearGradient(0,-7,0,7);g.addColorStop(0,"#e0b070");g.addColorStop(0.5,"#b98648");g.addColorStop(1,"#7a5428");ctx.fillStyle=g;ctx.fillRect(28,-7,220,14);ctx.restore();ctx.save();ctx.translate(x,y);ctx.rotate(rot==null?-2.3:rot);ctx.scale(s,s);
  ctx.fillStyle="#e8cfa6";ctx.beginPath();ctx.moveTo(28,-7);ctx.lineTo(4,-1.6);ctx.lineTo(4,1.6);ctx.lineTo(28,7);ctx.closePath();ctx.fill();ctx.fillStyle="#3a3434";ctx.beginPath();ctx.moveTo(8,-2.6);ctx.lineTo(0,0);ctx.lineTo(8,2.6);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(90,60,30,0.5)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(28,0);ctx.lineTo(248,0);ctx.stroke();ctx.restore();});}
// a pencil circle, drawn up to p, a little uneven, round (x,y)
function ag_circle(ctx,x,y,rx,ry,p,col){if(p<=0)return;ctx.save();ctx.strokeStyle=col||"rgba(70,70,80,0.9)";ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();for(let i=0;i<=60*p;i++){const an=-2.2+i/60*TAU*1.08,r=1+0.06*Math.sin(i*0.4);ctx.lineTo(x+Math.cos(an)*rx*r,y+Math.sin(an)*ry*r);}ctx.stroke();ctx.restore();}
// a wooden printing press: two oak uprights, a head, an iron screw and a platen that comes down as down goes 0..1
function ag_press(ctx,x,y,s,down,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  const oak=(x0,y0,w,h)=>{const g=ctx.createLinearGradient(x0,0,x0+w,0);g.addColorStop(0,"#8a5e36");g.addColorStop(0.4,"#6a4426");g.addColorStop(1,"#3e2614");ctx.fillStyle=g;ctx.fillRect(x0,y0,w,h);ctx.strokeStyle="rgba(30,16,6,0.5)";ctx.lineWidth=1.2;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x0+i*w/4,y0+4);ctx.bezierCurveTo(x0+i*w/4+3,y0+h*0.3,x0+i*w/4-3,y0+h*0.7,x0+i*w/4,y0+h-4);ctx.stroke();}};
  ctx.fillStyle="rgba(0,0,0,0.4)";ctx.beginPath();ctx.ellipse(0,212,190,16,0,0,TAU);ctx.fill();
  oak(-170,-220,44,430);oak(126,-220,44,430);oak(-190,-250,380,46);oak(-190,150,380,40);
  // the screw and the bar that turns it
  const d=ease(clamp(down,0,1)),py=-110+d*150;ctx.fillStyle="#4a4a52";ctx.fillRect(-12,-204,24,py+204);ctx.strokeStyle="rgba(200,200,210,0.35)";ctx.lineWidth=2;for(let k=-200;k<py;k+=12){ctx.beginPath();ctx.moveTo(-12,k);ctx.lineTo(12,k+6);ctx.stroke();}
  const an=d*2.4;ctx.strokeStyle="#5a5a64";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,-150);ctx.lineTo(Math.cos(an)*120,-150+Math.sin(an)*18);ctx.stroke();
  // the platen and the bed with its sheet
  const g=ctx.createLinearGradient(0,py,0,py+30);g.addColorStop(0,"#8a8a94");g.addColorStop(1,"#3a3a42");ctx.fillStyle=g;ctx.fillRect(-110,py,220,30);
  ctx.restore();});}

/* ---------- the present: the agent, the project, the process ---------- */
// a small file chip, named, its colour on the left
function ag_chip(ctx,x,y,s,col,a,o){o=o||{};if(a<=0.01)return 0;const sz=o.size||18,w=tw(ctx,s,sz,500,"mono")+44,h=sz+20;withA(ctx,a,()=>{if(o.hi)glow(ctx,x+w/2,y,w*0.6,col,0.3*o.hi);glass(ctx,x,y-h/2,w,h,10,col,{glow:8,ea:0.75,fill:"rgba(7,12,24,0.95)"});
  ctx.fillStyle=rgba(col,1);rr(ctx,x+12,y-6,8,12,2);ctx.fill();T(ctx,s,x+30,y+sz*0.36,{f:"mono",w:500,size:sz,color:rgba(mix(INK,col,0.35),1)});});return w;}
// the process table, as docs/process.md has it: ten rows, three of its columns; o.agent[i] and o.appr[i] light the agent's part (teal) and who approves (gold)
const AG_PROC=[["Scope and meaning.","Drafts it from the catalog and glossary","… Mei Tanaka, registrar's office"],["Source reality.","Profiles, and proposes the mapping …","Jun Park, analytics engineer"],["Consumer output.","Drafts it from the request …","The consumer: Planning, …"],["Gaps and contracts.","Drafts both","The owner and the consumer"],
  ["Tests.","Writes them first","Jun Park, in review"],["Build.","Drafts the SQL to pass the tests","Jun Park, in review"],["Validate.","Runs them (skills/reconcile-and-diff/)","Jun Park and the owner"],["Review and ship.","Opens the pull request","A reviewer, never the agent"],["Written once.","Finds duplicated and drifted metadata","Jun Park"],["Operate and evolve.","Flags breaking changes","The owners of what depends on it"]];
function ag_process(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=o.rh||46,h=74+38+rh*10+14;if(a<=0.01)return h;withA(ctx,a,()=>{const col=[170,205,255];glass(ctx,x,y,w,h,14,col,{glow:12,ea:0.65,fill:"rgba(6,10,20,0.96)"});
  ctx.fillStyle=rgba(col,0.9);rr(ctx,x+18,y+22,10,10,3);ctx.fill();T(ctx,"docs/process.md",x+38,y+34,{f:"mono",w:500,size:18,color:rgba(col,1)});
  const lw=tw(ctx,AG_DUCK,18,700)+28,lx=x+w-16-lw;ctx.fillStyle="rgba(8,14,24,0.95)";rr(ctx,lx,y+13,lw,30,15);ctx.fill();ctx.strokeStyle=rgba(WEED,0.8);ctx.lineWidth=1.5;rr(ctx,lx,y+13,lw,30,15);ctx.stroke();T(ctx,AG_DUCK,lx+14,y+34,{w:700,size:18,color:rgba(WEED,1)});
  ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+50,w-28,1.2);
  const cx=[x+24,x+72,x+0.33*w,x+0.68*w],hy=y+88;["#","Step","The agent's part","Who approves"].forEach((s,i)=>T(ctx,s,cx[i],hy,{w:800,size:19,color:rgba(i===2?KT_AI:i===3?TRUST:SOFT,1)}));
  for(let i=0;i<10;i++){const ry=y+112+i*rh,ag=o.agent?o.agent[i]||0:0,ap=o.appr?o.appr[i]||0:0,q=o.p==null?1:clamp(o.p*10-i,0,1);if(q<=0)continue;withA(ctx,q,()=>{
    if(ag>0)withA(ctx,ag,()=>{ctx.fillStyle=rgba(KT_AI,0.14);rr(ctx,cx[2]-10,ry+4,cx[3]-cx[2]-10,rh-8,6);ctx.fill();});
    if(ap>0)withA(ctx,ap,()=>{ctx.fillStyle=rgba(TRUST,0.14);rr(ctx,cx[3]-10,ry+4,x+w-cx[3]-6,rh-8,6);ctx.fill();});
    T(ctx,String(i+1),cx[0],ry+rh*0.66,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});T(ctx,AG_PROC[i][0],cx[1],ry+rh*0.66,{w:700,size:19});
    T(ctx,AG_PROC[i][1],cx[2],ry+rh*0.66,{w:600,size:19,color:rgba(mix(SOFT,KT_AI,ag),1)});T(ctx,AG_PROC[i][2],cx[3],ry+rh*0.66,{w:600,size:19,color:rgba(mix(SOFT,TRUST,ap),1)});
    ctx.fillStyle="rgba(170,200,245,0.07)";ctx.fillRect(x+16,ry+rh,w-32,1);});}});return h;}
// a long prompt: a tall sheet of small grey lines, scrolling, as it fades
function ag_prompt(ctx,x,y,w,h,t,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,AG_GREY,{glow:6,ea:0.45,fill:"rgba(10,12,20,0.9)"});T(ctx,"a long prompt",x+20,y+34,{w:700,size:20,color:rgba(AG_GREY,1)});
  ctx.save();ctx.beginPath();ctx.rect(x+10,y+52,w-20,h-62);ctx.clip();const off=(t*22)%18;for(let i=0;i<40;i++){const yy=y+64+i*18-off;ctx.fillStyle=rgba(AG_GREY,0.25);rr(ctx,x+20,yy,(w-40)*(0.5+0.5*hash(i,77)),6,3);ctx.fill();}ctx.restore();});}
// a door in the production wall: a frame, the door swinging open as op goes 0..1 (it narrows), light from inside; o.ro draws it read-only (a thin line, no pen)
function ag_door(ctx,x,y,w,h,name,col,op,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const u=ease(clamp(op,0,1));
  ctx.fillStyle="rgba(4,8,16,0.98)";ctx.fillRect(x,y,w,h);if(u>0){const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(col,0.35*u));g.addColorStop(1,rgba(col,0.08*u));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);glow(ctx,x+w/2,y+h/2,w*0.8,col,0.18*u);}
  // the door leaf, hinged on the left, narrowing as it opens
  const lw=w*(1-0.82*u);ctx.fillStyle=rgba(mix([24,34,54],col,0.15),1);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+lw,y+h*0.04*u);ctx.lineTo(x+lw,y+h-h*0.04*u);ctx.lineTo(x,y+h);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.arc(x+lw-12,y+h/2,4,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.strokeRect(x-4,y-4,w+8,h+8);
  T(ctx,name,x+w/2,y-18,{w:800,size:22,align:"center",color:rgba(col,1)});});}
// a key card on a lanyard: the agent's own identity
function ag_key(ctx,x,y,s,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(o.rot||0);const w=270*s,h=86*s,col=o.col||KT_AI;
  glass(ctx,-w/2,-h/2,w,h,10*s,col,{glow:14,ea:0.85,fill:"rgba(7,14,22,0.96)"});ctx.fillStyle=rgba(col,0.9);rr(ctx,-w/2+12*s,-h/2+14*s,30*s,22*s,4);ctx.fill();
  T(ctx,o.title||"service principal",-w/2+52*s,-h/2+32*s,{w:800,size:20*s,color:rgba(col,1)});T(ctx,o.sub||"agent-credentials",-w/2+52*s,-h/2+60*s,{f:"mono",w:500,size:18*s,color:rgba(SOFT,1)});
  if(o.cross)cross_(ctx,w/2-26*s,-h/2+26*s,30*s,AG_RED,o.cross);ctx.restore();});}
// a red scribble, drawn up to p: a mistake, kept in its own room
function ag_scribble(ctx,x,y,s,p){if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(AG_RED,0.95);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.shadowColor=rgba(AG_RED,0.6);ctx.shadowBlur=8;ctx.beginPath();
  for(let i=0;i<=80*p;i++){const u=i/80;ctx.lineTo(x+(u-0.5)*s*1.6+Math.sin(u*31)*s*0.18,y+Math.sin(u*47)*s*0.3+Math.cos(u*13)*s*0.12);}ctx.stroke();ctx.restore();}
// a claim card: teal, with a query card and a result row clipped under it as clip goes 0..1; o.grey greys it, o.noq draws no query
function ag_claim(ctx,x,y,w,claim,query,result,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const cl=ease(clamp(o.clip==null?1:o.clip,0,1)),gr=o.grey||0,col=mix(KT_AI,AG_GREY,gr);withA(ctx,a*(1-0.4*gr),()=>{
  if(!o.noq&&cl>0)withA(ctx,cl,()=>{const qy=y+66+cl*6;glass(ctx,x+18,qy,w-36,46,10,[170,205,255],{glow:6,ea:0.6,fill:"rgba(6,10,20,0.96)"});T(ctx,query,x+34,qy+30,{f:"mono",w:500,size:18,color:rgba([205,225,255],0.95)});
    const ry=qy+54;glass(ctx,x+18,ry,w-36,46,10,AG_GRN,{glow:6,ea:0.6,fill:"rgba(6,14,12,0.96)"});T(ctx,result,x+34,ry+30,{f:"mono",w:500,size:18,color:rgba(AG_GRN,0.95)});
    ctx.fillStyle=rgba(SOFT,0.9);[[x+w*0.5,qy-2],[x+w*0.5,ry-2]].forEach(([cx,cy])=>{rr(ctx,cx-14,cy-6,28,12,4);ctx.fill();});});
  glass(ctx,x,y,w,64,14,col,{glow:12,ea:0.85,fill:"rgba(6,16,18,0.97)"});T(ctx,o.kind||"claim",x+20,y+40,{w:800,size:18,color:rgba(col,1)});T(ctx,claim,x+86,y+40,{w:700,size:21,color:rgba(mix(INK,AG_GREY,gr),1)});});}
// a draft pull request, as a card: title, a status pill, sections typed in, checks, approvals and the merge button
function ag_pr(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const col=o.col||KT_AI;glass(ctx,x,y,w,h,16,col,{glow:14,ea:0.75,fill:"rgba(6,12,20,0.96)"});
  T(ctx,"pull request",x+24,y+40,{w:700,size:18,color:rgba(SOFT,1)});T(ctx,o.title||"Tidy the learner timeline",x+24,y+76,{w:800,size:24});
  const rd=o.ready||0,mg=o.merged||0,pill=mg>0.5?["Merged",[178,156,255]]:rd>0.5?["Ready for review",AG_GRN]:["Draft",AG_GREY],pw=tw(ctx,pill[0],18,800)+30;
  glass(ctx,x+w-24-pw,y+20,pw,34,17,pill[1],{glow:10*Math.max(rd,mg),ea:0.85,fill:"rgba(8,12,20,0.95)"});T(ctx,pill[0],x+w-24-pw/2,y+43,{w:800,size:18,align:"center",color:rgba(pill[1],1)});
  kt_agent(ctx,x+w-50,y+92,10,t,{a:1});T(ctx,"opened by the agent",x+w-72,y+98,{w:600,size:18,align:"right",color:rgba(KT_AI,0.95)});
  ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+16,y+116,w-32,1.2);});}

// a balance: the mart on one pan, the census report on the other; tilt (-1..1) leans it, level at 0
function ag_scale(ctx,cx,cy,s,tilt,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(cx,cy);ctx.scale(s,s);const an=tilt*0.16,col=[200,215,240];
  ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,-150);ctx.lineTo(0,170);ctx.moveTo(-90,170);ctx.lineTo(90,170);ctx.stroke();glow(ctx,0,-150,30,col,0.3);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(0,-150,8,0,TAU);ctx.fill();
  const ex=Math.cos(an)*220,ey=Math.sin(an)*220;ctx.beginPath();ctx.moveTo(-ex,-150-ey);ctx.lineTo(ex,-150+ey);ctx.stroke();
  [[-1,o.left||"",o.lc||LAYER4[3][1]],[1,o.right||"",o.rc||PARCH]].forEach(([sd,lab,c])=>{const px=sd*ex,py=-150+sd*ey;ctx.strokeStyle=rgba(col,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-60,py+110);ctx.moveTo(px,py);ctx.lineTo(px+60,py+110);ctx.stroke();
    ctx.fillStyle=rgba(mix([20,28,44],c,0.25),1);ctx.beginPath();ctx.ellipse(px,py+112,82,14,0,0,TAU);ctx.fill();ctx.strokeStyle=rgba(c,0.9);ctx.lineWidth=2.4;ctx.stroke();
    T(ctx,lab,px,py+158,{w:700,size:20,align:"center",color:rgba(c,1)});});
  ctx.restore();});}
// a database: a glass cylinder with its name
function ag_db(ctx,cx,cy,w,h,name,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const ry=w*0.16;glow(ctx,cx,cy,w*0.7,col,0.12+0.2*(o.hi||0));ctx.fillStyle="rgba(8,14,26,0.95)";ctx.beginPath();ctx.ellipse(cx,cy+h/2,w/2,ry,0,0,Math.PI);ctx.lineTo(cx-w/2,cy-h/2);ctx.ellipse(cx,cy-h/2,w/2,ry,0,Math.PI,0,true);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.stroke();ctx.beginPath();ctx.ellipse(cx,cy-h/2,w/2,ry,0,0,TAU);ctx.stroke();for(let k=1;k<3;k++){ctx.strokeStyle=rgba(col,0.35);ctx.beginPath();ctx.ellipse(cx,cy-h/2+k*h/3,w/2,ry,0,0,Math.PI);ctx.stroke();}
  T(ctx,name,cx,cy+h/2+ry+34,{w:800,size:22,align:"center",color:rgba(col,1)});if(o.sub)T(ctx,o.sub,cx,cy+h/2+ry+60,{f:"mono",w:500,size:18,align:"center",color:rgba(SOFT,1)});});}
// an incremental table: a stack of rows that only takes new ones on top. o.n rows; o.rule (0..1) slides a changed rule past the old
// rows without touching them; o.refresh (0..1) rebuilds the whole stack in the new colour, bottom to top
function ag_stack(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const n=8,rh=34,old=[150,176,214],nw=KT_AI,rf=o.refresh||0;
  T(ctx,"core_credential",x+w/2,y-46,{f:"mono",w:500,size:20,align:"center",color:rgba(TRUST,1)});T(ctx,"incremental",x+w/2,y-18,{w:700,size:18,align:"center",color:rgba(SOFT,1)});
  for(let i=0;i<n;i++){const yy=y+(n-1-i)*rh,isNew=i>=n-(o.newRows||0),reb=clamp(rf*n*1.2-i,0,1),c=isNew?nw:mix(old,nw,reb);
    ctx.fillStyle=rgba(mix([10,16,28],c,0.18),1);rr(ctx,x,yy,w,rh-6,6);ctx.fill();ctx.strokeStyle=rgba(c,0.85);ctx.lineWidth=1.8;rr(ctx,x,yy,w,rh-6,6);ctx.stroke();
    for(let k=0;k<4;k++){ctx.fillStyle=rgba(c,0.35);rr(ctx,x+14+k*(w-28)/4,yy+10,(w-28)/4-12,8,3);ctx.fill();}}
  const ru=o.rule||0;if(ru>0&&rf<0.05){const yy=y+(n-1)*rh+rh+10-ru*(n*rh+40);withA(ctx,Math.sin(Math.PI*clamp(ru,0,1)),()=>{ctx.save();ctx.setLineDash([8,6]);ctx.strokeStyle=rgba(KT_AI,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w+30,yy);ctx.lineTo(x+w+30,yy-40);ctx.stroke();ctx.restore();tag(ctx,x+w+44,yy-20,"changed rule",KT_AI,{size:18});});}});}
// a dashboard tooltip, a wiki page, a catalog entry, a YAML description: one card each, holding a copy of the definition
function ag_copy(ctx,x,y,w,kind,txt,col,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const dr=o.drift||0,h=o.h||140;
  ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(dr*0.035*Math.sin(t*0.6+(o.seed||0)));ctx.translate(-w/2,-h/2);
  glass(ctx,0,0,w,h,14,col,{glow:10,ea:0.75,fill:"rgba(7,12,24,0.96)"});tag(ctx,16,0,kind,col,{size:18});
  const lines=wrapT(ctx,txt,0,0,w-40,{size:20,w:600,measure:true});lines.forEach((l,i)=>{const jit=dr*(hash(i,(o.seed||0)+3)-0.5)*6*Math.sin(t*1.3+i);T(ctx,l,20+jit,46+i*28+jit*0.4,{w:600,size:20,color:rgba(mix(INK,dr>0?AG_AMB:INK,dr*0.5),1)});});
  if(o.mark)withA(ctx,o.mark,()=>T(ctx,"as it drifts",w-16,h-14,{w:700,size:18,align:"right",color:rgba(AG_AMB,0.95)}));
  ctx.restore();});}
// the series' loop of ten (stepLoop in weeds.js), without the small step numbers and with smaller stations (o.r), for a loop drawn small in a corner
function ag_stepLoop(ctx,cx,cy,rx,ry,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  ctx.save();ctx.strokeStyle=rgba(WEED,0.25);ctx.lineWidth=2;ctx.setLineDash([4,10]);ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,TAU);ctx.stroke();ctx.restore();
  STEPS10.forEach(([nm,gl],i)=>{const on=o.on?o.on[i]||0:1,[px,py]=stepPos(i,cx,cy,rx,ry),r=o.r||40;withA(ctx,0.25+0.75*on,()=>{if(on>0)glow(ctx,px,py,r*2,WEED,0.2*on);
      ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill();ring(ctx,px,py,r,mix(SOFT,WEED,on),1,2.4);
      T(ctx,gl,px,py+8,{w:800,size:gl.length>2?19:24,align:"center",color:rgba(mix(SOFT,WEED,on),1)});});
    if(o.teal&&o.teal[i]>0)withA(ctx,o.teal[i],()=>{ctx.fillStyle=rgba(KT_AI,1);ctx.beginPath();ctx.arc(px+r*0.72,py-r*0.72,8,0,TAU);ctx.fill();});
    if(o.ticks&&o.ticks[i]>0)kt_gtick(ctx,px+r*0.78,py+r*0.7,13,o.ticks[i]);});});}

/* ---------- the labs' and scenarios' pictures ----------
   Added to the film bundle's LV registry (Keeping it true's true.js defines it; these keys are prefixed ag_ so they never clash).
   assets/from-words-to-data/learn.js calls each as f(ctx, w, h, state, L): a lab passes its state (sort: {pick, checked};
   pick: {pick}; compose: {pick}), a scenario passes {q}. Any words come from L.vis (the page's learn.en.js or learn.es.js),
   so each language draws its own; code stays as the project has it. */
function ag_lfit(c,w,h,bw,bh){const k=Math.min(w/bw,h/bh);c.translate((w-bw*k)/2,(h-bh*k)/2);c.scale(k,k);}
// which of the pull request's five changes each choice rejects
const AG_LREJ={none:[0,0,0,0,0],warn:[0,0,0,1,0],where:[0,0,1,0,0],both:[0,0,1,1,0],every:[1,1,1,1,1]};
const AG_LDIFF=["compared as (  →  with_previous_values as (","+ values: [studying, inactive, withdrawn, completed]","+ config: {where: \"learner_status = 'studying'\"}","+ severity: warn","+ -- every date a version starts or ends"];
// a result card for the labs: a title, then lines in their colours
function ag_lcard(c,x,y,w,h,col,title,lines){glass(c,x,y,w,h,14,col,{glow:10,ea:0.75,fill:"rgba(6,10,20,0.96)"});T(c,title,x+20,y+36,{w:800,size:21,color:rgba(col,1)});
  let yy=y+72;lines.forEach(([s,lc,o])=>{o=o||{};const ls=wrapT(c,s,x+20,yy,w-40,{size:o.size||20,w:o.w||700,f:o.f,color:rgba(lc,1),lh:28});yy+=ls.length*28+6;});}
/* On a phone (a canvas under 560 px wide) each lab draws a simpler picture with larger words, at 28 to 34 in its 960-wide space
   (about 11 to 13 px); the details it leaves out (the diff lines, the queries, the jobs) are in the text beside it. */
function ag_nar(c){const cw=c&&c.canvas&&c.canvas.clientWidth;return !!cw&&cw<560;}
// the largest size, from z down to min, at which s fits in maxW
function ag_fz(c,s,maxW,z,wt,f,min){while(z>(min||22)&&tw(c,s,z,wt,f)>maxW)z-=1;return z;}
const AG_LN={
  review:(c,w,h,st,L)=>{const V=L.vis,rej=AG_LREJ[st.pick]||AG_LREJ.none;c.save();ag_lfit(c,w,h,960,556);
    V.changes.forEach((nm,i)=>{const y=6+i*74,r=rej[i];glass(c,8,y,944,66,12,r?AG_RED:KT_AI,{glow:6,ea:0.6,fill:"rgba(6,14,20,0.96)"});
      T(c,String(i+1),30,y+44,{f:"mono",w:500,size:30,color:rgba(SOFT,1)});T(c,nm,70,y+44,{w:700,size:ag_fz(c,nm,800,34,700),color:rgba(r?SOFT:INK,1)});
      if(r)cross_(c,912,y+33,40,AG_RED,1);else kt_gtick(c,912,y+33,20,1);});
    const warn=!rej[3],where=!rej[2],bc=warn?AG_AMB:AG_RED,rc=where?AG_AMB:AG_GRN;
    glass(c,8,384,464,166,14,bc,{glow:10,ea:0.75,fill:"rgba(6,10,20,0.96)"});glass(c,488,384,464,166,14,rc,{glow:10,ea:0.75,fill:"rgba(6,10,20,0.96)"});
    const bt=warn?"WARN 1 · ERROR=0":"FAIL 1";T(c,bt,28,430,{f:"mono",w:500,size:ag_fz(c,bt,424,32,500,"mono"),color:rgba(bc,1)});
    wrapT(c,warn?V.ships:V.stops,28,474,424,{w:700,size:28,lh:34,color:rgba(bc,1)});
    T(c,V.rel,508,430,{f:"mono",w:500,size:ag_fz(c,V.rel,424,30,500,"mono"),color:rgba(rc,1)});
    wrapT(c,where?V.skip.replace(/[;:]\s*[^;:]*$/,""):V.all73,508,474,424,{w:700,size:28,lh:34,color:rgba(rc,1)});
    c.restore();},
  rule:(c,w,h,st,L)=>{const V=L.vis,Lb=L.labs.find(x=>x.id==="rule"),S=Lb.w.slots,pk=st.pick||[];c.save();ag_lfit(c,w,h,960,442);
    S.forEach((sl,i)=>{const p=pk[i],o=p==null?null:sl.opts[p],col=o==null?AG_GREY:o.ok?AG_GRN:AG_RED,y=8+i*146;
      glass(c,8,y,500,130,14,col,{glow:8,ea:0.7,fill:"rgba(6,10,20,0.96)"});T(c,sl.label,30,y+76,{w:800,size:ag_fz(c,sl.label,380,34,800),color:rgba(o?INK:SOFT,1)});
      if(o==null)T(c,"…",450,y+80,{w:800,size:40,align:"center",color:rgba(AG_GREY,1)});else if(o.ok)tick_(c,452,y+64,46,AG_GRN,1);else cross_(c,452,y+64,42,AG_RED,1);});
    const done=pk.every(p=>p!=null),inst=pk[2]==null?null:S[2].opts[pk[2]],good=done&&pk.every((p,i)=>S[i].opts[p].ok);
    kt_agent(c,736,90,42,0,{});
    if(inst&&!good){ring(c,736,90,78,AG_AMB,0.9,3,[10,8]);T(c,V.stuck,736,226,{w:800,size:ag_fz(c,V.stuck,420,34,800),align:"center",color:rgba(AG_AMB,1)});
      wrapT(c,V.loop,736,280,400,{f:"mono",w:500,size:28,lh:36,align:"center",color:rgba(AG_AMB,0.9)});}
    if(good){arrowTo(c,736,140,736,180,KT_AI,0.9,{head:14});glass(c,528,190,424,244,14,KT_AI,{glow:10,ea:0.75,fill:"rgba(6,10,20,0.96)"});
      T(c,V.report,548,236,{w:800,size:ag_fz(c,V.report,384,30,800),color:rgba(KT_AI,1)});T(c,"BUS | 4 | 3",548,282,{f:"mono",w:500,size:30,color:rgba([205,225,255],1)});
      wrapT(c,V.to,548,326,384,{w:700,size:28,lh:34,color:rgba(SOFT,1)});}
    c.restore();},
  claims:(c,w,h,st,L)=>{const V=L.vis,Lb=L.labs.find(x=>x.id==="claims"),pick=st.pick||{};c.save();ag_lfit(c,w,h,960,480);
    V.claims.forEach((cl,i)=>{const y=4+i*79,hasQ=!!cl.q,pb=pick[i];glass(c,8,y,700,72,12,hasQ?KT_AI:AG_GREY,{glow:6,ea:0.6,fill:"rgba(6,12,20,0.96)"});
      let z=30,ls;for(;z>=24;z--){ls=wrapT(c,cl.c,26,0,664,{w:700,size:z,measure:true});if(ls.length<=2)break;}
      if(ls.length===1)T(c,ls[0],26,y+46,{w:700,size:z});else{T(c,ls[0],26,y+31,{w:700,size:z});T(c,ls[1]+(ls.length>2?" …":""),26,y+63,{w:700,size:z});}
      if(pb){const ev=pb==="ev",t=ev?V.evidence:V.guess;tag(c,826,y+36,t,ev?AG_GRN:AG_AMB,{align:"center",size:ag_fz(c,t,150,28,700)});
        if(st.checked){const ok=Lb.w.items[i].b===pb;if(ok)tick_(c,930,y+36,32,AG_GRN,1);else cross_(c,930,y+36,30,AG_RED,1);}}});
    c.restore();},
  access:(c,w,h,st,L)=>{const V=L.vis,k=st.pick||"little",lv={little:[0,1,1,2],right:[1,1,1,2],prod:[2,2,2,2],person:[2,2,2,2]}[k]||[0,0,0,0];
    c.save();ag_lfit(c,w,h,960,442);const per=k==="person",kt=per?V.person:V.key;
    glass(c,8,8,944,66,14,per?TRUST:KT_AI,{glow:10,ea:0.85,fill:"rgba(7,14,22,0.96)"});c.fillStyle=rgba(per?TRUST:KT_AI,0.9);rr(c,28,26,42,30,5);c.fill();
    T(c,kt,90,53,{w:800,size:ag_fz(c,kt,840,34,800),color:rgba(per?TRUST:KT_AI,1)});
    c.save();c.setLineDash([8,8]);c.strokeStyle=rgba(SOFT,0.5);c.lineWidth=2;rr(c,8,96,700,340,16);c.stroke();c.restore();
    T(c,V.prod,24,130,{w:800,size:28,color:rgba(SOFT,1)});
    [[24,V.doors[0],[150,176,214]],[254,V.doors[1],TRUST],[484,V.doors[2],LAYER4[3][1]],[730,V.doors[3],KT_AI]].forEach(([x,nm,col],i)=>{const s=lv[i],wr=s===2,cc=s===0?AG_GREY:wr&&i<3?AG_RED:col;
      const two=i===3&&nm.indexOf(" ")>0&&tw(c,nm,30,800)>220,sp=two?nm.lastIndexOf(" ",Math.ceil(nm.length/2)+3):-1;
      ag_door(c,x+50,220,120,130,"",cc,s===0?0:s===1?0.55:1,0,{});
      if(two){T(c,nm.slice(0,sp),x+110,154,{w:800,size:28,align:"center",color:rgba(cc,1)});T(c,nm.slice(sp+1),x+110,188,{w:800,size:28,align:"center",color:rgba(cc,1)});}
      else T(c,nm,x+110,i===3?188:190,{w:800,size:ag_fz(c,nm,210,30,800),align:"center",color:rgba(cc,1)});
      const at=s===0?V.none:s===1?V.read:V.write;tag(c,x+110,404,at,cc,{align:"center",size:ag_fz(c,at,190,28,700)});});
    if(k==="prod"||k==="person")ag_scribble(c,598,286,56,1);else if(k==="right")ag_scribble(c,840,286,56,1);
    c.restore();}
};
Object.assign(LV,{
  // review the agent's pull request: five changes, each approved (gold tick) or rejected (red cross); what the build and the test then do
  ag_l_review:(c,w,h,st,L)=>{if(ag_nar(c))return AG_LN.review(c,w,h,st,L);const V=L.vis,rej=AG_LREJ[st.pick]||AG_LREJ.none;c.save();ag_lfit(c,w,h,1000,580);
    T(c,V.pr,20,36,{w:800,size:26});T(c,V.branch,20,66,{w:700,size:20,color:rgba(AG_RED,1)});
    V.changes.forEach((nm,i)=>{const y=84+i*72,r=rej[i];glass(c,20,y,960,64,12,KT_AI,{glow:6,ea:0.6,fill:"rgba(6,14,20,0.96)"});
      T(c,String(i+1),38,y+27,{f:"mono",w:500,size:21,color:rgba(SOFT,1)});T(c,nm,66,y+27,{w:700,size:22});T(c,AG_LDIFF[i],66,y+54,{f:"mono",w:500,size:20,color:rgba(i===0?[205,225,255]:KT_AI,0.95)});
      if(r)cross_(c,942,y+32,34,AG_RED,1);else kt_gtick(c,942,y+32,16,1);});
    const warn=!rej[3],where=!rej[2];
    ag_lcard(c,20,452,470,118,warn?AG_AMB:AG_RED,V.build+": "+(warn?"WARN 1 · ERROR=0":"FAIL 1"),[[warn?V.ships:V.stops,warn?AG_AMB:AG_RED,{size:22}]]);
    ag_lcard(c,510,452,470,118,where?AG_AMB:AG_GRN,V.rel,where?[[V.skip,AG_AMB,{size:21}],[V.skipped,AG_AMB,{size:19,w:600}]]:[[V.all73,AG_GRN,{size:22}]]);
    c.restore();},
  // write a guideline: the must-not's three parts, each missing, right or wrong, and what the agent then does: report, or loop
  ag_l_rule:(c,w,h,st,L)=>{if(ag_nar(c))return AG_LN.rule(c,w,h,st,L);const V=L.vis,Lb=L.labs.find(x=>x.id==="rule"),S=Lb.w.slots,pk=st.pick||[];c.save();ag_lfit(c,w,h,1000,460);
    T(c,"AGENTS.md · "+Lb.w.head,30,46,{w:800,size:26,color:rgba(TRUST,1)});
    S.forEach((sl,i)=>{const p=pk[i],o=p==null?null:sl.opts[p],col=o==null?AG_GREY:o.ok?AG_GRN:AG_RED,y=76+i*122;
      glass(c,30,y,500,104,14,col,{glow:8,ea:0.7,fill:"rgba(6,10,20,0.96)"});T(c,sl.label,54,y+40,{w:800,size:24,color:rgba(o?INK:SOFT,1)});
      if(o==null)T(c,"…",54,y+80,{w:800,size:28,color:rgba(AG_GREY,1)});else{const ls=wrapT(c,o.t,54,y+78,380,{w:600,size:19,measure:true});T(c,ls[0]+(ls.length>1?" …":""),54,y+78,{w:600,size:19,color:rgba(SOFT,1)});
        if(o.ok)tick_(c,490,y+52,36,AG_GRN,1);else cross_(c,490,y+52,34,AG_RED,1);}});
    const done=pk.every(p=>p!=null),inst=pk[2]==null?null:S[2].opts[pk[2]],good=done&&pk.every((p,i)=>S[i].opts[p].ok);
    kt_agent(c,770,150,40,0,{});
    if(inst&&!good){ring(c,770,150,96,AG_AMB,0.9,3,[10,8]);c.fillStyle=rgba(AG_AMB,1);c.beginPath();c.moveTo(866,150);c.lineTo(852,128);c.lineTo(880,128);c.closePath();c.fill();
      T(c,V.stuck,770,300,{w:800,size:28,align:"center",color:rgba(AG_AMB,1)});T(c,V.loop,770,340,{f:"mono",w:500,size:20,align:"center",color:rgba(AG_AMB,0.9)});}
    if(good){arrowTo(c,770,198,770,262,KT_AI,0.9,{head:14});ag_lcard(c,580,272,390,170,KT_AI,V.report,[["BUS | 4 | 3",[205,225,255],{f:"mono",w:500,size:22}],[V.to,SOFT,{size:21,w:600}]]);}
    c.restore();},
  // claim or guess: each statement, with its query if it has one; checked, each guess shows what running it finds
  ag_l_claims:(c,w,h,st,L)=>{if(ag_nar(c))return AG_LN.claims(c,w,h,st,L);const V=L.vis,Lb=L.labs.find(x=>x.id==="claims"),pick=st.pick||{};c.save();ag_lfit(c,w,h,1000,500);
    V.claims.forEach((cl,i)=>{const y=12+i*81,hasQ=!!cl.q,pb=pick[i];glass(c,16,y,740,72,12,hasQ?KT_AI:AG_GREY,{glow:6,ea:0.6,fill:"rgba(6,12,20,0.96)"});
      // every line shrinks, if it must, to stay inside its card (740 wide, text from 34 to 740)
      const fit=(t,o)=>{c.save();let z=o.size;c.font=font(o.w,z,o.f);while(z>15&&c.measureText(t).width>700){z-=0.5;c.font=font(o.w,z,o.f);}c.restore();T(c,t,34,o.y,Object.assign({},o,{size:z}));};
      fit(cl.c,{y:y+30,w:700,size:21});
      if(hasQ)fit(cl.q+" → "+cl.r.split(" | ").slice(-2).join(" | "),{y:y+60,f:"mono",w:500,size:19,color:rgba(AG_GRN,0.95)});
      else if(st.checked)fit(V.run+" "+cl.run,{y:y+60,w:700,size:19,color:rgba(AG_AMB,1)});
      else fit(V.q.noquery,{y:y+60,w:600,size:19,color:rgba(SOFT,0.8)});
      if(pb){const ev=pb==="ev";tag(c,860,y+36,ev?V.evidence:V.guess,ev?AG_GRN:AG_AMB,{align:"center",size:21});
        if(st.checked){const ok=Lb.w.items[i].b===pb;if(ok)tick_(c,966,y+36,30,AG_GRN,1);else cross_(c,966,y+36,28,AG_RED,1);}}});
    c.restore();},
  // least access: production's doors and the agent's own wing, opened for reading or writing; the key it holds; the jobs it can do
  ag_l_access:(c,w,h,st,L)=>{if(ag_nar(c))return AG_LN.access(c,w,h,st,L);const V=L.vis,Lb=L.labs.find(x=>x.id==="access"),k=st.pick||"little",lv={little:[0,1,1,2],right:[1,1,1,2],prod:[2,2,2,2],person:[2,2,2,2]}[k]||[0,0,0,0],res=Lb.w.res[k]||[];
    c.save();ag_lfit(c,w,h,1000,460);
    c.save();c.setLineDash([8,8]);c.strokeStyle=rgba(SOFT,0.5);c.lineWidth=2;rr(c,16,150,500,290,16);c.stroke();c.restore();tag(c,30,150,V.prod,SOFT,{size:21});
    [[36,V.doors[0],[150,176,214]],[200,V.doors[1],TRUST],[364,V.doors[2],LAYER4[3][1]],[580,V.doors[3],KT_AI]].forEach(([x,nm,col],i)=>{const s=lv[i],wr=s===2,cc=s===0?AG_GREY:wr&&i<3?AG_RED:col;
      // the development schemas' name is long: two lines, so it clears the dashed box and the jobs beside it
      const two=i===3&&nm.indexOf(" ")>0,sp=two?nm.lastIndexOf(" ",Math.ceil(nm.length/2)+3):-1;
      ag_door(c,x,222,120,160,two?"":nm,cc,s===0?0:s===1?0.55:1,0,{});
      if(two){T(c,nm.slice(0,sp),x+60,178,{w:800,size:22,align:"center",color:rgba(cc,1)});T(c,nm.slice(sp+1),x+60,204,{w:800,size:22,align:"center",color:rgba(cc,1)});}
      tag(c,x+60,414,s===0?V.none:s===1?V.read:V.write,cc,{align:"center",size:21});});
    if(k==="prod"||k==="person")ag_scribble(c,424,300,50,1);else if(k==="right")ag_scribble(c,640,300,50,1);
    const per=k==="person";ag_key(c,180,62,1.25,1,{title:per?V.person:V.key,col:per?TRUST:KT_AI,sub:per?" ":undefined});
    // each job shrinks, if it must, to end inside the picture (Spanish runs longer)
    // one size for all three, the largest at which each fits beside its tick; a job too long even at 20 wraps to two lines
    const jz=Math.min(...V.jobs.map(j=>ag_fz(c,j,214,25,700,undefined,20)));
    V.jobs.forEach((j,i)=>{const y=180+i*70,ok=res[i]===1,col=rgba(ok?INK:SOFT,1);if(ok)tick_(c,752,y,34,AG_GRN,1);else cross_(c,752,y,30,AG_RED,1);
      if(tw(c,j,jz,700)<=214)T(c,j,776,y+9,{w:700,size:jz,color:col});else wrapT(c,j,776,y-4,214,{w:700,size:jz,lh:jz+4,color:col});});
    c.restore();},
  // the scenarios: drawn large, since learn.js shows them at 600 by 320 in a narrow column; components with fixed small labels are scaled up
  ag_q_warn:(c,w,h,st,L)=>{const V=L.vis;c.save();ag_lfit(c,w,h,1200,640);
    c.save();c.translate(60,30);c.scale(1.5,1.5);ag_code(c,0,0,720,"tests/_singular_tests.yml",["  - name: reconcile_planning_with_census_report","    config:","      meta: {owner: Planning}","+     severity: warn"],{size:20,lh:32,label:V.draft||AG_DRAFT,draft:true,lineCol:{3:AG_AMB}});c.restore();
    tag(c,600,470,V.q.fail,AG_RED,{align:"center",size:40});T(c,V.q.until,600,580,{w:700,size:38,align:"center",color:rgba(AG_AMB,1)});c.restore();},
  ag_q_emails:(c,w,h,st,L)=>{const V=L.vis;c.save();ag_lfit(c,w,h,1200,640);glass(c,40,30,1120,580,18,KT_AI,{glow:12,ea:0.7,fill:"rgba(6,12,20,0.96)"});
    wrapT(c,V.q.emails,90,108,1020,{w:800,size:42,lh:52});for(let i=0;i<7;i++){const y=230+i*50;c.fillStyle=rgba([205,225,255],0.18);rr(c,90,y,260+160*hash(i,3),24,8);c.fill();c.fillStyle=rgba([205,225,255],0.1);rr(c,540,y,180+140*hash(i,9),24,8);c.fill();}
    tag(c,1000,390,"500",AG_RED,{align:"center",size:56});c.restore();},
  ag_q_diff:(c,w,h,st,L)=>{const V=L.vis;c.save();ag_lfit(c,w,h,1200,640);ag_db(c,260,190,240,170,"",[150,176,214],1,{});ag_db(c,940,190,240,170,"",KT_AI,1,{});
    T(c,"main",260,370,{f:"mono",w:500,size:38,align:"center",color:rgba([150,176,214],1)});T(c,V.q.branch||"branch",940,370,{f:"mono",w:500,size:38,align:"center",color:rgba(KT_AI,1)});
    arrowTo(c,400,190,780,190,SOFT,0.8,{head:18});tick_(c,330,470,48,AG_GRN,1);T(c,V.q.pass,370,484,{w:700,size:40,color:rgba(AG_GRN,1)});
    tag(c,600,580,V.q.rows,AG_AMB,{align:"center",size:38});c.restore();},
  ag_q_prod:(c,w,h,st,L)=>{const V=L.vis;c.save();ag_lfit(c,w,h,1200,640);T(c,V.prod,220,100,{w:800,size:38,align:"center",color:rgba(TRUST,1)});ag_door(c,100,140,240,320,"",TRUST,0,0,{});
    T(c,"?",220,340,{w:800,size:110,align:"center",color:rgba(AG_AMB,1)});ag_key(c,800,190,1.7,1,{title:V.key});
    wrapT(c,V.q.ask,800,380,700,{w:700,size:40,lh:52,align:"center",color:rgba(AG_AMB,1)});c.restore();},
  ag_q_twohomes:(c,w,h,st,L)=>{const V=L.vis;c.save();ag_lfit(c,w,h,1200,640);
    c.save();c.translate(20,40);c.scale(1.4,1.4);ag_code(c,0,0,300,V.q.skill,["cte_1 as (","cte_2 as ("],{size:24,lh:38,label:"",edge:AG_AMB});c.restore();
    c.save();c.translate(480,40);c.scale(1.4,1.4);ag_code(c,0,0,500,V.q.conv,["- Then **logical CTEs**,","  one step each, named for","  what they hold","  (`learners_at_census`,","  not `cte2`)."],{size:22,lh:36,label:V.duck||AG_DUCK});c.restore();
    cross_(c,230,440,80,AG_RED,1);c.restore();},
  ag_q_ci:(c,w,h,st,L)=>{const V=L.vis;c.save();ag_lfit(c,w,h,1200,640);for(let i=0;i<5;i++){tick_(c,110+i*100,110,50,AG_GRN,1);}
    T(c,V.q.ci,60,220,{w:800,size:42,color:rgba(AG_GRN,1)});kt_agent(c,220,440,70,0,{});arrowTo(c,310,440,580,440,KT_AI,0.7,{head:18});
    glass(c,600,380,420,120,20,AG_GREY,{glow:6,ea:0.6,fill:"rgba(10,12,20,0.94)"});T(c,V.q.approve,810,456,{w:800,size:44,align:"center",color:rgba(AG_GREY,1)});
    T(c,"?",1100,470,{w:800,size:100,align:"center",color:rgba(AG_AMB,1)});c.restore();},
  ag_q_inc:(c,w,h,st,L)=>{const V=L.vis;c.save();ag_lfit(c,w,h,1200,640);c.save();c.translate(60,30);c.scale(1.6,1.6);ag_stack(c,0,60,300,0,{});c.restore();
    // in mono, so the two hyphens of --full-refresh stay two
    {const ww=tw(c,V.q.inc,38,500,"mono")+40;glass(c,880-ww/2,220,ww,62,31,AG_AMB,{fill:"rgba(7,12,24,0.88)",glow:10,ea:0.8});T(c,V.q.inc,880,264,{f:"mono",w:500,size:38,align:"center",color:rgba(AG_AMB,1)});}T(c,V.q.nochange,880,400,{w:800,size:46,align:"center",color:rgba(AG_GRN,1)});c.restore();},
  ag_q_aisha:(c,w,h,st,L)=>{const V=L.vis;c.save();ag_lfit(c,w,h,1200,640);kt_agent(c,120,150,60,0,{});
    glass(c,230,60,940,180,18,AG_GREY,{glow:8,ea:0.7,fill:"rgba(8,12,20,0.96)"});wrapT(c,(V.q.lq||"“")+V.claims[4].c+(V.q.rq||"”"),260,136,880,{w:700,size:40,lh:52});
    c.save();c.setLineDash([12,10]);c.strokeStyle=rgba(AG_GREY,0.8);c.lineWidth=3;rr(c,230,300,940,110,14);c.stroke();c.restore();T(c,V.q.noquery,700,370,{w:700,size:40,align:"center",color:rgba(AG_GREY,1)});
    tag(c,700,520,V.q.named,AG_RED,{align:"center",size:40});c.restore();}
});
