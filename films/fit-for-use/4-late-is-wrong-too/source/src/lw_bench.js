/* ===== Late is wrong too: the university's things, on the quality bench =====
   This film's own pictures for the bench, in the kit's look (films/fit-for-use/shared, never changed for one film): the bench at night
   under its lamp (lw_night, the same room as the bench by day, so the morning comes in a glide), the student system and its nightly
   file, the graduation list, the platform's monitoring and dbt's freshness check, the uses and their clocks, the list's rule in dbt, the
   six dimensions as Rules that run left them, the list with its age, the printer's page, and the jobs with their run conditions. Brass
   is the requirement (how fresh a use needs the list), steel blue a measure (how old the data is), the verdicts' colours their
   verdicts; nothing else here uses them. Every top-level name starts with lw_ or LW_. */

// made once per chapter, the first time it draws: its cues are known by then
const lw_once=(sc,fn)=>sc.__lw||(sc.__lw=fn());
// when the chapter starts in the film: people breathe and blink on the film's clock
const lw_g0=sc=>{let s=0;for(const x of SCENES){if(x.id===sc.id)return s;s+=x.dur;}return s;};
// a card that springs in at t0 and goes at t1 (or stays): its k (seconds since it started, as the kit's cards take it) and its a
const lw_pop=(t,t0,t1,d)=>({k:Math.max(0,t-t0),a:t1==null?ag_in(t,t0,d||0.35):ag_io(t,t0,t1,d||0.35)});
// draws fn whole into a buffer, then lays it over at opacity a: a group that fades doesn't show through itself (never nested)
function lw_whole(ctx,a,fn){if(!(a>0.004))return;if(a>=0.995){fn(ctx);return;}const [bc,bx]=ag_buf("lwWhole",ctx.canvas.width,ctx.canvas.height);bx.setTransform(ctx.getTransform());
  fn(bx);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha*=a;ctx.drawImage(bc,0,0);ctx.restore();}
// where people stand behind the bench: their y, size, and the height they're cut at
const LW_P={y:588,s:0.98,cut:DQ_BENCH.back};
// a person behind the bench, faded as one picture (the kit's people do that when the alpha is under 1)
function lw_who(ctx,who,x,G,a,o){if(!(a>0.004))return;ctx.save();ctx.globalAlpha*=a;dq_person(ctx,who,x,LW_P.y,LW_P.s,Object.assign({t:G,cut:LW_P.cut},o||{}));ctx.restore();}
// the place and year, on a small card at the top left, in screen space
function lw_tag(ctx,S,s,a){if(!(a>0.004)||!s)return;ctx.save();setScreen(ctx,S);const f={w:500,size:28,f:"mono"},w=dq_tw(ctx,s,f)+48,x=64,y=52,h=56;ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(40,30,20,0.22)";ctx.shadowBlur=18;ctx.shadowOffsetX=-5;ctx.shadowOffsetY=6;rr(ctx,x,y,w,h,10);ctx.fillStyle=rgba(DQ.paper,0.96);ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(110,90,66,0.3)";ctx.lineWidth=1.2;rr(ctx,x,y,w,h,10);ctx.stroke();dq_T(ctx,s,x+24,y+38,f);ctx.restore();}
// the latest of [[t, words], ...] that has begun: the one before leaves over the first half of d seconds, then it comes in over the
// second (never two words in one place at once); null words hide it
function lw_tags(ctx,S,t,list,a,d){a=a==null?1:a;d=d||0.6;let i=-1;for(let k=0;k<list.length;k++)if(t>=list[k][0])i=k;if(i<0)return;
  const h=d/2,u=(t-list[i][0])/h;if(i>0&&u<1){lw_tag(ctx,S,list[i-1][1],a*(1-ag_sine(u)));return;}lw_tag(ctx,S,list[i][1],a*ag_sine(i>0?u-1:(t-list[0][0])/0.6));}
// the day, on a chip under the kicker, in screen space
function lw_date(ctx,S,s,a){if(!(a>0.004))return;setScreen(ctx,S);dq_chip(ctx,96,166,s,{icon:"calendar",a});}

/* ---------------------------------------------------------------- the bench at night
   The bench by day with the sun gone from the wall, the room dark, and the pendant lamp lit over the right of the bench, where the
   list lies; the wall stays dark at the top left, so the kicker is written on it in chalk. One room with the bench by day. */
