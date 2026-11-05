/* ===== The map, enforced: the room's own pieces =====
   The film's pieces in the module's lab, all prefixed ob_ / OB (the module's shared code is never changed for one film). Several are
   copied from Why Unity Catalog and Unity Gateway govern them's pieces.js as merged on 5 November 2026 (its ug_ helpers for a person
   at the left, the agent in its ring, the badge on its hook and the paper tags on strings, the grants and the groups), under this
   film's prefix, so the badge looks the same from one film to the next:
     the room's usual shot (OB): a person standing at the left, the agent in its ring on the wall in the middle, with a hook under it
     (its badge, its name tag, its owner's tag), and the wall's right for what it shows; its pieces: a name card over a person, a
     ticket, the 214 changes as tiles, the switches, the badge's card with its three tools, the group and its grants, the logs (the
     code's history, the query history, the audit log's table), the search, the job and its pass, the tokens with their clocks, the
     key, the branches and main, the schemas, the sandbox and the glass; and Noor's map (an element, a step with what it reads, writes
     and calls) and each tool's card, with the tool's own logo where the film names it.
   Colours keep the module's meanings: blue tools and structure (the badge's tools, the group, the grants, the locks, the map's
   roles), violet the model and what an agent does (its band, its own lines in a log, its element on the map), orange data coming
   back, green a check that passes, amber something wrong. The agents look alike: each wears its badge, with its name on it, and none
   is ever in two places at once. */

// a value worked out once per chapter (the cue times its scene uses)
function ob_once(sc,k,fn){sc.__ob=sc.__ob||{};if(!(k in sc.__ob))sc.__ob[k]=fn();return sc.__ob[k];}

/* ---------------------------------------------------------------- where things stand in the room's usual shot */
const OB={agent:{x:1080,y:430,R:150,r:78},who:{x:250,y:610,s:0.98},right:{x:1296,w:570}};
const OB_QUIET=[[700,430,290,260,0.55],[1580,430,340,320,0.5],[640,96,560,46,0.3],[1080,430,250,230,0.45],[960,250,860,170,0.35]];
AG_PLACES.obLab=c=>ag_paintLab(c,{quiet:OB_QUIET});
// the bare room, in a later moment's pass through it, keeps the light every shot of it draws
AG_BARE.obLab=c=>ag_roomLight(c,1);
const OB_KICK=(x,a)=>ag_kicker(x,"3.5","The map, enforced",{a});
// the kicker, on the frame and drawn once by each chapter after its shots, so a glide never moves it and a pass through the bare room
// never takes it away
function ob_kick(ctx,S,a){if(!(a>0))return;ctx.save();setScreen(ctx,S);OB_KICK(ctx,a);ctx.restore();}
// what fn draws, laid on the picture at opacity a as one picture: a ring faded layer by layer shows its band through its sphere
function ob_asOne(ctx,a,fn){if(a>=1)return fn(ctx);if(!(a>0))return;const [bc,bx]=ag_buf("obOne",ctx.canvas.width,ctx.canvas.height);
  bx.setTransform(ctx.getTransform());fn(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}
// text on its way somewhere, too small to read for a moment, is decoration on purpose: PH_OFF is the legibility check's hook, as From
// words to data's tools name it
let PH_OFF=0;
function ob_deco(on,fn){if(!on)return fn();PH_OFF++;try{return fn();}finally{PH_OFF--;}}
// the corner tag: where and when
function ob_corner(ctx,text,a){if(a<=0)return;const w=ag_tw(ctx,text.toUpperCase(),{w:700,size:30,ls:3})+56;
  ag_box(ctx,72,64,w,62,31,{a:a*0.92});ag_T(ctx,text.toUpperCase(),100,106,{w:700,size:30,ls:3,col:AG.kick,a});}
// a card in the module's way, and a pill that springs in at t0 (and fades at t1)
function ob_card(ctx,x,y,w,words,o){o=o||{};return ag_textCard(ctx,x,y,w,words,Object.assign({kickCol:AG.kick},o));}
function ob_pillAt(ctx,x,y,text,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));const b=ag_pill(ctx,x,y,text,Object.assign({size:28},o||{}));ctx.restore();return b;}
// a line drawn from one point to another as p goes 0 to 1, with an arrow's head once it's there
function ob_line(ctx,x0,y0,x1,y1,p,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a,u=ag_sine(p),xe=lerp(x0,x1,u),ye=lerp(y0,y1,u);ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=o.col?rgba(o.col,0.85):"rgba(87,82,76,0.7)";ctx.lineWidth=o.lw||2.6;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);
  if(p>0.95&&o.head!==false)ag_arrowHead(ctx,x1,y1,Math.atan2(y1-y0,x1-x0),9,o.col?rgba(o.col,0.9):"rgba(87,82,76,0.85)");ctx.restore();}
// a soft cross over something refused
function ob_cross(ctx,x,y,s,a,col){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col||AG.amber,0.95);ctx.lineWidth=5;ctx.lineCap="round";
  const k=ag_sine(clamp(a*1.4,0,1));ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x-s+2*s*k,y-s+2*s*k);ctx.moveTo(x+s,y-s);ctx.lineTo(x+s-2*s*k,y-s+2*s*k);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the agent
   ob_agent(ctx, t, o): the loop at OB.agent unless o.x, o.y, o.R, o.r; o.core, o.think, o.p, o.a, o.dim (0 to 1: the band goes dark,
   as when it's switched off), o.dash (a sketch of an agent that isn't there: a dashed ring, no sphere); its shadow on the floor; no
   label: its badge and its tags say who it is. ob_armTo: an arm from the ring's right towards a point, the curve ag_reach takes. */
