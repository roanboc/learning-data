/* ===== One policy for many tables: the opening, a road at night and the responders' guidebook =====
   The film's own pictures for its opening story (the module's kit is used as it is; every name here starts with op_ or OP_):
     opRoad   a two-lane highway at night, seen from its near verge: a tank trailer on its side on the far verge, wheels up, its cab
              jackknifed beside it with the door open; a field, and beyond it three houses with lit windows; at the left, a fire engine
              whose work light, on its mast, throws a warm light over the wreck. No country's signs, no brand on any vehicle.
     opBook   the guidebook open under that light: the yellow pages (each four-digit number and its guide) on the left, a guide's
              orange page on the right; the words are drawn live, so lines can light and a new one can slip in.
   The book's pages are drawn as the book is printed today (ERG2024: its guide numbers, its yellow and orange pages), and the film
   says so on screen where it shows them.
   The firefighter (OP_CREW) is the agent films' figure in the clothes of the 1970s: a long black turnout coat with pale reflective
   bands and hook-and-dee clasps, and a leather helmet with a long tail at the back, which stays inside the head's picture
   (figure x 160 to 440, y 250 to 560). Lit by the kit's "lamp" light, the fire engine's work light. The guide's own colours, a warm
   orange and yellow, are the book's, matte, and mean nothing else in the film. */
const OP={sky0:[5,10,20],sky1:[20,28,42],field:[12,20,22],road:[24,28,32],lamp:[255,214,160],tank:[148,156,162],
  engine:[124,42,36],orange:[236,132,52],yellow:[238,208,104],ink:[34,24,16],inkMut:[60,43,26],house:[24,28,34],win:[255,206,124]};

