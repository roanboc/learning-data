/* ===== When things go wrong · Silent change: scenes =====
   Eleven chapters, as in ../story.md. People scenes happen in rooms at dawn; the platform is the first film's world of light.
   Every shot keeps moving, gently: the camera drifts, people breathe and blink, and light flows along the lanes. */
const pulse=(t,t0,d)=>t>t0&&t<t0+(d||2.2)?Math.sin(Math.PI*(t-t0)/(d||2.2)):0;

/* ---------- 1. 7:58 am · Yesterday's numbers ---------- */
scene("banner",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");
  room(ctx,S,t);camKeys(ctx,S,[[0,960,540,1.0],[B,985,528,1.04],[sc.dur+1,995,522,1.06]],t);
  person(ctx,"ana",400,1180,1.34,{pose:"stand",pose2:"phone",mix:fin(t,c("asks")-0.6,0.5),expr:t>c("old")-0.5&&t<c("asks")+1.5?"concerned":t>c("note")+0.8?"concerned":"calm",t});
  dashboard(ctx,860,150,960,580,{banner:fin(t,c("note")+0.2),pulse:pulse(t,c("note")+0.2,2.4)+pulse(t,c("old")+1.2,2.4)});
  msg(ctx,490,236,330,"Ana → Sam","Are these numbers safe to use?",BIZ,fin(t,c("asks")+0.9,0.4),t>c("asks")-0.1?t:0);
  clockChip(ctx,S,"7:58","the morning before census date",fin(t,0.3));
  setScreen(ctx,S);withA(ctx,fin(t,c("ana")+0.6),()=>{glass(ctx,1560,52,296,64,18,BIZ,{glow:10,ea:0.6,fill:"rgba(8,14,28,0.85)"});T(ctx,"9:00 · confirm classes",1586,94,{w:700,size:22});});
  // the title, over a darker frame
  // the frame darkens first; the title comes in only once the dashboard has gone
  const oA=fin(t,B+0.1,0.6),tA=fin(t,B+0.6,0.7);if(oA>0){setScreen(ctx,S);ctx.fillStyle="rgba(3,5,11,"+oA+")";ctx.fillRect(0,0,W,H);
    withA(ctx,tA,()=>{glow(ctx,960,500,420,SK,0.12);T(ctx,"WHEN THINGS GO WRONG",960,450,{w:800,size:26,align:"center",color:rgba(SK,0.95)});T(ctx,"Silent change",960,540,{w:800,size:88,align:"center"});
      T(ctx,"why a change needs both sides",960,600,{w:600,size:26,align:"center",color:rgba(SOFT,0.95)});});}
  if(t<1.4){setScreen(ctx,S);ctx.fillStyle="rgba(0,0,0,"+(1-ease(t/1.4))+")";ctx.fillRect(0,0,W,H);}});

/* ---------- 2. Six hours earlier ---------- */
scene("night",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  // the whole row stays in frame: from the student system to the data product
  world(ctx,S);camKeys(ctx,S,[[0,965,500,1.0],[c("events")+1,965,490,1.02],[c("test"),955,485,1.04],[c("stops"),965,500,1.02],[c("alert")+0.5,965,540,1.0],[sc.dur+1,965,545,1.0]],t);
  const bad=fin(t,c("unknown")+0.3,0.35),skip=fin(t,c("stops")+0.8,1.0),y=470;
  platformRow(ctx,t,{err:t>c("events"),gate:mixc(GOOD,BAD,bad),skip,banner:fin(t,c("stops")+2.2),y});
  // enrolment changes arrive all day, as events or in files; tonight's build takes them to the tests, until a test fails and nothing more goes through
  packets(ctx,t,[{x:360,y},{x:470,y},{x:560,y}],0.45,1.2,0,APP.sis.c,16,0.9);
  packets(ctx,t,[{x:800,y},{x:884,y}],0.6,1.0,c("test")-0.5,APP.sis.c,16,1,c("unknown")+0.2);
  if(bad>0){for(let i=0;i<6;i++){const a=fin(t,c("unknown")+0.3+i*0.12);withA(ctx,a,()=>{ctx.fillStyle=rgba(AMBER,0.85);rr(ctx,812+(i%2)*24,y-40+Math.floor(i/2)*26+Math.sin(t*2+i)*2,16,16,4);ctx.fill();});}
    withA(ctx,fin(t,c("unknown")+0.5),()=>{glow(ctx,900,y,110,BAD,0.35+0.15*Math.sin(t*3));tag(ctx,820,y+182,"status: waitlisted · never seen",BAD,{align:"center",size:21});});}
  // the alert waits for the morning: nothing wrong was published
  withA(ctx,fin(t,c("alert")+0.2),()=>{const x=720,yy=740;glass(ctx,x,yy,480,96,20,AMBER,{glow:12,ea:0.7,fill:"rgba(30,22,8,0.85)"});glow(ctx,x+52,yy+48,34,[255,210,120],0.6+0.2*Math.sin(t*2));
    ctx.fillStyle="rgba(255,214,140,1)";ctx.beginPath();ctx.arc(x+52,yy+48,14,0,TAU);ctx.fill();T(ctx,"Alert · for the morning",x+92,yy+42,{w:800,size:24});T(ctx,"nothing wrong was published",x+92,yy+72,{w:500,size:18,color:rgba(SOFT,0.95)});});
  clockChip(ctx,S,"2:40","the nightly build",fin(t,0.4));});

