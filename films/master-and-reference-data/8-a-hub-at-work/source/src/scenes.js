/* ===== A hub at work: scenes =====
   Eleven chapters, as in ../script.md: Monday morning in Mei's office, over her shoulder and into the hub on her monitor, with the
   weekend's 1,240 changes; how the rules sorted them, and Mei's inbox; Saturday, when Rafael's application looked for him first and
   waited instead of making a new number; the waterfall of weights behind 74; the AI helper's draft, which suggests; Mei's decision,
   kept, and undoable; the change published for each system to read, and the birth date the alumni office never sees; his record, with
   where each value came from; Friday's blind check of the week's automatic links, and the office's rule; five questions for any hub;
   and the end, on Friday evening.
   Drawn in watercolour (shared/src/wash.js), made to read on a phone (tools/legible.py): text is at least 28 px in the frame. The camera
   moves in on whatever the narration is about, and every shot drifts slowly; things arrive with a spring. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// the camera, as film 1 moves it (keys are [time, x, y, zoom], each move eased over d seconds, or over the key's own fifth value), kept
// inside the place
function m8_focus(ctx,t,keys,d){d=d||1.6;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/(keys[i][4]||d),0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z);x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// every scene's start and end: the place under the camera, and over it all, the paper
function m8_open(ctx,S,t,sc,place,keys,o){o=o||{};setScreen(ctx,S);ctx.save();const cam=m8_focus(ctx,t,keys,o.d);drift(ctx,t,sc,{z:o.z==null?0.018:o.z,x:o.dx||960,y:o.dy||560});
  if(place)m8_place(ctx,place);return cam;}
function m8_close(ctx,S){ctx.restore();setScreen(ctx,S);}
// the hub's screens, kept, for the monitor: Monday's before and after the rules land, the case Mei decides (Link pressed or not), the
// Friday check, and the week
const m8_shotHome=()=>m8_shot("home",q=>{m8_when(q,"Monday · 9:02");m8_weekendHead(q);});
const m8_shotRules=()=>m8_shot("rules",q=>{m8_when(q,"Monday · 9:02");m8_weekendHead(q);m8_rulesBox(q);});
const M8_CASE0={head:1,note:0,lines:[0,0,0,0,0,0],form:0,write:0,writeD:1,record:0,meaning:0,buttons:0,press:0};
const m8_shotCase=p=>m8_shot("case"+p,q=>{m8_when(q,"Monday · 9:14");m8_case(q,99,Object.assign({},M8_CASE0,{press:p}));});
const m8_shotCheck=()=>m8_shot("check",q=>{m8_when(q,"Friday · 15:10");m8_check(q,99,{sub:0,pair:0,hide:0,grid:0,fill:999,step:0,bad:999,unlink:999});});
const m8_shotWeek=()=>m8_shot("week",q=>{m8_when(q,"Friday · 17:30");m8_week(q);});

/* ---------- 1. Monday morning ---------- */
scene("monday",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tMei=w("monday","Mei,"),tOpen=w("monday","opens"),tRules=c("rules"),tR1=w("rules","its rules"),tR2=w("rules","which value"),tHub=c("hub"),
    tLF=w("lf","LakeFusion"),tDbx=w("lf","runs inside"),tAno=w("lf","Another hub"),tPush=sc.ends.lf+0.5,tN=w("weekend","twelve"),tChg=w("weekend","changes"),tFour=w("weekend","four systems");
  // the camera: over Mei's shoulder, closing in slowly; then into the monitor, until the hub's screen fills the frame exactly
  m8_open(ctx,S,t,sc,"office",[[0,960,540,1],[0.6,990,520,1.05,6],[tPush,M8_MCX,M8_MCY,M8_MZ,1.6]],{z:0});
  m8_hands(ctx,9,t/13);
  // the monitor lights as she opens the hub; the rules land on it
  const lit=fin(t,tOpen,0.6),land=tHub+0.2,fly=clamp((t-land)/1.0,0,1);
  m8_monitor(ctx,m8_shotHome(),lit);m8_monitor(ctx,m8_shotRules(),lit*fin(t,land+0.6,0.5));
  // once the screen fills the frame: the weekend's 1,240 changes, counted, and the four systems they came from
  if(t>tPush+1.6)m8_onMon(ctx,()=>{m8_count(ctx,ease(clamp((t-tN)/(tChg-tN+0.2),0,1)));
    M8_SRC.forEach((s,i)=>arrive(ctx,M8_SX+M8_SW/2,M8_SY[i]+M8_SH/2,t,tFour-0.3+i*0.15,()=>m8_source(ctx,i),{dy:14}));});
  m8_back(ctx,"mei",t);
  arrive(ctx,326,196,t,tMei-0.2,()=>withA(ctx,1-fin(t,tRules-0.3,0.5),()=>m8_name(ctx,96,140,460,"Mei Tanaka","steward of the person")),{dy:12});
  // the rules the series wrote: the room steps back while they're named; then they fly into the hub, and land as its rules
  const hush=fin(t,tRules+0.2,0.6)*(1-fin(t,land+0.4,0.7));m8_hush(ctx,0.5*hush);
  if(fly<1)[[tR1-0.2,250],[tR2-0.3,410]].forEach(([t0,y],i)=>{const cx=1216,cy=y+62,f=ease(fly),k=lerp(1,0.4,f);
    ctx.save();ctx.translate(lerp(cx,1201,f),lerp(cy,332,f));ctx.scale(k,k);ctx.translate(-cx,-cy);
    withA(ctx,1-f*f,()=>arrive(ctx,cx,cy,t,t0,()=>m8_ruleCard(ctx,cx-280,y,i),{dy:16}));ctx.restore();});
  // an example: LakeFusion, which runs inside Databricks; another hub would do; and the screens are drawn for this film
  withA(ctx,1-fin(t,tPush-0.3,0.35),()=>{
    arrive(ctx,1015,712,t,tLF-0.2,()=>wc_tag(ctx,1200,712,"an example: LakeFusion",{align:"right"}),{dy:10});
    arrive(ctx,1417,712,t,tDbx-0.1,()=>wc_tag(ctx,1232,712,"runs inside Databricks"),{dy:10});
    wc_hand(ctx,"or another hub",846,808,{p:clamp((t-tAno)/0.9,0,1),size:34,w:600,col:WC_INK});
    arrive(ctx,1358,794,t,tAno+0.6,()=>wc_tag(ctx,1602,794,"the screens: drawn for this film",{align:"right",size:28,w:600}),{dy:10});});
  m8_close(ctx,S);
  wc_year(ctx,64,80,"Monday · 9:00",fin(t,0.4,0.6)*(1-fin(t,tPush-0.4,0.4)));wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  wc_title(ctx,S,t,B+0.6,"A hub at work","rules act, AI suggests, people decide","Film 8 of 9 · master and reference data");});

