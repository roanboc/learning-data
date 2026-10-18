/* ===== Kept, not cleaned: scenes =====
   Ten chapters, as in ../script.md: Dujiangyan, split without a dam, its inner channel dug out every dry season down to a mark in its
   bed; the university's clean-up of 2024; the duplicates coming back, intake by intake; the search before create at the application;
   the steward's five measures, each with a limit; an alert, and the case it points at; a change to a list, drafted by an agent and
   decided by its owner; the governance scorecard; a bank that cleans up every three years; and Linh's PhD, with the water let back
   into the inner channel in spring.
   Drawn in watercolour (shared/src/wash.js), made to read on a phone (tools/legible.py): text is at least 28 px in the frame. The camera
   moves in on whatever the narration is about, and every shot drifts slowly; things arrive with a spring. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// the camera, as The map before the data moves it (keys are [time, x, y, zoom], each move eased over d seconds), kept inside the place
function m9_focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z);x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// every scene's start and end: the place under the camera, and over it all, the paper
function m9_open(ctx,S,t,sc,place,keys,o){o=o||{};setScreen(ctx,S);ctx.save();const cam=m9_focus(ctx,t,keys,o.d||1.6);drift(ctx,t,sc,{z:o.z==null?0.018:o.z,x:o.dx||960,y:o.dy||560});
  if(place)m9_place(ctx,place);return cam;}
function m9_close(ctx,S){ctx.restore();setScreen(ctx,S);}

/* ---------- 1. Kept, every dry season ---------- */
// the river through a year: o says when the dry season comes (dry), the tripods close the inner channel (close), its water drains
// (drain), the diggers go down into its bed (dig), the tripods come down (open), the water comes back (fill), and the land greens again
// (green)
function m9_seasons(ctx,t,o){const dryA=fin(t,o.dry,1.6)*(1-fin(t,o.green,1.6));m9_place(ctx,"river");if(dryA>0.01)withA(ctx,dryA,()=>m9_place(ctx,"riverDry"));
  const dr=ease(clamp((t-o.drain)/1.8,0,1)),fl=ease(clamp((t-o.fill)/1.8,0,1)),cf=ease(clamp((t-o.fill-1.4)/1.3,0,1));
  // the inner channel's water over the dry bed: it drains from the tripods down, and comes back from the head
  if(dryA>0.01){if(t<o.fill)m9_waterIn(ctx,lerp(M9_CLOSE,1,dr),1,clamp((dr-0.55)/0.45,0,1)*M9_CDMAX,M9_CDMAX);else m9_waterIn(ctx,M9_CLOSE,lerp(M9_CLOSE,1,fl),0,cf*M9_CDMAX);}
  const inA=t<o.drain?1:t<o.fill?1-dr:fl;
  m9_flow(ctx,t,M9_MAIN,M9_WMAIN,40,80,3,1,0.34,M9_SEEN);m9_flow(ctx,t,M9_IN,M9_WIN,12,52,7,inA,0.3);
  M9_CAN.forEach((c,i)=>m9_flow(ctx,t,c.p,c.w,Math.ceil(c.L/160),36,11+i,(t<o.drain?1:t<o.fill?0:cf)*0.7,0.1));
  m9_tripods(ctx,t,o.close,o.open);m9_diggers(ctx,t,o.dig,fin(t,o.dig,0.5)*(1-fin(t,o.open-0.7,0.6)));return dryA;}
