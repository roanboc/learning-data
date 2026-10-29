/* ===== Who does what, end to end: the university =====
   The university's rooms as the series paints them (its rooms.js): the floor where the work is done, Planning's room, Mei's desk in the
   registrar's office, the registrar's desk, the data team's room, Yusuf's office; and what's on them: Clara's report, the emails that went
   round, the services page, the request and the cards each step writes, the chart of who's responsible, the glossary's product card, the
   week's list. Every name starts with ee_ or EE. */

/* ---------- moments, tags and the corner pill ---------- */
// small type, drawn on purpose as part of a picture, that the legibility check (tools/legible.py) leaves out: it reads PH_OFF, the name the
// From words to data tools give it
let PH_OFF=0;
// fn draws with each word fading as the frame comes to cut it, from 30 px inside the frame's edge to gone at it, so the frame never cuts
// a word, as the playbook asks (A capability, not a project's cp_fadeCut). blocks: [x0, y0, x1, y1] where ctx is now, each a card's lines;
// a word in one fades with the whole block, so a card never shows half its words
function ee_fadeCut(ctx,fn,blocks){const T0=T,cw=ctx.canvas.width,ch=ctx.canvas.height,r=30*cw/1920,M=ctx.getTransform(),
    Bk=(blocks||[]).map(([x0,y0,x1,y1])=>[M.a*x0+M.e,M.d*y0+M.f,M.a*x1+M.e,M.d*y1+M.f]);
  T=(c,s2,x,y,o)=>{o=o||{};const sz=o.size||24,w=tw(c,String(s2),sz,o.w,o.f),al=o.align||"left",x0=al==="center"?x-w/2:al==="right"?x-w:x,m=c.getTransform();
    let l=1e9,rt=-1e9,tp=1e9,bt=-1e9;for(const [px,py] of [[x0,y-0.75*sz],[x0+w,y-0.75*sz],[x0,y+0.2*sz],[x0+w,y+0.2*sz]]){const X=m.a*px+m.c*py+m.e,Y=m.b*px+m.d*py+m.f;
      l=Math.min(l,X);rt=Math.max(rt,X);tp=Math.min(tp,Y);bt=Math.max(bt,Y);}
    const mx=(l+rt)/2,my=(tp+bt)/2,b=Bk.find(([a,q,e,d])=>mx>=a-6&&mx<=e+6&&my>=q-6&&my<=d+6);if(b){l=Math.min(l,b[0]);tp=Math.min(tp,b[1]);rt=Math.max(rt,b[2]);bt=Math.max(bt,b[3]);}
    const a=clamp(Math.min(l/r,(cw-rt)/r,tp/r,(ch-bt)/r),0,1);if(a>=0.99)return T0(c,s2,x,y,o);if(a>0.01)withA(c,a,()=>T0(c,s2,x,y,o));};
  try{return fn();}finally{T=T0;}}
// the block a card's lines make, for ee_fadeCut: L centred on cx, the first on y, lh apart
function ee_block(ctx,L,cx,y,lh,sz,w){const m=Math.max(...L.map(l=>tw(ctx,l,sz,w)));return[cx-m/2,y-0.75*sz,cx+m/2,y+(L.length-1)*lh+0.2*sz];}
// made once per chapter, the first time it draws: its cues are known by then
const ee_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a chapter's shots, as the series' gv_shots, except that a shot marked cut comes in on a cut: two framings of one place at one moment,
// which a dissolve would lay over each other, a little apart, so the people and the cards in it showed twice
function ee_shots(ctx,S,t,end,shots){let i=0;for(let k=1;k<shots.length;k++)if(t>=shots[k].at)i=k;
  if(!shots[i].cut)return gv_shots(ctx,S,t,end,shots);gv_shot(ctx,S,t,shots[i],shots[i+1]?shots[i+1].at:end);return i;}
// a tag that springs in at t0 and goes at t1 (or stays)
function ee_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}
// a gold tag: governance's colour, for the word the story follows
const EE_GOLDTAG={wash:GV.gold,washA:0.55,col:GV.goldInk};
// the place and the time in the top corner, changing at the times given ([[t, words], ...]; null words: no pill), the old one fading as the
// new comes in
function ee_pill(ctx,t,mk,a){if(a<=0.01)return;let i=0;for(let k=1;k<mk.length;k++)if(t>=mk[k][0])i=k;const u=i>0?fin(t,mk[i][0],0.35):1;
  if(u<1&&mk[i-1][1])wc_year(ctx,56,72,mk[i-1][1],a*(1-u));if(mk[i][1])wc_year(ctx,56,72,mk[i][1],a*u);}
// a name card: the name, and the role under it
function ee_nameCard(ctx,cx,cy,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60),h=104,k=0.92+0.08*spring(clamp(a,0,1));
  ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);withA(ctx,clamp(a*2,0,1),()=>{wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:Math.round(cx)});
    wc_T(ctx,name,0,-h/2+44,{w:800,size:32,align:"center",col:WC_DARK});wc_T(ctx,role,0,-h/2+82,{w:600,size:28,align:"center",col:WC_MUTED});});ctx.restore();}
// a sheet of paper over the whole frame, for the shots drawn on paper (the ring, the year's list)
function ee_paper(x){x.fillStyle=rgba(WC_PAPER,1);x.fillRect(-W,-H,3*W,3*H);}

/* ---------- the floor where the work is done ---------- */
// the people at work behind the glass, as the series' first film drew them (o.out leaves someone out, o.pose changes what someone's
// doing; o.extra draws anyone else inside), then the glass, then the offices' names (a name the frame would cut fades out)
const EE_AT={clara:0,mei:1,yusuf:2,jun:3,sam:4},EE_WORK={clara:{pose:"reach"},mei:{pose:"hold",carry:heldNotebook},yusuf:{pose:"write",carry:heldNotebook},jun:{pose:"reach"},sam:{pose:"phone"}};
function ee_floor(x,tt,o){o=o||{};const F=GV_FL;Object.keys(EE_AT).forEach(id=>{const i=EE_AT[id];if((o.out||[]).includes(id))return;
    person(x,id,(o.x||{})[id]||F.spot(i),806,0.5,Object.assign({pose:"stand",t:tt,flip:i%2===1},EE_WORK[id],(o.pose||{})[id]||{}));});
  if(o.extra)o.extra(x);gv_floorGlass(x);const m=x.getTransform(),vl=-m.e/m.a,vr=(x.canvas.width-m.e)/m.a,a=o.names==null?1:o.names;
  F.rooms.forEach((r,i)=>{const cx=F.x(i)+F.w/2,hw=tw(x,r[1],30,800)/2+6;gv_floorName(x,i,a*clamp(Math.min(cx-hw-vl,vr-cx-hw)/30,0,1));});}

/* ---------- papers on a desk, from above (the place desk) ---------- */
// a paper on the desk, seen from above, at (x, y), its size, tipped; drawn through fn in its own coordinates (A capability, not a
// project's cp_onPaper)
function ee_onPaper(ctx,x,y,w,h,rot,fn,o){o=o||{};ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot||0);ctx.fillStyle="rgba(60,44,30,0.22)";ctx.fillRect(-w/2+10,-h/2+12,w,h);
  wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:o.seed||Math.round(x+y),wash:o.wash,washA:o.washA||0.2});ctx.translate(-w/2,-h/2);fn(ctx);ctx.restore();}

/* ---------- 2 · Clara's report, and how each faculty counts ---------- */
// Completions for Planning, on her desk: three faculties, each a row with its rate as a bar and a number (o.row(i), 0 to 1, brings row
// i in; o.rate(i) the rate shown, which moves when they count one way); beside each row, a note pinned on, saying when that faculty
// counts a completion (o.note(i); o.one, 0 to 1, or o.one(i), turns each note to the examiners' day); o.ring rings Health's row in amber, "9 points"
// (o.ringA, 0 to 1: the ring's strength, which fades as the gap goes)
const EE_RP={x:200,y:50,w:900,h:800,rows:[262,422,582],bx:250,bw:560,nx:1130,nw:660};
const EE_FAC=[["Faculty of Business",84,"counts at: the last mark in"],["Faculty of Science",83,"counts at: the examiners confirm the marks"],["Faculty of Health",75,"counts at: the award conferred"]];
function ee_report(ctx,o){o=o||{};const R=EE_RP,f=(fn,i,d)=>fn?fn(i):d,ra=o.ringA==null?1:clamp(o.ringA,0,1);
  ee_onPaper(ctx,R.x,R.y,R.w,R.h,-0.006,q=>{wc_T(q,"Completions for Planning",50,100,{w:800,size:44,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.5);q.fillRect(50,124,R.w-100,3);
    EE_FAC.forEach(([nm,r0],i)=>{const u=f(o.row,i,1);if(u<=0.01)return;const y=R.rows[i]-R.y,rate=f(o.rate,i,r0);withA(q,clamp(u*2,0,1),()=>{wc_T(q,nm,50,y-24,{w:700,size:34,col:WC_DARK});
      const bw=R.bw*rate/100*easeCam(clamp(u,0,1));q.fillStyle=rgba([226,230,236],1);q.fillRect(50,y+4,R.bw,34);q.fillStyle=rgba(mix([150,170,204],wc_lit(GV.amber,0.25),i===2&&(o.ring||0)>0.5?ra*clamp((80-rate)/4,0,1):0),1);q.fillRect(50,y+4,bw,34);
      wc_T(q,Math.round(rate)+"%",R.w-50,y+36,{w:800,size:44,align:"right",col:WC_DARK});});});
    const r=clamp(o.ring||0,0,1);if(r>0.01&&ra>0.01){const y=R.rows[2]-R.y;withA(q,ra,()=>wc_ring(q,R.w/2,y+6,R.w/2-14,74,r,{col:GV.amberInk,lw:5}));}},{seed:701});
  // the notes, pinned beside each row
  EE_FAC.forEach(([,,s],i)=>{const u=f(o.note,i,0);if(u<=0.01)return;const one=clamp(typeof o.one==="function"?o.one(i):o.one||0,0,1),cy=R.rows[i]+10,k=0.9+0.1*spring(clamp(u,0,1)),w=R.nw,h=74;
    ctx.save();ctx.translate(R.nx+w/2,cy);ctx.rotate([-0.012,0.01,-0.008][i]);ctx.scale(k,k);withA(ctx,clamp(u*2,0,1),()=>{ctx.fillStyle="rgba(60,44,30,0.2)";ctx.fillRect(-w/2+6,-h/2+8,w,h);
      wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",seed:711+i,wash:one>0.5?GV.gold:null,washA:0.3*one});gv_pin(ctx,-w/2+26,-h/2+14,GV.red,0.9);
      const txt=one>0.5?EE_FAC[1][2]:s;withA(ctx,one>0.01&&one<0.99?Math.abs(one-0.5)*2:1,()=>wc_T(ctx,txt,-w/2+48,10,{w:600,size:28,col:WC_INK}));});ctx.restore();});
  const r=clamp(o.ring||0,0,1);if(r>0.5&&ra>0.01){const a=clamp((r-0.5)*2.5,0,1)*ra,k=0.9+0.1*spring(clamp((r-0.5)*2.5,0,1));ctx.save();ctx.translate(1300,R.rows[2]-72);ctx.scale(k,k);
    withA(ctx,a,()=>wc_tag(ctx,0,0,"9 points",{align:"center",size:32,wash:GV.amber,washA:0.5,col:GV.amberInk}));ctx.restore();}}
// one learner's year, on a strip of paper laid across the desk: a line from December to March, and a dot for each faculty's moment (the
// last mark in, the marks confirmed a week later, the award conferred three months after), each named as its dot lands (o.dot(i));
// u slides the strip in from below
const EE_YR={x:150,y:690,w:1620,h:180,d0:420,pd:11.7,line:784};
const EE_YRD=[[1,"last mark","right"],[8,"marks confirmed","left"],[104,"award conferred","right"]];
function ee_yearStrip(ctx,u,o){o=o||{};if(u<=0.01)return;const Y=EE_YR,e=easeCam(clamp(u,0,1));ctx.save();ctx.translate(0,(1-e)*300);ctx.rotate(-0.004);
  ctx.fillStyle="rgba(60,44,30,0.22)";ctx.fillRect(Y.x+8,Y.y+10,Y.w,Y.h);wc_panel(ctx,Y.x,Y.y,Y.w,Y.h,{kind:"card",seed:721});
  ctx.strokeStyle=rgba(WC_PENCIL,0.75);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(Y.x+60,Y.line);ctx.lineTo(Y.x+Y.w-60,Y.line);ctx.stroke();
  [["Dec",0],["Jan",31],["Feb",62],["Mar",90]].forEach(([m,d])=>{const x=Y.d0+d*Y.pd;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,Y.line-12);ctx.lineTo(x,Y.line+12);ctx.stroke();
    wc_T(ctx,m,x+8,Y.line+56,{w:600,size:28,col:WC_MUTED});});
  EE_YRD.forEach(([d,s,al],i)=>{const p=o.dot?o.dot(i):1;if(p<=0.01)return;const x=Y.d0+d*Y.pd,k=0.7+0.3*spring(clamp(p,0,1));ctx.save();ctx.translate(x,Y.line);ctx.scale(k,k);
    ctx.fillStyle=rgba(i===2&&(o.amber||0)>0.5?GV.amberInk:WC_DARK,1);ctx.beginPath();ctx.arc(0,0,11,0,TAU);ctx.fill();ctx.restore();
    withA(ctx,clamp(p*2,0,1),()=>wc_T(ctx,s,x+(al==="right"?-18:18),Y.line-30,{w:700,size:30,align:al,col:WC_DARK}));});ctx.restore();}
