/* ===== Defined in the open: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The vault is painted once
   (kilo.js); the university is the module's map ("map", and "night" without its grid). Each chapter is one shot in each place it
   visits, and everything in it comes in and leaves on its words, so in one place the camera only glides and nothing jumps: a
   new picture comes in once the one before has left. The kilogram's vault and the university's map are two rooms, joined by a cut.
   Chapters that open in the place the last one ends in glide on from its camera (ag_cutInto, after the last scene). */

// in at t0, out at t1 (each over d seconds)
const dn_io=(t,t0,t1,d0,d1)=>ag_in(t,t0,d0||0.5)*(1-ag_in(t,t1,d1||0.4));
// a spring from t0, for o.k
const dn_k=(t,t0)=>(t-t0)/0.5;
// a person, faded as one picture
function dn_person(ctx,who,x,y,s,a,o){if(a<=0.004)return;withA(ctx,a,()=>md_person(ctx,who,x,y,s,o));}

/* ---------------------------------------------------------------- 1 · A kilogram anyone can make */
scene("kilo",(ctx,S,t,sc)=>{
  const T={plat:wAt(sc,"place","platinum"),becomes:wAt(sc,"place","becomes"),forty:wAt(sc,"copies","Forty"),checks:wAt(sc,"copies","checks"),
    only:wAt(sc,"only","only"),every:wAt(sc,"only","every"),weighed:wAt(sc,"only","weighed"),drifted:wAt(sc,"drift","drifted"),fifty:wAt(sc,"drift","fifty"),
    nobody:wAt(sc,"which","Nobody"),bydef:wAt(sc,"which","by definition"),rests:wAt(sc,"rests","rests"),scratched:wAt(sc,"rests","scratched"),
    vote:wAt(sc,"vote","In"),conf:wAt(sc,"vote","conference"),anew:wAt(sc,"vote","anew"),from:wAt(sc,"constant","From"),nature:wAt(sc,"constant","constant of nature"),
    fixed:wAt(sc,"constant","fixed"),lab:wAt(sc,"make","lab"),kibble:wAt(sc,"make","Kibble"),weighs:wAt(sc,"make","weighs"),
    one:wAt(sc,"same","One definition"),same:wAt(sc,"same","the same for everyone"),us:wAt(sc,"us","United States"),such:wAt(sc,"us","such a balance"),copyno:wAt(sc,"us","copy number"),
    uni:wAt(sc,"uni","At the university"),meas:wAt(sc,"uni","measure"),tools:wAt(sc,"three","three tools"),nums:wAt(sc,"three","three numbers"),ctc:wAt(sc,"three","casual teaching cost"),
    nob2:wAt(sc,"three","nobody"),once:wAt(sc,"now","defined once"),every2:wAt(sc,"now","every tool")};
  ag_shots(ctx,S,t,sc.dur,[
    // the vault: the kilogram close, then the forty copies round it, the balance, the drift, the risk, and the new definition
    {at:0,place:"dnVault",keys:[[0,960,600,1.65],[T.forty-0.9,960,540,1]],d:2.6,push:0.02,draw:(c,tt)=>{
      const gold=Math.max(0.55*ag_in(tt,T.becomes,0.6),ag_in(tt,T.only,0.5))*(1-ag_in(tt,T.from,0.8));
      dn_arc(c,{n:clamp((tt-T.forty)/2.2,0,1),weights:clamp((tt-T.checks)/1.2,0,1),dim:ag_in(tt,T.only,0.6),lines:clamp((tt-T.rests)/1.6,0,1),a:1-ag_in(tt,T.vote-0.3,0.7)});
      dn_arc(c,{n:1,gold:clamp((tt-T.same+0.2)/1.4,0,1),a:ag_in(tt,T.same-0.2,0.3)*(1-ag_in(tt,T.uni-1.0,0.6))});
      dn_kilo(c,960,760,1,{gold,scratch:dn_io(tt,T.scratched,T.vote-0.4,0.5,0.6)});
      // what it is: platinum and iridium, about 39 mm
      dn_card(c,1080,590,330,[{s:"platinum and iridium"},{s:"about 39 mm",col:MD.soft}],{edge:DN.warm,a:dn_io(tt,T.plat,T.forty-0.6),k:dn_k(tt,T.plat)});
      // the definition, held by one object; then the constant in its place
      const kc=dn_io(tt,T.becomes,T.from-0.1,0.5,0.4);
      if(kc>0)dn_card(c,660,350,600,[{s:"the kilogram = this cylinder",size:36,w:700},{s:"by definition: exactly 1 kg",col:MD.soft,k:clamp((tt-T.bydef)/0.6,0,1)}],{edge:MD.agreed,a:kc,k:dn_k(tt,T.becomes)});
      const pc=ag_in(tt,T.from+0.4,0.5);if(pc>0)dn_planckCard(c,960,350,{a:pc,k:dn_k(tt,T.from+0.4),sub:clamp((tt-T.fixed+0.2)/0.7,0,1)});
      // the copies come back to be weighed against it, about every forty years
      const ba=dn_io(tt,T.every,T.drifted-0.2,0.5,0.4);if(ba>0){dn_balance(c,1580,866,0.86,{a:ba,k:dn_k(tt,T.every),tilt:0.035*Math.sin((tt-T.weighed)*1.6)*ag_in(tt,T.weighed,0.6)});
        ["1889","1946","1989"].forEach((y,i)=>md_pill(c,1450+i*130,330,y,{col:DN.warm,size:30,a:ba*ag_in(tt,T.every+0.5+i*0.45,0.3),k:dn_k(tt,T.every+0.5+i*0.45)}));}
      // and by 1989 they have drifted apart
      dn_fan(c,1240,570,560,300,{a:dn_io(tt,T.drifted-0.1,T.rests+1.2,0.5,0.5),k:dn_k(tt,T.drifted-0.1),u:clamp((tt-T.drifted)/1.8,0,1),label:ag_in(tt,T.fifty,0.5)});
      // nobody can tell which has moved
      const qa=dn_io(tt,T.nobody,T.rests-0.2,0.4,0.4);md_tag(c,300,640,"the copies?",{col:MD.wait,align:"center",a:qa});
      md_tag(c,960,846,"or the kilogram?",{col:MD.wait,align:"center",a:qa*ag_in(tt,T.nobody+0.6,0.4)});
      md_tag(c,520,700,"could be scratched, or lost",{col:DN.warm,align:"center",a:dn_io(tt,T.scratched+0.2,T.vote-0.4,0.4,0.5)});
      // 2018: a new definition
      dn_card(c,96,170,520,[{s:"NOVEMBER 2018",size:28,w:800,col:DN.warm},{s:"the world's conference on",size:34,w:700},{s:"weights and measures",size:34,w:700},{s:"a new definition",col:MD.agreed,k:clamp((tt-T.anew)/0.6,0,1)}],
        {edge:DN.warm,a:dn_io(tt,T.conf-0.3,T.lab-0.2,0.5,0.5),k:dn_k(tt,T.conf-0.3)});
      // made from the constant, anywhere: a Kibble balance
      const ka=dn_io(tt,T.kibble-0.2,T.one-0.3,0.5,0.5);if(ka>0){dn_kibble(c,1580,876,0.8,{a:ka,k:dn_k(tt,T.kibble-0.2),field:ag_in(tt,T.weighs,0.6)});
        dn_card(c,1300,170,560,[{s:"Kibble balance",size:34,w:700},{s:"weighs a mass against an",col:MD.soft,k:clamp((tt-T.weighs)/0.5,0,1)},{s:"electromagnetic force",col:MD.soft,k:clamp((tt-T.weighs-0.2)/0.5,0,1)}],{edge:DN.warm,a:ka,k:dn_k(tt,T.kibble)});}
      // the United States' standard of mass
      dn_us(c,110,600,{a:dn_io(tt,T.us-0.2,T.uni-1.0,0.5,0.6),k:dn_k(tt,T.us-0.2),strike:clamp((tt-T.copyno)/0.6,0,1),kb:clamp((tt-T.copyno-0.9)/0.6,0,1)});
      dn_placeTag(c,S,"1889 · near Paris",ag_in(tt,0.5,0.8)*(1-ag_in(tt,T.vote-0.3,0.6)));}},
    // the university: three tools, three numbers, one name; then one definition, and every tool gives its number
    {at:T.uni-0.15,cut:true,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      const wa=1-ag_in(tt,T.once-0.2,0.6),ea=1-ag_in(tt,sc.cues.breath-0.3,0.6);if(ea<=0)return;c.save();c.globalAlpha*=ea;
      for(let i=0;i<3;i++)dn_win(c,i,{a:ag_in(tt,T.tools+0.25+0.4*i,0.4)*wa,k:dn_k(tt,T.tools+0.25+0.4*i),what:0});
      // the measure's name comes first, then rises over the three windows that each give it a number
      const na=dn_io(tt,T.meas,T.once-0.2,0.5,0.5),nu=ag_sine(clamp((tt-T.tools+0.5)/0.9,0,1)),ba=ag_in(tt,T.ctc,0.5)*na;
      if(ba>0){c.save();c.globalAlpha*=ba;c.strokeStyle=rgba(MD.soft,0.8);c.lineWidth=2;c.beginPath();c.moveTo(360,268);c.lineTo(360,246);c.lineTo(1560,246);c.lineTo(1560,268);c.moveTo(960,246);c.lineTo(960,268);c.stroke();c.restore();}
      md_tag(c,960,lerp(470,206,nu),"casual teaching cost",{align:"center",col:MD.ink,size:lerp(40,30,nu),a:na});
      md_pill(c,960,700,"which one is the answer?",{col:MD.wait,size:30,a:dn_io(tt,T.nob2,T.once-0.2,0.4,0.4),k:dn_k(tt,T.nob2)});
      // defined once, in gold, and every tool reads it
      const ga=ag_in(tt,T.once+0.2,0.5);if(ga>0){const b=md_textCard(c,610,200,700,{kick:"measure",title:"casual teaching cost",sub:"defined once, in a format any tool can read"},{edge:MD.agreed,kickCol:MD.agreed,a:ga,k:dn_k(tt,T.once+0.2)});
        [["SQL editor","query"],["a dashboard","table"],["Genie","eye"]].forEach(([nm,ic],i)=>{const k=ag_in(tt,T.every2+i*0.35,0.4);if(k<=0)return;const x=170+i*560,y=560,r=md_reader(c,x,y,460,{title:nm,sub:"A$2.21M · Semester 1",icon:ic,a:k});
          md_lane(c,md_curve([960,b.y+b.h],[x+230,y],{bend:0}),MD.agreed,0.6*k,{u:ag_sine(clamp((tt-T.every2-i*0.35)/0.8,0,1))});});}
      c.restore();setScreen(c,S);md_label(c,96,100,"2026 · the university",{col:MD.flow,a:ag_in(tt,T.uni,0.6)*ea});}}
  ],0.5);
  md_title(ctx,S,t,sc.cues.breath,"Defined in the open","Each measure defined once, in a format any tool can read","FILM 2 OF 3 · FROM TABLES TO DECISIONS");
});