/* ---------- 3. 7:59 am · Sam ---------- */
scene("sam",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  room(ctx,S,t,{top:"#0d162c"});camKeys(ctx,S,[[0,960,540,1.0],[sc.dur+1,940,530,1.05]],t);
  person(ctx,"sam",430,1180,1.34,{pose:"phone",expr:t<c("reply")?"concerned":"calm",t});
  glass(ctx,880,110,640,640,28,[170,205,255],{glow:16,ea:0.5,fill:"rgba(8,14,28,0.9)"});T(ctx,"Messages",912,160,{w:800,size:26});
  withA(ctx,1,()=>{glass(ctx,904,188,592,118,18,BAD,{glow:10,ea:0.7,fill:"rgba(40,10,14,0.6)"});led(ctx,928,214,12,12,BAD);T(ctx,"Test failed · 02:40",952,226,{w:800,size:22});
    T(ctx,"stg_enrolments · accepted_values",928,264,{w:500,size:19,f:"mono",color:rgba(INK,0.9)});T(ctx,"downstream skipped · last good data kept",928,292,{w:500,size:17,color:rgba(SOFT,0.95)});});
  msg(ctx,904,326,500,"Ana","Are these numbers safe to use?",BIZ,fin(t,0.6,0.4));
  msg(ctx,1036,430,460,"Sam → Ana","Yesterday's numbers are safe.\nI'm checking today's.\nBack to you by 8:45.",TECH,fin(t,c("reply")+0.6,0.4),t>c("reply")-0.3?t:0);
  // what Sam knows, and what not yet: inside the panel, under the reply
  withA(ctx,fin(t,c("trust")+0.3),()=>{const k="known: yesterday is safe";tag(ctx,904,660,k,GOOD,{size:21});tag(ctx,904+tw(ctx,k,21,700)+26+16,660,"not yet: today",AMBER,{size:21});});
  setScreen(ctx,S);clockChip(ctx,S,"7:59","",fin(t,0.2));});

/* ---------- 4. Follow the thread ---------- */
// the lineage world: the steps that built the number on Ana's dashboard, from the dashboard back to bronze
function lineWorld(ctx,t,k,trayA,kpiA){const y=540;
  if(k>0)glow(ctx,1640-Math.min(4,k)*350,y,70,BAD,0.2+0.1*Math.sin(t*3));
  kpiMini(ctx,1500,236,280,190,94,kpiA==null?1:kpiA);
  lineage(ctx,1640,y,350,{k,bad:true});tray(ctx,425,650,330,15,t,trayA);}
scene("thread",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  // the thread waits at the dashboard while Sam starts, then moves back one step at a time: to the data product, to the model that joins enrolments to units, then to staging
  const k=t<c("back")+0.4?0:t<c("steps")?0.001:t<c("staging")?ease(clamp((t-c("steps")-0.2)/1.4,0,1))+ease(clamp((t-c("steps")-2.9)/1.4,0,1)):2+ease(clamp((t-c("staging")-0.1)/1.4,0,1));
  // through the screen: over Sam's shoulder, the laptop turns to glass, and the camera passes through it; the room moves in too, more slowly
  const SR={x:760,y:250,w:560,h:315},u=ease(clamp((t-0.9)/2.0,0,1)),z1=W/SR.w;
  if(u<1){const z=lerp(1,z1,u),cx=lerp(W/2,SR.x+SR.w/2,u),cy=lerp(H/2,SR.y+SR.h/2,u);room(ctx,S,t,{top:"#0d162c",cam:{z:lerp(1,1.35,u),x:cx,y:cy}});ctx.setTransform(S*z,0,0,S*z,S*(W/2-cx*z),S*(H/2-cy*z));
    ctx.save();ctx.shadowColor="rgba(120,200,255,0.5)";ctx.shadowBlur=50;ctx.fillStyle="#0e1526";rr(ctx,SR.x-18,SR.y-18,SR.w+36,SR.h+36,14);ctx.fill();ctx.restore();
    ctx.save();rr(ctx,SR.x,SR.y,SR.w,SR.h,6);ctx.clip();ctx.translate(SR.x,SR.y);ctx.scale(SR.w/W,SR.h/H);bg2(ctx);lineWorld(ctx,t,0,0);ctx.restore();
    ctx.fillStyle="#1a2338";ctx.beginPath();ctx.moveTo(SR.x-50,SR.y+SR.h+18);ctx.lineTo(SR.x+SR.w+50,SR.y+SR.h+18);ctx.lineTo(SR.x+SR.w+90,SR.y+SR.h+44);ctx.lineTo(SR.x-90,SR.y+SR.h+44);ctx.closePath();ctx.fill();
    const zf=1+(z-1)*1.5;if(zf<3.2){ctx.setTransform(S*zf,0,0,S*zf,S*(W/2-cx*zf),S*(H/2-cy*zf));personBack(ctx,"sam",420,1745,2.3,{t});}
    return;}
  // every framing holds whole boxes: the whole lineage; then the dashboard's end; then staging and the rows kept aside
  world(ctx,S);camKeys(ctx,S,[[2.9,945,540,1.0],[c("back")+0.2,945,540,1.0],[c("back")+1.6,1275,520,1.17],[c("staging")-0.2,1275,520,1.17],[c("staging")+2.0,750,560,1.3],[sc.dur+1,750,560,1.3]],t);
  lineWorld(ctx,t,k,fin(t,c("staging")+1.6),1-fin(t,c("staging")-0.2,1.0));});

