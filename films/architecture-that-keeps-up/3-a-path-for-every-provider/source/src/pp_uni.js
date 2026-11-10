/* ===== A path for every provider: the university, 2027 =====
   The film's own pictures for the data team's year (prefix pp_). The module's kit draws the rooms, the people, the sheets and the
   things in them, and is never changed for this film; what is here is this film's alone:
     ppJune, ppLate, ppGrey              the team's room on a June morning and late in the afternoon; Graham's office on a grey day
     pp_way(ctx, x, y, w, o)             the preferred way, on one page: three lines, and (o.tree) a second half under them
     pp_providers(ctx, x, y, w, o)       Sam's list: the four providers, and what each can give
     pp_tree(ctx, o)                     the decision tree: five questions down the left, each one's recommendation on the right
     pp_text(ctx, x, y, w, h, o)         the tree kept as text in the repository, on a screen
     pp_twin(ctx, o)                     the timetable and the platform, side by side, a class cancelled in one and still booked in the other
     pp_compare(ctx, x, y, o)            the nightly comparison: tonight's full list beside what the platform holds
     pp_lanes(ctx, o)                    four providers, four paths, all reaching the platform and the people who use the data
     pp_steps(ctx, o)                    each provider on a step, lifted towards the preferred way
     pp_counts(ctx, x, y, w, h, o)       Graham's page, on a screen: every room and lab, used and booked
   Colour keeps the module's meaning: orange the data and its providers, blue plans and designs (the preferred way, the tree's
   questions), green what's done or kept true (the preferred path, the counts), amber what's at risk or waiting (what the timetable
   never says, the file cut short, the next steps). */

AG_PLACES.ppJune=c=>lp_paintRoom(c,{light:"morning",seed:7});
AG_PLACES.ppLate=c=>lp_paintRoom(c,{light:"late",seed:9});
AG_PLACES.ppGrey=c=>lp_paintRoom(c,{light:"grey",seed:5});

// a sheet that springs in from t0 (and goes from o.out): lp_textSheet's words and options
function pp_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time
const pp_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function pp_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 and goes at t1
function pp_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a disc with an icon, springing in from t0
function pp_disc(ctx,t,t0,x,y,col,icon,r){if(t<t0)return;r=r||22;const f=lerp(0.6,1,ag_spr(t-t0,0,0.5));ctx.save();ctx.globalAlpha*=ag_in(t,t0,0.3);ctx.fillStyle=rgba(col,1);
  ctx.beginPath();ctx.arc(x,y,r*f,0,TAU);ctx.fill();lp_icon(ctx,icon,x,y,r*1.36*f,[255,255,255]);ctx.restore();}
// a line drawn from (x0, y0) to (x1, y1) as u goes 0 to 1, with an arrowhead once it arrives
function pp_arrow(ctx,x0,y0,x1,y1,u,o){o=o||{};u=ag_sine(clamp(u,0,1));if(u<=0)return;const col=o.col||LP.mut,w=o.w||5,xe=lerp(x0,x1,u),ye=lerp(y0,y1,u);
  ctx.save();ctx.globalAlpha*=(o.a==null?1:o.a)*clamp(u*6,0,1);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=w;ctx.lineCap="round";if(o.dash)ctx.setLineDash(o.dash);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);
  if(u>0.96){const an=Math.atan2(y1-y0,x1-x0),s=w*3;ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(xe,ye);ctx.lineTo(xe-s*Math.cos(an-0.5),ye-s*Math.sin(an-0.5));
    ctx.lineTo(xe-s*Math.cos(an+0.5),ye-s*Math.sin(an+0.5));ctx.closePath();ctx.fill();}ctx.restore();}

