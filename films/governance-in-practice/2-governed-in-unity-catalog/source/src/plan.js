/* ===== Governed in Unity Catalog: the places and the pictures =====
   The places are painted once and kept (data governance's shared/src/finish.js): the platform team's room close up, Sam's desk in
   front; a big screen on a desk, on the platform team's, Planning's or the registrar's office's wall; the data team's desk from above for
   the files, Yusuf's desk for the old path's papers, the registrar's desk for Clara's request; Planning's office; the registrar's office
   close up; the university's directory, a card index on the platform team's wall; Noor's map close up; and the data team's board. The
   pictures are the film's own things, drawn with the series' pieces (shared/src/tools.js): the platform's pages, drawn as forms (a table's
   sample data, columns and grants, the catalog as a cabinet of drawers, the Discover page's areas, the governed tag, the policy, the
   lineage view, a query and its result), the files the film opens (each the example project's own lines, or a worked example's), tags on
   their strings, masks, the machine that scrambles a student number, groups as rings of name cards, and the map. Every name starts with
   gc_ or GC_. */

// made once per chapter, the first time it draws: its cues are known by then
const gc_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a pencil line under words, drawn on as p goes 0 to 1
function gc_under(ctx,x,y,w,p,col){if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(col||WC_PENCIL,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);
  const n=16,e=easeCam(clamp(p,0,1));for(let i=1;i<=n;i++){const u=i/n*e;ctx.lineTo(x+w*u,y+2*Math.sin(u*9));}ctx.stroke();ctx.restore();}
// a pencil arrow along a curve from a to b, bowed by bend (px, up when negative), drawn on as p goes 0 to 1
function gc_arrow(ctx,a,b,bend,p,o){o=o||{};if(p<=0)return;const c=[(a[0]+b[0])/2+(o.bx||0),(a[1]+b[1])/2+bend],n=28,m=Math.max(2,Math.round(n*clamp(p,0,1))),pt=u=>{const v=1-u;
    return[v*v*a[0]+2*v*u*c[0]+u*u*b[0],v*v*a[1]+2*v*u*c[1]+u*u*b[1]];};
  ctx.save();ctx.strokeStyle=rgba(o.col||WC_PENCIL,o.a==null?0.9:o.a);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();
  for(let i=0;i<=m;i++){const [x,y]=pt(i/n);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);
  if(p>=1&&o.head!==false){const [x1,y1]=pt(1),[x0,y0]=pt(0.93),an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-16*Math.cos(an-0.5),y1-16*Math.sin(an-0.5));
    ctx.lineTo(x1,y1);ctx.lineTo(x1-16*Math.cos(an+0.5),y1-16*Math.sin(an+0.5));ctx.stroke();}ctx.restore();}
// a point along the same curve, for something carried on it
function gc_along(a,b,bend,u){const c=[(a[0]+b[0])/2,(a[1]+b[1])/2+bend],v=1-u;return[v*v*a[0]+2*v*u*c[0]+u*u*b[0],v*v*a[1]+2*v*u*c[1]+u*u*b[1]];}
// a red question mark, settling with a spring
function gc_redQ(ctx,x,y,s,p){if(p<=0)return;const k=spring(p);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(p*2,0,1),()=>wc_T(ctx,"?",0,0,{w:800,size:s,align:"center",col:GV.redInk}));ctx.restore();}
// a speech bubble that springs in at t0 and goes at t1
function gc_say(ctx,t,t0,t1,x,y,lines,tx,ty,o){return gv_say(ctx,x,y,lines,tx,ty,Object.assign({a:gv_io(t,t0,t1,0.35),k:0.92+0.08*spring(fin(t,t0,0.5)),size:36},o||{}));}
// the old days: the colours fade a little, warmer and paler, while the old path's papers lie on top (as Who may see it draws a memory)
function gc_memory(ctx,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="saturation";ctx.fillStyle=rgba([128,128,128],0.6*a);ctx.fillRect(-W,-H,3*W,3*H);
  ctx.globalCompositeOperation="multiply";ctx.fillStyle=rgba([248,230,204],0.7*a);ctx.fillRect(-W,-H,3*W,3*H);ctx.globalCompositeOperation="source-over";ctx.fillStyle=rgba(WC_PAPER,0.22*a);ctx.fillRect(-W,-H,3*W,3*H);ctx.restore();}
// a word that springs in, in a hand, at t0 (and goes at t1)
function gc_handAt(ctx,t,t0,t1,s,x,y,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;withA(ctx,a,()=>wc_hand(ctx,s,x,y,Object.assign({size:36,w:700,p:clamp((t-t0)/0.6,0,1)},o||{})));}

/* ---------- the platform team's room ---------- */
// a table on a screen, too small to read: a header, then n rows of values in four columns
function gc_gridRows(x,sx,sy,sw,n){x.save();for(let r=0;r<=n;r++)for(let k=0;k<4;k++){x.fillStyle=rgba(r?[150,150,166]:[90,96,120],r?0.55:0.8);
  x.fillRect(sx+k*sw/4,sy+r*34,(sw/4-28)*(r?0.5+0.45*hash(r*4+k,5):0.8),r?7:9);}x.restore();}
// Sam at his desk, Yusuf standing behind him at the right, as Who may see it drew them; then the desk in front, and its two screens
// (small: what they show is decoration, apart from o.draw1, the right one's, drawn at a size the camera reads)
function gc_room(ctx,t,o){o=o||{};gv_behind(ctx,"yusuf",1790,GV_PX.top,1.55,Object.assign({standing:true,pose:"listen",t,flip:true},o.yusuf||{}));
  gv_behind(ctx,"sam",GV_PX.seat[0],GV_PX.top,GV_PX.seat[1],Object.assign({pose:"listen",t},o.sam||{}));ctx.drawImage(gv_place("platformDesk"),0,0,W,H);
  const [sx,sy,sw,sh]=GV_PX.screens[0];gv_screen(ctx,sx,sy,sw,sh,"core_learner_v1",null,{barH:44,titleSize:28});gc_gridRows(ctx,sx+30,sy+84,sw-60,6);
  const [rx,ry,rw,rh]=GV_PX.screens[1];gv_screen(ctx,rx,ry,rw,rh,o.s1||"Permissions",null,{barH:44,titleSize:28});if(o.draw1)o.draw1(ctx,rx,ry,rw,rh);else gv_lines(ctx,rx+30,ry+90,rw-120,6,34,0.8);}
// Sam's line from Off the shelf, beside him, in the same hand; with a green tick once the project tells him which column (tick, 0 to 1)
const GC_LINE=["Tell me which column,","I'll protect it in minutes."];
function gc_bubble(ctx,a,k,tick){if(a<=0.01)return;const x=760,y=96,w=gv_say(ctx,x,y,GC_LINE,1490,440,{a,k,size:40});
  if(tick>0.01)withA(ctx,a,()=>wc_tick(ctx,x+w+56,y+70,64,GV.greenInk,tick,8));}

/* ---------- a table's page on the platform ---------- */
// the learner table's page, as Catalog Explorer lays one out, drawn as a form: its catalog and schema, and its tabs (o.tab opens one)
const GC_TABS=["Overview","Columns","Sample data","Permissions","Lineage"];
function gc_tablePage(ctx,o){o=o||{};const [x,y,w,h]=GU_BIG;return gu_page(ctx,x,y,w,h,{bar:"Databricks · Unity Catalog",title:o.title||"core_learner_v1",titleSize:o.titleSize,
  sub:o.sub||"university · prod_core · table",tabs:o.tabs||GC_TABS,tab:o.tab==null?2:o.tab});}
// its sample data: five of its columns, each with its class (as Who may see it gave them) and three learners from the example project's
// sample. o.chip[k] (0 to 1) brings column k's tag in on its string, from o.from[k] (a point) along a curve, or drops it from above;
// o.q (0 to 1), red question marks beside the columns nobody had classed; o.mask (0 to 1), the plum bands over the direct columns' values;
// o.lit[k], a gold wash on a column's header; o.vlit[k], on its values
const GC_COLS=[["learner_key","pseudonymous",160,290],["learner_bk","direct",450,250],["full_name","direct",700,270],["email","direct",970,470],["status","none",1440,220]];
const GC_ROWS=[["0905e6e2…","SIS|S-20417","Aisha Karimi","aisha.k@mail.example","completed"],["1364b7f6…","SIS|S-20418","Jie Chen","jie.chen@mail.example","studying"],
  ["4d0508d9…","SIS|S-20419","Omar Haddad","omar.haddad@mail.example","studying"]];
const GC_GY={head:396,chip:452,rule:490,row0:552,dy:62};
// a tag: the class's chip on a pencil string, tied to what it labels at (ax,ay); drawn at (x,y), its left end, and settling as it lands
function gc_tag(ctx,ax,ay,x,y,cls,u,o){o=o||{};if(u<=0.01)return 0;const land=clamp(u,0,1),k=lerp(1.2,1,spring(clamp((u-0.75)*4,0,1)));
  if(ax!=null&&land>0.85){ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.8*clamp((land-0.85)*7,0,1));ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ax,ay);
    ctx.quadraticCurveTo((ax+x)/2-10,(ay+y)/2+18,x+6,y);ctx.stroke();ctx.restore();}
  let w=0;ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(u*3,0,1),()=>{w=gv_classChip(ctx,0,0,cls,{size:o.size});});ctx.restore();return w;}
function gc_grid(ctx,t,o){o=o||{};const Y=GC_GY,ch=o.chip||[],m=clamp(o.mask||0,0,1);
  GC_COLS.forEach(([c,cls,x,w],k)=>{const L=(o.lit||[])[k]||0;if(L>0.01)gv_tint(ctx,x-12,Y.head-34,gu_mw(ctx,c)+24,46,GV.gold,0.85*L);
    wc_T(ctx,c,x,Y.head,{w:500,size:28,f:"mono",col:WC_DARK});
    const u=ch[k]||0;if(u>0.01){const to=[x,Y.chip],fr=(o.from||[])[k]||[x+40,Y.chip-220],e=easeCam(clamp(u,0,1)),
        [px,py]=u<1?gc_along(fr,to,o.bend==null?-120:o.bend,e):to;gc_tag(ctx,u>=1?x+gu_mw(ctx,c)/2:null,Y.head+10,px,py,cls,u);}
    gc_redQ(ctx,x+gu_mw(ctx,c)+30,Y.head+6,52,clamp((o.q||0)*2.4-k*0.35,0,1)*(1-clamp((ch[k]||0)*3,0,1)));});
  ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(150,Y.rule,1610,2);ctx.restore();
  GC_ROWS.forEach((r,i)=>{const by=Y.row0+i*Y.dy;GC_COLS.forEach(([c,cls,x,w],k)=>{const V=(o.vlit||[])[k]||0;if(V>0.01)gv_tint(ctx,x-12,by-34,gu_mw(ctx,r[k])+24,46,GV.gold,0.8*V);
    const mk=cls==="direct"&&m>0?clamp(m*1.8-i*0.3,0,1):0;if(mk<1)wc_T(ctx,r[k],x,by,{w:500,size:28,f:"mono",col:WC_INK,deco:mk>0?1:0});
    if(mk>0)gv_mask(ctx,x-14,by-38,w-24,52,mk,{size:28});});});}

