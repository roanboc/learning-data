/* ===== Rules that run: the university's places and pictures =====
   The places are painted once and kept (shared/src/finish.js); the opening's are in past.js. Today, only the university's own places
   (the series' rooms.js): Yusuf's office, binder 9's page, his screen and his board; the data team's room, its board, Jun's screen
   and Jun's desk from above; Planning's room and its desk from above; the learning team's office (Tom's), his screen and his desk
   from above. The pictures are the university's own papers, in plain words, as the first pack sets: the survey form and its chart,
   the page of the night's checks, the rule register, the scorecard (the series'), the rule cards (the series' sign-off sheet), the
   level's counter, the warning slips, the enrolment cards, the follow-up list, the issue log (the series' register page) and the
   report covers held back. Nothing is code, a file or a tool's screen. Fixed where it starts draws the same office, binders, desk and
   issue log; its painters are copied here with this film's names, so neither film changes the other's. Every name starts with rr_
   or RR_. */

// text drawn too small to read on purpose, which the phone check skips: its hook (PH_OFF, as From words to data's phone.js names it,
// which this series doesn't bundle) counts what's drawn inside rr_asDeco
let PH_OFF=0;
function rr_asDeco(on,fn){if(!on)return fn();PH_OFF++;try{return fn();}finally{PH_OFF--;}}
// fn draws with each word fading as the frame's edge comes to it (within 30 px), so the frame never cuts a word: a sheet sliding in, or
// one beside the page the camera closes on (spans: [x0, x1] columns, in ctx's units now, whose words fade together). A copy of
// Fixed where it starts' fw_fadeCut, as the playbook's lesson on cut columns asks
function rr_fadeCut(ctx,fn,spans){const T0=T,cw=ctx.canvas.width,ch=ctx.canvas.height,r=30*cw/1920,M=ctx.getTransform(),S=(spans||[]).map(([a,b])=>[M.a*a+M.e,M.a*b+M.e]);
  T=(c,s2,x,y,o)=>{o=o||{};const sz=o.size||24,w=tw(c,String(s2),sz,o.w,o.f),al=o.align||"left",x0=al==="center"?x-w/2:al==="right"?x-w:x,m=c.getTransform();
    let l=1e9,rt=-1e9,tp=1e9,bt=-1e9;for(const [px,py] of [[x0,y-0.75*sz],[x0+w,y-0.75*sz],[x0,y+0.2*sz],[x0+w,y+0.2*sz]]){const X=m.a*px+m.c*py+m.e,Y=m.b*px+m.d*py+m.f;
      l=Math.min(l,X);rt=Math.max(rt,X);tp=Math.min(tp,Y);bt=Math.max(bt,Y);}
    const sp=S.find(([a,b])=>l>=a-2&&l<=b);if(sp){l=Math.min(l,sp[0]);rt=Math.max(rt,sp[1]);}
    const a=clamp(Math.min(l/r,(cw-rt)/r,tp/r,(ch-bt)/r),0,1);if(a>=0.99)return T0(c,s2,x,y,o);if(a>0.01)withA(c,a,()=>T0(c,s2,x,y,o));};
  try{return fn();}finally{T=T0;}}

/* ---------- Yusuf's office ---------- */
// the shelf's binders, the two middle rows: binders 2, 12 and 6 are out with the earlier films, so their places are gaps (the
// series' facts); binder 9 slides forward (out9, 0 to 1), then is in his hands (gone9); at the end binder 15 does the same
const RR_BIND={w:24,h:146,gap:26.6,x:1393,cols:[[96,118,150],[150,90,80],[120,140,104],[186,160,110],[132,136,150],[110,96,130]]},RR_OUT=[1,11,5];
const rr_bindCol=i=>RR_BIND.cols[Math.floor(hash(i,17)*RR_BIND.cols.length)];
function rr_binders(ctx,o){o=o||{};const B=RR_BIND;for(let i=0;i<34;i++){if(RR_OUT.includes(i)||(o.gone9&&i===8)||(o.gone15&&i===14))continue;
  const row=i<17?0:1,x=B.x+(i%17)*B.gap,y=GV_OFF.shelf.rows[1+row],u=i===8?o.out9||0:i===14?o.out15||0:0;
  ctx.save();ctx.translate(0,-10*u);gv_binder(ctx,x-u*3,y-B.h,B.w+u*6,B.h,rr_bindCol(i));ctx.restore();}}
// a binder in both hands (in the figure's units, like the series' heldBinder): its label is its film's title, as the series labels
// each film's binder
function rr_heldBinder(lines,col){return(cx,P_,hands)=>{const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2,w=168,h=214;cx.save();cx.translate(mx,my+4);cx.rotate(-0.06);
  cx.fillStyle=rgba(mix(col,[0,0,0],0.35),1);rr(cx,-w/2+9,-h/2+7,w,h,10);cx.fill();
  const g=cx.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,rgba(mix(col,[255,255,255],0.28),1));g.addColorStop(1,rgba(col,1));cx.fillStyle=g;rr(cx,-w/2,-h/2,w,h,10);cx.fill();
  cx.fillStyle="rgba(250,246,236,0.95)";for(let i=0;i<7;i++)cx.fillRect(w/2-2,-h/2+12+i*5,10,3.2);
  cx.fillStyle="rgba(255,252,242,0.97)";rr(cx,-w/2+12,-h/2+22,w-24,124,10);cx.fill();
  const y0=-h/2+84-(lines.length-1)*17.5;lines.forEach((s,i)=>wc_T(cx,s,0,y0+i*35,{w:800,size:28,align:"center",col:mix(col,[0,0,0],0.5)}));cx.restore();
  fingers(cx,P_,[[mx-w/2+4,my+30],[mx+w/2-2,my+24]]);};}
const RR_B9=rr_bindCol(8),RR_B15=rr_bindCol(14);
// his screen on the desk: a monitor turned a little towards him, too small to read; before the scorecard (kind "survey") the
// survey's results, after it ("score") the scorecard
function rr_officeScreen(ctx,kind){ctx.drawImage(wc_kept("rrOffScreen|"+kind,260,240,q=>{q.translate(30,20);gv_monitor(q,0,0,200,128);q.fillStyle=rgba(GV.screen,1);q.fillRect(0,0,200,128);
    q.fillStyle=rgba([70,96,140],1);q.fillRect(0,0,200,16);
    if(kind==="survey")for(let r=0;r<7;r++){q.fillStyle=rgba([150,160,190],0.85);q.fillRect(16,26+r*13,(r===4?96:128),9);}
    else for(let r=0;r<6;r++)for(let c=0;c<5;c++){q.fillStyle=rgba(r===3&&(c===0||c===2)?GV.amber:[150,200,160],0.8);q.fillRect(14+c*36,26+r*15,30,11);}}),730,GV_OFF.desk[1]-214);}
// his office's wall as Off the shelf left it, painted with the place: the maturity score in its frame, the chart of who's responsible
// pinned to the board and the four answers under it (decoration: too small to read, as they are there)
function rr_paintOfficeWall(ctx){const [x,y,w]=GV_OFF.score,cx=x+w/2;
  wc_T(ctx,"maturity",cx,y+40,{w:600,size:24,align:"center",col:WC_MUTED,deco:1});wc_T(ctx,"2.1 / 5",cx,y+88,{w:800,size:42,align:"center",col:WC_DARK,deco:1});
  for(let i=0;i<5;i++){const bx=x+24+i*26;ctx.fillStyle=rgba(WC_MUTED,0.25);ctx.fillRect(bx,y+104,22,12);const f=clamp(2.1-i,0,1);if(f>0){ctx.fillStyle=rgba(GV.gold,0.95);ctx.fillRect(bx,y+104,22*f,12);}}
  const [bx,by]=GV_OFF.board,sx=bx+40,sy=by+50,sw=330,sh=190;gv_sheet(ctx,sx,sy,sw,sh);gv_pin(ctx,sx+16,sy+10,GV.red,0.8);gv_pin(ctx,sx+sw-16,sy+10,GV.red,0.8);
  gv_lines(ctx,sx+18,sy+28,170,1,0);ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.45);ctx.lineWidth=1.5;for(let i=0;i<=4;i++){ctx.beginPath();ctx.moveTo(sx+14,sy+56+i*30);ctx.lineTo(sx+sw-14,sy+56+i*30);ctx.stroke();}ctx.restore();
  for(let i=0;i<4;i++){gv_lines(ctx,sx+20,sy+68+i*30,70,1,0,0.8);for(let j=0;j<4;j++)gv_lines(ctx,sx+128+j*48,sy+68+i*30,32,1,0,0.8);}
  for(let k=0;k<4;k++){const ax=bx+28+k*92,ay=by+290;ctx.save();ctx.translate(ax+40,ay+42);ctx.rotate([-0.04,0.03,-0.02,0.05][k]);
    wc_panel(ctx,-40,-42,80,84,{kind:"card",seed:80+k});gv_lines(ctx,-26,-6,52,3,14,0.9);gv_pin(ctx,0,-34,GV.red,0.6);ctx.restore();}}
// the survey's chart, pinned over the four answers once he's put it up (a, 0 to 1), as the room sees it: decoration
function rr_officeChart(ctx,a){if(a<=0.01)return;const [bx,by]=GV_OFF.board,x=bx+150,y=by+226;withA(ctx,a,()=>{ctx.save();ctx.translate(x+120,y+80);ctx.rotate(0.02);
  ctx.drawImage(wc_kept("rrOffChart",260,190,q=>{q.translate(10,10);gv_sheet(q,0,0,240,160);gv_lines(q,16,22,120,1,0,0.8);
    RR_SV.forEach(([,v],i)=>{q.fillStyle=rgba(RR_SVC,0.8);q.fillRect(90,40+i*15,v*30,9);gv_lines(q,16,46+i*15,60,1,0,0.6);});}),-130,-90);gv_pin(ctx,0,-74,GV.red,0.7);ctx.restore();});}
// a card on his open door: his office hours, from Off the shelf's first steps (a, 0 to 1)
function rr_hoursCard(ctx,a,z){if(a<=0.01)return;const [dx]=GV_OFF.door,deco=(z||1)*19<27?1:0;withA(ctx,a,()=>{ctx.save();ctx.translate(dx+100,440);ctx.rotate(-0.03);
  wc_panel(ctx,-92,-46,184,92,{kind:"card",wash:GV.gold,washA:0.25,seed:41});gv_pin(ctx,0,-34,GV.red,0.6);
  wc_T(ctx,"Office hours",0,-2,{w:800,size:22,align:"center",col:WC_DARK,deco});wc_T(ctx,"Thursdays 2–3 pm",0,28,{w:600,size:19,align:"center",col:WC_INK,deco});ctx.restore();});}

