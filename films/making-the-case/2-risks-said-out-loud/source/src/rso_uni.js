/* ===== Risks, said out loud: the university, April to June 2027 =====
   The film's own pictures at the university, on the module's kit (prefix rso_). Colour keeps the module's meaning: each risk, its
   early sign and the register in amber (risk); the case and the council's page in blue (plans); a risk closed, a report rebuilt, a
   check passed in green; the staff list and its columns in orange (data). People and their clothes wear none of the five.
     rsoTeam, rsoCouncil, rsoMeet, rsoGrey   the team's room in May's morning light, the council's room in the late sun, the meeting
                         room on the morning of the pre-mortem, and the team's room on a grey June day
     rso_sign            the early sign's mark: a small flag on a pole, as Amundsen's were
     rso_register        the risk register on one sheet: three of its eight rows at a time, each a risk in a line, its owner,
                         likelihood, impact and response
     rso_risk            one risk in full: its sentence in three parts (a cause, what could happen, what it would do), its owner, a
                         date to look again, likelihood and impact, a response and an early sign
     rso_responses       the four responses, avoid, reduce, share and accept, one of them chosen
     rso_appetite        the council's appetite for risk: low, medium or high, for three kinds of risk
     rso_wall            the pre-mortem's notes on the wall: eight people's reasons, in eight columns (scribbles, not words: decoration)
     rso_extract         an extract: a copy the old warehouse takes from another system, here HR's staff list, for a report
     rso_catalog         the catalog, on a screen: the extract's columns, the five the report shows, and the two tagged personal
     rso_page            the data council's one page for the month: the top three risks, each with its owner and its sign */

AG_PLACES.rsoTeam=c=>lp_paintRoom(c,{light:"morning",seed:5});
AG_PLACES.rsoCouncil=c=>lp_paintRoom(c,{light:"late",seed:3});
AG_PLACES.rsoMeet=c=>lp_paintRoom(c,{light:"day",seed:2});
AG_PLACES.rsoGrey=c=>lp_paintRoom(c,{light:"grey",seed:7});

/* ---------------------------------------------------------------- the early sign's mark: a small flag */
function rso_sign(ctx,x,y,s,col){s=s||1;ctx.save();ctx.strokeStyle=rgba(LP.ink,1);ctx.lineWidth=3*s;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y+14*s);ctx.lineTo(x,y-16*s);ctx.stroke();
  ctx.fillStyle=rgba(col||LP.amber,1);ctx.beginPath();ctx.moveTo(x+1*s,y-16*s);ctx.lineTo(x+22*s,y-10*s);ctx.lineTo(x+1*s,y-3*s);ctx.closePath();ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the register: three rows at a time */
const RSO_RISKS={
  R1:{text:"The licence ends before every report moves",owner:"Helena",L:"Medium",I:"High",resp:"Reduce"},
  R2:{text:"A report loses its owner on the move",owner:"Noor",L:"Medium",I:"Medium",resp:"Reduce"},
  R3:{text:"Personal data could be exposed in the move",owner:"Yusuf",L:"Medium",I:"High",resp:"Avoid",vague:true},
  R3b:{id:"R3",text:"Personal data in old extracts copied across",owner:"Yusuf",L:"Medium",I:"High",resp:"Avoid"},
  R4:{text:"The team stretched between the move and requests",owner:"Helena",L:"High",I:"Medium",resp:"Reduce"},
  R6:{text:"Data partners don't take hold in faculties",owner:"Helena",L:"Medium",I:"Medium",resp:"Share"},
  R7:{text:"An agent with more rights than its job",owner:"Noor",L:"Low",I:"High",resp:"Avoid"},
  R8:{text:"One person keeps payroll's export",owner:"Sam",L:"Low",I:"High",resp:"Reduced",done:true}};
