/* ===== Who does what, end to end: Noor's map, close =====
   The board on Noor's wall drawn large, three of its bands: business, information, application, in the colours The map before the data
   gives them. In the business band, the service and its six steps, a role above each of the first four, and who fills each role today;
   in the information band, what each step reads and writes; in the application band, the map itself, the glossary, and the copies that
   follow it. The board is painted once (the place eeMap); the cards on it are drawn every frame, as they go up. Its words are sized for
   the shots that read them, closer in: at the camera's zoom they're 28 px or more. Every name starts with ee_ or EE. */

const EE_MP={x:100,y:36,w:1720,h:848,bands:[[52,462,2],[474,664,3],[676,868,4]],lab:136,cw:240,
  svc:[180,66,1520,68],role:[160,60],chip:[228,44],team:[280,44],step:[362,80,200],info:[492,156],app:[694,160]};
const ee_mx=i=>300+i*256;
const EE_STEPS=["ask","draft","check","decide","publish","follow"];
const EE_ROLES=["the one who asks","the steward","the reviewer","the owner"];
const EE_ACTORS=["Clara","Mei",null,"the registrar"];
const EE_INFO=[["the request","term, why,","who it affects"],["the draft","definition,","example, owner,","status"],["the agent's note","what's missing,","what it touches"],
  ["the decision","who, when, why"],["the term"],["its copies","where each","came from"]];
const EE_APP={4:["the map"],5:["the glossary"]};
const EE_COPIES=[["the data team's","copy"],["the dashboards"],["the assistant that","answers questions","in plain words"]];
const ee_bandCol=i=>GV_LAYERS[i][1];
// the board: paper, its frame, the three bands and their names, written up the left side; the board goes on above and below the frame,
// with the edge of the strategy band over the business band and of the technology band under the application band, so it reads as
// the middle of the map film 1 of 3 drew, close
function ee_paintMap(ctx){const M=EE_MP;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.noor,{kind:"plaster",line:false,seed:107});
  gv_lightGlow(ctx,960,-80,900);wc_part(ctx,wc_rect(M.x-14,-120,M.w+28,H+240),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(M.x,-100,M.w,H+200),[250,250,247],1,"board");
  [[-160,40,1],...M.bands,[880,1140,5]].forEach(([y0,y1,li],k)=>wc_wash(ctx,wc_rect(M.x+12,y0,M.w-24,y1-y0),wc_lit(ee_bandCol(li),0.66),{kind:"swatch",seed:140+k,a:0.8}));}
function ee_mapLabels(ctx){const M=EE_MP;M.bands.forEach(([y0,y1,li])=>{ctx.save();ctx.translate(M.lab,(y0+y1)/2);ctx.rotate(-Math.PI/2);
  wc_T(ctx,GV_LAYERS[li][0],0,10,{w:700,size:28,align:"center",col:wc_dim(ee_bandCol(li),0.66)});ctx.restore();});}
// a card springing onto the board: k its scale as it lands, a its opacity
function ee_land(ctx,u,cx,cy,fn){if(u<=0.01)return;const k=0.86+0.14*spring(clamp(u,0,1));ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);ctx.translate(-cx,-cy);withA(ctx,clamp(u*2.2,0,1),fn);ctx.restore();}
// a soft gold glow behind a card (a, 0 to 1)
function ee_glow(ctx,x,y,w,h,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=clamp(a,0,1);const r=Math.max(w,h)*0.75,g=ctx.createRadialGradient(x+w/2,y+h/2,Math.min(w,h)*0.3,x+w/2,y+h/2,r);
  g.addColorStop(0,rgba(wc_lit(GV.gold,0.3),0.95));g.addColorStop(1,rgba(wc_lit(GV.gold,0.3),0));ctx.fillStyle=g;ctx.fillRect(x+w/2-r,y+h/2-r,2*r,2*r);ctx.restore();}
