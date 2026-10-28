/* ===== Change without surprises: the university's pictures =====
   Only the university's own places, from the series' rooms.js: Mei's desk, Jun's desk and the data team's room and its board, Yusuf's
   office and its shelf, the meeting room, Planning. The pictures are the film's own papers: Monday night's change notice for award, the
   change board's calendar and form, Jun's change request, the register's page "Who uses what", the impact note and its three
   headings, the bar of credit towards an award, the wallet on a learner's phone, the table of credentials as a ruled page, Mei's stamp,
   the new mark, the two editions, Jun's notice in two kinds of words, and the new box on the change request form. In plain words: the
   series' first pack shows no file, code or technical screen. Every name starts with cw_ or CW. */

/* ---------- helpers ---------- */
// made once per chapter, the first time it draws: its cues are known by then
const cw_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the year and the place in the top corner: the latest one passed, dissolving from the one before
function cw_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1)wc_year(ctx,56,72,mk[i-1][1],a*(1-u));wc_year(ctx,56,72,mk[i][1],a*u);}
// a tag that springs in at t0 and goes at t1 (or stays)
function cw_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// the words on a thing the camera closes in on: read when it's close, and only a texture of words while it's far, so they're
// marked as decoration while smaller than 28 px as seen. Each of them is read somewhere in its chapter, close. o.max shrinks a
// line to fit a width.
function cw_T(ctx,s,x,y,o){o=Object.assign({},o||{});let sz=o.size||28;if(o.max){const w=tw(ctx,s,sz,o.w||600,o.f);if(w>o.max)sz*=o.max/w;}o.size=sz;
  const m=ctx.getTransform(),k=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))*W/ctx.canvas.width;if(sz*k<27)o.deco=1;wc_T(ctx,s,x,y,o);}
// a name card, as the series introduces people: the name, then the role; it rises a little as it comes
function cw_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:3});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}
// where a figure's hand is on the place, for a pose: the figure stands at (x, y) at scale s
function cw_handAt(id,x,y,s,pose,side){const P_=PEOPLE[id],k=s*P_.build.h,po=POSE[pose],h=handAt(P_,side,side<0?po.L:po.R,0);return[x+k*h[0],y+k*h[1]];}

// a chapter's shots (the series' gv_shots), with each word fading as the frame comes to cut it, from 30 px inside the frame's edge to
// gone at it, as Who decides fades its register's words (wd_fadeCut): the frame never cuts a word in two
function cw_shots(ctx,S,t,end,shots,dis){const T0=T,cw=ctx.canvas.width,ch=ctx.canvas.height,r=30*cw/1920;
  T=(c,s2,x,y,o)=>{o=o||{};const sz=o.size||24,w=tw(c,String(s2),sz,o.w,o.f),al=o.align||"left",x0=al==="center"?x-w/2:al==="right"?x-w:x,m=c.getTransform();
    let l=1e9,rt=-1e9,tp=1e9,bt=-1e9;for(const [px,py] of [[x0,y-0.75*sz],[x0+w,y-0.75*sz],[x0,y+0.2*sz],[x0+w,y+0.2*sz]]){const X=m.a*px+m.c*py+m.e,Y=m.b*px+m.d*py+m.f;
      l=Math.min(l,X);rt=Math.max(rt,X);tp=Math.min(tp,Y);bt=Math.max(bt,Y);}
    const a=clamp(Math.min(l/r,(cw-rt)/r,tp/r,(ch-bt)/r),0,1);if(a>=0.99)return T0(c,s2,x,y,o);if(a>0.01)withA(c,a,()=>T0(c,s2,x,y,o));};
  try{return gv_shots(ctx,S,t,end,shots,dis);}finally{T=T0;}}

/* ---------- 1967, held and carried ---------- */
// a bundle of the booklets, held in both hands: their edges, and the top one's cover with its H
function cw_heldBooklets(n){return(cx,P_,hands)=>{if(n<=0)return;const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+12);
  for(let i=0;i<n;i++){cx.fillStyle=rgba(i%2?[238,234,224]:[252,250,244],1);cx.fillRect(-72,-(i+1)*9,144,9);}cx.strokeStyle=rgba(WC_PENCIL,0.5);cx.lineWidth=1.6;cx.strokeRect(-72,-n*9,144,n*9);
  cx.translate(0,-n*9);cx.transform(1,0,0,0.42,0,0);cx.fillStyle=rgba([252,250,244],1);cx.fillRect(-72,-200,144,200);cx.strokeRect(-72,-200,144,200);cx.restore();
  cw_H(cx,mx,my+12-n*9-46,62,CW.navy,0);fingers(cx,P_,[[mx-74,my+4],[mx+74,my+4]]);};}
// a pack of milk in the right hand
function cw_heldTetra(cx,P_,hands){const r=hands[1];cw_tetra(cx,r[0]+6,r[1]+52,104);fingers(cx,P_,[[r[0],r[1]+6]]);}

/* ---------- the university: helpers ---------- */
// handwriting that's marked as decoration while it's smaller than 28 px as seen (a page seen from across a room), as cw_T does for
// print; p writes it letter by letter. Returns where the pen is, at the end of what's written
function cw_hand(ctx,s,x,y,o){o=o||{};const p=o.p==null?1:o.p,size=o.size||32,m=ctx.getTransform(),k=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))*W/ctx.canvas.width;
  if(p<=0)return[x,y];const sub=s.slice(0,Math.ceil(s.length*clamp(p,0,1)));ctx.save();ctx.translate(x,y);ctx.transform(1,0,-0.2,1,0,0);
  wc_T(ctx,sub,0,0,{size,w:o.w||600,col:o.col||GV_SIGN.ink,a:o.a,deco:size*k<27?1:0});ctx.restore();return[x+tw(ctx,sub,size,o.w||600)-size*0.08,y-size*0.12];}
// a pen writing: its tip at (x, y), tilted as a right hand holds one, its body towards the writer at the bottom right. Drawn over
// handwriting as it goes on, so a page is seen being written. o.pencil draws a yellow pencil instead of the ballpoint
function cw_pen(ctx,x,y,a,o){if(a!=null&&a<=0.01)return;o=o||{};ctx.save();if(a!=null)ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(0.62);
  ctx.save();ctx.filter="blur(5px)";ctx.fillStyle="rgba(50,36,24,0.25)";ctx.fillRect(14,10,196,14);ctx.restore();
  if(o.pencil){ctx.fillStyle="rgb(70,64,66)";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(9,-3);ctx.lineTo(9,3);ctx.closePath();ctx.fill();ctx.fillStyle="rgb(232,204,166)";ctx.beginPath();ctx.moveTo(9,-3);ctx.lineTo(30,-9);ctx.lineTo(30,9);ctx.lineTo(9,3);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgb(240,190,70)";ctx.fillRect(30,-9,170,18);ctx.fillStyle="rgb(250,214,110)";ctx.fillRect(30,-9,170,5);ctx.fillStyle="rgb(196,200,206)";ctx.fillRect(200,-9,16,18);ctx.fillStyle="rgb(226,140,150)";rr(ctx,216,-9,18,18,5);ctx.fill();}
  else{ctx.fillStyle="rgb(214,216,222)";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(22,-6);ctx.lineTo(22,6);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgb(36,48,82)";rr(ctx,22,-8,190,16,7);ctx.fill();ctx.fillStyle="rgb(70,86,128)";ctx.fillRect(30,-6,170,4);
    ctx.fillStyle="rgb(196,200,210)";ctx.fillRect(150,-11,52,5);}ctx.restore();}
// where the pen is while words are written over [t0, t1]: the written part, and the pen, gone a moment after it lifts
const cw_penA=(tt,t0,t1)=>fin(tt,t0-0.25,0.2)*(1-fin(tt,t1+0.15,0.25));
// a speech bubble that springs in at t0 and goes at t1 (or stays to the end)
function cw_say(ctx,t,t0,t1,x,y,lines,tx,ty,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;gv_say(ctx,x,y,lines,tx,ty,Object.assign({a,k:0.92+0.08*spring(fin(t,t0,0.5))},o||{}));}
// the campus path's height at x, for someone walking along it to the door
const CW_PATH=wc_smooth(GV_CP.path,8);
function cw_pathY(x){const p=CW_PATH;for(let i=1;i<p.length;i++)if(p[i][0]>=x)return lerp(p[i-1][1],p[i][1],clamp((x-p[i-1][0])/Math.max(1e-6,p[i][0]-p[i-1][0]),0,1));return p[p.length-1][1];}
// a tray of blank forms at the end of Jun's desk, in the data team's room
function cw_tray(ctx,x,y){wc_part(ctx,[[x,y],[x+96,y],[x+90,y-24],[x+6,y-24]],[96,104,120],1,{lw:1.2});for(let i=0;i<4;i++)wc_flat(ctx,wc_rect(x+10,y-30-i*4,76,5),i===3?wc_lit(GV.cyanInk,0.75):WC_CARD,1,"form");}
// a sheet of paper held in both hands, its top towards us: the change request form, its cyan band and lines
function cw_heldForm(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-40);cx.rotate(-0.05);const w=150,h=200;
  cx.fillStyle="rgba(60,50,40,0.22)";cx.fillRect(-w/2+5,-h/2+6,w,h);cx.fillStyle="rgb(252,250,244)";cx.fillRect(-w/2,-h/2,w,h);cx.fillStyle=rgba(wc_lit(GV.cyanInk,0.72),1);cx.fillRect(-w/2+6,-h/2+6,w-12,24);
  cx.fillStyle=rgba(WC_MUTED,0.4);for(let i=0;i<5;i++)cx.fillRect(-w/2+14,-h/2+48+i*26,(w-28)*(i%2?0.7:0.9),4);cx.restore();fingers(cx,P_,[[mx-w/2+6,my+10],[mx+w/2-6,my+6]]);}
// a person nodding: a dip and back, once, from t0
const cw_nod=(t,t0)=>{const u=(t-t0)/0.7;return u>0&&u<1?0.16*Math.sin(u*Math.PI):0;};
// three tags in a row, as the opening's last line left them: what would change, when, what to do; in at t0 each in turn, out at t1
function cw_three(ctx,t,t0,t1,y,o){o=o||{};["what would change","when","what to do"].forEach((s,i)=>{const t_=t0+i*(o.gap==null?0.25:o.gap),a=gv_io(t,t_,t1,0.4);if(a<=0.01)return;
  const x=(o.xs||[560,960,1360])[i];ctx.save();ctx.translate(x+80*(1-easeCam(fin(t,t_,0.5))),y);withA(ctx,a,()=>wc_tag(ctx,0,0,s,{align:"center",size:o.size||34}));ctx.restore();});}

// the university's own poses: reaching down to a tray on a desk
Object.assign(POSE,{cw_reachLow:{L:[0.12,-0.08],R:[0.62,1.22],feet:30,shift:5,tilt:-0.02,turn:0.2,gaze:[0.5,0.45],look:1}});
// reaching up to pin something on a board above the head, the right hand high
Object.assign(POSE,{cw_pin:{L:[0.12,-0.08],R:[2.25,2.8],feet:30,shift:5,tilt:-0.03,turn:0.2,gaze:[0.35,-0.8],look:0}});

