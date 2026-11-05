/* ===== Why Unity Catalog and Unity Gateway govern them: the room's own pieces =====
   The film's pieces in the module's lab, all prefixed ug_ / UG_ (the module's shared code is never changed for one film):
     the room's usual shot (UG): a person standing at the left, the cards they talk about beside them, the agent in its ring on the
     wall in the middle, with a hook under it (Mei's key, then its badge and its owner tag), and the wall's right for what it reads;
     its pieces: a name card over a person, Mei's key and the paper tags on strings, the learner table's record (names and emails as
     grey bars, then stars), the log of who read it, the faculties' questions and the answers, the agent's thread to its model and the
     calls along it, the gateway's frame and the catalog's frame, the model services, the checks, the slip of hidden words, the prompt,
     the dial of its limit, the usage card, the grants card, the policy card and the groups, the pencil sketch with its row filter, the
     function and the tool servers, the query and its answer, the lineage, the page for agents, and the census count.
   Colours keep the module's meanings: blue tools and structure (grants, locks, the frames, the tool servers), violet the model and
   what it does (its band, its thread, its own lines in the log), orange data coming back, green a check that passes, amber something
   wrong. No name or email of a learner is ever drawn: they are grey bars, then stars. */

// a value worked out once per chapter (the cue times its scene uses)
function ug_once(sc,k,fn){sc.__ug=sc.__ug||{};if(!(k in sc.__ug))sc.__ug[k]=fn();return sc.__ug[k];}

/* ---------------------------------------------------------------- where things stand in the room's usual shot */
const UG={agent:{x:1080,y:430,R:150,r:78},who:{x:250,y:610,s:0.98},cards:{x:476,y:230,w:440},right:{x:1296,w:570}};
UG.hook=UG.agent.y+UG.agent.R;   // under the ring: the key's hook and later the badge's (agent.x + 50), the owner tag's (agent.x - 30)
const UG_QUIET=[[700,430,290,260,0.55],[1580,430,340,320,0.5],[640,96,560,46,0.3],[1080,430,250,230,0.45]];
AG_PLACES.ugLab=c=>ag_paintLab(c,{quiet:UG_QUIET});
AG_PLACES.ugLabNight=c=>ag_paintLab(c,{quiet:UG_QUIET,night:true});
// the lab by night is the lab: from one to the other the camera glides on and the light changes, never a cut a few percent apart;
// the bare room, in a later moment's pass through it, keeps the light every shot of it draws
AG_ROOMS.ugLabNight="ugLab";
AG_BARE.ugLab=c=>ag_roomLight(c,1);AG_BARE.ugLabNight=c=>ag_roomLight(c,1,{night:true});
const UG_KICK=(x,dark,a)=>ag_kicker(x,"2.8","Why Unity Catalog and Unity Gateway govern them",{dark,a});
// the kicker, on the frame and drawn once by each chapter after its shots, so a glide never moves it and a pass through the bare room
// never takes it away: a at its opacity, night (0 to 1) as its night colours, for the lab by night
function ug_kick(ctx,S,a,night){if(!(a>0))return;night=clamp(night||0,0,1);ctx.save();setScreen(ctx,S);
  if(night<1)UG_KICK(ctx,false,a*(1-night));if(night>0)UG_KICK(ctx,true,a*night);ctx.restore();}
