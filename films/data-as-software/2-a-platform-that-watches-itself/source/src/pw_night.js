/* ===== A platform that watches itself: the night on the platform map, and the morning after =====
   The film's own pieces of the data story (prefix pw_), drawn with the module's kit on its platform map. Colours mean what they
   mean in every film of the module: light blue the platform and data moving (the job, its lanes, the lineage traced), gold what
   people agree on (the claims app's contract), red an error (the failed task and what it touches), amber a person's turn (the
   insight waiting for Sam, the push he confirms, the review, the decision waiting for Ingrid), green what passes (the tests, the
   approval, the job running again, pay day).
     PW_M          where each part of the map is, in the map's own coordinates (z 1 shows it all)
     pw_map        the map at night: the claims app, its hours, its contract, the platform with the claims job, the payroll system,
                   payroll's export and casual teaching cost, and the lanes between them
     pw_task       one of the job's tasks, in its state: "idle", "run", "fail", "wait" or "ok"
     pw_zero       Genie ZeroOps's page: what it watches, its insight in four steps, its inbox
     pw_confirm    the push to a new branch, waiting for Sam to confirm it
     pw_pr         the pull request, with GitHub's mark: its checks, its author, its approval
     pw_agentCard  the agent's part: it proposed and pushed when asked, and it never approves
     pw_payday     Thursday's pay day
     pw_decision   a decision in the claims app's log, proposed or agreed
     pw_iface      Apollo 11 again: the computer, the radar, the document between them, and the computer's time
     pw_checklist  the descent checklist, one line changed */

/* ---------------------------------------------------------------- the map's parts, and where they are */
const PW_M={app:[60,214,420],field:[60,360,420,152],contract:[60,548,420],plat:[540,140,840,660],job:[572,252,776,312],t1:[600,346,344,132],t2:[984,346,336,132],
  err:[572,592,776,84],pay:[1440,240,440],exp:[1440,394,440],cost:[1440,534,440]};
const PW_PAYC=[176,192,220],PW_HR="HR",PW_IDLE=[150,170,205];
// a task's colour and icon by state
const PW_TASK={idle:{c:PW_IDLE,i:"clock"},run:{c:MD.flow,i:"refresh"},fail:{c:MD.fail,i:"cross"},wait:{c:MD.dim,i:"clock"},ok:{c:MD.pass,i:"tick"}};
// one of the job's tasks: lines of words, its state (or from one state to another over u), o.a, o.lit (a glow)
function pw_task(ctx,x,y,w,h,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const S1=PW_TASK[o.state||"idle"],S0=PW_TASK[o.from||o.state||"idle"],u=o.u==null?1:clamp(o.u,0,1),col=mix(S0.c,S1.c,u);
  ctx.save();ctx.globalAlpha*=a;const fail=(o.state==="fail"?u:0)+(o.from==="fail"?1-u:0);if(fail>0)glow(ctx,x+w/2,y+h/2,w*0.75,MD.fail,0.28*fail);
  md_card(ctx,x,y,w,h,{edge:col,glow:0.5+0.6*(o.lit||0)+0.6*fail,r:16,dash:(o.state==="wait"&&u>0.5)?[10,9]:false});
  const ix=x+42,iy=y+h/2;if(u<1)withA(ctx,1-u,()=>md_icon(ctx,S0.i,ix,iy,40,S0.c));withA(ctx,u,()=>md_icon(ctx,S1.i,ix,iy,40,S1.c));
  lines.forEach((l,i)=>md_T(ctx,l,x+82,y+h/2-(lines.length-1)*19+i*38+10,{w:700,size:30,col:o.state==="wait"&&u>0.5?MD.soft:MD.ink}));ctx.restore();}
// a small clock tag: an icon and a time, its left at x
function pw_time(ctx,x,y,text,o){o=o||{};return md_tag(ctx,x,y,text,{icon:"clock",col:o.col||[214,224,240],a:o.a,align:o.align||"left"});}
// md_tag measured, so it can be placed by its right edge
function pw_tagW(ctx,text,o){o=o||{};return md_tw(ctx,text,{w:700,size:o.size||28})+(o.icon?88:44);}

/* ---------------------------------------------------------------- the map at night
   o: a (all of it), dim (keys drawn faint; dimA, 0 to 1, how far), app, hours ("1.50" or "1:30", with hu 0 to 1 from the first to the second), field (its
   alpha), contract (alpha), contractLit, job (alpha), t1/t2 ({state, from, u}), clock (the job's time), err (alpha), lanes (alpha of the
   lanes), flow (true: packets move along them), pay (alpha), exp, cost (alphas), hit (0 to 1: what the failure touches glows red),
   gold (0 to 1: lanes from the contract to everyone who reads the hours), owners (0 to 1: the owners' names) */
