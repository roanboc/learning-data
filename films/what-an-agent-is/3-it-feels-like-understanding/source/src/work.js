/* ===== It feels like understanding: today's things =====
   Jun's desk in the data team's room and the agent on the wall beside it, as the series draws it (the sphere in its oak ring, the
   hands, the three read-only tools, the answer with its evidence: ag_evidence); Anil's desk in the Faculty of Health; the advisers
   and their lists; students as plain shapes; the zip and its scale of seven; the gauges; the calendar; the evidence folder; the
   team's log; the faculty's own list; the table the agent read. */

/* ---------------------------------------------------------------- Jun's desk: the desk first, Jun behind it (cut at its back edge, his
   forearms on it when he types), then his screen, its lines decoration only (what's on it is never read there). FU_JUN: where he
   sits, his size, the desk, the screen. o.folder: the evidence folder on the desk's front corner ({dust, open}) */
// gestures from the desk that keep the far forearm on it, for pose2 over pose "desk": a hand to the chin, thinking; an open hand
const FU_CHIN={near:[40,160,"rest"],far:[-6,84,"rest"]},FU_OPEN={near:[24,100,"open"],far:[-6,84,"rest"]};
const FU_JUN={x:300,neck:582,s:0.66,desk:[20,850,900],screen:[452,652,240,136]};
function fu_junDesk(ctx,t,o){o=o||{};const J=FU_JUN,[dx,dy,dw]=J.desk;
  ag_desk(ctx,dx,dy,dw,{});
  const pose=o.pose||"hang",ln=o.lean||0;ag_person(ctx,"jun",J.x-ln*16,J.neck+ln*7,J.s,{t,cut:dy-70,pose,pose2:o.pose2,mix:o.mix,gaze:o.gaze||[3,0],nod:(o.nod||0)-ln*0.05,smile:o.smile,talk:o.talk});
  const [sx,sy,sw,sh]=J.screen;ag_screen(ctx,sx,sy,sw,sh,{stand:22,draw:o.screen||((c,x,y,w,h)=>fu_screenLines(c,x,y,w,h,0))});
  if(o.folder)fu_folder(ctx,dx+dw-216,dy-66,Object.assign({w:200,h:56},o.folder));}

/* ---------------------------------------------------------------- the agent, on the wall to Jun's right: its loop, its hands and its three
   read-only tools (A model, reasoning, hands and a loop draws them so). o: core, think, lit, col, pulse (a degree on the ring, or null),
   reach [u, u, u] (each hand out to its tool, 0 to 1), data [d, d, d] (data coming back), touch [k, k, k], a, toolsA, frost (0 to 1: the
   agent behind frosted glass, its ring a blur) */
const FU_AG={x:1150,y:400,R:160,r:76,tools:[["Catalog",1530,190],["Query",1530,350],["Docs",1530,510]],tw:300,th:126};
function fu_reachCurve(i){const A=FU_AG,T=A.tools[i],x0=A.x+A.R*0.96,y0=A.y+(i-1)*36,x1=T[1]-6,y1=T[2]+A.th/2;return[x0,y0,x0+110,y0+(i-1)*10,x1-120,y1,x1,y1];}
function fu_agentDraw(ctx,t,o){const A=FU_AG,ta=o.toolsA==null?1:o.toolsA;
  if(!o.noTools)for(let i=0;i<3;i++){const T=A.tools[i];ag_tool(ctx,T[1],T[2],A.tw,A.th,T[0],{touch:(o.touch||[])[i]||0,a:ta});}if(o.onlyTools)return;
  for(let i=0;i<3;i++){const u=(o.reach||[])[i]||0;if(u>0)ag_reach(ctx,fu_reachCurve(i),u,{data:(o.data||[])[i]||0,k:0.9});}
  ag_loop(ctx,A.x,A.y,{R:A.R,r:A.r,label:null,core:o.core==null?0.6:o.core,think:o.think||0,lit:o.lit,col:o.col,t,pulse:o.pulse==null?null:{deg:o.pulse,a:o.pulseA==null?1:o.pulseA},floor:null});}
