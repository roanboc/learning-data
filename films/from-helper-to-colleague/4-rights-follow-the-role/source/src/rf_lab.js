/* ===== Rights follow the role: the lab's pieces =====
   Where things stand in the module's lab (RL), and the film's pieces there, prefixed rf_ / RF_ like the hospitals':
     the planning agent at the upper left with its badge (RL.agent), or in the middle of the wall in the opening (RL.mid); Jun's
     helper, a sphere like it with Jun's name on its badge, only in a later moment of the room, never beside the planning agent;
     the seven steps of "change a data product" along the lower wall (rf_chain), each with its role and, once it's said, the person;
     the planning contributor's three under a blue bracket;
     cards of rows (rf_rows): what a step reads, writes and calls, the rights made from the steps, each with the step that needs it,
     what the agent reads, in order, and the role's steps; Jun's 46 rights as small tiles in three kinds (rf_chips); the shelf and
     the drawer of the opening (rf_shelf, rf_drawer); the framed pictures that go back to the hospitals (rf_frame).
   The wall meets the floor lower than in the module's other films (RL.hz), so the steps and their roles sit on the wall.
   Colours keep the module's meanings: blue the steps, the role and its rights; violet the model; green a check that passes; amber what
   is left out, what only people may do, and a check that fails. */

const RL={agent:{x:250,y:230,r:62},mid:{x:960,y:236,r:70},chain:{x:97,y:618,w:226,gap:24,h:104},hz:840};
// the lab with quieter marble where the film puts its words: the agent, the cards on the right, the steps along the lower wall
const RF_QUIET=[[330,260,300,190,0.5],[1270,330,640,260,0.5],[960,700,920,170,0.45],[420,96,360,46,0.3]];
AG_PLACES.rfLab=c=>ag_paintLab(c,{quiet:RF_QUIET,hz:RL.hz});
const RF_KICK=(x,o)=>ag_kicker(x,"3.4","Rights follow the role",o);
// a chapter's moments, worked out once
function rf_once(sc,k,fn){sc.__rf=sc.__rf||{};if(!(k in sc.__rf))sc.__rf[k]=fn();return sc.__rf[k];}

/* ---------------------------------------------------------------- the agents and the people */
// an agent: the sphere, its light on the wall, its badge on a blue lanyard (o.name); o.at {x, y, r}; o.glow lights the badge;
// o.think, o.core, o.a. t is the film's own time, so an agent that stays put from one chapter to the next sways on unbroken
function rf_agent(ctx,t,o){o=o||{};const P_=o.at||RL.agent,a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ag_modelLight(ctx,P_.x,P_.y,P_.r,o.core==null?1:o.core);ag_model(ctx,P_.x,P_.y,P_.r,{t,core:o.core==null?1:o.core,think:o.think||0});
  const hy=P_.y+P_.r+4,drop=o.drop||46,name=o.name||"planning agent";
  if(o.glow>0){const w=ag_tw(ctx,name,{w:700,size:28})+48;ctx.save();ctx.globalAlpha*=o.glow;ctx.shadowColor=rgba(AG.blue,0.8);ctx.shadowBlur=26;
    ctx.strokeStyle=rgba(AG.blue,0.9);ctx.lineWidth=4;rr(ctx,P_.x-w/2-6,hy+drop-6,w+12,70,14);ctx.stroke();ctx.restore();}
  ag_badge(ctx,P_.x,hy,name,{t,drop});ctx.restore();}
// a person at (x, y), size s, faded whole; o.p: ag_person's options (pose, hold, flip, gaze)
function rf_who(ctx,who,t,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>ag_person(ctx,who,x,y,s,Object.assign({t,gaze:[4,-1]},o.p||{})));}
// where someone slides to from off the frame's edge: from x0 to x1 from t0, over d seconds
const rf_slide=(t,t0,x0,x1,d)=>lerp(x0,x1,ag_sine((t-t0)/(d||1.2)));

