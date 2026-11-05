/* ===== A contributor joins: the university's side =====
   The lab's wall, quiet where the cards go (cjWall: the film's one room at the university, so the camera always glides there), and
   what the chapters there draw on it. Every name here starts with cj_ or CJ_.
     CJ_LUCIA                        Lucía Ortega, new in Planning; the series' spec (numbers.md)
     cj_agent(ctx, x, y, r, t, o)    an agent: its sphere, its light, its name under it; o.core, o.think, o.a, o.label
     cj_welcome(ctx, x, y, o)        Planning's welcome, line by line: Lucía's column and the planning agent's
     cj_tickets(ctx, x, y, o)        Planning's tickets, a small stack, and whose sign-in they go through
     cj_el(ctx, x, y, w, o)          an element of the map: a person, a role or a piece of software, with its icon; returns its box
     cj_group(ctx, x, y, w, h, s, o) a team's area on the map
     cj_assign(ctx, p, q, u, o)      an assignment on the map: a dot where it starts, an arrowhead at the role
     cj_owns(ctx, p, q, u, o)        who owns it: a dashed line and "owner"
     cj_map(ctx, o)                  the university's map: its teams, their people, roles and software, and the new agents
     cj_rights(ctx, x, y, w, o)      the role's rights: may, may not, asks
     cj_grid(ctx, x, y, o)           the gate: Planning's last 40 tickets, done again; each matched, asked or (never here) wrong
     cj_audit(ctx, x, y, w, o)       the audit log, under its own name (at w 800)
     cj_who(ctx, x, y, w, words, o)  one of "who may do what with an agent": a card with its kicker, its rule and its people */

AG_PLACES.cjWall=c=>ag_paintLab(c,{seed:2,quiet:[[1060,400,980,320,0.85],[960,740,760,150,0.45]]});
AG_BARE.cjWall=c=>ag_roomLight(c,1);
const CJ_LUCIA={name:"Lucía Ortega",role:"Planning",skin:[206,160,124],hair:{style:"long",c:[48,32,26]},earrings:[208,214,226],top:{kind:"sweater",c:[84,88,96]},breath:0.29};

/* ---------------------------------------------------------------- an agent, and Planning's tickets */
function cj_agent(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  if(o.light!==false)ag_modelLight(ctx,x,y,r,0.8*(o.core==null?1:Math.max(0.2,o.core)),o.floor);
  ag_model(ctx,x,y,r,{t:t+(o.ph||0),core:o.core==null?0.8:o.core,think:o.think||0,label:o.label||null});ctx.restore();}
// Planning's tickets: a small stack of ticket cards, its words on the top one
function cj_tickets(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+170,y+60,lerp(0.8,1,o.k));
  for(let i=3;i>=1;i--)ag_box(ctx,x+i*10,y-i*10,340,116,14,{});ag_box(ctx,x,y,340,116,14,{edge:o.edge||null,edgeA:0.8});
  ag_T(ctx,"PLANNING'S TICKETS",x+28,y+48,{w:700,size:28,ls:3,col:AG.kick});ag_T(ctx,"changes to its marts",x+28,y+92,{w:600,size:30,col:AG.mut});ctx.restore();}

/* ---------------------------------------------------------------- Planning's welcome, line by line
   Two columns under their names, Lucía's and the agent's; a row for each line the voice says, its two halves side by side. o.rows(k)
   (0 to 1) how far row k has come in; o.lit(k) a colour to edge row k's right half with; o.head (0 to 1) the names. */
const CJ_WEL={w:1200,lw:480,rh:96,rows:[["Her badge","An identity of its own, set up by Sam"],["Her role: Planning","Its role: planning contributor"],
  ["A manager she answers to","An owner who answers for it: Clara Jensen"],["Rights from Planning's group","Rights from its role's group"],["She signed the confidentiality agreement","Clara signs it on its behalf"]]};