/* ---------- the old path, from Who may see it ---------- */
// the request form: its heading, boxes to fill in, a signature
function gc_reqForm(ctx,x,y,rot,a){if(a<=0.01)return;const w=420,h=540,c=wc_kept("gcReqform",w+40,h+40,q=>{q.drawImage(gv_sheetPaper(w,h),0,0);q.translate(20,20);
    q.strokeStyle=rgba(WC_MUTED,0.55);q.lineWidth=2;for(let i=0;i<5;i++)q.strokeRect(38,132+i*66,w-76,40);q.fillStyle=rgba(WC_MUTED,0.35);for(let i=0;i<5;i++)q.fillRect(38,118+i*66,90+30*(i%3),6);
    q.strokeStyle=rgba([40,50,110],0.8);q.lineWidth=2.6;q.lineCap="round";q.beginPath();q.moveTo(64,h-44);for(let k=1;k<14;k++)q.lineTo(64+k*13,h-44-11*Math.sin(k*1.3)+(k%4)*2);q.stroke();});
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);withA(ctx,a,()=>{ctx.drawImage(c,-w/2-20,-h/2-20);wc_T(ctx,"request for access",0,-h/2+68,{w:800,size:32,align:"center",col:WC_DARK});});ctx.restore();}
// the approval, printed from an email: its header, a rule, one word
function gc_emailPrint(ctx,x,y,rot,a){if(a<=0.01)return;const w=440,h=300,c=wc_kept("gcEmailprint",w+40,h+40,q=>{q.drawImage(gv_sheetPaper(w,h),0,0);q.translate(20,20);
    q.fillStyle=rgba(WC_MUTED,0.42);for(let i=0;i<3;i++)q.fillRect(36,40+i*26,[200,262,170][i],6);q.fillStyle=rgba(WC_MUTED,0.25);q.fillRect(36,128,w-72,3);
    for(let i=0;i<2;i++)q.fillRect(36,236+i*24,[300,180][i],5);});
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);withA(ctx,a,()=>{ctx.drawImage(c,-w/2-20,-h/2-20);wc_T(ctx,"Approved",-w/2+36,-h/2+200,{w:800,size:46,col:WC_DARK});});ctx.restore();}
// three weeks of a month on a sheet, each day crossed through in pencil as they pass (u, 0 to 1), and "3 weeks" in a hand under them
function gc_weeks(ctx,x,y,rot,a,u){if(a<=0.01)return;const w=440,h=340;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot);ctx.translate(-w/2,-h/2);withA(ctx,a,()=>{
  ctx.drawImage(gv_sheetPaper(w,h),-20,-20);ctx.fillStyle=rgba([198,96,74],0.9);ctx.fillRect(0,0,w,46);wc_T(ctx,"waiting",22,33,{w:800,size:28,col:[255,255,255]});
  for(let r=0;r<3;r++)for(let c=0;c<7;c++){const cx=34+c*58,cy=92+r*58;ctx.strokeStyle=rgba(WC_MUTED,0.45);ctx.lineWidth=1.6;ctx.strokeRect(cx-22,cy-20,44,40);
    const v=clamp(u*21-(r*7+c),0,1);if(v>0)wc_cross(ctx,cx,cy,30,WC_PENCIL,v);}
  if(u>0.6)wc_hand(ctx,"3 weeks",w-36,h-24,{size:36,w:700,align:"right",col:WC_PENCIL,p:clamp((u-0.6)*3,0,1)});});ctx.restore();}
// a key on a string and a paper tag: the whole table, given to one person
function gc_keyC(){return wc_kept("gcKey",260,120,q=>{q.translate(20,60);const c=[214,176,92];
  wc_wash(q,wc_ell(36,0,34,34,30),c,{kind:"thing",lw:1.3,seed:81});q.save();q.globalCompositeOperation="destination-out";q.beginPath();q.arc(30,0,12,0,TAU);q.fill();q.restore();
  wc_part(q,wc_rect(66,-8,150,16),c,1,{seed:82});wc_part(q,[[170,8],[186,8],[186,30],[178,24],[170,30]],c,1,{seed:83});wc_part(q,[[196,8],[214,8],[214,26],[196,26]],c,1,{seed:84});});}
function gc_keyTag(ctx,x,y,rot,name,a){if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);withA(ctx,a,()=>{ctx.drawImage(gc_keyC(),-20,-60);
  ctx.strokeStyle=rgba([150,128,92],0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(8,14);ctx.quadraticCurveTo(-10,70,24,110);ctx.stroke();
  const w=Math.round(tw(ctx,name,32,800)+60);wc_panel(ctx,8,106,w,66,{kind:"tag",seed:85});wc_T(ctx,name,8+w/2,151,{w:800,size:32,align:"center",col:WC_DARK});});ctx.restore();}
// the old path on Yusuf's desk, as it was: the form (o.form), the emailed approval (o.mail), three weeks (o.wait, o.weeks), the whole
// table on a key (o.key), to one person (o.one) and with no end date (o.noend), each 0 to 1
function gc_oldPath(ctx,o){o=o||{};gc_reqForm(ctx,330,420,-0.05,o.form||0);gc_emailPrint(ctx,800,300,0.04,o.mail||0);gc_weeks(ctx,1100,150,-0.02,o.wait||0,o.weeks||0);
  gc_keyTag(ctx,820,610,-0.08,"the whole table",o.key||0);
  if(o.one>0.01)withA(ctx,o.one,()=>gu_nameCard(ctx,1220,600,"one person","by name",1));
  if(o.noend>0.01)wc_hand(ctx,"no end date",1250,820,{size:44,w:700,col:GV.redInk,p:o.noend});}

/* ---------- who can read the learner table ---------- */
// the 41 people the table's grants named, as its Permissions tab lists them: people from other jobs, years of requests granted by name.
// Nine have moved on (GC_GONE). Ten work in the registrar's office (GC_REG) and five in the data team (GC_DATA): after December's review,
// two groups read the table, theirs. The names are Who may see it's.
const GC_WHO=["M. Tanaka","J. Park","P. Ndlovu","E. Fischer","R. Gupta","T. Moreno","A. Moreau","K. Kowalski","L. Silva","D. Novak","H. Sato",
  "I. Andersson","C. Okoye","F. Rahman","G. Varga","B. Herrera","S. Bianchi","N. Mwangi","P. Kaur","V. Dupont","O. Sorensen","Y. Ito","M. Pereira",
  "A. Nakamura","T. Adeyemi","R. Horvat","E. Larsen","J. Bakker","K. Quinn","L. Romero","S. Takahashi","H. Eriksen","D. Molina","U. Abara",
  "Z. Iqbal","C. Fontaine","M. Kovac","R. Duarte","A. Shah","W. Brooks","G. Hoffmann"];
const GC_GONE=[5,9,14,18,23,27,31,35,39],GC_REG=[0,2,6,10,13,16,20,24,28,33],GC_DATA=[1,11,19,25,36];
const gc_whoAt=i=>[180+Math.floor(i/11)*400,392+(i%11)*44];
// a group, drawn as a ring of name cards: the group's name over it, its members as small cards hanging on the ring (n, of which g have
// gone: o.out, 0 to 1, takes the last ones off), and its clasp, with a date tag (o.clasp, 0 to 1). A struck group (o.strike) is crossed
// through in red. Centred at (cx,cy), radius r
function gc_ring(ctx,cx,cy,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const r=o.r||70,n=o.n||0,k=0.9+0.1*spring(clamp(a,0,1)),ns=o.nameSize||28;
  ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);withA(ctx,clamp(a*2,0,1),()=>{
    wc_T(ctx,name,0,r+104,{w:500,size:ns,f:"mono",align:"center",col:WC_DARK});
    ctx.strokeStyle=rgba([120,126,140],0.95);ctx.lineWidth=7;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(-2,-2,r,3.6,5.2);ctx.stroke();
    for(let i=0;i<n;i++){const an=Math.PI*(0.18+0.64*(n===1?0.5:i/(n-1))),v=1-clamp((o.out||0)*n-(n-1-i),0,1);if(v<=0.01)continue;const px=Math.cos(an)*r,py=Math.sin(an)*r;
      ctx.save();ctx.translate(px,py+60*(1-v));ctx.rotate((an-Math.PI/2)*0.6);withA(ctx,v,()=>{ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-4);ctx.lineTo(0,10);ctx.stroke();
        wc_panel(ctx,-17,10,34,44,{kind:"card",wash:o.wash,washA:0.3,seed:200+i});ctx.fillStyle=rgba(WC_MUTED,0.5);ctx.fillRect(-10,24,20,4);ctx.fillRect(-10,34,14,4);});ctx.restore();}
    const cl=clamp(o.clasp||0,0,1);if(cl>0.01&&o.date){wc_part(ctx,wc_rrPts(-14,-r-14,28,28,6),[150,128,92],1,{seed:213});withA(ctx,cl,()=>{ctx.strokeStyle=rgba([150,128,92],0.9);ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(0,-r-14);ctx.quadraticCurveTo(6,-r-26,0,-r-38);ctx.stroke();wc_tag(ctx,0,-r-62,o.date,{size:28,align:"center",seed:214});});}
    if(o.strike>0.01){ctx.strokeStyle=rgba(GV.redInk,0.9);ctx.lineWidth=6;ctx.lineCap="round";const sw=tw(ctx,name,ns,500,"mono")/2+20;ctx.beginPath();ctx.moveTo(-sw,r+94);ctx.lineTo(-sw+2*sw*easeCam(clamp(o.strike,0,1)),r+94);ctx.stroke();}});
  ctx.restore();}
// the grants on the Permissions tab: the names coming in (o.fill), the nine going grey with "moved on" (o.grey), all of them dimmed when
// something has to change (o.dim); then gathering into groups (o.gather): the registrar's office's and the data team's names glide into
// their rings and the rest fall away, and Planning's ring comes with Clara's card and its date (o.plan); in December (o.dec) Planning's
// card has gone, and two groups stay
const GC_RINGS=[["registrar_office",560,600,GC_REG],["data_team",1000,600,GC_DATA],["planning_learner_readers",1440,600,null]];
function gc_grants(ctx,t,o){o=o||{};gc_tablePage(ctx,{tab:3});const g=clamp(o.gather||0,0,1),dm=1-0.6*clamp(o.dim||0,0,1)*(1-g),fill=o.fill==null?1:o.fill,dec=clamp(o.dec||0,0,1);
  GC_WHO.forEach((s,i)=>{const u=clamp(fill*1.25-i/41*0.25,0,1)*clamp((fill*41-i)*1.5,0,1);if(u<=0.01)return;const gone=GC_GONE.includes(i),gr=gone?clamp(o.grey||0,0,1):0;
    let [x,y]=gc_whoAt(i),a=u*dm;const k=GC_REG.includes(i)?0:GC_DATA.includes(i)?1:-1;
    if(g>0){if(k>=0){const R=GC_RINGS[k],v=easeCam(clamp((g-0.25)/0.45,0,1));x=lerp(x,R[1]-60,v);y=lerp(y,R[2]+10,v);a*=1-clamp(v*2.2-0.3,0,1);}
      else{const v=clamp(g*3.2-(gone?0:0.15),0,1);y+=v*v*30;a*=1-v;}}
    if(a>0.01){wc_T(ctx,s,x,y,{w:600,size:28,col:mix(WC_INK,[176,174,184],gr),a});if(gr>0.01)wc_hand(ctx,"moved on",x+200,y,{size:28,w:700,col:[150,148,160],a:a*gr,p:gr});}});
  const head=clamp(fill*3-2,0,1)*(1-clamp(g*3,0,1));if(head>0.01){wc_T(ctx,"41 people can read it",1762,180,{w:800,size:32,col:WC_DARK,align:"right",a:head});
    if(o.grey>0)wc_T(ctx,"9 moved on",1762,224,{w:700,size:28,col:[150,148,160],align:"right",a:head*clamp(o.grey*2,0,1)});}
  if(g>0.01){GC_RINGS.forEach(([n,cx,cy,mem],k)=>{const a=clamp((g-0.4-k*0.08)/0.3,0,1)*(k===2?1-clamp(dec*1.6-0.6,0,1):1);if(a<=0.01)return;
      gc_ring(ctx,cx,cy,n,{a,n:mem?mem.length:1,out:k===2?clamp(dec*2,0,1):0,date:k===2?"until 15 Dec 2026":"reviewed each December",clasp:clamp((g-0.6-k*0.08)/0.3,0,1),
        wash:k===2?GV.gold:null,nameSize:k===2?28:30});});
    const n=dec>0.5?"2 groups can read it":"3 groups can read it",ha=clamp(g*3-2,0,1);if(ha>0.01)wc_T(ctx,n,1762,180,{w:800,size:32,col:WC_DARK,align:"right",a:ha});}}

