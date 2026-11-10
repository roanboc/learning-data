/* ===== Hot, warm, cold: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (hw_places.js, and the module's map and night); what moves is drawn live in the shots of ag_shots. In one place the camera never
   jumps: most chapters are one shot on one place, its camera still, and what changes there fades or slides while the rest stays put.
   A new place dissolves in, since no two places here show the same people or words. Words drawn in the frame (dates, cards, pills)
   go through hw_scr, so they keep their size whatever the camera does, and come in once the camera has arrived. */

// a moment's date or time, at the top left of the frame
const HW_WHEN=[214,222,240];
function hw_when(ctx,S,text,a){if(!(a>0.004))return;hw_scr(ctx,S,()=>md_tag(ctx,96,96,text,{col:HW_WHEN,a}));}
// a card, pill or tag that comes in at t0 (cards and pills spring from their centre) and leaves at t1
function hw_cardAt(ctx,x,y,w,words,tt,t0,t1,o){const a=hw_io(tt,t0,t1==null?1e9:t1,0.4,0.4);if(a<=0.004)return;md_textCard(ctx,x,y,w,words,Object.assign({a,k:(tt-t0)/0.9},o||{}));}
function hw_pillAt(ctx,x,y,text,tt,t0,t1,o){const a=hw_io(tt,t0,t1==null?1e9:t1,0.35,0.4);if(a<=0.004)return;md_pill(ctx,x,y,text,Object.assign({a,k:(tt-t0)/0.9,size:28},o||{}));}
function hw_tagAt(ctx,x,y,text,tt,t0,t1,o){const a=hw_io(tt,t0,t1==null?1e9:t1,0.35,0.4);if(a<=0.004)return;md_tag(ctx,x,y,text,Object.assign({a},o||{}));}
// a person who comes in at t0 and leaves at t1, faded as one picture (md_person draws them whole, then lays them on at the context's opacity)
function hw_personAt(ctx,who,x,y,s,tt,t0,t1,o){const a=hw_io(tt,t0,t1==null?1e9:t1,0.6,0.6);if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;md_person(ctx,who,x,y,s,Object.assign({t:tt},o||{}));ctx.restore();}
// the night laid softly over the frame, for a turn in the story
function hw_dim(ctx,S,a){if(!(a>0.004))return;hw_scr(ctx,S,()=>{ctx.fillStyle="rgba(4,8,18,"+clamp(a,0,1).toFixed(3)+")";ctx.fillRect(0,0,W,H);});}
// two words, a label and its value, on one line of a card
function hw_pair(ctx,x,y,k,v,o){o=o||{};md_T(ctx,k,x,y,{w:600,size:28,col:MD.soft});md_T(ctx,v,x+(o.dx||200),y,{w:700,size:28,col:o.col||MD.ink});}

/* ---------------------------------------------------------------- 1 · The seed vault */
// the opening's lanes on the map: Aleppo's copies up to Svalbard, the copies sent back down to Lebanon and to Morocco, and the seeds a
// gene bank sends out to breeders
const hw_bz=(a,b,c,d)=>bez(P(a[0],a[1]),P(b[0],b[1]),P(c[0],c[1]),P(d[0],d[1]),40).map(p=>[p.x,p.y]);
const HW_LANES={up:hw_bz([1069,773],[1190,560],[1010,190],[765,120]),toLeb:hw_bz([765,120],[1010,190],[1180,560],[1065,811]),
  toMor:hw_bz([765,120],[560,250],[400,560],[471,814]),out:[[1300,690],[880,700],[1215,860]].map(p=>hw_arc([1069,773],p,50))};
// a few of the world's gene banks, unnamed: points of warm light
const HW_BANKS=[[612,606],[700,560],[842,520],[560,690],[930,640],[1180,612],[1340,520],[760,470]];