/* ---------- the university's desks, from above, for the papers on them ---------- */
// its wood and grain, and what's at its edges: a mug [x, y, colour], the keyboard's edge, a pencil [x, y, angle], the registrar's red
// ink pad [x, y], a glass of water [x, y]
function cw_paintTop(ctx,o){const wood=o.wood||GV.oak;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wood,{kind:"plaster",line:false,seed:o.seed||51});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(o.seed||3);for(let i=0;i<70;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(wood,0.2+R()*0.12),0.18+R()*0.14);ctx.lineWidth=1+R()*2.4;ctx.beginPath();ctx.moveTo(-20,y);
    for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+6*Math.sin(x/300+i)+3*Math.sin(x/90+i*2));ctx.stroke();}ctx.restore();
  if(o.keys){wc_part(ctx,wc_rect(1500,-40,460,120),[226,228,234],1);for(let i=0;i<9;i++)for(let j=0;j<2;j++)wc_flat(ctx,wc_rect(1516+i*48,-24+j*44,40,36),[244,245,248],1,"key");}
  if(o.mug){const [mx,my,mc]=o.mug;ctx.save();ctx.filter="blur(12px)";ctx.fillStyle="rgba(60,40,20,0.3)";ctx.beginPath();ctx.arc(mx+16,my+20,84,0,TAU);ctx.fill();ctx.restore();
    wc_wash(ctx,wc_ell(mx,my,82,82,40),mc,{kind:"thing",lw:1.6});wc_wash(ctx,wc_ell(mx,my,62,62,40),[150,104,70],{kind:"thing",line:false});}
  if(o.pencil){const [px,py,a]=o.pencil;ctx.save();ctx.translate(px,py);ctx.rotate(a);wc_part(ctx,[[0,-8],[280,-8],[280,8],[0,8]],[244,196,80],1);wc_flat(ctx,[[280,-8],[314,0],[280,8]],[232,206,170],1,"wood");
    wc_flat(ctx,[[302,-3],[314,0],[302,3]],[60,54,58],1,"tip");ctx.restore();}
  if(o.pad){const [ix,iy]=o.pad;wc_part(ctx,wc_rect(ix,iy,230,156),[70,72,80],1);wc_flat(ctx,wc_rect(ix+14,iy+14,202,128),[176,40,34],1,"ink");}
  if(o.glass){const [gx,gy]=o.glass;ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(60,40,20,0.22)";ctx.beginPath();ctx.arc(gx+12,gy+16,60,0,TAU);ctx.fill();ctx.restore();
    wc_wash(ctx,wc_ell(gx,gy,58,58,32),[226,236,240],{kind:"thing",lw:1.3});wc_flat(ctx,wc_ell(gx,gy,44,44,28),[186,214,226],1,"water");}}
const CW_TOPS={topJun:{seed:61,mug:[150,930,[178,160,214]],keys:true,pencil:[1500,980,-0.12]},topMei:{seed:63,wood:[214,176,130],pad:[1640,820],mug:[150,120,[226,214,190]]},
  topPlan:{seed:65,wood:[226,200,160],mug:[1770,930,[150,190,150]],pencil:[60,120,0.1]},topMeet:{seed:67,glass:[1780,140],pencil:[1530,990,-0.2]}};

/* ---------- 2 · The change board ---------- */
// Monday night's change notice for award, on paper, laid out as One word, one home draws it: its title and the gold chip "changed
// Monday"; what changed, the new words in bold, lit violet (o.lit, 0 to 1); and the line at its foot where the meaning's owner signs:
// her name written by hand (o.sign, 0 to 1), then a green tick (o.ok). Drawn at (x, y), 1200 wide; returns where the pen is
const CW_NT={x:360,y:96,w:1200,h:800};
function cw_notice(ctx,o){o=o||{};const {x,y,w,h}=CW_NT;gv_sheet(ctx,x,y,w,h,{rot:-0.01});ctx.save();ctx.translate(x,y);
  cw_T(ctx,"Change notice · award",64,104,{w:800,size:48,col:WC_DARK});wc_tag(ctx,w-64,88,"changed Monday",{align:"right",size:30,wash:GV.gold,washA:0.5,col:GV.goldInk});
  const rule=ry=>{ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(64,ry);ctx.lineTo(w-64,ry);ctx.stroke();ctx.restore();};rule(146);
  cw_T(ctx,"what changed",64,214,{w:600,size:32,col:WC_MUTED});gv_tint(ctx,52,244,w-104,150,GV_MEAN.violet,0.18+0.5*(o.lit||0));
  ["…a master or a microcredential,","for at least 6 credit points"].forEach((l,i)=>cw_T(ctx,l,72,304+i*62,{w:800,size:46,col:GV_MEANINK.violet}));
  gv_lines(ctx,64,452,w-180,3,34,0.85);rule(570);cw_T(ctx,"signed off",64,636,{w:600,size:32,col:WC_MUTED});
  cw_T(ctx,"the meaning ·",64,726,{w:600,size:36,col:WC_INK});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(310,740);ctx.lineTo(880,740);ctx.stroke();ctx.restore();
  const pen=cw_hand(ctx,"Mei Tanaka",330,726,{size:52,p:o.sign||0});wc_tick(ctx,950,706,72,GV.greenInk,o.ok||0,8);ctx.restore();return[x+pen[0],y+pen[1]];}

// Jun's change request, a paper form, 1000 wide at (0, 0) (the scene places and scales it): its name; the title and who asks, written
// by hand (o.title, o.name: 0 to 1); the change, in a box (o.box1), crossed through (o.cross) and a second box under it (o.box2); the
// stamp once it's in (o.stamp). o.blank leaves it empty: a new form, which o.newBox gives the box for the impact note, from the policy
// (0 to 1 as it lands). Returns where the pen is
const CW_RQ={w:1000,h:900};
function cw_request(ctx,o){o=o||{};const {w,h}=CW_RQ;gv_sheet(ctx,0,0,w,h);let pen=null;
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.cyanInk,0.86),1);ctx.fillRect(18,18,w-36,108);ctx.restore();
  cw_T(ctx,"Change request",56,92,{w:800,size:50,col:WC_DARK});
  const field=(s,ly)=>cw_T(ctx,s,56,ly,{w:600,size:30,col:WC_MUTED}),line=(x0,x1,ly)=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x0,ly);ctx.lineTo(x1,ly);ctx.stroke();ctx.restore();};
  field("title",182);line(56,w-56,252);line(56,w-56,306);field("asked by",370);line(220,w-56,382);field("the change",452);
  const box=(by,bh)=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=2;ctx.strokeRect(56,by,w-112,bh);ctx.restore();};box(476,118);box(616,118);
  if(!o.blank){const T1=o.title||0,a1="Count microcredentials of 6 credit points",a2="or more as awards",f=a1.length/(a1.length+a2.length);
    if(T1>0){pen=cw_hand(ctx,a1,66,240,{size:38,p:T1/f});if(T1>f)pen=cw_hand(ctx,a2,66,294,{size:38,p:(T1-f)/(1-f)});}
    if(o.name>0)pen=cw_hand(ctx,"Jun Park",236,370,{size:38,p:o.name});
    if(o.box1>0)pen=cw_hand(ctx,"microcredential, 6 or more → award",86,548,{size:38,p:o.box1});
    if(o.cross>0){const e=easeCam(clamp(o.cross,0,1));ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(70,490);ctx.lineTo(70+(w-140)*e,490+90*e);ctx.stroke();
      if(e>0.5){const f2=(e-0.5)*2;ctx.beginPath();ctx.moveTo(70,580);ctx.lineTo(70+(w-140)*f2,580-90*f2);ctx.stroke();}ctx.restore();pen=[70+(w-140)*e,490+90*e];}
    if(o.box2>0)pen=cw_hand(ctx,"add a mark: counts as an award, yes or no",86,688,{size:36,p:o.box2});
    if(o.stamp>0)gv_stamp(ctx,w-230,h-92,"in · today",o.stamp,{col:GV.greenInk,size:46,rot:-0.08});}
  // another request, on another day: its title and who asked, already written
  else if(o.other){cw_hand(ctx,o.other[0],66,240,{size:38});cw_hand(ctx,o.other[1],236,370,{size:38});}
  // the box the policy adds to every request: gold, its headings, and each owner's ready
  // (the box comes first, as the card that becomes it goes, then its words)
  const nb=o.newBox||0;if(nb>0.01){const k=lerp(1.12,1,easeCam(clamp(nb,0,1)));ctx.save();ctx.translate(w/2,800);ctx.scale(k,k);ctx.translate(-w/2,-800);withA(ctx,clamp(nb*2,0,1),()=>{
      ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.gold,0.62),1);ctx.fillRect(56,748,w-112,136);ctx.restore();ctx.save();ctx.strokeStyle=rgba(GV.goldInk,0.9);ctx.lineWidth=3;ctx.strokeRect(56,748,w-112,136);ctx.restore();});
    withA(ctx,clamp((nb-0.45)*2.2,0,1),()=>{cw_T(ctx,"Impact note",80,800,{w:800,size:34,col:WC_DARK});cw_T(ctx,"each owner: ready",w-80,800,{w:700,size:30,col:GV.greenInk,align:"right"});
      cw_T(ctx,"what it reaches · does it break? · who must be told",80,852,{w:600,size:30,col:WC_INK,max:w-160});});ctx.restore();}
  return pen;}

// The change board's form, on the meeting room's table (1000 wide at (0, 0)): its name; the question, and the box under it where the
// answers go: "awards?" in pencil (o.aw), a line scribbled too small to read (o.scrib), and three lines left empty (o.empty lights them)
const CW_BF={w:1000,h:860};
function cw_boardForm(ctx,o){o=o||{};const {w,h}=CW_BF;gv_sheet(ctx,0,0,w,h);let pen=null;
  cw_T(ctx,"Change board",56,96,{w:800,size:50,col:WC_DARK});gv_lines(ctx,56,150,420,1,0,0.8);
  cw_T(ctx,"What will this change affect?",56,250,{w:700,size:40,col:WC_DARK});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=2;ctx.strokeRect(56,284,w-112,430);ctx.restore();
  for(let i=0;i<5;i++){const ly=370+i*76;ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.35);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(84,ly);ctx.lineTo(w-84,ly);ctx.stroke();ctx.restore();
    if(i>=2&&o.empty>0)gv_tint(ctx,84,ly-62,w-168,58,GV.grey,0.55*o.empty);}
  if(o.aw>0)pen=cw_hand(ctx,"awards?",96,354,{size:42,col:[96,90,88],p:o.aw});
  // the scribble: a pencil line that wanders, too small to read
  const sc=o.scrib||0;if(sc>0){const R=wc_rng(77),pts=[];for(let i=0;i<=40;i++){const u=i/40;pts.push([96+u*520,428+Math.sin(u*38)*7+(R()-0.5)*5]);}const n=Math.max(2,Math.round(pts.length*clamp(sc,0,1)));
    ctx.save();ctx.strokeStyle=rgba([96,90,88],0.8);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<n;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();ctx.restore();pen=pts[n-1];}
  gv_lines(ctx,56,760,w-300,2,36,0.7);return pen;}