/* ---------------------------------------------------------------- 2 · Three numbers, one name */
scene("three",(ctx,S,t,sc)=>{
  const T={casual:wAt(sc,"what","Casual"),hired:wAt(sc,"what","tutors hired"),claim:wAt(sc,"what","claim"),plan:wAt(sc,"asked","Planning"),fac:wAt(sc,"asked","Faculty of Health"),
    sem:wAt(sc,"asked","Semester"),sheet:wAt(sc,"sheet","spreadsheet"),hours:wAt(sc,"sheet","the hours"),pay:wAt(sc,"payroll","Payroll's"),paid:wAt(sc,"payroll","the pay paid"),
    fin:wAt(sc,"finance","Finance's"),claims:wAt(sc,"finance","the claims"),uni:wAt(sc,"finance","what the university"),each:wAt(sc,"right","Each"),all3:wAt(sc,"right","all three"),
    budget:wAt(sc,"short","Budget"),gap:wAt(sc,"short","three hundred"),tut:wAt(sc,"short","one tutorial"),rohan:wAt(sc,"inside","Rohan"),owns:wAt(sc,"inside","owns"),only:wAt(sc,"inside","only inside")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"map",keys:[[0,960,540,1],[T.rohan-0.9,1360,540,1.3]],d:1.9,push:0.015,draw:(c,tt)=>{
      // casual contracts and the claims against them: the HR system and the claims app
      const ha=dn_io(tt,T.casual-0.2,T.plan-0.6,0.5,0.4);if(ha>0){const h1=md_system(c,260,270,460,"hr",{sub:"Casual contracts",a:ha});
        const h2=md_system(c,260,480,460,{n:"Claims app",s:"Hours claimed, approved",c:MD.sys.hr},{a:ha*ag_in(tt,T.claim-0.3,0.4)});
        const k1=ag_in(tt,T.hired,0.4)*ha,k2=ag_in(tt,T.claim,0.4)*ha;
        if(k1>0){md_lane(c,md_curve(h1.port,[840,h1.port[1]],{bend:0}),MD.sys.hr,0.7*k1);dn_card(c,840,h1.port[1]-66,620,[{s:"CASUAL CONTRACT",size:28,w:800,col:MD.sys.hr},{s:"one unit · one teaching period",size:32,w:700}],{a:k1,k:dn_k(tt,T.hired)});}
        if(k2>0){md_lane(c,md_curve(h2.port,[840,h2.port[1]],{bend:0}),MD.sys.hr,0.7*k2);dn_card(c,840,h2.port[1]-66,620,[{s:"CLAIM",size:28,w:800,col:MD.sys.hr},{s:"tutorial · 1.00 h · approved",size:32,w:700}],{a:k2,k:dn_k(tt,T.claim)});}}
      // Health's question
      const qa=dn_io(tt,T.plan,T.all3-0.4,0.5,0.4);if(qa>0)dn_card(c,410,100,1100,[{s:"FACULTY OF HEALTH · SEMESTER 1 · 2026",size:28,w:800,col:MD.wait},{s:"What did casual teaching cost in Semester 1?",size:38,w:700}],{edge:MD.wait,a:qa,k:dn_k(tt,T.plan)});
      // three tools, three numbers
      const back=1-ag_in(tt,T.rohan-1.1,0.6);
      [[T.sheet,T.hours],[T.pay,T.paid],[T.fin,T.claims]].forEach(([a0,w0],i)=>dn_win(c,i,{a:ag_in(tt,a0-0.2,0.4)*(i<2?back:1),k:dn_k(tt,a0-0.2),what:clamp((tt-w0)/0.6,0,1),inner:clamp((tt-T.only+0.2)/0.8,0,1)}));
      const oc="on-costs: what the university pays on top of pay";md_tag(c,1820-md_tw(c,oc,{w:700,size:28})-44,652,oc,{col:MD.soft,a:dn_io(tt,T.uni,T.each-0.2,0.4,0.4)});
      // each right for its own question; all three called the same
      DN_WIN.forEach((D,i)=>md_tag(c,D.x+DN_WW/2,652,D.q,{col:MD.wait,align:"center",a:dn_io(tt,T.each+0.3+i*0.35,T.budget-0.3,0.4,0.4)}));
      const na=dn_io(tt,T.all3,T.budget-0.3,0.5,0.4);if(na>0){c.save();c.globalAlpha*=na;c.strokeStyle=rgba(MD.soft,0.8);c.lineWidth=2;c.beginPath();c.moveTo(360,290);c.lineTo(360,262);c.lineTo(1560,262);c.lineTo(1560,290);c.moveTo(960,262);c.lineTo(960,290);c.stroke();c.restore();
        md_tag(c,960,214,"casual teaching cost",{align:"center",col:MD.ink,a:na});}
      // the budget, on payroll's number: A$330,000 short, a tutorial in seven with no tutor
      dn_budget(c,200,700,1000,{a:dn_io(tt,T.budget-0.1,T.rohan-1.2,0.5,0.5),v:1.88,gap:ag_in(tt,T.gap,0.6),tut:clamp((tt-T.tut+0.4)/1.0,0,1),empty:ag_in(tt,T.tut+1.1,0.6)});
      // Rohan, who owns the measure; his definition, only inside his report
      dn_person(c,"rohan",1030,762,0.7,ag_in(tt,T.rohan-0.4,0.6),{t:tt,gaze:[4,-1]});
      md_nameTag(c,700,600,"rohan",{role:"Finance",col:MD.dom.finance,a:ag_in(tt,T.rohan,0.5)});
      md_tag(c,1560,652,"read only here",{icon:"lock",col:MD.soft,align:"center",a:ag_in(tt,T.only+0.6,0.5)});}}
  ],0.5);
});