scene("vault",(ctx,S,t,sc)=>{
  const T={deep:wAt(sc,"feb","Deep"),open:wAt(sc,"feb","a vault opens"),copies:sc.cues.copies,minus:wAt(sc,"copies","minus eighteen"),from:wAt(sc,"copies","from gene banks"),
    banks:sc.cues.banks,breed:wAt(sc,"banks","so breeders"),aleppo:sc.cues.aleppo,samples:wAt(sc,"aleppo","samples"),send:sc.cues.send,toV:wAt(sc,"send","to the vault"),
    lost:sc.cues.lost,war:sc.cues.war,leave:wAt(sc,"war","had to leave"),noSend:wAt(sc,"war","no longer send"),risk:sc.cues.risk,every:wAt(sc,"risk","every variety"),
    change:sc.cues.change,ask:sc.cues.ask,asked:wAt(sc,"ask","they asked"),sown:sc.cues.sown,out:wAt(sc,"sown","came out"),nov:wAt(sc,"sown","that November"),
    gone:sc.cues.gone,few:sc.cues.few,again:wAt(sc,"few","breeders can order"),kept:sc.cues.kept,far:wAt(sc,"kept","their copies"),
    data:sc.cues.data,temp:wAt(sc,"data","temperature"),alike:sc.cues.alike,fresh:wAt(sc,"alike","how fresh"),often:wAt(sc,"alike","how often"),
    slow:sc.cues.slow,tutors:wAt(sc,"slow","twenty-three"),cost:wAt(sc,"slow","some cost"),now:sc.cues.now,own:wAt(sc,"now","its own temperature"),since:wAt(sc,"now","no tutor"),br:sc.cues.breath};
  const A=HW_AT,CARD=[1290,150,560];
  ag_shots(ctx,S,t,sc.dur,[
    // February 2008: Svalbard in the polar night, the mountain cut open; the vault's door, its tunnel and its halls light, and the copies come in
    {at:0,place:"hwVault",keys:[[0,700,610,1.5],[T.deep-0.5,960,540,1]],d:4.2,push:0.015,draw:(c,tt)=>{
      const op=ag_in(tt,T.open-0.1,0.7);
      if(op>0){glow(c,525,680,110,HW.frost,0.5*op);c.save();c.globalAlpha*=op;rr(c,511,653,28,54,1);c.fillStyle=rgba(HW.frost,0.6);c.fill();c.restore();}
      hw_vaultLive(c,tt,{tunnel:ag_sine((tt-T.open)/1.6),halls:ag_sine((tt-T.open-0.8)/1.4),boxes:clamp((tt-T.copies)/3.4,0,1),cold:ag_in(tt,T.minus,1.8)});
      if(tt>T.from-0.3)md_flow(c,HW_VAULT.tunnel,tt,{kind:"batch",col:HW.seed,every:0.9,dur:1.6,size:0.5,a:hw_io(tt,T.from-0.2,T.banks,0.5,0.4)});
      hw_tempTag(c,1544,566,"cold",{text:"minus 18 °C",align:"center",a:ag_in(tt,T.minus,0.5),k:(tt-T.minus)/0.9});
      hw_when(c,S,"Svalbard · February 2008",ag_in(tt,0.9,0.6));}},
    // the world's gene banks, the vault far north, and the bank near Aleppo: its copies sent up to the vault, its seeds out to breeders
    {at:T.banks-0.35,place:"hwWorld",keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{
      const war=ag_in(tt,T.leave,1.2),stop=ag_in(tt,T.noSend,0.8),ask=ag_in(tt,T.asked,0.6),sown=ag_in(tt,T.out,0.5);
      HW_BANKS.forEach(([x,y],i)=>{const a=ag_in(tt,T.banks+0.5+i*0.18,0.5)*(1-0.6*ag_in(tt,T.aleppo,0.6));if(a>0.004){glow(c,x,y,22,HW.seed,0.5*a);c.fillStyle=rgba(HW.seed,0.85*a);c.beginPath();c.arc(x,y,4.5,0,TAU);c.fill();}});
      // the seeds the bank sends out to breeders, until the war
      HW_LANES.out.forEach((pts,i)=>{const a=ag_in(tt,T.samples+0.4+i*0.25,0.6)*(1-stop);if(a<=0.004)return;md_lane(c,pts,HW.seed,0.55*a,{u:ag_sine((tt-T.samples-0.4-i*0.25)/1.2)});
        if(tt>T.samples+1.6)hw_seeds(c,pts,tt,{every:1.4,dur:1.8,a,size:0.45,off:i*0.5});});
      withA(c,ag_in(tt,T.samples+1.2,0.5)*(1-stop),()=>md_T(c,"to breeders",1318,676,{w:600,size:28,col:MD.soft}));
      // its copies, up to the vault, from 2008, until it can't send them
      const upA=ag_in(tt,T.send+0.2,0.5)*(1-0.85*stop);
      if(upA>0.004){md_lane(c,HW_LANES.up,HW.seed,0.75*upA,{u:ag_sine((tt-T.send-0.2)/1.6)});if(tt>T.send+1.4)hw_seeds(c,HW_LANES.up,tt,{every:1.5,dur:2.6,a:upA*(1-stop)});}
      hw_tagAt(c,1124,452,"copies, from 2008",tt,T.send+0.9,T.lost,{col:HW.seed});
      // 2015: the keepers, now in Lebanon, ask the vault for their copies; the copies come down to Lebanon and to Morocco
      if(ask>0.004&&sown<1)md_way(c,"api",[1065,811],[765,120],tt,{pts:HW_LANES.toLeb.slice().reverse(),col:HW.seed,a:ask*(1-sown)});
      if(sown>0.004){for(const [pts,o] of [[HW_LANES.toLeb,0],[HW_LANES.toMor,0.7]]){md_lane(c,pts,HW.seed,0.8*sown,{u:ag_sine((tt-T.out-o*0.4)/1.4)});if(tt>T.out+1.2)hw_seeds(c,pts,tt,{every:0.9,dur:2.2,off:o});}}
      hw_pin(c,A.svalbard[0],A.svalbard[1],{col:HW.frost,lit:1,label:{title:"Svalbard",sub:"the seed vault"},side:"above",a:ag_in(tt,T.banks+0.2,0.5),k:(tt-T.banks-0.2)/0.9});
      hw_pin(c,A.aleppo[0],A.aleppo[1],{col:HW.seed,lit:1-0.85*war,label:{title:"Aleppo"},side:"left",labelA:1-ag_in(tt,T.ask,0.5),a:ag_in(tt,T.aleppo+0.2,0.5),k:(tt-T.aleppo-0.2)/0.9});
      hw_pin(c,A.terbol[0],A.terbol[1],{col:HW.seed,lit:1,label:{title:"Lebanon"},side:"right",a:ag_in(tt,T.ask+0.4,0.5),k:(tt-T.ask-0.4)/0.9});
      hw_pin(c,A.rabat[0],A.rabat[1],{col:HW.seed,lit:1,label:{title:"Morocco"},side:"above",a:ag_in(tt,T.out+0.6,0.5),k:(tt-T.out-0.6)/0.9});
      hw_dim(c,S,0.45*hw_io(tt,T.change-0.1,T.ask-0.5,0.6,0.8));
      hw_scr(c,S,()=>{const [x,y,w]=CARD;
        hw_when(c,S,"2008",hw_io(tt,T.send,T.war,0.4,0.4));hw_when(c,S,"2012",hw_io(tt,T.war,T.ask,0.4,0.4));hw_when(c,S,"2015",ag_in(tt,T.ask,0.4));
        hw_cardAt(c,x,y,w,{kick:"Gene banks",title:"Seeds of crops and their wild relatives",sub:"so breeders can grow crops that stand drought and disease"},tt,T.banks+0.5,T.aleppo,{edge:HW.seed});
        hw_cardAt(c,x,y,w,{kick:"A gene bank near Aleppo",title:"141,052 samples",sub:"wheat, barley, lentils and chickpeas, from the world's dry lands"},tt,T.aleppo+0.5,T.lost-0.1,{edge:HW.seed});
        hw_cardAt(c,x,y,w,{title:"A gene bank can be lost",sub:"to war, flood or a power cut, and a variety lost is lost for good"},tt,T.lost+0.3,T.war-0.1,{icon:"warn"});
        hw_cardAt(c,x,y,w,{kick:"2012",title:"Most of the keepers leave",sub:"and no seeds go out"},tt,T.leave,T.risk-0.1,{});
        hw_cardAt(c,x,y,w,{title:"Every variety at risk",sub:"breeders can't get the seeds they relied on"},tt,T.risk+0.3,T.change+0.6,{icon:"warn"});
        hw_cardAt(c,x,y,w,{kick:"2015",title:"They ask for their copies",sub:"no one had done it before"},tt,T.asked+0.2,T.sown-0.1,{edge:HW.seed});
        hw_cardAt(c,x,y,w,{kick:"Out of the mountain",title:"38,073 samples"},tt,T.out,1e9,{edge:HW.seed});});}},
    // November 2015: the copies sown in Lebanon and Morocco; by 2020 nothing is left in Aleppo, yet few samples are lost
    {at:T.nov-0.25,place:"hwFields",keys:[[0,960,560,1]],push:0.03,draw:(c,tt)=>{
      hw_shoots(c,ag_sine((tt-T.nov)/3.2),{ripe:ag_sine((tt-T.again+0.6)/4)});
      hw_scr(c,S,()=>{hw_when(c,S,"Lebanon and Morocco · November 2015",hw_io(tt,T.nov+0.3,T.gone,0.5,0.4));hw_when(c,S,"2020",ag_in(tt,T.gone,0.4));
        hw_cardAt(c,610,170,700,{title:"Nothing left in Aleppo",sub:"of the collection that was kept there"},tt,T.gone+0.2,T.few,{});
        hw_cardAt(c,610,170,700,{title:"1,657 of 141,052 samples lost",sub:"and breeders can order its seeds again"},tt,T.few+0.2,T.kept-0.1,{edge:HW.seed});
        hw_tempTag(c,960,236,"warm",{text:"in use · close and ready",align:"center",a:ag_in(tt,T.kept+0.1,0.5),k:(tt-T.kept-0.1)/0.9});});}},
    // their copies, frozen far away
    {at:T.far-0.25,place:"hwVault",keys:[[0,1280,610,1.2]],push:0.02,draw:(c,tt)=>{
      c.save();c.globalAlpha*=1;glow(c,525,680,90,HW.frost,0.3);c.restore();
      hw_vaultLive(c,tt,{tunnel:1,halls:1,boxes:1,cold:1});
      hw_scr(c,S,()=>hw_tempTag(c,1180,250,"cold",{text:"copies · frozen far away",align:"center",a:ag_in(tt,T.far+0.3,0.5),k:(tt-T.far-0.3)/0.9}));}},
    // the university: three kinds of data, from where each is born to who reads it, and the two questions no one had asked
    {at:T.data-0.3,place:"map",keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{
      const on=[0,1,2].map(i=>clamp((tt-T.data-0.2-i*0.35)/1.0,0,1)),found=[0,1,2].map(i=>clamp((tt-T.own+0.2-i*0.3)/0.8,0,1));
      hw_rows(c,tt,{on,therm:ag_in(tt,T.temp,0.6),temp:found,t:tt,a:1-ag_in(tt,T.br+0.1,0.8)});
      hw_scr(c,S,()=>{hw_when(c,S,"Until September",hw_io(tt,T.alike,T.now,0.4,0.4));hw_when(c,S,"Now",ag_in(tt,T.now+0.1,0.4)*(1-ag_in(tt,T.br,0.6)));
        // the two questions, asked of no one: dashed, and faint
        for(const [x,s,t0] of [[700,"How fresh must it be?",T.fresh],[1150,"How often is it read?",T.often]]){const a=hw_io(tt,t0,T.now,0.4,0.5)*0.85;if(a<=0.004)continue;
          const w=md_tw(c,s,{w:700,size:28})+48;md_card(c,x-w/2,72,w,52,{dash:true,edge:MD.soft,r:26,a});md_T(c,s,x,108,{w:700,size:28,align:"center",col:MD.soft,a});}
        hw_pillAt(c,1630,387,"23 tutors paid late",tt,T.tutors,T.now,{col:MD.fail,icon:"cross"});
        hw_tagAt(c,950,852,"the costliest storage, never deleted",tt,T.cost+0.2,T.now,{col:HW_WHEN,icon:"warn",align:"center"});
        hw_pillAt(c,1630,387,"no tutor waiting for a contract",tt,T.since+0.2,T.br,{col:MD.pass,icon:"tick"});});}}
  ],0.6);
  md_title(ctx,S,t,T.br,"Hot, warm, cold","how fresh it must be, and how often it's read","FILM 2 OF 3 · DATA THAT MOVES");
});

