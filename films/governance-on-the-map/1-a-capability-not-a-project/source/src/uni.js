/* ===== A capability, not a project: the university =====
   The university's rooms as the series paints them (its rooms.js): the floor where the work is done, Yusuf's office and his board,
   Noor's room and her map, the stewards' meeting room; and one new place, the deputy vice-chancellor's office, a corner room in the
   newer building, in winter. What's on them: the two reports' cards on the glass; the wall planner for 2027, the budget, the project's
   final report; the map's strategy band drawn large, with govern data and its eight capabilities, coloured by evidence; the business
   band, with the seven services people can ask for and their promises. Every name starts with cp_ or CP_. */

/* ---------- moments, tags and the corner pill ---------- */
// small type, drawn on purpose as part of a picture, that the legibility check (tools/legible.py) leaves out: it reads PH_OFF, the name the
// From words to data tools give it
let PH_OFF=0;
// fn draws with each word fading as the frame comes to cut it, from 30 px inside the frame's edge to gone at it, so the frame never cuts
// a word, as the playbook asks (as A product with an owner's po_fadeCut): the camera moves in on a corner of the map, and what it leaves
// fades. blocks: [x0, y0, x1, y1] where ctx is now, each a card's or a note's lines; a word in one fades with the whole block, so a card
// never shows half its words
function cp_fadeCut(ctx,fn,blocks){const T0=T,cw=ctx.canvas.width,ch=ctx.canvas.height,r=30*cw/1920,M=ctx.getTransform(),
    Bk=(blocks||[]).map(([x0,y0,x1,y1])=>[M.a*x0+M.e,M.d*y0+M.f,M.a*x1+M.e,M.d*y1+M.f]);
  T=(c,s2,x,y,o)=>{o=o||{};const sz=o.size||24,w=tw(c,String(s2),sz,o.w,o.f),al=o.align||"left",x0=al==="center"?x-w/2:al==="right"?x-w:x,m=c.getTransform();
    let l=1e9,rt=-1e9,tp=1e9,bt=-1e9;for(const [px,py] of [[x0,y-0.75*sz],[x0+w,y-0.75*sz],[x0,y+0.2*sz],[x0+w,y+0.2*sz]]){const X=m.a*px+m.c*py+m.e,Y=m.b*px+m.d*py+m.f;
      l=Math.min(l,X);rt=Math.max(rt,X);tp=Math.min(tp,Y);bt=Math.max(bt,Y);}
    const mx=(l+rt)/2,my=(tp+bt)/2,b=Bk.find(([a,q,e,d])=>mx>=a-6&&mx<=e+6&&my>=q-6&&my<=d+6);if(b){l=Math.min(l,b[0]);tp=Math.min(tp,b[1]);rt=Math.max(rt,b[2]);bt=Math.max(bt,b[3]);}
    const a=clamp(Math.min(l/r,(cw-rt)/r,tp/r,(ch-bt)/r),0,1);if(a>=0.99)return T0(c,s2,x,y,o);if(a>0.01)withA(c,a,()=>T0(c,s2,x,y,o));};
  try{return fn();}finally{T=T0;}}
// the block a card's lines make, for cp_fadeCut: L centred on cx, the first on y, lh apart
function cp_block(ctx,L,cx,y,lh,sz,w){const m=Math.max(...L.map(l=>tw(ctx,l,sz,w)));return[cx-m/2,y-0.75*sz,cx+m/2,y+(L.length-1)*lh+0.2*sz];}
// made once per chapter, the first time it draws: its cues are known by then
const cp_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a chapter's shots, as the series' gv_shots, except that a shot marked cut comes in on a cut: two framings of one place at one moment,
// which a dissolve would lay over each other, a little apart, so the people and the cards in it showed twice
function cp_shots(ctx,S,t,end,shots){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;
  if(!shots[i].cut)return gv_shots(ctx,S,t,end,shots);gv_shot(ctx,S,t,shots[i],shots[i+1]?shots[i+1].at:end);return i;}
// a tag that springs in at t0 and goes at t1 (or stays)
function cp_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// the place and the time in the top corner, shown between t0 and t1
const cp_pillAt=(ctx,t,t0,t1,s)=>wc_year(ctx,56,72,s,gv_io(t,t0,t1,0.35));
// a name card: the name, and the role under it
function cp_nameCard(ctx,cx,cy,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60),h=104,k=0.92+0.08*spring(clamp(a,0,1));
  ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);withA(ctx,clamp(a*2,0,1),()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:Math.round(cx)});
    wc_T(ctx,name,0,-h/2+44,{w:800,size:32,align:"center",col:WC_DARK});wc_T(ctx,role,0,-h/2+82,{w:600,size:28,align:"center",col:WC_MUTED});});ctx.restore();}

/* ---------- the floor where the work is done ---------- */
// the people at work behind the glass, as the series' first film drew them (o.out leaves someone out, o.pose changes what someone's
// doing), then the glass, then the offices' names (a name the frame would cut fades out)
const CP_AT={clara:0,mei:1,yusuf:2,jun:3,sam:4},CP_WORK={clara:{pose:"reach"},mei:{pose:"hold",carry:heldNotebook},yusuf:{pose:"write",carry:heldNotebook},jun:{pose:"reach"},sam:{pose:"phone"}};
function cp_floor(x,tt,o){o=o||{};const F=GV_FL;Object.keys(CP_AT).forEach(id=>{const i=CP_AT[id];if((o.out||[]).includes(id))return;
    person(x,id,(o.x||{})[id]||F.spot(i),806,0.5,Object.assign({pose:"stand",t:tt,flip:i%2===1},CP_WORK[id],(o.pose||{})[id]||{}));});
  gv_floorGlass(x);const m=x.getTransform(),vl=-m.e/m.a,vr=(x.canvas.width-m.e)/m.a,a=o.names==null?1:o.names;
  F.rooms.forEach((r,i)=>{const cx=F.x(i)+F.w/2,hw=tw(x,r[1],30,800)/2+6;gv_floorName(x,i,a*clamp(Math.min(cx-hw-vl,vr-cx-hw)/30,0,1));});}
// a green tick in a small round wash, springing in
function cp_tickBadge(x,cx,cy,r,u,seed){if(u<=0.01)return;const k=0.85+0.15*spring(clamp(u,0,1));x.save();x.translate(cx,cy);x.scale(k,k);
  withA(x,clamp(u*3,0,1),()=>{wc_wash(x,wc_ell(0,0,r,r,24),wc_lit(GV.green,0.15),{kind:"thing",lw:1.2,seed:seed||150});wc_tick(x,1,-1,r*1.15,[255,255,255],clamp(u*2-0.3,0,1),Math.max(3,r*0.19));});x.restore();}
// a card on an office's glass: its lines, centred, coming in with u; o.blur, its number not yet clear
function cp_glassCard(x,i,u,lines,o){o=o||{};if(u<=0)return;const F=GV_FL,sz=30,h=82+(lines.length-1)*(sz+12),k=0.92+0.08*spring(u);
  x.save();x.translate(F.x(i)+F.w/2,F.top+250+h/2);x.scale(k,k);
  withA(x,clamp(u*2,0,1),()=>gv_card(x,-F.w/2+22,-h/2,F.w-44,h,lines,{size:sz,align:"center",pin:false,y0:52,wash:[40,96,150],washA:0.14}));x.restore();}
// a pencil arc from one point to another, bowing up by lift, drawn on as p goes from 0 to 1, a dot at each end
function cp_arc(x,x0,y0,x1,y1,lift,p,col,lw){if(p<=0)return;const cx=(x0+x1)/2,cy=Math.min(y0,y1)-lift,n=40,m=Math.max(2,Math.round(n*clamp(p,0,1))),
    pt=u=>[(1-u)*(1-u)*x0+2*(1-u)*u*cx+u*u*x1,(1-u)*(1-u)*y0+2*(1-u)*u*cy+u*u*y1];
  x.save();x.strokeStyle=rgba(col,0.9);x.lineWidth=lw||5;x.lineCap="round";x.beginPath();for(let i=0;i<=m;i++){const q=pt(i/n);i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]);}x.stroke();
  x.fillStyle=rgba(col,0.95);for(const [px,py,on] of [[x0,y0,1],[x1,y1,p>=1]])if(on){x.beginPath();x.arc(px,py,(lw||5)*1.4,0,TAU);x.fill();}x.restore();}
// the two reports' cards on Planning's glass and the registrar's: st.n (their numbers), st.u (in), st.tick, st.join (the gold line, and
// a halo along it as it's lit), st.sent (the stamp on the registrar's), st.q (a pencilled "?" between them, when they don't agree)
function cp_reports(x,st){const F=GV_FL,cy=F.top+250,x0=F.x(0)+F.w/2,x1=F.x(1)+F.w/2,n=st.n||["4,867 awards","4,867 awards"],u=st.u==null?1:st.u;
  cp_glassCard(x,0,u,["census report",n[0]]);cp_glassCard(x,1,u,["submission",n[1]]);
  if(st.tick)for(const i of [0,1])cp_tickBadge(x,F.x(i)+F.w-30,cy+4,24,st.tick,160+i);
  if(st.lit>0.01)withA(x,0.35*st.lit,()=>cp_arc(x,x0,cy-6,x1,cy-6,64,1,GV.gold,18));
  if(st.join)cp_arc(x,x0,cy-6,x1,cy-6,64,st.join,GV.gold,5);
  if(st.sent)gv_stamp(x,x1+112,cy+132,"sent",st.sent,{size:30,rot:-0.08});
  if(st.q)gv_qmark(x,F.x(1)-6,cy+40,70,st.q);}

