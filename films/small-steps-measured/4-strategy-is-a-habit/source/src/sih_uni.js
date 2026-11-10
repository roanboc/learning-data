/* ===== Strategy is a habit: the university, April 2027 to January 2028 =====
   The film's own pictures at the university, on the module's kit (prefix sih_). Colour keeps the module's meaning: the strategy, its
   reviews, the roadmap and Noor's map in blue (plans and design); what was delivered and a review that held in green; the measures'
   numbers in orange (data); the risks, what waits and what didn't work in amber. The people wear none of the five.
     sihApril, sihJuly, sihOct, sihJan   the team's rooms in each review's light: autumn's late sun, winter's grey, spring's morning,
                   summer's day (the university is in the south: July is winter)
     sih_council   the data council as the strategy's steering group: the deputy vice-chancellor and Helena behind its table, Noor too
     sih_page      the data strategy on one page: six parts, three of them marked as Rumelt's core when o.core says
     sih_cal       the year's reviews in the calendar: three steering groups and the first year's review
     sih_measures  the measures page's first readings, July 2027: days from ask to first use
     sih_risks     the risk register: three of its eight risks, each with its early sign
     sih_history   the map's history in the repository since June, on a screen: what changed, and why
     sih_roadmap   the six packages of work on a timeline, July 2027 to March 2028: one part of package 4 moves up, package 6 waits
     sih_target    Noor's map on a screen: the target, and the online courses' platform added to it with its reason
     sih_ledger    the first year's review: what the strategy promised, beside what was delivered
     sih_list      a numbered list on one sheet: what to do on Monday
     sih_loop      the module's loop: discover, define, plan; deliver, measure, improve; and again */

AG_PLACES.sihApril=c=>lp_paintRoom(c,{light:"late",seed:21});
AG_PLACES.sihJuly=c=>lp_paintRoom(c,{light:"grey",seed:22});
AG_PLACES.sihOct=c=>lp_paintRoom(c,{light:"morning",seed:23});
AG_PLACES.sihJan=c=>lp_paintRoom(c,{light:"day",seed:24});

// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function sih_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
const sih_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
function sih_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function sih_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a sheet drawn by fn(ctx, a, k) that springs in at t0 and leaves from out
function sih_card(ctx,t,t0,out,fn){const a=ag_in(t,t0,0.35)*(out!=null?1-ag_in(t,out,0.4):1);if(a<=0.004)return;fn(a,t-t0);}

/* ---------------------------------------------------------------- the council, as the strategy's steering group */
const SIH_TABLE={x:1290,y:790,w:560};
// o.who: the people at the table, by name, from the left; o.a: theirs (an array, one each, or one number); o.light
function sih_council(ctx,t,o){o=o||{};const who=o.who||["david","helena"],n=who.length,cut=SIH_TABLE.y-6,lt={light:o.light||"day"};
  const xs=n===3?[1390,1580,1770]:[1450,1700];
  who.forEach((p,i)=>{const a=Array.isArray(o.a)?o.a[i]:(o.a==null?1:o.a);if(a>0.004)lp_person(ctx,p,xs[i],SIH_TABLE.y-172,0.86,{t,flip:true,cut,a,light:lt});});
  const ta=o.table==null?1:o.table;lp_table(ctx,SIH_TABLE.x,SIH_TABLE.y,SIH_TABLE.w,{a:ta,depth:56});}