function fu_agent(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const fr=o.frost||0;
  if(fr<=0){withA(ctx,a,()=>fu_agentDraw(ctx,t,o));return;}
  // behind frosted glass: the agent drawn into a layer, blurred as glass blurs what's behind it, and the pane over it
  withA(ctx,a,()=>fu_agentDraw(ctx,t,Object.assign({},o,{onlyTools:true})));
  const m=ctx.getTransform(),[bc,bx]=ag_buf("fuFrost",ctx.canvas.width,ctx.canvas.height);bx.setTransform(m);fu_agentDraw(bx,t,Object.assign({},o,{noTools:true}));
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.filter="blur("+(Math.max(0.1,fr*14*Math.hypot(m.a,m.b))).toFixed(1)+"px)";ctx.drawImage(bc,0,0);ctx.restore();
  const gx=FU_AG.x-FU_AG.R-100+(1-ag_sine(fr))*360,gy=FU_AG.y-FU_AG.R-64,gw=FU_AG.R*2+200,gh=FU_AG.R*2+124;
  ctx.save();ctx.globalAlpha*=a*fr;ctx.fillStyle="rgba(244,246,248,0.42)";rr(ctx,gx,gy,gw,gh,18);ctx.fill();
  ctx.save();rr(ctx,gx,gy,gw,gh,18);ctx.clip();ctx.fillStyle="rgba(255,255,255,0.3)";for(const [u,s] of [[0.2,0.1],[0.42,0.04]]){ctx.beginPath();ctx.moveTo(gx+gw*u,gy);ctx.lineTo(gx+gw*(u+s),gy);ctx.lineTo(gx+gw*(u+s)-gh*0.4,gy+gh);ctx.lineTo(gx+gw*u-gh*0.4,gy+gh);ctx.closePath();ctx.fill();}ctx.restore();
  ctx.strokeStyle="rgba(150,160,170,0.7)";ctx.lineWidth=2;rr(ctx,gx,gy,gw,gh,18);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the answer, with its evidence attached (the series' ag_evidence): what its
   hands did, as three cards. o.open fans them out; o.amber washes the two that say "full-time equivalents" amber; o.v the version
   ("fte": 2,160 students, as the agent first answered; "people": 2,880 people, this term) */
const FU_EV={fte:[{kick:"1 · Catalog",title:"Student load: “students” (full-time equivalents)",col:AG.blue},
                  {kick:"2 · Query",title:"Add up “students”, Faculty of Health, this term: 2,160",col:AG.orange},
                  {kick:"3 · Check",title:"The total matches the table ✓",col:AG.green}],
  people:[{kick:"1 · Catalog",title:"Census day: “students” (people, each counted once)",col:AG.blue},{kick:"2 · Query",title:"Count people, Faculty of Health, this term: 2,880",col:AG.orange},
          {kick:"3 · Check",title:"The faculty's own list: 2,880 ✓",col:AG.green}]};
function fu_answer(ctx,x,y,o){o=o||{};const v=o.v||"fte",w=o.w||440,words=v==="fte"?{kick:"Answer",title:"2,160 students",sub:"63 more than last year"}:{kick:"Answer",title:"2,880 people",sub:"Faculty of Health, this term"};
  let items=FU_EV[v];if(o.amber)items=items.map((it,i)=>i<2?Object.assign({},it,{col:mix(it.col,AG.amber,o.amber)}):it);
  return ag_evidence(ctx,x,y,w,words,items,{open:o.open||0,side:o.side||"below",ew:o.ew||330,a:o.a,k:o.k,edge:o.edge,edgeA:o.edgeA});}
// the check's verdict, as a pill: "Matches the source"
function fu_check(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;ag_pill(ctx,x,y,o.text||"Matches the source",{icon:"tick",col:o.col||AG.green,a});}
// a soft glow behind a card: the feeling an answer gives
// an ellipse round the card, fading to nothing 150 px past its edges on every side, so no edge of the glow shows
function fu_glow(ctx,b,a,col){if(a<=0.01)return;col=col||[248,210,140];ctx.save();ctx.globalAlpha*=a;
  const rx=b.w/2+150,ry=b.h/2+150,g=ctx.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,rgba(col,0.55));g.addColorStop(b.w/2/rx,rgba(col,0.4));g.addColorStop(1,rgba(col,0));
  ctx.save();ctx.translate(b.x+b.w/2,b.y+b.h/2);ctx.scale(1,ry/rx);ctx.fillStyle=g;ctx.fillRect(-rx,-rx,2*rx,2*rx);ctx.restore();
  ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=50;ctx.fillStyle=rgba(col,0.6);rr(ctx,b.x+6,b.y+6,b.w-12,b.h-12,22);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- Anil's desk in the Faculty of Health: he faces left, his screen in front of
   him with "Advisers next term" and the number he types in (o.typed, o.value); the advisers' row along the wall is fu_advisers */
const FU_ANIL={x:1530,neck:566,s:0.68,desk:[1180,842,700],screen:[1200,600,300,170]};
function fu_anilDesk(ctx,t,o){o=o||{};const A=FU_ANIL,[dx,dy,dw]=A.desk;ag_desk(ctx,dx,dy,dw,{});
  ag_person(ctx,"anil",A.x,A.neck,A.s,{t,flip:true,cut:dy-70,pose:o.pose||"hang",pose2:o.pose2,mix:o.mix,gaze:o.gaze||[3,0],nod:o.nod,smile:o.smile,talk:o.talk});
  const [sx,sy,sw,sh]=A.screen;ag_screen(ctx,sx,sy,sw,sh,{stand:22,draw:(c,x,y,w,h)=>{if(o.screen)return o.screen(c,x,y,w,h);fu_advisersScreen(c,x,y,w,h,o);}});
  fu_binders(ctx,dx+dw-150,dy-34,3,0.8,[[124,84,98],[170,160,140],[110,112,116]]);}
function fu_advisersScreen(c,x,y,w,h,o){c.fillStyle="rgba(46,52,60,0.06)";c.fillRect(x,y,w,40);
  ag_T(c,"Advisers next term",x+18,y+30,{w:700,size:28,col:AG.mut,a:0.9});
  const v=o.value||"",typed=o.typed==null?1:o.typed,s=v.slice(0,Math.round(v.length*typed));ag_T(c,s,x+18,y+112,{w:700,size:56});
  const cx=x+22+ag_tw(c,s,{w:700,size:56});if(o.caret&&((o.t||0)*1.6%1<0.6)){c.fillStyle=rgba(AG.ink,0.8);c.fillRect(cx,y+66,4,56);}
  if(o.unit)ag_T(c,o.unit,x+18,y+152,{w:600,size:28,col:AG.mut,a:o.unitA==null?1:o.unitA});}
// Anil's request, and Jun's reply, as speech cards with tails
function fu_say(ctx,x,y,w,text,o){o=o||{};return ag_textCard(ctx,x,y,w,{title:o.title?text:null,sub:o.title?null:text},{tail:o.tail,edge:o.edge,a:o.a,k:o.k});}

/* ---------------------------------------------------------------- the advisers: a card each, a plain figure (never a face), a phone and the
   list of the students they call; "240" under it. o.ring 0 to 1 rings its phone; o.list: {n: names, done: ticked, amber: left without a
   call, p: how far the ticks have run}; o.dashed: a place for an adviser the faculty needed and didn't plan */
const FU_ADV={w:100,h:258};
function fu_figure(c,x,y,s,col,half){const sh=cc=>{cc.arc(x,y-30*s,17*s,0,TAU);cc.moveTo(x-34*s,y+34*s);cc.bezierCurveTo(x-34*s,y-2*s,x-16*s,y-8*s,x,y-8*s);cc.bezierCurveTo(x+16*s,y-8*s,x+34*s,y-2*s,x+34*s,y+34*s);cc.closePath();};
  c.save();if(half){c.beginPath();c.rect(x-40*s,y-60*s,40*s,100*s);c.clip();}ag_soft(c,sh,col,ag_lt(col,0.35),x+10*s,y-34*s,40*s,null);c.restore();}
function fu_adviser(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=FU_ADV.w,h=FU_ADV.h;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  if(o.dashed){ctx.save();ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(AG.amber,0.85);ctx.lineWidth=2.6;rr(ctx,x,y,w,h,14);ctx.stroke();ctx.restore();
    fu_figure(ctx,x+w/2,y+70,1,mix(AG.amber,[240,236,228],0.7));ctx.restore();return;}
  ag_box(ctx,x,y,w,h,14,{});fu_figure(ctx,x+w/2,y+70,1,[150,142,134]);
  // the phone, a handset, rocking a little when it rings
  const r=o.ring||0;fu_handset(ctx,x+w-30,y+32,1,Math.sin(r*34)*0.16*Math.sin(Math.PI*clamp(r,0,1)));
  if(r>0){ctx.strokeStyle=rgba(AG.ink,0.45*Math.sin(Math.PI*clamp(r,0,1)));ctx.lineWidth=2.4;ctx.lineCap="round";for(const k of [1,2]){ctx.beginPath();ctx.arc(x+w-30,y+32,16+k*8,-1.25,-0.25);ctx.stroke();}}
  // the list: a line for each name, a tick for each call made, amber for those never called
  const L=o.list||{n:6,done:6},lh=16.5,ly=y+118;for(let i=0;i<L.n;i++){const yy=ly+i*lh,am=L.amber&&i>=L.n-L.amber,dn=i<L.done*(L.p==null?1:L.p);
    ctx.fillStyle=am?rgba(AG.amber,0.8):rgba(AG.mut,0.32);rr(ctx,x+16,yy,w-56,7,3.5);ctx.fill();
    if(dn&&!am)ag_tick(ctx,x+w-26,yy+3,13,rgba(AG.green,0.95),2.6);}
  if(o.label!==null)ag_T(ctx,o.label||"240",x+w/2,y+h+40,{w:700,size:30,align:"center",col:AG.mut});
  ctx.restore();}
// a phone's handset, its middle at (x, y), s its size, tipped by rot
function fu_handset(ctx,x,y,s,rot){ctx.save();ctx.translate(x,y);ctx.rotate(-0.6+(rot||0));ctx.scale(s,s);const col=[92,96,104];
  ag_soft(ctx,cc=>{cc.moveTo(-17,-6);cc.quadraticCurveTo(0,-15,17,-6);cc.lineTo(17,-1);cc.quadraticCurveTo(0,-9,-17,-1);cc.closePath();ag_rect(cc,-24,-8,12,18,5);ag_rect(cc,12,-8,12,18,5);},
    col,ag_lt(col,0.45),6,-10,30,null);ctx.restore();}
// a row of n advisers from (x, y), gap apart; each gets o(i) for its own options
function fu_advisers(ctx,x,y,n,gap,each){for(let i=0;i<n;i++)fu_adviser(ctx,x+i*(FU_ADV.w+gap),y,each?each(i):{});}

/* ---------------------------------------------------------------- students as plain shapes, head and shoulders in one wash, never a face or a
   name: whole for full-time, half for half-time; fu_students draws a block of them, cols x rows, and closes each pair of halves into one
   (o.close 0 to 1: the right half slides over to meet the left) */
const FU_STU=[150,140,132];
function fu_student(ctx,x,y,s,half,a){if(a<=0.01)return;withA(ctx,a,()=>fu_figure(ctx,x,y,s,FU_STU,half));}
function fu_students(ctx,x,y,cols,rows,o){o=o||{};const s=o.s||0.62,dx=o.dx||52,dy=o.dy||64,a=o.a==null?1:o.a,p=o.p==null?1:o.p,cl=o.close||0;if(a<=0)return;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const k=j*cols+i,ap=clamp(p*cols*rows-k,0,1)*a;if(ap<=0)continue;const cx=x+i*dx,cy=y+j*dy;
    if(!o.half){fu_student(ctx,cx,cy,s,false,ap);continue;}
    // half-time: each pair (columns 0-1, 2-3, ...) closes into one whole shape between them
    const pr=i%2,mid=x+(i-pr)*dx+dx/2,u=ag_sine(cl);
    if(pr===0){ctx.save();ctx.translate(lerp(cx,mid,u),cy);ctx.translate(-cx,-cy);fu_student(ctx,cx,cy,s,true,ap);ctx.restore();}
    else{ctx.save();ctx.translate(lerp(cx,mid,u),cy);ctx.scale(-1,1);ctx.translate(-cx,-cy);fu_student(ctx,cx,cy,s,true,ap);ctx.restore();}}}

/* ---------------------------------------------------------------- the table the agent read: "Student load", reported to the government, its
   column "students", and, small under it, what the column counts (o.note 0 to 1) */
function fu_table(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,18,{edge:o.edge,edgeA:o.edgeA});
  ag_T(ctx,"Student load",x+30,y+54,{w:700,size:36});ag_T(ctx,"reported to the government",x+30,y+94,{w:500,size:28,col:AG.mut});
  ctx.fillStyle="rgba(60,50,40,0.12)";ctx.fillRect(x+24,y+118,w-48,1.5);
  const cx=x+(o.colX||w*0.5);ctx.fillStyle=rgba(AG.blue,0.07+0.08*(o.colLit||0));rr(ctx,cx-120,y+128,240,h-148,12);ctx.fill();
  ag_T(ctx,"students",cx,y+168,{w:700,size:32,align:"center",col:AG.blue});
  if(o.note)ag_T(ctx,"full-time equivalents",cx,y+206,{w:600,size:28,align:"center",col:o.noteCol||AG.mut,a:o.note});
  if(o.alt)ag_T(ctx,o.alt,cx,y+206,{w:600,size:28,align:"center",col:AG.blue,a:o.altA==null?1:o.altA});
  ctx.restore();}