// an actor's chip, hung under a role card, centred on cx: a name; the agent's is dashed cyan with its star (t turns it)
// (o.lift, 0 to 1: it lifts off the card toward us, its shadow left on the card; o.textA: its words' strength)
function ee_chip(ctx,cx,y,s,o){o=o||{};const sz=o.size||24,agent=o.agent,w=Math.round(tw(ctx,s,sz,700)+(agent?70:40)),h=o.h||44,x=cx-w/2,L=clamp(o.lift||0,0,1);
  if(L>0.01){ctx.save();ctx.fillStyle=rgba([40,30,20],0.22*L);rr(ctx,x+5*L,y+14*L,w,h,h/2);ctx.fill();ctx.restore();}
  ctx.save();ctx.translate(cx,y+h/2-12*L);ctx.scale(1+0.08*L,1+0.08*L);ctx.translate(-cx,-(y+h/2));
  wc_panel(ctx,x,y,w,h,{kind:"chip",dashed:!!agent,role:agent?WC_SIDE.tech:WC_SIDE.biz,seed:o.seed||Math.round(cx)});if(agent)ee_star(ctx,x+28,y+h/2,0.62,o.t||0,1);
  withA(ctx,o.textA==null?1:o.textA,()=>wc_T(ctx,s,x+(agent?52:20),y+h/2+sz*0.36,{w:700,size:sz,col:agent?[26,80,126]:WC_DARK}));ctx.restore();return w;}