// The change board's calendar on the meeting room's wall (900 wide at (0, 0)): "Change board · once a month", a month of days, the
// board's day ringed in red (o.ring), and, as they're told, the draft submission's gold card on a day before it (o.draft, 0 to 1 as it
// lands), today ringed in gold (o.today), the red rings fading (o.fade) and one note staying, "for a change that needs it" (o.note)
const CW_CAL={w:900,h:760,day:[2,1],board:[3,3],today:[1,1]};
function cw_calCell(c,r){return[60+c*112+56,236+r*100+50];}
function cw_calendar(ctx,o){o=o||{};const {w,h}=CW_CAL;ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(60,50,40,0.22)";ctx.fillRect(10,16,w,h);ctx.restore();
  wc_flat(ctx,wc_rect(0,0,w,h),GV.paper,1,"page");ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([150,170,200],1);ctx.fillRect(0,0,w,120);ctx.restore();
  cw_T(ctx,"Change board · once a month",w/2,78,{w:800,size:44,align:"center",col:WC_DARK});gv_pin(ctx,w/2,-8,GV.red,1.4);
  ["M","T","W","T","F","S","S"].forEach((d,c)=>cw_T(ctx,d,60+c*112+56,190,{w:700,size:28,align:"center",col:WC_MUTED}));
  ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.28);ctx.lineWidth=1.6;for(let r=0;r<=5;r++){ctx.beginPath();ctx.moveTo(60,236+r*100);ctx.lineTo(w-56,236+r*100);ctx.stroke();}ctx.restore();
  for(let r=0;r<5;r++)for(let c=0;c<7;c++){const n=r*7+c+1;if(n>31)continue;cw_T(ctx,String(n),60+c*112+14,236+r*100+38,{w:600,size:28,col:c>4?[160,150,140]:WC_INK});}
  // the board's day, ringed in red, and next month's, at the foot; they fade when the board meets only when a change needs it
  const fade=1-(o.fade||0),[bx,by]=cw_calCell(...CW_CAL.board);if(o.ring>0)withA(ctx,fade,()=>wc_ring(ctx,bx,by,46,38,o.ring,{col:GV.redInk,lw:5,seed:13}));
  if(o.draft>0){const e=easeCam(clamp(o.draft,0,1)),[dx,dy]=cw_calCell(...CW_CAL.day);ctx.save();ctx.translate(lerp(dx+260,dx,e),lerp(dy-90,dy,e));ctx.rotate(-0.05*(1-e));
    withA(ctx,clamp(o.draft*2,0,1),()=>{wc_panel(ctx,-100,-36,200,72,{kind:"card",wash:GV.gold,washA:0.55,seed:51});cw_T(ctx,"draft",0,-4,{w:800,size:28,align:"center",col:GV.goldInk});cw_T(ctx,"submission",0,26,{w:700,size:28,align:"center",col:GV.goldInk});});ctx.restore();}
  if(o.today>0){const [tx,ty]=cw_calCell(...CW_CAL.today);wc_ring(ctx,tx,ty,48,40,o.today,{col:GV.goldInk,lw:6,seed:17});}
  // the note that goes over "once a month" in its name: the board meets for a change that needs it
  if(o.note>0){const k=0.9+0.1*spring(fin(o.note,0,1));ctx.save();ctx.translate(664,64);ctx.rotate(-0.025);ctx.scale(k,k);withA(ctx,clamp(o.note*2,0,1),()=>wc_tag(ctx,0,0,"for a change that needs it",{align:"center",size:32,wash:GV.gold,washA:0.55}));ctx.restore();}}
// the meeting room's wall close, for its calendar, which hangs between the whiteboard and the screen: plaster, the whiteboard's edge
// and a corner of its notes on the left, the screen's bezel on the right. CW_CW: where the calendar hangs, and its scale
const CW_CW={x:510,y:64,k:1};
function cw_paintCalWall(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.meet,{kind:"plaster",line:false,seed:85});gv_lightGlow(ctx,900,-80,900);
  wc_part(ctx,wc_rect(-80,30,420,1000),GV.metal,1,{lw:1.2});wc_flat(ctx,wc_rect(-80,46,404,968),[250,251,250],1,"board");const R=wc_rng(19);
  for(let i=0;i<4;i++)gv_note(ctx,110+(i%2)*130+(R()-0.5)*10,200+Math.floor(i/2)*170+(R()-0.5)*10,112,GV_NOTE[(i+1)%4],(R()-0.5)*0.12,60+i);
  ctx.save();ctx.strokeStyle=rgba([60,110,170],0.6);ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(60,110);ctx.lineTo(250,114);ctx.stroke();ctx.restore();
  wc_part(ctx,wc_rect(1560,70,460,560),GV.bezel,1,{kind:"thing"});wc_flat(ctx,wc_rect(1590,100,440,500),[230,234,240],1,"screen");}
// the calendar, small, on the meeting room's wall, between the whiteboard and the screen
function cw_calSmall(ctx,o){ctx.save();ctx.translate(796,196);ctx.scale(0.122,0.122);cw_calendar(ctx,o);ctx.restore();}

// Yusuf's shelf: the binders on its two middle shelves, numbered 1 to 34 along each row from the left, as Off the shelf draws them;
// five have gone to the work (2, 6, 9, 12 and 15), and binder 19, the film's own, is in Yusuf's hands while o.out19 is set
const CW_BIND={w:24,h:146,gap:26.6,x:1393,cols:[[96,118,150],[150,90,80],[120,140,104],[186,160,110],[132,136,150],[110,96,130]],gone:[1,5,8,11,14]};
const cw_bindCol=i=>CW_BIND.cols[Math.floor(hash(i,17)*CW_BIND.cols.length)];
function cw_binders(ctx,o){o=o||{};const B=CW_BIND;for(let i=0;i<34;i++){if(B.gone.includes(i)||(i===18&&o.out19))continue;const row=i<17?0:1,x=B.x+(i%17)*B.gap,y=GV_OFF.shelf.rows[1+row],u=i===18?(o.lift||0):0;
  ctx.save();ctx.translate(0,-10*u);gv_binder(ctx,x-u*3,y-B.h,B.w+u*6,B.h,cw_bindCol(i));if(i===18&&o.glow>0){ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+B.w/2,y-B.h*0.55,80,[255,206,110],0.55*o.glow);}ctx.restore();}}
// Yusuf's office with the newest DMBOK standing at the end of his desk, as every film that shows the office draws it
function cw_paintOffice(ctx){gv_paintOffice(ctx);gv_deskBook(ctx);}
// a binder in both hands, its label the film's title (in the figure's units, like the series' heldBinder), as Who may see it draws it
function cw_heldTitled(lines,col){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+4);cx.rotate(-0.06);
  const w=168,h=214;cx.fillStyle=rgba(mix(col,[0,0,0],0.35),1);rr(cx,-w/2+9,-h/2+7,w,h,10);cx.fill();
  const g=cx.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,rgba(mix(col,[255,255,255],0.28),1));g.addColorStop(1,rgba(col,1));cx.fillStyle=g;rr(cx,-w/2,-h/2,w,h,10);cx.fill();
  cx.fillStyle="rgba(250,246,236,0.95)";for(let i=0;i<7;i++)cx.fillRect(w/2-2,-h/2+12+i*5,10,3.2);
  cx.fillStyle="rgba(255,252,242,0.97)";rr(cx,-w/2+12,-h/2+22,w-24,124,10);cx.fill();
  cx.fillStyle=rgba(mix(col,[0,0,0],0.5),1);cx.textAlign="center";cx.font=font(800,27);lines.forEach((s,i)=>cx.fillText(s,0,-h/2+58+i*34-(lines.length-3)*17));cx.restore();
  fingers(cx,P_,[[mx-w/2+4,my+30],[mx+w/2-2,my+24]]);};}
// binder 19 open on Yusuf's desk, seen from above, as Who may see it draws binder 6: the inside of its cover on the left, policy 19's
// first page on the right, the rings between them. The paper is kept; the words are drawn every frame: "Policy 19 · Change
// management", its first line, 19.1, lit gold (o.lit), and the three lines after it, too small to read. o.lift (0 to 1) lifts 19.1
// off the page as a gold card, which leaves towards the top right (o.go, 0 to 1)
const CW_OB={x:250,y:96,w:1420,h:800};
function cw_openBinderC(){const B=CW_OB,col=cw_bindCol(18);return wc_kept("cwOpenBinder",B.w+80,B.h+80,q=>{q.translate(40,40);const w=B.w,h=B.h,m=w/2;
  q.save();q.filter="blur(10px)";q.fillStyle="rgba(60,44,30,0.3)";q.fillRect(12,18,w,h);q.restore();
  wc_wash(q,wc_rrPts(0,0,w,h,14),col,{kind:"cover",lw:1.6,seed:191});wc_wash(q,wc_rrPts(22,22,m-38,h-44,8),wc_lit(col,0.22),{kind:"swatch",line:false,a:0.7,seed:192});
  wc_part(q,wc_rect(70,h-330,m-150,250),wc_lit(col,0.4),1,{seed:193});wc_flat(q,wc_rect(110,h-300,m-230,120),WC_CARD,1,"card");
  q.fillStyle=rgba(WC_MUTED,0.3);for(let i=0;i<3;i++)q.fillRect(136,h-268+i*28,(m-290)*(i===2?0.5:0.9),5);
  for(let i=3;i>=1;i--)wc_flat(q,wc_rect(m+16+i*3,20+i*3,m-46,h-40),wc_dim(GV.paper,0.05*i),1,"pages");
  wc_wash(q,wc_rect(m+16,20,m-46,h-40),GV.paper,{kind:"page",lw:1.3,seed:194});
  for(const y of [140,h/2,h-140])wc_wash(q,wc_ell(m+52,y,13,13,20),wc_dim(GV.oak,0.12),{kind:"thing",lw:1.1,seed:y|0});
  wc_part(q,wc_rrPts(m-26,60,52,h-120,18),GV.metal,1,{kind:"thing",seed:195});
  for(const y of [140,h/2,h-140]){q.save();q.strokeStyle=rgba(wc_dim(GV.metal,0.35),0.95);q.lineWidth=11;q.lineCap="round";q.beginPath();q.ellipse(m+10,y,46,15,0,Math.PI*0.95,Math.PI*2.05);q.stroke();
    q.strokeStyle="rgba(255,255,255,0.55)";q.lineWidth=3;q.beginPath();q.ellipse(m+10,y-3,44,12,0,Math.PI*1.1,Math.PI*1.6);q.stroke();q.restore();}});}
const cw_obX=()=>CW_OB.x+CW_OB.w/2+100,CW_OBL=["Changes are assessed for impact","before they are made."];
function cw_binder19(ctx,o){o=o||{};const B=CW_OB,x=cw_obX(),lift=easeCam(clamp(o.lift||0,0,1));ctx.drawImage(cw_openBinderC(),B.x-40,B.y-40);
  cw_T(ctx,"Policy 19 · Change management",x,B.y+130,{w:800,size:40,col:WC_DARK,max:560});
  gv_tint(ctx,x-18,B.y+226,600,112*(1-lift),GV.gold,0.75*(o.lit||0)*(1-lift));
  if(lift<0.99)withA(ctx,1-lift,()=>{cw_T(ctx,"19.1",x,B.y+268,{w:700,size:30,col:WC_MUTED});CW_OBL.forEach((s,i)=>cw_T(ctx,s,x+70,B.y+268+i*46,{w:600,size:30,col:WC_INK}));});
  for(let i=0;i<3;i++){const yy=B.y+400+i*110;cw_T(ctx,"19."+(i+2),x,yy,{w:700,size:24,col:WC_MUTED});gv_lines(ctx,x+70,yy-14,470,2,34,0.9);}
  if(lift>0.01){const g=easeCam(clamp(o.go||0,0,1)),cx=x+300+g*700,cy=lerp(B.y+290,B.y+250,lift)-g*520,k=lerp(1,1.08,lift)*(1-0.25*g);
    ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);ctx.rotate(-0.04*lift);withA(ctx,clamp(lift*3,0,1),()=>{ctx.save();ctx.filter="blur(12px)";ctx.fillStyle="rgba(60,40,20,0.3)";ctx.fillRect(-300,-50+14*lift,610,140);ctx.restore();
      wc_panel(ctx,-320,-72,640,150,{kind:"card",wash:GV.gold,washA:0.5,seed:57});cw_T(ctx,"19.1",-290,-16,{w:800,size:30,col:GV.goldInk});
      CW_OBL.forEach((l,j)=>cw_T(ctx,l,-210,-16+j*44,{w:600,size:30,col:WC_DARK}));});ctx.restore();}}
