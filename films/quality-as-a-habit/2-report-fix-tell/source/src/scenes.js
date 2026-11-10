/* ===== Report, fix, tell: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (rf_india.js, rf_home.js and the kit's bench, granite and hall); what moves is drawn live in the shots of ag_shots. In one room the
   camera glides and only what changes comes in or leaves, one thing after another in the same place, never two at once; between rooms a
   shot dissolves, because the whole picture changes. Words on screen are the narration's names and numbers. The title card ends
   chapter 1, the end card chapter 7. */

const rf_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a value that comes in at a and leaves at b (seconds), each over d
const rf_io=(t,a,b,d)=>ag_in(t,a,d||0.5)*(1-ag_in(t,b,d||0.5));
const RF_MEI=[300,585,0.98],RF_JUN=[270,585,0.98];

/* ---------------------------------------------------------------- 1 · Report a case */
scene("report",(ctx,S,t,sc)=>{const c=sc.cues,T=rf_once(sc,"T",()=>({
    india:wAt(sc,"place","India"),person:wAt(sc,"disease","person to person"),killed:wAt(sc,"disease","killed"),
    cases:wAt(sc,"hard","more than"),hid:wAt(sc,"hid","It hid"),
    chain0:wAt(sc,"chain","passed"),aChain:wAt(sc,"chain","a chain"),vacc:wAt(sc,"missed","Vaccinating"),found:wAt(sc,"missed","found the ones"),
    every:wAt(sc,"change","every chain"),stopped:wAt(sc,"change","stopped"),
    search:wAt(sc,"search","So India's"),contain:wAt(sc,"search","search, and contain"),house:wAt(sc,"house","More than"),
    reported:wAt(sc,"reward","Anyone who reported"),reward:wAt(sc,"reward","a reward"),answered:wAt(sc,"reward","every report"),atonce:wAt(sc,"reward","at once"),
    guards:wAt(sc,"guards","Guards"),night:wAt(sc,"guards","night"),around:wAt(sc,"guards","everyone around"),vaccinated:wAt(sc,"guards","vaccinated"),stop:wAt(sc,"guards","the chain stopped"),
    paid:wAt(sc,"paid","was paid"),last:wAt(sc,"last","In May"),lastCase:wAt(sc,"last","last case"),
    y77:wAt(sc,"free","nineteen seventy-seven"),y80:wAt(sc,"free","nineteen eighty"),
    uni:wAt(sc,"uni","At the university"),wrong:wAt(sc,"uni","printed wrong"),again:wAt(sc,"folder","printed again"),grad:wAt(sc,"folder","a graduate"),
    worth:wAt(sc,"worth","A report"),answer:wAt(sc,"worth","answer it"),fix:wAt(sc,"worth","fix it"),tell:wAt(sc,"worth","tell them")}));
  const atPlan=T.hid+3.4,atDoor=T.search-0.9,atGuards=T.guards-0.7,atPaid=T.paid-1.1,atLast=T.last-0.8,atUni=T.uni-0.7,atHall=T.grad+0.3,atWorth=T.worth-0.7;
  ag_shots(ctx,S,t,sc.dur,[
    // the village lane at midday; the mark passes from door to door; the year's cases, a measure
    {at:0,place:"rfLane",keys:[[0,960,540,1.0],[T.cases-0.6,1000,520,1.08],[T.hid,880,560,1.12]],d:3,push:0.02,draw:(cx,tt)=>{
      rf_laneChain(cx,clamp((tt-T.person)/3.4,0,1),tt,1-ag_in(tt,T.cases-0.6,0.8));
      dq_textCard(cx,1130,96,620,{kick:"1974",title:"116,188 cases by the end of May"},{edge:"steel",a:ag_in(tt,T.cases,0.5),k:tt-T.cases});}},
    // the plan: a chain from house to house; everyone vaccinated but a few, and the chain finds a missed one; what must happen, dashed
    {at:atPlan,place:"rfPlan",keys:[[0,960,540,1.0],[T.chain0-0.4,760,470,1.2],[T.vacc-0.3,960,540,1.0],[T.every-0.2,860,560,1.22]],d:1.8,push:0.02,dis:0.8,draw:(cx,tt)=>{
      rf_planState(cx,tt,{chain:clamp((tt-T.chain0)/(T.aChain-T.chain0+0.4),0,1),ticks:clamp((tt-T.vacc)/2.4,0,1),missed:ag_in(tt,T.vacc+1.4,0.6),
        toMissed:clamp((tt-T.found)/1.2,0,1),found:ag_in(tt,T.every,0.5),need:ag_in(tt,T.stopped,0.7)});}},
    // search and contain: a health worker comes to a door; the reward; the woman who lives there reports, and he writes it at once
    {at:atDoor,place:"rfDoor",keys:[[0,960,540,1.0],[T.reported,930,530,1.05]],d:2.4,push:0.02,dis:0.8,draw:(cx,tt)=>{
      const walk=ag_sine(clamp((tt-atDoor-0.2)/2.4,0,1)),talk=tt>T.reported&&tt<T.atonce?0.5+0.5*Math.sin(tt*8.5):0;
      rf_door(cx,tt,{wx:lerp(-760,0,walk),poster:"Rs 50",posterA:ag_in(tt,T.reward,0.6),write:clamp((tt-T.answered)/2.4,0,1),talk:talk*ag_in(tt,T.reported,0.3)});
      dq_textCard(cx,64,52,700,{title:"More than 100,000 health workers",sub:"house to house"},{a:ag_in(tt,T.house,0.5),k:tt-T.house});
      dq_chip(cx,1376,124,"Visited at once",{align:"center",a:ag_in(tt,T.atonce,0.5)});}},
    // the plan again: guards by day and by night, the ring drawn, everyone in it vaccinated, and the chain stops there
    {at:atGuards,place:"rfPlan",keys:[[0,RF_RING.x,RF_RING.y-30,1.42]],d:1.8,push:0.02,dis:0.8,draw:(cx,tt)=>{
      rf_planState(cx,tt,{chain:1,toMissed:1,ticks:1,missed:1,found:1-ag_in(tt,T.around,0.6),need:1,guards:0.5*ag_in(tt,T.guards,0.5)+0.5*ag_in(tt,T.night,0.6),
        ring:clamp((tt-T.around)/1.4,0,1),inside:ag_in(tt,T.vaccinated,0.8),stop:ag_in(tt,T.stop,0.6)});}},
    // whoever reported was paid
    {at:atPaid,place:"rfDoor",keys:[[0,960,540,1.04]],d:1.6,push:0.02,dis:0.8,draw:(cx,tt)=>{
      rf_door(cx,tt,{poster:"Rs 50",note:1});dq_chip(cx,850,740,"Paid",{align:"center",a:ag_in(tt,T.paid,0.5)});}},
    // Assam, May 1975: the platform, quiet, the ring round it; then the two years
    {at:atLast,place:"rfPlatform",keys:[[0,960,540,1.0],[T.y77-0.4,960,520,1.04]],d:2.4,push:0.02,dis:0.8,draw:(cx,tt)=>{
      rf_ring(cx,1090,620,220,clamp((tt-T.lastCase+0.3)/1.4,0,1),1);dq_chip(cx,1090,790,"India's last case",{align:"center",a:ag_in(tt,T.lastCase,0.5)});
      dq_textCard(cx,140,262,600,{kick:"1977",title:"India free of smallpox"},{a:ag_in(tt,T.y77,0.5),k:tt-T.y77});
      dq_textCard(cx,1220,262,620,{kick:"1980",title:"The world free of smallpox"},{a:ag_in(tt,T.y80,0.5),k:tt-T.y80});}},
    // the university: a name printed wrong, and printed again
    {at:atUni,place:"benchTop",keys:[[0,960,540,1.0],[T.again-0.3,1010,520,1.05]],d:2.2,push:0.02,dis:0.8,draw:(cx,tt)=>{
      rf_cert(cx,200,170,760,{on:"granite",name:"Renee Dubois",award:"Bachelor of Arts",ring:clamp((tt-T.wrong)/0.9,0,1),ringK:3});
      dq_chip(cx,580,780,"Printed wrong",{align:"center",a:ag_in(tt,T.wrong+0.4,0.45),on:"granite"});
      rf_cert(cx,980,210,760,{on:"granite",name:"Renée Dubois",award:"Bachelor of Arts",a:ag_in(tt,T.again-0.2,0.5),k:tt-T.again+0.2,angle:0.03});
      dq_chip(cx,1360,820,"Printed again",{align:"center",a:ag_in(tt,T.again+0.4,0.45),on:"granite"});}},
    // a graduate crosses the stage holding an empty folder
    {at:atHall,place:"hall",keys:[[0,960,540,1.0]],d:1.6,push:0.03,dis:0.8,draw:(cx,tt)=>{
      const x=lerp(640,930,ag_sine(clamp((tt-atHall)/3.2,0,1))),hd=dq_person(cx,RF_GRAD,x,600,0.98,{t:tt,warm:1,pose:"hold",hold:()=>{}});rf_holdOver(cx,x,600,0.98,false,hd,rf_folder);}},
    // a report is worth only what happens next
    {at:atWorth,place:"bench",keys:[[0,960,520,1.0]],d:1.6,push:0.02,dis:0.8,draw:(cx,tt)=>{
      const out=1-ag_in(tt,c.breath,0.8);rf_button(cx,650,110,{a:ag_in(tt,atWorth+0.6,0.5)*out});
      dq_T(cx,"A report is worth what happens next",960,400,{w:800,size:44,align:"center",col:"brass",a:ag_in(tt,T.worth+0.6,0.6)*out});
      [["Answer it",T.answer,560],["Fix it where it started",T.fix,960],["Tell them",T.tell,1360]].forEach(([s,at,x])=>dq_chip(cx,x,520,s,{align:"center",a:ag_in(tt,at,0.45)*out}));}}]);
  rf_tag(ctx,S,"India · 1974",rf_io(t,T.india-0.4,atPlan,0.5));rf_tag(ctx,S,"Search and contain · 1974 to 1975",rf_io(t,atDoor+0.3,T.house-0.5,0.5));
  rf_tag(ctx,S,"Assam · May 1975",rf_io(t,atLast+0.3,atUni,0.5),{dark:true});rf_tag(ctx,S,"The university",rf_io(t,atUni+0.3,atHall,0.5),{dark:true});
  dq_title(ctx,S,t,c.breath,"Report, fix, tell",null,"Quality as a habit · Film 2 of 4");});