const RSO_COLS=[["Risk",96],["Owner",760],["Likely",930],["Impact",1100],["Response",1270]];
// rows: keys of RSO_RISKS; o.u (0 to 1 a row, or one number): the rows come in; o.hl: the row picked out, by a band that fades in
// with o.hla (0 to 1; its words keep their weight, so they don't jump); o.of: "8 risks"; o.a, o.k
function rso_register(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const rows=o.rows||["R1","R2","R3"],w=1480,rh=104,h=210+rows.length*rh+20;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.amber,light:o.light});lp_label(ctx,x+44,y+84,"Risk register",{col:LP.amber});lp_T(ctx,o.title||"The move off the old warehouse",x+44,y+138,{w:800,size:40});
  lp_pill(ctx,x+w-150,y+92,o.of||"8 risks",{col:LP.amber,size:28});
  for(const [c,cx] of RSO_COLS)lp_T(ctx,c,x+cx,y+194,{w:700,size:28,col:LP.mut});
  ctx.fillStyle=rgba(LP.mut,0.35);ctx.fillRect(x+36,y+210,w-72,2);
  rows.forEach((k,i)=>{const R=RSO_RISKS[k],u=o.u==null?1:Array.isArray(o.u)?o.u[i]:clamp(o.u*rows.length-i,0,1);if(u<=0)return;const ry=y+222+i*rh;ctx.save();ctx.globalAlpha*=ag_sine(u);
    if(o.hl===i){ctx.fillStyle=rgba(LP.amber,0.12*(o.hla==null?1:o.hla));rr(ctx,x+28,ry,w-56,rh-12,10);ctx.fill();}
    const id=R.id||k;ctx.fillStyle=rgba(R.done?LP.green:LP.amber,1);ctx.beginPath();ctx.arc(x+70,ry+44,28,0,TAU);ctx.fill();lp_T(ctx,id,x+70,ry+54,{w:800,size:28,align:"center",col:[255,255,255]});
    const tl=lp_wrap(ctx,R.text,620,{w:600,size:28});tl.forEach((s,j)=>lp_T(ctx,s,x+120,ry+(tl.length>1?36:54)+j*36,{w:600,size:28,col:R.vague?LP.mut:LP.ink}));
    lp_T(ctx,R.owner,x+RSO_COLS[1][1],ry+54,{w:700,size:28});lp_T(ctx,R.L,x+RSO_COLS[2][1],ry+54,{w:600,size:28});lp_T(ctx,R.I,x+RSO_COLS[3][1],ry+54,{w:600,size:28});
    lp_T(ctx,R.resp,x+RSO_COLS[4][1],ry+54,{w:700,size:28,col:R.done?LP.green:LP.ink});ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- one risk in full */
// words: {id, title, parts: [cause, could happen, would do] (each a line, or its lines), fields: [[label, value or its lines, kind], ...]}; o.u: 0 to 1 for each of the three
// parts, then o.f: 0 to 1 for each field; o.mark: the parts' names over them (0 to 1); o.hl: a field to pick out
function rso_risk(ctx,x,y,w,words,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const parts=words.parts||[],fields=words.fields||[],lx=x+44,tx=x+330,tw=w-374;
  const PL=parts.map(p=>Array.isArray(p)?p:lp_wrap(ctx,p,tw,{w:700,size:32})),ph=PL.reduce((s,l)=>s+l.length*42+18,0),FL=fields.map(f=>Array.isArray(f[1])?f[1]:lp_wrap(ctx,f[1],tw-(f[2]==="sign"?44:0),{w:600,size:28}));
  const fh=FL.reduce((s,l)=>s+l.length*38+16,0),h=150+ph+(fields.length?28+fh:0)+20;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.amber,light:o.light});lp_label(ctx,lx,y+84,words.kick||"",{col:LP.amber});if(words.title)lp_T(ctx,words.title,lx+lp_tw(ctx,(words.kick||"").toUpperCase(),{w:800,size:28,ls:3.5})+(words.kick?28:0),y+84,{w:800,size:28});
  const NAMES=["Cause","Could happen","Would do"];let yy=y+150;
  PL.forEach((l,i)=>{const u=o.u==null?1:clamp(o.u[i],0,1);ctx.save();ctx.globalAlpha*=ag_sine(u);if(o.mark>0)lp_T(ctx,NAMES[i],lx,yy+2,{w:800,size:28,col:LP.amber,a:o.mark});
    l.forEach((s,j)=>lp_T(ctx,s,tx,yy+j*42+2,{w:700,size:32,col:words.dim&&words.dim[i]?LP.mut:LP.ink}));
    if(o.mark>0){ctx.strokeStyle=rgba(LP.amber,0.55*o.mark);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(tx,yy+l.length*42-26);ctx.lineTo(tx+Math.min(tw,lp_tw(ctx,l[l.length-1],{w:700,size:32})),yy+l.length*42-26);ctx.stroke();}
    ctx.restore();yy+=l.length*42+18;});
  if(fields.length){ctx.fillStyle=rgba(LP.mut,0.3);ctx.fillRect(x+36,yy-6,w-72,2);yy+=28;
    fields.forEach((f,i)=>{const u=o.f==null?1:clamp(o.f[i],0,1),l=FL[i];if(u>0){ctx.save();ctx.globalAlpha*=ag_sine(u);if(o.hl===i){ctx.fillStyle=rgba(LP.amber,0.12);rr(ctx,x+28,yy-30,w-56,l.length*38+12,8);ctx.fill();}
      lp_T(ctx,f[0],lx,yy,{w:700,size:28,col:LP.mut});let fx=tx;if(f[2]==="sign"){rso_sign(ctx,tx+8,yy-10,1);fx=tx+44;}
      l.forEach((s,j)=>lp_T(ctx,s,fx,yy+j*38,{w:f[2]==="sign"||o.hl===i?800:600,size:28,col:f[2]==="green"?LP.green:LP.ink}));ctx.restore();}yy+=l.length*38+16;});}
  ctx.restore();return{x,y,w,h};}