/* ---------------------------------------------------------------- cards, pills, lines */
function rf_card(ctx,x,y,w,kick,title,sub,o){o=o||{};return ag_textCard(ctx,x,y,w,{kick,title,sub},{kickCol:o.kickCol||AG.kick,edge:o.edge,edgeA:o.edgeA,tail:o.tail,a:o.a,k:o.k,icon:o.icon});}
// a pill whose left edge is at x (ag_pill takes its middle)
function rf_pillL(ctx,x,y,text,o){o=o||{};const w=ag_tw(ctx,text,{w:700,size:o.size||30})+(o.icon?96:56);return ag_pill(ctx,x+w/2,y,text,o);}
// a pill's width, as rf_pillL draws it
const rf_pillW=(ctx,text,o)=>ag_tw(ctx,text,{w:700,size:(o&&o.size)||30})+(o&&o.icon?96:56);
// a strike through a pill, drawn on from the left (u 0 to 1), in amber
function rf_strike(ctx,b,u,a){if(u<=0||a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.amber,0.95);ctx.lineWidth=4;ctx.lineCap="round";
  const y=b.y+b.h/2;ctx.beginPath();ctx.moveTo(b.x+22,y);ctx.lineTo(b.x+22+(b.w-44)*ag_sine(u),y);ctx.stroke();ctx.restore();}
// a soft line drawn on from (x0, y0) to (x1, y1), bowed by bow px, u 0 to 1, in a colour; an arrowhead at its end once it's there
function rf_line(ctx,x0,y0,x1,y1,u,col,o){o=o||{};const a=o.a==null?1:o.a;if(u<=0||a<=0)return;const bow=o.bow||0,mx=(x0+x1)/2,my=(y0+y1)/2,
    nx=-(y1-y0),ny=x1-x0,l=Math.hypot(nx,ny)||1,cx=mx+nx/l*bow,cy=my+ny/l*bow,p=[x0,y0,lerp(x0,cx,0.66),lerp(y0,cy,0.66),lerp(x1,cx,0.66),lerp(y1,cy,0.66),x1,y1];
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,o.lineA==null?0.8:o.lineA);ctx.lineWidth=o.lw||3;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);
  ag_bzPath(ctx,p,0,clamp(u,0,1),40);ctx.stroke();ctx.setLineDash([]);
  if(o.head&&u>=0.98){const q=ag_bz(p,0.97),e=ag_bz(p,1);ag_arrowHead(ctx,e[0],e[1],Math.atan2(e[1]-q[1],e[0]-q[0]),10,rgba(col,0.9));}ctx.restore();}
// a small graphite arrow to the right, centred on (x, y)
function rf_arrow(ctx,x,y,a,col){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col?rgba(col,0.85):AG.arrow;ctx.lineWidth=3;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x-12,y);ctx.lineTo(x+8,y);ctx.stroke();ag_arrowHead(ctx,x+10,y,0,8,col?rgba(col,0.9):AG.arrow);ctx.restore();}
// pills in a row from x, with small arrows between them: items [text, ...] or [{t, col, icon, a}], each coming in at its own a
function rf_flow(ctx,x,y,items,o){o=o||{};let px=x;const out=[];items.forEach((it,i)=>{const q=typeof it==="string"?{t:it}:it,a=(q.a==null?1:q.a)*(o.a==null?1:o.a),
    w=rf_pillW(ctx,q.t,{icon:q.icon,size:o.size});if(i>0){rf_arrow(ctx,px+20,y,a*(o.arrows==null?1:o.arrows));px+=44;}
    out.push(rf_pillL(ctx,px,y,q.t,{col:q.col||AG.blue,icon:q.icon,a,size:o.size}));px+=w;});return out;}

