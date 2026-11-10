/* ===== Explaining so people can decide: the university, May and June 2027 =====
   The team's rooms, Graham's office, the registrar's office and the University Council's room; Ivy's twelve-page draft, Minto's
   pyramid, Graham's one page, the week's picture (a heat map of the rooms booked, by day and hour), and the University Council's
   decision. The numbers are the module's (numbers.md): booked 38% of the week, 93% from 10:00 to 14:00 Tuesday to Thursday, about one
   hour in five at other times; in one booked hour in five nobody came.
   Every top-level name starts with ed_ or ED_. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.edLate=c=>lp_paintRoom(c,{light:"late",seed:4});                       // the team's room, late in the afternoon
AG_PLACES.edGraham=c=>lp_paintRoom(c,{light:"grey",seed:3});                     // Graham's office, on a grey day
AG_PLACES.edMei=c=>lp_paintRoom(c,{light:"day",seed:13,base:[218,210,194]});     // the registrar's office
AG_PLACES.edMorning=c=>lp_paintRoom(c,{light:"morning",seed:5});                 // the team's room, on a Monday morning
// the University Council's room: a darker lime above timber panelling
AG_PLACES.edCouncil=c=>{lp_paintRoom(c,{light:"day",seed:12,base:[214,202,184]});const top=520,bot=914;
  let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(mix(LP.timber,LP.shade,0.42),1));g.addColorStop(1,rgba(mix(LP.timber,LP.shade,0.18),1));c.fillStyle=g;c.fillRect(0,top,W,bot-top);
  for(let x=0;x<W;x+=240){c.fillStyle=rgba(LP.shade,0.16);c.fillRect(x,top,6,bot-top);c.strokeStyle="rgba(255,244,226,0.16)";c.lineWidth=2;c.strokeRect(x+30,top+36,180,bot-top-72);}
  c.fillStyle=rgba(mix(LP.timber,[255,250,240],0.1),1);c.fillRect(0,top-14,W,16);c.fillStyle=rgba(LP.shade,0.25);c.fillRect(0,top+2,W,8);
  lp_sun(c,LP_LIGHT.day.sun,{a:0.5,clip:x=>{x.beginPath();x.rect(0,top-14,W,bot-top+14);x.clip();}});};

/* ---------------------------------------------------------------- the week, booked: the numbers behind the picture
   Ten teaching hours (08:00 to 18:00) by five days, the share of the 186 rooms booked in each, Semester 2 2026's thirteen weeks: the
   peak, 10:00 to 14:00 Tuesday to Thursday, averages 93%; the other 38 hours average 20.6% (about one in five), low on Monday mornings
   and Friday afternoons; the whole week averages 38.0% (numbers.md). */
