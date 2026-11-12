/* ===== One small change at a time: the university, 2027 =====
   The film's own pictures for Ivy's Monday refresh (prefix kz_). The module's kit draws the rooms, the people, the sheets and the
   things in them, and is never changed for this film; what is here is this film's alone:
     kzMonday, kzTalk, kzThursday, kzReview   the team's room on a Monday morning, the small room where Helena and Ivy talk, the
                                              team's room on a Thursday afternoon, and the room of the fortnightly review, late
     kz_clock(ctx, x, y, r, m)                a clock on the wall at m minutes past midnight
     kz_monday(ctx, x, y, w, o)               a Monday, from 06:00 to 11:00: the job that publishes at six, the promise at seven,
                                              Ivy's two hours of checks by hand, and the hours when the page isn't checked yet
     kz_cycle(ctx, cx, cy, r, o)              the cycle: plan, do, study, act (keep it, or drop it), drawn as a ring
     kz_steps(ctx, x, y, w, o)                Ivy's refresh, step by step, with the minutes each takes: six steps, 120 minutes
     kz_checklist(ctx, x, y, w, o)            the four steps left, as one checklist: each step, and what good looks like
     kz_job(ctx, x, y, w, o)                  the job: load, build, check, publish; the checks that come into it one a week
     kz_stairs(ctx, x, y, w, o)               the minutes after each small change: 120 down to 10, checked
     kz_stair(ctx, x, y, w, h, o)             the same, as a stair of seven small steps, each one ticked: the film's shape
     kz_week(ctx, x, y, w, o)                 four Mondays, each with its two hours by hand
     kz_print(ctx, x, y, w)                   a print of the hospital cut open, on the team room's wall
   Colour keeps the module's meaning: orange the data and the job that loads it, blue plans and the standard (the plan of each
   change, the checklist, the time Helena gives), green what's done or kept, amber what costs time or carries a risk (the minutes by
   hand, a number nobody has checked, what's dropped). */

/* ---------------------------------------------------------------- the places */
AG_PLACES.kzMonday=c=>lp_paintRoom(c,{light:"morning",seed:9});
AG_PLACES.kzTalk=c=>lp_paintRoom(c,{light:"day",seed:12,base:[220,206,190]});
AG_PLACES.kzThursday=c=>lp_paintRoom(c,{light:"day",seed:10});
AG_PLACES.kzReview=c=>lp_paintRoom(c,{light:"late",seed:14});

/* ---------------------------------------------------------------- a clock on the wall */
function kz_clock(c,x,y,r,m,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  c.save();c.shadowColor="rgba(52,36,30,0.28)";c.shadowBlur=14;c.shadowOffsetX=LP.sdx*0.6;c.shadowOffsetY=8;c.fillStyle=rgba(LP.graphite,1);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.restore();
  c.fillStyle=rgba(LP.paper,1);c.beginPath();c.arc(x,y,r-9,0,TAU);c.fill();c.strokeStyle=rgba(LP.ink,0.8);c.lineCap="round";
  for(let i=0;i<12;i++){const an=i/12*TAU,l=i%3===0?16:9;c.lineWidth=i%3===0?5:3;c.beginPath();c.moveTo(x+Math.sin(an)*(r-18),y-Math.cos(an)*(r-18));c.lineTo(x+Math.sin(an)*(r-18-l),y-Math.cos(an)*(r-18-l));c.stroke();}
  const hA=((m/60)%12)/12*TAU,mA=(m%60)/60*TAU;c.strokeStyle=rgba(LP.ink,1);c.lineWidth=8;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.sin(hA)*r*0.48,y-Math.cos(hA)*r*0.48);c.stroke();
  c.lineWidth=5;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.sin(mA)*r*0.72,y-Math.cos(mA)*r*0.72);c.stroke();c.fillStyle=rgba(LP.ink,1);c.beginPath();c.arc(x,y,7,0,TAU);c.fill();c.restore();}

/* ---------------------------------------------------------------- a Monday, from six to eleven
   o: a, k, light; job (0 to 1: the orange mark at 06:00, "The job publishes", or o.jobText), promise (the blue mark at 07:00), hand
   (the amber band of Ivy's checks from 08:30, growing to 10:30 with handU), open (the stretch from 06:00 until her checks end, "Not
   checked yet"), reader (someone who opens the page: at 08:16, in the hours nobody has checked, or, in October, at 07:40, with a green tick),
   checked (0 to 1: October's Monday, the checks inside the job before six, her ten minutes, and the whole morning checked). Each
   mark's words sit to the right of its line's top, the job's line the taller, so neither crosses the other at any width from 1200. */
