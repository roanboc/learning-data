/* ===== Modern data basics: the module's look =====
   The films of Modern data basics (Data that moves, Data as software, From tables to decisions, Documents as data) share one
   look, assumed on 5 November 2026 for the author to review (films/data-that-moves/decided.md): the intro's platform map, drawn
   up close. The dark navy map of The Inner Life of Data, its systems, lanes of light, layers and readers, drawn near enough to work
   in, with people drawn to the agent films' rules (people.js there) and lit for the dark. Glass panels with a coloured edge only
   where the colour means something; words in white or a soft blue-grey; solid pills with dark words where a verdict must read at once.
   No film grain, no watercolour.
   The module's files, bundled in this order after The Inner Life of Data's helpers (core.js, style2.js, ui3.js, and its logos.js
   with this module's for a film that names its tools), A Sharper Sketch's scene() (sketch3.js) and the agent films' kit, people
   and agent (films/what-an-agent-is/shared/src/kit.js, people.js, agent.js: the camera, the shots, pictures painted once, the people):
     look.js   the palette and what each colour means, words, the places, lanes of light and what moves along them, and icons
     people.js the cast and md_person, the agent films' people lit for the dark
     cards.js  glass cards, pills, tags, the kicker, the module's mark, and the title and end cards
     map.js    the platform map's parts drawn near: a system, the platform, a layer, a table, a reader, the ways data moves,
               and the whole map at once
     tools.js  the tools' pages, each with a small bar naming the product and its logo, and what goes in them: rows, a catalog's tree
   Every top-level name starts with md_ or MD_. A film's own pictures and helpers go in its own source with a prefix of its own;
   never change these files for one film.
   Sizes are in the 1920 x 1080 frame. Every word is at least 28 px as seen, and nothing but the captions goes below y 890. */

/* ---------------------------------------------------------------- colours, and what each means in every film of the module */
const MD={
  ink:[236,243,255],       // words
  soft:[166,184,210],      // quieter words, at 8:1 or more on the navy
  dim:[112,128,156],       // lines and frames that only hold things together
  navy:[6,11,24],          // the night itself; dark words on a solid pill
  flow:[120,200,255],      // data moving, and the platform's structure: lanes, connectors, mirrors, the catalog
  agreed:[255,209,102],    // what people agree on: a contract at an interface, a definition, a measure
  pass:[120,240,170],      // a check passes, it works, it arrived
  fail:[255,96,86],        // an error, a failure, something broken
  wait:[255,184,77],       // waiting for a person: a review, an approval, a question
  personal:[204,166,255],  // personal data, which stays where it may be read (always with a lock)
  dbx:[255,54,33],         // Databricks' own bar, as the intro's map draws it
  dbt:[255,105,75],        // dbt's own card
  // the university's systems and its business domains keep the colours the intro's map gives them
  sys:{hr:[255,150,200],fin:[255,226,122],sis:[255,176,64],lms:[126,224,140]},
  dom:{finance:[255,138,92],teaching:[176,123,255],students:[77,163,255],research:[47,211,192]},
  layer:{bronze:[232,162,107],silver:[214,228,255],gold:[255,209,102]}
};
const MD_MEANS={flow:MD.flow,agreed:MD.agreed,pass:MD.pass,fail:MD.fail,wait:MD.wait,personal:MD.personal};

/* ---------------------------------------------------------------- words
   md_T draws with The Inner Life of Data's T (so the legibility check measures it; {deco:1} marks decoration on purpose), in white
   unless o.col (a colour) or o.color (a CSS colour) says otherwise; o.ls spaces the letters, in px; o.f "mono" for code. Size 28 by
   default. md_tw and md_wrap measure and wrap as the agent films' ag_tw and ag_wrap do. */
function md_T(ctx,s,x,y,o){o=o||{};const a=o.a==null?1:o.a,col=o.color||rgba(o.col||MD.ink,a),ls=o.ls||0,q=Object.assign({},o,{color:col,size:o.size||28});
  if(!ls){T(ctx,s,x,y,q);return;}
  const dx=o.align==="center"?ls/2:(o.align==="right"||o.align==="end")?ls:0;ctx.save();ctx.letterSpacing=ls+"px";T(ctx,s,x+dx,y,q);ctx.restore();}
const md_tw=(ctx,s,o)=>ag_tw(ctx,s,o),md_wrap=(ctx,s,maxW,o)=>ag_wrap(ctx,s,maxW,o);
// a heading on the map: capitals, letter-spaced, soft unless o.col
function md_label(ctx,x,y,text,o){o=o||{};md_T(ctx,String(text).toUpperCase(),x,y,{w:800,size:o.size||28,ls:o.ls==null?4:o.ls,align:o.align||"left",col:o.col||MD.soft,a:o.a});}

