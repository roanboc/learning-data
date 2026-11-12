/* ===== One language, kept: scenes =====
   Eight chapters, as in ../script.md. Chile in 1972, in lamp-light, a table of four pictures the camera glides along: the factories'
   numbers coming in to Santiago by telex, once a day (A); two factories that count workers absent two ways, then one definition for
   every factory's model (B); the operations room as it was designed, every factory shown with the same icons (C); and the daily report,
   written at CORFO and taken by hand to the presidential palace (D). Then the utility, one room: the app team's change and the glossary
   (U); the repository, to U's right (R); names with parts, to R's right (N); the industry's reference model, above N (Mo); a few
   principles, to Mo's left (Pr); a decision record, to Pr's left (De), above U, where the camera comes back for the change kept; and
   the data practice on the map, under U (Mp). Every move is to a neighbouring place, so the camera never crosses a third. At the end,
   Chile as it was: how far Cybersyn reached and what never ran (X0); the operations room dismantled and the documents carried out (X1);
   then the map again. Chile and the room dissolve into each other because the whole picture changes; in the room the camera glides from
   place to place, and whatever it passes is drawn as it was left there. Made to read on a phone (tools/legible.py): text is at least
   28 px in the frame. Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in
   step. */

// the camera in the room: keys are [time, x, y, zoom]; every move eases over 1.7 s
function d6_cam(ctx,S,t,keys){setScreen(ctx,S);return focus(ctx,t,keys,1.7);}
// where Chile's pictures start, and each place in the room: its top-left corner
const D6_CB=1920,D6_CC=3840,D6_CD=5760;
const D6_U=[0,1110],D6_R=[1920,1110],D6_N=[3840,1110],D6_MO=[3840,0],D6_PR=[1920,0],D6_DE=[0,0],D6_MP=[0,2220];
// a camera key centred on a place
function d6_k(t,P){return[t,P[0]+960,P[1]+540,1.0];}
// tags, each [words, x, y, colour, a, align]
function d6_tags(ctx,L){(L||[]).forEach(([s,x,y,c,q,al])=>{if(q>0.01)withA(ctx,q,()=>tag(ctx,x,y,s,c,{align:al||"center",size:28}));});}

/* ---------- Chile, 1972 ---------- */
// A: the map, its telex lines to Santiago; the telex there, and the strips torn from it; Cybersyn's team. o.map: daChile's options;
// o.telex: [a, paper, typing]; o.strips: [p, a]; o.card, o.sil (0..1)
function d6_pA(ctx,t,o){o=o||{};daChile(ctx,330,130,740,o.map||{});
  if(o.telex)daTelex(ctx,800,860,1.0,{a:o.telex[0],paper:o.telex[1],t,typing:o.telex[2]?1:null});
  if(o.strips)d6_strips(ctx,1120,260,o.strips[0],o.strips[1]);
  d6_card(ctx,1120,110,0,"Cybersyn's team","in Santiago, by telex, once a day",o.card||0);
  daSil(ctx,1760,866,300,{a:o.sil||0,dir:-1});}
// B: two factories and their sheets; the one definition over them. o.f (0..1) the factories; o.dim (0..1) factory 31's windows going
// dark, a factory in trouble; o.s12, o.s31: d6_count's options; o.q, o.ne (0..1): a question mark, then "not equal", between the sheets;
// o.def: [a, formula, same, hi]; o.tags
function d6_pB(ctx,t,o){o=o||{};ctx.save();ctx.translate(D6_CB,0);const fa=o.f==null?1:o.f;
  daFactory(ctx,300,430,0.7,{lit:0.85,t,a:fa,name:"factory 12",size:30,col:CY_LAMP});daFactory(ctx,1620,430,0.7,{lit:0.85-0.55*(o.dim||0),t:t+3,a:fa,name:"factory 31",size:30,col:CY_LAMP});
  d6_count(ctx,80,520,Object.assign({rot:0.012},o.s12||{a:0}));d6_count(ctx,1400,520,Object.assign({rot:-0.01},o.s31||{a:0}));
  withA(ctx,o.q||0,()=>T(ctx,"?",960,700,{w:800,size:80,align:"center",color:rgba(CY_LAMP,1)}));
  withA(ctx,o.ne||0,()=>T(ctx,"≠",960,712,{w:800,size:140,align:"center",color:rgba(D6_RED,1)}));
  if(o.def)d6_def(ctx,460,60,o.def[0],{f:o.def[1],same:o.def[2],hi:o.def[3]||0});
  d6_tags(ctx,o.tags);ctx.restore();}
