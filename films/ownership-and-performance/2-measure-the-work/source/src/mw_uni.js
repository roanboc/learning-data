/* ===== Measure the work, not the people: the university, 2027 =====
   The film's own pictures for the data team's year (prefix mw_). The module's kit draws the rooms, the people, the sheets and the things
   in them, and is never changed for this film; what is here is this film's alone:
     mwMorning, mwLate          the team's room on a morning, and late on a September afternoon (the same room as the kit's lpRoom, the
                                afternoon, where the team reads its measures every second Thursday)
     mw_page(ctx, x, y, w, o)   the team's page of measures, the four that show how the work flows, in two pairs: days from a request to
                                first use beside sent back, promises met beside load. o.rows (0 to 4: rows come in, fractions fade in),
                                o.vals ({row: a}: a row's values shown), o.pairs (0 to 2: the partners joined), o.a, o.k, o.light
     mw_days(ctx, x, y, w, o)   June's 24 days, taken apart: a bar in four parts (in the list, waiting for access, building and review,
                                with the person who asked) and its key. o.u (0 to 1: the bar draws on), o.hi (0 to 1: the wait for
                                access lit, the rest quieter), o.fix (0 to 1: that wait shrinks from 7 days to 1), o.a, o.k, o.light
     mw_load(ctx, x, y, o)      the pieces of work open at once, a square each, against the team's limit of six: o.n (9, or less as the
                                extra ones are finished: each fraction a tick, then gone), o.limit (0 to 1: the limit drawn), o.a, o.light
     mw_mail(ctx, x, y, w, h, o) the director's message on the screen on the wall: o.u (0 to 1: its lines come in), o.a
   Colour keeps the module's meaning: orange data (the measures), amber a wait or a cost (waiting for access, the work over the limit),
   green what's done or better, blue a plan or a rule (the limit of six, the fixes the team agrees); people wear none of them. */

/* ---------------------------------------------------------------- the places */
AG_PLACES.mwMorning=c=>lp_paintRoom(c,{light:"morning",seed:12});
AG_PLACES.mwLate=c=>lp_paintRoom(c,{light:"late",seed:12});
AG_ROOMS.mwMorning="lpRoom";AG_ROOMS.mwLate="lpRoom";

/* ---------------------------------------------------------------- the team's page of measures */
const MW_ROWS=[{name:"Days from a request to first use",val:"Feb 41 · Jun 24"},{name:"Sent back for changes",val:"Share of work"},
  {name:"Promises met",val:"Products' promises"},{name:"Load",val:"Open at once · limit 6"}];
function mw_page(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const rh=104,h=150+rh*4+40;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:o.light,pin:true});lp_T(ctx,"THE TEAM'S MEASURES · FROM JULY",x+48,y+84,{w:800,size:28,ls:3,col:LP.orange});
  const rows=o.rows==null?4:o.rows,px=x+150;
  MW_ROWS.forEach((r,i)=>{const ra=clamp(rows-i,0,1);if(ra<=0.004)return;const ry=y+150+i*rh;ctx.save();ctx.globalAlpha*=ag_sine(ra);
    ctx.strokeStyle=rgba(LP.mut,0.25);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px-20,ry+rh-14);ctx.lineTo(x+w-44,ry+rh-14);ctx.stroke();
    ctx.fillStyle=rgba(LP.orange,1);ctx.beginPath();ctx.arc(px-2,ry+40,7,0,TAU);ctx.fill();
    lp_T(ctx,r.name,px+24,ry+52,{w:800,size:34});
    const va=(o.vals||{})[i]||0;if(va>0.004)lp_T(ctx,r.val,x+w-48,ry+52,{w:700,size:30,col:LP.orange,align:"right",a:va});ctx.restore();});
  // the partners: a bracket at the left joining each pair
  const pr=o.pairs||0;for(let k=0;k<2;k++){const pa=clamp(pr-k,0,1);if(pa<=0.004)continue;const y0=y+150+k*2*rh+22,y1=y0+rh+40,bx=x+92;ctx.save();ctx.globalAlpha*=ag_sine(pa);
    ctx.strokeStyle=rgba(LP.ink,0.85);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(bx+22,y0);ctx.lineTo(bx,y0);ctx.lineTo(bx,lerp(y0,y1,ag_sine(pa)));
    if(pa>0.6){ctx.lineTo(bx+22,y1);}ctx.stroke();ctx.restore();}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- June's 24 days, taken apart */
