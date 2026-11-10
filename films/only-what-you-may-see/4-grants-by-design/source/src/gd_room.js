/* ===== Grants by design: the catalog room =====
   The university's side of the film, in the module's hall. A catalog is a room of clear glass on the right of the hall, its name on a
   plate at the top; each schema is a shelf in it, a long pane with the shelf's name in the code font and its tables on it, small slabs
   of glass whose rows of light are lit when they're read (violet: personal data; grey: nothing that needs hiding). A shelf nobody reads
   is frosted. Groups stand on the left as pills of glass with three small heads (a group, never a person); a grant is a line of light
   from a group to a shelf, green; a right that only lets you look is dashed. The three rights a table needs are three doors on the way
   in: the room's door in its left wall, the shelf's gate at its left end, and the table itself. Painted once: the hall (gdHall); every
   room, shelf, table, group and line is drawn live over it. Sizes in the 1920 x 1080 frame. */

AG_PLACES.gdHall=c=>dp_paintHall(c,{seed:41,horizon:730,vx:1240,panes:7,lights:16,pools:[[430,980,560,0.10],[1420,900,820,0.06]]});

/* ---------------------------------------------------------------- the registrar's catalog: a room of glass, its shelves */
const GD_R={x:1000,y:150,w:840,h:712};                       // the room: x 1000 to 1840, y 150 to 862
const GD_SH={x:1024,w:792,h:84,y0:252,dy:100};               // its shelves: from y 252, 100 apart
const GD_SHELF=["staging","intermediate","reference","core","published","support"];
const GD_SHCOL={staging:"grey",intermediate:"grey",core:"violet",reference:"grey",published:"grey",support:"violet"};
const GD_NT={staging:5,intermediate:4,core:4,reference:4,published:3,support:0};
const GD_TW=88,GD_TH=52,GD_TX=1290,GD_TDX=104;              // a table on a shelf: its size, where the first stands, how far apart
const gd_shelfY=k=>GD_SH.y0+GD_SHELF.indexOf(k)*GD_SH.dy;     // a shelf's top
const gd_shelfMid=k=>gd_shelfY(k)+GD_SH.h/2;
const gd_tableXY=(k,j)=>[GD_TX+j*GD_TDX,gd_shelfY(k)+16];    // the j-th table on shelf k: its top left
// where a line of light reaches a shelf: its left end, a little up or down for each line that reaches it (n lines, this the i-th)
const gd_gate=(k,i,n)=>[GD_SH.x-2,gd_shelfMid(k)+(n>1?lerp(-22,22,i/(n-1)):0)];

/* the room: clear glass with a dark film inside, so its words read; its plate (kicker CATALOG and its name in the code font).
   o: a, name ("registrar"), plate (0 to 1, the plate's words), x, y, w, h (another room), col (its rim), small (a far room: thinner
   rim, its name only), lit (0 to 1, the room lit as a whole) */
function gd_roomBox(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const x=o.x==null?GD_R.x:o.x,y=o.y==null?GD_R.y:o.y,w=o.w||GD_R.w,h=o.h||GD_R.h,
    col=o.col||"cyan",c=dp_f(col),L=clamp(o.lit||0,0,1);
  ctx.save();ctx.globalAlpha*=a;
  if(L>0)dp_halo(ctx,x+w/2,y+h/2,Math.max(w,h)*0.6,col,0.10*L);
  ctx.save();rr(ctx,x,y,w,h,o.small?16:26);ctx.clip();ctx.fillStyle="rgba(4,15,19,0.56)";ctx.fillRect(x,y,w,h);
  const sg=ctx.createLinearGradient(x,y,x+w*0.6,y+h);sg.addColorStop(0,"rgba(200,245,245,0.07)");sg.addColorStop(0.4,"rgba(200,245,245,0.015)");sg.addColorStop(0.55,"rgba(200,245,245,0.05)");sg.addColorStop(1,"rgba(200,245,245,0)");
  ctx.fillStyle=sg;ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.save();ctx.shadowColor=rgba(c,0.7+0.3*L);ctx.shadowBlur=(o.small?10:16)+10*L;rr(ctx,x+1,y+1,w-2,h-2,o.small?16:26);
  const eg=ctx.createLinearGradient(x,y,x+w,y+h);eg.addColorStop(0,rgba(mix(c,[255,255,255],0.45),0.95));eg.addColorStop(1,rgba(c,0.75+0.25*L));ctx.strokeStyle=eg;ctx.lineWidth=o.small?1.8:2.4;ctx.stroke();ctx.restore();
  // its gloss on the floor
  const rg=ctx.createLinearGradient(0,y+h,0,y+h+90);rg.addColorStop(0,rgba(c,0.08));rg.addColorStop(1,rgba(c,0));ctx.fillStyle=rg;ctx.fillRect(x+20,y+h+4,w-40,90);
  const pa=o.plate==null?1:o.plate;
  if(pa>0&&o.name){ctx.save();ctx.globalAlpha*=pa;
    if(o.small){dp_T(ctx,o.name,x+24,y+46,{w:500,size:28,f:"mono"});}
    else{dp_T(ctx,"CATALOG",x+32,y+60,{w:800,size:28,ls:4,col:"cyan"});dp_T(ctx,o.name,x+218,y+62,{w:500,size:36,f:"mono"});
      ctx.fillStyle=rgba(c,0.45);ctx.fillRect(x+24,y+90,w-48,1.4);}
    ctx.restore();}
  ctx.restore();}