/* ---------- the catalog, as a cabinet of drawers ---------- */
// The university's catalog on the platform's page, drawn as a cabinet: a drawer for each schema dbt builds (prod_core, prod_marts,
// prod_shared), and the first layers' views behind a low fence (prod_staging, prod_intermediate), which nobody else is granted. Each
// drawer holds its tables as cards. o.dr[i] (0 to 1) brings drawer i; o.fence; o.learner, the learner table's card lifting with its
// name; o.band (0 to 1), a plum band on each table that holds direct personal data; o.locks (0 to 1), a padlock on each, then (0 to 1)
// o.sweep carrying them into the policy's card
const GC_SCH=[["prod_core",5],["prod_marts",5],["prod_shared",1],["prod_staging",13],["prod_intermediate",8]],GC_DX=i=>150+i*322,GC_DW=318;
// which cards hold direct personal data: the learner table, the credentials, and two of the marts (the wallet's)
const GC_PERS=[[0,1,2,4],[3,4],[],[],[]];
function gc_cardAt(i,j){const n=GC_SCH[i][1],dx=GC_DW-60,step=Math.min(44,dx/Math.max(1,n)),x=GC_DX(i)+30+j*step+(n<4?60:0),h=150+((j*37+i*11)%5)*12;return[x,690-h,h];}
function gc_padlock(ctx,x,y,s,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba([110,96,70],0.95);ctx.lineWidth=4;
  ctx.beginPath();ctx.arc(0,-10,10,Math.PI,0);ctx.lineTo(10,0);ctx.moveTo(-10,0);ctx.lineTo(-10,-10);ctx.stroke();wc_part(ctx,wc_rrPts(-15,-2,30,24,4),[214,176,92],1,{seed:301});
  ctx.fillStyle=rgba([110,96,70],0.9);ctx.beginPath();ctx.arc(0,9,3.2,0,TAU);ctx.fill();ctx.restore();});}
function gc_cabinet(ctx,t,o){o=o||{};const [X,Y,Wd,Hd]=GU_BIG;gu_page(ctx,X,Y,Wd,Hd,{bar:"Databricks · Unity Catalog",title:"university",sub:"catalog",state:o.state});
  const fe=clamp(o.fence||0,0,1);
  if(fe>0.01){const fx=GC_DX(3)-14,fw=GC_DX(4)+GC_DW+14-fx;wc_wash(ctx,wc_rect(fx,380,fw,486),wc_lit([150,170,200],0.6),{kind:"swatch",a:0.4*fe,seed:131,line:false});
    ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85*fe);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(fx,860);ctx.lineTo(fx,380);ctx.lineTo(fx+fw,380);ctx.lineTo(fx+fw,860);ctx.stroke();
    for(let px=fx;px<=fx+fw;px+=46){ctx.beginPath();ctx.moveTo(px,371);ctx.lineTo(px,389);ctx.stroke();}ctx.restore();
    withA(ctx,fe,()=>wc_tag(ctx,fx+fw/2,354,"views · nobody else is granted",{size:28,align:"center",seed:132}));}
  GC_SCH.forEach(([s,n],i)=>{const u=clamp((o.dr||[])[i]==null?1:o.dr[i],0,1);if(u<=0.01)return;const x=GC_DX(i),view=i>=3,e=easeCam(u);
    ctx.save();ctx.translate(0,16*(1-e));withA(ctx,clamp(u*2,0,1),()=>{
      for(let j=0;j<n;j++){const [cx,cy,ch]=gc_cardAt(i,j),lift=i===0&&j===4?easeCam(clamp(o.learner||0,0,1)):0;
        ctx.save();ctx.translate(cx,cy-80*lift);ctx.rotate(((j*7+i*3)%5-2)*0.03*(1-lift));wc_panel(ctx,0,0,36,ch,{kind:"card",dashed:view,role:view?[150,160,176]:null,seed:240+i*20+j});
        ctx.fillStyle=rgba(WC_MUTED,0.45);ctx.fillRect(8,14,20,4);ctx.fillRect(8,24,14,4);
        if(GC_PERS[i].includes(j)&&(o.band||0)>0.01){const b=clamp((o.band||0)*1.5-j*0.08,0,1);if(b>0){ctx.save();ctx.beginPath();ctx.rect(2,38,32*easeCam(b),18);ctx.clip();
          ctx.fillStyle=rgba(GV_CLASS.direct,1);ctx.fillRect(4,40,28,14);ctx.restore();}}
        const lk=clamp((o.locks||0)*1.6-(i*5+j)*0.05,0,1)*(1-clamp(o.sweep||0,0,1));if(!view&&lk>0.01)gc_padlock(ctx,18,-16,0.8,lk);ctx.restore();}
      wc_part(ctx,wc_rect(x,690,GC_DW,160),view?[196,200,210]:[176,140,104],1,{seed:250+i});wc_part(ctx,wc_rect(x+10,712,GC_DW-20,50),[236,228,212],1,{seed:260+i});if((o.lab||0)>0.01)gv_tint(ctx,x+12,714,GC_DW-24,46,GV.gold,0.8*o.lab);
      wc_T(ctx,s,x+GC_DW/2,748,{w:500,size:28,f:"mono",align:"center",col:WC_DARK});wc_part(ctx,wc_rrPts(x+GC_DW/2-40,790,80,22,8),view?[150,156,168]:[150,112,70],1,{seed:270+i});});
    ctx.restore();});
  const lu=clamp(o.learner||0,0,1);if(lu>0.01){const [cx,cy]=gc_cardAt(0,4);withA(ctx,lu,()=>wc_tag(ctx,cx-30,cy-150,"core_learner_v1",{size:28,f:"mono",w:500,seed:281}));}}
// one policy, on a card pinned over the catalog: its name and where it applies (a, 0 to 1); locks swept into it pile up behind
function gc_policyCard(ctx,x,y,a,o){o=o||{};if(a<=0.01)return;const w=600,h=176,k=lerp(1.2,1,spring(clamp(a,0,1)));ctx.save();ctx.translate(x+w/2,y+h/2);ctx.scale(k,k);ctx.translate(-w/2,-h/2);
  withA(ctx,clamp(a*2,0,1),()=>{wc_panel(ctx,0,0,w,h,{kind:"card",wash:GV_CLASS.direct,washA:0.14,seed:291});gv_pin(ctx,w/2,16,GV.red,1.2);
    wc_T(ctx,"policy · column mask",32,62,{w:700,size:28,col:WC_MUTED});wc_T(ctx,"mask_direct_personal_data",32,110,{w:500,size:30,f:"mono",col:WC_DARK});
    wc_T(ctx,"on catalog university · when tagged direct",32,152,{w:600,size:28,col:WC_INK});
    if(o.lock>0.01)gc_padlock(ctx,w-50,64,1.4,o.lock);});ctx.restore();}
// tomorrow's table, sketched in pencil in front of the catalog: its name, and one row, its email tagged as it's built (o.tag) and masked
// (o.mask); its slot in prod_marts, dashed, joined to it
function gc_newTable(ctx,t,o){o=o||{};const a=clamp(o.a||0,0,1);if(a<=0.01)return;const x=1000,y=300,w=760,h=246,e=easeCam(a);
  ctx.save();ctx.translate(80*(1-e),0);withA(ctx,clamp(a*2,0,1),()=>{ctx.fillStyle=rgba(WC_CARD,1);ctx.fillRect(x+3,y+3,w-6,h-6);wc_panel(ctx,x,y,w,h,{kind:"card",dashed:true,seed:311});
    wc_T(ctx,"mart_alumni__contacts",x+34,y+58,{w:500,size:30,f:"mono",col:WC_DARK});wc_hand(ctx,"built tomorrow",x+w-30,y+58,{size:32,w:700,align:"right",col:WC_PENCIL});
    ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(x+24,y+82,w-48,2);ctx.restore();
    wc_T(ctx,"email",x+34,y+132,{w:500,size:28,f:"mono",col:WC_MUTED});
    gc_tag(ctx,x+34+gu_mw(ctx,"email")/2,y+138,x+34+gu_mw(ctx,"email")+30,y+122,"direct",clamp(o.tag||0,0,1));
    const mk=clamp(o.mask||0,0,1);if(mk<1)wc_T(ctx,"lucas.martin@mail.example",x+34,y+204,{w:500,size:28,f:"mono",col:WC_INK,deco:mk>0?1:0});
    if(mk>0)gv_mask(ctx,x+20,y+166,470,52,mk,{size:28});});ctx.restore();}

/* ---------- laid out by area ---------- */
// The Discover page, drawn as a form: a tile for each area, from each model's domain, with its tables. o.tile[k] (0 to 1) brings tile k
// in, its name; o.fill[k] its tables; o.lit[k] a gold wash as it's named. Long names are shortened with "…"
const GC_AREAS=[["Student",["core_learner_v1","core_credential_v2","core_credential_v1","core_credit_towards_award_v1"]],["Course",["core_award_v1"]],
  ["Planning",["mart_planning__near_award"]],["Finance",["mart_finance__tuition_…"]],["Learning",["mart_learning__enrolments_…"]],["Wallet",["mart_wallet__learners","mart_wallet__credentials"]]];
const gc_tileAt=k=>[150+(k%3)*542,290+Math.floor(k/3)*282,514,256];
function gc_discover(ctx,t,o){o=o||{};const [X,Y,Wd,Hd]=GU_BIG;gu_page(ctx,X,Y,Wd,Hd,{bar:"Databricks · Discover",title:"Discover",sub:"the university's data, by area"});
  GC_AREAS.forEach(([s,tabs],k)=>{const u=clamp((o.tile||[])[k]||0,0,1);if(u<=0.01)return;const [x,y,w,h]=gc_tileAt(k),kk=0.94+0.06*spring(u),L=clamp((o.lit||[])[k]||0,0,1);
    ctx.save();ctx.translate(x+w/2,y+h/2);ctx.scale(kk,kk);ctx.translate(-x-w/2,-y-h/2);withA(ctx,clamp(u*2,0,1),()=>{if(L>0.01)gv_halo(ctx,x-20,y-20,w+40,h+40,GV.gold,0.7*L);
      wc_panel(ctx,x,y,w,h,{kind:"card",seed:330+k});if(L>0.01)gv_tint(ctx,x+8,y+8,w-16,h-16,GV.gold,0.45*L);wc_T(ctx,s,x+28,y+58,{w:800,size:36,col:WC_DARK});
      const f=clamp((o.fill||[])[k]||0,0,1);tabs.forEach((n,j)=>{const v=clamp(f*tabs.length-j,0,1);if(v>0.01)wc_T(ctx,n,x+28,y+106+j*40,{w:500,size:28,f:"mono",col:WC_INK,a:v});});});ctx.restore();});}
// the learner table's YAML, its owner and domain: the domain lit as it's named (lit), on a sheet coming up as u goes 0 to 1; returns its rows
const GC_DOM=[{n:3,s:"  - name: core_learner"},{fold:1},{n:8,s:"    config:"},{n:9,s:"      meta:"},{n:11,s:"        owner: Mei Tanaka, registrar's office"},{n:12,s:"        domain: student"}];
function gc_domainSheet(ctx,u,lit){if(u<=0.01)return null;const e=easeCam(clamp(u,0,1));return gu_file(ctx,760,lerp(H+60,470,e),1000,{path:"models/core/student/_core_student__models.yml",lang:"yaml",
  lines:GC_DOM.map((r,i)=>i===5?Object.assign({},r,{lit}):r),rot:0.006});}