/* ---------- 5. The cause, in bronze ---------- */
// the rows in bronze as they arrived: the columns the contract will later name
const ROWS=[["S-2231","DS101-S2","enrolled","2026-07-28"],["S-4410","DS101-S2","waitlisted","2026-08-24"],["S-1187","DS101-S2","enrolled","2026-08-02"],["S-5092","DS101-S2","waitlisted","2026-08-24"],["S-3368","DS101-S2","enrolled","2026-08-05"],["S-6120","DS101-S2","waitlisted","2026-08-24"]],COLX=[24,130,270,420];
scene("bronze",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  world(ctx,S);camKeys(ctx,S,[[0,750,560,1.3],[1.8,712,440,1.2],[c("new"),712,430,1.22],[sc.dur+1,712,430,1.24]],t);
  lineWorld(ctx,t,3+ease(clamp((t-0.2)/1.4,0,1)),1-fin(t,c("arrived")+0.3,0.8),0);
  const a=fin(t,c("arrived")+0.6,0.8);withA(ctx,a,()=>{const x=0,y=40,w=560;glass(ctx,x,y,w,344,20,LAYER.bronze,{glow:16,ea:0.8,fill:"rgba(20,12,6,0.9)"});
    T(ctx,"bronze.enrolments",x+24,y+40,{w:700,size:20,f:"mono",color:rgba(LAYER.bronze,1)});["student","offering","status","date"].forEach((h,i)=>T(ctx,h,x+COLX[i],y+78,{w:700,size:16,color:rgba(SOFT,0.9)}));
    ROWS.forEach((r,i)=>{const yy=y+112+i*36,wl=r[2]==="waitlisted",hi=wl?fin(t,c("new")+0.3+i*0.1):0;if(hi>0){ctx.fillStyle=rgba(AMBER,0.16*hi);rr(ctx,x+12,yy-24,w-24,32,8);ctx.fill();}
      r.forEach((v,j)=>T(ctx,v,x+COLX[j],yy,{w:600,size:19,f:"mono",color:wl&&j===2&&hi>0?rgba(AMBER,1):rgba(INK,0.9)}));});
    T(ctx,"showing 6 of 134 rows",x+24,y+326,{w:500,size:16,color:rgba(SOFT,0.85)});});
  withA(ctx,fin(t,c("new")+0.8),()=>tag(ctx,280,424,"15 in Data Science 101: waitlisted",AMBER,{align:"center",size:21}));
  withA(ctx,fin(t,c("kept")+2.2),()=>{tag(ctx,850,300,"nothing lost",GOOD,{align:"center",size:22});tag(ctx,850,360,"something new",AMBER,{align:"center",size:22});});});

