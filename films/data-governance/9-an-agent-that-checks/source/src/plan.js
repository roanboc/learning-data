/* ===== An agent that checks: the places and the pictures =====
   The places are painted once and kept (shared/src/finish.js). Only the university's own places (the series' rooms.js): the campus at
   dusk and at night, the Faculty of Health's office in the old building (by day, at dusk and in the morning), screens close up (its own
   at night and in the morning), the data team's room and its board, Yusuf's office, his board and his desk, and the platform team's
   desk. The pictures are the film's own things: the agent's sign (a small turning star on a dashed cyan card, never a person), Anil's
   change and its checks, the call list with its names and emails as grey bars, the review queue on Jun's board, the skill's page, the
   agent's review and its three findings, the two coded keys, the approvals, the agent's card of access, the list of who reviews what,
   binders 26 and 12, and the tags. Every name starts with ac_ or AC_. */

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

/* ---------- the faculty's office: by day, at dusk and in the morning ---------- */
function ac_paintFacDusk(c){gv_paintFaculty(c);ac_grade(c,"dusk");}
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
// how wide the series' chip for a class is (gv_classChip's own measure)
const ac_chipW=(q,cls)=>Math.round(tw(q,cls,28,700)+44);
// a gold ring round something a person has decided (a, 0 to 1)
function ac_goldRing(q,x,y,w,h,a){if(a<=0.01)return;q.save();q.strokeStyle=rgba(GV.gold,0.95*a);q.lineWidth=4.5;rr(q,x,y,w,h,h/2);q.stroke();q.restore();}
// a class the agent drafts: the series' chip in a dashed cyan pill, the agent's, centred on y; returns its width
function ac_drafted(q,x,y,cls){const w=ac_chipW(q,cls)+24;wc_panel(q,x,y-36,w,72,{kind:"pill",dashed:true,role:WC_SIDE.tech,seed:93});gv_classChip(q,x+12,y,cls);return w;}
// a red question mark: something nobody has said yet (grey, col: nothing there to check)
function ac_redQ(ctx,x,y,s,p,col){if(p<=0)return;const k=spring(p);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(p*2,0,1),()=>wc_T(ctx,"?",0,0,{w:800,size:s,align:"center",col:col||GV.redInk}));ctx.restore();}
// a name card: a person's name and what they do
function ac_nameCard(ctx,x,y,name,role,a){if(a<=0.01)return;const w=Math.round(Math.max(tw(ctx,name,32,800),tw(ctx,role,28,600))+60);
  withA(ctx,a,()=>{ctx.save();ctx.translate(0,12*(1-a));wc_panel(ctx,x,y,w,112,{kind:"card",seed:5});wc_T(ctx,name,x+30,y+48,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,role,x+30,y+90,{w:600,size:28,col:WC_MUTED});ctx.restore();});}
// a tag that springs in at t0 and goes at t1 (or stays); o.wash colours it
function ac_tagAt(ctx,t,t0,t1,x,y,s,o){const a=t1==null?fin(t,t0,0.35):gv_io(t,t0,t1,0.35);if(a<=0.01)return;const k=0.9+0.1*spring(fin(t,t0,0.5));
  ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,a,()=>wc_tag(ctx,0,0,s,Object.assign({align:"center"},o||{})));ctx.restore();}

/* ---------- the change request: a plain form, the same on a screen as on paper ---------- */
// the list's columns as the faculty's form shows them, each with its class of personal data (the series' chips), and the new one
const AC_COLS=[["learner code","pseudonymous"],["name","direct"],["email","direct"],["award","none"]],AC_NEW="date of birth";
// the form on the screen close up (AC_SC): the list's name, the change, its checks (ok: 0 red to 1 green), the columns and their
// classes; the new row in green, a red question mark where its class should be (q), the agent's draft there (draft), or the class
// Anil gives it, landing at clsAt in a gold ring; and "Signed", the empty line for the faculty's signature, ringed in pencil (ring).
// read and readA: the agent's star and its cyan line on a row; fade sets the form back under what's laid over it
const AC_F={x:380,list:230,title:284,chk:342,head:410,y0:466,dy:58,cls:716,sign:776,read:[362,640]};
function ac_form(ctx,t,o){o=o||{};const [x,y,w,h]=AC_SC,F=AC_F,rows=AC_COLS.concat([[AC_NEW,null]]),ok=clamp(o.ok||0,0,1);
  gv_screen(ctx,x,y,w,h,"Change request",q=>withA(q,1-0.8*(o.fade||0),()=>{
    wc_T(q,"Call list",F.x,F.list,{w:700,size:30,col:WC_MUTED});wc_T(q,o.title||"Add each learner's date of birth",F.x,F.title,{w:800,size:40,col:WC_DARK});
    // its checks: a light and a line, red with a gap, green once they pass
    q.save();q.fillStyle=rgba(mix(GV.red,GV.green,ok),1);q.beginPath();q.arc(F.x+12,F.chk-10,12,0,TAU);q.fill();q.restore();
    withA(q,1-ok,()=>wc_T(q,"checks · 1 gap",F.x+38,F.chk,{w:700,size:30,col:GV.redInk}));withA(q,ok,()=>wc_T(q,"checks · passed",F.x+38,F.chk,{w:700,size:30,col:GV.greenInk}));
    wc_T(q,"column",F.x,F.head,{w:700,size:28,col:WC_MUTED});wc_T(q,"personal data",F.cls,F.head,{w:700,size:28,col:WC_MUTED});
    rows.forEach(([c,k],i)=>{const ry=F.y0+i*F.dy;if(k==null){q.save();q.fillStyle=rgba([214,240,214],0.9);q.fillRect(x+12,ry-40,638,56);q.restore();
        wc_T(q,"+",x+20,ry,{w:800,size:32,col:GV.greenInk});}
      wc_T(q,c,F.x,ry,{w:600,size:32,col:WC_DARK});if(k)gv_classChip(q,F.cls,ry-11,k);});
    if(o.readA>0){const ry=F.y0+clamp(o.read||0,0,4)*F.dy;ac_reading(q,F.read[0],ry-42,F.read[1],58,o.readA);ac_star(q,F.read[0]-6,ry-13,0.9,t,o.readA);}
    // the new row's class: nothing yet, the agent's draft, or Anil's, in gold
    const ly=F.y0+4*F.dy,cu=o.clsAt==null?0:fin(t,o.clsAt,0.4),dr=clamp(o.draft||0,0,1)*(1-cu);
    ac_redQ(q,F.cls+30,ly+8,56,(o.q||0)*(1-clamp(dr*2,0,1))*(1-cu));
    if(dr>0.01)withA(q,dr,()=>ac_drafted(q,F.cls-12,ly-11,"direct"));
    if(cu>0){gv_classChipAt(q,t,o.clsAt,F.cls,ly-11,"direct");ac_goldRing(q,F.cls-9,ly-45,ac_chipW(q,"direct")+18,68,cu);}
    // signed: an empty line for the faculty's signature; the pencil ring round it says only people fill it
    q.save();q.strokeStyle=rgba(WC_MUTED,0.4);q.lineWidth=2;q.beginPath();q.moveTo(F.x,F.sign-50);q.lineTo(x+650,F.sign-50);q.stroke();
    q.strokeStyle=rgba(WC_MUTED,0.6);q.lineWidth=1.8;q.beginPath();q.moveTo(F.x+134,F.sign+8);q.lineTo(F.x+520,F.sign+8);q.stroke();q.restore();
    wc_T(q,"Signed",F.x,F.sign,{w:600,size:30,col:WC_MUTED});if(o.ring>0)wc_ring(q,F.x+327,F.sign-2,190,34,o.ring,{col:WC_PENCIL,lw:4,seed:23});
  }),{titleSize:32,barH:54});}
// the agent's note, pinned beside the new row: three dashed cyan cards under its star, "where", "our rule" and "who decides", each
// coming in as it's named (p, three, 0 to 1; left out, all there); lit, a card washed green (a rule that runs) or cyan; res, the gold
// tick that resolves it; a fades it all; at x0, y0 (the close-up's, left out)
const AC_NOTE=[["where",["date of birth"]],["our rule",["every column says whether it","identifies a person"]],["who decides",["Faculty of Health"]]],
  AC_NT={x:1020,w:540,ys:[318,440,600],hs:[106,144,106]};
function ac_note(ctx,t,o){o=o||{};const N=AC_NT,a=o.a==null?1:o.a,p=o.p||[1,1,1];if(a<=0.01)return;withA(ctx,a,()=>{
  // the pin's thread, from the new row to the note
  const ly=AC_F.y0+4*AC_F.dy-12,f=clamp(p[0]*3,0,1);if(f>0){ctx.save();ctx.strokeStyle=rgba(AC_CYAN,0.85);ctx.setLineDash([7,7]);ctx.lineWidth=3;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(AC_F.cls+250,ly);ctx.lineTo(lerp(AC_F.cls+250,N.x,f),lerp(ly,N.ys[2]+N.hs[2]/2,f));ctx.stroke();ctx.restore();}
  AC_NOTE.forEach(([lab,val],i)=>{const u=clamp(p[i],0,1);if(u<=0.01)return;const y=N.ys[i],h=N.hs[i],k=0.92+0.08*spring(u);
    ctx.save();ctx.translate(N.x+N.w/2,y+h/2);ctx.scale(k,k);ctx.translate(-N.x-N.w/2,-y-h/2);withA(ctx,clamp(u*2,0,1),()=>{
      ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(N.x+4,y+4,N.w-8,h-8);wc_panel(ctx,N.x,y,N.w,h,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:150+i});
      const lit=(o.lit||[])[i]||0;if(lit>0.01)gv_tint(ctx,N.x+8,y+8,N.w-16,h-16,o.litCol||GV.green,0.7*lit);
      const lx=N.x+(i===0?84:30);if(i===0)ac_star(ctx,N.x+44,y+46,1.1,t,1);
      wc_T(ctx,lab,lx,y+44,{w:700,size:28,col:i===2?GV.goldInk:WC_MUTED});
      val.forEach((v,j)=>wc_T(ctx,v,lx,y+88+j*40,{w:i===2?800:600,size:i===1?30:32,col:i===2?GV.goldInk:WC_DARK}));});ctx.restore();});
  if(o.res>0)wc_tick(ctx,N.x+N.w-52,N.ys[0]+50,50,GV.gold,o.res,8);});}
// the series' chip for a class (gv_classChip), drawn the same; deco marks its word as texture, for a screen seen from across the room
function ac_chip(ctx,x,y,cls,o){o=o||{};const s=o.size||28,w=Math.round(tw(ctx,cls,s,700)+44),h=s+22;wc_panel(ctx,x,y-h/2,w,h,{kind:"chip",fill:GV_CLASS[cls],seed:cls.length+3});
  wc_T(ctx,cls,x+22,y+s*0.36,{w:700,size:s,col:cls==="direct"?[255,255,255]:WC_DARK,deco:o.deco});return w;}
// the same form on the faculty's screen, seen from the desk (GV_FX.screen, read at 1.3 or closer): the change in its bar, with the
// button that sends it (sent, 0 to 1); its columns and classes (rows, each [name, class or null]; left out, the date of birth's), those
// from newFrom on new, in green, the last typed in (typed, 0 to 1; left out, there), and more, a line for the columns below them; a red
// question mark on the last row (q), or Anil's class there, in a gold ring (cls, 0 to 1); its checks' light (ok, when given); the agent's
// note beside it, small (note, 0 to 1; res, its tick); veil clears the page for what's drawn over it; dim puts the screen to sleep;
// deco, from across the room
function ac_formSmall(ctx,t,o){o=o||{};const [x,y,w,h]=GV_FX.screen,rows=o.rows||AC_COLS.concat([[AC_NEW,null]]),nf=o.newFrom==null?rows.length-1:o.newFrom,
    X=x+40,C=x+232,y0=y+86,dy=o.dy||46,dc=o.deco?1:0;
  gv_screen(ctx,x,y,w,h,null,q=>{wc_T(q,o.title||"Add each learner's date of birth",x+18,y+32,{w:700,size:22,col:[255,255,255],deco:dc});
    const sent=o.sent||0,bx=x+w-112,by=y+6;gv_halo(q,bx-8,by-6,116,44,GV.green,0.8*Math.sin(Math.PI*clamp(sent*1.6,0,1)));
    q.save();q.fillStyle=rgba(sent>0.6?[96,120,160]:[236,240,246],1);rr(q,bx,by,100,32,16);q.fill();q.restore();
    wc_T(q,sent>0.6?"sent":"Send",bx+50,by+24,{w:700,size:22,col:sent>0.6?[236,240,246]:WC_DARK,align:"center",deco:dc});
    rows.forEach(([c,k],i)=>{const ry=y0+i*dy,typing=i===rows.length-1&&o.typed!=null,n=typing?Math.round(c.length*clamp(o.typed,0,1)):c.length;if(n<=0)return;
      if(i>=nf){q.save();q.fillStyle=rgba([214,240,214],0.9);q.fillRect(x+10,ry-31,w-20,Math.min(44,dy-2));q.restore();wc_T(q,"+",x+18,ry,{w:800,size:22,col:GV.greenInk,deco:dc});}
      wc_T(q,c.slice(0,n),X,ry,{w:600,size:23,col:WC_DARK,deco:dc});if(k)ac_chip(q,C,ry-8,k,{size:22,deco:dc});
      if(typing&&n<c.length&&Math.floor(t*3)%2===0){q.save();q.fillStyle=rgba(WC_DARK,0.8);q.fillRect(X+tw(q,c.slice(0,n),23,600)+3,ry-22,3,26);q.restore();}});
    if(o.more)wc_T(q,o.more,X,y0+rows.length*dy,{w:600,size:23,col:WC_MUTED,deco:dc});
    const ly=y0+(rows.length-1)*dy,cu=clamp(o.cls||0,0,1);ac_redQ(q,C+22,ly+6,40,(o.q||0)*(1-cu));
    if(cu>0){withA(q,clamp(cu*2,0,1),()=>ac_chip(q,C,ly-8,"direct",{size:22,deco:dc}));ac_goldRing(q,C-7,ly-37,ac_chipW(q,"direct")*22/28+14,58,cu);}
    if(o.ok!=null){q.save();q.fillStyle=rgba(mix(GV.red,GV.green,o.ok),1);q.beginPath();q.arc(X+8,y+h-26,9,0,TAU);q.fill();q.restore();
      q.save();q.fillStyle=rgba(mix(GV.red,GV.green,o.ok),0.45);q.fillRect(X+26,y+h-29,120,6);q.restore();}
    const nt=o.note||0;if(nt>0.01)withA(q,nt,()=>{const nx=x+w-178,ny=y+150;q.save();q.strokeStyle=rgba(AC_CYAN,0.8);q.setLineDash([5,5]);q.lineWidth=2.4;
        q.beginPath();q.moveTo(C+96,ly-8);q.lineTo(nx,ny+128);q.stroke();q.restore();
      if(o.halo>0)gv_halo(q,nx-30,ny-30,224,214,WC_SIDE.tech,0.9*o.halo);
      for(let i=0;i<3;i++){const cy=ny+i*54;q.fillStyle=rgba(GV.screen,1);q.fillRect(nx+3,cy+3,158,42);wc_panel(q,nx,cy,164,48,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:160+i});
        if(i===1&&o.ruleLit>0)gv_tint(q,nx+5,cy+5,154,38,GV.green,0.8*o.ruleLit);gv_lines(q,nx+(i?18:42),cy+17,i?120:96,2,14,0.9);}
      ac_star(q,nx+22,ny+20,0.62,t,1);if(o.res>0)wc_tick(q,nx+142,ny+18,26,GV.gold,o.res,5);});
    if(o.veil>0){q.save();q.fillStyle=rgba(GV.screen,0.985*clamp(o.veil,0,1));q.fillRect(x,y+44,w,h-44);q.restore();}
    if(o.dim>0){q.save();q.fillStyle=rgba([24,28,44],0.88*clamp(o.dim,0,1));q.fillRect(x,y,w,h);q.restore();}},{titleSize:22,barH:44});}