/* ---------------------------------------------------------------- the road at night */
function op_paintRoad(c){const R=ag_rnd(1754),hz=600;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(OP.sky0,1));g.addColorStop(1,rgba(OP.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,hz);
  for(let i=0;i<70;i++){const x=R()*W,y=R()*hz*0.8,r=0.6+R()*1.5;c.fillStyle="rgba(214,226,240,"+(0.08+R()*0.3).toFixed(3)+")";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  // a low line of trees along the horizon, and the glow of the houses' windows in the haze
  c.fillStyle="rgb(10,16,20)";c.beginPath();c.moveTo(0,hz);for(let x=0;x<=W;x+=24){c.lineTo(x,hz-14-14*Math.abs(Math.sin(x*0.013))-R()*10);}c.lineTo(W,hz);c.closePath();c.fill();
  // the field, and the road's two lanes
  g=c.createLinearGradient(0,hz,0,690);g.addColorStop(0,"rgb(14,22,24)");g.addColorStop(1,"rgb(10,16,18)");c.fillStyle=g;c.fillRect(0,hz,W,90);
  g=c.createLinearGradient(0,690,0,870);g.addColorStop(0,"rgb(30,33,37)");g.addColorStop(1,"rgb(20,23,26)");c.fillStyle=g;c.fillRect(0,690,W,180);
  g=c.createLinearGradient(0,870,0,H);g.addColorStop(0,"rgb(16,20,18)");g.addColorStop(1,"rgb(8,10,10)");c.fillStyle=g;c.fillRect(0,870,W,H-870);
  c.fillStyle="rgba(210,210,196,0.32)";c.fillRect(0,694,W,3);c.fillRect(0,864,W,4);
  for(let x=-30;x<W;x+=150){c.fillStyle="rgba(226,196,96,0.42)";c.fillRect(x,777,80,5);}
  for(let i=0;i<900;i++){const x=R()*W,y=690+R()*180;c.fillStyle="rgba(200,200,190,"+(0.02+R()*0.04).toFixed(3)+")";c.fillRect(x,y,2,2);}
  // three houses beyond the field, with lit windows
  for(const [hx,hw,hh] of [[1430,130,74],[1610,110,64],[1760,140,80]]){const by=hz+4;
    c.fillStyle=rgba(OP.house,1);c.fillRect(hx,by-hh,hw,hh);c.beginPath();c.moveTo(hx-10,by-hh);c.lineTo(hx+hw/2,by-hh-40);c.lineTo(hx+hw+10,by-hh);c.closePath();c.fill();
    for(const [wx,wy] of [[hx+22,by-hh+20],[hx+hw-44,by-hh+20]]){const wg=c.createRadialGradient(wx+11,wy+12,0,wx+11,wy+12,60);wg.addColorStop(0,"rgba(255,200,120,0.22)");wg.addColorStop(1,"rgba(255,200,120,0)");
      c.fillStyle=wg;c.fillRect(wx-50,wy-48,122,120);c.fillStyle=rgba(OP.win,0.92);c.fillRect(wx,wy,22,24);c.fillStyle="rgba(60,40,20,0.5)";c.fillRect(wx+10,wy,2,24);}}
  // the fire engine, at the left, on the near lane: its body, its cab facing the wreck, a ladder, and its work light on a mast
  const e=OP.engine;c.save();
  ag_soft(c,cc=>ag_rect(cc,-40,560,330,270,10),ag_dk(e,0.25),ag_lt(e,0.18),210,600,260,"rgba(0,0,0,0.5)",20);
  ag_soft(c,cc=>{cc.moveTo(290,830);cc.lineTo(290,600);cc.bezierCurveTo(300,586,330,580,368,584);cc.lineTo(392,660);cc.lineTo(396,830);cc.closePath();},ag_dk(e,0.2),ag_lt(e,0.2),360,640,160,"rgba(0,0,0,0.45)",16);
  c.fillStyle="rgba(150,190,210,0.28)";c.beginPath();c.moveTo(306,606);c.lineTo(360,600);c.lineTo(378,656);c.lineTo(306,660);c.closePath();c.fill();
  c.fillStyle="rgba(214,210,200,0.5)";c.fillRect(-40,700,436,8);c.fillRect(-40,770,436,5);
  c.strokeStyle="rgba(200,196,186,0.55)";c.lineWidth=5;c.beginPath();c.moveTo(-40,548);c.lineTo(270,548);c.moveTo(-40,528);c.lineTo(270,528);c.stroke();
  c.lineWidth=3;for(let x=-30;x<270;x+=34){c.beginPath();c.moveTo(x,528);c.lineTo(x,548);c.stroke();}
  for(const wx of [70,320]){c.fillStyle="rgb(10,10,12)";c.beginPath();c.arc(wx,838,40,0,TAU);c.fill();c.fillStyle="rgba(150,150,150,0.5)";c.beginPath();c.arc(wx,838,15,0,TAU);c.fill();}
  c.strokeStyle="rgb(60,62,64)";c.lineWidth=8;c.beginPath();c.moveTo(250,560);c.lineTo(250,420);c.stroke();
  ag_soft(c,cc=>ag_rect(cc,224,392,62,40,8),[70,72,74],[150,150,150],260,400,40,null);c.fillStyle="rgba(255,236,200,0.95)";c.fillRect(282,398,8,28);c.restore();
  // the work light: a warm cone from the mast to the wreck, and its pool on the road and the verge
  c.save();c.globalCompositeOperation="lighter";
  const cg=c.createLinearGradient(290,410,1700,700);cg.addColorStop(0,"rgba(255,214,160,0.16)");cg.addColorStop(0.55,"rgba(255,214,160,0.05)");cg.addColorStop(1,"rgba(255,214,160,0)");c.fillStyle=cg;
  c.beginPath();c.moveTo(290,402);c.lineTo(1700,540);c.lineTo(1700,860);c.lineTo(290,426);c.closePath();c.fill();
  const pg=c.createRadialGradient(1080,700,0,1080,700,720);pg.addColorStop(0,"rgba(255,206,150,0.20)");pg.addColorStop(1,"rgba(255,206,150,0)");c.fillStyle=pg;
  c.translate(1080,700);c.scale(1,0.4);c.translate(-1080,-700);c.fillRect(360,-100,1440,1600);c.restore();
  // the tank trailer on its side on the far verge, its wheels up behind it; the cab beside it, upright, its door open
  op_paintTank(c);op_paintCab(c);
  // the dark of the night closing in at the edges
  const v=c.createRadialGradient(1000,640,300,1000,640,1250);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.5)");c.fillStyle=v;c.fillRect(0,0,W,H);}
function op_paintTank(c){const t=OP.tank,x0=760,x1=1400,y0=590,y1=706,r=(y1-y0)/2;
  // the wheels, up, behind the tank: dark tyres in pairs
  for(const wx of [880,960,1230,1310]){ag_soft(c,cc=>{cc.ellipse(wx,y0+6,36,30,0,Math.PI,TAU);cc.closePath();},[18,18,20],[70,70,74],wx-6,y0-14,30,null);}
  c.fillStyle="rgb(30,30,32)";c.fillRect(840,y0-4,520,10);
  ag_soft(c,cc=>{cc.moveTo(x0+r,y0);cc.lineTo(x1-r,y0);cc.arc(x1-r,y0+r,r,-Math.PI/2,Math.PI/2);cc.lineTo(x0+r,y1);cc.arc(x0+r,y0+r,r,Math.PI/2,Math.PI*1.5);cc.closePath();},
    ag_dk(t,0.35),ag_lt(t,0.25),1040,612,420,"rgba(0,0,0,0.55)",22);
  // its ribs and the walkway along its top, now facing us
  c.save();c.beginPath();c.moveTo(x0+r,y0);c.lineTo(x1-r,y0);c.arc(x1-r,y0+r,r,-Math.PI/2,Math.PI/2);c.lineTo(x0+r,y1);c.arc(x0+r,y0+r,r,Math.PI/2,Math.PI*1.5);c.closePath();c.clip();
  c.strokeStyle="rgba(40,44,48,0.55)";c.lineWidth=3;for(const x of [900,1040,1180,1320]){c.beginPath();c.moveTo(x,y0);c.lineTo(x,y1);c.stroke();}
  c.fillStyle="rgba(60,64,68,0.6)";c.fillRect(x0+40,y0+r-9,x1-x0-80,18);for(const x of [930,1110,1290]){c.fillStyle="rgba(90,94,98,0.8)";c.beginPath();c.ellipse(x,y0+r,30,14,0,0,TAU);c.fill();}
  const lg=c.createLinearGradient(0,y0,0,y1);lg.addColorStop(0,"rgba(255,220,170,0.18)");lg.addColorStop(0.4,"rgba(255,220,170,0)");lg.addColorStop(1,"rgba(0,0,0,0.3)");c.fillStyle=lg;c.fillRect(x0,y0,x1-x0,y1-y0);c.restore();
  c.fillStyle="rgba(0,0,0,0.35)";c.beginPath();c.ellipse(1080,y1+6,340,12,0,0,TAU);c.fill();}
function op_paintCab(c){const e=[88,96,104],x=1426,y=540,w=200,h=190;
  c.fillStyle="rgba(0,0,0,0.4)";c.beginPath();c.ellipse(x+w/2,y+h+18,130,12,0,0,TAU);c.fill();
  // the cab, its flat front facing the right, its side towards us; the doorway dark, the seat and the papers on it
  ag_soft(c,cc=>ag_rect(cc,x,y,w,h,14),ag_dk(e,0.3),ag_lt(e,0.2),x+60,y+30,200,"rgba(0,0,0,0.5)",18);
  c.fillStyle="rgba(150,180,196,0.3)";rr(c,x+w-70,y+18,58,62,8);c.fill();
  c.fillStyle="rgb(14,16,18)";rr(c,x+24,y+20,96,150,6);c.fill();
  c.fillStyle="rgb(44,38,34)";c.fillRect(x+30,y+104,84,26);
  c.save();c.translate(x+52,y+98);c.rotate(-0.08);c.fillStyle="rgb(214,206,186)";c.fillRect(0,0,46,12);c.fillStyle="rgb(196,188,168)";c.fillRect(6,-6,44,12);c.restore();
  // the door, swung open towards us
  ag_soft(c,cc=>{cc.moveTo(x+24,y+20);cc.lineTo(x-46,y+36);cc.lineTo(x-46,y+178);cc.lineTo(x+24,y+170);cc.closePath();},ag_dk(e,0.2),ag_lt(e,0.3),x-20,y+60,90,"rgba(0,0,0,0.4)",10);
  c.fillStyle="rgba(150,180,196,0.26)";c.beginPath();c.moveTo(x+14,y+32);c.lineTo(x-36,y+44);c.lineTo(x-36,y+96);c.lineTo(x+14,y+90);c.closePath();c.fill();
  for(const wx of [x+40,x+160]){c.fillStyle="rgb(10,10,12)";c.beginPath();c.arc(wx,y+h+4,30,0,TAU);c.fill();c.fillStyle="rgba(140,140,140,0.5)";c.beginPath();c.arc(wx,y+h+4,11,0,TAU);c.fill();}}
AG_PLACES.opRoad=c=>op_paintRoad(c);

/* ---------------------------------------------------------------- the guidebook, open, close up */
const OP_BOOK={L:[150,124,790,740],R:[980,124,790,740]};
function op_paintBook(c){let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(16,14,14)");g.addColorStop(1,"rgb(8,8,8)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const R=ag_rnd(80);c.save();c.shadowColor="rgba(0,0,0,0.7)";c.shadowBlur=60;c.shadowOffsetY=20;c.fillStyle="rgb(40,36,30)";rr(c,120,100,1680,790,18);c.fill();c.restore();
  for(const [k,col] of [["L",OP.yellow],["R",OP.orange]]){const [x,y,w,h]=OP_BOOK[k];
    ag_soft(c,cc=>ag_rect(cc,x,y,w,h,6),ag_dk(col,0.06),ag_lt(col,0.18),x+w*0.4,y+h*0.3,w*0.8,"rgba(60,30,10,0.35)",30);
    for(let i=0;i<1400;i++){c.fillStyle="rgba(80,50,20,"+(0.02+R()*0.04).toFixed(3)+")";c.fillRect(x+R()*w,y+R()*h,2,2);}}
  // the spine, the pages' curve into it, and the lamp's warm light falling from the left
  const sg=c.createLinearGradient(900,0,1020,0);sg.addColorStop(0,"rgba(0,0,0,0)");sg.addColorStop(0.5,"rgba(30,16,6,0.5)");sg.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=sg;c.fillRect(900,120,120,750);
  c.save();c.globalCompositeOperation="lighter";const lg=c.createRadialGradient(560,300,0,560,300,1300);lg.addColorStop(0,"rgba(255,214,160,0.10)");lg.addColorStop(1,"rgba(255,214,160,0)");c.fillStyle=lg;c.fillRect(0,0,W,H);c.restore();
  const v=c.createRadialGradient(960,500,400,960,500,1200);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.45)");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.opBook=c=>op_paintBook(c);

// a word on the guide's paper: dark ink, at least 28 px
function op_ink(ctx,s,x,y,o){o=o||{};dp_T(ctx,s,x,y,Object.assign({w:600,size:30},o,{col:o.col||OP.ink}));}
/* the yellow pages: rows [id, guide, name], from the top (o.rows, OP_YELLOW by default); o.lit {id: 0..1} lights a row; o.slip {id, p}
   slides a new row in from the right, opening its gap first (the rows under it move down over the first half, then the line types in) */
const OP_YELLOW=[["1752","156","Chloroacetyl chloride"],["1753","156","Chlorophenyltrichlorosilane"],["1777","137","Fluorosulfonic acid"],
  ["1809","137","Phosphorus trichloride"],["1810","137","Phosphorus oxychloride"],["1830","137","Sulfuric acid"],["1834","137","Sulfuryl chloride"],["1836","137","Thionyl chloride"]];
const OP_ROWY0=320,OP_ROWH=58;
function op_yellow(ctx,o){o=o||{};const [x,y]=OP_BOOK.L,lit=o.lit||{},s=o.slip,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  op_ink(ctx,"Yellow pages · by number",x+48,y+76,{w:800,size:32});
  op_ink(ctx,"ID",x+48,y+130,{size:28,col:OP.inkMut,w:700});op_ink(ctx,"Guide",x+170,y+130,{size:28,col:OP.inkMut,w:700});op_ink(ctx,"Name of material",x+300,y+130,{size:28,col:OP.inkMut,w:700});
  ctx.fillStyle=rgba(OP.inkMut,0.5);ctx.fillRect(x+48,y+148,690,2);
  const R=o.rows||OP_YELLOW,gap=s?ag_sine(clamp(s.p*2,0,1)):0,at=s?R.findIndex(r=>+r[0]>+s.id):-1;
  R.forEach((r,i)=>{const yy=OP_ROWY0+i*OP_ROWH+(s&&i>=at?gap*OP_ROWH:0),l=lit[r[0]]||0;op_row(ctx,x,yy,r,l);});
  if(s&&s.p>0.5){const q=ag_eo((s.p-0.5)*2),yy=OP_ROWY0+at*OP_ROWH,dx=(1-q)*120;ctx.save();ctx.globalAlpha*=q;op_row(ctx,x+dx,yy,[s.id,s.guide,s.name],lit[s.id]||0);ctx.restore();}
  ctx.restore();}
function op_row(ctx,x,yy,r,l){if(l>0){ctx.save();ctx.globalAlpha*=l;ctx.fillStyle="rgba(255,250,236,0.55)";rr(ctx,x+30,yy-40,740,54,10);ctx.fill();ctx.restore();}
  op_ink(ctx,r[0],x+48,yy,{w:700});op_ink(ctx,r[1],x+170,yy,{w:800});op_ink(ctx,r[2],x+300,yy,{w:600,size:28});}
// where a yellow row's guide number sits, for a line of light to the guide's page
function op_rowAt(id,slip,rows){const R=rows||OP_YELLOW,i=R.findIndex(r=>r[0]===id),at=slip?R.findIndex(r=>+r[0]>+slip.id):-1;
  if(i<0)return[OP_BOOK.L[0]+770,OP_ROWY0+at*OP_ROWH-12];return[OP_BOOK.L[0]+770,OP_ROWY0+i*OP_ROWH+(slip&&i>=at?ag_sine(clamp(slip.p*2,0,1))*OP_ROWH:0)-12];}
// where the guide's number sits on its page, for those lines to end
const OP_GUIDEAT=[996,272];
/* a guide's orange page: o.guide ("137" or "111"); turn (0 to 1) turns the page from its last guide to this one: the page narrows to
   its spine and opens again, so two pages' words never show at once */
const OP_GUIDES={
  "137":{title:"Substances · Water-reactive · Corrosive",lines:[["POTENTIAL HAZARDS",1],["Reacts with water, giving off",0],["corrosive and toxic gases",0],["PUBLIC SAFETY",1],["Stay upwind",0],["EVACUATION",1],["Isolate at least 50 m for liquids",0]]},
  "111":{title:"Mixed load · Unidentified cargo",lines:[["POTENTIAL HAZARDS",1],["May explode from heat or shock",0],["May react with air, water or foam",0],["May cause severe injury or death",0],["Toxic gases with fire or water",0],["EVACUATION",1],["Isolate at least 100 m",0]]}};
function op_guide(ctx,g,o){o=o||{};const G=OP_GUIDES[g],[x,y,w,h]=OP_BOOK.R,a=o.a==null?1:o.a;if(a<=0||!G)return;ctx.save();ctx.globalAlpha*=a;
  op_ink(ctx,"GUIDE",x+56,y+92,{w:800,size:34});op_ink(ctx,g,x+56,y+176,{w:800,size:80});
  op_ink(ctx,G.title,x+56,y+248,{w:700,size:32});ctx.fillStyle=rgba(OP.ink,0.5);ctx.fillRect(x+56,y+272,w-112,2.5);
  G.lines.forEach((l,i)=>op_ink(ctx,l[0],x+56,y+332+i*56,{w:l[1]?800:600,size:l[1]?28:30}));ctx.restore();}
// the right page turning from one guide to the next: u 0 to 1
function op_turn(ctx,from,to,u){const [x,y,w,h]=OP_BOOK.R,k=Math.abs(Math.cos(Math.PI*clamp(u,0,1))),g=u<0.5?from:to;
  ctx.save();ctx.translate(x,0);ctx.scale(Math.max(0.001,k),1);ctx.translate(-x,0);
  if(u>0.02&&u<0.98){ctx.fillStyle=rgba(ag_dk(OP.orange,0.12),1);rr(ctx,x,y,w,h,6);ctx.fill();}
  // while the page is narrow its words would be under 28 px wide: they show only while it's nearly open
  if(k>0.96)op_guide(ctx,g,{});ctx.restore();}

/* ---------------------------------------------------------------- the guide of the 1970s, a page for each chemical
   a card beside the firefighter: the thin book open at one chemical's page, a few dozen tabs along its edge; more (0 to 1) runs the tabs
   on past the last, as empty outlines fading into the dark: thousands of chemicals with no page */
function op_oldGuide(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,k=o.k==null?1:o.k;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+200,y+200,lerp(0.6,1,k));
  dp_panel(ctx,x,y,400,420,{col:"grey",r:20,behind:"opRoad",glowR:30});
  const px=x+30,py=y+30,pw=300,ph=360;ag_soft(ctx,cc=>ag_rect(cc,px,py,pw,ph,6),[214,202,176],[240,232,214],px+80,py+60,260,"rgba(60,40,20,0.3)",14);
  op_ink(ctx,"Chlorine",px+28,py+64,{w:800,size:36});ctx.fillStyle=rgba(OP.ink,0.5);ctx.fillRect(px+28,py+84,pw-56,2);
  for(let i=0;i<9;i++){ctx.fillStyle=rgba(OP.inkMut,0.32);ctx.fillRect(px+28,py+116+i*26,(i%3===2?0.6:0.92)*(pw-56),9);}
  // the tabs, down the page's edge: a few dozen chemicals
  for(let i=0;i<12;i++){const ty=py+10+i*29;ctx.fillStyle=i===1?"rgb(236,132,52)":rgba([200,186,160],1);rr(ctx,px+pw,ty,30,24,4);ctx.fill();}
  ctx.restore();
  const m=o.more||0;if(m>0){ctx.save();ctx.globalAlpha*=a*clamp(m*1.4,0,1);const n=Math.round(60*m);
    for(let i=0;i<n;i++){const tx=x+430+i*24,fa=Math.max(0,1-i/60);if(tx>W)break;ctx.strokeStyle="rgba(200,190,170,"+(0.7*fa).toFixed(3)+")";ctx.lineWidth=1.6;rr(ctx,tx,y+352,18,26,4);ctx.stroke();}
    if(m>0.3){ctx.globalAlpha*=clamp((m-0.3)*3,0,1);dp_T(ctx,"Thousands with no page",x+430,y+330,{w:700,size:30,col:"mut"});}ctx.restore();}}
