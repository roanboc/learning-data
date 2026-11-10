/* ===== From gaps to a roadmap: the university's plan =====
   The data story's own pictures, on the module's sheets of thick paper, in its colours: blue the plan and the target, green what is done
   or works, amber a gap, a cost or a wait (prefix gr_, GR_). Every word is 28 px or more in the frame, drawn with lp_T; the small pictures
   inside the one page (the ring, the stages) have no words.
     GR_LAYERS, GR_GAPS, gr_map     Noor's map: today beside the target, layer by layer, each gap outlined in amber as it's named
     GR_PACKS, gr_card, gr_slips    the six work packages, each a card with its owner, its date and the gaps it closes
     GR_TILE, gr_tile, gr_arrow     the packages in order: what each unlocks, and what waits on what
     GR_STAGES, gr_stage            three stages, each a column: its date, what it holds, and that it works on its own
     gr_onePage                     the data strategy on one page, six panels
     GR_DEAN, gr_plates             the dean of Arts, drawn for this film, and the name plates on the data council's table */

/* ---------------------------------------------------------------- helpers */
// an arrow from (x0, y0) to (x1, y1), drawn to u (0 to 1), in col; o.lw, o.head, o.al, o.dash, o.bend (px to one side, a curve)
function gr_arrow(ctx,x0,y0,x1,y1,u,col,o){o=o||{};u=clamp(u,0,1);if(u<=0.01)return;const bend=o.bend||0,mx=(x0+x1)/2-(y1-y0)/Math.hypot(x1-x0,y1-y0||1)*bend,my=(y0+y1)/2+(x1-x0)/Math.hypot(x1-x0||1,y1-y0)*bend;
  const P=t=>[(1-t)*(1-t)*x0+2*(1-t)*t*mx+t*t*x1,(1-t)*(1-t)*y0+2*(1-t)*t*my+t*t*y1],hd=o.head||16,e=P(u),e0=P(Math.max(0,u-0.04)),an=Math.atan2(e[1]-e0[1],e[0]-e0[0]);
  ctx.save();ctx.strokeStyle=rgba(col,o.al==null?1:o.al);ctx.fillStyle=rgba(col,o.al==null?1:o.al);ctx.lineWidth=o.lw||4;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();for(let k=0;k<=24;k++){const q=P(u*k/24),back=k===24?hd*0.6:0;k?ctx.lineTo(q[0]-Math.cos(an)*back,q[1]-Math.sin(an)*back):ctx.moveTo(q[0],q[1]);}ctx.stroke();ctx.setLineDash([]);
  if(u>0.2){ctx.beginPath();ctx.moveTo(e[0],e[1]);ctx.lineTo(e[0]-Math.cos(an-0.45)*hd,e[1]-Math.sin(an-0.45)*hd);ctx.lineTo(e[0]-Math.cos(an+0.45)*hd,e[1]-Math.sin(an+0.45)*hd);ctx.closePath();ctx.fill();}
  ctx.restore();}
// a line struck through a tag or a word, drawn to u: (x, y) its left end, w long
function gr_strike(ctx,x,y,w,u,col){u=clamp(u,0,1);if(u<=0.01)return;ctx.save();ctx.strokeStyle=rgba(col||LP.amber,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w*u,y);ctx.stroke();ctx.restore();}
// the width of an lp_tag
const gr_tagW=(ctx,s)=>lp_tw(ctx,s,{w:700,size:28})+52;

/* ---------------------------------------------------------------- Noor's map: today beside the target, and the gaps */
const GR_LAYERS=["Strategy","Business","Information","Application","Technology"];
// the nine gaps, each where today and the target differ, in its layer; chip, its short name on a work package; p, the package that closes it
const GR_GAPS=[
  {l:0,today:["Slow: 41 working days","Not measured"],target:"Quick, and measured",chip:"Slow, unmeasured",p:4},
  {l:1,today:["Eleven ways to ask"],target:"One front door",chip:"Eleven ways in",p:0},
  {l:1,today:["Requests in no order"],target:"One list, in order",chip:"No order",p:0},
  {l:1,today:["40 people working alone"],target:"Seven data partners",chip:"40 working alone",p:2},
  {l:2,today:["Three staff lists"],target:"One staff list",chip:"Three lists",p:3},
  {l:2,today:["No owners"],target:"An owner for each",chip:"No owners",p:3},
  {l:3,today:["Reports in two places"],target:"One platform",chip:"Two places",p:1},
  {l:3,today:["Agents without mandates"],target:"Agents with mandates",chip:"No mandates",p:5},
  {l:4,today:["Old servers running"],target:"Servers switched off",chip:"Old servers",p:1}];
