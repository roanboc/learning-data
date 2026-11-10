/* ===== Better every week: the university, September to December 2027 =====
   The film's own pictures at the university, on the module's kit (prefix bw_). Colour keeps the module's meaning: the Friday half-hour,
   the pocket card's steps, the rules and the procedures' pages in blue (method), a change kept and what got better in green, waiting and
   its cost in amber, the measures in orange; a change dropped is grey, neither good nor bad.
     bwFriday, bwMon  the team's room on a Friday afternoon (the late, low sun) and on a Monday morning
     bw_tracker      the tracker on a screen: a few requests, each with the days it waited for its first question
     bw_week         the week's calendar: the Friday half-hour, 15:30 to 16:00, kept for how the team works
     bw_pdca         plan, do, check, act: a ring of four arcs
     bw_steps        a request's first steps, a box each: it lands on the one list; it waits for Monday's planning; it goes to
                     someone; who reads it, and asks
     bw_fridays      fifteen Fridays, a chip each: kept (a green tick) or dropped (a grey cross)
     bw_pages        the six procedures' pages in a row, each with how many changes it kept
     bw_askPage      the ask procedure's page: its steps, the second rewritten, the date it changed and why */

AG_PLACES.bwFriday=c=>lp_paintRoom(c,{light:"late",seed:6});
AG_PLACES.bwMon=c=>lp_paintRoom(c,{light:"morning",seed:6});
const BW_GREY=[120,112,108];

/* ---------------------------------------------------------------- the tracker */
// on a screen (lp_screen's draw): o.title, o.rows [[request, days, colour, label]], o.max (the days a full bar stands for), o.u (0 to 1:
// the rows come in), o.bar (0 to 1: their bars grow), o.sum (0 to 1: the line under them), o.sumText, o.sumCol
function bw_tracker(cx,X,Y,Wd,Hd,o){o=o||{};const rows=o.rows||[],max=o.max||7,bx=X+560,bw=Wd-560-200;
  cx.fillStyle="#FBF9F4";cx.fillRect(X,Y,Wd,Hd);lp_T(cx,o.title||"The tracker",X+36,Y+58,{w:800,size:30,col:LP.mut});
  cx.fillStyle=rgba(LP.mut,0.25);cx.fillRect(X+36,Y+84,Wd-72,2);
  lp_T(cx,"Request",X+36,Y+132,{w:700,size:28,col:LP.mut});lp_T(cx,"Days to its first question",bx,Y+132,{w:700,size:28,col:LP.mut});
  rows.forEach(([name,days,col,lab],i)=>{const k=clamp((o.u==null?1:o.u)*rows.length-i,0,1);if(k<=0)return;const y=Y+206+i*92;cx.save();cx.globalAlpha*=ag_sine(k);
    lp_T(cx,name,X+36,y+10,{w:600,size:30});
    const g=clamp(o.bar==null?1:o.bar,0,1),L=Math.max(18,bw*days/max*ag_sine(g));cx.fillStyle=rgba(col,0.9);rr(cx,bx,y-18,L,34,8);cx.fill();
    if(g>0.6)lp_T(cx,lab||(days+" days"),bx+L+18,y+10,{w:800,size:28,col,a:clamp((g-0.6)/0.4,0,1)});cx.restore();});
  const s=clamp(o.sum||0,0,1);if(s>0)lp_T(cx,o.sumText||"",X+36,Y+Hd-48,{w:800,size:36,col:o.sumCol||LP.amber,a:s});}