// [days, key words, colour]; the wait for access is the one the team could remove
const MW_PARTS=[[8,"In the list",[150,140,132]],[7,"Waiting for access",LP.amber],[7,"Building and review",[104,96,92]],[2,"With the person who asked",[178,168,160]]];
function mw_days(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=490;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:o.light,pin:true});lp_T(ctx,"JUNE'S 24 DAYS, TAKEN APART",x+44,y+80,{w:800,size:28,ls:3,col:LP.orange});
  const bx=x+44,bw=w-88,by=y+120,bh=80,u=ag_sine(clamp(o.u==null?1:o.u,0,1)),hi=clamp(o.hi||0,0,1),fix=ag_sine(clamp(o.fix||0,0,1)),per=bw/24;
  let cx=bx;const ends=[];
  MW_PARTS.forEach(([d,label,col],i)=>{const dd=i===1?lerp(d,1,fix):d,pw=dd*per,vis=clamp((bx+bw*u-cx)/pw,0,1);ends.push([cx,pw,dd]);
    if(vis>0.004){ctx.save();ctx.globalAlpha*=i===1?1:1-0.45*hi;ctx.fillStyle=rgba(col,1);ctx.fillRect(cx+2,by,pw*vis-4,bh);
      if(vis>0.9){const s=i===1?(fix>0.5?"1":"7"):String(d),ta=i===1?Math.abs(fix-0.5)*2:1;lp_T(ctx,s,cx+pw/2,by+54,{w:800,size:40,align:"center",color:"rgba(255,255,255,"+ta+")"});}ctx.restore();}
    cx+=pw;});
  // the key, one row each with its colour; the wait for access in amber, the others quieter while it is lit
  MW_PARTS.forEach(([d,label,col],i)=>{const kx=x+44,ky=by+bh+70+i*56,ka=clamp(u*4-i,0,1);if(ka<=0.004)return;ctx.save();ctx.globalAlpha*=ag_sine(ka)*(i===1?1:1-0.45*hi);
    ctx.fillStyle=rgba(col,1);ctx.fillRect(kx,ky-26,30,30);const n=i===1?(fix>0.5?"1":"7"):String(d);
    lp_T(ctx,label+": "+n+(n==="1"?" day":" days"),kx+46,ky,{w:i===1?800:600,size:30,col:i===1?LP.amber:LP.ink});ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the pieces of work open at once */
function mw_load(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const n=o.n==null?9:o.n,sz=60,gp=14,lim=clamp(o.limit==null?1:o.limit,0,1);ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<9;i++){const gone=clamp(9-n-(8-i),0,1),bx=x+i*(sz+gp);if(i<6||gone<1){const over=i>=6,f=over?1-ag_sine(clamp((gone-0.5)*2,0,1)):1;if(f<=0.004)continue;
      ctx.save();ctx.globalAlpha*=f;ctx.fillStyle=rgba(over?(gone>0.004?LP.green:LP.amber):[132,124,118],1);ctx.fillRect(bx,y,sz,sz);
      if(over&&gone>0.004)lp_icon(ctx,"tick",bx+sz/2,y+sz/2,34,[255,255,255]);ctx.restore();}}
  if(lim>0.004){ctx.save();ctx.globalAlpha*=ag_sine(lim);ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=5;ctx.setLineDash([14,10]);const lx=x+6*(sz+gp)-gp/2;
    ctx.beginPath();ctx.moveTo(lx,y-40);ctx.lineTo(lx,y+sz+30);ctx.stroke();ctx.setLineDash([]);lp_T(ctx,"Limit: 6",lx-14,y-56,{w:800,size:30,col:LP.blue,align:"right"});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the director's message, on the screen on the wall */
function mw_mail(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u;
  lp_screen(ctx,x,y,w,h,{a,draw:(c,sx,sy,sw,sh)=>{c.fillStyle=rgba([244,242,236],1);c.fillRect(sx,sy,sw,sh);c.fillStyle=rgba([226,222,214],1);c.fillRect(sx,sy,sw,64);
    lp_T(c,"From: the director of digital services",sx+36,sy+44,{w:700,size:28,col:LP.mut});
    const la=k=>ag_sine(clamp(u*3-k,0,1));
    lp_T(c,"Monday 13 September",sx+36,sy+120,{w:800,size:30,a:la(0)});
    lp_T(c,"Could I have a count of tickets",sx+36,sy+190,{w:800,size:38,a:la(1)});
    lp_T(c,"closed by each person, each month?",sx+36,sy+240,{w:800,size:38,a:la(2)});}});}
