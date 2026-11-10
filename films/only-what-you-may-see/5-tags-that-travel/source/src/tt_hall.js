/* ===== Tags that travel: the university =====
   The university's places, in the module's hall (films/locks-before-the-data/shared/src/hall.js): three rooms of glass, each with a
   glass desk, Sam's on the platform team (ttSam, his desk at the right), Mei's in the registrar's office and Jun's on the data team
   (ttMei and ttJun, their desks at the left); the wide hall where the tables stand (ttHall); and the studies' workspace, with its door
   of glass (ttStudies). People stand behind a desk, cut at its back edge, arms down; their cards are on the other side of the frame,
   never over them. In the hall, people are their identity chips (cyan, a picture and a name), as the platform knows them.
   And the pieces every scene shares: the class chips, as Know what you hold draws them (violet, stronger for stricter: special with a
   double rim, direct, pseudonymous lilac, indirect pale lilac; none clear ice, and on the platform no tag at all, an empty dashed
   outline), a table's level, identity chips, the tables' panes and the lines of lineage between them. Prefixed tt_. */

/* ---------------------------------------------------------------- a glass desk, painted into a place
   A slab seen from a little above: its back edge at TT_BACK, its front edge TT_SLAB lower and lit along its length, its front frosted
   down to the frame's foot. A person behind it is drawn with cut: TT_BACK. */
const TT_SLAB=26,TT_BACK=774;
function tt_desk(c,x0,x1){const back=TT_BACK,y=back+TT_SLAB,h=H-y,ice=DP.ice;
  c.save();c.beginPath();c.rect(x0,y,x1-x0,h);c.clip();dp_blurDraw(c,c.canvas,x0-20,y-20,x1-x0+40,h+40,x0-20,y-20,x1-x0+40,h+40,14);
  const g=c.createLinearGradient(0,y,0,H);g.addColorStop(0,"rgba(150,220,225,0.10)");g.addColorStop(1,"rgba(150,220,225,0.02)");c.fillStyle=g;c.fillRect(x0,y,x1-x0,h);c.fillStyle="rgba(4,14,18,0.35)";c.fillRect(x0,y,x1-x0,h);c.restore();
  c.save();c.beginPath();c.moveTo(x0+22,back);c.lineTo(x1-22,back);c.lineTo(x1,y);c.lineTo(x0,y);c.closePath();c.fillStyle="rgba(170,235,240,0.12)";c.fill();c.restore();
  c.fillStyle=rgba(ice,0.35);c.fillRect(x0+22,back,x1-x0-44,1.4);
  c.save();c.shadowColor=rgba(DP.F.cyan,0.8);c.shadowBlur=10;c.fillStyle=rgba(mix(ice,[255,255,255],0.3),0.9);c.fillRect(x0,y,x1-x0,2.2);c.restore();
  c.fillStyle=rgba(ice,0.22);c.fillRect(x0,y,1.6,h);c.fillRect(x1-1.6,y,1.6,h);}

/* ---------------------------------------------------------------- the places
   Each a hall of its own (its lights and panes fall where its seed puts them, its floor's lines meet at vx), with pools of light where
   its people stand */
AG_PLACES.ttSam=c=>dp_paintHall(c,{seed:83,horizon:700,vx:620,panes:8,pools:[[1540,900,420,0.13],[560,880,560,0.07]],after:c=>tt_desk(c,1100,1940)});
AG_PLACES.ttMei=c=>dp_paintHall(c,{seed:52,horizon:700,vx:1300,panes:8,pools:[[330,900,420,0.13],[1260,880,600,0.07]],after:c=>tt_desk(c,-20,760)});
AG_PLACES.ttJun=c=>dp_paintHall(c,{seed:97,horizon:690,vx:1360,panes:7,pools:[[330,900,420,0.13],[1260,880,600,0.07]],after:c=>tt_desk(c,-20,760)});
AG_PLACES.ttHall=c=>dp_paintHall(c,{seed:14,horizon:720,vx:960,panes:7,haze:0.07,pools:[[350,900,520,0.09],[1550,880,560,0.08]]});
AG_PLACES.ttStudies=c=>dp_paintHall(c,{seed:31,horizon:710,vx:1100,panes:6,pools:[[520,900,520,0.09],[1520,900,420,0.10]]});
const TT_SAM=[1560,600,1],TT_MEI=[330,600,1],TT_JUN=[330,600,1];

