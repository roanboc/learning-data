/* ===== Who is it?: scenes =====
   Eleven chapters, as in ../script.md: Martin Guerre, taken in by his village and found out in court; master and reference data, told
   apart; what a master, or golden, record is; the duplicate check, which compares only records that share something; Linh's two
   student numbers, linked by Mei with a reason; HR's record of her, weighed thing by thing; the AI helper's note, and Mei's decision;
   the two Aishas, kept apart; five records, one person, nothing destroyed; hospitals, which unmerge; and the queue, the test and the
   tables that keep each decision.
   Drawn in watercolour (shared/src/wash.js), made to read on a phone (tools/legible.py): text is at least 28 px in the frame, and none
   sits under the captions. The camera moves in on whatever the narration is about, and every shot drifts slowly; things arrive with a
   spring. Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// the camera, as film 1 moves it (keys are [time, x, y, zoom], each move eased over d seconds), kept inside the place
function m2_focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z);x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// every scene's start and end: the place under the camera, and over it all, the paper
function m2_open(ctx,S,t,sc,place,keys,o){o=o||{};setScreen(ctx,S);ctx.save();const cam=m2_focus(ctx,t,keys,o.d||1.6);drift(ctx,t,sc,{z:o.z==null?0.018:o.z,x:o.dx||960,y:o.dy||560});
  if(place)m2_place(ctx,place);return cam;}
function m2_close(ctx,S){ctx.restore();setScreen(ctx,S);}
// a pencil arrow from (x0,y) to (x1,y), drawn on as p goes 0 to 1
function m2_arrow(ctx,x0,y,x1,p){if(p<=0)return;const x=lerp(x0,x1,ease(clamp(p,0,1)));ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.9);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x,y);ctx.stroke();if(p>0.6){const s=12*clamp((p-0.6)/0.4,0,1);ctx.beginPath();ctx.moveTo(x-s,y-s*0.8);ctx.lineTo(x,y);ctx.lineTo(x-s,y+s*0.8);ctx.stroke();}ctx.restore();}
// a dashed pencil line under something that isn't so, only supposed
function m2_dashUnder(ctx,x,y,w,a){ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.8*(a==null?1:a));ctx.lineWidth=2.4;ctx.setLineDash([9,8]);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.stroke();ctx.restore();}
// the score's band, ringed in pencil: i is 0 keep apart, 1 a person decides, 2 link, on a gauge at (x,y), w wide
function m2_ringBand(ctx,x,y,w,i,p,seed){const b=[[0,60],[60,90],[90,100]][i],cx=x+w*(b[0]+b[1])/200,rx=[110,150,60][i];wc_ring(ctx,cx,y-28,rx,30,p,{seed:seed||27});}
// a typed line, left-aligned from the middle it will have when it's whole, so it doesn't drift as it's typed
function m2_handC(ctx,s,cx,y,o){const x=cx-tw(ctx,s,o.size||32,o.w||600)/2;wc_hand(ctx,s,x,y,o);}

/* ---------- 1. Taken for one ---------- */
// the road's middle at x, where a walker's feet go; a walk at v px a second from x0 towards x1, from t0: where they are, how far
// they've walked, and whether they're still walking
function m2_roadY(x){const P=[[600,882],[800,886],[1040,880],[1300,870],[1560,862],[1820,856],[2080,852]];if(x<=P[0][0])return P[0][1];
  for(let i=1;i<P.length;i++)if(x<=P[i][0])return lerp(P[i-1][1],P[i][1],(x-P[i-1][0])/(P[i][0]-P[i-1][0]));return P[P.length-1][1];}
