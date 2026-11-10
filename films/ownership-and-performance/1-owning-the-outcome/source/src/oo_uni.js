/* ===== Owning the outcome: the university, 2027 =====
   The film's own pictures for Ivy's data product and its Monday (prefix oo_). The module's kit draws the rooms, the people, the sheets
   and the things in them, and is never changed for this film; what is here is this film's alone:
     ooMorning, ooWork, ooOne      the team's room on a Monday morning; the small room where Ivy works with Sam and Jun, by day; Helena's
                                   room, where she holds her one-to-ones, in the late afternoon
     oo_rooms(ctx, x, y, o)        the 186 teaching rooms, a square each: the 40 whose sensors were upgraded, marked, then amber where
                                   their counts dropped, and crossed where the timetable team would release them
     oo_hour(ctx, x, y, o)         one hour of a room's counts: the old sensors' one, the new sensors' four
     oo_chart(ctx, x, y, w, h, o)  the people counted each teaching day in those 40 rooms, 2 to 20 August 2027: the drop from Tuesday
                                   17 August, and the days run again
     oo_empty(ctx, x, y, o)        booked hours with nobody in them, in those rooms: one in five before, more than half after
     oo_feed(ctx, x, y, o)         one room's feed for one hour, Monday 23 August: four counts, the one the model kept, the one it keeps now
     oo_raci(ctx, x, y, o)         the product's line in a RACI chart: three who do part of the work, one who answers for it
     oo_check(ctx, x, y, o)        Ivy's new check: a room's counts against its own last four weeks, and a drop that holds the refresh
     oo_status(ctx, x, y, w, h, o) what the screen on the wall shows on a Monday: the refresh, its checks, and the counts it loaded
   Colour keeps the module's meaning: orange the data (the counts), amber the risk (the drop, the rooms that would be lost, the refresh
   held), green what's done or of value (the refresh that ran, the fix reviewed, the right counts), blue plans and rules (the product's
   promise, the timetable change, the new rule with Facilities, the check). People and the rooms' walls wear none of them. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.ooMorning=c=>lp_paintRoom(c,{light:"morning",seed:4});
AG_PLACES.ooWork=c=>lp_paintRoom(c,{light:"day",seed:12,base:[220,206,188]});
AG_PLACES.ooOne=c=>lp_paintRoom(c,{light:"late",seed:9,base:[222,206,190]});

/* ---------------------------------------------------------------- the 186 rooms */
// which 40 of the 186 had their sensors upgraded: spread across the campus, the same in every frame
const OO_UP=(()=>{const R=ag_rnd(1708),s=new Set();while(s.size<40)s.add((R()*186)|0);return s;})();
// o: mark (0 to 1, the 40 marked with a new sensor's dot), amber (0 to 1, the 40 turn amber), lose (0 to 1, a cross on each: rooms the
// timetable team would release), right (0 to 1, back to plain once their counts are right), a, light; a sheet 1240 x 330
function oo_rooms(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+620,y+165,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,1240,330,{light:o.light,pin:false});
  lp_label(ctx,x+40,y+62,"186 teaching rooms",{col:LP.mut});
  const am=clamp(o.amber||0,0,1)*(1-clamp(o.right||0,0,1)),mk=clamp(o.mark||0,0,1),ls=clamp(o.lose||0,0,1)*(1-clamp(o.right||0,0,1));
  for(let i=0;i<186;i++){const cx=x+44+(i%31)*37.4,cy=y+100+Math.floor(i/31)*36,up=OO_UP.has(i);
    ctx.fillStyle=rgba(up&&am>0?mix(mix(LP.wall,LP.paper,0.3),LP.amber,am):mix(LP.wall,LP.paper,0.3),1);ctx.fillRect(cx,cy,30,28);
    ctx.strokeStyle=rgba(LP.mut,0.25);ctx.lineWidth=1.5;ctx.strokeRect(cx,cy,30,28);
    if(up&&mk>0.004){ctx.fillStyle=rgba(am>0.5?[255,255,255]:LP.ink,mk);ctx.beginPath();ctx.arc(cx+15,cy+14,4.5,0,TAU);ctx.fill();}
    if(up&&ls>0.004){ctx.strokeStyle=rgba([255,255,255],ls);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx+7,cy+6);ctx.lineTo(cx+23,cy+22);ctx.moveTo(cx+23,cy+6);ctx.lineTo(cx+7,cy+22);ctx.stroke();}}
  ctx.restore();}

