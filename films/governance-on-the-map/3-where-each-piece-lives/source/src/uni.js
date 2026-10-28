/* ===== Where each piece lives: the university =====
   The university's rooms as the series paints them (its rooms.js): the planner's desk in the Faculty of Business, the data team's room,
   Planning's room, the platform team's desk, Yusuf's desk from above, Noor's room, the floor where the work is done; and what's on them:
   the table's page on the data platform, the planner's request, the calendar, the seven places Yusuf counts, the night's check and what
   it puts right. Every name starts with oh_ or OH. */

/* ---------- moments, tags and the corner pill (Who does what, end to end's, in this film's own names) ---------- */
// small type, drawn on purpose as part of a picture, that the legibility check (tools/legible.py) leaves out: it reads PH_OFF, the name the
// From words to data tools give it
let PH_OFF=0;
// fn draws with each word fading as the frame comes to cut it, from 30 px inside the frame's edge to gone at it, so the frame never cuts
// a word, as the playbook asks (A capability, not a project's cp_fadeCut). blocks: [x0, y0, x1, y1] where ctx is now, each a card's lines;
// a word in one fades with the whole block, so a card never shows half its words
function oh_fadeCut(ctx,fn,blocks){const T0=T,cw=ctx.canvas.width,ch=ctx.canvas.height,r=30*cw/1920,M=ctx.getTransform(),
    Bk=(blocks||[]).map(([x0,y0,x1,y1])=>[M.a*x0+M.e,M.d*y0+M.f,M.a*x1+M.e,M.d*y1+M.f]);
  T=(c,s2,x,y,o)=>{o=o||{};const sz=o.size||24,w=tw(c,String(s2),sz,o.w,o.f),al=o.align||"left",x0=al==="center"?x-w/2:al==="right"?x-w:x,m=c.getTransform();
    let l=1e9,rt=-1e9,tp=1e9,bt=-1e9;for(const [px,py] of [[x0,y-0.75*sz],[x0+w,y-0.75*sz],[x0,y+0.2*sz],[x0+w,y+0.2*sz]]){const X=m.a*px+m.c*py+m.e,Y=m.b*px+m.d*py+m.f;
      l=Math.min(l,X);rt=Math.max(rt,X);tp=Math.min(tp,Y);bt=Math.max(bt,Y);}
    const mx=(l+rt)/2,my=(tp+bt)/2,b=Bk.find(([a,q,e,d])=>mx>=a-6&&mx<=e+6&&my>=q-6&&my<=d+6);if(b){l=Math.min(l,b[0]);tp=Math.min(tp,b[1]);rt=Math.max(rt,b[2]);bt=Math.max(bt,b[3]);}
    const a=clamp(Math.min(l/r,(cw-rt)/r,tp/r,(ch-bt)/r),0,1);if(a>=0.99)return T0(c,s2,x,y,o);if(a>0.01)withA(c,a,()=>T0(c,s2,x,y,o));};
  try{return fn();}finally{T=T0;}}
// the block a card's lines make, for oh_fadeCut: L centred on cx, the first on y, lh apart
function oh_block(ctx,L,cx,y,lh,sz,w){const m=Math.max(...L.map(l=>tw(ctx,l,sz,w)));return[cx-m/2,y-0.75*sz,cx+m/2,y+(L.length-1)*lh+0.2*sz];}
// made once per chapter, the first time it draws: its cues are known by then
const oh_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a tag that springs in at t0 and goes at t1 (or stays)
function oh_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// a gold tag: governance's colour, for the word the story follows
const OH_GOLDTAG={wash:GV.gold,washA:0.55,col:GV.goldInk};
// the place and the time in the top corner, changing at the times given ([[t, words], ...]; null words: no pill), the old one fading as the
// new comes in
function oh_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1&&mk[i-1][1])wc_year(ctx,56,72,mk[i-1][1],a*(1-u));if(mk[i][1])wc_year(ctx,56,72,mk[i][1],a*u);}
// a name card: the name, and the role under it
function oh_nameCard(ctx,cx,cy,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60),h=104,k=0.92+0.08*spring(clamp(a,0,1));
  ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);withA(ctx,clamp(a*2,0,1),()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:Math.round(cx)});
    wc_T(ctx,name,0,-h/2+44,{w:800,size:32,align:"center",col:WC_DARK});wc_T(ctx,role,0,-h/2+82,{w:600,size:28,align:"center",col:WC_MUTED});});ctx.restore();}
// a sheet of paper over the whole frame, for the shots drawn on paper (the ring, the year's list)
function oh_paper(x){x.fillStyle=rgba(WC_PAPER,1);x.fillRect(-W,-H,3*W,3*H);}
// a paper on the desk, seen from above, at (x, y), its size, tipped; drawn through fn in its own coordinates (A capability, not a
// project's cp_onPaper)
function oh_onPaper(ctx,x,y,w,h,rot,fn,o){o=o||{};ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot||0);ctx.fillStyle="rgba(60,44,30,0.22)";ctx.fillRect(-w/2+10,-h/2+12,w,h);
  wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:o.seed||Math.round(x+y),wash:o.wash,washA:o.washA||0.2});ctx.translate(-w/2,-h/2);fn(ctx);ctx.restore();}
// a smooth path through points (Catmull-Rom), as a polyline of n points to a span; and the point a fraction u along a polyline
function oh_smooth(P,n){n=n||12;const out=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
  for(let k=0;k<n;k++){const u=k/n,u2=u*u,u3=u2*u;out.push([0,1].map(j=>0.5*(2*p1[j]+(-p0[j]+p2[j])*u+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*u2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*u3)));}}
  out.push(P[P.length-1]);return out;}
function oh_along(pts,u){let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
  let left=L*clamp(u,0,1);for(let i=1;i<pts.length;i++){if(left<=seg[i-1]||i===pts.length-1){const v=seg[i-1]?clamp(left/seg[i-1],0,1):0;return[lerp(pts[i-1][0],pts[i][0],v),lerp(pts[i-1][1],pts[i][1],v)];}left-=seg[i-1];}
  return pts[0];}