function ob_agent(ctx,t,o){o=o||{};const A=OB.agent,x=o.x==null?A.x:o.x,y=o.y==null?A.y:o.y,R=o.R||A.R,r=o.r||A.r,a=o.a==null?1:o.a,dim=clamp(o.dim||0,0,1);
  if(a<=0)return[];if(o.dash){ctx.save();ctx.globalAlpha*=a;ctx.setLineDash([14,11]);ctx.strokeStyle=rgba(AG.mut,0.75);ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(x,y,R,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();ctx.restore();return[];}
  if(o.floor!==false)withA(ctx,a,()=>ag_floorShadow(ctx,x+AG.sdx*3,Math.max(y+R+130,700),R*1.15,22,0.2));
  return ag_loop(ctx,x,y,{R,r,t,a,p:o.p,core:(o.core==null?1:o.core)*(1-dim*0.92),think:(o.think||0)*(1-dim),pulse:o.pulse,label:null});}
function ob_armTo(x1,y1,o){o=o||{};const A=OB.agent,x=o.x==null?A.x:o.x,y=o.y==null?A.y:o.y,R=o.R||A.R,x0=x+R*0.62,y0=y+R*0.42+(o.dy||0);
  return[x0,y0,lerp(x0,x1,0.35),y0+(o.bow==null?60:o.bow),lerp(x0,x1,0.75),y1+(o.bow2==null?20:o.bow2),x1,y1];}

/* ---------------------------------------------------------------- people
   ob_who(ctx, who, t, o): one of the cast standing at the left (OB.who), facing right, arms down; o.x, o.y, o.s, o.a, o.p (ag_person's
   own options: gaze, smile). ob_name: a card over a person, their name and where they work. Lucía is drawn as the series draws her. */
const OB_LUCIA={name:"Lucía Ortega",role:"Planning",skin:[206,160,124],hair:{style:"long",c:[48,32,26]},earrings:[208,214,226],top:{kind:"sweater",c:[84,88,96]},breath:0.29};
function ob_who(ctx,who,t,o){o=o||{};const W_=OB.who,a=o.a==null?1:o.a;if(a<=0.01)return null;let h=null;
  withA(ctx,a,()=>{h=ag_person(ctx,who,o.x==null?W_.x:o.x,o.y==null?W_.y:o.y,o.s||W_.s,Object.assign({t,gaze:[3,0]},o.p||{}));});return h;}
function ob_name(ctx,cx,y,name,role,a){if(a<=0)return;const w=Math.max(ag_tw(ctx,name,{w:700,size:30}),ag_tw(ctx,role,{w:600,size:28}))+60,h=100;
  ag_box(ctx,cx-w/2,y,w,h,18,{a});withA(ctx,a,()=>{ag_T(ctx,name,cx,y+43,{w:700,size:30,align:"center"});ag_T(ctx,role,cx,y+80,{w:600,size:28,align:"center",col:AG.mut});});}
// the people of this film at the left, each with their card
const OB_PEOPLE={jun:["jun","Jun Park","Analytics engineer"],sam:["sam","Sam Okafor","Data platform"],clara:["clara","Clara Jensen","Planning"],lucia:[OB_LUCIA,"Lucía Ortega","Planning"],
  noor:["noor","Noor Rahman","Data architect"]};
function ob_person(ctx,k,t,o){o=o||{};const P=OB_PEOPLE[k],a=o.a==null?1:o.a;ob_who(ctx,P[0],t,{a,p:Object.assign({gaze:[4,-1]},o.p||{})});return P;}
function ob_personCard(ctx,k,a){const P=OB_PEOPLE[k];ob_name(ctx,OB.who.x,196,P[1],P[2],a);}

/* ---------------------------------------------------------------- the badge, the name tag and the owner tag on the ring's hook
   ob_badge: the series' badge (ag_badge), drawn here so it can grey when its agent is switched off (o.grey) and drop in on its lanyard;
   ob_badgeOn puts it on the ring's hook, o.k 0 to 1 dropping in; ob_tag a paper tag on a string from a point, as a label hangs from a
   hook (the agent's name before it has a badge, Jun's helper's, its owner's). */
function ob_badge(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const drop=o.drop||56,sw=Math.sin((o.t||0)*1.3)*0.025+(o.sw||0),w=ag_tw(ctx,text,{w:700,size:28})+48,h=58,g=clamp(o.grey||0,0,1);
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(sw);
  ctx.strokeStyle=rgba(mix(AG.blue,[150,148,144],g),0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-26,0);ctx.lineTo(-8,drop-10);ctx.moveTo(26,0);ctx.lineTo(8,drop-10);ctx.stroke();
  ctx.fillStyle="#9AA0A8";ctx.fillRect(-9,drop-14,18,14);
  ag_box(ctx,-w/2,drop,w,h,10,{});ctx.fillStyle=rgba(mix(AG.blue,[160,158,154],g),0.85);ctx.fillRect(-w/2+10,drop+4,w-20,5);
  ag_T(ctx,text,0,drop+h/2+15,{w:700,size:28,align:"center",col:mix(AG.ink,[150,148,144],g)});
  if(g>0.5&&o.off)ag_T(ctx,o.off===true?"switched off":o.off,0,drop+h+40,{w:700,size:28,align:"center",col:AG.mut,a:(g-0.5)*2});
  ctx.restore();}
function ob_hook(o){o=o||{};const A=OB.agent;return[(o.x==null?A.x:o.x)+50,(o.y==null?A.y:o.y)+(o.R||A.R)-2];}
function ob_badgeOn(ctx,tt,text,o){o=o||{};const k=o.k==null?1:o.k;if(k<=0)return;const h=ob_hook(o);
  const fall=1-clamp(ag_spr(k,0,0.5),0,1.2);ob_badge(ctx,h[0],h[1]-fall*60,text,{t:tt,drop:56,a:clamp(k*3,0,1)*(o.a==null?1:o.a),grey:o.grey,off:o.off,sw:fall*0.2});}
function ob_tag(ctx,hx,hy,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const dx=o.dx==null?-120:o.dx,dy=o.dy==null?70:o.dy,size=o.size||28,w=ag_tw(ctx,text,{w:700,size})+70,h=56;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(hx,hy);ctx.rotate(o.sw||0);
  ctx.strokeStyle="rgba(87,82,76,0.85)";ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(dx*0.4,dy*0.3,dx+(dx<0?w/2-22:-w/2+22),dy);ctx.stroke();
  ctx.translate(dx,dy);const l=dx<0;ag_card(ctx,c=>{if(l){c.moveTo(-w/2+16,-h/2);c.lineTo(w/2,-h/2);c.lineTo(w/2,h/2);c.lineTo(-w/2+16,h/2);c.lineTo(-w/2,0);}
    else{c.moveTo(-w/2,-h/2);c.lineTo(w/2-16,-h/2);c.lineTo(w/2,0);c.lineTo(w/2-16,h/2);c.lineTo(-w/2,h/2);}c.closePath();},{x:-w/2,y:-h/2,w,h},{edge:o.edge,edgeA:0.7});
  ctx.fillStyle="rgba(87,82,76,0.6)";ctx.beginPath();ctx.arc(l?w/2-22:-w/2+22,0,5,0,TAU);ctx.fill();
  ag_T(ctx,text,l?-w/2+26:-w/2+44,size*0.36,{w:700,size,col:o.col});ctx.restore();}
// the owner's tag (or any tag) on the ring's left, dropping in as o.k goes 0 to 1
function ob_tagOn(ctx,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const A=OB.agent,k=o.k==null?1:o.k,fall=1-clamp(ag_spr(k,0,0.5),0,1.2);
  ob_tag(ctx,(o.x==null?A.x:o.x)-30,(o.y==null?A.y:o.y)+(o.R||A.R)-2-fall*120,text,{dx:o.dx==null?-230:o.dx,dy:80,sw:fall*0.25,a:a*clamp(k*3,0,1),edge:o.edge,col:o.col});}
// an agent of this film, whole: its ring, then its badge (or a paper name tag where the badge goes, before it has one), and a tag on
// its left (its owner's, or whose helper it is); o: the ring's own options, badge (its text), name (a paper tag where the badge hangs),
// tag (the left tag's text, o.dx from the ring), bk/tk (0 to 1, dropping in), grey (0 to 1, switched off) and off (the words under a
// greyed badge)
function ob_agentWith(ctx,tt,o){o=o||{};const g=clamp(o.grey||0,0,1);ob_agent(ctx,tt,Object.assign({},o,{dim:Math.max(g,o.dim||0)}));const at={x:o.x,y:o.y,R:o.R};
  if(o.name&&(o.nameA==null||o.nameA>0)){const h=ob_hook(at);ob_tag(ctx,h[0],h[1],o.name,{dx:150,dy:72,a:(o.nameA==null?1:o.nameA)*(o.a==null?1:o.a)});}
  if(o.badge)ob_badgeOn(ctx,tt,o.badge,Object.assign({},at,{k:o.bk,grey:g,off:o.off,a:o.a}));
  if(o.tag)ob_tagOn(ctx,o.tag,Object.assign({},at,{k:o.tk,a:o.a,dx:o.dx}));}

/* ---------------------------------------------------------------- Planning's ticket, and the 214 changes
   ob_ticket: a ticket card, its corner notched, o.kick, o.title, o.lines; o.a, o.k. ob_tiles: the year's 214 changes to Planning's
   tables, as small tiles in rows of 18 (no words: the card beside them says what they are); o.who 0 to 1: every tile lit as Jun's
   (each change said Jun Park); o.sort 0 to 1: Jun goes through them, row by row, each turning to his own (ink) or his helper's
   (violet), nine left amber; o.pulse 0 to 1: the nine pulse; o.a */
function ob_ticket(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,lines=o.lines||[],h=28+38+48+lines.length*40+24;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_card(ctx,c=>{const n=18;c.moveTo(x+20,y);c.lineTo(x+w-n,y);c.lineTo(x+w,y+n);c.lineTo(x+w,y+h-20);c.quadraticCurveTo(x+w,y+h,x+w-20,y+h);
    c.lineTo(x+20,y+h);c.quadraticCurveTo(x,y+h,x,y+h-20);c.lineTo(x,y+20);c.quadraticCurveTo(x,y,x+20,y);c.closePath();},{x,y,w,h},{edge:o.edge,edgeA:0.7});
  ag_T(ctx,(o.kick||"Ticket").toUpperCase(),x+28,y+50,{w:700,size:28,ls:4,col:AG.kick});ag_T(ctx,o.title||"",x+28,y+98,{w:700,size:34});
  lines.forEach((l,i)=>ag_T(ctx,l,x+28,y+146+i*40,{w:600,size:28,col:AG.mut}));ctx.restore();return{x,y,w,h};}
const OB_TILES=(()=>{const R=ag_rnd(214),out=[],unsure=new Set([17,40,63,77,101,128,150,171,203]);
  for(let i=0;i<214;i++){out.push({c:i%18,r:(i/18)|0,kind:unsure.has(i)?2:(R()<0.58?1:0)});}return out;})();
function ob_tiles(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return{x,y,w:18*34-8,h:12*26-8};const who=clamp(o.who||0,0,1),sort=clamp(o.sort||0,0,1),pulse=clamp(o.pulse||0,0,1);
  ctx.save();ctx.globalAlpha*=a;const base=[176,171,164],jun=[112,108,102];
  for(const T_ of OB_TILES){const tx=x+T_.c*34,ty=y+T_.r*26,k=T_.r*18+T_.c,s=clamp(sort*1.25*12-(k/214)*12,0,1);
    let col=mix(base,jun,who),al=0.85;
    if(s>0){const to=T_.kind===1?AG.violet:T_.kind===2?AG.amber:jun;col=mix(col,to,ag_sine(s));}
    ctx.fillStyle=rgba(col,al);rr(ctx,tx,ty,26,18,5);ctx.fill();
    if(T_.kind===2&&s>0.5&&pulse>0){ctx.strokeStyle=rgba(AG.amber,0.7*pulse*(0.6+0.4*Math.sin((o.t||0)*4)));ctx.lineWidth=2.5;rr(ctx,tx-4,ty-4,34,26,7);ctx.stroke();}}
  ctx.restore();return{x,y,w:18*34-8,h:12*26-8};}
// a tile's place, for a line to it: the n-th unsure one (0 to 8)
function ob_unsureAt(x,y,n){const T_=OB_TILES.filter(t=>t.kind===2)[n];return[x+T_.c*34+13,y+T_.r*26+9];}

/* ---------------------------------------------------------------- switches
   ob_switch(ctx, x, y, w, label, sub, on, o): a card with a switch on it: its label, what it switches (sub), and its state, on (1) or
   off (0) between; o.states [on's word, off's word]; o.a, o.k. Returns its box. */
function ob_switch(ctx,x,y,w,label,sub,on,o){o=o||{};const a=o.a==null?1:o.a,h=sub?162:120;if(a<=0)return{x,y,w,h};on=clamp(on,0,1);const st=o.states||["On","Off"];
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:on<0.5?AG.mut:AG.blue,edgeA:0.55});
  ag_T(ctx,label,x+28,y+54,{w:700,size:30});if(sub)ag_T(ctx,sub,x+28,y+96,{w:600,size:28,col:AG.mut});
  const sx=x+w-150,sy=y+(sub?118:84)-22,sw=104,sh=44,u=ag_sine(on);
  ctx.fillStyle=rgba(mix([196,192,186],AG.blue,u),0.9);rr(ctx,sx,sy,sw,sh,22);ctx.fill();
  ctx.fillStyle="#F6F4F0";ctx.beginPath();ctx.arc(sx+22+u*(sw-44),sy+22,17,0,TAU);ctx.fill();ctx.strokeStyle="rgba(87,82,76,0.35)";ctx.lineWidth=1.5;ctx.stroke();
  const wa=on>0.5?(on-0.5)*2:(0.5-on)*2;ag_T(ctx,on>=0.5?st[0]:st[1],sx-24,sy+33,{w:700,size:28,align:"right",col:on>=0.5?AG.blue:AG.mut,a:wa});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the badge's card: one name in every tool
   ob_idCard(ctx, x, y, w, rows, o): a badge seen up close, with its strap's slot, its name and its owner, and a row for each tool:
   rows [[tool, what it is there, a (0 to 1), hl (0 to 1), mono, colour, the tool's logo]]; o.a, o.k. A logo the film doesn't carry
   draws nothing, and the name moves to its place. */
function ob_idCard(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,rh=74,h=160+rows.length*rh+24;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,24,{edge:AG.blue,edgeA:0.55});ctx.fillStyle=rgba(AG.blue,0.85);rr(ctx,x+16,y+12,w-32,8,4);ctx.fill();
  ctx.fillStyle="rgba(87,82,76,0.28)";rr(ctx,x+w/2-46,y+34,92,14,7);ctx.fill();
  ag_T(ctx,"BADGE",x+28,y+92,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,o.name||"planning agent",x+28,y+138,{w:700,size:38});
  if(o.owner)ag_T(ctx,o.owner,x+w-28,y+138,{w:600,size:28,align:"right",col:AG.mut,a:o.ownerA==null?1:o.ownerA});
  rows.forEach((r,i)=>{const ry=y+160+i*rh,ra=r[2]==null?1:r[2];if(ra<=0)return;const hl=r[3]||0;
    withA(ctx,ra,()=>{ctx.strokeStyle="rgba(87,82,76,0.16)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+24,ry+4);ctx.lineTo(x+w-24,ry+4);ctx.stroke();
      if(hl>0){ctx.fillStyle=rgba(AG.blue,0.08*hl);rr(ctx,x+14,ry+10,w-28,rh-10,12);ctx.fill();}
      const lock=/Lockup$/.test(r[6]||""),lw=r[6]?logo(ctx,r[6],x+28,ry+(lock?25:22),lock?34:40):0;if(!(lock&&lw))ag_T(ctx,r[0],x+28+(lw?lw+14:0),ry+52,{w:700,size:30});
      ag_T(ctx,r[1],x+w-28,ry+52,{w:500,size:28,f:r[4]?"mono":undefined,align:"right",col:r[5]||AG.ink});});});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the group and its grants (as Why Unity Catalog and Unity Gateway
   govern them draws them): ob_group(ctx, x, y, w, name, members, o): members [[name, is an agent, dashed]]; o.n how many shown;
   ob_grants(ctx, x, y, w, who, lines, o): lines [{text, lock, no, a, hl}] */
function ob_group(ctx,x,y,w,name,members,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const n=o.n==null?members.length:o.n,h=28+38+44+members.length*64+18;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:0.6});
  ag_T(ctx,"GROUP",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,name,x+28,y+96,{w:500,size:30,f:"mono"});
  members.forEach((m,i)=>{const k=clamp(n-i,0,1);if(k<=0)return;const my=y+142+i*64,agent=m[1],dash=m[2];
    withA(ctx,clamp(k*2,0,1)*(m[3]==null?1:m[3]),()=>{const tw=ag_tw(ctx,m[0],{w:700,size:28})+56;
      if(dash){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2.4;rr(ctx,x+28,my-24,tw,48,24);ctx.stroke();ctx.restore();ag_T(ctx,m[0],x+28+tw/2,my+10,{w:700,size:28,align:"center",col:AG.mut});}
      else{ag_box(ctx,x+28,my-24,tw,48,24,{edge:agent?AG.violet:null,edgeA:0.6});ag_T(ctx,m[0],x+28+tw/2,my+10,{w:700,size:28,align:"center",col:agent?AG.violet:AG.ink});}});});
  ctx.restore();return{x,y,w,h};}
