/* ===== When things go wrong · Silent change: scenes =====
   Eleven chapters, as in ../story.md. People scenes happen in rooms at dawn; the platform is the first film's world of light.
   Every shot keeps moving, gently: the camera drifts, people breathe and blink, and light flows along the lanes. */
const pulse=(t,t0,d)=>t>t0&&t<t0+(d||2.2)?Math.sin(Math.PI*(t-t0)/(d||2.2)):0;
const sis=k=>({app:"sis",q:1,err:false});

/* ---------- 1. 7:58 am · The banner ---------- */
scene("banner",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");
  room(ctx,S,t);camKeys(ctx,S,[[0,960,540,1.0],[B,985,528,1.04],[sc.dur+1,995,522,1.06]],t);
  person(ctx,"ana",400,1225,1.42,{pose:t>c("asks")-0.4?"phone":"stand",expr:t>c("old")-0.5&&t<c("asks")+1.5?"concerned":t>c("note")+0.8?"concerned":"calm",t});
  dashboard(ctx,860,150,960,580,{banner:fin(t,c("note")+0.2),pulse:pulse(t,c("note")+0.2,2.4)+pulse(t,c("old")+1.2,2.4)});
  msg(ctx,520,236,330,"Ana → Sam","Are these numbers safe to use?",BIZ,fin(t,c("asks")+0.9,0.4),t>c("asks")-0.1?t:0);
  clockChip(ctx,S,"7:58","the morning before census date",fin(t,0.3));
  setScreen(ctx,S);withA(ctx,fin(t,c("ana")+0.6),()=>{glass(ctx,1560,52,296,64,18,BIZ,{glow:10,ea:0.6,fill:"rgba(8,14,28,0.85)"});T(ctx,"9:00 · confirm classes",1586,94,{w:700,size:22});});
  // the title, over a darker frame
  const tA=fin(t,B+0.1,0.9);if(tA>0){setScreen(ctx,S);ctx.fillStyle="rgba(3,5,11,"+(0.93*tA)+")";ctx.fillRect(0,0,W,H);
    withA(ctx,tA,()=>{glow(ctx,960,500,420,SK,0.12);T(ctx,"WHEN THINGS GO WRONG",960,450,{w:800,size:26,align:"center",color:rgba(SK,0.95)});T(ctx,"Silent change",960,540,{w:800,size:88,align:"center"});
      T(ctx,"Episode 1",960,600,{w:600,size:24,align:"center",color:rgba(SOFT,0.95)});});}});

/* ---------- 2. Six hours earlier ---------- */
scene("night",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  world(ctx,S);const cam=camKeys(ctx,S,[[0,760,500,1.12],[c("events")+1,860,480,1.04],[c("test"),920,470,1.12],[c("unknown")+0.4,920,460,1.3],[c("stops"),1180,480,1.0],[c("alert")+0.5,1040,520,1.02],[sc.dur+1,1000,520,1.0]],t);
  glow(ctx,1700,120,120,[200,220,255],0.25);
  const bad=t>c("unknown")+0.3,skip=fin(t,c("stops")+0.8,1.0),y=470;
  platformRow(ctx,t,{err:t>c("events"),gate:bad?BAD:GOOD,skip,banner:fin(t,c("stops")+2.2),y});
  // enrolments arrive all day as events; tonight's build carries them through the tests, until the test fails and the build stops
  flowTiles(ctx,t,[{x:360,y},{x:470,y},{x:560,y}],0.45,1.2,0,sis,20,0.9);
  if(t>c("test")-0.5&&!bad)flowTiles(ctx,t,[{x:800,y},{x:900,y},{x:1000,y},{x:1240,y},{x:1300,y}],0.6,1.8,c("test"),sis,18,fin(t,c("test")-0.5));
  if(bad){for(let i=0;i<6;i++){const a=fin(t,c("unknown")+0.3+i*0.12);withA(ctx,a,()=>{ctx.fillStyle=rgba(AMBER,0.85);rr(ctx,842-(i%3)*22,y-30+Math.floor(i/3)*30+Math.sin(t*2+i)*2,18,18,4);ctx.fill();});}
    withA(ctx,fin(t,c("unknown")+0.5),()=>{glow(ctx,900,y,110,BAD,0.35+0.15*Math.sin(t*3));tag(ctx,900,y+130,"status: WAITLISTED · never seen",BAD,{align:"center",size:21});});}
  setScreen(ctx,S);clockChip(ctx,S,"2:40","the nightly build",fin(t,0.4));
  // the alert waits for the morning: nothing wrong was published
  withA(ctx,fin(t,c("alert")+0.2),()=>{const x=720,yy=700;glass(ctx,x,yy,480,96,20,AMBER,{glow:12,ea:0.7,fill:"rgba(30,22,8,0.85)"});glow(ctx,x+52,yy+48,34,[255,210,120],0.6+0.2*Math.sin(t*2));
    ctx.fillStyle="rgba(255,214,140,1)";ctx.beginPath();ctx.arc(x+52,yy+48,14,0,TAU);ctx.fill();T(ctx,"Alert · for the morning",x+92,yy+42,{w:800,size:24});T(ctx,"nothing wrong was published",x+92,yy+72,{w:500,size:18,color:rgba(SOFT,0.95)});});});

