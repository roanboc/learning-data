/* ===== Prototype first: the university, February to June 2027 =====
   The film's own pictures at the university, on the module's kit (prefix pf_), which is never changed for this film. Colour keeps the
   module's meaning: the rounds, the reviews, the definition and Ivy's page in blue (plans and design); the bookings, the head counts,
   the model and the heat map in orange (data); a first use, a decision served and what the team keeps in green (done, value); the
   building's price, the weeks a request waits and a booked hour nobody uses in amber (cost, waiting); the team's agent and its draft
   in violet, and only they. People wear none of the five.
     pfFeb, pfApr, pfFri, pfGraham, pfJune   the places: Graham's office on a grey February day; the team's room on April mornings; the
                                             team's room on Friday afternoons, its screen on the wall, when Graham comes to see the
                                             real thing; Graham's office in April, his own screen on the wall; the council's room in June
     pf_glass(ctx, scr, o)                  what a place's screen shows (o.draw), its glass waking with o.a; the screen itself is
                                            painted with the place, so it stays put while what it shows comes and goes
     pf_dash(ctx, X, Y, Wd, Hd, o)          the dashboard: the week's heat map, booked or used, hour by hour, and three figures
     pf_campus(ctx, o)                      the teaching building cut open, small, and the new one Graham might ask for beside it
     pf_queue(ctx, x, y, o)                 requests waiting on the team's wall, Graham's among them
     pf_page(ctx, x, y, w, o)               Ivy's page: the whole route of Graham's question, from his decision down to the data
     pf_draft(ctx, x, y, w, o)              the agent's draft model, and the note of what it assumed
     pf_rounds(ctx, x, y, w, o)             the rounds, from Tuesday 30 March to Friday 23 April, each ending on a Friday's review
     pf_days(ctx, x, y, w, o)               working days from asking to first use: 41 on average; this one waited, then took 11
     pf_twoHours(ctx, o)                    the teaching building twice, small: at the peak, every room full; at a quiet hour, most
                                            rooms dark, and the booked ones nobody came to outlined in amber
     pf_loop(ctx, cx, cy, o)                something real, learn, repeat: three steps round a ring
     pf_held(o)                             a page held in the hand: Graham's one page for the council */