function ob_grants(ctx,x,y,w,who,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const h=28+38+44+lines.length*50+30;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.55});
  ag_T(ctx,"GRANTS",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,who,x+28,y+96,{w:500,size:30,f:"mono"});
  lines.forEach((l,i)=>{const ly=y+150+i*50,la=l.a==null?1:l.a;if(la<=0)return;
    if(l.hl>0){ctx.fillStyle=rgba(AG.blue,0.09*l.hl);rr(ctx,x+14,ly-34,w-28,46,10);ctx.fill();}
    if(l.lock)ag_lock(ctx,x+42,ly-6,26,rgba(AG.blue,la));ag_T(ctx,l.text,x+(l.lock||l.no?68:28),ly,{w:600,size:28,a:la,col:l.no?AG.mut:AG.ink});
    if(l.no){withA(ctx,la,()=>{ctx.strokeStyle=rgba(AG.mut,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+30,ly-26);ctx.lineTo(x+54,ly+2);ctx.moveTo(x+54,ly-26);ctx.lineTo(x+30,ly+2);ctx.stroke();});}});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the logs
   ob_log(ctx, x, y, w, head, sub, rows, o): a log card, its head and its source (sub, in mono), and its rows [{when, who, text, tag (a
   pill after who), col (who's colour), hl (lit violet), warn (lit amber), ok (a green "Verified" pill at the row's end), a}]. A row
   with text is two lines tall: the change, then who. o.logo, a tool's mark before the head; o.mark, a tool's own lockup at the head's
   right, where the head doesn't name the tool (GitHub's, never beside its typed name); o.a, o.k, o.edge */
