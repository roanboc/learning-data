/* ===== A place on the map: the university's side =====
   The lab's wall, quiet where the cards go (cjWall: the film's one room at the university, so the camera always glides there), and
   what the chapters there draw on it. Every name here starts with cj_ or CJ_.
     CJ_LUCIA                        Lucía Ortega, new in Planning; the series' spec (numbers.md)
     cj_agent(ctx, x, y, r, t, o)    an agent: its sphere, its light, its name under it; o.core, o.think, o.a, o.label
     cj_welcome(ctx, x, y, o)        Planning's welcome, line by line: Lucía's column and the planning agent's
     cj_tickets(ctx, x, y, o)        Planning's tickets, a small stack, and whose sign-in they go through
     cj_el(ctx, x, y, w, o)          an element of the map: a capability, a service, a person, a role, software or an agent; its box
     cj_assign(ctx, p, q, u, o)      an assignment on the map: a dot where it starts, an arrowhead at the role
     cj_realize(ctx, p, q, u, o)     a realization: a dashed line, a hollow arrowhead at what's realized
     cj_owns(ctx, p, q, u, o)        who owns it: a dashed line and "owner"
     cj_process(ctx, o)              Planning's change process on the map: the work, its seven steps, their roles and who fills them
     cj_agents(ctx, o)               the agents on the map: owner, agent, role, and the stage for each kind of task on the assignment
     cj_legend(ctx, cx, y, o)        the five stages, in a line
     cj_rights(ctx, x, y, w, o)      the role's rights: may, may not, asks
     cj_grid(ctx, x, y, o)           the gate: Planning's last 40 tickets, done again; each matched, asked or (never here) wrong
     cj_audit(ctx, x, y, w, o)       the audit log, under its own name (at w 800) */

AG_PLACES.cjWall=c=>ag_paintLab(c,{seed:2,quiet:[[1060,400,980,320,0.85],[960,740,760,150,0.45]]});
AG_BARE.cjWall=c=>ag_roomLight(c,1);
const CJ_LUCIA={name:"Lucía Ortega",role:"Planning",skin:[206,160,124],hair:{style:"long",c:[48,32,26]},earrings:[208,214,226],top:{kind:"sweater",c:[84,88,96]},breath:0.29};

/* ---------------------------------------------------------------- an agent, and Planning's tickets */
function cj_agent(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  if(o.light!==false)ag_modelLight(ctx,x,y,r,0.8*(o.core==null?1:Math.max(0.2,o.core)),o.floor);
  ag_model(ctx,x,y,r,{t:t+(o.ph||0),core:o.core==null?0.8:o.core,think:o.think||0,label:o.label||null});ctx.restore();}
// Planning's tickets: a small stack of ticket cards, its words on the top one
function cj_tickets(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+195,y+60,lerp(0.8,1,o.k));
  for(let i=3;i>=1;i--)ag_box(ctx,x+i*10,y-i*10,390,116,14,{});ag_box(ctx,x,y,390,116,14,{edge:o.edge||null,edgeA:0.8});
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
   As the map draws them (ArchiMate's shapes, which the films don't name on screen): a capability (three stepped squares), a service (a
   long rounded box), a step (an arrow-shaped block, in order), a role (a short cylinder on its side), a person (a small figure), a piece
   of software (a box with two small tabs), and an agent (a box with a small sphere, so you can tell an agent at a glance). Roles and
   steps have a blue edge: the map's structure. */
