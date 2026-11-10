/* ===== More readers than people: the film's own pictures =====
   Drawn with the module's kit (films/data-that-moves/shared/src/: the places "map" and "night", glass cards, pills, tags, the
   map's parts, the tools' pages and the people lit for the dark) and the agent films' kit (the camera and shots, the agent's
   sphere and badge). What this film adds, with the prefix mr_: the road at night and its signs, for the opening; the measure and
   its readers; a rule card; and a few small cards. The kit's files are never changed for this film.
   Sizes are in the 1920 x 1080 frame. Every word is at least 28 px as seen, and nothing but the captions goes below y 890. */

const mr_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
const MR_KICK=(ctx,a)=>md_kicker(ctx,"3.3","More readers than people",{a});
// a value springing in from a, for a card's k
const mr_k=(t,a)=>clamp((t-a)/1.2,0,1);

/* ---------------------------------------------------------------- the road at night (chapter 1)
   Seen from above, as the map draws its lanes: the road comes in from the right, runs west, then turns sharply to the right (north)
   and leaves at the top. Traffic keeps to the right, as it did in Vienna, so a car going west drives on the road's north half and
   its signs stand on the north verge, clear of the captions. */
const MR_RD={y:640,w:150,bx:760,cx:760,cy:450,r:190};
// the road's line, off px to the right of its middle (a car's lane: 36; the edges: -70 and 70)
function mr_roadPts(off){off=off||0;const R=MR_RD,out=[],y=R.y-off,r=R.r-off;
  for(let x=2040;x>R.bx;x-=40)out.push([x,y]);
  for(let i=0;i<=28;i++){const th=Math.PI/2+i/28*Math.PI/2;out.push([R.cx+r*Math.cos(th),R.cy+r*Math.sin(th)]);}
  for(let yy=R.cy-40;yy>=-120;yy-=40)out.push([R.cx-r,yy]);return out;}
const MR_LANE=mk(mr_roadPts(36).map(p=>P(p[0],p[1])));
// the way a car goes when it misses the bend: on west along its lane, off the road and into the rail
const MR_MISS=mk([P(2040,MR_RD.y-36),P(560,MR_RD.y-36)]);
// where on the lane (0 to 1) a point is, by its x on the straight
const mr_laneAt=x=>clamp((2040-x)/MR_LANE.total,0,1);
function mr_path(c,pts){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));}
// a tree seen from above, its crown in a few lobes, lit by the moon from the upper left, its shadow down to the right
function mr_tree(c,x,y,r,rnd){const L=[[0,0,r*0.7]];for(let i=0;i<5;i++){const an=i/5*TAU+rnd()*0.9,d=r*(0.34+rnd()*0.14);L.push([Math.cos(an)*d,Math.sin(an)*d,r*(0.5+rnd()*0.16)]);}
  const crown=(ox,oy)=>{c.beginPath();L.forEach(l=>{c.moveTo(x+ox+l[0]+l[2],y+oy+l[1]);c.arc(x+ox+l[0],y+oy+l[1],l[2],0,TAU);});};
  crown(r*0.36,r*0.4);c.fillStyle="rgba(2,5,12,0.4)";c.fill();
  const g=c.createRadialGradient(x-r*0.45,y-r*0.5,r*0.1,x,y,r*1.05);g.addColorStop(0,"rgba(62,84,116,0.96)");g.addColorStop(0.5,"rgba(30,44,66,0.97)");g.addColorStop(1,"rgba(15,22,36,0.97)");
  crown(0,0);c.fillStyle=g;c.fill();}
/* the land round the road, as the map draws it: fields of slightly different darks, a few with their furrows, hedges of small
   trees along their edges, three copses, and a farm with its yard light on. All of it stays clear of the road and its verges. */
const MR_FIELDS=[
  [[700,0],[1180,0],[1130,300],[690,320]],[[1180,0],[1560,0],[1500,280],[1130,300]],[[1560,0],[1920,0],[1920,250],[1500,280]],
  [[690,320],[1130,300],[1110,500],[800,505],[700,420]],[[1130,300],[1500,280],[1520,505],[1110,500]],[[1500,280],[1920,250],[1920,505],[1520,505]],
  [[0,0],[440,0],[440,440],[0,560]],[[0,560],[440,440],[480,680],[560,760],[0,760]],
  [[0,760],[700,760],[680,1080],[0,1080]],[[700,760],[1300,760],[1320,1080],[680,1080]],[[1300,760],[1920,760],[1920,1080],[1320,1080]]];