/* ---------- 3. 7:59 am · Sam ---------- */
scene("sam",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  room(ctx,S,t,{top:"#0d162c"});camKeys(ctx,S,[[0,960,540,1.0],[sc.dur+1,940,530,1.05]],t);
  person(ctx,"sam",430,1225,1.42,{pose:"phone",expr:t<c("reply")?"concerned":"calm",t});
  glass(ctx,880,110,640,640,28,[170,205,255],{glow:16,ea:0.5,fill:"rgba(8,14,28,0.9)"});T(ctx,"Messages",912,160,{w:800,size:26});
  withA(ctx,1,()=>{glass(ctx,904,188,592,118,18,BAD,{glow:10,ea:0.7,fill:"rgba(40,10,14,0.6)"});led(ctx,928,214,12,12,BAD);T(ctx,"Test failed · 02:40",952,226,{w:800,size:22});
    T(ctx,"stg_enrolments · accepted_values",928,264,{w:500,size:19,f:"mono",color:rgba(INK,0.9)});T(ctx,"downstream skipped · last good data kept",928,292,{w:500,size:17,color:rgba(SOFT,0.95)});});
  msg(ctx,904,326,420,"Ana","Are these numbers safe to use?",BIZ,fin(t,0.6,0.4));
  msg(ctx,1036,478,460,"Sam → Ana","Yesterday's numbers are safe. Checking today's; back to you by 8:45.",TECH,fin(t,c("reply")+0.6,0.4),t>c("reply")-0.3?t:0);
  setScreen(ctx,S);clockChip(ctx,S,"7:59","",fin(t,0.2));
  withA(ctx,fin(t,c("trust")+0.3),()=>{tag(ctx,1700,300,"known: yesterday is safe",GOOD,{align:"center",size:21});tag(ctx,1700,370,"not yet: today",AMBER,{align:"center",size:21});});});

/* ---------- 4. Follow the thread ---------- */
// the lineage world: the steps that built the number on Ana's dashboard, from the dashboard back to bronze
function lineWorld(ctx,t,k,trayA){const y=540;
  ledFrame(ctx,1545,262,190,133,GOLDC,painting2("modern"),{glow:16});T(ctx,"94%",1640,236,{w:800,size:30,align:"center"});
  lineage(ctx,1640,y,350,{k,bad:true});tray(ctx,425,650,330,15,t,trayA);
  const d=Math.floor(k);if(k>0)glow(ctx,1640-Math.min(4,k)*350,y,60,BAD,0.2+0.1*Math.sin(t*3));}