/* ---------------------------------------------------------------- 2 · Two questions */
scene("two",(ctx,S,t,sc)=>{
  const T={noor:wAt(sc,"noor","Noor"),q:wAt(sc,"noor","two questions"),fresh:sc.cues.ask,often:wAt(sc,"ask","And how often"),hot:wAt(sc,"hot","hot"),
    warm:wAt(sc,"warm","warm"),cold:wAt(sc,"cold","cold"),contract:sc.cues.contract,fr:wAt(sc,"contract","how fresh"),long:wAt(sc,"contract","how long")};
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"night",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{
    md_person(c,"noor",360,800,0.95,{t:tt,gaze:[4,0]});
    hw_scr(c,S,()=>{hw_when(c,S,"September",ag_in(tt,0.6,0.5));md_nameTag(c,150,330,"noor",{col:MD.flow,a:ag_in(tt,T.noor-0.1,0.5)});
      // her two questions, then the three answers they lead to, one band each
      const qOut=ag_in(tt,T.hot-0.7,0.5);
      if(qOut<1){c.save();c.globalAlpha*=1-qOut;
        hw_cardAt(c,760,250,1080,{kick:"Question one",title:"How fresh must it be?"},tt,T.fresh-0.1,null,{edge:MD.flow});
        hw_cardAt(c,760,430,1080,{kick:"Question two",title:"How often is it read?"},tt,T.often-0.1,null,{edge:MD.flow});c.restore();}
      const on=[(tt-T.hot+0.4)/1.0,(tt-T.warm+0.4)/1.0,(tt-T.cold+0.4)/1.0].map(v=>clamp(v,0,1));
      hw_bands(c,760,150,1080,{on,t:tt});
      // the answer for one kind of data, written into its contract: how fresh, and how long it's kept
      const k=(tt-T.contract-0.2)/0.9,a=ag_in(tt,T.contract+0.2,0.5);
      if(a>0.004){c.save();c.globalAlpha*=a;ag_about(c,1300,770,lerp(0.6,1,Math.min(1,ag_spr(k,0,0.5))));
        md_card(c,760,676,1080,190,{edge:MD.agreed,glow:0.8});md_icon(c,"contract",808,716,38,MD.agreed);
        md_T(c,"DATA CONTRACT · PAY RECORDS",850,726,{w:800,size:28,ls:4,col:MD.agreed});
        withA(c,ag_in(tt,T.fr,0.4),()=>hw_pair(c,808,786,"fresh","each pay day",{dx:130}));
        withA(c,ag_in(tt,T.long,0.4),()=>hw_pair(c,808,834,"kept","7 years after each contract ends, then deleted",{dx:130}));c.restore();
        md_icon(c,"contract",1784,600,34,MD.agreed,{a});}});}}],0.6);
});