/* ---------------------------------------------------------------- the places
   "map" is the night the map lives in: the navy of The Inner Life of Data, its faint grid every 48 px, and a vignette; "night" is the
   same without the grid, for title and end cards and for a film's own scenes. Each is painted once (AG_PLACES; check.py times it).
   The map's parts are drawn live over it, in the place's coordinates, so they stay sharp however close the camera comes. */
function md_paintNight(c,o){o=o||{};const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"#0a1022");g.addColorStop(0.55,"#060a17");g.addColorStop(1,"#03050b");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the light the glass panels throw on the night: two broad, faint pools
  for(const [x,y,r,col,a] of [[560,420,760,MD.flow,0.05],[1500,560,700,[150,120,255],0.035]]){const q=c.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,rgba(col,a));q.addColorStop(1,rgba(col,0));c.fillStyle=q;c.fillRect(0,0,W,H);}
  if(o.grid){c.strokeStyle="rgba(120,160,230,0.05)";c.lineWidth=1;for(let x=0;x<=W;x+=48){c.beginPath();c.moveTo(x+0.5,0);c.lineTo(x+0.5,H);c.stroke();}for(let y=0;y<=H;y+=48){c.beginPath();c.moveTo(0,y+0.5);c.lineTo(W,y+0.5);c.stroke();}}
  const v=c.createRadialGradient(W/2,H/2,H*0.32,W/2,H/2,W*0.74);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.55)");c.fillStyle=v;c.fillRect(0,0,W,H);}
AG_PLACES.map=c=>md_paintNight(c,{grid:true});
AG_PLACES.night=c=>md_paintNight(c,{grid:false});
// a vignette in the frame itself, over a shot (it stays put while the camera moves); a film calls it after ag_shots
function md_vign(ctx,S,a){setScreen(ctx,S);const v=ctx.createRadialGradient(W/2,H/2,H*0.36,W/2,H/2,W*0.72);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,"+(0.42*(a==null?1:a))+")");ctx.fillStyle=v;ctx.fillRect(0,0,W,H);}

/* ---------------------------------------------------------------- lanes of light, and what moves along them
   md_curve(a, b, o) is a smooth path from point a to point b, leaving and arriving level (o.bend 0 to 1, how far the turn reaches),
   as the points md_lane and md_flow follow; md_path(points) joins straight runs. md_lane(ctx, pts, col, a, o) draws the lane, o.u
   (0 to 1) only as far as that, o.dash for a lane that only points the way (a query in place, a mirror's shortcut: nothing is
   copied along it). md_flow(ctx, pts, t, o) sends data along it: o.kind "events" (one small packet after another, each change as
   it's made), "batch" (a stack of rows now and then: a whole file), "stream" (a steady run), o.col, o.every, o.dur, o.a, o.back
   (from the end to the start). */
function md_curve(a,b,o){o=o||{};const k=o.bend==null?0.5:o.bend,dx=(b[0]-a[0])*k,n=o.n||36;return bez(P(a[0],a[1]),P(a[0]+dx,a[1]),P(b[0]-dx,b[1]),P(b[0],b[1]),n).map(p=>[p.x,p.y]);}
function md_path(pts){const out=[];for(let i=0;i<pts.length;i++){if(i===0){out.push(pts[0]);continue;}const a=pts[i-1],b=pts[i];for(let k=1;k<=12;k++)out.push([lerp(a[0],b[0],k/12),lerp(a[1],b[1],k/12)]);}return out;}
function md_cut(pts,u){if(u>=1)return pts;const p=mk(pts.map(q=>P(q[0],q[1]))),out=[];for(let i=0;i<=40;i++){const q=at(p,u*i/40);out.push([q.x,q.y]);}return out;}
function md_lane(ctx,pts,col,a,o){o=o||{};a=a==null?1:a;if(a<=0.004||pts.length<2)return;const u=o.u==null?1:clamp(o.u,0,1);if(u<=0)return;const q=md_cut(pts,u).map(p=>P(p[0],p[1]));
  if(o.dash){ctx.save();ctx.globalCompositeOperation="lighter";ctx.lineCap="round";ctx.setLineDash(o.dash===true?[10,14]:o.dash);ctx.lineDashOffset=-(o.t||0)*(o.speed||24);
    for(const [w,al] of [[8,0.08],[3,0.4],[1.6,0.9]]){poly(ctx,q);ctx.strokeStyle=rgba(col,al*a);ctx.lineWidth=w;ctx.stroke();}ctx.restore();return;}
  lane(ctx,q,col,a);}
