/* ===== Context and memory, governed: the team's memory =====
   Drawn as Memory: from one chat to the team draws it (its code and its thread's note, team-memory.md, as built on 4 November 2026):
   the team's memory is an oak card file on the marble wall, TEAM MEMORY above it in the module's blue; each entry an off-white index
   card standing on an oak ledge, its short title in two lines at most, a small green tick at its bottom right once a person approved it.
   This film's file has two ledges, three cards to a ledge. An entry pulled up shows its fields, one a line, the label over the words:
   Lesson, Learned in, Confirmed by, Approved by and History; this film adds Check again. A proposed entry waits outside the file with a
   dashed edge and a small pen; "Approved" lands on it in green, "Turned down" in amber. A session is a large pale card with a violet
   edge, SESSION and its date at the right.
   On the platform the memory is kept in stores (Lakebase, the platform's database): a store is a box with its entries in it.
     cm_file(ctx, x, y, o)          the card file: (x, y) the middle of the lower ledge's top; o.cards [{text, tick, who, whoA, glow, glowA,
                                    lift, a, slot, strike, dashed}], o.lock; returns each card's box
     cm_card(ctx, x, y, card, rot)  one standing card
     cm_index(ctx, x, y, w, h, o)   a flat index strip: o.text, o.tick, o.who, o.glow, o.a (the skills on the platform)
     cm_entry(ctx, x, y, w, e, o)   an entry pulled up: e.lesson, e.rows [[label, words, a, col], ...]; o.kind "proposed"; returns its box
     cm_stamp(ctx, x, y, text, t, t0, o)  a stamp landing at t0: o.col (green: approved; amber: turned down or deleted), o.rot, o.size
     cm_session(ctx, x, y, w, h, o) a session: o.date, o.lines (what was said, as quiet bars or words), o.a
     cm_store(ctx, x, y, w, h, o)   a store: o.kick, o.title, o.rows (entries, each {text, a, col, dashed}), o.edge, o.lock (read only),
                                    o.dashed (only proposals), o.a
     cm_step(ctx, x, y, o)          the platform's daily memory step: a violet card with a clock, "Memory step", "once a day · beta"
     cm_script(ctx, x, y, title, sub, o)  a plain script, no model: a blue card with a gear
     cm_arrow(ctx, p, u, o)         an arrow along a cubic curve p [x0,y0, x1,y1, x2,y2, x3,y3], drawn to u; o.col, o.dash, o.lw, o.a
     cm_reads(ctx, x0, y0, x1, y1, u, o)  the dashed blue line an agent reads along, from the file to the agent */

const CM_CARD={base:"#F4F1EA",top:"#F8F6F1",bot:"#EEEAE1",edge:"rgba(70,58,44,0.16)",rule:"rgba(110,100,88,0.16)"};
function cm_index(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.16)";ctx.shadowBlur=14;ctx.shadowOffsetX=AG.sdx*0.5;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,8);ctx.fillStyle=CM_CARD.base;ctx.fill();ctx.restore();
  const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,CM_CARD.top);g.addColorStop(1,CM_CARD.bot);ctx.fillStyle=g;rr(ctx,x,y,w,h,8);ctx.fill();
  if(o.glow){ctx.save();ctx.shadowColor=rgba(o.glow,0.55*(o.glowA==null?1:o.glowA));ctx.shadowBlur=22;ctx.strokeStyle=rgba(o.glow,0.85*(o.glowA==null?1:o.glowA));ctx.lineWidth=2.6;rr(ctx,x,y,w,h,8);ctx.stroke();ctx.restore();}
  else{ctx.strokeStyle=CM_CARD.edge;ctx.lineWidth=1.2;rr(ctx,x,y,w,h,8);ctx.stroke();}
  ctx.strokeStyle="rgba(255,255,255,0.8)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+8,y+1.2);ctx.lineTo(x+w-8,y+1.2);ctx.stroke();
  // the faint rule under the top line, as an index card has
  ctx.strokeStyle=CM_CARD.rule;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x+14,y+46);ctx.lineTo(x+w-14,y+46);ctx.stroke();
  if(o.alt&&o.altA>0)ag_T(ctx,o.alt,x+20,y+33,{w:600,size:28,col:AG.ink,a:o.altA});
  if(o.text){const wa=(o.textA==null?1:o.textA)*(o.alt?1-(o.altA||0):1);ag_T(ctx,o.text,x+20,y+33,{w:600,size:28,col:o.strike?AG.mut:AG.ink,a:wa});
    if(o.strike){const tw=ag_tw(ctx,o.text,{w:600,size:28});ctx.strokeStyle=rgba(AG.amber,0.85*o.strike);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+18,y+23);ctx.lineTo(x+22+tw*o.strike,y+23);ctx.stroke();}}
  if(o.who)ag_T(ctx,o.who,x+w-(o.tick!=null?58:20),y+33,{w:600,size:28,col:AG.mut,align:"right",a:o.whoA==null?1:o.whoA});
  if(o.tick>0){ctx.save();ctx.globalAlpha*=clamp(o.tick,0,1);ag_tick(ctx,x+w-30,y+24,22,rgba(AG.green,1),3.6);ctx.restore();}
  ctx.restore();}

