/* ===== Who it serves, and how it pays: scenes =====
   Ten chapters, as in ../script.md. Edison sold light, not electricity; who the utility is for; who pays, uses and decides, and the
   segments; the households' value proposition canvas, filled over three chapters (jobs; pains and gains; what the utility offers and
   what relieves each pain); fit as a rule, and the pain nothing relieves; a business model canvas per offering, and what each earns and
   costs; from canvas to map; and an answer, for now.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame, and the camera moves in on the part of a canvas the
   narration is filling (focus), so its notes are large; when a whole canvas is on screen for context, its notes are decoration.
   Overlays that explain a moment (a tag at the top) are drawn after the camera, so they stay put while it moves.
   Motion (In the weeds of data crafting's helpers): every shot drifts slowly, things arrive with a spring, and the households' canvas
   carries across the cuts from chapter 4 to chapter 7. Sound: every effect in tools/score.py fires at the same moment as the thing
   it belongs to here, so keep the two in step. */

/* ---------- the households' canvas, shared by chapters 4 to 7 ---------- */
const D2_CV=[160,90,1600,760];
// every note on it: id, text, centre, paper, size
const D2_N={
  j1:["keep the lights and heating on",1555,390,2,210,84],j2:["not worry about the bill",1555,488,2,210,84],j3:["do their bit for the climate",1555,586,2,210,84],
  g1:["know when the power's back",1300,290,3,140,70],g2:["a bill they understand",1190,380,3,140,70],g3:["pay less, with solar",1330,400,3,140,70],
  p1:["bills too high",1330,576,1,140,70],p2:["bills based on a guess",1190,596,1,140,70],p3:["no warning, no idea when it ends",1300,690,1,150,76],
  s1:["electricity supply",381,290,0,230,66],s2:["a network connection",381,375,0,230,66],s3:["outage updates by text",381,460,0,230,66],s4:["a hardship plan",381,545,0,230,66],
  c1:["outage text, with a time",661,280,0,230,62],c2:["a plain-English bill",661,360,0,230,62],c3:["solar export credits",661,440,0,230,62],
  r1:["smart meters: real readings",661,560,0,230,62],r2:["outage text, with a time",661,640,0,230,62],r3:["payment plans",661,720,0,230,62]};
// what relieves which pain, and what creates which gain
const D2_LINK=[["r1","p2"],["r2","p3"],["r3","p1"],["c1","g1"],["c2","g2"],["c3","g3"]];
// where the camera looks on the canvas: the jobs, the pains, the gains, the products and services, relievers with their pains, creators with their gains
const D2_AT={all:[960,470,1],jobs:[1500,488,1.9],pains:[1265,615,1.95],gains:[1265,350,1.95],offers:[470,420,1.8],relieve:[975,630,1.95],create:[975,362,1.95]};
const d2k=(t,k)=>[t,...D2_AT[k]];
// v[id]: each note's arrival (0..1); ln[k]: each link drawn (0..1); ok[k]: each link ticked; hi: the canvas's sections lit; deco: seen from afar
function d2_households(ctx,t,v,ln,ok,o){o=o||{};const[x,y,w,h]=D2_CV;vpCanvas2(ctx,x,y,w,h,o.p==null?1:o.p,{title:"value proposition canvas · households",hi:o.hi||{},titleDeco:o.deco});
  D2_LINK.forEach(([a,b],k)=>{const q=ln?ln[k]||0:0;if(q<=0)return;const A=D2_N[a],Bn=D2_N[b];arrowTo(ctx,A[1]+A[4]/2-4,A[2],Bn[1]-Bn[4]/2+4,Bn[2],k<3?[200,90,110]:[90,170,90],0.85,{p:q,lw:2.6,bend:k<3?0.08:-0.08,head:11});
    if(ok&&ok[k]>0)withA(ctx,ok[k],()=>tick_(ctx,(A[1]+Bn[1])/2+30,(A[2]+Bn[2])/2-6,22,[70,150,80],1));});
  Object.entries(D2_N).forEach(([id,[s_,nx,ny,k,nw,nh]])=>{const q=v[id]||0;if(q<=0)return;arrive(ctx,nx,ny,1,1-q,()=>sticky(ctx,nx,ny,nw,nh,s_,{col:NOTEC[k],size:nw>200?18:16,deco:o.deco}),{dy:-24,from:1.08});});}