/* ---------------------------------------------------------------- 3 · Hot */
// the claims app's page: the claims of one Monday morning, each with its unit and duty, and where it stands
const HW_CLAIMS=[["HI101","tutorial"],["HI101","marking"],["BU210","tutorial"],["EN110","tutorial"]];
function hw_claims(ctx,tt,o){o=o||{};const st=o.state||(()=>"waiting");return hw_app(ctx,1240,130,600,400,{rows:HW_CLAIMS.map((r,i)=>[r[0],r[1],st(i)]),a:o.a,k:o.k,lit:o.lit,litCol:o.litCol});}
scene("hot",(ctx,S,t,sc)=>{
  const T={app:wAt(sc,"claims","the claims app"),noon:wAt(sc,"claims","approved by noon"),checks:sc.cues.checks,contract:wAt(sc,"checks","contract"),hr:wAt(sc,"checks","the HR system"),
    change:sc.cues.change,ingrid:wAt(sc,"change","Ingrid's"),monday:wAt(sc,"change","on a Monday"),night:sc.cues.night,once:wAt(sc,"night","once a night"),tues:wAt(sc,"night","on Tuesday"),
    late:sc.cues.late,tutors:wAt(sc,"late","twenty-three"),push:sc.cues.push,made:wAt(sc,"push","as it's made"),zb:wAt(sc,"push","Zerobus"),table:sc.cues.table,arrives:wAt(sc,"table","as it arrives"),
    st:wAt(sc,"table","a streaming table"),stands:wAt(sc,"table","as it stands"),minute:sc.cues.minute,mon:sc.cues.monday,noon2:wAt(sc,"monday","every claim"),
    costs:sc.cues.costs,running:wAt(sc,"costs","always running"),keep:wAt(sc,"costs","keep hot only")};
  const HR=[96,170,420],TB=[720,174,400],tbR=[1120,226],appL=[1240,330],hrP=[516,225],tbL=[720,226];
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{
    const before=1-ag_in(tt,T.push-0.2,0.6),now=ag_in(tt,T.push,0.6),pipe=ag_in(tt,T.arrives-0.2,0.6);
    // the HR system, the platform's table of contracts, and the lanes between them and the claims app
    md_system(c,HR[0],HR[1],HR[2],"hr",{a:ag_in(tt,T.hr-0.2,0.5),lit:0.8*hw_io(tt,T.monday,T.night+0.6,0.4,0.6)+0.6*hw_io(tt,T.made,T.table,0.4,0.6)});
    if(pipe>0.004){c.save();c.globalAlpha*=pipe;md_card(c,690,118,460,196,{dash:true,edge:MD.flow,r:20});md_label(c,712,150,"Pipeline",{col:MD.flow});c.restore();}
    md_table(c,TB[0],TB[1],TB[2],{name:"contracts",kind:"table",a:ag_in(tt,T.contract-0.3,0.5)*(1-ag_in(tt,T.st-0.3,0.4))});
    md_table(c,TB[0],TB[1],TB[2],{name:"contracts",kind:"streaming table",lit:0.6*ag_in(tt,T.stands,0.6),a:ag_in(tt,T.st-0.3,0.4)});
    const lanesA=ag_in(tt,T.hr,0.6);
    // until September, a whole file once a night; now each change as it's made, through Zerobus Ingest
    if(before>0.004)md_way(c,"batch",hrP,tbL,tt,{a:lanesA*before,every:3.2,flow:tt>T.once-0.4});
    if(now>0.004)md_way(c,"events",hrP,tbL,tt,{a:now,icon:ag_in(tt,T.zb-0.3,0.4)>0,iconA:ag_in(tt,T.zb-0.3,0.4),label:"Zerobus Ingest",labelBelow:128,every:0.8});
    // the app asks the platform for each claim's contract, and has its answer
    md_way(c,"api",tbR,appL,tt,{a:ag_in(tt,T.contract,0.5)});
    const ok=i=>i===3||tt>T.noon2+0.3+i*0.25;
    hw_claims(c,tt,{a:ag_in(tt,0.4,0.5),k:(tt-0.4)/0.9,state:i=>ok(i)?"approved":"waiting",lit:tt<T.costs?[0,1,2].filter(i=>ok(i)):null,litCol:MD.pass});
    hw_scr(c,S,()=>{
      hw_when(c,S,"Monday morning",hw_io(tt,T.monday,T.night,0.4,0.4));hw_when(c,S,"Until September",hw_io(tt,T.night,T.push,0.4,0.4));hw_when(c,S,"Now",hw_io(tt,T.push+0.1,T.mon,0.4,0.4));hw_when(c,S,"This Monday",hw_io(tt,T.mon,T.costs,0.4,0.4));
      hw_cardAt(c,1240,552,600,{kick:"Each pay day",title:"Approved by noon Monday",sub:"paid on Thursday"},tt,T.noon,T.night,{});
      md_nameTag(c,470,560,"ingrid",{col:MD.sys.hr,a:hw_io(tt,T.ingrid-0.1,T.night-0.3,0.5,0.5)});
      // the pay week: a change on Monday morning, claims close at noon, the night's load, pay day
      const tlA=hw_io(tt,T.night+0.3,T.push-0.2,0.5,0.6);
      if(tlA>0.004){const late=ag_in(tt,T.late,0.5);
        hw_timeline(c,330,700,1260,{a:tlA,t:tt,stops:[{t:"Monday 09:00",s:"a change in HR",col:MD.sys.hr},{t:"Monday 12:00",s:"claims close",col:mix(MD.wait,MD.fail,late),a:ag_in(tt,T.night+0.6,0.4)},
          {t:"Tuesday 02:00",s:"the night's load",col:MD.flow,a:ag_in(tt,T.once,0.4)},{t:"Thursday",s:"pay day",col:MD.ink,a:ag_in(tt,T.night+1.2,0.4)}],
          span:[{from:0,to:2*ag_sine((tt-T.tues)/1.4),col:MD.flow,dash:true,a:ag_in(tt,T.tues,0.3)}]});
        hw_pillAt(c,960,594,"23 tutors waited two more weeks for their pay",tt,T.tutors,T.push-0.2,{col:MD.fail,icon:"cross"});}
      hw_tagAt(c,930,380,"within a minute",tt,T.minute+0.2,T.costs,{col:MD.flow,icon:"clock"});
      hw_pillAt(c,960,640,"11 contracts changed · every claim approved by noon",tt,T.noon2,T.costs-0.1,{col:MD.pass,icon:"tick"});
      hw_tagAt(c,808,360,"always running",tt,T.running-0.2,1e9,{col:MD.flow,icon:"refresh"});
      hw_cardAt(c,480,600,960,{kick:"Hot",title:"Costs the most: something is always running",sub:"keep hot only what's needed within minutes"},tt,T.costs+0.2,1e9,{edge:HW.heat,kickCol:HW.heat});});
    hw_personAt(c,"ingrid",270,660,0.85,tt,T.ingrid-0.3,T.night-0.4,{gaze:[4,-1]});}}],0.6);
});