/* the team's memory, as Memory: from one chat to the team draws it (its tm_file, tm_entry and tm_stamp, copied here with this film's
   prefix): an oiled-oak ledge on the marble wall, each entry an index card standing on it, 260 by 132, every other one tilted a hair the
   other way, its title in two lines at most and, once a person approved it, a small green tick at its bottom right; TEAM MEMORY above,
   in the module's blue. Months on, the memory fills two ledges, three cards to a ledge, the second under the first. */
const CM_TC={w:260,h:132,gap:18,per:3,row:226};
// where a card stands: slot k (fractional while a card moves along), in a file whose lower ledge's top middle is (x, y)
function cm_slotXY(x,y,s){const per=CM_TC.per,W=per*(CM_TC.w+CM_TC.gap)+40,x0=x-W/2,P=k=>{const r=Math.floor(k/per),c=k%per;return[x0+22+c*(CM_TC.w+CM_TC.gap),y-(1-r)*CM_TC.row];};
  const k=Math.floor(s+1e-6),f=s-k;if(f<0.002)return P(k);const p=P(k),q=P(k+1),e=ag_sine(f);return[lerp(p[0],q[0],e),lerp(p[1],q[1],e)];}
// one standing card: its title, its tick, a glow in o.glow's colour, struck through in amber (o.strike 0..1), a dashed edge (o.dashed)
function cm_card(ctx,x,y,cd,rot){const W=CM_TC.w,H=CM_TC.h,ga=cd.glowA==null?1:cd.glowA;ctx.save();ctx.translate(x+W/2,y+H);ctx.rotate(rot||0);ctx.translate(-W/2,-H);
  ag_box(ctx,0,0,W,H,12,{edge:cd.glow&&ga>0?cd.glow:null,edgeA:0.85*ga,glow:cd.glow&&ga>0?cd.glow:null,glowA:ga});
  if(cd.dashed){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(cd.dashCol||AG.amber,0.85);ctx.lineWidth=2.4;rr(ctx,5,5,W-10,H-10,9);ctx.stroke();ctx.restore();}
  // its title; while o.altA rises, o.alt takes its place (the merge rewriting it)
  const altA=cd.alt?clamp(cd.altA||0,0,1):0,ls=ag_wrap(ctx,cd.text,W-36,{w:700,size:28}).slice(0,2),ta=(cd.textA==null?1:cd.textA)*(1-altA);
  if(altA>0)ag_wrap(ctx,cd.alt,W-36,{w:700,size:28}).slice(0,2).forEach((l,k)=>ag_T(ctx,l,18,46+k*36,{w:700,size:28,col:cd.tc||AG.ink,a:altA}));
  ls.forEach((l,k)=>{if(ta>0)ag_T(ctx,l,18,46+k*36,{w:700,size:28,col:cd.tc||AG.ink,a:ta});
    if(cd.strike>0){const tw=ag_tw(ctx,l,{w:700,size:28}),u=clamp(cd.strike*ls.length-k,0,1);if(u>0){ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=3;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(16,46+k*36-9);ctx.lineTo(16+(tw+4)*u,46+k*36-9);ctx.stroke();}}});
  if(cd.tick>0){ctx.save();ctx.globalAlpha*=clamp(cd.tick,0,1);ag_tick(ctx,W-32,H-28,22,rgba(AG.green,1),4);ctx.restore();}
  ctx.restore();}