// the screen on the wall, and the table on it: a column of layers, today's column, an arrow, the target's column
const GR_SCR={x:70,y:150,w:1180,h:700};
const GR_TAB=(()=>{const lx=100,tx=330,tw=420,gx=836,hy=206;let y=230;const rows=[],items=[];
  GR_LAYERS.forEach((nm,l)=>{const top=y;y+=8;GR_GAPS.forEach((g,i)=>{if(g.l!==l)return;const h=12+36*g.today.length;items[i]={x:tx-14,y,w:tw+14,h};y+=h+6;});y+=2;rows.push({top,bot:y});});
  return{lx,tx,tw,gx,hy,ax0:tx+tw+12,ax1:gx-16,rows,items};})();
// where the camera looks at a layer's row, near enough to read it larger
const gr_rowCam=l=>{const r=GR_TAB.rows[l];return[690,clamp((r.top+r.bot)/2,380,700),1.45];};
// the map: o.rows[l] (0 to 1, today's side of each row), o.goal[l] (the target's side), o.mark[i] (0 to 1, gap i outlined in amber), o.hi[l]
// (a row lit while it's read), o.fade[l] (rows far from the one read, faint while the camera is close), o.head (the column heads); drawn
// inside lp_screen at GR_SCR
function gr_map(ctx,o){o=o||{};const T=GR_TAB,S=GR_SCR,hd=o.head==null?1:o.head;
  if(hd>0.004){lp_T(ctx,"TODAY",T.tx,T.hy,{w:800,size:28,ls:3,col:LP.mut,a:hd});lp_T(ctx,"THE TARGET",T.gx,T.hy,{w:800,size:28,ls:3,col:LP.blue,a:hd});
    ctx.fillStyle=rgba(LP.mut,0.25*hd);ctx.fillRect(S.x+24,T.hy+12,S.w-48,2);}
  T.rows.forEach((r,l)=>{const ra=o.rows?clamp(o.rows[l],0,1):1,ga=o.goal?clamp(o.goal[l],0,1):ra,hi=o.hi?clamp(o.hi[l],0,1):0,fd=o.fade?clamp(o.fade[l],0,1):1;if(ra<=0.004||fd<=0.004)return;
    ctx.save();ctx.globalAlpha*=fd;
    if(hi>0.004){ctx.fillStyle=rgba(LP.blue,0.07*hi);ctx.fillRect(S.x+12,r.top+1,S.w-24,r.bot-r.top-2);}
    lp_T(ctx,GR_LAYERS[l],T.lx,r.top+8+33,{w:800,size:28,a:ra});
    if(l<GR_LAYERS.length-1){ctx.fillStyle=rgba(LP.mut,0.16*ra);ctx.fillRect(S.x+24,r.bot-1,S.w-48,2);}
    GR_GAPS.forEach((g,i)=>{if(g.l!==l)return;const b=T.items[i],m=o.mark?ag_sine(clamp(o.mark[i],0,1)):0;
      if(m>0.004){ctx.save();ctx.globalAlpha*=m;ctx.fillStyle=rgba(LP.amber,0.10);rr(ctx,b.x,b.y,b.w,b.h,10);ctx.fill();ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=4;rr(ctx,b.x,b.y,b.w,b.h,10);ctx.stroke();ctx.restore();}
      g.today.forEach((s,k)=>lp_T(ctx,s,T.tx,b.y+33+k*36,{w:600,size:28,a:ra}));
      if(ga>0.004){gr_arrow(ctx,T.ax0,b.y+24,T.ax1,b.y+24,ga,mix(LP.mut,LP.amber,m),{lw:3,head:12,al:lerp(0.55,1,m)});
        lp_T(ctx,g.target,T.gx,b.y+33,{w:600,size:28,col:LP.blue,a:ga});}});ctx.restore();});}