/* ---------- the deputy vice-chancellor's office ---------- */
// A corner room in the newer building, in winter: two windows onto the campus in snow, on the left; the wall planner for 2027 over the
// desk; David's desk, which is drawn over him (cp_dvcDesk), so he sits behind it; the door, open, on the right, the corridor beyond it.
// CP_DV: the floor's line; the windows; the planner; the desk (left, top, width); where David sits; the door (left, right, its top)
const CP_DV={fy:872,win:[[60,150,250,440],[340,150,250,440]],plan:[640,96,1040,330],desk:[760,700,680],seat:1100,door:[1712,1880,330],s:0.8,wall:[226,228,216]};
// a window onto the campus in snow: a white sky, the old building's clock tower among bare trees, the lawns under snow; its frame
function cp_winterWindow(ctx,x,y,w,h,seed){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const hz=y+h*0.7,R=wc_rng(seed);
  const g=ctx.createLinearGradient(0,y,0,hz);g.addColorStop(0,"rgb(206,212,222)");g.addColorStop(1,"rgb(236,238,240)");ctx.fillStyle=g;ctx.fillRect(x,y,w,hz-y+4);
  const tx=x+w*0.62,th=h*0.42;wc_part(ctx,wc_rect(tx-22,hz-th,44,th+12),[190,186,178],0.42);wc_part(ctx,[[tx-28,hz-th],[tx+28,hz-th],[tx,hz-th-h*0.13]],[150,156,168],0.42);
  wc_flat(ctx,[[tx-24,hz-th],[tx+24,hz-th],[tx,hz-th-h*0.1]],[246,247,248],0.6,"snow");wc_wash(ctx,wc_ell(tx,hz-th+28,10,10,20),[226,220,200],{depth:0.42,kind:"clock",lw:1.1});
  wc_part(ctx,wc_rect(x+w*0.06,hz-h*0.15,w*0.42,h*0.15+12),[196,190,180],0.36);wc_flat(ctx,wc_rect(x+w*0.06,hz-h*0.15-6,w*0.42,8),[246,247,248],0.6,"snow");
  wc_wash(ctx,[[x-10,hz],[x+w+10,hz-8],[x+w+10,y+h+10],[x-10,y+h+10]],[244,246,248],{kind:"ground",line:false,depth:0.5,seed:seed+3});
  ctx.save();ctx.strokeStyle="rgba(150,166,190,0.35)";ctx.lineWidth=2;for(let i=0;i<4;i++){const yy=hz+18+i*22;ctx.beginPath();ctx.moveTo(x,yy+6);ctx.quadraticCurveTo(x+w/2,yy-4,x+w,yy+4);ctx.stroke();}ctx.restore();
  // bare trees: a trunk, and branches forking up
  const tree=(bx,by,s)=>{ctx.save();ctx.strokeStyle=rgba([96,80,70],0.85);ctx.lineCap="round";const br=(px,py,a,l,d)=>{if(d>4||l<4)return;const ex=px+Math.sin(a)*l,ey=py-Math.cos(a)*l;
      ctx.lineWidth=Math.max(0.8,(5-d)*s);ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(ex,ey);ctx.stroke();br(ex,ey,a-0.42+(R()-0.5)*0.2,l*0.72,d+1);br(ex,ey,a+0.38+(R()-0.5)*0.2,l*0.7,d+1);};
    br(bx,by,0,46*s,0);ctx.restore();};
  tree(x+w*0.18,hz+20,0.9);tree(x+w*0.88,hz+26,1.1);ctx.restore();
  const f=16;for(const r of [wc_rect(x-f,y-f,w+2*f,f),wc_rect(x-f,y-f,f,h+2*f),wc_rect(x+w,y-f,f,h+2*f),wc_rect(x+w/2-6,y,12,h),wc_rect(x,y+h*0.42-6,w,12)])wc_wash(ctx,r,WC_PAPER,{kind:"trim",lw:1.4});
  wc_wash(ctx,wc_rect(x-30,y+h,w+60,24),wc_dim(CP_DV.wall,0.1),{kind:"trim",lw:1.5});}
// snow falling past the windows, drawn every frame
function cp_snow(ctx,t){const R=wc_rng(611);ctx.save();ctx.fillStyle="rgba(255,255,255,0.9)";for(const [x,y,w,h] of CP_DV.win){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
    for(let i=0;i<34;i++){const sp=18+R()*26,fx=x+((R()*w+Math.sin(t*0.8+i)*10)%w),fy=y+((R()*h+t*sp)%h),r=1.2+R()*2.2;ctx.beginPath();ctx.arc(fx,fy,r,0,TAU);ctx.fill();}ctx.restore();}ctx.restore();}
// the wall planner for 2027: its name, the months in a row, the weeks in faint lines
function cp_paintPlanner(ctx){const [x,y,w,h]=CP_DV.plan,cw=(w-20)/12;wc_part(ctx,wc_rect(x-10,y-10,w+20,h+20),[96,98,104],1,{lw:1.2});wc_flat(ctx,wc_rect(x,y,w,h),[252,251,247],1,"board");
  ctx.save();ctx.strokeStyle="rgba(120,124,130,0.28)";ctx.lineWidth=1.4;for(let j=1;j<12;j++){const lx=x+10+j*cw;ctx.beginPath();ctx.moveTo(lx,y+60);ctx.lineTo(lx,y+h-10);ctx.stroke();}
  ctx.strokeStyle="rgba(120,124,130,0.14)";for(let r=0;r<5;r++){const ly=y+110+r*44;ctx.beginPath();ctx.moveTo(x+10,ly);ctx.lineTo(x+w-10,ly);ctx.stroke();}ctx.restore();
  wc_flat(ctx,wc_rect(x,y,w,52),[70,96,140],1,"head");}
// its words, drawn every frame so they stay sharp: the year, the months
function cp_plannerWords(ctx){const [x,y,w]=CP_DV.plan,cw=(w-20)/12;wc_T(ctx,"2027",x+20,y+38,{w:800,size:30,col:[255,255,255]});
  ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].forEach((m,j)=>wc_T(ctx,m,x+10+j*cw+cw/2,y+92,{w:700,size:28,align:"center",col:WC_INK}));}
// what's on it: the project's card across January to June (st.card, 0 to 1; st.off, unpinned and gone), with a small red flag at its
// end and its date beside it (st.flag); the new line, gold, from January across the whole year and on past the planner's edge (st.line)
function cp_planner(ctx,st){const [x,y,w,h]=CP_DV.plan,cw=(w-20)/12,x0=x+14,x1=x+10+6*cw-4,cy=y+150;cp_plannerWords(ctx);
  const c=st.card==null?1:st.card,off=st.off||0;if(c>0.01&&off<0.99){const e=easeCam(clamp(off,0,1));ctx.save();ctx.translate(0,-40*e);ctx.rotate(-0.04*e);
    withA(ctx,clamp(c*2,0,1)*(1-e),()=>{wc_panel(ctx,x0,cy-34,(x1-x0)*easeCam(clamp(c,0,1)),68,{kind:"card",wash:[96,118,150],washA:0.3,seed:613});
      gv_pin(ctx,x0+16,cy-22,GV.red,0.9);withA(ctx,clamp(c*3-1.5,0,1),()=>wc_T(ctx,"Governance project",(x0+x1)/2,cy+11,{w:800,size:30,align:"center",col:WC_DARK}));});ctx.restore();}
  const fl=st.flag||0;if(fl>0.01&&off<0.5)withA(ctx,clamp(fl*2,0,1)*(1-clamp(off*2,0,1)),()=>{const fx=x1+2,k=0.8+0.2*spring(clamp(fl,0,1));ctx.save();ctx.translate(fx,cy-36);ctx.scale(k,k);
    ctx.strokeStyle=rgba([70,60,54],1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,70);ctx.stroke();ctx.fillStyle=rgba(GV.red,1);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(34,10);ctx.lineTo(0,22);ctx.closePath();ctx.fill();ctx.restore();
    wc_tag(ctx,fx+46,cy+4,"ends 30 June",{size:28});});
  const ln=st.line||0;if(ln>0.01){const lx1=lerp(x0,W+60,easeCam(clamp(ln,0,1))),ly=y+h-70;ctx.save();ctx.beginPath();ctx.rect(x0-4,ly-34,lx1-x0+8,68);ctx.clip();
    wc_panel(ctx,x0,ly-30,W+40-x0,60,{kind:"card",wash:GV.gold,washA:0.55,seed:617});wc_T(ctx,"Data governance · every year",x0+24,ly+10,{w:800,size:30,col:GV.goldInk});ctx.restore();}}