/* ---------------------------------------------------------------- 2 · This isn't my name */
scene("mine",(ctx,S,t,sc)=>{const T=rf_once(sc,"T",()=>({
    monday:wAt(sc,"portal","Monday"),opens:wAt(sc,"portal","the portal opens"),evening:wAt(sc,"reads","That evening"),shown:wAt(sc,"reads","Andres Penaloza"),
    accent:wAt(sc,"marks","No accent"),tilde:wAt(sc,"marks","No tilde"),press:wAt(sc,"presses","presses"),types:wAt(sc,"presses","and types"),
    held:wAt(sc,"held","No check"),short:wAt(sc,"held","short"),allowed:wAt(sc,"held","every letter"),
    form:wAt(sc,"form","His record"),old:wAt(sc,"form","old online form"),caps:wAt(sc,"form","in capitals"),
    back:wAt(sc,"typed","When he came back"),again:wAt(sc,"typed","typed again"),looked:wAt(sc,"typed","it looked right"),people:wAt(sc,"people","People"),
    easy:wAt(sc,"easy","make it easy"),where:wAt(sc,"easy","where they see"),row:wAt(sc,"row","a row of data"),who:wAt(sc,"row","who"),
    shownN:wAt(sc,"row","the name shown"),given:wAt(sc,"row","the name given"),when:wAt(sc,"row","and when"),office:wAt(sc,"next","The registrar's office")}));
  const atScreen=T.evening+1.4,atRec=T.held-0.8,atBack=T.easy-0.8,P=RF_PAGE,B=RF_BTN[1],bx=B.x+B.w/2,by=P.btnY+P.btnH/2;
  ag_shots(ctx,S,t,sc.dur,[
    // his room, that evening, the laptop open
    {at:0,place:"rfHome",keys:[[0,960,540,1.0],[T.evening,940,520,1.06]],d:3,push:0.02,draw:(cx,tt)=>{
      dq_person(cx,"andres",760,600,1,{t:tt,cut:RF_HOME.table,gaze:[0.5,0.35]});rf_laptop(cx,880,836,{glow:1});
      dq_nameTag(cx,96,470,"andres",{a:ag_in(tt,T.evening,0.5)});}},
    // the screen, close: his name as it will be printed, the two marks, the button, and his name as he writes it
    {at:atScreen,place:"rfScreen",keys:[[0,960,540,1.0],[T.accent-0.4,700,420,1.32],[T.press-1.4,960,540,1.0]],d:1.6,push:0.015,dis:0.8,draw:(cx,tt)=>{
      const mv=ag_sine(clamp((tt-(T.press-1.5))/1.3,0,1)),cur=[lerp(1460,bx+8,mv),lerp(820,by+6,mv),rf_io(tt,T.press-1.6,T.types+2.8,0.4)];
      rf_portal(cx,{t:tt,ringE:clamp((tt-T.accent)/0.8,0,1),ringN:clamp((tt-T.tilde)/0.8,0,1),cursor:cur,press:ag_in(tt,T.press,0.25),field:ag_in(tt,T.press+0.5,0.5),
        typed:clamp((tt-T.types)/1.8,0,1),caret:tt>T.press+0.6});}},
    // the bench: his record in the student system, every check passed, and where its name was born
    {at:atRec,place:"benchTop",keys:[[0,960,540,1.0],[T.form-0.3,940,520,1.05]],d:2,push:0.02,cut:true,draw:(cx,tt)=>{
      const rows=[{k:"Name",v:"Andres Penaloza"},{k:"First recorded",v:"2018 · online form, A to Z"},{k:"As first typed",v:"ANDRES PENALOZA"},{k:"Since 2025",v:"retyped by hand, as ordinary letters"}],
        ra=[1,ag_in(tt,T.form,0.5),ag_in(tt,T.caps,0.5),ag_in(tt,T.again,0.5)];
      const r=dq_record(cx,300,150,1100,{head:"Student system",id:"S-16874",rows},{on:"granite",labW:260,fixed:true,rowA:(row,i)=>ra[i],lit:tt>T.old?1:undefined,litCol:"brass"});
      [["Not empty",T.held,420],["Length",T.short,760],["Letters allowed",T.allowed,1100]].forEach(([s,at,x])=>dq_tag(cx,x,r.y+r.h+26,"pass",{text:s,to:[x-20,r.y+r.h-4],a:ag_in(tt,at,0.4),k:tt-at,on:"granite"}));
      dq_T(cx,"People find errors no check can see",850,r.y+r.h+200,{w:800,size:44,align:"center",col:"brass",dark:true,a:ag_in(tt,T.people,0.6)});}},
    // back to the screen: where he sees it, he can say so; his report, a row of data; and what happens next
    {at:atBack,place:"rfScreen",keys:[[0,960,540,1.0]],d:1.6,push:0.015,cut:true,draw:(cx,tt)=>{
      rf_portal(cx,{t:tt,press:1,field:1,typed:1,outline:rf_io(tt,T.where,T.row-0.2,0.5),promise:ag_in(tt,T.office,0.6)});
      rf_report(cx,1230,200,560,{n:3,rowA:(row,i)=>ag_in(tt,[T.who,T.shownN,T.given][i],0.4),a:ag_in(tt,T.who-0.2,0.5),k:tt-T.who+0.2});}}]);
  rf_kick(ctx,S,t,"2","This isn't my name",{dark:false});rf_tag(ctx,S,"Monday 12 October 2026 · evening",rf_io(t,T.monday-0.2,atScreen,0.5),{y:132});});