/* ---------- 6. Two halves of one change ---------- */
function campus(ctx,t,sc,c){ // the flashback: two notices, each on its own path, fading before they reach the platform
  const pA=ease(clamp((t-c("notices")+0.2)/2.2,0,1)),pB=ease(clamp((t-c("notices")-1.6)/2.2,0,1)),reach=fin(t,c("reached")+0.4,1.2);
  const bld=(x,y,w,h,name,col)=>{glass(ctx,x-w/2,y-h/2,w,h,14,col,{glow:12,ea:0.75,fill:"rgba(12,18,32,0.9)"});T(ctx,name,x,y+8,{w:700,size:20,align:"center"});};
  const path=(pts,col,p,fade)=>{const n=pts.length-1,k=p*n,sub=[pts[0]];for(let i=1;i<=Math.ceil(k)&&i<=n;i++){const f=Math.min(1,k-(i-1));sub.push({x:lerp(pts[i-1].x,pts[i].x,f),y:lerp(pts[i-1].y,pts[i].y,f)});}
    if(sub.length>1)beam(ctx,sub,col,[[18,0.06],[7,0.16],[2.4,0.8],[1.2,0.95]]);return sub[sub.length-1];};
  bld(300,300,300,90,"Registrar's office",BIZ);bld(300,700,300,90,"Student system team",TECH);
  ["School of Computing","School of Business","School of Health"].forEach((s,i)=>bld(900,190+i*110,300,70,s,BIZ));bld(900,700,300,70,"release notes",TECH);
  glass(ctx,1440,340,380,300,24,[170,205,255],{glow:14,ea:0.5,fill:"rgba(8,14,28,0.9)"});T(ctx,"Data platform",1630,390,{w:800,size:24,align:"center"});
  kpiMini(ctx,1490,408,280,180,94);T(ctx,"and the people who use its numbers",1630,624,{w:500,size:16,align:"center",color:rgba(SOFT,0.95)});
  const branch=y=>{const P=[];for(let i=0;i<=14;i++){const u=i/14,a=1-u;P.push({x:a*a*a*560+3*a*a*u*660+3*a*u*u*650+u*u*u*750,y:a*a*a*300+3*a*a*u*300+3*a*u*u*y+u*u*u*y});}return P;};
  path([{x:450,y:300},{x:560,y:300}],BIZ,clamp(pA*2.2,0,1));const pb=clamp(pA*2.2-1.2,0,1);let e1=null;[190,300,410].forEach(y=>{const e=path(branch(y),BIZ,pb);if(y===300)e1=e;});if(pA<0.45)e1={x:lerp(450,560,clamp(pA*2.2,0,1)),y:300};
  const e2=path([{x:450,y:700},{x:750,y:700}],TECH,pB);
  if(pA>0.05&&pA<0.98){ctx.fillStyle=rgba(BIZ,1);rr(ctx,e1.x-14,e1.y-10,28,20,3);ctx.fill();}
  if(pB>0.05&&pB<0.98){ctx.fillStyle=rgba(TECH,1);rr(ctx,e2.x-10,e2.y-13,20,26,3);ctx.fill();}
  // the paths that never were: from each audience towards the platform, fading out halfway
  [[1050,300,BIZ],[1050,700,TECH]].forEach(([x,y,col])=>withA(ctx,reach,()=>{ctx.save();ctx.setLineDash([10,12]);const g=ctx.createLinearGradient(x,0,1400,0);g.addColorStop(0,rgba(col,0.8));g.addColorStop(1,rgba(col,0));ctx.strokeStyle=g;ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(1300,490+(y-490)*0.4);ctx.stroke();ctx.restore();}));
  withA(ctx,reach,()=>{T(ctx,"?",1370,510,{w:800,size:64,align:"center",color:rgba(SOFT,0.6+0.3*Math.sin(t*2))});});}
