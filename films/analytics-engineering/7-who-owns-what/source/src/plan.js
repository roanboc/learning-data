/* ===== Who owns what: the film's own pictures (prefixed wo_) =====
   Adelaide, 1858: a chain of old deeds with one link missing, the Torrens register (a heavy book whose page is the title),
   a memorandum of transfer signed with a quill and stamped, and the buyer's hand that traces the chain and then trusts the page.
   The present: four domains on a map, a core model as a product, dbt's three rings of access, doors on tables for grants,
   a second project (a sketch) bridged to the core, the ground every project stands on, and three groups in one project.
   Living things and the materials of the past are drawn soft (bezier outlines, a lit side and a shadow side, a little motion);
   data and systems stay crisp. */

/* ---------- colours ---------- */
// each domain has its own colour: the registrar's is the student system's blue, the learning team's the platform's green;
// Planning and the wallet app, who own their marts, get their own. Amber is a warning: allowed, but wrong.
const WO_REG=SRC3[0][1],WO_LRN=SRC3[1][1],WO_SC=SRC3[2][1],WO_PLN=[255,170,110],WO_WAL=[196,160,255],WO_AMB=[255,200,70];
const WO_DOM={registrar:["registrar's office",WO_REG],learning:["learning team",WO_LRN],planning:["Planning",WO_PLN],wallet:["wallet app",WO_WAL]};
const WO_DUCK="runs on dbt Core · DuckDB",WO_CLOUD="sketch · dbt Cloud only";
const WO_INKP="rgba(58,40,26,0.9)";   // iron-gall ink on paper

/* ---------- code, as files: names and labels at 18 px, code at 18 to 20 px ---------- */
// a file card with the label that says where it runs; lines type out as p goes 0..1. o.lit {i:0..1} highlights lines,
// o.lineCol {i:colour} colours a line, o.glow {i:0..1} makes a line glow, o.label overrides the label ("" for none).
function wo_code(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||19,lh=o.lh||Math.round(sz*1.5),col=o.edge||[170,205,255];
  const lab=o.label===undefined?WO_DUCK:o.label,cloud=lab===WO_CLOUD,lc=cloud?WO_AMB:WEED,nw=tw(ctx,name,18,500,"mono"),lw=lab?tw(ctx,lab,18,700)+28:0,two=!!lab&&nw+lw+64>w,hh=two?88:56,h=o.h||(hh+18+lines.length*lh);
  if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12+10*(o.hi||0),ea:0.65,fill:"rgba(6,10,20,0.95)"});
    if(cloud){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(WO_AMB,0.75);ctx.lineWidth=2;rr(ctx,x-7,y-7,w+14,h+14,18);ctx.stroke();ctx.restore();}
    ctx.fillStyle=rgba(col,0.9);rr(ctx,x+18,y+22,10,10,3);ctx.fill();T(ctx,name,x+38,y+34,{f:"mono",w:500,size:18,color:rgba(col,1)});
    if(lab){const lx=two?x+38:x+w-16-lw,ly=two?y+68:y+28,pa=o.labA==null?1:o.labA;withA(ctx,pa,()=>{if(o.labHi)glow(ctx,lx+lw/2,ly,lw*0.6,lc,0.35*o.labHi);ctx.fillStyle="rgba(8,14,24,0.95)";rr(ctx,lx,ly-15,lw,30,15);ctx.fill();
      ctx.save();if(cloud)ctx.setLineDash([5,4]);ctx.strokeStyle=rgba(lc,0.8);ctx.lineWidth=1.5;rr(ctx,lx,ly-15,lw,30,15);ctx.stroke();ctx.restore();T(ctx,lab,lx+14,ly+6,{w:700,size:18,color:rgba(lc,1)});});}
    ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+hh-6,w-28,1.2);
    const n=o.p==null?lines.length:lines.length*o.p;lines.forEach((l,i)=>{if(i>=n)return;const yy=y+hh+12+lh*0.72+i*lh,q=clamp(n-i,0,1),cm=/^\s*(--|#|<!--|\{#)/.test(l),on=o.lit?o.lit[i]||0:0,gl=o.glow?o.glow[i]||0:0,lc2=o.lineCol&&o.lineCol[i];
      if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.16);rr(ctx,x+10,yy-lh*0.74,w-20,lh*0.98,6);ctx.fill();});
      if(gl>0)glow(ctx,x+40+tw(ctx,l,sz,500,"mono")*0.5,yy-sz*0.35,tw(ctx,l,sz,500,"mono")*0.5,o.litCol||TRUST,0.25*gl);
      T(ctx,typeOn(l,q),x+22,yy,{f:"mono",w:500,size:sz,color:lc2?rgba(lc2,1):cm?rgba(SOFT,0.85):rgba(mix([205,225,255],o.litCol||TRUST,on*0.55),0.96)});});});
  return h;}
// the height a code card will have, to lay out what follows it
function wo_codeH(ctx,w,name,n,o){o=o||{};const sz=o.size||19,lh=o.lh||Math.round(sz*1.5),lab=o.label===undefined?WO_DUCK:o.label,two=!!lab&&tw(ctx,name,18,500,"mono")+tw(ctx,lab,18,700)+28+64>w;return (two?88:56)+18+n*lh;}

// a person's name and role, at sizes that read at 1920x1080
function wo_role(ctx,x,y,id,a,o){o=o||{};withA(ctx,a==null?1:a,()=>{const P=PEOPLE[id];T(ctx,o.name||P.name.split(" ")[0],x,y,{w:800,size:24,align:"center"});if(o.role!==false)T(ctx,o.role||P.role,x,y+27,{w:600,size:18,align:"center",color:rgba(SOFT,1)});});}
// a team that owns its marts: three people, head and shoulders, drawn softly in the team's colour, breathing a little
function wo_team(ctx,x,y,s,col,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  [[-46,6,0.86,1],[46,6,0.86,2],[0,0,1,0]].forEach(([dx,dy,k,i])=>{const b=Math.sin(t*1.6+i*1.3)*1.2,cx=x+dx*s,cy=y+dy*s+b*s,r=24*s*k,sh=col,skin=[[214,170,140],[150,104,78],[232,196,168]][i];
    // shoulders: a soft rounded body, lit from the upper left
    ctx.save();const g=ctx.createLinearGradient(cx-50*s*k,cy,cx+50*s*k,cy+80*s*k);g.addColorStop(0,rgba(mix(sh,[255,255,255],0.15),1));g.addColorStop(1,rgba(mix(sh,[10,14,30],0.55),1));ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(cx-52*s*k,cy+84*s*k);ctx.bezierCurveTo(cx-54*s*k,cy+40*s*k,cx-34*s*k,cy+22*s*k,cx,cy+22*s*k);ctx.bezierCurveTo(cx+34*s*k,cy+22*s*k,cx+54*s*k,cy+40*s*k,cx+52*s*k,cy+84*s*k);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;ctx.stroke();
    // a head: skin with a lit side, and hair
    const hg=ctx.createRadialGradient(cx-r*0.35,cy-r*0.4,r*0.2,cx,cy,r*1.1);hg.addColorStop(0,rgba(mix(skin,[255,255,255],0.18),1));hg.addColorStop(1,rgba(mix(skin,[40,24,16],0.35),1));ctx.fillStyle=hg;
    ctx.beginPath();ctx.ellipse(cx,cy,r*0.86,r,0,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle=["rgba(40,28,22,0.95)","rgba(20,16,18,0.95)","rgba(150,110,60,0.95)"][i];ctx.beginPath();ctx.ellipse(cx,cy-r*0.45,r*0.9,r*0.6,0,Math.PI,TAU);ctx.quadraticCurveTo(cx+r*0.6,cy-r*0.6,cx-r*0.2,cy-r*0.55);ctx.closePath();ctx.fill();ctx.restore();});
  if(o.label){T(ctx,o.label,x,y+(o.ly||118)*s,{w:800,size:o.size||22,align:"center",color:rgba(col,1)});}});}

/* ---------- the past: Adelaide, 1858 ---------- */
// handwriting: lines of iron-gall ink, wavy, written up to p (0..1) along each line
function wo_script(ctx,x,y,w,n,lh,p,seed,o){o=o||{};const q=p==null?1:p;for(let i=0;i<n;i++){const u=clamp(q*n-i,0,1);if(u<=0)break;const lw=w*(i===n-1?0.55:0.82+0.18*hash(i+seed,3));
  ctx.save();ctx.strokeStyle=o.col||WO_INKP;ctx.lineWidth=o.lw||1.6;ctx.lineCap="round";ctx.beginPath();const yy=y+i*lh;
  for(let k=0;k<=Math.floor(lw*u/3);k++){const xx=x+k*3,ph=hash(seed*13+i,k%7);ctx.lineTo(xx,yy+Math.sin(k*1.9+ph*6+i)*(2.2+1.6*hash(i+seed,k%11))-(k%9===0?3:0));}ctx.stroke();ctx.restore();}}