/* ---------------------------------------------------------------- the Friday half-hour on the week's calendar */
// a sheet at (x, y), w wide: words {kick, title}; the week's afternoons, Monday to Friday, 14:00 to 17:00, a few grey meetings, and the
// half-hour on Friday from 15:30 in blue. o.u (0 to 1: the half-hour comes in), o.lit (0 to 1: it's picked out), light, a, k
const BW_DAYS=["Mon","Tue","Wed","Thu","Fri"];
function bw_week(ctx,x,y,w,words,o){o=o||{};const a=o.a==null?1:o.a,h=640,bb={x,y,w,h};if(a<=0.004)return bb;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});lp_label(ctx,x+44,y+84,words.kick,{col:LP.blue});lp_T(ctx,words.title,x+44,y+140,{w:800,size:40});
  const gx=x+130,gw=w-130-40,cw=gw/5,gy=y+250,ph=118;
  BW_DAYS.forEach((d,i)=>lp_T(ctx,d,gx+i*cw+cw/2,gy-22,{w:800,size:28,align:"center",col:i===4?LP.blue:LP.mut}));
  for(let hr=0;hr<=3;hr++){const yy=gy+hr*ph;lp_T(ctx,(14+hr)+":00",gx-24,yy+10,{w:600,size:28,align:"right",col:LP.mut});
    ctx.fillStyle=rgba(LP.mut,0.18);ctx.fillRect(gx,yy,gw,2);}
  ctx.fillStyle=rgba(LP.mut,0.12);for(let i=1;i<5;i++)ctx.fillRect(gx+i*cw,gy,2,ph*3);
  // the rest of the week: a few meetings, grey and nameless
  for(const [d,h0,h1] of [[0,0,1],[1,1.5,2.5],[2,0.5,1],[3,0,1],[3,2,2.5],[4,0,1]]){ctx.fillStyle=rgba(LP.mut,0.16);rr(ctx,gx+d*cw+8,gy+h0*ph+5,cw-16,(h1-h0)*ph-10,8);ctx.fill();}
  const u=clamp(o.u||0,0,1);if(u>0){const bx=gx+4*cw+8,by=gy+1.5*ph+5,bw2=cw-16,bh=ph/2-10,lit=clamp(o.lit||0,0,1);ctx.save();ctx.globalAlpha*=ag_sine(u);
    if(lit>0){ctx.strokeStyle=rgba(LP.blue,0.35*lit);ctx.lineWidth=10;rr(ctx,bx-6,by-6,bw2+12,bh+12,12);ctx.stroke();}
    ctx.fillStyle=rgba(LP.blue,1);rr(ctx,bx,by,bw2,bh,8);ctx.fill();lp_T(ctx,"How we work",bx+bw2/2,by+bh/2+10,{w:700,size:28,align:"center",col:[255,255,255]});
    lp_T(ctx,"15:30",bx+bw2/2,by+bh+38,{w:700,size:28,align:"center",col:LP.blue});ctx.restore();}
  ctx.restore();return bb;}

