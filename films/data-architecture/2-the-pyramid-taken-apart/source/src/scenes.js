/* ===== The pyramid, taken apart: scenes =====
   Eight chapters, as in ../script.md. Chile in 1972, in lamp-light: the factories the state ran, linked to Santiago, their numbers
   coming in by telex every afternoon; one number that says nothing alone; the wall of figures where a factory in trouble is lost;
   Cyberstride's normal for each factory and the warning that was to go first to its manager; the first results and Beer's telex.
   Then the utility's wall: Grace's measure; the famous pyramid of data, information, knowledge and wisdom, where it came from and
   what it gets right; the pyramid as a factory, the definition written before anything is recorded, and the outage system's records;
   a meter's readings and what someone chose for them; the levels that aren't separate and the top that's vague; Inés's redrawing,
   with arrows both ways, on the data practice on the map; and back to Chile, and to the measure that renews the lines that fail most.
   One room for the utility: the wall. The pyramid has its place on it (P), and the camera glides from it to each chapter's place and
   back: what the pyramid gets right to its right (R), the definition and the records under it (F), the meter's readings under R (W).
   Whatever the camera passes is drawn as it was left there. Chile is lamp-light: one long table of pictures the camera glides along,
   dissolving into the wall and back because the whole picture changes. Made to read on a phone (tools/legible.py): text is at least
   28 px in the frame. Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two
   in step. */

// the camera on the wall: keys are [time, x, y, zoom]; every move eases over 1.7 s
function d2_cam(ctx,S,t,keys){setScreen(ctx,S);return focus(ctx,t,keys,1.7);}
// the places on the wall: P at the origin, R to its right, F under P, W under R
const D2_X2=1920,D2_Y1=1110,D2_MY=D2_Y1+40;
// where the people stand, their feet on the bottom edge of the place they stand at: Grace and Inés at R in chapter 3; from chapter 7,
// Inés at P and Grace at F
const D2_GR3=[D2_X2+1480,1010],D2_IN3=[D2_X2+1780,1010],D2_IN7=[1780,1010],D2_GR7=[1720,D2_Y1+1010];

/* ---------- 1. Only what changed ---------- */
// Chile's long table of pictures, left to right, each 1920 px wide: the map and the telex (A), one number (B), the wall of figures
// (C), the software's normal and its warning (D), the first results (E)
const D2_B=1920,D2_C=3840,D2_D=5760,D2_E=7680;
// a day's cloth at one mill, day by day: the last day well under its normal
const D2_DAYS=[0.52,0.46,0.58,0.5,0.43,0.55,0.61,0.48,0.53,0.45,0.57,0.5,0.54,0.14];
// where the warning sits: beside the software's chart, then with the factory's manager
const D2_W0=[1140,230],D2_W1=[1140,500];
// the warnings the people in charge would see, each beside its factory's normal
const D2_WARNS=["textile mill: cloth woven","cement works: tonnes made","foundry: workers absent"];
// the utility's measure on the wall, where Grace reads it every month, and the systems it seems to come from
const D2_SYS=[["outage system",640],["meter data",960],["customer service",1280]];
function d2_measure(ctx,t,o){const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  // the systems, under it, with dashed lines up into it
  D2_SYS.forEach(([s,x],i)=>{const q=o.sys?o.sys(i):0;if(q<=0.01)return;const w=tw(ctx,s,28,700)+56,dim=1-0.6*(o.dim||0);withA(ctx,q*dim,()=>{
    ctx.save();ctx.strokeStyle=rgba(APPC,0.7);ctx.setLineDash([6,8]);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x,640);ctx.lineTo(lerp(x,960,0.5),372);ctx.stroke();ctx.restore();
    glass(ctx,x-w/2,640,w,70,14,APPC,{glow:8,ea:0.7,fill:"rgba(7,12,24,0.92)"});T(ctx,s,x,686,{w:700,size:28,align:"center",color:rgba(mix(APPC,INK,0.35),1)});});});
  d2_dial(ctx,560,200,800,"interruptions per customer, per year","1.4",o.dial,{h:170,hi:o.dialHi});
  withA(ctx,o.month||0,()=>tag(ctx,1400,285,"every month",BIZ,{size:30}));
  // the question under it: what counts as one
  d2_pin(ctx,700,450,520,150,o.sheet||0,-0.01,()=>pencilText(ctx,"what counts as an interruption?",960,540,{size:30,w:700,align:"center",p:o.write==null?1:o.write}));});}