// what fn draws, laid on the picture at opacity a as one picture: a ring faded layer by layer shows its band through its sphere
function ug_asOne(ctx,a,fn){if(a>=1)return fn(ctx);if(!(a>0))return;const [bc,bx]=ag_buf("ugOne",ctx.canvas.width,ctx.canvas.height);
  bx.setTransform(ctx.getTransform());fn(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}
// where the agent is while it moves between two shots of the room: where it was until the shot's dissolve is over (t0), then on its
// way to b over d seconds (1 s), its ring's size with it
function ug_slide(tt,t0,a,b,d){const u=ag_sine((tt-t0)/(d||1.0)),A=UG.agent,R0=a.R||A.R,r0=a.r||A.r;
  return{x:lerp(a.x,b.x,u),y:lerp(a.y,b.y,u),R:lerp(R0,b.R||A.R,u),r:lerp(r0,b.r||A.r,u)};}
// text on its way somewhere, too small to read for a moment, is decoration on purpose: PH_OFF is the legibility check's hook, as From
// words to data's tools name it
let PH_OFF=0;
function ug_deco(on,fn){if(!on)return fn();PH_OFF++;try{return fn();}finally{PH_OFF--;}}
// the corner tag of the opening: where and when
function ug_corner(ctx,text,a){if(a<=0)return;const w=ag_tw(ctx,text.toUpperCase(),{w:700,size:30,ls:3})+56;
  ag_box(ctx,72,64,w,62,31,{a:a*0.92});ag_T(ctx,text.toUpperCase(),100,106,{w:700,size:30,ls:3,col:AG.kick,a});}

/* ---------------------------------------------------------------- the agent
   ug_agent(ctx, t, o): the loop at UG.agent unless o.x, o.y, o.R, o.r; o.core, o.think, o.p, o.pulse, o.a, o.dim (0 to 1: the band
   goes dark, as when it's switched off); its shadow on the floor; no label. ug_glow: its band's light again, over a night pass. */
function ug_agent(ctx,t,o){o=o||{};const A=UG.agent,x=o.x==null?A.x:o.x,y=o.y==null?A.y:o.y,R=o.R||A.R,r=o.r||A.r,a=o.a==null?1:o.a,dim=clamp(o.dim||0,0,1);
  if(a<=0)return[];if(o.floor!==false)withA(ctx,a,()=>ag_floorShadow(ctx,x+AG.sdx*3,Math.max(y+R+130,700),R*1.15,22,0.2));
  return ag_loop(ctx,x,y,{R,r,t,a,p:o.p,core:(o.core==null?1:o.core)*(1-dim*0.92),think:(o.think||0)*(1-dim),pulse:o.pulse,label:null});}
function ug_glow(ctx,t,o){o=o||{};const A=UG.agent,dim=clamp(o.dim||0,0,1);
  ag_model(ctx,o.x==null?A.x:o.x,o.y==null?A.y:o.y,o.r||A.r,{only:"light",t,core:1-dim*0.92,think:(o.think||0)*(1-dim),a:o.a==null?1:o.a});}
// an arm from the ring's right towards a point: the curve ag_reach takes
function ug_armTo(x1,y1,o){o=o||{};const A=UG.agent,x=o.x==null?A.x:o.x,y=o.y==null?A.y:o.y,R=o.R||A.R,x0=x+R*0.62,y0=y+R*0.42+(o.dy||0);
  return[x0,y0,lerp(x0,x1,0.35),y0+(o.bow==null?60:o.bow),lerp(x0,x1,0.75),y1+(o.bow2==null?20:o.bow2),x1,y1];}

/* ---------------------------------------------------------------- people
   ug_who(ctx, who, t, o): one of the cast standing at the left (UG.who), facing right, arms down; o.x, o.y, o.s, o.a, o.p (ag_person's
   own options: gaze, pose, hold, holdBack). Returns their hands. ug_name: a card over a person, their name and where they work. */
function ug_who(ctx,who,t,o){o=o||{};const W_=UG.who,a=o.a==null?1:o.a;if(a<=0.01)return null;let h=null;
  withA(ctx,a,()=>{h=ag_person(ctx,who,o.x==null?W_.x:o.x,o.y==null?W_.y:o.y,o.s||W_.s,Object.assign({t,gaze:[3,0]},o.p||{}));});return h;}
function ug_name(ctx,cx,y,name,role,a){if(a<=0)return;const w=Math.max(ag_tw(ctx,name,{w:700,size:30}),ag_tw(ctx,role,{w:600,size:28}))+60,h=100;
  ag_box(ctx,cx-w/2,y,w,h,18,{a});withA(ctx,a,()=>{ag_T(ctx,name,cx,y+43,{w:700,size:30,align:"center"});ag_T(ctx,role,cx,y+80,{w:600,size:28,align:"center",col:AG.mut});});}

/* ---------------------------------------------------------------- Mei's key, and paper tags on strings
   ug_key(ctx, x, y, s, o): a pale oak bow with a hole and a graphite blade with its teeth, the bow's middle at (x, y), the blade along
   o.rot (radians; 0 points right), s its size; o.a. Held, it's drawn behind the near hand (holdBack), in figure space; anywhere else,
   in the frame. ug_tag: a paper tag on a string from a point, as a label hangs from a key or a hook. */
function ug_key(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.scale(s,s);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.32)";ctx.shadowBlur=8;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=4;ctx.fillStyle="#4A4C52";
  ctx.beginPath();ctx.moveTo(22,-8);ctx.lineTo(118,-8);ctx.quadraticCurveTo(126,-8,126,0);ctx.lineTo(126,8);ctx.lineTo(112,8);ctx.lineTo(112,22);ctx.lineTo(100,22);ctx.lineTo(100,14);
  ctx.lineTo(90,14);ctx.lineTo(90,24);ctx.lineTo(78,24);ctx.lineTo(78,8);ctx.lineTo(22,8);ctx.closePath();ctx.fill();ctx.restore();
  ctx.fillStyle="rgba(255,255,255,0.22)";ctx.fillRect(26,-6,92,3);
  ag_soft(ctx,c=>{c.moveTo(32,0);c.arc(0,0,32,0,TAU);c.moveTo(-1,0);c.arc(-11,0,10,0,TAU,true);},AG_OAK.base,AG_OAK.hi,10,-14,36,rgba(AG_OAK.dark,0.6),6);
  ctx.strokeStyle=rgba(AG_OAK.dark,0.55);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(-11,0,10,0,TAU);ctx.stroke();
  ctx.restore();}