function m2_walkX(t,t0,x0,x1,v){const d=Math.abs(x1-x0),s=clamp((t-t0)*v,0,d);return[x0+Math.sign(x1-x0)*s,s,s>0&&s<d];}
// the height of a person of Artigat whose feet are at y: nearer is lower in the frame, and larger
const m2_hAt=y=>200*(y-600)/300;
scene("guerre",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tMar=w("left","Martin"),tLeft=w("left","left his"),tWife=w("left","Bertrande"),tBack=c("back"),tKnew=w("back","He knew"),tHouse=w("back","the house"),tFam=w("back","the family"),
    tSto=w("back","their stories"),tIn=w("back","took him"),tUnc=c("court"),tCourt=w("court","In court"),tWit=w("court","a hundred"),tAgree=w("court","couldn't"),
    tApp=c("leg"),tLean=w("leg","leaned"),tMan=w("leg","a man with"),tReal=w("leg","the real"),tTwo=c("two"),tSo=w("two","so much");
  const inCourt=fin(t,tCourt-0.1,0.8);
  // Artigat, 1548: Martin and Bertrande at their door, his uncle by the house; Martin leaves along the road. Eight years later a man
  // comes back along it, knowing everything Martin knew, and is taken in; the uncle comes to doubt him
  if(inCourt<1){m2_open(ctx,S,t,sc,"village",[[0,560,720,1.6],[tLeft-0.4,711,620,1.3],[tUnc-0.5,600,660,1.42]]);
    const doubt=fin(t,tUnc,0.9),took=fin(t,tIn,0.9);
    m2_folk(ctx,"bertrande",452,894,m2_hAt(894)*0.93,{sway:0.03*took});
    // Martin, leaving: he turns and walks out of the village along the road, past the edge of the shot
    const [mx,md,mw]=m2_walkX(t,tLeft-0.25,600,1640,175),my=m2_roadY(mx)+18;
    if(mx<1630)m2_folk(ctx,"martin",mx,my,m2_hAt(my),md>0?{side:true,phase:m2_stride(md,200)}:{});
    arrive(ctx,mx,my-m2_hAt(my)-34,t,tMar-0.3,()=>withA(ctx,1-fin(t,tLeft+0.7,0.5),()=>wc_tag(ctx,mx,my-m2_hAt(my)-34,"Martin Guerre",{align:"center"})),{dy:8});
    // the man who came back, along the same road, dressed as Martin was
    if(t>tBack+0.25){const [ax,ad,aw]=m2_walkX(t,tBack+0.25,1580,650,175),ay=m2_roadY(ax)+18;m2_folk(ctx,"arnaud",ax,ay,m2_hAt(ay),aw?{side:true,flip:true,phase:m2_stride(ad,200)}:{});
      // the village took him in: what it knew of Martin, he knew
      wc_link(ctx,1010,536,ax+6,ay-m2_hAt(ay)-14,WC_ROLEINK.alumna,{p:clamp((t-tIn)/0.7,0,1)*(1-fin(t,tUnc-0.5,0.5)),a:0.85,vertical:true,lw:3.4});}
    m2_folk(ctx,"uncle",230,902,m2_hAt(902),{sway:-0.05*doubt});
    arrive(ctx,452,664,t,tWife-0.3,()=>withA(ctx,1-fin(t,tBack-0.3,0.5),()=>wc_tag(ctx,452,664,"Bertrande",{align:"center"})),{dy:8});
    // what the village knew of Martin, ticked as the man shows he knows it
    const ka=1-fin(t,tUnc-0.5,0.5);if(ka>0.01)withA(ctx,ka,()=>arrive(ctx,1120,382,t,tKnew-0.3,()=>m2_knew(ctx,840,232,[fin(t,tHouse,0.4),fin(t,tFam,0.4),fin(t,tSto,0.4)]),{dy:14}));
    // his uncle comes to doubt him
    arrive(ctx,230,652,t,tUnc-0.1,()=>wc_tag(ctx,230,652,"his uncle",{align:"center"}),{dy:8});
    wc_hand(ctx,"?",330,676,{size:64,w:800,p:clamp((t-tUnc-0.4)/0.3,0,1),col:WC_INK});
    m2_close(ctx,S);}
  // the court: at Rieux, about 150 witnesses can't agree; on appeal at Toulouse, the judges lean his way until the real Martin Guerre
  // walks in, on a wooden leg. Two people, taken for one
  if(inCourt>0.001)withA(ctx,inCourt,()=>{m2_open(ctx,S,t,sc,"court",[[0,960,540,1],[tMan-0.3,1140,560,1.1],[tTwo-0.3,960,540,1]]);
    const lean=0.07*fin(t,tLean-0.2,1.0)*(1-fin(t,tMan+0.6,0.9))-0.03*fin(t,tMan+0.6,0.9);
    [[740,0],[960,1],[1180,2]].forEach(([x,v],i)=>m2_judge(ctx,x,470,0.62,lean*(1+0.12*(i-1)),v));m2_bench(ctx);
    // when what matched is the subject, the court goes quiet under a veil of paper; the two men stay clear
    const so=fin(t,tSo-0.3,0.6);m2_hush(ctx,0.5*so);
    m2_folk(ctx,"arnaud",400,912,410,{});
    if(t>tMan-0.1){const [rx,rd,rw]=m2_walkX(t,tMan-0.1,2060,1560,200);m2_folk(ctx,"real",rx,916,410,rw?{side:true,flip:true,phase:m2_stride(rd,410)}:{});}
    // the court's record of the witnesses
    const wa=1-fin(t,tApp-0.3,0.6);if(wa>0.01)withA(ctx,wa,()=>arrive(ctx,1550,275,t,tWit-0.3,()=>m2_witness(ctx,1250,110,clamp((t-tWit)/(tAgree+0.6-tWit),0,1)),{dy:16}));
    // who he said he was, struck through; who he was
    const nw=tw(ctx,"Martin Guerre",30,700)+40;
    arrive(ctx,400,462,t,tCourt+0.5,()=>{wc_tag(ctx,400,462,"Martin Guerre",{align:"center"});m2_strike(ctx,400,462,nw,clamp((t-tTwo-0.2)/0.5,0,1));},{dy:8});
    m2_handC(ctx,"Arnaud du Tilh",400,410,{size:36,w:700,p:clamp((t-tTwo-0.6)/0.9,0,1),col:WC_NO});
    arrive(ctx,1560,430,t,tReal-0.1,()=>wc_tag(ctx,1560,430,"the real Martin Guerre",{align:"center"}),{dy:8});
    // so much matched: what the village knew fits both men
    if(so>0.01)withA(ctx,so,()=>{m2_knew(ctx,680,60,[1,1,1],{glow:fin(t,tSo+0.2,0.5)});
      wc_link(ctx,740,368,436,560,WC_ROLEINK.alumna,{p:clamp((t-tSo)/0.7,0,1),a:0.85,vertical:true,lw:3.4});wc_link(ctx,1180,368,1528,560,WC_ROLEINK.alumna,{p:clamp((t-tSo-0.15)/0.7,0,1),a:0.85,vertical:true,lw:3.4});});
    m2_close(ctx,S);});
  // the year and the place, in the corner
  setScreen(ctx,S);wc_year(ctx,64,80,"1548 · Artigat",fin(t,0.4,0.6)*(1-fin(t,tBack-0.3,0.4)));wc_year(ctx,64,80,"1556 · Artigat",fin(t,tBack,0.5)*(1-fin(t,tCourt-0.3,0.4)));
  wc_year(ctx,64,80,"1560 · Rieux",fin(t,tCourt+0.2,0.5)*(1-fin(t,tApp-0.3,0.4)));wc_year(ctx,64,80,"1560 · Toulouse",fin(t,tApp,0.5)*(1-fin(t,B+0.2,0.5)));
  wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  wc_title(ctx,S,t,B+0.6,"Who is it?","the golden record, and a match decided once","Film 2 of 9 · master and reference data");});

/* ---------- 2. Two words people confuse ---------- */
// a short list on its way to becoming master data: faculties, which get an owner and a history (g, 0 to 1), and the badge that says
// what they've become (m)
function m2_faculty(ctx,x,y,g,m){const w=520,h=lerp(108,200,ease(g));wc_panel(ctx,x,y,w,h,{kind:"card",seed:29});wc_T(ctx,"faculty",x+28,y+46,{w:800,size:30,col:WC_DARK});
  wc_T(ctx,"Health · Science · Arts",x+28,y+88,{w:600,size:28,col:WC_MUTED});
  withA(ctx,clamp(g*2,0,1),()=>wc_T(ctx,"owner · the dean's office",x+28,y+136,{w:600,size:28,col:WC_INK}));
  withA(ctx,clamp(g*2-1,0,1),()=>wc_T(ctx,"since 1998 · renamed 2021",x+28,y+178,{w:600,size:28,col:WC_INK}));
  if(m>0.01)withA(ctx,m,()=>wc_badge(ctx,x+w-196,y+44,"master data"));}
