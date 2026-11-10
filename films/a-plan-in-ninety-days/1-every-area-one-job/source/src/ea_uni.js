/* ===== Every area, one job: the university, February 2027 =====
   The film's own pictures at the university, on the module's kit (prefix ea_). Colour keeps the module's meaning: the 46 requests are
   data (orange dots, each a request for data), the oldest and the waiting in amber, Helena's plan and its dates in blue, a request
   answered in green; the wheel itself, its areas and the people wear none of the five.
     eaMonday, eaFriday   the team's room on her first Monday morning, and on Friday afternoon
     ea_tracker           the tracker on a screen: how many requests are open, and three of them (never the whole list)
     EA_AREAS             DAMA-DMBOK's ten areas round its wheel, clockwise from the top, each with its count of the 46 requests
     ea_wheel             the wheel on a sheet: governance at the centre, ten areas round it, the requests placed on it as dots, the two
                          beside it, one request's lines to the areas it touches, the ring that makes them one system, and the site's
                          films on the areas where they go deep
     ea_plan              Helena's ninety days on one page: twelve weeks across, three lanes down (people, strategy, operations), the
                          three steps and their dates, the delivery sprints
   Every word is at least 28 px as seen, and nothing but the captions goes below y 890. */

AG_PLACES.eaMonday=c=>lp_paintRoom(c,{light:"morning",seed:3});
AG_PLACES.eaFriday=c=>lp_paintRoom(c,{light:"late",seed:4});

/* ---------------------------------------------------------------- the tracker, on a screen */
const EA_ROWS=[{t:"A report for Planning",w:"Planning"},{t:"A fix to the staff list",w:"HR"},{t:"Access for a researcher",w:"Health"}];
// o.n (the count shown), o.rows (0 to 1 each), o.old (0 to 1: the oldest row, in amber), o.lane (0 to 1: each row's answer), o.a
function ea_tracker(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;lp_screen(ctx,x,y,w,h,{a,draw:(c,X,Y,Wd,Hd)=>{
  lp_T(c,"Open requests",X+40,Y+66,{w:800,size:36});lp_T(c,String(o.n==null?46:o.n),X+Wd-40,Y+66,{w:800,size:44,align:"right",col:LP.orange});
  c.fillStyle=rgba(LP.mut,0.3);c.fillRect(X+40,Y+92,Wd-80,2);
  const rows=[{t:"Oldest: waiting since 14 August 2026",old:1}].concat(EA_ROWS);
  rows.forEach((r,i)=>{const k=r.old?(o.old||0):(o.rows?clamp(o.rows[i-1],0,1):1);if(k<=0.004)return;const ry=Y+150+i*80;c.save();c.globalAlpha*=k;
    if(r.old){c.fillStyle=rgba(LP.amber,0.12);rr(c,X+28,ry-46,Wd-56,66,10);c.fill();lp_icon(c,"wait",X+66,ry-12,34,LP.amber);lp_T(c,r.t,X+104,ry,{w:700,size:30,col:LP.amber});}
    else{c.fillStyle=rgba(LP.orange,1);c.beginPath();c.arc(X+66,ry-11,10,0,TAU);c.fill();lp_T(c,r.t,X+104,ry,{w:600,size:30});
      const ln=o.lane?clamp(o.lane[i-1],0,1):0;if(ln>0.004){c.save();c.globalAlpha*=ln;lp_icon(c,"tick",X+Wd-64,ry-12,34,LP.green);lp_T(c,o.answers[i-1],X+Wd-100,ry,{w:700,size:28,align:"right",col:LP.green});c.restore();}
      else{lp_icon(c,"wait",X+Wd-64,ry-12,30,LP.mut);lp_T(c,"Waiting",X+Wd-100,ry,{w:600,size:28,align:"right",col:LP.mut});}}
    c.restore();});}});}

/* ---------------------------------------------------------------- the wheel */
// DAMA-DMBOK's ten areas round data governance, clockwise from the top, as its wheel places them; n: how many of the 46 requests sit in
// each (the module's numbers: 44 on the wheel, 4 of them in governance, 2 beside it)
const EA_AREAS=[{l:"Architecture",n:2},{l:"Modelling and design",n:3},{l:"Storage and operations",n:2},{l:"Security",n:5},{l:"Integration",n:4},
  {l:"Documents and content",n:1},{l:"Reference and master data",n:3},{l:"Warehousing and BI",n:10},{l:"Metadata",n:3},{l:"Quality",n:7}];