/* ---------------------------------------------------------------- 3 · Its owner, its words, its rules */
scene("once",(ctx,S,t,sc)=>{
  const T={like:wAt(sc,"like","Like"),onedef:wAt(sc,"like","one definition"),sept:wAt(sc,"sept","September"),rohan:wAt(sc,"sept","Rohan"),jun:wAt(sc,"sept","Jun"),
    owner:wAt(sc,"owner","owner"),approves:wAt(sc,"owner","approves"),words:wAt(sc,"words","words"),also:wAt(sc,"words","Also called"),rules:wAt(sc,"rules","claims approved"),
    casual:wAt(sc,"rules","by casual staff"),teach:wAt(sc,"rules","for teaching"),oncost:wAt(sc,"rules","plus on costs"),counted:wAt(sc,"period","Counted"),
    claims:wAt(sc,"ingrid","The claims"),ingrid:wAt(sc,"ingrid","Ingrid"),names:wAt(sc,"names","names"),hours:wAt(sc,"names","casual hours contracted"),paid:wAt(sc,"names","casual pay paid")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"night",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      // like the kilogram: the constant's card, and an empty card for the measure's one definition
      const pa=dn_io(tt,T.like-0.2,T.sept-0.2,0.5,0.5);if(pa>0)dn_planckCard(c,960,340,{sub:1,a:pa,k:dn_k(tt,T.like-0.2)});
      const n=clamp((tt-T.owner+0.2)/0.5,0,1)+clamp((tt-T.words+0.2)/0.5,0,1)+clamp((tt-T.also+0.1)/0.5,0,1)+clamp((tt-T.rules)/0.5,0,1)+clamp((tt-T.casual)/0.5,0,1)+
        clamp((tt-T.teach)/0.5,0,1)+clamp((tt-T.oncost)/0.5,0,1)+clamp((tt-T.counted)/0.6,0,1);
      const ea=ag_in(tt,T.onedef,0.5)*(1-ag_in(tt,T.sept,0.5));if(ea>0){c.save();c.globalAlpha*=ea;md_card(c,530,60,860,150,{edge:MD.agreed,dash:[12,10]});c.restore();}
      const da=ag_in(tt,T.sept+0.1,0.5);if(da>0)dn_def(c,530,60,{n,a:da,k:dn_k(tt,T.sept+0.1)});
      // Rohan and Jun; then Ingrid, for the claims' fields
      dn_person(c,"rohan",300,700,0.95,ag_in(tt,T.rohan-0.3,0.6),{t:tt,gaze:[4,-2]});
      md_nameTag(c,120,330,"rohan",{role:"Finance · owner",col:MD.dom.finance,a:ag_in(tt,T.rohan,0.5)});
      dn_person(c,"jun",1640,700,0.95,dn_io(tt,T.jun-0.3,T.claims-0.6,0.6,0.5),{t:tt+0.7,flip:true,gaze:[4,-2]});
      md_nameTag(c,1640,330,"jun",{role:"Data project",col:MD.flow,align:"center",a:dn_io(tt,T.jun,T.claims-0.6,0.5,0.5)});
      dn_person(c,"ingrid",1640,700,0.95,ag_in(tt,T.ingrid-0.2,0.6),{t:tt+1.3,flip:true,gaze:[4,-2]});
      md_nameTag(c,1640,330,"ingrid",{role:"HR",col:MD.sys.hr,align:"center",a:ag_in(tt,T.ingrid+0.1,0.5)});
      md_tag(c,1640,236,"claims · HR's data",{col:MD.sys.hr,align:"center",a:ag_in(tt,T.claims,0.5)});
      // the other two numbers, under names of their own
      const n1=ag_in(tt,T.hours,0.5),n2=ag_in(tt,T.paid,0.5);
      if(n1>0)dn_card(c,530,712,440,[{s:"casual hours contracted",size:30,w:700},{s:"for planning",col:MD.soft}],{edge:MD.agreed,a:n1,k:dn_k(tt,T.hours)});
      if(n2>0)dn_card(c,990,712,440,[{s:"casual pay paid",size:30,w:700},{s:"for each pay day",col:MD.soft}],{edge:MD.agreed,a:n2,k:dn_k(tt,T.paid)});}}
  ],0.5);
});

