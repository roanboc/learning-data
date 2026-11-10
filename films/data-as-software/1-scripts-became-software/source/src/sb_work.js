/* ===== Scripts became software: the work, drawn on the map =====
   Payroll's export as it was and as it is: the laptop with its script, the email to Finance, payroll's rule, HR's calendar of pay days,
   the test written first, the pull request and its review, the road from a merge to production, and the job's runs. All on the
   module's map, in its colours: gold for what people agree on (payroll's rule and its calendar), green for a check that passes, amber
   for a person's turn (a review, an approval), light blue for the platform, red for what breaks. Every word at least 28 px. */

/* ---------------------------------------------------------------- the laptop and its script */
// the script's lines, from the example project's before/payroll_export.py, shortened to fit; gold where payroll's rule is
const SB_SCRIPT=[{s:"# change before each run"},{s:"NEXT_PAY_DAY = date(2026, 2, 26)"},{s:"def pay_day(approved):"},
  {s:"  if approved <= monday_noon:",rule:1},{s:"    return NEXT_PAY_DAY",rule:1},{s:"  return NEXT_PAY_DAY + 14 days",rule:1}];
// sb_laptop(ctx, x, y, w, o): a laptop seen from the front, its screen w wide; o.lines (the script's lines), o.title (the file's
// name), o.rule (0 to 1: the rule's lines turn gold), o.warn (0 to 1: the screen's edge turns red), o.run (0 to 1: a dot that says it
// runs), o.codeA (the lines' opacity), o.a; returns the screen's box
function sb_laptop(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=Math.round(w*0.62),box={x,y,w,h};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;
  // the base and keyboard, a thin slab in perspective under the screen
  const by=y+h+4;ctx.beginPath();ctx.moveTo(x-30,by+34);ctx.lineTo(x+w+30,by+34);ctx.lineTo(x+w,by);ctx.lineTo(x,by);ctx.closePath();
  const bg=ctx.createLinearGradient(0,by,0,by+34);bg.addColorStop(0,"rgba(58,72,104,0.98)");bg.addColorStop(1,"rgba(26,34,56,0.98)");ctx.fillStyle=bg;ctx.fill();
  ctx.strokeStyle="rgba(170,200,245,0.4)";ctx.lineWidth=1.4;ctx.stroke();ctx.fillStyle="rgba(10,16,32,0.9)";rr(ctx,x+w/2-60,by+20,120,8,4);ctx.fill();
  // the screen
  const warn=o.warn||0,edge=warn>0.02?mix([150,175,215],MD.fail,warn):null;md_card(ctx,x,y,w,h,{r:14,fill:"rgba(8,13,28,0.97)",edge,glow:warn,edgeA:edge?0.9:0.45});
  ctx.fillStyle="rgba(255,255,255,0.04)";rr(ctx,x+2,y+2,w-4,56,12);ctx.fill();
  if(o.title)md_T(ctx,o.title,x+26,y+40,{w:500,size:28,f:"mono",col:MD.soft,a:o.codeA==null?1:o.codeA});
  if(o.run>0){glow(ctx,x+w-34,y+30,20,MD.pass,0.6*o.run);ctx.fillStyle=rgba(MD.pass,o.run);ctx.beginPath();ctx.arc(x+w-34,y+30,6,0,TAU);ctx.fill();}
  const lines=o.lines||[],ca=o.codeA==null?1:o.codeA;if(ca>0.004)lines.forEach((l,i)=>{const ly=y+104+i*44;if(ly>y+h-12)return;const r=l.rule?(o.rule||0):0;
    if(r>0){ctx.fillStyle=rgba(MD.agreed,0.12*r);rr(ctx,x+14,ly-31,w-28,42,8);ctx.fill();}
    md_T(ctx,l.s,x+26,ly,{w:500,size:28,f:"mono",col:r>0.5?MD.agreed:(l.s.startsWith("#")?MD.soft:MD.ink),a:ca});});
  ctx.restore();return box;}
