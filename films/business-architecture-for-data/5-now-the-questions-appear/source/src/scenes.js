/* ===== Now the questions appear: scenes =====
   Eleven chapters, as in ../script.md. Iran in the 1960s: an expert looks for water on a slope at the mountains' foot; a qanat ten
   kilometres long costs its builders a fortune, and until it's finished no one can be sure it will flow all year; so before they pay,
   two muqannis sink a trial well, and for a few days the buckets are dipped into the hollow at its foot, to measure how fast the water
   gathers; only then is the tunnel dug, and the water reaches the fields. Then Tomás's backlog of forty-two requests, read again with a
   trial well for every request; a request traced up to a decision, a capability and a goal, and one, never out of date, that reaches
   nothing; all forty-two, half of which reach nothing; a goal traced down to a decision, a question and a measure, meeting the request
   at one decision; a goal with no measure; two reports that count one measure differently, and one definition; each measure's home
   and owner; four data products instead of twenty-one reports; back at the trial well, the builders' question traced the same way;
   and Grace's measures confirmed.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; cards and names drawn small are texture. Motion:
   every shot drifts slowly and things arrive with a spring. Sound: every effect in tools/score.py fires at the same moment as the
   thing it belongs to here, so keep the two in step. */

/* ---------- 1. A trial well ---------- */
// The slope at the mountains' foot, cut away as the series draws a qanat, one autumn in the 1960s: the expert walks up it looking for
// water, and finds a damp patch and greener plants; the tunnel the builders would pay for, not yet dug, dashed from the spot down to
// the village's dry fields; the trial well sunk there, its earth wound up in leather buckets; the hollow at its foot, the water
// gathering in it, dipped once a day for three days, and how fast it fills; then the tunnel, dug from the foot of the slope up to the
// well, and the water run out to the fields. The people, at the series' scale (B1_S in What the business owns): the expert, the two
// builders, the worker at the windlass's handle, the one who empties the bucket, and the digger in the well, with his lamp
const D8_S=0.14,D8_EX=300,D8_BLD=[[346,-1,{dress:"robe",head:"turban"}],[378,-1,{dress:"robe",head:"cap"}]],D8_DAY=2.6;
// the bucket's way up the well (0 at its foot, 1 at the top), turned from the top every per seconds from t0
const d8_wind=(t,t0,per)=>t<t0?1:0.5+0.5*Math.cos(TAU*(t-t0)/per);
// the people and the windlass at the well, as st says: the windlass's bucket (p, its way up; foot, the depth it goes down to; water),
// the worker at the handle and the one who empties the bucket (at), the digger in the well (dig) or out of it (out), the expert (ex:
// where he stands, and how far he has come), the builders (bld)
function d8_atWell(ctx,t,st){const ys=ba_ys(BA_XM),a=st.at||0,p=st.p==null?1:st.p,depth=Math.max(0,(st.foot-ys)/0.2-14);
  if(a>0.01){d8_windlass(ctx,BA_XM,ys,0.2,p,p*4,{f:-1,depth,a,water:st.water||0});
    ba_fig(ctx,224,ba_ys(224),D8_S,{dress:"tunic",head:"cap",f:1,reach:ba_crank(BA_XM,ys,0.2,p*4,-1),a,t,rimA:0.6});
    // the one who empties the bucket: his hand on it while it's at the top
    const top=sstep(0.9,0.99,p);ba_fig(ctx,268,ba_ys(268),D8_S,{dress:"tunic",f:-1,reach:top>0.5?[255,ys+0.2*(-60-14)]:null,a,t,rimA:0.6});}
  if((st.dig||0)>0.01){const yb=st.foot;d8_lamp(ctx,BA_XM+3,yb,0.7,t,st.dig);ba_fig(ctx,BA_XM-5,yb,0.12,{kind:"stoop",hold:"pick",head:"cap",f:1,a:st.dig,rimA:0.85,rim:[255,206,140],col:[52,40,34],t});}
  if((st.out||0)>0.01)ba_fig(ctx,292,ba_ys(292),D8_S,{dress:"tunic",head:"cap",f:-1,a:st.out,t,rimA:0.6});
  if((st.exA||0)>0.01){const x=st.ex,bob=st.walk?Math.abs(Math.sin(t*5.2))*1.4:0;ba_fig(ctx,x,ba_ys(x)-bob,D8_S,{dress:"robe",head:"turban",f:-1,a:st.exA,t,rimA:0.7});}
  D8_BLD.forEach(([x,f,o],i)=>{const bA=st.bld?st.bld[i]||0:0;if(bA>0.01)ba_fig(ctx,x,ba_ys(x),D8_S,Object.assign({f,a:bA,t,rimA:0.6},o));});}