/* ---------- 1. Light, not electricity ---------- */
scene("edison",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t,{light:0.06});
  ctx.save();drift(ctx,t,sc,{z:0.035,y:500});
  const lit=fin(t,w("opened","power station"),3.2)*0.55+fin(t,c("knew"),2.5)*0.45,cG=c("gas"),cS=c("sold"),cK=c("knew");
  eaYear(ctx,90,90,"1882 · Pearl Street, New York",CLAY,fin(t,0.3,0.6));
  d2_street(ctx,t,lit,{a:fin(t,0.2,1.2)});
  arrive(ctx,960,200,t,w("light","wanted light"),()=>withA(ctx,1-fin(t,cK-0.3,0.5),()=>T(ctx,"light, not electricity",960,214,{w:800,size:56,align:"center",color:rgba(PARCH,1)})),{dy:16});
  // gas against electric light; then the meter
  const pan=fin(t,cG-0.2,0.6)*(1-fin(t,cK-0.4,0.6)),lampsOut=fin(t,w("sold","measured")-0.2,0.6);
  withA(ctx,pan,()=>{ctx.fillStyle="rgba(12,8,6,0.88)";rr(ctx,430,300,1060,540,24);ctx.fill();ctx.strokeStyle="rgba(222,170,112,0.35)";ctx.lineWidth=1.5;rr(ctx,430,300,1060,540,24);ctx.stroke();
    withA(ctx,1-lampsOut,()=>{ctx.save();ctx.translate(960,560);ctx.scale(1.25,1.25);ctx.translate(-960,-560);d2_lamps(ctx,780,470,t,fin(t,cG,0.5),fin(t,w("sold","steady"),0.5));ctx.restore();
      [["hot","hot"],["smoky","smoky"],["fire risk","fires"]].forEach(([s_,k],i)=>withA(ctx,fin(t,w("gas",k),0.3),()=>tag(ctx,[600,740,900][i],790,s_,GASC,{align:"center",size:30})));
      withA(ctx,fin(t,w("sold","steady"),0.4),()=>tag(ctx,1250,790,"steady · clean",WARM,{align:"center",size:30}));});
    withA(ctx,lampsOut,()=>{d2_meter(ctx,660,540,1.2,clamp((t-w("sold","zinc"))/2.4,0,1),t);T(ctx,"Edison's meter: zinc plates, weighed",960,800,{w:700,size:32,align:"center",color:rgba(PARCH,1)});});});
  arrive(ctx,960,262,t,w("sold","priced"),()=>withA(ctx,(1-fin(t,cK-0.4,0.6)),()=>tag(ctx,960,262,"priced to compete with gas",TRUST,{align:"center",size:30})),{dy:14});
  // what he knew
  [["who he served","who he served"],["what they were trying to do","what they were"],["how it would pay","how it would pay"]].forEach(([s_,k],i)=>arrive(ctx,[480,960,1440][i],220,t,w("knew",k),()=>tag(ctx,[480,960,1440][i],220,s_,TRUST,{align:"center",size:32}),{dy:14}));
  ctx.restore();fadeIn(ctx,S,t);vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"Who it serves, and how it pays","two canvases, before anything else",EAC,"Film 2 of 11 · enterprise architecture, for data");});