// an email, as an envelope
function sb_envelope(ctx,x,y,s,col,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;glow(ctx,x,y,s*0.9,col,0.35);ctx.fillStyle="rgba(10,17,35,0.96)";ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.6;ctx.lineJoin="round";
  rr(ctx,x-s/2,y-s*0.34,s,s*0.68,5);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(x-s/2+4,y-s*0.3);ctx.lineTo(x,y+s*0.06);ctx.lineTo(x+s/2-4,y-s*0.3);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- payroll's rule and HR's calendar */
// payroll's rule, in gold: when a claim is paid, as a table of two rows (o.r1, o.r2: each comes in, 0 to 1)
function sb_rule(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=260,box={x,y,w,h};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  md_card(ctx,x,y,w,h,{edge:MD.agreed,glow:0.8});md_T(ctx,"PAYROLL'S RULE",x+28,y+52,{w:800,size:28,ls:4,col:MD.agreed});md_icon(ctx,"contract",x+w-48,y+44,40,MD.agreed);
  const r1=o.r1==null?1:o.r1,r2=o.r2==null?1:o.r2,c2=w*0.6;
  md_rows(ctx,x+20,y+68,[{h:"Approved",w:c2-20},{h:"Paid",w:w-c2-20}],[["By noon, the Monday before",{s:"that Thursday",col:MD.agreed}],["Later",{s:"two weeks later",col:MD.agreed}]],{rowA:(r,i)=>i?r2:r1});
  ctx.restore();return box;}
// HR's calendar of pay days, the seed pay_days: each pay day and when its claims close
const SB_PAYDAYS=[["Thu 22 Oct","Mon 19 Oct, 12:00"],["Thu 5 Nov","Mon 2 Nov, 12:00"],["Thu 19 Nov","Mon 16 Nov, 12:00"]];
function sb_calendar(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=96+54*4+10,box={x,y,w,h};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;
  md_card(ctx,x,y,w,h,{edge:MD.agreed,glow:0.6});md_T(ctx,"HR'S CALENDAR OF PAY DAYS",x+28,y+52,{w:800,size:28,ls:4,col:MD.agreed});md_icon(ctx,"table",x+w-48,y+44,40,MD.agreed);
  md_rows(ctx,x+20,y+70,[{h:"Pay day",w:300},{h:"Claims close",w:w-340}],SB_PAYDAYS,{lit:o.lit,litCol:MD.agreed,rowA:o.rowA});ctx.restore();return box;}

/* ---------------------------------------------------------------- the test, written first */
// the unit test on payroll's export: two claims at the rule's edge, a minute apart, and the pay day each gets
function sb_test(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=330,box={x,y,w,h};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  const pass=o.pass||0;md_card(ctx,x,y,w,h,{edge:pass>0.5?MD.pass:MD.flow,glow:0.5+0.5*pass});
  md_T(ctx,"A UNIT TEST, WRITTEN FIRST",x+28,y+52,{w:800,size:28,ls:4,col:pass>0.5?MD.pass:MD.flow});
  md_T(ctx,"Approved by Monday noon: paid that Thursday",x+28,y+104,{w:700,size:34});
  const rows=[["Mon 2 Nov, 11:59","Thu 5 Nov",o.p1||0,o.r1==null?1:o.r1],["Mon 2 Nov, 12:01","Thu 19 Nov",o.p2||0,o.r2==null?1:o.r2]];
  md_T(ctx,"APPROVED",x+28,y+168,{w:800,size:28,ls:3,col:MD.soft});md_T(ctx,"PAID",x+w*0.56,y+168,{w:800,size:28,ls:3,col:MD.soft});
  rows.forEach(([ap,pd,p,ra],i)=>{if(ra<=0.004)return;const ry=y+226+i*56;ctx.save();ctx.globalAlpha*=ra;md_T(ctx,ap,x+28,ry,{w:500,size:30,f:"mono"});
    md_T(ctx,pd,x+w*0.56,ry,{w:700,size:30,col:p>0.5?MD.pass:MD.ink});if(p>0)md_icon(ctx,"tick",x+w-56,ry-10,36,MD.pass,{a:p});ctx.restore();});
  ctx.restore();return box;}

/* ---------------------------------------------------------------- the project in Git, and a pull request */
// what the project keeps beside the models, and the history of who changed it and why
const SB_FILES=[{name:"models/marts/finance/",kind:"schema",depth:0},{name:"mart_finance__casual_pay_paid.sql",kind:"table",depth:1},
  {name:"seeds/reference/staff/pay_days.csv",kind:"table",depth:0},{name:"resources/payroll_export.job.yml",kind:"table",depth:0}];
const SB_HISTORY=[["Jun","Payroll's export as a model, with its tests","4 Mar"],["Sam","A job for the export, in the bundle","5 Mar"]];
function sb_git(ctx,x,y,w,h,o){o=o||{};return md_window(ctx,x,y,w,h,{logo:"github",product:"GitHub",title:"data-project",a:o.a,k:o.k,draw:(c,b)=>{
  const ta=o.files==null?1:o.files;if(ta>0)md_tree(c,b.x+10,b.y+6,SB_FILES.map((f,i)=>Object.assign({},f,{col:i===1?MD.ink:MD.soft,a:clamp(ta*4-i,0,1)})),{rh:52,a:ta});
  const ha=o.history||0;if(ha>0)md_rows(c,b.x+10,b.y+232,[{h:"Who",w:220},{h:"Why",w:b.w-360},{h:"When",w:120}],SB_HISTORY,{a:ha,rowA:(r,i)=>clamp((o.rows||0)-i,0,1)});}});}
// a pull request: o.title, o.by (who wrote it), o.agent (an agent wrote it: its sphere beside the words), o.checks (0 to 1 each:
// [build, every test]), o.review: 0 waiting, 1 approved, o.reviewer (who approved), o.merged (0 to 1), o.t, o.a, o.k
function sb_pr(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||236,box={x,y,w,h,pill:[x+w-28,y+h-44]};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));const m=o.merged||0,rv=o.review||0;
  md_card(ctx,x,y,w,h,{edge:m>0.5?MD.pass:(o.edge||MD.flow),glow:0.6});
  let kx=x+28;if(o.agent){ag_model(ctx,x+52,y+44,22,{t:o.t||0,core:0.8,think:0.3});kx+=54;}
  md_T(ctx,("Pull request"+(o.by?" · by "+o.by:"")).toUpperCase(),kx,y+52,{w:800,size:28,ls:3,col:m>0.5?MD.pass:(o.edge||MD.flow)});
  md_T(ctx,o.title,x+28,y+108,{w:700,size:36});
  // its checks: they build it and run every test
  const ck=o.checks||[0,0],labels=o.checkLabels||["builds","every test passes"];let cx=x+28;
  labels.forEach((l,i)=>{const p=ck[i]||0;const col=p>0.5?MD.pass:MD.dim;md_icon(ctx,p>0.5?"tick":"clock",cx+16,y+168,30,col,{a:o.checksA==null?1:o.checksA});
    md_T(ctx,l,cx+44,y+178,{w:600,size:28,col:p>0.5?MD.ink:MD.soft,a:o.checksA==null?1:o.checksA});cx+=md_tw(ctx,l,{w:600,size:28})+96;});
  // the review: waiting for someone else, then approved; then merged
  const ra=o.reviewA==null?1:o.reviewA;if(ra>0){const px=x+w-28;ctx.save();ctx.globalAlpha*=ra;
    if(m>0.02){ctx.save();ctx.globalAlpha*=m;md_pill(ctx,px-md_tw(ctx,"Merged",{w:800,size:28})/2-50,y+52,"Merged",{col:MD.pass,icon:"tick",size:28});ctx.restore();}
    const label=rv>0.5?(o.reviewer?"Approved by "+o.reviewer:"Approved"):"Review needed",col=rv>0.5?MD.pass:MD.wait;
    md_tag(ctx,px-md_tw(ctx,label,{w:700,size:28})-88,y+h-44,label,{col,icon:rv>0.5?"tick":"person"});ctx.restore();}
  ctx.restore();return box;}
