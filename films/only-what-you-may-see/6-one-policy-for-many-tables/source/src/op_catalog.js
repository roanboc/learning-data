/* ===== One policy for many tables: the registrar's data in the hall =====
   The film's own pictures for its data story, drawn with the module's kit (every name here starts with op_ or OP_):
     opHall          the hall, with pools of light where Mei, Sam and Jun stand
     op_pane         the catalog registrar as a pane of glass, a row for each shelf and a small card for each table; big (k 0) or
                     compact at the left (k 1), sliding between the two; its personal data's columns as violet marks, masked by hand
                     one at a time or all at once by the policies
     op_chip         a name as the tool writes it (a group, an identity), in a frosted pill, at least 28 px
     op_table        a table card: its name, its level, and a row for each column (its name, a value, its class)
     op_code         lines of SQL in a page, any of them lit in a meaning's colour
     op_policies     the policies as Catalog Explorer lists them, with the groups each lets through
     op_fn           a function card: its name, and what goes in and what comes out
     op_rowsCard     a few rows of a table as one reader sees them, rows that aren't theirs folding away
   Colours keep the module's meanings: cyan an identity (a group, registrar-loader), green allowed, coral denied or closed, violet
   hidden personal data, the quieter violet an indirect identifier, grey what needs no protection. Every word is at least 28 px. */
AG_PLACES.opHall=c=>dp_paintHall(c,{seed:15,horizon:700,vx:980,pools:[[260,990,520,0.12],[1660,990,520,0.10],[960,820,780,0.05]]});

/* ---------------------------------------------------------------- names as the tool writes them */
function op_chipW(ctx,text,o){o=o||{};return dp_tw(ctx,text,{w:500,size:o.size||28,f:"mono"})+(o.pad==null?28:o.pad)+(o.gear?30:0);}
// a frosted pill with a name in mono, its rim and words in a meaning's colour (cyan: an identity); x, y its top left; returns its width
function op_chip(ctx,x,y,text,col,o){o=o||{};const size=o.size||28,w=op_chipW(ctx,text,o),h=size+22,a=o.a==null?1:o.a;if(a<=0)return w;const c=dp_f(col||"cyan");
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ctx.save();ctx.shadowColor=rgba(c,0.45);ctx.shadowBlur=16;rr(ctx,x,y,w,h,h/2);ctx.fillStyle="rgba(8,26,32,0.86)";ctx.fill();ctx.restore();
  rr(ctx,x+1,y+1,w-2,h-2,h/2-1);ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=2;ctx.stroke();
  if(o.gear){ctx.save();dp_gear(ctx,x+24,y+h/2,11);ctx.fillStyle=rgba(c,0.5);ctx.fill("evenodd");ctx.restore();}
  dp_T(ctx,text,x+(o.gear?44:14),y+h/2+size*0.34,{w:500,size,f:"mono",col:o.ink||col||"cyan"});ctx.restore();return w;}
// a pill of a class: special, direct and pseudonymous in violet (hidden personal data), indirect in the quieter violet, none in grey
const OP_CLASS={special:"violet",direct:"violet",pseudonymous:"violet",indirect:"violet2",none:"grey"};
function op_class(ctx,x,y,cls,o){o=o||{};return dp_pill(ctx,x,y,cls,OP_CLASS[cls]||"grey",{size:28,glow:10,a:o.a});}

/* ---------------------------------------------------------------- the catalog, as a pane of glass
   Shelves (schemas) in a row each, as Grants by design names them; each table a small card, each column a line in it: a violet mark for
   personal data. 38 tables hold personal data, 140 columns between them (the module's numbers): core 14, support 2, staging 10,
   intermediate 12; reference and published hold none; policies holds the functions. */
const OP_SHELVES=[["core",14,"p"],["support",2,"s"],["staging",10,"p"],["intermediate",12,"p"],["reference",5,"n"],["published",6,"n"],["policies",5,"f"]];
const OP_ROWY=[292,372,452,532,612,692,772];
// each personal table's columns: four or five lines, three or four of them personal, 140 in all, in the order a hand would mask them
const OP_CELLS=(()=>{const L=[];let n=0,k=0;OP_SHELVES.forEach(([s,cnt,kind],r)=>{for(let i=0;i<cnt;i++){const pers=kind==="p"||kind==="s"?(k++<26?4:3):0;
  L.push({r,i,shelf:s,kind,pers,first:n});n+=pers;}});return L;})();