/* ---------------------------------------------------------------- the strategy on one page */
const SIH_PAGE=["Where the university is going","What data must do for it","Five principles","The target","Six packages of work","The measures"];
const SIH_CORE=[[1,"A diagnosis"],[2,"A guiding policy"],[4,"Actions that fit together"]];
// o.u: the parts come in (0 to 1); o.core (0 to 1): Rumelt's three parts beside the page; o.hers: [three numbers, 0 to 1], the page's own
// parts that are them, picked out in turn (the second row keeps a line under it for its own words, so nothing moves when they come)
const SIH_HERS={1:"What slows data down"};
function sih_page(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const rh=76,xr=34,h=200+SIH_PAGE.length*rh+xr+20;ctx.save();ctx.globalAlpha*=a;
  const ry=i=>y+196+i*rh+(i>1?xr:0);
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});
  lp_label(ctx,x+44,y+80,o.kick||"The data strategy",{col:LP.blue});lp_T(ctx,o.title||"On one page",x+44,y+134,{w:800,size:40});
  const u=clamp(o.u==null?1:o.u,0,1),hs=Array.isArray(o.hers)?o.hers:[o.hers||0,o.hers||0,o.hers||0];
  SIH_PAGE.forEach((s,i)=>{const k=clamp(u*SIH_PAGE.length-i,0,1);if(k<=0)return;const y0=ry(i);ctx.save();ctx.globalAlpha*=k;
    const j=SIH_CORE.findIndex(c=>c[0]===i),hk=j<0?0:clamp(hs[j],0,1);
    if(hk>0){ctx.fillStyle=rgba(LP.blue,0.1*hk);rr(ctx,x+26,y0-2,w-52,rh-12+(i===1?xr:0),10);ctx.fill();}
    ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(x+70,y0+30,22,0,TAU);ctx.fill();lp_T(ctx,String(i+1),x+70,y0+40,{w:800,size:28,align:"center",col:[255,255,255]});
    lp_T(ctx,s,x+110,y0+40,{w:hk>0?800:600,size:30});
    if(SIH_HERS[i]&&hk>0)lp_T(ctx,SIH_HERS[i],x+110,y0+78,{w:600,size:28,col:LP.mut,a:hk});ctx.restore();});
  // Rumelt's core, beside the page, each joined to its part
  const c0=clamp(o.core||0,0,1);if(c0>0)SIH_CORE.forEach(([i,lab],j)=>{const k=clamp(c0*3-j,0,1);if(k<=0)return;const yy=ry(i)+30;
    ctx.save();ctx.globalAlpha*=k;ctx.strokeStyle=rgba(LP.blue,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+w-20,yy);ctx.lineTo(x+w+40,yy);ctx.stroke();
    lp_tag(ctx,x+w+48,yy,lab,{col:LP.blue});ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the year's reviews */
const SIH_REVIEWS=[["Tuesday 27 July 2027","Steering group"],["Tuesday 26 October 2027","Steering group"],["Tuesday 25 January 2028","Steering group"],["Monday 31 January 2028","The first year's review"]];
// o.u: one number a review (0 to 1 each); o.tick: one number a review (0 to 1: a green tick once it's been held); o.hl: the review picked out
function sih_cal(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const rh=96,h=210+4*rh;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});
  lp_label(ctx,x+44,y+80,"In the calendar",{col:LP.blue});lp_T(ctx,"The year's reviews",x+44,y+134,{w:800,size:40});
  SIH_REVIEWS.forEach(([d,what],i)=>{const k=o.u?clamp(o.u[i],0,1):1;if(k<=0)return;const ry=y+190+i*rh;ctx.save();ctx.globalAlpha*=k;
    const last=i===3,hl=o.hl===i;if(hl){ctx.fillStyle=rgba(LP.blue,0.1);rr(ctx,x+26,ry,w-52,rh-12,10);ctx.fill();}
    const tk=o.tick?clamp(o.tick[i],0,1):0;
    if(tk>0){ctx.save();ctx.globalAlpha*=tk;ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(x+70,ry+42,22,0,TAU);ctx.fill();
      ctx.strokeStyle="#FFFFFF";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+59,ry+43);ctx.lineTo(x+67,ry+51);ctx.lineTo(x+82,ry+33);ctx.stroke();ctx.restore();}
    if(tk<1){ctx.save();ctx.globalAlpha*=1-tk;ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=4;ctx.beginPath();ctx.arc(x+70,ry+42,18,0,TAU);ctx.stroke();if(last){ctx.fillStyle=rgba(LP.blue,1);ctx.fill();}ctx.restore();}
    lp_T(ctx,d,x+110,ry+38,{w:last?800:700,size:30});lp_T(ctx,what,x+110,ry+76,{w:600,size:28,col:LP.mut});ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the first review's papers */
// the measures page's first readings: days from ask to first use, February and June, as bars (orange: data)
function sih_measures(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=560;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:o.light});
  lp_label(ctx,x+44,y+80,"The measures page",{col:LP.orange});lp_T(ctx,"Days from ask to first use",x+44,y+134,{w:800,size:36});
  lp_bars(ctx,x+60,y+190,w-120,300,[{v:41,label:"February",show:"41"},{v:24,label:"June",show:"24",hi:true}],{max:45,col:LP.orange,u:o.u==null?1:o.u});
  ctx.restore();}