// C: the operations room, as it was designed. o.room: d6_opsroom's options; o.tags
function d6_pC(ctx,t,o){o=o||{};ctx.save();ctx.translate(D6_CC,0);d6_opsroom(ctx,t,o.room||{});d6_tags(ctx,o.tags);ctx.restore();}
// D: the daily report, written at CORFO, then taken to the presidential palace: o.rep: d6_report's options, and m (0..1) its move from
// CORFO's side to the palace's; o.corfo (0..1); o.palace: [a, label]
function d6_pD(ctx,t,o){o=o||{};ctx.save();ctx.translate(D6_CD,0);
  d6_card(ctx,120,700,0,"written every day at CORFO","from numbers across the country",o.corfo||0);
  if(o.palace)d6_palace(ctx,1240,690,o.palace[0],o.palace[1]);
  const r=o.rep||{a:0},m=r.m||0,k=m<=0?0:m>=1?1:spring(m*1.15);d6_report(ctx,lerp(160,660,k),lerp(200,150,k),Object.assign({},r,{rot:lerp(-0.02,0.015,k)}));
  d6_tags(ctx,o.tags);ctx.restore();}

/* ---------- U: the app team's change and the glossary ---------- */
const D6_CHX=60,D6_CHY=110,D6_GLX=868,D6_GLY=110;
// o.ch: d6_change's options; o.gl: d6_gloss's; o.q(i) (0..1) a question mark by the glossary's row i; o.who: [p, a, hi0], everyone who
// signs in; o.rev (0..1) the data team's chip under the change; o.tk: [a, own, hi] the ticket; o.tags
function d6_pU(ctx,t,o){o=o||{};ctx.save();ctx.translate(D6_U[0],D6_U[1]);
  d6_change(ctx,D6_CHX,D6_CHY,Object.assign({h:560},o.ch||{a:0}));d6_gloss(ctx,D6_GLX,D6_GLY,Object.assign({w:1012},o.gl||{a:0}));
  if(o.q)D6_MEAN.forEach((m,i)=>{const q=o.q(i);if(q>0.01)withA(ctx,q,()=>T(ctx,"?",854,D6_GLY+182+i*92,{w:800,size:36,align:"center",color:rgba(D6_RED,1)}));});
  if(o.who)d6_who(ctx,1080,800,o.who[0],o.who[1],{hi0:o.who[2]||0});
  const rv=o.rev||0;if(rv>0.01)d6_chip(ctx,D6_CHX,720,"reviewed by the data team",{col:TECH,a:rv});
  if(o.tk)d6_ticket(ctx,1240,650,o.tk[0],{own:o.tk[1],hi:o.tk[2]||0});
  d6_tags(ctx,o.tags);ctx.restore();}
// U as chapter 2 leaves it
function d6_U2(){return{ch:{flag:1,checks:[["stopped in review, before a table",false,1,0],["a table can't be called just customer",false,1,1]]},gl:{fourth:1},who:[1,1,0]};}

/* ---------- R: the repository ---------- */
// o.repo: d6_repo's options; o.read (0..1): the review reading it, a dashed arrow back to the change; o.ines (0..1); o.T: the film's time
function d6_pR(ctx,t,o){o=o||{};ctx.save();ctx.translate(D6_R[0],D6_R[1]);d6_repo(ctx,380,250,Object.assign({w:940},o.repo||{a:0}));
  const rd=o.read||0;if(rd>0.01){arrowTo(ctx,366,480,40,480,D6_CODE,0.85*rd,{p:rd,dash:[9,7],lw:2.4,head:11});withA(ctx,rd,()=>T(ctx,"read by the review",200,452,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)}));}
  if((o.ines||0)>0.01)daPerson(ctx,"ines",1500,1010,0.95,{t:o.T,dir:-1,a:o.ines});
  ctx.restore();}
function d6_R2(T){return{repo:{a:1},read:1,ines:1,T};}

