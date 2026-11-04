/* ===== Context engineering: the room's own pieces =====
   Everything this film puts in the module's room (the lab, the agent, the cards) that the shared code doesn't have (prefix ce_):
     CE_ROOM      where things stand: Jun at his desk on the left, the agent's ring right of the middle, its three tools on the right
     ce_jun       Jun at his desk; ce_desk a desk with a person behind it, cut at its back edge (Lucía's)
     ce_tool      a tool's card: its name, what it reaches, a lock and "read only"; ce_arm the curve from the agent to it
     ce_code      a card of a file's lines, in the mono face, its path as the kicker; o.hi lights some lines
     ce_calc      the count, worked out: the agent's number, those coming back, the right number
     ce_context   the four kinds of context, a card each, round the agent: code, metadata, skills and tools
     ce_tests     the test's four students, a row each, ticking as each passes
     ce_inbox     an inbox tray, with the old email in it
     ce_screen    a screen on a desk, showing the glossary's term
     ce_dash      a dashed pill: a word with nothing written for it
     ce_fly       a card carried from one place to another, shrinking or growing on the way
     CE_LUCIA     the new analyst in Planning, as Context and memory, governed draws her
   Words are drawn live with ag_T, at least 28 px, above y 890. */

const CE_ROOM={jun:[300,600,1],ring:[1124,476],tools:[["Catalog",236],["Query",404],["Docs",572]],tx:1530,tw:300,th:148,desk:{x:-80,y:1000,w:800,depth:150}};
const CE_TOOLDO=["tables and columns","counts the rows","the team's docs"];
const CE_LUCIA={name:"Lucía Ortega",key:"ce-lucia",role:"Planning",skin:[206,160,124],hair:{style:"long",c:[48,32,26]},earrings:[208,214,226],top:{kind:"sweater",c:[84,88,96]},breath:0.29};
// the arm from the agent's ring to tool i (the curve the module's other films use)
const ce_arm=i=>{const y=CE_ROOM.tools[i][1]+CE_ROOM.th/2;return[1304,476,1380,476,1440,y,CE_ROOM.tx-4,y];};

/* ---------------------------------------------------------------- people at desks */
function ce_jun(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const [jx,jy,js]=CE_ROOM.jun,D=CE_ROOM.desk;ctx.save();ctx.globalAlpha*=a;
  ag_desk(ctx,D.x,D.y,D.w,{depth:D.depth});
  ag_person(ctx,"jun",jx,jy,js,{t,gaze:o.gaze,nod:o.nod||0,talk:o.talk||0,smile:o.smile||0,cut:D.y-D.depth});ctx.restore();}
// a person behind a desk whose front edge's top is at (dx, dy), w wide: who, (x, y, s) for ag_person; o as ag_person's, and o.a
function ce_desk(ctx,who,x,y,s,dx,dy,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_desk(ctx,dx,dy,w,{depth:150});
  ag_person(ctx,who,x,y,s,Object.assign({},o,{a:undefined,cut:dy-150}));ctx.restore();}

/* ---------------------------------------------------------------- a tool's card
   ce_tool(ctx, i, o): tool i of CE_ROOM.tools, its name, what it reaches (CE_TOOLDO), a lock and "read only"; o.touch (0 to 1) its blue
   edge while an arm holds it, o.dx slides it in from the right, o.a. Returns its box. */
function ce_tool(ctx,i,o){o=o||{};const a=o.a==null?1:o.a,x=CE_ROOM.tx+(o.dx||0),y=CE_ROOM.tools[i][1],w=CE_ROOM.tw,h=CE_ROOM.th,b={x,y,w,h};if(a<=0)return b;
  ctx.save();ctx.globalAlpha*=a;const on=o.touch||0;ag_box(ctx,x,y,w,h,20,{edge:on>0.1?AG.blue:null,edgeA:0.9*on,glow:on>0.1?AG.blue:null,glowA:on});
  ag_T(ctx,CE_ROOM.tools[i][0],x+28,y+48,{w:700,size:32});ag_T(ctx,CE_TOOLDO[i],x+28,y+86,{w:500,size:28,col:AG.mut});
  ag_lock(ctx,x+42,y+h-30,28,rgba(AG.blue,1));ag_T(ctx,"read only",x+66,y+h-22,{w:600,size:28,col:AG.blue});ctx.restore();return b;}
