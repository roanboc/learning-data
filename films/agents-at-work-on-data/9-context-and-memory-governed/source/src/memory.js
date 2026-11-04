/* ===== Context and memory, governed: the team's memory =====
   Drawn as Memory: from one chat to the team draws it (its thread's notes, 4 November 2026): the team's memory is an oak card file on
   the marble wall, TEAM MEMORY above it in the module's blue; each entry an off-white index card standing in it, slightly fanned, its
   top line the lesson's first words, a small green tick when a person approved it. An entry pulled up shows its fields, one a line:
   Lesson, Learned in, Confirmed by, Approved by, and History; this film adds Check again. A proposed entry waits outside the file on a
   card with a dashed edge and a small pen; "Approved" lands on it in green, "Turned down" in amber. A session is a large pale card with
   a violet edge, SESSION and its date at the right.
   On the platform the memory is kept in stores (Lakebase, the platform's database): a store is a box with its entries in it.
     cm_file(ctx, x, y, o)          the card file: (x, y) the middle of the tray's top edge; o.cards [{text, tick, who, a, glow, lift}],
                                    o.w (the tray's width), o.a; returns each card's place in the file
     cm_index(ctx, x, y, w, h, o)   one index card, flat: o.text its top line, o.tick, o.who (the approver, at the right), o.glow, o.a
     cm_entry(ctx, x, y, w, e, o)   an entry pulled up: e.lesson, e.rows [[label, value], ...], e.tick; o.a, o.k, o.edge; returns its box
     cm_proposal(ctx, x, y, w, text, o)  a proposed entry: dashed, a pen, PROPOSED
     cm_stamp(ctx, x, y, text, t, t0, o)  a stamp landing at t0: o.col (green: approved; amber: turned down or removed), o.rot
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

// the card file: an oak tray on the wall, cards standing in it, each stepping up behind the one in front
const CM_FILE={w:700,cw:640,step:50,lip:66};
function cm_file(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,cards=o.cards||[],n=cards.length,w=o.w||CM_FILE.w,cw=o.cw||CM_FILE.cw,st=o.step||CM_FILE.step,out=[];
  for(let k=0;k<n;k++){const top=y-CM_FILE.lip-k*st;out.push({x:x-cw/2+((k%2)?5:-5),y:top,w:cw,h:y+12-top,rot:(k-(n-1)/2)*0.004});}
  if(a<=0)return out;ctx.save();ctx.globalAlpha*=a;
  const topY=n?out[n-1].y:y-CM_FILE.lip;
  if(o.label!==null){const lt=(o.label||"Team memory");ag_label(ctx,x-w/2+6,topY-26,lt,{a:o.labelA==null?1:o.labelA});
    if(o.lock>0){const lx=x-w/2+6+ag_tw(ctx,lt.toUpperCase(),{w:700,size:28,ls:4})+40;ctx.save();ctx.globalAlpha*=o.lock;ag_lock(ctx,lx,topY-32,26,rgba(AG.blue,1));
      ag_T(ctx,o.lockText||"read only",lx+26,topY-26,{w:600,size:28,col:AG.blue});ctx.restore();}}
  // its shadow on the wall
  ctx.save();const g=ctx.createLinearGradient(0,y+26,0,y+70);g.addColorStop(0,"rgba(46,38,28,0.2)");g.addColorStop(1,"rgba(46,38,28,0)");ctx.fillStyle=g;ctx.fillRect(x-w/2+AG.sdx,y+26,w,44);ctx.restore();
  // the tray's back, inside, darker
  ctx.fillStyle=rgba(AG_OAK.dark,1);ctx.fillRect(x-w/2+10,y-8,w-20,10);
  for(let k=n-1;k>=0;k--){const c=cards[k],b=out[k];if(!c||c.a===0)continue;const lift=c.lift||0;if(lift>=1)continue;
    ctx.save();ctx.translate(b.x+b.w/2,b.y+b.h/2-lift*40+(c.dy||0));ctx.rotate(b.rot);ctx.translate(-b.w/2,-b.h/2);
    cm_index(ctx,0,0,b.w,b.h,{text:c.text,alt:c.alt,altA:c.altA,tick:c.tick,who:c.who,whoA:c.whoA,glow:c.glow,glowA:c.glowA,a:(c.a==null?1:c.a)*(1-lift),strike:c.strike,textA:c.textA});ctx.restore();}
  // the front face, its lit top edge, and the grain
  const fg=ctx.createLinearGradient(0,y,0,y+28);fg.addColorStop(0,rgba(mix(AG_OAK.base,[255,255,255],0.18),1));fg.addColorStop(1,rgba(AG_OAK.dark,1));
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=12;ctx.shadowOffsetX=AG.sdx*0.6;ctx.shadowOffsetY=6;ctx.fillStyle=fg;rr(ctx,x-w/2,y,w,28,5);ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(AG_OAK.hi,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-w/2+5,y+1.5);ctx.lineTo(x+w/2-5,y+1.5);ctx.stroke();
  ctx.strokeStyle=rgba(AG_OAK.dark,0.35);ctx.lineWidth=1;for(const f of [0.18,0.44,0.71,0.9]){ctx.beginPath();ctx.moveTo(x-w/2+w*f,y+6);ctx.quadraticCurveTo(x-w/2+w*f+30,y+14,x-w/2+w*f+64,y+22);ctx.stroke();}
  ctx.restore();return out;}

// an entry pulled up out of the file: its lesson, then its fields, label then value
function cm_entry(ctx,x,y,w,e,o){o=o||{};const a=o.a==null?1:o.a,lab=o.lab||236,inner=w-56,ll=ag_wrap(ctx,e.lesson,inner-(e.tick!=null?40:0),{w:700,size:34}),rows=e.rows||[];
  const vl=rows.map(r=>ag_wrap(ctx,r[1],inner-lab,{w:600,size:28}));const h=30+ll.length*44+16+vl.reduce((s,v)=>s+v.length*38+6,0)+24,bb={x,y,w,h};if(a<=0||o.measure)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  cm_index(ctx,x,y,w,h,{glow:o.edge,glowA:o.edgeA});
  // the rule under the lesson
  let yy=y+30;ll.forEach((l,i)=>{yy+=(i?44:34);ag_T(ctx,l,x+28,yy,{w:700,size:34,col:o.lessonCol||AG.ink,a:o.lessonA==null?1:o.lessonA});});
  if(e.tick>0){ctx.save();ctx.globalAlpha*=clamp(e.tick,0,1);ag_tick(ctx,x+w-40,y+50,26,rgba(AG.green,1),4);ctx.restore();}
  yy+=22;ctx.strokeStyle=CM_CARD.rule;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x+18,yy-6);ctx.lineTo(x+w-18,yy-6);ctx.stroke();
  rows.forEach((r,i)=>{const ra=r[2]==null?1:r[2];vl[i].forEach((l,j)=>{yy+=38;if(j===0)ag_T(ctx,r[0],x+28,yy,{w:700,size:28,col:AG.mut,a:ra});
      ag_T(ctx,l,x+28+lab,yy,{w:600,size:28,col:r[3]||AG.ink,a:ra});});yy+=6;});
  ctx.restore();return bb;}

function cm_proposal(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a,lines=ag_wrap(ctx,text,w-56,{w:600,size:30}),h=86+lines.length*40;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  cm_index(ctx,x,y,w,h,{});cm_dash(ctx,x,y,w,h,8,AG.mut,1);
  ag_pen(ctx,x+40,y+38,26,rgba(AG.mut,1));ag_T(ctx,o.kick||"PROPOSED",x+64,y+48,{w:700,size:28,ls:4,col:AG.mut});
  lines.forEach((l,i)=>ag_T(ctx,l,x+28,y+100+i*40,{w:600,size:30,col:AG.ink}));ctx.restore();return{x,y,w,h};}

// a stamp that lands: big and faint, then pressed down; it stays
function cm_stamp(ctx,x,y,text,t,t0,o){o=o||{};if(t<t0)return;const u=clamp((t-t0)/0.32,0,1),a=ag_eo(u)*(o.a==null?1:o.a)*(o.t1==null?1:1-ag_in(t,o.t1,0.5));if(a<=0)return;
  const col=o.col||AG.green,s=o.size||32,k=lerp(1.5,1,ag_eo(u)),rot=o.rot==null?-0.07:o.rot,tw=ag_tw(ctx,text.toUpperCase(),{w:800,size:s,ls:4}),w=tw+56,h=s+34;
  ctx.save();ctx.globalAlpha*=a*0.92;ctx.translate(x,y);ctx.rotate(rot);ctx.scale(k,k);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;rr(ctx,-w/2,-h/2,w,h,10);ctx.stroke();
  ctx.lineWidth=1.6;rr(ctx,-w/2+7,-h/2+7,w-14,h-14,6);ctx.stroke();ag_T(ctx,text.toUpperCase(),0,s*0.36,{w:800,size:s,ls:4,align:"center",col});ctx.restore();}

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
