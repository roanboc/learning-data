/* ===== An agent that checks: the places and the pictures =====
   The places are painted once and kept (shared/src/finish.js). Only the university's own places (the series' rooms.js): the campus
   at dusk and at night, the Faculty of Health's office in the old building (by day, at dusk, at night and in the morning), screens
   close up, the data team's room and its board, Yusuf's office, his board and his desk, and the platform team's desk. The pictures are
   the film's own things: the agent's sign (a small turning star on a dashed cyan card, never a person), Anil's change and its checks,
   the call list with its names and emails as grey bars, the review queue on Jun's board, the skill's page, the agent's review and its
   three findings, the two coded keys, the approvals, the agent's card of access, the list of who reviews what, binders 26 and 12, and
   the tags. Every name starts with ac_ or AC_. */

/* ---------- light: dusk, night and morning over a painted place ---------- */
// a grade over everything painted so far: dusk (a warm violet sky, deeper below), night (deep blue, darker at the edges) or
// morning (warm light from the left, where the window is); src-atop keeps it to what's already painted, for a layer drawn over people
function ac_grade(c,kind,o){o=o||{};c.save();if(o.atop){c.globalCompositeOperation="source-atop";}
  if(kind==="night"){if(!o.atop){c.globalCompositeOperation="multiply";c.fillStyle=rgba([62,76,128],1);c.fillRect(0,0,W,H);
      const g=c.createRadialGradient(W/2,H*0.45,H*0.3,W/2,H*0.45,H*1.1);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(40,46,80,0.55)");c.fillStyle=g;c.fillRect(0,0,W,H);}
    else{c.fillStyle="rgba(28,34,70,0.62)";c.fillRect(0,0,W,H);}}
  else if(kind==="dusk"){if(!o.atop){c.globalCompositeOperation="multiply";const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([214,170,190],1));g.addColorStop(0.55,rgba([236,176,140],1));
      g.addColorStop(1,rgba([150,140,170],1));c.fillStyle=g;c.fillRect(0,0,W,H);}
    else{c.fillStyle="rgba(120,80,90,0.28)";c.fillRect(0,0,W,H);}}
  else if(kind==="morning"){c.globalCompositeOperation=o.atop?"source-atop":"screen";const g=c.createRadialGradient(240,300,40,240,300,1500);
    g.addColorStop(0,"rgba(255,226,170,0.55)");g.addColorStop(1,"rgba(255,226,170,0)");c.fillStyle=g;c.fillRect(0,0,W,H);}
  c.restore();}
// a lamp's warm glow (screen), round its glass
function ac_lampGlow(c,x,y,r,a){c.save();c.globalCompositeOperation="screen";wc_glowAt(c,x,y,r,[255,214,140],a);wc_glowAt(c,x,y,r*0.3,[255,236,190],a);c.restore();}
// a window lit from inside: warm, or the cold light of a screen
function ac_litWindow(c,x,y,w,h,col,a){c.save();c.globalCompositeOperation="screen";c.beginPath();wc_tr(c,wc_arched(x,y,w,h));c.fillStyle=rgba(col,a);c.fill();
  wc_glowAt(c,x+w/2,y+h/2,Math.max(w,h)*1.3,col,a*0.35);c.restore();}
// the old building's windows in the campus (wc_quad at 40,668, scale 0.6): their left edges, two rows, each 29 by 50
const AC_QW={xs:[66,138,210,450,522,594],ys:[517,607],w:29,h:50},AC_CLOCK=[334,445,24];
// the clock's face painted again, with its hands at h:m
function ac_clockAt(c,hh,mm){const [x,y,r]=AC_CLOCK;wc_wash(c,wc_ell(x,y,r,r,30),WCP.clock,{kind:"clock",lw:1.6});const am=(mm/60)*TAU-Math.PI/2,ah=((hh%12)/12+mm/720)*TAU-Math.PI/2;
  c.save();c.strokeStyle=rgba(WC_INK,0.9);c.lineCap="round";c.lineWidth=3;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(am)*r*0.72,y+Math.sin(am)*r*0.72);c.stroke();
  c.lineWidth=3.4;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(ah)*r*0.48,y+Math.sin(ah)*r*0.48);c.stroke();c.restore();}

/* ---------- the campus, at dusk and at night ---------- */
// dusk: Anil's evening; the old building's windows are warm, its clock at twenty to seven (the lamps come on in the film: ac_lamps)
function ac_paintDusk(c){gv_paintCampus(c);ac_clockAt(c,6,40);ac_grade(c,"dusk");
  AC_QW.ys.forEach((y,r)=>AC_QW.xs.forEach((x,i)=>{if((i+r)%3!==1)ac_litWindow(c,x,y,AC_QW.w,AC_QW.h,[255,206,130],0.75);}));
  for(let r=0;r<4;r++)for(let i=0;i<10;i++)if((i*3+r)%4===0){c.save();c.globalCompositeOperation="screen";c.fillStyle="rgba(255,214,150,0.32)";c.fillRect(1070+i*72+8,340+r*100+8,56,48);c.restore();}}
// the campus lamps, lit (a, 0 to 1)
const AC_LAMPS=[[860,621,90],[1690,561,70]];
function ac_lamps(ctx,a){AC_LAMPS.forEach(([x,y,r],i)=>ac_lampGlow(ctx,x,y,r,(0.7-0.1*i)*clamp(a,0,1)));}
// night: three in the morning; only the lamps, and one window in the old building lit by a screen
function ac_paintNight(c){gv_paintCampus(c);ac_grade(c,"night");const R=wc_rng(29);
  c.save();c.globalCompositeOperation="screen";for(let i=0;i<46;i++){const x=R()*W,y=R()*380,s=0.8+R()*1.6;c.fillStyle=rgba([220,226,255],0.35+R()*0.4);c.beginPath();c.arc(x,y,s,0,TAU);c.fill();}c.restore();
  ac_litWindow(c,AC_QW.xs[1],AC_QW.ys[1],AC_QW.w,AC_QW.h,[176,214,255],0.85);ac_lampGlow(c,860,621,110,0.85);ac_lampGlow(c,1690,561,90,0.75);
  // the clock, lit a little by the lamp on the tower's door
  c.save();c.globalCompositeOperation="screen";wc_glowAt(c,AC_CLOCK[0],AC_CLOCK[1],60,[200,190,160],0.3);c.restore();}

/* ---------- the faculty's office: day, dusk, night, morning ---------- */
function ac_paintFacDusk(c){gv_paintFaculty(c);ac_grade(c,"dusk");}
function ac_paintFacNight(c){gv_paintFaculty(c);ac_grade(c,"night");}
function ac_paintFacMorning(c){gv_paintFaculty(c);ac_grade(c,"morning");}
// the desk in front, kept once for each light, drawn over whoever sits there
function ac_facDesk(ctx,kind){ctx.drawImage(wc_kept("acFacDesk|"+(kind||"day"),W,H,c=>{gv_paintFacultyDesk(c);if(kind)ac_grade(c,kind,{atop:true});}),0,0);}
// the glow of the screen on the desk, at night
function ac_screenGlow(ctx,x,y,w,h,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x+w/2,y+h/2,Math.max(w,h)*0.9,[150,196,240],0.45*a);ctx.restore();}

/* ---------- screens close up ---------- */
// a screen on a desk, as the series paints one (gv_paintScreenDesk), set a little lower, so the corner's place and time clear its title
const AC_SC=[330,124,1260,690];
function ac_paintScreenDesk(ctx,wall){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);wc_wash(ctx,wc_rect(-40,-40,W+80,960),wall,{kind:"plaster",line:false,seed:73});
  wc_wash(ctx,wc_rect(-40,900,W+80,220),GV.oak,{kind:"plaster",line:false,seed:74});wc_wash(ctx,wc_rect(-40,894,W+80,14),wc_dim(GV.oak,0.25),{kind:"trim",line:false,flat:true});
  const [x,y,w,h]=AC_SC;wc_part(ctx,[[x+w/2-40,y+h+12],[x+w/2+40,y+h+12],[x+w/2+52,912],[x+w/2-52,912]],GV.metal,1);wc_wash(ctx,wc_ell(x+w/2,918,190,22,30),GV.metal,{kind:"thing",lw:1.4});
  gv_monitor(ctx,x,y,w,h,{stand:false});
  wc_part(ctx,wc_rect(1660,960,420,160),[226,228,234],1);wc_wash(ctx,wc_ell(160,990,70,40,30),[236,240,244],{kind:"thing",lw:1.4});}