const ED_DAYS=["Mon","Tue","Wed","Thu","Fri"],ED_HOURS=["08","09","10","11","12","13","14","15","16","17"];
const ED_WEEK=[[6,16,34,42,40,38,30,22,10,4],[10,32,92,95,93,91,44,28,14,6],[10,32,94,96,93,92,42,26,13,5],[10,30,93,94,92,91,40,24,12,5],[6,20,32,34,28,18,10,6,3,2]];
const ed_peak=(d,h)=>d>=1&&d<=3&&h>=2&&h<=5;
// where a peak hour's moved classes go, on the same day: 10:00 to 09:00, 11:00 to 14:00, 12:00 to 15:00, 13:00 to 16:00
const ED_TO=[1,6,7,8];
// the heat map: each hour's square as dark as the share of rooms booked (orange: data). o.u fills it in, row by row; o.peak outlines
// the peak in amber; o.move (0 to 1) moves about one peak class in six to other hours (the peak falls to about 78%), and o.chips (0 to
// 1) flies them there; o.labels: false to leave the axes off; o.deco: every word is decoration (the picture drawn small, once it has
// been read at full size)
function ed_heat(c,x,y,cw,ch,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,mv=clamp(o.move||0,0,1),dz=o.deco?1:0;c.save();c.globalAlpha*=a;
  if(o.labels!==false){ED_DAYS.forEach((d,i)=>lp_T(c,d,x-16,y+i*ch+ch/2+10,{w:600,size:28,align:"right",col:LP.mut,deco:dz}));
    [0,2,4,6,8].forEach(h=>lp_T(c,ED_HOURS[h],x+h*cw,y-16,{w:600,size:28,align:"left",col:LP.mut,deco:dz}));}
  for(let d=0;d<5;d++)for(let h=0;h<10;h++){const fi=clamp(u*5.5-d-h*0.05,0,1);if(fi<=0)continue;let v=ED_WEEK[d][h]/100;
    // moving one peak class in six: each peak hour gives a sixth of its bookings to one hour off the peak on the same day (ED_TO)
    if(mv>0&&d>=1&&d<=3){if(ed_peak(d,h))v=v*(1-mv/6);else if(ED_TO.includes(h))v=Math.min(1,v+mv*0.93/6);}
    c.fillStyle=rgba(mix(LP.paper,LP.orange,Math.pow(v,0.85)),fi);rr(c,x+h*cw+2,y+d*ch+2,cw-4,ch-4,5);c.fill();}
  if(o.peak>0){c.save();c.globalAlpha*=o.peak;c.strokeStyle=rgba(LP.amber,1);c.lineWidth=6;rr(c,x+2*cw-4,y+ch-4,4*cw+8,3*ch+8,10);c.stroke();c.restore();}
  // the moved classes in flight (o.chips, 0 to 1): a chip from each peak hour to its hour off the peak, along a low arc, gone as it lands
  const fl=o.chips==null?0:o.chips;if(fl>0.004&&fl<0.999){for(let d=1;d<=3;d++)ED_TO.forEach((th,i)=>{const hh=2+i,q=clamp(fl*1.25-(d-1)*0.06-i*0.03,0,1);if(q<=0||q>=1)return;
      const e=ag_sine(q),cx=x+lerp(hh+0.5,th+0.5,e)*cw,cy=y+(d+0.5)*ch-Math.sin(Math.PI*e)*ch*0.7,al=Math.min(1,q/0.12,(1-q)/0.18),sw=cw*0.46,sh=ch*0.46;
      c.save();c.globalAlpha*=al;c.shadowColor="rgba(52,36,30,0.25)";c.shadowBlur=6;c.shadowOffsetY=3;c.fillStyle=rgba(LP.orange,1);rr(c,cx-sw/2,cy-sh/2,sw,sh,4);c.fill();
      c.shadowColor="transparent";c.strokeStyle=rgba(LP.paper,1);c.lineWidth=2;rr(c,cx-sw/2,cy-sh/2,sw,sh,4);c.stroke();c.restore();});}
  if(o.ring>0){c.save();c.globalAlpha*=o.ring;c.strokeStyle=rgba(LP.mut,0.9);c.lineWidth=4;c.setLineDash([10,8]);rr(c,x-4,y-4,2*cw+8,ch+8,10);c.stroke();rr(c,x+6*cw-4,y+4*ch-4,4*cw+8,ch+8,10);c.stroke();c.restore();}
  c.restore();}

/* ---------------------------------------------------------------- the page and its picture
   Graham's one page for the University Council, as Ivy writes it with Helena: the decision first (blue), then the answer to the
   agreed question in one sentence, then three lines; what isn't known (amber); the words its readers use; who would plan the change;
   and his name. o.p: how far each part has come in, 0 to 1 ({decision, answer, l1, l2, l3, meets, unknown, holds, words, which, sign});
   o.booked (0 to 1): the first line in the readers' words ("booked") instead of "utilisation"; o.word (0 to 1): "utilisation" lit
   amber; o.deco: the page drawn small, its words decoration. Returns the sheet's box. */