scene("changed",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tG=c("grace"),toU=fin(t,tG-0.6,1.2);
  // Chile, in lamp-light
  if(toU<0.99){ctx.save();ctx.globalAlpha=1-toU;d2_night(ctx,S,t);setScreen(ctx,S);
    const tT=c("telex"),tAl=c("alone"),tCl=c("cloth"),tL=c("lost"),tN=c("needed"),tNo=c("normal"),tP=c("passed"),tF=c("first"),tU=c("up"),tW=c("works"),tBe=c("beer"),tH=c("handful");
    focus(ctx,t,[[0,960,540,1.0],[1.6,940,520,1.03],[tT-0.4,1160,520,1.03],[tAl-0.6,D2_B+960,520,1.0],[tL-0.5,D2_C+960,520,1.0],[tN+0.4,D2_C+990,510,1.06],
      [tNo-0.5,D2_D+960,540,1.0],[tF-0.2,D2_D+1000,560,1.02],[tU+0.6,D2_D+940,540,1.0],[tW-0.6,D2_E+960,520,1.0],[tH-0.3,D2_E+1000,540,1.02]],1.7);
    // A: the factories the state ran, the telex lines that linked them to Santiago, the project's name; the telex, every afternoon
    const tFa=w("year","factories"),tLi=w("year","linking"),tCy=w("year","Cybersyn");
    daChile(ctx,560,60,960,{dots:fin(t,tFa-0.3,1.6),lines:fin(t,tLi+0.2,2.4),pulse:i=>t>tT?((t-tT)*0.3+hash(i,5))%1:0,city:fin(t,0.8,1.0),label:"left"});
    d2_card(ctx,760,400,0,"Cybersyn","the state's factories, linked to Santiago",fin(t,tCy-0.2,0.7),{size:40});
    const pp=0.3+0.68*clamp((t-tT+0.2)/3.2,0,1);daTelex(ctx,1600,1000,1.1,{paper:pp,typing:t>tT&&t<tT+3.4?1:null,t,a:fin(t,tT-0.7,0.8)});
    withA(ctx,fin(t,w("telex","afternoon")-0.4,0.6),()=>tag(ctx,1600,1000-(342+pp*230)*1.1-52,"every afternoon",CY_LAMP,{align:"center",size:30}));
    // B: one number, alone: today's cloth at one mill; whether that's a good day depends on the mill
    const X=D2_B,tDp=w("cloth","depended");
    d2_strip(ctx,X+560,200,800,"CLOTH WOVEN   4,180 M",fin(t,tAl-0.3,0.7),{size:40,h:110});
    withA(ctx,fin(t,tCl+0.2,0.6),()=>tag(ctx,X+960,380,"a good day, or a bad one?",CY_LAMP,{align:"center",size:32}));
    d2_usual(ctx,X+560,720,"usual here: 3,900 m",true,fin(t,tDp-0.2,0.7),fin(t,tDp+0.9,0.5));
    d2_usual(ctx,X+1360,720,"usual here: 5,200 m",false,fin(t,tDp+0.1,0.7),fin(t,tDp+1.2,0.5));
    // C: the wall of figures in Santiago, every factory's strip for the afternoon, and the people in charge before it; one factory in
    // trouble looks like all the rest, until it's picked out
    const tNt=w("needed","needed them"),tOn=w("needed","only those");
    ctx.save();ctx.translate(D2_C,0);d2_wall(ctx,1,{p:clamp((t-tL+0.4)/3.2,0,1),find:fin(t,tNt-0.3,0.6),dim:fin(t,tOn-0.2,0.8)});
    const pcA=fin(t,tL+1.4,0.9);daSil(ctx,300,1092,360,{a:pcA});daSil(ctx,1640,1096,350,{a:pcA,dir:-1,wide:1.1});
    withA(ctx,fin(t,tNt+0.2,0.6),()=>tag(ctx,990,760,"the factory that needs them",CY_SIG,{align:"center",size:30}));ctx.restore();
    // D: the software, Cyberstride: each factory's own normal, worked out from its history; a day out of it, passed on as a warning,
    // first to the factory's manager, with time to put it right; only if it stayed wrong, on to Santiago
    ctx.save();ctx.translate(D2_D,0);const tHi=w("normal","history"),tNm=w("normal","normal for"),tCo=w("passed","compared"),tPo=w("passed","passed on"),tTm=w("first","time"),tSa=w("up","Santiago");
    d2_card(ctx,120,70,0,"Cyberstride","the project's software",fin(t,tNo+0.3,0.7));
    d2_ind(ctx,120,230,960,440,D2_DAYS,{p:clamp((t-tHi+0.2)/2.4,0,1)*13/14+fin(t,tCo+0.4,0.4)/14,band:fin(t,tNm-0.2,0.8),lit:fin(t,tCo+0.8,0.5),title:"cloth woven, day by day",a:fin(t,tHi-0.6,0.7)});
    const mv=ease(clamp((t-tF-0.3)/1.1,0,1)),wx=lerp(D2_W0[0],D2_W1[0],mv),wy=lerp(D2_W0[1],D2_W1[1],mv);
    if(t>tPo-0.1)arrive(ctx,wx+350,wy+75,t,tPo-0.1,()=>d2_warn(ctx,wx,wy,700,"textile mill: cloth woven",1,{low:true,hi:pulseAt(t,tPo+0.2,1.2)}),{d:0.8,dy:24});
    daFactory(ctx,1290,960,0.55,{lit:0.85,t,a:fin(t,tF-0.2,0.8)});daSil(ctx,1700,1004,300,{a:fin(t,tF+0.1,0.8),dir:-1});
    d2_clock(ctx,1520,780,52,clamp((t-tTm-0.2)/4.6,0,1),fin(t,tTm-0.4,0.6));
    d2_card(ctx,560,740,0,"Santiago","the people in charge",fin(t,tSa-0.5,0.6));
    withA(ctx,fin(t,tSa-0.3,0.4),()=>arrowTo(ctx,1180,654,940,792,CY_LAMP,0.85,{p:clamp((t-tSa+0.3)/1.0,0,1),dash:[10,9],lw:2.6,bend:0.12}));
    ctx.restore();
    // E: the first results, printed; Beer's telex; and what the people in charge would see: a few warnings, each beside its normal
    ctx.save();ctx.translate(D2_E,0);const tTx=w("beer","telexed"),tFw=w("handful","a few warnings"),tNb=w("handful","normal");
    d2_printout(ctx,120,110,600,660,clamp((t-c("works")-0.3)/3.6,0,1),fin(t,c("works"),0.5)*(1-0.55*fin(t,tFw-0.8,0.8)));
    withA(ctx,fin(t,c("works")+0.6,0.6),()=>tag(ctx,420,820,"21 March 1972",CY_LAMP,{align:"center",size:30}));
    d2_strip(ctx,760,120,980,"CYBERSTRIDE SUITE REALLY WORKS",fin(t,tTx-0.2,0.7),{size:36,h:100,rot:0.008});
    withA(ctx,fin(t,tTx+0.7,0.6),()=>T(ctx,"Stafford Beer, by telex",790,288,{w:700,size:30,color:rgba(INK,0.9)}));
    daSil(ctx,1720,1012,380,{a:fin(t,c("beer")-0.2,0.9),dir:-1,wide:1.18,beard:1});
    D2_WARNS.forEach((s,i)=>{const t0=tFw-0.2+i*0.35;if(t>t0)arrive(ctx,1110,330+i*160+75,t,t0,()=>d2_warn(ctx,760,330+i*160,700,s,1,{low:i!==2,nhi:pulseAt(t,tNb+i*0.15,1.4)}),{d:0.8,dy:20});});
    ctx.restore();
    // the year and the place, in the frame's corner while the camera is on the map
    setScreen(ctx,S);daYear(ctx,90,96,"Chile, 1972",fin(t,0.3,0.8)*(1-fin(t,tAl-0.8,0.6)));
    ctx.restore();}
  // the utility: Grace's measure, read every month; the systems it seems to come from; and the question under it
  if(toU>0.01){ctx.save();ctx.globalAlpha=toU;wallBg(ctx,S,t);d2_cam(ctx,S,t,[[0,960,540,1.0],[tG+0.8,940,530,1.02]]);ctx.globalAlpha=toU*(1-0.6*fin(t,B+0.8,0.8));  // dimmed under the title
    const tE=c("exists"),tBu=w("exists","But it exists");
    d2_measure(ctx,t,{dial:fin(t,tG,0.7),dialHi:pulseAt(t,w("grace","one measure"),1.4),month:fin(t,w("grace","every month")-0.2,0.6),sys:i=>fin(t,tE+0.3+i*0.3,0.6),dim:fin(t,tBu,0.8),
      sheet:fin(t,w("exists","someone")-0.4,0.7),write:clamp((t-w("exists","decided")+0.2)/1.8,0,1)});
    daPerson(ctx,"grace",330,1010,0.9,{t:sc.start+t,a:fin(t,tG-0.3,0.8)});
    ctx.restore();}
  vign(ctx,S);
  daTitle(ctx,S,t,B+1.0,"The pyramid, taken apart","the question comes first","Film 2 of 6 · data architecture");});