scene("words",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tF=c("first"),tTwo=w("first","two words"),tM=c("master"),tLinh=w("master","Linh"),tAw=w("master","an award"),tSup=w("master","a supplier"),tMet=w("master","a meter"),
    tMany=c("many"),tGrow=w("many","always"),tMatch=w("many","matched"),tR=c("ref"),tCo=w("ref","countries"),tRt=w("ref","role types"),tSt=w("ref","statuses"),
    tFew=w("ref","Few rows"),tRare=w("ref","rarely"),tOut=w("ref","often"),tT=c("test"),tAsk=w("test","is this"),tThen=w("test","Then it's"),tP=c("pick"),tPk=w("pick","pick a value"),
    tRef=w("pick","it's reference"),tL=c("line"),tList=w("line","a list"),tOwn=w("line","owners"),tLife=w("line","a life"),tFac=w("line","like faculties"),tBec=w("line","becomes");
  // the camera: both shelves; towards master data as it's described, then reference data; the test; both again
  m2_open(ctx,S,t,sc,"plain",[[0,960,540,1],[tM-0.4,700,500,1.14],[tR-0.4,1220,500,1.14],[tT-0.4,960,520,1.04],[tL-0.4,960,540,1]]);
  // while the test is asked, the shelves step back
  const dimT=fin(t,tT-0.4,0.6)*(1-fin(t,tL-0.3,0.6));
  const head=(x,s,sub,t0,ts)=>arrive(ctx,x,172,t,t0,()=>{wc_T(ctx,s,x,172,{w:800,size:44,align:"center",col:WC_DARK});withA(ctx,fin(t,ts,0.5),()=>wc_T(ctx,sub,x,218,{w:600,size:28,align:"center",col:WC_MUTED}));},{dy:12});
  withA(ctx,1-0.78*dimT,()=>{
    head(520,"master data","the things the business is about",tTwo-0.2,tM+0.3);head(1400,"reference data","the short lists that sort them",tTwo+0.3,tR+0.3);
    m2_shelf(ctx,150,740,620,(t-tM+0.2)/0.7);m2_shelf(ctx,1030,740,620,(t-tR+0.2)/0.7);
    // master data: Linh, the person, in white paper with her roles' colours; an award; a supplier's crate; a meter
    wc_white(ctx,"linh",250,616,0.46,m2_bands([1,1,1,1]),{a:fin(t,tLinh-0.1,0.6)});
    arrive(ctx,440,560,t,tAw-0.1,()=>m2_scroll(ctx,440,618),{dy:20});arrive(ctx,630,560,t,tSup-0.1,()=>m2_crate(ctx,630,618),{dy:20});arrive(ctx,810,560,t,tMet-0.1,()=>m2_meter(ctx,810,618),{dy:20});
    [["Linh",250,tLinh],["an award",440,tAw],["a supplier",630,tSup],["a meter",810,tMet]].forEach(([s,x,t0])=>arrive(ctx,x,690,t,t0+0.1,()=>wc_T(ctx,s,x,700,{w:700,size:28,align:"center",col:WC_INK}),{dy:8}));
    m2_tags(ctx,t,160,772,720,[["many rows",tMany],["always growing",tGrow],["matched across systems",tMatch]]);
    // reference data: three short lists; the countries come from outside, from a standard
    [["country",["Australia","Vietnam","France"],tCo],["role type",["student","tutor","researcher"],tRt],["status",["active","on leave","graduated"],tSt]].forEach(([hd,it,t0],i)=>{const x=1036+i*252;
      arrive(ctx,x+116,515,t,t0-0.1,()=>m2_list(ctx,x,414,232,hd,it,-1,null,0),{dy:20});});
    arrive(ctx,1100,392,t,tOut+0.3,()=>wc_badge(ctx,1046,392,"ISO 3166"),{dy:8});
    m2_tags(ctx,t,1040,772,720,[["few rows",tFew],["rarely changing",tRare],["often from outside",tOut]]);});
  // the test: would you ever ask whether this one is the same as that one?
  const ta=fin(t,tT-0.3,0.6)*(1-fin(t,tL-0.3,0.6));
  if(ta>0.01)withA(ctx,ta,()=>{wc_panel(ctx,330,300,1260,320,{kind:"sheet",seed:21});
    wc_T(ctx,typeOn("“is this the same one as that?”",clamp((t-tAsk+0.1)/0.9,0,1)),380,410,{w:700,size:36,col:WC_DARK});
    m2_arrow(ctx,1010,398,1140,clamp((t-tThen)/0.4,0,1));arrive(ctx,1278,398,t,tThen+0.2,()=>wc_tag(ctx,1170,398,"master data",{size:30,w:800}),{dy:8});
    wc_T(ctx,typeOn("only pick a value from a list",clamp((t-tPk+0.1)/0.9,0,1)),380,530,{w:700,size:36,col:WC_DARK});
    m2_arrow(ctx,1010,518,1140,clamp((t-tRef)/0.4,0,1));arrive(ctx,1302,518,t,tRef+0.2,()=>wc_tag(ctx,1170,518,"reference data",{size:30,w:800}),{dy:8});});
  // a list that gets owners and a life of its own: faculties. It moves over from the reference side as it grows, and becomes master data
  const fx=lerp(1180,700,easeCam(clamp((t-tOwn+0.2)/1.6,0,1)));
  if(t>tList-0.3)arrive(ctx,fx+260,330,t,tList-0.3,()=>m2_faculty(ctx,fx,262,clamp((t-tOwn)/(tFac-tOwn),0,1),fin(t,tBec+0.3,0.5)),{dy:16});
  m2_arrow(ctx,690,312,600,clamp((t-tBec)/0.5,0,1));
  m2_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 3. A golden record ---------- */
// Linh's five records, where each stands beside the master record: which side
const M2_GSRC=[["old",60,150,0],["new",60,330,0],["alumna",60,510,0],["tutor",1420,240,1],["researcher",1420,420,1]];
scene("golden",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tB=c("builds"),tGold=w("builds","golden"),tId=c("id"),tCh=w("id","never changes"),tRe=w("id","never reused"),tBest=c("best"),tLab=w("best","labelled"),
    tLk=c("links"),tKept=w("links","each kept"),tU=c("undo"),tVal=w("undo","value by value"),tUn=w("undo","undone"),tLbl=w("undo","link by link");
  // the camera: the master record; in on its ID; out for its links
  m2_open(ctx,S,t,sc,"plain",[[0,960,540,1],[tId-0.4,960,420,1.16],[tBest-0.3,960,560,1.06],[tLk-0.4,960,540,1]]);
  const M=M2_MR;
  // undone, link by link: the alumni office's link comes off, and is made again
  const un=easeCam(clamp((t-tLbl)/0.6,0,1))*(1-easeCam(clamp((t-tLbl-1.6)/0.6,0,1)));
  M2_GSRC.forEach(([k,x,y,right],i)=>{const t0=tLk+0.1+i*0.18,role=M2_RECI[k][0],off=k==="alumna"?-56*un:0,yy=y+58;
    const ex=right?x-8:x+440+8+off,mx=right?M.x+M.w+8:M.x-8;
    wc_link(ctx,ex,yy,mx,lerp(yy,M.y+M.h/2,0.35),WC_ROLE[role],{p:clamp((t-t0-0.3)/0.6,0,1)*(k==="alumna"?1-0.8*un:1),a:0.85,lw:3.4,dash:k==="alumna"&&un>0.02?[10,9]:null});
    arrive(ctx,x+220,yy,t,t0,()=>m2_rec(ctx,k,x+off,y,440),{dy:14});});
  arrive(ctx,280,92,t,tKept-0.1,()=>wc_tag(ctx,280,92,"each kept as it arrived",{align:"center"}),{dy:8});
  // the master record: the person, in white paper; an ID of its own, stamped on; the best value of each detail, and where it came from
  arrive(ctx,M.x+M.w/2,M.y+M.h/2,t,tB-0.3,()=>m2_master(ctx,t,{gold:fin(t,tGold,0.5),ts:tId+0.4,rows:[0,1,2].map(i=>fin(t,tBest+0.3+i*0.45,0.5)),srcs:[0,1,2].map(i=>fin(t,tLab+0.2+i*0.3,0.5))}),{d:0.9,from:0.96});
  arrive(ctx,945,410,t,tCh,()=>wc_tag(ctx,830,410,"never changes",{size:28,w:600}),{dy:8});
  arrive(ctx,1188,410,t,tRe,()=>wc_tag(ctx,1080,410,"never reused",{size:28,w:600}),{dy:8});
  // explained, value by value: the work email, ringed, and the record it came from
  const ex=fin(t,tVal-0.2,0.5)*(1-fin(t,tLbl+1.8,0.6));
  if(ex>0.01)withA(ctx,ex,()=>{wc_ring(ctx,M.x+257,M.y+364+200+62,250,34,clamp((t-tVal+0.1)/0.7,0,1),{seed:17});
    wc_link(ctx,M.x+M.w-20,M.y+364+200+30,1412,298,WC_ROLE.tutor,{p:clamp((t-tVal)/0.6,0,1),a:0.95,lw:4.4,dash:[],vertical:false});});
  m2_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 4. The duplicate check ---------- */
// a record, as a dot of its system's colour, painted once and kept
function m2_recDot(ctx,x,y,col,s){const c=wc_kept("dot"+col.join("-"),40,40,q=>wc_wash(q,wc_ell(20,20,10,10,16),col,{kind:"dab",lw:1.2,seed:col[0]}));ctx.drawImage(c,x-20*s,y-20*s,40*s,40*s);}
scene("check",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tL=c("linh"),tNew=w("linh","a new student"),tR=c("runs"),tDup=w("runs","a duplicate check"),tAcr=w("runs","across"),tBil=c("billion"),tFif=w("billion","Fifty"),tPairs=w("billion","over a billion"),
    tSh=c("share"),tEm=w("share","an email"),tNum=w("share","a number"),tBy=w("share","a birth year"),tTh=c("three"),tProp=w("three","proposes"),tMei=w("three","Mei's office"),tStew=w("three","the steward"),tHere=w("three","Here are");
  m2_open(ctx,S,t,sc,"campus",[[0,960,540,1]]);
  m2_hush(ctx,0.84*fin(t,tR-0.4,0.8));
  // Linh, back to study under a new number, nothing linking it to her old one (as film 1 left her)
  const la=1-fin(t,tR-0.3,0.6);
  if(la>0.01)withA(ctx,la,()=>{arrive(ctx,960,700,t,-0.3,()=>person(ctx,"linh",960,1010,1.0,{pose:"stand",expr:"calm",t}),{d:0.8});
    arrive(ctx,400,358,t,tL-0.2,()=>m2_rec(ctx,"old",180,300,440),{dy:14});arrive(ctx,1520,358,t,tNew-0.1,()=>m2_rec(ctx,"new",1300,300,440),{dy:14});
    wc_link(ctx,1292,358,628,358,WC_PENCIL,{p:clamp((t-tNew-0.4)/0.7,0,1)*0.5,a:0.75});wc_cross(ctx,960,358,46,WC_NO,clamp((t-tNew-1.0)/0.5,0,1));});
  // the university's systems, each a column of its records; while Mei's queue is the subject, they step back
  const sa=fin(t,tR+0.2,0.6),dim=fin(t,tTh-0.3,0.6);
  if(sa>0.01)withA(ctx,sa*(1-0.8*dim),()=>{
    M2_SYS.forEach(([n,x,col],s)=>{arrive(ctx,x,226,t,tAcr-0.6+s*0.15,()=>wc_T(ctx,n,x,236,{w:700,size:28,align:"center",col:WC_DARK}),{dy:8});
      for(let i=0;i<M2_DOTS;i++){const [dx,dy]=m2_dot(s,i),p=fin(t,tAcr-0.5+s*0.15+i*0.03,0.3);if(p>0.01)withA(ctx,p,()=>m2_recDot(ctx,dx,dy,col,1));}});
    // every record against every other: over a billion pairs
    const wa=fin(t,tBil-0.2,1.0)*(1-fin(t,tSh-0.2,0.8));if(wa>0.01)withA(ctx,wa,()=>{ctx.drawImage(m2_web(),0,0);
      arrive(ctx,700,712,t,tFif-0.1,()=>wc_tag(ctx,700,712,"50,000 records",{align:"center",size:34,w:800}),{dy:8});
      arrive(ctx,1250,712,t,tPairs-0.1,()=>wc_tag(ctx,1250,712,"1,249,975,000 pairs",{align:"center",size:34,w:800}),{dy:8});});
    // only records that share something: an email, a number, or a birth year and a family name that sounds alike
    const kt=[tEm,tNum,tBy];M2_PAIRS.forEach(([a,b,k],i)=>m2_pairLine(ctx,a,b,k,clamp((t-kt[k]-0.1-(i%3)*0.12)/0.8,0,1)));
    const kw=M2_KEYS.map(s=>Math.round(tw(ctx,s,28,700)+110)),tot=kw.reduce((a,b)=>a+b,0)+48;let kx=960-tot/2;
    M2_KEYS.forEach((s,i)=>{const x=kx;arrive(ctx,x+kw[i]/2,772,t,kt[i]-0.1,()=>m2_keyChip(ctx,x,772,i),{dy:8});kx+=kw[i]+24;});
    arrive(ctx,960,140,t,tDup-0.1,()=>wc_tag(ctx,960,140,"duplicate check",{align:"center",size:32,w:800}),{dy:8});});
  // the pairs it proposes go to the person's queue, for Mei's office, the steward of the person; three of them are this story's
  arrive(ctx,960,395,t,tProp-0.2,()=>m2_queue(ctx,560,160,{rows:[0,1,2].map(i=>fin(t,tProp+0.3+i*0.2,0.4)),num:[0,1,2].map(i=>fin(t,tHere+0.2+i*0.3,0.3)),ghost:fin(t,tProp+1.0,0.6)}),{d:0.9,from:0.96});
  arrive(ctx,1700,700,t,tMei-0.5,()=>m2_person(ctx,"mei",1700,1010,0.92,{pose:"stand",expr:"calm",t,flip:true}),{d:0.9,from:0.96});
  arrive(ctx,1650,300,t,tStew-0.2,()=>m2_nameCard(ctx,1470,246,"Mei Tanaka","steward of the person"),{dy:12});
  m2_close(ctx,S);wc_year(ctx,64,80,"this term · the university",fin(t,0.3,0.6));wc_paperOver(ctx,S);});

/* ---------- 5. Back to study ---------- */
// her two student records, as the student system held them before its merge: the 2019 one, written without accents, and the 2025 one,
// checked against her passport
const M2_P1=[["Nguyen Thi Linh","2001-03-14","linh.nguyen2001@mail.example"],["NGUYỄN Thị Linh","2001-03-14","linh.nguyen@mail.example"]];
scene("first",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tP=c("pair"),tName=w("pair","Same name"),tDate=w("pair","same birth"),tS=c("score"),t93=w("score","scores 93"),tLine=w("score","over the line"),tTerm=c("term"),tChk=w("term","checks"),
    tBef=c("before"),tSt=w("before","studied here"),tLk=c("links"),tM=c("merge"),tOwn=w("merge","in its own");
  // the camera: in on the pair; out for the score; down to her application and Mei's decision; out for the merge
  m2_open(ctx,S,t,sc,"office",[[0,960,540,1],[tP+0.3,780,330,1.2],[tS-0.4,860,470,1.06],[tBef-0.4,820,610,1.08],[tM-0.4,960,540,1]]);
  // the registry's merge, in its own system: the two cards slide into one stack
  const mg=easeCam(clamp((t-tOwn+0.4)/1.4,0,1)),lx=lerp(120,470,mg),rx=lerp(840,490,mg),ry=lerp(120,138,mg),pre=1-fin(t,tOwn-0.5,0.5);
  arrive(ctx,400,224,t,tP-0.2,()=>m2_card(ctx,lx,120,560,"student","Student","S-17142",M2_P1[0],{seed:3}),{dy:14});
  arrive(ctx,1120,224,t,tP+0.3,()=>m2_card(ctx,rx,ry,560,"student","Student","S-20436",M2_P1[1],{seed:5}),{dy:14});
  // the same name, the same birth date
  withA(ctx,pre,()=>{wc_tick(ctx,rx+514,m2_rowY(ry,0)-10,32,WC_ROLEINK.alumna,clamp((t-tName)/0.4,0,1),4);wc_tick(ctx,rx+514,m2_rowY(ry,1)-10,32,WC_ROLEINK.alumna,clamp((t-tDate)/0.4,0,1),4);
    // Mei links them, and writes down why: a gold link between the two, and its decision's number
    wc_link(ctx,688,224,832,224,WC_BADGE,{p:clamp((t-tLk-0.3)/0.5,0,1),a:1,lw:5,dash:[]});arrive(ctx,760,224,t,tLk+0.8,()=>wc_badge(ctx,704,224,"D-005"),{dy:6});});
  // the score: 93 out of 100, over the line where a pair links on its own
  const ga=fin(t,tS-0.2,0.6)*(1-fin(t,tM-0.3,0.6));
  if(ga>0.01)withA(ctx,ga,()=>{m2_gauge(ctx,280,480,1000,93*easeCam(clamp((t-t93+0.7)/1.3,0,1)),{});m2_ringBand(ctx,280,480,1000,2,clamp((t-tLine)/0.7,0,1),29);});
  // in this first term, Mei's office checks the automatic links too
  arrive(ctx,780,690,t,tChk-0.2,()=>withA(ctx,1-fin(t,tBef-0.4,0.5),()=>wc_tag(ctx,780,690,"this first term: automatic links checked too",{align:"center",wash:WC_BADGE,washA:0.4})),{dy:8});
  // her application says she studied here before
  arrive(ctx,540,753,t,tBef-0.1,()=>m2_app(ctx,200,640,{ring:clamp((t-tSt)/0.8,0,1)}),{dy:14});
  // her decision, typed in
  arrive(ctx,1250,742,t,tLk-0.1,()=>m2_decision(ctx,940,600,620,M2_DEC.d5,clamp((t-tLk)/2.2,0,1)),{dy:14});
  arrive(ctx,750,390,t,tOwn+0.6,()=>wc_tag(ctx,750,390,"merged in the student system",{align:"center"}),{dy:8});
  m2_person(ctx,"mei",1760,1010,0.95,{pose:"stand",pose2:"explain",mix:fin(t,tLk-0.2,0.6)*(1-fin(t,tM,0.6)),expr:"calm",t,flip:true});
  m2_close(ctx,S);wc_year(ctx,64,80,"this term · Mei's office",fin(t,0.3,0.6));wc_paperOver(ctx,S);});