// Clara's request, small and bright as it travels: a gold card with three lines on it, a soft glow round it (o.held: no glow)
function oh_flyCard(ctx,x,y,s,rot,a,o){if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);withA(ctx,a,()=>{
  if(!(o&&o.held)){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,0,0,150,[255,222,120],0.95);wc_glowAt(ctx,0,0,80,[255,240,190],0.8);ctx.restore();}ctx.fillStyle="rgba(60,44,30,0.22)";ctx.fillRect(-54,-36,120,84);
  wc_panel(ctx,-60,-42,120,84,{kind:"card",seed:753,wash:GV.gold,washA:0.5});gv_lines(ctx,-42,-16,84,3,18,1);});ctx.restore();}
// a screen drawn as the screen close is (GV_SC, 1260 x 690), scaled into a smaller screen's box; its words are too small to read there,
// so they're decoration (Teachers of data's tt_onScreen)
function oh_onScreen(ctx,box,fn){const [sx,sy,sw,sh]=box,k=sw/GV_SC[2];ctx.save();ctx.translate(sx-GV_SC[0]*k,sy+(sh-GV_SC[3]*k)/2-GV_SC[1]*k);ctx.scale(k,k);
  ctx.beginPath();ctx.rect(GV_SC[0],GV_SC[1],GV_SC[2],GV_SC[3]);ctx.clip();const p=PH_OFF;PH_OFF=1;try{fn(ctx);}finally{PH_OFF=p;ctx.restore();}}
// a pen lying at an angle, its point at (x, y) (A product with an owner's, in this film's own name)
function oh_pen(ctx,x,y,a,rot){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot==null?0.62:rot);ctx.fillStyle="rgba(60,44,30,0.2)";ctx.fillRect(22,14,210,16);
  ctx.fillStyle=rgba([196,200,210],1);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(26,-7);ctx.lineTo(26,7);ctx.closePath();ctx.fill();ctx.fillStyle=rgba(GV_SIGN.ink,1);ctx.fillRect(0.5,-1.2,7,2.4);
  ctx.fillStyle=rgba([44,56,104],1);rr(ctx,24,-9,190,18,8);ctx.fill();ctx.fillStyle=rgba([206,176,92],1);ctx.fillRect(150,-9,8,18);ctx.fillStyle=rgba([90,104,160],0.7);ctx.fillRect(30,-6,170,3);ctx.restore();});}

/* ---------- 1 · the same with data: a home, and its copies ---------- */
// The table's owner, at home in the data team's repository (a card with a house mark), and three copies made from it one way (the
// table's page on the data platform, the catalogue, a dashboard), each saying where it came from; a gold arrow out to each as it's made
// (o.way, 0 to 1), the home lit (o.home), a tick on each as it's checked (o.check(i))
const OH_DC={home:[200,330,600,300],copies:[[1160,140],[1160,380],[1160,620]],cw:600,ch:180,names:["the table's page","the catalogue","a dashboard"]};
function oh_house(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=rgba([255,253,246],0.95);ctx.strokeStyle=rgba(WC_DARK,0.8);ctx.lineWidth=2.6;ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(-16,-2);ctx.lineTo(0,-16);ctx.lineTo(16,-2);ctx.lineTo(16,16);ctx.lineTo(-16,16);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(-5,16);ctx.lineTo(-5,5);ctx.lineTo(5,5);ctx.lineTo(5,16);ctx.stroke();ctx.restore();}
function oh_tick(ctx,x,y,u){if(u<=0.01)return;const k=0.7+0.3*spring(clamp(u,0,1));ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(u*2,0,1),()=>{ctx.fillStyle=rgba(GV.green,0.95);
  ctx.beginPath();ctx.arc(0,0,26,0,TAU);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=6;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-11,1);ctx.lineTo(-3,10);ctx.lineTo(13,-9);ctx.stroke();});ctx.restore();}
function oh_arrow(ctx,a,b,p,o){o=o||{};if(p<=0.01)return;const e=[lerp(a[0],b[0],p),lerp(a[1],b[1],p)],an=Math.atan2(b[1]-a[1],b[0]-a[0]);ctx.save();ctx.strokeStyle=rgba(o.col||GV.gold,o.a==null?0.95:o.a);
  ctx.lineWidth=o.lw||7;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();ctx.setLineDash([]);
  // the head travels with the line's end, so a flow's way is clear while it's drawn
  if(p>0.05){const L=(o.head||22)*clamp(p/0.25,0.4,1);ctx.beginPath();ctx.moveTo(e[0]-Math.cos(an-0.5)*L,e[1]-Math.sin(an-0.5)*L);ctx.lineTo(e[0],e[1]);ctx.lineTo(e[0]-Math.cos(an+0.5)*L,e[1]-Math.sin(an+0.5)*L);ctx.stroke();}ctx.restore();}
function oh_dataCopies(x,tt,o){o=o||{};oh_paper(x);const D=OH_DC,[hx,hy,hw,hh]=D.home,hl=clamp(o.home||0,0,1);
  if(hl>0.01){x.save();x.globalCompositeOperation="multiply";const g=x.createRadialGradient(hx+hw/2,hy+hh/2,hw*0.3,hx+hw/2,hy+hh/2,hw*0.8);g.addColorStop(0,rgba(wc_lit(GV.gold,0.3),0.9*hl));g.addColorStop(1,rgba(wc_lit(GV.gold,0.3),0));
    x.fillStyle=g;x.fillRect(hx-hw,hy-hh,hw*3,hh*3);x.restore();}
  wc_panel(x,hx,hy,hw,hh,{kind:"card",seed:501,wash:GV.gold,washA:0.2});oh_house(x,hx+hw-40,hy+40,1.1);
  wc_T(x,"the data team's repository",hx+36,hy+62,{w:800,size:30,col:WC_MUTED});x.fillStyle=rgba(WC_PENCIL,0.4);x.fillRect(hx+36,hy+84,hw-72,2);
  wc_T(x,"Learners near an award",hx+36,hy+150,{w:800,size:34,col:WC_DARK});wc_T(x,"owner: Clara Jensen",hx+36,hy+210,{w:800,size:34,col:GV.goldInk});
  D.copies.forEach(([cx,cy],i)=>{const w=o.way==null?1:clamp(o.way*1.5-i*0.25,0,1);oh_arrow(x,[hx+hw+10,hy+hh/2],[cx-14,cy+D.ch/2],w);
    withA(x,lerp(0.3,1,clamp((w-0.7)/0.3,0,1)),()=>{wc_panel(x,cx,cy,D.cw,D.ch,{kind:"card",dashed:true,seed:511+i});wc_T(x,D.names[i],cx+30,cy+52,{w:800,size:30,col:WC_MUTED});
      wc_T(x,"owner: Clara Jensen",cx+30,cy+104,{w:800,size:32,col:WC_DARK});if(w>0.95)wc_T(x,"from the repository",cx+30,cy+150,{w:800,size:28,col:GV.goldInk});});
    oh_tick(x,cx+D.cw-40,cy+40,o.check?o.check(i):0);});}