/* one shelf of the room, k its name: o.a, o.label (0 to 1, its name), o.col (what it holds; GD_SHCOL by default), o.frost (nobody
   reads it), o.lit (0 to 1, its tables' rows lit: read), o.n (how many tables), o.tables (each table's own {a, lit, name, col, dark,
   dx, dy}), o.rim (0 to 1, its rim lit in its colour), o.gate (the gate at its left end: {p, open}) */
function gd_shelf(ctx,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const x=GD_SH.x,y=gd_shelfY(k),w=GD_SH.w,h=GD_SH.h,col=o.col||GD_SHCOL[k],c=dp_f(col),
    n=o.n==null?GD_NT[k]:o.n,lit=clamp(o.lit||0,0,1),rim=clamp(o.rim||0,0,1);
  ctx.save();ctx.globalAlpha*=a;
  const tables=c2=>{for(let j=0;j<n;j++){const T=(o.tables&&o.tables[j])||{},[tx,ty]=gd_tableXY(k,j);
      gd_table(c2,tx+(T.dx||0),ty+(T.dy||0),GD_TW,GD_TH,{col:T.col||col,a:T.a,rows:T.lit==null?lit:T.lit,dark:T.dark});}};
  if(o.frost){dp_frost(ctx,x,y,w,h,tables,{col:"grey",r:14});}
  else{ctx.save();rr(ctx,x,y,w,h,14);ctx.fillStyle="rgba(8,24,30,0.62)";ctx.fill();ctx.restore();
    ctx.save();if(rim>0){ctx.shadowColor=rgba(c,0.7*rim);ctx.shadowBlur=18*rim;}rr(ctx,x+0.8,y+0.8,w-1.6,h-1.6,14);
    ctx.strokeStyle=rgba(mix([120,170,176],c,0.35+0.65*rim),0.55+0.45*rim);ctx.lineWidth=1.8+0.8*rim;ctx.stroke();ctx.restore();
    // the shelf's edge, a line of light along its foot
    ctx.fillStyle=rgba(mix(DP.ice,c,0.5*rim),0.20+0.3*rim);ctx.fillRect(x+16,y+h-8,w-32,1.6);
    tables(ctx);}
  if(o.label!==0){ctx.save();ctx.globalAlpha*=o.label==null?1:o.label;dp_T(ctx,k,x+26,y+h/2+10,{w:500,size:28,f:"mono",col:o.frost?"ink":"ink"});ctx.restore();}
  ctx.restore();}

/* the three doors on the way to a table, as one group sees them: the room's door in its left wall (at the height of shelf k), the
   shelf's gate at its left end, and the table itself; each from shut (0) to open (1), coral while shut and lit, green once open.
   o: d1, d2, d3 ({p: how far it's drawn, open}), table j */
function gd_door(ctx,x,y,h,p,open,o){o=o||{};if(p<=0)return;const u=clamp(open||0,0,1),c=mix(dp_f("coral"),dp_f("green"),u),a=clamp(p,0,1);
  ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor=rgba(c,0.85);ctx.shadowBlur=14;ctx.fillStyle=rgba(c,1);
  // a door of light: two posts, and a leaf that swings open (it narrows as it turns)
  ctx.fillRect(x-4,y,8,6);ctx.fillRect(x-4,y+h-6,8,6);const lw=lerp(10,3,u);rr(ctx,x-lw/2+u*12,y+6,lw,h-12,3);ctx.fill();ctx.restore();
  ctx.restore();}