/* ---------------------------------------------------------------- a card of rows
   head {kick, title, kickCol}; rows [{t, lab, chip, chipA, a, col, icon, dash, mute, size}]: each row's words (wrapped to the card),
   an optional label in capitals before them (lab, such as READS), and an optional chip at the right (the step that needs it). The
   card's size is worked out from all its rows, so it never grows as they come in. o.labW: the labels' column; o.edge, o.glow, o.a,
   o.k (springs from its middle), o.rowH (46); o.dash draws the card's edge dashed (a step proposed, not yet on the map) */
function rf_rows(ctx,x,y,w,head,rows,o){o=o||{};const a=o.a==null?1:o.a,pad=28,labW=o.labW||0,rh=o.rowH||46,size=o.size||30;
  const chipW=r=>r.chip?ag_tw(ctx,r.chip,{w:700,size:28})+44:0;
  const lines=rows.map(r=>ag_wrap(ctx,r.t,w-pad*2-labW-(r.chip?chipW(r)+20:0)-(r.icon?40:0),{w:r.mute?600:700,size:r.size||size}));
  const hh=(head.kick?38:0)+(head.title?44:0),top=y+pad+hh+(hh?12:-8);let yy=top;const ys=lines.map(l=>{const at=yy;yy+=Math.max(1,l.length)*(rh-8)+8;return at;});
  const h=yy-y+pad-8,bb={x,y,w,h};if(a<=0)return Object.assign(bb,{rows:ys.map((ry,i)=>({y:ry,h:Math.max(1,lines[i].length)*(rh-8)}))});
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:o.edgeA==null?0.5:o.edgeA,glow:o.glow?(o.glowCol||o.edge||AG.blue):null,glowA:o.glow||0});
  if(o.dash){ctx.save();ctx.strokeStyle=rgba(o.edge||AG.blue,0.8);ctx.lineWidth=2.4;ctx.setLineDash([12,9]);rr(ctx,x+6,y+6,w-12,h-12,18);ctx.stroke();ctx.restore();}
  let hy=y+pad+22;if(head.kick){ag_T(ctx,String(head.kick).toUpperCase(),x+pad,hy,{w:700,size:28,ls:4,col:head.kickCol||AG.blue});hy+=16;}else hy-=22;
  if(head.title){hy+=44;ag_T(ctx,head.title,x+pad,hy,{w:700,size:36});}
  rows.forEach((r,i)=>{const ra=r.a==null?1:r.a;if(ra<=0)return;const ry=ys[i],col=r.col||(r.mute?AG.mut:AG.ink);ctx.save();ctx.globalAlpha*=ra;
    if(r.dash){ctx.save();ctx.strokeStyle=rgba(AG.blue,0.75);ctx.lineWidth=2.2;ctx.setLineDash([10,8]);rr(ctx,x+pad-12,ry-4,w-2*pad+24,Math.max(1,lines[i].length)*(rh-8)+8,12);ctx.stroke();ctx.restore();}
    let tx=x+pad;if(r.lab)ag_T(ctx,r.lab,tx,ry+30,{w:700,size:28,ls:3,col:r.labCol||AG.blue});tx+=labW;
    if(r.icon==="tick")ag_tick(ctx,tx+14,ry+20,22,rgba(r.iconCol||AG.green,1),3.6);else if(r.icon==="lock")ag_lock(ctx,tx+14,ry+24,26,rgba(r.iconCol||AG.amber,1));
    else if(r.icon==="dot"){ctx.fillStyle=rgba(r.iconCol||AG.blue,0.9);rr(ctx,tx+6,ry+12,16,16,4);ctx.fill();}
    if(r.icon)tx+=40;
    const ta=r.ta==null?1:r.ta;if(ta>0)lines[i].forEach((l,k)=>ag_T(ctx,l,tx,ry+30+k*(rh-8),{w:r.mute?600:700,size:r.size||size,col,a:ta}));
    if(r.chip){const ca=r.chipA==null?1:r.chipA;if(ca>0){const cw=chipW(r),cx=x+w-pad-cw,cy=ry+1;ctx.save();ctx.globalAlpha*=ca;
      ag_box(ctx,cx,cy,cw,40,20,{edge:r.chipCol||AG.blue,edgeA:0.8});ag_T(ctx,r.chip,cx+cw/2,cy+29,{w:700,size:28,align:"center",col:r.chipCol||AG.blue});ctx.restore();}}
    ctx.restore();});
  ctx.restore();return Object.assign(bb,{rows:ys.map((ry,i)=>({y:ry,h:Math.max(1,lines[i].length)*(rh-8)}))});}