function cp_paintDvc(ctx){const D=CP_DV,wall=D.wall;gv_wallFloor(ctx,wall,D.fy,{seed:621,vx:1100,floor:[176,150,124]});gv_lightGlow(ctx,1100,0,620);
  D.win.forEach((r,i)=>cp_winterWindow(ctx,r[0],r[1],r[2],r[3],623+i*5));cp_paintPlanner(ctx);
  // the door, open onto the corridor: its frame, the corridor's wall and floor beyond, the door itself swung back against the wall
  const [d0,d1,dt]=D.door;wc_wash(ctx,wc_rect(d0-16,dt-16,d1-d0+32,D.fy-dt+16),WC_PAPER,{kind:"trim",lw:1.5});wc_wash(ctx,wc_rect(d0,dt,d1-d0,D.fy-dt),[204,200,190],{kind:"plaster",line:false,seed:629});
  wc_wash(ctx,wc_rect(d0,D.fy-90,d1-d0,90),[160,150,138],{kind:"ground",line:false,seed:631});wc_part(ctx,[[d1-14,dt],[d1+40,dt-22],[d1+40,D.fy+20],[d1-14,D.fy]],[150,118,90],1,{seed:633});
  // a low cabinet under the windows, a lamp and a plant on it; a tall plant by the desk
  wc_part(ctx,wc_rect(70,690,520,180),wc_lit(GV.wood,0.05),1);for(const j of [0,1])wc_wash(ctx,wc_ell(320+(j?40:-40),780,6,6,12),GV.metal,{kind:"thing",lw:1});
  wc_part(ctx,[[150,690],[190,690],[184,600],[156,600]],[96,104,120],1);wc_part(ctx,[[124,604],[216,604],[196,548],[144,548]],[236,226,196],1);gv_plant(ctx,500,690,0.6);gv_plant(ctx,690,D.fy,0.95);}
// the desk, drawn over whoever sits behind it: its front, and what's on it (a lamp, a closed folder, a pot of pens, a phone)
function cp_dvcDesk(){return wc_kept("cpDvcDesk",W,H,q=>{const D=CP_DV,[x,y,w]=D.desk;gv_desk(q,x,y,w,D.fy+6,{});
  wc_part(q,wc_rect(x+40,y-18,170,18),[60,96,84],1);wc_flat(q,wc_rect(x+50,y-14,150,6),[226,214,170],1,"label");
  wc_part(q,[[x+w-80,y],[x+w-40,y],[x+w-44,y-58],[x+w-76,y-58]],[96,118,150],1);
  for(const [px,a,c] of [[-68,-0.2,[60,60,70]],[-58,0.1,[204,62,50]],[-50,0.25,[60,60,70]]]){q.save();q.translate(x+w+px,y-56);q.rotate(a);wc_flat(q,wc_rect(-2,-40,5,42),c,1,"pen");q.restore();}
  wc_part(q,[[x+260,y],[x+330,y],[x+322,y-22],[x+268,y-22]],[60,62,70],1);});}

/* ---------- papers on a desk, from above (the place desk) ---------- */
// a paper on the desk, seen from above, at (x, y), its size, tipped; drawn through fn in its own coordinates
function cp_onPaper(ctx,x,y,w,h,rot,fn,o){o=o||{};ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot||0);ctx.fillStyle="rgba(60,44,30,0.22)";ctx.fillRect(-w/2+10,-h/2+12,w,h);
  wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:o.seed||Math.round(x+y),wash:o.wash,washA:o.washA||0.2});ctx.translate(-w/2,-h/2);fn(ctx);ctx.restore();}