function ac_paintScreenFac(c){ac_paintScreenDesk(c,GV_ROOM.fac);}
function ac_paintScreenFacNight(c){ac_paintScreenDesk(c,GV_ROOM.fac);ac_grade(c,"night");}
function ac_paintScreenFacMorning(c){ac_paintScreenDesk(c,GV_ROOM.fac);ac_grade(c,"morning");}
function ac_paintScreenPlat(c){ac_paintScreenDesk(c,GV_ROOM.plat);}
function ac_paintScreenData(c){ac_paintScreenDesk(c,GV_ROOM.data);}

/* ---------- pages close up: binder 12, binder 26, the skill ---------- */
// a page of a binder filling the frame, the holes for the rings down the left (as Off the shelf drew policy 12's)
function ac_paintPage(c){c.fillStyle=rgba(WC_PAPER,1);c.fillRect(0,0,W,H);wc_wash(c,wc_rect(-40,-40,W+80,H+80),GV.paper,{kind:"paper",line:false,seed:93});
  for(const y of [170,540,910])wc_wash(c,wc_ell(96,y,24,24,24),wc_dim(GV.oak,0.08),{kind:"thing",lw:1.3,seed:y});
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgba(255,250,236,0)");g.addColorStop(1,"rgba(150,130,100,0.1)");c.fillStyle=g;c.fillRect(0,0,W,H);}

/* ---------- the agent's sign ---------- */
// a small four-pointed star that turns a little, back and forth, as the master data films drew an agent: software, never a person
const AC_CYAN=[26,100,156];
function ac_star(ctx,x,y,s,t,a){if(a==null)a=1;if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*0.8)*0.15);ctx.scale(s,s);withA(ctx,a,()=>{
  ctx.save();ctx.globalCompositeOperation="multiply";wc_glowAt(ctx,0,0,34,[170,214,246],0.55);ctx.restore();ctx.beginPath();
  for(let i=0;i<8;i++){const r=i%2?6:18,an=i*Math.PI/4-Math.PI/2;ctx.lineTo(Math.cos(an)*r,Math.sin(an)*r);}ctx.closePath();ctx.fillStyle=rgba(AC_CYAN,1);ctx.fill();});ctx.restore();}
// the agent's card: dashed cyan, its star in the top corner; lines of text (the first bold), at size sz
function ac_card(ctx,x,y,w,h,t,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||30,k=o.k==null?1:o.k;
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.scale(k,k);ctx.translate(-x-w/2,-y-h/2);wc_panel(ctx,x,y,w,h,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:o.seed||(w+h)});
    ac_star(ctx,x+40,y+40,1,t,1);(lines||[]).forEach((l,i)=>{const L=typeof l==="string"?{s:l}:l;if(L.a!=null&&L.a<=0.01)return;
      withA(ctx,L.a==null?1:L.a,()=>wc_T(ctx,L.s,x+(L.x||76),y+(o.y0||52)+i*(sz+(o.gap||16)),
        {w:i===0&&o.head!==false?800:(L.w||600),size:L.size||sz,col:L.col||(i===0&&o.head!==false?WC_DARK:WC_INK),f:L.f,deco:o.deco}));});ctx.restore();});}
// a cyan line moving across a row as the agent reads it
function ac_reading(ctx,x,y,w,h,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="multiply";ctx.globalAlpha=a;const g=ctx.createLinearGradient(x,0,x+w,0);
  g.addColorStop(0,rgba([170,214,246],0.0));g.addColorStop(0.15,rgba([170,214,246],0.95));g.addColorStop(1,rgba([170,214,246],0.6));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();}
// a red question mark: something nobody has said yet
function ac_redQ(ctx,x,y,s,p){if(p<=0)return;const k=spring(p);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(p*2,0,1),()=>wc_T(ctx,"?",0,0,{w:800,size:s,align:"center",col:GV.redInk}));ctx.restore();}
// a name card: a person's name and what they do
function ac_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:5});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}
// a tag that springs in at t0 and goes at t1 (or stays); o.wash colours it
function ac_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}

/* ---------- the change, on a screen close up ---------- */
// the change's page: its title in the bar; the list's name, the governance check's light (ok: 0 red to 1 green) and the approve and
// merge buttons, grey, which only people use (btn rings them); then its columns, what each says about identifying a person, and the new
// one marked; what the agent reads (read: the row it's on, fractional; readA), a red question mark where nothing is said (q), and the
// class Anil writes, in gold (cls)
const AC_ROWS=[["learner_key","pseudonymous"],["full_name","direct"],["email","direct"],["award_code","none"],["date_of_birth",""]];
const AC_PG={x0:400,band:AC_SC[1]+114,head:AC_SC[1]+182,y0:AC_SC[1]+242,dy:58,cls:1010,read:[372,1150],chk:640};
function ac_change(ctx,t,o){o=o||{};const [x,y,w,h]=AC_SC,P=AC_PG;gv_screen(ctx,x,y,w,h,o.title||"Add each learner's date of birth",q=>{
  wc_T(q,"Call list",P.x0,P.band,{w:800,size:32,col:WC_DARK});
  const ok=o.ok||0;q.save();q.fillStyle=rgba(mix(GV.red,GV.green,ok),1);q.beginPath();q.arc(P.chk,P.band-10,12,0,TAU);q.fill();q.restore();
  wc_T(q,ok>0.5?"governance check · passed":"governance check · 1 problem",P.chk+24,P.band,{w:700,size:28,col:ok>0.5?GV.greenInk:GV.redInk});
  // a pencil ring round the buttons (btn, drawn 0 to 1)
  if(o.btn>0){const bx=x+w-205,by=P.band-12,u=clamp(o.btn,0,1);q.save();q.strokeStyle=rgba(WC_PENCIL,0.8);q.lineWidth=3.5;q.lineCap="round";q.beginPath();
    for(let i=0;i<=40*u;i++){const a=-2.2+i/40*TAU*1.08,r=1+0.03*Math.sin(i*1.7);q.lineTo(bx+Math.cos(a)*200*r,by+Math.sin(a)*50*r);}q.stroke();q.restore();}
  ["Approve","Merge"].forEach((b,i)=>{const bx=x+w-380+i*190,by=P.band-38;wc_panel(q,bx,by,170,52,{kind:"pill",seed:61+i});wc_T(q,b,bx+85,by+36,{w:700,size:28,col:WC_MUTED,align:"center"});});
  wc_T(q,"column",P.x0,P.head,{w:700,size:28,col:WC_MUTED});wc_T(q,"personal data",P.cls,P.head,{w:700,size:28,col:WC_MUTED});
  AC_ROWS.forEach(([c,k],i)=>{const ry=P.y0+i*P.dy;if(i===AC_ROWS.length-1){q.save();q.fillStyle=rgba([214,240,214],0.9);q.fillRect(x+30,ry-40,w-60,56);q.restore();
      wc_T(q,"+",x+46,ry,{w:800,size:32,col:GV.greenInk});}
    wc_T(q,c,P.x0,ry,{w:600,size:32,col:WC_DARK,f:"mono"});if(k)wc_T(q,k,P.cls,ry,{w:600,size:32,col:WC_INK,f:"mono"});});
  // the agent reading, row by row
  if(o.read!=null&&o.readA>0){const ry=P.y0+o.read*P.dy;ac_reading(q,P.read[0],ry-42,P.read[1],58,o.readA);ac_star(q,P.read[0]-4,ry-13,0.9,t,o.readA);}
  const ly=P.y0+4*P.dy;ac_redQ(q,P.cls+30,ly+6,56,(o.q||0)*(1-(o.cls||0)));
  if(o.cls>0){gv_tint(q,P.cls-14,ly-40,236,56,GV.gold,0.8*o.cls);withA(q,o.cls,()=>wc_T(q,"direct",P.cls,ly,{w:700,size:32,col:GV.goldInk,f:"mono"}));}},{titleSize:32,barH:54});}
