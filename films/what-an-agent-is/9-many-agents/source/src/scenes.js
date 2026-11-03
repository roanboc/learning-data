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
    {at:tUni,place:"lab",keys:[[0,960,500,1.06],[tYear-0.3,960,540,1.0]],d:2.2,draw:(c,tt)=>ma_census(c,S,tt,{tUni,tCensus,tAsks,tFac,tNotes,tWeeks,tBudget,tYear,tMany,tWork,tDrafts,tNoon,tMistake})}
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
  const T={tFast:wAt(sc,"crowds","coming fast"),tLead:wAt(sc,"lead","a lead agent"),tSplit:wAt(sc,"lead","splits"),tHelp:wAt(sc,"lead","helpers"),tOwn:wAt(sc,"lead","own instructions"),
    tAnother:wAt(sc,"lead","another agent"),tChecks:wAt(sc,"lead","checks"),tBeat:wAt(sc,"beat","Such teams"),tTimes:wAt(sc,"beat","many times"),tStudy:wAt(sc,"study","Yet a"),
    tFail:wAt(sc,"study","failing"),tTog:wAt(sc,"together","together"),tPaired:wAt(sc,"name","paired"),tSettled:wAt(sc,"name","settled"),tLeaned:wAt(sc,"leaned","the group leaned"),
    tAlone:wAt(sc,"leaned","no agent"),tGroup:wAt(sc,"group","So testing"),tTest:wAt(sc,"group","test the group")};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,960,640,1.14],[2.0,960,560,1.04],[T.tLead-0.8,960,540,1.0]],d:3.2,draw:(c,tt)=>ma_many(c,S,tt,T)}],0.8);
});
// the order the crowd arrives in: one, then more and more, faster
const MA_ARRIVE=(()=>{const o=MA_CROWD.map((p,i)=>[p.at,i]).sort((a,b)=>a[0]-b[0]),T=[];o.forEach(([_,i],k)=>{T[i]=1.2+5.2*Math.pow(k/23,0.7);});return T;})();
const MA_BYDEPTH=MA_CROWD.map((p,i)=>i).sort((a,b)=>MA_CROWD[a].y-MA_CROWD[b].y);
const MA_TEAM={lead:[330,782,60],helpers:[[760,806],[1010,806],[1260,806]],check:[1620,786,48]};
function ma_many(c,S,tt,T){
  // the crowd: rolling in, then gone while the team works, then back and into two rows for the naming game
  const away=ag_in(tt,T.tLead-0.5,0.7)*(1-ag_in(tt,T.tTog+0.2,0.6)),rows=ag_sine((tt-T.tTog-0.7)/1.8),D=0.8,T0=T.tPaired-0.3;
  const rk=Math.floor((tt-T0)/D),inRound=rk>=0&&rk<8,ph=inRound?(tt-T0-rk*D)/D:0,meet=inRound?Math.sin(Math.PI*clamp(ph,0,1)):0,partner={};
  if(inRound)for(const [a,b] of MA_GAME.pairs[rk]){partner[a]=b;partner[b]=a;}
  const pos=i=>{const p=MA_CROWD[i],q=MA_ROWS[i];let x=lerp(p.x,q.x,rows),y=lerp(p.y,q.y,rows),r=lerp(p.r,q.r,rows);
    if(partner[i]!=null){const o=partner[i],ox=lerp(MA_CROWD[o].x,MA_ROWS[o].x,rows),oy=lerp(MA_CROWD[o].y,MA_ROWS[o].y,rows),d=Math.hypot(ox-x,oy-y)||1;x+=(ox-x)/d*14*meet;y+=(oy-y)/d*14*meet;}return[x,y,r];};
  // pairs meeting: a thin line between them while they talk
  if(meet>0){c.save();c.strokeStyle=rgba(AG.mut,0.5*meet);c.lineWidth=2.5;for(const [a,b] of MA_GAME.pairs[rk]){const A=pos(a),B=pos(b),mx=(A[0]+B[0])/2,my=Math.min(A[1],B[1])-60-Math.abs(A[0]-B[0])*0.08;
    c.beginPath();c.moveTo(A[0],A[1]-A[2]);c.quadraticCurveTo(mx,my,B[0],B[1]-B[2]);c.stroke();}c.restore();}
  if(away<1)MA_BYDEPTH.forEach(i=>{const p=MA_CROWD[i],[x,y,r]=pos(i),at=MA_ARRIVE[i];ma_agent(c,x,y,r,tt,{at,from:[p.from*(560+i*12),0],d:0.75,ph:p.ph,a:1-away,think:inRound&&partner[i]!=null?meet*0.6:0});});
  // the team: a lead agent splits the job among helpers, each with its own instructions; a checking agent checks what they find
  const team=ag_in(tt,T.tLead-0.4,0.5)*(1-ag_in(tt,T.tTog,0.6));
  if(team>0){c.save();c.globalAlpha*=team;const L=MA_TEAM.lead;ma_agent(c,L[0],L[1],L[2],tt,{at:T.tLead-0.4,from:[-420,0],d:0.8,ph:0.4,think:ag_io(tt,T.tSplit-0.3,T.tHelp+0.8,0.4)});
    MA_TEAM.helpers.forEach((h,i)=>ma_agent(c,h[0],h[1],40,tt,{at:T.tHelp-0.4+i*0.16,from:[-180,60],d:0.7,ph:1+i,think:ag_io(tt,T.tOwn+0.2,T.tChecks+0.4,0.4)}));
    const K=MA_TEAM.check;ma_agent(c,K[0],K[1],K[2],tt,{at:T.tAnother-0.3,from:[300,0],d:0.8,ph:2.2,ring:ag_sine((tt-T.tAnother)/0.9)});c.restore();
    ma_pillAt(c,L[0],664,"lead agent",tt,T.tLead+0.1,T.tTog);ma_pillAt(c,1010,700,"helper",tt,T.tHelp+0.4,T.tTog);ma_pillAt(c,K[0],664,"checking agent",tt,T.tAnother+0.3,T.tTog);
    // the job card, cut in three; each part flies to a helper as its own instructions
    const jc=ag_in(tt,T.tLead+0.2,0.4)*(1-ag_in(tt,T.tTog,0.6));if(jc>0){c.save();c.globalAlpha*=jc;
      if(tt<T.tSplit+0.2){ag_textCard(c,170,420,330,{kick:"The job",title:"three parts"},{kickCol:AG.mut,k:Math.min(1,ag_spr(tt,T.tLead+0.2,0.5))});}
      else MA_TEAM.helpers.forEach((h,i)=>{const u=ag_sine((tt-T.tSplit-0.2-i*0.18)/1.1),x=lerp(170+i*110,h[0]-80,u),y=lerp(420,560,u),w=lerp(110,160,u),sep=ag_in(tt,T.tSplit,0.25)*(1-u);
        ag_box(c,x+sep*(i-1)*10,y,w,82,14,{edge:AG.violet,edgeA:0.5*u});c.fillStyle=rgba(AG.mut,0.32);rr(c,x+sep*(i-1)*10+18,y+26,w-44,9,4.5);c.fill();rr(c,x+sep*(i-1)*10+18,y+48,w-70,9,4.5);c.fill();});
      c.restore();}
    // what they find goes to the checking agent: two ticks in green, one in amber
    MA_TEAM.helpers.forEach((h,i)=>{const u=ag_sine((tt-T.tChecks+0.3-i*0.22)/1.0);if(u<=0)return;const x=lerp(h[0],K[0]-90,u),y=lerp(h[1]-70,420+i*72,u)-Math.sin(Math.PI*u)*60;
      c.save();c.globalAlpha*=(1-ag_in(tt,T.tTog,0.6));ag_box(c,x,y,180,60,14,{});c.fillStyle=rgba(AG.mut,0.32);rr(c,x+18,y+25,96,9,4.5);c.fill();
      const v=ag_in(tt,T.tChecks+0.9+i*0.3,0.3);if(v>0){if(i===1)ag_warn(c,x+146,y+30,30,rgba(AG.amber,v));else ag_tick(c,x+146,y+30,26,rgba(AG.green,v),4.5);}c.restore();});}
  // better on hard research, at many times the computing; yet failing often
  const cards=1-ag_in(tt,T.tTog-0.1,0.6),slide=-40*ag_in(tt,T.tTog-0.1,0.6);
  const ca=ag_in(tt,T.tBeat,0.45)*cards;if(ca>0){c.save();c.globalAlpha*=ca;c.translate(0,slide);ag_box(c,110,120,780,260,22,{});ag_T(c,"TEAMS OF AGENTS",140,172,{w:700,size:28,ls:4,col:AG.mut});
    ag_T(c,"Hard research: better than one agent",140,226,{w:700,size:36});ma_meter(c,140,312,600,1+7*ag_sine((tt-T.tTimes+0.2)/2.2),1);c.restore();}
  const cb=ag_in(tt,T.tStudy,0.45)*cards;if(cb>0){c.save();c.globalAlpha*=cb;c.translate(0,slide);ag_box(c,1000,120,800,260,22,{edge:AG.amber,edgeA:0.7});ag_T(c,"2025 · 7 SYSTEMS",1030,172,{w:700,size:28,ls:4,col:AG.mut});
    ag_T(c,"failed on 41% to 87% of tasks",1030,226,{w:700,size:36});ma_range(c,1040,290,720,41,87,ag_sine((tt-T.tFail)/1.4),1);c.restore();}
  // the naming game: each agent's name tile; pairs meet, round after round, until the whole group shows one name
  const ta=ag_in(tt,T.tPaired-1.4,0.6);if(ta>0)MA_ROWS.forEach((q,i)=>{const [x,y,r]=pos(i);let k=clamp(rk,-1,8),f=1;const sw=T0+k*D+0.55*D;
    let name=MA_GAME.st[Math.max(0,Math.min(8,tt<sw?k:k+1))][i];if(rk>=8)name=MA_GAME.st[8][i];
    if(rk>=0&&rk<8){const prev=MA_GAME.st[k][i],next=MA_GAME.st[k+1][i];if(prev!==next){f=Math.abs(Math.cos(Math.PI*clamp((tt-sw+0.12)/0.24,0,1)));name=tt<sw?prev:next;}}
    c.save();c.translate(x,y-r-46);c.scale(Math.max(0.05,f),1);ma_tile(c,0,0,MA_NAMES[name],ta*(1-0.7*ag_io(tt,T.tLeaned-0.3,T.tGroup-0.2,0.5)),null);c.restore();});
  // the group leaned towards some names; no agent did alone
  const ga=ag_in(tt,T.tLeaned-0.2,0.5)*(1-ag_in(tt,T.tGroup-0.1,0.5));if(ga>0){c.save();c.globalAlpha*=ga;ag_box(c,150,130,700,420,22,{});ag_T(c,"THE GROUP",182,182,{w:700,size:28,ls:4,col:AG.mut});
    ma_nameChart(c,200,470,600,230,[0.58,0.12,0.9,0.16,0.1],1,{labels:true,u:ag_sine((tt-T.tLeaned)/1.2)});c.restore();}
  const sa=ag_in(tt,T.tAlone-0.4,0.5)*(1-ag_in(tt,T.tGroup-0.1,0.5));if(sa>0){c.save();c.globalAlpha*=sa;ag_box(c,1000,130,780,420,22,{});ag_T(c,"EACH AGENT ALONE",1032,182,{w:700,size:28,ls:4,col:AG.mut});
    for(let k=0;k<6;k++){const x=1050+(k%3)*240,y=330+Math.floor(k/3)*170;ma_nameChart(c,x,y,190,90,[0.5,0.5,0.5,0.5,0.5],1,{alpha:0.45,u:ag_sine((tt-T.tAlone+0.2-k*0.06)/0.8)});}c.restore();}
  // so test the group: a frame round the whole crowd, and the test
  ma_frame(c,96,620,1728,262,ag_sine((tt-T.tGroup-0.2)/1.6),AG.blue);
  ma_cardAt(c,690,380,540,{kick:"Test",title:"test the group"},tt,T.tTest-0.2,null,{edge:AG.blue,kickCol:AG.blue});}

/* ---------------------------------------------------------------- the other chapters (drafts, being drawn) */
for(const id of ["board","alive","close"])scene(id,(ctx,S,t,sc)=>{setScreen(ctx,S);ctx.drawImage(ag_place("lab"),0,0);ag_roomLight(ctx,1);
  ag_T(ctx,sc.name,960,540,{w:800,size:60,align:"center"});
  if(id==="close")ag_end(ctx,S,t,sc.cues.breath,"Many agents, and what emerges","Next: Agents at work on data","Film 9 of 9");});