const ED_PAGE_W=900,ED_PAGE_H=752,ED_PAGE_MIN=440,ED_PAGE_GROW=[["answer",96],["l1",80],["l2",44],["l3",80],["meets",40],["unknown",50],["holds",36],["words",50],["which",96]];
function ed_page(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,P=o.p||{},w=ED_PAGE_W,dz=o.deco?1:0,pv=k=>clamp(P[k]==null?0:P[k],0,1);if(a<=0.004)return null;
  const h=o.h||Math.max(ED_PAGE_MIN,ED_PAGE_GROW.reduce((s,[k,dh])=>s+dh*pv(k),180));ed_pageH=h;const bb=lp_sheet(ctx,x,y,w,h,{a,k:o.k,light:o.light,pin:o.pin===true,col:LP.blue});ctx.save();ctx.globalAlpha*=a;const L=x+44;
  const line=(k,fn)=>{const v=pv(k);if(v>0.004){ctx.save();ctx.globalAlpha*=v;fn();ctx.restore();}},T_=(s2,xx,yy,q)=>lp_T(ctx,s2,xx,yy,Object.assign({w:600,size:28,deco:dz},q||{}));
  const dot=(col,yl)=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(L+8,yl-10,6,0,TAU);ctx.fill();};
  line("decision",()=>{T_("FOR DECISION \u00B7 THE UNIVERSITY COUNCIL, 24 JUNE",L,y+64,{w:700,ls:2.5,col:LP.blue});T_("A new teaching building now, or not yet?",L,y+114,{w:700,size:40});});
  line("sign",()=>{T_("From Graham Ellis, Director of Facilities",L,y+154,{col:LP.mut});});
  line("answer",()=>{T_("Rooms are short only from 10:00 to 14:00,",L,y+210,{w:800,size:32});T_("Tuesday to Thursday.",L,y+250,{w:800,size:32});});
  line("l1",()=>{dot(LP.orange,y+300);const b=clamp(o.booked||0,0,1),sw=clamp(o.word||0,0,1);
    // the first line, in "utilisation", then in the readers' words: the old leaves before the new comes, never both at once
    const oa=clamp(1-b*2,0,1),na=clamp(b*2-1,0,1);
    if(oa>0){ctx.save();ctx.globalAlpha*=oa;if(sw>0){const tw=lp_tw(ctx,"Utilisation",{w:600,size:28});ctx.fillStyle=rgba(LP.amber,0.3*sw);rr(ctx,L+28,y+270,tw+12,40,6);ctx.fill();}
      T_("Utilisation at the peak: 93%;",L+34,y+300);ctx.restore();}
    if(na>0){ctx.save();ctx.globalAlpha*=na;T_("At the peak, 93% of rooms are booked;",L+34,y+300);ctx.restore();}
    T_("at other hours, about 1 in 5",L+34,y+336);});
  line("l2",()=>{dot(LP.orange,y+380);T_("In 1 booked hour in 5, nobody came",L+34,y+380);});
  line("l3",()=>{dot(LP.blue,y+424);T_("Not to build: move about 1 peak class in 6, and release",L+34,y+424);T_("booked rooms nobody uses",L+34,y+460);});
  line("meets",()=>{T_("That meets Planning's forecast to 2030: 6% more students",L+34,y+500,{w:700,col:LP.green});});
  line("unknown",()=>{ctx.fillStyle=rgba(LP.amber,1);ctx.fillRect(L,y+522,6,pv("holds")>0?78:38);T_("Not known: how many students there will be by 2030",L+24,y+550,{w:700,col:LP.amber});});
  line("holds",()=>{T_("Growth twice as fast: the peak is no fuller than today",L+24,y+586);});
  line("words",()=>{T_("Booked: reserved for a class \u00B7 Used: people in it",L,y+636,{col:LP.mut});});
  line("which",()=>{T_("The registrar's office would plan which classes move,",L,y+680);T_("with the faculties, from Semester 1 2028",L,y+716);});
  ctx.restore();return bb;}
