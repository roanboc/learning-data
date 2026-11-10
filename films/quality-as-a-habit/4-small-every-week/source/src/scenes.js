/* ===== Small, every week: the seven chapters =====
   Each chapter is a few shots (the agent films' ag_shots): a place painted once, a slow camera, and what's drawn live over it. Between
   places a shot dissolves in. At the bench the camera never jumps: the next chapter glides on from where the camera is (ag_cutInto),
   and a later moment there (later:true) lets what was there leave, through the bare wall, before what comes next comes in; inside a
   moment, a card leaves before the next comes in where it stood, so no words show twice. Times come from the cues (when each line
   starts) and the words of the lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on cards,
   chips and labels, at least 28 px as seen, and above the captions (y 890). */

const SW_TITLE="Small, every week",SW_LINE="Quality as a habit · Film 4 of 4";
// places on the map, from their longitude and latitude
const SW_YAQUI=SW_MAP_AT(-109.93,27.49),SW_TOLUCA=SW_MAP_AT(-99.66,19.29),SW_VERACRUZ=SW_MAP_AT(-96.13,19.17),SW_JUAREZ=SW_MAP_AT(-106.45,31.72),
  SW_LAREDO=SW_MAP_AT(-99.51,27.48),SW_MAZATLAN=SW_MAP_AT(-106.42,23.22);
// where the wheat grows by 1956, for the sprigs on the map: Sonora's valleys, Sinaloa, the Bajío, the highlands
const SW_FIELDS=[[650,334],[690,302],[742,392],[792,444],[902,560],[962,592],[1012,612],[1046,566]];
const SW_YEARS10=["1","2","3","4","5","6","7","8","9","10"],SW_WHEATS=["Kentana 48","Yaqui 48","Nazas 48","Chapingo 48"];
// the stems the team looked at, close up: [x, h, lean, rust, weak, shrivel]; two the rust left standing
const SW_ROW=[[300,740,-0.03,1,0.9,0.8],[640,790,0.01,0,0,0],[980,730,0.05,1,0.95,0.7],[1320,780,-0.01,0.04,0,0],[1660,720,0.06,1,0.85,0.8]];
// the field day, 1954: a row further back, then the front row, in the valley's wheat
const SW_DAYBACK=[["farmer4",600,540,0.5,false],["agr2",1330,546,0.5,true]],
  SW_DAYFRONT=[["farmer1",420,622,0.62,false],["farmer3",820,612,0.64,false],["farmer2",1170,620,0.62,true],["agr1",1560,616,0.62,true]];
// at the table, 1955
const SW_TABLEFOLK=[["farmer1",330,586,0.72,false],["farmer2",640,592,0.7,false],["agr1",990,588,0.72,true],["borlaug",1300,590,0.72,true],["farmer3",1610,584,0.72,true]];
// the four at the bench on Thursdays, cut at its back edge: [who, x, flip]
const SW_FOUR=[["malia",330,false],["mei",720,false],["jun",1160,true],["sam",1560,true]],SW_FOURY=560,SW_FOURS=0.8;
function sw_four(ctx,t,list,alpha,o){o=o||{};for(const m of list){const a=alpha(m[0]);if(a<=0.004)continue;ctx.save();ctx.globalAlpha*=a;
  dq_person(ctx,m[0],m[1],SW_FOURY,SW_FOURS,Object.assign({t,flip:m[2],cut:DQ_BENCH.back},o.each?o.each(m):null));ctx.restore();}}
// a seed envelope in a farmer's hand, in figure space
function sw_heldEnvelope(c,hands,a){if(a<=0.004||!hands||!hands.near)return;const h=hands.near;sw_envelope(c,h[0]+16,h[1]-176,124,null,{a});}

