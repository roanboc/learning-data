/* ===== Who owns which data: scenes =====
   Eight chapters, as in ../script.md. Chile in 1972, in lamp-light, a table of two pictures the camera glides along: Cybersyn's
   engineers at a factory, its five numbers, one of them out of its range and the warning (A); then the levels a warning could go to,
   the centre in Santiago, that industry's committee at CORFO, and five factories with their managers (H): every warning sent to the
   centre, which buries it while the factories wait, and then Beer's design, each warning first to the factory's own manager, a clock for
   the time they have, and only up to the committee when it runs out. Then the utility, one room: the catalogue (K); hosting capacity's
   story, to its right (D); the rule, under K (R); the data product, under D (P); the four words, to P's right (F); the target and its
   gaps, under F (G); and the data practice on the map, under P (M). Chile and the room dissolve into each other because the whole
   picture changes; in the room the camera glides from place to place, and whatever it passes is drawn as it was left there. Made to
   read on a phone (tools/legible.py): text is at least 28 px in the frame. Sound: every effect in tools/score.py fires at the same
   moment as the thing it belongs to here, so keep the two in step. */

// the camera in the room: keys are [time, x, y, zoom]; every move eases over 1.7 s
function d5_cam(ctx,S,t,keys){setScreen(ctx,S);return focus(ctx,t,keys,1.7);}
// where Chile's second picture starts, and the places in the room
const D5_HX=1920,D5_DX=1920,D5_RY=1110,D5_PX=1920,D5_PY=1110,D5_WX=3840,D5_WY=1110,D5_GX=3840,D5_GY=2220,D5_MX=1920,D5_MY=2220;
const D5_INES=[1770,1010];
// each factory's own time, the share of its clock it has before a warning goes up
const D5_TIMES=[0.35,0.6,0.25,0.5,0.4];

/* ---------- K: the catalogue ---------- */
function d5_K(ctx,t,o){o=o||{};d5_catalogue(ctx,o.cat||{});(o.tags||[]).forEach(([s,x,y,c,q,al])=>{if(q>0.01)withA(ctx,q,()=>tag(ctx,x,y,s,c,{align:al||"center",size:28}));});
  if((o.ines==null?1:o.ines)>0.01)daPerson(ctx,"ines",D5_INES[0],D5_INES[1],0.95,{t:o.T,dir:-1,a:o.ines==null?1:o.ines});}

/* ---------- D: hosting capacity's story ---------- */
const D5_TAB=[700,210],D5_MET=[120,360],D5_SITE=[1300,120],D5_CAL=[120,610],D5_HOM=[712,600];
// o.bo, o.grace, o.met (d5_method's options), o.tab (d5_table's options), o.site (d5_site's options), o.arrows (0..1), o.cal: [[month, a]],
// o.homes: [p, a, part]; o.told (0..1) the dashed line nobody sent; o.extra: more to draw; o.tags
function d5_D(ctx,t,o){o=o||{};ctx.save();ctx.translate(D5_DX,0);
  withA(ctx,o.bo==null?1:o.bo,()=>{tag(ctx,120,100,"on the map",BUSC,{size:28});daBO(ctx,120,130,400,104,"hosting capacity",{size:30});});
  daOwner(ctx,120,288,"Grace · network operations",{a:o.grace==null?1:o.grace,hi:o.graceHi||0});
  d5_method(ctx,D5_MET[0],D5_MET[1],o.met||{});d5_table(ctx,D5_TAB[0],D5_TAB[1],o.tab||{});d5_site(ctx,D5_SITE[0],D5_SITE[1],o.site||{});
  const ar=o.arrows==null?1:o.arrows;if(ar>0.01){arrowTo(ctx,D5_MET[0]+506,D5_MET[1]+80,D5_TAB[0]-8,D5_TAB[1]+150,INFC,0.85*ar,{p:clamp(ar*2,0,1),lw:2.6,head:12});
    arrowTo(ctx,D5_TAB[0]+528,D5_TAB[1]+110,D5_SITE[0]-10,D5_SITE[1]+200,INFC,0.85*ar,{p:clamp(ar*2-1,0,1),lw:2.6,head:12});}
  if(o.told>0.01){const x0=D5_MET[0]+506,y0=D5_MET[1]+150,x1=D5_TAB[0]-8,y1=D5_TAB[1]+210;arrowTo(ctx,x0,y0,x1,y1,D5_RED,0.85*o.told,{dash:[8,8],lw:2.4,nohead:true});kt_rcross(ctx,(x0+x1)/2,(y0+y1)/2,14,o.told);}
  if(o.cal)d5_cal(ctx,D5_CAL[0],D5_CAL[1],o.cal,o.calA==null?1:o.calA);
  if(o.homes)d5_homes(ctx,D5_HOM[0],D5_HOM[1],o.homes[0],o.homes[1],{part:o.homes[2]||0});
  (o.tags||[]).forEach(([s,x,y,c,q,al])=>{if(q>0.01)withA(ctx,q,()=>tag(ctx,x,y,s,c,{align:al||"center",size:28}));});
  (o.extra||[]).forEach(f=>f(ctx));ctx.restore();}