/* ---------- binder 9's page ---------- */
// binder 9's page, close: the paper filling the frame, the holes for the rings down the left
function rr_paintPolicy(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV.paper,{kind:"paper",line:false,seed:93});
  for(const y of [170,540,910])wc_wash(ctx,wc_ell(96,y,24,24,24),wc_dim(GV.oak,0.08),{kind:"thing",lw:1.3,seed:y});
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(255,250,236,0)");g.addColorStop(1,"rgba(150,130,100,0.1)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
// what the page says, the series' way; "monitored" underlined in pencil as it's read (under, 0 to 1); at the end a green highlighter
// runs along the line (hi, 0 to 1) and Yusuf writes four lines beside it, one by one (notes, each 0 to 1)
const RR_PG={x:300,y:430,size:46,line:"Data quality is monitored and issues are remediated.",
  notes:["a check, with an owner","a level and a reason","a scorecard from what ran","an issue log, for the owners"]};
function rr_hiStroke(ctx,x,y,w,col,p,seed,h){if(p<=0)return;h=h||66;const c=wc_kept("rrHi|"+col+"|"+seed,1400,74,q=>wc_wash(q,wc_resample(wc_rect(8,10,1380,50),12),col,{kind:"swatch",line:false,a:0.5,seed}));
  const top=y-14-h/2;ctx.save();ctx.beginPath();ctx.rect(x-14,top-6,(w+28)*clamp(p,0,1),h+12);ctx.clip();ctx.globalCompositeOperation="multiply";ctx.drawImage(c,x-14,top,w+28,h);ctx.restore();}
function rr_marker(ctx,x,y,rot,col){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(wc_kept("rrMarker|"+col,300,100,q=>{
    q.save();q.filter="blur(5px)";q.fillStyle="rgba(70,50,30,0.26)";q.fillRect(30,46,236,30);q.restore();wc_wash(q,wc_rrPts(26,30,196,42,14),mix(col,[255,255,255],0.6),{kind:"thing",lw:1.3,seed:col[0]});
    wc_wash(q,wc_rrPts(204,27,70,48,12),col,{kind:"thing",lw:1.3,seed:col[1]});wc_wash(q,[[28,40],[8,46],[8,56],[28,62]],wc_dim(col,0.1),{kind:"thing",lw:1.1,seed:col[2]});}),-12,-52);ctx.restore();}
function rr_policy9(ctx,o){o=o||{};const P=RR_PG,hi=o.hi||0,notes=o.notes||[];wc_T(ctx,"Data policies",P.x,150,{w:600,size:30,col:WC_MUTED});wc_T(ctx,"Policy 9",P.x,250,{w:800,size:70,col:WC_DARK});
  wc_T(ctx,"Data quality",P.x,310,{w:600,size:38,col:WC_MUTED});const lw=tw(ctx,P.line,P.size,700);
  rr_hiStroke(ctx,P.x,P.y,lw,GV.green,hi,61);wc_T(ctx,P.line,P.x,P.y,{w:700,size:P.size,col:WC_DARK});
  // the underline: a pencil stroke under the word, drawn from its start
  if(o.under>0){const x0=P.x+tw(ctx,"Data quality is ",P.size,700),w=tw(ctx,"monitored",P.size,700),u=easeCam(clamp(o.under,0,1));ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.8);
    ctx.lineWidth=3.2;ctx.lineCap="round";ctx.beginPath();for(let i=0;i<=20;i++){const v=i/20*u,px=x0-4+(w+8)*v,py=P.y+14+Math.sin(v*9)*1.6+v*2;if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);}ctx.stroke();ctx.restore();}
  gv_lines(ctx,P.x,P.y+370,1180,3,48,0.7);
  P.notes.forEach((s,i)=>{if(notes[i]>0)wc_hand(ctx,s,P.x+30,P.y+92+i*62,{size:40,w:700,col:GV.greenInk,p:notes[i]});});
  if(hi>0&&hi<1.05)rr_marker(ctx,P.x-14+(lw+28)*clamp(hi,0,1),P.y+6,-0.12,GV.green);}

/* ---------- the survey ---------- */
// the survey's form, laid over the page (u, 0 to 1: it slides in); its five boxes come in one by one (nums), and a 4 is ringed in
// pencil (ring)
function rr_survey(ctx,u,o){if(u<=0)return;o=o||{};const e=easeCam(clamp(u,0,1)),x=lerp(1900,560,e),y=150;ctx.save();ctx.translate(x,y);ctx.rotate(-0.02*e);
  gv_sheet(ctx,0,0,1100,600);wc_T(ctx,"Data quality survey",60,90,{w:600,size:30,col:WC_MUTED});wc_T(ctx,"Rate your system's data quality",60,170,{w:800,size:52,col:WC_DARK});
  ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.45);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(60,210);ctx.lineTo(1040,210);ctx.stroke();ctx.restore();
  for(let i=0;i<5;i++){const a=clamp((o.nums||0)*5-i,0,1);if(a<=0)continue;const bx=110+i*190;withA(ctx,a,()=>{wc_panel(ctx,bx,280,130,130,{kind:"card",seed:51+i});
    wc_T(ctx,String(i+1),bx+65,372,{w:800,size:64,align:"center",col:WC_DARK});});}
  wc_T(ctx,"poor",110,470,{w:600,size:28,col:WC_MUTED,a:clamp((o.nums||0)*2-1,0,1)});wc_T(ctx,"very good",1000,470,{w:600,size:28,align:"right",col:WC_MUTED,a:clamp((o.nums||0)*2-1,0,1)});
  if(o.ring>0)wc_ring(ctx,110+3*190+65,345,92,92,clamp(o.ring,0,1),{col:WC_PENCIL,lw:4});ctx.restore();}
// the chart he pins up from the answers: a bar for each system, its owner's answer at its end; the short-course platform's bar
// lights as it's read (lit); "average 3.9" written under them (avg); as a guess at the flood, the dry field shows pale behind it
// (field), and then the chart fades to pencil (pencil). Drawn at (x,y), k its scale (1: 940 wide)
const RR_SV=[["student system",4],["learning platform",4],["short-course platform",4],["HR system",4],["research system",3],["alumni system",4],["Planning's reports",4]],
  RR_SVC=[118,132,170];
function rr_chart(ctx,x,y,k,o){o=o||{};rr_asDeco((o.z||1)*k*28<27,()=>rr_chart_(ctx,x,y,k,o));}
function rr_chart_(ctx,x,y,k,o){const w=940,h=720,pc=clamp(o.pencil||0,0,1);ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.rotate(-0.008);
  gv_sheet(ctx,0,0,w,h);
  if(o.field>0.01){ctx.save();ctx.beginPath();ctx.rect(12,12,w-24,h-24);ctx.clip();ctx.globalAlpha=0.32*clamp(o.field,0,1);ctx.globalCompositeOperation="multiply";ctx.drawImage(gv_place("dry"),-260,-60,1600,900);ctx.restore();}
  gv_pin(ctx,40,22,GV.red,1.1);gv_pin(ctx,w-40,22,GV.red,1.1);
  wc_T(ctx,"Data quality survey",50,90,{w:800,size:44,col:WC_DARK});
  const bx=420,bw=90;RR_SV.forEach(([s,v],i)=>{const yy=170+i*68,a=clamp((o.bars||0)*7-i*0.8,0,1);if(a<=0)return;
    const lit=i===2?clamp(o.lit||0,0,1):0,col=mix(mix(RR_SVC,GV.gold,lit),[150,146,150],pc);
    if(lit>0.01)gv_tint(ctx,30,yy-44,w-60,60,GV.gold,0.5*lit);
    wc_T(ctx,s,50,yy,{w:600,size:30,col:mix(WC_DARK,WC_MUTED,pc*0.7),a});
    const L=v*bw*easeCam(a);if(pc<0.99)withA(ctx,a*(1-pc),()=>{ctx.fillStyle=rgba(wc_lit(col,0.15),1);rr(ctx,bx,yy-30,L,34,6);ctx.fill();});
    if(pc>0.01){ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.55*pc*a);ctx.lineWidth=2;rr(ctx,bx,yy-30,L,34,6);ctx.stroke();ctx.restore();}
    wc_T(ctx,String(v),bx+L+20,yy,{w:800,size:32,col:mix(WC_DARK,WC_MUTED,pc*0.7),a});});
  // the scale under the bars: 1 to 5
  withA(ctx,clamp((o.bars||0)*2,0,1),()=>{ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.4);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(bx,640);ctx.lineTo(bx+5*bw,640);ctx.stroke();ctx.restore();
    for(let i=1;i<=5;i++)wc_T(ctx,String(i),bx+i*bw,676,{w:600,size:28,align:"center",col:WC_MUTED});});
  if(o.avg>0)wc_hand(ctx,"average 3.9",50,690,{size:40,w:700,col:mix(GV_SIGN.ink,WC_PENCIL,pc),p:o.avg});
  ctx.restore();}
// David's question, kept on a card pinned beside the chart (u: it's pinned up; tick, 0 to 1: answered, with a green tick)
const RR_Q=["Can we trust the number","we send to the government?"];
function rr_qCard(ctx,x,y,u,tick){if(u<=0)return;const e=easeCam(clamp(u,0,1));withA(ctx,clamp(u*2,0,1),()=>{ctx.save();ctx.translate(x,y-16*(1-e));ctx.rotate(0.02);
  gv_card(ctx,0,0,520,150,RR_Q,{size:34,head:false,y0:62,wash:GV.gold,washA:0.18});if(tick>0)wc_tick(ctx,470,108,54,GV.green,clamp(tick,0,1),6);ctx.restore();});}

/* ---------- the data team's room ---------- */
// the data team's board, in the room: a few cards pinned up, as the team leaves them (decoration), painted with the place
function rr_paintDataBoard(ctx){const [bx,by]=GV_DT.board;[[bx+24,by+40,150,112,-0.03],[bx+196,by+52,96,96,0.04],[bx+310,by+36,100,118,-0.02],[bx+60,by+196,124,104,0.02],
    [bx+230,by+200,170,110,-0.03]].forEach(([x,y,w,h,r],i)=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(r);wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",wash:i===4?GV_LOOPC:null,washA:0.16,seed:320+i});
    gv_lines(ctx,-w/2+16,-h/2+30,w-32,3,20,0.85);gv_pin(ctx,0,-h/2+10,GV.red,0.8);ctx.restore();});}