/* ---------- 2. A famous pyramid ---------- */
// the pyramid's place on the wall: its middle, its base, its width and height; the panel to its right starts at x 1290
const D2_PY=[700,900,1000,720];
function d2_pyramid(ctx,o){const[cx,by,w,h]=D2_PY;d2_pyr(ctx,cx,by,w,h,o);}
// the pyramid as chapter 2 leaves it, split down the middle: half of it is right
function d2_split(ctx,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{d2_pyramid(ctx,{half:o.half==null?1:o.half});withA(ctx,o.tag==null?1:o.tag,()=>tag(ctx,1590,540,"half right",SOFT,{align:"center",size:32}));});}
scene("pyramid",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tPi=c("picture"),tF=c("four"),tPo=c("poet"),tA=c("ackoff"),tR=c("read"),tHa=c("half");
  wallBg(ctx,S,t);d2_cam(ctx,S,t,[[0,960,540,1.0],[tF-0.2,860,540,1.04],[tPo-0.3,1040,520,1.0],[tR-0.3,900,540,1.02],[tHa-0.4,960,540,1.0]]);
  // the four levels, named in turn; then read from the bottom up, each lighting as it becomes the next
  const lev=[w("four","Data"),w("four","information"),w("four","knowledge"),w("four","wisdom")],rd=[w("read","data becomes"),w("read","information becomes"),w("read","knowledge becomes"),w("read","wisdom")];
  const hi=[0,1,2,3].map(k=>pulseAt(t,lev[k]-0.1,1.3)+pulseAt(t,rd[k]-0.1,1.2));
  d2_pyramid(ctx,{p:clamp((t-tPi-0.6)/3.0,0,1),lines:fin(t,tF-0.4,1.2),word:k=>fin(t,lev[k]-0.2,0.5),hi,half:fin(t,tHa+0.2,0.7)});
  // where it came from: a poet's line, writers on management, and Ackoff
  const panA=1-fin(t,tR-0.7,0.6);
  if(panA>0.01)withA(ctx,panA,()=>{d2_quote(ctx,1290,110,600,"Where is the knowledge we have lost in information?","T. S. Eliot, 1934",fin(t,w("poet","a poet")-0.3,0.7));
    d2_when(ctx,1290,440,"1980s","writers on management",fin(t,w("ackoff","drew")-0.4,0.6));d2_when(ctx,1290,580,"1989","Russell Ackoff",fin(t,w("ackoff","Ackoff")-0.2,0.6));});
  // read from the bottom up
  const upA=fin(t,tR,0.5)*(1-fin(t,tHa-0.3,0.5));if(upA>0.01){arrowTo(ctx,130,880,130,176,SOFT,0.85*upA,{p:clamp((t-tR-0.1)/(rd[3]-tR+0.4),0,1),lw:3});
    withA(ctx,upA,()=>tag(ctx,60,130,"read from the bottom up",SOFT,{size:30}));}
  withA(ctx,fin(t,tHa+0.4,0.6),()=>tag(ctx,1590,540,"half right",SOFT,{align:"center",size:32}));
  vign(ctx,S);});

