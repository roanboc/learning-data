/* ===== Moving is easy, agreeing is the work: the scenes =====
   Five chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The railway at Albury is one room
   (the place "night"), the university's map another (the place "map"). In each the camera never jumps: a chapter is one long shot
   whose camera glides from one framing to the next, and what comes and goes fades on its own. The map's chapters run on from each
   other (ag_cutInto): the next one's camera starts where the last one's is, and what both show is drawn the same. People, cards and
   the kicker are drawn in the frame (mv_scr), so their words keep their size; they come in once the camera has arrived. */

/* ---------------------------------------------------------------- 1 · A break of gauge */
scene("gauge",(ctx,S,t,sc)=>{
  const T={tJune:wAt(sc,"june","June"),tMurray:wAt(sc,"june","Murray River"),tBorder:wAt(sc,"june","the border"),tNSW:wAt(sc,"june","New South Wales"),tVic:wAt(sc,"june","Victoria"),
    tAlbury:wAt(sc,"bridge","At Albury"),tBridge:wAt(sc,"bridge","a new bridge"),tSydney:wAt(sc,"bridge","from Sydney"),tMelb:wAt(sc,"bridge","from Melbourne"),
    tOwn:wAt(sc,"gauge","its own gauge"),tDist:wAt(sc,"gauge","the distance"),tVicR:wAt(sc,"wider","Victoria's rails"),tHand:wAt(sc,"wider","a hand's length"),tNo:wAt(sc,"wider","no train"),
    tPass:wAt(sc,"change","every passenger"),tCrate:wAt(sc,"change","every crate"),tTime:wAt(sc,"cost","travellers time"),tMoney:wAt(sc,"cost","traders money"),
    tReasons:wAt(sc,"reasons","its reasons"),tChanged:wAt(sc,"reasons","changed its gauge"),tKept:wAt(sc,"reasons","Victoria kept"),
    tYears:wAt(sc,"years","seventy-nine years"),tSomething:wAt(sc,"years","Something had to change"),
    t1962:wAt(sc,"agreed","nineteen sixty-two"),tGov:wAt(sc,"agreed","Australia's government"),tOpened:wAt(sc,"agreed","opened a new line"),tOne:wAt(sc,"agreed","one agreed gauge"),
    tFreight:wAt(sc,"through","Freight ran"),tApril:wAt(sc,"through","from April"),tNobody:wAt(sc,"through","nobody changing"),tThird:wAt(sc,"third","by a third"),
    tUni:wAt(sc,"files","At the university"),tHRc:wAt(sc,"files","HR's contracts"),tFile:wAt(sc,"files","as a file"),
    tRohan:wAt(sc,"days","Rohan Desai's"),tTwo:wAt(sc,"days","two days"),tColumn:wAt(sc,"days","each column"),
    tNever:wAt(sc,"hard","never the hard part"),tAgree:wAt(sc,"hard","Agree what it means"),tPasses:wAt(sc,"hard","passes straight through")};
  const B=sc.cues.breath;
  ag_shots(ctx,S,t,sc.dur,[
    // 1883: the river and the two colonies; the two railways meet at Albury, over a new bridge; their gauges; everything lifted from
    // one train to the other; the reasons, and 79 years; 1962, one agreed gauge, and trains that run straight through
    {at:0,place:"night",d:2.2,push:0.02,keys:[[0,700,560,1.55],[T.tBorder-0.4,960,540,1.0],[T.tAlbury-0.3,900,580,1.16],[T.tOwn-0.5,800,610,2.0],[T.tPass-0.6,880,598,1.42],
      [T.tReasons-0.4,960,540,1.0]],draw:(c,tt)=>{
      const trains=ag_in(tt,T.tPass-0.4,0.8)*(1-ag_in(tt,T.tFreight-0.2,0.8)),xfer=ag_in(tt,T.tPass,0.6)*(1-ag_in(tt,T.tFreight,0.8));
      // close in, the names leave; drawn back, Melbourne and Sydney return once the camera has nearly arrived, so no name is cut by the frame's edge
      const close=ag_io(tt,T.tOwn-0.7,T.tReasons-0.5,0.5);
      mv_railMap(c,tt,{labels:ag_in(tt,T.tBorder,0.8)*(1-close),cities:1-ag_io(tt,T.tOwn-0.7,T.tReasons+1.1,0.5),albury:1-ag_io(tt,T.tOwn-0.3,T.tPass-0.7,0.4),uN:clamp((tt-T.tSydney+0.1)/1.3,0,1),uV:clamp((tt-T.tMelb+0.1)/1.3,0,1),plat:ag_in(tt,T.tAlbury-0.1,0.6),
        bridge:ag_io(tt,T.tBridge,T.tSydney+0.6,0.4)+0.0001,trains,transfers:xfer,gold:clamp((tt-T.tOpened)/2.6,0,1),through:tt-T.tFreight+0.4,passenger:tt-T.tApril-0.2});
      // why each kept its gauge, under each colony's name; and the agreed line's words, beside it
      md_tag(c,370,420,"kept the first gauge, 1,600 mm",{col:MD.soft,align:"center",a:ag_io(tt,T.tKept-0.1,T.t1962-0.3)});
      md_tag(c,1250,420,"changed with a new engineer, 1,435 mm",{col:MD.soft,align:"center",a:ag_io(tt,T.tChanged-0.1,T.t1962-0.3)});
      md_tag(c,430,430,"one agreed gauge, 1,435 mm",{col:MD.agreed,align:"center",icon:"contract",a:ag_in(tt,T.tOne,0.5)});
      mv_scr(c,S,()=>{
        // the year, and then the years
        const y1=ag_io(tt,T.tJune-0.2,T.tYears-0.3),y2=ag_io(tt,T.tYears,T.t1962-0.2),y3=ag_in(tt,T.t1962,0.4);
        mv_year(c,"June 1883",y1);mv_year(c,"1883 to 1962: 79 years",y2);mv_year(c,"1962",y3);
        // the gauge, end-on
        const gk=(tt-T.tOwn-0.6)/0.5;mv_gaugeCard(c,1100,96,{k:gk,a:ag_in(gk,0,0.3)*(1-ag_in(tt,T.tPass-0.9,0.5)),nsw:ag_in(tt,T.tDist,0.6),vic:ag_in(tt,T.tVicR,0.6),diff:ag_in(tt,T.tHand,0.6)});
        // what it cost
        const ca=1-ag_in(tt,T.tReasons-0.6,0.5);md_tag(c,560,836,"time, for every traveller",{col:MD.wait,icon:"clock",a:ag_in(tt,T.tTime-0.1,0.4)*ca});
        md_tag(c,1000,836,"money, for every trader",{col:MD.wait,icon:"batch",a:ag_in(tt,T.tMoney-0.1,0.4)*ca});
        md_pill(c,960,836,"Freight: up by a third in a year",{col:MD.pass,icon:"tick",a:ag_in(tt,T.tThird-0.1,0.4),k:(tt-T.tThird+0.1)/0.5});
      });}},
    // the university: HR's contracts once went to Finance as a file each teaching period, and its columns took Rohan's team two days
    {at:T.tUni-0.5,place:"map",dis:0.9,keys:[[0,640,470,1.25],[B+0.6,960,540,1]],d:2.2,push:0,draw:(c,tt)=>{const f=1-ag_in(tt,B,0.6);if(f<=0)return;c.save();c.globalAlpha*=f;  // gone before the title's words come in
      const P_={hr:ag_in(tt,T.tUni,0.6),fin:ag_in(tt,T.tUni+0.3,0.6)};mv_map(c,tt,{parts:P_});
      // the file's way: out of the HR system and into Finance's, a whole file each teaching period; once agreed, each change runs through
      const pts=md_path([[440,305],[560,305],[560,615],[440,615]]),ag_=ag_in(tt,T.tAgree,0.8);md_lane(c,pts,MD.flow,ag_in(tt,T.tHRc,0.5)*0.8,{u:clamp((tt-T.tHRc)/0.8,0,1)});
      if(tt>T.tFile-0.2)md_flow(c,pts,tt,{kind:"batch",a:1-ag_,every:4.2,off:T.tFile-0.2});if(ag_>0)md_flow(c,pts,tt,{kind:"events",a:ag_,every:0.7,off:T.tAgree});
      if(ag_>0){c.save();c.globalAlpha*=ag_;const m=[560,460];glow(c,m[0],m[1],70,MD.agreed,0.5);c.beginPath();c.arc(m[0],m[1],30,0,TAU);c.fillStyle="rgba(7,12,26,0.97)";c.fill();c.strokeStyle=rgba(MD.agreed,1);c.lineWidth=2.6;c.stroke();md_icon(c,"contract",m[0],m[1],34,MD.agreed);c.restore();}
      mv_scr(c,S,()=>{const k=(tt-T.tFile+0.1)/0.5;mv_columns(c,1000,110,{k,a:ag_in(k,0,0.3),q:ag_in(tt,T.tColumn,0.6),agreed:ag_});
        md_tag(c,1000,560,"two days, each teaching period",{col:MD.wait,icon:"clock",a:ag_in(tt,T.tTwo-0.1,0.4)*(1-ag_in(tt,T.tAgree+0.4,0.6))});
        const ra=ag_in(tt,T.tRohan-0.2,0.6);if(ra>0){c.save();c.globalAlpha*=ra;md_person(c,"rohan",1640,792,0.9,{t:tt,flip:true,gaze:[4,-1]});c.restore();
          md_nameTag(c,1360,700,"rohan",{role:"Finance",col:MD.dom.finance,align:"right",a:ra});}});c.restore();}}
  ],0.6);
  md_title(ctx,S,t,B,"Moving is easy, agreeing is the work","what still needs people when the tools move the data","FILM 1 OF 3 · DATA THAT MOVES");
});