/* ---------------------------------------------------------------- the seven steps of change a data product
   Boxes along the lower wall, a small arrow between each, the role under each box (the planning contributor's three share a blue
   bracket above them instead), and the person under the role once it's said. o: a (the whole), p [7] each box's arrival (0 to 1),
   col [7] each box's colour (null: none), ek [7] how much of that colour its edge and words take (0 to 1, so a colour comes in, never
   switches), lit [7] how lit (0 to 1), dim [7], roles (0 to 1), who [7] (0 to 1), bracket (0 to 1); returns each box */
const RF_STEPS=[{n:"Raise a ticket",role:"requester",who:"Clara"},{n:"Draft the change",pc:1},{n:"Build it in development",pc:1},{n:"Open a pull request",pc:1},
  {n:"Review the code",role:"analytics engineer",who:"Jun"},{n:"Approve the change",role:"product owner",who:"Clara"},{n:"Release to production",role:"release approver",who:"Noor"}];
function rf_box(i){const C=RL.chain;return{x:C.x+i*(C.w+C.gap),y:C.y,w:C.w,h:C.h,cx:C.x+i*(C.w+C.gap)+C.w/2};}
function rf_chain(ctx,o){o=o||{};const C=RL.chain,A=o.a==null?1:o.a,g=(v,i,d)=>v==null?d:(Array.isArray(v)?(v[i]==null?d:v[i]):v),out=[];if(A<=0)return RF_STEPS.map((_,i)=>rf_box(i));
  ctx.save();ctx.globalAlpha*=A;
  RF_STEPS.forEach((s,i)=>{const b=rf_box(i),p=g(o.p,i,1),col=g(o.col,i,null),lit=g(o.lit,i,0),dim=g(o.dim,i,0);out.push(b);if(p<=0)return;
    const k=ag_spr(p,0,1/1.8),ia=clamp(p*3,0,1)*(1-0.55*dim);ctx.save();ctx.globalAlpha*=ia;ag_about(ctx,b.cx,b.y+b.h/2,lerp(0.6,1,k));
    const ek=col?g(o.ek,i,1):0,tc=col?mix(AG.ink,col,clamp(lit*1.6-0.4,0,1)*ek):AG.ink;
    ag_box(ctx,b.x,b.y,b.w,b.h,18,{edge:ek>0?col:null,edgeA:(0.4+0.5*lit)*ek,glow:lit>0&&ek>0?col:null,glowA:lit*ek});
    ag_wrap(ctx,s.n,b.w-32,{w:700,size:28}).forEach((l,k2)=>ag_T(ctx,l,b.cx,b.y+44+k2*36,{w:700,size:28,align:"center",col:tc}));
    ctx.restore();
    if(i>0)rf_arrow(ctx,b.x-C.gap/2,b.y+b.h/2,ia);
    // the role, and the person, under the box
    const ra=g(o.roles,i,0)*ia;if(!s.pc&&ra>0){const rl=ag_wrap(ctx,s.role,b.w-8,{w:600,size:28});rl.forEach((l,k2)=>ag_T(ctx,l,b.cx,b.y+b.h+40+k2*34,{w:600,size:28,align:"center",col:AG.mut,a:ra}));
      const wa=g(o.who,i,0)*ia;if(wa>0)ag_T(ctx,s.who,b.cx,b.y+b.h+40+rl.length*34,{w:800,size:30,align:"center",col:col?mix(AG.ink,col,g(o.ek,i,1)):AG.ink,a:wa});}});
  // the planning contributor's bracket over its three steps
  const ba=o.bracket||0;if(ba>0){const L=rf_box(1).x,R=rf_box(3).x+C.w,y=C.y-26;ctx.save();ctx.globalAlpha*=ba;ctx.strokeStyle=rgba(AG.blue,0.85);ctx.lineWidth=3;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(L+6,y+12);ctx.lineTo(L+6,y);ctx.lineTo(R-6,y);ctx.lineTo(R-6,y+12);ctx.stroke();
    const lw=ag_tw(ctx,"PLANNING CONTRIBUTOR",{w:700,size:28,ls:4})+40;
    ag_box(ctx,(L+R)/2-lw/2,y-24,lw,48,24,{edge:AG.blue,edgeA:0.6});ag_label(ctx,(L+R)/2,y+10,"Planning contributor",{align:"center",col:AG.blue});ctx.restore();}
  ctx.restore();return out;}

