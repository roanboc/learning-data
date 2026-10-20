/* ===== One person, many systems: scenes =====
   Twelve chapters, as in ../script.md: a valley in 1874, a treaty for every pair of countries and a letter priced by its route, then
   the treaty of Bern, one postal territory, and no post office for the world; Linh, in late 2025, wanting a PhD from the university
   that gave her two student numbers; the four ways to give many systems one person, on Noor's wall; the two the university has, and
   what the other two cost; the lightest that works; a bank's hub and a country's register; the search before the application creates
   anyone; who may create a person; Linh found in October 2026; a second Linh Nguyen kept apart; the person as a data product; and the
   valley again, then the campus. Drawn in watercolour (shared/src/wash.js), made to read on a phone (tools/legible.py): text is at
   least 28 px in the frame. The camera moves in on whatever the narration is about, and every shot drifts slowly; things arrive with
   a spring. Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// the camera, as One person, many roles moves it (keys are [time, x, y, zoom], each move eased over d seconds), kept inside the place
function m7_focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z);x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// every scene's start and end: the place under the camera, and over it all, the paper
function m7_open(ctx,S,t,sc,place,keys,o){o=o||{};setScreen(ctx,S);ctx.save();const cam=m7_focus(ctx,t,keys,o.d||1.6);drift(ctx,t,sc,{z:o.z==null?0.018:o.z,x:o.dx||960,y:o.dy||560});
  if(place)m7_place(ctx,place);return cam;}
function m7_close(ctx,S){ctx.restore();setScreen(ctx,S);}
// a person facing the other way when o.flip: someone who points at what's on their left, so the hand stays in the frame
function m7_person(ctx,id,x,y,s,o){if(!o.flip)return person(ctx,id,x,y,s,o);ctx.save();ctx.translate(x,0);ctx.scale(-1,1);person(ctx,id,0,y,s,o);ctx.restore();}
// a pin, holding a paper up
function m7_pin(ctx,x,y){ctx.save();ctx.fillStyle=rgba([196,72,60],1);ctx.beginPath();ctx.arc(x,y,7,0,TAU);ctx.fill();ctx.fillStyle=rgba([255,255,255],0.6);ctx.beginPath();ctx.arc(x-2.5,y-2.5,2.5,0,TAU);ctx.fill();ctx.restore();}
// a magnifying glass, for the search
function m7_lens(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba(WC_CARD,1);ctx.beginPath();ctx.arc(x,y,26,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(WC_ROLEINK.applicant,0.95);ctx.lineWidth=5;ctx.stroke();ctx.lineCap="round";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x+19,y+19);ctx.lineTo(x+40,y+40);ctx.stroke();ctx.restore();});}
// a line of each tag set with a tick in front of it
function m7_tickTag(ctx,x,y,s,p){const w=Math.round(tw(ctx,s,30,700)+82);wc_panel(ctx,x-w/2,y-26,w,52,{kind:"tag",seed:s.length});wc_tick(ctx,x-w/2+30,y-2,28,WC_ROLEINK.alumna,p,4.5);
  wc_T(ctx,s,x-w/2+56,y+11,{w:700,size:30,col:WC_DARK});}

/* ---------- 1. A treaty for every pair ---------- */
// a letter's route before the union: from the office on the left, over the town, to the office on the right, along the treaties
const M7_ROUTE=(()=>{const f=(i,j)=>M7_PAIRS.find(p=>p.i===i&&p.j===j).pts;return f(0,2).concat(f(2,4).slice(1));})();
scene("bern",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tPair=w("pairs","every pair"),tTr=w("pairs","postal treaty"),tR=c("route"),tPr=w("route","its route"),tS=c("signed"),tBern=w("signed","in Bern"),t21=w("signed","twenty-one"),tSig=w("signed","signed"),
    tOne=c("one"),tTer=w("one","postal territory"),tRate=w("one","one rate"),tKept=w("one","each kept"),tNob=w("own","Nobody"),tWorld=w("own","for the world"),tEach=w("own","Each country"),tRules=w("own","shared the rules");
  // the camera: the valley; in on the town as the treaty is signed; out again for the territory it makes
  m7_open(ctx,S,t,sc,"valley",[[0,960,540,1.04],[tS-0.5,960,440,1.32],[tOne-0.3,960,540,1]]);
  // one territory, where the treaties were
  m7_territory(ctx,clamp((t-tTer+0.3)/1.6,0,1),fin(t,tTer+0.4,1.0));
  // the offices, each lifted in turn as it keeps its own
  for(let i=0;i<7;i++)m7_po(ctx,i,{bob:clamp((t-tEach-0.1-i*0.16)/0.5,0,1)});
  // a treaty for every pair, neighbours first; they lift away when the one treaty replaces them
  m7_treaties(ctx,t,tPair+0.1,0.17,clamp((t-tOne-0.2)/1.0,0,1));
  arrive(ctx,960,150,t,tTr,()=>withA(ctx,1-fin(t,tR-0.4,0.4),()=>wc_tag(ctx,960,150,"a treaty for every pair",{align:"center"})),{dy:10});
  // a letter, priced by its route: a stamp where it sets out, one over the town, one where it arrives
  const r0=tR-0.4,u=t<r0+1.55?0.5*ease(clamp((t-r0)/1.4,0,1)):0.5+0.5*ease(clamp((t-r0-1.7)/1.4,0,1)),la=fin(t,r0-0.2,0.3)*(1-fin(t,tS-0.5,0.4));
  if(la>0.01){const p=wc_along(M7_ROUTE,u),q=wc_along(M7_ROUTE,Math.min(1,u+0.01)),rot=clamp(Math.atan2(q[1]-p[1],q[0]-p[0])*0.3,-0.2,0.2);
    withA(ctx,la,()=>m7_letter(ctx,p[0],p[1]-34,0.9,rot,[[M7_STAMPS[0],clamp((t-r0)/0.25,0,1)],[M7_STAMPS[1],clamp((t-r0-1.45)/0.25,0,1)],[M7_STAMPS[2],clamp((t-r0-3.15)/0.25,0,1)]]));}
  arrive(ctx,960,150,t,tPr,()=>withA(ctx,1-fin(t,tS-0.6,0.4),()=>wc_tag(ctx,960,150,"a price for each route",{align:"center"})),{dy:10});
  // the treaty of Bern, written and signed as the camera reaches the town; it shrinks to its place above the town as the territory is drawn
  const sh=ease(clamp((t-tOne+0.4)/1.2,0,1)),pin=fin(t,tOne+0.8,0.3);
  if(t>tBern-0.4){if(sh<=0)arrive(ctx,960,330,t,tBern-0.3,()=>m7_treaty(ctx,960,330,1,{title:clamp((t-tBern)/1.1,0,1),date:clamp((t-tBern-0.9)/0.9,0,1),sig:clamp((t-t21+0.1)/(tSig-t21+1.4),0,1),seal:clamp((t-tSig-1.4)/0.35,0,1)}),{dy:30,d:0.9});
    else{m7_treaty(ctx,960,lerp(330,M7_PINY,sh),lerp(1,M7_PINK,sh));if(pin>0.01)withA(ctx,pin,()=>m7_pin(ctx,960,M7_PINY-M7_TH*M7_PINK/2+8));}}
  // each kept the postage it collected: a coin for each office, which stays by its door
  for(let i=0;i<7;i++)m7_coin(ctx,i,clamp((t-tKept-0.2-i*0.14)/0.8,0,1));
  const one=1-fin(t,tNob-0.4,0.5);
  arrive(ctx,960,452,t,tTer+0.5,()=>withA(ctx,one,()=>wc_tag(ctx,960,452,"one postal territory",{align:"center"})),{dy:10});
  // one rate for a letter: the union's letter, with its one stamp; posted at the office on the left as the next line starts, and in
  // the pause it crosses the whole valley to the office on the right, with no other stamp
  const tE=sc.ends.own,po=ease(clamp((t-tNob+0.3)/1.1,0,1)),fl=ease(clamp((t-tE-0.1)/2.2,0,1)),ax=M7_PO[0][0],ay=M7_PO[0][1]-196,bx=M7_PO[4][0],by=M7_PO[4][1]-176;
  const lx=lerp(lerp(400,ax,po),bx,fl),ly=lerp(lerp(250,ay,po),by,fl)-Math.sin(fl*Math.PI)*250,lk=lerp(1,0.42,po),la25=1-fin(t,tE+2.2,0.4);
  if(la25>0.01)withA(ctx,la25,()=>arrive(ctx,400,250,t,tRate-0.3,()=>m7_letter25(ctx,lx,ly,clamp((t-tRate-0.2)/0.3,0,1),Math.sin(fl*Math.PI*2)*0.1,lk),{dy:20}));
  arrive(ctx,400,372,t,tRate+0.5,()=>withA(ctx,one,()=>wc_tag(ctx,400,372,"one rate for a letter",{align:"center"})),{dy:10});
  arrive(ctx,1520,372,t,tKept+0.4,()=>withA(ctx,one,()=>wc_tag(ctx,1520,372,"each kept its postage",{align:"center"})),{dy:10});
  // nobody built a post office for the world: drawn faint, crossed out, gone
  const ga=1-fin(t,tEach-0.2,0.7);m7_ghost(ctx,clamp((t-tNob+0.1)/1.6,0,1),ga);
  withA(ctx,ga,()=>{wc_pencil(ctx,[[600,322],[1320,650]],clamp((t-tWorld-0.3)/0.45,0,1),{col:WC_NO,lw:5,a:0.85,seed:81});wc_pencil(ctx,[[1320,322],[600,650]],clamp((t-tWorld-0.6)/0.45,0,1),{col:WC_NO,lw:5,a:0.85,seed:83});});
  arrive(ctx,960,730,t,tWorld+0.2,()=>withA(ctx,1-fin(t,tRules-0.4,0.5),()=>wc_tag(ctx,960,730,"no post office for the world",{align:"center"})),{dy:10});
  // each kept its own, and they shared the rules: a line from the treaty to each office
  m7_rules(ctx,clamp((t-tRules+0.4)/1.4,0,1));
  arrive(ctx,1300,212,t,tRules+0.2,()=>wc_tag(ctx,1300,212,"one set of rules",{align:"center"}),{dy:8});
  m7_close(ctx,S);
  wc_year(ctx,64,80,"before 1874",fin(t,0.4,0.6)*(1-fin(t,tS-0.3,0.4)));wc_year(ctx,64,80,"1874 · Bern",fin(t,tS-0.1,0.5));
  wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  wc_title(ctx,S,t,B+0.6,"One person, many systems","four ways to share the person, and the lightest that works","Film 7 of 9 · master and reference data");});

