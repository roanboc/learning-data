/* ===== Show the least: what is shown in the hall =====
   Cards of frosted glass in the module's hall (glass.js), each in the colour of what it means: violet hidden personal data (stars,
   codes, "fewer than 10"), coral closed or a match that leaks, cyan an identity, gold only the chip on the sealed key. Frost over a
   value means one thing here: encryption. The class chips are drawn as Know what you hold draws them: solid pills with dark words,
   special violet with a double rim, direct violet, pseudonymous lilac, indirect pale lilac, none clear ice with ice words.
   Every value changes in its cell: the old one leaves before the new one comes in, so two are never readable at once. */

AG_PLACES.slHall=c=>dp_paintHall(c,{seed:12,horizon:700,vx:1240,pools:[[1560,960,560,0.11],[620,900,700,0.06]]});
function sl_once(sc,k,fn){sc.__sl=sc.__sl||{};if(!(k in sc.__sl))sc.__sl[k]=fn();return sc.__sl[k];}
// a value's change in place: the old one out over the first half of u, the new one in over the second
const sl_out=u=>1-ag_sine(clamp(u*2,0,1)),sl_inn=u=>ag_sine(clamp(u*2-1,0,1));

/* ---------------------------------------------------------------- chips: a column's class, a table's level */
const SL_CLS={special:{col:"violet",dbl:true},direct:{col:"violet"},pseudonymous:{col:[204,186,255]},indirect:{col:"violet2"},none:{glass:true}};
// a class chip, its words' baseline at y; align "right" puts its right edge at x; returns its width
function sl_chip(ctx,x,y,cls,o){o=o||{};const C=SL_CLS[cls],a=o.a==null?1:o.a,size=o.size||28;if(!C||a<=0)return 0;
  const w=dp_tw(ctx,cls,{w:700,size})+36,h=size+20,x0=o.align==="right"?x-w:o.align==="center"?x-w/2:x;
  if(!C.glass){dp_pill(ctx,x0,y,cls,C.col,{size,a,glow:o.glow});
    if(C.dbl){ctx.save();ctx.globalAlpha*=a;rr(ctx,x0-5,y-h+7,w+10,h+10,h/2+5);ctx.strokeStyle=rgba(mix(dp_f("violet"),[255,255,255],0.3),1);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
    return w;}
  ctx.save();ctx.globalAlpha*=a;rr(ctx,x0,y-h+12,w,h,h/2);ctx.fillStyle="rgba(8,26,32,0.72)";ctx.fill();ctx.strokeStyle=rgba(DP.ice,0.85);ctx.lineWidth=1.8;ctx.stroke();
  dp_T(ctx,cls,x0+18,y-1,{w:700,size,col:"ink"});ctx.restore();return w;}
// a table's level, on a glass pill: confidential, restricted (rimmed in violet), public
function sl_level(ctx,x,y,lv,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return 0;const size=28,w=dp_tw(ctx,lv,{w:600,size})+36,h=48,x0=o.align==="right"?x-w:x;
  ctx.save();ctx.globalAlpha*=a;rr(ctx,x0,y-h+12,w,h,12);ctx.fillStyle="rgba(8,26,32,0.8)";ctx.fill();ctx.strokeStyle=lv==="restricted"?rgba(dp_f("violet"),1):rgba(DP.F.grey,0.9);ctx.lineWidth=lv==="restricted"?2.6:1.6;ctx.stroke();
  dp_T(ctx,lv,x0+18,y-1,{w:600,size,col:lv==="restricted"?"violet":"mut"});ctx.restore();return w;}

/* ---------------------------------------------------------------- Samuel's record, field by field
   rows: [{label, label2, lu, v, v2, u, mono, col, col2, chip, chip2, cu, chipA, lit, a, blank}]: v the value as it is, v2 what it
   becomes (u from 0 to 1), in its colour (col: "violet" for hidden ones) and mono for codes; label2 a new label (over lu); chip the
   column's class (and chip2 what it becomes, over cu; chipA fades it); lit lights the row; a fades it; blank draws no value.
   o: title (and title2, what it becomes over tu), level (levelA), a, k (springs it in), w, col, behind */
const SL_RW=58;
function sl_recordH(rows){return 120+rows.length*SL_RW+8;}
function sl_record(ctx,x,y,rows,o){o=o||{};const w=o.w||980,h=sl_recordH(rows),a=o.a==null?1:o.a;if(a<=0)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:20,behind:o.behind});
  // the title, which may change in place (title2, over tu)
  const tu=o.title2?clamp(o.tu||0,0,1):0;if(tu<1)dp_T(ctx,o.title||"Learner records",x+30,y+58,{w:700,size:36,a:o.title2?sl_out(tu):1});if(tu>0)dp_T(ctx,o.title2,x+30,y+58,{w:700,size:36,a:sl_inn(tu)});
  if(o.level)sl_level(ctx,x+w-30,y+58,o.level,{align:"right",a:o.levelA==null?1:o.levelA});
  ctx.fillStyle=rgba(DP.ice,0.25);ctx.fillRect(x+30,y+86,w-60,1.5);
  rows.forEach((r,i)=>{const by=y+138+i*SL_RW,ra=r.a==null?1:r.a;if(ra<=0)return;ctx.save();ctx.globalAlpha*=ra;
    if(r.lit>0){ctx.save();ctx.globalAlpha*=clamp(r.lit,0,1);rr(ctx,x+14,by-40,w-28,54,12);ctx.fillStyle="rgba(120,220,235,0.10)";ctx.fill();ctx.fillStyle=rgba(DP.F.cyan,0.95);ctx.fillRect(x+14,by-34,4,42);ctx.restore();}
    const lu=r.label2?(r.lu==null?r.u||0:r.lu):0;
    if(lu<1)dp_T(ctx,r.label,x+30,by,{w:600,size:28,col:"mut",a:r.label2?sl_out(lu):1});if(r.label2&&lu>0)dp_T(ctx,r.label2,x+30,by,{w:600,size:28,col:"mut",a:sl_inn(lu)});
    const u=r.v2!=null?clamp(r.u||0,0,1):0,vx=x+290;
    const val=(s,col,mono,va)=>{if(s==null||va<=0)return;if(s==="")return;dp_T(ctx,s,vx,by,{w:mono?500:600,size:28,f:mono?"mono":undefined,col:col||"ink",a:va});};
    if(r.blank){ctx.fillStyle=rgba(DP.F.grey,0.35);rr(ctx,vx,by-22,200,16,8);ctx.fill();}
    else{val(r.v,r.col,r.mono,u>0?sl_out(u):1);if(r.v2!=null)val(r.v2,r.col2||r.col,r.mono2==null?r.mono:r.mono2,sl_inn(u));}
    if(r.chip){const cu=r.chip2?clamp(r.cu||0,0,1):0;if(cu<1)sl_chip(ctx,x+w-30,by,r.chip,{align:"right",a:sl_out(cu)*(r.chipA==null?1:r.chipA)});if(r.chip2&&cu>0)sl_chip(ctx,x+w-30,by,r.chip2,{align:"right",a:sl_inn(cu)});}
    ctx.restore();});
  ctx.restore();return{x,y,w,h};}
