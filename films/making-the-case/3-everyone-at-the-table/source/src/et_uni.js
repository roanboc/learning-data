/* ===== Everyone at the table: the university, May to July 2027 =====
   The film's own pictures at the university, on the module's kit (prefix et_). Colour keeps the module's meaning: the plan, its page
   and the moved month in blue (design and plans); what's agreed and what's done in green; risk, the reports nobody opens, payroll's
   busiest weeks and what waits in amber; the reports and the measures in orange (data). People wear none of the five.
     etUni, etHR        the team's room on an afternoon; HR's office in the morning
     ET_INGRID, ET_ROHAN, ET_STAFFREP   HR, Finance, and a representative of the staff (each looked at full size, facing both
                        ways, on 10 November 2026)
     et_sheet, et_u, et_tag, et_pill, et_thread, et_leaf    small things: a sheet that springs in and leaves, lines that come in one by
                        one, a tag, a pill, a line that draws itself, a small page
     et_reports         the old warehouse's 38 reports: the 21 people use move to the platform, the 17 nobody opens are retired
     et_list            Helena's list of everyone the plan touches, filling as she asks herself who uses the data, who makes it, who
                        pays, who decides and whose data it is
     et_grid            the power and interest grid: the fourteen, each placed by the two questions; the quiet ones ringed
     et_pair            two people side by side, each with their own words over them
     et_speakers        who speaks to whom for the team, and how often
     et_page            the page that goes to everyone on the first Monday of every month: where the plan is, the measures, the top
                        three risks, the decisions needed; June's and July's
     et_forYou          the fourteen, each with a short line of their own, and the same page beside each
     et_measures        the measures page on the platform, on the wall's screen
     et_timeline        the move's months, July to December: HR's reports, payroll's busiest weeks, and the move to August
     et_ring            fourteen stakeholders round the move, the loudest larger
   The module's mark on the title and the end card is the module's own, dm_mark (films/a-plan-in-ninety-days/shared/src/mark.js). */

AG_PLACES.etUni=c=>lp_paintRoom(c,{light:"day",seed:6});
AG_PLACES.etHR=c=>lp_paintRoom(c,{light:"morning",seed:14,base:[222,212,196]});
const ET_DAY={light:"day"},ET_MO={light:"morning"};
const ET_INGRID={name:"Ingrid Holm",role:"HR",key:"et-ingrid",skin:[236,204,182],hair:{style:"bun",c:[196,176,140]},glasses:[70,62,58],top:{kind:"blazer",c:[118,100,90],inner:[238,234,228]},breath:0.28};
const ET_ROHAN={name:"Rohan Desai",role:"Finance",key:"et-rohan",skin:[182,132,98],hair:{style:"side",c:[30,26,26]},glasses:[52,40,34],top:{kind:"blazer",c:[124,104,82],inner:[234,236,240]},breath:0.26};
const ET_STAFFREP={name:"A staff representative",role:"For the staff",key:"et-staffrep",skin:[204,160,126],hair:{style:"cropped",c:[132,126,120]},glasses:[60,54,50],
  top:{kind:"cardigan",c:[132,118,104],inner:[232,230,224]},breath:0.27};
const ET_DAVID_ROLE="Deputy vice-chancellor";

