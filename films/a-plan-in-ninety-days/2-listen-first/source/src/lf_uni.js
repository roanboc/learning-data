/* ===== Listen first: the university, February and March 2027 =====
   The film's own pictures at the university, on the module's kit (prefix lf_). Colour keeps the module's meaning: Helena's plan, the
   four goals, the threads, the opportunities and the milestone in blue (design and plans); what works in green (Govern data, the
   Thursdays); waiting, cost and risk in amber (41 days, the licence, Deliver data, the findings before they're turned into
   opportunities, the reports nobody opened); the information layer's tiles in orange (data). People wear none of the five.
     lfFeb, lfCorridor   the team's room in February's morning light; the corridor of an office building, three doors
     lf_plan             Helena's ninety days on one page: three lanes, Discover lit
     lf_marks            the 31 conversations, as marks in their groups
     lf_grid             31 answers to the same three questions, side by side, and two that line up
     lf_doorPlate        the name over a door
     lf_screenTracker    the tracker on the wall's screen: requests closed in February
     lf_reports          the old warehouse's 38 reports: the 17 nobody opened fade and turn amber
     lf_finding          one finding on a card, with its small picture: eleven ways in, three copies, forty spreadsheets
     lf_layerPage        one layer of the current state: its page and its picture beside it, one at a time
     lf_layerTabs        the five layers' names in a column, the one being written lit
     lf_fivePages        the five pages, small, each with its picture, side by side (Information can be lit)
     lf_archimate        ArchiMate's three bands: what the data is about in Business, the data itself in Application
     lf_map              Noor's map, on the architecture tool's screen: the five layers
     lf_flip             a card turning over: a finding on its front, an opportunity on its back
     lf_mail             the summary, sent back to the 31, the replies that come in, and a page that changes
   The module's mark on the title and the end card is the module's own, dm_mark (films/a-plan-in-ninety-days/shared/src/mark.js). */

AG_PLACES.lfFeb=c=>lp_paintRoom(c,{light:"morning",seed:3});
AG_PLACES.lfCorridor=c=>{lp_paintRoom(c,{light:"day",seed:9,base:[222,212,194]});for(const x of LF_DOORS)lp_door(c,x,330,220,606,{open:0});};
const LF_DOORS=[640,1080,1520];
const LF_INGRID={name:"Ingrid Holm",role:"HR",key:"lf-ingrid",skin:[236,204,182],hair:{style:"bun",c:[196,176,140]},glasses:[70,62,58],top:{kind:"blazer",c:[118,100,90],inner:[238,234,228]},breath:0.28};

/* ---------------------------------------------------------------- small things */
// a sheet that springs in at t0 and leaves from o.out: lp_textSheet's words and options
function lf_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return lp_textSheet(ctx,x,y,w,words,{measure:true});
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its time: lp_textSheet's u
const lf_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag in at t0, out at t1 (null: stays)
function lf_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 and leaves at t1
function lf_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a line that draws itself from A to B (u 0 to 1), through a gentle curve; o.col, o.w, o.a
function lf_thread(ctx,A,B,u,o){o=o||{};u=clamp(u,0,1);if(u<=0)return;const a=o.a==null?1:o.a;if(a<=0.004)return;const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-(o.bend||40);
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(o.col||LP.blue,1);ctx.lineWidth=o.w||6;ctx.lineCap="round";ctx.beginPath();const n=40;
  for(let i=0;i<=n*u;i++){const v=i/n,m=1-v,x=m*m*A[0]+2*m*v*mx+v*v*B[0],y=m*m*A[1]+2*m*v*my+v*v*B[1];i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
  if(u>=1&&o.dots!==false){ctx.fillStyle=rgba(o.col||LP.blue,1);for(const P of [A,B]){ctx.beginPath();ctx.arc(P[0],P[1],9,0,TAU);ctx.fill();}}ctx.restore();}
// a small page icon: a sheet with lines on it, o.col its band
function lf_leaf(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.shadowColor="rgba(52,36,30,0.22)";ctx.shadowBlur=8;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=4;ctx.fillStyle=rgba(o.bg||LP.paper,1);ctx.fillRect(x,y,w,h);ctx.restore();
  if(o.col){ctx.fillStyle=rgba(o.col,1);ctx.fillRect(x,y,w,Math.max(4,h*0.08));}const n=o.lines==null?4:o.lines;ctx.fillStyle=rgba(o.ink||mix(LP.mut,LP.paper,0.45),1);
  for(let i=0;i<n;i++){ctx.fillRect(x+w*0.14,y+h*(0.26+i*0.16),w*(0.72-0.12*(i%3)),Math.max(2,h*0.05));}}
// a spreadsheet icon: a small grid
function lf_sheetIcon(ctx,x,y,w,h,col){ctx.save();ctx.fillStyle=rgba(LP.paper,1);ctx.shadowColor="rgba(52,36,30,0.2)";ctx.shadowBlur=6;ctx.shadowOffsetX=-2;ctx.shadowOffsetY=3;ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.strokeStyle=rgba(col||LP.mut,0.55);ctx.lineWidth=1.5;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x+w*i/4,y+3);ctx.lineTo(x+w*i/4,y+h-3);ctx.stroke();}
  for(let j=1;j<4;j++){ctx.beginPath();ctx.moveTo(x+3,y+h*j/4);ctx.lineTo(x+w-3,y+h*j/4);ctx.stroke();}ctx.fillStyle=rgba(col||LP.mut,0.5);ctx.fillRect(x,y,w,h/4);}