// a tag with no value, only its name, tied to a table (the area): a paper tag on a string
function gc_keyOnly(ctx,x,y,s,u){if(u<=0.01)return;const k=lerp(1.2,1,spring(clamp(u,0,1)));ctx.save();ctx.translate(x,y);ctx.scale(k,k);
  withA(ctx,clamp(u*2,0,1),()=>wc_tag(ctx,0,0,s,{size:28,f:"mono",w:500,wash:GV.gold,washA:0.3,seed:341}));ctx.restore();}
// the learner table's grants, by group (o.rows[k], 0 to 1, brings row k): each a ring, the group's name, and SELECT. o.clara (0 to 1):
// her name card comes to be a row of its own, and (o.off, 0 to 1) slides off, crossed in red
const GC_GR=[["registrar_office"],["data_team"],["planning_learner_readers"]];
function gc_perms(ctx,t,o){o=o||{};gc_tablePage(ctx,{tab:3});const x=160;wc_T(ctx,"Principal",x+90,384,{w:700,size:28,col:WC_MUTED});wc_T(ctx,"Privilege",1180,384,{w:700,size:28,col:WC_MUTED});
  ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(150,404,1610,2);ctx.restore();
  GC_GR.forEach(([g],k)=>{const u=clamp((o.rows||[])[k]==null?1:o.rows[k],0,1);if(u<=0.01)return;const y=466+k*84,L=clamp((o.lit||[])[k]||0,0,1);
    withA(ctx,clamp(u*2,0,1),()=>{if(L>0.01)gv_tint(ctx,150,y-42,1610,64,GV.gold,0.6*L);ctx.save();ctx.strokeStyle=rgba([120,126,140],0.95);ctx.lineWidth=4;ctx.beginPath();ctx.arc(x+34,y-10,20,0,TAU);ctx.stroke();ctx.restore();
      wc_T(ctx,g,x+90,y,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,"SELECT",1180,y,{w:500,size:30,f:"mono",col:WC_INK});
      if(o.strike&&o.strike[k]>0.01){ctx.save();ctx.strokeStyle=rgba(GV.redInk,0.85);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+80,y-10);ctx.lineTo(x+80+(1240)*easeCam(clamp(o.strike[k],0,1)),y-10);ctx.stroke();ctx.restore();}});});
  const c=clamp(o.clara||0,0,1),off=clamp(o.off||0,0,1);if(c>0.01){const y=466+(o.claraAt==null?3:o.claraAt)*84,dx=lerp(260,0,easeCam(c))+off*off*900,a=clamp(c*2,0,1)*(1-clamp(off*1.6-0.4,0,1));
    withA(ctx,a,()=>{gu_nameCard(ctx,x+90+dx,y-66,"Clara Jensen","Planning",1);wc_cross(ctx,x+470+dx,y-10,56,GV.redInk,clamp(off*3,0,1));});}}

/* ---------- a tag from the class ---------- */
// the learner table's columns in its YAML, each saying whether it identifies a person (o.lit[k], 0 to 1), its chip beside it from at[k]
const GC_CLS=[{n:44,s:"      - name: learner_key"},{n:49,s:"          meta: {glossary_term: learner, personal_data: pseudonymous}",cls:"pseudonymous"},
  {n:50,s:"      - name: learner_bk"},{n:55,s:"          meta: {personal_data: direct}",cls:"direct"},{fold:1},{n:79,s:"      - name: email"},
  {n:83,s:"          meta: {personal_data: direct}",cls:"direct"},{n:84,s:"      - name: status"},{fold:1},{n:91,s:"        config: {meta: {personal_data: none}}",cls:"none"}];
function gc_classSheet(ctx,t,u,lit,at){if(u<=0.01)return null;const e=easeCam(clamp(u,0,1)),y=lerp(H+60,60,e);let k=0;
  const ks=GC_CLS.map(r=>r.cls?k++:-1),L=lit||[],lines=GC_CLS.map((r,i)=>ks[i]>=0?Object.assign({},r,{lit:L[r.cls==="direct"?0:r.cls==="pseudonymous"?1:2]||0}):r),
    R=gu_file(ctx,70,y,1780,{path:"models/core/student/_core_student__models.yml",lang:"yaml",lines});
  GC_CLS.forEach((r,i)=>{if(ks[i]<0||!at)return;gv_classChipAt(ctx,t,at[r.cls==="direct"?0:r.cls==="pseudonymous"?1:2],R.tx+gu_mw(ctx,r.s)+30,R.rows[i],r.cls);});return R;}
// what writes it: the post-hook in dbt_project.yml (o.hook lights it), and the macro's line that tags each column (o.tag lights it),
// and what that line runs for the learner's email (o.runs, 0 to 1)
const GC_HOOK=[{n:78,s:"    # Databricks only: each column's class as a Unity Catalog tag, …"},{n:79,s:"    # … and each table's area (DEC-PRJ-15)."},
  {n:80,s:"    +post-hook: [\"{{ apply_personal_data() }}\", \"{{ apply_domain_tag() }}\"]"}];
const GC_MAC=[{n:29,s:"{% macro apply_personal_data() -%}"},{fold:1},{n:39,s:"{%- do statements.append(\"alter table \" ~ this ~ \" alter column \" ~ name"},
  {n:40,s:"                         ~ \" set tags ('personal_data' = '\" ~ class ~ \"')\") -%}"}];
function gc_macroSheets(ctx,o){o=o||{};const u1=clamp(o.u1==null?1:o.u1,0,1),u2=clamp(o.u2==null?1:o.u2,0,1);
  if(u1>0.01)gu_file(ctx,90,lerp(H+60,70,easeCam(u1)),1500,{path:"dbt_project.yml",lang:"yaml",lines:GC_HOOK.map((r,i)=>i===2?Object.assign({},r,{lit:o.hook||0}):r),rot:-0.006});
  if(u2>0.01){const R=gu_file(ctx,150,lerp(H+60,330,easeCam(u2)),1660,{path:"macros/governance/personal_data.sql",lines:GC_MAC.map((r,i)=>i>=2?Object.assign({},r,{lit:o.tag||0}):r),rot:0.004});
    const r=clamp(o.runs||0,0,1);if(r>0.01){const s="runs: alter table … core_learner_v1 alter column email set tags ('personal_data' = 'direct')",y=R.rows[3]+120;
      withA(ctx,clamp(r*2,0,1),()=>{wc_panel(ctx,150,y-44,1660,76,{kind:"card",wash:GV_CLASS.direct,washA:0.12,seed:351});
        wc_T(ctx,s.slice(0,Math.ceil(s.length*r)),180,y+6,{w:500,size:28,f:"mono",col:WC_DARK});});}}}
// the table's Columns tab: a row for each column, its type, and its tag (o.chip[k], 0 to 1, landing; o.from[k], where it flies from).
// A row may carry its own chip instead (o.cls[k]), and o.morph[k] (0 to 1) changes one class to another ([from, to])
const GC_CROWS=[["learner_key","pseudonymous"],["learner_bk","direct"],["full_name","direct"],["email","direct"],["status","none"]];
function gc_columns(ctx,t,o){o=o||{};gc_tablePage(ctx,{tab:1});const x=160,ty=384;[["Column",x],["Type",620],["Tags",900]].forEach(([s,cx])=>wc_T(ctx,s,cx,ty,{w:700,size:28,col:WC_MUTED}));
  ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(150,ty+20,1610,2);ctx.restore();
  GC_CROWS.forEach(([c,cls],k)=>{const y=ty+76+k*68,u=clamp((o.chip||[])[k]==null?1:o.chip[k],0,1);wc_T(ctx,c,x,y,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,"string",620,y,{w:500,size:28,f:"mono",col:WC_MUTED});
    if(u>0.01){withA(ctx,clamp(u*3,0,1),()=>wc_T(ctx,"personal_data",900,y,{w:500,size:28,f:"mono",col:WC_MUTED}));const tx=900+gu_mw(ctx,"personal_data")+24,fr=(o.from||[])[k],
        [px,py]=u<1&&fr?gc_along(fr,[tx,y-10],-160,easeCam(u)):[tx,y-10];gc_tag(ctx,u>=1?900+gu_mw(ctx,"personal_data")+4:null,y-10,px,py,cls,u);}});}
// the governed tag's page: its name, who made it, its three allowed values, and a padlock; "maybe" tries it (o.try, 0 to 1) and is refused
// (o.no, 0 to 1); o.vals lights the values
function gc_govTag(ctx,t,o){o=o||{};const [X,Y,Wd,Hd]=GU_BIG;gu_page(ctx,X,Y,Wd,Hd,{bar:"Databricks · Unity Catalog · governed tags",title:"personal_data",sub:"governed tag · created once by an account admin"});
  const L=clamp(o.vals||0,0,1);wc_T(ctx,"Allowed values",160,330,{w:800,size:32,col:WC_DARK});if(L>0.01)gv_tint(ctx,150,356,860,96,GV.gold,0.45*L);
  let x=180;["direct","pseudonymous","none"].forEach((c,k)=>{const w=gv_classChip(ctx,x,404,c,{size:30});x+=w+28;});
  gc_padlock(ctx,1120,412,2.6,clamp(o.lock==null?1:o.lock,0,1));
  // "maybe" flies to the end of the row, is crossed out, shakes, and drops away; the refusal is written under the row
  const tr=clamp(o.try||0,0,1),no=clamp(o.no||0,0,1);if(tr>0.01){const e=easeCam(tr),sh=Math.sin(no*Math.PI*6)*12*(1-clamp(no/0.4,0,1)),dr=Math.pow(clamp((no-0.4)/0.6,0,1),2),
      px=lerp(1500,x+20,e)+sh,py=lerp(700,418,e)+dr*150;
    withA(ctx,clamp(tr*2,0,1)*(1-clamp((no-0.55)/0.45,0,1)),()=>{wc_panel(ctx,px-20,py-50,220,72,{kind:"chip",dashed:true,seed:361});wc_hand(ctx,"maybe",px+90,py-2,{size:36,w:700,align:"center",col:WC_PENCIL});
      if(no>0.01)wc_cross(ctx,px+90,py-14,56,GV.redInk,clamp(no*3,0,1));});
    if(no>0.01)withA(ctx,clamp(no*2-0.4,0,1),()=>wc_T(ctx,"not an allowed value",180,530,{w:800,size:32,col:GV.redInk}));}}
// a worked example: a column added as none, changed to direct in the project (o.ch, 0 to 1), and the next build changing its tag on the
// platform (o.next, 0 to 1); a pencil arrow from one to the other (o.arrow)
function gc_change(ctx,t,o){o=o||{};const ch=clamp(o.ch||0,0,1);
  gu_file(ctx,90,150,1060,{path:"models/core/student/_core_student__models.yml",lang:"yaml",lines:[{s:"      - name: mobile",add:1},{s:"        config: {meta: {personal_data: none}}",del:ch>0.5?1:0,add:ch>0.5?0:1,dA:1},
    {s:"        config: {meta: {personal_data: direct}}",add:1,p:clamp(ch*2-1,0,1),lit:clamp(ch*2-1.4,0,1)}],rot:-0.006});
  wc_hand(ctx,"a sketch",120,450,{size:32,w:700,col:WC_PENCIL});
  const nx=clamp(o.next||0,0,1),x=1250,y=180,w=560,h=330;wc_panel(ctx,x,y,w,h,{kind:"card",seed:371});wc_T(ctx,"Databricks · Unity Catalog",x+30,y+52,{w:700,size:28,col:WC_MUTED});
  wc_T(ctx,"core_learner_v1",x+30,y+110,{w:500,size:30,f:"mono",col:WC_DARK});ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(x+24,y+136,w-48,2);ctx.restore();
  wc_T(ctx,"mobile",x+30,y+196,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,"personal_data",x+30,y+262,{w:500,size:28,f:"mono",col:WC_MUTED});
  const cx=x+30+gu_mw(ctx,"personal_data")+20;if(nx<0.5)withA(ctx,1-clamp(nx*2.2,0,1)*0.9,()=>gv_classChip(ctx,cx,y+252,"none"));
  if(nx>0.4){const k=lerp(1.25,1,spring(clamp((nx-0.4)*2,0,1)));ctx.save();ctx.translate(cx,y+252);ctx.scale(k,k);withA(ctx,clamp((nx-0.4)*3,0,1),()=>gv_classChip(ctx,0,0,"direct"));ctx.restore();}
  gc_arrow(ctx,[1030,330],[x-20,y+250],-80,clamp(o.arrow||0,0,1),{col:GU_CYAN,lw:5});withA(ctx,clamp((o.arrow||0)*2-1,0,1),()=>wc_hand(ctx,"the next build",1100,480,{size:32,w:700,align:"center",col:GU_CYAN}));}