/* ---------------------------------------------------------------- one hour of counts */
// a line for the hour from 09:00 to 10:00, and under it the old sensors' one count (the hour's highest, sent at its end) and the new
// sensors' four, one each quarter of an hour. o: old (0 to 1), nw (0 to 1, the four come in one by one), a, light; a sheet 900 x 330
function oo_hour(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+450,y+165,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,900,330,{light:o.light,pin:false,col:LP.orange});
  lp_label(ctx,x+40,y+66,"One room, one hour",{col:LP.orange});
  const x0=x+310,x1=x+840,X=f=>lerp(x0,x1,f);
  ctx.strokeStyle=rgba(LP.mut,0.5);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y+120);ctx.lineTo(x1,y+120);ctx.stroke();
  for(const [f,s] of [[0,"09:00"],[1,"10:00"]]){ctx.beginPath();ctx.moveTo(X(f),y+110);ctx.lineTo(X(f),y+130);ctx.stroke();lp_T(ctx,s,X(f),y+104,{w:600,size:28,col:LP.mut,align:"center"});}
  const dot=(f,yy,u)=>{if(u<=0.004)return;const r=lerp(4,13,ag_spr(u,0,0.5));ctx.fillStyle=rgba(LP.orange,1);ctx.beginPath();ctx.arc(X(f),yy,r,0,TAU);ctx.fill();};
  const ol=clamp(o.old||0,0,1);if(ol>0.004){ctx.save();ctx.globalAlpha*=ag_sine(ol);lp_T(ctx,"Old sensors",x+40,y+196,{w:700,size:30});ctx.restore();dot(1,y+186,ol);}
  const nw=clamp(o.nw||0,0,1);if(nw>0.004){ctx.save();ctx.globalAlpha*=ag_sine(nw*3);lp_T(ctx,"New sensors",x+40,y+276,{w:700,size:30});ctx.restore();for(let i=0;i<4;i++)dot(i/4,y+266,clamp(nw*4-i,0,1));}
  ctx.restore();}

