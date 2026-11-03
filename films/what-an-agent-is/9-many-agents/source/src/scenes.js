/* ===== Many agents, and what emerges: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (places.js, nature.js, world.js, plan.js); what moves is drawn live in the shots of ag_shots, which glide the camera and dissolve
   from one place to the next. A place's tag is drawn in screen space inside its shot, so it dissolves with it. */

// draw in screen space, whatever the camera is doing (a tag, a card that stays put)
function ma_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// a pill that springs in at t0 and fades out at t1 (o: the pill's own options)
function ma_pillAt(ctx,x,y,text,t,t0,t1,o){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return;const k=ag_spr(t,t0,0.45);
  ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x,y,lerp(0.7,1,clamp(k,0,1.2)));ag_pill(ctx,x,y,text,o||{});ctx.restore();}
// a card (ag_textCard) that springs in at t0 and fades at t1
function ma_cardAt(ctx,x,y,w,words,t,t0,t1,o){o=o||{};const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.5));if(a<=0)return null;
  return ag_textCard(ctx,x,y,w,words,Object.assign({},o,{a,k:Math.min(1,ag_spr(t,t0,0.5))}));}

/* ---------------------------------------------------------------- 1 · A building that breathes */
scene("breathes",(ctx,S,t,sc)=>{
  const tPearce=wAt(sc,"place","Mick",-0.5),tShops=wAt(sc,"place","offices and shops");
  const tAC=wAt(sc,"cooled","air conditioning"),tImp=wAt(sc,"cooled","imported"),tExp=wAt(sc,"cooled","expensive"),tAll=wAt(sc,"cooled","running all day");
  const tBills=wAt(sc,"bills","high bills"),tRents=wAt(sc,"bills","high rents"),tChange=wAt(sc,"change","Something"),tOwners=wAt(sc,"change","The owners");
  const tMound=wAt(sc,"mounds","termite",-0.4),tCut=wAt(sc,"mounds","breathe like",-0.4),tWarm=wAt(sc,"rising","warm air"),tFresh=wAt(sc,"rising","fresh air");
  const tEG=wAt(sc,"built","Eastgate",-0.3),tParts=wAt(sc,"built","many simple"),tNight=wAt(sc,"nights","cool nights",-0.8),tFans=wAt(sc,"nights","fans pull"),tConc=wAt(sc,"nights","concrete");
  const tDay=wAt(sc,"day","By day",-0.4),tWarmD=wAt(sc,"day","warm air"),t48=wAt(sc,"day","forty-eight");
  const tOpen=wAt(sc,"opened","Eastgate",-0.4),tTenth=wAt(sc,"cost","tenth"),tEnergy=wAt(sc,"cost","far less"),tRentsL=wAt(sc,"rents","Rents"),tLet=wAt(sc,"rents","let before");
  const tUni=wAt(sc,"council","census",-1.6),tCensus=wAt(sc,"council","census"),tAsks=wAt(sc,"council","council asks"),tFac=wAt(sc,"council","each faculty");
  const tNotes=wAt(sc,"weeks","notes and emails"),tWeeks=wAt(sc,"weeks","two weeks"),tBudget=wAt(sc,"weeks","budgets");
  const tYear=wAt(sc,"shared","This year"),tMany=wAt(sc,"shared","many small"),tWork=wAt(sc,"shared","shared the work"),tDrafts=wAt(sc,"shared","drafts"),tNoon=wAt(sc,"shared","afternoon"),tMistake=wAt(sc,"shared","mistake");
  ag_shots(ctx,S,t,sc.dur,[
    // Harare, 1992: the street in the heart of the city, an empty plot behind a fence
    {at:0,place:"maHarare",keys:[[0,960,540,1],[0.3,1000,556,1.05]],d:5.6,draw:(c,tt)=>{ma_harareLife(c,tt,1.8);
      ma_scr(c,S,()=>ma_tag(c,"Harare, Zimbabwe · 1992",ag_in(tt,0.6,0.6)));}},
    // the drawing board: two blocks of offices over shops; then the usual way, pencilled onto it, and what it costs
    {at:tPearce,place:"maDesk",keys:[[0,880,470,1.24],[tAC-1.4,900,490,1.16],[tOwners-1.0,920,480,1.12]],d:2.0,draw:(c,tt)=>{
      const gone=ag_in(tt,tChange,1.2),body=MA_SKL.slice(0,-8),shops=MA_SKL.slice(-8);
      ma_sketch(c,body,tt,tPearce+0.1,2.6);
      const ush=clamp((tt-(tPearce+1.2))/2.4,0,1),tip=ma_pencil(c,shops,ush);
      ma_titleBlock(c,tt,tPearce+0.5,1);
      ma_pillAt(c,1180,250,"offices",tt,tShops-0.1,tChange);ma_pillAt(c,900,790,"shops",tt,tShops+0.6,tChange);
      // the plant: pencilled onto the left block's roof, its fans turning; dotted and still once things had to change
      const up=clamp((tt-(tAC-0.3))/1.8,0,1);let tip2=null;
      if(up>0){if(gone<1)tip2=ma_pencil(c,MA_PLANT,up,{a:1-gone});if(gone>0)ma_sketch(c,MA_PLANT,99,0,1,{a:lerp(0,0.55,gone),dash:[4,9]});
        ma_plantFans(c,tt,ag_in(tt,tAC+1.2,0.5)*(1-gone));}
      ma_sketch(c,MA_CRATE,tt,tImp-0.5,0.6,{a:1-gone});ma_stamp(c,343,657,"imported",ag_in(tt,tImp,0.3)*(1-gone),{size:28,col:[70,70,76]});
      ma_paperTag(c,470,250,300,262,"expensive",ag_in(tt,tExp,0.3)*(1-gone),{rot:0.06+Math.sin(tt*2.1)*0.03});
      const day=clamp((tt-tAll)/4.2,0,1);ma_sunArc(c,day,ag_in(tt,tAll-0.2,0.4)*(1-gone));ma_plantDial(c,day,ag_in(tt,tAC+1.0,0.4)*(1-gone));
      ma_papers(c,330,815,6,tt,{t0:tBills-0.1,a:1-gone});ma_pillAt(c,500,812,"bills",tt,tBills+0.2,tChange);
      [1,3,5].forEach((k,i)=>{const t0=tRents+i*0.18,tick=Math.min(3,Math.floor(Math.max(0,tt-t0-0.3)/0.28));
        ma_paperTag(c,460+k*150+55,656,460+k*150+4,668-tick*5,"rent",ag_in(tt,t0,0.3)*(1-gone),{arrow:Math.min(1,tick/3)});});
      ma_cardAt(c,980,130,540,{kick:"The owners asked",title:"A building that cools itself"},tt,tOwners,null,{kickCol:AG.mut});
      // the pencil: drawing the shop fronts, then the plant, then lifting away
      const pa=ag_io(tt,tPearce+0.9,tPearce+3.9,0.4),pb=ag_io(tt,tAC-0.5,tAC+1.8,0.4);
      if(pa>0)ma_pencilBody(c,tip.x,tip.y,tip.lift,pa);if(pb>0&&tip2)ma_pencilBody(c,tip2.x,tip2.y,tip2.lift,pb);}},
    // termite mounds: one on the savanna at dusk, then cut down the middle, with the idea of the time
    {at:tMound,place:"maMound",keys:[[0,900,560,1.0],[tMound+0.2,900,520,1.06]],d:2.6,draw:(c,tt)=>{
      ma_scr(c,S,()=>ma_tag(c,"Termite mounds · southern Africa",ag_in(tt,tMound+0.5,0.6)));}},
    {at:tCut,place:"maMoundCut",keys:[[0,900,520,1.06],[tFresh+1.2,900,500,1.3]],d:2.4,draw:(c,tt)=>{
      ma_moundIdea(c,tt,ag_in(tt,tFresh-0.3,1.6),ag_in(tt,tWarm-0.3,1.6));
      ma_pillAt(c,1080,150,"warm air",tt,tWarm+0.4,null,{col:[176,96,62]});ma_pillAt(c,1360,700,"fresh air",tt,tFresh+0.3,null,{col:[96,112,124]});
      const a=ag_in(tt,tFresh+1.0,0.5);if(a>0)ma_tag(c,"the idea, then",a,{x:1260,y:300,dashed:true});
      ma_scr(c,S,()=>ma_tag(c,"Termite mounds · southern Africa",1));}},
    // Eastgate cut through, carried across from the mound: its many simple parts light one by one
    {at:tEG,place:"maSection",keys:[[0,960,460,1.3],[tEG+0.3,960,540,1.0]],d:2.2,draw:(c,tt)=>{
      const f=ag_in(tt,tParts,0.5),fl=clamp((tt-tParts-0.6)/0.9,0,1),ch=clamp((tt-tParts-1.4)/0.9,0,1);
      ma_sectionLive(c,tt,{lit:[f,fl,ch],spin:ag_in(tt,tParts,0.8)*4});
      ma_pillAt(c,960,160,"Eastgate",tt,tEG+0.6,null,{size:36});
      ma_pillAt(c,450,824,"fans",tt,tParts+0.1);ma_pillAt(c,1800,560,"floors",tt,tParts+0.8);ma_pillAt(c,520,140,"chimneys",tt,tParts+1.5);}},
    // a cool night: the fans pull air in, and the concrete under the floors stores the cool
    {at:tNight,place:"maSectionNight",keys:[[0,960,540,1.0],[tNight+0.2,960,560,1.04]],d:4,draw:(c,tt)=>{
      ma_sectionLive(c,tt,{lit:[1,1,0],night:1,cool:ag_in(tt,tFans,1.4),glow:0.3+0.7*ag_in(tt,tConc,1.4)});
      ma_pillAt(c,450,824,"fans",tt,tFans);ma_pillAt(c,960,560,"concrete",tt,tConc+0.3);}},
    // by day: warm air rises out through the chimneys
    {at:tDay,place:"maSection",keys:[[0,960,560,1.04],[tDay+0.2,960,520,1.0]],d:3,draw:(c,tt)=>{
      ma_sectionLive(c,tt,{lit:[1,0.6,1],warm:ag_in(tt,tWarmD-0.2,1.4)});
      const n=Math.round(48*ag_eo(clamp((tt-tWarmD)/(t48-tWarmD+0.5),0,1)));if(tt>tWarmD)ma_pillAt(c,960,160,n+" chimneys",tt,tWarmD,null,{size:36});}},
    // 1996: the finished building, people at its shops, and what it gave
    {at:tOpen,place:"maEastgate",keys:[[0,960,540,1.0],[tOpen+0.3,980,530,1.04],[tLet-1.2,1320,640,1.32]],d:2.2,draw:(c,tt)=>{
      ma_eastgateLife(c,tt);for(let k=0;k<5;k++)ma_letSign(c,1,k,tt-(tLet+0.1+k*0.14));
      ma_scr(c,S,()=>{ma_tag(c,"Harare, Zimbabwe · 1996",ag_in(tt,tOpen+0.6,0.6));
        const L=[["cost to build: about a tenth less",tTenth],["energy: far less",tEnergy],["rents: lower",tRentsL],["let before it was finished",tLet]];
        const pa=ag_in(tt,tTenth-0.3,0.4),rows=L.reduce((n,l,i)=>n+ag_eo(clamp((tt-l[1]+0.3)/0.5,0,1))*(i?1:0),1);if(pa>0){ag_box(c,64,300,620,60+rows*80,22,{a:pa});
          L.forEach((l,i)=>{const a=ag_in(tt,l[1],0.4),y=372+i*80;if(a<=0)return;c.save();c.globalAlpha*=a;c.translate(-16*(1-ag_eo(clamp((tt-l[1])/0.5,0,1))),0);
            c.fillStyle=rgba(AG.ink,0.5);c.beginPath();c.arc(104,y-10,6,0,TAU);c.fill();ag_T(c,l[0],128,y,{w:700,size:32});c.restore();});}});}},
    // the university, April 2026: census day, the council's question, four faculties' counts
    // (under the title card's veil the scene fades, so only the title's words show)
    {at:tUni,place:"lab",keys:[[0,960,500,1.06],[tYear-0.3,960,540,1.0]],d:2.2,draw:(c,tt)=>{const f=1-ag_in(tt,sc.cues.breath+0.5,0.8);if(f<=0)return;c.save();c.globalAlpha*=f;
      ma_census(c,S,tt,{tUni,tCensus,tAsks,tFac,tNotes,tWeeks,tBudget,tYear,tMany,tWork,tDrafts,tNoon,tMistake});c.restore();}}
  ],0.8);
  ag_title(ctx,S,t,sc.cues.breath,"Many agents, and what emerges",null,"FILM 9 OF 9 · WHAT AN AGENT IS");
});