// a table from outside the project, uploaded: its columns, the classifier's suggestion for one (o.sug, 0 to 1), its owner (o.own), and
// the owner's class (o.cls, 0 to 1)
function gc_survey(ctx,t,o){o=o||{};gc_tablePage(ctx,{title:"short_course_survey",sub:"university · uploads · not built by the project",tab:1});const x=160,ty=384;
  [["Column",x],["Type",620],["Tags",900]].forEach(([s,cx])=>wc_T(ctx,s,cx,ty,{w:700,size:28,col:WC_MUTED}));ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(150,ty+20,1610,2);ctx.restore();
  [["submitted_on","date"],["course_code","string"],["contact","string"]].forEach(([c,ty_],k)=>{const y=ty+76+k*68;wc_T(ctx,c,x,y,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,ty_,620,y,{w:500,size:28,f:"mono",col:WC_MUTED});});
  const y=ty+76+2*68,sg=clamp(o.sug||0,0,1),cl=clamp(o.cls||0,0,1);gc_redQ(ctx,x+gu_mw(ctx,"contact")+34,y+4,48,sg*(1-cl));
  if(sg>0.01&&cl<0.5)withA(ctx,clamp(sg*2,0,1)*(1-cl*2),()=>{const s="Data Classification · email address · suggested",w=Math.round(tw(ctx,s,28,600)+44);wc_panel(ctx,900,y-36,w,52,{kind:"chip",dashed:true,role:GU_CYAN,seed:381});
    wc_T(ctx,s,922,y,{w:600,size:28,col:GU_CYAN});});
  gu_nameCard(ctx,900,ty+260,"Tom Whitfield","owns it · short courses",clamp(o.own||0,0,1));
  if(o.own>0.5)withA(ctx,clamp((o.own-0.5)*2,0,1),()=>{wc_panel(ctx,1390,ty+282,200,64,{kind:"pill",wash:GV.gold,washA:0.4,seed:382});wc_T(ctx,"class it",1490,ty+324,{w:800,size:30,align:"center",col:WC_DARK});});
  if(cl>0.01){const k=lerp(1.25,1,spring(cl));ctx.save();ctx.translate(900,y-10);ctx.scale(k,k);withA(ctx,clamp(cl*2,0,1),()=>{wc_T(ctx,"personal_data",0,10,{w:500,size:28,f:"mono",col:WC_MUTED});
    gv_classChip(ctx,gu_mw(ctx,"personal_data")+24,0,"direct");});ctx.restore();}}

/* ---------- one policy, by tag ---------- */
// the policy's page, drawn as a form: its name; what it does; to whom, and who is left out; when it applies; the mask it uses. o.lit[k]
// (0 to 1) lights field k; o.kind (0 to 1, then back) lights "row filter", the other kind, greyed; o.who, a note on who the readers are
const GC_POL=[["applies to","account users"],["except","personal_data_readers"],["when","has_tag_value('personal_data', 'direct')"],["mask","university.prod.mask_personal_data"]];
function gc_policy(ctx,t,o){o=o||{};const [X,Y,Wd,Hd]=GU_BIG,L=o.lit||[];gu_page(ctx,X,Y,Wd,Hd,{bar:"Databricks · Unity Catalog · policy",title:"mask_direct_personal_data",titleSize:40,
    sub:"on catalog university · for every table in it, now and to come"});
  if((o.sub||0)>0.01)gv_tint(ctx,150,196,tw(ctx,"on catalog university · for every table in it, now and to come",28,600)+20,40,GV.gold,0.8*o.sub);
  const ky=318,kd=clamp(o.kind||0,0,1);wc_T(ctx,"Kind",160,ky,{w:700,size:28,col:WC_MUTED});
  const p1=Math.round(tw(ctx,"column mask",28,700)+48);wc_panel(ctx,330,ky-36,p1,52,{kind:"pill",fill:GV_CLASS.direct,seed:391});wc_T(ctx,"column mask",354,ky,{w:700,size:28,col:[255,255,255]});
  const p2=Math.round(tw(ctx,"row filter",28,700)+48);withA(ctx,0.55+0.45*kd,()=>{wc_panel(ctx,330+p1+24,ky-36,p2,52,{kind:"pill",dashed:true,seed:392});wc_T(ctx,"row filter",354+p1+24,ky,{w:700,size:28,col:WC_MUTED});});
  if(kd>0.01)gv_halo(ctx,330+p1+4,ky-56,p2+40,92,GV.grey,0.8*kd);
  GC_POL.forEach(([l,v],k)=>{const y=420+k*104,lt=clamp(L[k]||0,0,1);if(lt>0.01)gv_tint(ctx,150,y-50,1610,86,GV.gold,0.5*lt);wc_T(ctx,l,160,y,{w:700,size:30,col:WC_MUTED});
    ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.55);ctx.lineWidth=2;ctx.strokeRect(420,y-40,1320,62);ctx.restore();wc_T(ctx,v,444,y+2,{w:500,size:30,f:"mono",col:WC_DARK});});
  const wh=clamp(o.who||0,0,1);if(wh>0.01)withA(ctx,wh,()=>wc_hand(ctx,"the registrar's office, and the build",1720,524+48,{size:30,w:700,align:"right",col:GV.goldInk,p:wh}));}
// a query and its result, on a big screen: whose it is, the query, and the rows. o.masked: names, emails and student numbers as bands
// (o.mask, 0 to 1); o.lit[k] lights column k's values; the rows come in as o.rows goes 0 to 1
const GC_QCOLS=[["learner_key",160],["status",500],["full_name",780],["email",1110]];
const GC_QROWS=[["0905e6e2…","completed","Aisha Karimi","aisha.k@mail.example"],["1364b7f6…","studying","Jie Chen","jie.chen@mail.example"],["4d0508d9…","studying","Omar Haddad","omar.haddad@mail.example"]];
function gc_query(ctx,t,o){o=o||{};const [X,Y,Wd,Hd]=GU_BIG;gu_page(ctx,X,Y,Wd,Hd,{bar:"Databricks · SQL editor",title:o.title,sub:o.sub});
  gu_box(ctx,150,270,1620,200,null,{seed:401});["select learner_key, status, full_name, email","from university.prod_core.core_learner_v1","where is_current"].forEach((s,i)=>wc_T(ctx,s,180,326+i*46,{w:500,size:30,f:"mono",col:WC_DARK}));
  const rw=clamp(o.rows==null?1:o.rows,0,1);if(rw<=0.01)return;gu_box(ctx,150,494,1620,330,null,{seed:402});
  GC_QCOLS.forEach(([c,x])=>wc_T(ctx,c,x,552,{w:500,size:28,f:"mono",col:WC_MUTED}));ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(170,574,1580,2);ctx.restore();
  GC_QROWS.forEach((r,i)=>{const v=clamp(rw*3-i,0,1);if(v<=0.01)return;const y=632+i*62;withA(ctx,v,()=>GC_QCOLS.forEach(([c,x],k)=>{const L=clamp((o.lit||[])[k]||0,0,1);
    const mk=o.masked&&k>=2?clamp((o.mask==null?1:o.mask)*1.6-i*0.2,0,1):0;if(L>0.01){if(mk>0)gv_tint(ctx,x-22,y-41,(k===2?300:620)+16,58,GV.gold,0.8*L);else gv_tint(ctx,x-12,y-34,gu_mw(ctx,r[k])+24,46,GV.gold,0.8*L);}
    if(mk<1)wc_T(ctx,r[k],x,y,{w:500,size:28,f:"mono",col:WC_INK,deco:mk>0?1:0});if(mk>0)gv_mask(ctx,x-14,y-38,k===2?300:620,52,mk,{size:28});}));});}
// the build's identity, on a card: dbt's service principal, in the readers' group
function gc_buildCard(ctx,x,y,a){if(a<=0.01)return;const w=560,h=150;ctx.save();ctx.translate(0,20*(1-a));withA(ctx,a,()=>{wc_panel(ctx,x,y,w,h,{kind:"card",role:WC_SIDE.tech,sw:300,seed:411});
  wc_T(ctx,"the build's identity",x+32,y+56,{w:800,size:32,col:WC_DARK});wc_T(ctx,"in personal_data_readers",x+32,y+110,{w:500,size:28,f:"mono",col:WC_INK});});ctx.restore();}

/* ---------- the scrambled key ---------- */
// The learner code, as the example project makes it: the sha-256 of the student number, with its system's prefix, as 64 hex characters.
// A machine drawn in pencil takes the number in (o.in, 0 to 1) and gives the key out (o.out); the same key in three tables (o.tables,
// lit by o.same) joined by a pencil line (o.join); "anonymous" struck through (o.anon)
const GC_K17="0905e6e2b60bd76bfa5c6d3ed43ac6a4d55cf046c2c0cbce4c590300145f76a2";
function gc_machine(ctx,x,y,s,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);const P=WC_PENCIL;
  wc_wash(ctx,wc_rrPts(0,0,360,240,18),[226,222,212],{kind:"swatch",a:0.7,seed:421,line:false});ctx.strokeStyle=rgba(P,0.9);ctx.lineWidth=4;ctx.lineJoin="round";ctx.lineCap="round";
  wc_tr(ctx,wc_rrPts(0,0,360,240,18));ctx.stroke();ctx.beginPath();ctx.moveTo(-70,20);ctx.lineTo(0,70);ctx.moveTo(-70,170);ctx.lineTo(0,120);ctx.stroke();
  ctx.beginPath();ctx.moveTo(360,100);ctx.lineTo(400,100);ctx.moveTo(360,140);ctx.lineTo(400,140);ctx.stroke();
  for(const [gx,gy,r] of [[120,150,40],[214,128,30]]){ctx.beginPath();ctx.arc(gx,gy,r,0,TAU);ctx.stroke();for(let i=0;i<8;i++){const an=i/8*TAU;ctx.beginPath();ctx.moveTo(gx+Math.cos(an)*r,gy+Math.sin(an)*r);ctx.lineTo(gx+Math.cos(an)*(r+10),gy+Math.sin(an)*(r+10));ctx.stroke();}}
  wc_hand(ctx,"sha-256",180,62,{size:40,w:700,align:"center",col:P});ctx.restore();});}