function cj_icon(ctx,kind,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";
  if(kind==="person"){ctx.beginPath();ctx.arc(0,-12,7,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(0,10);ctx.moveTo(-10,0);ctx.lineTo(10,0);ctx.moveTo(0,10);ctx.lineTo(-8,22);ctx.moveTo(0,10);ctx.lineTo(8,22);ctx.stroke();}
  else if(kind==="role"){ctx.beginPath();ctx.moveTo(-10,-10);ctx.lineTo(8,-10);ctx.moveTo(-10,10);ctx.lineTo(8,10);ctx.stroke();ctx.beginPath();ctx.ellipse(-10,0,5,10,0,Math.PI/2,Math.PI*1.5);ctx.stroke();
    ctx.beginPath();ctx.ellipse(8,0,5,10,0,0,TAU);ctx.stroke();}
  else if(kind==="agent"){ctx.beginPath();ctx.arc(0,0,13,0,TAU);ctx.stroke();ctx.fillStyle=rgba(AG.violet,0.85);ctx.beginPath();ag_rect(ctx,-9,-5,18,6,3);ctx.fill();}
  else if(kind==="capability"){ctx.lineWidth=2.6;[[0,2],[1,1],[1,2],[2,0],[2,1],[2,2]].forEach(([i,j])=>ctx.strokeRect(-15+i*10,-15+j*10,10,10));}
  else if(kind==="service"){ctx.beginPath();rr(ctx,-17,-10,34,20,10);ctx.stroke();}
  else{ctx.beginPath();ctx.rect(-8,-14,22,28);ctx.stroke();ctx.fillStyle="#F1EFEA";for(const yy of [-8,4]){ctx.beginPath();ctx.rect(-14,yy-3,12,7);ctx.fill();ctx.stroke();}}
  ctx.restore();}
// an element: o.kind ("person", "role", "software", "agent", "capability", "service"), o.name, o.sub (a line under it), o.a, o.k, o.edge,
// o.glow, o.dash (a draft), o.h (a set height); the name wraps in two lines when it must. Returns its box {x, y, w, h}
function cj_el(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,F={w:700,size:30},lines=ag_wrap(ctx,o.name,w-92,F),h=o.h||Math.max(76,40+lines.length*38+(o.sub?36:0)),b={x,y,w,h};
  if(a<=0.01||o.measure)return b;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,clamp(o.k,0,1.2)));
  const role=o.kind==="role",srv=o.kind==="service",edge=o.edge||(role||srv?AG.blue:null);
  ag_box(ctx,x,y,w,h,srv?h/2:role?Math.min(h/2.6,38):14,{edge,edgeA:o.edgeA==null?(role||srv?0.75:0.8):o.edgeA,glow:o.glow,glowA:o.glowA});
  if(o.dash){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(AG.mut,0.7*o.dash);ctx.lineWidth=2.4;rr(ctx,x+6,y+6,w-12,h-12,role?h/2.6-4:10);ctx.stroke();ctx.restore();}
  const ix=x+(srv?50:40);cj_icon(ctx,o.kind||"software",ix,y+h/2-(o.sub?16:0),1,rgba(o.kind==="agent"?AG.violet:role||srv||o.kind==="capability"?AG.blue:AG.mut,0.95));
  const y0=y+h/2-((lines.length-1)*38+(o.sub?36:0))/2+11;lines.forEach((l,i)=>ag_T(ctx,l,ix+32,y0+i*38,F));
  if(o.sub)ag_T(ctx,o.sub,ix+32,y0+lines.length*38-2,{w:600,size:28,col:o.subCol||AG.mut});
  ctx.restore();return b;}
// a line from p to q drawn as far as u: an assignment (a dot at p, an arrowhead at q), in the map's blue
function cj_assign(ctx,p,q,u,o){o=o||{};if(u<=0.01)return;const a=o.a==null?1:o.a,col=o.col||AG.blue,e=[lerp(p[0],q[0],u),lerp(p[1],q[1],u)];ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=3.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(e[0],e[1]);ctx.stroke();
  ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.arc(p[0],p[1],7,0,TAU);ctx.fill();if(u>0.92)ag_arrowHead(ctx,q[0],q[1],Math.atan2(q[1]-p[1],q[0]-p[0]),13,rgba(col,clamp((u-0.92)/0.08,0,1)*0.95));ctx.restore();}
// a realization, from what does the work (p) to what it realizes (q): a dashed line and a hollow arrowhead at q, as far as u
function cj_realize(ctx,p,q,u,o){o=o||{};if(u<=0.01)return;const a=o.a==null?1:o.a,col=o.col||AG.blue,an=Math.atan2(q[1]-p[1],q[0]-p[0]),len=Math.hypot(q[0]-p[0],q[1]-p[1]),
    k=clamp((u-0.85)/0.15,0,1),d=Math.max(0,len*u-16*k);ctx.save();ctx.globalAlpha*=a;ctx.translate(p[0],p[1]);ctx.rotate(an);
  ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=3;ctx.setLineDash([9,7]);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(d,0);ctx.stroke();ctx.setLineDash([]);
  if(k>0){ctx.globalAlpha*=k;ctx.translate(len,0);ctx.fillStyle="#F4F1EA";ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-17,-11);ctx.lineTo(-17,11);ctx.closePath();ctx.fill();ctx.stroke();}
  ctx.restore();}