scene("river",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tMin=w("split","Min River"),tTwo=w("split","in two"),tPl=w("split","Chengdu plain"),tG=c("gravel"),tOut=w("gravel","outer channel"),
    tD=c("dry"),tEv=w("dry","every dry season"),tCl=w("dry","closed off"),tDug=w("dry","dug out"),tMk=w("dry","a mark"),tM=c("mark"),tIr=w("mark","iron bars"),
    tR=c("rule"),tSix=w("rule","six characters"),tDig=w("rule","dig the riverbed"),tSt=c("still"),tWat=w("still","still waters"),tK=c("kept");
  // the camera: the valley; in on the split as the gravel goes by; down the inner channel in the dry season, as it's dug out; across to
  // the cut through its bed; out for the rule; over the plain as the water comes back; out
  m9_open(ctx,S,t,sc,null,[[0,960,540,1],[tMin-0.6,990,480,1.1],[tG-0.5,1000,470,1.7],[tD-0.3,880,560,1.4],[tM-1.1,1120,450,1.18],[tR-0.6,960,520,1],[tSt-0.3,740,640,1.28],[tK-0.3,960,540,1]]);
  const o={dry:tEv-0.2,close:tCl-0.1,drain:tCl+0.5,dig:tDug,open:tSt-0.1,fill:tSt+0.5,green:tSt+2.4};m9_seasons(ctx,t,o);
  m9_gravel(ctx,t,tG-1.2,fin(t,tG-0.8,0.6)*(1-fin(t,tD,0.8)));
  // the channels, named as the river splits; the plain, as it's watered
  const off=t1=>1-fin(t,t1,0.5);
  arrive(ctx,1150,330,t,tMin,()=>withA(ctx,off(tD-0.2),()=>wc_tag(ctx,1150,330,"Min River",{align:"center"})),{dy:8});
  arrive(ctx,1250,628,t,tTwo+0.1,()=>withA(ctx,off(tMk-0.6),()=>wc_tag(ctx,1250,628,"outer channel",{align:"center"})),{dy:8});
  arrive(ctx,760,600,t,tTwo+0.5,()=>withA(ctx,off(tMk-0.6),()=>wc_tag(ctx,760,600,"inner channel",{align:"center"})),{dy:8});
  arrive(ctx,290,540,t,tPl,()=>withA(ctx,off(tG-0.6),()=>wc_tag(ctx,290,540,"to the Chengdu plain",{align:"center"})),{dy:8});
  arrive(ctx,760,474,t,tEv+0.3,()=>withA(ctx,off(tMk-0.6),()=>wc_tag(ctx,760,474,"every dry season",{align:"center"})),{dy:8});
  // the cut through the riverbed, over a veil of paper, once the line has named the mark: dug out down to it, and no deeper; then the rule
  const hush=fin(t,tM-0.8,0.6)*(1-fin(t,tSt-0.6,0.8));m9_hush(ctx,0.5*hush);
  const pa=1-fin(t,tR-0.6,0.6);if(pa>0.01)withA(ctx,pa,()=>{const S9=M9_SEC,cx=S9.x+S9.w/2,my=S9.y+M9_MARK;
    arrive(ctx,cx,S9.y+S9.h/2,t,tM-0.7,()=>m9_section(ctx,t,{tDig:tM-0.5,tDug:tM+0.5,tBars:tIr-0.1,tLine:tM+1.2}),{dy:24,d:0.9,from:0.96});
    arrive(ctx,cx,my+70,t,tM+0.5,()=>withA(ctx,off(tIr-0.6),()=>wc_tag(ctx,cx,my+70,"stone horses, it's said",{align:"center"})),{dy:8});
    arrive(ctx,cx,my+70,t,tIr+0.1,()=>wc_tag(ctx,cx,my+70,"iron bars",{align:"center"}),{dy:8});
    arrive(ctx,cx,my+122,t,tIr+0.5,()=>wc_tag(ctx,cx,my+122,"the oldest cast in 1576",{align:"center",size:28,w:600}),{dy:8});
    arrive(ctx,cx,S9.y+S9.h+40,t,tM+1.9,()=>wc_tag(ctx,cx,S9.y+S9.h+40,"dig until you see it, and no deeper",{align:"center"}),{dy:8});});
  const ra=1-fin(t,tSt-0.6,0.6);if(ra>0.01)withA(ctx,ra,()=>{m9_rule(ctx,960,196,clamp((t-tDig+0.3)/1.6,0,1));
    arrive(ctx,960,296,t,tSix,()=>wc_tag(ctx,960,296,"the rule, six characters long",{align:"center",size:28,w:600}),{dy:8});});
  m9_close(ctx,S);
  wc_year(ctx,64,80,"about 256 BC · Sichuan",fin(t,0.4,0.6)*(1-fin(t,tSt+0.2,0.4)));wc_year(ctx,64,80,"today",fin(t,tWat,0.5));
  wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  wc_title(ctx,S,t,B+0.6,"Kept, not cleaned","looking after it every day, and checks at entry","Film 9 of 9 · master and reference data");});

/* ---------- 2. The clean-up ---------- */
// the chart's box at the side here, and where it grows to as it takes the frame in chapter 3
const M9_B2={x:1100,y:150,w:700,h:470},M9_B3={x:90,y:96,w:1180,h:680};
// the team of four, before the board: Mei (the business side, gold), Sam, Ben and Rosa (the technical side, cyan)
const M9_TEAM=[["mei",300],["sam",490],["ben",680],["rosa",870]];
scene("cleanup",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tProj=w("merged","clean-up project"),tMer=w("merged","merged"),tPpl=w("merged","people"),tFour=w("team","a team of four"),tSix=w("team","six months"),
    tFin=w("team","finished on time"),tG=c("gone");
  // the camera: the campus; in on the board as the pairs merge; out for the team; across to the chart as the line reaches none. No drift, so
  // the chart is where chapter 3 takes it from
  m9_open(ctx,S,t,sc,"campus",[[0,960,540,1],[tProj-0.5,738,415,1.3],[tFour-0.5,960,540,1],[tG-0.5,1150,432,1.25]],{z:0});
  m9_hush(ctx,0.42*fin(t,tG-0.4,0.8));
  const mg=clamp((t-tMer)/(tPpl+0.5-tMer),0,1),mo=clamp((t-tSix+0.1)/(tFin-tSix+0.4),0,1),past=1-fin(t,tG-0.3,0.9);
  // the project, and the team who did it, step back as the line reaches none: it's over
  if(past>0.01)withA(ctx,past,()=>{
    arrive(ctx,M9_BD.x+M9_BD.w/2,M9_BD.y+M9_BD.h/2,t,tProj-0.2,()=>m9_board(ctx,t,{merge:mg,count:ease(mg),months:mo}),{dy:20,d:0.9,from:0.95});
    arrive(ctx,M9_BD.x+M9_BD.w-150,M9_BD.y+M9_BD.h-62,t,tFin,()=>{ctx.save();ctx.translate(M9_BD.x+M9_BD.w-150,M9_BD.y+M9_BD.h-62);ctx.rotate(-0.05);
      const bw=tw(ctx,"finished on time",28,700)+28;wc_badge(ctx,-bw/2,0,"finished on time");ctx.restore();},{dy:-18,d:0.6,from:1.25});
    M9_TEAM.forEach(([id,x],i)=>arrive(ctx,x,800,t,tFour-0.35+i*0.12,()=>person(ctx,id,x,1032,0.74,{pose:"stand",expr:t>tFin+0.3?"relieved":"calm",t}),{d:0.8,from:0.97}));
    arrive(ctx,1010,724,t,tFour+0.25,()=>wc_tag(ctx,1010,724,"a team of four"),{dy:8});});
  // the chart begins at the side: the line falls as the months fill, and runs on at none
  arrive(ctx,M9_B2.x+M9_B2.w/2,M9_B2.y+M9_B2.h/2,t,tSix-0.7,()=>m9_waiting(ctx,t,M9_B2,{mEnd:9,still:true,mL:6*mo+1.6*ease(clamp((t-tG)/1.2,0,1)),hi:fin(t,tG+0.2,0.5)}),{dy:16,d:0.9,from:0.96});
  m9_close(ctx,S);wc_year(ctx,64,80,"2024 · the university",fin(t,0.3,0.6));wc_paperOver(ctx,S);});