function ob_log(ctx,x,y,w,head,sub,rows,o){o=o||{};const a=o.a==null?1:o.a,rh=r=>r.text?96:52,h=28+38+(sub?46:4)+rows.reduce((s,r)=>s+rh(r),0)+22;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge,edgeA:0.8});let hx=x+28;if(o.logo){const lw=logo(ctx,o.logo,x+28,y+22,36);if(lw)hx+=lw+14;}
  ag_T(ctx,head.toUpperCase(),hx,y+50,{w:700,size:28,ls:4,col:AG.kick});
  if(o.mark&&LOGO[o.mark]){const im=LOGO[o.mark];logo(ctx,o.mark,x+w-28-32*im.width/im.height,y+24,32);}
  if(sub)ag_T(ctx,sub,x+28,y+94,{w:500,size:28,f:"mono",col:AG.mut});
  let ry=y+(sub?112:70);
  rows.forEach(r=>{const ra=r.a==null?1:r.a,hh=rh(r);if(ra>0)withA(ctx,ra,()=>{
      if(r.hl>0){ctx.fillStyle=rgba(AG.violet,0.09*r.hl);rr(ctx,x+14,ry,w-28,hh-6,10);ctx.fill();}
      if(r.warn>0){ctx.save();ctx.globalAlpha*=r.warn;ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.amber,0.85);ctx.lineWidth=2.4;rr(ctx,x+14,ry,w-28,hh-6,10);ctx.stroke();ctx.restore();}
      let ly=ry+34;if(r.text){ag_T(ctx,r.text,x+28,ly,{w:600,size:28});ly+=44;}
      let lx=x+28;if(r.when){ag_T(ctx,r.when,lx,ly,{w:500,size:28,f:"mono",col:AG.mut});lx+=ag_tw(ctx,r.when,{w:500,size:28,f:"mono"})+24;}
      if(r.who){ag_T(ctx,r.who,lx,ly,{w:500,size:28,f:"mono",col:r.col||AG.ink});lx+=ag_tw(ctx,r.who,{w:500,size:28,f:"mono"})+24;}
      if(r.tag)ag_pill(ctx,lx+(ag_tw(ctx,r.tag,{w:700,size:28})+56)/2,ly-10,r.tag,{size:28,col:r.col||AG.violet});
      if(r.ok>0)withA(ctx,r.ok,()=>{const t_="Verified",pw=ag_tw(ctx,t_,{w:700,size:28})+96;ag_pill(ctx,x+w-28-pw/2,ly-10,t_,{size:28,icon:"tick",col:AG.green});});});
    ry+=hh;});
  ctx.restore();return{x,y,w,h};}