scene("thread",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),T0=c("lineage");
  // the thread moves back one step at a time: to the data product, to the model that joins enrolments to classes, then to staging
  const k=t<c("steps")?0:t<c("staging")?ease(clamp((t-c("steps")-0.2)/1.4,0,1))+ease(clamp((t-c("steps")-2.9)/1.4,0,1)):2+ease(clamp((t-c("staging")-0.1)/1.4,0,1));
  // through the screen: over Sam's shoulder, the laptop turns to glass, and the camera passes through it
  const SR={x:760,y:250,w:560,h:315},u=ease(clamp((t-0.9)/2.0,0,1)),z1=W/SR.w;
  if(u<1){room(ctx,S,t,{top:"#0d162c"});const z=lerp(1,z1,u),cx=lerp(W/2,SR.x+SR.w/2,u),cy=lerp(H/2,SR.y+SR.h/2,u);ctx.setTransform(S*z,0,0,S*z,S*(W/2-cx*z),S*(H/2-cy*z));
    ctx.save();ctx.shadowColor="rgba(120,200,255,0.5)";ctx.shadowBlur=50;ctx.fillStyle="#0e1526";rr(ctx,SR.x-18,SR.y-18,SR.w+36,SR.h+36,14);ctx.fill();ctx.restore();
    ctx.save();rr(ctx,SR.x,SR.y,SR.w,SR.h,6);ctx.clip();ctx.translate(SR.x,SR.y);ctx.scale(SR.w/W,SR.h/H);bg2(ctx);lineWorld(ctx,t,0,0);ctx.restore();
    ctx.fillStyle="#1a2338";ctx.beginPath();ctx.moveTo(SR.x-50,SR.y+SR.h+18);ctx.lineTo(SR.x+SR.w+50,SR.y+SR.h+18);ctx.lineTo(SR.x+SR.w+90,SR.y+SR.h+44);ctx.lineTo(SR.x-90,SR.y+SR.h+44);ctx.closePath();ctx.fill();
    const zf=1+(z-1)*1.5;if(zf<3.2){ctx.setTransform(S*zf,0,0,S*zf,S*(W/2-cx*zf),S*(H/2-cy*zf));personBack(ctx,"sam",420,1745,2.3,{t});}
    return;}
  world(ctx,S);camKeys(ctx,S,[[2.9,960,540,1.0],[c("back"),1400,520,1.12],[c("steps"),1250,520,1.1],[c("steps")+1.8,1000,520,1.1],[c("staging"),700,540,1.12],[sc.dur+1,640,560,1.16]],t);
  lineWorld(ctx,t,k,fin(t,c("staging")+1.6));});