// Samuel's record as kept, and each row's place in it
const SL_SAM={num:"S-20412",name:"Samuel Osei",email:"samuel.osei@mail.example",dob:"14 May 1987",course:"Public health",res:"90 of 120",
  plain:"e69dec44…",code:"a7772705…",token:"TKN-0381",desk:["S-***12","s***@mail.example"]};
// where a row's value starts, for a line of light to it
const sl_rowAt=(box,i)=>[box.x+290,box.y+138+i*SL_RW-10];
// a value that changes in its cell, step by step: steps [[t, {s, col, mono}], ...], the first from the start; each change takes d s,
// the old value leaving before the new one comes in; returns the row's v, col, mono and, while it changes, v2, col2, mono2 and u
function sl_steps(t,steps,d){d=d||0.8;let i=0;for(let k=1;k<steps.length;k++)if(t>=steps[k][0])i=k;const cur=steps[i][1];
  if(i>0&&t<steps[i][0]+d){const pv=steps[i-1][1];return{v:pv.s,col:pv.col,mono:!!pv.mono,v2:cur.s,col2:cur.col,mono2:!!cur.mono,u:(t-steps[i][0])/d};}
  return{v:cur.s,col:cur.col,mono:!!cur.mono};}
// the same for a chip: steps [[t, class], ...]; returns chip and, while it changes, chip2 and cu
function sl_chipSteps(t,steps,d){d=d||0.8;let i=0;for(let k=1;k<steps.length;k++)if(t>=steps[k][0])i=k;
  if(i>0&&t<steps[i][0]+d)return{chip:steps[i-1][1],chip2:steps[i][1],cu:(t-steps[i][0])/d};return{chip:steps[i][1]};}

