/* ===== Know what you hold: classes, levels and the university's tables =====
   The film's own pictures in the hall, drawn with the module's kit (films/locks-before-the-data/shared/): a chip for each column's
   class, an empty slot where a column has no class yet, a table's pane frosted as far as its level says, the slip that names the
   level, the learner table and the support table, and the cards the story shows. Every top-level name starts with kw_ or KW_.
   Colour keeps the module's meanings: violet is personal data, the kit's quieter violet an indirect identifier, grey what needs no
   protection; green allowed (a confirmed class), coral closed (what doesn't go through). Sizes are in the 1920 x 1080 frame; every word
   is at least 28 px as seen. */

/* ---------------------------------------------------------------- the five classes, strictest first
   A chip is a pill of solid colour with dark words, as the module's pills are: special and direct violet, pseudonymous violet with a
   small key (it leads back only with a key kept elsewhere), indirect the quieter violet, none grey. Special, the strictest, has a second
   ring round it. */
const KW_CLASS={
  special:{col:"violet",ring:1,line:"could harm a person if it got out: health, disability, faith"},
  direct:{col:"violet",line:"names a person by itself"},
  pseudonymous:{col:"violet",key:1,line:"a code that leads back only with a key kept elsewhere"},
  indirect:{col:"indirect",line:"names no one alone; with other columns, can single one out"},
  none:{col:"none",line:"says nothing about who someone is"}};
const KW_ORDER=["special","direct","pseudonymous","indirect","none"];
const KW_CH=48;   // a chip's height (its words 28 px)
// a small key, in the dark ink of words on solid colour, its bow's middle at x, y, s about its length
function kw_keyGlyph(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col||DP.on,1);ctx.lineWidth=Math.max(2.4,s*0.17);ctx.lineCap="round";
  ctx.beginPath();ctx.arc(x-s*0.28,y,s*0.24,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.04,y);ctx.lineTo(x+s*0.62,y);
  ctx.moveTo(x+s*0.42,y);ctx.lineTo(x+s*0.42,y+s*0.22);ctx.moveTo(x+s*0.6,y);ctx.lineTo(x+s*0.6,y+s*0.18);ctx.stroke();ctx.restore();}
function kw_chipW(ctx,cls){return dp_tw(ctx,cls,{w:700,size:28})+36+(KW_CLASS[cls].key?38:0);}
// a class chip, its words' baseline at y; o.align ("left", "center", "right"), o.a, o.k (a spring from ag_spr: it springs in from
// half its size, and its words come in only as it reaches its size, so they are never drawn under 28 px), o.glow (0 to 1, light round
// it, as wide as the pill and only a little taller, so it doesn't fall on the words above and under it), o.ring (0 to 1, draws special's second ring on), o.dash (a class only suggested: an
// outline, dashed, the words in the class's colour); returns its width
function kw_chip(ctx,x,y,cls,o){o=o||{};const K=KW_CLASS[cls],w=kw_chipW(ctx,cls),h=KW_CH,a=o.a==null?1:o.a;if(a<=0.001)return w;
  const x0=o.align==="center"?x-w/2:o.align==="right"?x-w:x,top=y-h+12,c=dp_f(K.col);
  const s=o.k!=null?lerp(0.5,1,o.k):1,ta=clamp((s-0.92)/0.07,0,1);
  ctx.save();ctx.globalAlpha*=clamp(a,0,1);if(o.k!=null)ag_about(ctx,x0+w/2,top+h/2,s);
  if(o.glow>0){const R=w/2+h*1.2;ctx.save();ctx.translate(x0+w/2,top+h/2);ctx.scale(1,h*1.5/R);dp_halo(ctx,0,0,R,K.col,0.42*o.glow);ctx.restore();}
  if(o.dash){ctx.save();rr(ctx,x0,top,w,h,h/2);ctx.fillStyle="rgba(10,16,38,0.72)";ctx.fill();ctx.setLineDash([9,7]);ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=2.2;
    ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=10;ctx.stroke();ctx.restore();
    let tx=x0+18;if(K.key){ctx.save();ctx.globalAlpha*=ta;kw_keyGlyph(ctx,tx+12,top+h/2,24,dp_t(K.col));ctx.restore();tx+=38;}dp_T(ctx,cls,tx,y-1,{w:700,size:28,col:K.col,a:ta});ctx.restore();return w;}
  ctx.save();ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=18;rr(ctx,x0,top,w,h,h/2);
  const g=ctx.createLinearGradient(0,top,0,top+h);g.addColorStop(0,rgba(mix(c,[255,255,255],0.16),1));g.addColorStop(1,rgba(c,1));ctx.fillStyle=g;ctx.fill();ctx.restore();
  rr(ctx,x0+0.6,top+0.6,w-1.2,h-1.2,h/2-0.6);ctx.strokeStyle=rgba(mix(c,[255,255,255],0.5),0.9);ctx.lineWidth=1.2;ctx.stroke();
  let tx=x0+18;if(K.key){ctx.save();ctx.globalAlpha*=ta;kw_keyGlyph(ctx,tx+12,top+h/2,24);ctx.restore();tx+=38;}
  dp_T(ctx,cls,tx,y-1,{w:700,size:28,col:DP.on,a:ta});
  if(K.ring){const p=o.ring==null?1:clamp(o.ring,0,1);if(p>0){const m=7,rw=w+2*m,rh=h+2*m,L=2*(rw-rh)+Math.PI*rh;ctx.save();
    ctx.shadowColor=rgba(c,0.85);ctx.shadowBlur=12;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.lineWidth=2.4;ctx.setLineDash([L*p,L+10]);
    rr(ctx,x0-m,top-m,rw,rh,rh/2);ctx.stroke();ctx.restore();}}
  ctx.restore();return w;}