// the emails that went round before: a stack of printed pages on the shelf, dust on the top one, and the tag that says what came of them
function ee_emails(ctx,tag){for(let i=0;i<7;i++){const x=560+((i*37)%5-2)*12,y=170+i*-6,r=((i*29)%7-3)*0.012;ee_onPaper(ctx,x,y,800,620,r,q=>{if(i<6)return;
    wc_T(q,"Re: Re: Re: completion",50,84,{w:700,size:32,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.4);q.fillRect(50,104,700,2);gv_lines(q,50,160,680,8,48,0.9);},{seed:731+i});}
  // a little dust on the top page
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(737);for(let i=0;i<160;i++){ctx.fillStyle=rgba([150,140,126],0.18+R()*0.2);const x=600+R()*760,y=180+R()*560;ctx.beginPath();ctx.arc(x,y,1+R()*2.2,0,TAU);ctx.fill();}ctx.restore();
  const a=clamp(tag||0,0,1);if(a>0.01){const k=0.9+0.1*spring(a);ctx.save();ctx.translate(960,840);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,"23 replies · no decision",{align:"center",size:34}));ctx.restore();}}
// the page from A capability, not a project, pinned on Clara's board: what you can ask data governance for, each with its promise; the
// line for a term lit gold (lit, 0 to 1)
const EE_PAGE=[["What does this number mean?","an answer in 2 working days"],["Define or change a term","decided within 10 working days"],["Let me see this data","in 5 working days, until a date"],
  ["Can I trust this product?","on its page by 7 a.m."],["Fix it where it starts","to the source's owner by Monday"],["What will this change touch?","answered before it goes in"],["Help me do it right","office hours every Thursday"]];
function ee_servicePage(ctx,lit){ee_onPaper(ctx,300,90,1320,700,-0.006,q=>{wc_T(q,"What you can ask data governance for",60,96,{w:800,size:42,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.5);q.fillRect(60,120,1200,3);
    EE_PAGE.forEach(([s,p],j)=>{const yy=196+j*70,l=j===1?clamp(lit||0,0,1):0;if(l>0.01)withA(q,l,()=>{q.save();q.globalCompositeOperation="multiply";q.fillStyle=rgba(wc_lit(GV.gold,0.4),0.9);q.fillRect(48,yy-40,1224,56);q.restore();});
      wc_T(q,s,60,yy,{w:700,size:32,col:l>0.5?GV.goldInk:WC_DARK});wc_T(q,p,700,yy,{w:600,size:32,col:l>0.5?GV.goldInk:WC_INK});});},{seed:741});
  [[340,108],[1580,108]].forEach(([x,y])=>gv_pin(ctx,x,y,GV.red,1.3));}
// Clara's request: a card, written by hand as she says it (w(i), 0 to 1, for line i), then the day it's sent (date) and the card going
// (go, 0 to 1: it lifts and slides off to the right, on its way)
const EE_RQ={w:860,h:430,lines:[["Define: completion"],["why: three faculties count it","three ways"],["who it affects: Planning,","Business, Science, Health"]],ys:[150,228,330]};
function ee_reqCard(ctx,cx,cy,o){o=o||{};const R=EE_RQ,go=easeCam(clamp(o.go||0,0,1)),s=o.s||1;ctx.save();ctx.translate(cx+go*1500,cy-Math.sin(go*Math.PI)*60);ctx.rotate(-0.01+go*0.05);ctx.scale(s,s);
  ctx.fillStyle="rgba(60,44,30,0.24)";ctx.fillRect(-R.w/2+10,-R.h/2+14,R.w,R.h);wc_panel(ctx,-R.w/2,-R.h/2,R.w,R.h,{kind:"card",seed:751,wash:GV.gold,washA:0.18});
  ctx.translate(-R.w/2,-R.h/2);wc_T(ctx,"request",44,64,{w:700,size:28,col:WC_MUTED});ctx.fillStyle=rgba(WC_PENCIL,0.4);ctx.fillRect(44,82,R.w-88,2);
  let pen=null;R.lines.forEach((L,i)=>{const p=o.w?o.w(i):1;if(p<=0)return;const n=L.reduce((a,b)=>a+b.length,0);let done=0;L.forEach((l,j)=>{const pp=clamp((p*n-done)/l.length,0,1);done+=l.length;
    if(pp>0){const sz=i===0?44:34,x0=44+(j?40:0),y0=R.ys[i]+j*44;wc_hand(ctx,l,x0,y0,{size:sz,w:i===0?800:600,col:GV_SIGN.ink,p:pp});if(pp<1&&p<1)pen=[x0+tw(ctx,l.slice(0,Math.ceil(l.length*pp)),sz,600)-0.2*sz*0.3+4,y0-sz*0.3+2*Math.sin(pp*40)];}});});
  if(pen&&go<0.01)ee_pen(ctx,pen[0],pen[1],1);
  const d=clamp(o.date||0,0,1);if(d>0.01){const k=lerp(1.3,1,1-Math.pow(1-d,3));ctx.save();ctx.translate(R.w-150,62);ctx.rotate(-0.05);ctx.scale(k,k);withA(ctx,clamp(d*1.5,0,1),()=>wc_tag(ctx,0,0,"11 January",{align:"center",size:30,wash:GV.gold,washA:0.5,col:GV.goldInk}));ctx.restore();}
  ctx.restore();}
// a pen lying at an angle, its point at (x, y) (A product with an owner's, in this film's own name)
function ee_pen(ctx,x,y,a,rot){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot==null?0.62:rot);ctx.fillStyle="rgba(60,44,30,0.2)";ctx.fillRect(22,14,210,16);
  ctx.fillStyle=rgba([196,200,210],1);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(26,-7);ctx.lineTo(26,7);ctx.closePath();ctx.fill();ctx.fillStyle=rgba(GV_SIGN.ink,1);ctx.fillRect(0.5,-1.2,7,2.4);
  ctx.fillStyle=rgba([44,56,104],1);rr(ctx,24,-9,190,18,8);ctx.fill();ctx.fillStyle=rgba([206,176,92],1);ctx.fillRect(150,-9,8,18);ctx.fillStyle=rgba([90,104,160],0.7);ctx.fillRect(30,-6,170,3);ctx.restore();});}
// a sheet held in both hands at the chest, its face towards us: three bars on it, too small to read
function ee_heldReport(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-10);cx.rotate(-0.04);cx.fillStyle="rgba(40,30,20,0.2)";cx.fillRect(-84,-62,176,130);
  cx.fillStyle="#fffdf6";cx.fillRect(-90,-68,180,130);cx.strokeStyle=rgba(WC_PENCIL,0.45);cx.lineWidth=2;cx.strokeRect(-90,-68,180,130);cx.fillStyle=rgba(WC_MUTED,0.55);cx.fillRect(-70,-50,110,7);
  [0.84,0.83,0.75].forEach((v,i)=>{cx.fillStyle=rgba([150,170,204],1);cx.fillRect(-70,-24+i*28,130*v,14);});cx.restore();fingers(cx,P_,[l,r]);}
// Planning's wall screen: the three faculties' rates as bars, without their words (the report on her desk has them)
function ee_planScreen(ctx){const [sx,sy,sw,sh]=GV_PL.screen;ctx.fillStyle=rgba([248,248,246],1);ctx.fillRect(sx+20,sy+20,sw-40,sh-40);
  [0.84,0.83,0.75].forEach((v,i)=>{const by=sy+90+i*96;ctx.fillStyle=rgba([226,230,236],1);ctx.fillRect(sx+80,by,sw-160,44);ctx.fillStyle=rgba([150,170,204],1);ctx.fillRect(sx+80,by,(sw-160)*v,44);});}