// an arrow from A to B, its head at B
function lf_arrow(ctx,A,B,col,w){const an=Math.atan2(B[1]-A[1],B[0]-A[0]);ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=w||4;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0]-Math.cos(an)*12,B[1]-Math.sin(an)*12);ctx.stroke();ctx.beginPath();ctx.moveTo(B[0],B[1]);
  ctx.lineTo(B[0]-Math.cos(an-0.45)*20,B[1]-Math.sin(an-0.45)*20);ctx.lineTo(B[0]-Math.cos(an+0.45)*20,B[1]-Math.sin(an+0.45)*20);ctx.closePath();ctx.fill();ctx.restore();}
// an outlined box with a word in it
function lf_box(ctx,x,y,w,h,text,o){o=o||{};const col=o.col||LP.mut,a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(o.fill){ctx.fillStyle=rgba(col,o.fill);rr(ctx,x,y,w,h,10);ctx.fill();}ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||3;rr(ctx,x,y,w,h,10);ctx.stroke();
  const ls=Array.isArray(text)?text:[text],lh=36,y0=y+h/2-(ls.length-1)*lh/2+10;ls.forEach((s,i)=>lp_T(ctx,s,x+w/2,y0+i*lh,{w:o.wt||700,size:o.size||28,align:"center",col:o.tcol||(col===LP.mut?LP.ink:col)}));ctx.restore();}

/* ---------------------------------------------------------------- Helena's ninety days, on one page */
// three lanes over the weeks; o.lit (0 to 1: Discover lit in blue), o.a, o.k
function lf_plan(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=440;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});lp_label(ctx,x+44,y+80,"Helena's plan",{col:LP.blue});lp_T(ctx,"Ninety days",x+44,y+134,{w:800,size:40});
  const lx=x+44,gx=x+290,gw=w-290-44,wk=gw/13,rows=[["People",y+214],["Strategy",y+300],["Operations",y+386]],lit=clamp(o.lit||0,0,1);
  for(const [n,ry] of rows)lp_T(ctx,n,lx,ry+10,{w:700,size:28,col:LP.mut});
  const seg=(w0,w1,ry,text,col,fill)=>{const sx=gx+w0*wk+3,sw=(w1-w0)*wk-6;ctx.fillStyle=fill;rr(ctx,sx,ry-28,sw,56,10);ctx.fill();if(text)lp_T(ctx,text,sx+sw/2,ry+10,{w:700,size:28,align:"center",col});};
  seg(0,13,rows[0][1],"Connect with people",LP.ink,rgba(mix(LP.mut,LP.paper,0.84),1));
  seg(1,7,rows[1][1],"Discover · weeks 1 to 6",lit>0.5?[255,255,255]:LP.ink,rgba(mix(mix(LP.mut,LP.paper,0.84),LP.blue,lit),1));
  seg(7,10,rows[1][1],"Define",LP.ink,rgba(mix(LP.mut,LP.paper,0.84),1));seg(10,13,rows[1][1],"Plan",LP.ink,rgba(mix(LP.mut,LP.paper,0.84),1));
  seg(0,13,rows[2][1],"Keep today's work running",LP.ink,rgba(mix(LP.mut,LP.paper,0.84),1));
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the 31 conversations */
const LF_GROUPS=[["Deputy vice-chancellor",1],["Heads of school",6],["Registrar's office",3],["Planning",2],["HR",2],["Finance",3],["Facilities",2],["Research office",2],["IT",3],["Her team",7]];
// o.u (0 to 1: the marks fill, group by group), o.a, o.k
function lf_marks(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=560;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light});lp_label(ctx,x+44,y+80,"Six weeks");lp_T(ctx,"31 conversations",x+44,y+134,{w:800,size:40});
  const cw=(w-88)/2,u=clamp(o.u||0,0,1);let k=0;
  LF_GROUPS.forEach(([n,m],i)=>{const cx=x+44+(i<5?0:cw),ry=y+210+(i%5)*72,show=clamp(u*LF_GROUPS.length-i,0,1);ctx.save();ctx.globalAlpha*=0.25+0.75*ag_sine(show);
    lp_T(ctx,n,cx,ry+10,{w:600,size:28});for(let j=0;j<m;j++){const dx=cx+cw-60-(m-1-j)*30,dy=ry,on=clamp(show*m-j,0,1);ctx.fillStyle=rgba(LP.ink,0.15+0.85*on);ctx.beginPath();ctx.arc(dx,dy,10*(0.7+0.3*on),0,TAU);ctx.fill();}
    ctx.restore();k+=m;});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the same three questions */