// a slot with no class yet: a dashed outline the size of a chip (w wide), its words' baseline at y
function kw_slot(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return;const top=y-KW_CH+12;ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  rr(ctx,x,top,w,KW_CH,KW_CH/2);ctx.fillStyle="rgba(8,22,28,0.45)";ctx.fill();ctx.setLineDash([9,8]);ctx.strokeStyle=rgba(DP.ice,0.62);ctx.lineWidth=2;ctx.stroke();
  if(o.text)dp_T(ctx,o.text,x+20,y-1,{w:600,size:28,col:"mut"});ctx.restore();}

/* ---------------------------------------------------------------- a table's level
   Four levels, set by the table's owner by the harm if the whole table got out. A table's pane is frosted as far as its level says
   (public clear, internal lightly frosted, confidential frosted, restricted frosted with a violet rim), and a slip names the level. */
const KW_LEVEL={public:{frost:0,rim:0},internal:{frost:0.4,rim:0},confidential:{frost:0.8,rim:0},restricted:{frost:1,rim:1}};
function kw_levelW(ctx,level){return 24+dp_tw(ctx,"LEVEL",{w:800,size:28,ls:3})+14+dp_tw(ctx,level,{w:700,size:30})+24;}
// the slip, its top right at x, y (o.align "left": its top left); o.a; o.lit (0 to 1) brightens it (light round it, only a little
// larger than the slip, so it doesn't fall on the words over it, and its LEVEL nearer white); returns its box
function kw_level(ctx,x,y,level,o){o=o||{};const w=kw_levelW(ctx,level),h=62,x0=o.align==="left"?x:x-w,a=o.a==null?1:o.a,bb={x:x0,y,w,h};if(a<=0.001)return bb;
  const col=level==="restricted"?"violet":"grey";ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  const lit=clamp(o.lit||0,0,1);if(lit>0){const R=w/2+34;ctx.save();ctx.translate(x0+w/2,y+h/2);ctx.scale(1,(h/2+34)/R);dp_halo(ctx,0,0,R,col,0.3*lit);ctx.restore();}
  dp_panel(ctx,x0,y,w,h,{col,r:16,glowR:24,glowA:0.7+0.6*(o.lit||0),behind:o.behind});
  const lw=dp_tw(ctx,"LEVEL",{w:800,size:28,ls:3});dp_T(ctx,"LEVEL",x0+24,y+42,{w:800,size:28,ls:3,col:mix(dp_t("mut"),dp_t("ink"),0.6*lit)});dp_T(ctx,level,x0+24+lw+14,y+42,{w:700,size:30});
  ctx.restore();return bb;}