/* ---------------------------------------------------------------- 4 · Near the data, built as code */
const DN_YAML=[["{{ config(materialized='metric_view') }}",0],["version: 1.1",0],["source: \"{{ ref('mart_finance__casual_claims') }}\"",0],["fields:",0],
  ["- name: faculty_name",2],["expr: faculty_name",4],["- name: unit_code",2],["expr: unit_code",4],["- name: teaching_period",2],["expr: teaching_period",4],
  ["measures:",0],["- name: casual_teaching_cost",2],["expr: SUM(amount * (1 + on_cost_rate))",4],["FILTER (WHERE is_teaching_duty)",6],["display_name: Casual teaching cost",4],
  ["comment: What the casual teaching in a …",4],["synonyms: [sessional teaching cost, casual teaching spend]",4],["format: {type: currency, currency_code: AUD}",4]];
// the lines its words light: display name, comment, synonyms, format
const DN_YAML_WORDS=14;
scene("near",(ctx,S,t,sc)=>{
  const T={mv:wAt(sc,"home","metric view"),uc:wAt(sc,"home","Unity Catalog"),beside:wAt(sc,"home","beside"),holds:wAt(sc,"view","holds"),how:wAt(sc,"view","however"),
    fac:wAt(sc,"view","by faculty"),unit:wAt(sc,"view","unit"),per:wAt(sc,"view","teaching period"),gov:wAt(sc,"gov","governs"),who:wAt(sc,"gov","who may read"),what:wAt(sc,"gov","what reads"),
    every:wAt(sc,"every","every tool"),jun:wAt(sc,"yaml","Jun"),yaml:wAt(sc,"yaml","YAML"),builds:wAt(sc,"yaml","which builds"),meaning:wAt(sc,"yaml","as Meaning"),
    rohan:wAt(sc,"review","Rohan"),pr:wAt(sc,"review","pull request"),noor:wAt(sc,"review","Noor"),prod:wAt(sc,"review","the change to production"),
    words:wAt(sc,"meta","Its words"),name:wAt(sc,"meta","a name to show"),desc:wAt(sc,"meta","a description"),syn:wAt(sc,"meta","synonyms"),fmt:wAt(sc,"meta","its format")};
  ag_shots(ctx,S,t,sc.dur,[
    // the platform: the fact and the metric view side by side in Unity Catalog; grouped any way; governed; read by every tool
    {at:0,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      const pa=ag_in(tt,0.2,0.6);md_platform(c,70,110,1160,770,{uc:true,a:pa});
      md_T(c,"university › prod_marts",130,272,{w:500,size:30,f:"mono",col:MD.soft,a:ag_in(tt,T.mv-0.3,0.5)});
      const f=md_table(c,130,300,600,{name:"mart_finance__casual_claims",kind:"table",a:ag_in(tt,T.beside,0.5),k:dn_k(tt,T.beside)});
      const m=md_table(c,130,450,600,{name:"casual_teaching_cost",kind:"metric view",col:MD.agreed,lit:ag_in(tt,T.holds,0.5)*0.6,a:ag_in(tt,T.mv,0.5),k:dn_k(tt,T.mv)});
      if(ag_in(tt,T.beside,0.5)>0.3)md_lane(c,[[300,f.y+f.h],[300,m.y]],MD.flow,0.7*ag_in(tt,T.beside+0.3,0.5));
      [["by faculty",T.fac],["by unit",T.unit],["by teaching period",T.per]].forEach(([s,t0],i)=>{const k=ag_in(tt,t0-0.1,0.4)*(1-ag_in(tt,T.what-0.8,0.4));if(k<=0)return;const y=280+i*150;
        md_lane(c,md_curve(m.r,[790,y+60],{bend:0.5}),MD.agreed,0.55*k);dn_card(c,790,y,400,[{s:s.toUpperCase(),size:28,w:800,col:MD.agreed},{s:"casual teaching cost",size:30,w:600}],{a:k,k:dn_k(tt,t0-0.1)});});
      md_tag(c,130,640,"Finance may read",{icon:"lock",col:MD.flow,a:ag_in(tt,T.who,0.5)});
      // what reads it: every tool on the platform
      [["SQL editor","query"],["Dashboard","table"],["Genie","eye"],["Alert","warn"]].forEach(([nm,ic],i)=>{const k=ag_in(tt,(i===0?T.what:T.every)+i*0.3-0.3,0.4);if(k<=0)return;const y=170+i*170;
        md_lane(c,md_curve(m.r,[1330,y+42],{bend:0.6}),MD.flow,0.6*k,{u:ag_sine(clamp(k*1.2,0,1))});md_reader(c,1330,y,500,{title:nm,icon:ic,a:k,lit:ag_in(tt,T.every+i*0.3,0.3)*(1-ag_in(tt,T.every+i*0.3+0.6,0.4))});});}},
    // the definition as code, in the data project; reviewed for its meaning and for production; its words go with it
    {at:T.jun-0.15,cut:true,place:"night",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      md_window(c,90,80,1100,800,{logo:"dbt",product:"dbt",title:"models/marts/finance/casual_teaching_cost.sql",a:ag_in(tt,T.jun,0.5),k:dn_k(tt,T.jun),draw:(cc,b)=>{
        const W=DN_YAML_WORDS,lit=i=>i<W?0:ag_in(tt,[T.name,T.desc,T.syn,T.fmt][i-W],0.4),dim=ag_in(tt,T.words,0.5);
        dn_code(cc,b.x+20,b.y+44,DN_YAML.map(([s,ind],i)=>({s,ind,k:clamp((tt-T.yaml+0.3-i*0.14)/0.4,0,1),lit:lit(i),dim:i<W?dim:dim*(1-lit(i))})),{lh:36,size:28});}});
      dn_card(c,1250,620,600,[{s:"as Meaning on the platform",size:30,w:700},{s:"built awards conferred",size:30,w:700}],{a:dn_io(tt,T.meaning,T.words-0.3,0.5,0.4),k:dn_k(tt,T.meaning)});
      dn_pr(c,1250,190,600,{a:ag_in(tt,T.pr-0.2,0.5),k:dn_k(tt,T.pr-0.2),ok:[clamp((tt-T.pr-0.7)/0.6,0,1),clamp((tt-T.prod-0.3)/0.6,0,1)]});}}
  ],0.5);
});