function op_paneBox(k){return{x:lerp(100,60,k),y:150,w:lerp(1720,560,k),h:712};}
/* o: k (0 big, 1 compact), a, lit (a shelf to light, or {shelf: amount}; litCol its colour, cyan by default), masked (0 to 1: the
   policies' frost on every personal line at once), hand (how many personal lines are masked by hand, in order; handA their opacity, as
   they lift away), marks (0 to 1: the personal lines' violet marks light: their classes, set), glow (0 to 1: the marks shine, as a
   policy finds them), sweep (0 to 1: a band of light runs along the frost, left to right), outline (0 to 1: a line of light runs round
   the whole pane), frostShelf {shelf: 0..1} (a shelf frosted violet: left out), count (the counter's words, or null; countA its
   opacity), extra: (ctx, box, k) draws more in the pane's coordinates */
function op_pane(ctx,t,o){o=o||{};const k=ag_sine(o.k||0),a=o.a==null?1:o.a;if(a<=0)return;const B=op_paneBox(k);ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,B.x,B.y,B.w,B.h,{col:"cyan",r:24,behind:"opHall",glowA:0.7});
  const lx=B.x+40;dp_T(ctx,"CATALOG",lx,B.y+52,{w:700,size:28,ls:4,col:"cyan"});dp_T(ctx,"registrar",lx,B.y+100,{w:500,size:36,f:"mono"});
  if(o.count)withA(ctx,(1-k)*(o.countA==null?1:o.countA),()=>dp_T(ctx,o.count,B.x+B.w-40,B.y+100,{w:600,size:28,col:o.countCol||"mut",align:"right"}));
  const lit=typeof o.lit==="string"?{[o.lit]:1}:(o.lit||{}),fs=o.frostShelf||{};
  OP_SHELVES.forEach(([s,cnt,kind],r)=>{const y=OP_ROWY[r],L=lit[s]||0,F=fs[s]||0;
    if(L>0){const lc=dp_f(o.litCol||"cyan");ctx.save();ctx.globalAlpha*=L;ctx.fillStyle=rgba(lc,0.12);rr(ctx,B.x+18,y-10,B.w-36,76,14);ctx.fill();ctx.strokeStyle=rgba(lc,0.8);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
    dp_T(ctx,s,lx,y+40,{w:500,size:28,f:"mono",col:L>0.5?(o.litCol||"cyan"):"ink"});
    const x0=lerp(380,320,k),right=B.x+B.w-24;
    for(let i=0;i<cnt;i++){const x=x0+i*94;if(x+84>right+60)break;const fa=clamp((right-(x+84))/60+1,0,1);if(fa<=0)continue;
      ctx.save();ctx.globalAlpha*=fa;op_mini(ctx,x,y,OP_CELLS.find(c=>c.r===r&&c.i===i),o,t);ctx.restore();}
    if(F>0){ctx.save();ctx.globalAlpha*=F;dp_frost(ctx,B.x+18,y-10,B.w-36,76,null,{col:"violet",r:14,behind:"opHall"});dp_T(ctx,s,lx,y+40,{w:500,size:28,f:"mono"});ctx.restore();}});
  if(o.outline>0&&o.outlineA!==0){const p=clamp(o.outline,0,1),c=DP.F.cyan;ctx.save();ctx.globalAlpha*=o.outlineA==null?1:o.outlineA;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.4),1);ctx.shadowColor=rgba(c,1);ctx.shadowBlur=18;ctx.lineWidth=4;
    const per=2*(B.w+B.h);ctx.setLineDash([per*ag_sine(p),per]);rr(ctx,B.x-8,B.y-8,B.w+16,B.h+16,30);ctx.stroke();ctx.restore();}
  if(o.extra)o.extra(ctx,B,k);ctx.restore();}
