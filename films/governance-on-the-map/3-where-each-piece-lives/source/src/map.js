/* ===== Where each piece lives: Noor's map, close =====
   The board on Noor's wall drawn large: its application band, in the colour The map before the data gives it, with the edges of the
   information band above and the technology band below. On it, the seven places Yusuf counts, each a card with the pieces it holds as
   chips, and the three tools that read the glossary. A home is drawn solid, with a house mark at its corner; a copy dashed, and its
   card says where its copies came from, and when. The flows run between the cards, one way each, with one arrowhead. The board is
   painted once (the place ohMap); the cards are drawn every frame. Every word on it is 28 px or more at the zoom the film reads it at.
   Every name starts with oh_ or OH. */

const OH_MB={x:56,w:1808,band:[30,870],lab:100},OH_APPC=GV_LAYERS[4][1];
// the cards: key, box, name (one or two lines), its pieces: [words, home (1) or copy (0)]; a card with copies says where they came from
const OH_APPS=[
  {k:"arch",b:[150,60,360,270],name:["The architecture tool"],chips:[["the map",1],["concepts",1],["definitions",1]]},
  {k:"gloss",b:[640,60,330,270],name:["The glossary"],chips:[["definitions",0]],from:"from the map,"},
  {k:"docs",b:[1510,60,300,270],name:["The document","library"],chips:[["policies",1],["minutes",1]]},
  {k:"repo",b:[150,450,360,340],name:["The data team's","repository"],chips:[["owners",1],["decisions",1],["classes",1],["promises",1],["tables",1],["checks",1]]},
  {k:"plat",b:[640,450,330,340],name:["The data platform"],chips:[["owners",0],["classes",0],["who may read",1],["who read it",1]],from:"from the repository,"},
  {k:"cat",b:[1100,450,330,340],name:["The catalogue"],chips:[["owners",0],["promises",0]],from:"from the repository,"},
  {k:"tracker",b:[1510,450,300,340],name:["The tracker"],chips:[["issues",1],["requests",1]]}];
const OH_APP=k=>OH_APPS.find(a=>a.k===k);
// the three tools that read the glossary's copy: small cards, dashed, in the third column
const OH_USE=[["the data team's copy",[1100,60,330,82]],["the dashboards",[1100,154,330,82]],["the assistant",[1100,248,330,82]]];
// the flows, as the points each arrow runs through: the map's definitions to the glossary; from the glossary to each tool that reads it;
// the map's concepts to the repository's tables; the repository's classes (and owners) to the platform; its promises (and owners) to the
// catalogue, round the platform's card; and the one Noor starts back, and stops
const OH_FLOWS={defs:[[518,195],[632,195]],use0:[[978,180],[1092,101]],use1:[[978,195],[1092,195]],use2:[[978,210],[1092,289]],
  concepts:[[330,338],[330,442]],classes:[[518,620],[632,620]],promises:[[518,520],[590,520],[590,390],[1265,390],[1265,442]],back:[[632,736],[518,736]]};
const OH_CP={h:46,s:28,gap:10,rg:16,pad:16};

function oh_paintMap(ctx){const M=OH_MB;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.noor,{kind:"plaster",line:false,seed:607});
  gv_lightGlow(ctx,960,-80,900);wc_part(ctx,wc_rect(M.x-14,-120,M.w+28,H+240),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(M.x,-100,M.w,H+200),[250,250,247],1,"board");
  [[-160,M.band[0]-12,3],[M.band[0],M.band[1],4],[M.band[1]+12,1140,5]].forEach(([y0,y1,li],k)=>wc_wash(ctx,wc_rect(M.x+12,y0,M.w-24,y1-y0),wc_lit(GV_LAYERS[li][1],0.66),{kind:"swatch",seed:611+k,a:0.8}));
  ctx.save();ctx.translate(M.lab,(M.band[0]+M.band[1])/2);ctx.rotate(-Math.PI/2);wc_T(ctx,"Application",0,10,{w:700,size:30,align:"center",col:wc_dim(OH_APPC,0.66)});ctx.restore();}