// where the bow's hole is, for a string: (x, y) and rot as ug_key had them
function ug_keyHole(x,y,s,rot){return[x+Math.cos(rot)*-11*s,y+Math.sin(rot)*-11*s];}
function ug_tag(ctx,hx,hy,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const dx=o.dx==null?-120:o.dx,dy=o.dy==null?70:o.dy,size=o.size||28,w=ag_tw(ctx,text,{w:700,size})+70,h=56;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(hx,hy);ctx.rotate(o.sw||0);
  ctx.strokeStyle="rgba(87,82,76,0.85)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(dx*0.4,dy*0.3,dx+(dx<0?w/2-22:-w/2+22),dy);ctx.stroke();
  ctx.translate(dx,dy);const l=dx<0;ag_card(ctx,c=>{if(l){c.moveTo(-w/2+16,-h/2);c.lineTo(w/2,-h/2);c.lineTo(w/2,h/2);c.lineTo(-w/2+16,h/2);c.lineTo(-w/2,0);}
    else{c.moveTo(-w/2,-h/2);c.lineTo(w/2-16,-h/2);c.lineTo(w/2,0);c.lineTo(w/2-16,h/2);c.lineTo(-w/2,h/2);}c.closePath();},{x:-w/2,y:-h/2,w,h},{edge:o.edge,edgeA:0.7});
  ctx.fillStyle="rgba(87,82,76,0.6)";ctx.beginPath();ctx.arc(l?w/2-22:-w/2+22,0,5,0,TAU);ctx.fill();
  ag_T(ctx,text,l?-w/2+26:-w/2+44,size*0.36,{w:700,size,col:o.col});ctx.restore();}

/* ---------------------------------------------------------------- the learner table's record, and the log of who read it
   ug_record(ctx, x, y, w, o): one learner's record in core_learner_v1, row by row: learner_key (a scrambled code), full_name and email
   (grey bars), status. o.mask 0 to 1: the name and email turn to stars; o.glow 0 to 1: the whole record lit (everything she can read);
   o.hl[i] a row lit; o.lock 0 to 1: a blue lock at its corner; o.edge; o.title (another table); o.a, o.k. Returns where each row's
   value is, for an arm to reach. */
const UG_REC=[["learner_key","code"],["full_name","bar"],["email","bar"],["status","studying"]];
function ug_record(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=52,h=28+38+44+UG_REC.length*rh+34,rows=UG_REC.map((r,i)=>[x+w-150,y+122+i*rh+rh/2-4]);if(a<=0)return rows;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  const g=clamp(o.glow||0,0,1);ag_box(ctx,x,y,w,h,22,{edge:g>0.02?AG.orange:(o.edge||null),edgeA:g>0.02?0.85*g:0.75,glow:g>0.02?AG.orange:null,glowA:g*0.8});
  ag_T(ctx,"LEARNER TABLE",x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});ag_T(ctx,o.title||"core_learner_v1",x+28,y+96,{w:500,size:30,f:"mono"});
  const m=clamp(o.mask||0,0,1);
  UG_REC.forEach(([col,kind],i)=>{const ry=y+122+i*rh,hl=Math.max(g*0.7,o.hl?o.hl[i]||0:0),vx=x+262;
    if(hl>0){ctx.fillStyle=rgba(AG.orange,0.1*hl);rr(ctx,x+14,ry,w-28,rh-6,10);ctx.fill();}
    ag_T(ctx,col,x+28,ry+34,{w:500,size:28,f:"mono",col:AG.mut});
    if(kind==="code")ag_T(ctx,"4d0508d9…",vx,ry+34,{w:500,size:28,f:"mono"});
    else if(kind==="bar"){if(m<1){ctx.fillStyle=rgba([150,146,140],0.6*(1-m));rr(ctx,vx,ry+13,i===1?172:226,20,10);ctx.fill();}
      if(m>0)ag_T(ctx,"***",vx,ry+40,{w:700,size:34,f:"mono",a:m});}
    else ag_T(ctx,kind,vx,ry+34,{w:600,size:28});});
  if(o.lock>0)withA(ctx,o.lock,()=>ag_lock(ctx,x+w-46,y+50,32,rgba(AG.blue,1)));
  ctx.restore();return rows;}
// the record's height, for laying out under it
const ug_recordH=()=>28+38+44+UG_REC.length*52+34;
/* ug_log(ctx, x, y, w, rows, o): a log card, "Who read the learner table", o.sub ("October"); rows [{when, who, id (an agent's own
   identity, as the log keeps it: a code), tag (its name, on a violet tag), hl (0 to 1, lit violet), warn (0 to 1, lit amber), a}];
   o.n how many rows tall (all of them unless given); o.race 0 to 1: the rows race upwards, all of them Mei's, o.raceOff px along,
   blurred by o.raceBlur (0 to 1, o.race unless given: their speed); o.a, o.k */