/* ---------- 3 · Who uses what ---------- */
// the data team's board, close and wide: cork across the frame, so the table's card, the register's page and the tags beside its
// lines all fit, each at a size that reads. cw_bd: where a point of this close-up is on the room's board (GV_DT.board)
function cw_paintBoardWide(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.data,{kind:"plaster",line:false,seed:71});
  gv_lightGlow(ctx,960,-80,900);gv_cork(ctx,40,40,1840,860,34);}
const cw_bd=(bx,by)=>[665+(bx-960)*0.234,340+(by-470)*0.234];
// the table's card on the board: its name, and what it holds (at x, y in the close-up; 450 by 230)
function cw_credCard(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{wc_panel(ctx,x,y,450,230,{kind:"card",seed:71});gv_pin(ctx,x+225,y+14,GV.red,1.3);
  cw_T(ctx,"Credentials",x+30,y+88,{w:800,size:46,col:WC_DARK});cw_T(ctx,"every award, microcredential",x+30,y+148,{w:600,size:30,col:WC_INK,max:392});
  cw_T(ctx,"and badge learners hold",x+30,y+192,{w:600,size:30,col:WC_INK,max:392});});}
const CW_CARD=[60,220],CW_PAGE=[540,100,1000];
// the register's page "Who uses what" (the series' gv_register), each line written by hand by its owner: pr[i] (0 to 1) writes line i,
// its three cells in turn, each in a size that fits its column; o.foot (0 to 1) writes "kept by the data team" at its foot; o.rows, its
// lines when a team has added one (CW_WHO6), o.inks a line's own ink. Returns where the pen is, while a line or the foot is being written
const CW_WHO=[["draft submission","credentials","Mei Tanaka"],["census report","credentials","Clara Jensen"],["near-award dashboard","learners near an award","Clara Jensen"],
  ["wallet app","credentials","Marta Nowak"],["forecast","credit towards an award","Finance"]],CW_WHOC=[["report or app",0.355],["uses",0.39],["owner",0.255]],
  CW_WHO6=CW_WHO.concat([["faculty dashboard","credentials","Anil Kurian"]]),CW_INK6=[null,null,null,null,null,[58,48,44]];
function cw_who(ctx,x,y,w,pr,o){o=o||{};const k=w/1000,rows=o.rows||CW_WHO;gv_register(ctx,x,y,w,Object.assign({kicker:"University register",title:"Who uses what",cols:CW_WHOC,rows:rows.map(()=>["","",""]),
    foot:" ",footP:0},o.reg||{}));const cx=[48];CW_WHOC.forEach(([,sh],i)=>cx.push(cx[i]+904*sh));let pen=null;
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  rows.forEach((r,i)=>{const p=pr[i]==null?1:pr[i];if(p<=0)return;const L=r.map(s=>s.length),T=L[0]+L[1]+L[2],ty=GV_REG.head+22+GV_REG.row*i+44;let acc=0;
    r.forEach((s,j)=>{const q=clamp((p*T-acc)/L[j],0,1);acc+=L[j];if(q<=0)return;const x0=(j?cx[j]+16:48)+4,room=cx[j+1]-x0-12,sz=Math.min(30,30*room/tw(ctx,s,30,600));
      const e=cw_hand(ctx,s,x0,ty,{size:sz,p:q,col:o.inks&&o.inks[i]});if(q<1)pen=e;});});
  const fp=o.foot||0;if(fp>0){const e=cw_hand(ctx,"kept by the data team",56,GV_REG.head+22+GV_REG.row*rows.length+64,{size:32,p:fp});if(fp<1)pen=e;}
  ctx.restore();return pen?[x+pen[0]*k,y+pen[1]*k]:null;}
// the same page, seen across the room: paper, its name as a bar, its lines as bars (n written), the foot
function cw_pageSmall(ctx,x,y,w,n,foot){const h=w*0.674;gv_sheet(ctx,x,y,w,h);ctx.save();ctx.fillStyle=rgba(WC_DARK,0.6);ctx.fillRect(x+w*0.05,y+h*0.12,w*0.42,h*0.05);
  ctx.fillStyle=rgba(WC_MUTED,0.5);ctx.fillRect(x+w*0.05,y+h*0.27,w*0.9,2);for(let i=0;i<5;i++){const ly=y+h*(0.36+i*0.098);ctx.fillStyle=rgba(WC_MUTED,0.25);ctx.fillRect(x+w*0.05,ly+h*0.05,w*0.9,1.5);
    if(i<n){ctx.fillStyle=rgba(GV_SIGN.ink,0.6);ctx.fillRect(x+w*0.06,ly,w*0.26,h*0.028);ctx.fillRect(x+w*0.4,ly,w*0.3,h*0.028);ctx.fillRect(x+w*0.76,ly,w*0.16,h*0.028);}}
  if(foot>0){ctx.fillStyle=rgba(GV_SIGN.ink,0.6);ctx.fillRect(x+w*0.06,y+h*0.9,w*0.4*foot,h*0.03);}ctx.restore();gv_pin(ctx,x+w/2,y+6,GV.red,0.6);}
// the card and the page on the board, as the room sees them; o.page: the page is up, with o.n lines written
function cw_boardSmall(ctx,o){o=o||{};const [cx,cy]=cw_bd(...CW_CARD);ctx.save();ctx.translate(cx,cy);ctx.scale(0.234,0.234);cw_credCard(ctx,0,0,1);ctx.restore();
  if(o.page){const [px,py]=cw_bd(CW_PAGE[0],CW_PAGE[1]);cw_pageSmall(ctx,px,py,CW_PAGE[2]*0.234,o.n||0,o.foot||0);}}
// a question mark drawn in pencil, top to bottom (p 0 to 1), s high; returns where the pencil is
function cw_qDraw(ctx,x,y,s,p){if(p<=0)return null;const e=easeCam(clamp(p,0,1));ctx.save();ctx.beginPath();ctx.rect(x-s,y-s*1.05,s*2,s*1.2*e);ctx.clip();
  ctx.translate(x,y);ctx.transform(1,0,-0.12,1,0,0);wc_T(ctx,"?",0,0,{w:500,size:s,align:"center",col:[96,90,88]});ctx.restore();return[x+s*0.12*Math.sin(e*7),y-s*1.05+s*1.1*e];}
// the page in an owner's hands, on a clipboard, as they write their line
function cw_heldPage(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx-14,my+64);cx.rotate(-0.14);
  cx.fillStyle=rgba(GV_HOLD.walnut,1);rr(cx,-92,-118,184,236,10);cx.fill();cx.fillStyle="#fffdf6";rr(cx,-82,-102,164,212,5);cx.fill();cx.fillStyle="rgba(170,176,190,1)";rr(cx,-28,-128,56,22,5);cx.fill();
  cx.fillStyle=rgba(WC_DARK,0.7);cx.fillRect(-68,-84,92,10);cx.fillStyle="rgba(120,130,160,0.55)";for(let i=0;i<6;i++)cx.fillRect(-68,-54+i*26,136,2);
  cx.fillStyle="rgba(40,52,100,0.75)";for(let i=0;i<3;i++)cx.fillRect(-64,-66+i*26,96-i*12,4);cx.restore();
  cx.save();cx.strokeStyle="rgb(36,48,82)";cx.lineWidth=9;cx.lineCap="round";cx.beginPath();cx.moveTo(r[0]-6,r[1]+44);cx.lineTo(r[0]+26,r[1]+90);cx.stroke();cx.restore();fingers(cx,P_,[[mx-104,my+72],[r[0],r[1]+74]]);}
// the change request with its impact note clipped on top, held in both hands
function cw_heldNote(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+40);cx.rotate(-0.05);const w=150,h=200;
  cx.fillStyle="rgba(60,50,40,0.22)";cx.fillRect(-w/2+5,-h/2+6,w,h);cx.fillStyle="rgb(252,250,244)";cx.fillRect(-w/2,-h/2,w,h);cx.fillStyle=rgba(wc_lit(GV.cyanInk,0.72),1);cx.fillRect(-w/2+6,-h/2+6,w-12,24);
  cx.translate(14,16);cx.fillStyle="rgba(60,50,40,0.2)";cx.fillRect(-w/2+4,-h/2+5,w-10,h-14);cx.fillStyle="rgb(250,248,240)";cx.fillRect(-w/2,-h/2,w-10,h-14);cx.fillStyle=rgba(wc_lit(GV.gold,0.6),1);cx.fillRect(-w/2+5,-h/2+5,w-20,22);
  cx.fillStyle=rgba(WC_MUTED,0.4);for(let i=0;i<4;i++)cx.fillRect(-w/2+12,-h/2+44+i*28,(w-34)*(i%2?0.6:0.85),4);cx.fillStyle=rgba(GV.redInk,0.7);cx.fillRect(-w/2+20,-h/2+100,46,14);cx.restore();
  fingers(cx,P_,[[mx-w/2+6,my+50],[mx+w/2-6,my+46]]);}
// Finance's note, a yellow sticky on the page's corner, which Jun copies in
function cw_finNote(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(0.05);ctx.fillStyle="rgba(70,60,50,0.18)";ctx.fillRect(-116,-106,236,220);
  wc_wash(ctx,wc_rect(-120,-112,236,220),GV_NOTE[0],{kind:"swatch",seed:88});cw_hand(ctx,"Finance:",-96,-54,{size:36,col:[60,54,70]});cw_hand(ctx,"forecast,",-96,-6,{size:32,col:[60,54,70]});
  cw_hand(ctx,"credit towards",-96,40,{size:30,col:[60,54,70]});cw_hand(ctx,"an award",-96,82,{size:30,col:[60,54,70]});ctx.restore();});}

/* ---------- 4 · The impact note ---------- */
// the impact note clipped to the change request (880 by 800 at (0, 0)): its name and three headings, written by hand as each is said
// (o.heads, 0 to 1 each); under the first, what it reaches (o.reach: lines, o.reachP: 0 to 1 as written); under the second, the stamp
// (o.stamp, o.stampP, its colour o.stampCol) and the owner's initials (o.mt), or "no" and a green tick (o.no); under the third, who
// must be told (o.names: lines, o.namesP). o.clip draws the clip that holds it at its top left. Returns where the pen is
const CW_IN={w:880,h:800};
function cw_impact(ctx,o){o=o||{};const {w,h}=CW_IN;gv_sheet(ctx,0,0,w,h,{rot:0.012});let pen=null;
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.gold,0.78),1);ctx.fillRect(16,16,w-32,100);ctx.restore();
  cw_T(ctx,"Impact note",48,86,{w:800,size:50,col:WC_DARK});
  const H=[["What it reaches",186],["Does it break?",420],["Who must be told",600]],hp=o.heads||[1,1,1];
  H.forEach(([s,y],i)=>{const q=hp[i]==null?1:hp[i];if(q<=0)return;const e=cw_hand(ctx,s,48,y,{size:40,p:q,col:WC_DARK});if(q<1)pen=e;});
  const list=(L,P_,y0,gap,sz)=>{const T=L.reduce((a,l)=>a+l.length,0);let acc=0;L.forEach((l,i)=>{const q=clamp(((P_==null?1:P_)*T-acc)/l.length,0,1);acc+=l.length;if(q<=0)return;
    const e=cw_hand(ctx,l,72,y0+i*gap,{size:sz||32,p:q});if(q<1)pen=e;});};
  if(o.reach)list(o.reach,o.reachP,240,44);if(o.names)list(o.names,o.namesP,656,44);
  // a note for another change, its lines too small to read, as on an ordinary day
  if(o.bars){ctx.save();ctx.fillStyle=rgba(GV_SIGN.ink,0.42);[[240,0.62],[284,0.4],[656,0.5],[700,0.34]].forEach(([y,f])=>ctx.fillRect(72,y-14,(w-150)*f,6));ctx.restore();}
  if(o.no>0){const e=cw_hand(ctx,"no",72,486,{size:44,p:clamp(o.no*2,0,1),col:GV.greenInk});if(o.no<0.5)pen=e;wc_tick(ctx,160,470,56,GV.greenInk,clamp(o.no*2-1,0,1),7);}
  if(o.stampP>0){gv_stamp(ctx,250,484,"breaks",o.stampP,{col:GV.redInk,size:44,rot:-0.07});}
  if(o.mt>0){const e=cw_hand(ctx,"MT",420,500,{size:40,p:o.mt,col:GV_SIGN.ink});if(o.mt<1)pen=e;}
  if(o.clip!==false){ctx.save();ctx.strokeStyle="rgba(150,154,166,1)";ctx.lineWidth=7;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-14,-30);ctx.lineTo(-14,60);ctx.lineTo(16,60);ctx.lineTo(16,-14);ctx.lineTo(0,-14);ctx.lineTo(0,40);ctx.stroke();ctx.restore();}
  return pen;}