scene("halves",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  const fb=fin(t,c("weeks")-0.4,0.9)*fout(t,c("knew")-0.6,0.9),present=1-fb;
  // present: messages, then a call
  if(t<c("weeks")+0.6){room(ctx,S,t,{top:"#0d162c"});camKeys(ctx,S,[[0,960,540,1.0],[c("weeks"),940,530,1.04]],t);
    person(ctx,"sam",380,1180,1.32,{pose:"phone",pose2:"stand",mix:fin(t,c("mei")-0.1,0.45),expr:"concerned",t});
    const mA=fout(t,c("mei")-0.2,0.6);msg(ctx,780,170,560,"Sam → Ben","Did enrolments change last night?",TECH,fin(t,c("ask")+1.0,0.4)*mA,t>c("ask")+0.2&&t<c("mei")?t:0);
    msg(ctx,1240,330,560,"Ben","Yes, waitlists went live.\nIt's in our release notes.",TECH,fin(t,c("ben")+0.2,0.4)*mA,t>c("ben")-0.6&&t<c("mei")?t:0);
    const cA=fin(t,c("mei")+0.2,0.8);withA(ctx,cA,()=>{callTile(ctx,"sam",780,150,480,300,{t,expr:"concerned"});callTile(ctx,"mei",1300,150,480,300,{t,hi:1});
      msg(ctx,1040,490,620,"Mei","Yes, we introduced waitlists,\nand we emailed every School.",BIZ,fin(t,c("mei")+1.6,0.4));});}
  // two weeks earlier
  if(fb>0){setScreen(ctx,S);withA(ctx,fb,()=>{bg2(ctx);ctx.save();camKeys(ctx,S,[[c("weeks")-0.4,960,500,1.02],[c("knew"),940,480,1.06]],t);campus(ctx,t,sc,c);ctx.restore();
    setScreen(ctx,S);clockChip(ctx,S,"two weeks earlier","",1);ctx.fillStyle="rgba(255,220,170,0.04)";ctx.fillRect(0,0,W,H);});}
  // the two halves meet: Ben knew what changed, Mei knew what it meant
  if(t>c("knew")-0.7){const p=fin(t,c("knew")-0.7,0.9),q=fin(t,c("question")-0.5,0.5),q2=fin(t,c("question"),0.6),sk=fin(t,c("sketch")-0.4,0.9);
    if(sk<1)withA(ctx,p*(1-sk),()=>{setScreen(ctx,S);bg2(ctx);camKeys(ctx,S,[[c("knew"),960,520,1.0],[c("sketch"),960,520,1.04]],t);
      if(q<1)withA(ctx,1-q,()=>{callTile(ctx,"ben",140,170,440,300,{t,hi:1});callTile(ctx,"sam",740,420,440,300,{t});callTile(ctx,"mei",1340,170,440,300,{t,hi:1});
        const m=ease(clamp((t-c("knew")-0.2)/1.8,0,1));beam(ctx,[{x:580,y:320},{x:lerp(580,740,m),y:lerp(320,570,m)}],TECH,[[16,0.08],[6,0.2],[2.4,0.85],[1.2,1]]);beam(ctx,[{x:1340,y:320},{x:lerp(1340,1180,m),y:lerp(320,570,m)}],BIZ,[[16,0.08],[6,0.2],[2.4,0.85],[1.2,1]]);
        withA(ctx,fin(t,c("knew")+0.4),()=>tag(ctx,360,520,"knew what changed",TECH,{align:"center",size:21}));withA(ctx,fin(t,c("knew")+1.6),()=>tag(ctx,1560,520,"knew what it meant",BIZ,{align:"center",size:21}));
        withA(ctx,fin(t,c("knew")+3.2),()=>tag(ctx,960,780,"the numbers depend on it",SOFT,{align:"center",size:21}));});
      if(q2>0)withA(ctx,q2,()=>{callTile(ctx,"mei",160,200,560,360,{t,expr:t>c("decides")+0.5?"calm":"calm",hi:1});
        glass(ctx,820,220,940,300,24,BIZ,{glow:16,ea:0.8,fill:"rgba(12,16,30,0.92)"});T(ctx,"Is a waitlisted student enrolled?",860,290,{w:800,size:34});T(ctx,"a business question",860,334,{w:600,size:20,color:rgba(SOFT,0.95)});
        withA(ctx,fin(t,c("decides")+0.3),()=>{T(ctx,"No.",860,410,{w:800,size:40,color:rgba(BIZ,1)});T(ctx,"Enrolled means holding a seat on census date.",940,410,{w:600,size:26});T(ctx,"A waitlisted student doesn't hold one yet.",940,452,{w:500,size:22,color:rgba(SOFT,0.95)});});});});
    if(sk>0){setScreen(ctx,S);withA(ctx,sk,()=>{bg2(ctx);camKeys(ctx,S,[[c("sketch")-0.4,960,470,0.98],[sc.dur+1,960,470,1.06]],t);
      T(ctx,"The conceptual model · from A Sharper Sketch",960,170,{w:700,size:22,align:"center",color:rgba(SK,0.95)});
      sharperSketch(ctx,{newA:fin(t,c("sketch")+0.9,1.0),glowNew:0.6+0.4*Math.sin(t*1.6),hi:0.5+0.5*fin(t,c("sketch")+0.4)});});}}});

/* ---------- 7. The fix ---------- */
// the change as a diff: 0 unchanged, 1 file name, 2 added, 3 added comment, 4 removed; the last number says which half of the fix (the test, then the model)
const CODE=[["models/staging/_stg.yml",1],["- name: status",0],["  tests:",0],["    - accepted_values:",0],["        values: [enrolled, withdrawn]",4,0],["        values: [enrolled, withdrawn, waitlisted]",2,0],["",0],
  ["models/marts/fct_offering_fill.sql",1],["count(*) filter (",0],["  where status != 'withdrawn')",4,1],["  where status = 'enrolled')",2,1],["-- waitlisted doesn't hold a seat",3,1]];
