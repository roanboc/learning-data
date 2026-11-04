/* ===== Memory: from one chat to the team: the lab's pieces =====
   What the lab shows, in the module's language (matte cards, pills, the agent's sphere in its oak ring), all prefixed tm_. Colour
   means what it means in every film of the module: violet the model and its sessions, blue structure (the team's memory, the lines
   agents read it by), orange data, green what is checked and agrees, amber a slip or a doubt.
     tm_agent(ctx, x, y, r, t, o)      an agent: the sphere in its oak ring, its light on the wall; o.label under it, o.core, o.think,
                                       o.busy (a light travelling the ring), o.ring (0 to 1, a ring round it in o.ringCol), o.a
     tm_session(ctx, x, y, w, h, o)    a session: a large pale card with a violet edge, SESSION and its date (o.sub); o.draw(ctx)
                                       draws inside it; o.k, o.a
     tm_rows(ctx, x, y, w, rows, t)    a session's lines, each appearing at its time: {at, who, text, col, pill, glow}; returns the
                                       last line's foot
     tm_notes(ctx, x, y, w, o)         the team's notes for agents, kept by hand: a pinned paper whose next line stays empty
     tm_week(ctx, x, y, o)             a busy week, its days filling (o.p)
     tm_clock(ctx, x, y, r, hh, mm, o) a clock; o.sweep draws the time passed round it
     tm_stamp(ctx, x, y, text, col, o) a rubber stamp's mark landing (o.p 0 to 1)
     tm_file(ctx, x, y, o)             the team's memory: an oak card file on the wall, TEAM MEMORY above it, its entries standing in
                                       it as index cards (o.cards [{title, ok, col, a, lift}]); returns where each card is
     tm_entry(ctx, x, y, w, o)         an entry pulled up out of the file: its fields, one per line; o.kind "proposed" (a dashed edge
                                       and a pen) or "entry"; o.stamp {text, col, p}; o.ghost (an amber dashed card: never kept)
     tm_link(ctx, ax, ay, bx, by, u, o) a dashed line from the team's memory to an agent, drawn on to u; o.col, o.stop (it stops
                                       short there, with a break), o.t (its dashes move along it)
     tm_sheet(ctx, x, y, w, o)         a file from outside the team: a spreadsheet whose row 4 is hidden (o.open shows it)
     tm_record(ctx, x, y, w, h, o)     a session's record: line after line, its sample rows masked; o.scroll, o.n (lines shown)
     tm_bars(ctx, x, y, w, o)          students by mode of study: two bars and the total (o.total, o.col)
   The team's memory and its entries are drawn the same way in the films after this one (the series' file team-memory.md). */

/* ---------------------------------------------------------------- the agent */
function tm_agent(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const R=r*1.9,core=o.core==null?0.7:o.core;
  ag_modelLight(ctx,x,y,r,core,o.floor);
  ag_ring(ctx,x,y,R,{p:1,from:-120,arrows:[-60,60,180],pulse:o.busy>0?{deg:(t*48+(o.ph||0)*90)%360-120,a:0.6*o.busy}:null});
  ag_model(ctx,x,y,r,{t:t+(o.ph||0),core,think:o.think||0});
  if(o.ring>0){ctx.strokeStyle=rgba(o.ringCol||AG.amber,0.9);ctx.lineWidth=Math.max(3.5,r*0.07);ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,R+16,-Math.PI/2,-Math.PI/2+TAU*clamp(o.ring,0,1));ctx.stroke();}
  if(o.label)ag_T(ctx,o.label,x,y+R+48,{w:700,size:28,align:"center",col:AG.label});
  ctx.restore();}

/* ---------------------------------------------------------------- sessions, and the notes kept by hand */
function tm_session(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,26,{edge:AG.violet,edgeA:0.35});
  ag_label(ctx,x+30,y+50,"Session",{col:AG.violet});if(o.sub)ag_T(ctx,o.sub,x+w-30,y+50,{w:600,size:28,align:"right",col:AG.mut});
  ctx.strokeStyle="rgba(60,50,40,0.1)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+72);ctx.lineTo(x+w-24,y+72);ctx.stroke();
  if(o.draw){ctx.save();ctx.beginPath();ctx.rect(x+4,y+74,w-8,h-78);ctx.clip();o.draw(ctx);ctx.restore();}ctx.restore();}