/* ---------------------------------------------------------------- small things */
// a sheet that springs in at t0 and leaves from o.out: lp_textSheet's words and options
function et_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return lp_textSheet(ctx,x,y,w,words,{measure:true});
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its time: lp_textSheet's u
const et_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag in at t0, out at t1 (null: stays)
function et_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 and leaves at t1
function et_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a line that draws itself from A to B (u 0 to 1), through a gentle curve; o.col, o.w, o.a, o.bend
function et_thread(ctx,A,B,u,o){o=o||{};u=clamp(u,0,1);if(u<=0)return;const a=o.a==null?1:o.a;if(a<=0.004)return;const mx=(A[0]+B[0])/2,my=(A[1]+B[1])/2-(o.bend==null?40:o.bend);
  ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(o.col||LP.blue,1);ctx.lineWidth=o.w||6;ctx.lineCap="round";ctx.beginPath();const n=40;
  for(let i=0;i<=n*u;i++){const v=i/n,m=1-v,x=m*m*A[0]+2*m*v*mx+v*v*B[0],y=m*m*A[1]+2*m*v*my+v*v*B[1];i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.restore();}
// a small page: a sheet with lines on it, o.col its band
function et_leaf(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.shadowColor="rgba(52,36,30,0.22)";ctx.shadowBlur=8;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=4;ctx.fillStyle=rgba(o.bg||LP.paper,1);ctx.fillRect(x,y,w,h);ctx.restore();
  if(o.col){ctx.fillStyle=rgba(o.col,1);ctx.fillRect(x,y,w,Math.max(4,h*0.08));}const n=o.lines==null?4:o.lines;ctx.fillStyle=rgba(o.ink||mix(LP.mut,LP.paper,0.45),1);
  for(let i=0;i<n;i++){ctx.fillRect(x+w*0.14,y+h*(0.26+i*0.16),w*(0.72-0.12*(i%3)),Math.max(2,h*0.05));}}

/* ---------------------------------------------------------------- the old warehouse's 38 reports */
// 38 small reports in a block on the left; with o.split (0 to 1) the 21 people use move into the platform's frame on the right; with
// o.retire (0 to 1; o.split when it isn't given) the 17 nobody opens fade and turn amber where they were. o.u (0 to 1: they come in), o.a
const ET_USED=(()=>{const R=ag_rnd(2138),idx=[...Array(38).keys()];for(let i=37;i>0;i--){const j=(R()*(i+1))|0;[idx[i],idx[j]]=[idx[j],idx[i]];}const s=new Set(idx.slice(0,21));return i=>s.has(i);})();
function et_reports(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=clamp(o.u==null?1:o.u,0,1),sp=ag_sine(o.split||0),fa=clamp(o.frame==null?sp*2:o.frame,0,1),
    rt=o.retire==null?sp:ag_sine(clamp(o.retire,0,1));ctx.save();ctx.globalAlpha*=a;
  if(fa>0.004){ctx.save();ctx.globalAlpha*=fa;lp_sheet(ctx,1180,190,640,560,{light:"day"});lp_label(ctx,1224,272,"The platform");ctx.restore();}
  let ku=0,kd=0;for(let i=0;i<38;i++){const used=ET_USED(i),c=i%10,r=(i/10)|0,x0=130+c*96,y0=210+r*124;let x=x0,y=y0;
    if(used){const k=ku++,tc=k%7,tr=(k/7)|0;x=lerp(x0,1226+tc*80,sp);y=lerp(y0,316+tr*124,sp);}else kd++;
    const v=ag_eo(clamp(u*38-i*0.7,0,1));if(v<=0)continue;ctx.save();ctx.globalAlpha*=v*(used?1:1-0.55*rt);
    et_leaf(ctx,x,y,64,86,{col:used?LP.orange:mix(LP.orange,LP.amber,rt),lines:4});
    if(!used&&rt>0.5){ctx.globalAlpha*=ag_sine((rt-0.5)*2);lp_icon(ctx,"cross",x+32,y+46,30,LP.amber);}ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- Helena's list */
// the fourteen, in the order she finds them: o.n (0 to 14, fractional: the next fades in); the first three, the ones who ask most often
// and most loudly, come at once
const ET_LIST=["Finance","Planning","The four deans","Registrar's office","Facilities","Report users","HR","IT","The data team","Data partners",
  "Director of digital services","Deputy vice-chancellor","Staff","Students"];
function et_list(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=520;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});lp_T(ctx,"HELENA'S LIST",x+44,y+84,{w:800,size:28,ls:3,col:LP.blue});lp_T(ctx,"Everyone the plan touches",x+44,y+138,{w:800,size:40});
  const n=clamp(o.n||0,0,14),cw=(w-88)/2;
  ET_LIST.forEach((s,i)=>{const v=clamp(n-i,0,1);if(v<=0)return;const cx=x+44+(i<7?0:cw),cy=y+206+(i%7)*44;ctx.save();ctx.globalAlpha*=ag_sine(v);
    ctx.fillStyle=rgba(LP.ink,1);ctx.beginPath();ctx.arc(cx+8,cy-10,6,0,TAU);ctx.fill();lp_T(ctx,s,cx+30,cy,{w:i<3?800:600,size:28});ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the power and interest grid */
// the sheet's frame; the plot inside it
const ET_G={x:100,y:150,w:1720,h:730,x0:190,x1:1770,y0:320,y1:840};
const et_gx=f=>250+f*1460,et_gy=f=>800-f*440;
// the fourteen: name, interest (0 to 1), power (0 to 1), the label to the dot's right ("r": to its left)
const ET_FOURTEEN=[["Deputy vice-chancellor",0.80,0.94,"r"],["Director of digital services",0.62,0.82],["Finance",0.90,0.70],["HR",0.74,0.66],
  ["The four deans",0.18,0.84],["IT",0.34,0.68],["Registrar's office",0.60,0.40],["Planning",0.86,0.44],["The data team",0.95,0.58,"r"],
  ["Facilities",0.52,0.26],["Data partners",0.76,0.28],["Report users, about 260",0.62,0.12],["Staff",0.16,0.20],["Students",0.30,0.10]];
// o.show: 14 numbers, 0 to 1 (each one comes in); o.axes, o.title (0 to 1); o.pw, o.it (0 to 1: the two questions on the axes, with
// o.axes when not given); o.rings (0 to 1: the quiet ones ringed); o.leaves (0 to 1: the same small page by each, one after another);
// o.dim (0 to 1: all but o.keep fade back); o.a, o.k
function et_grid(ctx,o){o=o||{};const G=ET_G,a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,G.x+G.w/2,G.y+G.h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,G.x,G.y,G.w,G.h,{light:"day"});lp_T(ctx,"EVERYONE THE PLAN TOUCHES",G.x+44,G.y+70,{w:800,size:28,ls:3,col:LP.mut});
  const ti=clamp(o.title||0,0,1);if(ti>0){ctx.save();ctx.globalAlpha*=ag_sine(ti);lp_T(ctx,"A power and interest grid",G.x+44,G.y+126,{w:800,size:40});
    const tw=lp_tw(ctx,"A power and interest grid",{w:800,size:40});lp_T(ctx,"after Aubrey Mendelow's work",G.x+44+tw+24,G.y+126,{w:600,size:28,col:LP.mut});ctx.restore();}
  const ax=clamp(o.axes==null?1:o.axes,0,1);if(ax>0){ctx.save();ctx.globalAlpha*=ag_sine(ax);ctx.strokeStyle=rgba(LP.ink,0.85);ctx.fillStyle=rgba(LP.ink,0.85);ctx.lineWidth=3;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(G.x0,G.y1);ctx.lineTo(G.x0,G.y0);ctx.moveTo(G.x0,G.y1);ctx.lineTo(G.x1,G.y1);ctx.stroke();
    for(const [px,py,dx,dy] of [[G.x0,G.y0,0,-1],[G.x1,G.y1,1,0]]){ctx.beginPath();ctx.moveTo(px+dx*14,py+dy*14);ctx.lineTo(px-dy*9,py+dx*9);ctx.lineTo(px+dy*9,py-dx*9);ctx.closePath();ctx.fill();}
    ctx.setLineDash([10,10]);ctx.strokeStyle=rgba(LP.mut,0.45);ctx.lineWidth=2;const xm=(G.x0+G.x1)/2,ym=(G.y0+G.y1)/2;
    ctx.beginPath();ctx.moveTo(xm,G.y0+10);ctx.lineTo(xm,G.y1-6);ctx.moveTo(G.x0+6,ym);ctx.lineTo(G.x1-10,ym);ctx.stroke();ctx.setLineDash([]);
    ctx.restore();
    const pw=clamp(o.pw==null?ax:o.pw,0,1),it=clamp(o.it==null?ax:o.it,0,1);
    if(pw>0){ctx.save();ctx.globalAlpha*=ag_sine(pw);lp_T(ctx,"Power:",G.x0+26,G.y0+12,{w:800,size:28});
      lp_T(ctx,"how much they can shape the plan",G.x0+26+lp_tw(ctx,"Power:",{w:800,size:28})+12,G.y0+12,{w:600,size:28,col:LP.mut});ctx.restore();}
    if(it>0){ctx.save();ctx.globalAlpha*=ag_sine(it);const t2="how much it touches them",w2=lp_tw(ctx,t2,{w:600,size:28});lp_T(ctx,t2,G.x1-16,G.y1-20,{w:600,size:28,col:LP.mut,align:"right"});
      lp_T(ctx,"Interest:",G.x1-16-w2-12,G.y1-20,{w:800,size:28,align:"right"});ctx.restore();}}
  const dim=clamp(o.dim||0,0,1),keep=o.keep||[];
  ET_FOURTEEN.forEach(([s,fi,fp,al],i)=>{const v=o.show?clamp(o.show[i]||0,0,1):1;if(v<=0)return;const px=et_gx(fi),py=et_gy(fp),r=al==="r";
    ctx.save();ctx.globalAlpha*=ag_sine(v)*(keep.includes(i)?1:1-0.7*dim);const sc=ag_spr(v*0.9,0,0.4);
    ctx.fillStyle=rgba(LP.ink,1);ctx.beginPath();ctx.arc(px,py,11*Math.max(0.2,sc),0,TAU);ctx.fill();
    lp_T(ctx,s,r?px-26:px+26,py+10,{w:700,size:28,align:r?"right":"left"});
    const lv=clamp(o.leaves?(o.leaves*14-i*0.5)/1.5:0,0,1);if(lv>0){ctx.save();ctx.globalAlpha*=ag_sine(lv);et_leaf(ctx,r?px+24:px-52,py-18,28,36,{col:LP.blue,lines:3});ctx.restore();}
    ctx.restore();});
  const rg=clamp(o.rings||0,0,1);if(rg>0){for(const i of [12,13]){const px=et_gx(ET_FOURTEEN[i][1]),py=et_gy(ET_FOURTEEN[i][2]);ctx.save();ctx.strokeStyle=rgba(LP.ink,0.9);ctx.lineWidth=3;
    ctx.beginPath();ctx.arc(px,py,19,-Math.PI/2,-Math.PI/2+TAU*ag_sine(rg));ctx.stroke();ctx.restore();}}
  ctx.restore();}

/* ---------------------------------------------------------------- two people, each with their own words */
// [who, the line, the word their name is said on, the word their words start on, words, role]: words over each, name tags, the people
function et_pair(x,tt,sc,A,B,o){o=o||{};const w=(id,word,off)=>wAt(sc,id,word,off);
  [A,B].forEach((P,i)=>{if(!P)return;const t0=w(P.line,P.name,-0.6);
    et_sheet(x,tt,w(P.line,P.at,-0.2),i?1040:120,170,760,{kick:P.kick,title:P.words},{light:"day"});
    lp_nameTag(x,i?1260:660,560,P.who,{align:i?"right":"left",a:ag_in(tt,t0+0.3,0.5),role:P.role,name:P.label});});
  [A,B].forEach((P,i)=>{if(P)lp_person(x,P.who,i?1440:480,720,0.8,{t:tt,flip:!!i,a:ag_in(tt,w(P.line,P.name,-0.6),0.6),light:ET_DAY});});}

/* ---------------------------------------------------------------- who speaks to whom, and how often */
const ET_SPEAK=[["The deputy vice-chancellor","Helena","Every month"],["Each dean","Their data partner","Every month"],["IT","Noor","Every month"],
  ["Staff and student representatives","Yusuf","Every semester"]];
// o.rows: four numbers, 0 to 1 (each row comes in); o.one (0 to 1: the one voice for each turns blue); o.a, o.k
function et_speakers(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=520;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:"day"});lp_T(ctx,"WHO SPEAKS FOR THE TEAM",x+44,y+84,{w:800,size:28,ls:3,col:LP.blue});
  const c1=x+44,c2=x+w*0.52,c3=x+w*0.79;lp_T(ctx,"To",c1,y+150,{w:600,size:28,col:LP.mut});lp_T(ctx,"Who speaks",c2,y+150,{w:600,size:28,col:LP.mut});lp_T(ctx,"How often",c3,y+150,{w:600,size:28,col:LP.mut});
  ctx.fillStyle=rgba(LP.mut,0.35);ctx.fillRect(c1,y+170,w-88,2);const one=clamp(o.one||0,0,1);
  ET_SPEAK.forEach((r,i)=>{const v=o.rows?clamp(o.rows[i]||0,0,1):1;if(v<=0)return;const ry=y+232+i*72;ctx.save();ctx.globalAlpha*=ag_sine(v);
    lp_T(ctx,r[0],c1,ry,{w:700,size:28});lp_T(ctx,r[1],c2,ry,{w:700,size:28,col:mix(LP.ink,LP.blue,ag_sine(one))});lp_T(ctx,r[2],c3,ry,{w:600,size:28});
    ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the page, every month */
// a tall sheet: its band in blue (it's the plan's); the month; where the plan is (six work packages, each a bar), the measures, the top
// three risks, the decisions needed. o.month ("June 2027"), o.u: four numbers 0 to 1 (each section comes in), o.decision (the June page's
// decision, 0 to 1), o.agreed (the July page: the decision agreed), o.left (the July page: the old extract left behind), o.bad (a piece
// of bad news on it, in amber), o.link (the measures from July: a link to the platform), o.blank (no month's decisions yet: grey
// lines), o.a, o.k
const ET_RISKS=["The licence ends before every report moves","Personal data in old extracts","The team stretched thin"];
function et_page(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=720;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light===undefined?"day":o.light});lp_T(ctx,"THE DATA PLAN",x+44,y+84,{w:800,size:28,ls:3,col:LP.blue});
  lp_T(ctx,o.month||"June 2027",x+44,y+138,{w:800,size:40});const U=o.u||[1,1,1,1],sec=(i,yy,label,draw)=>{const v=clamp(U[i],0,1);if(v<=0)return;ctx.save();ctx.globalAlpha*=ag_sine(v);
    lp_T(ctx,label,x+44,yy,{w:800,size:28});draw(yy);ctx.restore();};
  // where the plan is: the six work packages, each a bar as far along as it is
  sec(0,y+206,"Where the plan is",yy=>{const P=o.plan||[0.2,0.08,0.05,0.04,0.0,0.02],bw=(w-88-50)/6;P.forEach((p,i)=>{const bx=x+44+i*(bw+10);ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.8),1);rr(ctx,bx,yy+20,bw,18,9);ctx.fill();
      ctx.fillStyle=rgba(LP.blue,1);rr(ctx,bx,yy+20,Math.max(18,bw*p),18,9);ctx.fill();});});
  // the measures: until July, February's 41 working days; from July, a link to the measures page
  sec(1,y+300,"The measures",yy=>{if(o.link){lp_T(ctx,"On the measures page, on the platform",x+44,yy+42,{w:600,size:28,col:LP.blue});ctx.fillStyle=rgba(LP.blue,1);ctx.fillRect(x+44,yy+50,lp_tw(ctx,"On the measures page, on the platform",{w:600,size:28}),2);}
      else{lp_T(ctx,"41",x+44,yy+44,{w:800,size:28,col:LP.amber});lp_T(ctx,"working days, from the ask to first use",x+90,yy+44,{w:600,size:28});}});
  // the top three risks
  sec(2,y+394,"Top three risks",yy=>{ET_RISKS.forEach((s,i)=>{ctx.fillStyle=rgba(LP.amber,1);ctx.beginPath();ctx.arc(x+52,yy+32+i*38,6,0,TAU);ctx.fill();lp_T(ctx,s,x+76,yy+42+i*38,{w:600,size:28});});});
  // the decisions needed
  sec(3,y+566,"Decisions needed",yy=>{const d=clamp(o.decision||0,0,1),g=clamp(o.agreed||0,0,1);
    if(g>0){ctx.save();ctx.globalAlpha*=ag_sine(g);lp_icon(ctx,"tick",x+56,yy+32,30,LP.green);lp_T(ctx,"Agreed: HR's reports move in August",x+80,yy+42,{w:700,size:28,col:LP.green});ctx.restore();}
    else if(d>0){ctx.save();ctx.globalAlpha*=ag_sine(d);ctx.fillStyle=rgba(LP.blue,1);ctx.beginPath();ctx.arc(x+52,yy+32,6,0,TAU);ctx.fill();
      lp_T(ctx,"HR's reports move in August?",x+76,yy+42,{w:700,size:28,col:LP.blue});lp_T(ctx,"Payroll's year end fills July",x+76,yy+80,{w:600,size:28,col:LP.mut});ctx.restore();}
    else if(o.blank){ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.55),1);rr(ctx,x+44,yy+28,(w-88)*0.62,10,5);ctx.fill();rr(ctx,x+44,yy+62,(w-88)*0.44,10,5);ctx.fill();}
    else lp_T(ctx,"None this month",x+44,yy+42,{w:600,size:28,col:LP.mut});});
  // the July page's good news: what was left behind
  const lf=clamp(o.left||0,0,1);if(lf>0){ctx.save();ctx.globalAlpha*=ag_sine(lf);const yy=y+566+96;lp_icon(ctx,"tick",x+56,yy+32,30,LP.green);
    lp_T(ctx,"Left behind: an old extract",x+80,yy+42,{w:700,size:28,col:LP.green});ctx.restore();}
  const bd=clamp(o.bad||0,0,1);if(bd>0){ctx.save();ctx.globalAlpha*=ag_sine(bd);const yy=y+566+96;ctx.fillStyle=rgba(LP.amber,1);ctx.beginPath();ctx.arc(x+52,yy+32,6,0,TAU);ctx.fill();
    lp_T(ctx,"Bad news, as soon as it's known",x+76,yy+42,{w:700,size:28,col:LP.amber});ctx.restore();}
  ctx.restore();return{x,y,w,h};}