// the agent at its place in the room: its ring, the model, its steps; o as ag_loop's
function ce_agent(ctx,t,o){const [rx,ry]=CE_ROOM.ring;return ag_loop(ctx,rx,ry,Object.assign({t,floor:ry+300},o||{}));}

/* ---------------------------------------------------------------- a file's lines
   ce_code(ctx, x, y, w, kick, lines, o): a card, its kicker the file's path (in capitals unless o.path keeps it as it is), then the
   lines in the mono face, 28 px, 40 apart; o.hi {from, to, col, a} lights lines from to to in a soft band; o.edge, o.k, o.a; o.cut
   (0 to 1) shows that much of the lines, typed in. Returns its box. */
function ce_code(ctx,x,y,w,kick,lines,o){o=o||{};const a=o.a==null?1:o.a,lh=40,h=AG_PAD*2+(kick?44:0)+lines.length*lh,b={x,y,w,h};if(a<=0)return b;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,20,{edge:o.edge||null,edgeA:0.8});
  let yy=y+AG_PAD+22;if(kick){ag_T(ctx,o.path?kick:String(kick).toUpperCase(),x+AG_PAD,yy,o.path?{w:500,size:28,f:"mono",col:AG.blue}:{w:700,size:28,ls:4,col:AG.blue});yy+=44;}
  const hi=o.hi;if(hi&&(hi.a==null||hi.a>0.01)){ctx.save();ctx.globalAlpha*=hi.a==null?1:hi.a;ctx.fillStyle=rgba(hi.col||AG.green,0.12);
    rr(ctx,x+12,yy-30+hi.from*lh,w-24,(hi.to-hi.from+1)*lh+4,10);ctx.fill();ctx.fillStyle=rgba(hi.col||AG.green,0.9);rr(ctx,x+12,yy-30+hi.from*lh,6,(hi.to-hi.from+1)*lh+4,3);ctx.fill();ctx.restore();}
  const shown=o.cut==null?lines.length:clamp(o.cut,0,1)*lines.length;
  lines.forEach((l,i)=>{const u=clamp(shown-i,0,1);if(u<=0)return;const s=u<1?l.slice(0,Math.ceil(l.length*u)):l;
    ag_T(ctx,s,x+AG_PAD,yy+i*lh,{w:500,size:28,f:"mono",col:o.cols&&o.cols[i]?o.cols[i]:AG.ink});});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the count, worked out
   ce_calc(ctx, x, y, w, on, o): three rows, each in (on[i], 0 to 1) as the voice reaches it: the agent's 6,931 (its guess, violet),
   less 719 coming back (amber), and the right number, 6,212 (green, with a tick); o.a, o.k. */