/* ---------------------------------------------------------------- small pictures, in one quiet colour */
function pp_icon(c,kind,x,y,col,s){s=s||1;c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle=rgba(col,1);c.fillStyle=rgba(col,1);c.lineWidth=4;c.lineCap="round";c.lineJoin="round";
  if(kind==="sensor"){c.beginPath();c.moveTo(-30,-18);c.lineTo(30,-18);c.stroke();c.beginPath();c.arc(0,-16,11,0,Math.PI);c.fill();c.lineWidth=3;for(const r of [20,30]){c.beginPath();c.arc(0,-16,r,Math.PI*0.3,Math.PI*0.7);c.stroke();}}
  else if(kind==="grid"){for(let i=0;i<4;i++)for(let j=0;j<3;j++){const bx=-30+i*16,by=-22+j*16;if((i+j)%3===1)c.fillRect(bx,by,12,12);else{c.lineWidth=2;c.strokeRect(bx+1,by+1,10,10);}}}
  else if(kind==="file"){c.lineWidth=3.5;c.beginPath();c.moveTo(-18,-24);c.lineTo(8,-24);c.lineTo(20,-12);c.lineTo(20,24);c.lineTo(-18,24);c.closePath();c.stroke();c.beginPath();c.moveTo(8,-24);c.lineTo(8,-12);c.lineTo(20,-12);c.stroke();
    for(const ly of [-2,8,18]){c.beginPath();c.moveTo(-10,ly);c.lineTo(12,ly);c.stroke();}}
  else if(kind==="sheet"){c.lineWidth=3;c.strokeRect(-26,-22,52,44);for(const ly of [-8,6]){c.beginPath();c.moveTo(-26,ly);c.lineTo(26,ly);c.stroke();}for(const lx of [-8,10]){c.beginPath();c.moveTo(lx,-22);c.lineTo(lx,22);c.stroke();}}
  c.restore();}

/* ---------------------------------------------------------------- the preferred way, on one page
   o: a, k (springs in), u (0 to 1 per line, three lines: in one by one), light; tree (0 to 1: the second half, the decision tree's
   name and a small tree drawn under the lines); next (0 to 1: a third part, each provider's next step). Returns its box. */
const PP_WAY=["Publishes its data as a governed product, with an owner and a contract","Sends each change as an event, the moment it happens","Says what was deleted, so a deletion reaches every copy"];
function pp_way(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||(o.tree!=null?690:470);if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});
  lp_T(ctx,"THE PREFERRED WAY",x+40,y+82,{w:800,size:28,ls:3,col:LP.blue});lp_T(ctx,"How data should reach us",x+40,y+134,{w:800,size:40});
  const U=o.u||[1,1,1];let yy=y+190;
  PP_WAY.forEach((s,i)=>{const ls=lp_wrap(ctx,s,w-120,{w:600,size:30}),la=ag_sine(clamp(U[i]||0,0,1));ctx.save();ctx.globalAlpha*=la;
    ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(x+52,yy+22,16,0,TAU);ctx.fill();lp_T(ctx,String(i+1),x+52,yy+32,{w:800,size:28,align:"center",col:LP.paper});
    ls.forEach((l,j)=>lp_T(ctx,l,x+88,yy+34+j*40,{w:600,size:30}));ctx.restore();yy+=ls.length*40+34;});
  const tr=ag_sine(o.tree||0);if(tr>0){ctx.save();ctx.globalAlpha*=tr;const ty=y+h-230;ctx.strokeStyle=rgba(LP.mut,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+40,ty);ctx.lineTo(x+w-40,ty);ctx.stroke();
    lp_T(ctx,"AND FOR THE REST",x+40,ty+52,{w:800,size:28,ls:3,col:LP.blue});lp_T(ctx,"A decision tree",x+40,ty+100,{w:800,size:36});
    pp_miniTree(ctx,x+w-300,ty+30,260,170,{u:1});ctx.restore();}
  ctx.restore();return{x,y,w,h};}
// a small tree, a picture only (no words): five questions down a stem, each with its leaf
function pp_miniTree(c,x,y,w,h,o){o=o||{};const u=o.u==null?1:o.u;c.save();c.lineCap="round";const sx=x+30,n=5,dy=h/(n-0.4);
  for(let i=0;i<n;i++){const v=clamp(u*n-i,0,1);if(v<=0)break;const yy=y+12+i*dy;c.globalAlpha=v;
    if(i>0){c.strokeStyle=rgba(LP.mut,0.6);c.lineWidth=3;c.beginPath();c.moveTo(sx,yy-dy+10);c.lineTo(sx,yy-10);c.stroke();}
    c.fillStyle=rgba(LP.blue,1);c.save();c.translate(sx,yy);c.rotate(Math.PI/4);c.fillRect(-9,-9,18,18);c.restore();
    c.strokeStyle=rgba(LP.mut,0.6);c.lineWidth=3;c.beginPath();c.moveTo(sx+14,yy);c.lineTo(x+w-70,yy);c.stroke();
    c.fillStyle=rgba(i===0?LP.green:LP.mut,i===0?1:0.7);rr(c,x+w-66,yy-10,62,20,6);c.fill();}
  c.restore();}

/* ---------------------------------------------------------------- Sam's list: the providers, and what each can give
   o: a, k, rows (0 to 1 each: written in), light. Each row: an icon in orange (data), its name, and a pill for what it can give. */