// the fourteen in a column, each with a short line of their own (o.lines, 0 to 1) and, with o.same (0 to 1), the same small page beside
// each; o.a, o.k
const ET_SHORT=["Deputy vice-chancellor","Director of digital services","Finance","HR","The four deans","IT","Registrar's office","Planning","Facilities",
  "Data partners","Report users","The data team","Staff","Students"];
function et_forYou(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=720;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:"day"});lp_T(ctx,"A LINE FOR EACH",x+44,y+84,{w:800,size:28,ls:3,col:LP.mut});const ln=clamp(o.lines||0,0,1),sm=clamp(o.same||0,0,1);
  ET_SHORT.forEach((s,i)=>{const yy=y+140+i*40,v=clamp(ln*14-i,0,1);ctx.save();ctx.globalAlpha*=0.35+0.65*ag_sine(v);lp_T(ctx,s,x+44,yy+10,{w:600,size:28});ctx.restore();
    const lw=Math.max(0,w-88-lp_tw(ctx,s,{w:600,size:28})-110);if(v>0&&lw>20){ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.45),ag_sine(v));rr(ctx,x+44+lp_tw(ctx,s,{w:600,size:28})+18,yy-2,lw*0.8,8,4);ctx.fill();}
    const pv=clamp(sm*14-i,0,1);if(pv>0){ctx.save();ctx.globalAlpha*=ag_sine(pv);et_leaf(ctx,x+w-72,yy-22,28,36,{col:LP.blue,lines:3});ctx.restore();}});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the measures page, on the platform */