/* ---------- N: names with parts ---------- */
// o.top (0..1) the standard's name; o.parts: d6_parts's options; o.kinds: [a, hi]; o.once, o.lamp, o.never (0..1); o.old: [p, a]
function d6_pN(ctx,t,o){o=o||{};ctx.save();ctx.translate(D6_N[0],D6_N[1]);
  withA(ctx,o.top||0,()=>tag(ctx,960,70,"names built from parts, as ISO/IEC 11179 suggests",D6_CODE,{align:"center",size:28}));
  d6_parts(ctx,200,150,o.parts||{a:0});if(o.kinds)d6_kinds(ctx,200,570,o.kinds[0],{hi:o.kinds[1]||0});if(o.old)d6_oldName(ctx,200,700,o.old[0],o.old[1]);
  d6_note(ctx,1180,170,660,"defined once","every system uses it the same way",o.once||0);
  withA(ctx,o.lamp||0,()=>tag(ctx,1510,370,"as with social unease",CY_LAMP,{align:"center",size:28}));
  d6_verdict(ctx,1180,480,"customer: never a name on its own",false,o.never||0);
  ctx.restore();}
function d6_N3(){return{top:1,parts:{a:1,whole:1},kinds:[1,0],once:1,lamp:1,never:1,old:[1,1]};}

/* ---------- Mo: the industry's words ---------- */
// o.cim: d6_cim's options; o.words: d6_words's; o.ns: [a new system, a partner, the words they know] (0..1)
function d6_pMo(ctx,t,o){o=o||{};ctx.save();ctx.translate(D6_MO[0],D6_MO[1]);d6_cim(ctx,900,100,o.cim||{a:0});d6_words(ctx,100,100,900,o.words||{a:0});
  const ns=o.ns||[0,0,0];[["a new system",300],["a partner",440]].forEach(([s,y],i)=>{const q=ns[i];if(q<=0.01)return;archEl(ctx,1540,y,300,90,s,APPC,"component",{a:q,size:28});
    arrowTo(ctx,1532,y+45,1474,y+45,APPC,0.85*q,{p:q,lw:2.4,head:10});});
  withA(ctx,ns[2],()=>T(ctx,"words they already know",1690,600,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)}));ctx.restore();}
function d6_Mo4(){return{cim:{a:1},words:{a:1,m:i=>1,none:1},ns:[1,1,1]};}

/* ---------- Pr: a few principles ---------- */
// o.top (0..1) what a principle holds; o.card(i): d6_prin's options for principle i
const D6_PRXY=[[80,130],[1000,130],[80,480],[1000,480]];
function d6_pPr(ctx,t,o){o=o||{};ctx.save();ctx.translate(D6_PR[0],D6_PR[1]);withA(ctx,o.top||0,()=>tag(ctx,960,70,"a principle: a rule, why it holds, and what follows",D6_ENT,{align:"center",size:28}));
  D6_PRXY.forEach(([x,y],i)=>{const q=o.card?o.card(i):{a:1};if((q.a||0)<=0.01)return;d6_prin(ctx,i,x,y,q);});ctx.restore();}
function d6_Pr5(){return{top:1,card:i=>({a:1})};}

/* ---------- De: decisions, written down ---------- */
// o.files: d6_files's options; o.rec: d6_record's; o.meet (0..1) the meeting; o.tags
function d6_pDe(ctx,t,o){o=o||{};ctx.save();ctx.translate(D6_DE[0],D6_DE[1]);d6_files(ctx,80,130,o.files||{a:0});d6_meeting(ctx,400,700,o.meet||0);d6_record(ctx,780,110,o.rec||{a:0});d6_tags(ctx,o.tags);ctx.restore();}
function d6_De6(){return{files:{a:1,hi:1},rec:{a:1},tags:[["the next team reads why, not only what",400,820,TRUST,1]]};}

/* ---------- Mp: the data practice on the map ---------- */
// o.map: d6_map's options; o.year(i) (0..1) the first year's counts; o.tags
function d6_pMp(ctx,t,o){o=o||{};ctx.save();ctx.translate(D6_MP[0],D6_MP[1]);d6_map(ctx,t,o.map||{});if(o.year)d6_year(ctx,790,{p:o.year});d6_tags(ctx,o.tags);ctx.restore();}

/* ---------- Chile, as it was ---------- */
// X0: how far it reached, and what ran. o.pulse(i); o.card, o.beer (0..1); o.built: d6_built's options
function d6_pX0(ctx,t,o){o=o||{};daChile(ctx,330,130,740,{lines:1,dots:1,pulse:o.pulse});
  d6_card(ctx,700,120,0,"more than a hundred, by May 1973","a quarter of the nationalised industries, half their revenue",o.card||0);
  d6_built(ctx,700,300,o.built||{a:0});d6_note(ctx,700,680,1100,"Stafford Beer, later","the model couldn't adequately represent the changes of those years",o.beer||0);}