/* ---------------------------------------------------------------- 2 · What got easier */
scene("promise",(ctx,S,t,sc)=>{
  const T={tMDB:wAt(sc,"module","Modern data basics"),tEasier:wAt(sc,"module","what the tools"),
    tMove:wAt(sc,"teams","Moving data"),tRun:wAt(sc,"teams","running a platform"),tServe:wAt(sc,"teams","serving data"),tRead:wAt(sc,"teams","reading documents"),tTeams:wAt(sc,"teams","whole teams"),
    tDbx:wAt(sc,"now","Databricks"),tDbt:wAt(sc,"now","dbt"),tMuch:wAt(sc,"now","much of it"),
    tGot:wAt(sc,"each","what got easier"),tStill:wAt(sc,"each","what still needs"),tDocs:wAt(sc,"each","the official docs"),
    tDeep:wAt(sc,"light","go deep"),tCourses:wAt(sc,"light","courses"),tArch:wAt(sc,"advice","architectural advice"),tMatters:wAt(sc,"advice","what matters"),
    tStory:wAt(sc,"linh","Our story"),tLinh:wAt(sc,"linh","Linh Nguyen"),tT:wAt(sc,"linh","contract T"),
    tBorn:wAt(sc,"born","born in"),tHRsys:wAt(sc,"born","the HR system"),tShapes:wAt(sc,"born","two shapes"),
    tEvents:wAt(sc,"events","Events"),tRecorded:wAt(sc,"events","HR recorded"),tJuly14:wAt(sc,"events","fourteenth of July"),tReached:wAt(sc,"events","reached the platform"),
    tBatches:wAt(sc,"batch","And batches"),tJuly20:wAt(sc,"batch","twentieth of July"),tWhole:wAt(sc,"batch","whole file"),
    tNames:wAt(sc,"eip","have had names"),tHohpe:wAt(sc,"eip","Hohpe"),tEIP:wAt(sc,"eip","Enterprise Integration Patterns"),tLittle:wAt(sc,"takes","how little")};
  ag_shots(ctx,S,t,sc.dur,[
    // the module's promise: four things that used to take whole teams, which the tools now do much of
    {at:0,place:"map",keys:[[0,960,540,1]],push:0,draw:(c,tt)=>mv_scr(c,S,()=>{
      md_T(c,"Modern data basics",960,262,{w:800,size:56,align:"center",a:ag_in(tt,T.tMDB-0.2,0.6)});md_T(c,"what the tools now make easier",960,318,{w:600,size:32,align:"center",col:MD.flow,a:ag_in(tt,T.tEasier,0.6)});
      const n=[T.tMove,T.tRun,T.tServe,T.tRead].reduce((s,q)=>s+clamp((tt-q+0.1)/0.5,0,1),0),e=ag_in(tt,T.tMuch-0.2,0.8);mv_four(c,380,{n,teams:ag_in(tt,T.tTeams,0.8)*(1-ag_in(tt,T.tDbx-0.5,0.5)),easier:e});
      // Databricks and dbt, where the teams were
      const la=ag_in(tt,T.tDbx-0.1,0.5);if(la>0)mv_logos(c,666,la,ag_in(tt,T.tDbt-0.1,0.5));
      mv_threeTags(c,790,[T.tGot,T.tStill,T.tDocs].reduce((s,q)=>s+clamp((tt-q+0.1)/0.5,0,1),0));})},
    // light on purpose: the depth is in courses and the docs; here, the architectural advice
    {at:T.tDeep-0.7,later:true,dis:0.5,place:"map",keys:[[0,960,540,1]],push:0,draw:(c,tt)=>mv_scr(c,S,()=>{
      md_label(c,960,250,"Light on purpose",{align:"center",size:32,col:MD.ink});
      md_textCard(c,200,330,700,{kick:"Courses and the official docs",title:"Go deep, and stay up to date"},{icon:"doc",a:ag_in(tt,T.tCourses-0.1,0.5),k:(tt-T.tCourses+0.1)/0.5});
      md_textCard(c,1020,330,700,{kick:"These films",title:"The architectural advice: what matters, what to choose, and why"},{edge:MD.flow,icon:"view",a:ag_in(tt,T.tArch-0.1,0.5),k:(tt-T.tArch+0.1)/0.5});})},
    // the story's one contract: Linh's, born in the HR system; it reaches the platform as one change, and in the whole file again
    {at:T.tStory-0.7,later:true,dis:0.5,place:"map",keys:[[0,960,540,1]],push:0,draw:(c,tt)=>{
      const go=ag_in(tt,T.tBorn+0.2,0.7),eb=ag_io(tt,T.tNames-0.2,T.tLittle-0.4,0.5);
      mv_map(c,tt,{a:mv_back(eb),parts:{hr:ag_in(tt,T.tHRsys-0.2,0.6),plat:ag_in(tt,T.tShapes-0.3,0.7),bronze:ag_in(tt,T.tShapes,0.6),tHR:ag_in(tt,T.tShapes+0.3,0.6)},
        ways:{connector:{u:clamp((tt-T.tEvents)/0.9,0,1),a:1,icon:0,label:0,flow:tt>T.tLittle}},lit:{hr:ag_io(tt,T.tHRsys-0.2,T.tShapes,0.5)},
        packet:tt<T.tBatches?{kind:"events",u:(tt-T.tRecorded)/(T.tReached-T.tRecorded+0.5)}:{kind:"batch",u:(tt-T.tJuly20)/(T.tWhole-T.tJuly20+1.0)},landed:ag_io(tt,T.tReached+0.5,T.tReached+1.8,0.4)+ag_io(tt,T.tWhole+1.0,T.tWhole+2.2,0.4)});
      md_tag(c,60,428,"14 July · one change",{col:MD.flow,icon:"event",a:ag_io(tt,T.tJuly14-0.1,T.tBatches-0.2,0.4)});
      md_tag(c,60,428,"20 July · the whole file",{col:MD.flow,icon:"batch",a:ag_io(tt,T.tJuly20-0.1,T.tNames-0.4,0.4)});
      mv_scr(c,S,()=>{
        // Linh, and her contract, which goes into the HR system as she leaves: she never sees it move
        const la=ag_in(tt,T.tStory-0.4,0.6)*(1-go);if(la>0){c.save();c.globalAlpha*=la;md_person(c,"linh",330,790,0.9,{t:tt,gaze:[4,-1]});c.restore();md_nameTag(c,600,560,"linh",{role:"Casual tutor, HI101",a:la});}
        const ck=(tt-T.tT+0.6)/0.5,cu=ag_sine((tt-T.tBorn)/0.9);if(cu<1)mv_deco(cu>0.03,()=>{c.save();c.globalAlpha*=1-ag_in(cu,0.7,0.3);const cx=lerp(760,140,cu),cy=lerp(300,262,cu),sc_=lerp(1,0.3,cu);ag_about(c,cx,cy,sc_);mv_contractT(c,cx,cy,{k:ck,a:ag_in(ck,0,0.3)});c.restore();});
        // events, messages and batches, named twenty years ago
        const ea=ag_io(tt,T.tNames-0.2,T.tLittle-0.4,0.5);if(ea>0){md_veil(c,S,0.78*ea);setScreen(c,S);
          md_textCard(c,560,250,800,{kick:"2003",title:"Enterprise Integration Patterns",sub:"Gregor Hohpe and Bobby Woolf"},{icon:"doc",a:ea,k:(tt-T.tNames+0.2)/0.5});
          [["event","Events"],["doc","Messages"],["batch","Batches"]].forEach(([ic,s],i)=>md_tag(c,620+i*240,560,s,{col:MD.flow,icon:ic,a:ea*ag_in(tt,T.tEIP+i*0.25,0.4)}));}});}}
  ],0.6);
  mv_kicker(ctx,S,ag_in(t,0.8,0.6));  // once the title card has faded with chapter 1 (0.8 s): it says the same words
});