/* ---------- the people this film adds, and the floor ---------- */
// the planner in the Faculty of Business, who asks to read Planning's product
PEOPLE.ohPlanner={name:"",role:"Planner, Faculty of Business",side:"Business",does:"uses",edge:BIZ,seed:83,
  skin:[176,124,92],hair:{style:"bun",c:[40,30,28]},earrings:[255,214,140],
  top:{kind:"blazer",c:[52,104,96],inner:[238,234,226]},bottom:{c:[50,52,64]},shoe:[44,34,30],build:{sh:66,hip:62,h:0.95}};
// who works in which room of the floor, and how (Who does what, end to end's ee_floor, in this film's own names)
const OH_AT={clara:0,mei:1,yusuf:2,jun:3,sam:4},OH_WORK={clara:{pose:"reach"},mei:{pose:"reach"},yusuf:{pose:"write",carry:heldNotebook},jun:{pose:"reach"},sam:{pose:"reach"}};
function oh_floor(x,tt,o){o=o||{};const F=GV_FL;if(o.under)o.under(x);Object.keys(OH_AT).forEach(id=>{const i=OH_AT[id];if((o.out||[]).includes(id))return;
    person(x,id,F.spot(i),806,0.5,Object.assign({pose:"stand",t:tt+i,flip:i%2===1},OH_WORK[id],(o.pose||{})[id]||{}));});
  if(o.extra)o.extra(x);gv_floorGlass(x);const m=x.getTransform(),vl=-m.e/m.a,vr=(x.canvas.width-m.e)/m.a,a=o.names==null?1:o.names;
  F.rooms.forEach((r,i)=>{const cx=F.x(i)+F.w/2,hw=tw(x,r[1],30,800)/2+6;gv_floorName(x,i,a*clamp(Math.min(cx-hw-vl,vr-cx-hw)/30,0,1));});}
// the screen on each room's desk lit with a page (a(i), 0 to 1): a band at its head in col (or col(i), each room's own), lines under it
const oh_floorScr=i=>{const F=GV_FL,x=F.x(i),dx=i%2?x+20:x+F.w-190;return[dx+56,F.inner-206];};
function oh_floorScreens(ctx,a,col){GV_FL.rooms.forEach((r,i)=>{const u=clamp(a(i),0,1);if(u<=0.01)return;const [sx,sy]=oh_floorScr(i),cl=typeof col==="function"?col(i):col;
  withA(ctx,u,()=>{ctx.fillStyle=rgba([252,252,248],1);ctx.fillRect(sx,sy,80,50);ctx.fillStyle=rgba(cl||GV.gold,0.95);ctx.fillRect(sx,sy,80,10);ctx.fillStyle=rgba(WC_MUTED,0.6);
    for(let l=0;l<3;l++)ctx.fillRect(sx+8,sy+18+l*10,l===0?56:44,4);ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,sx+40,sy+25,70,[255,214,140],0.6*u);ctx.restore();});});}
// night over the whole frame (a, 0 to 1: the blue of a dark office); dawn (0 to 1) lifts it with a warm light from low down
function oh_night(ctx,a,dawn){a=clamp(a,0,1)*(1-0.85*clamp(dawn||0,0,1));if(a<=0.01&&!(dawn>0.01))return;ctx.save();ctx.setTransform(1,0,0,1,0,0);const cw=ctx.canvas.width,ch=ctx.canvas.height;
  if(a>0.01){ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(mix([255,255,255],[74,86,132],a),1);ctx.fillRect(0,0,cw,ch);}
  const d=clamp(dawn||0,0,1)*(1-clamp(((dawn||0)-0.6)/0.4,0,1));if(d>0.01){ctx.globalCompositeOperation="screen";const g=ctx.createLinearGradient(0,ch,0,0);
    g.addColorStop(0,rgba([255,186,120],0.3*d));g.addColorStop(0.6,rgba([255,214,160],0.1*d));g.addColorStop(1,rgba([255,214,160],0));ctx.fillStyle=g;ctx.fillRect(0,0,cw,ch);}
  ctx.restore();}