const kz_hm=(h,m)=>h*60+(m||0);
function kz_monday(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=420,x0=x+60,x1=x+w-60,t0=kz_hm(6),t1=kz_hm(11),X=m=>lerp(x0,x1,(m-t0)/(t1-t0)),ay=y+300,ck=o.checked||0;
  c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));lp_sheet(c,x,y,w,h,{light:o.light===undefined?null:o.light,pin:false});
  lp_T(c,"EVERY MONDAY",x+w-36,y+62,{w:800,size:28,ls:3,col:LP.mut,align:"right"});
  // the hours, along the bottom
  c.strokeStyle=rgba(LP.mut,0.6);c.lineWidth=3;c.beginPath();c.moveTo(x0,ay);c.lineTo(x1,ay);c.stroke();
  for(let hh=6;hh<=11;hh++){const px=X(kz_hm(hh));c.beginPath();c.moveTo(px,ay-8);c.lineTo(px,ay+8);c.stroke();lp_T(c,(hh<10?"0":"")+hh+":00",px,ay+50,{w:600,size:28,align:"center",col:LP.mut});}
  const band=(m0,m1,yy,hh,col,al)=>{c.fillStyle=rgba(col,al);rr(c,X(m0),yy,X(m1)-X(m0),hh,8);c.fill();};
  // not checked yet: from six until her checks are done (in October, nothing: the job checks before it publishes)
  const op=(o.open||0)*(1-ck);if(op>0.004){c.save();c.globalAlpha*=op;band(t0,kz_hm(10,30),ay-150,110,LP.amber,0.14);
    c.save();c.beginPath();c.rect(X(t0),ay-150,X(kz_hm(10,30))-X(t0),110);c.clip();c.strokeStyle=rgba(LP.amber,0.3);c.lineWidth=3;for(let sx=X(t0)-110;sx<X(kz_hm(10,30));sx+=26){c.beginPath();c.moveTo(sx,ay-40);c.lineTo(sx+110,ay-150);c.stroke();}c.restore();
    lp_T(c,"Not checked yet",X(kz_hm(7))+16,ay-102,{w:700,size:28,col:LP.amber});c.restore();}
  // Ivy's two hours by hand, from half past eight
  const hd=(o.hand||0)*(1-ck);if(hd>0.004){const hu=o.handU==null?1:o.handU,e=lerp(kz_hm(8,30),kz_hm(10,30),ag_sine(hu));c.save();c.globalAlpha*=hd;band(kz_hm(8,30),Math.max(e,kz_hm(8,33)),ay-120,74,LP.amber,0.9);
    lp_T(c,"Ivy's checks, by hand",X(kz_hm(9,30)),ay-73,{w:700,size:28,align:"center",col:[255,255,255],a:ag_in(hu,0.7,0.3)});c.restore();}
  // October: ten minutes, checked, before anyone reads it
  if(ck>0.004){c.save();c.globalAlpha*=ck;band(kz_hm(6),kz_hm(11),ay-150,110,LP.green,0.1);band(kz_hm(8,30),kz_hm(8,40),ay-120,74,LP.green,0.95);
    lp_T(c,"Checked before anyone reads it",X(kz_hm(8,52)),ay-102,{w:700,size:28,col:LP.green});c.restore();}
  // someone opens the page at 08:16
  const rd=o.reader==null?op:o.reader*(ck>0.004?1:op);if(rd>0.004){const rx=X(ck>0.5?kz_hm(7,40):kz_hm(8,16));c.save();c.globalAlpha*=rd;c.fillStyle=rgba(LP.ink,0.85);c.beginPath();c.arc(rx,ay-74,11,0,TAU);c.fill();
    c.beginPath();c.moveTo(rx-16,ay-44);c.quadraticCurveTo(rx,ay-66,rx+16,ay-44);c.closePath();c.fill();
    if(ck>0.004){c.globalAlpha*=ck;c.fillStyle=rgba(LP.green,1);c.beginPath();c.arc(rx+26,ay-94,14,0,TAU);c.fill();lp_icon(c,"tick",rx+26,ay-94,18,[255,255,255]);}c.restore();}
  // the job at six, and the promise at seven
  const mark=(m,col,txt,u,dy)=>{if(u<=0.004)return;const px=X(m);c.save();c.globalAlpha*=u;c.fillStyle=rgba(col,1);c.beginPath();c.arc(px,ay,12,0,TAU);c.fill();
    c.strokeStyle=rgba(col,1);c.lineWidth=4;c.beginPath();c.moveTo(px,ay-12);c.lineTo(px,ay-dy+12);c.stroke();lp_T(c,txt,px+16,ay-dy,{w:700,size:28,col});c.restore();};
  mark(t0,LP.orange,o.jobText||"The job publishes",o.job||0,236);mark(kz_hm(7),LP.blue,"The promise: by 07:00",o.promise||0,190);
  c.restore();}