// where each chip of a card sits: in rows under its name, left to right, a new row when one is full (worked out once)
function oh_chipRects(ctx,a){if(a.cr)return a.cr;const [x,y,w]=a.b,out=[];let cx=x+OH_CP.pad,cy=y+(a.name.length>1?112:78);
  a.chips.forEach(([s])=>{const cw=Math.round(tw(ctx,s,OH_CP.s,700)+32);if(cx+cw>x+w-OH_CP.pad+1){cx=x+OH_CP.pad;cy+=OH_CP.h+OH_CP.rg;}out.push([cx,cy,cw,OH_CP.h]);cx+=cw+OH_CP.gap;});
  return a.cr=out;}
const oh_chipAt=(ctx,k,i)=>{const r=oh_chipRects(ctx,OH_APP(k))[i];return[r[0]+r[2]/2,r[1]+r[3]/2];};
// a soft glow behind a box (a, 0 to 1; col, gold unless given)
function oh_glow(ctx,x,y,w,h,a,col){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=clamp(a,0,1);const r=Math.max(w,h)*0.75,
  g=ctx.createRadialGradient(x+w/2,y+h/2,Math.min(w,h)*0.3,x+w/2,y+h/2,r),c=wc_lit(col||GV.gold,0.3);g.addColorStop(0,rgba(c,0.95));g.addColorStop(1,rgba(c,0));
  ctx.fillStyle=g;ctx.fillRect(x+w/2-r,y+h/2-r,2*r,2*r);ctx.restore();}
// a chip: before the rule, plain (kind u at 0); a home, solid, with a house mark at its corner; a copy, dashed, its words softer.
// o.lit (gold glow), o.amber (found by the check), o.green (put right), o.pen (a pen at its corner: theirs to change), o.eye (an eye:
// only to read)
function oh_chip(ctx,r,s,home,u,o){o=o||{};const [x,y,w,h]=r,v=clamp(u,0,1);
  oh_halo(ctx,x,y,w,h,o.lit||0,GV.gold);oh_halo(ctx,x,y,w,h,o.amber||0,GV.amber);oh_halo(ctx,x,y,w,h,o.green||0,GV.green);
  if(v<0.99)withA(ctx,1-v,()=>{wc_panel(ctx,x,y,w,h,{kind:"chip",seed:Math.round(x*3+y)});wc_T(ctx,s,x+16,y+h/2+10,{w:700,size:OH_CP.s,col:WC_DARK});});
  if(v>0.01)withA(ctx,v,()=>{if(home){wc_panel(ctx,x,y,w,h,{kind:"chip",wash:[255,253,246],washA:0.9,seed:Math.round(x*3+y)});wc_T(ctx,s,x+16,y+h/2+10,{w:700,size:OH_CP.s,col:WC_DARK});oh_house(ctx,x+7,y+5,0.72);}
    else{wc_panel(ctx,x,y,w,h,{kind:"chip",dashed:true,seed:Math.round(x*3+y)});wc_T(ctx,s,x+16,y+h/2+10,{w:700,size:OH_CP.s,col:WC_MUTED});}});
  const am=clamp(o.amber||0,0,1),gr=clamp(o.green||0,0,1);
  if(am>0.01||gr>0.01){ctx.save();ctx.lineWidth=4;ctx.strokeStyle=rgba(gr>am?GV.green:GV.amber,Math.max(am,gr));rr(ctx,x-4,y-4,w+8,h+8,(h+8)/2);ctx.stroke();ctx.restore();}
  if((o.pen||0)>0.01)oh_penMark(ctx,x+w-6,y-1,o.pen);if((o.eye||0)>0.01)oh_eye(ctx,x+w-6,y-1,o.eye);}