/* ---------- 6. One digit apart ---------- */
// what's compared, the new student record's value and HR's, what the matcher makes of it, and its weight
const M2_WROWS=[["given name","Linh","Linh","the same","+3.2",3.2],["family name","Nguyễn","Nguyen","the same, but common","+2.0",2.0],
  ["birth date","2001-03-14","2001-05-14","one digit apart","+2.4",2.4],["email","linh.nguyen@mail.example","linh.nguyen@uni.example","different","−0.4",-0.4]],M2_WY=[262,352,442,532];
scene("weights",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tSec=c("second"),tNew=w("second","her new"),tHR=w("second","HR's record"),tWg=c("weigh"),tAway=w("weigh","takes it"),tN=c("names"),tT=c("total"),tPer=w("total","so a person"),
    tFl=c("flip"),tAg=w("flip","agreed"),t93=w("flip","93");
  const rowT=[[w("names","Given name"),w("names","plus three")],[w("names","Family name"),w("names","plus two.")],[w("date","Birth date"),w("date","plus two point")],[w("date","Email"),w("date","minus")]];
  m2_open(ctx,S,t,sc,"plain",[[0,960,540,1],[tN-0.4,960,470,1.06],[tT-0.4,960,540,1]]);
  // if the birth dates agreed: HR's date as the student system has it, its weight, and the score it would make
  const fl=fin(t,tAg-0.1,0.5);
  arrive(ctx,960,368,t,tSec-0.2,()=>{wc_panel(ctx,140,96,1640,530,{kind:"sheet",seed:24});
    withA(ctx,fin(t,tNew-0.1,0.5),()=>m2_src(ctx,400,140,"student · S-20436",WC_ROLE.student));
    withA(ctx,fin(t,tHR-0.1,0.5),()=>m2_src(ctx,840,140,"HR · E-4417",WC_ROLE.tutor));
    withA(ctx,fin(t,tWg,0.5),()=>wc_T(ctx,"weight",1730,172,{w:700,size:28,align:"right",col:WC_MUTED}));
    M2_WROWS.forEach(([f,a,b,note,wt,v],i)=>{const [t0,t1]=rowT[i],ra=fin(t,t0-0.15,0.4),y=M2_WY[i],ff=i===2?fl:0;if(ra<=0.01)return;withA(ctx,ra,()=>{
      wc_T(ctx,f,190,y,{w:600,size:28,col:WC_MUTED});wc_T(ctx,a,400,y,{w:500,size:28,f:"mono",col:WC_INK});
      withA(ctx,1-ff,()=>wc_T(ctx,b,840,y,{w:500,size:28,f:"mono",col:WC_INK}));
      if(ff>0.01)withA(ctx,ff,()=>{wc_T(ctx,"2001-03-14",840,y,{w:500,size:28,f:"mono",col:WC_ROLEINK.tutor});m2_dashUnder(ctx,840,y+12,170);});
      withA(ctx,1-ff,()=>wc_hand(ctx,note,1270,y,{size:28,p:clamp((t-t0-0.3)/0.6,0,1),col:WC_INK}));if(ff>0.01)withA(ctx,ff,()=>wc_hand(ctx,"if they agreed",1270,y,{size:28,col:WC_ROLEINK.tutor}));
      const wa=fin(t,t1-0.1,0.4);if(wa>0.01)withA(ctx,wa,()=>{withA(ctx,1-ff,()=>wc_T(ctx,wt,1730,y+4,{w:500,size:36,f:"mono",align:"right",col:v<0?WC_NO:WC_ROLEINK.alumna}));
        if(ff>0.01)withA(ctx,ff,()=>wc_T(ctx,"+4.6",1730,y+4,{w:500,size:36,f:"mono",align:"right",col:WC_ROLEINK.alumna}));});});});},{d:0.9,from:0.97});
  // the score: the needle moves with each weight as it's added, from where any two records start, one chance in fifty-two
  const wsum=M2_WROWS.reduce((a,r,i)=>a+r[5]*easeCam(clamp((t-rowT[i][1]+0.1)/0.7,0,1)),0)+2.2*easeCam(clamp((t-tAg-0.2)/(t93-tAg),0,1));
  const ga=fin(t,tAway-0.2,0.6);if(ga>0.01)withA(ctx,ga,()=>{m2_gauge(ctx,260,740,1200,m2_score(wsum),{});
    m2_ringBand(ctx,260,740,1200,1,clamp((t-tPer)/0.7,0,1)*(1-fin(t,tAg-0.3,0.4)),31);m2_ringBand(ctx,260,740,1200,2,clamp((t-t93-0.1)/0.7,0,1),33);});
  m2_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 7. It suggests, Mei decides ---------- */
scene("note",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tD=c("drafts"),tDn=w("drafts","drafts a note"),tHid=w("drafts","names hidden"),tBd=w("drafts","birth dates"),tHe=w("drafts","the HR email"),tA=c("asks"),tSug=w("asks","It suggests"),
    tMd=w("asks","Mei decides"),tAsk=w("asks","She asks"),tCon=w("asks","her contract"),tTy=w("asks","a typo"),tLk=c("links"),tNx=c("next"),tNf=w("next","the next film");
  m2_open(ctx,S,t,sc,"office",[[0,960,540,1],[tAsk-0.4,820,600,1.08],[tLk-0.4,960,520,1.04],[tNx-0.3,900,560,1.04]]);
  // the AI helper's note, the names hidden: it suggests
  const na=1-fin(t,tLk-0.4,0.5);
  if(na>0.01)withA(ctx,na,()=>{arrive(ctx,930,310,t,tD-0.1,()=>m2_note(ctx,580,110,{lines:[clamp((t-tDn)/0.9,0,1),fin(t,tHid,0.4),clamp((t-tBd)/1.0,0,1),clamp((t-tHe)/1.1,0,1),clamp((t-tSug)/0.9,0,1)]}),{dy:14});
    arrive(ctx,930,550,t,tSug+0.3,()=>wc_tag(ctx,930,550,"it suggests",{align:"center"}),{dy:8});});
  arrive(ctx,1580,452,t,tMd-0.1,()=>withA(ctx,1-fin(t,tNx-0.4,0.5),()=>wc_tag(ctx,1580,452,"Mei decides",{align:"center",wash:WC_BADGE,washA:0.45})),{dy:8});
  // she asks HR: they check her contract, and it's a typo
  const ha=1-fin(t,tNx-0.4,0.5);
  if(ha>0.01)withA(ctx,ha,()=>{arrive(ctx,420,681,t,tAsk-0.1,()=>m2_card(ctx,140,600,560,"tutor","Casual tutor","E-4417",["Linh Nguyen","2001-05-14"],{seed:9}),{dy:14});
    arrive(ctx,910,700,t,tCon-0.2,()=>m2_contract(ctx,760,580),{dy:14});
    wc_ring(ctx,254,736,112,30,clamp((t-tTy)/0.6,0,1),{seed:19,col:WC_NO});wc_hand(ctx,"typo",388,750,{size:30,p:clamp((t-tTy-0.4)/0.4,0,1),col:WC_NO});});
  // she links them, with that reason
  arrive(ctx,890,274,t,tLk-0.1,()=>m2_decision(ctx,580,110,620,M2_DEC.d6,clamp((t-tLk)/2.0,0,1)),{dy:14});
  // which birth date to trust: the next film's question
  const qa=fin(t,tNx,0.6);
  if(qa>0.01)withA(ctx,qa,()=>{m2_src(ctx,200,620,"2001-03-14 · student system",WC_ROLE.student);m2_src(ctx,200,692,"2001-05-14 · HR",WC_ROLE.tutor);
    wc_hand(ctx,"?",680,712,{size:72,w:800,p:clamp((t-tNx-0.4)/0.3,0,1),col:WC_INK});
    arrive(ctx,420,800,t,tNf-0.1,()=>wc_tag(ctx,200,800,"the next film: Which value wins",{}),{dy:8});});
  m2_person(ctx,"mei",1760,1010,0.95,{pose:"stand",pose2:"explain",mix:fin(t,tMd-0.2,0.6)*(1-fin(t,tLk+2.0,0.6)),expr:"calm",t,flip:true});
  m2_close(ctx,S);wc_year(ctx,64,80,"this term · Mei's office",fin(t,0.3,0.6));wc_paperOver(ctx,S);});