/* ---------------------------------------------------------------- the places */
// a screen on the wall, painted with its place: its glass dark until what it shows wakes it
const PF_SCR={x:80,y:150,w:1100,h:600};        // the team's room on Fridays
const PF_GSCR={x:760,y:170,w:1040,h:580};      // Graham's office in April
function pf_wallScreen(c,s){lp_screen(c,s.x,s.y,s.w,s.h,{bg:"#3C3A40"});
  const g=c.createLinearGradient(s.x,s.y,s.x+s.w,s.y+s.h);g.addColorStop(0,"rgba(255,255,255,0.10)");g.addColorStop(0.55,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(s.x,s.y,s.w,s.h);}
AG_PLACES.pfFeb=c=>lp_paintRoom(c,{light:"grey",seed:9});
AG_PLACES.pfApr=c=>lp_paintRoom(c,{light:"morning",seed:11});
AG_PLACES.pfFri=c=>{lp_paintRoom(c,{light:"late",seed:12});pf_wallScreen(c,PF_SCR);};
AG_PLACES.pfGraham=c=>{lp_paintRoom(c,{light:"day",seed:14,base:[220,210,196]});pf_wallScreen(c,PF_GSCR);};
AG_PLACES.pfJune=c=>lp_paintRoom(c,{light:"day",seed:13});
// what a place's screen shows, over its dark glass: o.a wakes it, o.draw(ctx, X, Y, Wd, Hd) draws it
function pf_glass(ctx,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;rr(ctx,s.x,s.y,s.w,s.h,4);ctx.clip();
  ctx.fillStyle="#FBF9F4";ctx.fillRect(s.x,s.y,s.w,s.h);if(o.draw)o.draw(ctx,s.x,s.y,s.w,s.h);
  const g=ctx.createLinearGradient(s.x,s.y,s.x+s.w,s.y+s.h);g.addColorStop(0,"rgba(255,255,255,0.1)");g.addColorStop(0.5,"rgba(255,255,255,0)");ctx.fillStyle=g;ctx.fillRect(s.x,s.y,s.w,s.h);ctx.restore();}

/* ---------------------------------------------------------------- the week, hour by hour
   The share of each hour booked over thirteen weeks of the timetable, Monday to Friday, 8:00 to 18:00: 93% from ten to two, Tuesday to
   Thursday, and 38% across the week (19.0 of 50 hours). One booked hour in five has nobody in it, so the hours used are four in five of
   those booked. After the third round: about one peak class in six moves to quieter hours (Monday and Friday, ten to two; Tuesday to
   Thursday, two to four), and the bookings nobody uses are released. */
const PF_DAYS=["Mon","Tue","Wed","Thu","Fri"],PF_HOURS=[8,9,10,11,12,13,14,15,16,17];
const PF_BOOK=[
  [0.08,0.22,0.46,0.50,0.42,0.44,0.30,0.22,0.12,0.04],
  [0.10,0.34,0.92,0.95,0.93,0.91,0.36,0.24,0.12,0.04],
  [0.10,0.30,0.94,0.96,0.92,0.90,0.34,0.22,0.10,0.04],
  [0.10,0.32,0.93,0.95,0.94,0.91,0.34,0.20,0.10,0.02],
  [0.06,0.18,0.34,0.36,0.26,0.20,0.12,0.08,0.04,0.02]];
const pf_peak=(d,h)=>d>=1&&d<=3&&h>=2&&h<=5;
// where the moved classes go: a sixth of each peak hour, spread over the quieter hours beside the peak
const PF_TO=[[0,2],[0,3],[0,4],[0,5],[4,2],[4,3],[4,4],[4,5],[1,6],[2,6],[3,6],[1,7],[2,7],[3,7]];
const PF_MOVED=(()=>{const m=PF_BOOK.map(r=>r.slice());let moved=0;for(let d=0;d<5;d++)for(let h=0;h<10;h++)if(pf_peak(d,h)){const k=m[d][h]/6;m[d][h]-=k;moved+=k;}
  for(const [d,h] of PF_TO)m[d][h]+=moved/PF_TO.length;return m;})();
// a cell's share at this moment: o.used (0 to 1, from booked to used), o.move (0 to 1, the peak classes moved), o.release (0 to 1,
// the bookings nobody uses released)
function pf_share(d,h,o){let v=lerp(PF_BOOK[d][h],PF_MOVED[d][h],ag_sine(o.move||0));v*=1-0.2*ag_sine(o.release||0);return v*(1-0.2*ag_sine(o.used||0));}

/* ---------------------------------------------------------------- the dashboard
   o: u (0 to 1: the heat map fills in, hour by hour), used (0 to 1: the tab moves from Booked to Used), peak (0 to 1: the peak's dashed
   outline), short (0 to 1: the outline turns amber, the rooms short there), figs (three numbers, 0 to 1 each: booked all week, at the
   peak, nobody came), move, release, arrows (0 to 1: the blue arrows of the moved classes); o.first: the first round's version, the
   booked hours alone, the heat map across the whole screen (the Used tab and the figures come in the second round) */
function pf_dash(ctx,X,Y,Wd,Hd,o){o=o||{};
  // the header: the platform's mark and the dashboard's name
  let tx=X+28;if(typeof LOGO!=="undefined"&&LOGO.databricks)tx+=logo(ctx,"databricks",X+26,Y+22,36)+16;
  lp_T(ctx,"Room use, booked and used, by hour and day",tx,Y+50,{w:700,size:28});
  ctx.fillStyle=rgba(LP.mut,0.25);ctx.fillRect(X,Y+76,Wd,2);
  // the two tabs: booked, used
  const us=ag_sine(o.used||0),tab=(x,label,on)=>{const w=lp_tw(ctx,label,{w:700,size:28})+44;rr(ctx,x,Y+96,w,46,23);
    ctx.fillStyle=rgba(mix(LP.paper,LP.orange,0.14+0.86*on),1);ctx.fill();ctx.strokeStyle=rgba(LP.orange,0.9);ctx.lineWidth=2.5;ctx.stroke();
    lp_T(ctx,label,x+w/2,Y+129,{w:700,size:28,align:"center",col:mix(LP.orange,[255,255,255],on)});return w;};
  const w1=tab(X+28,"Booked",1-us);if(!o.first)tab(X+28+w1+14,"Used",us);
  // the heat map: the days down the side, the hours across
  const gp=6,gx=X+108,gy=Y+214,cw=o.first?Math.floor((Wd-136-9*gp)/10):52,ch=52,u=o.u==null?1:o.u;
  PF_HOURS.forEach((h,j)=>lp_T(ctx,String(h),gx+j*(cw+gp)+cw/2,gy-16,{w:600,size:28,align:"center",col:LP.mut}));
  PF_DAYS.forEach((dn,i)=>lp_T(ctx,dn,X+28,gy+i*(ch+gp)+ch/2+10,{w:600,size:28,col:LP.mut}));
  for(let i=0;i<5;i++)for(let j=0;j<10;j++){const k=clamp(u*16-(j+i*0.6),0,1);if(k<=0)continue;const v=pf_share(i,j,o),cx=gx+j*(cw+gp),cy=gy+i*(ch+gp);
    ctx.save();ctx.globalAlpha*=ag_sine(k);rr(ctx,cx,cy,cw,ch,6);ctx.fillStyle=rgba(mix([244,238,228],LP.orange,clamp(v,0,1)),1);ctx.fill();ctx.restore();}
  const gw=10*(cw+gp)-gp,gh=5*(ch+gp)-gp;
  lp_T(ctx,us>0.5?"Share of each hour used, 13 weeks":"Share of each hour booked, 13 weeks",X+28,gy+gh+52,{w:600,size:28,col:LP.mut,a:1});
  // the peak: ten to two, Tuesday to Thursday, outlined; amber where the rooms are short
  const pk=ag_sine(o.peak||0);if(pk>0){const px=gx+2*(cw+gp)-7,py=gy+(ch+gp)-7,pw=4*(cw+gp)-gp+14,ph=3*(ch+gp)-gp+14;ctx.save();ctx.globalAlpha*=pk;
    ctx.setLineDash([12,8]);ctx.lineWidth=4;ctx.strokeStyle=rgba(mix(LP.ink,LP.amber,ag_sine(o.short||0)),1);rr(ctx,px,py,pw,ph,10);ctx.stroke();ctx.restore();}
  // the moved classes: blue arrows from the peak to the quieter hours beside it
  const ar=o.arrows||0;if(ar>0){ctx.save();ctx.strokeStyle=rgba(LP.blue,1);ctx.fillStyle=rgba(LP.blue,1);ctx.lineWidth=4;ctx.lineCap="round";
    const cc=(d,h)=>[gx+h*(cw+gp)+cw/2,gy+d*(ch+gp)+ch/2],pairs=[[[2,2],[0,2]],[[2,5],[0,5]],[[2,3],[4,3]],[[2,4],[4,4]],[[1,5],[1,6]],[[3,5],[3,7]]];
    pairs.forEach(([a,b],n)=>{const k=ag_sine(clamp(ar*1.6-n*0.12,0,1));if(k<=0)return;const [x0,y0]=cc(a[0],a[1]),[x1,y1]=cc(b[0],b[1]),dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy),
      ux=dx/l,uy=dy/l,sx=x0+ux*16,sy=y0+uy*16,ex=lerp(sx,x1-ux*18,k),ey=lerp(sy,y1-uy*18,k);
      ctx.globalAlpha=1;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ex+ux*10,ey+uy*10);ctx.lineTo(ex-ux*8-uy*9,ey-uy*8+ux*9);ctx.lineTo(ex-ux*8+uy*9,ey-uy*8-ux*9);ctx.closePath();ctx.fill();});
    ctx.restore();}
  // three figures on the right: booked all week, at the peak, booked with nobody there
  const fx=gx+gw+40,fw=X+Wd-28-fx,F=[{label:"Booked, all week",num:"38%",col:LP.orange},{label:"Tue to Thu, 10 to 2",num:"93%",col:LP.orange},
    {label:"Booked, nobody came",num:"1 in 5",col:LP.amber,sub:"About half the seats"}],figs=o.figs||[];
  F.forEach((f,i)=>{const k=clamp(figs[i]||0,0,1);if(k<=0)return;const fy=Y+92+i*148;ctx.save();ctx.globalAlpha*=ag_sine(k);
    rr(ctx,fx,fy,fw,136,10);ctx.fillStyle=rgba(mix(LP.paper,f.col,0.07),1);ctx.fill();ctx.fillStyle=rgba(f.col,1);ctx.fillRect(fx,fy+12,6,112);
    lp_T(ctx,f.label,fx+26,fy+38,{w:600,size:28,col:LP.mut});lp_T(ctx,f.num,fx+26,fy+96,{w:800,size:56,col:f.col});
    if(f.sub)lp_T(ctx,f.sub,fx+26,fy+126,{w:600,size:28,col:LP.ink,a:ag_sine(clamp(k*2-1,0,1))});ctx.restore();});}