scene("trial",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tSv=c("survey"),tCo=c("cost"),tNe=c("need"),tKn=c("know"),tTr=c("trial"),tDi=c("dip"),tTk=c("trickle"),tAc=c("act"),tRe=c("repaid");
  // what's dug, and when: the well, as the diggers sink it, down to the damp ground; the hollow at its foot, and the water in it; the
  // tunnel, from the outlet up to the well once the trial is passed; then the well down to it, and the water run out to the fields
  const tSink=w("trial","sink")-0.2,tDamp=w("dip","damp ground"),shaft=ease(clamp((t-tSink)/Math.max(1,tDamp-tSink),0,1)),tHol=w("dip","hollow"),cav=fin(t,tHol-0.2,0.8);
  const tDays=w("dip","next few days")-0.2,tDig=w("trickle","Only then"),dug=clamp((t-tDig-0.4)/Math.max(1,tRe-tDig-0.4),0,1),deep=fin(t,tRe-0.2,1.0),flow=clamp((t-tRe+0.2)/2.6,0,1);
  const lvl=cav*(0.25+0.5*clamp((t-tHol)/5,0,1)),ysW=ba_ys(BA_XM),yb=lerp(ysW+4,D8_WB,shaft);
  // the bucket: up and down with earth while the well is sunk; then, for three days, down to the hollow once a day and up with water
  const dipping=t>=tDays&&t<tDays+3*D8_DAY,p=t<tDamp+0.6?d8_wind(t,tSink+0.5,2.4):dipping?d8_wind(t,tDays,D8_DAY):1,water=dipping&&((t-tDays)%D8_DAY)>D8_DAY*0.5?1:0;
  const days=[0,1,2].map(i=>fin(t,tDays+(i+1)*D8_DAY-0.35,0.6));
  // the camera: the slope and the plain; the expert on the slope; back to the plain for the tunnel; the builders; the well, close;
  // a little back, beside how fast it fills; the plain again as the tunnel is dug; the outlet and the fields as the water runs out
  setScreen(ctx,S);ctx.save();
  focus(ctx,t,[[0,1000,600,0.78],[tSv-0.4,340,470,1.9],[tCo-0.3,1000,640,0.78],[tKn-0.3,330,480,1.8],[tTr-0.2,262,540,2.3],[tDays-0.6,300,560,2.0],[tDig-0.3,1000,640,0.78],[tRe-0.2,1220,640,0.8]],1.8);
  ba_secSky(ctx,{warm:0.55});
  const tWet=w("edge","under the mountains")-0.3,hiG=pulseAt(t,tWet,2.2),tGh=w("edge","tunnels")-0.2,ghost=fin(t,tGh,0.8)*(1-fin(t,tDig-0.2,0.6));
  d8_ground(ctx,t,{shaft,cav,lvl,dug,deep,flow,wet:0.7+0.3*hiG,ghost:ghost*(0.7+0.3*pulseAt(t,tCo+0.2,2.0)),trickle:fin(t,w("need","trickle")-0.2,0.6)*(1-fin(t,tKn-0.2,0.6)),
    damp:fin(t,w("survey","damp patch")-0.3,0.8),green:fin(t,w("survey","greener")-0.3,1.0),hiW:pulseAt(t,w("trial","trial well")-0.1,1.6)});
  // the village and its fields: dry until the water reaches them, then green, one after another
  const wet=[0,1,2,3].map(i=>lerp(0.12,0.92,fin(t,tRe+2.4+i*0.7,1.4)));
  ba_village(ctx,t,{wet,fill:[0,1,2,3].map(i=>fin(t,tRe+2.2+i*0.7,0.4)*(1-fin(t,tRe+3.4+i*0.7,0.6)))});ba_channel(ctx,t,2230,clamp((t-tRe-2.0)/2.6,0,1));
  // the damp ground lit as the well reaches it
  if(t>tDamp-0.4)glow(ctx,BA_XM,D8_WB,60,BA_WATER,0.4*pulseAt(t,tDamp,1.6));
  // the people: the expert, who walks up the slope to the spot; the builders; the windlass and its two workers, and the digger in the
  // well, who climbs out once the hollow is scooped
  const tWk=w("survey","walks")-0.2,ex=lerp(480,D8_EX,ease(clamp((t-tWk)/3.0,0,1)));
  d8_atWell(ctx,t,{at:fin(t,tSink-0.5,0.6),p,foot:dipping?D8_WB+4:yb,water,dig:fin(t,tSink+0.2,0.5)*(1-fin(t,tHol+1.0,0.6)),out:fin(t,tHol+1.4,0.6),
    ex,walk:t>tWk&&t<tWk+3.0,exA:fin(t,tWk-0.4,0.6),bld:[0,1].map(i=>fin(t,w("know","the builders")-0.3+i*0.2,0.6))});
  // what the narration names, where it is
  const tg=(s_,x,y,col,a,o)=>baTagAt(ctx,S,x,y,s_,col,Object.assign({a},o||{}));
  tg("a tunnel from under the mountains",760,ba_yt(760)-BA_TH,[226,206,176],fin(t,tGh+0.3,0.5)*(1-fin(t,tSv-0.6,0.5)),{dy:-46});
  tg("groundwater",120,ba_yw(120),BA_WATER,fin(t,tWet,0.5)*(1-fin(t,tSv-0.6,0.5)),{dy:56});
  tg("a damp patch",222,ba_ys(222),[226,206,176],fin(t,w("survey","damp patch")-0.1,0.5)*(1-fin(t,tCo-0.6,0.5)),{dy:62});
  tg("greener plants",D8_EX,ba_ys(D8_EX),[180,226,140],fin(t,w("survey","greener")-0.1,0.5)*(1-fin(t,tCo-0.6,0.5)),{dy:-118});
  const tMo=w("need","the money gone")-0.2;
  tg("10 km · $13,500 to $34,000",845,ba_yt(845)-BA_TH,CLAY,fin(t,w("cost","thirteen")-0.2,0.5)*(1-fin(t,tMo,0.4)),{dy:-50});
  tg("the money gone",845,ba_yt(845)-BA_TH,BA_RED,fin(t,tMo+0.2,0.5)*(1-fin(t,tKn-0.4,0.5)),{dy:-50});
  tg("all year, or only in spring?",1440,ba_ys(1440),BA_WATER,fin(t,w("sure","flow all year")-0.3,0.5)*(1-fin(t,tNe+0.4,0.5)),{dy:-64});
  tg("a trickle",1250,ba_yt(1250),BA_WATER,fin(t,w("need","trickle"),0.5)*(1-fin(t,tKn-0.4,0.5)),{dy:52});
  tg("the fields dry",1810,ba_ys(1810),BA_RED,fin(t,w("need","fields dry")-0.1,0.5)*(1-fin(t,tKn-0.4,0.5)),{dy:-74});
  tg("is there water enough here?",362,ba_ys(362),BIZ,fin(t,w("know","is there")-0.2,0.5)*(1-fin(t,tTr-0.4,0.5)),{dy:-110});
  tg("a trial well",BA_XM,ysW,CLAY,fin(t,w("trial","trial well")-0.1,0.5)*(1-fin(t,tDi-0.4,0.5)),{dy:-96});
  tg("two muqannis: diggers",BA_XM,D8_WB,TECH,fin(t,w("trial","muqannis")-0.2,0.5)*(1-fin(t,tDi-0.4,0.5)),{dy:70});
  tg("leather buckets of earth",BA_XM+150,ysW+70,[226,206,176],fin(t,w("trial","leather")-0.2,0.5)*(1-fin(t,tDi-0.4,0.5)),{dy:0});
  tg("damp ground",BA_XM+92,D8_WB,BA_WATER,fin(t,tDamp-0.1,0.5)*(1-fin(t,tDays+0.4,0.5)),{dy:6});
  tg("the tunnel, dug up from the foot of the slope",1150,ba_yt(1150),[226,206,176],fin(t,tDig+0.6,0.5)*(1-fin(t,tAc-0.4,0.5)),{dy:60});
  tg("a return of 10 to 25%",1940,ba_ys(1940),TRUST,fin(t,w("repaid","ten to")-0.2,0.5)*(1-fin(t,B+0.3,0.5)),{dy:-130});
  tg("in crops and water sold",1940,ba_ys(1940),TRUST,fin(t,w("repaid","crops")-0.2,0.5)*(1-fin(t,B+0.3,0.5)),{dy:-74});
  ctx.restore();
  // how fast the hollow fills, day by day, and the line a trickle would reach; more than a trickle is real groundwater
  const tM=w("trickle","More than"),tA=fin(t,tDays-0.2,0.6)*(1-fin(t,tDig+0.2,0.6));
  arrive(ctx,1540,300,t,tDays-0.2,()=>d8_tally(ctx,1240,136,{a:tA,days,hi:pulseAt(t,tM,1.6)}),{dy:-14});
  arrive(ctx,1540,520,t,tM,()=>withA(ctx,1-fin(t,tDig+0.2,0.6),()=>{tag(ctx,1540,520,"more than a trickle: real groundwater",BA_WATER,{align:"center",size:28});}),{dy:8});
  // the question, and why it mattered: the builders would act on its answer; and when the answer comes, before the tunnel, in time
  const ov=1-fin(t,tRe-0.5,0.6);
  arrive(ctx,1450,176,t,w("act","how fast")-0.3,()=>withA(ctx,ov,()=>sticky(ctx,1450,176,620,150,"How fast does the water come?",{col:NOTEC[0],size:40,rot:-0.02})),{dy:-24,from:1.06});
  d8_when(ctx,1040,300,820,clamp((t-w("time","brought"))/1.8,0,1),{a:fin(t,w("act","It mattered")-0.3,0.6)*ov,hi:pulseAt(t,w("act","choosing")-0.1,1.6)});
  eaYear(ctx,90,90,"Iran · the 1960s",CLAY,fin(t,0.6,0.6)*(1-fin(t,tTr-0.4,0.5)));eaYear(ctx,90,170,"autumn",CLAY,fin(t,tSv,0.5)*(1-fin(t,tCo-0.4,0.5)));
  fadeIn(ctx,S,t);vign(ctx,S);
  baTitle(ctx,S,t,B+1.0,"Now the questions appear","decisions, questions and measures","Film 5 of 7");});

/* ---------- 2. The backlog, read again ---------- */
// The reporting team's backlog: forty-two requests, in seven columns of six, each column under the decision its live requests serve
// (chapter 4): whom to offer help and next year's tariffs (bills affordable); which lines to renew and which poles to inspect
// (assets); where to add capacity and how to connect solar faster (renewable power); and the regulator's own (an obligation).
// Each is [number, what it asks for, 1 if it serves that column's decision].
const D8_REQ=[
 [[26,"households falling behind",1],[6,"customer 360",0],[28,"customers on payment plans",1],[10,"all fields from billing",0],[31,"a weekly PDF nobody opens",0],[30,"disconnections for debt",1]],
 [[24,"the old KPI pack, again",0],[33,"bills by tariff",1],[29,"posts about outages",0],[35,"cost to serve, by customer type",1],[37,"energy bought, by hour",1],[34,"emails sent, by team",0]],
 [[2,"which lines fail most often?",1],[1,"a dashboard of every outage, refreshed every minute, for the lobby",0],[5,"faults by line, last ten years",1],[13,"website visits, live",0],[9,"age of every overhead line",1],[18,"a copy of the asset register",0]],
 [[8,"fleet fuel, 2019",0],[11,"poles not inspected in five years",1],[20,"training hours since 2018",0],[14,"vegetation near lines",1],[38,"every system's logins",0],[16,"pole failures by type",1]],
 [[17,"peak load by substation",1],[4,"a data lake",0],[19,"solar exported, by street",1],[27,"a dashboard like the other utility's",0],[22,"new homes planned, by suburb",1],[42,"an AI dashboard",0]],
 [[15,"every meter reading, as a spreadsheet",0],[21,"days to connect new solar",1],[36,"a report for a meeting in 2022",0],[23,"applications waiting, by step",1],[25,"incomplete applications",1],[32,"export of the CRM, all fields",0]],
 [[39,"interruptions by region, for the regulator",1],[3,"export every customer",0],[40,"complaints by month, for the regulator",1],[7,"outages as a heat map",0],[41,"connection times, for the regulator",1],[12,"the board pack, as a dashboard",0]]];