// the guide in the firefighter's hand, closed: thin and grey in the 1970s, the orange book from 1980 (u 0 to 1 between them)
function op_heldBook(c,h,u){const x=h.near[0]-16,y=h.near[1]-150,th=lerp(18,34,u),col=mix([150,140,120],OP.orange,u);
  c.save();c.translate(x,y);c.rotate(-0.12);ag_soft(c,cc=>ag_rect(cc,0,0,96,140,6),ag_dk(col,0.1),ag_lt(col,0.25),30,30,90,"rgba(40,20,10,0.4)",8);
  c.fillStyle=rgba(ag_lt(col,0.5),0.9);c.fillRect(96,4,th*0.3,132);c.restore();}

/* ---------------------------------------------------------------- on the road: the spill, the water, the cloud, the panel, the binoculars */
// the dark stain spreading from the tank, its sheen in the work light; p 0 to 1
function op_stain(ctx,p){if(p<=0)return;const r=lerp(30,220,ag_eo(p));ctx.save();ctx.fillStyle="rgba(8,8,10,0.62)";ctx.beginPath();ctx.ellipse(1150,724,r*1.4,r*0.16+6,0,0,TAU);ctx.fill();
  ctx.globalCompositeOperation="lighter";const g=ctx.createRadialGradient(1100,720,0,1100,720,r);g.addColorStop(0,"rgba(255,214,160,0.12)");g.addColorStop(1,"rgba(255,214,160,0)");ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(1150,724,r*1.3,r*0.14+4,0,0,TAU);ctx.fill();ctx.restore();}