function cj_welcome(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const W_=CJ_WEL,rows=o.rows||(()=>1),head=o.head==null?1:o.head;ctx.save();ctx.globalAlpha*=a;
  const lx=x,rx=x+W_.lw+40,rw=W_.w-W_.lw-40;
  if(head>0){ag_T(ctx,"LUCÍA ORTEGA",lx+24,y+40,{w:700,size:28,ls:4,col:AG.kick,a:head});ag_T(ctx,"THE PLANNING AGENT",rx+24,y+40,{w:700,size:28,ls:4,col:AG.violet,a:head});
    ctx.strokeStyle=rgba(AG.shadow,0.18*head);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+62);ctx.lineTo(x+W_.w,y+62);ctx.stroke();}
  W_.rows.forEach((r,k)=>{const u=clamp(rows(k),0,1);if(u<=0.01)return;const yy=y+84+k*(W_.rh+12),dy=(1-ag_eo(u))*16;ctx.save();ctx.globalAlpha*=u;
    const half=(bx,bw,s_,edge)=>{ag_box(ctx,bx,yy+dy,bw,W_.rh,16,{edge,edgeA:0.75});const F={w:600,size:30},L=ag_wrap(ctx,s_,bw-52,F);
      L.forEach((l,i)=>ag_T(ctx,l,bx+26,yy+dy+W_.rh/2+11+(i-(L.length-1)/2)*36,F));};
    half(lx,W_.lw,r[0],null);const lit=o.lit?o.lit(k):null;half(rx,rw,r[1],lit);
    // a small arrow from her line to its own: the same line, for an agent
    ctx.strokeStyle=rgba(AG.mut,0.5);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(lx+W_.lw+8,yy+dy+W_.rh/2);ctx.lineTo(rx-12,yy+dy+W_.rh/2);ctx.stroke();ag_arrowHead(ctx,rx-8,yy+dy+W_.rh/2,0,9,rgba(AG.mut,0.6));
    ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the map's notation
   As the map draws them (ArchiMate's shapes, which the films don't name on screen): a person (a small figure), a role (a short
   cylinder on its side), a piece of software (a box with two small tabs on its side); the agents' software also has a small sphere,
   so you can tell an agent at a glance. Roles have a blue edge: the map's structure. */
function cj_icon(ctx,kind,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";
  if(kind==="person"){ctx.beginPath();ctx.arc(0,-12,7,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(0,10);ctx.moveTo(-10,0);ctx.lineTo(10,0);ctx.moveTo(0,10);ctx.lineTo(-8,22);ctx.moveTo(0,10);ctx.lineTo(8,22);ctx.stroke();}
  else if(kind==="role"){ctx.beginPath();ctx.moveTo(-10,-10);ctx.lineTo(8,-10);ctx.moveTo(-10,10);ctx.lineTo(8,10);ctx.stroke();ctx.beginPath();ctx.ellipse(-10,0,5,10,0,Math.PI/2,Math.PI*1.5);ctx.stroke();
    ctx.beginPath();ctx.ellipse(8,0,5,10,0,0,TAU);ctx.stroke();}
  else if(kind==="agent"){ctx.beginPath();ctx.arc(0,0,13,0,TAU);ctx.stroke();ctx.fillStyle=rgba(AG.violet,0.85);ctx.beginPath();ag_rect(ctx,-9,-5,18,6,3);ctx.fill();}
  else{ctx.beginPath();ctx.rect(-8,-14,22,28);ctx.stroke();ctx.fillStyle="#F1EFEA";for(const yy of [-8,4]){ctx.beginPath();ctx.rect(-14,yy-3,12,7);ctx.fill();ctx.stroke();}}
  ctx.restore();}
// an element: o.kind ("person", "role", "software", "agent"), o.name, o.sub (a line under it), o.a, o.k, o.edge, o.glow, o.dash (a draft);
// the name wraps in two lines when it must. Returns its box {x, y, w, h}
function cj_el(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,F={w:700,size:30},lines=ag_wrap(ctx,o.name,w-92,F),h=Math.max(76,40+lines.length*38+(o.sub?36:0)),b={x,y,w,h};
  if(a<=0.01||o.measure)return b;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,clamp(o.k,0,1.2)));
  const role=o.kind==="role",edge=o.edge||(role?AG.blue:null);
  ag_box(ctx,x,y,w,h,role?h/2.6:14,{edge,edgeA:o.edgeA==null?(role?0.75:0.8):o.edgeA,glow:o.glow,glowA:o.glowA});
  if(o.dash){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.mut,0.7*o.dash);ctx.lineWidth=2.4;rr(ctx,x+6,y+6,w-12,h-12,role?h/2.6-4:10);ctx.stroke();ctx.restore();}
  cj_icon(ctx,o.kind||"software",x+40,y+h/2-(o.sub?16:0),1,rgba(o.kind==="agent"?AG.violet:role?AG.blue:AG.mut,0.95));
  const y0=y+h/2-((lines.length-1)*38+(o.sub?36:0))/2+11;lines.forEach((l,i)=>ag_T(ctx,l,x+72,y0+i*38,F));
  if(o.sub)ag_T(ctx,o.sub,x+72,y0+lines.length*38-2,{w:600,size:28,col:o.subCol||AG.mut});
  ctx.restore();return b;}