// a request's place in a grid of seven columns: [x, y] of its centre
const d8_cell=(c,r,x0,y0,cw,chh,gx,gy)=>[x0+c*(cw+gx)+cw/2,y0+r*(chh+gy)+chh/2];
const d8_urgent=n=>hash(n,875)<0.72;
scene("backlog",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const tPl=c("pile"),tT=c("test"),tMap=w("test","Now there's"),nt=ease(fin(t,tPl-0.4,0.8)),mv=ease(fin(t,tMap-0.5,1.1));
  person(ctx,"tomas",230,1030,0.78,{t,pose:(t>0.6&&t<c("note")+2.6)||(t>w("test","trial well")&&t<w("test","trial well")+2.4)?"explain":"stand",expr:t>tT-0.2&&t<tMap?"concerned":"calm"});
  // the note: which questions matter?
  arrive(ctx,960,360,t,0.3,()=>{ctx.save();ctx.translate(lerp(960,1560,nt),lerp(360,120,nt));ctx.scale(lerp(1,0.55,nt),lerp(1,0.55,nt));sticky(ctx,0,0,760,210,"Which questions matter?",{col:NOTEC[0],size:50,st:0,rot:-0.02});ctx.restore();},{dy:-30});
  // the backlog: a stack of cards, dealt into a grid; then, once there's a map, moved aside to be read against it
  const tDeal=w("pile","their backlog"),gs=lerp(1,0.62,mv),gx0=lerp(470,400,mv),gy0=lerp(240,300,mv),kinds={2:w("pile","reports"),1:w("pile","dashboards"),3:w("pile","extracts")},tUrg=w("pile","urgent");
  D8_REQ.forEach((col,ci)=>col.forEach(([n,s_],ri)=>{const k=ci*6+ri,t0=tDeal+k*0.045,u=ease(clamp((t-t0)/0.6,0,1));if(t<w("pile","handed")-0.2)return;
    const[gx,gy]=d8_cell(ci,ri,gx0,gy0,150*gs,84*gs,14*gs,14*gs),sx=1700+hash(k,880)*12,sy=520+(hash(k,881)-0.5)*14-k*1.2,x=lerp(sx,gx,u),y=lerp(sy,gy,u);
    const kt=kinds[n],big=kt?fin(t,kt-0.1,0.4)*(1-fin(t,tUrg-0.3,0.5)):0,sc_=gs*(1+1.6*big);if(big>0.01)return;
    d8_card(ctx,x,y,150*sc_,84*sc_,n,s_,{size:15*sc_,deco:1,a:fin(t,w("pile","handed")-0.2,0.4),urgent:d8_urgent(n)?fin(t,tUrg+(k%14)*0.03,0.15):0});}));
  // three of them, close enough to read: a report, a dashboard, an extract
  [[2,"which lines fail most often?","reports",560],[1,"a dashboard of every outage, refreshed every minute, for the lobby","dashboards",1040],[3,"export every customer","extracts",1520]].forEach(([n,s_,word,x])=>{const t0=w("pile",word),a=fin(t,t0-0.1,0.4)*(1-fin(t,tUrg-0.3,0.5));
    if(a>0.01)arrive(ctx,x,560,t,t0-0.1,()=>withA(ctx,a,()=>d8_card(ctx,x,560,420,180,n,s_,{size:30,rot:(hash(n,882)-0.5)*0.04,hi:0.5})),{dy:-14});});
  arrive(ctx,lerp(1037,618,mv),lerp(185,255,mv),t,w("pile","forty-two"),()=>tag(ctx,lerp(1037,618,mv),lerp(185,255,mv),"42 requests",[255,176,150],{align:"center",size:30}),{dy:8});
  // the map, and a trial well for every request, before anything is built: the well's sign on the card
  arrive(ctx,1500,380,t,tMap+0.3,()=>layerStack(ctx,1180,190,640,{p:clamp((t-tMap-0.3)/1.2,0,1),sh:54,gap:10,size:28}),{dy:-12});
  arrive(ctx,1500,720,t,w("test","trial well")-0.1,()=>{ruleCard(ctx,1150,640,700,"Who will decide what with the answer, and when?",{kicker:"a trial well for every request",col:TRUST,size:34,hi:pulseAt(t,w("test","who will"),2.4)});
    d8_wellIcon(ctx,1806,668,44);},{dy:-14});
  ctx.restore();
  eaYear(ctx,90,90,"day one",CLAY,fin(t,w("pile","day one")-0.2,0.5)*(1-fin(t,tT-0.3,0.5)));
  vign(ctx,S);});