const CW_REACH1=["draft submission · census report","near-award dashboard · forecast","wallet app"],CW_NAMES1=["Mei Tanaka · Clara Jensen","Finance · Marta Nowak"];
// a quick look at an owner: a round window on them (r its radius), their room's wall behind; a word in place of a person for Finance (o.nod: their nod)
function cw_cameo(ctx,x,y,r,id,a,o){if(a<=0.01)return;o=o||{};const k=0.86+0.14*spring(clamp(a,0,1));ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(a*1.6,0,1),()=>{
  ctx.save();ctx.filter="blur(8px)";ctx.fillStyle="rgba(50,40,30,0.3)";ctx.beginPath();ctx.arc(4,8,r,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.clip();ctx.fillStyle=rgba(o.wall||GV_ROOM.reg,1);ctx.fillRect(-r,-r,2*r,2*r);
  if(id){const k=r/78;person(ctx,id,0,476*k,k,{pose:"listen",t:o.t||0,expr:"calm",nod:o.nod||0});}else{ctx.fillStyle=rgba(GV.paper,1);ctx.fillRect(-r,-r,2*r,2*r);wc_T(ctx,o.word||"",0,12,{w:800,size:o.size||30,align:"center",col:WC_DARK});}
  ctx.restore();ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();ctx.restore();});ctx.restore();}
// a small tag beside a line of the register: green "asked for it", grey "didn't ask", springing in as it lands (a: 0 to 1)
function cw_lineTag(ctx,x,y,s,col,ink,a){if(a<=0.01)return;const k=0.8+0.2*spring(clamp(a,0,1));ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  withA(ctx,clamp(a*2,0,1),()=>wc_tag(ctx,0,10,s,{align:"left",size:30,wash:col,washA:0.55,col:ink}));ctx.restore();}
// a gold wash on line i of the register's page (at x, y, w), a: how lit
function cw_lineGold(ctx,x,y,w,i,a){if(a<=0.01)return;const k=w/1000;ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.gold,0.6),a);
  wc_tr(ctx,wc_rrPts(x+40*k,y+(GV_REG.head+22+GV_REG.row*i+4)*k,920*k,(GV_REG.row-8)*k,8*k));ctx.fill();ctx.restore();}
const cw_rowY=(y,w,i)=>y+(GV_REG.head+22+GV_REG.row*i+33)*w/1000;

/* ---------- 5 · Breaking or not? ---------- */
// Clara's wall screen in Planning, close: the wall, the screen's bezel; what it shows is drawn every frame (CW_DS: the screen)
const CW_DS=[200,60,1520,820];
function cw_paintPlanScreen(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.plan,{kind:"plaster",line:false,seed:77});gv_lightGlow(ctx,960,-80,900);
  const [x,y,w,h]=CW_DS;ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(50,44,40,0.3)";ctx.fillRect(x+10,y+18,w,h);ctx.restore();
  wc_part(ctx,wc_rect(x-22,y-22,w+44,h+44),GV.bezel,1,{kind:"thing"});wc_flat(ctx,wc_rect(x,y,w,h),[250,250,247],1,"screen");}
// Clara's dashboard of learners near an award, plain as a printed page (in the close-up's units, on CW_DS): its name, the count, and
// one learner's credit towards an award as a bar in two parts, units passed and microcredentials, against the line where an award
// starts. o.rel (0 to 1): the 6-point microcredential becomes "award"; o.drop (0 to 1): it falls out of the bar, which shortens, and
// the count blurs and shifts
function cw_dash(ctx,o){o=o||{};const [x,y,w,h]=CW_DS,rel=clamp(o.rel||0,0,1),dr=easeCam(clamp(o.drop||0,0,1));
  cw_T(ctx,"Learners near an award",x+60,y+96,{w:800,size:50,col:WC_DARK});
  // the count, top right: it blurs while it changes
  const bl=Math.sin(Math.PI*dr),n=Math.round(lerp(214,176,dr));ctx.save();if(bl>0.02)ctx.filter="blur("+(7*bl).toFixed(1)+"px)";
  cw_T(ctx,String(n),x+w-60,y+120,{w:800,size:96,align:"right",col:WC_DARK});ctx.restore();cw_T(ctx,"learners",x+w-60,y+168,{w:600,size:30,align:"right",col:WC_MUTED});
  ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+60,y+200);ctx.lineTo(x+w-60,y+200);ctx.stroke();ctx.restore();
  cw_T(ctx,"one learner's credit towards an award",x+60,y+284,{w:600,size:32,col:WC_MUTED});
  // the line where an award starts
  const ax=x+1340,by=y+360,bh=130;ctx.save();ctx.strokeStyle=rgba(GV.goldInk,0.8);ctx.lineWidth=4;ctx.setLineDash([14,10]);ctx.beginPath();ctx.moveTo(ax,by-50);ctx.lineTo(ax,by+bh+30);ctx.stroke();ctx.restore();
  cw_T(ctx,"award",ax,by-64,{w:700,size:32,align:"center",col:GV.goldInk});
  // units passed, then two microcredentials
  const U=[x+60,560],M1=[x+620,330],M2=[x+950,330];wc_part(ctx,wc_rect(U[0],by,U[1],bh),[120,160,176],1,{seed:401});
  cw_T(ctx,"units passed",U[0]+U[1]/2,by+bh+52,{w:600,size:32,align:"center",col:WC_INK});
  wc_part(ctx,wc_rect(M1[0],by,M1[1]-6,bh),[226,196,140],1,{seed:402});cw_T(ctx,"microcredential · 4",M1[0]+(M1[1]-6)/2,by+bh/2+11,{w:700,size:30,align:"center",col:WC_DARK});
  // the 6-point one: relabelled, it turns into an award and drops out of the bar
  ctx.save();ctx.translate(0,dr*340);ctx.rotate(0.12*dr);withA(ctx,1-dr*0.9,()=>{const col=mix([226,196,140],[214,206,200],rel);wc_part(ctx,wc_rect(M2[0],by,M2[1]-6,bh),col,1,{seed:403});
    if(rel<1)withA(ctx,1-rel,()=>cw_T(ctx,"microcredential · 6",M2[0]+(M2[1]-6)/2,by+bh/2+11,{w:700,size:30,align:"center",col:WC_DARK}));
    if(rel>0)withA(ctx,rel,()=>cw_T(ctx,"award",M2[0]+(M2[1]-6)/2,by+bh/2+12,{w:800,size:36,align:"center",col:GV.redInk}));});ctx.restore();
  const mw=M1[1]+M2[1]*(1-dr);ctx.save();ctx.strokeStyle=rgba(WC_INK,0.6);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(M1[0],by+bh+18);ctx.lineTo(M1[0],by+bh+28);ctx.lineTo(M1[0]+mw-6,by+bh+28);ctx.lineTo(M1[0]+mw-6,by+bh+18);ctx.stroke();ctx.restore();
  cw_T(ctx,"microcredentials",M1[0]+(mw-6)/2,by+bh+64,{w:600,size:32,align:"center",col:WC_INK});
  // the other learners near an award, a bar each, too small to read
  ctx.save();ctx.globalAlpha*=0.5;[0.86,0.74,0.92].forEach((f,i)=>{const yy=by+bh+120+i*58;ctx.fillStyle=rgba([120,160,176],0.7);ctx.fillRect(U[0],yy,U[1]*f,30);
    ctx.fillStyle=rgba([226,196,140],0.8);ctx.fillRect(U[0]+U[1]*f+4,yy,(ax-U[0]-U[1]*f)*(0.5+0.12*i),30);});ctx.restore();}