// the room at night: dark blue, the window dark, only the two monitors lit; screens, when they're close, stay as they are (a, 0 to 1)
function rr_night(ctx,a,lit){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(mix([255,255,255],[52,62,104],a),1);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";for(const [sx,sy,sw,sh] of lit||GV_DT.mon){wc_glowAt(ctx,sx+sw/2,sy+sh/2,sw*0.9,[150,180,230],0.5*a);ctx.fillStyle=rgba([170,190,230],0.55*a);ctx.fillRect(sx,sy,sw,sh);}ctx.restore();}
// two cards pinned on the board by Jun, as the room sees them (n of them, each u 0 to 1): the two signed rules, gold
function rr_boardCards(ctx,u0,u1){const [bx,by]=GV_DT.board;[[bx+250,by+230],[bx+340,by+250]].forEach(([x,y],i)=>{const u=i?u1:u0;if(u<=0.01)return;
  withA(ctx,clamp(u*2,0,1),()=>{ctx.save();ctx.translate(x,y-10*(1-u));ctx.rotate(i?0.04:-0.03);wc_panel(ctx,-40,-50,80,100,{kind:"card",wash:GV.gold,washA:0.4,seed:330+i});
    gv_lines(ctx,-28,-22,56,4,14,0.8);gv_pin(ctx,0,-40,GV.red,0.6);ctx.restore();});});}

/* ---------- the page of the night's checks ---------- */
// Jun's screen: a plain page in words, "Last night's checks", where a line appears for each check as it runs, with its mark, and the
// count runs up (n, 0 to 160). The window shows the latest nine; the last nine are the ones the voice names. A line is
// [words, state ("pass", "warn" or "fail"), what's found ("1 without")]
const RR_CKP=["Every course has a code","Every award belongs to a student","No course appears twice","Every module has its credits","Every payment has an amount",
  "Every grant has a start date","No staff member appears twice","Every graduate has an award","Every room has a building","Every invoice has a date",
  "Every timetable slot has a room","Every student has a programme","Every learner's country is known","Every credential has a level","Every fee has a currency",
  "No module appears twice","Every applicant has an application","Every result belongs to a module","Every alumnus has a year","Every department has a faculty"];
const RR_CK=(()=>{const L=[];for(let i=0;i<151;i++)L.push([RR_CKP[(i*7)%RR_CKP.length],"pass"]);
  L[46]=["Every short-course enrolment's email is tidy","warn","6 as typed"];L[98]=["Every short-course learner's email is tidy","warn","3 as typed"];
  L.push(["Every staff member has a department","pass"],["Every course has a code","pass"],["Every enrolment belongs to a learner","pass"],["Every learner has an ID","pass"],
    ["No learner appears twice","pass"],["Every short-course enrolment has an email","warn","1 without"],["Planning's number matches the census report","pass"],
    ["Every student has a student number","pass"],["Every grade belongs to a module","pass"]);return L;})();
// where a named line sits once the count stops, in the window (0 is the top): the ID, twice, the email, the census
const RR_CKI={id:3,twice:4,email:5,census:6};
// a mark: a green tick, an amber "!" in a ring, a red cross
function rr_mark(ctx,x,y,s,state,a){if(a<=0.01)return;withA(ctx,a,()=>{if(state==="pass")wc_tick(ctx,x,y,s,GV.green,1,Math.max(3,s*0.14));
  else if(state==="warn"){wc_wash(ctx,wc_ell(x,y,s*0.5,s*0.5,20),GV.amber,{kind:"dab",seed:61});wc_T(ctx,"!",x,y+s*0.3,{w:800,size:s*0.8,align:"center",col:[255,255,255]});}
  else{wc_wash(ctx,wc_ell(x,y,s*0.5,s*0.5,20),GV.red,{kind:"dab",seed:63});ctx.save();ctx.strokeStyle="#fff";ctx.lineWidth=Math.max(3,s*0.12);ctx.lineCap="round";const d=s*0.2;
    ctx.beginPath();ctx.moveTo(x-d,y-d);ctx.lineTo(x+d,y+d);ctx.moveTo(x+d,y-d);ctx.lineTo(x-d,y+d);ctx.stroke();ctx.restore();}});}
// the page: o.n the count, o.lines (in place of RR_CK's last nine, when a scene changes one), o.lit {window index: 0 to 1} lines lit
// gold as they're named or signed, o.legend (0 to 1) the three marks with their words, o.strike {index, p, off}: a line struck through
// and "off" written beside it; o.fade (0 to 1) fades the lines while one is grown over them; o.cam for the words too small to read
const RR_CKL={x:380,y:178,lh:62,n:9,sz:30};
function rr_checks(ctx,o){o=o||{};const [x,y,w,h]=GV_SC,K=RR_CKL,n=clamp(o.n==null?160:o.n,0,160),z=o.cam&&o.cam.z?o.cam.z:1,deco=z*K.sz<27?1:0;
  gv_screen(ctx,x,y,w,h,"Last night's checks",q=>{wc_T(q,Math.round(n)+" checks",x+w-24,y+40,{w:700,size:30,align:"right",col:[255,255,255],deco});
    // the list stops above the marks' row when it comes in: a line that would be cut fades instead
    const cb=y+h-(o.legend>0?86*clamp(o.legend*3,0,1):0);q.save();q.beginPath();q.rect(x,y+54,w,cb-y-54);q.clip();
    const L=o.lines?RR_CK.slice(0,151).concat(o.lines):RR_CK,top=n-K.n,f=top-Math.floor(top);
    for(let j=-1;j<K.n;j++){const i=Math.floor(top)+j+1;if(i<0||i>=n+0.999||i>=L.length)continue;const ln=L[i],yy=K.y+(j+1-f)*K.lh,wi=i-(L.length-K.n),
        a=clamp(n-i,0,1)*clamp((yy-y-84)/40,0,1)*clamp((cb-yy-10)/24,0,1)*(1-(o.fade||0)),lit=o.lit&&wi>=0?o.lit[wi]||0:0;if(a<=0.01)continue;
      withA(q,a,()=>{if(lit>0.01)gv_tint(q,x+24,yy-40,w-48,56,GV.gold,0.6*lit);rr_mark(q,K.x,yy-10,34,ln[1],1);
        const s=ln[0]+(ln[2]?" · "+ln[2]:"");wc_T(q,s,K.x+44,yy,{w:600,size:K.sz,col:ln[1]==="fail"?GV.redInk:ln[1]==="warn"?GV.amberInk:WC_DARK,deco});
        if(o.strike&&o.strike.i===wi&&o.strike.p>0){const e=easeCam(clamp(o.strike.p,0,1)),sw=tw(q,s,K.sz,600);q.save();q.strokeStyle=rgba(GV.redInk,0.85);q.lineWidth=3.4;q.lineCap="round";
          q.beginPath();q.moveTo(K.x+38,yy-10);q.lineTo(K.x+38+(sw+16)*e,yy-12);q.stroke();q.restore();if(o.strike.off>0)wc_hand(q,"off",K.x+70+sw,yy,{size:34,w:700,col:GV.redInk,p:o.strike.off});}});}
    q.restore();
    // the three marks, each with its word, along the foot of the page
    if(o.legend>0)[["pass","passed"],["warn","warning"],["fail","failed"]].forEach(([st,s],i)=>{const a=clamp(o.legend*3-i,0,1);if(a<=0.01)return;const lx=x+150+i*360,ly=y+h-44;
      withA(q,a,()=>{wc_panel(q,lx-40,ly-36,300,62,{kind:"tag",seed:70+i});rr_mark(q,lx,ly-5,34,st,1);wc_T(q,s,lx+36,ly+6,{w:700,size:30,col:WC_DARK});});});},{titleSize:32,barH:54});}
// where line i of the window is on the screen (its words' line)
const rr_ckY=i=>RR_CKL.y+i*RR_CKL.lh;
// one line grown to fill the screen: the warning, its check and what it found (u, 0 to 1, from its place in the list); the night's
// count of enrolments with no email (o.count) and its colour; o.state "warn" or "fail"
function rr_bigLine(ctx,u,o){if(u<=0)return;o=o||{};const e=easeCam(clamp(u,0,1)),st=o.state||"warn",[x,y,w]=GV_SC,yy=lerp(rr_ckY(RR_CKI.email),y+300,e),k=lerp(0.62,1,e);
  ctx.save();ctx.translate(960,yy);ctx.scale(k,k);withA(ctx,clamp(u*3,0,1),()=>{const bw=1180,bh=230;wc_panel(ctx,-bw/2,-bh/2,bw,bh,{kind:"card",wash:st==="fail"?GV.red:GV.amber,washA:0.24,seed:81});
    rr_mark(ctx,-bw/2+70,-36,56,st,1);wc_T(ctx,st==="fail"?"failed":"warning",-bw/2+120,-18,{w:800,size:44,col:st==="fail"?GV.redInk:GV.amberInk});
    wc_T(ctx,"Every short-course enrolment has an email",-bw/2+60,52,{w:700,size:46,col:WC_DARK});
    wc_T(ctx,(o.count==null?1:o.count)+" without",bw/2-60,-18,{w:800,size:44,align:"right",col:st==="fail"?GV.redInk:GV.amberInk});});ctx.restore();}
// the night's count of enrolments with no email, beside the page (n, 1 to 6, with a, 0 to 1): amber up to five, red at six, and
// "over 5" springing in
function rr_counter(ctx,n,a,over){if(a<=0.01)return;const v=Math.round(clamp(n,0,6)),red=v>=6;withA(ctx,a,()=>{ctx.save();ctx.translate(1400,470);
  wc_panel(ctx,-190,-150,380,300,{kind:"card",wash:red?GV.red:GV.amber,washA:red?0.3:0.22,seed:85});wc_T(ctx,"enrolments",0,-92,{w:700,size:30,align:"center",col:WC_INK});
  wc_T(ctx,"with no email",0,-56,{w:700,size:30,align:"center",col:WC_INK});wc_T(ctx,String(v),0,72,{w:800,size:120,align:"center",col:red?GV.redInk:GV.amberInk});
  if(over>0){const k=0.9+0.1*spring(clamp(over,0,1));ctx.save();ctx.translate(0,128);ctx.scale(k,k);withA(ctx,clamp(over*2,0,1),()=>wc_tag(ctx,0,0,"over 5",{align:"center",size:32,wash:GV.red,washA:0.4}));ctx.restore();}
  ctx.restore();});}

/* ---------- the rule register ---------- */
// Jun's desk from above, for the papers on it: pale grey laminate, his keyboard's edge, a dark mug, two sticky notes
function rr_paintJunTop(ctx){const col=[222,220,226];ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),col,{kind:"plaster",line:false,seed:121});
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,700,-120,1400,[255,250,240],0.3);ctx.restore();
  wc_part(ctx,wc_rect(1560,-40,400,100),[70,72,82],1);for(let i=0;i<7;i++)wc_flat(ctx,wc_rect(1576+i*48,-26,40,34),[96,98,110],1,"key");
  wc_wash(ctx,wc_ell(1830,990,80,80,40),[60,62,72],{kind:"thing",lw:1.6,seed:122});wc_wash(ctx,wc_ell(1830,990,58,58,40),[120,84,60],{kind:"thing",line:false,seed:123});
  gv_note(ctx,90,120,110,GV_NOTE[2],-0.08,124);gv_note(ctx,1840,170,100,GV_NOTE[0],0.06,125);}