/* ---------- 3. What it gets right ---------- */
// R, to the pyramid's right: what the pyramid gets right, ticked; then the measure line by line, and Grace's decision, which she answers for
function d2_R(ctx,o){const X=D2_X2;
  d2_right(ctx,X+120,130,"a number needs context",o.t1==null?1:o.t1,{hi:o.h1});d2_right(ctx,X+1240,130,"people decide",o.t2==null?1:o.t2,{hi:o.h2});
  d2_bars(ctx,X+120,200,1060,560,o.bp==null?1:o.bp,o.bars==null?1:o.bars,{lit:o.lit==null?1:o.lit});
  ruleCard(ctx,X+1240,200,620,"Renew line 14 and line 9 first.",{kicker:"decision · Grace",col:BIZ,size:30,a:o.dec==null?1:o.dec,hi:o.decHi});
  daOwner(ctx,X+1240,380,"Grace · network operations",{a:o.own==null?1:o.own,hi:o.ownHi});}
// t is the film's own clock (the chapter's start plus its time), so a person drawn by two chapters as one fades into the next is drawn the same
function d2_R3people(ctx,t,o){o=o||{};daPerson(ctx,"grace",D2_GR3[0],D2_GR3[1],0.9,{t,dir:-1,a:o.g==null?1:o.g});daPerson(ctx,"ines",D2_IN3[0],D2_IN3[1],0.95,{t,dir:-1});}
// forty-one interruptions, alone, and the questions it needs answered
function d2_forty(ctx,a,q){if(a<=0.01)return;const X=D2_X2;withA(ctx,a,()=>{glass(ctx,X+160,230,560,300,18,BUSC,{glow:12,ea:0.75,fill:"rgba(16,14,8,0.94)"});
  T(ctx,"41",X+440,410,{w:800,size:140,align:"center",color:rgba(INK,0.97)});T(ctx,"interruptions",X+440,478,{w:700,size:34,align:"center",color:rgba(mix(BUSC,INK,0.3),1)});
  ["on which line?","over what time?","among how many customers?"].forEach((s,i)=>withA(ctx,q[i],()=>tag(ctx,X+800,290+i*92,s,BUSC,{size:32})));});}
scene("right",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tC=c("context"),tFo=c("forty"),tM=c("measure"),tPe=c("people"),tGr=c("grace"),tK=c("keeps");
  wallBg(ctx,S,t);d2_cam(ctx,S,t,[[0,960,540,1.0],[0.8,2880,540,1.0],[tM-0.3,2860,520,1.02],[tPe-0.4,2880,540,1.0]]);
  // the pyramid, left as it was, while the camera moves on
  if(t<2.8)d2_split(ctx,1);
  // forty-one, alone; then line by line, over a year, per customer
  const fA=fin(t,tFo-0.2,0.6)*(1-fin(t,tM-0.5,0.5));d2_forty(ctx,fA,[w("forty","which line"),w("forty","what time"),w("forty","how many")].map(x=>fin(t,x-0.2,0.5)));
  d2_R(ctx,{t1:fin(t,tC,0.6),h1:pulseAt(t,tC+0.3,1.2)+pulseAt(t,tK+0.1,1.2),t2:fin(t,tPe,0.6),h2:pulseAt(t,tPe+0.3,1.2)+pulseAt(t,tK+0.3,1.2),bp:clamp((t-tM-0.2)/2.4,0,1),bars:fin(t,tM+0.1,0.5),
    lit:fin(t,w("measure","which lines")-0.1,0.6),dec:fin(t,w("grace","Grace decides")-0.2,0.7),decHi:pulseAt(t,w("grace","renew first"),1.4),own:fin(t,w("grace","answers")-0.3,0.6),ownHi:pulseAt(t,w("grace","answers"),1.4)});
  d2_R3people(ctx,sc.start+t,{g:fin(t,tPe-0.3,0.8)});
  vign(ctx,S);});

/* ---------- 4. The question comes first ---------- */
// F, under the pyramid: the definition, written first, and who owns it; the momentary cut, in a measure of its own; the outage
// system's records of each cut; and, in Chile too, the mill drawn first
const D2_DEF="Power lost to a connection point for more than five minutes.";
function d2_F(ctx,t,o){const Y=D2_Y1+50;
  const dh=d2_def(ctx,120,Y+100,820,"definition · interruption",D2_DEF,o.type==null?1:o.type,o.def==null?1:o.def,{hi:o.defHi});
  daOwner(ctx,120,Y+100+dh+44,"Grace · network operations",{a:o.own==null?1:o.own});
  ruleCard(ctx,120,Y+390,820,"Five minutes or less: counted in a measure of its own.",{kicker:"momentary interruption",col:BUSC,size:30,a:o.mom==null?1:o.mom});
  d2_cuts(ctx,1060,Y+120,780,o.rows==null?3:o.rows,o.cuts==null?1:o.cuts,{mark:i=>o.mark?o.mark(i):1,hi:o.cutHi});
  withA(ctx,o.empty||0,()=>T(ctx,"nothing recorded yet",1450,Y+330,{w:700,size:30,align:"center",color:rgba(SOFT,1)}));
  // the definition decides the data
  withA(ctx,o.arrow==null?1:o.arrow,()=>arrowTo(ctx,948,Y+190,1048,Y+262,BUSC,0.9,{p:o.ap==null?1:o.ap,lw:3,bend:-0.15}));
  // in Chile, too: the mill drawn first, and the number chosen on it
  const ch=o.chile==null?1:o.chile;if(ch>0.01){withA(ctx,ch,()=>{glow(ctx,1450,Y+600,380,CY_LAMP,0.07);daFlow(ctx,1060,Y+460,780,270,["spinning","weaving","finishing"],{title:"how the mill works",p:1,marks:[[1,"cloth woven",o.mill==null?1:o.mill]],rot:-0.01});});
    withA(ctx,ch*(o.chTag==null?1:o.chTag),()=>tag(ctx,1450,Y+790,"in Chile, too: the drawing came first",CY_LAMP,{align:"center",size:30}));}}
