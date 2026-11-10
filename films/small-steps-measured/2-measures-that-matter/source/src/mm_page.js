/* ===== Measures that matter: the measures page =====
   The data team's measures on one page: a dashboard on the platform, on the screen in the team's room (prefix mm_). Eight measures in
   three groups, each a line across the months with its baseline drawn beneath it, never one number lit red or green; one measure
   opened large; and the one definition of a measure, in the catalog's glossary.
     MM_MEASURES  the eight measures: the name on the page, the group, the readings (the module's numbers where it sets them, labelled;
                  the months between drawn on the way, never labelled), the baseline (or, for load, the team's limit)
     mm_page      the page on a screen's glass: o.now (the date it's drawn to: a month's index, 0 January 2027 to 11 December, and the
                  days as a fraction), o.u (one number a measure, 0 to 1: it comes in), o.groups (0 to 1: the groups' names), o.hl (a
                  measure's index, or a list of them: picked out, the others quieter), o.over (0 to 1: load over its limit, in amber),
                  o.owner (0 to 1: the page's owner, at its top)
     mm_chart     one measure's line, large, on the glass (or on a sheet, o.sheet): the months under it, the baseline or the limit on a
                  slip, the readings the module's numbers set labelled where o.labels lists them, once the line has reached them
     mm_events    decisions informed, large: the months, and each decision a dot with its maker's name, once its day has come
     mm_case      a benefit against its case, large: the case, the benefit a year, from when, and who owns it
     mm_glossary  the catalog's glossary on a screen's glass: the term, its one definition, its owner, where it's counted
     mm_rework    a piece of work sent out and sent back, round a loop: o.u (0 to 1), o.a
   Colour keeps the module's meaning: each measure's line in orange (data); its baseline a quiet dashed line; waiting, work sent back
   and too much open at once in amber; a definition and the page's design in blue; a decision informed and a benefit in green. */

// a date as a month's index (0: January 2027) and its days
const mm_at=(m,d)=>m+(d-1)/[31,28,31,30,31,30,31,31,30,31,30,31][m];
const MM_MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MM_JUL15=mm_at(6,15),MM_AUG12=mm_at(7,12),MM_SEP15=mm_at(8,15),MM_JUN24=mm_at(5,24),MM_DEC17=mm_at(11,17),MM_DEC31=mm_at(11,31);
// a month's figure sits in its middle; a reading of a day (load, and promises met on 12 August) on that day
const mm_mid=m=>m+0.5;
const MM_MEASURES=[
  {id:"ask",name:"Ask to first use",full:"Days from ask to first use",group:0,lo:0,hi:46,tlo:8,thi:46,base:41,
    pts:[[mm_mid(1),41],[mm_mid(2),41],[mm_mid(3),37],[mm_mid(4),30],[mm_mid(5),24],[mm_mid(6),22],[mm_mid(7),20],[mm_mid(8),18],[mm_mid(9),17],[mm_mid(10),15],[mm_mid(11),14]],
    say:{0:"41",4:"24",10:"14"}},
  {id:"back",name:"Sent back",full:"Sent back for changes",group:0,lo:0,hi:16,tlo:3,thi:14,base:12,
    pts:[[mm_mid(6),12],[mm_mid(7),11],[mm_mid(8),10],[mm_mid(9),8],[mm_mid(10),7],[mm_mid(11),6]],say:{0:"12%",5:"6%"}},
  {id:"load",name:"Work open at once",full:"Work open at once",group:0,lo:0,hi:11,tlo:2,thi:11,limit:6,
    pts:[[MM_JUL15,7],[MM_AUG12,9],[MM_SEP15,6],[mm_mid(9),6],[mm_mid(10),5],[mm_mid(11),6]],say:{1:"9",2:"6"}},
  {id:"promise",name:"Promises met",full:"Products' promises met",group:1,lo:40,hi:100,tlo:50,thi:92,base:58,
    pts:[[mm_mid(2),58],[mm_mid(3),62],[mm_mid(4),66],[mm_mid(5),71],[mm_mid(6),77],[MM_AUG12,82],[mm_mid(8),83],[mm_mid(9),84],[mm_mid(10),85],[mm_mid(11),86]],say:{0:"58%",5:"82%",9:"86%"}},
  {id:"benefit",name:"Benefits against each case",group:2,kind:"case"},
  {id:"decision",name:"Decisions informed",group:2,kind:"events",events:[[MM_JUN24,"The University Council"]]},
  {id:"people",name:"People using products",full:"People using products each month",group:2,lo:0,hi:1000,tlo:250,thi:1000,base:340,
    pts:[[mm_mid(2),340],[mm_mid(3),390],[mm_mid(4),450],[mm_mid(5),520],[mm_mid(6),580],[mm_mid(7),640],[mm_mid(8),700],[mm_mid(9),770],[mm_mid(10),840],[mm_mid(11),910]],say:{0:"340",9:"910"}},
  {id:"questions",name:"Two questions",group:2,kind:"questions"}];