/* ---------------------------------------------------------------- groups and their grants */
// the groups, each at its place on the left (the pills' left end at x 80, their middle at y)
const GD_GX=80;
const GD_G={registrar_office:262,help_desk:346,planning_learner_readers:430,health_progress_study:514,"account users":598,registrar_exam_support:682,data_team:766};
const gd_gpos=k=>[GD_GX,GD_G[k]];
// a group at its place; returns its box (r: its right end)
function gd_g(ctx,k,o){const [x,y]=gd_gpos(k);return gd_group(ctx,x,y,k,o);}
const gd_gR=(ctx,k)=>gd_g(ctx,k,{measure:true}).r;
/* a grant: a line of light from a group's right end to a shelf's gate, drawn on (p 0 to 1); o.col (green), o.dash (a right to look
   only), o.a, o.bend (how far it curves) */
function gd_grant(ctx,from,to,p,o){o=o||{};p=clamp(p,0,1);if(p<=0)return;const a=o.a==null?1:o.a;if(a<=0)return;const col=o.col||"green",c=dp_f(col);
  const mx=lerp(from[0],to[0],0.55),P=[from,[mx,from[1]],[mx,to[1]],to],n=40;
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=o.lw||2.6;ctx.lineCap="round";ctx.lineJoin="round";ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=9;if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();let last=from;for(let i=0;i<=n;i++){const u=i/n;if(u>p)break;const q=gd_bez(P,u);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);last=q;}ctx.stroke();ctx.setLineDash([]);
  if(p>=1&&o.dot!==false){ctx.fillStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.beginPath();ctx.arc(to[0],to[1],6,0,TAU);ctx.fill();}
  else if(p<1){dp_halo(ctx,last[0],last[1],22,col,0.5);}
  ctx.restore();}
function gd_bez(P,u){const v=1-u;return[v*v*v*P[0][0]+3*v*v*u*P[1][0]+3*v*u*u*P[2][0]+u*u*u*P[3][0],v*v*v*P[0][1]+3*v*v*u*P[1][1]+3*v*u*u*P[2][1]+u*u*u*P[3][1]];}

/* ---------------------------------------------------------------- the old catalog, university, with every table in it
   Governed in Unity Catalog's one catalog: two shelves, prod_core and prod_marts, 58 small tables in all; each grant made on one
   table. GD_OLD lists each table's top left, its shelf and whether a person owns it (9) and has left (2) */
const GD_U={x:600,y:160,w:1240,h:690};
const GD_OLD=(()=>{const L=[],R=ag_rnd(58);let j=0;
  for(const [shelf,y0,rows,cols] of [["prod_core",290,3,13],["prod_marts",620,2,10]])for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){if(L.length>=58)break;
    if(shelf==="prod_marts"&&r===1&&q>8)continue;
    L.push({x:880+q*72,y:y0+r*56,shelf,i:L.length,lit:R()});}
  // the 58th is the new table that waits; nine owned by a person, two of whom have left
  [3,9,14,21,27,33,40,47,52].forEach((i,n)=>{L[i].person=true;L[i].left=n===2||n===6;});return L;})();
const GD_NEW=GD_OLD.length-1;
function gd_oldCatalog(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  gd_roomBox(ctx,{x:GD_U.x,y:GD_U.y,w:GD_U.w,h:GD_U.h,name:"university",plate:o.plate});
  for(const [k,y,h] of [["prod_core",264,190],["prod_marts",594,134]]){ctx.save();rr(ctx,640,y,1160,h,14);ctx.fillStyle="rgba(8,24,30,0.6)";ctx.fill();
    ctx.strokeStyle="rgba(140,186,190,0.5)";ctx.lineWidth=1.6;ctx.stroke();ctx.restore();dp_T(ctx,k,664,y+44,{w:500,size:28,f:"mono"});}
  ctx.restore();}
// one of the old catalog's tables, as a small slab: o.a, o.lit (read), o.dark (no reader yet), o.fly ([x, y, k]: where it is on its way)
function gd_oldTable(ctx,T,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const x=o.at?o.at[0]:T.x,y=o.at?o.at[1]:T.y,s=o.at?o.at[2]:1;
  gd_table(ctx,x,y,56*s,38*s,{col:o.col||(T.shelf==="prod_core"?"violet":"grey"),a,rows:o.lit==null?0.35:o.lit,dark:o.dark});}