// water from a hose held by a crew out of the picture, below it, arcing up and down onto the stain; p draws it on, a fades it
function op_spray(ctx,t,p,a){if(p<=0||a<=0)return;const P0=[700,1110],P1=[860,470],P2=[1090,716],n=52;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<n;i++){const u=i/n;if(u>p)break;const x=(1-u)*(1-u)*P0[0]+2*(1-u)*u*P1[0]+u*u*P2[0],y=(1-u)*(1-u)*P0[1]+2*(1-u)*u*P1[1]+u*u*P2[1],j=Math.sin(t*9+i*1.7)*3;
    ctx.fillStyle="rgba(214,232,240,"+(0.35+0.25*Math.sin(i*2.1+t*6)).toFixed(3)+")";ctx.beginPath();ctx.arc(x+j,y+j*0.5,2.4+u*1.6,0,TAU);ctx.fill();}ctx.restore();}
// the pale cloud lifting where water meets the stain, drifting towards the houses: p how far it has come, a its opacity
function op_cloud(ctx,p,a){if(a<=0||p<=0)return;ctx.save();ctx.globalAlpha*=a;const R=ag_rnd(7);
  for(let i=0;i<16;i++){const u=clamp(p*1.15-i*0.035,0,1);if(u<=0)continue;const x=lerp(1100,1560,u)+(R()-0.5)*160*u,y=lerp(700,540,u)+(R()-0.5)*70*u,r=40+140*u*(0.6+R()*0.6);
    const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,"rgba(214,226,200,"+(0.3*(1-u*0.4)).toFixed(3)+")");g.addColorStop(1,"rgba(214,226,200,0)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);}
  ctx.restore();}
// the orange panel on the tank: its four-digit number
function op_panel(ctx,x,y,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgb(20,16,12)";rr(ctx,x-4,y-4,136,72,6);ctx.fill();
  ctx.fillStyle=rgba(OP.orange,1);rr(ctx,x,y,128,64,4);ctx.fill();dp_T(ctx,"1754",x+64,y+45,{w:800,size:36,align:"center",col:OP.ink});ctx.restore();}
// the binoculars' view, round, over what it looks at: the panel's number sharp inside it
function op_binoculars(ctx,cx,cy,r,u,paint){if(u<=0)return;const rr_=r*ag_eo(u);ctx.save();ctx.beginPath();ctx.arc(cx,cy,rr_,0,TAU);ctx.clip();
  ctx.fillStyle="rgba(4,6,8,0.86)";ctx.fillRect(cx-r,cy-r,2*r,2*r);paint(ctx);ctx.restore();
  ctx.save();ctx.strokeStyle="rgba(230,240,240,0.85)";ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,rr_,0,TAU);ctx.stroke();ctx.lineWidth=1.5;ctx.strokeStyle="rgba(230,240,240,0.4)";ctx.beginPath();ctx.arc(cx,cy,Math.max(0,rr_-10),0,TAU);ctx.stroke();ctx.restore();}