// the four responses in a row of chips, centred on (x, y); o.hi: the one chosen (an index); o.u: they come in, one by one
const RSO_RESP=["Avoid","Reduce","Share","Accept"];
function rso_responses(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const gap=24,ws=RSO_RESP.map(s=>lp_tw(ctx,s,{w:800,size:30})+64),tot=ws.reduce((s,v)=>s+v,0)+gap*3;let cx=x-tot/2;ctx.save();ctx.globalAlpha*=a;
  RSO_RESP.forEach((s,i)=>{const u=o.u==null?1:clamp(o.u*4-i,0,1),w=ws[i];if(u>0){const hi=o.hi===i;ctx.save();ctx.globalAlpha*=ag_sine(u);
    if(hi)lp_pill(ctx,cx+w/2,y,s,{col:LP.amber,size:30,k:o.k});else{ctx.save();ctx.shadowColor="rgba(52,36,30,0.18)";ctx.shadowBlur=10;ctx.shadowOffsetX=LP.sdx*0.4;ctx.shadowOffsetY=4;
      rr(ctx,cx,y-30,w,60,30);ctx.fillStyle="rgba(250,247,240,0.97)";ctx.fill();ctx.restore();ctx.strokeStyle=rgba(LP.amber,0.8);ctx.lineWidth=2.5;rr(ctx,cx+1,y-29,w-2,58,29);ctx.stroke();
      lp_T(ctx,s,cx+w/2,y+11,{w:800,size:30,align:"center",col:LP.amber});}ctx.restore();}cx+=w+gap;});
  ctx.restore();}

