/* ===== A product with an owner: the university, today =====
   The university's own papers, drawn on the series' rooms (rooms.js), and the film's own places: Anil's desk from above, and the
   corridor's wall across from the offices. Paper is painted once and kept; its words are drawn every frame, so they stay sharp when
   the camera moves in. Every word is at least 28 px as seen, or drawn as pencil bars where only the shape of writing matters. */

// a name card, as the series introduces people: the name, then the role; it rises a little as it comes
function po_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:3});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}

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

const WC_PLACES={st1520:c=>po_paintStreet(c,"1520"),st1600:c=>po_paintStreet(c,"1600"),gate:po_paintGate,hallIn:po_paintHallIn,hallInFront:po_paintHallInFront,clothClose:po_paintClothClose,clothFront:po_paintClothFront,plain:po_paintPlain,air:po_paintAir,airShops:po_paintAirShops,airCrowd:po_paintAirCrowd,airHall:po_paintAirHall,airTrade0:c=>po_paintAirTrade(c,0),airTrade1:c=>po_paintAirTrade(c,1),airTrade2:c=>po_paintAirTrade(c,2),office:gv_paintOffice,faculty:gv_paintFaculty,facDesk:po_paintFacDesk,facTop:po_paintFacTop,corridor:po_paintCorridor,planTable:po_paintPlanTable,planTop:po_paintPlanTop,data:gv_paintData,noor:gv_paintNoor,planning:gv_paintPlanning,floor:gv_paintFloor,
  regClose:gv_paintRegistrarClose,regDesk:gv_paintRegistrarDesk,screenFac:c=>gv_paintScreenDesk(c,GV_ROOM.fac),meeting:gv_paintMeeting,desk:gv_paintDesk,boardData:c=>gv_paintBoardClose(c,GV_ROOM.data),platform:gv_paintPlatform};