/* ---------- 5. The cause, in bronze ---------- */
const ROWS=[["S-2231","DS101","ENROLLED"],["S-4410","DS101","WAITLISTED"],["S-1187","DS101","ENROLLED"],["S-5092","DS101","WAITLISTED"],["S-3368","DS101","ENROLLED"],["S-6120","DS101","WAITLISTED"]];
scene("bronze",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  world(ctx,S);camKeys(ctx,S,[[0,640,560,1.16],[1.8,470,400,1.12],[c("new"),520,380,1.1],[sc.dur+1,540,390,1.08]],t);
  lineWorld(ctx,t,3+ease(clamp((t-0.2)/1.4,0,1)),1);
  // the rows in bronze, exactly as they arrived
  const a=fin(t,c("arrived")+0.6,0.8);withA(ctx,a,()=>{const x=0,y=40,w=548;glass(ctx,x,y,w,330,20,LAYER.bronze,{glow:16,ea:0.8,fill:"rgba(20,12,6,0.9)"});
    T(ctx,"bronze.enrolments",x+24,y+40,{w:700,size:20,f:"mono",color:rgba(LAYER.bronze,1)});["student","class","status"].forEach((h,i)=>T(ctx,h,x+24+i*170,y+78,{w:700,size:16,color:rgba(SOFT,0.9)}));
    ROWS.forEach((r,i)=>{const yy=y+112+i*36,wl=r[2]==="WAITLISTED",hi=wl?fin(t,c("new")+0.3+i*0.1):0;if(hi>0){ctx.fillStyle=rgba(AMBER,0.16*hi);rr(ctx,x+12,yy-24,w-24,32,8);ctx.fill();}
      r.forEach((v,j)=>T(ctx,v,x+24+j*170,yy,{w:600,size:19,f:"mono",color:wl&&j===2&&hi>0?rgba(AMBER,1):rgba(INK,0.9)}));});});
  withA(ctx,fin(t,c("new")+0.8),()=>tag(ctx,274,408,"15 in Data Science 101: WAITLISTED",AMBER,{align:"center",size:21}));
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
  ledFrame(ctx,1545,420,170,119,GOLDC,painting2("modern"),{glow:12});T(ctx,"and the people who use its numbers",1630,600,{w:500,size:16,align:"center",color:rgba(SOFT,0.95)});
  const e1=path([{x:450,y:300},{x:600,y:300},{x:750,y:190},{x:750,y:410}],BIZ,pA),e2=path([{x:450,y:700},{x:750,y:700}],TECH,pB);
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
    person(ctx,"sam",380,1225,1.38,{pose:t<c("mei")?"phone":"stand",expr:"concerned",t});
    const mA=fout(t,c("mei")-0.2,0.6);msg(ctx,780,170,560,"Sam → Ben","Did enrolments change last night?",TECH,fin(t,c("ask")+1.0,0.4)*mA,t>c("ask")+0.2&&t<c("mei")?t:0);
    msg(ctx,1240,330,560,"Ben","Yes, waitlists went live. It's in our release notes.",TECH,fin(t,c("ben")+0.2,0.4)*mA,t>c("ben")-0.6&&t<c("mei")?t:0);
    const cA=fin(t,c("mei")+0.2,0.8);withA(ctx,cA,()=>{callTile(ctx,"sam",780,150,480,300,{t,expr:"concerned"});callTile(ctx,"mei",1300,150,480,300,{t,hi:1});
      msg(ctx,1040,490,740,"Mei","Yes, we introduced waitlists, and we emailed every School.",BIZ,fin(t,c("mei")+1.6,0.4));});}
  // two weeks earlier
  if(fb>0){setScreen(ctx,S);withA(ctx,fb,()=>{bg2(ctx);ctx.save();camKeys(ctx,S,[[c("weeks")-0.4,960,500,1.02],[c("knew"),940,480,1.06]],t);campus(ctx,t,sc,c);ctx.restore();
    setScreen(ctx,S);clockChip(ctx,S,"two weeks earlier","",1);ctx.fillStyle="rgba(255,220,170,0.04)";ctx.fillRect(0,0,W,H);});}
  // the two halves meet: Ben knew what changed, Mei knew what it meant
  if(t>c("knew")-0.7){const p=fin(t,c("knew")-0.7,0.9),q=fin(t,c("question")-0.4,0.8),sk=fin(t,c("sketch")-0.4,0.9);
    if(sk<1)withA(ctx,p*(1-sk),()=>{setScreen(ctx,S);bg2(ctx);camKeys(ctx,S,[[c("knew"),960,520,1.0],[c("sketch"),960,520,1.04]],t);
      if(q<1)withA(ctx,1-q,()=>{callTile(ctx,"ben",140,170,440,300,{t,hi:1});callTile(ctx,"sam",740,420,440,300,{t});callTile(ctx,"mei",1340,170,440,300,{t,hi:1});
        const m=ease(clamp((t-c("knew")-0.2)/1.8,0,1));beam(ctx,[{x:580,y:320},{x:lerp(580,740,m),y:lerp(320,570,m)}],TECH,[[16,0.08],[6,0.2],[2.4,0.85],[1.2,1]]);beam(ctx,[{x:1340,y:320},{x:lerp(1340,1180,m),y:lerp(320,570,m)}],BIZ,[[16,0.08],[6,0.2],[2.4,0.85],[1.2,1]]);
        withA(ctx,fin(t,c("knew")+0.4),()=>tag(ctx,360,520,"knew what changed",TECH,{align:"center",size:21}));withA(ctx,fin(t,c("knew")+1.6),()=>tag(ctx,1560,520,"knew what it meant",BIZ,{align:"center",size:21}));
        withA(ctx,fin(t,c("knew")+3.2),()=>tag(ctx,960,780,"the numbers depend on it",SOFT,{align:"center",size:21}));});
      if(q>0)withA(ctx,q,()=>{callTile(ctx,"mei",160,200,560,360,{t,expr:t>c("decides")+0.5?"calm":"calm",hi:1});
        glass(ctx,820,220,940,300,24,BIZ,{glow:16,ea:0.8,fill:"rgba(12,16,30,0.92)"});T(ctx,"Is a waitlisted student enrolled?",860,290,{w:800,size:34});T(ctx,"a business question",860,334,{w:600,size:20,color:rgba(SOFT,0.95)});
        withA(ctx,fin(t,c("decides")+0.3),()=>{T(ctx,"No.",860,410,{w:800,size:40,color:rgba(BIZ,1)});T(ctx,"Enrolled means holding a seat on census date.",940,410,{w:600,size:26});T(ctx,"A waitlisted student doesn't hold one yet.",940,452,{w:500,size:22,color:rgba(SOFT,0.95)});});});});
    if(sk>0){setScreen(ctx,S);withA(ctx,sk,()=>{bg2(ctx);camKeys(ctx,S,[[c("sketch")-0.4,960,470,0.98],[sc.dur+1,960,470,1.06]],t);
      T(ctx,"The sketch · the conceptual model",960,170,{w:700,size:22,align:"center",color:rgba(SK,0.95)});sketch(ctx,960,360,1.25,{newA:fin(t,c("sketch")+0.9,1.0),glowNew:0.5+0.5*Math.sin(t*1.6)});});}}});

