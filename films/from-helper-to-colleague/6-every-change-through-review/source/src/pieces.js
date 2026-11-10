/* ===== Every change through review: the room's own pieces =====
   The film's pieces in the module's lab, all prefixed ec_ / EC (the module's shared code is never changed for one film). The agent in
   its ring, its badge, its owner's tag and a person at the left are copied from An agent with its own badge's pieces (its ob_ helpers,
   as its branch had them on 5 November 2026), under this film's prefix, so the badge looks the same from one film to the next; the
   five stages are the series' picture, copied whole from Five stages, not a switch (its fs_stages, as its branch had it on 5 November
   2026), as the series' briefs ask.
     the room's usual shot (EC): a person standing at the left, the agent in its ring in the middle, and the wall's right for what it
     shows; or the agent at the left (EC_AL) with the wall to its right; its pieces: the pull request, Planning's class plan and its
     units, a laboratory's benches, the faculties, the path every change takes, the branches, a schema, the five stages, the tests, the
     project's lineage, a terminal's lines, two tables side by side, a checklist, the map's steps, cards of rows, the release's two
     jobs, its pass and its bundle, and a tool's logo with its name.
   Colours keep the module's meanings: blue structure (a rule, a file, the pull request, the map's roles, the release's jobs), violet
   the model and what an agent does (its band, its branch, its review), orange the data and its evidence, green a check that passes or
   a person's yes, amber what's missing or could go wrong. The agents look alike: each wears its badge, with its name on it, and none
   is ever in two places at once. */

// a value worked out once per chapter (the cue times its scene uses)
function ec_once(sc,k,fn){sc.__ec=sc.__ec||{};if(!(k in sc.__ec))sc.__ec[k]=fn();return sc.__ec[k];}

/* ---------------------------------------------------------------- where things stand in the room */
// the room's usual shot: a person at the left, the agent in its ring in the middle, the wall's right for cards
const EC={agent:{x:1080,y:430,R:150,r:78},who:{x:250,y:610,s:0.98},right:{x:1296,w:570}};
// the agent with the room to itself, at the left, where a person stands in the usual shot; and two agents, at either side
const EC_AL={x:330,y:430,R:130,r:68},EC_LA={x:300,y:460,R:120,r:62},EC_RA={x:1620,y:460,R:120,r:62};
// the marble kept quiet where the film puts words: across the middle, top and right
const EC_QUIET=[[1180,450,720,330,0.5],[640,96,560,46,0.3],[360,430,300,260,0.4],[960,250,860,170,0.35]];
AG_PLACES.ecLab=c=>ag_paintLab(c,{quiet:EC_QUIET});
// the bare room, in a later moment's pass through it, keeps the light every shot of it draws
AG_BARE.ecLab=c=>ag_roomLight(c,1);
const EC_KICK=(x,a)=>ag_kicker(x,"3.6","Every change through review",{a});
// the kicker, on the frame and drawn once by each chapter after its shots, so a glide never moves it and a pass through the bare room
// never takes it away
function ec_kick(ctx,S,a){if(!(a>0))return;ctx.save();setScreen(ctx,S);EC_KICK(ctx,a);ctx.restore();}
// what fn draws, laid on the picture at opacity a as one picture: a person or a ring faded layer by layer shows through itself
function ec_asOne(ctx,a,fn,key){if(a>=1)return fn(ctx);if(!(a>0))return;const [bc,bx]=ag_buf(key||"ecOne",ctx.canvas.width,ctx.canvas.height);
  bx.setTransform(ctx.getTransform());fn(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}
// text on its way somewhere, too small to read for a moment, is decoration on purpose: PH_OFF is the legibility check's hook, as From
// words to data's tools name it
let PH_OFF=0;
function ec_deco(on,fn){if(!on)return fn();PH_OFF++;try{return fn();}finally{PH_OFF--;}}
// the corner tag: where and when
function ec_corner(ctx,text,a){if(!(a>0))return;const w=ag_tw(ctx,text.toUpperCase(),{w:700,size:30,ls:3})+56;
  ag_box(ctx,72,64,w,62,31,{a:a*0.92});ag_T(ctx,text.toUpperCase(),100,106,{w:700,size:30,ls:3,col:AG.kick,a});}
// two corner tags one after the other at the same place: the first leaves before the second comes, so their words never overlap
function ec_corners(ctx,t,a,first,second,at){ec_corner(ctx,first,a*(1-ag_in(t,at,0.4)));ec_corner(ctx,second,a*ag_in(t,at+0.45,0.45));}
// a card in the module's way, and a pill that springs in at t0 (and fades at t1); ec_pillL puts the pill's left edge at x
function ec_card(ctx,x,y,w,words,o){o=o||{};return ag_textCard(ctx,x,y,w,words,Object.assign({kickCol:AG.kick},o));}
function ec_pillAt(ctx,x,y,text,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));const b=ag_pill(ctx,x,y,text,Object.assign({size:28},o||{}));ctx.restore();return b;}
function ec_pillW(ctx,text,o){return ag_tw(ctx,text,{w:700,size:28})+(o&&o.icon?96:56);}
function ec_pillL(ctx,x,y,text,t,t0,t1,o){o=o||{};const w=ag_tw(ctx,text,{w:700,size:28})+(o.icon?96:56);return ec_pillAt(ctx,x+w/2,y,text,t,t0,t1,o);}
// a line drawn from one point to another as p goes 0 to 1, with an arrow's head once it's there
function ec_line(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a,u=ag_sine(p),xe=lerp(x0,x1,u),ye=lerp(y0,y1,u);ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=o.col?rgba(o.col,0.85):"rgba(87,82,76,0.7)";ctx.lineWidth=o.lw||2.6;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);
  if(p>0.95&&o.head!==false)ag_arrowHead(ctx,x1,y1,Math.atan2(y1-y0,x1-x0),9,o.col?rgba(o.col,0.9):"rgba(87,82,76,0.85)");ctx.restore();}
// a soft cross over something refused
function ec_cross(ctx,x,y,s,a,col){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col||AG.amber,0.95);ctx.lineWidth=5;ctx.lineCap="round";
  const k=ag_sine(clamp(a*1.4,0,1));ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x-s+2*s*k,y-s+2*s*k);ctx.moveTo(x+s,y-s);ctx.lineTo(x+s-2*s*k,y-s+2*s*k);ctx.stroke();ctx.restore();}
// a card's spring: the card scales about its middle from 0.6 as k goes 0 to 1 (and settles)
function ec_springAbout(ctx,x,y,w,h,k){if(k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,k));}

/* ---------------------------------------------------------------- a tool's logo, where the film names the tool
   ec_logo(ctx, key, x, y, h): the logo (logos.js), h tall, its left edge at x, its middle at y; it returns its width.
   ec_tool(ctx, x, y, key, name, o): the logo and the tool's name on a pill, its left edge at x, its middle at y; o.a, o.k. */
function ec_logo(ctx,key,x,y,h){if(typeof LOGO==="undefined"||!LOGO[key])return h;return logo(ctx,key,x,y-h/2,h);}
function ec_toolW(ctx,name){return 24+40+16+ag_tw(ctx,name,{w:700,size:30})+30;}
function ec_tool(ctx,x,y,key,name,o){o=o||{};const a=o.a==null?1:o.a,w=ec_toolW(ctx,name),h=64;if(a<=0)return{x,y:y-h/2,w,h};ctx.save();ctx.globalAlpha*=a;
  ec_springAbout(ctx,x,y-h/2,w,h,o.k);ag_box(ctx,x,y-h/2,w,h,h/2,{edge:o.edge||null,edgeA:0.6});ec_logo(ctx,key,x+24,y,40);
  ag_T(ctx,name,x+24+40+16,y+11,{w:700,size:30});ctx.restore();return{x,y:y-h/2,w,h};}

/* ---------------------------------------------------------------- the agent
   ec_agent(ctx, t, o): the loop at EC.agent unless o.x, o.y, o.R, o.r; o.core, o.think, o.p, o.a, o.dim (0 to 1: the band goes dark);
   its shadow on the floor; no label: its badge and its tags say who it is. */