// who owns it: a dashed line from the owner (p) to what they own (q), as far as u, and "owner" by its longest stretch; o.via one corner
// on the way ([x, y]) or several ([[x, y], ...])
function cj_owns(ctx,p,q,u,o){o=o||{};if(u<=0.01)return;const a=o.a==null?1:o.a,V=o.via?(Array.isArray(o.via[0])?o.via:[o.via]):[],P=[p].concat(V,[q]),L=[];let tot=0;
  for(let i=1;i<P.length;i++){const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);L.push(l);tot+=l;}
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.ink,0.55);ctx.lineWidth=3;ctx.setLineDash([10,9]);ctx.beginPath();ctx.moveTo(p[0],p[1]);let left=tot*clamp(u,0,1);
  for(let i=1;i<P.length&&left>0;i++){const k=Math.min(1,left/L[i-1]);ctx.lineTo(lerp(P[i-1][0],P[i][0],k),lerp(P[i-1][1],P[i][1],k));left-=L[i-1];}ctx.stroke();ctx.setLineDash([]);
  const la=clamp((u-0.6)/0.4,0,1);if(la>0){const j=L.indexOf(Math.max.apply(null,L)),m=[(P[j][0]+P[j+1][0])/2+(o.lx||0),(P[j][1]+P[j+1][1])/2+(o.ly||0)];ag_pill(ctx,m[0],m[1],"owner",{a:la,size:28});}ctx.restore();}
// a small green tick in a round badge, at an element's top right corner: a check that passed
function cj_passed(ctx,x,y,u){if(u<=0.01)return;ctx.save();ctx.globalAlpha*=clamp(u,0,1);ag_about(ctx,x,y,lerp(0.6,1,ag_eo(clamp(u,0,1))));
  ctx.fillStyle="#F7F5F0";ctx.strokeStyle=rgba(AG.green,0.9);ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(x,y,21,0,TAU);ctx.fill();ctx.stroke();ag_tick(ctx,x,y+1,22,rgba(AG.green,1),3.6);ctx.restore();}
const cj_at=(b,side,f)=>{f=f==null?0.5:f;return side==="top"?[b.x+b.w*f,b.y]:side==="bottom"?[b.x+b.w*f,b.y+b.h]:side==="left"?[b.x,b.y+b.h*f]:[b.x+b.w,b.y+b.h*f];};

/* ---------------------------------------------------------------- Planning's change process, on the map
   The work first: the capability Planning's tickets serve, at the top left; the service that changes a data product beside it; under
   it the service's seven steps, in order, from a ticket to production; under each step the role assigned to it; and under each role
   who fills it. The planning contributor has the three drafting steps; people keep the rest. The planning agent comes in under its
   role, owned by Clara (a dashed line under the people). The names are the map's own (governance/3-architecture-map/ in the project).
     cj_process(ctx, o)   o.cap, o.srv, o.srvLine (0 to 1); o.step(i), o.bracket; o.role(k), o.roleLine(k); o.who(k), o.whoLine(k);
                          o.agent, o.agentLine, o.owner; o.tint(i) [colour, 0 to 1]; o.glow(key) a colour (keys "cap", "srv", "s0"
                          to "s6", "r0" to "r4", "jun", "clara", "noor", "agent"); o.divide (0 to 1); o.dim (0 to 1) and o.keep(key) */