function pw_map(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const M=PW_M,D=k=>o.dim&&o.dim.includes(k)?lerp(1,0.32,o.dimA==null?1:o.dimA):1;ctx.save();ctx.globalAlpha*=a;
  // the platform, and the claims job in it
  withA(ctx,D("plat"),()=>md_platform(ctx,M.plat[0],M.plat[1],M.plat[2],M.plat[3],{sub:"the platform"}));
  // the lanes first, under the cards: the app into the job, task to task, the job out to the payroll system
  const la=o.lanes==null?1:o.lanes,ok2=o.t2&&o.t2.state==="ok"?(o.t2.u==null?1:o.t2.u):0;
  const L1=md_curve([M.app[0]+M.app[2],M.app[1]+55],[M.job[0],M.t1[1]+66],{bend:0.6}),L2=[[M.t1[0]+M.t1[2],M.t1[1]+66],[M.t2[0],M.t2[1]+66]],L3=md_curve([M.job[0]+M.job[2],M.t2[1]+66],[M.pay[0],M.pay[1]+55],{bend:0.6});
  if(la>0){withA(ctx,la*D("app"),()=>{md_lane(ctx,L1,MD.flow,0.8);if(o.flow)md_flow(ctx,L1,t,{every:1.4});});
    withA(ctx,la,()=>{md_lane(ctx,L2,MD.flow,0.7);md_lane(ctx,L3,mix(MD.flow,MD.dim,o.stopped||0),0.8*(1-0.6*(o.stopped||0)));if(o.flow&&!o.stopped)md_flow(ctx,L3,t,{kind:"batch",every:2.6});if(ok2>0)withA(ctx,ok2,()=>md_flow(ctx,L3,t,{kind:"batch",col:MD.pass,every:2.2}));});}
  // the platform's tables feed payroll's export and casual teaching cost
  const LX=md_curve([M.plat[0]+M.plat[2]-24,M.t1[1]+300],[M.exp[0],M.exp[1]+55],{bend:0.6}),LC=md_curve([M.plat[0]+M.plat[2]-24,M.t1[1]+300],[M.cost[0],M.cost[1]+55],{bend:0.6});
  const ea=o.exp||0,ca=o.cost||0,hit=o.hit||0;
  if(ea>0)withA(ctx,ea,()=>md_lane(ctx,LX,mix(MD.flow,MD.fail,hit),0.7));if(ca>0)withA(ctx,ca,()=>md_lane(ctx,LC,mix(MD.flow,MD.fail,hit),0.7));
  // the claims app, its hours, and its contract
  withA(ctx,(o.app==null?1:o.app)*D("app"),()=>md_system(ctx,M.app[0],M.app[1],M.app[2],{n:"Claims app",s:"on Lakebase · HR's data",c:MD.sys.hr},{lit:o.appLit||0}));
  const fa=(o.field==null?1:o.field)*D("app");if(fa>0)withA(ctx,fa,()=>pw_field(ctx,M.field[0],M.field[1],M.field[2],M.field[3],o));
  const ka=(o.contract==null?1:o.contract)*D("contract");if(ka>0)withA(ctx,ka,()=>{const g=o.contractLit||0;if(g>0)glow(ctx,M.contract[0]+210,M.contract[1]+100,320,MD.agreed,0.28*g);
    md_textCard(ctx,M.contract[0],M.contract[1],M.contract[2],{kick:"Contract · hours",title:"decimal hours",sub:o.contractSub||"1.50 is an hour and a half"},{edge:MD.agreed,glow:0.6+g});});
  const ja=o.job==null?1:o.job;if(ja>0)withA(ctx,ja*D("job"),()=>{const J=M.job;md_card(ctx,J[0],J[1],J[2],J[3],{r:20});md_T(ctx,"Claims job",J[0]+28,J[1]+58,{w:800,size:32});
    const ck=o.clock||"Monday 22:00",cw=pw_tagW(ctx,ck,{icon:true});pw_time(ctx,J[0]+J[2]-24-cw,J[1]+46,ck);
    md_T(ctx,"→",M.t1[0]+M.t1[2]+20,M.t1[1]+80,{w:800,size:30,align:"center",col:MD.soft});
    pw_task(ctx,M.t1[0],M.t1[1],M.t1[2],M.t1[3],["build the","hours to pay"],o.t1||{});pw_task(ctx,M.t2[0],M.t2[1],M.t2[2],M.t2[3],["send to the","payroll system"],o.t2||{});});
  // the error, under the job, in its own words
  const er=o.err||0;if(er>0)withA(ctx,er,()=>{const E=M.err;md_card(ctx,E[0],E[1],E[2],E[3],{edge:MD.fail,glow:0.7,r:16});md_icon(ctx,"warn",E[0]+42,E[1]+E[3]/2,38,MD.fail);
    md_T(ctx,"can't read '1:30' as a number",E[0]+84,E[1]+E[3]/2+10,{w:500,size:30,f:"mono",col:mix(MD.fail,MD.ink,0.35)});});
  // outside the platform: the payroll system the university buys; payroll's export and casual teaching cost
  const pa=o.pay==null?1:o.pay;if(pa>0)withA(ctx,pa*D("pay"),()=>md_system(ctx,M.pay[0],M.pay[1],M.pay[2],{n:"Payroll system",s:"pays on Thursday",c:PW_PAYC},{lit:o.payLit||0}));
  const rd=(k,title,sub,col,al)=>{if(al<=0)return;withA(ctx,al*D(k),()=>{const R=M[k];if(hit>0)glow(ctx,R[0]+R[2]/2,R[1]+55,300,MD.fail,0.22*hit);
    md_reader(ctx,R[0],R[1],R[2],{title,sub,icon:k==="exp"?"table":"contract",col:mix(col,MD.fail,hit*0.85),h:110});});};
  rd("exp","Payroll's export","what was paid",PW_PAYC,ea);rd("cost","Casual teaching cost","Finance's measure",MD.dom.finance,ca);
  if(hit>0)withA(ctx,hit,()=>{glow(ctx,M.pay[0]+M.pay[2]/2,M.pay[1]+55,320,MD.fail,0.2);md_card(ctx,M.pay[0],M.pay[1],M.pay[2],110,{edge:MD.fail,dash:[10,9]});});
  // everyone who reads the hours, tied to the contract in gold
  const gd=o.gold||0;if(gd>0){const c0=[M.contract[0]+M.contract[2],M.contract[1]+110];for(const [k,i] of [["pay",0],["exp",1],["cost",2]]){const R=M[k],pts=md_curve(c0,[R[0],R[1]+55],{bend:0.5});
      withA(ctx,gd,()=>md_lane(ctx,pts,MD.agreed,0.85,{u:clamp(gd*1.6-i*0.3,0,1)}));}}
  // the owners: who answers for each part
  const ow=o.owners||0;if(ow>0)withA(ctx,ow,()=>{md_nameTag(ctx,M.app[0]+20,M.app[1]-58,"ingrid",{role:"",col:MD.sys.hr,name:"Ingrid Holm · HR"});
    md_nameTag(ctx,M.job[0]+34,M.job[1]+M.job[3]-30,"sam",{role:"",col:MD.flow,name:"Sam Okafor · runs the platform"});
    md_nameTag(ctx,M.cost[0]+20,M.cost[1]+160,"rohan",{role:"",col:MD.dom.finance,name:"Rohan Desai · Finance"});});
  ctx.restore();}