/* ---------------------------------------------------------------- the ways: a tile each, and a way's card with its three answers */
const SL_WAYS=["Leave it out","Mask it whole","Mask it in part","Generalise","Keyed hash","Token","Encryption","Totals, small counts hidden","Filter rows"];
const SL_ANS={
  "Leave it out":["nothing","no","nothing on it"],
  "Mask it whole":["stars","no","counting rows"],
  "Mask it in part":["a part","no","recognising a record"],
  "Generalise":["a year","no","trends by group"],
  "Filter rows":["only your rows","not needed","everything, on your rows"],
  "Keyed hash":["a stable code","only with the key","joins and counts per person"],
  "Token":["a token","yes, by the vault's owner","joins; the real value on request"],
  "Encryption":["unreadable text","yes, with the key","nothing, until it's opened"],
  "Totals, small counts hidden":["totals","no","totals"]};
// the nine tiles, three by three; p[i] springs tile i in, lit[i] lights it
function sl_tiles(ctx,x,y,o){o=o||{};const tw=o.tw||560,th=88,gx=40,gy=26;SL_WAYS.forEach((n,i)=>{const p=o.p?o.p[i]:1,a=(o.a==null?1:o.a)*clamp(p*3,0,1);if(a<=0)return;
    const tx=x+(i%3)*(tw+gx),ty=y+Math.floor(i/3)*(th+gy),lit=o.lit?o.lit[i]||0:0;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,tx+tw/2,ty+th/2,lerp(0.7,1,ag_spr(p,0,0.5)));
    dp_panel(ctx,tx,ty,tw,th,{col:"cyan",r:16,glowA:0.4+0.8*lit});if(lit>0){ctx.save();ctx.globalAlpha*=lit;rr(ctx,tx+3,ty+3,tw-6,th-6,14);ctx.strokeStyle=rgba(mix(DP.F.cyan,[255,255,255],0.5),1);ctx.lineWidth=3;ctx.stroke();ctx.restore();}
    dp_T(ctx,n,tx+tw/2,ty+th/2+11,{w:700,size:30,align:"center"});ctx.restore();});}
// one way's card: its name, and its three answers; returns its box
const SL_Q3=["Sees","Undone","Still works"];
function sl_way(ctx,x,y,w,name,o){o=o||{};const h=264,a=o.a==null?1:o.a,bb={x,y,w,h};if(a<=0)return bb;const A=o.ans||SL_ANS[name];
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20,glowA:1.2});dp_T(ctx,"A WAY TO HIDE A VALUE",x+30,y+48,{w:800,size:28,ls:4,col:"cyan"});
  dp_T(ctx,name,x+30,y+100,{w:700,size:40});
  A.forEach((s,i)=>{const by=y+156+i*42,ia=o.p?clamp(o.p[i]*2,0,1):1;if(ia<=0)return;dp_T(ctx,SL_Q3[i],x+30,by,{w:600,size:28,col:"mut",a:ia});dp_T(ctx,s,x+230,by,{w:700,size:28,a:ia});});
  ctx.restore();return bb;}
// the way card on the right, one way at a time: steps [[t, name or null], ...]; a change takes the old card away over 0.3 s, then
// brings the new one in, its three answers one after another
const SL_WAYAT=[1120,120,720];
function sl_wayAt(ctx,t,steps){const [x,y,w]=SL_WAYAT;let i=-1;for(let k=0;k<steps.length;k++)if(t>=steps[k][0])i=k;if(i<0)return;
  const [t0,name]=steps[i],had=i>0&&steps[i-1][1];
  if(had&&t<t0+0.3){sl_way(ctx,x,y,w,steps[i-1][1],{a:1-ag_sine((t-t0)/0.3)});return;}
  if(!name)return;const ts=had?t0+0.3:t0;
  sl_way(ctx,x,y,w,name,{a:ag_in(t,ts,0.4),k:ag_spr(t,ts,0.6),p:[0,1,2].map(j=>ag_in(t,ts+0.5+j*0.35,0.4))});}