// a session's lines: who says it (a small kicker), then the words; a pill under a line (pill: {text, col, icon}); glow: a soft
// violet frame round the line (the lesson). Each appears at its time, sliding up a little; lines not yet shown take no room
const TM_WHO={jun:["Jun",AG.kick],clara:["Clara",AG.kick],mei:["Mei",AG.kick],agent:["Agent",AG.violet],lesson:["Lesson",AG.violet],why:["Why",AG.kick]};
function tm_rows(ctx,x,y,w,rows,t){let yy=y;for(const r of rows){if(t<r.at)break;const a=ag_in(t,r.at,0.4)*(r.out==null?1:1-ag_in(t,r.out,0.4))*(r.gone==null?1:1-ag_in(t,r.gone,0.3)),dy=(1-ag_eo((t-r.at)/0.5))*14;
    const sz=r.size||30,lines=r.text?ag_wrap(ctx,r.text,w-(r.glow?40:0),{w:600,size:sz}):[],hh=(r.who?36:0)+lines.length*(sz+10)+(r.pill?62:0)+(r.h||0),fold=r.gone==null?1:1-ag_in(t,r.gone,0.5);
    if(fold<=0.001)continue;
    if(a>0){ctx.save();ctx.globalAlpha*=a;ctx.translate(0,dy);
      if(r.glow){const ga=r.glow;ag_box(ctx,x-14,yy-8,w+28,hh+20,16,{edge:AG.violet,edgeA:0.6*ga,glow:AG.violet,glowA:0.5*ga});}
      let ly=yy;if(r.who){const W_=TM_WHO[r.who]||[r.who,AG.kick];ag_T(ctx,W_[0].toUpperCase(),x+(r.glow?6:0),ly+26,{w:700,size:28,ls:3,col:W_[1]});ly+=36;}
      for(const l of lines){ly+=sz+10;ag_T(ctx,l,x+(r.glow?6:0),ly-8,{w:600,size:sz,col:r.col||AG.ink});}
      if(r.pill){const pw=ag_tw(ctx,r.pill.text,{w:700,size:28})+(r.pill.icon?96:56);ag_pill(ctx,x+pw/2,ly+34,r.pill.text,{size:28,col:r.pill.col,icon:r.pill.icon});ly+=62;}
      if(r.draw)r.draw(ctx,x,ly,w);
      ctx.restore();}
    yy+=(hh+22)*clamp((t-r.at)/0.35,0,1)*fold;}
  return yy;}
// the team's notes for agents: a pinned paper with its older notes, and the next line empty, a pen waiting by it
function tm_notes(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=300;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y,lerp(0.6,1,o.k));
  ctx.translate(x+w/2,y);ctx.rotate(-0.015);ctx.translate(-x-w/2,-y);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=28;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=14;ctx.fillStyle="#F6F3EA";ctx.fillRect(x,y,w,h);ctx.restore();
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,"rgba(255,255,255,0.5)");g.addColorStop(1,"rgba(220,210,190,0.25)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  ag_soft(ctx,c=>c.arc(x+w/2,y+14,11,0,TAU),[70,74,82],[200,206,214],x+w/2+3,y+10,10,null);
  ag_T(ctx,"Team notes for agents",x+40,y+68,{w:700,size:32});
  ctx.fillStyle="rgba(86,92,100,0.22)";for(const [k,f] of [[0,0.62],[1,0.48],[2,0.56]])ctx.fillRect(x+40,y+102+k*26,(w-80)*f,9);
  // the next line: nobody stopped to write it
  ctx.strokeStyle="rgba(86,92,100,0.4)";ctx.lineWidth=2.5;ctx.setLineDash([3,9]);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+40,y+238);ctx.lineTo(x+w-40,y+238);ctx.stroke();ctx.setLineDash([]);
  const bob=Math.sin((o.t||0)*1.6)*4;ag_pen(ctx,x+66,y+206+bob,36,rgba(AG.mut,0.75));
  ctx.restore();}