/* the census scene: the room with four faculties' cards; last year's two weeks; this year's small agents, one to each pile */
const MA_COL=[300,720,1140,1560];
function ma_census(c,S,tt,T){
  const yearOn=ag_in(tt,T.tYear,0.6),noon=ag_in(tt,T.tWork,2.2),AY=796;
  // the agents roll in on the floor first, so the room's light falls on them; each reads its pile, thinks, and a draft comes back
  MA_COL.forEach((x,i)=>{const at=T.tMany+i*0.22;ma_agent(c,x+70,AY,40,tt,{at,from:[-300-i*70,0],d:0.8,ph:i*0.9,think:ag_io(tt,T.tWork+0.3+i*0.12,T.tDrafts+0.4+i*0.15,0.4),core:0.6+0.4*ag_in(tt,T.tDrafts+i*0.15,0.4)});});
  ag_roomLight(c,1);
  // afternoon: the window's light warms and comes in low across the room
  if(noon>0){const g=c.createLinearGradient(W,0,W*0.2,H*0.6);g.addColorStop(0,"rgba(255,206,150,"+(0.16*noon)+")");g.addColorStop(1,"rgba(255,206,150,0)");c.fillStyle=g;c.fillRect(0,0,W,H);}
  ma_scr(c,S,()=>ma_tag(c,MA_UNI,ag_in(tt,T.tUni+0.6,0.6)));
  ma_cardAt(c,96,124,440,{kick:"Census day",title:"31 March 2026"},tt,T.tCensus-0.2,null,{kickCol:AG.mut});
  ma_cardAt(c,600,124,560,{kick:"The council asks",title:"Why did each count change?"},tt,T.tAsks,null,{kickCol:AG.mut});
  MA_COL.forEach((x,i)=>{ma_facCard(c,x-160,330,i,{w:320,a:ag_in(tt,T.tFac+i*0.15,0.4),k:Math.min(1,ag_spr(tt,T.tFac+i*0.15,0.5))});
    // last year: notes and emails pile up, and are read one faculty at a time, over two weeks
    const read=ag_in(tt,T.tWeeks+0.3+i*0.7,0.5);ma_papers(c,x,598,6,tt,{t0:T.tNotes+i*0.2,a:(1-read)*(1-ag_in(tt,T.tYear,0.3)),seed:31+i});
    // this year: the notes come again; each agent reads its own pile, and its draft rises from it
    const take=clamp((tt-(T.tWork+0.1+i*0.12))/1.1,0,1);ma_papers(c,x,598,6,tt,{t0:T.tYear+0.1+i*0.08,gap:0.08,a:yearOn,take,to:[x+70,AY],seed:51+i});
    const k=ag_spr(tt,T.tDrafts+i*0.18,0.55),u=ag_eo(clamp((tt-T.tDrafts-i*0.18)/0.7,0,1));if(u>0){c.save();c.translate(lerp(x+70,x,u),lerp(AY-40,588,u));c.scale(lerp(0.3,1,Math.min(1.05,k)),lerp(0.3,1,Math.min(1.05,k)));
      ma_draft(c,-125,-60,250,clamp(u*3,0,1),1);c.restore();}});
  // two weeks on the calendar, and the budgets set before the last pile was read
  const out=ag_in(tt,T.tYear-0.2,0.5);
  if(tt>T.tWeeks-0.4){const a=ag_in(tt,T.tWeeks-0.4,0.4)*(1-out);ma_calendar(c,1590,104,1+13*ag_sine(clamp((tt-T.tWeeks)/2.6,0,1)),a);
    if(a>0)ag_T(c,"two weeks",1675,326,{w:700,size:28,align:"center",col:AG.mut,a:a*ag_in(tt,T.tWeeks+2.6,0.4)});}
  if(tt>T.tBudget-0.3&&out<1){const a=1-out;c.save();c.globalAlpha*=a;ma_cardAt(c,1220,124,320,{kick:"Budgets",title:"next year"},tt,T.tBudget-0.3,null,{kickCol:AG.mut});
    ma_stamp(c,1492,236,"set",clamp((tt-T.tBudget-0.4)/0.35,0,1),{size:34});c.restore();}
  // and something no one asked them to find
  ma_pillAt(c,1600,200,"a mistake in the count",tt,T.tMistake,null,{icon:"warn",col:AG.amber});}

/* ---------------------------------------------------------------- 2 · Much from little */
scene("little",(ctx,S,t,sc)=>{
  const tPlan=wAt(sc,"plan","plan"),tMud=wAt(sc,"mud","Each drops"),tScent=wAt(sc,"mud","scent is strongest"),tRise=wAt(sc,"mud","pillars rise"),tArch=wAt(sc,"mud","arches"),tWork=wAt(sc,"mud","The work itself");
  const tAnts=wAt(sc,"ants","Ants",-0.5),tBridges=wAt(sc,"ants","two bridges"),tShort=wAt(sc,"ants","shorter"),tBuild=wAt(sc,"trails","scent builds"),tMemory=wAt(sc,"trails","shared memory");
  const tBirds=wAt(sc,"starlings","Starlings",-0.4),tSeven=wAt(sc,"starlings","six or seven"),tLead=wAt(sc,"starlings","No bird");
  const tEm=wAt(sc,"emergence","This is emergence"),tHolland=wAt(sc,"emergence","John Holland");
  ag_shots(ctx,S,t,sc.dur,[
    // inside a mound: each worker drops its pellet where the scent is strongest; pillars rise, then lean into an arch
    {at:0,place:"maMoundIn",keys:[[0,960,640,1.22],[tRise-1.6,960,540,1.0]],d:2.6,draw:(c,tt)=>{
      const u=0.62*ag_sine((tt-1.4)/(tRise-1.2))+0.38*ag_sine((tt-tRise-0.2)/(tWork-tRise+0.6));
      ma_pillars(c,u,tt,ag_in(tt,tScent-0.6,1.0));ma_builders(c,tt,u,ag_in(tt,0.2,0.8));
      ma_cardAt(c,1240,150,580,{title:"the work tells the next worker what to do"},tt,tWork,null);
      ma_scr(c,S,()=>ma_tag(c,"Termite mounds · southern Africa",ag_in(tt,0.8,0.6)));}},
    // ants, two bridges: both at first, then most on the shorter one, where the scent builds up faster
    {at:tAnts,place:"maAnts",keys:[[0,960,520,1.08],[tAnts+0.2,960,540,1.0]],d:2.4,draw:(c,tt)=>{
      const share=lerp(0.5,0.86,sstep(tBridges+0.6,tMemory-0.6,tt)),sh=sstep(tBridges,tMemory,tt),lo=0.35*sstep(tBridges,tShort,tt)*(1-0.5*sstep(tShort,tMemory,tt));
      ma_antsLive(c,tt,share,[sh,lo]);
      ma_pillAt(c,290,780,"nest",tt,tAnts+0.8);ma_pillAt(c,1650,760,"food",tt,tAnts+1.1);
      const ba=ag_in(tt,tShort-0.6,0.5);if(ba>0){ag_box(c,800,650,320,210,20,{a:ba});ma_bars(c,836,800,248,110,[share,1-share],["shorter","longer"],{a:ba,col:MA_GOLD.map(v=>v*0.78),alpha:0.9});}
      ma_scr(c,S,()=>ma_tag(c,"A laboratory · 1989",ag_in(tt,tAnts+0.6,0.6)));}},
    // starlings over Rome: a flock of thousands; one bird, and its seven nearest neighbours; no bird leads
    {at:tBirds,place:"maRome",keys:[[0,960,540,1.0],[tBirds+0.2,960,520,1.04]],d:5,draw:(c,tt)=>{
      const o={cx:820,cy:400,scale:1.25,lx:1480,ly:330};ma_flock(c,tt,o);ma_flockLens(c,tt,o,ag_in(tt,tSeven-0.5,0.9)*(1-ag_in(tt,tEm-0.2,0.6)));
      ma_pillAt(c,1480,570,"6 or 7 neighbours",tt,tSeven+0.2,tEm-0.2);ma_pillAt(c,820,700,"no leader",tt,tLead,tEm-0.2);
      // emergence, in plain words, and in Holland's
      const v=ag_in(tt,tEm-0.2,0.7);if(v>0){c.fillStyle="rgba(240,236,232,"+(0.42*v)+")";c.fillRect(0,0,W,H);}
      ma_cardAt(c,420,300,1080,{kick:"Emergence",title:"the whole does what no part planned"},tt,tEm,null,{kickCol:AG.mut});
      ma_cardAt(c,420,500,1080,{title:"“more comes out than was put in”",sub:"John Holland · Emergence · 1998"},tt,tHolland,null);
      ma_scr(c,S,()=>ma_tag(c,"Rome · winter 2005 to 2006",ag_in(tt,tBirds+0.6,0.6)));}}
  ],0.8);
});

/* ---------------------------------------------------------------- 3 · Where nobody can trace why */
scene("trace",(ctx,S,t,sc)=>{
  const tThought=wAt(sc,"neurons","how thought"),t86=wAt(sc,"neurons","eighty-six"),tMk=wAt(sc,"markets","In markets",-0.4),tNoPlan=wAt(sc,"markets","something no one");
  const tSold=wAt(sc,"potato","One sold"),tFast=wAt(sc,"potato","fast programs"),tPotato=wAt(sc,"potato","back and forth");
  const tMin=wAt(sc,"minutes","In minutes"),tFell=wAt(sc,"minutes","fell"),tSix=wAt(sc,"minutes","five to six"),tBack=wAt(sc,"minutes","came back"),tPenny=wAt(sc,"minutes","penny");
  const tMonths=wAt(sc,"argue","five months"),tArgue=wAt(sc,"argue","people still argue");
  ag_shots(ctx,S,t,sc.dur,[
    // neurons: signals pass from cell to cell; where a thought would form, a glow with no line that leads to it
    {at:0,place:"maNeurons",keys:[[0,960,540,1.12],[0.5,960,540,1.0]],d:8,draw:(c,tt)=>{ma_signals(c,tt,ag_in(tt,0.3,1.0));
      const g=ag_in(tt,tThought-0.3,1.4)*(1-ag_in(tt,tMk+0.2,0.5));if(g>0){const r=150+Math.sin(tt*1.3)*10,G=c.createRadialGradient(1060,470,0,1060,470,r);G.addColorStop(0,"rgba(255,248,226,"+(0.55*g)+")");G.addColorStop(1,"rgba(255,248,226,0)");
        c.fillStyle=G;c.fillRect(1060-r,470-r,r*2,r*2);ag_T(c,"?",1060,494,{w:800,size:64,align:"center",col:[250,246,236],a:g});}
      ma_pillAt(c,960,170,"86 billion",tt,t86,null,{size:36});}},
    // 6 May 2010: a calm line of prices; one program sells a huge order, whatever the price; fast programs pass contracts back and forth
    {at:tMk,place:"maTrading",keys:[[0,960,540,1.0],[tMin-0.8,960,480,1.05],[tMonths-1.2,960,540,1.0]],d:2.0,draw:(c,tt)=>{
      const u=lerp(0.02,0.775,sstep(tMk,tMin,tt))+0.04*ag_sine((tt-tFell+0.4)/1.4)+0.045*ag_sine((tt-tSix)/1.6)+0.14*sstep(tBack+0.4,tMonths,tt);
      ma_index(c,u,1);
      const pa=1-ag_in(tt,tMonths-0.6,0.6);ma_programs(c,tt,{seller:ag_in(tt,tSold,0.5)*pa,fast:ag_in(tt,tFast-0.6,0.8)*pa,heat:sstep(tFast,tPotato+1.2,tt)*(1-sstep(tBack,tBack+1.5,tt))});
      const C=MA_TR.chart,lx=C.x+C.w*0.815,ly=ma_indexY(-9.4);ma_cardAt(c,lx-700,ly-128,680,{title:"minus 5 to 6 percent, in minutes"},tt,tSix,tMonths-0.6,{tail:{side:"right",at:0.8,px:lx-12,py:ly-6}});
      ma_paperTag(c,C.x+C.w-40,C.y+C.h+6,C.x+C.w-210,C.y+C.h+40,"$0.01",ag_in(tt,tPenny-0.1,0.3)*(1-ag_in(tt,tMonths-0.6,0.5)),{rot:-0.05+Math.sin(tt*2)*0.03});
      // five months later, a report; and people still argue about why
      ma_cardAt(c,140,560,420,{kick:"Report",title:"30 September 2010"},tt,tMonths,null,{kickCol:AG.mut});
      [0,1,2].forEach(i=>{const x=660+i*400,a=ag_in(tt,tArgue+i*0.25,0.4);if(a<=0)return;ma_sprung(c,x+170,620,Math.min(1,ag_spr(tt,tArgue+i*0.25,0.5)),a,()=>{ag_box(c,x,560,340,130,20,{});
        c.fillStyle=rgba(AG.mut,0.3);rr(c,x+28,600,190,12,6);c.fill();rr(c,x+28,630,150,12,6);c.fill();ag_T(c,"?",x+290,650,{w:800,size:64,align:"center",col:AG.mut});});});
      ma_scr(c,S,()=>ma_tag(c,"United States · 6 May 2010",ag_in(tt,tMk+0.6,0.6)));}}
  ],0.8);
});