function mr_land(c){const rnd=ag_rnd(1968);c.save();
  MR_FIELDS.forEach((f,i)=>{mr_path(c,f);c.closePath();c.fillStyle=i%2?"rgba(44,64,96,0.13)":"rgba(28,42,66,0.2)";c.fill();
    // furrows in every third field, at its own angle
    if(i%3===1){c.save();mr_path(c,f);c.closePath();c.clip();const an=0.35+i*0.4,dx=Math.cos(an),dy=Math.sin(an);c.strokeStyle="rgba(120,146,186,0.06)";c.lineWidth=2;
      for(let k=-60;k<60;k++){const ox=960+k*18*-dy,oy=540+k*18*dx;c.beginPath();c.moveTo(ox-dx*2000,oy-dy*2000);c.lineTo(ox+dx*2000,oy+dy*2000);c.stroke();}c.restore();}
    mr_path(c,f);c.closePath();c.strokeStyle="rgba(140,164,200,0.08)";c.lineWidth=2;c.stroke();});
  // hedges: small trees along some field edges, with gaps
  const hedge=(a,b)=>{const n=Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/12);for(let k=0;k<=n;k++){if(rnd()<0.18)continue;const u=k/n;mr_tree(c,lerp(a[0],b[0],u)+(rnd()-0.5)*6,lerp(a[1],b[1],u)+(rnd()-0.5)*6,7+rnd()*5,rnd);}};
  hedge([1180,0],[1130,300]);hedge([1130,300],[1110,500]);hedge([690,320],[1130,300]);hedge([1500,280],[1920,250]);hedge([440,0],[440,440]);hedge([0,560],[440,440]);
  hedge([700,780],[680,1080]);hedge([1300,780],[1320,1080]);
  // copses
  const copse=(x,y,n,s)=>{const T=[];for(let k=0;k<n;k++){const an=rnd()*TAU,d=Math.sqrt(rnd())*s;T.push([x+Math.cos(an)*d,y+Math.sin(an)*d*0.8,12+rnd()*12]);}T.sort((p,q)=>p[1]-q[1]).forEach(p=>mr_tree(c,p[0],p[1],p[2],rnd));};
  copse(860,170,14,90);copse(250,330,12,80);copse(1650,900,12,90);
  // the farm: a house and a barn, and the warm light in their yard
  c.save();c.translate(1330,160);c.rotate(-0.06);c.shadowColor="rgba(0,0,0,0.6)";c.shadowBlur=10;c.fillStyle="#1f2a3c";rr(c,-60,-26,74,52,4);c.fill();rr(c,30,-34,96,62,4);c.fill();c.shadowBlur=0;
  c.strokeStyle="rgba(150,170,204,0.22)";c.lineWidth=2;c.beginPath();c.moveTo(-60,0);c.lineTo(14,0);c.moveTo(30,-3);c.lineTo(126,-3);c.stroke();c.restore();
  glow(c,1318,214,70,[255,206,140],0.16);glow(c,1318,214,5,[255,226,180],0.9);
  c.restore();}