// the rule register, open on Jun's desk: the series' kind of register page, in three columns (Rule, Owner, Dimension), drawn at the
// close-up's size (its own painter, as its rules are long). Each row: the rule, its owner, its dimension; an owner or dimension is
// written by hand as its p goes 0 to 1 (own[i], dim[i]), and lit red while it's empty (missA); learning (0 to 1) lights the
// learning team's lines gold as they're named; foot (0 to 1) writes the page's foot
const RR_RG={x:150,y:256,w:1620,cols:[[0,"Rule"],[900,"Owner"],[1290,"Dimension"]],row:58,sz:30,
  rows:[["Every learner has an ID","Learning team","completeness"],["No learner appears twice","Learning team","uniqueness"],["Every enrolment belongs to a learner","Learning team","consistency"],
    ["Every short-course enrolment has an email","Learning team","completeness"],["Planning's number matches the census report","Planning","accuracy"],
    ["Every student has a student number","Registrar's office","completeness"]]};
const rr_rgY=i=>RR_RG.y+204+RR_RG.row*i+RR_RG.row*0.62;
function rr_register(ctx,o){o=o||{};const G=RR_RG,x=G.x,y=G.y,w=G.w,own=o.own||[],dim=o.dim||[],mA=o.missA==null?1:o.missA,h=650,
    line=(x0,x1,ly,col,a,lw)=>{ctx.strokeStyle=rgba(col,a);ctx.lineWidth=lw||2;ctx.beginPath();ctx.moveTo(x0,ly);ctx.lineTo(x1,ly);ctx.stroke();};
  ctx.save();gv_sheet(ctx,x,y,w,h);const gut=ctx.createLinearGradient(x,0,x+70,0);gut.addColorStop(0,"rgba(70,60,50,0.24)");gut.addColorStop(1,"rgba(70,60,50,0)");ctx.fillStyle=gut;ctx.fillRect(x,y,70,h);
  ctx.lineCap="round";wc_T(ctx,"Rule register",x+60,y+58,{w:700,size:30,col:WC_MUTED});wc_T(ctx,"Data quality",x+60,y+116,{w:800,size:46,col:WC_DARK});line(x+60,x+w-50,y+146,WC_MUTED,0.45,2);
  G.cols.forEach(([cx,s])=>wc_T(ctx,s,x+60+cx,y+186,{w:700,size:30,col:WC_MUTED}));line(x+60,x+w-50,y+198,WC_MUTED,0.5,2);line(x+60,x+w-50,y+205,WC_MUTED,0.5,2);
  G.rows.forEach(([r,ow,dm],i)=>{const ry=y+204+G.row*i,ty=ry+G.row*0.62+10,lit=i<4?(o.learning||0):0;
    if(lit>0.01)gv_tint(ctx,x+50,ry+4,w-100,G.row-8,GV.gold,0.55*lit);
    wc_T(ctx,r,x+60,ty,{w:600,size:G.sz,col:WC_DARK});
    [[own[i]||0,ow,1],[dim[i]||0,dm,2]].forEach(([p,s,c])=>{const cx=x+60+G.cols[c][0],room=(c===1?G.cols[2][0]-G.cols[1][0]:w-110-G.cols[2][0])-24;
      if(p<1&&mA>0.01){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.red,0.72),mA*(1-clamp(p*2,0,1)));wc_tr(ctx,wc_rrPts(cx-10,ry+8,room+20,G.row-14,8));ctx.fill();ctx.restore();}
      if(p>0)wc_hand(ctx,s,cx+4,ty,{size:G.sz+2,w:600,col:GV_SIGN.ink,p});});
    line(x+60,x+w-50,ry+G.row,WC_MUTED,0.22,1.6);});
  ctx.strokeStyle=rgba(WC_MUTED,0.18);ctx.lineWidth=1.6;for(const c of [1,2]){ctx.beginPath();ctx.moveTo(x+44+G.cols[c][0],y+160);ctx.lineTo(x+44+G.cols[c][0],y+204+G.row*G.rows.length);ctx.stroke();}
  if(o.foot>0)wc_hand(ctx,"160 checks, each with an owner and a dimension",x+68,y+204+G.row*G.rows.length+58,{size:34,w:600,col:GV_SIGN.ink,p:o.foot});
  ctx.restore();}