/* ---------------------------------------------------------------- the people counted each day in the 40 rooms */
// teaching days from Monday 2 August to Friday 20 August 2027 (the weeks the Monday refresh has loaded by the 23rd); from Tuesday 17
// August (day 11) the counts fall to about a quarter. The values are people counted in a day, across the 40 rooms
const OO_DAYS=[9640,9810,9720,9380,8460,9590,9880,9700,9450,8520,9620,2460,2510,2390,2180],OO_FIXED=[9620,9790,9640,8610];
// o: u (0 to 1, the line draws on), drop (0 to 1, the drop's days shaded amber), fixed (0 to 1, the days since Tuesday run again: the
// line back up), vals (show the levels), a, k, light
function oo_chart(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:o.light,pin:false});
  lp_T(ctx,"PEOPLE COUNTED EACH DAY · THE 40 ROOMS",x+40,y+66,{w:800,size:28,ls:3,col:LP.orange});
  const px0=x+150,px1=x+w-60,py0=y+130,py1=y+h-96,n=OO_DAYS.length,X=i=>lerp(px0,px1,i/(n-1)),Y=v=>lerp(py1,py0,v/11000);
  ctx.strokeStyle=rgba(LP.mut,0.3);ctx.lineWidth=2;for(const v of [0,5000,10000]){ctx.beginPath();ctx.moveTo(px0,Y(v));ctx.lineTo(px1,Y(v));ctx.stroke();lp_T(ctx,v?v.toLocaleString("en-GB"):"0",px0-22,Y(v)+10,{w:600,size:28,col:LP.mut,align:"right"});}
  for(const [i,s] of [[0,"2 Aug"],[11,"Tue 17"],[14,"20 Aug"]])lp_T(ctx,s,X(i),py1+48,{w:600,size:28,col:i===11&&(o.drop||0)>0.5?LP.amber:LP.mut,align:"center"});
  // the drop's days, shaded
  const dr=clamp(o.drop||0,0,1)*(1-clamp(o.fixed||0,0,1));if(dr>0.004){ctx.fillStyle=rgba(LP.amber,0.16*dr);ctx.fillRect(X(10.5),py0-10,px1-X(10.5)+20,py1-py0+10);}
  // the line, drawn on day by day; the days since Tuesday rise back as they're run again
  const fx=clamp(o.fixed||0,0,1),vals=OO_DAYS.map((v,i)=>i>=11?lerp(v,OO_FIXED[i-11],ag_sine(clamp(fx*1.6-(i-11)*0.2,0,1))):v),m=clamp(o.u==null?1:o.u,0,1)*(n-1);
  ctx.save();ctx.strokeStyle=rgba(LP.orange,1);ctx.lineWidth=7;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
  for(let i=0;i<=Math.floor(m);i++){i?ctx.lineTo(X(i),Y(vals[i])):ctx.moveTo(X(i),Y(vals[i]));}
  const f=m-Math.floor(m);if(f>0&&Math.floor(m)<n-1){const i=Math.floor(m);ctx.lineTo(lerp(X(i),X(i+1),f),lerp(Y(vals[i]),Y(vals[i+1]),f));}ctx.stroke();
  for(let i=0;i<=Math.floor(m);i++){ctx.fillStyle=rgba(i>=11&&dr>0.5?LP.amber:LP.orange,1);ctx.beginPath();ctx.arc(X(i),Y(vals[i]),i===10||i===11?9:6,0,TAU);ctx.fill();}ctx.restore();
  // the levels: about 9,600 a day, then about 2,400: a quarter
  const va=clamp(o.vals||0,0,1);if(va>0.004&&m>=n-1){ctx.save();ctx.globalAlpha*=va*(1-fx);lp_T(ctx,"About 9,600",X(4),Y(9700)-26,{w:800,size:30,col:LP.orange,align:"center"});
    lp_T(ctx,"About 2,400",X(12.6),Y(2400)-28,{w:800,size:30,col:LP.amber,align:"center"});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- booked hours with nobody in them */
// two bars on a sheet: in those 40 rooms, before the drop (one in five) and after (more than half). o: u (0 to 1), a, k, light; 620 x 520
function oo_empty(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+310,y+260,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,620,520,{col:LP.amber,light:o.light,pin:false});
  lp_T(ctx,"BOOKED, NOBODY IN",x+40,y+66,{w:800,size:28,ls:3,col:LP.amber});
  const base=y+420,top=y+150,H_=base-top,u=clamp(o.u==null?1:o.u,0,1);
  for(const [i,v,lab,show,col] of [[0,0.21,"Before",(o.u2==null?1:o.u2),LP.orange],[1,0.56,"From the 17th",u,LP.amber]]){const bx=x+110+i*250,bh=H_*v*ag_sine(clamp(show,0,1));
    ctx.fillStyle=rgba(col,1);ctx.fillRect(bx,base-bh,150,bh);lp_T(ctx,lab,bx+75,base+46,{w:600,size:28,col:LP.mut,align:"center"});
    if(show>0.6)lp_T(ctx,i?"More than half":"1 in 5",bx+75,base-bh-20,{w:800,size:30,col:col,align:"center",a:clamp((show-0.6)/0.4,0,1)});}
  ctx.strokeStyle=rgba(LP.mut,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+70,base);ctx.lineTo(x+570,base);ctx.stroke();
  ctx.restore();}