/* ---------- 7. The fix ---------- */
const CODE=[["models/staging/_stg.yml",1],["- name: status",0],["  tests:",0],["    - accepted_values:",0],["        values: [enrolled, withdrawn,",0],["                 waitlisted]",2],["",0],["models/marts/fct_class_fill.sql",1],["count(*) filter (",0],["  where status = 'enrolled')",0],["-- waitlisted doesn't hold a seat",3]];
scene("fix",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  world(ctx,S);camKeys(ctx,S,[[0,960,540,1.06],[sc.dur+1,980,530,1.0]],t);
  glass(ctx,120,140,1000,640,24,DBT,{glow:16,ea:0.7,fill:"rgba(10,12,22,0.94)"});chip(ctx,200,196,"dbt","one rule","",{edge:DBT});
  CODE.forEach(([s,kind],i)=>{const y=270+i*44,a=kind===2||kind===3?fin(t,c("small")+1.4+(kind===3?1.0:0)):1;if(kind===2&&a>0){ctx.fillStyle=rgba(GOOD,0.14*a);rr(ctx,150,y-30,940,40,8);ctx.fill();}
    withA(ctx,a,()=>T(ctx,(kind===2?"+ ":"  ")+s,160,y,{w:500,size:24,f:"mono",color:kind===1?rgba(SOFT,0.9):kind===2?rgba(GOOD,1):kind===3?rgba(AMBER,0.95):rgba(INK,0.95)}));});
  withA(ctx,fin(t,c("review")+0.2),()=>{glass(ctx,1200,150,600,150,22,GOOD,{glow:14,ea:0.8,fill:"rgba(10,26,20,0.9)"});led(ctx,1230,212,16,16,GOOD);T(ctx,"Review · approved",1264,226,{w:800,size:28});T(ctx,"by a colleague, like any code",1264,262,{w:500,size:19,color:rgba(SOFT,0.95)});});
  withA(ctx,fin(t,c("review")+1.8),()=>{glass(ctx,1200,330,600,300,22,[170,205,255],{glow:12,ea:0.6,fill:"rgba(8,14,28,0.92)"});T(ctx,"CI · tests on what changed",1230,378,{w:800,size:24});
    ["stg_enrolments","int_class_enrolments","fct_class_fill"].forEach((m,i)=>{const a=fin(t,c("review")+2.4+i*0.5);withA(ctx,a,()=>{led(ctx,1232,424+i*58,14,14,GOOD);T(ctx,m,1264,438+i*58,{w:600,size:22,f:"mono"});T(ctx,"pass",1770,438+i*58,{w:700,size:20,align:"right",color:rgba(GOOD,1)});});});});});