/* ---------------------------------------------------------------- Jun's 46 rights
   Small tiles, gathered over the years, of three kinds mixed together: for his work today (22), what only a person should use (5),
   and what's left from old work (19). o.lit {today, person, old}: each kind lit in its colour (blue, amber, graphite), o.dim (the
   rest dim while one kind is lit), o.warn (0 to 1: the tiles the agent shouldn't have glow amber), o.a, o.k; the card's head says
   what they are. Returns the card's box */
const RF_CHIPS=(()=>{const kinds=[];for(let i=0;i<22;i++)kinds.push(0);for(let i=0;i<5;i++)kinds.push(1);for(let i=0;i<19;i++)kinds.push(2);
  const R=ag_rnd(46);for(let i=kinds.length-1;i>0;i--){const j=Math.floor(R()*(i+1)),t=kinds[i];kinds[i]=kinds[j];kinds[j]=t;}return kinds;})();
function rf_chips(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=760,cols=10,cw=56,ch=34,gx=12,gy=14,gw=cols*cw+(cols-1)*gx,h=112+5*ch+4*gy+34;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:AG.mut,edgeA:0.3});ag_T(ctx,"JUN'S RIGHTS",x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});
  ag_T(ctx,"46, gathered over the years",x+28,y+94,{w:700,size:36});
  const L=o.lit||{},cols3=[AG.blue,AG.amber,[96,100,108]],gx0=x+(w-gw)/2,gy0=y+124;
  RF_CHIPS.forEach((kd,i)=>{const r=Math.floor(i/cols),q=i%cols,cx=gx0+q*(cw+gx),cy=gy0+r*(ch+gy),lit=[L.today||0,L.person||0,L.old||0][kd],
      dim=(o.dim||0)*(1-lit),warn=(o.warn||0)*(kd>0?1:0),on=Math.max(lit,warn),col=warn>lit?AG.amber:cols3[kd];
    ctx.save();ctx.globalAlpha*=1-0.6*dim;ag_box(ctx,cx,cy,cw,ch,8,{edge:on>0.05?col:null,edgeA:0.25+0.65*on,glow:warn>0.05?AG.amber:null,glowA:warn*0.8});
    ctx.fillStyle=rgba(on>0.05?col:[150,146,138],0.25+0.55*Math.max(on,0.3));rr(ctx,cx+10,cy+ch/2-4,cw-20,8,4);ctx.fill();
    if(kd===1&&on>0.3)ag_lock(ctx,cx+cw-14,cy+14,16,rgba(AG.amber,on));ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the opening's shelf and drawer, in the lab */
// a person's rights as a shelf: rows of tiles, every kind, and among them what only people may do. o.lit (0 to 1) the tiles lit
// amber one by one, o.dim, o.a, o.k; returns the card and its tiles' middles
function rf_shelf(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=760,cols=10,cw=56,ch=30,gx=12,gy=16,h=112+3*ch+2*gy+40;const tiles=[];
  const gw=cols*cw+(cols-1)*gx,gx0=x+(w-gw)/2,gy0=y+128;for(let i=0;i<30;i++){const r=Math.floor(i/cols),q=i%cols;tiles.push([gx0+q*(cw+gx)+cw/2,gy0+r*(ch+gy)+ch/2]);}
  if(a<=0)return{x,y,w,h,tiles};ctx.save();ctx.globalAlpha*=a*(1-0.55*(o.dim||0));if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:AG.amber,edgeA:0.25+0.5*(o.edge||0)});ag_T(ctx,"A PERSON'S RIGHTS",x+28,y+50,{w:700,size:28,ls:4,col:AG.amber});
  ag_T(ctx,"The whole shelf",x+28,y+94,{w:700,size:36});
  const R=ag_rnd(12);tiles.forEach(([cx,cy],i)=>{const lit=clamp((o.lit||0)*34-i,0,1),hot=i===13||i===26?1:0;
    ag_box(ctx,cx-cw/2,cy-ch/2,cw,ch,8,{edge:lit>0.05?AG.amber:null,edgeA:0.3+0.5*lit});
    ctx.fillStyle=rgba(lit>0.05?AG.amber:[150,146,138],0.25+0.45*Math.max(lit,0.3));rr(ctx,cx-cw/2+10,cy-4,cw-20-(R()*14|0),8,4);ctx.fill();
    if(hot&&lit>0.3)ag_lock(ctx,cx+cw/2-14,cy-ch/2+12,16,rgba(AG.amber,lit));});
  ctx.restore();return{x,y,w,h,tiles};}
