/* ===== More readers than people: the scenes =====
   Six chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once:
   the road at night (world.js), and the module's "night" and "map" (the kit's look.js); what moves is drawn live in the shots of
   ag_shots. On the map, one room, the camera glides on from shot to shot and from chapter to chapter (ag_cutInto), and a new
   moment there is a later one (later:true), so what was there leaves before what comes in; between the road and the night, the
   whole picture changes, so the shots dissolve. The title card ends chapter 1, the end card chapter 6. */

/* ---------------------------------------------------------------- 1 · Signs anyone can read */
const MR_PLATES=["VIRAGE DANGEREUX","GEFÄHRLICHE KURVE","CURVA PELIGROSA","DANGEROUS CURVE"];
const MR_SIGNX=1240,MR_SIGNY=470;
scene("signs",(ctx,S,t,sc)=>{const c=sc.cues,T=mr_once(sc,"T",()=>({
    place:wAt(sc,"place","Vienna"),drive:wAt(sc,"drive","drive"),next:wAt(sc,"drive","the next"),
    month:wAt(sc,"meet","a month"),rules:wAt(sc,"meet","rules of the road"),
    differ:wAt(sc,"differ","still differ"),words:wAt(sc,"differ","in words"),lang:wAt(sc,"differ","own language"),
    bend:wAt(sc,"miss","sharp bend"),never:wAt(sc,"miss","never know"),crashW:wAt(sc,"crash","crash"),
    n31:wAt(sc,"sign","thirty-one"),conv:wAt(sc,"sign","Convention"),
    shape:wAt(sc,"once","shape"),colour:wAt(sc,"once","colour"),symbol:wAt(sc,"once","symbol"),
    tri:wAt(sc,"shapes","triangle"),warns:wAt(sc,"shapes","warns"),circ:wAt(sc,"shapes","A circle"),blue:wAt(sc,"shapes","A blue circle"),
    n75:wAt(sc,"today","seventy-five"),sameS:wAt(sc,"today","same signs"),
    nobody:wAt(sc,"new","nobody"),every:wAt(sc,"cars","every new car"),eu:wAt(sc,"cars","European Union"),read:wAt(sc,"cars","read the speed limit"),passes:wAt(sc,"cars","passes"),
    dataW:wAt(sc,"data","Data"),ppl:wAt(sc,"readers","by people"),rep:wAt(sc,"readers","Finance's reports"),app:wAt(sc,"readers","an app"),agt:wAt(sc,"readers","an agent"),part:wAt(sc,"readers","a partner"),
    own:wAt(sc,"wrong","counts its own way"),elseW:wAt(sc,"wrong","someone else"),shouldnt:wAt(sc,"wrong","shouldn't"),
    itself:wAt(sc,"right","each as itself"),sameN:wAt(sc,"right","same number"),may:wAt(sc,"right","only what it may")}));
  ag_shots(ctx,S,t,sc.dur,[
    // near Vienna, at night: more people than ever drive from one country into the next
    {at:0,place:"mrRoad",keys:[[0,960,540,1.0]],push:0.03,draw:(cx,tt)=>{
      md_label(cx,96,150,"Vienna · November 1968",{a:ag_in(tt,T.place-0.2,0.6),col:MD.ink});
      mr_border(cx,1500,ag_in(tt,T.next-0.4,0.6));
      for(let i=0;i<5;i++){const u=(tt-(-1.2+i*2.4))/7.2;if(u>0&&u<1)mr_carOn(cx,MR_LANE,u,{});}}},
    // a month of talks in Vienna, on the rules of the road
    {at:c.meet-0.5,place:"night",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      md_textCard(cx,460,250,1000,{kick:"United Nations",title:"Conference on Road Traffic",sub:"Vienna"},{edge:MD.flow,a:ag_in(tt,c.meet-0.3,0.5),k:mr_k(tt,c.meet-0.3)});
      const days=33,u=ag_sine(clamp((tt-T.month+0.2)/2.4,0,1)),x0=460,cw=26,gap=4.3,y0=560;
      for(let i=0;i<days;i++){const f=clamp(u*days-i,0,1);if(f<=0)continue;cx.save();cx.globalAlpha*=f;rr(cx,x0+i*(cw+gap),y0,cw,cw,5);cx.fillStyle=rgba(MD.flow,0.5);cx.fill();cx.restore();}
      md_T(cx,"7 October",x0,y0+76,{w:600,size:28,col:MD.soft,a:ag_in(tt,T.month-0.2,0.4)});
      md_T(cx,"8 November",x0+days*(cw+gap)-gap,y0+76,{w:600,size:28,align:"right",col:MD.soft,a:ag_in(tt,T.month+2.0,0.4)});}},
    // but the signs still differ: many in words, each in its own country's language (later: the conference leaves first)
    {later:true,at:T.differ-0.4,place:"night",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      md_label(cx,960,250,"A sharp bend ahead, before 1968",{align:"center",a:ag_in(tt,T.differ-0.2,0.5)});
      MR_PLATES.forEach((p,i)=>{const x=i%2?1300:620,y=i<2?420:600;mr_sign(cx,"plate",x,y,0,{text:p,size:34,a:ag_in(tt,T.words-0.3+i*0.3,0.4),k:mr_k(tt,T.words-0.3+i*0.3)});});
      md_tag(cx,960,760,"in each country's own language",{align:"center",col:MD.soft,a:ag_in(tt,T.lang-0.3,0.5)});}},
    // a driver from abroad passes a warning in words, and misses the bend (a cut: the plate's words were just on the wall of plates)
    {at:c.miss-0.5,cut:true,place:"mrRoad",keys:[[0,960,540,1.0],[T.crashW-1.6,900,560,1.1]],d:2.4,push:0,draw:(cx,tt)=>{
      mr_sign(cx,"plate",MR_SIGNX,MR_SIGNY-10,0,{text:MR_PLATES[1],size:32,post:70});
      const t0=c.miss-0.3,u=clamp((tt-t0)/(T.crashW-t0),0,1),hit=ag_in(tt,T.crashW-0.05,0.15),q=mr_carOn(cx,MR_MISS,u,{lights:1-0.6*ag_in(tt,T.crashW+0.6,1.2)});
      const pa=ag_in(tt,T.never-0.2,0.4)*(1-hit);if(pa>0)md_pill(cx,q.x,q.y-86,"?",{col:MD.wait,a:pa,size:32});
      if(hit>0){const f=Math.exp(-Math.max(0,tt-T.crashW)*0.9);glow(cx,q.x-40,q.y,150,MD.fail,0.55*hit*(0.35+0.65*f));md_icon(cx,"warn",q.x-40,q.y-100,54,MD.fail,{a:hit});}}},
    // the treaty: each sign defined once, by its shape, its colour and its symbol; then the three kinds
    {at:c.sign-0.5,place:"night",keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      md_textCard(cx,380,130,1160,{kick:"Vienna, 8 November 1968",title:"Convention on Road Signs and Signals"},{edge:MD.agreed,icon:"contract",a:ag_in(tt,c.sign-0.3,0.5),k:mr_k(tt,c.sign-0.3)});
      md_pill(cx,960,330,"Signed by 31 countries",{col:MD.agreed,size:30,a:ag_in(tt,T.n31-0.1,0.4),k:mr_k(tt,T.n31-0.1)});
      const mv=ag_sine(clamp((tt-T.tri+0.6)/1.2,0,1)),sx=lerp(960,560,mv),sy=590,ss=230;
      mr_signBuild(cx,sx,sy,ss,{shape:ag_in(tt,T.shape-0.1,0.6),colour:ag_in(tt,T.colour-0.1,0.5),symbol:ag_in(tt,T.symbol-0.1,0.5)});
      const ta=1-ag_in(tt,T.tri-0.8,0.4);["its shape","its colour","its symbol"].forEach((w,i)=>md_tag(cx,700+i*260,800,w,{align:"center",col:MD.ink,a:ta*ag_in(tt,[T.shape,T.colour,T.symbol][i]-0.15,0.4)}));
      md_T(cx,"warns",560,800,{w:700,size:32,align:"center",a:ag_in(tt,T.warns-0.2,0.4)});
      mr_sign(cx,"limit",960,sy,ss*0.92,{a:ag_in(tt,T.circ-0.2,0.4),k:mr_k(tt,T.circ-0.2)});md_T(cx,"forbids, or sets a limit",960,800,{w:700,size:32,align:"center",a:ag_in(tt,T.circ+0.6,0.4)});
      mr_sign(cx,"must",1360,sy,ss*0.92,{a:ag_in(tt,T.blue-0.2,0.4),k:mr_k(tt,T.blue-0.2)});md_T(cx,"says what you must do",1360,800,{w:700,size:32,align:"center",a:ag_in(tt,T.blue+0.6,0.4)});}},
    // today: the same signs from one country to the next; and a reader nobody planned for, a car that reads the limit
    {at:c.today-0.5,place:"mrRoad",keys:[[0,960,540,1.0]],push:0.03,draw:(cx,tt)=>{
      mr_border(cx,1500,1);
      mr_sign(cx,"warn",1700,MR_SIGNY,120,{post:70,glow:ag_io(tt,T.sameS-0.2,T.sameS+1.6,0.4)?MD.pass:null});
      mr_sign(cx,"warn",MR_SIGNX,MR_SIGNY,120,{post:70,glow:ag_io(tt,T.sameS-0.2,T.sameS+1.6,0.4)?MD.pass:null});
      md_pill(cx,300,150,"75 countries keep it",{col:MD.agreed,size:30,a:ag_in(tt,T.n75-0.2,0.4),k:mr_k(tt,T.n75-0.2)});
      // the first car takes the bend
      const u1=(tt-(c.today-0.1))/7.4;if(u1>0&&u1<1){const q=mr_carOn(cx,MR_LANE,u1,{});const ok=ag_io(tt,c.today+4.6,c.today+6.4,0.3);if(ok>0)md_icon(cx,"tick",q.x+70,q.y-60,46,MD.pass,{a:ok});}
      // the limit, and the second car, which reads it
      const la=ag_in(tt,T.every-0.6,0.5);mr_sign(cx,"limit",980,MR_SIGNY,110,{post:70,a:la});
      const u2=(tt-(T.every-0.4))/7.6;let q2=null;if(u2>0&&u2<1)q2=mr_carOn(cx,MR_LANE,u2,{});
      const rd=ag_io(tt,T.read-0.3,T.passes+0.6,0.4);if(q2&&rd>0){cx.save();cx.globalAlpha*=rd;cx.globalCompositeOperation="lighter";const g=cx.createLinearGradient(q2.x,q2.y,980,MR_SIGNY);g.addColorStop(0,rgba(MD.flow,0.45));g.addColorStop(1,rgba(MD.flow,0.08));
        cx.fillStyle=g;cx.beginPath();cx.moveTo(q2.x-30,q2.y-14);cx.lineTo(980-60,MR_SIGNY-40);cx.lineTo(980+60,MR_SIGNY+40);cx.closePath();cx.fill();cx.restore();}
      const da=ag_in(tt,T.read+0.2,0.5);if(da>0){md_card(cx,1430,150,400,170,{edge:MD.flow,a:da});md_T(cx,"THE CAR'S DISPLAY",1460,202,{w:800,size:28,ls:4,col:MD.flow,a:da});mr_sign(cx,"limit",1520,262,74,{a:da});md_T(cx,"read off the sign",1580,272,{w:600,size:28,col:MD.soft,a:da});}
      md_tag(cx,96,240,"Every new car in the EU, since July 2024",{col:MD.flow,a:ag_in(tt,T.eu-0.3,0.5)});}},
    // data has readers nobody planned for, too: the measure, and its five readers
    {at:c.data-0.6,place:"map",keys:[[0,960,540,1.0]],push:0,draw:(cx,tt)=>{
      const ua=ag_in(tt,T.ppl-0.4,0.6);if(ua>0){md_card(cx,90,190,1740,520,{dash:[12,10],edge:MD.dim,a:ua*0.9});md_label(cx,960,240,"The university",{align:"center",a:ua});}
      mr_measure(cx,MR_M.x,MR_M.y,MR_M.w,{a:ag_in(tt,T.dataW-0.1,0.5),k:mr_k(tt,T.dataW-0.1),lit:ag_io(tt,T.itself,T.may+1.2,0.6)});
      const at_=[T.ppl,T.rep,T.app,T.agt,T.part],bad=ag_in(tt,T.own-0.2,0.4)*(1-ag_in(tt,T.itself-0.3,0.5)),as=ag_in(tt,T.elseW-0.2,0.4)*(1-ag_in(tt,T.itself-0.3,0.5)),good=ag_in(tt,T.itself-0.2,0.5);
      MR_READERS.forEach((R,i)=>{const a=ag_in(tt,at_[i]-0.2,0.4),lane=ag_sine(clamp((tt-at_[i])/0.9,0,1));
        const isBad=R.k==="bi",isAs=R.k==="app";
        mr_reader(cx,R,{a,lane:isBad?lane*(1-0.55*bad):lane,col:isBad&&bad>0.5?MD.fail:MD.agreed,dash:isBad&&bad>0.5,t:tt,flow:good,edge:isBad&&bad>0.5?MD.fail:null});
        if(isBad&&bad>0)mr_says(cx,R,"A$1.56M",{col:MD.fail,icon:"cross",a:bad});
        if(isAs&&as>0){mr_key(cx,R.x+R.w-30,R.y-4,MD.fail,as);md_tag(cx,R.x+60,R.y+150,"other faculties' claims",{col:MD.personal,icon:"lock",a:as});}
        if(good>0){mr_key(cx,R.x+R.w-30,R.y-4,MD.pass,good);
          if(R.k!=="partner")mr_says(cx,R,"A$1.84M",{a:ag_in(tt,T.sameN-0.2+i*0.12,0.4)});else mr_says(cx,R,"totals by faculty",{a:ag_in(tt,T.sameN+0.4,0.4)});}});}},
    // later: the map left bare, so the title card's words come in over nothing (legible.py --overlaps)
    {later:true,at:c.breath+0.1,place:"map",keys:[[0,960,540,1.0]],push:0,draw:()=>{}}],0.5);
  md_title(ctx,S,t,c.breath,"More readers than people","One definition, every reader","FILM 3 OF 3 · FROM TABLES TO DECISIONS");
});