const PP_PROV=[
  {name:"The rooms' sensors",icon:"sensor",give:"All of it",col:LP.green},
  {name:"Payroll, from 2004",icon:"file",give:"One file a night",col:LP.amber},
  {name:"The new timetable",icon:"grid",give:"Changes, no deletions",col:LP.amber},
  {name:"The Health labs",icon:"sheet",give:"A spreadsheet",col:LP.amber}];
function pp_providers(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=560;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:o.light});
  lp_T(ctx,"WHERE OUR DATA COMES FROM",x+40,y+82,{w:800,size:28,ls:3,col:LP.orange});lp_T(ctx,"What each provider can give",x+40,y+134,{w:800,size:40});
  const R=o.rows||[];PP_PROV.forEach((p,i)=>{const v=ag_sine(clamp(R[i]||0,0,1));if(v<=0)return;const ry=y+206+i*88;ctx.save();ctx.globalAlpha*=v;
    pp_icon(ctx,p.icon,x+76,ry+28,LP.orange,0.9);lp_T(ctx,p.name,x+128,ry+40,{w:700,size:32});
    lp_pill(ctx,x+w-40-lp_tw(ctx,p.give,{w:700,size:28})/2-34,ry+28,p.give,{col:p.col,size:28});
    if(i<PP_PROV.length-1){ctx.strokeStyle=rgba(LP.mut,0.2);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+40,ry+72);ctx.lineTo(x+w-40,ry+72);ctx.stroke();}ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the decision tree
   Five questions down the left (blue: design), joined by a stem; each one's recommendation on the right, joined by its "yes" (or, for
   the third, its "no"). o: a, rows (0 to 1 each: a question and its answer drawn in), hl (index of a row picked out, or null: the others
   quieter), dimAll (0 to 1), ticks (0 to 1: a green tick on every recommendation), sheet (true: on its own big sheet), light. */
const PP_TREE={x:96,y:118,w:1728,h:752,qx:190,qw:680,ax:1020,aw:760,rowY:[190,324,458,592,726],rh:100};
const PP_ROWS=[
  {q:"Can it send each change as an event?",yes:"Yes",a:"Use the events",col:LP.green,pref:true},
  {q:"If not, can it give its changes since a time?",yes:"Yes",a:"Fetch the changes every hour",col:LP.ink},
  {q:"Can it say what was deleted?",yes:"No",a:"Compare its full list with ours every night",col:LP.ink,indent:90},
  {q:"Only a file?",yes:"Yes",a:"Take the whole file each night, and compare",col:LP.ink},
  {q:"A spreadsheet?",yes:"Yes",a:"A data partner moves it into a governed table, with an owner",col:LP.ink}];