// the app's hours, as a tutor types them: "1.50", or "1:30" in the new version (o.hu 0 to 1 from one to the other); o.good, a green edge
function pw_field(ctx,x,y,w,h,o){o=o||{};const hu=clamp(o.hu||0,0,1),edge=o.good?mix(MD.flow,MD.pass,o.good):null;md_card(ctx,x,y,w,h,{edge,glow:0.6,r:18});
  md_label(ctx,x+28,y+48,"hours, as typed",{});const bx=x+28,by=y+70;ctx.fillStyle="rgba(4,8,18,0.7)";rr(ctx,bx,by,w-56,62,10);ctx.fill();ctx.strokeStyle="rgba(170,200,245,0.35)";ctx.lineWidth=1.4;rr(ctx,bx,by,w-56,62,10);ctx.stroke();
  if(hu<1)md_T(ctx,"1.50",bx+22,by+46,{w:500,size:40,f:"mono",a:1-hu});if(hu>0)md_T(ctx,"1:30",bx+22,by+46,{w:500,size:40,f:"mono",a:hu,col:o.good?mix(MD.ink,MD.pass,o.good):MD.ink});
  const cur=(Math.floor((o.t||0)*1.6)%2)?0:1;if(o.caret)withA(ctx,cur*o.caret,()=>{ctx.fillStyle=rgba(MD.ink,0.9);ctx.fillRect(bx+22+md_tw(ctx,"1:30",{w:500,size:40,f:"mono"})+6,by+14,3,36);});}