/* ---------------------------------------------------------------- class chips
   tt_chip(ctx, x, y, cls, o): a class on a column, its left at x, y the words' baseline (as dp_pill); returns its width. Drawn as
   Know what you hold draws them, so the series shows one chip for each class: a solid pill with dark words, special, direct and
   pseudonymous in violet (special with a second ring, the strictest; pseudonymous with a key, as it leads back only with one), indirect
   in the quieter violet, none in grey. "empty" is no tag at all, a dashed ice outline as that film's empty slot; "proposed" a dashed
   violet outline, the scan's proposal, with the word in grey. o.a opacity, o.k springs it in (0 to 1), o.glow lights it */
// how much of a chip shows as it springs in (k 0 to 1): at most half while it is under nine tenths of its size, then all of it
const tt_grow=k=>{k=clamp(k,0,1);return k<0.89?0.5*k/0.89:0.5+0.5*clamp((k-0.89)/0.08,0,1);};
const TT_CLASS={special:"violet",direct:"violet",pseudonymous:"violet",indirect:"violet2",none:"grey"},TT_KEYED={pseudonymous:1};
// a small key in the dark ink of words on solid colour, its bow's middle at x, y, s about its length (Know what you hold's glyph)
function tt_keyGlyph(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col||DP.on,1);ctx.lineWidth=Math.max(2.4,s*0.17);ctx.lineCap="round";
  ctx.beginPath();ctx.arc(x-s*0.28,y,s*0.24,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.04,y);ctx.lineTo(x+s*0.62,y);
  ctx.moveTo(x+s*0.42,y);ctx.lineTo(x+s*0.42,y+s*0.22);ctx.moveTo(x+s*0.6,y);ctx.lineTo(x+s*0.6,y+s*0.18);ctx.stroke();ctx.restore();}
function tt_chipW(ctx,cls){if(cls==="empty")return 120;if(cls==="noneIce")cls="none";return dp_tw(ctx,cls,{w:700,size:28})+36+(TT_KEYED[cls]?38:0);}
function tt_chip(ctx,x,y,cls,o){o=o||{};if(cls==="noneIce")cls="none";const a=o.a==null?1:o.a,w=tt_chipW(ctx,cls),h=48,top=y-h+12;if(!(a>0.003))return w;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null){ag_about(ctx,x+w/2,y-12,lerp(0.55,1,clamp(o.k,0,1.2)));ctx.globalAlpha*=tt_grow(o.k);}
  if(o.glow>0)dp_halo(ctx,x+w/2,y-12,w*0.9,TT_CLASS[cls]||"violet",0.35*o.glow);
  if(TT_CLASS[cls]){const c=dp_f(TT_CLASS[cls]);
    ctx.save();ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=18;rr(ctx,x,top,w,h,h/2);const g=ctx.createLinearGradient(0,top,0,top+h);
    g.addColorStop(0,rgba(mix(c,[255,255,255],0.16),1));g.addColorStop(1,rgba(c,1));ctx.fillStyle=g;ctx.fill();ctx.restore();
    rr(ctx,x+0.6,top+0.6,w-1.2,h-1.2,h/2-0.6);ctx.strokeStyle=rgba(mix(c,[255,255,255],0.5),0.9);ctx.lineWidth=1.2;ctx.stroke();
    let tx=x+18;if(TT_KEYED[cls]){tt_keyGlyph(ctx,tx+12,top+h/2,24);tx+=38;}
    dp_T(ctx,cls,tx,y-1,{w:700,size:28,col:DP.on});
    if(cls==="special"){const m=7,rw=w+2*m,rh=h+2*m;ctx.save();ctx.shadowColor=rgba(c,0.85);ctx.shadowBlur=12;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.lineWidth=2.4;
      rr(ctx,x-m,top-m,rw,rh,rh/2);ctx.stroke();ctx.restore();}}
  else if(cls==="empty"){rr(ctx,x,top,w,h,h/2);ctx.fillStyle="rgba(8,22,28,0.45)";ctx.fill();ctx.save();ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(DP.ice,0.62);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
  else{const col=mix(DP.F.violet,[255,255,255],0.2);ctx.save();ctx.setLineDash([8,7]);ctx.lineWidth=2.2;ctx.strokeStyle=rgba(col,0.95);rr(ctx,x+1,top+1,w-2,h-2,(h-2)/2);ctx.stroke();ctx.restore();
    dp_T(ctx,"proposed",x+18,y-1,{w:700,size:28,col:"mut"});}
  ctx.restore();return w;}