/* ---------------------------------------------------------------- 4 · Warm */
scene("warm",(ctx,S,t,sc)=>{
  const T={rohan:wAt(sc,"rohan","Rohan"),mgr:wAt(sc,"rohan","the faculties' managers"),spent:wAt(sc,"rohan","what each faculty"),before:sc.cues.before,every:wAt(sc,"before","every look"),
    slow:wAt(sc,"before","slow"),load:wAt(sc,"before","a load"),mv:sc.cues.mv,fresh:wAt(sc,"mv","fresh enough"),sonow:wAt(sc,"mv","so now"),view:wAt(sc,"mv","materialized view"),two:wAt(sc,"mv","each night at two"),
    ready:wAt(sc,"mv","ready to read"),dbt:sc.cues.dbt,jun:wAt(sc,"dbt","Jun"),sched:wAt(sc,"dbt","its schedule"),tested:wAt(sc,"dbt","tested"),answer:sc.cues.answer,only:wAt(sc,"answer","only the answer"),never:wAt(sc,"answer","never a copy"),
    most:sc.cues.most,few:wAt(sc,"most","few questions"),hotm:wAt(sc,"most","hot costs more")};
  const FIN=[96,170,420],finP=[516,225],MV=[690,174,440],BARS=[1180,150,660];
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",later:true,keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{
    const now=ag_in(tt,T.view-0.2,0.6),before=1-now;
    md_system(c,FIN[0],FIN[1],FIN[2],"fin",{a:ag_in(tt,T.before-0.3,0.5),lit:0.8*hw_io(tt,T.load,T.mv,0.4,0.6)});
    // until September, every look a query on the ledger, in place; now a materialized view, worked out at two each night
    const bp=[BARS[0],BARS[1]+190];
    if(before>0.004)md_way(c,"query",finP,bp,tt,{a:ag_in(tt,T.every-0.2,0.5)*before,pts:md_curve(finP,bp,{bend:0.5})});
    if(now>0.004){md_table(c,MV[0],MV[1],MV[2],{name:"spending_by_faculty",kind:"materialized view",lit:0.8*hw_io(tt,T.never-0.2,T.most,0.4,0.6),a:now,k:(tt-T.view+0.2)/0.9});
      md_way(c,"query",finP,[MV[0],MV[1]+52],tt,{a:now*ag_in(tt,T.two-0.2,0.5),flow:false});
      md_lane(c,md_curve([MV[0]+MV[2],MV[1]+52],bp,{bend:0.5}),MD.flow,0.85*ag_in(tt,T.ready,0.5));}
    hw_bars(c,BARS[0],BARS[1],BARS[2],{a:ag_in(tt,T.spent-0.2,0.5),k:(tt-T.spent+0.2)/0.9,spent:HW_SPENT.map((v,i)=>ag_sine((tt-T.spent-0.2-i*0.15)/1.2)),edge:MD.dom.finance,col:MD.dom.finance});
    hw_scr(c,S,()=>{
      hw_when(c,S,"Each morning",hw_io(tt,0.6,T.before,0.4,0.4));hw_when(c,S,"Until September",hw_io(tt,T.before,T.sonow,0.4,0.4));hw_when(c,S,"Now",ag_in(tt,T.sonow+0.1,0.4));
      md_nameTag(c,470,540,"rohan",{col:MD.sys.fin,a:ag_in(tt,T.rohan-0.1,0.5)});
      hw_tagAt(c,470,640,"and the faculties' managers",tt,T.mgr,T.before+0.4,{col:HW_WHEN,icon:"person"});
      hw_tagAt(c,700,408,"every look",tt,T.every,T.mv,{col:MD.flow,icon:"query"});
      hw_tagAt(c,700,476,"slow",tt,T.slow,T.mv,{col:HW_WHEN,icon:"clock"});
      hw_tagAt(c,96,330,"a load on the ledger while Finance works",tt,T.load,T.mv,{col:HW_WHEN,icon:"warn"});
      hw_tagAt(c,540,330,"each night · 02:00",tt,T.two,T.most,{col:MD.flow,icon:"clock"});
      hw_tagAt(c,640,410,"ready to read",tt,T.ready,T.dbt,{col:MD.flow,icon:"tick"});
      // Jun's dbt model: the view, and its schedule, in its own config
      const dA=hw_io(tt,T.dbt-0.1,T.most-0.1,0.5,0.5);
      if(dA>0.004){md_window(c,680,500,700,330,{logo:"dbt",product:"dbt",title:"spending_by_faculty.sql",a:dA,k:(tt-T.dbt+0.1)/0.9,draw:(cc,b)=>{
        hw_code(cc,b.x+16,b.y+44,[{s:"{{ config("},{s:"  materialized='materialized_view',"},{s:"  schedule={'cron': '0 0 2 * * ?'}"},{s:") }}"}],{hl:tt>T.sched?2:null,hlCol:MD.flow,w:640});
        md_T(cc,"Jun Park's model · tested like any other",b.x+16,b.y+b.h-20,{w:600,size:28,col:MD.soft,a:ag_in(tt,T.jun,0.4)});}});
        hw_pillAt(c,1530,780,"tests pass",tt,T.tested+0.2,T.most-0.1,{col:MD.pass,icon:"tick"});}
      hw_tagAt(c,640,410,"only the answer, not the ledger",tt,T.only,T.most,{col:MD.flow,icon:"table"});
      hw_cardAt(c,680,520,1000,{kick:"Warm",title:"Most of the university's data",sub:"few questions need the minute, and hot costs more"},tt,T.most+0.2,1e9,{edge:hw_band("warm").tint,kickCol:hw_band("warm").tint});});
    hw_personAt(c,"rohan",300,660,0.85,tt,0.3,1e9,{gaze:[4,-1]});}}],0.6);
});