/* the card file. (x, y): the middle of the lower ledge's top. o.cards [{text, tick, who, whoA, glow, glowA, lift, a, slot, strike,
   dashed, textA}]: a card's slot is its place, in order unless given; lift (px) raises it out, tilting; who, the approver's name, goes under
   it, on the wall. o.label (false for none), o.lock and o.lockText (a padlock and "read only" beside the label), o.a, o.k. Returns each
   card's box ({x, y, w, h, cx, cy}). */
function cm_file(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,cards=o.cards||[],per=CM_TC.per,W=per*(CM_TC.w+CM_TC.gap)+40,x0=x-W/2,out=[];
  cards.forEach((cd,i)=>{const s=cd.slot==null?i:cd.slot,p=cm_slotXY(x,y,s),lift=cd.lift||0;out.push({x:p[0],y:p[1]-CM_TC.h-lift,w:CM_TC.w,h:CM_TC.h,cx:p[0]+CM_TC.w/2,cy:p[1]-CM_TC.h/2-lift,ledge:p[1]});});
  if(a<=0)return out;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y-CM_TC.row/2,lerp(0.6,1,o.k));
  const topY=y-CM_TC.row;
  if(o.label!==false){const lt=o.label||"Team memory",ly=topY-CM_TC.h-30;ag_label(ctx,x0+6,ly,lt,{col:AG.blue,a:o.labelA==null?1:o.labelA});
    if(o.lock>0){const lx=x0+6+ag_tw(ctx,lt.toUpperCase(),{w:700,size:28,ls:4})+40;ctx.save();ctx.globalAlpha*=o.lock;ag_lock(ctx,lx,ly-6,26,rgba(AG.blue,1));
      ag_T(ctx,o.lockText||"read only",lx+26,ly,{w:600,size:28,col:AG.blue});ctx.restore();}}
  // the two ledges: oiled oak, a lit top 12 px deep and a front 22 px tall, a soft shadow under each
  for(const ly of [topY,y]){ag_floorShadow(ctx,x+AG.sdx*2,ly+30,W*0.52,16,0.2);
    let g=ctx.createLinearGradient(0,ly,0,ly+12);g.addColorStop(0,rgba(mix(AG_OAK.base,[255,255,255],0.3),1));g.addColorStop(1,rgba(AG_OAK.base,1));ctx.fillStyle=g;ctx.fillRect(x0,ly-4,W,12);
    g=ctx.createLinearGradient(0,ly+8,0,ly+30);g.addColorStop(0,rgba(AG_OAK.base,1));g.addColorStop(1,rgba(AG_OAK.dark,1));ctx.fillStyle=g;rr(ctx,x0,ly+8,W,22,4);ctx.fill();
    ctx.fillStyle=rgba(AG_OAK.hi,0.8);ctx.fillRect(x0+4,ly-4,W-8,1.5);}
  // the cards, standing on them; a lifted one tilts a little as it comes out, and one moving along takes the next slot's lean as it goes
  const lean=k=>k%2?0.02:-0.018;
  cards.forEach((cd,i)=>{const ca=cd.a==null?1:cd.a;if(ca<=0)return;const b=out[i],s=cd.slot==null?i:cd.slot,lift=cd.lift||0,fl=Math.floor(s+1e-6),
    rot=lerp(lean(fl),lean(fl+1),ag_sine(clamp(s-fl,0,1)))+0.05*Math.min(1,lift/200);
    ctx.save();ctx.globalAlpha*=ca;cm_card(ctx,b.x,b.y,cd,rot);ctx.restore();
    if(cd.who&&cd.whoA>0)ag_T(ctx,cd.who,b.cx,b.ledge+62,{w:600,size:28,col:AG.mut,align:"center",a:ca*cd.whoA});});
  ctx.restore();return out;}