/* ---------- who would see it ---------- */
// who can open the list: a card for each, "an adviser", "an analyst", "another team", with its rows as they'd see them: a name and an
// email (soft grey bars, never words) and the new date of birth, in full, its bars outlined in red (red, 0 to 1); once it's marked,
// stars over them, as Who may see it draws them (mask, 0 to 1); dim fades it back. AC_RD: each card's title and corner
const AC_RD=[["an adviser",64,128],["another team",64,470],["an analyst",1128,64]],AC_RDS={w:420,h:290,cx:[26,124,226],bw:[70,82,150],r0:154,dy:38};
function ac_reader(ctx,i,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const [nm,x,y]=AC_RD[i],R=AC_RDS,k=0.9+0.1*spring(clamp(a,0,1));
  ctx.save();ctx.translate(x+R.w/2,y+R.h/2);ctx.scale(k,k);ctx.translate(-x-R.w/2,-y-R.h/2);withA(ctx,clamp(a*1.6,0,1)*(o.dim==null?1:o.dim),()=>{
    wc_panel(ctx,x,y,R.w,R.h,{kind:"card",seed:170+i});wc_T(ctx,nm,x+R.cx[0],y+54,{w:800,size:32,col:WC_DARK});
    const rd=clamp(o.red||0,0,1),m=clamp(o.mask||0,0,1);
    [["name",WC_MUTED],["email",WC_MUTED],["date of birth",mix(WC_MUTED,GV.redInk,rd*(1-m))]].forEach(([s,col],j)=>wc_T(ctx,s,x+R.cx[j],y+106,{w:700,size:28,col}));
    for(let r=0;r<4;r++){const ry=y+R.r0+r*R.dy;if(o.skip===r)continue;
      for(let j=0;j<3;j++){const bw=R.bw[j]-((r*13+j*29)%3)*8*(j<2?1:0),bx=x+R.cx[j];ac_bar(ctx,bx,ry,bw,1);
        if(j===2&&rd*(1-m)>0.01){ctx.save();ctx.strokeStyle=rgba(GV.red,0.9*rd*(1-m));ctx.lineWidth=2.6;rr(ctx,bx-4,ry-14,bw+8,28,14);ctx.stroke();ctx.restore();}
        if(j===2&&m>0)gv_mask(ctx,bx-6,ry-17,bw+12,34,clamp(m*1.6-r*0.15,0,1),{size:24});}}});ctx.restore();}
// a row's name, email and date of birth, gathered into the dotted outline of a person (the learner, as the list holds them): the
// bars fly in from a card's row (u, 0 to 1) and settle on the chest; the outline draws on round them. Then a second outline, hollow
// and grey, comes in beside it and takes the same shape (v, 0 to 1): someone pretending to be that learner
const AC_BUST=(()=>{const P=[[-96,0],[-96,-30]],q=(a,b,c,n)=>{for(let i=1;i<=n;i++){const u=i/n,v=1-u;P.push([v*v*a[0]+2*v*u*b[0]+u*u*c[0],v*v*a[1]+2*v*u*b[1]+u*u*c[1]]);}};
  q([-96,-30],[-96,-86],[-30,-92],14);q([-30,-92],[-22,-94],[-22,-108],4);for(let i=1;i<=40;i++){const a=(120+i*7.5)*Math.PI/180;P.push([44*Math.cos(a),-146+44*Math.sin(a)]);}
  q([22,-108],[22,-94],[30,-92],4);q([30,-92],[96,-86],[96,-30],14);P.push([96,0]);return P;})();
// the outline's points at (x,y), its feet's middle, scale s; blob (0 to 1) rounds it into a shapeless oval
function ac_bustPts(x,y,s,blob){const n=AC_BUST.length;return AC_BUST.map(([px,py],i)=>{const a=(125+i/n*360)*Math.PI/180,b=blob||0;
  return[x+lerp(px,70*Math.cos(a),b)*s,y+lerp(py,-80+80*Math.sin(a),b)*s];});}
function ac_bustLine(ctx,pts,p,col,dash,lw){if(p<=0)return;const n=Math.max(2,Math.round(pts.length*clamp(p,0,1)));ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=lw;ctx.lineCap="round";ctx.lineJoin="round";
  if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<n;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();ctx.restore();}
// the learner: copies of a row's three bars fly from a card (from: each bar's left end, middle and width) to the chest (u, 0 to 1), and
// the dotted outline draws on round them, filled pale
function ac_learner(ctx,x,y,s,u,from){if(u<=0)return;const e=easeCam(clamp(u*1.4,0,1)),d=clamp(u*1.6-0.5,0,1),P=ac_bustPts(x,y,s);
  if(d>0.01){ctx.save();const g=ctx.createLinearGradient(0,y-200*s,0,y);g.addColorStop(0,rgba([236,232,222],0.95*d));g.addColorStop(0.8,rgba([236,232,222],0.6*d));g.addColorStop(1,rgba([236,232,222],0));
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);P.forEach(q=>ctx.lineTo(q[0],q[1]));ctx.closePath();ctx.fill();ctx.restore();}
  ac_bustLine(ctx,P,d,WC_INK,[1,12],7);
  [70,90,80].forEach((bw,j)=>{const [fx,fy,fw]=from[j],tx=x-bw*s/2,ty=y+(-70+j*24)*s;ac_bar(ctx,lerp(fx,tx,e),lerp(fy,ty,e),lerp(fw,bw*s,e),clamp(u*4,0,1));});}
// the one pretending: a hollow grey outline, shapeless at first, coming in from the right and taking the learner's shape (v, 0 to 1)
function ac_pretender(ctx,x,y,s,v){if(v<=0)return;const e=easeCam(clamp(v,0,1));withA(ctx,clamp(v*2.5,0,1),()=>ac_bustLine(ctx,ac_bustPts(x+70*(1-e),y,s,1-e),1,GV.greyInk,[16,11],4.5));}

/* ---------- today: the one person who knows the rules ---------- */
// a small card in the corner, "Today": Jun's board, full of changes waiting for him, red-pinned, "waiting for Jun"; one more goes up
// (nu, 0 to 1), "Health · date of birth". It comes in, rising a little (a, 0 to 1), and fades as it goes (out, 0 to 1)
const AC_TDY={x:1164,y:84,w:700,h:430};
function ac_todayCard(ctx,t,a,nu,label,out){const o=1-clamp(out||0,0,1);if(a<=0.01||o<=0.01)return;const T_=AC_TDY,e=easeCam(clamp(a,0,1));ctx.save();ctx.globalAlpha*=o*e;ctx.translate(0,(1-e)*24);
  wc_panel(ctx,T_.x,T_.y,T_.w,T_.h,{kind:"card",seed:181});const bx=T_.x+28,by=T_.y+92,bw=T_.w-56,bh=T_.h-120;gv_cork(ctx,bx,by,bw,bh,10);
  wc_tag(ctx,T_.x+30,T_.y+48,"Today",{size:30,wash:GV.gold,washA:0.3});wc_hand(ctx,"waiting for Jun",T_.x+T_.w-30,T_.y+56,{size:32,w:700,col:GV.redInk,align:"right"});
  const C=[[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1]];C.forEach(([c,r],i)=>{if(i===5||i===6)return;const cx=bx+20+c*156,cy=by+18+r*150,rot=((i*37)%5-2)*0.012;
    ctx.save();ctx.translate(cx+66,cy+56);ctx.rotate(rot);wc_panel(ctx,-66,-52,132,104,{kind:"card",seed:190+i});gv_lines(ctx,-48,-14,96,3,22,0.9);gv_pin(ctx,0,-42,GV.red,0.9);ctx.restore();});
  if(nu>0){const u=clamp(nu,0,1),cx=bx+20+156+144,cy=by+168+56,k=1+0.12*(1-spring(u));ctx.save();ctx.translate(cx,cy-40*(1-easeCam(u)));ctx.scale(k,k);withA(ctx,clamp(u*2,0,1),()=>{
      wc_panel(ctx,-150,-50,300,100,{kind:"card",seed:199});gv_pin(ctx,0,-38,GV.red,1);wc_T(ctx,"Health",-126,-2,{w:800,size:28,col:WC_DARK});wc_T(ctx,label||"date of birth",-126,36,{w:600,size:28,col:WC_INK});});ctx.restore();}
  ctx.restore();}

/* ---------- 2 · Sent back: the call list, its sign-off sheet, Jun's board, the advisers' desk ---------- */
// the list's ten columns, in plain words, as the faculty's form names them; the form on the screen shows the first five
const AC_LCOLS=["learner code","name","email","award code","award","award name","faculty","credits needed","credits earned","credits to go"],
  AC_LFORM={title:"Add the advisers' call list",rows:AC_LCOLS.slice(0,5).map(c=>[c,null]),newFrom:0,dy:40,more:"+ 5 more columns",sent:1};
// a soft grey bar where a person's name or email would be
function ac_bar(ctx,x,y,w,a){if(a<=0.01)return;ctx.save();ctx.fillStyle=rgba(WC_MUTED,0.34*a);rr(ctx,x,y-11,w,22,11);ctx.fill();ctx.restore();}
// handwriting that can be marked as decoration (wc_hand, with deco)
function ac_hand(ctx,s,x,y,o){o=o||{};const p=o.p==null?1:o.p;if(p<=0)return;const n=Math.ceil(s.length*clamp(p,0,1));ctx.save();ctx.translate(x,y);ctx.transform(1,0,-0.2,1,0,0);
  wc_T(ctx,s.slice(0,n),0,0,{size:o.size||32,w:o.w||600,col:o.col||WCP.parchInk,align:o.align,a:o.a,deco:o.deco});ctx.restore();}
// the call list on the screen close up: seven learners come in (rows, 0 to 1), then each part as it's named: the award each studies
// for, the credits still to go, most first, and someone to call, a name and an email as grey bars; fade sets it back under the sheet
const AC_LIST=[["MPH",120],["MPH",90],["GCHI",60],["MPH",30],["GCHI",25],["GCHI",15],["GCHI",5]];
function ac_list(ctx,t,o){o=o||{};const [x,y,w,h]=AC_SC,X={award:420,cpR:860,name:1000,email:1240},hy=y+124,r0=y+200,dy=62,f=1-0.72*clamp(o.fade||0,0,1);
  gv_screen(ctx,x,y,w,h,"Call list",q=>withA(q,f,()=>{
    [["award",X.award,o.award,"left"],["credits to go",X.cpR,o.cp,"right"],["name",X.name,o.who,"left"],["email",X.email,o.who,"left"]].forEach(([s,hx,a,al])=>
      withA(q,clamp((a||0)*2,0,1),()=>wc_T(q,s,hx,hy,{w:700,size:28,col:WC_MUTED,align:al})));
    AC_LIST.forEach(([aw,cp],i)=>{const ry=r0+i*dy,ra=clamp((o.rows||0)*8-i,0,1);if(ra<=0.01)return;
      withA(q,ra,()=>{if(i%2===0){q.save();q.fillStyle=rgba([236,240,246],1);q.fillRect(x+30,ry-42,w-60,dy);q.restore();}
        withA(q,o.award||0,()=>wc_T(q,aw,X.award,ry,{w:700,size:32,col:WC_DARK}));
        withA(q,o.cp||0,()=>wc_T(q,String(cp),X.cpR,ry,{w:600,size:32,col:WC_DARK,align:"right"}));
        ac_bar(q,X.name,ry-10,150+((i*37)%5)*16,o.who||0);ac_bar(q,X.email,ry-10,230+((i*53)%7)*14,o.who||0);});});}),{titleSize:32,barH:54});}