/* ---------- 8. Recover ---------- */
scene("recover",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  world(ctx,S);camKeys(ctx,S,[[0,960,520,1.0],[c("would")-0.4,980,520,1.0],[c("would")+1.4,960,1470,1.0],[sc.dur+1,990,1460,1.04]],t);
  const run=ease(clamp((t-c("rerun")-0.2)/2.0,0,1));platformRow(ctx,t,{skip:1-run,gate:GOOD,y:470,num:"96%"});
  if(run>0&&run<1){const x=lerp(900,1725,run);glow(ctx,x,470,80,GOOD,0.5);}
  const v=fin(t,c("versions")+0.4),ok=fin(t,c("confirm")+0.2);
  dashboard(ctx,480,1180,960,580,{num:v>0.5?"96%":"94%",banner:1-ok,ok,ghost:fin(t,c("would")+1.8)*fout(t,c("versions")-0.2),day:"Tuesday"});
  withA(ctx,v,()=>{[["version 41","yesterday 23:02","94%"],["version 42","today 08:31","96%"]].forEach(([n,w2,p],i)=>{const x=1480+i*22,y=1230+i*190;glass(ctx,x,y,400,160,18,[214,228,255],{glow:12,ea:0.7,fill:"rgba(10,16,32,0.9)"});
    T(ctx,n,x+24,y+44,{w:800,size:22,f:"mono"});T(ctx,w2,x+24,y+76,{w:500,size:18,color:rgba(SOFT,0.95)});T(ctx,p,x+376,y+128,{w:800,size:44,align:"right",color:i?rgba(GOOD,1):rgba(INK,0.9)});});
    T(ctx,"time travel",1680,1200,{w:700,size:20,align:"center",color:rgba(SOFT,0.95)});});
  withA(ctx,fin(t,c("believable")+0.4)*fout(t,c("versions")),()=>{tag(ctx,1650,1330,"a bigger room?",BAD,{align:"center",size:20});});
  withA(ctx,ok,()=>{callTile(ctx,"ana",60,1300,380,260,{t,expr:"relieved",hi:1});tag(ctx,250,1610,"9:00 · classes confirmed",GOOD,{align:"center",size:21});});
  setScreen(ctx,S);clockChip(ctx,S,t<c("confirm")?"8:3"+Math.min(9,Math.floor(t/3)):"8:40","",fin(t,0.2));});

/* ---------- 9. The contract ---------- */
scene("contract",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  world(ctx,S);camKeys(ctx,S,[[0,960,470,1.02],[sc.dur+1,960,470,1.0]],t);
  const tiles=[["mei",60,60],["ben",1460,60],["ana",60,560],["sam",1460,560]];
  tiles.forEach(([id,x,y],i)=>{const a=fin(t,0.3+i*0.35),sig=clamp((t-c("owners")-0.4)/2.0*4-i,0,1);withA(ctx,a,()=>callTile(ctx,id,x,y,400,240,{t,hi:sig>0.5,expr:t>c("checks")?"relieved":"calm"}));});
  withA(ctx,fin(t,c("meet")+0.6),()=>{T(ctx,"produce the data",960,56,{w:700,size:24,align:"center",color:rgba(SOFT,0.95)});T(ctx,"use the data",960,866,{w:700,size:24,align:"center",color:rgba(SOFT,0.95)});
    T(ctx,"business",260,334,{w:700,size:22,align:"center",color:rgba(BIZ,0.95)});T(ctx,"technical",1660,334,{w:700,size:22,align:"center",color:rgba(TECH,0.95)});});
  // the two paths from the flashback become one card
  const m=ease(clamp((t-c("agree")+0.2)/1.8,0,1));if(m>0&&m<1){beam(ctx,[{x:460,y:180},{x:lerp(460,760,m),y:lerp(180,300,m)}],BIZ,[[16,0.08],[6,0.2],[2.4,0.85],[1.2,1]]);beam(ctx,[{x:1460,y:180},{x:lerp(1460,1160,m),y:lerp(180,300,m)}],TECH,[[16,0.08],[6,0.2],[2.4,0.85],[1.2,1]]);}
  const cA=fin(t,c("agree")+1.2,0.8);withA(ctx,cA,()=>contract(ctx,560,120,800,560,{rows:clamp((t-c("says")-0.2)/3.2,0,1),sign:clamp((t-c("owners")-0.4)/2.0,0,1),glow:pulse(t,c("checks"),3)}));
  // checked all the time: at the platform's door on every load, and in the student system's tests on every proposed change
  withA(ctx,fin(t,c("checks")+1.2),()=>tag(ctx,960,740,"checked on every load, at the platform's door",[236,243,255],{align:"center",size:22}));
  withA(ctx,fin(t,c("checks")+2.8),()=>tag(ctx,960,800,"and on every proposed change, before it ships",TECH,{align:"center",size:22}));});