// a team's area: a soft tinted panel with its name at the top left
function cj_group(ctx,x,y,w,h,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle="rgba(246,244,240,0.55)";rr(ctx,x,y,w,h,22);ctx.fill();ctx.strokeStyle="rgba(60,50,40,0.18)";ctx.lineWidth=2;ctx.setLineDash([12,9]);rr(ctx,x,y,w,h,22);ctx.stroke();ctx.setLineDash([]);
  ag_T(ctx,s.toUpperCase(),x+24,y+42,{w:700,size:28,ls:4,col:AG.kick});ctx.restore();}
// a line from p to q drawn as far as u: an assignment (a dot at p, an arrowhead at q), in the map's blue
function cj_assign(ctx,p,q,u,o){o=o||{};if(u<=0.01)return;const a=o.a==null?1:o.a,col=o.col||AG.blue,e=[lerp(p[0],q[0],u),lerp(p[1],q[1],u)];ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=3.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();
  ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.arc(p[0],p[1],7,0,TAU);ctx.fill();if(u>0.92)ag_arrowHead(ctx,q[0],q[1],Math.atan2(q[1]-p[1],q[0]-p[0]),13,rgba(col,clamp((u-0.92)/0.08,0,1)*0.95));ctx.restore();}
// who owns it: a dashed line from the owner (p) to what they own (q), as far as u, and "owner" by its middle; o.via a corner on the way
function cj_owns(ctx,p,q,u,o){o=o||{};if(u<=0.01)return;const a=o.a==null?1:o.a,P=o.via?[p,o.via,q]:[p,q],L=[];let tot=0;for(let i=1;i<P.length;i++){const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);L.push(l);tot+=l;}
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.ink,0.55);ctx.lineWidth=3;ctx.setLineDash([10,9]);ctx.beginPath();ctx.moveTo(p[0],p[1]);let left=tot*clamp(u,0,1);
  for(let i=1;i<P.length&&left>0;i++){const k=Math.min(1,left/L[i-1]);ctx.lineTo(lerp(P[i-1][0],P[i][0],k),lerp(P[i-1][1],P[i][1],k));left-=L[i-1];}ctx.stroke();ctx.setLineDash([]);
  const la=clamp((u-0.6)/0.4,0,1);if(la>0){const j=L.indexOf(Math.max.apply(null,L)),m=[(P[j][0]+P[j+1][0])/2+(o.lx||0),(P[j][1]+P[j+1][1])/2+(o.ly||0)];ag_pill(ctx,m[0],m[1],"owner",{a:la,size:28});}ctx.restore();}

/* ---------------------------------------------------------------- the university's map
   Teams as areas, each with its people (a person, their role under the name) and its software. o.show(key) (0 to 1) brings each
   element in; o.groups (0 to 1) the areas; o.dim (0 to 1) quietens everything but o.keep's keys; o.glow(key) a colour to glow with.
   The map is a part of Noor's: the teams around Planning's data. Each agent sits in its owner's team, under its owner (a dashed line,
   "owner"), assigned to its role beside it (a line with an arrowhead). The governance review agent and its lines were there already;
   the new elements (the planning agent, its role, the census agent, its role) and their lines are drawn by cj_newOnMap. */