function ec_agent(ctx,t,o){o=o||{};const A=EC.agent,x=o.x==null?A.x:o.x,y=o.y==null?A.y:o.y,R=o.R||A.R,r=o.r||A.r,a=o.a==null?1:o.a,dim=clamp(o.dim||0,0,1);
  if(a<=0)return[];if(o.floor!==false)withA(ctx,a,()=>ag_floorShadow(ctx,x+AG.sdx*3,Math.max(y+R+130,700),R*1.15,22,0.2));
  return ag_loop(ctx,x,y,{R,r,t,a,p:o.p,core:(o.core==null?1:o.core)*(1-dim*0.92),think:(o.think||0)*(1-dim),pulse:o.pulse,label:null});}

/* ---------------------------------------------------------------- the badge, and the owner's tag on the ring's hook (as An agent
   with its own badge draws them): ec_badge, the series' badge on its lanyard; ec_badgeOn puts it on the ring's hook; ec_tag a paper
   tag on a string from a point; ec_tagOn the owner's tag on the ring's left; ec_agentWith an agent of this film, whole: its ring, its
   badge and its owner's tag (o: the ring's own options, badge, tag, dx, bk/tk 0 to 1 dropping in) */
function ec_badge(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const drop=o.drop||56,sw=Math.sin((o.t||0)*1.3)*0.025+(o.sw||0),w=ag_tw(ctx,text,{w:700,size:28})+48,h=58;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(sw);
  ctx.strokeStyle=rgba(AG.blue,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-26,0);ctx.lineTo(-8,drop-10);ctx.moveTo(26,0);ctx.lineTo(8,drop-10);ctx.stroke();
  ctx.fillStyle="#9AA0A8";ctx.fillRect(-9,drop-14,18,14);
  ag_box(ctx,-w/2,drop,w,h,10,{});ctx.fillStyle=rgba(AG.blue,0.85);ctx.fillRect(-w/2+10,drop+4,w-20,5);
  ag_T(ctx,text,0,drop+h/2+15,{w:700,size:28,align:"center",col:AG.ink});ctx.restore();}
function ec_hook(o){o=o||{};const A=EC.agent;return[(o.x==null?A.x:o.x)+50,(o.y==null?A.y:o.y)+(o.R||A.R)-2];}
function ec_badgeOn(ctx,tt,text,o){o=o||{};const k=o.k==null?1:o.k;if(k<=0)return;const h=ec_hook(o);
  const fall=1-clamp(ag_spr(k,0,0.5),0,1.2);ec_badge(ctx,h[0],h[1]-fall*160,text,{t:tt,drop:56,a:clamp(k*3,0,1)*(o.a==null?1:o.a),sw:fall*0.2});}
function ec_tag(ctx,hx,hy,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const dx=o.dx==null?-120:o.dx,dy=o.dy==null?70:o.dy,size=28,w=ag_tw(ctx,text,{w:700,size})+70,h=56;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(hx,hy);ctx.rotate(o.sw||0);
  ctx.strokeStyle="rgba(87,82,76,0.85)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(dx*0.4,dy*0.3,dx+(dx<0?w/2-22:-w/2+22),dy);ctx.stroke();
  ctx.translate(dx,dy);const l=dx<0;ag_card(ctx,c=>{if(l){c.moveTo(-w/2+16,-h/2);c.lineTo(w/2,-h/2);c.lineTo(w/2,h/2);c.lineTo(-w/2+16,h/2);c.lineTo(-w/2,0);}
    else{c.moveTo(-w/2,-h/2);c.lineTo(w/2-16,-h/2);c.lineTo(w/2,0);c.lineTo(w/2-16,h/2);c.lineTo(-w/2,h/2);}c.closePath();},{x:-w/2,y:-h/2,w,h},{edge:o.edge,edgeA:0.7});
  ctx.fillStyle="rgba(87,82,76,0.6)";ctx.beginPath();ctx.arc(l?w/2-22:-w/2+22,0,5,0,TAU);ctx.fill();
  ag_T(ctx,text,l?-w/2+26:-w/2+44,size*0.36,{w:700,size,col:o.col});ctx.restore();}
function ec_tagOn(ctx,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const A=EC.agent,k=o.k==null?1:o.k,fall=1-clamp(ag_spr(k,0,0.5),0,1.2);
  ec_tag(ctx,(o.x==null?A.x:o.x)-30,(o.y==null?A.y:o.y)+(o.R||A.R)-2-fall*120,text,{dx:o.dx==null?-230:o.dx,dy:80,sw:fall*0.25,a:a*clamp(k*3,0,1),edge:o.edge,col:o.col});}
function ec_agentWith(ctx,tt,o){o=o||{};ec_agent(ctx,tt,o);const at={x:o.x,y:o.y,R:o.R};
  if(o.badge)ec_badgeOn(ctx,tt,o.badge,Object.assign({},at,{k:o.bk,a:o.a}));
  if(o.tag)ec_tagOn(ctx,o.tag,Object.assign({},at,{k:o.tk,a:o.a,dx:o.dx}));}
// the two agents of this film, whole, each with its badge (and its owner's tag where o.tag), faded as one picture at a
const EC_PLANNING={badge:"planning agent",tag:"owner · Clara Jensen",dx:-260},EC_REVIEWER={badge:"governance review agent",tag:"owner · Yusuf Demir",dx:-260};
function ec_theAgent(ctx,tt,who,o){o=Object.assign({think:0.25},who,o||{});const a=o.a==null?1:o.a;
  ec_asOne(ctx,a,bx=>ec_agentWith(bx,tt,Object.assign({},o,{a:1})),"ecAgent"+(o.key||""));}

/* ---------------------------------------------------------------- people
   ec_person(ctx, k, t, o): one of this film's people standing at the left (EC.who), facing right, arms down, faded as one picture at
   o.a; ec_personCard: their name and role on a card over them. */
const EC_PEOPLE={clara:["clara","Clara Jensen","Planning · product owner"],jun:["jun","Jun Park","Analytics engineer"],mei:["mei","Mei Tanaka","Data owner"],
  noor:["noor","Noor Rahman","Release approver"],yusuf:["yusuf","Yusuf Demir","Data governance lead"]};
function ec_person(ctx,k,t,o){o=o||{};const P=EC_PEOPLE[k],W_=EC.who,a=o.a==null?1:o.a;if(a<=0.01)return P;
  ec_asOne(ctx,a,bx=>ag_person(bx,P[0],o.x==null?W_.x:o.x,o.y==null?W_.y:o.y,o.s||W_.s,Object.assign({t,gaze:[4,-1]},o.p||{})),"ecWho");return P;}
function ec_name(ctx,cx,y,name,role,a){if(!(a>0))return;const w=Math.max(ag_tw(ctx,name,{w:700,size:30}),ag_tw(ctx,role,{w:600,size:28}))+60,h=100;
  ag_box(ctx,cx-w/2,y,w,h,18,{a});withA(ctx,a,()=>{ag_T(ctx,name,cx,y+43,{w:700,size:30,align:"center"});ag_T(ctx,role,cx,y+80,{w:600,size:28,align:"center",col:AG.mut});});}
function ec_personCard(ctx,k,a){const P=EC_PEOPLE[k];ec_name(ctx,EC.who.x,196,P[1],P[2],a);}

/* ---------------------------------------------------------------- the pull request
   ec_pr(ctx, x, y, w, o): GitHub's pull request as a card: its logo and kick, its title (o.title, wrapped), who opened it (o.who, in
   mono, violet for an agent) and its rows, o.rows [{text, col, icon ("tick", "warn", "clip", "comment", "push"), a, hl, warn}];
   o.a, o.k, o.edge. It returns its box. */
function ec_icon(ctx,icon,x,y,col){const c=rgba(col||AG.ink,1);
  if(icon==="tick")ag_tick(ctx,x,y,24,c,4);else if(icon==="warn")ag_warn(ctx,x,y,30,c);else if(icon==="lock")ag_lock(ctx,x,y+4,28,c);
  else if(icon==="clip")ag_clip(ctx,x,y,30,c,3);else if(icon==="draft")ag_pen(ctx,x,y,28,c);
  else if(icon==="comment"){ctx.save();ctx.strokeStyle=c;ctx.lineWidth=3;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-14,y-11);ctx.lineTo(x+14,y-11);ctx.lineTo(x+14,y+7);
    ctx.lineTo(x-2,y+7);ctx.lineTo(x-9,y+14);ctx.lineTo(x-8,y+7);ctx.lineTo(x-14,y+7);ctx.closePath();ctx.stroke();ctx.restore();}
  else if(icon==="push"){ctx.save();ctx.fillStyle=c;ctx.strokeStyle=c;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y-15);ctx.lineTo(x,y+15);ctx.stroke();
    ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fillStyle="#F3F1ED";ctx.fill();ctx.stroke();ctx.restore();}
  else if(icon==="dot"){ctx.save();ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fill();ctx.restore();}}