function ug_log(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,lh=50,n=o.n==null?rows.length:o.n,h=28+38+40+n*lh+20;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge,edgeA:0.8});ag_T(ctx,"WHO READ THE LEARNER TABLE",x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});
  if(o.sub)ag_T(ctx,o.sub,x+28,y+92,{w:600,size:28,col:AG.mut});
  const top=y+112;ctx.save();ctx.beginPath();ctx.rect(x+6,top-6,w-12,n*lh+10);ctx.clip();
  const race=clamp(o.race||0,0,1);
  // the racing rows: row k, k rows down from the card's first when off is 0, read about six seconds after the one above it, from
  // 02:02; they fade as they leave the card at its top and come in at its foot, so none is seen where it goes
  if(race>0){const off=o.raceOff||0,bl=clamp(o.raceBlur==null?race:o.raceBlur,0,1),k0=Math.floor(off/lh)-1;ctx.save();ctx.globalAlpha*=race;if(bl>0.01)ctx.filter="blur("+(3.6*bl)+"px)";
    for(let k=k0;k<=k0+n+2;k++){const ry=top+k*lh-off,ea=ag_sine((ry-top+lh)/lh)*ag_sine((top+n*lh-ry)/lh);if(ea<=0.01)continue;
      const m=122+Math.floor(Math.max(0,k)*6/60);
      ag_T(ctx,"Sun "+String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0"),x+28,ry+34,{w:500,size:28,f:"mono",col:AG.mut,deco:1,a:ea});
      ag_T(ctx,"mei.tanaka@uni.example",x+210,ry+34,{w:500,size:28,f:"mono",deco:1,a:ea});}
    ctx.restore();}
  rows.forEach((r,i)=>{const ry=top+i*lh,ra=(r.a==null?1:r.a)*(1-race);if(ra<=0)return;
    if(r.hl>0){ctx.fillStyle=rgba(AG.violet,0.09*r.hl);rr(ctx,x+14,ry,w-28,lh-6,10);ctx.fill();}
    if(r.warn>0){ctx.fillStyle=rgba(AG.amber,0.1*r.warn);rr(ctx,x+14,ry,w-28,lh-6,10);ctx.fill();}
    ag_T(ctx,r.when,x+28,ry+34,{w:500,size:28,f:"mono",col:AG.mut,a:ra});
    if(r.who)ag_T(ctx,r.who,x+210,ry+34,{w:500,size:28,f:"mono",a:ra});
    if(r.id){ag_T(ctx,r.id,x+210,ry+34,{w:500,size:28,f:"mono",col:AG.violet,a:ra});
      if(r.tag)ag_pill(ctx,x+210+ag_tw(ctx,r.id,{w:500,size:28,f:"mono"})+30+(ag_tw(ctx,r.tag,{w:700,size:28})+56)/2,ry+22,r.tag,{size:28,col:AG.violet,a:ra});}});
  ctx.restore();ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the faculties' questions, and the answers */
const UG_ASKS=[["Faculty of Health","How many in Nursing?","Nursing"],["Business","How many in first year?","First year"],["Engineering and IT","How many part-time?","Part-time"]];
function ug_ask(ctx,x,y,w,i,o){o=o||{};const q=UG_ASKS[i];return ag_textCard(ctx,x,y,w,{kick:q[0],title:q[1]},Object.assign({kickCol:AG.kick},o));}
/* the answers, in a stack: o.n (0 to 3, each springing in), o.tick 0 to 1 (a green tick on each), o.sign 0 to 1 (the agent's own name
   on each, in violet); (x, y) the stack's top left */
function ug_answers(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,n=o.n==null?3:o.n;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<3;i++){const k=clamp(n-i,0,1);if(k<=0)continue;const by=y+i*104,s=ag_spr(k,0,0.5),h=88;
    ctx.save();ctx.globalAlpha*=clamp(k*3,0,1);ag_about(ctx,x+w/2,by+h/2,lerp(0.6,1,s));ag_box(ctx,x,by,w,h,18,{edge:AG.orange,edgeA:0.6});
    ag_T(ctx,"ANSWER",x+28,by+38,{w:700,size:28,ls:4,col:AG.orange});ag_T(ctx,UG_ASKS[i][2],x+28,by+74,{w:700,size:30});
    if(o.tick>0)withA(ctx,o.tick,()=>ag_tick(ctx,x+w-46,by+h/2,28,rgba(AG.green,1),5));
    if(o.sign>0)ag_T(ctx,"registrar agent",x+w-(o.tick>0?86:28),by+74,{w:700,size:28,align:"right",col:AG.violet,a:o.sign});
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the agent's thread to its model, and the calls along it
   ug_thread(ctx, p, u, o): a violet thread along the curve p ([x0,y0, x1,y1, x2,y2, x3,y3]) drawn out to u; o.beads (a time: the calls
   travel along it), o.n beads, o.a */
function ug_thread(ctx,p,u,o){o=o||{};const a=o.a==null?1:o.a;if(u<=0.002||a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  ctx.strokeStyle=rgba(AG.shadow,0.12);ctx.lineWidth=7;ctx.save();ctx.translate(AG.sdx,8);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  ctx.strokeStyle=rgba(AG.violet,0.72);ctx.lineWidth=4.5;ag_bzPath(ctx,p,0,u);ctx.stroke();
  ctx.strokeStyle=rgba(AG.visorLight,0.5);ctx.lineWidth=1.5;ctx.save();ctx.translate(0,-1.5);ag_bzPath(ctx,p,0,u);ctx.stroke();ctx.restore();
  if(o.beads!=null){const n=o.n||4,sp=o.speed||0.22;for(let i=0;i<n;i++){const v=((o.beads*sp+i/n)%1+1)%1;if(v>u)continue;const q=ag_bz(p,v);
    ctx.save();ctx.shadowColor=rgba(AG.violet,0.6);ctx.shadowBlur=10;ctx.fillStyle=rgba(mix(AG.violet,[255,255,255],0.25),1);rr(ctx,q[0]-9,q[1]-6,18,12,6);ctx.fill();ctx.restore();}}
  ctx.restore();}

/* ---------------------------------------------------------------- the frames on the wall
   ug_gateway(ctx, cx, y, w, h, o): Unity Gateway, a tall frame of pale oak with a blue edge round its opening, standing on the wall
   where the agent's thread passes, its name over it; o.p 0 to 1 (it draws itself, from the bottom), o.a, o.label (false: none).
   ug_catalog(ctx, x, y, w, h, o): Unity Catalog, a wide oak frame on the wall that holds cards, its name over its top left; o.p, o.a. */
function ug_gateway(ctx,cx,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,p=clamp(o.p==null?1:o.p,0,1);if(a<=0||p<=0)return;const x=cx-w/2,b=20,hh=h*ag_sine(p),yy=y+h-hh;
  ctx.save();ctx.globalAlpha*=a;
  const fr=c=>{ag_rect(c,x,yy,w,hh,16);ag_rect(c,x+b,yy+b,w-2*b,Math.max(0,hh-2*b),8);};
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.26)";ctx.shadowBlur=22;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=12;ctx.beginPath();fr(ctx);ctx.fillStyle=rgba(AG_OAK.base,1);ctx.fill("evenodd");ctx.restore();
  ctx.save();ctx.beginPath();fr(ctx);ctx.clip("evenodd");const g=ctx.createLinearGradient(x,yy,x+w,yy+hh);g.addColorStop(0,rgba(AG_OAK.hi,0.9));g.addColorStop(1,rgba(AG_OAK.dark,0.6));ctx.fillStyle=g;ctx.fillRect(x,yy,w,hh);ctx.restore();
  if(hh>2*b){ctx.strokeStyle=rgba(AG.blue,0.9);ctx.lineWidth=3.4;rr(ctx,x+b,yy+b,w-2*b,hh-2*b,8);ctx.stroke();}
  if(o.label!==false)ag_label(ctx,cx,y-26,"Unity Gateway",{align:"center",a:ag_in(p,0.6,0.4)});
  ctx.restore();}
function ug_catalog(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,p=clamp(o.p==null?1:o.p,0,1);if(a<=0||p<=0)return;const ww=w*ag_sine(p),b=16;
  ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgba(46,38,28,0.05)";rr(ctx,x+b,y+b,Math.max(0,ww-2*b),h-2*b,10);ctx.fill();
  const fr=c=>{ag_rect(c,x,y,ww,h,18);if(ww>2*b)ag_rect(c,x+b,y+b,ww-2*b,h-2*b,10);};
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=20;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=10;ctx.beginPath();fr(ctx);ctx.fillStyle=rgba(AG_OAK.base,1);ctx.fill("evenodd");ctx.restore();
  ctx.save();ctx.beginPath();fr(ctx);ctx.clip("evenodd");const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,rgba(AG_OAK.hi,0.85));g.addColorStop(1,rgba(AG_OAK.dark,0.45));ctx.fillStyle=g;ctx.fillRect(x,y,ww,h);ctx.restore();
  ag_label(ctx,x+8,y-22,o.label||"Unity Catalog",{a:ag_in(p,0.5,0.4)});ctx.restore();}

/* ---------------------------------------------------------------- the gateway's pieces
   ug_service: a model service, a card in the catalog: "Model service", who it's granted to (o.who) or "not granted"; o.lit 0 to 1 (its
   grant lights), o.grey (not granted), o.a, o.k. ug_check: a check in the gateway, a pill (no "beta" beside it: a status changes, and the film would have to change with it).
   ug_slip: a small slip of paper in amber, the words hidden to trick an agent. ug_prompt: a prompt riding the thread, with an email
   address in it, never written out: a chip, "an email address", that a grey band hides (o.hide 0 to 1). ug_dial: the limit. */
function ug_service(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,grey=o.grey||0,lit=clamp(o.lit||0,0,1),h=148;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a*(1-0.4*grey);if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,20,{edge:lit>0.02?AG.blue:null,edgeA:0.9*lit,glow:lit>0.02?AG.blue:null,glowA:lit*0.8});
  ag_T(ctx,"MODEL SERVICE",x+28,y+48,{w:700,size:28,ls:4,col:AG.kick});
  if(grey){ag_T(ctx,"not granted",x+28,y+104,{w:700,size:30,col:AG.mut});}
  else{ag_lock(ctx,x+42,y+96,28,rgba(AG.blue,1));ag_T(ctx,"granted · "+o.who,x+66,y+104,{w:700,size:30});}
  ctx.restore();return{x,y,w,h};}