/* ---------- 2. Applying again ---------- */
// Linh, on the path; her two student records on the left, nothing linking them; the application on the right, and the record it
// would make; then the four systems in a row along the top
const M7_LIX=800,M7_LIY=1018,M7_OLD=[150,144,440,120],M7_NEW=[150,304,440,120],M7_AX=1180,M7_AW=700,M7_GHR=[1320,452,540];
const M7_SROW=[60,520,980,1440],M7_SRW=420,M7_SRY=150;
const M7_NOLINK=(()=>{const o=[];for(let i=0;i<=20;i++){const a=Math.PI/2-i/20*Math.PI;o.push([596+52*Math.cos(a),284+80*Math.sin(a)]);}return o;})(),M7_NOX=648,M7_NOY=284;
scene("again",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tT=c("today"),tName=w("today","Linh Nguyen"),tPhd=w("today","a PhD"),tL=c("last"),tSec=w("last","second student"),tNum=w("last","number"),tLnk=w("last","linked"),tTwo=w("last","the two"),
    tSt=c("still"),tApp=w("still","application"),tCre=w("still","creates a person"),tNob=w("still","nobody looks"),tF=c("four"),tSys=[w("four","student system"),w("four","HR"),w("four","research office"),w("four","alumni office")];
  // the camera: Linh; her records; the application; out for the four systems
  m7_open(ctx,S,t,sc,"campus",[[0,960,540,1],[tT+0.6,900,560,1.06],[tL-0.3,760,500,1.08],[tSt-0.3,1000,500,1.03],[tF-0.3,960,540,1]]);
  const away=1-fin(t,tF-0.2,0.6);
  // the four systems that need to know her, each with a line to her
  M7_SK.forEach((k,i)=>{const x=M7_SROW[i],x0=x+M7_SRW/2;wc_link(ctx,x0,M7_SRY+M7_SH+6,M7_LIX+(x0-M7_LIX)*0.08,M7_LIY-520,WC_ROLE[M7_SYS[k][0]],{p:clamp((t-tSys[i]-0.1)/0.7,0,1),vertical:true,a:0.8});
    arrive(ctx,x0,M7_SRY+M7_SH/2,t,tSys[i]-0.25,()=>m7_sys(ctx,k,x,M7_SRY,M7_SRW),{dy:16});});
  if(away>0.01)withA(ctx,away,()=>{
    // her two student records: the one she graduated with, and the one her last application made
    arrive(ctx,370,204,t,tL,()=>wc_roleCard(ctx,M7_OLD[0],M7_OLD[1],M7_OLD[2],M7_OLD[3],"student","Student","S-17142",null,{note:"bachelor's · 2019–22"}),{dy:16});
    arrive(ctx,370,364,t,tSec-0.2,()=>{wc_roleCard(ctx,M7_NEW[0],M7_NEW[1],M7_NEW[2],M7_NEW[3],"student","Student",null,null,{note:"master's · from Jul 2025"});m7_stampOn(ctx,t,M7_NEW[0]+M7_NEW[2]-128,M7_NEW[1]+38,tNum,"S-20436",0.52);},{dy:16});
    // nothing linked the two: a pencil line from the new one towards the old that stops halfway, at a cross, as One person, many roles left her
    wc_pencil(ctx,M7_NOLINK,clamp((t-tLnk)/0.7,0,1)*0.5,{col:WC_PENCIL,lw:3,a:0.85,seed:91});wc_cross(ctx,M7_NOX,M7_NOY,46,WC_NO,clamp((t-tTwo)/0.5,0,1));
    arrive(ctx,773,284,t,tTwo+0.4,()=>wc_badge(ctx,684,284,"not linked"),{dy:8});
    // the application still creates a person first: an empty record, and the stamp over its number
    arrive(ctx,M7_AX+M7_AW/2,206,t,tApp-0.3,()=>m7_app(ctx,M7_AX,144,M7_AW,{sub:"PhD · health informatics",nof:true}),{dy:16});
    m7_arrow(ctx,1360,276,1360,442,clamp((t-tCre)/0.6,0,1),{col:WC_ROLEINK.applicant,lw:3.2});
    arrive(ctx,1360,360,t,tCre+0.3,()=>wc_tag(ctx,1360,360,"creates a person first",{align:"center",col:WC_ROLEINK.applicant}),{dy:8});
    arrive(ctx,M7_GHR[0]+M7_GHR[2]/2,M7_GHR[1]+60,t,tCre+0.2,()=>m7_ghostRec(ctx,M7_GHR[0],M7_GHR[1],M7_GHR[2],"PhD"),{dy:16});
    const sx=M7_GHR[0]+M7_GHR[2]-126;arrive(ctx,sx,400,t,tCre+0.6,()=>m7_stamper(ctx,sx,M7_GHR[1]-16-6*Math.sin(t*2.4),0.9,1),{dy:-30});
    arrive(ctx,1590,612,t,tNob,()=>wc_tag(ctx,1590,612,"a third number?",{align:"center"}),{dy:8});});
  // Linh, in pencil, on the path
  arrive(ctx,M7_LIX,M7_LIY-300,t,tT-0.5,()=>person(ctx,"linh",M7_LIX,M7_LIY,1.02,{pose:"stand",expr:t>tSt+0.5&&t<tF?"concerned":"calm",t}),{d:0.9,from:0.97});
  arrive(ctx,340,502,t,tName-0.2,()=>{wc_panel(ctx,150,446,380,112,{kind:"card"});wc_T(ctx,"Linh Nguyen",180,494,{w:800,size:32,col:WC_DARK});
    withA(ctx,fin(t,tPhd,0.5),()=>wc_T(ctx,"planning a PhD",180,536,{w:600,size:28,col:WC_MUTED}));},{dy:12});
  m7_close(ctx,S);
  wc_year(ctx,64,80,"late 2025 · the university",fin(t,0.3,0.6));wc_paperOver(ctx,S);});