// the list's sign-off sheet (the series' gv_signoff): sent back, its four lines empty, the question in red under each, and "sent back"
// stamped in its top margin as Who may see it stamps it (sent, 0 to 1); p, missA and askP as gv_signoff takes them. filled: the four
// lines from the drafts, and the green stamp (signed, 0 to 1). At (x,y), w wide, turned by rot about its top left
const AC_SO={title:"Change: the advisers' call list",rows:[["owner",null],["class",null],["who to ask",null],["product",null]],
  ask:{0:"who answers for this list?",1:"10 columns: does each identify a person?",2:"the faculty isn't in the register",3:"which product is it part of?"},
  filled:[["owner","Faculty of Health"],["class","all 10 columns"],["who to ask","the faculty's data desk"],["product","Learner progress, Health"]]};
function ac_sheet(ctx,x,y,w,o){o=o||{};const k=w/1000;ctx.save();ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);let r;
  if(o.filled)r=gv_signoff(ctx,0,0,w,{title:AC_SO.title,rows:AC_SO.filled,p:o.p,split:0.3,stamp:"signed",stampP:o.signed||0});
  else{r=gv_signoff(ctx,0,0,w,{title:AC_SO.title,rows:AC_SO.rows,ask:AC_SO.ask,p:o.p,missA:o.missA,askP:o.askP,split:0.3});
    if(o.sent>0){ctx.save();ctx.scale(k,k);gv_stamp(ctx,800,46,"SENT BACK",o.sent,{size:34,col:GV.redInk,rot:-0.06});ctx.restore();}}
  ctx.restore();return r;}
// the sheet as a picture (kept, so its words are a picture's): on a board or a desk, where the film has already read it
function ac_sheetPic(ctx,x,y,w,rot,filled){const H_=filled?700:800,c=wc_kept("acSheet|"+(filled?1:0),1060,H_,q=>{q.translate(30,30);
    ac_sheet(q,0,0,1000,filled?{filled:1,signed:1}:{sent:1});}),k=w/1000;
  ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.drawImage(c,-30*k,-30*k,1060*k,H_*k);ctx.restore();}
// what no check says, in gold: a question mark and the question beside it (p, 0 to 1); once it's answered, a gold tick takes the
// question mark's place (tick, 0 to 1)
function ac_goldQ(ctx,x,y,s,p,tick){if(p<=0.01)return;const u=clamp(tick||0,0,1);gv_qmark(ctx,x,y+22,64,p*(1-u));
  if(u>0)wc_tick(ctx,x+2,y-4,46,GV.gold,u,7);withA(ctx,clamp(p*2,0,1),()=>wc_tag(ctx,x+46,y,s,{size:30,wash:GV.gold,washA:0.32}));}
// a sheet of paper lying on a desk seen from the front, a thin slant of white (the sheet stamped "sent back": stamp, its red)
function ac_flatSheet(ctx,x,y,w,stamp){ctx.save();ctx.fillStyle="rgba(70,50,30,0.18)";ctx.beginPath();ctx.moveTo(x+8,y+4);ctx.lineTo(x+w+8,y+4);ctx.lineTo(x+w+26,y+40);ctx.lineTo(x-6,y+40);ctx.fill();
  ctx.fillStyle=rgba([250,248,242],1);ctx.beginPath();ctx.moveTo(x+6,y);ctx.lineTo(x+w-4,y);ctx.lineTo(x+w+14,y+34);ctx.lineTo(x-10,y+34);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=1.4;ctx.stroke();ctx.fillStyle=rgba(WC_MUTED,0.3);for(let i=0;i<3;i++)ctx.fillRect(x+20-i*4,y+8+i*8,w*0.5,3);
  if(stamp){ctx.strokeStyle=rgba(GV.redInk,0.85);ctx.lineWidth=2.4;ctx.strokeRect(x+w*0.64,y+6,w*0.26,12);}ctx.restore();}

// Jun's page of what he checks, in his own hand: its title, and lines too small to read (the rules live with him). At (x,y), w by h;
// deco marks its title as texture where it's small; lift (0 to 1) takes it off the board
function ac_junPage(ctx,x,y,w,h,o){o=o||{};const k=w/280,rot=o.rot==null?0.02:o.rot,u=easeCam(clamp(o.lift||0,0,1));if(u>=1)return;
  ctx.save();ctx.translate(x+w/2,y+h/2-160*u);ctx.rotate(rot-0.2*u);withA(ctx,1-u,()=>{ctx.drawImage(gv_sheetPaper(Math.round(w),Math.round(h)),-w/2-20,-h/2-20);ctx.translate(-w/2,-h/2);
    ac_hand(ctx,"what I check",24*k,60*k,{size:32*k,w:700,col:WC_INK,deco:o.deco});
    ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=Math.max(1.2,2.4*k);ctx.lineCap="round";const R=wc_rng(77);
    for(let i=0;i<10;i++){const ly=(104+i*30)*k;if(ly>h-26*k)break;ctx.beginPath();ctx.moveTo(26*k,ly);const n=i%3===2?5:8;
      for(let j=1;j<=n;j++)ctx.lineTo((26+j*(24+R()*6))*k,ly+(R()-0.5)*4*k);ctx.stroke();}
    gv_pin(ctx,w/2,16*k,GV.red,Math.max(0.6,k));});ctx.restore();}
// Jun's board, close (GV_BC): "waiting for Jun", in red, and the changes waiting for him, a card from each team, red-pinned as what
// nobody owns, more behind them; his page at the edge; the Faculty of Health's goes up last (nu, 0 to 1)
const AC_QUEUE=[["Finance",430,300,-0.03],["Planning",820,290,0.02],["wallet app",1210,310,-0.02],["learning",430,530,0.03]],
  AC_UNREAD=[[820,530,0.02],[430,750,-0.02],[820,760,0.03],[1210,750,-0.02]],AC_NEWQ=[1210,530,0.025],AC_JP=[1430,110,260,380];
function ac_qCard(ctx,cx,cy,rot,team,a,k){if(a<=0.01)return;ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.scale(k,k);
  withA(ctx,a,()=>{wc_panel(ctx,-180,-80,360,160,{kind:"card",seed:(cx*3+cy)|0});gv_pin(ctx,0,-66,GV.red,1);
    wc_T(ctx,"a change",-150,-6,{w:600,size:28,col:WC_MUTED});wc_T(ctx,team,-150,46,{w:800,size:32,col:WC_DARK});});ctx.restore();}
function ac_qBlank(ctx,cx,cy,rot,i){ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);wc_panel(ctx,-180,-80,360,160,{kind:"card",seed:200+i});
  gv_lines(ctx,-150,-28,290,3,30,0.8);gv_pin(ctx,0,-66,GV.red,1);ctx.restore();}
function ac_queue(ctx,t,nu){ac_junPage(ctx,...AC_JP);ac_hand(ctx,"waiting for Jun",250,150,{size:44,w:700,col:GV.redInk});
  AC_UNREAD.forEach(([cx,cy,rot],i)=>ac_qBlank(ctx,cx,cy,rot,i));AC_QUEUE.forEach(([tm,cx,cy,rot])=>ac_qCard(ctx,cx,cy,rot,tm,1,1));
  if(nu>0){const u=clamp(nu,0,1),[cx,cy,rot]=AC_NEWQ;ac_qCard(ctx,cx,cy-60*(1-easeCam(u)),rot,"Health · call list",clamp(u*2,0,1),1+0.12*(1-spring(u)));}}
// the same board, small, in the data team's room (GV_DT.board, taller than the close board, so its cards sit in the middle): the
// waiting cards (left out when empty) and Jun's page; chk pins the checklist there, a copy for the team
function ac_queueSmall(ctx,o){o=o||{};const [bx,by,bw,bh]=GV_DT.board,k=bw/GV_BC[2];ctx.save();ctx.translate(bx,by+(bh-GV_BC[3]*k)/2);ctx.scale(k,k);ctx.translate(-GV_BC[0],-GV_BC[1]);
  ac_junPage(ctx,...AC_JP,{deco:1});
  if(!o.empty){AC_UNREAD.forEach(([cx,cy,rot],i)=>ac_qBlank(ctx,cx,cy,rot,i));AC_QUEUE.forEach(([,cx,cy,rot],i)=>ac_qBlank(ctx,cx,cy,rot,10+i));
    if(o.nu)ac_qBlank(ctx,AC_NEWQ[0],AC_NEWQ[1],AC_NEWQ[2],20);}
  if(o.chk)ac_checkCopy(ctx,640,240,700,340,-0.01,true);
  ctx.restore();}
// the window's light on the faculty's desk, moving across it as the day goes on (u, 0 to 1)
function ac_dayLight(ctx,u,a){if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="soft-light";const x0=lerp(260,1180,u);ctx.globalAlpha=a;
  const g=ctx.createLinearGradient(x0-260,0,x0+260,0);g.addColorStop(0,"rgba(255,226,170,0)");g.addColorStop(0.5,"rgba(255,226,170,0.9)");g.addColorStop(1,"rgba(255,226,170,0)");
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x0-260,GV_FX.top-20);ctx.lineTo(x0+260,GV_FX.top-20);ctx.lineTo(x0+60,H);ctx.lineTo(x0-460,H);ctx.closePath();ctx.fill();ctx.restore();}

/* the advisers' desk, across the faculty's office from Anil's: the same plaster and panelling, the advisers' pinboard and a clock;
   on the desk, a phone, a headset, and a tray for the call list. An adviser sits behind it (gv_behind at AC_AD.top); the desk is the
   place's front layer, drawn over them, and the tray's front is drawn over what's in it */
const AC_AD={top:800,seat:[880,1.7],tray:[1250,1610],phone:[1010,1180],headset:[420,816]};
PEOPLE.ac_adviser={name:"",role:"student adviser",side:"Business",does:"uses",edge:BIZ,seed:43,skin:[232,190,156],hair:{style:"bob",c:[84,56,40],streak:[132,96,70]},
  top:{kind:"sweater",c:[104,108,158]},bottom:{c:[60,64,84]},shoe:[60,46,40],build:{sh:66,hip:60,h:0.96}};
// looking at the empty tray; lifting the phone to the ear: the right arm's elbow out and up, the hand at the ear
POSE.ac_wait=Object.assign({},POSE.listen,{gaze:[1,0.8],turn:0.18,tilt:0.07});
POSE.ac_pointUp=Object.assign({},POSE.point,{R:[1.9,2.3],gaze:[0.6,-0.7],tilt:-0.06});
POSE.ac_readDesk=Object.assign({},POSE.listen,{gaze:[0.7,1],look:1,tilt:0.1,turn:0.15});
POSE.ac_readUp=Object.assign({},POSE.listen,{gaze:[0.8,-0.9],tilt:-0.08,turn:0.35});
POSE.ac_readScreen=Object.assign({},POSE.listen,{gaze:[0.8,0.2],tilt:0.05,turn:0.25});
POSE.ac_call=Object.assign({},POSE.listen,{R:[1.75,4.3],gaze:[0.3,0.05],tilt:0.08,turn:0.14});
function ac_paintAdvisers(c){const wall=GV_ROOM.fac;c.fillStyle=rgba(WC_PAPER,1);c.fillRect(0,0,W,H);wc_wash(c,wc_rect(-40,-40,W+80,H+80),wall,{kind:"plaster",line:false,seed:95});
  wc_part(c,wc_rect(-40,560,W+80,H-520),[128,94,66],1,{seed:96});wc_part(c,wc_rect(-40,548,W+80,22),[150,112,80],1);
  for(let i=0;i<7;i++)wc_flat(c,wc_rect(-20+i*290+30,600,230,180),[116,84,58],1,"panel");
  // the advisers' pinboard: the week's rota and the term's dates, and two notes
  gv_cork(c,180,110,660,320,12);gv_sheet(c,210,134,250,220,{rot:-0.02});gv_lines(c,232,176,200,6,26,0.9);gv_sheet(c,492,142,190,250,{rot:0.03});gv_lines(c,512,184,140,7,26,0.9);
  gv_note(c,750,196,74,GV_NOTE[1],0.06,81);gv_note(c,760,320,74,GV_NOTE[3],-0.05,82);
  // a clock: ten past ten
  wc_wash(c,wc_ell(1440,250,70,70,40),[242,238,228],{kind:"thing",lw:1.6});c.save();c.strokeStyle=rgba(WC_INK,0.85);c.lineCap="round";
  for(let i=0;i<12;i++){const a=i/12*TAU;c.lineWidth=i%3?2:3.4;c.beginPath();c.moveTo(1440+Math.cos(a)*54,250+Math.sin(a)*54);c.lineTo(1440+Math.cos(a)*62,250+Math.sin(a)*62);c.stroke();}
  c.lineWidth=4;c.beginPath();c.moveTo(1440,250);c.lineTo(1440+Math.cos(-Math.PI/2+TAU*(10/12+10/720))*30,250+Math.sin(-Math.PI/2+TAU*(10/12+10/720))*30);c.stroke();
  c.lineWidth=3;c.beginPath();c.moveTo(1440,250);c.lineTo(1440+Math.cos(-Math.PI/2+TAU*10/60)*48,250+Math.sin(-Math.PI/2+TAU*10/60)*48);c.stroke();c.restore();
  // a shelf of box files at the right
  wc_part(c,wc_rect(1600,420,320,14),GV.woodDark,1);[[1616,[96,118,150]],[1680,[176,150,120]],[1744,[120,140,104]],[1808,[96,118,150]]].forEach(([bx,col])=>{
    wc_part(c,wc_rect(bx,290,58,130),col,1,{lw:1.1});wc_flat(c,wc_rect(bx+12,312,34,40),WC_CARD,1,"label");});}