AG_PLACES.mrRoad=c=>{md_paintNight(c,{grid:false});const R=MR_RD,mid=mr_roadPts(0);c.save();c.lineJoin="round";c.lineCap="butt";
  // the land on either side: a faint, cool ground, darker away from the road
  const g=c.createLinearGradient(0,200,0,H);g.addColorStop(0,"rgba(30,44,66,0)");g.addColorStop(0.5,"rgba(30,44,66,0.22)");g.addColorStop(1,"rgba(30,44,66,0.05)");c.fillStyle=g;c.fillRect(0,0,W,H);
  mr_land(c);
  // the verge, then the asphalt, then a soft sheen down its middle
  mr_path(c,mid);c.strokeStyle="rgba(44,58,82,0.7)";c.lineWidth=R.w+46;c.stroke();
  mr_path(c,mid);c.strokeStyle="#111724";c.lineWidth=R.w;c.stroke();
  mr_path(c,mid);c.strokeStyle="rgba(120,150,200,0.05)";c.lineWidth=R.w*0.55;c.stroke();
  // its edge lines, and the dashes down the middle
  for(const o of[-68,68]){mr_path(c,mr_roadPts(o));c.strokeStyle="rgba(214,222,236,0.42)";c.lineWidth=3;c.stroke();}
  mr_path(c,mid);c.setLineDash([38,30]);c.strokeStyle="rgba(238,228,192,0.55)";c.lineWidth=4;c.stroke();c.setLineDash([]);
  // the guardrail along the outside of the bend, on its posts
  const rr0=R.r+92;c.strokeStyle="rgba(150,166,190,0.7)";c.lineWidth=5;c.beginPath();for(let i=0;i<=40;i++){const th=Math.PI/2+0.06+i/40*(Math.PI/2-0.12),x=R.cx+rr0*Math.cos(th),y=R.cy+rr0*Math.sin(th);i?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();
  c.fillStyle="rgba(150,166,190,0.8)";for(let i=0;i<=10;i++){const th=Math.PI/2+0.06+i/10*(Math.PI/2-0.12);c.beginPath();c.arc(R.cx+rr0*Math.cos(th),R.cy+rr0*Math.sin(th),4,0,TAU);c.fill();}
  c.restore();};

// a car seen from above, at (x, y), heading head (radians; 0 is east), its headlights on (o.lights 0 to 1)
function mr_car(ctx,x,y,head,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const L=o.lights==null?1:o.lights;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(head);
  if(L>0){ctx.save();ctx.globalCompositeOperation="lighter";const g=ctx.createRadialGradient(44,0,6,44,0,300);g.addColorStop(0,"rgba(255,236,200,"+(0.34*L)+")");g.addColorStop(1,"rgba(255,236,200,0)");
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(42,-14);ctx.lineTo(320,-96);ctx.quadraticCurveTo(350,0,320,96);ctx.lineTo(42,14);ctx.closePath();ctx.fill();ctx.restore();}
  ctx.shadowColor="rgba(0,0,0,0.7)";ctx.shadowBlur=16;rr(ctx,-44,-22,88,44,13);ctx.fillStyle="#56647c";ctx.fill();ctx.shadowBlur=0;
  const b=ctx.createLinearGradient(0,-22,0,22);b.addColorStop(0,"rgba(255,255,255,0.22)");b.addColorStop(0.5,"rgba(255,255,255,0)");b.addColorStop(1,"rgba(0,0,0,0.25)");rr(ctx,-44,-22,88,44,13);ctx.fillStyle=b;ctx.fill();
  rr(ctx,6,-16,20,32,6);ctx.fillStyle="#1d2533";ctx.fill();rr(ctx,-26,-15,14,30,5);ctx.fillStyle="#1d2533";ctx.fill();rr(ctx,-12,-17,18,34,6);ctx.fillStyle="#66758f";ctx.fill();
  glow(ctx,42,-13,11,[255,242,214],0.95*L);glow(ctx,42,13,11,[255,242,214],0.95*L);glow(ctx,-44,-14,10,[255,64,52],0.75);glow(ctx,-44,14,10,[255,64,52],0.75);
  ctx.restore();}
// where a car is on a path (0 to 1), and which way it faces
function mr_carOn(ctx,path,u,o){u=clamp(u,0,1);const q=at(path,u),r=at(path,Math.min(1,u+0.004)),s=at(path,Math.max(0,u-0.004));mr_car(ctx,q.x,q.y,Math.atan2(r.y-s.y,r.x-s.x),o);return q;}

/* ---------------------------------------------------------------- the signs
   As the 1968 convention sets their kinds (Annex 1): a warning is a triangle edged in red ("warn": a bend to the right), a ban or
   a limit a circle edged in red ("limit": 50), what you must do a blue circle ("must": turn right), each with a black or white
   symbol; and before them, a plate of words ("plate", o.text). s is the sign's width. o.post draws its post, o.a, o.k (a spring),
   o.glow a light on it (a colour). Drawn originally for the film, not copied from any country's signs. */
const MR_RED=[214,40,40],MR_BLUE=[30,86,190],MR_WHITE=[246,246,242],MR_BLACK=[24,24,28];
function mr_sign(ctx,kind,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  if(o.post){ctx.fillStyle="#8a94a6";rr(ctx,x-4,y,8,o.post,3);ctx.fill();}
  if(o.glow)glow(ctx,x,y,s*1.1,o.glow,0.45);
  ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=14;ctx.lineJoin="round";ctx.lineCap="round";
  if(kind==="warn"){const h=s*0.866,cy=y+h*0.08,P3=[[x,cy-h*0.62],[x+s/2,cy+h*0.38],[x-s/2,cy+h*0.38]];ctx.beginPath();P3.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    ctx.fillStyle=rgba(MR_RED,1);ctx.lineWidth=s*0.08;ctx.strokeStyle=rgba(MR_RED,1);ctx.fill();ctx.stroke();ctx.shadowBlur=0;
    const k=0.62,Q=P3.map(p=>[x+(p[0]-x)*k,cy+(p[1]-cy)*k+h*0.03]);ctx.beginPath();Q.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=rgba(MR_WHITE,1);ctx.lineWidth=s*0.04;ctx.strokeStyle=rgba(MR_WHITE,1);ctx.fill();ctx.stroke();
    // the bend: up the middle, then turning to the right
    ctx.strokeStyle=rgba(MR_BLACK,1);ctx.lineWidth=s*0.075;ctx.lineCap="butt";ctx.beginPath();ctx.moveTo(x-s*0.03,cy+h*0.26);ctx.lineTo(x-s*0.03,cy-h*0.02);ctx.quadraticCurveTo(x-s*0.03,cy-h*0.18,x+s*0.11,cy-h*0.2);ctx.stroke();
    ctx.fillStyle=rgba(MR_BLACK,1);ctx.beginPath();ctx.moveTo(x+s*0.17,cy-h*0.2);ctx.lineTo(x+s*0.08,cy-h*0.28);ctx.lineTo(x+s*0.08,cy-h*0.12);ctx.closePath();ctx.fill();}
  else if(kind==="limit"){const r=s/2;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=rgba(MR_RED,1);ctx.fill();ctx.shadowBlur=0;ctx.beginPath();ctx.arc(x,y,r*0.76,0,TAU);ctx.fillStyle=rgba(MR_WHITE,1);ctx.fill();
    md_T(ctx,o.text||"50",x,y+s*0.15,{w:800,size:Math.max(28,Math.round(s*0.4)),align:"center",col:MR_BLACK});}
  else if(kind==="must"){const r=s/2;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=rgba(MR_BLUE,1);ctx.fill();ctx.shadowBlur=0;ctx.lineWidth=s*0.03;ctx.strokeStyle=rgba(MR_WHITE,0.9);ctx.beginPath();ctx.arc(x,y,r*0.93,0,TAU);ctx.stroke();
    ctx.strokeStyle=rgba(MR_WHITE,1);ctx.lineWidth=s*0.1;ctx.lineCap="butt";ctx.beginPath();ctx.moveTo(x-s*0.12,y+s*0.26);ctx.lineTo(x-s*0.12,y);ctx.quadraticCurveTo(x-s*0.12,y-s*0.1,x,y-s*0.1);ctx.lineTo(x+s*0.08,y-s*0.1);ctx.stroke();
    ctx.fillStyle=rgba(MR_WHITE,1);ctx.beginPath();ctx.moveTo(x+s*0.27,y-s*0.1);ctx.lineTo(x+s*0.07,y-s*0.27);ctx.lineTo(x+s*0.07,y+s*0.07);ctx.closePath();ctx.fill();}
  else if(kind==="plate"){const size=o.size||30,tw=md_tw(ctx,o.text||"",{w:800,size}),w=tw+44,h=size+34;rr(ctx,x-w/2,y-h/2,w,h,8);ctx.fillStyle=rgba(MR_WHITE,1);ctx.fill();ctx.shadowBlur=0;
    ctx.lineWidth=4;ctx.strokeStyle=rgba(MR_BLACK,1);rr(ctx,x-w/2+5,y-h/2+5,w-10,h-10,5);ctx.stroke();md_T(ctx,o.text||"",x,y+size*0.36,{w:800,size,align:"center",col:MR_BLACK});}
  ctx.restore();}
// a plate's width, to lay out a row of them
const mr_plateW=(ctx,text,size)=>md_tw(ctx,text,{w:800,size:size||30})+44;

/* ---------------------------------------------------------------- the measure and its readers
   The measure is gold, what people agree on: Unity Catalog's metric view casual_teaching_cost, as the example project builds it
   (models/marts/finance/). Each reader is a card of the kit's (md_reader), with its own logo or icon, and the number it gives. */
const MR_NAME="casual_teaching_cost";
// the measure's card: its words, its name in Unity Catalog, and the gold of what's agreed; returns its box and ports
function mr_measure(ctx,x,y,w,o){o=o||{};const h=o.h||(o.sub===false?118:168),box={x,y,w,h,l:[x,y+h/2],r:[x+w,y+h/2],t:[x+w/2,y],b:[x+w/2,y+h]},a=o.a==null?1:o.a;if(a<=0.004)return box;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));if(o.lit)glow(ctx,x+w/2,y+h/2,w*0.7,MD.agreed,0.32*o.lit);
  md_card(ctx,x,y,w,h,{edge:MD.agreed,glow:0.7+0.6*(o.lit||0)});md_icon(ctx,"contract",x+w-48,y+48,40,MD.agreed);
  md_T(ctx,(o.kick||"Metric view").toUpperCase(),x+28,y+52,{w:800,size:28,ls:4,col:MD.agreed});md_T(ctx,o.title||"Casual teaching cost",x+28,y+100,{w:700,size:38});
  if(o.sub!==false)md_T(ctx,o.sub||MR_NAME,x+28,y+146,{w:500,size:28,f:o.sub?undefined:"mono",col:MD.soft});
  ctx.restore();return box;}