// the three questions, on a card, each lit as it's asked
const SL_QS=["What does the reader see?","Can it be undone, and by whom?","What can the reader still work out?"];
function sl_questions(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=96+3*58;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20});dp_T(ctx,"THREE QUESTIONS",x+30,y+50,{w:800,size:28,ls:4,col:"cyan"});
  SL_QS.forEach((q,i)=>{const p=o.p?o.p[i]:1;if(p<=0)return;const by=y+108+i*58;ctx.save();ctx.globalAlpha*=clamp(p*2,0,1);
    ctx.beginPath();ctx.arc(x+48,by-10,19,0,TAU);ctx.fillStyle=rgba(DP.F.cyan,1);ctx.fill();dp_T(ctx,String(i+1),x+48,by,{w:800,size:28,align:"center",col:DP.on});
    dp_T(ctx,q,x+84,by,{w:700,size:32});ctx.restore();});ctx.restore();}

/* ---------------------------------------------------------------- the agreement, as An agreement first writes it */
const SL_AGREE={"May have":"Each learner's course and results; their year of birth; a code in place of who they are",
  "Never":"Anything that names a learner; anything about their health","From":"The registrar's learner records: 2,614 learners",
  "May leave":"Totals, with any count under 10 hidden"};
// rows: the lines to show, in order; lit: {line: 0..1}; returns the box and each line's first baseline
function sl_agree(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,lines=[],inner=w-60-170;let yy=y+138;
  for(const k of rows){const wr=ag_wrap(ctx,SL_AGREE[k],inner,{w:600,size:28});lines.push([k,wr,yy]);yy+=wr.length*38+18;}
  const h=yy-y+6+(o.from?52:0),bb={x,y,w,h,at:{}};lines.forEach(([k,wr,by])=>bb.at[k]=[x+200,by-10,wr.length]);if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20});dp_T(ctx,"DATA SHARING AGREEMENT 2026-14",x+30,y+50,{w:800,size:28,ls:3,col:"cyan"});
  dp_T(ctx,"For a study in the Faculty of Health",x+30,y+94,{w:700,size:32});
  for(const [k,wr,by] of lines){const l=o.lit&&o.lit[k]||0,dim=o.dim==null?0.55:o.dim,la=lerp(o.lit?dim:1,1,l);
    if(l>0){ctx.save();ctx.globalAlpha*=l;ctx.fillStyle=rgba(DP.F.cyan,1);ctx.fillRect(x+16,by-30,4,wr.length*38+4);ctx.restore();}
    dp_T(ctx,k,x+30,by,{w:700,size:28,col:"cyan",a:la});wr.forEach((s,j)=>dp_T(ctx,s,x+200,by+j*38,{w:600,size:28,col:l>0.5?"ink":"mut",a:la}));}
  if(o.from)dp_T(ctx,o.from,x+30,y+h-30,{w:600,size:28,col:"mut"});
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- the other cards */
// the support table: one column, exam support, its values never drawn; closed shows it isn't given (coral)
function sl_support(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=196;if(a<=0)return{x,y,w,h};const cl=clamp(o.closed||0,0,1);ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:cl>0.5?"coral":"violet",r:20});dp_T(ctx,"Support table",x+30,y+58,{w:700,size:36});
  sl_level(ctx,x+w-30,y+58,"restricted",{align:"right"});
  dp_T(ctx,"Exam support",x+30,y+136,{w:600,size:28,col:"mut"});ctx.fillStyle=rgba(DP.F.grey,0.35);rr(ctx,x+290,y+114,170,16,8);ctx.fill();
  if(o.chip!==false)sl_chip(ctx,x+w-30,y+136,"special",{align:"right",a:o.chipA==null?1:o.chipA});
  if(cl>0){ctx.save();ctx.globalAlpha*=cl;rr(ctx,x,y,w,h,20);ctx.fillStyle="rgba(40,12,14,0.55)";ctx.fill();dp_pill(ctx,x+w/2,y+h/2+12,"Not given to the study","coral",{align:"center"});ctx.restore();}
  ctx.restore();return{x,y,w,h};}