function ac_paintAdvisersDesk(c){const top=AC_AD.top;gv_deskFront(c,top,[176,128,88],[[120,380]]);
  // the tray's back and floor (its front is ac_trayFront)
  const [t0,t1]=AC_AD.tray;wc_part(c,[[t0+14,top-74],[t1-14,top-74],[t1,top+6],[t0,top+6]],[132,140,154],1,{lw:1.2,seed:7});
  // the phone: its base, its keys, the cord
  const [p0,p1]=AC_AD.phone;wc_part(c,[[p0+16,top-46],[p1-16,top-46],[p1,top+8],[p0,top+8]],[64,68,78],1,{lw:1.3,seed:8});
  c.save();c.fillStyle=rgba([170,176,188],0.8);for(let r=0;r<3;r++)for(let k=0;k<3;k++)c.fillRect(p0+50+k*26+r*3,top-28+r*11,16,6);c.restore();
  // the headset, lying on the desk
  c.save();c.strokeStyle=rgba([50,54,64],0.9);c.lineWidth=9;c.lineCap="round";c.beginPath();c.ellipse(AC_AD.headset[0],AC_AD.headset[1],62,38,0,Math.PI*1.05,Math.PI*1.95);c.stroke();
  c.lineWidth=4;c.beginPath();c.moveTo(AC_AD.headset[0]-58,AC_AD.headset[1]+4);c.quadraticCurveTo(AC_AD.headset[0]-40,AC_AD.headset[1]+30,AC_AD.headset[0]-4,AC_AD.headset[1]+26);c.stroke();c.restore();
  for(const hx of [-60,60])wc_wash(c,wc_ell(AC_AD.headset[0]+hx,AC_AD.headset[1]+4,22,17,18),[60,64,74],{kind:"thing",lw:1.2});
  // a stack of folders at the left
  for(let i=0;i<4;i++)wc_flat(c,wc_rect(560+i*3,top-6-i*9,250,10),[[96,118,150],[176,150,120],[150,90,80],[120,140,104]][i],1,"folder");}
function ac_advisersDesk(ctx){ctx.drawImage(wc_kept("acAdvDesk",W,H,ac_paintAdvisersDesk),0,0);}
// the phone's handset: in its cradle, or lifted to the ear (drawn at the adviser's hand, along the side of her face: ac_handset)
function ac_cradle(ctx){const [p0,p1]=AC_AD.phone,top=AC_AD.top;wc_part(ctx,wc_rrPts(p0-6,top-74,p1-p0+12,30,14),[54,58,68],1,{lw:1.3,seed:9});}
function ac_handset(cx,P_,hands){const [hx,hy]=hands[1];cx.save();cx.translate(hx+10,hy+6);cx.rotate(0.22);
  cx.fillStyle=rgba([54,58,68],1);rr(cx,-12,-50,24,100,11);cx.fill();rr(cx,-17,-62,34,30,12);cx.fill();rr(cx,-17,32,34,30,12);cx.fill();
  cx.strokeStyle=rgba([90,96,110],0.8);cx.lineWidth=2;rr(cx,-17,-62,34,30,12);cx.stroke();rr(cx,-17,32,34,30,12);cx.stroke();cx.restore();
  // the hand round it
  cx.save();cx.translate(hx+2,hy+4);ell(cx,0,0,15,18);cx.fillStyle=rgba(P_.skin,1);cx.fill();cx.strokeStyle=rgba(darken(P_.skin,0.35),0.7);cx.lineWidth=2;cx.stroke();cx.restore();}
// the tray: its front with its label, "call list" (deco from across the room); full (0 to 1), the list in it, its rows grey bars
function ac_tray(ctx,full,o){o=o||{};const [t0,t1]=AC_AD.tray,top=AC_AD.top,f=clamp(full||0,0,1);
  if(f>0.01){const e=easeCam(f),py=top-10-150*e;ctx.save();ctx.beginPath();ctx.rect(t0-20,-H,t1-t0+40,top-30+H);ctx.clip();ctx.translate(t0+40,py);ctx.rotate(-0.04);
    ctx.drawImage(gv_sheetPaper(270,210),-20,-20);for(let r=0;r<5;r++){ac_bar(ctx,24,40+r*32,70+((r*37)%3)*14,1);ac_bar(ctx,130,40+r*32,100+((r*53)%4)*12,1);}ctx.restore();}
  ctx.drawImage(wc_kept("acTrayFront",W,H,c=>{wc_part(c,[[t0-10,top-40],[t1+10,top-40],[t1+16,top+16],[t0-16,top+16]],[150,158,172],1,{lw:1.3,seed:11});
    wc_flat(c,wc_rect((t0+t1)/2-100,top-30,200,38),WC_CARD,1,"label");}),0,0);
  wc_T(ctx,"call list",(t0+t1)/2,top-1,{w:700,size:28,align:"center",col:WC_DARK,deco:o.deco});}

/* ---------- 3 · Rules an agent can follow: the checklist ---------- */
// the checklist, as Yusuf and Noor write it: its title and first line, seven steps and four don'ts
const AC_CKT="How we review a change for governance",AC_CK1="You find, draft and flag. People decide.",
  AC_STEPS=["Run the checks","An owner","A glossary term, or governance confirms none","A class for every column","Each stated rule: checked, or tracked","What it touches","Report once"],
  AC_DONTS=["approve a change","edit the glossary","weaken a check","show a value from the data"];
// a sign in pencil for each step: a small sign-off sheet, a person, a book, a chip, a ticked box, a branch, a speech bubble
function ac_stepSign(ctx,i,x,y,a){if(a<=0.01)return;ctx.save();ctx.translate(x,y);ctx.globalAlpha*=a;ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
  if(i===0){ctx.rect(-10,-13,20,26);ctx.moveTo(-5,-5);ctx.lineTo(5,-5);ctx.moveTo(-5,2);ctx.lineTo(5,2);ctx.moveTo(-5,8);ctx.lineTo(1,8);}
  else if(i===1){ctx.arc(0,-7,6,0,TAU);ctx.moveTo(-11,12);ctx.quadraticCurveTo(0,-2,11,12);}
  else if(i===2){ctx.moveTo(0,-8);ctx.lineTo(-14,-11);ctx.lineTo(-14,9);ctx.lineTo(0,12);ctx.lineTo(14,9);ctx.lineTo(14,-11);ctx.lineTo(0,-8);ctx.lineTo(0,12);}
  else if(i===3){rr(ctx,-15,-8,30,16,8);ctx.moveTo(-7,0);ctx.lineTo(6,0);}
  else if(i===4){ctx.rect(-12,-12,24,24);ctx.moveTo(-6,0);ctx.lineTo(-1,6);ctx.lineTo(8,-6);}
  else if(i===5){ctx.moveTo(-13,0);ctx.lineTo(0,0);ctx.lineTo(12,-10);ctx.moveTo(0,0);ctx.lineTo(12,10);ctx.moveTo(6,-11);ctx.lineTo(12,-10);ctx.lineTo(10,-4);ctx.moveTo(6,11);ctx.lineTo(12,10);ctx.lineTo(10,4);}
  else{ctx.moveTo(-13,-10);ctx.lineTo(13,-10);ctx.lineTo(13,6);ctx.lineTo(-2,6);ctx.lineTo(-8,12);ctx.lineTo(-7,6);ctx.lineTo(-13,6);ctx.closePath();}
  ctx.stroke();ctx.restore();}
// a cross in pencil (or col), drawn as it's said (p, 0 to 1)
function ac_cross(ctx,x,y,s,p,col){if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(col||WC_PENCIL,0.9);ctx.lineWidth=4;ctx.lineCap="round";const u=clamp(p*2,0,1),v=clamp(p*2-1,0,1);
  ctx.beginPath();ctx.moveTo(x-s,y-s);ctx.lineTo(x-s+2*s*u,y-s+2*s*u);if(v>0){ctx.moveTo(x+s,y-s);ctx.lineTo(x+s-2*s*v,y-s+2*s*v);}ctx.stroke();ctx.restore();}
// the checklist, printed, on Yusuf's desk (the sheet place): its title and first line; its seven steps, each lit green, a rule that
// runs, as it's named (steps, seven, 0 to 1), with its pencil sign; its don'ts, each crossed in pencil as it's named (donts, four,
// 0 to 1); read and readA, the agent's star reading down the steps
const AC_SK={x:316,title:206,first:266,head:352,y0:420,dy:62,dx:1250};
function ac_checklist(ctx,t,o){o=o||{};const K=AC_SK;
  wc_T(ctx,AC_CKT,K.x,K.title,{w:800,size:50,col:WC_DARK});wc_T(ctx,AC_CK1,K.x,K.first,{w:600,size:34,col:WC_INK});
  wc_T(ctx,"Steps",K.x,K.head,{w:800,size:30,col:WC_MUTED});wc_T(ctx,"Don't",K.dx,K.head,{w:800,size:30,col:WC_MUTED});
  if(o.readA>0){const ry=K.y0+clamp(o.read||0,0,6)*K.dy;ac_reading(ctx,K.x+50,ry-42,840,56,o.readA);ac_star(ctx,K.x-30,ry-12,0.85,t,o.readA);}
  AC_STEPS.forEach((st,i)=>{const y=K.y0+i*K.dy,a=(o.steps||[])[i]||0;if(a>0)gv_tint(ctx,K.x+52,y-40,tw(ctx,st,32,600)+92,54,GV.green,0.75*a);
    ac_stepSign(ctx,i,K.x+20,y-11,0.35+0.65*a);wc_T(ctx,String(i+1),K.x+62,y,{w:800,size:32,col:a>0.5?WC_DARK:WC_MUTED});
    wc_T(ctx,st,K.x+100,y,{w:600,size:32,col:mix(WC_MUTED,WC_DARK,clamp(a+(o.ink||0),0,1))});});
  AC_DONTS.forEach((d,i)=>{const y=K.y0+i*K.dy;ac_cross(ctx,K.dx+16,y-11,11,(o.donts||[])[i]||0);wc_T(ctx,d,K.dx+50,y,{w:600,size:32,col:WC_INK});});}
function ac_paintSheet(c){gv_paintDesk(c);gv_sheet(c,236,90,1640,790);}
// the checklist as a picture: a copy pinned up for anyone to read, at (x,y), w by h (kept: its words are a picture's)
function ac_checkCopy(ctx,x,y,w,h,rot,lit){const c=wc_kept("acCheckCopy|"+(lit?1:0),1700,850,q=>{q.translate(30,30);gv_sheet(q,0,0,1640,790);q.translate(-236,-90);
    ac_checklist(q,0,{steps:lit?[1,1,1,1,1,1,1]:null,ink:1,donts:[1,1,1,1]});});
  ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(rot||0);ctx.drawImage(c,-w/2-30*w/1640,-h/2-30*h/790,1700*w/1640,850*h/790);ctx.restore();}
// Yusuf's office: the shelf's binders where Off the shelf put them, with a gap for each binder an earlier film took to the work
// (policies 2, 12, 6, 9, 15, 19 and 22) and for this film's, 26, once it's out; binder 26 on his desk; the framed score
const AC_BIND={w:24,h:146,gap:26.6,x:1393,cols:[[96,118,150],[150,90,80],[120,140,104],[186,160,110],[132,136,150],[110,96,130]],out:[2,6,9,12,15,19,22]};
const ac_bindCol=n=>AC_BIND.cols[Math.floor(hash(n-1,17)*AC_BIND.cols.length)];
function ac_binders(ctx,out26){const B=AC_BIND;for(let i=0;i<34;i++){const n=i+1;if(B.out.includes(n)||(n===26&&out26))continue;
  gv_binder(ctx,B.x+(i%17)*B.gap,GV_OFF.shelf.rows[i<17?1:2]-B.h,B.w,B.h,ac_bindCol(n));}}
function ac_deskBinder(ctx){gv_binder(ctx,1040,GV_OFF.desk[1]-AC_BIND.h,AC_BIND.w,AC_BIND.h,ac_bindCol(26));}
function ac_score(ctx){const [x,y,w]=GV_OFF.score,cx=x+w/2;
  wc_T(ctx,"maturity",cx,y+40,{w:600,size:24,align:"center",col:WC_MUTED,deco:1});wc_T(ctx,"2.1 / 5",cx,y+88,{w:800,size:42,align:"center",col:WC_DARK,deco:1});
  for(let i=0;i<5;i++){const bx=x+24+i*26;ctx.fillStyle=rgba(WC_MUTED,0.25);ctx.fillRect(bx,y+104,22,12);const f=clamp(2.1-i,0,1);if(f>0){ctx.fillStyle=rgba(GV.gold,0.95);ctx.fillRect(bx,y+104,22*f,12);}}}
// the office's board, small (GV_OFF.board): Anil's sheet and Jun's page side by side, and a fresh page; or, once it's written, copies
// of the checklist where Jun's page was
function ac_officeBoard(ctx,o){o=o||{};const [bx,by]=GV_OFF.board;ac_sheetPic(ctx,bx+18,by+26,150,-0.02);
  if(!o.copies){ac_junPage(ctx,bx+182,by+30,96,130,{deco:1,rot:0.03});gv_sheet(ctx,bx+292,by+28,100,150,{rot:-0.02});gv_pin(ctx,bx+342,by+36,GV.gold,0.7);}
  else for(let i=0;i<3;i++)ac_checkCopy(ctx,bx+190,by+30+i*74,180,86,0.01*(i-1));}