const CJ_STEPS=["raise a ticket","draft the change","build it in development","open a pull request","review the code","approve the change","release to production"];
const CJ_SW=248,CJ_SG=10,CJ_SX=60,CJ_SY=246,CJ_SH=110,CJ_PT=24,CJ_EH=116,CJ_RY=412,CJ_WY=592;
const cj_stepX=i=>CJ_SX+i*(CJ_SW+CJ_SG);
const CJ_ROLES=[["requester",0,0],["planning contributor",1,3],["analytics engineer",4,4],["product owner",5,5],["release approver",6,6]];
const cj_roleBox=k=>{const r=CJ_ROLES[k],x=cj_stepX(r[1]);return{x,y:CJ_RY,w:cj_stepX(r[2])+CJ_SW-x,h:CJ_EH};};
const CJ_WHO=[["jun","Jun Park",2],["clara","Clara Jensen",3],["noor","Noor",4]];
const cj_whoBox=k=>{const b=cj_roleBox(CJ_WHO[k][2]);return{x:b.x,y:CJ_WY,w:b.w,h:CJ_EH};};
const CJ_CAP={x:60,y:100,w:470},CJ_SRV={x:610,y:100,w:1250},CJ_PAG={x:520,y:CJ_WY,w:360,h:CJ_EH};
// where the divide between the drafting steps and the people's steps runs
const CJ_DIV=(cj_stepX(3)+CJ_SW+cj_stepX(4))/2;
// a step's shape: an arrow-shaped block, notched on its left but the first
function cj_stepPath(c,x,y,w,h,first){c.moveTo(x,y);c.lineTo(x+w-CJ_PT,y);c.lineTo(x+w,y+h/2);c.lineTo(x+w-CJ_PT,y+h);c.lineTo(x,y+h);if(!first)c.lineTo(x+CJ_PT,y+h/2);c.closePath();}
function cj_step(ctx,i,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const x=cj_stepX(i),y=CJ_SY,w=CJ_SW,h=CJ_SH,bb={x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,clamp(o.k,0,1.2)));
  ag_card(ctx,c=>cj_stepPath(c,x,y,w,h,i===0),bb,{edge:o.edge||AG.blue,edgeA:o.edgeA==null?0.6:o.edgeA,glow:o.glow,glowA:o.glowA});
  if(o.tint&&o.tint[1]>0.01){ctx.save();ctx.beginPath();cj_stepPath(ctx,x,y,w,h,i===0);ctx.fillStyle=rgba(o.tint[0],0.14*o.tint[1]);ctx.fill();ctx.restore();}
  const F={w:600,size:28},x0=x+(i===0?22:CJ_PT+16),L=ag_wrap(ctx,CJ_STEPS[i],w-(x0-x)-CJ_PT-4,F);
  L.forEach((l,j)=>ag_T(ctx,l,x0,y+h/2+10+(j-(L.length-1)/2)*34,F));ctx.restore();}
function cj_process(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const v=k=>typeof o[k]==="function"?o[k]:(()=>o[k]==null?0:o[k]),
    step=v("step"),role=v("role"),roleLine=v("roleLine"),who=v("who"),whoLine=v("whoLine"),dim=o.dim||0,keep=o.keep||(()=>false),
    D=k=>keep(k)?1:1-dim*0.72,glow=k=>o.glow?o.glow(k):null,tint=i=>o.tint?o.tint(i):null;ctx.save();ctx.globalAlpha*=a;
  // the work: the capability, and the service that realizes it
  const cap=cj_el(ctx,CJ_CAP.x,CJ_CAP.y,CJ_CAP.w,{kind:"capability",name:"provide data products",a:v("cap")()*D("cap"),k:o.spring?ag_eo(clamp(v("cap")(),0,1)):null,glow:glow("cap")});
  const srv=cj_el(ctx,CJ_SRV.x,CJ_SRV.y,CJ_SRV.w,{kind:"service",name:"change a data product",a:v("srv")()*D("srv"),k:o.spring?ag_eo(clamp(v("srv")(),0,1)):null,glow:glow("srv")});
  cj_realize(ctx,[srv.x,srv.y+srv.h/2],[cap.x+cap.w,cap.y+cap.h/2],v("srvLine")(),{a:D("srv")});
  // the seven steps, the bracket over them, and their realization of the service
  for(let i=0;i<7;i++){const u=clamp(step(i),0,1);cj_step(ctx,i,{a:u*D("s"+i),k:o.spring?ag_eo(u):null,glow:glow("s"+i),tint:tint(i)});}
  const br=clamp(v("bracket")(),0,1);if(br>0.01){const by=CJ_SY-20,x0=cj_stepX(0)+16,x1=cj_stepX(6)+CJ_SW-16,m=(x0+x1)/2,hw=(x1-x0)/2*ag_sine(clamp(br*1.4,0,1));
    ctx.save();ctx.globalAlpha*=D("srv");ctx.strokeStyle=rgba(AG.blue,0.6);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(m-hw,by+12);ctx.lineTo(m-hw,by);ctx.lineTo(m+hw,by);ctx.lineTo(m+hw,by+12);ctx.stroke();ctx.restore();
    cj_realize(ctx,[1235,by],[1235,srv.y+srv.h],clamp((br-0.5)/0.5,0,1),{a:D("srv")});}
  // the roles, each under its steps, and their assignments to them; who fills them, under each role
  CJ_ROLES.forEach((r,k)=>{const u=clamp(role(k),0,1);if(u<=0.01)return;const b=cj_roleBox(k);
    cj_el(ctx,b.x,b.y,b.w,{kind:"role",name:r[0],h:CJ_EH,a:u*D("r"+k),k:o.spring?ag_eo(u):null,glow:glow("r"+k)});
    const lu=clamp(roleLine(k),0,1);for(let i=r[1];i<=r[2];i++){const sx=cj_stepX(i)+CJ_SW/2-(i===0?0:CJ_PT/2)+CJ_PT/2;cj_assign(ctx,[sx,b.y],[sx,CJ_SY+CJ_SH+4],lu,{a:D("r"+k)});}});
  CJ_WHO.forEach((w,k)=>{const u=clamp(who(k),0,1);if(u<=0.01)return;const b=cj_whoBox(k);
    cj_el(ctx,b.x,b.y,b.w,{kind:"person",name:w[1],h:CJ_EH,a:u*D(w[0]),k:o.spring?ag_eo(u):null,glow:glow(w[0])});
    cj_assign(ctx,[b.x+b.w/2,b.y],[b.x+b.w/2,CJ_RY+CJ_EH+4],clamp(whoLine(k),0,1),{a:D(w[0])});});
  // the planning agent, under its role, and Clara's line to it, under the people
  const ag=clamp(v("agent")(),0,1);if(ag>0.01){const P=CJ_PAG;cj_el(ctx,P.x,P.y,P.w,{kind:"agent",name:"planning agent",h:CJ_EH,a:ag*D("agent"),k:ag_eo(clamp(ag*1.2,0,1)),glow:glow("agent"),glowA:0.9});
    cj_assign(ctx,[P.x+P.w/2,P.y],[P.x+P.w/2,CJ_RY+CJ_EH+4],clamp(v("agentLine")(),0,1),{a:D("agent")});
    const cl=cj_whoBox(1),oy=CJ_WY+CJ_EH+44;cj_owns(ctx,[cl.x+cl.w/2,cl.y+cl.h],[P.x+P.w/2,P.y+P.h],clamp(v("owner")(),0,1),{via:[[cl.x+cl.w/2,oy],[P.x+P.w/2,oy]],a:D("agent"),lx:-250});}
  // the divide: the drafting steps on its left, the people's on its right
  const dv=clamp(v("divide")(),0,1);if(dv>0.01){ctx.save();ctx.strokeStyle=rgba(AG.ink,0.42);ctx.lineWidth=3;ctx.setLineDash([12,10]);ctx.beginPath();
    ctx.moveTo(CJ_DIV,CJ_SY-6);ctx.lineTo(CJ_DIV,lerp(CJ_SY-6,CJ_WY+CJ_EH+20,ag_sine(dv)));ctx.stroke();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the agents on the map
   A row for each agent: its owner (a person, with a dashed line to it), the agent, its assignment to its role (a line with an
   arrowhead), and on that assignment its stage for each kind of task, one line each with its stage's number. The kinds of task are the
   map's own words, a few shortened to fit. o.row(k) {a, owner, agent, role, ownLine, line, card, stage(j), ph (the place its stage
   will go, before its gate), glow {owner, agent, role, card}, pass [owner, role, card]} (0 to 1 each); o.head the label. */