/* ---------------------------------------------------------------- the six work packages */
const GR_PACKS=[
  {n:"1",who:"Helena",title:"One front door and one list",tl:["One front door","and one list"],short:"Front door and one list",date:"By 30 June 2027"},
  {n:"2",who:"Sam",title:"Retire the old warehouse",short:"Retire the old warehouse",date:"By 17 December 2027"},
  {n:"3",who:"Jun",title:"Data partners",short:"Data partners",date:"Three by September, all seven by March 2028"},
  {n:"4",who:"Yusuf",title:"An owner and a promise for every product",tl:["An owner and a promise","for every product"],short:"Owners and promises",date:"By March 2028"},
  {n:"5",who:"Noor",title:"The measures, on one page",tl:["The measures,","on one page"],short:"The measures page",date:"From July 2027"},
  {n:"6",who:"Yusuf",title:"Agents with mandates",short:"Agents with mandates",date:"By December 2027"}];
const GR_CARD={x0:110,y0:300,w:540,h:270,dx:580,dy:300};
const gr_cardBox=i=>({x:GR_CARD.x0+(i%3)*GR_CARD.dx,y:GR_CARD.y0+Math.floor(i/3)*GR_CARD.dy,w:GR_CARD.w,h:GR_CARD.h});
// the gaps a package closes, in order
const gr_gapsOf=p=>GR_GAPS.map((g,i)=>g.p===p?i:-1).filter(i=>i>=0);
// a package's card: its number and owner, what it is, its date; o.a, o.k (springs in), o.hi (a blue edge), o.date (0 to 1)
function gr_card(ctx,i,o){o=o||{};const P=GR_PACKS[i],b=gr_cardBox(i),a=o.a==null?1:o.a;if(a<=0.004)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,b.x+b.w/2,b.y+b.h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,b.x,b.y,b.w,b.h,{col:LP.blue,light:"day",pin:false});
  if(o.hi>0.004){ctx.strokeStyle=rgba(LP.blue,o.hi);ctx.lineWidth=5;rr(ctx,b.x-9,b.y-9,b.w+18,b.h+18,12);ctx.stroke();}
  lp_T(ctx,(P.n+" · "+P.who+"'s").toUpperCase(),b.x+LP_PAD,b.y+56,{w:800,size:28,ls:3,col:LP.blue});
  let y=b.y+56;for(const l of P.tl||lp_wrap(ctx,P.title,b.w-LP_PAD*2,{w:800,size:36})){y+=46;lp_T(ctx,l,b.x+LP_PAD,y,{w:800,size:36});}
  y+=4;const da=o.date==null?1:o.date;if(da>0.004)for(const l of lp_wrap(ctx,P.date,b.w-LP_PAD*2,{w:600,size:28})){y+=36;lp_T(ctx,l,b.x+LP_PAD,y,{w:600,size:28,col:LP.mut,a:da});}
  ctx.restore();return b;}
// where gap g's chip sits on its package's card (its left end and middle)
function gr_chipAt(ctx,g){const p=GR_GAPS[g].p,b=gr_cardBox(p);let x=b.x+LP_PAD;for(const j of gr_gapsOf(p)){if(j===g)break;x+=gr_tagW(ctx,GR_GAPS[j].chip)+14;}return[x,b.y+b.h-44];}
// where gap g's slip waits before the packages: two rows at the top, in the order the packages take them
const GR_SLIPROWS=[[1,2,3,4,5],[0,6,8,7]];
function gr_slipAt(ctx,g){for(let r=0;r<2;r++){const row=GR_SLIPROWS[r],k=row.indexOf(g);if(k<0)continue;const ws=row.map(j=>gr_tagW(ctx,GR_GAPS[j].chip)),tot=ws.reduce((s,v)=>s+v,0)+24*(row.length-1);
    let x=(W-tot)/2;for(let j=0;j<k;j++)x+=ws[j]+24;return[x,176+r*70];}return[0,0];}
// the nine slips: each waits at the top (o.in[g], 0 to 1), then goes to its card (o.go[g], 0 to 1): it sinks a little and fades at the top
// as its chip settles on the card from a little above, so it never crosses the words on the cards between; o.ga[g] (the chip's alpha); o.a
function gr_slips(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;
  GR_GAPS.forEach((G,g)=>{const f=o.in?clamp(o.in[g],0,1):1;if(f<=0.004)return;const s=gr_slipAt(ctx,g),e=gr_chipAt(ctx,g),u=o.go?clamp(o.go[g],0,1):0;
    const sa=1-ag_sine(clamp(u*2,0,1)),ea=ag_sine(clamp(u*2-1,0,1));
    if(sa>0.004)lp_tag(ctx,s[0],s[1]+24*ag_sine(u),G.chip,{col:LP.amber,a:a*f*sa});
    if(ea>0.004)lp_tag(ctx,e[0],e[1]-24*(1-ag_sine(u)),G.chip,{col:LP.amber,a:a*f*ea*(o.ga?o.ga[g]:1)});});}