/* ---------------------------------------------------------------- 5 · The same idea in dbt */
const DN_SEM=[["semantic_models:",0],["- name: near_award",2],["measures:",4],["- name: learners",6],["metrics:",0],["- name: learners_near_graduate_certificate",2]];
scene("dbt",(ctx,S,t,sc)=>{
  const T={none:wAt(sc,"old","None"),dec:wAt(sc,"old","decades"),bi:wAt(sc,"old","BI tools"),layer:wAt(sc,"old","layer"),own:wAt(sc,"own","own format"),noother:wAt(sc,"own","no other tool"),
    newt:wAt(sc,"own","a new tool"),writing:wAt(sc,"own","writing"),dbt:wAt(sc,"mf","dbt"),mf:wAt(sc,"mf","MetricFlow"),yaml:wAt(sc,"mf","YAML"),plan:wAt(sc,"planning","Planning"),
    learners:wAt(sc,"planning","learners"),open:wAt(sc,"source","open source"),either:wAt(sc,"choose","Either"),choose:wAt(sc,"choose","Choose"),near:wAt(sc,"choose","near most"),never:wAt(sc,"choose","never")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"night",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      // BI tools of the past: each its own layer of definitions, in its own marks, that no other tool can read
      const ba=1-ag_in(tt,T.dbt-0.5,0.5);if(ba>0){c.save();c.globalAlpha*=ba;
        for(let i=0;i<3;i++)dn_bi(c,120+i*560,150,500,300,i,{a:ag_in(tt,T.dec-0.2+i*0.3,0.4),k:dn_k(tt,T.dec-0.2+i*0.3),n:clamp((tt-T.layer+0.2-i*0.2)/1.2,0,1)});
        const xa=ag_in(tt,T.noother,0.5);if(xa>0)for(let i=0;i<2;i++){const x0=620+i*560,x1=x0+60;md_lane(c,[[x0,300],[x1,300]],MD.soft,0.8*xa,{dash:[6,6]});md_icon(c,"cross",x0+30,300,30,MD.fail,{a:xa});}
        const na=ag_in(tt,T.newt,0.5);if(na>0)dn_bi(c,680,520,500,300,3,{a:na,k:dn_k(tt,T.newt),n:clamp((tt-T.writing)/2.2,0,1)});c.restore();}
      // dbt's semantic layer, MetricFlow, in the project: Planning's learners near a graduate certificate
      const da=dn_io(tt,T.dbt-0.1,T.either-0.4,0.5,0.4);if(da>0){md_window(c,90,130,1110,500,{logo:"dbt",product:"dbt",title:"models/marts/planning/_planning__semantic.yml",a:da,k:dn_k(tt,T.dbt-0.1),draw:(cc,b)=>
          dn_code(cc,b.x+20,b.y+52,DN_SEM.map(([s,ind],i)=>({s,ind,k:clamp((tt-T.yaml+0.2-i*0.18)/0.4,0,1),lit:i===5?ag_in(tt,T.learners,0.4):0})),{lh:44,size:30})});
        dn_card(c,1250,150,600,[{s:"PLANNING",size:28,w:800,col:MD.dom.students},{s:"learners near a",size:32,w:700},{s:"graduate certificate",size:32,w:700}],{a:da*ag_in(tt,T.plan,0.5),k:dn_k(tt,T.plan)});
        md_tag(c,1250,480,"open source · Apache License 2.0",{col:MD.pass,a:da*ag_in(tt,T.open,0.5)});}
      // either can be a measure's home: choose one for each, and never define it twice
      const ha=ag_in(tt,T.either,0.5);if(ha>0){dn_home(c,170,360,0,{a:ha,lit:ag_in(tt,T.choose+0.8,0.5)});dn_home(c,1190,360,1,{a:ha*ag_in(tt,T.either+0.3,0.4)});
        const u=ag_sine(clamp((tt-T.choose)/1.2,0,1)),gx=lerp(610,170,u),gy=lerp(150,560,u);
        md_textCard(c,gx,gy,560,{title:"casual teaching cost",sub:"Finance's measure"},{edge:MD.agreed,a:ag_in(tt,T.either+0.2,0.5),k:dn_k(tt,T.either+0.2)});
        const sa=dn_io(tt,T.never,T.never+2.2,0.4,0.6);if(sa>0){c.save();c.globalAlpha*=sa;const b=md_textCard(c,1190,560,560,{title:"casual teaching cost",sub:"a second definition"},{edge:MD.agreed,dash:[10,8]});
          c.strokeStyle=rgba(MD.fail,0.95);c.lineWidth=4;c.beginPath();c.moveTo(b.x+20,b.y+b.h/2);c.lineTo(b.x+20+(b.w-40)*ag_sine(clamp((tt-T.never-0.3)/0.5,0,1)),b.y+b.h/2);c.stroke();c.restore();}}}}
  ],0.5);
});

