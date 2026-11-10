/* ===== Many hats, one picture: the university, 2027 =====
   The film's own pictures for the data team's year (prefix mh_). The module's kit draws the rooms, the people, the sheets and the
   things in them, and is never changed for this film; what is here is this film's alone:
     mhMorning, mhLate, mhGraham, mhRegistrar   the team's room on a March morning and late in the afternoon, Graham's office on a
                                                grey day, the registrar's office
     mh_parts(ctx, o)                           the five parts of the team's work, a sheet each, on the wall: the timetable (Mei),
                                                the sensors (Sam), the rule (Yusuf), the map (Noor), the models (Jun); under each,
                                                its keeper's deep stroke; over them all, the bar of someone who learns enough of each
     mh_timetable(ctx, x, y, w, h, o)           the registrar's timetable, on a screen: rooms down the side, the hours across
     mh_page(ctx, o)                            Ivy's page: the whole route of Graham's question, from his decision down to who keeps
                                                its data and the rule that applies
     mh_lists(ctx, o)                           the two lists of room names, the timetable's and the sensors' feed's, side by side
     mh_T, mh_sfia, mh_chess, mh_tangle         the T-shape; SFIA's skills on a sheet; a chessboard; a tangle
     mh_lineage(ctx, x, y, w, h, o)             the catalog's lineage, from the raw bookings and counts to the page Graham reads
     mh_goals(ctx, x, y, w, o)                  Ivy's first goals, on a sheet
     mh_print(ctx, x, y, w, o)                  a print of the Kaifeng street on the team room's wall, the canal's water in it
     MH_TB, mh_building(ctx, t, o)              the teaching building cut open, its rooms lit one by one, students in them
   Colour keeps the module's meaning: orange the data (the timetable, the sensors' feed, the models), blue plans and designs (Noor's
   map, the agreed question, Ivy's page, her goals), green what's done, amber what's at risk (the 14 rooms); the rule wears none. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.mhMorning=c=>lp_paintRoom(c,{light:"morning",seed:2});
AG_PLACES.mhLate=c=>lp_paintRoom(c,{light:"late",seed:4});
AG_PLACES.mhGraham=c=>lp_paintRoom(c,{light:"grey",seed:3});
AG_PLACES.mhRegistrar=c=>lp_paintRoom(c,{light:"day",seed:6,base:[218,210,194]});

/* ---------------------------------------------------------------- small pictures for the five parts, in one quiet colour */
function mh_icon(c,kind,x,y,col){c.save();c.translate(x,y);c.strokeStyle=rgba(col,1);c.fillStyle=rgba(col,1);c.lineWidth=4;c.lineCap="round";c.lineJoin="round";
  if(kind==="grid"){// a week's grid, a few hours booked
    for(let i=0;i<6;i++)for(let j=0;j<3;j++){const bx=-56+i*19,by=-26+j*19;if((i*5+j*3)%4===1){c.fillRect(bx,by,15,15);}else{c.lineWidth=2.5;c.strokeRect(bx+1,by+1,13,13);}}}
  else if(kind==="sensor"){// a sensor on the ceiling, counting what's under it
    c.beginPath();c.moveTo(-46,-26);c.lineTo(46,-26);c.stroke();c.beginPath();c.arc(0,-24,15,0,Math.PI);c.fill();c.lineWidth=3.5;
    for(const r of [28,42]){c.beginPath();c.arc(0,-24,r,Math.PI*0.32,Math.PI*0.68);c.stroke();}}
  else if(kind==="rule"){// a shield
    c.beginPath();c.moveTo(0,-30);c.lineTo(26,-21);c.quadraticCurveTo(27,14,0,31);c.quadraticCurveTo(-27,14,-26,-21);c.closePath();c.stroke();
    c.beginPath();c.moveTo(-10,0);c.lineTo(-2,8);c.lineTo(12,-9);c.stroke();}
  else if(kind==="map"){// three places, joined
    const P=[[-44,16],[0,-18],[44,10]];c.beginPath();c.moveTo(P[0][0],P[0][1]);c.lineTo(P[1][0],P[1][1]);c.lineTo(P[2][0],P[2][1]);c.stroke();
    for(const [px,py] of P){c.beginPath();c.arc(px,py,9,0,TAU);c.fill();}}
  else if(kind==="models"){// a table, its rows
    c.lineWidth=3;c.strokeRect(-44,-26,88,52);c.fillRect(-44,-26,88,13);for(const ry of [0,13]){c.beginPath();c.moveTo(-44,ry);c.lineTo(44,ry);c.stroke();}
    c.beginPath();c.moveTo(-10,-13);c.lineTo(-10,26);c.stroke();}
  c.restore();}