// an old deed: a sheet of laid paper with a heading, lines of hand, a red ribbon and a wax seal; o.ghost draws the one that's missing
function wo_deed(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const rot=o.rot||0;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);
  if(o.ghost){ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle="rgba(222,190,140,0.55)";ctx.lineWidth=2;rr(ctx,0,0,w,h,4);ctx.stroke();ctx.restore();
    const g=ctx.createRadialGradient(w/2,h/2,10,w/2,h/2,w);g.addColorStop(0,"rgba(222,190,140,0.08)");g.addColorStop(1,"rgba(222,190,140,0)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    withA(ctx,o.txt==null?1:o.txt,()=>T(ctx,"?",w/2,h/2+22,{w:800,size:64,align:"center",color:"rgba(222,190,140,0.55)"}));ctx.restore();return;}
  kt_paper(ctx,0,0,w,h,t,{seed:o.seed||1,col:o.col||[232,216,182],curl:0.6,age:0.28});
  const ta=o.txt==null?1:o.txt;withA(ctx,ta,()=>T(ctx,"Indenture",w/2,34,{w:800,size:18,align:"center",color:"rgba(70,46,26,0.92)"}));
  ctx.strokeStyle="rgba(90,62,36,0.5)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(w*0.2,44);ctx.lineTo(w*0.8,44);ctx.stroke();
  wo_script(ctx,18,68,w-36,Math.floor((h-130)/17),17,o.p==null?1:o.p,o.seed||1);
  // the seal, pressed in red wax, with a ribbon running through the fold
  const sx=w*0.72,sy=h-40;ctx.strokeStyle="rgba(150,40,34,0.9)";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sx-26,sy-4);ctx.quadraticCurveTo(sx-10,sy+18,sx-20,sy+40);ctx.moveTo(sx+18,sy);ctx.quadraticCurveTo(sx+28,sy+22,sx+20,sy+44);ctx.stroke();
  waxSeal(ctx,sx,sy,17,WAX,1,1,"");
  if(o.year)withA(ctx,ta,()=>T(ctx,o.year,18,h-32,{f:"mono",w:500,size:18,color:"rgba(80,54,30,0.95)"}));ctx.restore();});}
// the chain of deeds: each one sealed to the one before by a ribbon; p unrolls it from the oldest, gap marks the missing one
const WO_YEARS=["1839","1842","1845","1849","1853","1857"];
function wo_chain(ctx,x0,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return[];const n=6,w=o.w||200,h=o.h||250,gap=o.gap==null?2:o.gap,step=o.step||268,P=[];
  withA(ctx,a,()=>{for(let i=0;i<n;i++){const q=clamp((o.p==null?1:o.p)*n-i,0,1),x=x0+i*step,yy=y+Math.sin(i*1.7)*10,r=(hash(i,4)-0.5)*0.06;P.push([x+w/2,yy+h/2]);if(q<=0)continue;
    // the ribbon to the next deed
    if(i<n-1){const r2=clamp((o.p==null?1:o.p)*n-i-0.6,0,1);if(r2>0){const xa=x+w*0.72+10,ya=yy+h-30,xb=x+step+w*0.2,yb=y+Math.sin((i+1)*1.7)*10+h-20,miss=i+1===gap||i===gap;
      ctx.save();ctx.strokeStyle=miss?"rgba(150,40,34,0.35)":"rgba(150,40,34,0.9)";ctx.lineWidth=5;ctx.lineCap="round";if(miss)ctx.setLineDash([6,9]);ctx.beginPath();ctx.moveTo(xa,ya);ctx.bezierCurveTo(xa+40,ya+60,xb-40,yb+60,lerp(xa,xb,r2),lerp(ya,yb,r2)+Math.sin(Math.PI*r2)*40);ctx.stroke();ctx.restore();}}
    const dy=(1-ease(q))*-26;wo_deed(ctx,x,yy+dy,w,h,t,{a:ease(q),ghost:i===gap&&o.gapShown!==false,txt:o.txt,seed:i+3,rot:r,year:WO_YEARS[i],p:clamp(q*1.4,0,1)});
    if(i===gap&&o.gapShown!==false)withA(ctx,o.txt==null?1:o.txt,()=>T(ctx,WO_YEARS[i],x+18,yy+h-32,{f:"mono",w:500,size:18,color:"rgba(222,190,140,0.6)"}));}});
  return P;}
// a hand that points, coming in from the right edge: dark wool sleeve, a white shirt cuff, the index finger's tip at (x,y).
// Drawn with tapering curves, a lit upper side and a shadowed underside; it breathes a little.
function wo_hand(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate((o.rot||-0.08)+0.015*Math.sin(t*1.4));
  const press=o.press||0;ctx.translate(0,press*4);
  // the sleeve, off to the right: wool, with soft folds
  const sl=()=>{ctx.beginPath();ctx.moveTo(236,-58);ctx.bezierCurveTo(400,-74,700,-90,1400,-96);ctx.lineTo(1400,110);ctx.bezierCurveTo(700,104,400,92,236,70);ctx.bezierCurveTo(226,30,226,-20,236,-58);ctx.closePath();};
  let g=ctx.createLinearGradient(0,-90,0,110);g.addColorStop(0,"#5a4636");g.addColorStop(0.45,"#3a2c22");g.addColorStop(1,"#1a120c");ctx.fillStyle=g;sl();ctx.fill();
  ctx.strokeStyle="rgba(120,96,74,0.45)";ctx.lineWidth=2.4;[[300,-62,330,60],[390,-70,420,78],[520,-80,560,90]].forEach(([x0,y0,x1,y1])=>{ctx.beginPath();ctx.moveTo(x0,y0);ctx.bezierCurveTo(x0+30,y0+40,x1-30,y1-40,x1,y1);ctx.stroke();});
  ctx.strokeStyle="rgba(180,150,120,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(250,-54);ctx.bezierCurveTo(420,-70,700,-84,1000,-90);ctx.stroke();
  // the cuff
  g=ctx.createLinearGradient(0,-56,0,66);g.addColorStop(0,"#fbf6ea");g.addColorStop(0.6,"#dcd3c1");g.addColorStop(1,"#a99d88");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(196,-50);ctx.bezierCurveTo(214,-56,232,-58,244,-56);ctx.bezierCurveTo(236,-16,236,30,244,66);ctx.bezierCurveTo(230,68,212,66,196,60);ctx.bezierCurveTo(188,24,188,-14,196,-50);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(120,110,96,0.6)";ctx.lineWidth=1.4;ctx.stroke();
  const skin=o.skin||[232,192,160],lit=rgba(mix(skin,[255,248,236],0.3),1),mid=rgba(skin,1),dk=rgba(mix(skin,[90,50,30],0.4),1),edge="rgba(120,70,44,0.55)";
  const sg=(y0,y1)=>{const q=ctx.createLinearGradient(0,y0,0,y1);q.addColorStop(0,lit);q.addColorStop(0.5,mid);q.addColorStop(1,dk);return q;};
  // curled fingers under the hand, each its own soft roll, darker as they turn under
  [[78,36,26,14,0.3],[70,20,26,13,0.2],[66,4,25,12,0.1]].forEach(([fx,fy,rx,ry,rt])=>{ctx.beginPath();ctx.ellipse(fx,fy,rx,ry,rt,0,TAU);ctx.fillStyle=sg(fy-ry,fy+ry);ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=1.3;ctx.stroke();});
  // the back of the hand, to the wrist
  ctx.beginPath();ctx.moveTo(66,-30);ctx.bezierCurveTo(98,-46,160,-50,200,-44);ctx.bezierCurveTo(206,-10,206,26,200,52);ctx.bezierCurveTo(164,58,120,58,94,48);ctx.bezierCurveTo(74,40,58,24,58,4);ctx.bezierCurveTo(58,-12,60,-22,66,-30);ctx.closePath();
  ctx.fillStyle=sg(-50,58);ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=1.5;ctx.stroke();
  ctx.strokeStyle="rgba(150,96,66,0.35)";ctx.lineWidth=1.4;[[110,-40,150,-34],[118,-30,170,-26]].forEach(([x0,y0,x1,y1])=>{ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2,y0-4,x1,y1);ctx.stroke();});
  // the index finger, tapering to its tip, with a nail and two creases
  ctx.beginPath();ctx.moveTo(76,-32);ctx.bezierCurveTo(52,-33,24,-27,6,-21);ctx.bezierCurveTo(-5,-18,-6,-4,4,-3);ctx.bezierCurveTo(24,-1,50,-6,74,-8);ctx.closePath();ctx.fillStyle=sg(-34,-2);ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle="rgba(255,236,224,0.75)";ctx.beginPath();ctx.ellipse(10,-16,7,3.6,-0.12,0,TAU);ctx.fill();ctx.strokeStyle="rgba(170,110,90,0.5)";ctx.lineWidth=1;ctx.stroke();
  ctx.strokeStyle="rgba(150,96,66,0.45)";ctx.lineWidth=1.2;[[34,-28,34,-6],[54,-31,55,-7]].forEach(([x0,y0,x1,y1])=>{ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(x0-3,(y0+y1)/2,x1,y1);ctx.stroke();});
  // the thumb, along the near side
  ctx.beginPath();ctx.moveTo(130,-40);ctx.bezierCurveTo(112,-58,86,-56,70,-46);ctx.bezierCurveTo(62,-41,64,-33,74,-33);ctx.bezierCurveTo(92,-33,112,-30,132,-24);ctx.closePath();ctx.fillStyle=sg(-58,-24);ctx.fill();ctx.strokeStyle=edge;ctx.lineWidth=1.4;ctx.stroke();
  ctx.fillStyle="rgba(255,236,224,0.6)";ctx.beginPath();ctx.ellipse(76,-44,6,3.2,-0.4,0,TAU);ctx.fill();
  ctx.restore();});}