/* ---------------------------------------------------------------- 1. Two harvests a year */
scene("harvests",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    prog:wAt(sc,"place","programme"),team:c.team,agr:wAt(sc,"team","agronomists"),bor:wAt(sc,"team","Norman"),
    stems:c.rust-0.4,fungus:wAt(sc,"rust","fungus"),spots:wAt(sc,"rust","spots"),weaken:wAt(sc,"shrivels","weaken"),shriv:wAt(sc,"shrivels","shrivels"),
    whole:wAt(sc,"shrivels","whole")-0.3,lost:wAt(sc,"years","Farmers"),buy:wAt(sc,"years","Mexico had")-0.3,abroad:wAt(sc,"years","abroad"),
    sheet:c.slow-0.4,bred:wAt(sc,"slow","bred"),gens:c.gens,waiting:c.change,something:wAt(sc,"change","Something"),
    map2:c.two-0.4,twoGen:wAt(sc,"two","two generations"),yaqui:wAt(sc,"winter","Yah-kee"),high:wAt(sc,"summer","highlands"),away:wAt(sc,"summer","over a thousand"),
    other:wAt(sc,"carried","other field"),sowed:wAt(sc,"carried","sowed"),
    best0:c.best-0.4,looked:wAt(sc,"best","looked"),kept:wAt(sc,"best","kept"),
    sheet2:c.small-0.4,twice:wAt(sc,"small","twice"),halved:c.half,by48:wAt(sc,"half","By"),four:wAt(sc,"half","four"),
    day:c.farmers-0.4,n800:wAt(sc,"farmers","eight hundred"),
    map3:c.enough-0.4,needed:wAt(sc,"enough","needed"),
    uni:c.univ-0.4,n41:wAt(sc,"univ","forty-one"),
    hall:c.folder-0.4,
    bench:c.three-0.4,weekly:wAt(sc,"three","one small change"),measured:wAt(sc,"three","measured"),n3:wAt(sc,"three","three"),
    title:c.breath+0.2}));
  const imports=[[[SW_JUAREZ[0],-40],[SW_JUAREZ[0],SW_JUAREZ[1]+50],P.buy+0.4,1.7],[[SW_LAREDO[0],-40],[SW_LAREDO[0]+10,SW_LAREDO[1]+46],P.buy+0.7,1.9],
    [[1760,560],[SW_VERACRUZ[0]+44,SW_VERACRUZ[1]-6],P.buy+0.9,2.1],[[1800,650],[SW_VERACRUZ[0]+96,SW_VERACRUZ[1]+30],P.buy+1.3,2.1]];
  ag_shots(ctx,S,t,sc.dur,[
    // the highlands near Mexico City in summer; the programme; the team in the wheat
    {at:0,place:"swField",keys:[[0,960,540,1.0]],push:0.04,draw:(x,tt)=>{
      const p=sw_pop(tt,P.prog-0.3,P.team+0.4);dq_textCard(x,110,170,720,{title:"A programme to grow more food",sub:"Mexico's government, with the Rockefeller Foundation"},{k:p.k,a:p.a});
      sw_people(x,SW_TEAM,tt,ag_in(tt,P.team-0.1,1.2));sw_near(x,"healthy",700,tt,1);
      dq_chip(x,630,322,"young Mexican agronomists",{align:"center",a:ag_in(tt,P.agr-0.2,0.5)});
      dq_chip(x,1290,322,"Norman Borlaug · plant scientist, United States",{align:"center",a:ag_in(tt,P.bor-0.2,0.5)});}},
    // stem rust close up: its spots come out along the stems; one weakens and bends, and its grain shrivels
    {at:P.stems,dis:0.8,place:"swStems",keys:[[P.stems,960,540,1.0]],push:0.05,draw:(x,tt)=>{
      const r=ag_sine((tt-P.spots+0.8)/2.6),wk=ag_sine((tt-P.weaken+0.2)/1.8),sh=ag_sine((tt-P.shriv)/1.6);
      sw_stem(x,520,1110,780,{s:1.1,seed:3,lean:-0.02});sw_stem(x,960,1110,800,{s:1.1,seed:5,lean:0.02,rust:r*0.7});
      sw_stem(x,1400,1110,780,{s:1.1,seed:7,lean:0.04,rust:r,weak:wk*0.85,shrivel:sh});
      dq_chip(x,1010,430,"stem rust, a fungus",{a:ag_in(tt,P.fungus-0.3,0.5)});}},
    // the field lost: the near wheat bent and rust-red, the plain behind it browned; a farmer stands in it, head bowed
    {at:P.whole,dis:0.9,place:"swField",keys:[[P.whole,960,540,1.03]],push:0.03,draw:(x,tt)=>{
      const u=ag_in(tt,P.whole+0.3,2.2);x.save();x.globalCompositeOperation="multiply";x.fillStyle=rgba([196,150,110],u);x.fillRect(0,SW_HZ+30,W,H-SW_HZ-30);x.restore();
      sw_people(x,[["farmer4",1180,600,0.66,true]],tt,ag_in(tt,P.lost-0.4,1.0),{each:()=>({nod:0.1})});
      sw_near(x,"healthy",700,tt,u<1?1:0);sw_near(x,"rust",700,tt,u);}},
    // the map: wheat bought abroad, by rail across the northern border and by sea to Veracruz
    {at:P.buy,dis:0.8,place:"swMap",keys:[[P.buy,960,540,1.0]],push:0.03,draw:(x,tt)=>{
      sw_sacks(x,tt,imports,0.5,1);dq_chip(x,1340,470,"wheat bought abroad",{align:"center",a:ag_in(tt,P.abroad-0.3,0.5)});}},
    // the field book: one generation a year, slowly; under the years of waiting, the fields the rust ruined
    {at:P.sheet,dis:0.8,place:"swSheet",keys:[[P.sheet,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      const mark=ag_keys(tt,[[P.bred,0],[P.gens,1],[P.gens+0.55*8,9]],u=>u),gen=[[0,0,P.bred]].concat(SW_YEARS10.slice(1).map((_,i)=>[i+1,0,P.gens+0.55*i]));
      sw_calendar(x,tt,{head:"One generation a year",years:SW_YEARS10,mark,markA:ag_in(tt,P.bred-0.3,0.4)*(1-ag_in(tt,P.something,0.6)),
        rows:[{label:"new wheat",y:540,h:170,items:gen},{label:"the fields",y:800,h:110,items:SW_YEARS10.map((_,i)=>[i,0,P.waiting+0.3+i*0.28,{rust:1}])}]});}},
    // the map again: winter in the Yaqui Valley, summer in the highlands, over a thousand kilometres apart; the seed carried between them
    {at:P.map2,dis:0.8,place:"swMap",keys:[[P.map2,960,540,1.0],[P.map2+0.6,860,480,1.3]],d:2.2,push:0.02,draw:(x,tt)=>{
      const A=SW_YAQUI,B=SW_TOLUCA;dq_chip(x,1180,150,"two generations a year",{align:"center",a:ag_in(tt,P.twoGen-0.2,0.5)});
      sw_dot(x,A,ag_in(tt,P.yaqui-0.3,0.4));const w=sw_pop(tt,P.yaqui,null);sw_leader(x,A,[692,298],w.a);dq_textCard(x,690,130,300,{kick:"Winter",title:"Yaqui Valley",sub:"near the sea"},{k:w.k,a:w.a});
      sw_dot(x,B,ag_in(tt,P.high-0.3,0.4));const s=sw_pop(tt,P.high,null);sw_leader(x,B,[1092,600],s.a);dq_textCard(x,1090,520,380,{kick:"Summer",title:"near Mexico City",sub:"over 2,000 m up"},{k:s.k,a:s.a});
      sw_route(x,A,B,ag_sine((tt-P.away+0.2)/1.4),1);dq_chip(x,780,552,"over 1,000 km",{align:"center",a:ag_in(tt,P.away+0.6,0.5)});
      for(const [t0,f,g] of [[P.other-1.0,A,B],[P.sowed+0.2,B,A]]){const u=ag_sine((tt-t0)/1.8);if(u<=0||u>=1)continue;
        sw_envelope(x,lerp(f[0],g[0],u)-32,lerp(f[1],g[1],u)-96,64,null,{a:sstep(0,0.12,u)*(1-sstep(0.88,1,u))});}}},
    // the stems: most bent and rusted; the two the rust left standing get a paper tag each: kept
    {at:P.best0,dis:0.8,place:"swStems",keys:[[P.best0,860,560,1.12],[P.looked,1060,560,1.12]],d:3.6,push:0,draw:(x,tt)=>{
      SW_ROW.forEach((m,i)=>sw_stem(x,m[0],1110,m[1],{s:1.0,seed:11+i,lean:m[2],rust:m[3],weak:m[4],shrivel:m[5]}));
      for(const [i,dt] of [[1,0],[3,0.35]]){const m=SW_ROW[i];dq_tag(x,m[0]+50,470,[244,236,218],{text:"KEEP",icon:false,to:[m[0]+6,452],k:clamp(tt-(P.kept+dt),0,3),a:ag_in(tt,P.kept+dt-0.1,0.3)});}}},
    // the field book again: two generations a year, half the time; then 1948's four new wheats
    {at:P.sheet2,dis:0.8,place:"swSheet",keys:[[P.sheet2,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      const away=ag_in(tt,P.four-0.6,0.5);
      sw_calendar(x,tt,{head:"Two generations a year",years:SW_YEARS10,a:1-away,
        rows:[{label:"one a year",y:520,h:150,a:0.5,labelCol:DQ.soft,items:SW_YEARS10.map((_,i)=>[i,0,-9])},
              {label:"two a year",y:790,h:150,items:[0,1,2,3,4].flatMap(i=>[[i,-30,P.twice-0.2+i*0.6],[i,30,P.twice+0.1+i*0.6]])}],
        br:{s0:0,s1:4,y:812,text:"half the time",u:ag_sine((tt-P.halved-0.1)/1.0)}});
      dq_label(x,960,250,"1948 · four new wheats",{align:"center",a:ag_in(tt,P.four-0.1,0.5)});
      SW_WHEATS.forEach((n,i)=>{const p=sw_pop(tt,P.four+0.1+i*0.25,null);sw_envelope(x,275+i*380,320,230,n,{k:p.k,a:p.a});});}},
    // the field day, 1954: farmers in the valley's wheat; one holds the new seed
    {at:P.day,dis:0.9,place:"swValley2",keys:[[P.day,960,540,1.0]],push:0.04,draw:(x,tt)=>{
      sw_people(x,SW_DAYBACK,tt,1);sw_near(x,"healthy",640,tt,1);
      sw_people(x,SW_DAYFRONT,tt,1,{each:m=>m[0]==="farmer3"?{pose:"hold",hold:(cc,h)=>sw_heldEnvelope(cc,h,1)}:null});sw_near(x,"healthy",760,tt,1);
      dq_chip(x,960,140,"more than 800 farmers in one day",{align:"center",a:ag_in(tt,P.n800-0.2,0.5)});}},
    // the map: 1956, all the wheat Mexico needed: its land golden, wheat where the fields are
    {at:P.map3,dis:0.8,place:"swMap",keys:[[P.map3,960,540,1.0]],push:0.03,draw:(x,tt)=>{
      sw_wash(x,0.5*ag_in(tt,P.map3+0.4,1.6));SW_FIELDS.forEach((p,i)=>sw_sprig(x,p[0],p[1],56,{k:clamp(ag_spr(tt,P.map3+0.8+i*0.18,0.7),0,1.1),ripe:1}));
      const c1=sw_pop(tt,P.needed-0.6,null);dq_textCard(x,1160,140,560,{kick:"1956",title:"All the wheat it needed"},{k:c1.k,a:c1.a});}},
    // the university, December 2025: the list, and 41 certificates printed again, falling on the pile one by one
    {at:P.uni,dis:1.0,place:"benchTop",keys:[[P.uni,960,540,1.0]],push:0.03,draw:(x,tt)=>{
      sw_listCard(x,170,170,600,"Graduation list · December",["Tomas NOVAK","Brennan Liam","Andres Penaloza","Jose Nunez","Siobhan O'CONNELL","Moreau Claire"],{on:"granite"});
      const n=Math.round(clamp((tt-(P.n41-1.8))/1.9,0,1)*41),r=ag_rnd(61);
      for(let i=0;i<41;i++){const jx=(r()-0.5)*90,jy=(r()-0.5)*70,an=(r()-0.5)*0.22;if(i<n)sw_cert(x,1030+jx,330+jy,320,{on:"granite",angle:an});}
      dq_figure(x,1190,770,String(n),"certificates printed again",{size:96,align:"center",dark:true,a:ag_in(tt,P.n41-1.7,0.3)});}},
    // the Great Hall: a graduate crosses the stage holding an empty folder
    {at:P.hall,dis:0.9,place:"hall",keys:[[P.hall,960,540,1.0]],push:0.03,draw:(x,tt)=>{
      const u=ag_sine((tt-P.hall-0.2)/5.6);dq_person(x,SW_P.grad,lerp(600,1080,u),606,0.95,{t:tt,warm:1,pose:"hold",hold:(cc,h)=>sw_folder(cc,h)});}},
    // a year later, at the bench: a small card for each week, each with its measure; 41 became 3
    {at:P.bench,dis:0.9,place:"bench",keys:[[P.bench,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      // all of it leaves before the title comes in, so no word shows under the title's
      const go=1-ag_in(tt,P.title-0.4,0.8);if(go<=0.004)return;x.save();x.globalAlpha*=go;
      sw_strip(x,tt,{t0:P.weekly-0.4,d:2.2,dot:P.measured-0.3,y:180});
      const fa=ag_in(tt,P.n3-1.6,0.5);dq_figure(x,640,560,"41","December 2025",{size:150,align:"center",col:DQ.soft,a:fa});
      x.save();x.globalAlpha*=fa;x.strokeStyle=rgba(DQ.dim,1);x.lineWidth=4;x.lineCap="round";x.beginPath();x.moveTo(860,512);x.lineTo(1060,512);x.moveTo(1040,496);x.lineTo(1060,512);x.lineTo(1040,528);x.stroke();x.restore();
      dq_figure(x,1280,560,"3","December 2026",{size:150,align:"center",a:ag_in(tt,P.n3-0.2,0.5)});
      dq_chip(x,960,712,"certificates printed again",{align:"center",a:fa});x.restore();}},
  ],0.5);
  sw_tags(ctx,S,t,[[0.4,"Mexico · 1945",1.2],[P.day,"Mexico · 1954",0.9],[P.map3,"Mexico · 1956",0.8],[P.uni,"The university · December 2025",1.0],
    [P.hall,"Great Hall · December 2025",0.9],[P.bench,"The university · December 2026",0.9],[P.title-0.4,null,0.8]]);
  dq_title(ctx,S,t,P.title,SW_TITLE,null,SW_LINE);});

/* ---------------------------------------------------------------- 2. Fifteen minutes, every Thursday */
scene("thursdays",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    idea:wAt(sc,"idea","big project"),next:wAt(sc,"once","next list"),cleanup:wAt(sc,"once","clean-up"),
    smaller:c.smaller,mei:wAt(sc,"smaller","Mei"),asked:wAt(sc,"smaller","something smaller"),every:c.every,ten:wAt(sc,"every","ten"),
    malia:wAt(sc,"who","Malia"),jun:wAt(sc,"makers","Jun"),sam:wAt(sc,"makers","Sam"),
    q1:c.q1,q1w:wAt(sc,"q1","What"),q2:c.q2,q3:c.q3,results:c.results,people:wAt(sc,"count","people count")}));
  const four=m=>m==="mei"?ag_in(t,P.mei-0.3,0.6):m==="malia"?ag_in(t,P.malia-0.3,0.6):m==="jun"?ag_in(t,P.jun-0.3,0.6):ag_in(t,P.sam-0.3,0.6);
  const roles={malia:"Runs the ceremonies",mei:"Answers for the list",jun:"Builds the list",sam:"Runs it every night"};
  ag_shots(ctx,S,t,sc.dur,[
    // January's first idea, a big clean-up; the cleaned list, and the next list with the same errors back
    {at:0,place:"bench",keys:[[0,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      const p=sw_pop(tt,P.idea-0.5,null);dq_textCard(x,190,140,820,{kick:"January 2026 · the first idea",title:"Clean every name on the list, once, before March"},{k:p.k,a:p.a});
      const l1=sw_pop(tt,P.cleanup-0.2,null),l2=sw_pop(tt,P.next-0.1,null);
      sw_listCard(x,190,380,620,"Cleaned, once",["Tomas Novak","Liam Brennan","Claire Moreau"],{k:l1.k,a:l1.a});
      sw_listCard(x,1110,380,620,"The next list",["Ines MARQUES","Haddad Ali","Siobhan O'CONNELL"],{k:l2.k,a:l2.a});
      x.save();x.globalAlpha*=l2.a;x.strokeStyle=rgba(DQ.dim,1);x.lineWidth=4;x.lineCap="round";x.beginPath();x.moveTo(850,514);x.lineTo(1070,514);x.moveTo(1050,498);x.lineTo(1070,514);x.lineTo(1050,530);x.stroke();x.restore();}},
    // Mei asks for something smaller: every Thursday at ten, fifteen minutes, standing; the four come to the bench
    {at:P.smaller-0.4,later:true,place:"bench",keys:[[P.smaller-0.4,960,540,1.0]],push:0.0,draw:(x,tt)=>{
      sw_four(x,tt,SW_FOUR,four);const tagA=1-ag_in(tt,P.q1-1.0,0.4);
      for(const m of SW_FOUR)dq_nameTag(x,m[1],262,m[0],{role:roles[m[0]],align:"center",a:four(m[0])*tagA});
      const s=sw_pop(tt,P.asked-0.3,P.every-0.4);dq_textCard(x,1040,70,600,{kick:"Mei asks for",title:"Something smaller"},{k:s.k,a:s.a});
      const th=sw_pop(tt,P.every+0.1,P.q1-1.0);dq_textCard(x,1040,70,720,{kick:"Every Thursday",title:"10:00 · fifteen minutes, standing"},{k:th.k,a:th.a});
      dq_clock(x,240,142,64,10,0,{a:ag_in(tt,P.ten-0.4,0.5)*tagA});}},
    // three questions; then where the results come from
    {at:P.q1-0.4,place:"bench",keys:[[P.q1-0.4,960,540,1.0]],push:0.0,draw:(x,tt)=>{
      sw_four(x,tt,SW_FOUR,()=>1);
      const qs=[[P.q1w,"What did this week's results say?"],[P.q2,"What one small change will we make?"],[P.q3,"How will we know it worked?"]];
      qs.forEach((q,i)=>{const p=sw_pop(tt,q[0]-0.2,P.results-0.1);dq_textCard(x,120+i*580,64,520,{kick:String(i+1),title:q[1]},{k:p.k,a:p.a});});
      const r1=sw_pop(tt,P.results+0.4,null),r2=sw_pop(tt,P.people-0.2,null);
      dq_textCard(x,200,64,700,{kick:"Every night",title:"The checks' results"},{k:r1.k,a:r1.a,icon:"tag"});
      dq_textCard(x,1000,64,720,{kick:"What people count",title:"Reports, hours of hand work, the hundred records"},{k:r2.k,a:r2.a,edge:"steel"});}},
  ],0.5);});