// X1: the operations room, dismantled, and the documents carried out. o.room: d6_opsroom's options; o.carry: [p, a]; o.tags
function d6_pX1(ctx,t,o){o=o||{};ctx.save();ctx.translate(1920,0);d6_opsroom(ctx,t,o.room||{});if(o.carry)d6_carry(ctx,640,866,o.carry[0],o.carry[1]);d6_tags(ctx,o.tags);ctx.restore();}

/* ---------- 1. The same words ---------- */
scene("same",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tU=c("utility"),toU=fin(t,tU-0.6,1.2);
  if(toU<0.99){ctx.save();ctx.globalAlpha=1-toU;d6_night(ctx,S,t);setScreen(ctx,S);
    const tSa=c("same"),tAb=c("absent"),tNe=c("needed"),tUn=c("unease"),tIc=c("icons"),tRe=c("report"),tDa=c("days");
    focus(ctx,t,[[0,960,540,1.0],[tSa-0.7,D6_CB+960,540,1.0],[tIc-0.7,D6_CC+960,540,1.0],[tRe-0.7,D6_CD+960,540,1.0]],1.7);
    // A: factories across Chile send their numbers to Cybersyn's team in Santiago, by telex, once a day
    if(t<tSa+2.4){const tFa=w("year","factories"),tTm=w("year","Cybersyn's team"),tTe=w("year","telex"),tOn=w("year","once a day");
      d6_pA(ctx,t,{map:{a:fin(t,0.3,1.0),lines:clamp((t-tFa+0.2)/2.0,0,1),pulse:i=>i%3===0&&t>tTe-0.4?((t-tTe+0.4)*0.3+hash(i,3))%1:0},
        telex:[fin(t,tTe-0.5,0.6),0.25+0.55*clamp((t-tTe+0.2)/3.0,0,1),t>tTe-0.2&&t<tTe+3.2],strips:[clamp((t-tOn+0.2)/2.2,0,1),fin(t,tOn-0.3,0.5)],
        card:fin(t,tTm-0.3,0.7),sil:fin(t,tTm,0.8)});}
    // B: one factory's number beside another's; counted two ways, the factory in trouble looks like the rest; one definition for all
    if(t>tSa-2.6&&t<tIc+2.4){const tOn=w("same","one factory's"),tAn=w("same","another's"),tMe=w("same","measured the same way");
      const tOw=w("absent","one way"),tAw=w("absent","another way"),tTr=w("absent","in trouble"),tCo=w("needed","compare"),tEf=w("unease","every factory's model"),tSh=w("unease","share of the workers"),tPa=w("unease","payroll");
      const df=fin(t,tPa-0.2,0.8);
      d6_pB(ctx,t,{dim:fin(t,tTr-0.2,1.0),
        s12:{a:fin(t,tOn-0.3,0.6),v:"4%",how:"every absence counted",howP:clamp((t-tOw+0.1)/1.0,0,1),def:df,v2:"4%"},
        s31:{a:fin(t,tAn-0.3,0.6),v:"4%",how:"absent without leave, only",howP:clamp((t-tAw+0.1)/1.0,0,1),def:df,v2:"11%",bad:fin(t,tPa+0.5,0.6)},
        q:fin(t,tMe-0.2,0.5)*(1-fin(t,tAw-0.2,0.4)),ne:fin(t,tAw+0.2,0.5)*(1-df),
        def:[fin(t,tEf-0.3,0.7),fin(t,tSh-0.2,0.6),fin(t,tEf-0.1,0.6),pulseAt(t,tPa+0.3,1.6)],
        tags:[["to compare them, and add them up",960,470,CY_LAMP,fin(t,tCo-0.3,0.6)*(1-fin(t,tEf-0.6,0.5))]]});}
    // C: the operations room, as it was designed: every factory shown with the same icons, for anyone to read
    if(t>tIc-2.6&&t<tRe+2.4){const tOp=w("icons","operations room"),tSi=w("icons","same icons"),tAn=w("icons","anyone");
      d6_pC(ctx,t,{room:{screens:fin(t,tOp-0.2,0.8),icons:clamp((t-tSi+0.3)/1.4,0,1)},
        tags:[["every factory, the same icons",960,100,CY_LAMP,fin(t,tSi-0.1,0.6)*(1-fin(t,tAn-0.5,0.4))],["anyone could read them",960,100,CY_LAMP,fin(t,tAn-0.1,0.6)]]});}
    // D: after the strike, one report a day at CORFO; taken by hand to the presidential palace
    if(t>tRe-2.6){const tOr=w("report","one report"),tEv=w("report","every day"),tHa=w("days","Taken by hand"),tPl=w("days","presidential palace"),tNp=w("days","national production"),tPc=w("days","points of crisis"),tFd=w("days","few days old");
      d6_pD(ctx,t,{corfo:fin(t,tEv-0.3,0.6),palace:[fin(t,tRe-0.7,1.2),fin(t,tPl-0.3,0.6)],
        rep:{a:fin(t,tOr-0.3,0.6),m:clamp((t-tHa+0.1)/1.6,0,1),bars:clamp((t-tNp+0.2)/1.2,0,1),pts:clamp((t-tPc+0.1)/1.0,0,1),old:clamp((t-tFd+0.5)/1.2,0,1)}});}
    setScreen(ctx,S);daYear(ctx,90,96,"Chile, 1972",fin(t,0.3,0.8)*(1-fin(t,tRe-1.0,0.5)));daYear(ctx,90,96,"Santiago, late 1972",fin(t,tRe+0.3,0.8)*(1-fin(t,tU-1.2,0.5)));
    ctx.restore();}
  // the utility: the home energy app's team opens a change, its first table called customer; the glossary, where customer already
  // means three things; the review catches it
  if(toU>0.01){ctx.save();ctx.globalAlpha=toU;wallBg(ctx,S,t);d6_cam(ctx,S,t,[d6_k(0,D6_U)]);ctx.globalAlpha=toU*(1-0.6*fin(t,B+0.8,0.8));  // dimmed under the title
    const tOp=w("utility","opens a change"),tCa=w("utility","called customer"),tTh=w("fourth","three things"),tFo=w("fourth","a fourth"),tCt=w("caught","catches"),tBe=w("caught","before it reaches");
    d6_pU(ctx,t,{ch:{a:fin(t,tOp-0.3,0.7),hi:pulseAt(t,tCa+0.2,1.4),flag:fin(t,tCt-0.1,0.5),checks:[["stopped in review, before a table",false,fin(t,tBe-0.2,0.6),0]]},
      gl:{a:fin(t,c("fourth")-0.2,0.7),sub:0,p:i=>fin(t,tTh-0.2+i*0.3,0.5),fourth:fin(t,tFo-0.2,0.6)}});
    ctx.restore();}
  vign(ctx,S);
  daTitle(ctx,S,t,B+1.0,"One language, kept","names, a reference model, principles and decisions, kept with the map","Film 6 of 6 · data architecture");});