// what the screen shows: its name; days from the ask to first use, February and June, as bars; o.u (0 to 1: the bars grow)
function et_measures(cx,X,Y,Wd,Hd,o){o=o||{};const u=clamp(o.u==null?1:o.u,0,1);
  cx.fillStyle=rgba(mix(LP.paper,LP.mut,0.06),1);cx.fillRect(X,Y,Wd,84);lp_T(cx,"The measures page",X+40,Y+56,{w:800,size:36});lp_T(cx,"On the platform",X+Wd-40,Y+54,{w:600,size:28,col:LP.mut,align:"right"});
  lp_T(cx,"Days from the ask to first use",X+40,Y+140,{w:700,size:28});
  lp_bars(cx,X+60,Y+160,Wd-460,Hd-190,[{v:41,label:"February",show:"41"},{v:24,label:"June",show:"24"}],{col:LP.orange,max:45,u});
  lp_T(cx,"Counted from the tracker,",X+Wd-370,Y+260,{w:600,size:28,col:LP.mut});lp_T(cx,"so anyone can check",X+Wd-370,Y+300,{w:600,size:28,col:LP.mut});}

/* ---------------------------------------------------------------- the move's months */
// a sheet: the months June to December in a row; HR's reports a blue block in July, its name over it, sliding to August with o.move
// (0 to 1); payroll's year end an amber band from 30 June to mid-July, o.band (0 to 1); o.end (0 to 1: the financial year's end, a dashed
// line on 30 June); o.hr (0 to 1: the block comes in); o.a, o.k
const ET_MONTHS=["June","July","August","September","October","November","December"];
function et_timeline(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=520;if(a<=0.004)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light===undefined?"morning":o.light});lp_T(ctx,"THE MOVE'S DATES",x+44,y+84,{w:800,size:28,ls:3,col:LP.blue});lp_T(ctx,"Reports moving to the platform",x+44,y+138,{w:800,size:40});
  const gx=x+44,gw=w-88,mw=gw/7,ty=y+206,by=ty+36,bot=y+h-36;
  ET_MONTHS.forEach((m,i)=>{lp_T(ctx,m.slice(0,3),gx+i*mw+mw/2,ty,{w:700,size:28,align:"center",col:LP.mut});ctx.fillStyle=rgba(LP.mut,0.25);ctx.fillRect(gx+i*mw,ty+18,1.5,bot-ty-18);});
  ctx.fillStyle=rgba(LP.mut,0.35);ctx.fillRect(gx,ty+18,gw,2);
  // payroll's busiest weeks: from the end of June to the middle of July; its name under the block's row
  const bd=clamp(o.band||0,0,1),bx0=gx+mw*0.86,bx1=gx+mw*1.55;if(bd>0){ctx.save();ctx.globalAlpha*=ag_sine(bd);ctx.fillStyle=rgba(LP.amber,0.16);ctx.fillRect(bx0,by,bx1-bx0,bot-by);
    ctx.fillStyle=rgba(LP.amber,1);ctx.fillRect(bx0,by,bx1-bx0,8);lp_T(ctx,"Payroll's year end",bx0+10,bot-22,{w:700,size:28,col:LP.amber});ctx.restore();}
  const en=clamp(o.end||0,0,1);if(en>0){ctx.save();ctx.globalAlpha*=ag_sine(en);ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=3;ctx.setLineDash([8,7]);ctx.beginPath();ctx.moveTo(bx0,by-4);ctx.lineTo(bx0,bot);ctx.stroke();ctx.restore();}
  // HR's reports: a block a month long, in July, then in August, its name over it
  const mv=ag_sine(clamp(o.move||0,0,1)),hb=clamp(o.hr==null?1:o.hr,0,1);if(hb>0){const hx=gx+mw*(1+mv)+8,hy=by+92,bw=mw-16;ctx.save();ctx.globalAlpha*=ag_sine(hb);
    ctx.save();ctx.shadowColor="rgba(52,36,30,0.25)";ctx.shadowBlur=10;ctx.shadowOffsetX=LP.sdx*0.4;ctx.shadowOffsetY=4;ctx.fillStyle=rgba(LP.blue,1);rr(ctx,hx,hy,bw,44,10);ctx.fill();ctx.restore();
    lp_T(ctx,"HR's reports",hx+bw/2,hy-18,{w:800,size:28,align:"center",col:LP.blue});ctx.restore();}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- fourteen round the move */
