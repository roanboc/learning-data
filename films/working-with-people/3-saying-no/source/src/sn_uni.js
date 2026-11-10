/* ===== Saying no, and what instead: the university, July to November 2027 =====
   The film's own pictures for the data team's summer (prefix sn_). The module's kit draws the rooms, the people, the sheets and the
   things in them, and is never changed for this film; what is here is this film's alone:
     snMorning, snMeet, snLate   the team's room on a Monday morning; the small meeting room where Helena and Noor sit down with Clara,
                                 at midday; the team's room in the late afternoon, for the dates kept
     sn_weeks(ctx, x, y, w, o)   August's four weeks for Jun and Noor, and the work asked of them: the rooms' data for the timetable
                                 change (three weeks), a new model (six, and time to test it, past the month's end), the current
                                 model refreshed (one)
     sn_list(ctx, x, y, w, o)    the team's one list, in the open: each ask with what it's for, its date and the weeks it takes, and
                                 the dates agreed, written in
     sn_kept(ctx, x, y, w, o)    the dates kept, along the wall: Friday 27 August, Friday 17 September, Friday 29 October
     sn_meet(ctx, t, o)          Helena, Noor and Clara at the meeting room's table, or Helena and Clara (o.who: SN_TWO)
   Colour keeps the module's meaning: orange data (the work on the data, the model, the rooms' data), blue plans (the dates offered
   and agreed), green what's done or kept, amber a cost or a risk (the weeks that don't fit, a yes nobody could keep). People wear
   none of them. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.snMorning=c=>lp_paintRoom(c,{light:"morning",seed:12});
AG_PLACES.snMeet=c=>lp_paintRoom(c,{light:"day",seed:14,base:[226,212,194]});
AG_PLACES.snLate=c=>lp_paintRoom(c,{light:"late",seed:12});
AG_ROOMS.snLate="snMorning";

/* ---------------------------------------------------------------- August's four weeks */
// o.span (4: only August's weeks; 7.6: room for the weeks a new model would run past the month); o.rooms, o.model, o.refresh (0 to
// 1: each block draws on from its start); o.over (0 to 1: the model's weeks past the month's end lit in amber); o.both (the first ask:
// the rooms' data and the model over the same weeks, no refresh); o.a, o.k, o.light. Returns its box
const SN_WK=["2 Aug","9 Aug","16 Aug","23 Aug"],SN_CW=170,SN_LW=300;
function sn_weeks(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,span=o.span||4,cw=SN_CW,gx=x+SN_LW,w=SN_LW+span*cw+40,h=o.both?390:470;if(a<=0.004)return{x,y,w,h};
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ctx.translate(0,(1-ag_spr(o.k,0,0.5))*-16);
  lp_sheet(ctx,x-30,y,w+30,h,{col:LP.orange,light:o.light,pin:false});
  lp_T(ctx,"JUN AND NOOR · AUGUST 2027",x+10,y+66,{w:800,size:28,ls:3,col:LP.orange});
  // the weeks, a column each, and the month's end
  for(let i=0;i<4;i++){const cx=gx+i*cw;ctx.fillStyle=rgba(LP.mut,i%2?0.05:0.1);ctx.fillRect(cx,y+96,cw-6,h-166);lp_T(ctx,SN_WK[i],cx+cw/2-3,y+134,{w:700,size:28,col:LP.mut,align:"center"});}
  const ex=gx+4*cw-3;ctx.strokeStyle=rgba(LP.ink,0.6);ctx.lineWidth=3;ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(ex,y+96);ctx.lineTo(ex,y+h-62);ctx.stroke();ctx.setLineDash([]);
  lp_T(ctx,"End of August",ex+16,y+h-26,{w:700,size:28,col:LP.ink,align:"right"});
  const bar=(ry,x0,x1,col,fillA,dash)=>{ctx.save();ctx.fillStyle=rgba(col,fillA);rr(ctx,x0,ry+8,Math.max(10,x1-x0),48,10);ctx.fill();
    if(dash){ctx.setLineDash([12,8]);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;rr(ctx,x0,ry+8,Math.max(10,x1-x0),48,10);ctx.stroke();}ctx.restore();};
  const row=(i,label,w0,w1,u)=>{if(u<=0.004)return null;const ry=y+166+i*84;lp_T(ctx,label,x+10,ry+42,{w:700,size:28,col:LP.ink,a:ag_sine(clamp(u*3,0,1))});
    bar(ry,gx+w0*cw,lerp(gx+w0*cw+10,gx+w1*cw-8,ag_sine(u)),LP.orange,0.9);return ry;};
  if(o.both){row(0,"The rooms' data",0,3,o.rooms||0);row(1,"A new model",0,4,o.model||0);}
  else{row(0,"The rooms' data",0,3,o.rooms||0);
    // the new model: six weeks and time to test it, so it runs on past the month's end; its weeks past it in amber
    const mu=o.model||0;if(mu>0.004){const ry=y+166+84,x1=lerp(gx+10,gx+7.4*cw,ag_sine(mu));lp_T(ctx,"A new model",x+10,ry+42,{w:700,size:28,col:LP.ink,a:ag_sine(clamp(mu*3,0,1))});
      bar(ry,gx,Math.min(x1,ex-4),LP.orange,0.9);const ov=clamp(o.over||0,0,1);if(x1>ex+6){ctx.save();ctx.globalAlpha*=lerp(0.5,1,ov);bar(ry,ex+4,x1,ov>0.02?LP.amber:LP.orange,ov>0.02?0.18:0.9,ov>0.02);ctx.restore();}}
    row(2,"The refresh",3,4,o.refresh||0);}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the one list */
// the rows the film follows, each ask with what it's for, its date and its weeks; o.rows (0 to 3: how many show, fractions fade in),
// o.dates (0 to 1: the dates agreed written in, in blue), o.tick (0 to 1: a tick for each, once agreed), o.hi ({row: a}: a row lit),
// o.unasked ({row: true}: what it's for not yet asked, as in the first chapter at the university, before Helena asks), o.a, o.k, o.light
const SN_ROWS=[
  {ask:"The rooms' data, for the timetable change",what:"The faculties plan 2028",date:"End of August",weeks:"3 weeks",agreed:"Fri 27 Aug"},
  {ask:"A new student forecast model",what:"Early warning, for admissions",date:"End of August",weeks:"6, and tests",agreed:"Fri 29 Oct"},
  {ask:"The current model, refreshed",what:"The 2028 budget",date:"",weeks:"1 week",agreed:"Fri 27 Aug"}];
function sn_list(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ctx.translate(0,(1-ag_spr(o.k,0,0.5))*-16);
  const nr=o.rows==null?3:o.rows,gap=i=>ag_sine(clamp((nr-i)*2,0,1)),h=170+[0,1,2].reduce((s,i)=>s+gap(i),0)*104+58;lp_sheet(ctx,x,y,w,h,{light:o.light,pin:false});
  lp_T(ctx,"THE ONE LIST · IN THE OPEN",x+40,y+66,{w:800,size:28,ls:3,col:LP.mut});
  const C=[x+40,x+w*0.44,x+w*0.74,x+w*0.88];
  for(const [i,s] of ["Ask","What it's for","Date","Weeks"].entries())lp_T(ctx,s,C[i],y+124,{w:800,size:28,col:LP.mut});
  ctx.fillStyle=rgba(LP.mut,0.3);ctx.fillRect(x+40,y+142,w-80,2);
  SN_ROWS.forEach((r,i)=>{const u=clamp((nr-i)*2-1,0,1);if(u<=0.004)return;const ry=y+150+i*104;ctx.save();ctx.globalAlpha*=ag_sine(u);
    const hi=(o.hi&&o.hi[i])||0;if(hi>0.004){ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(x+24,ry+6,w-48,92);ctx.fillStyle=rgba(LP.mut,0.1*hi);ctx.fillRect(x+24,ry+6,w-48,92);}
    const askL=lp_wrap(ctx,r.ask,C[1]-C[0]-30,{w:700,size:28});askL.forEach((l,k)=>lp_T(ctx,l,C[0],ry+46+k*36-(askL.length-1)*12,{w:700,size:28,col:LP.ink}));
    const un=o.unasked&&o.unasked[i],whatL=lp_wrap(ctx,un?"Not asked yet":r.what,C[2]-C[1]-30,{w:600,size:28});
    whatL.forEach((l,k)=>lp_T(ctx,l,C[1],ry+46+k*36-(whatL.length-1)*12,{w:600,size:28,col:un?LP.mut:LP.ink}));
    const dw=clamp(o.dates||0,0,1);
    if(r.date){ctx.save();ctx.globalAlpha*=1-0.6*dw;lp_T(ctx,r.date,C[2],ry+46-(dw>0?12:0)*0+0,{w:600,size:28,col:LP.mut});if(dw>0.004){ctx.strokeStyle=rgba(LP.mut,0.8);ctx.lineWidth=3;const tw=lp_tw(ctx,r.date,{w:600,size:28});ctx.beginPath();ctx.moveTo(C[2],ry+36);ctx.lineTo(C[2]+tw*ag_sine(dw),ry+36);ctx.stroke();}ctx.restore();}
    if(dw>0.004){ctx.save();ctx.globalAlpha*=ag_sine(dw);lp_T(ctx,r.agreed,C[2],ry+(r.date?84:46),{w:800,size:30,col:LP.blue});ctx.restore();}
    lp_T(ctx,r.weeks,C[3],ry+46,{w:600,size:28,col:LP.ink});
    ctx.fillStyle=rgba(LP.mut,0.16);ctx.fillRect(x+40,ry+102,w-80,2);ctx.restore();});
  lp_T(ctx,"Ordered by value, urgency, effort and risk",x+40,y+h-30,{w:600,size:28,col:LP.mut});
  const tk=clamp(o.tick||0,0,1);if(tk>0.004){ctx.save();ctx.globalAlpha*=ag_sine(tk);const f=lerp(0.6,1,ag_spr(tk*1.2,0,0.5));ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(x+w-56,y+58,26*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",x+w-56,y+58,34*f,[255,255,255]);ctx.restore();}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the dates kept */
// three dates along a line on the wall, each ticked green as it's kept; o.u (0 to 3: how far the line has run, fractions part way),
// o.a, o.light
const SN_KEPT=[{d:"Fri 27 Aug",l:["The refreshed model, to Planning","The rooms' data, to the registrar"]},{d:"Fri 17 Sep",l:["The budget closes,","with Planning's numbers"]},{d:"Fri 29 Oct",l:["The new model,","reviewed, in time"]}];
function sn_kept(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const u=clamp(o.u||0,0,3),step=w/3;
  ctx.strokeStyle=rgba(LP.ink,0.25);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.stroke();
  ctx.strokeStyle=rgba(LP.green,1);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.min(w,u*step),y);ctx.stroke();
  SN_KEPT.forEach((k,i)=>{const px=x+step*(i+0.5),v=clamp(u-i-0.35,0,0.65)/0.65;ctx.save();
    lp_T(ctx,k.d,px,y-60,{w:800,size:32,col:v>0.5?LP.green:LP.blue,align:"center"});
    ctx.fillStyle=rgba(LP.paper,1);ctx.beginPath();ctx.arc(px,y,24,0,TAU);ctx.fill();ctx.strokeStyle=rgba(v>0.5?LP.green:LP.blue,1);ctx.lineWidth=5;ctx.stroke();
    if(v>0.004){const f=lerp(0.6,1,ag_spr(v*1.4,0,0.5));ctx.globalAlpha*=ag_sine(v);ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(px,y,24*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",px,y,32*f,[255,255,255]);
      k.l.forEach((s,j)=>lp_T(ctx,s,px,y+70+j*38,{w:600,size:28,col:LP.ink,align:"center"}));}
    ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- Helena, Noor and Clara at the meeting room's table */
// o.lt (the place's light), o.a, o.who (who sits where), o.table ([x, y, w]); people cut at the table's back edge, the table over
// their hanging arms
// where they sit: Helena and Noor on one side, Clara across the table (SN_MEET); or Helena and Clara alone (SN_TWO). Each person is
// drawn whole and faded as one picture (lp_person's own a); lower and smaller than in the rooms, so the wall above holds the sheets
const SN_MEET=[["clara",1400,770,0.84,true],["helena",520,770,0.84,false],["noor",800,780,0.8,false]];
const SN_TWO=[["helena",600,770,0.84,false],["clara",1320,770,0.84,true]];
function sn_meet(ctx,t,o){o=o||{};const lt=o.lt||{light:"day"},a=o.a==null?1:o.a,tb=o.table||[330,858,1260];if(a<=0.004)return;
  for(const [k,px,py,sc,fl] of (o.who||SN_MEET))lp_person(ctx,k,px,py,sc,{t,flip:fl,cut:850,light:lt,a});
  ctx.save();ctx.globalAlpha*=a;lp_table(ctx,tb[0],tb[1],tb[2]);ctx.restore();}