// a quill, its nib at (x,y): a goose feather with a curved vane, barbs and a lit edge; it moves as it writes
function wo_quill(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.rotate((o.rot==null?-0.75:o.rot)+0.03*Math.sin(t*2.1));
  // shaft
  ctx.strokeStyle="#e8dcc0";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(4,-150,14,-300);ctx.stroke();
  ctx.fillStyle="#3a2a1c";ctx.beginPath();ctx.moveTo(-2,0);ctx.lineTo(2,-24);ctx.lineTo(5,-24);ctx.closePath();ctx.fill();
  // the vane, two sides, the far one in shadow
  const vane=(side,c0,c1)=>{ctx.beginPath();ctx.moveTo(4,-70);ctx.bezierCurveTo(side*40,-110,side*52,-220,14+side*30,-300);ctx.bezierCurveTo(14+side*8,-320,16,-310,14,-300);ctx.quadraticCurveTo(8,-180,4,-70);ctx.closePath();
    const g=ctx.createLinearGradient(side*50,-300,0,-70);g.addColorStop(0,c0);g.addColorStop(1,c1);ctx.fillStyle=g;ctx.fill();};
  vane(1,"rgba(190,176,150,0.95)","rgba(130,116,96,0.9)");vane(-1,"rgba(250,244,230,0.98)","rgba(214,200,176,0.95)");
  ctx.strokeStyle="rgba(120,104,84,0.45)";ctx.lineWidth=1;for(let k=0;k<20;k++){const u=k/20,yy=-80-u*215,xx=4+u*10;[-1,1].forEach(sd=>{ctx.beginPath();ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx+sd*18,yy-10,xx+sd*(26+18*Math.sin(Math.PI*u)),yy-22+hash(k,sd+5)*6);ctx.stroke();});}
  ctx.restore();});}
// a signature: a few loops of ink, written up to p
function wo_sign(ctx,x,y,s,p,col){if(p<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=col||"rgba(30,26,60,0.92)";ctx.lineWidth=2.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
  const N=90;for(let i=0;i<=N*p;i++){const u=i/N,xx=u*200,yy=-Math.sin(u*TAU*3.2)*14*(1-u*0.4)-Math.cos(u*TAU*1.6)*6+(u>0.85?(u-0.85)*60:0);i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();
  if(p>0.95){ctx.beginPath();ctx.moveTo(-6,16);ctx.quadraticCurveTo(100,8,214,14);ctx.stroke();}ctx.restore();}
// the register: a heavy book open on one certificate of title. Left page: the parcel, in outline, with its section number;
// right page: the proprietor. o.change (0..1) strikes the old owner and writes the new; o.close (0..1) shuts it.
function wo_register(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const cl=ease(clamp(o.close||0,0,1)),op=ease(clamp(o.open==null?1:o.open,0,1)),gx=x+w/2;
  withA(ctx,a,()=>{
    // the boards and the leather spine, seen at the head
    ctx.save();ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=34;ctx.shadowOffsetY=14;const bw=lerp(w/2,w,op*(1-cl)),bx=gx-bw*(op*(1-cl))-(1-op*(1-cl))*0;
    const bg=ctx.createLinearGradient(x,y,x+w,y+h);bg.addColorStop(0,"#6e3c22");bg.addColorStop(1,"#341a0d");ctx.fillStyle=bg;
    const lx=lerp(gx,x-16,op*(1-cl)),rx2=x+w+16;ctx.beginPath();ctx.moveTo(lx,y-6);ctx.quadraticCurveTo((lx+rx2)/2,y+8,rx2,y-6);ctx.lineTo(rx2,y+h+16);ctx.quadraticCurveTo((lx+rx2)/2,y+h+28,lx,y+h+16);ctx.closePath();ctx.fill();ctx.restore();
    // pages: the left one swings shut over the right as the book closes (drawn as a page whose outer edge travels to the gutter and over)
    const page=(x0,x1,lift)=>{const dir=x1>x0?1:-1;ctx.beginPath();ctx.moveTo(x0,y+6-lift);ctx.bezierCurveTo(lerp(x0,x1,0.4),y-8-lift,lerp(x0,x1,0.8),y+2,x1,y+16);ctx.lineTo(x1,y+h-4);ctx.bezierCurveTo(lerp(x0,x1,0.8),y+h+6,lerp(x0,x1,0.4),y+h+14,x0+dir*2,y+h+6-lift*0.5);ctx.quadraticCurveTo(x0-dir*3,y+h/2,x0,y+6-lift);ctx.closePath();};
    const fill=(x0,x1)=>{const g=ctx.createLinearGradient(x0,y,x1,y);g.addColorStop(0,"#f2e7cc");g.addColorStop(0.75,"#e6d4ad");g.addColorStop(1,"#bda274");ctx.fillStyle=g;ctx.fill();ctx.strokeStyle="rgba(120,90,50,0.4)";ctx.lineWidth=1.2;ctx.stroke();};
    // the right page: the proprietor, and below, the dealings registered on this title
    page(x+w,gx,4+3*Math.sin(t*1.1));fill(x+w,gx);
    ctx.save();page(x+w,gx,0);ctx.clip();const R=gx+40,cw=w/2-80;
    T(ctx,"PROPRIETOR",R,y+70,{w:800,size:18,color:"rgba(80,50,26,0.95)"});
    const ch=clamp(o.change||0,0,1);T(ctx,o.owner||"Wm. Hartley, farmer",R,y+112,{w:700,size:22,color:WO_INKP});
    if(ch>0){ctx.strokeStyle="rgba(150,40,34,0.85)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(R-4,y+104);ctx.lineTo(R-4+(tw(ctx,o.owner||"Wm. Hartley, farmer",22,700)+8)*clamp(ch*2,0,1),y+104);ctx.stroke();
      withA(ctx,clamp(ch*2-1,0,1),()=>T(ctx,typeOn(o.owner2||"Eliza Penrose, of Adelaide",clamp(ch*2-1,0,1)),R,y+148,{w:700,size:22,color:"rgba(30,26,70,0.95)"}));}
    T(ctx,"DEALINGS",R,y+210,{w:800,size:18,color:"rgba(80,50,26,0.95)"});wo_script(ctx,R,y+246,cw,5,26,1,7);
    if(ch>0.5)withA(ctx,clamp(ch*2-1,0,1),()=>{ctx.fillStyle="rgba(150,40,34,0.12)";rr(ctx,R-10,y+h-110,cw+20,46,6);ctx.fill();T(ctx,"Transfer registered",R,y+h-80,{w:700,size:18,color:"rgba(130,40,30,0.95)"});});
    const gs=ctx.createLinearGradient(gx+60,0,gx,0);gs.addColorStop(0,"rgba(80,50,20,0)");gs.addColorStop(1,"rgba(80,50,20,0.35)");ctx.fillStyle=gs;ctx.fillRect(gx,y-10,60,h+30);ctx.restore();
    // the left page: the certificate's heading and the parcel. It swings over to close the book
    const lx1=lerp(x,gx+w/2,cl);page(lx1,gx,0);fill(lx1,gx);
    if(cl<0.5)withA(ctx,1-cl*2,()=>{ctx.save();page(x,gx,0);ctx.clip();const L=x+40;
      T(ctx,"CERTIFICATE OF TITLE",L,y+70,{w:800,size:18,color:"rgba(80,50,26,0.95)"});T(ctx,"Register Book · Vol. I · Folio 1",L,y+98,{w:600,size:18,color:"rgba(100,70,40,0.9)"});
      const px=L+30,py=y+150,pw=w/2-130,ph=h-250,pp=o.parcel==null?1:o.parcel;ctx.strokeStyle="rgba(60,40,24,0.9)";ctx.lineWidth=2;ctx.beginPath();
      const Q=[[0,0.1],[0.7,0],[1,0.35],[0.85,1],[0.1,0.9]];for(let i=0;i<=5*pp;i++){const[qx,qy]=Q[i%5];ctx.lineTo(px+qx*pw,py+qy*ph);}ctx.stroke();
      if(pp>=1){ctx.save();ctx.beginPath();Q.forEach(([qx,qy],i)=>i?ctx.lineTo(px+qx*pw,py+qy*ph):ctx.moveTo(px+qx*pw,py+qy*ph));ctx.closePath();ctx.clip();ctx.strokeStyle="rgba(60,40,24,0.18)";ctx.lineWidth=1;for(let k=-ph;k<pw;k+=12){ctx.beginPath();ctx.moveTo(px+k,py);ctx.lineTo(px+k+ph,py+ph);ctx.stroke();}ctx.restore();
        T(ctx,"Section 412",px+pw*0.45,py+ph*0.55,{w:800,size:20,align:"center",color:"rgba(60,40,24,0.95)"});T(ctx,"80 acres",px+pw*0.45,py+ph*0.55+26,{w:600,size:18,align:"center",color:"rgba(80,56,32,0.9)"});}
      ctx.restore();});
    else{ctx.save();page(lx1,gx,0);ctx.clip();const g=ctx.createLinearGradient(lx1,0,gx,0);g.addColorStop(0,"rgba(70,40,20,0.25)");g.addColorStop(1,"rgba(70,40,20,0)");ctx.fillStyle=g;ctx.fillRect(Math.min(lx1,gx),y,Math.abs(gx-lx1),h);ctx.restore();}
    // once shut, the front board: leather with a gilt panel and the register's name
    if(cl>0.85)withA(ctx,(cl-0.85)/0.15,()=>{const bx=gx-14,bw2=w/2+30;const g=ctx.createLinearGradient(bx,y,bx+bw2,y+h);g.addColorStop(0,"#7a4629");g.addColorStop(0.5,"#55301b");g.addColorStop(1,"#2e170c");ctx.fillStyle=g;rr(ctx,bx,y-6,bw2,h+20,10);ctx.fill();
      for(let i=0;i<110;i++){const px=bx+hash(i,21)*bw2,py=y+hash(i,22)*h;ctx.fillStyle=hash(i,24)>0.5?"rgba(20,8,2,0.22)":"rgba(160,110,70,0.1)";ctx.beginPath();ctx.ellipse(px,py,2.2,1.4,hash(i,25)*3,0,TAU);ctx.fill();}
      const sh=ctx.createRadialGradient(bx+bw2*0.3,y+h*0.25,10,bx+bw2*0.4,y+h*0.35,bw2);sh.addColorStop(0,"rgba(255,220,170,0.16)");sh.addColorStop(1,"rgba(255,220,170,0)");ctx.fillStyle=sh;ctx.fillRect(bx,y,bw2,h);
      ctx.strokeStyle="rgba(222,178,98,0.85)";ctx.lineWidth=3;rr(ctx,bx+26,y+20,bw2-52,h-40,6);ctx.stroke();ctx.lineWidth=1.2;rr(ctx,bx+36,y+30,bw2-72,h-60,4);ctx.stroke();
      T(ctx,"REGISTER BOOK",bx+bw2/2,y+h*0.42,{w:800,size:28,align:"center",color:"rgba(232,192,112,0.95)"});T(ctx,"South Australia · 1858",bx+bw2/2,y+h*0.42+40,{w:700,size:20,align:"center",color:"rgba(232,192,112,0.85)"});});});}
// a memorandum of transfer: a printed form, the owner's signature (sig 0..1) and the registrar's stamp (press 0..1)
function wo_transfer(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?0.04:o.rot);ctx.translate(-w/2,-h/2);
  kt_paper(ctx,0,0,w,h,t,{seed:11,col:[240,228,200],curl:0.7,age:0.2});
  T(ctx,"MEMORANDUM OF TRANSFER",w/2,40,{w:800,size:20,align:"center",color:"rgba(70,46,26,0.95)"});T(ctx,"Real Property Act, 1858",w/2,66,{w:600,size:18,align:"center",color:"rgba(100,70,40,0.9)"});
  wo_script(ctx,26,104,w-52,5,24,1,21);
  ctx.strokeStyle="rgba(90,62,36,0.6)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(26,h-96);ctx.lineTo(w*0.62,h-96);ctx.stroke();T(ctx,"signed by the proprietor",26,h-72,{w:600,size:18,color:"rgba(100,70,40,0.9)"});
  wo_sign(ctx,34,h-112,0.9,o.sig||0);
  const pr=o.press||0;if(pr>0){const sx=w-86,sy=h-100,k=ease(clamp(pr,0,1));withA(ctx,k,()=>{ctx.save();ctx.translate(sx,sy);ctx.rotate(-0.2);ctx.scale(1.4-0.4*k,1.4-0.4*k);ctx.strokeStyle="rgba(140,36,30,0.85)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,50,0,TAU);ctx.stroke();ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,42,0,TAU);ctx.stroke();
    T(ctx,"REGISTERED",0,6,{w:800,size:18,align:"center",color:"rgba(140,36,30,0.9)"});ctx.restore();});}
  ctx.restore();});}