/* ---------- 2. Rules act ---------- */
scene("rules",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tMost=c("most"),tKnown=c("known"),tNew=c("new"),tClose=c("close"),tMei=w("close","wait for Mei"),tFirst=c("first"),tWait=w("first","waiting on");
  // the camera: the whole screen; then right, to Mei's inbox
  m8_open(ctx,S,t,sc,"screen",[[0,960,540,1],[tFirst-0.3,1100,470,1.14]]);
  m8_when(ctx,"Monday · 9:02");m8_weekendHead(ctx);m8_count(ctx,1);for(let i=0;i<4;i++)m8_source(ctx,i);m8_rulesBox(ctx);
  // the changes go through the rules: nearly all to someone known, a few new, eight too close to call
  const win=[[tMost+0.1,tKnown+2.4],[tNew-1.3,tNew-0.3],[tClose-0.9,tClose+0.1]],ib=fin(t,tFirst-0.5,0.3);
  m8_dabs(ctx,t,win);
  [tMost+0.7,tNew-0.9,tClose-0.5].forEach((t0,j)=>arrive(ctx,M8_OX+M8_OW/2,M8_OY[j]+M8_OH/2,t,t0,()=>withA(ctx,1-ib,()=>{m8_outlet(ctx,j,m8_arrived(t,j,win));
    if(j===2)withA(ctx,fin(t,tMei-0.1,0.4),()=>wc_badge(ctx,M8_OX+30+tw(ctx,M8_OUT[2][0],30,700)+16,M8_OY[2]+40,"for Mei"));}),{dy:14}));
  // Mei's inbox comes over them: the eight, the first one waiting on an application
  arrive(ctx,M8_IB.x+M8_IB.w/2,M8_IB.y+M8_IB.h/2,t,tFirst-0.2,()=>m8_inbox(ctx,t,{rows:tFirst+0.2,ring:tWait}),{dy:24});
  m8_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 3. Waiting, not a new number ---------- */
scene("saturday",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tName=w("applied","Rafael"),tApplied=w("applied","applied"),tLinh=w("applied","like Linh"),tSearch=c("search"),tLook=w("search","searches"),
    tLikely=c("likely"),tNot=w("likely","but not"),tNum=w("waits","new student"),tMei=w("waits","waits for");
  m8_open(ctx,S,t,sc,"street",[[0,960,540,1]]);
  // Rafael, on the pavement, applying on his phone
  arrive(ctx,M8_RX,M8_RY-300,t,0.2,()=>person(ctx,"rafael",M8_RX,M8_RY,1.0,{pose:"phone",expr:"calm",t}),{d:0.9,from:0.97});
  arrive(ctx,280,196,t,tName-0.2,()=>m8_name(ctx,60,140,440,"Rafael Souza","graduated here, 2019"),{dy:12});
  wc_hand(ctx,"like Linh, last year",84,316,{p:clamp((t-tLinh)/0.9,0,1),size:30,w:600,col:WC_MUTED});
  // his application: first it looks for him; it finds a likely match, not a sure one; so it waits for Mei
  const sp=clamp((t-tSearch-0.2)/(tLook-tSearch+0.6),0,1),fd=fin(t,tLikely+0.2,0.5),wt=fin(t,tMei-0.1,0.5);
  arrive(ctx,M8_AP.x+M8_AP.w/2,M8_AP.y+150,t,tApplied-0.2,()=>m8_app(ctx,t,{search:sp,found:fd,wait:wt}),{dy:16});
  // what it finds: his records from his first degree, under the number he graduated with; likely him, scored 74
  arrive(ctx,1540,580,t,tLook+0.1,()=>m8_old(ctx,"student"),{dy:14});arrive(ctx,1540,728,t,tLook+0.25,()=>m8_old(ctx,"alumni"),{dy:14});
  const lk=clamp((t-tLikely-0.1)/0.8,0,1);if(lk>0)wc_link(ctx,1100,432,1240,580,M8_GOLDLINE,{p:lk,a:0.9,lw:3.4,dash:[8,8]});
  arrive(ctx,1170,506,t,tNot-0.1,()=>m8_score(ctx,1170,506,"74",{gold:true}),{dy:10});
  // the new number it doesn't make
  m8_noStamp(ctx,t,1660,282,tNum-0.3);
  m8_close(ctx,S);
  wc_year(ctx,64,80,"Saturday · 14:20",fin(t,0.3,0.6));wc_paperOver(ctx,S);});