/* ---------------------------------------------------------------- 3 · To the owner, with a promise */
scene("owner",(ctx,S,t,sc)=>{const T=rf_once(sc,"T",()=>({
    owners:wAt(sc,"owners","own names"),office:wAt(sc,"owners","the registrar's office"),promise:wAt(sc,"promise","Their promise"),two:wAt(sc,"promise","two working days"),
    model:wAt(sc,"model","Every report"),owner:wAt(sc,"model","its owner"),due:wAt(sc,"model","when it's due"),answered:wAt(sc,"model","answered"),
    people:wAt(sc,"do","what people do"),right:wAt(sc,"do","whether the data"),weekly:wAt(sc,"weekly","reviewed every week"),never:wAt(sc,"weekly","never failed"),
    morning:wAt(sc,"alert","Each morning"),dueDay:wAt(sc,"alert","which reports"),india:wAt(sc,"again","In India"),kept:wAt(sc,"again","a promise kept")}));
  const out1=T.morning-0.9,out2=T.india-0.9;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"bench",keys:[[0,960,540,1.0],[T.model-0.4,990,520,1.03]],d:2.4,push:0.015,draw:(cx,tt)=>{
      const end=1-ag_in(tt,sc.dur-0.9,0.5);
      dq_person(cx,"mei",RF_MEI[0],RF_MEI[1],RF_MEI[2],{t:tt,cut:DQ_BENCH.back,gaze:[0.5,0]});
      dq_nameTag(cx,120,150,"mei",{a:ag_in(tt,Math.max(T.office,6.6),0.5)*end});
      // the report comes to its owner, and its promise ties on; then it becomes the first row of the model of reports
      const ra=ag_in(tt,0.6,0.4)*(1-ag_in(tt,T.model-0.4,0.4));if(ra>0.01){const x=lerp(1280,620,ag_sine(clamp((tt-0.8)/1.8,0,1)));
        const r=rf_report(cx,x,150,580,{n:4,a:ra,lit:ag_in(tt,T.office,0.3)>0.5?3:undefined});
        dq_tag(cx,r.x+r.w-40,r.y+r.h+10,"brass",{text:"Due · Wed 14 Oct",to:[r.x+r.w-60,r.y+r.h-16],a:ra*ag_in(tt,T.promise,0.4),k:tt-T.promise});
        dq_chip(cx,r.x,r.y+r.h+110,"Within two working days",{col:"brass",a:ra*ag_in(tt,T.two,0.5)});}
      const la=ag_in(tt,T.model-0.1,0.5)*(1-ag_in(tt,out1,0.5));if(la>0.01)rf_ledger(cx,540,90,1320,452,{t:tt,n:5,a:la,lit:0,litCol:"brass",rowAt:i=>T.model+0.2+i*0.5});
      const ca=(1-ag_in(tt,out1,0.5));
      if(ca>0.01){dq_textCard(cx,560,580,620,{kick:"Checks",title:"Is the data right?"},{icon:"gauge",a:ca*ag_in(tt,T.right,0.5),k:tt-T.right});
        dq_textCard(cx,1220,580,640,{kick:"Tracked",title:"Do we answer in time?"},{icon:"clock",a:ca*ag_in(tt,T.people,0.5),k:tt-T.people});
        dq_chip(cx,1220,780,"Reviewed every week",{icon:"calendar",a:ca*ag_in(tt,T.weekly,0.5)});}
      rf_alert(cx,620,130,1160,{a:ag_in(tt,out1+0.6,0.5)*(1-ag_in(tt,out2,0.5)),row:ag_in(tt,T.dueDay,0.5),k:tt-out1-0.6});
      rf_frame(cx,700,150,900,"visited",tt,{a:ag_in(tt,out2+0.6,0.6)*end,line:"Visited at once",lineA:ag_in(tt,T.kept,0.5)});}}]);
  rf_kick(ctx,S,t,"3","To the owner, with a promise");});

