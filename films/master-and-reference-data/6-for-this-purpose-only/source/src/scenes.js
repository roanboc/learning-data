/* ===== For this purpose only: scenes ===== */

// the camera, as film 1 moves it (keys are [time, x, y, zoom], each move eased over d seconds), kept inside the place
function m6_focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z);x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// every scene's start and end: the place under the camera, and over it all, the paper
function m6_open(ctx,S,t,sc,place,keys,o){o=o||{};setScreen(ctx,S);ctx.save();const cam=m6_focus(ctx,t,keys,o.d||1.6);drift(ctx,t,sc,{z:o.z==null?0.018:o.z,x:o.dx||960,y:o.dy||560});
  if(place)m6_place(ctx,place);return cam;}
function m6_close(ctx,S){ctx.restore();setScreen(ctx,S);}

/* ---------- 1. What stays in the house ---------- */
const M6_BOOK=[960,500];
scene("house",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tBook=c("book"),tCS=w("book","Charaka Samhita"),tFire=c("fire"),tGave=w("fire","gave it"),tLine=c("line"),tPec=w("line","the peculiar"),
    tHome=c("home"),tHeal=w("home","to heal"),tStays=c("stays"),tPur=c("purpose");
  // the book, close up on its cloth, then the plain where it was taught; then, as the healer goes to a home, the village
  const cu=1-fin(t,tFire-1.0,1.2),dv=fin(t,tHome-1.9,1.4);
  if(cu<1&&dv<1){m6_open(ctx,S,t,sc,"ashram",[[0,960,540,1],[tFire+1.0,560,600,1.45],[tLine+0.2,600,590,1.3]]);
    // the teacher and the student, either side of the fire; the teacher gives the oath
    m6_altar(ctx,M6_ALTAR[0],M6_ALTAR[1]);m6_fire(ctx,M6_ALTAR[0],760,t,1);
    m6_old(ctx,"teacher",M6_TEACH[0],M6_TEACH[1],0.42,{pose:"stand",pose2:"give",mix:fin(t,tGave-0.2,0.9),turn:1.2,t});
    m6_old(ctx,"student",M6_STUD[0],M6_STUD[1],0.43,{pose:"listen",t});
    m6_close(ctx,S);}
  if(cu>0.01){setScreen(ctx,S);withA(ctx,cu,()=>{ctx.save();const z=1+0.03*(1-cu)+0.012*fin(t,0,8);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-960,-540);
    ctx.drawImage(m6_cloth(),0,0,W,H);m6_book(ctx,M6_BOOK[0],M6_BOOK[1],clamp((t-tBook-0.3)/2.2,0,1));
    arrive(ctx,960,722,t,tCS,()=>wc_tag(ctx,960,722,"Charaka Samhita",{align:"center"}),{dy:10});ctx.restore();});}
  if(dv>0)withA(ctx,dv,()=>{m6_open(ctx,S,t,sc,"village",[[0,640,560,1.14],[tStays-0.6,860,560,1.08],[tPur+0.6,960,540,1]]);
    const D=M6_DA,dc=D.x+D.w/2,tArr=tHeal-0.2,tw0=tHome-1.7,tOut=tStays-1.3,tW2=tStays+0.4,lit=fin(t,tArr-0.7,0.6),op=fin(t,tArr-0.7,0.8)*(1-fin(t,tStays+0.05,0.7)),
      inn=fin(t,tArr+0.4,0.5)*(1-fin(t,tOut-0.3,0.4));
    // the house's lamplit inside, its door, and its window
    m6_inside(ctx,D.x,D.y,D.w,D.h,t,lit,inn);m6_houseDoor(ctx,D,op,lit,t);m6_windowGlow(ctx,M6_WA,lit,t);
    // the house's purpose, gone by the time the title veils the street
    withA(ctx,1-fin(t,B+0.3,0.5),()=>arrive(ctx,dc,474,t,tHeal,()=>wc_tag(ctx,dc,474,"to heal",{align:"center",wash:WC_IND.health,washA:0.5}),{dy:8}));
    // the woman next door leans out to ask; he walks on, and she lowers her hand and goes back in before he passes
    const nb=fin(t,tStays+0.6,0.5)*(1-fin(t,tW2+2.0,0.6));
    m6_old(ctx,"neighbour",M6_DB.x+68+20*(1-nb),M6_DB.y,0.47,{a:nb,pose:"stand",pose2:"ask",mix:fin(t,tStays+0.9,0.5)*(1-fin(t,tW2+1.5,0.5)),turn:-1.3,tilt:-0.06,t});
    // the healer: along the street to the door, in, out again, and on along the street
    const sp=(dc+140)/(tArr-tw0);
    if(t<tArr){const x=lerp(-140,dc,clamp((t-tw0)/(tArr-tw0),0,1));if(t>tw0-0.2)m6_old(ctx,"healer",x,850,0.5,{walk:x/38,dir:1,t});}
    else if(t<tArr+0.6){const u=(t-tArr)/0.6;m6_old(ctx,"healer",dc,lerp(850,818,u),0.5*lerp(1,0.95,u),{a:1-u,turn:1.2,t});}
    else if(t>tOut&&t<tW2){const u=clamp((t-tOut)/0.5,0,1);m6_old(ctx,"healer",dc,lerp(818,850,ease(u)),0.5*lerp(0.95,1,u),{a:u,turn:1.2,t});}
    else if(t>=tW2){const x=dc+(t-tW2)*sp;if(x<2100)m6_old(ctx,"healer",x,850,0.5,{walk:x/38,dir:1,t});}
    m6_close(ctx,S);});
  // the line of the oath, on a leaf of its own; it stays while the plain gives way to the village
  const oa=fin(t,tLine-0.3,0.6)*(1-fin(t,tHome+0.4,0.7));
  if(oa>0.01){setScreen(ctx,S);withA(ctx,oa,()=>arrive(ctx,960,230,t,tLine-0.3,()=>m6_oath(ctx,960,226,clamp((t-tPec)/2.8,0,1),fin(t,tPec+3.0,0.5)),{dy:-20,d:0.9}));}
  wc_year(ctx,64,80,"about 2,000 years ago · India",fin(t,0.4,0.6)*(1-fin(t,B+0.2,0.5)));
  wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  wc_title(ctx,S,t,B+0.6,"For this purpose only","each role's purpose, and the person's wishes","Film 6 of 9 · master and reference data");});