// the wind behind the crew, from upwind: three strokes and an arrow, drawn on
function op_wind(ctx,x,y,p,a){if(p<=0||a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle="rgba(214,232,240,0.8)";ctx.lineWidth=4;ctx.lineCap="round";
  for(let i=0;i<3;i++){const yy=y+i*26,x1=x+lerp(0,170-i*30,ag_eo(p));ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x1,yy);ctx.stroke();}
  const ex=x+170*ag_eo(p);ctx.beginPath();ctx.moveTo(ex-14,y-12);ctx.lineTo(ex+2,y);ctx.lineTo(ex-14,y+12);ctx.stroke();
  dp_T(ctx,"wind",x,y-24,{w:700,size:28,col:"mut"});ctx.restore();}

/* the guide's own words for 1754, on a card of its paper: what a crew knows before it goes near (Guide 137's public safety and
   evacuation lines, as the book prints them). Its box is OP_GUIDECARD, the box the hall's policy card takes after the cut, so the two
   share a shape. p1 and p2 bring in its two lines. */
const OP_GUIDECARD=[1240,110,560,330];
function op_guideCard(ctx,o){o=o||{};const [x,y,w,h]=OP_GUIDECARD,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_eo(o.k)));
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=30;ctx.shadowOffsetY=8;rr(ctx,x,y,w,h,14);ctx.fillStyle=rgba(OP.orange,1);ctx.fill();ctx.restore();
  ag_soft(ctx,cc=>ag_rect(cc,x,y,w,h,14),ag_dk(OP.orange,0.04),ag_lt(OP.orange,0.16),x+w*0.4,y+h*0.3,w*0.8,null,0);
  op_ink(ctx,"GUIDE 137",x+40,y+70,{w:800,size:34});op_ink(ctx,"1754 · Chlorosulfonic acid",x+40,y+118,{w:700,size:28,col:OP.inkMut});
  ctx.fillStyle=rgba(OP.ink,0.45);ctx.fillRect(x+40,y+140,w-80,2.5);
  for(const [s_,yy,p] of [["Stay upwind",y+204,o.p1],["Isolate at least 50 m",y+268,o.p2]]){const q=p==null?1:clamp(p,0,1);if(q<=0)continue;ctx.save();ctx.globalAlpha*=q;
    op_ink(ctx,s_,x+40+(1-ag_eo(q))*30,yy,{w:800,size:36});ctx.restore();}
  ctx.restore();}