/* ---------- 2. A fourth meaning ---------- */
scene("fourth",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tSi=c("signs"),tSt=c("storm"),tKe=c("keeps");
  wallBg(ctx,S,t);d6_cam(ctx,S,t,[d6_k(0,D6_U),d6_k(tKe-0.6,D6_R)]);
  const W4=["account holder","partner","tenant","grown-up child"].map(s=>w("signs",s)),whoP=W4.reduce((s,ti)=>s+fin(t,ti-0.2,0.5),0)/4;
  const tTa=w("read","take it"),tSn=w("storm","six names"),tMe=w("flag","three meanings"),tCb=w("flag","can't be called");
  // U: everyone who signs in; read as one of the other three; the January storm; the review flags it
  if(t<tKe+1.6)d6_pU(ctx,t,{ch:{flag:1,hi:pulseAt(t,tCb,1.4),checks:[["stopped in review, before a table",false,1,0],["a table can't be called just customer",false,fin(t,tCb-0.2,0.6),1]]},
    gl:{sub:fin(t,tMe-0.2,0.6),fourth:1,hiR:i=>pulseAt(t,tTa+0.1+i*0.5,1.1)},q:i=>fin(t,tTa+i*0.5,0.4)*(1-fin(t,tSt-0.4,0.5)),
    who:[whoP,fin(t,W4[0]-0.4,0.5),pulseAt(t,W4[0]+0.2,1.2)],
    tags:[["everyone who signs in to the app",1425,690,D6_RET,fin(t,tSi-0.2,0.6)],
      ["the January storm: six names for one thing, 180 households without a text",960,62,SOFT,fin(t,tSn-0.3,0.6)*(1-fin(t,tKe-1.0,0.5))]]});
  // R: what the data architecture keeps in the repository, with the map
  if(t>tKe-2.6){const K=[w("keeps","with the map"),w("keeps","names"),w("keeps","reference model"),w("keeps","principles"),w("keeps","decisions")].map(x=>Math.max(x,tKe+1.0));
    d6_pR(ctx,t,{repo:{a:fin(t,tKe+0.5,0.6),p:i=>fin(t,K[i]-0.2,0.5),hiR:i=>pulseAt(t,K[i]+0.1,1.0)},read:clamp((t-tKe-1.2)/1.0,0,1),ines:fin(t,tKe+0.7,0.8),T:sc.start+t});}
  vign(ctx,S);});