/* ---------- the agent's sign ---------- */
// a small four-pointed star that turns a little, back and forth, as the series draws an agent: software, never a person; and the cyan
// line it reads with (An agent that checks' ac_star and ac_reading, in this film's own names)
const EE_CYAN=[26,100,156];
function ee_star(ctx,x,y,s,t,a){if(a==null)a=1;if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*0.8)*0.15);ctx.scale(s,s);withA(ctx,a,()=>{
  ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,0,34,[170,214,246],0.55);ctx.restore();ctx.beginPath();
  for(let i=0;i<8;i++){const r=i%2?6:18,an=i*Math.PI/4-Math.PI/2;ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r);}ctx.closePath();ctx.fillStyle=rgba(EE_CYAN,1);ctx.fill();});ctx.restore();}
function ee_reading(ctx,x,y,w,h,a){if(a<=0.01||w<=1)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=a;const g=ctx.createLinearGradient(x,0,x+w,0);
  g.addColorStop(0,rgba([170,214,246],0.0));g.addColorStop(0.15,rgba([170,214,246],0.95));g.addColorStop(1,rgba([170,214,246],0.6));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();}

/* ---------- 3 · the request, followed ---------- */
// the university registrar, Mei's manager, who owns the registrar's office's terms: as Who decides drew her (its wd_reg)
PEOPLE.ee_reg={name:"",role:"University registrar",side:"Business",does:"uses",edge:BIZ,seed:73,
  skin:[214,170,136],hair:{style:"curly",c:[186,182,180]},glasses:[70,58,54],earrings:[255,214,140],
  top:{kind:"blazer",c:[120,48,62],inner:[238,232,222]},bottom:{c:[46,48,60]},shoe:[40,32,32],build:{sh:68,hip:60,h:0.98}};
// a smooth path through points (Catmull-Rom), as a polyline of n points to a span; and the point a fraction u along a polyline
function ee_smooth(P,n){n=n||12;const out=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
  for(let k=0;k<n;k++){const u=k/n,u2=u*u,u3=u2*u;out.push([0,1].map(j=>0.5*(2*p1[j]+(-p0[j]+p2[j])*u+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*u2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*u3)));}}
  out.push(P[P.length-1]);return out;}
function ee_along(pts,u){let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
  let left=L*clamp(u,0,1);for(let i=1;i<pts.length;i++){if(left<=seg[i-1]||i===pts.length-1){const v=seg[i-1]?clamp(left/seg[i-1],0,1):0;return[lerp(pts[i-1][0],pts[i][0],v),lerp(pts[i-1][1],pts[i][1],v)];}left-=seg[i-1];}
  return pts[0];}
// Clara's request, small and bright as it travels: a gold card with three lines on it, a soft glow round it (o.held: no glow)
function ee_flyCard(ctx,x,y,s,rot,a,o){if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);withA(ctx,a,()=>{
  if(!(o&&o.held)){ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,0,0,150,[255,222,120],0.95);wc_glowAt(ctx,0,0,80,[255,240,190],0.8);ctx.restore();}ctx.fillStyle="rgba(60,44,30,0.22)";ctx.fillRect(-54,-36,120,84);
  wc_panel(ctx,-60,-42,120,84,{kind:"card",seed:753,wash:GV.gold,washA:0.5});gv_lines(ctx,-42,-16,84,3,18,1);});ctx.restore();}
// the request held in both hands, its face to us: the gold card, three lines on it, without its glow (drawn with the person, a glow
// would take the person's outline with it)
function ee_heldReq(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my-26);cx.rotate(-0.05);ee_flyCard(cx,0,0,0.92,0,1,{held:true});cx.restore();fingers(cx,P_,[l,r]);}
// the draft and the agent's note, held to read: a sheet, a gold band at its head, lines; the note clipped on, dashed cyan
function ee_heldDraft(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+4);cx.rotate(-0.06);cx.fillStyle="rgba(40,30,20,0.2)";cx.fillRect(-64,-76,136,160);
  cx.fillStyle="#fffdf6";cx.fillRect(-70,-82,136,160);cx.strokeStyle=rgba(WC_PENCIL,0.45);cx.lineWidth=2;cx.strokeRect(-70,-82,136,160);cx.fillStyle=rgba(wc_lit(GV.gold,0.2),1);cx.fillRect(-70,-82,136,20);
  gv_lines(cx,-56,-46,104,5,18,1);cx.translate(28,18);cx.rotate(0.12);cx.fillStyle="#f6fbff";cx.fillRect(-10,-10,74,90);cx.save();cx.setLineDash([6,5]);cx.strokeStyle=rgba(EE_CYAN,0.9);cx.lineWidth=2.4;
  cx.strokeRect(-10,-10,74,90);cx.restore();ee_star(cx,8,8,0.42,0,1);gv_lines(cx,0,30,50,3,14,1);cx.restore();fingers(cx,P_,[l,r]);}

// Mei's draft on a screen close (GV_SC): the term; then each row, its label at the left and its words at the right, typed in (o.line(i),
// 0 to 1, for i the title, then the rows); the agent's reading: its cyan line running across row o.read (0 to 4; its fraction, how far
// across), o.readA; a gold tick lighting by each row's label as it's read (o.tick(i)); the agent's card at the top right (o.agent, t
// turns its star); and its note (o.note, 0 to 1), sliding up over the draft: "touches", and under it the three reports and two dashboards
// the change touches (o.touch(i)); then what's missing from the draft: nothing
const EE_DRAFT={lab:390,val:640,tick:600,title:196,lh:44,size:34,rows:[["definition",["A learner completes an award on the day","the examiners confirm they have met all","its requirements."],276],
  ["example",["last mark in on 2 December, confirmed on","9 December, conferred on 15 March:","completed on 9 December"],434],["owner",["registrar's office"],592],["status",["proposed"],664]]};
const EE_TOUCH=[["Completions for Planning",0],["Health's progress report",0],["Business's progress report",0],["the faculties' dashboard",1],["the near-award dashboard",1]];
function ee_draft(ctx,t,o){o=o||{};const D=EE_DRAFT,[x,y,w,h]=GV_SC,ln=i=>o.line?clamp(o.line(i),0,1):1,dim=1-0.75*clamp((o.note||0)*2.2,0,1);
  gv_screen(ctx,x,y,w,h,"Draft",q=>{withA(q,dim,()=>{
    // a line typed in: drawn up to where the typing has reached, with the caret after it
    const typed=(s,tx,ty,u,op)=>{if(u<=0.01)return;const n=Math.ceil(s.length*u),sub=s.slice(0,n);wc_T(q,sub,tx,ty,op);
      if(u<1){const cw=tw(q,sub,op.size,op.w);q.fillStyle=rgba(WC_DARK,0.8);q.fillRect(tx+cw+4,ty-op.size*0.78,3,op.size*0.95);}};
    typed("completion",D.lab,D.title,ln(0),{w:800,size:56,col:WC_DARK});if(ln(0)>0.5){q.fillStyle=rgba(WC_PENCIL,0.4);q.fillRect(D.lab,D.title+24,w-120,2);}
    D.rows.forEach(([lab,L,ry],i)=>{const u=ln(i+1);if(u<=0.01)return;withA(q,clamp(u*4,0,1),()=>wc_T(q,lab,D.lab,ry,{w:600,size:30,col:WC_MUTED}));
      if(lab==="status"){const a=clamp((u-0.2)*2,0,1);if(a>0.01)withA(q,a,()=>{const pw=tw(q,"proposed",30,700)+40;wc_panel(q,D.val,ry-34,pw,48,{kind:"pill",wash:GV.grey,washA:0.45,seed:761});
        wc_T(q,"proposed",D.val+20,ry,{w:700,size:30,col:GV.greyInk});});}
      else{const n=L.reduce((a,b)=>a+b.length,0);let done=0;L.forEach((l,j)=>{const uu=clamp((u*n-done)/l.length,0,1);done+=l.length;
        typed(l,D.val,ry+j*D.lh,uu,{w:lab==="example"&&j===2?800:600,size:D.size,col:lab==="example"&&j===2?WC_DARK:WC_INK});});}
      const tk=o.tick?clamp(o.tick(i),0,1):0;if(tk>0.01)wc_tick(q,D.tick,ry-10,30,GV.goldInk,tk,5);});
    // the agent reading, row by row
    const ra=o.readA||0;if(ra>0.01&&o.read!=null&&o.read<4){const rd=Math.max(0,o.read),r=Math.floor(rd),u=easeCam(rd-r),[,L,ry]=D.rows[r],bw=860,top=ry-40,bh=(Math.max(1,L.length)-1)*D.lh+56;
      ee_reading(q,D.lab-20,top,(bw+40)*u+20,bh,ra);ee_star(q,D.lab-20+(bw+40)*u+20,top+bh/2,0.9,t,ra);}});
    // the agent's card: its star, its name
    const ag=o.agent||0;if(ag>0.01){const ax=1230,ay=140,aw=330,ah=86,k=0.9+0.1*spring(clamp(ag,0,1));q.save();q.translate(ax+aw/2,ay+ah/2);q.scale(k,k);q.translate(-ax-aw/2,-ay-ah/2);
      withA(q,clamp(ag*2,0,1),()=>{wc_panel(q,ax,ay,aw,ah,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:771});ee_star(q,ax+44,ay+ah/2,1,t,1);
        wc_T(q,"the agent",ax+80,ay+ah/2+12,{w:800,size:32,col:WC_DARK});});q.restore();}
    // its note, sliding up over the draft
    const nt=easeCam(clamp(o.note||0,0,1));if(nt>0.01){const nx=372,ny=140+(1-nt)*640,nw=1176,nh=598;q.save();q.beginPath();q.rect(x,y+54,w,h-54);q.clip();
      q.fillStyle="rgba(30,50,80,0.14)";q.fillRect(nx+8,ny+10,nw,nh);q.fillStyle=rgba([250,250,247],1);q.fillRect(nx+4,ny+4,nw-8,nh-8);
      wc_panel(q,nx,ny,nw,nh,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:781});ee_star(q,nx+50,ny+60,1.1,t,1);
      wc_T(q,"touches",nx+90,ny+76,{w:800,size:42,col:WC_DARK});q.fillStyle=rgba(WC_PENCIL,0.35);q.fillRect(nx+30,ny+104,nw-60,2);
      [["reports",nx+40],["dashboards",nx+620]].forEach(([s,gx],g)=>{const a=clamp(o.touch?Math.max(...EE_TOUCH.map(([,gg],i)=>gg===g?o.touch(i):0))*3:1,0,1);
        if(a>0.01)withA(q,a,()=>wc_T(q,s,gx,ny+164,{w:600,size:30,col:WC_MUTED}));});
      EE_TOUCH.forEach(([s,g],i)=>{const u=o.touch?clamp(o.touch(i),0,1):1;if(u<=0.01)return;const j=EE_TOUCH.slice(0,i).filter(([,gg])=>gg===g).length,cx=nx+40+g*580,cy=ny+190+j*100,cw=520,ch=78,
        k=0.88+0.12*spring(u);q.save();q.translate(cx+cw/2,cy+ch/2);q.scale(k,k);q.translate(-cx-cw/2,-cy-ch/2);withA(q,clamp(u*2,0,1),()=>{wc_panel(q,cx,cy,cw,ch,{kind:"card",seed:791+i});
          ee_glyph(q,cx+36,cy+ch/2,g);wc_T(q,s,cx+76,cy+ch/2+11,{w:700,size:30,col:WC_DARK});});q.restore();});
      wc_T(q,"missing: nothing",nx+40,ny+nh-56,{w:700,size:30,col:WC_DARK});wc_tick(q,nx+40+tw(q,"missing: nothing",30,700)+34,ny+nh-66,30,GV.goldInk,1,5);q.restore();}},{titleSize:32,barH:54});}