/* ---------- 8. Two Aishas ---------- */
const m2_aRows=fam=>[["given name","Aisha"],["student no.","S-20417"],["family name",fam]];
scene("aisha",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tTh=c("third"),tAcc=w("third","a learning"),tKar=w("third","Aisha Karimi's"),tRah=w("rahman","Aisha Rahman's"),tMis=w("rahman","typed in"),tRe=c("results"),tLink=w("results","Link them"),
    tSees=w("results","sees the other's"),tTwo=w("results","Two people"),tWo=c("worse"),tCost=w("worse","costs more"),tAp=c("apart"),tKeep=w("apart","keeps them"),tBind=w("apart","binds");
  m2_open(ctx,S,t,sc,"plainB",[[0,960,540,1],[tWo-0.4,960,500,1.05],[tAp-0.4,960,540,1]]);
  // while the balance is weighed, the two of them and their records step back
  const dim=fin(t,tWo-0.4,0.6)*(1-fin(t,tAp-0.2,0.6));
  withA(ctx,1-0.75*dim,()=>{
    // two students, two people: Aisha Karimi, whose number it is; Aisha Rahman, whose account it is
    arrive(ctx,1500,700,t,tKar-0.4,()=>person(ctx,"aishak",1500,1000,0.74,{pose:"stand",expr:"calm",t}),{d:0.9,from:0.96});
    arrive(ctx,420,700,t,tRah-0.4,()=>person(ctx,"aishar",420,1000,0.74,{pose:"stand",expr:t>tSees+0.9?"concerned":"calm",t}),{d:0.9,from:0.96});
    arrive(ctx,420,224,t,tAcc-0.2,()=>m2_fieldCard(ctx,140,120,560,[60,140,190],"Learning platform","u-88231",m2_aRows("Rahman"),{ra:[1,1,fin(t,tRah,0.5)]}),{dy:14});
    arrive(ctx,1500,224,t,tKar-0.2,()=>m2_fieldCard(ctx,1220,120,560,"student","Student","S-20417",m2_aRows("Karimi"),{ra:[1,1,fin(t,tRah+0.3,0.5)]}),{dy:14});
    // the same given name, the same number; but not the same family name, and the number was typed in by mistake
    [0,1].forEach(i=>wc_tick(ctx,960,m2_rowY(120,i)-10,32,WC_ROLEINK.alumna,clamp((t-tKar-0.4-i*0.3)/0.4,0,1),4));
    wc_cross(ctx,960,m2_rowY(120,2)-10,40,WC_NO,clamp((t-tRah-0.6)/0.5,0,1));
    wc_ring(ctx,440,256,96,28,clamp((t-tMis)/0.6,0,1),{seed:23,col:WC_NO});wc_hand(ctx,"typed in by mistake",170,382,{size:30,p:clamp((t-tMis+0.1)/0.9,0,1),col:WC_NO});
    // it scores 71: a person decides
    arrive(ctx,960,440,t,sc.ends.third-0.4,()=>withA(ctx,1-fin(t,tLink-0.4,0.4),()=>wc_tag(ctx,960,440,"scores 71: a person decides",{align:"center",wash:WC_BADGE,washA:0.45})),{dy:8});
    // link them, and one student sees the other's results: two people, taken for one
    const lp=1-fin(t,tWo-0.4,0.5);wc_link(ctx,708,170,1212,170,WC_PENCIL,{p:clamp((t-tLink)/0.6,0,1)*lp,a:0.8,lw:3.4,dash:[10,9]});
    const rp=easeCam(clamp((t-tSees+0.3)/1.2,0,1)),ra=fin(t,tLink+0.4,0.4)*lp;
    if(ra>0.01)withA(ctx,ra,()=>{const x=lerp(1220,140,rp);m2_result(ctx,x,410);wc_cross(ctx,x+520,462,50,WC_NO,clamp((t-tTwo)/0.5,0,1));});});
  // a false merge weighs more than a missed match
  const ba=fin(t,tWo-0.2,0.6)*(1-fin(t,tAp-0.3,0.6));if(ba>0.01)withA(ctx,ba,()=>m2_scale(ctx,960,300,0.17*easeCam(clamp((t-tCost)/1.0,0,1))));
  // so Mei keeps them apart, and her "not the same" binds the matcher: it never proposes the pair again
  arrive(ctx,960,614,t,tKeep-0.2,()=>m2_decision(ctx,650,450,620,M2_DEC.d3,clamp((t-tKeep)/2.2,0,1)),{dy:14});
  arrive(ctx,1220,500,t,tBind-0.1,()=>m2_lock(ctx,1220,506,1.0),{dy:8});
  arrive(ctx,960,822,t,tBind+0.3,()=>wc_tag(ctx,960,822,"never proposed again",{align:"center"}),{dy:8});
  m2_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 9. Link, don't destroy ---------- */
// Linh's five records around her: where each stands, and the band on her its link runs to
const M2_LCARDS=[["old",120,130,0],["new",740,130,0],["tutor",1360,130,1],["alumna",120,330,3],["researcher",1360,330,2]];
scene("link",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tF=c("five"),tDec=w("five","Two decisions"),tPt=w("five","point to"),tK=c("kept"),tEach=w("kept","each record"),tMar=w("kept","a real Martin"),tAny=w("kept","any link"),
    tR=c("rule"),tNev=w("rule","never one"),tCome=w("rule","A student who");
  m2_open(ctx,S,t,sc,"plain",[[0,960,540,1]]);
  const LX=960,LY=866,LS=0.58,bY=i=>wc_bandY("linh",LS,LY,i);
  // any link can be undone: D-006 comes off, and HR's record and the research office's with it, as they would if a real Martin walked in;
  // then made again
  const un=easeCam(clamp((t-tAny)/0.7,0,1))*(1-easeCam(clamp((t-tR+0.1)/0.8,0,1))),off=k=>k==="tutor"||k==="researcher"?52*un:0;
  // her five records, each linked to her as it arrived
  M2_LCARDS.forEach(([k,x,y,band],i)=>{const t0=tF+0.1+i*0.15,right=x>960,ex=k==="new"?LX:right?x+off(k)-8:x+448,ey=k==="new"?y+124:y+58;
    wc_link(ctx,ex,ey,k==="new"?LX:LX+(right?46:-46),k==="new"?LY-310:bY(band),WC_ROLE[M2_RECI[k][0]],{p:clamp((t-tPt-0.1-i*0.1)/0.7,0,1)*(off(k)?1-0.85*un:1),a:0.85,lw:3.4,vertical:k==="new"});
    arrive(ctx,x+220,y+58,t,t0,()=>m2_rec(ctx,k,x+off(k),y,440),{dy:14});});
  // the two decisions, as gold links between her records; the records that hold another's number
  [[568,732,"D-005",0],[1188,1352,"D-006",1]].forEach(([x0,x1,d,j])=>{const u=j?un:0;wc_link(ctx,x0,188,x1+(j?52*un:0),188,WC_BADGE,{p:clamp((t-tDec-0.1-j*0.4)/0.5,0,1)*(1-0.9*u),a:1,lw:5,dash:u>0.02?[10,9]:[]});
    arrive(ctx,(x0+x1)/2,188,t,tDec+0.4+j*0.4,()=>withA(ctx,1-0.6*u,()=>wc_badge(ctx,(x0+x1)/2-56,188,d)),{dy:6});});
  wc_hand(ctx,"undone",1214,248,{size:30,p:clamp((t-tAny-0.3)/0.5,0,1)*(1-fin(t,tR,0.5)),col:WC_NO});
  [[340,"alumna"],[1580,"researcher"]].forEach(([x,k],j)=>{const xo=x+off(k);wc_link(ctx,xo,326,xo-off(k)*0.0,254,WC_PENCIL,{p:clamp((t-tPt+0.6-j*0.2)/0.5,0,1),a:0.7,vertical:true});
    withA(ctx,fin(t,tPt-0.3+j*0.2,0.5),()=>wc_hand(ctx,"holds",xo+18,300,{size:28,col:WC_MUTED}));});
  // one person, in white paper, with an ID of her own
  wc_white(ctx,"linh",LX,LY,LS,m2_bands([1,1,1,1]),{a:fin(t,tF+0.2,0.7)});
  arrive(ctx,LX,520,t,tPt+0.2,()=>wc_tag(ctx,LX,520,"P-10482",{align:"center",f:"mono",w:500}),{dy:8});
  arrive(ctx,960,72,t,tEach-0.1,()=>wc_tag(ctx,960,72,"each kept as it arrived",{align:"center"}),{dy:8});
  // a real Martin, as he might walk in: drawn faint, as he's only supposed
  if(t>tMar-0.3){const ma=fin(t,tMar-0.3,0.5)*(1-fin(t,tR+0.4,0.7))*0.82;if(ma>0.01)withA(ctx,ma,()=>{const [rx,rd,rw]=m2_walkX(t,tMar-0.2,2060,1700,190);m2_folk(ctx,"real",rx,880,186,rw?{side:true,flip:true,phase:m2_stride(rd,186)}:{});});}
  // no rule says two student numbers are never one person: a student who comes back has two
  const rr0=fin(t,tR-0.1,0.5);if(rr0>0.01)withA(ctx,rr0,()=>{wc_panel(ctx,120,560,700,100,{kind:"card",seed:33});wc_T(ctx,"two student numbers are never one person",150,622,{w:600,size:28,col:WC_INK});
    wc_cross(ctx,770,610,46,WC_NO,clamp((t-tNev)/0.5,0,1));});
  arrive(ctx,380,720,t,tCome-0.1,()=>wc_tag(ctx,120,720,"a student who comes back has two",{}),{dy:8});
  [[120,0],[740,1]].forEach(([x,j])=>wc_ring(ctx,x+440-24-60,178,84,26,clamp((t-tCome-0.2-j*0.25)/0.6,0,1),{seed:35+j}));
  m2_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 10. Elsewhere ---------- */
scene("elsewhere",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tH=c("hospital"),tToo=w("hospital","match people"),tMg=w("hospital","Merge two"),tRes=w("hospital","a test result"),tWr=w("hospital","the wrong one"),tI=c("issuer"),tKeep=w("issuer","keep each"),tUn=w("issuer","undoing");
  m2_open(ctx,S,t,sc,"plainB",[[0,960,540,1]]);
  arrive(ctx,960,120,t,tH-0.2,()=>wc_tag(ctx,960,120,"a hospital",{align:"center",size:32,w:800,wash:WC_IND.health,washA:0.35}),{dy:8});
  // two patients, both called Jo Lee
  [["ben",640],["rosa",1280]].forEach(([id,x],i)=>wc_white(ctx,id,x,850,0.6,[],{a:fin(t,tToo-0.2+i*0.3,0.6)}));
  // their wristbands: merged by mistake; then kept with the system that issued each number, and unmerged
  const mg=easeCam(clamp((t-tMg)/1.0,0,1))*(1-easeCam(clamp((t-tUn)/1.0,0,1))),ax=lerp(360,680,mg),bx=lerp(1000,680,mg),by=lerp(250,268,mg);
  arrive(ctx,bx+280,by+46,t,tToo+0.2,()=>m2_band(ctx,bx,by,"Jo Lee","MRN 448210"),{dy:12});
  arrive(ctx,ax+280,296,t,tToo-0.1,()=>m2_band(ctx,ax,250,"Jo Lee","MRN 448120"),{dy:12});
  const ia=fin(t,tKeep-0.1,0.5);
  if(ia>0.01)withA(ctx,ia,()=>{wc_tag(ctx,lerp(380,700,mg),lerp(394,394,mg),"448120 · admissions",{size:28,w:600,f:"mono"});wc_tag(ctx,lerp(1020,700,mg),lerp(394,454,mg),"448210 · emergency",{size:28,w:600,f:"mono"});});
  // a test result for the second follows the merge to the wrong one; unmerged, it goes back
  const rp=easeCam(clamp((t-tRes)/1.2,0,1))*(1-easeCam(clamp((t-tUn-0.4)/1.2,0,1))),rx=lerp(1380,180,rp);
  arrive(ctx,rx+180,600,t,tToo+0.6,()=>{m2_labSlip(ctx,rx,560);wc_cross(ctx,rx+320,608,44,WC_NO,clamp((t-tWr)/0.5,0,1)*(1-fin(t,tUn+0.4,0.5)));
    wc_tick(ctx,rx+320,604,34,WC_ROLEINK.alumna,clamp((t-tUn-1.6)/0.4,0,1),4);},{dy:12});
  arrive(ctx,960,800,t,tUn+0.6,()=>wc_tag(ctx,960,800,"undoing a merge: part of the job",{align:"center"}),{dy:8});
  m2_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 11. Decided once ---------- */
const M2_SQL=["-- pairs that share a key, not everyone","select a.record_key, b.record_key","from blocked_records a","join blocked_records b using (block_key)","where a.record_key < b.record_key"];
const M2_QROWS=["-- each pair, and its decision","S-17142 · S-20436   D-005","S-20436 · E-4417    D-006","u-88231 · S-20417   D-003",["S-20512 · E-5120    waiting 2 days",[150,92,0]]];
const M2_TROWS=["-- fails when a pair waits over 7 days",["S-20577 · S-19902   8 days   FAIL",WC_NO],["owner: Mei's office · limit: 7 days",WC_DARK]];
const M2_LROWS=["-- master records and their links","P-10482 · S-17142 · D-005","P-10482 · S-20436 · D-005","P-10482 · E-4417  · D-006",["D-006 · Mei Tanaka · contract: a typo",WC_ROLEINK.tutor]];
scene("once",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tD=c("dbt"),tQ=w("dbt","a query"),tWo=w("dbt","without comparing"),tDec=w("dbt","the decisions table"),tQu=w("dbt","the person's queue"),tT=c("test"),tFa=w("test","fails"),tWk=w("test","more than a week"),
    tOw=w("test","an owner"),tTb=c("tables"),tMr=w("tables","the master records"),tLk=w("tables","their links"),tWho=w("tables","who decided"),tK=c("decide");
  // the camera: each card in turn, as it's named; out for the line
  m2_open(ctx,S,t,sc,"plain",[[0,960,540,1],[tQ-0.4,560,300,1.18],[tDec-0.3,1400,300,1.18],[tT-0.3,560,640,1.18],[tTb-0.3,1400,640,1.18],[tK-0.5,960,540,1]]);
  // the cards step back while the line is said, so it reads on its own
  const rb=1-0.7*fin(t,tK-0.4,0.6);
  withA(ctx,rb,()=>{
    arrive(ctx,510,290,t,tQ-0.3,()=>m2_tool(ctx,100,100,820,"dbt","dbt","int_person_pairs.sql",M2_SQL,{la:M2_SQL.map((s,i)=>fin(t,(i<1?tWo:tQ+0.3)+i*0.18,0.4))}),{dy:16});
    arrive(ctx,1410,290,t,tDec-0.3,()=>m2_tool(ctx,1000,100,820,"dbt","the person queue","person_queue.sql",M2_QROWS,{la:M2_QROWS.map((s,i)=>fin(t,(i<4?tDec+0.2:tQu)+i*0.15,0.4))}),{dy:16});
    arrive(ctx,510,684,t,tFa-0.4,()=>m2_tool(ctx,100,540,820,"dbt","a test","decided_within_a_week",M2_TROWS,{la:[fin(t,tFa,0.4),fin(t,tWk,0.4),fin(t,tOw-0.1,0.4)]}),{dy:16});
    arrive(ctx,1410,730,t,tMr-0.4,()=>m2_tool(ctx,1000,540,820,"databricks","person_link",null,M2_LROWS,{la:[fin(t,tMr,0.4),fin(t,tLk,0.4),fin(t,tLk+0.2,0.4),fin(t,tLk+0.4,0.4),fin(t,tWho,0.4)]}),{dy:16});});
  m2_close(ctx,S);wc_paperOver(ctx,S);
  // the line, then carried down onto the end card, above the veil, landing where the card's own line fades in and takes it over
  const KL="Decide a match once, with a reason, and keep it.",kl=fin(t,tK-0.1,0.6),ky=lerp(128,420,fin(t,B+0.3,1.1)),kg=kl*(1-fin(t,B+0.8,0.9));
  if(kg>0.01){setScreen(ctx,S);withA(ctx,kg,()=>{ctx.save();ctx.translate(960,ky-16);ctx.scale(1,0.2);const g=ctx.createRadialGradient(0,0,10,0,0,700);
    g.addColorStop(0,rgba(WC_PAPER,0.94));g.addColorStop(0.7,rgba(WC_PAPER,0.7));g.addColorStop(1,rgba(WC_PAPER,0));ctx.fillStyle=g;ctx.fillRect(-700,-700,1400,1400);ctx.restore();});}
  wc_end(ctx,S,t,B+0.8,"Who is it?",KL,"Film 2 of 9");
  if(kl>0.01&&t<B+2.4){setScreen(ctx,S);withA(ctx,kl,()=>wc_T(ctx,KL,960,ky,{w:700,size:48,align:"center",col:WC_DARK}));}});