/* ---------------------------------------------------------------- Genie ZeroOps's page
   Drawn at the level of what it does, with Databricks' mark and the product's name on its bar and no status anywhere: what it
   watches; its insight, built in four steps (detected, root cause, impact, proposed fix), each lit in turn; and its inbox.
   o.mode "watch", "insight" or "inbox" (o.mu 0 to 1 cross-fades from the last); o.steps [0 to 1, ...] lights each step; o.view, the
   step whose detail shows on the right (with o.vu 0 to 1 coming in), o.trace (0 to 1, the lineage lit from the failure back to the
   source), o.cause (the cause's tag), o.hits [three alphas], o.fix (0 to 1), o.lock (0 to 1) */
const PW_STEPS=[["Detected","the claims job failed"],["Root cause","traced through lineage"],["Impact","what it touches"],["Proposed fix","for a person to review"]];
function pw_zero(ctx,x,y,w,h,o){o=o||{};const title=o.mode==="inbox"?"Inbox":o.mode==="insight"?"Insight":"",ma=o.ma==null?1:o.ma,a=o.a==null?1:o.a;
  const B=md_window(ctx,x,y,w,h,{logo:"databricks",product:"Genie ZeroOps",edge:o.mode==="inbox"?mix(MD.flow,MD.wait,ma):MD.flow,a,k:o.k,lit:o.lit,draw:(c,B)=>{if(ma<=0.004)return;c.save();c.globalAlpha*=ma;
    pw_zeroBody(c,B,o);c.restore();}});
  // the page's name, on the window's bar at the right (the window clips what it draws to its body): it fades with the page, as
  // the page turns to its insight and then its inbox, and springs in with the window; what it watches says so in its table
  if(title&&a*ma>0.004){ctx.save();ctx.globalAlpha*=a*ma;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));md_T(ctx,title,x+w-24,y+44,{w:600,size:28,align:"right",col:MD.soft});ctx.restore();}
  return B;}
function pw_zeroBody(c,B,o){{
    if(o.mode==="watch"){md_rows(c,B.x+20,B.y+10,[{h:"It watches",w:560},{h:"",w:B.w-620}],[[{s:"the pay run's jobs",icon:"eye",col:MD.flow},"claims job, payroll's export"],[{s:"the pay run's tables",icon:"eye",col:MD.flow},"the claims, and what's built from them"]],{rh:70,rowA:(r,i)=>clamp((o.rows||1)*2-i,0,1)});
      if(o.night>0)withA(c,o.night,()=>md_tag(c,B.x+20,B.y+B.h-56,"in the background, overnight",{icon:"clock",col:MD.flow}));return;}
    if(o.mode==="inbox"){const ia=o.mu==null?1:o.mu;withA(c,ia,()=>{const rx=B.x+20,ry=B.y+30,rw=B.w-40;md_card(c,rx,ry,rw,150,{edge:MD.wait,glow:0.9,r:16});glow(c,rx+44,ry+50,40,MD.wait,0.6);
        c.fillStyle=rgba(MD.wait,1);c.beginPath();c.arc(rx+44,ry+50,9,0,TAU);c.fill();md_T(c,"The claims job failed at 22:03",rx+76,ry+60,{w:800,size:32});
        md_T(c,"its cause, what it touches, and a fix to review",rx+76,ry+108,{w:600,size:28,col:MD.soft});
        md_pill(c,rx+rw-120,ry+50,"1 insight",{col:MD.wait,size:28});
        if(o.lock>0)withA(c,o.lock,()=>{md_tag(c,rx,ry+240,"nothing changed in production",{icon:"lock",col:MD.pass});});});return;}
    // the insight: its four steps on the left, the step's detail on the right
    const sx=B.x+24,sy=B.y+24;PW_STEPS.forEach(([s,sub],i)=>{const v=(o.steps||[])[i]||0,yy=sy+i*118,cur=i===o.view?1:0;
      if(cur&&v>0)withA(c,v,()=>{c.fillStyle=rgba(MD.flow,0.1);rr(c,sx-10,yy-8,372,102,14);c.fill();});
      c.save();c.beginPath();c.arc(sx+28,yy+36,24,0,TAU);c.fillStyle=v>0.5?rgba(mix(MD.flow,MD.navy,0.6),1):"rgba(20,30,52,0.9)";c.fill();c.strokeStyle=rgba(v>0.02?MD.flow:MD.dim,0.4+0.6*v);c.lineWidth=2.4;c.stroke();c.restore();
      if(v>0.5)md_icon(c,"tick",sx+28,yy+36,30,MD.flow,{a:(v-0.5)*2});else md_T(c,String(i+1),sx+28,yy+46,{w:800,size:28,align:"center",col:MD.soft});
      md_T(c,s,sx+68,yy+46,{w:800,size:30,col:v>0.02?MD.ink:MD.soft,a:0.45+0.55*v});md_T(c,sub,sx+68,yy+82,{w:600,size:28,col:MD.soft,a:0.45+0.55*v});});
    c.strokeStyle="rgba(170,200,245,0.18)";c.lineWidth=1.4;c.beginPath();c.moveTo(B.x+404,B.y+16);c.lineTo(B.x+404,B.y+B.h-16);c.stroke();
    const dx=B.x+436,dw=B.w-456,vu=o.vu==null?1:o.vu;
    if(o.view===0)withA(c,vu,()=>{pw_task(c,dx,B.y+40,dw,132,["build the","hours to pay"],{state:"fail"});md_T(c,"claims job · Monday 22:03",dx+4,B.y+228,{w:700,size:30,col:MD.soft});
      md_T(c,"can't read '1:30' as a number",dx+4,B.y+290,{w:500,size:28,f:"mono",col:mix(MD.fail,MD.ink,0.35)});});
    if(o.view===1)withA(c,vu,()=>pw_lineage(c,dx,B.y+20,dw,o));
    if(o.view===2)withA(c,vu,()=>{const hs=o.hits||[1,1,1];[["Hours for the payroll system","pay on Thursday"],["Payroll's export","what was paid"],["Casual teaching cost","Finance's measure"]].forEach(([s,sub],i)=>{
        const ha=hs[i]||0;if(ha<=0)return;withA(c,ha,()=>md_textCard(c,dx,B.y+24+i*150,dw,{title:s,sub},{edge:MD.fail,glow:0.5,k:ha}));});});
    if(o.view===3)withA(c,vu,()=>pw_fixCard(c,dx,B.y+150,dw,o));}}