/* ---------- 2 · nine days ---------- */
// the data platform's page for the table, as the screen close shows it (GV_SC): its name, its owner, a button to ask to read it.
// o.owner (default "Jun Park"); o.swap (0 to 1): the owner's name turns, like a card, to o.to; o.from (0 to 1): "· from the repository"
// after it, gold; o.hand (0 to 1): "typed by hand · when the table was built", grey, under it; o.ownerLit, o.amber, o.green: a glow round the
// owner's line; o.typed (0 to 1): someone typing the owner's name into it, with a caret; o.press (0 to 1): the button pressed; o.why,
// o.until (0 to 1): what she types; o.sent (0 to 1): her request, under the page, "request · waiting" (or o.sentText)
const OH_PG={lab:410,title:196,owner:292,hand:348,ask:[410,392,250,62],val:560,why:520,until:584,sent:[410,624,460,64]};
function oh_tablePage(ctx,t,o){o=o||{};const [x,y,w,h]=GV_SC,G=OH_PG;
  gv_screen(ctx,x,y,w,h,"the data platform",q=>{
    wc_T(q,"Learners near an award",G.lab,G.title,{w:800,size:52,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.4);q.fillRect(G.lab,G.title+22,w-160,2);
    const nm0=o.owner||"Jun Park",nm1=o.to||"Clara Jensen",sw=clamp(o.swap||0,0,1),ty=o.typed==null?1:clamp(o.typed,0,1),
      nm=(sw<0.5?nm0:nm1).slice(0,Math.ceil((sw<0.5?nm0:nm1).length*ty)),ow=tw(q,"owner: ",36,600),nw=tw(q,nm,36,800),fr=clamp(o.from||0,0,1);
    for(const [k,col] of [["ownerLit",GV.gold],["amber",GV.amber],["green",GV.green]])oh_halo(q,G.lab-8,G.owner-40,ow+Math.max(nw,60)+16,54,o[k]||0,col);
    wc_T(q,"owner:",G.lab,G.owner,{w:600,size:36,col:WC_MUTED});
    const fl=Math.abs(Math.cos(Math.PI*sw));q.save();q.translate(0,G.owner-12);q.scale(1,Math.max(0.03,fl));q.translate(0,-(G.owner-12));wc_T(q,nm,G.lab+ow,G.owner,{w:800,size:36,col:WC_DARK});q.restore();
    if(ty<1&&Math.sin(t*14)>-0.4){q.fillStyle=rgba(WC_DARK,0.85);q.fillRect(G.lab+ow+nw+4,G.owner-29,3,35);}
    if(fr>0.01)withA(q,fr,()=>wc_T(q,"· from the repository",G.lab+ow+tw(q,nm1,36,800)+14,G.owner,{w:600,size:32,col:GV.goldInk}));
    const hd=clamp(o.hand||0,0,1);if(hd>0.01)withA(q,hd,()=>wc_T(q,"typed by hand · when the table was built",G.lab,G.hand,{w:600,size:30,col:GV.greyInk}));
    const [bx,by,bw,bh]=G.ask,pr=clamp(o.press||0,0,1);wc_panel(q,bx,by+3*pr,bw,bh,{kind:"pill",wash:mix([110,140,190],[60,84,130],pr),washA:0.85,seed:771});
    wc_T(q,"Ask to read",bx+bw/2,by+bh/2+11+3*pr,{w:800,size:30,align:"center",col:[255,255,255]});
    const typed=(s,tx,ty,u,op)=>{if(u<=0.01)return;const n=Math.ceil(s.length*u),sub=s.slice(0,n);wc_T(q,sub,tx,ty,op);
      if(u<1){const cw=tw(q,sub,op.size,op.w);q.fillStyle=rgba(WC_DARK,0.8);q.fillRect(tx+cw+4,ty-op.size*0.78,3,op.size*0.95);}};
    const wy=clamp(o.why||0,0,1),ut=clamp(o.until||0,0,1);
    if(wy>0.01||ut>0.01){withA(q,clamp(Math.max(wy,ut)*4,0,1),()=>{wc_T(q,"why",G.lab,G.why,{w:600,size:30,col:WC_MUTED});wc_T(q,"until",G.lab,G.until,{w:600,size:30,col:WC_MUTED});
      q.fillStyle=rgba(WC_PENCIL,0.25);q.fillRect(G.val,G.why+12,640,2);q.fillRect(G.val,G.until+12,640,2);});
      typed("to plan next year's courses",G.val,G.why,wy,{w:600,size:32,col:WC_INK});typed("30 June",G.val,G.until,ut,{w:600,size:32,col:WC_INK});}
    const se=clamp(o.sent||0,0,1);if(se>0.01){const [sx,sy,sw_,sh]=G.sent;oh_land(q,se,sx+sw_/2,sy+sh/2,()=>{wc_panel(q,sx,sy,sw_,sh,{kind:"pill",wash:o.sentCol||GV.grey,washA:0.4,seed:781});
      wc_T(q,o.sentText||"request · waiting",sx+28,sy+sh/2+11,{w:700,size:30,col:o.sentInk||GV.greyInk});});}});}
// the planner's request held: a gold card, as it flies (Who does what, end to end's ee_heldReq)
function oh_heldReq(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-26);cx.rotate(-0.05);oh_flyCard(cx,0,0,0.92,0,1,{held:true});cx.restore();fingers(cx,P_,[l,r]);}
// the requests on Jun's desk, a pile of small cards seen edge on, the planner's gold one near the bottom (o.out: it's been taken out)
function oh_pile(ctx,x,y,o){o=o||{};const R=wc_rng(801),n=13,gi=2;
  for(let i=0;i<n;i++){const dx=(R()-0.5)*18,rot=(R()-0.5)*0.1,yy=y-i*8;if(i===gi&&o.out)continue;ctx.save();ctx.translate(x+dx,yy);ctx.rotate(rot);ctx.fillStyle="rgba(60,44,30,0.16)";ctx.fillRect(-62,-4,128,8);
    ctx.fillStyle=rgba(i===gi?wc_lit(GV.gold,0.25):[250,248,240],1);ctx.fillRect(-64,-9,128,9);ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=1.3;ctx.strokeRect(-64,-9,128,9);ctx.restore();}
  if(!o.out&&(o.lit||0)>0.01){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y-gi*8-4,90,[255,214,120],0.7*clamp(o.lit,0,1));ctx.restore();}}