function gc_scramble(ctx,t,o){o=o||{};gc_machine(ctx,700,170,1,1);const inn=clamp(o.in||0,0,1),out=clamp(o.out||0,0,1);
  if(inn>0.01){const e=easeCam(inn),x=lerp(120,560,e),a=1-clamp((inn-0.85)*7,0,1);withA(ctx,a,()=>{wc_panel(ctx,x-20,232,340,84,{kind:"card",seed:431});wc_T(ctx,"SIS|S-20417",x+10,288,{w:500,size:34,f:"mono",col:WC_DARK});});
    if(inn<0.2)wc_T(ctx,"the student number",x+10,370,{w:600,size:28,col:WC_MUTED,a:1-inn*5});}
  if(out>0.01){const e=easeCam(out),cw=Math.round(gu_mw(ctx,GC_K17.slice(0,32),30)+60);ctx.save();ctx.beginPath();ctx.rect(1100,180,cw*e+20,200);ctx.clip();
    wc_panel(ctx,1110,196,cw,136,{kind:"card",wash:GV_CLASS.pseudonymous,washA:0.28,seed:432});wc_T(ctx,GC_K17.slice(0,32),1140,250,{w:500,size:30,f:"mono",col:WC_DARK});wc_T(ctx,GC_K17.slice(32),1140,300,{w:500,size:30,f:"mono",col:WC_DARK});ctx.restore();
    withA(ctx,clamp(out*2-1,0,1),()=>{wc_T(ctx,"learner_key",1110,170,{w:500,size:28,f:"mono",col:WC_MUTED});gv_classChip(ctx,1110+gu_mw(ctx,"learner_key")+20,160,"pseudonymous");});}
  const an=clamp(o.anon||0,0,1);if(an>0.01){withA(ctx,clamp(an*3,0,1),()=>wc_hand(ctx,"anonymous",1400,420,{size:44,w:700,align:"center",col:WC_PENCIL}));
    ctx.save();ctx.strokeStyle=rgba(GV.redInk,0.9);ctx.lineWidth=6;ctx.lineCap="round";const w=tw(ctx,"anonymous",44,700)+20;ctx.beginPath();ctx.moveTo(1400-w/2,408);
    ctx.lineTo(1400-w/2+w*easeCam(clamp(an*2-0.6,0,1)),402);ctx.stroke();ctx.restore();}
  const tb=o.tables||0,sm=clamp(o.same||0,0,1);[["core_learner_v1",160],["core_credential_v2",700],["mart_planning__near_award",1240]].forEach(([n,x],k)=>{const v=clamp(tb*3-k,0,1);if(v<=0.01)return;
    ctx.save();ctx.translate(0,30*(1-easeCam(v)));withA(ctx,v,()=>{wc_panel(ctx,x,560,520,170,{kind:"card",seed:441+k});wc_T(ctx,n,x+28,612,{w:500,size:28,f:"mono",col:WC_DARK});
      if(sm>0.01)gv_tint(ctx,x+16,640,gu_mw(ctx,"0905e6e2b60bd76b…")+24,46,GV.gold,0.9*sm);wc_T(ctx,"0905e6e2b60bd76b…",x+28,674,{w:500,size:28,f:"mono",col:WC_INK});});ctx.restore();});
  const jn=clamp(o.join||0,0,1);if(jn>0.01){gc_arrow(ctx,[480,740],[760,740],50,clamp(jn*2,0,1),{head:false,col:GV.goldInk,lw:4});gc_arrow(ctx,[1020,740],[1300,740],50,clamp(jn*2-1,0,1),{head:false,col:GV.goldInk,lw:4});
    withA(ctx,clamp(jn*2-1,0,1),()=>wc_hand(ctx,"joined, without names",960,840,{size:34,w:700,align:"center",col:GV.goldInk}));}}
// the registrar's list: student numbers on paper; each goes through the machine (o.run, 0 to 1) and comes out scrambled; the third
// matches the code in a row Clara sees (o.match, 0 to 1), and a pencil line joins it to who that is (o.who)
const GC_LIST=[["S-20415","9e64382f…"],["S-20416","ee1f1641…"],["S-20417","0905e6e2…"],["S-20418","1364b7f6…"],["S-20419","4d0508d9…"]];
function gc_regList(ctx,t,o){o=o||{};gv_sheet(ctx,110,110,420,620,{rot:-0.01});wc_T(ctx,"The registrar's list",140,180,{w:800,size:32,col:WC_DARK});
  wc_T(ctx,"student number",140,232,{w:600,size:28,col:WC_MUTED});ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(136,250,370,2);ctx.restore();
  gc_machine(ctx,700,250,0.7,1);const run=o.run||0,mt=clamp(o.match||0,0,1);
  GC_LIST.forEach(([n,k],i)=>{const y=310+i*76,v=clamp(run*GC_LIST.length-i,0,1),m=i===2?mt:0;wc_T(ctx,n,150,y,{w:500,size:30,f:"mono",col:WC_DARK});
    if(v>0.01){const p=easeCam(v),dot=gc_along([340,y-10],[1120,y-10],-60,p);if(v<1){ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.8);ctx.beginPath();ctx.arc(dot[0],dot[1],6,0,TAU);ctx.fill();ctx.restore();}
      withA(ctx,clamp(v*2-1,0,1),()=>{if(m>0.01)gv_tint(ctx,1118,y-34,gu_mw(ctx,k)+24,46,GV.gold,0.9*m);wc_T(ctx,k,1130,y,{w:500,size:30,f:"mono",col:WC_INK});});}});
  withA(ctx,1,()=>{wc_panel(ctx,1480,240,330,150,{kind:"card",wash:GV.green,washA:0.1,seed:451});wc_T(ctx,"a row Clara sees",1510,292,{w:700,size:28,col:WC_MUTED});wc_T(ctx,"0905e6e2…",1510,350,{w:500,size:30,f:"mono",col:WC_DARK});
    if(mt>0.01)gv_tint(ctx,1498,316,gu_mw(ctx,"0905e6e2…",30)+24,46,GV.gold,0.9*mt);});
  if(mt>0.01)gc_arrow(ctx,[1290,452],[1500,380],40,clamp(mt*1.6,0,1),{head:false,col:GV.goldInk,lw:4});
  const wh=clamp(o.who||0,0,1);if(wh>0.01){gc_arrow(ctx,[1640,400],[1640,520],0,clamp(wh*2,0,1),{col:GV.redInk,lw:4});gu_nameCard(ctx,1500,540,"S-20417","Aisha Karimi",clamp(wh*2-0.6,0,1));}}
// Planning's list on its own page: the learners near an award, codes and no names, each counted as it's read (o.count, 0 to 1); the
// code's class, still personal (o.still); and what reading it takes, a purpose and an end date (o.card)
const GC_NEAR=[["0905e6e2…","GCDA","45","15"],["0abde902…","GCDA","45","15"],["66efb51c…","MDA","110","10"],["8cb33ef0…","GCDA","45","15"],["372b5006…","GCHI","45","15"]],
  GC_NC=[["learner_key",160],["award",560],["credit held",780],["to go",1040]];
function gc_nearList(ctx,t,o){o=o||{};gc_tablePage(ctx,{title:"mart_planning__near_award",titleSize:40,sub:"university · prod_marts · table"});
  GC_NC.forEach(([c,x])=>wc_T(ctx,c,x,384,{w:500,size:28,f:"mono",col:WC_MUTED}));ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(150,404,1610,2);ctx.restore();
  GC_NEAR.forEach((r,i)=>{const y=460+i*60;r.forEach((v,j)=>wc_T(ctx,v,GC_NC[j][1],y,{w:500,size:28,f:"mono",col:WC_INK}));const c=clamp((o.count||0)*5-i,0,1);if(c>0.01)wc_tick(ctx,1190,y-10,34,GV.greenInk,c,5);});
  const n=Math.round(clamp(o.count||0,0,1)*5);if(n>0)wc_hand(ctx,n+" counted",1150,784,{size:34,w:700,col:GV.greenInk});
  const st=clamp(o.still||0,0,1);if(st>0.01)withA(ctx,st,()=>{const w=gv_classChip(ctx,160,772,"pseudonymous");wc_hand(ctx,"still personal",160+w+28,784,{size:32,w:700,col:GV_CLASSINK.pseudonymous});});
  const cd=clamp(o.card||0,0,1);if(cd>0.01){const x=1290,y=420,w=470,h=200,k=lerp(1.2,1,spring(cd));ctx.save();ctx.translate(x+w/2,y+h/2);ctx.scale(k,k);ctx.translate(-w/2,-h/2);
    withA(ctx,clamp(cd*2,0,1),()=>{wc_panel(ctx,0,0,w,h,{kind:"card",wash:GV.gold,washA:0.2,seed:461});gv_pin(ctx,w/2,16,GV.gold,1.2);wc_T(ctx,"to plan next term's places",30,80,{w:700,size:30,col:WC_DARK});
      wc_T(ctx,"until 15 Dec 2026",30,136,{w:800,size:32,col:GV.goldInk});});ctx.restore();}}

/* ---------- groups, with an end date ---------- */
// the registrar's desk from above, for the papers Mei signs: the oak of her desk, the tray of certificates and a pot of pens at the far
// edge, her keyboard's edge, the office's stamp on its pad of red ink and a mug at the near corners (as Who may see it painted it)
function gc_paintRegTop(ctx){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,H+80),GV.oak,{kind:"plaster",line:false,seed:57});
  ctx.save();ctx.globalCompositeOperation="multiply";const R=wc_rng(11);for(let i=0;i<70;i++){const y=R()*H;ctx.strokeStyle=rgba(wc_dim(GV.oak,0.2+R()*0.12),0.18+R()*0.14);ctx.lineWidth=1+R()*2.4;
    ctx.beginPath();ctx.moveTo(-20,y);for(let x=0;x<=W+40;x+=80)ctx.lineTo(x,y+6*Math.sin(x/300+i)+3*Math.sin(x/90+i*2));ctx.stroke();}ctx.restore();
  wc_part(ctx,wc_rect(30,-40,340,200),[150,156,168],1,{lw:1.3,seed:58});[[248,240,220],[176,40,34],[248,240,220],[96,118,150]].forEach((c,i)=>wc_flat(ctx,wc_rect(48+i*8,-30+i*10,300,150),c,1,"folder"));
  wc_wash(ctx,wc_ell(1840,110,46,46,30),[96,118,150],{kind:"thing",lw:1.4});for(const [px,py,c] of [[-14,-8,[60,60,70]],[10,-14,[204,62,50]],[4,14,[60,60,70]]])wc_wash(ctx,wc_ell(1840+px,110+py,9,9,12),c,{kind:"thing",line:false});
  wc_part(ctx,wc_rect(1180,-40,460,120),[226,228,234],1);for(let i=0;i<9;i++)for(let j=0;j<2;j++)wc_flat(ctx,wc_rect(1196+i*48,-24+j*44,40,36),[244,245,248],1,"key");
  wc_part(ctx,wc_rrPts(1600,800,190,110,12),[70,72,80],1,{seed:59});wc_flat(ctx,wc_rect(1614,814,162,82),[176,40,34],1,"ink");
  wc_part(ctx,wc_rect(1818,822,84,70),[60,52,48],1,{seed:60});wc_wash(ctx,wc_ell(1860,857,28,28,24),[150,104,70],{kind:"thing",lw:1.2});
  wc_wash(ctx,wc_ell(170,950,82,82,40),[226,214,190],{kind:"thing",lw:1.6});wc_wash(ctx,wc_ell(170,950,62,62,40),[150,104,70],{kind:"thing",line:false});}
// Clara's request, on the university's form for access, as Who may see it filled it in: the table and its owner, who asks, what for, until
// when, and through which group; Mei's approval for her office, a gold tick and her name in her hand (ok, 0 to 1); o.hi(i) lights field i
const GC_RQ=[["from","Clara Jensen, Planning"],["for","next term's places"],["until","15 December 2026"],["through","a Planning group"]];
function gc_reqPaper(ctx,x,y,o){o=o||{};const w=1000,h=780;gv_sheet(ctx,x,y,w,h);
  wc_T(ctx,"Request for access",x+48,y+84,{w:800,size:44,col:WC_DARK});ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.45);ctx.fillRect(x+48,y+114,w-96,2);ctx.restore();
  wc_T(ctx,"learner table",x+48,y+180,{w:800,size:38,col:WC_DARK});wc_T(ctx,"owner: registrar's office",x+48,y+226,{w:600,size:30,col:WC_MUTED});
  GC_RQ.forEach(([l,v],i)=>{const by=y+266+i*78,hi=o.hi?o.hi(i):0;if(hi>0.01)gv_tint(ctx,x+36,by-6,w-72,70,[242,204,92],0.6*hi);
    ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.55);ctx.lineWidth=2;ctx.strokeRect(x+220,by,w-268,58);ctx.restore();
    wc_T(ctx,l+":",x+48,by+40,{w:600,size:30,col:WC_MUTED});wc_T(ctx,v,x+240,by+41,{w:600,size:34,col:WC_DARK});});
  const ok=o.ok||0;if(ok>0){wc_tick(ctx,x+84,y+640,54,GV.goldInk,clamp(ok*2,0,1),7);withA(ctx,clamp(ok*2-0.6,0,1),()=>wc_T(ctx,"approved by the registrar's office",x+140,y+654,{w:800,size:34,col:GV.goldInk}));
    wc_hand(ctx,"Mei Tanaka",x+144,y+720,{size:38,w:600,col:GV_SIGN.ink,p:clamp(ok*2-1,0,1)});}}