// D as chapter 2 leaves it
function d5_D2(){return{met:{v2:1},tab:{ver:"v1",bad:1},site:{wrong:1},cal:[["August",1]],homes:[1,1,1],
  tags:[["how much solar each street can take",960,494,SOFT,1],["90 families",1000,846,TRUST,1]],
  extra:[ctx=>{const s="nobody was careless",vw=d5_verdictW(ctx,s);d5_verdict(ctx,1560-vw/2,620,s,true,1);const cs="owner: the one team that couldn't know";d5_chip(ctx,Math.min(1336,1880-tw(ctx,cs,28,700)-56),712,cs,{});}]};}

/* ---------- R: the rule ---------- */
const D5_COLS=[380,960,1540],D5_CAPS=["plan the network","serve customers","meet obligations"],D5_PRODN=["hosting capacity","accounts","minutes without power"],D5_OWNN=["Grace","head of retail","Ama"];
const D5_DOMS=[["network",[132,176,255]],["retail",[255,150,186]],["enterprise domain",[196,160,255]]];
const D5_RULE="Every table belongs to a data product, and each product to whoever owns the capability that creates its data.";
// o.rule (0..1); o.col(k): {dom, cap, arrow, prod, own, hi} column k's parts; o.team, o.centre, o.beer, o.date (0..1)
function d5_R(ctx,t,o){o=o||{};ctx.save();ctx.translate(0,D5_RY);
  ruleCard(ctx,260,60,1400,D5_RULE,{kicker:"the rule",col:TRUST,size:32,a:o.rule==null?1:o.rule,hi:o.ruleHi||0});
  D5_COLS.forEach((cx,k)=>{const q=o.col?o.col(k):{dom:1,cap:1,arrow:1,prod:1,own:1},x=cx-230;
    withA(ctx,q.dom||0,()=>tag(ctx,cx,264,D5_DOMS[k][0],D5_DOMS[k][1],{align:"center",size:28}));
    archEl(ctx,x,300,460,90,D5_CAPS[k],LAY6[1][1],"capability",{a:q.cap||0,size:30,hi:q.hi||0});
    if((q.arrow||0)>0.01){arrowTo(ctx,cx,394,cx,436,SOFT,0.9*q.arrow,{p:q.arrow,lw:2.6,head:11});withA(ctx,q.arrow,()=>T(ctx,"creates",cx+18,424,{w:600,size:28,color:rgba(SOFT,0.95)}));}
    d5_prod(ctx,x,444,460,96,D5_PRODN[k],{a:q.prod||0,hi:q.hi||0});
    if((q.own||0)>0.01){const ow=tw(ctx,D5_OWNN[k],28,700)+56;d5_chip(ctx,cx-ow/2,584,D5_OWNN[k],{biz:true,a:q.own,hi:q.hi||0});}});
  const tm=o.team||0;if(tm>0.01)withA(ctx,tm,()=>{const s="data team: builds and runs every product",w=tw(ctx,s,28,700)+56;glass(ctx,150,654,w,52,26,TECH,{glow:10,ea:0.8,fill:"rgba(8,14,20,0.95)"});
    archGlyph(ctx,"role",176,680,9,TECH);T(ctx,s,194,690,{w:700,size:28,color:rgba(mix(TECH,INK,0.35),1)});});
  withA(ctx,o.centre||0,()=>tag(ctx,1340,680,"the centre keeps: platform · catalogue · a few rules",DAC,{align:"center",size:28}));
  withA(ctx,o.beer||0,()=>tag(ctx,700,770,"as in Beer's design: each solves its own first",CY_LAMP,{align:"center",size:28}));
  withA(ctx,o.date||0,()=>tag(ctx,1500,770,"on the map · decided 3 October",TRUST,{align:"center",size:28}));
  ctx.restore();}

/* ---------- P: the data product ---------- */
// o.cx: the card's left edge, in the middle while its five things are said, then moved left to make room for the catalogue's list
function d5_P(ctx,t,o){o=o||{};const cx=o.cx==null?80:o.cx;ctx.save();ctx.translate(D5_PX,D5_PY);d5_productCard(ctx,cx,90,o.card||{});d5_prodList(ctx,1200,90,o.list==null?1:o.list,o.listA==null?1:o.listA);
  withA(ctx,o.def||0,()=>tag(ctx,cx+530,760,"data made for others to use, with someone who answers for it",BUSC,{align:"center",size:28}));ctx.restore();}