/* ---------------------------------------------------------------- a table's level, and identity chips
   tt_level: a level on frosted glass in ice white with an ice rim (a level is no meaning colour of its own); returns its width.
   tt_who: who or what acts, as the platform knows them, in the identity's cyan: a gear for a workload (registrar-loader, mono), a
   person's outline for a person; returns its box */
function tt_level(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,w=dp_tw(ctx,text,{w:700,size:28})+36,h=48,x0=o.align==="right"?x-w:x;if(!(a>0.003))return w;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null){ag_about(ctx,x0+w/2,y-12,lerp(0.55,1,clamp(o.k,0,1.2)));ctx.globalAlpha*=tt_grow(o.k);}
  rr(ctx,x0,y-h+12,w,h,12);ctx.fillStyle="rgba(4,18,22,0.78)";ctx.fill();ctx.save();ctx.strokeStyle=rgba(DP.ice,0.9);ctx.lineWidth=2;ctx.shadowColor=rgba(DP.ice,0.6);ctx.shadowBlur=8;rr(ctx,x0+1,y-h+13,w-2,h-2,11);ctx.stroke();ctx.restore();
  dp_T(ctx,text,x0+18,y-1,{w:700,size:28});ctx.restore();return w;}
function tt_who(ctx,x,y,name,o){o=o||{};const a=o.a==null?1:o.a,mono=!!o.mono,w=dp_tw(ctx,name,{w:mono?500:700,size:28,f:mono?"mono":undefined})+104,h=64,x0=o.align==="right"?x-w:x,bb={x:x0,y,w,h};
  if(!(a>0.003))return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null){ag_about(ctx,x0+w/2,y+h/2,lerp(0.55,1,clamp(o.k,0,1.2)));ctx.globalAlpha*=tt_grow(o.k);}
  dp_panel(ctx,x0,y,w,h,{col:"cyan",r:16,glowR:22,behind:o.behind});ctx.save();ctx.translate(x0+40,y+h/2+(o.pic==="gear"?3:6));ctx.scale(0.4,0.4);
  (o.pic==="gear"?dp_gearPic:o.pic==="group"?tt_groupPic:dp_personPic)(ctx,0,0,"cyan");ctx.restore();
  dp_T(ctx,name,x0+80,y+h/2+10,{w:mono?500:700,size:28,f:mono?"mono":undefined,col:"cyan"});ctx.restore();return bb;}

/* ---------------------------------------------------------------- the tables
   A table is a pane of frosted glass: the learner table and the study's copy as Databricks' Catalog Explorer shows them (the logo and
   "Azure Databricks" in the header, the table's name, where it is, a column a row, each with its tags, and how the tags were applied);
   Anil's tables plainer, with their names. TT_L, TT_C, TT_A: where each stands in the hall; tt_rowY gives a row's baseline, tt_slot the
   left of its tag. tt_table draws one: o.chip(i, x, y) draws row i's tag, o.val(i, x, y) a value at the row's right, o.level its level
   (and o.levelA, o.levelK), o.how "Directly assigned" or "Propagated", o.hi(i) lights a row */