// a table's small card: its columns as lines, personal ones marked violet; masked by hand (o.hand) or all at once (o.masked)
function op_mini(ctx,x,y,cell,o,t){const kind=cell?cell.kind:"n",w=84,h=56;
  if(kind==="f"){ctx.fillStyle="rgba(10,30,36,0.78)";rr(ctx,x,y,w,h,10);ctx.fill();ctx.strokeStyle=rgba(DP.F.cyan,0.6);ctx.lineWidth=1.6;ctx.stroke();
    dp_T(ctx,"fx",x+w/2,y+38,{w:700,size:28,f:"mono",col:"cyan",align:"center"});return;}
  ctx.fillStyle="rgba(10,30,36,0.78)";rr(ctx,x,y,w,h,10);ctx.fill();ctx.strokeStyle=rgba(kind==="s"?DP.F.violet:[150,200,206],kind==="n"?0.35:0.55);ctx.lineWidth=1.6;ctx.stroke();
  const lines=5,pers=cell?cell.pers:0;
  for(let j=0;j<lines;j++){const ly=y+9+j*9.2,isP=j<pers,idx=cell?cell.first+j:0;
    ctx.fillStyle=rgba([160,196,200],0.35);ctx.fillRect(x+20,ly,w-30,4);
    if(isP){const mk=o.marks==null?1:o.marks,gl=o.glow||0;if(mk>0){if(gl>0){ctx.save();ctx.fillStyle=rgba(DP.F.violet,0.35*gl*mk);ctx.beginPath();ctx.arc(x+12,ly+2,9,0,TAU);ctx.fill();ctx.restore();}
        ctx.fillStyle=rgba(mix(DP.F.violet,[255,255,255],0.5*gl),0.9*mk);ctx.beginPath();ctx.arc(x+12,ly+2,3+1.5*gl,0,TAU);ctx.fill();}
      const hm=o.hand!=null&&idx<o.hand?clamp(o.hand-idx,0,1)*(o.handA==null?1:o.handA):0,m=Math.max(o.masked||0,hm);
      if(m>0){ctx.fillStyle=rgba(DP.F.violet,0.85*m);ctx.fillRect(x+18,ly-2,(w-26)*Math.min(1,m*1.2),8);
        const sw=o.sweep||0;if(sw>0&&sw<1){const d=Math.abs((x-60)/1760-sw*1.2+0.1);if(d<0.12){ctx.fillStyle=rgba([236,228,255],0.7*m*(1-d/0.12));ctx.fillRect(x+18,ly-2,(w-26),8);}}}}}}
// where a shelf's row is, and its n-th small card, for lines of light
function op_shelfAt(s,k){const B=op_paneBox(ag_sine(k||0)),r=OP_SHELVES.findIndex(q=>q[0]===s);return{x:B.x,y:OP_ROWY[r],w:B.w,x0:lerp(380,320,ag_sine(k||0))};}

/* ---------------------------------------------------------------- a table card
   spec: {name, level, rows: [{col, val, cls, tag}]}; o: a, k (springs in), w, show {col: 0..1} (a row's value masked: "***" or o.maskVal
   under violet frost), vals {col: "S-***12"} (what this reader sees), chips (0 to 1, or {col: 0..1}: the class pills land), level (0
   to 1: the level's pill lands), lit {col: 0..1}, ring {col: 0..1} (a soft coral ring), closed (0 to 1: coral frost over the rows, "closed:
   no level"), behind; returns its box. Rows are 54 px apart, the card's header 92. */