// three of the register's eight risks, each with its early sign
const SIH_RISK=[["The licence ends before every report moves","A report not moved by October"],["The team stretched between the move and new requests","More than six pieces of work open"],["An agent with more rights than its job","An agent with no written mandate"]];
function sih_risks(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const rh=112,h=210+3*rh+60;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.amber,light:o.light});
  lp_label(ctx,x+44,y+80,"The risk register",{col:LP.amber});lp_T(ctx,"Eight risks, each with its early sign",x+44,y+134,{w:800,size:34});
  SIH_RISK.forEach(([r,e],i)=>{const k=o.u?clamp(o.u*3-i,0,1):1;if(k<=0)return;const ry=y+186+i*rh;ctx.save();ctx.globalAlpha*=k;
    ctx.fillStyle=rgba(LP.amber,1);ctx.beginPath();ctx.arc(x+60,ry+30,10,0,TAU);ctx.fill();
    lp_T(ctx,r,x+86,ry+40,{w:700,size:28});lp_T(ctx,"Early sign: "+e,x+86,ry+80,{w:600,size:28,col:LP.mut});ctx.restore();});
  lp_T(ctx,"And five more",x+86,y+h-40,{w:600,size:28,col:LP.mut,a:o.u==null?1:clamp(o.u*3-2,0,1)});
  ctx.restore();}
// the map's history in the repository since June, on a screen: what changed, and why
const SIH_HIST=[["1 July","Teaching space use: its owner, Ivy Reyes","Why: every product has an owner"],["30 June","Current state: one front door, not eleven","Why: package 1, done"],["29 June","Stage one: HR's reports move in August","Why: payroll's year-end in July"]];
function sih_history(cx,X,Y,Wd,Hd,o){o=o||{};cx.fillStyle="#FBF9F4";cx.fillRect(X,Y,Wd,Hd);
  lp_T(cx,"Noor's map · its history since June",X+32,Y+56,{w:800,size:30,col:LP.blue});
  cx.fillStyle=rgba(LP.mut,0.3);cx.fillRect(X+32,Y+78,Wd-64,2);
  SIH_HIST.forEach(([d,what,why],i)=>{const k=o.u==null?1:clamp(o.u*3-i,0,1);if(k<=0)return;const ry=Y+128+i*118;cx.save();cx.globalAlpha*=k;
    lp_T(cx,d,X+32,ry,{w:700,size:28,col:LP.mut});lp_T(cx,what,X+190,ry,{w:700,size:28});lp_T(cx,why,X+190,ry+40,{w:600,size:28,col:LP.mut});cx.restore();});}

/* ---------------------------------------------------------------- the roadmap, moved out loud */
// months from July 2027 (0) to the end of March 2028 (9)
const SIH_PKG=[{n:1,lab:"One front door, one list",done:true},{n:2,lab:"Retire the old warehouse",s:0,e:5.55},{n:3,lab:"Data partners",s:0,e:9,mid:3},
  {n:4,lab:"An owner and a promise",s:0,e:9},{n:5,lab:"Measures on one page",s:0,e:9,open:true},{n:6,lab:"Agents with mandates",s:0,e:6}];