/* an entry pulled up out of the file (2.4's tm_entry): ENTRY in blue, or PROPOSED ENTRY, muted, with a pen and a dashed edge, while it
   waits (o.kind "proposed"); then its fields one a line, the label quiet and the words under it: the lesson first. e.lesson, e.rows
   [[label, words, a, col, alt, altA]]: a row with no label carries on the field above it, and its words give way to alt as altA rises;
   o.kick, o.edge and o.edgeA (its edge lit in a colour), o.hl, o.hlA and o.hlCol (a field lit), o.lessonA (0: the caller draws the lesson's words,
   at the box's lx, ly); o.a, o.k, o.measure. Returns its box. */
function cm_entry(ctx,x,y,w,e,o){o=o||{};const a=o.a==null?1:o.a,inner=w-56,f=[["Lesson",e.lesson,1,null]].concat(e.rows||[]);
  const rows=f.map(r=>({r,lines:ag_wrap(ctx,r[1],inner,{w:600,size:30})})),rh=q=>(q.r[0]==null?-16:34)+q.lines.length*40+16,
    h=28+48+rows.reduce((s,q)=>s+rh(q),0)+10,bb={x,y,w,h,lx:x+28,ly:y+76+34+32};
  if(a<=0||o.measure)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  const prop=o.kind==="proposed",ea=o.edgeA==null?1:o.edgeA;
  ag_box(ctx,x,y,w,h,22,{edge:o.edge&&ea>0?o.edge:(prop?null:AG.blue),edgeA:o.edge&&ea>0?0.5+0.4*ea:0.5,glow:o.edge&&ea>0?o.edge:null,glowA:0.6*ea});
  if(prop)cm_dash(ctx,x+5,y+5,w-10,h-10,18,AG.mut,o.dashA==null?1:o.dashA);
  const kick=o.kick||(prop?"Proposed entry":"Entry"),kc=prop?AG.mut:AG.blue;
  if(prop){ag_pen(ctx,x+42,y+44,30,rgba(AG.mut,1));ag_T(ctx,kick.toUpperCase(),x+68,y+52,{w:700,size:28,ls:4,col:kc});}
  else ag_T(ctx,kick.toUpperCase(),x+28,y+52,{w:700,size:28,ls:4,col:kc});
  let yy=y+76;rows.forEach((q,i)=>{const hl=o.hl===i?(o.hlA==null?1:o.hlA):0,ra=q.r[2]==null?1:q.r[2],lab=q.r[0]!=null;if(ra<=0){yy+=rh(q);return;}
    ctx.save();ctx.globalAlpha*=ra;if(!lab)yy-=16;
    // a lit field takes in the lines that carry it on
    if(hl>0){let hh=(lab?34:0)+q.lines.length*40+8;for(let j=i+1;j<rows.length&&rows[j].r[0]==null;j++)hh+=rows[j].lines.length*40;
      ctx.fillStyle=rgba(o.hlCol||q.r[3]||AG.amber,0.1*hl);rr(ctx,x+14,yy-4,w-28,hh,10);ctx.fill();}
    if(lab){ag_T(ctx,q.r[0],x+28,yy+26,{w:700,size:28,col:AG.mut});yy+=34;}
    const wa=(i===0&&o.lessonA!=null?o.lessonA:1),alt=q.r[4],altA=alt?clamp(q.r[5]||0,0,1):0;
    q.lines.forEach((l,k)=>{yy+=40;ag_T(ctx,l,x+28,yy-8,{w:600,size:30,col:q.r[3]||AG.ink,a:wa*(1-altA)});if(k===0&&altA>0)ag_T(ctx,alt,x+28,yy-8,{w:600,size:30,col:q.r[3]||AG.ink,a:wa*altA});});
    ctx.restore();yy+=16;});
  ctx.restore();return bb;}