/* ---------- shared by the chapters that follow ---------- */
// where something carried from place to place is at time t: keys are [time, x, y], each move eased over d seconds
function m6_route(t,keys,d){d=d||0.7;let x=keys[0][1],y=keys[0][2];for(let i=1;i<keys.length;i++){const u=ease(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);}return[x,y];}
// a request at a door: it bumps as it knocks (bump, 0 to 1), the door shaking on its latch with it
const m6_bump=(t,t0)=>Math.abs(m6_shake(t,t0));
function m6_req(ctx,x,y,s,col,bump,a){if(a!=null&&a<=0.01)return;withA(ctx,a==null?1:a,()=>{const k=1+0.07*(bump||0);ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.translate(-x,-y);
  m6_ask(ctx,x,y,s,col);ctx.restore();});}
// where a request stands at each of her doors, in front of the door's foot
const m6_atDoor=i=>[M6_RX[i]+(M6_RW-M6_DW)/2+M6_DW/2,490];
// the alumna's note, pinned to the foot of her record
const M6_NOTE=[1010,608,-0.04];
// Linh as the person and her four records, each with its door, as chapters 4, 5 and 10 draw them. o: ra, when each record arrives (none:
// it's there); tt, when each door's tags are written (none: they're there); open, shake and latch, each door's; note, the note's alpha on
// the alumna's record; list, when the list of purposes arrives (none: no list), and lit, its rings; fig, her figure's alpha; a, the cards'
function m6_doors(ctx,t,o){wc_white(ctx,"linh",M6_LP[0],M6_LP[1],M6_LP[2],m6_bands([1,1,1,1]),{a:o.fig==null?1:o.fig});
  withA(ctx,o.a==null?1:o.a,()=>{M6_ROLES.forEach(([role,title,what,tags,vals],i)=>{const [x,y]=m6_recAt(i),na=o.note==null?1:o.note,
      draw=()=>{m6_rec(ctx,t,x,y,role,title,what,{tags,vals,tt:o.tt?o.tt[i]:tags.map(()=>-9),open:o.open?o.open[i]:0,shake:o.shake?o.shake[i]:0,latch:o.latch?o.latch[i]:0});
        if(i===1&&na>0.01)withA(ctx,na,()=>m6_note(ctx,M6_NOTE[0],M6_NOTE[1],M6_NOTE[2]));};
      if(o.ra)arrive(ctx,x+M6_RW/2,y+M6_RH/2,t,o.ra[i],draw,{dy:16});else draw();});
    if(o.list!=null)arrive(ctx,M6_PL.x+M6_PL.w/2,M6_PL.y+M6_PL.h/2,t,o.list,()=>m6_purposes(ctx,o.lit),{dy:20});});}
// the rule, or what a picture adds up to, over the doors
const M6_TOP=[1165,58];

/* ---------- 2. An appeal ---------- */
// Owen, and where he stands
const M6_OW=[300,1004,0.95];
scene("appeal",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tAdv=w("today","Advancement"),tPlan=w("today","plans an appeal"),tTop=c("top"),tAsk=w("top","asks the registry"),tReg=w("top","the registry"),tYr=w("top","this year's"),
    tGiv=c("given"),tTeach=w("given","to teach them"),tNoth=w("goes","nothing in the data"),tList=w("goes","the list goes");
  // the camera holds the whole campus, so Owen, the appeal and the results stay in view; no drift, as the next chapter starts on this campus
  m6_open(ctx,S,t,sc,"campus",[[0,960,540,1]],{z:0});
  // Owen, edged in gold, and his card; he turns to explain as he asks
  arrive(ctx,M6_OW[0],M6_OW[1]-300,t,tAdv-0.5,()=>person(ctx,"owen",M6_OW[0],M6_OW[1],M6_OW[2],{pose:"stand",pose2:"explain",mix:fin(t,tAsk-0.3,0.6),expr:"calm",t}),{d:0.9,from:0.97});
  arrive(ctx,290,188,t,tTop,()=>wc_info(ctx,80,130,420,116,"Owen Price","Advancement",{mono:false}),{dy:12});
  // the appeal, and the request it types in, which goes to the student system's results
  const rq=m6_reqEnd(ctx);
  arrive(ctx,M6_AP.x+M6_AP.w/2,M6_AP.y+M6_AP.h/2,t,tPlan-0.2,()=>m6_appeal(ctx,{req:clamp((t-tAsk-0.1)/1.4,0,1)}),{dy:16});
  arrive(ctx,M6_RS.x+M6_RS.w/2,M6_RS.y+M6_RS.h/2,t,tReg-0.2,()=>m6_results(ctx,{}),{dy:16});
  wc_link(ctx,rq[0]+8,rq[1],M6_RS.x-10,M6_RS.y+M6_RS.h/2,M6_DONOR,{p:clamp((t-tYr-0.2)/0.8,0,1),a:0.85,lw:3.4});
  // what the results were given for, in a hand outside the data; the empty tag, where it isn't written, ringed
  const hp=clamp((t-tTeach+0.2)/1.4,0,1);if(hp>0)wc_hand(ctx,"given for teaching and awards",M6_RS.x+20,M6_RS.y+M6_RS.h+132,{p:hp,size:34,w:700,col:WC_ROLEINK.student});
  wc_ring(ctx,M6_RS.x+M6_RS.w-120,M6_RS.y+112,112,44,clamp((t-tNoth-0.1)/0.8,0,1),{seed:17});
  // the list leaves the results and settles on the appeal
  const lp=clamp((t-tList+0.1)/1.2,0,1);if(lp>0){const e=ease(lp),x=lerp(M6_RS.x+M6_RS.w/2,M6_AP.x+178,e),y=lerp(M6_RS.y+M6_RS.h-30,M6_AP.y+243,e)-Math.sin(lp*Math.PI)*110;
    withA(ctx,fin(t,tList-0.1,0.3),()=>m6_list(ctx,x,y));}
  m6_close(ctx,S);
  wc_year(ctx,64,80,"today · the university",fin(t,0.3,0.6));wc_paperOver(ctx,S);});