// a busy week: Monday to Friday, each day filling with meetings (o.p 0 to 1); (x, y) its top left
function tm_week(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=380,h=200;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,18,{});ag_T(ctx,o.label||"A busy week",x+28,y+50,{w:700,size:30});
  const p=clamp(o.p==null?1:o.p,0,1);for(let i=0;i<5;i++){const bx=x+28+i*66,on=clamp(p*5-i,0,1);ctx.fillStyle="rgba(86,92,100,0.1)";rr(ctx,bx,y+74,56,100,10);ctx.fill();
    if(on>0){ctx.save();rr(ctx,bx,y+74,56,100,10);ctx.clip();ctx.fillStyle=rgba(AG.mut,0.42);for(let m=0;m<4;m++){const mh=14+((i*7+m*5)%3)*6,my=y+80+m*24;ctx.fillRect(bx+6,my,44*clamp(on*4-m,0,1),mh);}ctx.restore();}}
  ctx.restore();}
function tm_clock(ctx,x,y,r,hh,mm,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.5,1,o.k));
  ag_card(ctx,c=>c.arc(x,y,r,0,TAU),{x:x-r,y:y-r,w:2*r,h:2*r},{});
  ctx.strokeStyle="rgba(60,50,40,0.35)";ctx.lineWidth=2;for(let i=0;i<12;i++){const an=i/12*TAU;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.78,y+Math.sin(an)*r*0.78);ctx.lineTo(x+Math.cos(an)*r*0.88,y+Math.sin(an)*r*0.88);ctx.stroke();}
  if(o.from!=null){const a0=(o.from%12)/12*TAU-Math.PI/2,a1=((hh%12)+mm/60)/12*TAU-Math.PI/2;ctx.fillStyle=rgba(AG.mut,0.14);ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r*0.7,a0,Math.max(a0,a1));ctx.closePath();ctx.fill();}
  const ha=((hh%12)+mm/60)/12*TAU-Math.PI/2,ma=mm/60*TAU-Math.PI/2;ctx.strokeStyle=rgba(AG.ink,0.9);ctx.lineCap="round";
  ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ha)*r*0.48,y+Math.sin(ha)*r*0.48);ctx.stroke();
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(ma)*r*0.72,y+Math.sin(ma)*r*0.72);ctx.stroke();ctx.fillStyle=rgba(AG.ink,1);ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();
  ctx.restore();}
function tm_stamp(ctx,x,y,text,col,o){o=o||{};const p=clamp(o.p==null?1:o.p,0,1);if(p<=0)return;const s=lerp(1.5,1,ag_eo(p)),w=ag_tw(ctx,text,{w:800,size:34})+56,h=70;
  ctx.save();ctx.globalAlpha*=Math.min(1,p*1.6)*(o.a==null?1:o.a);ctx.translate(x,y);ctx.rotate(o.rot==null?-0.06:o.rot);ctx.scale(s,s);
  ctx.fillStyle="rgba(246,244,239,0.82)";rr(ctx,-w/2,-h/2,w,h,12);ctx.fill();
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=4;rr(ctx,-w/2,-h/2,w,h,12);ctx.stroke();ctx.lineWidth=1.5;rr(ctx,-w/2+7,-h/2+7,w-14,h-14,8);ctx.stroke();
  ag_T(ctx,text,0,12,{w:800,size:34,align:"center",col});ctx.restore();}

/* ---------------------------------------------------------------- the team's memory
   An oak card file on the marble wall: a shallow oak ledge, its entries standing on it as index cards, leaning a little, each
   with the first words of its lesson; an approved one carries a small green tick. TEAM MEMORY, in blue, above it: structure the
   agents read, outside any chat. (x, y) is the ledge's top left; o.w its width (by the cards); o.label false for none. */