/* ---------------------------------------------------------------- 3 · Five ways to move it */
scene("ways",(ctx,S,t,sc)=>{
  const T={tMC:wAt(sc,"connector","managed connector"),tBrings:wAt(sc,"connector","brings"),tSam:wAt(sc,"sam","Sam Okafor"),tPicked:wAt(sc,"sam","picked"),tTables:wAt(sc,"sam","the tables"),
    tReads:wAt(sc,"keeps","reads only"),tTries:wAt(sc,"keeps","tries again"),tKeeps:wAt(sc,"keeps","keeps its place"),tLands:wAt(sc,"bronze","lands in bronze"),tSent:wAt(sc,"bronze","sent it"),
    tQuery:wAt(sc,"query","A query in place"),tWithout:wAt(sc,"query","without copying"),tLedger:wAt(sc,"ledger","general ledger"),tReadsThere:wAt(sc,"ledger","reads it there"),tUnchanged:wAt(sc,"ledger","without changing"),
    tLarge:wAt(sc,"large","large volumes"),tRecommend:wAt(sc,"large","recommend a connector"),
    tMirror:wAt(sc,"mirror","A mirror"),tCatalog:wAt(sc,"mirror","catalog"),tOut:wAt(sc,"mirror","copying it out"),
    tRohan:wAt(sc,"rohan","Rohan works"),tFabric:wAt(sc,"rohan","Microsoft Fabric"),tAppear:wAt(sc,"rohan","appear there"),tLive:wAt(sc,"rohan","read where they live"),
    tShare:wAt(sc,"share","A share"),tPartner:wAt(sc,"share","a partner"),tProducts:wAt(sc,"share","Products in open formats"),tMarket:wAt(sc,"share","The marketplace"),
    tAPI:wAt(sc,"api","an API"),tAsks:wAt(sc,"api","an app asks"),tNeeds:wAt(sc,"api","just what it needs"),
    tEach:wAt(sc,"easy","Each does"),tHand:wAt(sc,"easy","by hand"),tEasy:wAt(sc,"easy","Moving is easy now")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"map",push:0.03,keys:[[0,960,540,1]],
      draw:(c,tt)=>{
      const rest=ag_in(tt,0.2,1.0)*0.35,full=(q)=>Math.max(rest,ag_in(tt,q,0.6));
      const ways={connector:{u:1,a:1,icon:ag_in(tt,T.tMC-0.1,0.5),label:ag_in(tt,T.tMC+0.2,0.5),lit:ag_io(tt,T.tMC,T.tSam,0.5)},
        query:{u:clamp((tt-T.tQuery)/1.0,0,1),a:1,lit:ag_io(tt,T.tQuery+0.6,T.tLedger,0.5)},mirror:{u:clamp((tt-T.tMirror)/1.0,0,1),a:1,lit:ag_io(tt,T.tMirror+0.6,T.tRohan,0.5)},
        share:{u:clamp((tt-T.tShare)/1.0,0,1),a:1,lit:ag_io(tt,T.tShare+0.6,T.tAPI,0.5)},api:{u:clamp((tt-T.tAPI)/1.0,0,1),a:1,lit:ag_io(tt,T.tAPI+0.6,T.tEach,0.5)}};
      // all five, lit one after another, once moving is easy
      MV_ORDER.forEach((k,i)=>{ways[k].lit=Math.max(ways[k].lit,ag_io(tt,T.tEach+0.3+i*0.35,T.tEach+1.2+i*0.35,0.35));});
      const sa=ag_io(tt,T.tSam-0.3,T.tLands-1.0,0.5),ra=ag_io(tt,T.tRohan-0.3,T.tShare-0.8,0.5),vl=Math.max(sa,ra);
      mv_map(c,tt,{a:mv_back(vl),parts:{hr:1,plat:1,bronze:1,tHR:1,fin:full(T.tLedger-0.2),tGL:full(T.tQuery+0.6),fabric:full(T.tCatalog),partner:full(T.tPartner),app:full(T.tAsks)},ways,
        lit:{tGL:ag_io(tt,T.tReadsThere-0.2,T.tLarge,0.5),fin:ag_io(tt,T.tLedger,T.tReadsThere,0.5),fabric:ag_io(tt,T.tFabric,T.tShare,0.5)},
        packet:{kind:"events",u:(tt-T.tLands+1.2)/1.4},landed:ag_io(tt,T.tLands+0.1,T.tQuery-0.4,0.5)});
      mv_scr(c,S,()=>{
        // Sam, and the connector he set up
        if(sa>0){md_veil(c,S,0.45*sa);setScreen(c,S);c.save();c.globalAlpha*=sa;md_person(c,"sam",300,800,0.9,{t:tt,gaze:[4,-1]});c.restore();
          md_nameTag(c,520,640,"sam",{col:MD.flow,a:sa});const k=(tt-T.tPicked+0.2)/0.5;
          mv_connectorPage(c,780,150,{k,a:sa*ag_in(k,0,0.3),rows:clamp((tt-T.tPicked)/0.5,0,1)+clamp((tt-T.tTables)/0.5,0,1),does:[T.tReads,T.tTries,T.tKeeps].reduce((s,q)=>s+clamp((tt-q+0.1)/0.5,0,1),0)});}
        // what each way does, in a word, at the foot of the frame
        const foot=(s,ic,t0,t1,col)=>md_tag(c,960,854,s,{col:col||MD.flow,icon:ic,align:"center",a:ag_io(tt,t0,t1,0.4)});
        foot("T-26188, just as the HR system sent it","event",T.tLands,T.tQuery-0.5);
        foot("read in place, never changed","eye",T.tReadsThere-0.1,T.tLarge-0.4);
        foot("large volumes or quick answers: a connector","connector",T.tLarge+0.2,T.tMirror-0.5);
        foot("Products in open formats · The marketplace","share",T.tProducts-0.1,T.tAPI-0.4,MD.soft);
        foot("on request: just what it needs","api",T.tAsks,T.tEach-0.4);
        md_pill(c,960,854,"Moving is easy now",{col:MD.pass,icon:"tick",a:ag_in(tt,T.tEasy-0.1,0.4),k:(tt-T.tEasy+0.1)/0.5});
        // Rohan, and Fabric with the university's catalog in it
        if(ra>0){md_veil(c,S,0.45*ra);setScreen(c,S);c.save();c.globalAlpha*=ra;md_person(c,"rohan",1640,800,0.9,{t:tt,flip:true,gaze:[4,-1]});c.restore();
          md_nameTag(c,1400,640,"rohan",{role:"Finance",col:MD.dom.finance,align:"right",a:ra});const k=(tt-T.tFabric+0.2)/0.5;
          mv_fabricPage(c,120,150,{k,a:ra*ag_in(k,0,0.3),n:clamp((tt-T.tAppear+0.2)/0.35,0,4)+clamp((tt-T.tLive)/0.5,0,1)});}});}}
  ],0.6);
  mv_kicker(ctx,S,1);
});