const TT_L={x:56,y:120,w:600,page:true,title:"core_learner_v1",sub:"Catalog Explorer · registrar.core",slot:290,
  rows:["student_number","learner_code","name","email","date_of_birth","faculty_code","course","results"]};
// each column's class at the source, as Mei named it (none: no tag), and the study's copy's and Anil's table's, as lineage brings them
const TT_LCLS=["direct","pseudonymous","direct","direct","indirect","empty","empty","empty"],TT_CCLS=["pseudonymous","indirect","empty","empty"],TT_ACLS=["pseudonymous","empty"];
const TT_C={x:1236,y:120,w:628,page:true,title:"learners",sub:"Catalog Explorer · studies.health_progress",slot:276,rows:["learner_code","year_of_birth","course","results"]};
const TT_A={x:1264,y:636,w:600,title:"first_year_progress",titleMono:true,slot:280,rows:["learner_code","course"]};
const TT_LH=56;
function tt_top(T){return T.page?T.y+232:T.y+112;}
function tt_rowY(T,i){return tt_top(T)+i*TT_LH;}
function tt_slot(T,i){return [T.x+T.slot,tt_rowY(T,i)];}
function tt_tableH(T){return tt_top(T)-T.y+(T.rows.length-1)*TT_LH+(T.page?78:34);}
function tt_table(ctx,T,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const x=o.x==null?T.x:o.x,y=o.y==null?T.y:o.y,w=T.w,h=tt_tableH(T),bh=o.behind,S=Object.assign({},T,{x,y});ctx.save();ctx.globalAlpha*=a;
  if(T.page){dp_page(ctx,x,y,w,h,{tool:"databricks",name:"Azure Databricks",behind:bh,col:o.col||TT_ICE});
    dp_T(ctx,T.title,x+28,y+76+52,{w:700,size:36});dp_T(ctx,T.sub,x+28,y+76+94,{w:T.subMono?500:600,size:28,col:"mut",f:T.subMono?"mono":undefined});}
  else{dp_panel(ctx,x,y,w,h,{col:o.col||TT_ICE,r:18,behind:bh,glowA:0.8});dp_T(ctx,T.title,x+28,y+56,{w:T.titleMono?500:700,size:T.titleMono?32:36,f:T.titleMono?"mono":undefined});
    if(o.sub)dp_T(ctx,o.sub,x+w-28,y+56,{w:600,size:28,col:"mut",align:"right"});}
  if(o.level){const la=o.levelA==null?1:o.levelA;if(la>0.003)tt_level(ctx,x+w-28,T.page?y+76+52:y+56,o.level,{align:"right",a:la,k:o.levelK});}
  ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(x+24,tt_top(S)-44,w-48,1.4);
  T.rows.forEach((r,i)=>{const ry=tt_rowY(S,i),ra=o.rowA?o.rowA(i):1;if(!(ra>0.003))return;ctx.save();ctx.globalAlpha*=ra;
    const hi=o.hi?o.hi(i):0;if(hi>0){ctx.save();ctx.globalAlpha*=hi;rr(ctx,x+12,ry-38,w-24,52,10);ctx.fillStyle="rgba(150,230,240,0.10)";ctx.fill();ctx.restore();}
    dp_T(ctx,r,x+28,ry,{w:500,size:28,f:"mono"});if(o.chip)o.chip(i,x+T.slot,ry);if(o.val)o.val(i,x+w-28,ry);ctx.restore();});
  if(o.how){const ha=o.howA==null?1:o.howA;if(ha>0.003)dp_T(ctx,"Tags: "+o.how,x+28,y+h-26,{w:600,size:28,col:"mut",a:ha});}
  ctx.restore();}

/* ---------------------------------------------------------------- lineage: a line of light from a row of one table to a row of another
   tt_path(a, b): a gentle curve from a's right to b's left; tt_along(P, u): the point u of the way along it. tt_lineage draws it on
   (p 0 to 1), in the ice of the panes' edges, brighter when lit (lit 0 to 1) */