/* ---------------------------------------------------------------- the teaching building, and the one Graham might ask for */
// the building cut open, scaled k about its foot at (ax, ground); rooms all softly lit, as on a working day
function pf_smallBuilding(ctx,ax,k,room){ctx.save();ctx.translate(ax,LP_TEACHING.ground);ctx.scale(k,k);ctx.translate(-LP_TEACHING.x0,-LP_TEACHING.ground);
  lp_section(ctx,LP_TEACHING,{room:room||(()=>({lit:0.5}))});ctx.restore();}
// o.ghost (0 to 1: the new building drawn in dashed blue), o.off (0 to 1: put off; it fades to a faint outline), o.a
function pf_campus(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;pf_smallBuilding(ctx,110,0.56);
  const g=ag_sine(o.ghost||0)*(1-0.6*ag_sine(o.off||0));if(g>0){const x0=1090,x1=1730,top=470,gy=LP_TEACHING.ground;ctx.save();ctx.globalAlpha*=g;
    ctx.fillStyle=rgba(LP.blue,0.07);ctx.fillRect(x0,top,x1-x0,gy-top);ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=4;ctx.setLineDash([16,10]);ctx.strokeRect(x0,top,x1-x0,gy-top);
    ctx.lineWidth=2.5;ctx.setLineDash([10,10]);for(let f=1;f<4;f++){const y=gy-f*(gy-top)/4;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();}
    for(let r=1;r<3;r++){const x=x0+r*(x1-x0)/3;ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,gy);ctx.stroke();}ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- requests waiting */
// five requests already on the wall, each with the amber band of waiting, askew; Graham's pinned last, with its words; o.u (0 to 1:
// they come in), o.mine (0 to 1: Graham's), o.light
function pf_queue(ctx,x,y,o){o=o||{};const u=o.u==null?1:o.u,R=ag_rnd(41);
  for(let i=0;i<5;i++){const k=clamp(u*5-i,0,1);if(k<=0)continue;const bx=x+(i%3)*250+(R()-0.5)*20,by=y+Math.floor(i/3)*230+(R()-0.5)*16,tilt=(R()-0.5)*5;
    ctx.save();ctx.globalAlpha*=ag_sine(k);lp_sheet(ctx,bx,by,220,180,{col:LP.amber,light:o.light,tilt});
    ctx.translate(bx+110,by+90);ctx.rotate(tilt*Math.PI/180);ctx.fillStyle=rgba(LP.mut,0.28);for(let l=0;l<3;l++)ctx.fillRect(-80,-22+l*30,l===2?100:160,8);ctx.restore();}
  const m=clamp(o.mine||0,0,1);if(m>0)lp_textSheet(ctx,x+490,y+240,410,{kick:"From Graham Ellis",title:"A dashboard of room use, by Easter?"},{col:LP.amber,light:o.light,a:ag_sine(m),k:o.mk});}

/* ---------------------------------------------------------------- Ivy's page */
const PF_ROUTE=[{t:"Decide: build, or not?",col:LP.blue},{t:"Ask: are the rooms full?",col:LP.blue},{t:"Show: use by hour and day",col:LP.blue},
  {t:"Model: booked and used",col:LP.orange},{t:"Data: bookings, head counts",col:LP.orange}];
// o.u (0 to 1: the route's steps, one by one), o.rooms (0 to 1: the rooms on it), o.a, o.k, o.light
function pf_page(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=640;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});lp_T(ctx,"IVY'S PAGE",x+36,y+80,{w:800,size:28,ls:3,col:LP.blue});
  lp_T(ctx,"Graham's question, end to end",x+36,y+136,{w:800,size:40});
  const u=o.u==null?1:o.u,bx=x+36,bw=w-72,bh=62,top=y+166;
  PF_ROUTE.forEach((s,i)=>{const k=clamp(u*5-i,0,1);if(k<=0)return;const by=top+i*82;ctx.save();ctx.globalAlpha*=ag_sine(k);
    if(i>0){ctx.strokeStyle=rgba(LP.mut,0.6);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx+40,by-20);ctx.lineTo(bx+40,by);ctx.stroke();}
    ctx.strokeStyle=rgba(s.col,1);ctx.lineWidth=3;rr(ctx,bx,by,bw,bh,10);ctx.fillStyle=rgba(s.col,0.07);ctx.fill();ctx.stroke();
    lp_T(ctx,s.t,bx+24,by+bh/2+10,{w:600,size:28});ctx.restore();});
  const r=ag_sine(o.rooms||0);if(r>0){ctx.save();ctx.globalAlpha*=r;lp_T(ctx,"186 rooms; the 14 named two ways, matched",x+36,y+h-36,{w:600,size:28,col:LP.ink});ctx.restore();}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the agent's draft */