const LW_LAMP=[1250,138];
function lw_paintNight(c){dq_paintBench(c,{sun:0});
  c.fillStyle="rgba(14,13,20,0.6)";c.fillRect(0,0,W,H);
  // the lamp's warm light on the wall and the bench below it
  c.save();c.globalCompositeOperation="lighter";let g=c.createRadialGradient(LW_LAMP[0],LW_LAMP[1]+330,30,LW_LAMP[0],LW_LAMP[1]+330,860);
  g.addColorStop(0,"rgba(128,96,58,0.34)");g.addColorStop(0.55,"rgba(96,70,40,0.12)");g.addColorStop(1,"rgba(96,70,40,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  c.beginPath();c.rect(0,DQ_BENCH.back,W,DQ_BENCH.front-DQ_BENCH.back);c.clip();dq_pool(c,LW_LAMP[0],DQ_BENCH.back+40,640,[255,214,160],0.16,0.18);c.restore();
  // the window on the right, dark: a faint cool light on the wall's edge
  g=c.createLinearGradient(W,0,W-420,0);g.addColorStop(0,"rgba(120,140,170,0.07)");g.addColorStop(1,"rgba(120,140,170,0)");c.fillStyle=g;c.fillRect(W-420,0,420,DQ_BENCH.back);
  dq_lamp(c,LW_LAMP[0],LW_LAMP[1],0.9,{on:1});}
AG_PLACES.lw_night=lw_paintNight;AG_ROOMS.lw_night="bench";

/* ---------------------------------------------------------------- the night's files */
// a file: a sheet with its corner folded, its name, and when it came (o.when, typed; o.whenA its own fade). o.dash: it isn't there (an outline, words in the
// quiet tone; o.dark on the night's wall); o.whenCol, o.a, o.k (springs from its middle). x, y its top left; LW_FILE its size
const LW_FILE={w:350,h:150};
function lw_fileShape(ctx,x,y,w,h){const c=34;ctx.beginPath();ctx.moveTo(x+6,y);ctx.lineTo(x+w-c,y);ctx.lineTo(x+w,y+c);ctx.lineTo(x+w,y+h-6);ctx.quadraticCurveTo(x+w,y+h,x+w-6,y+h);
  ctx.lineTo(x+6,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-6);ctx.lineTo(x,y+6);ctx.quadraticCurveTo(x,y,x+6,y);ctx.closePath();}
function lw_file(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=LW_FILE.w,h=LW_FILE.h;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  if(o.dash){const q=o.dark?DQ.chalkSoft:DQ.soft;ctx.lineWidth=2.6;ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(q,0.9);lw_fileShape(ctx,x,y,w,h);ctx.stroke();ctx.setLineDash([]);
    dq_T(ctx,o.title||"Nightly file",x+28,y+62,{w:700,size:30,col:q});if(o.when)dq_T(ctx,o.when,x+28,y+110,{w:500,size:28,f:"mono",col:q});ctx.restore();return;}
  ctx.save();dq_shadow(ctx,o.on);lw_fileShape(ctx,x,y,w,h);ctx.fillStyle=rgba(DQ.paper,1);ctx.fill();ctx.restore();
  ctx.lineWidth=1.2;ctx.strokeStyle="rgba(110,90,66,0.32)";lw_fileShape(ctx,x,y,w,h);ctx.stroke();
  ctx.fillStyle=rgba(mix(DQ.paper,[150,130,100],0.2),1);ctx.beginPath();ctx.moveTo(x+w-34,y);ctx.lineTo(x+w-34,y+34);ctx.lineTo(x+w,y+34);ctx.closePath();ctx.fill();ctx.stroke();
  dq_T(ctx,o.title||"Nightly file",x+28,y+62,{w:700,size:30});if(o.when)dq_T(ctx,o.when,x+28,y+110,{w:500,size:28,f:"mono",col:o.whenCol||DQ.soft,a:o.whenA==null?1:o.whenA});
  ctx.restore();}
// an arrow from (x0, y0) to (x1, y1), drawn on as u goes 0 to 1: o.col (a CSS colour), o.dark (on the night's wall), o.dash, o.lw, o.a
function lw_arrow(ctx,x0,y0,x1,y1,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:clamp(o.u,0,1);if(a<=0.004||u<=0.004)return;const e=ag_sine(u),xe=lerp(x0,x1,e),ye=lerp(y0,y1,e),an=Math.atan2(y1-y0,x1-x0);
  ctx.save();ctx.globalAlpha*=a;const col=o.col||(o.dark?rgba(DQ.chalkSoft,0.9):rgba(DQ.soft,0.85));ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=o.lw||4;ctx.lineCap="round";
  if(o.dash)ctx.setLineDash([12,11]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe-Math.cos(an)*14,ye-Math.sin(an)*14);ctx.stroke();ctx.setLineDash([]);
  ctx.translate(xe,ye);ctx.rotate(an);ctx.beginPath();ctx.moveTo(4,0);ctx.lineTo(-18,-12);ctx.lineTo(-18,12);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the graduation list
   A card: its name, how many graduates (o.count, faded by o.countA, in o.countCol), and its rows, faint bars of names and awards (a
   picture: no words), in columns set by the card's width, with room for a tick at the right. o.ghost (0 to 1) adds three dashed red
   rows under them, for those missing, and o.ghostText on the line under the rows; o.fill (0 to 1) makes those rows solid, and o.ticks
   (0 to 1, o.fill by default) ticks each, green, as a person checks them; o.note, words on that same line once they're solid
   (o.noteCol, o.noteA). x, y its top left; o.w (640), o.h (520), o.on, o.edge, o.a, o.k */
function lw_count(ctx,x,y,s,a,col){if(!(a>0.004))return;dq_T(ctx,String(s),x+DQ_PAD,y+138,{w:800,size:64,col:col||DQ.ink,a});
  dq_T(ctx,"graduates",x+DQ_PAD+dq_tw(ctx,String(s),{w:800,size:64})+16,y+138,{w:600,size:30,col:DQ.soft,a});}
function lw_list(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||640,h=o.h||520;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{on:o.on,edge:o.edge});dq_label(ctx,x+DQ_PAD,y+56,"The graduation list",{});dq_icon(ctx,"list",x+w-DQ_PAD-20,y+46,40,DQ.soft);
  if(o.count!=null)lw_count(ctx,x,y,o.count,o.countA==null?1:o.countA,o.countCol);
  // the rows: a name and an award on each, as faint bars; the name's column takes about half the width, the award's starts past it
  const R=ag_rnd(689),iw=w-2*DQ_PAD,nx=x+DQ_PAD,ax=nx+Math.round(iw*0.56),nw=Math.round(iw*0.48),aw=Math.round(iw*0.3),y0=y+208,rh=38,
    bar=(bx,by,bw,col)=>{ctx.fillStyle=col;rr(ctx,bx,by-9,bw,18,9);ctx.fill();},rows=[];
  for(let i=0;i<7;i++)rows.push([nw*(0.55+R()*0.45),aw*(0.6+R()*0.4)]);
  for(let i=0;i<4;i++){const ry=y0+i*rh;bar(nx,ry,rows[i][0],"rgba(110,90,66,0.2)");bar(ax,ry,rows[i][1],"rgba(110,90,66,0.14)");
    ctx.fillStyle="rgba(110,90,66,0.12)";ctx.fillRect(nx,ry+rh/2,iw,1.2);}
  const g=clamp(o.ghost||0,0,1),f=clamp(o.fill||0,0,1),tk=clamp(o.ticks==null?f:o.ticks,0,1);
  for(let i=0;i<3;i++){const ry=y0+(4+i)*rh;if(g>0.004&&f<0.995){ctx.save();ctx.globalAlpha*=g*(1-f);ctx.strokeStyle=rgba(DQ_TONE.stop.col,0.95);ctx.lineWidth=2.4;ctx.setLineDash([9,7]);
      rr(ctx,nx,ry-11,nw,22,11);ctx.stroke();rr(ctx,ax,ry-11,aw,22,11);ctx.stroke();ctx.restore();}
    if(f>0.004){ctx.save();ctx.globalAlpha*=f;bar(nx,ry,rows[4+i][0],"rgba(110,90,66,0.2)");bar(ax,ry,rows[4+i][1],"rgba(110,90,66,0.14)");ctx.restore();}
    const ti=clamp(tk*3-i,0,1);if(ti>0.004)dq_icon(ctx,"tick",x+w-DQ_PAD-14,ry,28,"pass",{a:ag_sine(ti)});}
  // the line under the rows: those missing, or what is done with them
  const ly=y0+6*rh+50;
  if(o.ghostText&&g>0.004)dq_T(ctx,o.ghostText,nx,ly,{w:800,size:30,col:"stop",a:g*(1-f)});
  if(o.note)dq_T(ctx,o.note,nx,ly,{w:800,size:30,col:o.noteCol||"hold",a:o.noteA==null?1:o.noteA});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the platform's monitoring, and dbt's freshness check
   Drawn for the film, never a screenshot (tools.js): Databricks' monitoring as a table of the source tables, when each was last
   updated, and late or on time; dbt's freshness check as the lines it prints, its verdicts in their colours. */
const LW_TABLES=[["student_system.graduations","Wed 17 Jun, 02:00",1],["student_system.results","Wed 17 Jun, 02:00",1],["student_system.learners","Wed 17 Jun, 02:00",1],
  ["portal.name_confirmations","Thu 18 Jun, 02:00",0]];
function lw_monitor(ctx,x,y,o){o=o||{};return dq_window(ctx,x,y,1100,440,{logo:"databricks",product:"Databricks",title:"Data quality monitoring",a:o.a,k:o.k,draw:(c,b)=>{
  dq_rows(c,b.x+10,b.y,[{h:"Table",w:520,f:"mono"},{h:"Last updated",w:330},{h:"",w:190}],
    LW_TABLES.map(([n,at,late])=>[n,at,late?{s:"late",col:"hold",icon:"clock"}:{s:"on time",col:"pass",icon:"tick"}]),
    {rh:62,lit:o.lit,litCol:"hold",rowA:(r,i)=>o.rowA?o.rowA(r,i):1});}});}
// dbt's freshness check, as it prints: o.lines [[verdict, table], ...], o.lineA(line, i), o.cmd (the command), o.title
function lw_cli(ctx,x,y,o){o=o||{};const L=[[["$ dbt source freshness",DQ.soft]]].concat((o.lines||[]).map(([v,s])=>[[v==="pass"?"PASS":v==="warn"?"WARN":"ERROR STALE",v==="pass"?"pass":v==="warn"?"hold":"stop"],["  freshness of "+s,null]]));
  return dq_window(ctx,x,y,1100,o.h||360,{logo:"dbt",product:"dbt",title:o.title||"freshness",a:o.a,k:o.k,draw:(c,b)=>dq_code(c,b.x+12,b.y,L,{lh:50,w:b.w-24,lit:o.lit,lineA:(l,i)=>i&&o.lineA?o.lineA(l,i-1):1})});}
// a project file, typed, in dbt's window: o.lines (as dq_code takes them), o.lit, o.lineA, o.title, o.h, o.lh (48)
function lw_yml(ctx,x,y,w,o){o=o||{};const lh=o.lh||48;return dq_window(ctx,x,y,w,o.h||(o.lines.length*lh+130),{logo:o.logo===undefined?"dbt":o.logo,product:o.product||"dbt",title:o.title,a:o.a,k:o.k,edge:o.edge,
  draw:(c,b)=>dq_code(c,b.x+12,b.y,o.lines,{lh,w:b.w-24,lit:o.lit,lineA:o.lineA})});}

/* ---------------------------------------------------------------- the send to the printer
   A card for the send: when it's due, and where it goes; a tag on it says whether it's held, waiting or sent. */
function lw_send(ctx,x,y,o){o=o||{};return dq_textCard(ctx,x,y,o.w||440,{kick:o.kick||"Due at 5 pm",title:o.title||"Send to the printer"},{icon:"printer",edge:o.edge,a:o.a,k:o.k,on:o.on});}
// six certificates, posted late: small cards in a row, each with its envelope; u (0 to 1) brings them in one by one
function lw_posted(ctx,x,y,u,a){if(a<=0.004)return;for(let i=0;i<6;i++){const v=ag_sine(clamp(u*6-i,0,1));if(v<=0.004)continue;const cx=x+i*150;ctx.save();ctx.globalAlpha*=a*v;
  dq_card(ctx,cx,y+(1-v)*24,124,92,{r:6});dq_icon(ctx,"certificate",cx+62,y+(1-v)*24+46,54,DQ.soft);dq_icon(ctx,"mail",cx+100,y+(1-v)*24+94,36,"stop");ctx.restore();}}

/* ---------------------------------------------------------------- how fresh, for what
   The six dimensions of Rules that run, as signs: timeliness in pencil, "no checks yet", until its first rule (o.first, 0 to 1) inks it
   in brass. x, y the top left of the card that holds them. */
const LW_DIMS=["Completeness","Uniqueness","Validity","Consistency","Accuracy","Timeliness"];
function lw_dims(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=1240,h=310,fst=clamp(o.first||0,0,1);ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));dq_card(ctx,x,y,w,h,{on:o.on});
  dq_label(ctx,x+DQ_PAD,y+56,"The six dimensions · Rules that run",{});
  LW_DIMS.forEach((s,i)=>{const cx=x+DQ_PAD+(i%3)*360,cy=y+120+Math.floor(i/3)*100,tl=i===5;
    if(!tl){dq_chip(ctx,cx,cy,s,{icon:"tick"});return;}
    // timeliness: in pencil, then inked
    const tw=dq_tw(ctx,s,{w:700,size:28})+84,hh=54;if(fst<0.995){ctx.save();ctx.globalAlpha*=1-fst;ctx.strokeStyle=rgba(DQ.dim,1);ctx.lineWidth=2;ctx.setLineDash([7,7]);rr(ctx,cx,cy-hh/2,tw,hh,hh/2);ctx.stroke();
      ctx.setLineDash([]);dq_icon(ctx,"dash",cx+36,cy,30,DQ_TONE.none.word);dq_T(ctx,s,cx+62,cy+10,{w:700,size:28,col:DQ_TONE.none.word});
      dq_T(ctx,"no checks yet",cx+tw+20,cy+10,{w:600,size:28,col:DQ_TONE.none.word});ctx.restore();}
    if(fst>0.004){ctx.save();ctx.globalAlpha*=fst;dq_chip(ctx,cx,cy,s,{icon:"clock",col:"brass"});dq_T(ctx,"its first rule",cx+tw+20,cy+10,{w:700,size:28,col:"brass"});ctx.restore();}});
  ctx.restore();}