/* ---------------------------------------------------------------- 2 · A door that didn't carry it
   Pay day in Finance: Rohan, the measure he owns on the platform, Genie One's answer and the budget pack's; then, later, why: the
   catalog seen through a mirror in Microsoft Fabric, which shows tables but not metric views and reads as one sign-in; then the door
   that carries the measure, Power BI's own connector, each analyst as themselves; and, later, Noor's rule. */
const MR_DB={x:70,y:230,w:700,h:560},MR_FB={x:1150,y:230,w:700,h:560};
scene("door",(ctx,S,t,sc)=>{const c=sc.cues,T=mr_once(sc,"T",()=>({
    payday:wAt(sc,"today","pay day"),owns:wAt(sc,"rohan","owns"),mv:wAt(sc,"defined","metric view"),uc:wAt(sc,"defined","Unity Catalog"),
    asks:wAt(sc,"genie","when he asks"),n184:wAt(sc,"genie","one point eight four"),
    packW:wAt(sc,"pack","budget pack"),n156:wAt(sc,"pack","one point five six"),sameName:wAt(sc,"pack","same name"),
    pbi:wAt(sc,"bi","Power BI"),cat:wAt(sc,"bi","university's catalog"),mirrorW:wAt(sc,"bi","a mirror"),fabric:wAt(sc,"bi","Microsoft Fabric"),
    tables:wAt(sc,"mirror","tables"),lives:wAt(sc,"mirror","where it lives"),noMV:wAt(sc,"mirror","metric views"),
    cant:wAt(sc,"counted","can't be seen"),summed:wAt(sc,"counted","summed"),called:wAt(sc,"counted","called it"),
    every:wAt(sc,"rights","every query"),one:wAt(sc,"rights","the one sign-in"),rightsW:wAt(sc,"rights","rights stay behind"),
    dbx:wAt(sc,"direct","from Databricks"),conn:wAt(sc,"direct","connector"),each:wAt(sc,"direct","each analyst"),
    byName:wAt(sc,"same","by name"),gets:wAt(sc,"same","one point eight four"),genieToo:wAt(sc,"same","as Genie One"),
    r1:wAt(sc,"noor","mirror only"),r2:wAt(sc,"noor","and read a measure")}));
  ag_shots(ctx,S,t,sc.dur,[
    // pay day: Rohan, the measure he owns, defined once on the platform; Genie One's answer, and the budget pack's
    {later:true,at:0,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      md_textCard(cx,540,250,520,{kick:"Pay day",title:"Thursday, 5 November"},{icon:"clock",a:ag_in(tt,0.5,0.6)*(1-ag_in(tt,T.mv-0.6,0.5)),k:mr_k(tt,0.5)});
      const ra=ag_in(tt,0.7,0.7);if(ra>0){cx.save();cx.globalAlpha*=ra;md_person(cx,"rohan",300,740,0.8,{t:tt,gaze:tt>T.asks-0.5?[3,0]:[1,1],nod:ag_io(tt,T.asks,T.asks+1.4,0.3)*0.4});cx.restore();
        md_nameTag(cx,160,392,"rohan",{col:MD.dom.finance,a:ra});}
      const pa=ag_in(tt,T.mv-0.3,0.6);md_platform(cx,1110,200,710,510,{uc:true,ucText:"Unity Catalog",a:pa,lit:ag_io(tt,T.uc-0.2,T.uc+1.4,0.4)});
      mr_measure(cx,1160,320,610,{a:ag_in(tt,T.owns-0.2,0.5),k:mr_k(tt,T.owns-0.2),lit:ag_io(tt,T.mv-0.1,T.mv+1.4,0.4)+ag_io(tt,T.sameName-0.1,T.sameName+2.2,0.4)*0.8});
      md_tag(cx,1160,536,"Owner: Rohan Desai",{col:MD.agreed,icon:"person",a:ag_in(tt,T.owns+0.7,0.5)});
      // Genie One: his question, a query to the measure where it's defined, and its answer
      const ga=ag_in(tt,T.asks-0.5,0.5);mr_genie(cx,540,200,520,330,{a:ga,k:mr_k(tt,T.asks-0.5),q:"Casual teaching cost for Health, so far?",qA:ag_in(tt,T.asks-0.1,0.4),
        ans:"A$1.84 million",sub:"Faculty of Health, Semester 2",ansA:ag_in(tt,T.n184-0.2,0.4)});
      md_way(cx,"query",[1060,368],[1160,404],tt,{u:ag_sine(clamp((tt-T.asks-0.2)/0.8,0,1)),a:ga});
      // the budget pack, from a Power BI report: another number, under the same name
      const ba=ag_in(tt,T.packW-0.3,0.5),bad=ag_in(tt,T.n156-0.1,0.4);
      mr_report(cx,540,574,520,290,{a:ba,k:mr_k(tt,T.packW-0.3),num:"A$1.56 million",col:MD.fail,numA:ag_in(tt,T.n156-0.2,0.4),edge:bad>0.5?MD.fail:null,lit:bad*0.6,
        nameLit:ag_io(tt,T.sameName-0.1,T.sameName+2.2,0.4)});}},
    // later: why. Power BI reads the university's catalog through a mirror in Microsoft Fabric
    {later:true,at:c.bi-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const fix=ag_in(tt,T.dbx-0.4,0.6),dim=1-0.7*fix;
      // the platform, its claims and the measure, and the catalog's rights, which stay there
      const da=ag_in(tt,T.cat-0.3,0.6);md_platform(cx,MR_DB.x,MR_DB.y,MR_DB.w,MR_DB.h,{uc:true,ucText:"Unity Catalog",a:da});
      const tc=md_table(cx,106,350,628,{name:"mart_finance__casual_claims",kind:"table",a:da,lit:ag_io(tt,T.lives-0.2,T.lives+1.6,0.4)});
      const tm=md_table(cx,106,510,628,{name:MR_NAME,kind:"metric view",col:MD.agreed,a:da,lit:ag_io(tt,T.noMV-0.1,T.noMV+1.8,0.4)+ag_io(tt,T.byName-0.1,T.gets+1.2,0.4)});
      md_tag(cx,386,730,"the catalog's rights",{col:MD.flow,icon:"lock",a:ag_in(tt,T.rightsW-0.3,0.5)});
      // Microsoft Fabric, its mirror of the catalog: the tables, read where they live, and no metric views
      const fa=ag_in(tt,T.fabric-0.3,0.6);mr_fabric(cx,MR_FB.x,MR_FB.y,MR_FB.w,MR_FB.h,{a:fa});
      const ma=ag_in(tt,T.fabric+0.2,0.5);if(ma>0){cx.save();cx.globalAlpha*=ma;const lw=logo(cx,"fabricMirror",1186,318,34);md_T(cx,"Mirrored catalog",1186+lw+12,346,{w:600,size:28,col:MD.soft});cx.restore();}
      md_table(cx,1186,366,628,{name:"mart_finance__casual_claims",kind:"mirrored table",ghost:true,a:ag_in(tt,T.tables-0.2,0.5)*dim,lit:ag_io(tt,T.lives-0.2,T.lives+1.6,0.4)});
      mr_slot(cx,1186,488,300,84,"No metric views",{a:ag_in(tt,T.noMV-0.2,0.5)*dim});
      md_way(cx,"mirror",tc.r,[1186,418],tt,{u:ag_sine(clamp((tt-T.mirrorW+0.1)/0.9,0,1)),icon:true,label:"mirror",iconA:1-ag_in(tt,T.one-0.3,0.4),a:da*dim});
      // the one sign-in every query through the mirror runs as
      const ka=ag_in(tt,T.one-0.3,0.4)*(1-fix);if(ka>0){mr_key(cx,960,410,MD.ink,ka,{r:34,s:38});md_T(cx,"one sign-in",960,488,{w:700,size:28,align:"center",a:ka});}
      // the report, which counted its own way: the pay paid, summed, and called casual teaching cost
      const cnt=ag_in(tt,T.summed-0.2,0.5)*(1-fix);if(cnt>0){md_lane(cx,md_path([[1540,470],[1540,620]]),MD.fail,cnt,{u:ag_sine(clamp((tt-T.summed+0.2)/0.6,0,1)),t:tt});
        md_tag(cx,1556,546,"SUM(pay_paid)",{col:MD.fail,a:cnt});}
      const bad=1-ag_in(tt,T.gets-0.2,0.5);
      const rb=mr_biCard(cx,1186,620,628,{a:ag_in(tt,c.bi+0.1,0.5),k:mr_k(tt,c.bi+0.1),edge:bad>0.5?MD.fail:MD.pass,subLit:ag_io(tt,T.called-0.1,T.called+1.6,0.4),
        roll:["A$1.56M","A$1.84M",ag_in(tt,T.gets-0.2,0.6),MD.fail,MD.pass]});
      // the door that carries it: Power BI's own connector to Databricks, each analyst signed in as themselves, the measure asked for by name
      md_way(cx,"query",rb.l,tm.r,tt,{u:ag_sine(clamp((tt-T.conn+0.4)/0.9,0,1)),icon:true,label:"Power BI's connector",labelBelow:-90,a:fix,col:MD.flow});
      [1600,1680,1760].forEach((x,i)=>{const wa=ag_in(tt,T.each-0.2+i*0.25,0.4);mr_who(cx,x,546,MD.ink,wa);mr_key(cx,x+24,572,MD.pass,wa,{r:16,s:20});});
      md_tag(cx,106,654,"MEASURE("+MR_NAME+")",{col:MD.agreed,a:ag_in(tt,T.byName-0.2,0.5)});
      md_reader(cx,830,220,260,{title:"Genie One",sub:"A$1.84M",logo:"databricks",a:ag_in(tt,T.genieToo-0.2,0.5),col:MD.pass,lit:ag_io(tt,T.genieToo,T.genieToo+1.6,0.4)});}},
    // later: Noor writes the rule down
    {later:true,at:c.noor-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const na=ag_in(tt,c.noor-0.1,0.7);if(na>0){cx.save();cx.globalAlpha*=na;md_person(cx,"noor",1620,740,0.8,{t:tt,flip:true,gaze:[3,0]});cx.restore();md_nameTag(cx,1500,392,"noor",{col:MD.flow,a:na});}
      mr_rule(cx,150,360,900,["Mirror only what every reader there may see.","Read a measure where it's defined."],{a:ag_in(tt,T.r1-0.5,0.5),k:mr_k(tt,T.r1-0.5),
        lineA:[ag_in(tt,T.r1-0.2,0.4),ag_in(tt,T.r2-0.2,0.4)]});}}],0.5);
  MR_KICK(ctx,1);
});

