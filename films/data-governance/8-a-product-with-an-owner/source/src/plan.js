/* ===== A product with an owner: the university, today =====
   The university's own papers, drawn on the series' rooms (rooms.js), and the film's own places: Anil's desk from above, and the
   corridor's wall across from the offices. Paper is painted once and kept; its words are drawn every frame, so they stay sharp when
   the camera moves in. Every word is at least 28 px as seen, or drawn as pencil bars where only the shape of writing matters. */

// a name card, as the series introduces people: the name, then the role; it rises a little as it comes
function po_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:3});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}

// fn draws with each word fading as the frame comes to cut it, from 30 px inside the frame's edge to gone at it, so the frame never cuts
// a word, as the playbook asks (Fixed where it starts' fw_fadeCut): the camera pulls back past the corridor's calendar and the board's
// four steps, and a card or a page slides in past the frame's edge. spans: a table's columns, [x0, x1] where ctx is now; a word that
// starts in one fades with the whole column, so a column goes together
function po_fadeCut(ctx,fn,spans){const T0=T,cw=ctx.canvas.width,ch=ctx.canvas.height,r=30*cw/1920,M=ctx.getTransform(),S=(spans||[]).map(([a,b])=>[M.a*a+M.e,M.a*b+M.e]);
  T=(c,s2,x,y,o)=>{o=o||{};const sz=o.size||24,w=tw(c,String(s2),sz,o.w,o.f),al=o.align||"left",x0=al==="center"?x-w/2:al==="right"?x-w:x,m=c.getTransform();
    let l=1e9,rt=-1e9,tp=1e9,bt=-1e9;for(const [px,py] of [[x0,y-0.75*sz],[x0+w,y-0.75*sz],[x0,y+0.2*sz],[x0+w,y+0.2*sz]]){const X=m.a*px+m.c*py+m.e,Y=m.b*px+m.d*py+m.f;
      l=Math.min(l,X);rt=Math.max(rt,X);tp=Math.min(tp,Y);bt=Math.max(bt,Y);}
    const sp=S.find(([a,b])=>l>=a-2&&l<=b);if(sp){l=Math.min(l,sp[0]);rt=Math.max(rt,sp[1]);}
    const a=clamp(Math.min(l/r,(cw-rt)/r,tp/r,(ch-bt)/r),0,1);if(a>=0.99)return T0(c,s2,x,y,o);if(a>0.01)withA(c,a,()=>T0(c,s2,x,y,o));};
  try{return fn();}finally{T=T0;}}

/* ---------- Yusuf's shelf, and binder 22 ---------- */
// the shelf's 34 binders, numbered as Off the shelf numbered them (binder n is the n-th along the rows, from the left). The films before
// took theirs to the work (binders 2, 12, 6, 9, 15 and 19), so their places stay empty. Binder 22 is this film's: o.out slides it
// forward (0 to 1), o.taken leaves its place empty once it's in Yusuf's hands
const PO_BIND={w:24,h:146,gap:26.6,x:1393,cols:[[96,118,150],[150,90,80],[120,140,104],[186,160,110],[132,136,150],[110,96,130]],gone:[1,11,5,8,14,18],mine:21};
const po_bindCol=i=>PO_BIND.cols[Math.floor(hash(i,17)*PO_BIND.cols.length)];
function po_bindPos(i){const B=PO_BIND;return[B.x+(i%17)*B.gap,GV_OFF.shelf.rows[i<17?1:2]];}
function po_binders(ctx,o){o=o||{};const B=PO_BIND;for(let i=0;i<34;i++){if(B.gone.includes(i)||(o.taken&&i===B.mine))continue;const [x,y]=po_bindPos(i),u=i===B.mine&&o.out?o.out:0;
  ctx.save();ctx.translate(0,-10*u);gv_binder(ctx,x-u*3,y-B.h,Math.round(B.w+u*6),B.h,po_bindCol(i));ctx.restore();}}
// the binder in both hands, its label the film's title in three short lines, so it fits the label (in the figure's units, like the
// series' heldBinder); held by its top corners, low enough that his face shows over it
function po_heldTitled(lines,col){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2,w=200,h=250,lh=36,lt=-h/2+22,lb=lines.length*lh+26;
  cx.save();cx.translate(mx,my+74);cx.rotate(-0.05);cx.fillStyle=rgba(mix(col,[0,0,0],0.35),1);rr(cx,-w/2+9,-h/2+7,w,h,10);cx.fill();
  const g=cx.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,rgba(mix(col,[255,255,255],0.28),1));g.addColorStop(1,rgba(col,1));cx.fillStyle=g;rr(cx,-w/2,-h/2,w,h,10);cx.fill();
  cx.fillStyle="rgba(250,246,236,0.95)";for(let i=0;i<8;i++)cx.fillRect(w/2-2,-h/2+12+i*5,10,3.2);
  cx.fillStyle="rgba(255,252,242,0.97)";rr(cx,-w/2+14,lt,w-28,lb,10);cx.fill();
  cx.fillStyle=rgba(mix(col,[0,0,0],0.5),1);cx.textAlign="center";cx.font=font(800,30);lines.forEach((s,i)=>cx.fillText(s,0,lt+13+lh*(i+0.8)));cx.restore();
  fingers(cx,P_,[[mx-w/2+4,my+4],[mx+w/2-2,my]]);};}
// binder 22 open on Yusuf's desk, seen from above: the inside of its cover on the left, policy 22's first page on the right, the rings
// between them. Its line, and room under it: at the end a green highlighter goes behind the line (o.hl, 0 to 1) and Yusuf writes under
// it what now runs in the work (o.note, 0 to 1, as the pen writes)
const PO_OB={x:250,y:96,w:1420,h:800};
function po_openBinderC(){const B=PO_OB,col=po_bindCol(PO_BIND.mine);return wc_kept("poOpenBinder",B.w+80,B.h+80,q=>{q.translate(40,40);const w=B.w,h=B.h,m=w/2;
  q.save();q.filter="blur(10px)";q.fillStyle="rgba(60,44,30,0.3)";q.fillRect(12,18,w,h);q.restore();
  wc_wash(q,wc_rrPts(0,0,w,h,14),col,{kind:"cover",lw:1.6,seed:261});wc_wash(q,wc_rrPts(22,22,m-38,h-44,8),wc_lit(col,0.22),{kind:"swatch",line:false,a:0.7,seed:262});
  // a pocket on the inside of the cover, and the binder's own index card in it
  wc_part(q,wc_rect(70,h-330,m-150,250),wc_lit(col,0.4),1,{seed:263});wc_flat(q,wc_rect(110,h-300,m-230,120),WC_CARD,1,"card");
  q.fillStyle=rgba(WC_MUTED,0.3);for(let i=0;i<3;i++)q.fillRect(136,h-268+i*28,(m-290)*(i===2?0.5:0.9),5);
  // the pages on the rings, their edges showing under the top one
  for(let i=3;i>=1;i--)wc_flat(q,wc_rect(m+16+i*3,20+i*3,m-46,h-40),wc_dim(GV.paper,0.05*i),1,"pages");
  wc_wash(q,wc_rect(m+16,20,m-46,h-40),GV.paper,{kind:"page",lw:1.3,seed:264});
  for(const y of [140,h/2,h-140])wc_wash(q,wc_ell(m+52,y,13,13,20),wc_dim(GV.oak,0.12),{kind:"thing",lw:1.1,seed:y|0});
  // the ring mechanism: a metal bar down the spine, three rings over it
  wc_part(q,wc_rrPts(m-26,60,52,h-120,18),GV.metal,1,{kind:"thing",seed:265});
  for(const y of [140,h/2,h-140]){q.save();q.strokeStyle=rgba(wc_dim(GV.metal,0.35),0.95);q.lineWidth=11;q.lineCap="round";q.beginPath();q.ellipse(m+10,y,46,15,0,Math.PI*0.95,Math.PI*2.05);q.stroke();
    q.strokeStyle="rgba(255,255,255,0.55)";q.lineWidth=3;q.beginPath();q.ellipse(m+10,y-3,44,12,0,Math.PI*1.1,Math.PI*1.6);q.stroke();q.restore();}});}
const po_obX=()=>PO_OB.x+PO_OB.w/2+90;
const PO_OBT="Policy 22 · Data as an asset",PO_OBL=["Data is managed as an asset","with clear accountability."],PO_OBN="a product · an owner · a check";
function po_openBinder(ctx,a,o){if(a<=0.01)return;o=o||{};const B=PO_OB,x=po_obX(),ts=Math.min(40,40*(B.x+B.w-64-x)/tw(ctx,PO_OBT,40,800));
  withA(ctx,a,()=>{ctx.drawImage(po_openBinderC(),B.x-40,B.y-40);
    wc_T(ctx,"Data policies",x,B.y+96,{w:600,size:30,col:WC_MUTED});wc_T(ctx,PO_OBT,x,B.y+150,{w:800,size:ts,col:WC_DARK});
    PO_OBL.forEach((s,i)=>po_hlStroke(ctx,x+58,B.y+268+i*46,tw(ctx,s,30,600)+26,clamp((o.hl||0)*2-i,0,1)));
    wc_T(ctx,"22.1",x,B.y+268,{w:700,size:30,col:WC_MUTED});PO_OBL.forEach((s,i)=>wc_T(ctx,s,x+70,B.y+268+i*46,{w:600,size:30,col:WC_INK}));
    if(o.note>0)wc_hand(ctx,PO_OBN,x+70,B.y+420,{size:32,w:600,col:GV_SIGN.ink,p:o.note});});}
// a felt tip's stroke behind a line of text whose baseline is y, from x for w (p, 0 to 1, as it's drawn): slanted ends, an uneven edge
function po_hlStroke(ctx,x,y,w,p){if(p<=0)return;const e=w*clamp(p,0,1);ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([176,232,156],0.92);ctx.beginPath();
  ctx.moveTo(x+6,y-31);for(let i=1;i<=8;i++)ctx.lineTo(x+6+(e-6)*i/8,y-31+1.6*Math.sin(i*2.1));ctx.lineTo(x+e-6,y+10);for(let i=8;i>=0;i--)ctx.lineTo(x+(e-6)*i/8,y+10+1.6*Math.sin(i*1.7+1));
  ctx.closePath();ctx.fill();ctx.restore();}

/* ---------- Anil's office, in the old building ---------- */
// the desk's front layer as the series paints it, with the lamp moved to the desk's left end, so it stands clear of the chair beside
// Anil's, and his mug between the two chairs
function po_paintFacDesk(ctx){const X=GV_FX,top=X.top;gv_deskFront(ctx,top,[176,128,88],[[1460,380]]);
  for(let i=0;i<5;i++)wc_flat(ctx,wc_rect(150+i*3,top-8-i*7,250,9),i%2?[244,242,236]:[250,250,246],1,"paper");wc_part(ctx,wc_rect(170,top-60,220,16),GV.metal,1,{lw:1.2});
  gv_plant(ctx,130,X.win[1]+X.win[3]+2,0.45);
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+60,top,sw-120,sx+sw+30);gv_mug(ctx,1532,top+10,[204,86,70]);
  // the lamp: a weighted base, two arms, the shade turned down onto the papers, and its pool of light
  const ax=540,ay=X.lamp[1];ctx.save();ctx.beginPath();ctx.rect(ax-420,top,640,46);ctx.clip();ctx.globalCompositeOperation="screen";ctx.translate(ax-170,top+22);ctx.scale(1,0.22);wc_glowAt(ctx,0,0,260,[255,236,190],0.55);ctx.restore();
  wc_part(ctx,wc_ell(ax,ay+4,56,14,24),[60,64,72],1);ctx.save();ctx.strokeStyle=rgba([60,64,72],0.95);ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+30,ay-200);ctx.lineTo(ax-90,ay-300);ctx.stroke();ctx.restore();
  wc_part(ctx,[[ax-90,ay-320],[ax-60,ay-300],[ax-130,ay-220],[ax-200,ay-250]],[60,64,72],1,{lw:1.3});}