/* ---------------------------------------------------------------- 5 · Cold */
const HW_YEARS=["2016","2017","2018","2019","2020","2021","2022","2023","2024","2025","2026"];
scene("cold",(ctx,S,t,sc)=>{
  const T={records:sc.cues.records,payday:wAt(sc,"records","Every pay day"),hours:wAt(sc,"records","with the hours"),law:sc.cues.law,seven:wAt(sc,"law","seven years"),rarely:wAt(sc,"law","rarely read"),
    before:sc.cues.before,costliest:wAt(sc,"before","the costliest"),none:wAt(sc,"before","none was ever"),cost:wAt(sc,"before","a cost"),risk:wAt(sc,"before","a risk"),
    archive:sc.cues.archive,written:wAt(sc,"archive","a year after"),tier:wAt(sc,"archive","archive tier"),cheapest:wAt(sc,"archive","its cheapest"),vault:sc.cues.vault,sleep:wAt(sc,"vault","they sleep"),
    told:sc.cues.told,recent:wAt(sc,"told","queries for recent pay"),archived:wAt(sc,"told","one that needs"),which:wAt(sc,"told","which files"),back:sc.cues.hours,audit:wAt(sc,"hours","an audit"),
    turn:sc.cues.seven,date:wAt(sc,"seven","on a date"),removed:wAt(sc,"seven","removed for good"),oct:sc.cues.october,oldest:wAt(sc,"october","the oldest"),gone:wAt(sc,"october","were deleted"),
    privacy:sc.cues.privacy};
  const PAY=[96,150,420],payP=[516,205],REC=[700,154,460],TOP=520,LOW=740;
  // the shelves, the years on them, and what sank, was read or went: the same picture before and after the vault
  const shelves=(c,tt)=>{
    hw_shelf(c,60,TOP+6,1500,"Hot storage","the costliest",{a:ag_in(tt,T.costliest-0.4,0.5)});hw_shelf(c,60,LOW+6,1500,"Archive tier","the cheapest",{cold:true,a:ag_in(tt,T.tier-0.4,0.5)});
    const sink=HW_YEARS.map((y,i)=>i<10?ag_sine((tt-T.written-0.2-i*0.22)/1.0):0),gone=HW_YEARS.map((y,i)=>i<3?ag_in(tt,T.gone+i*0.3,0.8):0),
      read=HW_YEARS.map((y,i)=>i===10?ag_in(tt,T.rarely-0.2,0.5)*(1-ag_in(tt,T.before,0.5))+hw_io(tt,T.recent,T.archived,0.3,0.4):i===5?hw_io(tt,T.which,T.turn,0.3,0.5):0);
    const lift=ag_sine((tt-T.back-0.2)/1.4)*(1-ag_in(tt,T.turn,0.8));sink[5]=sink[5]*(1-0.35*lift);
    return hw_years(c,130,{years:HW_YEARS,top:TOP,low:LOW,sink,gone,read,a:ag_in(tt,T.payday,0.6)});};
  const ui=(c,tt)=>{
    md_system(c,PAY[0],PAY[1],PAY[2],{n:"Payroll system",s:"Each pay, each pay day",c:HW_PAYROLL},{a:ag_in(tt,0.5,0.5)});
    md_table(c,REC[0],REC[1],REC[2],{name:"pay_records",kind:"table",col:MD.personal,icon:"lock",a:ag_in(tt,T.payday,0.5),lit:0.7*hw_io(tt,T.told,T.back,0.4,0.6)});
    md_way(c,"batch",payP,[REC[0],REC[1]+52],tt,{col:MD.personal,a:ag_in(tt,T.payday+0.2,0.5),every:2.6});};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"map",later:true,keys:[[0,960,540,1]],push:0.01,draw:(c,tt)=>{ui(c,tt);shelves(c,tt);
      hw_scr(c,S,()=>{hw_when(c,S,"Every pay day",hw_io(tt,T.payday,T.before,0.4,0.4));hw_when(c,S,"Until September",hw_io(tt,T.before,T.archive,0.4,0.4));hw_when(c,S,"Now",ag_in(tt,T.archive+0.1,0.4));
        hw_tagAt(c,1200,206,"with each casual tutor's hours",tt,T.hours,T.law,{col:MD.personal,icon:"lock"});
        hw_tagAt(c,1200,206,"the law: kept 7 years",tt,T.seven,T.before,{col:HW_WHEN,icon:"doc"});
        hw_tagAt(c,1200,300,"after the first year, rarely read",tt,T.rarely,T.before,{col:HW_WHEN,icon:"eye"});
        hw_tagAt(c,96,350,"none ever deleted",tt,T.none,T.archive,{col:HW_WHEN,icon:"warn"});
        hw_tagAt(c,440,350,"a cost",tt,T.cost,T.archive,{col:HW_WHEN,icon:"warn"});
        hw_tagAt(c,640,350,"a risk to everyone in them",tt,T.risk,T.archive,{col:MD.personal,icon:"lock"});
        hw_tagAt(c,96,350,"a year after it's written",tt,T.written,T.vault-0.3,{col:HW.frost,icon:"clock"});});}},
    // like the copies on Svalbard, they sleep until someone needs them
    {at:T.vault-0.3,place:"hwVault",keys:[[0,1280,610,1.2]],push:0.02,draw:(c,tt)=>{hw_vaultLive(c,tt,{tunnel:1,halls:1,boxes:1,cold:1});
      hw_scr(c,S,()=>hw_tempTag(c,1180,250,"cold",{text:"asleep until they're needed",align:"center",a:ag_in(tt,T.sleep,0.5),k:(tt-T.sleep)/0.9}));}},
    // the table is told: recent pay still runs; an archived year says which files to bring back; hours, fine for an audit; deleted at seven
    {at:T.told-0.35,place:"map",keys:[[0,960,540,1]],push:0.01,draw:(c,tt)=>{ui(c,tt);const yc=shelves(c,tt);
      hw_scr(c,S,()=>{hw_when(c,S,"Now",hw_io(tt,0,T.oct,0.4,0.4));hw_when(c,S,"October 2026",ag_in(tt,T.oct,0.4));
        const pa=hw_io(tt,T.told+0.2,T.oct,0.5,0.5);
        if(pa>0.004){const s="delta.timeUntilArchived = '365 days'",w=md_tw(c,s,{w:500,size:28,f:"mono"})+56;md_card(c,1180,178,w,56,{edge:MD.personal,r:14,a:pa});md_T(c,s,1208,216,{w:500,size:28,f:"mono",a:pa});
          md_lane(c,[[REC[0]+REC[2],206],[1180,206]],MD.personal,0.7*pa,{dash:true});}
        hw_pillAt(c,yc[10][0],yc[10][1]-150,"recent pay: runs",tt,T.recent+0.2,T.archived,{col:MD.pass,icon:"tick"});
        const fa=hw_io(tt,T.which,T.turn,0.4,0.5);
        if(fa>0.004){c.save();c.globalAlpha*=fa;ag_about(c,620,380,lerp(0.6,1,Math.min(1,ag_spr((tt-T.which)/0.9,0,0.5))));md_card(c,300,300,640,160,{edge:MD.wait,glow:0.6});
          md_T(c,"2021 · FILES TO BRING BACK",328,344,{w:800,size:28,ls:3,col:MD.wait});
          ["part-00003.parquet","part-00017.parquet"].forEach((f,i)=>md_T(c,f,328,394+i*44,{w:500,size:28,f:"mono"}));c.restore();}
        hw_tagAt(c,980,440,"hours · fine for an audit",tt,T.back+0.2,T.turn,{col:MD.wait,icon:"clock"});
        hw_tagAt(c,490,400,"7 years after each contract ends, then deleted",tt,T.turn+0.4,T.privacy-0.2,{col:MD.agreed,icon:"contract"});
        hw_cardAt(c,1240,130,600,{kick:"Data protection",title:"Deleting well",sub:"is for the films on data protection"},tt,T.privacy+0.2,1e9,{edge:MD.personal,icon:"lock"});});}}
  ],0.6);
});