/* ---------- the present ---------- */
// a gold-edged card: a core model, published. o.stack draws the other core models behind it
const WO_CORE=["core_learner","core_award","core_credential","core_credit_towards_award"];
function wo_coreCard(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const st=o.stack||0;
  for(let i=3;i>=1;i--){if(st<=0)break;withA(ctx,st*(0.9-i*0.15),()=>{const dx=i*26,dy=-i*22;glass(ctx,x+dx,y+dy,w,h,16,TRUST,{glow:6,ea:0.4,fill:"rgba(10,12,20,0.96)"});T(ctx,WO_CORE[i],x+dx+w-20,y+dy+30,{f:"mono",w:500,size:18,align:"right",color:rgba(TRUST,0.7)});});}
  glow(ctx,x+w/2,y+h/2,w*0.7,TRUST,0.12+0.1*(o.hi||0));glass(ctx,x,y,w,h,16,TRUST,{glow:22,ea:0.95,lw:3,fill:"rgba(12,12,18,0.97)"});
  ctx.strokeStyle=rgba(TRUST,0.5);ctx.lineWidth=1;rr(ctx,x+8,y+8,w-16,h-16,10);ctx.stroke();
  T(ctx,o.name||"core_learner",x+28,y+56,{f:"mono",w:500,size:30,color:rgba(TRUST,1)});
  if(o.sub)T(ctx,o.sub,x+28,y+94,{w:600,size:20,color:rgba(SOFT,1)});});}
// a small latch: open (0) or shut (1), the contract's clasp from the film before
function wo_latch(ctx,x,y,s,shut,col){col=col||TRUST;const u=ease(clamp(shut,0,1));ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,0.18);ctx.lineWidth=3;
  rr(ctx,-16,-10,32,24,4);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-10,-10);ctx.lineTo(-10,-20);ctx.arc(0,-20,10,Math.PI,0,false);ctx.lineTo(10,-20+(1-u)*-14+(u<0.5?0:10));ctx.stroke();ctx.restore();}
// the product card: a core model and what it publishes. on[i] lights each part as it's named
const WO_PROD=[["grain","One row per learner per version"],["owner","Mei Tanaka, registrar's office"],["domain","registrar"],["glossary term","learner"],["contract","enforced"],["version","v1"],["docs","{{ doc(\"learner\") }}"]];
function wo_product(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const on=o.on||[],rh=o.rh||60,h=116+rh*WO_PROD.length;withA(ctx,a,()=>{
  wo_coreCard(ctx,x,y,w,h,{name:"core_learner",sub:"a data product",hi:o.hi});
  WO_PROD.forEach(([k,v],i)=>{const q=on[i]||0,yy=y+140+i*rh;withA(ctx,0.32+0.68*q,()=>{if(q>0)withA(ctx,q,()=>{ctx.fillStyle=rgba(TRUST,0.07);rr(ctx,x+16,yy-rh*0.62,w-32,rh*0.9,8);ctx.fill();});
    T(ctx,k,x+30,yy,{w:700,size:20,color:rgba(SOFT,1)});const vx=x+220,col=k==="domain"?WO_REG:INK;
    if(k==="contract"){wo_latch(ctx,vx+14,yy-8,0.9,o.latch||0);T(ctx,v,vx+42,yy,{w:700,size:22,color:rgba(GOOD,q)});}
    else if(k==="version"){tag(ctx,vx,yy-8,v,TRUST,{size:20});}
    else T(ctx,v,vx,yy,{f:k==="docs"?"mono":undefined,w:k==="docs"?500:700,size:k==="docs"?19:22,color:rgba(col,1)});});});});
  return h;}