// Planning's near-award dashboard on his screen (the screen close-up, GV_SC), the morning it wasn't ready: the chart's frame, a row for
// each faculty, and nothing in them. The faculties' names are only the shape of writing; what matters is that the chart is empty
const PO_FACS=["Health","Business and Law","Engineering","Arts","Science","Education"];
function po_dash(ctx){const [x0,y0,w,h0]=GV_SC,y=y0+54,h=h0-54;ctx.save();ctx.fillStyle=rgba([226,230,236],1);ctx.fillRect(x0,y0,w,54);ctx.fillStyle=rgba([246,247,250],1);
  ctx.fillRect(x0+w-420,y0+14,380,26);ctx.restore();const x=x0;gv_screen(ctx,x,y,w,h,"Near-award dashboard",null,{barH:66,titleSize:36,bar:[84,112,96]});
  wc_T(ctx,"learners near a graduate certificate, by faculty",x+44,y+124,{w:600,size:34,col:WC_DARK});
  const gx=x+330,gy=y+170,gw=w-400,gh=h-266,rh=gh/PO_FACS.length;ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.22);ctx.lineWidth=2;
  for(let i=1;i<=4;i++){ctx.beginPath();ctx.moveTo(gx+gw*i/4,gy);ctx.lineTo(gx+gw*i/4,gy+gh);ctx.stroke();}
  ctx.strokeStyle=rgba(WC_MUTED,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx,gy-6);ctx.lineTo(gx,gy+gh);ctx.lineTo(gx+gw,gy+gh);ctx.stroke();ctx.restore();
  PO_FACS.forEach((s,i)=>{gv_wordBars(ctx,s,gx-26,gy+rh*(i+0.5)+10,28,"right");
    ctx.save();ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(WC_MUTED,0.34);ctx.lineWidth=2;ctx.strokeRect(gx+4,gy+rh*(i+0.24),gw*0.07,rh*0.52);ctx.restore();});
  wc_T(ctx,"last refreshed: Monday",x+w-44,y+h-32,{w:600,size:30,col:WC_MUTED,align:"right"});}
// the clock on the wall beside it: m minutes past six (60 is seven o'clock), its red second hand ticking with the film's seconds
function po_clock(ctx,x,y,r,m,t){ctx.save();ctx.fillStyle="rgba(60,44,30,0.22)";ctx.beginPath();ctx.arc(x+6,y+9,r+8,0,TAU);ctx.fill();ctx.restore();
  wc_wash(ctx,wc_ell(x,y,r+8,r+8,40),[70,74,84],{kind:"thing",lw:1.4,seed:331});wc_wash(ctx,wc_ell(x,y,r,r,40),[250,248,242],{kind:"thing",lw:1.1,seed:332});
  ctx.save();ctx.translate(x,y);ctx.lineCap="round";for(let i=0;i<12;i++){const a=i/12*TAU,q=i%3===0;ctx.strokeStyle=rgba(WC_DARK,0.85);ctx.lineWidth=q?5:3;
    ctx.beginPath();ctx.moveTo(Math.sin(a)*r*(q?0.74:0.8),-Math.cos(a)*r*(q?0.74:0.8));ctx.lineTo(Math.sin(a)*r*0.9,-Math.cos(a)*r*0.9);ctx.stroke();}
  const hand=(a,l,lw,col)=>{ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(-Math.sin(a)*l*0.16,Math.cos(a)*l*0.16);ctx.lineTo(Math.sin(a)*l,-Math.cos(a)*l);ctx.stroke();};
  hand((6+m/60)/12*TAU,r*0.5,8,WC_DARK);hand(m/60*TAU,r*0.76,5,WC_DARK);hand(Math.floor(t)/60*TAU,r*0.82,2.4,GV.red);
  ctx.fillStyle=rgba(WC_DARK,1);ctx.beginPath();ctx.arc(0,0,7,0,TAU);ctx.fill();ctx.restore();}
// Anil's desk from above, the faculty's warm wood: the edge of his keyboard, his red mug, a pencil
function po_paintFacTop(ctx){const col=[190,142,98];ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),col,{kind:"plaster",line:false,seed:351});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(7);for(let i=0;i<64;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(col,0.2+R()*0.12),0.16+R()*0.14);ctx.lineWidth=1+R()*2.4;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+6*Math.sin(x/300+i)+3*Math.sin(x/90+i*2));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(1560,-40,400,110),[226,228,234],1);for(let i=0;i<8;i++)for(let j=0;j<2;j++)wc_flat(ctx,wc_rect(1574+i*46,-26+j*42,38,34),[244,245,248],1,"key");
  wc_wash(ctx,wc_ell(1700,300,84,84,40),[204,86,70],{kind:"thing",lw:1.6,seed:353});wc_wash(ctx,wc_ell(1700,300,64,64,40),[120,78,52],{kind:"thing",line:false,seed:354});
  wc_wash(ctx,[[1784,286],[1824,280],[1828,322],[1786,316]],[204,86,70],{kind:"thing",lw:1.2,seed:355});
  wc_part(ctx,[[130,980],[400,880],[406,893],[136,994]],[244,196,80],1);wc_flat(ctx,[[400,880],[430,872],[406,893]],[60,54,58],1,"tip");}
// the sheet he plans next semester's places with: a row for each of the faculty's final units (their names only the shape of writing)
// and an empty cell for its places. In the last chapter he fills them in (o.fill, 0 to 1, a cell at a time)
const PO_SP={x:400,y:120,w:1100,h:730,row:64},PO_UNITS=["Clinical practice 3","Health research project","Capstone placement","Community health","Leading care teams","Health data in practice","Professional practice"],
  PO_PLACES=["48","36","52","40","28","44","32"];
function po_placesSheet(ctx,o){o=o||{};const S=PO_SP,{x,y,w}=S;gv_sheet(ctx,x,y,w,S.h);
  wc_T(ctx,"places in final units · semester 2",x+60,y+92,{w:800,size:40,col:WC_DARK});ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.5);ctx.fillRect(x+60,y+122,w-120,3);ctx.restore();
  gv_wordBars(ctx,"final unit",x+60,y+184,28);gv_wordBars(ctx,"places",x+w-250,y+184,28);
  PO_UNITS.forEach((s,i)=>{const ry=y+222+i*S.row;ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.14);ctx.fillRect(x+60,ry+S.row-4,w-120,2);ctx.restore();
    gv_wordBars(ctx,s,x+60,ry+42,28);ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2;ctx.strokeRect(x+w-260,ry+8,180,46);ctx.restore();
    const p=clamp((o.fill||0)*PO_PLACES.length-i,0,1);if(p>0)wc_hand(ctx,PO_PLACES[i],x+w-200,ry+44,{size:36,w:700,col:GV_SIGN.ink,p});});}

/* ---------- the corridor ---------- */
// the floor of offices: who is in which, and what they're doing; the glass over them, then whoever stands in the corridor in front of
// it (o.front), then the offices' names as far as they're in view
const PO_AT={clara:0,mei:1,yusuf:2,jun:3,sam:4};
function po_floor(x,tt,o){o=o||{};const F=GV_FL;Object.keys(PO_AT).forEach(id=>{const i=PO_AT[id];if((o.out||[]).includes(id))return;
    person(x,id,F.spot(i),806,0.5,Object.assign({pose:"listen",t:tt+i,flip:i%2===1},(o.pose||{})[id]||{}));});
  gv_floorGlass(x);if(o.front)o.front(x);const m=x.getTransform(),vl=-m.e/m.a,vr=(x.canvas.width-m.e)/m.a,a=o.names==null?1:o.names;
  F.rooms.forEach((r,i)=>{const cx=F.x(i)+F.w/2,hw=tw(x,r[1],30,800)/2+6;gv_floorName(x,i,a*clamp(Math.min(cx-hw-vl,vr-cx-hw)/30,0,1));});}
// The corridor's wall, across from the offices: plaster over a rail, a pinboard of the floor's notices with room in the middle, and a
// hook for a calendar. PO_CW: the floor, the board (x, y, w, h), where the calendar hangs
const PO_CW={fy:930,board:[200,130,880,600],cal:[1470,420]};
function po_paintCorridor(ctx){const C=PO_CW,wall=[234,228,214];gv_wallFloor(ctx,wall,C.fy,{seed:371,vx:900,floor:GV.corridor});gv_lightGlow(ctx,640,0,560);gv_lightGlow(ctx,1460,0,520);
  wc_wash(ctx,wc_rect(-40,780,W+80,16),wc_dim(wall,0.12),{kind:"trim",lw:1.2});
  const [bx,by,bw,bh]=C.board;gv_cork(ctx,bx,by,bw,bh,16);
  // the floor's notices round the edge: a timetable, a fire drill, sticky notes
  gv_sheet(ctx,bx+30,by+30,200,150,{rot:-0.02});gv_lines(ctx,bx+50,by+66,160,4,24,0.9);gv_pin(ctx,bx+130,by+40,[60,110,170]);
  gv_sheet(ctx,bx+bw-220,by+bh-210,180,180,{rot:0.03});gv_lines(ctx,bx+bw-196,by+bh-170,130,5,24,0.9);gv_pin(ctx,bx+bw-130,by+bh-200,[40,140,90]);
  gv_note(ctx,bx+bw-90,by+80,70,GV_NOTE[2],0.06,373);gv_note(ctx,bx+90,by+bh-90,70,GV_NOTE[0],-0.05,374);
  // a plant in the gap, and the calendar's nail, its cord down to the calendar's top corners
  gv_plant(ctx,1190,C.fy,1.05);const [cx,cy]=C.cal;ctx.save();ctx.strokeStyle=rgba([90,84,80],0.7);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(cx-118,cy-150);ctx.lineTo(cx,cy-196);ctx.lineTo(cx+118,cy-150);ctx.stroke();ctx.restore();
  wc_wash(ctx,wc_ell(cx,cy-198,7,7,12),GV.metal,{kind:"thing",lw:1.1});}
// the table's card, pinned (or hanging over the corridor on two strings, o.hang): its name, and under it, in red, the question nobody
// answered (o.q, 0 to 1). At the end a gold card takes the question's place (o.gold, 0 to 1): who answers for it now
function po_tableCard(ctx,cx,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=500,h=132;withA(ctx,a,()=>{
  if(o.hang){ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2;for(const sx of [cx-w/2+60,cx+w/2-60]){ctx.beginPath();ctx.moveTo(sx,-20);ctx.lineTo(sx,y+12);ctx.stroke();}ctx.restore();}
  wc_panel(ctx,cx-w/2,y,w,h,{kind:"card",seed:381});wc_T(ctx,"learners near an award",cx,y+58,{w:800,size:36,align:"center",col:WC_DARK});
  wc_T(ctx,"the table",cx,y+104,{w:600,size:30,align:"center",col:WC_MUTED});if(!o.hang)gv_pin(ctx,cx,y+14,[60,110,170]);
  const q=clamp(o.q||0,0,1)*(1-clamp(o.gold||0,0,1)),qy=y+h+24;
  if(q>0.01){const k=0.9+0.1*spring(q);ctx.save();ctx.translate(cx,qy+40);ctx.scale(k,k);withA(ctx,q,()=>{wc_panel(ctx,-210,-40,420,80,{kind:"card",wash:GV.red,washA:0.18,seed:382});
    wc_T(ctx,"who answers for it?",0,12,{w:800,size:36,align:"center",col:GV.redInk});if(!o.hang)gv_pin(ctx,0,-28,GV.red);});ctx.restore();}
  const g=clamp(o.gold||0,0,1);if(g>0.01){const k=0.9+0.1*spring(g);ctx.save();ctx.translate(cx,qy+52);ctx.scale(k,k);withA(ctx,g,()=>{wc_panel(ctx,-230,-52,460,104,{kind:"card",wash:GV.gold,washA:0.36,seed:383});
    wc_T(ctx,"Clara Jensen",0,-6,{w:800,size:36,align:"center",col:WC_DARK});wc_T(ctx,"answers for it",0,36,{w:600,size:30,align:"center",col:GV.goldInk});gv_pin(ctx,0,-40,GV.gold);});ctx.restore();}});}