/* ---------------------------------------------------------------- 4 · Many agents */
scene("many",(ctx,S,t,sc)=>{
  const T={tLead:wAt(sc,"lead","a lead agent"),tSplit:wAt(sc,"lead","splits"),tHelp:wAt(sc,"lead","helpers"),tOwn:wAt(sc,"lead","own instructions"),
    tAnother:wAt(sc,"lead","another agent"),tChecks:wAt(sc,"lead","checks"),tBeat:wAt(sc,"beat","Such teams"),tTimes:wAt(sc,"beat","many times"),tStudy:wAt(sc,"study","Yet a"),
    tFail:wAt(sc,"study","failing"),tTog:wAt(sc,"together","together"),tIn:wAt(sc,"name","In"),tPaired:wAt(sc,"name","paired"),tLeaned:wAt(sc,"leaned","the group leaned"),
    tAlone:wAt(sc,"leaned","no agent"),tGroup:wAt(sc,"group","So testing"),tEnough:wAt(sc,"group","enough"),tTest:wAt(sc,"group","test the group")};
  ag_shots(ctx,S,t,sc.dur,[
    // crowds of a new kind, coming fast: more and more agents gather, and the camera draws back as the crowd grows
    {at:0,place:"lab",keys:[[0,960,720,1.5]],push:-0.2,draw:(c,tt)=>ma_mob(c,tt)},
    // a lead agent splits the job among helpers, and a checking agent checks what they find; then back to the whole wall for two findings
    {at:T.tLead-0.6,place:"lab",keys:[[0,960,648,1.25],[T.tChecks+1.3,960,540,1]],d:1.6,push:0,draw:(c,tt)=>ma_team(c,tt,T)},
    // together: the naming game, the group's lean, and the test of the group
    {at:T.tTog-0.7,place:"lab",keys:[[0,960,640,1.22]],push:0.02,draw:(c,tt)=>ma_game(c,S,tt,T)}],0.8);
});
// the crowd being built: the k-th agent appears at 1.0 + 6.0 (k / n)^0.55 s, growing from the floor where it stands with a small
// bounce, faster and faster; once there, a wave of work passes through the crowd, each band brightening, with a faint violet light
// round it, as the wave goes by
function ma_mob(c,tt){const n=MA_MOB.length-1;
  MA_MOB.forEach(p=>{const at=1.0+6.0*Math.pow(p.k/n,0.55),k=ag_spr(tt,at,0.9);if(k<=0)return;const r=p.r*k,y=p.y+p.r-r,w=Math.pow(Math.max(0,Math.sin(p.x/260+p.y/70-tt*2.6)),6)*ag_in(tt,at+0.6,0.8);
    if(w>0.03){const g=c.createRadialGradient(p.x,y,r*0.6,p.x,y,r*2.4);g.addColorStop(0,rgba(AG.violet,0.16*w));g.addColorStop(1,rgba(AG.violet,0));
      c.fillStyle=g;c.fillRect(p.x-r*2.4,y-r*2.4,r*4.8,r*4.8);}
    ma_agent(c,p.x,y,r,tt,{at:at-0.3,ph:p.ph,core:0.45+0.55*w,think:w*0.8});});}
// the team: where the lead agent, the three helpers and the checking agent stand
const MA_TEAM={lead:[420,782,60],helpers:[[760,806],[960,806],[1160,806]],check:[1500,786,48]};
function ma_team(c,tt,T){const L=MA_TEAM.lead,K=MA_TEAM.check;
  ma_agent(c,L[0],L[1],L[2],tt,{at:T.tLead-0.4,from:[-420,0],d:0.8,ph:0.4,think:ag_io(tt,T.tSplit-0.3,T.tHelp+0.8,0.4)});
  MA_TEAM.helpers.forEach((h,i)=>ma_agent(c,h[0],h[1],44,tt,{at:T.tHelp-0.4+i*0.16,from:[-180,60],d:0.7,ph:1+i,think:ag_io(tt,T.tOwn+0.2,T.tChecks+0.4,0.4)}));
  ma_agent(c,K[0],K[1],K[2],tt,{at:T.tAnother-0.3,from:[300,0],d:0.8,ph:2.2,ring:ag_sine((tt-T.tAnother)/0.9)});
  ma_pillAt(c,L[0],664,"lead agent",tt,T.tLead+0.1);ma_pillAt(c,960,700,"helper",tt,T.tHelp+0.4);ma_pillAt(c,K[0],664,"checking agent",tt,T.tAnother+0.3);
  // the job card, cut in three; each part flies to a helper as its own instructions
  if(tt<T.tSplit+0.2)ma_cardAt(c,280,420,280,{kick:"The job",title:"three parts"},tt,T.tLead+0.2,null,{kickCol:AG.mut});
  else MA_TEAM.helpers.forEach((h,i)=>{const u=ag_sine((tt-T.tSplit-0.2-i*0.18)/1.1),sep=ag_in(tt,T.tSplit,0.25)*(1-u),x=lerp(280+i*90,h[0]-80,u)+sep*(i-1)*10,y=lerp(420,560,u),w=lerp(100,160,u);
    ag_box(c,x,y,w,82,14,{edge:AG.violet,edgeA:0.5*u});c.fillStyle=rgba(AG.mut,0.32);rr(c,x+18,y+26,w-44,9,4.5);c.fill();rr(c,x+18,y+48,w-70,9,4.5);c.fill();});
  // what they find goes to the checking agent: two ticks in green, one in amber
  MA_TEAM.helpers.forEach((h,i)=>{const u=ag_sine((tt-T.tChecks+0.3-i*0.22)/1.0);if(u<=0)return;const x=lerp(h[0],K[0]-90,u),y=lerp(h[1]-70,436+i*66,u)-Math.sin(Math.PI*u)*60;
    ag_box(c,x,y,180,60,14,{});c.fillStyle=rgba(AG.mut,0.32);rr(c,x+18,y+25,96,9,4.5);c.fill();
    const v=ag_in(tt,T.tChecks+0.9+i*0.3,0.3);if(v>0){if(i===1)ag_warn(c,x+146,y+30,30,rgba(AG.amber,v));else ag_tick(c,x+146,y+30,26,rgba(AG.green,v),4.5);}});
  // better on hard research, at many times the computing; yet failing often
  const ca=ag_in(tt,T.tBeat,0.45);if(ca>0){c.save();c.globalAlpha*=ca;ag_box(c,110,120,780,290,22,{});ag_T(c,"TEAMS OF AGENTS",140,172,{w:700,size:28,ls:4,col:AG.mut});
    ag_T(c,"Hard research: better than one agent",140,226,{w:700,size:36});ma_meter(c,140,298,700,ag_sine((tt-T.tTimes+0.1)/1.6),1);c.restore();}
  const cb=ag_in(tt,T.tStudy,0.45);if(cb>0){c.save();c.globalAlpha*=cb;ag_box(c,1000,120,800,290,22,{edge:AG.amber,edgeA:0.7});ag_T(c,"2025 · 7 SYSTEMS",1030,172,{w:700,size:28,ls:4,col:AG.mut});
    ag_T(c,"failed on 41% to 87% of tasks",1030,226,{w:700,size:36});ma_range(c,1040,306,720,41,87,ag_sine((tt-T.tFail)/1.4),1);c.restore();}}
// the naming game: the 24 grow into two rows; each round they meet in random pairs (an arc between partners, a nudge towards each
// other) and a tile turns when an agent's name changes, until the whole group shows one name. Then the group's lean, and the test
function ma_game(c,S,tt,T){const D=0.8,T0=T.tPaired-0.3,rk=Math.floor((tt-T0)/D),inRound=rk>=0&&rk<8,ph=inRound?(tt-T0-rk*D)/D:0,meet=inRound?Math.sin(Math.PI*clamp(ph,0,1)):0,partner={};
  if(inRound)for(const [a,b] of MA_GAME.pairs[rk]){partner[a]=b;partner[b]=a;}
  const pos=i=>{const q=MA_ROWS[i];let x=q.x,y=q.y;if(partner[i]!=null){const o=MA_ROWS[partner[i]],d=Math.hypot(o.x-x,o.y-y)||1;x+=(o.x-x)/d*14*meet;y+=(o.y-y)/d*14*meet;}return[x,y,q.r];};
  if(meet>0){c.save();c.strokeStyle=rgba(AG.violet,0.6*meet);c.lineWidth=3.5;for(const [a,b] of MA_GAME.pairs[rk]){const A=pos(a),B=pos(b),ay=A[1]-A[2]-76,by=B[1]-B[2]-76,mx=(A[0]+B[0])/2,my=Math.min(ay,by)-90-Math.abs(A[0]-B[0])*0.24;
    c.beginPath();c.moveTo(A[0],ay);c.quadraticCurveTo(mx,my,B[0],by);c.stroke();}c.restore();}
  // the agents, back row first, each rolling in from its nearer side
  MA_ROWS.forEach((q,i)=>{const [x,y,r0]=pos(i),k=ag_spr(tt,T.tTog-0.5+Math.abs(q.x-960)/700*0.9+(i<12?0:0.08),0.9);if(k<=0)return;const r=r0*k;
    ma_agent(c,x,y+r0-r,r,tt,{at:T.tTog-1.5,ph:i*0.7,think:partner[i]!=null?meet*0.6:0});});
  // each agent's name tile, turning when its name changes; dimmed while the charts speak
  const ta=ag_in(tt,T.tPaired-1.4,0.6)*(1-0.55*ag_io(tt,T.tLeaned-0.3,T.tGroup-0.2,0.5));if(ta>0)MA_ROWS.forEach((q,i)=>{const [x,y,r]=pos(i),k=clamp(rk,-1,8),sw=T0+k*D+0.55*D;
    let f=1,name=MA_GAME.st[Math.max(0,Math.min(8,tt<sw?k:k+1))][i];if(rk>=8)name=MA_GAME.st[8][i];
    if(rk>=0&&rk<8){const prev=MA_GAME.st[k][i],next=MA_GAME.st[k+1][i];if(prev!==next){f=Math.abs(Math.cos(Math.PI*clamp((tt-sw+0.12)/0.24,0,1)));name=tt<sw?prev:next;}}
    c.save();c.translate(x,y-r-42);c.scale(Math.max(0.05,f),1);ma_tile(c,0,0,MA_NAMES[name],ta,null);c.restore();});
  // so testing each agent alone isn't enough: a frame round one agent, then round the whole group
  const one=MA_ROWS[17],oa=1-ag_in(tt,T.tEnough+0.3,0.5);if(oa>0){c.save();c.globalAlpha*=oa;ma_frame(c,one.x-62,736,124,170,ag_sine((tt-T.tGroup-0.1)/0.9),AG.blue);c.restore();}
  ma_frame(c,250,592,1420,318,ag_sine((tt-T.tEnough-0.4)/1.5),AG.blue);
  ma_scr(c,S,()=>{
    // the study: 24 agents, paired at random to agree on a name
    ma_cardAt(c,560,96,800,{kick:"2025 · 24 agents",title:"paired at random, to agree on a name"},tt,T.tIn,T.tLeaned-0.5,{kickCol:AG.mut});
    // the group leaned towards some names; no agent did alone
    const ga=ag_in(tt,T.tLeaned-0.2,0.5)*(1-ag_in(tt,T.tGroup-0.1,0.5));if(ga>0){c.save();c.globalAlpha*=ga;ag_box(c,150,60,700,380,22,{});ag_T(c,"THE GROUP",182,112,{w:700,size:28,ls:4,col:AG.mut});
      ma_nameChart(c,200,370,600,200,[0.58,0.12,0.9,0.16,0.1],1,{labels:true,u:ag_sine((tt-T.tLeaned)/1.2)});c.restore();}
    const sa=ag_in(tt,T.tAlone-0.4,0.5)*(1-ag_in(tt,T.tGroup-0.1,0.5));if(sa>0){c.save();c.globalAlpha*=sa;ag_box(c,1000,60,780,380,22,{});ag_T(c,"EACH AGENT ALONE",1032,112,{w:700,size:28,ls:4,col:AG.mut});
      for(let k=0;k<6;k++)ma_nameChart(c,1050+(k%3)*240,262+Math.floor(k/3)*140,190,80,[0.5,0.5,0.5,0.5,0.5],1,{alpha:0.45,u:ag_sine((tt-T.tAlone+0.2-k*0.06)/0.8)});c.restore();}
    ma_cardAt(c,660,290,600,{kick:"Test",title:"the whole group"},tt,T.tTest-0.1,null,{edge:AG.blue,kickCol:AG.blue});});}