/* ---------- F: four words ---------- */
// o.card(k): {a, full, qa, hi, dim}; o.one (0..1) the one catalogue over the two the utility uses; o.target, o.next (0..1)
function d5_F(ctx,t,o){o=o||{};ctx.save();ctx.translate(D5_WX,D5_WY);
  D5_SXS.forEach((x,k)=>{const q=o.card?o.card(k):{a:1};if((q.a||0)<=0.01)return;d5_style(ctx,k,x,110,t,{a:q.a,full:q.full==null?1:q.full,qa:q.qa==null?1:q.qa,hi:q.hi||0,dim:q.dim||0});});
  const one=o.one||0;if(one>0.01)withA(ctx,one,()=>{glass(ctx,520,40,880,52,26,DAC,{glow:14,ea:0.85,fill:"rgba(8,10,18,0.96)"});T(ctx,"one catalogue",960,76,{w:800,size:30,align:"center",color:rgba(DAC,1)});});
  withA(ctx,o.target||0,()=>tag(ctx,960,800,"the utility's target: a mesh of owners, on its lakehouse",TRUST,{align:"center",size:30}));
  withA(ctx,o.next||0,()=>tag(ctx,960,858,"one platform or several: Platform and solution architecture",DAC,{align:"center",size:28}));ctx.restore();}