// a wall calendar, a page a month (film 4's, in this film's own name): the page lifts away (flip, 0 to 1) and the next one's words come
// in as it goes, so they're never drawn under it
function po_calBaseC(){return wc_kept("poCalbase",360,380,q=>{q.translate(20,40);q.save();q.filter="blur(7px)";q.fillStyle="rgba(60,44,30,0.28)";q.fillRect(6,10,300,300);q.restore();
  wc_wash(q,wc_rect(0,0,300,300),[96,110,140],{kind:"cover",lw:1.4,seed:391});});}
function po_calRingsC(){return wc_kept("poCalrings",360,80,q=>{q.translate(20,40);for(let i=0;i<9;i++){q.strokeStyle=rgba([84,88,100],0.95);q.lineWidth=4.5;q.beginPath();q.ellipse(36+i*29,22,7,14,0,0,TAU);q.stroke();}});}
function po_calPageC(){return wc_kept("poCalpage",312,300,q=>{q.translate(20,20);wc_wash(q,wc_rect(0,0,272,262),GV.paper,{kind:"page",lw:1.2,seed:392});wc_flat(q,wc_rect(2,2,268,58),[198,96,74],1,"band");});}
function po_calPage(ctx,x,y,m,d,k,ta){if(k<=0.02)return;const d0=k<0.95?1:0,a=ta==null?1:ta;ctx.save();ctx.translate(x,y-126);ctx.scale(1,k);ctx.drawImage(po_calPageC(),-156,-20);
  if(a>0.01){wc_T(ctx,m,0,42,{w:800,size:32,align:"center",col:[255,255,255],deco:d0,a});wc_T(ctx,d,0,196,{w:800,size:116,align:"center",col:WC_DARK,deco:d0,a});}ctx.restore();}
function po_calendar(ctx,x,y,cur,next,flip){ctx.drawImage(po_calBaseC(),x-170,y-190);if(flip>0.001&&next)po_calPage(ctx,x,y,next[0],next[1],1,clamp((flip-0.25)/0.35,0,1));
  po_calPage(ctx,x,y,cur[0],cur[1],1-clamp(flip,0,1));ctx.drawImage(po_calRingsC(),x-170,y-190);}
// from today to the next census day, a page a month
const PO_CAL=[["October","28"],["November","1"],["December","1"],["January","1"],["February","1"],["March","31"]];

/* ---------- Planning's room: the table where the card is written ---------- */
// someone sitting behind a table (cut off at its top, cutY), as the series' gv_behind, a little higher (dy < 0) while they sit down
function po_behind(ctx,id,x,cutY,s,dy,o){ctx.save();ctx.beginPath();ctx.rect(-W,-H,3*W,cutY+H);ctx.clip();person(ctx,id,x,cutY+GV_SIT*s+(dy||0),s,o||{});ctx.restore();}
// the table in Planning's room, over the three sitting at it (kept like a place, and drawn after them): its top and edge, the panel
// under it, and on it a jug and glasses, a closed laptop, papers. PO_PT: the table's top, its left end and width, three seats, their scale
const PO_PT={top:772,table:[400,1120],seats:[650,960,1270],s:0.8};
function po_paintPlanTable(ctx){const T_=PO_PT,[x0,w]=T_.table,top=T_.top,col=[214,186,150];wc_contact(ctx,x0-30,x0+w+30,990,0.9,0.34);
  wc_part(ctx,wc_rect(x0+44,top+56,w-88,930-top-56),wc_dim(col,0.26),1);for(const lx of [x0+16,x0+w-58])wc_part(ctx,wc_rect(lx,top+56,42,990-top-56),wc_dim(col,0.32),1);
  wc_part(ctx,wc_rect(x0,top,w,40),wc_lit(col,0.12),1);wc_part(ctx,wc_rect(x0-6,top+38,w+12,20),wc_dim(col,0.06),1);
  const S=T_.seats,mid=i=>(S[i]+S[i+1])/2,ty=top+26;
  wc_part(ctx,[[mid(0)-30,ty],[mid(0)+30,ty],[mid(0)+34,ty-96],[mid(0)+20,ty-110],[mid(0)-26,ty-110],[mid(0)-34,ty-96]],[214,230,236],1,{kind:"thing",lw:1.3});
  wc_flat(ctx,[[mid(0)-30,ty-4],[mid(0)+30,ty-4],[mid(0)+32,ty-62],[mid(0)-32,ty-62]],[176,208,222],1,"water");
  for(const gx of [mid(0)+62,mid(1)-62]){wc_part(ctx,wc_rect(gx-16,ty-52,32,52),[226,236,240],1,{kind:"thing",lw:1.1});wc_flat(ctx,wc_rect(gx-14,ty-28,28,24),[186,214,226],1,"water");}
  wc_part(ctx,[[mid(1)-70,ty+8],[mid(1)+70,ty+8],[mid(1)+60,ty-6],[mid(1)-60,ty-6]],[150,156,168],1,{lw:1.2});
  for(let i=0;i<3;i++)wc_flat(ctx,wc_rect(x0+60+i*4,ty-4-i*6,190,8),i%2?[244,242,236]:[250,250,246],1,"paper");}
// Planning's screen on the wall (GV_PL.screen): the catalogue of data products, a plain page like a register, and its one empty place,
// where the card will go. o.on lights the screen (0 to 1); o.fill puts the card in its place (0 to 1), its gold edge with it
function po_catalogue(ctx,o){o=o||{};const [x,y,w,h]=GV_PL.screen,on=clamp(o.on==null?1:o.on,0,1);if(on<=0.01)return;withA(ctx,on,()=>{
  gv_screen(ctx,x,y,w,h,"Catalogue of data products",null,{barH:56,titleSize:32,bar:[84,112,96]});
  ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.12);for(let i=0;i<6;i++)ctx.fillRect(x+30,y+96+i*48,w-60,2);ctx.restore();
  const sw=400,sh=150,sx=x+w/2-sw/2,sy=y+118,f=clamp(o.fill||0,0,1);
  if(f<1){ctx.save();ctx.setLineDash([12,10]);ctx.lineWidth=3;ctx.strokeStyle=rgba(WC_MUTED,0.55*(1-f)*(0.8+0.2*Math.sin((o.t||0)*3)));ctx.strokeRect(sx,sy,sw,sh);ctx.restore();}
  if(f>0.01){const k=lerp(1.25,1,easeCam(f));ctx.save();ctx.translate(sx+sw/2,sy+sh/2);ctx.scale(k,k);withA(ctx,f,()=>{wc_panel(ctx,-sw/2,-sh/2,sw,sh,{kind:"card",wash:GV.gold,washA:0.22,seed:401});
    ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=5;rr(ctx,-sw/2-4,-sh/2-4,sw+8,sh+8,14);ctx.stroke();ctx.restore();
    wc_T(ctx,"Learners near an award",0,-14,{w:800,size:30,align:"center",col:WC_DARK});wc_T(ctx,"Clara Jensen · Planning",0,32,{w:600,size:28,align:"center",col:WC_INK});});ctx.restore();}});}
// a screen that's off: dark glass, a soft reflection across it
function po_screenOff(ctx,x,y,w,h,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba([62,68,80],1);ctx.fillRect(x,y,w,h);const g=ctx.createLinearGradient(x,y,x+w,y+h);
  g.addColorStop(0,"rgba(255,255,255,0.10)");g.addColorStop(0.45,"rgba(255,255,255,0.02)");g.addColorStop(1,"rgba(255,255,255,0.08)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();});}
// Planning's table from above, light wood: a glass, a closed notebook, the pen-tray's edge
function po_paintPlanTop(ctx){const col=[222,198,160];ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),col,{kind:"plaster",line:false,seed:411});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(19);for(let i=0;i<60;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(col,0.16+R()*0.1),0.14+R()*0.12);ctx.lineWidth=1+R()*2.2;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+5*Math.sin(x/280+i)+3*Math.sin(x/95+i*2));ctx.stroke();}ctx.restore();
  wc_wash(ctx,wc_ell(1790,880,58,58,36),[226,236,240],{kind:"thing",lw:1.4,seed:413});wc_wash(ctx,wc_ell(1790,880,44,44,30),[186,214,226],{kind:"thing",line:false,seed:414});
  wc_part(ctx,wc_rrPts(1240,900,420,300,14),[176,96,80],1,{seed:415});wc_flat(ctx,wc_rect(1600,900,14,300),wc_dim([176,96,80],0.4),1,"band");}
// the question Yusuf writes on a small card between them (each line, 0 to 1, as the pen writes it)
const PO_QC={x:1236,y:64,w:600,h:214},PO_QL=["What does it promise?","Who keeps it?"];
function po_qCard(ctx,p,a){if((a==null?1:a)<=0.01)return;const Q=PO_QC;withA(ctx,a==null?1:a,()=>{ctx.save();ctx.translate(Q.x+Q.w/2,Q.y+Q.h/2);ctx.rotate(0.015);ctx.translate(-Q.w/2,-Q.h/2);
  wc_panel(ctx,0,0,Q.w,Q.h,{kind:"card",seed:421});PO_QL.forEach((s,i)=>wc_hand(ctx,s,44,86+i*70,{size:40,w:600,col:GV_SIGN.ink,p:p[i]}));ctx.restore();});}
// The product card, as the three of them fill it in: a printed form (its title, and the name of each line) and what they write on each
// line in pen, as it's named (o.w[i], 0 to 1). When it's done, a gold frame goes round it (o.frame) and a gold ring round its owner
// (o.ring). PO_PC: where it lies, and its layout; PO_PCL: each line's name, and what's written, already broken to fit
const PO_PC={x:110,y:64,w:1000,h:800,lx:44,vx:300,y0:214,lh:38,gap:18,size:28};
const PO_PCL=[["for",["how many learners are near a graduate","certificate, by faculty, as at census date"]],["use",["to plan each faculty's places in its final","units; the numbers are as at census date"]],
  ["owner",["Clara Jensen, Planning"]],["in it",["17 columns, each in plain words,","and the checks they pass"]],["service levels",["built every night ·","ready by 7 a.m. on census day"]],
  ["ask",["Planning's data desk"]],["version",["1 · active"]]];
// each line's baselines, from the card's top
const PO_PCY=(()=>{const P=PO_PC;let y=P.y0;return PO_PCL.map(([,v])=>{const ys=v.map((_,j)=>y+j*P.lh);y+=v.length*P.lh+P.gap;return ys;});})();
function po_cardC(){const P=PO_PC;return wc_kept("poCard",P.w+40,P.h+40,q=>{q.save();q.filter="blur(8px)";q.fillStyle="rgba(60,44,30,0.26)";q.fillRect(28,34,P.w,P.h);q.restore();
  wc_wash(q,wc_rrPts(20,20,P.w,P.h,12),WC_CARD,{kind:"page",lw:1.4,seed:431});q.fillStyle=rgba(WC_MUTED,0.45);q.fillRect(20+P.lx,20+150,P.w-2*P.lx,3);
  q.fillStyle=rgba(WC_MUTED,0.12);PO_PCY.forEach(ys=>ys.forEach(y=>q.fillRect(20+P.vx,20+y+10,P.w-P.vx-P.lx,2)));});}