/* ---------------------------------------------------------------- the cycle: plan, do, study, act
   o: a; u (0 to 1: the ring draws itself, arc by arc, each word with its arc), labels (0 to 1), hi (0 to 3: the arc lit now, as a number that can move between
   them; null for none), dot (0 to 1: a dot going once round), small (true: no words but the four, for a cycle drawn small). Plan is
   blue (a plan); act ends in two: keep it (green) or drop it (amber). */
const KZ_CYCLE=[{t:"Plan",col:LP.blue},{t:"Do",col:LP.ink},{t:"Study",col:LP.ink},{t:"Act",col:LP.ink}];
function kz_cycle(c,cx,cy,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;const u=o.u==null?1:o.u,lw=o.lw||(o.small?14:22),gap=0.16;
  for(let i=0;i<4;i++){const s0=-Math.PI/2+i*TAU/4+gap/2,s1=s0+TAU/4-gap,f=clamp(u*4-i,0,1);if(f<=0)continue;const lit=o.hi==null?1:clamp(1-Math.abs(o.hi-i),0,1);
    c.strokeStyle=rgba(KZ_CYCLE[i].col,lerp(0.35,1,lit));c.lineWidth=lw;c.lineCap="round";c.beginPath();c.arc(cx,cy,r,s0,lerp(s0,s1,ag_sine(f)));c.stroke();
    // an arrowhead at each arc's end, the way the cycle turns
    if(f>=1){const ex=cx+Math.cos(s1)*r,ey=cy+Math.sin(s1)*r,tx=-Math.sin(s1),ty=Math.cos(s1),nx=Math.cos(s1),ny=Math.sin(s1),hs=lw*1.1;c.fillStyle=rgba(KZ_CYCLE[i].col,lerp(0.35,1,lit));
      c.beginPath();c.moveTo(ex+tx*hs*1.2,ey+ty*hs*1.2);c.lineTo(ex+nx*hs,ey+ny*hs);c.lineTo(ex-nx*hs,ey-ny*hs);c.closePath();c.fill();}}
  const la=o.labels==null?1:o.labels;if(la>0.004){c.save();c.globalAlpha*=la;const R=r+(o.small?54:78);
    for(let i=0;i<4;i++){const an=-Math.PI/2+(i+0.5)*TAU/4,lx=cx+Math.cos(an)*R,ly=cy+Math.sin(an)*R,lit=o.hi==null?1:clamp(1-Math.abs(o.hi-i),0,1),al=Math.cos(an)>0.2?"left":Math.cos(an)<-0.2?"right":"center",f=ag_sine(clamp(u*4-i,0,1));
      if(f<=0.004)continue;c.save();c.globalAlpha*=f;lp_T(c,KZ_CYCLE[i].t,lx,ly+(o.small?10:14),{w:800,size:o.small?28:40,align:al,col:i===0?LP.blue:LP.ink,a:lerp(0.45,1,lit)});
      if(i===3&&!o.small){lp_T(c,"Keep it",lx,ly+56,{w:700,size:28,align:al,col:LP.green,a:lerp(0.45,1,lit)});lp_T(c,"or drop it",lx,ly+92,{w:700,size:28,align:al,col:LP.amber,a:lerp(0.45,1,lit)});}c.restore();}c.restore();}
  if(o.dot!=null&&o.dot>0&&o.dot<1){const an=-Math.PI/2+o.dot*TAU;c.fillStyle=rgba(LP.paper,1);c.strokeStyle=rgba(LP.ink,1);c.lineWidth=4;c.beginPath();c.arc(cx+Math.cos(an)*r,cy+Math.sin(an)*r,lw*0.75,0,TAU);c.fill();c.stroke();}
  c.restore();}

/* ---------------------------------------------------------------- Ivy's refresh, step by step
   o: a, k, light; rows (0 to 1: they come in one by one), hl (a row lit, the others dimmed; null for none), drop (one per row, 0 to 1: a
   line through it, and it fades), total (the minutes shown at the foot). Each step's minutes as an amber bar: time spent by hand. */