const CJ_G={planning:[330,90,730,494],data:[1090,90,760,494],reg:[330,606,440,274],gov:[800,606,1050,274]};
const CJ_EL={
  clara:{g:"planning",x:354,y:148,w:320,kind:"person",name:"Clara Jensen",sub:"product owner"},
  lucia:{g:"planning",x:730,y:148,w:306,kind:"person",name:"Lucía Ortega",sub:"Planning"},
  marts:{g:"planning",x:354,y:488,w:340,kind:"software",name:"Planning's marts"},
  jun:{g:"data",x:1114,y:148,w:344,kind:"person",name:"Jun Park",sub:"analytics engineer"},
  noor:{g:"data",x:1514,y:148,w:310,kind:"person",name:"Noor Rahman",sub:"data architect"},
  count:{g:"data",x:1114,y:488,w:362,kind:"software",name:"Census-day count"},
  mei:{g:"reg",x:354,y:666,w:392,kind:"person",name:"Mei Tanaka",sub:"registrar's office"},
  sis:{g:"reg",x:354,y:794,w:392,kind:"software",name:"Student system"},
  yusuf:{g:"gov",x:826,y:666,w:330,kind:"person",name:"Yusuf Demir",sub:"data governance"},
  govrole:{g:"gov",x:1420,y:666,w:404,kind:"role",name:"governance reviewer"},
  govagent:{g:"gov",x:1180,y:794,w:476,kind:"agent",name:"governance review agent"}};
// the new ones: the planning agent under Clara and its role beside it, in Planning's area; the census agent under Jun and its role
const CJ_NEW={
  pagent:{x:354,y:368,w:320,kind:"agent",name:"planning agent"},
  prole:{x:730,y:348,w:306,kind:"role",name:"planning contributor"},
  cagent:{x:1114,y:368,w:344,kind:"agent",name:"census agent"},
  crole:{x:1514,y:348,w:310,kind:"role",name:"census contributor"}};
const CJ_GNAME={planning:"Planning",data:"Data team",reg:"Registrar's office",gov:"Data governance"};
function cj_elBox(ctx,e){return cj_el(ctx,e.x,e.y,e.w,Object.assign({},e,{measure:true}));}
// where an element's lines meet it: its top, bottom, left or right middle
const cj_at=(b,side,f)=>{f=f==null?0.5:f;return side==="top"?[b.x+b.w*f,b.y]:side==="bottom"?[b.x+b.w*f,b.y+b.h]:side==="left"?[b.x,b.y+b.h*f]:[b.x+b.w,b.y+b.h*f];};
function cj_map(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const show=o.show||(()=>1),G=o.groups==null?1:o.groups,dim=o.dim||0,keep=o.keep||[];ctx.save();ctx.globalAlpha*=a;
  for(const k in CJ_G){const g=CJ_G[k];cj_group(ctx,g[0],g[1],g[2],g[3],CJ_GNAME[k],{a:G*(1-dim*0.6)});}
  for(const k in CJ_EL){const e=CJ_EL[k],s=show(k);if(s<=0.01)continue;const d=keep.indexOf(k)>=0?0:dim;
    cj_el(ctx,e.x,e.y,e.w,Object.assign({},e,{a:clamp(s,0,1)*(1-d*0.7),k:o.spring?ag_eo(clamp(s,0,1)):null,glow:o.glow?o.glow(k):null}));}
  // the governance review agent's own lines, there before the others: Yusuf owns it, it's assigned to the governance reviewer
  const gr=cj_elBox(ctx,CJ_EL.govrole),ga=cj_elBox(ctx,CJ_EL.govagent),yu=cj_elBox(ctx,CJ_EL.yusuf),gd=keep.indexOf("govagent")>=0?0:dim,
    ka=Math.min(show("govagent"),show("govrole"),show("yusuf"))*(1-gd*0.7);
  if(ka>0.01){ctx.save();ctx.globalAlpha*=ka;cj_assign(ctx,cj_at(ga,"top",0.86),[ga.x+ga.w*0.86,gr.y+gr.h],1,{});
    const p=cj_at(yu,"bottom",0.22),q=cj_at(ga,"left");cj_owns(ctx,p,q,1,{via:[p[0],q[1]]});ctx.restore();}
  ctx.restore();}