/* ---------- 3. Names with parts ---------- */
scene("names",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  wallBg(ctx,S,t);d6_cam(ctx,S,t,[d6_k(0,D6_R),d6_k(0.8,D6_N)]);
  if(t<2.8)d6_pR(ctx,t,d6_R2(sc.start+t));
  const tSt=w("parts","international standard"),tAh=w("thing","account holder"),tSa=w("about","start"),tSl=w("kind","short list"),tDa=w("kind","a date"),tWh=w("kind","Account holder start date");
  const tSu=w("once","social unease"),tDo=w("once","defined once"),tNo=w("never","never a name"),tCu=w("never","like customer"),tPr=w("old","premise"),tCp=w("old","connection point");
  const tp=[tAh,tSa,tDa];
  d6_pN(ctx,t,{top:fin(t,Math.max(tSt,2.6)-0.3,0.6),parts:{a:1,p:i=>fin(t,tp[i]-0.2,0.6),hiP:i=>pulseAt(t,tp[i]+0.2,1.2),whole:fin(t,tWh-0.2,0.7)},
    kinds:[fin(t,tSl-0.3,0.6),pulseAt(t,tDa+0.1,1.4)],once:fin(t,tDo-0.3,0.6),lamp:fin(t,tSu-0.2,0.6),never:fin(t,tCu-0.2,0.6),old:[clamp((t-tCp+0.6)/1.0,0,1),fin(t,tPr-0.5,0.6)]});
  vign(ctx,S);});

/* ---------- 4. The industry's words ---------- */
scene("model",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  wallBg(ctx,S,t);d6_cam(ctx,S,t,[d6_k(0,D6_N),d6_k(0.8,D6_MO)]);
  if(t<2.8)d6_pN(ctx,t,d6_N3());
  const tCi=w("industry","Common Information Model"),ci=[w("usage","usage point"),w("usage","service location"),w("party","a customer"),w("party","customer account")];
  const tOw=w("map","own words"),tCp=w("map","a connection point"),tAh=w("map","an account holder"),tNs=w("why","new system"),tPt=w("why","partner"),tKn=w("why","already know"),tNo=w("none","none of the three");
  d6_pMo(ctx,t,{cim:{a:fin(t,Math.max(tCi,2.6)-0.3,0.7),p:i=>fin(t,ci[i]-0.2,0.6)},
    words:{a:fin(t,tOw-0.3,0.6),p:i=>fin(t,tOw-0.2+i*0.25,0.5),m:i=>i===0?clamp((t-tCp+0.1)/0.9,0,1):i===1?clamp((t-tCp-0.7)/0.9,0,1):clamp((t-tAh+0.1)/0.9,0,1),
      hiW:i=>i===0?pulseAt(t,tCp+0.2,1.2):i===2?pulseAt(t,tAh+0.2,1.2):0,none:fin(t,tNo-0.3,0.6)},
    ns:[fin(t,tNs-0.3,0.6),fin(t,tPt-0.3,0.6),fin(t,tKn-0.3,0.6)]});
  vign(ctx,S);});