// a search box: a magnifier and the query, in mono; o.p 0 to 1 types it; o.a, o.k
function ob_search(ctx,x,y,w,q,o){o=o||{};const a=o.a==null?1:o.a,h=76;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,h/2,{edge:AG.blue,edgeA:0.55});ctx.strokeStyle=rgba(AG.blue,0.9);ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(x+44,y+34,13,0,TAU);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+53,y+44);ctx.lineTo(x+64,y+55);ctx.stroke();
  const n=Math.round(q.length*clamp(o.p==null?1:o.p,0,1));ag_T(ctx,q.slice(0,n),x+86,y+48,{w:500,size:28,f:"mono"});ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- signing in: the job, the pass, the policy, the tokens, the vault
   ob_job: GitHub Actions' job box (blue), with its environment's tag and the branch it runs from (o.lock 0 to 1: its lock);
   ob_pass: GitHub's pass, a ticket with what it says (o.rows lit as they're named), and a small clock that empties as it runs out (o.run
   0 to 1); the tokens are passes too, under their own kick; ob_vault: the vault with the App's key behind its window, "signs, never
   shows"; ob_key: a key (Why Unity Catalog and Unity Gateway govern them's ug_key). Each takes o.a and o.k. */
function ob_key(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.scale(s,s);
  ctx.fillStyle="#3E4046";ctx.beginPath();ctx.moveTo(10,-5);ctx.lineTo(64,-5);ctx.lineTo(64,5);ctx.lineTo(58,5);ctx.lineTo(58,13);ctx.lineTo(51,13);ctx.lineTo(51,5);ctx.lineTo(44,5);
  ctx.lineTo(44,10);ctx.lineTo(38,10);ctx.lineTo(38,5);ctx.lineTo(10,5);ctx.closePath();ctx.fill();
  const g=ctx.createRadialGradient(-6,-6,2,0,0,22);g.addColorStop(0,rgba(mix(AG_OAK.base,[255,255,255],0.3),1));g.addColorStop(1,rgba(AG_OAK.base,1));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,20,0,TAU);ctx.fill();ctx.strokeStyle=rgba(AG_OAK.dark,0.6);ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle="rgba(60,52,44,0.55)";ctx.beginPath();ctx.arc(-6,0,5,0,TAU);ctx.fill();ctx.restore();}