/* ---------------------------------------------------------------- 5 · Agents on one board */
scene("board",(ctx,S,t,sc)=>{
  const T={tCounts:wAt(sc,"platform","counts come"),tSame:wAt(sc,"platform","the same way"),tReasons:wAt(sc,"platform","The reasons"),tWork:wAt(sc,"platform","work for agents"),
    tLead:wAt(sc,"helper","A lead agent"),tEach:wAt(sc,"helper","each faculty"),tRead:wAt(sc,"helper","read but not"),tBox:wAt(sc,"helper","sandbox"),
    tPins:wAt(sc,"pins","Each pins"),tSrc:wAt(sc,"pins","with its source"),tBoard:wAt(sc,"pins","shared board"),tReads:wAt(sc,"pins","reads what"),
    tCheck:wAt(sc,"checking","A checking"),tComp:wAt(sc,"checking","compares"),tTwo:wAt(sc,"pattern","Two things"),tThree:wAt(sc,"pattern","three faculties"),
    tSide:wAt(sc,"side","Side by side"),tSame31:wAt(sc,"side","the same thirty-one"),tMoved:wAt(sc,"side","moved"),tNoFac:wAt(sc,"side","no faculty"),
    tDrop:wAt(sc,"word","dropouts"),tOthers:wAt(sc,"word","The others"),tEvery:wAt(sc,"word","every draft"),
    tNone:wAt(sc,"left","None had left"),tFlag:wAt(sc,"left","checking agent flagged"),tStill:wAt(sc,"left","still studying"),
    tDrafted:wAt(sc,"decided","The agents drafted"),tClara:wAt(sc,"decided","Clara"),tFixed:wAt(sc,"decided","fixed the word"),tAppr:wAt(sc,"decided","approved"),
    tGot:wAt(sc,"faculty","got its faculty"),tTest:wAt(sc,"faculty","a new test"),tWithout:wAt(sc,"faculty","without an agent")};
  ag_shots(ctx,S,t,sc.dur,[
    // the table, then the room: helpers in their sandboxes, the board; close on the board for what emerged; Clara; the faculty fixed
    {at:0,place:"lab",keys:[[0,960,348,1.55],[T.tWork-0.9,960,540,1],[T.tTwo-0.6,1258,372,1.45],[T.tDrafted-0.5,1110,432,1.25]],d:1.8,push:0,
      draw:(c,tt)=>mb_room(c,S,tt,T)},
    // Jun at his desk: the new test, which needs no agent
    {at:T.tTest-0.6,place:"lab",keys:[[0,760,640,1.3]],push:0.03,draw:(c,tt)=>mb_jun(c,S,tt,T)}],0.8);
});
// where things are in the room for this chapter: the table of counts on the left of the wall, the reasons beside it, the board on the
// right; on the floor the lead agent, four helpers in their sandboxes and the checking agent. Slots are the drafts' places on the board
// (Arts and Education, Business, Engineering and IT, Health); c31 and flag the two cards that came from no one's job
const MB={tab:[56,110],tab0:[700,120],board:[660,58,1196,524],slot:[[684,84],[1068,84],[684,336],[1068,336]],c31:[1452,84],flag:[1452,336],
  lead:[260,806,58],help:[[560,812],[800,812],[1040,812],[1280,812]],check:[1660,806,50]};
// each faculty's reason, as its helper drafts it, and where it came from; how many left each faculty with no reason in the notes
const MB_REASON=[["more teacher trainees","notes"],["a new online MBA","email"],["more first-years","notes"],["fewer nursing places","email"]];
const MB_GONE=[0,9,13,9];
const mb_row=i=>MB.tab[1]+100+i*50;
// where the table is: in the middle of the wall at first, then on its left as the room opens
const mb_tab=(tt,T)=>{const u=ag_sine((tt-T.tWork+0.1)/1.4);return[lerp(MB.tab0[0],MB.tab[0],u),lerp(MB.tab0[1],MB.tab[1],u)];};
// the platform's table of counts, compact: 520 by 336 from (x, y), in blue, its gear turning; o.rows (0..1) how many rows show,
// o.hi[i] a soft blue band on row i (the checking agent comparing)
function mb_counts(c,x,y,t,o){o=o||{};const a=o.a==null?1:o.a,w=520;if(a<=0)return;ma_sprung(c,x+w/2,y+168,o.k==null?1:o.k,a,()=>{
  ag_box(c,x,y,w,336,20,{edge:AG.blue,edgeA:0.9});ag_T(c,"CENSUS COUNT",x+24,y+46,{w:700,size:28,ls:4,col:AG.blue});ma_gear(c,x+w-40,y+38,18,t*0.8,AG.blue);
  const rows=o.rows==null?1:o.rows;MA_FAC.forEach((f,i)=>{const ra=clamp(rows*4-i,0,1);if(ra<=0)return;const yy=y+100+i*50;c.save();c.globalAlpha*=ra;
    const hi=o.hi?o.hi[i]:0;if(hi>0){c.fillStyle=rgba(AG.blue,0.12*hi);rr(c,x+10,yy-34,w-20,46,10);c.fill();}
    ag_T(c,f[0],x+24,yy,{w:600,size:28});ag_T(c,ma_n(f[1]),x+404,yy,{w:800,size:28,align:"right"});ag_T(c,ma_sgn(f[2]),x+w-24,yy,{w:500,size:28,align:"right",col:AG.mut});c.restore();});
  c.strokeStyle=rgba(AG.blue,0.4);c.lineWidth=2;c.beginPath();c.moveTo(x+24,y+282);c.lineTo(x+w-24,y+282);c.stroke();
  if(rows>=1){ag_T(c,"Total",x+24,y+318,{w:700,size:28});ag_T(c,"18,412",x+404,y+318,{w:800,size:28,align:"right"});ag_T(c,"+454",x+w-24,y+318,{w:500,size:28,align:"right",col:AG.mut});}});}
// a sheet of notes or an email, small, at (x, y), scale s, turned rot
function mb_sheet(c,x,y,s,email,rot,a){if(a<=0)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.rotate(rot);c.scale(s,s);
  c.save();c.shadowColor="rgba(46,38,28,0.2)";c.shadowBlur=8;c.shadowOffsetX=-2;c.shadowOffsetY=3;c.fillStyle=email?"#F4F3F0":"#F1EBDA";c.fillRect(-38,-48,76,96);c.restore();
  if(email){c.fillStyle="rgba(60,70,80,0.18)";c.fillRect(-38,-48,76,18);c.strokeStyle="rgba(60,70,80,0.45)";c.lineWidth=2;c.beginPath();c.moveTo(-30,-44);c.lineTo(0,-34);c.lineTo(30,-44);c.stroke();}
  c.strokeStyle="rgba(70,70,76,0.35)";c.lineWidth=2.4;for(let l=0;l<5;l++){const ly=-24+l*13,lw=40+((l*11)%22);c.beginPath();c.moveTo(-28,ly);c.lineTo(-28+lw,ly);c.stroke();}c.restore();}
// the board: a pale linen panel in a thin oak edge, on the wall
function mb_board(c,a){if(a<=0)return;const [x,y,w,h]=MB.board;c.save();c.globalAlpha*=a;
  c.save();c.shadowColor="rgba(46,38,28,0.24)";c.shadowBlur=26;c.shadowOffsetX=AG.sdx;c.shadowOffsetY=12;c.fillStyle=rgba(AG_OAK.base,1);c.fillRect(x-8,y-8,w+16,h+16);c.restore();
  const g=c.createLinearGradient(x,y-8,x+w,y+h+8);g.addColorStop(0,rgba(AG_OAK.hi,1));g.addColorStop(1,rgba(AG_OAK.dark,1));c.fillStyle=g;c.fillRect(x-8,y-8,w+16,h+16);
  c.fillStyle="#ECE8E0";c.fillRect(x,y,w,h);ag_grain(c,x,y,w,h,2.2,909);c.restore();}
// a pin at (x, y)
function mb_pin(c,x,y){c.fillStyle="#8A847A";c.beginPath();c.arc(x,y,8,0,TAU);c.fill();c.fillStyle="rgba(255,255,255,0.6)";c.beginPath();c.arc(x+2,y-2,3,0,TAU);c.fill();}
// a helper's draft on the board, 368 wide from (x, y): its faculty, its reason, an orange chip naming its source. st.src (0..1) the chip;
// st.tick a green tick; st.edge; st.line {text, a, col, dots, dotsA, strike, fix, fixA, warn}: a line under them, with a dot for each
// student, struck through and replaced by st.line.fix; st.deco while it flies to the board, small (its words are decoration until it lands)
function mb_draft(c,x,y,i,st){const a=st.a==null?1:st.a,w=368,L=st.line||{a:0},la=clamp(L.a||0,0,1),h=154+46*sstep(0,0.5,la)+24*(L.dotsA||0),dc=st.deco?1:0;if(a<=0)return;
  ma_sprung(c,x+w/2,y+h/2,st.k==null?1:st.k,a,()=>{ag_box(c,x,y,w,h,18,{edge:st.edge||null,edgeA:st.edgeA==null?0.9:st.edgeA});mb_pin(c,x+w/2,y+12);
    ag_T(c,MA_FAC[i][0],x+24,y+48,{w:700,size:30,deco:dc});ag_T(c,MB_REASON[i][0],x+24,y+86,{w:500,size:28,deco:dc});
    const src=MB_REASON[i][1],sa=st.src==null?1:st.src;if(sa>0){const sw=ag_tw(c,src,{w:600,size:28})+40;c.save();c.globalAlpha*=sa;c.fillStyle=rgba(AG.orange,0.12);rr(c,x+24,y+102,sw,40,20);c.fill();
      c.strokeStyle=rgba(AG.orange,0.8);c.lineWidth=2;rr(c,x+24,y+102,sw,40,20);c.stroke();ag_T(c,src,x+44,y+132,{w:600,size:28,col:AG.orange,deco:dc});c.restore();}
    if(st.tick>0)ag_tick(c,x+w-42,y+122,26,rgba(AG.green,st.tick),4.5);
    if(la>0){const ly=y+184,fa=clamp(L.fixA||0,0,1),u1=sstep(0,0.55,fa),u2=sstep(0.35,1,fa),oy=ly-26*u1;c.save();c.globalAlpha*=sstep(0.3,1,la);
      // the struck line rises out of its place as the fix rises in, one after the other, so they never sit on each other
      c.save();if(fa>0){c.beginPath();c.rect(x+8,ly-38,w-16,52);c.clip();}
      ag_T(c,L.text,x+24,oy,{w:700,size:28,col:L.col||AG.amber,a:1-u1,deco:dc});
      if(L.strike>0){const tw=ag_tw(c,L.text,{w:700,size:28});c.strokeStyle=rgba(AG.ink,0.85*(1-u1));c.lineWidth=4;c.beginPath();c.moveTo(x+20,oy-10);c.lineTo(x+28+tw*clamp(L.strike,0,1),oy-11);c.stroke();}
      if(u2>0)ag_T(c,L.fix,x+24,ly+26*(1-u2),{w:700,size:28,col:AG.green,a:u2,deco:dc});
      if(L.warn>0)ag_warn(c,x+w-42,oy-10,30,rgba(AG.amber,L.warn*(1-u1)));c.restore();c.restore();
      if(L.dotsA>0){c.save();c.globalAlpha*=L.dotsA;c.fillStyle=rgba(AG.amber,0.9);for(let j=0;j<L.dots;j++){if(L.gone&&L.gone(j))continue;c.beginPath();c.arc(x+32+j*18,y+212,6,0,TAU);c.fill();}c.restore();}}});}