/* ---------- G: the target and its gaps ---------- */
const D5_BASE=["300 tables owned by the data team","few contracts","access: an email to the data team"],D5_TARG=["every table in a product with a business owner, or retired","each product with its five things","the data team owns only the platform"];
// o.base, o.targ: {a, p(i), hiR(i)}; o.gap (0..1) the gaps between them; o.road: d5_road's options; o.clock: [a, p]; o.arch: d5_archive's options; o.tags
function d5_G(ctx,t,o){o=o||{};ctx.save();ctx.translate(D5_GX,D5_GY);
  d5_panel(ctx,80,70,760,"baseline · today",D5_BASE,Object.assign({col:D5_GREY},o.base||{}));d5_panel(ctx,1080,70,760,"target",D5_TARG,Object.assign({col:TRUST},o.targ||{}));
  const gp=o.gap||0;if(gp>0.01)[0,1,2].forEach(i=>{const q=clamp(gp*3-i,0,1);if(q<=0.01)return;withA(ctx,q,()=>{const y=200+i*100;archGlyph(ctx,"gap",960,y,22,TRUST);ctx.save();ctx.strokeStyle=rgba(TRUST,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(846,y);ctx.lineTo(930,y);ctx.moveTo(990,y);ctx.lineTo(1074,y);ctx.stroke();ctx.restore();});});
  withA(ctx,gp,()=>T(ctx,"gaps",960,128,{w:800,size:30,align:"center",color:rgba(TRUST,1)}));
  if(o.road)d5_road(ctx,120,560,1200,o.road);
  if(o.clock&&o.clock[0]>0.01){d5_clock(ctx,480,630,30,o.clock[1],o.clock[0],{col:TRUST});withA(ctx,o.clock[0],()=>T(ctx,"3 months",524,640,{w:700,size:28,color:rgba(mix(TRUST,INK,0.35),1)}));}
  if(o.arch)d5_archive(ctx,1460,580,o.arch);
  (o.tags||[]).forEach(([s,x,y,c,q,al])=>{if(q>0.01)withA(ctx,q,()=>tag(ctx,x,y,s,c,{align:al||"center",size:28}));});ctx.restore();}
// G as chapter 6 leaves it
function d5_G6(){return{base:{a:1},targ:{a:1},gap:1,road:{a:1},clock:[1,1],arch:{a:1,fill:1,ret:1},tags:[["the centre steps in only where it isn't solved in time",960,846,CY_LAMP,1]]};}

/* ---------- 1. Designing freedom ---------- */
scene("freedom",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tU=c("utility"),toU=fin(t,tU-0.6,1.2);
  if(toU<0.99){ctx.save();ctx.globalAlpha=1-toU;d5_night(ctx,S,t);setScreen(ctx,S);
    const tFi=c("five"),tWa=c("warn"),tWh=c("who"),tSa=c("santiago"),tAl=c("allende"),tNe=c("needed"),tFr=c("first"),tTi=c("time"),tUp=c("up"),tCh=c("chose"),tCo=c("control");
    focus(ctx,t,[[0,960,540,1.0],[tWh-0.6,D5_HX+960,540,1.0]],1.7);
    // A: the engineers at a factory, with its workers and managers; the five numbers they chose; one out of its range, and the warning
    if(t<tWh+2.4){const tEn=w("year","engineers"),tWo=w("five","workers"),tMa=w("five","managers"),tNu=w("five","five numbers"),tOu=w("warn","out of its range"),tWr=w("warn","warning");
      daFactory(ctx,560,800,1.0,{lit:0.85,t,a:fin(t,0.3,1.0)});
      const wk=clamp((t-0.6)/3.0,0,1),ex=lerp(1240,870,sstep(0,1,wk)),walking=wk>0.001&&wk<0.999;
      daSil(ctx,ex,866,300,{a:fin(t,0.5,0.8),dir:-1,walk:walking?t*5.2:null,board:1});daSil(ctx,ex+130,872,288,{a:fin(t,0.7,0.8),dir:-1,walk:walking?t*5.2+1.6:null,board:0.6});
      daSil(ctx,400,872,290,{a:fin(t,tWo-0.3,0.7)});daSil(ctx,486,876,280,{a:fin(t,tWo-0.1,0.7),wide:1.06});daSil(ctx,640,868,296,{a:fin(t,tMa-0.3,0.7),dir:-1,board:0.5});
      withA(ctx,fin(t,tWo-0.2,0.6),()=>tag(ctx,443,520,"workers",CY_LAMP,{align:"center",size:28}));withA(ctx,fin(t,tMa-0.2,0.6),()=>tag(ctx,640,470,"managers",CY_LAMP,{align:"center",size:28}));
      d5_card(ctx,120,170,0,"Cybersyn's engineers","from factory to factory",fin(t,tEn-0.3,0.7));
      d5_five(ctx,1250,150,clamp((t-tNu+0.3)/1.6,0,1),fin(t,tNu-0.4,0.6)*(1-fin(t,tWa-0.6,0.4)));
      daIndicator(ctx,1060,150,780,400,D5_IND,{a:fin(t,tWa-0.2,0.6),title:"one of the five, day by day",p:clamp((t-tWa+0.1)/1.4,0,1),band:[0.4,0.7]});
      d5_strip(ctx,1300,590,440,"OUT OF RANGE",fin(t,tWr-0.3,0.5),{size:30,h:70,sig:pulseAt(t,tWr+0.2,1.4)});
      withA(ctx,fin(t,tOu-0.1,0.5),()=>tag(ctx,1450,720,"a warning",CY_SIG,{align:"center",size:28}));}
    // H: the levels a warning could go to; every warning to the centre, which buries it; then Beer's design: first the factory's own
    // manager, a set time on a clock, and up to the committee only when the time runs out; each factory's time; designing freedom
    if(t>tWh-2.6){ctx.save();ctx.translate(D5_HX,0);const tTo=w("who","who"),tSt=w("santiago","Santiago"),tBu=w("santiago","buried"),tWt=w("santiago","wait"),tRo=w("needed","room"),tOn=w("needed","only");
      const tOw=w("first","own manager"),tSe=w("time","set time"),tIn=w("up","Only"),tNx=w("up","next level"),tCm=w("up","committee"),tEa=w("chose","each factory's time"),tDf=w("chose","designing freedom");
      const tAc=w("control","almost complete control"),tSr=w("control","serious problems");
      const clr=fin(t,tFr-0.6,0.6),fl=fin(t,tSt-0.3,0.6)*(1-clr),pile=clamp((t-tBu+0.4)/1.6,0,1)*(1-clr),wait=fin(t,tWt-0.3,0.6)*(1-fin(t,tRo-0.4,0.5));
      const ck2=clamp((t-tSe+0.1)/3.2,0,1)*0.6,ck4=clamp((t-tIn+0.1)/1.2,0,1),ch=fin(t,tEa-0.3,0.7);
      d5_hier(ctx,t,{cen:fin(t,tWh-0.4,0.7),com:fin(t,tWh-0.1,0.7),fac:fin(t,tWh-0.6,0.8),flood:fl,pile,red:Math.max(fin(t,tBu-0.2,0.6)*(1-clr),0),wait,
        warn:i=>i===2?fin(t,tTo-0.2,0.5)*(1-fin(t,tSt-0.4,0.4))+fin(t,tFr-0.2,0.5)*(1-fin(t,tUp+0.8,0.5)):i===4?fin(t,tIn-0.4,0.5)*(1-fin(t,tNx+0.6,0.5)):0,
        mgr:i=>i===2?fin(t,tOw-0.3,0.6)*(1-fin(t,tCh,0.6)):0,comHi:pulseAt(t,tCm+0.2,1.6),
        clock:i=>{const own={a:ch,p:D5_TIMES[i],col:CY_LAMP};if(i===2){const a=fin(t,tSe-0.4,0.5);return{a:Math.max(a,ch),p:ch>0.5?D5_TIMES[2]:ck2,ok:fin(t,tUp+0.4,0.5)};}
          if(i===4){const a=fin(t,tIn-0.4,0.5);return{a:Math.max(a,ch),p:ch>0.5?D5_TIMES[4]:ck4,col:ck4>=1&&ch<0.5?D5_RED:CY_LAMP};}return own;},
        up:i=>i===4?clamp((t-tNx+0.3)/1.0,0,1):0});
      withA(ctx,fin(t,tTo-0.1,0.5)*(1-fin(t,tSt-0.4,0.4)),()=>tag(ctx,960,474,"who should it go to?",CY_SIG,{align:"center",size:28}));
      withA(ctx,fin(t,tBu-0.1,0.6)*(1-fin(t,tOn-0.5,0.5)),()=>tag(ctx,1190,158,"buried in small problems",D5_RED,{size:28}));
      withA(ctx,wait,()=>tag(ctx,960,840,"waiting for orders",SOFT,{align:"center",size:28}));
      d5_note(ctx,40,110,540,"President Allende","decentralising, with workers taking part, not bureaucratic",fin(t,tAl-0.3,0.7)*(1-fin(t,tFr-0.6,0.5)));
      withA(ctx,fin(t,tRo-0.2,0.6)*(1-fin(t,tFr-0.6,0.5)),()=>tag(ctx,960,840,"factories: room to solve their own",CY_LAMP,{align:"center",size:28}));
      withA(ctx,fin(t,tOn-0.2,0.6)*(1-fin(t,tFr-0.6,0.5)),()=>tag(ctx,1190,158,"the centre: only what they can't",CY_LAMP,{size:28}));
      withA(ctx,fin(t,tOw-0.2,0.6)*(1-fin(t,tSe-0.5,0.4)),()=>tag(ctx,960,840,"first: the factory's own manager",CY_LAMP,{align:"center",size:28}));
      withA(ctx,fin(t,tSe-0.1,0.6)*(1-fin(t,tIn-0.5,0.4)),()=>tag(ctx,960,840,"a set time, in their own way",CY_LAMP,{align:"center",size:28}));
      withA(ctx,fin(t,tNx-0.1,0.6)*(1-fin(t,tCh-0.5,0.4)),()=>tag(ctx,960,840,"not solved in time: up to the committee",CY_SIG,{align:"center",size:28}));
      withA(ctx,fin(t,tEa-0.1,0.6)*(1-fin(t,tCo-0.5,0.4)),()=>tag(ctx,960,840,"each factory's own time, chosen by the engineers",CY_LAMP,{align:"center",size:28}));
      d5_card(ctx,1220,96,0,"designing freedom","Stafford Beer",fin(t,tDf-0.4,0.7),{hi:pulseAt(t,tDf+0.2,1.4)});
      d5_note(ctx,40,110,540,"almost complete control","of its own work, Beer argued; the centre steps in only on serious problems",fin(t,tAc-0.4,0.7),{hi:pulseAt(t,tSr,1.4)});
      ctx.restore();}
    setScreen(ctx,S);daYear(ctx,90,96,"Chile, 1972",fin(t,0.3,0.8)*(1-fin(t,tWh-1.0,0.6)));
    ctx.restore();}
  // the utility: Inés opens the catalogue; 412 tables, 300 of them the data team's, because it built them
  if(toU>0.01){ctx.save();ctx.globalAlpha=toU;wallBg(ctx,S,t);d5_cam(ctx,S,t,[[0,960,540,1.0]]);ctx.globalAlpha=toU*(1-0.6*fin(t,B+0.8,0.8));  // dimmed under the title
    const tCa=w("utility","catalogue"),tEv=w("utility","every table"),tTh=w("owner","three hundred"),tDt=w("owner","data team"),tBt=w("owner","built them");
    d5_K(ctx,t,{cat:{a:fin(t,tU+0.2,0.8),rows:clamp((t-tCa+0.2)/1.6,0,1),grid:clamp((t-tEv+0.1)/1.8,0,1),count:fin(t,tTh-0.3,0.6),dtHi:pulseAt(t,tDt+0.2,1.6)},
      tags:[["owner by default: whoever built it",1100,72,SOFT,fin(t,tBt-0.2,0.6)]],ines:fin(t,tU+0.3,0.8),T:sc.start+t});
    ctx.restore();}
  vign(ctx,S);
  daTitle(ctx,S,t,B+1.0,"Who owns which data","each domain's data, and who answers for it","Film 5 of 6 · data architecture");});