/* ---------- 2. Who is it for? ---------- */
scene("recap",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const cR=c("report"),cW=c("whom"),cH=c("sheets");
  person(ctx,"tomas",170,1030,0.8,{t,pose:t>cR&&t<cW?"explain":"stand"});
  arrive(ctx,600,250,t,0.3,()=>sticky(ctx,600,250,300,190,"Why does it exist?",{col:NOTEC[0],size:34,st:0,rot:-0.03}),{dy:-30});
  const words=["safe","affordable","reliable","clean","ours"].map(k=>fin(t,w("report",k)-0.1,0.3));
  arrive(ctx,1140,330,t,cR-0.2,()=>d2_report(ctx,900,90,480,470,{words,whom:fin(t,w("whom","for whom"),0.4)}),{dy:30,from:0.95});
  arrive(ctx,1760,800,t,w("whom","Farah")-0.3,()=>{person(ctx,"farah",1760,1030,0.8,{t,pose:t>cH&&t<cH+2.4?"explain":"stand"});tag(ctx,1650,560,"Farah · customer advocate",TRUST,{align:"center",size:28});},{dy:20,from:0.96});
  // two kinds of canvas: one per kind of customer, one per offering
  [[540,"one per kind of customer",w("sheets","each kind")],[980,"one per offering",w("sheets","each thing")]].forEach(([x,s_,t0],i)=>arrive(ctx,x+180,700,t,t0,()=>{sheet(ctx,x,600,380,200,{rot:i?0.012:-0.012});
    if(i===0){marker(ctx,[[x+40,640],[x+150,640],[x+150,750],[x+40,750],[x+40,640]],1,{lw:2.2});marker(ctx,circlePts(x+270,695,55,30),1,{lw:2.2});}else{marker(ctx,[[x+30,630],[x+350,630],[x+350,770],[x+30,770],[x+30,630]],1,{lw:2.2});[1,2,3,4].forEach(k=>marker(ctx,[[x+30+k*64,630],[x+30+k*64,730]],1,{lw:1.6}));marker(ctx,[[x+30,730],[x+350,730]],1,{lw:1.6});}
    tag(ctx,x+190,848,s_,PARCH,{align:"center",size:28});},{dy:-24}));
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Who pays, who uses, who decides ---------- */
const D2_SEG=[["households","house"],["households in hardship","hardship"],["businesses","shop"],["homes with solar","solar"]];
scene("segments",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const cN=c("names"),cO=c("others"),up=ease(fin(t,cN-0.4,1.0));
  arrive(ctx,960,70,t,w("differ","Who pays"),()=>withA(ctx,1-up,()=>T(ctx,"who pays · who uses · who decides",960,82,{w:800,size:40,align:"center",color:rgba(PARCH,1)})),{dy:12});
  // three different people; they give way to the segments
  withA(ctx,1-up,()=>[["bill","a tenant","uses the power, and pays the bill",[164,212,255],w("tenant","A tenant")],["key","the landlord","decides whether there are solar panels",[255,228,122],w("tenant","The landlord")],["scales","the regulator","decides the price",[200,186,255],w("tenant","the regulator")]]
    .forEach(([k,n,l,col,t0],i)=>arrive(ctx,960,210+i*200,t,t0,()=>d2_who(ctx,560,130+i*200,800,k,n,l,col,{hi:pulseAt(t,t0,1.8)}),{dy:24})));
  // the customer segments
  withA(ctx,up,()=>T(ctx,"customer segments",960,120,{w:800,size:36,align:"center",color:"rgba(238,224,196,0.9)"}));
  D2_SEG.forEach(([s_,k],i)=>{const x=250+i*473,t0=w("names",s_)-0.1;arrive(ctx,x,360,t,t0,()=>{d2_icon(ctx,k,x,230,44,PARCH);sticky(ctx,x,360,370,150,s_,{col:NOTEC[2],size:32});
    if(k==="solar")withA(ctx,fin(t,w("names","sell it back"),0.4),()=>tag(ctx,x,470,"buy, and sell back",[188,236,164],{align:"center",size:28}));},{dy:-30,from:1.06});});
  // and two who matter just as much, but aren't customers
  [["gov","the minister","owns the utility"],["scales","the regulator","sets its prices"]].forEach(([k,n,l],i)=>arrive(ctx,690+i*540,710,t,w("others",i?"the regulator":"The minister"),()=>{
    ctx.save();ctx.setLineDash([8,8]);glass(ctx,450+i*540,640,480,140,18,[200,186,255],{glow:8,ea:0.5,fill:"rgba(7,12,24,0.85)"});ctx.restore();d2_icon(ctx,k,520+i*540,710,36,[200,186,255]);
    T(ctx,n,590+i*540,700,{w:800,size:32});T(ctx,l,590+i*540,742,{w:600,size:28,color:rgba(SOFT,1)});},{dy:24}));
  arrive(ctx,960,580,t,w("others","their own place"),()=>tag(ctx,960,580,"not customers · their own place on the map",[200,186,255],{align:"center",size:30}),{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. What they're trying to get done ---------- */
scene("jobs",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.015,y:470});const K=[d2k(0,"all"),d2k(c("done")-0.2,"jobs")];focus(ctx,t,K);
  const v={j1:fin(t,c("lights")-0.1,0.6),j2:fin(t,c("worry")-0.1,0.6),j3:fin(t,w("climate","their bit")-0.1,0.6)};
  arrive(ctx,960,470,t,0.2,()=>d2_households(ctx,t,v,null,null,{p:clamp((t-0.4)/2.4,0,1),deco:focusZ(t,K)<1.6,hi:{"customer jobs":fin(t,c("done"),0.5)*(1-fin(t,c("words")+1.5,0.8))*0.8}}),{d:1.0,from:0.97});
  ctx.restore();
  arrive(ctx,960,70,t,w("words","in their words"),()=>tag(ctx,960,70,"in the customer's words, not what the utility sells",EAC,{align:"center",size:30}),{dy:10});
  vign(ctx,S);});

/* ---------- 5. What hurts, and what would help ---------- */
scene("pains",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.015,y:470});const K=[d2k(0,"jobs"),d2k(c("wrong")-0.3,"pains"),d2k(c("win")-0.2,"gains")];focus(ctx,t,K);
  const v={j1:1,j2:1,j3:1,p1:fin(t,w("wrong","too high")-0.2,0.6),p2:fin(t,c("guess")-0.1,0.6),p3:fin(t,c("cut")-0.1,0.6),g1:fin(t,w("win","Knowing")-0.1,0.6),g2:fin(t,c("understand")-0.1,0.6),g3:fin(t,c("less")-0.1,0.6)};
  d2_households(ctx,t,v,null,null,{deco:focusZ(t,K)<1.6,hi:{pains:fin(t,c("wrong"),0.5)*(1-fin(t,c("win")-0.3,0.5))*0.8,gains:fin(t,c("win"),0.5)*0.8}});
  ctx.restore();vign(ctx,S);});