// the pyramid as a factory: data in at the bottom, wisdom out at the top
function d2_factory(ctx,t,a,t0){if(a<=0.01)return;withA(ctx,a,()=>{arrowTo(ctx,40,850,226,850,SOFT,0.9,{p:clamp((t-t0)/0.8,0,1),lw:3});T(ctx,"data in",40,806,{w:700,size:30,color:rgba(SOFT,1)});
  const q=clamp((t-t0-1.4)/0.8,0,1);arrowTo(ctx,700,172,700,58,SOFT,0.9,{p:q,lw:3});withA(ctx,q,()=>T(ctx,"wisdom out",730,100,{w:700,size:30,color:rgba(SOFT,1)}));
  // what goes through it, rising
  for(let i=0;i<14;i++){const u=((t-t0)*0.22+hash(i,61))%1,y=880-u*680,hw=500*(1-(900-y)/720)*0.8,x=700+(hash(i,62)-0.5)*2*hw;glow(ctx,x,y,14,INFC,0.4*Math.sin(Math.PI*u));}});}
scene("first",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tD=c("drawn"),tFa=c("factory"),tN=c("nothing"),tBe=c("before"),tFi=c("five"),tSh=c("short"),tRe=c("records"),tCa=c("came"),tCh=c("chile");
  wallBg(ctx,S,t);d2_cam(ctx,S,t,[[0,2880,540,1.0],[0.8,960,540,1.0],[tFa+0.2,900,520,1.03],[tN+0.2,960,D2_Y1+540,1.0]]);
  // what the pyramid gets right, left as it was, while the camera leaves it
  if(t<2.8){d2_R(ctx,{});d2_R3people(ctx,sc.start+t);}
  // the pyramid, whole again, and how it's drawn: like a factory
  d2_pyramid(ctx,{half:1-fin(t,tD+0.3,0.8)});withA(ctx,1-fin(t,tD,0.5),()=>tag(ctx,1590,540,"half right",SOFT,{align:"center",size:32}));
  d2_factory(ctx,t,fin(t,w("factory","data goes in")-0.2,0.4),w("factory","data goes in"));
  // nothing recorded yet; the definition, written first; the momentary cut; the records, made to fit; and the question deciding them
  const tSo=w("before","someone");
  d2_F(ctx,t,{cuts:fin(t,tN+0.5,0.7),rows:clamp((t-tRe-0.4)/2.0,0,1)*3,empty:fin(t,tN+0.9,0.6)*(1-fin(t,tRe,0.4)),def:fin(t,tSo-0.2,0.7),type:clamp((t-tFi)/2.6,0,1),defHi:pulseAt(t,tCa+0.1,1.4),
    own:fin(t,tSo+0.4,0.6),mom:fin(t,tSh+0.1,0.7),mark:i=>fin(t,tCa+0.6+i*0.3,0.4),cutHi:pulseAt(t,tCa+0.6,1.4),arrow:fin(t,tCa,0.4),ap:clamp((t-tCa)/0.7,0,1),
    chile:fin(t,tCh-0.1,0.8),mill:fin(t,w("chile","chose")-0.2,0.8),chTag:fin(t,tCh+0.5,0.6)});
  vign(ctx,S);});

/* ---------- 5. No raw data ---------- */
// W, under R: a meter's readings, which look raw, and what someone chose for them; a book that says so in its title
function d2_W(ctx,t,o){const X=D2_X2,Y=D2_Y1+70;
  // the question, large in the middle at first, then settled in its corner as the readings arrive
  const rp=sstep(0,1,o.rawP==null?1:o.rawP),rs=lerp(60,32,rp);
  withA(ctx,o.raw==null?1:o.raw,()=>tag(ctx,lerp(X+960,X+180+(tw(ctx,"raw data?",32,700)+26)/2,rp),lerp(Y+330,Y+90,rp),"raw data?",SOFT,{align:"center",size:rs}));
  d2_readings(ctx,X+180,Y+150,o.tab==null?1:o.tab,{hi:o.hi||{}});
  [["chose: every half hour","time"],["chose: kilowatt hours","unit"],["chose: one decimal place","dp"]].forEach(([s,k],i)=>withA(ctx,o.ch?o.ch(i):1,()=>tag(ctx,X+700,Y+300+i*92,s,CY_SIG,{size:30})));
  d2_book(ctx,X+1360,Y+110,o.book==null?1:o.book);withA(ctx,o.book==null?1:o.book,()=>T(ctx,"L. Gitelman (ed.), 2013",X+1525,Y+590,{w:600,size:28,align:"center",color:rgba(SOFT,1)}));
  // stamped on the readings: someone designed them, for a question
  const st=o.stamp==null?1.6:o.stamp;if(st>0.01)withA(ctx,clamp(st*2,0,1),()=>{ctx.save();ctx.translate(X+400,Y+676);ctx.rotate(-0.06);const k=1+0.3*(1-spring(clamp(st,0,1.6)));ctx.scale(k,k);
    ctx.fillStyle="rgba(12,10,14,0.88)";rr(ctx,-250,-36,500,72,10);ctx.fill();ctx.strokeStyle=rgba(DAC,0.95);ctx.lineWidth=4;ctx.stroke();T(ctx,"designed, for a question",0,11,{w:800,size:32,align:"center",color:rgba(DAC,1)});ctx.restore();});}