// the six dimensions, as labels along the top of the page, each with a small sign: a full cup, one dot, a tick on a form, two linked
// rings, a target, a clock, laid out from their widths with a gap between each, the row centred. They drop in as each is named (u[i]);
// timeliness stays in pencil, "no checks yet" (yet)
const RR_DIM=["completeness","uniqueness","validity","consistency","accuracy","timeliness"];
function rr_dimSign(ctx,k,x,y,col){ctx.save();ctx.translate(x,y);ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";
  if(k===0){ctx.beginPath();ctx.moveTo(-13,-12);ctx.lineTo(-10,13);ctx.lineTo(10,13);ctx.lineTo(13,-12);ctx.stroke();ctx.globalAlpha*=0.6;ctx.beginPath();ctx.moveTo(-12,-7);ctx.lineTo(-10,11);ctx.lineTo(10,11);ctx.lineTo(12,-7);ctx.closePath();ctx.fill();}
  if(k===1){ctx.beginPath();ctx.arc(0,0,8,0,TAU);ctx.fill();}
  if(k===2){ctx.strokeRect(-12,-14,24,28);ctx.beginPath();ctx.moveTo(-6,1);ctx.lineTo(-1,6);ctx.lineTo(8,-6);ctx.stroke();}
  if(k===3){ctx.beginPath();ctx.arc(-6,0,9,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(6,0,9,0,TAU);ctx.stroke();}
  if(k===4){for(const r of [13,8,3]){ctx.beginPath();ctx.arc(0,0,r,0,TAU);r===3?ctx.fill():ctx.stroke();}}
  if(k===5){ctx.beginPath();ctx.arc(0,0,13,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(0,0);ctx.lineTo(6,4);ctx.stroke();}ctx.restore();}
function rr_dims(ctx,u,lit,yet){const ws=RR_DIM.map(s=>Math.round(tw(ctx,s,30,700)+82)),gap=24;let x0=960-(ws.reduce((a,b)=>a+b,0)+gap*(ws.length-1))/2;
  const xs=ws.map(w=>{const c=x0+w/2;x0+=w+gap;return c;});
  RR_DIM.forEach((s,k)=>{const a=clamp(u[k]||0,0,1);if(a<=0.01)return;const x=xs[k],y=162-18*(1-easeCam(a)),pen=k===5,wd=ws[k],l=pen?0:clamp(lit[k]||0,0,1);
  withA(ctx,clamp(a*2,0,1),()=>{ctx.save();ctx.translate(x,y);if(pen)ctx.setLineDash([7,6]);wc_panel(ctx,-wd/2,-30,wd,60,{kind:"tag",wash:pen?null:GV.gold,washA:0.12+0.3*l,seed:90+k});ctx.restore();
    rr_dimSign(ctx,k,x-wd/2+30,y,pen?WC_PENCIL:mix(WC_INK,GV.goldInk,l));wc_T(ctx,s,x-wd/2+56,y+11,{w:700,size:30,col:pen?WC_MUTED:WC_DARK});});
  if(pen&&yet>0)wc_hand(ctx,"no checks yet",x-wd/2+10,y+64,{size:30,w:600,col:WC_PENCIL,p:yet});});}
// a tag that hung empty beside the night's line, filled in ("owner: Learning team"), as the series' tag (u, 0 to 1: springing in)
function rr_tagIn(ctx,x,y,s,u,o){if(u<=0)return;const k=0.9+0.1*spring(clamp(u,0,1));ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(u*2.5,0,1),()=>wc_tag(ctx,0,0,s,Object.assign({align:"center",size:32},o||{})));ctx.restore();}

/* ---------- the scorecard's nights ---------- */
// the series' data quality scorecard (gv_scorecard, shared/src/rooms.js), with this film's nights: Thursday 15 October 2026 (three
// warnings in the learning row), Monday 19 October (the red night: one failure, and four areas not checked), Tuesday 20 October (the
// failure fixed; the night Fixed where it starts opens on). A cell is "passed/total", then w, f or n with how many; "" no check
const RR_SK15=[["Alumni","3/3","1/1","","1/1","","5/5"],["Course","","1/1","1/1","1/1","","3/3"],["Finance","1/1","4/4","2/2","1/1","1/1","9/9"],["HR","4/4","2/2","2/2","1/1","","9/9"],
  ["Learning","7/7w1","5/5","7/7w2","3/3","","22/22w3"],["Planning","","3/3","1/1","1/1","1/1","6/6"],["Registrar","9/9","4/4","5/5","2/2","","20/20"],
  ["Research","8/8","3/3","1/1","5/5","","17/17"],["Shared","1/1","1/1","","","","2/2"],["Student","21/21","16/16","8/8","18/18","","63/63"],["Wallet","","2/2","1/1","1/1","","4/4"],
  ["All","54/54w1","42/42","28/28w2","34/34","2/2","160/160w3"]];
const RR_SK19=[["Alumni","3/3","1/1","","1/1","","5/5"],["Course","","1/1","1/1","1/1","","3/3"],["Finance","1/1","2/4n2","1/2n1","0/1n1","0/1n1","4/9n5"],["HR","4/4","2/2","2/2","1/1","","9/9"],
  ["Learning","6/7f1","5/5","7/7w2","3/3","","21/22w2f1"],["Planning","","1/3n2","0/1n1","0/1n1","0/1n1","1/6n5"],["Registrar","9/9","4/4","5/5","2/2","","20/20"],
  ["Research","8/8","3/3","1/1","5/5","","17/17"],["Shared","1/1","1/1","","","","2/2"],["Student","17/21n4","10/16n6","4/8n4","10/18n8","","41/63n22"],["Wallet","","0/2n2","0/1n1","0/1n1","","0/4n4"],
  ["All","49/54f1n4","30/42n12","21/28w2n7","23/34n11","0/2n2","123/160w2f1n36"]];
const RR_SK20=RR_SK15.map(r=>r.map(c=>c==="7/7w1"?"7/7":c==="22/22w3"?"22/22w2":c==="54/54w1"?"54/54":c==="160/160w3"?"160/160w2":c));
const RR_EMW=[["Short-course enrolments: emails as typed","Learning team","6"],["Short-course learners: emails as typed","Learning team","3"]];
const RR_SEC15=[{title:"Warnings",state:"warn",rows:[["Short-course enrolments: no email","Learning team","1"]].concat(RR_EMW)}],
  RR_SEC19=[{title:"Failed",state:"fail",rows:[["Short-course enrolments: no email","Learning team","6"]]},{title:"Warnings",state:"warn",rows:RR_EMW},
    {title:"Not checked",state:"skip",heads:false,rows:[["Student","22 checks","held"],["Finance","5 checks","held"],["Planning","5 checks","held"],["Wallet","4 checks","held"]]}],
  RR_SEC20=[{title:"Warnings",state:"warn",rows:RR_EMW}];
// the series' scorecard (gv_skLay and gv_scorecard, shared/src/rooms.js), copied for the red night, which is too wide for two lines:
// its last row has a failure, warnings and checks not done in one cell. Here a cell can break a second time, before "not checked";
// each cell's lines sit in the middle of its row; and the page stays on its screen (o.h tall, the printout's longer), what's under its
// foot out of sight until o.scroll moves it up. Drawn the same way otherwise. A cell's lines: one, or two (broken after its count), or
// three (then before "not checked")
function rr_skLines(c,m){if(!c)return[];if(!m||!c.notes.length)return[[c.main,...c.notes].join(" · ")];const nc=c.notes.filter(s=>/not checked$/.test(s)),
    nn=c.notes.filter(s=>!/not checked$/.test(s));return m<2||!nc.length||!nn.length?[c.main,c.notes.join(" · ")]:[c.main,nn.join(" · "),nc.join(" · ")];}
const RR_SKL=new Map();
function rr_skLay(ctx,nights){const key=JSON.stringify(nights);if(RR_SKL.has(key))return RR_SKL.get(key);const K=GV_SK,cells=nights.map(rows=>rows.map(r=>r.slice(1).map(gv_skCell))),
    last=nights[0].length-1,wt=i=>i===last?800:600,sum=a=>a.reduce((s,v)=>s+v,0),
    widths=m=>[Math.max(tw(ctx,"Area",K.sz,700),...nights[0].map((r,i)=>tw(ctx,r[0],K.sz,wt(i)))),
      ...GV_SKD.map((d,j)=>Math.max(tw(ctx,d,K.sz,700),...cells.flatMap(rows=>rows.map((r,i)=>Math.max(0,...rr_skLines(r[j],m).map(s=>tw(ctx,s,K.sz,wt(i))))))))].map(v=>v+2*K.pad);
  let mode=0,cw=widths(0);while(mode<2&&sum(cw)>K.w)cw=widths(++mode);
  const spare=Math.max(0,K.w-sum(cw))/cw.length,cx=[K.x];cw=cw.map(v=>v+spare);cw.forEach((v,i)=>cx.push(cx[i]+v));
  let top=K.y+K.rh*0.28;const rows=nights[0].map((_,i)=>{const n=Math.max(1,...cells.flatMap(r=>r[i].map(c=>rr_skLines(c,mode).length))),h=K.rh+(n-1)*K.lh,
    r={top,h,mid:top+h/2+K.rh*0.22};top+=h;return r;});
  const L={cx,cw,rows,mode,bottom:top};RR_SKL.set(key,L);return L;}
function rr_scorecard(ctx,cam,o){o=o||{};const [x,y,w]=GV_SC,h=o.h||GV_SC[3],K=GV_SK,z=cam&&cam.z?cam.z:1,dz=s=>z*s<27?1:0,deco=dz(K.sz),rows=o.rows||[],after=o.after,
    e=after?easeCam(clamp(o.mx||0,0,1)):0,eo=1-clamp(e*2,0,1),en=clamp(e*2-1,0,1),p=o.p==null?1:clamp(o.p,0,1),secA=o.sections||[],
    secB=after?(o.afterSections||[]):secA,sc=o.scroll||0,barH=54;let L;
  gv_screen(ctx,x,y,w,h,"Data quality scorecard",q=>{q.save();q.beginPath();q.rect(x,y+barH,w,h-barH);q.clip();q.translate(0,-sc);
    L=rr_skLay(q,after?[rows,after]:[rows]);const nd=GV_SKD.length,N=rows.length*nd,hd=clamp(p*8,0,1);
    withA(q,hd,()=>wc_T(q,"last night's checks"+(o.date?" · "+o.date:""),K.x+K.pad,K.y-46,{w:600,size:K.sz+3,col:WC_MUTED,deco:dz(K.sz+3)}));
    if(o.hi!=null&&o.hiA>0.01){const r=L.rows[o.hi];gv_tint(q,K.x,r.top,K.w,r.h,GV.gold,0.55*o.hiA);}
    withA(q,hd,()=>["Area",...GV_SKD].forEach((s,j)=>wc_T(q,s,j?L.cx[j]+L.cw[j]/2:K.x+K.pad,K.y,{w:700,size:K.sz,align:j?"center":"left",col:WC_MUTED,deco})));
    const words=(c,j,r,wt,a,col)=>{if(!c||a<=0.01)return;const ls=rr_skLines(c,L.mode);ls.forEach((s,k)=>
      wc_T(q,s,L.cx[j]+L.cw[j]/2,r.mid+(k-(ls.length-1)/2)*K.lh,{w:wt,size:K.sz,align:"center",col,a,deco}));};
    rows.forEach((row,i)=>{const r=L.rows[i],wt=i===rows.length-1?800:600;withA(q,hd,()=>wc_T(q,row[0],K.x+K.pad,r.mid,{w:wt,size:K.sz,col:WC_DARK,deco}));
      for(let j=1;j<=nd;j++){const A=gv_skCell(row[j]),B=after?gv_skCell(after[i][j]):A,u=clamp((p-0.12)/0.88*N-(i*nd+j-1),0,1);if(u<=0||(!A&&!B))continue;
        const SA=A&&GV_SKST[A.state],SB=B&&GV_SKST[B.state],col=SA&&SB?mix(SA[0],SB[0],e):(SA||SB)[0],pale=SA&&SB?lerp(SA[1],SB[1],e):(SA||SB)[1],
          wa=u*(SA&&SB?1:SA?1-e:e),bx=L.cx[j]+6,by=r.top+2,bw=L.cw[j]-12,bh=r.h-5;
        withA(q,wa,()=>{q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(col,pale),1);q.fillRect(bx,by,bw,bh);q.restore();});
        const ha=u*((A&&A.state==="skip"?1-e:0)+(B&&B.state==="skip"?e:0));if(ha>0.01)gv_hatch(q,bx,by,bw,bh,ha);
        if(!after||row[j]===after[i][j])words(A,j,r,wt,u,SA[2]);else{words(A,j,r,wt,u*eo,SA&&SA[2]);words(B,j,r,wt,u*en,SB&&SB[2]);}}});
    const sections=(S,a)=>{const out=[];let ty=L.bottom+32;S.forEach(s=>{const st=GV_SKST[s.state],heads=s.heads===false?null:s.heads||K.heads,
        hx=(heads||[[null,0]]).map(([,f],k)=>k?K.x+f*K.w:K.x+K.pad+32);let ry=ty;
      withA(q,a,()=>{wc_T(q,s.title,K.x+K.pad,ty,{w:800,size:K.sz+3,col:WC_DARK,deco:dz(K.sz+3)});if(heads){ry+=30;heads.forEach(([hs],k)=>wc_T(q,hs,hx[k],ry,{w:700,size:K.sz,col:WC_MUTED,deco}));}});
      const ys=s.rows.map((cells,k)=>{const yy=ry+K.rh*(k+1);withA(q,a,()=>{q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(st[0],st[1]),1);
          q.fillRect(K.x+K.pad,yy-K.sz*0.8,20,20);q.restore();cells.forEach((c,m)=>wc_T(q,c,hx[m]==null?hx[0]:hx[m],yy,{w:600,size:K.sz,col:m?WC_INK:WC_DARK,deco}));});return yy;});
      out.push({title:ty,rows:ys,cols:hx});ty=(ys.length?ys[ys.length-1]:ry)+50;});return out;};
    const same=secA===secB;L.sec=sections(secA,same?1:eo);L.secB=same?null:sections(secB,en);L.scroll=sc;
    const clr=same?(secA.length?0:1):(secA.length?0:eo)+(secB.length?0:en);
    if(clr>0.01)wc_T(q,o.clear||"Every check passed.",K.x+K.pad,L.bottom+46,{w:700,size:K.sz+3,col:GV.greenInk,a:clr,deco:dz(K.sz+3)});
    q.restore();},{titleSize:32,barH});
  return L;}
// where the camera looks at the red night's table: all of it, its headings near the top of the frame and the screen's foot at the
// captions' edge, its words seen at 28.5 px
const RR_SKCAM=[960,522,1.5];
// a soft glow around a box that keeps to its shape (multiplied, so what's under it still shows), where the series' round halo would
// spill onto the cells next to it: s, how wide
function rr_glow(ctx,x,y,w,h,col,a,s){if(a<=0.01)return;s=s||12;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=a;ctx.filter="blur("+Math.round(s*0.45)+"px)";
  ctx.strokeStyle=rgba(wc_lit(col,0.15),1);ctx.lineWidth=s;rr(ctx,x-s*0.5,y-s*0.5,w+s,h+s,s*0.6);ctx.stroke();ctx.restore();}