function po_card(ctx,o){o=o||{};const P=PO_PC,a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const {x,y}=P;ctx.drawImage(po_cardC(),x-20,y-20);
  wc_T(ctx,"Learners near an award",x+P.lx,y+82,{w:800,size:46,col:WC_DARK});wc_T(ctx,"data product",x+P.lx,y+126,{w:600,size:30,col:WC_MUTED});
  PO_PCL.forEach(([l,v],i)=>{wc_T(ctx,l,x+P.lx,y+PO_PCY[i][0],{w:700,size:P.size,col:WC_MUTED});const n=v.reduce((s_,q)=>s_+q.length,0);let done=0;
    v.forEach((q,j)=>{const p=clamp(((o.w||[])[i]||0)*n-done,0,q.length)/q.length;done+=q.length;if(p>0)wc_hand(ctx,q,x+P.vx,y+PO_PCY[i][j],{size:P.size,w:600,col:GV_SIGN.ink,p});});});
  const r=clamp(o.ring||0,0,1);if(r>0){const tw_=tw(ctx,PO_PCL[2][1][0],P.size,600),cx=x+P.vx+tw_/2-4,cy=y+PO_PCY[2][0]-10;ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=5;ctx.lineCap="round";
    ctx.beginPath();ctx.ellipse(cx,cy,tw_/2+34,34,-0.03,-Math.PI*0.6,-Math.PI*0.6+TAU*r*1.04);ctx.stroke();ctx.restore();}
  const f=clamp(o.frame||0,0,1);if(f>0){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=10;ctx.lineJoin="round";const L=2*(P.w+P.h+48);ctx.setLineDash([L*f,L]);
    ctx.beginPath();ctx.moveTo(x-12,y-12);ctx.lineTo(x+P.w+12,y-12);ctx.lineTo(x+P.w+12,y+P.h+12);ctx.lineTo(x-12,y+P.h+12);ctx.closePath();ctx.stroke();ctx.restore();}});}
// where the pen is while line i of the card is written (o.w[i] of the way): its tip at the end of what's written
function po_cardPen(ctx,i,p){const P=PO_PC,v=PO_PCL[i][1],n=v.reduce((s_,q)=>s_+q.length,0);let done=0,at=null;
  v.forEach((q,j)=>{const k=clamp(p*n-done,0,q.length);if(at===null&&(k<q.length||j===v.length-1))at=[q,j,k/q.length];done+=q.length;});
  const [q,j,u]=at;return po_penAt(ctx,q,P.x+P.vx,P.y+PO_PCY[i][j],P.size,u);}
// a pen lying at an angle, its point at (x,y) (film 4's, in this film's own name), and where it is while a hand writes s from (x,y)
function po_pen(ctx,x,y,a,rot){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot==null?0.62:rot);ctx.fillStyle="rgba(60,44,30,0.2)";ctx.fillRect(22,14,210,16);
  ctx.fillStyle=rgba([196,200,210],1);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(26,-7);ctx.lineTo(26,7);ctx.closePath();ctx.fill();ctx.fillStyle=rgba(GV_SIGN.ink,1);ctx.fillRect(0.5,-1.2,7,2.4);
  ctx.fillStyle=rgba([44,56,104],1);rr(ctx,24,-9,190,18,8);ctx.fill();ctx.fillStyle=rgba([206,176,92],1);ctx.fillRect(150,-9,8,18);ctx.fillStyle=rgba([90,104,160],0.7);ctx.fillRect(30,-6,170,3);ctx.restore();});}
const po_penAt=(ctx,s,x,y,sz,p)=>[x+tw(ctx,s.slice(0,Math.ceil(s.length*clamp(p,0,1))),sz,600)+4,y-sz*0.3+2*Math.sin(p*40)];
// the card on Planning's wall, beside the screen, small: its gold frame, and lines too small to read, on purpose
function po_wallCard(ctx,x,y,a){if(a<=0.01)return;const w=150,h=120;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(-0.02);wc_panel(ctx,-w/2,0,w,h,{kind:"card",seed:441});
  ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=4;rr(ctx,-w/2-3,-3,w+6,h+6,10);ctx.stroke();gv_lines(ctx,-w/2+16,26,w-40,5,18,1);gv_pin(ctx,0,8,[60,110,170],0.8);ctx.restore();});}

/* ---------- the floor: who answers for what ---------- */
// a card on an office's glass, centred on cx with its top at y: a name, and a job. Its words are sized for the floor seen at 1.45, where
// they're at least 29 px. a: 0 to 1, as it goes up
function po_glassCard(ctx,cx,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,26,800),tw(ctx,role,22,600))+44),h=84,k=0.9+0.1*spring(a);
  ctx.save();ctx.translate(cx,y+h/2);ctx.scale(k,k);withA(ctx,clamp(a*1.6,0,1),()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:451});gv_pin(ctx,0,-h/2+8,[60,110,170],0.7);
    wc_T(ctx,name,0,-h/2+38,{w:800,size:26,align:"center",col:WC_DARK});wc_T(ctx,role,0,-h/2+70,{w:600,size:22,align:"center",col:WC_INK});});ctx.restore();}
// where the two cards go: Clara's on Planning's glass, Mei's on the registrar's, and the three things Clara answers for, under hers
const PO_GC={y:292,clara:GV_FL.x(0)+GV_FL.w/2,mei:GV_FL.x(1)+GV_FL.w/2,jobs:["on time","keeps its promise","its users heard"],jy:404,jgap:44,cam:[600,400,1.45]};

/* ---------- 5 · Wanting the job: Yusuf's notebook, the cards that go down by the product's, the change request, the signature ---------- */
// someone's face in a small round frame, on a card or a page: head and shoulders on a pale wash, and a thin ring round it
function po_face(ctx,id,cx,cy,r,o){o=o||{};const k=r/96,s=k/PEOPLE[id].build.h;ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.clip();
  ctx.fillStyle=rgba(o.bg||[226,232,236],1);ctx.fillRect(cx-r,cy-r,2*r,2*r);person(ctx,id,cx,cy-0.12*r+502*k,s,{pose:"stand",expr:o.expr||"smile",t:o.t||0,shadow:false});ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(o.ring||WC_PENCIL,o.ringA==null?0.75:o.ringA);ctx.lineWidth=o.lw||2.4;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();ctx.restore();}
// an expression between two (u, 0 to 1), for a face that changes its mind slowly
function po_exprMix(a,b,u){const A=EXPR[a],B=EXPR[b],o={};new Set([...Object.keys(A),...Object.keys(B)]).forEach(k=>{o[k]=lerp(A[k]||0,B[k]||0,clamp(u,0,1));});return o;}
// Yusuf's notebook, open on Planning's table, from above. PO_NB: its spine's top, a page's size and its slight turn. Things on its pages
// are drawn in its own units (po_nbIn): from the spine's top, a left page running to -w and a right one to w
const PO_NB={sx:960,y:166,w:700,h:600,rot:-0.012};
function po_nbIn(ctx,fn){ctx.save();ctx.translate(PO_NB.sx,PO_NB.y);ctx.rotate(PO_NB.rot);fn(ctx);ctx.restore();}
// a line of handwriting too small to read, on purpose: word-long strokes of ink
function po_inkBars(q,x,y,w,seed,a){const R=wc_rng(seed);let cx=x;q.save();q.strokeStyle=rgba(GV_SIGN.ink,a==null?0.32:a);q.lineCap="round";q.lineWidth=7;
  while(cx<x+w-30){const l=24+R()*70;if(cx+l>x+w)break;q.beginPath();q.moveTo(cx,y);for(let u=0;u<=l;u+=6)q.lineTo(cx+u,y+1.6*Math.sin(u*0.4+seed));q.stroke();cx+=l+14+R()*8;}q.restore();}
// a page: cream paper, faint blue rules, what's on it (paint, in the page's own units), and the shade in its gutter (side -1: a left page)
function po_nbPageC(side,key,paint){const {w,h}=PO_NB;return wc_kept("poNb|"+key,w,h,q=>{wc_wash(q,wc_rect(0,0,w,h),[252,250,242],{kind:"page",line:false,seed:side<0?611:617});
  q.fillStyle="rgba(120,130,170,0.3)";for(let y=92;y<h-24;y+=44)q.fillRect(side<0?36:30,y,w-66,2);if(paint)paint(q);
  const gx=side<0?w:0,g=q.createLinearGradient(gx,0,gx+(side<0?-80:80),0);g.addColorStop(0,"rgba(110,96,80,0.3)");g.addColorStop(0.4,"rgba(110,96,80,0.08)");g.addColorStop(1,"rgba(110,96,80,0)");
  q.fillStyle=g;q.fillRect(side<0?w-80:0,0,80,PO_NB.h);});}
// the notes on the pages before: a few lines of Yusuf's writing
const po_nbOld=side=>q=>{[[136,0.9],[180,0.7],[224,0.95],[312,0.8],[356,0.6],[444,0.85],[488,0.5]].forEach(([y,f],i)=>po_inkBars(q,side<0?60:56,y-6,(PO_NB.w-130)*f,side*31+i*7));};
// the sketch on the left page: the product's card drawn as a stall, under an awning, on a counter (in the page's units; the stall at
// x 40 to 400 is -660 to -300 in the notebook's)
function po_nbStall(q){const ink=GV_SIGN.ink,pen=(pts,o)=>wc_pencil(q,pts,1,Object.assign({col:ink,a:0.66,lw:2.8,seed:7+(pts[0][0]|0)+(pts[0][1]|0)},o||{}));
  pen([[64,192],[112,142],[328,142],[376,192]]);const sc=[];for(let i=0;i<8;i++)for(let j=0;j<=5;j++){const u=j/5;sc.push([64+i*39+u*39,192+15*Math.sin(Math.PI*u)]);}pen(sc,{seed:41});
  pen([[70,200],[72,432]]);pen([[370,200],[368,432]]);pen([[40,434],[400,432]]);
  pen([[106,236],[334,232],[336,404],[104,406]],{closed:true,seed:43});
  q.save();q.strokeStyle=rgba(ink,0.5);q.lineCap="round";q.lineWidth=9;q.beginPath();q.moveTo(126,268);q.lineTo(270,266);q.stroke();q.lineWidth=6;
  [[302,0.8],[330,0.62],[358,0.74],[384,0.5]].forEach(([y,f])=>{q.beginPath();q.moveTo(126,y);q.lineTo(126+180*f,y);q.stroke();});q.restore();
  pen(Array.from({length:30},(_,i)=>{const a=i/29*TAU*1.05;return[188+80*Math.cos(a),356+15*Math.sin(a)];}),{seed:47,lw:2.2});}
// the notebook: its shadow, its teal cover and the pages' edges, then the pages. o.flip (0 to 1) turns a page from right to left: before
// it, the notes; after it, the stall on the left page (painted on the turning page's back) and a blank right page
function po_notebook(ctx,o){o=o||{};const {w,h}=PO_NB,f=clamp(o.flip==null?1:o.flip,0,1);po_nbIn(ctx,q=>{
  q.save();q.filter="blur(14px)";q.fillStyle="rgba(70,50,30,0.3)";q.fillRect(-w-6,24,2*w+30,h+6);q.restore();
  wc_part(q,wc_rrPts(-w-16,-12,2*w+32,h+26,10),GV_HOLD.teal,1,{kind:"cover",lw:1.2,seed:621});
  for(const s of [-1,1])for(let k=3;k>=1;k--){const x0=s<0?-w-k*3:0;wc_flat(q,wc_rect(x0,k*2,w+k*3,h-k*2),[240-k*7,238-k*7,230-k*7],1,"page");}
  const L0=po_nbPageC(-1,"old",po_nbOld(-1)),R0=po_nbPageC(1,"oldR",po_nbOld(1)),L1=po_nbPageC(-1,"stall",po_nbStall),R1=po_nbPageC(1,"blank");
  q.drawImage(f<1?L0:L1,-w,0);q.drawImage(f>0?R1:R0,0,0);
  if(f>0&&f<1){const back=f>=0.5,k=Math.max(0.02,back?(f-0.5)*2:1-f*2);q.save();q.fillStyle="rgba(60,44,30,"+(0.22*(1-k)).toFixed(3)+")";q.fillRect(back?-w:0,0,w,h);
    q.scale(k,1);q.drawImage(back?L1:R0,back?-w:0,0);q.fillStyle="rgba(60,50,40,"+(0.28*(1-k)).toFixed(3)+")";q.fillRect(back?-w:0,0,w,h);q.restore();}
  wc_flat(q,wc_rect(w+4,-12,10,h+26),wc_dim(GV_HOLD.teal,0.45),1,"band");});}