const LF_QS=["What do you decide?","What data do you trust?","What slows you down?"];
// o.u: one number a question (0 to 1 each), o.a, o.k
function lf_questions(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=360;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});lp_label(ctx,x+44,y+84,"The same three questions",{col:LP.blue});
  let sz=40;for(const q of LF_QS){ctx.save();const tw=lp_tw(ctx,q,{w:800,size:40});ctx.restore();sz=Math.min(sz,40*(w-96-44)/Math.max(1,tw));}sz=Math.max(32,Math.floor(sz));
  LF_QS.forEach((q,i)=>{const v=o.u?clamp(o.u[i],0,1):1;if(v<=0)return;ctx.save();ctx.globalAlpha*=ag_sine(v);lp_T(ctx,(i+1)+"",x+44,y+160+i*68,{w:800,size:sz,col:LP.blue});
    lp_T(ctx,q,x+96,y+160+i*68,{w:800,size:sz});ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- 31 answers, side by side */
// three columns of short strokes, a row a person; two rows whose answers line up are joined in blue. o.u (0 to 1: the rows fill),
// o.pair (0 to 1: the two rows picked out), o.a, o.k
const LF_PAIR=[6,19];
function lf_grid(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=640;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light});const heads=["Decide","Trust","Slows"],cx0=x+60,cw=(w-120)/3,top=y+120,rh=(h-160)/31,R=ag_rnd(31),u=clamp(o.u||0,0,1),pr=clamp(o.pair||0,0,1);
  heads.forEach((s,i)=>lp_T(ctx,s,cx0+i*cw+cw/2,y+84,{w:800,size:28,align:"center",col:LP.mut}));
  const len=[];for(let r=0;r<31;r++){len.push([0,1,2].map(()=>0.35+R()*0.55));}
  len[LF_PAIR[1]]=len[LF_PAIR[0]].slice();
  for(let r=0;r<31;r++){const on=clamp(u*31-r,0,1);if(on<=0)continue;const ry=top+r*rh+rh/2,pick=LF_PAIR.includes(r);
    for(let i=0;i<3;i++){const sx=cx0+i*cw+18,sl=(cw-36)*len[r][i]*ag_eo(on);ctx.strokeStyle=rgba(pick?mix(LP.ink,LP.blue,pr):LP.ink,pick?0.55+0.45*pr:0.42*(1-0.5*pr)+0.1);
      ctx.lineWidth=pick?3+3*pr:3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sx,ry);ctx.lineTo(sx+sl,ry);ctx.stroke();}}
  if(pr>0){const y0=top+LF_PAIR[0]*rh+rh/2,y1=top+LF_PAIR[1]*rh+rh/2;ctx.strokeStyle=rgba(LP.blue,pr);ctx.lineWidth=3;ctx.setLineDash([8,7]);
    ctx.beginPath();ctx.moveTo(x+36,y0);ctx.lineTo(x+36,y1);ctx.stroke();ctx.setLineDash([]);for(const yy of [y0,y1]){ctx.fillStyle=rgba(LP.blue,pr);ctx.beginPath();ctx.arc(x+36,yy,7,0,TAU);ctx.fill();}}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a door's name */
function lf_doorPlate(ctx,cx,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const tw=lp_tw(ctx,text,{w:700,size:30})+48;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.25)";ctx.shadowBlur=8;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=4;ctx.fillStyle=rgba(LP.paper,1);rr(ctx,cx-tw/2,y-34,tw,56,6);ctx.fill();ctx.restore();
  lp_T(ctx,text,cx,y+6,{w:700,size:30,align:"center"});ctx.restore();}

/* ---------------------------------------------------------------- the tracker */
// what the screen shows: its name, the month's closed requests as rows, each a bar as long as it waited; o.u (0 to 1: the rows come in)
function lf_screenTracker(cx,X,Y,Wd,Hd,o){o=o||{};const u=clamp(o.u==null?1:o.u,0,1),R=ag_rnd(41);
  cx.fillStyle=rgba(mix(LP.paper,LP.mut,0.06),1);cx.fillRect(X,Y,Wd,84);lp_T(cx,"Tracker",X+40,Y+56,{w:800,size:36});lp_T(cx,"Requests closed in February",X+Wd-40,Y+54,{w:600,size:28,col:LP.mut,align:"right"});
  const n=9,rh=(Hd-120)/n;for(let i=0;i<n;i++){const on=clamp(u*n-i,0,1);if(on<=0)continue;const ry=Y+104+i*rh,d=18+R()*52;cx.save();cx.globalAlpha*=on;
    cx.fillStyle=rgba(mix(LP.mut,LP.paper,0.55),1);cx.fillRect(X+40,ry+rh*0.35,160+R()*120,8);
    cx.fillStyle=rgba(mix(LP.amber,LP.paper,0.35),1);rr(cx,X+420,ry+rh*0.22,(Wd-480)*d/70,rh*0.4,6);cx.fill();cx.restore();}}

/* ---------------------------------------------------------------- the old warehouse's 38 reports */
// a grid of 38 small reports, 10 a row; o.u (0 to 1: they come in), o.dim (0 to 1: the 17 nobody opened fade, their band amber),
// o.lit (0 to 1: the 21 used stand out); o.s their size; returns the grid's box
const LF_UNOPENED=[1,3,4,7,9,10,12,15,17,18,21,24,26,29,31,34,36];
function lf_reports(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,s=o.s||1,cols=10,cw=86*s,ch=104*s,box={x,y,w:cols*cw-24*s,h:4*ch-24*s};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<38;i++){const k=clamp((o.u==null?1:o.u)*38-i,0,1);if(k<=0)continue;const cx=x+(i%cols)*cw,cy=y+Math.floor(i/cols)*ch,un=LF_UNOPENED.includes(i),dm=un?clamp(o.dim||0,0,1):0,lt=un?0:clamp(o.lit||0,0,1);
    ctx.save();ctx.globalAlpha*=k*(1-0.55*dm);ctx.save();ctx.shadowColor="rgba(52,36,30,0.25)";ctx.shadowBlur=8*s;ctx.shadowOffsetX=-4*s;ctx.shadowOffsetY=4*s;ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(cx,cy,62*s,80*s);ctx.restore();
    ctx.fillStyle=rgba(mix(mix(LP.mut,LP.ink,lt),LP.amber,dm),1);ctx.fillRect(cx,cy,62*s,8*s);
    for(let l=0;l<3;l++){ctx.fillStyle=rgba(mix(mix(LP.mut,LP.paper,0.5),LP.ink,lt*0.5),1);ctx.fillRect(cx+10*s,cy+(22+l*16)*s,(42-l*8)*s,5*s);}
    ctx.restore();}
  ctx.restore();return box;}