// a report's sign (a sheet, three bars on it) or a dashboard's (a little screen, a dial and a bar), at (x, y)
function ee_glyph(ctx,x,y,dash){ctx.save();ctx.translate(x,y);ctx.lineWidth=2.4;ctx.strokeStyle=rgba(WC_DARK,0.7);
  if(!dash){ctx.fillStyle="#fffdf6";ctx.fillRect(-14,-19,28,38);ctx.strokeRect(-14,-19,28,38);[0.8,0.6,0.9].forEach((v,i)=>{ctx.fillStyle=rgba([150,170,204],1);ctx.fillRect(-9,-11+i*10,18*v,5);});}
  else{ctx.fillStyle=rgba([226,232,240],1);ctx.fillRect(-20,-15,40,28);ctx.strokeRect(-20,-15,40,28);ctx.beginPath();ctx.arc(-7,3,8,Math.PI,TAU);ctx.stroke();ctx.fillStyle=rgba([150,170,204],1);ctx.fillRect(5,-6,9,13);
    ctx.beginPath();ctx.moveTo(0,13);ctx.lineTo(0,20);ctx.moveTo(-9,20);ctx.lineTo(9,20);ctx.stroke();}ctx.restore();}
// the registrar's decision: a card that springs in beside her (u), its lines written in as she decides (w(i)), the date (date) and her
// signature (sign)
const EE_DEC={x:1150,y:110,w:720,h:500,lines:[["decided by: the registrar,",112],["for the registrar's office",156],["why: one count, for every faculty,",250],["on the day the requirements are met",294]]};
function ee_decision(ctx,u,o){o=o||{};if(u<=0.01)return;const D=EE_DEC,k=0.9+0.1*spring(clamp(u,0,1));ctx.save();ctx.translate(D.x+D.w/2,D.y+D.h/2);ctx.scale(k,k);ctx.translate(-D.w/2,-D.h/2);
  withA(ctx,clamp(u*2,0,1),()=>{ctx.fillStyle="rgba(60,44,30,0.22)";ctx.fillRect(10,14,D.w,D.h);wc_panel(ctx,0,0,D.w,D.h,{kind:"card",seed:801,wash:GV.gold,washA:0.22});
    wc_T(ctx,"decision: completion",40,62,{w:700,size:30,col:WC_MUTED});ctx.fillStyle=rgba(WC_PENCIL,0.4);ctx.fillRect(40,80,D.w-80,2);
    D.lines.forEach(([s,ly],i)=>{const p=o.w?clamp(o.w(i),0,1):1;if(p>0.01)wc_hand(ctx,s,40,ly,{size:32,w:i===0?800:600,col:GV_SIGN.ink,p});});
    const sg=clamp(o.sign||0,0,1);if(sg>0.01){ctx.save();ctx.strokeStyle=rgba(GV_SIGN.ink,0.95);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.lineJoin="round";const n=Math.max(2,Math.round(60*sg));ctx.beginPath();
      for(let i=0;i<=n;i++){const v=i/60,px=60+v*300,py=420-18*Math.sin(v*TAU*2.6)*(1-v*0.4)-v*14+(v>0.7?(v-0.7)*60:0);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();ctx.restore();
      withA(ctx,clamp(sg*3,0,1),()=>{ctx.fillStyle=rgba(WC_PENCIL,0.45);ctx.fillRect(40,446,360,2);});}
    const d=clamp(o.date||0,0,1);if(d>0.01){const kk=lerp(1.3,1,1-Math.pow(1-d,3));ctx.save();ctx.translate(D.w-140,424);ctx.rotate(-0.05);ctx.scale(kk,kk);
      withA(ctx,clamp(d*1.5,0,1),()=>wc_tag(ctx,0,0,"21 January",Object.assign({align:"center",size:32},EE_GOLDTAG)));ctx.restore();}});ctx.restore();}
// a screen drawn as the screen close is (GV_SC, 1260 x 690), scaled into a smaller screen's box; its words are too small to read there,
// so they're decoration (Teachers of data's tt_onScreen)
function ee_onScreen(ctx,box,fn){const [sx,sy,sw,sh]=box,k=sw/GV_SC[2];ctx.save();ctx.translate(sx-GV_SC[0]*k,sy+(sh-GV_SC[3]*k)/2-GV_SC[1]*k);ctx.scale(k,k);
  ctx.beginPath();ctx.rect(GV_SC[0],GV_SC[1],GV_SC[2],GV_SC[3]);ctx.clip();const p=PH_OFF;PH_OFF=1;try{fn(ctx);}finally{PH_OFF=p;ctx.restore();}}
// the request's path over the floor, step by step: where each step happens, and its tag. The gold thread joins the people who do a
// step (Clara, Mei, the registrar, data governance, on to the copies: the data team's, and the platform team's assistant); the
// agent's check goes out from Mei's desk to the data team's room and back, dashed cyan, as software
const EE_STOP={ask:[260,500],draft:[520,500],check:[1290,370],decide:[690,500],publish:[960,500],copy:[1290,500],follow:[1790,500]};
const ee_hop=(a,b,lift)=>{const [x0,y0]=EE_STOP[a],[x1,y1]=EE_STOP[b],n=24,out=[];for(let i=0;i<=n;i++){const u=i/n;out.push([lerp(x0,x1,u),lerp(y0,y1,u)-Math.sin(u*Math.PI)*lift]);}return out;};
function ee_dot(ctx,x,y,col,a){if(a<=0.01)return;ctx.save();ctx.fillStyle=rgba(col,a);ctx.beginPath();ctx.arc(x,y,9,0,TAU);ctx.fill();ctx.restore();}
// p(k): how far each hop is drawn (0 to 1); tag(k): each step's tag. Hops: ask to draft, draft to check and back to decide (cyan), draft
// to decide, decide to publish, publish to the data team's copy and on to follow
function ee_thread(ctx,p,tag){const H=[[ee_hop("ask","draft",60),"g"],[ee_hop("draft","check",120),"c"],[ee_hop("check","decide",70),"c"],[ee_hop("draft","decide",40),"g"],
    [ee_hop("decide","publish",60),"g"],[ee_hop("publish","copy",50),"g"],[ee_hop("copy","follow",70),"g"]];
  H.forEach(([pts,k],i)=>{const u=clamp(p(i),0,1);if(u<=0.01)return;if(k==="c"){ctx.save();ctx.setLineDash([16,12]);ee_goldLine(ctx,pts,u,{col:EE_CYAN,lw:5,a:0.9});ctx.restore();}
    else ee_goldLine(ctx,pts,u,{lw:7});});
  [["ask",GV.gold],["draft",GV.gold],["decide",GV.gold],["publish",GV.gold],["copy",GV.gold],["follow",GV.gold],["check",EE_CYAN]].forEach(([s,col])=>{
    const a=s==="copy"?clamp(p(5)*1.5-0.5,0,1):clamp(tag(s)*2,0,1);ee_dot(ctx,EE_STOP[s][0],EE_STOP[s][1],col,a);});
  ["ask","draft","check","decide","publish","follow"].forEach(s=>{const u=clamp(tag(s),0,1);if(u<=0.01)return;const [x,y]=EE_STOP[s],k=0.85+0.15*spring(u);ctx.save();ctx.translate(x,y-56);ctx.scale(k,k);
    withA(ctx,clamp(u*2.5,0,1),()=>wc_tag(ctx,0,0,s,s==="check"?{align:"center",size:30,wash:WC_SIDE.tech,washA:0.35,col:[26,80,126]}:Object.assign({align:"center",size:30},EE_GOLDTAG)));ctx.restore();});}

/* ---------- a chart that follows ---------- */
// where someone's hands are, in the room's coordinates (Teachers of data's tt_handsAt), for what leaves them; a nod (Who decides' wd_nod)
function ee_handsAt(id,X,Y,s,o){const P_=PEOPLE[id],po=blendPose(POSE[o.pose||"stand"],POSE[o.pose2],o.mix),k=s*P_.build.h,br=Math.sin((o.t||0)*1.7+P_.seed)*1.4,f=o.flip?-1:1;
  return[handAt(P_,-1,po.L,br),handAt(P_,1,po.R,br)].map(h=>[X+f*h[0]*k,Y+h[1]*k]);}
const ee_nod=(tt,t0)=>0.11*Math.sin(Math.PI*clamp((tt-t0)/0.55,0,1));
// the chart from Yusuf's first day, as Off the shelf drew it (its os_chart): four things, and for each, the one responsible, the one
// accountable, who's consulted and who's informed; half the names "TBC", in red by hand. o.pulse(k), 0 to 1: a red wash behind the k-th
// TBC; o.off, 0 to 1: taken down, its pins out first, then lifted off the board towards us, and gone
const EE_RACI={things:["census report","award term","government submission","data access"],cols:["responsible","accountable","consulted","informed"],
  names:[["Clara",0,"Jun",0],["Mei",0,0,"Jun"],[0,0,"Clara","Mei"],["Sam",0,0,"Jun"]]};
const EE_OC={x:300,y:96,w:1320,h:700,c0:420,cw:205,head:212,row:116};
const ee_ocCell=(i,j)=>{const C=EE_OC;return[C.x+40+C.c0+j*C.cw+C.cw/2,C.y+C.head+56+i*C.row];};
function ee_oldChart(ctx,o){o=o||{};const C=EE_OC,gx=C.x+40,gw=C.c0+4*C.cw,off=clamp(o.off||0,0,1),pop=clamp(off/0.25,0,1),lift=easeCam(clamp((off-0.2)/0.8,0,1)),
    pu=k=>clamp(typeof o.pulse==="function"?o.pulse(k):(o.pulse||0),0,1),cx=C.x+C.w/2,cy=C.y+C.h/2;
  ctx.save();ctx.translate(cx+230*lift,cy+10*pop+40*lift);ctx.rotate(0.06*lift);ctx.scale(1+0.12*lift,1+0.12*lift);ctx.translate(-cx,-cy);
  withA(ctx,1-clamp((off-0.3)/0.4,0,1),()=>{gv_sheet(ctx,C.x,C.y,C.w,C.h);
    if(pop<1)[[C.x+40,C.y+22],[C.x+C.w-40,C.y+22]].forEach(([px,py])=>withA(ctx,1-pop,()=>gv_pin(ctx,px,py,GV.red,1.4*(1+0.5*pop))));
    wc_T(ctx,"Who's responsible for what",C.x+40,C.y+96,{w:800,size:44,col:WC_DARK});
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.55);ctx.lineWidth=2;for(let i=0;i<=4;i++){const y=C.y+C.head+i*C.row;ctx.beginPath();ctx.moveTo(gx,y);ctx.lineTo(gx+gw,y);ctx.stroke();}
    for(let j=0;j<4;j++){const x=gx+C.c0+j*C.cw;ctx.beginPath();ctx.moveTo(x,C.y+C.head-60);ctx.lineTo(x,C.y+C.head+4*C.row);ctx.stroke();}ctx.restore();
    EE_RACI.cols.forEach((s,j)=>wc_T(ctx,s,gx+C.c0+j*C.cw+C.cw/2,C.y+C.head-20,{w:700,size:28,align:"center",col:WC_MUTED}));
    EE_RACI.things.forEach((s,i)=>wc_T(ctx,s,gx+8,C.y+C.head+i*C.row+68,{w:700,size:30,col:WC_DARK}));
    let k=0;EE_RACI.names.forEach((r,i)=>r.forEach((n,j)=>{const [x,y]=ee_ocCell(i,j);if(n){wc_T(ctx,n,x,y+12,{w:600,size:32,align:"center",col:WC_INK});return;}
      gv_tint(ctx,x-C.cw/2+6,y-50,C.cw-12,C.row-12,GV.red,0.55*pu(k++));wc_hand(ctx,"TBC",x-42,y+14,{size:40,col:GV.redInk});}));});ctx.restore();}