/* ---------------------------------------------------------------- plan, do, check, act */
// a ring of four arcs round (cx, cy), radius r, drawn clockwise from the top as u goes from 0 to 1, each named outside it; o.mid (0 to 1:
// the words in the middle), o.midText (a line, or a list of lines), o.a
const BW_PDCA=["Plan","Do","Check","Act"];
function bw_pdca(ctx,cx,cy,r,o){o=o||{};const a=o.a==null?1:o.a,u=clamp(o.u||0,0,1);if(a<=0.004||u<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";
  for(let i=0;i<4;i++){const k=clamp(u*4-i,0,1);if(k<=0)continue;const a0=-Math.PI/2+i*Math.PI/2+0.1,a1=a0+(Math.PI/2-0.2)*ag_sine(k);
    ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=14;ctx.beginPath();ctx.arc(cx,cy,r,a0,a1);ctx.stroke();
    if(k>=1){const hx=cx+Math.cos(a1)*r,hy=cy+Math.sin(a1)*r,t=a1+Math.PI/2;ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();
      ctx.moveTo(hx+Math.cos(t)*22,hy+Math.sin(t)*22);ctx.lineTo(hx+Math.cos(t+2.3)*20,hy+Math.sin(t+2.3)*20);ctx.lineTo(hx+Math.cos(t-2.3)*20,hy+Math.sin(t-2.3)*20);ctx.closePath();ctx.fill();}
    const am=-Math.PI/2+i*Math.PI/2+Math.PI/4,lx=cx+Math.cos(am)*(r+70),ly=cy+Math.sin(am)*(r+70);
    lp_T(ctx,BW_PDCA[i],lx,ly+12,{w:800,size:34,align:"center",col:LP.blue,a:ag_sine(k)});}
  const m=clamp(o.mid||0,0,1);if(m>0&&o.midText){const ls=[].concat(o.midText);ls.forEach((l,i)=>lp_T(ctx,l,cx,cy+12+(i-(ls.length-1)/2)*40,{w:700,size:30,align:"center",col:LP.ink,a:m}));}
  ctx.restore();}

/* ---------------------------------------------------------------- a request's first steps */
// four boxes in a row from (x, y), w wide in all, joined by arrows: o.u (one number a box, 0 to 1 each), o.amb (0 to 1: the wait for
// Monday's planning picked out in amber), o.a. Returns each box's middle
const BW_STEP=[["Lands on","the one list"],["Waits for","Monday's planning"],["Goes to","someone"],["Who reads it,","and asks"]];
function bw_steps(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,gap=60,bw=(w-gap*3)/4,h=170,mids=BW_STEP.map((_,i)=>[x+i*(bw+gap)+bw/2,y+h/2]);if(a<=0.004)return mids;ctx.save();ctx.globalAlpha*=a;
  BW_STEP.forEach((s,i)=>{const k=o.u?clamp(o.u[i],0,1):1;if(k<=0)return;const bx=x+i*(bw+gap),am=i===1?clamp(o.amb||0,0,1):0,col=mix(LP.blue,LP.amber,am);
    ctx.save();ctx.globalAlpha*=ag_sine(k);ag_about(ctx,bx+bw/2,y+h/2,lerp(0.8,1,ag_spr(k*0.6,0,0.5)));
    ctx.save();ctx.shadowColor="rgba(52,36,30,0.24)";ctx.shadowBlur=14;ctx.shadowOffsetX=LP.sdx*0.5;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(LP.paper,1);rr(ctx,bx,y,bw,h,14);ctx.fill();ctx.restore();
    if(am>0){ctx.fillStyle=rgba(LP.amber,0.1*am);rr(ctx,bx,y,bw,h,14);ctx.fill();}
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=4;rr(ctx,bx+2,y+2,bw-4,h-4,12);ctx.stroke();
    ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(bx+40,y+42,22,0,TAU);ctx.fill();lp_T(ctx,String(i+1),bx+40,y+52,{w:800,size:28,align:"center",col:[255,255,255]});
    s.forEach((l,j)=>lp_T(ctx,l,bx+bw/2,y+h/2+22+(j-(s.length-1)/2)*40,{w:800,size:30,align:"center",col:am>0.5?LP.amber:LP.ink}));
    ctx.restore();
    if(i<3&&k>=1){const nk=o.u?clamp(o.u[i+1],0,1):1;if(nk>0){const ax=bx+bw+10,ay=y+h/2;ctx.save();ctx.globalAlpha*=ag_sine(nk);ctx.strokeStyle=rgba(LP.blue,0.8);ctx.lineWidth=4;
      ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(ax+gap-26,ay);ctx.stroke();ctx.fillStyle=rgba(LP.blue,0.8);ctx.beginPath();ctx.moveTo(ax+gap-20,ay);ctx.lineTo(ax+gap-34,ay-10);ctx.lineTo(ax+gap-34,ay+10);ctx.closePath();ctx.fill();ctx.restore();}}});
  ctx.restore();return mids;}

/* ---------------------------------------------------------------- fifteen Fridays */
// fifteen chips in a row from (x, y), w wide: the change each Friday decided, from 10 September to 17 December; the second dropped. o.u
// (0 to 1: they're laid down, one after another), o.a
function bw_fridays(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const n=15,s=84,gap=(w-n*s)/(n-1),u=clamp(o.u==null?1:o.u,0,1);ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<n;i++){const k=clamp(u*(n+2)-i,0,1);if(k<=0)continue;const cx=x+i*(s+gap),drop=i===1,col=drop?BW_GREY:LP.green;ctx.save();ctx.globalAlpha*=ag_sine(k);
    ag_about(ctx,cx+s/2,y+s/2,lerp(0.7,1,ag_spr(k,0,0.5)));
    ctx.save();ctx.shadowColor="rgba(52,36,30,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=LP.sdx*0.4;ctx.shadowOffsetY=5;ctx.fillStyle=rgba(col,1);rr(ctx,cx,y,s,s,16);ctx.fill();ctx.restore();
    lp_icon(ctx,drop?"cross":"tick",cx+s/2,y+s/2,40,[255,255,255]);ctx.restore();}
  const e=clamp(u*(n+2)-n,0,1);if(e>0){lp_T(ctx,"10 Sep",x+s/2,y+s+44,{w:700,size:28,align:"center",col:LP.mut,a:e});lp_T(ctx,"17 Dec",x+w-s/2,y+s+44,{w:700,size:28,align:"center",col:LP.mut,a:e});}
  ctx.restore();}