/* ---------- 3. A wish left behind ---------- */
// Linh on the campus path, her phone in her hand; where the email settles, beside it
const M6_L3=[360,1018,1.0],M6_E3=[520,600];
scene("wish",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tMon=c("month"),tEm=w("month","the appeal's email"),tGoes=w("month","goes to"),tRe=c("reaches"),tLinh=w("reaches","Linh"),tAs=w("reaches","as a student"),
    tSaid=c("said"),tGrad=w("said","graduated"),tAsk=w("said","not to ask"),tKept=c("kept"),tNev=w("kept","never heard"),tLk=c("linked"),tOne=w("linked","the wish was");
  m6_open(ctx,S,t,sc,"campus",[[0,960,540,1],[tSaid-0.4,1020,530,1.05],[tLk-0.4,980,540,1.02]]);
  // her two records, on the right: the student one as the email leaves it; the alumna one, and the note the alumni office pinned to it
  const [sx,sy,sw,sh]=M6_R3.student,[ax,ay,aw,ah]=M6_R3.alumna;
  arrive(ctx,sx+sw/2,sy+sh/2,t,tAs-0.4,()=>m6_rec3(ctx,"student"),{dy:16});
  arrive(ctx,ax+aw/2,ay+ah/2,t,tGrad-0.2,()=>m6_rec3(ctx,"alumna"),{dy:16});
  arrive(ctx,M6_N3[0],M6_N3[1],t,tAsk,()=>m6_note(ctx,M6_N3[0],M6_N3[1],M6_N3[2]),{dy:-26,d:0.8,from:0.9});
  // the email goes out to the faculty; it reaches her through her student record, and settles beside her phone, its trail fading
  const mv=ease(clamp((t-tLinh+0.2)/1.2,0,1)),ex=lerp(sx+10,M6_E3[0],mv),ey=lerp(sy,M6_E3[1],mv)-Math.sin(mv*Math.PI)*40;
  withA(ctx,fin(t,tAs-0.4,0.5)*(1-fin(t,tKept-0.6,0.8)),()=>wc_link(ctx,sx-8,sy+sh/2,ex+M6_EM.w+8,ey+40,M6_DONOR,{p:clamp((t-tLinh)/1.0,0,1),a:0.85,lw:3.4}));
  const to=t<tAs?"to: students and alumni":"to: Linh Nguyen, student",tp=t<tAs?clamp((t-tGoes)/0.9,0,1):clamp((t-tAs-0.1)/0.9,0,1);
  arrive(ctx,ex+M6_EM.w/2,ey+M6_EM.h/2,t,tEm-0.3,()=>m6_email(ctx,ex,ey,{to,tp}),{dy:16});
  // the student system never heard it: a pencil line from the note towards the student record, which stops at a red cross
  const nx=1626,ny0=M6_N3[1]-50,ny1=410;
  wc_pencil(ctx,[[nx,ny0],[nx+4,(ny0+ny1)/2],[nx,ny1]],clamp((t-tNev+0.1)/0.9,0,1),{lw:3,col:WC_PENCIL,seed:33,amp:0.8,dash:[10,9]});
  wc_cross(ctx,nx,ny1-22,40,WC_NO,clamp((t-tNev-0.8)/0.4,0,1));
  // linked now: a teal line joins the two records; but a pencil ring finds the note, still on the alumna's record
  wc_link(ctx,1320,sy+sh+8,1320,ay-8,WC_ROLE.student,{p:clamp((t-tLk-0.1)/0.7,0,1),a:0.9,lw:3.6,vertical:true});
  arrive(ctx,1296,385,t,tLk+0.5,()=>wc_tag(ctx,1296,385,"linked: one person",{align:"right",col:WC_ROLEINK.student}),{dy:8});
  wc_ring(ctx,M6_N3[0],M6_N3[1],166,74,clamp((t-tOne-0.1)/0.9,0,1),{seed:29});
  // Linh, reading the email on her phone
  arrive(ctx,M6_L3[0],M6_L3[1]-300,t,0.2,()=>person(ctx,"linh",M6_L3[0],M6_L3[1],M6_L3[2],{pose:"phone",expr:t>tLinh+0.9?"concerned":"calm",t}),{d:0.9,from:0.97});
  m6_close(ctx,S);
  wc_year(ctx,64,80,"today · the university",1);wc_paperOver(ctx,S);});