// the same chart, small on the board in Yusuf's office (Off the shelf's os_chartSmall): lines for the words, a red mark for each TBC
function ee_oldChartSmall(ctx){const [bx,by]=GV_OFF.board,x=bx+40,y=by+50,w=330,h=190;gv_sheet(ctx,x,y,w,h);gv_pin(ctx,x+16,y+10,GV.red,0.8);gv_pin(ctx,x+w-16,y+10,GV.red,0.8);
  gv_lines(ctx,x+18,y+28,170,1,0);ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.45);ctx.lineWidth=1.5;for(let i=0;i<=4;i++){ctx.beginPath();ctx.moveTo(x+14,y+56+i*30);ctx.lineTo(x+w-14,y+56+i*30);ctx.stroke();}ctx.restore();
  for(let i=0;i<4;i++){gv_lines(ctx,x+20,y+68+i*30,70,1,0,0.8);EE_RACI.names[i].forEach((n,j)=>{const cx=x+128+j*48;if(n)gv_lines(ctx,cx,y+68+i*30,32,1,0,0.8);
    else{ctx.fillStyle=rgba(GV.redInk,0.8);ctx.fillRect(cx,y+64+i*30,30,9);}});}}
// what else the office had on his first day, as Off the shelf drew it: the framed score (its os_score), small, drawn as part of the room;
// the binders on the shelves (its os_binders)
function ee_score(ctx){const [x,y,w]=GV_OFF.score,cx=x+w/2;
  wc_T(ctx,"maturity",cx,y+40,{w:600,size:24,align:"center",col:WC_MUTED,deco:1});wc_T(ctx,"2.1 / 5",cx,y+88,{w:800,size:42,align:"center",col:WC_DARK,deco:1});
  for(let i=0;i<5;i++){const bx=x+24+i*26;ctx.fillStyle=rgba(WC_MUTED,0.25);ctx.fillRect(bx,y+104,22,12);const f=clamp(2.1-i,0,1);if(f>0){ctx.fillStyle=rgba(GV.gold,0.95);ctx.fillRect(bx,y+104,22*f,12);}}}
const EE_BIND={w:24,h:146,gap:26.6,x:1393,cols:[[96,118,150],[150,90,80],[120,140,104],[186,160,110],[132,136,150],[110,96,130]]};
function ee_binders(ctx){const B=EE_BIND;for(let i=0;i<34;i++){const x=B.x+(i%17)*B.gap,y=GV_OFF.shelf.rows[i<17?1:2];
  gv_binder(ctx,x,y-B.h,B.w,B.h,B.cols[Math.floor(hash(i,17)*B.cols.length)]);}}
// the book on his desk, as the films before draw it (gv_deskBook), its cover without words: this series names no framework on screen
function ee_deskBook(ctx){const D=GV_DMB;ctx.save();ctx.translate(D.x,GV_OFF.desk[1]);ctx.rotate(0.05);ctx.scale(D.k,D.k);ctx.drawImage(gv_deskBookC(),-D.w/2-40,-D.h-40);ctx.restore();}
// Yusuf's office now, as Teachers of data left it (its tt_paintOffice): the framed score taken down, the wall painted again where it hung,
// a little paler there, and its nail
function ee_paintOfficeNow(ctx){gv_paintOffice(ctx);const [x,y,w,h]=GV_OFF.score;ctx.save();ctx.beginPath();ctx.rect(x-34,y-34,w+68,h+68);ctx.clip();
  gv_wallFloor(ctx,GV_ROOM.gov,GV_OFF.fy,{seed:11,vx:900});gv_lightGlow(ctx,960,0,520);ctx.restore();
  ctx.save();ctx.globalCompositeOperation="screen";ctx.fillStyle="rgba(255,250,236,0.14)";ctx.fillRect(x-12,y-12,w+24,h+24);ctx.restore();
  ctx.fillStyle=rgba(WC_PENCIL,0.85);ctx.beginPath();ctx.arc(x+w/2,y+6,3.4,0,TAU);ctx.fill();}
// Yusuf's desk, close: his screen on the desk at the left, and the calendar pinned on the wall beside it (drawn every frame, as it turns);
// the wall, the desk's top, the screen and its neck are painted once (the place chartWall)
const EE_CW={x:70,y:96,w:1120,h:668,bar:64};
function ee_paintChartWall(ctx){const C=EE_CW;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,960),GV_ROOM.gov,{kind:"plaster",line:false,seed:77});
  gv_lightGlow(ctx,1250,-60,900);wc_wash(ctx,wc_rect(-40,900,W+80,220),GV.oak,{kind:"plaster",line:false,seed:78});wc_wash(ctx,wc_rect(-40,894,W+80,14),wc_dim(GV.oak,0.25),{kind:"trim",line:false,flat:true});
  wc_part(ctx,[[C.x+C.w/2-40,C.y+C.h+12],[C.x+C.w/2+40,C.y+C.h+12],[C.x+C.w/2+52,912],[C.x+C.w/2-52,912]],GV.metal,1);wc_wash(ctx,wc_ell(C.x+C.w/2,918,190,22,30),GV.metal,{kind:"thing",lw:1.4});
  gv_monitor(ctx,C.x,C.y,C.w,C.h,{stand:false});wc_wash(ctx,wc_ell(1700,992,70,40,30),[236,240,244],{kind:"thing",lw:1.4});wc_wash(ctx,wc_ell(1700,992,52,28,30),[150,104,70],{kind:"thing",line:false});}
// the chart drawn from Noor's map, on his screen: for each step, its role and who fills it today. o.page, 0 to 1: the page comes up;
// o.tag: "drawn from the map"; o.col(c), 0 to 1: each column as it's said; o.who, 0 to 1: the steward's row turns, like a card, to Mei's
// colleague while she's away, and back as it goes to 0 (its words fade as it turns edge-on); o.rowLit: that row lit gold
const EE_NROWS=[["ask","the one who asks","anyone"],["draft","the steward","Mei Tanaka"],["check","the reviewer","the agent"],["decide","the owner","the registrar"],
  ["publish","","the map and the glossary"],["follow","","every copy"]];
function ee_chartScreen(ctx,o){o=o||{};const C=EE_CW,pg=clamp(o.page==null?1:o.page,0,1);if(pg<=0.01)return;
  const cl=c=>clamp(o.col?o.col(c):1,0,1),X=[C.x+44,C.x+270,C.x+640],top=C.y+C.bar+124,rh=78,x0=C.x+24,x1=C.x+C.w-24;
  withA(ctx,pg,()=>{gv_screen(ctx,C.x,C.y,C.w,C.h,"Who's responsible for what",null,{barH:C.bar,titleSize:36});
    const tg=clamp(o.tag||0,0,1);if(tg>0.01){const k=0.9+0.1*spring(tg);ctx.save();ctx.translate(x1,C.y+C.bar+46);ctx.scale(k,k);
      withA(ctx,clamp(tg*2,0,1),()=>wc_tag(ctx,0,0,"drawn from the map",Object.assign({align:"right",size:28},EE_GOLDTAG)));ctx.restore();}
    const lr=clamp(o.rowLit||0,0,1);if(lr>0.01)gv_tint(ctx,x0,top+rh,x1-x0,rh,GV.gold,0.9*lr);
    ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.22);for(let i=0;i<=6;i++)ctx.fillRect(x0,top+i*rh-1,x1-x0,2);ctx.restore();
    ["step","role","filled by today"].forEach((s,c)=>{const a=cl(c);if(a>0.01)withA(ctx,a,()=>wc_T(ctx,s,X[c],top-18,{w:700,size:28,col:WC_MUTED}));});
    const who=clamp(o.who||0,0,1),fl=Math.abs(Math.cos(Math.PI*who)),ta=clamp((fl-0.86)/0.14,0,1);
    EE_NROWS.forEach((r,i)=>{const yb=top+i*rh+rh/2+11;r.forEach((s,c)=>{const a=cl(c);if(a<=0.01||!s)return;withA(ctx,a,()=>{
      if(c===2&&i===1){const ym=top+i*rh+rh/2;ctx.save();ctx.translate(0,ym);ctx.scale(1,Math.max(0.02,fl));ctx.translate(0,-ym);withA(ctx,ta,()=>{
        if(who<0.5)wc_T(ctx,s,X[2],yb,{w:700,size:30,col:WC_DARK});
        else{wc_T(ctx,"Iris Bello, registrar's office,",X[2],ym-5,{w:700,size:28,col:WC_DARK});wc_T(ctx,"until 19 February",X[2],ym+27,{w:600,size:28,col:WC_INK});}});ctx.restore();return;}
      wc_T(ctx,s,X[c],yb,c===0?{w:800,size:32,col:WC_DARK}:c===1?{w:600,size:30,col:WC_INK}:{w:700,size:30,col:i>=4?WC_MUTED:WC_DARK});});});});});}