// the branch a change goes on, and back: main along the top, the branch below it from bx0 to bx1; u (0 to 1) draws it
function sb_branch(ctx,x0,x1,y,bx0,bx1,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  md_lane(ctx,md_path([[x0,y],[x1,y]]),MD.flow,0.9,{});md_T(ctx,"main",x0,y-24,{w:700,size:28,f:"mono",col:MD.flow});
  const by=y+90,pts=[...md_curve([bx0,y],[bx0+90,by],{bend:0}),...md_path([[bx0+90,by],[bx1-90,by]]),...md_curve([bx1-90,by],[bx1,y],{bend:0})];
  md_lane(ctx,pts,o.col||MD.ink,0.9,{u});if(o.name&&u>0.2)md_T(ctx,o.name,bx0+110,by+46,{w:500,size:28,f:"mono",col:MD.soft,a:clamp((u-0.2)/0.3,0,1)});
  for(const [px,py,on] of [[x0+40,y,1],[bx0,y,u>0],[bx1,y,u>=1]])if(on){ctx.fillStyle=rgba(MD.flow,1);ctx.beginPath();ctx.arc(px,py,9,0,TAU);ctx.fill();}
  ctx.restore();}

/* ---------------------------------------------------------------- how it runs, and where */
// a file of code or settings, in mono: o.name (its name, at the top), lines [{s, col, lit}], o.edge, o.a, o.k
function sb_file(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a,h=86+lines.length*44+18,box={x,y,w,h};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:o.edge||MD.flow,glow:0.6});
  md_icon(ctx,"doc",x+42,y+44,36,o.edge||MD.flow);md_T(ctx,name,x+76,y+54,{w:600,size:28,f:"mono",col:MD.ink});
  ctx.strokeStyle="rgba(170,200,245,0.18)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+14,y+82);ctx.lineTo(x+w-14,y+82);ctx.stroke();
  lines.forEach((l,i)=>{const la=l.a==null?1:l.a;if(la<=0.004)return;const ly=y+124+i*44;if(l.lit>0){ctx.fillStyle=rgba(l.col||MD.flow,0.13*l.lit);rr(ctx,x+12,ly-31,w-24,42,8);ctx.fill();}
    md_T(ctx,l.s,x+28,ly,{w:500,size:28,f:"mono",col:l.col||MD.ink,a:la});});
  ctx.restore();return box;}