/* ---------------------------------------------------------------- 4 · Fixed where it started */
scene("source",(ctx,S,t,sc)=>{const T=rf_once(sc,"T",()=>({
    wed:wAt(sc,"passport","Wednesday"),checks:wAt(sc,"passport","checks his name"),passport:wAt(sc,"passport","passport"),
    matches:wAt(sc,"system","It matches"),correct:wAt(sc,"system","correct it"),itself:wAt(sc,"system","itself"),
    night:wAt(sc,"night","That night"),list:wAt(sc,"night","the list"),every:wAt(sc,"night","every copy"),
    inList:wAt(sc,"undone","Fixed in the list"),undone:wAt(sc,"undone","undone"),sheet:wAt(sc,"copy","Fixed in a spreadsheet"),wrong:wAt(sc,"copy","wrong again"),
    guards:wAt(sc,"door","Like guards"),stops:wAt(sc,"door","stops it there")}));
  const atLine=T.night-1.4;
  ag_shots(ctx,S,t,sc.dur,[
    // Mei checks the name against the passport seen at his enrolment (kept closed), and corrects it in the student system itself
    {at:0,place:"bench",keys:[[0,960,540,1.0],[T.matches,1000,520,1.04]],d:2.4,push:0.015,draw:(cx,tt)=>{
      const u=ag_sine(clamp((tt-0.9)/0.45,0,1));
      dq_person(cx,"mei",RF_MEI[0],RF_MEI[1],RF_MEI[2],{t:tt,cut:DQ_BENCH.back,pose:"hang",pose2:"hold",mix:u,gaze:[0.5,0.2],
        hold:(c,hd)=>{if(u>0.01){c.save();c.globalAlpha*=u;rf_closedFolder(c,hd);c.restore();}}});
      const ra=1-ag_in(tt,T.matches-0.2,0.5);if(ra>0.01){const r=rf_report(cx,660,110,600,{n:3,a:ra});
        dq_chip(cx,r.x,r.y+r.h+50,"Checked against the passport seen at enrolment",{col:"pass",icon:"tick",a:ra*ag_in(tt,T.passport,0.5)});}
      const sa=ag_in(tt,T.matches+0.4,0.5);if(sa>0.01){const u=ag_in(tt,T.correct,0.6);
        const r=dq_record(cx,660,110,880,{head:"Student system",id:"S-16874",rows:[{k:"Given name",v:u>0.5?"Andrés":"Andres",was:u>0.5?"Andres":undefined,mark:u>0.5?"pass":undefined},
          {k:"Family name",v:u>0.5?"Peñaloza":"Penaloza",was:u>0.5?"Penaloza":undefined,mark:u>0.5?"pass":undefined}]},{a:sa,labW:220,fixed:true});
        dq_chip(cx,r.x,r.y+r.h+50,"Corrected at the source · 14 Oct",{col:"pass",icon:"tick",a:sa*ag_in(tt,T.itself,0.5)});}}},
    // later the same day, the wall: where the fix travels, every copy at once; a fix in a copy, undone or wrong again; guards at the door
    {at:atLine,place:"bench",later:true,keys:[[0,960,540,1.0]],d:1.6,push:0.015,dis:0.5,draw:(cx,tt)=>{
      const la=1-ag_in(tt,T.guards-0.9,0.5);
      if(la>0.01)rf_line(cx,{a:la,u:clamp((tt-T.night-0.4)/4.2,0,1),cardA:i=>ag_in(tt,atLine+0.5+i*0.25,0.4)});
      // what would have happened: dashed cards, for what wasn't done
      const da=ag_in(tt,T.inList,0.5)*la,ua=ag_in(tt,T.undone,0.6);if(da>0.01){dq_card(cx,80,640,760,150,{dash:true,a:da});dq_T(cx,"Fixed in the list",108,688,{w:700,size:30,a:da});
        dq_T(cx,ua>0.5?"Andres Penaloza":"Andrés Peñaloza",108,744,{w:600,size:30,f:"mono",col:ua>0.5?DQ.soft:dq_col("pass"),a:da});dq_chip(cx,520,735,"Undone next night",{col:"none",a:da*ua});}
      const sa=ag_in(tt,T.sheet,0.5)*la;if(sa>0.01){dq_card(cx,900,640,780,150,{dash:true,a:sa});dq_T(cx,"Fixed in a spreadsheet: a copy",928,688,{w:700,size:30,a:sa});
        dq_chip(cx,928,744,"Wrong again next year",{col:"none",a:sa*ag_in(tt,T.wrong,0.5)});}
      rf_frame(cx,560,170,800,"guards",tt,{a:ag_in(tt,T.guards-0.3,0.6),line:"Stopped where it started",lineA:ag_in(tt,T.stops,0.5)});}}]);
  rf_kick(ctx,S,t,"4","Fixed where it started");rf_tag(ctx,S,"Wednesday 14 October",rf_io(t,T.wed-0.2,atLine,0.5),{y:132});});