const EA_GOV=4;
// where the site's other films go deep, by area: the index in EA_AREAS (-1: governance, at the centre)
const EA_FILMS=[{i:1,t:"From words to data"},{i:9,t:"Fit for use"},{i:6,t:"The same one, everywhere"},{i:-1,t:"Governance principles"},{i:0,t:"The map before the data"},{i:4,t:"Data that moves"},{i:3,t:"Only what you may see"}];
const EA_W={cx:860,cy:500,R:262,r0:96};
const ea_ang=i=>-Math.PI/2+(i+0.5)*TAU/10;
// a dot's place in area i, the j-th of its requests: in rows across the slice, from the inside out, as many in a row as its width holds
const ea_rowCap=k=>Math.max(1,Math.floor((EA_W.r0+26+k*26)*0.628*0.8/22));
function ea_dot(i,j){const W0=EA_W,n=EA_AREAS[i].n;let row=0,first=0;while(j>=first+ea_rowCap(row)){first+=ea_rowCap(row);row++;}
  const inRow=Math.min(ea_rowCap(row),n-first),col=j-first,rad=W0.r0+26+row*26,an=ea_ang(i)+(col-(inRow-1)/2)*(22/rad);
  return[W0.cx+Math.cos(an)*rad,W0.cy+Math.sin(an)*rad];}