// the five kinds of reader, where the opening and the close put them round the measure: [x, y, w, title, sub, logo or icon]
const MR_M={x:700,y:372,w:520};
const MR_READERS=[
  {k:"people",x:120,y:230,w:470,title:"People",sub:"asking Genie One",logo:"databricks"},
  {k:"bi",x:120,y:500,w:470,title:"Finance's reports",sub:"in Power BI",logo:"powerbi"},
  {k:"app",x:1330,y:230,w:470,title:"An app",sub:"to plan the tutors",logo:"databricks"},
  {k:"agent",x:1330,y:500,w:470,title:"An agent",sub:"drafting the deans' note",agent:true},
  {k:"partner",x:725,y:745,w:470,title:"A partner",sub:"outside the university",icon:"share"}];
// a reader's card (with the agent's sphere for the agent), and the lane between it and the measure: o.a, o.lane (0 to 1, how far
// the lane is drawn), o.col (the lane's colour), o.dash, o.lit, o.t; returns the reader's box
function mr_reader(ctx,R,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const m=MR_M,mh=168,col=o.col||MD.agreed,ca=a*(o.cardA==null?1:o.cardA);
  let b;
  // the agent's card is drawn here, as md_reader draws one, with the agent's sphere where a logo would be and its words after it
  if(R.agent){b={x:R.x,y:R.y,w:R.w,h:110};if(ca>0.004){const lit=o.lit||0;ctx.save();ctx.globalAlpha*=ca;if(lit>0)glow(ctx,R.x+R.w/2,R.y+55,R.w*0.7,o.edge||MD.ink,0.3*lit);
    md_card(ctx,R.x,R.y,R.w,110,{edge:o.edge||null,glow:0.5+0.8*lit});ag_model(ctx,R.x+54,R.y+55,30,{t:o.t||0,core:0.8,think:0.2});
    md_T(ctx,R.title,R.x+100,R.y+49,{w:800,size:32});md_T(ctx,R.sub,R.x+100,R.y+87,{w:500,size:28,col:MD.soft});ctx.restore();}}
  else b=md_reader(ctx,R.x,R.y,R.w,{title:R.title,sub:R.sub,logo:R.logo,icon:R.icon,col:o.edge||null,lit:o.lit,a:ca,h:110});
  const left=R.x<m.x,down=R.y>m.y+mh,from=down?[m.x+m.w/2,m.y+mh]:left?[m.x,m.y+mh/2]:[m.x+m.w,m.y+mh/2],to=down?[R.x+R.w/2,R.y]:left?[R.x+R.w,R.y+55]:[R.x,R.y+55];
  if(o.lane>0){const pts=down?md_path([from,to]):md_curve(from,to,{bend:0.55});md_lane(ctx,pts,col,a*0.9,{u:o.lane,dash:o.dash,t:o.t});if(o.flow&&o.lane>=1)md_flow(ctx,pts,o.t||0,{col,a:a*o.flow,every:1.4,off:R.x*0.001});}
  return Object.assign({},b,{h:110});}
// the number a reader gives, as a pill under its card (beside it for the partner, whose card is low in the frame)
function mr_says(ctx,R,text,o){o=o||{};const b={x:R.x,y:R.y,w:R.w,h:110},side=R.k==="partner"&&o.x==null,pw=md_tw(ctx,text,{w:800,size:28})+(o.icon?100:60),
  x=o.x!=null?o.x:side?b.x+b.w+24+pw/2:b.x+b.w-(o.inset||118),y=o.y!=null?o.y:side?b.y+b.h/2:b.y+b.h+38;md_pill(ctx,x,y,text,{col:o.col||MD.pass,icon:o.icon,size:28,a:o.a,k:o.k});}