/* ---------------------------------------------------------------- 3 · An app that reads as you
   Anil plans next semester's tutors in the faculties' planning app; an app can read as itself or as the person using it; this one
   reads as the person, and the claims carry a filter by faculty in Unity Catalog, so the app's code holds no rule about who sees what. */
const MR_FACS=["Health","Arts and Education","Business","Engineering and IT"];
const MR_UNITS=[["HI101","420"],["HI112","300"],["HI205","260"],["HI305","60"]];
scene("app",(ctx,S,t,sc)=>{const c=sc.cues,T=mr_once(sc,"T",()=>({
    anil:wAt(sc,"plan","Anil Kurian"),tutors:wAt(sc,"plan","tutors"),appW:wAt(sc,"app","an app"),dbxApps:wAt(sc,"app","Databricks Apps"),
    cost:wAt(sc,"shows","casual teaching cost"),hours:wAt(sc,"shows","the hours"),every:wAt(sc,"each","Every faculty"),own:wAt(sc,"each","only its own"),
    itself:wAt(sc,"two","as itself"),shares:wAt(sc,"two","shares the app's rights"),person:wAt(sc,"two","or as the person"),
    thisOne:wAt(sc,"asks","This one"),queries:wAt(sc,"asks","run queries"),
    claims:wAt(sc,"filter","the claims"),filterW:wAt(sc,"filter","a filter by faculty"),ucW:wAt(sc,"filter","Unity Catalog"),
    sees:wAt(sc,"sees","Anil sees"),code:wAt(sc,"sees","nothing in the app's code"),r1:wAt(sc,"rule","Let an app"),r2:wAt(sc,"rule","and keep the rules")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Anil, and the planning app: the faculty's cost so far, beside the hours each unit will need
    {later:true,at:0,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const pa=ag_in(tt,0.7,0.7);if(pa>0){cx.save();cx.globalAlpha*=pa;md_person(cx,"anil",300,740,0.8,{t:tt,gaze:[3,0]});cx.restore();md_nameTag(cx,160,392,"anil",{col:MD.dom.teaching,a:pa});}
      const wa=ag_in(tt,T.appW-0.3,0.5);md_window(cx,560,230,1260,560,{logo:"databricks",product:"Databricks Apps",title:"Tutor planning, Semester 1 2027",a:wa,k:mr_k(tt,T.appW-0.3),draw:(b,bd)=>{
        const lit=MR_FACS.map((f,i)=>ag_io(tt,T.every-0.1+i*0.35,T.every+0.5+i*0.35,0.25)),lk=MR_FACS.map((f,i)=>i?ag_in(tt,T.own-0.1,0.5):0);
        mr_tabs(b,bd.x+20,bd.y+40,MR_FACS,0,{litA:lit,lockA:lk});
        const ca=ag_in(tt,T.cost-0.3,0.5),cl=ag_io(tt,T.cost-0.1,T.cost+1.6,0.4);if(ca>0){b.save();b.globalAlpha*=ca;if(cl>0)glow(b,bd.x+200,bd.y+250,260,MD.agreed,0.25*cl);
          md_icon(b,"contract",bd.x+40,bd.y+138,36,MD.agreed);md_T(b,"CASUAL TEACHING COST",bd.x+72,bd.y+150,{w:800,size:28,ls:4,col:MD.agreed});
          md_T(b,"A$1.84M",bd.x+20,bd.y+240,{w:800,size:60});md_T(b,"Faculty of Health, so far",bd.x+20,bd.y+290,{w:500,size:28,col:MD.soft});
          md_T(b,"Semester 2, 2026",bd.x+20,bd.y+330,{w:500,size:28,col:MD.soft});b.restore();}
        md_rows(b,bd.x+560,bd.y+100,[{h:"Unit",w:220,f:"mono"},{h:"Tutor hours needed",w:420}],MR_UNITS,{a:ag_in(tt,T.hours-0.4,0.4),rowA:(r,i)=>ag_in(tt,T.hours-0.2+i*0.3,0.4)});}});}},
    // later: two ways an app can read, as itself or as the person using it
    {later:true,at:c.two-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const pick=ag_in(tt,T.thisOne-0.2,0.6);
      [[60,"As itself",T.itself,true],[980,"As the person using it",T.person,false]].forEach(([x,head,at_,own])=>{
        const pa=ag_in(tt,at_-0.4,0.5)*(own?1-0.55*pick:1);if(pa<=0.004)return;cx.save();cx.globalAlpha*=pa;
        md_card(cx,x,220,880,560,{edge:!own&&pick>0?MD.pass:null,glow:0.4+0.6*(!own?pick:0),r:22});md_label(cx,x+40,280,head,{col:!own&&pick>0.5?MD.pass:MD.soft});
        const app=mr_box(cx,x+240,470,360,{logo:"databricks",title:"The app",sub:"Tutor planning",h:110});
        const m=mr_measure(cx,x+200,640,440,{sub:false});
        [x+220,x+420,x+620].forEach((ux,i)=>{md_lane(cx,md_path([[ux,402],[app.x+90+i*90,app.y]]),MD.soft,0.8,{t:tt});
          mr_who(cx,ux,370,MD.ink,1);if(!own)mr_key(cx,ux+26,398,MD.pass,1,{r:15,s:18});});
        md_lane(cx,md_path([[app.b[0],app.b[1]],[m.t[0],m.t[1]]]),own?MD.soft:MD.pass,0.9,{t:tt});
        if(own){mr_key(cx,app.x+app.w-6,app.y+8,MD.ink,1,{r:20,s:24});md_T(cx,"one key for all",app.x+app.w+26,app.y+64,{w:600,size:28,col:MD.soft,a:ag_in(tt,T.shares-0.2,0.5)});}
        else md_T(cx,"only runs queries",app.x+app.w+26,app.y+64,{w:600,size:28,col:MD.flow,a:ag_in(tt,T.queries-0.3,0.5)});
        cx.restore();});}},
    // later: the rules live where the data does. The claims carry a filter by faculty in Unity Catalog; the app's code holds none
    {later:true,at:c.filter-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const pa=ag_in(tt,c.filter-0.1,0.5);md_platform(cx,850,220,980,580,{uc:true,ucText:"Unity Catalog",a:pa,lit:ag_io(tt,T.ucW-0.2,T.ucW+1.4,0.4)});
      const mv=md_table(cx,880,330,560,{name:MR_NAME,kind:"metric view",col:MD.agreed,a:pa});
      const cl=md_table(cx,880,520,560,{name:"mart_finance__casual_claims",kind:"table",col:MD.personal,icon:"lock",a:ag_in(tt,T.claims-0.2,0.5),lit:ag_io(tt,T.claims,T.claims+1.4,0.4)});
      md_lane(cx,md_path([[1160,mv.y+mv.h],[1160,cl.y]]),MD.flow,ag_in(tt,T.claims-0.2,0.5),{t:tt});
      md_tag(cx,880,662,"row filter: by faculty",{col:MD.flow,icon:"eye",a:ag_in(tt,T.filterW-0.2,0.5)});
      const sa=ag_in(tt,T.sees-0.3,0.5);
      mr_list(cx,1462,330,340,"Anil sees",MR_FACS.map((f,i)=>[f,i?MD.dim:MD.pass,i?"lock":"tick",1]),{a:sa,edge:MD.pass});
      // the app, and its code: it reads as the person, and decides nothing about who sees what
      const ca=ag_in(tt,c.filter+0.2,0.5);mr_code(cx,100,300,640,330,[["# Tutor planning",MD.soft],["query("],["  \"casual_teaching_cost\","],["  as_person=True)"]],{a:ca});
      md_tag(cx,100,690,"no rule about who sees what",{col:MD.pass,icon:"tick",a:ag_in(tt,T.code-0.2,0.5)});
      md_way(cx,"query",[740,465],[mv.x,mv.y+mv.h/2],tt,{u:ag_sine(clamp((tt-T.sees+0.2)/0.8,0,1)),a:sa});
      mr_who(cx,180,230,MD.ink,ag_in(tt,T.sees-0.4,0.5));mr_key(cx,206,258,MD.pass,ag_in(tt,T.sees-0.4,0.5),{r:15,s:18});md_T(cx,"Anil",226,240,{w:700,size:28,a:ag_in(tt,T.sees-0.4,0.5)});}},
    // later: the rule
    {later:true,at:c.rule-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const pa=ag_in(tt,c.rule-0.1,0.7);if(pa>0){cx.save();cx.globalAlpha*=pa;md_person(cx,"anil",1620,740,0.8,{t:tt,flip:true,gaze:[3,0]});cx.restore();md_nameTag(cx,1500,392,"anil",{col:MD.dom.teaching,a:pa});}
      mr_rule(cx,150,360,900,["Let an app read as the person using it.","Keep the rules where the data lives."],{a:ag_in(tt,T.r1-0.5,0.5),k:mr_k(tt,T.r1-0.5),lineA:[ag_in(tt,T.r1-0.2,0.4),ag_in(tt,T.r2-0.2,0.4)]});}}],0.5);
  MR_KICK(ctx,1);
});