// o.flag (0 to 1: the assumption ringed in amber), o.u (0 to 1: its lines come in), o.a, o.k, o.light
function pf_draft(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=376;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.violet,light:o.light});lp_T(ctx,"THE AGENT'S DRAFT",x+36,y+80,{w:800,size:28,ls:3,col:LP.violet});
  lp_T(ctx,"Room use, booked and used",x+36,y+136,{w:800,size:40});
  const u=o.u==null?1:o.u,l1=ag_sine(clamp(u*2,0,1)),l2=ag_sine(clamp(u*2-1,0,1));
  ctx.save();ctx.globalAlpha*=l1;ctx.fillStyle=rgba(LP.violet,1);ctx.beginPath();ctx.arc(x+44,y+186,6,0,TAU);ctx.fill();
  lp_T(ctx,"Counts booked hours, per room, per hour",x+70,y+196,{w:600,size:28});ctx.restore();
  ctx.save();ctx.globalAlpha*=l2;ctx.fillStyle=rgba(LP.mut,0.3);ctx.fillRect(x+36,y+228,w-72,2);
  lp_T(ctx,"WHAT I ASSUMED",x+36,y+278,{w:800,size:28,ls:3,col:LP.mut});lp_T(ctx,"A booked hour is a used hour",x+36,y+326,{w:600,size:28});ctx.restore();
  const f=ag_sine(o.flag||0);if(f>0){ctx.save();ctx.globalAlpha*=f;ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=4;rr(ctx,x+18,y+292,w-36,50,12);ctx.stroke();
    lp_icon(ctx,"cross",x+w-56,y+317,30,LP.amber);ctx.restore();}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the rounds
   Working days from Tuesday 30 March to Friday 30 April 2027, 24 of them: the data put in place (30 March to 2 April), then three
   rounds of a week (5 to 9, 12 to 16 and 19 to 23 April), each ending with Friday's review; a fourth, never needed (26 to 30 April). */