/* ---------- the learning team's office, Tom's ---------- */
// the learning team's office, close, the camera at the height of someone sitting: apricot walls, a window onto the campus, a poster of
// this term's short courses, a shelf of brochures; the desk (its front layer) with a screen, a keyboard, a mug, a stack of leaflets
const RR_TX={top:800,seat:[1450,1.7],screen:[430,286,660,388],win:[70,60,300,440],poster:[1180,64,520,300]};
function rr_paintTom(ctx){const X=RR_TX,wall=GV_ROOM.learn;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:101});
  gv_lightGlow(ctx,900,-60,760);const [wx,wy,ww,wh]=X.win;gv_window(ctx,wx,wy,ww,wh,{wall,seed:30,tx:0.55});
  const [px,py,pw,ph]=X.poster;wc_wash(ctx,wc_rect(px,py,pw,ph),[251,250,245],{kind:"paper",lw:1.4,seed:102});for(const gx of [px+26,px+pw-26])gv_pin(ctx,gx,py+22,GV.red,1);
  for(let i=0;i<6;i++){const tx=px+30+(i%3)*160,ty=py+110+Math.floor(i/3)*90;wc_flat(ctx,wc_rect(tx,ty,140,72),[[236,170,34],[96,160,176],[150,120,190],[200,110,90],[120,170,110],[110,140,200]][i],0.6,"tile");}
  gv_bookcase(ctx,1760,X.top+40,280,X.top-60,[300,520],{col:[176,140,104]});for(const sy of [300,520])for(let i=0;i<4;i++)wc_part(ctx,wc_rect(1790+i*38,sy-120,30,120),[[236,170,34],[96,160,176],[200,110,90],[150,120,190]][i],1,{lw:1});}
function rr_paintTomDesk(ctx){const X=RR_TX,top=X.top;gv_deskFront(ctx,top,[214,178,138],[[60,330],[1560,330]]);
  const [sx,sy,sw,sh]=X.screen;gv_deskScreen(ctx,sx,sy,sw,sh,top);gv_keys(ctx,sx+80,top,sw-160,sx+sw+40);
  for(let i=0;i<5;i++)wc_flat(ctx,wc_rect(1200+i*3,top-8-i*8,220,10),[[236,170,34],[250,250,246],[96,160,176],[250,250,246],[200,110,90]][i],1,"leaflet");gv_mug(ctx,250,top+10,[96,160,176]);}
// the poster's heading, drawn every frame so it reads
function rr_tomPoster(ctx){const [px,py,pw]=RR_TX.poster;wc_T(ctx,"Short courses",px+30,py+74,{w:800,size:40,col:WC_DARK});wc_T(ctx,"this term",px+pw-30,py+74,{w:600,size:30,align:"right",col:WC_MUTED});}
// what his screen shows in the desk's view: the follow-up list, its title, its columns and n rows (too small to read), the first,
// February's walk-in, lit gold and its days open amber
function rr_tomScreenList(ctx,n){const [x,y,w,h]=RR_TX.screen,C=[[0.05,0.13],[0.21,0.26],[0.51,0.15],[0.69,0.16],[0.89,0.06]];
  gv_screen(ctx,x,y,w,h,"Enrolments to follow up",q=>{q.fillStyle=rgba(WC_MUTED,0.35);C.forEach(([a,b])=>q.fillRect(x+w*a,y+74,w*b*0.7,10));
    for(let i=0;i<n;i++){const yy=y+106+i*40;if(i===0)gv_tint(q,x+14,yy-11,w-28,36,GV.gold,0.45);
      C.forEach(([a,b],j)=>{q.fillStyle=rgba(j===4&&i===0?GV.amberInk:[176,182,196],0.85);q.fillRect(x+w*a,yy,w*b*(j===1?0.9:0.8),14);});}},{barH:48,titleSize:28});}
// the learning team's desk from above, for the papers on it: pale beech with its grain, Tom's blue mug, a pencil, the edge of his
// keyboard and a fan of this term's leaflets
const RR_TT={wood:[214,178,138],log:[310,176,1300],card:[460,150,1000]};
function rr_paintTomTop(ctx){const col=RR_TT.wood;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),col,{kind:"plaster",line:false,seed:111});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(12);for(let i=0;i<60;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(col,0.18+R()*0.1),0.16+R()*0.12);ctx.lineWidth=1+R()*2.2;
    ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+5*Math.sin(x/320+i)+3*Math.sin(x/95+i*2));ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,300,-120,1400,[255,250,236],0.3);ctx.restore();
  wc_part(ctx,wc_rect(1540,-40,420,110),[226,228,234],1);for(let i=0;i<8;i++)for(let j=0;j<2;j++)wc_flat(ctx,wc_rect(1556+i*48,-26+j*44,40,36),[244,245,248],1,"key");
  wc_wash(ctx,wc_ell(130,150,80,80,40),[96,160,176],{kind:"thing",lw:1.6,seed:112});wc_wash(ctx,wc_ell(130,150,60,60,40),[150,104,70],{kind:"thing",line:false,seed:113});
  wc_part(ctx,[[60,980],[330,900],[336,912],[66,994]],[244,196,80],1);wc_flat(ctx,[[330,900],[360,892],[336,912]],[60,54,58],1,"tip");
  [[1690,900,-0.18,[236,170,34]],[1720,930,-0.05,[96,160,176]],[1745,960,0.1,[200,110,90]]].forEach(([lx,ly,r,c])=>{ctx.save();ctx.translate(lx,ly);ctx.rotate(r);
    gv_sheet(ctx,-120,-150,240,300,{col:[251,250,245]});wc_flat(ctx,wc_rect(-104,-134,208,90),c,0.7,"leaflet");ctx.restore();});}
// Planning's desk from above: light oak, a sage folder in the corner under a mug, a calculator's corner
function rr_paintPlanTop(ctx){const col=[226,204,168];ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),col,{kind:"plaster",line:false,seed:131});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(14);for(let i=0;i<46;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(col,0.16+R()*0.1),0.14+R()*0.1);ctx.lineWidth=1+R()*2;
    ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+4*Math.sin(x/290+i)+3*Math.sin(x/88+i*2));ctx.stroke();}ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,1500,-120,1300,[255,250,236],0.3);ctx.restore();
  ctx.save();ctx.translate(1560,900);ctx.rotate(0.12);wc_wash(ctx,wc_rect(-200,-260,400,520),[150,176,140],{kind:"cover",lw:1.4,seed:132});ctx.restore();
  wc_part(ctx,wc_rect(-40,860,300,260),[70,74,84],1);for(let i=0;i<4;i++)for(let j=0;j<2;j++)wc_flat(ctx,wc_rect(20+i*56,900+j*56,44,40),[110,114,126],1,"key");
  wc_wash(ctx,wc_ell(1800,960,76,76,40),[226,160,70],{kind:"thing",lw:1.6,seed:133});wc_wash(ctx,wc_ell(1800,960,56,56,40),[150,104,70],{kind:"thing",line:false,seed:134});}

/* ---------- the rule cards ---------- */
// the series' sign-off sheet as a quality rule card (agreed with Fixed where it starts): "Quality rule", the rule as its title, then
// Owner, Dimension, Level and Why, the owner's signature and a stamp. A card with a gap comes back lit red, what's needed written
// under it in red, and stamped "sent back"
const RR_RLT={kicker:"Quality rule",title:"Every short-course enrolment has an email",
    rows:[["Owner","Learning team"],["Dimension","completeness"],["Level","warn on any, stop above five"],["Why","one or two walk-ins a term are normal"]]},
  RR_RLC={kicker:"Quality rule",title:"Planning's number matches the census report",
    rows:[["Owner","Planning"],["Dimension","accuracy"],["Level","stop on any difference"],["Why","that number goes to the government"]]},
  RR_RLR={kicker:"Quality rule",title:"Every course has a room",rows:[["Owner",null],["Dimension","completeness"],["Level","warn on any"],["Why",null]]},
  RR_RLA={kicker:"Quality rule",title:"Every award has a date",rows:[["Owner",null],["Dimension","completeness"],["Level","warn on any"],["Why","the date goes on the certificate"]]};
// a pen lying on the desk or writing, its tip at (x,y)
function rr_pen(ctx,x,y,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot==null?-0.75:rot);ctx.fillStyle="rgba(40,30,20,0.22)";ctx.fillRect(14,12,220,12);
  wc_part(ctx,[[0,0],[26,-8],[26,8]],[200,200,206],1,{lw:1});wc_part(ctx,wc_rrPts(26,-9,210,18,8),[34,44,92],1,{kind:"thing",lw:1.1,seed:115});ctx.restore();}
// a card at (x,y), w wide: its rows coming in (p), the owner's signature written in as a pen moves along it (sign), the stamp (stamp);
// o.lit {row: 0 to 1} washes a row gold as it's read; o.card the card (RR_RLT...), o.signer; o.pen false for a card signed before
function rr_rule(ctx,x,y,w,card,o){o=o||{};const sign=o.sign||0,stamp=o.stamp||0,tl=card.title||"",fit=Math.min(42,42*890/Math.max(1,tw(ctx,tl,42,800))),
    r=gv_signoff(ctx,x,y,w,Object.assign({p:o.p==null?1:o.p,missA:o.missA,signer:o.signer,signP:sign,
    stamp:o.stampKind||(o.signer!=null?"signed":null),stampP:stamp,ask:o.ask,askP:o.askP,rot:o.rot},card,fit<42?{title:" "}:{}));
  if(fit<42){ctx.save();ctx.translate(x,y);ctx.scale(w/1000,w/1000);wc_T(ctx,tl,48,124,{w:800,size:fit,col:WC_DARK});ctx.restore();}
  if(o.lit)for(const i in o.lit){const a=o.lit[i];if(a>0.01)gv_tint(ctx,x+30*w/1000,r.rows[i]-28*w/1000,w-60*w/1000,56*w/1000,GV.gold,0.6*a);}
  if(sign>0&&o.signer&&o.pen!==false){const k=w/1000,n=Math.ceil(o.signer.length*clamp(sign,0,1)),sx=r.x+(12+tw(ctx,o.signer.slice(0,n),38,600))*k,sy=r.rows[r.rows.length-1]+105*k,
      dn=clamp(stamp*3,0,1);rr_pen(ctx,lerp(sx,x+w+110,dn),lerp(sy,y+r.h+40*k,dn),lerp(-0.75,-0.35,dn));}
  return r;}