function op_table(ctx,x,y,spec,o){o=o||{};const w=o.w||960,n=spec.rows.length,h=92+n*54+18,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_eo(o.k)));
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:20,behind:o.behind,glowR:36});
  dp_T(ctx,"TABLE",x+30,y+44,{w:700,size:28,ls:4,col:"cyan"});dp_T(ctx,spec.name,x+150,y+46,{w:500,size:32,f:"mono"});
  if(spec.level){const la=o.level==null?1:o.level;if(la>0){ctx.save();ctx.globalAlpha*=la;const lw=dp_tw(ctx,spec.level,{w:700,size:28})+36;
      ag_about(ctx,x+w-30-lw/2,y+36,lerp(1.4,1,ag_eo(la)));dp_pill(ctx,x+w-30-lw,y+48,spec.level,o.levelCol||"violet",{size:28});ctx.restore();}}
  ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(x+24,y+70,w-48,1.5);
  const c1=x+30,c2=x+(o.c2||340),c3=x+w-(o.c3||270);
  spec.rows.forEach((r,j)=>{const ry=y+92+j*54+34,L=o.lit&&o.lit[r.col]||0,M=o.show&&o.show[r.col]||0,ch=typeof o.chips==="number"?o.chips:(o.chips&&o.chips[r.col]!=null?o.chips[r.col]:1),RG=o.ring&&o.ring[r.col]||0;
    if(L>0){ctx.save();ctx.globalAlpha*=L;ctx.fillStyle=rgba(DP.F.cyan,0.14);rr(ctx,x+14,ry-36,w-28,50,10);ctx.fill();ctx.restore();}
    dp_T(ctx,r.col,c1,ry,{w:500,size:28,f:"mono",col:"mut"});
    const v=o.vals&&o.vals[r.col]!=null?o.vals[r.col]:r.val;
    if(v!=null){if(M>0){const vw=Math.min(c3-c2-30,dp_tw(ctx,r.val,{w:600,size:28})+28);const M1=clamp(1-2*M,0,1),M2=clamp(2*M-1,0,1);if(M1>0){ctx.save();ctx.globalAlpha*=M1;dp_T(ctx,r.val,c2,ry,{w:600,size:28});ctx.restore();}
        ctx.save();ctx.globalAlpha*=M;dp_frost(ctx,c2-14,ry-34,vw,46,null,{col:"violet",r:10,behind:o.behind});ctx.globalAlpha*=M2/Math.max(M,1e-6);if(M2>0)dp_T(ctx,o.maskVal&&o.maskVal[r.col]||"***",c2,ry,{w:700,size:28});ctx.restore();}
      else dp_T(ctx,v,c2,ry,{w:600,size:28,f:r.mono?"mono":undefined});}
    if(r.cls&&ch>0){ctx.save();ctx.globalAlpha*=clamp(ch,0,1);ag_about(ctx,c3+60,ry-10,lerp(1.5,1,ag_eo(clamp(ch,0,1))));op_class(ctx,c3,ry,r.cls);ctx.restore();}
    if(r.tag&&ch>0){ctx.save();ctx.globalAlpha*=clamp(ch,0,1);op_chip(ctx,c3,ry-36,r.tag,"grey",{ink:"ink"});ctx.restore();}
    if(r.empty){ctx.save();ctx.strokeStyle=rgba(DP.T.mut,0.6);ctx.setLineDash([8,6]);ctx.lineWidth=2;rr(ctx,c3,ry-34,170,46,23);ctx.stroke();ctx.restore();}
    if(RG>0){ctx.save();ctx.globalAlpha*=RG;ctx.strokeStyle=rgba(DP.F.coral,0.9);ctx.shadowColor=rgba(DP.F.coral,0.8);ctx.shadowBlur=14;ctx.lineWidth=3;rr(ctx,x+12,ry-38,w-24,54,12);ctx.stroke();ctx.restore();}});
  if(o.closed>0){const ca=clamp(o.closed,0,1);ctx.save();ctx.globalAlpha*=ca;dp_frost(ctx,x+12,y+80,w-24,h-92,null,{col:"coral",r:14,behind:o.behind});
    dp_lock(ctx,x+w/2-150,y+80+(h-92)/2+4,48,"coral",0);dp_T(ctx,"closed: no level",x+w/2-100,y+80+(h-92)/2+14,{w:700,size:32});ctx.restore();}
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- SQL in a page, its lines lit in turn
   lines: [text, ...]; o.lit {i: [meaning, 0..1]} lights line i in that meaning's colour; o.lh the line height; the words in mono, 28 px */
function op_code(ctx,x,y,lines,o){o=o||{};const lh=o.lh||50,lit=o.lit||{};lines.forEach((l,i)=>{const yy=y+i*lh,L=lit[i];
  if(L&&L[1]>0){const c=dp_f(L[0]);ctx.save();ctx.globalAlpha*=clamp(L[1],0,1);ctx.fillStyle=rgba(c,0.18);rr(ctx,x-14,yy-34,dp_tw(ctx,l,{w:500,size:28,f:"mono"})+28,46,8);ctx.fill();
    ctx.fillStyle=rgba(c,1);ctx.fillRect(x-14,yy-34,4,46);ctx.restore();}
  dp_T(ctx,l,x,yy,{w:500,size:28,f:"mono",col:L&&L[1]>0.5?mix(dp_t(L[0]),[255,255,255],0.35):"ink"});});}
const OP_SQL=["CREATE OR REPLACE POLICY hide_direct","ON CATALOG registrar","COLUMN MASK registrar.policies.mask_whole","TO `account users`",
  "EXCEPT registrar_owners, registrar_office, help_desk","FOR TABLES","MATCH COLUMNS has_tag_value('personal_data', 'direct') AS v","ON COLUMN v;"];

/* ---------------------------------------------------------------- the policies, as Catalog Explorer lists them
   rows: [{name, on, finds, does, a, lit, h, through: [[chip, a, col, gear, dy, dx, opacity], ...], to, toA}], drawn in a page's box;
   o.cols the columns to show ("on", "finds", "does", "through"); returns the y under it. A row whose chips don't fit on one line takes
   two. A row's h (0 to 1) opens its gap first, so the rows under it move down before it comes in. */