// a territory on the map: a soft-edged region in the domain's colour, its name, and what it owns
function wo_terr(ctx,x,y,w,h,col,name,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const sd=o.seed||1;
  ctx.save();ctx.beginPath();const N=28;for(let i=0;i<=N;i++){const u=i/N*TAU,cx=x+w/2,cy=y+h/2,ex=Math.cos(u),ey=Math.sin(u),k=Math.pow(Math.pow(Math.abs(ex),6)+Math.pow(Math.abs(ey),6),-1/6),wob=1+0.012*Math.sin(u*5+sd)+0.008*Math.sin(t*0.5+u*3+sd);
    const px=cx+ex*k*w/2*wob,py=cy+ey*k*h/2*wob;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(col,0.13));g.addColorStop(1,rgba(col,0.04));ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=rgba(col,0.75);ctx.lineWidth=2;ctx.setLineDash([2,0]);ctx.shadowColor=rgba(col,0.5);ctx.shadowBlur=10;ctx.stroke();ctx.restore();
  T(ctx,name,x+44,y+52,{w:800,size:24,color:rgba(col,1)});});}
// a chip: one thing a domain owns
function wo_chip(ctx,x,y,s,col,o){o=o||{};const sz=o.size||20,mono=!!o.mono,w=tw(ctx,s,sz,mono?500:700,mono?"mono":undefined)+28,h=sz+18;glass(ctx,x,y-h/2,w,h,10,col,{glow:8,ea:0.75,fill:"rgba(7,12,24,0.93)"});
  T(ctx,s,x+14,y+sz*0.36,{f:mono?"mono":undefined,w:mono?500:700,size:sz,color:rgba(o.text||INK,1)});return w;}
// a small pennant on a model: its meta.domain
function wo_pennant(ctx,x,y,col,a){if(a<=0.01)return;withA(ctx,a,()=>{const k=ease(a);ctx.strokeStyle=rgba(INK,0.8);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-26*k);ctx.stroke();
  ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(x,y-26*k);ctx.lineTo(x+16,y-21*k);ctx.lineTo(x,y-15*k);ctx.closePath();ctx.fill();});}
function wo_dot(ctx,x,y,col,a,r){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,(r||7)*3,col,0.3);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r||7,0,TAU);ctx.fill();});}

// a project: a box with its name on a tab. o.dash for a sketch
function wo_proj(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(8,12,24,0.55)";rr(ctx,x,y,w,h,22);ctx.fill();
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2.4;if(o.dash)ctx.setLineDash([14,10]);const p=o.p==null?1:o.p;
  if(p<1){const per=2*(w+h);ctx.setLineDash(o.dash?[14,10]:[per*p,per]);}rr(ctx,x,y,w,h,22);ctx.stroke();ctx.restore();
  const tw_=tw(ctx,name,22,800)+36;ctx.fillStyle="rgba(8,12,24,0.98)";rr(ctx,x+24,y-18,tw_,36,18);ctx.fill();ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=1.6;rr(ctx,x+24,y-18,tw_,36,18);ctx.stroke();
  T(ctx,name,x+42,y+8,{w:800,size:22,color:rgba(col,1)});});}

// dbt's three rings of access around (cx,cy): public (outer), protected, private (inner). o.ring[i] draws each, o.lit[i] lights it
const WO_RING=[["public","any project",TRUST,520,330],["protected","this project only",[120,215,155],370,232],["private","same group only",[178,156,255],215,128]];
function wo_rings(ctx,cx,cy,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const dr=o.ring||[1,1,1],li=o.lit||[0,0,0],k=o.s||1;withA(ctx,a,()=>{
  WO_RING.forEach(([nm,sub,col,rx,ry],i)=>{const q=dr[i];if(q<=0)return;const l=li[i]||0;ctx.save();
    if(q>=1){ctx.fillStyle=rgba(col,0.035+0.04*l);ctx.beginPath();ctx.ellipse(cx,cy,rx*k,ry*k,0,0,TAU);ctx.fill();}
    ctx.strokeStyle=rgba(col,0.45+0.5*l);ctx.lineWidth=2+1.5*l;ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=6+10*l;ctx.beginPath();ctx.ellipse(cx,cy,rx*k,ry*k,0,-Math.PI/2,-Math.PI/2+TAU*q);ctx.stroke();ctx.restore();});
  // each label sits inside its own band, below the centre, clear of the strokes (only at full size: small rings use wo_ringKey)
  WO_RING.forEach(([nm,sub,col],i)=>{const q=fin(dr[i],0.6,0.4);if(q<=0||o.noLabels||k<1)return;const ly=cy+[272,170,80][i];withA(ctx,q,()=>{
    T(ctx,nm,cx,ly,{w:800,size:24,align:"center",color:rgba(col,1)});T(ctx,sub,cx,ly+24,{w:600,size:18,align:"center",color:rgba(mix(col,INK,0.35),0.95)});});});});}
// a key for small rings: the three names in a row, each over what it allows, centred on x across width w
function wo_ringKey(ctx,x,y,w,a){if(a<=0.01)return;withA(ctx,a,()=>WO_RING.forEach(([nm,sub,col],i)=>{const kx=x+w*(i*2+1)/6;
  ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.ellipse(kx-tw(ctx,nm,20,800)/2-16,y-7,7,5,0,0,TAU);ctx.fill();
  T(ctx,nm,kx,y,{w:800,size:20,align:"center",color:rgba(col,1)});T(ctx,sub,kx,y+26,{w:600,size:18,align:"center",color:rgba(mix(col,INK,0.35),0.95)});}));}
// where the models sit in the rings, relative to the centre, at scale 1: the core in the public band, the marts in the
// protected band, staging and intermediate inside the private ring
const WO_RN={core:[[-140,-280],[-70,-288],[0,-290],[70,-288],[140,-280]],plan:[-150,-176],wal:[[230,40],[270,70]],trial:[200,-150],
  stg:[[-150,-60],[-118,-26],[-150,10],[-110,40],[-80,-62],[-80,-6],[-74,44]],int:[[30,-62],[70,-40],[110,-10],[150,-46],[40,-8],[80,26],[124,34],[36,44]]};
function wo_ringNodes(ctx,cx,cy,t,o){o=o||{};const k=o.s||1,P=(p)=>[cx+p[0]*k,cy+p[1]*k];
  const cq=o.core||0,mq=o.marts||0,pq=o.priv||0;
  WO_RN.core.forEach((p,i)=>{const[x,y]=P(p);wo_dot(ctx,x,y,TRUST,fin(cq,i*0.1,0.4),7);});
  {const[x,y]=P(WO_RN.plan);wo_dot(ctx,x,y,WO_PLN,mq,8);}
  WO_RN.wal.forEach((p,i)=>{const[x,y]=P(p);wo_dot(ctx,x,y,WO_WAL,fin(mq,0.1+i*0.15,0.4),7);});
  WO_RN.stg.forEach((p,i)=>{const[x,y]=P(p);wo_dot(ctx,x,y,LAYER4[0][1],fin(pq,i*0.05,0.4),6);});
  WO_RN.int.forEach((p,i)=>{const[x,y]=P(p);wo_dot(ctx,x,y,LAYER4[1][1],fin(pq,0.3+i*0.05,0.4),6);});}

// a red bar across an arrow: refused
function wo_bar(ctx,x,y,an,a,s){if(a<=0.01)return;s=s||1;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(an+Math.PI/2);glow(ctx,0,0,30*s,BAD,0.4);ctx.fillStyle=rgba(BAD,1);rr(ctx,-22*s,-5*s,44*s,10*s,4*s);ctx.fill();ctx.restore();});}
// a table in the catalogue, with a door on its front: open (0..1); o.readers lists who may read
function wo_table(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  glass(ctx,x,y,w,h,12,col,{glow:8,ea:0.6,fill:"rgba(8,14,26,0.95)"});for(let r=0;r<4;r++){ctx.fillStyle=rgba(col,0.14+0.04*r);rr(ctx,x+16,y+54+r*22,w-150,10,3);ctx.fill();}
  T(ctx,name,x+16,y+34,{f:"mono",w:500,size:18,color:rgba(col,1)});
  // the door: a frame, a panel that swings open, and a lock
  const dx=x+w-104,dy=y+h-112,dw=72,dh=96,op=ease(clamp(o.open||0,0,1));ctx.fillStyle="rgba(255,236,190,"+(0.1+0.5*op)+")";ctx.fillRect(dx,dy,dw,dh);
  if(op>0){const g=ctx.createRadialGradient(dx+dw/2,dy+dh/2,4,dx+dw/2,dy+dh/2,dw*1.4);g.addColorStop(0,"rgba(255,230,170,"+(0.35*op)+")");g.addColorStop(1,"rgba(255,230,170,0)");ctx.fillStyle=g;ctx.fillRect(dx-dw,dy-dh/2,dw*3,dh*2);}
  ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.strokeRect(dx,dy,dw,dh);
  const pw=dw*(1-0.75*op);ctx.fillStyle=rgba(mix(col,[20,26,40],0.6),1);ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+pw,dy+op*10);ctx.lineTo(dx+pw,dy+dh-op*10);ctx.lineTo(dx,dy+dh);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=1.6;ctx.stroke();
  kt_lock(ctx,dx+dw+16,dy+dh*0.5,0.36,o.lockCol||TRUST,1,op);});}