/* ---------------------------------------------------------------- 6 · A format any tool can read */
const DN_OSI=[["\"version\": \"0.1.1\",",0],["\"semantic_model\": [{",0],["\"datasets\": [ … ],",2],["\"metrics\": [{",2],["\"name\":",4],["\"learners_near_graduate_certificate\"",6]];
const DN_RULE=[["filter: …",0],["measures:",0],["- name: casual_teaching_cost",2],["expr: SUM(amount * (1 + on_cost_rate))",4],["FILTER (WHERE is_teaching_duty)",6]];
scene("open",(ctx,S,t,sc)=>{
  const T={forT:wAt(sc,"common","For tools"),common:wAt(sc,"common","common format"),apache:wAt(sc,"common","Apache"),began:wAt(sc,"began","began"),fifty:wAt(sc,"began","more than fifty"),
    dbx:wAt(sc,"began","Databricks"),conv:wAt(sc,"conv","Converters"),mv:wAt(sc,"conv","a metric view"),mf:wAt(sc,"conv","MetricFlow"),others:wAt(sc,"conv","many others"),
    writes:wAt(sc,"writes","dbt writes"),time:wAt(sc,"writes","each time"),reads:wAt(sc,"writes","reads Ossie"),ctc:wAt(sc,"travel","casual teaching cost"),any:wAt(sc,"travel","any tool"),
    words:wAt(sc,"travel","with its words"),nobody:wAt(sc,"travel","nobody"),keep:wAt(sc,"inside","Keep"),inm:wAt(sc,"inside","inside the measure"),travels:wAt(sc,"inside","travels"),
    check:wAt(sc,"check","check"),conv2:wAt(sc,"check","a converter")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      const lit=[];if(tt>T.mv)lit.push(0);if(tt>T.mf)lit.push(1);if(tt>T.others)lit.push(2);
      const ringA=1-ag_in(tt,T.writes-0.4,0.5);
      const sub=ag_in(tt,T.ctc+2.3,0.4);
      dn_hub(c,tt,{tools:ag_in(tt,T.forT,0.6),subs:[null,null,sub>0?"casual teaching cost":null],subA:sub,hub:clamp((tt-T.common)/0.6,0,1),was:ag_in(tt,T.began,0.5)*ringA,ring:clamp((tt-T.fifty)/1.4,0,1)*ringA,named:ag_in(tt,T.dbx,0.5)*ringA,spokes:clamp((tt-T.conv)/1.6,0,1),lit:lit.filter(i=>tt<T.writes||i!==2||tt>T.any)});
      // dbt writes the project's measures in Ossie, each time it reads the project; and reads Ossie too
      const ja=dn_io(tt,T.writes,T.ctc-0.4,0.5,0.4);if(ja>0)md_window(c,1040,90,840,320,{logo:"dbt",product:"target/osi_document.json",a:ja,k:dn_k(tt,T.writes),draw:(cc,b)=>
        dn_code(cc,b.x+16,b.y+38,DN_OSI.map(([s,ind],i)=>({s,ind,k:clamp((tt-T.time+0.3-i*0.15)/0.4,0,1)})),{lh:36,size:28})});
      const ra=dn_io(tt,T.reads,T.ctc-0.4,0.4,0.4);if(ra>0){md_lane(c,md_curve([1130,470],[1400,470],{bend:0}),MD.agreed,0.9*ra,{dash:[8,8],t:tt});md_tag(c,1615,568,"osi/",{col:MD.agreed,align:"center",a:ra});}
      // casual teaching cost goes to any tool that reads Ossie, with its words and its rules
      // from its home, over the format, into a tool that reads it, which then shows it
      const u=clamp((tt-T.ctc)/2.6,0,1),ta=ag_in(tt,T.ctc-0.2,0.4)*(1-ag_in(u,0.84,0.16));if(ta>0){const A=[305,330],B=[960,300],C=[1600,740];
        const p=u<0.5?[lerp(A[0],B[0],ag_sine(u*2)),lerp(A[1],B[1],ag_sine(u*2))]:[lerp(B[0],C[0],ag_sine(u*2-1)),lerp(B[1],C[1],ag_sine(u*2-1))];
        c.save();ag_about(c,p[0],p[1],lerp(1,0.55,ag_in(u,0.8,0.2)));dn_card(c,p[0]-210,p[1]-66,420,[{s:"casual teaching cost",size:30,w:700},{s:"owner · words · rules",col:MD.soft,k:ag_in(tt,T.words,0.4)}],{edge:MD.agreed,a:ta});c.restore();}
      // keep each rule inside the measure; a filter on the whole view stays behind
      const ka=ag_in(tt,T.keep-0.1,0.5);if(ka>0){md_window(c,70,590,860,290,{logo:"databricks",product:"casual_teaching_cost",title:"metric view",a:ka,k:dn_k(tt,T.keep-0.1),draw:(cc,b)=>
          dn_code(cc,b.x+16,b.y+36,DN_RULE.map(([s,ind],i)=>({s,ind,lit:i>=3?ag_in(tt,T.inm,0.4):0,dim:i===0?ag_in(tt,T.travels,0.5):0})),{lh:36,size:28})});
        md_tag(c,520,700,"stays behind",{col:MD.soft,a:ag_in(tt,T.travels+0.2,0.4)});}
      // and check what arrives: a converter says what it can't carry
      md_tag(c,1176,838,"notice: dropped what this tool can't hold",{icon:"warn",col:MD.wait,a:ag_in(tt,T.conv2,0.5)});}}
  ],0.5);
});