/* ---------- 3. Four ways ---------- */
const m7_wcx=i=>M7_WX[i]+160;
scene("ways",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tN=c("noor"),tFour=w("noor","four ways"),tR=c("registry"),tKn=w("registry","knows"),tAsk=w("registry","asks each"),tC=c("copy"),tGa=w("copy","gathers"),tRep=w("copy","reports"),
    tM=c("master"),tBk=w("master","read back"),tCe=c("central"),tCr=w("central","creates every");
  // the camera: Noor and her wall; in on each card as it's named; out again
  m7_open(ctx,S,t,sc,"office",[[0,960,540,1],[tR-0.4,m7_wcx(0),352,1.5],[tC-0.4,m7_wcx(1),352,1.5],[tM-0.4,m7_wcx(2),352,1.5],[tCe-0.4,m7_wcx(3),352,1.5],[tCe+2.2,960,540,1]]);
  // the four cards, pinned up as she lays them out; each named, and its diagram drawn, as it's said
  const on=[tR,tC,tM,tCe],dq=[[tKn-0.2,1.3],[tGa-0.2,1.2],[tBk-0.3,1.3],[tCr-0.3,1.2]];
  M7_WX.forEach((x,i)=>arrive(ctx,x+160,M7_WY+M7_WH/2,t,tFour-0.2+i*0.18,()=>m7_way(ctx,t,i,clamp((t-dq[i][0])/dq[i][1],0,1),{na:fin(t,on[i]-0.1,0.5),ask:i===0?tAsk:0,chart:i===1?clamp((t-tRep)/0.7,0,1):0}),{dy:16}));
  // Noor, a hand out to the wall as she lays them out; her name until the camera moves in. In the close-ups she'd be cut at the
  // frame's edge, so she steps back out of the picture while the camera is in, and is there again when it pulls out
  const ex=fin(t,tFour-0.6,0.6)*(1-fin(t,tR+0.5,0.6)),na=1-fin(t,tR-0.4,0.6)+fin(t,tCe+2.2,0.9);
  if(na>0.01)withA(ctx,clamp(na,0,1),()=>arrive(ctx,330,700,t,-0.3,()=>person(ctx,"noor",330,1010,0.95,{pose:"stand",pose2:"explain",mix:ex,expr:"calm",t}),{d:0.8}));
  withA(ctx,1-fin(t,tR-0.4,0.5),()=>arrive(ctx,240,150,t,tN,()=>{wc_panel(ctx,40,96,400,108,{kind:"card"});wc_T(ctx,"Noor Rahman",68,142,{w:800,size:32,col:WC_DARK});wc_T(ctx,"data architect",68,182,{w:600,size:28,col:WC_MUTED});},{dy:12}));
  m7_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 4. After the fact ---------- */
scene("after",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tTwo=w("have","first two"),tFact=w("late","after the fact"),tNei=w("late","Neither"),tDo=w("cost","last two"),tEv=w("cost","every system");
  m7_open(ctx,S,t,sc,"office",[[0,960,540,1]]);
  // the two being told about stand out, the other two step back; at the end, all four again
  const L=fin(t,tDo-0.3,0.5)*(1-fin(t,tEv+1.6,0.8)),R=fin(t,tTwo-0.2,0.5)*(1-fin(t,tDo-0.3,0.5)),dim=i=>1-0.55*(i<2?L:R);
  M7_WX.forEach((x,i)=>withA(ctx,dim(i),()=>m7_way(ctx,t,i,1,{chart:i===1?1:0})));
  // the first two are already here; both find Linh after the fact, and neither stops a third number
  [0,1].forEach(i=>{const x=m7_wcx(i),bw=Math.round(tw(ctx,"already here",28,700)+28);arrive(ctx,x,84,t,tTwo+0.1+i*0.25,()=>wc_badge(ctx,x-bw/2,84,"already here"),{dy:8});
    arrive(ctx,x,650,t,tFact+i*0.2,()=>withA(ctx,dim(i),()=>wc_tag(ctx,x,650,"after the fact",{align:"center"})),{dy:8});});
  arrive(ctx,890,728,t,tNei+0.2,()=>withA(ctx,dim(0),()=>wc_tag(ctx,890,728,"neither stops a third number",{align:"center"})),{dy:8});
  // the last two stop it, at a cost
  [2,3].forEach((i,k)=>{const x=m7_wcx(i);arrive(ctx,x,650,t,tDo+0.1+k*0.2,()=>m7_tickTag(ctx,x,650,"stops it",clamp((t-tDo-0.3-k*0.2)/0.4,0,1)),{dy:8});});
  arrive(ctx,1570,728,t,tEv+0.2,()=>wc_tag(ctx,1570,728,"every system that reads it changes",{align:"center"}),{dy:8});
  m7_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 5. The lightest that works ---------- */
// the coexistence card, grown: Linh, as the person, at the top; the four systems along the bottom
const M7_BIGX=[110,560,1010,1460],M7_BIGY=610,M7_BIGW=400,M7_BL=[960,470,0.5];
scene("lightest",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tW=c("which"),tTwo=w("doors","two doors"),tApp=w("doors","the application"),tHR=w("doors","HR"),tBack=w("those","read the person"),tLk=w("those","links are"),
    tBe=c("bern"),tLike=w("bern","Like Bern"),tEach=w("bern","Each system"),tShare=w("bern","share the person");
  // the coexistence card comes forward as the question is asked; then its diagram opens out into the picture, on plain paper:
  // its frame lifts away, the figure grows into Linh, each system's chip flies to its own card, and the arrows stretch with them
  const u=clamp((t-tW-1.2)/2.0,0,1),g=ease(clamp((u-0.05)/0.5,0,1));
  m7_open(ctx,S,t,sc,null,[[0,960,540,1],[tBe-0.3,960,520,1.03]]);
  if(g<1)m7_place(ctx,"office");if(g>0)m7_place(ctx,"plain",g);
  if(u<1){const oa=1-ease(clamp(u/0.3,0,1)),fa=1-ease(clamp(u/0.35,0,1)),lift=fin(t,tW+0.3,0.6),z=1+0.04*lift,CX=m7_wcx(2),CY=M7_WY+M7_WH/2,P=(x,y)=>[CX+(x-CX)*z,CY+(y-CY)*z];
    M7_WX.forEach((x,i)=>{if(i!==2&&oa>0.01)withA(ctx,oa,()=>m7_way(ctx,t,i,1,{chart:i===1?1:0}));});
    if(u<=0){ctx.save();ctx.translate(CX,CY);ctx.scale(z,z);ctx.translate(-CX,-CY);m7_way(ctx,t,2,1,{});ctx.restore();}
    else{const [lx,ly,ls]=M7_BL,mf=ease(clamp((u-0.05)/0.75,0,1)),mj=j=>ease(clamp((u-0.12-0.06*j)/0.6,0,1)),cyc=M7_WY+M7_CY,by=wc_bandY("linh",ls,ly,1)+10;
      if(fa>0.01)withA(ctx,fa,()=>{const zf=z*(1.25-0.25*fa);ctx.save();ctx.translate(CX,CY);ctx.scale(zf,zf);ctx.translate(-CX,-CY);m7_way(ctx,t,2,1,{frame:true});ctx.restore();});
      M7_SK.forEach((k,j)=>{const m=mj(j),sx=m7_chipX(2,j),a0=P(sx,cyc-6),a1=P(CX+(sx-CX)*0.3,M7_WY+238),x0=M7_BIGX[j]+M7_BIGW/2,y0=M7_BIGY-8,x1=lx+(x0-lx)*0.09;
        m7_arrow(ctx,lerp(a0[0],x0,m),lerp(a0[1],y0,m),lerp(a1[0],x1,m),lerp(a1[1],by,m),1,{start:true,lw:lerp(2.6,3,m)});});
      // drawn at Linh's own size and scaled, so the figure isn't painted afresh at every size on the way
      const f0=P(CX,M7_WY+232),ks=lerp(0.2*z,ls,mf)/ls;ctx.save();ctx.translate(lerp(f0[0],lx,mf),lerp(f0[1],ly,mf));ctx.scale(ks,ks);
      m7_shadow(ctx,"linh",ls,0.14*mf);wc_white(ctx,"linh",0,0,ls,m7_bands([1,1,1,1,0]),{shadow:false});ctx.restore();
      M7_SK.forEach((k,j)=>{const m=mj(j),sa=clamp((m-0.6)/0.4,0,1),ca=1-clamp((m-0.75)/0.25,0,1),x=M7_BIGX[j],c0=P(m7_chipX(2,j)-29,cyc);
        if(sa>0.01)withA(ctx,sa,()=>{const zz=lerp(0.92,1,sa),mx=x+M7_BIGW/2,my=M7_BIGY+M7_SH/2;ctx.save();ctx.translate(mx,my);ctx.scale(zz,zz);ctx.translate(-mx,-my);m7_sys(ctx,k,x,M7_BIGY,M7_BIGW);ctx.restore();});
        if(ca>0.01)withA(ctx,ca,()=>{const zc=lerp(z,1,m);ctx.save();ctx.translate(lerp(c0[0],x+16,m),lerp(c0[1],M7_BIGY+17,m)-Math.sin(Math.PI*m)*40);ctx.scale(zc,zc);
          wc_panel(ctx,0,0,58,40,{kind:"chip",role:WC_ROLE[M7_SYS[k][0]],seed:j+8});ctx.restore();});});}}
  if(u>=1)withA(ctx,1,()=>{const [lx,ly,ls]=M7_BL,lk=fin(t,tLk-0.2,0.8),pulse=Math.sin(Math.PI*clamp((t-tShare)/1.4,0,1));
    // they share the person: a light behind her as it's said
    if(pulse>0.01)wc_glowAt(ctx,lx,ly-160,260,[255,246,220],0.7*pulse);
    // the two where people are created read her back; the research and alumni offices turn to links
    M7_SK.forEach((k,i)=>{const x0=M7_BIGX[i]+M7_BIGW/2,y0=M7_BIGY-8,x1=lx+(x0-lx)*0.09,y1=wc_bandY("linh",ls,ly,1)+10;
      if(i<2)m7_arrow(ctx,x0,y0,x1,y1,1,{start:true,lw:3});
      else{withA(ctx,1-lk,()=>m7_arrow(ctx,x0,y0,x1,y1,1,{start:true,lw:3}));if(lk>0.01)withA(ctx,lk,()=>wc_link(ctx,x0,y0,x1,y1,WC_ROLE[M7_SYS[k][0]],{p:1,vertical:true,a:0.9,lw:3.4}));}});
    wc_white(ctx,"linh",lx,ly,ls,m7_bands([1,1,1,1,0]),{});
    // each system keeps its own: a lift for each in turn
    M7_SK.forEach((k,i)=>{const x=M7_BIGX[i],bob=clamp((t-tEach-0.1-i*0.15)/0.5,0,1),z=1+0.05*Math.sin(Math.PI*bob);
      ctx.save();ctx.translate(x+M7_BIGW/2,M7_BIGY+M7_SH/2);ctx.scale(z,z);ctx.translate(-(x+M7_BIGW/2),-(M7_BIGY+M7_SH/2));m7_sys(ctx,k,x,M7_BIGY,M7_BIGW);ctx.restore();});
    // the two doors where new people come in: the application's, and HR's
    [[0,tApp,WC_ROLE.applicant],[1,tHR,WC_ROLE.tutor]].forEach(([i,t0,col])=>arrive(ctx,M7_BIGX[i]+64,M7_BIGY+2,t,t0,()=>m7_door2(ctx,M7_BIGX[i]+64,M7_BIGY+6,col,1),{dy:12}));
    arrive(ctx,535,786,t,tTwo+0.3,()=>wc_tag(ctx,535,786,"where people are created",{align:"center"}),{dy:8});
    arrive(ctx,520,420,t,tBack+0.3,()=>wc_tag(ctx,520,420,"reads it back",{align:"center"}),{dy:8});
    arrive(ctx,1400,420,t,tLk+0.3,()=>wc_tag(ctx,1400,420,"links",{align:"center"}),{dy:8});
    const bw=Math.round(tw(ctx,"the lightest that works",28,700)+28);arrive(ctx,960,112,t,tLk+1.1,()=>wc_badge(ctx,960-bw/2,112,"the lightest that works"),{dy:8});
    // like Bern: the valley, small, in the corner
    arrive(ctx,1600,236,t,tLike-0.3,()=>{m7_inset(ctx,1376,104,448,1);wc_badge(ctx,1360,96,"like Bern");},{dy:14});});
  m7_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 6. Elsewhere ---------- */
scene("elsewhere",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tBk=c("bank"),tHv=w("bank","heavier"),tHub=w("bank","customer hub"),tProd=w("bank","every product"),tCt=c("country"),tReg=w("country","population register"),tAg=w("country","agencies");
  m7_open(ctx,S,t,sc,"plainB",[[0,960,540,1]]);
  arrive(ctx,960,96,t,tHv,()=>wc_tag(ctx,960,96,"a heavier way",{align:"center"}),{dy:8});
  // the organisation being told stands out; the other steps back
  const act=[1-fin(t,tCt-0.3,0.5),fin(t,tCt-0.3,0.5)],any=fin(t,tHub,0.5),pa=i=>1-0.55*any*(1-act[i]);
  M7_PAN.forEach(([x,ind,title,name,items],i)=>withA(ctx,pa(i),()=>{
    arrive(ctx,x+M7_PW/2,M7_PY+M7_PH/2,t,tBk+0.1+i*0.25,()=>{m7_panel(ctx,i);const bw=Math.round(tw(ctx,"centralised",28,700)+28);wc_badge(ctx,x+M7_PW-36-bw,M7_PY+43,"centralised");},{dy:16});
    const t0=i?tReg:tHub,t1=i?tAg:tProd;
    arrive(ctx,x+201,M7_PY+315,t,t0-0.2,()=>m7_hub(ctx,i,1),{dy:12});
    // read by every product system; asked by every agency
    items.forEach((it,k)=>{const cy=M7_PY+128+k*140;m7_arrow(ctx,x+372,M7_PY+315,x+446,cy+28,clamp((t-t1-k*0.25)/0.5,0,1),{lw:2.8});
      arrive(ctx,x+590,cy+28,t,t1+0.1+k*0.25,()=>m7_rchip(ctx,x+456,cy,ind,it),{dy:10});});}));
  m7_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 7. Search before create ---------- */
const M7_SAX=80,M7_SAY=240,M7_SAW=780,M7_FORK=[1170,428];
scene("search",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tCh=w("door","one change"),tSea=w("door","searches"),tF=[w("compares","the name"),w("compares","birth date"),w("compares","email"),w("compares","number from")],
    tMa=w("clear","clear match"),tRo=w("clear","adds a role"),tLi=w("clear","likely"),tMe=w("clear","Mei's office"),tNb=w("nobody","nobody"),tNw=w("nobody","new person");
  m7_open(ctx,S,t,sc,"plain",[[0,873,470,1.08],[tSea-0.5,960,540,1]]);
  // the application, its four fields lit as they're named; its door, in the applicant's colour
  const ah=m7_appH({});
  arrive(ctx,M7_SAX+M7_SAW/2,M7_SAY+ah/2,t,tCh-0.4,()=>m7_app(ctx,M7_SAX,M7_SAY,M7_SAW,{sub:"before it creates a person",fields:M7_FIELDS.map((f,i)=>[null,0,fin(t,tF[i]-0.1,0.4)])}),{dy:16});
  arrive(ctx,M7_SAX+M7_SAW-70,M7_SAY,t,tCh,()=>m7_door2(ctx,M7_SAX+M7_SAW-70,M7_SAY+6,WC_ROLE.applicant,1),{dy:10});
  // search first: an amber line from the application to where the outcomes part
  const sp=clamp((t-tSea+0.1)/0.7,0,1);if(sp>0){ctx.save();ctx.strokeStyle=rgba(WC_ROLE.applicant,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();
    ctx.moveTo(M7_SAX+M7_SAW+6,M7_FORK[1]);ctx.lineTo(lerp(M7_SAX+M7_SAW+6,M7_FORK[0],ease(sp)),M7_FORK[1]);ctx.stroke();ctx.restore();}
  arrive(ctx,1015,374,t,tSea+0.2,()=>wc_tag(ctx,1015,374,"search first",{align:"center",col:WC_ROLEINK.applicant}),{dy:8});
  // the three outcomes, each in its lane as it's said
  const lane=(i,t0)=>{wc_link(ctx,M7_FORK[0]+30,M7_FORK[1],1246,M7_LANES[i][1],WC_ROLE.applicant,{p:clamp((t-t0+0.2)/0.6,0,1),a:0.8});
    arrive(ctx,1450,M7_LANES[i][1],t,t0,()=>wc_T(ctx,M7_LANES[i][0],1450,M7_LANES[i][1]+10,{w:700,size:30,col:WC_DARK}),{dy:8});};
  lane(0,tMa);lane(1,tLi);lane(2,tNb);
  // found: the person she already is takes a new role
  const [,y0]=M7_LANES[0],[,y1]=M7_LANES[1],[,y2]=M7_LANES[2];
  arrive(ctx,1320,y0,t,tMa,()=>{wc_white(ctx,"linh",1320,y0+90,0.3,m7_bands([1,1,1,1,fin(t,tRo,0.6)]),{shadow:false});wc_tick(ctx,1400,y0-70,34,WC_ROLEINK.alumna,clamp((t-tRo)/0.4,0,1),4.5);},{dy:10});
  // likely: a card into Mei's queue
  arrive(ctx,1340,y1,t,tLi,()=>m7_queue(ctx,1256,y1-44,clamp((t-tMe)/0.8,0,1),t),{dy:10});
  // nobody: a new person, with her first role
  m7_lens(ctx,M7_FORK[0],M7_FORK[1],fin(t,tSea+0.5,0.4));
  arrive(ctx,1320,y2,t,tNb,()=>wc_white(ctx,"linh2",1320,y2+90,0.3,[{col:WC_ROLE.applicant,a:fin(t,tNw,0.6),i:0}],{shadow:false}),{dy:10});
  m7_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 8. Who may create a person ---------- */
scene("rule",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tWr=c("write"),tOnly=w("write","only the application"),tHR=w("write","HR"),tA=c("add"),tRes=w("add","research"),tAl=w("add","alumni"),tRo=w("add","add roles"),tTh=w("add","already there");
  m7_open(ctx,S,t,sc,"office",[[0,960,540,1],[tA-0.3,980,470,1.05]]);
  arrive(ctx,960,416,t,tWr+0.2,()=>m7_rule(ctx,t,{rows:[tOnly+0.2,tHR+0.1,tRes+0.1,tAl+0.1],mei:tRo,tick:tTh+0.2}),{d:0.9,from:0.97});
  // Noor, who writes it down with Mei; Mei, whose office looks after the person, agrees it
  arrive(ctx,240,700,t,-0.3,()=>person(ctx,"noor",240,1010,0.95,{pose:"stand",pose2:"explain",mix:fin(t,tWr+0.4,0.6)*(1-fin(t,tA,0.6)),expr:"calm",t}),{d:0.8});
  arrive(ctx,1700,700,t,tWr+0.3,()=>m7_person(ctx,"mei",1700,1010,0.95,{pose:"stand",pose2:"explain",mix:fin(t,tA-0.2,0.6),expr:t>tTh+0.6?"relieved":"calm",t,flip:true}),{d:0.9,from:0.96});
  arrive(ctx,1675,304,t,tWr+0.8,()=>{wc_panel(ctx,1510,250,330,108,{kind:"card"});wc_T(ctx,"Mei Tanaka",1538,296,{w:800,size:32,col:WC_DARK});wc_T(ctx,"registrar's office",1538,336,{w:600,size:28,col:WC_MUTED});},{dy:12});
  m7_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 9. Found ---------- */
const M7_FX=1050,M7_FY=120,M7_FW=820,M7_V9=["Linh Nguyen","14 Mar 2001","linh.nguyen@mail.example","S-20436"];
scene("found",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tAp=c("applies"),tLa=w("applies","Linh applies"),tFi=w("finds","finds her"),tMk=[w("finds","finds her")+0.4,w("finds","birth date"),w("finds","same email"),w("finds","student number")],
    tAppl=w("adds","applicant"),tNo=w("adds","No new number"),tMg=w("adds","nothing to merge");
  m7_open(ctx,S,t,sc,"campus",[[0,960,540,1]]);
  const LX=560,LY=960,LS=0.92,BY=wc_bandY("linh",LS,LY,4);
  // the search's line, from the application to the person it finds; the role it adds, beside her
  wc_link(ctx,M7_FX-6,M7_FY+170,LX+62,LY-430,WC_ROLE.applicant,{p:clamp((t-tFi)/0.8,0,1),a:0.85});
  wc_link(ctx,LX+70,BY,700,BY,WC_ROLE.applicant,{p:clamp((t-tAppl-0.2)/0.4,0,1),a:0.85});
  // Linh, as the person, with her roles; the applicant's band painted in
  wc_white(ctx,"linh",LX,LY,LS,m7_bands([1,1,1,1,fin(t,tAppl-0.1,0.6)]),{});
  arrive(ctx,M7_FX+M7_FW/2,M7_FY+211,t,tAp-0.3,()=>m7_app(ctx,M7_FX,M7_FY,M7_FW,{sub:"PhD · health informatics",fields:M7_V9.map((v,i)=>[v,clamp((t-tLa-i*0.4)/0.5,0,1),0,1,clamp((t-tMk[i])/0.4,0,1)]),
    foot:"found: Linh Nguyen",found:clamp((t-tFi-0.6)/1.0,0,1)}),{dy:16});
  arrive(ctx,960,BY,t,tAppl+0.2,()=>wc_chip(ctx,700,BY-28,520,56,"applicant","Applicant","PhD · from Oct 2026",{}),{dy:10});
  // the stamp that would have made a third number lifts away, and its empty record with it
  const lift=ease(clamp((t-tNo+0.1)/1.0,0,1)),ga=1-fin(t,tNo+0.2,0.7);
  if(ga>0.01)withA(ctx,ga,()=>m7_ghostRec(ctx,1330,700,520,"PhD",{paper:true}));
  // a little paper light behind the stamp, so it reads against the houses
  const sy=700-16-6*Math.sin(t*2.4)-lift*320;if(lift<1)wc_glowAt(ctx,1724,sy-50,110,WC_CARD,0.8*(1-lift));
  m7_stamper(ctx,1724,sy,0.8,1-lift);
  arrive(ctx,1500,640,t,tNo+0.3,()=>wc_tag(ctx,1500,640,"no new number",{align:"center"}),{dy:8});
  arrive(ctx,1500,736,t,tMg+0.2,()=>wc_tag(ctx,1500,736,"nothing to merge later",{align:"center"}),{dy:8});
  m7_close(ctx,S);
  wc_year(ctx,64,80,"October 2026 · the university",fin(t,0.3,0.6));wc_paperOver(ctx,S);});

/* ---------- 10. Kept apart ---------- */
scene("apart",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tO=c("other"),tAn=w("other","another Linh"),tYr=w("born","another year"),tMl=w("born","another email"),tNv=w("born","never studied"),
    tAg=w("only","name agrees"),tNp=w("only","new person"),tOwn=w("only","own number");
  m7_open(ctx,S,t,sc,"campus",[[0,960,540,1]]);
  wc_white(ctx,"linh",290,960,0.92,m7_bands([1,1,1,1,1]),{});
  // the search lays the new application beside the person it might be
  arrive(ctx,M7_CX+M7_CW/2,M7_CT+213,t,tAn-0.1,()=>m7_compare(ctx,t,{rows:[tAn+0.5,tYr,tMl,tNv]}),{dy:16});
  arrive(ctx,M7_CX+M7_CW/2,640,t,tAg,()=>wc_tag(ctx,M7_CX+M7_CW/2,640,"only the name agrees",{align:"center"}),{dy:8});
  // the other Linh Nguyen, in pencil with her phone; a person of her own once nobody matches
  const NX=1660,NY=1000,NS=0.86,wp=fin(t,tNp-0.1,0.9);
  if(wp<1)withA(ctx,1-wp,()=>arrive(ctx,NX,NY-260,t,tO-0.4,()=>person(ctx,"linh2",NX,NY,NS,{pose:"stand",pose2:"phone",mix:fin(t,tO+0.2,0.6),expr:"calm",t}),{d:0.9,from:0.97}));
  wc_white(ctx,"linh2",NX,NY,NS,[{col:WC_ROLE.applicant,a:fin(t,tNp+0.4,0.6),i:0}],{a:wp});
  // her card: her name while she applies; then her own record, with a number of her own
  const rc=fin(t,tNp+0.2,0.5);
  withA(ctx,1-rc,()=>arrive(ctx,1630,206,t,tAn,()=>{wc_panel(ctx,1410,150,440,112,{kind:"card"});wc_T(ctx,"Linh Nguyen",1440,198,{w:800,size:32,col:WC_DARK});
    wc_T(ctx,"applying for a bachelor's",1440,240,{w:600,size:28,col:WC_MUTED});},{dy:12}));
  if(rc>0.01)withA(ctx,rc,()=>{wc_roleCard(ctx,1410,150,440,120,"applicant","Applicant",null,null,{note:"bachelor's · from Oct 2026"});m7_stampOn(ctx,t,1410+440-118,150+38,tOwn,"S-21907",0.52);});
  arrive(ctx,1630,330,t,tNp+0.6,()=>wc_tag(ctx,1630,330,"a new person",{align:"center"}),{dy:8});
  m7_close(ctx,S);
  wc_year(ctx,64,80,"October 2026 · the university",1);wc_paperOver(ctx,S);});

/* ---------- 11. The person, published ---------- */
scene("product",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tPer=w("behind","the person"),tDp=w("behind","data product"),tOw=w("behind","owned by"),tCo=c("contract"),tCn=w("contract","contract"),tVe=w("contract","new version"),tNo=w("contract","nothing that reads"),
    tTo=c("tools"),tGov=w("tools","governs"),tWho=w("tools","who may read"),tSy=c("synced"),tSt=w("synced","synced table"),tAp=w("synced","application"),tWa=w("synced","applicant waits");
  // the camera: the product; out for its settings. Then the tools step back for the synced table and the application
  m7_open(ctx,S,t,sc,"plain",[[0,520,430,1.22],[tCo-0.4,960,470,1]]);
  arrive(ctx,420,410,t,tPer-0.4,()=>m7_product(ctx,t,100,110,{badge:tDp,lit:[fin(t,tOw,0.5),fin(t,tCn,0.5),fin(t,tVe,0.5),fin(t,tNo,0.5)]}),{dy:16});
  // what the data platform holds for each promise, lit as each is said; it builds and tests it
  const back=1-0.55*fin(t,tSt-0.4,0.6);
  withA(ctx,back,()=>arrive(ctx,1330,275,t,tCo-0.3,()=>m7_yaml(ctx,t,840,110,{tests:tTo,lit:[fin(t,tCo,0.5),fin(t,tNo,0.5),fin(t,tCn+0.1,0.5),fin(t,tVe,0.5)]}),{dy:16}));
  // and it governs who may read it
  withA(ctx,back,()=>arrive(ctx,1330,545,t,tGov-0.3,()=>m7_grant(ctx,t,840,470,{read:tWho}),{dy:16}));
  // a synced table serves the person to the application, while the applicant waits
  arrive(ctx,1060,716,t,tSt-0.3,()=>{wc_panel(ctx,840,660,440,112,{kind:"card",wash:[132,182,222],washA:0.22,seed:55});wc_T(ctx,"synced table",872,708,{w:800,size:30,col:WC_DARK});
    wc_T(ctx,"the person, for the search",872,750,{w:600,size:28,col:WC_MUTED});},{dy:12});
  m7_arrow(ctx,748,700,830,712,clamp((t-tSt)/0.5,0,1),{lw:3});
  m7_arrow(ctx,1290,716,1390,716,clamp((t-tAp)/0.5,0,1),{col:WC_ROLE.applicant,lw:3.4});
  arrive(ctx,1630,722,t,tAp,()=>m7_app(ctx,1400,660,460,{nof:true,sub:"searches before it creates"}),{dy:12});
  arrive(ctx,1630,836,t,tWa,()=>wc_tag(ctx,1630,836,"while the applicant waits",{align:"center"}),{dy:8});
  m7_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 12. One person, shared ---------- */
scene("shared",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tPo=w("bern","post office"),tRu=w("bern","shared the rules"),tHe=c("here"),tEa=w("here","each system"),tOne=w("here","one person"),tK=c("idea");
  const sw=fin(t,tHe-0.6,1.1);
  m7_open(ctx,S,t,sc,null,[[0,960,540,1]]);
  // Bern: each country kept its post office, and they shared the rules
  if(sw<1)withA(ctx,1-sw,()=>{m7_place(ctx,"valley");m7_territory(ctx,1,1);for(let i=0;i<7;i++)m7_po(ctx,i,{bob:clamp((t-tPo-i*0.12)/0.5,0,1)});
    m7_rules(ctx,1);m7_treaty(ctx,960,M7_PINY,M7_PINK);m7_pin(ctx,960,M7_PINY-M7_TH*M7_PINK/2+8);
    for(let i=0;i<7;i++){const u=clamp((t-tRu-i*0.08)/1.0,0,1);if(u<=0||u>=1)continue;const [x1,y1]=m7_poTop(i),x0=960,y0=M7_PINY+M7_TH*M7_PINK/2+4,ym=(y0+y1-8)/2,v=1-u;
      const bx=v*v*v*x0+3*v*v*u*x0+3*v*u*u*x1+u*u*u*x1,by=v*v*v*y0+3*v*v*u*ym+3*v*u*u*ym+u*u*u*(y1-8);ctx.save();ctx.fillStyle=rgba(WC_INK,0.9*Math.sin(Math.PI*u));ctx.beginPath();ctx.arc(bx,by,6,0,TAU);ctx.fill();ctx.restore();}});
  // here: each system keeps its records, and they share one person
  const rb=1-0.65*fin(t,tK-0.4,0.6),LX=960,LY=960,LS=0.92;
  if(sw>0)withA(ctx,sw,()=>{m7_place(ctx,"campus");
    withA(ctx,rb,()=>M7_SK.forEach((k,i)=>{const x=M7_SROW[i],x0=x+M7_SRW/2,y0=M7_SRY+M7_SH+6,x1=LX+(x0-LX)*0.1,y1=wc_bandY("linh",LS,LY,0)-12;
      if(i<2)m7_arrow(ctx,x0,y0,x1,y1,1,{start:true,lw:3});else wc_link(ctx,x0,y0,x1,y1,WC_ROLE[M7_SYS[k][0]],{p:1,vertical:true,a:0.9,lw:3.4});
      const bob=clamp((t-tEa-0.1-i*0.15)/0.5,0,1),z=1+0.05*Math.sin(Math.PI*bob);
      ctx.save();ctx.translate(x0,M7_SRY+M7_SH/2);ctx.scale(z,z);ctx.translate(-x0,-(M7_SRY+M7_SH/2));m7_sys(ctx,k,x,M7_SRY,M7_SRW);ctx.restore();}));
    const pulse=Math.sin(Math.PI*clamp((t-tOne)/1.4,0,1));if(pulse>0.01)wc_glowAt(ctx,LX,LY-300,320,[255,246,220],0.6*pulse);
    wc_white(ctx,"linh",LX,LY,LS,m7_bands([1,1,1,1,1]),{});});
  m7_close(ctx,S);
  wc_year(ctx,64,80,"1874 · Bern",fin(t,0.3,0.6)*(1-fin(t,tHe-0.6,0.5)));wc_paperOver(ctx,S);
  // the line, then carried down onto the end card, above the veil, landing where the card's own line fades in and takes it over
  const KL="Choose the lightest way that solves the problem.",kl=fin(t,tK-0.1,0.6),ky=lerp(128,420,fin(t,B+0.3,1.1)),kg=kl*(1-fin(t,B+0.8,0.9));
  if(kg>0.01){setScreen(ctx,S);withA(ctx,kg,()=>{ctx.save();ctx.translate(960,ky-16);ctx.scale(1,0.2);const g=ctx.createRadialGradient(0,0,10,0,0,700);
    g.addColorStop(0,rgba(WC_PAPER,0.94));g.addColorStop(0.7,rgba(WC_PAPER,0.7));g.addColorStop(1,rgba(WC_PAPER,0));ctx.fillStyle=g;ctx.fillRect(-700,-700,1400,1400);ctx.restore();});}
  wc_end(ctx,S,t,B+0.8,"One person, many systems",KL,"Film 7 of 9");
  if(kl>0.01&&t<B+2.4){setScreen(ctx,S);withA(ctx,kl,()=>wc_T(ctx,KL,960,ky,{w:700,size:48,align:"center",col:WC_DARK}));}});