function ob_clock(ctx,x,y,r,run,col){ctx.save();ctx.strokeStyle=rgba(col||AG.blue,0.25);ctx.lineWidth=5;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();
  const left=1-clamp(run,0,1);if(left>0){ctx.strokeStyle=rgba(col||AG.blue,0.9);ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+left*TAU);ctx.stroke();}
  ctx.restore();}
function ob_job(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=232;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.6});ag_T(ctx,"GITHUB ACTIONS",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});ag_T(ctx,"The planning agent's run",x+28,y+98,{w:700,size:32});
  ag_T(ctx,"environment",x+28,y+150,{w:600,size:28,col:AG.mut});ag_T(ctx,"planning-agent",x+w-28,y+150,{w:500,size:28,f:"mono",align:"right"});
  ag_T(ctx,"from",x+28,y+198,{w:600,size:28,col:AG.mut});
  // the branch it runs from, with room for its lock from the start (o.lock 0 to 1: the lock comes in, and the branch turns green)
  const br=o.branch||"main",lk=clamp(+o.lock||0,0,1);ag_T(ctx,br,x+w-68,y+198,{w:500,size:28,f:"mono",align:"right",col:o.branchCol||mix(AG.ink,AG.green,lk)});
  if(lk>0)ag_lock(ctx,x+w-46,y+192,26,rgba(AG.green,lk));ctx.restore();return{x,y,w,h};}
function ob_pass(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||[],h=28+38+44+rows.length*48+20;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_card(ctx,c=>{const nr=12,my=y+h/2;c.moveTo(x+18,y);c.lineTo(x+w-18,y);c.quadraticCurveTo(x+w,y,x+w,y+18);c.lineTo(x+w,my-nr);c.arc(x+w,my,nr,-Math.PI/2,Math.PI/2,true);
    c.lineTo(x+w,y+h-18);c.quadraticCurveTo(x+w,y+h,x+w-18,y+h);c.lineTo(x+18,y+h);c.quadraticCurveTo(x,y+h,x,y+h-18);c.lineTo(x,my+nr);c.arc(x,my,nr,Math.PI/2,-Math.PI/2,true);
    c.lineTo(x,y+18);c.quadraticCurveTo(x,y,x+18,y);c.closePath();},{x,y,w,h},{edge:o.edge||AG.blue,edgeA:0.6});
  ag_T(ctx,(o.kick||"GitHub's pass").toUpperCase(),x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});if(o.title)ag_T(ctx,o.title,x+28,y+94,{w:700,size:30});
  rows.forEach((r,i)=>{const ry=y+(o.title?140:100)+i*48,ra=r[2]==null?1:r[2];if(ra<=0)return;withA(ctx,ra,()=>{if(r[3]>0){ctx.fillStyle=rgba(AG.blue,0.1*r[3]);rr(ctx,x+14,ry-32,w-28,44,10);ctx.fill();}
    ag_T(ctx,r[0],x+28,ry,{w:600,size:28,col:AG.mut});ag_T(ctx,r[1],x+w-28,ry,{w:500,size:28,f:r[4]?"mono":undefined,align:"right"});});});
  if(o.run!=null)ob_clock(ctx,x+w-44,y+44,16,o.run,o.clockCol);
  ctx.restore();return{x,y,w,h};}