const mb_dotAt=(i,j)=>[MB.slot[i][0]+32+j*18,MB.slot[i][1]+212];
const mb_dot31=k=>[MB.c31[0]+32+(k%11)*18,MB.c31[1]+78+Math.floor(k/11)*18];
// the card that rose from the three drops: "31 STUDENTS", their dots, the joint degree, its faculty: none, and then Health
function mb_c31(c,x,y,st){const a=st.a==null?1:st.a;if(a<=0)return;const w=390,h=240,fx=clamp(st.fix||0,0,1),col=mix(AG.amber,AG.green,fx);
  ma_sprung(c,x+w/2,y+h/2,st.k==null?1:st.k,a,()=>{ag_box(c,x,y,w,h,18,{edge:col,edgeA:0.9});mb_pin(c,x+w/2,y+12);ag_T(c,"31 STUDENTS",x+24,y+52,{w:700,size:28,ls:4,col:col});
    if(st.deg>0)ag_T(c,"Health data (joint degree)",x+24,y+170,{w:700,size:28,a:st.deg});
    if(st.fac>0){const f={w:500,size:28},px=x+24+ag_tw(c,"faculty: ",f);ag_T(c,"faculty:",x+24,y+214,{w:500,size:28,col:AG.mut,a:st.fac});
      const u1=sstep(0,0.5,fx),u2=sstep(0.3,0.85,fx);c.save();c.beginPath();c.rect(px-4,y+180,w-(px-x)-10,46);c.clip();
      ag_T(c,"none",px,y+214-26*u1,{w:700,size:28,col:AG.amber,a:st.fac*(1-u1)});ag_T(c,"Health",px,y+214+26*(1-u2),{w:700,size:28,col:AG.green,a:st.fac*u2});c.restore();}});}
// the checking agent's flag: the 31's status, "studying" ticked green beside all of them; 390 wide
function mb_flag(c,x,y,st){const a=st.a==null?1:st.a;if(a<=0)return;const w=390,h=226,hi=st.hi||0;ma_sprung(c,x+w/2,y+h/2,st.k==null?1:st.k,a,()=>{ag_box(c,x,y,w,h,18,{edge:AG.green,edgeA:0.9});mb_pin(c,x+w/2,y+12);
  ag_T(c,"THE 31, NOW",x+24,y+50,{w:700,size:28,ls:4,col:AG.green});
  ["studying","inactive","withdrawn","completed"].forEach((s,i)=>{const yy=y+94+i*38,on=i===0;ag_T(c,s,x+62,yy,{w:on?700:500,size:28,col:on?AG.ink:AG.mut});
    if(on){if(hi>0)ag_tick(c,x+36,yy-9,24,rgba(AG.green,hi),4.5);ag_T(c,"31",x+w-24,yy,{w:800,size:28,align:"right",col:hi>0.5?AG.green:AG.ink});}
    else{c.fillStyle=rgba(AG.mut,0.4);c.beginPath();c.arc(x+36,yy-9,5,0,TAU);c.fill();ag_T(c,"0",x+w-24,yy,{w:500,size:28,align:"right",col:AG.mut});}});});}
// what a draft's line says at time tt: the drop with no reason (three faculties), then the copied word, struck and fixed
function mb_line(i,tt,T){const n=MB_GONE[i],src=3,order=[0,1,2],k=i===src?-1:order.indexOf(i===0?2:i===1?0:1);
  const tGone=T.tThree+[0,0,0.45,0.9][i],tWord=i===src?T.tDrop-0.25:T.tOthers+0.75+k*0.55,tFix=T.tFixed+0.15+[0.22,0.5,0,0.36][i];
  const word=ag_in(tt,tWord,0.35),gA=n?ag_in(tt,tGone,0.5):0,L={a:Math.max(gA,word),text:word>0.5?"31 dropouts":n+" gone, no reason",col:AG.amber,dots:n};
  if(n){const sw=ag_io(tt,tWord-0.35,tWord+0.35,0.35);L.a=Math.max(gA*(1-sw*0.9),word);}
  L.dotsA=n?ag_in(tt,tGone+0.2,0.4)*(1-ag_in(tt,T.tSame31+0.4,0.6)):0;
  L.gone=j=>tt>T.tSame31+mb_dotDelay(i,j);L.warn=ag_in(tt,T.tNone+i*0.12,0.3);L.strike=ag_sine((tt-tFix)/0.4);L.fix="moved to a joint degree";L.fixA=ag_in(tt,tFix+0.45,0.6);
  return{L,tGone,tWord,lit:n?ag_io(tt,tGone,T.tSame31+1.6,0.5):0};}
// when a dot leaves its draft for the 31 card, and which of the 31 it becomes
const mb_dotDelay=(i,j)=>(i===1?0:i===2?9:22)*0.035+j*0.035;
const mb_dotK=(i,j)=>(i===1?0:i===2?9:22)+j;
function mb_room(c,S,tt,T){const H=MB.help;
  // the table of counts, the same way every time; the reasons beside it, in words
  const hi=MA_FAC.map((f,i)=>ag_io(tt,T.tComp+i*0.45,T.tComp+i*0.45+1.0,0.2));
  const [tx,ty0]=mb_tab(tt,T);
  // the board on the wall, empty until the helpers pin their drafts
  mb_board(c,ag_in(tt,T.tWork+0.9,0.8));
  // (the table has done its part once the camera closes on the board, and is gone when it opens again)
  mb_counts(c,tx,ty0,tt,{k:Math.min(1,ag_spr(tt,0.5,0.6)),a:ag_in(tt,0.4,0.4)*(1-ag_in(tt,T.tTwo+0.3,0.7)),rows:ag_sine((tt-T.tCounts+1.0)/1.6),hi});
  ma_pillAt(c,tx+260,ty0+400,"the same way every time",tt,T.tSame,T.tWork-0.6,{col:AG.blue});
  MA_FAC.forEach((f,i)=>{const email=MB_REASON[i][1]==="email",t0=T.tReasons+i*0.22,go=ag_sine((tt-T.tEach-i*0.3)/0.9);if(go>=1)return;const py=ty0+90+i*50;
    for(let k=0;k<3;k++){const u=ag_spr(tt,t0+k*0.12,0.45);if(u<=0)continue;const bx=tx+560+k*8,by=py-k*3-(1-Math.min(1,u))*24,x=lerp(bx,H[i][0]+(k-1)*14,go),y=lerp(by,H[i][1]-80,go)-Math.sin(Math.PI*go)*140;
      mb_sheet(c,x,y,lerp(0.42,0.6,Math.sin(Math.PI*go))*(1-0.4*sstep(0.6,1,go)),k===1?!email:email,(k-1)*0.12*(1-go),1-sstep(0.75,1,go));}});
  ma_pillAt(c,tx+680,ty0+90-2,"notes",tt,T.tReasons+0.5,T.tWork+0.3);ma_pillAt(c,tx+692,ty0+240-2,"emails",tt,T.tReasons+0.9,T.tWork+0.3);
  // the drafts pinned to the board
  const rows=MA_FAC.map((f,i)=>mb_line(i,tt,T));
  MA_FAC.forEach((f,i)=>{const t0=T.tPins+i*0.4,u=ag_sine((tt-t0)/0.9);if(u<=0)return;const [sx,sy]=MB.slot[i],R=rows[i],cmp=hi[i];
    const st={k:u<1?1:Math.min(1,ag_spr(tt,t0+0.9,0.5)*0.15+0.85),src:ag_in(tt,T.tSrc+i*0.15,0.3),tick:ag_in(tt,T.tComp+i*0.45+0.35,0.3),line:R.L,
      edge:R.lit>0?AG.amber:cmp>0?AG.blue:null,edgeA:R.lit>0?0.9*R.lit:0.9*cmp};
    if(u<1){const fx=H[i][0]-184,fy=H[i][1]-120,x=lerp(fx,sx,u),y=lerp(fy,sy,u)-Math.sin(Math.PI*u)*90,k=lerp(0.3,1,u);c.save();ag_about(c,x+184,y+80,k);mb_draft(c,x,y,i,Object.assign(st,{deco:1}));c.restore();}
    else mb_draft(c,sx,sy,i,st);});
  ma_pillAt(c,1258,612,"the board",tt,T.tBoard,T.tTwo-0.6);
  // the dots: each drop's students leave their draft and become the 31
  const c31a=ag_in(tt,T.tSame31-0.4,0.4);mb_c31(c,MB.c31[0],MB.c31[1],{a:c31a,k:Math.min(1,ag_spr(tt,T.tSame31-0.4,0.5)),deg:ag_in(tt,T.tMoved,0.5),fac:ag_in(tt,T.tNoFac,0.5),fix:ag_in(tt,T.tGot-0.1,0.8)});
  for(const i of [1,2,3])for(let j=0;j<MB_GONE[i];j++){const d0=T.tSame31+mb_dotDelay(i,j),u=ag_sine((tt-d0)/0.8);if(u<=0)continue;const A=mb_dotAt(i,j),B=mb_dot31(mb_dotK(i,j)),x=lerp(A[0],B[0],u),y=lerp(A[1],B[1],u)-Math.sin(Math.PI*u)*60;
    c.fillStyle=rgba(mix(AG.amber,AG.green,ag_in(tt,T.tGot-0.1,0.8)),0.9*c31a);c.beginPath();c.arc(x,y,6,0,TAU);c.fill();}
  // the word flying from one draft to the others
  for(const i of [1,2,0]){const R=rows[i],t0=R.tWord-0.75,u=ag_sine((tt-t0)/0.75);if(u<=0||u>=1)continue;const A=[MB.slot[3][0]+24,MB.slot[3][1]+174],B=[MB.slot[i][0]+24,MB.slot[i][1]+174],x=lerp(A[0],B[0],u),y=lerp(A[1],B[1],u)-Math.sin(Math.PI*u)*80;
    c.save();c.globalAlpha*=sstep(0,0.15,u);ag_box(c,x-12,y-34,ag_tw(c,"31 dropouts",{w:700,size:28})+24,48,12,{edge:AG.amber,edgeA:0.8});ag_T(c,"31 dropouts",x,y,{w:700,size:28,col:AG.amber});c.restore();}
  // the checking agent's flag: none of them had left
  mb_flag(c,MB.flag[0],MB.flag[1],{a:ag_in(tt,T.tFlag-0.1,0.4),k:Math.min(1,ag_spr(tt,T.tFlag-0.1,0.5)),hi:ag_in(tt,T.tStill-0.2,0.4)});
  // approved: Clara's stamp across the drafts
  ma_stamp(c,1060,318,"approved",ag_in(tt,T.tAppr-0.05,0.35),{col:AG.green,rot:-0.04,size:32});
  // the floor: the lead agent hands each faculty to one helper; each helper is read-only, in a sandbox; the checking agent compares.
  // They leave the picture as the camera closes on the board, and fade as they go, so no edge of them shows at the frame's foot
  const fl=1-ag_in(tt,T.tTwo+0.3,0.7);if(fl>0){c.save();c.globalAlpha*=fl;
  const L=MB.lead;ma_agent(c,L[0],L[1],L[2],tt,{at:T.tWork-0.3,from:[-420,0],d:0.8,ph:0.4,think:ag_io(tt,T.tLead,T.tEach+1.6,0.4)});
  H.forEach((h,i)=>{const la=ag_io(tt,T.tEach+i*0.3-0.1,T.tEach+i*0.3+1.0,0.3);if(la<=0)return;c.save();c.strokeStyle=rgba(AG.violet,0.5*la);c.lineWidth=3;c.setLineDash([10,9]);
    c.beginPath();c.moveTo(L[0]+40,L[1]-50);c.quadraticCurveTo((L[0]+h[0])/2,Math.min(L[1],h[1])-170,h[0],h[1]-50);c.stroke();c.restore();});
  H.forEach((h,i)=>{const ta=ag_in(tt,T.tBox-0.3+i*0.1,0.4),drop=6*ag_sine((tt-T.tBox-i*0.1)/0.5);ag_sandbox(c,h[0],872,150,{depth:50,label:null,a:ta});
    ma_agent(c,h[0],h[1]+drop,42,tt,{at:T.tLead-0.2+i*0.18,from:[-160,40],d:0.7,ph:1+i,lock:ag_in(tt,T.tRead+i*0.15,0.3),
      think:Math.max(ag_io(tt,T.tEach+i*0.3+0.6,T.tPins+i*0.4,0.4),ag_io(tt,T.tReads+i*0.3,T.tReads+i*0.3+1.6,0.3))});});
  ma_pillAt(c,920,708,"read-only · sandbox",tt,T.tBox+0.1,T.tTwo-0.6,{icon:"lock",col:AG.blue});
  // each helper reads what the others pinned: a thin violet line from a helper to another's draft
  for(let k=0;k<8;k++){const hk=k%4,ck=(hk+1+(k>>2))%4,t0=T.tReads+k*0.3,la=ag_io(tt,t0,t0+1.3,0.25);if(la<=0)continue;const h=H[hk],[sx,sy]=MB.slot[ck];
    c.save();c.strokeStyle=rgba(AG.violet,0.45*la);c.lineWidth=2.5;c.setLineDash([8,8]);c.beginPath();c.moveTo(h[0],h[1]-48);c.lineTo(sx+184,sy+168);c.stroke();c.restore();}
  const K=MB.check;ma_agent(c,K[0],K[1],K[2],tt,{at:T.tCheck-0.3,from:[340,0],d:0.8,ph:2.2,ring:ag_sine((tt-T.tCheck)/0.9),think:ag_io(tt,T.tComp,T.tComp+2.6,0.3)});
  ma_pillAt(c,K[0],K[1]-96,"checking agent",tt,T.tCheck+0.2,T.tTwo-0.6);c.restore();}
  // Clara, in Planning: she reaches to the drafts, strikes the word, and approves
  const ca=ag_in(tt,T.tDrafted+0.2,0.6);if(ca>0){c.save();c.globalAlpha*=ca;const reach=ag_io(tt,T.tFixed-0.7,T.tAppr+0.9,0.6);
    ag_person(c,"clara",560,510,0.72,{t:tt,pose:{near:[2,14,"rest"]},pose2:{near:[33,130,"point"]},mix:reach,gaze:[4,-1]});c.restore();}
  ma_scr(c,S,()=>{ma_tag(c,MA_UNI,ag_in(tt,0.6,0.6)*(1-ag_in(tt,T.tWork-0.6,0.6)));
    ma_cardAt(c,36,96,320,{kick:"Planning",title:"Clara Jensen"},tt,T.tClara-0.1,T.tGot-2.2,{kickCol:AG.mut});});}