/* ---------- 2. Owned by default ---------- */
scene("default",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tOn=c("one"),tMp=c("map"),tBu=c("built"),tMa=c("may"),tTh=c("theirs"),tFo=c("four"),tNi=c("ninety"),tCa=c("careless");
  wallBg(ctx,S,t);d5_cam(ctx,S,t,[[0,960,540,1.0],[0.8,D5_DX+960,540,1.0]]);
  // K, as chapter 1 left it, while the camera moves on
  if(t<2.8)d5_K(ctx,t,{cat:{count:1},T:sc.start+t});
  const tHc=w("one","hosting capacity"),tSo=w("one","how much solar"),tGr=w("map","Grace's"),tDe=w("map","defined"),tWo=w("map","work it out"),tTa=w("built","table"),tWe=w("built","website");
  const tOl=w("may","older cables"),tCh=w("may","changed"),tKe=w("may","kept the old"),tNt=w("theirs","theirs to tell"),tNw=w("theirs","no way to know"),tFm=w("four","four months"),tMo=w("four","more solar");
  const tPa=w("ninety","bought panels"),tPt=w("ninety","only part"),tNc=w("careless","Nobody was careless"),tOt=w("careless","one team");
  const months=d5_months(t,["May","June","July","August"],[tMa,tFm+0.2,tFm+0.8,tFm+1.4]);
  d5_D(ctx,t,{bo:fin(t,tMp-0.3,0.7),grace:fin(t,tGr-0.2,0.6),graceHi:pulseAt(t,tGr+0.2,1.4)+pulseAt(t,tNt,1.4),
    met:{a:fin(t,tDe-0.2,0.6),v2:fin(t,tCh-0.2,0.6)},tab:{a:fin(t,tHc-0.4,0.7),ver:"v1",bad:fin(t,tKe-0.2,0.6),ownHi:pulseAt(t,tNw,1.6)},
    site:{a:fin(t,tWe-0.4,0.7),wrong:fin(t,tMo-0.2,0.7)},arrows:clamp((t-tTa+0.2)/1.4,0,1),told:fin(t,tNt-0.3,0.6),cal:months,calA:fin(t,tMa-0.3,0.6),
    homes:[clamp((t-tPa+0.3)/1.4,0,1),fin(t,tNi-0.3,0.5),fin(t,tPt-0.2,0.7)],
    tags:[["how much solar each street can take",960,494,SOFT,fin(t,tSo-0.2,0.6)],["90 families",1000,846,TRUST,fin(t,tNi-0.1,0.6)],
      ["households check it",1560,582,SOFT,fin(t,tWe-0.1,0.6)*(1-fin(t,tCa-0.6,0.5))],["?",1106,366,D5_RED,fin(t,tNw-0.2,0.5)*(1-fin(t,tCa-0.6,0.5))]],
    extra:[ctx=>{const s="nobody was careless",vw=d5_verdictW(ctx,s);d5_verdict(ctx,1560-vw/2,620,s,true,fin(t,tNc-0.2,0.6),{hi:pulseAt(t,tNc+0.2,1.4)});
      const cs="owner: the one team that couldn't know";d5_chip(ctx,Math.min(1336,1880-tw(ctx,cs,28,700)-56),712,cs,{a:fin(t,tOt-0.2,0.6),hi:pulseAt(t,tOt+0.3,1.4)});}]});
  vign(ctx,S);});