/* ---------------------------------------------------------------- the list says how old it is
   The list as a table: each graduate and award, and its sources' age; o.cells (0 to 1) brings the two age columns in, o.lit lights
   them (steel), and o.vals gives that Thursday's values, the student system's in amber (30 hours old), the portal's in green. */
const LW_ROWS=[["Amara Osei","Bachelor of Nursing"],["Liu Wei","Master of Engineering"],["Sofía Torres","Bachelor of Arts"]];
function lw_table(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=1500,h=390,ca=clamp(o.cells==null?1:o.cells,0,1),ss=o.ss||"Wed 17 Jun, 02:00",po=o.po||"Thu 18 Jun, 02:00";
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));dq_card(ctx,x,y,w,h,{on:o.on});
  dq_label(ctx,x+DQ_PAD,y+56,"The graduation list",{});
  const cols=[{h:"Graduate",w:300},{h:"Award",w:380},{h:"Student system as of",w:410,f:"mono"},{h:"Portal as of",w:360,f:"mono"}];
  const sc=o.ssCol||null,pc=o.poCol||null,rows=LW_ROWS.map(r=>[r[0],r[1],{s:ss,col:sc},{s:po,col:pc}]);
  // the age columns come in as one: drawn over the table, faded in, so their words never show twice
  dq_rows(ctx,x+DQ_PAD,y+80,cols.slice(0,2).concat([{h:"",w:410},{h:"",w:360}]),rows.map(r=>[r[0],r[1],"",""]),{rh:66});
  if(ca>0.004){ctx.save();ctx.globalAlpha*=ca;const ax=x+DQ_PAD+680;
    if(o.lit>0.004){ctx.save();ctx.globalAlpha*=clamp(o.lit,0,1);ctx.fillStyle=rgba(DQ.steel,0.12);rr(ctx,ax-6,y+86,776,66*4-12,10);ctx.fill();ctx.fillStyle=rgba(DQ.steel,1);rr(ctx,ax-6,y+86,776,6,3);ctx.fill();ctx.restore();}
    dq_rows(ctx,ax,y+80,cols.slice(2),rows.map(r=>[r[2],r[3]]),{rh:66});ctx.restore();}
  ctx.restore();}