// one part of the page lit for a moment, while the voice says it: a soft band behind the line (col), from y0 to y1 on the page, never
// past the foot of the page as it was last drawn (ed_pageH: the page grows as it's written)
let ed_pageH=ED_PAGE_H;
function ed_pageLight(ctx,x,y,y0,y1,col,a){y1=Math.min(y1,ed_pageH-10);if(a<=0.004||y1<=y0+4)return;ctx.save();ctx.fillStyle=rgba(col,0.13*a);rr(ctx,x+24,y+y0,ED_PAGE_W-48,y1-y0,8);ctx.fill();ctx.restore();}
// the picture beside the page: the week's heat map on its own sheet, with the peak and what the rest of the week holds
function ed_picture(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const w=o.w||760,h=o.h||560,dz=o.deco?1:0,bb=lp_sheet(ctx,x,y,w,h,{a,k:o.k,light:o.light,pin:o.pin,col:LP.orange});
  ctx.save();ctx.globalAlpha*=a;lp_T(ctx,"THE WEEK, HOUR BY HOUR",x+40,y+70,{w:700,size:28,ls:2.5,col:LP.orange,deco:dz});lp_T(ctx,"Rooms booked",x+40,y+124,{w:700,size:40,deco:dz});
  const gx=x+130,gy=y+200,cw=(w-170)/10,ch=Math.min(o.ch||54,(h-300)/5);ed_heat(ctx,gx,gy,cw,ch,{u:o.u,peak:o.peak,move:o.move,chips:o.chips,deco:o.deco,ring:o.ring});
  const lab=o.labels==null?1:o.labels,av=o.avg==null?lab:o.avg;if(av>0)lp_T(ctx,"Week's average: 38%",x+w-40,y+124,{w:600,size:28,align:"right",col:LP.mut,a:av,deco:dz});
  if(lab>0){ctx.save();ctx.globalAlpha*=lab;
    const pk=o.peakLab==null?lab:o.peakLab,ot=o.otherLab==null?lab:o.otherLab;
    if(pk>0)lp_T(ctx,"93%",gx+4*cw,gy+2.5*ch+15,{w:800,size:44,align:"center",color:"rgba(255,255,255,"+(pk*ctx.globalAlpha)+")",deco:dz});
    if(ot>0)lp_T(ctx,"Other hours: about 1 in 5",gx,gy+5*ch+52,{w:600,size:28,col:LP.mut,a:ot,deco:dz});ctx.restore();}
  ctx.restore();return {bb,gx,gy,cw,ch};}


/* ---------------------------------------------------------------- Ivy's first draft: twelve pages, in the order of the work
   Small pages in a row; the first with the week's average as its chart; the ninth with the answer, lit when the voice says it. o.u
   spreads them; o.nine (0 to 1) lights page nine. */
function ed_draft(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,pw=104,ph=140,gap=20;ctx.save();ctx.globalAlpha*=a;
  for(let i=11;i>=0;i--){const tx=lerp(x,x+i*(pw+gap),ag_eo(clamp(u*1.4-i*0.035,0,1))),ty=y;const lit=i===8?clamp(o.nine||0,0,1):0;
    ctx.save();ctx.shadowColor="rgba(52,36,30,0.22)";ctx.shadowBlur=10;ctx.shadowOffsetX=LP.sdx*0.5;ctx.shadowOffsetY=5;ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(tx,ty,pw,ph);ctx.restore();
    if(lit>0){ctx.strokeStyle=rgba(LP.blue,lit);ctx.lineWidth=6;ctx.strokeRect(tx-3,ty-3,pw+6,ph+6);}
    ctx.strokeStyle=rgba(LP.mut,0.35);ctx.lineWidth=3;for(let k=0;k<7;k++){if(i===0&&k>=2&&k<=5)continue;ctx.beginPath();ctx.moveTo(tx+14,ty+22+k*16);ctx.lineTo(tx+(k%3===2?60:90),ty+22+k*16);ctx.stroke();}
    if(i===0){ctx.fillStyle=rgba(LP.orange,1);ctx.fillRect(tx+30,ty+66,26,40);ctx.fillStyle=rgba(LP.mut,0.4);ctx.fillRect(tx+14,ty+106,76,3);}
    if(i===8){ctx.fillStyle=rgba(LP.blue,0.85);ctx.fillRect(tx+14,ty+52,76,12);}}
  ctx.restore();}

/* ---------------------------------------------------------------- the pyramid (after Barbara Minto)
   The answer at the top, the reasons under it, the evidence under each: boxes in blue (a design for a page). u builds it, top down. */