const MM_GROUPS=["Delivery","Data management","Value"];
const mm_idx=id=>MM_MEASURES.findIndex(m=>m.id===id);

// a measure's readings up to `now`, each joined on over a few days as the date passes it: [[x, y], ...] in the box's frame
function mm_line(m,now,X,Y,w,h){const fx=t=>X+w*(t-1)/11,fy=v=>Y+h*(1-(v-m.lo)/(m.hi-m.lo)),out=[];
  m.pts.forEach(([t,v],i)=>{if(t>now)return;const k=clamp((now-t)/0.12,0,1);if(i>0&&k<1&&out.length){const p=out[out.length-1];out.push([lerp(p[0],fx(t),k),lerp(p[1],fy(v),k)]);}else out.push([fx(t),fy(v)]);});
  return{out,fx,fy};}
// the baseline (dashed, quiet) or the limit (dashed, turning amber when the line is over it), across the box; returns its height
function mm_level(ctx,m,X,Y,w,h,o){const v=m.base!=null?m.base:m.limit;if(v==null)return null;const y=Y+h*(1-(v-m.lo)/(m.hi-m.lo));
  ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=m.limit!=null?rgba(mix(LP.mut,LP.amber,o&&o.over||0),0.9):rgba(LP.mut,0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(X,y);ctx.lineTo(X+w,y);ctx.stroke();ctx.restore();return y;}
function mm_stroke(ctx,pts,col,lw){if(pts.length<1)return;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=lw;ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))ctx.lineTo(p[0],p[1]);ctx.stroke();
  const e=pts[pts.length-1];ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(e[0],e[1],lw*1.5,0,TAU);ctx.fill();}
// load over its limit: the part of the line above it, again, in amber
function mm_overLimit(ctx,pts,ly,lw,a){if(!(a>0)||ly==null)return;ctx.save();ctx.beginPath();ctx.rect(-W,-H,W*4,ly+H);ctx.clip();ctx.globalAlpha*=a;mm_stroke(ctx,pts,LP.amber,lw+1);ctx.restore();}
// a word on a slip of paper, its left end at x, its middle at y
function mm_slip(ctx,x,y,text,col){const tw=lp_tw(ctx,text,{w:800,size:28});ctx.save();ctx.shadowColor="rgba(52,36,30,0.18)";ctx.shadowBlur=6;ctx.shadowOffsetX=LP.sdx*0.3;ctx.shadowOffsetY=2;
  ctx.fillStyle=rgba(LP.paper,1);rr(ctx,x,y-19,tw+26,38,6);ctx.fill();ctx.restore();lp_T(ctx,text,x+13,y+10,{w:800,size:28,col:col||LP.mut});}