// the agent's comment, pinned under the new row: the line, the rule and a fix to consider, each coming in (ln: three, 0 to 1); res,
// Anil's gold tick
function ac_comment(ctx,t,a,k,ln,res){const x=AC_SC[0]+140,y=AC_PG.y0+4*AC_PG.dy+34,w=960,h=170;if(a<=0.01)return;ln=ln||[1,1,1];
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(AC_CYAN,0.8);ctx.setLineDash([6,7]);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+40,y-18);ctx.lineTo(x+40,y);ctx.stroke();ctx.restore();});
  ac_card(ctx,x,y,w,h,t,[{s:"date_of_birth has no class",a:ln[0]},{s:"Every column says whether it identifies a person.",size:28,a:ln[1]},{s:"To consider:  personal_data: direct",f:"mono",size:28,a:ln[2]}],{a,k,y0:50,gap:16});
  if(res>0)wc_tick(ctx,x+w-60,y+48,46,GV.gold,res,8);}
// a change on the faculty's screen, seen from the desk: its title (o.title), its columns (o.rows), those from o.added on new and green, the
// last typed in as it's written (typed: letters so far, 0 to 1; left out, already there), and the button that opens it for review (sent:
// pressed, 0 to 1); lights (three, 0 red to 1 green, when shown) are its checks; dim darkens it as the screen sleeps
function ac_smallChange(ctx,t,o){o=o||{};const [x,y,w,h]=GV_FX.screen,rows=o.rows||["learner_key","full_name","email","date_of_birth"],
    from=o.added==null?rows.length-1:o.added;gv_screen(ctx,x,y,w,h,o.title||"Add each learner's date of birth",q=>{
    rows.forEach((c,i)=>{const ry=y+92+i*42,typing=i===rows.length-1&&o.typed!=null,n=typing?Math.round(c.length*clamp(o.typed,0,1)):c.length;if(n<=0)return;
      if(i>=from){q.save();q.fillStyle=rgba([214,240,214],0.9);q.fillRect(x+12,ry-30,w-24,42);q.restore();wc_T(q,"+",x+20,ry,{w:800,size:26,col:GV.greenInk});}
      wc_T(q,c.slice(0,n),x+48,ry,{w:600,size:26,col:WC_DARK,f:"mono"});
      if(typing&&n<c.length&&Math.floor(t*3)%2===0){q.save();q.fillStyle=rgba(WC_DARK,0.8);q.fillRect(x+48+tw(q,c.slice(0,n),26,600,"mono")+3,ry-24,3,28);q.restore();}});
    if(o.lights)o.lights.forEach((k,i)=>{q.save();q.fillStyle=rgba(mix(GV.red,GV.green,k),1);q.beginPath();q.arc(x+40+i*34,y+h-40,11,0,TAU);q.fill();q.restore();});
    const sent=o.sent||0,bx=x+w-200,by=y+h-66;gv_halo(q,bx-10,by-10,200,72,GV.green,0.8*Math.sin(Math.PI*clamp(sent*1.6,0,1)));
    wc_panel(q,bx,by,180,50,{kind:"pill",seed:66});wc_T(q,sent>0.6?"opened":"Open",bx+90,by+35,{w:700,size:26,col:sent>0.6?WC_MUTED:WC_DARK,align:"center"});
    if(o.dim>0){q.save();q.fillStyle=rgba([24,28,44],0.88*clamp(o.dim,0,1));q.fillRect(x,y,w,h);q.restore();}},{titleSize:26,barH:44});}

/* ---------- today: the call list, its checks, and the queue on Jun's board ---------- */
// the call list, from the built mart: the award each learner studies for and the credit points still to go, most first (names and emails
// are soft grey bars: no one's shown)
const AC_LIST=[["MPH",120],["MPH",90],["GCHI",60],["MPH",30],["GCHI",25],["GCHI",15],["GCHI",5]];
// a soft grey bar where a person's name or email would be
function ac_bar(ctx,x,y,w,a){if(a<=0.01)return;ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.34*a);rr(ctx,x,y-11,w,22,11);ctx.fill();ctx.restore();}
// the list on a screen close up: its rows come in (rows, 0 to 1), then each part as it's named: the award, the credit points to go, and
// someone to call (who)
function ac_list(ctx,t,o){o=o||{};const [x,y,w,h]=AC_SC,X={award:400,cp:640,cpR:900,name:1010,email:1250},hy=y+114,r0=y+180,dy=60;
  gv_screen(ctx,x,y,w,h,"Call list",q=>{
    [["award",X.award,o.award],["credit points to go",X.cp,o.cp],["name",X.name,o.who],["email",X.email,o.who]].forEach(([s,hx,a])=>withA(q,clamp((a||0)*2,0,1),()=>wc_T(q,s,hx,hy,{w:700,size:28,col:WC_MUTED})));
    AC_LIST.forEach(([aw,cp],i)=>{const ry=r0+i*dy,ra=clamp((o.rows||0)*8-i,0,1);if(ra<=0.01)return;
      withA(q,ra,()=>{if(i%2===0){q.save();q.fillStyle=rgba([236,240,246],1);q.fillRect(x+30,ry-40,w-60,dy);q.restore();}
        withA(q,o.award||0,()=>wc_T(q,aw,X.award,ry,{w:600,size:32,col:WC_DARK,f:"mono"}));
        withA(q,o.cp||0,()=>wc_T(q,String(cp),X.cpR,ry,{w:600,size:32,col:WC_DARK,f:"mono",align:"right"}));
        ac_bar(q,X.name,ry-10,150+((i*37)%5)*16,o.who||0);ac_bar(q,X.email,ry-10,230+((i*53)%7)*14,o.who||0);});});},{titleSize:32,barH:54});}
// the change's checks as they come back: each light, its name and count (lit, three, 0 to 1); what each says (msg, 0 to 1), the
// column check's ten as a pile; the counts lit on "thirteen" (sum); and the two things none of them says, in gold (gq, two, 0 to 1)
const AC_CHECKS=[["governance","11 problems",[["has no owner"],["has no class: say whether it identifies a person",10]]],
  ["owners","1 problem",[["doesn't say how to reach: Faculty of Health"]]],["products","1 problem",[["is in no product"]]]];
function ac_checks(ctx,t,o){o=o||{};const [x,y,w,h]=AC_SC;gv_screen(ctx,x,y,w,h,"Add the advisers' call list",q=>{
    wc_T(q,"Checks",400,y+108,{w:700,size:28,col:WC_MUTED});let cy=y+172;
    AC_CHECKS.forEach(([nm,cnt,msgs],i)=>{const a=(o.lit||[])[i]||0;
      if(a>0.01)withA(q,a,()=>{const k=spring(a);q.save();q.translate(412,cy-10);q.scale(k,k);q.fillStyle=rgba(GV.red,1);q.beginPath();q.arc(0,0,12,0,TAU);q.fill();q.restore();
        if(o.sum>0)gv_tint(q,436,cy-36,tw(q,nm+" · "+cnt,30,800)+16,48,GV.red,0.5*o.sum);wc_T(q,nm+" · "+cnt,440,cy,{w:800,size:30,col:GV.redInk});});cy+=52;
      msgs.forEach(([m,n],j)=>{const ma=clamp((o.msg||0)*4-i-j*0.5,0,1);if(ma>0.01)withA(q,ma,()=>{let mx=470;
          if(n){for(let k=n-1;k>0;k--){q.save();q.fillStyle=rgba(WC_CARD,1);q.strokeStyle=rgba(WC_PENCIL,0.35);q.lineWidth=1.5;rr(q,mx-14+k*6,cy-36+k*2.5,800,48,6);q.fill();q.stroke();q.restore();}
            q.save();q.fillStyle=rgba(WC_CARD,1);q.strokeStyle=rgba(WC_PENCIL,0.5);q.lineWidth=1.5;rr(q,mx-14,cy-36,800,48,6);q.fill();q.stroke();q.restore();
            wc_T(q,"× "+n,mx,cy,{w:800,size:28,col:GV.redInk});mx+=70;}
          wc_T(q,m,mx,cy,{w:600,size:28,col:WC_INK});});cy+=48;});cy+=18;});
    // what none of them says: two gold questions, at the right
    [["right for this list?",y+420],["who decides?",y+560]].forEach(([s,gy],k)=>{const g=(o.gq||[])[k]||0;if(g<=0.01)return;gv_qmark(q,1196,gy+16,72,g);
      withA(q,clamp(g*2,0,1),()=>wc_tag(q,1250,gy,s,{size:30,wash:GV.gold,washA:0.32}));});},{titleSize:32,barH:54});}