/* ---------------------------------------------------------------- the packages in order */
// each package's tile: the two that come first on the left, what they unlock beside them, the two that go alongside on the right
const GR_TILE={w:400,h:170,at:[[120,230],[720,480],[1240,230],[120,480],[720,230],[1240,480]]};
const gr_tileBox=i=>({x:GR_TILE.at[i][0],y:GR_TILE.at[i][1],w:GR_TILE.w,h:GR_TILE.h});
// a package's tile: its number and owner, and its short name; o.a, o.k, o.dim (0 to 1), o.hi (a blue edge)
function gr_tile(ctx,i,o){o=o||{};const P=GR_PACKS[i],b=gr_tileBox(i),a=(o.a==null?1:o.a)*(1-0.5*(o.dim||0));if(a<=0.004)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,b.x+b.w/2,b.y+b.h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,b.x,b.y,b.w,b.h,{col:LP.blue,light:"day",pin:false});
  if(o.hi>0.004){ctx.strokeStyle=rgba(LP.blue,o.hi);ctx.lineWidth=5;rr(ctx,b.x-9,b.y-9,b.w+18,b.h+18,12);ctx.stroke();}
  lp_T(ctx,(P.n+" · "+P.who+"'s").toUpperCase(),b.x+LP_PAD,b.y+56,{w:800,size:28,ls:3,col:LP.blue});
  let y=b.y+56;for(const l of lp_wrap(ctx,P.short,b.w-LP_PAD*2,{w:800,size:36})){y+=46;lp_T(ctx,l,b.x+LP_PAD,y,{w:800,size:36});}
  ctx.restore();return b;}

/* ---------------------------------------------------------------- three stages */
const GR_STAGES=[
  {kick:"Stage one",date:"Thursday 30 September 2027",firm:"To the day",items:["One front door","One list","The measures page","The first three data partners"]},
  {kick:"Stage two",date:"End of March 2028",firm:"To the month",items:["One platform, the old warehouse gone","Every product owned","Agents with mandates"]},
  {kick:"Stage three",date:"End of 2028",firm:"To the year",items:["All seven partners building their own products"]}];
const GR_COL={x0:110,y:352,w:540,h:520,dx:580};
const gr_colBox=i=>({x:GR_COL.x0+i*GR_COL.dx,y:GR_COL.y,w:GR_COL.w,h:GR_COL.h});
// where a stage's items begin (the first line's baseline), below its date and the line that says how firm the date is
function gr_itemsY(ctx,i){const b=gr_colBox(i);return b.y+62+lp_wrap(ctx,GR_STAGES[i].date,b.w-LP_PAD*2,{w:800,size:36}).length*46+44+50;}
// a stage's column: o.a, o.k; o.date (0 to 1, its date); o.u[k] (0 to 1, each item); o.firm (0 to 1: how firm its date is, said in a line
// under it and drawn as an edge round it: solid for the day, dashed for a month, dotted for a year); o.works (0 to 1, a green pill at the foot)
function gr_stage(ctx,i,o){o=o||{};const S=GR_STAGES[i],b=gr_colBox(i),a=o.a==null?1:o.a;if(a<=0.004)return b;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,b.x+b.w/2,b.y+b.h/2,lerp(0.8,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,b.x,b.y,b.w,b.h,{col:LP.blue,light:"day",pin:false});
  lp_T(ctx,S.kick.toUpperCase(),b.x+LP_PAD,b.y+56,{w:800,size:28,ls:3,col:LP.blue});
  const dl=lp_wrap(ctx,S.date,b.w-LP_PAD*2,{w:800,size:36}),da=o.date==null?1:o.date,fm=o.firm||0;
  if(da>0.004){ctx.save();ctx.globalAlpha*=ag_sine(da);let y=b.y+62;for(const l of dl){y+=46;lp_T(ctx,l,b.x+LP_PAD,y,{w:800,size:36});}
    if(fm>0.004){const top=b.y+72,hh=50+46*(dl.length-1),ww=Math.max(...dl.map(l=>lp_tw(ctx,l,{w:800,size:36})))+28;ctx.save();ctx.globalAlpha*=ag_sine(fm);ctx.strokeStyle=rgba(LP.blue,0.9);ctx.lineWidth=3;
      ctx.setLineDash(i===0?[]:i===1?[14,10]:[3,9]);ctx.lineCap="round";rr(ctx,b.x+LP_PAD-14,top,ww,hh,10);ctx.stroke();ctx.restore();
      lp_T(ctx,S.firm,b.x+LP_PAD,b.y+62+dl.length*46+44,{w:600,size:28,col:LP.mut,a:ag_sine(fm)});}
    ctx.restore();}
  let y=gr_itemsY(ctx,i)-38;S.items.forEach((s,k)=>{const f=o.u?clamp(o.u[k],0,1):1,ls=lp_wrap(ctx,s,b.w-LP_PAD*2-34,{w:600,size:28});
    ctx.save();ctx.globalAlpha*=ag_sine(f);ls.forEach((l,j)=>{y+=38;if(j===0&&f>0.004){ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(b.x+LP_PAD+8,y-10,6,0,TAU);ctx.fill();}
      if(f>0.004)lp_T(ctx,l,b.x+LP_PAD+34,y,{w:600,size:28});});y+=12;ctx.restore();});
  if(o.works>0.004)lp_pill(ctx,b.x+b.w/2,b.y+b.h-40,"Works on its own",{col:LP.green,icon:"tick",a:o.works,k:o.wk});
  ctx.restore();return b;}