/* ---------------------------------------------------------------- small cards */
// a rule, in gold: o.kick ("The rule"), lines of 36 px (o.lineA, each line's opacity, to bring them in as they're said); returns its box
function mr_rule(ctx,x,y,w,lines,o){o=o||{};const h=96+lines.length*50,a=o.a==null?1:o.a,box={x,y,w,h};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:MD.agreed,glow:0.9});
  md_T(ctx,(o.kick||"The rule").toUpperCase(),x+32,y+56,{w:800,size:28,ls:4,col:MD.agreed});lines.forEach((l,i)=>md_T(ctx,l,x+32,y+108+i*50,{w:700,size:36,a:o.lineA?o.lineA[i]:1}));ctx.restore();return box;}
// a card of rows, each [words, colour or null, icon or null, opacity]: an answer, a list of grants, a note
function mr_list(ctx,x,y,w,head,rows,o){o=o||{};const rh=o.rh||52,h=(head?78:24)+rows.length*rh+20,a=o.a==null?1:o.a,box={x,y,w,h};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:o.edge||null,glow:0.7,dash:o.dash});
  if(head)md_T(ctx,String(head).toUpperCase(),x+28,y+52,{w:800,size:28,ls:4,col:o.kickCol||o.edge||MD.soft});
  rows.forEach((r,i)=>{const ra=r[3]==null?1:r[3];if(ra<=0.004)return;const yy=y+(head?78:24)+i*rh;ctx.save();ctx.globalAlpha*=ra;let tx=x+28;
    if(r[2]){md_icon(ctx,r[2],tx+16,yy+rh/2-2,30,r[1]||MD.ink);tx+=46;}
    if(Array.isArray(r[0])){md_T(ctx,r[0][0],tx,yy+rh/2+8,{w:600,size:28,col:r[1]||MD.ink});md_T(ctx,r[0][1],x+w-28,yy+rh/2+8,{w:700,size:28,align:"right",col:r[4]||r[1]||MD.ink});}
    else md_T(ctx,r[0],tx,yy+rh/2+8,{w:600,size:28,col:r[1]||MD.ink,f:r[5]});ctx.restore();});
  ctx.restore();return box;}
// a small mark that something is given its own key, or someone else's: a key icon in a ring
function mr_key(ctx,x,y,col,a,o){o=o||{};if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.beginPath();ctx.arc(x,y,o.r||26,0,TAU);ctx.fillStyle="rgba(7,12,26,0.96)";ctx.fill();ctx.lineWidth=2.2;ctx.strokeStyle=rgba(col,0.95);ctx.stroke();
  md_icon(ctx,o.icon||"key",x,y,o.s||30,col);ctx.restore();}
// a person as a small icon in a ring, for the many who use a tool
function mr_who(ctx,x,y,col,a,o){mr_key(ctx,x,y,col,a,Object.assign({icon:"person",r:30,s:34},o||{}));}

// a border across the road, x along it: a dashed line from verge to verge, and the word "border" over it
function mr_border(ctx,x,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([14,12]);ctx.lineWidth=3;ctx.strokeStyle=rgba(MD.soft,0.85);
  ctx.beginPath();ctx.moveTo(x,MR_RD.y-128);ctx.lineTo(x,MR_RD.y+128);ctx.stroke();ctx.setLineDash([]);md_T(ctx,"border",x,MR_RD.y-146,{w:600,size:28,align:"center",col:MD.soft});ctx.restore();}