/* ---------------------------------------------------------------- a finding, with its picture */
// kind "ways" (eleven ways in, to one team), "copies" (the staff list in three places), "forty" (forty people's spreadsheets);
// o.u (0 to 1: the picture draws), o.col (the band: amber, a finding), o.a, o.k
function lf_finding(ctx,x,y,w,kind,o){o=o||{};const a=o.a==null?1:o.a,h=540;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  const col=o.col||LP.amber,u=clamp(o.u==null?1:o.u,0,1);lp_sheet(ctx,x,y,w,h,{col,light:o.light});
  const title={ways:"11 ways to ask",copies:"3 copies of the staff list",forty:"About 40 people"}[kind],sub={ways:"From two inboxes to the agents' queue",copies:"",forty:"Data work in spreadsheets"}[kind];
  const tl=lp_wrap(ctx,title,w-72,{w:800,size:40});tl.forEach((s,i)=>lp_T(ctx,s,x+36,y+86+i*48,{w:800,size:40}));let py=y+86+tl.length*48;
  if(sub){lp_wrap(ctx,sub,w-72,{w:600,size:28}).forEach((s,i)=>lp_T(ctx,s,x+36,py+i*36,{w:600,size:28,col:LP.mut}));py+=lp_wrap(ctx,sub,w-72,{w:600,size:28}).length*36;}
  const top=py+20,bot=y+h-36,mid=x+w/2;
  if(kind==="ways"){const bx=mid+20,by=(top+bot)/2,lc=mix(LP.amber,LP.ink,0.25);for(let i=0;i<11;i++){const v=clamp(u*11-i,0,1);if(v<=0)continue;const sy=top+12+i*(bot-top-24)/10,ey=by-34+i*6.8,f=ag_eo(v);
      ctx.save();ctx.globalAlpha*=ag_sine(v);ctx.fillStyle=rgba(lc,1);ctx.beginPath();ctx.arc(x+50,sy,6,0,TAU);ctx.fill();ctx.strokeStyle=rgba(lc,1);ctx.lineWidth=3;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(x+50,sy);ctx.lineTo(lerp(x+50,bx,f),lerp(sy,ey,f));ctx.stroke();ctx.restore();}
    lf_box(ctx,bx,by-46,160,92,"Team",{col:LP.mut,fill:0.08});}
  else if(kind==="copies"){const rows=["HR","Old warehouse","A faculty's spreadsheet"];rows.forEach((s,i)=>{const v=clamp(u*3-i,0,1);if(v<=0)return;const ry=top+18+i*((bot-top-30)/3);
      ctx.save();ctx.globalAlpha*=ag_sine(v);lf_leaf(ctx,x+44,ry,58,72,{col:i?LP.amber:LP.mut,lines:3});lp_T(ctx,s,x+128,ry+48,{w:600,size:28});ctx.restore();});}
  else if(kind==="forty"){const cols=8,gw=w-88,gs=gw/cols,ih=gs*0.62;for(let i=0;i<40;i++){const v=clamp(u*40-i,0,1);if(v<=0)continue;const cx=x+44+(i%cols)*gs,cy=top+10+Math.floor(i/cols)*(ih+12);
      ctx.save();ctx.globalAlpha*=v;lf_sheetIcon(ctx,cx,cy,gs-12,ih,mix(LP.amber,LP.mut,0.4));ctx.restore();}}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the five layers */
const LF_LAYERS=[
  {name:"Strategy",lines:["Four goals","What the university must be able to do"]},
  {name:"Business",lines:["12 decisions","Services","Processes","Who does what"]},
  {name:"Information",lines:["What the data is about","Where it's born"]},
  {name:"Application",lines:["Systems and reports"]},
  {name:"Technology",lines:["Where it runs"]}];
// one layer's picture, in the box (x, y, w, h); o.p: its steps, 0 to 1 each, as the voice names them
function lf_layerPic(ctx,i,x,y,w,h,o){o=o||{};const p=o.p||[],P=k=>clamp(p[k]==null?1:p[k],0,1);
  if(i===0){// the four goals over the three capabilities
    const g=["Students","Research","Campus","Finances"],gw=(w-3*20)/4;g.forEach((s,k)=>{const v=ag_sine(clamp(P(0)*4-k,0,1));if(v<=0)return;ctx.save();ctx.globalAlpha*=v;
      lf_box(ctx,x+k*(gw+20),y+10,gw,74,s,{col:LP.blue,fill:0.1});ctx.restore();});
    ctx.save();ctx.globalAlpha*=ag_sine(P(1));lp_T(ctx,"What it must be able to do",x+w/2,y+150,{w:600,size:28,align:"center",col:LP.mut});
    for(const k of [0,1,2]){const cx=x+(k+0.5)*w/3;lf_arrow(ctx,[cx,y+92],[cx,y+118],mix(LP.mut,LP.paper,0.3),3);}ctx.restore();
    const caps=[["Govern data",LP.green,2],["Deliver data",LP.amber,3],[["Analyse","and report"],LP.mut,4]],cw=(w-2*24)/3;
    caps.forEach(([s,col,k],j)=>{const v=ag_sine(P(1)),hl=P(k);if(v<=0)return;ctx.save();ctx.globalAlpha*=v;
      lf_box(ctx,x+j*(cw+24),y+190,cw,110,s,{col:mix(LP.mut,col,hl),fill:0.04+0.1*hl,lw:3+hl});ctx.restore();});
    const v=ag_sine(P(2));if(v>0)lp_pill(ctx,x+cw/2,y+350,"Works",{col:LP.green,icon:"tick",a:v,size:28});
    const v2=ag_sine(P(3));if(v2>0)lp_pill(ctx,x+cw*1.5+24,y+350,"Slow",{col:LP.amber,icon:"wait",a:v2,size:28});
  }
  else if(i===1){// eleven ways in to the team of seven; below, 41 working days from the ask to first use
    const tx=x+360,ty=y+120,lc=mix(LP.amber,LP.ink,0.3);for(let k=0;k<11;k++){const v=clamp(P(0)*11-k,0,1);if(v<=0)continue;const sy=y+16+k*21,ey=ty-44+k*8.8,f=ag_eo(v);ctx.save();ctx.globalAlpha*=ag_sine(v);
      ctx.fillStyle=rgba(lc,1);ctx.beginPath();ctx.arc(x+16,sy,6,0,TAU);ctx.fill();ctx.strokeStyle=rgba(lc,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+16,sy);ctx.lineTo(lerp(x+16,tx,f),lerp(sy,ey,f));ctx.stroke();ctx.restore();}
    ctx.save();ctx.globalAlpha*=ag_sine(P(0));lp_T(ctx,"11 ways to ask",x+10,y+290,{w:700,size:28,col:LP.amber});lf_box(ctx,tx,ty-56,230,112,"Team of 7",{col:LP.mut,fill:0.08});ctx.restore();
    const v=P(1);if(v>0){const by=y+380,bx=x+130,be=x+w-190;ctx.save();ctx.globalAlpha*=ag_in(v,0,0.3);lf_box(ctx,x,by-40,110,80,"Ask",{col:LP.mut});ctx.restore();
      ctx.fillStyle=rgba(LP.amber,1);rr(ctx,bx,by-16,Math.max(1,(be-bx-10)*ag_eo(v)),32,8);ctx.fill();
      ctx.save();ctx.globalAlpha*=ag_in(v,0.6,0.4);lp_T(ctx,"41 working days",(bx+be)/2,by+64,{w:800,size:32,align:"center",col:LP.amber});
      lf_box(ctx,be,by-50,190,100,"First use",{col:LP.green,fill:0.08});ctx.restore();}}
  else if(i===2){// where each piece is born; the staff list copied twice
    const T=[["Staff","HR system"],["Students","Student system"],["Rooms","Timetable"],["Money","Finance system"],["Research","Research office"]],rh=(h-20)/5;
    T.forEach(([n,b],k)=>{const v=ag_sine(clamp(P(0)*5-k,0,1));if(v<=0)return;const ry=y+k*rh;ctx.save();ctx.globalAlpha*=v;
      ctx.fillStyle=rgba(LP.orange,0.12);rr(ctx,x,ry+6,w*0.56,rh-14,10);ctx.fill();ctx.strokeStyle=rgba(LP.orange,1);ctx.lineWidth=3;rr(ctx,x,ry+6,w*0.56,rh-14,10);ctx.stroke();
      lp_T(ctx,n,x+24,ry+rh/2+8,{w:800,size:30,col:LP.orange});lp_T(ctx,b,x+w*0.56-20,ry+rh/2+8,{w:600,size:28,col:LP.mut,align:"right"});ctx.restore();});
    const c2=P(1);if(c2>0){const ry=y+6,bh=rh-14;[["Old warehouse",1],["A faculty's copy",2]].forEach(([s,k])=>{const v=ag_sine(clamp(c2*2-(k-1),0,1));if(v<=0)return;const bx=x+w*0.56+20+(k-1)*0;ctx.save();ctx.globalAlpha*=v;
        const yy=ry+(k-1)*0;const ox=lerp(x,x+w*0.6,v),oy=ry+(k===1?-0:0)+(k-1)*(bh+10)*v;ctx.setLineDash([8,6]);ctx.strokeStyle=rgba(LP.orange,1);ctx.lineWidth=3;rr(ctx,ox,oy,w*0.4,bh*0.9,10);ctx.stroke();ctx.setLineDash([]);
        lp_T(ctx,s,ox+w*0.2,oy+bh*0.45+10,{w:600,size:28,align:"center",col:LP.orange});
        if(v>0.9)lf_arrow(ctx,[x+w*0.56+4,ry+bh*0.5],[ox-6,oy+bh*0.45],LP.orange,3);ctx.restore();});
      lp_pill(ctx,x+w*0.8,y+rh*2.4+30,"3 copies",{col:LP.amber,a:ag_sine(clamp(c2*2-1,0,1)),size:28});}}
  else if(i===3){// the old warehouse's 38 beside the platform's reports; the tracker and the spreadsheets beside them
    const b=lf_reports(ctx,x,y+50,{s:0.62,u:P(0),dim:1,lit:1});ctx.save();ctx.globalAlpha*=ag_sine(clamp(P(0)*3,0,1));lp_T(ctx,"Old warehouse · 38",x,y+30,{w:700,size:28,col:LP.mut});ctx.restore();
    const px=x+b.w+60,v=ag_sine(P(1));if(v>0){ctx.save();ctx.globalAlpha*=v;lp_T(ctx,"Data platform",px,y+30,{w:700,size:28,col:LP.mut});
      for(let k=0;k<12;k++){const cx=px+(k%4)*58,cy=y+50+Math.floor(k/4)*68;lf_leaf(ctx,cx,cy,42,54,{col:LP.ink,lines:3});}ctx.restore();}
    const v2=ag_sine(P(2));if(v2>0){ctx.save();ctx.globalAlpha*=v2;lf_box(ctx,x,y+350,220,80,"Tracker",{col:LP.mut});lf_box(ctx,x+250,y+350,260,80,"Spreadsheets",{col:LP.mut});ctx.restore();}}
  else if(i===4){// the university's own servers, where the old warehouse runs, and the cloud, where the platform runs
    const v=ag_sine(P(0));if(v>0){ctx.save();ctx.globalAlpha*=v;const sx=x+40,sy=y+30;for(let k=0;k<4;k++){ctx.fillStyle=rgba(mix(LP.graphite,LP.paper,0.15),1);rr(ctx,sx,sy+k*58,200,48,6);ctx.fill();
        ctx.fillStyle=rgba(LP.paper,0.6);ctx.fillRect(sx+20,sy+k*58+20,90,6);ctx.fillStyle=rgba([236,232,222],0.9);ctx.beginPath();ctx.arc(sx+176,sy+k*58+24,5,0,TAU);ctx.fill();}
      lp_T(ctx,"Own servers, since 2012",x+40,y+300,{w:700,size:28});ctx.restore();lp_pill(ctx,x+200,y+364,"Licence ends 31 Dec 2027",{col:LP.amber,a:ag_sine(P(1)),size:28});}
    const v2=ag_sine(P(2));if(v2>0){ctx.save();ctx.globalAlpha*=v2;const cx=x+w-200,cy=y+130;ctx.strokeStyle=rgba(LP.mut,1);ctx.lineWidth=4;ctx.beginPath();
      ctx.arc(cx-60,cy+20,44,Math.PI*0.5,Math.PI*1.5);ctx.arc(cx-10,cy-24,56,Math.PI*1.05,Math.PI*1.9);ctx.arc(cx+60,cy+10,50,Math.PI*1.4,Math.PI*0.5);ctx.closePath();ctx.stroke();
      lp_T(ctx,"The cloud",cx,y+300,{w:700,size:28,align:"center"});ctx.restore();}}}
// one layer's page and its picture beside it, on one sheet: o.p (its picture's steps), o.lu (0 to 1: its lines come in), o.a, o.k, o.light
function lf_layerPage(ctx,i,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const L=LF_LAYERS[i];ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.85,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light,col:i===2?LP.orange:null});lp_label(ctx,x+44,y+80,"The current state",{col:i===2?LP.orange:LP.mut});lp_T(ctx,L.name,x+44,y+136,{w:800,size:44});
  let yy=y+200;L.lines.forEach((s,n)=>{const ls=lp_wrap(ctx,s,330,{w:600,size:28}),v=o.lu==null?1:clamp(o.lu*L.lines.length-n,0,1);ctx.save();ctx.globalAlpha*=ag_sine(v);
    ctx.fillStyle=rgba(LP.mut,1);ctx.beginPath();ctx.arc(x+52,yy-10,6,0,TAU);ctx.fill();ls.forEach((q,j)=>lp_T(ctx,q,x+76,yy+j*36,{w:600,size:28}));ctx.restore();yy+=ls.length*36+16;});
  ctx.strokeStyle=rgba(LP.mut,0.25);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+440,y+60);ctx.lineTo(x+440,y+h-50);ctx.stroke();
  lf_layerPic(ctx,i,x+490,y+70,w-540,h-120,o);ctx.restore();}