// the lineage, from the failed task at the foot back up to the claims app's table, lit as it's traced (o.trace 0 to 1)
function pw_lineage(c,x,y,w,o){const tr=clamp(o.trace==null?1:o.trace,0,1),N=[["claims_app.claims","the app's table"],["stg_claims_app__claims","reads its hours"],["core_claim","the claims, checked"]],gap=134,ty=y+3*gap;
  // the lanes between them, lit from the foot up
  for(let i=0;i<3;i++){const yA=y+i*gap+96,yB=y+(i+1)*gap+6,lit=clamp(tr*3-(2-i),0,1),xx=x+44;c.strokeStyle="rgba(150,175,215,0.35)";c.lineWidth=3;c.beginPath();c.moveTo(xx,yA);c.lineTo(xx,yB);c.stroke();
    if(lit>0){const yy=lerp(yB,yA,lit);md_lane(c,[[xx,yB],[xx,yy]],MD.flow,1);glow(c,xx,yy,30,MD.flow,0.8*(lit<1?1:0));}}
  N.forEach(([n,sub],i)=>{const lit=clamp(tr*3-(2-i)-0.6,0,1),top=i===0,yy=y+i*gap;
    md_card(c,x,yy,w,100,{edge:top&&lit>0?mix(MD.flow,MD.fail,lit):MD.flow,glow:0.4+0.8*lit,r:14});md_icon(c,i?"table":"store",x+44,yy+50,34,top&&lit>0?mix(MD.flow,MD.fail,lit):MD.flow);
    md_T(c,n,x+86,yy+44,{w:500,size:28,f:"mono"});
    if(top&&o.cause>0){withA(c,o.cause,()=>md_T(c,"hours changed form · 15:02",x+86,yy+84,{w:700,size:28,col:mix(MD.fail,MD.ink,0.3)}));withA(c,1-o.cause,()=>md_T(c,sub,x+86,yy+84,{w:600,size:28,col:MD.soft}));}
    else md_T(c,sub,x+86,yy+84,{w:600,size:28,col:MD.soft});});
  pw_task(c,x,ty,w,100,["build the hours to pay"],{state:"fail"});}