function ug_check(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const b=ag_pill(ctx,x,y,text,{icon:o.icon||"lock",col:o.col||AG.blue,a,size:28});
  return{x:b.x,y:b.y,w:b.w,h:b.h};}
function ug_slip(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const text=o.text||"ignore your rules",w=ag_tw(ctx,text,{w:700,size:28})+52,h=56;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot==null?-0.05:o.rot);if(o.k!=null)ctx.scale(lerp(0.6,1,o.k),lerp(0.6,1,o.k));
  ag_box(ctx,-w/2,-h/2,w,h,8,{edge:AG.amber,edgeA:0.85});ag_T(ctx,text,0,10,{w:700,size:28,align:"center",col:AG.amber});ctx.restore();}
function ug_prompt(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=430,h=150;if(a<=0)return;const hide=clamp(o.hide||0,0,1);
  ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,18,{edge:AG.violet,edgeA:0.5});
  ag_T(ctx,"PROMPT",x+28,y+46,{w:700,size:28,ls:4,col:AG.violet});ag_T(ctx,"Nursing, this week;",x+28,y+88,{w:600,size:28});
  const cw=ag_tw(ctx,"an email address",{w:700,size:28})+36;ag_T(ctx,"reply to",x+28,y+128,{w:600,size:28});
  const cx=x+28+ag_tw(ctx,"reply to ",{w:600,size:28});ctx.fillStyle=rgba(AG.amber,0.12*(1-hide));rr(ctx,cx,y+100,cw,40,10);ctx.fill();
  ag_T(ctx,"an email address",cx+18,y+128,{w:700,size:28,col:AG.amber,a:1-hide});
  if(hide>0){ctx.fillStyle=rgba([150,146,140],0.85*hide);rr(ctx,cx,y+100,cw*ag_sine(hide),40,10);ctx.fill();
    if(hide>0.7)ag_T(ctx,"hidden",cx+cw/2,y+128,{w:700,size:28,align:"center",col:[255,255,255],a:(hide-0.7)/0.3});}
  ctx.restore();}