// the line of users behind the stall, as Yusuf draws them (in the notebook's units): the near-award dashboard first, then the faculties,
// Health first, with Anil's face. o.dash, o.fac[i]: how far each is drawn, 0 to 1
const PO_NQ={dash:[-240,286,130,90],fac:[96,200,304,408,512,616],fy:300};
function po_nbQueue(q,o){o=o||{};const ink=GV_SIGN.ink,pen=(pts,p,o2)=>wc_pencil(q,pts,p,Object.assign({col:ink,a:0.7,lw:2.8,seed:9+(pts[0][0]|0)},o2||{}));
  const d=clamp(o.dash||0,0,1);if(d>0){const [x,y,w,h]=PO_NQ.dash;pen([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],clamp(d*1.6,0,1),{closed:true});
    pen([[x+w/2-6,y+h],[x+w/2-6,y+h+22]],clamp(d*3-1.6,0,1));pen([[x+w/2-36,y+h+24],[x+w/2+24,y+h+24]],clamp(d*3-1.9,0,1));
    q.save();q.fillStyle=rgba(ink,0.4*clamp(d*2.5-1.4,0,1));[[0.18,0.5],[0.36,0.75],[0.54,0.4],[0.72,0.62]].forEach(([u,f])=>q.fillRect(x+w*u,y+h-12-(h-30)*f,14,(h-30)*f));q.restore();}
  PO_NQ.fac.forEach((x,i)=>{const p=clamp((o.fac||[])[i]||0,0,1);if(p<=0)return;const y=PO_NQ.fy;
    if(i===0){withA(q,clamp(p*2,0,1),()=>po_face(q,"anil",x,y+18,46,{expr:"calm",ring:ink,ringA:0.7,bg:[236,232,222]}));
      wc_hand(q,"Health",x,y+112,{size:30,align:"center",col:ink,p:clamp(p*2-0.6,0,1)});return;}
    pen(Array.from({length:22},(_,j)=>{const a=-Math.PI/2+j/21*TAU;return[x+24*Math.cos(a),y-2+24*Math.sin(a)];}),clamp(p*2,0,1));
    pen([[x-42,y+66],[x-30,y+40],[x,y+30],[x+30,y+40],[x+42,y+66]],clamp(p*2-0.8,0,1));
    if(p>0.6){q.save();q.globalAlpha*=clamp((p-0.6)*2.5,0,1);q.strokeStyle=rgba(ink,0.34);q.lineCap="round";q.lineWidth=7;q.beginPath();q.moveTo(x-30,y+100);q.lineTo(x+24-6*(i%2),y+100);q.stroke();q.restore();}});}
// a small card with someone's face, their name and their part, as the ones that go down by the product's card (x,y its top left, 200 by
// 200); a (0 to 1) as it goes down, settling with a turn
function po_jobCard(ctx,x,y,id,name,role,a,rot){if(a<=0.01)return;const u=easeCam(clamp(a,0,1)),k=0.94+0.06*spring(a);ctx.save();ctx.translate(x+100,y+100-46*(1-u));ctx.rotate((rot||0)*(0.4+0.6*u));ctx.scale(k,k);
  withA(ctx,clamp(a*2.2,0,1),()=>{wc_panel(ctx,-100,-100,200,200,{kind:"card",seed:461+name.length*7});po_face(ctx,id,0,-38,44,{t:2});
    wc_T(ctx,name,0,40,{w:800,size:32,align:"center",col:WC_DARK});wc_T(ctx,role,0,78,{w:600,size:28,align:"center",col:WC_INK});});ctx.restore();}
// a change request on paper (x,y its top left, w by h): its title, what it's for, lines of what changes (too small to read, on purpose),
// and its rows at the foot, each {l, v, hand, p}: a label, and what's written by it (printed, or handwritten as far as p); a row with
// no value keeps an empty line. o.box: an empty box after the last row, lit gold by o.boxLit
function po_changeReq(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  withA(ctx,a,()=>{gv_sheet(ctx,0,0,w,h);wc_T(ctx,"Change request",36,58,{w:800,size:34,col:WC_DARK});wc_T(ctx,o.name||"",36,102,{w:600,size:30,col:WC_INK});
    ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(36,124,w-72,2);gv_lines(ctx,36,154,w-140,o.lines||2,28,0.9);
    const rows=o.rows||[];let ex=36;rows.forEach((r,i)=>{const ry=h-38-(rows.length-1-i)*50,lw=tw(ctx,r.l,30,600);wc_T(ctx,r.l,36,ry,{w:600,size:30,col:WC_MUTED});const vx=36+lw+14;
      if(r.v&&!r.hand){wc_T(ctx,r.v,vx,ry,{w:700,size:30,col:WC_DARK});ex=vx+tw(ctx,r.v,30,700);}
      else{const lw2=Math.max(220,r.v?tw(ctx,r.v,30,600)+20:0),wn=clamp(r.warn||0,0,1);if(wn>0){ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,vx+lw2/2,ry-4,lw2*0.6,[240,150,130],0.5*wn);ctx.restore();}
        ctx.fillStyle=rgba(mix(WC_MUTED,GV.redInk,wn),0.45+0.4*wn);ctx.fillRect(vx,ry+8,lw2,2+wn);if(r.v)wc_hand(ctx,r.v,vx+4,ry,{size:30,col:GV_SIGN.ink,p:r.p==null?1:r.p});ex=vx+240;}});
    if(o.box){const bx=ex+22,by=h-38-28,lit=clamp(o.boxLit||0,0,1);if(lit>0){ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,bx+19,by+19,46,[255,214,120],0.7*lit);ctx.restore();}
      ctx.save();ctx.strokeStyle=rgba(lit>0?mix(WC_INK,GV.goldInk,lit):WC_INK,0.8);ctx.lineWidth=2.6;ctx.strokeRect(bx,by,38,38);ctx.restore();}
    if(o.after)o.after(ctx);});ctx.restore();}
// Clara's signature: one pen line, looped as a hand's is, its start at (0,0) on the line it sits on; po_sig draws it as far as p, and
// po_sigAt says where the pen is then
const PO_SIG=(()=>{const P=[];for(let i=0;i<=26;i++){const a=Math.PI*0.3+i/26*TAU*0.82;P.push([30+22*Math.cos(a),-20-24*Math.sin(a)]);}
  for(let i=0;i<=140;i++){const u=i/140,t_=u*8*TAU;P.push([36+u*238-10*Math.sin(t_),-6-(12+9*Math.sin(u*11))*(1-Math.cos(t_))/2]);}
  for(let i=1;i<=34;i++){const u=i/34;P.push([274-u*262,8+12*Math.sin(u*Math.PI)-u*2]);}return P;})();
function po_sig(ctx,x,y,p,o){o=o||{};wc_pencil(ctx,PO_SIG.map(([a,b])=>[x+a,y+b]),p,{col:GV_SIGN.ink,a:0.95,lw:o.lw||3.4,amp:0.25,seed:57});}
function po_sigAt(x,y,p){const i=Math.min(PO_SIG.length-1,Math.max(0,Math.round(clamp(p,0,1)*(PO_SIG.length-1))));return[x+PO_SIG[i][0],y+PO_SIG[i][1]];}
// the product's card in chapter 5, where it lies (at 0.8 of its size, its corner where it was) with the cards and the change request by it
const PO_JB={k:0.8,cards:[[940,400],[1150,400],[1360,400]],cr:[940,64,620,296],sig:[650,402]};
function po_cardSmall(ctx,o){const k=PO_JB.k,P=PO_PC;ctx.save();ctx.translate(P.x,P.y);ctx.scale(k,k);ctx.translate(-P.x,-P.y);po_card(ctx,Object.assign({w:[1,1,1,1,1,1,1],frame:1,ring:1},o||{}));
  const s=o&&o.sign;if(s>0){const [sx,sy]=PO_JB.sig;po_sig(ctx,P.x+sx,P.y+sy,s);}if(o&&o.pen>0.01){const [sx,sy]=PO_JB.sig,[px,py]=po_sigAt(P.x+sx,P.y+sy,s||0);po_pen(ctx,px,py,o.pen);}ctx.restore();}

/* ---------- 6 · Products and steps: the register of tables, the check that sends a change back, three kinds of product ---------- */
// the data team's register of tables, pinned to their board (in its close-up): 33 rows, the shape of writing only. PO_RG: where it hangs,
// its rows, and which rows are in which product (by the tags that hang at its side, each with how many of its tables)
const PO_RG={x:280,y:86,w:580,h:780,r0:190,dy:17.8,col:676,tx:902,
  prods:[["Learner records · 4",[1,4,6,9]],["Awards · 1",[12]],["Learners near an award · 1",[15]],["Learner wallet · 2",[19,22]],["Tuition forgone · 1",[26]],["Short-course follow-ups · 1",[30]]]};
const po_rgY=i=>PO_RG.y+PO_RG.r0+i*PO_RG.dy,PO_RGP=(()=>{const m={};PO_RG.prods.forEach(([,rs],k)=>rs.forEach(r=>{m[r]=k;}));return m;})();
const po_rgTagY=k=>340+k*92;
// o.lit(i): how lit product row i is, 0 to 1; o.grey: the steps greyed; o.pulse, o.tick: the follow-up list's row lit again, and ticked
function po_register(ctx,o){o=o||{};const R=PO_RG,grey=clamp(o.grey||0,0,1),Rn=wc_rng(733);gv_sheet(ctx,R.x,R.y,R.w,R.h);gv_pin(ctx,R.x+46,R.y+22,[60,110,170],0.9);gv_pin(ctx,R.x+R.w-46,R.y+22,[60,110,170],0.9);
  wc_T(ctx,"Register of tables · 33",R.x+36,R.y+76,{w:800,size:36,col:WC_DARK});ctx.fillStyle=rgba(WC_MUTED,0.45);ctx.fillRect(R.x+36,R.y+100,R.w-72,2);
  gv_wordBars(ctx,"table",R.x+36,R.y+142,22,"left");gv_wordBars(ctx,"product",R.col,R.y+142,22,"left");
  for(let i=0;i<33;i++){const y=po_rgY(i),k=PO_RGP[i],len=130+Rn()*190,pl=50+Rn()*80;
    if(k!=null){const l=clamp(o.lit?o.lit(i):0,0,1),pu=k===5?clamp(o.pulse||0,0,1):0;if(l>0){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(mix([255,255,255],[246,214,130],l),1);
        ctx.fillRect(R.x+22,y-15,R.w-44,18);if(pu>0){wc_glowAt(ctx,R.x+R.w/2,y-6,R.w*0.55,[255,206,96],0.55*pu);}ctx.restore();}
      ctx.save();ctx.strokeStyle=rgba(WC_INK,0.42);ctx.lineCap="round";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(R.x+40,y-6);ctx.lineTo(R.x+40+len,y-6);ctx.stroke();
      if(l>0){ctx.strokeStyle=rgba(GV.goldInk,0.75*l);ctx.beginPath();ctx.moveTo(R.col,y-6);ctx.lineTo(R.col+pl+40,y-6);ctx.stroke();}ctx.restore();
      const tk=k===5?clamp(o.tick||0,0,1):0;if(tk>0)wc_pencil(ctx,[[R.x+R.w-50,y-8],[R.x+R.w-40,y+2],[R.x+R.w-20,y-22]],tk,{col:GV.greenInk,a:1,lw:5,seed:91});}
    else{const g=mix(WC_INK,[196,198,204],grey);ctx.save();ctx.strokeStyle=rgba(g,0.42-0.12*grey);ctx.lineCap="round";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(R.x+40,y-6);ctx.lineTo(R.x+40+len,y-6);ctx.stroke();
      if(grey>0){ctx.strokeStyle=rgba([170,174,182],0.5*grey);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(R.col,y-6);ctx.lineTo(R.col+46,y-6);ctx.stroke();}ctx.restore();}}}