/* ---------------------------------------------------------------- 6 · One claim cools */
scene("cools",(ctx,S,t,sc)=>{
  const T={cools:sc.cues.cools,linh:wAt(sc,"linh","Linh's"),hot:wAt(sc,"linh","was hot"),list:sc.cues.list,app:wAt(sc,"list","in the app"),approved:wAt(sc,"list","approved it"),
    paid:sc.cues.paid,warm:wAt(sc,"paid","turns warm"),health:wAt(sc,"paid","part of what"),year:sc.cues.year,cold:wAt(sc,"year","turns cold"),record:wAt(sc,"year","in her pay record"),
    seven:wAt(sc,"year","until the seven"),follow:sc.cues.follow};
  const BX=760,BY=150,BH=150,GAP=20,CX=1380,TXT=[["in the app","read in place"],["on the platform","worked out each night"],["in the archive","kept until it's deleted"]];
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"night",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{
    md_person(c,"linh",360,800,0.95,{t:tt,gaze:[4,0]});
    hw_scr(c,S,()=>{md_nameTag(c,150,330,"linh",{a:ag_in(tt,T.linh-0.1,0.5)});
      hw_when(c,S,"Monday morning",hw_io(tt,T.linh,T.paid,0.4,0.4));hw_when(c,S,"Thursday · pay day",hw_io(tt,T.paid,T.year,0.4,0.4));hw_when(c,S,"A year from now",ag_in(tt,T.year,0.4));
      const step=ag_sine((tt-T.warm+0.2)/1.4)+ag_sine((tt-T.cold+0.2)/1.4),hl=tt<T.follow?Math.round(step):null;
      hw_bands(c,BX,BY,1080,{on:[0,1,2].map(i=>clamp((tt-T.cools-0.2-i*0.3)/0.9,0,1)),h:BH,gap:GAP,text:TXT,hl,t:tt,flow:true});
      // Linh's claim, moving down the bands as it cools
      const y=BY+step*(BH+GAP),temp=lerp(1,0.1,step/2),state=tt<T.approved+0.2?"waiting for her coordinator":tt<T.warm+0.5?"approved":tt<T.cold+0.5?"part of what Health has spent":"in her pay record, archived";
      const ca=ag_in(tt,T.hot-0.3,0.5);
      if(ca>0.004){hw_claim(c,CX,y+8,{temp,state,w:440,a:ca,k:(tt-T.hot+0.3)/0.9});if(tt>T.approved&&tt<T.paid+0.4)md_icon(c,"tick",CX+400,y+130,30,MD.pass,{a:ag_in(tt,T.approved,0.3)*(1-ag_in(tt,T.paid,0.4))});}
      // payroll's list of claims still waiting reads it in place, in the app: a dashed lane, nothing copied
      const la=hw_io(tt,T.list,T.paid,0.5,0.4);
      if(la>0.004){md_tag(c,1100,96,"payroll's list of claims still waiting",{col:MD.flow,icon:"eye",a:la});md_lane(c,md_curve([1560,122],[1600,y+8],{bend:0.5}),MD.flow,0.8*la,{dash:true,t:tt});}});}}],0.6);
});