// a person who owns a table: a small head and shoulders of light over its corner; left (0 to 1) greys it and crosses it out
function gd_owner(ctx,x,y,a,left){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const col=left>0.5?"grey":"cyan";ctx.translate(x,y);ctx.scale(0.3,0.3);dp_personPic(ctx,0,0,col);ctx.restore();
  if(left>0){ctx.save();ctx.globalAlpha*=a*clamp(left,0,1);const c=dp_f("coral");ctx.strokeStyle=rgba(c,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=8;
    ctx.beginPath();ctx.moveTo(x-14,y+12);ctx.lineTo(x+14,y-16);ctx.stroke();ctx.restore();}}

/* ---------------------------------------------------------------- the other areas' catalogs, small, on the left: the same shelves in each */
const GD_AREAS=[["learning",90,150],["planning",510,150],["hr",90,360],["finance",510,360]];
function gd_areaRooms(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;
  GD_AREAS.forEach(([k,x,y],i)=>{const q=a*(o.each?clamp(o.each-i*0.25,0,1):1);if(q<=0)return;ctx.save();ctx.globalAlpha*=q;
    gd_roomBox(ctx,{x,y,w:380,h:190,name:k,small:true});
    // the same shelves, as thin panes: two frosted, the others clear
    for(let s=0;s<5;s++){const sy=y+66+s*23;ctx.save();rr(ctx,x+24,sy,332,16,5);ctx.fillStyle=s<2?"rgba(110,130,134,0.35)":"rgba(8,24,30,0.7)";ctx.fill();
      ctx.strokeStyle=s===2?rgba(dp_f("violet"),0.7):"rgba(140,186,190,0.45)";ctx.lineWidth=1.2;ctx.stroke();ctx.restore();}
    ctx.restore();});}

/* ---------------------------------------------------------------- the islands on a card: a picture of the opening, small, framed in glass,
   to say "as on the islands" in the hall without leaving it. gd_postcard(ctx, x, y, w, {a, k, draw, label}): the shore painted at
   w x 9/16 w, draw(c) adds what moves, in the shore's own coordinates; label under it */
function gd_postcard(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*9/16,s=w/W;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ctx.save();ctx.shadowColor="rgba(120,220,230,0.35)";ctx.shadowBlur=30;rr(ctx,x-10,y-10,w+20,h+20+(o.label?64:0),20);ctx.fillStyle="rgba(6,20,26,0.8)";ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,12);ctx.clip();ctx.drawImage(dp_place0("gdShore"),x,y,w,h);if(o.draw){ctx.translate(x,y);ctx.scale(s,s);o.draw(ctx);}ctx.restore();
  rr(ctx,x-10+1,y-10+1,w+18,h+18+(o.label?64:0),20);ctx.strokeStyle=rgba(mix(dp_f("cyan"),[255,255,255],0.4),0.8);ctx.lineWidth=2;ctx.stroke();
  if(o.label)dp_T(ctx,o.label,x+w/2,y+h+44,{w:700,size:28,align:"center"});
  ctx.restore();}

/* ---------------------------------------------------------------- workspaces: where the platform is worked from
   A workspace is a room of its own on the left of the hall: its name, and inside, what it lets you do. A catalog is bound to a
   workspace by a bridge of light (read and write: green, both ways; read only: green one way, and a coral bar on the way back). */
function gd_workspace(ctx,x,y,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  gd_roomBox(ctx,{x,y,w,h,col:o.col||"cyan",lit:o.lit,plate:0});
  dp_T(ctx,"WORKSPACE",x+28,y+52,{w:800,size:28,ls:4,col:"cyan"});dp_T(ctx,name,x+28,y+96,{w:500,size:34,f:"mono"});
  ctx.restore();}