// Noor's map, close. st: service (0 to 1); step(i); role(i), roleLit (a number: all four glow; or roleLit(i)); chip(i) and team (who fills
// each role), chipLit(i); swap (0 to 1: the steward's chip turns, like a card, from Mei to the colleague who fills her role while she's away);
// lift (0 to 1: the chips lift off their cards, and settle); appLine(i), appLit(i) (publish and follow, done by the map and the glossary: a dotted line
// down from the step to its card, and both glow); rights, may, mayNot, rightsOut (the agent's rights, on a card hung from its chip, and
// folded away); owner (the owner's card glows gold);
// info(i) (what step i reads and writes, dropped into the information band; the definition, pinned in ch. 3, is the term's card),
// infoLit(i), flow (a light along the steps, 0 to 1), house(i) (a home mark at the card's corner); app(i) (the map and the glossary); term,
// termHead (the definition's card named "the term"), termLit, gold, copy(i), copyLit(j) (the definition pinned once, the gold line from it
// to the glossary and on to each copy, and how much each glows); svcLit, stepLit(i) (the service's glow, each step's); glossLit; lit
// (everything gold); t (the agent's star turns)
function ee_map(ctx,st){const M=EE_MP,f=(fn,i)=>fn==null?0:typeof fn==="function"?fn(i):fn,t=st.t||0,lit=clamp(st.lit||0,0,1),biz=ee_bandCol(2),inf=ee_bandCol(3),app=ee_bandCol(4),
    rg=f(st.rights),ro=easeCam(clamp(st.rightsOut||0,0,1)),cover=rg>0.01?clamp(rg*2.2,0,1)*(1-ro):0;
  ee_mapLabels(ctx);
  // the service, across the top of the business band
  const [sx,sy,sw,sh]=M.svc;ee_land(ctx,f(st.service),sx+sw/2,sy+sh/2,()=>{ee_glow(ctx,sx,sy,sw,sh,Math.max(lit*0.8,f(st.svcLit)));wc_panel(ctx,sx,sy,sw,sh,{kind:"pill",wash:biz,washA:0.55,seed:151});
    wc_T(ctx,"Define or change a term",sx+sw/2,sy+sh/2+12,{w:800,size:34,align:"center",col:WC_DARK});});
  // the steps, joined by arrows
  const [ty,th,tw_]=M.step;for(let i=0;i<6;i++){const u=f(st.step,i);if(u<=0.01)continue;const cx=ee_mx(i);
    if(i<5&&f(st.step,i+1)>0.3){ctx.save();ctx.strokeStyle=rgba(wc_dim(biz,0.55),0.8);ctx.lineWidth=3;ctx.lineCap="round";const ax=cx+tw_/2+10,bx=ee_mx(i+1)-tw_/2-10,ay=ty+th/2;
      ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,ay);ctx.moveTo(bx-12,ay-9);ctx.lineTo(bx,ay);ctx.lineTo(bx-12,ay+9);ctx.stroke();ctx.restore();}
    ee_land(ctx,u,cx,ty+th/2,()=>{ee_glow(ctx,cx-tw_/2,ty,tw_,th,Math.max(lit*0.8,f(st.stepLit,i),i>=4?f(st.appLit,i):0));wc_panel(ctx,cx-tw_/2,ty,tw_,th,{kind:"card",wash:biz,washA:0.62,seed:161+i});
      withA(ctx,1-(i===1||i===2?cover:0),()=>wc_T(ctx,EE_STEPS[i],cx,ty+th/2+11,{w:800,size:32,align:"center",col:WC_DARK}));});}
  // the flow: a light that runs along the steps, each in turn
  const fl=st.flow||0;if(fl>0.01&&fl<0.999){const p=fl*5,i=Math.floor(p),u=p-i,x=lerp(ee_mx(i),ee_mx(Math.min(5,i+1)),easeCam(u));ctx.save();ctx.globalCompositeOperation="screen";
    wc_glowAt(ctx,x,ty+th/2,120,[255,226,140],0.7);ctx.restore();}
  // the roles over the first four steps, a dotted line down to each step, and who fills each
  const [ry,rh]=M.role;for(let i=0;i<4;i++){const u=f(st.role,i);if(u<=0.01)continue;const cx=ee_mx(i),og=i===3?clamp(st.owner||0,0,1):0;
    withA(ctx,clamp(u*2,0,1),()=>{ctx.save();ctx.setLineDash([4,7]);ctx.strokeStyle=rgba(WC_PENCIL,0.55);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,ry+rh);ctx.lineTo(cx,ty);ctx.stroke();ctx.restore();});
    ee_land(ctx,u,cx,ry+rh/2,()=>{ee_glow(ctx,cx-M.cw/2,ry,M.cw,rh,Math.max(og,lit*0.8,f(st.roleLit,i)*0.8));wc_panel(ctx,cx-M.cw/2,ry,M.cw,rh,{kind:"card",wash:og>0.5?GV.gold:biz,washA:og>0.5?0.55:0.35,seed:171+i});
      wc_T(ctx,EE_ROLES[i],cx,ry+rh/2+9,{w:700,size:26,align:"center",col:og>0.5?GV.goldInk:WC_DARK});});}
  const lf=k=>Math.sin(clamp((st.lift||0)*1.15-k*0.05,0,1)*Math.PI);
  for(let i=0;i<4;i++){const u=f(st.chip,i);if(u<=0.01)continue;const cx=ee_mx(i),cy=M.chip[0],sw=i===1?clamp(st.swap||0,0,1):0,cl=f(st.chipLit,i);
    ee_land(ctx,u,cx,cy+22,()=>{if(cl>0.01)ee_glow(ctx,cx-90,cy-6,180,56,cl);if(sw<=0.001){ee_chip(ctx,cx,cy,i===2?"the agent":EE_ACTORS[i],{agent:i===2,t,size:25,lift:lf(i),seed:181+i});return;}
      const fl=Math.abs(Math.cos(Math.PI*sw));ctx.save();ctx.translate(0,cy+22);ctx.scale(1,Math.max(0.02,fl));ctx.translate(0,-(cy+22));
      ee_chip(ctx,cx,cy,sw<0.5?EE_ACTORS[1]:"Iris Bello",{size:25,seed:181+i,textA:clamp((fl-0.86)/0.14,0,1)});ctx.restore();});}
  const tm=f(st.team);if(tm>0.01){const cx=ee_mx(3),cy=M.team[0];ee_land(ctx,tm,cx,cy+22,()=>ee_chip(ctx,cx,cy,"registrar's office",{size:25,lift:lf(3),seed:189}));}
  // the agent's rights, on a card hung by a dashed thread from its chip, out to the left, clear of the owner's chips; folded away into
  // the chip again (rightsOut). may: its first line (u, 0 to 1), then its second; mayNot
  if(rg>0.01&&ro<0.99){const px=ee_mx(2),x=372,y=300,w=540,h=212,top=M.chip[0]+44;
    ctx.save();ctx.translate(px,top);ctx.scale(1-0.3*ro,1-0.3*ro);ctx.translate(-px,-top);withA(ctx,1-ro,()=>{
      withA(ctx,clamp(rg*2,0,1),()=>{ctx.save();ctx.setLineDash([7,7]);ctx.strokeStyle=rgba([26,100,156],0.8);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(px,top);ctx.lineTo(px,y+12);ctx.stroke();ctx.restore();});
      ee_land(ctx,rg,px,y,()=>{ctx.fillStyle="rgba(40,60,90,0.16)";ctx.fillRect(x+8,y+10,w,h);ctx.fillStyle=rgba([250,250,247],1);rr(ctx,x+3,y+3,w-6,h-6,12);ctx.fill();
        wc_panel(ctx,x,y,w,h,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:191});gv_pin(ctx,px,y+12,[26,100,156],0.9);ee_star(ctx,x+30,y+38,0.6,t,1);
        wc_T(ctx,"the agent · its rights",x+56,y+48,{w:800,size:24,col:WC_DARK});ctx.fillStyle=rgba(WC_PENCIL,0.35);ctx.fillRect(x+24,y+64,w-48,2);
        const m=st.may||0,m1=clamp(typeof m==="function"?m(0):m,0,1),m2=clamp(typeof m==="function"?m(1):m,0,1),n=clamp(st.mayNot||0,0,1);
        if(m1>0.01)withA(ctx,m1,()=>wc_T(ctx,"may: read the glossary and the record",x+24,y+100,{w:600,size:22,col:WC_INK}));
        if(m2>0.01)withA(ctx,m2,()=>wc_T(ctx,"of who uses what · write its note",x+24,y+130,{w:600,size:22,col:WC_INK}));
        if(n>0.01)withA(ctx,n,()=>wc_T(ctx,"may not: decide · change the glossary",x+24,y+178,{w:700,size:22,col:GV.redInk}));});});ctx.restore();}
  // publish and follow are done by the map and the glossary: a dotted line from each step down to its card in the application band
  [4,5].forEach(i=>{const u=clamp(f(st.appLine,i),0,1);if(u<=0.01)return;const cx=ee_mx(i),y0=ty+th,y1=M.app[0]+30;ctx.save();ctx.setLineDash([4,7]);
    ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(cx,y0);ctx.lineTo(cx,lerp(y0,y1,easeCam(u)));ctx.stroke();ctx.restore();});
  // the information band: what each step reads and writes, dropped in from its step, joined to it by a thin line; a home mark at its corner
  const [iy,ih]=M.info;for(let i=0;i<6;i++){const u=i===4?0:f(st.info,i);if(u<=0.01)continue;const cx=ee_mx(i),L=EE_INFO[i],drop=(1-easeCam(clamp(u*1.4,0,1)))*-70;
    withA(ctx,clamp(u*2,0,1),()=>{ctx.save();ctx.strokeStyle=rgba(wc_dim(inf,0.5),0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,ty+th);ctx.lineTo(cx,iy+drop);ctx.stroke();ctx.restore();});
    ee_land(ctx,u,cx,iy+ih/2,()=>{ctx.save();ctx.translate(0,drop);ee_glow(ctx,cx-M.cw/2,iy,M.cw,ih,Math.max(lit*0.8,f(st.infoLit,i)));
      wc_panel(ctx,cx-M.cw/2,iy,M.cw,ih,{kind:"card",wash:inf,washA:0.4,seed:201+i});wc_flat(ctx,wc_rect(cx-M.cw/2+6,iy+6,M.cw-12,10),wc_dim(inf,0.15),0.9,"band");
      wc_T(ctx,L[0],cx,iy+48,{w:800,size:26,align:"center",col:WC_DARK});L.slice(1).forEach((s,j)=>wc_T(ctx,s,cx,iy+84+j*30,{w:600,size:25,align:"center",col:WC_INK}));
      const hs=f(st.house,i);if(hs>0.01)ee_house(ctx,cx+M.cw/2-24,iy+17,hs,0.72);ctx.restore();});}
  // the definition, pinned once in the information band, over publish; the gold line from it to the glossary, and on to each copy
  const tr=f(st.term);if(tr>0.01){const cx=ee_mx(4),hd=easeCam(clamp(st.termHead||0,0,1));ee_land(ctx,tr,cx,iy+ih/2,()=>{
    ee_glow(ctx,cx-M.cw/2,iy,M.cw,ih,Math.max(st.termLit==null?0.9:st.termLit,lit*0.8,f(st.infoLit,4)));wc_panel(ctx,cx-M.cw/2,iy,M.cw,ih,{kind:"card",wash:GV.gold,washA:0.45,seed:221});
    gv_pin(ctx,cx,iy+14,GV.red,1);if(hd>0.01)withA(ctx,hd,()=>wc_T(ctx,"the term",cx,iy+48,{w:800,size:26,align:"center",col:WC_DARK}));
    wc_T(ctx,"completion",cx,lerp(iy+66,iy+90,hd),{w:lerp(800,600,hd),size:lerp(30,27,hd),align:"center",col:WC_DARK});if(hd<0.99)gv_lines(ctx,cx-90,iy+92+hd*30,180,3,18,0.9*(1-hd));
    const hs=f(st.house,4);if(hs>0.01)ee_house(ctx,cx+M.cw/2-24,iy+17,hs,0.72);});}
  const gd=clamp(st.gold||0,0,1);if(gd>0.01){const pts=ee_goldPath();ee_goldLine(ctx,pts,gd);}
  // the application band: the map and the glossary, under publish and follow, a dotted line up to each
  const [ay,ah]=M.app;[4,5].forEach(i=>{const u=f(st.app,i);if(u<=0.01)return;const cx=ee_mx(i),gl=Math.max(i===5?f(st.glossLit):0,lit*0.8,f(st.appLit,i));
    ee_land(ctx,u,cx,ay+ah/2,()=>{ee_glow(ctx,cx-M.cw/2,ay+30,M.cw,ah-60,gl);wc_panel(ctx,cx-M.cw/2,ay+30,M.cw,ah-60,{kind:"card",wash:app,washA:0.5,seed:211+i});
      wc_T(ctx,EE_APP[i][0],cx,ay+ah/2+10,{w:800,size:28,align:"center",col:WC_DARK});});});
  EE_COPIES.forEach((L,j)=>{const u=f(st.copy,j);if(u<=0.01)return;const cx=ee_mx(2-j),y0=ay+8,h=ah-30;ee_land(ctx,u,cx,y0+h/2,()=>{ee_glow(ctx,cx-M.cw/2,y0,M.cw,h,st.copyLit==null?clamp(u,0,1)*0.8:Math.max(f(st.copyLit,j),lit*0.8));
    wc_panel(ctx,cx-M.cw/2,y0,M.cw,h,{kind:"card",wash:app,washA:0.45,seed:231+j});const n=L.length,top=y0+h/2-(n*30+30)/2+20;
    L.forEach((s,k)=>wc_T(ctx,s,cx,top+k*30,{w:700,size:24,align:"center",col:WC_DARK}));wc_T(ctx,"from the glossary",cx,top+n*30+4,{w:700,size:24,align:"center",col:GV.goldInk});});});}