/* ---------------------------------------------------------------- the zip, drawn large: two tapes of teeth meeting under a slider at sl (0 at
   the top, 1 at the bottom of its run); open 0 to 1 parts the teeth above the slider */
function fu_zip(ctx,x0,x1,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const sl=lerp(x0+120,x1-120,o.sl==null?0.12:o.sl),op=o.open||0,tw=74;
  // the tapes: matte fabric, oak-pale, with a soft shadow
  for(const s of [-1,1]){const yy=y+s*(tw/2+6);ctx.save();ctx.translate(0,0);
    ag_soft(ctx,cc=>{cc.moveTo(x0,yy-tw/2);cc.lineTo(x1,yy-tw/2);cc.lineTo(x1,yy+tw/2);cc.lineTo(x0,yy+tw/2);cc.closePath();},[206,198,186],[240,236,226],x1-200,yy-20,600,"rgba(60,50,40,0.25)",12);ctx.restore();}
  // the teeth: interlocked to the right of the slider, parting to its left as it opens
  for(let x=x0+16;x<x1-10;x+=18){const left=x<sl,gap=left?op*Math.min(1,(sl-x)/260)*44:0,up=(Math.round((x-x0)/18)%2)===0;
    const ty=y+(up?-1:1)*(4+gap)-(up?14:-2);ctx.fillStyle="#8D8A84";rr(ctx,x-6,ty-6+(up?0:-4),12,18,3);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.4)";ctx.fillRect(x-4,ty-4+(up?0:-4),8,2);}
  // the slider and its pull
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.3)";ctx.shadowBlur=14;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=8;
  ag_soft(ctx,cc=>{cc.moveTo(sl-56,y-34);cc.lineTo(sl+40,y-24);cc.lineTo(sl+40,y+24);cc.lineTo(sl-56,y+34);cc.closePath();},[160,158,154],[236,234,230],sl,y-20,80,"rgba(40,40,40,0.35)",8);ctx.restore();
  ag_soft(ctx,cc=>{ag_rect(cc,sl-6,y+30,28,92,12);},[150,148,144],[230,228,224],sl+8,y+50,50,"rgba(40,40,40,0.35)",6);
  ctx.restore();}