// Jun at his desk, as the series draws it (the desk across the bottom left, his screen on it): the new test, "every degree has a
// faculty", typed on his screen and run by the platform, passes; and it runs the same way every time, with no agent
const MB_JUN={card:[880,300],pill:[1110,586]};
function mb_jun(c,S,tt,T){const a=ag_in(tt,T.tTest-0.2,0.4),pass=ag_in(tt,T.tTest+1.2,0.5),[cx,cy]=MB_JUN.card;
  ag_desk(c,-60,1040,720,{depth:150});
  ag_person(c,"jun",250,720,0.76,{t:tt,cut:890,pose:"desk",gaze:[5,-2],smile:0.3+0.35*pass,nod:-0.035*ag_io(tt,T.tTest+1.2,T.tTest+2.6,0.4)});
  ag_screen(c,430,770,190,116,{stand:12,draw:(x,X,Y,W,H)=>{
    [0.5,0.72,0.46,0.64,0.38].forEach((l,k)=>{const u=clamp((tt-(T.tTest-0.9)-k*0.16)/0.3,0,1);if(u<=0)return;
      x.fillStyle=k===0?rgba(AG.blue,0.6):rgba(AG.ink,0.26);rr(x,X+14+(k?16:0),Y+16+k*17,(W-48)*l*u,8,4);x.fill();});
    if(pass>0)ag_tick(x,X+W-26,Y+H-24,22,rgba(AG.green,pass),4);}});
  ma_test(c,cx,cy,a,pass,Math.min(1,ag_spr(tt,T.tTest-0.2,0.5)));
  if(a>0){c.save();c.globalAlpha*=a;ma_gear(c,cx+460-40,cy+40,16,tt*0.8,AG.blue);c.restore();}
  ma_pillAt(c,MB_JUN.pill[0],MB_JUN.pill[1],"the same way every time",tt,T.tWithout-0.3,null,{col:AG.blue});}

// the board as Clara left it: every draft fixed, the 31 in Health, their status flagged, the reasons approved
function mb_final(c,a){if(a<=0)return;c.save();c.globalAlpha*=a;mb_board(c,1);
  const L={a:1,text:"31 dropouts",fix:"moved to a joint degree",fixA:1,strike:1,dots:0,dotsA:0,warn:0};
  MA_FAC.forEach((f,i)=>mb_draft(c,MB.slot[i][0],MB.slot[i][1],i,{tick:1,line:L}));
  mb_c31(c,MB.c31[0],MB.c31[1],{deg:1,fac:1,fix:1});c.fillStyle=rgba(AG.green,0.9);for(let k=0;k<31;k++){const [x,y]=mb_dot31(k);c.beginPath();c.arc(x,y,6,0,TAU);c.fill();}
  mb_flag(c,MB.flag[0],MB.flag[1],{hi:1});ma_stamp(c,1060,318,"approved",1,{col:AG.green,rot:-0.04,size:32});c.restore();}

/* ---------------------------------------------------------------- 6 · Is it alive? */
// the crowd of "Many agents", every agent there, breathing: a slow wave runs through them, each band brightening and dimming, each body
// swelling a little and glowing as it passes; off(p) (0..1) stills an agent, its band dark
function ms_crowd(c,tt,off){MA_MOB.forEach(p=>{const o=off?clamp(off(p),0,1):0,b=0.5+0.5*Math.sin(TAU*tt/3.6-p.x/420-p.y/260),w=Math.pow(b,3)*(1-o),r=p.r*(1+0.035*b*(1-o)),y=p.y+p.r-r;
  if(w>0.03){const g=c.createRadialGradient(p.x,y,r*0.6,p.x,y,r*2.4);g.addColorStop(0,rgba(AG.violet,0.14*w));g.addColorStop(1,rgba(AG.violet,0));c.fillStyle=g;c.fillRect(p.x-r*2.4,y-r*2.4,r*4.8,r*4.8);}
  ma_agent(c,p.x,y,r,tt,{ph:p.ph,core:(0.2+0.7*b)*(1-o),think:0.1*(1-o)});ms_dark(c,p.x,y,r,o);});}
// an agent's band gone dark: its light covered by the band's own matte black
function ms_dark(c,x,y,r,o){if(o<=0)return;const bw=r*1.3,bh=r*0.32,by=y-r*0.11,ih=bh-r*0.11;c.fillStyle=rgba(ms_hex(AG.visor),o);rr(c,x-bw/2+r*0.045,by-ih/2,bw-r*0.09,ih,ih/2);c.fill();}
const ms_hex=h=>typeof h==="string"&&h[0]==="#"?[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]:h;
// the cell's part being replaced while the camera watches: ma_cellLive's own cycle (3.2 s), timed so a worn part at the top right starts
// to fade at t0 and the new part, made inside, reaches its place 3.2 s later
function ms_cellPart(tt,t0){const C=MA_CELL,tc=tt-t0+32,cyc=Math.floor(tc/3.2),ph=(tc-cyc*3.2)/3.2,slot=(cyc*29)%C.n,an=slot/C.n*TAU,sx=C.cx+Math.cos(an)*C.r,sy=C.cy+Math.sin(an)*C.r,u=sstep(0.4,1,ph);
  return{tc,cyc,ph,sx,sy,nx:lerp(C.cx-30,sx,u),ny:lerp(C.cy+20,sy,u)};}
// soft arrows turning round the cell's middle, where parts are made: the making never stops
function ms_making(c,tt,a){if(a<=0)return;const C=MA_CELL,cx=C.cx-30,cy=C.cy+20,R=176;c.save();c.globalAlpha*=a;c.strokeStyle="rgba(150,116,86,0.55)";c.fillStyle="rgba(150,116,86,0.55)";c.lineWidth=7;c.lineCap="round";
  for(let k=0;k<3;k++){const a0=tt*0.35+k*TAU/3,a1=a0+1.25;c.beginPath();c.arc(cx,cy,R,a0,a1);c.stroke();const hx=cx+Math.cos(a1)*R,hy=cy+Math.sin(a1)*R,d=a1+Math.PI/2;
    c.beginPath();c.moveTo(hx+Math.cos(d)*20,hy+Math.sin(d)*20);c.lineTo(hx+Math.cos(d+2.4)*16,hy+Math.sin(d+2.4)*16);c.lineTo(hx+Math.cos(d-2.4)*16,hy+Math.sin(d-2.4)*16);c.closePath();c.fill();}c.restore();}
// a ring round a small thing being watched, in the cell's own brown
function ms_ring(c,x,y,r,a){if(a<=0)return;c.save();c.strokeStyle="rgba(120,88,60,"+(0.75*a)+")";c.lineWidth=4;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();c.restore();}
// the tortoise's trip, timed: it wanders from t0, slowing as its battery falls, until tLow; then it turns to the hutch's light and runs home
// by tHome. Returns [x, y, heading]
function ms_trip(tt,t0,tLow,tHome){const k=tt<tLow?0.747*ag_eo((tt-t0)/(tLow-t0)):lerp(0.747,1,ag_sine((tt-tLow-0.25)/(tHome-tLow-0.25)));return ma_tortoisePath(k);}
// the computer's design, as a small card: a rounded body of cells, skin cells pale and heart cells rose, laid out on a grid
const MS_DESIGN=["...XXXX...",".XXXXXXXX.","XXXXXXXXXX","XXXXXXHHHX",".XXXXHHHH.","...XXHH..."];
function ms_design(c,x,y,a,k){if(a<=0)return;const w=420,h=330;ma_sprung(c,x+w/2,y+h/2,k==null?1:k,a,()=>{ag_box(c,x,y,w,h,22,{});
  ag_T(c,"to a computer's",x+32,y+62,{w:700,size:36});ag_T(c,"design",x+32,y+106,{w:700,size:36});
  const cs=30,gx=x+(w-10*cs)/2,gy=y+142;MS_DESIGN.forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch===".")return;c.fillStyle=ch==="H"?"rgb(200,128,116)":"rgb(228,204,186)";
    c.fillRect(gx+i*cs+1.5,gy+j*cs+1.5,cs-3,cs-3);}));});}
// a scale for the microscope's view: "under a millimetre", over a bar a millimetre long at the view's scale
function ms_scale(c,x,y,a,k){if(a<=0)return;const w=420,h=196,L=340;ma_sprung(c,x+w/2,y+h/2,k==null?1:k,a,()=>{ag_box(c,x,y,w,h,22,{});
  ag_T(c,"under a millimetre",x+32,y+62,{w:700,size:36});c.strokeStyle=rgba(AG.ink,0.85);c.lineWidth=4;c.beginPath();c.moveTo(x+40,y+112);c.lineTo(x+40+L,y+112);
  c.moveTo(x+40,y+98);c.lineTo(x+40,y+126);c.moveTo(x+40+L,y+98);c.lineTo(x+40+L,y+126);c.stroke();ag_T(c,"1 mm",x+40+L/2,y+164,{w:600,size:28,align:"center",col:AG.mut});});}