/* ---------------------------------------------------------------- one room's feed for an hour */
// Monday 23 August, room 1.02: the four counts that arrived; o.first (0 to 1: the model kept the first, the others struck through),
// o.max (0 to 1: the fix keeps the highest), a, k, light; a sheet 640 x 450
const OO_FEED=[["09:00","4"],["09:15","38"],["09:30","41"],["09:45","40"]];
function oo_feed(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+320,y+225,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,640,450,{col:LP.orange,light:o.light,pin:false});
  lp_T(ctx,"ROOM 1.02 · MONDAY 23 AUGUST",x+40,y+66,{w:800,size:28,ls:3,col:LP.orange});
  lp_T(ctx,"Arrived",x+60,y+126,{w:600,size:28,col:LP.mut});lp_T(ctx,"People",x+400,y+126,{w:600,size:28,col:LP.mut});
  const fi=clamp(o.first||0,0,1),mx=clamp(o.max||0,0,1),u=clamp(o.u==null?1:o.u,0,1);
  OO_FEED.forEach(([tm,n],i)=>{const ry=y+186+i*62,ra=ag_sine(clamp(u*4-i,0,1));if(ra<=0.004)return;ctx.save();ctx.globalAlpha*=ra;
    // the row the model keeps: the first, until the fix; the highest after it
    const keepA=i===0?fi*(1-mx):i===2?mx:0;if(keepA>0.004){ctx.fillStyle=rgba(i===0?LP.amber:LP.green,0.16*keepA);ctx.fillRect(x+36,ry-42,568,58);ctx.fillStyle=rgba(i===0?LP.amber:LP.green,keepA);ctx.fillRect(x+36,ry-42,8,58);}
    const dim=(i>0?fi*(1-mx):0)+(i!==2?mx:0)*(i===0?1:1);const col=mix(LP.ink,mix(LP.mut,LP.paper,0.35),clamp(dim,0,1)*0.75);
    lp_T(ctx,tm,x+60,ry,{w:600,size:32,f:"mono",color:rgba(col,1)});lp_T(ctx,n,x+440,ry,{w:800,size:34,f:"mono",color:rgba(col,1),align:"right"});
    if(dim>0.004){ctx.strokeStyle=rgba(LP.mut,0.7*clamp(dim,0,1));ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+56,ry-12);ctx.lineTo(x+56+lerp(0,400,clamp(dim,0,1)),ry-12);ctx.stroke();}
    ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the product's line in a RACI chart */
// four people across, one line of work: who's responsible for a part (R) and who's accountable for the outcome (A, only one). o: r (0 to
// 1, the three Rs come in), aa (0 to 1, Ivy's A), a, k, light; a sheet 1120 x 330
function oo_raci(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+560,y+165,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,1120,330,{light:o.light,pin:false,col:LP.blue});
  lp_T(ctx,"RACI · TEACHING SPACE USE",x+40,y+66,{w:800,size:28,ls:3,col:LP.blue});
  const cols=[["Facilities","The sensors"],["Sam","The platform"],["Jun","Reviews"],["Ivy","The outcome"]];
  cols.forEach(([who,what],i)=>{const cx=x+155+i*270;lp_T(ctx,who,cx,y+130,{w:800,size:32,align:"center"});lp_T(ctx,what,cx,y+170,{w:600,size:28,col:LP.mut,align:"center"});
    ctx.strokeStyle=rgba(LP.mut,0.25);ctx.lineWidth=2;if(i)ctx.beginPath(),ctx.moveTo(cx-135,y+100),ctx.lineTo(cx-135,y+300),ctx.stroke();
    const u=i<3?clamp((o.r||0)*3-i,0,1):clamp(o.aa||0,0,1);if(u<=0.004)return;const f=lerp(0.5,1,ag_spr(u,0,0.5));ctx.save();ctx.globalAlpha*=ag_sine(u);ctx.translate(cx,y+248);ctx.scale(f,f);
    if(i<3){lp_T(ctx,"R",0,22,{w:800,size:56,col:LP.ink,align:"center"});}
    else{ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(0,0,44,0,TAU);ctx.fill();lp_T(ctx,"A",0,20,{w:800,size:56,color:"#fff",align:"center"});}ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- Ivy's check */
// one room's people a day over its own last four weeks: its usual range, a band; today's count, and when it falls far below the band, the
// refresh held. o: u (0 to 1, the weeks draw on), today (0 to 1), held (0 to 1), a, k, light; a sheet 760 x 450
const OO_WEEKS=[212,226,198,231,219,204,228,216,190,223,230,208,221,214,201,226,218,233,207,224];
function oo_check(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+380,y+225,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,760,450,{col:LP.blue,light:o.light,pin:false});
  lp_T(ctx,"A NEW CHECK · EACH ROOM",x+40,y+66,{w:800,size:28,ls:3,col:LP.blue});
  lp_T(ctx,"Against its own last four weeks",x+40,y+110,{w:600,size:28,col:LP.mut});
  const px0=x+60,px1=x+520,py0=y+150,py1=y+410,n=OO_WEEKS.length,X=i=>lerp(px0,px1,i/(n-1)),Y=v=>lerp(py1,py0,v/300),u=clamp(o.u==null?1:o.u,0,1),tx=px1+110;
  // the floor of the chart, faint
  ctx.strokeStyle=rgba(LP.mut,0.3*u);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px0,Y(0));ctx.lineTo(tx+60,Y(0));ctx.stroke();
  // the usual range, a band, named
  ctx.fillStyle=rgba(LP.blue,0.14*u);ctx.fillRect(px0,Y(240),tx+60-px0,Y(185)-Y(240));
  ctx.strokeStyle=rgba(LP.blue,0.6*u);ctx.lineWidth=2.5;ctx.setLineDash([10,8]);for(const v of [185,240]){ctx.beginPath();ctx.moveTo(px0,Y(v));ctx.lineTo(tx+60,Y(v));ctx.stroke();}ctx.setLineDash([]);
  if(u>0.004)lp_T(ctx,"Its usual range",px0,Y(240)-16,{w:600,size:28,col:LP.blue,a:u});
  const m=u*(n-1);for(let i=0;i<=Math.floor(m);i++){ctx.fillStyle=rgba(LP.orange,1);ctx.beginPath();ctx.arc(X(i),Y(OO_WEEKS[i]),6,0,TAU);ctx.fill();}
  // today: it falls far below the band, and the fall is drawn
  const td=clamp(o.today||0,0,1);if(td>0.004){const ty=Y(lerp(220,56,ag_sine(td))),dk=td>0.6;
    if(dk){ctx.strokeStyle=rgba(LP.amber,0.8*clamp((td-0.6)/0.4,0,1));ctx.lineWidth=3;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(tx,Y(185)+8);ctx.lineTo(tx,ty-16);ctx.stroke();ctx.setLineDash([]);}
    ctx.fillStyle=rgba(dk?LP.amber:LP.orange,1);ctx.beginPath();ctx.arc(tx,ty,12,0,TAU);ctx.fill();
    if(td>0.7)lp_T(ctx,"Today",tx-30,ty+10,{w:700,size:28,col:LP.amber,align:"right",a:clamp((td-0.7)/0.3,0,1)});}
  ctx.restore();}

/* ---------------------------------------------------------------- the screen on the wall, on a Monday */
// the refresh's line, its checks, and small bars of the week's counts; o: ran (0 to 1), checks (0 to 1), bars (0 to 1), a
function oo_status(ctx,x,y,w,h,o){o=o||{};lp_screen(ctx,x,y,w,h,{a:o.a,draw:(c,gx,gy,gw,gh)=>{
  lp_T(c,"TEACHING SPACE USE",gx+36,gy+60,{w:800,size:28,ls:3,col:LP.orange});
  lp_T(c,o.when||"Monday 23 August, 07:00",gx+36,gy+108,{w:700,size:30});
  const ra=clamp(o.ran||0,0,1),ch=clamp(o.checks||0,0,1),ba=clamp(o.bars||0,0,1);
  if(ra>0.004)lp_pill(c,gx+36+150,gy+180,"Refreshed",{col:LP.green,icon:"tick",size:28,a:ra,k:o.kRan});
  if(ch>0.004)lp_pill(c,gx+36+170,gy+260,"Every check passed",{col:LP.green,icon:"tick",size:28,a:ch,k:o.kCh});
  if(ba>0.004){const bx=gx+gw-300,by=gy+300,vals=[0.92,0.95,0.9,0.88,0.8];c.save();c.globalAlpha*=ba;vals.forEach((v,i)=>{const bh=170*v*ag_sine(ba);c.fillStyle=rgba(LP.orange,1);c.fillRect(bx+i*52,by-bh,36,bh);});c.restore();}}});}