const CE_CALC=[["The agent's count","6,931",AG.violet],["Coming back to a course","− 719",AG.amber],["Commencing","6,212",AG.green]];
function ce_calc(ctx,x,y,w,on,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=AG_PAD*2+3*64+20;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});
  CE_CALC.forEach(([lab,num,col],i)=>{const u=clamp(on[i]||0,0,1);if(u<=0)return;const yy=y+AG_PAD+44+i*64+(i===2?20:0);ctx.save();ctx.globalAlpha*=u;
    if(i===2){ctx.strokeStyle="rgba(60,50,40,0.3)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+AG_PAD,yy-46);ctx.lineTo(x+w-AG_PAD,yy-46);ctx.stroke();}
    ag_T(ctx,lab,x+AG_PAD,yy,{w:600,size:30,col:i===2?AG.ink:AG.mut});ag_T(ctx,num,x+w-AG_PAD-(i===2?46:0),yy,{w:800,size:38,col,align:"right"});
    if(i===2)ag_tick(ctx,x+w-AG_PAD-14,yy-12,24,rgba(AG.green,1),4);ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the four kinds of context, round the agent
   CE_KINDS: each card's kicker, title and line, and where it sits (x, y; each 520 wide). ce_context(ctx, t, on, o): on[i] (0 to 1)
   brings card i in, and an arm from the agent at o.at ([x, y], [960, 470]) reaches it, data coming back along it (o.data[i]); o.miss
   (0 to 1) shows a word missing under the metadata, dashed amber, and o.guess (0 to 1) the agent's guess in its place, violet; o.a,
   o.core and o.think for the sphere, o.r its size. Returns the cards' boxes. */
const CE_KINDS=[{kick:"Code",title:"The repository",sub:"Recipes, tests, AGENTS.md",x:80,y:150},{kick:"Metadata",title:"What words mean",sub:"Data models, contracts, lineage",x:1320,y:150},
  {kick:"Skills",title:"How the team does a job",sub:"Step by step",x:80,y:560},{kick:"Tools",title:"What it can reach and do",sub:"Catalog, Query, Docs: read only",x:1320,y:560}];
const CE_KW=520;
function ce_context(ctx,t,on,o){o=o||{};const a=o.a==null?1:o.a,[cx,cy]=o.at||[960,470],r=o.r||96,out=[];if(a<=0)return out;ctx.save();ctx.globalAlpha*=a;
  ag_modelLight(ctx,cx,cy,r,1,cy+260);
  CE_KINDS.forEach((k,i)=>{const b=ag_textCard(ctx,k.x,k.y,CE_KW,{kick:k.kick,title:k.title,sub:k.sub},{measure:true});out.push(b);const u=clamp(on[i]||0,0,1);if(u<=0)return;
    const left=k.x<cx,ex=left?k.x+CE_KW+4:k.x-4,ey=k.y+b.h/2,sx=cx+(left?-r*0.92:r*0.92),sy=cy+(ey<cy?-r*0.35:r*0.35);
    ag_reach(ctx,[sx,sy,lerp(sx,ex,0.45),sy,lerp(sx,ex,0.55),ey,ex,ey],ag_sine(clamp(u*1.4,0,1)),{data:o.data?o.data[i]:0,grip:1});});
  ag_model(ctx,cx,cy,r,{t,core:o.core==null?1:o.core,think:o.think||0,label:o.label});
  CE_KINDS.forEach((k,i)=>{const u=clamp(on[i]||0,0,1);if(u<=0)return;const p=clamp(ag_spr(u,0,0.5),0,1.2);
    ag_textCard(ctx,k.x,k.y,CE_KW,{kick:k.kick,title:k.title,sub:k.sub},{a:clamp(u*2,0,1),k:p,kickCol:AG.blue,edge:o.lit===i?AG.blue:null});});
  const m=o.miss||0,g=o.guess||0,mx=CE_KINDS[1].x+CE_KW/2,my=out[1].y+out[1].h+82;
  if(m>0.01){if(g<0.99)ce_dash(ctx,mx,my,"commencing",{a:m*(1-g),col:AG.amber});
    if(g>0.01)ag_pill(ctx,mx,my,"a guess, said like a fact",{col:AG.violet,a:g*m});}
  ctx.restore();return out;}

/* ---------------------------------------------------------------- a word with nothing written for it */
function ce_dash(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const col=o.col||AG.mut,w=ag_tw(ctx,text,{w:700,size:30})+64,h=58;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x-w/2,y-h/2,w,h,h/2,{});ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.setLineDash([8,8]);rr(ctx,x-w/2+5,y-h/2+5,w-10,h-10,(h-10)/2);ctx.stroke();ctx.setLineDash([]);
  ag_T(ctx,text,x,y+11,{w:700,size:30,align:"center",col:col===AG.mut?AG.ink:col});ctx.restore();}

/* ---------------------------------------------------------------- the test's four students
   ce_tests(ctx, x, y, w, on, o): the test's name, then a row for each of the four students in it and what it expects, each ticking
   green as on[i] reaches 1; o.a, o.k. */
const CE_TESTS=[["Started the certificate this year","true"],["Came back to it after leave","false"],["Finished a master, then started it","true"],["Started it last year","false"]];
function ce_tests(ctx,x,y,w,on,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const rh=58,h=AG_PAD*2+44+48+CE_TESTS.length*rh;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});let yy=y+AG_PAD+22;ag_T(ctx,"A TEST ON PLANNING'S DATA",x+AG_PAD,yy,{w:700,size:28,ls:4,col:AG.blue});yy+=48;
  ag_T(ctx,"commencing_means_started_for_the_first_time_this_year",x+AG_PAD,yy,{w:500,size:28,f:"mono"});yy+=20;
  CE_TESTS.forEach(([lab,exp],i)=>{const u=clamp(on[i]||0,0,1),ry=yy+(i+1)*rh;ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+AG_PAD,ry-40);ctx.lineTo(x+w-AG_PAD,ry-40);ctx.stroke();
    ag_T(ctx,lab,x+AG_PAD+44,ry,{w:600,size:30,col:mix(AG.mut,AG.ink,u)});ag_T(ctx,exp,x+w-AG_PAD-60,ry,{w:500,size:28,f:"mono",col:exp==="true"?AG.ink:AG.mut,align:"right"});
    if(u>0.01){ctx.save();ctx.globalAlpha*=u;ag_tick(ctx,x+AG_PAD+16,ry-10,24,rgba(AG.green,1),4);ctx.restore();}else{ctx.fillStyle="rgba(60,50,40,0.18)";ctx.beginPath();ctx.arc(x+AG_PAD+16,ry-10,7,0,TAU);ctx.fill();}});
  ctx.restore();}