/* ---------- 3. The business that knows ---------- */
scene("knows",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tRu=c("rule"),tEa=c("each"),tHo=c("hosting"),tAc=c("accounts"),tMe=c("measure"),tTe=c("team"),tBe=c("beer"),tDa=c("date");
  wallBg(ctx,S,t);d5_cam(ctx,S,t,[[0,D5_DX+960,540,1.0],[0.8,960,D5_RY+540,1.0]]);
  if(t<2.8){d5_K(ctx,t,{cat:{count:1},T:sc.start+t});d5_D(ctx,t,d5_D2());}  // the camera passes the catalogue's corner on its way down
  const tOwn=w("rule","owners"),tMap=w("rule","match the map"),tCap=w("each","capability"),tPl=w("hosting","Planning the network"),tGr=w("hosting","Grace's"),tSe=w("accounts","Serving customers"),tHr=w("accounts","head of retail");
  const tCr=w("measure","crosses domains"),tEn=w("measure","enterprise domain"),tBr=w("team","builds and runs"),tCe=w("team","centre"),tAg=w("date","agree");
  d5_R(ctx,t,{rule:fin(t,w("rule","one rule")-0.2,0.7),ruleHi:pulseAt(t,tCap+0.2,1.6),
    col:k=>{const t0=k===0?tPl:k===1?tSe:tCr,t1=k===0?tGr:k===1?tHr:tEn;return{dom:fin(t,t0-0.4,0.6),cap:fin(t,t0-0.3,0.6),arrow:clamp((t-t0-0.3)/0.6,0,1),prod:fin(t,t0+0.3,0.6),own:fin(t,t1-0.2,0.6),hi:pulseAt(t,t1+0.2,1.4)};},
    team:fin(t,tBr-0.3,0.6),centre:fin(t,tCe-0.2,0.6),beer:fin(t,tBe-0.2,0.6),date:fin(t,tAg-0.2,0.6)});
  vign(ctx,S);});

/* ---------- 4. Data as a product ---------- */
scene("product",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tWh=c("what"),tFi=c("five"),tOw=c("owner"),tDo=c("docs"),tLi=c("lineage"),tCo=c("contract"),tAc=c("access"),tCa=c("catalogue");
  wallBg(ctx,S,t);d5_cam(ctx,S,t,[[0,960,D5_RY+540,1.0],[0.8,D5_PX+960,D5_PY+540,1.0]]);
  if(t<2.8)d5_R(ctx,t,{rule:1,col:k=>({dom:1,cap:1,arrow:1,prod:1,own:1}),team:1,centre:1,beer:1,date:1});
  const ts=[tOw,tDo,tLi,tCo,tAc];
  d5_P(ctx,t,{cx:lerp(430,80,ease(clamp((t-tCa+0.7)/1.0,0,1))),card:{a:fin(t,tWh-0.2,0.7),keys:fin(t,w("five","five things")-0.2,0.6),p:i=>fin(t,ts[i]-0.2,0.6),hiR:i=>pulseAt(t,ts[i]+0.3,1.4)},def:fin(t,tWh+0.4,0.6)*(1-fin(t,tFi-0.4,0.5)),list:clamp((t-tCa+0.1)/1.6,0,1),listA:fin(t,tCa-0.3,0.6)});
  vign(ctx,S);});