scene("fix",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  world(ctx,S);camKeys(ctx,S,[[0,960,470,1.0],[sc.dur+1,968,466,1.02]],t);
  glass(ctx,120,140,1000,640,24,DBT,{glow:16,ea:0.7,fill:"rgba(10,12,22,0.94)"});chip(ctx,200,196,"dbt","one rule","",{edge:DBT});
  // added lines open a space and fade in; the lines they replace turn red
  const ch=(h,d)=>fin(t,c("small")+1.4+h*1.2+(d||0),0.7);let y=270;
  CODE.forEach(([s,kind,h])=>{const f=kind>=2&&kind<=4?ch(h||0,kind===3?0.6:0):1,add=kind===2||kind===3;if(add&&f<=0.01)return;const yy=y;y+=44*(add?ease(f):1);
    if(kind===4&&f>0){ctx.fillStyle=rgba(BAD,0.14*f);rr(ctx,150,yy-30,940,40,8);ctx.fill();}
    if(add){ctx.fillStyle=rgba(GOOD,0.14*f);rr(ctx,150,yy-30,940,40*ease(f),8);ctx.fill();}
    const col=kind===1?rgba(SOFT,0.9):kind===2?rgba(GOOD,1):kind===3?rgba(AMBER,0.95):kind===4&&f>0.5?rgba(mixc(INK,[255,150,150],f),0.95):rgba(INK,0.95);
    withA(ctx,add?sstep(0.55,1,f):1,()=>T(ctx,(add?"+ ":kind===4&&f>0.5?"- ":"  ")+s,160,yy,{w:500,size:24,f:"mono",color:col}));});
  // on the right, from the start: the decision the fix follows; then the review and CI
  glass(ctx,1200,140,600,130,22,BIZ,{glow:12,ea:0.7,fill:"rgba(20,16,8,0.9)"});T(ctx,"Decision · registrar's office",1230,192,{w:800,size:24});T(ctx,"waitlisted doesn't count as enrolled",1230,232,{w:500,size:20,color:rgba(SOFT,0.95)});
  withA(ctx,fin(t,c("review")+0.2),()=>{glass(ctx,1200,300,600,130,22,GOOD,{glow:14,ea:0.8,fill:"rgba(10,26,20,0.9)"});led(ctx,1230,352,16,16,GOOD);T(ctx,"Review · approved",1264,366,{w:800,size:28});T(ctx,"by a colleague, like any code",1264,400,{w:500,size:19,color:rgba(SOFT,0.95)});});
  withA(ctx,fin(t,c("review")+1.8),()=>{glass(ctx,1200,460,600,320,22,[170,205,255],{glow:12,ea:0.6,fill:"rgba(8,14,28,0.92)"});T(ctx,"CI · tests on what changed",1230,510,{w:800,size:24});
    ["stg_enrolments","int_offering_enrolments","fct_offering_fill"].forEach((m,i)=>{const a=fin(t,c("review")+2.4+i*0.5);withA(ctx,a,()=>{led(ctx,1232,566+i*70,14,14,GOOD);T(ctx,m,1264,580+i*70,{w:600,size:22,f:"mono"});T(ctx,"pass",1770,580+i*70,{w:700,size:20,align:"right",color:rgba(GOOD,1)});});});});});

/* ---------- 8. Recover ---------- */
scene("recover",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),nine=c("confirm")+2.1;
  // first the platform: the skipped models run again, silver then gold light up, and the data product turns to 96%
  const X=fin(t,c("would")+0.1,0.8);
  if(X<1){world(ctx,S);camKeys(ctx,S,[[0,965,500,1.0],[c("would")+1,965,505,1.02]],t);
    const run=ease(clamp((t-c("rerun")-0.1)/1.6,0,1));platformRow(ctx,t,{skip:1,lit:run,gate:GOOD,y:470,num:run>0.97?"96%":"94%"});
    if(run>0&&run<1)glow(ctx,lerp(900,1725,run),470,80,GOOD,0.5);}
  // then, in a dissolve, the dashboard: what it would have shown, time travel, and Ana
  if(X>0)withA(ctx,X,()=>{world(ctx,S);camKeys(ctx,S,[[c("would"),960,480,1.0],[sc.dur+1,960,470,1.02]],t);
    const v=fin(t,c("versions")+0.4),ok=fin(t,c("confirm")+0.2),ghost=fin(t,c("would")+1.8)*fout(t,c("versions")-0.2);
    dashboard(ctx,480,170,960,580,{num:ok>0.5?96:94,banner:1-ok,ok,ghost,day:"Tuesday"});
    withA(ctx,v,()=>{[["version 41","yesterday 23:02","94%"],["version 42","today 08:31","96%"]].forEach(([n,w2,p],i)=>{const x=1480,y=220+i*190;glass(ctx,x,y,380,160,18,[214,228,255],{glow:12,ea:0.7,fill:"rgba(10,16,32,0.9)"});
      T(ctx,n,x+24,y+44,{w:800,size:22,f:"mono"});T(ctx,w2,x+24,y+76,{w:500,size:18,color:rgba(SOFT,0.95)});T(ctx,p,x+356,y+128,{w:800,size:44,align:"right",color:i?rgba(GOOD,1):rgba(INK,0.9)});});
      T(ctx,"time travel",1670,196,{w:700,size:20,align:"center",color:rgba(SOFT,0.95)});});
    // Ana: a bigger room she might have booked, then, at nine, the classes confirmed
    const room=fin(t,c("believable")+4.0)*fout(t,c("versions")-0.3),conf=fin(t,nine);
    withA(ctx,Math.max(room,conf),()=>callTile(ctx,"ana",110,300,330,240,{t,expr:conf>0.5?"relieved":"concerned",hi:1}));
    withA(ctx,fin(t,c("believable")+4.6)*fout(t,c("versions")-0.3),()=>tag(ctx,275,580,"a bigger room?",BAD,{align:"center",size:20}));
    withA(ctx,fin(t,nine+0.2),()=>tag(ctx,275,580,"9:00 · classes confirmed",GOOD,{align:"center",size:21}));});
  setScreen(ctx,S);clockChip(ctx,S,t<c("confirm")?"8:3"+Math.min(9,Math.floor(t/3)):t<nine?"8:40":"9:00","",fin(t,0.2));});