const KZ_STEPS=[["Check the data arrived",25],["Check 14 rooms by hand",15],["Compare every room with last week",30],["Fix it, and run it again",15],["Copy the week for Facilities",15],["Write a note to readers",20]];
function kz_steps(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const rh=70,h=200+KZ_STEPS.length*rh+90,bs=240,bx=x+w-36-bs-130;
  c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));lp_sheet(c,x,y,w,h,{col:LP.amber,light:o.light===undefined?null:o.light,pin:false});
  lp_T(c,"MONDAY 26 JULY",x+36,y+74,{w:800,size:28,ls:3,col:LP.amber});lp_T(c,"Ivy's refresh, timed",x+36,y+130,{w:800,size:40});
  const ru=o.rows==null?1:o.rows;
  KZ_STEPS.forEach(([s,m],i)=>{const ra=ag_sine(clamp(ru*KZ_STEPS.length-i,0,1));if(ra<=0.004)return;const yy=y+200+i*rh,d=o.drop?(o.drop[i]||0):0,lit=o.hl==null?1:(o.hl===i?1:0.45);
    c.save();c.globalAlpha*=ra*lerp(1,0.4,d)*lit;lp_T(c,s,x+36,yy+30,{w:600,size:28});
    c.fillStyle=rgba(LP.amber,0.85);rr(c,bx,yy+8,bs*m/30,30,6);c.fill();lp_T(c,m+" min",bx+bs*m/30+14,yy+34,{w:700,size:28,col:LP.mut});
    if(d>0){c.strokeStyle=rgba(LP.ink,0.9);c.lineWidth=4;c.beginPath();c.moveTo(x+30,yy+20);c.lineTo(lerp(x+30,x+w-30,ag_sine(d)),yy+20);c.stroke();}c.restore();});
  const ty=y+200+KZ_STEPS.length*rh+40;c.strokeStyle=rgba(LP.mut,0.5);c.lineWidth=2;c.beginPath();c.moveTo(x+36,ty-34);c.lineTo(x+w-36,ty-34);c.stroke();
  c.save();c.globalAlpha*=ag_sine(clamp(ru*KZ_STEPS.length-KZ_STEPS.length+1,0,1));lp_T(c,"In all",x+36,ty+6,{w:700,size:28,col:LP.mut});
  lp_T(c,Math.round(o.total==null?120:o.total)+" minutes",x+w-36,ty+8,{w:800,size:40,align:"right",col:LP.amber});c.restore();
  c.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the checklist
   o: a, k, light; u (0 to 1: the steps come in), ticks (one per step, 0 to 1: ticked as someone follows it). */