// the gold line's path (ee_goldLine draws a path p of the way along; o.col, o.lw and o.a change its colour, width and strength): from the definition
// into the map's card and out to the glossary's, out of that down to the foot of the application band, and along it, up into each copy
function ee_goldPath(){const M=EE_MP,[iy,ih]=M.info,[ay,ah]=M.app,mid=ay+ah/2,foot=ay+ah-8,top=ay+ah-22,g=ee_mx(5);
  return[[ee_mx(4),iy+ih],[ee_mx(4),mid],[g,mid],[g,foot],[ee_mx(2),foot],[ee_mx(2),top],[ee_mx(2),foot],[ee_mx(1),foot],[ee_mx(1),top],[ee_mx(1),foot],[ee_mx(0),foot],[ee_mx(0),top]];}
function ee_goldLine(ctx,pts,p,o){o=o||{};let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
  let left=L*clamp(p,0,1);ctx.save();ctx.strokeStyle=rgba(o.col||GV.gold,o.a==null?0.95:o.a);ctx.lineWidth=o.lw||7;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length&&left>0;i++){const u=Math.min(1,left/seg[i-1]);ctx.lineTo(lerp(pts[i-1][0],pts[i][0],u),lerp(pts[i-1][1],pts[i][1],u));left-=seg[i-1];}ctx.stroke();ctx.restore();}