// the six gold tags at the register's side, each with gold threads to its rows (a(k), 0 to 1, as each comes in)
function po_rgTags(ctx,a){PO_RG.prods.forEach(([s,rs],k)=>{const u=clamp(a(k),0,1);if(u<=0)return;const ty=po_rgTagY(k);ctx.save();ctx.strokeStyle=rgba(GV.gold,0.85);ctx.lineWidth=2.4;ctx.lineCap="round";
    rs.forEach(r=>{const y=po_rgY(r)-6,x0=PO_RG.x+PO_RG.w-26,x1=PO_RG.tx-6,e=easeCam(clamp(u*1.4,0,1));ctx.beginPath();ctx.moveTo(x1,ty);ctx.lineTo(lerp(x1,x0,e),lerp(ty,y,e));ctx.stroke();});ctx.restore();
    const k2=0.9+0.1*spring(u);ctx.save();ctx.translate(PO_RG.tx,ty);ctx.scale(k2,k2);withA(ctx,clamp(u*2,0,1),()=>wc_tag(ctx,0,0,s,{size:30,wash:GV.gold,washA:0.42}));ctx.restore();});}
// the register on the data room's board, as the room sees it: small, its writing only the shape of writing
function po_registerRoom(ctx){gv_sheet(ctx,574,176,196,306);gv_pin(ctx,600,190,[60,110,170],0.6);gv_pin(ctx,744,190,[60,110,170],0.6);ctx.save();ctx.fillStyle=rgba(WC_DARK,0.5);ctx.fillRect(592,206,120,9);ctx.restore();
  gv_lines(ctx,592,236,160,12,19,0.9);}
// Tom's desk, from above: lighter wood, his keyboard's edge, a teal mug, a pot of pens
function po_paintTomTop(ctx){const col=[214,180,140];ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),col,{kind:"plaster",line:false,seed:481});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(29);for(let i=0;i<56;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(col,0.16+R()*0.12),0.14+R()*0.12);ctx.lineWidth=1+R()*2.2;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+5*Math.sin(x/260+i)+3*Math.sin(x/100+i*2));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(-40,-40,420,104),[226,228,234],1);for(let i=0;i<8;i++)for(let j=0;j<2;j++)wc_flat(ctx,wc_rect(-26+i*46,-28+j*40,38,32),[244,245,248],1,"key");
  wc_wash(ctx,wc_ell(1730,250,80,80,40),[74,150,150],{kind:"thing",lw:1.6,seed:483});wc_wash(ctx,wc_ell(1730,250,60,60,40),[112,76,52],{kind:"thing",line:false,seed:484});
  wc_wash(ctx,[[1806,236],[1846,230],[1850,272],[1808,266]],[74,150,150],{kind:"thing",lw:1.2,seed:485});
  wc_wash(ctx,wc_ell(190,860,62,62,36),[196,120,90],{kind:"thing",lw:1.4,seed:486});[[170,848,[230,190,60]],[196,872,[70,100,170]],[212,846,[200,70,60]]].forEach(([px,py,c])=>wc_wash(ctx,wc_ell(px,py,9,9,12),c,{kind:"thing",lw:1,seed:px}));}
// where a change request's row r writes its value (in the paper's units), for the pen
function po_crRowAt(ctx,h,rows,i){return[36+tw(ctx,rows[i].l,30,600)+18,h-38-(rows.length-1-i)*50];}
// a data product's card, pinned up: its name, and what it's made from or what it's for, line by line, with a thin gold edge
function po_prodCard(ctx,x,y,w,h,name,label,lines,a){if(a<=0.01)return;const k=0.92+0.08*spring(a);ctx.save();ctx.translate(x+w/2,y+h/2-30*(1-easeCam(clamp(a,0,1))));ctx.scale(k,k);ctx.translate(-w/2,-h/2);
  withA(ctx,clamp(a*2,0,1),()=>{wc_panel(ctx,0,0,w,h,{kind:"card",seed:471+name.length});ctx.save();ctx.strokeStyle=rgba(GV.gold,0.9);ctx.lineWidth=4;rr(ctx,-5,-5,w+10,h+10,14);ctx.stroke();ctx.restore();
    gv_pin(ctx,w/2,18,[60,110,170],0.85);wc_T(ctx,name,30,82,{w:800,size:34,col:WC_DARK});ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(30,104,w-60,2);
    wc_T(ctx,label,30,154,{w:600,size:30,col:WC_MUTED});lines.forEach((l,i)=>wc_T(ctx,l,30,204+i*46,{w:600,size:32,col:WC_INK}));});ctx.restore();}
const PO_KC=[[225,"Awards","made from:",["the student system"]],[725,"Learner records","made from:",["the student system","the learning platform","short courses"]],[1225,"Learners near an award","for:",["the near-award dashboard"]]];

/* ---------- 7 · Known by name: the record of who uses what, on Mei's desk ---------- */
// Mei's desk, from above: oak, the office's stamp on its pad of red ink, the tray of certificates' corner, her mug
function po_paintRegTop(ctx){const col=GV.oak;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),col,{kind:"plaster",line:false,seed:491});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(37);for(let i=0;i<60;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(col,0.16+R()*0.12),0.14+R()*0.12);ctx.lineWidth=1+R()*2.2;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+5*Math.sin(x/250+i)+3*Math.sin(x/90+i*2));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(-40,-40,300,250),[150,156,168],1,{lw:1.3});[[248,240,220],[176,40,34],[248,240,220]].forEach((c,i)=>wc_flat(ctx,wc_rect(-30+i*8,-30+i*8,270,200),c,1,"folder"));
  wc_part(ctx,wc_rect(1730,40,170,90),[70,72,80],1);wc_flat(ctx,wc_rect(1744,52,142,66),[176,40,34],1,"ink");
  wc_wash(ctx,wc_ell(1790,900,70,70,40),[232,228,216],{kind:"thing",lw:1.6,seed:493});wc_wash(ctx,wc_ell(1790,900,52,52,40),[112,76,52],{kind:"thing",line:false,seed:494});}
// the mailing list she used to keep, printed: its names in pencil; it greys as it's set aside (g, 0 to 1)
const PO_ML={x:640,y:120,w:640,h:800};
function po_mailList(ctx,g){const M=PO_ML,R=wc_rng(811);gv_sheet(ctx,M.x,M.y,M.w,M.h,{rot:-0.02});ctx.save();ctx.translate(M.x+M.w/2,M.y+M.h/2);ctx.rotate(-0.02);ctx.translate(-M.w/2,-M.h/2);
  wc_T(ctx,"mailing list",44,82,{w:800,size:38,col:mix(WC_DARK,[150,150,156],g)});ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(44,106,M.w-88,2);
  ctx.strokeStyle=rgba(mix(WC_PENCIL,[190,192,198],g),0.7-0.3*g);ctx.lineCap="round";ctx.lineWidth=6;for(let i=0;i<15;i++){const y=160+i*42;let cx=44;const n=2+(R()*2|0);
    for(let j=0;j<n;j++){const l=50+R()*90;ctx.beginPath();ctx.moveTo(cx,y);for(let u=0;u<=l;u+=6)ctx.lineTo(cx+u,y+1.5*Math.sin(u*0.35+i));ctx.stroke();cx+=l+16;}}
  if(g>0){ctx.fillStyle=rgba([226,226,230],0.35*g);ctx.fillRect(0,0,M.w,M.h);}ctx.restore();}
// the record of who uses what: a page, a row for each product: its card (its name and its owner), and the products that use it, in a
// line behind it as at a stall. PO_WU: the page, and each row's top; o.row1, o.card2 (0 to 1): the first row, the learner records' card;
// o.users(i): each of its three users as it comes in
const PO_WU={x:300,y:110,w:1500,h:820,rows:[230,430,640,780],cw:480,ux:860};
function po_wuCard(ctx,x,y,name,own,a){if(a<=0.01)return;withA(ctx,a,()=>{wc_panel(ctx,x,y,PO_WU.cw,150,{kind:"card",seed:501+name.length});ctx.save();ctx.strokeStyle=rgba(GV.gold,0.85);ctx.lineWidth=3;rr(ctx,x-4,y-4,PO_WU.cw+8,158,13);ctx.stroke();ctx.restore();
  wc_T(ctx,name,x+26,y+50,{w:800,size:32,col:WC_DARK});own.forEach((l,i)=>wc_T(ctx,l,x+26,y+92+i*34,{w:600,size:26,col:WC_INK}));});}
function po_wuUser(ctx,x,y,s,a){if(a<=0.01)return;const u=easeCam(clamp(a,0,1)),k=0.9+0.1*spring(a);ctx.save();ctx.translate(x+80*(1-u),y);ctx.scale(k,k);withA(ctx,clamp(a*2,0,1),()=>wc_tag(ctx,0,0,s,{size:28}));ctx.restore();}
function po_whoUses(ctx,o){o=o||{};const P_=PO_WU,a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.translate((o.dx||0),(o.dy||0));withA(ctx,a,()=>{gv_sheet(ctx,P_.x,P_.y,P_.w,P_.h,{rot:0.006});
  wc_T(ctx,"Who uses what",P_.x+50,P_.y+76,{w:800,size:40,col:WC_DARK});ctx.fillStyle=rgba(WC_MUTED,0.45);ctx.fillRect(P_.x+50,P_.y+100,P_.w-100,2);
  // the first row: Planning's product, and its one user
  const r1=clamp(o.row1==null?1:o.row1,0,1),[y1,y2,y3,y4]=P_.rows;po_wuCard(ctx,P_.x+50,y1,"Learners near an award",["owner: Clara Jensen, Planning"],r1);
  if(r1>0){withA(ctx,r1,()=>wc_T(ctx,"used by",P_.ux,y1+30,{w:600,size:28,col:WC_MUTED}));po_wuUser(ctx,P_.ux,y1+92,"the near-award dashboard",r1);}
  // the second row: the registrar's learner records, and the three that use them; until it's named, the shape of a row only
  const c2=clamp(o.card2||0,0,1);if(c2<1){ctx.save();ctx.globalAlpha*=1-c2;ctx.fillStyle=rgba(WC_MUTED,0.3);ctx.fillRect(P_.x+60,y2+40,300,9);ctx.fillRect(P_.x+60,y2+86,220,7);ctx.fillRect(P_.ux,y2+60,520,7);ctx.restore();}
  po_wuCard(ctx,P_.x+50,y2,"Learner records",["owner: Mei Tanaka,","registrar's office"],c2);if(c2>0)withA(ctx,c2,()=>wc_T(ctx,"used by",P_.ux,y2+30,{w:600,size:28,col:WC_MUTED}));
  let ux=P_.ux;["Learner wallet","Learners near an award","Tuition forgone"].forEach((s,i)=>{const w=tw(ctx,s,28,700)+40;po_wuUser(ctx,ux,y2+92,s,o.users?o.users(i):0);ux+=w+18;});
  // more rows, too small to read
  [y3,y4].forEach((y,i)=>{ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.3);ctx.fillRect(P_.x+60,y+20,280-i*40,9);ctx.fillRect(P_.x+60,y+56,200,7);ctx.fillRect(P_.ux,y+36,360+i*120,7);ctx.restore();});});ctx.restore();}