const CJ_AROWS=[
  {owner:"Clara Jensen",name:"planning agent",role:"planning contributor",stage:[["Planning's tickets",4],["what a word means",1]],y:120},
  {owner:"Anil Kurian",name:"workload agent",role:"workload contributor",stage:[["what a staff word means",1],["a new question",3],["fix a model",4],["night build, in test",4],["night build, in production",4]],y:312},
  {owner:"Yusuf Demir",name:"governance review agent",role:"governance reviewer",stage:[["review a pull request",1],["draft what's missing",1]],y:636}];
const CJ_AC={ox:50,ow:280,ax:440,aw:460,cx:940,cw:520,rx:1500,rw:360};
const cj_stageH=n=>40+n*44+24;
const cj_rowY=k=>{const r=CJ_AROWS[k];return r.y+cj_stageH(r.stage.length)/2;};
// a stage's number in a small round badge
function cj_stageNum(ctx,x,y,n,a,col){if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;ctx.fillStyle=rgba(col||AG.blue,0.92);ctx.beginPath();ctx.arc(x,y,20,0,TAU);ctx.fill();
  ag_T(ctx,String(n),x,y+10,{w:800,size:28,align:"center",col:[250,250,248]});ctx.restore();}
function cj_stageCard(ctx,k,o){o=o||{};const r=CJ_AROWS[k],x=CJ_AC.cx,w=CJ_AC.cw,y=r.y,n=r.stage.length,h=cj_stageH(n),ph=clamp(o.ph||0,0,1),c=clamp(o.card||0,0,1);
  if(ph>0.01){ctx.save();ctx.globalAlpha*=ph;ctx.fillStyle="rgba(246,244,240,0.85)";rr(ctx,x,y,w,h,18);ctx.fill();ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(AG.mut,0.75);ctx.lineWidth=2.6;rr(ctx,x,y,w,h,18);ctx.stroke();ctx.setLineDash([]);
    ag_T(ctx,"its stage: after its gate",x+w/2,y+h/2+10,{w:600,size:28,align:"center",col:AG.mut});ctx.restore();}
  if(c>0.01){ctx.save();ctx.globalAlpha*=c;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.85,1,o.k));ag_box(ctx,x,y,w,h,18,{edge:AG.blue,edgeA:0.55,glow:o.glow,glowA:0.9});
    ag_label(ctx,x+28,y+44,"Stage",{});
    r.stage.forEach((s,j)=>{const u=clamp(o.stage?o.stage(j):1,0,1);if(u<=0.01)return;const yy=y+40+(j+1)*44;ctx.save();ctx.globalAlpha*=u;
      ag_T(ctx,s[0],x+28,yy+6,{w:600,size:28});cj_stageNum(ctx,x+w-40,yy-3,s[1],1,o.lit&&o.lit(j)?AG.green:null);ctx.restore();});ctx.restore();}
  return{x,y,w,h};}