/* ---------------------------------------------------------------- 3. Plan, do, check, act */
scene("cycle",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    shewhart:wAt(sc,"loop","Walter"),sow:wAt(sc,"wheat","sow"),oct:c.oct,last:c.last,hours:wAt(sc,"last","two hundred"),since:c.since,hold:wAt(sc,"since","hold"),
    ask:c.ask,plan:c.plan,rest:wAt(sc,"plan","hundred records"),know:c.know,roundH:wAt(sc,"know","round's hours"),perfect:wAt(sc,"know","perfect"),
    do:c.do,n78:wAt(sc,"do","seventy-eight"),check:c.check,h26:wAt(sc,"check","twenty-six"),r97:wAt(sc,"check","ninety-seven"),act:c.act,steps:wAt(sc,"act","steps")}));
  const lits=[ag_io(t,P.plan-0.2,P.do-0.2,0.4),ag_io(t,P.do-0.2,P.check-0.2,0.4),ag_io(t,P.check-0.2,P.act-0.2,0.4),ag_in(t,P.act-0.2,0.4)];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,later:true,place:"bench",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      sw_cycle(x,tt,{u:(tt-P.oct+0.2)/1.6,lits,wheat:ag_in(tt,P.sow-0.3,0.6)});
      dq_chip(x,1500,187,"Walter Shewhart · W. Edwards Deming",{align:"center",a:ag_io(tt,P.shewhart-0.3,P.oct-0.4,0.5)});
      // one turn, from Thursday 1 October; last December's round; what changed since September
      let p=sw_pop(tt,P.oct+1.5,P.since-0.2);dq_textCard(x,160,190,900,{kick:"Thursday 1 October 2026",title:"One turn, before December's round of hand checks"},{k:p.k,a:p.a});
      p=sw_pop(tt,P.last+0.1,P.since-0.2);dq_textCard(x,160,420,900,{kick:"December 2025",title:"Every name checked by hand, by two people"},{k:p.k,a:p.a});
      dq_figure(x,1150,520,"240 hours","last December's round",{col:"steel",size:120,a:ag_io(tt,P.hours-0.3,P.since-0.2,0.4)});
      p=sw_pop(tt,P.since+0.2,P.ask-0.2);dq_textCard(x,160,190,800,{kick:"Since September",title:"Names fixed where they're born"},{k:p.k,a:p.a});
      const q=sw_pop(tt,P.hold-0.6,P.ask-0.2);const qb=dq_textCard(x,160,420,800,{kick:"Each night",title:"The checks hold the doubtful ones"},{k:q.k,a:q.a});
      dq_tag(x,1010,qb.y+30,"hold",{to:[962,qb.y+40],k:clamp(tt-P.hold,0,3),a:ag_io(tt,P.hold-0.1,P.ask-0.2,0.35)});
      // Malia's question, and the plan that answers it
      sw_four(x,tt,[["malia",1560,true]],()=>ag_io(tt,P.ask-0.5,P.do-0.4,0.6));
      p=sw_pop(tt,P.ask+0.1,P.plan-0.2);dq_textCard(x,160,300,1100,{kick:"Malia asks",title:"Do we still need to check every name by hand?"},{k:p.k,a:p.a});
      p=sw_pop(tt,P.plan+0.2,P.do-0.3);dq_textCard(x,160,190,1100,{kick:"Plan",title:"Check by hand only the names a check holds or a graduate reports"},{k:p.k,a:p.a});
      p=sw_pop(tt,P.rest-0.3,P.do-0.3);dq_textCard(x,160,410,1100,{title:"The hundred records look at the rest"},{k:p.k,a:p.a});
      p=sw_pop(tt,P.roundH-0.3,P.do-0.3);dq_textCard(x,160,560,520,{kick:"Measure",title:"The round's hours"},{k:p.k,a:p.a,edge:"steel"});
      p=sw_pop(tt,P.perfect-0.3,P.do-0.3);dq_textCard(x,720,560,540,{kick:"Measure",title:"Perfect records in the hundred"},{k:p.k,a:p.a,edge:"steel"});
      // do: 78 names, not 2,140; check: 26 hours, not 240, and 97 of 100; act: written into the round's steps
      p=sw_pop(tt,P.do+0.2,P.check-0.2);dq_textCard(x,160,200,760,{kick:"From Monday 19 October",title:"Checked by hand"},{k:p.k,a:p.a});
      dq_figure(x,160,520,"78 names","not 2,140",{size:140,a:ag_io(tt,P.n78-0.3,P.check-0.2,0.4)});
      dq_figure(x,160,420,"26 hours","not 240",{size:140,col:"steel",a:ag_io(tt,P.h26-0.3,P.act-0.2,0.4)});
      dq_figure(x,1000,420,"97 of 100","perfect, Friday 6 November",{size:140,col:"steel",a:ag_io(tt,P.r97-0.3,P.act-0.2,0.4)});
      const pa=sw_pop(tt,P.act+0.2,null);x.save();x.globalAlpha*=pa.a;dq_card(x,280,220,1360,330,{ruled:64,ruleTop:96});dq_label(x,308,276,"The round's steps",{});
      dq_T(x,"1  Download the list from the platform",308,354,{w:500,size:28,f:"mono"});dq_T(x,"2  Send each correction to the registrar's office",308,418,{w:500,size:28,f:"mono"});
      const line3="3  Check by hand only the names a check holds or a graduate reports",nC=Math.round(clamp((tt-P.steps+0.6)/1.8,0,1)*line3.length);
      if(nC>0)dq_T(x,line3.slice(0,nC),308,482,{w:500,size:28,f:"mono"});x.restore();}},
  ],0.5);});