/* ---------- 9. The contract ---------- */
scene("contract",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  world(ctx,S);camKeys(ctx,S,[[0,960,470,1.02],[sc.dur+1,960,470,1.0]],t);
  // four people, each on one side of the change: business or technical, producing or using the data
  const tiles=[["mei",60,60,"business · produces",BIZ,334],["ben",1460,60,"technical · produces",TECH,334],["ana",60,560,"business · uses",BIZ,536],["sam",1460,560,"technical · uses",TECH,536]];
  tiles.forEach(([id,x,y,role,col,ly],i)=>{const a=fin(t,0.3+i*0.35),sig=clamp((t-c("owners")-0.4)/2.0*4-i,0,1);withA(ctx,a,()=>callTile(ctx,id,x,y,400,240,{t,hi:sig>0.5,expr:t>c("checks")+0.3+i*0.15?"relieved":"calm"}));
    withA(ctx,a*fin(t,c("meet")+0.6+i*0.2),()=>T(ctx,role,x+200,ly,{w:700,size:21,align:"center",color:rgba(col,0.95)}));});
  // the two paths from the flashback become one card: they reach its edges, then fade into it
  const m=ease(clamp((t-c("agree")+0.2)/1.8,0,1)),bA=fout(t,c("agree")+1.6,0.5);if(m>0&&bA>0)withA(ctx,bA,()=>{beam(ctx,[{x:460,y:180},{x:lerp(460,560,m),y:lerp(180,200,m)}],BIZ,[[16,0.08],[6,0.2],[2.4,0.85],[1.2,1]]);beam(ctx,[{x:1460,y:180},{x:lerp(1460,1360,m),y:lerp(180,200,m)}],TECH,[[16,0.08],[6,0.2],[2.4,0.85],[1.2,1]]);});
  const cA=fin(t,c("agree")+1.2,0.8);withA(ctx,cA,()=>contract(ctx,560,120,800,560,{rows:clamp((t-c("says")-0.2)/3.2,0,1),sign:clamp((t-c("owners")-0.4)/2.0,0,1),glow:pulse(t,c("checks"),3)}));
  // checked all the time: at the platform's door on every load, and in the student system's tests on every proposed change
  withA(ctx,fin(t,c("checks")+1.2),()=>tag(ctx,960,716,"checked on every load, at the platform's door",[236,243,255],{align:"center",size:22}));
  withA(ctx,fin(t,c("checks")+2.8),()=>tag(ctx,960,768,"and on every proposed change, before it ships",TECH,{align:"center",size:22}));});