/* ---------- 10. Three weeks later ---------- */
scene("later",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  world(ctx,S);const mon=fin(t,c("monday")-0.3,0.9);camKeys(ctx,S,[[0,960,500,1.0],[sc.dur+1,960,500,1.04]],t);
  withA(ctx,1-mon,()=>{glass(ctx,80,150,820,560,24,TECH,{glow:14,ea:0.6,fill:"rgba(8,14,28,0.92)"});T(ctx,"Student system · test environment",112,204,{w:800,size:24});T(ctx,"a proposed release",112,238,{w:500,size:18,color:rgba(SOFT,0.95)});
    const p=ease(clamp((t-c("weeks")-0.6)/2.2,0,1)),am=t>c("amber")+0.4;glass(ctx,lerp(130,470,p),400,210,60,16,AMBER,{glow:12,ea:0.8,fill:"rgba(30,22,8,0.9)"});T(ctx,"DEFERRED",lerp(130,470,p)+105,438,{w:800,size:22,f:"mono",align:"center"});
    glass(ctx,720,320,110,220,18,am?AMBER:[236,243,255],{glow:am?22+10*Math.sin(t*3):10,ea:0.85,fill:"rgba(12,18,34,0.92)"});T(ctx,"contract",775,570,{w:700,size:17,align:"center"});T(ctx,"check",775,592,{w:700,size:17,align:"center"});
    withA(ctx,fin(t,c("amber")+0.8),()=>tag(ctx,490,640,"DEFERRED isn't in the contract yet",AMBER,{align:"center",size:21}));
    contract(ctx,980,150,860,560,{notice:am?0.6+0.4*Math.sin(t*4):0,deferred:t>c("define")+2.2,ver:t>c("define")+3.4?"1.1":"1.0",verFlash:pulse(t,c("define")+3.4,1.6)});
    withA(ctx,fin(t,c("define")+0.3)*fout(t,c("monday")-0.5),()=>msg(ctx,1080,720,720,"Mei","Deferred: starts in a later term. Not enrolled now.",BIZ,1));});
  withA(ctx,mon,()=>{dashboard(ctx,480,170,960,580,{num:"97%",ok:1,okText:"Up to date: Monday, 06:00",day:"Monday"});setScreen(ctx,S);clockChip(ctx,S,"Monday","",1);});
  setScreen(ctx,S);withA(ctx,1-mon,()=>clockChip(ctx,S,"three weeks later","",fin(t,0.2)));});

/* ---------- 11. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");
  world(ctx,S);camKeys(ctx,S,[[0,482,470,1.7],[5.5,960,520,0.94],[sc.dur+1,960,520,0.9]],t);
  platformRow(ctx,t,{door:1,gate:GOOD,y:470,num:"97%"});flowTiles(ctx,t,[{x:360,y:470},{x:470,y:470},{x:560,y:470}],0.5,1.2,0,sis,20,0.9);
  flowTiles(ctx,t,[{x:800,y:470},{x:900,y:470},{x:1000,y:470},{x:1240,y:470},{x:1300,y:470},{x:1540,y:470},{x:1600,y:470}],0.7,2.6,0,sis,16,0.8);
  // a hint of the next episode: another number, and its gauge starts to swing
  withA(ctx,fin(t,B+0.6),()=>{const x=1650,y=740,v=clamp((t-B-1.0)/2.2,0,1);ctx.save();ctx.translate(x,y);ctx.scale(1.8,1.8);ctx.translate(-x,-y);glass(ctx,x-140,y-60,280,120,18,[170,205,255],{glow:10,ea:0.5,fill:"rgba(8,14,28,0.9)"});T(ctx,"Applications",x,y-24,{w:700,size:18,align:"center",color:rgba(SOFT,0.95)});
    ctx.lineWidth=10;[[GOOD,Math.PI,Math.PI*1.45],[AMBER,Math.PI*1.45,Math.PI*1.72],[BAD,Math.PI*1.72,Math.PI*2]].forEach(([col,a0,a1])=>{ctx.strokeStyle=rgba(col,0.8);ctx.beginPath();ctx.arc(x,y+40,50,a0,a1);ctx.stroke();});
    const ang=Math.PI*(1.2+0.42*ease(v)+0.02*Math.sin(t*6)*v);ctx.strokeStyle="#fff";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y+40);ctx.lineTo(x+Math.cos(ang)*46,y+40+Math.sin(ang)*46);ctx.stroke();ctx.restore();});
  setScreen(ctx,S);withA(ctx,fin(t,c("tag")-0.2,0.8),()=>{T(ctx,"Seen by both sides, before it ships.",960,150,{w:800,size:50,align:"center"});T(ctx,"When things go wrong · Silent change",960,196,{w:600,size:22,align:"center",color:rgba(SOFT,0.95)});});});