// Planning's product, on its card (A product with an owner's, smaller): its name, what it is, its owner ringed in gold (o.ring, 0 to 1)
function oh_productCard(ctx,x,y,o){o=o||{};const w=620,h=360;ctx.save();ctx.filter="blur(8px)";ctx.fillStyle="rgba(60,44,30,0.24)";ctx.fillRect(x+12,y+16,w,h);ctx.restore();
  wc_panel(ctx,x,y,w,h,{kind:"card",seed:791});wc_T(ctx,"Learners near an award",x+36,y+70,{w:800,size:42,col:WC_DARK});wc_T(ctx,"data product",x+36,y+112,{w:600,size:28,col:WC_MUTED});
  ctx.fillStyle=rgba(WC_MUTED,0.45);ctx.fillRect(x+36,y+134,w-72,3);wc_T(ctx,"owner",x+36,y+214,{w:700,size:30,col:WC_MUTED});wc_hand(ctx,"Clara Jensen, Planning",x+160,y+214,{size:32,w:600,col:GV_SIGN.ink});
  const r=clamp(o.ring||0,0,1);if(r>0){const tw_=tw(ctx,"Clara Jensen, Planning",32,600),cx=x+160+tw_/2-4,cy=y+202;ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=5;ctx.lineCap="round";
    ctx.beginPath();ctx.ellipse(cx,cy,tw_/2+30,36,-0.03,-Math.PI*0.6,-Math.PI*0.6+TAU*r*1.04);ctx.stroke();ctx.restore();}
  wc_T(ctx,"version",x+36,y+300,{w:700,size:30,col:WC_MUTED});wc_hand(ctx,"1 · active",x+160,y+300,{size:30,w:600,col:GV_SIGN.ink});}
// the faculty's wall calendar, close: February 2027; the planner's days of waiting crossed off one by one (o.cross, 0 to 9, from the 2nd),
// and the day Jun sees her request circled (o.ring, 0 to 1)
const OH_CAL={x:470,y:96,w:980,h:740,cw:128,ch:116,gx:536,gy:330};
function oh_calendarC(){const C=OH_CAL;return wc_kept("ohCal",W,H,q=>{q.fillStyle=rgba(WC_PAPER,1);q.fillRect(0,0,W,H);wc_wash(q,wc_rect(-40,-40,W+80,H+80),GV_ROOM.fac,{kind:"plaster",line:false,seed:793});
  gv_lightGlow(q,300,0,800);q.save();q.filter="blur(10px)";q.fillStyle="rgba(60,44,30,0.25)";q.fillRect(C.x+14,C.y+18,C.w,C.h);q.restore();wc_part(q,wc_rect(C.x,C.y,C.w,C.h),[252,250,244],1,{seed:795,lw:1.2});
  wc_T(q,"February 2027",C.x+C.w/2,C.y+112,{w:800,size:52,align:"center",col:WC_DARK});
  ["M","T","W","T","F","S","S"].forEach((d,i)=>wc_T(q,d,C.gx+C.cw*(i+0.5),C.gy-26,{w:700,size:30,align:"center",col:WC_MUTED}));
  q.strokeStyle=rgba(WC_PENCIL,0.35);q.lineWidth=1.5;for(let r=0;r<=4;r++){q.beginPath();q.moveTo(C.gx,C.gy+r*C.ch);q.lineTo(C.gx+7*C.cw,C.gy+r*C.ch);q.stroke();}
  for(let c=0;c<=7;c++){q.beginPath();q.moveTo(C.gx+c*C.cw,C.gy);q.lineTo(C.gx+c*C.cw,C.gy+4*C.ch);q.stroke();}
  for(let d=1;d<=28;d++){const i=(d-1)%7,r=Math.floor((d-1)/7);wc_T(q,String(d),C.gx+i*C.cw+14,C.gy+r*C.ch+40,{w:700,size:32,col:i>=5?WC_MUTED:WC_DARK});}
  gv_pin(q,C.x+C.w/2,C.y+26,GV.red,0.9);});}
function oh_calendar(x,tt,o){o=o||{};const C=OH_CAL,cx=d=>C.gx+((d-1)%7+0.55)*C.cw,cy=d=>C.gy+(Math.floor((d-1)/7)+0.58)*C.ch;x.drawImage(oh_calendarC(),0,0,W,H);
  for(let k=0;k<9;k++){const u=clamp((o.cross||0)-k,0,1);if(u<=0.01)continue;const d=2+k,X=cx(d),Y=cy(d),s=32,a=clamp(u*2,0,1),b=clamp(u*2-1,0,1);
    x.save();x.strokeStyle=rgba([196,58,48],0.85);x.lineWidth=6;x.lineCap="round";x.beginPath();x.moveTo(X-s,Y-s);x.lineTo(X-s+2*s*a,Y-s+2*s*a);if(b>0){x.moveTo(X+s,Y-s);x.lineTo(X+s-2*s*b,Y-s+2*s*b);}x.stroke();x.restore();}
  const r=clamp(o.ring||0,0,1);if(r>0.01){x.save();x.strokeStyle=rgba(GV.gold,0.95);x.lineWidth=6;x.lineCap="round";x.beginPath();x.ellipse(cx(11)-6,cy(11)-6,54,48,-0.1,-Math.PI*0.6,-Math.PI*0.6+TAU*r*1.03);x.stroke();x.restore();}}
// a hand coming up from below the frame, its finger pointing at (x, y): Jun's, in his sleeve, or another's (id)
function oh_pointHand(ctx,x,y,id){const P_=PEOPLE[id||"jun"],sl=P_.top.c,sk=P_.skin;ctx.save();ctx.translate(x,y);ctx.rotate(-0.12);
  ctx.beginPath();ctx.moveTo(-6,96);ctx.lineTo(70,96);ctx.lineTo(96,700);ctx.lineTo(-40,700);ctx.closePath();litFill(ctx,sl,-40,96,96,700);
  ctx.beginPath();ctx.ellipse(30,74,46,40,0,0,TAU);litFill(ctx,sk,-16,34,76,114);seam(ctx,sk,0.3,1.4);
  rr(ctx,-10,-6,24,74,12);litFill(ctx,sk,-10,-6,14,68);seam(ctx,sk,0.3,1.4);ctx.restore();}