// the five layers' names in a column: o.cur (the one being written: a number, so the band moves from one to the next over a moment,
// or -1 for none), o.u (0 to 1: the tabs come in), o.a, o.light. The tabs before the current one are in ink, the rest muted.
function lf_layerTabs(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const cur=o.cur==null?-1:o.cur;ctx.save();ctx.globalAlpha*=a;
  LF_LAYERS.forEach((L,i)=>{const ty=y+i*96,hw=clamp(1-Math.abs(cur-i),0,1),ink=clamp(cur-i+1,0,1),v=o.u?clamp(o.u*5-i,0,1):1;if(v<=0)return;ctx.save();ctx.globalAlpha*=ag_sine(v);
    lp_sheet(ctx,x,ty,360,80,{pin:false,light:o.light});if(hw>0){ctx.fillStyle=rgba(i===2?LP.orange:LP.ink,hw);ctx.fillRect(x,ty,360,12);}
    lp_T(ctx,L.name,x+30,ty+52,{w:600,size:30,col:mix(LP.mut,i===2&&hw>0?mix(LP.ink,LP.orange,hw):LP.ink,Math.max(ink,hw))});ctx.restore();});
  ctx.restore();}
// the five pages, small, side by side, each with its name and a small picture; o.info (0 to 1: Information lit), o.u (0 to 1: they come
// in), o.a, o.light; w is each page's width
function lf_fivePages(ctx,x,y,w,o){o=o||{};w=w||220;const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*1.2,gap=w*0.12;ctx.save();ctx.globalAlpha*=a;
  LF_LAYERS.forEach((L,i)=>{const v=o.u==null?1:clamp(o.u*5-i,0,1);if(v<=0)return;const px=x+i*(w+gap),lit=i===2?clamp(o.info||0,0,1):0;ctx.save();ctx.globalAlpha*=ag_sine(v);ctx.translate(0,(1-ag_spr(v,0,0.5))*16);
    lp_sheet(ctx,px,y,w,h,{pin:false,light:o.light,col:lit>0?mix(LP.mut,LP.orange,lit):null});
    lp_T(ctx,L.name,px+w/2,y+h-28,{w:lit>0.5?800:600,size:28,align:"center",col:mix(LP.ink,LP.orange,lit)});
    // its small picture, decoration
    const ix=px+w*0.14,iy=y+w*0.2,iw=w*0.72,ih=h-w*0.2-70;ctx.save();
    if(i===0){for(let k=0;k<4;k++){ctx.fillStyle=rgba(LP.blue,0.75);rr(ctx,ix+k*iw/4+2,iy,iw/4-4,ih*0.3,4);ctx.fill();}ctx.fillStyle=rgba(LP.green,0.8);rr(ctx,ix,iy+ih*0.55,iw/3-4,ih*0.3,4);ctx.fill();
      ctx.fillStyle=rgba(LP.amber,0.8);rr(ctx,ix+iw/3,iy+ih*0.55,iw/3-4,ih*0.3,4);ctx.fill();rr(ctx,ix+2*iw/3,iy+ih*0.55,iw/3-4,ih*0.3,4);ctx.fill();}
    else if(i===1){ctx.strokeStyle=rgba(LP.mut,0.8);ctx.lineWidth=2;for(let k=0;k<6;k++){ctx.beginPath();ctx.moveTo(ix,iy+k*ih*0.12);ctx.lineTo(ix+iw*0.45,iy+ih*0.3);ctx.stroke();}
      ctx.strokeStyle=rgba(LP.mut,1);ctx.lineWidth=2.5;ctx.strokeRect(ix+iw*0.45,iy+ih*0.18,iw*0.25,ih*0.24);ctx.fillStyle=rgba(LP.amber,0.85);rr(ctx,ix+iw*0.2,iy+ih*0.68,iw*0.8,ih*0.14,4);ctx.fill();}
    else if(i===2){for(let k=0;k<4;k++){ctx.fillStyle=rgba(LP.orange,0.3+0.6*(0.5+0.5*lit));rr(ctx,ix,iy+k*ih/4+2,iw*0.62,ih/4-6,4);ctx.fill();}}
    else if(i===3){for(let k=0;k<12;k++){ctx.fillStyle=rgba(k%3===1?mix(LP.amber,LP.paper,0.4):mix(LP.mut,LP.paper,0.3),1);ctx.fillRect(ix+(k%4)*iw/4+2,iy+Math.floor(k/4)*ih/3+2,iw/4-6,ih/3-8);}}
    else{for(let k=0;k<3;k++){ctx.fillStyle=rgba(mix(LP.graphite,LP.paper,0.2),1);rr(ctx,ix,iy+k*ih*0.2,iw*0.45,ih*0.15,3);ctx.fill();}ctx.strokeStyle=rgba(LP.mut,1);ctx.lineWidth=2.5;
      ctx.beginPath();ctx.arc(ix+iw*0.78,iy+ih*0.4,iw*0.16,Math.PI*0.6,Math.PI*2.4);ctx.stroke();}
    ctx.restore();ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- ArchiMate's bands */
// three bands, Business, Application and Technology; a business object in the first and a data object in the second; o.u (0 to 1),
// o.obj (0 to 1: the two objects come in), o.a, o.light
function lf_archimate(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const bh=150,gap=18;
  lp_sheet(ctx,x,y-110,w,3*bh+2*gap+150,{light:o.light});lp_label(ctx,x+40,y-40,"ArchiMate");
  [["Business","Business object"],["Application","Data object"],["Technology",null]].forEach(([n,ob],i)=>{const v=o.u==null?1:clamp(o.u*3-i,0,1);if(v<=0)return;const by=y+i*(bh+gap);ctx.save();ctx.globalAlpha*=ag_sine(v);
    ctx.fillStyle=rgba(mix(LP.wall,LP.paper,0.55),1);rr(ctx,x+30,by,w-60,bh,10);ctx.fill();lp_T(ctx,n,x+60,by+58,{w:800,size:30});
    if(ob){const ov=ag_sine(clamp(Array.isArray(o.obj)?o.obj[i]:(o.obj||0),0,1));if(ov>0){ctx.save();ctx.globalAlpha*=ov;const ox=x+60,oy=by+76,ow=Math.min(w-120,lp_tw(ctx,ob,{w:600,size:28})+60);
      ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(ox,oy,ow,56);ctx.strokeStyle=rgba(LP.ink,0.8);ctx.lineWidth=2.5;ctx.strokeRect(ox,oy,ow,56);ctx.beginPath();ctx.moveTo(ox,oy+14);ctx.lineTo(ox+ow,oy+14);ctx.stroke();
      lp_T(ctx,ob,ox+ow/2,oy+46,{w:600,size:28,align:"center"});ctx.restore();}}
    ctx.restore();});
  ctx.restore();}

/* ---------------------------------------------------------------- Noor's map */
// the architecture tool's screen: the five layers as bands, boxes on each, the information layer's in orange; o.u (0 to 1: the
// layers come on, one by one)
function lf_map(cx,X,Y,Wd,Hd,o){o=o||{};const u=clamp(o.u==null?1:o.u,0,1),R=ag_rnd(505),bh=(Hd-90)/5;
  cx.fillStyle=rgba(mix(LP.paper,LP.mut,0.06),1);cx.fillRect(X,Y,Wd,64);lp_T(cx,"Current state",X+30,Y+44,{w:800,size:30});
  LF_LAYERS.forEach((L,i)=>{const v=clamp(u*5-i,0,1);if(v<=0)return;const by=Y+76+i*bh,col=i===0?LP.blue:i===2?LP.orange:LP.mut;cx.save();cx.globalAlpha*=v;
    cx.fillStyle=rgba(mix(LP.wall,LP.paper,0.6),1);cx.fillRect(X+16,by,Wd-32,bh-8);lp_T(cx,L.name,X+34,by+bh/2+6,{w:700,size:28,col:i===2?LP.orange:LP.ink});
    const n=3+Math.floor(R()*3);for(let k=0;k<n;k++){const bx=X+290+k*((Wd-330)/n),bw=(Wd-330)/n-24;cx.strokeStyle=rgba(col,col===LP.mut?0.7:1);cx.lineWidth=2.5;rr(cx,bx,by+12,bw,bh-32,6);cx.stroke();
      cx.fillStyle=rgba(col,0.1);rr(cx,bx,by+12,bw,bh-32,6);cx.fill();}cx.restore();});}

/* ---------------------------------------------------------------- a card turning over */
// front {kick, title} on an amber band (a finding), back {kick, title} on a blue band (an opportunity); u 0 to 1: the turn
function lf_flip(ctx,x,y,w,front,back,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;u=clamp(u,0,1);const side=u<0.5?front:back,col=u<0.5?LP.amber:LP.blue,sc=Math.abs(Math.cos(Math.PI*ag_sine(u)));
  const m=lp_textSheet(ctx,x,y,w,side,{measure:true}),hh=Math.max(lp_textSheet(ctx,x,y,w,front,{measure:true}).h,lp_textSheet(ctx,x,y,w,back,{measure:true}).h),sy=y+(hh-m.h)/2;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+hh/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));ctx.translate(x+w/2,0);ctx.scale(Math.max(0.02,sc),1);ctx.translate(-x-w/2,0);
  // while it turns, the card shows no words (squeezed, they'd be too thin to read on a phone); they come back as it faces the camera
  const wa=clamp((sc-0.94)/0.06,0,1);if(wa<1)lp_sheet(ctx,x,sy,w,m.h,{col,light:null,pin:false});
  if(wa>0){ctx.save();ctx.globalAlpha*=wa;lp_textSheet(ctx,x,sy,w,side,{col,light:sc>0.98?o.light:null,pin:false});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the summary, sent back */
// the message to the 31 (o.u: it comes in), replies coming back (o.re, 0 to 1), and a page whose line is struck and written again
// (o.fix, 0 to 1)
function lf_mail(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const w=760,h=330;
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light,pin:false});lp_T(ctx,"To: 31 people",x+44,y+84,{w:800,size:30,col:LP.blue});
  ctx.strokeStyle=rgba(LP.mut,0.3);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+44,y+110);ctx.lineTo(x+w-44,y+110);ctx.stroke();
  lp_T(ctx,"This is what I heard.",x+44,y+172,{w:800,size:40});lp_T(ctx,"Tell me what I got wrong.",x+44,y+228,{w:800,size:40});
  lp_T(ctx,"The current state · 7 opportunities",x+44,y+286,{w:600,size:28,col:LP.mut});
  // replies: small slips that land beside it
  const re=clamp(o.re||0,0,1);for(let k=0;k<4;k++){const v=clamp(re*4-k,0,1);if(v<=0)continue;const sx=x+w+60+(k%2)*130,sy=y+20+k*80;ctx.save();ctx.globalAlpha*=ag_sine(v);ctx.translate((1-ag_eo(v))*120,0);
    lf_leaf(ctx,sx,sy,220,64,{lines:0});lp_T(ctx,"Re:",sx+18,sy+44,{w:800,size:28,col:LP.mut});ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.45),1);
    ctx.fillRect(sx+80,sy+24,110,5);ctx.fillRect(sx+80,sy+38,80,5);ctx.restore();}
  // a page of the current state, one line struck through and written again
  const fx=clamp(o.fix||0,0,1);if(fx>0){const px=x+w+440,py=y+60;ctx.save();ctx.globalAlpha*=ag_in(fx,0,0.2);lf_leaf(ctx,px,py,320,200,{lines:0});
    for(let k=0;k<4;k++){ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.4),1);ctx.fillRect(px+30,py+40+k*38,220-(k%2)*40,6);}
    const s=ag_sine(clamp((fx-0.15)/0.35,0,1));if(s>0){ctx.strokeStyle=rgba(LP.ink,0.9);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(px+24,py+81);ctx.lineTo(px+24+(220)*s,py+79);ctx.stroke();}
    const n=ag_sine(clamp((fx-0.55)/0.45,0,1));if(n>0){ctx.strokeStyle=rgba(LP.ink,0.9);ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=40*n;i++){const v=i/40,qx=px+30+v*200,qy=py+104+Math.sin(v*TAU*5)*4;i?ctx.lineTo(qx,qy):ctx.moveTo(qx,qy);}ctx.stroke();}
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- cards of this film's own */
// the mothers' word, large, on its own card, its meaning under it: o.mean (0 to 1), o.a, o.k, o.light; h 250
function lf_wordCard(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=250;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:o.light});lp_T(ctx,"kwashiorkor",x+w/2,y+132,{w:800,size:76,align:"center"});
  const m=ag_sine(clamp(o.mean||0,0,1));if(m>0)lp_T(ctx,"In Ga: the disease of the displaced child",x+w/2,y+202,{w:600,size:30,align:"center",col:LP.mut,a:m});
  ctx.restore();return{x,y,w,h};}