// the project's final report: its cover (navy, its name), then open at what the project did, each line ticked as it's read (st.tick(j)),
// and its last page, After June, with nothing on it. st.open (0 to 1) turns the cover back; st.slide moves it across the desk, away
const CP_DONE=["a register of owners","one glossary","a class for personal data","rules with owners","a scorecard","product cards","office hours"];
function cp_report(ctx,st){const o=st.open||0,sl=easeCam(clamp(st.slide||0,0,1)),X=380,Y=70,pw=560,ph=800;ctx.save();ctx.translate(0,-sl*900);ctx.rotate(-0.02*sl);
  if(o>0.01){// the pages open: on the left, what the project did; on the right, its last month
    cp_onPaper(ctx,X,Y,pw,ph,0,q=>{wc_T(q,"What the project did",44,96,{w:800,size:36,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.5);q.fillRect(44,116,pw-88,3);
      CP_DONE.forEach((s,j)=>{const yy=196+j*80;q.strokeStyle=rgba(WC_PENCIL,0.75);q.lineWidth=2.6;q.strokeRect(46,yy-30,36,36);wc_T(q,s,104,yy,{w:600,size:32,col:WC_INK});
        wc_tick(q,66,yy-14,46,GV.greenInk,st.tick?st.tick(j):1,5);});},{seed:641});
    cp_onPaper(ctx,X+pw+20,Y,pw,ph,0,q=>{wc_T(q,"After June",44,96,{w:800,size:40,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.5);q.fillRect(44,116,pw-88,3);
      q.strokeStyle="rgba(140,150,170,0.25)";q.lineWidth=1.5;for(let r=0;r<11;r++){const ly=196+r*52;q.beginPath();q.moveTo(44,ly);q.lineTo(pw-44,ly);q.stroke();}},{seed:643});
    // the spine between them
    ctx.fillStyle=rgba([60,64,74],1);for(let i=0;i<14;i++)ctx.fillRect(X+pw+4,Y+30+i*56,12,26);}
  if(o<0.99){// the cover, turning back over the spine
    const c=Math.cos(Math.PI*clamp(o,0,1)),k=Math.max(0.02,Math.abs(c));if(c>0){ctx.save();ctx.translate(X+pw+20,0);ctx.scale(k,1);ctx.translate(-(X+pw+20),0);
      cp_onPaper(ctx,X+pw+20,Y,pw,ph,0,q=>{wc_T(q,"Governance project",pw/2,300,{w:800,size:46,align:"center",col:[250,248,240]});wc_T(q,"final report",pw/2,362,{w:600,size:34,align:"center",col:[226,226,232]});
        q.strokeStyle="rgba(250,248,240,0.6)";q.lineWidth=3;q.strokeRect(40,40,pw-80,ph-80);},{seed:645,wash:[46,64,104],washA:0.95});ctx.restore();}}
  ctx.restore();}
// the budget, open: on the left its name and lines of sums, on the right more lines, and (st.write, 0 to 1) a new one in pen
function cp_budget(ctx,st){const X=360,Y=80,pw=580,ph=780;
  cp_onPaper(ctx,X,Y,pw,ph,-0.01,q=>{wc_T(q,"Budget 2027",44,100,{w:800,size:44,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.5);q.fillRect(44,124,pw-88,3);
    cp_lines2(q,44,190,pw-88,12,48);},{seed:651});
  cp_onPaper(ctx,X+pw+16,Y,pw,ph,0.008,q=>{cp_lines2(q,44,110,pw-88,9,48);
    const p=st.write||0;if(p>0.01){wc_hand(q,"Data governance",44,580,{size:44,w:700,col:[30,50,110],p:clamp(p*1.6,0,1)});wc_hand(q,"every year",44,640,{size:44,w:700,col:[30,50,110],p:clamp(p*1.6-0.6,0,1)});}},{seed:653});}
// lines of sums no one needs to read: a grey bar for the item, a shorter one at the right for its sum
function cp_lines2(q,x,y,w,n,gap){q.save();q.fillStyle=rgba(WC_MUTED,0.34);for(let i=0;i<n;i++){const l=w*(0.42+0.22*Math.abs(Math.sin(i*2.7)));q.fillRect(x,y+i*gap,l,6);q.fillRect(x+w-90,y+i*gap,90,6);}q.restore();}
// the page Yusuf lays on David's desk: what people can ask data governance for, each with its promise in a line, and what it costs to
// keep them, three lines lit one after another (st.keep(j), 0 to 1)
const CP_PAGE=[["What does this number mean?","an answer in 2 working days"],["Define or change a term","decided in 10 working days"],["Let me see this data","in 5 working days, until a date"],
  ["Can I trust this product?","on its page by 7 a.m."],["Fix it where it starts","to the source's owner by Monday"],["What will this change touch?","answered before it goes in"],["Help me do it right","office hours every Thursday"]];
const CP_KEEP=["owners' and stewards' hours","the governance team","the tools they use"];
function cp_servicePage(ctx,st){cp_onPaper(ctx,330,40,1260,860,-0.006,q=>{wc_T(q,"What you can ask data governance for",60,96,{w:800,size:40,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.5);q.fillRect(60,118,1140,3);
    CP_PAGE.forEach(([s,p],j)=>{const yy=180+j*56;wc_T(q,s,60,yy,{w:700,size:30,col:WC_DARK});wc_T(q,p,690,yy,{w:600,size:30,col:WC_INK});});
    wc_T(q,"to keep them",60,616,{w:800,size:32,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.4);q.fillRect(60,634,400,2);
    CP_KEEP.forEach((s,j)=>{const a=st.keep?st.keep(j):0,yy=690+j*52;if(a>0.01)withA(q,a,()=>{q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(GV.gold,0.45),0.9);q.fillRect(54,yy-34,tw(q,s,30,600)+20,44);q.restore();});
      wc_T(q,s,64,yy,{w:600,size:30,col:a>0.5?GV.goldInk:WC_MUTED});});},{seed:661});}

/* ---------- Noor's map: the strategy band drawn large ---------- */
// The map's strategy band filling the frame: govern data on its left, in gold; two rows of four places for what governance must be
// able to do; under each, room for its note. A strip of the motivation band shows above it, the business band below. CP_BD: the band's
// top and bottom; govern data's card; the places' left edges, width, the rows' tops, a card's height, the note's
const CP_BD={top:64,bot:848,gov:[56,372,300,190],cols:[408,782,1156,1530],cw:350,rows:[132,470],ch:150,nh:150};
const CP_CAPS=[["Define what","words mean"],["Decide who","owns what"],["Protect who","sees what"],["Keep data","fit for use"],["Change without","surprises"],["Provide data","products"],["Help people","take part"],["Keep records","only as long as","they're needed"]];
// the evidence for each, and how it's coloured: 0 green, 1 amber, 2 red
const CP_NOTE=[["every copy is checked","against the glossary","each night"],["a change with no","owner comes back"],["who may read each","table is reviewed","by hand"],["each night's checks","reach their owners"],
  ["who uses what is","written by hand"],["every shared table is","in a product, with","an owner"],["who comes to office","hours, and who","comes back"],["learner records: kept","for seven years","nothing checks it"]];
const CP_STATE=[0,0,1,0,1,0,0,2],CP_HEAT=()=>[GV.green,GV.amber,GV.red],CP_HEATINK=()=>[GV.greenInk,GV.amberInk,GV.redInk];
const cp_capXY=j=>[CP_BD.cols[j%4],CP_BD.rows[Math.floor(j/4)]];
function cp_paintBand(ctx){const B=CP_BD,[,col]=GV_LAYERS[1];ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_flat(ctx,wc_rect(-20,-20,W+40,H+40),[250,250,247],1,"board");
  wc_wash(ctx,wc_rect(-20,-40,W+40,B.top-16+40),wc_lit(GV_LAYERS[0][1],0.66),{kind:"swatch",seed:671,a:0.8});
  wc_wash(ctx,wc_rect(-20,B.top,W+40,B.bot-B.top),wc_lit(col,0.66),{kind:"swatch",seed:673,a:0.8});
  wc_wash(ctx,wc_rect(-20,B.bot+16,W+40,H-B.bot),wc_lit(GV_LAYERS[2][1],0.66),{kind:"swatch",seed:675,a:0.8});
  // the places still free: faint pencil boxes
  ctx.save();ctx.strokeStyle=rgba(wc_dim(col,0.5),0.35);ctx.setLineDash([10,8]);ctx.lineWidth=2;for(let j=0;j<8;j++){const [x,y]=cp_capXY(j);ctx.strokeRect(x,y,B.cw,B.ch);}ctx.restore();}
// the band's words and cards, drawn every frame. st: gov (govern data, 0 to 1), glow (its gold light), cap(j) (each card up, 0 to 1),
// tok(j) (the token from the film that put it in place), wash(j) (its colour, 0 to 1), note(j) (its note), key (the key, 0 to 1),
// ring(j) (a gold ring drawn round it), first (the small card on the red one's corner), lit(j) (a gold edge)
function cp_band(ctx,st){const B=CP_BD,[,col]=GV_LAYERS[1],f=(fn,j)=>fn?fn(j):0;wc_hand(ctx,"Strategy",B.gov[0]+6,B.top+62,{size:44,w:700,col:wc_dim(col,0.66)});
  const g=st.gov==null?1:st.gov;if(g>0.01){const [x,y,w,h]=B.gov,gl=st.glow||0;if(gl>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+w/2,y+h/2,w*0.9,[255,214,120],0.55*gl);ctx.restore();}
    withA(ctx,clamp(g*2,0,1),()=>{wc_panel(ctx,x,y,w,h,{kind:"card",wash:GV.gold,washA:0.6,seed:677});gv_pin(ctx,x+w/2,y+14,wc_dim(GV.gold,0.3),1);
      wc_T(ctx,"Govern",x+w/2,y+86,{w:800,size:44,align:"center",col:GV.goldInk});wc_T(ctx,"data",x+w/2,y+140,{w:800,size:44,align:"center",col:GV.goldInk});});}
  if(st.key>0.01)cp_heatKey(ctx,st.key);
  for(let j=0;j<8;j++){const u=f(st.cap,j);if(u<=0.01)continue;const [x,y]=cp_capXY(j),k=0.9+0.1*spring(clamp(u,0,1)),wa=f(st.wash,j),s=CP_STATE[j],L=CP_CAPS[j],rot=[-0.008,0.01,-0.006,0.008,0.006,-0.01,0.008,-0.006][j];
    const rg=f(st.ring,j);if(rg>0.01){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=s===2?9:4;ctx.lineCap="round";const r=easeCam(clamp(rg,0,1));ctx.beginPath();
      ctx.ellipse(x+B.cw/2,y+B.ch/2+(f(st.note,j)>0.01?B.nh/2:0),B.cw*0.62,(B.ch+(f(st.note,j)>0.01?B.nh:0))*0.66,0,-Math.PI/2,-Math.PI/2+TAU*r);ctx.stroke();ctx.restore();}
    ctx.save();ctx.translate(x+B.cw/2,y+B.ch/2);ctx.scale(k,k);ctx.rotate(rot);withA(ctx,clamp(u*2.5,0,1),()=>{
      wc_panel(ctx,-B.cw/2,-B.ch/2,B.cw,B.ch,{kind:"card",wash:wa>0.01?CP_HEAT()[s]:null,washA:0.5*wa,seed:681+j});gv_pin(ctx,0,-B.ch/2+13,GV.red,0.9);
      const lit=f(st.lit,j);if(lit>0.01){ctx.strokeStyle=rgba(GV.gold,0.95*lit);ctx.lineWidth=6;ctx.strokeRect(-B.cw/2-6,-B.ch/2-6,B.cw+12,B.ch+12);}
      L.forEach((l,i)=>wc_T(ctx,l,0,-B.ch/2+(L.length>2?48:62)+i*36,{w:800,size:30,align:"center",col:WC_DARK}));
      const tk=f(st.tok,j);if(tk>0.01)cp_token(ctx,j,B.cw/2-34,-B.ch/2+20,tk);});ctx.restore();
    const n=f(st.note,j);if(n>0.01){const N=CP_NOTE[j],ny=y+B.ch+14,e=easeCam(clamp(n,0,1));ctx.save();ctx.translate(x+B.cw/2,ny);ctx.rotate(-rot*1.4);ctx.translate(0,-14*(1-e));
      withA(ctx,clamp(n*2.5,0,1),()=>{const nw=B.cw-24,nh=26+N.length*34;wc_panel(ctx,-nw/2,0,nw,nh,{kind:"card",wash:CP_HEAT()[s],washA:0.18,seed:691+j});
        N.forEach((l,i)=>wc_T(ctx,l,0,36+i*34,{w:600,size:28,align:"center",col:WC_INK}));});ctx.restore();}}
  const fs=st.first||0;if(fs>0.01){const [x,y]=cp_capXY(7),k=0.85+0.15*spring(clamp(fs,0,1));ctx.save();ctx.translate(x+B.cw-96,y-20);ctx.scale(k,k);ctx.rotate(0.06);
    withA(ctx,clamp(fs*2.5,0,1),()=>{wc_panel(ctx,-84,-30,168,62,{kind:"card",wash:GV.gold,washA:0.5,seed:699});gv_pin(ctx,0,-22,GV.red,0.8);wc_T(ctx,"2027 · first",0,14,{w:800,size:28,align:"center",col:GV.goldInk});});ctx.restore();}}
// the band's blocks of words, for cp_fadeCut: govern data's, and each card's and each note's
function cp_bandBlocks(ctx){const B=CP_BD,[gx,gy,gw]=B.gov,out=[cp_block(ctx,["Govern","data"],gx+gw/2,gy+86,54,44,800)];
  for(let j=0;j<8;j++){const [x,y]=cp_capXY(j),L=CP_CAPS[j];out.push(cp_block(ctx,L,x+B.cw/2,y+(L.length>2?48:62),36,30,800),cp_block(ctx,CP_NOTE[j],x+B.cw/2,y+B.ch+50,34,28,600));}
  return out;}
// the key at the band's top: three swatches and what each means
function cp_heatKey(ctx,a){const L=[["green · it runs in the work",0],["amber · people still have to remember",1],["red · nothing happens yet",2]];let x=430;
  withA(ctx,clamp(a,0,1),()=>L.forEach(([s,i])=>{wc_wash(ctx,wc_rect(x,84,34,30),CP_HEAT()[i],{kind:"swatch",seed:701+i,a:0.85});wc_T(ctx,s,x+46,110,{w:600,size:28,col:CP_HEATINK()[i]});x+=46+tw(ctx,s,28,600)+44;}));}
// a small painted token on a card's corner, from the film that put the capability in place: the glossary's card, the register, a plum
// label, the plain scorecard, an impact note, a product card, the office hours card. They're pictures: their words are decoration
function cp_token(ctx,j,x,y,u){const k=0.7+0.3*spring(clamp(u,0,1));ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.rotate([0.1,-0.08,0.12,-0.06,0.08,-0.1,0.06][j]||0);
  withA(ctx,clamp(u*2.5,0,1),()=>{ctx.fillStyle="rgba(60,50,40,0.22)";ctx.fillRect(-26,-18,58,44);
    const card=(c,a)=>{ctx.fillStyle=rgba(c,1);ctx.fillRect(-30,-22,58,44);ctx.strokeStyle=rgba(wc_dim(c,0.4),0.7);ctx.lineWidth=1.4;ctx.strokeRect(-30,-22,58,44);};
    PH_OFF++;try{
    if(j===0){card([252,248,236]);wc_T(ctx,"award",-1,-2,{w:800,size:13,align:"center",col:WC_DARK});ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(-22,6,40,3);ctx.fillRect(-22,12,30,3);}
    if(j===1){card([236,226,206]);ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=1;for(let r=0;r<4;r++){ctx.beginPath();ctx.moveTo(-26,-12+r*9);ctx.lineTo(24,-12+r*9);ctx.stroke();}ctx.beginPath();ctx.moveTo(-8,-20);ctx.lineTo(-8,20);ctx.stroke();}
    if(j===2){card(GV_CLASS.direct);wc_T(ctx,"***",-1,8,{w:800,size:22,align:"center",col:[255,255,255]});}
    if(j===3){card([250,250,246]);for(let r=0;r<3;r++)for(let c=0;c<4;c++){ctx.fillStyle=rgba(r===2&&c===3?GV.amber:GV.green,0.75);ctx.fillRect(-24+c*12,-14+r*11,9,8);}}
    if(j===4){ctx.fillStyle=rgba([252,224,118],1);ctx.fillRect(-30,-22,52,48);ctx.strokeStyle=rgba([60,110,170],0.85);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-20,8);ctx.lineTo(10,-8);ctx.moveTo(2,-10);ctx.lineTo(10,-8);ctx.lineTo(6,0);ctx.stroke();}
    if(j===5){card([244,240,250]);ctx.fillStyle=rgba([110,92,190],0.8);ctx.fillRect(-22,-14,16,16);ctx.fillStyle=rgba(WC_MUTED,0.45);ctx.fillRect(-2,-12,24,3);ctx.fillRect(-2,-4,18,3);ctx.fillRect(-22,8,44,3);}
    if(j===6){card([255,250,236]);wc_T(ctx,"Office",-1,-3,{w:800,size:12,align:"center",col:WC_DARK});wc_T(ctx,"hours",-1,11,{w:800,size:12,align:"center",col:WC_DARK});}
    }finally{PH_OFF--;}
    if(j<7)gv_pin(ctx,-1,-18,GV.red,0.55);});ctx.restore();}

/* ---------- Noor's map: the business band, the services ---------- */
// The strategy band on top, smaller: govern data, then the eight capabilities in a row, coloured; the business band under it, drawn
// large, with the seven services people can ask for in a row, each joined by a dotted line to the capability it serves. CP_SV: the
// bands' tops and bottoms; govern data's card; where the capabilities start, their width, step, top, height; the services' left edge,
// width, step, top, height
const CP_SV={sTop:16,sBot:330,bTop:346,bBot:900,gov:[26,96,176,150],cx0:222,cw:200,cs:208,cy:84,ch:170,sx0:40,sw:248,ss:264,sy:478,sh:236};
const CP_SERV=[[["What does this","number mean?"],0,["an answer within","2 working days"]],[["Define or","change a term"],0,["decided within","10 working days,","with what it","touches"]],
  [["Let me see","this data"],2,["within 5 working","days, for a","purpose, until","a date"]],[["Can I trust","this product?"],5,["its promise and","last night's","checks, on its","page by 7 a.m."]],
  [["Fix it where","it starts"],3,["to the owner of","its source by","the next Monday"]],[["What will this","change touch?"],4,["answered before","the change","goes in"]],
  [["Help me do","it right"],6,["office hours on","Thursdays,","2 to 3 pm, and a","guide beside","every check"]]];
const CP_CAPS1=[["Define","what words","mean"],["Decide","who owns","what"],["Protect","who sees","what"],["Keep data","fit for use"],["Change","without","surprises"],["Provide","data","products"],["Help","people","take part"],["Keep records","only as long","as needed"]];
function cp_paintServices(ctx){const V=CP_SV;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_flat(ctx,wc_rect(-20,-20,W+40,H+40),[250,250,247],1,"board");
  wc_wash(ctx,wc_rect(-20,V.sTop,W+40,V.sBot-V.sTop),wc_lit(GV_LAYERS[1][1],0.66),{kind:"swatch",seed:711,a:0.8});
  wc_wash(ctx,wc_rect(-20,V.bTop,W+40,V.bBot-V.bTop),wc_lit(GV_LAYERS[2][1],0.66),{kind:"swatch",seed:713,a:0.8});
  wc_wash(ctx,wc_rect(-20,V.bBot+16,W+40,H-V.bBot),wc_lit(GV_LAYERS[3][1],0.66),{kind:"swatch",seed:715,a:0.8});}
const cp_capAt=j=>[CP_SV.cx0+j*CP_SV.cs,CP_SV.cy],cp_servAt=j=>[CP_SV.sx0+j*CP_SV.ss,CP_SV.sy];
// st: serv(j) (each card up), line(j) (its dotted line drawn), flip(j) (turned over to its promise), lit(j) (a promise lit gold),
// gold (a gold thread: from the budget's line to govern data, then along every dotted line, 0 to 1), budget (that line's card, pinned),
// rev(j) (written on its back: reviewed)
function cp_services(ctx,st){const V=CP_SV,f=(fn,j)=>fn?fn(j):0;wc_hand(ctx,"Business",36,V.bTop+50,{size:36,w:700,col:wc_dim(GV_LAYERS[2][1],0.62)});
  const [gx,gy,gw,gh]=V.gov;wc_panel(ctx,gx,gy,gw,gh,{kind:"card",wash:GV.gold,washA:0.6,seed:721});gv_pin(ctx,gx+gw/2,gy+13,wc_dim(GV.gold,0.3),0.9);
  wc_T(ctx,"Govern",gx+gw/2,gy+68,{w:800,size:34,align:"center",col:GV.goldInk});wc_T(ctx,"data",gx+gw/2,gy+110,{w:800,size:34,align:"center",col:GV.goldInk});
  for(let j=0;j<8;j++){const [x,y]=cp_capAt(j),s=CP_STATE[j],L=CP_CAPS1[j];wc_panel(ctx,x,y,V.cw,V.ch,{kind:"card",wash:CP_HEAT()[s],washA:0.5,seed:725+j});gv_pin(ctx,x+V.cw/2,y+12,GV.red,0.8);
    L.forEach((l,i)=>wc_T(ctx,l,x+V.cw/2,y+(L.length>2?52:70)+i*36,{w:800,size:28,align:"center",col:WC_DARK}));}
  // the dotted lines, from each service up to its capability; gold where the thread has run
  const gd=st.gold||0;CP_SERV.forEach(([,c],j)=>{const p=f(st.line,j);if(p<=0.01)return;const [sx,sy]=cp_servAt(j),[cx,cy]=cp_capAt(c),a=[sx+V.sw/2,sy+6],b=[cx+V.cw/2+(j%2?14:-14),cy+V.ch-4];
    const pt=u=>{const m=[a[0],lerp(a[1],b[1],0.5)],n=[b[0],lerp(a[1],b[1],0.5)];const v=1-u;return[v*v*v*a[0]+3*v*v*u*m[0]+3*v*u*u*n[0]+u*u*u*b[0],v*v*v*a[1]+3*v*v*u*m[1]+3*v*u*u*n[1]+u*u*u*b[1]];};
    ctx.save();ctx.lineCap="round";ctx.setLineDash([3,11]);ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=4;ctx.beginPath();const m=Math.round(40*clamp(p,0,1));for(let i=0;i<=m;i++){const q=pt(i/40);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();
    const e=clamp(gd*2-1-j*0.04,0,1);if(e>0.01){ctx.setLineDash([]);ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=5;ctx.beginPath();for(let i=0;i<=40;i++){const q=pt(1-i/40*e);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();}ctx.restore();});
  // the thread from the budget's line to govern data, and on along the band to every capability
  const b=st.budget||0;if(b>0.01){const k=0.85+0.15*spring(clamp(b,0,1));ctx.save();ctx.translate(gx+180,26);ctx.scale(k,k);withA(ctx,clamp(b*2.5,0,1),()=>{wc_panel(ctx,-4,-2,430,52,{kind:"card",wash:GV.gold,washA:0.55,seed:731});
    wc_T(ctx,"Data governance · every year",18,36,{w:800,size:28,col:GV.goldInk});});ctx.restore();}
  // (it runs under the capabilities' cards, not through their words: down from govern data, then along the band below the cards)
  if(gd>0.01){const e=clamp(gd*2,0,1),by=V.cy+V.ch+22,gc=gx+gw/2,x1=cp_capAt(7)[0]+V.cw-20,l1=by-gy-gh,l2=x1-gc;ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.beginPath();ctx.moveTo(gx+200,50);ctx.lineTo(lerp(gx+200,gc,clamp(e*3,0,1)),lerp(50,gy,clamp(e*3,0,1)));
    if(e>0.34){const d=clamp((e-0.34)/0.66,0,1)*(l1+l2);ctx.moveTo(gc,gy+gh);ctx.lineTo(gc,gy+gh+Math.min(d,l1));if(d>l1)ctx.lineTo(gc+d-l1,by);}ctx.stroke();ctx.restore();}
  for(let j=0;j<7;j++){const u=f(st.serv,j);if(u<=0.01)continue;const [x,y]=cp_servAt(j),[L,,Pm]=CP_SERV[j],fl=f(st.flip,j),c=Math.cos(Math.PI*clamp(fl,0,1)),back=fl>0.5,
      k=0.9+0.1*spring(clamp(u,0,1)),lt=f(st.lit,j),rot=[0.01,-0.008,0.006,-0.01,0.008,-0.006,0.01][j];
    ctx.save();ctx.translate(x+V.sw/2,y+V.sh/2);ctx.rotate(rot);ctx.scale(k*Math.max(0.03,Math.abs(c)),k);withA(ctx,clamp(u*2.5,0,1),()=>{
      if(lt>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,0,0,V.sw*0.9,[255,214,120],0.55*lt);ctx.restore();}
      wc_panel(ctx,-V.sw/2,-V.sh/2,V.sw,V.sh,{kind:"card",wash:back?(lt>0.01?GV.gold:[236,232,220]):null,washA:back?0.3+0.3*lt:0.3,seed:741+j+(back?20:0)});gv_pin(ctx,0,-V.sh/2+12,back?GV.gold:GV.red,0.85);
      // the service's sign: a rounded box, as the map draws a service
      // (while it turns, its words are only seen in passing: the legibility check leaves them out)
      const turning=Math.abs(c)<0.97;if(turning)PH_OFF++;try{
      if(!back){ctx.strokeStyle=rgba(wc_dim(GV_LAYERS[2][1],0.5),0.8);ctx.lineWidth=3;rr(ctx,V.sw/2-58,-V.sh/2+16,42,24,12);ctx.stroke();
        L.forEach((l,i)=>wc_T(ctx,l,0,-V.sh/2+86+i*38,{w:800,size:30,align:"center",col:WC_DARK}));}
      else{Pm.forEach((l,i)=>wc_T(ctx,l,0,(i-(Pm.length-1)/2)*36+10,{w:600,size:28,align:"center",col:lt>0.5?GV.goldInk:WC_INK}));
        const rv=f(st.rev,j);if(rv>0.01)wc_hand(ctx,"reviewed",0,V.sh/2-22,{size:34,w:700,align:"center",col:[30,50,110],p:rv});}}finally{if(turning)PH_OFF--;}});ctx.restore();}}

// the business band's blocks of words, for cp_fadeCut: govern data's, each capability's, and each service's, both its sides
function cp_servBlocks(ctx){const V=CP_SV,[gx,gy,gw]=V.gov,out=[cp_block(ctx,["Govern","data"],gx+gw/2,gy+68,42,34,800)];
  for(let j=0;j<8;j++){const [x,y]=cp_capAt(j),L=CP_CAPS1[j];out.push(cp_block(ctx,L,x+V.cw/2,y+(L.length>2?52:70),36,28,800));}
  CP_SERV.forEach(([L,,Pm],j)=>{const [x,y]=cp_servAt(j),a=cp_block(ctx,L,x+V.sw/2,y+86,38,30,800),b=cp_block(ctx,Pm,x+V.sw/2,y+V.sh/2-(Pm.length-1)*18+10,36,28,600);
    out.push([Math.min(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[2],b[2]),Math.max(a[3],b[3])]);});
  return out;}

// what Clara and Anil look at when they ask. Planning's screen: a chart, and a number with nothing to say what it counts, ringed in
// pencil (p). The faculty's screen: a product's page, locked (p brings the lock in)
function cp_planScreen(ctx,p){const [sx,sy,sw,sh]=GV_PL.screen,bars=[0.5,0.64,0.58,0.76,0.7,0.87],by=sy+sh-62;
  bars.forEach((v,i)=>{const bx=sx+360+i*52;ctx.fillStyle=rgba(i===5?[110,140,196]:[180,192,214],0.95);ctx.fillRect(bx,by-v*250,38,v*250);});
  ctx.strokeStyle=rgba(WC_PENCIL,0.55);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx+344,by+1);ctx.lineTo(sx+sw-30,by+1);ctx.stroke();
  wc_T(ctx,"87%",sx+180,sy+sh/2+30,{w:800,size:96,align:"center",col:WC_DARK});wc_ring(ctx,sx+180,sy+sh/2-2,140,80,p,{col:[196,64,44],lw:5});}
function cp_lockScreen(ctx,p){const [sx,sy,sw,sh]=GV_FX.screen,cx=sx+sw/2;
  wc_T(ctx,"Learner records",cx,sy+78,{w:800,size:40,align:"center",col:WC_DARK});
  ctx.fillStyle=rgba([206,212,224],0.9);for(let r=0;r<3;r++)ctx.fillRect(sx+70,sy+112+r*26,sw-140,12);
  const k=0.85+0.15*spring(clamp(p,0,1));ctx.save();ctx.translate(cx,sy+246);ctx.scale(k,k);withA(ctx,clamp(p*2.5,0,1),()=>{
    ctx.lineWidth=11;ctx.strokeStyle=rgba([96,104,120],1);ctx.beginPath();ctx.arc(0,-24,26,Math.PI,0);ctx.lineTo(26,0);ctx.moveTo(-26,-24);ctx.lineTo(-26,0);ctx.stroke();
    ctx.fillStyle=rgba([196,150,60],1);rr(ctx,-42,-6,84,64,10);ctx.fill();ctx.fillStyle=rgba([90,64,24],1);ctx.beginPath();ctx.arc(0,20,8,0,TAU);ctx.fill();ctx.fillRect(-3,22,6,18);});ctx.restore();}

/* ---------- Noor's map, close (the place mapClose) ---------- */
// Yusuf's three cards: pinned in the strategy band's free part as each is named (st.pin(j)); lit (st.lit(j)); tipped on their pins as
// they fail (st.tip(j)); and moved down the map, each to its band, with a tag for what it is there (st.down(j)). A blank card, with a
// pencilled "?", where govern data goes (st.q); the three tests, chips under the strategy band (st.chip(j), st.chipLit(j)); govern data
// (st.gov), lit gold (st.glow), underlined (st.under). CP_M3: each card's words, where it's pinned, where it goes, its tag
const CP_M3=[[["governance","team"],[1100,232],[1100,366],"who does it",2],[["glossary"],[1310,232],[1100,640],"an application",4],[["stewards'","meeting"],[1520,232],[1420,366],"how it's done",2]];
const CP_TESTS=["a restructure","a new system","a new process"];
function cp_map3(ctx,st){const [mx,my,mw,mh]=GV_MC,[bx,by,bw,bh]=gv_mapBand(mx,my,mw,mh,1),cw=bw*0.1,ch=bh*0.58,gx=bx+bw*0.17+2*(cw+bw*0.035),gy=by+(bh-ch)/2,f=(fn,j)=>fn?fn(j):0,w=190,h=96;
  // the "?" where govern data will go: a blank card over the place, its pencilled question
  const q=st.q||0;if(q>0.01&&(st.gov||0)<0.99)withA(ctx,clamp(q*2,0,1)*(1-(st.gov||0)),()=>{wc_panel(ctx,gx-6,gy-6,cw+12,ch+12,{kind:"card",seed:751});gv_pin(ctx,gx+cw/2,gy+4,GV.red,0.8);
    wc_hand(ctx,"?",gx+cw/2,gy+ch-4,{size:62,w:600,align:"center",col:WC_PENCIL,p:clamp(q*1.5,0,1)});});
  const gv=st.gov||0;if(gv>0.01){const k=1+0.06*Math.sin(Math.PI*clamp(gv,0,1)),gl=st.glow||0;ctx.save();ctx.translate(gx+cw/2,gy+ch/2);ctx.scale(k,k);
    if(gl>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,0,0,cw*1.2,[255,214,120],0.6*gl);ctx.restore();}
    withA(ctx,clamp(gv*2,0,1),()=>{wc_panel(ctx,-cw/2-10,-ch/2-10,cw+20,ch+20,{kind:"card",wash:GV.gold,washA:0.6,seed:753});gv_pin(ctx,0,-ch/2-2,wc_dim(GV.gold,0.3),0.8);
      wc_T(ctx,"Govern",0,-4,{w:800,size:28,align:"center",col:GV.goldInk});wc_T(ctx,"data",0,28,{w:800,size:28,align:"center",col:GV.goldInk});
      const un=st.under||0;if(un>0.01){ctx.strokeStyle=rgba([30,50,110],0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-cw/2+6,40);ctx.lineTo(-cw/2+6+(cw-12)*easeCam(clamp(un,0,1)),42);ctx.stroke();}});ctx.restore();}
  // the tests, under the strategy band
  const cws=CP_TESTS.map(s=>tw(ctx,s,28,700)+44),c0=1380-(cws[0]+cws[1]+cws[2]+32)/2;
  CP_TESTS.forEach((s,j)=>{const u=f(st.chip,j);if(u<=0.01)return;const l=f(st.chipLit,j),cw2=cws[j],x=c0+cws.slice(0,j).reduce((a,b)=>a+b+16,0),y=by+bh+26+(bh*0.5);
    const k=0.9+0.1*spring(clamp(u,0,1));ctx.save();ctx.translate(x+cw2/2,y);ctx.scale(k,k);withA(ctx,clamp(u*2.5,0,1),()=>{wc_panel(ctx,-cw2/2,-26,cw2,52,{kind:"pill",wash:l>0.01?GV.amber:null,washA:0.45*l,seed:761+j});
      wc_T(ctx,s,0,10,{w:700,size:28,align:"center",col:l>0.5?GV.amberInk:WC_INK});});ctx.restore();});
  // the three cards
  CP_M3.forEach(([L,[px,py],[dx,dy],tag],j)=>{const u=f(st.pin,j);if(u<=0.01)return;const tp=f(st.tip,j),dn=easeCam(clamp(f(st.down,j),0,1)),lt=f(st.lit,j),k=0.9+0.1*spring(clamp(u,0,1)),
      x=lerp(px,dx,dn),y=lerp(py,dy,dn),rot=[-0.012,0.01,-0.008][j]+0.36*tp*(1-dn);
    ctx.save();ctx.translate(x+w/2,y);ctx.scale(k,k);ctx.rotate(rot);withA(ctx,clamp(u*2.5,0,1),()=>{if(lt>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,0,h/2,w*0.9,[255,214,120],0.5*lt);ctx.restore();}
      wc_panel(ctx,-w/2,0,w,h,{kind:"card",seed:771+j});gv_pin(ctx,0,12,GV.red,0.85);L.forEach((l,i)=>wc_T(ctx,l,0,(L.length>1?50:62)+i*32,{w:800,size:28,align:"center",col:WC_DARK}));});ctx.restore();
    if(dn>0.6)withA(ctx,clamp((dn-0.6)/0.4,0,1),()=>wc_tag(ctx,x+w/2,y+h+30,tag,{align:"center",size:28}));});}