/* ---------- 3. Up from a request ---------- */
// the rows of the map a request is traced up through, and where each sits
const D8_ROWS=[["goal",MOT,190],["capability",STR,375],["decision",BUS,560],["request",[255,214,170],760]];
scene("up",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const tF=c("first"),tC=c("climb"),tL=c("lobby"),top=w("climb","reaches the top");
  D8_ROWS.forEach(([n,col,y],i)=>withA(ctx,fin(t,0.2+i*0.12,0.5),()=>T(ctx,n,60,y+10,{f:"mono",w:600,size:28,color:rgba(col,0.85)})));
  // the first request, traced up: a decision, the capability it belongs to, and the goal it serves
  const x=640,t1=w("first","to decide")-0.2,t2=w("climb","maintaining assets")-0.2,t3=w("climb","replace assets")-0.2;
  arrive(ctx,x,760,t,tF+0.1,()=>d8_card(ctx,x,760,500,150,2,"which lines fail most often?",{size:30,rot:-0.012,hi:pulseAt(t,top,1.6)}),{dy:-14});
  d8_trace(ctx,[[x,684],[x,612]],clamp((t-w("first","need it"))/0.9,0,1),TRUST,{lw:3.5});
  arrive(ctx,x,560,t,t1,()=>d8_el(ctx,x-290,512,580,96,"renew which lines first",BUS,"decision",{size:30,gs:14,hi:pulseAt(t,t1+0.2,1.2)+pulseAt(t,top,1.6)}),{dy:-12});
  arrive(ctx,x-250,646,t,w("first","Grace's"),()=>d8_tagR(ctx,x-24,646,"Grace's planners · each spring",BUS),{dy:8});
  d8_trace(ctx,[[x,512],[x,422]],clamp((t-w("climb","belongs to"))/0.8,0,1),TRUST,{lw:3.5});
  arrive(ctx,x,375,t,t2,()=>d8_el(ctx,x-230,330,460,90,"maintain assets",STR,"capability",{size:30,gs:14,hi:pulseAt(t,t2+0.2,1.2)+pulseAt(t,top,1.6)}),{dy:-12});
  d8_trace(ctx,[[x,330],[x,240]],clamp((t-w("climb","serves a goal"))/0.8,0,1),TRUST,{lw:3.5});
  arrive(ctx,x,190,t,t3,()=>d8_el(ctx,x-320,140,640,100,"replace assets before they fail",MOT,"goal",{size:32,gs:15,hi:pulseAt(t,t3+0.2,1.2)+fin(t,top,0.6)*0.8}),{dy:-12});
  if(t>top)kt_gtick(ctx,x+340,140,20,fin(t,top,0.4));
  arrive(ctx,x,96,t,top,()=>tag(ctx,x,96,"the request reaches the top",TRUST,{align:"center",size:30}),{dy:8});
  // the next: a dashboard for the lobby, which finds no decision, and fades
  const X=1400,tW=w("live","who decides"),tN=w("live","No one"),tR=w("live","reaches nothing"),dead=fin(t,tR,0.8),tLv=w("live","never out of date");
  arrive(ctx,X,760,t,tL+0.1,()=>d8_card(ctx,X,760,560,170,1,"a dashboard of every outage, refreshed every minute, for the lobby",{size:30,rot:0.01,dead:dead*0.7}),{dy:-14});
  // it's never out of date: a clock beside it, its hand going round
  arrive(ctx,1446,640,t,tLv-0.1,()=>{d8_clock(ctx,1446,640,22,APL,1,t*4);tag(ctx,1484,640,"never out of date",APL,{size:28});},{dy:8});
  withA(ctx,1-dead*0.7,()=>d8_trace(ctx,[[X,674],[X,612]],clamp((t-tW)/0.7,0,1),mix(TRUST,D8_RED,fin(t,tN,0.5)),{lw:3.5,dash:t>tN?[8,8]:null}));
  arrive(ctx,X,560,t,tW+0.4,()=>d8_slot(ctx,X-290,512,580,96,BUS,1),{dy:-12});
  arrive(ctx,X,440,t,tW,()=>withA(ctx,1-fin(t,tR,0.4),()=>tag(ctx,X,440,"who decides what with it?",BUS,{align:"center",size:30})),{dy:8});
  arrive(ctx,X,440,t,tN,()=>withA(ctx,1-fin(t,tR,0.4),()=>T(ctx,"no one",X,500,{w:800,size:34,align:"center",color:rgba(D8_RED,1)})),{dy:8});
  arrive(ctx,X,330,t,tR,()=>tag(ctx,X,330,"it reaches nothing",D8_RED,{align:"center",size:30}),{dy:8});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Half of them ---------- */
// the goals at the top (and the regulator, whose decisions some reports serve), and the decisions in a row beneath, one over each
// column of requests: [name, x, width, kind]
const D8_GOALS=[["keep bills affordable",80,400,"goal"],["replace assets "+d8_nb("before they fail"),530,470,"goal"],["connect renewable power",1050,440,"goal"],["the regulator",1540,300,"stakeholder"]];
const D8_DEC=["whom to offer help","next year's tariffs","which lines to renew","which poles to inspect","where to add capacity","how to connect solar faster","targets and penalties"],D8_DG=[0,0,1,1,2,2,3];
const d8_dx=i=>192+i*256;
scene("half",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:500});
  const tAll=c("all"),tNo=c("none"),tBk=c("back"),reach=w("all","Twenty-one reach"),obl=w("all","obligation"),gone=w("back","goes back");
  D8_GOALS.forEach(([n,x,wd,kind],i)=>arrive(ctx,x+wd/2,148,t,0.2+i*0.1,()=>d8_el(ctx,x,104,wd,90,n,MOT,kind,{size:28,gs:12,hi:fin(t,reach+0.6+i*0.15,0.6)*0.5+(i===3?pulseAt(t,obl,1.6):0)}),{dy:-10}));
  D8_DEC.forEach((n,i)=>arrive(ctx,d8_dx(i),330,t,0.4+i*0.06,()=>d8_el(ctx,d8_dx(i)-115,296,230,70,n,BUS,"decision",{size:22,gs:10,deco:1,hi:fin(t,reach+0.3,0.5)*0.6+(i===6?pulseAt(t,obl,1.6):0)}),{dy:-10}));
  // from each decision to its goal, once requests reach it
  D8_DEC.forEach((n,i)=>{const g=D8_GOALS[D8_DG[i]],gx=g[1]+g[2]/2;d8_trace(ctx,[[d8_dx(i),296],[gx,194]],clamp((t-reach-0.3)/0.6,0,1),TRUST,{lw:2.5,a:0.8,nohead:1});});
  // all forty-two, traced: half reach their decision, half stop short and fade
  const fly=k=>{const r=hash(k,890);return clamp((t-gone-r*0.8)/0.9,0,1);};
  D8_REQ.forEach((col,ci)=>col.forEach(([n,s_,live],ri)=>{const[x,y]=d8_cell(ci,ri,77,470,230,56,26,14),k=ci*6+ri,t0=tAll+0.2+k*0.035,p=clamp((t-t0)/1.1,0,1),lx=x+(ri-2.5)*12;
    if(live)d8_trace(ctx,[[lx,y-28],[lx,410],[d8_dx(ci),366]],p,TRUST,{lw:2.2,a:0.85,nohead:p>0.98});
    else withA(ctx,1-fin(t,t0+1.2,0.6),()=>d8_trace(ctx,[[lx,y-28],[lx,y-28-(y-28-400)*0.7]],p,D8_RED,{lw:2,a:0.6,dash:[6,6]}));}));
  D8_REQ.forEach((col,ci)=>col.forEach(([n,s_,live],ri)=>{const[x,y]=d8_cell(ci,ri,77,470,230,56,26,14),k=ci*6+ri,dd=live?0:fin(t,tAll+1.4+k*0.035,0.5),f=live?0:fly(k),big=[36,13,3].includes(n)?fin(t,w("none",n===36?"needed once":n===13?"nobody acts":"nobody can")-0.3,0.4):0;
    if(f>=1||big>0.98)return;const ang=hash(k,891)*TAU,dx_=Math.cos(ang)*1300*ease(f),dy_=(500+Math.sin(ang)*300)*ease(f);
    d8_card(ctx,x+dx_,y+dy_,230,56,n,s_,{size:17,deco:1,dead:dd*0.8,hi:live?fin(t,tAll+1.4+k*0.035,0.5)*0.35:0,a:arrive_a(t,0.6+k*0.02)*(1-big),urgent:d8_urgent(n)?1:0,rot:(hash(n,870)-0.5)*0.03});}));
  // the three that stand for the rest, close enough to read, over the grid, dimmed; each goes back with one question
  const dim=fin(t,w("none","needed once")-0.4,0.5)*(1-fin(t,w("back","decide with")+0.3,0.8));if(dim>0.01){ctx.fillStyle="rgba(6,8,16,"+(0.62*dim)+")";ctx.fillRect(-100,436,2120,470);}
  [[36,"a report for a meeting in 2022","a report someone needed once","needed once",330],[13,"website visits, live","a dashboard nobody acts on","nobody acts",960],[3,"export every customer","an export nobody can explain","nobody can",1590]].forEach(([n,s_,lab,word,x],j)=>{
    const t0=w("none",word)-0.3,f=clamp((t-w("back","decide with")-0.4-j*0.15)/1.0,0,1),q=w("back","one question")+j*0.25;if(t<t0||f>=1)return;
    const y=690+ease(f)*500;withA(ctx,1-f,()=>{arrive(ctx,x,y,t,t0,()=>{d8_card(ctx,x,y,440,140,n,s_,{size:30,dead:0.35,rot:(hash(n,882)-0.5)*0.05});
      arrive(ctx,x+130,y+64,t,q,()=>sticky(ctx,x+130,y+64,300,110,"What would you decide with it?",{col:NOTEC[1],size:28,rot:0.05}),{dy:-20,from:1.1});},{dy:-14});
      arrive(ctx,x,560,t,t0+0.2,()=>withA(ctx,1-fin(t,q-0.2,0.4),()=>tag(ctx,x,560,lab,[255,176,150],{align:"center",size:28})),{dy:8});});});
  ctx.restore();
  arrive(ctx,560,252,t,reach,()=>tag(ctx,560,252,"21 reach a decision and a goal",TRUST,{align:"center",size:30}),{dy:8});
  arrive(ctx,1380,252,t,obl,()=>withA(ctx,1-fin(t,tNo-0.3,0.5),()=>tag(ctx,1380,252,"through an obligation: the regulator decides with them",MOT,{align:"center",size:28})),{dy:8});
  arrive(ctx,1380,252,t,tNo,()=>tag(ctx,1380,252,"21 reach nothing",D8_RED,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});
// how far an element has arrived, for something drawn without arrive(): it fades in over a third of a second
const arrive_a=(t,t0)=>fin(t,t0,0.35);

/* ---------- 5. Down from a goal ---------- */
// a goal implies decisions, a decision needs questions answered, a question needs a measure: the shape, then one path through it
const D8_TREE=[["goal",MOT,"goal",[[830,120,260,80]]],["decision",BUS,"decision",[[560,280,240,76],[1120,280,240,76]]],["question",INF,"question",[[420,440,220,76],[700,440,220,76],[1000,440,220,76],[1280,440,220,76]]],
  ["measure",INF,"measure",[[420,600,220,76],[700,600,220,76],[1000,600,220,76],[1280,600,220,76]]]];