// the plain switch on the wall, where the hand turns the crowd off
const MS_SW=[420,470];
scene("alive",(ctx,S,t,sc)=>{
  const T={tAre:wAt(sc,"seem","Are they"),tChile:wAt(sc,"chile","In Chile"),tSaid:wAt(sc,"chile","said a living"),tKeeps:wAt(sc,"chile","a cell keeps"),
    tAround:wAt(sc,"tortoise","Around"),tKept:wAt(sc,"tortoise","kept itself going"),tLow:wAt(sc,"tortoise","ran low"),tHomeW:wAt(sc,"tortoise","went home"),tRe:wAt(sc,"tortoise","recharge"),
    tFrog:wAt(sc,"frog","In twenty"),tComp:wAt(sc,"frog","a computer"),tTiny:wAt(sc,"frog","tiny bodies"),tSwim:wAt(sc,"frog","swim"),tHeal:wAt(sc,"frog","heal"),
    tYear:wAt(sc,"later","A year later"),tGath:wAt(sc,"later","gathered"),tNew:wAt(sc,"later","new ones"),
    tToday:wAt(sc,"none","Today"),tSelf:wAt(sc,"none","make themselves"),tRun:wAt(sc,"none","run only"),tWe:wAt(sc,"none","we run them")};
  const sCell=T.tChile-0.85,sTort=T.tAround-0.8,sScope=T.tFrog-0.75,sRoom=T.tToday-0.8;
  ag_shots(ctx,S,t,sc.dur,[
    // the room, and a crowd of agents breathing as one
    {at:0,place:"lab",keys:[[0,960,694,1.4]],push:0.04,draw:(c,tt)=>{ma_switch(c,MS_SW[0],MS_SW[1],1,1);ms_crowd(c,tt);}},
    // a cell, as a biology book draws it: it keeps making the parts that make it; the camera closes on one part being replaced
    {at:sCell,place:"maCell",keys:[[0,960,540,1],[T.tKeeps-0.4,1040,415,1.3]],d:1.6,push:0,draw:(c,tt)=>{
      const P=ms_cellPart(tt,T.tKeeps);ma_cellLive(c,P.tc,{});ms_making(c,tt,ag_in(tt,T.tKeeps-0.3,0.6));
      if(P.cyc===10){ms_ring(c,P.sx,P.sy,34,P.ph<0.45?ag_io(P.ph*3.2,0.05,1.3,0.25):0);if(P.ph>=0.4){c.save();const g=c.createRadialGradient(P.nx,P.ny,4,P.nx,P.ny,46);g.addColorStop(0,"rgba(255,246,228,0.9)");g.addColorStop(1,"rgba(255,246,228,0)");
        c.fillStyle=g;c.fillRect(P.nx-50,P.ny-50,100,100);c.restore();ms_ring(c,P.nx,P.ny,32,sstep(0.4,0.5,P.ph));}}
      ma_scr(c,S,()=>{ma_tag(c,"Santiago, Chile · 1972",ag_in(tt,T.tChile-0.2,0.5));
        ma_cardAt(c,1370,300,520,{kick:"Maturana and Varela",title:"a living thing makes itself"},tt,T.tSaid-0.1,null,{kickCol:AG.mut});});}},
    // near Bristol: the robot tortoise wanders, its battery falls, and it runs home to the hutch's light to recharge
    {at:sTort,place:"maBristol",keys:[[0,960,540,1]],push:0.03,draw:(c,tt)=>{
      const [x,y,ang]=ms_trip(tt,sTort,T.tLow,T.tRe-0.1),home=tt>T.tLow,dock=ag_in(tt,T.tRe,0.6),
        look=home?lerp(Math.sin(tt*2.2)*1.2,Math.atan2(MA_BR.hutch[1]-y,MA_BR.hutch[0]-x),ag_in(tt,T.tLow-0.2,0.5)):Math.sin(tt*2.2)*1.2;
      ma_tortoise(c,x,y,ang,{t:tt,look,charge:dock});
      const lv=tt<T.tRe?lerp(1,0.12,clamp((tt-sTort-0.4)/(T.tLow-sTort-0.4),0,1)):0.12+0.88*ag_in(tt,T.tRe+0.2,1.3),amb=1-sstep(0.3,0.45,lv),chg=ag_in(tt,T.tRe+0.2,0.4);
      ma_battery(c,x,y-214,lv,{col:mix(mix([92,94,100],AG.green,chg),AG.amber,chg>0.5?0:amb),a:ag_in(tt,sTort+0.5,0.5)});
      ma_scr(c,S,()=>{ma_tag(c,"Near Bristol · about 1950",ag_in(tt,T.tAround-0.2,0.5));
        ma_cardAt(c,64,140,460,{kick:"Grey Walter",title:"it kept itself going"},tt,T.tKept-0.1,null,{kickCol:AG.mut});});}},
    // a microscope's view: tiny bodies of frog cells, made to a computer's design, swim, and one heals; a year later, some gather
    // loose cells into new bodies
    {at:sScope,place:"maScope",keys:[[0,960,540,1]],push:0.03,draw:(c,tt)=>{
      const m1=ag_in(tt,T.tYear-0.3,0.8),cut=ag_in(tt,T.tSwim-0.1,0.25)*(1-ag_in(tt,T.tHeal,1.3));
      if(m1<1){c.save();c.globalAlpha*=1-m1;ma_scopeLive(c,tt,{cut});c.restore();}
      if(m1>0){c.save();c.globalAlpha*=m1;ma_scopeLive(c,tt,{mode:1,grow:clamp((tt-T.tGath+0.3)/(T.tNew+0.9-T.tGath+0.3),0,1)});c.restore();}
      // a thin line from the design to the body made to it
      const da=ag_in(tt,T.tComp,0.5)*(1-m1);if(da>0){const p=ma_swimAt(1,tt);c.save();c.strokeStyle=rgba(AG.ink,0.5*da);c.lineWidth=2.5;c.setLineDash([10,9]);
        c.beginPath();c.moveTo(1466,470);c.lineTo(p[0]+MA_SWIM[1][2]*0.95,p[1]);c.stroke();c.restore();}
      ma_scr(c,S,()=>{ma_tag(c,"United States · 2020 and 2021",ag_in(tt,T.tFrog-0.2,0.5));
        ms_design(c,1466,300,ag_in(tt,T.tComp-0.2,0.4)*(1-m1),Math.min(1,ag_spr(tt,T.tComp-0.2,0.5)));
        ms_scale(c,40,380,ag_in(tt,T.tTiny-0.1,0.4)*(1-m1),Math.min(1,ag_spr(tt,T.tTiny-0.1,0.5)));});}},
    // back in the room, the crowd breathing; the camera closes on a plain switch, a hand turns it off, and as the camera opens again the
    // crowd goes still, the dark spreading from the switch; the hand stays on it
    {at:sRoom,place:"lab",keys:[[0,960,694,1.4],[T.tSelf,560,470,2.2],[T.tWe+0.4,960,694,1.4]],d:1.4,push:0,draw:(c,tt)=>{
      const reach=ag_in(tt,T.tRun-0.35,0.9),press=ag_io(tt,T.tWe-0.14,T.tWe+0.1,0.12);
      ma_switch(c,MS_SW[0],MS_SW[1],1-ag_in(tt,T.tWe,0.12),1);
      ms_crowd(c,tt,p=>ag_in(tt,T.tWe+0.5+Math.max(0,p.x-MS_SW[0])/1500+(p.y-680)/900,0.3));
      ag_person(c,"jun",-170,432,1.5,{t:tt,pose:{near:[2,14,"rest"]},pose2:{near:[88+2*press,96,"point"]},mix:reach});
      ma_scr(c,S,()=>ma_pillAt(c,1100,300,"they run because we run them",tt,T.tWe+0.2,null));}}],0.8);
});

/* ---------------------------------------------------------------- 7 · What we don't know */
// the imagined night: the agent that starts the others, and the three it starts (x, y, r) on the floor; three drafts pinned to the wall
// (the middle one mended); the clock that turns through the night
const MC={par:[880,792,60],kids:[[600,810,48],[1150,804,52],[1400,818,44]],drafts:[[500,340],[810,340],[1120,340]],dw:280,clock:[1556,286,68]};
// the agents' state at tt: where each is, its size, and how its band glows; drawn twice, the body under the night and the light over it
function mc_agents(tt,T){const P=MC.par,out=[{x:P[0],y:P[1],r:P[2],at:-9,from:null,ph:0.3,core:0.7,think:Math.max(0.25,ag_io(tt,T.tAgents-0.3,T.tStart+1.4,0.4))}];
  MC.kids.forEach((k,i)=>{const at=T.tStart+0.15+i*0.32;if(tt<at)return;const g=ag_sine((tt-at)/0.9),r=k[2]*lerp(0.35,1,g);
    out.push({x:k[0],y:k[1]+k[2]-r,r,at,from:[P[0]-k[0],0],ph:1+i*1.3,core:0.65,think:0.3+0.15*Math.sin(tt*0.9+i*2)});});return out;}
// the night room: drafts on the wall, a clock turning through the night, agents starting agents, one mending another's draft
function mc_night(c,S,tt,T){const A=mc_agents(tt,T),mend=ag_in(tt,T.tMend+0.8,0.6);
  MC.drafts.forEach(([x,y],i)=>{ma_draft(c,x,y,MC.dw,1,1);mb_pin(c,x+MC.dw/2,y+12);
    if(i===1){c.fillStyle=rgba(mix(AG.amber,AG.green,mend),0.95);rr(c,x+24,y+90,MC.dw-120,10,5);c.fill();
      if(mend<1)ag_warn(c,x+MC.dw-40,y+94,28,rgba(AG.amber,1-mend));if(mend>0)ag_tick(c,x+MC.dw-40,y+92,26,rgba(AG.green,mend),4.5);}});
  const [cx,cy,cr]=MC.clock;ma_clock(c,cx,cy,cr,23+7*ag_sine((tt-T.tKeep+0.2)/(T.tMight-T.tKeep+0.6)),1);
  const P=A.map(a=>Object.assign(a,{p:ma_agent(c,a.x,a.y,a.r,tt,{at:a.at,from:a.from,d:0.9,ph:a.ph,core:a.core,think:a.think})}));
  ag_roomLight(c,1,{night:true});
  // the bands' light over the night; a violet pulse from the parent as each new agent starts
  P.forEach(a=>ag_model(c,a.p[0],a.p[1],a.r,{t:tt+a.ph,core:a.core,think:a.think,only:"light"}));
  MC.kids.forEach((k,i)=>{const t0=T.tStart+0.05+i*0.32,u=(tt-t0)/0.9;if(u<=0||u>=1)return;const [x,y,r]=MC.par;
    c.save();c.strokeStyle=rgba(AG.violet,0.55*(1-u));c.lineWidth=4;c.beginPath();c.arc(x,y,r*lerp(1.15,2.6,ag_eo(u)),0,TAU);c.stroke();c.restore();});
  // one agent mends another's draft: a thin violet line to it, and the wrong line turns green
  const la=ag_io(tt,T.tMend,T.tMend+2.0,0.35),k=P[2];if(la>0&&k){const [dx,dy]=MC.drafts[1];c.save();c.strokeStyle=rgba(AG.violet,0.7*la);c.lineWidth=3;c.setLineDash([10,9]);
    c.beginPath();c.moveTo(k.p[0]-8,k.p[1]-k.r*1.05);c.quadraticCurveTo(k.p[0]-40,dy+260,dx+MC.dw*0.62,dy+124);c.stroke();c.restore();}
  // what they might do: one good, one not; neither known
  ma_cardAt(c,370,150,480,{kick:"They might find",title:"what no person could"},tt,T.tFind-0.1,T.tKnow+0.2,{edge:AG.green,kickCol:AG.green});
  ma_cardAt(c,920,150,480,{kick:"Or settle on",title:"habits no person chose"},tt,T.tHabits-0.1,T.tKnow+0.2,{edge:AG.amber,kickCol:AG.amber});
  ma_scr(c,S,()=>{const g=c.createRadialGradient(960,540,420,960,540,1180);g.addColorStop(0,"rgba(16,18,32,0)");g.addColorStop(1,"rgba(16,18,32,0.38)");c.fillStyle=g;c.fillRect(0,0,W,H);
    ma_tag(c,"Imagined",ag_in(tt,T.tOnly-0.2,0.5),{dashed:true});});}
// the mound again: the idea then (a chimney), then what sensors showed years later (a lung: the day's warmth and the night's cool push
// the air one way, then the other), the mound swelling a little like a chest
function mc_mound(c,S,tt,T){const idea=ag_in(tt,T.sMound+0.2,1.2)*(1-ag_in(tt,T.tChim,0.9)),lung=ag_in(tt,T.tLungW-0.15,1.0),n=ag_sine((tt-T.tCool+0.1)/1.5),
    br=lung*(0.5-0.5*Math.cos(TAU*Math.max(0,tt-T.tLungW)/4.2)),M=MA_MD;
  const swell=fn=>{c.save();ag_about(c,M.cx,M.base,1+0.012*br);fn();c.restore();};
  if(br>0)swell(()=>{ma_poly(c,MA_MP);c.clip();c.drawImage(ag_place("maMoundCut"),0,0);});
  ma_moundNight(c,n);
  swell(()=>{if(idea>0){c.save();c.globalAlpha*=idea;ma_moundIdea(c,tt,1,1);c.restore();}ma_moundLung(c,tt,n,lung);
    [[898,420,0.3],[806,640,2.75],[1036,630,0.42]].forEach(([x,y,ang],i)=>{const t0=T.tSensors-0.1+i*0.25,u=ag_eo(clamp((tt-t0)/0.6,0,1));if(u<=0)return;
      c.save();c.translate(Math.cos(ang)*60*(1-u),Math.sin(ang)*60*(1-u));ma_sensor(c,x,y,ang,u);
      const bl=ag_in(tt,t0+0.7,0.3)*(0.5+0.5*Math.sin((tt-t0)*4.4+i));c.fillStyle=rgba(AG.blue,0.85*bl);c.beginPath();c.arc(x+Math.cos(ang)*30,y+Math.sin(ang)*30,4.5,0,TAU);c.fill();c.restore();});});
  const ta=ag_in(tt,T.sMound+0.9,0.5)*(1-ag_in(tt,T.tChim+0.2,0.5));if(ta>0)ma_tag(c,"the idea, then",ta,{x:1260,y:300,dashed:true});
  const sa=ag_in(tt,T.tLungW-0.1,0.5);if(sa>0)ma_tag(c,"what sensors showed",sa,{x:1260,y:300});
  ma_pillAt(c,1360,200,"day's warmth",tt,T.tWarmth-0.1,null,{col:[176,96,62]});ma_pillAt(c,1400,700,"night's cool",tt,T.tCool-0.1,null,{col:[96,112,124]});
  ma_scr(c,S,()=>ma_tag(c,"India and Namibia · 2015 and 2017",ag_in(tt,T.tYears-0.2,0.5)));}