const SIH_MON=["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
// o.up (0 to 1): the courses' products, part of package 4, move up to December; o.wait (0 to 1): package 6 moves to March; o.now (0 to 1):
// the line at the October review; o.u: the rows come in
function sih_roadmap(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const rh=76,r0=y+214,lw=420,tx=x+lw,tw=w-lw-50,mw=tw/9,h=214+6*rh+70;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});
  lp_label(ctx,x+44,y+80,"The roadmap",{col:LP.blue});lp_T(ctx,"Six packages of work",x+44,y+134,{w:800,size:40});
  SIH_MON.forEach((m,i)=>lp_T(ctx,m,tx+mw*(i+0.5),y+190,{w:600,size:28,align:"center",col:LP.mut}));
  const mx=v=>tx+v*mw,u=clamp(o.u==null?1:o.u,0,1),up=clamp(o.up||0,0,1),wt=clamp(o.wait||0,0,1);
  SIH_PKG.forEach((p,i)=>{const k=clamp(u*6-i,0,1);if(k<=0)return;const ry=r0+i*rh;ctx.save();ctx.globalAlpha*=k;
    lp_T(ctx,p.n+"  "+p.lab,x+44,ry+40,{w:600,size:28});
    if(p.done){lp_pill(ctx,mx(0)+150,ry+28,"Done in June",{col:LP.green,icon:"tick",size:28});ctx.restore();return;}
    let e=p.e;if(p.n===6)e=lerp(6,9,ag_sine(wt));
    // the bar: blue for the plan; what waits, in amber
    const bx=mx(p.s),bw=mx(Math.min(e,p.n===6?6:e))-bx;ctx.fillStyle=rgba(LP.blue,0.85);rr(ctx,bx,ry+12,bw,32,10);ctx.fill();
    if(p.n===6&&wt>0){ctx.fillStyle=rgba(LP.amber,0.9);rr(ctx,mx(6)-10,ry+12,mx(e)-mx(6)+10,32,10);ctx.fill();ctx.fillStyle=rgba(LP.blue,0.85);ctx.fillRect(mx(6)-12,ry+12,10,32);}
    if(p.open){ctx.fillStyle=rgba(LP.blue,0.85);ctx.beginPath();ctx.moveTo(mx(9)+4,ry+6);ctx.lineTo(mx(9)+28,ry+28);ctx.lineTo(mx(9)+4,ry+50);ctx.closePath();ctx.fill();}
    if(p.mid!=null){ctx.fillStyle="#FFFFFF";ctx.beginPath();ctx.arc(mx(p.mid),ry+28,8,0,TAU);ctx.fill();}
    // package 4: the products the short courses need, moved up to December, under the bar
    if(p.n===4&&up>0){const e4=lerp(9,6,ag_sine(up));ctx.save();ctx.globalAlpha*=clamp(up*2,0,1);ctx.fillStyle=rgba(LP.blue,1);rr(ctx,bx,ry+50,mx(e4)-bx,16,6);ctx.fill();
      ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(mx(e4)+12,ry+58);ctx.lineTo(mx(e4)+40,ry+58);ctx.moveTo(mx(e4)+12,ry+58);ctx.lineTo(mx(e4)+24,ry+50);ctx.moveTo(mx(e4)+12,ry+58);ctx.lineTo(mx(e4)+24,ry+66);ctx.stroke();ctx.restore();}
    ctx.restore();});
  // the October review: today's line
  const nw=clamp(o.now||0,0,1);if(nw>0){const nx=mx(3.85);ctx.save();ctx.globalAlpha*=nw;ctx.strokeStyle=rgba(LP.ink,0.6);ctx.lineWidth=3;ctx.setLineDash([10,10]);
    ctx.beginPath();ctx.moveTo(nx,y+202);ctx.lineTo(nx,r0+6*rh);ctx.stroke();ctx.setLineDash([]);lp_T(ctx,"26 October",nx,y+h-28,{w:700,size:28,align:"center"});ctx.restore();}
  ctx.restore();return{x,y,w,h,mx,ry:i=>r0+i*rh};}