// the dashboard on Planning's wall screen, seen across the room
function cw_dashSmall(ctx,o){const [x,y,w]=CW_DS,[sx,sy,sw]=GV_PL.screen,k=sw/w;ctx.save();ctx.translate(sx-x*k,sy-y*k);ctx.scale(k,k);ctx.fillStyle="rgb(250,250,247)";ctx.fillRect(x,y,w,CW_DS[3]);cw_dash(ctx,o);ctx.restore();}
// Finance's forecast, a printed chart pinned beside its line on the register: its name, four bars and the line through them; o.shift (0 to 1) moves them down
function cw_forecast(ctx,x,y,o){o=o||{};const w=300,h=230,sh=easeCam(clamp(o.shift||0,0,1));ctx.save();ctx.translate(x,y);ctx.rotate(0.03);
  wc_panel(ctx,0,0,w,h,{kind:"card",seed:91});gv_pin(ctx,w/2,14,GV.red,1.3);cw_T(ctx,"forecast",24,62,{w:800,size:32,col:WC_DARK});
  const H0=[96,118,132,150],base=h-26;H0.forEach((bh,i)=>{const hh=bh*(1-0.24*sh*(i/3+0.4));wc_flat(ctx,wc_rect(34+i*62,base-hh,40,hh),[110,140,176],1,"bar");});
  ctx.save();ctx.strokeStyle=rgba(GV.redInk,0.6*sh);ctx.lineWidth=3;ctx.setLineDash([8,6]);ctx.beginPath();H0.forEach((bh,i)=>{const px=54+i*62,py=base-bh-10;i?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.stroke();ctx.restore();
  ctx.restore();}
// a learner's phone in a hand, the wallet app open, its words large: "Data Skills", and its kind, "microcredential", which turns into
// "award" (o.rel, 0 to 1). The campus behind it is out of focus
function cw_paintPhoneBg(ctx){ctx.save();ctx.filter="blur(16px)";ctx.drawImage(gv_place("campus"),-60,-40,W+120,H+80);ctx.restore();ctx.fillStyle="rgba(255,250,240,0.18)";ctx.fillRect(0,0,W,H);}
function cw_phone(ctx,o){o=o||{};const rel=clamp(o.rel||0,0,1),x=700,y=70,w=520,h=1060;ctx.save();ctx.translate(960,600);ctx.rotate(-0.05);ctx.translate(-960,-600);
  ctx.save();ctx.filter="blur(18px)";ctx.fillStyle="rgba(40,30,20,0.35)";rr(ctx,x+24,y+30,w,h,60);ctx.fill();ctx.restore();
  ctx.fillStyle="rgb(36,38,46)";rr(ctx,x,y,w,h,62);ctx.fill();ctx.fillStyle="rgb(248,247,243)";rr(ctx,x+22,y+24,w-44,h-48,44);ctx.fill();
  ctx.fillStyle="rgb(36,38,46)";rr(ctx,x+w/2-60,y+38,120,26,13);ctx.fill();
  cw_T(ctx,"Wallet",x+56,y+140,{w:800,size:40,col:WC_DARK});ctx.fillStyle=rgba(WC_MUTED,0.3);ctx.fillRect(x+56,y+170,w-112,3);
  // the credential's card
  const cx=x+50,cy=y+210,cw=w-100,ch=300;wc_panel(ctx,cx,cy,cw,ch,{kind:"card",wash:rel>0.5?GV.grey:[150,200,196],washA:0.35,seed:93});
  cw_T(ctx,"Data Skills",cx+30,cy+86,{w:800,size:52,col:WC_DARK});
  if(rel<1)withA(ctx,1-rel,()=>cw_T(ctx,"microcredential",cx+30,cy+160,{w:600,size:42,col:WC_INK}));
  if(rel>0)withA(ctx,rel,()=>cw_T(ctx,"award",cx+30,cy+162,{w:800,size:46,col:GV.redInk}));
  ctx.fillStyle=rgba(WC_MUTED,0.28);for(let i=0;i<2;i++)ctx.fillRect(cx+30,cy+210+i*34,cw*(i?0.4:0.62),8);
  ctx.fillStyle=rgba(WC_MUTED,0.22);for(let i=0;i<2;i++){rr(ctx,x+50,y+550+i*120,w-100,92,16);ctx.fill();}
  ctx.restore();
  // the hand holding it: fingers round its left edge, the thumb at its right
  const sk=[214,170,136];ctx.save();ctx.translate(960,600);ctx.rotate(-0.05);ctx.translate(-960,-600);ctx.fillStyle=rgba(sk,1);
  for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(x+6,y+700+i*84,30,40,0.2,0,TAU);ctx.fill();}ctx.beginPath();ctx.ellipse(x+w-4,y+880,34,90,-0.35,0,TAU);ctx.fill();
  ctx.fillStyle=rgba([170,120,100],0.35);ctx.beginPath();ctx.ellipse(x+w-8,y+820,20,26,-0.3,0,TAU);ctx.fill();ctx.restore();}
// the table of credentials, a ruled page (gv_register's ruling): learner, credential, kind, credit points, four rows. o.rel (0 to 1)
// turns row 2's kind into "award", o.red washes that cell red; o.mark (0 to 1) slides in the new column at its right, in green,
// "counts as an award", its yes cells lit violet as o.yes goes 0 to 1
const CW_TB=[360,210,1000],CW_TBR=[["Ana Silva","Graduate Certificate","award","60","yes"],["Tom Reid","Data Skills","microcredential","6","yes"],
  ["Li Wei","Spreadsheet Basics","microcredential","5","no"],["Sara Khan","Library Induction","badge","0","no"]],CW_TBC=[["learner",0.17],["credential",0.36],["kind",0.27],["credit points",0.2]];
function cw_table(ctx,o){o=o||{};const [x,y,w]=o.at||CW_TB,k=w/1000,rel=clamp(o.rel||0,0,1),rows=CW_TBR.map((r,i)=>[r[0],r[1],i===1?"":r[2],r[3]]);
  const R=gv_register(ctx,x,y,w,{kicker:"The data team's table",title:"Credentials",cols:CW_TBC,rows});const cx=[48];CW_TBC.forEach(([,sh],i)=>cx.push(cx[i]+904*sh));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);const ry=GV_REG.head+22+GV_REG.row*1,kx=cx[2]+16;
  if(o.red>0){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.red,0.62),o.red);wc_tr(ctx,wc_rrPts(kx-10,ry+8,cx[3]-kx-6,GV_REG.row-14,8));ctx.fill();ctx.restore();}
  if(rel<1)withA(ctx,1-rel,()=>wc_T(ctx,"microcredential",kx,ry+44,{w:600,size:28,col:WC_DARK}));
  if(rel>0)withA(ctx,rel,()=>wc_T(ctx,"award",kx,ry+44,{w:700,size:30,col:o.red>0.3?GV.redInk:WC_DARK}));ctx.restore();
  const m=easeCam(clamp(o.mark||0,0,1));if(m>0.01){const sx=x+w-8+(1-m)*360,sw=330*k,top=y+(GV_REG.top-30)*k,bot=y+(GV_REG.head+22+GV_REG.row*4+20)*k;
    withA(ctx,clamp(m*1.6,0,1),()=>{ctx.save();ctx.filter="blur(6px)";ctx.fillStyle="rgba(70,60,50,0.2)";ctx.fillRect(sx+6,top+10,sw,bot-top);ctx.restore();
      wc_wash(ctx,wc_rect(sx,top,sw,bot-top),wc_lit(GV.green,0.7),{kind:"page",lw:1.3,seed:95});
      cw_T(ctx,"counts as an award",sx+16*k,y+(GV_REG.head-12)*k,{w:700,size:28*k,col:GV.greenInk,max:sw-24*k});
      ctx.save();ctx.strokeStyle=rgba(GV.greenInk,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx+12,y+(GV_REG.head+6)*k);ctx.lineTo(sx+sw-12,y+(GV_REG.head+6)*k);ctx.stroke();ctx.restore();
      CW_TBR.forEach((r,i)=>{const yy=y+(GV_REG.head+22+GV_REG.row*i)*k,yes=r[4]==="yes";if(yes&&o.yes>0){ctx.save();ctx.fillStyle=rgba(WC_PAPER,o.yes);rr(ctx,sx+10,yy+8*k,sw-20,(GV_REG.row-14)*k,6);ctx.fill();ctx.restore();gv_tint(ctx,sx+10,yy+8*k,sw-20,(GV_REG.row-14)*k,GV_MEAN.violet,0.85*o.yes);}
        cw_T(ctx,r[4],sx+30*k,yy+44*k,{w:yes?800:600,size:30*k,col:yes&&o.yes>0.5?GV_MEANINK.violet:WC_DARK});});});}
  return R;}
// Mei's stamp, held from the right of the frame: its knob in her hand, its base over the paper; p 0 to 1 brings it down, presses at
// 0.5 and lifts it away. Seen from above, it's larger and its shadow further off while it's raised
function cw_stamper(ctx,x,y,p,sleeve,skin){if(p<=0||p>=1)return;const down=p<0.5?easeCam(p/0.5):1-easeCam((p-0.5)/0.5),k=lerp(1.35,1,down),off=lerp(70,8,down),ex=(1-down)*520;
  ctx.save();ctx.translate(x+ex,y-ex*0.3);ctx.save();ctx.filter="blur("+(6+16*(1-down)).toFixed(0)+"px)";ctx.fillStyle="rgba(40,30,20,"+(0.22+0.2*down).toFixed(2)+")";rr(ctx,-150+off,-46+off,300,92,12);ctx.fill();ctx.restore();
  ctx.scale(k,k);wc_part(ctx,wc_rrPts(-150,-46,300,92,12),[120,82,56],1,{seed:97});wc_flat(ctx,wc_rrPts(-130,-30,260,60,8),[150,108,76],1,"wood");
  ctx.lineCap="round";ctx.strokeStyle=rgba(sleeve,1);ctx.lineWidth=80;ctx.beginPath();ctx.moveTo(700,-120);ctx.quadraticCurveTo(320,-60,90,-10);ctx.stroke();
  ctx.fillStyle=rgba([196,150,110],1);ctx.beginPath();ctx.arc(0,0,44,0,TAU);ctx.fill();ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.ellipse(40,-6,70,48,-0.15,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(wc_dim(skin,0.25),0.6);for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(-8+i*4,-34+i*30,18,12,0.2,0,TAU);ctx.fill();}ctx.restore();}

/* ---------- 6 · Add, don't break ---------- */
// Mei's business rule for award, on a card, as One word, one home draws it: its number in the glossary's violet (lit with the table's
// yes cells as o.lit goes 0 to 1); 460 by 330 at (x, y)
function cw_ruleCard(ctx,x,y,o){o=o||{};const w=460,h=330,lit=o.lit||0;wc_panel(ctx,x,y,w,h,{kind:"card",seed:497});
  cw_T(ctx,"Business rule · award",x+28,y+56,{w:700,size:30,col:WC_MUTED});ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28,y+80);ctx.lineTo(x+w-28,y+80);ctx.stroke();ctx.restore();
  cw_T(ctx,"A microcredential counts",x+28,y+134,{w:600,size:34,col:WC_DARK});cw_T(ctx,"as an award from",x+28,y+180,{w:600,size:34,col:WC_DARK});
  if(lit>0)gv_tint(ctx,x+20,y+194,tw(ctx,"6 credit points",34,800)+20,48,GV_MEAN.violet,0.8*lit);
  cw_T(ctx,"6 credit points",x+28,y+226,{w:800,size:34,col:GV_MEANINK.violet});cw_T(ctx,".",x+28+tw(ctx,"6 credit points",34,800),y+226,{w:600,size:34,col:WC_DARK});
  cw_T(ctx,"owner · Mei Tanaka",x+28,y+290,{w:600,size:30,col:WC_INK});}
const CW_REACH2=["draft submission · census report","wallet app"],CW_NAMES2=["Mei Tanaka · Clara Jensen","Marta Nowak"];

/* ---------- 7 · The old edition ---------- */
// the shelf by the data team's board, from above: darker wood than a desk, and along the top the wall it stands against
function cw_paintShelf(ctx){cw_paintTop(ctx,{seed:69,wood:[176,128,92]});wc_wash(ctx,wc_rect(-40,-40,W+80,124),GV_ROOM.data,{kind:"plaster",line:false,seed:71});
  ctx.save();const g=ctx.createLinearGradient(0,84,0,150);g.addColorStop(0,"rgba(50,36,24,0.34)");g.addColorStop(1,"rgba(50,36,24,0)");ctx.fillStyle=g;ctx.fillRect(0,84,W,66);ctx.restore();}