function op_policies(ctx,box,rows,o){o=o||{};const x=box.x,cols=o.cols||["on","finds","does"],W1=340,lh=64,through=cols.includes("through");
  const wOn=255,wFinds=270,wDoes=245,tx=x+W1+(cols.includes("on")?wOn:0)+(cols.includes("finds")?wFinds:0)+(cols.includes("does")?wDoes:0),tw=box.x+box.w-tx;
  let y=box.y;dp_T(ctx,"Policy",x,y+30,{w:700,size:28,col:"mut"});let hx=x+W1;
  for(const [k,label,w] of [["on","On",wOn],["finds","Finds",wFinds],["does","Does",wDoes]])if(cols.includes(k)){dp_T(ctx,label,hx,y+30,{w:700,size:28,col:"mut"});hx+=w;}
  if(through)dp_T(ctx,o.throughLabel||"Let through",tx,y+30,{w:700,size:28,col:"mut"});
  ctx.fillStyle=rgba(DP.T.mut,0.4);ctx.fillRect(x,y+46,box.w,1.4);y+=56;
  for(const r of rows){const a=r.a==null?1:r.a;let lines=1;
    // where each chip goes: as many on a line as fit
    const place=[];if(through&&r.through){let cx=tx,ln=0;for(const ch of r.through){const cw=op_chipW(ctx,ch[0]);if(cx+cw>tx+tw&&cx>tx){ln++;cx=tx;}place.push([cx,ln]);cx+=cw+12;}lines=Math.max(1,ln+1);}
    const rh=lh*lines+(lines>1?-8:0);
    if(a>0){ctx.save();ctx.globalAlpha*=a;if(r.dy)ctx.translate(0,r.dy);
      if(r.lit>0){ctx.save();ctx.globalAlpha*=r.lit;ctx.fillStyle=rgba(DP.F.cyan,0.14);rr(ctx,x-16,y,box.w+32,rh,10);ctx.fill();ctx.restore();}
      const by=y+42;dp_T(ctx,r.name,x,by,{w:500,size:28,f:"mono"});let cx=x+W1;
      if(cols.includes("on")){dp_T(ctx,r.on||"registrar",cx,by,{w:500,size:28,f:"mono",col:"mut"});cx+=wOn;}
      if(cols.includes("finds")){if(r.finds==="faculty")op_chip(ctx,cx,by-36,"faculty","grey",{ink:"ink"});else if(r.finds==="no level")dp_T(ctx,"no level",cx,by,{w:700,size:28,col:"coral"});else if(r.finds)op_class(ctx,cx,by,r.finds);cx+=wFinds;}
      if(cols.includes("does")){dp_T(ctx,r.does,cx,by,{w:600,size:28});cx+=wDoes;}
      if(through){if(r.to){const ta=r.toA==null?1:r.toA;if(ta>0){ctx.save();ctx.globalAlpha*=ta;dp_T(ctx,"applies only to",tx,by,{w:600,size:28,col:"mut"});
          op_chip(ctx,tx+dp_tw(ctx,"applies only to",{w:600,size:28})+18,by-36,r.to,"cyan");ctx.restore();}}
        (r.through||[]).forEach((ch,i)=>{const [px,ln]=place[i],ca=ch[1]==null?1:ch[1];if(ca<=0)return;const dy=(1-ag_eo(clamp(ca,0,1)))*-16+(ch[4]||0);
          op_chip(ctx,px+(ch[5]||0),by-36+ln*(lh-8)+dy,ch[0],ch[2]||"cyan",{a:clamp(ca*1.5,0,1)*(ch[6]==null?1:ch[6]),gear:ch[3]});});}
      ctx.restore();}
    if(r.line!==false){ctx.fillStyle=rgba(DP.T.mut,0.2*a);ctx.fillRect(x,y+rh-2+(r.dy||0),box.w,1.2);}
    y+=rh*(r.h==null?1:r.h);}
  return y;}

/* ---------------------------------------------------------------- a function card: its name, and pairs of what goes in and what comes out
   pairs: [[in, out, colour of out, p], ...]; a pair whose input is long takes two lines (in, then the arrow and out under it) */