/* ---------- 6. What the utility offers ---------- */
scene("offers",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.015,y:470});const K=[d2k(0,"gains"),d2k(c("side")+0.4,"offers"),d2k(c("relieve")-0.2,"relieve")];focus(ctx,t,K);
  const v={j1:1,j2:1,j3:1,p1:1,p2:1,p3:1,g1:1,g2:1,g3:1,s1:fin(t,w("list","Electricity")-0.1,0.6),s2:fin(t,w("list","A connection")-0.1,0.6),s3:fin(t,w("list","Outage")-0.1,0.6),s4:fin(t,w("list","A hardship")-0.1,0.6),
    r1:fin(t,c("meters")-0.1,0.6),r2:fin(t,c("text")-0.1,0.6),r3:fin(t,c("plan")-0.1,0.6)};
  const ln=[fin(t,c("meters")+0.6,0.9),fin(t,c("text")+0.6,0.9),fin(t,c("plan")+0.6,0.9)];
  d2_households(ctx,t,v,ln,null,{deco:focusZ(t,K)<1.6,hi:{"products and services":fin(t,c("side"),0.5)*(1-fin(t,c("relieve"),0.5))*0.8,"pain relievers":fin(t,c("relieve"),0.5)*0.8}});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Fit is a rule ---------- */