/* ---------- 5. A few principles ---------- */
scene("principles",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  wallBg(ctx,S,t);d6_cam(ctx,S,t,[d6_k(0,D6_MO),d6_k(0.8,D6_PR)]);
  if(t<2.8)d6_pMo(ctx,t,d6_Mo4());
  const tSr=w("few","short rule"),tWy=w("few","why it holds"),tWf=w("few","what follows"),tNm=c("name"),tHh=w("name","households"),tHm=c("home"),tEc=w("home","every copy"),tFl=c("flow"),tCt=w("flow","contract"),tPd=c("product"),tOb=w("product","owned by");
  d6_pPr(ctx,t,{top:fin(t,Math.max(c("few"),2.6)-0.2,0.6),card:i=>i===0?{a:fin(t,Math.max(tSr,2.7)-0.3,0.6),why:fin(t,tWy-0.2,0.6),so:fin(t,tWf-0.2,0.6),hi:pulseAt(t,tNm+0.3,1.6)+pulseAt(t,tHh,1.2)}:
    i===1?{a:fin(t,tHm-0.1,0.6),why:fin(t,tEc-0.4,0.6),so:fin(t,tEc-0.1,0.6),hi:pulseAt(t,tHm+0.3,1.4)}:
    i===2?{a:fin(t,tFl-0.1,0.6),why:fin(t,tCt-0.5,0.6),so:fin(t,tCt-0.2,0.6),hi:pulseAt(t,tFl+0.3,1.4)}:
    {a:fin(t,tPd-0.1,0.6),why:fin(t,tOb-0.5,0.6),so:fin(t,tOb-0.2,0.6),hi:pulseAt(t,tPd+0.3,1.4)}});
  vign(ctx,S);});

/* ---------- 6. Decisions, written down ---------- */
scene("decisions",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  wallBg(ctx,S,t);d6_cam(ctx,S,t,[d6_k(0,D6_PR),d6_k(0.8,D6_DE)]);
  if(t<2.8)d6_pPr(ctx,t,d6_Pr5());
  const tWd=w("record","written down"),tWh=w("record","what was decided"),tAw=w("record","and why"),tCo=w("record","considered"),tWo=w("record","who decided");
  const tSe=c("seven"),tCn=w("seven","customer is never"),tGr=w("seven","Grace"),tWy=c("why"),tEl=w("else","one definition"),tFo=c("follows"),tMt=w("outlives","meeting"),tNt=w("outlives","next team");
  const tk=[tWo,tAw,tCo,tFo],tv=[tGr,tWy+0.4,tEl,tFo+0.3];
  d6_pDe(ctx,t,{files:{a:fin(t,Math.max(tWd,2.6)-0.3,0.6),hi:fin(t,tSe-0.1,0.5)},
    rec:{a:fin(t,Math.max(tWh,2.8)-0.3,0.7),num:fin(t,tSe-0.2,0.5),head:fin(t,tCn-0.2,0.6),k:i=>fin(t,tk[i]-0.2,0.5),v:i=>fin(t,tv[i]-0.2,0.6),hiR:i=>pulseAt(t,tv[i]+0.2,1.4)},
    meet:fin(t,tGr-0.4,0.7)*(1-fin(t,tMt+0.2,1.4)),tags:[["the next team reads why, not only what",400,820,TRUST,fin(t,tNt-0.2,0.6)]]});
  vign(ctx,S);});

/* ---------- 7. Kept with every change ---------- */
scene("kept",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tEv=c("every"),tTi=c("ticket"),tTm=c("term"),tMp=c("map");
  wallBg(ctx,S,t);d6_cam(ctx,S,t,[d6_k(0,D6_DE),d6_k(0.8,D6_U),d6_k(tMp-0.9,D6_MP)]);
  if(t<2.8)d6_pDe(ctx,t,d6_De6());
  const tCh=w("every","checked against"),tDt=w("team","data team"),tIt=w("team","isn't theirs"),tTk=w("ticket","in a ticket"),tHr=w("ticket","head of retail"),tGf=w("ticket","glossary first");
  const tAu=w("built","app user"),tCp=w("built","check passes"),tSr=w("built","so does the review"),fx=fin(t,tAu-0.2,0.8);
  // U, as chapter 2 left it: the data team reviews; the app team asks retail in a ticket; the head of retail defines app user in the
  // glossary first; the table is built from it, and the check and the review pass
  if(t<tMp+1.6)d6_pU(ctx,t,{ch:{flag:1-fx,fix:fx,hi:pulseAt(t,Math.max(tCh,2.6),1.6),checks:[["stopped in review, before a table",false,1-fin(t,tCp-0.6,0.4),0],["a table can't be called just customer",false,1-fin(t,tSr-0.6,0.4),1],
      ["check passed: the name is in the glossary",true,fin(t,tCp-0.1,0.6),0],["review passed",true,fin(t,tSr-0.1,0.6),1]]},
    gl:{sub:1,fourth:1,appUser:fin(t,tGf-0.2,0.8),auHi:pulseAt(t,tTm+0.2,1.8)},who:[1,1-fin(t,tTi-0.4,0.6),0],rev:fin(t,tDt-0.3,0.6),tk:[fin(t,tTk-0.3,0.6),fin(t,tHr-0.2,0.6),pulseAt(t,tHr+0.2,1.2)],
    tags:[["every change, checked against what's kept with the map",960,62,TRUST,fin(t,Math.max(tEv+0.4,2.6),0.6)],["what a new term means: not theirs to decide",60,800,SOFT,fin(t,tIt-0.2,0.6),"left"]]});
  // Mp: app user joins retail's concepts on the map, with its owner and a link to decision 7
  if(t>tMp-2.6){const tAp=Math.max(w("map","app user"),tMp+0.8),tOw=w("map","its owner"),tDs=w("map","decision seven");
    d6_pMp(ctx,t,{map:{app:clamp((t-tAp+0.1)/0.9,0,1),appHi:pulseAt(t,tAp+0.3,1.4)+pulseAt(t,B+0.4,2.2),ownHi:pulseAt(t,tOw+0.1,1.4),link:fin(t,tDs-0.3,0.6)}});}
  vign(ctx,S);});