/* ---------------------------------------------------------------- 5 · Tell them */
scene("tell",(ctx,S,t,sc)=>{const T=rf_once(sc,"T",()=>({
    tells:wAt(sc,"told","tells him"),printed:wAt(sc,"told","Your name will be"),thank:wAt(sc,"told","Thank you"),bother:wAt(sc,"bother","A report"),
    paid:wAt(sc,"paid","In India"),reported:wAt(sc,"paid","reported too"),month:wAt(sc,"month","In October"),n61:wAt(sc,"right","Sixty-one"),three:wAt(sc,"right","three waited"),
    told:wAt(sc,"right","Every one"),cost:wAt(sc,"cost","what it cost"),graduate:wAt(sc,"cost","a graduate"),note:wAt(sc,"note","The admissions team"),monthly:wAt(sc,"note","a note each month"),
    oct:wAt(sc,"october","October's note"),n38:wAt(sc,"october","thirty-eight"),n11:wAt(sc,"october","eleven"),asks:wAt(sc,"asks","So from November"),
    passport:wAt(sc,"asks","their passport"),redman:wAt(sc,"redman","Thomas Redman"),customers:wAt(sc,"redman","customers"),creators:wAt(sc,"redman","creators"),
    cost2:wAt(sc,"redman","what an error cost")}));
  const atHome=T.bother-0.8,atBench=T.paid-0.9,o1=T.month-0.8,o2=T.cost-0.9,o3=T.redman-0.9;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"rfScreen",keys:[[0,960,540,1.0]],d:1.6,push:0.015,draw:(cx,tt)=>{
      rf_portal(cx,{t:tt,name:"Andres Penaloza",name2:"Andrés Peñaloza",swap:ag_in(tt,T.printed,0.8),press:1,answer:ag_in(tt,T.printed,0.5),thanks:ag_in(tt,T.thank,0.5)});}},
    {at:atHome,place:"rfHome",keys:[[0,920,500,1.12]],d:1.6,push:0.02,dis:0.8,draw:(cx,tt)=>{
      dq_person(cx,"andres",760,600,1,{t:tt,cut:RF_HOME.table,gaze:[0.5,0.35],smile:ag_in(tt,atHome+0.4,0.8)});rf_laptop(cx,880,836,{glow:1});}},
    {at:atBench,place:"bench",keys:[[0,960,520,1.0]],d:1.6,push:0.015,dis:0.8,draw:(cx,tt)=>{
      rf_frame(cx,560,150,800,"paid",tt,{a:1-ag_in(tt,o1,0.5),line:"Paid",lineA:ag_in(tt,T.paid+0.6,0.5)});
      const ma=ag_in(tt,o1+0.6,0.5)*(1-ag_in(tt,o2,0.5));if(ma>0.01)rf_month(cx,520,150,880,{a:ma,k:tt-o1-0.6,lineA:i=>ag_in(tt,[T.month+0.3,T.n61,T.three,T.told][i],0.45)});
      const na=ag_in(tt,o2+0.6,0.5)*(1-ag_in(tt,o3,0.5));if(na>0.01){rf_adNote(cx,240,80,820,{a:na,k:tt-o2-0.6,costA:ag_in(tt,T.cost,0.45),gradA:ag_in(tt,T.graduate,0.45),everyA:ag_in(tt,T.monthly,0.45),lineA:i=>ag_in(tt,[T.oct,T.n38,T.n11][i],0.45)});
        dq_textCard(cx,1140,140,640,{kick:"From 2 November",title:"A student who comes back checks their name against their passport"},{edge:"brass",a:na*ag_in(tt,T.asks,0.5),k:tt-T.asks});}
      const ra=ag_in(tt,o3+0.6,0.5);if(ra>0.01){dq_T(cx,"THOMAS REDMAN",960,300,{w:800,size:28,ls:3.5,align:"center",col:DQ.soft,a:ra});
        const a1=ag_in(tt,T.customers,0.45),a2=ag_in(tt,T.creators,0.45),ar=ag_in(tt,T.cost2,0.6);
        const b1=dq_chip(cx,560,430,"Data's customers",{align:"center",a:a1,size:36,icon:"people"}),b2=dq_chip(cx,1360,430,"Data's creators",{align:"center",a:a2,size:36,icon:"person"});
        if(ar>0.01){const x0=b1.x+b1.w+24,xe=b2.x-24,x1=lerp(x0,xe,ag_sine(ar));cx.save();cx.globalAlpha*=ar;cx.strokeStyle=rgba(DQ.ink,0.6);cx.lineWidth=3;cx.beginPath();cx.moveTo(x0,430);cx.lineTo(x1-10,430);cx.stroke();
          cx.fillStyle=rgba(DQ.ink,0.6);cx.beginPath();cx.moveTo(x1+6,430);cx.lineTo(x1-12,420);cx.lineTo(x1-12,440);cx.closePath();cx.fill();cx.restore();
          dq_T(cx,"what an error cost",(x0+xe)/2,404,{w:600,size:28,align:"center",col:DQ.soft,a:ar});}}}}]);
  rf_kick(ctx,S,t,"5","Tell them",{y:44,dark:true});});