scene("fit",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  const cE=c("every"),cS=c("solar"),cX=c("either"),cC=c("clear"),gc=w("every","Every gain"),sh=ease(fin(t,cS-0.5,1.0));
  ctx.save();drift(ctx,t,sc,{z:0.015,y:470});const K=[d2k(0,"relieve"),d2k(c("means")+0.2,"all"),d2k(cE-0.2,"relieve"),d2k(gc-0.3,"create"),d2k(cS-0.6,"all")];focus(ctx,t,K);
  const v={j1:1,j2:1,j3:1,p1:1,p2:1,p3:1,g1:1,g2:1,g3:1,s1:1,s2:1,s3:1,s4:1,r1:1,r2:1,r3:1,c1:fin(t,gc,0.6),c2:fin(t,gc+0.3,0.6),c3:fin(t,gc+0.6,0.6)};
  const ln=[1,1,1,fin(t,gc+0.5,0.8),fin(t,gc+0.8,0.8),fin(t,gc+1.1,0.8)],ok=[0,1,2,3,4,5].map(k=>fin(t,(k<3?w("every","relieves"):gc+1.4)+k*0.15,0.3));
  // the households' canvas moves aside, a little smaller, when the second canvas arrives
  ctx.save();ctx.translate(lerp(0,-20,sh),lerp(0,60,sh));ctx.scale(lerp(1,0.55,sh),lerp(1,0.55,sh));
  d2_households(ctx,t,v,ln,ok,{deco:focusZ(t,K)<1.6||sh>0.1,hi:{}});
  kt_rstamp(ctx,520,180,"fits",[90,170,90],fin(t,B,0.3),fin(t,B+0.2,0.35),{size:60,rot:-0.12});
  ctx.restore();
  // homes with solar: one pain, and nothing that relieves it
  if(sh>0)withA(ctx,sh,()=>{vpCanvas2(ctx,1000,110,860,440,1,{title:"homes with solar",lab:0.8});const pn=fin(t,w("solar","waiting months"),0.5);
    arrive(ctx,1600,430,t,w("solar","one pain")-0.2,()=>sticky(ctx,1600,430,250,130,"waiting months to connect new panels",{col:NOTEC[1],size:28}),{dy:-20,from:1.08});
    withA(ctx,pn,()=>{ctx.save();ctx.setLineDash([7,7]);ctx.strokeStyle="rgba(200,60,60,0.9)";ctx.lineWidth=3;rr(ctx,1150,390,200,90,8);ctx.stroke();ctx.restore();T(ctx,"?",1250,452,{w:800,size:48,align:"center",color:"rgba(200,60,60,1)"});
      arrowTo(ctx,1350,435,1470,430,[200,60,60],0.8,{p:pn,lw:2.6,dash:[6,6],head:10});});});
  ctx.restore();
  arrive(ctx,960,70,t,w("means","fits"),()=>withA(ctx,1-sh,()=>tag(ctx,960,70,"fit: every pain relieved · every gain created",EAC,{align:"center",size:30})),{dy:10});
  // which is it?
  const pick=fin(t,w("clear","missing capability"),0.5);
  arrive(ctx,1190,660,t,w("either","missing capability"),()=>{tag(ctx,1190,660,"a missing capability",pick>0.5?TRUST:PARCH,{align:"center",size:30});if(pick>0)withA(ctx,pick,()=>kt_gtick(ctx,1385,660,20,1));},{dy:12});
  arrive(ctx,1640,660,t,w("either","decided not"),()=>withA(ctx,1-0.6*pick,()=>tag(ctx,1640,660,"a customer not served",PARCH,{align:"center",size:30})),{dy:12});
  arrive(ctx,1420,730,t,w("either","has to say"),()=>withA(ctx,1-fin(t,w("clear","on the list")-0.2,0.4),()=>T(ctx,"the canvas has to say which",1420,742,{w:700,size:30,align:"center",color:"rgba(238,224,196,0.9)"})),{dy:10});
  arrive(ctx,140,800,t,cC-0.3,()=>person(ctx,"farah",140,1030,0.78,{t,pose:t>cC&&t<cC+2.2?"explain":"stand"}),{dy:20,from:0.96});
  arrive(ctx,1420,780,t,w("clear","on the list"),()=>{glass(ctx,1080,720,690,110,16,LAY6[1][1],{glow:14,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(ctx,"missing capabilities",1108,760,{f:"mono",w:500,size:28,color:rgba(LAY6[1][1],1)});T(ctx,"connect new solar panels, faster",1108,806,{w:700,size:30});},{dy:20});
  vign(ctx,S);});

/* ---------- 8. How each offering pays ---------- */
// a note pinned into a block of a business model canvas
function d2_bnote(ctx,cx,cy,cw,chh,i,s_,col,q,deco){if(q<=0)return;const[bx,by,bw,bh]=BMC_AT(cx,cy,cw,chh,i),nw=Math.min(bw-12,i>=7?320:156);arrive(ctx,bx+bw/2,by+bh/2+10,1,1-q,()=>sticky(ctx,bx+bw/2,by+bh/2+12,nw,72,s_,{col,size:16,deco}),{dy:-16,from:1.08});}
scene("pays",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  const cN=c("network"),cR=c("retail"),cH=c("hardship");
  ctx.save();drift(ctx,t,sc,{z:0.015,y:420});const K=[[0,960,540,1],[w("each","its own")-0.4,500,295,2.0],[cR-0.3,1420,295,2.0],[cH-0.4,960,540,1]];focus(ctx,t,K);const deco=focusZ(t,K)<1.6;
  const BM=[[60,70,880,450,"network connection"],[980,70,880,450,"retail supply"]];
  BM.forEach(([x,y,ww,hh,n],k)=>arrive(ctx,x+ww/2,y+hh/2,t,k?w("each","one for each")+0.3:w("each","how each"),()=>{bmCanvas(ctx,x,y,ww,hh,clamp((t-(k?w("each","one for each"):w("each","how each"))-0.2)/1.6,0,1));T(ctx,n,x+ww-24,y+38,{w:800,size:24,align:"right",color:"rgba(160,60,40,0.9)",deco:1});},{d:1.0,from:0.96}));
  const nt=[[0,6,"every connected home and business",2,w("each","its own")],[0,3,"power, delivered safely",0,w("each","its own")+0.4],[0,1,"build, maintain, restore",0,w("each","economics")],
    [0,8,"a charge on every bill, capped by the regulator",3,w("network","regulator allows")],[0,7,"poles, wires and crews",1,w("network","poles, wires")],
    [1,6,"households and businesses",2,c("retail")],[1,3,"power at a fair price",0,c("retail")+0.4],[1,1,"buy energy, bill customers",0,w("retail","Retail supply")+0.8],
    [1,8,"tariffs",3,w("retail","tariffs")],[1,7,"energy, bought wholesale",1,w("retail","wholesale")]];
  nt.forEach(([k,i,s_,col,t0])=>{const[x,y,ww,hh]=BM[k];d2_bnote(ctx,x,y,ww,hh,i,s_,NOTEC[col],fin(t,t0,0.6),deco);});
  ctx.restore();
  // what each earns and costs, as a table, once the camera pulls back
  const on=[1,1,1,fin(t,cH+0.3,0.5)];
  arrive(ctx,960,740,t,cH-0.2,()=>d2_table(ctx,230,600,[340,600,520],[["offering","earns from","biggest cost"],["network connection","a regulated charge on every bill","poles, wires and crews"],["retail supply","tariffs","wholesale energy"],["hardship plan","the government","support for those who can't pay"]],{on}),{dy:24});
  arrive(ctx,960,560,t,w("hardship","public value"),()=>tag(ctx,960,560,"public value, not only profit",TRUST,{align:"center",size:30}),{dy:12});
  vign(ctx,S);});