// the new elements and their lines: o.prole, o.pagent, o.passign, o.powner, o.crole, o.cagent, o.cassign, o.cowner (0 to 1 each); o.glow
function cj_newOnMap(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;const N=CJ_NEW,cl=cj_elBox(ctx,CJ_EL.clara),ju=cj_elBox(ctx,CJ_EL.jun);
  const pr=cj_elBox(ctx,N.prole),pa=cj_elBox(ctx,N.pagent),cr=cj_elBox(ctx,N.crole),ca=cj_elBox(ctx,N.cagent);
  const el=(e,u,g)=>{if(u>0.01)cj_el(ctx,e.x,e.y,e.w,Object.assign({},e,{a:clamp(u,0,1),k:ag_eo(clamp(u*1.2,0,1)),glow:g,glowA:0.9}));};
  el(N.prole,o.prole||0,o.glow&&o.glow("prole"));el(N.pagent,o.pagent||0,o.glow&&o.glow("pagent"));
  cj_assign(ctx,cj_at(pa,"right"),[pr.x,pa.y+pa.h/2],o.passign||0,{});
  cj_owns(ctx,cj_at(cl,"bottom"),[cl.x+cl.w/2,pa.y],o.powner||0,{});
  el(N.crole,o.crole||0,o.glow&&o.glow("crole"));el(N.cagent,o.cagent||0,o.glow&&o.glow("cagent"));
  cj_assign(ctx,cj_at(ca,"right"),[cr.x,ca.y+ca.h/2],o.cassign||0,{});
  cj_owns(ctx,cj_at(ju,"bottom"),[ju.x+ju.w/2,ca.y],o.cowner||0,{});
  ctx.restore();}

/* ---------------------------------------------------------------- the role's rights: may, may not, asks
   o.may, o.maynot, o.asks: functions of the line's index (0 to 1), how far each line has come in; o.head (0 to 1) the card itself;
   o.glow (0 to 1) lights whom it asks; o.rule (0 to 1) the rule under them, in green: when it isn't sure, a person decides.
   One line each, at 30 px; whom it asks in two columns. 790 by 786: at y 90 it ends at 876, above the captions. */