function cj_agents(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;const C=CJ_AC;
  if((o.head||0)>0.01)ag_label(ctx,C.ox,62,"The agents on the map",{a:o.head,col:AG.violet});
  CJ_AROWS.forEach((r,k)=>{const R=o.row?o.row(k):{};if(!R||(R.a!=null&&R.a<=0.01))return;const ra=R.a==null?1:R.a,cy=cj_rowY(k),g=R.glow||{};ctx.save();ctx.globalAlpha*=ra;
    const f=key=>clamp(R[key]==null?1:R[key],0,1),ob={x:C.ox,y:cy-38,w:C.ow,h:76},ab={x:C.ax,y:cy-38,w:C.aw,h:76},rb={x:C.rx,y:cy-58,w:C.rw,h:CJ_EH};
    // the assignment runs under the stage card, from the agent to its role
    cj_assign(ctx,[ab.x+ab.w,cy],[rb.x,cy],f("line"),{});
    cj_owns(ctx,[ob.x+ob.w,cy],[ab.x,cy],f("ownLine"),{ly:40});
    cj_el(ctx,ob.x,ob.y,ob.w,{kind:"person",name:r.owner,a:f("owner"),k:ag_eo(f("owner")),glow:g.owner});
    cj_el(ctx,ab.x,ab.y,ab.w,{kind:"agent",name:r.name,a:f("agent"),k:ag_eo(f("agent")),glow:g.agent,glowA:0.9});
    cj_el(ctx,rb.x,rb.y,rb.w,{kind:"role",name:r.role,h:CJ_EH,a:f("role"),k:ag_eo(f("role")),glow:g.role});
    const cb=cj_stageCard(ctx,k,{ph:R.ph||0,card:R.card==null?1:R.card,k:R.card==null?null:Math.min(1,ag_eo(clamp(R.card,0,1))),stage:R.stage,glow:g.card,lit:R.lit});
    const P=R.pass||[0,0,0];cj_passed(ctx,ob.x+ob.w-6,ob.y+4,P[0]);cj_passed(ctx,rb.x+rb.w-10,rb.y+6,P[1]);cj_passed(ctx,cb.x+cb.w-8,cb.y+6,P[2]);
    ctx.restore();});
  ctx.restore();}
// the five stages, in a line along the bottom: each number and its name; o.lit(n) lights stage n
const CJ_STAGE5=[[1,"suggests"],[2,"step by step"],[3,"within limits"],[4,"proposes"],[5,"with a mandate"]];
function cj_legend(ctx,cx,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;const F={w:600,size:28},gap=44,ws=CJ_STAGE5.map(s=>48+ag_tw(ctx,s[1],F)),tot=ws.reduce((p,q)=>p+q,0)+gap*4;
  ag_box(ctx,cx-tot/2-30,y-42,tot+60,64,32,{});
  let x=cx-tot/2;CJ_STAGE5.forEach((s,i)=>{const lit=o.lit?o.lit(s[0]):0;cj_stageNum(ctx,x+20,y-10,s[0],1,lit>0.5?AG.green:[150,150,160]);ag_T(ctx,s[1],x+48,y,Object.assign({},F,{col:lit>0.5?AG.ink:AG.mut}));x+=ws[i]+gap;});ctx.restore();}

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