// the proposed fix: one line of the staging model, struck out, and its replacement
function pw_fixCard(c,x,y,w,o){const f=clamp(o.fix==null?1:o.fix,0,1);md_card(c,x,y,w,300,{edge:MD.wait,glow:0.6,r:16});md_T(c,"stg_claims_app__claims.sql",x+28,y+52,{w:500,size:28,f:"mono",col:MD.soft});
  const l1="cast(hours as decimal(5, 2))",l2="decimal_hours('hours')";c.fillStyle=rgba(MD.fail,0.12);c.fillRect(x+16,y+82,w-32,58);md_T(c,"−",x+32,y+122,{w:500,size:30,f:"mono",col:MD.fail});
  md_T(c,l1,x+64,y+122,{w:500,size:28,f:"mono",col:mix(MD.fail,MD.ink,0.4)});const sw=md_tw(c,l1,{w:500,size:28,f:"mono"});c.strokeStyle=rgba(MD.fail,0.9);c.lineWidth=2.6;c.beginPath();c.moveTo(x+64,y+112);c.lineTo(x+64+sw*ag_sine(f*2),y+112);c.stroke();
  withA(c,ag_in(f,0.45,0.3),()=>{c.fillStyle=rgba(MD.pass,0.12);c.fillRect(x+16,y+148,w-32,58);md_T(c,"+",x+32,y+188,{w:500,size:30,f:"mono",col:MD.pass});md_T(c,l2,x+64,y+188,{w:500,size:28,f:"mono",col:mix(MD.pass,MD.ink,0.4)});});
  withA(c,ag_in(f,0.75,0.25),()=>md_pill(c,x+w/2,y+254,"1:30 → 1.50",{col:MD.pass,size:28,k:o.fixK}));}