/* ---------- 4. What each role is for ---------- */
scene("purposes",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tEach=c("each"),tOath=w("each","its own oath"),tSt=c("student"),tAl=c("alumna"),tTu=c("tutor"),tRe=c("researcher"),
    tOne=w("list","one list"),tOwn=w("list","an owner"),tRule=c("rule"),tOnly=w("rule","only for"),tWr=w("rule","written on it"),tDoor=w("open","alumna's door"),tNo=w("open","and no other");
  // the camera settles on Linh and her records as they arrive; no drift, as the next chapter starts on the same picture
  m6_open(ctx,S,t,sc,"plain",[[0,1000,540,1.04],[tEach+0.4,960,540,1]],{z:0});
  // each door's purposes, written on it as they're named
  const tt=[[w("student","teaching"),w("student","awards")],[w("alumna","news"),w("alumna","events"),w("alumna","fundraising")],[w("tutor","employment")],[w("researcher","her project")]];
  // the appeal's request knocks at each door: the student's stays shut, the alumna's opens, the tutor's and the researcher's stay shut
  const kS=tWr+0.1,kA=tDoor,kT=tNo+0.45,kR=tNo+1.25;
  const ring=clamp((t-tOwn-0.1)/0.8,0,1),xs=M6_PL.x+30+tw(ctx,"purposes",30,800)+tw(ctx," · ",28,600),xe=M6_PL.x+30+tw(ctx,"purposes",30,800)+tw(ctx," · owner: privacy office · from Mar 2026",28,600);
  m6_doors(ctx,t,{fig:fin(t,0.2,0.8),ra:[0,1,2,3].map(i=>tOath+i*0.2),tt,open:[0,fin(t,kA+0.15,0.9),0,0],shake:[m6_shake(t,kS),0,m6_shake(t,kT),m6_shake(t,kR)],list:tOne-0.3});
  if(ring>0)wc_ring(ctx,(xs+xe)/2+6,M6_PL.y+40,(xe-xs)/2+2,32,ring,{seed:13});
  arrive(ctx,M6_TOP[0],M6_TOP[1],t,tOnly-0.2,()=>wc_tag(ctx,M6_TOP[0],M6_TOP[1],"only for a purpose written on it",{align:"center"}),{dy:8});
  const rq=m6_route(t,[[0,M6_LP[0],300],[kS-0.7,...m6_atDoor(0)],[kA-0.7,...m6_atDoor(1)],[kT-0.7,...m6_atDoor(2)],[kR-0.7,...m6_atDoor(3)]]);
  m6_req(ctx,rq[0],rq[1],"fundraising",M6_DONOR,m6_bump(t,kS)+m6_bump(t,kT)+m6_bump(t,kR),fin(t,tRule-0.3,0.5));
  // where it comes from, while it waits
  withA(ctx,fin(t,tRule-0.1,0.5)*(1-fin(t,kS-0.9,0.4)),()=>wc_T(ctx,"from the appeal",M6_LP[0],252,{w:600,size:28,align:"center",col:M6_DONORINK}));
  m6_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 5. Wishes on the person ---------- */
// where the note settles on her, and the small note that stays there once it's opened into its fields
const M6_ON=[208,612],M6_PIN=[286,640];
function m6_pinNote(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.drawImage(wc_kept("note6s",120,80,q=>{wc_wash(q,[[8,10],[110,6],[112,72],[10,74]],[255,240,180],{kind:"paper",lw:1.2,seed:9});
  q.fillStyle=rgba([200,70,60],0.9);q.beginPath();q.arc(60,16,5,0,TAU);q.fill();}),x-60,y-40,120,80);});}
// where the rail starts, at the note on her, and its progress at x along it
const M6_RAIL0=M6_PIN[0]+62,m6_railP=x=>(x-M6_RAIL0)/(m6_gap(3)-M6_RAIL0);
scene("wishes",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tOn=c("on"),tPers=w("on","on the person"),tData=c("data"),tF=[w("data","what she asked"),w("data","for which purpose"),w("data","when"),w("data","to whom"),w("data","how to change")],
    tCl=c("closes"),tAlD=w("closes","the alumna's door"),tHo=c("holds"),tWh=w("holds","wherever she appears"),tUnt=w("holds","until she changes");
  // the doors, as the last chapter left them; they step back while her wish's fields are written. No drift: the next chapter starts on the
  // same plain
  m6_open(ctx,S,t,sc,"plain",[[0,960,540,1]],{z:0});
  // the note lifts off her alumni record and settles on her; then it opens into its fields, and a small note stays pinned to her
  const fl=clamp((t-tOn-0.3)/1.3,0,1),op=clamp((t-tData+0.3)/0.8,0,1),e=ease(fl);
  // her no closes the alumna's door, and a latch from her wish holds it; then the rail reaches every one of her doors
  const kA=tAlD+1.1,dA=clamp((t-tCl-1.2)/0.4,0,1),dr=[0,1,2,3].map(i=>i===1?dA:clamp((t-tWh+0.6-[0,0,0.3,0.6][i]-(i===0?0:0))/0.4,0,1));
  const shut=fin(t,tAlD-0.1,0.8),lat=[0,1,2,3].map(i=>i===1?clamp((t-tAlD-0.4)/0.5,0,1):clamp((t-tWh+0.2-(i===0?0:i===2?0.3:0.6))/0.5,0,1));
  const hush=fin(t,tData-0.3,0.6)*(1-fin(t,tCl-0.5,0.6));
  m6_doors(ctx,t,{open:[0,1-shut,0,0],shake:[0,m6_shake(t,kA),0,0],latch:lat,note:fl>0?0:1,list:-9,a:1-0.6*hush});
  // the rule over the doors gives way to what her wish adds
  withA(ctx,1-fin(t,0.1,0.6),()=>wc_tag(ctx,M6_TOP[0],M6_TOP[1],"only for a purpose written on it",{align:"center"}));
  arrive(ctx,M6_TOP[0],M6_TOP[1],t,tWh+0.3,()=>wc_tag(ctx,M6_TOP[0],M6_TOP[1],"a no, wherever she appears",{align:"center"}),{dy:8});
  // the rail from the note on her, to the alumna's door first, then on to every door
  const rp=t<tHo?m6_railP(m6_gap(1))*clamp((t-tCl-0.1)/1.1,0,1):lerp(m6_railP(m6_gap(1)),1,clamp((t-tHo-0.1)/1.2,0,1));
  if(rp>0)m6_rail(ctx,M6_RAIL0,rp,dr);
  // the note, in flight and on her; opened, her wish's card, joined by a pencil line to the note that stays on her
  if(op<1&&fl>0){const x=lerp(M6_NOTE[0],M6_ON[0],e),y=lerp(M6_NOTE[1],M6_ON[1],e)-Math.sin(fl*Math.PI)*160,r=lerp(M6_NOTE[2],0.03,e);
    withA(ctx,1-op,()=>m6_note(ctx,x,y,r));}
  m6_pinNote(ctx,M6_PIN[0],M6_PIN[1],op);
  if(op>0){const W0=M6_WISH,k=lerp(M6_NW/W0.w,1,ease(op)),cx=lerp(M6_ON[0],W0.x+W0.w/2,ease(op)),cy=lerp(M6_ON[1],W0.y+W0.h/2,ease(op));
    wc_link(ctx,M6_PIN[0]+20,M6_PIN[1]-34,M6_PIN[0]+20,W0.y+W0.h+6,WC_PENCIL,{p:clamp((op-0.6)/0.4,0,1),a:0.7,vertical:true});
    withA(ctx,clamp(op*2,0,1),()=>{ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);ctx.translate(-(W0.x+W0.w/2),-(W0.y+W0.h/2));
      m6_wish(ctx,tF.map(t0=>clamp((t-t0+0.1)/0.7,0,1)));ctx.restore();});}
  // until she changes it: her settings
  m6_ring(ctx,M6_WISH.x+196,M6_WISH.y+238,176,30,clamp((t-tUnt)/0.8,0,1),{seed:31});
  // the appeal's request, at the researcher's door as the last chapter left it; it comes back to the alumna's, which is shut now
  const rq=m6_route(t,[[0,...m6_atDoor(3)],[tCl,...m6_atDoor(1)]],0.9);
  m6_req(ctx,rq[0],rq[1],"fundraising",M6_DONOR,m6_bump(t,kA),1-0.6*hush);
  m6_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 6. Written into the platform ---------- */