function ea_govDot(j){const an=-Math.PI/2+j*TAU/4+Math.PI/4,r=30;return[EA_W.cx+Math.cos(an)*r,EA_W.cy+18+Math.sin(an)*r];}
// o: u (0 to 1: the wheel draws itself), names (0 to 1 each, or one number), gov (0 to 1), dots (0 to 1: the requests come onto it),
// hl (an array of 0 to 1, one an area: picked out), count (0 to 1 each: its count shown), beside (0 to 1), touch (0 to 1), one (0 to 1),
// films (0 to 1), light, a
function ea_wheel(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const {cx,cy,R,r0}=EA_W;ctx.save();ctx.globalAlpha*=a;
  lp_sheet(ctx,200,120,1520,760,{light:o.light});
  lp_label(ctx,240,184,"DAMA-DMBOK",{col:LP.mut});
  const u=o.u==null?1:o.u,nm=i=>o.names==null?1:typeof o.names==="number"?o.names:clamp(o.names[i]||0,0,1);
  // the ring and its spokes, drawing themselves
  ctx.lineCap="round";ctx.strokeStyle=rgba(LP.ink,0.85);ctx.lineWidth=3;
  if(u>0){ctx.beginPath();ctx.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+TAU*ag_sine(u));ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,r0,-Math.PI/2,-Math.PI/2+TAU*ag_sine(u));ctx.stroke();
    for(let i=0;i<10;i++){const k=ag_sine(clamp(u*10-i,0,1)*1);if(k<=0)continue;const an=-Math.PI/2+i*TAU/10;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*r0,cy+Math.sin(an)*r0);
      ctx.lineTo(cx+Math.cos(an)*lerp(r0,R,k),cy+Math.sin(an)*lerp(r0,R,k));ctx.stroke();}}
  // an area picked out: its slice warmed
  EA_AREAS.forEach((ar,i)=>{const h=o.hl?clamp(o.hl[i]||0,0,1):0;if(h<=0.004)return;const a0=-Math.PI/2+i*TAU/10,a1=a0+TAU/10;
    ctx.fillStyle=rgba(LP.sun,0.42*h);ctx.beginPath();ctx.arc(cx,cy,R-3,a0,a1);ctx.arc(cx,cy,r0+3,a1,a0,true);ctx.closePath();ctx.fill();});
  // the ring that makes the areas one system
  const one=o.one||0;if(one>0){ctx.strokeStyle=rgba(LP.ink,1);ctx.lineWidth=7;ctx.beginPath();ctx.arc(cx,cy,R+10,-Math.PI/2,-Math.PI/2+TAU*ag_sine(one));ctx.stroke();}
  // governance at the centre
  const gv=o.gov==null?1:o.gov;if(gv>0){ctx.save();ctx.globalAlpha*=gv;lp_T(ctx,"Data",cx,cy-36,{w:800,size:28,align:"center"});lp_T(ctx,"governance",cx,cy-4,{w:800,size:28,align:"center"});ctx.restore();}
  // the areas' names, outside the ring, each where its slice is; or the site's film that goes deep in it
  const fm=o.films||0;
  EA_AREAS.forEach((ar,i)=>{const k=nm(i);if(k<=0.004)return;const an=ea_ang(i),ca=Math.cos(an),sa=Math.sin(an),lx=cx+ca*(R+34),ly=cy+sa*(R+34),al=ca>0.2?"left":ca<-0.2?"right":"center";
    const film=EA_FILMS.find(f=>f.i===i),lines=lp_wrap(ctx,film&&fm>0.5?film.t:ar.l,330,{w:700,size:28}),lh=34,y0=ly+(sa>0.3?24:sa<-0.3?-10-(lines.length-1)*lh:10-(lines.length-1)*lh/2);
    ctx.save();ctx.globalAlpha*=k*(film?Math.abs(fm-0.5)*2:1)*(fm>0.5&&!film?0.35:1);lines.forEach((l,n)=>lp_T(ctx,l,lx,y0+n*lh,{w:700,size:28,align:al,col:film&&fm>0.5?LP.ink:LP.mut}));ctx.restore();});
  if(fm>0.5){const g=EA_FILMS.find(f=>f.i===-1);ctx.save();ctx.globalAlpha*=(fm-0.5)*2;lp_tag(ctx,1690,770,g.t+": the centre",{align:"right",col:LP.ink});ctx.restore();}
  // the requests, as orange dots: o.dots, one number an area (0 to 1: how many of its requests are on it), o.govDots for governance's
  EA_AREAS.forEach((ar,i)=>{const dp=o.dots?clamp(o.dots[i]||0,0,1):0;for(let j=0;j<ar.n;j++){const k=clamp(dp*ar.n-j,0,1);if(k<=0)break;const [x,y]=ea_dot(i,j);
    ctx.fillStyle=rgba(LP.orange,ag_eo(k));ctx.beginPath();ctx.arc(x,y,lerp(3,8.5,ag_spr(k,0,0.6)),0,TAU);ctx.fill();}});
  const gd=clamp(o.govDots||0,0,1);for(let j=0;j<EA_GOV;j++){const k=clamp(gd*EA_GOV-j,0,1);if(k<=0)break;const [x,y]=ea_govDot(j);ctx.fillStyle=rgba(LP.orange,ag_eo(k));ctx.beginPath();ctx.arc(x,y+20,lerp(3,10,ag_spr(k,0,0.6)),0,TAU);ctx.fill();}
  EA_AREAS.forEach((ar,i)=>{const k=o.count?clamp(o.count[i]||0,0,1):0;if(k<=0.004)return;const an=ea_ang(i),x=cx+Math.cos(an)*(R-30),y=cy+Math.sin(an)*(R-30);
    ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=rgba(LP.paper,0.96);ctx.beginPath();ctx.arc(x,y,24,0,TAU);ctx.fill();ctx.strokeStyle=rgba(LP.orange,1);ctx.lineWidth=3;ctx.stroke();
    lp_T(ctx,String(ar.n),x,y+10,{w:800,size:28,align:"center",col:LP.orange});ctx.restore();});
  // the two that sit beside the wheel, at the sheet's bottom right
  const bs=o.beside||0;if(bs>0){ctx.save();ctx.globalAlpha*=bs;lp_label(ctx,1290,712,"Beside the wheel",{col:LP.mut});
    [["An agent for timetables",770],["A forecast model",828]].forEach(([s2,y])=>{ctx.fillStyle=rgba(LP.orange,1);ctx.beginPath();ctx.arc(1302,y-10,12,0,TAU);ctx.fill();lp_T(ctx,s2,1330,y,{w:600,size:28});});ctx.restore();}
  // one request, a new report, circled: the areas it touches are picked out by the scene (o.hl)
  const tc=o.touch||0;if(tc>0){const [bx,by]=ea_dot(7,4);ctx.save();ctx.globalAlpha*=tc;ctx.strokeStyle=rgba(LP.orange,1);ctx.lineWidth=4;ctx.beginPath();ctx.arc(bx,by,17,0,TAU);ctx.stroke();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the plan, on one page */
const EA_P={x:150,y:128,w:1620,h:750,gx:520,gw:1170,lanes:{people:[350,82],strategy:[458,120],ops:[628,180]}};
const ea_wx=k=>EA_P.gx+EA_P.gw*k/12;
// one block on a lane, from week w0 to w1, its words inside (one or two lines), in blue, or outlined in blue (o.line)
function ea_block(ctx,w0,w1,y,h,words,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const x0=ea_wx(w0)+4,x1=ea_wx(w1)-4;ctx.save();ctx.globalAlpha*=a;
  if(o.line){ctx.fillStyle=rgba(LP.blue,0.08);rr(ctx,x0,y,x1-x0,h,12);ctx.fill();ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=3;rr(ctx,x0+1.5,y+1.5,x1-x0-3,h-3,11);ctx.stroke();}
  else{ctx.fillStyle=rgba(o.col||LP.blue,1);rr(ctx,x0,y,x1-x0,h,12);ctx.fill();}
  const ls=Array.isArray(words)?words:[words],lh=34,ty=y+h/2+10-(ls.length-1)*lh/2;ls.forEach((l,i)=>lp_T(ctx,l,(x0+x1)/2,ty+i*lh,{w:700,size:28,align:"center",col:o.line?LP.blue:[255,255,255]}));
  ctx.restore();}
// o: k, a, light, grid (0 to 1), people, strategy [discover, define, plan], dates (0 to 1), ops [urgent, sprints, improve, test], hl (a lane
// picked out: "people", "strategy", "ops"), today (0 to 1: the line at week 0)
function ea_plan(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const P=EA_P;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,P.x+P.w/2,P.y+P.h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,P.x,P.y,P.w,P.h,{col:LP.blue,light:o.light});
  lp_label(ctx,P.x+44,P.y+76,"Helena's first ninety days",{col:LP.blue});lp_T(ctx,"1 February to 26 April 2027",P.x+44,P.y+126,{w:600,size:30,col:LP.mut});
  // the weeks across the top, and a faint line at each
  const gd=o.grid==null?1:o.grid;if(gd>0){ctx.save();ctx.globalAlpha*=gd;for(let k=0;k<=12;k++){const x=ea_wx(k);lp_T(ctx,String(k),x,P.y+196,{w:k%3===0?800:600,size:28,align:"center",col:k%3===0?LP.ink:LP.mut});
      ctx.fillStyle=rgba(LP.mut,k%3===0?0.22:0.1);ctx.fillRect(x-1,P.y+212,2,P.h-250);}lp_T(ctx,"Week",P.gx-34,P.y+196,{w:600,size:28,align:"right",col:LP.mut});ctx.restore();}
  // the lanes' names
  const L=P.lanes,hl=o.hl;[["people","People"],["strategy","Strategy"],["ops","Operations"]].forEach(([k,n])=>{const [y,h]=L[k],on=hl==null||hl===k;
    ctx.save();ctx.globalAlpha*=on?1:0.45;lp_T(ctx,n,P.x+44,y+h/2+12,{w:800,size:34});ctx.restore();});
  const dim=k=>hl==null||hl===k?1:0.45;
  // people, all twelve weeks
  if(o.people>0)ea_block(ctx,0,12,L.people[0]+8,L.people[1]-16,"Connect with people: the team, the owners, the users",{a:o.people*dim("people"),line:true});
  // strategy: discover, define, plan, each ending on a date
  const st=o.strategy||[0,0,0],sy=L.strategy[0]+8;
  ea_block(ctx,0,6,sy,64,"Discover",{a:st[0]*dim("strategy")});ea_block(ctx,6,9,sy,64,"Define",{a:st[1]*dim("strategy")});ea_block(ctx,9,12,sy,64,"Plan",{a:st[2]*dim("strategy")});
  const dts=[[6,"15 March"],[9,"5 April"],[12,"26 April"]];dts.forEach(([wk,s],i)=>{const k=o.dates?clamp(o.dates[i]||0,0,1):0;if(k<=0.004)return;const x=ea_wx(wk);ctx.save();ctx.globalAlpha*=k*dim("strategy");
    ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.moveTo(x,sy+70);ctx.lineTo(x+12,sy+84);ctx.lineTo(x,sy+98);ctx.lineTo(x-12,sy+84);ctx.closePath();ctx.fill();
    lp_T(ctx,s,x+(i===2?-8:0),sy+132,{w:700,size:28,align:i===2?"right":"center",col:LP.blue});ctx.restore();});
  // operations: the urgent problems, then delivery in two-week sprints with today's procedures; better ways proposed, then tested
  const op=o.ops||[0,0,0,0],oy=L.ops[0]+8;
  ea_block(ctx,0,2,oy,76,["Urgent","problems"],{a:op[0]*dim("ops")});ea_block(ctx,6,9,oy,76,["Propose","better ways"],{a:op[2]*dim("ops"),line:true});ea_block(ctx,9,12,oy,76,"Test them",{a:op[3]*dim("ops"),line:true});
  if(op[1]>0){ea_block(ctx,2,12,oy+92,68,"",{a:op[1]*dim("ops")});ctx.save();ctx.globalAlpha*=op[1]*dim("ops");
    for(let k=4;k<12;k+=2){const x=ea_wx(k);ctx.fillStyle="rgba(255,255,255,0.75)";ctx.fillRect(x-1.5,oy+92,3,12);ctx.fillRect(x-1.5,oy+92+56,3,12);}
    lp_T(ctx,"Two-week sprints, today's procedures",ea_wx(7),oy+92+44,{w:700,size:28,align:"center",col:[255,255,255]});ctx.restore();}
  // today: Monday 1 February, week 0
  const td=o.today||0;if(td>0){ctx.save();ctx.globalAlpha*=td;ctx.strokeStyle=rgba(LP.ink,0.8);ctx.lineWidth=3;ctx.setLineDash([8,7]);ctx.beginPath();ctx.moveTo(ea_wx(0),P.y+214);ctx.lineTo(ea_wx(0),P.y+P.h-30);ctx.stroke();ctx.restore();}
  ctx.restore();return{x:P.x,y:P.y,w:P.w,h:P.h};}