/* ---------------------------------------------------------------- the data strategy on one page */
const GR_PAGE={x:100,y:140,w:1720,h:740};
const GR_PANEL=[
  {kick:"The university's goals",lines:["Students who succeed","Research that reaches people","A campus used well","Finances that last"]},
  {kick:"What data must do",lines:["Reach the people who decide","Quickly","From one trusted copy"]},
  {kick:"Five principles",lines:["Start from the decision","One copy, governed once","Owners in the business","Simple before clever","Measure what people use"]},
  {kick:"The target",pic:"ring"},
  {kick:"The roadmap",pic:"stages"},
  {kick:"The measures",lines:["Days from ask to first use","Products with an owner","People using them"]}];
const gr_panelBox=i=>({x:140+(i%3)*553,y:226+Math.floor(i/3)*326,w:533,h:310});
// the target in one picture: the team in the middle, seven data partners around it
function gr_ring(ctx,cx,cy,R,u){ctx.save();ctx.strokeStyle=rgba(LP.blue,0.45);ctx.lineWidth=4;
  for(let i=0;i<7;i++){const f=clamp(u*7-i,0,1);if(f<=0)continue;const an=-Math.PI/2+i*TAU/7;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(an)*R*f,cy+Math.sin(an)*R*f);ctx.stroke();}
  for(let i=0;i<7;i++){const f=ag_spr(u*7-i,0,0.5);if(f<=0)continue;const an=-Math.PI/2+i*TAU/7;ctx.fillStyle=rgba(LP.paper,1);ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(cx+Math.cos(an)*R,cy+Math.sin(an)*R,R*0.2*f,0,TAU);ctx.fill();ctx.stroke();}
  ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(cx,cy,R*0.34,0,TAU);ctx.fill();ctx.restore();}
// the roadmap in small: three stages, each a block with its date, and the six packages as dots in them
// the three stages as blocks, the two near ones wider (their dates are longer, and they hold more)
function gr_road(ctx,x,y,w,u){const BW=[0.37,0.37,0.26].map(q=>(w-24)*q),dates=["Sep 2027","Mar 2028","2028"],dots=[[0,4,2],[1,3,5],[2]];
  for(let i=0;i<3;i++){const f=ag_sine(clamp(u*3-i,0,1));if(f<=0.004)continue;const bw=BW[i],bx=x+BW.slice(0,i).reduce((s,v)=>s+v+12,0);ctx.save();ctx.globalAlpha*=f;
    ctx.fillStyle=rgba(LP.blue,0.08);rr(ctx,bx,y,bw,150,10);ctx.fill();ctx.strokeStyle=rgba(LP.blue,0.9);ctx.lineWidth=3;if(i)ctx.setLineDash(i===1?[12,8]:[3,8]);ctx.lineCap="round";rr(ctx,bx,y,bw,150,10);ctx.stroke();ctx.setLineDash([]);
    lp_T(ctx,dates[i],bx+bw/2,y+48,{w:800,size:28,align:"center"});
    dots[i].forEach((p,k)=>{ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(bx+bw/2+(k-(dots[i].length-1)/2)*36,y+104,11,0,TAU);ctx.fill();});
    ctx.restore();}}