// how far along the gold line each copy is, so it lights as the line reaches it: the data team's copy first, nearest the glossary
const ee_goldAt=j=>{const pts=ee_goldPath();let L=0,at=0;const end=[5,8,11][j];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L+=d;if(i===end)at=L;}return at/L;};
// a small house, a home for a card's information: its outline drawn, empty for now (u, 0 to 1; s, its size)
function ee_house(ctx,x,y,u,s){const k=(s||1)*(0.6+0.4*spring(clamp(u,0,1)));ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(u*2,0,1),()=>{ctx.fillStyle=rgba([255,253,246],0.95);
  ctx.strokeStyle=rgba(WC_DARK,0.8);ctx.lineWidth=2.6;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-16,-2);ctx.lineTo(0,-16);ctx.lineTo(16,-2);ctx.lineTo(16,16);ctx.lineTo(-16,16);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(-5,16);ctx.lineTo(-5,5);ctx.lineTo(5,5);ctx.lineTo(5,16);ctx.stroke();});ctx.restore();}
// the copies' card, opened out of its place in the information band to the middle of the board, the board dimmed under it (u, 0 to 1):
// each copy, where it came from, and when (row(j), as each is said); ta, its words' strength (they go before it closes); drawn at its full
// size and scaled, so its panel is made once
const EE_CPB={x:422,y:278,w:1000,h:404},EE_CPROWS=[["the data team's copy"],["the dashboards"],["the assistant"]];
function ee_copiesBig(ctx,u,row,ta){if(u<=0.01)return;ta=ta==null?1:ta;const M=EE_MP,[iy,ih]=M.info,B=EE_CPB,e=easeCam(clamp(u,0,1)),k=lerp(M.cw/B.w,1,e),
    cx=lerp(ee_mx(5),B.x+B.w/2,e),cy=lerp(iy+ih/2,B.y+B.h/2,e);
  ctx.save();ctx.fillStyle=rgba([70,58,46],0.3*e);ctx.fillRect(-W,-H,3*W,3*H);ctx.translate(cx,cy);ctx.scale(k,k);ctx.translate(-B.w/2,-B.h/2);
  withA(ctx,clamp(u*3,0,1),()=>{ctx.fillStyle="rgba(40,30,20,0.2)";ctx.fillRect(12,14,B.w,B.h);ctx.fillStyle=rgba([255,253,246],1);rr(ctx,3,3,B.w-6,B.h-6,12);ctx.fill();
    wc_panel(ctx,0,0,B.w,B.h,{kind:"card",wash:ee_bandCol(3),washA:0.3,seed:241});wc_flat(ctx,wc_rect(8,8,B.w-16,14),wc_dim(ee_bandCol(3),0.15),0.9,"band");
    withA(ctx,clamp((e-0.6)/0.4,0,1)*ta,()=>{wc_T(ctx,"its copies · where each came from",50,82,{w:800,size:32,col:WC_DARK});ctx.fillStyle=rgba(WC_PENCIL,0.35);ctx.fillRect(50,106,B.w-100,2);
      EE_CPROWS.forEach(([n],j)=>{const a=clamp(row?row(j):1,0,1);if(a<=0.01)return;const y=186+j*86;withA(ctx,a,()=>{wc_T(ctx,n,50,y,{w:700,size:30,col:WC_DARK});
        wc_T(ctx,"from the glossary",440,y,{w:700,size:30,col:GV.goldInk});wc_T(ctx,"21 January",740,y,{w:600,size:30,col:WC_MUTED});});});});});ctx.restore();}