// the rights of its work as a drawer: three rows, one for each of its steps; o.rows [3] each row's arrival, o.ok (0 to 1) a green
// edge and a tick, o.a, o.k; returns the card and its rows' left ends
function rf_drawer(ctx,x,y,o){o=o||{};const w=760,rows=["Draft the change","Build it in development","Open a pull request"];
  const bb=rf_rows(ctx,x,y,w,{kick:"The rights of its work",title:"A drawer, filled from the order"},rows.map((t,i)=>({t,icon:"dot",a:o.rows?o.rows[i]:1})),
    {a:o.a,k:o.k,edge:(o.ok||0)>0.5?AG.green:AG.blue,edgeA:0.5+0.3*(o.ok||0),glow:(o.ok||0)*0.7,glowCol:AG.green});
  if((o.ok||0)>0&&(o.a==null?1:o.a)>0)ag_tick(ctx,x+w-50,y+52,26,rgba(AG.green,(o.ok||0)*(o.a==null?1:o.a)),4);
  return Object.assign(bb,{ends:bb.rows.map(r=>[x+30,r.y+20])});}

/* ---------------------------------------------------------------- framed pictures that go back to the hospitals */
// a framed picture on the wall, its painting drawn by draw(ctx, x, y, w, h) inside it; o.a, o.k
function rf_frame(ctx,x,y,w,h,draw,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  ag_picture(ctx,x,y,w,h,{a,draw});ctx.restore();}
// the doctor's own order and a copy of it, numbered as the agent reads: the original first, a copy only second
function rf_originalPic(c,x,y,w,h){c.fillStyle=rgba(RFW.cream,1);c.fillRect(x,y,w,h);
  rf_order(c,x+w*0.27,y+h*0.5,w*0.38,{h:h*0.56,r:-0.04,title:"ORDER",seed:3});rf_order(c,x+w*0.73,y+h*0.5,w*0.38,{h:h*0.56,r:0.05,title:"COPY",copy:true,seed:8});
  for(const [nx,n,col] of [[0.27,"1",AG.green],[0.73,"2",AG.mut]]){c.fillStyle=rgba(col,0.95);c.beginPath();c.arc(x+w*nx,y+h*0.1+4,20,0,TAU);c.fill();
    ag_T(c,n,x+w*nx,y+h*0.1+14,{w:800,size:28,align:"center",col:AG.white});}}