// The university's directory: a card index on the platform team's wall, a drawer for each group, its name on a brass holder; the data
// platform's rack beside it. Painted once; the cards, the names and the sync are drawn every frame
const GC_IX={x:150,y:250,w:1020,top:880,dr:[[175,300,470,220],[675,300,470,220],[175,560,470,220],[675,560,470,220]],rack:[1520,170,260,710]};
const GC_DRN=["registrar_office","data_team","planning_learner_readers","finance_analysts"];
function gc_paintIndex(ctx){const I=GC_IX,wall=GV_ROOM.plat;gv_wallFloor(ctx,wall,I.top,{seed:65,vx:900});gv_lightGlow(ctx,700,0,620);
  wc_part(ctx,wc_rect(I.x,I.y,I.w,I.top-I.y),[150,106,70],1,{seed:501});wc_part(ctx,wc_rect(I.x-14,I.y-26,I.w+28,30),[170,122,82],1,{seed:502});
  I.dr.forEach(([x,y,w,h],i)=>{wc_part(ctx,wc_rect(x,y,w,h),[196,152,104],1,{seed:510+i});wc_part(ctx,wc_rect(x+15,y+30,w-30,62),[204,170,96],1,{seed:520+i});
    wc_flat(ctx,wc_rect(x+22,y+36,w-44,50),[246,240,226],1,"card");wc_part(ctx,wc_rrPts(x+w/2-46,y+140,92,30,12),[184,150,80],1,{seed:530+i});});
  wc_part(ctx,wc_rect(I.x+30,I.top-90,I.w-60,90),[132,92,60],1,{seed:541});
  const [rx,ry,rw,rh]=I.rack;gv_rack(ctx,rx,ry,rw,rh,13);}
// the drawers' names, a card going into a drawer from above as u goes 0 to 1 (and coming out as u goes back), its name on it and, for
// Clara's, a date tag; the sync, a cyan arrow from the index to the platform (o.sync, 0 to 1, with o.pulse running along it)
function gc_card(ctx,i,name,u,o){o=o||{};if(u<=0.01)return;const [x,y,w]=GC_IX.dr[i],cx=x+w/2+(o.dx||0),e=easeCam(clamp(u,0,1)),top=y-62-120*(1-e)+(o.sink||0)*30,cw=300,ch=150;
  ctx.save();ctx.beginPath();ctx.rect(x-400,-200,w+800,y+2+200);ctx.clip();withA(ctx,clamp(u*2.5,0,1),()=>{wc_panel(ctx,cx-cw/2,top,cw,ch,{kind:"card",wash:o.wash,washA:0.25,seed:550+i});
    wc_T(ctx,name,cx,top+44,{w:700,size:30,align:"center",col:WC_DARK});});ctx.restore();
  if(o.date&&u>0.6)withA(ctx,clamp((u-0.6)*2.5,0,1),()=>{ctx.save();ctx.strokeStyle=rgba([150,128,92],0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx+cw/2-14,top+22);ctx.quadraticCurveTo(cx+cw/2+10,top+8,cx+cw/2+34,top+30);ctx.stroke();ctx.restore();
    wc_tag(ctx,cx+cw/2+34,top+30,o.date,{size:28,seed:561});});}
function gc_index(ctx,t,o){o=o||{};GC_DRN.forEach((s,i)=>{const [x,y,w]=GC_IX.dr[i],L=clamp((o.lit||[])[i]||0,0,1);if(L>0.01)gv_tint(ctx,x+22,y+36,w-44,50,GV.gold,0.8*L);
    wc_T(ctx,s,x+w/2,y+72,{w:500,size:28,f:"mono",align:"center",col:WC_DARK});});
  withA(ctx,1,()=>wc_tag(ctx,GC_IX.x+GC_IX.w/2,190,"the university's directory",{size:30,align:"center",seed:571}));
  const [rx,ry,rw]=GC_IX.rack;wc_tag(ctx,rx+rw/2,ry-36,"data platform",{size:30,align:"center",seed:572});
  const sy=clamp(o.sync||0,0,1);if(sy>0.01){gc_arrow(ctx,[GC_IX.x+GC_IX.w+20,330],[rx-24,330],-60,sy,{col:GU_CYAN,lw:6});withA(ctx,clamp(sy*2-1,0,1),()=>wc_hand(ctx,"sync",1345,270,{size:36,w:700,align:"center",col:GU_CYAN}));
    const pu=o.pulse||0;if(pu>0&&pu<1){const [px,py]=gc_along([GC_IX.x+GC_IX.w+20,330],[rx-24,330],-60,pu);ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,px,py,40,wc_lit(GU_CYAN,0.3),0.9);ctx.restore();}}}

/* ---------- down to the column ---------- */
// The lineage view, drawn as a form: the learner table in the middle with four of its columns; what it's built from at the left; what
// it flows into at the right. o.pick (0 to 1) lights the email and draws its thread to the wallet's email, both tagged direct; o.none,
// Planning's list's note; o.beta (0 to 1), a grey tag sliding along the thread
const GC_LN={up:[["int_learner_timeline",160,420],["int_learners",160,560]],mid:[640,400,450,["learner_key","full_name","email","status"]],
  down:[["mart_wallet__learners",1240,330,["learner_key","full_name","email"]],["mart_planning__near_award",1240,590,[]],["mart_finance__tuition_forgone",1240,720,[]]]};
function gc_lnBox(ctx,x,y,w,name,cols,o){o=o||{};const h=60+cols.length*46+(cols.length?14:0);wc_panel(ctx,x,y,w,h,{kind:"card",wash:o.wash,washA:0.15,seed:name.length+580});
  wc_T(ctx,name,x+24,y+42,{w:500,size:28,f:"mono",col:WC_DARK});if(cols.length){ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.25);ctx.fillRect(x+16,y+60,w-32,2);ctx.restore();}
  const rows=cols.map((c,i)=>{const cy=y+100+i*46,L=clamp((o.lit||{})[c]||0,0,1);if(L>0.01)gv_tint(ctx,x+12,cy-32,w-24,44,GV_CLASS.direct,0.55*L);wc_T(ctx,c,x+30,cy,{w:500,size:28,f:"mono",col:WC_INK});return cy;});
  return{h,rows};}
function gc_lineage(ctx,t,o){o=o||{};gc_tablePage(ctx,{tab:4,sub:"university · prod_core · lineage, down to the column"});const pk=clamp(o.pick||0,0,1),M=GC_LN.mid;
  const mb=gc_lnBox(ctx,M[0],M[1],M[2],"core_learner_v1",M[3],{lit:{email:pk}});
  GC_LN.up.forEach(([n,x,y])=>{gc_lnBox(ctx,x,y,400,n,[]);gc_arrow(ctx,[x+404,y+30],[M[0]-8,M[1]+60],0,1,{a:0.5,lw:3});});
  const dn=GC_LN.down.map(([n,x,y,cols],k)=>{const B=gc_lnBox(ctx,x,y,520,n,cols,{lit:k===0?{email:clamp(pk*1.6-0.6,0,1)}:{}});gc_arrow(ctx,[M[0]+M[2]+8,M[1]+60],[x-8,y+30],0,1,{a:0.5,lw:3});return B;});
  if(pk>0.01){const a=[M[0]+M[2]-30,mb.rows[2]-10],b=[1240+30,dn[0].rows[2]-10];gc_arrow(ctx,[M[0]+M[2],mb.rows[2]-10],[1240,dn[0].rows[2]-10],-40,clamp(pk*1.4-0.2,0,1),{col:GV_CLASSINK.direct,lw:5});
    gc_tag(ctx,null,0,M[0]+30+gu_mw(ctx,"email")+24,mb.rows[2]-10,"direct",clamp(pk*3,0,1));gc_tag(ctx,null,0,1270+gu_mw(ctx,"email")+24,dn[0].rows[2]-10,"direct",clamp(pk*2-1,0,1));
    // tags following lineage by themselves: a ghost of the chip travels to the wallet's email, under a fixed "beta" label
    const bt=clamp(o.beta||0,0,1);if(bt>0.01){withA(ctx,clamp(bt*4,0,1),()=>wc_tag(ctx,865,744,"tag propagation · beta",{size:28,align:"center",wash:GV.grey,washA:0.3,seed:591}));
      if(bt<1){const f=[M[0]+30+gu_mw(ctx,"email")+24,mb.rows[2]-10],to=[1270+gu_mw(ctx,"email")+24,dn[0].rows[2]-10],[px,py]=gc_along(f,to,-80,easeCam(clamp((bt-0.1)/0.7,0,1)));
        withA(ctx,0.45*Math.sin(clamp((bt-0.05)/0.9,0,1)*Math.PI),()=>gv_classChip(ctx,px,py,"direct"));}}}
  const nn=clamp(o.none||0,0,1);if(nn>0.01)withA(ctx,nn,()=>wc_hand(ctx,"no names or emails",1500,700,{size:30,w:700,align:"center",col:WC_PENCIL}));}
// the wallet's learners in its YAML: the email, classed there too (lit)
const GC_WAL=[{n:3,s:"  - name: mart_wallet__learners"},{fold:1},{n:33,s:"      - name: email"},{n:34,s:"        description: The learner's email, now."},{n:35,s:"        data_type: string"},
  {n:36,s:"        config:"},{n:37,s:"          meta: {personal_data: direct}"}];
function gc_walletSheet(ctx,u,lit){if(u<=0.01)return null;return gu_file(ctx,150,lerp(H+60,90,easeCam(clamp(u,0,1))),1100,{path:"models/marts/wallet/_wallet__models.yml",lang:"yaml",
  lines:GC_WAL.map((r,i)=>i===6?Object.assign({},r,{lit}):r),rot:-0.006});}
// a table sketched with an email nobody classed, and what the governance check says to it (o.err, 0 to 1, writes it)
const GC_ERR=["columns: models/marts/alumni/_alumni__models.yml: mart_alumni__events:","email has no meta.personal_data: say whether it identifies a person, with",
  "direct, pseudonymous or none (how to: docs/how-to/classify-a-column.md)"];
function gc_unclassed(ctx,t,o){o=o||{};const u=clamp(o.u||0,0,1);if(u<=0.01)return;const e=easeCam(u);
  ctx.save();ctx.translate(0,(1-e)*60);withA(ctx,clamp(u*2,0,1),()=>{wc_panel(ctx,120,90,900,240,{kind:"card",dashed:true,seed:601});wc_hand(ctx,"a sketch",990,140,{size:32,w:700,align:"right",col:WC_PENCIL});
    wc_T(ctx,"  - name: mart_alumni__events",150,150,{w:500,size:28,f:"mono",col:WC_DARK});wc_T(ctx,"      - name: email",150,210,{w:500,size:28,f:"mono",col:WC_DARK});
    wc_T(ctx,"        data_type: string",150,260,{w:500,size:28,f:"mono",col:WC_DARK});gc_redQ(ctx,150+gu_mw(ctx,"      - name: email")+40,214,46,clamp(o.q||0,0,1));});ctx.restore();
  const er=clamp(o.err||0,0,1);if(er>0.01){const R=gu_file(ctx,100,400,1720,{path:"$ python scripts/check/governance.py",lines:GC_ERR.map((s,i)=>({s,col:GV.redInk,p:clamp(er*3-i,0,1)}))});
    gu_light(ctx,1760,454,"fail",0,clamp(er*3,0,1));}}