function op_fn(ctx,x,y,w,h,name,pairs,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_eo(o.k)));
  dp_panel(ctx,x,y,w,h,{col:o.col||"violet",r:20,behind:o.behind,glowR:34});
  dp_T(ctx,"FUNCTION",x+28,y+46,{w:700,size:28,ls:4,col:o.col||"violet"});dp_T(ctx,name,x+28,y+94,{w:500,size:32,f:"mono"});
  let yy=y+150;for(const [i,out,col,p,two] of pairs){const pa=p==null?1:p;if(pa<=0){yy+=two?88:48;continue;}ctx.save();ctx.globalAlpha*=clamp(pa,0,1);
    dp_T(ctx,i,x+28,yy,{w:600,size:28,col:"mut",f:o.mono?"mono":undefined});
    const ox=two?x+28:x+28+dp_tw(ctx,i,{w:600,size:28,f:o.mono?"mono":undefined})+16,oy=two?yy+44:yy;
    dp_T(ctx,"→ "+out,ox,oy,{w:700,size:28,col:!col||col==="ink"||col==="mut"?(col||"ink"):mix(dp_t(col),[255,255,255],0.22)});ctx.restore();yy+=two?96:52;}
  if(o.tick>0)dp_tick(ctx,x+w-44,y+44,"green",o.tick);ctx.restore();}

/* ---------------------------------------------------------------- a few rows, as one reader sees them
   cols: [name, ...]; rows: [[value, ...], ...]; o.fold {i: 0..1} folds row i away (it isn't this reader's); o.mono [true, ...] the
   columns written as the tool writes them; o.plain: the title in words, not a table's name; o.wash {i: [colour, 0..1]} lights row i;
   o.tagAt, o.tag: the faculty tag lands on that column's name */
function op_rowsCard(ctx,x,y,w,title,cols,rows,o){o=o||{};const a=o.a==null?1:o.a,cw=o.cw||[],lh=50;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  let n=0;rows.forEach((r,i)=>{n+=1-ag_sine(clamp(o.fold&&o.fold[i]||0,0,1));});const h=126+n*lh+16;
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:20,behind:o.behind,glowR:30});
  if(o.chip)op_chip(ctx,x+24,y+16,o.chip,"cyan");else dp_T(ctx,title,x+28,y+46,o.plain?{w:700,size:30}:{w:500,size:30,f:"mono"});let cx=x+28;
  cols.forEach((c,j)=>{dp_T(ctx,c,cx,y+100,{w:500,size:28,f:"mono",col:"mut"});cx+=cw[j]||220;});
  if(o.tagAt!=null&&o.tag>0){const tx=x+28+cw.slice(0,o.tagAt).reduce((s,v)=>s+v,0)+dp_tw(ctx,cols[o.tagAt],{w:500,size:28,f:"mono"})+14;ctx.save();ctx.globalAlpha*=clamp(o.tag,0,1);
    ag_about(ctx,tx+70,y+89,lerp(1.4,1,ag_eo(clamp(o.tag,0,1))));op_chip(ctx,tx,y+64,"faculty","grey",{ink:"ink"});ctx.restore();}
  ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(x+20,y+114,w-40,1.4);
  let yy=y+126;rows.forEach((r,i)=>{const f=ag_sine(clamp(o.fold&&o.fold[i]||0,0,1)),rh=lh*(1-f);if(rh<1)return;ctx.save();ctx.beginPath();ctx.rect(x,yy,w,rh);ctx.clip();ctx.globalAlpha*=clamp(1-2*f,0,1);
    const wa=o.wash&&o.wash[i];if(wa&&wa[1]>0){ctx.save();ctx.globalAlpha*=clamp(wa[1],0,1);ctx.fillStyle=rgba(dp_f(wa[0]),0.18);rr(ctx,x+12,yy+2,w-24,lh-4,10);ctx.fill();ctx.restore();}
    let cx2=x+28;r.forEach((v,j)=>{const mo=o.mono&&o.mono[j]||(j===0&&o.monoFirst);dp_T(ctx,v,cx2,yy+36,{w:mo?500:600,size:28,f:mo?"mono":undefined,col:o.colOf?o.colOf(j,v,i):"ink"});cx2+=cw[j]||220;});ctx.restore();yy+=rh;});
  ctx.restore();return{x,y,w,h};}
// a reader's chip over a card, and a calendar's day on a slip
function op_day(ctx,x,y,text,o){o=o||{};return dp_slip(ctx,x,y,text,"cyan",Object.assign({ink:true},o));}