// Jun's review queue: cards on his board, each a change waiting for him, red-pinned as nothing nobody owns should be; the Faculty of
// Health's goes up last (nu, 0 to 1). Laid out for the board close up (GV_BC); a few cards behind them, unread, fill the board
const AC_QUEUE=[["Finance",470,210,-0.03],["Planning",960,196,0.02],["wallet app",1450,220,-0.02],["learning",470,460,0.03]],
  AC_UNREAD=[[1450,470,0.03],[440,700,-0.02],[905,712,0.02],[1370,700,-0.03]];
function ac_queueCard(ctx,cx,cy,rot,team,a,k){if(a<=0.01)return;ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.scale(k,k);
  withA(ctx,a,()=>gv_card(ctx,-200,-90,400,180,["review requested",team],{size:30,headSize:30,y0:62,pinCol:GV.red}));ctx.restore();}
// a card waiting, not read here: grey lines, a red pin
function ac_unread(ctx,cx,cy,rot,i){ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);wc_panel(ctx,-190,-80,380,160,{kind:"card",seed:200+i});gv_lines(ctx,-160,-30,300,3,30,0.8);gv_pin(ctx,0,-68,GV.red,1.2);ctx.restore();}
function ac_queue(ctx,t,nu){AC_UNREAD.forEach(([cx,cy,rot],i)=>ac_unread(ctx,cx,cy,rot,i));AC_QUEUE.forEach(([tm,cx,cy,rot])=>ac_queueCard(ctx,cx,cy,rot,tm,1,1));
  if(nu>0){const u=clamp(nu,0,1);ac_queueCard(ctx,960,455-60*(1-easeCam(u)),0.025,"Health · call list",clamp(u*2,0,1),1+0.12*(1-spring(u)));}}
// the same cards, small, on the data team's board in the room (GV_DT.board)
function ac_queueSmall(ctx){const [bx,by,bw,bh]=GV_DT.board,k=bw/GV_BC[2];ctx.save();ctx.translate(bx,by);ctx.scale(k,k);ctx.translate(-GV_BC[0],-GV_BC[1]);
  AC_UNREAD.forEach(([cx,cy,rot],i)=>ac_unread(ctx,cx,cy,rot,i));
  AC_QUEUE.forEach(([tm,cx,cy,rot])=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);wc_panel(ctx,-200,-90,400,180,{kind:"card",seed:cx|0});gv_lines(ctx,-170,-40,300,3,34,0.9);gv_pin(ctx,0,-78,GV.red,1.6);ctx.restore();});
  ctx.restore();}
// the window's light on the faculty's desk, moving across it as the day goes on (u, 0 to 1)
function ac_dayLight(ctx,u,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="soft-light";const x0=lerp(260,1180,u);ctx.globalAlpha=a;
  const g=ctx.createLinearGradient(x0-260,0,x0+260,0);g.addColorStop(0,"rgba(255,226,170,0)");g.addColorStop(0.5,"rgba(255,226,170,0.9)");g.addColorStop(1,"rgba(255,226,170,0)");
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x0-260,GV_FX.top-20);ctx.lineTo(x0+260,GV_FX.top-20);ctx.lineTo(x0+60,H);ctx.lineTo(x0-460,H);ctx.closePath();ctx.fill();ctx.restore();}

// a screen far off: its page as soft lines, the new row green; the agent's comment as a small dashed cyan card with its star (cm), and
// the check's light (ok: 0 red to 1 green; null, none)
function ac_farScreen(ctx,x,y,w,h,t,o){o=o||{};ctx.save();ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x,y,w,h);ctx.fillStyle=rgba([70,96,140],1);ctx.fillRect(x,y,w,30);
  gv_lines(ctx,x+40,y+70,w*0.5,5,30,0.9);ctx.fillStyle=rgba([170,224,170],0.8);ctx.fillRect(x+20,y+186,w-40,24);
  if(o.ok!=null){ctx.fillStyle=rgba(mix(GV.red,GV.green,o.ok),1);ctx.beginPath();ctx.arc(x+w-150,y+54,9,0,TAU);ctx.fill();}
  if(o.gold>0){ctx.fillStyle=rgba(GV.gold,0.85*o.gold);ctx.fillRect(x+w*0.62,y+188,w*0.22,20);}ctx.restore();
  if(o.cm>0){withA(ctx,o.cm,()=>{wc_panel(ctx,x+60,y+224,w-120,h-240,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:77});gv_lines(ctx,x+110,y+258,w*0.5,2,26,0.8);});
    ac_star(ctx,x+86,y+248,0.6,t,o.cm);if(o.res>0)wc_tick(ctx,x+w-100,y+252,30,GV.gold,o.res,6);}}

/* ---------- Yusuf's office: the shelf, the board, and the skill's page ---------- */
// the shelf's binders where Off the shelf put them (its os_binders: two rows of 17, coloured by number), with a gap for each binder an
// earlier film took to the work (policies 2, 12, 6, 9, 15, 19 and 22), and for this film's, 26, once it's out
const AC_BIND={w:24,h:146,gap:26.6,x:1393,cols:[[96,118,150],[150,90,80],[120,140,104],[186,160,110],[132,136,150],[110,96,130]],out:[2,6,9,12,15,19,22]};
const ac_bindCol=n=>AC_BIND.cols[Math.floor(hash(n-1,17)*AC_BIND.cols.length)];
function ac_binders(ctx,out26){const B=AC_BIND;for(let i=0;i<34;i++){const n=i+1;if(B.out.includes(n)||(n===26&&out26))continue;
  gv_binder(ctx,B.x+(i%17)*B.gap,GV_OFF.shelf.rows[i<17?1:2]-B.h,B.w,B.h,ac_bindCol(n));}}
// binder 26, standing on Yusuf's desk
function ac_deskBinder(ctx){gv_binder(ctx,1040,GV_OFF.desk[1]-AC_BIND.h,AC_BIND.w,AC_BIND.h,ac_bindCol(26));}
// the framed score on the office wall, as Off the shelf left it: the maturity assessment's 2.1 of 5 (decoration)
function ac_score(ctx){const [x,y,w]=GV_OFF.score,cx=x+w/2;
  wc_T(ctx,"maturity",cx,y+40,{w:600,size:24,align:"center",col:WC_MUTED,deco:1});wc_T(ctx,"2.1 / 5",cx,y+88,{w:800,size:42,align:"center",col:WC_DARK,deco:1});
  for(let i=0;i<5;i++){const bx=x+24+i*26;ctx.fillStyle=rgba(WC_MUTED,0.25);ctx.fillRect(bx,y+104,22,12);const f=clamp(2.1-i,0,1);if(f>0){ctx.fillStyle=rgba(GV.gold,0.95);ctx.fillRect(bx,y+104,22*f,12);}}}
// the thirteen messages the checks gave: one for the owner, one for each of the ten columns, one for the register, one for the product
const AC_MSGS=["has no owner",...["learner_key","full_name","email","award_key","award_code","award_name","faculty_code","credit_points_required","credit_points_earned",
  "credit_points_remaining"].map(c=>c+" has no class"),"doesn't say how to reach: Faculty of Health","is in no product"];
// the messages as strips pinned in a column on the board in the office (small, unread) or close up (GV_BC): a, 0 to 1
function ac_msgStrips(ctx,close,a){if(a<=0.01)return;withA(ctx,a,()=>{AC_MSGS.forEach((m,i)=>{if(close){const y=96+i*57,w=Math.max(330,tw(ctx,m,28,600)+56);
      ctx.save();ctx.translate(260,y);ctx.rotate(((i*37)%7-3)*0.004);wc_panel(ctx,0,0,w,46,{kind:"card",seed:300+i});gv_pin(ctx,18,23,GV.red,0.8);
      wc_T(ctx,m,40,33,{w:600,size:28,col:WC_INK});ctx.restore();}
    else{const [bx,by]=GV_OFF.board,y=by+18+i*28;ctx.save();ctx.fillStyle=rgba(WC_CARD,1);ctx.fillRect(bx+14,y,150+((i*29)%5)*8,20);ctx.fillStyle=rgba(GV.red,1);ctx.beginPath();ctx.arc(bx+22,y+10,4,0,TAU);ctx.fill();
      ctx.fillStyle=rgba(WC_MUTED,0.4);ctx.fillRect(bx+32,y+8,100+((i*17)%4)*10,4);ctx.restore();}});});}