function ug_dial(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  ag_soft(ctx,c=>c.arc(x,y,r,0,TAU),[236,233,227],[255,253,248],x+r*0.4,y-r*0.5,r*1.4,"rgba(46,38,28,0.3)",10);
  ctx.strokeStyle=rgba(AG.mut,0.6);ctx.lineWidth=2.5;for(let i=0;i<=8;i++){const an=Math.PI*(0.8+1.4*i/8);ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.72,y+Math.sin(an)*r*0.72);ctx.lineTo(x+Math.cos(an)*r*0.86,y+Math.sin(an)*r*0.86);ctx.stroke();}
  ctx.strokeStyle=rgba(AG.blue,0.9);ctx.lineWidth=5;ctx.beginPath();ctx.arc(x,y,r*0.79,Math.PI*(0.8+1.4*0.82),Math.PI*(0.8+1.4*0.9));ctx.stroke();
  const an=Math.PI*(0.8+1.4*clamp(o.v==null?0.6:o.v,0,1));ctx.strokeStyle="#36373C";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(an)*r*0.66,y+Math.sin(an)*r*0.66);ctx.stroke();
  ctx.fillStyle="#2B2B32";ctx.beginPath();ctx.arc(x,y,8,0,TAU);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- what it costs, under its name */
function ug_usage(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,bud=clamp(o.budget||0,0,1),h=bud>0?262:184;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.5});ag_T(ctx,"USAGE",x+28,y+48,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,"registrar agent",x+28,y+92,{w:700,size:32,col:AG.violet});
  [["calls",0.62],["tokens",0.8]].forEach(([s,f],i)=>{const by=y+118+i*30;ag_T(ctx,s,x+28,by+22,{w:600,size:28,col:AG.mut});const bx=x+150,bw=(w-150-32)*f*clamp(o.fill==null?1:o.fill,0,1);
    ctx.fillStyle=rgba(AG.blue,0.55);rr(ctx,bx,by+6,Math.max(8,bw),16,8);ctx.fill();});
  if(bud>0)withA(ctx,bud,()=>{ctx.strokeStyle="rgba(60,50,40,0.16)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+28,y+186);ctx.lineTo(x+w-28,y+186);ctx.stroke();
    ag_T(ctx,"Registrar's budget",x+28,y+226,{w:600,size:28,col:AG.mut});ag_T(ctx,"about $300 a month",x+w-28,y+226,{w:700,size:30,align:"right"});});
  ctx.restore();}

/* ---------------------------------------------------------------- grants, the policy and the groups
   ug_grants(ctx, x, y, w, who, lines, o): a card of what an identity may do: "Grants", who, and lines [{text, lock (a blue lock), no (struck
   through: not granted), a}]. ug_policy: the project's one policy that masks every column tagged direct. ug_group: a group of the
   account, its name and its members as tags that come in one by one (o.n); o.out [i] a member greyed, as not in it. */
function ug_grants(ctx,x,y,w,who,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const h=28+38+44+lines.length*46+30;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.55});
  ag_T(ctx,"GRANTS",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,who,x+28,y+96,{w:700,size:34});
  lines.forEach((l,i)=>{const ly=y+148+i*46,la=l.a==null?1:l.a;if(la<=0)return;
    if(l.lock)ag_lock(ctx,x+42,ly-6,26,rgba(AG.blue,la));ag_T(ctx,l.text,x+(l.lock||l.no?68:28),ly,{w:600,size:28,a:la,col:l.no?AG.mut:AG.ink});
    if(l.no){withA(ctx,la,()=>{ctx.strokeStyle=rgba(AG.mut,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+30,ly-26);ctx.lineTo(x+54,ly+2);ctx.moveTo(x+54,ly-26);ctx.lineTo(x+30,ly+2);ctx.stroke();});}});
  ctx.restore();return{x,y,w,h};}
function ug_policy(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const h=200,g=clamp(o.glow||0,0,1);
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.5+0.45*g,glow:g>0.02?AG.blue:null,glowA:g});
  ag_T(ctx,"POLICY",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,"mask_direct_personal_data",x+28,y+100,{w:500,size:30,f:"mono"});
  ag_T(ctx,"to account users,",x+28,y+144,{w:600,size:28,col:AG.mut});ag_T(ctx,"except the readers",x+28,y+180,{w:600,size:28,col:AG.mut});
  ctx.restore();return{x,y,w,h};}