function tt_path(a,b){const dx=Math.max(80,(b[0]-a[0])*0.45);return [a,[a[0]+dx,a[1]],[b[0]-dx,b[1]],b];}
function tt_pathL(a,b){return [a,[a[0]-70,a[1]],[b[0]-70,b[1]],b];}
function tt_along(P,u){u=clamp(u,0,1);const v=1-u,[p0,p1,p2,p3]=P;return [v*v*v*p0[0]+3*v*v*u*p1[0]+3*v*u*u*p2[0]+u*u*u*p3[0],v*v*v*p0[1]+3*v*v*u*p1[1]+3*v*u*u*p2[1]+u*u*u*p3[1]];}
function tt_lineage(ctx,P,p,o){o=o||{};p=clamp(p==null?1:p,0,1);if(p<=0)return;const lit=o.lit||0,col=o.col?dp_f(o.col):DP.ice,a=o.a==null?1:o.a;ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=rgba(col,0.45+0.5*lit);ctx.lineWidth=2.4+1.6*lit;ctx.lineCap="round";ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=6+10*lit;if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();const n=40;for(let k=0;k<=n*p;k++){const q=tt_along(P,k/n);k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();
  if(p>=1&&o.dot!==false){ctx.setLineDash([]);ctx.fillStyle=rgba(mix(col,[255,255,255],0.35),0.9);ctx.beginPath();ctx.arc(P[0][0],P[0][1],5,0,TAU);ctx.arc(P[3][0],P[3][1],5,0,TAU);ctx.fill();}ctx.restore();}
// a chip riding a line: at u along P (0 to 1), its middle on the line (o.left: on the line's left, clear of a table it runs down), landing in the slot at the end
function tt_ride(ctx,P,u,cls,slot,o){o=o||{};const q=tt_along(P,u),w=tt_chipW(ctx,cls),e=ag_sine(clamp((u-0.85)/0.15,0,1)),x=lerp(q[0]-(o.left?w+14:w/2),slot[0],e),y=lerp(q[1]+12,slot[1],e);
  if(u>0&&u<1)dp_halo(ctx,q[0],q[1],70,TT_CLASS[cls]||"violet",0.3);tt_chip(ctx,x,y,cls,o);}

/* ---------------------------------------------------------------- small pieces
   a dashed note (a "suppose"), a calendar slip, a coral ring round what is wrong, and a card's line */
function tt_note(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,w=dp_tw(ctx,text,{w:600,size:28})+40,h=52,x0=o.align==="center"?x-w/2:x;if(!(a>0.003))return w;ctx.save();ctx.globalAlpha*=a;
  rr(ctx,x0,y,w,h,12);ctx.fillStyle="rgba(4,18,22,0.82)";ctx.fill();ctx.setLineDash([9,7]);ctx.strokeStyle=rgba(DP.ice,0.8);ctx.lineWidth=2;rr(ctx,x0+1,y+1,w-2,h-2,11);ctx.stroke();
  dp_T(ctx,text,x0+20,y+36,{w:600,size:28,col:o.col||"ink"});ctx.restore();return w;}
function tt_ring(ctx,x,y,w,h,p,o){o=o||{};p=clamp(p,0,1);if(p<=0)return;const a=o.a==null?1:o.a;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(DP.F.coral,1);ctx.lineWidth=3;ctx.shadowColor=rgba(DP.F.coral,0.8);ctx.shadowBlur=12;
  const cx=x+w/2,cy=y+h/2,rx=w/2+16,ry=h/2+14;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,-Math.PI/2,-Math.PI/2+TAU*ag_sine(p));ctx.stroke();ctx.restore();
  if(o.label&&p>0.6)dp_T(ctx,o.label,o.lx==null?cx:o.lx,o.ly==null?y+h+50:o.ly,{w:700,size:28,col:"coral",align:o.lalign||"center",a:a*ag_in(p,0.6,0.4)});}