function ob_vault(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=260;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_floorShadow(ctx,x+w/2+AG.sdx*2,y+h+8,w*0.5,14,0.15);
  const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,"#5A5D64");g.addColorStop(1,"#3E4046");ctx.fillStyle=g;rr(ctx,x,y,w,h,20);ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.18)";ctx.lineWidth=2;rr(ctx,x+2,y+2,w-4,h-4,18);ctx.stroke();
  // its window, where the key can be seen and never taken
  const wx=x+28,wy=y+28,ww=w-56,wh=110;ctx.fillStyle="rgba(214,226,236,0.85)";rr(ctx,wx,wy,ww,wh,14);ctx.fill();
  ob_key(ctx,wx+ww/2-30,wy+wh/2,1.2,{rot:0});if(o.glow>0){ctx.save();ctx.globalAlpha*=o.glow;ctx.strokeStyle=rgba(AG.blue,0.9);ctx.lineWidth=4;rr(ctx,wx,wy,ww,wh,14);ctx.stroke();ctx.restore();}
  ag_T(ctx,"VAULT",x+28,y+184,{w:700,size:28,ls:4,col:[226,228,232]});ag_T(ctx,"signs, never shows",x+28,y+228,{w:600,size:28,col:[214,216,222]});
  ag_lock(ctx,x+w-46,y+184,30,"rgba(226,228,232,0.95)");ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a place of its own: branches, and schemas
   ob_branches(ctx, x, y, w, o): main, a line with its commits and a lock at its end; the agent's branch below it, violet, named
   o.name (OB_BRANCH, its first pull request's, by default); o.br 0 to 1 draws the branch; o.pr 0 to 1 a pull request's dashed arrow
   up to main; o.push 0 to 1 a push straight to main, refused (an amber cross); o.a */
const OB_BRANCH="agent/planning/class-size";
function ob_branches(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  const my=y,by=y+150,bx0=x+150,bx1=x+w*0.72;
  ctx.strokeStyle="rgba(87,82,76,0.75)";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,my);ctx.lineTo(x+w-70,my);ctx.stroke();
  for(let i=0;i<5;i++){const cx=x+40+i*(w-140)/4;ctx.fillStyle="#F3F1ED";ctx.beginPath();ctx.arc(cx,my,13,0,TAU);ctx.fill();ctx.strokeStyle="rgba(87,82,76,0.85)";ctx.lineWidth=4;ctx.stroke();}
  ag_lock(ctx,x+w-30,my+4,34,rgba(AG.green,1));ag_T(ctx,"main",x,my-34,{w:500,size:30,f:"mono"});
  const br=clamp(o.br==null?1:o.br,0,1);if(br>0){const u=ag_sine(br);ctx.strokeStyle=rgba(AG.violet,0.85);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(bx0,my);
    ctx.bezierCurveTo(bx0+40,my+20,bx0+40,by,bx0+110,by);ctx.lineTo(lerp(bx0+110,bx1,u),by);ctx.stroke();
    if(u>0.98){ctx.fillStyle="#F3F1ED";ctx.beginPath();ctx.arc(bx1,by,13,0,TAU);ctx.fill();ctx.strokeStyle=rgba(AG.violet,0.95);ctx.lineWidth=4;ctx.stroke();}
    ag_T(ctx,o.name||OB_BRANCH,bx0+110,by+56,{w:500,size:28,f:"mono",col:AG.violet,a:clamp(br*2-0.6,0,1)});}
  if(o.pr>0){const u=ag_sine(clamp(o.pr,0,1));ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(AG.blue,0.85);ctx.lineWidth=4;ctx.beginPath();
    ctx.moveTo(bx1+20,by-10);ctx.quadraticCurveTo(bx1+90,lerp(by,my,0.5),lerp(bx1+20,bx1+110,u),lerp(by-10,my+24,u));ctx.stroke();ctx.restore();
    if(u>0.95)ag_arrowHead(ctx,bx1+110,my+24,-1.2,10,rgba(AG.blue,0.9));
    withA(ctx,clamp(o.pr*2-1,0,1),()=>ag_pill(ctx,bx1+250,lerp(by,my,0.5)+10,"pull request",{size:28,col:AG.blue}));}
  if(o.push>0){const u=ag_sine(clamp(o.push*1.6,0,1)),k=clamp(o.push*1.6-0.6,0,1);ctx.strokeStyle=rgba(AG.amber,0.85);ctx.lineWidth=4;ctx.beginPath();
    ctx.moveTo(bx0+260,by-14);ctx.lineTo(bx0+260,lerp(by-14,my+34,u));ctx.stroke();if(k>0)ob_cross(ctx,bx0+260,my+52,16,k,AG.amber);}
  ctx.restore();}
// a schema, in mono, in its own small box; o.owner (a tag's words under it), o.edge, o.grey (someone else's: greyed), o.lock; o.a, o.k
function ob_schema(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,f={w:500,size:28,f:"mono"},w=ag_tw(ctx,name,f)+60+(o.lock?40:0),h=64;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,14,{edge:o.edge,edgeA:0.7});ag_T(ctx,name,x+30,y+42,Object.assign({},f,{col:o.grey?AG.mut:(o.col||AG.ink)}));
  if(o.lock)ag_lock(ctx,x+w-36,y+36,26,rgba(AG.mut,1));ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- Noor's map: an element, a step, someone else's step
   ob_el(ctx, x, y, w, kind, name, o): an element on the map: its kind in capitals over a thin bar of its colour (o.col: violet for an
   agent, blue for a role), its name, and o.sub under it (o.subA); o.a, o.k. ob_step(ctx, x, y, w, name, rows, o): a step of
   Planning's change process, with what it reads, writes and calls, a row each (rows [[verb, what, a]]); o.a, o.k. ob_ghost: a step
   that's a person's, dashed and muted, from its left edge. Each returns its box. */
function ob_el(ctx,x,y,w,kind,name,o){o=o||{};const a=o.a==null?1:o.a,h=o.sub?150:110;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));const col=o.col||AG.kick;
  ag_box(ctx,x,y,w,h,18,{edge:col,edgeA:0.65});ctx.fillStyle=rgba(col,0.85);rr(ctx,x+16,y+10,w-32,6,3);ctx.fill();
  ag_T(ctx,kind.toUpperCase(),x+28,y+54,{w:700,size:28,ls:4,col});ag_T(ctx,name,x+28,y+98,{w:700,size:32});
  if(o.sub)ag_T(ctx,o.sub,x+28,y+136,{w:600,size:28,col:AG.mut,a:o.subA==null?1:o.subA});ctx.restore();return{x,y,w,h};}