function md_flow(ctx,pts,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||pts.length<2)return;const col=o.col||MD.flow,kind=o.kind||"events",p=mk((o.back?pts.slice().reverse():pts).map(q=>P(q[0],q[1])));
  const every=o.every||(kind==="batch"?3.2:kind==="stream"?0.18:0.9),dur=o.dur||(kind==="batch"?2.4:1.6),k=o.size||1;
  spawn(t,every,dur,o.off||0,(u,i)=>{const q=at(p,ease(u)),f=sstep(0,0.12,u)*(1-sstep(0.88,1,u))*a;if(f<=0.004)return;
    if(kind==="batch"){glow(ctx,q.x,q.y,46*k,col,0.5*f);ctx.save();ctx.globalAlpha*=f;ctx.translate(q.x,q.y);for(let s=2;s>=0;s--){rr(ctx,-22*k+s*5*k,-16*k-s*5*k,44*k,32*k,5*k);ctx.fillStyle=rgba(mix(col,MD.navy,0.55),0.95);ctx.fill();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2;ctx.stroke();
        ctx.fillStyle=rgba(col,0.7);for(let r=0;r<3;r++)ctx.fillRect(-16*k+s*5*k,-10*k-s*5*k+r*8*k,30*k,3*k);}ctx.restore();}
    else if(kind==="stream"){glow(ctx,q.x,q.y,14*k,col,0.9*f);}
    else{glow(ctx,q.x,q.y,26*k,col,0.55*f);ctx.save();ctx.globalAlpha*=f;rr(ctx,q.x-9*k,q.y-9*k,18*k,18*k,4*k);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),1);ctx.fill();ctx.restore();}});}

/* ---------------------------------------------------------------- icons
   md_icon(ctx, kind, x, y, s, col, o) draws an icon centred on (x, y), s px across, in a colour ([r, g, b]), with lines that keep
   their weight at any size. Kinds: "connector" (a plug: a managed connector brings data in), "query" (a lens: a query in place
   reads it where it lives), "mirror" (a shape and its dashed reflection: the catalog shown in another tool, nothing copied), "share"
   (two linked nodes: shared with a partner where it lives), "api" (braces: served on request), "event" (a spark: one change),
   "batch" (stacked sheets: a whole file), "stream" (waves), "table", "view", "volume" (a folder), "store" (a database), "contract"
   (a page with a seal), "lock", "key", "tick", "cross", "warn", "clock", "refresh", "person", "eye", "doc". */