scene("down",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const tB=c("better"),tMs=c("measure"),tMt=c("meet"),chk=w("meet","can be checked"),mv=ease(fin(t,tB-0.5,1.6)),meet=w("meet","meet at one");
  const X=760,gl=w("better","Take"),oc=w("better","a better network")-0.3,dc=w("measure","Its decision"),qu=w("measure","its question"),me=w("unit","The measure"),rq=w("measure","the planners asked");
  const rows=[w("way","the other way"),w("way","implies decisions"),w("way","needs questions"),w("way","needs a measure")],path=[gl,dc,qu,me];
  // Goal, Question, Metric (Basili and Weiss, 1984): the rows the method names light as the voice names them, while the decision row
  // waits, dimmed; then it lights in gold, the step the film adds. The method's name sits over the shape; it leaves, with the gold,
  // before the shape moves aside
  const gq=[w("gqm","Goal"),w("gqm","a decision added"),w("gqm","Question"),w("gqm","Metric")],gOut=1-fin(t,tB-0.9,0.5),gDim=fin(t,gq[0]-0.2,0.4)*(1-fin(t,gq[1]-0.1,0.4));
  // the shape, built from the top (the goal comes down from above the frame); then moved aside, small, where the example's path
  // through it lights up as the example is drawn beside it
  ctx.save();ctx.translate(lerp(0,-470,mv),lerp(70,160,mv));const sk=lerp(1,0.46,mv);ctx.translate(960,400);ctx.scale(sk,sk);ctx.translate(-960,-400);
  D8_TREE.forEach(([n,col,kind,boxes],r)=>boxes.forEach(([x,y,bw,bh],j)=>{const on=j===0?fin(t,path[r],0.5):0,lit=fin(t,gq[r]-0.1,0.4)*gOut,dim=r===1?gDim*gOut:0,
      o={size:28,gs:11,deco:mv>0.1?1:0,a:(1-0.35*mv*(1-on))*(1-0.55*dim),hi:Math.max(on,0.8*lit)};
    if(r===1&&lit>0.01)glow(ctx,x+bw/2,y+bh/2,bw*0.75,TRUST,0.3*lit);
    if(r>0){const t0=rows[r]-0.2+j*0.08,pb=D8_TREE[r-1][3][r===1?0:r===2?Math.floor(j/2):j],q=clamp((t-t0+0.3)/0.5,0,1);
      if(q>0)arrowTo(ctx,pb[0]+pb[2]/2,pb[1]+pb[3],x+bw/2,y,col,0.7+0.3*on,{p:q,lw:2.5,head:10});
      arrive(ctx,x+bw/2,y+bh/2,t,t0,()=>d8_el(ctx,x,y,bw,bh,n,col,kind,o),{dy:-10});return;}
    const u=clamp((t-rows[0])/1.4,0,1);if(u<=0)return;const yy=lerp(-230,y,1-Math.pow(1-u,3));
    if(u<1){const g=ctx.createLinearGradient(0,yy-300,0,yy);g.addColorStop(0,rgba(col,0));g.addColorStop(1,rgba(col,0.5*(1-u)));ctx.strokeStyle=g;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+bw/2,yy-300);ctx.lineTo(x+bw/2,yy);ctx.stroke();}
    withA(ctx,Math.min(1,u*2.5),()=>d8_el(ctx,x,yy,bw,bh,n,col,kind,o));}));
  if(gOut>0.01){arrive(ctx,960,55,t,gq[0]-0.3,()=>withA(ctx,gOut,()=>tag(ctx,960,55,"Goal–Question–Metric · 1980s",INK,{align:"center",size:32})),{dy:-8});
    arrive(ctx,1485,318,t,gq[1]-0.1,()=>withA(ctx,gOut,()=>tag(ctx,1390,318,"+ a decision",TRUST,{size:28})),{dy:8});}
  ctx.restore();
  // one goal, traced down: the outcome nobody could check; the decision, the question and the measure
  arrive(ctx,X+280,178,t,gl,()=>d8_el(ctx,X,130,560,96,"replace assets before they fail",MOT,"goal",{size:30,gs:14}),{dy:-12});
  const nw=fin(t,chk+1.2,0.8),stp=fin(t,w("better","nobody could")-0.2,0.3);
  d8_trace(ctx,[[X+562,178],[1368,178]],clamp((t-oc-0.1)/0.5,0,1),MOT,{lw:2.5});
  arrive(ctx,1590,178,t,oc,()=>{withA(ctx,1-nw,()=>d8_el(ctx,1370,130,440,96,"a better network",MOT,"outcome",{size:30,gs:14}));withA(ctx,nw,()=>d8_el(ctx,1370,130,440,96,"fewer interruptions "+d8_nb("per customer, each year"),MOT,"outcome",{size:28,gs:14,hi:pulseAt(t,chk+1.3,1.6)}));
    kt_rstamp(ctx,1590,272,"how would anyone check?",[200,60,60],stp*(1-nw),fin(t,w("better","nobody could"),0.35),{size:28});if(nw>0.01)kt_gtick(ctx,1834,122,20,nw);},{dy:-12});
  d8_trace(ctx,[[X+280,226],[X+280,320]],clamp((t-dc+0.4)/0.6,0,1),MOT,{lw:3.5});
  arrive(ctx,X+280,368,t,dc,()=>d8_el(ctx,X,320,560,96,"renew which lines first",BUS,"decision",{size:30,gs:14,hi:pulseAt(t,meet,1.4)+fin(t,meet,0.6)*(1-fin(t,B+2.6,0.8))*0.7}),{dy:-12});
  d8_trace(ctx,[[X+280,416],[X+280,500]],clamp((t-qu+0.3)/0.5,0,1),MOT,{lw:3.5});
  arrive(ctx,X+280,548,t,qu,()=>d8_el(ctx,X,500,560,96,"which lines fail most often?",INF,"question",{size:30,gs:14}),{dy:-12});
  d8_trace(ctx,[[X+280,596],[X+280,680]],clamp((t-me+0.3)/0.5,0,1),MOT,{lw:3.5});
  arrive(ctx,X+280,740,t,me,()=>d8_el(ctx,X,680,560,120,"interruptions per customer, "+d8_nb("per year")+", line by line",INF,"measure",{size:30,gs:14,v:0.45+0.08*Math.sin(t*0.9),hi:pulseAt(t,chk,1.6)}),{dy:-12});
  arrive(ctx,1560,800,t,w("unit","per year"),()=>tag(ctx,1360,800,"known as SAIFI",INF,{size:28}),{dy:8});
  // the planners' request, from the bottom, and the goal's line, from the top, meet at the decision
  arrive(ctx,1600,560,t,rq,()=>d8_card(ctx,1600,560,420,130,2,"which lines fail most often?",{size:30,rot:0.02,hi:pulseAt(t,meet,1.4)}),{dy:-14});
  d8_trace(ctx,[[1600,494],[1600,410],[X+562,380]],clamp((t-tMt-0.2)/1.0,0,1),TRUST,{lw:3.5});
  const lit=fin(t,meet,0.5)*(1-fin(t,B+2.6,0.8));if(lit>0.01){glow(ctx,X+280,368,180,TRUST,0.25*lit);glow(ctx,X+562,380,60,TRUST,0.6*lit);}
  arrive(ctx,X-300,368,t,meet,()=>d8_tagR(ctx,X-22,368,"from the top and from the bottom: one decision",TRUST),{dy:8});
  // the measure checks the goal: a light climbs the chain from the measure to the goal, and crosses to the outcome, which can now be checked
  const u=clamp((t-chk)/1.2,0,1);if(u>0&&u<1)glow(ctx,X+280,lerp(690,200,ease(u)),70,TRUST,0.8*Math.sin(Math.PI*u));
  const v=clamp((t-chk-1.0)/0.5,0,1);if(v>0&&v<1)glow(ctx,lerp(X+560,1370,v),178,50,TRUST,0.8*Math.sin(Math.PI*v));
  ctx.restore();vign(ctx,S);});