// a sign put together the way the convention defines it: first its shape, then its colour, then its symbol (each 0 to 1)
function mr_signBuild(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const sh=o.shape||0,co=o.colour||0,sy=o.symbol||0;ctx.save();ctx.globalAlpha*=a;
  const h=s*0.866,cy=y+h*0.08,P3=[[x,cy-h*0.62],[x+s/2,cy+h*0.38],[x-s/2,cy+h*0.38]],tri=k=>{ctx.beginPath();P3.forEach((p,i)=>{const q=[x+(p[0]-x)*k,cy+(p[1]-cy)*k+(1-k)*h*0.08];i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.closePath();};
  ctx.lineJoin="round";
  // the shape: an outline that draws itself
  if(sh>0&&co<1){ctx.save();ctx.globalAlpha*=(1-co);tri(1);ctx.setLineDash([s*3.2*sh,s*4]);ctx.lineWidth=5;ctx.strokeStyle=rgba(MD.ink,0.95);ctx.stroke();ctx.restore();}
  // the colour: the red edge and the white field
  if(co>0){ctx.save();ctx.globalAlpha*=co;mr_sign(ctx,"warn",x,y,s,{});ctx.restore();
    // cover the symbol until it's added
    if(sy<1){ctx.save();ctx.globalAlpha*=co*(1-sy);tri(0.5);ctx.fillStyle=rgba(MR_WHITE,1);ctx.lineWidth=s*0.12;ctx.strokeStyle=rgba(MR_WHITE,1);ctx.fill();ctx.stroke();ctx.restore();}}
  ctx.restore();}

/* ---------------------------------------------------------------- the tools' pages and cards (chapters 2 to 6) */
// a number that rolls from a to b (u 0 to 1): the old one rises and fades as the new one comes up from below
function mr_roll(ctx,x,y,a,b,u,o){o=o||{};const sz=o.size||32,al=o.align||"right",d=sz*0.9,f=o.w||800;u=ag_sine(clamp(u,0,1));
  if(u<1)md_T(ctx,a,x,y-d*u,{w:f,size:sz,align:al,col:o.colA||MD.ink,a:1-u});if(u>0)md_T(ctx,b,x,y+d*(1-u),{w:f,size:sz,align:al,col:o.colB||MD.ink,a:u});}
// Genie One's page: a question (o.q) in a bubble at the right, as asked, then the answer (o.ans, large, in o.col) and where it came
// from (o.from, in mono); o.qA and o.ansA bring each in; returns the window's body
function mr_genie(ctx,x,y,w,h,o){o=o||{};return md_window(ctx,x,y,w,h,{logo:"databricks",product:"Genie One",title:o.title,edge:o.edge,lit:o.lit,a:o.a,k:o.k,draw:(c,b)=>{
  const qa=o.qA==null?1:o.qA,aa=o.ansA==null?1:o.ansA;let yy=b.y+8;
  if(o.q){const ls=md_wrap(c,o.q,b.w-110,{w:600,size:28}),bh=ls.length*38+26,bw=Math.max(...ls.map(l=>md_tw(c,l,{w:600,size:28})))+40,bx=b.x+b.w-bw;
    if(qa>0.004){c.save();c.globalAlpha*=qa;md_card(c,bx,yy,bw,bh,{r:16,fill:"rgba(38,58,94,0.92)",glow:0});ls.forEach((l,i)=>md_T(c,l,bx+20,yy+40+i*38,{w:600,size:28}));c.restore();}yy+=bh+24;}
  if(aa>0.004&&o.ans){c.save();c.globalAlpha*=aa;md_T(c,o.ans,b.x+4,yy+42,{w:800,size:44,col:o.col||MD.pass});if(o.sub)md_T(c,o.sub,b.x+4,yy+84,{w:600,size:28,col:MD.soft});
    if(o.from)md_T(c,o.from,b.x+4,yy+(o.sub?122:84),{w:500,size:28,f:"mono",col:MD.soft});c.restore();}}});}
// a Power BI report's page: the measure's name as the report gives it (o.name), for whom (o.who), and its number (o.num, in o.col);
// o.roll [from, to, u, colFrom, colTo] rolls the number; returns the body
function mr_report(ctx,x,y,w,h,o){o=o||{};return md_window(ctx,x,y,w,h,{logo:"powerbi",product:"Power BI",title:o.title||"Budget pack",edge:o.edge,lit:o.lit,a:o.a,k:o.k,draw:(c,b)=>{
  if(o.nameLit)glow(c,b.x+150,b.y+30,170,o.nameCol||MD.fail,0.3*o.nameLit);
  md_T(c,o.name||"Casual teaching cost",b.x+4,b.y+38,{w:700,size:32});md_T(c,o.who||"Faculty of Health, so far",b.x+4,b.y+78,{w:500,size:28,col:MD.soft});
  const na=o.numA==null?1:o.numA;if(na>0.004){c.save();c.globalAlpha*=na;if(o.roll)mr_roll(c,b.x+4,b.y+148,o.roll[0],o.roll[1],o.roll[2],{size:52,align:"left",colA:o.roll[3],colB:o.roll[4]});
    else md_T(c,o.num||"",b.x+4,b.y+148,{w:800,size:52,col:o.col||MD.ink});c.restore();}}});}
// a report on a card, as it stands among the platform's parts: Power BI's logo, the report, the measure's name on it, and its number at
// the right; returns its box and ports
function mr_biCard(ctx,x,y,w,o){o=o||{};const h=120,a=o.a==null?1:o.a,box={x,y,w,h,l:[x,y+h/2],r:[x+w,y+h/2],t:[x+w/2,y],b:[x+w/2,y+h]};if(a<=0.004)return box;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));if(o.lit)glow(ctx,x+w/2,y+h/2,w*0.6,o.edge||MD.ink,0.3*o.lit);
  md_card(ctx,x,y,w,h,{edge:o.edge||null,glow:0.6});const lw=logo(ctx,"powerbi",x+24,y+h/2-24,48),tx=x+24+lw+18;
  md_T(ctx,o.title||"Budget pack",tx,y+h/2-6,{w:800,size:32});if(o.subLit)glow(ctx,tx+140,y+h/2+22,160,MD.fail,0.35*o.subLit);md_T(ctx,o.sub||"Casual teaching cost",tx,y+h/2+32,{w:500,size:28,col:MD.soft});
  if(o.roll)mr_roll(ctx,x+w-28,y+h/2+14,o.roll[0],o.roll[1],o.roll[2],{size:36,colA:o.roll[3],colB:o.roll[4]});else if(o.num)md_T(ctx,o.num,x+w-28,y+h/2+14,{w:800,size:36,align:"right",col:o.col||MD.ink});
  ctx.restore();return box;}
// a pane for Microsoft Fabric, as md_platform draws Databricks': the logo and name at its top left; returns its inside
function mr_fabric(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,lit=o.lit||0,inner={x:x+36,y:y+96,w:w-72,h:h-120};if(a<=0.004)return inner;ctx.save();ctx.globalAlpha*=a;
  md_card(ctx,x,y,w,h,{edge:[120,150,196],glow:0.4+0.8*lit,edgeA:0.5+0.3*lit,r:24,fill:"rgba(9,15,31,0.9)"});const lw=logo(ctx,"fabric",x+28,y+26,44);
  md_T(ctx,o.title||"Microsoft Fabric",x+28+lw+16,y+62,{w:800,size:36});ctx.restore();return inner;}
// a dashed slot where something would be but isn't, with a cross and its words
function mr_slot(ctx,x,y,w,h,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;md_card(ctx,x,y,w,h,{dash:[10,9],edge:o.col||MD.dim,glow:0.2,r:14,fill:"rgba(7,12,26,0.6)"});
  md_icon(ctx,"cross",x+38,y+h/2,30,o.col||MD.soft);md_T(ctx,text,x+68,y+h/2+10,{w:600,size:28,col:MD.soft});ctx.restore();}