// a scale of seven, "1" to "7": lit dots filled (n, a whole number or between two), the rest open; o.col, o.a
function fu_scale(ctx,cx,y,lit,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const gap=o.gap||104,r=o.r||24,col=o.col||[74,80,92];ctx.save();ctx.globalAlpha*=a;
  if(o.card!==false){const hw=3*gap+r+40;ag_box(ctx,cx-hw,y-r-28,hw*2,r*2+104,22,{});}
  for(let i=0;i<7;i++){const x=cx+(i-3)*gap,f=clamp(lit-i,0,1);ctx.fillStyle="rgba(250,249,246,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=3;ctx.stroke();if(f>0){ctx.fillStyle=rgba(col,0.92);ctx.beginPath();ctx.arc(x,y,r*0.74*ag_eo(f),0,TAU);ctx.fill();}
    ag_T(ctx,String(i+1),x,y+r+42,{w:700,size:30,align:"center",col:AG.mut});}ctx.restore();}

/* ---------------------------------------------------------------- the 2025 study: a gauge, a bar that fills from the bottom; label under it */
function fu_gauge(ctx,x,y,h,v,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const w=46;
  ag_box(ctx,x-w/2-8,y-8,w+16,h+16,14,{});ctx.fillStyle="rgba(60,50,40,0.08)";rr(ctx,x-w/2,y,w,h,10);ctx.fill();
  const f=clamp(v,0,1);ctx.fillStyle=rgba(o.col||AG.mut,0.85);rr(ctx,x-w/2,y+h*(1-f),w,h*f,10);ctx.fill();
  ag_T(ctx,label,x,y+h+56,{w:700,size:28,align:"center",col:AG.mut});ctx.restore();}

/* ---------------------------------------------------------------- the calendar on the wall: a month a row, a green tick on each month the
   agent was right (o.ticks), the months turning (o.turn) */
const FU_MONTHS=["Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"];
function fu_calendar(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||430,n=FU_MONTHS.length,cw=(w-48)/5,h=64+2*92;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,h,16,{});ctx.fillStyle="rgba(60,50,40,0.07)";ctx.fillRect(x+12,y+12,w-24,30);for(const k of [0.3,0.7]){ctx.fillStyle="#7A7670";ctx.beginPath();ctx.arc(x+w*k,y+8,6,0,TAU);ctx.fill();}
  for(let i=0;i<n;i++){const cx=x+24+(i%5)*cw+cw/2,cy=y+70+Math.floor(i/5)*92,on=clamp((o.ticks||0)-i,0,1);
    ag_T(ctx,FU_MONTHS[i],cx,cy+12,{w:600,size:28,align:"center",col:AG.mut,a:0.5+0.5*clamp((o.turn==null?n:o.turn)-i,0,1)});
    if(on>0){ctx.save();ctx.globalAlpha*=on;ag_tick(ctx,cx,cy+48,26*ag_eo(on),rgba(AG.green,1),4);ctx.restore();}}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the evidence, in a folder with a paperclip, closed on the corner of Jun's
   desk, a fine line of dust along its top edge (o.dust 0 to 1); o.open lifts its cover */
function fu_folder(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=o.w||250,h=o.h||64;ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2+AG.sdx,y+h+4,w*0.55,10,0.25);
  const col=[214,196,160];ag_soft(ctx,cc=>{cc.moveTo(x,y+12);cc.lineTo(x+w*0.36,y+12);cc.lineTo(x+w*0.4,y);cc.lineTo(x+w*0.62,y);cc.lineTo(x+w*0.66,y+12);cc.lineTo(x+w,y+12);cc.lineTo(x+w,y+h);cc.lineTo(x,y+h);cc.closePath();},col,ag_lt(col,0.4),x+w*0.7,y+10,w*0.6,"rgba(80,60,30,0.3)",8);
  const op=o.open||0;if(op>0){ctx.save();ctx.translate(x,y+h);ctx.transform(1,0,-0.4*op,1-0.9*op,0,0);ag_soft(ctx,cc=>ag_rect(cc,0,-h+12,w,h-12,4),ag_lt(col,0.1),ag_lt(col,0.5),w*0.6,-h,w*0.6,"rgba(80,60,30,0.3)",6);ctx.restore();}
  ag_T(ctx,"Evidence",x+22,y+h-16,{w:700,size:28,col:[110,92,62],a:1-op});
  ag_clip(ctx,x+w-46,y-14,46,"#5E5A55",3.4);
  const d=o.dust||0;if(d>0){const R=ag_rnd(5);ctx.fillStyle=rgba(FU.dust,0.55*d);for(let i=0;i<70;i++){const u=R();ctx.beginPath();ctx.arc(x+6+u*(w-12),y+11+(u>0.36&&u<0.66?-11:0)+R()*3,0.9+R()*1.4,0,TAU);ctx.fill();}}
  ctx.restore();}