// a stamp that lands at t0 (2.4's tm_stamp: big and faint, then pressed down; a double edge, the word in its colour); it stays until o.t1
function cm_stamp(ctx,x,y,text,t,t0,o){o=o||{};if(t<t0)return;const p=clamp((t-t0)/0.32,0,1),a=Math.min(1,p*1.6)*(o.a==null?1:o.a)*(o.t1==null?1:1-ag_in(t,o.t1,0.5));if(a<=0)return;
  const col=o.col||AG.green,sz=o.size||34,s=lerp(1.5,1,ag_eo(p)),w=ag_tw(ctx,text,{w:800,size:sz})+56,h=sz+36;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot==null?-0.06:o.rot);ctx.scale(s,s);
  ctx.fillStyle="rgba(246,244,239,0.82)";rr(ctx,-w/2,-h/2,w,h,12);ctx.fill();
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=4;rr(ctx,-w/2,-h/2,w,h,12);ctx.stroke();ctx.lineWidth=1.5;rr(ctx,-w/2+7,-h/2+7,w-14,h-14,8);ctx.stroke();
  ag_T(ctx,text,0,sz*0.36,{w:800,size:sz,align:"center",col});ctx.restore();}

// a session: a large pale card with a violet edge, SESSION and its date at the right; o.lines: what was said, as bars ([w, ...]) or words
function cm_session(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  ag_box(ctx,x,y,w,h,20,{edge:AG.violet,edgeA:0.55*(o.edgeA==null?1:o.edgeA)});
  ag_T(ctx,"SESSION",x+26,y+46,{w:700,size:28,ls:4,col:AG.violet});if(o.date)ag_T(ctx,o.date,x+w-26,y+46,{w:500,size:28,f:"mono",col:AG.mut,align:"right"});
  let yy=y+78;for(const l of (o.lines||[])){if(typeof l==="number"){const bw=(w-52)*l;ctx.fillStyle="rgba(86,92,100,0.16)";rr(ctx,x+26,yy,bw,14,7);ctx.fill();yy+=30;}
    else{ag_T(ctx,l,x+26,yy+24,{w:600,size:28,col:AG.ink});yy+=40;}}
  ctx.restore();}

// a store kept on the platform: a cylinder for a database, its name, and its entries as small cards in rows
function cm_store(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  const edge=o.edge===undefined?AG.blue:o.edge;ag_box(ctx,x,y,w,h,22,{edge,edgeA:o.edgeA==null?0.75:o.edgeA,glow:o.glow||null,glowA:o.glowA});
  if(o.dashed)cm_dash(ctx,x,y,w,h,22,AG.mut,1);
  cm_cyl(ctx,x+46,y+44,o.dashed?rgba(AG.mut,1):rgba(edge||AG.mut,1));
  ag_T(ctx,(o.kick||"Store").toUpperCase(),x+82,y+56,{w:700,size:28,ls:4,col:o.dashed?AG.mut:(edge||AG.kick)});
  if(o.title)ag_T(ctx,o.title,x+28,y+108,{w:700,size:34});
  if(o.lock){ag_lock(ctx,x+w-44,y+50,28,rgba(AG.blue,1));if(o.lockText)ag_T(ctx,o.lockText,x+w-70,y+56,{w:600,size:28,col:AG.blue,align:"right"});}
  let yy=y+(o.title?136:84);for(const r of (o.rows||[])){const ra=r.a==null?1:r.a;if(ra>0){ctx.save();ctx.globalAlpha*=ra;const dy=r.dy||0;
      cm_index(ctx,x+24+(r.dx||0),yy+dy,w-48,52,{text:r.text,glow:r.col,tick:r.tick,strike:r.strike});if(r.dashed)cm_dash(ctx,x+24+(r.dx||0),yy+dy,w-48,52,8,AG.mut,1);ctx.restore();}
    yy+=64;}
  ctx.restore();}
// a small database: a cylinder, drawn in lines
function cm_cyl(ctx,x,y,col){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=3;const rx=15,ry=6,h=26;ctx.beginPath();ctx.ellipse(x,y-h/2,rx,ry,0,0,TAU);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-rx,y-h/2);ctx.lineTo(x-rx,y+h/2);ctx.ellipse(x,y+h/2,rx,ry,0,Math.PI,0,true);ctx.lineTo(x+rx,y-h/2);ctx.stroke();
  ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI);ctx.stroke();ctx.restore();}