function md_icon(ctx,kind,x,y,s,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const c=rgba(col,1),u=s/48;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(u,u);
  ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=o.lw||3.6;ctx.lineCap="round";ctx.lineJoin="round";const L=(pts)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();};
  switch(kind){
    case"connector":rr(ctx,-14,-10,22,20,5);ctx.stroke();L([[-14,0],[-22,0]]);L([[8,-5],[18,-5]]);L([[8,5],[18,5]]);break;
    case"query":ctx.beginPath();ctx.arc(-4,-4,13,0,TAU);ctx.stroke();L([[6,6],[18,18]]);break;
    // the mirror: a table, and beyond a line the same table again in dashes, its picture and not a copy
    case"mirror":L([[0,-21],[0,21]]);rr(ctx,-22,-12,16,24,3);ctx.stroke();L([[-22,-2],[-6,-2]]);ctx.save();ctx.setLineDash([3.5,4]);rr(ctx,6,-12,16,24,3);ctx.stroke();L([[6,-2],[22,-2]]);ctx.restore();break;
    case"share":ctx.beginPath();ctx.arc(-12,0,7,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(12,-12,7,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(12,12,7,0,TAU);ctx.stroke();L([[-6,-3],[6,-9]]);L([[-6,3],[6,9]]);break;
    case"api":ctx.lineWidth=(o.lw||3.6);L([[-8,-18],[-14,-18],[-16,-14],[-16,-4],[-20,0],[-16,4],[-16,14],[-14,18],[-8,18]]);L([[8,-18],[14,-18],[16,-14],[16,-4],[20,0],[16,4],[16,14],[14,18],[8,18]]);break;
    case"event":ctx.beginPath();ctx.moveTo(4,-20);ctx.lineTo(-10,3);ctx.lineTo(1,3);ctx.lineTo(-4,20);ctx.lineTo(11,-4);ctx.lineTo(0,-4);ctx.closePath();ctx.fill();break;
    case"batch":for(let i=2;i>=0;i--){rr(ctx,-14+i*4,-12-i*4,24,30,3);ctx.save();ctx.fillStyle="rgba(6,11,24,1)";ctx.fill();ctx.restore();ctx.stroke();}L([[-6,-2],[6,-2]]);L([[-6,6],[6,6]]);break;
    case"stream":for(const dy of[-10,0,10]){ctx.beginPath();ctx.moveTo(-20,dy);ctx.bezierCurveTo(-10,dy-7,-4,dy+7,6,dy);ctx.bezierCurveTo(12,dy-4,16,dy-4,20,dy);ctx.stroke();}break;
    case"table":rr(ctx,-18,-15,36,30,4);ctx.stroke();L([[-18,-5],[18,-5]]);L([[-18,5],[18,5]]);L([[-4,-15],[-4,15]]);break;
    case"view":ctx.beginPath();ctx.moveTo(-20,0);ctx.quadraticCurveTo(0,-18,20,0);ctx.quadraticCurveTo(0,18,-20,0);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();break;
    case"eye":md_icon(ctx,"view",0,0,48,col,{lw:o.lw});break;
    case"volume":ctx.beginPath();ctx.moveTo(-20,-12);ctx.lineTo(-6,-12);ctx.lineTo(-2,-7);ctx.lineTo(20,-7);ctx.lineTo(20,15);ctx.lineTo(-20,15);ctx.closePath();ctx.stroke();break;
    case"store":for(const dy of[-12,0,12]){ctx.beginPath();ctx.ellipse(0,dy-2,17,5,0,0,TAU);ctx.stroke();}L([[-17,-14],[-17,10]]);L([[17,-14],[17,10]]);break;
    case"contract":ctx.beginPath();ctx.moveTo(-15,-20);ctx.lineTo(8,-20);ctx.lineTo(15,-13);ctx.lineTo(15,20);ctx.lineTo(-15,20);ctx.closePath();ctx.stroke();L([[-8,-9],[7,-9]]);L([[-8,-1],[7,-1]]);ctx.beginPath();ctx.arc(5,11,6,0,TAU);ctx.fill();break;
    case"doc":ctx.beginPath();ctx.moveTo(-14,-20);ctx.lineTo(7,-20);ctx.lineTo(14,-13);ctx.lineTo(14,20);ctx.lineTo(-14,20);ctx.closePath();ctx.stroke();L([[-7,-8],[7,-8]]);L([[-7,0],[7,0]]);L([[-7,8],[4,8]]);break;
    case"lock":ctx.beginPath();ctx.arc(0,-7,10,Math.PI,0);ctx.stroke();rr(ctx,-15,-6,30,24,5);ctx.fill();ctx.save();ctx.fillStyle="rgba(6,11,24,1)";ctx.beginPath();ctx.arc(0,4,3.5,0,TAU);ctx.fill();ctx.restore();break;
    case"key":ctx.beginPath();ctx.arc(-9,0,9,0,TAU);ctx.stroke();L([[0,0],[20,0]]);L([[14,0],[14,8]]);L([[20,0],[20,6]]);break;
    case"tick":ctx.lineWidth=(o.lw||4.6);L([[-14,1],[-4,11],[15,-11]]);break;
    case"cross":ctx.lineWidth=(o.lw||4.6);L([[-12,-12],[12,12]]);L([[12,-12],[-12,12]]);break;
    case"warn":ctx.beginPath();ctx.moveTo(0,-19);ctx.lineTo(20,16);ctx.lineTo(-20,16);ctx.closePath();ctx.stroke();L([[0,-6],[0,5]]);ctx.beginPath();ctx.arc(0,11,2.4,0,TAU);ctx.fill();break;
    case"clock":ctx.beginPath();ctx.arc(0,0,18,0,TAU);ctx.stroke();L([[0,-10],[0,0],[8,6]]);break;
    case"refresh":ctx.beginPath();ctx.arc(0,0,15,-0.6,Math.PI*1.45);ctx.stroke();ctx.beginPath();ctx.moveTo(15,-16);ctx.lineTo(14,-4);ctx.lineTo(3,-8);ctx.closePath();ctx.fill();break;
    case"person":ctx.beginPath();ctx.arc(0,-9,8,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(-15,18);ctx.quadraticCurveTo(-14,3,0,3);ctx.quadraticCurveTo(14,3,15,18);ctx.stroke();break;
  }
  ctx.restore();}