// the level, beside an owner's card: what the night does at each count (a: all but the last, b: the stop), under a heading (head), and a
// marker that runs along them (m, 0 to 6). Tom's: enrolments with no email, 0 passes, 1 to 5 warn, 6 stops; Planning's: differences
// from the census report, none passes, any stops
const RR_LV=[["0",GV.green,"passes"],["1–5",GV.amber,"warns"],["6",GV.red,"stops"]],RR_LVC=[["0",GV.green,"passes"],["any",GV.red,"stops"]];
function rr_level(ctx,x,y,a,b,m,segs,head){if(a<=0.01)return;segs=segs||RR_LV;const n=segs.length;
  if(head)wc_T(ctx,head,x,y-26,{w:700,size:30,col:WC_INK,a:clamp(a*2,0,1)});
  segs.forEach(([s,col,w2],i)=>{const u=i<n-1?a:b;if(u<=0.01)return;const yy=y+i*130;withA(ctx,clamp(u*2,0,1),()=>{wc_panel(ctx,x,yy,300,104,{kind:"card",wash:col,washA:0.3,seed:140+i});
    wc_T(ctx,s,x+30,yy+66,{w:800,size:48,col:col===GV.green?GV.greenInk:col===GV.amber?GV.amberInk:GV.redInk});wc_T(ctx,w2,x+(s.length>2?160:150),yy+64,{w:700,size:32,col:WC_DARK});});});
  if(m!=null&&a>0.5){const v=clamp(m,0,6),i=n===3?(v<0.5?0:v<5.5?1:2):(v<0.5?0:1);ctx.save();ctx.translate(x-34,y+52+i*130);ctx.fillStyle=rgba(WC_DARK,0.85);ctx.beginPath();ctx.moveTo(0,-14);ctx.lineTo(22,0);ctx.lineTo(0,14);ctx.closePath();ctx.fill();ctx.restore();}}

/* ---------- slips, cards and the list ---------- */
// warning slips, piling up (n, how many), each a small amber slip with "warning" on it; o.owner writes "owner: —" on each; o.mine
// (0 to 1) lands "owner: Learning team" on the pile in gold. (x, y): the pile's foot
function rr_slips(ctx,x,y,n,o){o=o||{};const N=Math.floor(n),f=n-N,top=Math.min(N+(f>0.5?1:0),40)-1,g=clamp(o.grey||0,0,1),wash=mix(GV.amber,GV.grey,g),ink=mix(GV.amberInk,GV.greyInk,g);
  for(let i=0;i<Math.min(N+1,40);i++){const u=i<N?1:f;if(u<=0.01)continue;const R=wc_rng(500+i),px=x+(R()-0.5)*40,py=y-i*9-(1-easeCam(u))*60,rot=(R()-0.5)*0.24;
  withA(ctx,clamp(u*2,0,1),()=>{ctx.save();ctx.translate(px,py);ctx.rotate(rot);wc_panel(ctx,-130,-38,260,76,{kind:"card",wash,washA:0.3,seed:600+i%7});
    if(i===top){wc_T(ctx,"warning",-108,o.owner?-6:10,{w:700,size:28,col:ink});if(o.owner)wc_T(ctx,"owner: —",-108,28,{w:600,size:28,col:WC_INK});}ctx.restore();});}
  if(o.mine>0){const k=0.9+0.1*spring(clamp(o.mine,0,1));ctx.save();ctx.translate(x,y-Math.min(N,40)*9-70);ctx.scale(k,k);ctx.rotate(-0.04);
    withA(ctx,clamp(o.mine*2,0,1),()=>wc_tag(ctx,0,0,"owner: Learning team",{align:"center",size:34,wash:GV.gold,washA:0.5}));ctx.restore();}}
// an enrolment card: its number, its course and status, its email (or a dash); o.cert, a certificate beside it that can't find an
// address (0 to 1)
function rr_enrolCard(ctx,x,y,u,o){if(u<=0)return;o=o||{};const e=easeCam(clamp(u,0,1));ctx.save();ctx.translate(x,y);ctx.scale(lerp(0.92,1,e),lerp(0.92,1,e));
  withA(ctx,clamp(u*2.2,0,1),()=>{wc_panel(ctx,-280,-110,560,220,{kind:"card",seed:151});wc_T(ctx,"Enrolment E-7010",-250,-48,{w:800,size:36,col:WC_DARK});
    wc_T(ctx,"Excel for Everyone · completed",-250,4,{w:600,size:30,col:WC_INK});wc_T(ctx,"email:",-250,64,{w:600,size:30,col:WC_MUTED});wc_T(ctx,"—",-150,64,{w:800,size:34,col:GV.redInk});
    if(o.cert>0)withA(ctx,clamp(o.cert,0,1),()=>{ctx.save();ctx.translate(390,-10);ctx.rotate(0.06);wc_panel(ctx,-90,-66,180,132,{kind:"card",wash:GV.gold,washA:0.22,seed:153});
      wc_T(ctx,"certificate",0,-22,{w:700,size:22,align:"center",col:WC_INK,deco:1});gv_lines(ctx,-56,4,112,2,16,0.7);ctx.restore();gv_qmark(ctx,470,-70,64,clamp(o.cert*1.5-0.4,0,1));});});ctx.restore();}
// an email as it was typed, in a plain monospaced line: its spaces shown as light boxes and its capitals lit amber; then through a
// small sieve (sv, 0 to 1), it comes out cleaned
const RR_EM=" Aisha.K@Mail.example ",RR_EMC="aisha.k@mail.example";
function rr_typed(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{const sz=38,cw=tw(ctx,"M",sz,500,"mono");wc_panel(ctx,x-20,y-52,cw*RR_EM.length+40,76,{kind:"card",seed:161});
  for(let i=0;i<RR_EM.length;i++){const c=RR_EM[i],cx=x+i*cw;if(c===" "){ctx.fillStyle=rgba(GV.amber,0.35);ctx.fillRect(cx+2,y-34,cw-4,40);ctx.strokeStyle=rgba(GV.amberInk,0.7);ctx.lineWidth=2;ctx.strokeRect(cx+2,y-34,cw-4,40);continue;}
    const cap=c!==c.toLowerCase();if(cap){ctx.fillStyle=rgba(GV.amber,0.3);ctx.fillRect(cx,y-36,cw,44);}wc_T(ctx,c,cx,y,{w:500,size:sz,f:"mono",col:cap?GV.amberInk:WC_DARK});}});}
function rr_sieve(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,70,20,0,0,TAU);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-70,0);ctx.quadraticCurveTo(0,110,70,0);ctx.stroke();ctx.lineWidth=1.4;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*18,8);ctx.lineTo(i*12,72-Math.abs(i)*8);ctx.stroke();}
  for(let j=1;j<4;j++){ctx.beginPath();ctx.ellipse(0,j*18,70-j*16,8,0,0,Math.PI);ctx.stroke();}ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(70,0);ctx.lineTo(150,-20);ctx.stroke();ctx.restore();});}
function rr_clean(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{const sz=38,cw=tw(ctx,"M",sz,500,"mono");wc_panel(ctx,x-20,y-52,cw*RR_EMC.length+40,76,{kind:"card",wash:GV.green,washA:0.18,seed:163});
  wc_T(ctx,RR_EMC,x,y,{w:500,size:sz,f:"mono",col:WC_DARK});});}

// the follow-up list on Tom's screen, the team's own, a plain page made every night with the rest: its rows (each [enrolment, course,
// status, enrolled, days open], u: how far in), a note written on the first row (note), the rows' emails written in by noon (em[i])
const RR_LC=[["Enrolment",370],["Course",560],["Status",900],["Enrolled",1100],["Days open",1556]];
const RR_L1=[["E-7010","Excel for Everyone","completed","17 Feb 2026","240"]],
  RR_L6=[["E-7010","Excel for Everyone","completed","17 Feb 2026","244"]].concat([1,2,3,4,5].map(i=>["E-702"+i,"First Aid","enrolled","19 Oct 2026","0"]));
function rr_list(ctx,rows,o){o=o||{};const [x,y,w,h]=GV_SC,z=o.cam&&o.cam.z?o.cam.z:1,deco=z*28<27?1:0;gv_screen(ctx,x,y,w,h,"Enrolments to follow up",q=>{
  RR_LC.forEach(([s,cx],i)=>wc_T(q,s,cx,y+112,{w:700,size:28,align:i===4?"right":"left",col:WC_MUTED,deco}));q.save();q.strokeStyle=rgba(WC_MUTED,0.45);q.lineWidth=2;q.beginPath();q.moveTo(x+30,y+130);q.lineTo(x+w-30,y+130);q.stroke();q.restore();
  rows.forEach((r,i)=>{const a=o.rowA?clamp(o.rowA[i]==null?1:o.rowA[i],0,1):1;if(a<=0.01)return;const yy=y+186+i*70;withA(q,a,()=>{
    if(o.lit&&o.lit[i]>0.01)gv_tint(q,x+24,yy-44,w-48,62,GV.gold,0.5*o.lit[i]);
    r.forEach((c,j)=>wc_T(q,c,RR_LC[j][1],yy,{w:j===0?700:600,size:30,align:j===4?"right":"left",f:j===0?"mono":undefined,col:j===4&&c!=="0"&&+c>30?GV.amberInk:WC_DARK,deco}));
    if(o.done&&o.done[i]>0){const d=clamp(o.done[i],0,1);wc_tick(q,x+w-40,yy-10,36,GV.green,d,5);}
    q.save();q.strokeStyle=rgba(WC_MUTED,0.2);q.lineWidth=1.6;q.beginPath();q.moveTo(x+30,yy+24);q.lineTo(x+w-30,yy+24);q.stroke();q.restore();});});
  if(o.note>0){const s="called · email to come";wc_T(q,s.slice(0,Math.ceil(s.length*clamp(o.note,0,1))),RR_LC[1][1],y+186+60,{w:600,size:30,col:GV_SIGN.ink,deco});}
  if(o.empty>0)wc_T(q,"Nobody to follow up.",x+40,y+186,{w:700,size:32,col:GV.greenInk,a:clamp(o.empty,0,1)});},{titleSize:32,barH:54});}