/* ---------------------------------------------------------------- Tuesday morning: the push, the pull request, the approval */
// the morning: the night of the map with a window's warm light falling from the upper left
AG_PLACES.pwMorning=c=>{md_paintNight(c,{grid:false});const g=c.createRadialGradient(260,-40,40,260,-40,1300);g.addColorStop(0,"rgba(255,214,160,0.2)");g.addColorStop(0.5,"rgba(255,214,160,0.06)");g.addColorStop(1,"rgba(255,214,160,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the window's light on the night: two soft bars
  c.save();c.globalCompositeOperation="lighter";for(const [x0,w] of [[120,170],[330,170]]){const q=c.createLinearGradient(0,0,0,900);q.addColorStop(0,"rgba(255,226,180,0.07)");q.addColorStop(1,"rgba(255,226,180,0)");c.fillStyle=q;c.beginPath();c.moveTo(x0,0);c.lineTo(x0+w,0);c.lineTo(x0+w+260,900);c.lineTo(x0+260,900);c.closePath();c.fill();}c.restore();};
// the push, waiting for a person: o.press (0 to 1, the button pressed), o.a, o.k
function pw_confirm(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const p=clamp(o.press||0,0,1),col=mix(MD.wait,MD.pass,p);ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+110,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  md_card(ctx,x,y,w,220,{edge:col,glow:0.8,r:18});md_icon(ctx,"person",x+48,y+56,40,col);md_T(ctx,"Push the fix to a new branch?",x+90,y+66,{w:800,size:30});
  md_T(ctx,"only when a person asks, and confirms",x+90,y+108,{w:600,size:28,col:MD.soft});md_pill(ctx,x+w-150,y+166,p>0.5?"Confirmed":"Confirm",{col,size:28,icon:p>0.5?"tick":null});ctx.restore();}
// a branch drawn off the main line: o.u (0 to 1) how far it's drawn, its name once it's there
function pw_branch(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,u=clamp(o.u||0,0,1);if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  md_lane(ctx,[[x,y],[x+w,y]],[170,186,214],0.8);for(const k of [0.15,0.45]){ctx.fillStyle=rgba([170,186,214],1);ctx.beginPath();ctx.arc(x+w*k,y,9,0,TAU);ctx.fill();}
  md_T(ctx,"main",x,y+44,{w:500,size:28,f:"mono",col:MD.soft});
  if(u>0){const pts=md_curve([x+w*0.45,y],[x+w*0.95,y-90],{bend:0.5});md_lane(ctx,pts,MD.wait,0.95,{u});if(u>=1){ctx.fillStyle=rgba(MD.wait,1);ctx.beginPath();ctx.arc(x+w*0.95,y-90,10,0,TAU);ctx.fill();}
    withA(ctx,ag_in(u,0.7,0.3),()=>md_T(ctx,"read-hours-as-said",x+w*0.5,y-118,{w:500,size:28,f:"mono",col:mix(MD.wait,MD.ink,0.3)}));}
  ctx.restore();}
// the pull request, with GitHub's mark: o.checks [0 to 1 each, run to passed], o.approve (0 to 1), o.ask (0 to 1: its second part, the
// ask to Ingrid), o.a, o.k
function pw_pr(ctx,x,y,w,h,o){o=o||{};const ap=clamp(o.approve||0,0,1);return md_window(ctx,x,y,w,h,{logo:"github",product:"GitHub",title:"Pull request",edge:ap>0?mix(MD.wait,MD.pass,ap):MD.wait,a:o.a,k:o.k,draw:(c,B)=>{
  md_T(c,"Read hours as said: 1:30 is 1.5",B.x+24,B.y+50,{w:800,size:32});md_T(c,"Author: Sam Okafor · from the agent's fix",B.x+24,B.y+96,{w:600,size:28,col:MD.soft});
  const ck=o.checks||[0,0];[["unit test: both forms"],["build and test the claims"]].forEach(([s],i)=>{const v=clamp(ck[i]||0,0,1),yy=B.y+150+i*58,col=mix(MD.flow,MD.pass,v);
    md_icon(c,v>0.5?"tick":"refresh",B.x+44,yy,32,col);md_T(c,s,B.x+80,yy+10,{w:600,size:28,col:v>0.5?MD.ink:MD.soft});});
  const ry=B.y+280;c.strokeStyle="rgba(170,200,245,0.18)";c.lineWidth=1.2;c.beginPath();c.moveTo(B.x+20,ry-34);c.lineTo(B.x+B.w-20,ry-34);c.stroke();
  md_icon(c,ap>0.5?"tick":"person",B.x+44,ry,34,mix(MD.wait,MD.pass,ap));md_T(c,ap>0.5?"Approved: Noor Rahman · 09:05":"Review: Noor Rahman",B.x+80,ry+10,{w:700,size:28,col:ap>0.5?mix(MD.pass,MD.ink,0.3):MD.ink});
  if(o.ask>0)withA(c,o.ask,()=>{const ay=B.y+344;md_card(c,B.x+12,ay,B.w-24,110,{edge:MD.wait,glow:0.7,r:14});md_icon(c,"contract",B.x+52,ay+55,38,MD.agreed);
    md_T(c,"Also asks Ingrid Holm, HR:",B.x+92,ay+44,{w:700,size:28});md_T(c,"change the contract first, next time",B.x+92,ay+84,{w:600,size:28,col:MD.soft});});}});}
// the agent's part: what it did, and the one thing it never does
function pw_agentCard(ctx,x,y,w,o){o=o||{};return md_window(ctx,x,y,w,270,{logo:"databricks",product:"Genie ZeroOps",edge:MD.flow,a:o.a,k:o.k,draw:(c,B)=>{
  [["proposed the fix","tick",MD.flow],["pushed it, when asked","tick",MD.flow],["approves: never","cross",MD.soft]].forEach(([s,ic,col],i)=>{const yy=B.y+30+i*50;md_icon(c,ic,B.x+32,yy,28,col);md_T(c,s,B.x+64,yy+10,{w:i===2?800:600,size:28,col:i===2?MD.ink:MD.soft});});}});}
// pay day: o.a, o.k, o.paid (0 to 1)
function pw_payday(ctx,x,y,w,o){o=o||{};return md_textCard(ctx,x,y,w,{kick:"Thursday 5 November",title:"856 casual staff paid",sub:"their approved hours, on time"},{edge:MD.pass,icon:"tick",a:o.a,k:o.k,glow:0.8});}
// a decision in the claims app's log: o.state ("Proposed" or "Agreed"), o.a, o.k
function pw_decision(ctx,x,y,w,o){o=o||{};const ag=o.state==="Agreed",col=ag?MD.pass:MD.wait;const b=md_textCard(ctx,x,y,w,{kick:"Decision",title:"Contract first",sub:"change the contract before the app changes"},{edge:col,a:o.a,k:o.k,glow:0.8});
  if((o.a==null?1:o.a)>0.004)md_pill(ctx,b.x+100,b.y+b.h+46,ag?"Agreed":"Proposed",{col,size:28,a:o.a});return b;}

/* ---------------------------------------------------------------- Apollo 11 again: the document between two systems
   Two boxes, the computer and the radar's electronics, and the document between them: its one line, "frequency locked", and the empty
   line under it, the thing it didn't say. Under them, the computer's time, with what the radar took: about 13%. o.doc, o.gap, o.bar,
   o.take (0 to 1 each), o.a */
function pw_iface(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const bx=[[150,190,440,"Guidance computer","steering the landing"],[1330,190,440,"Radar's electronics","the rendezvous radar"]];
  bx.forEach(([x,y,w,t,s],i)=>{const k=o.k?o.k[i]:1;withA(ctx,clamp(k*2,0,1),()=>md_textCard(ctx,x,y,w,{title:t,sub:s},{icon:i?"api":"refresh",edge:[170,186,214],k}));});
  const d=o.doc||0;if(d>0)withA(ctx,d,()=>{const x=700,y=150,w=520;md_lane(ctx,[[590,250],[700,250]],MD.agreed,0.8,{dash:true,t:o.t||0});md_lane(ctx,[[1220,250],[1330,250]],MD.agreed,0.8,{dash:true,t:o.t||0});
    md_card(ctx,x,y,w,290,{edge:MD.agreed,glow:0.7,r:18,k:o.dk});md_icon(ctx,"contract",x+46,y+52,38,MD.agreed);md_T(ctx,"Between the two",x+86,y+62,{w:800,size:30});
    md_T(ctx,"power: frequency locked",x+40,y+140,{w:500,size:28,f:"mono"});md_icon(ctx,"tick",x+w-50,y+130,30,MD.agreed);
    const g=o.gap||0;if(g>0)withA(ctx,g,()=>{ctx.save();ctx.setLineDash([10,10]);ctx.strokeStyle=rgba(MD.fail,0.85);ctx.lineWidth=2.4;rr(ctx,x+28,y+176,w-56,60,10);ctx.stroke();ctx.restore();
      md_T(ctx,"…and nothing more",x+48,y+216,{w:600,size:28,col:mix(MD.fail,MD.ink,0.35)});});});
  const b=o.bar||0;if(b>0)withA(ctx,b,()=>{const x=330,y=560,w=1260,h=82,tk=clamp(o.take||0,0,1);md_label(ctx,x,y-24,"the computer's time",{});
    md_card(ctx,x,y,w,h,{r:14});ctx.fillStyle=rgba(mix(MD.pass,MD.navy,0.55),0.9);rr(ctx,x+8,y+8,(w-16)*(1-0.13*tk),h-16,10);ctx.fill();
    if(tk>0){const rx=x+8+(w-16)*(1-0.13*tk);glow(ctx,rx+(w-16)*0.065,y+h/2,140,MD.fail,0.35*tk);ctx.fillStyle=rgba(mix(MD.fail,MD.navy,0.25),0.95);rr(ctx,rx,y+8,(w-16)*0.13*tk,h-16,10);ctx.fill();
      withA(ctx,ag_in(tk,0.6,0.4),()=>{md_T(ctx,"about 13%",x+w-(w-16)*0.065-8,y+h+52,{w:800,size:32,align:"center",col:mix(MD.fail,MD.ink,0.3)});md_T(ctx,"taken by the radar's electronics",x+w-(w-16)*0.13-30,y+h+52,{w:600,size:28,align:"right",col:MD.soft});});}});
  ctx.restore();}
// the descent checklist, for the next missions: lines of steps (shown as lines, not words), one changed (o.ch 0 to 1); under it, what
// changed (o.note) and the software that now checks (o.sw)
function pw_checklist(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+220,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  md_card(ctx,x,y,w,440,{r:18});md_label(ctx,x+36,y+60,"Descent checklist",{});const ch=clamp(o.ch||0,0,1);
  for(let i=0;i<5;i++){const yy=y+106+i*62,mine=i===2,bw=w*(0.4+0.3*hash(i,3));
    if(mine&&ch>0)withA(ctx,ch,()=>{glow(ctx,x+w/2,yy+20,260,MD.pass,0.2);ctx.fillStyle=rgba(MD.pass,0.12);rr(ctx,x+20,yy-8,w-40,56,10);ctx.fill();ctx.strokeStyle=rgba(MD.pass,0.85);ctx.lineWidth=2.2;rr(ctx,x+20,yy-8,w-40,56,10);ctx.stroke();});
    ctx.strokeStyle=rgba(MD.soft,0.7);ctx.lineWidth=2;ctx.strokeRect(x+40,yy+6,22,22);if(mine&&ch>0)md_icon(ctx,"tick",x+51,yy+17,24,MD.pass,{a:ch});
    ctx.fillStyle=rgba(mine&&ch>0?mix(MD.soft,MD.pass,ch):MD.soft,0.4+0.4*(mine?ch:0));rr(ctx,x+84,yy+10,bw,14,7);ctx.fill();}
  ctx.restore();
  if(o.note>0)md_pill(ctx,x+w/2,y+500,"changed for the next missions",{col:MD.pass,size:28,a:o.note*a,k:o.noteK});
  if(o.sw>0)md_tag(ctx,x+w/2,y+590,"and the software checks the radar's mode",{icon:"tick",col:MD.pass,align:"center",a:o.sw*a});}