// the same three cards on the map in Noor's room, where it's drawn smaller: their words are too small to read there, on purpose
function cp_roomCards(x,st){const N=GV_NR.board,[mx,my,mw,mh]=GV_MC;x.save();x.translate(N[0],N[1]);x.scale(N[2]/mw,N[3]/mh);x.translate(-mx,-my);PH_OFF++;try{cp_map3(x,st);}finally{PH_OFF--;}x.restore();}

/* ---------- Yusuf's board, close: the binder's last count (the place boardGov) ---------- */
// The board as Governance principles left it: the cards along its top (the stewards, a page beside every check, the checks), and under
// them the binder's 215 lines in a bar of three colours, each part with its number and what it is
const CP_GB={w:1500,h:820,px:[190,550,910],cw:322,rowB:[300,112],bar:[30,560,1440,64]};
const CP_BTEXT=[["the stewards"],["a page beside","every check"],["the checks"]];
const CP_BAR=[[92,GV.green,GV.greenInk,"92 · run in the work"],[64,GV.gold,GV.goldInk,"64 · decisions someone owns"],[59,GV.grey,GV.greyInk,"59 · gone"]];
function cp_board(x,st){const [bx,by,bw,bh]=GV_BC,k=bw/CP_GB.w,G=CP_GB;x.save();x.translate(bx,by+(bh-G.h*k)/2);x.scale(k,k);
  for(let i=0;i<3;i++){const cx=G.px[i],u=st.cards==null?1:st.cards;if(u<=0.01)continue;x.save();x.translate(cx,G.rowB[0]+G.rowB[1]/2);x.rotate([-0.012,0.01,-0.008][i]);
    withA(x,u,()=>{wc_panel(x,-G.cw/2,-G.rowB[1]/2,G.cw,G.rowB[1],{kind:"card",seed:781+i});gv_pin(x,0,-G.rowB[1]/2+13,[GV.red,GV.gold,GV.green][i],1);
      CP_BTEXT[i].forEach((l,j)=>wc_T(x,l,0,-G.rowB[1]/2+(CP_BTEXT[i].length>1?56:70)+j*36,{w:700,size:32,align:"center",col:WC_DARK}));});x.restore();}
  const [X,Y,w,h]=G.bar,a=st.bar==null?1:st.bar;if(a>0.01)withA(x,a,()=>{let x0=X;wc_hand(x,"215 lines",X+w,Y-18,{size:44,w:600,col:WC_INK,align:"right"});
    CP_BAR.forEach(([n,col,ink,s],j)=>{const bw2=w*n/215,p=st.fill?st.fill(j):1;if(p>0.01){const c=wc_kept("cpBar"+j+"|"+Math.round(bw2),Math.round(bw2)+24,h+24,q=>wc_wash(q,wc_resample(wc_rect(8,8,bw2+4,h+4),10),col,{kind:"swatch",line:false,a:0.8,seed:60+j}));
      x.save();x.beginPath();x.rect(x0-6,Y-12,(bw2+14)*easeCam(clamp(p,0,1)),h+28);x.clip();x.drawImage(c,x0-10,Y-10);x.restore();
      withA(x,clamp(p*3-1.2,0,1),()=>wc_T(x,s,x0+16,Y+h/2+10,{w:700,size:28,col:ink}));}x0+=bw2;});});
  x.restore();}