// the printer's file: its first page, with the list's age at the top. x, y its top left; o.ss, o.po (the sources' age), o.ssCol, o.poCol,
// o.title (the ceremonies), o.none (a page that doesn't say: "as of ?" in red, instead of the age)
function lw_page(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=o.w||1040,h=o.h||420;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));dq_card(ctx,x,y,w,h,{on:o.on,r:4,fill:"rgb(253,251,246)"});
  dq_label(ctx,x+40,y+60,"To the printer",{});dq_icon(ctx,"printer",x+w-60,y+50,40,DQ.soft);
  dq_T(ctx,o.title||"Graduation list · July 2026 ceremonies",x+40,y+120,{w:800,size:34});
  if(o.none){dq_T(ctx,"As of ?",x+40,y+176,{w:800,size:30,col:"stop"});}
  else{const f={w:600,size:28};dq_T(ctx,"Student system data as of",x+40,y+176,Object.assign({col:DQ.soft},f));const sx=x+40+dq_tw(ctx,"Student system data as of ",f),su=clamp(o.ssU||0,0,1);
    // a newer age (o.ss2, in o.ss2Col) takes the place of the old one as o.ssU goes 0 to 1: the old leaves, then the new comes
    if(su<0.5)dq_T(ctx,o.ss||"Wed 17 Jun, 02:00",sx,y+176,{w:500,size:28,f:"mono",col:o.ssCol||DQ.ink,a:1-ag_sine(su*2)});
    if(o.ss2&&su>0.5)dq_T(ctx,o.ss2,sx,y+176,{w:500,size:28,f:"mono",col:o.ss2Col||DQ.ink,a:ag_sine(su*2-1)});
    dq_T(ctx,"Portal as of",x+40,y+220,Object.assign({col:DQ.soft},f));dq_T(ctx,o.po||"Thu 18 Jun, 02:00",x+40+dq_tw(ctx,"Portal as of ",f),y+220,{w:500,size:28,f:"mono",col:o.poCol||DQ.ink});}
  ctx.fillStyle="rgba(110,90,66,0.3)";ctx.fillRect(x+40,y+250,w-80,1.6);
  // the list under it, as faint lines (a picture: no words)
  const R=ag_rnd(712);for(let i=0;i<Math.floor((h-290)/34);i++){const ry=y+286+i*34;ctx.fillStyle="rgba(110,90,66,0.16)";rr(ctx,x+40,ry,180+R()*160,14,7);ctx.fill();rr(ctx,x+460,ry,140+R()*120,14,7);ctx.fill();}
  ctx.restore();}