// a small card: a title and lines of words, each [text, colour, mono]
function sl_note(ctx,x,y,w,title,lines,o){o=o||{};const a=o.a==null?1:o.a,h=86+lines.length*46;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:18});dp_T(ctx,title,x+28,y+52,{w:700,size:32});
  lines.forEach((l,i)=>{const s=Array.isArray(l)?l:[l];dp_T(ctx,s[0],x+28,y+100+i*46,{w:s[2]?500:600,size:28,f:s[2]?"mono":undefined,col:s[1]||"ink",a:s[3]==null?1:s[3]});});
  ctx.restore();return{x,y,w,h};}
// a small course: five learners' years of birth; one rung in coral (it fits only one)
function sl_course(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=700,h=200;if(a<=0)return;const ys=["1991","1987","1995","2001","1993"];ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));dp_panel(ctx,x,y,w,h,{col:"cyan",r:18});dp_T(ctx,"A small course · year of birth",x+28,y+54,{w:700,size:32});
  ys.forEach((s,i)=>{const cx=x+90+i*130,cy=y+136;dp_T(ctx,s,cx,cy,{w:700,size:30,align:"center"});
    if(i===1&&o.ring>0){ctx.save();ctx.strokeStyle=rgba(dp_f("coral"),1);ctx.lineWidth=3.4;ctx.shadowColor=rgba(dp_f("coral"),0.8);ctx.shadowBlur=10;ctx.beginPath();
      ctx.ellipse(cx,cy-10,58,32,0,-Math.PI/2,-Math.PI/2+TAU*ag_sine(o.ring));ctx.stroke();ctx.restore();}});
  ctx.restore();}
// learners by faculty: six rows; filter slides the other faculties' rows away, and the table keeps only the Faculty of Health's
const SL_ROWS=[["Nursing","Faculty of Health",1],["History","Faculty of Arts",0],["Public health","Faculty of Health",1],["Physics","Faculty of Science",0],["Midwifery","Faculty of Health",1],["Law","Faculty of Law",0]];
function sl_rows(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=740,f=clamp(o.filter||0,0,1);if(a<=0)return;const n=SL_ROWS.length,h0=100+n*50,h1=100+3*50,h=lerp(h0,h1,ag_sine(clamp(f*1.4-0.4,0,1)));
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));dp_panel(ctx,x,y,w,h,{col:"cyan",r:18});
  const t1="Learners · every faculty",t2="Faculty of Health · 2,614 learners",tu=clamp(f*1.4-0.4,0,1);
  if(tu<1)dp_T(ctx,t1,x+28,y+54,{w:700,size:32,a:sl_out(tu)});if(tu>0)dp_T(ctx,t2,x+28,y+54,{w:700,size:32,a:sl_inn(tu)});
  let k=0;SL_ROWS.forEach((r,i)=>{const keep=r[2],gone=keep?0:ag_sine(clamp(f*1.6,0,1)),yy0=y+104+i*50,yy1=y+104+k*50,by=keep?lerp(yy0,yy1,ag_sine(clamp(f*1.4-0.4,0,1))):yy0;if(keep)k++;
    if(gone>=1)return;ctx.save();ctx.globalAlpha*=1-gone;ctx.translate(gone*-120,0);dp_T(ctx,r[0],x+28,by,{w:600,size:28});dp_T(ctx,r[1],x+330,by,{w:600,size:28,col:"mut"});ctx.restore();});
  ctx.restore();}
// the registrar's list: student numbers and the plain scramble of each, which anyone can make again from the list
const SL_LIST=[["S-20410","5440b46d…"],["S-20411","459c5ea5…"],["S-20412","e69dec44…"],["S-20413","dfed4e0e…"],["S-20414","4a088fa6…"]];
function sl_list(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=560,h=96+SL_LIST.length*46;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));dp_panel(ctx,x,y,w,h,{col:"cyan",r:18});dp_T(ctx,"The registrar's list, scrambled",x+28,y+54,{w:700,size:30});
  SL_LIST.forEach((r,i)=>{const by=y+104+i*46,hl=i===2?(o.hl||0):0;if(hl>0){ctx.save();ctx.globalAlpha*=hl;rr(ctx,x+12,by-32,w-24,44,10);ctx.fillStyle=rgba(dp_f("coral"),0.16);ctx.fill();ctx.restore();}
    dp_T(ctx,r[0],x+28,by,{w:500,size:28,f:"mono"});dp_T(ctx,r[1],x+250,by,{w:500,size:28,f:"mono",col:"mut"});});
  ctx.restore();return{x,y,w,h,row:i=>[x+w,y+104+i*46-10]};}