// had he said yes: Jun's screen, close and pale, a picture of what didn't happen: the request and two buttons, his hand on "approve"
// (o.hand, 0 to 1), and a gold "no" across it, then "not the owner" (o.no, 0 to 1; o.tagAt, when its tag comes)
function oh_approve(x,tt,o){o=o||{};const [sx,sy,sw,sh]=GV_SC;
  gv_screen(x,sx,sy,sw,sh,"request to read",q=>{wc_T(q,"Learners near an award",410,200,{w:800,size:48,col:WC_DARK});
    [["from","a planner, Faculty of Business"],["why","to plan next year's courses"],["until","30 June"]].forEach(([l,v],i)=>{wc_T(q,l,410,290+i*62,{w:600,size:30,col:WC_MUTED});wc_T(q,v,560,290+i*62,{w:600,size:32,col:WC_INK});});
    wc_panel(q,410,500,250,64,{kind:"pill",wash:GV.green,washA:0.7,seed:811});wc_T(q,"approve",535,543,{w:800,size:30,align:"center",col:[255,255,255]});
    wc_panel(q,690,500,250,64,{kind:"pill",wash:GV.grey,washA:0.45,seed:813});wc_T(q,"pass on",815,543,{w:800,size:30,align:"center",col:GV.greyInk});});
  const hd=easeCam(clamp(o.hand||0,0,1));if(hd>0.01)oh_pointHand(x,lerp(760,548,hd),lerp(1120,548,hd));
  x.save();x.fillStyle=rgba(WC_PAPER,0.36);x.fillRect(-W,-H,3*W,3*H);x.restore();
  const no=clamp(o.no||0,0,1);if(no>0.01){x.save();x.strokeStyle=rgba(GV.gold,0.95);x.lineWidth=12;x.lineCap="round";const cx=535,cy=532,r=118,a=clamp(no*1.6,0,1),b=clamp((no*1.6-1)/0.6,0,1);
    x.beginPath();x.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+TAU*a);x.stroke();if(b>0){x.beginPath();x.moveTo(cx-r*0.7,cy-r*0.7);x.lineTo(cx-r*0.7+r*1.4*b,cy-r*0.7+r*1.4*b);x.stroke();}x.restore();
    oh_tagAt(x,tt,o.tagAt||0,null,535,712,"not the owner",OH_GOLDTAG);}}

/* ---------- 3 · seven places ---------- */
// Yusuf's seven cards on his desk, from above, each written as it's named (o.w(i), 0 to 1: the pen's way through its words) and laid
// down (o.lay(i)); a gold "owner" chip on the three that hold a product's owner (o.owner, 0 to 1); on o.drift (0 to 1), the name each
// gives: the platform's "Jun Park", amber, against the others' "Clara Jensen"
const OH_DK=[
  {b:[250,140,420,300],r:-0.02,L:["The architecture tool","Noor's map","capabilities, services,","roles, steps, information","definitions"]},
  {b:[710,130,380,250],r:0.015,L:["The glossary","definitions,","for everyone to read"]},
  {b:[1130,146,400,250],r:-0.01,L:["The document library","policies","the council's minutes"]},
  {b:[1570,160,300,620],r:0.012,n:2,L:["The data team's","repository","owners","classes","tables","checks","decisions","each product's","promise"],own:true},
  {b:[250,480,420,320],r:0.01,L:["The data platform","who may read what","who read it, and when","each table's page"],own:true},
  {b:[710,460,380,280],r:-0.015,L:["The catalogue","products","where to ask"],own:true},
  {b:[1130,480,400,230],r:0.02,L:["The tracker","issues","requests"]}];
// returns where the pen is, as a card is written, in ctx's coordinates (null when none is)
function oh_deskCards(x,tt,o){o=o||{};const M0=x.getTransform().inverse(),D=clamp(o.drift||0,0,1);let pen=null;
  OH_DK.forEach((c,i)=>{const u=o.lay?clamp(o.lay(i),0,1):1;if(u<=0.01)return;const [cx,cy,cw,ch]=c.b,e=easeCam(u),nt=c.n||1,dr=i===4?D:0;if(dr>0.01)oh_halo(x,cx,cy,cw,ch,dr*0.9,GV.amber,20);
    x.save();x.translate((1-e)*40,(1-e)*-50);withA(x,clamp(u*2.5,0,1),()=>oh_onPaper(x,cx,cy,cw,ch,c.r*(2-e),q=>{const p=o.w?clamp(o.w(i),0,1):1,n=c.L.reduce((s,l)=>s+l.length,0);let done=0,y=58;
      c.L.forEach((l,j)=>{const pp=clamp((p*n-done)/l.length,0,1),sz=j<nt?31:28,wt=j<nt?800:600;done+=l.length;if(pp>0)wc_hand(q,l,28,y,{size:sz,w:wt,col:j<nt?WC_DARK:GV_SIGN.ink,p:pp});
        if(pp>0&&pp<1&&!pen){const m=q.getTransform(),px=28+tw(q,l.slice(0,Math.ceil(l.length*pp)),sz,wt),py=y-4,X=m.a*px+m.c*py+m.e,Y=m.b*px+m.d*py+m.f;pen=[M0.a*X+M0.c*Y+M0.e,M0.b*X+M0.d*Y+M0.f];}
        y+=j<nt?44:40;if(j===nt-1)y+=8;});
      if(c.own){const ow=clamp(o.owner||0,0,1);if(ow>0.01)oh_land(q,ow,cw-86,ch-40,()=>{const col=mix(GV.gold,GV.amber,dr),ink=mix(GV.goldInk,GV.amberInk,dr);
        wc_panel(q,cw-156,ch-64,132,48,{kind:"pill",wash:col,washA:0.75,seed:831+i});wc_T(q,"owner",cw-90,ch-30,{w:800,size:28,align:"center",col:ink});});
        if(D>0.01)withA(q,D,()=>wc_T(q,i===4?"Jun Park":"Clara Jensen",cw-24,ch-82,{w:800,size:28,align:"right",col:i===4?GV.amberInk:GV.goldInk}));}},{seed:821+i}));x.restore();});
  return pen;}
// the planner's request as Jun passed it on, on Sam's screen: what she asked, and who passed it on (drawn as the screen close is, GV_SC)
function oh_fwdPage(ctx){const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"request to read",q=>{wc_T(q,"Learners near an award",410,200,{w:800,size:48,col:WC_DARK});
  [["from","a planner, Faculty of Business"],["why","to plan next year's courses"],["passed on by","Jun Park"]].forEach(([l,v],i)=>{wc_T(q,l,410,300+i*66,{w:600,size:30,col:WC_MUTED});wc_T(q,v,640,300+i*66,{w:600,size:32,col:WC_INK});});});}