// the fresh page for the skill on the board: in the office (small) or close (its title written by hand, h; its steps drafted as
// pencil lines, l)
function ac_draftPage(ctx,close,h,l){if(close){const x=1040,y=110,w=580,ht=700;gv_sheet(ctx,x,y,w,ht,{rot:0.012});gv_pin(ctx,x+w/2,y+18,GV.gold,1.4);
    wc_hand(ctx,"Review a pull request",x+50,y+110,{size:44,w:700,col:WC_INK,p:clamp(h*2,0,1)});wc_hand(ctx,"for governance",x+50,y+168,{size:44,w:700,col:WC_INK,p:clamp(h*2-1,0,1)});
    if(l>0){ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=4;ctx.lineCap="round";for(let i=0;i<7;i++){const u=clamp(l*7-i,0,1);if(u<=0)break;const ly=y+260+i*58;
        ctx.beginPath();ctx.arc(x+66,ly,6,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x+96,ly);ctx.lineTo(x+96+(220+((i*53)%5)*44)*u,ly+2);ctx.stroke();}ctx.restore();}}
  else{const [bx,by,bw]=GV_OFF.board;gv_sheet(ctx,bx+bw-200,by+40,170,250,{rot:0.02});ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=3;ctx.lineCap="round";
    for(let i=0;i<Math.round(9*clamp(l,0,1));i++){ctx.beginPath();ctx.moveTo(bx+bw-180,by+80+i*22);ctx.lineTo(bx+bw-180+(90+((i*31)%4)*12),by+80+i*22);ctx.stroke();}ctx.restore();}}

// the skill's page, close: printed from the project, its path at the top; its title and first line; its seven steps, each lit (green, as
// a rule that runs) as it's named, with a pencil sign; and its don'ts, each marked with a pencil cross as it's named
const AC_STEPS=["Build what changed, and run the checks","An owner","A glossary term, or a confirmed absence","Classified columns",
  "A test, or a tracking model, for each stated rule","The impact named","Report"],
  AC_DONTS=["approve or merge the pull request","edit the business glossary","lower, narrow or delete a test","copy values out of the data"],
  AC_SK={x:316,path:154,title:230,first:288,head:368,y0:430,dy:62,dx:1240};
// a sign in pencil for each step: the checks' lights, a person, a book, a tag, a ticked box, a branch, a speech bubble
function ac_stepSign(ctx,i,x,y,a){if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.globalAlpha*=a;ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
  if(i===0)for(const dx of [-12,0,12]){ctx.moveTo(dx+5,0);ctx.arc(dx,0,5,0,TAU);}
  else if(i===1){ctx.arc(0,-7,6,0,TAU);ctx.moveTo(-11,12);ctx.quadraticCurveTo(0,-2,11,12);}
  else if(i===2){ctx.moveTo(0,-8);ctx.lineTo(-14,-11);ctx.lineTo(-14,9);ctx.lineTo(0,12);ctx.lineTo(14,9);ctx.lineTo(14,-11);ctx.lineTo(0,-8);ctx.lineTo(0,12);}
  else if(i===3){ctx.moveTo(-13,-9);ctx.lineTo(5,-9);ctx.lineTo(14,0);ctx.lineTo(5,9);ctx.lineTo(-13,9);ctx.closePath();ctx.moveTo(-4,0);ctx.arc(-6,0,2.5,0,TAU);}
  else if(i===4){ctx.rect(-12,-12,24,24);ctx.moveTo(-6,0);ctx.lineTo(-1,6);ctx.lineTo(8,-6);}
  else if(i===5){ctx.moveTo(-13,0);ctx.lineTo(0,0);ctx.lineTo(12,-10);ctx.moveTo(0,0);ctx.lineTo(12,10);ctx.moveTo(6,-11);ctx.lineTo(12,-10);ctx.lineTo(10,-4);ctx.moveTo(6,11);ctx.lineTo(12,10);ctx.lineTo(10,4);}
  else{ctx.moveTo(-13,-10);ctx.lineTo(13,-10);ctx.lineTo(13,6);ctx.lineTo(-2,6);ctx.lineTo(-8,12);ctx.lineTo(-7,6);ctx.lineTo(-13,6);ctx.closePath();}
  ctx.stroke();ctx.restore();}
// a cross in pencil, drawn as it's said (p, 0 to 1)
function ac_cross(ctx,x,y,s,p){if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=4;ctx.lineCap="round";const u=clamp(p*2,0,1),v=clamp(p*2-1,0,1);
  ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x-s+2*s*u,y-s+2*s*u);if(v>0){ctx.moveTo(x+s,y-s);ctx.lineTo(x+s-2*s*v,y-s+2*s*v);}ctx.stroke();ctx.restore();}
function ac_skillPage(ctx,t,o){o=o||{};const K=AC_SK;
  withA(ctx,o.path==null?1:o.path,()=>wc_T(ctx,"skills/review-for-governance/SKILL.md",K.x,K.path,{w:500,size:28,col:WC_MUTED,f:"mono"}));
  wc_T(ctx,"Review a pull request for governance",K.x,K.title,{w:800,size:50,col:WC_DARK});
  wc_T(ctx,"You find, draft and flag. People decide.",K.x,K.first,{w:600,size:34,col:WC_INK});
  wc_T(ctx,"Steps",K.x,K.head,{w:800,size:30,col:WC_MUTED});wc_T(ctx,"Don't",K.dx,K.head,{w:800,size:30,col:WC_MUTED});
  AC_STEPS.forEach((st,i)=>{const y=K.y0+i*K.dy,a=(o.steps||[])[i]||0;if(a>0)gv_tint(ctx,K.x+60,y-40,tw(ctx,st,32,600)+84,54,GV.green,0.75*a);
    ac_stepSign(ctx,i,K.x+20,y-11,0.35+0.65*a);wc_T(ctx,String(i+1),K.x+62,y,{w:800,size:32,col:a>0.5?WC_DARK:WC_MUTED});
    wc_T(ctx,st,K.x+100,y,{w:600,size:32,col:mix(WC_MUTED,WC_DARK,a)});});
  AC_DONTS.forEach((d,i)=>{const y=K.y0+i*K.dy;ac_cross(ctx,K.dx+16,y-11,11,(o.donts||[])[i]||0);wc_T(ctx,d,K.dx+50,y,{w:600,size:32,col:WC_INK});});}
// the skill's page, printed, on Yusuf's desk: clear of his mug, his keyboard and his pencil
function ac_paintSheet(c){gv_paintDesk(c);gv_sheet(c,236,90,1640,790);}

/* ---------- the agent's review of Anil's change ---------- */
// Anil's change as his screen shows it, seen from the desk (today)
const AC_TODAY={title:"Add the advisers' call list",rows:["learner_key","full_name","email","award_code"],added:0,sent:1};
// the review arriving on Anil's screen, seen from the desk: the cyan line reads the change's rows (read, 0 to 4; readA), then the review
// comes in over it (a, 0 to 1), a dashed cyan card with the agent's star
function ac_smallReview(ctx,t,o){o=o||{};const [x,y,w,h]=GV_FX.screen;
  if(o.read!=null&&o.readA>0){const ry=y+92+Math.min(3,o.read)*42;ac_reading(ctx,x+12,ry-30,w-24,42,o.readA);ac_star(ctx,x+28,ry-9,0.6,t,o.readA);}
  const a=o.a||0;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(0,16*(1-a));ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x+20,y+144,w-40,h-158);
    wc_panel(ctx,x+26,y+150,w-52,h-170,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:79});ac_star(ctx,x+60,y+184,0.7,t,1);
    wc_T(ctx,"Governance review",x+88,y+194,{w:800,size:26,col:WC_DARK});gv_lines(ctx,x+60,y+232,w-170,3,26,0.9);ctx.restore();});}
