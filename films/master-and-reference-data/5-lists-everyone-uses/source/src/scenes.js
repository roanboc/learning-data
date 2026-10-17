/* ===== Lists everyone uses: scenes =====
   Eleven chapters, as in ../script.md: two bag tags at an airport, whose codes outlive their reasons; Linh's tutor role under three
   names, HR's role list in a spreadsheet, and no list of the kinds of identifier; her status and her country typed again, and a count that
   splits her country three ways; reference data, the university's own and from outside, each value a code and a label; Jun gives five
   lists one home each, with an owner and a date, and each system's names mapped; the tests read the list instead of typing it, and the
   platform shows who reads it; a new name for her role, as a pull request HR approves, from 1 January, the old one ended; countries from
   the international standard, copied, so Viet Nam appears once; lists about people kept short and asked with a purpose; a bank's and a
   hospital's lists; and Linh again, every value from one list, with an owner and a date.
   Drawn in watercolour (shared/src/wash.js), made to read on a phone (tools/legible.py): text is at least 28 px in the frame. The camera
   moves in on whatever the narration is about, and every shot drifts slowly; things arrive with a spring. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// the camera, as film 1 moves it (keys are [time, x, y, zoom], each move eased over d seconds), kept inside the place
function m5_focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z);x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// every scene's start and end: the place under the camera, and over it all, the paper
function m5_open(ctx,S,t,sc,place,keys,o){o=o||{};setScreen(ctx,S);ctx.save();const cam=m5_focus(ctx,t,keys,o.d||1.6);drift(ctx,t,sc,{z:o.z==null?0.018:o.z,x:o.dx||960,y:o.dy||560});
  if(place)m5_place(ctx,place);return cam;}
function m5_close(ctx,S){ctx.restore();setScreen(ctx,S);}

/* ---------- 1. A code outlives its reason ---------- */
// where each tag hangs: from its case's handle
const M5_HA=[M5_CASE_A[0]+M5_CASE_A[2]*0.14,M5_CASE_A[1]-M5_CASE_A[3]-50],M5_HB=[M5_CASE_B[0]+M5_CASE_B[2]*0.14,M5_CASE_B[1]-M5_CASE_B[3]-50];
scene("codes",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const t3=c("three"),tLet=w("three","three letters"),tY=c("yyz"),tYc=w("yyz","YYZ"),tMal=w("yyz","station code"),tS=c("sgn"),tSc=w("sgn","SGN"),tTook=w("sgn","took"),
    tNine=w("sgn","nineteen"),tSays=w("sgn","still says"),tO=c("outlives"),tRea=w("outlives","its reason"),tCost=w("outlives","costs");
  // the camera: the terminal; in on Toronto's tag; across to Ho Chi Minh City's; back out for everyone who reads them
  m5_open(ctx,S,t,sc,"terminal",[[0,960,540,1],[tY-0.3,662,600,1.45],[tS-0.3,1258,600,1.45],[tO-0.3,960,540,1]]);
  // a plane taxis along the runway, behind the window's frame
  m5_plane(ctx,lerp(1540,1880,clamp(t/32,0,1)),620,0.42,fin(t,0.4,1.0));m5_termFrame(ctx);
  // the two cases, and their tags, which swing in as airports are named
  const [ax,ay]=M5_HA,[bx,by]=M5_HB;m5_case(ctx,M5_CASE_A);m5_case(ctx,M5_CASE_B);
  // the reasons: Malton's old station code, and the city's old name, which fade as the codes outlive them
  const why=fin(t,tRea-0.2,0.8),gone=fin(t,B-0.4,0.8);
  m5_tag(ctx,t,ax,ay,"YYZ","Toronto",t3+0.3,{ring:clamp((t-tMal-0.3)/0.7,0,1)*(1-gone),ringDx:33,ringRx:74,seed:13});
  m5_tag(ctx,t,bx,by,"SGN","Ho Chi Minh City",t3+0.8,{ring:clamp((t-tSays)/0.7,0,1)*(1-gone),ringRx:116,seed:17});
  withA(ctx,(1-0.65*why)*(1-gone),()=>{
    arrive(ctx,250,452,t,tMal-0.4,()=>{wc_panel(ctx,70,380,360,150,{kind:"card",seed:5});m5_note(ctx,t,"Malton's old",100,438,tMal-0.2,0.7);m5_note(ctx,t,"station code: YZ",100,490,tMal+0.4,0.9);},{dy:12});
    m5_rename(ctx,t,1496,300,tTook-0.3,tNine,tNine+0.5);
    // the code still says Saigon: a pencil line from it to the old name
    wc_link(ctx,bx+122,by+198,1520,352,WC_PENCIL,{p:clamp((t-tSays-0.3)/0.7,0,1),a:0.7});});
  // everyone who reads the code: they arrive round the top as changing it is said to cost them, each joined to both tags
  M5_USERS.forEach(([s,x,y],i)=>{const t0=tCost-0.2+i*0.22;withA(ctx,1-0.35*gone,()=>{
    [[ax,ay+56],[bx,by+56]].forEach(([hx,hy],j)=>wc_link(ctx,x,y+28,hx,hy,WC_PENCIL,{p:clamp((t-t0-0.3-j*0.15)/0.8,0,1),a:0.42,vertical:true}));
    arrive(ctx,x,y,t,t0,()=>wc_tag(ctx,x,y,s,{align:"center"}),{dy:10});});});
  m5_close(ctx,S);
  wc_year(ctx,64,80,"today · an airport",fin(t,0.4,0.6)*(1-fin(t,B+0.2,0.4)));
  wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  wc_title(ctx,S,t,B+0.6,"Lists everyone uses","reference data with an owner, a date and one home","Film 5 of 9 · master and reference data");});