/* ---------------------------------------------------------------- 4. Measure, simplify, standardise, automate */
scene("order",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    w:["measure","simplify","standardise","automate"].map(k=>wAt(sc,"order",k)),measured:c.measured,simple:c.simple,standard:c.standard,auto:c.auto,
    first:wAt(sc,"mess","Automate first"),back:c.mess+3.6}));
  const lit=P.w.map(v=>ag_in(t,v-0.2,0.4)),moved=t<P.back?{from:[0,1,2,3],order:[3,0,1,2],mix:(t-P.first+0.2)/1.2}:{from:[3,0,1,2],order:[0,1,2,3],mix:(t-P.back)/1.2},
    dim=ag_io(t,P.first-0.2,P.back+0.4,0.5);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,later:true,place:"bench",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      sw_order(x,tt,Object.assign({lit,dim},moved));
      const d=[[P.measured+0.3,{kick:"August",title:"About 320 hours a year"},"steel"],[P.simple+0.3,{title:"Only the names a check holds"}],
        [P.standard+0.3,{title:"One way to settle a held name",sub:"in the student system, against the document seen at enrolment"}],
        [P.auto+0.3,{title:"Held names, each night",sub:"in a list the registrar's office reads each morning"}]];
      d.forEach((q,i)=>{const p=sw_pop(tt,q[0],null);dq_textCard(x,120+i*440,350,380,q[1],{k:p.k,a:p.a*(1-0.85*dim),edge:q[2]});});
      const m=sw_pop(tt,P.first+0.6,P.back+0.2);dq_textCard(x,560,640,800,{kick:"Automate first",title:"The wrong work, faster"},{k:m.k,a:m.a});}},
  ],0.5);});