const CJ_MAY=["read the project and production, names masked","draft on its own branches","build in its own development schema","open a pull request"];
const CJ_MAYNOT=["approve","merge","change production","change an approved test","change what a word means","grant itself rights"];
const CJ_ASKS=[["Clara","what Planning needs"],["Mei","what a word means"],["Noor","the model"],["Jun","the code"]];
function cj_rights(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,hd=o.head==null?1:o.head;if(a<=0.01||hd<=0.01)return null;const f=k=>typeof k==="function"?k:(()=>k==null?1:k);
  const may=f(o.may),no=f(o.maynot),ask=f(o.asks),LH=40,GAP=52,h=108+CJ_MAY.length*LH+GAP+CJ_MAYNOT.length*LH+GAP+2*LH+94,F={w:600,size:30};ctx.save();ctx.globalAlpha*=a*hd;if(o.k!=null)ag_about(ctx,x+w/2,y+40,lerp(0.85,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:AG.blue,edgeA:0.55});
  cj_icon(ctx,"role",x+44,y+48,1,rgba(AG.blue,0.95));ag_T(ctx,"PLANNING CONTRIBUTOR",x+76,y+58,{w:700,size:28,ls:4,col:AG.blue});
  let yy=y+108;ag_T(ctx,"May",x+32,yy,{w:800,size:30});
  CJ_MAY.forEach((s,i)=>{const u=clamp(may(i),0,1);yy+=LH;if(u<=0.01)return;ctx.save();ctx.globalAlpha*=u;ctx.fillStyle=rgba(AG.ink,0.55);ctx.beginPath();ctx.arc(x+46,yy-10,5,0,TAU);ctx.fill();
    ag_T(ctx,s,x+66,yy,F);ctx.restore();});
  yy+=GAP;ag_T(ctx,"May not",x+32,yy,{w:800,size:30});
  CJ_MAYNOT.forEach((s,i)=>{const u=clamp(no(i),0,1);yy+=LH;if(u<=0.01)return;ctx.save();ctx.globalAlpha*=u;ag_lock(ctx,x+46,yy-9,26,rgba(AG.blue,0.9));ag_T(ctx,s,x+66,yy,F);ctx.restore();});
  yy+=GAP;const ay=yy,gl=clamp(o.glow||0,0,1),ru=clamp(o.rule||0,0,1);
  // whom it asks, lit when it isn't sure: a soft green panel behind them and the rule
  if(gl>0.01){ctx.save();ctx.globalAlpha*=gl;ctx.fillStyle=rgba(AG.green,0.09);rr(ctx,x+14,ay-40,w-28,y+h-14-(ay-40),16);ctx.fill();ctx.strokeStyle=rgba(AG.green,0.55);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();}
  ag_T(ctx,"Asks",x+32,ay,{w:800,size:30});
  CJ_ASKS.forEach((p,i)=>{const u=clamp(ask(i),0,1),col=i%2,row=Math.floor(i/2),xx=x+(col?440:44),y2=ay+LH+row*LH;if(u<=0.01)return;ctx.save();ctx.globalAlpha*=u;
    ag_T(ctx,p[0],xx,y2,{w:700,size:30});ag_T(ctx,p[1],xx+ag_tw(ctx,p[0]+"  ",{w:700,size:30}),y2,{w:600,size:28,col:AG.mut});ctx.restore();});
  if(ru>0.01){const ry=ay+2*LH+56;ctx.save();ctx.globalAlpha*=ru;ag_tick(ctx,x+48,ry-10,24,rgba(AG.green,1),4);ag_T(ctx,"Not sure? It asks, and a person decides.",x+76,ry,{w:700,size:30,col:mix(AG.green,AG.ink,0.35)});ctx.restore();}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the gate: Planning's last 40 tickets, done again
   A grid of 8 by 5 small tickets. o.done(i) (0 to 1) how far ticket i is done; the three it wasn't sure of (CJ_ASKED) show a question
   mark, then "asked", in the module's blue; the rest a green tick once a person's result matched. */
const CJ_ASKED=[6,19,33],CJ_TW=104,CJ_TH=74,CJ_TG=14;
function cj_grid(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const done=o.done||(()=>1),mark=o.mark||(()=>1);ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<40;i++){const cx=x+(i%8)*(CJ_TW+CJ_TG),cy=y+Math.floor(i/8)*(CJ_TH+CJ_TG),u=clamp(done(i),0,1),m=clamp(mark(i),0,1),asked=CJ_ASKED.indexOf(i)>=0;
    ag_box(ctx,cx,cy,CJ_TW,CJ_TH,10,{edge:m>0.5?(asked?AG.blue:AG.green):null,edgeA:0.6*m});
    ctx.fillStyle=rgba(AG.ink,0.18+0.2*u);for(let j=0;j<3;j++)ctx.fillRect(cx+16,cy+18+j*14,(j===2?36:70)*Math.max(0.15,u),5);
    if(m>0.01){if(asked){ctx.save();ctx.globalAlpha*=m;ag_T(ctx,"?",cx+CJ_TW-24,cy+CJ_TH-16,{w:800,size:36,align:"center",col:AG.blue});ctx.restore();}
      else ag_tick(ctx,cx+CJ_TW-26,cy+CJ_TH-22,24,rgba(AG.green,m),4);}}
  ctx.restore();}
// the audit log: its head and a few lines, each "time · who · what", in a mono face; o.rows (0 to 1 each)
const CJ_LOG=[["09:02","planning agent","read ticket 31"],["09:04","planning agent","built in its own schema"],["09:06","planning agent","asked Clara"],["09:11","planning agent","opened a pull request"]];
function cj_audit(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const rows=o.rows||(()=>1);ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,70+CJ_LOG.length*48,18,{});ag_T(ctx,"AUDIT LOG",x+28,y+48,{w:700,size:28,ls:4,col:AG.kick});
  CJ_LOG.forEach((r,i)=>{const u=clamp(rows(i),0,1);if(u<=0.01)return;const yy=y+104+i*48;ctx.save();ctx.globalAlpha*=u;
    ag_T(ctx,r[0],x+28,yy,{w:500,size:28,f:"mono",col:AG.mut});ag_T(ctx,r[1],x+138,yy,{w:600,size:28,f:"mono",col:AG.violet});ag_T(ctx,r[2],x+392,yy,{w:500,size:28,f:"mono"});ctx.restore();});
  ctx.restore();}
// one of "who may do what with an agent": its kicker (what), its rule, and who; o.edge, o.a, o.k; returns its box
function cj_who(ctx,x,y,w,words,o){o=o||{};return ag_textCard(ctx,x,y,w,words,Object.assign({kickCol:AG.blue},o));}