/* ---------------------------------------------------------------- the six procedures' pages */
// six pages in a row from (x, y), w wide in all, each with its name and how many changes it kept by December (14 in all); o.u (0 to 1:
// the pages come in), o.n (0 to 1: the counts), o.hi (a page's index, picked out), o.light, o.a
const BW_PAGES=[["Ask",3],["Choose",2],["Build",4],["Release",2],["Fix",2],["Retire",1]];
function bw_pages(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const gap=36,pw=(w-gap*5)/6,ph=330,u=o.u==null?1:o.u,n=clamp(o.n||0,0,1);ctx.save();ctx.globalAlpha*=a;
  BW_PAGES.forEach(([nm,c],k)=>{const f=ag_spr(u*6-k*0.8,0,0.5);if(f<=0)return;const px=x+k*(pw+gap);ctx.save();ctx.globalAlpha*=Math.min(1,f);
    ag_about(ctx,px+pw/2,y+ph/2,lerp(0.7,1,Math.min(1,f)));lp_sheet(ctx,px,y,pw,ph,{col:LP.blue,light:o.light,pin:false});
    if(o.hi===k){ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=5;rr(ctx,px-8,y-8,pw+16,ph+16,12);ctx.stroke();}
    lp_T(ctx,nm,px+pw/2,y+92,{w:800,size:36,align:"center"});ctx.fillStyle=rgba(LP.mut,0.25);for(let i=0;i<4;i++)ctx.fillRect(px+pw*0.16,y+128+i*24,pw*(i%2?0.56:0.68),8);
    if(n>0){const kk=clamp(n*6-k,0,1);lp_T(ctx,c+" kept",px+pw/2,y+ph-44,{w:800,size:32,align:"center",col:LP.green,a:ag_sine(kk)});}
    ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the ask procedure's page */
// (x, y) its top left, w wide: its name, its three steps, the second rewritten on Friday 10 September, and the date and why under it.
// o.fix (0 to 1: the old second step struck out, then gone, then the new one written in its place), o.date (0 to 1: the date and why), o.u (0 to 1: the
// steps come in), o.hl (0 to 1: the new step picked out), light, a, k. Returns its box
const BW_ASK={steps:["Fill in the front door's form: five questions","Monday's planning gives it to someone, who reads it and asks","Monday's planning sets its place in the order"],
  fixed:"The next free person reads it the day it lands, and asks within a working day",date:"Changed Fri 10 Sep 2027",why:"Why: the first question took six working days"};
function bw_askPage(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,A=BW_ASK,inner=w-72,fx=clamp(o.fix||0,0,1),strike=clamp(fx*3,0,1),gone=ag_sine(clamp(fx*3-1,0,1)),nw=ag_sine(clamp(fx*3-2,0,1)),
    ol=lp_wrap(ctx,"2  "+A.steps[1],inner-10,{w:600,size:28}),fl=lp_wrap(ctx,"2  "+A.fixed,inner-10,{w:700,size:28}),
    s1=lp_wrap(ctx,"1  "+A.steps[0],inner-10,{w:600,size:28}),s3=lp_wrap(ctx,"3  "+A.steps[2],inner-10,{w:600,size:28}),
    l2=lerp(ol.length,fl.length,gone),h=410+(s1.length+l2+s3.length)*40,bb={x,y,w,h};
  if(a<=0.004)return bb;const u=o.u==null?1:o.u;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});let yy=y+80;
  lp_T(ctx,"ASK",x+36,yy,{w:800,size:28,ls:3,col:LP.blue});yy+=58;lp_T(ctx,"Ask for data",x+36,yy,{w:800,size:40});yy+=70;
  lp_T(ctx,"STEPS",x+36,yy,{w:800,size:28,ls:3,col:LP.mut});yy+=12;
  const step=(ls,k,col,wt,al)=>{ctx.save();ctx.globalAlpha*=al*ag_sine(clamp(u*3-k,0,1));ls.forEach((l,i)=>lp_T(ctx,l,x+36+(i?40:0),yy+40*(i+1),{w:wt,size:28,col}));ctx.restore();};
  step(s1,0,LP.ink,600,1);yy+=s1.length*40+10;
  // the second step: the old one, struck out and gone; the new one, written in its place, in green
  const hl=clamp(o.hl||0,0,1)*nw;if(hl>0){ctx.fillStyle=rgba(LP.green,0.12*hl);ctx.fillRect(x+20,yy+8,w-40,fl.length*40+12);}
  if(gone<1){step(ol,1,LP.ink,600,1-gone);if(strike>0){ctx.save();ctx.globalAlpha*=1-gone;ctx.strokeStyle=rgba(LP.ink,0.8);ctx.lineWidth=3;
    ol.forEach((l,i)=>{const lw=lp_tw(ctx,l,{w:600,size:28}),sx=x+36+(i?40:0),sy=yy+40*(i+1)-9,e=clamp(strike*ol.length-i,0,1);if(e>0){ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx+lw*e,sy);ctx.stroke();}});ctx.restore();}}
  if(nw>0)step(fl,1,LP.green,700,nw);yy+=l2*40+10;
  step(s3,2,LP.ink,600,1);yy+=s3.length*40+46;
  const d=clamp(o.date||0,0,1);if(d>0){ctx.fillStyle=rgba(LP.mut,0.22*d);ctx.fillRect(x+36,yy-30,w-72,2);
    lp_T(ctx,A.date,x+36,yy+14,{w:800,size:28,col:LP.green,a:d});lp_T(ctx,A.why,x+36,yy+54,{w:600,size:28,col:LP.mut,a:d});}
  ctx.restore();return bb;}