// a table's pane of glass: frost (0 clear to 1 frosted), rim (0 to 1, the violet of a restricted table), o.a, o.r, o.behind
function kw_pane(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return;const fr=clamp(o.frost==null?0.8:o.frost,0,1),rim=clamp(o.rim||0,0,1),r=o.r==null?24:o.r,ice=DP.ice;
  ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  ctx.save();ctx.shadowColor=rgba(ice,0.10+0.16*fr);ctx.shadowBlur=44;rr(ctx,x,y,w,h,r);ctx.fillStyle=rgba([6,20,26],0.12+0.5*fr);ctx.fill();ctx.restore();
  ctx.save();rr(ctx,x,y,w,h,r);ctx.clip();
  if(fr>0){ctx.save();ctx.globalAlpha*=fr;dp_behind(ctx,o.behind);ctx.restore();}
  ctx.fillStyle=rgba([6,20,26],0.10+0.20*fr);ctx.fillRect(x,y,w,h);
  const tg=ctx.createLinearGradient(x,y,x+w*0.5,y+h);tg.addColorStop(0,rgba([170,228,232],0.035+0.14*fr));tg.addColorStop(1,rgba([170,228,232],0.015+0.06*fr));ctx.fillStyle=tg;ctx.fillRect(x,y,w,h);
  // a sheen across clear glass
  const sg=ctx.createLinearGradient(x,y,x+w,y+h);sg.addColorStop(0,"rgba(210,248,248,0.07)");sg.addColorStop(0.32,"rgba(210,248,248,0.0)");sg.addColorStop(0.5,"rgba(210,248,248,0.05)");sg.addColorStop(0.62,"rgba(210,248,248,0)");
  ctx.fillStyle=sg;ctx.fillRect(x,y,w,h);
  const hg=ctx.createLinearGradient(0,y,0,y+70);hg.addColorStop(0,"rgba(225,250,250,"+(0.06+0.1*fr).toFixed(3)+")");hg.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=hg;ctx.fillRect(x,y,w,70);
  ctx.restore();
  // its edges catch the light; a restricted table's rim is violet
  const eg=ctx.createLinearGradient(x,y,x+w,y+h);eg.addColorStop(0,rgba(mix(ice,[255,255,255],0.4),0.95));eg.addColorStop(0.5,rgba(ice,0.55));eg.addColorStop(1,rgba(ice,0.75));
  rr(ctx,x+1,y+1,w-2,h-2,r);ctx.strokeStyle=eg;ctx.lineWidth=2;ctx.stroke();
  if(rim>0){const v=DP.F.violet;ctx.save();ctx.globalAlpha*=rim;ctx.shadowColor=rgba(v,0.95);ctx.shadowBlur=22;rr(ctx,x-3,y-3,w+6,h+6,r+3);
    ctx.strokeStyle=rgba(mix(v,[255,255,255],0.25),1);ctx.lineWidth=3.2;ctx.stroke();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the learner table and the support table
   The registrar's learner table, as its owner's register lists it: each column on a line, the first row's value beside it (Samuel's),
   and the column's class at the right, or an empty slot. o.chips: {column key: {cls, k, a, glow, ring, dash}} or a column's slot
   ({slot: true, a}); o.level, o.frost, o.rim, o.levelA, o.lit; o.rows (0 to 1 each, by key) brings a line in; o.out (0 to 1) takes
   exam support out (its line leaves and the pane closes up); o.light {key: 0 to 1} lights a line; returns the chip's place for each
   column {key: [x, y]} (where a chip's left end and baseline go). */
const KW_COLS=[
  {key:"num",name:"Student number",val:"S-20412",mono:1},
  {key:"name",name:"Name",val:"Samuel Osei"},
  {key:"email",name:"Email",val:"samuel.osei@mail.example"},
  {key:"dob",name:"Date of birth",val:"14 May 1987"},
  {key:"course",name:"Course",val:"Public health"},
  {key:"results",name:"Results",val:"90 of 120"},
  {key:"exam",name:"Exam support",val:"–"}];
const KW_LT={w:1000,rowH:58,top:236,valX:296,chipX:700};
function kw_ltH(o){const out=o&&o.out||0;return KW_LT.top+6*KW_LT.rowH+58-KW_LT.rowH*ag_sine(clamp(out*1.4-0.3,0,1));}
function kw_row(ctx,x,y,c,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return;ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  if(o.light>0){ctx.save();ctx.globalAlpha*=o.light;const g=ctx.createLinearGradient(x,0,x+(o.w||KW_LT.w-60),0);g.addColorStop(0,rgba(DP.F.violet,0.20));g.addColorStop(1,rgba(DP.F.violet,0));
    ctx.fillStyle=g;rr(ctx,x-14,y-38,(o.w||KW_LT.w-60)+20,54,12);ctx.fill();ctx.restore();}
  dp_T(ctx,c.name,x,y,{w:600,size:30});
  if(o.val!==false)dp_T(ctx,c.val,x+KW_LT.valX-36,y,c.mono?{w:500,size:28,f:"mono",col:"mut"}:{w:500,size:28,col:"mut"});
  ctx.restore();}
function kw_learner(ctx,X,Y,o){o=o||{};const a=o.a==null?1:o.a,places={};if(a<=0.001)return places;const w=KW_LT.w,h=kw_ltH(o),lv=o.level||"confidential",L=KW_LEVEL[lv];
  ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  kw_pane(ctx,X,Y,w,h,{frost:o.frost==null?L.frost:o.frost,rim:o.rim==null?L.rim:o.rim,behind:o.behind});
  dp_T(ctx,"Learner table",X+36,Y+66,{w:700,size:36});dp_T(ctx,"registrar's office",X+36,Y+106,{w:500,size:28,col:"mut"});
  if(o.levelA!==0)kw_level(ctx,X+w-28,Y+28,o.levelText||lv,{a:o.levelA==null?1:o.levelA,lit:o.lit});
  dp_T(ctx,"Column",X+36,Y+170,{w:700,size:28,col:"mut"});dp_T(ctx,"First row",X+KW_LT.valX,Y+170,{w:700,size:28,col:"mut"});dp_T(ctx,"Class",X+KW_LT.chipX,Y+170,{w:700,size:28,col:"mut"});
  ctx.fillStyle=rgba(DP.ice,0.28);ctx.fillRect(X+30,Y+190,w-60,1.5);
  KW_COLS.forEach((c,i)=>{const yy=Y+KW_LT.top+i*KW_LT.rowH;let ra=o.rows&&o.rows[c.key]!=null?o.rows[c.key]:1;
    if(c.key==="exam"&&o.out){ra*=1-ag_in(o.out,0,0.18);}
    places[c.key]=[X+KW_LT.chipX,yy];
    if(i<6||!(o.out>=0.18)){if(i>0&&ra>0){ctx.save();ctx.globalAlpha*=ra;ctx.fillStyle=rgba(DP.ice,0.10);ctx.fillRect(X+30,yy-44,w-60,1);ctx.restore();}
      kw_row(ctx,X+36,yy,c,{a:ra,light:o.light&&o.light[c.key]});}
    const ch=o.chips&&o.chips[c.key];if(!ch||ra<=0.001)return;
    if(ch.slot)kw_slot(ctx,X+KW_LT.chipX,yy,kw_chipW(ctx,"pseudonymous")-38,{a:(ch.a==null?1:ch.a)*ra});
    if(ch.from&&ch.u<1){kw_chip(ctx,X+KW_LT.chipX,yy,ch.from,{a:(1-ag_sine(clamp(ch.u*2,0,1)))*ra});}
    if(ch.cls)kw_chip(ctx,X+KW_LT.chipX,yy,ch.cls,{k:ch.k,a:(ch.a==null?1:ch.a)*ra*(ch.from?ag_sine(clamp(ch.u*2-1,0,1)):1),glow:ch.glow,ring:ch.ring,dash:ch.dash});});
  ctx.restore();return places;}
// the support table: a small pane, restricted, its one column, exam support, and those who may read it (470 by 360); o.row, o.chip,
// o.chipA, o.ring, o.glow, o.slipA (its level's slip), o.readers (0 to 1, its last line); returns its box and where its row is
function kw_support(ctx,X,Y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.001)return null;const w=470,h=360;ctx.save();ctx.globalAlpha*=clamp(a,0,1);
  kw_pane(ctx,X,Y,w,h,{frost:1,rim:o.rim==null?1:o.rim,behind:o.behind});
  dp_T(ctx,"Support table",X+34,Y+62,{w:700,size:36});dp_T(ctx,"registrar's office",X+34,Y+102,{w:500,size:28,col:"mut"});
  kw_level(ctx,X+34,Y+126,"restricted",{align:"left",lit:o.lit,a:o.slipA});
  ctx.fillStyle=rgba(DP.ice,0.28);ctx.fillRect(X+28,Y+212,w-56,1.5);
  const yy=Y+268,ra=o.row==null?1:o.row;if(ra>0){kw_row(ctx,X+34,yy,KW_COLS[6],{a:ra,val:false,light:o.light});
    if(o.chip!==false)kw_chip(ctx,X+w-30,yy,o.chip||"special",{align:"right",a:ra*(o.chipA==null?1:o.chipA),ring:o.ring,glow:o.glow});}
  // who may read it
  const rd=o.readers==null?1:o.readers;if(rd>0)dp_T(ctx,"for those who arrange exams",X+34,Y+322,{w:500,size:28,col:"mut",a:rd});
  ctx.restore();return{x:X,y:Y,w,h,row:[X+34,yy]};}

/* ---------------------------------------------------------------- cards
   kw_card(ctx, x, y, w, rows, o): a card of glass whose rows are [kind, ...]: ["kick", text, col] in capitals, ["title", text],
   ["sub", text], ["line", text, {col, w, size, a}], ["chips", [[cls, words], ...]] (a chip and its words, a line each), ["gap", px];
   each row may have an a (0 to 1) in o.ra[i]; o.col the rim; o.a; o.k (a spring); returns {x, y, w, h, ys: each row's baseline}. */
function kw_cardLayout(ctx,w,rows){const P=DP_PAD,inner=w-2*P,L=[];let y=P;
  rows.forEach((r,i)=>{const k=r[0];
    if(k==="gap"){y+=r[1];L.push({i,k,ys:[]});return;}
    if(k==="kick"){y+=(i?18:0)+20;L.push({i,k,ys:[y],lines:[String(r[1]).toUpperCase()]});y+=14;return;}
    if(k==="chips"){const ys=[];r[1].forEach((c,j)=>{y+=j?60:(i?44:36);ys.push(y);});L.push({i,k,ys,items:r[1]});y+=14;return;}
    const big=k==="title",q=r[2]||{},size=q.size||(big?36:28),lh=big?46:Math.round(size*1.36),ww=q.w||(big?700:k==="sub"?500:600);
    const lines=ag_wrap(ctx,r[1],inner-(q.indent||0),{w:ww,size});const ys=[];
    lines.forEach((l,j)=>{y+=j?lh:(i?(big?50:k==="sub"?40:Math.round(size*1.5)):(big?30:size));ys.push(y);});L.push({i,k,ys,lines,size,ww,q});y+=big?6:4;});
  return{L,h:Math.round(y+P+8)};}
function kw_card(ctx,x,y,w,rows,o){o=o||{};const lay=kw_cardLayout(ctx,w,rows),h=o.h||lay.h,a=o.a==null?1:o.a,bb={x,y,w,h,ys:lay.L.map(l=>l.ys.map(v=>y+v))};
  if(a<=0.001||o.measure)return bb;ctx.save();ctx.globalAlpha*=clamp(a,0,1);if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:o.col||"grey",r:20,glowR:34,glowA:o.glowA,behind:o.behind});
  lay.L.forEach(l=>{const ra=o.ra&&o.ra[l.i]!=null?o.ra[l.i]:1;if(ra<=0.001)return;ctx.save();ctx.globalAlpha*=ra;const r=rows[l.i];
    if(l.k==="kick")dp_T(ctx,l.lines[0],x+DP_PAD,y+l.ys[0],{w:800,size:28,ls:4,col:r[2]||o.kickCol||"cyan"});
    else if(l.k==="chips")l.items.forEach((c,j)=>{const cw=kw_chip(ctx,x+DP_PAD,y+l.ys[j],c[0],Object.assign({},o.chipO&&o.chipO(l.i,j)));if(c[1])dp_T(ctx,c[1],x+DP_PAD+(o.chipCol||cw+18),y+l.ys[j],{w:500,size:28,col:"mut"});});
    else if(l.k!=="gap"){const q=l.q||{};l.lines.forEach((s,j)=>dp_T(ctx,s,x+DP_PAD+(q.indent||0),y+l.ys[j],{w:l.ww,size:l.size,col:q.col||(l.k==="sub"?"mut":"ink")}));}
    ctx.restore();});
  ctx.restore();return bb;}