/* ---------- 9. From canvas to map ---------- */
// what each block becomes: the chip, the layer it lands on, which line of that layer, and the word that sends it
const D2_MAP=[["segments → stakeholders",0,0,"Segments"],["pains, gains → reasons to change",0,1,"Pains and gains"],["pain relievers → capabilities",1,0,"What relieves"],["key activities → processes",2,0,"Key activities"]];
scene("map",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const cT=c("tables"),cL=c("later");
  arrive(ctx,380,300,t,0.2,()=>{vpCanvas2(ctx,50,110,640,320,1,{title:"households",lab:0});bmCanvas(ctx,50,470,640,320,1);},{d:1.0,from:0.96});
  arrive(ctx,1290,96,t,w("derived","derived"),()=>T(ctx,"the map, derived from the canvases",1290,100,{w:800,size:32,align:"center",color:rgba(SOFT,1)}),{dy:10});
  const R=layerStack(ctx,770,150,500,{sh:68,gap:26,p:clamp((t-w("derived","architecture")+0.3)/1.6,0,1),hi:[0,0,0,0.6*fin(t,cL,0.6),0,0]});
  D2_MAP.forEach(([s_,li,ln_,k],j)=>{const t0=w("become",k)-0.1,q=ease(fin(t,t0,1.1));if(q<=0)return;const sx=j<2?370:(j===2?300:280),sy=j<2?280:(j===2?280:640),ey=R[li][1]+(li===0?(ln_?R[li][3]+8:6):R[li][3]/2);
    withA(ctx,clamp(q*2,0,1),()=>tag(ctx,lerp(sx,1340,q),lerp(sy,ey,q),s_,LAY6[li][1],{size:28}));});
  arrive(ctx,1000,780,t,cT,()=>{d2_table(ctx,780,722,[260,320],[["revenue","costs"],["by offering","by what incurs them"]]);tag(ctx,1400,784,"tables, not boxes",[200,210,230],{size:30});},{dy:20});
  arrive(ctx,1500,R[3][1]+R[3][3]/2,t,w("later","what each number"),()=>tag(ctx,1340,R[3][1]+R[3][3]/2,"what each number is for",[170,205,255],{size:28}),{dy:10});
  ctx.restore();vign(ctx,S);});