/* ---------------------------------------------------------------- one measure on the page */
function mm_tile(ctx,x,y,w,h,m,o){o=o||{};const pad=18,nl=lp_wrap(ctx,m.name,w-2*pad,{w:700,size:28});
  ctx.fillStyle="rgba(255,255,255,0.92)";rr(ctx,x,y,w,h,10);ctx.fill();ctx.strokeStyle=rgba(LP.mut,0.3);ctx.lineWidth=2;rr(ctx,x,y,w,h,10);ctx.stroke();
  nl.forEach((l,i)=>lp_T(ctx,l,x+pad,y+40+i*34,{w:700,size:28}));
  const cy=y+40+nl.length*34,ch=y+h-pad-cy,cw=w-2*pad,cx=x+pad;
  if(m.kind==="case"){lp_T(ctx,"A$270,000 a year",cx,cy+24,{w:800,size:28,col:LP.green});lp_T(ctx,"from January 2028",cx,cy+60,{w:600,size:28,col:LP.mut});return;}
  if(m.kind==="questions"){for(let i=0;i<2;i++){const bx=cx+4+i*86,by=cy+10;ctx.strokeStyle=rgba(LP.blue,0.9);ctx.lineWidth=3;rr(ctx,bx,by,68,48,12);ctx.stroke();
      ctx.beginPath();ctx.moveTo(bx+16,by+48);ctx.lineTo(bx+10,by+64);ctx.lineTo(bx+30,by+48);ctx.stroke();lp_T(ctx,"?",bx+34,by+36,{w:800,size:28,align:"center",col:LP.blue});}
    lp_T(ctx,"Twice a year",cx,cy+120,{w:600,size:28,col:LP.mut});return;}
  if(m.kind==="events"){const ly=cy+ch*0.55;ctx.strokeStyle=rgba(LP.mut,0.5);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx,ly);ctx.lineTo(cx+cw,ly);ctx.stroke();
    for(const [t] of m.events){if(t>(o.now||0))continue;const ex=cx+cw*(t-1)/11;ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(ex,ly,10,0,TAU);ctx.fill();}return;}
  const mt=m.tlo!=null?Object.assign({},m,{lo:m.tlo,hi:m.thi}):m,now=o.now||0;
  if(m.pts[0][0]>now){lp_T(ctx,"From "+["January","February","March","April","May","June","July","August","September","October","November","December"][Math.floor(m.pts[0][0])],cx,cy+ch*0.55,{w:600,size:28,col:LP.mut});return;}
  const top=cy+12,hh=ch-14,L=mm_line(mt,now,cx,top,cw,hh),ly=mm_level(ctx,mt,cx,top,cw,hh,o);mm_stroke(ctx,L.out,LP.orange,5);
  if(m.limit!=null)mm_overLimit(ctx,L.out,ly,5,o.over||0);}

/* ---------------------------------------------------------------- the page */
const MM_PAGE={pad:28,gap:18,head:74,gh:40,th:226,rowGap:22};
function mm_tileBox(X,Y,Wd,i){const P0=MM_PAGE,tw=(Wd-2*P0.pad-3*P0.gap)/4,r=i<4?0:1,c=i%4;return{x:X+P0.pad+c*(tw+P0.gap),y:Y+P0.head+r*(P0.gh+P0.th+P0.rowGap)+P0.gh+6,w:tw,h:P0.th};}
function mm_page(ctx,X,Y,Wd,Hd,o){o=o||{};const P0=MM_PAGE,tw=(Wd-2*P0.pad-3*P0.gap)/4,hl=o.hl==null?null:[].concat(o.hl);
  lp_T(ctx,"The data team's measures",X+P0.pad,Y+52,{w:800,size:36});
  if((o.owner||0)>0)lp_tag(ctx,X+Wd-P0.pad,Y+42,"Owner: Helena Novak",{align:"right",col:LP.blue,a:o.owner});
  const rowY=r=>Y+P0.head+r*(P0.gh+P0.th+P0.rowGap);
  // the groups' names over their measures, each with a quiet rule
  const ga=clamp(o.groups==null?1:o.groups,0,1);
  if(ga>0){ctx.save();ctx.globalAlpha*=ga;for(const [g,r,c0,c1] of [[0,0,0,3],[1,0,3,4],[2,1,0,4]]){const gx=X+P0.pad+c0*(tw+P0.gap),gw=(c1-c0)*(tw+P0.gap)-P0.gap,gy=rowY(r);
      lp_T(ctx,MM_GROUPS[g],gx,gy+28,{w:800,size:28,col:LP.mut});ctx.fillStyle=rgba(LP.mut,0.35);ctx.fillRect(gx,gy+38,gw,2);}ctx.restore();}
  MM_MEASURES.forEach((m,i)=>{const k=o.u?clamp(o.u[i]||0,0,1):1;if(k<=0)return;const b=mm_tileBox(X,Y,Wd,i);
    ctx.save();ctx.globalAlpha*=ag_sine(k)*(hl&&hl.indexOf(i)<0?0.36:1);ctx.translate(0,(1-ag_spr(k,0,0.5))*14);mm_tile(ctx,b.x,b.y,b.w,b.h,m,o);ctx.restore();});}