// a bridge from a (a workspace's edge) to b (the catalog's wall): p draws it on; o.ro marks it read only; o.cut (0 to 1) crosses it out
function gd_bridge(ctx,a,b,p,o){o=o||{};if(p<=0)return;const al=o.a==null?1:o.a;if(al<=0)return;ctx.save();ctx.globalAlpha*=al;const c=dp_f(o.col||"green");
  const ex=lerp(a[0],b[0],p),ey=lerp(a[1],b[1],p);
  ctx.save();ctx.strokeStyle=rgba(c,0.3);ctx.lineWidth=14;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(ex,ey);ctx.stroke();
  ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=12;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(a[0],a[1]-5);ctx.lineTo(ex,ey-5);ctx.stroke();if(!o.ro){ctx.beginPath();ctx.moveTo(a[0],a[1]+5);ctx.lineTo(ex,ey+5);ctx.stroke();}ctx.restore();
  // its arrows: towards the workspace (read), and back to the catalog (write) unless read only
  if(p>=1){const ang=Math.atan2(b[1]-a[1],b[0]-a[0]),arrow=(x,y,th,col)=>{ctx.save();ctx.translate(x,y);ctx.rotate(th);ctx.fillStyle=rgba(dp_f(col),1);ctx.shadowColor=rgba(dp_f(col),0.8);ctx.shadowBlur=8;
      ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-8,-9);ctx.lineTo(-8,9);ctx.closePath();ctx.fill();ctx.restore();};
    const m=[lerp(a[0],b[0],0.35),lerp(a[1],b[1],0.35)],n=[lerp(a[0],b[0],0.65),lerp(a[1],b[1],0.65)];
    arrow(m[0]+Math.sin(ang)*5,m[1]-Math.cos(ang)*5,ang+Math.PI,o.col||"green");if(!o.ro)arrow(n[0]-Math.sin(ang)*5,n[1]+Math.cos(ang)*5,ang,o.col||"green");}
  if(o.cut>0)dp_cross(ctx,lerp(a[0],b[0],0.5),lerp(a[1],b[1],0.5),"coral",o.cut);
  ctx.restore();}

/* ---------------------------------------------------------------- the room and its readers, as one state
   gd_world(ctx, st) draws the registrar's room, its shelves, its groups and their grants as st says, so each chapter says only what
   differs and two chapters that meet draw the same picture. st.room {a, plate, lit}; st.sh[k] (gd_shelf's options, and dim: a factor
   on its opacity); st.g[k] {a, lit, dy, name} for each group shown; st.grants [{g, to, p, a, col, dash}], to a shelf's name, "browse"
   (the room's wall: a right on the catalog) or a point [x, y]; lines to one shelf share out its gate. */
const GD_BROWSE=[GD_R.x-2,644];
function gd_world(x,st){const R=st.room||{},ra=R.a==null?1:R.a;if(ra<=0)return;
  gd_roomBox(x,{name:"registrar",a:ra,plate:R.plate,lit:R.lit});
  for(const k of GD_SHELF){const o=(st.sh&&st.sh[k])||{},a=(o.a==null?1:o.a)*ra*(o.dim==null?1:o.dim);if(a<=0)continue;
    gd_shelf(x,k,Object.assign({frost:k==="staging"||k==="intermediate"},o,{a}));}
  const G=st.grants||[],cnt={},idx=[];G.forEach(g=>{const k=typeof g.to==="string"?g.to:"pt";idx.push(cnt[k]||0);cnt[k]=(cnt[k]||0)+1;});
  G.forEach((g,i)=>{const go=st.g&&st.g[g.g];if(!go)return;const from=gd_group(x,GD_GX,GD_G[g.g]+(go.dy||0),go.name||g.g,{measure:true}).r,
      to=g.to==="browse"?GD_BROWSE:typeof g.to==="string"?gd_gate(g.to,idx[i],cnt[g.to]):g.to;
    gd_grant(x,from,to,g.p==null?1:g.p,{a:(g.a==null?1:g.a)*Math.min(1,go.a==null?1:go.a),col:g.col,dash:g.dash||(g.to==="browse"?[10,9]:null)});});
  // support, the registrar's own shelf, locked to all but a few
  const so=(st.sh&&st.sh.support)||{},sa=(so.a==null?1:so.a)*ra*(so.dim==null?1:so.dim);if(sa>0&&so.lock!==0){x.save();x.globalAlpha*=sa;dp_lock(x,1770,gd_shelfMid("support")-6,40,"violet",0);x.restore();}
  for(const k of Object.keys(GD_G)){const o=st.g&&st.g[k];if(!o||!(o.a>0))continue;gd_group(x,GD_GX,GD_G[k]+(o.dy||0),o.name||k,{a:o.a,lit:o.lit});}}
// the plan's grants, as chapter 4 makes them: [group, shelf]
const GD_PLAN=[["registrar_office","reference"],["registrar_office","core"],["help_desk","core"],["planning_learner_readers","core"],["health_progress_study","core"],
  ["account users","published"],["account users","browse"],["registrar_exam_support","support"]];