const TM_CARD={w:260,h:132,gap:18};
function tm_file(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,cards=o.cards||[],n=Math.max(o.slots||cards.length,1),w=o.w||(n*(TM_CARD.w+TM_CARD.gap)+40),out=[];if(a<=0)return out;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y,lerp(0.6,1,o.k));
  if(o.label!==false)ag_label(ctx,x+6,y-TM_CARD.h-30,"Team memory",{col:AG.blue});
  ag_floorShadow(ctx,x+w/2+AG.sdx*2,y+30,w*0.52,16,0.2);
  // the cards, standing on the ledge
  cards.forEach((cd,i)=>{const ca=cd.a==null?1:cd.a;if(ca<=0)return;const si=cd.slot==null?i:cd.slot,cx=x+22+si*(TM_CARD.w+TM_CARD.gap),lift=cd.lift||0,cy=y-TM_CARD.h-lift,rot=(si%2?0.02:-0.018)+0.05*Math.min(1,lift/200);
    ctx.save();ctx.globalAlpha*=ca;ctx.translate(cx+TM_CARD.w/2,cy+TM_CARD.h);ctx.rotate(rot);ctx.translate(-TM_CARD.w/2,-TM_CARD.h);
    ag_box(ctx,0,0,TM_CARD.w,TM_CARD.h,12,{edge:cd.dashed?null:cd.col||null,edgeA:cd.col?0.85:null,glow:cd.glow?AG.blue:null,glowA:cd.glow||0});
    // a card that was never kept: a dashed edge in its colour
    if(cd.dashed){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(cd.col||AG.amber,0.85);ctx.lineWidth=2.4;rr(ctx,5,5,TM_CARD.w-10,TM_CARD.h-10,9);ctx.stroke();ctx.restore();}
    // its title in two lines at most, and its tick in the corner below them
    const ls=ag_wrap(ctx,cd.title,TM_CARD.w-36,{w:700,size:28}).slice(0,2);ls.forEach((l,k)=>ag_T(ctx,l,18,46+k*36,{w:700,size:28,col:cd.tc||AG.ink}));
    if(cd.ok)ag_tick(ctx,TM_CARD.w-32,TM_CARD.h-28,22,rgba(AG.green,1),4);
    ctx.restore();out.push({x:cx,y:cy,w:TM_CARD.w,h:TM_CARD.h,cx:cx+TM_CARD.w/2,cy:cy+TM_CARD.h/2});});
  // the ledge: oiled oak, its lit top and its front
  let g=ctx.createLinearGradient(0,y,0,y+12);g.addColorStop(0,rgba(mix(AG_OAK.base,[255,255,255],0.3),1));g.addColorStop(1,rgba(AG_OAK.base,1));ctx.fillStyle=g;ctx.fillRect(x,y-4,w,12);
  g=ctx.createLinearGradient(0,y+8,0,y+30);g.addColorStop(0,rgba(AG_OAK.base,1));g.addColorStop(1,rgba(AG_OAK.dark,1));ctx.fillStyle=g;rr(ctx,x,y+8,w,22,4);ctx.fill();
  ctx.fillStyle=rgba(AG_OAK.hi,0.8);ctx.fillRect(x+4,y-4,w-8,1.5);
  ctx.restore();return out;}
/* an entry: its fields one per line, the label quiet and the words under it. fields [[label, words, col], ...]; o.hl the index of
   a field to light (in its col, or amber); o.kind "proposed": a dashed muted edge, PROPOSED ENTRY and a pen; o.ghost: an amber
   dashed card, for a lesson that was never kept; o.stamp {text, col, p}; o.a, o.k; returns its box */
function tm_entry(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,f=o.fields||[],inner=w-56;
  const rows=f.map(r=>({r,lines:ag_wrap(ctx,r[1],inner,{w:600,size:30})})),h=28+48+rows.reduce((s,q)=>s+(q.r[0]?34:0)+q.lines.length*40+16,0)+10,bb={x,y,w,h};
  if(a<=0||o.measure)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  const prop=o.kind==="proposed",gh=!!o.ghost;
  ag_box(ctx,x,y,w,h,22,{edge:!prop&&!gh?(o.edge||AG.blue):null,edgeA:0.5});
  if(prop||gh){ctx.save();ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(gh?AG.amber:AG.mut,0.85);ctx.lineWidth=2.6;rr(ctx,x+5,y+5,w-10,h-10,18);ctx.stroke();ctx.restore();}
  const kick=o.kick||(prop?"Proposed entry":gh?"Never kept":"Entry"),kc=gh?AG.amber:prop?AG.mut:AG.blue;
  if(prop){ag_pen(ctx,x+42,y+44,30,rgba(AG.mut,1));ag_T(ctx,kick.toUpperCase(),x+68,y+52,{w:700,size:28,ls:4,col:kc});}
  else ag_T(ctx,kick.toUpperCase(),x+28,y+52,{w:700,size:28,ls:4,col:kc});
  let yy=y+76;rows.forEach((q,i)=>{const hl=o.hl===i?(o.hlA==null?1:o.hlA):0,ra=q.r[3]==null?1:q.r[3];if(ra<=0){yy+=(q.r[0]?34:0)+q.lines.length*40+16;return;}
    ctx.save();ctx.globalAlpha*=ra;
    if(hl>0){const hh=(q.r[0]?34:0)+q.lines.length*40+8;ctx.fillStyle=rgba(q.r[2]||AG.amber,0.1*hl);rr(ctx,x+14,yy-4,w-28,hh,10);ctx.fill();}
    if(q.r[0]){ag_T(ctx,q.r[0],x+28,yy+26,{w:700,size:28,col:AG.mut});yy+=34;}
    q.lines.forEach(l=>{yy+=40;ag_T(ctx,l,x+28,yy-8,{w:600,size:30,col:q.r[2]||AG.ink});});
    ctx.restore();yy+=16;});
  if(o.stamp&&o.stamp.p>0)tm_stamp(ctx,x+w-(o.stamp.dx||170),y+(o.stamp.dy||64),o.stamp.text,o.stamp.col,{p:o.stamp.p,rot:o.stamp.rot});
  ctx.restore();return bb;}