/* ---------------------------------------------------------------- 7 · One number, in every tool */
scene("same",(ctx,S,t,sc)=>{
  const T={today:wAt(sc,"today","Today"),payday:wAt(sc,"today","pay day"),asks:wAt(sc,"asks","Rohan asks"),what:wAt(sc,"asks","what casual"),num:wAt(sc,"asks","one point"),
    fort:wAt(sc,"dash","fortnightly"),ask:wAt(sc,"dash","Ask Genie"),gives:wAt(sc,"dash","gives the same"),last:wAt(sc,"last","Last"),other:wAt(sc,"last","the other two"),
    each:wAt(sc,"last","each under"),budget:wAt(sc,"budget","budget"),every:wAt(sc,"budget","every tutorial's"),kilo:wAt(sc,"kilo","Like the kilogram"),
    onedef:wAt(sc,"kilo","one definition"),held:wAt(sc,"kilo","held by no"),std:wAt(sc,"close","standards"),inv:wAt(sc,"close","investigate"),adapt:wAt(sc,"close","adapt"),
    impl:wAt(sc,"close","implement"),iter:wAt(sc,"close","iterate"),docs:wAt(sc,"close","official docs")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"map",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      const out=1-ag_in(tt,T.kilo-0.7,0.5);
      // pay day: Rohan asks Genie One, and the dashboard's Ask Genie gives the same
      dn_person(c,"rohan",300,700,0.95,ag_in(tt,T.asks-0.5,0.6)*out,{t:tt,gaze:[5,-3]});
      md_nameTag(c,120,330,"rohan",{role:"Finance",col:MD.dom.finance,a:ag_in(tt,T.asks-0.2,0.5)*out});
      dn_genie(c,560,110,740,520,{a:ag_in(tt,T.asks-0.2,0.5)*out,k:dn_k(tt,T.asks-0.2),q:clamp((tt-T.asks-0.2)/2.4,0,1),ans:clamp((tt-T.num+0.1)/0.6,0,1)});
      dn_dash(c,1340,110,540,520,{a:ag_in(tt,T.payday-0.2,0.5)*out,k:dn_k(tt,T.payday-0.2),dim:ag_in(tt,T.ask,0.5),ask:ag_in(tt,T.ask,0.4),ans:clamp((tt-T.gives)/0.6,0,1)});
      // last semester's, with the other two beside it, each under its own name
      const la=dn_io(tt,T.last-0.2,T.budget-1.0,0.5,0.4);if(la>0)[["casual teaching cost","A$2.21M"],["casual hours contracted","A$2.46M"],["casual pay paid","A$1.88M"]].forEach(([nm,v],i)=>{
        const k=i===0?la:la*ag_in(tt,(i===1?T.other:T.each)+0.1*i,0.4);if(k>0)dn_card(c,560+i*450,664,430,[{s:nm,size:30,w:700},{s:v+" · Semester 1",size:30,w:600,col:MD.soft}],{edge:MD.agreed,a:k,k:dn_k(tt,i===0?T.last-0.2:(i===1?T.other:T.each)),glow:i===0?1:0.4});});
      // Health's budget, on the cost: every tutorial's tutor in it
      dn_budget(c,560,730,880,{a:dn_io(tt,T.budget-0.4,T.kilo-0.7,0.5,0.5),v:2.21,col:MD.agreed,label:"Health's budget for next year, on the cost",gap:0,tut:clamp((tt-T.every+0.3)/0.8,0,1),empty:0});
      // like the kilogram: one definition, held by no single tool
      const ka=dn_io(tt,T.kilo-0.1,T.std-0.4,0.6,0.5);if(ka>0){dn_planckCard(c,560,300,{size:40,sub:1,a:ka,k:dn_k(tt,T.kilo-0.1)});
        md_textCard(c,1010,300,640,{kick:"measure",title:"casual teaching cost",sub:"owner · words · rules"},{edge:MD.agreed,kickCol:MD.agreed,a:ka*ag_in(tt,T.onedef-0.2,0.5),k:dn_k(tt,T.onedef-0.2)});
        md_pill(c,960,620,"one definition · held by no single tool",{col:MD.agreed,size:30,a:ka*ag_in(tt,T.held,0.5),k:dn_k(tt,T.held)});}
      // don't reinvent the standards: investigate, adapt, implement, iterate, starting from the official docs
      const sa=ag_in(tt,T.std-0.1,0.5)*(1-ag_in(tt,sc.cues.breath-0.3,0.6));if(sa>0){c.save();c.globalAlpha*=sa;
        md_reader(c,170,190,440,{title:"a metric view",logo:"databricks",h:100});md_pill(c,960,240,"Apache Ossie",{col:MD.agreed,size:40});md_reader(c,1310,190,440,{title:"MetricFlow",logo:"dbt",h:100});
        [["investigate",T.inv],["adapt",T.adapt],["implement",T.impl],["iterate",T.iter]].forEach(([s,t0],i)=>md_tag(c,330+i*420,440,s,{align:"center",col:MD.flow,size:34,a:ag_in(tt,t0-0.1,0.4)}));
        md_T(c,"start from the official docs",960,590,{w:700,size:40,align:"center",a:ag_in(tt,T.docs-0.2,0.6)});c.restore();}
      setScreen(c,S);md_label(c,96,100,"Thursday 5 November 2026 · pay day",{col:MD.flow,a:ag_in(tt,T.today,0.6)*(1-ag_in(tt,T.kilo-0.7,0.5))});}}
  ],0.5);
  md_end(ctx,S,t,sc.cues.breath,"Defined in the open","Define each measure once, in a format others can read.","Film 2 of 3","From tables to decisions");
});

// chapters that open in the place the one before ends in glide on from its camera
ag_cutInto(["three","dbt","same"]);