/* ---------------------------------------------------------------- the team's log: a row for each doubt, with its owner, until it's answered */
function fu_log(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const h=206;ag_box(ctx,x,y,w,h,18,{});
  ag_T(ctx,"TEAM LOG",x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});ctx.fillStyle="rgba(60,50,40,0.12)";ctx.fillRect(x+24,y+74,w-48,1.5);
  const r=o.row||0;if(r>0)withA(ctx,r,()=>{ag_T(ctx,"Advisers' lists look long",x+28,y+120,{w:700,size:32});
    ag_T(ctx,"owner: Jun",x+28,y+174,{w:600,size:28,col:AG.mut});
    const ans=o.answered||0;if(ans>0)ag_pill(ctx,x+w-120,y+164,"answered",{icon:"tick",col:AG.green,a:ans,size:28});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the faculty's own list of students: something the agent didn't make */
function fu_facList(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=o.w||330,h=o.h||236;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,18,{});
  ag_T(ctx,"The faculty's own list",x+26,y+50,{w:700,size:30});const nl=o.lines==null?4:o.lines;for(let i=0;i<nl;i++){ctx.fillStyle=rgba(AG.mut,0.3);ctx.fillRect(x+28,y+84+i*24,w*(0.5+0.12*(i%3)),8);}
  ag_T(ctx,"2,880 people",x+26,y+h-30,{w:700,size:36});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a plain blue "=" between two things that agree, by a plain rule */
function fu_equals(ctx,x,y,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(AG.blue,0.95);const w=46*ag_eo(a);rr(ctx,x-w/2,y-16,w,10,5);ctx.fill();rr(ctx,x-w/2,y+6,w,10,5);ctx.fill();ctx.restore();}
// initials in ink, written on (p 0 to 1): a person's decision
function fu_initials(ctx,x,y,p,o){o=o||{};if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(o.col||[36,44,70],0.92);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.lineJoin="round";
  // "JP", as one quick hand: the J's hook, then the P's stem and bowl
  const pts=[[0,-30],[2,8],[-6,22],[-20,16],null,[22,24],[24,-30],[46,-28],[52,-12],[40,-2],[24,-4]],n=pts.length,k=p*(n-1);ctx.beginPath();let pen=false;
  for(let i=0;i<n;i++){const q=pts[i];if(!q){pen=false;continue;}if(i>k+1)break;const f=clamp(k-i+1,0,1),pr=pts[i-1];const qx=x+q[0]*(o.s||1),qy=y+q[1]*(o.s||1);
    if(!pen||!pr){ctx.moveTo(qx,qy);pen=true;}else{const px=x+pr[0]*(o.s||1),py=y+pr[1]*(o.s||1);ctx.lineTo(lerp(px,qx,f),lerp(py,qy,f));}}ctx.stroke();ctx.restore();}

// a number card: the number, and a tag beside it for what it counts (blank until filled)
function fu_numberCard(ctx,x,y,n,tag,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+170,y+70,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,340,140,18,{});ag_T(ctx,n,x+30,y+92,{w:800,size:56});
  const f=o.fill||0,tx=x+196,ty=y+46;ctx.save();ctx.setLineDash(f>0.5?[]:[7,6]);ctx.strokeStyle=f>0.5?rgba(AG.blue,0.9):"rgba(86,92,100,0.55)";ctx.lineWidth=2.2;rr(ctx,tx,ty,124,48,10);ctx.stroke();ctx.restore();
  if(tag)ag_T(ctx,tag,tx+62,ty+34,{w:700,size:28,align:"center",col:AG.blue,a:ag_in(f,0.5,0.5)});ctx.restore();}
// a screen's lines, as decoration: what's on it isn't read
function fu_screenLines(c,x,y,w,h,seed){const R=ag_rnd(11+seed);for(let i=0;i<5;i++){c.fillStyle="rgba(60,66,76,0.18)";c.fillRect(x+16,y+18+i*24,(w-40)*(0.4+0.5*R()),8);}}

/* ---------------------------------------------------------------- the 2025 study: an answer card of n lines (decoration: what it says
   isn't read), its length its kick ("short", "long"); a bar with its label at the left, filled to v */
function fu_studyCard(ctx,x,y,w,n,kick,o){o=o||{};const a=o.a==null?1:o.a,h=86+(o.shown==null?n:Math.max(1,o.shown))*30;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,20,{});ag_T(ctx,String(kick).toUpperCase(),x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});
  const R=ag_rnd(n*7+3),shown=o.shown==null?n:o.shown;for(let i=0;i<n;i++){const u=clamp(shown-i,0,1);if(u<=0)break;ctx.fillStyle=rgba(AG.mut,0.3);rr(ctx,x+28,y+78+i*30,(w-56)*(i===n-1?0.55:0.75+0.25*R())*ag_eo(u),10,5);ctx.fill();}
  ctx.restore();return{x,y,w,h};}
function fu_bar(ctx,x,y,label,v,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const lw=o.lw||170,bw=o.bw||250,col=o.col||AG.mut;ctx.save();ctx.globalAlpha*=a;
  ag_T(ctx,label,x,y+10,{w:600,size:28,col:AG.mut});ctx.fillStyle="rgba(60,50,40,0.1)";rr(ctx,x+lw,y-12,bw,24,12);ctx.fill();
  ctx.fillStyle=rgba(col,0.88);rr(ctx,x+lw,y-12,Math.max(24,bw*clamp(v,0,1)),24,12);ctx.fill();
  if(o.hi>0){ctx.strokeStyle=rgba(col,0.6*o.hi);ctx.lineWidth=3;rr(ctx,x+lw-6,y-18,bw+12,36,18);ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- the zip's test: a pencil that hovers and doesn't write; three numbered
   blank lines; the everyday things of the 2002 study, small and matte (a lock and its key, a cistern with its lever, piano keys) */
function fu_pencilIcon(ctx,x,y,ang,s){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);ag_floorShadow(ctx,-6,26,90,8,0.16);
  ag_soft(ctx,cc=>{cc.moveTo(0,0);cc.lineTo(26,-9);cc.lineTo(150,-9);cc.lineTo(150,9);cc.lineTo(26,9);cc.closePath();},AG_OAK.base,AG_OAK.hi,90,-6,90,"rgba(80,60,30,0.3)",6);
  ctx.fillStyle="#4A4A4E";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(9,-3.2);ctx.lineTo(9,3.2);ctx.closePath();ctx.fill();
  ctx.fillStyle="#B9B4AC";ctx.fillRect(150,-9,14,18);ctx.fillStyle="#D9C9C2";rr(ctx,163,-9,20,18,6);ctx.fill();ctx.restore();}
function fu_blankLines(ctx,x,y,w,a,o){o=o||{};if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;for(let i=0;i<3;i++){const yy=y+i*96,u=clamp((o.p==null?1:o.p)*3-i,0,1);if(u<=0)break;
  ag_T(ctx,(i+1)+".",x,yy,{w:700,size:36,col:AG.mut,a:u});ctx.strokeStyle=rgba(AG.mut,0.45);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+56,yy+6);ctx.lineTo(x+56+(w-56)*ag_eo(u),yy+6);ctx.stroke();}ctx.restore();}