/* ---------- 4. Why 74 ---------- */
scene("why",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tWhy=c("why"),t74=w("why","seventy"),tGiven=w("names","given"),tFam=w("names","family"),tDates=c("dates"),tApart=w("dates","one digit"),tLittle=w("dates","add a little"),
    tEmail=c("email"),tAway=w("email","takes"),tClosed=w("email","closed"),tBand=c("band"),tBandW=w("band","the band"),tFlip=c("flip"),tAgreed=w("flip","agreed"),tAsk=w("flip","without asking");
  m8_open(ctx,S,t,sc,"screen",[[0,960,540,1]]);m8_when(ctx,"Monday · 9:06");
  m8_wtable(ctx,t,{head:fin(t,tWhy-0.4,0.5),rows:[tGiven-0.4,tFam-0.4,tDates-0.1,tEmail-0.1]});
  m8_wchart(ctx,t,{frame:fin(t,tWhy+0.4,0.6),bars:[tGiven,tFam,tLittle-0.3,tAway],pill:t74-0.2,score:tBandW-0.3,flip:tAgreed-0.2});
  // the two birth dates, one digit apart; the student email, closed when he graduated
  withA(ctx,1-fin(t,tBand-0.3,0.6),()=>{wc_ring(ctx,M8_WC[1]+16,M8_WY[2],30,26,clamp((t-tApart)/0.6,0,1),{seed:11});wc_ring(ctx,M8_WC[2]+16,M8_WY[2],30,26,clamp((t-tApart-0.3)/0.6,0,1),{seed:13});
    wc_ring(ctx,M8_WC[2]+80,M8_WY[3],98,30,clamp((t-tClosed)/0.7,0,1),{seed:17});});
  // linked without asking anyone: the band where the rules link on their own
  wc_ring(ctx,(M8_WX(M8_Z90)+M8_WR)/2,M8_WT-37,108,50,clamp((t-tAsk)/0.8,0,1),{seed:19});
  m8_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 5. AI suggests ---------- */
scene("ai",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tNote=c("note"),tDraft=w("note","drafted"),tForm=c("form"),tWrote=w("form","he wrote"),tSame=c("same"),tMean=c("meaning"),tSug=c("suggests"),tDec=w("suggests","It doesn't");
  m8_open(ctx,S,t,sc,"screen",[[0,960,540,1]]);m8_when(ctx,"Monday · 9:10");
  m8_case(ctx,t,{head:1,note:tNote-0.4,lines:[tDraft-0.3,tDraft+0.5,tDraft+1.3,tSame+0.5,tSame+1.5,tSug+0.2],form:tForm-0.2,write:tWrote+0.2,writeD:2.6,
    record:tSame-0.2,meaning:tMean+0.2,buttons:tDec-0.2,press:0});
  m8_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 6. People decide ---------- */
scene("decide",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tLinks=c("links"),tLk=w("links","links them"),tWhy=w("links","writes"),tName=w("keeps","her name"),tTeach=c("teaches"),tUnl=w("undo","unlinking"),tVer=w("undo","every version");
  m8_open(ctx,S,t,sc,"office",[[0,960,540,1]]);m8_hands(ctx,9,14+t/12);
  // her monitor: the case, and the pointer, to Link; pressed, it lights gold
  m8_monitor(ctx,m8_shotCase(0),1);m8_monitor(ctx,m8_shotCase(1),fin(t,tLk,0.15));
  const mv=easeCam(clamp((t-tLinks+0.3)/1.1,0,1)),px=M8_MON.x+lerp(1460,1012,mv)*M8_MK,py=M8_MON.y+lerp(930,752,mv)*M8_MK,
    press=clamp((t-tLk+0.12)/0.12,0,1)*(1-clamp((t-tLk-0.1)/0.15,0,1));
  ctx.save();ctx.translate(px,py);ctx.scale(0.62,0.62);m8_cursor(ctx,0,0,fin(t,tLinks-0.6,0.3)*(1-fin(t,tLk+0.9,0.4)),press);ctx.restore();
  // the room steps back for her decision; she stays
  m8_hush(ctx,0.42*fin(t,tLk+0.3,0.6));m8_back(ctx,"mei",t);
  arrive(ctx,M8_DC.x+M8_DC.w/2,M8_DC.y+M8_DC.h/2,t,tLk+0.35,()=>m8_decision(ctx,t,{why:clamp((t-tWhy)/2.0,0,1),who:tName-0.2,undo:tUnl-0.3,vers:tVer-0.3}),{dy:20});
  // her decision teaches the helper
  const lp=clamp((t-tTeach-0.1)/0.8,0,1);if(lp>0)wc_link(ctx,M8_DC.x,M8_DC.y+170,M8_LRN.x+M8_LRN.w,M8_LRN.y+M8_LRN.h/2,M8_AIINK,{p:lp,a:0.9,lw:3,dash:[8,8]});
  arrive(ctx,M8_LRN.x+M8_LRN.w/2,M8_LRN.y+M8_LRN.h/2,t,tTeach+0.6,()=>m8_learns(ctx,t),{dy:12});
  m8_close(ctx,S);
  wc_year(ctx,64,80,"Monday · 9:14",fin(t,0.3,0.6));wc_paperOver(ctx,S);});

/* ---------- 7. Published, not pushed ---------- */
// a push, as the hub doesn't do it: a pencil arrow from the feed into a system, crossed out
function m8_push(ctx,x0,y0,x1,y1,p,q){if(p<=0)return;const x=lerp(x0,x1,ease(p)),y=lerp(y0,y1,ease(p)),a=Math.atan2(y1-y0,x1-x0);ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.85);ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x,y);ctx.stroke();if(p>0.6){ctx.beginPath();ctx.moveTo(x-Math.cos(a-0.5)*18,y-Math.sin(a-0.5)*18);ctx.lineTo(x,y);ctx.lineTo(x-Math.cos(a+0.5)*18,y-Math.sin(a+0.5)*18);ctx.stroke();}ctx.restore();
  wc_cross(ctx,lerp(x0,x1,0.45),lerp(y0,y1,0.45),40,WC_NO,q);}