/* ---------- 5. Four words ---------- */
scene("words",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tHe=c("hear"),tDi=c("differ"),tWa=c("warehouse"),tLa=c("lakehouse"),tMe=c("mesh"),tFa=c("fabric"),tMi=c("mix"),tPl=c("platform");
  wallBg(ctx,S,t);d5_cam(ctx,S,t,[[0,D5_PX+960,D5_PY+540,1.0],[0.8,D5_WX+960,D5_WY+540,1.0]]);
  if(t<2.8)d5_P(ctx,t,{card:{},list:1});
  const tw4=[w("hear","warehouse"),w("hear","lakehouse"),w("hear","mesh"),w("hear","fabric")],td=[tWa,tLa,tMe,tFa],tQu=w("differ","different questions");
  const tMs=w("mix","mesh of owners"),tLk=w("mix","lakehouse"),tOc=w("mix","one catalogue");
  d5_F(ctx,t,{card:k=>({a:fin(t,tw4[k]-0.2,0.6),full:fin(t,td[k]+0.1,0.6),qa:fin(t,tQu-0.2+k*0.2,0.5),hi:pulseAt(t,td[k]+0.3,1.6)+(k===2||k===1?pulseAt(t,k===2?tMs:tLk,1.4):0),dim:(k===0||k===3)?fin(t,tMi,0.6):0}),
    one:fin(t,tOc-0.3,0.6),target:fin(t,tMs-0.3,0.6),next:fin(t,tPl-0.2,0.6)});
  vign(ctx,S);});

/* ---------- 6. The target and its gaps ---------- */
scene("gaps",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tTw=c("two"),tTo=c("today"),tTa=c("target"),tGa=c("gap"),tHu=c("hurts"),tTh=c("three"),tUn=c("unclaimed"),tCe=c("centre");
  wallBg(ctx,S,t);d5_cam(ctx,S,t,[[0,D5_WX+960,D5_WY+540,1.0],[0.8,D5_GX+960,D5_GY+540,1.0]]);
  if(t<2.8)d5_F(ctx,t,{card:k=>({a:1,dim:(k===0||k===3)?1:0}),one:1,target:1,next:1});
  const tBa=w("two","baseline"),tTg=w("two","target"),tTh3=w("today","three hundred"),tFc=w("today","few"),tEm=w("today","email"),tEv=w("target","every table"),tRe=w("target","retired"),tOp=w("target","only the platform");
  const tRm=w("gap","roadmap"),tQu=w("gap","quarter"),tHc=w("hurts","hosting capacity"),tMr=w("hurts","most readers"),tCl=w("three","claim"),tAr=w("unclaimed","archived"),tTf=w("unclaimed","told first"),tRt=w("unclaimed","retired");
  const bs=[tTh3,tFc,tEm],tg=[tEv,w("target","business owner"),tOp];
  d5_G(ctx,t,{base:{a:fin(t,tBa-0.3,0.6),p:i=>fin(t,bs[i]-0.3,0.6),hiR:i=>pulseAt(t,bs[i]+0.2,1.4)},targ:{a:fin(t,tTg-0.3,0.6),p:i=>i===1?fin(t,tRe-0.2,0.6):fin(t,tg[i]-0.3,0.6),hiR:i=>pulseAt(t,tg[i]+0.2,1.4)},
    gap:clamp((t-tGa+0.1)/1.2,0,1),road:{a:fin(t,tRm-0.3,0.6),p:i=>i===0?fin(t,tCl-0.3,0.6):i===1?fin(t,tHc-0.3,0.6):i===2?fin(t,tMr-0.3,0.6):fin(t,tQu-0.1,0.6),hiI:i=>i===1?pulseAt(t,tHc+0.2,1.4):0},
    clock:[fin(t,tCl-0.2,0.6),clamp((t-tCl)/2.4,0,1)],arch:{a:fin(t,tAr-0.4,0.6),fill:clamp((t-tAr+0.1)/1.4,0,1),ret:fin(t,tRt-0.2,0.4)},
    tags:[["readers told first",1610,860,SOFT,fin(t,tTf-0.2,0.6)*(1-fin(t,tCe-0.5,0.4))],["the centre steps in only where it isn't solved in time",960,846,CY_LAMP,fin(t,tCe-0.1,0.6)]]});
  vign(ctx,S);});