// the yellow pages as the later chapters show them: 1754 in its place, 1752 above the top of the view
const OP_YELLOW_NOW=[["1753","156","Chlorophenyltrichlorosilane"],["1754","137","Chlorosulfonic acid"],["1777","137","Fluorosulfonic acid"],["1809","137","Phosphorus trichloride"],
  ["1810","137","Phosphorus oxychloride"],["1830","137","Sulfuric acid"],["1834","137","Sulfuryl chloride"],["1836","137","Thionyl chloride"]];

/* ---------------------------------------------------------------- the firefighter, in the clothes of the 1970s */
// a leather helmet: its dome over the skull, a plain front piece, and a brim narrow over the brow and long at the back to shed water
function op_helmet(c,P){const L=[66,46,36];
  ag_soft(c,cc=>{cc.moveTo(170,452);cc.bezierCurveTo(176,432,196,412,214,392);cc.lineTo(384,372);cc.bezierCurveTo(400,372,414,376,418,382);
    cc.bezierCurveTo(404,394,380,398,356,400);cc.bezierCurveTo(300,404,252,420,214,446);cc.bezierCurveTo(198,458,180,466,170,452);cc.closePath();},
    ag_dk(L,0.2),ag_lt(L,0.3),360,380,140,"rgba(0,0,0,0.45)",10);
  ag_soft(c,cc=>{cc.moveTo(208,394);cc.bezierCurveTo(206,330,246,282,300,276);cc.bezierCurveTo(352,272,386,312,388,374);cc.bezierCurveTo(330,380,262,386,208,394);cc.closePath();},
    L,ag_lt(L,0.38),340,300,140,"rgba(0,0,0,0.5)",16);
  c.strokeStyle="rgba(20,12,8,0.45)";c.lineWidth=2.4;c.beginPath();c.moveTo(300,278);c.quadraticCurveTo(312,330,316,382);c.moveTo(250,296);c.quadraticCurveTo(250,340,256,388);c.stroke();
  ag_soft(c,cc=>{cc.moveTo(352,300);cc.bezierCurveTo(372,304,384,326,384,352);cc.lineTo(382,374);cc.lineTo(350,378);cc.bezierCurveTo(344,350,344,320,352,300);cc.closePath();},
    [128,92,60],[176,140,98],370,320,40,"rgba(40,20,10,0.4)",6);}