/* ---------------------------------------------------------------- Noor's map: the target, and the courses' platform */
function sih_target(cx,X,Y,Wd,Hd,o){o=o||{};const bx=(x,y,w,h,col,fill,lab,size)=>{cx.strokeStyle=rgba(col,1);cx.lineWidth=3;rr(cx,x,y,w,h,8);if(fill){cx.fillStyle=rgba(col,0.12);cx.fill();}cx.stroke();
    if(lab)lp_T(cx,lab,x+w/2,y+h/2+10,{w:700,size:size||28,align:"center",col:col});};
  cx.fillStyle="#FBF9F4";cx.fillRect(X,Y,Wd,Hd);lp_T(cx,"Noor's map · the target",X+30,Y+52,{w:800,size:30,col:LP.blue});
  const q=mix(LP.mut,[255,255,255],0.2),pw=330,ph=70,pxm=X+Wd/2-pw/2,pym=Y+Hd-190;
  // the data platform in the middle, and the systems that feed it, quiet
  bx(pxm,pym,pw,ph,LP.blue,true,"The data platform");
  [["Student system",X+40,Y+120],["HR's system",X+40,Y+230],["Timetable",X+Wd-300,Y+120],["Finance",X+Wd-300,Y+230]].forEach(([s,x,y])=>{bx(x,y,260,60,q,false,s);
    cx.strokeStyle=rgba(q,0.7);cx.lineWidth=2;cx.beginPath();cx.moveTo(x+130,y+60);cx.lineTo(pxm+pw/2,pym);cx.stroke();});
  // the courses' platform, added to the target with its reason
  const n=clamp(o.add||0,0,1);if(n>0){cx.save();cx.globalAlpha*=n;const nx=X+Wd/2-180,ny=Y+110+(1-ag_sine(n))*-30;
    cx.strokeStyle=rgba(LP.blue,1);cx.lineWidth=3;cx.setLineDash([10,8]);cx.beginPath();cx.moveTo(nx+180,ny+70);cx.lineTo(pxm+pw/2,pym);cx.stroke();cx.setLineDash([]);
    cx.lineWidth=5;bx(nx,ny,360,70,LP.blue,true,"Online courses' platform");cx.restore();
    // its reason, on the screen's own paper, so the new line runs behind it
    const r=clamp(o.why||0,0,1);if(r>0){cx.save();cx.globalAlpha*=n*r;const tw=lp_tw(cx,"Why: short online courses, from 2028",{w:600,size:28})+28;cx.fillStyle="#FBF9F4";cx.fillRect(X+Wd/2-tw/2,ny+82,tw,44);
      lp_T(cx,"Why: short online courses, from 2028",X+Wd/2,ny+112,{w:600,size:28,align:"center",col:LP.ink});cx.restore();}}}

/* ---------------------------------------------------------------- promised, beside delivered */
const SIH_LEDGER=[["Quicker from ask to first use","41 to 14 days"],["A promise for every product","Promises met: 58% to 86%"],
  ["Measure what people use","340 to 910 people a month"],["Retire the old warehouse","Retired · A$270,000 a year"],
  ["Three data partners by September","Three, by September"],["All seven partners by March","Two faculties haven't named one",true]];