function fu_lockKey(ctx,x,y,s,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);const m=[150,150,154];ag_floorShadow(ctx,-8,62,70,12,0.2);
  ag_soft(ctx,cc=>{cc.arc(-18,0,44,0,TAU);},m,[236,236,238],-34,-20,60,"rgba(40,40,50,0.35)",10);ctx.fillStyle="#3E3F44";ctx.beginPath();ctx.arc(-18,-8,9,0,TAU);ctx.fill();ctx.fillRect(-22,-4,8,26);
  // the key, lying beside it
  ctx.save();ctx.translate(46,26);ctx.rotate(-0.5);ag_soft(ctx,cc=>{cc.arc(0,0,16,0,TAU);cc.moveTo(14,-5);cc.lineTo(62,-5);cc.lineTo(62,0);cc.lineTo(56,0);cc.lineTo(56,6);cc.lineTo(48,6);cc.lineTo(48,0);cc.lineTo(40,0);cc.lineTo(40,7);cc.lineTo(32,7);cc.lineTo(32,5);cc.lineTo(14,5);cc.closePath();},
    [196,170,110],[246,232,196],-4,-6,40,"rgba(80,60,20,0.3)",6);ctx.fillStyle="rgba(250,248,244,1)";ctx.beginPath();ctx.arc(-3,0,5,0,TAU);ctx.fill();ctx.restore();ctx.restore();}
function fu_cistern(ctx,x,y,s,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ag_floorShadow(ctx,-8,64,76,12,0.2);
  ag_soft(ctx,cc=>ag_rect(cc,-62,-50,124,104,16),[238,236,232],[255,255,255],-20,-30,90,"rgba(60,60,70,0.28)",12);
  ag_soft(ctx,cc=>ag_rect(cc,-70,-62,140,18,9),[226,224,220],[255,255,255],-10,-60,80,"rgba(60,60,70,0.22)",6);
  ctx.fillStyle="#A7A9AE";rr(ctx,-58,-26,30,10,5);ctx.fill();ctx.fillStyle="#8E9095";ctx.beginPath();ctx.arc(-58,-21,8,0,TAU);ctx.fill();ctx.restore();}
function fu_pianoKeys(ctx,x,y,s,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ag_floorShadow(ctx,-6,66,80,12,0.2);
  for(const k of [-1,0,1]){ag_soft(ctx,cc=>ag_rect(cc,k*44-21,-60,42,120,6),[246,244,240],[255,255,255],k*44,-50,50,"rgba(60,60,70,0.25)",6);}
  for(const k of [-0.5,0.5]){ag_soft(ctx,cc=>ag_rect(cc,k*44-13,-60,26,74,4),[48,48,52],[120,120,128],k*44-4,-56,30,null);}ctx.restore();}
// a question card: a pill with a question mark in a circle
function fu_question(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const size=30,w=ag_tw(ctx,text,{w:700,size})+104,h=size+30,bx=x-w/2,by=y-h/2;
  ctx.save();if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,o.k));ag_box(ctx,bx,by,w,h,h/2,{a});withA(ctx,a,()=>{ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(bx+40,y,15,0,TAU);ctx.stroke();
    ag_T(ctx,"?",bx+40,y+10,{w:800,size:28,align:"center",col:AG.mut});ag_T(ctx,text,bx+72,y+size*0.36,{w:700,size});});ctx.restore();}

/* ---------------------------------------------------------------- a chat message: who sent it, in grey capitals, and what it says; o.tick
   adds a green tick after the words (Jun quoting the agent's check) */
function fu_chat(ctx,x,y,w,who,text,o){o=o||{};const a=o.a==null?1:o.a,lines=ag_wrap(ctx,text,w-56-(o.tick?40:0),{w:600,size:30}),h=28+34+lines.length*40+20;if(a<=0.01)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,String(who).toUpperCase(),x+28,y+46,{w:700,size:28,ls:3,col:AG.kick});
  lines.forEach((l,i)=>ag_T(ctx,l,x+28,y+90+i*40,{w:600,size:30}));
  if(o.tick){const l=lines[lines.length-1];ag_tick(ctx,x+28+ag_tw(ctx,l,{w:600,size:30})+26,y+90+(lines.length-1)*40-10,24,rgba(AG.green,1),4);}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the 2010 review: people of today at a desk with an automated aid (a small
   screen with a green tick, its ticks stacking up behind it); tasks that slide onto the desk: a phone and a stack of papers */
const FU_AID_PEOPLE={
  p1:{name:"A person at a desk",key:"fu_p1",skin:[222,182,150],hair:{style:"long",c:[96,64,46]},top:{kind:"sweater",c:[150,162,172]},breath:0.3},
  p2:{name:"An expert at a desk",key:"fu_p2",skin:[124,86,64],hair:{style:"shaved",c:[30,24,22]},glasses:[40,40,46],top:{kind:"overshirt",c:[96,112,100],inner:[226,228,222]},lanyard:true,breath:0.27}
};
function fu_aid(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;const w=150,h=96,n=o.n||0;
  // the ticks it has shown, stacked behind it
  for(let i=0;i<Math.ceil(n);i++){const u=clamp(n-i,0,1),yy=y-18-i*22;ctx.save();ctx.globalAlpha*=u;ag_box(ctx,x+20+(i%2)*6,yy-28,w-40,40,10,{});ag_tick(ctx,x+w/2+(i%2)*6,yy-8,20,rgba(AG.green,0.95),3.4);ctx.restore();}
  ag_screen(ctx,x,y,w,h,{stand:20,draw:(c,sx,sy,sw,sh)=>{ag_tick(c,sx+sw/2,sy+sh/2,52*(o.tick==null?1:o.tick),rgba(AG.green,1),7);}});ctx.restore();}
function fu_mobile(ctx,x,y,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+AG.sdx,y+16,52,7,0.25);ctx.fillStyle="#2E3036";rr(ctx,x-46,y-14,92,28,9);ctx.fill();
  ctx.fillStyle="rgba(150,170,190,0.35)";rr(ctx,x-40,y-10,80,18,6);ctx.fill();ctx.restore();}