/* ---------------------------------------------------------------- 4 · The work that's left */
scene("contract",(ctx,S,t,sc)=>{
  const T={tLeft:wAt(sc,"left","what's left"),tContract:wAt(sc,"left","The contract"),tInterface:wAt(sc,"left","each interface"),tMeet:wAt(sc,"left","two systems meet"),
    tIngrid:wAt(sc,"ingrid","Ingrid Holm"),tOwns:wAt(sc,"ingrid","owns"),tNoor:wAt(sc,"noor","Noor Rahman"),tAgrees:wAt(sc,"noor","agrees its contract"),
    tFirst:wAt(sc,"fields","First"),tPay:wAt(sc,"fields","Pay type"),tCAS:wAt(sc,"fields","C Eh S"),tFT:wAt(sc,"fields","F T"),tCON:wAt(sc,"fields","C O N"),
    tCont:wAt(sc,"con","continuing"),tNot:wAt(sc,"con","not contract"),tWrong:wAt(sc,"con","Read it wrong"),
    tSecond:wAt(sc,"owner","Second"),tByName:wAt(sc,"owner","by name"),tThird:wAt(sc,"delete","Third"),tCancelled:wAt(sc,"delete","cancelled"),
    tArrives:wAt(sc,"arrive","how that arrives"),tChange:wAt(sc,"arrive","as a change"),tNever:wAt(sc,"arrive","never as a row"),tCloses:wAt(sc,"history","closes"),tHistory:wAt(sc,"history","keeps its history"),
    tFourth:wAt(sc,"personal","Fourth"),tNames:wAt(sc,"personal","Names"),tBank:wAt(sc,"never","Bank details"),
    tWrite:wAt(sc,"standard","write it down"),tODCS:wAt(sc,"standard","Open Data Contract Standard"),tJun:wAt(sc,"standard","Jun Park's"),tEvery:wAt(sc,"standard","every row"),
    tSilent:wAt(sc,"silent","Silent change"),tWatches:wAt(sc,"ahead","A platform that watches itself")};
  const W5=mv_allWays(1);
  // a gold seal at every interface, one after another
  const seals=tt=>({hr:ag_in(tt,T.tContract,0.6),fabric:ag_in(tt,T.tInterface+0.3,0.6)});
  ag_shots(ctx,S,t,sc.dur,[
    // the contract at each interface; Ingrid, who owns the HR system's data, and Noor, who agrees its contract with her
    {at:0,place:"map",push:0.02,keys:[[0,960,540,1]],draw:(c,tt)=>{
      const pa=ag_in(tt,T.tIngrid-0.4,0.6);mv_map(c,tt,{a:mv_back(pa),parts:MV_ALL,ways:W5,contracts:seals(tt)});
      mv_scr(c,S,()=>{if(pa<=0)return;md_veil(c,S,0.5*pa);setScreen(c,S);
        const ia=ag_in(tt,T.tIngrid-0.2,0.6),na=ag_in(tt,T.tNoor-0.2,0.6);
        if(ia>0){c.save();c.globalAlpha*=ia;md_person(c,"ingrid",330,800,0.92,{t:tt,gaze:[4,-1]});c.restore();md_nameTag(c,560,610,"ingrid",{role:"HR · owns the HR system's data",col:MD.sys.hr,a:ia});}
        if(na>0){c.save();c.globalAlpha*=na;md_person(c,"noor",1600,800,0.92,{t:tt,flip:true,gaze:[4,-1]});c.restore();md_nameTag(c,1370,610,"noor",{col:MD.flow,align:"right",a:na});}
        const sa=ag_in(tt,T.tAgrees,0.6);if(sa>0){c.save();c.globalAlpha*=sa;ag_about(c,960,330,lerp(0.6,1,ag_spr(tt,T.tAgrees,0.5)));glow(c,960,330,150,MD.agreed,0.45);c.beginPath();c.arc(960,330,74,0,TAU);c.fillStyle="rgba(7,12,26,0.97)";c.fill();
          c.strokeStyle=rgba(MD.agreed,1);c.lineWidth=3;c.stroke();md_icon(c,"contract",960,330,84,MD.agreed);c.restore();md_T(c,"the HR system's contract",960,470,{w:700,size:32,align:"center",col:MD.agreed,a:sa});}});}},
    // what they agree, part by part
    {at:T.tFirst-0.7,later:true,dis:0.5,place:"map",keys:[[0,960,540,1.02]],push:0,draw:(c,tt)=>{
      mv_map(c,tt,{a:0.44,parts:MV_ALL,ways:W5,contracts:{hr:1,fabric:1}});
      mv_scr(c,S,()=>{md_veil(c,S,0.6);setScreen(c,S);
        const part=ag_in(tt,T.tFirst-0.2,0.5)*1+ag_in(tt,T.tSecond-0.2,0.5)+ag_in(tt,T.tThird-0.2,0.5)+ag_in(tt,T.tFourth-0.2,0.5);
        // each part's detail leaves before the next comes in
        const show=(t0,t1)=>ag_in(tt,t0,0.45)*(t1==null?1:1-ag_in(tt,t1-0.55,0.4));
        mv_contractCard(c,{part,k:(tt-T.tFirst+0.6)/0.5,draw:(cc,b)=>{
          withA(cc,show(T.tFirst,T.tSecond),()=>mv_partMeaning(cc,b,{rows:[T.tCAS,T.tFT,T.tCON].reduce((s,q)=>s+clamp((tt-q+0.1)/0.4,0,1),0),con:ag_in(tt,T.tNot-0.1,0.5),wrong:ag_in(tt,T.tWrong,0.5)}));
          withA(cc,show(T.tSecond,T.tThird),()=>mv_partOwner(cc,b,{k:clamp((tt-T.tSecond)/0.5,0,1)}));
          withA(cc,show(T.tThird,T.tFourth),()=>mv_partDelete(cc,b,{cancel:ag_in(tt,T.tCancelled-0.1,0.5),arrive:ag_in(tt,T.tChange-0.1,0.5),never:ag_in(tt,T.tNever-0.1,0.5),history:ag_in(tt,T.tCloses-0.1,0.5)}));
          withA(cc,show(T.tFourth,null),()=>mv_partPersonal(cc,b,{marked:ag_in(tt,T.tNames-0.1,0.5),stays:ag_in(tt,T.tBank-0.1,0.5)}));}});});}},
    // written down in the open standard, and Jun's tests check every row against it
    {at:T.tWrite-0.6,later:true,dis:0.5,place:"map",keys:[[0,960,540,1.02]],push:0,draw:(c,tt)=>{
      mv_map(c,tt,{a:0.44,parts:MV_ALL,ways:W5,contracts:{hr:1,fabric:1}});
      mv_scr(c,S,()=>{md_veil(c,S,0.55);setScreen(c,S);const ja=ag_in(tt,T.tJun-0.3,0.6);
        if(ja>0){c.save();c.globalAlpha*=ja;md_person(c,"jun",300,800,0.9,{t:tt,gaze:[4,-1]});c.restore();md_nameTag(c,520,640,"jun",{col:MD.flow,a:ja});}
        const k=(tt-T.tWrite+0.2)/0.5;mv_testPage(c,720,150,{k,a:ag_in(k,0,0.3),n:clamp((tt-T.tODCS+0.2)/0.5,0,1)+clamp((tt-T.tJun)/0.6,0,1),pass:clamp((tt-T.tEvery)/0.5,0,1)});});}},
    // the films that go deeper: Silent change, and A platform that watches itself
    {at:T.tSilent-0.6,later:true,dis:0.5,place:"map",keys:[[0,960,540,1.02]],push:0,draw:(c,tt)=>{
      mv_map(c,tt,{a:0.44,parts:MV_ALL,ways:W5,contracts:{hr:1,fabric:1}});
      mv_scr(c,S,()=>{md_veil(c,S,0.55);setScreen(c,S);
        md_textCard(c,190,320,720,{kick:"Silent change",title:"A new value arrives, and only one side knows what it means"},{icon:"warn",a:ag_in(tt,T.tSilent-0.1,0.5),k:(tt-T.tSilent+0.1)/0.5});
        md_textCard(c,1010,320,720,{kick:"A platform that watches itself",title:"A field changes, and its contract doesn't"},{icon:"view",a:ag_in(tt,T.tWatches-0.1,0.5),k:(tt-T.tWatches+0.1)/0.5});});}}
  ],0.6);
  mv_kicker(ctx,S,1);
});