// a soft glow hugging a chip (or a card, with its corners' radius r), so only the one that's named lights
function oh_halo(ctx,x,y,w,h,a,col,r){if(a<=0.01)return;ctx.save();ctx.filter="blur(9px)";ctx.fillStyle=rgba(wc_lit(col,0.15),0.75*clamp(a,0,1));rr(ctx,x-9,y-9,w+18,h+18,r==null?(h+18)/2:r);ctx.fill();ctx.restore();}
// a small round badge at a chip's corner: a pen, this team changes it here (gold ring); an eye, this team only reads it here (grey)
function oh_badge(ctx,x,y,u,col){const k=0.7+0.3*spring(clamp(u,0,1));ctx.translate(x,y);ctx.scale(k,k);ctx.fillStyle="rgba(60,44,30,0.2)";ctx.beginPath();ctx.arc(1.5,2.5,15,0,TAU);ctx.fill();
  ctx.fillStyle=rgba([255,253,246],1);ctx.beginPath();ctx.arc(0,0,15,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3;ctx.stroke();}
function oh_penMark(ctx,x,y,u){ctx.save();withA(ctx,clamp(u*2,0,1),()=>{oh_badge(ctx,x,y,u,GV.gold);ctx.rotate(0.75);ctx.fillStyle=rgba([44,56,104],1);rr(ctx,-3.5,-11,7,16,2.5);ctx.fill();
  ctx.fillStyle=rgba([206,176,92],1);ctx.fillRect(-3.5,-5,7,3);ctx.fillStyle=rgba(WC_DARK,0.9);ctx.beginPath();ctx.moveTo(-3.5,5);ctx.lineTo(3.5,5);ctx.lineTo(0,11);ctx.closePath();ctx.fill();});ctx.restore();}
function oh_eye(ctx,x,y,u){ctx.save();withA(ctx,clamp(u*2,0,1),()=>{oh_badge(ctx,x,y,u,WC_MUTED);ctx.strokeStyle=rgba(WC_DARK,0.85);ctx.lineWidth=2.2;
  ctx.beginPath();ctx.moveTo(-9,0);ctx.quadraticCurveTo(0,-9,9,0);ctx.quadraticCurveTo(0,9,-9,0);ctx.closePath();ctx.stroke();ctx.fillStyle=rgba(WC_DARK,0.85);ctx.beginPath();ctx.arc(0,0,3.2,0,TAU);ctx.fill();});ctx.restore();}
// a card on the map: its name, its chips, and, for a card with copies, where they came from (o.from, 0 to 1). o.lit: a gold glow;
// o.chip(i): each chip's {lit, amber, green, pen, eye}; o.home, o.copy (0 to 1): the chips turn solid or dashed
function oh_appCard(ctx,a,o){o=o||{};const [x,y,w,h]=a.b,R=oh_chipRects(ctx,a);oh_halo(ctx,x,y,w,h,o.lit||0,GV.gold,24);
  wc_panel(ctx,x,y,w,h,{kind:"card",wash:OH_APPC,washA:0.3,seed:631+Math.round(x+y)});
  a.name.forEach((l,i)=>wc_T(ctx,l,x+16,y+46+i*34,{w:800,size:28,col:WC_DARK}));
  a.chips.forEach(([s,hm],i)=>oh_chip(ctx,R[i],s,!!hm,hm?(o.home||0):(o.copy||0),o.chip?o.chip(i)||{}:{}));
  const f=clamp(o.from||0,0,1);if(a.from&&f>0.01)withA(ctx,f,()=>{wc_T(ctx,a.from,x+16,y+h-48,{w:600,size:28,col:GV.goldInk});wc_T(ctx,o.when||"last night",x+16,y+h-14,{w:600,size:28,col:GV.goldInk});});}
function oh_useCard(ctx,i,u,o){o=o||{};if(u<=0.01)return;const [s,[x,y,w,h]]=OH_USE[i];oh_land(ctx,u,x+w/2,y+h/2,()=>{oh_halo(ctx,x,y,w,h,o.lit||0,GV.gold,20);oh_halo(ctx,x,y,w,h,o.green||0,GV.green,20);
  wc_panel(ctx,x,y,w,h,{kind:"card",dashed:true,seed:651+i});wc_T(ctx,s,x+18,y+h/2+10,{w:700,size:28,col:WC_MUTED});if((o.eye||0)>0.01)oh_eye(ctx,x+w-30,y+h/2,o.eye);});}
// a card springing in: k its scale as it lands, a its opacity
function oh_land(ctx,u,cx,cy,fn){if(u<=0.01)return;const k=0.86+0.14*spring(clamp(u,0,1));ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);ctx.translate(-cx,-cy);withA(ctx,clamp(u*2.2,0,1),fn);ctx.restore();}