/* ---------- 6. A goal with no measure ---------- */
scene("missing",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const tAf=c("afford"),tBh=c("behind"),tFa=c("farah"),none=w("afford","but none"),dc=w("behind","Retail decides"),qu=w("behind","Its question"),reg=w("register","The hardship"),help=w("register","already getting");
  arrive(ctx,960,158,t,0.2,()=>d8_el(ctx,640,110,640,96,"keep bills affordable",MOT,"goal",{size:32,gs:15,hi:pulseAt(t,w("farah","A goal"),1.8)}),{dy:-12});
  // the measured half: the network charge
  const lA=w("afford","network charge")-0.2;d8_trace(ctx,[[700,206],[400,290]],clamp((t-lA)/0.5,0,1),MOT,{lw:3,nohead:1});
  arrive(ctx,400,345,t,lA+0.3,()=>d8_el(ctx,80,290,640,110,"network charge no higher "+d8_nb("in real terms in 2030"),MOT,"outcome",{size:30,gs:14}),{dy:-12});
  d8_trace(ctx,[[400,400],[400,462]],clamp((t-lA-0.6)/0.4,0,1),INF,{lw:3,nohead:1});
  arrive(ctx,400,510,t,lA+0.8,()=>{d8_el(ctx,80,462,640,96,"network charge, in real terms",INF,"measure",{size:30,gs:14,v:0.4});kt_gtick(ctx,720,462,18,1);},{dy:-12});
  arrive(ctx,400,612,t,lA+1.2,()=>tag(ctx,400,612,"measured",TRUST,{align:"center",size:28}),{dy:8});
  // the people who pay it: a decision, a question, and no measure
  d8_trace(ctx,[[1220,206],[1060,290]],clamp((t-none)/0.5,0,1),MOT,{lw:3,dash:[8,8],nohead:1});
  arrive(ctx,1060,250,t,none,()=>withA(ctx,1-fin(t,dc,0.4),()=>tag(ctx,1250,250,"the people who pay it",MOT,{size:28})),{dy:8});
  arrive(ctx,1060,350,t,dc,()=>{d8_el(ctx,780,290,560,120,"whom to offer help, "+d8_nb("before they fall too far behind"),BUS,"decision",{size:28,gs:13});},{dy:-12});
  arrive(ctx,1060,442,t,dc+0.5,()=>d8_owner(ctx,1060,442,"retail",1,{align:"center"}),{dy:8});
  d8_trace(ctx,[[1060,466],[1060,510]],clamp((t-qu)/0.4,0,1),INF,{lw:3,nohead:1});
  arrive(ctx,1060,558,t,qu,()=>d8_el(ctx,780,510,560,96,"how many are falling behind?",INF,"question",{size:30,gs:14}),{dy:-12});
  d8_trace(ctx,[[1060,606],[1060,650]],clamp((t-qu-0.8)/0.4,0,1),INF,{lw:3,dash:[8,8],nohead:1});
  const tG=w("farah","A goal");arrive(ctx,1060,695,t,qu+0.9,()=>{glow(ctx,1060,695,260,MOT,0.3*pulseAt(t,tG,1.8));d8_slot(ctx,780,650,560,90,INF,1,"no measure");},{dy:-10});
  arrive(ctx,1060,792,t,tG,()=>tag(ctx,1060,792,"a goal without a measure can't be steered",MOT,{align:"center",size:30}),{dy:8});
  // households, and the few the register counts
  const B_={},hl=[25,26,33],far=fin(t,qu+0.4,0.8);[3,9,14,18,22,25,26,30,33,37].forEach((i,k)=>{B_[i]=fin(t,qu+0.4+k*0.1,0.5);});
  arrive(ctx,1630,220,t,dc+0.6,()=>d8_homes(ctx,1420,110,8,5,54,{behind:B_,help:hl,ring:fin(t,help-0.3,0.6)}),{dy:-10});
  arrive(ctx,1630,420,t,qu+1.2,()=>tag(ctx,1630,420,"falling behind",[255,190,90],{align:"center",size:28}),{dy:8});
  arrive(ctx,1630,520,t,reg,()=>d8_el(ctx,1420,476,432,88,"Hardship register",APL,"component",{size:30,gs:13}),{dy:-12});
  arrive(ctx,1636,612,t,help-0.2,()=>tag(ctx,1636,612,"only those already getting help",APL,{align:"center",size:28}),{dy:8});
  // Farah, bottom left, has asked for the number for years
  arrive(ctx,170,820,t,tFa-0.3,()=>person(ctx,"farah",150,1030,0.6,{t,pose:t>tFa&&t<tFa+2.4?"explain":"stand",expr:"concerned"}),{dy:20,from:0.96});
  arrive(ctx,500,750,t,w("farah","asked for"),()=>{sticky(ctx,500,740,330,130,"How many are falling behind?",{col:NOTEC[1],size:28,rot:-0.03});["2024","2025","2026"].forEach((y_,k)=>withA(ctx,fin(t,w("farah","for years")+k*0.25,0.3),()=>T(ctx,y_,370+k*96,848,{f:"mono",w:500,size:28,color:rgba([255,200,214],0.95)})));},{dy:-20,from:1.06});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. What counts ---------- */
// one connection, in working days: the application comes in (0), is complete (10), approved (31), and the new meter fitted (34)
const D8_DX=d=>140+d*(1640/34),D8_AX=400;
scene("count",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const tTw=c("two"),tCl=c("clock"),tDf=c("define"),tSm=c("same"),r1=w("disagree","thirty-four"),r2=w("disagree","twenty-one"),same=fin(t,tSm+0.2,1.0);
  // the goal, and the measure it does have; the measure then moves up to the top left, and the goal gives way to the reports
  const up=ease(fin(t,w("disagree","Two reports")-0.8,1.0)),mx=lerp(960,490,up),my=lerp(510,148,up);
  withA(ctx,1-up,()=>{arrive(ctx,960,340,t,0.6,()=>d8_el(ctx,640,292,640,96,"connect renewable power",MOT,"goal",{size:32,gs:15}),{dy:-12});
    d8_trace(ctx,[[960,388],[960,462]],clamp((t-w("two","a measure"))/0.5,0,1),MOT,{lw:3,nohead:1});});
  arrive(ctx,mx,my,t,w("two","new solar")-0.3,()=>d8_el(ctx,mx-410,my-48,820,96,"new solar connected within 10 working days",MOT,"outcome",{size:30,gs:14}),{dy:-12});
  const n1=Math.round(lerp(34,24,ease(same))),n2=Math.round(lerp(21,24,ease(same)));
  arrive(ctx,1170,185,t,r1-0.3,()=>d8_report(ctx,960,80,420,210,"connections report",""+n1,APL,{tick:fin(t,tSm+1.2,0.4),hi:pulseAt(t,r1,1.2)}),{dy:-12});
  arrive(ctx,1650,185,t,r2-0.3,()=>d8_report(ctx,1440,80,420,210,"network report",""+n2,STR,{tick:fin(t,tSm+1.2,0.4),hi:pulseAt(t,r2,1.2)}),{dy:-12});
  // the timeline of one connection
  const ax=fin(t,w("disagree","Two reports")-0.2,0.8);if(ax>0)withA(ctx,ax,()=>{ctx.save();ctx.strokeStyle="rgba(220,230,255,0.6)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(D8_DX(0),D8_AX);ctx.lineTo(D8_DX(0)+(D8_DX(34)-D8_DX(0))*ease(ax),D8_AX);ctx.stroke();
    for(let d=0;d<=34;d++){const x=D8_DX(d),big=d%5===0;ctx.strokeStyle="rgba(220,230,255,"+(big?0.55:0.25)+")";ctx.lineWidth=big?2:1.2;ctx.beginPath();ctx.moveTo(x,D8_AX-(big?9:5));ctx.lineTo(x,D8_AX+(big?9:5));ctx.stroke();}ctx.restore();
    [[0,"application in",0],[10,"application complete",0],[31,"approved",1],[34,"new meter",0]].forEach(([d,s_,up_])=>{const x=D8_DX(d);ctx.fillStyle="rgba(240,244,255,0.95)";ctx.beginPath();ctx.arc(x,D8_AX,7,0,TAU);ctx.fill();
      T(ctx,s_,d===0?x-6:x,up_?D8_AX-24:D8_AX+44,{w:700,size:28,align:d===0?"left":"center",color:rgba(SOFT,1)});});});
  // where each report starts and stops its clock: the connections report above the line, the network report below; both give way
  // to the measure once it is defined
  const tFr=w("define","complete application"),p1=clamp((t-r1+0.2)/0.9,0,1),p2=clamp((t-r2+0.2)/0.9,0,1),gone=fin(t,tFr-0.4,0.6);
  withA(ctx,1-gone,()=>{d8_span(ctx,D8_DX(0),D8_DX(34),D8_AX-70,1,APL,p1,"34 days",1);d8_span(ctx,D8_DX(10),D8_DX(31),D8_AX+80,-1,STR,p2,"21 days",1);});
  const ck=fin(t,tCl+0.2,0.4)*(1-gone);[[0,APL,D8_AX-70],[34,APL,D8_AX-70],[10,STR,D8_AX+80],[31,STR,D8_AX+80]].forEach(([d,col,y],k)=>d8_clock(ctx,D8_DX(d),y,17,col,ck*(0.6+0.4*pulseAt(t,w("clock","start")+k*0.25,0.8)),t));
  arrive(ctx,700,570,t,w("clock","Both are right"),()=>withA(ctx,1-fin(t,tDf-0.3,0.4),()=>tag(ctx,700,570,"both are right",TRUST,{align:"center",size:30})),{dy:8});
  arrive(ctx,1260,570,t,w("clock","Neither"),()=>withA(ctx,1-fin(t,tDf-0.3,0.4),()=>tag(ctx,1260,570,"neither is the measure",D8_RED,{align:"center",size:30})),{dy:8});
  // the definition, written down: from a complete application to the new meter, in working days
  const rows=[["from","a complete application",44,"complete application"],["to","the new meter",44,"new meter"],["counts","Monday to Friday, not public holidays",44,"Monday"],["owner","Grace",44,"Grace writes"]];
  const rt=rows.map(([,,,word])=>w("define",word)),p=rt.reduce((a,x)=>a+clamp((t-x)/0.4,0,1),0)/rt.length;
  arrive(ctx,940,700,t,tDf,()=>d8_def(ctx,560,540,760,"working days to connect new solar",rows.map(r=>[r[0],r[1],r[2]]),{p,hi:pulseAt(t,tSm,1.6)}),{dy:-16});
  const pd=clamp((t-tFr)/0.9,0,1);d8_span(ctx,D8_DX(10),D8_DX(34),D8_AX-70,1,TRUST,pd,same>0.5?"24 days, in both":"the measure",fin(t,tFr-0.2,0.4));
  // the questions Why it moves left open, each answered beside the line that answers it
  [["connected, from when?",688,"complete application"],["what counts as a working day?",776,"Monday"]].forEach(([s_,y,word])=>arrive(ctx,1600,y,t,tDf+0.3,()=>{tag(ctx,1374,y,s_,INF,{size:28});const a=fin(t,w("define",word)+0.4,0.4);if(a>0)kt_gtick(ctx,1352,y,15,a);},{dy:8}));
  arrive(ctx,170,820,t,tDf-0.6,()=>person(ctx,"grace",150,1030,0.7,{t,pose:t>tDf&&t<tDf+3?"explain":"stand"}),{dy:20,from:0.96});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. A home and an owner ---------- */
// the capability map, as in Today, and where it's going (a no-break space keeps "the network" on one line in its box)
const D8_CAPS=["plan the network","operate the network","maintain assets","connect customers","generate power","sell energy","serve customers","meet obligations"],d8_cx=i=>177+i*224;
// each measure, its capability, where it hangs, and its owner
const D8_HOME=[["interruptions per customer, "+d8_nb("per year"),2,370,"Grace","Interruptions"],["working days to connect "+d8_nb("new solar"),3,960,"Grace","Days to connect"],["households falling behind",6,1550,"head of retail","Households"]];
scene("home",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const tO=c("owner"),acts=w("means","acts when");
  D8_CAPS.forEach((n,i)=>{const hm=D8_HOME.find(h=>h[1]===i),hi=hm?fin(t,w("homes",hm[4])-0.1,0.5):0;arrive(ctx,d8_cx(i),320,t,0.2+i*0.06,()=>archEl(ctx,d8_cx(i)-104,270,208,100,n,STR,"capability",{size:28,gs:11,hi:hi*0.8,a:1-0.45*(1-hi)*fin(t,w("homes","Interruptions")-0.4,0.6)}),{dy:-12});});
  // each measure hangs under the capability whose work it measures, with that capability's owner
  D8_HOME.forEach(([n,ci,x,own,word],k)=>{const t0=w("homes",word)-0.1,u=ease(clamp((t-t0)/1.0,0,1)),y=lerp(810,580,u),mv=pulseAt(t,acts+k*0.3,1.4);
    if(u>0)d8_trace(ctx,[[d8_cx(ci),370],[d8_cx(ci),440],[x,440],[x,y-62]],clamp((t-t0-0.6)/0.6,0,1),INF,{lw:2.5,nohead:1});
    arrive(ctx,x,y,t,t0,()=>{sticky(ctx,x,y,500,124,n,{col:NOTEC[0],size:30,rot:(k-1)*0.012,st:0.5});d8_glyph(ctx,"measure",x-226,y-40,12,[120,80,40],0.5+0.25*Math.sin(t*0.8+k)+0.3*mv);},{dy:-16});
    arrive(ctx,x,y+108,t,w("owner",k<2?"Grace":"head of retail")+(k===1?0.3:0),()=>d8_owner(ctx,x,y+108,own,1,{align:"center",hi:mv}),{dy:8});});
  ctx.restore();
  arrive(ctx,960,190,t,w("home","home on the map"),()=>withA(ctx,1-fin(t,tO-0.3,0.4),()=>tag(ctx,960,190,"a home: the capability whose work it measures",INF,{align:"center",size:28})),{dy:8});
  arrive(ctx,960,800,t,w("means","An owner"),()=>tag(ctx,960,800,"an owner says what the number means, and acts when it moves",TRUST,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 9. By capability, not by request ---------- */
// the twenty-one live requests, and the four data products they need: [name, the capabilities it serves, x, y, its side (0 the
// network, 1 retail), its owner, the request columns it answers]
const D8_LIVE=[];D8_REQ.forEach((col,ci)=>col.forEach(([n,s_,live],ri)=>{if(live)D8_LIVE.push({n,s:s_,ci});}));
const D8_PROD=[["assets and faults","maintain assets · operate the network",100,250,0,"Grace"],["connections","connect customers",100,450,0,"Grace"],["load and capacity","plan the network",100,650,0,"Grace"],["accounts and bills","sell energy · serve customers",1110,450,1,"head of retail"]];
// which product answers each live request: by the decision its column serves (the regulator's three go where their data lives)
const d8_prodOf=r=>r.ci<=1?3:r.ci<=3?0:r.ci===4?2:r.ci===5?1:r.n===39?0:r.n===40?3:1;
function d8_product(ctx,x,y,w,h,name,caps,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,INF,{glow:14+14*(o.hi||0),ea:0.85,fill:"rgba(12,10,14,0.95)"});ctx.fillStyle=rgba(INF,0.12+0.1*(o.hi||0));rr(ctx,x,y,w,h,18);ctx.fill();
  ctx.fillStyle=rgba(col,0.9);rr(ctx,x,y+14,6,h-28,3);ctx.fill();d8_glyph(ctx,"product",x+w-34,y+34,15,INF);T(ctx,name,x+28,y+48,{w:800,size:34,color:rgba(INK,0.97)});T(ctx,caps,x+28,y+h-24,{w:700,size:28,color:rgba(STR,0.95)});});}
scene("build",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tR=c("reports"),tG=c("group"),tE=c("each"),dom=w("group","the domain"),four=w("group","four data products"),sd=fin(t,dom-0.2,0.8);
  d8_sides(ctx,{a:sd});
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  d8_wall(ctx,{p:clamp((t-dom+0.2)/1.0,0,1),hi:pulseAt(t,w("each","own side"),1.6)});
  // twenty-one requests become twenty-one reports, each kept by someone else; then each flies to the product that answers it
  const fl=ease(clamp((t-four+0.4)/1.4,0,1)),cnt=[0,0,0,0];
  D8_LIVE.forEach((r,k)=>{const cx=180+(k%7)*260,cy=280+Math.floor(k/7)*190,pi=d8_prodOf(r),P=D8_PROD[pi],j=cnt[pi]++,tx=P[2]+80+j*36,ty=P[3]+56,x=lerp(cx,tx,fl),y=lerp(cy,ty,fl),sz=lerp(1,0.18,fl),becomes=fin(t,w("reports","could become")+k*0.04,0.4);
    if(fl>=1)return;withA(ctx,1-sstep(0.75,1,fl),()=>{ctx.save();ctx.translate(x,y);ctx.scale(sz,sz);withA(ctx,1-becomes,()=>d8_card(ctx,0,0,220,110,r.n,r.s,{size:20,deco:1,a:fin(t,0.2+k*0.03,0.4),rot:0}));
      d8_dash(ctx,-110,-60,220,120,k,becomes,{keeper:[[255,150,150],[150,220,255],[255,214,120],[170,240,170],[220,170,255],[255,180,110],[140,230,220]][k%7]});ctx.restore();});});
  arrive(ctx,960,180,t,w("reports","twenty-one reports"),()=>withA(ctx,1-fin(t,dom-0.4,0.4),()=>tag(ctx,960,180,"21 reports, each kept by someone different",[255,176,150],{align:"center",size:30})),{dy:8});
  // four data products: three on the network's side of the wall, one on retail's
  D8_PROD.forEach(([n,caps,x,y,side,own],i)=>{const t0=four+0.2+i*0.25;arrive(ctx,x+330,y+60,t,t0,()=>{d8_product(ctx,x,y,660,120,n,caps,side?D8_RET:D8_NET,{hi:pulseAt(t,t0+1.0,1.0)});},{dy:-12});
    arrive(ctx,x+330,y+150,t,w("each","one owner")+i*0.12,()=>d8_owner(ctx,x+330,y+150,own,1,{align:"center"}),{dy:8});
    // each answers many questions: they fan out from it, on its own side
    for(let q=0;q<5;q++){const a=fin(t,w("each","many questions")+i*0.1+q*0.08,0.4);if(a<=0.01)continue;const qx=side?1800:850,qy=y+10+q*25;ctx.save();ctx.strokeStyle=rgba(INF,0.5*a);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+660,y+60);ctx.lineTo(qx-22,qy);ctx.stroke();ctx.restore();
      withA(ctx,a,()=>{glass(ctx,qx-18,qy-14,36,28,14,INF,{glow:6,ea:0.8,fill:"rgba(16,10,8,0.95)"});d8_glyph(ctx,"question",qx,qy-1,8,INF);});}});
  ctx.restore();
  arrive(ctx,960,128,t,four,()=>tag(ctx,960,128,"scoped by capability and domain, not by request",PARCH,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 10. Back at the trial well ---------- */
// The slope again, as it was during the trial: the well, the hollow at its foot with the water gathering, the bucket coming up with
// water, the builders beside it, and the tunnel not yet dug, dashed, down the slope. On the left, over the mountains, a dark panel,
// and on it the builders' question traced as the film traces a request, from the top: the goal, the decision (who decides, and when),
// the question and the measure; then the answer climbs from the measure to the goal, and reaches the builders before the tunnel.
// The rows: [kind, colour, name, y, height]
const D8_KC=[["goal",MOT,"water for the fields, all year",150,88],["decision",BUS,"dig the tunnel here, or not",290,124],["question",INF,"how fast does the water come?",470,88],["measure",INF,"how fast the hollow fills, "+d8_nb("day by day"),614,88]];
scene("well",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tG=c("goal"),tM=c("measure"),tR=c("reach"),tDec=w("goal","A decision"),tBy=w("goal","by the builders");
  // the camera: close on the well, where the opening's trial was; then back, the well on the right of the frame, the mountains on the left
  setScreen(ctx,S);ctx.save();focus(ctx,t,[[0,262,560,2.1],[1.4,30,600,1.3]],2.2);
  ba_secSky(ctx,{warm:0.45,dusk:0.15});
  // the bucket comes up with water every few seconds, and the hollow keeps filling
  const p=d8_wind(t,0.6,D8_DAY),water=((t-0.6)%D8_DAY)>D8_DAY*0.5&&t>0.6?1:0;
  d8_ground(ctx,t,{shaft:1,cav:1,lvl:0.62+0.1*clamp(t/sc.dur,0,1),ghost:0.75,wet:0.85,hiW:pulseAt(t,w("back","trial well")-0.1,1.6)});
  ba_village(ctx,t,{wet:[0.12,0.12,0.12,0.12]});
  // the builders lit as the decision is named theirs
  if(t>tBy-0.4)D8_BLD.forEach(([x])=>glow(ctx,x,ba_ys(x)-22,40,TRUST,0.45*pulseAt(t,tBy,2.0)));
  d8_atWell(ctx,t,{at:1,p,foot:D8_WB+4,water,out:1,bld:[1,1]});
  ctx.restore();
  // the panel, over the mountains, and on it the chain, from the goal down to the measure, as the narration names them
  withA(ctx,fin(t,tG-0.5,0.6),()=>glass(ctx,30,92,800,792,26,[220,230,255],{glow:10,ea:0.5,fill:"rgba(8,12,24,0.93)"}));
  const X0=230,BW=560,XC=X0+BW/2,T_=[tG+0.1,tDec-0.1,tM+0.1,w("measure","And a measure")-0.1],tUp=w("reach","reached")-0.6,met=fin(t,tUp+1.0,0.4);
  D8_KC.forEach(([kind,col,name,y,h],r)=>{const t0=T_[r],hi=pulseAt(t,t0+0.2,1.2)+(r===0?pulseAt(t,tUp+1.0,1.6):0)+(r===1?pulseAt(t,tBy,1.6):0);
    withA(ctx,fin(t,t0,0.4),()=>T(ctx,kind,60,y+h/2+10,{f:"mono",w:600,size:28,color:rgba(col,0.85)}));
    arrive(ctx,XC,y+h/2,t,t0,()=>{if(kind!=="decision")return d8_el(ctx,X0,y,BW,h,name,col,kind,{size:r===0?30:28,gs:14,hi});
      d8_el(ctx,X0,y,BW,h,"",col,kind,{gs:14,hi});T(ctx,name,XC,y+50,{w:700,size:30,align:"center",color:rgba(INK,0.96)});
      withA(ctx,fin(t,tBy-0.2,0.5),()=>T(ctx,"the builders · before they pay",XC,y+98,{w:700,size:28,align:"center",color:rgba(BUS,1)}));},{dy:-12});});
  [[238,290,T_[1]],[414,470,T_[2]],[558,614,T_[3]]].forEach(([y0,y1,t0])=>d8_trace(ctx,[[XC,y0],[XC,y1]],clamp((t-t0+0.3)/0.5,0,1),[220,230,255],{lw:3,a:0.6,nohead:1}));
  // the measure's line to the hollow it's read from
  const lk=fin(t,T_[3]+0.4,0.6);if(lk>0.01)withA(ctx,lk,()=>{ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(BA_WATER,0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(X0+BW,658);ctx.lineTo(1212,614);ctx.stroke();ctx.restore();});
  // the answer, in time, climbs the chain to the goal, and the goal is met
  const u_=clamp((t-tUp)/1.0,0,1);if(u_>0&&u_<1)glow(ctx,XC,lerp(658,194,ease(u_)),70,TRUST,0.8*Math.sin(Math.PI*u_));
  if(met>0)kt_gtick(ctx,X0+BW+20,150,20,met);
  arrive(ctx,XC,830,t,w("reach","in time")-0.2,()=>tag(ctx,XC,830,"in time: before the tunnel",TRUST,{align:"center",size:30}),{dy:8});
  eaYear(ctx,880,90,"Iran · the 1960s",CLAY,fin(t,0.8,0.6));
  vign(ctx,S);});

/* ---------- 11. Questions that matter ---------- */
const D8_Q="Which questions matter?",D8_A=["The ones someone will act on, in time:","traced to a goal,","with a measure and an owner."].map(d8_nb).join(" ");
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const g1=fin(t,w("confirm","Grace")+0.3,0.8),g2=fin(t,w("confirm","definitions"),0.8),dr=fin(t,w("confirm","head of retail"),0.5),cA=c("answer"),dn=pulseAt(t,B+0.2,1.6);
  [["interruptions per customer, per year",220,g1],["working days to connect new solar",420,g2]].forEach(([s_,y,g],k)=>{arrive(ctx,430,y,t,0.3+k*0.2,()=>{sticky(ctx,430,y,640,110,s_,{col:NOTEC[0],edge:INF,glass:g,size:30,rot:0});d8_glyph(ctx,"measure",136,y-28,12,g>0.5?INF:[120,80,40],0.5);},{dy:-14});
    if(g>0)withA(ctx,g,()=>{kt_gtick(ctx,130,y+86,18,1);T(ctx,"confirmed · Grace",160,y+96,{w:700,size:28,color:rgba(TRUST,1)});});});
  arrive(ctx,430,620,t,0.7,()=>sticky(ctx,430,620,640,110,"households falling behind",{col:NOTEC[0],size:30,rot:0.012,st:0.5}),{dy:-14});
  if(dr>0)withA(ctx,dr,()=>tag(ctx,430,730,"to the head of retail, as a draft",INF,{align:"center",size:28}));
  if(dn>0)[220,420,620].forEach(y=>glow(ctx,430,y,240,BAC,0.18*dn));
  person(ctx,"grace",1020,1030,0.74,{t,pose:t>w("confirm","Grace")&&t<w("confirm","Grace")+2.2?"explain":"stand"});
  d8_personR(ctx,"tomas",1820,1030,0.78,{t,pose:t>cA&&t<cA+2.4?"explain":"stand"});
  arrive(ctx,1560,140,t,0.4,()=>sticky(ctx,1560,140,500,120,D8_Q,{col:NOTEC[0],size:32,st:fin(t,cA+1.6,0.5)*0.5,rot:-0.03}),{dy:-20});
  arrive(ctx,1570,420,t,cA,()=>sticky(ctx,1570,420,580,270,D8_A,{col:NOTEC[0],size:30,p:clamp((t-cA-0.2)/3.2,0,1),rot:0.015}),{dy:-30,from:1.06});
  arrive(ctx,1500,730,t,w("next","Next"),()=>sticky(ctx,1500,730,420,130,"Where does each rule belong?",{col:NOTEC[0],size:32,st:0,rot:0.03}),{dy:-30,from:1.06});
  ctx.restore();vign(ctx,S);
  baEnd(ctx,S,t,B+0.8,"Now the questions appear","A question matters when someone will act on its answer, "+d8_nb("in time."),"Film 5 of 7");});

// where the chapters meet (From words to data's joins.js; twice.py, 18 November 2026): half the answer and what to build are later
// pictures on the same screen whose words came in over the same words in the chapter before ("replace assets before they fail",
// "households falling behind"), so what was there leaves first, over the bare screen
const CHAPTER_JOINS={leave:["half","build"],bare:(ctx,S,t)=>{setScreen(ctx,S);bg2(ctx);motes(ctx,t);vign(ctx,S);}};