/* ---------- the stewards' meeting room ---------- */
// The stewards at the table, their names on cards in front of them; the screen, "Stewards, December"; Yusuf at the table's end. What's
// on the table (o.cards) is drawn over the table's top; o.pose(j), each steward's options
const CP_STEW=[["mei","Mei","registrar's office"],["leila","Leila","admissions"],["tom","Tom","short courses"],["clara","Clara","Planning"],["anil","Anil","Faculty of Health"]];
function cp_tent(x,X,name,role){const w=200,h=54,y0=GV_MT.top+38-h;x.fillStyle="rgba(70,60,50,0.18)";x.fillRect(X-w/2+5,y0+5,w,h);wc_panel(x,X-w/2,y0,w,h,{kind:"card",seed:Math.round(X)});
  wc_T(x,name,X,y0+24,{w:800,size:22,align:"center",col:WC_DARK});wc_T(x,role,X,y0+46,{w:600,size:19,align:"center",col:WC_MUTED});}
function cp_meeting(x,tt,o){o=o||{};const M=GV_MT,[sx,sy,sw,sh]=M.screen;gv_screen(x,sx,sy,sw,sh,"Stewards, December",o.body||(q=>wc_T(q,"Stewards, December",sx+sw/2,sy+sh/2+30,{w:800,size:40,align:"center",col:WC_DARK})),{titleSize:30,barH:44});
  person(x,"yusuf",o.yx||200,905,M.s,Object.assign({pose:"stand",t:tt},o.yusuf||{}));
  CP_STEW.forEach(([id],j)=>gv_behind(x,id,M.seats[j],M.top,M.s,Object.assign({pose:"listen",t:tt,flip:j>=3},o.pose?o.pose(j):{})));
  x.drawImage(gv_place("meetingTable"),0,0,W,H);PH_OFF++;try{CP_STEW.forEach(([,n,r],j)=>cp_tent(x,M.seats[j],n,r));}finally{PH_OFF--;}if(o.cards)o.cards(x);}