function ed_pyramid(ctx,cx,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u;ctx.save();ctx.globalAlpha*=a;
  const box=(bx,by,bw,bh,txt,al,solid)=>{if(al<=0.004)return;ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=solid?rgba(LP.blue,1):rgba(mix(LP.paper,LP.blue,0.08),1);ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=4;rr(ctx,bx,by,bw,bh,10);ctx.fill();ctx.stroke();
    if(txt)lp_T(ctx,txt,bx+bw/2,by+bh/2+11,{w:700,size:30,align:"center",col:solid?[255,255,255]:LP.blue});ctx.restore();};
  const l=(x0,y0,x1,y1,al)=>{if(al<=0.004)return;ctx.save();ctx.globalAlpha*=al;ctx.strokeStyle=rgba(LP.blue,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();};
  const a1=clamp(u*3,0,1),a2=clamp(u*3-1,0,1),a3=clamp(u*3-2,0,1);
  box(cx-170,y,340,72,"The answer",a1,true);
  [-1,0,1].forEach((k,i)=>{l(cx,y+72,cx+k*240,y+150,a2);box(cx+k*240-100,y+150,200,64,"A reason",a2,false);
    [-1,1].forEach(s=>{l(cx+k*240,y+214,cx+k*240+s*58,y+282,a3);box(cx+k*240+s*58-46,y+282,92,52,"",a3,false);});});
  if(a3>0)lp_T(ctx,"The evidence under each",cx,y+390,{w:600,size:28,align:"center",col:LP.mut,a:a3});
  ctx.restore();}

/* ---------------------------------------------------------------- a route on one picture, for anything that crosses teams */
function ed_route(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,S=[["The timetable",LP.orange],["The sensors",LP.orange],["The models",LP.orange],["Graham's page",LP.blue]];
  ctx.save();ctx.globalAlpha*=a;S.forEach(([s,col],i)=>{const al=clamp(u*4-i,0,1);if(al<=0.004)return;const bx=x+i*262,bw=222;ctx.save();ctx.globalAlpha*=al;ctx.fillStyle=rgba(LP.paper,1);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;rr(ctx,bx,y,bw,76,10);ctx.fill();ctx.stroke();
    lp_T(ctx,s,bx+bw/2,y+48,{w:700,size:28,align:"center",col:LP.ink});if(i>0){ctx.strokeStyle=rgba(LP.mut,0.8);ctx.fillStyle=rgba(LP.mut,0.8);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(bx-36,y+38);ctx.lineTo(bx-8,y+38);ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx-4,y+38);ctx.lineTo(bx-16,y+30);ctx.lineTo(bx-16,y+46);ctx.closePath();ctx.fill();}ctx.restore();});ctx.restore();}

/* ---------------------------------------------------------------- five squares, one empty: in one booked hour in five, nobody came */
function ed_fifth(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<5;i++){const al=clamp(u*5-i,0,1);if(al<=0.004)continue;ctx.save();ctx.globalAlpha*=al;rr(ctx,x+i*84,y,70,70,8);if(i<4){ctx.fillStyle=rgba(LP.orange,1);ctx.fill();}else{ctx.strokeStyle=rgba(LP.orange,1);ctx.lineWidth=5;ctx.stroke();}ctx.restore();}ctx.restore();}

/* ---------------------------------------------------------------- a long table in the University Council's room, seen from the front */
function ed_councilTable(ctx,x,y,w,o){return lp_table(ctx,x,y,w,Object.assign({depth:80,floor:1000},o||{}));}
// a stack of papers on a table, the top one's title showing (o.title), o.n sheets
function ed_pile(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const n=Math.round(o.n||14),w=o.w||300;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<n;i++){const yy=y-i*7,dx=Math.sin(i*2.1)*6;ctx.fillStyle=rgba(mix(LP.paper,LP.shade,i%2?0.08:0.03),1);ctx.fillRect(x+dx,yy-6,w,7);ctx.fillStyle=rgba(LP.shade,0.12);ctx.fillRect(x+dx,yy,w,1.5);}
  ctx.restore();}