// o.u: one number a row (0 to 1 each); the last row, what didn't work, in amber
function sih_ledger(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const rh=86,h=230+6*rh,c2=x+560;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.green,light:o.light});
  lp_label(ctx,x+44,y+80,"Monday 31 January 2028",{col:LP.green});lp_T(ctx,"The first year",x+44,y+134,{w:800,size:40});
  lp_label(ctx,x+44,y+196,"Promised");lp_label(ctx,c2,y+196,"Delivered");
  SIH_LEDGER.forEach(([p,d,bad],i)=>{const k=o.u?clamp(o.u[i],0,1):1;if(k<=0)return;const ry=y+250+i*rh;ctx.save();ctx.globalAlpha*=k;
    ctx.fillStyle=rgba(LP.mut,0.18);ctx.fillRect(x+40,ry-38,w-80,2);
    lp_T(ctx,p,x+44,ry+6,{w:600,size:28});
    const col=bad?LP.amber:LP.green;ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(c2+12,ry-4,10,0,TAU);ctx.fill();
    lp_T(ctx,d,c2+36,ry+6,{w:800,size:28,col:bad?LP.amber:LP.ink});ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- what to do on Monday */
// a numbered list on one sheet, each row coming in on its own (o.u: one number a row, 0 to 1)
function sih_list(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const rows=o.rows||[],rh=80,h=200+rows.length*rh+10,col=o.col||LP.blue;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col,light:o.light});
  lp_label(ctx,x+44,y+80,o.kick||"",{col});lp_T(ctx,o.title||"",x+44,y+134,{w:800,size:40});
  rows.forEach((s,i)=>{const k=o.u?clamp(o.u[i],0,1):1;if(k<=0)return;const ry=y+196+i*rh;ctx.save();ctx.globalAlpha*=k;
    ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x+70,ry+30,22,0,TAU);ctx.fill();lp_T(ctx,String(i+1),x+70,ry+40,{w:800,size:28,align:"center",col:[255,255,255]});
    lp_T(ctx,s,x+110,ry+40,{w:600,size:30});ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the module's loop */
const SIH_LOOP=["Discover","Define","Plan","Deliver","Measure","Improve"];
// o.u (0 to 1): the loop draws itself round, word by word; o.again (0 to 1): "And again" in the middle; o.turn: how far it has turned
function sih_loop(ctx,cx,cy,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const u=clamp(o.u==null?1:o.u,0,1);
  const ang=i=>-Math.PI/2+i/6*TAU;
  ctx.strokeStyle=rgba(LP.mut,0.5);ctx.lineWidth=5;ctx.lineCap="round";
  for(let i=0;i<6;i++){const k=clamp(u*6-i,0,1);if(k<=0)continue;const a0=ang(i)+0.36,a1=ang(i)+0.36+(TAU/6-0.72)*k;
    ctx.beginPath();ctx.arc(cx,cy,r,a0,a1);ctx.stroke();
    if(k>=1){const ax=cx+r*Math.cos(a1),ay=cy+r*Math.sin(a1),tg=a1+Math.PI/2;ctx.fillStyle=rgba(LP.mut,0.6);ctx.beginPath();
      ctx.moveTo(ax+Math.cos(tg)*14,ay+Math.sin(tg)*14);ctx.lineTo(ax+Math.cos(tg-2.5)*14,ay+Math.sin(tg-2.5)*14);ctx.lineTo(ax+Math.cos(tg+2.5)*14,ay+Math.sin(tg+2.5)*14);ctx.closePath();ctx.fill();}}
  SIH_LOOP.forEach((s,i)=>{const k=clamp(u*6-i+0.6,0,1);if(k<=0)return;const x=cx+r*Math.cos(ang(i)),y=cy+r*Math.sin(ang(i)),col=i<3?LP.blue:LP.green;
    const tw=lp_tw(ctx,s,{w:800,size:30})+44;ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=rgba(LP.paper,1);ctx.shadowColor="rgba(52,36,30,0.22)";ctx.shadowBlur=12;ctx.shadowOffsetX=LP.sdx*0.6;ctx.shadowOffsetY=6;
    rr(ctx,x-tw/2,y-30,tw,60,30);ctx.fill();ctx.shadowColor="transparent";ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;rr(ctx,x-tw/2,y-30,tw,60,30);ctx.stroke();
    lp_T(ctx,s,x,y+10,{w:800,size:30,align:"center",col});ctx.restore();});
  const ag=clamp(o.again||0,0,1);if(ag>0)lp_T(ctx,"And again",cx,cy+14,{w:800,size:40,align:"center",a:ag});
  ctx.restore();}