/* ---------------------------------------------------------------- 6 · Every case, a check */
scene("check",(ctx,S,t,sc)=>{const T=rf_once(sc,"T",()=>({
    read:wAt(sc,"born","Read together"),born:wAt(sc,"born","where errors are born"),n19:wAt(sc,"born","nineteen"),n12:wAt(sc,"born","twelve"),
    becomes:wAt(sc,"becomes","becomes a check"),jun:wAt(sc,"adds","Jun"),made:wAt(sc,"adds","a name the old form made"),plain:wAt(sc,"adds","still in plain letters"),
    confirmed:wAt(sc,"adds","not yet confirmed"),accent:wAt(sc,"accent","missing accent"),bornIn:wAt(sc,"accent","where a name was born"),
    holds:wAt(sc,"holds","It holds"),keeps:wAt(sc,"holds","dbt keeps"),first:wAt(sc,"first","On its first night"),n83:wAt(sc,"first","eighty-three"),
    letter:wAt(sc,"letter","writes to each"),dropped:wAt(sc,"letter","our old form"),seven:wAt(sc,"seven","seven"),log:wAt(sc,"log","issue log"),
    india:wAt(sc,"ring","As in India")}));
  const o1=T.becomes-0.9,o2=T.letter-0.8,o3=T.seven-0.8,o4=T.log-0.9,atPlan=T.india-0.8;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"bench",later:true,keys:[[0,960,540,1.0]],d:1.6,push:0.015,draw:(cx,tt)=>{
      dq_person(cx,"jun",RF_JUN[0],RF_JUN[1],RF_JUN[2],{t:tt,cut:DQ_BENCH.back,gaze:[0.5,0]});dq_nameTag(cx,110,150,"jun",{a:ag_in(tt,T.jun,0.5)});
      // the reports read together: where each error was born
      const la=ag_in(tt,0.6,0.5)*(1-ag_in(tt,o1,0.5));if(la>0.01){rf_ledger(cx,520,130,1340,452,{n:5,a:la,kind:ag_in(tt,T.born,0.3),lit:tt>T.n12?[0,1,3]:undefined,litCol:"steel"});
        dq_figure(cx,700,700,"19","reports in the first three days",{col:"steel",size:96,a:la*ag_in(tt,T.n19,0.4)});dq_figure(cx,1200,700,"12","from the old online form",{col:"steel",size:96,a:la*ag_in(tt,T.n12,0.4)});}
      // a kind of error a person found becomes a check, and the check holds for a person
      const ca=ag_in(tt,T.becomes-0.2,0.5)*(1-ag_in(tt,o3,0.5));if(ca>0.01)rf_check(cx,500,80,760,{a:ca,k:tt-T.becomes+0.2,lineA:i=>ag_in(tt,[T.made,T.plain,T.confirmed][i],0.45),rule:clamp((tt-T.made)/1.2,0,1),tagA:ag_in(tt,T.holds,0.4),tagK:tt-T.holds});
      // what it can't see, and what it can
      const sa=ag_in(tt,T.accent-0.4,0.5)*(1-ag_in(tt,o3,0.5));if(sa>0.01){const X=1300,Y=100;rf_stack(cx,X,Y,{a:sa});
        const ga=ag_in(tt,T.accent,0.4)*(1-ag_in(tt,T.bornIn,0.5));for(const k of [5,10]){const lx=rf_letterAt(cx,"Joaquin Munoz",k,X+24,36);cx.save();cx.globalAlpha*=sa*ga;cx.setLineDash([6,6]);
          cx.strokeStyle=rgba(DQ_TONE.none.col,1);cx.lineWidth=3;cx.beginPath();cx.arc(lx,Y+106-12,19,0,TAU);cx.stroke();cx.restore();}
        const ba=ag_in(tt,T.bornIn,0.5)*sa;if(ba>0.01){cx.save();cx.globalAlpha*=ba;cx.strokeStyle=rgba(DQ.brass,0.95);cx.lineWidth=3;rr(cx,X+12,Y+12,496,46,8);cx.stroke();cx.restore();}}
      // dbt keeps what it holds, in a table the registrar's office reads; on its first night, 83
      const ka=ag_in(tt,T.keeps,0.5)*(1-ag_in(tt,o2,0.5));if(ka>0.01)rf_kept(cx,500,470,1340,{a:ka,n:lerp(0,83,ag_eo(clamp((tt-T.n83+0.6)/1.2,0,1))),k:tt-T.keeps});
      const ea=ag_in(tt,o2+0.5,0.5)*(1-ag_in(tt,o3,0.5));if(ea>0.01)rf_letter(cx,500,470,1000,{a:ea,k:tt-o2-0.5});
      // within a week, seven gave back their accents
      const va=ag_in(tt,o3+0.5,0.5)*(1-ag_in(tt,o4,0.5));if(va>0.01){rf_seven(cx,560,170,{a:va,turn:i=>ag_in(tt,T.seven+0.2+i*0.35,0.4)});
        dq_chip(cx,1196,470,"7 accents given back",{align:"center",col:"pass",icon:"tick",a:va*ag_in(tt,T.seven+2.8,0.5)});}
      rf_issueLog(cx,480,150,1340,{a:ag_in(tt,o4+0.5,0.5),row:ag_in(tt,T.log,0.5),k:tt-o4-0.5});}},
    {at:atPlan,place:"rfPlan",keys:[[0,RF_RING.x,RF_RING.y-30,1.3]],d:1.6,push:0.02,dis:0.8,draw:(cx,tt)=>{
      rf_planState(cx,tt,{chain:1,toMissed:1,ticks:1,missed:1,need:0,guards:1,ring:1,inside:1,stop:1});}}]);
  rf_kick(ctx,S,t,"6","Every case, a check");});