/* ---------- 4 · one home each ---------- */
// the seven cards on Noor's map, as her room sees it: small, in the application band, each pinned as she goes (pin(i), 0 to 1)
function oh_roomCards(x,pin){const N=GV_NR.board,[bx,by,bw,bh]=gv_mapBand(N[0],N[1],N[2],N[3],4);
  for(let i=0;i<7;i++){const u=clamp(pin(i),0,1);if(u<=0.01)continue;const cw=bw*0.1,ch=bh*0.66,cx=bx+bw*(0.04+i*0.135),cy=by+(bh-ch)/2;
    oh_land(x,u,cx+cw/2,cy+ch/2,()=>{wc_panel(x,cx,cy,cw,ch,{kind:"card",wash:OH_APPC,washA:0.5,seed:911+i});gv_pin(x,cx+cw/2,cy+6,GV.red,0.45);gv_lines(x,cx+10,cy+ch*0.5,cw-20,2,10,1);});}}
// Noor's rule, as a table on a card over the map: each piece, its home, where it's changed, and its owner, who decides it. o.a (the card);
// o.piece(i), o.home(i), o.owner(i) (0 to 1): each cell as it's said
const OH_RT={x:290,y:150,w:1340,h:600,c:[60,470,930],rows:[["definitions","the architecture tool","owners of each area"],["a product's owner","the repository","the product's owner"],
  ["classes","the repository","each column's owner"],["who read it","the data platform","the platform team"]]};
function oh_ruleTable(x,tt,o){o=o||{};const R=OH_RT,a=clamp(o.a||0,0,1);if(a<=0.01)return;oh_land(x,a,R.x+R.w/2,R.y+R.h/2,()=>{x.save();x.filter="blur(12px)";x.fillStyle="rgba(60,44,30,0.22)";
  x.fillRect(R.x+14,R.y+18,R.w,R.h);x.restore();wc_panel(x,R.x,R.y,R.w,R.h,{kind:"card",seed:841});const X=c=>R.x+R.c[c],f=fn=>(i=>fn?clamp(fn(i),0,1):1);
  [["piece",0],["its home, where it's changed",1],["its owner, who decides it",2]].forEach(([s,c])=>wc_T(x,s,X(c),R.y+80,{w:600,size:28,col:WC_MUTED}));x.fillStyle=rgba(WC_PENCIL,0.4);x.fillRect(R.x+50,R.y+104,R.w-100,2);
  R.rows.forEach((r,i)=>{const y=R.y+180+i*104,pc=f(o.piece)(i),hm=f(o.home)(i),ow=f(o.owner)(i);
    if(pc>0.01)withA(x,pc,()=>wc_T(x,r[0],X(0),y,{w:700,size:32,col:WC_DARK}));
    if(hm>0.01)withA(x,hm,()=>{oh_house(x,X(1)+16,y-12,0.8);wc_T(x,r[1],X(1)+48,y,{w:700,size:32,col:WC_DARK});});
    if(ow>0.01)withA(x,ow,()=>wc_T(x,r[2],X(2),y,{w:700,size:32,col:GV.goldInk}));
    if(i<3){x.fillStyle=rgba(WC_PENCIL,0.15);x.fillRect(R.x+50,y+40,R.w-100,1.5);}});});}
// a product's owner, close: its home, the data team's repository, and its two copies, the catalogue and the platform's page. o.home,
// o.copies (0 to 1); o.way (0 to 1: the gold arrow out to the catalogue); o.tag (0 to 1: "from the repository, last night"); o.hand (0 to 1:
// the platform's page, "typed by hand"); o.platLit (an amber glow round it)
const OH_OC={home:[150,330,660,320],cat:[1100,170,680,220],plat:[1100,560,680,220]};
function oh_ownerCopies(x,tt,o){o=o||{};oh_paper(x);const D=OH_OC,[hx,hy,hw,hh]=D.home;
  oh_land(x,o.home==null?1:o.home,hx+hw/2,hy+hh/2,()=>{oh_glow(x,hx,hy,hw,hh,o.homeLit||0);wc_panel(x,hx,hy,hw,hh,{kind:"card",seed:851,wash:GV.gold,washA:0.2});oh_house(x,hx+hw-44,hy+44,1.1);
    wc_T(x,"The data team's repository",hx+36,hy+62,{w:800,size:30,col:WC_MUTED});x.fillStyle=rgba(WC_PENCIL,0.4);x.fillRect(hx+36,hy+84,hw-72,2);
    wc_T(x,"Learners near an award",hx+36,hy+160,{w:800,size:36,col:WC_DARK});wc_T(x,"owner: Clara Jensen",hx+36,hy+232,{w:800,size:36,col:GV.goldInk});});
  const cp=o.copies==null?1:o.copies,w=clamp(o.way||0,0,1);oh_arrow(x,[hx+hw+14,hy+hh/2-40],[D.cat[0]-18,D.cat[1]+D.cat[3]/2],w);
  [["The catalogue",D.cat,"owner: Clara Jensen",1],["The data platform's page",D.plat,"owner: Jun Park",0]].forEach(([nm,[cx,cy,cw,ch],ow,tagged],i)=>oh_land(x,clamp(cp*1.5-i*0.4,0,1),cx+cw/2,cy+ch/2,()=>{
    oh_glow(x,cx,cy,cw,ch,i===1?(o.platLit||0):0,GV.amber);wc_panel(x,cx,cy,cw,ch,{kind:"card",dashed:true,seed:861+i});wc_T(x,nm,cx+30,cy+56,{w:800,size:30,col:WC_MUTED});
    wc_T(x,ow,cx+30,cy+118,{w:800,size:34,col:WC_DARK});const tg=clamp(tagged?o.tag||0:o.hand||0,0,1);
    if(tg>0.01)withA(x,tg,()=>wc_T(x,tagged?"from the repository, last night":"typed by hand",cx+30,cy+176,{w:600,size:30,col:tagged?GV.goldInk:GV.greyInk}));}));}