/* ---------- 8 · From draft to retired: a product's life, the film's one diagram, on the data team's board ---------- */
// Four steps painted along a strip of paper pinned across the board's top, an arrow from each to the next; under each step, its
// column, where the cards are pinned. PO_LF: the strip; each step's middle and their line; the cards' width; the rows' tops; the
// calendar's middle and scale; each step's name and colour (a draft has none: it's a dashed pencil line, as it isn't real yet)
const PO_LF={strip:[236,52,1448,164],cx:[420,780,1140,1500],cy:134,cw:340,rows:[236,462],cal:[1515,712,0.8],
  steps:[["draft",null],["active",GV.green],["deprecated",GV.grey],["retired",[204,206,212]]]};
function po_stepC(i){return wc_kept("poStep"+i,320,140,q=>{q.translate(160,70);const col=PO_LF.steps[i][1];
  if(col)wc_wash(q,wc_ell(0,0,134,46,30),col,{kind:"thing",lw:1.2,a:i===3?0.42:0.6,seed:611+i});
  else{q.save();q.setLineDash([13,10]);q.lineWidth=3.2;q.strokeStyle=rgba(WC_PENCIL,0.9);q.beginPath();q.ellipse(0,0,132,44,0,0,TAU);q.stroke();q.restore();}});}
// the strip; rev(i), 0 to 1: step i painted in, and the arrow that leads to it
function po_lifeStrip(ctx,rev){const L=PO_LF,[sx,sy,sw,sh]=L.strip;gv_sheet(ctx,sx,sy,sw,sh,{rot:-0.002});
  [[sx+28,sy+24],[sx+sw-28,sy+24]].forEach(([x,y])=>gv_pin(ctx,x,y,[60,110,170],0.9));
  L.steps.forEach(([s],i)=>{const r=clamp(rev(i),0,1);if(r<=0.01)return;const x=L.cx[i],y=L.cy;
    if(i>0){const x0=L.cx[i-1]+142,x1=x-142;wc_pencil(ctx,[[x0,y+5],[(x0+x1)/2,y-3],[x1,y+1]],clamp(r*2,0,1),{col:WC_INK,lw:4.4,a:0.8,seed:620+i});
      if(r>0.5)wc_pencil(ctx,[[x1-15,y-11],[x1,y+1],[x1-16,y+13]],clamp((r-0.5)/0.3,0,1),{col:WC_INK,lw:4.4,a:0.8,seed:630+i});}
    const k=0.88+0.12*spring(r);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(r*1.6,0,1),()=>{ctx.drawImage(po_stepC(i),-160,-70);
      wc_T(ctx,s,0,14,{w:800,size:40,align:"center",col:i===3?WC_MUTED:WC_DARK});});ctx.restore();});}
// a product's card on the board, centred on cx, its top at y: its name (a line or two) and its owner. o.draft: its edge a dashed pencil
// line, as it isn't ready (o.ready, 0 to 1, as it becomes so); o.gold: its gold edge; o.tick: its owner's tick; o.lift: its pin out
// while it moves; o.grey: greyed, as it goes; o.pale: a card with no name, its shape only; o.w, o.h: its size. Returns its height
function po_lifeCard(ctx,cx,y,o){o=o||{};const lines=o.name?[].concat(o.name):[],w=o.w||PO_LF.cw,h=o.h||(o.pale?116:30+lines.length*38+(o.owner?50:0)),a=o.a==null?1:o.a;
  if(a<=0.01)return h;const lf=clamp(o.lift||0,0,1),g=clamp(o.grey||0,0,1),rd=o.draft?clamp(o.ready||0,0,1):1,x=cx-w/2,yy=y-10*lf;
  withA(ctx,a,()=>{if(lf>0.01){ctx.save();ctx.filter="blur(12px)";ctx.fillStyle=`rgba(60,44,30,${0.2*lf})`;ctx.fillRect(x+12,yy+18,w,h);ctx.restore();}
    if(rd<1)withA(ctx,1-rd,()=>wc_panel(ctx,x,yy,w,h,{kind:"card",dashed:true,seed:641}));
    if(rd>0)withA(ctx,rd,()=>wc_panel(ctx,x,yy,w,h,{kind:"card",seed:642+lines.length}));
    const gd=clamp(o.gold||0,0,1)*(1-g);if(gd>0.01){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.9*gd);ctx.lineWidth=4;rr(ctx,x-5,yy-5,w+10,h+10,14);ctx.stroke();ctx.restore();}
    if(o.pale){ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.34);ctx.fillRect(x+26,yy+44,190,11);ctx.fillRect(x+26,yy+78,130,8);ctx.restore();}
    const tc=mix(WC_DARK,WC_MUTED,g),oc=mix(WC_INK,WC_MUTED,g);lines.forEach((l,i)=>wc_T(ctx,l,x+24,yy+52+i*38,{w:800,size:30,col:tc}));
    const oy=yy+52+lines.length*38+8;if(o.owner)wc_T(ctx,o.owner,x+24,oy,{w:600,size:26,col:oc});
    const tk=clamp(o.tick||0,0,1);if(tk>0){const tx=x+w-40;wc_pencil(ctx,[[tx-15,oy-12],[tx-4,oy],[tx+18,oy-28]],tk,{col:GV.greenInk,a:1,lw:5.5,seed:650});}
    if(g>0.01){ctx.save();ctx.fillStyle=rgba([232,232,236],0.5*g);rr(ctx,x+2,yy+2,w-4,h-4,10);ctx.fill();ctx.restore();}
    gv_pin(ctx,cx-5*lf,yy+16-16*lf,o.pinCol||[60,110,170],0.85);});return h;}
// a card's users, as round magnets with their faces, in a line under it (cx their middle, y their row); us(i): user i, 0 to 1, as they
// come; o.away(i), 0 to 1: as they go, moved by o.by, fading as they near its end. po_lifeEmpty: n dashed rings, where nobody is
function po_lifeUsers(ctx,cx,y,ids,us,o){o=o||{};const n=ids.length,gap=58,x0=cx-(n-1)*gap/2;
  ids.forEach((id,i)=>{const p=clamp(us(i),0,1),aw=o.away?clamp(o.away(i),0,1):0;if(p<=0.01||aw>=0.99)return;const e=easeCam(aw),k=0.8+0.2*spring(p),
      by=o.by||[0,0],x=x0+i*gap+by[0]*e,yy=y+by[1]*e-18*(1-easeCam(p));
    ctx.save();ctx.translate(x,yy);ctx.scale(k,k);withA(ctx,clamp(p*2,0,1)*(1-clamp((aw-0.45)/0.4,0,1)),()=>{ctx.save();ctx.filter="blur(5px)";ctx.fillStyle="rgba(60,44,30,0.22)";ctx.beginPath();ctx.arc(3,5,24,0,TAU);ctx.fill();ctx.restore();
      po_face(ctx,id,0,0,24,{expr:"calm",bg:i%2?[214,232,242]:[246,232,196],ring:WC_PENCIL,ringA:0.8,lw:2.2});});ctx.restore();});}
function po_lifeEmpty(ctx,cx,y,n,a){if(a<=0.01)return;const gap=58,x0=cx-(n-1)*gap/2;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([7,6]);ctx.lineWidth=2.8;ctx.strokeStyle=rgba(WC_PENCIL,0.9);
  for(let i=0;i<n;i++){ctx.beginPath();ctx.arc(x0+i*gap,y,23,0,TAU);ctx.stroke();}ctx.restore();});}
// a date tag on a string, hanging from (x, y), swinging a little as it comes (a, 0 to 1); its text's middle sits under the knot
function po_dateTag(ctx,x,y,s,a,o){o=o||{};if(a<=0.01)return;const sw=Math.sin(a*9)*0.12*(1-clamp(a,0,1))+(o.rot||0.03),len=o.len||34;ctx.save();ctx.translate(x,y);ctx.rotate(sw);
  withA(ctx,clamp(a*2.2,0,1),()=>{ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,len);ctx.stroke();
    const tw_=tw(ctx,s,o.size||28,600)+44,h=(o.size||28)+24;wc_panel(ctx,-tw_/2,len,tw_,h,{kind:"tag",wash:o.wash||GV.grey,washA:o.washA||0.22,seed:660+s.length});
    ctx.fillStyle=rgba(WC_PENCIL,0.9);ctx.beginPath();ctx.arc(0,len+9,3.2,0,TAU);ctx.fill();wc_T(ctx,s,0,len+h/2+(o.size||28)*0.36+2,{w:600,size:o.size||28,align:"center",col:o.col||WC_INK});});ctx.restore();}
// a small slip, one line: an edition of a table the product holds (cx its middle, y its top); o.ta: its words' opacity
function po_slip(ctx,cx,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=o.w||324,h=60,lf=clamp(o.lift||0,0,1),g=clamp(o.grey||0,0,1),x=cx-w/2,yy=y-8*lf;
  withA(ctx,a,()=>{if(lf>0.01){ctx.save();ctx.filter="blur(10px)";ctx.fillStyle=`rgba(60,44,30,${0.2*lf})`;ctx.fillRect(x+10,yy+14,w,h);ctx.restore();}
    wc_panel(ctx,x,yy,w,h,{kind:"card",seed:670+s.length});if(o.lit>0.01)withA(ctx,clamp(o.lit,0,1)*(1-g),()=>{ctx.save();ctx.strokeStyle=rgba(GV.gold,0.9);ctx.lineWidth=4;rr(ctx,x-5,yy-5,w+10,h+10,12);ctx.stroke();ctx.restore();});
    withA(ctx,o.ta==null?1:o.ta,()=>wc_T(ctx,s,x+18,yy+44,{w:600,size:28,col:mix(WC_DARK,WC_MUTED,g)}));if(g>0.01){ctx.save();ctx.fillStyle=rgba([232,232,236],0.5*g);rr(ctx,x+2,yy+2,w-4,h-4,8);ctx.fill();ctx.restore();}
    if(o.pin!==false)gv_pin(ctx,cx-4*lf,yy+10-14*lf,o.pinCol||[60,110,170],0.7);});}
// the registrar's learner records' card, opening (op, 0 to 1) to show what it holds: the two editions of its credentials, edition 1
// drawn only while it's still inside (o.out: it has left); each edition's words come in once they have cleared the card, so none shows half hidden under it
function po_holds(ctx,cx,y,op,o){o=o||{};const w=PO_LF.cw,top=po_lifeCard(ctx,cx,y,{name:"Learner records",owner:"owner: Mei Tanaka",gold:1,a:o.a}),u=easeCam(clamp(op,0,1));
  if(u<=0.01)return;const fh=PO_FOLD,fy=y+top+6,f0=fy-fh*(1-u),em=dy=>clamp((f0+dy+28-fy)/16,0,1);withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.beginPath();ctx.rect(cx-w/2-12,fy-4,w+24,fh*u+12);ctx.clip();
    wc_panel(ctx,cx-w/2,f0,w,fh,{kind:"card",fill:[244,240,230],seed:681});ctx.save();ctx.strokeStyle=rgba(GV.gold,0.6);ctx.lineWidth=3;rr(ctx,cx-w/2-4,f0-4,w+8,fh+8,12);ctx.stroke();ctx.restore();
    po_slip(ctx,cx,f0+14,"credentials · edition 2",{pin:false,ta:em(14)});if(!o.out)po_slip(ctx,cx,f0+82,"credentials · edition 1",{pin:false,ta:em(82)});
    else{ctx.save();ctx.setLineDash([8,8]);ctx.lineWidth=2;ctx.strokeStyle=rgba(WC_PENCIL,0.45);rr(ctx,cx-162,f0+82,324,60,8);ctx.stroke();ctx.restore();}ctx.restore();});}