/* ---------------------------------------------------------------- the council's appetite */
const RSO_APP=[["Personal data and security","Low",1],["Delays","Medium",2],["New ways to deliver","High",3]];
// o.u: 0 to 1, each row comes in as its word is said (an array of three); o.a, o.k
function rso_appetite(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const rh=96,h=200+RSO_APP.length*rh;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.amber,light:o.light});lp_label(ctx,x+44,y+84,"The data council",{col:LP.amber});lp_T(ctx,"Our appetite for risk",x+44,y+140,{w:800,size:40});
  RSO_APP.forEach(([what,lvl,n],i)=>{const u=o.u?clamp(o.u[i],0,1):1;if(u<=0)return;const ry=y+200+i*rh;ctx.save();ctx.globalAlpha*=ag_sine(u);
    lp_T(ctx,what,x+44,ry+44,{w:600,size:30});const bx=x+w-340;
    for(let k=0;k<3;k++){const f=k<n?clamp(u*3-k,0,1):0;rr(ctx,bx+k*54,ry+14,44,38,8);ctx.fillStyle=f>0?rgba(LP.amber,0.25+0.75*f):"rgba(0,0,0,0)";ctx.fill();ctx.strokeStyle=rgba(LP.amber,0.8);ctx.lineWidth=2.5;ctx.stroke();}
    lp_T(ctx,lvl,bx+180,ry+44,{w:800,size:30,col:LP.amber});ctx.restore();});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the pre-mortem's wall of notes */
// eight columns of small notes (each a person's reasons, scribbled: marks, not words, on purpose); o.u (0 to 1) the notes go up;
// o.hl: the note picked out ([column, row]), o.dim (0 to 1): the others step back
function rso_wall(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const R=ag_rnd(2028),cols=8,cw=150,nw=124,nh=84;ctx.save();ctx.globalAlpha*=a;
  for(let c=0;c<cols;c++){const n=3+Math.floor(R()*3);for(let r=0;r<n;r++){const k=c*5+r,u=o.u==null?1:clamp(o.u*44-k*0.8,0,1),tilt=(R()-0.5)*5,sx=R();if(u<=0)continue;
    const nx=x+c*cw+(sx-0.5)*10,ny=y+r*(nh+18),hl=o.hl&&o.hl[0]===c&&o.hl[1]===r;ctx.save();ctx.globalAlpha*=ag_sine(u)*(hl?1:1-0.55*(o.dim||0));
    ctx.translate(nx+nw/2,ny+nh/2);ctx.rotate(tilt*Math.PI/180);ctx.translate(-nx-nw/2,-ny-nh/2);
    ctx.save();ctx.shadowColor="rgba(52,36,30,0.22)";ctx.shadowBlur=8;ctx.shadowOffsetX=LP.sdx*0.3;ctx.shadowOffsetY=4;ctx.fillStyle=rgba(hl?[255,250,236]:mix(LP.paper,LP.wall,0.15),1);ctx.fillRect(nx,ny,nw,nh);ctx.restore();
    ctx.strokeStyle=rgba(LP.mut,0.55);ctx.lineWidth=2.2;ctx.lineCap="round";for(let l=0;l<3;l++){const lw=nw*(0.45+R()*0.4),ly=ny+22+l*20;ctx.beginPath();ctx.moveTo(nx+12,ly);
      for(let q=0;q<5;q++)ctx.quadraticCurveTo(nx+12+lw*(q+0.5)/5,ly+(q%2?-3:3),nx+12+lw*(q+1)/5,ly);ctx.stroke();}
    if(hl){ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=4;ctx.strokeRect(nx-3,ny-3,nw+6,nh+6);}ctx.restore();}}
  ctx.restore();}