// a flow: a line along its points, drawn to p of the way, its head at the end that's reached; lit (gold), or ink
function oh_polyLen(P){let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);return L;}
function oh_flow(ctx,P,p,o){o=o||{};if(p<=0.01)return;const L=oh_polyLen(P),end=oh_along(P,clamp(p,0,1)),lit=clamp(o.lit||0,0,1),col=mix(o.col||[70,64,58],GV.gold,lit),lw=o.lw||6;
  const pts=[P[0]];let acc=0;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);if(acc+d<=L*p){pts.push(P[i]);acc+=d;}else break;}pts.push(end);
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";if(lit>0.01){ctx.strokeStyle=rgba(wc_lit(GV.gold,0.5),0.5*lit);ctx.lineWidth=lw+10;ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();}
  ctx.strokeStyle=rgba(col,o.a==null?0.92:o.a);ctx.lineWidth=lw;if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();ctx.setLineDash([]);
  if(!o.noHead){const a=pts[pts.length-2],b=pts[pts.length-1],an=Math.atan2(b[1]-a[1],b[0]-a[0]),hl=(o.head||20)*clamp(p/0.2,0.4,1);
    ctx.beginPath();ctx.moveTo(b[0]-Math.cos(an-0.5)*hl,b[1]-Math.sin(an-0.5)*hl);ctx.lineTo(b[0],b[1]);ctx.lineTo(b[0]-Math.cos(an+0.5)*hl,b[1]-Math.sin(an+0.5)*hl);ctx.stroke();}
  ctx.restore();}
// a small light at u along a flow's points (a: its strength)
function oh_lightAt(ctx,P,u,a,r){if(a<=0.01)return;const [x,y]=oh_along(P,clamp(u,0,1));ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x,y,r||70,[255,226,140],0.8*a);wc_glowAt(ctx,x,y,(r||70)*0.4,[255,246,214],0.9*a);ctx.restore();}
// a cross, drawn stroke by stroke (u, 0 to 1), where an arrow's head would have been
function oh_cross(ctx,x,y,u){if(u<=0.01)return;const s=18;ctx.save();ctx.strokeStyle=rgba(GV.red,0.95);ctx.lineWidth=6;ctx.lineCap="round";const a=clamp(u*2,0,1),b=clamp(u*2-1,0,1);
  ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x-s+2*s*a,y-s+2*s*a);if(b>0){ctx.moveTo(x+s,y-s);ctx.lineTo(x+s-2*s*b,y-s+2*s*b);}ctx.stroke();ctx.restore();}

// Noor's map, close. st (each a number or a function of the card's key, or of the chip):
//   card(k): the card landing; home, copy: the chips turn solid or dashed; from(k): where its copies came from; when: "last night" or another;
//   cardLit(k); chip(k, i): a chip's {lit, amber, green, pen, eye}; use(i), useLit(i), useEye: the tools that read the glossary;
//   flow(f), flowLit(f): each flow drawn and lit; back, cross: the flow Noor starts back and stops; lights: [[flow, u, a], ...];
//   dim: a sheet of paper over all of it (0 to 1)
function oh_map(ctx,st){const f=(v,...a)=>v==null?0:typeof v==="function"?v(...a):v,d=f(st.dim);
  // dimmed (behind a card laid over it), the map is drawn faint, then washed with paper: nothing on it reads through the card
  withA(ctx,1-0.55*clamp(d,0,1),()=>{
  OH_APPS.forEach(a=>{const u=st.card==null?1:f(st.card,a.k);if(u<=0.01)return;const [x,y,w,h]=a.b;
    oh_land(ctx,u,x+w/2,y+h/2,()=>oh_appCard(ctx,a,{lit:f(st.cardLit,a.k),home:st.home,copy:st.copy,from:f(st.from,a.k),when:st.when,chip:i=>st.chip?st.chip(a.k,i):null}));});
  OH_USE.forEach((_,i)=>oh_useCard(ctx,i,f(st.use,i),{lit:f(st.useLit,i),eye:f(st.useEye,i),green:f(st.useGreen,i)}));
  Object.keys(OH_FLOWS).forEach(k=>{if(k==="back")return;oh_flow(ctx,OH_FLOWS[k],f(st.flow,k),{lit:f(st.flowLit,k),lw:k.startsWith("use")?4:6,head:k.startsWith("use")?16:20});});
  const bk=f(st.back);if(bk>0.01){oh_flow(ctx,OH_FLOWS.back,bk*0.62,{col:WC_PENCIL,lw:5,dash:[10,8],noHead:true});const e=oh_along(OH_FLOWS.back,0.62);oh_cross(ctx,e[0]-14,e[1],f(st.cross));}
  (st.lights||[]).forEach(([k,u,a])=>oh_lightAt(ctx,OH_FLOWS[k],u,a));});
  if(d>0.01){ctx.save();ctx.fillStyle=rgba(WC_PAPER,0.5*d);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}}