/* ---------- small things held ---------- */
// a bound report, held in one hand at the side, its navy cover towards us
function cp_heldReport(cx,P_,hands){const h=hands[1];cx.save();cx.translate(h[0]+6,h[1]-40);cx.rotate(0.08);cx.fillStyle="rgba(40,30,20,0.25)";cx.fillRect(-46,-60,104,140);
  cx.fillStyle=rgba([46,64,104],1);cx.fillRect(-52,-66,104,140);cx.strokeStyle="rgba(250,248,240,0.6)";cx.lineWidth=3;cx.strokeRect(-42,-56,84,120);cx.fillStyle="rgba(250,248,240,0.75)";cx.fillRect(-30,-30,60,6);cx.fillRect(-24,-16,48,5);cx.restore();fingers(cx,P_,[h]);}
// a sheet held up in both hands, its face towards us: what fn draws on it, in a sheet of 300 x 400
function cp_heldSheet(fn){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-180);cx.fillStyle="rgba(40,30,20,0.2)";cx.fillRect(-142,-196,300,400);
  cx.fillStyle="#fffdf6";cx.fillRect(-150,-204,300,400);cx.strokeStyle=rgba(WC_PENCIL,0.4);cx.lineWidth=2;cx.strokeRect(-150,-204,300,400);cx.translate(-150,-204);fn(cx);cx.restore();fingers(cx,P_,[l,r]);};}
POSE.cp_knock={L:[0.12,-0.06],R:[-0.62,2.5],feet:24,shift:2,tilt:0,turn:0.25,gaze:[-0.6,0],look:0};
// the same report in the other hand, while the right one knocks
const cp_heldReportL=(cx,P_,hands)=>cp_heldReport(cx,P_,[hands[1],hands[0]]);
// both hands spread open, held up over a desk: what does it do?
POSE.cp_spread={L:[0.75,2.0],R:[0.75,2.0],hand:"open",feet:28,shift:0,tilt:0.05,turn:0,gaze:[0,0],look:0};
// pointing up and across, at something on a wall screen beside her
POSE.cp_pointUp={L:[0.12,-0.06],R:[1.9,2.15],hand:"open",feet:34,shift:6,tilt:-0.04,turn:0.3,gaze:[0.6,-0.6],look:0};
// pointing up, at a screen above her
POSE.cp_pointHigh={L:[0.12,-0.06],R:[2.5,2.75],hand:"open",feet:34,shift:6,tilt:-0.04,turn:0.2,gaze:[0.3,-0.8],look:0};
// three cards fanned in the right hand, held up a little
function cp_heldCards(cx,P_,hands){const h=hands[1];cx.save();cx.translate(h[0]+4,h[1]-30);for(let i=0;i<3;i++){cx.save();cx.rotate((i-1)*0.22);cx.fillStyle="rgba(40,30,20,0.2)";cx.fillRect(-36,-78,76,104);
  cx.fillStyle="#fffdf6";cx.fillRect(-40,-82,76,104);cx.strokeStyle=rgba(WC_PENCIL,0.45);cx.lineWidth=2;cx.strokeRect(-40,-82,76,104);cx.fillStyle=rgba(GV.red,0.9);cx.beginPath();cx.arc(-2,-70,5,0,TAU);cx.fill();
  cx.fillStyle=rgba(WC_MUTED,0.45);cx.fillRect(-28,-44,52,6);cx.fillRect(-24,-30,44,6);cx.restore();}cx.restore();fingers(cx,P_,[h]);}