const PF_RD=[{label:"Data in place",d0:0,d1:4,col:LP.orange},{label:"Round 1",d0:4,d1:9,col:LP.blue,end:"Fri 9 Apr"},
  {label:"Round 2",d0:9,d1:14,col:LP.blue,end:"Fri 16 Apr"},{label:"Round 3",d0:14,d1:19,col:LP.blue,end:"Fri 23 Apr"},{label:"Round 4",d0:19,d1:24,col:LP.blue,ghost:true}];
// o.u (0 to 1: the blocks come in), o.lit (the round picked out: 1, 2 or 3; 0 none), o.used (0 to 1: first used, Wednesday 14 April),
// o.fourth (0 to 1: the fourth round, dashed), o.stop (0 to 1: it fades, and the decision is served), o.a, o.k, o.light
function pf_rounds(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=330;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});lp_T(ctx,"GRAHAM'S QUESTION, THE NEW WAY",x+40,y+80,{w:800,size:28,ls:3,col:LP.blue});
  lp_T(ctx,"Tue 30 Mar",x+40,y+130,{w:600,size:28,col:LP.mut});
  const px=x+40,pw=w-80,dw=pw/24,by=y+160,bh=82,u=o.u==null?1:o.u;
  PF_RD.forEach((b,i)=>{let k=clamp(u*4-i,0,1);if(b.ghost)k=ag_sine(o.fourth||0)*(1-0.75*ag_sine(o.stop||0));if(k<=0)return;
    const bx=px+b.d0*dw+4,bw=(b.d1-b.d0)*dw-8,lit=o.lit&&o.lit===i;ctx.save();ctx.globalAlpha*=b.ghost?k:ag_sine(k);
    rr(ctx,bx,by,bw,bh,12);if(b.ghost){ctx.setLineDash([12,8]);ctx.strokeStyle=rgba(b.col,0.9);ctx.lineWidth=3;ctx.stroke();}
    else{ctx.fillStyle=rgba(b.col,lit?1:0.14);ctx.fill();ctx.strokeStyle=rgba(b.col,1);ctx.lineWidth=3;ctx.stroke();}
    lp_T(ctx,b.label,bx+bw/2,by+bh/2+10,{w:700,size:28,align:"center",col:lit?[255,255,255]:(b.ghost?LP.blue:LP.ink)});
    if(b.end){ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(bx+bw-14,by+bh+22,8,0,TAU);ctx.fill();lp_T(ctx,b.end,bx+bw-14,by+bh+64,{w:600,size:28,align:"right",col:LP.mut});}
    ctx.restore();});
  const fu=ag_sine(o.used||0);if(fu>0){const ux=px+11*dw+dw/2;ctx.save();ctx.globalAlpha*=fu;ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.moveTo(ux,by-4);ctx.lineTo(ux-12,by-24);ctx.lineTo(ux+12,by-24);ctx.closePath();ctx.fill();
    lp_T(ctx,"First used, Wed 14 Apr",ux,by-34,{w:700,size:28,align:"center",col:LP.green});ctx.restore();}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- working days, from asking to first use */