/* ---------------------------------------------------------------- 4 · An agent reads the words too
   Rohan's pay-day note to the deans, now drafted by Finance's pay-day agent; it asks Genie One through a tool server, and Genie One
   knows the word its instructions use, one of the measure's synonyms; like a car reading the signs, an agent reads a measure's words;
   it works alone, so it has a name of its own and only what its job reads; it drafts, and Rohan checks the note and sends it. */
const MR_NOTE=[["Engineering and IT","A$2.05M"],["Health","A$1.84M"],["Arts and Education","A$1.62M"],["Business","A$1.14M"]];
function mr_note(ctx,x,y,w,o){o=o||{};const rows=[["Casual teaching cost, so far",MD.soft]].concat(MR_NOTE.map((r,i)=>[r,null,null,o.rowA?o.rowA[i]:1]));
  return mr_list(ctx,x,y,w,"Note to the deans",rows,{a:o.a,k:o.k,edge:o.edge,kickCol:o.kickCol||MD.soft});}
scene("agent",(ctx,S,t,sc)=>{const c=sc.cues,T=mr_once(sc,"T",()=>({
    deans:wAt(sc,"note","the deans"),each:wAt(sc,"note","each faculty's"),agentW:wAt(sc,"drafts","pay-day agent"),draftsW:wAt(sc,"drafts","drafts the note"),
    genie:wAt(sc,"asks","Genie One"),tool:wAt(sc,"asks","a tool server"),any:wAt(sc,"asks","as any agent"),answers:wAt(sc,"asks","answers"),same:wAt(sc,"asks","same definition"),
    instr:wAt(sc,"words","Its instructions"),sess:wAt(sc,"words","sessional"),knows:wAt(sc,"words","knows the word"),syn:wAt(sc,"words","synonyms"),
    carW:wAt(sc,"car","Like a car"),reads:wAt(sc,"car","an agent reads"),nameW:wAt(sc,"car","its name"),desc:wAt(sc,"car","its description"),synW:wAt(sc,"car","its synonyms"),
    alone:wAt(sc,"alone","works alone"),sched:wAt(sc,"alone","on a schedule"),own:wAt(sc,"alone","a name of its own"),rules:wAt(sc,"alone","same rules"),
    may:wAt(sc,"grants","It may ask"),measure:wAt(sc,"grants","read the measure"),cant:wAt(sc,"grants","can't read the claims"),
    draftsS:wAt(sc,"sends","It drafts"),checks:wAt(sc,"sends","Rohan checks"),sendsW:wAt(sc,"sends","and sends it"),
    r1:wAt(sc,"rule","Give every reader"),r2:wAt(sc,"rule","and only what")}));
  ag_shots(ctx,S,t,sc.dur,[
    // every pay day, Rohan's note to the deans; now the pay-day agent drafts it
    {later:true,at:0,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const pa=ag_in(tt,0.7,0.7);if(pa>0){cx.save();cx.globalAlpha*=pa;md_person(cx,"rohan",300,740,0.8,{t:tt,gaze:[3,0]});cx.restore();md_nameTag(cx,160,392,"rohan",{col:MD.dom.finance,a:pa});}
      const na=ag_in(tt,T.deans-0.4,0.5);mr_note(cx,600,250,760,{a:na,k:mr_k(tt,T.deans-0.4),rowA:MR_NOTE.map((r,i)=>ag_in(tt,T.each-0.2+i*0.3,0.4))});
      const aa=ag_in(tt,T.agentW-0.4,0.6);if(aa>0){cx.save();cx.globalAlpha*=aa;ag_model(cx,1600,420,80,{t:tt,core:0.8,think:ag_io(tt,T.draftsW-0.2,T.draftsW+2.4,0.4)});cx.restore();
        md_T(cx,"Finance's pay-day agent",1600,560,{w:700,size:28,align:"center",a:aa});}
      md_lane(cx,md_curve([1510,420],[1360,400],{bend:0.5}),MD.wait,ag_in(tt,T.draftsW-0.3,0.4),{u:ag_sine(clamp((tt-T.draftsW+0.3)/0.7,0,1)),dash:true,t:tt});
      md_pill(cx,1250,250,"Draft",{col:MD.wait,size:28,a:ag_in(tt,T.draftsW,0.4),k:mr_k(tt,T.draftsW)});}},
    // later: it asks Genie One through a tool server, and Genie One answers from the same definition
    {later:true,at:c.asks-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const aa=ag_in(tt,c.asks-0.1,0.5);if(aa>0){cx.save();cx.globalAlpha*=aa;ag_model(cx,200,480,70,{t:tt,core:0.8,think:ag_io(tt,T.tool,T.same+1,0.4)});cx.restore();md_T(cx,"The agent",200,600,{w:700,size:28,align:"center",a:aa});}
      const ts=mr_box(cx,360,425,330,{icon:"api",iconCol:MD.flow,title:"Tool server",sub:"for Genie One",a:ag_in(tt,T.tool-0.3,0.5),k:mr_k(tt,T.tool-0.3)});
      md_T(cx,"any agent can ask through it",525,580,{w:600,size:28,align:"center",col:MD.soft,a:ag_in(tt,T.any-0.2,0.5)});
      const gb=mr_box(cx,800,425,370,{logo:"databricks",title:"Genie One",sub:"answers questions",a:ag_in(tt,T.genie-0.3,0.5),k:mr_k(tt,T.genie-0.3),edge:ag_in(tt,T.answers,0.4)>0.5?MD.pass:null});
      const m=mr_measure(cx,1260,396,560,{a:ag_in(tt,T.answers-0.4,0.5),k:mr_k(tt,T.answers-0.4),lit:ag_io(tt,T.same-0.2,T.same+1.8,0.4)});
      md_way(cx,"api",[270,480],ts.l,tt,{u:ag_sine(clamp((tt-T.tool+0.1)/0.6,0,1)),a:ag_in(tt,T.tool-0.3,0.4)});
      md_way(cx,"api",ts.r,gb.l,tt,{u:ag_sine(clamp((tt-T.tool-0.4)/0.6,0,1)),a:ag_in(tt,T.tool+0.2,0.4)});
      md_way(cx,"query",gb.r,[m.x,m.y+m.h/2],tt,{u:ag_sine(clamp((tt-T.answers+0.2)/0.6,0,1)),a:ag_in(tt,T.answers-0.2,0.4)});}},
    // later: its instructions use a word the measure was given; like a car reading the signs, it reads a measure's words
    {later:true,at:c.words-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const ia=ag_in(tt,T.instr-0.3,0.5);if(ia>0){md_card(cx,100,230,780,250,{a:ia,glow:0.5});md_T(cx,"ITS INSTRUCTIONS",128,282,{w:800,size:28,ls:4,col:MD.soft,a:ia});
        mr_say(cx,128,340,720,[["Every pay day, draft the deans' note with each faculty's",null],["sessional teaching cost",MD.agreed],["so far.",null]],{a:ia,markA:ag_in(tt,T.sess-0.1,0.4)});
        if(ia>0.5){cx.save();cx.globalAlpha*=ag_in(tt,T.instr-0.3,0.5);ag_model(cx,820,230,34,{t:tt,core:0.8,think:0.2});cx.restore();}}
      const wb=mr_words(cx,980,190,840,{a:ag_in(tt,T.knows-0.5,0.5),k:mr_k(tt,T.knows-0.5),synLit:ag_in(tt,T.knows,0.5),
        litA:[ag_io(tt,T.nameW-0.1,T.nameW+1.2,0.3),ag_io(tt,T.desc-0.1,T.desc+1.4,0.3),ag_io(tt,T.synW-0.1,T.synW+1.6,0.3)]});
      // like a car reading the signs it passes
      const ca=ag_in(tt,T.carW-0.3,0.5);if(ca>0){cx.save();cx.globalAlpha*=ca;md_card(cx,100,560,780,250,{glow:0.3});rr(cx,124,690,732,96,10);cx.fillStyle="#111724";cx.fill();
        cx.setLineDash([30,24]);cx.strokeStyle="rgba(238,228,192,0.5)";cx.lineWidth=3;cx.beginPath();cx.moveTo(140,738);cx.lineTo(840,738);cx.stroke();cx.setLineDash([]);
        mr_sign(cx,"limit",720,628,84,{post:52});const u=clamp((tt-T.carW)/5.5,0,1),qx=lerp(170,560,ag_sine(u));mr_car(cx,qx,758,0,{});
        const rd=ag_io(tt,T.carW+0.6,T.reads+0.8,0.4);if(rd>0){cx.save();cx.globalAlpha*=rd;cx.globalCompositeOperation="lighter";cx.fillStyle=rgba(MD.flow,0.3);cx.beginPath();cx.moveTo(qx+30,748);cx.lineTo(684,604);cx.lineTo(756,652);cx.closePath();cx.fill();cx.restore();}
        md_T(cx,"reads the sign it passes",140,612,{w:600,size:28,col:MD.soft});cx.restore();}}},
    // later: it works alone, so it has a name of its own, and only what its job reads; it drafts, and Rohan checks and sends
    {later:true,at:c.alone-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const aa=ag_in(tt,c.alone-0.1,0.5);if(aa>0){cx.save();cx.globalAlpha*=aa;ag_model(cx,230,320,70,{t:tt,core:0.8,think:0.2});cx.restore();}
      mr_badge(cx,230,390,"finance-payday-agent",{t:tt,drop:40,a:ag_in(tt,T.own-0.3,0.5)});
      md_tag(cx,420,280,"Every pay day, on its own",{col:MD.soft,icon:"clock",a:ag_in(tt,T.sched-0.3,0.5)});
      md_tag(cx,420,350,"The same rules as people",{col:MD.soft,icon:"person",a:ag_in(tt,T.rules-0.3,0.5)});
      mr_list(cx,100,520,780,"What it may read",[[["Ask Genie One","EXECUTE"],MD.pass,"tick",ag_in(tt,T.may-0.2,0.4),MD.soft],[["Read the measure","SELECT"],MD.pass,"tick",ag_in(tt,T.measure-0.2,0.4),MD.soft],
        [["Read the claims","no"],MD.personal,"lock",ag_in(tt,T.cant-0.2,0.4),MD.soft]],{a:ag_in(tt,T.may-0.5,0.5),edge:MD.flow,kickCol:MD.flow});
      const na=ag_in(tt,c.alone+0.2,0.5),sent=ag_in(tt,T.sendsW,0.4);mr_note(cx,1060,250,760,{a:na,edge:sent>0.5?MD.pass:null});
      md_pill(cx,1710,250,sent>0.5?"Sent":"Draft",{col:sent>0.5?MD.pass:MD.wait,size:28,a:na,k:sent>0?mr_k(tt,T.sendsW):null});
      const ra=ag_in(tt,T.checks-0.3,0.5);if(ra>0){mr_who(cx,1100,640,MD.wait,ra);md_T(cx,"Rohan checks it",1146,650,{w:700,size:28,col:MD.wait,a:ra});}}},
    // later: the rule
    {later:true,at:c.rule-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const aa=ag_in(tt,c.rule-0.1,0.6);if(aa>0){cx.save();cx.globalAlpha*=aa;ag_model(cx,1560,460,96,{t:tt,core:0.8,think:0.15});cx.restore();mr_badge(cx,1560,556,"finance-payday-agent",{t:tt,drop:40,a:aa});}
      mr_rule(cx,150,360,1000,["A reader that works alone gets its own name,","and only what its job reads."],{a:ag_in(tt,T.r1-0.5,0.5),k:mr_k(tt,T.r1-0.5),lineA:[ag_in(tt,T.r1-0.2,0.4),ag_in(tt,T.r2-0.2,0.4)]});}}],0.5);
  MR_KICK(ctx,1);
});