/* ---------------------------------------------------------------- the five parts of the team's work, on the wall
   o: a; ks (each sheet's time since it came in, in seconds, or null: there already); light; names (0 to 1, or one per sheet: who keeps
   each, under it); stems (one per sheet, 0 to 1: the deep stroke down from each); stemTop, stemBot; ticks (0 to 1, or one per sheet:
   a green tick, right about it); bar (0 to 1: the bar across their tops, drawn from the left); gap (0 to 1: the amber ring between
   the timetable and the sensors, where something falls between them). */
const MH_PARTS=[{title:"The timetable",who:"Mei",col:LP.orange,icon:"grid"},{title:"The sensors",who:"Sam",col:LP.orange,icon:"sensor"},
  {title:"The rule",who:"Yusuf",col:null,icon:"rule"},{title:"The map",who:"Noor",col:LP.blue,icon:"map"},{title:"The models",who:"Jun",col:LP.orange,icon:"models"}];
const MH_PX=[240,600,960,1320,1680],MH_PY=210,MH_PW=320,MH_PH=200,MH_BAR=164;
const mh_v=(v,i)=>v==null?0:Array.isArray(v)?(v[i]||0):v;
function mh_parts(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const top=o.stemTop||MH_PY+MH_PH+26,bot=o.stemBot||700,ink=rgba(LP.ink,1);ctx.lineCap="round";
  // the bar across their tops, drawn from the left; a drop from it to each sheet, behind the sheet
  // (each stroke fades in as it starts, so it never shows as a dot)
  const bu=ag_sine(o.bar||0);if(bu>0){const x0=70,x1=1850,xe=lerp(x0,x1,bu);ctx.save();ctx.globalAlpha*=clamp(bu*6,0,1);ctx.strokeStyle=ink;ctx.lineWidth=14;
    ctx.beginPath();ctx.moveTo(x0,MH_BAR);ctx.lineTo(xe,MH_BAR);
    for(const px of MH_PX){if(xe<px)continue;const du=clamp((xe-px)/90,0,1);ctx.moveTo(px,MH_BAR);ctx.lineTo(px,lerp(MH_BAR,MH_PY+24,du));}ctx.stroke();ctx.restore();}
  // each keeper's deep stroke, down from their sheet
  ctx.strokeStyle=ink;ctx.lineWidth=14;MH_PARTS.forEach((p,i)=>{const su=ag_sine(mh_v(o.stems,i));if(su<=0)return;ctx.save();ctx.globalAlpha*=clamp(su*6,0,1);
    ctx.beginPath();ctx.moveTo(MH_PX[i],top);ctx.lineTo(MH_PX[i],lerp(top,bot,su));ctx.stroke();ctx.restore();});
  MH_PARTS.forEach((p,i)=>{const k=o.ks?o.ks[i]:null;if(k!=null&&k<=0)return;const x=MH_PX[i]-MH_PW/2,cx=MH_PX[i];
    ctx.save();if(k!=null){ctx.globalAlpha*=ag_in(k,0,0.35);ag_about(ctx,cx,MH_PY+MH_PH/2,lerp(0.6,1,ag_spr(k,0,0.5)));}
    lp_sheet(ctx,x,MH_PY,MH_PW,MH_PH,{col:p.col,light:o.light});
    lp_T(ctx,p.title,cx,MH_PY+100,{w:800,size:36,align:"center"});mh_icon(ctx,p.icon,cx,MH_PY+158,LP.mut);
    const tk=mh_v(o.ticks,i);if(tk>0){ctx.save();ctx.globalAlpha*=ag_in(tk,0,1);const tx=x+MH_PW-34,ty=MH_PY+50,f=lerp(0.6,1,ag_spr(tk*0.6,0,0.5));
      ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(tx,ty,22*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",tx,ty,30*f,[255,255,255]);ctx.restore();}
    ctx.restore();
    const na=mh_v(o.names,i);if(na>0)lp_T(ctx,p.who,cx,MH_PY+MH_PH+50,{w:800,size:32,align:"center",a:ag_sine(na)});});
  // something that falls between the timetable and the sensors
  const gu=o.gap||0;if(gu>0){const gx=(MH_PX[0]+MH_PX[1])/2,gy=MH_PY+MH_PH/2,f=lerp(0.6,1,ag_spr(gu*0.7,0,0.5));ctx.save();ctx.globalAlpha*=ag_in(gu,0,0.5);
    ctx.fillStyle=rgba(LP.paper,0.97);ctx.beginPath();ctx.arc(gx,gy,48*f,0,TAU);ctx.fill();ctx.setLineDash([10,7]);ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(gx,gy,48*f,0,TAU);ctx.stroke();ctx.setLineDash([]);lp_T(ctx,"?",gx,gy+16*f,{w:800,size:Math.round(44*f),align:"center",col:LP.amber});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the registrar's timetable, on a screen
   Drawn inside lp_screen's draw: the rooms down the side, the teaching day's hours across (08:00 to 18:00), each booked hour in
   orange. o.u (0 to 1): the bookings fill in; o.more (0 to 1): the line under it, of how many rooms there are. */
const MH_TT_ROOMS=["A1.04","A1.05","B2.11","C1.02","D3.06","E2.21","E2.22"];
function mh_timetable(c,x,y,w,h,o){o=o||{};const u=o.u==null?1:o.u,R=ag_rnd(186);
  lp_T(c,"Timetable · Semester 2, 2026",x+30,y+52,{w:800,size:30});
  const gx=x+150,gw=w-150-30,cw=gw/10,gy=y+78,rh=44;
  for(let k=0;k<10;k++)lp_T(c,String(8+k).padStart(2,"0"),gx+cw*(k+0.5),gy+30,{w:600,size:28,align:"center",col:LP.mut});
  MH_TT_ROOMS.forEach((rm,j)=>{const ry=gy+44+j*rh;lp_T(c,rm,x+30,ry+33,{w:700,size:28});
    for(let k=0;k<10;k++){const on=R()<((k>=1&&k<=4)?0.86:0.3),cu=clamp(u*14-(j*0.9+k*0.35),0,1);
      c.fillStyle=rgba(mix(LP.paper,LP.mut,0.12),1);rr(c,gx+cw*k+3,ry+6,cw-6,rh-10,5);c.fill();
      if(on&&cu>0){c.fillStyle=rgba(LP.orange,0.88*ag_sine(cu));rr(c,gx+cw*k+3,ry+6,cw-6,rh-10,5);c.fill();}}});
  if(o.more>0)lp_T(c,"186 rooms, hour by hour",x+30,y+h-28,{w:600,size:28,col:LP.mut,a:ag_sine(o.more)});}

/* ---------------------------------------------------------------- Ivy's page: the whole route of Graham's question
   One sheet, drawn from the top: the decision, the question behind it, the data that answers it, where it's born, who keeps it, and
   the rule. o: a; rows (one per row, 0 to 1: written in, left to right); rule (0 to 1: the rule's tag); hl (0 to 1: the data row,
   where the bookings meet the counts, picked out); dim (0 to 1: the other rows quieter); light. */
const MH_PAGE={x:600,y:104,w:1000,h:716,rowY:[306,438,540,642,744]};
const MH_ROWS=[
  {kick:"The decision",col:LP.blue,text:"Whether to ask for a new teaching building",note:"The University Council weighs it in June"},
  {kick:"The question",col:LP.blue,text:"Too few rooms, or too few at some hours?"},
  {kick:"The data",col:LP.orange,text:"Each room's bookings, beside the people counted in it"},
  {kick:"Where it's born",col:LP.orange,text:"The timetable · the sensors"},
  {kick:"Who keeps it",col:LP.mut,text:"Mei · Sam · Jun · Noor"}];
function mh_page(ctx,o){o=o||{};const a=o.a==null?1:o.a,P=MH_PAGE;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,P.x+P.w/2,P.y+P.h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,P.x,P.y,P.w,P.h,{col:LP.blue,light:o.light});
  lp_T(ctx,"IVY'S PAGE",P.x+44,P.y+84,{w:800,size:28,ls:3,col:LP.blue});lp_T(ctx,"The route of Graham's question",P.x+44,P.y+138,{w:800,size:40});
  const rail=P.x+64,tx=P.x+104,R=o.rows||[];
  // the data row picked out, where the bookings meet the counts
  const hl=ag_sine(o.hl||0);if(hl>0){const y0=P.rowY[2]-40,y1=P.rowY[2]+62;ctx.fillStyle=rgba(LP.orange,0.1*hl);rr(ctx,P.x+84,y0,P.w-118,y1-y0,14);ctx.fill();
    ctx.strokeStyle=rgba(LP.orange,0.9*hl);ctx.lineWidth=3;rr(ctx,P.x+84,y0,P.w-118,y1-y0,14);ctx.stroke();}
  // the route, down the left: a line from row to row as each is written
  ctx.strokeStyle=rgba(LP.mut,0.55);ctx.lineWidth=4;ctx.lineCap="round";
  for(let j=1;j<MH_ROWS.length;j++){const u=ag_sine(R[j]||0);if(u<=0)continue;const y0=P.rowY[j-1]-10,y1=P.rowY[j]-10;ctx.beginPath();ctx.moveTo(rail,y0+14);ctx.lineTo(rail,lerp(y0+14,y1-14,u));ctx.stroke();}
  MH_ROWS.forEach((r,j)=>{const u=R[j]||0;if(u<=0)return;const y=P.rowY[j],dm=o.dim&&j!==2?1-0.55*ag_sine(o.dim):1;
    ctx.save();ctx.globalAlpha*=ag_in(u,0,0.25)*dm;ctx.beginPath();ctx.rect(P.x+40,y-44,(P.w-60)*ag_sine(u)+30,140);ctx.clip();
    ctx.fillStyle=rgba(r.col,1);ctx.beginPath();ctx.arc(rail,y-10,9,0,TAU);ctx.fill();
    lp_T(ctx,r.kick.toUpperCase(),tx,y,{w:800,size:28,ls:3,col:r.col});lp_T(ctx,r.text,tx,y+42,{w:700,size:32});
    if(r.note)lp_T(ctx,r.note,tx,y+80,{w:600,size:28,col:LP.mut});ctx.restore();});
  const ra=o.rule||0;if(ra>0){ctx.save();ctx.globalAlpha*=(o.dim?1-0.55*ag_sine(o.dim):1);lp_tag(ctx,P.x+P.w-44,P.rowY[4]+30,"Counts, never people",{align:"right",col:LP.mut,a:ag_sine(ra)});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the two lists of room names, side by side
   The timetable's rooms and the sensors' feed's: seven of their 186, the names matched row by row. o: a; lx, rx (where each sheet's
   left edge is); match (0 to 1: the matched names joined, one by one); bad (0 to 1: the two that don't match, outlined in amber, with a
   broken line between them); drop (0 to 1: those two fade, as a join by name would drop them); ticks ([0 to 1, 0 to 1]: each list right
   about what it holds); light. */
const MH_NAMES=[["A1.04","A1.04"],["A1.05","A1.05"],["B2.11","B2.11"],["C1.02","C1.02"],["D3.06","D3.06"],["E2.21","E2.09"],["E2.22","E2.10"]];
const MH_LIST={y:150,w:440,h:530,row0:274,lh:50};
function mh_lists(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const L=MH_LIST,lx=o.lx==null?280:o.lx,rx=o.rx==null?1200:o.rx;
  ctx.save();ctx.globalAlpha*=a;const rowY=j=>L.row0+j*L.lh,gap=rx-(lx+L.w),dr=ag_sine(o.drop||0),bd=ag_sine(o.bad||0);
  // the matched names, joined across the gap between the lists
  if(gap>40){for(let j=0;j<5;j++){const u=ag_sine(clamp((o.match||0)*5.6-j*1.15,0,1));if(u<=0)continue;const y=rowY(j)-10,x0=lx+L.w-14,x1=rx+14;
      ctx.strokeStyle=rgba(LP.green,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,x1,u),y);ctx.stroke();
      ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(x0,y,7,0,TAU);ctx.fill();if(u>0.98){ctx.beginPath();ctx.arc(x1,y,7,0,TAU);ctx.fill();}}
    // and the two that don't: a broken amber line, crossed out in the middle
    if(bd>0)for(let j=5;j<7;j++){const y=rowY(j)-10,x0=lx+L.w-14,x1=rx+14,m=(x0+x1)/2;ctx.save();ctx.globalAlpha*=bd*(1-0.75*dr);ctx.setLineDash([12,10]);
      ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=rgba(LP.paper,1);ctx.beginPath();ctx.arc(m,y,17,0,TAU);ctx.fill();lp_icon(ctx,"cross",m,y,26,LP.amber);ctx.restore();}}
  [[lx,"The timetable",0],[rx,"The sensors' feed",1]].forEach(([x,kick,side])=>{
    lp_sheet(ctx,x,L.y,L.w,L.h,{col:LP.orange,light:o.light});lp_T(ctx,kick.toUpperCase(),x+40,L.y+82,{w:800,size:28,ls:3,col:LP.orange});
    const tk=o.ticks?o.ticks[side]||0:0;if(tk>0){ctx.save();ctx.globalAlpha*=ag_in(tk,0,1);const tx=x+L.w-40,ty=L.y+72,f=lerp(0.6,1,ag_spr(tk*0.6,0,0.5));
      ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(tx,ty,22*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",tx,ty,30*f,[255,255,255]);ctx.restore();}
    MH_NAMES.forEach((nm,j)=>{const y=rowY(j),bad=j>=5,al=side?"left":"right",nx=side?x+44:x+L.w-44;ctx.save();if(bad)ctx.globalAlpha*=1-0.8*dr;
      if(bad&&bd>0){const tw=lp_tw(ctx,nm[side],{w:700,size:32}),bx=side?nx-12:nx-tw-12;ctx.strokeStyle=rgba(LP.amber,bd);ctx.lineWidth=3;rr(ctx,bx,y-34,tw+24,46,10);ctx.stroke();}
      lp_T(ctx,nm[side],nx,y,{w:700,size:32,align:al});ctx.restore();});
    lp_T(ctx,"186 rooms in all",side?x+44:x+L.w-44,L.y+L.h-34,{w:600,size:28,col:LP.mut,align:side?"left":"right"});});
  ctx.restore();}

/* ---------------------------------------------------------------- the T, SFIA's skills, a chessboard, a tangle */
// the T, in ink on the wall: a stem sl long from y down, and a bar bw wide across its top; o.stem, o.bar (0 to 1: each drawn out); o.a
function mh_T(c,cx,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const bw=o.bw||900,sl=o.sl||330,th=o.th||26,su=ag_sine(o.stem==null?1:o.stem),bu=ag_sine(o.bar==null?1:o.bar);
  const sa=clamp(su*6,0,1),ba=clamp(bu*6,0,1),hw=Math.max(0,bw-th)/2*bu,stem=()=>{c.moveTo(cx,y);c.lineTo(cx,y+sl*su);},bar=()=>{c.moveTo(cx-hw,y);c.lineTo(cx+hw,y);};
  c.save();c.globalAlpha*=a;mh_ink(c,o.col,th);
  // one stroke for both once each is in, so the T fades as one shape; each fades in as it starts, so neither shows as a dot
  if(sa>=1&&ba>=1){c.beginPath();stem();bar();c.stroke();}
  else{if(su>0){c.save();c.globalAlpha*=sa;c.beginPath();stem();c.stroke();c.restore();}if(bu>0){c.save();c.globalAlpha*=ba;c.beginPath();bar();c.stroke();c.restore();}}
  c.restore();}
// the T's ink: a round stroke th wide, with a soft shadow
function mh_ink(c,col,th){c.shadowColor="rgba(52,36,30,0.22)";c.shadowBlur=12;c.shadowOffsetX=LP.sdx*0.5;c.shadowOffsetY=6;c.strokeStyle=rgba(col||LP.ink,1);c.lineWidth=th;c.lineCap="round";}
// a bar like the T's, drawn from x0 toward x1 as u goes from 0 to 1; it fades in as it starts, so it never shows as a dot
function mh_bar(c,x0,x1,y,u,o){o=o||{};const bu=ag_sine(u);if(bu<=0)return;c.save();c.globalAlpha*=(o.a==null?1:o.a)*clamp(bu*6,0,1);mh_ink(c,o.col,o.th||26);
  c.beginPath();c.moveTo(x0,y);c.lineTo(lerp(x0,x1,bu),y);c.stroke();c.restore();}
// SFIA's skills on a sheet: well over a hundred, a small square each; o.u (0 to 1: they fill in); o.T (0 to 1: one person's T laid over
// them, one column deep and the top row across); o.k (springs in); o.a; o.light
function mh_sfia(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));lp_sheet(c,x,y,w,h,{light:o.light});
  lp_T(c,"SFIA",x+36,y+82,{w:800,size:28,ls:3,col:LP.mut});lp_T(c,"Well over a hundred skills",x+36,y+134,{w:800,size:40});
  const cols=12,rows=13,gx=x+36,gy=y+170,cw=(w-72)/cols,ch=(h-170-36)/rows,u=o.u==null?1:o.u,Tu=ag_sine(o.T||0);
  for(let n=0;n<147;n++){const i=n%cols,j=(n/cols)|0,cu=clamp(u*20-n*0.12,0,1);if(cu<=0)continue;const inT=j===0||i===4;
    c.fillStyle=rgba(mix(LP.paper,LP.mut,0.2),ag_sine(cu));rr(c,gx+i*cw+4,gy+j*ch+4,cw-8,ch-8,4);c.fill();
    if(inT&&Tu>0){c.fillStyle=rgba(LP.ink,(j===0&&i!==4?0.55:0.9)*Tu);rr(c,gx+i*cw+4,gy+j*ch+4,cw-8,ch-8,4);c.fill();}}
  c.restore();}
// a chessboard with a few pieces: a game whose rules stay fixed; (x, y) its top left, s its size; a
function mh_chess(c,x,y,s,a){if(a<=0.004)return;const q=s/8;c.save();c.globalAlpha*=a;c.shadowColor="rgba(52,36,30,0.3)";c.shadowBlur=18;c.shadowOffsetX=LP.sdx;c.shadowOffsetY=10;
  c.fillStyle=rgba(mix(LP.timber,LP.shade,0.35),1);c.fillRect(x-14,y-14,s+28,s+28);c.restore();c.save();c.globalAlpha*=a;
  for(let i=0;i<8;i++)for(let j=0;j<8;j++){c.fillStyle=rgba((i+j)%2?mix(LP.timber,LP.shade,0.25):mix(LP.timber,[255,250,240],0.35),1);c.fillRect(x+i*q,y+j*q,q,q);}
  const piece=(i,j,dark,tall)=>{const px=x+(i+0.5)*q,py=y+(j+0.82)*q,r=q*0.2,col=dark?[46,40,40]:[244,238,226],hi=dark?[96,88,88]:[255,255,255];
    c.fillStyle="rgba(30,22,18,0.25)";c.beginPath();c.ellipse(px+LP.sdx*0.3,py+2,q*0.3,q*0.08,0,0,TAU);c.fill();
    c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(px-q*0.28,py);c.quadraticCurveTo(px-q*0.12,py-q*(tall?0.42:0.3),px,py-q*(tall?0.44:0.32));c.quadraticCurveTo(px+q*0.12,py-q*(tall?0.42:0.3),px+q*0.28,py);c.closePath();c.fill();
    c.beginPath();c.arc(px,py-q*(tall?0.54:0.42),r,0,TAU);c.fill();c.fillStyle=rgba(hi,0.5);c.beginPath();c.arc(px+r*0.35,py-q*(tall?0.58:0.46),r*0.35,0,TAU);c.fill();};
  for(const [i,j,d,t] of [[4,7,0,1],[3,6,0,0],[5,6,0,0],[2,5,0,0],[4,0,1,1],[3,1,1,0],[6,1,1,0],[5,3,1,0]])piece(i,j,d,t);
  c.restore();}
// a tangle of ink, drawn out with u: a problem whose rules don't stay fixed; (cx, cy) its middle
function mh_tangle(c,cx,cy,u,a){a=a==null?1:a;if(a<=0.004||u<=0)return;const R=ag_rnd(2019),P=[];for(let k=0;k<26;k++)P.push([cx+(R()-0.5)*460,cy+(R()-0.5)*300]);
  const n=P.length-1,m=u*n;c.save();c.globalAlpha*=a;c.strokeStyle=rgba(LP.ink,0.85);c.lineWidth=6;c.lineCap="round";c.lineJoin="round";c.beginPath();c.moveTo(P[0][0],P[0][1]);
  for(let k=1;k<=n;k++){const f=clamp(m-(k-1),0,1);if(f<=0)break;const p0=P[k-1],p1=P[k],cpx=(p0[0]+p1[0])/2+(p1[1]-p0[1])*0.5,cpy=(p0[1]+p1[1])/2-(p1[0]-p0[0])*0.5;
    if(f>=1)c.quadraticCurveTo(cpx,cpy,p1[0],p1[1]);else{const ax=lerp(p0[0],cpx,f),ay=lerp(p0[1],cpy,f),bx=lerp(cpx,p1[0],f),by=lerp(cpy,p1[1],f);c.quadraticCurveTo(ax,ay,lerp(ax,bx,f),lerp(ay,by,f));}}
  c.stroke();c.restore();}

/* ---------------------------------------------------------------- the catalog's lineage, on a screen
   Drawn inside lp_screen's draw: the raw bookings and the raw counts, through Jun's models, to the page Graham reads. o.u (0 to 1:
   the arrows drawn out, one after another); o.lit (one per box, 0 to 1: each picked out as the voice names it). */
const MH_LIN=[{t:"Raw bookings",x:50,y:150,col:LP.orange},{t:"Raw counts",x:50,y:330,col:LP.orange},{t:"Jun's models",x:395,y:240,col:LP.orange},{t:"Graham's page",x:740,y:240,col:LP.ink}];
function mh_lineage(c,X,Y,Wd,Hd,o){o=o||{};const u=o.u==null?1:o.u,lit=o.lit||[],bw=270,bh=80;
  lp_T(c,"Catalog · Lineage",X+40,Y+62,{w:800,size:32});c.strokeStyle=rgba(LP.mut,0.25);c.lineWidth=2;c.beginPath();c.moveTo(X+40,Y+90);c.lineTo(X+Wd-40,Y+90);c.stroke();
  const B=MH_LIN.map(b=>({x:X+b.x,y:Y+b.y,col:b.col,t:b.t}));
  const arrow=(x0,y0,x1,y1,f)=>{if(f<=0)return;const xe=lerp(x0,x1,f),ye=lerp(y0,y1,f),an=Math.atan2(y1-y0,x1-x0);c.strokeStyle=rgba(LP.ink,0.85);c.lineWidth=4;c.lineCap="round";
    c.beginPath();c.moveTo(x0,y0);c.lineTo(xe,ye);c.stroke();if(f>0.9){c.save();c.translate(xe,ye);c.rotate(an);c.fillStyle=rgba(LP.ink,0.85);c.beginPath();c.moveTo(4,0);c.lineTo(-14,-10);c.lineTo(-14,10);c.closePath();c.fill();c.restore();}};
  const mid=b=>[b.x+bw,b.y+bh/2];
  arrow(...mid(B[0]),B[2].x-6,B[2].y+bh*0.3,clamp(u*3,0,1));arrow(...mid(B[1]),B[2].x-6,B[2].y+bh*0.7,clamp(u*3-0.4,0,1));arrow(...mid(B[2]),B[3].x-6,B[3].y+bh/2,clamp(u*3-1.6,0,1));
  B.forEach((b,i)=>{const ba=clamp(u*6-[0,0.3,2.2,4.6][i],0,1);if(ba<=0)return;const l=ag_sine(lit[i]||0);c.save();c.globalAlpha*=ag_sine(ba);
    c.fillStyle=rgba(mix(LP.paper,b.col,0.1+0.12*l),1);rr(c,b.x,b.y,bw,bh,12);c.fill();c.strokeStyle=rgba(b.col,1);c.lineWidth=3+2*l;rr(c,b.x,b.y,bw,bh,12);c.stroke();
    lp_T(c,b.t,b.x+bw/2,b.y+bh/2+10,{w:700,size:28,align:"center"});c.restore();});}

/* ---------------------------------------------------------------- Ivy's first goals, on a sheet
   Blue, as plans are. o: a; k (springs in); u (0 to 1: the three goals written, one after another); when (the date under the heading);
   dim (0 to 1: the second and third quieter); line (0 to 1: the first underlined); tick (0 to 1: the first met, a green tick by it);
   light. Returns its box. */
const MH_GOALS=["By Easter: know the whole route of one question's data","By May: have a pull request merged","By mid-year: own a data product"];
function mh_goals(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,G=MH_GOALS.map(g=>lp_wrap(ctx,g,w-72-38,{w:600,size:30})),
    h=150+G.reduce((s,l)=>s+l.length*42+18,0)+22;if(a<=0.004)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});lp_T(ctx,"IVY'S FIRST GOALS",x+36,y+82,{w:800,size:28,ls:3,col:LP.blue});
  lp_T(ctx,o.when||"Friday 5 March 2027",x+36,y+124,{w:600,size:28,col:LP.mut});
  let yy=y+144;G.forEach((ls,i)=>{const gu=o.u==null?1:clamp(o.u*G.length-i,0,1),dm=o.dim&&i>0?1-0.6*ag_sine(o.dim):1;ctx.save();ctx.globalAlpha*=ag_sine(gu)*dm;const y0=yy;
    ls.forEach((s,j)=>{yy+=42;if(j===0){ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(x+44,yy-11,6,0,TAU);ctx.fill();}lp_T(ctx,s,x+74,yy,{w:600,size:30});});
    if(i===0&&o.line>0){const lw=Math.max(...ls.map(s=>lp_tw(ctx,s,{w:600,size:30})));ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=4;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(x+74,yy+12);ctx.lineTo(x+74+lw*ag_sine(o.line),yy+12);ctx.stroke();}
    if(i===0&&o.tick>0){const tx=x+w-46,ty=y0+30,f=lerp(0.6,1,ag_spr(o.tick*0.6,0,0.5));ctx.save();ctx.globalAlpha*=ag_in(o.tick,0,1);ctx.fillStyle=rgba(LP.green,1);
      ctx.beginPath();ctx.arc(tx,ty,22*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",tx,ty,30*f,[255,255,255]);ctx.restore();}
    ctx.restore();yy+=18;});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- Helena's one role, two sides (the author's advice, 10 November 2026)
   One sheet, creased down the middle: managing on one side (plans, dates, measures) and leading on the other (people), in the same
   colour and weight, as neither outranks the other; as the voice says they serve the people, a brace gathers the three and an arrow
   crosses the crease to the people. (x, y) its top left, w its width (540); o.a, o.k (its spring), o.light, o.t (the shot's time),
   o.left (when each word on the managing side comes in), o.right (when the people come in), o.arrow (when the brace and arrow draw). */
const MH_SIDES={kick:"One role",title:"Two sides, not rivals",left:["Managing","Plans","Dates","Measures"],right:["Leading","People"]};
function mh_sides(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=392;if(a<=0.004)return{x,y,w,h};
  const cx=x+w/2,lx=x+36,rx=cx+66,row=i=>y+270+i*42,fade=t0=>t0==null?1:ag_sine(ag_in(o.t,t0,0.5));
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light});
  lp_T(ctx,MH_SIDES.kick.toUpperCase(),lx,y+80,{w:800,size:28,ls:3,col:LP.mut});
  lp_T(ctx,MH_SIDES.title,lx,y+152,{w:800,size:40});
  // the crease: a shaded line, and a lit one beside it, from under the title to the foot of the sheet
  ctx.lineWidth=2;ctx.strokeStyle="rgba(60,44,32,0.24)";ctx.beginPath();ctx.moveTo(cx-1,y+188);ctx.lineTo(cx-1,y+h-26);ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,0.55)";ctx.beginPath();ctx.moveTo(cx+1,y+188);ctx.lineTo(cx+1,y+h-26);ctx.stroke();
  lp_T(ctx,MH_SIDES.left[0].toUpperCase(),lx,y+222,{w:800,size:28,ls:3,col:LP.mut});
  lp_T(ctx,MH_SIDES.right[0].toUpperCase(),rx,y+222,{w:800,size:28,ls:3,col:LP.mut});
  MH_SIDES.left.slice(1).forEach((s,i)=>{ctx.save();ctx.globalAlpha*=fade(o.left&&o.left[i]);lp_T(ctx,s,lx,row(i),{w:600,size:28});ctx.restore();});
  ctx.save();ctx.globalAlpha*=fade(o.right);lp_T(ctx,MH_SIDES.right[1],rx,row(1),{w:600,size:28});ctx.restore();
  // they serve the people: a brace gathers the three, then an arrow from its point crosses the crease, drawn from left to right
  const b=o.arrow==null?1:ag_in(o.t,o.arrow,0.3),p=o.arrow==null?1:ag_sine(ag_in(o.t,o.arrow+0.15,0.6));
  if(b>0.004){const top=row(0)-30,bot=row(2)+6,mid=(top+bot)/2,bx=cx-56;ctx.save();ctx.globalAlpha*=b;ctx.strokeStyle=rgba(LP.mut,1);ctx.lineWidth=3;
    ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(bx-10,top);ctx.quadraticCurveTo(bx,top,bx,top+10);ctx.lineTo(bx,mid-10);
    ctx.quadraticCurveTo(bx,mid,bx+10,mid);ctx.quadraticCurveTo(bx,mid,bx,mid+10);ctx.lineTo(bx,bot-10);ctx.quadraticCurveTo(bx,bot,bx-10,bot);ctx.stroke();
    if(p>0.004){const x0=bx+10,x1=x0+(cx+40-x0)*p;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0,mid);ctx.lineTo(x1,mid);ctx.stroke();
      if(p>0.6){const q=ag_in(p,0.6,0.4)*10;ctx.beginPath();ctx.moveTo(x1-q,mid-q*0.9);ctx.lineTo(x1,mid);ctx.lineTo(x1-q,mid+q*0.9);ctx.stroke();}}
    ctx.restore();}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a print of Kaifeng, on the team room's wall
   The opening's street with the canal's water in its trenches, the raft and the boat at the gate, kept once, in a timber frame on a
   paper mount. (x, y) its top left, w its width; o.a. */
function mh_print(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=Math.round(w*9/16),fr=18,mt=26;
  const pic=ag_kept("mhPrint",W,H,(cc)=>{cc.drawImage(ag_place("mhStreet"),0,0);mh_street(cc,0,{dig:1,bank:1,water:1,heaps:0.6,boats:[{x:1250,kind:"raft"},{x:860,kind:"boat"}]});});
  c.save();c.globalAlpha*=a;c.save();c.shadowColor="rgba(52,36,30,0.34)";c.shadowBlur=24;c.shadowOffsetX=LP.sdx;c.shadowOffsetY=14;c.fillStyle=rgba(mix(LP.timber,LP.shade,0.3),1);
  c.fillRect(x-fr-mt,y-fr-mt,w+2*(fr+mt),h+2*(fr+mt));c.restore();c.fillStyle=rgba(LP.paper,1);c.fillRect(x-mt,y-mt,w+2*mt,h+2*mt);
  c.strokeStyle="rgba(255,248,236,0.5)";c.lineWidth=2;c.strokeRect(x-fr-mt+1,y-fr-mt+1,w+2*(fr+mt)-2,h+2*(fr+mt)-2);
  c.imageSmoothingQuality="high";c.drawImage(pic,x,y,w,h);c.strokeStyle="rgba(60,44,32,0.3)";c.lineWidth=1.5;c.strokeRect(x,y,w,h);c.restore();}

/* ---------------------------------------------------------------- the teaching building, cut open
   The kit's teaching building with lower floors, so its top clears the kicker and the scene's tag; its rooms lit one by one, students
   at their desks in the lit ones (each fading in whole with its room, from a picture kept once). o.t0: when the first lights;
   o.step: seconds between rooms; o.a. */
const MH_TB=Object.assign({},LP_TEACHING,{floors:LP_TEACHING.floors.map((f,i)=>Object.assign({},f,{h:i?160:190}))});
const MH_TB_LIT=["1.02","G.03","2.01","3.02","1.04","2.03","G.01","3.01","1.01"];
const MH_TB_SEATS={"1.02":[0.2,0.55,0.85],"G.03":[0.15,0.4,0.7,0.9],"2.01":[0.25,0.6],"3.02":[0.1,0.35,0.65],"1.04":[0.3,0.8],"2.03":[0.2,0.5,0.75],"G.01":[0.12,0.3,0.5,0.7,0.88],"3.01":[0.4,0.7],"1.01":[0.15,0.6]};
function mh_tbPeople(){return ag_kept("mhTBPeople",W,H,(c)=>{let n=0;for(const id of MH_TB_LIT)for(const u of MH_TB_SEATS[id]){const p=lp_seat(MH_TB,id,u,0.17);
  lp_person(c,lp_crowd(n*3+1),p.x,p.y,p.s,{cut:p.cut,flip:n%3===1,t:n*0.7,light:{wall:0}});n++;}});}
function mh_building(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const t0=o.t0==null?0:o.t0,step=o.step||0.35,lit={};
  MH_TB_LIT.forEach((id,i)=>{lit[id]=ag_in(t,t0+i*step,0.6);});
  ctx.save();ctx.globalAlpha*=a;lp_section(ctx,MH_TB,{room:(id)=>({lit:lit[id]||0})});
  const pp=mh_tbPeople();for(const id of MH_TB_LIT){const l=lit[id];if(l<=0.004)continue;const r=lp_roomBox(MH_TB,id);ctx.save();ctx.globalAlpha*=l;ctx.beginPath();ctx.rect(r.x,r.y,r.w,r.h);ctx.clip();ctx.drawImage(pp,0,0);ctx.restore();}
  ctx.restore();}