// the faculty's screen seen closer, filling most of the frame: the review needs the room
const AC_BIG=[110,56,1700,812];
function ac_paintScreenBig(c){c.fillStyle=rgba(WC_PAPER,1);c.fillRect(0,0,W,H);wc_wash(c,wc_rect(-40,-40,W+80,970),GV_ROOM.fac,{kind:"plaster",line:false,seed:73});
  wc_wash(c,wc_rect(-40,930,W+80,190),GV.oak,{kind:"plaster",line:false,seed:74});wc_wash(c,wc_rect(-40,924,W+80,14),wc_dim(GV.oak,0.25),{kind:"trim",line:false,flat:true});
  const [x,y,w,h]=AC_BIG;wc_part(c,[[x+w/2-50,y+h+12],[x+w/2+50,y+h+12],[x+w/2+62,936],[x+w/2-62,936]],GV.metal,1);gv_monitor(c,x,y,w,h,{stand:false});}
// the change's files, as its page lists them; and the review's three findings, each a title, then its line, the rule, the draft and who
// decides (a value is [text, "m"] in code type, or [text, "g"] in green, for a test that passes); the first also says who'd be asked
const AC_FILES=["models/_shared/_shared__conceptual.md","models/marts/health/_health__conceptual.yml","models/marts/health/_health__definitions.md",
  "models/marts/health/_health__models.yml","models/marts/health/_health__physical.md","models/marts/health/mart_health__learner_progress.sql"],
  AC_FIND=[{title:"Nobody answers for it",f:[["line",["_health__models.yml,","m"],"line 8"],["rule","every model others read","has an owner"],
      ["drafted",["owner: Faculty of Health","m"]],["who decides","data governance"]],red:"Who to ask: nobody named"},
    {title:"Ten columns with no class",f:[["line",["_health__models.yml,","m"],"lines 13 to 42"],["rule","every column says whether","it identifies a person"],
      ["drafted","a class for each"],["who decides","Faculty of Health"]]},
    {title:"A stated rule has no test",f:[["line",["_health__conceptual.yml,","m"],"line 30"],["rule","Only the faculty's own awards","(faculty code HLT)."],
      ["drafted",["accepted_values: [HLT]","m"],["validity · passes: 7 of 7","g"]],["who decides","Faculty of Health · Jun"]]}],
  AC_RV={x:160,band:172,files:240,f0:292,fdy:48,card:600,scroll:470,cy:770,cx:[170,704,1238],cw:510,ch:548};
// a finding's number, white in a cyan disc
function ac_num(ctx,n,x,y){ctx.save();ctx.fillStyle=rgba(AC_CYAN,1);ctx.beginPath();ctx.arc(x,y,21,0,TAU);ctx.fill();ctx.restore();
  wc_T(ctx,String(n),x,y+10,{w:800,size:28,col:[255,255,255],align:"center"});}
// one finding's card: its labels as they're named (lab, four, 0 to 1); each field's values as they're said (at: a start time per field, or a
// time per value; the last, the red line); dim fades it back while another is spoken about. Every card keeps two lines for its draft,
// so "who decides" sits at the same height on all three
function ac_findCard(q,i,t,o){const F=AC_FIND[i],R=AC_RV,x=R.cx[i],y=R.cy,w=R.cw,a=(o.a||0)*(o.dim==null?1:o.dim);if(a<=0.01)return;
  withA(q,a,()=>{wc_panel(q,x,y,w,R.ch,{kind:"card",seed:90+i});ac_num(q,i+1,x+44,y+44);wc_T(q,F.title,x+78,y+54,{w:800,size:30,col:WC_DARK});
    const at=o.at||[],tv=(k,j)=>{const s=at[k];return s==null?1e9:Array.isArray(s)?s[j]:s+0.25*j;};let fy=y+96;
    F.f.forEach(([lab,...vals],k)=>{withA(q,o.lab?clamp(o.lab[k],0,1):1,()=>wc_T(q,lab,x+24,fy,{w:600,size:28,col:k===3?GV.goldInk:WC_MUTED}));
      vals.forEach((v,j)=>{const V=typeof v==="string"?[v]:v,f=fin(t,tv(k,j),0.45);if(f<=0.01)return;
        withA(q,f,()=>wc_T(q,V[0],x+24,fy+33*(j+1)+6*(1-f),{w:k===3?700:600,size:28,f:V[1]==="m"?"mono":undefined,col:k===3?GV.goldInk:V[1]==="g"?GV.greenInk:WC_DARK}));});
      fy+=33*(1+Math.max(vals.length,k===2?2:0))+10;});
    const f=F.red?fin(t,at[4]==null?1e9:at[4],0.45):0;if(f>0.01)withA(q,f,()=>{q.save();q.strokeStyle=rgba(WC_PENCIL,0.3);q.lineWidth=1.5;q.beginPath();
      q.moveTo(x+24,fy-8);q.lineTo(x+w-24,fy-8);q.stroke();q.restore();wc_T(q,F.red,x+24,fy+26,{w:700,size:28,col:GV.redInk});});});}
// the change's page on the screen, closer: its checks and files; the review under them, the agent's comment, not an approval, with what
// passed (pass, two, 0 to 1); then, scrolled down (scroll, 0 to 1), the three findings (find, three, 0 to 1; lab; at, per card; dim, per card)
function ac_review(ctx,t,o){o=o||{};const [x,y,w,h]=AC_BIG,R=AC_RV;gv_screen(ctx,x,y,w,h,"Add the advisers' call list",q=>{
  q.save();q.beginPath();q.rect(x,y+54,w,h-54);q.clip();q.translate(0,-R.scroll*easeCam(clamp(o.scroll||0,0,1)));
  wc_T(q,"Call list",R.x,R.band,{w:800,size:32,col:WC_DARK});
  for(let i=0;i<3;i++){q.save();q.fillStyle=rgba(GV.red,1);q.beginPath();q.arc(420+i*32,R.band-10,11,0,TAU);q.fill();q.restore();}
  wc_T(q,"3 checks · 13 problems",500,R.band,{w:700,size:28,col:GV.redInk});
  ["Approve","Merge"].forEach((b,i)=>{const bx=x+w-400+i*190,by=R.band-38;wc_panel(q,bx,by,170,52,{kind:"pill",seed:61+i});wc_T(q,b,bx+85,by+36,{w:700,size:28,col:WC_MUTED,align:"center"});});
  wc_T(q,"Files changed · 6",R.x,R.files,{w:700,size:28,col:WC_MUTED});
  AC_FILES.forEach((f,i)=>{const ry=R.f0+i*R.fdy;wc_T(q,"+",R.x+6,ry,{w:800,size:28,col:GV.greenInk});wc_T(q,f,R.x+40,ry,{w:600,size:28,col:WC_DARK,f:"mono"});});
  wc_panel(q,140,R.card,1640,760,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:88});ac_star(q,190,R.card+50,1,t,1);
  wc_T(q,"Governance review",230,R.card+62,{w:800,size:34,col:WC_DARK});wc_T(q,"a comment, not an approval",1750,R.card+62,{w:600,size:28,col:WC_MUTED,align:"right"});
  wc_T(q,"Passed",180,R.card+128,{w:700,size:28,col:WC_MUTED});
  [["the impact: nothing else touched",330],["the glossary: no new term",1000]].forEach(([s,px],k)=>{const p=(o.pass||[])[k]||0;if(p<=0)return;
    wc_tick(q,px+14,R.card+118,30,GV.green,p,6);withA(q,clamp(p*1.5,0,1),()=>wc_T(q,s,px+44,R.card+128,{w:600,size:30,col:WC_DARK}));});
  for(let i=0;i<3;i++)ac_findCard(q,i,t,{a:(o.find||[])[i]||0,lab:o.lab,at:(o.at||[])[i],dim:(o.dim||[])[i]});
  q.restore();},{titleSize:32,barH:54});}
// finding 2, opened to fill the screen: its number and title, and what its evidence is
function ac_f2Panel(q){wc_panel(q,140,130,1640,720,{kind:"card",seed:91});ac_num(q,2,194,192);wc_T(q,"Ten columns with no class",228,202,{w:800,size:30,col:WC_DARK});
  wc_T(q,"counts, never values",1740,202,{w:600,size:28,col:WC_MUTED,align:"right"});}