function ug_group(ctx,x,y,w,name,members,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const n=o.n==null?members.length:o.n,h=28+38+44+members.length*64+18;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:o.edge,edgeA:0.6});
  ag_T(ctx,"GROUP",x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});ag_T(ctx,name,x+28,y+96,{w:500,size:30,f:"mono"});
  members.forEach((m,i)=>{const k=clamp(n-i,0,1);if(k<=0)return;const my=y+142+i*64,agent=m[1];
    withA(ctx,clamp(k*2,0,1)*(o.out&&o.out[i]?0.45:1),()=>{const tw=ag_tw(ctx,m[0],{w:700,size:28})+56;ag_box(ctx,x+28,my-24,tw,48,24,{edge:agent?AG.violet:null,edgeA:0.6});
      ag_T(ctx,m[0],x+28+tw/2,my+10,{w:700,size:28,align:"center",col:agent?AG.violet:AG.ink});});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the row filter, in pencil
   A table drawn in pencil, "a sketch" (the project has no row filter), its rows the faculties; o.filter 0 to 1: a blue filter slides
   over it and keeps one row lit (o.keep), the others greyed */
const UG_FAC=["Arts and Education","Business","Engineering and IT","Health"];
function ug_sketch(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const rh=58,h=44+UG_FAC.length*rh+20,f=clamp(o.filter||0,0,1);ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle="rgba(250,248,242,0.92)";rr(ctx,x,y,w,h,12);ctx.fill();
  ctx.strokeStyle="rgba(80,78,74,0.7)";ctx.lineWidth=2;ctx.lineCap="round";const wob=(x0,y0,x1,y1,s)=>{ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2+s,(y0+y1)/2-s,x1,y1);ctx.stroke();};
  wob(x+6,y+6,x+w-6,y+8,2);wob(x+w-6,y+8,x+w-4,y+h-6,-2);wob(x+w-4,y+h-6,x+8,y+h-4,2);wob(x+8,y+h-4,x+6,y+6,-2);
  ag_T(ctx,"a sketch",x+w-24,y-16,{w:600,size:28,align:"right",col:AG.mut});
  UG_FAC.forEach((s,i)=>{const ry=y+44+i*rh;if(i)wob(x+16,ry-14,x+w-16,ry-12,1);const kept=i===o.keep,dim=f*(kept?0:0.6);
    if(kept&&f>0){ctx.fillStyle=rgba(AG.blue,0.12*f);rr(ctx,x+12,ry-10,w-24,rh-4,8);ctx.fill();}
    ag_T(ctx,s,x+30,ry+28,{w:600,size:30,col:mix(AG.ink,[170,166,160],dim)});
    for(let k=0;k<3;k++){ctx.fillStyle=rgba([120,116,110],0.35*(1-dim));rr(ctx,x+w-250+k*76,ry+8,56,14,7);ctx.fill();}});
  if(f>0&&f<1){const fx=x-20+(w+40)*ag_sine(f);ctx.fillStyle=rgba(AG.blue,0.18);ctx.fillRect(fx-6,y,12,h);}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the function, and the tool servers
   ug_function(ctx, x, y, w, o): the census count as a function in the catalog: its name in code, "may run · can't change" with a lock,
   and who owns it (o.owner); o.lit 0 to 1 (an arm touches it, its edge blue), o.a, o.k */
function ug_function(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,lit=clamp(o.lit||0,0,1),h=196;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,20,{edge:AG.blue,edgeA:0.45+0.5*lit,glow:lit>0.02?AG.blue:null,glowA:lit});
  ag_T(ctx,"FUNCTION",x+28,y+48,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,"census_day_students(faculty)",x+28,y+96,{w:500,size:28,f:"mono"});
  ag_lock(ctx,x+42,y+136,28,rgba(AG.blue,1));ag_T(ctx,"may run · can't change",x+66,y+144,{w:600,size:28,col:AG.mut,a:o.rule==null?1:o.rule});
  if(o.owner)ag_T(ctx,"owner · "+o.owner,x+28,y+180,{w:600,size:28,col:AG.mut,a:o.ownerA==null?1:o.ownerA});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the query, its answer, and lineage */
const UG_SQL=["select event_time, user_identity.email","from system.access.audit","where action_name = 'getTable'"];
function ug_query(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=96+UG_SQL.length*40+18;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,20,{edge:AG.blue,edgeA:0.5});ag_T(ctx,"who_read_a_table.sql",x+28,y+50,{w:700,size:28,col:AG.blue});
  UG_SQL.forEach((l,i)=>ag_T(ctx,l,x+28,y+98+i*40,{w:500,size:28,f:"mono"}));ctx.restore();return{x,y,w,h};}
// a small table card for lineage: its name in code; (x, y) its top left; returns its box
function ug_table(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,w=ag_tw(ctx,name,{w:500,size:28,f:"mono"})+60,h=64;if(a<=0)return{x,y,w,h};
  ag_box(ctx,x,y,w,h,14,{a,edge:o.edge,edgeA:0.6});withA(ctx,a,()=>{ctx.fillStyle=rgba(AG.blue,0.35);rr(ctx,x+12,y+12,8,h-24,4);ctx.fill();ag_T(ctx,name,x+36,y+42,{w:500,size:28,f:"mono"});});return{x,y,w,h};}
// a thin graphite line from one point to another, drawn as far as p, with a small arrowhead at its end
function ug_line(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a,u=ag_sine(p),xe=lerp(x0,x1,u),ye=lerp(y0,y1,u);ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=o.col?rgba(o.col,0.85):"rgba(87,82,76,0.7)";ctx.lineWidth=o.lw||2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();
  if(p>0.95&&o.head!==false)ag_arrowHead(ctx,x1,y1,Math.atan2(y1-y0,x1-x0),9,o.col?rgba(o.col,0.9):"rgba(87,82,76,0.85)");ctx.restore();}

/* ---------------------------------------------------------------- the page for agents, and a card in the module's way
   ug_page(ctx, x, y, w, head, lines, o): a page of the project's AGENTS.md, its section's name and its words (lines, already broken);
   o.blur 0 to 1 (the words blur, as when misread), o.a, o.k. ug_card: ag_textCard with the module's kicker colour. */
function ug_page(ctx,x,y,w,head,lines,o){o=o||{};const a=o.a==null?1:o.a,h=28+38+46+lines.length*40+26;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,20,{edge:o.edge,edgeA:0.6});ag_T(ctx,"AGENTS.md",x+28,y+50,{w:500,size:28,f:"mono",col:AG.kick});ag_T(ctx,head,x+28,y+96,{w:700,size:32});
  const bl=clamp(o.blur||0,0,1);if(bl>0)ctx.filter="blur("+(bl*3.2)+"px)";lines.forEach((l,i)=>ag_T(ctx,l,x+28,y+142+i*40,{w:600,size:28,deco:bl>0.05?1:0}));ctx.filter="none";
  ctx.restore();return{x,y,w,h};}