// the board, close (GV_BC): Anil's sheet, sent back, its four red questions (a picture: chapter 2 read them; noSheet leaves it out); Jun's page; and the
// fresh page, its title going in by hand (h, 0 to 1), then its steps as pencil lines (l, 0 to 1). copies (0 to 1): Jun's page comes off
// (lift) and copies of the printed checklist go up where his page and the draft were, tagged for who has them, the agent's star on the last
const AC_FP={x:1240,y:80,w:440,h:760},AC_CP=[[900,140],[1290,140],[1095,520]],AC_CPW=[360,174];
function ac_boardGov(ctx,t,o){o=o||{};if(!o.noSheet)ac_sheetPic(ctx,250,170,640,-0.02);
  ac_junPage(ctx,930,130,280,380,{lift:o.lift});
  if(o.fresh!=null){const F=AC_FP,h=o.fresh||0,l=o.lines||0;gv_sheet(ctx,F.x,F.y,F.w,F.h,{rot:0.012});gv_pin(ctx,F.x+F.w/2,F.y+18,GV.gold,1.4);
    [["How we review",0],["a change",1],["for governance",2]].forEach(([s,i])=>wc_hand(ctx,s,F.x+48,F.y+104+i*56,{size:44,w:700,col:WC_INK,p:clamp(h*3-i,0,1)}));
    if(l>0){ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=4;ctx.lineCap="round";for(let i=0;i<7;i++){const u=clamp(l*7-i,0,1);if(u<=0)break;const ly=F.y+330+i*62;
        ctx.beginPath();ctx.arc(F.x+64,ly,6,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(F.x+92,ly);ctx.lineTo(F.x+92+(160+((i*53)%5)*36)*u,ly+2);ctx.stroke();}ctx.restore();}}
  const cp=o.copies||[];AC_CP.forEach(([cx,cy],i)=>{const a=cp[i]||0;if(a<=0.01)return;const k=0.9+0.1*spring(a);ctx.save();ctx.translate(cx+AC_CPW[0]/2,cy+AC_CPW[1]/2);ctx.scale(k,k);
    withA(ctx,clamp(a*2,0,1),()=>{ac_checkCopy(ctx,-AC_CPW[0]/2,-AC_CPW[1]/2,AC_CPW[0],AC_CPW[1],0.012*(i-1));gv_pin(ctx,0,-AC_CPW[1]/2+10,GV.gold,1);});ctx.restore();
    const g=clamp(a*2-0.6,0,1),tx=cx+AC_CPW[0]/2,ty=cy+AC_CPW[1]+46;if(g>0.01){if(i<2)withA(ctx,g,()=>wc_tag(ctx,tx,ty,["data team","Faculty of Health"][i],{size:32,wash:i?GV.gold:WC_SIDE.tech,washA:0.3,align:"center"}));
      else ac_star(ctx,cx+AC_CPW[0]-24,cy+20,1.5,t,g);}});}
// the night again, with the checklist's step 4 on a strip of paper above the agent's note, lit green with the note's rule (a, 0 to 1)
function ac_step4(ctx,a){if(a<=0.01)return;withA(ctx,a,()=>{const x=AC_NT.x,y=AC_NT.ys[0]-98,w=AC_NT.w;gv_sheet(ctx,x,y,w,82,{rot:-0.01});
  gv_tint(ctx,x+60,y+16,tw(ctx,AC_STEPS[3],30,600)+70,50,GV.green,0.75);ac_stepSign(ctx,3,x+36,y+40,1);
  wc_T(ctx,"4",x+70,y+52,{w:800,size:30,col:WC_DARK});wc_T(ctx,AC_STEPS[3],x+102,y+52,{w:600,size:30,col:WC_DARK});});}

/* ---------- 4 · Three findings: the agent's review of Anil's change ---------- */
// the review arriving on Anil's screen, seen from the desk (over ac_formSmall): the cyan line reads down the request (read, 0 to 5;
// readA), then the review comes in beside it (a, 0 to 1), a dashed cyan card with the agent's star, "Governance review"
function ac_smallReview(ctx,t,o){o=o||{};const [x,y,w,h]=GV_FX.screen;
  if(o.read!=null&&o.readA>0){const ry=y+86+Math.min(4,o.read)*40;ac_reading(ctx,x+12,ry-30,w-24,40,o.readA);ac_star(ctx,x+28,ry-9,0.6,t,o.readA);}
  const a=o.a||0;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(16*(1-a),0);const cx=x+236,cw=w-250;ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(cx-4,y+52,cw+8,h-62);
    wc_panel(ctx,cx,y+56,cw,h-70,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:79});ac_star(ctx,cx+30,y+90,0.7,t,1);
    wc_T(ctx,"Governance review",cx+56,y+100,{w:800,size:24,col:WC_DARK,deco:o.deco});gv_lines(ctx,cx+28,y+138,cw-70,5,28,0.9);ctx.restore();});}
// the faculty's screen seen closer, filling most of the frame: the review needs the room
const AC_BIG=[110,56,1700,812];
function ac_paintScreenBig(c){c.fillStyle=rgba(WC_PAPER,1);c.fillRect(0,0,W,H);wc_wash(c,wc_rect(-40,-40,W+80,970),GV_ROOM.fac,{kind:"plaster",line:false,seed:73});
  wc_wash(c,wc_rect(-40,930,W+80,190),GV.oak,{kind:"plaster",line:false,seed:74});wc_wash(c,wc_rect(-40,924,W+80,14),wc_dim(GV.oak,0.25),{kind:"trim",line:false,flat:true});
  const [x,y,w,h]=AC_BIG;wc_part(c,[[x+w/2-50,y+h+12],[x+w/2+50,y+h+12],[x+w/2+62,936],[x+w/2-62,936]],GV.metal,1);gv_monitor(c,x,y,w,h,{stand:false});}
const AC_BIGT="Call list · Add the advisers' call list";
// a finding's number, white in a cyan disc
function ac_num(ctx,n,x,y,s){s=s||1;ctx.save();ctx.fillStyle=rgba(AC_CYAN,1);ctx.beginPath();ctx.arc(x,y,21*s,0,TAU);ctx.fill();ctx.restore();
  wc_T(ctx,String(n),x,y+10*s,{w:800,size:28*s,col:[255,255,255],align:"center"});}
// the three findings: a title, where, our rule, the draft, who decides; the first also says who'd be asked
const AC_FIND=[{title:"Nobody answers for it",where:["the list: no owner"],red:"who to ask: nobody named",rule:["every table other teams","read has an owner"],draft:"owner: Faculty of Health",who:["data governance"]},
  {title:"Ten columns with no class",where:["all 10 columns"],rule:["every column says whether","it identifies a person"],draft:"a class for each",who:["Faculty of Health"]},
  {title:"A rule with no check",where:["the list's description"],rule:["a rule about the data","has a check"],draft:"check: every row's faculty is Health",who:["Faculty of Health, for the rule","Jun, for how it's built"]}];
const AC_RV={card:[140,124,1640,742],head:184,pass:240,cx:[168,710,1252],cw:512,cy:270,ch:580};
// a small dashed cyan card inside a finding: its label, and its words as they arrive (v, 0 to 1); lit washes it (gold for who decides)
function ac_subCard(q,x,y,w,h,lab,vals,v,o){o=o||{};wc_panel(q,x,y,w,h,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:o.seed||(x+y)|0});
  if(o.lit>0.01)gv_tint(q,x+6,y+6,w-12,h-12,o.gold?GV.gold:WC_SIDE.tech,0.6*o.lit);
  wc_T(q,lab,x+18,y+36,{w:600,size:28,col:o.gold?GV.goldInk:WC_MUTED});
  vals.forEach((s,j)=>{const f=clamp(v*vals.length-j,0,1);if(f>0.01)withA(q,f,()=>wc_T(q,s,x+18,y+76+j*34+6*(1-f),{w:o.gold?700:600,size:28,col:o.gold?GV.goldInk:WC_DARK}));});}
// a draft: the agent's words in its dashed cyan pill, for a person to accept (v, 0 to 1: its words; lit, 0 to 1)
function ac_draftPill(q,x,y,w,s,v,lit,seed){wc_panel(q,x,y,w,56,{kind:"pill",dashed:true,role:WC_SIDE.tech,seed:seed||93});if(lit>0.01)gv_tint(q,x+8,y+6,w-16,44,WC_SIDE.tech,0.7*lit);
  if(s&&v>0.01)withA(q,clamp(v,0,1),()=>wc_T(q,s,x+24,y+38,{w:700,size:28,col:WC_DARK}));}
// one finding's card (i): it comes in (a); its parts as they're named (part: where, our rule, the draft, who decides, 0 to 1); its words
// as they're said (v: the same four, 0 to 1, and red, the first's who to ask); lit, the draft and who decides; dim fades it back
function ac_findCard(q,i,t,o){const F=AC_FIND[i],R=AC_RV,x=R.cx[i],y=R.cy,w=R.cw,a=(o.a||0)*(o.dim==null?1:o.dim);if(a<=0.01)return;const pt=o.part||[1,1,1,1],v=o.v||[0,0,0,0],lit=o.lit||0;
  withA(q,a,()=>{wc_panel(q,x,y,w,R.ch,{kind:"card",seed:90+i});ac_num(q,i+1,x+40,y+40);wc_T(q,F.title,x+72,y+50,{w:800,size:30,col:WC_DARK});
    const ix=x+16,iw=w-32,sub=(k,fn)=>{const p=clamp(pt[k],0,1);if(p<=0.01)return;withA(q,clamp(p*2,0,1),fn);};
    sub(0,()=>{ac_subCard(q,ix,y+72,iw,124,"where",F.where,v[0],{seed:140+i});const r=clamp(o.red||0,0,1);if(F.red&&r>0.01)withA(q,r,()=>wc_T(q,F.red,ix+18,y+72+110,{w:700,size:28,col:GV.redInk}));});
    sub(1,()=>ac_subCard(q,ix,y+204,iw,124,"our rule",F.rule,v[1],{seed:143+i}));
    sub(2,()=>{wc_T(q,"drafted",ix+4,y+364,{w:600,size:28,col:WC_MUTED});ac_draftPill(q,ix,y+376,iw,i<2?F.draft:null,v[2],lit,96+i);});
    sub(3,()=>ac_subCard(q,ix,y+442,iw,124,"who decides",i<2?F.who:[],v[3],{gold:1,lit,seed:146+i}));});}
// the agent's review, closer (AC_BIG): a dashed cyan card with the star, "Governance review", a note, not an approval; what passed (pass,
// two, 0 to 1); the three findings (find, three; part, v, red, lit, dim, per finding or shared); in finding 3's place, Anil's sheet,
// small, and its two gold questions (so, 0 to 1: finding 3 fades out under them; tick, 0 to 1)
function ac_review(ctx,t,o){o=o||{};const [x,y,w,h]=AC_BIG,R=AC_RV;gv_screen(ctx,x,y,w,h,AC_BIGT,q=>{const [cx,cy,cw,ch]=R.card;
  wc_panel(q,cx,cy,cw,ch,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:88});ac_star(q,cx+50,R.head-12,1,t,1);
  wc_T(q,"Governance review",cx+92,R.head,{w:800,size:34,col:WC_DARK});wc_T(q,"a note, not an approval",cx+92+tw(q,"Governance review",34,800)+34,R.head,{w:600,size:28,col:WC_MUTED});
  wc_T(q,"Passed",cx+40,R.pass,{w:700,size:28,col:WC_MUTED});
  [["touches nothing else",320],["no new glossary term",760]].forEach(([s,px],k)=>{const p=(o.pass||[])[k]||0;if(p<=0)return;
    wc_tick(q,px+14,R.pass-10,30,GV.green,p,6);withA(q,clamp(p*1.5,0,1),()=>wc_T(q,s,px+44,R.pass,{w:600,size:30,col:WC_DARK}));});
  const so=clamp(o.so||0,0,1);
  for(let i=0;i<3;i++)ac_findCard(q,i,t,{a:((o.find||[])[i]||0)*(i===2?1-clamp(so*1.6,0,1):1),part:o.part,v:(o.v||[])[i],red:i===0?o.red:0,lit:o.lit,dim:(o.dim||[])[i]});
  if(so>0.01){const e=easeCam(so);q.save();q.translate(260*(1-e),0);withA(q,clamp(so*2,0,1),()=>{ac_sheetPic(q,1276,R.cy+14,460,0.02);
      ac_goldQ(q,1290,R.cy+404,"right for this list?",clamp(so*1.5,0,1),o.tick);ac_goldQ(q,1290,R.cy+494,"who decides?",clamp(so*1.5-0.2,0,1),o.tick2);});q.restore();}},{titleSize:32,barH:54});}
// finding 2, opened to fill the screen: its number and title, and what its evidence is
function ac_f2Panel(q){wc_panel(q,140,124,1640,742,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:91});ac_num(q,2,194,186);wc_T(q,"Ten columns with no class",228,196,{w:800,size:34,col:WC_DARK});
  wc_T(q,"counts, never values",1740,196,{w:600,size:30,col:WC_MUTED,align:"right"});}
// finding 2, close: the email column as the agent sees it, as grey bars; it reads each row (read, 0 to 7) and ticks it; then what the
// counts say (says, 0 to 4: the rows, how many are different, how many look like an email, and the class it drafts)
const AC_TL={bars:[300,340,280,360,320,300,340],y0:350,dy:62,rx:860,ry:[380,456,532,652]};
function ac_tally(ctx,t,o){o=o||{};const [x,y,w,h]=AC_BIG,T_=AC_TL;gv_screen(ctx,x,y,w,h,AC_BIGT,q=>{ac_f2Panel(q);
  wc_T(q,"email",200,288,{w:700,size:30,col:WC_MUTED});
  const n=o.read||0;T_.bars.forEach((bw,i)=>{const by=T_.y0+i*T_.dy;ac_bar(q,200,by,bw,1);wc_tick(q,610,by-2,26,AC_CYAN,clamp(n-i,0,1),5);});
  if(o.readA>0&&n<7){const by=T_.y0+Math.min(6,Math.floor(n))*T_.dy;ac_reading(q,190,by-26,400,52,o.readA);ac_star(q,184,by,0.8,t,o.readA);}
  q.save();q.strokeStyle=rgba(WC_PENCIL,0.25);q.lineWidth=1.5;q.beginPath();q.moveTo(760,270);q.lineTo(760,800);q.stroke();q.restore();
  const s=o.says||0;[["7 rows",0],["6 different",1],["7 look like an email",2]].forEach(([l,k])=>{const a=clamp(s-k,0,1);if(a>0.01)withA(q,a,()=>wc_T(q,l,T_.rx,T_.ry[k]+8*(1-a),{w:700,size:40,col:WC_DARK}));});
  const d=clamp(s-3,0,1);if(d>0.01)withA(q,d,()=>{wc_T(q,"drafted class",T_.rx,T_.ry[3]-64,{w:600,size:28,col:WC_MUTED});ac_drafted(q,T_.rx,T_.ry[3]-12,"direct");});},
  {titleSize:32,barH:54});}