// finding 2, close: the email column as the agent sees it, masked, as grey bars; it reads each row (read, 0 to 7) and ticks it; then
// what the counts say (says, 0 to 4: the rows, the distinct values, how many look like an email, and the class it drafts)
const AC_TL={bars:[300,340,280,360,320,300,340],y0:346,dy:60,rx:860,ry:[372,446,520,640]};
function ac_tally(ctx,t,o){o=o||{};const [x,y,w,h]=AC_BIG,T_=AC_TL;gv_screen(ctx,x,y,w,h,"Add the advisers' call list",q=>{ac_f2Panel(q);
  wc_T(q,"email",200,288,{w:600,size:28,col:WC_MUTED,f:"mono"});
  const n=o.read||0;T_.bars.forEach((bw,i)=>{const by=T_.y0+i*T_.dy;ac_bar(q,200,by,bw,1);wc_tick(q,610,by-2,26,AC_CYAN,clamp(n-i,0,1),5);});
  if(o.readA>0&&n<7){const by=T_.y0+Math.min(6,Math.floor(n))*T_.dy;ac_reading(q,190,by-26,400,52,o.readA);ac_star(q,184,by,0.8,t,o.readA);}
  q.save();q.strokeStyle=rgba(WC_PENCIL,0.25);q.lineWidth=1.5;q.beginPath();q.moveTo(760,270);q.lineTo(760,760);q.stroke();q.restore();
  const s=o.says||0;[["7 rows",0],["6 distinct",1],["7 look like an email",2]].forEach(([l,k])=>{const a=clamp(s-k,0,1);if(a>0.01)withA(q,a,()=>wc_T(q,l,T_.rx,T_.ry[k]+8*(1-a),{w:700,size:40,col:WC_DARK}));});
  const d=clamp(s-3,0,1);if(d>0.01)withA(q,d,()=>{wc_T(q,"drafted class",T_.rx,T_.ry[3]-64,{w:600,size:28,col:WC_MUTED});
    wc_panel(q,T_.rx,T_.ry[3]-42,190,60,{kind:"pill",dashed:true,role:WC_SIDE.tech,seed:93});wc_T(q,"direct",T_.rx+95,T_.ry[3]-2,{w:700,size:32,col:WC_DARK,f:"mono",align:"center"});});},
  {titleSize:32,barH:54});}

/* ---------- people decide: what the agent wasn't sure of, Anil's answer, and the owners' approvals ---------- */
// the drafted classes and their evidence, as the review lists them; two are marked "not sure" (unsure, 0 to 1); once Anil has answered
// (ok, 0 to 1), award_key is none, in gold, and full_name is direct, in gold; his reason takes the place of award_key's counts (why)
const AC_CLS=[["email","direct","7 rows · 6 distinct · 7 look like an email"],["full_name","direct","7 rows · 7 distinct",1],
  ["learner_key","pseudonymous","7 rows · 7 distinct · 7 look like a hash"],["award_key","pseudonymous","7 rows · 2 distinct · 7 look like a hash",1],
  ...["award_code","award_name","faculty_code","credit_points_required","credit_points_earned","credit_points_remaining"].map(c=>[c,"none","no email, ID or hash"])];
function ac_notSure(q,x,y,a){if(a<=0.01)return;withA(q,a,()=>{wc_panel(q,x,y-34,140,46,{kind:"pill",seed:97});wc_T(q,"not sure",x+70,y-2,{w:700,size:28,col:WC_INK,align:"center"});});}
function ac_classes(ctx,t,o){o=o||{};const [x,y,w,h]=AC_BIG,ok=clamp(o.ok||0,0,1),un=clamp(o.unsure||0,0,1);gv_screen(ctx,x,y,w,h,"Add the advisers' call list",q=>{ac_f2Panel(q);
  [["column",200],["drafted class",640],["evidence",1060]].forEach(([s,hx])=>wc_T(q,s,hx,272,{w:700,size:28,col:WC_MUTED}));
  AC_CLS.forEach(([c,k,ev,ns],i)=>{const ry=328+i*52,ak=c==="award_key";
    if(ns){gv_tint(q,180,ry-38,1580,50,WC_SIDE.tech,0.55*un*(1-ok));gv_tint(q,180,ry-38,1580,50,GV.gold,0.6*ok);}
    wc_T(q,c,200,ry,{w:600,size:28,col:WC_DARK,f:"mono"});
    const kc=ns?mix(WC_DARK,GV.goldInk,ok):WC_DARK;
    if(ak){withA(q,1-ok,()=>wc_T(q,k,640,ry,{w:600,size:28,col:WC_DARK,f:"mono"}));withA(q,ok,()=>wc_T(q,"none",640,ry,{w:600,size:28,col:GV.goldInk,f:"mono"}));}
    else wc_T(q,k,640,ry,{w:600,size:28,col:kc,f:"mono"});
    if(ns)ac_notSure(q,640+tw(q,k,28,600,"mono")+22,ry,un*(1-ok));
    if(ak){const wy=clamp(o.why==null?ok:o.why,0,1);withA(q,1-wy,()=>wc_T(q,ev,1060,ry,{w:500,size:28,col:WC_INK}));
      withA(q,wy,()=>wc_T(q,"a course, not a person (Anil Kurian)",1060,ry,{w:600,size:28,col:GV.goldInk}));}
    else wc_T(q,ev,1060,ry,{w:500,size:28,col:k==="none"?WC_MUTED:WC_INK});});},{titleSize:32,barH:54});}
// the two keys side by side, as the agent sees them: long coded strings, grey bars of one length, whose marks stand for their values, so
// rows with one value look alike (lp, ap: the marks, 0 to 1); their counts, line by line (lc, ac, 0 to 1; the learner key's ends with a
// sign of a person); "looks like a hash" under both (tag); the award key's
// description (desc) and a grey question mark (q); then (s, 0 to 1) the learner key goes and the award key moves left, and on the right
// come the skill's step 4 (step), the class it drafts, not sure (draft), and its question (ask)
const AC_KEYS={y0:322,dy:44,bw:400,award:[2,2,1,2,1,1,1]};
function ac_hashBar(q,x,y,w,seed,p){ac_bar(q,x,y,w,1);if(p<=0.01)return;q.save();q.fillStyle=rgba(WC_DARK,0.4*p);
  for(let k=0,px=x+16;px<x+w-30;k++){const sw=6+18*hash(seed*31+k,5);q.fillRect(px,y-4,sw,8);px+=sw+6+12*hash(seed*17+k,9);}q.restore();}
function ac_keyCol(q,x,name,seeds,p,cnt,lines,tag){const K=AC_KEYS;wc_T(q,name,x,272,{w:600,size:28,col:WC_MUTED,f:"mono"});
  seeds.forEach((sd,i)=>ac_hashBar(q,x,K.y0+i*K.dy,K.bw,sd,p));
  lines.forEach((l,j)=>{const a=clamp((cnt-j*0.3)/0.4,0,1);if(a>0.01)withA(q,a,()=>wc_T(q,l,x+K.bw+40,366+j*56+6*(1-a),{w:700,size:34,col:WC_DARK}));});
  if(tag>0.01)withA(q,tag,()=>wc_tag(q,x+K.bw/2,650,"looks like a hash",{size:28,wash:WC_SIDE.tech,washA:0.3,align:"center"}));}