/* ---------------------------------------------------------------- 5. Kept with a check */
scene("kept",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    last:c.last,forget:c.forget,forgets:wAt(sc,"forget","forgets"),level:c.level,hundred:wAt(sc,"level","hundred records"),agreed:wAt(sc,"level","agreed"),
    below:c.below,year:c.year,keeper:wAt(sc,"year","keeper"),card:c.card,night:c.night,keeps:wAt(sc,"night","keeps"),table:wAt(sc,"night","table"),
    dash:c.dash,dashW:wAt(sc,"dash","dashboard"),holds:wAt(sc,"week","holds more"),n41:wAt(sc,"so","forty-one"),n79:wAt(sc,"so","seventy-nine"),h320:wAt(sc,"so","three hundred")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,later:true,place:"bench",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      // a change with its check, and one without, which fades
      let p=sw_pop(tt,0.6,P.level-0.3);dq_textCard(x,300,220,600,{kick:"A change",title:"With a check that keeps it"},{k:p.k,a:p.a,icon:"gauge"});
      p=sw_pop(tt,P.forget-0.2,P.level-0.3);const fade=ag_in(tt,P.forgets-0.2,1.2);dq_textCard(x,1020,220,600,{kick:"A change",title:"Without one"},{k:p.k,a:p.a*lerp(1,0.3,fade)});
      // the hand checks' keeper: the hundred records every month, at 95, agreed with Malia
      const bA=ag_io(tt,P.level-0.1,P.year-0.3,0.4);
      if(bA>0)dq_band(x,360,150,1200,{min:80,max:100,lo:95,hi:100,v:97,u:ag_sine((tt-P.agreed+0.2)/1.0),vu:ag_sine((tt-P.hundred+0.2)/1.4),ticks:20,numEvery:5,
        label:"Perfect records in the hundred · every month",vText:"97 on 6 November",a:bA});
      dq_chip(x,960,500,"95: agreed with Malia",{align:"center",col:"brass",a:ag_io(tt,P.agreed+0.5,P.year-0.3,0.4)});
      p=sw_pop(tt,P.below-0.1,P.year-0.3);dq_textCard(x,460,560,1000,{kick:"Below 95",title:"The next round checks more by hand"},{k:p.k,a:p.a});
      // the year's ledger: each change, and what keeps it
      sw_ledger(x,200,90,1520,{a:ag_io(tt,P.year-0.1,P.card-0.4,0.4),rowA:i=>ag_in(tt,P.year+0.3+i*0.22,0.3),lit:tt>P.keeper-0.2?7:null});
      // the scorecard: only last night's checks; a last step of the night's run keeps every result
      const sA=ag_io(tt,P.card-0.1,P.dash-0.4,0.4);if(sA>0){x.save();x.globalAlpha*=sA;dq_card(x,160,170,620,330,{});dq_label(x,188,226,"Scorecard · last night",{});
        dq_rows(x,188,256,[{h:"CHECK",w:400},{h:"NAMES",w:160}],[["The old form's names",{s:"7",mark:"hold"}],["Names in capitals",{s:"0",mark:"pass"}],["Awards on the boards' lists",{s:"0",mark:"pass"}]],{});x.restore();}
      const dA=ag_io(tt,P.night+0.2,P.dash-0.4,0.4);
      if(dA>0)dq_window(x,840,120,920,640,{logo:"dbt",product:"dbt",title:"dbt_project.yml",a:dA,draw:(cc,b)=>{
        dq_code(cc,b.x+8,b.y+40,["on-run-end:",[["  - ",DQ.soft],["\"{{ keep_check_results(results) }}\"",DQ.ink]]],{lit:ag_in(tt,P.keeps-0.3,0.3)>0.5?1:null});
        const rows=[["4 Nov","The old form's names","7"],["5 Nov","The old form's names","5"],["5 Nov","Names in capitals","2"],["6 Nov","The old form's names","4"]];
        dq_rows(cc,b.x+8,b.y+170,[{h:"NIGHT",w:170,f:"mono"},{h:"CHECK",w:470},{h:"HELD",w:150,f:"mono"}],rows,{rowA:(r,i)=>ag_in(tt,P.table-0.2+i*0.3,0.3)});}});
      // the week, on the dashboard, beside what people count
      const wA=ag_in(tt,P.dash-0.1,0.5);
      if(wA>0)dq_window(x,160,90,1600,690,{logo:"databricks",product:"Databricks",title:"Dashboard · the graduation list",a:wA,draw:(cc,b)=>sw_week(cc,b,tt,{
        base:ag_sine((tt-P.dashW)/1.2),u:ag_sine((tt-P.holds+0.6)/1.6),wa:ag_in(tt,P.holds+0.8,0.5),
        tiles:[{label:"Certificates printed again",value:"41 · 14 · 6",a:ag_in(tt,P.n41-0.3,0.4)},{label:"Perfect records in the hundred",value:"79 · 88 · 97",a:ag_in(tt,P.n79-0.3,0.4)},
          {label:"Hours by hand, a year",value:"320, now 40",a:ag_in(tt,P.h320-0.3,0.4)}]})});}},
  ],0.5);});