// a row of tabs, one chosen (sel): o.a, o.litA (each tab's light, 0 to 1), o.lockA (each tab's lock, 0 to 1); returns their boxes
function mr_tabs(ctx,x,y,names,sel,o){o=o||{};const a=o.a==null?1:o.a,out=[];let xx=x;for(let i=0;i<names.length;i++){const lk=o.lockA?o.lockA[i]||0:0,tw=md_tw(ctx,names[i],{w:700,size:28})+44+(lk>0?40*lk:0),h=52,on=i===sel,li=o.litA?o.litA[i]||0:0;
    out.push({x:xx,y:y-h/2,w:tw,h});if(a>0.004){ctx.save();ctx.globalAlpha*=a*(lk>0?1-0.45*lk:1);md_card(ctx,xx,y-h/2,tw,h,{r:h/2,edge:on?MD.ink:li>0?MD.flow:null,glow:on?0.5:0.2+0.5*li,fill:on?"rgba(40,58,92,0.95)":"rgba(10,17,35,0.9)",edgeA:on?0.8:0.4+0.4*li});
      md_T(ctx,names[i],xx+22,y+10,{w:700,size:28,col:on?MD.ink:MD.soft});if(lk>0)md_icon(ctx,"lock",xx+tw-34,y,26,MD.soft,{a:lk});ctx.restore();}xx+=tw+14;}return out;}
// a small card for an app or a tool, with a logo or an icon, a title and a line under it; returns its box and ports
function mr_box(ctx,x,y,w,o){o=o||{};const h=o.h||110,a=o.a==null?1:o.a,box={x,y,w,h,l:[x,y+h/2],r:[x+w,y+h/2],t:[x+w/2,y],b:[x+w/2,y+h]};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));if(o.lit)glow(ctx,x+w/2,y+h/2,w*0.6,o.edge||MD.ink,0.3*o.lit);md_card(ctx,x,y,w,h,{edge:o.edge||null,glow:0.5+0.6*(o.lit||0),dash:o.dash});
  let tx=x+26;if(o.logo){tx+=logo(ctx,o.logo,x+24,y+h/2-22,44)+16;}else if(o.icon){md_icon(ctx,o.icon,x+46,y+h/2,38,o.iconCol||o.edge||MD.ink);tx=x+84;}
  md_T(ctx,o.title||"",tx,y+(o.sub?h/2-6:h/2+11),{w:800,size:32});if(o.sub)md_T(ctx,o.sub,tx,y+h/2+32,{w:500,size:28,col:MD.soft,f:o.subMono?"mono":undefined});ctx.restore();return box;}
// a page of code, in mono: lines [text, colour or null], each 28 px; o.lineA (each line's opacity)
function mr_code(ctx,x,y,w,h,lines,o){o=o||{};return md_window(ctx,x,y,w,h,{logo:o.logo||"databricks",product:o.product||"Databricks Apps",title:o.title||"app.py",a:o.a,k:o.k,edge:o.edge,draw:(c,b)=>{
  lines.forEach((l,i)=>{const la=o.lineA?o.lineA[i]:1;if(la>0.004)md_T(c,l[0],b.x+8,b.y+38+i*44,{w:500,size:28,f:"mono",col:l[1]||MD.ink,a:la});});}});}
// words that wrap, some of them marked: parts [[text, colour or null], ...]; a marked run is drawn in its colour and underlined
// (o.markA, 0 to 1, how far the mark has come in); returns the height drawn
function mr_say(ctx,x,y,w,parts,o){o=o||{};const sz=o.size||32,lh=o.lh||46,fw=o.w||600,a=o.a==null?1:o.a,ma=o.markA==null?1:o.markA,sp=md_tw(ctx," ",{w:fw,size:sz});
  const words=[];parts.forEach(p=>String(p[0]).split(" ").forEach((wd,i,arr)=>{if(wd)words.push({s:wd,col:p[1]});}));
  let xx=x,yy=y,lines=1;const runs=[];for(const wd of words){const ww=md_tw(ctx,wd.s,{w:fw,size:sz});if(xx>x&&xx+ww>x+w){xx=x;yy+=lh;lines++;}runs.push({s:wd.s,x:xx,y:yy,w:ww,col:wd.col});xx+=ww+sp;}
  if(a>0.004){ctx.save();ctx.globalAlpha*=a;for(const r of runs){const marked=r.col&&ma>0;md_T(ctx,r.s,r.x,r.y,{w:fw,size:sz,col:marked?mix(MD.ink,r.col,ma):MD.ink});
      if(marked){ctx.save();ctx.globalAlpha*=ma;ctx.fillStyle=rgba(r.col,0.9);ctx.fillRect(r.x,r.y+8,r.w+(runs[runs.indexOf(r)+1]&&runs[runs.indexOf(r)+1].col&&runs[runs.indexOf(r)+1].y===r.y?sp:0),3);ctx.restore();}}ctx.restore();}
  return lines*lh;}