// a patient's drawer filled from the order: the order, an arrow, the drawer with its doses, each under its word
function rf_drawerPic(c,x,y,w,h){c.fillStyle=rgba(RFW.cream,1);c.fillRect(x,y,w,h);const cy=y+h*0.42;
  rf_order(c,x+w*0.25,cy,w*0.34,{h:h*0.42,r:-0.04,nowords:true,lines:3,seed:4});rf_arrow(c,x+w*0.5,cy,1);
  // the drawer, open: its tray seen from above (dark inside, the doses in it), then its front nearer us, with its handle
  {const dw=w*0.38,dx=x+w*0.75-dw/2,ty0=cy-h*0.17,ty1=cy+h*0.04,fh=h*0.13;
    c.save();c.beginPath();c.moveTo(dx+dw*0.08,ty0);c.lineTo(dx+dw*0.92,ty0);c.lineTo(dx+dw,ty1);c.lineTo(dx,ty1);c.closePath();
    c.fillStyle="rgba(58,64,66,0.78)";c.fill();c.strokeStyle=rgba(ag_lt(RFW.steel,0.3),1);c.lineWidth=3;c.stroke();c.clip();
    for(let i=0;i<3;i++)rf_packet(c,dx+dw*(0.24+0.26*i),(ty0+ty1)/2+2,w*0.085,{r:(i-1)*0.07});c.restore();
    ag_soft(c,cc=>ag_rect(cc,dx,ty1,dw,fh,6),ag_lt(RFW.steel,0.12),[255,255,255],dx+dw,ty1,160,"rgba(40,46,46,0.3)",6);
    c.fillStyle=rgba(ag_dk(RFW.steel,0.35),1);rr(c,dx+dw/2-16,ty1+fh-14,32,7,3.5);c.fill();}
  [["order",0.25],["drawer",0.75]].forEach(([s,u])=>ag_T(c,s,x+w*u,y+h*0.86,{w:700,size:28,align:"center",col:AG.ink}));}
// on the ward, three hands: the doctor's order, the pharmacist's drawer, the nurse's cup, each under its word
function rf_triadPic(c,x,y,w,h){c.fillStyle=rgba(RFW.cream,1);c.fillRect(x,y,w,h);const cy=y+h*0.42;
  rf_order(c,x+w*0.18,cy,w*0.22,{h:h*0.42,r:-0.04,nowords:true,lines:3,seed:4});
  {const dx=x+w*0.5-w*0.12,dw=w*0.24,dh=h*0.26;ag_soft(c,cc=>ag_rect(cc,dx,cy-dh/2,dw,dh,8),ag_lt(RFW.steel,0.1),[255,255,255],dx+dw,cy-dh/2,200,"rgba(40,46,46,0.3)",8);
    for(let i=0;i<3;i++)rf_packet(c,dx+dw*0.22+i*dw*0.28,cy-dh*0.62,w*0.06,{r:(i-1)*0.07});}
  {const px=x+w*0.82,py=cy+h*0.08;c.fillStyle=rgba(RFW.paper,1);c.beginPath();c.moveTo(px-30,py-46);c.lineTo(px+30,py-46);c.lineTo(px+22,py);c.lineTo(px-22,py);c.closePath();c.fill();
    c.strokeStyle="rgba(120,110,90,0.5)";c.lineWidth=2;c.stroke();rf_packet(c,px,py-70,w*0.06,{r:0.2});}
  [["ordered",0.18],["filled",0.5],["gave",0.82]].forEach(([s,u])=>ag_T(c,s,x+w*u,y+h*0.86,{w:700,size:28,align:"center",col:AG.ink}));
  for(const u of [0.34,0.66])rf_arrow(c,x+w*u,cy,1);}