// a ledger of the data team's table, open (760 by 720 at (x, y)): its cloth boards under the page, the table's name, its edition on a
// label in the cloth's colour, and what each line holds. o.lines: the lines (all five by default); o.rub (0 to 1) rubs the last one
// out, o.rubA fading the rubbing away again; o.cross (0 to 1) draws a red cross beside it, then "can't be added", o.crossA fading it; o.tag (0 to 1) lays the tag "retires 31 March 2027" on the
// page, tied to the spine, and o.swing (0 to 1) swings it once about its hole and lets it settle
const CW_LG={w:760,h:720,cloth:[[58,82,118],[44,104,112]]},CW_FIELDS=["learner","credential","kind","credit points","date of birth"];
function cw_ledger(ctx,x,y,ed,o){o=o||{};const {w,h}=CW_LG,col=CW_LG.cloth[ed-1],L=o.lines||CW_FIELDS,rule=(x0,x1,ly,a,lw)=>{ctx.save();ctx.strokeStyle=rgba(WC_MUTED,a);ctx.lineWidth=lw;
    ctx.beginPath();ctx.moveTo(x0,ly);ctx.lineTo(x1,ly);ctx.stroke();ctx.restore();};
  ctx.save();ctx.filter="blur(12px)";ctx.fillStyle="rgba(50,36,24,0.3)";ctx.fillRect(x-14,y-8,w+44,h+48);ctx.restore();
  wc_wash(ctx,wc_rect(x-22,y-22,w+44,h+44),col,{kind:"cover",lw:1.4,seed:310+ed});wc_flat(ctx,wc_rect(x-22,y-22,42,h+44),wc_dim(col,0.35),1,"spine");
  gv_sheet(ctx,x+16,y,w-16,h);const g=ctx.createLinearGradient(x+16,0,x+86,0);g.addColorStop(0,"rgba(70,60,50,0.26)");g.addColorStop(1,"rgba(70,60,50,0)");ctx.fillStyle=g;ctx.fillRect(x+16,y,70,h);
  cw_T(ctx,"The data team's table",x+66,y+72,{w:600,size:28,col:WC_MUTED});cw_T(ctx,"Credentials",x+66,y+132,{w:800,size:46,col:WC_DARK});
  const lab="edition "+ed,lw=tw(ctx,lab,34,800)+44,lx=x+w-lw-36;ctx.save();ctx.fillStyle=rgba(wc_lit(col,0.8),1);rr(ctx,lx,y+90,lw,60,12);ctx.fill();ctx.restore();
  cw_T(ctx,lab,lx+22,y+132,{w:800,size:34,col:wc_dim(col,0.25)});rule(x+66,x+w-36,y+176,0.45,2);
  cw_T(ctx,"what each line holds",x+66,y+234,{w:600,size:28,col:WC_MUTED});
  L.forEach((s,i)=>{const ly=y+300+i*66;cw_T(ctx,s,x+66,ly,{w:600,size:38,col:WC_DARK});rule(x+66,x+w-36,ly+22,0.22,1.6);});
  const ly=y+300+(L.length-1)*66,sw=tw(ctx,L[L.length-1],38,600);
  // rubbed out: a smear of graphite, the paper rubbed pale over the words, and crumbs of the rubber below
  if(o.rub>0.01&&(o.rubA==null||o.rubA>0.01))withA(ctx,o.rubA==null?1:o.rubA,()=>{const e=easeCam(clamp(o.rub,0,1)),full=sw+36,rw=full*e,R=wc_rng(77);
    ctx.save();ctx.filter="blur(5px)";ctx.fillStyle="rgba(120,112,112,0.2)";wc_tr(ctx,wc_rrPts(x+46,ly-44,rw+10,62,20));ctx.fill();
    if(rw>16){ctx.filter="blur(3px)";ctx.fillStyle="rgba(238,233,222,0.9)";wc_tr(ctx,wc_rrPts(x+54,ly-37,rw-6,48,16));ctx.fill();}ctx.restore();
    ctx.save();ctx.fillStyle="rgba(190,150,150,0.75)";for(let i=0;i<16;i++){const u=R(),cx_=x+60+u*full,cy_=ly+18+R()*26,rx=3+R()*4,ry=2+R()*2,an=R()*3;
      if(u>e)continue;ctx.beginPath();ctx.ellipse(cx_,cy_,rx,ry,an,0,TAU);ctx.fill();}ctx.restore();});
  // a red cross beside it, in two strokes, then the words
  if(o.cross>0.01&&(o.crossA==null||o.crossA>0.01))withA(ctx,o.crossA==null?1:o.crossA,()=>{const cx0=x+66+sw+70,cy0=ly-13,s=30,a1=easeCam(clamp(o.cross*2.2,0,1)),a2=easeCam(clamp(o.cross*2.2-0.8,0,1)),ta=clamp(o.cross*2-1,0,1);
    ctx.save();ctx.strokeStyle=rgba(GV.redInk,0.92);ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx0-s,cy0-s);ctx.lineTo(cx0-s+2*s*a1,cy0-s+2*s*a1);ctx.stroke();
    if(a2>0){ctx.beginPath();ctx.moveTo(cx0+s,cy0-s);ctx.lineTo(cx0+s-2*s*a2,cy0-s+2*s*a2);ctx.stroke();}ctx.restore();
    if(ta>0)withA(ctx,ta,()=>cw_T(ctx,"can't be added",cx0+s+26,ly,{w:700,size:34,col:GV.redInk}));});
  // the tag, tied to the spine with a string; it turns about its hole
  if(o.tag>0.01){const a=easeCam(clamp(o.tag,0,1)),q=clamp(o.swing||0,0,1),rot=-0.05+(q>0&&q<1?0.24*Math.sin(q*TAU*1.5)*Math.exp(-3.2*q):0),hx=x+110,hy=y+h-82,k=lerp(1.12,1,a);
    withA(ctx,a,()=>{ctx.save();ctx.strokeStyle="rgba(236,228,210,0.95)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-4,y+h-170);ctx.quadraticCurveTo(x+24,y+h-60,hx,hy);ctx.stroke();ctx.restore();
      ctx.save();ctx.translate(hx,hy);ctx.rotate(rot);ctx.scale(k,k);const tl=450,th=96;ctx.save();ctx.filter="blur(6px)";ctx.fillStyle="rgba(50,36,24,0.3)";ctx.fillRect(-24,-th/2+10,tl+10,th);ctx.restore();
        wc_part(ctx,[[-32,-th/2+24],[-8,-th/2],[tl-20,-th/2],[tl-20,th/2],[-8,th/2],[-32,th/2-24]],[228,200,146],1);
        ctx.fillStyle="rgb(250,246,236)";ctx.beginPath();ctx.arc(0,0,13,0,TAU);ctx.fill();ctx.fillStyle="rgba(60,50,40,0.5)";ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();
        cw_T(ctx,"retires 31 March 2027",32,12,{w:700,size:34,col:WC_DARK});ctx.restore();});}}

/* ---------- 8 · In their words ---------- */
// Jun's note in the data team's words (700 by 380 at (0, 0)), "in our words"; o.strike (0 to 1) strikes its lines through in pencil,
// one after another
const CW_OURS=["Additive change to credentials,","edition 2: new yes-or-no mark,","counts as an award."];
function cw_ourNote(ctx,o){o=o||{};gv_sheet(ctx,0,0,700,380,{rot:-0.01});cw_T(ctx,"in our words",56,72,{w:600,size:30,col:WC_MUTED});
  CW_OURS.forEach((s,i)=>cw_hand(ctx,s,56,160+i*60,{size:36}));const st=clamp(o.strike||0,0,1);if(st<=0)return;
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=3.5;ctx.lineCap="round";CW_OURS.forEach((s,i)=>{const q=easeCam(clamp(st*CW_OURS.length-i,0,1));if(q<=0)return;
    const L=tw(ctx,s,36,600)+20,y=148+i*60;ctx.beginPath();ctx.moveTo(44,y+3);ctx.lineTo(44+L*q,y+3-6*q);ctx.stroke();});ctx.restore();}
// the same news in the wallet team's words (860 by 600), "in theirs", written row by row: o.p (0 to 1) the first four rows, o.p2 the
// offer of help and Jun's name. Each row's words and where it sits; returns where the pen is
const CW_THEIRS=[["From Wednesday, a microcredential of",160],["6 credit points or more counts as an award.",220],["Nothing in your app changes.",300],
  ["To show it: one new mark, yes or no.",380],["I'll work on it with you on Thursday.",460],["Jun",530]];
function cw_theirNote(ctx,o){o=o||{};gv_sheet(ctx,0,0,860,600,{rot:0.008});cw_T(ctx,"in theirs",56,72,{w:600,size:30,col:WC_MUTED});let pen=null;
  const write=(rows,P_)=>{const T=rows.reduce((a,r)=>a+r[0].length,0);let acc=0;rows.forEach(([s,y])=>{const q=clamp(((P_==null?1:P_)*T-acc)/s.length,0,1);acc+=s.length;if(q<=0)return;
    const e=cw_hand(ctx,s,56,y,{size:s==="Jun"?42:36,p:q});if(q<1)pen=e;});};
  write(CW_THEIRS.slice(0,4),o.p);if(o.p2>0)write(CW_THEIRS.slice(4),o.p2);return pen;}
// the booklet that reached every home in 1967, open (560 by 400 at (x, y)): its H on the left page; on the right, three pictures with no
// words, one under another, for what would change (a car crosses to the right of the road), when (a clock at ten to five) and what to
// do (stop at the line, and wait). CW_BKP: each picture's middle, from (x, y)
const CW_BKP=[[420,78],[420,200],[420,322]];
function cw_bookletOpen(ctx,x,y){const w=560,h=400,ink=CW.navy;ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(50,36,24,0.3)";ctx.fillRect(x+8,y+12,w,h);ctx.restore();
  [[x,0],[x+w/2,1]].forEach(([px,i])=>{ctx.fillStyle=rgba(i?[250,248,242]:[246,243,234],1);ctx.fillRect(px,y,w/2,h);});ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=1.4;ctx.strokeRect(x,y,w,h);
  const g=ctx.createLinearGradient(x+w/2-30,0,x+w/2+30,0);g.addColorStop(0,"rgba(70,60,50,0)");g.addColorStop(0.5,"rgba(70,60,50,0.22)");g.addColorStop(1,"rgba(70,60,50,0)");ctx.fillStyle=g;ctx.fillRect(x+w/2-30,y,60,h);
  cw_H(ctx,x+w/4,y+h*0.44,150,ink,0);ctx.fillStyle=rgba(CW.gold,1);ctx.fillRect(x,y+h-56,w/2,18);
  ctx.save();ctx.strokeStyle=rgba(ink,0.9);ctx.fillStyle=rgba(ink,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.lineJoin="round";
  // what would change: a road, its middle line dashed, a car on the left and an arrow across to the right
  {const [cx,cy]=[x+CW_BKP[0][0],y+CW_BKP[0][1]];ctx.strokeRect(cx-96,cy-46,192,92);ctx.save();ctx.setLineDash([12,10]);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy-46);ctx.lineTo(cx,cy+46);ctx.stroke();ctx.restore();
    rr(ctx,cx-62,cy+2,26,40,6);ctx.fill();ctx.beginPath();ctx.moveTo(cx-49,cy-6);ctx.quadraticCurveTo(cx-40,cy-34,cx+34,cy-28);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+22,cy-40);ctx.lineTo(cx+38,cy-28);ctx.lineTo(cx+22,cy-16);ctx.stroke();}
  // when: a clock at ten to five
  {const [cx,cy]=[x+CW_BKP[1][0],y+CW_BKP[1][1]],r=46;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();for(let i=0;i<12;i++){const a=i/12*TAU;ctx.beginPath();ctx.moveTo(cx+Math.sin(a)*r*0.8,cy-Math.cos(a)*r*0.8);ctx.lineTo(cx+Math.sin(a)*r*0.92,cy-Math.cos(a)*r*0.92);ctx.stroke();}
    const ha=(4+50/60)/12*TAU,ma=50/60*TAU;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(ha)*r*0.5,cy-Math.cos(ha)*r*0.5);ctx.stroke();ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(ma)*r*0.78,cy-Math.cos(ma)*r*0.78);ctx.stroke();}
  // what to do: a car stopped at a line, and two bars: wait
  {const [cx,cy]=[x+CW_BKP[2][0],y+CW_BKP[2][1]];ctx.beginPath();ctx.moveTo(cx-96,cy-14);ctx.lineTo(cx+10,cy-14);ctx.stroke();rr(ctx,cx-70,cy-2,26,40,6);ctx.fill();
    ctx.fillRect(cx+40,cy-36,14,56);ctx.fillRect(cx+66,cy-36,14,56);}
  ctx.restore();}
// the note in Marta's hands, as she reads it: a sheet with Jun's lines and his name at its foot (in the figure's units)
function cw_heldLetter(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+44);cx.rotate(0.04);const w=160,h=210;
  cx.fillStyle="rgba(60,50,40,0.22)";cx.fillRect(-w/2+5,-h/2+6,w,h);cx.fillStyle="rgb(252,250,244)";cx.fillRect(-w/2,-h/2,w,h);cx.fillStyle=rgba(WC_MUTED,0.45);cx.fillRect(-w/2+14,-h/2+16,56,6);
  cx.fillStyle="rgba(40,52,100,0.7)";[0.86,0.92,0.6,0.8,0.74].forEach((f,i)=>cx.fillRect(-w/2+14,-h/2+40+i*26+(i>1?10:0),(w-28)*f,4));cx.fillRect(-w/2+14,h/2-34,30,6);cx.restore();
  fingers(cx,P_,[[mx-w/2+6,my+54],[mx+w/2-6,my+50]]);}