scene("raw",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tE=c("either"),tRd=c("reading"),tCh=c("chose"),tBk=c("book"),tEv=c("every");
  wallBg(ctx,S,t);d2_cam(ctx,S,t,[[0,960,D2_Y1+540,1.0],[0.8,2880,D2_Y1+540,1.0],[tCh-0.3,2860,D2_Y1+520,1.02],[tBk-0.3,2880,D2_Y1+540,1.0]]);
  // the definition and the records, left as they were
  if(t<2.8)d2_F(ctx,t,{});
  const ck=[w("chose","half hour"),w("chose","kilowatt"),w("chose","decimal")];
  d2_W(ctx,t,{raw:fin(t,tE+0.2,0.6),rawP:clamp((t-tRd+0.4)/1.1,0,1),tab:fin(t,tRd-0.2,0.7),hi:{time:pulseAt(t,ck[0]-0.1,1.6),unit:pulseAt(t,ck[1]-0.1,1.6),dp:pulseAt(t,ck[2]-0.1,1.6)},ch:i=>fin(t,ck[i]-0.2,0.5),book:fin(t,tBk+0.1,0.7),stamp:clamp((t-w("every","designed")+0.1)/0.5,0,1.6)});
  vign(ctx,S);});

/* ---------- 6. No separate levels, no clear top ---------- */
// the top of the pyramid, in practice: a person, deciding, on a chip over its tip
function d2_person(ctx,o){const s="a person, deciding",w=tw(ctx,s,28,700)+70;daOwner(ctx,D2_PY[0]-w/2,126,s,o);}
// what DAMA says, the same record of a cut seen two ways, and how vague the top is, in the panel to the pyramid's right
scene("levels",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tAp=c("apart"),tDa=c("dama"),tSa=c("same"),tTo=c("top"),tWi=c("wisdom"),tPe=c("person");
  wallBg(ctx,S,t);d2_cam(ctx,S,t,[[0,2880,D2_Y1+540,1.0],[0.8,960,540,1.0],[tTo-0.3,880,500,1.04],[tPe+0.2,960,540,1.0]]);
  // everything the camera passes on its way back to the pyramid, left as it was
  if(t<2.8){d2_W(ctx,t,{});d2_F(ctx,t,{});d2_R(ctx,{});d2_R3people(ctx,sc.start+t);}
  // the levels run into each other; the top clouds over, then turns out to be a person, deciding
  const fog=fin(t,tTo+0.2,1.0)*(1-0.7*fin(t,tPe+0.3,1.0));
  d2_pyramid(ctx,{lines:1-fin(t,tAp+0.4,1.4),fog,hi:[pulseAt(t,w("dama","data is")-0.1,1.4)+pulseAt(t,w("same","data to")-0.1,1.4),pulseAt(t,w("dama","information is")-0.1,1.4)+pulseAt(t,w("same","information to")-0.1,1.4),0,0]});
  // data is a form of information, and information is a form of data: arrows both ways between the two levels
  const dA=fin(t,tDa+0.3,0.6)*(1-fin(t,tTo-0.5,0.5));if(dA>0.01){ruleCard(ctx,1290,120,600,"Data is a form of information, and information is a form of data.",{kicker:"DAMA-DMBOK",col:INFC,size:30,a:dA});
    arrowTo(ctx,500,826,500,640,INFC,0.9*dA,{p:clamp((t-w("dama","data is"))/0.8,0,1),lw:3,bend:0.25});arrowTo(ctx,900,640,900,826,INFC,0.9*dA,{p:clamp((t-w("dama","information is"))/0.8,0,1),lw:3,bend:0.25});}
  // the same record of a cut: data to the outage system, information to Grace
  const sA=fin(t,tSa,0.6)*(1-fin(t,tTo-0.5,0.5));if(sA>0.01){daDO(ctx,1290,330,420,118,"cut","in outage system",{a:sA,size:32});
    withA(ctx,sA*fin(t,w("same","data to")-0.2,0.5),()=>tag(ctx,1290,516,"data, to the outage system",APPC,{size:30}));withA(ctx,sA*fin(t,w("same","information to")-0.2,0.5),()=>tag(ctx,1290,590,"information, to Grace",BIZ,{size:30}));}
  // wisdom: little agreement on what it is, or how a system could hold it
  const wA=fin(t,tWi,0.6)*(1-fin(t,tPe-0.2,0.6));if(wA>0.01)withA(ctx,wA,()=>{withA(ctx,fin(t,w("wisdom","what wisdom")-0.2,0.5),()=>tag(ctx,1290,210,"what is wisdom?",SOFT,{size:32}));
    withA(ctx,fin(t,w("wisdom","how a system")-0.2,0.5),()=>tag(ctx,1290,300,"how could a system hold it?",SOFT,{size:32}));withA(ctx,fin(t,w("wisdom","how a system")+0.6,0.6),()=>T(ctx,"Rowley 2007 · Frické 2009",1290,384,{w:600,size:28,color:rgba(SOFT,0.95)}));});
  d2_person(ctx,{a:fin(t,w("person","a person")-0.2,0.7),hi:pulseAt(t,w("person","deciding"),1.4)});
  vign(ctx,S);});