// the turnout coat: a high collar, hook-and-dee clasps down the front, and pale reflective bands across the chest and near the hem
function op_coat(c,P){c.save();ag_shape(c,AG_F.torso);c.clip();
  const band=(y,h)=>{ag_soft(c,cc=>{cc.moveTo(80,y);cc.bezierCurveTo(200,y+10,330,y+14,440,y+4);cc.lineTo(440,y+4+h);cc.bezierCurveTo(330,y+14+h,200,y+10+h,80,y+h);cc.closePath();},
    [226,220,168],[250,248,214],330,y+6,220,"rgba(40,40,20,0.3)",6);};
  band(790,40);band(1030,40);
  c.strokeStyle="rgba(10,10,10,0.6)";c.lineWidth=3;c.beginPath();c.moveTo(326,612);c.bezierCurveTo(322,760,318,940,316,1100);c.stroke();
  for(let i=0;i<5;i++){const y=660+i*88,x=328-(y-612)*0.02;c.fillStyle="rgb(150,152,150)";rr(c,x-4,y-6,18,12,3);c.fill();c.fillStyle="rgba(255,255,255,0.4)";c.fillRect(x-2,y-5,10,3);}
  c.restore();
  ag_soft(c,cc=>{cc.moveTo(226,548);cc.bezierCurveTo(254,594,312,612,366,598);cc.lineTo(372,632);cc.bezierCurveTo(310,650,244,628,214,584);cc.closePath();},
    ag_lt(P.top.c,0.06),ag_lt(P.top.c,0.24),330,600,80,rgba(ag_dk(P.top.c,0.7),0.4),8);}
const OP_CREW={key:"op_crew",name:"A firefighter",skin:[196,148,110],hair:{style:"cropped",c:[40,30,26]},top:{kind:"tunic",c:[46,44,42],paint:op_coat},hat:{paint:op_helmet},breath:0.27};