// o.wait (0 to 1: this request's seven weeks of waiting), o.took (0 to 1: the new way's 11 days, beside the average's 41), o.a, o.k, o.light
function pf_days(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=420;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light});lp_T(ctx,"WORKING DAYS",x+40,y+80,{w:800,size:28,ls:3,col:LP.mut});
  const lx=x+40,bx=x+400,unit=(w-400-200)/41,row=(i,label,n,col,k,val,dash)=>{if(k<=0)return;const ry=y+130+i*92;ctx.save();ctx.globalAlpha*=ag_sine(clamp(k*3,0,1));
    lp_T(ctx,label,lx,ry+40,{w:600,size:28});const bw=n*unit*ag_eo(k);rr(ctx,bx,ry+6,Math.max(4,bw),48,8);
    if(dash){ctx.setLineDash([10,7]);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.fillStyle=rgba(col,0.14);ctx.fill();ctx.stroke();ctx.setLineDash([]);}else{ctx.fillStyle=rgba(col,1);ctx.fill();}
    lp_T(ctx,val,bx+bw+18,ry+42,{w:800,size:28,col,a:ag_sine(clamp(k*2-1,0,1))});ctx.restore();};
  const wt=clamp(o.wait||0,0,1),tk=clamp(o.took||0,0,1);
  row(0,"This one, waiting",35,LP.amber,wt,"About 7 weeks",true);
  row(1,"Before, on average",41,LP.amber,tk,"41");
  row(2,"The new way",11,LP.green,tk,"11");
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- one week, two hours */
// which rooms are booked, and which used, at a quiet hour (Friday, 16:00): two rooms used; two booked that nobody came to
const PF_QUIET_USED=["1.02","2.03"],PF_QUIET_EMPTY=["1.04","3.01"];
const PF_SEATS={"G.01":[0.1,0.26,0.42,0.58,0.74,0.9],"G.03":[0.12,0.34,0.56,0.78,0.95],"1.01":[0.1,0.42,0.75],"1.02":[0.12,0.45,0.8],"1.03":[0.15,0.5,0.85],
  "1.04":[0.1,0.44,0.78],"2.01":[0.1,0.35,0.62,0.9],"2.02":[0.14,0.46,0.8],"2.03":[0.12,0.42,0.74],"3.01":[0.1,0.42,0.76],"3.02":[0.12,0.4,0.66,0.92],"3.03":[0.14,0.48,0.82]};
const PF_QSEATS={"1.02":[0.3,0.62],"2.03":[0.45]};
// the people in every room, kept once: at the peak and at the quiet hour
function pf_people(key,seats){return ag_kept(key,W,H,c=>{let n=0;for(const id in seats)for(const s of seats[id]){const p=lp_seat(LP_TEACHING,id,s,0.17);
  lp_person(c,lp_crowd(n*3+2),p.x,p.y,p.s,{cut:p.cut,flip:n%3===1,t:n*0.7,light:{wall:0}});n++;}});}