// a marker, its cap off, held up in the right hand
function cp_heldMarker(cx,P_,hands){const h=hands[1];cx.save();cx.translate(h[0],h[1]-10);cx.rotate(-0.35);cx.fillStyle=rgba([40,60,120],1);rr(cx,-7,-70,14,78,4);cx.fill();
  cx.fillStyle=rgba([230,230,236],1);cx.fillRect(-7,-30,14,10);cx.fillStyle=rgba([30,40,80],1);cx.beginPath();cx.moveTo(-5,-70);cx.lineTo(5,-70);cx.lineTo(0,-84);cx.closePath();cx.fill();cx.restore();fingers(cx,P_,[h]);}

/* ---------- more for the later chapters ---------- */
// the place and the time in the top corner, changing at the times given ([[t, words], ...]), the old one fading as the new comes in
function cp_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1)wc_year(ctx,56,72,mk[i-1][1],a*(1-u));wc_year(ctx,56,72,mk[i][1],a*u);}
// a card on room i's glass on the floor, centred at height cy (o.dx from the room's middle, o.w its width, o.headSize its first line's size)
function cp_glassAt(x,i,cy,u,lines,o){o=o||{};if(u<=0)return;const F=GV_FL,sz=30,h=82+(lines.length-1)*(sz+12),w=o.w||F.w-44,k=0.92+0.08*spring(clamp(u,0,1));x.save();x.translate(F.x(i)+F.w/2+(o.dx||0),cy);x.scale(k,k);
  withA(x,clamp(u*2,0,1),()=>gv_card(x,-w/2,-h/2,w,h,lines,{size:sz,headSize:o.headSize,align:"center",pin:true,pinCol:o.pin||GV.gold,y0:52,wash:o.wash||[40,96,150],washA:o.washA||0.14}));x.restore();}
// the glossary's card for award, at (cx, cy): the word, and what it means; o.fade (0 to 1) fades its words, as if nobody keeps it
const CP_AWARD=["a qualification the university","confers, for at least","6 credit points"];
function cp_glossCard(ctx,cx,cy,a,o){o=o||{};if(a<=0.01)return;const w=560,h=270,f=1-0.8*clamp(o.fade||0,0,1),k=0.92+0.08*spring(clamp(a,0,1));ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);ctx.rotate(o.rot||-0.012);
  withA(ctx,clamp(a*2,0,1),()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:801});gv_pin(ctx,0,-h/2+13,GV.gold,0.9);gv_tint(ctx,-w/2+18,-h/2+34,w-36,58,GV.gold,0.5*f);
    wc_T(ctx,"award",-w/2+36,-h/2+76,{w:800,size:40,col:GV.goldInk,a:f});wc_T(ctx,"glossary",w/2-36,-h/2+72,{w:600,size:28,align:"right",col:WC_MUTED,a:f});
    CP_AWARD.forEach((l,i)=>wc_T(ctx,l,-w/2+36,-h/2+140+i*40,{w:600,size:30,col:WC_INK,a:f}));});ctx.restore();}
// a nightly check's light, on a card at (cx, cy): its name, and its lamp, green, then amber, then red as c goes from 0 to 2
function cp_checkLamp(ctx,cx,cy,a,c){if(a<=0.01)return;const w=480,h=150,cols=[GV.green,GV.amber,GV.red],i=Math.min(1,Math.floor(c)),col=c>=2?GV.red:mix(cols[i],cols[i+1],clamp(c-i,0,1)),k=0.92+0.08*spring(clamp(a,0,1));
  ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);ctx.rotate(0.012);withA(ctx,clamp(a*2,0,1),()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:803});gv_pin(ctx,0,-h/2+13,GV.red,0.9);
    wc_T(ctx,"the nightly check",-w/2+34,-8,{w:800,size:32,col:WC_DARK});wc_T(ctx,"census copies",-w/2+34,34,{w:600,size:28,col:WC_MUTED});
    ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,w/2-80,0,90,col,0.5);ctx.restore();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(w/2-80,0,34,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(255,255,255,0.45)";ctx.beginPath();ctx.ellipse(w/2-90,-12,12,8,-0.5,0,TAU);ctx.fill();});ctx.restore();}
// the wheel Yusuf drew in Governance principles, on a sheet: data governance at its centre, the ten other parts of data work round it.
// st.lit(k): each part's slice lit as the cards cover it; st.doc: the one that stays unlit, documents, glowing. CP_WH: the sheet (left,
// top, width, height), the wheel's centre on it, its rings, where the names go
const CP_WH={sheet:[230,110,730,750],c:[365,390],r0:92,r1:168,rl:188},CP_PARTS=["architecture","modelling","storage","security","integration","documents","master data","warehousing","metadata","quality"];
function cp_wheelSheet(ctx,st){const [sx,sy,sw,sh]=CP_WH.sheet,R=CP_WH;cp_onPaper(ctx,sx,sy,sw,sh,-0.012,q=>{const [x0,y0]=R.c,A=k=>-Math.PI/2+k*TAU/10;q.lineCap="round";
  const dg=st.doc||0;if(dg>0.01){const a0=A(5)-TAU/20+0.02,a1=A(5)+TAU/20-0.02;q.save();q.globalAlpha=dg;q.fillStyle=rgba(GV.red,0.28);q.beginPath();q.arc(x0,y0,R.r1+6,a0,a1);q.arc(x0,y0,R.r0-6,a1,a0,true);q.closePath();q.fill();
    q.strokeStyle=rgba(GV.red,0.9);q.lineWidth=5;q.stroke();q.restore();}
  CP_PARTS.forEach((nm,k)=>{const a0=A(k)-TAU/20+0.03,a1=A(k)+TAU/20-0.03,l=st.lit?st.lit(k):0;
    if(l>0.01&&k!==5){q.save();q.globalAlpha=0.6*l;q.fillStyle=rgba([250,224,140],1);q.beginPath();q.arc(x0,y0,R.r1,a0,a1);q.arc(x0,y0,R.r0,a1,a0,true);q.closePath();q.fill();q.restore();}
    q.strokeStyle=rgba([60,110,170],0.85);q.lineWidth=3.4;q.beginPath();q.arc(x0,y0,R.r1,a0,a1);q.stroke();q.beginPath();q.moveTo(x0+Math.cos(a0)*R.r0,y0+Math.sin(a0)*R.r0);q.lineTo(x0+Math.cos(a0)*R.r1,y0+Math.sin(a0)*R.r1);q.stroke();
    q.beginPath();q.arc(x0,y0,R.r0,a0,a1);q.stroke();const c=Math.cos(A(k)),s=Math.sin(A(k)),al=Math.abs(c)<0.3?"center":c>0?"left":"right";
    wc_hand(q,nm,x0+c*R.rl,y0+s*R.rl+(Math.abs(c)<0.3?(s<0?-8:26):10),{size:28,w:700,col:k===5&&dg>0.5?GV.redInk:WC_INK,align:al});});
  q.strokeStyle=rgba(GV.goldInk,0.9);q.lineWidth=4;q.beginPath();q.arc(x0,y0,R.r0-8,0,TAU);q.stroke();
  wc_T(q,"data",x0,y0-6,{w:800,size:28,align:"center",col:GV.goldInk});wc_T(q,"governance",x0,y0+28,{w:800,size:28,align:"center",col:GV.goldInk});},{seed:805});}
// the printed checklist of capabilities beside it: its lines, each ticked as it finds its card (st.tick(j)); the last, which finds none,
// lit red (st.miss)
const CP_LIST=["meanings agreed for terms","owners and decision rights","access to sensitive data","data quality","change and its impact","data products and sharing","skills and taking part","records kept and removed on time"];
function cp_listSheet(ctx,st){cp_onPaper(ctx,980,70,840,800,0.01,q=>{wc_T(q,"A checklist of capabilities",48,92,{w:800,size:36,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.5);q.fillRect(48,114,744,3);
  CP_LIST.forEach((s,j)=>{const yy=196+j*76,last=j===CP_LIST.length-1,m=last?(st.miss||0):0;if(m>0.01)withA(q,m,()=>{q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(GV.red,0.6),0.9);q.fillRect(40,yy-40,tw(q,s,30,600)+90,56);q.restore();});
    q.strokeStyle=rgba(WC_PENCIL,0.75);q.lineWidth=2.6;q.strokeRect(50,yy-30,36,36);wc_T(q,s,108,yy,{w:600,size:30,col:m>0.5?GV.redInk:WC_INK});if(!last)wc_tick(q,70,yy-14,46,GV.greenInk,st.tick?st.tick(j):0,5);});},{seed:807});}
// the plain scorecard's morning page, on a clipboard: last night's checks, all passed
const cp_scoreBoard=heldBoard(q=>{wc_T(q,"last night",0,-70,{w:700,size:28,align:"center",col:WC_MUTED});wc_T(q,"160 checks",0,-20,{w:800,size:32,align:"center",col:WC_DARK});
  wc_T(q,"160 passed",0,30,{w:800,size:32,align:"center",col:GV.greenInk});wc_tick(q,0,82,40,GV.greenInk,1,5);});
// a clipboard held low, at the waist, so it doesn't hide the face
POSE.cp_holdLow={L:[0.16,-1.12],R:[0.16,-1.12],feet:24,shift:0,tilt:0,turn:0,gaze:[0,0],look:0};