/* ---------- 7. On the map ---------- */
scene("map",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tDo=c("domains"),tEn=c("enterprise"),tPr=c("product"),tHo=c("hosting"),tSa=c("same");
  wallBg(ctx,S,t);d5_cam(ctx,S,t,[[0,D5_GX+960,D5_GY+540,1.0],[0.8,D5_MX+960,D5_MY+540,1.0]]);
  if(t<2.8)d5_G(ctx,t,d5_G6());
  const tCo=w("domains","concepts"),tCr=w("enterprise","cross them"),tDr=w("product","drawn as a product"),tCt=w("product","contract"),tBr=w("hosting","brings together"),tGo=w("hosting","Grace owns"),tPo=w("same","points to its product"),tSt=w("same","same thing");
  ctx.save();ctx.translate(D5_MX,D5_MY);
  d5_map(ctx,t,{band:fin(t,tDo-0.3,0.8),groups:fin(t,tDo+0.2,0.7),concepts:fin(t,tCo-0.2,0.6),owners:fin(t,tCo+0.3,0.6),ent:fin(t,tEn-0.2,0.7),
    p0:clamp((t-tPr-0.2)/0.8,0,1),p1:clamp((t-tPr-0.5)/0.8,0,1),p2:clamp((t-tPr-0.8)/0.8,0,1),p3:clamp((t-tPr-1.1)/0.8,0,1),agg:fin(t,tBr-0.3,0.7),prodHi:pulseAt(t,tGo+0.2,1.6)+pulseAt(t,B+0.4,2.4),doHi:pulseAt(t,B+0.6,2.4),point:clamp((t-tPo+0.3)/1.4,0,1),same:fin(t,tSt-0.7,0.4)});
  withA(ctx,fin(t,tSt-0.2,0.6),()=>tag(ctx,960,62,"the map and the platform say the same thing",TRUST,{align:"center",size:30}));
  ctx.restore();
  vign(ctx,S);});

/* ---------- 8. Solved where it's known ---------- */
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tCh=c("chile"),tUt=c("utility"),tCl=c("claimed"),tAr=c("archived"),tMe=c("method"),tTo=c("told"),tNx=c("next"),toU=fin(t,tUt-0.6,1.2);
  // Chile again, in lamp-light: in Beer's design, each factory first, each with its own time, and the centre hearing only of what wasn't solved in time
  if(toU<0.99){ctx.save();ctx.globalAlpha=1-toU;d5_night(ctx,S,t);setScreen(ctx,S);focus(ctx,t,[[0,960,540,1.0],[tCh+1.0,975,540,1.015]],1.7);
    const tFi=w("chile","first"),tNo=w("chile","not solved in time");ctx.save();ctx.translate(0,0);
    d5_hier(ctx,t,{clock:i=>({a:1,p:D5_TIMES[i],ok:i===4?0:fin(t,tFi+i*0.15,0.5)}),mgr:i=>fin(t,tFi-0.2+i*0.12,0.6),up:i=>i===4?clamp((t-tNo+0.2)/1.0,0,1):0,warn:i=>i===4?fin(t,tNo-0.6,0.5):0,comHi:pulseAt(t,tNo+0.9,1.4)});
    withA(ctx,fin(t,tFi-0.1,0.6),()=>tag(ctx,960,840,"each factory first, in its own time",CY_LAMP,{align:"center",size:28}));ctx.restore();
    setScreen(ctx,S);daYear(ctx,90,96,"Chile, 1972",fin(t,0.3,0.8));
    ctx.restore();}
  // the utility: the domains claim their tables, in data products; the rest archived; the next new method, a new version, its readers
  // told a week ahead; and the next question
  if(toU>0.01){ctx.save();ctx.globalAlpha=toU;wallBg(ctx,S,t);d5_cam(ctx,S,t,[[0,960,540,1.0],[tMe-0.7,D5_DX+960,540,1.0]]);ctx.globalAlpha=toU*(1-0.6*fin(t,B+0.6,0.8));  // dimmed under the end card
    const tSo=w("utility","solves"),tTw=w("claimed","two hundred"),tTo1=w("claimed","thirty-one"),tOt=w("archived","other"),tAk=w("archived","asked"),tNv=w("method","new version"),tWk=w("told","week ahead"),tNf=w("told","no family"),tLa=w("next","one language");
    d5_K(ctx,t,{cat:{rows:1,grid:1,count:1-fin(t,tTw-0.4,0.4),claim:clamp((t-tTw+0.2)/1.6,0,1),claimed:fin(t,tTw-0.2,0.6),arch:fin(t,tOt-0.2,1.0)},
      tags:[["each domain solves its own data's problems first",800,72,TRUST,fin(t,tSo-0.2,0.6)*(1-fin(t,tMe-0.8,0.4))]],T:sc.start+t});
    const tCm=w("method","changed their method");
    d5_D(ctx,t,{met:{v2:1,v3:fin(t,tCm-0.2,0.6)},tab:{ver:"v2",ver2:"v3",vmix:clamp((t-tNv+0.2)/0.6,0,1),own:1,hi:pulseAt(t,tNv+0.2,1.6)},site:{wrong:0,fix:1},
      tags:[["how much solar each street can take",960,494,SOFT,1],["readers told a week ahead",1560,582,TRUST,fin(t,tWk-0.2,0.6)],["who keeps them all speaking one language?",960,846,TRUST,fin(t,tLa-0.4,0.6)]],
      extra:[ctx=>{const s="no family bought panels its street couldn't take",vw=d5_verdictW(ctx,s);d5_verdict(ctx,Math.min(1560-vw/2,1860-vw),680,s,true,fin(t,tNf-0.2,0.6),{hi:pulseAt(t,tNf+0.2,1.4)});}]});
    ctx.restore();}
  vign(ctx,S);
  daEnd(ctx,S,t,B+0.8,"Who owns which data","Let the business that knows its data own it, and answer for it.","Film 5 of 6");});