function fu_papers(ctx,x,y,n,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x+AG.sdx,y+14,84,8,0.22);
  for(let i=0;i<n;i++){const yy=y-i*7,dx=(i%2?4:-3);ctx.fillStyle=i%2?"#F6F4EF":"#FBFAF7";ctx.beginPath();ctx.moveTo(x-78+dx,yy+8);ctx.lineTo(x+70+dx,yy+8);ctx.lineTo(x+60+dx,yy-10);ctx.lineTo(x-66+dx,yy-10);ctx.closePath();ctx.fill();
    ctx.strokeStyle="rgba(60,50,40,0.18)";ctx.lineWidth=1.2;ctx.stroke();}ctx.restore();}
// a tag hanging on a thread: "training"
function fu_tag(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sw=o.sway||0;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(sw);
  ctx.strokeStyle="rgba(90,84,76,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-(o.len||120));ctx.lineTo(0,-6);ctx.stroke();
  const w=ag_tw(ctx,text,{w:700,size:30})+64;ag_box(ctx,-w/2,0,w,58,14,{});ctx.fillStyle="rgba(90,84,76,0.7)";ctx.beginPath();ctx.arc(0,12,4,0,TAU);ctx.fill();
  ag_T(ctx,text,0,42,{w:700,size:30,align:"center"});ctx.restore();}
// a bracket under a row, and its words
function fu_bracket(ctx,x0,x1,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||AG.mut;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=2.5;ctx.lineCap="round";
  const p=ag_eo(o.p==null?1:o.p),m=(x0+x1)/2,hw=(x1-x0)/2*p;ctx.beginPath();ctx.moveTo(m-hw,y-12);ctx.lineTo(m-hw,y);ctx.lineTo(m+hw,y);ctx.lineTo(m+hw,y-12);ctx.stroke();
  ag_T(ctx,text,m,y+44,{w:700,size:30,align:"center",col,a:clamp(p*1.4-0.4,0,1)});ctx.restore();}

/* ---------------------------------------------------------------- one word, two meanings: the counts side by side, the gap between them amber;
   student load drawn large, its students as plain shapes, the half-time pairs closing into one */
function fu_gapBars(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const L=640,bx=x+190;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x-40,y-64,L+400,250,22,{});const p1=ag_eo(o.p1||0),p2=ag_eo(o.p2||0),slate=[74,80,92];
  ag_T(ctx,"2,880",x,y+14,{w:800,size:40,a:clamp((o.p1||0)*3,0,1)});ag_T(ctx,"the lists",x,y+48,{w:500,size:28,col:AG.mut,a:clamp((o.p1||0)*3,0,1)});
  ctx.fillStyle=rgba(slate,0.85);rr(ctx,bx,y-16,Math.max(1,L*p1),32,12);ctx.fill();
  ag_T(ctx,"2,160",x,y+114,{w:800,size:40,a:clamp((o.p2||0)*3,0,1)});ag_T(ctx,"the agent",x,y+148,{w:500,size:28,col:AG.mut,a:clamp((o.p2||0)*3,0,1)});
  ctx.fillStyle=rgba(slate,0.45);rr(ctx,bx,y+84,Math.max(1,L*0.75*p2),32,12);ctx.fill();
  const g=o.gap||0;if(g>0){ctx.save();ctx.globalAlpha*=g;ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(AG.amber,0.95);ctx.lineWidth=2.6;rr(ctx,bx+L*0.75+4,y+84,L*0.25-4,32,12);ctx.stroke();ctx.restore();
    ag_T(ctx,"720",bx+L+24,y+112,{w:800,size:40,col:AG.amber,a:g});}
  ctx.restore();}
function fu_loadTable(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,22,{});
  ag_T(ctx,"Student load",x+44,y+66,{w:800,size:40});ag_T(ctx,"reported to the government",x+44,y+108,{w:500,size:30,col:AG.mut});
  ctx.fillStyle="rgba(60,50,40,0.12)";ctx.fillRect(x+30,y+136,w-60,1.5);
  const cx=x+w/2,nt=o.note||0;ctx.fillStyle=rgba(AG.blue,0.08);rr(ctx,cx-170,y+150,340,lerp(70,112,nt),14);ctx.fill();
  ag_T(ctx,"students",cx,y+198,{w:700,size:34,align:"center",col:AG.blue});if(nt>0)ag_T(ctx,"full-time equivalents",cx,y+240,{w:600,size:28,align:"center",col:AG.amber,a:nt});
  // the students: full-time on the left, whole; half-time on the right, as halves that close into one
  const sa=o.students||0,gy=y+330;if(sa>0){fu_students(ctx,x+150,gy,8,4,{s:0.62,dx:56,dy:66,a:1,p:sa});fu_students(ctx,x+w-150-7*56,gy,8,4,{s:0.62,dx:56,dy:66,a:1,p:sa,half:true,close:o.close||0});}
  const la=o.labels||0;if(la>0){ag_T(ctx,"1,440 full-time",x+150+3.5*56,gy+300,{w:700,size:32,align:"center",a:la});
    const cl=ag_sine(o.close||0),rx=x+w-150-3.5*56;ag_T(ctx,"1,440 half-time",rx,gy+300,{w:700,size:32,align:"center",a:la*(1-cl)});ag_T(ctx,"720",rx,gy+300,{w:800,size:36,align:"center",a:la*cl});}
  const sm=o.sum||0;if(sm>0)ag_T(ctx,"1,440 + 720 = 2,160",cx,gy+360,{w:800,size:40,align:"center",a:sm});
  ctx.restore();}
// two people of today at a small table, for "they say it back, or ask"
const FU_TALK={
  a:{name:"A person asking",key:"fu_tA",skin:[198,146,112],hair:{style:"coily",c:[44,32,28]},top:{kind:"cardigan",c:[176,124,100],inner:[238,234,226]},breath:0.29},
  b:{name:"A person answering",key:"fu_tB",skin:[236,202,178],hair:{style:"bun",c:[148,108,72]},earrings:[220,206,176],top:{kind:"blazer",c:[72,88,108],inner:[232,236,240]},breath:0.32}
};
// an amber wash over words on an evidence card fanned out to the side (ag_evidence, side "right"): e is the card's place from the
// answer's result, i its number, title its words, phrase the words to wash, ew its width; a 0 to 1
function fu_evHighlight(ctx,e,i,title,phrase,ew,a){if(a<=0.01||!e)return;const lines=ag_wrap(ctx,title,ew-48,{w:600,size:28}).slice(0,3),want=new Set(phrase.split(" "));
  ctx.save();ctx.translate(e.to.x+e.to.w/2,e.to.y+e.to.h/2);ctx.rotate((i%2?1:-1)*0.02);ctx.translate(-e.to.w/2,-e.to.h/2);ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([244,206,140],0.9*a);
  lines.forEach((l,li)=>{const ws=l.split(" ");let j0=-1,j1=-1;ws.forEach((w,j)=>{if(want.has(w)){if(j0<0)j0=j;j1=j;}});if(j0<0)return;
    const pre=ws.slice(0,j0).join(" "),mid=ws.slice(j0,j1+1).join(" "),x0=24+(pre?ag_tw(ctx,pre+" ",{w:600,size:28}):0);rr(ctx,x0-5,62+li*36,ag_tw(ctx,mid,{w:600,size:28})+10,34,6);ctx.fill();});
  ctx.restore();}