/* ---------- 10. Three weeks later ---------- */
scene("later",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  world(ctx,S);const mon=fin(t,c("monday")-0.3,0.9);camKeys(ctx,S,[[0,960,500,1.0],[sc.dur+1,960,500,1.04]],t);
  const am=fin(t,c("amber")+0.4,0.4),v11=fin(t,c("define")+3.4,0.6),gc=v11>0?mixc(AMBER,GOOD,v11):mixc([236,243,255],AMBER,am);
  withA(ctx,1-mon,()=>{glass(ctx,80,150,820,560,24,TECH,{glow:14,ea:0.6,fill:"rgba(8,14,28,0.92)"});T(ctx,"Student system · test environment",112,204,{w:800,size:24});T(ctx,"a proposed release",112,238,{w:500,size:18,color:rgba(SOFT,0.95)});
    // the new status travels to the contract check, which turns amber, then green once the contract knows it
    const p=ease(clamp((t-c("weeks")-0.6)/2.2,0,1)),cx=lerp(130,500,p);glass(ctx,cx,400,210,60,16,v11>0?gc:AMBER,{glow:12,ea:0.8,fill:"rgba(30,22,8,0.9)"});T(ctx,"deferred",cx+105,438,{w:800,size:22,f:"mono",align:"center"});
    glass(ctx,720,320,110,220,18,gc,{glow:am>0.5&&v11<1?22+10*Math.sin(t*3):10,ea:0.85,fill:"rgba(12,18,34,0.92)"});T(ctx,"contract",775,570,{w:700,size:17,align:"center"});T(ctx,"check",775,592,{w:700,size:17,align:"center"});
    const glyph=v11>0.5?"✓":am>0.5?"!":"✓";T(ctx,glyph,775,452,{w:800,size:56,align:"center",color:rgba(v11>0.5?GOOD:am>0.5?AMBER:SOFT,am>0.5||v11>0.5?1:0.6)});
    withA(ctx,fin(t,c("amber")+0.8)*(1-v11),()=>tag(ctx,490,640,"deferred isn't in the contract yet",AMBER,{align:"center",size:21}));
    withA(ctx,v11,()=>tag(ctx,490,640,"deferred is in contract v1.1",GOOD,{align:"center",size:21}));
    contract(ctx,980,150,860,560,{notice:am>0.5?(0.6+0.4*Math.sin(t*4))*(1-v11):0,deferred:fin(t,c("define")+2.2,0.5),defHi:brief(t,c("define")+2.2,1.8),ver:t>c("define")+3.4?"1.1":"1.0",verFlash:pulse(t,c("define")+3.4,1.6)});
    withA(ctx,fin(t,c("define")+0.3)*fout(t,c("monday")-0.5),()=>msg(ctx,1080,734,720,"Mei","Deferred: starts in a later term. Not enrolled now.",BIZ,1));});
  // Monday: the dashboard simply updates, a point up, with nothing to explain
  withA(ctx,mon,()=>{const up=fin(t,c("monday")+1.4,1.2);dashboard(ctx,480,170,960,580,{num:lerp(96,97,up),ok:1,okText:up<0.5?"Up to date: Sunday, 06:00":"Up to date: Monday, 06:00",day:"Monday",title:"Enrolments · semester 2",delta:"▲ 1 pt vs last week",flash:brief(t,c("monday")+1.4,1.4)});
    setScreen(ctx,S);clockChip(ctx,S,"Monday","",1);});
  setScreen(ctx,S);withA(ctx,1-mon,()=>clockChip(ctx,S,"three weeks later","",fin(t,0.2)));});

/* ---------- 11. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");
  world(ctx,S);camKeys(ctx,S,[[0,482,470,1.7],[5.5,960,520,0.94],[sc.dur+1,960,520,0.9]],t);
  // changes keep arriving, as events or in files, through the contract at the door; the numbers are built once a night
  platformRow(ctx,t,{door:1,gate:GOOD,y:470,num:"97%"});packets(ctx,t,[{x:360,y:470},{x:470,y:470},{x:560,y:470}],0.5,1.2,0,APP.sis.c,16,0.9);
  // a hint of the next film in the series: another number jumps overnight
  withA(ctx,fin(t,B-0.4,0.8),()=>{const x=1590,y=660,w=270,h=150,v=ease(clamp((t-B)/2.0,0,1));dbCard(ctx,x,y,w,h);T(ctx,"Applications",x+18,y+32,{w:700,size:17,color:DB.text});T(ctx,"overnight",x+18,y+52,{w:500,size:14,color:DB.muted});
    withA(ctx,sstep(0.6,1,v),()=>T(ctx,"+38%",x+w-18,y+44,{w:700,size:28,align:"right",color:DB.red}));
    const tr=[40,41,40,42,41,42,43,42,43,42+17*v],px=i=>x+18+(w-36)*i/(tr.length-1),py=q=>y+h-18-(q-38)*3.2;
    ctx.beginPath();tr.forEach((q,i)=>i?ctx.lineTo(px(i),py(q)):ctx.moveTo(px(i),py(q)));ctx.strokeStyle=v>0.6?DB.red:DB.blue;ctx.lineWidth=2.5;ctx.stroke();
    ctx.fillStyle=v>0.6?DB.red:DB.blue;ctx.beginPath();ctx.arc(px(tr.length-1),py(tr[tr.length-1]),4,0,TAU);ctx.fill();});
  // the last line, once it has been said
  setScreen(ctx,S);withA(ctx,fin(t,c("tag")+2.2,0.8),()=>{T(ctx,"Seen by both sides, before it ships.",960,150,{w:800,size:50,align:"center"});T(ctx,"When things go wrong · Silent change",960,196,{w:600,size:22,align:"center",color:rgba(SOFT,0.95)});});});