// a stage on the road to production: o.name, o.sub, o.lit (0 to 1), o.col (its colour when lit), o.a, o.k
function sb_stage(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||128,box={x,y,w,h,l:[x,y+h/2],r:[x+w,y+h/2]};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));const lit=o.lit||0,col=o.col||MD.flow;if(lit>0)glow(ctx,x+w/2,y+h/2,w*0.6,col,0.22*lit);
  md_card(ctx,x,y,w,h,{edge:lit>0.05?col:null,glow:lit});if(o.icon)md_icon(ctx,o.icon,x+44,y+h/2-(o.sub?20:0),36,lit>0.5?col:MD.soft);
  md_T(ctx,o.name,x+(o.icon?78:28),y+(o.sub?56:h/2+12),{w:800,size:34});if(o.sub)md_T(ctx,o.sub,x+28,y+100,{w:600,size:28,col:o.subCol||MD.soft});
  ctx.restore();return box;}
// the job's runs: when, and how each went
function sb_runs(ctx,x,y,w,rows,o){o=o||{};return md_rows(ctx,x,y,[{h:"Run",w:110},{h:"When",w:w-430},{h:"Result",w:320}],rows.map(r=>[{s:r[0],f:"mono"},r[1],{s:r[2],col:MD.pass,icon:"tick"}]),o);}

/* ---------------------------------------------------------------- the official docs */
// a page of a tool's docs: the tool's logo, its name, and the page's subject
function sb_doc(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=150,box={x,y,w,h};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  md_card(ctx,x,y,w,h,{edge:o.lit?MD.flow:null,glow:o.lit||0});let tx=x+28;if(o.logo&&typeof LOGO!=="undefined"&&LOGO[o.logo])tx+=logo(ctx,o.logo,x+26,y+30,40)+16;
  md_T(ctx,o.product,tx,y+62,{w:800,size:30});md_wrap(ctx,o.title,w-56,{w:600,size:28}).slice(0,2).forEach((l,i)=>md_T(ctx,l,x+28,y+108+i*34,{w:600,size:28,col:MD.soft}));
  ctx.restore();return box;}