// a person's name on a small panel, and what they do under it (a tag with two lines); returns its box
function kw_name(ctx,x,y,name,role,o){o=o||{};const w=Math.max(dp_tw(ctx,name,{w:700,size:32}),dp_tw(ctx,role,{w:500,size:28}))+48,h=104,a=o.a==null?1:o.a,x0=o.align==="right"?x-w:x,bb={x:x0,y,w,h};
  if(a<=0.001)return bb;ctx.save();ctx.globalAlpha*=clamp(a,0,1);dp_panel(ctx,x0,y,w,h,{col:"cyan",r:16,glowR:26,glowA:0.7+(o.lit||0),behind:o.behind});
  dp_T(ctx,name,x0+24,y+44,{w:700,size:32});dp_T(ctx,role,x0+24,y+82,{w:500,size:28,col:"mut"});ctx.restore();return bb;}
// a dotted line of light from a to b, drawn on by p, ending at a question mark (or at nothing)
function kw_dots(ctx,a,b,col,p,o){o=o||{};p=clamp(p==null?1:p,0,1);if(p<=0)return;const c=dp_f(col||"ink"),ex=lerp(a[0],b[0],p),ey=lerp(a[1],b[1],p);
  ctx.save();ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.setLineDash([2,10]);ctx.shadowColor=rgba(c,0.7);ctx.shadowBlur=8;
  ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(ex,ey);ctx.stroke();ctx.restore();
  if(o.q&&p>=0.98){const qa=o.qa==null?1:o.qa;ctx.save();ctx.globalAlpha*=qa;dp_panel(ctx,b[0]-27,b[1]-27,54,54,{col:"grey",r:27,glowR:20});dp_T(ctx,"?",b[0],b[1]+12,{w:800,size:34,align:"center"});ctx.restore();}}
// light running along the glass from a to b (u 0 to 1 its head), a few px wide, in a colour; returns its head
function kw_run(ctx,pts,u,col,o){o=o||{};u=clamp(u,0,1);if(u<=0)return pts[0];const c=dp_f(col||"violet");let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
  let left=L*u,head=pts[0];ctx.save();ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),o.alpha==null?0.95:o.alpha);ctx.lineWidth=o.lw||3;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length&&left>0;i++){const d=seg[i-1],q=Math.min(1,left/d);head=[lerp(pts[i-1][0],pts[i][0],q),lerp(pts[i-1][1],pts[i][1],q)];ctx.lineTo(head[0],head[1]);left-=d;}
  ctx.stroke();ctx.restore();return head;}
// the point part u of the way along pts
function kw_along(pts,u){let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
  let left=L*clamp(u,0,1);for(let i=1;i<pts.length;i++){const d=seg[i-1];if(left<=d||i===pts.length-1){const q=d?Math.min(1,left/d):0;return[lerp(pts[i-1][0],pts[i][0],q),lerp(pts[i-1][1],pts[i][1],q)];}left-=d;}return pts[pts.length-1];}