// a measure's words, as its metric view gives them: its name, its description and its synonyms; o.litA [name, description, synonyms]
// (each 0 to 1), o.synLit (the synonym that's used, lit in gold); returns its box
function mr_words(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=430,box={x,y,w,h,l:[x,y+h/2],r:[x+w,y+h/2]};if(a<=0.004)return box;const L=o.litA||[0,0,0];ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:MD.agreed,glow:0.8});md_icon(ctx,"contract",x+w-48,y+48,40,MD.agreed);
  md_T(ctx,"METRIC VIEW",x+28,y+52,{w:800,size:28,ls:4,col:MD.agreed});
  const row=(i,label,yy,draw)=>{if(L[i]>0){ctx.save();ctx.globalAlpha*=L[i];ctx.fillStyle=rgba(MD.agreed,0.1);rr(ctx,x+12,yy-38,w-24,draw.h,10);ctx.fill();ctx.restore();}md_T(ctx,label,x+28,yy,{w:600,size:28,col:MD.soft});draw(yy);};
  row(0,"Name",y+112,Object.assign(yy=>md_T(ctx,MR_NAME,x+250,yy,{w:500,size:28,f:"mono"}),{h:56}));
  row(1,"Description",y+180,Object.assign(yy=>{md_T(ctx,"What the casual teaching in a",x+250,yy,{w:600,size:28});md_T(ctx,"teaching period costs: approved",x+250,yy+38,{w:600,size:28});md_T(ctx,"claims, plus on-costs",x+250,yy+76,{w:600,size:28});},{h:132}));
  row(2,"Synonyms",y+330,Object.assign(yy=>{const sl=o.synLit||0;if(sl>0){ctx.save();ctx.globalAlpha*=sl;glow(ctx,x+400,yy-10,190,MD.agreed,0.3);ctx.restore();}
    md_T(ctx,"sessional teaching cost",x+250,yy,{w:700,size:28,col:sl>0.5?MD.agreed:MD.ink});md_T(ctx,"casual teaching spend",x+250,yy+40,{w:600,size:28});},{h:94}));
  ctx.restore();return box;}
// a name of its own: a badge on a lanyard under the agent's sphere, as the agent films hang one, drawn for the dark (its name in mono)
function mr_badge(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const drop=o.drop||40,sw=Math.sin((o.t||0)*1.3)*0.025,w=md_tw(ctx,text,{w:500,size:28,f:"mono"})+48,h=58;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(sw);ctx.strokeStyle=rgba(MD.flow,0.8);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-24,0);ctx.lineTo(-8,drop-8);ctx.moveTo(24,0);ctx.lineTo(8,drop-8);ctx.stroke();
  ctx.fillStyle="#8a94a6";ctx.fillRect(-9,drop-12,18,12);md_card(ctx,-w/2,drop,w,h,{edge:MD.flow,glow:0.6,r:10,fill:"rgba(9,16,32,0.96)"});ctx.fillStyle=rgba(MD.flow,0.85);ctx.fillRect(-w/2+10,drop+5,w-20,4);
  md_T(ctx,text,0,drop+40,{w:500,size:28,f:"mono",align:"center"});ctx.restore();}
// the shared table as the partner reads it, where it lives: a dashed card with its name (mono), then the semester and a row for each
// faculty; o.rowA (each row's opacity), o.semLit (the semester's line lit), o.edge; returns its box and its left port
function mr_sharedTable(ctx,x,y,w,name,sem,rows,o){o=o||{};const rh=44,h=104+46+rows.length*rh+24,a=o.a==null?1:o.a,box={x,y,w,h,l:[x,y+52]};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));if(o.lit)glow(ctx,x+w/2,y+h/2,w*0.6,o.edge||MD.flow,0.3*o.lit);
  md_card(ctx,x,y,w,h,{edge:o.edge||MD.flow,dash:[10,9],glow:0.6,r:14});md_icon(ctx,"table",x+38,y+52,36,MD.flow);md_T(ctx,name,x+72,y+46,{w:500,size:28,f:"mono"});md_T(ctx,"shared, read in place",x+72,y+84,{w:600,size:28,col:MD.flow});
  ctx.strokeStyle="rgba(170,200,245,0.22)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+20,y+104);ctx.lineTo(x+w-20,y+104);ctx.stroke();
  const sl=o.semLit||0;if(sl>0){ctx.save();ctx.globalAlpha*=sl;ctx.fillStyle=rgba(MD.ink,0.08);rr(ctx,x+12,y+112,w-24,40,8);ctx.fill();ctx.restore();}md_T(ctx,sem,x+28,y+142,{w:600,size:28,col:MD.soft});
  rows.forEach((r,i)=>{const ra=o.rowA?o.rowA[i]:1;if(ra<=0.004)return;const yy=y+150+i*rh;md_T(ctx,r[0],x+28,yy+30,{w:600,size:28,a:ra});md_T(ctx,r[1],x+w-28,yy+30,{w:700,size:28,align:"right",a:ra});});
  ctx.restore();return box;}
// a reader as the data project writes it down (a dbt exposure): a small card with its logo, the agent's sphere or an icon, and its
// name in mono; o.lit (0 to 1, lit in o.col); returns its box and its left port
function mr_expo(ctx,x,y,w,name,o){o=o||{};const h=72,a=o.a==null?1:o.a,box={x,y,w,h,l:[x,y+h/2]};if(a<=0.004)return box;const lit=o.lit||0,col=o.col||MD.wait;ctx.save();ctx.globalAlpha*=a;
  if(lit>0)glow(ctx,x+w/2,y+h/2,w*0.55,col,0.3*lit);md_card(ctx,x,y,w,h,{edge:lit>0.5?col:null,glow:0.5+0.6*lit,r:14});
  if(o.agent)ag_model(ctx,x+38,y+h/2,20,{t:o.t||0,core:0.8,think:0.1});else if(o.logo)logo(ctx,o.logo,x+20,y+h/2-18,36);else md_icon(ctx,o.icon||"view",x+38,y+h/2,32,MD.flow);
  md_T(ctx,name,x+76,y+h/2+10,{w:500,size:28,f:"mono"});ctx.restore();return box;}