/* ---------- 2. One role, three names ---------- */
// lists like these: five of the university's, small, across the sky as the chapter opens
const M5_UNI=["role types","statuses","countries","grades","fee types"];
// her role in three systems: each system's name for it
const M5_SX=700,M5_SW=640,M5_SY=[130,300,470];
const M5_SYS=[["HR system","E-4417","position type","Casual Academic"],["Payroll","E-4417","pay type","CAS",1],["Learning platform","u-88236","course role","tutor"]];
const M5_IDS=["S-20436","E-4417","R-3082","u-88236"];
scene("names",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tL=c("like"),tLi=w("like","lists"),tLn=c("linh"),tTu=w("linh","tutors"),tTh=c("three"),tN=[w("three","HR calls"),w("three","Payroll"),w("three","learning platform")],
    tM=c("match"),tNo=w("match","nothing"),tSay=w("match","says"),tSh=c("sheet"),tSp=w("sheet","spreadsheet"),tK=c("kinds"),tId=w("kinds","identifier");
  // the camera: the campus; a little closer to her records; back out for her identifiers
  m5_open(ctx,S,t,sc,"campus",[[0,960,540,1],[tTh-0.3,930,500,1.06],[tK-0.3,960,540,1]]);
  // lists like these, which give way to Linh: gone before her card arrives where the first of them was
  const ul=1-fin(t,tLn-0.7,0.6);if(ul>0.01)withA(ctx,ul,()=>M5_UNI.forEach((n,i)=>arrive(ctx,290+i*340,200,t,tL+0.2+i*0.18,()=>m5_mini(ctx,140+i*340,120,290,n),{dy:12})));
  // while the email is the subject, her records step back
  const sh=fin(t,tSh-0.3,0.5)*(1-fin(t,tK-0.4,0.5)),rec=1-0.7*sh;
  // the lines from her tutor chip to each record, and from each record's name for the role to where a match would be written
  const chip=[506,286];
  withA(ctx,rec,()=>{M5_SY.forEach((y,i)=>wc_link(ctx,chip[0]+8,chip[1],M5_SX-8,y+64,WC_ROLE.tutor,{p:clamp((t-tN[i]-0.2)/0.6,0,1),a:0.8}));
    M5_SY.forEach((y,i)=>wc_link(ctx,M5_SX+M5_SW+8,y+91,1432,352,WC_PENCIL,{p:clamp((t-tNo-i*0.15)/0.7,0,1),a:0.75}));
    m5_noMatch(ctx,1440,300,clamp((t-tNo-0.5)/0.8,0,1),clamp((t-tSay)/0.5,0,1));
    // the three records, each with its own name for the same role, ringed as they're counted
    M5_SY.forEach((y,i)=>{const [sys,id,f,v,m]=M5_SYS[i];arrive(ctx,M5_SX+M5_SW/2,y+64,t,tN[i]-0.3,()=>{const e=m5_sys(ctx,M5_SX,y,M5_SW,sys,"tutor",id,f,v,{mono:!!m,seed:i+20});
      wc_ring(ctx,(e[0]+e[1])/2,e[2],(e[1]-e[0])/2+26,30,clamp((t-tM-i*0.25)/0.7,0,1),{seed:40+i});},{dy:14});});});
  // HR's own list of roles, in a spreadsheet, attached to an email
  m5_hush(ctx,0.35*sh);
  if(sh>0.01)withA(ctx,sh,()=>arrive(ctx,700+M5_MAILW/2,250+M5_MAILH/2,t,tSh-0.2,()=>{m5_email(ctx,700,250);wc_ring(ctx,700+M5_MAILW/2,250+243,M5_MAILW/2-10,48,clamp((t-tSp)/0.8,0,1),{seed:46});},{dy:16}));
  // her identifiers, and no word anywhere for what kind each one is
  M5_IDS.forEach((id,i)=>arrive(ctx,640+i*305+142,741,t,tId-0.4+i*0.18,()=>wc_info(ctx,640+i*305,680,285,122,id,"kind: ?"),{dy:14}));
  // Linh, and her card: she studies here, and tutors
  arrive(ctx,330,700,t,tLn-0.5,()=>person(ctx,"linh",330,1012,1.0,{pose:"stand",expr:"calm",t}),{d:0.9,from:0.97});
  arrive(ctx,280,240,t,tLn,()=>m5_linhCard(ctx,60,140,{tutor:fin(t,tTu-0.1,0.5)}),{dy:12});
  m5_close(ctx,S);
  wc_year(ctx,64,80,"today · the university",fin(t,0.3,0.6));wc_paperOver(ctx,S);});