/* ---------- 10. An answer, for now ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const cC=c("confirms"),cA=c("answer"),cX=c("next"),ok=fin(t,w("confirms","confirms")+0.2,0.6);
  arrive(ctx,420,290,t,0.2,()=>{vpCanvas2(ctx,60,100,720,380,1,{title:"households",lab:0});statusDot(ctx,748,132,14,0.5+0.5*ok,ok>0.5?TRUST:INKD);if(ok>0)withA(ctx,ok,()=>kt_gtick(ctx,730,446,22,1));},{d:1.0,from:0.96});
  [["businesses",130],["households in hardship",250],["homes with solar",370]].forEach(([s_,y],i)=>arrive(ctx,960,y,t,0.5+i*0.15,()=>sticky(ctx,960,y,280,104,s_,{col:NOTEC[2],size:28,st:0.5}),{dy:-16}));
  withA(ctx,fin(t,w("confirms","rest stay"),0.5),()=>T(ctx,"drafts, for now",960,480,{w:700,size:30,align:"center",color:"rgba(238,224,196,0.85)"}));
  person(ctx,"farah",130,1030,0.76,{t,pose:t>cC&&t<cC+1.8?"explain":"stand"});
  person(ctx,"tomas",1800,1030,0.78,{t,pose:t>cA&&t<cA+2.2?"explain":"stand"});
  arrive(ctx,1450,180,t,0.4,()=>sticky(ctx,1450,180,320,150,"Why does it exist?",{col:NOTEC[0],size:32,st:fin(t,cA+1.4,0.5)*0.5,rot:-0.03}),{dy:-20});
  arrive(ctx,1450,400,t,cA,()=>sticky(ctx,1450,400,480,230,"To keep the region's homes and businesses powered, affordably and fairly.",{col:NOTEC[0],size:32,p:clamp((t-cA-0.2)/2.2,0,1),rot:0.015}),{dy:-30,from:1.06});
  arrive(ctx,960,650,t,w("next","why"),()=>sticky(ctx,960,650,320,140,"Why must it change?",{col:NOTEC[0],size:32,st:0,rot:0.03}),{dy:-30,from:1.06});
  ctx.restore();vign(ctx,S);
  eaEnd(ctx,S,t,B+0.8,"Who it serves, and how it pays",EAC,"Know who it serves, and how it pays, before anything else.","Film 2 of 11");});