// Eastgate late in the afternoon: the idea it was built on, dashed, struck through; and still, it works
function mc_eastgate(c,S,tt,T){ma_eastgateLife(c,tt);
  const g=c.createLinearGradient(W,0,0,H*0.8);g.addColorStop(0,"rgba(255,176,104,0.34)");g.addColorStop(0.55,"rgba(255,176,104,0.1)");g.addColorStop(1,"rgba(70,44,34,0.14)");c.fillStyle=g;c.fillRect(0,0,W,H);
  const ta=ag_in(tt,T.tEGwas+0.2,0.5);if(ta>0){const x=470,y=130;ma_tag(c,"the idea, then",ta,{x,y,dashed:true});const w=ag_tw(c,"the idea, then",{w:500,size:28,f:"mono"})+48,k=ag_sine((tt-T.tWrongI-0.1)/0.5);
    if(k>0){c.save();c.globalAlpha*=ta;c.strokeStyle=rgba(AG.amber,0.95);c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(x-10,y+34);c.lineTo(x-10+(w+20)*k,y+24);c.stroke();c.restore();}}
  ma_pillAt(c,1470,170,"it works",tt,T.tWorks-0.05,null,{icon:"tick",col:AG.green});
  ma_scr(c,S,()=>ma_tag(c,"Harare · after 1996",ag_in(tt,T.sEG+0.5,0.5)));}
// the plant room: the pen draws the offices' warmth; it runs over the comfort line, in amber; the engineer turns a dial, and it settles
function mc_plant(c,S,tt,T){const tp=T.tTuned,u=tt<tp?lerp(0.3,0.5,clamp((tt-T.sPlant)/(tp-T.sPlant),0,1)):lerp(0.5,0.98,clamp((tt-tp)/(T.sTeam+0.8-tp),0,1));
  ma_chart(c,u,0.52,1,1);const turn=ag_sine((tt-tp-0.05)/1.0);ma_dial(c,0,lerp(0.3,0.62,turn));ma_dial(c,1,0.46);ma_dial(c,2,0.55);ma_dial(c,3,0.4);
  const reach=ag_in(tt,tp-0.6,0.7);
  ag_person(c,MA_ENGINEER,800,640,0.98,{t:tt,pose:{near:[2,14,"rest"]},pose2:{near:[64,113,"hold"]},mix:reach,gaze:[5,-4]});
  ma_pillAt(c,1092,252,"ran warm",tt,T.tRanWarm-0.1,null,{icon:"warn",col:AG.amber});
  ma_scr(c,S,()=>ma_tag(c,"Harare · after 1996",1));}
// a small gauge: an arc with its needle
function mc_gauge(c,x,y,s,col){const cy=y+s*0.2;c.save();c.strokeStyle=col;c.fillStyle=col;c.lineWidth=s*0.12;c.lineCap="round";c.beginPath();c.arc(x,cy,s*0.48,Math.PI*1.08,Math.PI*1.92);c.stroke();
  const a=Math.PI*1.66;c.beginPath();c.moveTo(x,cy);c.lineTo(x+Math.cos(a)*s*0.42,cy+Math.sin(a)*s*0.42);c.stroke();c.beginPath();c.arc(x,cy,s*0.09,0,TAU);c.fill();c.restore();}
// how Jun's team keeps its agents: measured, read-only, a person decides, each row as it is said
function mc_kept(c,tt,T,a){if(a<=0)return;const x=56,y=150,w=520,h=320,R=[["measured",T.tMeasured],["read-only",T.tRead],["a person decides",T.tPerson]];
  ma_sprung(c,x+w/2,y+h/2,Math.min(1,ag_spr(tt,T.tSameWay-0.2,0.5)),a,()=>{ag_box(c,x,y,w,h,22,{});ag_T(c,"JUN'S TEAM",x+32,y+56,{w:700,size:28,ls:4,col:AG.mut});
    R.forEach(([s,t0],i)=>{const ra=ag_in(tt,t0-0.1,0.35);if(ra<=0)return;const yy=y+134+i*68,ix=x+58,iy=yy-12;c.save();c.globalAlpha*=ra;c.translate(-16*(1-ag_eo(clamp((tt-t0+0.1)/0.45,0,1))),0);
      if(i===0)mc_gauge(c,ix,iy,40,rgba(AG.blue,1));else if(i===1)ag_lock(c,ix,iy+6,40,rgba(AG.blue,1));else ag_tick(c,ix,iy,30,rgba(AG.green,1),5);
      ag_T(c,s,x+102,yy,{w:700,size:36});c.restore();});});}
// the university's board as Clara left it, the team on the floor: measured (the checking agent), read-only (the helpers' locks), a person
// decides (the stamp); together, the 31 they found
function mc_board(c,S,tt,T){mb_final(c,1);
  const pr=ag_in(tt,T.tPerson,0.35);if(pr>0)ma_stamp(c,1060,318,"approved",pr,{col:AG.green,rot:-0.04,size:32,a:0.7*(1-ag_in(tt,T.tPerson+0.45,0.6))});
  const gl=ag_in(tt,T.tTogether,1.0);if(gl>0){const [x,y]=MB.c31;c.save();c.shadowColor=rgba(AG.green,0.8*gl);c.shadowBlur=34;c.strokeStyle=rgba(AG.green,0.75*gl);c.lineWidth=5;rr(c,x-6,y-6,402,252,22);c.stroke();c.restore();}
  const L=MB.lead;ma_agent(c,L[0],L[1],L[2],tt,{ph:0.4,core:0.75,think:0.25});
  MB.help.forEach((h,i)=>{ag_sandbox(c,h[0],872,150,{depth:50,label:null});const p=ma_agent(c,h[0],h[1]+6,42,tt,{ph:1+i,lock:1,core:0.75,think:0.2+0.2*Math.sin(tt*0.8+i*1.7)});
    const u=(tt-T.tRead+0.05-i*0.08)/0.8;if(u>0&&u<1){c.save();c.strokeStyle=rgba(AG.blue,0.7*(1-u));c.lineWidth=3;c.beginPath();c.arc(p[0]+42*0.78,p[1]-42*0.72,lerp(18,46,ag_eo(u)),0,TAU);c.stroke();c.restore();}});
  const K=MB.check,ms=ag_io(tt,T.tMeasured-0.1,T.tMeasured+1.3,0.3);ma_agent(c,K[0],K[1],K[2],tt,{ph:2.2,ring:1,think:0.2+0.6*ms,core:0.75+0.25*ms});
  if(ms>0){c.save();c.shadowColor=rgba(AG.green,0.9*ms);c.shadowBlur=24;c.strokeStyle=rgba(AG.green,0.6*ms);c.lineWidth=4;c.beginPath();c.arc(K[0],K[1],K[2]*1.22,0,TAU);c.stroke();c.restore();}
  ag_roomLight(c,1);
  mc_kept(c,tt,T,ag_in(tt,T.tSameWay-0.2,0.4)*(1-ag_in(tt,T.tTogether-0.1,0.6)));
  ma_scr(c,S,()=>ma_tag(c,MA_UNI,ag_in(tt,T.sTeam+0.5,0.5)*(1-ag_in(tt,T.tTogether-0.1,0.6))));}
scene("close",(ctx,S,t,sc)=>{
  const T={tOnly:wAt(sc,"imagine","only imagined"),tAgents:wAt(sc,"imagine","agents that"),tStart:wAt(sc,"imagine","start other"),tMend:wAt(sc,"imagine","mend each"),
    tKeep:wAt(sc,"imagine","keep systems"),tMight:wAt(sc,"might","They might"),tFind:wAt(sc,"might","find what"),tHabits:wAt(sc,"might","or settle"),tKnow:wAt(sc,"might","We don't know"),
    tNeither:wAt(sc,"neither","Neither"),tYears:wAt(sc,"lung","Years later"),tSensors:wAt(sc,"lung","sensors"),tChim:wAt(sc,"lung","chimney"),tLungW:wAt(sc,"lung","a lung"),
    tWarmth:wAt(sc,"pushed","day's warmth"),tCool:wAt(sc,"pushed","night's cool"),tEGwas:wAt(sc,"wrong","Eastgate was"),tWrongI:wAt(sc,"wrong","wrong idea"),tWorks:wAt(sc,"wrong","it works"),
    tMeasuring:wAt(sc,"measuring","measuring"),tTuned:wAt(sc,"measuring","tuned"),tRanWarm:wAt(sc,"measuring","ran warm"),
    tTeam:wAt(sc,"same","Jun's team"),tSameWay:wAt(sc,"same","the same way"),tMeasured:wAt(sc,"same","measured"),tRead:wAt(sc,"same","read-only"),tPerson:wAt(sc,"same","with a person"),tTogether:wAt(sc,"same","so together"),
    tTake:wAt(sc,"takeaway","When many"),tYet:wAt(sc,"takeaway","and we don't"),tNext:wAt(sc,"next","Next")};
  T.sMound=T.tNeither-0.7;T.sEG=T.tEGwas-0.6;T.sPlant=T.tMeasuring-0.1;T.sTeam=T.tTeam-0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // imagined: the room at night, agents starting agents, mending each other's work, a clock turning through the night
    {at:0,place:"labNight",keys:[[0,900,560,1.2],[T.tMight-0.6,900,530,1.26]],d:2.4,push:0,draw:(c,tt)=>mc_night(c,S,tt,T)},
    // the mound: the idea then, then sensors, a lung, the day and the night
    {at:T.sMound,place:"maMoundCut",keys:[[0,900,520,1.06],[T.tLungW-0.4,900,500,1.14]],d:1.8,push:0,draw:(c,tt)=>mc_mound(c,S,tt,T)},
    // Eastgate, later: built on the wrong idea, and still it works
    {at:T.sEG,place:"maEastgate",keys:[[0,960,540,1.0]],push:0.04,draw:(c,tt)=>mc_eastgate(c,S,tt,T)},
    // its plant room: measured, and tuned when the offices ran warm
    {at:T.sPlant,place:"maPlant",keys:[[0,1000,540,1.04]],push:0.04,draw:(c,tt)=>mc_plant(c,S,tt,T)},
    // the university: Jun's team keeps its agents the same way; together they found the 31
    {at:T.sTeam,place:"lab",keys:[[0,960,540,1],[T.tTogether-0.2,1180,430,1.22]],d:1.8,push:0,draw:(c,tt)=>{const f=1-ag_in(tt,T.tTake+0.1,0.8);if(f<=0)return;
      c.save();c.globalAlpha*=f;mc_board(c,S,tt,T);c.restore();}}],0.8);
  // the takeaway, then the end card; the next series named as the voice says it
  const t0=T.tTake-0.4;ag_veil(ctx,S,0.5*ag_in(t,t0,1.0));ag_end(ctx,S,t,t0,"Many agents, and what emerges",null,"Film 9 of 9");
  const a1=ag_in(t,t0+0.6,0.9),a2=ag_in(t,T.tYet-0.3,0.7);if(a1>0){setScreen(ctx,S);ag_T(ctx,"When many work together, something new appears,",960,296,{w:700,size:48,align:"center",a:a1});
    if(a2>0)ag_T(ctx,"and we don't yet know what.",960,364,{w:700,size:48,align:"center",a:a2});}
  const na=ag_in(t,T.tNext-0.1,0.6);if(na>0){setScreen(ctx,S);ag_T(ctx,"Next: Agents at work on data",960,790,{w:600,size:30,align:"center",col:AG.mut,a:na});}
});