// the platform's daily memory step: the model at work (violet), with a clock: once a day
function cm_step(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=o.w||400,h=124;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:AG.violet,edgeA:0.75,glow:o.glow?AG.violet:null,glowA:o.glow});
  cm_clock(ctx,x+50,y+62,26,rgba(AG.violet,1),o.turn||0);
  ag_T(ctx,o.title||"Memory step",x+92,y+56,{w:700,size:32});ag_T(ctx,o.sub||"once a day · beta",x+92,y+96,{w:500,size:28,col:AG.mut});ctx.restore();return{x,y,w,h};}
function cm_clock(ctx,x,y,r,col,turn){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();
  const a1=-Math.PI/2+turn*TAU,a2=-Math.PI/2+turn*TAU/12;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a1)*r*0.72,y+Math.sin(a1)*r*0.72);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a2)*r*0.5,y+Math.sin(a2)*r*0.5);ctx.stroke();ctx.restore();}
// a plain script: no model, the same steps every time (blue, a gear)
function cm_script(ctx,x,y,title,sub,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const w=o.w||Math.max(ag_tw(ctx,title,{w:700,size:32}),sub?ag_tw(ctx,sub,{w:500,size:28}):0)+140,h=sub?124:84;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.75,glow:o.glow?AG.blue:null,glowA:o.glow});
  cm_gear(ctx,x+52,y+h/2,22,rgba(AG.blue,1),o.turn||0);ag_T(ctx,title,x+96,y+(sub?56:h/2+11),{w:700,size:32});if(sub)ag_T(ctx,sub,x+96,y+96,{w:500,size:28,col:AG.mut});
  ctx.restore();return{x,y,w,h};}
function cm_gear(ctx,x,y,r,col,turn){ctx.save();ctx.translate(x,y);ctx.rotate(turn*TAU);ctx.fillStyle=col;ctx.beginPath();const n=8;
  for(let i=0;i<n*2;i++){const ang=i*Math.PI/n,rr_=i%2?r*0.78:r;ctx.lineTo(Math.cos(ang-0.18)*rr_,Math.sin(ang-0.18)*rr_);ctx.lineTo(Math.cos(ang+0.18)*rr_,Math.sin(ang+0.18)*rr_);}
  ctx.closePath();ctx.fill();ctx.fillStyle="#EEECE7";ctx.beginPath();ctx.arc(0,0,r*0.36,0,TAU);ctx.fill();ctx.restore();}

// an arrow along a curve, drawn on to u, its head at the end
function cm_arrow(ctx,p,u,o){o=o||{};if(u<=0.01)return;const a=o.a==null?1:o.a;if(a<=0)return;const col=o.col||AG.blue;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  if(o.dash)ctx.setLineDash(o.dash);ctx.strokeStyle=rgba(col,o.alpha||0.85);ctx.lineWidth=o.lw||4;ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.setLineDash([]);
  if(u>0.1){const q=ag_bz(p,u),q0=ag_bz(p,Math.max(0,u-0.03));ag_arrowHead(ctx,q[0],q[1],Math.atan2(q[1]-q0[1],q[0]-q0[0]),o.head||14,rgba(col,o.alpha||0.85));}ctx.restore();}
// the line an agent reads along: dashed blue, from the file to the agent's sphere, with a dot running along it while it reads
function cm_reads(ctx,x0,y0,x1,y1,u,o){o=o||{};if(u<=0.01)return;const a=o.a==null?1:o.a,bend=o.bend==null?60:o.bend,p=[x0,y0,x0+(x1-x0)*0.3,y0+bend,x1-(x1-x0)*0.3,y1-bend*0.4,x1,y1];
  ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([10,10]);ctx.lineDashOffset=-(o.t||0)*24;ctx.strokeStyle=rgba(o.col||AG.blue,0.8);ctx.lineWidth=3.2;ctx.lineCap="round";ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  return p;}