/* ---------------------------------------------------------------- 5 · One gauge */
scene("agreed",(ctx,S,t,sc)=>{
  const T={tRan:wAt(sc,"ran","the trains always ran"),tTook:wAt(sc,"ran","What took"),tAgreeing:wAt(sc,"ran","agreeing the gauge"),
    tNow:wAt(sc,"ours","Now"),tReach:wAt(sc,"ours","reach Rohan"),tDay:wAt(sc,"ours","the day they're made"),tMeaning:wAt(sc,"ours","meaning just"),tNobody:wAt(sc,"ours","nobody spends"),
    tStd:wAt(sc,"standards","standards"),tEIP:wAt(sc,"two","Enterprise Integration Patterns"),tODCS:wAt(sc,"two","Open Data Contract Standard"),
    tWheel:wAt(sc,"wheel","reinvent the wheel"),tInv:wAt(sc,"wheel","Investigate"),tAdapt:wAt(sc,"wheel","adapt"),tImpl:wAt(sc,"wheel","implement"),tIter:wAt(sc,"wheel","iterate"),tDocs:wAt(sc,"wheel","the official docs"),
    tStruggle:wAt(sc,"struggle","a struggle"),tGov:wAt(sc,"struggle","governance"),tTool:wAt(sc,"struggle","tooling"),tModules:wAt(sc,"struggle","other modules"),
    tLet:wAt(sc,"takeaway","Let the tools"),tSpend:wAt(sc,"takeaway","spend your time")};
  ag_shots(ctx,S,t,sc.dur,[
    // Albury, after 1962: the trains run straight through
    {at:0,place:"night",keys:[[0,960,540,1]],push:0.03,draw:(c,tt)=>{
      mv_railMap(c,tt,{gold:1,through:((tt+0.5)%7.4),passenger:((tt+4.2)%7.4)});
      md_tag(c,430,430,"one agreed gauge, 1,435 mm",{col:MD.agreed,align:"center",icon:"contract"});
      mv_scr(c,S,()=>mv_year(c,"1883 to 1962: 79 years to agree a gauge",ag_in(tt,T.tTook-0.2,0.5)*(1-ag_in(tt,T.tNow-0.9,0.4))));}},  // gone before the dissolve
    // the university now: HR's contracts reach Rohan in Fabric the day they're made, meaning what HR means
    {at:T.tNow-0.5,place:"map",dis:0.9,keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      const v=ag_in(tt,T.tStd-0.4,0.6),v2=ag_in(tt,T.tWheel-0.5,0.7);mv_map(c,tt,{a:mv_back(v)*(1-0.6*v2),parts:{hr:1,plat:1,bronze:1,tHR:1,fabric:1},ways:{connector:{u:1,a:1},mirror:{u:1,a:1,lit:ag_io(tt,T.tReach,T.tMeaning,0.5)}},contracts:{hr:1,fabric:ag_in(tt,T.tMeaning-0.2,0.6)},lit:{fabric:ag_io(tt,T.tReach,T.tStd,0.6)}});
      mv_scr(c,S,()=>{const ra=ag_in(tt,T.tReach-0.3,0.6)*(1-v);if(ra>0){c.save();c.globalAlpha*=ra;md_person(c,"rohan",1640,800,0.9,{t:tt,flip:true,gaze:[4,-1],smile:ag_in(tt,T.tNobody,0.8)*0.6});c.restore();
          md_nameTag(c,1400,640,"rohan",{role:"Finance",col:MD.dom.finance,align:"right",a:ra});}
        md_pill(c,760,854,"the day they're made, meaning what HR means",{col:MD.pass,icon:"clock",a:ag_in(tt,T.tDay-0.1,0.4)*(1-ag_in(tt,T.tStd-0.5,0.4)),k:(tt-T.tDay+0.1)/0.5});
        // the standards, the wheel, the struggle and the takeaway, each over a veil
        if(v<=0)return;md_veil(c,S,0.55*v+0.2*v2);setScreen(c,S);
        const sA=ag_io(tt,T.tStd-0.2,T.tWheel-0.4,0.45);
        md_textCard(c,190,330,720,{kick:"How data moves",title:"Enterprise Integration Patterns",sub:"Hohpe and Woolf"},{icon:"event",edge:MD.flow,a:sA*ag_in(tt,T.tEIP-0.1,0.5),k:(tt-T.tEIP+0.1)/0.5});
        md_textCard(c,1010,330,720,{kick:"What it means",title:"Open Data Contract Standard",sub:"an open standard for data contracts"},{icon:"contract",edge:MD.agreed,a:sA*ag_in(tt,T.tODCS-0.1,0.5),k:(tt-T.tODCS+0.1)/0.5});
        const wA=ag_io(tt,T.tWheel-0.2,T.tStruggle-0.4,0.45);
        if(wA>0){md_T(c,"Don't reinvent the wheel",960,200,{w:800,size:44,align:"center",a:wA});mv_wheel(c,960,470,{a:wA,p:(tt-T.tWheel)/1.6,n:[T.tInv,T.tAdapt,T.tImpl,T.tIter].reduce((s,q)=>s+clamp((tt-q+0.1)/0.4,0,1),0),docs:ag_in(tt,T.tDocs-0.1,0.5)});}
        const gA=ag_io(tt,T.tStruggle-0.2,T.tLet-0.4,0.45);
        if(gA>0){md_textCard(c,460,300,1000,{kick:"Still a struggle?",title:"Look first at your governance or your tooling",sub:"Other modules here show both."},{icon:"warn",edge:MD.wait,a:gA,k:(tt-T.tStruggle+0.2)/0.5});
          md_tag(c,700,600,"governance",{col:MD.agreed,icon:"contract",a:gA*ag_in(tt,T.tGov,0.4)});md_tag(c,1000,600,"tooling",{col:MD.flow,icon:"refresh",a:gA*ag_in(tt,T.tTool,0.4)});}});}}
  ],0.6);
  mv_kicker(ctx,S,ag_in(t,T.tNow+0.4,0.6)*(1-ag_in(t,T.tLet-0.6,0.6)));  // after the dissolve: the year's pill sat where it comes in
  // the end card comes in as the voice says the film's line, and holds through the last breath
  md_end(ctx,S,t,T.tLet-0.5,"Moving is easy, agreeing is the work","Let the tools move it; spend your time on the contract.","Film 1 of 3","Data that moves");
});

// the map's chapters run on from each other: the next one's camera starts where the last one's is, and only what changes fades
ag_cutInto(["ways","contract"]);