/* ---------------------------------------------------------------- an extract */
// HR's system, its staff list copied into the old warehouse, read by a report; o.u (0 to 1) it draws itself, left to right, or o.p
// gives each of its five parts its own 0 to 1: [HR's system, the copy, the extract, the arrow it's read by, the report]
function rso_extract(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const u=o.u==null?1:o.u,P=o.p||[clamp(u*4,0,1),clamp(u*4-1,0,1),clamp(u*4-1.6,0,1),clamp(u*4-2.4,0,1),clamp(u*4-3,0,1)],box=(bx,by,bw,kick,title,col,v)=>{if(v<=0)return;ctx.save();ctx.globalAlpha*=ag_sine(v);
    lp_textSheet(ctx,bx,by,bw,{kick,title},{col,light:o.light,pin:false});ctx.restore();};ctx.save();ctx.globalAlpha*=a;
  const arrow=(x0,x1,yy,v,label)=>{if(v<=0)return;const xe=lerp(x0,x1,ag_sine(v));ctx.strokeStyle=rgba(LP.orange,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,yy);ctx.lineTo(xe,yy);ctx.stroke();
    if(v>0.98){ctx.fillStyle=rgba(LP.orange,1);ctx.beginPath();ctx.moveTo(x1+6,yy);ctx.lineTo(x1-14,yy-12);ctx.lineTo(x1-14,yy+12);ctx.closePath();ctx.fill();}
    if(label)lp_T(ctx,label,(x0+x1)/2,yy-24,{w:800,size:28,align:"center",col:LP.orange,a:clamp(v*2-1,0,1)});};
  box(x,y,400,"HR's system","The staff list",LP.orange,P[0]);arrow(x+420,x+640,y+110,P[1],"A copy");
  box(x+660,y,420,"The old warehouse","An extract",LP.orange,P[2]);arrow(x+1100,x+1280,y+110,P[3],"");
  box(x+1300,y,300,"Read by","A report",null,P[4]);ctx.restore();}

/* ---------------------------------------------------------------- the catalog, on a screen */
// the extract's columns: the five the report shows, the two tagged personal, the rest; o.used (0 to 1), o.tags (0 to 1), o.out (0 to 1:
// the two personal columns struck from what moves), o.k
const RSO_COLS_EX=[["Staff ID",1],["Given name",1],["Family name",1],["Department",1],["Contract end",1],["Home address",0,"Personal"],["Date of birth",0,"Personal"],["Job title",0],["Start date",0]];
function rso_catalog(cx,X,Y,Wd,Hd,o){o=o||{};const rh=56,x0=X+40;
  cx.fillStyle=rgba(mix(LP.paper,[255,255,255],0.4),1);cx.fillRect(X,Y,Wd,Hd);cx.fillStyle=rgba(mix(LP.wall,LP.paper,0.5),1);cx.fillRect(X,Y,Wd,78);
  lp_T(cx,"Catalog",x0,Y+52,{w:800,size:30,col:LP.mut});lp_T(cx,"The access-card report's old extract",x0+150,Y+52,{w:800,size:30});
  lp_pill(cx,X+Wd-130,Y+40,"42 columns",{col:LP.orange,size:28});
  lp_T(cx,"Column",x0,Y+128,{w:700,size:28,col:LP.mut});lp_T(cx,"In the report",X+520,Y+128,{w:700,size:28,col:LP.mut});lp_T(cx,"Tag",X+800,Y+128,{w:700,size:28,col:LP.mut});
  cx.fillStyle=rgba(LP.mut,0.3);cx.fillRect(X+28,Y+144,Wd-56,2);
  RSO_COLS_EX.forEach(([c,used,tag],i)=>{const ry=Y+150+i*rh,u=used?clamp(o.used||0,0,1):0,tg=tag?clamp(o.tags||0,0,1):0;
    if(u>0){cx.fillStyle=rgba(LP.orange,0.12*u);cx.fillRect(X+28,ry+4,Wd-56,rh-8);}
    if(tg>0&&o.out>0){cx.fillStyle=rgba(LP.amber,0.1*o.out);cx.fillRect(X+28,ry+4,Wd-56,rh-8);}
    lp_T(cx,c,x0,ry+40,{w:600,size:28,col:u>0?mix(LP.ink,LP.orange,u*0.6):LP.ink});
    if(used&&u>0){lp_icon(cx,"tick",X+560,ry+30,34,mix(LP.paper,LP.orange,u));}
    if(tg>0){lp_pill(cx,X+870,ry+30,tag,{col:LP.amber,size:28,a:tg,k:o.k});lp_T(cx,"No report uses it",X+990,ry+40,{w:600,size:28,col:LP.amber,a:tg});}
    if(tg>0&&o.out>0){cx.strokeStyle=rgba(LP.amber,o.out);cx.lineWidth=3;cx.beginPath();cx.moveTo(x0-6,ry+30);cx.lineTo(x0-6+lp_tw(cx,c,{w:600,size:28})*ag_sine(o.out)+12,ry+30);cx.stroke();}});
  lp_T(cx,"And 33 more columns",x0,Y+150+RSO_COLS_EX.length*rh+40,{w:600,size:28,col:LP.mut});}