/* ---------- 3. Typed again ---------- */
const M5_CTY=[["HR system","tutor","E-4417","Vietnam"],["Student system","student","S-20436","Viet Nam"],["Research office","researcher","R-3082","VN",1]];
const M5_COUNT=[["Viet Nam",214],["Vietnam",61],["VN",18]],M5_CROW=[1,0,2];
scene("typed",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tS=c("status"),tAct=w("status","active"),tMp=c("map"),tA=c("again"),tHand=w("again","by hand"),tC=c("country"),tCn=[w("country","Vietnam"),w("country","Viet Nam"),w("country","VN at")],
    tCo=c("count"),tCnt=w("count","a count"),tTh=w("count","three times");
  // the camera: her status; closer to the tests; out for her country; closer to the count
  m5_open(ctx,S,t,sc,"office",[[0,960,540,1],[tA-0.3,1085,470,1.15],[tC-0.4,960,540,1],[tCo-0.3,1063,482,1.12]]);
  // her status, the file that maps it, and the tests that type it again leave as her country is named
  const pA=1-fin(t,tC-0.7,0.6);
  if(pA>0.01)withA(ctx,pA,()=>{const lt=k=>fin(t,tMp+0.4+k*0.3,0.5);
    arrive(ctx,750,194,t,tS-0.2,()=>m5_sys(ctx,580,130,340,"Student system","student",null,"status","ENR",{mono:true,lit:lt(0)}),{dy:14});
    arrive(ctx,1120,194,t,tAct-0.3,()=>m5_sys(ctx,950,130,340,"Learning platform","student",null,"status","active",{mono:true,lit:lt(1)}),{dy:14});
    arrive(ctx,930,520,t,tMp-0.3,()=>m5_file(ctx,580,330,700,"status_map.csv",M5_MAPF,{cols:[0,150,360],head:true,lit:[[1,WC_ROLE.student,lt(0)],[5,WC_ROLE.student,lt(1)]]}),{dy:16});
    [[130,"_student__seeds.yml",tA+0.2],[470,"_core_student__models.yml",tA+1.0]].forEach(([y,f,t0])=>arrive(ctx,1606,y+150,t,t0-0.3,()=>m5_file(ctx,1336,y,540,f,M5_TYPED,{logo:"dbt",from:2,tp:clamp((t-t0)/2.4,0,1)}),{dy:16}));
    // the same four statuses, in three places
    wc_ring(ctx,1105,(m5_lineY(330,1)+m5_lineY(330,6))/2,172,148,clamp((t-tHand-0.2)/0.8,0,1),{seed:51,a:0.8});
    [130,470].forEach((y,i)=>wc_ring(ctx,1594,m5_lineY(y,3),262,84,clamp((t-tHand+0.2-i*0.3)/0.8,0,1),{seed:52+i,a:0.8}));});
  // her country of birth, three ways, and a count that lists it three times
  const pB=fin(t,tC-0.5,0.6),RX=1240,RY=170;
  if(pB>0.01)withA(ctx,pB,()=>{
    M5_CTY.forEach((r,i)=>wc_link(ctx,1146,130+i*160+91,RX-8,m5_repY(RY,M5_CROW[i]),WC_PENCIL,{p:clamp((t-tCnt-0.3-i*0.2)/0.7,0,1),a:0.7}));
    M5_CTY.forEach(([s,r,id,v,m],i)=>arrive(ctx,860,194+i*160,t,i?tCn[i]-0.5:tC-0.2,()=>m5_sys(ctx,580,130+i*160,560,s,r,id,"country of birth",v,{mono:!!m,seed:i+30}),{dy:14}));
    arrive(ctx,RX+310,RY+163,t,tCnt-0.3,()=>{const h=m5_report(ctx,RX,RY,620,"people by country of birth","all systems",M5_COUNT,{rowA:[0,1,2].map(i=>fin(t,tCnt+0.1+i*0.2,0.4)),grow:clamp((t-tCnt-0.1)/1.0,0,1)});
      m5_bracket(ctx,RX+46,m5_repY(RY,0)-24,m5_repY(RY,2)+24,clamp((t-tTh)/0.7,0,1));
      withA(ctx,fin(t,tTh+0.4,0.5),()=>wc_tag(ctx,RX+24,RY+h+46,"one country",{}));},{dy:16});});
  m5_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 4. The lists that sort ---------- */
const M5_LX=230,M5_LY=850,M5_LS=0.7,M5_KY=300;
scene("kinds",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tT=c("these"),tSo=w("these","sort"),tO=c("own"),tRt=w("own","role types"),tOut=w("own","from outside"),tAir=w("own","airport"),tCd=c("code"),tSys=w("code","systems store"),tLab=w("code","a label");
  // the camera: the lists; in on one value, its code and its label
  m5_open(ctx,S,t,sc,"plain",[[0,960,540,1],[tCd-0.3,1150,470,1.25]]);
  withA(ctx,1-fin(t,tCd-0.4,0.5),()=>arrive(ctx,960,100,t,tT-0.3,()=>wc_T(ctx,"reference data",960,118,{w:800,size:52,align:"center",col:WC_DARK}),{dy:10}));
  // Linh, as the person, whom the lists sort and describe: a line from each list's value down to her, under the lists
  // all four of her roles, as in film 1: student, tutor, researcher, alumna
  wc_white(ctx,"linh",M5_LX,M5_LY,M5_LS,m5_bands([1,1,1,1]),{a:fin(t,tT+0.2,0.7)});
  // her status meets the student band, her role the tutor band, and her country meets her, below the role bands; the
  // statuses come first so that no two lines cross, and the lines step back when the camera moves in on one value
  const by=i=>wc_bandY("linh",M5_LS,M5_LY,i),bot=n=>M5_KY+24+n*M5_RH+14,la=0.8*(1-0.85*fin(t,tCd-0.4,0.6));
  [[540,bot(4),by(0),WC_ROLE.student,0],[890,bot(4),by(1),WC_ROLE.tutor,0.25],[1240,bot(3),by(4)+14,WC_PENCIL,0.5]].forEach(([x,y,yy,col,d])=>
    m5_drop(ctx,x,y+6,M5_LX+58,yy,col,{p:clamp((t-tSo-0.3-d)/0.9,0,1),a:la}));
  arrive(ctx,620,M5_KY+115,t,tT+0.3,()=>m5_list(ctx,470,M5_KY,300,"learner statuses",["Studying","On leave","Withdrawn","Completed"],{lit:[[0,WC_ROLE.student,fin(t,tSo,0.4)]]}),{dy:16});
  arrive(ctx,970,M5_KY+115,t,tT+0.5,()=>m5_list(ctx,820,M5_KY,300,"role types",["Student","Tutor","Researcher","Alumni"],{lit:[[1,WC_ROLE.tutor,fin(t,tSo+0.25,0.4)]]}),{dy:16});
  arrive(ctx,1330,M5_KY+91,t,tT+0.7,()=>m5_list(ctx,1170,M5_KY,320,"countries",[["AU","Australia"],["CA","Canada"],["VN","Viet Nam"]],{lit:[[2,WC_BADGE,fin(t,tSo+0.5,0.4)]]}),{dy:16});
  // airport codes, from outside too
  m5_smallTag(ctx,t,1700,276,0.62,"YYZ","Toronto",tAir-0.2,{});
  // the university's own, and from outside
  [[480,1110,"the university's own",tRt-0.4],[1180,1820,"from outside",tOut-0.3]].forEach(([x0,x1,s,t0],i)=>{const p=clamp((t-t0)/0.6,0,1);if(p<=0)return;
    withA(ctx,1-fin(t,tCd-0.4,0.5)*0.6,()=>{wc_pencil(ctx,[[x0,232],[x0,222],[x1,222],[x1,232]],p,{col:WC_PENCIL,lw:2.6,a:0.8,seed:60+i,amp:0.8});
      arrive(ctx,(x0+x1)/2,184,t,t0+0.2,()=>wc_T(ctx,s,(x0+x1)/2,196,{w:700,size:32,align:"center",col:WC_DARK}),{dy:8});});});
  // a value: a code that systems store, a label that people read
  const ca=fin(t,tCd+0.2,0.5),vy=m5_rowY(M5_KY,2);if(ca>0.01)withA(ctx,ca,()=>{
    wc_ring(ctx,1215,vy,38,28,clamp((t-tSys+0.4)/0.6,0,1),{seed:62});wc_ring(ctx,1322,vy,78,28,clamp((t-tLab)/0.6,0,1),{seed:63});
    m5_arrow(ctx,1215,vy+34,1215,vy+104,clamp((t-tSys+0.2)/0.5,0,1));m5_arrow(ctx,1340,vy+34,1384,vy+104,clamp((t-tLab+0.2)/0.5,0,1));
    arrive(ctx,1215,vy+134,t,tSys,()=>{wc_tag(ctx,1215,vy+134,"code",{align:"center"});m5_drum(ctx,1132,vy+134,0.9);},{dy:8});
    arrive(ctx,1394,vy+134,t,tLab+0.2,()=>{wc_tag(ctx,1394,vy+134,"label",{align:"center"});m5_reader(ctx,1478,vy+132,0.9);},{dy:8});});
  m5_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 5. A home for each list ---------- */
// the statuses, which the tests typed, then the five lists the narration names
const M5_SIX=["learner statuses","role types","identifier types","relationship types","consent purposes","countries"];
const M5_RT=[["student","Student","registrar's office","2004-01-01"],["tutor","Tutor","HR","2004-01-01"],["researcher","Researcher","research office","2020-01-01"],["alumni","Alumni","alumni office","2004-01-01"]];
const M5_RTC=[["code",0,"mono"],["label",210],["owner",410],["from",700,"mono"]];
const M5_MAP=[["HR","Casual Academic","tutor"],["payroll","CAS","tutor"],["learning platform","tutor","tutor"]],M5_MAPC=[["system",0],["their name",300],["means",620,"mono"]];
const M5_TX=960,M5_TW=920;
scene("home",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tJ=c("jun"),tHome=w("jun","one home"),tFi=[w("five","Role types"),w("five","identifier types"),w("five","relationship types"),w("five","consent purposes"),w("five","countries")],
    tTb=c("table"),tCode=w("table","code"),tLab=w("table","label"),tOwn=w("table","who owns"),tFrom=w("table","the date"),tHR=w("owners","HR owns"),tReg=w("owners","registrar"),
    tMp=c("map"),tMn=[w("map","Casual Academic"),w("map","CAS"),w("map","and tutor")],tAll=w("map","all mean");
  // the camera: Jun and the lists; in to the two tables, leaving Jun out of the frame (never half in it)
  m5_open(ctx,S,t,sc,"office",[[0,960,540,1],[tTb-0.3,1190,530,1.25]]);
  // each list given a home: the statuses first, then the five as they're named
  const at=[tHome-0.1].concat(tFi.map(k=>k-0.25));
  M5_SIX.forEach((n,i)=>arrive(ctx,750,150+i*106,t,at[i],()=>m5_mini(ctx,590,100+i*106,320,n),{dy:12}));
  // role types becomes a table: a value a row, with its code and label, its owner, and the date it applies from
  wc_link(ctx,916,280,M5_TX+10,146,WC_PENCIL,{p:clamp((t-tTb+0.2)/0.5,0,1),a:0.6});
  const ow=k=>fin(t,k,0.4);
  arrive(ctx,M5_TX+M5_TW/2,309,t,tTb-0.2,()=>m5_grid(ctx,M5_TX,170,M5_TW,"role types",M5_RTC,M5_RT,{colA:[tCode,tLab,tOwn,tFrom].map(k=>fin(t,k-0.3,0.4)),
    hi:[[0,2,WC_ROLE.student,ow(tReg)],[1,2,WC_ROLE.tutor,ow(tHR)]]}),{dy:16});
  // each system's own names for the role, mapped to the one it means
  arrive(ctx,M5_TX+M5_TW/2,675,t,tMp-0.2,()=>m5_grid(ctx,M5_TX,560,M5_TW,"role names, by system",M5_MAPC,M5_MAP,{rowA:tMn.map(k=>fin(t,k-0.3,0.4)),
    hi:[0,1,2].map(i=>[i,2,WC_ROLE.tutor,fin(t,tAll+i*0.15,0.4)])}),{dy:16});
  // Jun, and the name card until the camera moves in; a hand out to the lists as each is given a home
  const ex=fin(t,tHome-0.4,0.6)*(1-fin(t,tTb-0.4,0.6)),na=1-fin(t,tTb-0.3,0.5);
  arrive(ctx,300,700,t,tJ-0.6,()=>person(ctx,"jun",300,1012,0.95,{pose:"stand",pose2:"explain",mix:ex,expr:"calm",t}),{d:0.9,from:0.97});
  if(na>0.01)withA(ctx,na,()=>arrive(ctx,200,784,t,tJ,()=>m5_name(ctx,40,730,"Jun Park","analytics engineer"),{dy:12}));
  m5_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 6. Read, not typed ---------- */
const M5_ST=[["studying","Studying"],["inactive","On leave"],["withdrawn","Withdrawn"],["completed","Completed"],["deferred","Deferred"]];
const M5_READ=["relationships:","  arguments:","    to: ref('learner_status')","    field: code",""];
const M5_RLX=700,M5_RLY=180,M5_RLW=520;
scene("read",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tT=c("tests"),tRd=w("tests","read their"),tFr=w("tests","from the list"),tIn=w("tests","instead"),tO=c("once"),tCh=w("once","Change"),tFo=w("once","follows"),
    tL=c("lineage"),tOne=w("lineage","one table"),tLin=w("lineage","its lineage"),tTab=w("lineage","the tables"),tRep=w("lineage","reports");
  // the camera: the list and its tests; down a little to the lineage; back out for the list with everything that reads it
  m5_open(ctx,S,t,sc,"plain",[[0,960,540,1],[tL-0.3,960,590,1.04],[B-0.4,960,540,1]]);
  // the platform: the list as one table, and its lineage
  const la=fin(t,tL-0.2,0.6);if(la>0.01)withA(ctx,la,()=>{m5_platform(ctx,300,560,1320,290);
    m5_drop(ctx,M5_RLX+160,M5_RLY+342,510,662,WC_PENCIL,{p:clamp((t-tOne)/0.6,0,1),a:0.6});
    arrive(ctx,510,700,t,tOne-0.1,()=>m5_node(ctx,340,660,340,"learner_status","table",{wash:WC_BADGE,washA:0.45}),{dy:10});
    m5_arrow(ctx,686,700,754,700,clamp((t-tLin)/0.4,0,1));arrive(ctx,920,700,t,tTab-0.2,()=>m5_node(ctx,760,660,320,"core_learner","table"),{dy:10});
    m5_arrow(ctx,1086,684,1154,652,clamp((t-tRep+0.3)/0.4,0,1));m5_arrow(ctx,1086,716,1154,770,clamp((t-tRep)/0.4,0,1));
    arrive(ctx,1370,650,t,tRep-0.3,()=>m5_node(ctx,1160,610,420,"census report","report"),{dy:10});arrive(ctx,1370,770,t,tRep,()=>m5_node(ctx,1160,730,420,"fees dashboard","report"),{dy:10});});
  // the list, which every test now reads; a new status, once, and every test follows
  const nr=fin(t,tCh,0.6),ra=M5_ST.map((r,i)=>i<4?1:nr);
  arrive(ctx,M5_RLX+M5_RLW/2,M5_RLY+165,t,tT-0.6,()=>m5_list(ctx,M5_RLX,M5_RLY,M5_RLW,"learner statuses",M5_ST,{rowA:ra,newRow:nr<1&&nr>0?4:-1,foot:"owner · registrar's office",
    lit:[[4,WC_ROLE.student,fin(t,tCh+0.6,0.5)*0.6]]}),{dy:16});
  // the two tests: what they typed, struck through, then a line that reads the list, pinned to it
  [[70,"_student__seeds.yml",0],[1270,"_core_student__models.yml",0.35]].forEach(([x,f,d])=>{const st=clamp((t-tRd-d)/0.8,0,1),oa=1-fin(t,tRd+0.7+d,0.4);
    arrive(ctx,x+290,333,t,tT-0.3+d,()=>{m5_file(ctx,x,180,580,f,M5_READ,{logo:"dbt",tp:clamp((t-tRd-1.0-d)/1.4,0,1),old:M5_TYPED,oldA:oa,strike:st});
      wc_tick(ctx,x+544,206,36,WC_ROLEINK.alumna,clamp((t-tFo-d)/0.5,0,1),5);},{dy:16});
    const left=x<M5_RLX,px=left?x+590:x-10,py=m5_lineY(180,2),qx=left?M5_RLX-10:M5_RLX+M5_RLW+10,qy=m5_rowY(M5_RLY,1);
    wc_link(ctx,px,py,qx,qy,WC_INK,{p:clamp((t-tFr-d)/0.7,0,1),a:0.6});m5_pin(ctx,qx,qy,fin(t,tFr+0.6+d,0.3));});
  m5_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 7. A change, with a date ---------- */
const M5_PRX=560,M5_PRY=100;
scene("change",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tN=c("next"),tSes=w("next","Sessional"),tP=c("pr"),tPr=w("pr","pull request"),tOwn=w("pr","as the list"),tApp=w("pr","approves"),tF=c("from"),tJan=w("from","first of January"),
    tE=c("ended"),tDel=w("ended","isn't deleted"),tEnd=w("ended","ended"),tCon=w("ended","past contracts");
  // the camera: the years; up to the pull request; back down to the years
  m5_open(ctx,S,t,sc,"office",[[0,960,540,1],[tP-0.3,1063,440,1.12],[tF-0.3,960,540,1]]);
  // her tutor role across the years, under HR's name for it; the new name, dashed, from next year, solid once approved and dated
  m5_years(ctx,t,{a:fin(t,tN-0.4,0.6),newA:fin(t,tSes-0.2,0.5),solid:fin(t,tJan,0.6),day:fin(t,tJan-0.4,0.5)});
  // the pull request: Jun's change, and HR's review, approved
  arrive(ctx,M5_PRX+M5_PRW/2,M5_PRY+160,t,tPr-0.4,()=>{m5_pr(ctx,M5_PRX,M5_PRY,{l1:fin(t,tPr,0.4),l2:fin(t,tPr+0.4,0.4),rev:fin(t,tOwn-0.3,0.4),ok:clamp((t-tApp)/0.8,0,1)});
    // the old name isn't deleted: it's ended, on the last day of 2026
    const ux=M5_PRX+84+tw(ctx,"HR · Casual Academic → tutor · ",28,600),uw=tw(ctx,"until 2026-12-31",28,600);wc_ring(ctx,ux+uw/2+4,M5_PRY+216,uw/2+12,30,clamp((t-tEnd)/0.7,0,1),{seed:74});},{dy:16});
  // her past contracts, which still use the old name
  [2023,2024,2025,2026].forEach((yr,i)=>{const x=m5_yx(yr)+M5_YW/2,t0=tCon-0.2+i*0.2;arrive(ctx,x,531,t,t0,()=>m5_contract(ctx,x,484,yr),{dy:12});
    wc_link(ctx,x,580,x,670,WC_ROLE.tutor,{p:clamp((t-t0-0.3)/0.4,0,1),a:0.8,vertical:true});});
  m5_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 8. From outside ---------- */
const M5_ISO=[["AU","AUS","Australia"],["CA","CAN","Canada"],["VN","VNM","Viet Nam"]],M5_ISOC=[["alpha-2",0,"mono"],["alpha-3",170,"mono"],["name",340]];
const M5_UL=[["AU","Australia"],["CA","Canada"],["VN","Viet Nam"]],M5_ULX=170,M5_ULY=240;
// the project's award, as its conceptual model keeps it: the glossary's definition, and its source
const M5_GLO=["- name: award","  definition: A qualification…","  source:","    term: Award"];
scene("outside",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tE=c("else"),tSo=w("else","someone else"),tI=c("iso"),tStd=w("iso","standard"),tLd=w("iso","loaded"),tG=c("glossary"),tCp=w("glossary","copied"),
    tO=c("once"),tAp=w("once","appears"),tOne=w("once","one code"),tVN=w("once","VN."),tCo=c("count"),tCnt=w("count","the count"),tOn=w("count","once");
  m5_open(ctx,S,t,sc,"plain",[[0,960,540,1]]);
  // the owner's list, and the university's copy of it; the divider steps back once the copy is the point
  const da=fin(t,tSo-0.3,0.6)*(1-fin(t,tO-0.6,0.6));if(da>0.01)withA(ctx,da,()=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.5);ctx.lineWidth=2.6;ctx.setLineDash([12,12]);ctx.beginPath();ctx.moveTo(950,140);ctx.lineTo(950,820);ctx.stroke();ctx.restore();
    wc_T(ctx,"the university's copy",470,130,{w:800,size:36,align:"center",col:WC_DARK});wc_T(ctx,"its owner",1430,130,{w:800,size:36,align:"center",col:WC_DARK});});
  // the international standard's countries, and the university's copy, loaded every month
  arrive(ctx,1430,355,t,tSo-0.1,()=>m5_grid(ctx,1030,240,800,"ISO 3166 · countries",M5_ISOC,M5_ISO),{dy:16});
  m5_arrow(ctx,1020,355,750,355,clamp((t-tLd)/0.7,0,1));arrive(ctx,885,312,t,tLd+0.3,()=>wc_tag(ctx,885,312,"every month",{align:"center",size:28,w:600}),{dy:8});
  const one=fin(t,tAp+0.5,0.5);
  arrive(ctx,M5_ULX+280,M5_ULY+91,t,tLd+0.1,()=>m5_list(ctx,M5_ULX,M5_ULY,560,"countries",M5_UL,{lit:[[2,WC_BADGE,one]],foot:"copied from ISO 3166"}),{dy:16});
  // like the glossary: the project's conceptual model copies a term's definition, and records where it came from (DEC-PRJ-11)
  const ga=fin(t,tG-0.3,0.6)*(1-fin(t,tO-0.6,0.6));if(ga>0.01)withA(ctx,ga,()=>{
    arrive(ctx,1330,640,t,tG-0.1,()=>{m5_tab(ctx,1030,580,"business glossary",21);wc_panel(ctx,1030,580,600,120,{kind:"card",seed:26});wc_T(ctx,"Award",1058,628,{w:800,size:30,col:WC_DARK});
      wc_T(ctx,"a qualification the university confers…",1058,672,{w:600,size:28,col:WC_INK});},{dy:14});
    m5_arrow(ctx,1020,650,762,650,clamp((t-tCp+0.3)/0.6,0,1));arrive(ctx,910,608,t,tCp,()=>wc_tag(ctx,910,608,"copied",{align:"center",size:28,w:600}),{dy:8});
    arrive(ctx,M5_ULX+260,692,t,tCp+0.2,()=>m5_file(ctx,M5_ULX-60,560,640,"_course__conceptual.yml",M5_GLO,{logo:"dbt",seed:27}),{dy:14});});
  // Vietnam, Viet Nam and VN, waiting beside the list, slide one by one into its one row, with one code
  const vy=m5_rowY(M5_ULY,2);[["Vietnam",tAp],["Viet Nam",tAp+0.3],["VN",tVN-0.6]].forEach(([s,t1],i)=>{const f=s.length<3?"mono":undefined,mv=ease(clamp((t-t1)/0.7,0,1)),
      a=fin(t,tO-0.2+i*0.15,0.4)*(1-clamp((mv-0.7)/0.3,0,1));
    if(a>0.01)withA(ctx,a,()=>{const xx=lerp(880,M5_ULX+440,mv),yy=lerp(450+i*60,vy,mv);m5_lit(ctx,xx-tw(ctx,s,28,700,f)/2-18,yy,s,WC_BADGE,{size:28,w:700,f,seed:i+90});});});
  wc_ring(ctx,M5_ULX+45,vy,36,28,clamp((t-tVN-0.15)/0.6,0,1),{seed:93});
  // and the count by country lists her country once
  arrive(ctx,M5_ULX+300,660,t,tCnt-0.3,()=>m5_report(ctx,M5_ULX,560,600,"people by country of birth","all systems",[["Viet Nam",293]],{grow:clamp((t-tCnt-0.1)/1.0,0,1)}),{dy:16});
  m5_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 9. Lists about people ---------- */
const M5_FX=600,M5_FY=110,M5_FW=860;
const M5_TITLES=["Mr","Mrs","Miss","Ms","Mx"],M5_GEN=["woman","man","non-binary"],M5_GEN2=["prefer not to say"];
scene("people",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tS=c("some"),tTi=w("some","titles"),tGe=w("some","gender"),tSh=c("short"),tInc=w("short","inclusive"),tPur=w("short","purpose"),tT=c("title"),tMar=w("title","married"),tIf=w("title","If it"),tAsk=w("title","isn't asked");
  m5_open(ctx,S,t,sc,"plain",[[0,960,540,1]]);
  // Linh, filling in a form about herself
  arrive(ctx,300,700,t,tS-0.6,()=>person(ctx,"linh",300,1012,0.95,{pose:"stand",pose2:"phone",mix:0.85,expr:"calm",t}),{d:0.9,from:0.97});
  // the form; once a title isn't needed, its field goes, and the gender field moves up into its place
  // (rings and the note at "married", struck at "If it isn't needed", gone at "it isn't asked", well before the chapter's crossfade)
  const gone=fin(t,tAsk,0.5),up=ease(fin(t,tAsk+0.3,0.8))*136;
  arrive(ctx,M5_FX+M5_FW/2,450,t,tS-0.3,()=>{wc_panel(ctx,M5_FX,M5_FY,M5_FW,lerp(690,560,ease(fin(t,tAsk+0.3,0.8))),{kind:"sheet",seed:93});wc_T(ctx,"about you",M5_FX+40,M5_FY+66,{w:800,size:36,col:WC_DARK});
    // the title: four of its five choices say whether someone is married
    withA(ctx,1-gone,()=>{wc_T(ctx,"title",M5_FX+40,M5_FY+130,{w:600,size:28,col:WC_MUTED});const xs=m5_choices(ctx,M5_FX+40,M5_FY+148,M5_TITLES,{a:M5_TITLES.map((s,i)=>fin(t,tTi+i*0.1,0.3))});
      [1,2].forEach((k,i)=>{const ww=tw(ctx,M5_TITLES[k],28,600)+74;wc_ring(ctx,xs[k]+ww/2,M5_FY+176,ww/2+14,40,clamp((t-tMar+0.2-i*0.2)/0.5,0,1),{seed:95+i});});
      m5_note(ctx,t,"married?",xs[1]+20,M5_FY+260,tMar-0.1,0.5);
      const sp=clamp((t-tIf-0.45)/0.6,0,1);if(sp>0){ctx.save();ctx.strokeStyle=rgba(WC_NO,0.85);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(M5_FX+30,M5_FY+176);ctx.lineTo(lerp(M5_FX+30,M5_FX+M5_FW-40,sp),M5_FY+172);ctx.stroke();ctx.restore();}});
    // gender: short, and inclusive
    ctx.save();ctx.translate(0,-up);const gy=M5_FY+290;wc_T(ctx,"gender",M5_FX+40,gy,{w:600,size:28,col:WC_MUTED});
    const lit=fin(t,tInc,0.5);
    m5_choices(ctx,M5_FX+40,gy+18,M5_GEN,{a:M5_GEN.map((s,i)=>fin(t,tGe+i*0.1,0.3))});
    // another term, with a line to write it on, and prefer not to say
    const x2=M5_FX+40,wA=tw(ctx,"another term",28,600)+74,ax=x2+wA+12,px=ax+196,wP=tw(ctx,M5_GEN2[0],28,600)+74;
    m5_choices(ctx,x2,gy+88,["another term"],{a:[fin(t,tGe+0.3,0.3)]});m5_choices(ctx,px,gy+88,M5_GEN2,{a:[fin(t,tGe+0.4,0.3)]});
    withA(ctx,fin(t,tGe+0.3,0.3),()=>{ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.7);ctx.lineWidth=2.4;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(ax,gy+136);ctx.lineTo(ax+140,gy+136);ctx.stroke();ctx.restore();});
    if(lit>0.01)withA(ctx,lit,()=>{wc_ring(ctx,x2+(wA+152)/2,gy+116,(wA+152)/2+14,40,clamp((t-tInc)/0.6,0,1),{seed:97});wc_ring(ctx,px+wP/2,gy+116,wP/2+14,40,clamp((t-tInc-0.3)/0.6,0,1),{seed:98});});
    // why it's asked
    arrive(ctx,M5_FX+M5_FW/2,gy+232,t,tPur-0.2,()=>{wc_panel(ctx,M5_FX+40,gy+176,M5_FW-80,112,{kind:"card",dashed:true,role:WC_PENCIL,seed:99});
      wc_T(ctx,"why we ask",M5_FX+70,gy+222,{w:800,size:28,col:WC_DARK});wc_T(ctx,"the government asks universities to report it",M5_FX+70,gy+264,{w:600,size:28,col:WC_INK});},{dy:10});
    ctx.restore();},{dy:16});
  m5_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 10. Elsewhere ---------- */
const M5_BANK=[["personal","standard"],["business","standard"],["public figure","enhanced"]],M5_HOSP=[["nominated contact","yes"],["partner","if patient agrees"],["former partner","no"]];
const M5_PX=[100,1000],M5_PY=110;
scene("elsewhere",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tE=c("every"),tB=c("bank"),tTy=w("bank","customer types"),tCh=w("bank","checks"),tH=c("hosp"),tRel=w("hosp","relationship"),tTold=w("hosp","may be told"),tW=c("wrong"),tPer=w("wrong","real person");
  m5_open(ctx,S,t,sc,"plainB",[[0,960,540,1]]);
  // the industry being told stands out; the other steps back until the last line, which is about both
  const act=[fin(t,tB-0.3,0.5)*(1-fin(t,tH-0.3,0.5)),fin(t,tH-0.3,0.5)],any=fin(t,tB-0.3,0.5)*(1-fin(t,tW-0.3,0.5)),pa=i=>1-0.55*any*(1-act[i]);
  [["bank","a bank",M5_BANK,[["customer type",0],["checks",300]],"customer types",tTy,tCh,2],["health","a hospital",M5_HOSP,[["relationship",0],["may be told",300]],"relationship to patient",tRel,tTold,1]].forEach(([ind,name,rows,cols,list,t1,t2,bad],i)=>{
    const x=M5_PX[i];withA(ctx,pa(i),()=>{arrive(ctx,x+M5_IPW/2,M5_PY+M5_IPH/2,t,tE+0.1+i*0.25,()=>m5_ind(ctx,x,M5_PY,ind,name),{dy:16});
      wc_white(ctx,"linh",x+108,M5_PY+600,0.5,[],{a:fin(t,t1-0.2,0.6)});
      arrive(ctx,x+500,M5_PY+330,t,t1-0.1,()=>m5_grid(ctx,x+196,M5_PY+210,604,list,cols,rows,{rowA:rows.map((r,k)=>fin(t,t1+0.2+k*0.15,0.4)),
        hi:[[bad,1,WC_BADGE,fin(t,t2,0.5)],[bad,0,WC_NO,fin(t,tW+0.3,0.5)*0.5]]}),{dy:14});
      // the wrong value, and a real person it happens to; the ring pulses with the score's beat (92 a minute, from tPer - 0.3)
      const wp=fin(t,tPer-0.3,0.5);if(wp>0.01){const pulse=0.5+0.5*Math.cos((t-tPer+0.3)*Math.PI*2*92/60);wc_ring(ctx,x+108,M5_PY+460,78,180,clamp((t-tPer+0.3)/0.7,0,1),{seed:100+i,col:WC_NO,a:0.6+0.3*pulse});}});});
  m5_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 11. Who keeps it ---------- */
const M5_KCH=[["Studying","status","student",0],["Tutor","role","tutor",1],["Viet Nam","country of birth",WC_BADGE,4]];
const M5_KLS=[["learner statuses","owner · registrar's office","from 2004-01-01"],["role types","owner · HR","from 2004-01-01"],["countries","owner · ISO 3166","loaded every month"]];
scene("keeps",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tL=c("linh"),tR=w("linh","role"),tSt=w("linh","status"),tCy=w("linh","country"),tOne=w("linh","one list"),tA=c("airport"),tKe=w("airport","who keeps"),tWh=w("airport","from when"),tK=c("line");
  m5_open(ctx,S,t,sc,"campus",[[0,960,540,1],[tK-0.3,960,530,1.03]]);
  m5_hush(ctx,0.45);
  // the cards step back while the line is said, so it, and the person, read on their own
  const rb=1-0.65*fin(t,tK-0.4,0.6),LX=400,LY=1012,ta=[tSt,tR,tCy];
  wc_white(ctx,"linh",LX,LY,1.0,m5_bands([1,1,1,1]),{});
  withA(ctx,rb,()=>{M5_KCH.forEach(([v,f,r,b],i)=>{const y=290+i*170,by=wc_bandY("linh",1.0,LY,b)+(b>3?14:0);
      wc_link(ctx,LX+(b>3?62:92),by,636,y+30,WC_ROLE[r]||r,{p:clamp((t-ta[i]-0.1)/0.6,0,1),a:0.85});
      arrive(ctx,780,y+30,t,ta[i],()=>wc_chip(ctx,640,y,Math.round(tw(ctx,v,30,800)+tw(ctx," · "+f,28,600)+60),60,r,v,f,{seed:i+110}),{dy:10});
      wc_link(ctx,640+Math.round(tw(ctx,v,30,800)+tw(ctx," · "+f,28,600)+60)+8,y+30,1084,y+30,WC_PENCIL,{p:clamp((t-tOne-i*0.15)/0.6,0,1),a:0.6});
      arrive(ctx,1310,y+30,t,tOne+i*0.15,()=>{const [n,l1,l2]=M5_KLS[i];m5_mini(ctx,1090,y-48,460,n,{line:l1,line2:l2});
        // who keeps it, then from when: underlined in pencil, one line after the other (rings round two lines this close would cross)
        [[l1,51,tKe],[l2,89,tWh]].forEach(([l,dy,t0],k)=>wc_pencil(ctx,[[1114,y+dy],[1122+tw(ctx,l,28,600),y+dy]],clamp((t-t0-i*0.15)/0.5,0,1),{col:WC_INK,lw:3,a:0.75,seed:120+4*k+i,amp:0.6}));},{dy:12});});
    // like an airport code
    m5_smallTag(ctx,t,1700,96,0.5,"YYZ","Toronto",tA-0.2,{});});
  m5_close(ctx,S);
  wc_year(ctx,64,80,"today · the university",fin(t,0.3,0.6)*(1-fin(t,tK-0.4,0.6)));wc_paperOver(ctx,S);
  // the line, then carried down onto the end card, above the veil, landing where the card's own line fades in and takes it over
  const KL="A list has an owner, a date and one home.",kl=fin(t,tK-0.1,0.6),ky=lerp(128,420,fin(t,B+0.3,1.1)),kg=kl*(1-fin(t,B+0.8,0.9));
  if(kg>0.01){setScreen(ctx,S);withA(ctx,kg,()=>{ctx.save();ctx.translate(960,ky-16);ctx.scale(1,0.2);const g=ctx.createRadialGradient(0,0,10,0,0,700);
    g.addColorStop(0,rgba(WC_PAPER,0.94));g.addColorStop(0.7,rgba(WC_PAPER,0.7));g.addColorStop(1,rgba(WC_PAPER,0));ctx.fillStyle=g;ctx.fillRect(-700,-700,1400,1400);ctx.restore();});}
  wc_end(ctx,S,t,B+0.8,"Lists everyone uses",KL,"Film 5 of 9");
  if(kl>0.01&&t<B+2.4){setScreen(ctx,S);withA(ctx,kl,()=>wc_T(ctx,KL,960,ky,{w:700,size:48,align:"center",col:WC_DARK}));}});