const KZ_LIST=[["The data arrived","Every room, every hour"],["Each room in its usual range","Anything outside it looked at"],["Fixed, and run again","Only what the checks found"],["A note to readers","What changed this week"]];
function kz_checklist(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const rh=104,h=170+KZ_LIST.length*rh+20;
  c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));lp_sheet(c,x,y,w,h,{col:LP.blue,light:o.light===undefined?null:o.light,pin:o.pin===undefined?true:o.pin});
  lp_T(c,"EVERY MONDAY",x+36,y+78,{w:800,size:28,ls:3,col:LP.blue});lp_T(c,"The checklist",x+36,y+132,{w:800,size:40});
  const u=o.u==null?1:o.u;
  KZ_LIST.forEach(([s,g],i)=>{const ra=ag_sine(clamp(u*KZ_LIST.length-i,0,1));if(ra<=0.004)return;const yy=y+176+i*rh;c.save();c.globalAlpha*=ra;
    c.strokeStyle=rgba(LP.ink,0.8);c.lineWidth=3;c.strokeRect(x+38,yy+4,34,34);
    const tk=o.ticks?(o.ticks[i]||0):0;if(tk>0){c.save();c.globalAlpha*=ag_in(tk,0,0.3);lp_icon(c,"tick",x+55,yy+21,34*lerp(0.6,1,ag_spr(tk,0,0.5)),LP.green);c.restore();}
    lp_T(c,(i+1)+"  "+s,x+92,yy+32,{w:700,size:28});lp_T(c,"Good: "+g,x+92,yy+72,{w:600,size:28,col:LP.mut});c.restore();});
  c.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the job
   o: a, k, light; flow (0 to 1: the four boxes draw in), checks (one per check, 0 to 1: it comes into the job, a green tick for "in
   the job"), stop (0 to 1: a check fails, the job stops before it publishes, last week's numbers stay, and Ivy is told, in words). */
const KZ_JOBCHECKS=["The data arrived: every room, every hour","Each room in its usual range","If a check fails, stop and tell Ivy"];
function kz_job(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const h=600;c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(c,x,y,w,h,{col:LP.orange,light:o.light===undefined?null:o.light,pin:false});lp_T(c,"EVERY MONDAY AT SIX",x+36,y+74,{w:800,size:28,ls:3,col:LP.orange});lp_T(c,"The job",x+36,y+128,{w:800,size:40});
  const B=["Load","Build","Check","Publish"],bw=(w-72-3*56)/4,fl=o.flow==null?1:o.flow,st=o.stop||0;
  B.forEach((s,i)=>{const f=ag_sine(clamp(fl*4-i,0,1));if(f<=0.004)return;const bxx=x+36+i*(bw+56),byy=y+170;c.save();c.globalAlpha*=f;
    const col=i===2?LP.blue:i===3?(st>0.5?LP.amber:LP.green):LP.orange;c.strokeStyle=rgba(col,1);c.lineWidth=5;rr(c,bxx,byy,bw,84,14);c.stroke();
    lp_T(c,s,bxx+bw/2,byy+54,{w:800,size:32,align:"center",col});
    if(i<3){c.save();c.globalAlpha*=i===2?1-ag_in(st,0,0.3):1;c.strokeStyle=rgba(LP.mut,0.8);c.lineWidth=4;c.beginPath();c.moveTo(bxx+bw+10,byy+42);c.lineTo(bxx+bw+44,byy+42);c.stroke();c.fillStyle=rgba(LP.mut,0.8);c.beginPath();c.moveTo(bxx+bw+50,byy+42);c.lineTo(bxx+bw+38,byy+33);c.lineTo(bxx+bw+38,byy+51);c.closePath();c.fill();c.restore();}
    c.restore();});
  // the checks that come into the job, one a week, under "Check"
  KZ_JOBCHECKS.forEach((s,i)=>{const f=o.checks?(o.checks[i]||0):0;if(f<=0.004)return;const yy=y+300+i*76;c.save();c.globalAlpha*=ag_in(f,0,0.4);
    c.fillStyle=rgba(LP.green,1);c.beginPath();c.arc(x+60,yy+20,18,0,TAU);c.fill();lp_icon(c,"tick",x+60,yy+20,24,[255,255,255]);lp_T(c,s,x+96,yy+30,{w:600,size:28});c.restore();});
  // a check fails: the job stops before it publishes; last week's page stays, and Ivy is told
  if(st>0.004){c.save();c.globalAlpha*=ag_in(st,0,0.4);const bxx=x+36+3*(bw+56),byy=y+170;c.strokeStyle=rgba(LP.amber,1);c.lineWidth=6;c.beginPath();c.moveTo(bxx-44,byy+18);c.lineTo(bxx-16,byy+66);c.moveTo(bxx-16,byy+18);c.lineTo(bxx-44,byy+66);c.stroke();
    c.fillStyle=rgba(LP.amber,1);c.beginPath();c.arc(x+60,y+530,10,0,TAU);c.fill();lp_T(c,"Last week's numbers stay; Ivy is told",x+96,y+540,{w:700,size:28,col:LP.amber});c.restore();}
  c.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the minutes after each small change
   o: a, k, light; rows (0 to 1: they come in, one change at a time), hl (a row lit; null for none), rh (each row's height, 64). The minutes by hand in amber; the
   last row, ten minutes, checked, in green. */
const KZ_STAIRS=[["Timed it",120],["No hand check of the 14 rooms",105],["No copy for Facilities",90],["One checklist",80],["The job checks the data arrived",60],["The job checks each room's range",35],["The job stops if a check fails",10]];
function kz_stairs(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const rh=o.rh||64,h=190+KZ_STAIRS.length*rh+30,bx=x+620,bwMax=w-620-150;
  c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));lp_sheet(c,x,y,w,h,{col:LP.green,light:o.light===undefined?null:o.light,pin:o.pin===undefined?false:o.pin});
  lp_T(c,"IVY'S MONDAY REFRESH",x+36,y+74,{w:800,size:28,ls:3,col:LP.green});lp_T(c,"Minutes, after each small change",x+36,y+128,{w:800,size:40});
  const ru=o.rows==null?1:o.rows;
  KZ_STAIRS.forEach(([s,m],i)=>{const ra=ag_sine(clamp(ru*KZ_STAIRS.length-i,0,1));if(ra<=0.004)return;const yy=y+176+i*rh,last=i===KZ_STAIRS.length-1,lit=o.hl==null?1:(o.hl===i?1:0.5);
    c.save();c.globalAlpha*=ra*lit;lp_T(c,s,x+36,yy+36,{w:600,size:28,col:last?LP.green:LP.ink});
    const bw=Math.max(14,bwMax*m/120)*ag_sine(clamp(ra*1.2,0,1));c.fillStyle=rgba(last?LP.green:LP.amber,last?1:0.85);rr(c,bx,yy+12,bw,32,6);c.fill();
    lp_T(c,last?m+" min, checked":m+" min",bx+bw+14,yy+38,{w:700,size:28,col:last?LP.green:LP.mut});c.restore();});
  c.restore();return{x,y,w,h};}
// the same seven changes as a stair going down, each step ticked when it's done (u, 0 to 1); no words
function kz_stair(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const n=KZ_STAIRS.length,sw=w/n,u=o.u==null?1:o.u;c.save();c.globalAlpha*=a;
  c.strokeStyle=rgba(LP.ink,0.85);c.lineWidth=8;c.lineCap="round";c.lineJoin="round";c.beginPath();let px=x,py=y;c.moveTo(px,py);
  for(let i=0;i<n;i++){const f=ag_sine(clamp(u*n-i,0,1));if(f<=0)break;const ny=y+h*(1-KZ_STAIRS[i][1]/120)*0.92+0.0;const sy=i===0?y:py;
    // a riser down to this step's height, then the tread across
    const ry=lerp(sy,i===0?y:ny,Math.min(1,f*2)),tx=px+sw*clamp(f*2-1,0,1);c.lineTo(px,ry);if(f>0.5)c.lineTo(tx,ry);px=px+(f>=1?sw:0);py=ry;if(f<1)break;}
  c.stroke();
  for(let i=0;i<n;i++){const f=clamp(u*n-i-0.6,0,1);if(f<=0)continue;const ty=(i===0?y:y+h*(1-KZ_STAIRS[i][1]/120)*0.92)-30,tx=x+sw*i+sw/2;
    c.save();c.globalAlpha*=ag_in(f,0,0.3);c.fillStyle=rgba(i===n-1?LP.green:LP.green,1);c.beginPath();c.arc(tx,ty,16*lerp(0.6,1,ag_spr(f,0,0.4)),0,TAU);c.fill();lp_icon(c,"tick",tx,ty,22,[255,255,255]);c.restore();}
  c.restore();}

/* ---------------------------------------------------------------- four Mondays, each with its two hours by hand */
function kz_week(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const h=330;c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(c,x,y,w,h,{light:o.light===undefined?null:o.light,pin:false});lp_T(c,"A WEEKLY CHORE",x+36,y+74,{w:800,size:28,ls:3,col:LP.mut});
  const cw=(w-72-3*24)/4,u=o.u==null?1:o.u;
  for(let i=0;i<4;i++){const f=ag_sine(clamp(u*4-i,0,1));if(f<=0.004)continue;const cx=x+36+i*(cw+24),cy=y+110;c.save();c.globalAlpha*=f;
    c.strokeStyle=rgba(LP.mut,0.5);c.lineWidth=2;rr(c,cx,cy,cw,180,12);c.stroke();lp_T(c,"Monday",cx+cw/2,cy+46,{w:700,size:28,align:"center",col:LP.mut});
    c.fillStyle=rgba(LP.amber,0.88);rr(c,cx+20,cy+78,cw-40,72,10);c.fill();lp_T(c,"By hand",cx+cw/2,cy+124,{w:700,size:28,align:"center",col:[255,255,255]});c.restore();}
  c.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a print of the hospital, cut open, on the team room's wall */
function kz_print(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const s=w/1560,h=760*s;c.save();c.globalAlpha*=a;
  c.save();c.shadowColor="rgba(52,36,30,0.3)";c.shadowBlur=18;c.shadowOffsetX=LP.sdx;c.shadowOffsetY=12;c.fillStyle=rgba(LP.timber,1);c.fillRect(x-14,y-14,w+28,h+28);c.restore();
  c.fillStyle=rgba(LP.paper,1);c.fillRect(x,y,w,h);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.translate(x,y);c.scale(s,s);c.translate(-200,-250);
  c.drawImage(ag_place("kzColombo"),0,0,W,H);kz_hospital(c,{t:0,room:()=>({lit:1,tidy:1})});c.restore();c.restore();}