/* ---------------------------------------------------------------- one measure, large */
// x, y, w, h: its box on the glass (or a sheet, o.sheet); o.now; o.title (m.full by default), o.kick; o.labels: indices of the readings
// to label; o.levelLabel: the words on the baseline's (or limit's) slip; o.over; o.monthStep (1, or 2 for a chart half as wide)
function mm_chart(ctx,x,y,w,h,m,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const pad=o.sheet?LP_PAD:12;if(o.sheet)lp_sheet(ctx,x,y,w,h,{col:o.col||null,light:o.light});
  let ty=y+pad+28;if(o.kick){lp_T(ctx,String(o.kick).toUpperCase(),x+pad,ty,{w:800,size:28,ls:3,col:o.kickCol||LP.mut});ty+=50;}
  lp_T(ctx,o.title||m.full||m.name,x+pad,ty+14,{w:800,size:40});
  const cx=x+pad+16,cw=w-2*pad-32,top=ty+64,cb=y+h-pad-52,ch=cb-top,step=o.monthStep||1;
  for(let mo=1;mo<=11;mo+=step){const mx=cx+cw*(mo+0.5-1)/11;lp_T(ctx,MM_MONTHS[mo],mx,cb+44,{w:600,size:28,align:"center",col:LP.mut});}
  ctx.fillStyle=rgba(LP.mut,0.4);ctx.fillRect(cx,cb+4,cw,2);
  const ly=mm_level(ctx,m,cx,top,cw,ch,o),L=mm_line(m,o.now||0,cx,top,cw,ch);mm_stroke(ctx,L.out,LP.orange,6);
  if(m.limit!=null)mm_overLimit(ctx,L.out,ly,6,o.over||0);
  if(ly!=null&&o.levelLabel)mm_slip(ctx,cx+(o.levelRight?cw-lp_tw(ctx,o.levelLabel,{w:800,size:28})-26:0),ly+(o.levelAbove?-30:30),o.levelLabel,m.limit!=null?mix(LP.mut,LP.amber,o.over||0):LP.mut);
  // the readings the voice says, over their points, once the line has reached them
  for(const i of (o.labels||[])){const p=m.pts[i];if(!p||p[0]>(o.now||0))continue;const k=clamp(((o.now||0)-p[0])/0.2,0,1),px=L.fx(p[0]),py=L.fy(p[1]);
    ctx.save();ctx.globalAlpha*=k;ctx.fillStyle=rgba(m.limit!=null&&p[1]>m.limit?mix(LP.orange,LP.amber,o.over||0):LP.orange,1);ctx.beginPath();ctx.arc(px,py,9,0,TAU);ctx.fill();
    lp_T(ctx,m.say[i],px,py-24,{w:800,size:32,align:"center",col:(o.labelCol&&o.labelCol[i])||LP.ink});ctx.restore();}
  ctx.restore();}
// decisions informed: the months, and each decision a green dot with its maker's name over two lines, once its day has come
function mm_events(ctx,x,y,w,h,m,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const pad=12;
  lp_T(ctx,m.name,x+pad,y+pad+42,{w:800,size:40});const cx=x+pad+16,cw=w-2*pad-32,cb=y+h-pad-52,ly=cb-90,step=o.monthStep||1;
  for(let mo=1;mo<=11;mo+=step){const mx=cx+cw*(mo+0.5-1)/11;lp_T(ctx,MM_MONTHS[mo],mx,cb+44,{w:600,size:28,align:"center",col:LP.mut});}
  ctx.fillStyle=rgba(LP.mut,0.4);ctx.fillRect(cx,cb+4,cw,2);ctx.strokeStyle=rgba(LP.mut,0.5);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,ly);ctx.lineTo(cx+cw,ly);ctx.stroke();
  for(const [t,who] of m.events){if(t>(o.now||0))continue;const k=clamp(((o.now||0)-t)/0.15,0,1),ex=cx+cw*(t-1)/11;ctx.save();ctx.globalAlpha*=k;
    ctx.fillStyle=rgba(LP.green,1);ctx.beginPath();ctx.arc(ex,ly,14*ag_spr(k,0,0.5),0,TAU);ctx.fill();ctx.strokeStyle=rgba(LP.green,0.6);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ex,ly-16);ctx.lineTo(ex,ly-60);ctx.stroke();
    const ls=o.lines||[who];ls.forEach((l,j)=>lp_T(ctx,l,ex,ly-150+j*40,{w:j?600:800,size:28,align:"center",col:j?LP.ink:LP.green}));ctx.restore();}
  ctx.restore();}