/* ---------- 8. Never finished ---------- */
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tNe=c("never"),tTx=c("telex"),tCo=c("coup"),tYe=c("year"),tUt=c("utility"),toU=fin(t,tUt-0.6,1.2);
  // Chile, as it was: how far it reached; what never ran; Beer, later; the coup, the room dismantled, the documents carried out
  if(toU<0.99){ctx.save();ctx.globalAlpha=1-toU;d6_night(ctx,S,t);setScreen(ctx,S);focus(ctx,t,[[0,960,540,1.0],[tCo-0.8,1920+960,540,1.0]],1.7);
    if(t<tCo+2.4){const tHu=w("chile","more than a hundred"),tRo=w("never","operations room"),tSi=w("never","simulator"),tBe=w("model","Beer");
      d6_pX0(ctx,t,{pulse:i=>i%3===0?(t*0.3+hash(i,3))%1:0,card:fin(t,tHu-0.3,0.7),built:{a:fin(t,tNe-0.2,0.6),p:i=>i===0?fin(t,tRo-0.2,0.6):i===1?fin(t,tSi-0.2,0.6):fin(t,tTx+0.1,0.6)},beer:fin(t,tBe-0.3,0.7)});}
    if(t>tCo-2.6){const tDi=w("coup","dismantled"),tCa=w("papers","carried"),tFu=w("papers","future"),tId=w("held","ideas held"),tMa=w("held","never had time");
      d6_pX1(ctx,t,{room:{gone:clamp((t-tDi-0.1)/2.4,0,1)},carry:[clamp((t-tCa+0.2)/4.6,0,1),fin(t,tCa-0.5,0.6)],
        tags:[["copies of its documents, kept for the future",960,100,CY_LAMP,fin(t,tFu-0.4,0.6)],["the ideas held",960,330,CY_LAMP,fin(t,tId-0.2,0.6)],["the practice never had time to mature",960,400,SOFT,fin(t,tMa-0.2,0.6)]]});}
    setScreen(ctx,S);daYear(ctx,90,96,"Chile, May 1973",fin(t,0.3,0.8)*(1-fin(t,tCo-1.0,0.5)));daYear(ctx,90,96,"11 September 1973",fin(t,tCo+0.3,0.8)*(1-fin(t,tUt-1.2,0.5)));
    ctx.restore();}
  // the utility: the map, never finished; the first year's counts
  if(toU>0.01){ctx.save();ctx.globalAlpha=toU;wallBg(ctx,S,t);d6_cam(ctx,S,t,[d6_k(0,D6_MP)]);ctx.globalAlpha=toU*(1-0.6*fin(t,B+0.6,0.8));  // dimmed under the end card
    const tNf=w("utility","never finished"),tNi=w("year","nine names"),tFd=w("year","fourteen decisions");
    d6_pMp(ctx,t,{map:{app:1,link:1},year:i=>fin(t,(i===0?tNi:tFd)-0.2,0.6),tags:[["never finished: it matures one change at a time",960,790,TRUST,fin(t,tNf-0.2,0.6)*(1-fin(t,tYe-0.5,0.4))]]});
    ctx.restore();}
  vign(ctx,S);
  daEnd(ctx,S,t,B+0.8,"One language, kept","Say what each word means once, and check every change against it.","Film 6 of 6");});