// the calendar pinned beside it: January 2027, turned up to February (o.turn, 0 to 1), Monday first; three weeks of February ringed for
// Mei's leave (o.ring, 0 to 1, drawn round, then its words), and the Monday she's back ringed in gold (o.back)
const EE_WC={x:1270,y:150,w:560,band:84,head:48,dh:100},EE_MONTHS=[["January 2027",4,31],["February 2027",0,28]];
// one month's page (ta: its words' strength, so a page turning edge-on loses them first)
function ee_calPage(ctx,m,ta){const C=EE_WC,dw=C.w/7,top=C.y+C.band+C.head,[name,first,days]=EE_MONTHS[m];ta=ta==null?1:ta;
  ctx.fillStyle="rgba(60,50,40,0.18)";ctx.fillRect(C.x+8,C.y+10,C.w,top+5*C.dh+16-C.y);wc_flat(ctx,wc_rect(C.x,C.y,C.w,top+5*C.dh+16-C.y),GV.paper,1,"page");
  wc_flat(ctx,wc_rect(C.x,C.y,C.w,C.band),[96,118,150],1,"band");wc_flat(ctx,wc_rect(C.x+5*dw,top,2*dw,5*C.dh),[238,236,230],0.9,"weekend");
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.3);ctx.lineWidth=1.4;for(let r=0;r<=5;r++){ctx.beginPath();ctx.moveTo(C.x,top+r*C.dh);ctx.lineTo(C.x+C.w,top+r*C.dh);ctx.stroke();}
  for(let c=1;c<7;c++){ctx.beginPath();ctx.moveTo(C.x+c*dw,top);ctx.lineTo(C.x+c*dw,top+5*C.dh);ctx.stroke();}ctx.restore();
  if(ta<=0.01)return;withA(ctx,ta,()=>{wc_T(ctx,name,C.x+28,C.y+56,{w:800,size:38,col:[255,255,255]});
    ["M","T","W","T","F","S","S"].forEach((d,c)=>wc_T(ctx,d,C.x+c*dw+dw/2,C.y+C.band+36,{w:700,size:28,align:"center",col:WC_MUTED}));
    for(let d=1;d<=days;d++){const i=first+d-1;wc_T(ctx,String(d),C.x+(i%7)*dw+12,top+Math.floor(i/7)*C.dh+38,{w:600,size:28,col:i%7>4?WC_MUTED:WC_DARK});}});}
function ee_wallCal(ctx,o){o=o||{};const C=EE_WC,dw=C.w/7,top=C.y+C.band+C.head,tu=easeCam(clamp(o.turn||0,0,1));
  ee_calPage(ctx,1,clamp((tu-0.08)/0.1,0,1));
  const rg=clamp(o.ring||0,0,1);if(rg>0.01&&tu>0.99){const x0=C.x+6,y0=top+6,w=5*dw-12,h=3*C.dh-12,L=2*(w+h);ctx.save();ctx.strokeStyle=rgba([204,62,50],0.85);ctx.lineWidth=4.5;ctx.lineJoin="round";
    ctx.setLineDash([L*clamp(rg*1.4,0,1),L]);rr(ctx,x0,y0,w,h,18);ctx.stroke();ctx.restore();
    const la=clamp(rg*3-2,0,1);if(la>0.01)withA(ctx,la,()=>wc_hand(ctx,"Mei · leave",x0+w/2,top+C.dh+76,{size:30,w:700,col:GV.redInk,align:"center"}));}
  const bk=clamp(o.back||0,0,1);if(bk>0.01&&tu>0.99){ctx.save();ctx.strokeStyle=rgba(GV.gold,0.95);ctx.lineWidth=4.5;ctx.lineCap="round";ctx.beginPath();
    ctx.ellipse(C.x+29,top+3*C.dh+28,27,22,0.1,-Math.PI/2,-Math.PI/2+TAU*clamp(bk*1.3,0,1));ctx.stroke();ctx.restore();}
  // January, turning up and over the top, showing February under it: its words go first, as it starts to turn; it greys as it turns from
  // the light, and its edge shades February under it
  if(tu<0.999){const ph=top+5*C.dh+16-C.y,yb=C.y+ph*(1-tu),sh=0.3*Math.sin(Math.PI*Math.min(1,tu*1.15));ctx.save();const g=ctx.createLinearGradient(0,yb,0,yb+70);
    g.addColorStop(0,rgba([50,40,30],sh));g.addColorStop(1,rgba([50,40,30],0));ctx.fillStyle=g;ctx.fillRect(C.x,yb,C.w,70);ctx.restore();
    ctx.save();ctx.translate(0,C.y);ctx.scale(1,1-tu);ctx.translate(0,-C.y);ee_calPage(ctx,0,clamp(1-tu*6,0,1));ctx.fillStyle=rgba([90,80,70],0.4*tu);ctx.fillRect(C.x,C.y,C.w,ph);ctx.restore();}
  gv_pin(ctx,C.x+C.w/2,C.y-2,GV.red,1.3);}
// the box marked "retired", on the floor of Yusuf's office by the window, with what Teachers of data put in it (its tt_box): the forms that
// waited for approval, the framed score (deep in it, its edge showing), the binder's grey pages. The old chart, folded, is tossed into it
// from his hands (o.drop, 0 to 1, from o.from, along a low arc); o.cards (0 to 1): nine pale term cards, tossed in the same way from
// o.cardsFrom, one after another, and standing in it
const EE_BOX={x:560,base:858,w:230,h:128};
function ee_folded(ctx,x,y,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.fillStyle=rgba([250,248,240],1);ctx.fillRect(-58,-26,116,52);ctx.strokeStyle=rgba(WC_PENCIL,0.45);ctx.lineWidth=1.4;
  ctx.strokeRect(-58,-26,116,52);ctx.beginPath();ctx.moveTo(-58,0);ctx.lineTo(58,0);ctx.stroke();ctx.fillStyle=rgba(GV.redInk,0.7);ctx.fillRect(-30,-16,22,7);ctx.fillRect(14,8,22,7);ctx.restore();}
function ee_box(ctx,o){o=o||{};const B=EE_BOX,X=B.x-B.w/2,Y=B.base-B.h,[sx,sy,fw,fh]=GV_OFF.score;
  for(let i=0;i<6;i++){ctx.save();ctx.translate(B.x-26+i*5,Y-16);ctx.rotate(-0.08+i*0.03);ctx.fillStyle=rgba(i%2?[248,246,238]:[240,236,226],1);ctx.fillRect(-56,-10,112,30);
    ctx.strokeStyle=rgba(WC_PENCIL,0.4);ctx.lineWidth=1;ctx.strokeRect(-56,-10,112,30);ctx.restore();}
  ctx.save();ctx.translate(B.x-6,Y+12);ctx.rotate(-0.06);ctx.fillStyle="rgba(60,50,40,0.16)";ctx.fillRect(-fw/2-10,-fh/2-6,fw+28,fh+28);gv_frame(ctx,-fw/2,-fh/2,fw,fh);ctx.restore();
  for(let i=0;i<5;i++){ctx.save();ctx.translate(B.x+40+i*4,Y-14);ctx.rotate(0.1-i*0.04);ctx.fillStyle=rgba(mix(GV.grey,[255,255,255],0.45+0.1*(i%2)),1);ctx.fillRect(-46,-12,92,30);
    ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1;ctx.strokeRect(-46,-12,92,30);ctx.restore();}
  const cd=clamp(o.cards||0,0,1);if(cd>0.01)for(let i=0;i<9;i++){const e=clamp(cd*1.6-i*0.07,0,1);if(e<=0.01)continue;const f=o.cardsFrom||[B.x,Y-140],tx=B.x-80+i*20,ty=Y-16,
      px=lerp(f[0],tx,e),py=lerp(f[1],ty,e*e)-50*Math.sin(Math.PI*e)*(1-e);ctx.save();ctx.translate(px,py);ctx.rotate(lerp(-0.2,-0.1+i*0.025,e));
    ctx.fillStyle=rgba(mix(GV.grey,[255,255,255],0.55),1);ctx.fillRect(-30,-14,60,40);ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1;ctx.strokeRect(-30,-14,60,40);ctx.restore();}
  const dr=clamp(o.drop||0,0,1);if(dr>0.01){const f=o.from||[B.x+120,Y-160],px=lerp(f[0],B.x+10,dr),py=lerp(f[1],Y+4,dr*dr)-70*Math.sin(Math.PI*dr)*(1-dr);
    ee_folded(ctx,px,py,lerp(-0.08,0.25,dr));}
  ctx.drawImage(wc_kept("eeBox",B.w+40,B.h+40,q=>{q.translate(20,20);wc_contact(q,-10,B.w+10,B.h+2,0.9,0.3);wc_part(q,wc_rect(0,0,B.w,B.h),[198,164,120],1);wc_part(q,wc_rect(-4,-6,B.w+8,14),[210,178,134],1);
    wc_flat(q,wc_rect(B.w/2-74,36,148,56),WC_CARD,1,"label");}),X-20,Y-20);wc_hand(ctx,"retired",B.x,Y+76,{size:30,w:700,col:WC_DARK,align:"center"});}