/* ---------------------------------------------------------------- an inbox, with the old email in it
   ce_inbox(ctx, x, y, w, o): an oak tray seen a little from above, its front edge's middle at (x, y), w wide, with "Inbox" on its
   front, and o.mail (0 to 1) letters in it, the top one the old email; o.a. */
function ce_inbox(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const d=70,x0=x-w/2;
  ag_floorShadow(ctx,x+AG.sdx*2,y+30,w*0.55,18,0.25);
  for(let k=0;k<4;k++){const yy=y-24-k*10,u=clamp((o.mail||0)*4-k,0,1);if(u<=0)continue;ctx.save();ctx.globalAlpha*=u;
    ag_box(ctx,x0+30+k*6,yy-d+6,w-60,d-10,8,{});ctx.strokeStyle="rgba(120,110,96,0.4)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x0+34+k*6,yy-d+10);ctx.lineTo(x,yy-d/2+2);ctx.lineTo(x0+w-34+k*6-12,yy-d+10);ctx.stroke();ctx.restore();}
  let g=ctx.createLinearGradient(0,y,0,y+34);g.addColorStop(0,rgba(AG_OAK.base,1));g.addColorStop(1,rgba(AG_OAK.dark,1));ctx.fillStyle=g;rr(ctx,x0,y-6,w,40,8);ctx.fill();
  ctx.fillStyle=rgba(AG_OAK.hi,0.8);ctx.fillRect(x0+8,y-6,w-16,2);ag_T(ctx,"Inbox",x,y+24,{w:700,size:28,align:"center",col:[70,58,42]});ctx.restore();}

/* ---------------------------------------------------------------- a screen on a desk, showing the glossary's term */
function ce_screen(ctx,x,y,w,h,o){o=o||{};ag_screen(ctx,x,y,w,h,{a:o.a,stand:70,draw:(c,X,Y,Wd,Hd)=>{c.fillStyle="#F4F3EF";c.fillRect(X,Y,Wd,Hd);
  c.fillStyle=rgba(AG.blue,0.9);c.fillRect(X,Y,Wd,8);ag_T(c,"BUSINESS GLOSSARY",X+30,Y+54,{w:700,size:28,ls:4,col:AG.blue});
  ag_T(c,"Commencing student",X+30,Y+106,{w:800,size:40});
  ag_lines(c,ag_wrap(c,"A student who started a course at the university for the first time in the year being counted.",Wd-60,{w:500,size:30}),X+30,Y+158,40,{w:500,size:30,col:AG.mut});
  ag_T(c,"Owner: Mei Tanaka",X+30,Y+Hd-30,{w:600,size:28,col:AG.ink});}});}

/* ---------------------------------------------------------------- a card on its way
   ce_fly(u, from, to): where a card carried from from {x, y, s} to to {x, y, s} is at u (0 to 1), arcing a little on the way */
function ce_fly(u,from,to){const k=ag_sine(clamp(u,0,1));return{x:lerp(from.x,to.x,k),y:lerp(from.y,to.y,k)-Math.sin(Math.PI*k)*60,s:lerp(from.s,to.s,k)};}