/* ---------- who read this, and when ---------- */
// A query on the platform's system tables and its result: who read the learner table this month (the audit log, in preview), or which
// groups can read it (the access review). o.rows (0 to 1) brings the result; o.lit[k] lights row k; o.strike[k] crosses row k out, with
// its note; o.notes[k] (0 to 1), who's in each group
const GC_AUD={title:"Who read the learner table",sub:"analyses/governance/who_read_a_table.sql · compiled",pill:"system.access.audit · preview",
  q:["select event_time, user_identity.email","from system.access.audit","where action_name = 'getTable'","  and request_params.full_name_arg = 'university.prod_core.core_learner_v1'",
    "  and event_date >= date_trunc('month', current_date())","order by event_time"],head:[["event_time",180],["email",620]],
  rows:[["2026-10-26 08:02","5f2d8c1e-…","the build"],["2026-10-27 09:14","mei.tanaka@uni.example"],["2026-10-28 10:31","clara.jensen@uni.example"]]};
const GC_REV={title:"The access review",sub:"analyses/governance/access_review.sql · compiled",q:["select grantee, privilege_type","from system.information_schema.table_privileges",
    "where table_name = 'core_learner_v1'","  and table_schema = 'prod_core'","  and table_catalog = 'university'","order by grantee, privilege_type"],head:[["grantee",180],["privilege_type",760]],
  rows:[["data_team","SELECT","5 people, from the directory"],["planning_learner_readers","SELECT","nobody since 15 December"],["registrar_office","SELECT","10 people, from the directory"]]};
function gc_sql(ctx,t,Q,o){o=o||{};const [X,Y,Wd,Hd]=GU_BIG;gu_page(ctx,X,Y,Wd,Hd,{bar:"Databricks · SQL editor",title:Q.title,sub:Q.sub});
  if(Q.pill){const s=Q.pill,w=Math.round(tw(ctx,s,28,700)+44),x=1762-w;wc_panel(ctx,x,144,w,52,{kind:"pill",wash:GV.amber,washA:0.35,seed:611});wc_T(ctx,s,x+22,180,{w:700,size:28,col:WC_DARK});}
  gu_box(ctx,150,262,1620,Q.q.length*40+40,null,{seed:612});Q.q.forEach((s,i)=>wc_T(ctx,s,180,306+i*40,{w:500,size:28,f:"mono",col:WC_DARK}));
  const rw=clamp(o.rows==null?1:o.rows,0,1);if(rw<=0.01)return;const by=262+Q.q.length*40+60,bh=60+Q.rows.length*58+20;gu_box(ctx,150,by,1620,bh,null,{seed:613});
  Q.head.forEach(([c,x])=>wc_T(ctx,c,x,by+46,{w:500,size:28,f:"mono",col:WC_MUTED}));ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.3);ctx.fillRect(170,by+64,1580,2);ctx.restore();
  Q.rows.forEach((r,i)=>{const v=clamp(rw*Q.rows.length-i,0,1);if(v<=0.01)return;const y=by+114+i*58,L=clamp((o.lit||[])[i]||0,0,1),sk=clamp((o.strike||[])[i]||0,0,1),nt=clamp((o.notes||[])[i]||0,0,1);
    withA(ctx,v,()=>{if(L>0.01)gv_tint(ctx,166,y-38,1588,52,GV.gold,0.6*L);wc_T(ctx,r[0],Q.head[0][1],y,{w:500,size:28,f:"mono",col:sk>0.5?WC_MUTED:WC_INK});
      wc_T(ctx,r[1],Q.head[1][1],y,{w:500,size:28,f:"mono",col:sk>0.5?WC_MUTED:WC_INK});
      if(r[2]&&(Q===GC_AUD||nt>0.01))withA(ctx,Q===GC_AUD?1:nt,()=>wc_hand(ctx,r[2],Q===GC_AUD?Q.head[1][1]+gu_mw(ctx,r[1])+30:1100,y,{size:30,w:700,col:sk>0.01&&i===1?GV.redInk:WC_PENCIL}));
      if(sk>0.01){ctx.save();ctx.strokeStyle=rgba(GV.redInk,0.85);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(170,y-10);ctx.lineTo(170+(1000-170)*easeCam(sk),y-10);ctx.stroke();ctx.restore();}});});}
// the 41 names, printed on paper beside the review: the sheet comes in (o.a), folds row by row from the bottom (o.fold, 0 to 1) and goes
function gc_print41(ctx,o){o=o||{};const a=clamp(o.a||0,0,1),f=clamp(o.fold||0,0,1);if(a<=0.01||f>=0.999)return;const x=1240,y=120,w=520,h=700,hh=h*(1-easeCam(f)*0.92);
  ctx.save();ctx.translate(x+w/2,y);ctx.rotate(0.03);ctx.translate(-w/2,0);withA(ctx,a*(1-clamp((f-0.85)*6,0,1)),()=>{ctx.save();ctx.beginPath();ctx.rect(-30,-30,w+60,hh+40);ctx.clip();
    ctx.drawImage(gv_sheetPaper(w,h),-20,-20);wc_T(ctx,"Grants · learner table",28,52,{w:800,size:30,col:WC_DARK});
    for(let i=0;i<14;i++)if(104+i*40<hh)wc_T(ctx,GC_WHO[i]+(GC_GONE.includes(i)?"  (moved on)":""),28,104+i*40,{w:600,size:28,col:GC_GONE.includes(i)?[150,148,160]:WC_INK});
    if(hh>680)wc_T(ctx,"… and 27 more",28,104+14*40,{w:600,size:28,col:WC_MUTED});ctx.restore();
    ctx.fillStyle=rgba(WC_PENCIL,0.35);ctx.fillRect(0,hh-2,w,3);});ctx.restore();}

/* ---------- what the metadata says ---------- */
// Planning's wall screen: the learners' statuses she needs, stars where the names are, and next term's places by faculty
function gc_planWall(ctx,t){const [sx,sy,sw,sh]=GV_PL.screen;gv_screen(ctx,sx,sy,sw,sh,"next term · places",null,{barH:46,titleSize:28});
  [["studying",0],["completed",1],["studying",2]].forEach(([s,i])=>{const y=sy+120+i*64;gv_mask(ctx,sx+24,y-36,150,48,1,{size:28});wc_T(ctx,s,sx+194,y,{w:600,size:28,col:WC_INK});});
  ["AED","BUS","EIT","HLT"].forEach((f,i)=>{const bx=sx+380+i*78,bh=[110,160,200,130][i];ctx.fillStyle=rgba([140,176,210],0.95);ctx.fillRect(bx,sy+sh-70-bh,52,bh);
    wc_T(ctx,f,bx+26,sy+sh-28,{w:500,size:28,f:"mono",align:"center",col:WC_MUTED});});}
// Noor's map, close: a sheet pinned over it for where each piece lives. The dbt project says what each column is, and its class goes to
// the data platform (o.flow); there, a tag (o.tag), the policy (o.pol), and a group with its date (o.grp), whose members come from the
// directory (o.dir)
const GC_MAPS={x:420,y:200,w:1360,h:660};
function gc_metaMap(ctx,t,o){o=o||{};const S=GC_MAPS,a=clamp(o.a==null?1:o.a,0,1);if(a<=0.01)return;const e=easeCam(a);
  ctx.save();ctx.translate(0,(1-e)*40);withA(ctx,clamp(a*2,0,1),()=>{gv_sheet(ctx,S.x,S.y,S.w,S.h,{rot:-0.006});gv_pin(ctx,S.x+S.w/2,S.y+22,GV.red,1.3);
    gu_filmTag(ctx,S.x+40,S.y+72,"Where each piece lives",1);
    const bx=S.x+50,by=S.y+150;wc_panel(ctx,bx,by,420,200,{kind:"card",role:WC_SIDE.tech,seed:621});const lw=logo(ctx,"dbt",bx+28,by+24,44);wc_T(ctx,"project",bx+40+lw,by+60,{w:800,size:34,col:WC_DARK});
    wc_T(ctx,"says what each",bx+30,by+124,{w:600,size:28,col:WC_INK});wc_T(ctx,"column is",bx+30,by+162,{w:600,size:28,col:WC_INK});
    const px=S.x+700,py=S.y+110,pw=620,ph=540;wc_panel(ctx,px,py,pw,ph,{kind:"card",seed:622});wc_T(ctx,"data platform",px+30,py+56,{w:800,size:34,col:WC_DARK});
    const fl=clamp(o.flow||0,0,1);gc_arrow(ctx,[bx+430,by+100],[px-14,by+100],-30,fl,{col:GU_CYAN,lw:5});withA(ctx,clamp(fl*2-1,0,1),()=>wc_tag(ctx,(bx+430+px)/2,by+40,"column class",{size:28,align:"center",seed:623}));
    const tg=clamp(o.tag||0,0,1);if(tg>0.01){wc_T(ctx,"email",px+40,py+150,{w:500,size:28,f:"mono",col:WC_DARK,a:tg});gc_tag(ctx,px+40+gu_mw(ctx,"email")/2,py+158,px+40+gu_mw(ctx,"email")+24,py+140,"direct",tg);}
    const pl=clamp(o.pol||0,0,1);if(pl>0.01){const k=lerp(1.2,1,spring(pl));ctx.save();ctx.translate(px+340,py+170);ctx.scale(k,k);withA(ctx,clamp(pl*2,0,1),()=>{wc_panel(ctx,-20,-60,290,132,{kind:"card",wash:GV_CLASS.direct,washA:0.15,seed:624});
      wc_T(ctx,"one policy",10,-18,{w:800,size:30,col:WC_DARK});gv_mask(ctx,10,0,180,48,1,{size:28});});ctx.restore();
      gc_arrow(ctx,[px+330,py+160],[px+250,py+150],0,clamp(pl*2-1,0,1),{col:GV_CLASSINK.direct,lw:4});}
    const gp=clamp(o.grp||0,0,1);if(gp>0.01)gc_ring(ctx,px+220,py+350,"planning_learner_readers",{a:gp,n:1,r:56,date:"until 15 Dec",clasp:clamp(gp*2-0.6,0,1),wash:GV.gold,nameSize:28});
    const dr=clamp(o.dir||0,0,1);if(dr>0.01){withA(ctx,clamp(dr*2,0,1),()=>{wc_panel(ctx,bx,by+290,420,110,{kind:"card",seed:625});wc_T(ctx,"directory",bx+30,by+356,{w:800,size:34,col:WC_DARK});});
      gc_arrow(ctx,[bx+430,by+346],[px+126,py+350],30,clamp(dr*1.6-0.4,0,1),{col:GU_CYAN,lw:5});}});ctx.restore();}

const WC_PLACES={platform:gv_paintPlatformClose,platformDesk:gv_paintPlatformDesk,big:c=>gu_paintScreenBig(c,GV_ROOM.plat),bigPlan:c=>gu_paintScreenBig(c,GV_ROOM.plan),
  bigReg:c=>gu_paintScreenBig(c,GV_ROOM.reg),desk:gu_paintFilesDesk,deskGov:gv_paintDesk,regTop:gc_paintRegTop,planning:gv_paintPlanning,registrar:gv_paintRegistrarClose,
  registrarDesk:gv_paintRegistrarDesk,index:gc_paintIndex,mapClose:gv_paintMapClose,board:c=>gv_paintBoardClose(c,GV_ROOM.data)};