// the old chart, folded, held in both hands
function ee_heldFolded(cx,P_,hands){const [l,r]=hands;ee_folded(cx,(l[0]+r[0])/2,(l[1]+r[1])/2-14,-0.08);fingers(cx,P_,[l,r]);}
// Mei's calendar, close, as Who decides drew it (its wd_paintCal): March 2027 now, Monday first; her owner's two hours on Tuesdays, and
// the steward's two hours on Thursdays, painted in from the left (p(k), 0 to 1, for week k)
const EE_MC={x:250,y:96,w:1420,band:104,head:52,dh:124,first:0,days:31};
const ee_mcXY=(r,c)=>[EE_MC.x+c*EE_MC.w/7,EE_MC.y+EE_MC.band+EE_MC.head+r*EE_MC.dh];
function ee_paintMeiCal(ctx){const C=EE_MC,dw=C.w/7,top=C.y+C.band+C.head;ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);
  wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV_ROOM.reg,{kind:"plaster",line:false,seed:44});gv_lightGlow(ctx,900,-60,820);
  ctx.save();ctx.filter="blur(10px)";ctx.fillStyle="rgba(60,70,90,0.22)";ctx.fillRect(C.x+10,C.y+16,C.w,top+5*C.dh+20-C.y);ctx.restore();
  wc_flat(ctx,wc_rect(C.x,C.y,C.w,top+5*C.dh+20-C.y),GV.paper,1,"page");wc_flat(ctx,wc_rect(C.x,C.y,C.w,C.band),[96,118,150],1,"band");
  wc_flat(ctx,wc_rect(C.x+5*dw,top,2*dw,5*C.dh),[238,236,230],0.9,"weekend");
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.3);ctx.lineWidth=1.6;for(let r=0;r<=5;r++){ctx.beginPath();ctx.moveTo(C.x,top+r*C.dh);ctx.lineTo(C.x+C.w,top+r*C.dh);ctx.stroke();}
  for(let c=1;c<7;c++){ctx.beginPath();ctx.moveTo(C.x+c*dw,top);ctx.lineTo(C.x+c*dw,top+5*C.dh);ctx.stroke();}ctx.restore();gv_pin(ctx,C.x+C.w/2,C.y-4,GV.red,1.6);}
function ee_meiCal(ctx,p){const C=EE_MC,dw=C.w/7;wc_T(ctx,"March 2027",C.x+40,C.y+70,{w:900,size:48,col:[255,255,255]});
  ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach((d,c)=>wc_T(ctx,d,C.x+c*dw+18,C.y+C.band+38,{w:300,size:28,col:WC_MUTED}));
  for(let d=1;d<=C.days;d++){const i=C.first+d-1,[x,y]=ee_mcXY(Math.floor(i/7),i%7);wc_T(ctx,String(d),x+16,y+38,{w:200,size:30,col:i%7>4?WC_MUTED:WC_DARK});}
  const block=(d,s,u,seed)=>{if(u<=0)return;const i=C.first+d-1,[x,y]=ee_mcXY(Math.floor(i/7),i%7),bx=x+8,by=y+52,bw=dw-16,bh=60;ctx.save();ctx.beginPath();ctx.rect(bx-8,by-8,(bw+16)*easeCam(clamp(u*1.4,0,1)),bh+16);ctx.clip();
    wc_panel(ctx,bx,by,bw,bh,{kind:"card",wash:GV.gold,washA:0.6,seed});ctx.restore();withA(ctx,clamp(u*2-0.8,0,1),()=>wc_T(ctx,s,bx+bw/2,by+41,{w:600,size:28,align:"center",col:GV.goldInk}));};
  [2,9,16,23,30].forEach((d,k)=>block(d,"owner · 2 h",1,180+k));[4,11,18,25].forEach((d,k)=>block(d,"steward · 2 h",p(k),186+k));}
// Mei's screen, at her desk: her own work, lines of it (Who decides' wd_meiWork)
function ee_meiWork(ctx){const [x,y,w,h]=GV_RX.screen;gv_screen(ctx,x,y,w,h,"Student records",q=>gv_lines(q,x+30,y+92,w-80,6,38,0.9),{titleSize:28});}

/* ---------- the glossary, run as a product ---------- */
// the glossary's own product card, as A product with an owner printed its cards (po_card): its title, what it is, then each field's name,
// printed, and what's written on it in pen. Every line is there, faint, until it's said: then it's lit (o.seg(i, j, k), 0 to 1: the k-th
// piece of line j of field i, as each is named) and its field glows gold for a moment (o.band(i)).
// EE_PC: where it hangs on the board, and its layout; EE_PCL: each field, its lines, each line's pieces
const EE_PC={x:460,y:150,w:1000,h:600,lx:48,vx:300,y0:226,lh:40,gap:20,size:28};
const EE_PCL=[["owner",[["Yusuf Demir, data governance"]]],["users",[["people"," · reports"],["tables that link to it"," · agents"]]],
  ["promise",[["every term has an owner,"," a definition,"],["an example"," and a status"],["a change"," decided within 10 working days"]]],
  ["ask",[["data.governance@uni.example"]]]];
const EE_PCY=(()=>{const P=EE_PC;let y=P.y0;return EE_PCL.map(([,v])=>{const ys=v.map((_,j)=>y+j*P.lh);y+=v.length*P.lh+P.gap;return ys;});})();
function ee_productCard(ctx,o){o=o||{};const P=EE_PC,{x,y}=P;
  ctx.drawImage(wc_kept("eeCard",P.w+40,P.h+40,q=>{q.save();q.filter="blur(8px)";q.fillStyle="rgba(60,44,30,0.26)";q.fillRect(28,34,P.w,P.h);q.restore();
    wc_wash(q,wc_rrPts(20,20,P.w,P.h,12),WC_CARD,{kind:"page",lw:1.4,seed:437});q.fillStyle=rgba(WC_MUTED,0.45);q.fillRect(20+P.lx,20+156,P.w-2*P.lx,3);
    q.fillStyle=rgba(WC_MUTED,0.12);EE_PCY.forEach(ys=>ys.forEach(yy=>q.fillRect(20+P.vx,20+yy+10,P.w-P.vx-P.lx,2)));}),x-20,y-20);
  [[x+40,y+22],[x+P.w-40,y+22]].forEach(([px,py])=>gv_pin(ctx,px,py,GV.red,1.3));
  wc_T(ctx,"The glossary",x+P.lx,y+90,{w:800,size:46,col:WC_DARK});wc_T(ctx,"product",x+P.lx,y+134,{w:600,size:30,col:WC_MUTED});
  EE_PCL.forEach(([l,v],i)=>{const b=o.band?clamp(o.band(i),0,1):0,ys=EE_PCY[i];
    if(b>0.01)gv_tint(ctx,x+P.lx-14,y+ys[0]-32,P.w-2*P.lx+28,ys[ys.length-1]-ys[0]+48,GV.gold,0.75*b);
    wc_T(ctx,l,x+P.lx,y+ys[0],{w:700,size:P.size,col:WC_MUTED});
    v.forEach((parts,j)=>{let px=x+P.vx;parts.forEach((s,k)=>{const a=o.seg?clamp(o.seg(i,j,k),0,1):1;
      wc_hand(ctx,s,px,y+ys[j],{size:P.size,w:600,col:GV_SIGN.ink,a:lerp(0.28,1,a)});px+=tw(ctx,s,P.size,600);});});});}
// the card, small, on the board in Yusuf's office, where the old chart was (u, 0 to 1: it springs on); its words are part of the picture
function ee_cardSmall(ctx,u){if(u<=0.01)return;const k=0.3,cx=860,cy=430;ee_land(ctx,u,cx,cy,()=>{ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);
  ctx.translate(-(EE_PC.x+EE_PC.w/2),-(EE_PC.y+EE_PC.h/2));const p=PH_OFF;PH_OFF=1;try{ee_productCard(ctx,{});}finally{PH_OFF=p;}ctx.restore();});}
// the glossary's page of what changed this week, on Clara's screen (the screen close, GV_SC): the week, then each change: the term, what
// changed, and when and by whom (o.row(i), 0 to 1, as each comes in); the first, completion, lit gold (o.lit)
const EE_WK=[["completion","new","decided 21 January · by the registrar"],["enrolment","example added","19 January"],["census date","owner confirmed","20 January"]];
function ee_weekPage(ctx,o){o=o||{};const [x,y,w,h]=GV_SC;gv_screen(ctx,x,y,w,h,"What changed this week",q=>{
  wc_T(q,"week of 18 January",x+40,y+128,{w:600,size:30,col:WC_MUTED});q.fillStyle=rgba(WC_MUTED,0.3);q.fillRect(x+40,y+156,w-80,2);
  const li=clamp(o.lit||0,0,1);EE_WK.forEach((r,i)=>{const a=clamp(o.row?o.row(i):1,0,1);if(a<=0.01)return;const yb=y+254+i*112;withA(q,a,()=>{
    if(i===0&&li>0.01)gv_tint(q,x+24,yb-52,w-48,80,GV.gold,0.8*li);wc_T(q,r[0],x+40,yb,{w:800,size:34,col:WC_DARK});
    if(i===0)wc_tag(q,x+340,yb-12,r[1],Object.assign({size:30},EE_GOLDTAG));else wc_T(q,r[1],x+340,yb,{w:600,size:30,col:WC_INK});
    wc_T(q,r[2],x+620,yb,{w:600,size:30,col:WC_MUTED});});});},{barH:64,titleSize:36});}
// who reads each term this year, on Yusuf's screen: the terms read most, with how many read each (people, reports, the assistant); and the
// nine nobody read, each with its 0 (o.left(i), o.right(i), 0 to 1, as each comes in)
const EE_TOP=[["completion","214"],["award","187"],["learner","166"],["enrolment","143"],["census date","120"]];
const EE_NINE=[["fax number","Admissions"],["telex number","Admissions"],["microfiche reference","Library"],["old faculty code","Registrar's office"],
  ["legacy module code","Registrar's office"],["paper enrolment form","Student services"],["printed prospectus code","Marketing"],["pager number","Estates"],
  ["second campus code","Estates"]];
function ee_readers(ctx,o){o=o||{};const C=EE_CW,L=C.x+44,R=C.x+590,top=C.y+C.bar+70;gv_screen(ctx,C.x,C.y,C.w,C.h,"The glossary · readers this year",null,{barH:C.bar,titleSize:36});
  wc_T(ctx,"read most",L,top,{w:700,size:28,col:WC_MUTED});wc_T(ctx,"read by nobody",R,top,{w:700,size:28,col:GV.redInk});
  EE_TOP.forEach(([n,v],i)=>{const a=clamp(o.left?o.left(i):1,0,1);if(a<=0.01)return;const yb=top+56+i*50;
    withA(ctx,a,()=>{wc_T(ctx,n,L,yb,{w:700,size:30,col:WC_DARK});wc_T(ctx,v,L+430,yb,{w:700,size:30,align:"right",col:WC_INK});});});
  const lg=clamp(o.left?o.left(5):1,0,1);if(lg>0.01)withA(ctx,lg,()=>wc_T(ctx,"readers: people, reports, the assistant",L,top+56+5*50+14,{w:600,size:28,col:WC_MUTED}));
  EE_NINE.forEach(([n],i)=>{const a=clamp(o.right?o.right(i):1,0,1);if(a<=0.01)return;const yb=top+50+i*44;
    withA(ctx,a,()=>{wc_T(ctx,n,R,yb,{w:600,size:28,col:WC_INK});wc_T(ctx,"0",R+500,yb,{w:800,size:28,align:"right",col:GV.redInk});});});}