// the volunteers' three flags, small, on a card: the same signal, read by everyone
function lw_flagCard(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+130,y+170,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,260,340,{on:o.on});ctx.save();rr(ctx,x+2,y+2,256,336,8);ctx.clip();ctx.translate(x+90,y+318);ctx.scale(0.72,0.72);ctx.translate(-LW_SPOT.pole[0],-LW_SPOT.pole[1]);lw_flags(ctx,3,t,{wind:0.7});ctx.restore();
  ctx.restore();}

/* ---------------------------------------------------------------- the jobs
   A job in Lakeflow Jobs, drawn for the film: two tasks joined left to right, the second's run condition under the join. Each task a
   card with its state: o.states [first, second], each "pass" (it succeeded), "stop" (it failed), "wait" (not run: dashed, grey) or
   null (not yet). o.tell: who the failed check tells, under it (0 to 1). x, y its top left. */
function lw_task(ctx,x,y,w,h,name,st){const tone=st==="pass"?"pass":st==="stop"?"stop":null;
  if(st==="wait"){dq_card(ctx,x,y,w,h,{dash:true});dq_icon(ctx,"hourglass",x+44,y+h/2,34,"none");dq_T(ctx,name,x+80,y+h/2+10,{w:700,size:30,col:"none"});return;}
  dq_card(ctx,x,y,w,h,{edge:tone});if(tone)dq_icon(ctx,tone==="pass"?"tick":"cross",x+44,y+h/2,34,tone);else dq_icon(ctx,"tools",x+44,y+h/2,34,DQ.soft);
  dq_T(ctx,name,x+80,y+h/2+10,{w:700,size:30});}
function lw_job(ctx,x,y,o){o=o||{};const w=1240,h=o.h||420,st=o.states||[null,null];return dq_window(ctx,x,y,w,h,{logo:"databricks",product:"Databricks",title:"Lakeflow Jobs · "+o.job,a:o.a,k:o.k,draw:(c,b)=>{
  const tw=440,th=104,ty=b.y+40,x0=b.x+20,x1=b.x+b.w-20-tw;lw_task(c,x0,ty,tw,th,o.tasks[0],st[0]);lw_task(c,x1,ty,tw,th,o.tasks[1],st[1]);
  lw_arrow(c,x0+tw+12,ty+th/2,x1-12,ty+th/2,{});
  dq_T(c,"Run if",x1,ty+th+50,{w:800,size:28,col:DQ.soft});dq_T(c,o.runIf,x1+dq_tw(c,"Run if  ",{w:800,size:28}),ty+th+50,{w:700,size:28});
  const tl=clamp(o.tell||0,0,1);if(tl>0.004&&o.who){c.save();c.globalAlpha*=tl;dq_icon(c,"mail",x0+40,ty+th+60,34,"stop");dq_T(c,o.who,x0+80,ty+th+70,{w:700,size:28,col:"stop"});c.restore();}}});}