// two cards side by side: what a check is, and what a list is (a, b: each 0 to 1)
function rr_twoCards(ctx,a,b,hiA,hiB){[[a,560,"a check",["about the data","can stop the update"],GV.green,hiA||0],[b,1360,"a list",["about what people do","a case to work through"],GV_ROOM.learn,hiB||0]].forEach(([u,x,t,L,col,hi],i)=>{
  if(u<=0.01)return;const e=easeCam(clamp(u,0,1));ctx.save();ctx.translate(x,440-20*(1-e));ctx.rotate(i?0.015:-0.015);rr_glow(ctx,-330,-230,660,460,GV.gold,0.9*hi*clamp(u*2,0,1),22);withA(ctx,clamp(u*2,0,1),()=>{
    wc_panel(ctx,-330,-230,660,460,{kind:"card",wash:col,washA:i?0.5:0.22,seed:170+i});wc_T(ctx,t,-280,-120,{w:800,size:64,col:WC_DARK});
    L.forEach((s,j)=>wc_T(ctx,s,-280,10+j*76,{w:600,size:40,col:WC_INK}));});ctx.restore();});}

/* ---------- the red night ---------- */
// the four reports built from the short courses, as covers pinned on the data team's board, each with its name on a label and a
// pale slip for its state, stamped "HELD · yesterday's numbers" one after another (held[i], 0 to 1); lifted again the next night
// (lift, 0 to 1). The slip keeps the red stamp readable on the dark covers at night
const RR_CV=[["Student records",[96,118,150]],["Planning's numbers",[120,140,104]],["Finance",[150,90,80]],["Wallet",[110,96,130]]];
function rr_covers(ctx,held,lift){RR_CV.forEach(([s,col],i)=>{const x=290+(i%2)*700,y=110+Math.floor(i/2)*380,h=held[i]||0;ctx.save();ctx.translate(x+310,y+170);ctx.rotate([-0.02,0.015,0.01,-0.015][i]);
  ctx.drawImage(wc_kept("rrCover"+i,680,380,q=>{q.translate(30,20);q.save();q.filter="blur(8px)";q.fillStyle="rgba(50,40,30,0.3)";q.fillRect(8,12,620,330);q.restore();
    wc_wash(q,wc_rect(0,0,620,330),col,{kind:"cover",lw:1.4,seed:181+i});wc_flat(q,wc_rect(0,0,56,330),wc_dim(col,0.3),1,"spine");wc_flat(q,wc_rect(100,60,460,120),WC_CARD,1,"label");
    wc_flat(q,wc_rect(66,202,528,96),WC_CARD,1,"label");}),-340,-190);
  gv_pin(ctx,0,-150,GV.red,1.2);wc_T(ctx,s,-30+50,-60,{w:800,size:40,align:"center",col:WC_DARK});wc_T(ctx,"report",-30+50,-16,{w:600,size:28,align:"center",col:WC_MUTED});
  if(h>0)gv_stamp(ctx,10,80,"HELD · yesterday's numbers",h,{size:32,col:GV.redInk,rot:-0.05,a:1-clamp(lift||0,0,1)});ctx.restore();});}
// a desk clock at noon (a, 0 to 1)
function rr_clock(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{wc_wash(ctx,wc_ell(x,y,92,92,40),[70,74,84],{kind:"thing",lw:1.6,seed:191});wc_wash(ctx,wc_ell(x,y,78,78,40),[252,250,244],{kind:"thing",line:false,seed:192});
  ctx.save();ctx.strokeStyle=rgba(WC_DARK,0.8);ctx.lineCap="round";for(let i=0;i<12;i++){const an=i/12*TAU;ctx.lineWidth=i%3?2:4;ctx.beginPath();ctx.moveTo(x+Math.sin(an)*64,y-Math.cos(an)*64);ctx.lineTo(x+Math.sin(an)*72,y-Math.cos(an)*72);ctx.stroke();}
  ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-40);ctx.stroke();ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+2,y-60);ctx.stroke();ctx.restore();
  wc_T(ctx,"12:00",x,y+136,{w:800,size:36,align:"center",f:"mono",col:WC_DARK});});}
// the six enrolments on Tom's desk, as cards: by noon each gets its email written in (em[i], 0 to 1) and a green tick: a learner
// registered (the email is written in by hand, the way the team took it on the phone)
const RR_SIXE=["l.fischer@mail.example","k.osei@mail.example","m.silva@mail.example","h.nakamura@mail.example","r.costa@mail.example","s.oduya@mail.example"];
function rr_sixCards(ctx,em,u){RR_L6.forEach((r,i)=>{const a=clamp((u==null?1:u)*6-i,0,1);if(a<=0.01)return;const x=i<3?560:1360,y=200+(i%3)*226;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate([-0.012,0.01,-0.006,0.008,-0.01,0.012][i]);wc_panel(ctx,-350,-90,700,180,{kind:"card",wash:em[i]>0.9?GV.green:null,washA:0.14,seed:200+i});
    wc_T(ctx,r[0],-310,-30,{w:700,size:34,f:"mono",col:WC_DARK});wc_T(ctx,r[1],-120,-30,{w:600,size:32,col:WC_INK});wc_T(ctx,"email:",-310,40,{w:600,size:30,col:WC_MUTED});
    if(!(em[i]>0))wc_T(ctx,"—",-210,40,{w:800,size:34,col:GV.redInk});else{wc_hand(ctx,RR_SIXE[i],-210,40,{size:32,w:600,col:GV_SIGN.ink,p:clamp(em[i]*1.3,0,1)});wc_tick(ctx,300,-30,40,GV.green,clamp(em[i]*3-2,0,1),5);}
    ctx.restore();});});}
// the issue log, as Fixed where it starts keeps it (the series' register page, agreed between the two films): open in its blue boards
// on Tom's desk at the Monday's lines. The night's failure is written in by hand (write, 0 to 1) and lit gold (hiA); the emails' line,
// from the same morning, stays unlit; the next night the failure's line is stamped closed (stamp, 0 to 1), on the ruled line under it
const RR_IL={kicker:"Issue log",title:"Data quality",h:540,cols:[["Opened",0.13],["Issue",0.48],["Owner",0.25],["Due",0.14]]};
function rr_issueBook(ctx,x,y,w){const h=RR_IL.h*w/1000;ctx.drawImage(wc_kept("rrIssueBook"+w,w+160,h+120,q=>{q.translate(70,40);
    q.save();q.filter="blur(10px)";q.fillStyle="rgba(50,40,30,0.3)";q.fillRect(-40,-8,w+70,h+44);q.restore();
    wc_wash(q,wc_rrPts(-46,-22,w+72,h+44,10),[58,82,118],{kind:"cover",lw:1.4,seed:116});wc_flat(q,wc_rect(-46,-22,34,h+44),[40,58,88],1,"spine");
    for(let i=3;i>0;i--)wc_flat(q,wc_rect(i*3,i*3,w,h),[240-i*8,236-i*8,226-i*8],1,"pages");}),x-70,y-40);}
function rr_issueLog(ctx,x,y,w,o){o=o||{};rr_issueBook(ctx,x,y,w);const wr=o.write==null?1:o.write,hand=(t,i)=>wr>=1?t:{t,hand:true,p:clamp(wr*4-i,0,1)};
  const rows=[["19 Oct","Enrolments with no email, 6","Learning team","20 Oct"].map(hand),["","","",""],["19 Oct","Short-course emails as typed","Learning team","26 Oct"],["","","",""]];
  const r=gv_register(ctx,x,y,w,Object.assign({hi:0,hiA:o.hiA||0,rows},RR_IL));
  if(o.stamp>0)gv_stamp(ctx,x+(48+904*(0.13+0.24))*w/1000,r.rows[1],"CLOSED: the check passes",o.stamp,{size:30*w/1000*1.2,col:GV.greenInk,rot:0.03});return r;}

/* ---------- the close: Yusuf's board ---------- */
// the board in his office, close, at the end: the survey's chart on the left, the red morning's scorecard printed and pinned on the
// right, and between them, for a moment, the column with its gold mark (col, 0 to 1). The printout is that morning's screen, its
// table, drawn smaller: its washes carry it, and the tags beside it say what they mean
const RR_PR={x:877.4,y:259.4,k:0.58};
function rr_printout(ctx,cam,o){o=o||{};const P=RR_PR,z=(cam&&cam.z?cam.z:1)*P.k,[sx,sy,sw,sh]=GV_SC;ctx.save();ctx.translate(P.x,P.y);ctx.scale(P.k,P.k);ctx.translate(-sx,-sy);
  // the paper it's printed on: the screen as it was that morning, its table; its words are decoration until the camera is close
  gv_sheet(ctx,sx-30,sy-30,sw+60,sh+60);
  const L=rr_asDeco(z*32<27,()=>rr_scorecard(ctx,{z},Object.assign({rows:RR_SK19,date:"19 October 2026",sections:RR_SEC19},o)));if(o.fn)o.fn(ctx,L);ctx.restore();
  const tx=P.x-30*P.k,ty=P.y-30*P.k+12;gv_pin(ctx,tx+40,ty,GV.red,1.1);gv_pin(ctx,tx+(sw+60)*P.k-40,ty,GV.red,1.1);return L;}
// a point on the printout, from the scorecard's own coordinates
const rr_prPt=(px,py)=>[RR_PR.x+(px-GV_SC[0])*RR_PR.k,RR_PR.y+(py-GV_SC[1])*RR_PR.k];
function rr_vignette(ctx,x,y,r,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.beginPath();ctx.ellipse(x,y,r,r*1.3,0,0,TAU);ctx.clip();
  ctx.translate(x,y);ctx.scale(r/360,r/360);ctx.translate(-960,-540+260);ctx.drawImage(gv_place("column"),0,0,W,H);rr_columnClose(ctx,0,rr_cub(16)+0.04,1);ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(x,y,r,r*1.3,0,0,TAU);ctx.stroke();ctx.restore();});}

const WC_PLACES={nile:rr_paintNile,green:rr_paintGreen,dry:rr_paintDry,roda:rr_paintRoda,well:rr_paintWell,wellFront:rr_paintWellFront,column:rr_paintColumnBack,diwan:rr_paintDiwan,
  office:c=>{gv_paintOffice(c);rr_paintOfficeWall(c);},policy:rr_paintPolicy,screenGov:c=>gv_paintScreenDesk(c,GV_ROOM.gov),boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),
  data:c=>{gv_paintData(c);rr_paintDataBoard(c);},screenData:c=>gv_paintScreenDesk(c,GV_ROOM.data),boardData:c=>gv_paintBoardClose(c,GV_ROOM.data),junTop:rr_paintJunTop,
  planning:gv_paintPlanning,planTop:rr_paintPlanTop,tom:rr_paintTom,tomDesk:rr_paintTomDesk,tomTop:rr_paintTomTop,screenLearn:c=>gv_paintScreenDesk(c,GV_ROOM.learn)};