// finding 3, close: "no check could find this"; where: the list's description, as the faculty wrote it, read by the agent, its rule
// underlined in cyan (read, 0 to 1; readA); our rule; the drafted check (draft, 0 to 1), and what it finds today, in green (pass, 0 to
// 1); who decides, the faculty for the rule and Jun for how it's built
const AC_DESC=["For the advisers: each learner on an award,","how far they are from finishing, and who to call.","Only the faculty's own awards."];
function ac_f3(ctx,t,o){o=o||{};const [x,y,w,h]=AC_BIG;gv_screen(ctx,x,y,w,h,AC_BIGT,q=>{
  wc_panel(q,140,124,1640,742,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:89});ac_num(q,3,194,186);wc_T(q,"A rule with no check",228,196,{w:800,size:34,col:WC_DARK});
  const tg=clamp(o.tag||0,0,1);if(tg>0.01){const k=0.9+0.1*spring(tg);q.save();q.translate(1740,186);q.scale(k,k);withA(q,clamp(tg*2,0,1),()=>wc_tag(q,0,0,"no check could find this",{size:30,wash:WC_SIDE.tech,washA:0.32,align:"right"}));q.restore();}
  // where: the description, on its own paper
  ac_subCard(q,180,250,800,92,"where",[],0,{seed:151});wc_T(q,"the list's description",310,286,{w:600,size:30,col:WC_DARK});
  wc_panel(q,180,360,800,250,{kind:"card",seed:152});
  AC_DESC.forEach((s,i)=>{const ly=430+i*58;wc_T(q,s,212,ly,{w:600,size:30,col:WC_INK});
    if(i===2){const lw=tw(q,s,30,600),u=easeCam(clamp(o.read||0,0,1));if(o.readA>0){ac_reading(q,202,ly-36,(lw+20)*u,48,o.readA);ac_star(q,202+(lw+20)*u,ly-12,0.8,t,o.readA);}
      q.save();q.strokeStyle=rgba(AC_CYAN,0.9);q.lineWidth=4;q.lineCap="round";q.beginPath();q.moveTo(212,ly+12);q.lineTo(212+lw*u,ly+12);q.stroke();q.restore();}});
  // our rule; the draft, and what it finds; who decides
  ac_subCard(q,1020,250,720,124,"our rule",["a rule about the data has a check"],1,{seed:153});
  const dr=clamp(o.draft||0,0,1);wc_T(q,"drafted",1024,420,{w:600,size:28,col:WC_MUTED});
  withA(q,0.35+0.65*dr,()=>ac_draftPill(q,1020,436,720,AC_FIND[2].draft,dr,0,97));
  const ps=clamp(o.pass||0,0,1);if(ps>0.01){wc_tick(q,1048,540,34,GV.green,ps,6);withA(q,clamp(ps*1.5,0,1),()=>wc_T(q,"passes: 7 of 7",1084,552,{w:700,size:32,col:GV.greenInk}));}
  ac_subCard(q,1020,600,720,158,"who decides",AC_FIND[2].who,clamp(o.who||0,0,1),{gold:1,seed:154});},{titleSize:32,barH:54});}

/* ---------- 5 · People decide: what the agent wasn't sure of, Anil's answer, the owners' approvals ---------- */
// the drafted classes, each the series' chip, and their evidence; two are marked "not sure" (unsure, 0 to 1); once Anil has answered
// (from okAt), their rows are washed gold, a person's decision: award code's chip turns to none, name's stays direct; his reason takes
// the place of award code's counts (why)
const AC_CLS=[["email","direct","7 rows · 6 different · 7 look like an email"],["name","direct","7 rows · 7 different",1],
  ["learner code","pseudonymous","7 look like a long code"],["award code","pseudonymous","7 look like a long code",1],
  ...AC_LCOLS.slice(4).map(c=>[c,"none","no email, student number or long code"])];
function ac_notSure(q,x,y,a){if(a<=0.01)return;withA(q,a,()=>{wc_panel(q,x,y-34,140,46,{kind:"pill",seed:97});wc_T(q,"not sure",x+70,y-2,{w:700,size:28,col:WC_INK,align:"center"});});}
function ac_classes(ctx,t,o){o=o||{};const [x,y,w,h]=AC_BIG,ok=o.okAt==null?0:clamp((t-o.okAt)/0.8,0,1),un=clamp(o.unsure||0,0,1);gv_screen(ctx,x,y,w,h,AC_BIGT,q=>{ac_f2Panel(q);
  [["column",200],["drafted class",520],["evidence",1010]].forEach(([s,hx])=>wc_T(q,s,hx,270,{w:700,size:28,col:WC_MUTED}));
  AC_CLS.forEach(([c,k,ev,ns],i)=>{const ry=326+i*53,ak=c==="award code";
    if(ns){gv_tint(q,180,ry-38,1580,52,WC_SIDE.tech,0.55*un*(1-ok));gv_tint(q,180,ry-38,1580,52,GV.gold,0.6*ok);}
    wc_T(q,c,200,ry,{w:600,size:28,col:WC_DARK});
    if(ak){withA(q,1-ok,()=>gv_classChip(q,520,ry-10,k));if(ok>0)gv_classChipAt(q,t,o.okAt,520,ry-10,"none");}
    else gv_classChip(q,520,ry-10,k);
    if(ns)ac_notSure(q,520+ac_chipW(q,k)+22,ry,un*(1-ok));
    if(ak){const wy=clamp(o.why==null?ok:o.why,0,1);withA(q,1-wy,()=>wc_T(q,ev,1010,ry,{w:600,size:28,col:WC_INK}));
      withA(q,wy,()=>wc_T(q,"a course, not a person (Anil Kurian)",1010,ry,{w:600,size:28,col:GV.goldInk}));}
    else wc_T(q,ev,1010,ry,{w:600,size:28,col:k==="none"?WC_MUTED:WC_INK});});},{titleSize:32,barH:54});}
// the two long codes side by side, as the agent sees them: grey bars of one length, whose marks stand for their values, so rows with
// one value look alike (lp, ap: the marks, 0 to 1); their counts, line by line (lc, ac, 0 to 1; the learner code's ends with a sign of
// a person); "looks like a long code" under both (tag); the award code's description (desc) and a grey question mark (q); then (s, 0 to
// 1) the learner code goes and the award code moves left, and on the right come the checklist's step 4 (step), the class it drafts,
// not sure (draft), and its question (ask)
const AC_KEYS={y0:330,dy:46,bw:400,award:[2,2,1,2,1,1,1]};
function ac_codeBar(q,x,y,w,seed,p){ac_bar(q,x,y,w,1);if(p<=0.01)return;q.save();q.fillStyle=rgba(WC_DARK,0.4*p);
  for(let k=0,px=x+16;px<x+w-30;k++){const sw=6+18*hash(seed*31+k,5);q.fillRect(px,y-4,sw,8);px+=sw+6+12*hash(seed*17+k,9);}q.restore();}
function ac_codeCol(q,x,name,seeds,p,cnt,lines,tag){const K=AC_KEYS;wc_T(q,name,x,276,{w:700,size:30,col:WC_MUTED});
  seeds.forEach((sd,i)=>ac_codeBar(q,x,K.y0+i*K.dy,K.bw,sd,p));
  lines.forEach((l,j)=>{const a=clamp((cnt-j*0.3)/0.4,0,1);if(a>0.01)withA(q,a,()=>wc_T(q,l,x+K.bw+40,372+j*56+6*(1-a),{w:700,size:34,col:WC_DARK}));});
  if(tag>0.01)withA(q,tag,()=>wc_tag(q,x+K.bw/2,666,"looks like a long code",{size:28,wash:WC_SIDE.tech,washA:0.3,align:"center"}));}
function ac_keys(ctx,t,o){o=o||{};const [x,y,w,h]=AC_BIG,s=easeCam(clamp(o.s||0,0,1));gv_screen(ctx,x,y,w,h,AC_BIGT,q=>{ac_f2Panel(q);
  withA(q,1-s,()=>{ac_codeCol(q,210,"learner code",[11,12,13,14,15,16,17],o.lp||0,o.lc||0,["7 rows","7 different"],o.tag||0);
    const pa=clamp(((o.lc||0)-0.6)/0.4,0,1);if(pa>0.01){q.save();q.translate(700,500);q.scale(2.2,2.2);ac_stepSign(q,1,0,0,pa);q.restore();}});
  q.save();q.translate(-780*s,0);ac_codeCol(q,990,"award code",AC_KEYS.award,o.ap||0,o.ac||0,["7 rows","2 different"],o.tag||0);
  if(o.q>0){const k=spring(clamp(o.q,0,1));q.save();q.translate(1690,520);q.scale(k,k);withA(q,clamp(o.q*2,0,1),()=>wc_T(q,"?",0,0,{w:800,size:72,align:"center",col:GV.greyInk}));q.restore();}
  if(o.desc>0.01)withA(q,o.desc,()=>{wc_T(q,"“A long code for the award,",990,744,{w:600,size:30,col:WC_INK});wc_T(q,"made from its short name.”",1004,786,{w:600,size:30,col:WC_INK});});q.restore();
  const st=o.step||0;if(st>0.01)withA(q,clamp(st*1.5,0,1),()=>{gv_sheet(q,1000,268,740,176,{rot:-0.008});ac_stepSign(q,3,1040,318,1);
    wc_T(q,"4   "+AC_STEPS[3],1074,330,{w:700,size:32,col:WC_DARK});gv_tint(q,1030,364,tw(q,"when in doubt, draft the stricter class, and ask",30,600)+20,50,GV.green,0.75*clamp(st*2-1,0,1));
    wc_T(q,"when in doubt, draft the stricter class, and ask",1040,400,{w:600,size:30,col:WC_DARK});});
  const dr=o.draft||0;if(dr>0.01)withA(q,dr,()=>{wc_T(q,"drafted class",1000,508,{w:600,size:28,col:WC_MUTED});
    ac_notSure(q,1000+ac_drafted(q,1000,556,"pseudonymous")+18,568,1);});
  ac_card(q,1000,626,740,150,t,["If it's made from the award, it","identifies no one: please confirm."],{a:o.ask||0,size:30,y0:60,gap:14,head:false});},{titleSize:32,barH:54});}
// the agent's question and Anil's answer on his screen, seen from the desk: the answer is typed (typed, 0 to 1), in gold
function ac_smallReply(ctx,t,o){o=o||{};const [x,y,w,h]=GV_FX.screen;gv_screen(ctx,x,y,w,h,null,q=>{wc_T(q,AC_LFORM.title,x+18,y+32,{w:700,size:22,col:[255,255,255]});
  wc_panel(q,x+20,y+58,w-40,124,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:79});ac_star(q,x+50,y+88,0.7,t,1);
  wc_T(q,"If it's made from the award, it",x+78,y+100,{w:600,size:24,col:WC_INK});wc_T(q,"identifies no one: please confirm.",x+78,y+134,{w:600,size:24,col:WC_INK});
  const a=o.a||0;if(a<=0.01)return;withA(q,a,()=>{wc_panel(q,x+20,y+194,w-40,124,{kind:"card",wash:GV.gold,washA:0.3,seed:81});
    wc_T(q,"Anil Kurian",x+44,y+228,{w:700,size:24,col:WC_MUTED});const L=["It's made from the award:","a course, not a person."],n=Math.round(clamp(o.typed||0,0,1)*(L[0].length+L[1].length));
    wc_T(q,L[0].slice(0,n),x+44,y+262,{w:600,size:24,col:GV.goldInk});if(n>L[0].length)wc_T(q,L[1].slice(0,n-L[0].length),x+44,y+294,{w:600,size:24,col:GV.goldInk});});},{titleSize:26,barH:44});}
// the owners' approvals, each a gold card that takes its stamp as it's named (a, 0 to 1): the faculty, its classes and its rule; Yusuf,
// the new owner; Jun, how it's built
const AC_AP=[["Faculty of Health","its classes and its rule"],["Yusuf Demir","the new owner"],["Jun Park","how it's built"]];
function ac_approval(ctx,x,y,w,h,i,a){if(a<=0.01)return;const [nm,what]=AC_AP[i];withA(ctx,clamp(a*2,0,1),()=>{wc_panel(ctx,x,y,w,h,{kind:"card",wash:GV.gold,washA:0.3,seed:70+i});
  wc_T(ctx,nm,x+30,y+58,{w:800,size:32,col:WC_DARK});wc_T(ctx,what,x+30,y+102,{w:600,size:28,col:WC_INK});});
  gv_stamp(ctx,x+w-121,y+h/2+6,"APPROVED",clamp(a*2-1,0,1),{size:28,col:GV.goldInk,rot:-0.07});}