/* ---------------------------------------------------------------- 6. At the same table */
scene("table",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    use:wAt(sc,"enough","use the list"),make:wAt(sc,"enough","make it"),malia:wAt(sc,"bring","Malia"),mei:wAt(sc,"bring","Mei's"),jun:c.checks,
    adm:wAt(sc,"asked","admissions"),farmers:c.farmers,station:wAt(sc,"land","research station"),taxed:wAt(sc,"land","taxed")}));
  const at=[["malia",280,false],["mei",620,false],["jun",960,true],["sam",1300,true]];
  ag_shots(ctx,S,t,sc.dur,[
    // the four at the bench: who use the list, who make it, and what each brings; admissions, asked to a Thursday
    {at:0,later:true,place:"bench",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      sw_four(x,tt,at,()=>1);sw_four(x,tt,[[SW_P.adm,1660,true]],()=>ag_in(tt,P.adm-0.4,0.6));
      dq_chip(x,280,150,"who use the list",{align:"center",a:ag_in(tt,P.use-0.2,0.5)});
      const mk=ag_in(tt,P.make-0.2,0.5);dq_chip(x,960,150,"who make it",{align:"center",a:mk});
      x.save();x.globalAlpha*=mk;x.strokeStyle=rgba(DQ.dim,1);x.lineWidth=3;x.beginPath();x.moveTo(520,206);x.lineTo(520,192);x.lineTo(1400,192);x.lineTo(1400,206);x.stroke();x.restore();
      const tags=[["malia",280,"The ceremonies",P.malia],["mei",620,"Names at the source",P.mei],["jun",960,"The checks",P.jun],["sam",1300,"The night's run",P.jun+0.4]];
      for(const g of tags)dq_nameTag(x,g[1],250,g[0],{role:g[2],align:"center",a:ag_in(tt,g[3]-0.2,0.5)});
      dq_nameTag(x,1660,250,SW_P.adm,{name:"Admissions",role:"Each student's first record",align:"center",a:ag_in(tt,P.adm,0.5)});}},
    // Mexico, 1955: the farmers and the team at one table; the land for a research station, and more from a tax on their own wheat
    {at:P.farmers-0.4,dis:0.9,place:"swValley",keys:[[P.farmers-0.4,960,540,1.0]],push:0.03,draw:(x,tt)=>{
      sw_people(x,SW_TABLEFOLK,tt,1,{each:()=>({cut:SW_TABLE.back,covered:false})});
      const p=sw_pop(tt,P.station-0.5,null);if(p.a>0){x.save();x.globalAlpha*=p.a;ag_about(x,960,190,lerp(0.7,1,ag_spr(p.k,0,0.5)));dq_card(x,500,60,920,270,{});
        dq_label(x,528,112,"1955",{});x.strokeStyle=rgba(DQ.ink,0.9);x.lineWidth=3;x.strokeRect(530,140,300,150);x.fillStyle="rgba(206,190,130,0.35)";x.fillRect(530,140,300,150);
        dq_T(x,"land for a new",680,206,{w:700,size:28,align:"center"});dq_T(x,"research station",680,244,{w:700,size:28,align:"center"});
        const u=ag_in(tt,P.taxed-0.2,0.6);x.globalAlpha*=u;x.setLineDash([12,9]);x.strokeRect(846,140,544,150);x.setLineDash([]);
        dq_T(x,"more, from a tax",1118,206,{w:700,size:28,align:"center"});dq_T(x,"on their own wheat",1118,244,{w:700,size:28,align:"center"});x.restore();}}},
  ],0.5);
  sw_tags(ctx,S,t,[[P.farmers-0.4,"Mexico · 1955",0.9]]);});