/* ---------- 7. Arrows both ways ---------- */
// the redrawn picture at P: a decision, its question, the measure, the definition and the records, with arrows down on the left (what
// asks) and up on the right (what answers); and, under it at F, the data practice on the map
// F's map: the business layer and the information layer, the business object and its owner, the data object that realises it, and
// the measure that traces to both
function d2_map(ctx,t,o){const Y=D2_MY,a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  withA(ctx,o.band==null?1:o.band,()=>{tag(ctx,960,Y+30,"the data practice on the map",DAC,{align:"center",size:30});
    ctx.save();ctx.fillStyle=rgba(BUSC,0.07);ctx.strokeStyle=rgba(BUSC,0.55);ctx.lineWidth=2;rr(ctx,40,Y+70,1840,290,18);ctx.fill();ctx.stroke();ctx.restore();tag(ctx,64,Y+70,"business",BUSC,{size:28});
    ctx.save();ctx.fillStyle=rgba(INFC,0.07);ctx.strokeStyle=rgba(INFC,0.55);ctx.lineWidth=2;rr(ctx,40,Y+400,1840,360,18);ctx.fill();ctx.stroke();ctx.restore();tag(ctx,64,Y+400,"information",INFC,{size:28});});
  d2_bo(ctx,820,Y+100,560,150,"interruption","power lost for more than five minutes",{a:o.bo==null?1:o.bo,hi:o.boHi||0,def:o.defd==null?1:o.defd});
  daOwner(ctx,1400,Y+175,"Grace · network operations",{a:o.own==null?1:o.own,hi:o.ownHi||0});
  daDO(ctx,900,Y+500,400,118,"cut","in outage system",{a:o.do==null?1:o.do,size:32,hi:o.doHi||0});
  daReal(ctx,1100,Y+500,1100,Y+252,o.real==null?1:o.real,{a:o.do==null?1:o.do});
  d2_dial(ctx,90,Y+110,480,"interruptions per customer, per year","1.4",o.dial==null?1:o.dial,{h:170,hi:o.dialHi||0});
  // the measure traces to both: what it counts, and where the counts come from
  const tr=o.trace==null?1:o.trace;if(tr>0.01)withA(ctx,tr,()=>{const p1=o.tp1==null?1:o.tp1,p2=o.tp2==null?1:o.tp2;
    arrowTo(ctx,578,Y+195,810,Y+175,DAC,0.9,{p:p1,dash:[8,8],lw:2.6,bend:-0.08});withA(ctx,fin(p1,0.6,0.4),()=>T(ctx,"what it counts",695,Y+150,{w:700,size:28,align:"center",color:rgba(mix(DAC,INK,0.3),1)}));
    arrowTo(ctx,330,Y+288,890,Y+566,DAC,0.9,{p:p2,dash:[8,8],lw:2.6,bend:0.22});withA(ctx,fin(p2,0.6,0.4),()=>T(ctx,"where the counts come from",480,Y+606,{w:700,size:28,align:"center",color:rgba(mix(DAC,INK,0.3),1)}));});});}
// the column as chapter 7 leaves it, every box and arrow in
function d2_column(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;d2_chain(ctx,5,{a,hi:o.hi});
  [[0,1,"asks"],[1,2,"needs"],[2,3,"needs"],[3,4,"decides"],[4,2,"answer"],[2,1,"answers"],[1,0,"a person decides"]].forEach(([i,j,s])=>d2_link(ctx,i,j,1,s,a));}
scene("both",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tRd=c("redraw"),tDo=c("down"),tDe=c("decides"),tUp=c("up"),tMa=c("map"),tRe=c("realise"),tTr=c("traces"),B=c("breath");
  wallBg(ctx,S,t);d2_cam(ctx,S,t,[[0,960,540,1.0],[tDo-0.3,940,520,1.02],[tUp-0.2,960,540,1.0],[tMa-0.5,960,D2_Y1+540,1.0]]);
  // the pyramid as it was left, giving way to the redrawing
  const pyA=1-fin(t,tRd+1.0,1.2);if(pyA>0.01){d2_pyramid(ctx,{lines:0,fog:0.3,a:pyA});d2_person(ctx,{a:pyA});}
  // the column's places, sketched, then each box as it's named, and the arrows down and up
  const slots=fin(t,tRd+1.6,0.8)*(1-fin(t,tDe+1.4,0.6));if(slots>0.01)withA(ctx,slots,()=>{for(let i=0;i<5;i++){ctx.save();ctx.strokeStyle=rgba(SOFT,0.45);ctx.setLineDash([8,10]);ctx.lineWidth=2;rr(ctx,D2_CX-D2_CW/2,d2_boxY(i),D2_CW,D2_CH,16);ctx.stroke();ctx.restore();}});
  const bT=[w("down","decision"),w("down","question"),w("down","needs a measure"),w("down","needs a definition"),tDe+0.5],k=bT.reduce((s,x)=>s+clamp((t-x+0.2)/0.6,0,1),0);
  const dT=[w("down","asks"),w("down","needs a measure"),w("down","needs a definition"),w("decides","decides")],uT=[w("up","answer the"),w("up","answers"),w("up","person")];
  const hi=[pulseAt(t,uT[2]+0.4,1.6),0,0,pulseAt(t,tDe+0.1,1.4),0];
  d2_chain(ctx,k,{hi});
  [[0,1,"asks"],[1,2,"needs"],[2,3,"needs"],[3,4,"decides"]].forEach(([i,j,s],n)=>d2_link(ctx,i,j,clamp((t-dT[n]-0.1)/0.7,0,1),s,1));
  [[4,2,"answer"],[2,1,"answers"],[1,0,"a person decides"]].forEach(([i,j,s],n)=>d2_link(ctx,i,j,clamp((t-uT[n]+0.1)/0.8,0,1),s,1));
  daPerson(ctx,"ines",D2_IN7[0],D2_IN7[1],0.95,{t:sc.start+t,dir:-1,a:fin(t,tRd-0.4,0.8)});
  // on the map: interruption as a business object, defined once and owned by Grace; the cut that realises it; the measure, traced to both
  const tBo=w("map","business object"),tOw=w("map","owned by Grace");
  d2_map(ctx,t,{band:fin(t,tMa-0.2,0.8),bo:fin(t,tBo-0.3,0.6),boHi:pulseAt(t,tBo,1.4),defd:fin(t,w("map","defined once")-0.1,0.6),own:fin(t,tOw-0.2,0.6),ownHi:pulseAt(t,tOw+0.2,1.4),
    do:fin(t,tRe+0.1,0.6),doHi:pulseAt(t,tRe+0.3,1.2),real:clamp((t-w("realise","realises")+0.1)/0.9,0,1),dial:fin(t,tTr-0.1,0.6),dialHi:pulseAt(t,tTr+0.2,1.4),
    trace:fin(t,tTr+0.2,0.3),tp1:clamp((t-w("traces","what it counts")+0.1)/0.9,0,1),tp2:clamp((t-w("traces","where the counts")+0.1)/1.1,0,1)});
  daPerson(ctx,"grace",D2_GR7[0],D2_GR7[1],0.9,{t:sc.start+t,dir:-1,a:fin(t,tOw-0.6,0.8)});
  // the breath: the counts run up the traces and the line of realisation, once
  const ru=clamp((t-B-0.4)/1.6,0,1);if(ru>0&&ru<1){const Y=D2_MY;glow(ctx,1100,lerp(Y+500,Y+252,ru),22,DAC,0.6*Math.sin(Math.PI*ru));glow(ctx,lerp(890,330,ru),lerp(Y+566,Y+288,ru),20,DAC,0.5*Math.sin(Math.PI*ru));}
  vign(ctx,S);});