function ec_prH(ctx,w,o){const tl=ag_wrap(ctx,o.title||"",w-56,{w:700,size:34});return 92+tl.length*44+(o.who?50:0)+(o.rows||[]).length*54+(o.rows&&o.rows.length?14:6);}
function ec_pr(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,tl=ag_wrap(ctx,o.title||"",w-56,{w:700,size:34}),rows=o.rows||[],h=ec_prH(ctx,w,o);if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;ec_springAbout(ctx,x,y,w,h,o.k);ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:0.6});
  ec_logo(ctx,"github",x+28,y+42,34);ag_T(ctx,(o.kick||"Pull request").toUpperCase(),x+76,y+52,{w:700,size:28,ls:4,col:AG.blue});
  let yy=y+60;tl.forEach(l=>{yy+=44;ag_T(ctx,l,x+28,yy,{w:700,size:34});});
  if(o.who){yy+=50;ag_T(ctx,o.who,x+28,yy,{w:500,size:28,f:"mono",col:o.whoCol||AG.violet});}
  yy+=14;rows.forEach(r=>{const ra=r.a==null?1:r.a,ry=yy;yy+=54;if(ra<=0)return;withA(ctx,ra,()=>{
      if(r.hl>0){ctx.fillStyle=rgba(r.col||AG.blue,0.09*r.hl);rr(ctx,x+14,ry+4,w-28,48,10);ctx.fill();}
      if(r.warn>0){ctx.save();ctx.globalAlpha*=r.warn;ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.amber,0.85);ctx.lineWidth=2.4;rr(ctx,x+14,ry+4,w-28,48,10);ctx.stroke();ctx.restore();}
      if(r.icon)ec_icon(ctx,r.icon,x+46,ry+28,r.col);ag_T(ctx,r.text,x+(r.icon?78:28),ry+38,{w:600,size:28,col:r.textCol||AG.ink});});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- Planning's class plan
   ec_plan(ctx, x, y, w, o): the class plan as a table, a few of its 1,236 units for next semester: each unit's code and kind, the
   students Planning expects, the class it plans for (o.own 0 to 1: from 25 for every unit to the unit's own class size) and its
   classes (o.after 0 to 1: from before to after; the old number leaves before the new comes, so the two never show at once).
   o.col25 (0 to 1) lights the column of 25s; o.lab (0 to 1) lights the laboratory's row; o.drop (0 to 1) strikes a unit out, amber;
   o.dbl (0 to 1) doubles a unit's classes, amber; o.more (0 to 1) the changes, green; o.a, o.k. */
const EC_UNITS=[["DA501","tutorial",118,25,5,5],["HI205","laboratory",120,16,5,8],["ED220","studio",96,20,4,5],["BA510","tutorial",64,25,3,3]];
function ec_swap(ctx,old,neu,u,x,y,f){u=clamp(u,0,1);if(u<0.5)ag_T(ctx,old,x,y,Object.assign({},f,{a:(f.a==null?1:f.a)*(1-ag_sine(u*2))}));
  else ag_T(ctx,neu,x,y,Object.assign({},f,{a:(f.a==null?1:f.a)*ag_sine(u*2-1)}));}
function ec_plan(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=58,h=212+EC_UNITS.length*rh+62;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  ec_springAbout(ctx,x,y,w,h,o.k);ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.orange,edgeA:0.55});
  ag_T(ctx,"PLANNING'S CLASS PLAN",x+28,y+52,{w:700,size:28,ls:4,col:AG.kick});ag_T(ctx,o.sub||"Next semester · 1,236 units",x+28,y+96,{w:600,size:28,col:AG.mut});
  const cS=x+w*0.6,cC=x+w*0.79,cN=x+w-28,hy=y+152;
  ag_T(ctx,"Unit",x+28,hy,{w:600,size:28,col:AG.mut});ag_T(ctx,"Students",cS,hy,{w:600,size:28,col:AG.mut,align:"right"});
  ag_T(ctx,"Class of",cC,hy,{w:600,size:28,col:AG.mut,align:"right"});ag_T(ctx,"Classes",cN,hy,{w:600,size:28,col:AG.mut,align:"right"});
  ctx.strokeStyle="rgba(87,82,76,0.2)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,hy+20);ctx.lineTo(x+w-24,hy+20);ctx.stroke();
  const c25=clamp(o.col25||0,0,1);if(c25>0){ctx.fillStyle=rgba(AG.orange,0.1*c25);rr(ctx,cC-120,hy+28,132,EC_UNITS.length*rh,10);ctx.fill();}
  EC_UNITS.forEach((u,i)=>{const ry=hy+28+i*rh,ty=ry+40,lab=i===1?clamp(o.lab||0,0,1):0,drop=i===3?clamp(o.drop||0,0,1):0,dbl=i===0?clamp(o.dbl||0,0,1):0,
      more=clamp(o.more||0,0,1)*(u[4]!==u[5]?1:0);
    if(lab>0){ctx.fillStyle=rgba(AG.amber,0.1*lab);rr(ctx,x+14,ry+4,w-28,rh-6,10);ctx.fill();}
    if(more>0){ctx.fillStyle=rgba(AG.green,0.09*more);rr(ctx,x+14,ry+4,w-28,rh-6,10);ctx.fill();}
    ag_T(ctx,u[0],x+28,ty,{w:500,size:28,f:"mono"});ag_T(ctx,u[1],x+28+ag_tw(ctx,u[0],{w:500,size:28,f:"mono"})+18,ty,{w:600,size:28,col:AG.mut});
    ag_T(ctx,String(u[2]),cS,ty,{w:600,size:28,align:"right"});
    ec_swap(ctx,"25",String(u[3]),u[3]===25?0:(o.own||0),cC,ty,{w:600,size:28,align:"right"});
    const after=clamp(o.after||0,0,1);
    if(dbl>0)ec_swap(ctx,String(u[4]),String(u[4]*2),dbl,cN,ty,{w:700,size:28,align:"right",col:dbl>0.5?AG.amber:AG.ink});
    else ec_swap(ctx,String(u[4]),String(u[5]),after,cN,ty,{w:700,size:28,align:"right",col:more>0.3&&after>0.5?AG.green:AG.ink});
    if(drop>0){ctx.save();ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+22,ty-10);ctx.lineTo(lerp(x+22,x+w-22,ag_sine(drop)),ty-10);ctx.stroke();ctx.restore();}
    if(i<EC_UNITS.length-1){ctx.strokeStyle="rgba(87,82,76,0.12)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+24,ry+rh);ctx.lineTo(x+w-24,ry+rh);ctx.stroke();}});
  ag_T(ctx,o.foot||"… and 1,232 more",x+28,hy+28+EC_UNITS.length*rh+44,{w:600,size:28,col:AG.mut});
  ctx.restore();return{x,y,w,h,row:i=>({y:hy+28+i*rh,h:rh,cN,cC,cS})};}

/* ---------------------------------------------------------------- a class of 25, and a laboratory of 16 benches
   ec_lab(ctx, x, y, o): on the left a class as Planning planned it, 25 students as small tiles in rows of five, and on the right a
   laboratory seen from above, 16 benches; o.lab (0 to 1) the laboratory comes in; o.fill (0 to 1) sixteen students go to the
   benches; o.left (0 to 1) the nine left over turn amber. No words on the tiles: the cards say what they are. o.a */
function ec_lab(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const lab=clamp(o.lab||0,0,1),fill=clamp(o.fill||0,0,1),left=clamp(o.left||0,0,1),LX=x+340,LY=y;
  // the class: 25 tiles in rows of five
  ag_box(ctx,x,y,300,420,22,{});ag_T(ctx,"A CLASS",x+28,y+52,{w:700,size:28,ls:4,col:AG.kick});ag_T(ctx,"of 25",x+28,y+98,{w:700,size:36});
  // the laboratory: sixteen benches, seen from above
  if(lab>0){withA(ctx,lab,()=>{ag_box(ctx,LX,LY,440,420,22,{edge:AG.blue,edgeA:0.5});ag_T(ctx,"A LABORATORY",LX+28,LY+52,{w:700,size:28,ls:4,col:AG.kick});
    ag_T(ctx,"16 benches",LX+28,LY+98,{w:700,size:36});
    for(let i=0;i<16;i++){const bx=LX+36+(i%4)*96,by=LY+170+((i/4)|0)*62;let g=ctx.createLinearGradient(0,by,0,by+28);g.addColorStop(0,rgba(AG_OAK.hi,1));g.addColorStop(1,rgba(AG_OAK.base,1));
      ctx.fillStyle=g;rr(ctx,bx,by,80,28,6);ctx.fill();ctx.strokeStyle=rgba(AG_OAK.dark,0.6);ctx.lineWidth=1.5;rr(ctx,bx,by,80,28,6);ctx.stroke();}});}
  // the students: sixteen go to a bench each, nine are left over
  for(let i=0;i<25;i++){const cx=x+50+(i%5)*50,cy=y+170+((i/5)|0)*48;let px=cx,py=cy,col=[112,108,102];
    if(i<16&&fill>0){const u=ag_sine(clamp(fill*1.6-i*0.04,0,1)),bx=LX+36+(i%4)*96+40,by=LY+170+((i/4)|0)*62;px=lerp(cx,bx,u);py=lerp(cy,by-4,u)-Math.sin(u*Math.PI)*30;}
    if(i>=16)col=mix(col,AG.amber,left);
    ctx.fillStyle=rgba(col,0.92);ctx.beginPath();ctx.arc(px,py,14,0,TAU);ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- the faculties, each a small card that plans with the number
   ec_faculties(ctx, x, y, o): the university's four faculties in a row of cards, each springing in (o.k [4]), o.a */
const EC_FACULTIES=["Health","Engineering and IT","Business","Arts and Education"];
function ec_faculties(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return[];const out=[];let xx=x;ctx.save();ctx.globalAlpha*=a;
  EC_FACULTIES.forEach((f,i)=>{const w=ag_tw(ctx,f,{w:700,size:28})+56,h=66,k=o.k?o.k[i]:1;out.push({x:xx,y,w,h});if(k>0){ctx.save();ctx.globalAlpha*=clamp((k-0.5)*2.5,0,1);
      ag_about(ctx,xx+w/2,y+h/2,lerp(0.85,1,k));ag_box(ctx,xx,y,w,h,18,{edge:AG.blue,edgeA:0.45});ag_T(ctx,f,xx+28,y+44,{w:700,size:28});ctx.restore();}xx+=w+18;});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- the path every change takes
   ec_path(ctx, x, y, w, o): six stations in a row, each a card with its sign and its words: the agent's evidence, checks on what
   changed, a diff of the data, an agent's review for reference, approval from the roles on the map, a second person's release.
   o.k [6] each springing in; o.lit [6] each lit in its colour; o.done [6] a tick on each passed; o.chip (0 to 6): the pull request, a
   small chip, at that station (fractions between); o.names [[i, words, a]] under a station; o.a. Returns each station's box. */
const EC_PATH=[["Evidence",["handed in","by the agent"],"orange","clip"],["Checks",["on what","changed"],"blue","tick"],["Diff",["of the data,","before, after"],"orange","diff"],
  ["Review",["for reference,","by an agent"],"violet","comment"],["Approval",["the roles","on the map"],"green","person"],["Release",["by a second","person"],"green","release"]];
function ec_pathSign(ctx,kind,x,y,col){const c=rgba(col,1);ctx.save();ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=3.4;ctx.lineCap="round";ctx.lineJoin="round";
  if(kind==="clip")ag_clip(ctx,x,y,40,c,3.4);
  else if(kind==="tick"){ctx.beginPath();ctx.arc(x,y,20,0,TAU);ctx.stroke();ag_tick(ctx,x,y+1,18,c,3.4);}
  else if(kind==="diff"){ctx.fillRect(x-20,y-14,16,6);ctx.fillRect(x-15,y-19,6,16);ctx.fillRect(x+4,y+8,16,6);ctx.globalAlpha*=0.5;ctx.fillRect(x-22,y-1,44,3);}
  else if(kind==="comment")ec_icon(ctx,"comment",x,y,col);
  else if(kind==="person"){ctx.beginPath();ctx.arc(x,y-9,8,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-15,y+17);ctx.quadraticCurveTo(x-15,y+2,x,y+2);ctx.quadraticCurveTo(x+15,y+2,x+15,y+17);ctx.stroke();}
  else if(kind==="release"){ctx.beginPath();ctx.moveTo(x-18,y+2);ctx.lineTo(x-18,y+16);ctx.lineTo(x+18,y+16);ctx.lineTo(x+18,y+2);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y+8);ctx.lineTo(x,y-18);ctx.stroke();
    ag_arrowHead(ctx,x,y-18,-Math.PI/2,8,c);}
  ctx.restore();}
function ec_path(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,gap=26,sw=(w-gap*5)/6,h=200,out=EC_PATH.map((s,i)=>({x:x+i*(sw+gap),y,w:sw,h,cx:x+i*(sw+gap)+sw/2}));if(a<=0)return out;
  ctx.save();ctx.globalAlpha*=a;const arr=(v,i,d)=>v==null?d:(Array.isArray(v)?(v[i]==null?d:v[i]):v);
  // the rail the pull request travels along, under the stations
  const ry=y+h+34;ctx.strokeStyle="rgba(87,82,76,0.35)";ctx.lineWidth=3;ctx.setLineDash([2,10]);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(out[0].cx,ry);ctx.lineTo(out[5].cx,ry);ctx.stroke();ctx.setLineDash([]);
  EC_PATH.forEach((s,i)=>{const B=out[i],k=arr(o.k,i,1);if(k<=0)return;const lit=clamp(arr(o.lit,i,0),0,1),col=AG[s[2]],done=clamp(arr(o.done,i,0),0,1);
    ctx.save();ctx.globalAlpha*=clamp(k*2,0,1);ec_springAbout(ctx,B.x,B.y,B.w,B.h,k);
    ag_box(ctx,B.x,B.y,B.w,B.h,20,{edge:lit>0.02?col:null,edgeA:0.3+0.6*lit,glow:lit>0.02?col:null,glowA:lit*0.8});
    ec_pathSign(ctx,s[3],B.x+44,B.y+46,lit>0.3?col:AG.mut);
    if(done>0)withA(ctx,done,()=>{ctx.fillStyle=rgba(AG.green,0.95);ctx.beginPath();ctx.arc(B.x+B.w-34,B.y+42,17,0,TAU);ctx.fill();ag_tick(ctx,B.x+B.w-34,B.y+43,15,"rgba(255,255,255,0.95)",3.2);});
    ag_T(ctx,s[0],B.x+20,B.y+112,{w:700,size:32,col:lit>0.4?col:AG.ink});s[1].forEach((l,j)=>ag_T(ctx,l,B.x+20,B.y+150+j*36,{w:600,size:28,col:AG.mut}));
    // the dots on the rail, and the arrow to the next station
    ctx.fillStyle=rgba(lit>0.3?col:[150,146,140],0.9);ctx.beginPath();ctx.arc(B.cx,ry,7,0,TAU);ctx.fill();
    if(i<5)ag_arrowHead(ctx,B.x+B.w+gap/2+5,y+h/2,0,8,"rgba(87,82,76,0.55)");ctx.restore();});
  // the pull request on its way
  if(o.chip!=null&&o.chipA!==0){const p=clamp(o.chip,0,5),i=Math.floor(p),f=p-i,cx=i<5?lerp(out[i].cx,out[i+1].cx,ag_sine(f)):out[5].cx;
    ctx.save();ctx.globalAlpha*=o.chipA==null?1:o.chipA;ctx.fillStyle=rgba(o.chipCol||AG.blue,1);rr(ctx,cx-30,ry-15,60,30,15);ctx.fill();
    ctx.fillStyle="rgba(255,255,255,0.95)";ctx.beginPath();ctx.arc(cx-12,ry,4.5,0,TAU);ctx.arc(cx+12,ry,4.5,0,TAU);ctx.fill();ctx.fillRect(cx-12,ry-1.5,24,3);ctx.restore();}
  (o.names||[]).forEach(([i,words,na])=>{if(!(na>0))return;const B=out[i];ag_T(ctx,words,B.cx,ry+56,{w:700,size:28,align:"center",a:na,col:AG.ink});});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- main and the agent's branch
   ec_branches(ctx, x, y, w, o): main, a line with its commits and a lock at its end; the agent's branch below it, violet, named
   agent/planning/class-size; o.br (0 to 1) draws the branch; o.push2 (0 to 1) a second commit on it; o.pr (0 to 1) a pull request's
   dashed arrow up to main; o.merge (0 to 1) the branch joins main, green, with a merge commit; o.a */
function ec_branches(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const my=y,by=y+150,bx0=x+150,bx1=x+w*0.6,b2=x+w*0.5;
  ctx.strokeStyle="rgba(87,82,76,0.75)";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,my);ctx.lineTo(x+w-70,my);ctx.stroke();
  for(let i=0;i<4;i++){const cx=x+40+i*(w*0.62-40)/3;ctx.fillStyle="#F3F1ED";ctx.beginPath();ctx.arc(cx,my,13,0,TAU);ctx.fill();ctx.strokeStyle="rgba(87,82,76,0.85)";ctx.lineWidth=4;ctx.stroke();}
  ag_lock(ctx,x+w-30,my+4,34,rgba(AG.green,1));ag_T(ctx,"main",x,my-34,{w:500,size:30,f:"mono"});
  const br=clamp(o.br==null?1:o.br,0,1);if(br>0){const u=ag_sine(br);ctx.strokeStyle=rgba(AG.violet,0.85);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(bx0,my);
    ctx.bezierCurveTo(bx0+40,my+20,bx0+40,by,bx0+110,by);ctx.lineTo(lerp(bx0+110,bx1,u),by);ctx.stroke();
    const dot=(cx)=>{ctx.fillStyle="#F3F1ED";ctx.beginPath();ctx.arc(cx,by,13,0,TAU);ctx.fill();ctx.strokeStyle=rgba(AG.violet,0.95);ctx.lineWidth=4;ctx.stroke();};
    if(u>0.6)dot(b2-120);if(o.push2>0)withA(ctx,clamp(o.push2,0,1),()=>dot(b2));if(u>0.98)dot(bx1);
    ag_T(ctx,"agent/planning/class-size",bx0+110,by+56,{w:500,size:28,f:"mono",col:AG.violet,a:clamp(br*2-0.6,0,1)});}
  if(o.pr>0){const u=ag_sine(clamp(o.pr,0,1));ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(AG.blue,0.85);ctx.lineWidth=4;ctx.beginPath();
    ctx.moveTo(bx1+20,by-10);ctx.quadraticCurveTo(bx1+90,lerp(by,my,0.5),lerp(bx1+20,bx1+110,u),lerp(by-10,my+24,u));ctx.stroke();ctx.restore();
    if(u>0.95)ag_arrowHead(ctx,bx1+110,my+24,-1.2,10,rgba(AG.blue,0.9));
    withA(ctx,clamp(o.pr*2-1,0,1)*(1-clamp(o.merge||0,0,1)),()=>ag_pill(ctx,bx1+250,lerp(by,my,0.5)+10,"pull request",{size:28,col:AG.blue}));}
  if(o.merge>0){const u=ag_sine(clamp(o.merge,0,1)),mx=bx1+150;ctx.strokeStyle=rgba(AG.green,0.9);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(bx1,by);
    ctx.bezierCurveTo(lerp(bx1,mx,0.5),by,lerp(bx1,mx,0.6),my,lerp(bx1,mx,u),lerp(by,my,u));ctx.stroke();
    if(u>0.97){ctx.fillStyle="#F3F1ED";ctx.beginPath();ctx.arc(mx,my,16,0,TAU);ctx.fill();ctx.strokeStyle=rgba(AG.green,1);ctx.lineWidth=5;ctx.stroke();}}
  ctx.restore();}
// a schema, in mono, in its own small box; o.edge, o.grey, o.lock; o.a, o.k
function ec_schema(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,f={w:500,size:28,f:"mono"},w=ag_tw(ctx,name,f)+60+(o.lock?40:0),h=64;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;ec_springAbout(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,14,{edge:o.edge,edgeA:0.7});ag_T(ctx,name,x+30,y+42,Object.assign({},f,{col:o.grey?AG.mut:(o.col||AG.ink)}));
  if(o.lock)ag_lock(ctx,x+w-36,y+36,26,rgba(AG.mut,1));ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the five stages: the series' picture, copied whole from Five
   stages, not a switch (fs_stages, as its branch had it on 5 November 2026), under this film's prefix, with its look, words and colours;
   stage 4's person reads "Owns it; the data team reviews it" since 10 November 2026 (owners never review a pull request).
   ec_stages(ctx, x, y, w, o): five oak steps rising from left to right on the floor, each with its number and a card with its name, and
   a slim gate before each; x, y the left end of the floor line, w their width; o.a, o.k [5], o.lit [5], o.dim, o.col [5], o.short,
   o.gates [5] or true, o.passed [5], o.gate {i, a, k, x, y, w}, o.facts {i, a, x, y, w}. It returns each stage's card and each gate. */
function ec_stages(ctx,x,y,w,o){o=o||{};
  const NAMES=[["Suggests"],["Acts for you,","step by step"],["Acts for you,","within limits"],["A contributor","that proposes"],["A contributor","with a mandate"]],
    SHORT=["Suggests","Step by step","Within limits","Proposes","Mandate"],
    GATES=[["The team's conventions and glossary,","written down for it to read"],["A development space,","with no sensitive data"],["Its limits, and how it will be checked,","set before it starts"],
      ["A place on the map,","with an owner and a role"],["A track record,","and a mandate its owner signs"]],
    FACTS=[["Yours, but it uses none","Drafts in a chat; runs nothing","Accepts or rejects every line"],
      ["Yours, delegated","Runs queries in your session, read only","Approves each action"],
      ["Yours, narrowed","Works alone; drafts only in a sandbox","Checks it against the checks set first"],
      ["Its own, with no secret it can see","Opens a pull request from its own space","Owns it; the data team reviews it"],
      ["Its own","In test, agreed tasks alone, then a report","Another person approves production"]],
    BLUE=[38,102,132],GREEN=[50,116,80],OAK={base:[208,188,156],dark:[156,136,106],hi:[242,233,216]};
  const a=o.a==null?1:o.a,k=w/1660,bw=300*k,gap=40*k,rise=86*k,depth=16*k,ch=128,sm=o.short===true?1:clamp(o.short||0,0,1),arr=(v,i,d)=>v==null?d:(v===true?1:(Array.isArray(v)?(v[i]==null?d:v[i]):v));
  const out={stages:[],gates:[]};
  for(let i=0;i<5;i++){const sx=x+i*(bw+gap),top=y-(i+1)*rise,cy=top-depth-14-ch;out.stages.push({x:sx,y:cy,w:bw,h:ch,cx:sx+bw/2,top,face:{x:sx,y:top,w:bw,h:y-top}});
    out.gates.push({x:sx-gap/2,y:top-depth-40*k});}
  if(a<=0)return out;
  ctx.save();ctx.globalAlpha*=a;
  ag_floorShadow(ctx,x+w/2-8,y+10,w*0.56,26,0.22);
  for(let i=0;i<5;i++){const S=out.stages[i],kk=arr(o.k,i,1);if(kk<=0)continue;const lit=clamp(arr(o.lit,i,0),0,1),dim=(o.dim||0)*(1-lit),col=(o.col&&o.col[i])||BLUE;
    ctx.save();ctx.globalAlpha*=clamp(kk*1.6,0,1)*(1-0.55*dim);ag_about(ctx,S.cx,y,lerp(0.6,1,clamp(kk,0,1.2)));
    // the step: an oak block, its top a lighter strip receding a little, its face with the stage's number
    const f=S.face;let g=ctx.createLinearGradient(0,f.y,0,y);g.addColorStop(0,rgba(OAK.base,1));g.addColorStop(1,rgba(OAK.dark,1));
    ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=24*k;ctx.shadowOffsetX=-7;ctx.shadowOffsetY=10;ctx.fillStyle=g;ctx.fillRect(f.x,f.y,f.w,f.h);ctx.restore();
    g=ctx.createLinearGradient(0,f.y-depth,0,f.y);g.addColorStop(0,rgba(mix(OAK.hi,[255,255,255],0.3),1));g.addColorStop(1,rgba(OAK.hi,1));ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(f.x+depth*0.6,f.y-depth);ctx.lineTo(f.x+f.w-depth*0.6,f.y-depth);ctx.lineTo(f.x+f.w,f.y);ctx.lineTo(f.x,f.y);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(OAK.dark,0.5);ctx.lineWidth=1.2;for(let j=1;j<4;j++){const gy=f.y+f.h*j/4;ctx.beginPath();ctx.moveTo(f.x+6,gy+Math.sin(j*3.1+i)*2);ctx.bezierCurveTo(f.x+f.w*0.3,gy-3,f.x+f.w*0.7,gy+3,f.x+f.w-6,gy);ctx.stroke();}
    if(lit>0){ctx.fillStyle=rgba([255,250,236],0.26*lit);ctx.fillRect(f.x,f.y,f.w,f.h);ctx.fillStyle=rgba(col,0.9*lit);ctx.fillRect(f.x,f.y-2,f.w,4);}
    const nsz=Math.max(36,Math.min(56,f.h*0.62));ag_T(ctx,String(i+1),S.cx,f.y+Math.min(f.h*0.5+nsz*0.36,f.h-10*k),{w:800,size:nsz,align:"center",col:lit>0.4?col:[110,92,66]});
    // the stage's card on its step: it shows once its step has nearly sprung to full size, so its words never show small
    ctx.globalAlpha*=clamp((kk-0.85)/0.12,0,1);
    ag_box(ctx,S.x,S.y,S.w,S.h,18,{edge:lit>0.02?col:null,edgeA:0.35+0.6*lit,glow:lit>0.02?col:null,glowA:lit});
    ag_T(ctx,"STAGE "+(i+1),S.x+16,S.y+36,{w:700,size:28,ls:3,col:lit>0.4?col:[80,86,94]});
    const sa=clamp(sm*2-1,0,1),la=clamp(1-sm*2,0,1);
    if(sa>0)ag_T(ctx,SHORT[i],S.x+16,S.y+82,{w:700,size:30,a:sa});
    if(la>0)NAMES[i].forEach((l,j)=>ag_T(ctx,l,S.x+16,S.y+78+j*38,{w:700,size:32,a:la}));
    ctx.restore();}
  // the gates: a slim post and its knob before each step; a passed gate's knob turns green, with a tick
  for(let i=0;i<5;i++){const ga=arr(o.gates,i,0),G=out.gates[i];if(ga<=0)continue;const ps=clamp(arr(o.passed,i,0),0,1),top=G.y,bot=i?out.stages[i-1].top:y;
    ctx.save();ctx.globalAlpha*=ga;ctx.fillStyle="#4A4C52";ctx.fillRect(G.x-3,top,6,bot-top);ag_floorShadow(ctx,G.x+AG.sdx*0.5,bot+2,12,4,0.3);
    const kc=mix(BLUE,GREEN,ps);ctx.save();ctx.shadowColor=rgba(kc,0.5);ctx.shadowBlur=12;ctx.fillStyle=rgba(kc,1);ctx.beginPath();ctx.arc(G.x,top,15,0,TAU);ctx.fill();ctx.restore();
    if(ps>0.05)ag_tick(ctx,G.x,top+1,13,"rgba(255,255,255,"+ps+")",3.2);ctx.restore();}
  // the words of one gate, on a card, with a line to its knob
  const gw=o.gate;if(gw&&gw.a>0){const G=out.gates[gw.i],L=GATES[gw.i],kick="GATE TO STAGE "+(gw.i+1),
      cw=gw.w||Math.max(ag_tw(ctx,kick,{w:700,size:28,ls:4}),...L.map(l=>ag_tw(ctx,l,{w:700,size:36})))+56,chh=28+38+L.length*44+28,b={x:gw.x,y:gw.y,w:cw,h:chh};
    ctx.save();ctx.globalAlpha*=gw.a;ctx.strokeStyle=rgba(BLUE,0.6);ctx.lineWidth=2.4;ctx.setLineDash([8,7]);ctx.beginPath();
    const sx=clamp(G.x,b.x+30,b.x+b.w-30);ctx.moveTo(sx,b.y+b.h);ctx.lineTo(G.x,G.y-18);ctx.stroke();ctx.setLineDash([]);
    if(gw.k!=null)ag_about(ctx,b.x+cw/2,b.y+chh/2,lerp(0.8,1,gw.k));ag_box(ctx,b.x,b.y,cw,chh,22,{edge:BLUE,edgeA:0.5});
    ag_T(ctx,kick,b.x+28,b.y+50,{w:700,size:28,ls:4,col:BLUE});L.forEach((l,j)=>ag_T(ctx,l,b.x+28,b.y+66+44*(j+1),{w:700,size:36}));ctx.restore();}
  // a stage's three facts
  const fc=o.facts;if(fc&&fc.a>0){const F=FACTS[fc.i],rows=[["Whose identity",F[0]],["What it may do",F[1]],["The person",F[2]]],h=58+rows.length*70+20;
    ctx.save();ctx.globalAlpha*=fc.a;if(fc.k!=null)ag_about(ctx,fc.x+fc.w/2,fc.y+h/2,lerp(0.6,1,fc.k));
    ag_box(ctx,fc.x,fc.y,fc.w,h,22,{edge:BLUE,edgeA:0.5});
    ag_T(ctx,"STAGE "+(fc.i+1)+" · "+SHORT[fc.i].toUpperCase(),fc.x+28,fc.y+50,{w:700,size:28,ls:3,col:BLUE});
    rows.forEach((r,j)=>{const ry=fc.y+58+j*70;ag_T(ctx,r[0],fc.x+28,ry+30,{w:600,size:28,col:[86,92,100]});ag_T(ctx,r[1],fc.x+28,ry+64,{w:700,size:32});});
    ctx.restore();}
  ctx.restore();return out;}

/* ---------------------------------------------------------------- the tests, each a card with its lock
   ec_test(ctx, x, y, w, text, o): a test card, its lock (only a person changes it once approved) and its words, wrapped; o.pass (0 to 1)
   a green tick; o.k, o.a. Returns its box. */
function ec_test(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a,tl=ag_wrap(ctx,text,w-110,{w:700,size:32}),h=84+tl.length*42;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;ec_springAbout(ctx,x,y,w,h,o.k);ag_box(ctx,x,y,w,h,20,{edge:AG.green,edgeA:0.5});
  ag_T(ctx,"TEST",x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});ag_lock(ctx,x+w-44,y+44,28,rgba(AG.blue,1));
  tl.forEach((l,i)=>ag_T(ctx,l,x+28,y+96+i*42,{w:700,size:32}));
  if(o.pass>0)withA(ctx,o.pass,()=>{ctx.fillStyle=rgba(AG.green,0.95);ctx.beginPath();ctx.arc(x+w-44,y+h-40,17,0,TAU);ctx.fill();ag_tick(ctx,x+w-44,y+h-39,15,"rgba(255,255,255,0.95)",3.2);});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the project's lineage, as dbt sees it
   ec_dag(ctx, x, y, o): the models from the sources (left) to what reads them (right), most of them small grey nodes with no words
   (decoration: the named ones say what matters); the path the change takes is named: the unit offerings, the class plan (changed),
   the classes by faculty, and the faculties' tutor hiring. o.changed (0 to 1) lights the class plan; o.down (0 to 1) lights what
   depends on it; o.grey (0 to 1) the rest dims, "not rebuilt"; o.pass (0 to 1) ticks on the two rebuilt; o.a */
const EC_DAG={nodes:[[0,40],[0,170],[0,300],[270,30],[270,300],[540,60],[540,280],[860,330],[860,40],[1140,330]],
  edges:[[0,3],[1,"u"],[2,4],[3,5],[4,6],["u",5],["u","p"],[5,8],[6,7],[7,9],[5,"p"]],
  named:{u:[270,170,"unit offerings"],p:[540,170,"class plan"],f:[860,170,"classes by faculty"],h:[1180,170,"tutor hiring"]}};
function ec_dag(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return{};ctx.save();ctx.globalAlpha*=a;const ch=clamp(o.changed||0,0,1),dn=clamp(o.down||0,0,1),gr=clamp(o.grey||0,0,1);
  const N=EC_DAG.named,pos=k=>typeof k==="string"?[x+N[k][0],y+N[k][1]]:[x+EC_DAG.nodes[k][0],y+EC_DAG.nodes[k][1]],
    wOf=k=>typeof k==="string"?ag_tw(ctx,N[k][2],{w:700,size:28})+52:56,hOf=k=>typeof k==="string"?58:30;
  const edge=(p,q,col,al,lw)=>{const [x0,y0]=pos(p),[x1,y1]=pos(q),sx=x0+wOf(p),sy=y0+hOf(p)/2,ty=y1+hOf(q)/2;ctx.strokeStyle=rgba(col,al);ctx.lineWidth=lw||2.4;
    ctx.beginPath();ctx.moveTo(sx,sy);ctx.bezierCurveTo(sx+70,sy,x1-70,ty,x1,ty);ctx.stroke();};
  for(const [p,q] of EC_DAG.edges)edge(p,q,[150,146,140],0.55*(1-gr*0.5));
  edge("p","f",mix([150,146,140],AG.blue,dn),0.6+0.35*dn,2.4+1.6*dn);edge("f","h",mix([150,146,140],AG.blue,dn),0.6+0.35*dn,2.4+1.6*dn);
  // the small grey nodes: models the change doesn't touch
  EC_DAG.nodes.forEach((n,i)=>{const [nx,ny]=pos(i);ctx.fillStyle=rgba(mix([196,192,186],[226,224,220],gr),1);rr(ctx,nx,ny,56,30,8);ctx.fill();
    ctx.strokeStyle=rgba([150,146,140],0.6*(1-gr*0.6));ctx.lineWidth=1.5;rr(ctx,nx,ny,56,30,8);ctx.stroke();});
  // the named ones
  const pill=(k,col,lit,dash)=>{const [nx,ny]=pos(k),w=wOf(k),h=58;ag_box(ctx,nx,ny,w,h,h/2,{edge:lit>0.02?col:null,edgeA:0.35+0.6*lit,glow:lit>0.02?col:null,glowA:lit*0.8});
    if(dash){ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(AG.mut,0.7);ctx.lineWidth=2;rr(ctx,nx+5,ny+5,w-10,h-10,(h-10)/2);ctx.stroke();ctx.restore();}
    ag_T(ctx,N[k][2],nx+26,ny+39,{w:700,size:28,col:lit>0.4?col:AG.ink});return{x:nx,y:ny,w,h};};
  const out={u:pill("u",AG.ink,0),p:pill("p",AG.orange,ch),f:pill("f",AG.blue,dn),h:pill("h",AG.blue,dn*0.7,true)};
  if(o.pass>0)[out.p,out.f].forEach(b=>withA(ctx,o.pass,()=>{ctx.fillStyle=rgba(AG.green,0.95);ctx.beginPath();ctx.arc(b.x+b.w-6,b.y+2,16,0,TAU);ctx.fill();ag_tick(ctx,b.x+b.w-6,b.y+3,14,"rgba(255,255,255,0.95)",3);}));
  ctx.restore();return out;}

/* ---------------------------------------------------------------- a terminal's lines, and cards of rows
   ec_mono(ctx, x, y, w, o): what a tool printed, line by line in mono: o.kick, o.logo (a tool's logo by the kick), o.lines [{text,
   col, a, hl}]; o.a, o.k, o.edge. ec_rows(ctx, x, y, w, o): a card of rows, each a left and a right (o.rows [{l, r, a, hl, col, mono,
   tick, cross, warn}]), its kick (o.kick) and title (o.title); o.a, o.k, o.edge. Both return their box. */
function ec_monoH(o){return 72+(o.lines||[]).length*46+22;}
function ec_mono(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,lines=o.lines||[],h=ec_monoH(o);if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;ec_springAbout(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:0.55});let kx=x+28;if(o.logo){ec_logo(ctx,o.logo,x+28,y+42,34);kx+=48;}
  ag_T(ctx,(o.kick||"").toUpperCase(),kx,y+52,{w:700,size:28,ls:4,col:AG.kick});
  lines.forEach((l,i)=>{const la=l.a==null?1:l.a,ly=y+72+i*46;if(la<=0)return;withA(ctx,la,()=>{
    if(l.hl>0){ctx.fillStyle=rgba(l.col||AG.blue,0.1*l.hl);rr(ctx,x+14,ly+4,w-28,42,8);ctx.fill();}
    ag_T(ctx,l.text,x+28+(l.indent||0),ly+36,{w:500,size:28,f:"mono",col:l.col||AG.ink});});});
  ctx.restore();return{x,y,w,h};}
function ec_rowsH(o){return 28+38+(o.title?46:4)+(o.rows||[]).length*56+20;}
function ec_rows(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||[],h=ec_rowsH(o);if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;ec_springAbout(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:0.55});let kx=x+28;if(o.logo){ec_logo(ctx,o.logo,x+28,y+42,34);kx+=48;}
  ag_T(ctx,(o.kick||"").toUpperCase(),kx,y+52,{w:700,size:28,ls:4,col:o.kickCol||AG.kick});if(o.title)ag_T(ctx,o.title,x+28,y+98,{w:700,size:32});
  const y0=y+(o.title?112:70);rows.forEach((r,i)=>{const ra=r.a==null?1:r.a,ry=y0+i*56;if(ra<=0)return;withA(ctx,ra,()=>{
    if(r.hl>0){ctx.fillStyle=rgba(r.col||AG.blue,0.1*r.hl);rr(ctx,x+14,ry+2,w-28,50,10);ctx.fill();}
    if(r.warn>0){ctx.save();ctx.globalAlpha*=r.warn;ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.amber,0.85);ctx.lineWidth=2.4;rr(ctx,x+14,ry+2,w-28,50,10);ctx.stroke();ctx.restore();}
    let lx=x+28;if(r.tick!=null||r.cross!=null||r.icon){lx=x+76;
      if(r.tick>0)withA(ctx,r.tick,()=>ag_tick(ctx,x+46,ry+27,24,rgba(AG.green,1),4));
      if(r.cross>0)withA(ctx,r.cross,()=>{ctx.strokeStyle=rgba(r.crossCol||AG.mut,0.95);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+34,ry+15);ctx.lineTo(x+58,ry+39);ctx.moveTo(x+58,ry+15);ctx.lineTo(x+34,ry+39);ctx.stroke();});
      if(r.icon)ec_icon(ctx,r.icon,x+46,ry+27,r.iconCol||r.col);}
    ag_T(ctx,r.l,lx,ry+37,{w:r.lw||600,size:28,f:r.mono?"mono":undefined,col:r.lcol||AG.ink});
    if(r.r)ag_T(ctx,r.r,x+w-28,ry+37,{w:r.rw||600,size:28,f:r.rmono?"mono":undefined,align:"right",col:r.rcol||AG.mut});});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- two tables side by side, compared unit by unit
   ec_side(ctx, x, y, w, head, sub, rows, o): a small table, its head (in mono) and a line under it, its rows [unit, classes]; o.col
   (the head's colour), o.hl [rows lit], o.cmp (0 to 1) the changed rows lit amber-green; o.a, o.k */
function ec_side(ctx,x,y,w,head,sub,rows,o){o=o||{};const a=o.a==null?1:o.a,h=130+rows.length*56+16,rowY=i=>y+122+i*56+25;if(a<=0)return{x,y,w,h,rowY};ctx.save();ctx.globalAlpha*=a;ec_springAbout(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,22,{edge:o.col||AG.blue,edgeA:0.55});ag_T(ctx,head,x+28,y+52,{w:500,size:28,f:"mono",col:o.col||AG.ink});ag_T(ctx,sub,x+28,y+96,{w:600,size:28,col:AG.mut});
  rows.forEach((r,i)=>{const ry=y+122+i*56,hl=o.hl&&o.hl[i]?clamp(o.cmp||0,0,1):0;
    if(hl>0){ctx.fillStyle=rgba(AG.green,0.1*hl);rr(ctx,x+14,ry,w-28,50,10);ctx.fill();}
    ag_T(ctx,r[0],x+28,ry+36,{w:500,size:28,f:"mono"});ag_T(ctx,String(r[1]),x+w-28,ry+36,{w:700,size:28,align:"right",col:hl>0.5?AG.green:AG.ink});});
  ctx.restore();return{x,y,w,h,rowY};}

/* ---------------------------------------------------------------- the map's steps for a change to a data product
   ec_steps(ctx, x, y, w, o): the seven steps of "change a data product" on the map, each with the role that does it (3.3's names);
   o.lit [7] each lit (a person approves the change as the release approver since 10 November 2026: owners never review); o.agent (0 to 1) the planning agent's badge by its role's three steps; o.people (0 to 1) "a person" by the steps
   after the pull request; o.none (0 to 1) those three crossed for the agent; o.a, o.k. Returns the rows' boxes. */
const EC_STEPS=[["raise a ticket","requester",0],["draft the change","planning contributor",1],["build it in development","planning contributor",1],["open a pull request","planning contributor",1],
  ["review the code","analytics engineer",2],["approve the change","release approver",2],["release to production","release approver",2]];
function ec_steps(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=62,y0=y+110,h=110+EC_STEPS.length*rh+22,out=EC_STEPS.map((s,i)=>({x,y:y0+i*rh,w,h:rh}));if(a<=0)return out;
  ctx.save();ctx.globalAlpha*=a;ec_springAbout(ctx,x,y,w,h,o.k);ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.55});
  ag_T(ctx,"ON THE MAP",x+28,y+52,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,"Change a data product",x+28,y+94,{w:700,size:32});
  const cR=x+w*0.4,cM=x+w-28;
  EC_STEPS.forEach((s,i)=>{const ry=y0+i*rh,lit=o.lit?clamp(o.lit[i]||0,0,1):0,kind=s[2],col=kind===1?AG.violet:AG.green;
    if(lit>0){ctx.fillStyle=rgba(kind===1?AG.violet:AG.blue,0.09*lit);rr(ctx,x+14,ry+4,w-28,rh-6,10);ctx.fill();}
    ctx.strokeStyle="rgba(87,82,76,0.14)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+24,ry);ctx.lineTo(x+w-24,ry);ctx.stroke();
    ag_T(ctx,String(i+1),x+28,ry+42,{w:700,size:28,col:AG.mut});ag_T(ctx,s[0],x+66,ry+42,{w:700,size:30});ag_T(ctx,s[1],cR,ry+42,{w:600,size:28,col:kind===1?AG.violet:AG.mut});
    if(kind===1&&o.agent>0)withA(ctx,o.agent,()=>{const t_="planning agent",pw=ag_tw(ctx,t_,{w:700,size:28})+56;ag_pill(ctx,cM-pw/2,ry+31,t_,{size:28,col:AG.violet});});
    if(kind===2&&o.people>0)withA(ctx,o.people,()=>{const t_="a person",pw=ag_tw(ctx,t_,{w:700,size:28})+96;ag_pill(ctx,cM-pw/2,ry+31,t_,{size:28,col:AG.green,icon:"tick"});});
    if(kind===2&&i>=4&&o.none>0)withA(ctx,o.none,()=>{const t_="the agent · none",pw=ag_tw(ctx,t_,{w:700,size:28})+56,px=cM-ec_pillW(ctx,"a person",{icon:1})-24-pw/2;
      ag_pill(ctx,px,ry+31,t_,{size:28,col:AG.mut});ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(px-pw/2+24,ry+31);ctx.lineTo(px+pw/2-24,ry+31);ctx.stroke();});});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- the release: its two jobs, its pass and its bundle
   ec_job(ctx, x, y, w, o): GitHub Actions' release as a card: its logo, kick and when it runs, then its two jobs side by side, "test"
   and "production", each in its environment; o.test (0 to 1) test runs and passes (a tick); o.go (0 to 1) the arrow to production;
   o.wait (0 to 1) production waits at its gate, "waiting for a release approver"; o.ok (0 to 1) a person's yes opens it (o.who: whose);
   o.a, o.k. Returns its box and each job's box. */
function ec_job(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=380,jw=(w-56-80)/2,jy=y+150,jh=200,J1={x:x+28,y:jy,w:jw,h:jh},J2={x:x+28+jw+80,y:jy,w:jw,h:jh};
  if(a<=0)return{x,y,w,h,test:J1,prod:J2};ctx.save();ctx.globalAlpha*=a;ec_springAbout(ctx,x,y,w,h,o.k);ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.6});
  ec_logo(ctx,"github",x+28,y+42,34);ag_T(ctx,"GITHUB ACTIONS · THE RELEASE",x+76,y+52,{w:700,size:28,ls:4,col:AG.blue});
  ag_T(ctx,o.when||"Every night at 23:00, or by hand",x+28,y+104,{w:700,size:32});
  const job=(B,name,env,lit,col)=>{ag_box(ctx,B.x,B.y,B.w,B.h,18,{edge:lit>0.02?col:null,edgeA:0.35+0.6*lit,glow:lit>0.02?col:null,glowA:lit*0.7});
    ag_T(ctx,"JOB",B.x+24,B.y+46,{w:700,size:28,ls:4,col:AG.kick});ag_T(ctx,name,B.x+24,B.y+94,{w:500,size:32,f:"mono"});
    ag_T(ctx,"environment",B.x+24,B.y+144,{w:600,size:28,col:AG.mut});ag_T(ctx,env,B.x+B.w-24,B.y+144,{w:500,size:28,f:"mono",align:"right"});};
  const te=clamp(o.test||0,0,1),ok=clamp(o.ok||0,0,1),wt=clamp(o.wait||0,0,1);
  job(J1,"test","test",te,AG.green);if(te>0.6)withA(ctx,(te-0.6)/0.4,()=>{ctx.fillStyle=rgba(AG.green,0.95);ctx.beginPath();ctx.arc(J1.x+J1.w-38,J1.y+40,17,0,TAU);ctx.fill();ag_tick(ctx,J1.x+J1.w-38,J1.y+41,15,"rgba(255,255,255,0.95)",3.2);});
  if(o.go>0)ec_line(ctx,J1.x+J1.w+10,jy+jh/2,J2.x-10,jy+jh/2,o.go,{col:AG.blue,lw:3});
  job(J2,"production","production",ok,AG.green);
  if(wt>0&&ok<1)withA(ctx,wt*(1-ok),()=>{const gx=J2.x+J2.w-38,gy=J2.y+40;ctx.strokeStyle=rgba(AG.amber,0.95);ctx.lineWidth=3.4;ctx.beginPath();ctx.arc(gx,gy,16,0,TAU);ctx.stroke();
    ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx,gy-10);ctx.moveTo(gx,gy);ctx.lineTo(gx+7,gy+4);ctx.stroke();});
  if(ok>0)withA(ctx,ok,()=>{ctx.fillStyle=rgba(AG.green,0.95);ctx.beginPath();ctx.arc(J2.x+J2.w-38,J2.y+40,17,0,TAU);ctx.fill();ag_tick(ctx,J2.x+J2.w-38,J2.y+41,15,"rgba(255,255,255,0.95)",3.2);});
  ctx.restore();return{x,y,w,h,test:J1,prod:J2};}
// a pass, as GitHub hands one to a job: a ticket with its rows [[left, right, a, hl, mono]]; o.kick, o.title, o.logo; o.a, o.k
function ec_pass(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||[],h=28+38+(o.title?46:4)+rows.length*52+22;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  ec_springAbout(ctx,x,y,w,h,o.k);
  ag_card(ctx,c=>{const nr=12,my=y+h/2;c.moveTo(x+18,y);c.lineTo(x+w-18,y);c.quadraticCurveTo(x+w,y,x+w,y+18);c.lineTo(x+w,my-nr);c.arc(x+w,my,nr,-Math.PI/2,Math.PI/2,true);
    c.lineTo(x+w,y+h-18);c.quadraticCurveTo(x+w,y+h,x+w-18,y+h);c.lineTo(x+18,y+h);c.quadraticCurveTo(x,y+h,x,y+h-18);c.lineTo(x,my+nr);c.arc(x,my,nr,Math.PI/2,-Math.PI/2,true);
    c.lineTo(x,y+18);c.quadraticCurveTo(x,y,x+18,y);c.closePath();},{x,y,w,h},{edge:o.edge||AG.blue,edgeA:0.6});
  let kx=x+28;if(o.logo){ec_logo(ctx,o.logo,x+28,y+42,34);kx+=48;}
  ag_T(ctx,(o.kick||"A pass").toUpperCase(),kx,y+52,{w:700,size:28,ls:4,col:AG.blue});if(o.title)ag_T(ctx,o.title,x+28,y+98,{w:700,size:32});
  rows.forEach((r,i)=>{const ry=y+(o.title?146:104)+i*52,ra=r[2]==null?1:r[2];if(ra<=0)return;withA(ctx,ra,()=>{if(r[3]>0){ctx.fillStyle=rgba(AG.blue,0.1*r[3]);rr(ctx,x+14,ry-34,w-28,46,10);ctx.fill();}
    ag_T(ctx,r[0],x+28,ry,{w:600,size:28,col:AG.mut});ag_T(ctx,r[1],x+w-28,ry,{w:r[4]?500:700,size:28,f:r[4]?"mono":undefined,align:"right"});});});
  ctx.restore();return{x,y,w,h};}