// the page: o.a; o.u[i] (0 to 1, each panel); o.hi[i] (a panel lit as it's read); o.k
function gr_onePage(ctx,o){o=o||{};const P=GR_PAGE,a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,P.x+P.w/2,P.y+P.h/2,lerp(0.85,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,P.x,P.y,P.w,P.h,{col:LP.blue,light:"day",pin:false});
  lp_T(ctx,"THE DATA STRATEGY, ON ONE PAGE",P.x+40,P.y+64,{w:800,size:28,ls:3,col:LP.blue});
  GR_PANEL.forEach((pn,i)=>{const b=gr_panelBox(i),f=o.u?clamp(o.u[i],0,1):1,hi=o.hi?clamp(o.hi[i],0,1):0;
    ctx.fillStyle=rgba(LP.mut,0.05);rr(ctx,b.x,b.y,b.w,b.h,10);ctx.fill();
    if(hi>0.004){ctx.strokeStyle=rgba(LP.blue,hi);ctx.lineWidth=5;rr(ctx,b.x-4,b.y-4,b.w+8,b.h+8,12);ctx.stroke();}
    if(f<=0.004)return;ctx.save();ctx.globalAlpha*=ag_sine(f);
    lp_T(ctx,pn.kick.toUpperCase(),b.x+28,b.y+50,{w:800,size:28,ls:2.5,col:LP.mut});
    if(pn.lines)pn.lines.forEach((s,k)=>lp_T(ctx,s,b.x+28,b.y+100+k*42,{w:600,size:28}));
    if(pn.pic==="ring")gr_ring(ctx,b.x+b.w/2,b.y+182,92,f);
    if(pn.pic==="stages")gr_road(ctx,b.x+28,b.y+96,b.w-56,f);
    ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the data council */
// the dean of Arts: a woman, unnamed, drawn only here; dressed plainly, clear of the five colours that mean something. Looked at full
// size, facing both ways, on 10 November 2026
const GR_DEAN={key:"grDean",name:"The dean of Arts",role:"",skin:[190,142,110],hair:{style:"bob",c:[178,172,168]},glasses:[60,50,46],earrings:[214,200,170],
  top:{kind:"blazer",c:[98,88,84],inner:[230,224,216]},breath:0.27};
// the name plates on the table, each a small folded card: [x (its middle), text, a]
function gr_plates(ctx,y,list){for(const [x,s,a] of list){if(a<=0.004)continue;const w=lp_tw(ctx,s,{w:700,size:28})+44;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.28)";ctx.shadowBlur=8;ctx.shadowOffsetX=LP.sdx*0.4;ctx.shadowOffsetY=4;ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(x-w/2,y-46,w,50);ctx.restore();
  ctx.fillStyle=rgba(LP.shade,0.1);ctx.fillRect(x-w/2,y-46,w,6);lp_T(ctx,s,x,y-11,{w:700,size:28,align:"center"});ctx.restore();}}
// the one page as it hangs on the council room's wall, small: its title, and its six panels as grey lines (no words but the title)
function gr_pageSmall(ctx,x,y,w,a){if(a<=0.004)return;const h=w*0.36;ctx.save();ctx.globalAlpha*=a;lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:"late",pin:false});
  lp_T(ctx,"THE DATA STRATEGY",x+28,y+58,{w:800,size:28,ls:3,col:LP.blue});
  for(let i=0;i<6;i++){const bx=x+24+(i%3)*((w-48)/3),by=y+80+Math.floor(i/3)*((h-100)/2),bw=(w-48)/3-14,bh=(h-100)/2-12;ctx.fillStyle=rgba(LP.mut,0.06);ctx.fillRect(bx,by,bw,bh);
    ctx.fillStyle=rgba(LP.mut,0.28);for(let k=0;k<3;k++)ctx.fillRect(bx+12,by+14+k*14,bw*(k?0.62:0.78),4);}
  ctx.restore();}