/* ---------------------------------------------------------------- knowing, not feeling: the catalog's counts with their units; the agent,
   small, waiting with its question; a sign that two counts differ; the record of what its hands did, small; the answer a person
   decides on, the agent's tick grey beside it */
function fu_unitCard(ctx,x,y,w,name,unit,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+52,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,104,18,{});ag_T(ctx,name,x+26,y+44,{w:700,size:30});ag_T(ctx,"students",x+26,y+82,{w:700,size:28,col:AG.blue});
  ag_T(ctx,unit,x+26+ag_tw(ctx,"students ",{w:700,size:28})+10,y+82,{w:600,size:28,col:AG.mut,a:o.unitA==null?1:o.unitA});ctx.restore();}
function fu_miniAgent(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ag_ring(ctx,0,0,100,{p:1,from:-120,pulse:o.pulse==null?null:{deg:o.pulse,a:1}});ag_model(ctx,0,0,46,{t:o.t||0,core:0.8,think:o.think||0.3,label:null});ctx.restore();}
function fu_notEquals(ctx,x,y,a){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(AG.amber,0.95);rr(ctx,x-23,y-16,46,10,5);ctx.fill();rr(ctx,x-23,y+6,46,10,5);ctx.fill();
  ctx.strokeStyle=rgba(AG.amber,0.95);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+12,y-30);ctx.lineTo(x-12,y+30);ctx.stroke();ctx.restore();}
function fu_recordMini(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;const h=212;ag_box(ctx,x,y,w,h,18,{});
  ag_T(ctx,"What its hands did",x+26,y+46,{w:700,size:30});
  for(let i=0;i<3;i++){const yy=y+82+i*40,am=i<2?(o.amber||0):0;if(am>0){ctx.fillStyle=rgba([244,206,140],0.7*am);rr(ctx,x+20,yy-4,w-40,32,8);ctx.fill();}
    ag_T(ctx,String(i+1),x+30,yy+22,{w:800,size:28,col:i<2&&am>0.5?AG.amber:AG.mut});ctx.fillStyle=rgba(AG.mut,0.32);rr(ctx,x+64,yy+8,(w-110)*(i===1?0.8:i===2?0.6:0.92),12,6);ctx.fill();}
  const f=o.finger;if(f!=null&&f>0&&f<1){const yy=y+82+f*2*40+12;ctx.fillStyle=rgba([74,80,92],0.9);ctx.beginPath();ctx.moveTo(x+w-22,yy);ctx.lineTo(x+w-4,yy-10);ctx.lineTo(x+w-4,yy+10);ctx.closePath();ctx.fill();}
  ctx.restore();return{x,y,w,h};}
function fu_decision(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+75,lerp(0.6,1,o.k));const h=o.h||150;ag_box(ctx,x,y,w,h,22,{});
  const title=o.title||"2,880 people";ag_T(ctx,"ANSWER",x+28,y+50,{w:700,size:28,ls:4,col:AG.violet});ag_T(ctx,title,x+28,y+108,{w:700,size:36});
  // the person's initials beside the answer: their decision. The agent's tick, top right, turns grey "for reference" once they have
  fu_initials(ctx,x+28+ag_tw(ctx,title,{w:700,size:36})+44,y+112,o.initials||0,{s:0.85});
  const g=o.grey||0,rw=ag_tw(ctx,"for reference",{w:600,size:28}),tx=x+w-28-rw-30;ag_tick(ctx,tx,y+40,34,rgba(mix(AG.green,[150,150,150],g),1),5);
  ag_T(ctx,"for reference",x+w-28,y+50,{w:600,size:28,align:"right",col:AG.mut,a:g});ctx.restore();return{x,y,w,h};}
// a change of Jun's team: its words, bold, on a card sized to them, centred at cx
function fu_changeCard(ctx,cx,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=ag_tw(ctx,text,{w:800,size:34})+64,h=74;ctx.save();if(o.k!=null)ag_about(ctx,cx,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,cx-w/2,y,w,h,20,{a,edge:AG.ink,edgeA:0.3});withA(ctx,a,()=>ag_T(ctx,text,cx,y+49,{w:800,size:34,align:"center"}));ctx.restore();}
// a count, small: a heading (o.kick: as a kick, violet), the number, its unit under it
function fu_countMini(ctx,x,y,w,head,n,unit,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+73,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,146,18,{});if(o.kick)ag_T(ctx,String(head).toUpperCase(),x+24,y+42,{w:700,size:28,ls:4,col:AG.violet});else ag_T(ctx,head,x+24,y+42,{w:700,size:28});
  ag_T(ctx,n,x+24,y+92,{w:800,size:40});ag_T(ctx,unit,x+24,y+128,{w:600,size:28,col:AG.mut});ctx.restore();}
// a quotation, large, on its card: its words, and who said them
function fu_quote(ctx,cx,cy,text,who,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=o.w||1100,lines=ag_wrap(ctx,text,w-140,{w:800,size:52}),h=96+lines.length*66+56;
  ctx.save();if(o.k!=null)ag_about(ctx,cx,cy,lerp(0.7,1,o.k));ag_box(ctx,cx-w/2,cy-h/2,w,h,26,{a});
  withA(ctx,a,()=>{lines.forEach((l,i)=>ag_T(ctx,l,cx,cy-h/2+100+i*66,{w:800,size:52,align:"center"}));ag_T(ctx,who,cx,cy+h/2-44,{w:600,size:30,align:"center",col:AG.mut});});ctx.restore();}