function pp_tree(ctx,o){o=o||{};const P=PP_TREE,a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(o.sheet!==false){lp_sheet(ctx,P.x,P.y,P.w,P.h,{col:LP.blue,light:o.light,pin:false});}
  const R=o.rows||[1,1,1,1,1];
  // the stem down the left, from question to question
  ctx.strokeStyle=rgba(LP.mut,0.55);ctx.lineWidth=4;ctx.lineCap="round";
  // the "no" answers run down a stem at the left, from the first question to the second, the fourth and the fifth, passing the third
  const sx=P.qx-36,lk=[[0,1],[1,3],[3,4]];
  for(const [i0,i1] of lk){const v=ag_sine(clamp(clamp(R[i1]||0,0,1)*2,0,1));if(v<=0)continue;const y0=P.rowY[i0]+P.rh/2,y1=P.rowY[i1]+P.rh/2;
    ctx.beginPath();ctx.moveTo(P.qx,y0);ctx.lineTo(sx,y0);ctx.lineTo(sx,lerp(y0,y1,v));if(v>0.98)ctx.lineTo(P.qx,y1);ctx.stroke();
    if(v>0.9)lp_T(ctx,"No",sx-14,y0+(i1-i0>1?P.rh*1.0:P.rh*0.62)+10,{w:600,size:28,align:"right",col:LP.mut});}
  // the third question hangs from the second's "yes": once the changes are fetched, can it say what was deleted?
  {const v=ag_sine(clamp(clamp(R[2]||0,0,1)*2,0,1));if(v>0){const x=P.qx+44,y0=P.rowY[1]+P.rh,y1=P.rowY[2]+P.rh/2;
    ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,lerp(y0,y1,v));if(v>0.98)ctx.lineTo(P.qx+(PP_ROWS[2].indent||0),y1);ctx.stroke();
    if(v>0.9)lp_T(ctx,"Yes",x-10,y0+28,{w:600,size:28,align:"right",col:LP.mut});}}
  PP_ROWS.forEach((r,i)=>{const v=clamp(R[i]||0,0,1);if(v<=0)return;const y=P.rowY[i],qx=P.qx+(r.indent||0),dm=o.hl!=null&&o.hl!==i&&!(Array.isArray(o.hl)&&o.hl.includes(i))?0.4:1,
      hl=Array.isArray(o.hl)?o.hl.includes(i):o.hl===i;
    ctx.save();ctx.globalAlpha*=dm*(1-0.55*ag_sine(o.dimAll||0));
    // the question, on a blue-edged card
    const qa=ag_sine(clamp(v*2,0,1));ctx.save();ctx.globalAlpha*=qa;ctx.fillStyle=rgba(mix(LP.paper,LP.blue,0.06),1);rr(ctx,qx,y,P.qw-(r.indent||0),P.rh,14);ctx.fill();
    ctx.strokeStyle=rgba(LP.blue,1);ctx.lineWidth=hl?5:3;rr(ctx,qx,y,P.qw-(r.indent||0),P.rh,14);ctx.stroke();
    const ql=lp_wrap(ctx,r.q,P.qw-(r.indent||0)-56,{w:700,size:30});ql.forEach((l,j)=>lp_T(ctx,l,qx+28,y+P.rh/2+12-(ql.length-1)*19+j*38,{w:700,size:30}));ctx.restore();
    // its answer: the branch, then the recommendation
    const av=ag_sine(clamp(v*2-1,0,1));if(av>0){const bx0=qx+P.qw-(r.indent||0),by=y+P.rh/2;pp_arrow(ctx,bx0+8,by,P.ax-14,by,av,{col:r.pref?LP.green:LP.mut,w:4});
      lp_T(ctx,r.yes,(bx0+P.ax)/2,by-14,{w:700,size:28,align:"center",col:r.pref?LP.green:LP.mut,a:av});
      ctx.save();ctx.globalAlpha*=av;const ac=r.pref?LP.green:LP.mut;ctx.fillStyle=rgba(r.pref?mix(LP.paper,LP.green,0.12):LP.paper,1);rr(ctx,P.ax,y,P.aw,P.rh,14);ctx.fill();
      ctx.strokeStyle=rgba(ac,r.pref?1:0.55);ctx.lineWidth=hl?5:3;rr(ctx,P.ax,y,P.aw,P.rh,14);ctx.stroke();
      const al=lp_wrap(ctx,r.a,P.aw-110,{w:700,size:30});al.forEach((l,j)=>lp_T(ctx,l,P.ax+28,y+P.rh/2+12-(al.length-1)*19+j*38,{w:700,size:30,col:r.pref?LP.green:LP.ink}));
      if(r.pref)lp_T(ctx,"Preferred",P.ax+P.aw-28,y+P.rh/2+10,{w:700,size:28,align:"right",col:LP.green});ctx.restore();}
    const tk=o.ticks||0;if(tk>0&&!r.pref){const tx=P.ax+P.aw-44,ty=y+P.rh/2;ctx.save();ctx.globalAlpha*=ag_in(tk,i*0.12,0.3);ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(tx,ty,20,0,TAU);ctx.fill();
      lp_icon(ctx,"tick",tx,ty,28,[255,255,255]);ctx.restore();}
    ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- the tree kept as text, on a screen: drawn inside lp_screen's draw
   o.u (0 to 1: the lines typed in); o.hl (0 to 1: the deletions' line picked out). The text is a diagram written as text, as the team
   keeps every picture of its architecture (One map, in the repo). */
const PP_CODE=["flowchart TD","  q1{Sends events?} -- yes --> e[Use the events]","  q1 -- no --> q2{Changes since a time?}",
  "  q2 -- yes --> h[Fetch every hour] --> q3{Says what was deleted?}","  q3 -- no --> n[Compare the full list nightly]","  q2 -- no --> q4{Only a file?}"];
function pp_text(c,x,y,w,h,o){o=o||{};const u=o.u==null?1:o.u;c.fillStyle="#F4F1EA";c.fillRect(x,y,w,h);c.fillStyle=rgba(LP.graphite,0.08);c.fillRect(x,y,w,58);
  lp_T(c,"architecture/providers/tree.md",x+24,y+40,{w:600,size:28,col:LP.mut,f:"mono"});
  PP_CODE.forEach((l,i)=>{const v=clamp(u*PP_CODE.length-i,0,1);if(v<=0)return;const ly=y+112+i*48;
    if(i===4&&o.hl>0){c.fillStyle=rgba(LP.blue,0.12*ag_sine(o.hl));c.fillRect(x+10,ly-34,w-20,46);}
    c.save();c.beginPath();c.rect(x,ly-40,24+(w-24)*ag_sine(v),56);c.clip();lp_T(c,l,x+24,ly,{w:500,size:28,f:"mono",col:i===0?LP.blue:LP.ink});c.restore();});}

/* ---------------------------------------------------------------- the timetable and the platform, side by side
   Two screens: on the left the registrar's timetable, on the right the same week on the platform; between them the hourly changes,
   a little packet for each change that crosses. o: a; cancel (0 to 1: the class struck out in the timetable, then gone); stays (0 to 1:
   the same class on the platform picked out in amber, still booked); flow (seconds since the changes began, or null); light. */
const PP_CLASSES=[["Tue 09:00","B2.11","Statistics 1"],["Tue 10:00","A1.04","Chemistry lab"],["Tue 11:00","C1.02","Nursing practice"],["Tue 13:00","E2.21","Accounting"]];
function pp_classes(c,X,Y,Wd,o,which){o=o||{};lp_T(c,which==="tt"?"The timetable":"The platform",X+28,Y+50,{w:800,size:32});
  lp_T(c,which==="tt"?"Tuesday 15 June":"The same bookings",X+28,Y+90,{w:600,size:28,col:LP.mut});
  PP_CLASSES.forEach((r,i)=>{const ry=Y+124+i*70,can=i===1;let a=1;if(can&&which==="tt")a=1-ag_in(o.cancel||0,0.55,0.45);if(a<=0.004)return;c.save();c.globalAlpha*=a;
    const st=can&&which==="pl"?ag_sine(o.stays||0):0;c.fillStyle=rgba(st>0?mix(LP.paper,LP.amber,0.14*st):mix(LP.paper,LP.orange,0.08),1);rr(c,X+20,ry,Wd-40,56,8);c.fill();
    c.strokeStyle=rgba(st>0?LP.amber:LP.orange,st>0?0.5+0.5*st:0.5);c.lineWidth=st>0?4:2;rr(c,X+20,ry,Wd-40,56,8);c.stroke();
    lp_T(c,r[0],X+40,ry+38,{w:700,size:28});lp_T(c,r[1],X+210,ry+38,{w:700,size:28,col:LP.mut});lp_T(c,r[2],X+330,ry+38,{w:600,size:28});
    if(can&&which==="tt"&&o.cancel>0){const sv=ag_sine(clamp((o.cancel||0)/0.5,0,1));c.strokeStyle=rgba(LP.ink,0.85);c.lineWidth=4;c.beginPath();c.moveTo(X+34,ry+28);c.lineTo(lerp(X+34,X+Wd-34,sv),ry+28);c.stroke();}
    c.restore();});}
function pp_twin(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  lp_screen(ctx,110,170,720,440,{draw:(c,X,Y,Wd)=>pp_classes(c,X,Y,Wd,o,"tt")});
  lp_screen(ctx,1090,170,720,440,{draw:(c,X,Y,Wd)=>pp_classes(c,X,Y,Wd,o,"pl")});
  // the hourly changes between them: a line, and a packet for each change that crosses, never one for the cancelled class
  ctx.strokeStyle=rgba(LP.orange,0.5);ctx.lineWidth=4;ctx.setLineDash([12,10]);ctx.beginPath();ctx.moveTo(850,390);ctx.lineTo(1070,390);ctx.stroke();ctx.setLineDash([]);
  if(o.flow!=null&&o.flow>0){for(let k=0;k<3;k++){const p=((o.flow*0.35+k/3)%1);ctx.fillStyle=rgba(LP.orange,ag_sine(Math.min(p,1-p)*4>1?1:Math.min(p,1-p)*4));
    rr(ctx,lerp(850,1050,p),380,20,20,4);ctx.fill();}}
  ctx.restore();}

/* ---------------------------------------------------------------- the nightly comparison
   Tonight's full list from the timetable, beside the bookings the platform holds; a booking the platform holds that isn't on the full
   list is marked deleted. o: a, k, u (0 to 1: the lists drawn), match (0 to 1: the matching rows ticked across), gone (0 to 1: the missing
   row found and marked deleted), light. x, y: the left list's top left. */
function pp_compare(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const w=600,h=520,gx=x+w+140;
  if(o.k!=null)ag_about(ctx,x+w+70,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:o.light});lp_sheet(ctx,gx,y,w,h,{col:LP.orange,light:o.light});
  lp_T(ctx,"TONIGHT'S FULL LIST",x+36,y+78,{w:800,size:28,ls:3,col:LP.orange});lp_T(ctx,"From the timetable",x+36,y+126,{w:700,size:36});
  lp_T(ctx,"ON THE PLATFORM",gx+36,y+78,{w:800,size:28,ls:3,col:LP.orange});lp_T(ctx,"What we hold",gx+36,y+126,{w:700,size:36});
  const L=[0,2,3],Rr=[0,1,2,3],u=o.u==null?1:o.u;
  L.forEach((ci,j)=>{const v=clamp(u*4-j,0,1);if(v<=0)return;const ry=y+170+j*80;ctx.save();ctx.globalAlpha*=ag_sine(v);ctx.fillStyle=rgba(mix(LP.paper,LP.orange,0.07),1);rr(ctx,x+30,ry,w-60,60,8);ctx.fill();
    lp_T(ctx,PP_CLASSES[ci][0]+" · "+PP_CLASSES[ci][1],x+50,ry+40,{w:700,size:28});ctx.restore();});
  Rr.forEach((ci,j)=>{const v=clamp(u*4-j,0,1);if(v<=0)return;const ry=y+170+j*80,miss=ci===1,gv=miss?ag_sine(o.gone||0):0;ctx.save();ctx.globalAlpha*=ag_sine(v);
    ctx.fillStyle=rgba(gv>0?mix(LP.paper,LP.amber,0.14*gv):mix(LP.paper,LP.orange,0.07),1);rr(ctx,gx+30,ry,w-60,60,8);ctx.fill();
    if(gv>0){ctx.strokeStyle=rgba(LP.amber,gv);ctx.lineWidth=4;rr(ctx,gx+30,ry,w-60,60,8);ctx.stroke();}
    lp_T(ctx,PP_CLASSES[ci][0]+" · "+PP_CLASSES[ci][1],gx+50,ry+40,{w:700,size:28,col:gv>0.5?LP.mut:LP.ink});
    if(gv>0){ctx.strokeStyle=rgba(LP.ink,0.8);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx+46,ry+30);ctx.lineTo(lerp(gx+46,gx+330,gv),ry+30);ctx.stroke();
      lp_pill(ctx,gx+w-120,ry+30,"Deleted",{col:LP.amber,size:28,a:gv});}
    ctx.restore();});
  // the matching rows joined across
  const mv=o.match||0;if(mv>0){L.forEach((ci,j)=>{const rj=Rr.indexOf(ci),y0=y+200+j*80,y1=y+200+rj*80;pp_arrow(ctx,x+w-24,y0,gx+24,y1,clamp(mv*3-j,0,1),{col:LP.green,w:3});});}
  ctx.restore();}

/* ---------------------------------------------------------------- four providers, four paths
   The providers down the left (orange: data), each path across to the platform in the middle, and on to the people who use the data
   on the right. o: a, lanes (0 to 1 each: its path drawn), labels (0 to 1 each), people (0 to 1: the right-hand cards), light,
   flow (seconds, or null: the data moving along each path, slower on the weaker ones), hl (a lane picked out, or null). */
const PP_LANES=[
  {name:"The rooms' sensors",icon:"sensor",path:"Events",col:LP.green},
  {name:"The timetable",icon:"grid",path:"Hourly changes, nightly list",col:LP.mut},
  {name:"Payroll",icon:"file",path:"Whole file, nightly",col:LP.mut},
  {name:"The Health labs",icon:"sheet",path:"Governed table, an owner",col:LP.mut}];
const PP_LY=[214,362,510,658];
function pp_lanes(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const Ls=o.lanes||[1,1,1,1],Lb=o.labels||Ls,px0=1250,pw=200;
  // the platform, a tall card in the middle-right
  lp_sheet(ctx,px0,150,pw,590,{light:o.light,pin:false});lp_T(ctx,"The",px0+pw/2,420,{w:700,size:32,align:"center"});lp_T(ctx,"platform",px0+pw/2,460,{w:700,size:32,align:"center"});
  PP_LANES.forEach((L,i)=>{const y=PP_LY[i],v=clamp(Ls[i]||0,0,1),dm=o.hl!=null&&o.hl!==i?0.4:1;ctx.save();ctx.globalAlpha*=dm;
    // the provider's card
    lp_sheet(ctx,90,y-56,420,112,{col:LP.orange,light:o.light,pin:false});pp_icon(ctx,L.icon,150,y+8,LP.orange,0.8);lp_T(ctx,L.name,200,y+16,{w:700,size:30});
    // its path
    if(v>0){ctx.save();ctx.strokeStyle=rgba(L.col,L.col===LP.green?1:0.7);ctx.lineWidth=L.col===LP.green?8:6;ctx.lineCap="round";if(L.col!==LP.green)ctx.setLineDash([2,14]);
      ctx.beginPath();ctx.moveTo(520,y);ctx.lineTo(lerp(520,px0-12,ag_sine(v)),y);ctx.stroke();ctx.restore();
      if(o.flow!=null){const sp=[0.42,0.2,0.08,0.12][i];for(let k=0;k<(i===0?4:2);k++){const p=(o.flow*sp+k/(i===0?4:2))%1;ctx.fillStyle=rgba(LP.orange,0.9*ag_sine(Math.min(1,Math.min(p,1-p)*6))*v);
        rr(ctx,lerp(530,px0-36,p),y-10,22,20,5);ctx.fill();}}}
    const lb=ag_sine(clamp(Lb[i]||0,0,1));if(lb>0)lp_tag(ctx,(520+px0)/2,y-26,L.path,{align:"center",col:L.col===LP.green?LP.green:LP.ink,a:lb});
    ctx.restore();});
  // the people who use the data, on the right
  const pu=ag_sine(o.people||0);if(pu>0){ctx.save();ctx.globalAlpha*=pu;pp_arrow(ctx,px0+pw+12,350,1530,300,1,{col:LP.green,w:5});pp_arrow(ctx,px0+pw+12,520,1530,600,1,{col:LP.green,w:5});
    lp_sheet(ctx,1540,224,300,150,{col:LP.green,light:o.light,pin:false});lp_T(ctx,"Graham's page",1564,292,{w:700,size:30});lp_T(ctx,"Rooms and labs",1564,334,{w:600,size:28,col:LP.mut});
    lp_sheet(ctx,1540,520,300,150,{col:LP.green,light:o.light,pin:false});lp_T(ctx,"Finance",1564,588,{w:700,size:30});lp_T(ctx,"Casual staff costs",1564,630,{w:600,size:28,col:LP.mut});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- each provider on a step, lifted towards the preferred way
   Four steps rising to the right, the preferred way at the top (green); each provider's token on its step, and an amber dashed arrow up
   to the next one, its step up in writing. o: a, u (0 to 1: the steps drawn), lift (0 to 1: each token moves up a step), light. */
function pp_steps(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const u=ag_sine(o.u==null?1:o.u),x0=260,y0=800,sw=330,sh=120;
  for(let i=0;i<4;i++){const v=clamp(u*4-i,0,1);if(v<=0)continue;const sx=x0+i*sw,sy=y0-(i+1)*sh;ctx.save();ctx.globalAlpha*=v;
    ctx.fillStyle=rgba(i===3?mix(LP.paper,LP.green,0.16):mix(LP.paper,LP.wall,0.3),1);ctx.fillRect(sx,sy,sw,y0-sy);ctx.strokeStyle=rgba(i===3?LP.green:LP.mut,i===3?1:0.4);ctx.lineWidth=3;ctx.strokeRect(sx,sy,sw,y0-sy);ctx.restore();}
  lp_T(ctx,"The preferred",x0+3*sw+sw/2,y0-2*sh+6,{w:700,size:30,align:"center",col:LP.green,a:clamp(u*4-3,0,1)});
  lp_T(ctx,"way",x0+3*sw+sw/2,y0-2*sh+46,{w:700,size:30,align:"center",col:LP.green,a:clamp(u*4-3,0,1)});
  const lf=ag_sine(o.lift||0),tok=[[0,"Health labs"],[1,"Payroll"],[2,"Timetable"]];
  tok.forEach(([s,n],j)=>{const st=s+lf,cx=x0+st*sw+sw/2,cy=y0-(st+1)*sh-44;ctx.save();ctx.globalAlpha*=clamp(u*4-s-0.5,0,1);
    ctx.fillStyle=rgba(LP.paper,1);ctx.strokeStyle=rgba(LP.orange,1);ctx.lineWidth=4;rr(ctx,cx-118,cy-30,236,60,30);ctx.fill();ctx.stroke();lp_T(ctx,n,cx,cy+10,{w:700,size:28,align:"center"});ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- Graham's page, on a screen: drawn inside lp_screen's draw
   The week's room use, bar by bar (booked, and used, in green where the counts are true), a line of every source under it. o.u (0 to 1:
   the bars grow), o.ghost (0 to 1: the hours booked in error, amber, on top of the booked bars, shrinking away), o.src (0 to 1: the sources' line). */
function pp_counts(c,X,Y,Wd,Hd,o){o=o||{};const u=ag_sine(o.u==null?1:o.u),R=ag_rnd(30);lp_T(c,"Teaching space use",X+30,Y+52,{w:800,size:32});
  lp_T(c,"186 rooms and 9 labs · this week",X+30,Y+92,{w:600,size:28,col:LP.mut});
  if(Wd>700){c.fillStyle=rgba(LP.green,0.9);c.fillRect(X+Wd-300,Y+34,24,24);lp_T(c,"Used",X+Wd-266,Y+56,{w:600,size:28});
    c.fillStyle=rgba(mix(LP.paper,LP.mut,0.22),1);c.fillRect(X+Wd-170,Y+34,24,24);lp_T(c,"Booked",X+Wd-136,Y+56,{w:600,size:28});}
  const gx=X+40,gy=Y+Hd-90,bw=(Wd-80)/10;for(let i=0;i<10;i++){const bk=0.35+R()*0.5,us=bk*(0.6+R()*0.3),gh=(o.ghost||0)*(0.05+R()*0.08),bh=(Hd-230)*u;
    c.fillStyle=rgba(mix(LP.paper,LP.mut,0.22),1);c.fillRect(gx+i*bw+8,gy-bh*bk,bw-16,bh*bk);
    if(gh>0){c.fillStyle=rgba(LP.amber,0.85);c.fillRect(gx+i*bw+8,gy-bh*(bk+gh),bw-16,bh*gh);}
    c.fillStyle=rgba(LP.green,0.9);c.fillRect(gx+i*bw+8,gy-bh*us,bw-16,bh*us);
    lp_T(c,String(8+i).padStart(2,"0"),gx+i*bw+bw/2,gy+34,{w:600,size:28,align:"center",col:LP.mut});}
  if(o.src>0)lp_T(c,"Four sources · four paths · each checked",X+30,Y+Hd-14,{w:600,size:28,col:LP.green,a:ag_sine(o.src)});}

/* ---------------------------------------------------------------- an empty teaching room, as a small picture: rows of seats, nobody in them */
function pp_emptyRoom(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;const h=w*0.62;
  c.fillStyle=rgba(mix(LP.paper,LP.wall,0.4),1);rr(c,x,y,w,h,12);c.fill();c.strokeStyle=rgba(LP.mut,0.4);c.lineWidth=3;rr(c,x,y,w,h,12);c.stroke();
  c.fillStyle=rgba(LP.graphite,0.85);c.fillRect(x+w*0.25,y+24,w*0.5,14);
  for(let r=0;r<3;r++)for(let k=0;k<6;k++){const sx=x+44+k*(w-88)/5.4,sy=y+80+r*((h-110)/3);c.fillStyle=rgba(LP.timber,1);rr(c,sx,sy,30,22,5);c.fill();}
  c.restore();}

/* ---------------------------------------------------------------- payroll's file, night by night
   Six nights' files, each bar its size; a dashed level under them: a night's file below it stops the comparison. o.u (0 to 1: the
   bars grow), o.cut (0 to 1: Tuesday's file arrives cut short, its bar in amber), o.line (0 to 1: the level and its words). */
function pp_nights(c,x,y,w,h,o){o=o||{};const u=ag_sine(o.u==null?1:o.u),cut=ag_sine(o.cut||0),N=[["Thu",96],["Fri",97],["Sat",96],["Sun",96],["Mon",97],["Tue",lerp(97,58,cut)]],
    base=y+h-50,top=y+40,bw=(w-80)/6,sc=v=>(base-top)*v/110;
  c.strokeStyle=rgba(LP.mut,0.5);c.lineWidth=2;c.beginPath();c.moveTo(x,base+1);c.lineTo(x+w,base+1);c.stroke();
  N.forEach(([d,v],i)=>{const bx=x+20+i*bw,bh=sc(v)*u,isCut=i===5&&cut>0.02;c.fillStyle=rgba(isCut?mix(LP.orange,LP.amber,cut):LP.orange,0.9);c.fillRect(bx+10,base-bh,bw-20,bh);
    lp_T(c,d,bx+bw/2,base+36,{w:600,size:28,align:"center",col:LP.mut});});
  const la=ag_sine(o.line||0);if(la>0){const ly=base-sc(86);c.save();c.globalAlpha*=la;c.strokeStyle=rgba(LP.ink,0.75);c.lineWidth=3;c.setLineDash([12,9]);
    c.beginPath();c.moveTo(x,ly);c.lineTo(x+w,ly);c.stroke();c.setLineDash([]);c.restore();
    lp_T(c,"Below the line: stop and ask",x+w,top-6,{w:700,size:28,align:"right",col:LP.ink,a:la});}}