// published totals: learners who left after their first year, by course; a cell may read "fewer than 10" or "hidden"
const SL_TOT=[["Nursing","38"],["Midwifery","4"],["Public health","21"],["Health sciences","17"],["Faculty of Health","80"]];
function sl_totals(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=760,h=118+SL_TOT.length*52;if(a<=0)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));dp_panel(ctx,x,y,w,h,{col:"cyan",r:20});dp_T(ctx,"Left after first year · by course",x+30,y+58,{w:700,size:34});
  sl_level(ctx,x+w-30,y+58,"public",{align:"right"});ctx.fillStyle=rgba(DP.ice,0.25);ctx.fillRect(x+30,y+84,w-60,1.5);
  SL_TOT.forEach((r,i)=>{const by=y+130+i*52,tot=i===SL_TOT.length-1,lit=o.lit&&o.lit[i]||0;
    if(lit>0){ctx.save();ctx.globalAlpha*=lit;rr(ctx,x+14,by-36,w-28,50,12);ctx.fillStyle="rgba(120,220,235,0.10)";ctx.fill();ctx.fillStyle=rgba(DP.F.cyan,0.95);ctx.fillRect(x+14,by-30,4,38);ctx.restore();}
    if(tot){ctx.fillStyle=rgba(DP.ice,0.25);ctx.fillRect(x+30,by-40,w-60,1.5);}
    dp_T(ctx,r[0],x+30,by,{w:tot?700:600,size:28,col:tot?"ink":"mut"});
    const u=o.u&&o.u[i]||0,nv=o.nv&&o.nv[i];if(u<1)dp_T(ctx,r[1],x+w-30,by,{w:700,size:30,align:"right",a:nv?sl_out(u):1});if(nv&&u>0)dp_T(ctx,nv,x+w-30,by,{w:700,size:30,align:"right",col:"violet",a:sl_inn(u)});});
  ctx.restore();return{x,y,w,h};}
// a picture of the past on a small pane of glass: a part of a place, and a line under it
function sl_pic(ctx,x,y,w,h,place,src,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,o.k));
  dp_panel(ctx,x,y,w,h+70,{col:"cyan",r:18});ctx.save();rr(ctx,x+12,y+12,w-24,h-24,12);ctx.clip();const [sx,sy,sw,sh]=src;ctx.drawImage(dp_place0(place),sx,sy,sw,sh,x+12,y+12,w-24,h-24);ctx.restore();
  dp_T(ctx,label,x+w/2,y+h+36,{w:700,size:30,align:"center"});ctx.restore();}
// a small pane of glass with a picture in it, painted by paint(ctx, x, y, w, h) inside its frame, and a line under it
function sl_pane(ctx,x,y,w,h,label,paint,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+(h+60)/2,lerp(0.7,1,o.k));
  dp_panel(ctx,x,y,w,h+60,{col:o.col||"cyan",r:18});ctx.save();rr(ctx,x+12,y+12,w-24,h-24,12);ctx.clip();paint(ctx,x+12,y+12,w-24,h-24);ctx.restore();
  rr(ctx,x+12.5,y+12.5,w-25,h-25,12);ctx.strokeStyle=rgba(DP.ice,0.35);ctx.lineWidth=1.4;ctx.stroke();
  dp_T(ctx,label,x+28,y+h+34,{w:700,size:30});ctx.restore();}
// part of a place, filling a pane's frame: the place's sx, sy, sw, sh
const sl_crop=(place,sx,sy,sw,sh)=>(c,x,y,w,h)=>c.drawImage(dp_place0(place),sx,sy,sw,sh,x,y,w,h);
// a corner tag over the past: where and when, top left
function sl_where(ctx,top,title,a){dp_kicker(ctx,top,title,{a});}