/* ---------------------------------------------------------------- the council's one page for the month */
const RSO_TOP=[["R1","The licence ends before every report moves","Helena",["A report two weeks","behind its date"]],
  ["R4","The team stretched between the move and requests","Helena",["More than six pieces","of work open at once"]],
  ["R3","Personal data in old extracts copied across","Yusuf",["Shown on 16 June:","now likely"]]];
// the page: the month's other parts as quiet lines, its top three risks in full; o.u (0 to 1 each of the three), o.hl, o.a, o.k
function rso_page(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=1500,rh=112,h=262+3*rh+40;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light});lp_label(ctx,x+44,y+84,"The data council · June 2027",{col:LP.blue});lp_T(ctx,"One page for the month",x+44,y+140,{w:800,size:40});
  // the page's other parts, quiet: the roadmap, the measures, the decisions needed
  ["The roadmap","The measures","Decisions needed"].forEach((s,i)=>lp_T(ctx,s,x+760+i*230,y+140,{w:600,size:28,col:LP.mut,a:0.85}));
  lp_label(ctx,x+44,y+222,"Top three risks",{col:LP.amber});lp_T(ctx,"Owner",x+870,y+222,{w:700,size:28,col:LP.mut});lp_T(ctx,"Early sign",x+1010,y+222,{w:700,size:28,col:LP.mut});
  ctx.fillStyle=rgba(LP.mut,0.3);ctx.fillRect(x+36,y+240,w-72,2);
  RSO_TOP.forEach(([id,text,owner,sign],i)=>{const u=o.u?clamp(o.u[i],0,1):1,ry=y+252+i*rh;
    // its place on the page, waiting: a faint numbered row, until the risk fills it
    if(u<1){ctx.save();ctx.globalAlpha*=1-ag_sine(u);ctx.strokeStyle=rgba(LP.mut,0.45);ctx.lineWidth=2;ctx.setLineDash([8,8]);rr(ctx,x+36,ry+6,w-72,rh-24,10);ctx.stroke();ctx.setLineDash([]);
      lp_T(ctx,String(i+1),x+70,ry+58,{w:800,size:28,align:"center",col:LP.mut});ctx.restore();}
    if(u<=0)return;ctx.save();ctx.globalAlpha*=ag_sine(u);
    if(o.hl===i){ctx.fillStyle=rgba(LP.amber,0.12);rr(ctx,x+28,ry,w-56,rh-12,10);ctx.fill();}
    ctx.fillStyle=rgba(LP.amber,1);ctx.beginPath();ctx.arc(x+70,ry+48,28,0,TAU);ctx.fill();lp_T(ctx,id,x+70,ry+58,{w:800,size:28,align:"center",col:[255,255,255]});
    const tl=lp_wrap(ctx,text,720,{w:600,size:28});tl.forEach((s,j)=>lp_T(ctx,s,x+120,ry+(tl.length>1?40:58)+j*36,{w:600,size:28}));
    lp_T(ctx,owner,x+870,ry+58,{w:700,size:28});rso_sign(ctx,x+1018,ry+48,1);sign.forEach((s,j)=>lp_T(ctx,s,x+1054,ry+(sign.length>1?40:58)+j*36,{w:i===2?800:600,size:28}));
    ctx.restore();});
  ctx.restore();return{x,y,w,h};}