/* ---------- 3. Back, intake by intake ---------- */
// the two applications, and the tags that explain the new duplicates, to the chart's right
const M9_UG=[1320,350],M9_PG=[1600,350],M9_AW=265,M9_AH=210;
scene("return",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tBack=w("why","came back"),tTwo=w("why","two routes"),tSec=w("linh","second number"),tJul=w("linh","July"),tOne=w("linh","one of them"),
    tFix=c("fixed"),tCh=w("fixed","change"),tHow=w("fixed","how they were made"),tL=c("linh");
  // the camera: from where chapter 2 left the chart (still while the chapters cross over), out as it takes the frame; in on the climbs for
  // Linh's two numbers; across to the applications
  m9_open(ctx,S,t,sc,"plain",[[0,1150,432,1.25],[0.8,960,540,1],[tL-0.4,662,545,1.45],[tFix-0.4,1182,470,1.3]],{z:0});
  const g=easeCam(clamp((t-0.8)/1.6,0,1)),b={x:lerp(M9_B2.x,M9_B3.x,g),y:lerp(M9_B2.y,M9_B3.y,g),w:lerp(M9_B2.w,M9_B3.w,g),h:lerp(M9_B2.h,M9_B3.h,g)},
    mL=7.6+10.4*clamp((t-1.0)/2.4,0,1),rise=[clamp((t-1.1)/0.6,0,1),clamp((t-2.25)/0.6,0,1)],ev=c("every");
  const P=m9_waiting(ctx,t,b,{mEnd:lerp(9,18,g),still:g>=1,mL,rise,vals:[fin(t,ev-0.1,0.4),fin(t,ev+0.4,0.4)],end:fin(t,3.3,0.5)});
  // Linh's two numbers, settling beside July's block
  const bx=m9_bx(P,13)+M9_BW+14;[["S-17142",tSec-0.1,P.Y(1100)+10],["S-20436",tJul,P.Y(1100)+68]].forEach(([id,t0,y])=>
    arrive(ctx,bx+88,y+26,t,t0,()=>{wc_panel(ctx,bx,y,176,52,{kind:"chip",role:WC_ROLE.student,seed:id.length});wc_T(ctx,id,bx+88,y+36,{w:600,size:28,f:"mono",align:"center",col:WC_DARK});},{dy:-30,d:0.8}));
  arrive(ctx,bx+88,P.Y(1100)+168,t,tOne-0.2,()=>wc_tag(ctx,bx+88,P.Y(1100)+168,"Linh, July 2025",{align:"center"}),{dy:8});
  // why: graduates back to study, and two ways to apply; they step aside for Linh's numbers, and the applications come back to show
  // where records are made, each stamping a new number on whoever applies
  const off=fin(t,tL-0.5,0.5),back=t>=tFix-0.3;
  arrive(ctx,1592,200,t,tBack,()=>withA(ctx,1-off,()=>wc_tag(ctx,1592,200,"back to study",{align:"center"})),{dy:8});
  arrive(ctx,1592,290,t,tTwo,()=>withA(ctx,1-off,()=>wc_tag(ctx,1592,290,"two ways to apply",{align:"center"})),{dy:8});
  arrive(ctx,1592,290,t,tHow-0.2,()=>wc_tag(ctx,1592,290,"where records are made",{align:"center"}),{dy:8});
  const sa=1-fin(t,23.4,0.6);
  [[M9_UG,"undergraduate",tTwo+0.25,20441,tCh],[M9_PG,"postgraduate",tTwo+0.45,20461,tCh+0.45]].forEach(([[x,y],sub,t0,base,ts],i)=>
    withA(ctx,back?1:1-off,()=>arrive(ctx,x+M9_AW/2,y+M9_AH/2,t,back?tFix-0.2+i*0.12:t0,()=>{m9_app(ctx,x,y,M9_AW,M9_AH,sub,6+i);
      if(t<23.4+0.6)withA(ctx,sa,()=>m9_stamping(ctx,Math.min(t,23.4),x+M9_AW/2,y+M9_AH-54,ts,base,0.9));},{dy:16})));
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 4. Stopped at the door ---------- */
// the application, now one, its new step, and the three ways out of it, across the whole frame; then the chart of new duplicates per
// intake, in the middle; and in its place, a picture of the river in the dry season
const M9_AP={x:185,y:345,w:470,h:210},M9_SR={x:725,y:395,w:286,h:110},M9_TX=1105,
  M9_OUT=[[250,"found: add a role",1585],[450,"maybe: to Mei's queue",1540],[650,"new: a new person",1585]],M9_B4={x:370,y:110,w:1180,h:680},M9_PIC={x:380,y:130,w:1160};
// Linh's roles in 2026, in film 1's order and colours
const M9_LINH=["student","tutor","researcher","alumna"].map(r=>({col:WC_ROLE[r]}));
scene("entry",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tSea=w("search","searching"),tCre=w("search","creates a person"),tM=c("match"),tAdd=w("match","adds a role"),tLik=w("match","A likely one"),tQ=w("match","Mei's queue"),
    tF=c("fell"),tFif=w("fell","under fifty"),tStay=w("fell","stayed there"),tR=c("shape"),tSk=w("shape","the search keeps"),tMq=w("shape","Mei's queue digs");
  // the camera: from the applications as chapter 3 left them (still while the chapters cross over), out to the whole way in; a little in on
  // the chart, and on the river's picture
  m9_open(ctx,S,t,sc,"plain",[[0,1182,470,1.3],[0.8,960,540,1],[tF-0.5,960,520,1.06],[tR-0.4,960,505,1.08]],{z:0});
  const fa=1-fin(t,tF-0.5,0.7);
  if(fa>0.01)withA(ctx,fa,()=>{
    // the two applications come together as one, travelling with the camera
    const mv=easeCam(clamp((t-0.8)/1.6,0,1));if(mv<1)[M9_UG,M9_PG].forEach(([x,y],i)=>withA(ctx,1-clamp((mv-0.7)/0.3,0,1),()=>
      m9_app(ctx,lerp(x,M9_AP.x+(M9_AP.w-M9_AW)/2,mv),lerp(y,M9_AP.y,mv),M9_AW,M9_AH,["undergraduate","postgraduate"][i],6+i)));
    arrive(ctx,M9_AP.x+M9_AP.w/2,M9_AP.y+M9_AP.h/2,t,1.9,()=>m9_app(ctx,M9_AP.x,M9_AP.y,M9_AP.w,M9_AP.h,"undergraduate · postgraduate",14),{d:0.6,from:0.97});
    // it searches first; three ways lead out of it
    const ay=M9_AP.y+M9_AP.h/2;m9_arrow(ctx,M9_AP.x+M9_AP.w+6,ay,M9_SR.x-8,ay,clamp((t-tSea+0.2)/0.5,0,1));
    arrive(ctx,M9_SR.x+M9_SR.w/2,M9_SR.y+M9_SR.h/2,t,tSea,()=>m9_search(ctx,t,M9_SR.x,M9_SR.y,M9_SR.w,M9_SR.h,fin(t,tSea+0.3,0.4)*(1-fin(t,tCre+1.2,0.6))+0.6*fin(t,tM-0.4,0.3)*(1-fin(t,tQ+0.6,0.5))),{d:0.7,from:0.9});
    const ox=M9_SR.x+M9_SR.w+8,oy=M9_SR.y+M9_SR.h/2,ts=[tM-0.1,tLik-0.1,tQ+0.9];
    M9_OUT.forEach(([y,s,ex],i)=>{m9_arrow(ctx,ox,oy,M9_TX-12,y,clamp((t-ts[i])/0.6,0,1));arrive(ctx,M9_TX,y,t,ts[i]+0.4,()=>wc_tag(ctx,M9_TX,y,s),{dy:8});
      const tw0=tw(ctx,s,30,700)+40;m9_arrow(ctx,M9_TX+tw0+10,y,ex,y,clamp((t-ts[i]-0.8)/0.5,0,1));});
    // found: a role added to the person already known; maybe: a case for Mei; new: a new person, who's applying
    arrive(ctx,1635,250,t,tM+0.7,()=>wc_white(ctx,"linh",1635,381,0.42,M9_LINH.concat([{col:WC_ROLE.applicant,a:fin(t,tAdd,0.6)}]),{}),{d:0.8,from:0.96});
    arrive(ctx,1645,450,t,tLik+0.8,()=>m9_stack(ctx,1555,419,3),{dy:12});
    arrive(ctx,1635,650,t,tQ+1.5,()=>wc_white(ctx,"newcomer",1635,781,0.42,[{col:WC_ROLE.applicant}],{}),{d:0.8,from:0.96});});
  // the chart, with 2026's intakes under the limit; it gives way to the river
  const ca=1-fin(t,tR-0.3,0.6);if(t>tF-0.3&&ca>0.01)withA(ctx,ca,()=>arrive(ctx,M9_B4.x+M9_B4.w/2,M9_B4.y+M9_B4.h/2,t,tF-0.3,()=>
    m9_intakes(ctx,t,M9_B4,{rise:[clamp((t-tFif+0.2)/0.7,0,1),clamp((t-tStay+0.2)/0.7,0,1)],lim:clamp((t-tFif)/0.9,0,1)}),{dy:20,d:0.9,from:0.96}));
  // the river's shape keeps most of the gravel out of the inner channel; the diggers take out the rest
  const IW=M9_PIC.w,IH=Math.round(IW*M9_INSET.h/M9_INSET.w);
  arrive(ctx,M9_PIC.x+IW/2,M9_PIC.y+IH/2,t,tR-0.2,()=>{const at=m9_inset(ctx,t,M9_PIC.x,M9_PIC.y,IW,IH),[sx,sy]=at(1010,385),[qx,qy]=at(820,640);
    arrive(ctx,sx,sy,t,tSk,()=>wc_tag(ctx,sx,sy,"the search",{align:"center"}),{dy:8});arrive(ctx,qx,qy,t,tMq,()=>wc_tag(ctx,qx,qy,"Mei's queue",{align:"center"}),{dy:8});},{dy:20,d:0.9,from:0.95});
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 5. The steward's iron bars ---------- */
// Mei, before her window, facing her dashboard: her name, while she's new to the chapter. She stands far enough right that the camera,
// in on the dashboard, leaves her out whole rather than cutting her at the edge
const M9_MEI=[1700,1010,0.92];
function m9_mei(ctx,t,o){const [x,y,s]=M9_MEI;m9_person(ctx,"mei",x,y,s,Object.assign({pose:"stand",expr:"calm",t,flip:true},o));}
function m9_dash(ctx,t,o){wc_panel(ctx,M9_DB.x,M9_DB.y,M9_DB.w,M9_DB.h,{kind:"sheet",seed:44});}
scene("measures",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tPj=w("process","a project"),tEv=w("process","everyday work"),tIron=w("bars","iron bars"),tTut=w("roles","like a tutor"),
    tAct=w("roles","still active"),tT=c("tools"),tDbx=w("tools","Databricks");
  const ts=["dups","oldest","roles","source","requests"].map(c),te=ts.slice(1).concat([tT]);
  // the camera: Mei's office; in on the whole dashboard as the measures are named, each lit in turn (all six places in the frame, so nothing
  // is cut at its edge, and every line above the captions); out, for a moment, on all five
  m9_open(ctx,S,t,sc,"office",[[0,960,540,1],[ts[0]-0.6,800,510,1.22],[B-1.4,960,540,1]],{z:0});
  const [mx]=M9_MEI;arrive(ctx,mx,700,t,0.2,()=>m9_mei(ctx,t,{pose2:"explain",mix:fin(t,tIron-0.3,0.6)*(1-fin(t,ts[0]-0.8,0.6))}),{d:0.9,from:0.97});
  arrive(ctx,mx,350,t,0.7,()=>withA(ctx,1-fin(t,ts[0]-0.6,0.6),()=>m9_name(ctx,mx,296,"Mei Tanaka","registrar's office")),{dy:12});
  // the project that ended: the clean-up's board, pinned on her wall, finished; it gives way to the dashboard, which is everyday work
  if(t<tEv+0.2)arrive(ctx,M9_BD.x+M9_BD.w/2,M9_BD.y+M9_BD.h/2,t,tPj-0.2,()=>withA(ctx,1-fin(t,tEv-0.5,0.5),()=>{m9_board(ctx,t,{merge:1,count:1,months:1});
    ctx.save();ctx.translate(M9_BD.x+M9_BD.w-150,M9_BD.y+M9_BD.h-62);ctx.rotate(-0.05);const bw=tw(ctx,"finished on time",28,700)+28;wc_badge(ctx,-bw/2,0,"finished on time");ctx.restore();}),{dy:16,d:0.8,from:0.96});
  arrive(ctx,M9_DB.x+M9_DB.w/2,M9_DB.y+M9_DB.h/2,t,tEv-0.2,()=>{m9_dash(ctx,t);
    for(let i=0;i<5;i++){const [x,y,gw,gh]=m9_cell(i);arrive(ctx,x+gw/2,y+gh/2,t,tEv+0.4+i*0.15,()=>m9_gauge(ctx,t,i,{lit:fin(t,ts[i]-0.2,0.4)*(1-fin(t,te[i],0.6)),
      barIn:clamp((t-tIron-0.1-i*0.1)/0.5,0,1),ok:clamp((t-ts[i]-0.9)/0.8,0,1)}),{dy:14,d:0.7});}
    // what the third measure finds: a tutor whose contract ended, still active; ringed, then closed
    const [rx,ry]=m9_cell(5);arrive(ctx,rx+190,ry+90,t,tTut-0.2,()=>withA(ctx,1-fin(t,tT-0.9,0.5),()=>m9_tutor(ctx,t,rx+34,ry+40,{ring:clamp((t-tAct)/0.7,0,1),close:clamp((t-te[2]+0.1)/1.0,0,1)})),{dy:12});
    // the tools, in the sixth place
    arrive(ctx,rx+207,ry+90,t,tT,()=>m9_tool(ctx,rx+8,ry+10,398,160,"dbt","dbt",["writes and tests","the measures"]),{dy:12});
    arrive(ctx,rx+207,ry+262,t,tDbx,()=>m9_tool(ctx,rx+8,ry+182,398,160,"databricks","Databricks",["runs them nightly,","keeps them, shows them"]),{dy:12});},{dy:24,d:0.9,from:0.96});
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 6. Past its limit ---------- */
scene("alert",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tAl=w("monday","an alert"),tTw=w("monday","twelve days"),tW=c("waiting"),tBd=w("waiting","birth date"),tR=c("rang"),tDec=w("rang","decided"),tRea=w("rang","with its reason"),
    tB=c("blame"),tNot=w("blame","not at a person");
  // the camera: in on the dashboard and the alert as it comes in; across to the case it points at; out to Mei on the phone, and the gauge
  // back within its limit. The alert goes before the camera turns from it, so it's never cut at the frame's edge
  m9_open(ctx,S,t,sc,"office",[[0,960,540,1],[tAl-0.5,990,510,1.06],[tW-0.5,768,520,1.25],[tR-0.3,960,540,1]],{z:0});
  // the oldest case's wait: past its limit on Monday, back to two days once it's decided
  const t0=tAl-0.2,D=tTw+0.5-t0,up=ease(clamp((t-t0)/D,0,1)),dn=ease(clamp((t-tB+0.2)/1.0,0,1)),n=lerp(lerp(3,12,up),2,dn),tX=t0+0.6185*D,tBk=tB-0.2+0.3;
  m9_dash(ctx,t);for(let i=0;i<5;i++)m9_gauge(ctx,t,i,i===1?{n,g:{v:Math.round(n)+" days"},past:t<tBk?clamp((t-tX)/0.8,0,1):0,ok:t<tX?1:clamp((t-tBk-0.4)/0.8,0,1),lit:fin(t,tAl-0.3,0.5)*(1-fin(t,tW,0.6))}:{});
  const [rx,ry]=m9_cell(5);m9_tool(ctx,rx+8,ry+10,398,160,"dbt","dbt",["writes and tests","the measures"]);m9_tool(ctx,rx+8,ry+182,398,160,"databricks","Databricks",["runs them nightly,","keeps them, shows them"]);
  arrive(ctx,1580,198,t,tAl+0.3,()=>withA(ctx,1-fin(t,tW-0.4,0.5),()=>m9_alert(ctx,1320,100)),{dy:-20,d:0.7});
  // the case it points at comes forward over the dashboard, and goes back once it's decided; Mei, after the veil, stays clear on the phone
  const ca=fin(t,tW-0.3,0.5)*(1-fin(t,tB-0.4,0.6));m9_hush(ctx,0.72*ca);
  m9_mei(ctx,t,{pose2:"phone",mix:fin(t,tR-0.2,0.5)*(1-fin(t,tB,0.8)),expr:t>tRea?"relieved":"calm"});
  if(ca>0.01)withA(ctx,ca,()=>arrive(ctx,670,490,t,tW-0.3,()=>m9_case(ctx,t,220,300,{ring:clamp((t-tBd-0.2)/0.7,0,1),hr:clamp((t-tDec+0.3)/0.8,0,1),ts:tRea}),{dy:24,d:0.8,from:0.96}));
  arrive(ctx,1580,198,t,tNot-0.3,()=>wc_tag(ctx,1580,198,"a case, not a person to blame",{align:"center"}),{dy:8});
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 7. Proposed, then decided ---------- */
// the government's list comes in alone, in the middle (M9_GL0), and moves aside (M9_GL) for the university's list and the change the agent
// drafts; Leila comes in once the list's owner is named, far enough right to be whole in the frame by then
const M9_GL0=[620,200],M9_GL=[70,80],M9_UL=[70,480],M9_CG=[790,150],M9_LEI=[1700,1010,0.92];
scene("agent",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tL=c("list"),tAddOne=w("list","added one"),tD=c("draft"),tFee=w("draft","fee categories"),tChg=w("draft","a change to the list"),tO=c("owner"),
    tAdm=Math.max(w("owner","the admissions office"),tO+1.0),tApp=w("owner","approved it"),tDe=c("decides");
  // the camera: in on the government's list; out a little as it moves aside, for the university's list and the change; out to Leila
  m9_open(ctx,S,t,sc,"admissions",[[0,960,540,1],[tL-0.3,960,415,1.3],[tD-0.4,835,530,1.15],[tO-0.3,960,540,1]],{z:0});
  const [lx,ly,ls]=M9_LEI;arrive(ctx,lx,700,t,tO+0.6,()=>m9_person(ctx,"leila",lx,ly,ls,{pose:"stand",pose2:"explain",mix:fin(t,tAdm-0.1,0.6),expr:t>tApp+0.3?"relieved":"calm",t,flip:true}),{d:0.9,from:0.97});
  arrive(ctx,lx,330,t,tO+0.8,()=>withA(ctx,1-fin(t,tDe-0.4,0.6),()=>m9_name(ctx,lx,276,"Leila Haddad","admissions office")),{dy:12});
  const mv=easeCam(clamp((t-tD+0.4)/1.6,0,1)),gx=lerp(M9_GL0[0],M9_GL[0],mv),gy=lerp(M9_GL0[1],M9_GL[1],mv);
  arrive(ctx,gx+340,gy+185,t,tL+0.1,()=>m9_govList(ctx,t,gx,gy,{add:fin(t,tAddOne,0.3),tAdd:tAddOne}),{dy:18,d:0.8});
  arrive(ctx,M9_UL[0]+340,M9_UL[1]+165,t,tFee-0.3,()=>m9_uniList(ctx,t,M9_UL[0],M9_UL[1],{}),{dy:18,d:0.8});
  // the change comes in once the government's list is out of its way
  arrive(ctx,M9_CG[0]+310,M9_CG[1]+238,t,tD+1.0,()=>m9_change(ctx,t,M9_CG[0],M9_CG[1],{type:clamp((t-tD-1.3)/(tChg+0.4-tD-1.3),0,1),ok:clamp((t-tApp)/0.9,0,1)}),{dy:18,d:0.8});
  // once approved, the row joins the university's own list, in its place and lit as the list's newest row
  const yl=M9_UL[1]+156+3*44;arrive(ctx,M9_UL[0]+360,yl-8,t,tApp+0.9,()=>{wc_panel(ctx,M9_UL[0]+20,yl-30,640,44,{kind:"card",wash:WC_BADGE,washA:0.4,seed:77});
    wc_T(ctx,"graduate research visa",M9_UL[0]+40,yl,{w:700,size:28,col:WC_DARK});wc_T(ctx,"international fees",M9_UL[0]+640,yl,{w:700,size:28,align:"right",col:WC_DARK});},{dy:10});
  arrive(ctx,1100,702,t,tDe+0.1,()=>wc_tag(ctx,1100,702,"the agent proposes · the owner decides",{align:"center"}),{dy:8});
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 8. On the scorecard ---------- */
const M9_SCP=[580,110];
scene("scorecard",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tSc=w("yusuf","his scorecard"),tOther=w("yusuf","every other domain"),tTh=c("three"),tLim=w("three","limits"),tWay=w("three","a way to change them");
  // the camera: Yusuf's office; the scorecard, with Yusuf whole beside it; in on the person's row as its three things are named, once
  // he has lowered his hand (the camera leaves him out, rather than cutting him at the edge)
  m9_open(ctx,S,t,sc,"gov",[[0,960,540,1],[tSc-0.4,1000,520,1.1],[tTh-0.3,1200,440,1.4]],{z:0});
  arrive(ctx,300,700,t,0.2,()=>person(ctx,"yusuf",300,1010,0.95,{pose:"stand",pose2:"explain",mix:fin(t,tSc-0.3,0.6)*(1-fin(t,tTh-0.9,0.6)),expr:"calm",t}),{d:0.9,from:0.97});
  arrive(ctx,300,312,t,0.6,()=>withA(ctx,1-fin(t,tSc,0.6),()=>m9_name(ctx,300,258,"Yusuf Demir","data governance lead")),{dy:12});
  const [x,y]=M9_SCP;arrive(ctx,x+620,y+280,t,tSc-0.3,()=>m9_scorecard(ctx,t,x,y,{row:fin(t,tOther,0.3),tRow:tOther}),{dy:20,d:0.9,from:0.96});
  [[x+390,tTh,"an owner"],[x+720,tLim,"a limit"],[x+1030,tWay,"a way to change it"]].forEach(([tx,t0,s])=>arrive(ctx,tx,y+500,t,t0,()=>wc_tag(ctx,tx,y+500,s,{align:"center"}),{dy:8}));
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 9. Elsewhere ---------- */
const M9_BK={x:160,y:240,w:1600,h:580};
scene("elsewhere",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tBank=w("bank","A bank cleans up"),tBackT=w("bank","come back every time"),tO=c("one");
  // the camera: the industries; in on the bank's line; across to where it stays down
  m9_open(ctx,S,t,sc,"plainB",[[0,960,540,1],[tBank-0.3,960,540,1.06],[tO-0.3,1120,560,1.2]]);
  arrive(ctx,730,150,t,c("bank")+0.2,()=>m9_indChip(ctx,505,120,"health","a hospital's patients"),{dy:12});
  arrive(ctx,1200,150,t,c("bank")+0.6,()=>m9_indChip(ctx,995,120,"retail","a shop's suppliers"),{dy:12});
  // the line: three climbs, each ended by a clean-up three years on; then one check at entry, and it stays down
  const t9=tBackT+0.6,p=t<tO?(9.3/12)*clamp((t-tBank)/(t9-tBank),0,1):lerp(9.3/12,1,clamp((t-tO)/1.6,0,1)),tDrop=tBank+(3/9.3)*(t9-tBank);
  arrive(ctx,M9_BK.x+M9_BK.w/2,M9_BK.y+M9_BK.h/2,t,tBank-0.4,()=>{const G=m9_bankLine(ctx,t,M9_BK,p);
    arrive(ctx,G.X(3),M9_BK.y+M9_BK.h-30,t,tDrop,()=>wc_tag(ctx,G.X(3),M9_BK.y+M9_BK.h-30,"clean-up",{align:"center"}),{dy:8});
    const bp=clamp((t-tDrop-1.2)/0.6,0,1);if(bp>0){const yb=M9_BK.y+104,x0=G.X(3),x1=lerp(x0,G.X(6),ease(bp));ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=2.4;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(x0,yb+12);ctx.lineTo(x0,yb);ctx.lineTo(x1,yb);if(bp>=1)ctx.lineTo(x1,yb+12);ctx.stroke();ctx.restore();
      withA(ctx,clamp(bp*2-1,0,1),()=>wc_tag(ctx,(G.X(3)+G.X(6))/2,yb-30,"every three years",{align:"center"}));}
    arrive(ctx,G.X(10.7),G.Y(0.3),t,tO+0.2,()=>wc_tag(ctx,G.X(10.7),G.Y(0.3),"one check at entry",{align:"center"}),{dy:8});},{dy:20,d:0.9,from:0.96});
  m9_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 10. Kept ---------- */
// Linh, as the person, in February 2027: a tutor and an alumna, and now a student again, for her PhD; then the river in spring
const M9_LX=640,M9_LY=1010;
scene("kept",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tLs=w("phd","Linh starts"),tRole=w("phd","a new role"),tTh=w("count","thirty-eight"),tShe=w("count","She isn't"),tDu=w("spring","at Dujiangyan"),tEs=w("spring","every spring"),
    tRep=w("spring","repairs are done"),tLet=w("spring","let back in"),tLine=c("line");
  const k=fin(t,tDu-0.6,1.2);
  // the river, every spring: the repairs done, the tripods come down and the water is let back into the inner channel and out to the fields
  if(k>0.01){m9_open(ctx,S,t,sc,null,[[0,740,640,1.28],[tLet+0.8,960,540,1]]);m9_seasons(ctx,t,{dry:-20,close:-20,drain:-20,dig:1e9,open:tRep-0.1,fill:tLet-0.3,green:tLet+1.2});m9_close(ctx,S);}
  if(k<0.99)withA(ctx,1-k,()=>{m9_open(ctx,S,t,sc,"campus",[[0,960,540,1],[tLs-0.5,880,560,1.12],[tTh-0.6,1063,500,1.12]]);m9_hush(ctx,0.35);
    const BY=wc_bandY("linh",1.0,M9_LY,2);wc_link(ctx,M9_LX+66,BY,800,BY,WC_ROLE.student,{p:clamp((t-tRole-0.2)/0.4,0,1),a:0.85});
    arrive(ctx,M9_LX,M9_LY-300,t,0.4,()=>wc_white(ctx,"linh",M9_LX,M9_LY,1.0,[{col:WC_ROLE.tutor},{col:WC_ROLE.alumna},{col:WC_ROLE.student,a:fin(t,tRole,0.6)}],{}),{d:0.9,from:0.97});
    arrive(ctx,1035,BY,t,tRole+0.3,()=>wc_chip(ctx,800,BY-29,470,58,"student","Student","PhD, from Feb 2027",{}),{dy:10});
    // that intake's new duplicates, under the limit; Linh isn't one of them
    const bx=[1300,210,414,350];arrive(ctx,bx[0]+bx[2]/2,bx[1]+bx[3]/2,t,tTh-0.6,()=>m9_gauge(ctx,t,0,{box:bx,n:38*ease(clamp((t-tTh+0.4)/1.0,0,1)),
      g:{l:["new duplicates,","Feb 2027"],v:"38"},ok:clamp((t-tTh-0.8)/0.8,0,1)}),{dy:16,d:0.8});
    arrive(ctx,1507,640,t,tShe-0.1,()=>wc_tag(ctx,1507,640,"Linh: not one of them",{align:"center"}),{dy:8});
    m9_close(ctx,S);});
  wc_year(ctx,64,80,"February 2027 · the university",fin(t,0.3,0.6)*(1-fin(t,tDu-0.4,0.5)));wc_year(ctx,64,80,"every spring",fin(t,tEs,0.5));wc_paperOver(ctx,S);
  // the line, then carried down onto the end card, above the veil, landing where the card's own line fades in and takes it over
  const KL="Clean it once, and it decays. Keep it, and it lasts.",kl=fin(t,tLine-0.1,0.6),ky=lerp(128,420,fin(t,B+0.3,1.1)),kg=kl*(1-fin(t,B+0.8,0.9));
  if(kg>0.01){setScreen(ctx,S);withA(ctx,kg,()=>{ctx.save();ctx.translate(960,ky-16);ctx.scale(1,0.2);const g=ctx.createRadialGradient(0,0,10,0,0,700);
    g.addColorStop(0,rgba(WC_PAPER,0.94));g.addColorStop(0.7,rgba(WC_PAPER,0.7));g.addColorStop(1,rgba(WC_PAPER,0));ctx.fillStyle=g;ctx.fillRect(-700,-700,1400,1400);ctx.restore();});}
  wc_end(ctx,S,t,B+0.8,"Kept, not cleaned",KL,"Film 9 of 9");
  if(kl>0.01&&t<B+2.4){setScreen(ctx,S);withA(ctx,kl,()=>wc_T(ctx,KL,960,ky,{w:700,size:48,align:"center",col:WC_DARK}));}});