/* ---------------------------------------------------------------- 5 · Outside, only the totals
   A group of universities outside reads the measure through OpenSharing, where it lives; Ingrid asks for totals by faculty, never
   by unit, because a unit with one tutor would give away that tutor's pay; so the share holds one small table made from the measure,
   for semesters that have ended. */
const MR_S1=[["Engineering and IT","A$2.48M"],["Health","A$2.21M"],["Arts and Education","A$1.96M"],["Business","A$1.38M"]];
const MR_TUTORS=[["HI101","12"],["HI112","7"],["HI205","5"],["HI305","1"]];
// the university and its platform, the measure in it, and the partner outside, as chapter 5 lays them out; returns their boxes
function mr_shareScene(ctx,tt,o){const U={x:440,y:230,w:760,h:560},ua=o.uni==null?1:o.uni;
  if(ua>0){md_card(ctx,U.x,U.y,U.w,U.h,{dash:[12,10],edge:MD.dim,a:ua*0.9});md_label(ctx,U.x+U.w/2,280,"The university",{align:"center",a:ua});}
  md_platform(ctx,470,310,700,450,{uc:true,ucText:"Unity Catalog",a:o.plat});
  const m=mr_measure(ctx,500,400,540,{sub:false,a:o.plat,lit:o.mLit});
  const p=md_reader(ctx,1360,250,500,{title:"A group of universities",sub:"compares teaching costs",icon:"share",a:o.partner,col:o.pCol||null,lit:o.pLit});
  return{U,m,p};}