function ac_keys(ctx,t,o){o=o||{};const [x,y,w,h]=AC_BIG,s=easeCam(clamp(o.s||0,0,1));gv_screen(ctx,x,y,w,h,"Add the advisers' call list",q=>{ac_f2Panel(q);
  withA(q,1-s,()=>{ac_keyCol(q,210,"learner_key",[11,12,13,14,15,16,17],o.lp||0,o.lc||0,["7 rows","7 distinct"],o.tag||0);
    const pa=clamp(((o.lc||0)-0.6)/0.4,0,1);if(pa>0.01){q.save();q.translate(700,500);q.scale(2.2,2.2);ac_stepSign(q,1,0,0,pa);q.restore();}});
  q.save();q.translate(-780*s,0);ac_keyCol(q,990,"award_key",AC_KEYS.award,o.ap||0,o.ac||0,["7 rows","2 distinct"],o.tag||0);
  if(o.q>0){const k=spring(clamp(o.q,0,1));q.save();q.translate(1700,420);q.scale(k,k);withA(q,clamp(o.q*2,0,1),()=>wc_T(q,"?",0,0,{w:800,size:72,align:"center",col:GV.greyInk}));q.restore();}
  if(o.desc>0.01)withA(q,o.desc,()=>wc_T(q,"“The award's hash key: the sha-256 of award_bk.”",990,730,{w:500,size:28,col:WC_INK}));q.restore();
  const st=o.step||0;if(st>0.01)withA(q,clamp(st*1.5,0,1),()=>{gv_sheet(q,1000,280,740,170,{rot:-0.008});ac_stepSign(q,3,1040,328,1);
    wc_T(q,"4   Classified columns",1074,340,{w:700,size:32,col:WC_DARK});gv_tint(q,1030,372,tw(q,"when in doubt, propose the stricter class",30,500)+20,50,GV.green,0.75*clamp(st*2-1,0,1));
    wc_T(q,"when in doubt, propose the stricter class",1040,408,{w:500,size:30,col:WC_DARK});});
  const dr=o.draft||0;if(dr>0.01)withA(q,dr,()=>{wc_T(q,"drafted class",1000,524,{w:600,size:28,col:WC_MUTED});
    wc_panel(q,1000,542,250,56,{kind:"pill",dashed:true,role:WC_SIDE.tech,seed:93});wc_T(q,"pseudonymous",1125,580,{w:600,size:30,col:WC_DARK,f:"mono",align:"center"});
    ac_notSure(q,1272,582,1);});
  ac_card(q,1000,630,740,140,t,["If it hashes the award's code,","it's none: please confirm."],{a:o.ask||0,size:30,y0:58,gap:14,head:false});},{titleSize:32,barH:54});}
// the agent's question and Anil's answer on his screen, seen from the desk: the answer is typed (typed, 0 to 1), in gold
function ac_smallReply(ctx,t,o){o=o||{};const [x,y,w,h]=GV_FX.screen;gv_screen(ctx,x,y,w,h,"Add the advisers' call list",q=>{
  wc_panel(q,x+20,y+58,w-40,124,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:79});ac_star(q,x+50,y+88,0.7,t,1);
  wc_T(q,"If it hashes the award's code,",x+78,y+100,{w:600,size:24,col:WC_INK});wc_T(q,"it's none: please confirm.",x+78,y+134,{w:600,size:24,col:WC_INK});
  const a=o.a||0;if(a<=0.01)return;withA(q,a,()=>{wc_panel(q,x+20,y+194,w-40,124,{kind:"card",wash:GV.gold,washA:0.3,seed:81});
    wc_T(q,"Anil Kurian",x+44,y+228,{w:700,size:24,col:WC_MUTED});const L=["It hashes the award's code:","a course, not a person."],n=Math.round(clamp(o.typed||0,0,1)*(L[0].length+L[1].length));
    wc_T(q,L[0].slice(0,n),x+44,y+262,{w:600,size:24,col:GV.goldInk});if(n>L[0].length)wc_T(q,L[1].slice(0,n-L[0].length),x+44,y+294,{w:600,size:24,col:GV.goldInk});});},{titleSize:26,barH:44});}
// the change's page again: its checks, passed now the drafts are in; the review's three findings, in cyan (dim, 0 to 1, fades them back);
// the approvals, each a person's, in gold (ap, three, 0 to 1); and a gold thread from each finding to whoever decided it (th, 0 to 1)
const AC_AP=[{x:170,name:"Yusuf Demir",what:"new owner",from:[0]},{x:704,name:"Faculty of Health",what:"classes and rule",from:[1,2]},{x:1238,name:"Jun Park",what:"code",from:[2]}],
  AC_APY={find:300,lab:520,card:560,ch:190};
function ac_approvals(ctx,t,o){o=o||{};const [x,y,w,h]=AC_BIG,R=AC_RV,Y=AC_APY;gv_screen(ctx,x,y,w,h,"Add the advisers' call list",q=>{
  wc_T(q,"Call list",R.x,R.band,{w:800,size:32,col:WC_DARK});
  let lx=420;["governance","owners","products"].forEach(s=>{q.save();q.fillStyle=rgba(GV.green,1);q.beginPath();q.arc(lx,R.band-10,11,0,TAU);q.fill();q.restore();
    wc_T(q,s,lx+22,R.band,{w:700,size:28,col:GV.greenInk});lx+=22+tw(q,s,28,700)+44;});wc_T(q,"· passed",lx-14,R.band,{w:700,size:28,col:GV.greenInk});
  ["Approve","Merge"].forEach((b,i)=>{const bx=x+w-400+i*190,by=R.band-38;wc_panel(q,bx,by,170,52,{kind:"pill",seed:61+i});wc_T(q,b,bx+85,by+36,{w:700,size:28,col:WC_MUTED,align:"center"});});
  const dm=1-0.6*clamp(o.dim||0,0,1);withA(q,dm,()=>{wc_T(q,"Governance review",R.x,Y.find-40,{w:700,size:28,col:WC_MUTED});
    AC_FIND.forEach((F,i)=>{const fx=R.cx[i];wc_panel(q,fx,Y.find,R.cw,76,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:95+i});ac_num(q,i+1,fx+44,Y.find+38);
      wc_T(q,F.title,fx+78,Y.find+48,{w:800,size:30,col:WC_DARK});});});
  const th=o.th||0;if(th>0.01){q.save();q.strokeStyle=rgba(GV.gold,1);q.fillStyle=rgba(GV.gold,1);q.lineWidth=5;q.lineCap="round";
    AC_AP.forEach((A,j)=>A.from.forEach(i=>{const x0=R.cx[i]+R.cw/2,y0=Y.find+82,x1=A.x+R.cw/2,y1=Y.card-6,u=clamp(th*1.4-j*0.2,0,1);if(u<=0)return;
      const P_=v=>{const a=1-v;return[a*a*a*x0+3*a*a*v*x0+3*a*v*v*x1+v*v*v*x1,a*a*a*y0+3*a*a*v*(y0+90)+3*a*v*v*(y1-90)+v*v*v*y1];};
      q.beginPath();q.arc(x0,y0,6,0,TAU);q.fill();q.beginPath();for(let k=0;k<=40*u;k++)q.lineTo(...P_(k/40));q.stroke();
      if(u>=1){q.beginPath();q.arc(x1,y1,6,0,TAU);q.fill();}}));q.restore();}
  if((o.ap||[]).some(a=>a>0))wc_T(q,"Approvals",R.x,Y.lab,{w:700,size:28,col:WC_MUTED});
  AC_AP.forEach((A,j)=>{const a=(o.ap||[])[j]||0;if(a<=0.01)return;withA(q,clamp(a*2,0,1),()=>{wc_panel(q,A.x,Y.card,R.cw,Y.ch,{kind:"card",wash:GV.gold,washA:0.3,seed:70+j});
      wc_T(q,A.name,A.x+30,Y.card+64,{w:800,size:32,col:WC_DARK});wc_T(q,A.what,A.x+30,Y.card+108,{w:600,size:28,col:WC_INK});});
    gv_stamp(q,A.x+R.cw-130,Y.card+140,"APPROVED",clamp(a*2-1,0,1),{size:28,col:GV.goldInk,rot:-0.07});});},{titleSize:32,barH:54});}

const WC_PLACES={screenMorning:ac_paintScreenFacMorning,dusk:ac_paintDusk,night:ac_paintNight,faculty:gv_paintFaculty,facDusk:ac_paintFacDusk,facNight:ac_paintFacNight,facMorning:ac_paintFacMorning,
  screenFac:ac_paintScreenFac,screenNight:ac_paintScreenFacNight,screenPlat:ac_paintScreenPlat,screenData:ac_paintScreenData,data:gv_paintData,
  boardData:c=>gv_paintBoardClose(c,GV_ROOM.data),office:gv_paintOffice,boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),desk:gv_paintDesk,
  platClose:gv_paintPlatformClose,page:ac_paintPage,sheet:ac_paintSheet,screenBig:ac_paintScreenBig};