/* ---------------------------------------------------------------- 7 · Every report answered */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,T=rf_once(sc,"T",()=>({
    after:wAt(sc,"after","after the last case"),rose:wAt(sc,"after","the reward rose"),months:wAt(sc,"after","four months"),answered:wAt(sc,"after","every report"),
    none:wAt(sc,"gone","None"),gone:wAt(sc,"gone","it was gone"),uni:wAt(sc,"uni","At the university"),check:wAt(sc,"uni","becomes a check"),cert:wAt(sc,"cert","certificate"),
    take:wAt(sc,"take","Answer")}));
  const atUni=T.uni-0.8,atCert=T.cert-0.9;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"rfLaneDusk",keys:[[0,960,540,1.0]],d:2.4,push:0.02,draw:(cx,tt)=>{
      dq_textCard(cx,1160,96,660,{kick:"From July 1975",title:"Rs 1,000 for a report",sub:"About four months' pay"},{edge:"brass",a:ag_in(tt,T.rose,0.5),k:tt-T.rose});
      [[453,T.answered+0.4],[1245,T.none]].forEach(([x,at])=>dq_chip(cx,x,494,"Not smallpox",{align:"center",icon:"tick",col:"pass",a:ag_in(tt,at,0.45)}));}},
    {at:atUni,place:"bench",keys:[[0,960,540,1.0]],d:1.6,push:0.015,dis:0.8,draw:(cx,tt)=>{
      rf_ledger(cx,400,90,1380,452,{n:5,ans:1,told:1,every:true});rf_check(cx,400,580,780,{tagRight:true,tagA:ag_in(tt,T.check,0.4),tagK:tt-T.check,a:ag_in(tt,T.check-0.4,0.5)});}},
    {at:atCert,place:"benchTop",keys:[[0,960,500,1.0]],d:1.6,push:0.02,cut:true,draw:(cx,tt)=>{
      const out=1-ag_in(tt,c.breath,1.0);rf_cert(cx,500,110,900,{on:"granite",name:"Andrés Peñaloza",award:"Master of Data Analytics",a:out});
      dq_tag(cx,1330,690,"pass",{text:"As he writes it",to:[1310,664],a:ag_in(tt,T.cert+0.6,0.4)*out,k:tt-T.cert-0.6,on:"granite"});}}]);
  rf_tag(ctx,S,"India · 1975",rf_io(t,0.4,atUni,0.5),{dark:true});rf_tag(ctx,S,"The university",rf_io(t,atUni+0.3,atCert,0.5));
  dq_end(ctx,S,t,c.breath,"Report, fix, tell","Answer every report, fix it where it started, and tell them.","Film 2 of 4","Quality as a habit");});

// chapters 4 and 6 open on the bench where 3 and 5 end: the camera glides on from there (ag_cutInto). Mei stays where she stands as
// the wall clears; before 6, a later moment, what 5 left on the wall goes before Jun and the reports come in.
ag_cutInto(["source","check"]);