// one of the strategy's goals, on a blue band, its words 34 px; o.a, o.k, o.light
function lf_goalTile(ctx,x,y,w,h,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});const ls=lp_wrap(ctx,text,w-72,{w:800,size:34}),y0=y+h/2-(ls.length-1)*21+17;ls.forEach((s,i)=>lp_T(ctx,s,x+36,y0+i*42,{w:800,size:34}));
  ctx.restore();}
// an opportunity, on a blue band: its number and its words; o.a, o.k, o.light
function lf_oppCard(ctx,x,y,w,h,n,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light,pin:false});lp_T(ctx,String(n),x+32,y+70,{w:800,size:32,col:LP.blue});
  const ls=lp_wrap(ctx,text,w-110,{w:700,size:32});ls.forEach((s,i)=>lp_T(ctx,s,x+78,y+70+i*42,{w:700,size:32}));ctx.restore();}
// the seven opportunities, small, four and three; o.u (0 to 1: they come in), o.a, o.light
function lf_miniCards(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<7;i++){const v=o.u==null?1:clamp(o.u*7-i,0,1);if(v<=0)continue;const cx=x+(i<4?i:i-4+0.5)*170,cy=y+(i<4?0:110);ctx.save();ctx.globalAlpha*=ag_sine(v);
    lp_sheet(ctx,cx,cy,150,90,{col:LP.blue,light:o.light,pin:false});lp_T(ctx,String(i+1),cx+22,cy+64,{w:800,size:30,col:LP.blue});
    ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.45),1);ctx.fillRect(cx+58,cy+40,70,6);ctx.fillRect(cx+58,cy+56,50,6);ctx.restore();}
  ctx.restore();}