// the nine, each on a pale card on Yusuf's desk (the place desk), dealt in (o.card(i), 0 to 1); each sent to its owner and back with the
// owner's yes in their own hand, and a tick (o.yes(i), 0 to 1)
const ee_rcXY=i=>[510+(i%3)*450,236+Math.floor(i/3)*236];
function ee_retireCards(ctx,o){o=o||{};EE_NINE.forEach(([n,own],i)=>{const u=clamp(o.card?o.card(i):1,0,1);if(u<=0.01)return;const [cx,cy]=ee_rcXY(i),w=420,h=196,rot=((i*37)%7-3)*0.008,
    y_=clamp(o.yes?o.yes(i):0,0,1),k=1+0.04*Math.sin(Math.PI*clamp(y_*1.4,0,1));
  ee_land(ctx,u,cx,cy,()=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.scale(k,k);ctx.fillStyle="rgba(60,44,30,0.22)";ctx.fillRect(-w/2+8,-h/2+10,w,h);
    wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",wash:GV.grey,washA:0.22,seed:700+i});
    wc_T(ctx,n,-w/2+28,-h/2+52,{w:800,size:30,col:WC_DARK});wc_T(ctx,"owner: "+own,-w/2+28,-h/2+94,{w:600,size:28,col:WC_MUTED});
    if(y_>0.01){wc_hand(ctx,"yes, retire it",-w/2+28,-h/2+152,{size:30,w:600,col:GV_SIGN.ink,p:y_});wc_tick(ctx,w/2-48,-h/2+146,26,GV.goldInk,clamp(y_*1.6-0.6,0,1),4.5);}
    ctx.restore();});});}
// the nine cards in a stack, held in both hands
function ee_heldStack(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;for(let i=0;i<5;i++){cx.save();cx.translate(mx+i*2,my-14-i*3);cx.rotate(-0.06+i*0.02);
  cx.fillStyle=rgba(mix(GV.grey,[255,255,255],0.55),1);cx.fillRect(-46,-20,92,44);cx.strokeStyle=rgba(WC_PENCIL,0.35);cx.lineWidth=1;cx.strokeRect(-46,-20,92,44);cx.restore();}
  fingers(cx,P_,[l,r]);}
// the phone at the bus stop, today: the dictionary's list of what's new, its title, its entries as lines (too small to read), one lit gold
function ee_phoneNew(ctx,cx,cy,u){if(u<=0.01)return;const k=0.85+0.15*spring(clamp(u,0,1)),w=300,h=520;ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);withA(ctx,clamp(u*2,0,1),()=>{
  ctx.fillStyle="rgba(30,30,40,0.25)";rr(ctx,-w/2+10,-h/2+12,w,h,36);ctx.fill();ctx.fillStyle=rgba([40,42,50],1);rr(ctx,-w/2,-h/2,w,h,36);ctx.fill();
  ctx.fillStyle=rgba([252,252,248],1);rr(ctx,-w/2+14,-h/2+40,w-28,h-80,10);ctx.fill();
  wc_T(ctx,"what's new",-w/2+36,-h/2+100,{w:800,size:32,col:WC_DARK});ctx.fillStyle=rgba(WC_PENCIL,0.35);ctx.fillRect(-w/2+36,-h/2+118,w-72,2);ctx.lineCap="round";
  for(let i=0;i<8;i++){const y=-h/2+160+i*36,hi=i===3;if(hi){ctx.save();ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba(wc_lit(GV.gold,0.4),0.85);ctx.fillRect(-w/2+26,y-16,w-52,30);ctx.restore();}
    ctx.strokeStyle=rgba(hi?GV.goldInk:[40,46,80],0.8);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-w/2+40,y);ctx.lineTo(-w/2+100+((i*37)%50),y);ctx.stroke();
    ctx.strokeStyle=rgba(WC_MUTED,0.5);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-w/2+120+((i*37)%50),y);ctx.lineTo(w/2-40-((i*53)%60),y);ctx.stroke();}});ctx.restore();}
// the week's list on every screen on the floor: each office's screen lights with it (a(i), 0 to 1): a page with a gold band
function ee_floorScreens(ctx,a){const F=GV_FL;F.rooms.forEach((r,i)=>{const u=clamp(a(i),0,1);if(u<=0.01)return;const x=F.x(i),dx=i%2?x+20:x+F.w-190,sx=dx+56,sy=F.inner-206;
  withA(ctx,u,()=>{ctx.fillStyle=rgba([252,252,248],1);ctx.fillRect(sx,sy,80,50);ctx.fillStyle=rgba(GV.gold,0.95);ctx.fillRect(sx,sy,80,10);ctx.fillStyle=rgba(WC_MUTED,0.6);
    for(let l=0;l<3;l++)ctx.fillRect(sx+8,sy+18+l*10,l===0?56:44,4);ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,sx+40,sy+25,70,[255,214,140],0.6*u);ctx.restore();});});}

/* ---------- 8 · where it is ---------- */
// Clara's request on her screen (the screen close, GV_SC): what she asked, and the service it went to, with its promise; its six steps
// as dots on a line, each lit gold as it's done, with its date (o.dot(i), 0 to 1); under them, the days from her request to the
// decision (o.days, 0 to 1, brings them in), each working day ticked (o.tick(k), the k-th), and how many (o.n)
const EE_TRK={l:150,gap:192,lab:290,line:338,date:394,cell:452,cw:96,ch:84},EE_TDATE=["11 January","13 January","14 January","21 January","21 January","21 January"];
// 11 to 21 January 2027, a Monday to a Thursday: 0, the day she asked; 1, a working day; 2, the weekend
const EE_JAN=[[11,0],[12,1],[13,1],[14,1],[15,1],[16,2],[17,2],[18,1],[19,1],[20,1],[21,1]];
function ee_trackPage(ctx,o){o=o||{};const [x,y,w,h]=GV_SC,T=EE_TRK,dot=i=>clamp(o.dot?o.dot(i):1,0,1),X=i=>x+T.l+i*T.gap,ly=y+T.line;
  gv_screen(ctx,x,y,w,h,"My requests",q=>{
    wc_T(q,"Define: completion",x+50,y+140,{w:800,size:44,col:WC_DARK});wc_T(q,"Define or change a term · decided within 10 working days",x+50,y+188,{w:600,size:30,col:WC_MUTED});
    q.fillStyle=rgba(WC_MUTED,0.28);q.fillRect(X(0),ly-2,X(5)-X(0),4);
    // the gold line, as far as the last step done
    if(dot(0)>0.01){let e=X(0);for(let i=1;i<6;i++)e+=T.gap*easeCam(clamp(dot(i)*1.4,0,1));q.fillStyle=rgba(GV.gold,0.95);q.fillRect(X(0),ly-3,e-X(0),6);}
    for(let i=0;i<6;i++){const d=dot(i),cx=X(i);q.fillStyle=rgba([252,252,248],1);q.beginPath();q.arc(cx,ly,15,0,TAU);q.fill();q.strokeStyle=rgba(WC_MUTED,0.55);q.lineWidth=3;q.stroke();
      if(d>0.01){const k=0.6+0.4*spring(d);q.fillStyle=rgba(GV.gold,clamp(d*2,0,1));q.beginPath();q.arc(cx,ly,17*k,0,TAU);q.fill();}
      wc_T(q,EE_STEPS[i],cx,y+T.lab,{w:800,size:32,align:"center",col:d>0.5?WC_DARK:WC_MUTED});
      if(d>0.01)withA(q,clamp(d*2,0,1),()=>wc_T(q,EE_TDATE[i],cx,y+T.date,{w:600,size:28,align:"center",col:WC_INK}));}
    // the days: each a cell, the weekend grey; the day she asked ringed in gold; a tick on each working day after it
    const dy=clamp(o.days||0,0,1);if(dy<=0.01)return;const x0=x+(w-EE_JAN.length*T.cw)/2,top=y+T.cell;let m=0;
    EE_JAN.forEach(([d,kind],k)=>{const a=clamp(dy*1.6-k*0.06,0,1),cx=x0+k*T.cw+T.cw/2;if(kind===1)m++;const mk=m-1;if(a<=0.01)return;withA(q,a,()=>{
      q.fillStyle=rgba(kind===2?mix(GV.grey,[255,255,255],0.55):[255,255,252],1);q.fillRect(cx-T.cw/2+4,top,T.cw-8,T.ch);
      q.strokeStyle=rgba(kind===0?GV.goldInk:WC_PENCIL,kind===0?0.9:0.35);q.lineWidth=kind===0?4:1.5;q.strokeRect(cx-T.cw/2+4,top,T.cw-8,T.ch);
      wc_T(q,String(d),cx,top+40,{w:700,size:30,align:"center",col:kind===2?WC_MUTED:WC_DARK});
      if(kind===1){const tk=clamp(o.tick?o.tick(mk):1,0,1);if(tk>0.01)wc_tick(q,cx,top+64,24,GV.goldInk,tk,4);}});});
    withA(q,clamp(dy*2-1,0,1),()=>{wc_T(q,"asked",x0+T.cw/2,top+T.ch+40,{w:600,size:28,align:"center",col:WC_MUTED});
      wc_T(q,"decided",x0+(EE_JAN.length-0.5)*T.cw,top+T.ch+40,{w:600,size:28,align:"center",col:GV.goldInk});});
    const n=clamp(o.n||0,0,1);if(n>0.01){const k=0.9+0.1*spring(n);q.save();q.translate(x+w/2,top+T.ch+28);q.scale(k,k);
      withA(q,n,()=>wc_tag(q,0,0,"8 working days",Object.assign({align:"center",size:32},EE_GOLDTAG)));q.restore();}},{barH:64,titleSize:36});}
// the same page, small, on Planning's wall screen (inside its frame)
const EE_PLS=[GV_PL.screen[0]+20,GV_PL.screen[1]+20,GV_PL.screen[2]-40,GV_PL.screen[3]-40];