function ug_card(ctx,x,y,w,words,o){o=o||{};return ag_textCard(ctx,x,y,w,words,Object.assign({kickCol:AG.kick},o));}

/* ---------------------------------------------------------------- the census count (A model, reasoning, hands and a loop's answer)
   o.gov (0 to 1) the line under its pill, "to the government"; o.w its width; o.k springs it in */
function ug_count(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||470;if(a<=0)return null;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+90,lerp(0.6,1,o.k));
  const b=ag_textCard(ctx,x,y,w,{kick:"Census-day count",title:"18,412 students"},{kickCol:AG.kick});
  ag_pill(ctx,x+28+ag_tw(ctx,"Matches the source",{w:700,size:30})/2+48,b.y+b.h+44,"Matches the source",{icon:"tick",col:AG.green,a:o.pass==null?1:o.pass});
  if(o.gov>0)ag_T(ctx,"to the government",x+28,b.y+b.h+118,{w:600,size:28,col:AG.mut,a:o.gov});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the badge and the owner tag on the ring's hook
   ug_badge: the series' badge (ag_badge), drawn here so it can grey when its service principal is switched off (o.grey) and drop in
   on its lanyard (o.drop springing); ug_badgeOn puts it on the ring's hook, o.k 0 to 1 dropping in; ug_ownerOn the owner tag. */
function ug_badge(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const drop=o.drop||56,sw=Math.sin((o.t||0)*1.3)*0.025+(o.sw||0),w=ag_tw(ctx,text,{w:700,size:28})+48,h=58,g=clamp(o.grey||0,0,1);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(sw);
  ctx.strokeStyle=rgba(mix(AG.blue,[150,148,144],g),0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-26,0);ctx.lineTo(-8,drop-10);ctx.moveTo(26,0);ctx.lineTo(8,drop-10);ctx.stroke();
  ctx.fillStyle="#9AA0A8";ctx.fillRect(-9,drop-14,18,14);
  ag_box(ctx,-w/2,drop,w,h,10,{});ctx.fillStyle=rgba(mix(AG.blue,[160,158,154],g),0.85);ctx.fillRect(-w/2+10,drop+4,w-20,5);
  ag_T(ctx,text,0,drop+h/2+15,{w:700,size:28,align:"center",col:mix(AG.ink,[150,148,144],g)});
  if(g>0.5&&o.off)ag_T(ctx,"switched off",0,drop+h+40,{w:700,size:28,align:"center",col:AG.mut,a:(g-0.5)*2});
  ctx.restore();}
function ug_badgeOn(x,tt,text,o){o=o||{};const k=o.k==null?1:o.k;if(k<=0)return;const A=UG.agent,hx=(o.x==null?A.x:o.x)+50,hy=(o.y==null?A.y:o.y)+(o.R||A.R)-2;
  const fall=1-clamp(ag_spr(k,0,0.5),0,1.2);ug_badge(x,hx,hy-fall*160,text,{t:tt,drop:56,a:clamp(k*3,0,1)*(o.a==null?1:o.a),grey:o.grey,off:o.off,sw:fall*0.2});}
function ug_ownerOn(x,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const A=UG.agent,k=o.k==null?1:o.k,fall=1-clamp(ag_spr(k,0,0.5),0,1.2);
  ug_tag(x,(o.x==null?A.x:o.x)-30,(o.y==null?A.y:o.y)+(o.R||A.R)-2-fall*120,text,{dx:-230,dy:80,sw:fall*0.25,a:a*clamp(k*3,0,1)});}