/* ---------- 6 · found by a check ---------- */
// the night's check, on the platform's screen (GV_SC): each page that doesn't match its home, the name it gives and its home's (o.row(i),
// 0 to 1); o.hand (0 to 1): "typed by hand, last year" beside the last two; o.fix(i) (0 to 1): put right by morning, green, with its home's
// name; o.note(i) (0 to 1): a note to the owner, saying what changed
const OH_RP=[["Learners near an award","Jun Park","Clara Jensen","Clara Jensen"],["Fees by term","Sam Okafor","Finance","Finance"],
  ["Course completions","Jun Park","Learning team","the learning team"]];
function oh_checkPage(ctx,t,o){o=o||{};const [x,y,w,h]=GV_SC,L=OH_PG.lab,R=x+w-60;
  gv_screen(ctx,x,y,w,h,"last night's check",q=>{
    wc_T(q,"Each copy, compared with its home",L,190,{w:800,size:44,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.4);q.fillRect(L,214,R-L,2);
    OH_RP.forEach(([pg,has,home,to],i)=>{const u=o.row?clamp(o.row(i),0,1):1;if(u<=0.01)return;const ry=302+i*150,fx=o.fix?clamp(o.fix(i),0,1):0,nt=o.note?clamp(o.note(i),0,1):0;
      withA(q,clamp(u*2,0,1),()=>{oh_halo(q,L-24,ry-50,R-L+48,122,(1-fx)*0.5*u,GV.amber,22);oh_halo(q,L-24,ry-50,R-L+48,122,fx*0.5,GV.green,22);
        wc_T(q,pg,L,ry,{w:800,size:36,col:WC_DARK});
        if(fx<0.99)withA(q,1-fx,()=>wc_T(q,"owner: "+has+" · home says: "+home,L,ry+50,{w:700,size:30,col:GV.amberInk}));
        if(fx>0.01)withA(q,fx,()=>wc_T(q,"owner: "+home+" · from the repository, this morning",L,ry+50,{w:700,size:30,col:GV.greenInk}));
        const hd=i>0?clamp(o.hand||0,0,1)*(1-nt):0;if(hd>0.01)withA(q,hd,()=>wc_T(q,"typed by hand, last year",R,ry,{w:600,size:28,align:"right",col:GV.greyInk}));
        if(nt>0.01){const s="note · to "+to,nw=tw(q,s,28,700)+48;oh_land(q,nt,R-nw/2,ry-10,()=>{wc_panel(q,R-nw,ry-36,nw,52,{kind:"pill",wash:GV.gold,washA:0.4,seed:885+i});
          wc_T(q,s,R-nw+24,ry,{w:700,size:28,col:GV.goldInk});});}});});});}
// Yusuf's morning sheet, pinned on his board beside a photograph of Noor's map: what the check did last night (u, 0 to 1: it goes up)
function oh_officeSheet(x,u){const [bx,by]=GV_OFF.board;x.save();x.translate(bx+30,by+40);x.rotate(-0.03);x.fillStyle="rgba(60,44,30,0.22)";x.fillRect(6,8,150,108);
  x.fillStyle=rgba([252,252,248],1);x.fillRect(0,0,150,108);GV_LAYERS.forEach(([,c],i)=>{x.fillStyle=rgba(wc_lit(c,0.5),1);x.fillRect(8,8+i*16,134,13);});gv_pin(x,75,6,GV.red,0.5);x.restore();
  if(u<=0.01)return;const k=0.9+0.1*spring(clamp(u,0,1));x.save();x.translate(bx+300,by+180);x.scale(k,k);x.rotate(0.02);withA(x,clamp(u*2.5,0,1),()=>{x.fillStyle="rgba(60,44,30,0.24)";x.fillRect(-100,-118,210,250);
  wc_panel(x,-104,-124,208,250,{kind:"card",seed:891});wc_T(x,"Copies checked",0,-70,{w:800,size:22,align:"center",col:WC_DARK});wc_T(x,"last night",0,-40,{w:800,size:22,align:"center",col:WC_DARK});
  x.fillStyle=rgba(WC_PENCIL,0.35);x.fillRect(-80,-22,160,2);wc_T(x,"3",0,40,{w:800,size:48,align:"center",col:GV.greenInk});wc_T(x,"put right",0,80,{w:800,size:24,align:"center",col:GV.greenInk});
  gv_pin(x,0,-112,GV.red,0.55);});x.restore();}

/* ---------- 7 · theirs to change ---------- */
// the plan for the next series, pinned on the map: a heading card, and six cards, each a part of the map one of its films builds in
// the tools (o.head, o.card(i), 0 to 1)
const OH_NX=["who owns what, with the work","who may read what","one meaning, everywhere","checks with owners","promises in an open format","finding and asking"];
function oh_nextCards(x,tt,o){o=o||{};const hd=clamp(o.head||0,0,1);
  if(hd>0.01)oh_land(x,hd,960,150,()=>{const w=tw(x,"Next: Governance you can use",40,800)+90;wc_panel(x,960-w/2,104,w,92,{kind:"card",wash:GV.gold,washA:0.5,seed:897});gv_pin(x,960,114,GV.red,0.7);
    wc_T(x,"Next: Governance you can use",960,166,{w:800,size:40,align:"center",col:GV.goldInk});});
  OH_NX.forEach((s,i)=>{const u=o.card?clamp(o.card(i),0,1):1;if(u<=0.01)return;const c=i%3,r=Math.floor(i/3),w=520,h=112,cx=960+(c-1)*560,cy=352+r*168;
    oh_land(x,u,cx,cy,()=>{wc_panel(x,cx-w/2,cy-h/2,w,h,{kind:"card",seed:901+i});gv_pin(x,cx,cy-h/2+12,GV.red,0.6);wc_T(x,s,cx,cy+16,{w:700,size:30,align:"center",col:WC_DARK});});});}