const PO_FOLD=156;
// the board's calendar, a page a month, pinned in the retired column (film 4's, as in chapter 2, smaller)
function po_lifeCal(ctx,cur,next,flip,a){if(a<=0.01)return;const [x,y,k]=PO_LF.cal;ctx.save();ctx.translate(x,y-24*(1-easeCam(a)));ctx.scale(k,k);withA(ctx,a,()=>{po_calendar(ctx,0,0,cur,next,flip);gv_pin(ctx,0,-166,GV.red,1.1);});ctx.restore();}
const PO_LCAL=[["October 2026","28"],["November 2026","1"],["December 2026","1"],["January 2027","1"],["February 2027","1"],["March 2027","31"]];

/* ---------- 9 · Found, and trusted: the catalogue's six products, like stalls along a street ---------- */
// The six products, each with its owner, the colour of its awning, and the people who use it (their faces, as at a stall: Anil first
// at Planning's). Each card wears a striped awning, as a stall along a street does
const PO_SIX=[["Learner records","Mei Tanaka",[104,128,170],["tom","linh","sam"]],["Awards","Mei Tanaka",[176,104,88],["rosa","ben"]],
  ["Learners near an award","Clara Jensen",[204,150,64],["anil","ana","david"]],["Learner wallet","Wallet app team",[110,146,104],["minh","leila"]],
  ["Tuition forgone","Finance",[138,112,150],["marta","jun"]],["Short-course follow-ups","Learning team",[86,146,142],["noor","rosa"]]];
// an awning w wide, kept: stripes of its colour and a paler one, the edge scalloped, a soft shadow under it
function po_awningC(col,w){return wc_kept("poAwn"+col.join(",")+"|"+w,w+40,90,q=>{q.translate(20,14);const sw=w/Math.round(w/34),n=Math.round(w/sw),pale=mix(col,[255,250,240],0.62);
  q.save();q.filter="blur(5px)";q.fillStyle="rgba(60,44,30,0.18)";q.fillRect(4,30,w-8,22);q.restore();
  for(let k=0;k<n;k++){const x0=k*sw,P=[[x0,0],[x0+sw,0],[x0+sw,34]];for(let j=1;j<12;j++){const a=j/12*Math.PI;P.push([x0+sw/2+sw/2*Math.cos(a),34+sw/2*Math.sin(a)*0.8]);}P.push([x0,34]);
    wc_flat(q,P,k%2?pale:col,1,"awning");}
  wc_ink(q,[[0,0],[w,0]],false,2,WC_PENCIL,0.7,61,0.6);});}
// a stall's card (top left x,y, w by h): its awning, its name (as large as fits, 28 px or more), its owner. o.lit: a gold ring round it;
// o.own: its owner's name washed gold; o.a; o.size: the name's largest size; o.deco: its words only a picture (under an open card)
function po_stall(ctx,i,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const [name,own,col]=PO_SIX[i],sz=o.size||32,ns=Math.max(28,Math.min(sz,sz*(w-40)/tw(ctx,name,sz,700)));
  withA(ctx,a,()=>{wc_panel(ctx,x,y,w,h,{kind:"card",seed:700+i});ctx.drawImage(po_awningC(col,w+12),x-26,y-20);
    const lit=clamp(o.lit||0,0,1);if(lit>0.01){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95*lit);ctx.lineWidth=5;rr(ctx,x-6,y-6,w+12,h+12,14);ctx.stroke();ctx.restore();}
    const d=o.deco?1:0;wc_T(ctx,name,x+20,y+h*0.5+8,{w:700,size:ns,col:WC_DARK,deco:d});const oy=y+h*0.5+8+(o.gap||48),os=o.ownSize||28,ow=tw(ctx,"owner: "+own,os,600);
    const g=clamp(o.own||0,0,1);if(g>0.01)wc_panel(ctx,x+12,oy-os*0.95,Math.round((ow+16)*easeCam(g))+2,Math.round(os*1.4),{kind:"tag",wash:GV.gold,washA:0.42,seed:720+i});
    wc_T(ctx,"owner: ",x+20,oy,{w:600,size:os,col:WC_MUTED,deco:d});wc_T(ctx,own,x+20+tw(ctx,"owner: ",os,600),oy,{w:600,size:os,col:WC_INK,deco:d});});}
// the catalogue on Anil's screen (the screen close-up, GV_SC): its plain page, the six cards in two rows of three; o.lit(i), o.dim: the
// others dimmed while one is open; o.open (0 to 1): Planning's card opened, larger, over the page, its rows as far as o.rows(k)
const PO_CG={x:370,y:176,w:372,h:228,gx:32,gy:42};
const po_cgRect=i=>{const G=PO_CG;return[G.x+(i%3)*(G.w+G.gx),G.y+Math.floor(i/3)*(G.h+G.gy),G.w,G.h];};
function po_catPage(ctx,o){o=o||{};const [sx,sy,sw,sh]=GV_SC;gv_screen(ctx,sx,sy,sw,sh,"Catalogue of data products",null,{barH:62,titleSize:34,bar:[84,112,96]});
  const op=clamp(o.open||0,0,1);PO_SIX.forEach((_,i)=>{const [x,y,w,h]=po_cgRect(i);po_stall(ctx,i,x,y,w,h,{size:30,lit:o.lit?o.lit(i):0,gap:46,deco:op>0.3});});if(op<=0.01)return;const u=easeCam(op),[gx,gy,gw,gh]=po_cgRect(2),R=[530,226,860,410],r=[lerp(gx,R[0],u),lerp(gy,R[1],u),lerp(gw,R[2],u),lerp(gh,R[3],u)];
  ctx.save();ctx.fillStyle=rgba([238,240,244],0.72*u);ctx.fillRect(sx,sy+62,sw,sh-62);ctx.restore();
  withA(ctx,clamp(op*3,0,1),()=>{ctx.save();ctx.filter="blur(14px)";ctx.fillStyle=`rgba(40,40,50,${0.22*u})`;ctx.fillRect(r[0]+10,r[1]+18,r[2],r[3]);ctx.restore();
    wc_panel(ctx,r[0],r[1],r[2],r[3],{kind:"card",seed:731});ctx.drawImage(po_awningC(PO_SIX[2][2],Math.round(r[2])+12),r[0]-26,r[1]-20);
    ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=5;rr(ctx,r[0]-6,r[1]-6,r[2]+12,r[3]+12,14);ctx.stroke();ctx.restore();
    if(u>0.92)withA(ctx,clamp((u-0.92)/0.08,0,1),()=>{const [x,y]=R;wc_T(ctx,"Learners near an award",x+44,y+122,{w:700,size:40,col:WC_DARK});ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(x+44,y+146,R[2]-88,2);
      [["promise:","ready by 7 a.m. on census day"],["owner:","Clara Jensen"],["ask:","Planning's data desk"]].forEach(([l,v],k)=>{const p=clamp(o.rows?o.rows(k):1,0,1);if(p<=0.01)return;const ry=y+220+k*74;
        withA(ctx,p,()=>{wc_T(ctx,l,x+44,ry,{w:600,size:30,col:WC_MUTED});wc_T(ctx,v,x+196+14*(1-easeCam(p)),ry,{w:700,size:34,col:WC_DARK});});});});});}
// a pointer on the screen, its tip at (x,y); a click (k, 0 to 1) rings out from its tip
function po_cursor(ctx,x,y,a,k){if(a<=0.01)return;withA(ctx,a,()=>{if(k>0&&k<1){ctx.save();ctx.strokeStyle=rgba(GV.goldInk,0.6*(1-k));ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,10+30*k,0,TAU);ctx.stroke();ctx.restore();}
  ctx.save();ctx.translate(x,y);ctx.scale(1.35,1.35);ctx.beginPath();[[0,0],[0,30],[8,23],[14,37],[20,34],[14,21],[24,21]].forEach(([px,py],j)=>j?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();
  ctx.fillStyle="rgba(255,255,255,0.97)";ctx.fill();ctx.lineJoin="round";ctx.lineWidth=2.2;ctx.strokeStyle=rgba(WC_DARK,0.9);ctx.stroke();ctx.restore();});}
// the same page, small, on Anil's screen in his office (GV_FX.screen): the shape of the page only, too small to read
function po_catSmall(ctx){const [x,y,w,h]=GV_FX.screen;gv_screen(ctx,x,y,w,h,null,null,{barH:30,bar:[84,112,96]});ctx.save();ctx.fillStyle="rgba(255,255,255,0.8)";ctx.fillRect(x+14,y+11,170,8);ctx.restore();
  for(let i=0;i<6;i++){const cw=(w-60)/3,ch=(h-90)/2,cx=x+18+(i%3)*(cw+12),cy=y+48+Math.floor(i/3)*(ch+14);ctx.save();ctx.fillStyle=rgba(WC_CARD,1);ctx.fillRect(cx,cy,cw,ch);
    ctx.fillStyle=rgba(PO_SIX[i][2],0.85);ctx.fillRect(cx,cy,cw,12);ctx.fillStyle=rgba(WC_MUTED,0.45);ctx.fillRect(cx+10,cy+ch*0.5,cw*0.6,6);ctx.fillRect(cx+10,cy+ch*0.5+16,cw*0.4,5);ctx.restore();}}
// the six again, on plain paper, as stalls along a street; their users come up to them, as to a stall (o.users(i,j), 0 to 1); o.own(i)
const PO_SX={cx:[420,960,1500],y:[92,430],w:470,h:200};
function po_sixStalls(ctx,o){o=o||{};const S=PO_SX;PO_SIX.forEach(([,,,ids],i)=>{const cx=S.cx[i%3],y=S.y[Math.floor(i/3)];
  po_stall(ctx,i,cx-S.w/2,y,S.w,S.h,{size:34,own:o.own?o.own(i):0,lit:o.own?o.own(i):0,gap:50,ownSize:30});
  const n=ids.length,gap=68,x0=cx-(n-1)*gap/2,fy=y+S.h+46;ids.forEach((id,j)=>{const p=clamp(o.users?o.users(i,j):1,0,1);if(p<=0.01)return;const e=easeCam(p),k=0.85+0.15*spring(p);
    ctx.save();ctx.translate(x0+j*gap,fy+40*(1-e));ctx.scale(k,k);withA(ctx,clamp(p*2,0,1),()=>{ctx.save();ctx.filter="blur(5px)";ctx.fillStyle="rgba(60,44,30,0.2)";ctx.beginPath();ctx.arc(3,6,28,0,TAU);ctx.fill();ctx.restore();
      po_face(ctx,id,0,0,28,{expr:"smile",bg:j%2?[214,232,242]:[246,232,196],ring:id==="anil"?GV.goldInk:WC_PENCIL,ringA:0.85,lw:id==="anil"?3.4:2.2});});ctx.restore();});});}

const WC_PLACES={st1520:c=>po_paintStreet(c,"1520"),st1600:c=>po_paintStreet(c,"1600"),gate:po_paintGate,hallIn:po_paintHallIn,hallInFront:po_paintHallInFront,clothClose:po_paintClothClose,clothFront:po_paintClothFront,plain:po_paintPlain,air:po_paintAir,airShops:po_paintAirShops,airCrowd:po_paintAirCrowd,airHall:po_paintAirHall,airTrade0:c=>po_paintAirTrade(c,0),airTrade1:c=>po_paintAirTrade(c,1),airTrade2:c=>po_paintAirTrade(c,2),office:gv_paintOffice,faculty:gv_paintFaculty,facDesk:po_paintFacDesk,facTop:po_paintFacTop,tomTop:po_paintTomTop,regTop:po_paintRegTop,corridor:po_paintCorridor,planTable:po_paintPlanTable,planTop:po_paintPlanTop,data:gv_paintData,noor:gv_paintNoor,planning:gv_paintPlanning,floor:gv_paintFloor,
  regClose:gv_paintRegistrarClose,regDesk:gv_paintRegistrarDesk,screenFac:c=>gv_paintScreenDesk(c,GV_ROOM.fac),desk:gv_paintDesk,boardData:c=>gv_paintBoardClose(c,GV_ROOM.data)};