function pf_hour(ctx,ax,k,mode,o){const quiet=mode==="quiet",em=ag_sine(o.empty||0);
  pf_smallBuilding(ctx,ax,k,id=>{const kind=lp_roomBox(LP_TEACHING,id).kind;if(kind==="foyer")return{lit:0.35};
    if(!quiet)return{lit:1};if(PF_QUIET_USED.includes(id))return{lit:1};if(PF_QUIET_EMPTY.includes(id))return{lit:0.8,edge:em>0?LP.amber:null,edgeA:em};return{lit:0,dim:1};});
  const pp=pf_people(quiet?"pfQuietPeople":"pfPeakPeople",quiet?PF_QSEATS:PF_SEATS);ctx.save();ctx.translate(ax,LP_TEACHING.ground);ctx.scale(k,k);ctx.translate(-LP_TEACHING.x0,-LP_TEACHING.ground);
  ctx.drawImage(pp,0,0);ctx.restore();}
// o.peak, o.quiet (0 to 1: each building comes in), o.empty (0 to 1: the booked rooms nobody came to, outlined in amber), o.a; the two
// buildings at PF_HK of their size, their left ends at PF_HX, clear of the trees at the frame's edges
const PF_HK=0.53,PF_HX=[60,945];
function pf_twoHours(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const p=ag_sine(o.peak==null?1:o.peak),q=ag_sine(o.quiet==null?1:o.quiet);
  if(p>0){ctx.save();ctx.globalAlpha*=p;pf_hour(ctx,PF_HX[0],PF_HK,"peak",o);ctx.restore();}
  if(q>0){ctx.save();ctx.globalAlpha*=q;pf_hour(ctx,PF_HX[1],PF_HK,"quiet",o);ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- something real, learn, repeat */
const PF_STEPS=["Something real","Learn","Repeat"];
// three steps round a ring, in blue, the ring drawn with arrows between them: o.u (0 to 1: they come in in turn), o.r (190), o.a
function pf_loop(ctx,cx,cy,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const r=o.r||190,u=o.u==null?1:o.u;ctx.save();ctx.globalAlpha*=a;
  const an=[-Math.PI/2,Math.PI/6,Math.PI*5/6];ctx.strokeStyle=rgba(LP.blue,0.8);ctx.fillStyle=rgba(LP.blue,0.8);ctx.lineWidth=5;ctx.lineCap="round";
  for(let i=0;i<3;i++){const k=ag_sine(clamp(u*3-i-0.5,0,1));if(k<=0)continue;const a0=an[i]+0.42,a1=an[i]+TAU/3-0.42,ae=lerp(a0,a1,k);
    ctx.beginPath();ctx.arc(cx,cy,r,a0,ae);ctx.stroke();const hx=cx+Math.cos(ae)*r,hy=cy+Math.sin(ae)*r,tx=-Math.sin(ae),ty=Math.cos(ae);
    ctx.beginPath();ctx.moveTo(hx+tx*14,hy+ty*14);ctx.lineTo(hx-tx*6+Math.cos(ae)*11,hy-ty*6+Math.sin(ae)*11);ctx.lineTo(hx-tx*6-Math.cos(ae)*11,hy-ty*6-Math.sin(ae)*11);ctx.closePath();ctx.fill();}
  PF_STEPS.forEach((s,i)=>{const k=clamp(u*3-i,0,1);if(k<=0)return;lp_pill(ctx,cx+Math.cos(an[i])*r,cy+Math.sin(an[i])*r,s,{col:LP.blue,a:ag_sine(clamp(k*2,0,1)),k:k*1.2});});
  ctx.restore();}

/* ---------------------------------------------------------------- a page in the hand */
// a page held in the near hand, in figure space, its few lines of words too small to read (decoration)
function pf_held(o){o=o||{};return (c,h)=>{const [x,y]=h.near;c.save();c.translate(x+18,y-150);c.rotate(-0.08);c.shadowColor="rgba(46,38,28,0.28)";c.shadowBlur=12;c.shadowOffsetX=-5;c.shadowOffsetY=6;
  c.fillStyle=rgba(LP.paper,1);c.fillRect(0,0,150,200);c.shadowColor="transparent";c.fillStyle=rgba(LP.green,1);c.fillRect(0,0,150,8);
  c.fillStyle=rgba(LP.mut,0.35);for(let l=0;l<6;l++)c.fillRect(16,30+l*24,l%3===2?80:118,7);c.restore();};}