const M6_JUN=[214,1006,0.9],M6_YX=440,M6_CY=96,M6_PA=[440,70,710],M6_PB=[1170,70,710];
scene("platform",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tJun=w("tags","Jun writes"),tDbt=w("tags","in dbt"),tTag=w("tags","as a tag"),tTest=c("test"),tFails=w("test","fails"),tNoP=w("test","has no purpose"),
    tTwo=w("policy","two policies"),tRead=w("policy","read the tags"),tMask=c("mask"),tHides=w("mask","hides"),tTagged=w("mask","tagged for teaching"),
    tFil=c("filter"),tLeaves=w("filter","leaves out"),tOnce=c("once"),tEvery=w("once","every table");
  m6_open(ctx,S,t,sc,"plain",[[0,960,540,1]],{z:0});
  // Jun, edged in cyan, and his card
  arrive(ctx,M6_JUN[0],M6_JUN[1]-300,t,0.3,()=>person(ctx,"jun",M6_JUN[0],M6_JUN[1],M6_JUN[2],{pose:"stand",pose2:"explain",mix:fin(t,tDbt-0.4,0.6)*(1-fin(t,tTest-0.2,0.6)),expr:"calm",t}),{d:0.9,from:0.97});
  arrive(ctx,220,168,t,tJun,()=>wc_info(ctx,40,110,360,116,"Jun Park","analytics engineer",{mono:false}),{dy:12});
  // first, dbt: the model's columns and their purposes, and the test that no personal data goes without one
  const p1=1-fin(t,tTwo-0.3,0.5);
  if(p1>0.01)withA(ctx,p1,()=>{const fix=tNoP+0.6;
    const ps=M6_YAML.map((s,i)=>i===5?clamp((t-fix)/0.7,0,1):clamp((t-tDbt-0.1-(i>5?i-1:i)*0.32)/0.4,0,1));
    arrive(ctx,M6_YX+390,M6_CY+208,t,tDbt-0.4,()=>m6_code(ctx,M6_YX,M6_CY,780,"dbt · the model's YAML",M6_YAML,ps,{lit:[0,0,0,0,0,fin(t,fix+0.7,0.4),0,fin(t,tTag,0.5)]}),{dy:16});
    arrive(ctx,1250+315,M6_CY+116,t,tTest-0.2,()=>m6_test(ctx,1250,M6_CY,{fail:clamp((t-tFails)/1.2,0,1),pass:clamp((t-fix-0.8)/0.8,0,1)}),{dy:16});});
  // then Unity Catalog: two policies that read the tags; and the table as the appeals team sees it, its grades hidden, two rows left out
  const p2=fin(t,tTwo+0.1,0.6),tb=1-fin(t,tOnce-0.2,0.6);
  if(p2>0.01)withA(ctx,p2,()=>{
    const litA=[0,0,fin(t,tHides,0.4),fin(t,tHides+0.4,0.4),fin(t,tRead,0.4)*(1-0.6*fin(t,tFil,0.4)),fin(t,tRead,0.4)*(1-0.6*fin(t,tFil,0.4)),0];
    const litB=[0,0,fin(t,tLeaves-0.2,0.4),0,fin(t,tRead+0.3,0.4)*(1-0.6*fin(t,tHides,0.4)),fin(t,tRead+0.3,0.4)*(1-0.6*fin(t,tHides,0.4)),fin(t,tLeaves+0.3,0.4)];
    // each card types a line at a time, the second a little after the first
    const pa=M6_POLA.map((s,i)=>clamp((t-tTwo-0.3-i*0.2)/0.2,0,1)),pb=M6_POLB.map((s,i)=>clamp((t-tTwo-0.7-i*0.2)/0.2,0,1));
    arrive(ctx,M6_PA[0]+M6_PA[2]/2,M6_PA[1]+188,t,tTwo+0.1,()=>m6_code(ctx,M6_PA[0],M6_PA[1],M6_PA[2],"Unity Catalog · a column mask",M6_POLA,pa,{lit:litA,seed:31}),{dy:16});
    arrive(ctx,M6_PB[0]+M6_PB[2]/2,M6_PB[1]+188,t,tTwo+0.5,()=>m6_code(ctx,M6_PB[0],M6_PB[1],M6_PB[2],"Unity Catalog · a row filter",M6_POLB,pb,{lit:litB,seed:32}),{dy:16});
    if(tb>0.01)withA(ctx,tb,()=>arrive(ctx,M6_TB.x+M6_TB.w/2,M6_TB.y+200,t,tMask-0.2,()=>m6_table(ctx,{mask:clamp((t-tTagged)/0.8,0,1),gone:clamp((t-tLeaves-0.1)/1.8,0,1)}),{dy:20}));
    // every table with those tags follows them
    const ys=600;M6_TBLS.forEach((s,i)=>{const x=700+i*460,t0=tEvery-0.3+i*0.25;
      [M6_PA,M6_PB].forEach((P,k)=>wc_link(ctx,P[0]+P[2]/2+(k?-160:160),P[1]+376+8,x,ys-34,WC_SIDE.tech,{p:clamp((t-t0)/0.6,0,1),a:0.75,vertical:true}));
      arrive(ctx,x,ys,t,t0+0.3,()=>{const cw=Math.round(tw(ctx,s,30,800)+56);wc_chip(ctx,x-cw/2,ys-30,cw,60,WC_SIDE.tech,s,null,{seed:i+40});},{dy:10});});
    arrive(ctx,1160,724,t,tEvery+0.8,()=>wc_tag(ctx,1160,724,"every table with these tags",{align:"center"}),{dy:8});});
  m6_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 7. The appeal, again ---------- */
const M6_AX=[860,1480];
scene("again",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tNext=c("next"),tAlu=w("next","goes to alumni"),tAllow=w("next","as their role"),tSels=w("select","selects"),tOff=c("off"),tBec=w("off","because"),
    tSits=w("off","sits on the person"),tLinh=w("off","Linh is one"),tRes=c("results"),tStay=w("results","stay with teaching");
  m6_open(ctx,S,t,sc,"plain",[[0,960,540,1]]);
  // the appeal's count and its list: selected, those who said no taken off, and who it will ask
  arrive(ctx,M6_AC.x+M6_AC.w/2,M6_AC.y+M6_AC.h/2,t,tNext-0.2,()=>m6_count(ctx,clamp((t-tSels)/1.6,0,1),clamp((t-tOff)/0.5,0,1),clamp((t-tSits)/0.6,0,1)),{dy:16});
  const lh=78+M6_ANAMES.length*50;
  arrive(ctx,M6_AL.x+M6_AL.w/2,M6_AL.y+lh/2,t,tSels+0.3,()=>m6_alist(ctx,clamp((t-tBec)/1.2,0,1)),{dy:16});
  const nw=tw(ctx,"Linh Nguyen",28,600);wc_ring(ctx,M6_AL.x+30+nw/2,M6_AL.y+190,nw/2+30,32,clamp((t-tLinh)/0.8,0,1),{seed:23});
  // the alumni's details open to the appeal, as their role allows; the results, behind the student's door, stay shut
  const aOpen=fin(t,tAllow+0.2,0.9),kR=tStay+0.05;
  arrive(ctx,M6_AX[0]+M6_RW/2,M6_RY+M6_RH/2,t,tAlu-0.2,()=>m6_rec(ctx,t,M6_AX[0],M6_RY,"alumna","Alumni","details",{tags:["news","events","fundraising"],tt:[-9,-9,-9],open:aOpen,vals:["alumni","email · address"]}),{dy:16});
  arrive(ctx,M6_AX[1]+M6_RW/2,M6_RY+M6_RH/2,t,tRes-0.4,()=>m6_rec(ctx,t,M6_AX[1],M6_RY,"student","Results","student system",{tags:["teaching","awards"],tt:[-9,-9],shake:m6_shake(t,kR)}),{dy:16});
  const at=i=>[M6_AX[i]+(M6_RW-M6_DW)/2+M6_DW/2,490],rq=m6_route(t,[[0,760,490],[tAllow-0.9,...at(0)],[kR-0.7,...at(1)]]);
  m6_req(ctx,rq[0],rq[1],"fundraising",M6_DONOR,m6_bump(t,kR),fin(t,tAllow-0.9,0.4));
  m6_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 8. What do you hold about me? ---------- */
// Mei, and the person, in her office; the four offices that used to search, each its own system
const M6_MEI=[236,1010,0.95],M6_L8=[592,860,0.62],M6_OFF=[["registrar's office",640,262],["alumni office",1000,262],["HR",640,382],["research office",1000,382]];
// which of her bands each record's line leaves from: both student records from the student band, then the alumna, the tutor, the researcher
const M6_B8=[0,0,3,1,2];
scene("request",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tAsks=w("asks","asks the university"),tUsed=c("used"),tFour=w("used","four offices"),tNow=c("now"),tPers=w("now","the person"),tLinks=w("now","the links"),
    tSrc=c("source"),tFix=c("fix"),tOff=w("fix","the office"),tDays=c("days"),tFor=c("forget"),tKeep=w("forget","keep only"),tDeg=w("must","Her degree"),tProj=w("must","her project's data");
  // no camera move: Mei's card at the left and the answer at the right both stay in the frame
  m6_open(ctx,S,t,sc,"office",[[0,960,540,1]]);
  // Mei, edged in gold, and her card; she turns to the person as her office starts from it
  arrive(ctx,M6_MEI[0],M6_MEI[1]-300,t,-0.3,()=>person(ctx,"mei",M6_MEI[0],M6_MEI[1],M6_MEI[2],{pose:"stand",pose2:"explain",mix:fin(t,tNow-0.2,0.6)*(1-fin(t,tFor-0.4,0.6)),expr:"calm",t}),{d:0.8});
  arrive(ctx,220,154,t,0.6,()=>wc_info(ctx,40,100,360,108,"Mei Tanaka","registrar's office",{mono:false}),{dy:12});
  // her request, and later, when it was answered
  arrive(ctx,620+M6_RQW/2,149,t,tAsks-0.3,()=>{m6_request(ctx,620,90);const b=fin(t,w("days","ready in days")-0.1,0.5);
    if(b>0.01)withA(ctx,b,()=>{const bw=Math.round(tw(ctx,"answered 7 Nov",28,700)+28);wc_badge(ctx,620+M6_RQW-24-bw,184,"answered 7 Nov");});},{dy:16});
  // how it used to be: four offices, each searching its own system, dimmed, then gone
  const old=fin(t,tFour-0.3,0.5)*(1-fin(t,tNow-0.2,0.6));
  if(old>0.01)withA(ctx,0.62*old,()=>M6_OFF.forEach(([n,x,y],i)=>arrive(ctx,x+165,y+46,t,tFour-0.3+i*0.18,()=>m6_search(ctx,x,y,n,t+i),{dy:12})));
  // now: the person, and from her bands, a line to every record
  const fy=M6_L8[1],fs=M6_L8[2];wc_white(ctx,"linh",M6_L8[0],fy,fs,m6_bands([1,1,1,1]),{a:fin(t,tPers-0.2,0.7)});
  M6_R8.forEach((r,i)=>{const y=m6_r8y(i),t0=tLinks+i*0.22,by=wc_bandY("linh",fs,fy,M6_B8[i]);
    wc_link(ctx,M6_L8[0]+44,by,M6_R8X-8,y+52,WC_ROLE[r[0]],{p:clamp((t-t0)/0.6,0,1),a:0.85});
    arrive(ctx,M6_R8X+M6_R8W/2,y+52,t,t0+0.3,()=>{m6_rec8(ctx,i);},{dy:10});});
  // the answer: a section per role, each with where its values came from, and what they're for
  const ans=1-fin(t,tFor-0.3,0.6);
  if(ans>0.01)withA(ctx,ans,()=>arrive(ctx,M6_ANS.x+M6_ANS.w/2,M6_ANS.y+382,t,tSrc-0.3,()=>m6_answer(ctx,M6_AROWS.map((r,i)=>clamp((t-tSrc-0.2-i*0.55)/1.0,0,1))),{dy:16}));
  // a correction goes back to the office that keeps the value
  if(ans>0.01)withA(ctx,ans,()=>{const [ax,ay]=m6_ansAt(1),p=clamp((t-tOff+0.4)/0.8,0,1);if(p>0){const pts=[[ax-14,ay-8],[ax-60,ay+10],[M6_R8X+M6_R8W+30,m6_r8y(2)+30],[M6_R8X+M6_R8W+8,m6_r8y(2)+52]];
      wc_pencil(ctx,pts,p,{lw:3.4,col:WC_NO,seed:37,amp:0.6});if(p>0.95){ctx.save();ctx.strokeStyle=rgba(WC_NO,1);ctx.lineWidth=3.4;ctx.lineCap="round";const [hx,hy]=pts[3];
        ctx.beginPath();ctx.moveTo(hx+16,hy-12);ctx.lineTo(hx,hy);ctx.lineTo(hx+18,hy+8);ctx.stroke();ctx.restore();}}
    const ow=tw(ctx,"alumni office",28,600);wc_ring(ctx,M6_R8X+32+ow/2,m6_r8y(2)+86,ow/2+22,30,clamp((t-tOff)/0.8,0,1),{seed:19,col:WC_NO});});
  // if she asked to be forgotten: what each role would keep
  const kw=s=>{const [a,b]=s.split(" · ");return Math.round(tw(ctx,a,30,800)+tw(ctx," · "+b,28,600)+56);};
  M6_KEEP.forEach((s,i)=>{const [a,b]=s.split(" · "),y=m6_r8y(i)+52,t0=tKeep-0.2+i*0.22;arrive(ctx,M6_KX+300,y,t,t0,()=>wc_chip(ctx,M6_KX,y-28,kw(s),56,M6_R8[i][0],a,b,{seed:i+50}),{dy:10});});
  // her degree, and her project's data, ringed as they're named
  [[0,tDeg,41],[4,tProj,43]].forEach(([i,t0,sd])=>{const cw=kw(M6_KEEP[i]);wc_ring(ctx,M6_KX+cw/2,m6_r8y(i)+52,cw/2+18,38,clamp((t-t0)/0.8,0,1),{seed:sd});});
  m6_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 9. Elsewhere ---------- */
scene("elsewhere",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tE=c("every"),tShop=c("shop"),tDisc=w("shop","for discounts"),tCred=w("shop","who gets credit"),tHos=c("hospital"),tOne=w("hospital","one study"),
    tNext=c("next"),tAg=w("next","asks again");
  m6_open(ctx,S,t,sc,"plainB",[[0,960,540,1]]);
  const [X0,X1]=M6_PAN.map(p=>p[0]),RY=196,act=[fin(t,tShop-0.3,0.5)*(1-fin(t,tHos-0.3,0.5)),fin(t,tHos-0.3,0.5)],any=fin(t,tShop-0.3,0.5),pa=i=>1-0.55*any*(1-act[i]);
  M6_PAN.forEach(([x],i)=>withA(ctx,pa(i),()=>arrive(ctx,x+M6_PW/2,M6_PY+M6_PH/2,t,tE-0.2+i*0.25,()=>m6_panel(ctx,i),{dy:16})));
  // a shop: the loyalty card's data behind a door marked for discounts; a credit check asks, its request knocks, and the door stays shut
  const kC=tCred+0.5;
  withA(ctx,pa(0),()=>{arrive(ctx,X0+80+M6_RW/2,RY+M6_RH/2,t,tE+0.1,()=>m6_rec(ctx,t,X0+80,RY,null,"Loyalty card","what she buys",{col:WC_IND.retail,tags:["discounts"],tt:[tDisc],shake:m6_shake(t,kC),seed:61}),{dy:16});
    arrive(ctx,X0+480+M6_RW/2,RY+65,t,tCred-0.9,()=>m6_asker(ctx,X0+480,RY,"Credit check","who gets credit",WC_IND.bank),{dy:16});
    const at=[X0+80+(M6_RW-M6_DW)/2+M6_DW/2,RY+380],rq=m6_route(t,[[0,X0+480+M6_RW/2,RY+196],[kC-0.7,...at]]);
    m6_req(ctx,rq[0],rq[1],"credit",WC_IND.bank,m6_bump(t,kC),fin(t,tCred-0.6,0.4));});
  // a hospital: a patient's consent for study A; study B knocks, and stays shut; asked, a consent for study B, whose own door opens
  const kA=tNext+0.6,kB=tAg+1.3;
  withA(ctx,pa(1),()=>{arrive(ctx,X1+60+M6_RW/2,RY+M6_RH/2,t,tE+0.35,()=>m6_rec(ctx,t,X1+60,RY,null,"Consent","given for study A",{col:WC_IND.health,tags:["study A"],tt:[tOne],shake:m6_shake(t,kA),seed:62}),{dy:16});
    arrive(ctx,X1+470+M6_RW/2,RY+M6_RH/2,t,tAg,()=>m6_rec(ctx,t,X1+470,RY,null,"Consent","study B · asked",{col:WC_IND.health,tags:["study B"],tt:[tAg+0.5],open:fin(t,kB+0.15,0.9),vals:["the patient's","data, for B"],seed:63}),{dy:16});
    const atA=[X1+60+(M6_RW-M6_DW)/2+M6_DW/2,RY+380],atB=[X1+470+(M6_RW-M6_DW)/2+M6_DW/2,RY+380],rq=m6_route(t,[[0,X1+635,RY+380],[kA-0.7,...atA],[kB-0.7,...atB]]);
    m6_req(ctx,rq[0],rq[1],"study B",WC_ROLE.researcher,m6_bump(t,kA),fin(t,tNext-0.3,0.4));});
  m6_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 10. For this purpose only ---------- */
// where the last line is written, below her doors and clear of her, before it's carried up onto the end card
const M6_LASTY=716;
scene("only",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tHouse=c("house"),tKeeps=c("keeps"),tIn=w("keeps","inside its purpose"),tWish=w("keeps","Linh's wishes"),tLine=c("line");
  // the house from the opening, its door shut on its light; it gives way to Linh as the person, her four doors shut, each with its tags
  const dv=fin(t,tKeeps-0.9,1.2);
  if(dv<1){m6_open(ctx,S,t,sc,"village",[[0,820,560,1.1]],{z:0.03});const D=M6_DA;m6_inside(ctx,D.x,D.y,D.w,D.h,t,1,0);m6_houseDoor(ctx,D,0,1,t);m6_windowGlow(ctx,M6_WA,1,t);
    m6_close(ctx,S);}
  if(dv>0)withA(ctx,dv,()=>{m6_open(ctx,S,t,sc,"plain",[[0,960,540,1]]);
    // Linh and her doors come in once the house has gone, and step back for the last line
    const din=fin(t,tKeeps-0.2,0.7),rb=din*(1-0.6*fin(t,tLine-0.4,0.6));
    if(din>0.01){m6_doors(ctx,t,{a:rb,fig:din,note:0});withA(ctx,din,()=>m6_pinNote(ctx,M6_PIN[0],M6_PIN[1],1));
      wc_ring(ctx,M6_PIN[0],M6_PIN[1],78,54,clamp((t-tWish)/0.8,0,1)*rb,{seed:47});}
    m6_close(ctx,S);});
  wc_paperOver(ctx,S);
  // the line, then carried down onto the end card, above the veil, landing where the card's own line fades in and takes it over
  const KL="Data given for one role isn't free for every role.",kl=fin(t,tLine-0.1,0.6),ky=lerp(M6_LASTY,420,fin(t,B+0.3,1.1)),kg=kl*(1-fin(t,B+0.8,0.9));
  if(kg>0.01){setScreen(ctx,S);withA(ctx,kg,()=>{ctx.save();ctx.translate(960,ky-16);ctx.scale(1,0.2);const g=ctx.createRadialGradient(0,0,10,0,0,720);
    g.addColorStop(0,rgba(WC_PAPER,0.94));g.addColorStop(0.7,rgba(WC_PAPER,0.7));g.addColorStop(1,rgba(WC_PAPER,0));ctx.fillStyle=g;ctx.fillRect(-720,-720,1440,1440);ctx.restore();});}
  wc_end(ctx,S,t,B+0.8,"For this purpose only",KL,"Film 6 of 9");
  if(kl>0.01&&t<B+2.4){setScreen(ctx,S);withA(ctx,kl,()=>wc_T(ctx,KL,960,ky,{w:700,size:48,align:"center",col:WC_DARK}));}});