// the plan as it stands from chapter 5 on: every group, every grant, every shelf named (a reference table has moved to published)
function gd_planState(o){o=o||{};const g={};for(const k of Object.keys(GD_G))g[k]={a:1};
  const sh={};for(const k of GD_SHELF)sh[k]={label:1};sh.reference.n=3;sh.published.n=4;sh.core.lit=0.85;sh.support.n=0;
  return{room:{a:1},sh,g,grants:GD_PLAN.map(([gg,to])=>({g:gg,to}))};}

// and as chapter 5 leaves it: core's new version, and the exam support table on its own shelf, both read
function gd_laterState(){const st=gd_planState();st.sh.core.n=5;st.sh.core.tables=[{},{},{},{},{lit:1}];st.sh.support.n=1;st.sh.support.tables=[{lit:1}];return st;}

/* ---------------------------------------------------------------- owners
   Who owns a thing, on a small disc of glass at its corner: what made it (a gear: the identity that runs the job), or, once it's handed
   over, a group (three small heads). GD_CHIPS: where each sits, [x, y, r]: on the catalog's plate, at each shelf's top right corner, and
   on the learner table's. gd_chip(ctx, x, y, r, u (0 the gear, 1 the group), {a, ring (0 to 1: a ring of light going out), ringCol}) */
const GD_CHIPS=[[1792,198,20]].concat(GD_SHELF.map(k=>[GD_SH.x+GD_SH.w,gd_shelfY(k),17]),[[gd_tableXY("core",1)[0]+GD_TW,gd_tableXY("core",1)[1],15]]);
function gd_chip(ctx,x,y,r,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const c=dp_f("cyan");u=clamp(u,0,1);ctx.save();ctx.globalAlpha*=a;
  if(o.ring>0&&o.ring<1){const rc=dp_f(o.ringCol||"cyan");ctx.save();ctx.globalAlpha*=1-o.ring;ctx.strokeStyle=rgba(rc,1);ctx.lineWidth=2.6;ctx.shadowColor=rgba(rc,0.8);ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(x,y,r*(1+1.3*ag_eo(o.ring)),0,TAU);ctx.stroke();ctx.restore();}
  ctx.save();ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=12;ctx.fillStyle="rgba(6,22,28,0.94)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(mix(c,[255,255,255],0.35),0.95);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r-1,0,TAU);ctx.stroke();
  const k=r/20,ink=rgba(mix(c,[255,255,255],0.3),0.95);
  if(u<1){ctx.save();ctx.globalAlpha*=1-u;ctx.translate(x,y);ctx.scale(k,k);dp_gear(ctx,0,0,11.5);ctx.fillStyle=ink;ctx.fill("evenodd");ctx.restore();}
  if(u>0){ctx.save();ctx.globalAlpha*=u;ctx.translate(x,y);ctx.scale(k,k);ctx.fillStyle=ink;ctx.strokeStyle="rgba(6,22,28,0.95)";ctx.lineWidth=1.4;
    for(const [dx,dy,s] of [[-6.6,-1.5,0.82],[6.6,-1.5,0.82],[0,1.5,1]]){ctx.beginPath();ctx.arc(dx,dy-5.6*s,3.8*s,0,TAU);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(dx-6.8*s,dy+8.5*s);ctx.quadraticCurveTo(dx-6.2*s,dy-0.4*s,dx,dy-0.4*s);ctx.quadraticCurveTo(dx+6.2*s,dy-0.4*s,dx+6.8*s,dy+8.5*s);ctx.closePath();ctx.fill();ctx.stroke();}
    ctx.restore();}
  ctx.restore();}

/* the three doors on the way to the learner table, as one group sees them: the room's door in its left wall, the shelf's gate after its
   name, the table's own door; each numbered. d: [[p, open], [p, open], [p, open]] (drawn on, open 0 to 1); n: the numbers' opacity */
const GD_DOORS=[[GD_R.x,556,80],[1214,560,72],[1384,562,68]];
function gd_doors(ctx,d,n){d.forEach(([p,open],i)=>{if(!(p>0))return;const [x,y,h]=GD_DOORS[i];gd_door(ctx,x,y,h,p,open);
    if(n>0){ctx.save();ctx.globalAlpha*=n*clamp(p,0,1);const c=mix(dp_f("coral"),dp_f("green"),clamp(open,0,1));ctx.fillStyle=rgba(c,1);ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=10;
      ctx.beginPath();ctx.arc(x,y+h+30,18,0,TAU);ctx.fill();ctx.restore();dp_T(ctx,String(i+1),x,y+h+40,{w:800,size:28,align:"center",col:DP.on,a:n*clamp(p,0,1)});}});}