const M8_INVITE="Invite: come back for a master's";
scene("publish",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tPub=w("published","published"),tNot=w("published","not pushed"),tEach=w("published","each system"),tReads=w("published","reads"),tOld=w("app","old number"),tDeg=w("app","degree"),
    tStop=w("alumni","stops"),tNever=w("mask","never sees"),tNeed=w("mask","doesn't need");
  m8_open(ctx,S,t,sc,"plain",[[0,960,540,1]]);
  // the four systems, and the feed the hub publishes, his change at the top
  ["student","alumni","hr","research"].forEach((k,i)=>{const [x,y,ww,hh]=M8_SYSB[k];arrive(ctx,x+ww/2,y+hh/2,t,0.4+i*0.12,()=>m8_sys(ctx,k),{dy:14});});
  m8_feed(ctx,t,{head:0.3,top:tPub-0.1});
  // not pushed: his change isn't written into the systems it concerns
  withA(ctx,1-fin(t,tEach+0.3,0.4),()=>{const p=clamp((t-tNot+0.25)/0.4,0,1),q=clamp((t-tNot-0.2)/0.35,0,1);
    m8_push(ctx,730,304,470,330,p,q);m8_push(ctx,1190,304,1450,360,p,q);});
  // each system reads what concerns it: a dotted line from each to its rows of the feed. HR reads only its own; nothing is for the research office
  [["student",680,304,740,304,1],["alumni",1240,304,1180,304,1],["student",680,396,740,384,0],["alumni",1240,440,1180,464,0],["hr",680,600,740,544,0]].forEach(([k,x0,y0,x1,y1,his],i)=>
    wc_link(ctx,x0,y0,x1,y1,WC_ROLE[M8_SYS[k][1]],{p:clamp((t-tReads-i*0.12)/0.6,0,1),a:his?0.9:0.6,lw:his?3.4:2.6}));
  withA(ctx,fin(t,tReads+0.9,0.5),()=>{wc_T(ctx,"nothing about him",92,664,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"nothing for us",1272,664,{w:600,size:28,col:WC_MUTED});});
  // the student system: his application goes on under his old number, his degree already on file
  [["his application: S-16352",tOld-0.2],["no new number",tOld+0.5],["his degree: already on file",tDeg]].forEach(([s,t0],i)=>m8_read(ctx,92,250+i*54,s,clamp((t-t0)/0.9,0,1),WC_ROLEINK.student));
  // the alumni office stops inviting him back, and never sees his birth date
  const sk=clamp((t-tStop)/0.5,0,1);withA(ctx,fin(t,1.6,0.5)*(1-0.45*sk),()=>wc_T(ctx,M8_INVITE,1272,250,{w:600,size:28,col:WC_INK}));
  if(sk>0){ctx.save();ctx.strokeStyle=rgba(WC_NO,0.9);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(1266,241);ctx.lineTo(1266+(tw(ctx,M8_INVITE,28,600)+12)*ease(sk),241);ctx.stroke();ctx.restore();}
  m8_read(ctx,1272,304,"he's applying",clamp((t-tStop-0.4)/0.9,0,1),WC_ROLEINK.alumna);
  withA(ctx,fin(t,tNever-0.3,0.5),()=>{wc_T(ctx,"birth date",1272,410,{w:600,size:28,col:WC_MUTED});m8_masked(ctx,1430,400,220,1);});
  arrive(ctx,1550,512,t,tNeed-0.1,()=>wc_tag(ctx,1550,512,"a column mask, in Unity Catalog",{align:"center",size:28,w:600}),{dy:10});
  m8_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 8. Where it came from ---------- */
scene("source",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tWhere=c("where"),tCame=w("where","came from"),tSys=w("names","student system"),tChk=w("names","checked"),tEmail=c("email"),tApp=w("email","application"),tNewest=w("email","newest"),
    tStays=w("typo","stays"),tWin=w("typo","doesn't win");
  m8_open(ctx,S,t,sc,"plain",[[0,960,540,1]]);
  // Rafael, as the person: an alumnus, and now an applicant too; his record beside him
  wc_white(ctx,"rafael",M8_FIG[0],M8_FIG[1],M8_FIG[2],[{col:WC_ROLE.alumna},{col:WC_ROLE.applicant}],{a:fin(t,0.2,0.8)});
  const P=M8_PR,lk=clamp((t-0.9)/0.8,0,1);if(lk>0)wc_link(ctx,M8_FIG[0]+70,wc_bandY("rafael",M8_FIG[2],M8_FIG[1],0),P.x-6,P.y+130,WC_PENCIL,{p:lk,a:0.7});
  arrive(ctx,P.x+P.w/2,P.y+P.h/2,t,0.4,()=>{wc_panel(ctx,P.x,P.y,P.w,P.h,{kind:"card",seed:160});
    wc_T(ctx,"Rafael Souza",P.x+36,P.y+64,{w:800,size:36,col:WC_DARK});wc_badge(ctx,P.x+36+tw(ctx,"Rafael Souza",36,800)+18,P.y+52,"the person");},{dy:16});
  withA(ctx,fin(t,tCame-0.3,0.5),()=>wc_T(ctx,"came from",P.x+600,P.y+64,{w:600,size:28,col:WC_MUTED}));
  // each value, and where it came from: his names and his birth date from the student system, checked when he enrolled; his email from
  // the application, the newest he's confirmed; the runners-up kept, but not chosen
  [[tWhere+0.4,tSys-0.2],[tWhere+0.55,tSys],[tWhere+0.7,tSys+0.2],[tStays-0.2,tStays,tWin],[tEmail+0.1,tApp-0.1],[tNewest+0.2,tNewest+0.4,tNewest+0.7]].forEach(([tv,ts,tl],i)=>
    m8_val(ctx,i,{v:fin(t,tv,0.5),s:fin(t,ts,0.4),l:tl==null?0:fin(t,tl,0.4)}));
  // checked when he first enrolled
  const cw=tw(ctx,M8_VAL[2][3],28,700)+44;wc_ring(ctx,P.x+600+cw/2,M8_VY[2],cw/2+16,36,clamp((t-tChk)/0.7,0,1),{seed:21});
  m8_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 9. Checking the checkers ---------- */
scene("friday",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tLeila=w("friday","Leila"),tChecks=w("friday","checks fifty"),tMostly=w("friday","mostly"),tBlind=c("blind"),tPair=w("blind","each pair"),tNotW=w("blind","but not"),tSway=w("blind","so she"),
    tOne=w("wrong","one was"),tUnl=w("wrong","Mei unlinks"),tStop=c("stop"),tMore=w("stop","more than"),tAuto=w("stop","automatic"),tEvery=w("until","Every match"),tUnt=w("until","until new");
  m8_open(ctx,S,t,sc,"friday",[[0,960,540,1]]);m8_hands(ctx,15,10+t/12);
  // Leila's monitor; the check comes out of it, at a size to read
  m8_monitor(ctx,m8_shotCheck(),1);m8_hush(ctx,0.4*fin(t,tChecks-0.4,0.6));m8_back(ctx,"leila",t);
  arrive(ctx,320,196,t,tLeila-0.2,()=>withA(ctx,1-fin(t,tBlind-0.6,0.6),()=>m8_name(ctx,60,140,520,"Leila Haddad","a steward, admissions office")),{dy:12});
  // fifty of the week's automatic links, checked blind; one was wrong, and Mei unlinks it
  const rl=fin(t,tStop-0.1,0.6);
  arrive(ctx,M8_GC.x+M8_GC.w/2,M8_GC.y+M8_GC.h/2,t,tChecks-0.3,()=>withA(ctx,1-rl,()=>m8_check(ctx,t,{sub:tMostly-0.2,grid:tChecks+0.2,pair:tPair-0.2,hide:tNotW-0.1,fill:tSway,step:0.05,bad:tOne,unlink:tUnl})),{dy:20});
  // the office's rule, and this week's result
  if(rl>0.01)withA(ctx,rl,()=>m8_rule(ctx,t,{l1:tMore-0.3,l2:tAuto,l3:tEvery-0.2,l4:tUnt-0.1,week:sc.ends.until+0.4}));
  m8_close(ctx,S);
  wc_year(ctx,64,80,"Friday · 15:10",fin(t,0.3,0.6));wc_paperOver(ctx,S);});

/* ---------- 10. Five questions ---------- */
scene("five",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tAsk=c("ask"),tFive=w("ask","five questions"),tq=M8_Q.map(([k])=>c(k)),
    inds=[["uni","a university",w("ask","a university")],["health","a hospital",w("ask","a hospital")],["bank","a bank",w("ask","a bank")]];
  m8_open(ctx,S,t,sc,"plain",[[0,960,540,1]]);
  const Q=M8_QS;arrive(ctx,Q.x+Q.w/2,Q.y+Q.h/2,t,tAsk-0.5,()=>{wc_panel(ctx,Q.x,Q.y,Q.w,Q.h,{kind:"sheet",seed:170});
    wc_T(ctx,"Whatever the hub",Q.x+80,Q.y+92,{w:800,size:40,col:WC_DARK});},{dy:20,d:0.9});
  // where: a university, a hospital, a bank
  let x=Q.x+80;inds.forEach(([k,s,t0])=>{const x0=x,ww=Math.round(tw(ctx,s,28,700)+48);arrive(ctx,x0+ww/2,Q.y+160,t,t0-0.15,()=>m8_ind(ctx,x0,Q.y+160,k,s),{dy:8});x+=ww+18;});
  withA(ctx,fin(t,tFive-0.2,0.5),()=>wc_T(ctx,"five questions to ask it",x+12,Q.y+170,{w:600,size:28,col:WC_MUTED}));
  // five numbered places as soon as there are five questions; each fills in as it's asked, with its mark from the film: the waterfall,
  // unlink, the eye that checks, the hidden field, the feed
  M8_Q.forEach(([k,s],i)=>{const y=M8_QY[i];withA(ctx,fin(t,tFive+i*0.12,0.4),()=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.22);ctx.lineWidth=1.5;ctx.beginPath();
      ctx.moveTo(Q.x+80,y+38);ctx.lineTo(Q.x+Q.w-80,y+38);ctx.stroke();ctx.restore();wc_T(ctx,String(i+1),Q.x+100,y,{w:500,size:30,f:"mono",align:"center",col:WC_MUTED});});
    arrive(ctx,960,y,t,tq[i]-0.2,()=>{m8_icon(ctx,k,Q.x+170,y-12,1.1,WC_INK);wc_T(ctx,s,Q.x+226,y,{w:600,size:38,col:WC_DARK});},{dy:10});});
  m8_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 11. Explained and undone ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tThree=c("three"),tR=w("three","Rules"),tA=w("three","AI"),tP=w("three","People"),tEnd=c("end");
  // Mei's office on Friday evening: the week done, nothing waiting
  m8_open(ctx,S,t,sc,"eve",[[0,960,540,1],[0.2,1000,500,1.06,8]],{z:0});m8_hands(ctx,17,30+t/14);
  m8_monitor(ctx,m8_shotWeek(),1);m8_back(ctx,"mei",t);m8_hush(ctx,0.62*fin(t,tThree-0.3,0.6));
  // rules act; AI suggests; people decide: in a row over her screen, beside her
  const PW=[0,1,2].map(i=>m8_partW(ctx,i)),gap=28;let px=M8_MCX-(PW[0]+PW[1]+PW[2]+2*gap)/2;
  withA(ctx,1-fin(t,B+0.2,0.6),()=>[tR,tA,tP].forEach((t0,i)=>{const x=px+PW[i]/2;px+=PW[i]+gap;arrive(ctx,x,300,t,t0-0.1,()=>m8_part(ctx,x,300,i),{dy:12});}));
  m8_close(ctx,S);
  wc_year(ctx,64,80,"Friday · 17:30",fin(t,0.3,0.6)*(1-fin(t,tThree-0.3,0.5)));wc_paperOver(ctx,S);
  // the line, then carried up onto the end card, above the veil, landing where the card's own line fades in and takes it over
  const KL="Everything can be explained and undone.",kl=fin(t,tEnd-0.1,0.6),kc=fin(t,B+0.7,1.1),kx=lerp(1190,960,kc),ky=lerp(470,420,kc),kg=kl*(1-fin(t,B+0.8,0.9));
  if(kg>0.01){setScreen(ctx,S);withA(ctx,kg,()=>{ctx.save();ctx.translate(kx,ky-16);ctx.scale(1,0.1);const g=ctx.createRadialGradient(0,0,10,0,0,640);
    g.addColorStop(0,rgba(WC_PAPER,0.94));g.addColorStop(0.7,rgba(WC_PAPER,0.7));g.addColorStop(1,rgba(WC_PAPER,0));ctx.fillStyle=g;ctx.fillRect(-640,-640,1280,1280);ctx.restore();});}
  wc_end(ctx,S,t,B+0.8,"A hub at work",KL,"Film 8 of 9");
  if(kl>0.01&&t<B+2.4){setScreen(ctx,S);withA(ctx,kl,()=>wc_T(ctx,KL,kx,ky,{w:700,size:48,align:"center",col:WC_DARK}));}});