scene("share",(ctx,S,t,sc)=>{const c=sc.cues,T=mr_once(sc,"T",()=>({
    outside:wAt(sc,"group","outside the university"),groupW:wAt(sc,"group","a group of universities"),fbf:wAt(sc,"group","faculty by faculty"),
    sam:wAt(sc,"share","Sam"),os:wAt(sc,"share","OpenSharing"),lives:wAt(sc,"share","where it lives"),copy:wAt(sc,"share","no copy"),
    ingridW:wAt(sc,"ingrid","Ingrid"),rule1:wAt(sc,"ingrid","totals by faculty"),never:wAt(sc,"ingrid","never by unit"),
    one:wAt(sc,"why","one tutor"),away:wAt(sc,"why","give away"),
    small:wAt(sc,"table","one small table"),made:wAt(sc,"table","made from the measure"),byF:wAt(sc,"table","by faculty"),ended:wAt(sc,"table","have ended"),
    readsW:wAt(sc,"reads","reads the same"),nothing:wAt(sc,"reads","nothing more"),r1:wAt(sc,"rule","Outside the platform"),r2:wAt(sc,"rule","and make it")}));
  ag_shots(ctx,S,t,sc.dur,[
    // a group of universities outside; Sam shares the measure with them through OpenSharing, read where it lives
    {later:true,at:0,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const B=mr_shareScene(cx,tt,{uni:ag_in(tt,0.6,0.6),plat:ag_in(tt,0.6,0.6),partner:ag_in(tt,T.groupW-0.3,0.5)});
      md_T(cx,"faculty by faculty, each semester",1610,410,{w:600,size:28,align:"center",col:MD.soft,a:ag_in(tt,T.fbf-0.2,0.5)});
      const sa=ag_in(tt,T.sam-0.4,0.6);if(sa>0){cx.save();cx.globalAlpha*=sa;md_person(cx,"sam",250,740,0.8,{t:tt,gaze:[3,0]});cx.restore();md_nameTag(cx,110,392,"sam",{col:MD.flow,a:sa});}
      md_way(cx,"share",B.m.r,[1360,565],tt,{u:ag_sine(clamp((tt-T.os+0.3)/0.9,0,1)),icon:true,label:"OpenSharing",a:ag_in(tt,T.os-0.4,0.4)});
      mr_box(cx,1360,510,500,{icon:"view",iconCol:MD.flow,title:"Casual teaching cost",sub:"read where it lives",dash:[10,9],edge:MD.flow,a:ag_in(tt,T.lives-0.2,0.5)});
      md_tag(cx,1360,690,"no copy to keep up to date",{col:MD.pass,icon:"tick",a:ag_in(tt,T.copy-0.2,0.5)});}},
    // later: Ingrid's rule, totals by faculty, never by unit: a unit with one tutor would give away that tutor's pay
    {later:true,at:c.ingrid-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const ia=ag_in(tt,c.ingrid-0.1,0.7);if(ia>0){cx.save();cx.globalAlpha*=ia;md_person(cx,"ingrid",300,740,0.8,{t:tt,gaze:[3,0]});cx.restore();md_nameTag(cx,160,392,"ingrid",{col:MD.sys.hr,a:ia});}
      mr_list(cx,620,250,700,"One more rule",[["Totals by faculty",MD.pass,"tick",ag_in(tt,T.rule1-0.2,0.4)],["Never by unit",MD.fail,"cross",ag_in(tt,T.never-0.2,0.4)]],{a:ag_in(tt,T.rule1-0.5,0.5),edge:MD.agreed,kickCol:MD.agreed});
      const ra=ag_in(tt,c.why-0.4,0.5),hl=ag_in(tt,T.one-0.2,0.4);
      md_rows(cx,640,500,[{h:"Unit",w:220,f:"mono"},{h:"Tutors",w:180}],MR_TUTORS,{a:ra,lit:hl>0.5?3:null,litCol:MD.personal});
      md_tag(cx,1090,743,"one tutor's pay",{col:MD.personal,icon:"lock",a:ag_in(tt,T.away-0.2,0.5)});}},
    // later: the share holds one small table made from the measure, by faculty, for semesters that have ended
    {later:true,at:c.table-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const ok=ag_in(tt,T.readsW-0.2,0.5),B=mr_shareScene(cx,tt,{uni:ag_in(tt,c.table-0.1,0.5),plat:ag_in(tt,c.table-0.1,0.5),partner:ag_in(tt,c.table-0.1,0.5),pCol:ok>0.5?MD.pass:null,pLit:ag_io(tt,T.readsW,T.nothing+1,0.4)});
      const ta=ag_in(tt,T.small-0.3,0.5),tb=md_table(cx,500,540,620,{name:"mart_finance__faculty_totals",kind:"made from the measure",a:ta,k:mr_k(tt,T.small-0.3),lit:ag_io(tt,T.made-0.1,T.made+1.4,0.4)});
      md_lane(cx,md_path([[770,B.m.y+118],[770,tb.y]]),MD.agreed,ag_in(tt,T.made-0.3,0.4),{u:ag_sine(clamp((tt-T.made+0.3)/0.6,0,1)),t:tt});
      md_way(cx,"share",tb.r,[1360,562],tt,{icon:true,label:"OpenSharing",a:ag_in(tt,T.small,0.5)});
      mr_sharedTable(cx,1360,510,500,"faculty_totals","Semester 1, 2026: ended",MR_S1,{a:ag_in(tt,T.small+0.3,0.5),edge:ok>0.5?MD.pass:null,rowA:MR_S1.map((r,i)=>ag_in(tt,T.byF-0.2+i*0.25,0.4)),semLit:ag_io(tt,T.ended-0.2,T.ended+1.6,0.4)});}},
    // later: the rule
    {later:true,at:c.rule-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const ia=ag_in(tt,c.rule-0.1,0.7);if(ia>0){cx.save();cx.globalAlpha*=ia;md_person(cx,"ingrid",1620,740,0.8,{t:tt,flip:true,gaze:[3,0]});cx.restore();md_nameTag(cx,1500,392,"ingrid",{col:MD.sys.hr,a:ia});}
      mr_rule(cx,150,360,1040,["Outside the platform, share the least a partner needs,","and make it from the definition."],{a:ag_in(tt,T.r1-0.5,0.5),k:mr_k(tt,T.r1-0.5),lineA:[ag_in(tt,T.r1-0.2,0.4),ag_in(tt,T.r2-0.2,0.4)]});}}],0.5);
  MR_KICK(ctx,1);
});