// the sign-off sheet on Yusuf's desk, its four lines filled from the drafts (p, 0 to 1), and beside it the approvals (ap, three); then
// the sheet's own stamp, signed (signed, 0 to 1)
function ac_signed(ctx,t,o){o=o||{};ac_sheet(ctx,130,240,1000,{filled:1,p:o.p==null?1:o.p,signed:o.signed||0});
  if((o.ap||[]).some(a=>a>0))wc_T(ctx,"Approvals",1190,222,{w:700,size:30,col:WC_MUTED});
  AC_AP.forEach((_,i)=>ac_approval(ctx,1180,250+i*170,640,150,i,(o.ap||[])[i]||0));}
// who decided what: the agent's three findings, small, across the top (dim fades them back), and the approvals under them, each
// a gold card; a gold thread runs from each finding to whoever decided it (th, 0 to 1)
const AC_TH={fy:270,fh:96,ay:590,ah:150,xs:[89,677,1265],w:566,ord:[1,0,2],links:[[0,0],[1,1],[2,1],[2,2]]};
function ac_decided(ctx,t,o){o=o||{};const T_=AC_TH,dm=1-0.55*clamp(o.dim||0,0,1);
  withA(ctx,dm,()=>AC_FIND.forEach((F,i)=>{const fx=T_.xs[i];ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(fx+4,T_.fy+4,T_.w-8,T_.fh-8);
    wc_panel(ctx,fx,T_.fy,T_.w,T_.fh,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:95+i});ac_num(ctx,i+1,fx+44,T_.fy+T_.fh/2);wc_T(ctx,F.title,fx+78,T_.fy+T_.fh/2+10,{w:800,size:30,col:WC_DARK});}));
  T_.ord.forEach((ai,j)=>ac_approval(ctx,T_.xs[j],T_.ay,T_.w,T_.ah,ai,1));
  const th=clamp(o.th||0,0,1);if(th>0.01){ctx.save();ctx.strokeStyle=rgba(GV.gold,1);ctx.fillStyle=rgba(GV.gold,1);ctx.lineWidth=5;ctx.lineCap="round";
    T_.links.forEach(([fi,aj],k)=>{const x0=T_.xs[fi]+T_.w/2+(fi===2&&aj===1?-80:0),y0=T_.fy+T_.fh+8,x1=T_.xs[aj]+T_.w/2+(fi===2&&aj===1?80:0),y1=T_.ay-8,u=clamp(th*1.6-k*0.2,0,1);if(u<=0)return;
      const P_=v=>{const a=1-v;return[a*a*a*x0+3*a*a*v*x0+3*a*v*v*x1+v*v*v*x1,a*a*a*y0+3*a*a*v*(y0+90)+3*a*v*v*(y1-90)+v*v*v*y1];};
      ctx.beginPath();ctx.arc(x0,y0,6,0,TAU);ctx.fill();ctx.beginPath();for(let s=0;s<=40*u;s++)ctx.lineTo(...P_(s/40));ctx.stroke();
      if(u>=1){ctx.beginPath();ctx.arc(x1,y1,6,0,TAU);ctx.fill();}});ctx.restore();}}

/* ---------- 6 · Governed, too ---------- */
// binder 26, open on Yusuf's desk, from above, as Off the shelf drew binder 12: the cover open flat round the pages, the rings down the
// middle, the back of the page before on the left, policy 26 on the right; a green highlighter; and room beside it for the rules for
// AI helpers, printed (AC_AG). Clear of his mug, his keyboard and his pencil.
const AC_OPEN={x:250,y:70,w:1060,h:830,mid:780,pw:460,rings:[250,485,720]},AC_AG={x:1366,y:118,w:500,h:740,rot:0.02};
// a highlighter lying on the desk, from above, and its stroke behind a line of text, drawn from the left as p goes from 0 to 1 (Off the shelf's)
function ac_marker(c,x,y,rot,col){c.save();c.translate(x,y);c.rotate(rot);c.drawImage(wc_kept("acMarker|"+col,300,100,q=>{
    q.save();q.filter="blur(5px)";q.fillStyle="rgba(70,50,30,0.26)";q.fillRect(30,46,236,30);q.restore();
    wc_wash(q,wc_rrPts(26,30,196,42,14),mix(col,[255,255,255],0.6),{kind:"thing",lw:1.3,seed:col[0]});
    wc_wash(q,wc_rrPts(204,27,70,48,12),col,{kind:"thing",lw:1.3,seed:col[1]});wc_wash(q,[[28,40],[8,46],[8,56],[28,62]],wc_dim(col,0.1),{kind:"thing",lw:1.1,seed:col[2]});}),-150,-50);
  c.restore();}
function ac_hiStroke(ctx,x,y,w,col,p,seed,h){if(p<=0)return;h=h||58;const c=wc_kept("acHi|"+col+"|"+seed,1200,70,q=>wc_wash(q,wc_resample(wc_rect(8,10,1180,48),12),col,{kind:"swatch",line:false,a:0.5,seed}));
  const top=y-12-h/2;ctx.save();ctx.beginPath();ctx.rect(x-12,top-6,(w+24)*clamp(p,0,1),h+12);ctx.clip();ctx.globalCompositeOperation="multiply";ctx.drawImage(c,x-12,top,w+24,h);ctx.restore();}
function ac_paintDesk26(c){gv_paintDesk(c);const B=AC_OPEN,top=B.y+26,ph=B.h-52,L=B.mid-46-B.pw,R=B.mid+46,col=ac_bindCol(26);
  c.save();c.filter="blur(16px)";c.fillStyle="rgba(70,50,30,0.32)";c.fillRect(B.x+16,B.y+24,B.w,B.h);c.restore();
  wc_wash(c,wc_rrPts(B.x,B.y,B.w,B.h,18),col,{kind:"cover",lw:1.6,seed:26});wc_flat(c,wc_rect(B.mid-40,B.y+8,80,B.h-16),wc_dim(col,0.22),1,"spine");
  for(const px of [L,R]){const s=px<B.mid?-1:1;for(let k=3;k>=1;k--)wc_flat(c,wc_rect(px+s*k*3,top+k*3,B.pw,ph),wc_dim(GV.paper,0.05*k),1,"pages");
    wc_wash(c,wc_rect(px,top,B.pw,ph),GV.paper,{kind:"page",lw:1.3,seed:px|0});
    for(const ry of B.rings)wc_wash(c,wc_ell(B.mid+s*80,ry,11,11,16),wc_dim(col,0.1),{kind:"thing",line:false,flat:true});}
  gv_lines(c,L+60,top+110,B.pw-150,13,50,0.3);
  wc_wash(c,wc_rrPts(B.mid-26,B.rings[0]-60,52,B.rings[2]-B.rings[0]+120,14),GV.metal,{kind:"thing",lw:1.4,seed:13});
  for(const ry of B.rings){c.save();c.strokeStyle=rgba(wc_dim(GV.metal,0.28),1);c.lineWidth=10;c.beginPath();c.ellipse(B.mid,ry,80,17,0,0,TAU);c.stroke();
    c.strokeStyle="rgba(255,255,255,0.65)";c.lineWidth=3;c.beginPath();c.ellipse(B.mid,ry-3,76,13,0,Math.PI*1.15,Math.PI*1.85);c.stroke();c.restore();}
  ac_marker(c,1250,962,-0.3,GV.green);}
// policy 26's page: its line, a green stroke behind it as it goes green (hi), and where it runs, in Yusuf's hand, green (hw, three, 0 to 1)
const AC_P26={x:AC_OPEN.mid+46+64,top:AC_OPEN.y+26,size:38,lh:52,lines:["AI use follows the","organisation's data","policies."],
  note:["the agent's access","its checklist","owners' approvals"]};
function ac_open26(ctx,t,o){o=o||{};const P=AC_P26,x=P.x,top=P.top,n=P.lines.length,u=o.hi||0;
  wc_T(ctx,"Data policies",x,top+64,{w:600,size:28,col:WC_MUTED,deco:1});wc_T(ctx,"Policy 26",x,top+150,{w:800,size:56,col:WC_DARK});
  wc_T(ctx,"AI and automated tools",x,top+200,{w:600,size:32,col:WC_MUTED});
  P.lines.forEach((s,i)=>{const y=top+290+i*P.lh;ac_hiStroke(ctx,x,y,tw(ctx,s,P.size,600),GV.green,clamp(u*n-i,0,1),60+i);wc_T(ctx,s,x,y,{w:600,size:P.size,col:WC_INK});});
  P.note.forEach((s,i)=>wc_hand(ctx,s,x,top+484+i*58,{size:36,w:700,col:GV.greenInk,p:(o.hw||[])[i]||0}));}
// the rules for AI helpers, printed: its title, and its three headings over typed lines. It's laid on the desk from the right (land, 0
// to 1), and the agent's star comes onto it (star)
function ac_rulesPage(ctx,t,o){o=o||{};const A=AC_AG,u=o.land==null?1:o.land;if(u<=0)return;const k=1-Math.pow(1-u,3);ctx.save();
  ctx.translate(A.x+A.w/2+(1-k)*720,A.y+A.h/2);ctx.rotate(A.rot+(1-k)*0.06);ctx.drawImage(gv_sheetPaper(A.w,A.h),-A.w/2-20,-A.h/2-20);ctx.translate(-A.w/2,-A.h/2);
  ["Rules for","AI helpers"].forEach((s,i)=>wc_T(ctx,s,44,104+i*54,{w:800,size:44,col:WC_DARK}));
  [["What a helper may do",3],["Its access",3],["What it must not do",4]].forEach(([s,n],i)=>{const y=270+i*150;wc_T(ctx,s,44,y,{w:700,size:30,col:WC_INK});gv_lines(ctx,44,y+30,A.w-110,n,26,0.9);});
  ac_star(ctx,A.w-80,92,1.4,t,o.star||0);ctx.restore();}
// the platform team's desk, close: its front, drawn over Sam; on his screens, his own work (lines); the agent's access request, on paper,
// on the desk in front of him (a, 0 to 1)
function ac_platDesk(ctx){ctx.drawImage(wc_kept("acPlatDesk",W,H,gv_paintPlatformDesk),0,0);}
function ac_platScreens(ctx){GV_PX.screens.forEach(([x,y,w,h],i)=>gv_screen(ctx,x,y,w,h,null,q=>gv_lines(q,x+30,y+70,w-80,7-i,30,0.9)));}
// the agent's access request, close, on Sam's desk (the form place): who it's for and why; what it may read and write, and how it works
// with the data, each ticked in cyan (it may) or crossed (it may not) as it's said (rows, six, 0 to 1); its review; and Sam's answer, in
// gold (ans, 0 to 1)
const AC_ACC=[["reads: the tables other teams read",1],["writes: its own workspace",1],["writes: live tables",0],["counts and small samples",1],["personal data in bulk",0],["the glossary: read only",1]],
  AC_AF={x:380,title:160,lines:[220,268,316],rule:350,r0:414,dy:58,rev:780,ans:840};
function ac_paintForm(c){gv_paintDesk(c);gv_sheet(c,300,64,1180,860);}
function ac_accessForm(ctx,t,o){o=o||{};const F=AC_AF,r=o.rows||[];
  wc_T(ctx,"Access request",F.x,F.title,{w:800,size:46,col:WC_DARK});ac_star(ctx,1400,F.title-16,1.2,t,1);
  [["for: the review agent",1],["its own identity, never a person's",o.id],["purpose: review changes for governance",1]].forEach(([s,a],i)=>withA(ctx,a==null?1:clamp(a,0,1),()=>wc_T(ctx,s,F.x,F.lines[i],{w:i===1?700:600,size:32,col:WC_INK})));
  ctx.save();ctx.strokeStyle=rgba(WC_MUTED,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(F.x,F.rule);ctx.lineTo(1420,F.rule);ctx.stroke();ctx.restore();
  AC_ACC.forEach(([s,ok],i)=>{const y=F.r0+i*F.dy,a=r[i]||0,m=clamp(a*2-0.6,0,1);wc_T(ctx,s,F.x+56,y,{w:600,size:32,col:mix(WC_MUTED,WC_INK,clamp(a*2,0,1))});
    if(ok)wc_tick(ctx,F.x+16,y-12,34,AC_CYAN,m,6);else ac_cross(ctx,F.x+16,y-12,12,m,WC_INK);});
  withA(ctx,clamp(o.rev||0,0,1),()=>wc_T(ctx,"reviewed: with everyone's access",F.x,F.rev,{w:600,size:30,col:WC_MUTED}));
  wc_hand(ctx,"Yes, as the rules for AI helpers say.  Sam Okafor",F.x,F.ans,{size:34,w:700,col:GV.goldInk,p:o.ans||0});}
// the agent's access request, small, lying on Sam's desk in front of him
function ac_formOnDesk(ctx,a){if(a<=0.01)return;withA(ctx,a,()=>ac_flatSheet(ctx,1150,GV_PX.top+6,300,false));}
// who signs off what: a page of the register of owners and stewards; the call list's two lines in fresh ink. own (0 to 1) lights the
// names gold; focus keeps one line bright while the rest fade back (dim, 0 to 1), and hi washes it gold (hiA)
const AC_WHO=[["anything nobody else owns","Jun Park"],[{t:"the call list: what it means",hand:1},{t:"Faculty of Health, with Noor",hand:1}],
  [{t:"the call list: how it's built",hand:1},{t:"Faculty of Health, with Jun",hand:1}],["the register of owners","data governance, with Noor"],["the review checklist","data governance, with Noor"]],
  AC_WX={x:200,y:240,w:1000};
function ac_whoPage(ctx,t,o){o=o||{};const X=AC_WX,r=gv_register(ctx,X.x,X.y,X.w,{kicker:"Register of owners and stewards",title:"Who signs off what",
    cols:[["what",0.5],["signs off",0.5]],rows:AC_WHO,hi:o.focus,hiA:o.hiA});
  const own=clamp(o.own||0,0,1);if(own>0.01)r.rows.forEach((ry,i)=>{if(o.focus!=null&&i!==o.focus)return;gv_tint(ctx,r.cols[1]+6,ry-26,X.x+952-r.cols[1]-6,52,GV.gold,0.75*clamp(own*3-i*0.4,0,1));});
  if(o.dim>0.01){ctx.save();ctx.fillStyle=rgba(GV.paper,0.62*clamp(o.dim,0,1));r.rows.forEach((ry,i)=>{if(i!==o.focus)ctx.fillRect(X.x+40,ry-30,920,60);});ctx.restore();}
  return r;}
// the agent's card beside the register: its star, "the agent", and its approve, crossed: it owns nothing (ag, 0 to 1; x, the cross)
function ac_agentCard(ctx,t,x,y,ag,cr){if(ag<=0.01)return;withA(ctx,ag,()=>{ctx.save();ctx.translate(0,14*(1-ag));ctx.fillStyle=rgba(GV.screen,1);ctx.fillRect(x+4,y+4,552,182);
  wc_panel(ctx,x,y,560,190,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:86});ac_star(ctx,x+56,y+70,1.3,t,1);wc_T(ctx,"the agent",x+104,y+82,{w:800,size:34,col:WC_DARK});
  wc_panel(ctx,x+104,y+108,220,58,{kind:"pill",wash:WC_MUTED,washA:0.2,seed:87});wc_T(ctx,"approve",x+214,y+148,{w:700,size:30,col:WC_MUTED,align:"center"});
  ac_cross(ctx,x+214,y+137,22,cr||0,WC_INK);ctx.restore();});}