/* ---------------------------------------------------------------- 7. His name, as he says it */
scene("stage",(ctx,S,t,sc)=>{const c=sc.cues,P=sw_once(sc,"P",()=>({
    crosses:c.crosses,reads:c.reads,name:wAt(sc,"reads","Andrés"),says:wAt(sc,"reads","as he says it"),cert:c.cert,every:wAt(sc,"cert","every letter"),
    three:c.three,why:c.why,changed:wAt(sc,"why","changed"),confirmed:wAt(sc,"why","confirmed"),next:c.next,pick:wAt(sc,"next","pick"),
    mexico:c.mexico,y63:wAt(sc,"round","nineteen sixty-three"),selling:wAt(sc,"round","selling"),promise:c.promise,
    films:[wAt(sc,"recap","Say"),wAt(sc,"recap","Measure"),wAt(sc,"recap","truth"),wAt(sc,"recap","clock"),wAt(sc,"recap2","Fix"),wAt(sc,"recap2","Answer"),wAt(sc,"recap2","Write"),wAt(sc,"better","better")],
    end:c.breath+0.2}));
  const exports_=[[SW_VERACRUZ,[1720,560],P.selling-0.2,2.2,true],[[SW_VERACRUZ[0]+20,SW_VERACRUZ[1]+20],[1760,660],P.selling+0.3,2.2,true],[SW_MAZATLAN,[380,640],P.selling,2.4,true]];
  ag_shots(ctx,S,t,sc.dur,[
    // the Great Hall: Mei at the lectern; Andrés crosses the stage; she reads his name from the list, as he says it
    {at:0,place:"hall",keys:[[0,960,540,1.0]],push:0.03,draw:(x,tt)=>{
      dq_lectern(x,560,690,0.92,{});const tk=tt>P.name-0.1&&tt<P.says-0.1?0.35+0.35*Math.sin(tt*17.1)+0.3*Math.sin(tt*9.7+1):0;
      dq_person(x,"mei",560,600,0.86,{t:tt,warm:1,cut:690-28*0.92,talk:tk});
      const u=ag_sine((tt-P.crosses+0.2)/2.8);dq_person(x,"andresGown",lerp(2160,1300,u),606,0.95,{t:tt,warm:1,flip:true});
      // the list's card leaves before the certificate comes in, so his name is never shown twice in the dissolve
      const p=sw_pop(tt,P.name-0.2,P.cert-1.0);dq_textCard(x,130,110,460,{kick:"From the list",title:"Andrés Peñaloza"},{k:p.k,a:p.a});}},
    // his certificate, every letter; this December's 3, not 41, and why
    {at:P.cert-0.4,dis:1.0,place:"benchTop",keys:[[P.cert-0.4,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      sw_cert(x,510,90,900,{name:"Andrés Peñaloza",award:"Master of Data Analytics",marks:[4,9],mu:ag_sine((tt-P.every+0.2)/0.8),on:"granite",a:1-ag_in(tt,P.three-0.4,0.4)});
      const fa=ag_in(tt,P.three+0.1,0.5);dq_figure(x,700,420,"3","printed again, December 2026",{size:180,align:"center",dark:true,a:fa});
      dq_figure(x,1260,420,"41","printed again, December 2025",{size:180,align:"center",dark:true,col:DQ.chalkSoft,a:fa});
      const rs=[[P.changed-0.4,"Name changed after the list was sent"],[P.changed,"Name changed after the list was sent"],[P.confirmed-0.3,"Name not confirmed"]];
      rs.forEach((r,i)=>{const p=sw_pop(tt,r[0],null);dq_textCard(x,120+i*580,600,520,{title:r[1]},{k:p.k,a:p.a,on:"granite"});});}},
    // Thursday 17 December: the four look at the three, and pick the next small change
    {at:P.next-0.4,dis:0.9,place:"bench",keys:[[P.next-0.4,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      sw_four(x,tt,SW_FOUR,()=>1);const p=sw_pop(tt,P.next+0.4,null);dq_textCard(x,860,96,760,{kick:"Three to look at",title:"The next small change"},{k:p.k,a:p.a});}},
    // Mexico: round after round, the wheats got better
    {at:P.mexico-0.4,dis:0.9,place:"swSheet",keys:[[P.mexico-0.4,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      const ys=["1956","1957","1958","1959","1960","1961","1962","1963"];
      sw_calendar(x,tt,{head:"Round after round",years:ys,rows:[{label:"two a year",y:700,h:200,
        items:ys.flatMap((_,i)=>[[i,-30,P.mexico+0.4+i*0.55,{ripe:i/7}],[i,30,P.mexico+0.65+i*0.55,{ripe:i/7}]])}]});}},
    // 1963: wheat leaving Mexico, sold abroad
    {at:P.y63-0.3,dis:0.8,place:"swMap",keys:[[P.y63-0.3,960,540,1.0]],push:0.03,draw:(x,tt)=>{
      sw_wash(x,0.5);SW_FIELDS.forEach(p=>sw_sprig(x,p[0],p[1],56,{ripe:1}));sw_sacks(x,tt,exports_,0.5,1);
      const p=sw_pop(tt,P.selling-0.4,null);dq_textCard(x,1160,140,560,{kick:"No longer buying",title:"Selling wheat abroad"},{k:p.k,a:p.a});}},
    // the promise, and the eight films that keep it
    {at:P.promise-0.5,dis:0.9,place:"bench",keys:[[P.promise-0.5,960,540,1.0]],push:0.02,draw:(x,tt)=>{
      // all of it leaves before the end card comes in, so no word shows under the end card's
      const go=1-ag_in(tt,P.end-0.4,0.8);if(go<=0.004)return;x.save();x.globalAlpha*=go;
      const p=sw_pop(tt,P.promise-0.2,null);if(p.a>0){x.save();x.globalAlpha*=p.a;dq_card(x,300,56,1320,196,{});
        dq_T(x,"Quality isn't a property of data.",360,138,{w:800,size:44});dq_T(x,"It's whether data is fit for a use.",360,200,{w:700,size:44,col:DQ.soft});x.restore();
        dq_mark(x,1520,154,58,(tt-P.promise-0.4)/1.8,p.a);}
      P.films.forEach((ft,i)=>{const q=sw_pop(tt,ft-0.15,null);sw_filmCard(x,i,120+(i%4)*430,i<4?300:510,{k:q.k,a:q.a});});x.restore();}},
  ],0.5);
  sw_tags(ctx,S,t,[[0.4,"Great Hall · 9 December 2026 · 10:00",1.0],[P.cert-0.4,null,1.0],[P.next-0.4,"The university · 17 December 2026",0.9],
    [P.mexico-0.4,"Mexico · 1956 to 1963",0.9],[P.y63-0.3,"Mexico · 1963",0.8],[P.promise-0.5,null,0.9]]);
  dq_end(ctx,S,t,P.end,SW_TITLE,"One small change a week, measured, then kept.","Film 4 of 4","Quality as a habit");});

ag_cutInto(["thursdays","cycle","order","kept","table"]);