/* ---------- 8. Defined first ---------- */
// Chile again, in lamp-light: the numbers that never came raw. The mill drawn, the number chosen, its normal, the warning, and a person
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tCh=c("chile"),tDr=c("drew"),tPe=c("person"),tGr=c("grace"),tYe=c("year"),tNx=c("next"),toU=fin(t,tGr-0.6,1.2);
  if(toU<0.99){ctx.save();ctx.globalAlpha=1-toU;d2_night(ctx,S,t);setScreen(ctx,S);focus(ctx,t,[[0,960,540,1.0],[tDr-0.3,920,520,1.03],[tPe-0.2,1000,540,1.02]],1.7);
    const tCs=w("drew","chose"),tNm=w("drew","normal"),tSe=w("person","only what changed"),tAp=w("person","a person");
    // a factory's number, large at first, then set down under the drawing it came from
    const sm=sstep(0,1,clamp((t-tDr+0.4)/1.3,0,1)),sk=lerp(1.25,1,sm);ctx.save();ctx.translate(lerp(485,120,sm),lerp(415,600,sm));ctx.scale(sk,sk);
    d2_strip(ctx,0,0,760,"CLOTH WOVEN   4,180 M",fin(t,tCh-0.2,0.7),{size:38,h:104});ctx.restore();
    daFlow(ctx,120,130,900,330,["spinning","weaving","finishing"],{title:"how the mill works",p:clamp((t-tDr)/1.8,0,1),marks:[[1,"cloth woven",clamp((t-tCs+0.1)/0.9,0,1)]],a:fin(t,tDr-0.3,0.6)});
    d2_ind(ctx,1100,130,700,330,D2_DAYS,{p:clamp((t-tNm+0.8)/1.4,0,1),band:fin(t,tNm,0.7),lit:fin(t,tSe,0.5),title:"cloth woven, day by day",a:fin(t,tNm-1.0,0.6)});
    if(t>tSe-0.1)arrive(ctx,1450,595,t,tSe-0.1,()=>d2_warn(ctx,1100,520,700,"textile mill: cloth woven",1,{low:true}),{d:0.8,dy:24});
    daSil(ctx,1690,1012,300,{a:fin(t,tAp-0.3,0.8),dir:-1});
    ctx.restore();}
  // the utility: the measure defined first, recorded to fit, read by someone who acts; counted the same way every year; and the next
  // question: each cut is recorded by more than one system
  if(toU>0.01){ctx.save();ctx.globalAlpha=toU;wallBg(ctx,S,t);d2_cam(ctx,S,t,[[0,960,D2_Y1+540,1.0],[tYe-0.3,940,D2_Y1+530,1.02],[tNx-0.2,960,D2_Y1+540,1.0]]);ctx.globalAlpha=toU*(1-0.6*fin(t,B+0.6,0.8));  // dimmed under the end card
    const Y=D2_MY,tDf=w("grace","defined first"),tRf=w("grace","recorded to fit"),tRb=w("grace","read by"),tFt=w("next","Which record");
    const out=1-fin(t,tNx+0.2,0.6);
    d2_map(ctx,t,{boHi:pulseAt(t,tDf,1.4),doHi:pulseAt(t,tRf,1.4),ownHi:pulseAt(t,tRb,1.4),dialHi:pulseAt(t,tYe+0.2,1.4),trace:out});
    withA(ctx,fin(t,w("year","every year")-0.2,0.6),()=>tag(ctx,90,Y+318,"counted the same way, every year",BIZ,{size:28}));
    [["line 14: renewed first",0],["line 9: renewed first",1]].forEach(([s,i])=>withA(ctx,fin(t,w("year","renewed first")-0.2+i*0.3,0.5),()=>tag(ctx,1400,Y+252+i*56,s,TRUST,{size:28})));
    // the same cut, recorded by more than one system
    [["power-off event","in meter data"],["no-power call","in customer service"]].forEach(([n,s],i)=>{const q=fin(t,w("next","more than one")-0.2+i*0.4,0.6);if(q>0.01)arrive(ctx,280,Y+510+i*130,t,w("next","more than one")-0.2+i*0.4,()=>daDO(ctx,90,Y+460+i*130,400,112,n,s,{size:30}),{d:0.8,dy:20});});
    withA(ctx,fin(t,tFt-0.2,0.6),()=>tag(ctx,1100,Y+690,"which is the fact?",DAC,{align:"center",size:32}));
    daPerson(ctx,"grace",D2_GR7[0],D2_GR7[1],0.9,{t:sc.start+t,dir:-1});
    ctx.restore();}
  vign(ctx,S);
  daEnd(ctx,S,t,B+0.8,"The pyramid, taken apart","Decide what to count first; then the records can answer, and a person decides.","Film 2 of 6");});