/* ---------------------------------------------------------------- 6 · One definition, every reader
   Pay day ends with one number in every reader, each seeing only what it may; like the signs agreed in Vienna, made once and read by
   people and machines, but every reader shows who it is; every reader is written down in the data project; the rules; the standards
   already there, the module's wheel; the convention still improving; and what comes next. */
const MR_EXPOS=[["casual_teaching_genie",{logo:"databricks"}],["budget_pack",{logo:"powerbi"}],["tutor_planning",{logo:"databricks"}],["finance_payday_agent",{agent:true}],["faculty_totals_share",{icon:"share"}]];
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,T=mr_once(sc,"T",()=>({
    one:wAt(sc,"back","one number"),genie:wAt(sc,"same","in Genie One"),pbi:wAt(sc,"same","in Power BI"),app:wAt(sc,"same","in the app"),draft:wAt(sc,"same","the agent's draft"),
    mayW:wAt(sc,"may","only what it may"),vienna:wAt(sc,"vienna","Vienna"),once:wAt(sc,"vienna","made once"),people:wAt(sc,"vienna","for people"),machines:wAt(sc,"vienna","machines"),
    anyone:wAt(sc,"unlike","anyone who passes"),shows:wAt(sc,"unlike","every reader shows"),written:wAt(sc,"known","written down"),change:wAt(sc,"known","a change to the measure"),names:wAt(sc,"known","names who it touches"),
    where:wAt(sc,"where","Read each measure"),who:wAt(sc,"who","Let each reader"),least:wAt(sc,"least","share the least"),
    wheel:wAt(sc,"wheel","standards"),reinvent:wAt(sc,"wheel","reinvent the wheel"),inv:wAt(sc,"iterate","Investigate"),iter:wAt(sc,"iterate","iterate"),docs:wAt(sc,"iterate","official docs"),
    conv:wAt(sc,"still","convention"),force:wAt(sc,"still","comes into force"),nextW:wAt(sc,"next","Next")}));
  ag_shots(ctx,S,t,sc.dur,[
    // pay day ends with one number, in every reader, and each sees only what it may
    {later:true,at:0,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const ua=ag_in(tt,0.6,0.6);if(ua>0){md_card(cx,90,190,1740,520,{dash:[12,10],edge:MD.dim,a:ua*0.9});md_label(cx,960,240,"The university",{align:"center",a:ua});}
      mr_measure(cx,MR_M.x,MR_M.y,MR_M.w,{a:ua,lit:ag_io(tt,T.one-0.2,T.one+1.6,0.4)});
      md_pill(cx,960,318,"Health, so far: A$1.84M",{col:MD.agreed,size:28,a:ag_in(tt,T.one-0.2,0.4),k:mr_k(tt,T.one-0.2)});
      const at_={people:T.genie,bi:T.pbi,app:T.app,agent:T.draft,partner:T.mayW},key=ag_in(tt,T.mayW-0.3,0.5);
      MR_READERS.forEach(R=>{const t0=at_[R.k],a=ag_in(tt,t0-0.3,0.4),lane=ag_sine(clamp((tt-t0+0.2)/0.8,0,1));mr_reader(cx,R,{a,lane,t:tt,flow:key});
        if(R.k!=="partner")mr_says(cx,R,"A$1.84M",{a:ag_in(tt,t0+0.4,0.4)});else mr_says(cx,R,"totals by faculty",{a:ag_in(tt,t0+0.3,0.4)});
        mr_key(cx,R.x+R.w-30,R.y-4,MD.pass,key*a);});}},
    // later: like the signs agreed in Vienna, made once, for people, and machines read them too; but every reader of data shows who it is
    {later:true,at:c.vienna-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const la=ag_in(tt,T.vienna-0.3,0.5),ra=ag_in(tt,T.once-0.4,0.5),pp=ag_in(tt,T.people-0.2,0.4),mc=ag_in(tt,T.machines-0.2,0.4),sh=ag_in(tt,T.shows-0.2,0.5);
      md_label(cx,520,250,"Vienna, 1968",{align:"center",a:la});
      mr_sign(cx,"warn",360,430,130,{a:la});mr_sign(cx,"limit",520,430,120,{a:la});mr_sign(cx,"must",680,430,120,{a:la});
      md_tag(cx,520,580,"defined once",{align:"center",col:MD.agreed,icon:"contract",a:la});
      mr_who(cx,420,700,MD.ink,pp);mr_car(cx,640,710,-Math.PI/2,{a:mc,lights:0.25});
      md_T(cx,"read by anyone who passes",520,820,{w:600,size:28,align:"center",col:MD.soft,a:ag_in(tt,T.anyone-0.2,0.5)});
      md_label(cx,1400,250,"The university, 2026",{align:"center",a:ra});
      mr_measure(cx,1140,370,520,{sub:false,a:ra});
      md_tag(cx,1400,580,"defined once",{align:"center",col:MD.agreed,icon:"contract",a:ra});
      mr_who(cx,1300,700,MD.ink,pp*ra);if(mc*ra>0){cx.save();cx.globalAlpha*=mc*ra;ag_model(cx,1500,700,34,{t:tt,core:0.8,think:0.1});cx.restore();}
      mr_key(cx,1326,728,MD.pass,sh,{r:16,s:20});mr_key(cx,1530,728,MD.pass,sh,{r:16,s:20});
      md_T(cx,"every reader shows who it is",1400,820,{w:700,size:28,align:"center",col:MD.pass,a:sh});}},
    // later: every reader written down in the data project, so a change to the measure names who it touches
    {later:true,at:c.known-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const wa=ag_in(tt,T.written-0.4,0.5);md_window(cx,180,200,1560,640,{logo:"dbt",product:"dbt",title:"Exposures: who reads the measure",a:wa,k:mr_k(tt,T.written-0.4),draw:(b,bd)=>{
        const ch=ag_io(tt,T.change-0.1,T.change+2.6,0.4),m=mr_measure(b,bd.x+40,bd.y+190,480,{sub:false,lit:ch});
        if(ch>0)md_pill(b,bd.x+280,bd.y+150,"a change",{col:MD.wait,size:28,a:ch});
        MR_EXPOS.forEach(([n,o],i)=>{const y=bd.y+24+i*96,ea=ag_in(tt,T.written-0.1+i*0.2,0.4),lit=ag_io(tt,T.names-0.2+i*0.18,T.names+2.4,0.3);
          const pts=md_curve([m.x+m.w,m.y+59],[bd.x+880,y+36],{bend:0.5});md_lane(b,pts,lit>0.5?MD.wait:MD.agreed,ea*0.9,{t:tt});if(lit>0)md_flow(b,pts,tt,{col:MD.wait,a:lit,every:1.2});
          mr_expo(b,bd.x+880,y,560,n,Object.assign({a:ea,lit,t:tt},o));});}});}},
    // later: the rules, together
    {later:true,at:c.where-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      mr_rule(cx,300,380,1320,["Read each measure where it's defined, through a door that carries it.","Read as the person it acts for, or as itself, with only what it needs.","Outside, share the least."],
        {kick:"Every reader",a:ag_in(tt,T.where-0.5,0.5),k:mr_k(tt,T.where-0.5),lineA:[ag_in(tt,T.where-0.2,0.4),ag_in(tt,T.who-0.2,0.4),ag_in(tt,T.least-0.2,0.4)]});}},
    // later: the standards already there, the wheel; the convention still improving; and what comes next
    {later:true,at:c.wheel-0.6,place:"map",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      const wa=ag_in(tt,T.wheel-0.3,0.5);md_mark(cx,760,380,100,(tt-T.wheel+0.2)/2.2,wa);
      md_T(cx,"Investigate · adapt · implement · iterate",760,560,{w:700,size:36,align:"center",a:ag_in(tt,T.inv-0.2,0.6)});
      md_tag(cx,760,640,"Start from the official docs",{align:"center",col:MD.flow,icon:"doc",a:ag_in(tt,T.docs-0.3,0.5)});
      const sa=ag_in(tt,T.conv-0.3,0.5);mr_sign(cx,"warn",1500,390,150,{a:sa,k:mr_k(tt,T.conv-0.3)});
      md_tag(cx,1500,560,"New text in force 12 November 2026",{align:"center",col:MD.agreed,icon:"clock",a:ag_in(tt,T.force-0.3,0.5)});
      md_textCard(cx,560,700,800,{kick:"Next",title:"Files as data and as context"},{icon:"doc",a:ag_in(tt,T.nextW-0.2,0.5),k:mr_k(tt,T.nextW-0.2)});}},
    // later: the map left bare, so the end card's words come in over nothing
    {later:true,at:c.breath+0.1,place:"map",keys:[[0,960,540,1.0]],push:0,draw:()=>{}}],0.5);
  MR_KICK(ctx,1-ag_in(t,c.breath,0.6));
  md_end(ctx,S,t,c.breath,"More readers than people","One definition, every reader","Film 3 of 3","From tables to decisions");
});

// on the map, one room: each chapter after the first glides on from where the last one leaves the camera
ag_cutInto(["door","app","agent","share","close"]);