/* ---------------------------------------------------------------- 7 · Kept as it's used */
scene("close",(ctx,S,t,sc)=>{
  const T={still:wAt(sc,"svalbard","cold and still"),leb:wAt(sc,"svalbard","In Lebanon"),again:wAt(sc,"svalbard","sends out"),univ:sc.cues.university,c1:wAt(sc,"university","contracts"),
    c2:wAt(sc,"university","spending"),c3:wAt(sc,"university","old pay records"),today:sc.cues.today,casual:wAt(sc,"today","eight hundred"),linh:wAt(sc,"today","Linh among"),
    take:sc.cues.takeaway,wheel:sc.cues.wheel,docs:sc.cues.docs,verbs:wAt(sc,"docs","then investigate"),next:sc.cues.next,br:sc.cues.breath};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"hwVault",keys:[[0,1280,610,1.2]],push:0.02,draw:(c,tt)=>{hw_vaultLive(c,tt,{tunnel:1,halls:1,boxes:1,cold:1});hw_when(c,S,"Svalbard",ag_in(tt,0.6,0.5));}},
    {at:T.leb-0.3,place:"hwFields",keys:[[0,960,560,1]],push:0.025,draw:(c,tt)=>{hw_shoots(c,1,{ripe:1});
      const pts=[[[960,600],[200,420]],[[960,600],[1720,420]]].map(([a,b])=>hw_arc(a,b,120));
      pts.forEach((p,i)=>{const a=ag_in(tt,T.again+i*0.3,0.6);if(a>0.004){md_lane(c,p,HW.seed,0.6*a,{u:ag_sine((tt-T.again-i*0.3)/1.2)});if(tt>T.again+1)hw_seeds(c,p,tt,{every:1.1,dur:2,off:i*0.5,a});}});
      hw_when(c,S,"Lebanon and Morocco",ag_in(tt,T.leb,0.5));}},
    {at:T.univ-0.3,place:"map",keys:[[0,960,540,1]],push:0.012,draw:(c,tt)=>{
      hw_rows(c,tt,{on:[1,1,1],temp:[1,1,1],t:tt,hl:tt<T.c1?null:tt<T.c2?0:tt<T.c3?1:2,say:["within a minute","each night","cheaply, until they're deleted"],
        sayA:[ag_in(tt,T.c1,0.4),ag_in(tt,T.c2,0.4),ag_in(tt,T.c3,0.4)]});
      hw_when(c,S,"The university",ag_in(tt,T.univ,0.5));}},
    {at:T.today-0.3,place:"night",keys:[[0,960,540,1]],push:0.015,draw:(c,tt)=>{
      hw_personAt(c,"linh",360,800,0.95,tt,-1,T.br,{gaze:[4,0]});
      hw_scr(c,S,()=>{hw_when(c,S,"Today · pay day",hw_io(tt,T.today,T.br,0.4,0.6));
        hw_cardAt(c,820,250,900,{kick:"Paid today",title:"2,960 people",sub:"856 of them casual staff, Linh among them"},tt,T.today+0.3,T.take-0.2,{edge:MD.pass});
        // what the film found: freshness and reading decide how data moves and where it lives
        const k=(tt-T.take)/0.9,a=hw_io(tt,T.take,T.wheel,0.5,0.5);
        if(a>0.004){c.save();c.globalAlpha*=a;ag_about(c,1270,420,lerp(0.85,1,Math.min(1,ag_spr(k,0,0.5))));md_card(c,820,300,900,220,{edge:MD.flow,glow:0.6});
          md_T(c,"Freshness and reading decide",1270,388,{w:700,size:40,align:"center"});md_T(c,"how data moves and where it lives",1270,446,{w:700,size:40,align:"center",col:MD.flow});c.restore();}
        // storage has had tiers for years: no wheel to reinvent
        const wa=hw_io(tt,T.wheel,T.docs,0.5,0.5);if(wa>0.004){md_mark(c,1270,380,80,(tt-T.wheel)/1.6,wa);md_T(c,"storage has had tiers for years",1270,540,{w:700,size:32,align:"center",col:MD.soft,a:wa});}
        // the official docs, then investigate, adapt, implement, iterate
        const da=hw_io(tt,T.docs,T.next,0.5,0.5);
        if(da>0.004){c.save();c.globalAlpha*=da;md_card(c,820,240,900,320,{edge:MD.flow,glow:0.5});md_T(c,"Start from the official docs",880,310,{w:700,size:36});
          let x=880;for(const lg of["databricks","dbt"]){if(typeof LOGO!=="undefined"&&LOGO[lg])x+=logo(c,lg,x,350,48)+28;}
          let vx=880;["investigate","adapt","implement","iterate"].forEach((v,i)=>{md_T(c,v,vx,480,{w:700,size:32,col:MD.flow,a:ag_in(tt,T.verbs+i*0.35,0.4)});vx+=md_tw(c,v,{w:700,size:32})+56;});c.restore();}
        hw_cardAt(c,820,330,900,{kick:"Next",title:"One copy, one platform",sub:"one copy of the claims, for the app and for Finance"},tt,T.next+0.2,T.br,{edge:MD.flow});});}}
  ],0.6);
  md_end(ctx,S,t,T.br,"Hot, warm, cold","Freshness and reading decide how data moves and where it lives.","Film 2 of 3","Data that moves");
});

// chapters that open in the room the one before ends in: the camera glides on, and what the last one shows leaves first
ag_cutInto(["warm","cold"]);