// a benefit against its case: o.u (0 to 1: its lines come in)
function mm_case(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const pad=12,u=o.u==null?1:o.u;
  lp_T(ctx,"Benefits against each case",x+pad,y+pad+42,{w:800,size:40});
  lp_T(ctx,"RETIRING THE OLD WAREHOUSE",x+pad,y+pad+112,{w:800,size:28,ls:3,col:LP.mut});
  const rows=[["A$270,000 a year",LP.green,800,52],["From January 2028",LP.ink,600,32],["Owner: the director of digital services",LP.ink,600,32]];let yy=y+pad+184;
  rows.forEach(([s,col,wt,sz],i)=>{const k=clamp(u*3-i,0,1);if(k>0){ctx.save();ctx.globalAlpha*=ag_sine(k);lp_T(ctx,s,x+pad,yy,{w:wt,size:sz,col});ctx.restore();}yy+=sz+30;});
  ctx.restore();}
// two views side by side on the glass, a quiet rule between them
function mm_pair(ctx,X,Y,Wd,Hd,left,right){const g=40,hw=(Wd-g)/2-24;if(left)left(ctx,X+24,Y+20,hw,Hd-40);ctx.fillStyle=rgba(LP.mut,0.25);ctx.fillRect(X+Wd/2-1,Y+40,2,Hd-80);if(right)right(ctx,X+Wd/2+g/2,Y+20,hw,Hd-40);}

/* ---------------------------------------------------------------- the catalog's glossary */
const MM_DEF="Working days from a request reaching the one list to its first use by the person who asked, as they confirm it.";
function mm_glossary(ctx,X,Y,Wd,Hd,o){o=o||{};const u=o.u==null?1:o.u,pad=40,kw=262;
  ctx.fillStyle="rgb(240,237,229)";ctx.fillRect(X,Y,Wd,70);lp_T(ctx,"Catalog  ·  Glossary",X+pad,Y+46,{w:700,size:28,col:LP.mut});
  ctx.fillStyle=rgba(LP.blue,1);ctx.fillRect(X,Y+70,8,Hd-70);
  lp_T(ctx,"Days from ask to first use",X+pad,Y+140,{w:800,size:40});
  const rows=[["Definition",MM_DEF],["Owner","Helena Novak, data manager"],["Counted from","The tracker"]];let yy=Y+190;
  rows.forEach(([k,v],i)=>{const a=clamp(u*3-i,0,1),ls=lp_wrap(ctx,v,Wd-2*pad-kw,{w:600,size:30});if(a>0){ctx.save();ctx.globalAlpha*=ag_sine(a);
      lp_T(ctx,k.toUpperCase(),X+pad,yy+30,{w:800,size:28,ls:2,col:i===0?LP.blue:LP.mut});ls.forEach((l,j)=>lp_T(ctx,l,X+pad+kw,yy+30+j*42,{w:600,size:30}));ctx.restore();}
    yy+=Math.max(1,ls.length)*42+26;});}

/* ---------------------------------------------------------------- work sent out, and sent back */
// a piece of work leaves the team on the left for the person who asked on the right along the upper arc, and comes back along the
// lower one, in amber: rework. o.u (0 to 1: out by 0.5, back by 1), o.a
function mm_rework(ctx,x0,x1,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const u=clamp(o.u||0,0,1),dy=96;
  const arc=(up,k,col)=>{if(k<=0)return;ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.setLineDash([2,12]);ctx.beginPath();const n=40;
    for(let i=0;i<=n*k;i++){const s=i/n,px=up?lerp(x0,x1,s):lerp(x1,x0,s),py=y+(up?-1:1)*Math.sin(Math.PI*s)*dy;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}ctx.stroke();ctx.setLineDash([]);};
  arc(true,clamp(u*2,0,1),LP.mut);arc(false,clamp(u*2-1,0,1),LP.amber);
  // the piece of work itself, riding the arcs
  const s=u<0.5?u*2:(u-0.5)*2,up=u<0.5,e=ag_sine(s),px=up?lerp(x0,x1,e):lerp(x1,x0,e),py=y+(up?-1:1)*Math.sin(Math.PI*e)*dy;
  ctx.save();ctx.translate(px,py);ctx.rotate(up?-0.06:0.06);ctx.shadowColor="rgba(52,36,30,0.28)";ctx.shadowBlur=10;ctx.shadowOffsetX=LP.sdx*0.5;ctx.shadowOffsetY=5;
  ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(-46,-34,92,68);ctx.shadowColor="transparent";ctx.fillStyle=rgba(up?LP.mut:LP.amber,1);ctx.fillRect(-46,-34,92,8);
  for(let l=0;l<3;l++){ctx.fillStyle=rgba(mix(LP.mut,[255,255,255],0.5),1);ctx.fillRect(-32,-14+l*14,60-l*14,5);}ctx.restore();
  ctx.restore();}