function ob_step(ctx,x,y,w,name,rows,o){o=o||{};const a=o.a==null?1:o.a,h=122+rows.length*48+10;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,18,{edge:AG.blue,edgeA:0.5});
  ag_T(ctx,"STEP",x+28,y+52,{w:700,size:28,ls:4,col:AG.kick});ag_T(ctx,name,x+28,y+96,{w:700,size:30});
  rows.forEach((r,i)=>{const ry=y+150+i*48,ra=r[2]==null?1:r[2];if(ra<=0)return;
    withA(ctx,ra,()=>{ag_T(ctx,r[0],x+28,ry,{w:600,size:28,col:AG.mut});ag_T(ctx,r[1],x+128,ry,{w:600,size:28});});});
  ctx.restore();return{x,y,w,h};}
function ob_ghost(ctx,x,y,text,a){const w=ag_tw(ctx,text,{w:700,size:28})+56,h=56;if(!(a>0))return{x,y:y-h/2,w,h};ctx.save();ctx.globalAlpha*=a;
  ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2.4;rr(ctx,x,y-h/2,w,h,h/2);ctx.stroke();ctx.setLineDash([]);
  ag_T(ctx,text,x+w/2,y+10,{w:700,size:28,align:"center",col:AG.mut});ctx.restore();return{x,y:y-h/2,w,h};}

/* ---------------------------------------------------------------- the tools' cards, and a row of boxes
   ob_list(ctx, x, y, w, o): a card of rows: o.kick in capitals (o.kickCol), after o.logo, the tool's own logo, where the film names the
   tool; o.title (o.titleF "mono" for a name the tool uses) after o.label, a muted word; o.rows [{text, a, hl (lit, o.hlCol), mono, col,
   dash (a slot nobody fills yet: dashed and muted), marks [[kind, a]] (a tick, a cross, a lock or a warning before the words, each
   at its own opacity, so a tick can turn to a cross)}]; o.edge, o.a, o.k. ob_tile(ctx, x, y, w, h, text, o): a box of words in a row
   of them, its tools' logos (o.logos) before the words; o.col, o.mono, o.dash, o.a, o.k. Each returns its box. */
function ob_mark(ctx,kind,x,y,a){if(!(a>0))return;
  if(kind==="tick")ag_tick(ctx,x,y-10,24,rgba(AG.green,a),4);else if(kind==="lock")ag_lock(ctx,x,y-6,26,rgba(AG.blue,a));
  else if(kind==="warn")ag_warn(ctx,x,y-10,28,rgba(AG.amber,a));else if(kind==="cross")ob_cross(ctx,x,y-10,11,a,AG.amber);}
function ob_list(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=o.rows||[],rh=52,top=o.title?156:110,h=top+(rows.length-1)*rh+40;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||AG.blue,edgeA:0.6});
  let kx=x+28;if(o.logo){const lw=logo(ctx,o.logo,x+28,y+24,36);if(lw)kx+=lw+14;}
  ag_T(ctx,String(o.kick||"").toUpperCase(),kx,y+52,{w:700,size:28,ls:4,col:o.kickCol||AG.blue});
  if(o.title){let tx=x+28;if(o.label){ag_T(ctx,o.label,tx,y+102,{w:600,size:28,col:AG.mut});tx+=ag_tw(ctx,o.label,{w:600,size:28})+16;}
    ag_T(ctx,o.title,tx,y+102,o.titleF==="mono"?{w:500,size:30,f:"mono"}:{w:700,size:30});}
  rows.forEach((r,i)=>{const ry=y+top+i*rh,ra=r.a==null?1:r.a;if(ra<=0)return;withA(ctx,ra,()=>{
    if(r.hl>0){ctx.fillStyle=rgba(r.hlCol||AG.blue,0.09*r.hl);rr(ctx,x+14,ry-34,w-28,46,10);ctx.fill();}
    if(r.dash){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2.2;rr(ctx,x+14,ry-34,w-28,46,10);ctx.stroke();ctx.restore();}
    const mk=r.marks||[];mk.forEach(m=>ob_mark(ctx,m[0],x+44,ry,m[1]==null?1:m[1]));
    ag_T(ctx,r.text,x+(mk.length?76:28),ry,Object.assign(r.mono?{w:500,size:28,f:"mono"}:{w:600,size:28},{col:r.col||(r.dash?AG.mut:AG.ink)}));});});
  ctx.restore();return{x,y,w,h};}
function ob_tile(ctx,x,y,w,h,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));const col=o.col||AG.blue,f=o.mono?{w:500,size:30,f:"mono"}:{w:700,size:30};
  if(o.dash){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.mut,0.8);ctx.lineWidth=2.4;rr(ctx,x,y,w,h,18);ctx.stroke();ctx.restore();}
  else ag_box(ctx,x,y,w,h,18,{edge:col,edgeA:0.6});
  const ls=(o.logos||[]).map(k=>{const im=LOGO[k];return im?[k,34*im.width/im.height]:null;}).filter(Boolean),lw=ls.reduce((s_,l)=>s_+l[1]+12,0);
  let lx=x+w/2-(ag_tw(ctx,text,f)+lw)/2;ls.forEach(([k,wi])=>{logo(ctx,k,lx,y+h/2-17,34);lx+=wi+12;});
  ag_T(ctx,text,lx,y+h/2+11,Object.assign({},f,{col:o.dash?AG.mut:(o.textCol||AG.ink)}));ctx.restore();return{x,y,w,h};}