// a dashboard: a small chart frame, Planning's
function wo_dash(ctx,x,y,w,h,col,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,12,col,{glow:12,ea:0.8,fill:"rgba(8,14,26,0.96)"});
  T(ctx,o.title||"dashboard",x+16,y+32,{w:700,size:18,color:rgba(col,1)});const bh=[0.5,0.8,0.35,0.65,0.9];bh.forEach((v,i)=>{const bw=(w-60)/bh.length,hh=(h-70)*v*(0.92+0.08*Math.sin(t*1.2+i));ctx.fillStyle=rgba(col,0.55+0.08*i);rr(ctx,x+20+i*bw,y+h-16-hh,bw-10,hh,3);ctx.fill();});});}

// a slab of the ground every project stands on
function wo_slab(ctx,x,y,w,h,name,sub,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,rgba(mix(col,[30,34,46],0.55),1));g.addColorStop(1,rgba(mix(col,[6,8,14],0.85),1));
  ctx.fillStyle=g;rr(ctx,x,y,w,h,10);ctx.fill();ctx.strokeStyle=rgba(col,0.8+0.2*(o.hi||0));ctx.lineWidth=2;rr(ctx,x,y,w,h,10);ctx.stroke();if(o.hi)glow(ctx,x+w/2,y+h/2,w*0.5,col,0.2*o.hi);
  ctx.fillStyle=rgba(mix(col,[255,255,255],0.4),0.5);ctx.fillRect(x+10,y+3,w-20,2);
  T(ctx,name,x+w/2,y+40,{w:800,size:24,align:"center",color:rgba(mix(col,INK,0.5),1)});if(sub)T(ctx,sub,x+w/2,y+70,{w:600,size:18,align:"center",color:rgba(SOFT,1)});});}
// a group outline inside a project: dashed, with its owner
function wo_group(ctx,x,y,w,h,name,owner,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;rr(ctx,x,y,w,h,14);ctx.stroke();ctx.restore();
  ctx.fillStyle=rgba(col,0.05);rr(ctx,x,y,w,h,14);ctx.fill();T(ctx,name,x+18,y+34,{f:"mono",w:500,size:20,color:rgba(col,1)});if(owner)T(ctx,"owner: "+owner,x+18,y+62,{w:600,size:18,color:rgba(SOFT,1)});});}

// the credential project, small: its models in four columns (7 staging, 8 intermediate, 5 core versions, 3 marts and the time
// spine), each joined to the column before. o.green lights it as a passing build; o.p grows it left to right
const WO_MINI=(()=>{const N=[7,8,5,4],nodes=[],edges=[];N.forEach((n,c)=>{for(let i=0;i<n;i++)nodes.push([c,(i+0.5)/n]);});const start=c=>N.slice(0,c).reduce((a,b)=>a+b,0);
  nodes.forEach((nd,k)=>{if(!nd[0])return;const c=nd[0],n=N[c-1],s0=start(c-1);for(let j=0;j<2;j++)edges.push([s0+Math.floor(clamp(nd[1]+(hash(k,j+3)-0.5)*0.5,0,0.999)*n),k]);});return{nodes,edges};})();
function wo_mini(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p,g=o.green||0,pos=k=>{const[c,v]=WO_MINI.nodes[k];return[x+w*(c+0.5)/4,y+h*v];};withA(ctx,a,()=>{
  LAYER4.forEach(([nm,col],i)=>withA(ctx,clamp(p*4-i,0,1),()=>T(ctx,nm,x+w*(i+0.5)/4,y-22,{w:800,size:22,align:"center",color:rgba(col,1)})));
  WO_MINI.edges.forEach(([i,j])=>{const c=WO_MINI.nodes[j][0],q=clamp(p*4-c+0.3,0,1);if(q<=0)return;const[x0,y0]=pos(i),[x1,y1]=pos(j),cw=w/4;ctx.strokeStyle=rgba(mix(LAYER4[c][1],GOOD,g*0.6),0.3);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x0,y0);ctx.bezierCurveTo(x0+cw*0.4,y0,x1-cw*0.4,y1,lerp(x0,x1,q),lerp(y0,y1,q));ctx.stroke();});
  WO_MINI.nodes.forEach((nd,k)=>{const q=clamp(p*4-nd[0]-hash(k,7)*0.5,0,1);if(q<=0)return;const[px,py]=pos(k),col=LAYER4[nd[0]][1];if(g>0)glow(ctx,px,py,22,GOOD,0.35*g);ctx.fillStyle=rgba(mix(col,GOOD,g*0.5),1);ctx.beginPath();ctx.arc(px,py,(nd[0]===2?9:7)*(0.5+0.5*q),0,TAU);ctx.fill();
    if(g>0)tick_(ctx,px+14,py-12,12,GOOD,g*fin(g,0.3+hash(k,9)*0.5,0.3));});});}
// the ten steps, small: a ring of stations, the lit ones named
function wo_loop(ctx,cx,cy,rx,ry,lit,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(WEED,0.3);ctx.lineWidth=2;ctx.setLineDash([4,8]);ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,TAU);ctx.stroke();ctx.restore();
  for(let i=0;i<10;i++){const[px,py]=stepPos(i,cx,cy,rx,ry),on=lit[i]||0;if(on>0)glow(ctx,px,py,36,WEED,0.35*on);ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(px,py,on>0?20:11,0,TAU);ctx.fill();ring(ctx,px,py,on>0?20:11,mix(SOFT,WEED,on),1,2);
    if(on>0)T(ctx,String(i+1),px,py+7,{w:800,size:20,align:"center",color:rgba(WEED,on)});}
  if(o.label)T(ctx,o.label,cx,cy+8,{w:700,size:20,align:"center",color:rgba(SOFT,1)});});}

/* ---------- the labs' and scenarios' pictures ----------
   Added to the film bundle's LV registry (Keeping it true's true.js defines it; these keys are prefixed wo_ so they never clash).
   assets/from-words-to-data/learn.js calls each as f(ctx, w, h, state, L): a lab passes its state (sort: {pick, checked}; pick: {pick};
   steps: {step}), a scenario passes {q}. Any words come from L.vis (the page's learn.en.js or learn.es.js), so each language draws its
   own; model, file and project names stay as they are in the project. Labs draw in a 960x400 space and scenarios in 900x480, at
   sizes that read on the page; wo_fitS shrinks a label that a longer language would push past its room. */
function wo_fit(c,w,h,bw,bh){const k=Math.min(w/bw,h/bh);c.translate((w-bw*k)/2,(h-bh*k)/2);c.scale(k,k);}
function wo_labOf(L,vis){return(L.labs||[]).find(x=>x.vis===vis)||{w:{}};}
function wo_fitS(c,s,maxW,size,wt,f){let z=size;while(z>16&&tw(c,s,z,wt,f)>maxW)z--;return z;}
// a model as a pill: its name in mono, in its layer's or owner's colour
function wo_lpill(c,x,y,s,col,o){o=o||{};const sz=o.size||22,w=tw(c,s,sz,500,"mono")+32,h=sz+24,X=o.align==="left"?x:x-w/2;glass(c,X,y-h/2,w,h,12,col,{glow:o.glow==null?10:o.glow,ea:0.8,fill:"rgba(7,12,24,0.95)"});
  T(c,s,X+16,y+sz*0.36,{f:"mono",w:500,size:sz,color:rgba(col,1)});return w;}
// a number in a ring, to tie a line of text to a thing in the picture
function wo_num(c,x,y,n,col,r){r=r||16;c.fillStyle="rgba(7,12,24,0.97)";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();ring(c,x,y,r,col,1,2.4);T(c,String(n),x,y+7,{w:800,size:20,align:"center",color:rgba(col,1)});}
function wo_q_mark(c,x,y){T(c,"?",x,y,{w:800,size:48,align:"center",color:rgba(EDGE_,1)});}