// the register's page as a picture (kept: the film has read it), at (x,y), w wide, turned by rot about its top left
function ac_whoPic(ctx,x,y,w,rot){const c=wc_kept("acWhoPic",1060,690,q=>{q.translate(30,30);gv_register(q,0,0,1000,{kicker:"Register of owners and stewards",title:"Who signs off what",
    cols:[["what",0.5],["signs off",0.5]],rows:AC_WHO});}),k=w/1000;ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.drawImage(c,-30*k,-30*k,1060*k,690*k);ctx.restore();}

/* ---------- 7 · Only what's written ---------- */
// Yusuf's desk, from above: binder 12, closed, as Off the shelf left it, his two notes sticking out of it as flags; beside it, the
// checklist, printed (AC_SS)
const AC_STICK=[250,214,208],AC_SS={x:960,y:104,w:860,h:772};
function ac_paintDesk12(c){gv_paintDesk(c);const col=ac_bindCol(12),x=300,y=170,w=560,h=740;
  c.save();c.filter="blur(14px)";c.fillStyle="rgba(70,50,30,0.3)";c.fillRect(x+14,y+20,w,h);c.restore();
  for(const [fy,r] of [[330,-0.06],[520,0.05]]){c.save();c.translate(x+w+20,fy);c.rotate(r);wc_wash(c,wc_rect(-70,-28,110,56),AC_STICK,{kind:"page",lw:1.1,seed:fy});c.restore();}
  wc_flat(c,wc_rect(x+16,y+h-6,w-20,16),wc_dim(GV.paper,0.08),1,"pages");wc_flat(c,wc_rect(x+w-6,y+16,16,h-20),wc_dim(GV.paper,0.08),1,"pages");
  wc_wash(c,wc_rrPts(x,y,w,h,16),col,{kind:"cover",lw:1.6,seed:21});wc_flat(c,wc_rect(x,y+8,54,h-16),wc_dim(col,0.2),1,"spine");
  wc_wash(c,wc_rect(x+150,y+170,300,190),WC_CARD,{kind:"page",lw:1.3,seed:22});const S_=AC_SS;gv_sheet(c,S_.x,S_.y,S_.w,S_.h);}
function ac_closed12(ctx){wc_T(ctx,"12",600,435,{w:800,size:84,align:"center",col:WC_DARK});wc_T(ctx,"Data definitions",600,500,{w:600,size:30,align:"center",col:WC_MUTED});}
// the checklist on the desk beside binder 12: its title and first line, and its steps; the agent's star reading down them (read: the
// row, fractional; readA)
function ac_checkSheet(ctx,t,o){o=o||{};const S_=AC_SS,x0=S_.x+40,y0=S_.y+356;
  ["How we review a change","for governance"].forEach((s_,i)=>wc_T(ctx,s_,x0,S_.y+90+i*52,{w:800,size:44,col:WC_DARK}));
  wc_T(ctx,AC_CK1,x0,S_.y+200,{w:600,size:30,col:WC_INK});wc_T(ctx,"Steps",x0,S_.y+290,{w:800,size:28,col:WC_MUTED});
  if(o.readA>0){const ry=y0+Math.min(6,o.read)*56;ac_reading(ctx,x0-12,ry-36,S_.w-56,48,o.readA);ac_star(ctx,S_.x+14,ry-11,0.7,t,o.readA);}
  AC_STEPS.forEach((st,i)=>{const y=y0+i*56;ac_stepSign(ctx,i,x0+10,y-10,1);wc_T(ctx,String(i+1),x0+38,y,{w:800,size:30,col:WC_DARK});wc_T(ctx,st,x0+66,y,{w:600,size:30,col:WC_INK});});}
// policy 12's page, as Off the shelf left it after its pack 1 update: each line marked by where it runs (green, gold, grey), Yusuf's
// notes beside them, his key at the top, and 12.7 struck through: it can go. The agent's star reads along 12.7 (star, 0 to 1; starA)
// and finds nothing to check (q); the notes and the key fade as the camera closes in on it (notesOut)
const AC_PL=[["12.1","Each term has a named owner."],["12.2","Each term used in a report is in the glossary."],["12.3","Reports count by the glossary's definitions."],
  ["12.4","Terms about people are marked as personal data."],["12.5","Each term's owner decides its definition,","and how it maps to the government's."],
  ["12.6","Each decision is written down with the term."],["12.7","Staff take care to use terms correctly."]],
  AC_PLW=[0,0,0,0,1,1,2],AC_PLN=["a field no one can leave empty","checked every night","checked every night","a label","award: Mei decides","in the glossary",null],
  AC_PLC=[GV.green,GV.gold,GV.grey],AC_PLI=[GV.greenInk,GV.goldInk,GV.greyInk],AC_PLK=["runs in the work","a decision someone owns","can go"],
  AC_PLG={x:270,tx:354,y0:290,dy:78,lh:44,size:34,note:1300};
function ac_policy12(ctx,t,o){o=o||{};const P=AC_PLG,na=1-clamp(o.notesOut||0,0,1);wc_T(ctx,"Policy 12 · Data definitions",P.x,128,{w:800,size:50,col:WC_DARK});
  wc_T(ctx,"Business terms are defined consistently across the organisation.",P.x,188,{w:600,size:30,col:WC_MUTED});
  let y=P.y0;AC_PL.forEach((L,k)=>{const rows=L.slice(1),c=AC_PLW[k],n=rows.length;
    rows.forEach((s_,i)=>ac_hiStroke(ctx,P.tx,y+i*P.lh,tw(ctx,s_,P.size,600),AC_PLC[c],1,40+k*3+i,64));
    wc_T(ctx,L[0],P.x,y,{w:700,size:P.size,col:WC_MUTED});rows.forEach((s_,i)=>wc_T(ctx,s_,P.tx,y+i*P.lh,{w:600,size:P.size,col:c===2?WC_MUTED:WC_INK}));
    if(c===2){const w=tw(ctx,rows[0],P.size,600);ctx.save();ctx.strokeStyle=rgba(GV.greyInk,0.9);ctx.lineWidth=4;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(P.tx-8,y-11);ctx.quadraticCurveTo(P.tx+w/2,y-15,P.tx-8+w+16,y-10);ctx.stroke();ctx.restore();
      const a=o.starA||0;if(a>0.01){const u=easeCam(clamp(o.star||0,0,1));ac_reading(ctx,P.tx-12,y-38,(w+24)*u,50,a*0.8);ac_star(ctx,P.tx-12+(w+24)*u,y-12,0.9,t,a);}
      ac_redQ(ctx,P.tx+w+80,y+10,76,o.q||0,GV.greyInk);}
    if(AC_PLN[k]&&na>0.01)withA(ctx,na,()=>wc_hand(ctx,AC_PLN[k],P.note,y+(n-1)*P.lh/2,{size:34,w:700,col:AC_PLI[c]}));y+=P.dy+(n-1)*P.lh;});
  if(na>0.01)withA(ctx,na,()=>AC_PLK.forEach((s_,j)=>{const ky=84+j*44;ac_hiStroke(ctx,P.note,ky,44,AC_PLC[j],1,70+j,34);wc_hand(ctx,s_,P.note+70,ky,{size:30,w:700,col:AC_PLI[j]});}));}
// the board, close, in the data team's room: the checklist pinned up for anyone to read, the same page as its copies (its steps lit,
// its don'ts); Anil's question, in pencil, under the don'ts, with an arrow up to step 4 (note, 0 to 1)
const AC_BP={x:251,y:116,s:0.872};
function ac_boardCheck(ctx,t,o){o=o||{};const B=AC_BP,K=AC_SK;ctx.save();ctx.translate(B.x,B.y);ctx.rotate(0.006);ctx.scale(B.s,B.s);ctx.translate(-236,-90);
  gv_sheet(ctx,236,90,1640,790);ac_checklist(ctx,t,{steps:[1,1,1,1,1,1,1],ink:1,donts:[1,1,1,1]});
  const u=clamp(o.note||0,0,1);if(u>0){const P0=[1170,735],C=[1170,590],P2=[K.x+52+tw(ctx,AC_STEPS[3],32,600)+92+14,K.y0+3*K.dy-11],v=clamp(u*3.5,0,1);
    ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=3.5;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
    for(let i=0;i<=24;i++){const q=v*i/24,a=(1-q)*(1-q),b=2*q*(1-q),c=q*q,px=a*P0[0]+b*C[0]+c*P2[0],py=a*P0[1]+b*C[1]+c*P2[1];i?ctx.lineTo(px,py):ctx.moveTo(px,py);}
    if(v>=1){ctx.moveTo(P2[0]+16,P2[1]-11);ctx.lineTo(P2[0],P2[1]);ctx.lineTo(P2[0]+16,P2[1]+11);}ctx.stroke();
    wc_hand(ctx,"why the stricter class?",1190,775,{size:36,w:700,col:WC_PENCIL,p:clamp(u*1.4-0.4,0,1)});}
  ctx.restore();gv_pin(ctx,B.x+820*B.s,B.y+22,GV.gold,1.4);}

/* ---------- 8 · That night ---------- */
// dawn over the campus: the same campus, its clock at two minutes to eight, a pale warm sky
function ac_paintDawn(c){gv_paintCampus(c);ac_clockAt(c,7,58);c.save();c.globalCompositeOperation="multiply";const g=c.createLinearGradient(0,0,0,H);
  g.addColorStop(0,rgba([250,220,206],1));g.addColorStop(0.5,rgba([252,236,214],1));g.addColorStop(1,rgba([236,232,226],1));c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
  c.save();c.globalCompositeOperation="screen";wc_glowAt(c,1500,240,700,[255,214,170],0.3);c.restore();}
// what the night is made of, each a picture of the paper that stands for it with its words under it: the checklist, the rules for AI
// helpers with the agent's star, the register's page, and the approvals in gold (a, four, 0 to 1)
const AC_PARTS=["a checklist in plain words","rules for AI helpers","a register of who signs off what","people who decide"],AC_PT={cx:[520,1400],cy:[310,640]};
function ac_parts(ctx,t,a){AC_PARTS.forEach((s_,i)=>{const p=a[i]||0;if(p<=0.01)return;const cx=AC_PT.cx[i%2],cy=AC_PT.cy[i>>1],k=0.9+0.1*spring(p);
  ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);withA(ctx,clamp(p*1.6,0,1),()=>{
    if(i===0)ac_checkCopy(ctx,-190,-150,380,183,-0.015);
    else if(i===1){ctx.save();ctx.rotate(0.02);ctx.drawImage(gv_sheetPaper(150,222),-95,-175);gv_lines(ctx,-56,-128,100,1,0,1);gv_lines(ctx,-56,-96,110,8,20,0.9);ctx.restore();ac_star(ctx,62,-140,1.2,t,1);}
    else if(i===2)ac_whoPic(ctx,-180,-150,340,0);
    else{for(let j=0;j<3;j++){ctx.save();ctx.translate(-70+j*70,-80+j*12);ctx.rotate((j-1)*0.08);wc_panel(ctx,-110,-50,220,100,{kind:"card",wash:GV.gold,washA:0.35,seed:170+j});
      gv_lines(ctx,-90,-22,120,2,22,0.9);ctx.restore();}gv_stamp(ctx,30,-44,"APPROVED",1,{size:29,col:GV.goldInk,rot:-0.07,a:0.9});}
    wc_tag(ctx,0,96,s_,{size:34,wash:i===3?GV.gold:i===1?WC_SIDE.tech:null,washA:0.3,align:"center"});});ctx.restore();});}

const WC_PLACES={screenMorning:ac_paintScreenFacMorning,dusk:ac_paintDusk,night:ac_paintNight,dawn:ac_paintDawn,faculty:gv_paintFaculty,facDusk:ac_paintFacDusk,facMorning:ac_paintFacMorning,
  screenFac:ac_paintScreenFac,screenNight:ac_paintScreenFacNight,data:gv_paintData,advisers:ac_paintAdvisers,
  boardData:c=>gv_paintBoardClose(c,GV_ROOM.data),office:gv_paintOffice,boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),
  platClose:gv_paintPlatformClose,page:ac_paintPage,sheet:ac_paintSheet,paperDesk:gv_paintDesk,form:ac_paintForm,screenBig:ac_paintScreenBig,desk26:ac_paintDesk26,desk12:ac_paintDesk12};