// fourteen marks in a ring round the move; o.loud (0 to 1: three of them grow larger, the loudest); o.u (0 to 1: they come in);
// o.leaves (0 to 1: the same small page beside each, one after another); o.a
function et_ring(ctx,cx,cy,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=clamp(o.u==null?1:o.u,0,1),ld=ag_sine(clamp(o.loud||0,0,1));ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<14;i++){const v=ag_eo(clamp(u*14-i,0,1));if(v<=0)continue;const an=-Math.PI/2+i*TAU/14,px=cx+Math.cos(an)*r,py=cy+Math.sin(an)*r,loud=i===0||i===4||i===9;
    const rad=(loud?14+16*ld:14-4*ld)*v;ctx.strokeStyle=rgba(LP.mut,0.35*v);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(px,py);ctx.stroke();
    ctx.fillStyle=rgba(LP.ink,loud?1:1-0.45*ld);ctx.beginPath();ctx.arc(px,py,rad,0,TAU);ctx.fill();
    const lv=clamp(o.leaves?(o.leaves*14-i*0.5)/1.5:0,0,1);if(lv>0){ctx.save();ctx.globalAlpha*=ag_sine(lv);et_leaf(ctx,cx+Math.cos(an)*(r+44)-14,cy+Math.sin(an)*(r+44)-18,28,36,{col:LP.blue,lines:3});ctx.restore();}}
  ctx.restore();}