// lab 1: eight models, each on the ring its access puts it in; on the right, each one's access, and whether the wallet's mart can ref it
const WO_L8=[[LAYER4[0][1],"credential_model"],[LAYER4[1][1],"credential_model"],[TRUST,"credential_model"],[TRUST,"credential_model"],[WO_PLN,"planning"],[WO_WAL,"wallet"],[WO_WAL,"wallet"],[WO_PLN,"planning"]];
// u public, r protected, v private, for each option of the lab (the keys of its opts)
const WO_LACC={project:"vvuurrrr",none:"rrrrrrrr",public:"uuuuuuuu",intpub:"vuuurrrr",corepriv:"vvvvrrrr"};
const WO_ACCN={u:"public",r:"protected",v:"private"},WO_ACCI={u:0,r:1,v:2};
function wo_l_access(c,w,h,st,L){const V=L.vis,acc=WO_LACC[st.pick]||WO_LACC.project;c.save();wo_fit(c,w,h,960,400);
  const cx=228,cy=198,s=0.4,mid={u:[178,112],r:[118,72],v:[48,24]},n={u:0,r:0,v:0},cnt={u:0,r:0,v:0};for(const k of acc)cnt[k]++;
  wo_rings(c,cx,cy,0,{s,ring:[1,1,1],lit:[0.35,0.25,0.25],noLabels:true});
  WO_L8.forEach(([col],i)=>{const k=acc[i],j=n[k]++,an=-Math.PI/2+(k==="v"?0:0.4)+j*TAU/cnt[k],[rx,ry]=mid[k];wo_num(c,cx+Math.cos(an)*rx,cy+Math.sin(an)*ry,i+1,col,15);});
  ["u","r","v"].forEach((k,i)=>T(c,WO_ACCN[k],cx+(i-1)*140,382,{f:"mono",w:500,size:22,align:"center",color:rgba(WO_RING[i][2],1)}));
  const bad=st.pick==="corepriv";tag(c,cx,24,bad?V.parseBad:V.parseOk,bad?BAD:GOOD,{align:"center",size:20});
  T(c,V.walletCan,950,26,{w:700,size:wo_fitS(c,V.walletCan,470,20,700),align:"right",color:rgba(WO_WAL,1)});
  WO_L8.forEach(([col,grp],i)=>{const y=70+i*43,k=acc[i],acol=WO_RING[WO_ACCI[k]][2],nm=V.l8[i];wo_num(c,490,y-7,i+1,col,15);
    T(c,nm,514,y,{w:700,size:wo_fitS(c,nm,250,22,700),color:rgba(col,1)});
    const aw=tw(c,WO_ACCN[k],20,500,"mono")+24;glass(c,772,y-24,aw,32,16,acol,{glow:6,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,WO_ACCN[k],784,y-1,{f:"mono",w:500,size:20,color:rgba(acol,1)});
    if(i===5)T(c,"·",932,y,{w:800,size:24,align:"center",color:rgba(SOFT,1)});
    else{const ok=k!=="v"||grp==="wallet";(ok?tick_:cross_)(c,932,y-8,12,ok?GOOD:BAD,1);}});
  c.restore();}

// lab 2: four territories, each holding the things placed in it; after checking, each turns green or red
function wo_l_domains(c,w,h,st,L){const V=L.vis,its=wo_labOf(L,"wo_l_domains").w.items||[],keys=["registrar","learning","planning","wallet"];c.save();wo_fit(c,w,h,960,400);
  keys.forEach((k,i)=>{const x=6+i*238,col=WO_DOM[k][1],cxx=x+113;wo_terr(c,x,6,226,388,col,"",0,{seed:i+1});
    T(c,V.domains[i],cxx,48,{w:800,size:wo_fitS(c,V.domains[i],200,22,800),align:"center",color:rgba(col,1)});T(c,V.owners[i],cxx,76,{w:600,size:20,align:"center",color:rgba(SOFT,1)});
    const mine=its.map((it,j)=>[it,j]).filter(([it,j])=>(st.pick||{})[j]===k),step=Math.min(44,280/Math.max(1,mine.length));
    mine.forEach(([it,j],m)=>{const y=118+m*step,ok=it.b===k,lab=it.s||it.t,z=wo_fitS(c,lab,190,20,700),cw=tw(c,lab,z,700)+26;
      glass(c,cxx-cw/2,y-18,cw,36,10,st.checked?(ok?GOOD:BAD):col,{glow:8,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(c,lab,cxx,y+7,{w:700,size:z,align:"center"});});});
  c.restore();}

// lab 3: on the left, refs between models (access); on the right, tables with doors (grants). The rule picked lights its side
function wo_l_read(c,w,h,st,L){const V=L.vis,p=st.pick||"both",refA=p==="grants"?0.35:1,readA=p==="access"?0.35:1;c.save();wo_fit(c,w,h,960,400);
  T(c,V.refer,16,30,{w:800,size:22,color:rgba(INK,0.4+0.6*refA)});T(c,V.read,496,30,{w:800,size:22,color:rgba(INK,0.4+0.6*readA)});
  c.strokeStyle="rgba(150,170,210,0.25)";c.lineWidth=1.5;c.beginPath();c.moveTo(478,14);c.lineTo(478,390);c.stroke();
  withA(c,refA,()=>{wo_dot(c,50,190,WO_WAL,1,10);T(c,"mart_wallet__learners",16,226,{f:"mono",w:500,size:18,color:rgba(WO_WAL,1)});
    wo_lpill(c,300,96,"mart_planning__near_award",WO_PLN,{size:19});wo_lpill(c,360,214,"core_learner",TRUST,{size:20});
    arrowTo(c,62,184,140,108,WO_AMB,1,{head:12,lw:3});wo_num(c,82,130,3,WO_AMB);
    arrowTo(c,64,194,274,212,GOOD,1,{head:12,lw:3});wo_num(c,180,186,2,GOOD);
    wo_proj(c,250,304,200,76,"planning",WO_PLN,{dash:true});arrowTo(c,420,302,420,234,TRUST,1,{head:12,lw:3});wo_num(c,448,270,5,TRUST);tag(c,360,256,"v=1",TRUST,{size:18,align:"center"});});
  withA(c,readA,()=>{wo_table(c,488,48,322,156,"mart_planning__near_award",WO_PLN,{open:1});wo_table(c,488,228,322,156,"stg_student_system__learners",LAYER4[0][1],{open:1});
    wo_team(c,886,80,0.36,WO_PLN,0,{});wrapT(c,V.analyst,886,140,140,{w:700,size:18,align:"center",color:rgba(WO_PLN,1),lh:22});arrowTo(c,848,112,806,140,GOOD,1,{head:10,lw:3});wo_num(c,842,184,1,GOOD);
    wo_dash(c,826,246,126,92,WO_PLN,0,{title:V.dashS});arrowTo(c,824,300,806,316,GOOD,1,{head:10,lw:3});wo_num(c,838,222,4,GOOD);});
  if(p==="access")tag(c,889,374,V.anyway,EDGE_,{align:"center",size:wo_fitS(c,V.anyway,110,20,700)});
  if(p==="grants")tag(c,126,300,V.noRef,EDGE_,{align:"center",size:wo_fitS(c,V.noRef,200,20,700)});
  c.restore();}

// lab 4: two projects hash Aisha's student ID; the ground under them is the shared package
function wo_l_shared(c,w,h,st,L){const V=L.vis,k=st.step||0,own=k>=1&&k<=4,low=k>=2&&k<=4,broke=k>=3&&k<=4,tests=k===4;c.save();wo_fit(c,w,h,960,400);
  [[20,"credentials",[150,190,255],false],[500,"planning",WO_PLN,true]].forEach(([x,nm,col,right])=>{wo_proj(c,x,30,440,262,nm,col,{dash:right});
    if(right){const lw=tw(c,WO_CLOUD,18,700)+28,lx=x+440-lw+8;c.fillStyle="rgba(8,14,24,0.95)";rr(c,lx,15,lw,30,15);c.fill();c.save();c.setLineDash([5,4]);c.strokeStyle=rgba(WO_AMB,0.8);c.lineWidth=1.5;rr(c,lx,15,lw,30,15);c.stroke();c.restore();T(c,WO_CLOUD,lx+14,36,{w:700,size:18,color:rgba(WO_AMB,1)});}
    const l=right&&low,o=right&&own;T(c,l?"sis|s-20417":"SIS|S-20417",x+30,96,{f:"mono",w:500,size:24,color:rgba(l?WO_AMB:INK,1)});
    T(c,o?(low?"sha256(lower(…))":"sha256(…)"):"{{ hash_key(…) }}",x+30,142,{f:"mono",w:500,size:21,color:rgba(o?WO_AMB:mix(INK,TRUST,0.4),1)});
    T(c,(right&&low)?"8c73518c…447e":(right&&own)?"…":"0905e6e2…f76a2",x+30,194,{f:"mono",w:500,size:26,color:rgba((right&&low)?WO_AMB:TRUST,1)});
    withA(c,tests?1:0.5,()=>{tick_(c,x+40,262,11,GOOD,1);T(c,"unique · not_null",x+60,270,{f:"mono",w:500,size:20,color:rgba(tests?GOOD:SOFT,1)});});});
  // the join between the two keys
  const jc=broke?BAD:own?SOFT:GOOD;c.save();c.strokeStyle=rgba(jc,0.95);c.lineWidth=3;if(broke)c.setLineDash([10,10]);c.beginPath();c.moveTo(280,186);c.lineTo(524,186);c.stroke();c.restore();
  if(broke){c.fillStyle="rgba(7,12,24,1)";c.fillRect(470,172,20,28);cross_(c,480,186,11,BAD,1);}
  const jt=broke?V.noRows:own?V.join:V.oneRow;tag(c,345,232,jt,jc,{align:"center",size:wo_fitS(c,jt,180,20,700)});
  // the shared package: under both, or only under the credential project
  wo_slab(c,20,314,own?440:920,76,V.pkg,"hash_key · key_string",WEED,{hi:own?0:0.4});
  if(own){c.save();c.setLineDash([10,9]);c.strokeStyle=rgba(SOFT,0.6);c.lineWidth=2;rr(c,500,314,440,76,10);c.stroke();c.restore();T(c,V.noPkg,720,360,{w:700,size:20,align:"center",color:rgba(SOFT,1)});}
  c.restore();}

// the scenarios
function wo_q_copy(c,w,h,st,L){const V=L.vis;c.save();wo_fit(c,w,h,900,480);
  wo_coreCard(c,290,8,320,118,{name:"core_learner",sub:V.pub});
  wo_proj(c,16,160,420,300,"planning",WO_PLN,{});wo_proj(c,464,160,420,300,"wallet",WO_WAL,{});
  wo_lpill(c,226,250,"mart_planning__near_award",WO_PLN,{size:22});tag(c,226,320,V.atCensus,WO_PLN,{align:"center",size:wo_fitS(c,V.atCensus,360,24,700)});
  wo_lpill(c,674,250,"mart_planning__near_award",WO_PLN,{size:22,glow:4});tag(c,674,320,V.copy,EDGE_,{align:"center",size:wo_fitS(c,V.copy,370,24,700)});
  wo_q_mark(c,674,410);c.restore();}
function wo_q_private(c,w,h,st,L){c.save();wo_fit(c,w,h,900,480);const cx=450,cy=236;
  wo_rings(c,cx,cy,0,{s:0.66,ring:[1,1,1],lit:[0.2,0.3,0.6],noLabels:true});
  T(c,"private",cx,cy+66,{f:"mono",w:500,size:26,align:"center",color:rgba(WO_RING[2][2],1)});
  wo_lpill(c,cx,cy+8,"int_learner_keys_matched",LAYER4[1][1],{size:24});
  wo_lpill(c,cx,cy-124,"mart_planning__near_award",WO_PLN,{size:24});arrowTo(c,cx,cy-98,cx,cy-24,EDGE_,1,{head:13,lw:3});
  wo_q_mark(c,cx+70,cy-44);c.restore();}
function wo_q_read(c,w,h,st,L){const V=L.vis;c.save();wo_fit(c,w,h,900,480);
  wo_table(c,30,110,480,240,"stg_student_system__learners",LAYER4[0][1],{open:0});tag(c,270,400,"+access: private",WO_RING[2][2],{align:"center",size:26});
  wo_dash(c,620,150,250,170,WO_PLN,0,{title:V.dash});arrowTo(c,616,250,514,290,EDGE_,1,{head:13,lw:3});wo_q_mark(c,566,220);c.restore();}
function wo_q_hash(c,w,h,st,L){const V=L.vis;c.save();wo_fit(c,w,h,900,480);
  [[16,"credentials",[150,190,255],"{{ hash_key(…) }}","f7125487…fab524",false],[464,V.scProj,WO_SC,"sha256(…)","a7534411…0b1777",true]].forEach(([x,nm,col,fn,hh,r])=>{wo_proj(c,x,40,420,320,nm,col,{dash:r});
    T(c,"SC|grace.okafor@mail.example",x+22,120,{f:"mono",w:500,size:22,color:rgba(INK,1)});T(c,fn,x+22,190,{f:"mono",w:500,size:24,color:rgba(SOFT,1)});T(c,hh,x+22,270,{f:"mono",w:500,size:28,color:rgba(r?WO_AMB:TRUST,1)});});
  c.save();c.setLineDash([10,10]);c.strokeStyle=rgba(EDGE_,0.9);c.lineWidth=3;c.beginPath();c.moveTo(226,400);c.lineTo(674,400);c.stroke();c.restore();
  wo_q_mark(c,450,456);c.restore();}
function wo_q_five(c,w,h,st,L){const V=L.vis;c.save();wo_fit(c,w,h,900,480);
  [["staging",LAYER4[0][1]],["intermediate",LAYER4[1][1]],["core",TRUST],["planning",WO_PLN],["wallet",WO_WAL]].forEach(([nm,col],i)=>{const x=10+i*178;c.save();c.setLineDash([12,9]);c.strokeStyle=rgba(col,0.85);c.lineWidth=2.4;rr(c,x,40,168,180,20);c.stroke();c.restore();
    T(c,nm,x+84,138,{w:800,size:wo_fitS(c,nm,150,24,800),align:"center",color:rgba(col,1)});});
  wo_team(c,450,320,0.8,WEED,0,{});T(c,V.oneTeam,450,448,{w:800,size:wo_fitS(c,V.oneTeam,600,26,800),align:"center",color:rgba(WEED,1)});c.restore();}
function wo_q_edit(c,w,h,st,L){const V=L.vis;c.save();wo_fit(c,w,h,900,480);
  const hh=wo_code(c,20,8,560,"models/core/core_credential_v2.sql",["…","    credential_kind,","    credential_code,","    credential_name,","    credit_points,","    issued_on,","…"],{size:23,lh:34,edge:TRUST,lit:{4:1},litCol:EDGE_});
  tag(c,746,250,V.renamed,EDGE_,{align:"center",size:wo_fitS(c,V.renamed,280,22,700)});tag(c,746,310,V.noVersion,EDGE_,{align:"center",size:wo_fitS(c,V.noVersion,280,22,700)});
  [["planning",WO_PLN,200],["wallet",WO_WAL,520]].forEach(([nm,col,x])=>{arrowTo(c,300,hh+14,x,418,col,0.9,{head:13,lw:3});wo_lpill(c,x,446,nm,col,{size:24});});c.restore();}
function wo_q_move(c,w,h,st,L){const V=L.vis;c.save();wo_fit(c,w,h,900,480);
  wo_proj(c,16,30,520,330,"credentials",[150,190,255],{});wo_credProj(c,16,10,520,330,0,{noBox:true,noLabels:true,s:0.42});
  wo_proj(c,624,30,260,330,"planning",WO_PLN,{dash:true});arrowTo(c,500,120,640,120,WO_PLN,0.9,{head:13,lw:3,bend:-0.2});
  wo_slab(c,16,384,868,80,V.pkg,"hash_key · key_string",WEED,{});c.restore();}
function wo_q_pin(c,w,h,st,L){const V=L.vis;c.save();wo_fit(c,w,h,900,480);
  wo_coreCard(c,24,30,340,110,{name:"core_learner",sub:"v1"});wo_coreCard(c,24,280,340,110,{name:"core_learner",sub:"v2",hi:1});
  tag(c,194,212,V.depr,EDGE_,{align:"center",size:wo_fitS(c,V.depr,340,22,700)});
  wo_proj(c,540,140,340,180,"planning",WO_PLN,{dash:true});T(c,"ref('credentials',",562,216,{f:"mono",w:500,size:22,color:rgba(INK,1)});T(c,"  'core_learner', v=1)",562,252,{f:"mono",w:500,size:22,color:rgba(INK,1)});
  arrowTo(c,536,190,372,90,TRUST,1,{head:13,lw:3,bend:0.1});wo_q_mark(c,452,400);c.restore();}
Object.assign(LV,{wo_l_access,wo_l_domains,wo_l_read,wo_l_shared,wo_q_copy,wo_q_private,wo_q_read,wo_q_hash,wo_q_five,wo_q_edit,wo_q_move,wo_q_pin});