// a dashed line from the team's memory to an agent, bowing up a little, drawn on to u; its dashes move along it while o.t runs
function tm_link(ctx,ax,ay,bx,by,u,o){o=o||{};const a=o.a==null?1:o.a;u=clamp(u,0,1);if(a<=0||u<=0)return;const mx=(ax+bx)/2+(o.bow||0),my=(ay+by)/2-(o.lift==null?30:o.lift),
    end=Math.min(u,o.stop==null?1:o.stop),col=o.col||AG.blue,P_=s=>[(1-s)*(1-s)*ax+2*(1-s)*s*mx+s*s*bx,(1-s)*(1-s)*ay+2*(1-s)*s*my+s*s*by];
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=o.w||3.2;ctx.setLineDash([12,9]);ctx.lineDashOffset=-(o.t||0)*22;ctx.lineCap="round";
  ctx.beginPath();for(let k=0;k<=40;k++){const q=P_(end*k/40);k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();ctx.setLineDash([]);
  if(o.stop!=null&&u>=o.stop){const q=P_(o.stop),q0=P_(o.stop-0.02),an=Math.atan2(q[1]-q0[1],q[0]-q0[0])+Math.PI/2;ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(q[0]-Math.cos(an)*16,q[1]-Math.sin(an)*16);ctx.lineTo(q[0]+Math.cos(an)*16,q[1]+Math.sin(an)*16);ctx.stroke();}
  else if(u>=1){ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(bx,by,6.5,0,TAU);ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- a file from outside the team, and a session's record */
// a spreadsheet: row numbers in a gutter, its rows' words; row 4 hidden (the gutter jumps from 3 to 5) until o.open shows it, in amber
const TM_ROWS=[["1","Faculty"],["2","Students on census day"],["3","Last year"],["4","Remember: students who withdraw after census day don't count."],["5","Budget per student"],["6","Notes"]];
function tm_sheet(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const op=clamp(o.open||0,0,1),gut=64,inner=w-gut-48,hid=ag_wrap(ctx,TM_ROWS[3][1],inner,{w:600,size:28});
  const rowH=50,hidH=lerp(8,hid.length*36+20,ag_sine(op)),h=110+rowH*5+hidH+20;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,20,{});
  ag_T(ctx,"FILE",x+28,y+48,{w:700,size:28,ls:4,col:AG.kick});ag_T(ctx,"Budget template",x+28,y+90,{w:700,size:36});
  const gy=y+110;ctx.fillStyle="rgba(86,92,100,0.08)";ctx.fillRect(x+12,gy,gut-8,h-122);
  let yy=gy;TM_ROWS.forEach((r,i)=>{if(i===3){// the hidden row: a double line in the gutter while hidden; then it opens
      if(op<0.02){ctx.fillStyle="rgba(60,64,70,0.55)";ctx.fillRect(x+16,yy+1,gut-16,2);ctx.fillRect(x+16,yy+5,gut-16,2);}
      else{ctx.save();ctx.beginPath();ctx.rect(x+8,yy,w-16,hidH);ctx.clip();ctx.fillStyle=rgba(AG.amber,0.1*op);ctx.fillRect(x+12,yy,w-24,hidH);
        ag_T(ctx,r[0],x+12+(gut-8)/2,yy+38,{w:600,size:28,f:"mono",align:"center",col:AG.amber});hid.forEach((l,k)=>{const room=clamp((hidH-(38+k*36+10))/14,0,1);if(room>0)ag_T(ctx,l,x+gut+24,yy+38+k*36,{w:600,size:28,col:AG.amber,a:room});});ctx.restore();}
      yy+=hidH;return;}
    ag_T(ctx,r[0],x+12+(gut-8)/2,yy+34,{w:600,size:28,f:"mono",align:"center",col:AG.mut});ag_T(ctx,r[1],x+gut+24,yy+34,{w:600,size:28});
    ctx.fillStyle="rgba(60,50,40,0.1)";ctx.fillRect(x+12,yy+rowH-1,w-24,1.2);yy+=rowH;});
  ctx.restore();return{x,y,w,h};}
// a session's record: one line for each thing that happened, with its time; the sample rows masked; long, so it scrolls (o.scroll px)
const TM_LOG=[["09:12","Jun asked: students on census day?"],["09:12","Read the student table"],["09:13","Ran a query"],["09:13","Sample rows:"],["","mask","Arts · withdrew 9 May"],
  ["","mask","Health · withdrew 21 May"],["","mask","Business · withdrew 2 June"],["09:14","Answered: 18,375"],["09:20","Jun: Mei says they count"],["09:21","Counted again: 18,412"],
  ["09:22","Jun: thank you"],["09:23","Read the census report"],["09:24","Ran the reconciliation"],["09:26","Sample rows:"],["","mask","Arts · withdrew 30 April"],["","mask","Engineering · withdrew 12 May"]];
function tm_record(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,24,{edge:AG.violet,edgeA:0.3});ag_label(ctx,x+28,y+50,"Session record",{col:AG.violet});ag_T(ctx,o.sub||"14 April",x+w-28,y+50,{w:600,size:28,align:"right",col:AG.mut});
  ctx.save();ctx.beginPath();ctx.rect(x+6,y+74,w-12,h-80);ctx.clip();const n=o.n==null?TM_LOG.length:o.n,sc=o.scroll||0;
  for(let i=0;i<Math.min(n+1,TM_LOG.length);i++){const L=TM_LOG[i],la=clamp(n-i,0,1),ly=y+118+i*46-sc;if(la<=0||ly<y+60||ly>y+h+40)continue;ctx.save();ctx.globalAlpha*=la;
    if(L[1]==="mask"){ctx.fillStyle="rgba(60,64,70,0.5)";rr(ctx,x+132,ly-24,150,28,6);ctx.fill();ag_T(ctx,L[2],x+300,ly,{w:500,size:28,col:AG.mut});}
    else{ag_T(ctx,L[0],x+28,ly,{w:500,size:28,f:"mono",col:AG.mut});ag_T(ctx,L[1],x+132,ly,{w:600,size:28});}ctx.restore();}
  ctx.restore();
  // a soft fade where lines scroll up under the heading, and one at the foot: there's more below
  let g0=ctx.createLinearGradient(0,y+74,0,y+112);g0.addColorStop(0,"rgba(236,233,228,1)");g0.addColorStop(1,"rgba(236,233,228,0)");ctx.fillStyle=g0;ctx.fillRect(x+6,y+74,w-12,38);
  const g=ctx.createLinearGradient(0,y+h-90,0,y+h-6);g.addColorStop(0,"rgba(232,229,223,0)");g.addColorStop(1,"rgba(232,229,223,0.95)");ctx.fillStyle=g;rr(ctx,x+3,y+h-90,w-6,87,20);ctx.fill();
  ctx.restore();}
// students by mode of study: two bars of data and the total under them; o.p grows the bars, o.total, o.col (the total's colour)
function tm_bars(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const p=ag_eo(clamp(o.p==null?1:o.p,0,1));ctx.save();ctx.globalAlpha*=a;
  [["Full-time",0.78],["Part-time",0.22]].forEach((b,i)=>{const yy=y+i*58;ag_T(ctx,b[0],x,yy+30,{w:600,size:28,col:AG.mut});
    ctx.fillStyle=rgba(AG.orange,0.85);rr(ctx,x+170,yy+6,Math.max(8,(w-180)*b[1]*p),32,8);ctx.fill();});
  if(o.total){ag_T(ctx,"Total",x,y+160,{w:600,size:28,col:AG.mut});ag_T(ctx,o.total,x+170,y+162,{w:800,size:36,col:o.col||AG.ink});}
  ctx.restore();}