// Marta's notebook, open on the meeting table (520 by 680 at (0, 0)): a ruled page with her earlier notes, and "Thursday" written as
// o.p goes 0 to 1. Returns where the pen is
function cw_notebook(ctx,o){o=o||{};const w=520,h=680;ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(50,36,24,0.3)";ctx.fillRect(10,14,w,h);ctx.restore();
  wc_wash(ctx,wc_rect(-14,-10,w+28,h+20),[64,96,132],{kind:"cover",lw:1.3,seed:521});gv_sheet(ctx,0,0,w,h);
  ctx.save();ctx.strokeStyle="rgba(120,140,180,0.35)";ctx.lineWidth=1.6;for(let i=0;i<11;i++){ctx.beginPath();ctx.moveTo(30,120+i*52);ctx.lineTo(w-30,120+i*52);ctx.stroke();}
  ctx.fillStyle="rgba(150,154,166,1)";for(let i=0;i<12;i++){ctx.beginPath();ctx.arc(-4,40+i*54,9,0,TAU);ctx.fill();}ctx.restore();
  ctx.fillStyle="rgba(40,52,100,0.55)";[[0.7,0],[0.45,1],[0.62,2],[0.3,4]].forEach(([f,i])=>ctx.fillRect(46,100+i*52,(w-92)*f,5));
  return o.p>0?cw_hand(ctx,"Thursday",50,370,{size:64,p:o.p}):null;}

/* ---------- 9 · Ready ---------- */
// the card that goes on a report: "counts as an award", in the glossary's violet, and from when (w by 128, its words 34 px, at (x, y));
// a (0 to 1) drops it on, with a paper clip at its top
function cw_whenCard(ctx,x,y,w,when,a){if(a<=0.01)return;const e=easeCam(clamp(a,0,1)),k=lerp(1.18,1,e);ctx.save();ctx.translate(x+w/2,y+64);ctx.scale(k,k);ctx.translate(-w/2,-64);
  withA(ctx,clamp(a*1.8,0,1),()=>{ctx.save();ctx.filter="blur("+(4+10*(1-e)).toFixed(0)+"px)";ctx.fillStyle="rgba(50,36,24,0.28)";ctx.fillRect(8+16*(1-e),12+16*(1-e),w,128);ctx.restore();
    wc_panel(ctx,0,0,w,128,{kind:"card",wash:GV_MEAN.violet,washA:0.3,seed:530});cw_T(ctx,"counts as an award",26,52,{w:800,size:34,col:GV_MEANINK.violet});cw_T(ctx,when,26,100,{w:600,size:32,col:WC_DARK});
    ctx.save();ctx.strokeStyle="rgba(150,154,166,1)";ctx.lineWidth=6;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(w-70,-26);ctx.lineTo(w-70,40);ctx.lineTo(w-46,40);ctx.lineTo(w-46,-14);ctx.lineTo(w-58,-14);ctx.lineTo(w-58,26);ctx.stroke();ctx.restore();});ctx.restore();}
// the draft submission in Mei's hands, held up to show (in the figure's units): a band in her office's colour, its name, its lines
function cw_heldDraft(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+86);cx.rotate(-0.03);const w=230,h=290;
  cx.fillStyle="rgba(60,50,40,0.22)";cx.fillRect(-w/2+6,-h/2+8,w,h);cx.fillStyle="rgb(252,250,244)";cx.fillRect(-w/2,-h/2,w,h);cx.fillStyle=rgba(wc_dim(GV_ROOM.reg,0.08),1);cx.fillRect(-w/2+6,-h/2+6,w-12,44);
  cw_T(cx,"Draft submission",-w/2+16,-h/2+36,{w:800,size:19,col:WC_DARK});cx.fillStyle=rgba(WC_MUTED,0.38);for(let i=0;i<7;i++)cx.fillRect(-w/2+16,-h/2+76+i*28,(w-32)*(i%3===2?0.6:0.9),4);
  cx.restore();fingers(cx,P_,[[mx-w/2+4,my+90],[mx+w/2-4,my+84]]);}
// a report on a desk (700 by 860 at (0, 0)): a band in its office's colour, its name and whose it is, and its table of counts as ruled bars:
// the draft submission, from the registrar's office, or Planning's census report
function cw_report(ctx,name,office,col){gv_sheet(ctx,0,0,700,860,{rot:-0.012});ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_dim(col,0.04),1);ctx.fillRect(16,16,668,96);ctx.restore();
  cw_T(ctx,name,48,80,{w:800,size:46,col:WC_DARK});cw_T(ctx,office,48,160,{w:600,size:30,col:WC_MUTED});
  ctx.fillStyle=rgba(WC_MUTED,0.3);for(let i=0;i<9;i++){ctx.fillRect(48,220+i*64,300,6);ctx.fillRect(420,220+i*64,90+((i*53)%120),6);}}
// a laptop on the meeting table, its lid towards us, so its screen faces away: centred on x, standing on the table at y
function cw_laptopBack(ctx,x,y){ctx.save();ctx.filter="blur(6px)";ctx.fillStyle="rgba(50,40,30,0.25)";ctx.fillRect(x-100,y-8,200,14);ctx.restore();
  wc_part(ctx,wc_rrPts(x-92,y-122,184,118,10),[196,200,208],1,{kind:"thing",lw:1.3});wc_flat(ctx,wc_rect(x-100,y-8,200,9),[150,154,162],1,"base");}

/* ---------- 10 · A step, not a meeting ---------- */
// binder 19 open on Yusuf's desk, seen from the front: its covers flat on the desk top at y, its pages, centred on x
function cw_binderFlat(ctx,x,y){wc_part(ctx,[[x-150,y],[x+150,y],[x+136,y-18],[x-136,y-18]],[120,52,46],1,{kind:"thing",lw:1.2});
  wc_flat(ctx,[[x-128,y-14],[x-6,y-14],[x-8,y-26],[x-120,y-26]],[246,242,232],1,"pages");wc_flat(ctx,[[x+6,y-14],[x+128,y-14],[x+120,y-26],[x+8,y-26]],[250,246,238],1,"pages");}
// the gold card from binder 19 in a hand, small, as Yusuf pins it to the board (in the figure's units)
function cw_heldGold(cx,P_,hands){const r=hands[1];cx.save();cx.translate(r[0]+10,r[1]-30);cx.rotate(-0.1);cx.fillStyle="rgba(60,50,40,0.2)";cx.fillRect(-36,-18,80,44);
  cx.fillStyle=rgba(wc_lit(GV.gold,0.45),1);cx.fillRect(-40,-22,80,44);cx.fillStyle=rgba(WC_DARK,0.45);for(let i=0;i<2;i++)cx.fillRect(-30,-10+i*14,56-i*14,4);cx.restore();}
// the card for the table Planning's dashboard uses, on the board (450 by 300 at (x, y)): its name, what it is, and "owner:" with
// nothing after it (o.owner, 0 to 1, writes "owner:" and draws the empty line)
function cw_nearCard(ctx,x,y,a,o){if(a<=0.01)return;o=o||{};const k=0.9+0.1*spring(clamp(a,0,1));ctx.save();ctx.translate(x+225,y+150);ctx.scale(k,k);ctx.translate(-x-225,-y-150);
  withA(ctx,clamp(a*1.6,0,1),()=>{wc_panel(ctx,x,y,450,300,{kind:"card",seed:73});gv_pin(ctx,x+225,y+14,GV.red,1.3);
    cw_T(ctx,"Learners near",x+30,y+80,{w:800,size:42,col:WC_DARK});cw_T(ctx,"an award",x+30,y+128,{w:800,size:42,col:WC_DARK});
    cw_T(ctx,"the table Planning's",x+30,y+180,{w:600,size:30,col:WC_INK});cw_T(ctx,"dashboard uses",x+30,y+218,{w:600,size:30,col:WC_INK});
    const ow=o.owner||0;if(ow>0){cw_hand(ctx,"owner:",x+30,y+272,{size:32,p:clamp(ow*1.6,0,1)});const e=easeCam(clamp(ow*1.6-0.6,0,1));
      ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(x+150,y+278);ctx.lineTo(x+150+260*e,y+278);ctx.stroke();ctx.restore();}});ctx.restore();}
// a clock on the wall above the board, its hands at hh:mm
function cw_boardClock(ctx,x,y,r,hh,mm){wc_wash(ctx,wc_ell(x,y,r+8,r+8,30),[88,82,78],{kind:"clock",lw:1.2,seed:811});wc_flat(ctx,wc_ell(x,y,r,r,30),[250,246,232],1,"face");
  ctx.save();ctx.strokeStyle="rgba(60,56,60,0.9)";ctx.lineCap="round";for(let i=0;i<12;i++){const a=i/12*TAU;ctx.lineWidth=i%3?2:4;ctx.beginPath();ctx.moveTo(x+Math.sin(a)*r*0.8,y-Math.cos(a)*r*0.8);ctx.lineTo(x+Math.sin(a)*r*0.92,y-Math.cos(a)*r*0.92);ctx.stroke();}
  const ha=((hh%12)+mm/60)/12*TAU,ma=mm/60*TAU;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(ha)*r*0.5,y-Math.cos(ha)*r*0.5);ctx.stroke();
  ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.sin(ma)*r*0.78,y-Math.cos(ma)*r*0.78);ctx.stroke();ctx.restore();}

// lines of words wrapped to a width, at a size
function cw_wrap(ctx,s,size,maxW,wt){const words=s.split(" "),out=[];let cur="";words.forEach(w_=>{const t_=cur?cur+" "+w_:w_;if(tw(ctx,t_,size,wt||600)>maxW&&cur){out.push(cur);cur=w_;}else cur=t_;});if(cur)out.push(cur);return out;}

const WC_PLACES={x67dawn:c=>cw_paintStreet(c,"dawn"),x67night:c=>cw_paintStreet(c,"night"),x67day:c=>cw_paintStreet(c,"day"),
  x66border:cw_paintBorder,x66borderBar:cw_paintBorderBar,x66road:cw_paintRoad66,x63office:cw_paintOffice63,x63officeT:cw_paintOffice63T,x67pole:cw_paintPole,
  x67post:cw_paintPost,x67postT:cw_paintPostT,x67grocer:cw_paintGrocer,x67grocerT:cw_paintGrocerT,x67desk:cw_paintDesk67,x67deskT:cw_paintDesk67T,
  campus:gv_paintCampus,regClose:gv_paintRegistrarClose,regDesk:gv_paintRegistrarDesk,data:gv_paintData,boardData:c=>gv_paintBoardClose(c,GV_ROOM.data),
  office:cw_paintOffice,desk:gv_paintDesk,meeting:gv_paintMeeting,meetingTable:gv_paintMeetingTable,planning:gv_paintPlanning,floor:gv_paintFloor,calWall:cw_paintCalWall,boardWide:cw_paintBoardWide,planScreen:cw_paintPlanScreen,phoneBg:cw_paintPhoneBg,registrar:gv_paintRegistrar,
  shelf:cw_paintShelf,topJun:c=>cw_paintTop(c,CW_TOPS.topJun),topMei:c=>cw_paintTop(c,CW_TOPS.topMei),topPlan:c=>cw_paintTop(c,CW_TOPS.topPlan),topMeet:c=>cw_paintTop(c,CW_TOPS.topMeet)};
