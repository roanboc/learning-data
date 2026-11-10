/* ===== Late is wrong too: the seven chapters =====
   Each chapter is a few shots (the agent films' ag_shots): a place painted once, a slow camera, and what's drawn live over it. The
   opening is one coast at four moments, one room (lw_coast.js): November 1970 at dusk, that night under the surge (later:true: the
   evening's people and cards leave before the night comes in), the same coast by day from 1972, with the volunteer and the flags, and
   November 2007 at dusk. Then the bench at night, where the night's file doesn't come, and the same bench by day, when it does. The
   bench chapters open where the one before ends (ag_cutInto), so the camera glides on and only what changes fades: the night's bench
   turns to Thursday morning, Thursday to Monday's meeting, and the meeting to the bench seen from above. A person who stays is drawn in
   the same place, on the film's own clock. Times inside a chapter come from its cues and the words of its lines (wAt), so the pictures
   stay with the voice. Words on screen are at least 28 px as seen, and above the captions (y 890). Every top-level name starts with
   lw_ or LW_. */

// the coast's people, in plain, muted cottons, none in the module's six colours
const LW_TOP=[[222,214,194],[176,166,142],[134,140,146],[206,198,180]];
const LW_SARI=[[140,92,88],[96,108,92],[120,104,124],[150,128,100]];
const LW_LUNGI=[[96,98,92],[88,84,100],[104,92,80]];
// the way from the homestead's door to the shelter: along the raised earth, down to the path, and along it to the shelter's stair
const LW_WAY=[[1012,682],[1236,668],[1332,692],[1300,644]];
function lw_along(pts,u){const L=[];let tot=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(d);tot+=d;}
  let s=clamp(u,0,1)*tot;for(let i=0;i<L.length;i++){if(s<=L[i]||i===L.length-1){const v=L[i]?clamp(s/L[i],0,1):0;return{x:lerp(pts[i][0],pts[i+1][0],v),y:lerp(pts[i][1],pts[i+1][1],v),
    left:pts[i+1][0]<pts[i][0],dist:clamp(u,0,1)*tot};}s-=L[i];}return{x:pts[0][0],y:pts[0][1],left:false,dist:0};}
// someone walking along pts between t0 and t1: in over the first 0.5 s, out over the last (drawn whole, then faded), unless o.stay;
// o as lw_walker takes it (o.vol: a volunteer, with the megaphone)
function lw_go(x,tt,pts,t0,t1,o){if(tt<t0-0.01)return;const u=(tt-t0)/(t1-t0),p=lw_along(pts,u),h=o.h||62,
    a=(o.fadeIn===false?1:ag_in(tt,t0,0.5))*(o.stay?1:1-ag_in(tt,t1-0.5,0.5)),q=Object.assign({walk:u>0&&u<1,step:p.dist/(h*0.8),flip:o.flip!=null?o.flip:p.left},o);
  lw_whole(x,a,cx=>o.vol?lw_volunteer(cx,p.x,p.y,h,q):lw_walker(cx,p.x,p.y,h,q));}
// the volunteer's call through the megaphone, in pulses while the line is said
const lw_call=(tt,t0,t1)=>ag_io(tt,t0,t1,0.3)*(0.55+0.45*Math.sin(tt*5.2));

/* ---------------------------------------------------------------- 1 · The last mile
   The coast of East Pakistan at dusk, 12 November 1970: families on the low islands; the radio's great danger signal, and what it
   meant there; most knew a storm was coming, almost nobody took shelter. That night, the surge over the islands; at least 300,000 died.
   A warning people can't read is no warning. By day, from 1972: the programme, a volunteer from the village walking the last mile and
   calling house to house, people walking to the shelter, the flags rising one, two, three. November 2007 at dusk: Sidr, the three flags
   flying, people streaming to the lit shelter; the numbers then and now. The bench at night: the student system, the night's file and
   the graduation list, the last mile between them; the file doesn't come, every check passes, 23 missing; by day, the file comes and all
   23 are on the list. */
function lw_dusk(x,tt,c,P){
  // families at dusk: a fisherman by the boat, a woman carrying a bundle home, a child by the haystack
  lw_go(x,tt,[[300,664],[372,664]],0,c.surge,{h:64,top:LW_TOP[1],cloth:LW_LUNGI[0],fadeIn:false,stay:true});
  lw_go(x,tt,[[792,690],[930,676]],2,c.ashore,{kind:"woman",h:60,cloth:LW_SARI[0],load:[150,130,100],fadeIn:false,stay:true});
  lw_walker(x,1250,680,42,{kind:"child",top:LW_TOP[0],cloth:LW_LUNGI[1]});
  let q=lw_pop(tt,P.radio,null);dq_textCard(x,1180,150,620,{kick:"On the radio",title:"Great danger signal"},{k:q.k,a:q.a});
  q=lw_pop(tt,c.little+0.2,null);dq_textCard(x,1180,316,620,{kick:"Survivors said later",title:"they took signal number one to be the worst"},{k:q.k,a:q.a});
  q=lw_pop(tt,P.knew-0.2,null);if(q.a>0.004){x.save();x.globalAlpha*=q.a;dq_card(x,120,150,660,340,{});x.restore();}
  dq_figure(x,164,262,"Over 90%","knew a storm was coming",{size:96,a:q.a});dq_figure(x,164,420,"Under 1%","took shelter",{size:96,col:"stop",a:ag_in(tt,P.nobody,0.5)});}
function lw_surge(x,tt,c,P){lw_water(x,tt,ag_in(tt,c.surge-0.2,2.0));lw_rain(x,tt,0.32*ag_in(tt,c.surge-0.4,1.6));
  let q=lw_pop(tt,c.toll,c.after-0.3);dq_textCard(x,120,150,720,{kick:"That night",title:"At least 300,000 people died",sub:"perhaps half a million"},{k:q.k,a:q.a});
  q=lw_pop(tt,c.after,null);dq_textCard(x,120,150,760,{title:"A warning people can't read, or don't act on, is no warning"},{edge:"brass",k:q.k,a:q.a});
  dq_chip(x,120,370,"Something has to change",{a:ag_in(tt,P.change,0.5)});}
function lw_dayCpp(x,tt,c,P){const W0=c.mile-0.2,W1=c.house+0.2;
  lw_flags(x,ag_in(tt,P.one,0.9)+ag_in(tt,P.two,0.9)+ag_in(tt,P.three,0.9),tt,{wind:0.8});
  // the last mile: the volunteer's way in, a brass line behind him
  const vu=clamp((tt-W0)/(W1-W0),0,1),vx=lerp(330,930,vu),la=ag_io(tt,P.lastMile-0.2,c.flags-0.3,0.5);
  if(la>0.004&&vu>0){x.save();x.globalAlpha*=la;x.strokeStyle=rgba(DQ.brass,0.9);x.lineWidth=4;x.setLineDash([12,10]);x.beginPath();x.moveTo(260,728);x.lineTo(Math.max(262,vx-30),lerp(728,702,vu));x.stroke();x.restore();}
  dq_chip(x,250,782,"the last mile",{col:"brass",a:la});
  lw_go(x,tt,[[330,716],[930,692]],W0,W1,{vol:true,h:70,stay:true,call:lw_call(tt,c.house+0.3,c.flags+2.6)});
  // villagers, led to the shelter
  [[0,"woman",60,LW_SARI[1]],[0.9,"child",42,LW_LUNGI[2]],[1.7,"man",64,LW_LUNGI[1]]].forEach(([d,k,h,cl],i)=>
    lw_go(x,tt,LW_WAY,P.lead+d,P.lead+d+6.5,{kind:k,h,top:LW_TOP[i+1],cloth:cl,load:k==="woman"?[160,140,110]:null}));
  let q=lw_pop(tt,c.cpp+0.3,c.mile-0.3);dq_textCard(x,120,150,820,{kick:"1972",title:"Cyclone Preparedness Programme",sub:"the Bangladesh Red Cross Society, with the government from 1973"},{k:q.k,a:q.a});
  q=lw_pop(tt,P.whole,null);dq_textCard(x,1180,150,620,{title:"A signal the whole village can read"},{edge:"brass",k:q.k,a:q.a});}
// people streaming to the lit shelter at dusk, one every 1.9 s, each 7.5 s on the way
function lw_stream(x,tt,t0,n){for(let i=0;i<n;i++){const s=t0+i*1.9,k=["woman","man","child","woman","man"][i%5];
  lw_go(x,tt,LW_WAY,s,s+7.5,{kind:k,h:k==="child"?42:k==="woman"?60:64,top:LW_TOP[i%4],cloth:k==="woman"?LW_SARI[i%4]:LW_LUNGI[i%3],load:i%3===0&&k!=="child"?[150,132,104]:null,light:0.25});}}
function lw_sidr(x,tt,c,P){lw_flags(x,3,tt,{wind:1.6});
  lw_stream(x,tt,c.sidr-4.5,16);
  lw_volunteer(x,700,702,70,{call:lw_call(tt,c.sidr,c.data-1),light:0.25});lw_volunteer(x,1188,672,64,{flip:true,call:lw_call(tt+0.7,c.ahead,c.data-1),light:0.25});
  // the cards keep left of the flagpole (x 640)
  let q=lw_pop(tt,c.sidr+0.4,c.ahead-0.3);dq_textCard(x,110,150,500,{kick:"Cyclone Sidr",title:"Winds as strong as 1970's",sub:"though at low tide"},{k:q.k,a:q.a});
  q=lw_pop(tt,c.ahead,c.shelter-0.3);dq_textCard(x,110,150,500,{kick:"Warnings for days",title:"The highest signal since the day before"},{edge:"brass",k:q.k,a:q.a});
  q=lw_pop(tt,c.shelter,c.died-0.3);if(q.a>0.004){x.save();x.globalAlpha*=q.a;dq_card(x,110,150,500,330,{});x.restore();}
  dq_figure(x,150,256,"40,000+","volunteers",{size:84,a:q.a});dq_figure(x,150,410,"1.5 million","in shelters",{size:84,a:q.a*ag_in(tt,P.million,0.5)});
  q=lw_pop(tt,c.died,null);if(q.a>0.004){x.save();x.globalAlpha*=q.a;dq_card(x,110,150,500,500,{});x.restore();}
  dq_figure(x,150,256,"300,000","died in 1970, at least",{size:84,a:q.a});dq_figure(x,150,410,"3,400","in 2007, about",{size:84,a:q.a});
  dq_chip(x,150,520,"still too many",{a:q.a*ag_in(tt,P.still,0.5)});dq_chip(x,150,590,"about one for every hundred",{a:q.a*ag_in(tt,P.every,0.5)});}
// the bench: the student system, its night's file, and the list, the last mile between them; day 0 that night, 1 the next morning
function lw_chain(x,tt,c,P,day){let q=lw_pop(tt,c.data-0.1,null);dq_textCard(x,100,330,400,{kick:"Source",title:"Student system"},{icon:"table",k:q.k,a:q.a});
  lw_arrow(x,508,401,582,401,{u:ag_in(tt,c.data+0.2,0.5),dark:!day});lw_arrow(x,948,401,1022,401,{u:ag_in(tt,c.data+0.5,0.5),dark:!day});
  // the last mile, in brass over the file
  const ba=ag_in(tt,P.lastMileD-0.1,0.5);if(ba>0.004){x.save();x.globalAlpha*=ba;x.strokeStyle=rgba(DQ.brass,1);x.lineWidth=4;x.beginPath();x.moveTo(505,300);x.lineTo(505,284);x.lineTo(1025,284);x.lineTo(1025,300);x.stroke();x.restore();
    dq_T(x,"the last mile",765,262,{w:800,size:30,align:"center",col:"brass",dark:!day,a:ba});}
  // the file: there each night; that night it doesn't come; the next morning it does, late
  const s1=1-ag_in(tt,P.doesnt,0.3);q=lw_pop(tt,c.data+0.3,null);
  if(!day){lw_file(x,590,326,{when:"each night, 2:00",k:q.k,a:q.a*s1});lw_file(x,590,326,{dash:true,dark:true,when:"didn't come",a:ag_in(tt,P.doesnt+0.3,0.3)});}
  else lw_file(x,590,326,{when:"came at 11:40",whenCol:DQ_TONE.hold.word});
  q=lw_pop(tt,c.data+0.6,null);const L=lw_list(x,1030,200,{w:640,h:470,count:day?"712":"689",countA:day?1:ag_in(tt,P.without,0.5),ghost:day?0:ag_in(tt,P.n23,0.6),ghostText:"23 missing",
    fill:day?1:0,k:q.k,a:q.a});
  q=lw_pop(tt,c.passed+0.2,null);dq_tag(x,1000,568,"pass",{text:"EVERY CHECK PASSES",to:[1030,520],flip:true,k:q.k,a:q.a});
  if(!day)dq_chip(x,1030,724,"nothing says how old it is",{icon:"dash",col:"none",a:ag_in(tt,P.nothing,0.5)});
  else{q=lw_pop(tt,P.all,null);dq_tag(x,1000,652,"pass",{text:"ALL 23 ON THE LIST",to:[1030,610],flip:true,k:q.k,a:q.a});
    dq_clock(x,1760,150,62,0,480,{a:ag_in(tt,P.notices-0.2,0.5)});dq_chip(x,1760,262,"in time",{align:"center",icon:"clock",col:"pass",a:ag_in(tt,P.notices+0.3,0.5)});}}
scene("story",(ctx,S,t,sc)=>{const c=sc.cues,P=lw_once(sc,()=>({g0:lw_g0(sc),radio:wAt(sc,"radio","the radio"),knew:wAt(sc,"stay","know a storm"),nobody:wAt(sc,"stay","almost nobody"),
    change:wAt(sc,"after","Something"),lastMile:wAt(sc,"mile","the last mile"),lead:wAt(sc,"house","lead people"),one:wAt(sc,"flags","one"),two:wAt(sc,"flags","two"),
    three:wAt(sc,"flags","three"),whole:wAt(sc,"flags","a signal"),million:wAt(sc,"shelter","a million"),still:wAt(sc,"died","still too many"),
    every:wAt(sc,"died","one for every hundred"),lastMileD:wAt(sc,"data","last mile"),doesnt:wAt(sc,"june","doesn't come"),without:wAt(sc,"june","built without it"),
    n23:wAt(sc,"passed","Twenty-three"),nothing:wAt(sc,"passed","nothing says so"),notices:wAt(sc,"heard","notices"),all:wAt(sc,"heard","all twenty-three")}));
  const N0=c.surge-0.5,D0=c.cpp-0.5,S0=c.sidr-0.5,B0=c.data-0.5,B1=c.heard-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lw_dusk70",keys:[[0,1010,575,1.1],[c.islands-0.5,960,540,1]],d:5,draw:(x,tt)=>lw_dusk(x,tt,c,P)},
    {at:N0,place:"lw_night70",later:true,dis:0.9,keys:[[0,960,540,1]],draw:(x,tt)=>lw_surge(x,tt,c,P)},
    {at:D0,place:"lw_day",later:true,dis:0.9,keys:[[0,960,540,1],[c.mile-0.4,900,640,1.35],[c.flags-0.4,960,540,1]],d:2,draw:(x,tt)=>lw_dayCpp(x,tt,c,P)},
    {at:S0,place:"lw_dusk07",later:true,dis:0.9,keys:[[0,960,540,1]],draw:(x,tt)=>lw_sidr(x,tt,c,P)},
    {at:B0,place:"lw_night",keys:[[0,960,540,1]],draw:(x,tt)=>lw_chain(x,tt,c,P,0)},
    {at:B1,place:"bench",keys:[[0,960,540,1]],draw:(x,tt)=>lw_chain(x,tt,c,P,1)}]);
  lw_tags(ctx,S,t,[[0.6,"East Pakistan, now Bangladesh · 1970"],[D0,"Bangladesh · from 1972"],[S0,"Bangladesh · 15 November 2007"],[B0,"The university · June 2026"],[c.breath-0.3,null]]);
  dq_title(ctx,S,t,c.breath,"Late is wrong too",null,"Fit for use · Film 4 of 4");});

/* ---------------------------------------------------------------- 2 · Every check green
   The bench at night, nobody there, the lamp lit. Each night at two the student system's file comes; at three the list is built from
   it. On Wednesday night, 17 June, Thursday's file doesn't come: a full disk. At three the list is built from what was there, the file
   of the night before (its date in steel, a measure); 689 graduates, every check green, even the check against the boards' lists, a
   day old too. Missing: 23 dashed red rows. Late data looks complete; the lens looks at the rows that are there, and the file that
   isn't was never checked. */
function lw_green(x,tt,c,P){
  // the clock: two, then three; Wednesday night, two again, then three
  const ca=ag_io(tt,0.4,c.wed-0.7,0.5)+ag_in(tt,c.wed+0.1,0.5),mins=tt<c.wed?lerp(120,180,ag_sine((tt-c.build)/1.2)):lerp(120,180,ag_sine((tt-c.anyway)/1.2));
  dq_clock(x,1760,150,62,0,mins,{a:Math.min(1,ca)});
  let q=lw_pop(tt,0.6,null);dq_textCard(x,100,220,440,{kick:"Each night at 2:00",title:"Student system"},{icon:"table",k:q.k,a:q.a});
  // the file that came, Wednesday's: its date in steel once it matters
  const bf=ag_in(tt,P.before,0.5);q=lw_pop(tt,P.file,null);lw_file(x,100,420,{when:"Wed 17 Jun, 02:00",whenA:bf,whenCol:DQ_TONE.steel.word,k:q.k,a:q.a});
  lw_arrow(x,462,495,1158,495,{dark:true,u:ag_in(tt,c.build,1.0)});lw_arrow(x,462,495,1158,495,{col:rgba(DQ_TONE.steel.dark,1),lw:5,u:ag_in(tt,P.before,1.0)});
  // Thursday's file, that didn't come, and why
  q=lw_pop(tt,P.didnt,null);lw_file(x,100,600,{dash:true,dark:true,title:"Thursday's file",when:"didn't come",a:q.a});
  dq_chip(x,100,800,"a full disk on the student system's side",{icon:"warn",a:ag_io(tt,P.disk,c.boards,0.5)});
  // the list, built at three; then from the file of the night before: 689, every check green, 23 missing
  q=lw_pop(tt,c.build+0.5,null);lw_list(x,1170,250,{w:640,h:500,count:"689",countA:ag_in(tt,c.green,0.5),ghost:ag_in(tt,c.missing+0.2,0.6),ghostText:"23 missing",k:q.k,a:q.a});
  q=lw_pop(tt,c.green+0.7,null);dq_tag(x,1140,640,"pass",{text:"EVERY CHECK PASSES",to:[1170,600],flip:true,k:q.k,a:q.a});
  // the boards' lists: the same transfer, a day old too; the check against them passes
  q=lw_pop(tt,P.boards,c.looks-0.3);dq_textCard(x,580,220,540,{kick:"Same transfer",title:"The exam boards' approved lists"},{edge:"brass",k:q.k,a:q.a});
  dq_chip(x,580,452,"a day old too",{icon:"clock",col:"steel",a:ag_io(tt,P.dayOld,c.looks-0.3,0.5)});
  q=lw_pop(tt,P.passedB,null);dq_tag(x,1140,730,"pass",{text:"AGREES WITH THE BOARDS",to:[1170,690],flip:true,k:q.k,a:q.a});
  q=lw_pop(tt,c.looks,null);dq_textCard(x,580,220,540,{title:"Late data looks complete"},{k:q.k,a:q.a});
  // each check looks at what's there; the file that isn't was never checked
  const la=ag_io(tt,c.see,P.none+0.6,0.4),lu=ag_sine((tt-c.see-0.2)/2.2);if(la>0.004)dq_icon(x,"lens",lerp(1240,1720,lu),lerp(470,580,lu),70,"steel",{dark:true,a:la,lw:4});
  q=lw_pop(tt,P.none,null);dq_tag(x,300,790,"none",{to:[275,750],k:q.k,a:q.a});}
scene("green",(ctx,S,t,sc)=>{const c=sc.cues,P=lw_once(sc,()=>({g0:lw_g0(sc),file:wAt(sc,"night","nightly file"),didnt:wAt(sc,"wed","didn't come"),disk:wAt(sc,"wed","a full disk"),
    wedW:wAt(sc,"wed","Wednesday night"),before:wAt(sc,"anyway","the file of the night before"),boards:wAt(sc,"boards","the boards' own lists"),passedB:wAt(sc,"boards","passed"),
    dayOld:wAt(sc,"boards","a day old"),none:wAt(sc,"see","None can see")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lw_night",later:true,dis:0.6,keys:[[0,960,540,1]],draw:(x,tt)=>lw_green(x,tt,c,P)}]);
  setScreen(ctx,S);dq_kicker(ctx,"2","Every check green",{dark:true,a:ag_in(t,0.9,0.6)});lw_date(ctx,S,"Wednesday night · 17 June",ag_in(t,P.wedW,0.5));});

/* ---------------------------------------------------------------- 3 · Thirty hours
   The bench by day, Thursday 18 June, 8 am; the send to the printer due at five. Sam, and Databricks' monitoring: the student system's
   tables late. dbt's freshness check: thirty hours old, a steel tag. The level there was: a warning after a day, set by the builders,
   agreed with nobody, never run at night; a signal nobody understands. Malia, and an amber HOLD on the send. 11:40 the file; 12:10 the
   list again, 712; the 23 new names ticked; 3:20, sent. Then the December before, a later moment: six certificates, posted late. */
const LW_OLD=["student_system:",[["  loaded_at_field: ",null],["_loaded_at",null]],"  freshness:",[["    warn_after: ",null],["{count: 1, period: day}","hold"]],
  [["    error_after: ",null],["{count: 3, period: day}",null]]];
function lw_hours(x,tt,c,P){const G=P.g0+tt,M0=c.december-0.5;
  dq_clock(x,1760,150,62,0,ag_keys(tt,[[0,480],[P.c1140,480],[P.c1140+1.4,700],[P.c1210,700],[P.c1210+1.0,730],[P.c320,730],[P.c320+1.6,920]]),{});
  lw_who(x,"sam",300,G,1);dq_nameTag(x,300,262,"sam",{align:"center",a:ag_io(tt,P.sam,c.thirty,0.4)});
  lw_who(x,"malia",1680,G,ag_in(tt,P.malia-0.3,0.6),{flip:true});dq_nameTag(x,1680,262,"malia",{align:"center",a:ag_io(tt,P.malia,c.arrives,0.4)});
  let q=lw_pop(tt,P.printer,null);lw_send(x,1100,90,{w:520,k:q.k,a:q.a});
  // the monitoring: the student system's tables late
  q=lw_pop(tt,P.monitoring-0.3,c.thirty-0.3);lw_monitor(x,560,300,{k:q.k,a:q.a,lit:tt>P.late?[0,1,2]:[]});
  // dbt's freshness check, line by line; thirty hours old
  q=lw_pop(tt,c.thirty,c.level-0.3);lw_cli(x,560,300,{k:q.k,a:q.a,h:330,lines:[["warn","student_system.graduations"],["warn","student_system.results"],["pass","portal.name_confirmations"]],
    lineA:(l,i)=>ag_in(tt,c.thirty+0.4+i*0.35,0.3)});
  q=lw_pop(tt,P.hours,c.level-0.3);dq_tag(x,1500,690,"steel",{text:"30 HOURS OLD",icon:"clock",to:[1480,630],k:q.k,a:q.a});
  // the level there was, and who set it
  q=lw_pop(tt,c.level,c.signal-0.3);lw_yml(x,560,300,1100,{title:"sources · as it was",lines:LW_OLD,lit:tt>P.warnAfter?[3]:[],k:q.k,a:q.a});
  const out=c.signal-0.3,b1=dq_chip(x,560,722,"set by the builders",{icon:"tools",a:ag_io(tt,P.builders,out,0.4)}),
    b2=dq_chip(x,b1.x+b1.w+16,722,"agreed with nobody",{icon:"people",col:"none",a:ag_io(tt,P.nobody,out,0.4)});
  dq_chip(x,b2.x+b2.w+16,722,"never run at night",{icon:"clock",col:"none",a:ag_io(tt,P.never,out,0.4)});
  q=lw_pop(tt,c.signal,c.calls-0.3);dq_textCard(x,560,330,900,{title:"A level its users never agreed is a signal nobody understands"},{k:q.k,a:q.a});
  // Malia holds the send; the file comes, the list again, the new names checked, sent
  q=lw_pop(tt,P.holds,P.goesW);dq_tag(x,1300,300,"hold",{to:[1330,232],k:q.k,a:q.a});
  q=lw_pop(tt,P.goesW+0.4,M0);dq_tag(x,1300,300,"pass",{text:"SENT · 3:20 PM",to:[1330,232],k:q.k,a:q.a});
  q=lw_pop(tt,c.calls+0.4,M0);const sw=ag_in(tt,P.n712,0.25),fl=ag_in(tt,P.n712+0.3,0.6),tk=ag_in(tt,P.checks,1.8);
  lw_list(x,560,330,{w:520,h:440,count:"689",countA:1-sw,fill:fl,ticks:tk,note:tk>0.5?"checked":"23 new names",noteCol:tk>0.5?"pass":"hold",
    noteA:fl*(tk>0.5?ag_in(tt,P.checks+0.9,0.3):1-ag_in(tt,P.checks+0.6,0.3)),k:q.k,a:q.a});
  if(q.a>0.004){x.save();x.globalAlpha*=q.a;lw_count(x,560,330,"712",ag_in(tt,P.n712+0.25,0.25));x.restore();}
  q=lw_pop(tt,P.arrivesW,M0);lw_file(x,1110,470,{when:"Thu 18 Jun, 11:40",whenCol:DQ_TONE.hold.word,k:q.k,a:q.a});}
function lw_december(x,tt,c,P){let q=lw_pop(tt,c.december,null);dq_textCard(x,560,230,820,{kick:"December 2025",title:"Six graduates left off the same way",sub:"and nobody saw"},{k:q.k,a:q.a});
  lw_posted(x,560,520,(tt-P.printedW)/1.6,ag_in(tt,P.printedW,0.4));dq_chip(x,560,700,"printed late, and posted",{icon:"mail",a:ag_in(tt,P.posted,0.5)});}
scene("hours",(ctx,S,t,sc)=>{const c=sc.cues,P=lw_once(sc,()=>({g0:lw_g0(sc),printer:wAt(sc,"eight","printer"),sam:wAt(sc,"sam","Sam Okafor"),monitoring:wAt(sc,"sam","monitoring"),
    late:wAt(sc,"sam","late"),hours:wAt(sc,"thirty","thirty hours"),warnAfter:wAt(sc,"level","a warning after a day"),builders:wAt(sc,"level","set by the builders"),
    nobody:wAt(sc,"level","agreed with nobody"),never:wAt(sc,"level","never run"),malia:wAt(sc,"calls","Malia Fonoti"),holds:wAt(sc,"calls","holds the send"),
    arrivesW:wAt(sc,"arrives","the file arrives"),c1140:wAt(sc,"arrives","eleven forty"),c1210:wAt(sc,"arrives","twelve ten"),n712:wAt(sc,"arrives","seven hundred and twelve"),
    checks:wAt(sc,"goes","checks"),c320:wAt(sc,"goes","three twenty"),goesW:wAt(sc,"goes","the list goes"),printedW:wAt(sc,"december","printed late"),posted:wAt(sc,"december","posted")}));
  const M0=c.december-0.5;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",later:true,dis:0.6,keys:[[0,960,540,1]],draw:(x,tt)=>lw_hours(x,tt,c,P)},
    {at:M0,place:"bench",later:true,keys:[[0,960,540,1]],draw:(x,tt)=>lw_december(x,tt,c,P)}]);
  setScreen(ctx,S);dq_kicker(ctx,"3","Thirty hours",{a:ag_in(t,0.9,0.6)});
  lw_date(ctx,S,"Thursday 18 June",ag_io(t,c.eight,M0,0.5));lw_date(ctx,S,"December 2025",ag_in(t,M0+0.6,0.5));});

/* ---------------------------------------------------------------- 4 · How fresh, for what
   Monday 22 June: Sam, Malia and Mei behind the bench. The platform sees a table is late (steel, over Sam); only its users say when
   late is too late (brass, over Malia and Mei). The bench from above: the three uses as cards, each with its clock, a dial whose brass
   range is how old the list may be for it: the certificates, that night's files at the send; the seating, a few days; Planning, weeks.
   The strictest sets the level. The contract's rule, agreed by Malia, owned by Mei. Then the six dimensions as Rules that run left them,
   timeliness in pencil, inked by its first rule. */
const LW_CONTRACT=["quality:","  - name: certificates_from_that_nights_files",[["    dimension: ",null],["timeliness","brass"]],
  [["    level: ",null],["each source at most 24 hours old, at the send","brass"]],[["    agreedWith: ",null],["Malia Fonoti, graduations office",null]],
  "slaProperties:",[["  - property: ",null],["latency",null]],[["    value: ",null],["24","brass"],["    unit: ",null],["h","brass"]]];
function lw_meet(x,tt,c,P){const G=P.g0+tt,K0=c.knows-0.2;
  lw_who(x,"sam",330,G,1);lw_who(x,"malia",1100,G,1);lw_who(x,"mei",1590,G,ag_in(tt,P.mei-0.4,0.6),{flip:true});
  dq_nameTag(x,330,262,"sam",{align:"center",a:ag_io(tt,P.samW,K0,0.4)});dq_nameTag(x,1100,262,"malia",{align:"center",a:ag_io(tt,P.maliaW,K0,0.4)});
  dq_nameTag(x,1590,262,"mei",{align:"center",role:"Owns the list",a:ag_io(tt,P.mei,K0,0.4)});
  dq_chip(x,330,262,"sees that a table is late",{align:"center",icon:"lens",col:"steel",a:ag_in(tt,P.platform,0.5)});
  dq_chip(x,1345,262,"its users say when late is too late",{align:"center",icon:"people",col:"brass",a:ag_in(tt,P.users,0.5)});}
const LW_USES=[["Certificates","That night's files, at the send","certificate",{min:0,max:48,lo:0,hi:24,ticks:8,read:"24 hours"}],
  ["Seating","A list a few days old","seat",{min:0,max:14,lo:0,hi:5,ticks:7,read:"days"}],["Planning","Weeks after the year's end","building",{min:0,max:12,lo:0,hi:8,ticks:6,read:"weeks"}]];
function lw_uses(x,tt,c,P){const U0=c.contract-0.4,ts=[c.certs,c.seats,c.planning],st=ag_in(tt,P.strictest,0.6);
  LW_USES.forEach(([k,ti,ic,d],i)=>{const q=lw_pop(tt,ts[i]+0.2,U0),dim=i?1-0.55*st:1;
    x.save();x.globalAlpha*=dim;dq_textCard(x,150+i*560,150,500,{kick:k,title:ti},{icon:ic,edge:"brass",on:"granite",k:q.k,a:q.a});
    const dq=lw_pop(tt,P.three+i*0.3,U0);dq_dial(x,400+i*560,520,140,Object.assign({u:ag_in(tt,P.three+i*0.3+0.3,0.9),readCol:"brass",on:"granite",k:dq.k,a:dq.a},d));x.restore();});
  const q=lw_pop(tt,P.level,U0);dq_textCard(x,560,760,800,{title:"The level: a day old at most, at the send"},{edge:"brass",on:"granite",k:q.k,a:q.a});}
function lw_rule(x,tt,c,P){const R0=c.pencil-0.4;let q=lw_pop(tt,c.contract+0.1,R0);
  lw_yml(x,340,150,1240,{logo:null,product:"Data contract",title:"the graduation list",lines:LW_CONTRACT,lit:tt>P.agrees?[4]:[],k:q.k,a:q.a});
  const c1=dq_chip(x,340,770,"agreed: Malia Fonoti",{icon:"people",col:"brass",on:"granite",a:ag_io(tt,P.agrees,R0,0.4)});
  dq_chip(x,c1.x+c1.w+20,770,"owner: Mei Tanaka",{icon:"person",on:"granite",a:ag_io(tt,P.owns,R0,0.4)});
  q=lw_pop(tt,c.pencil,null);lw_dims(x,340,260,{first:ag_in(tt,P.first,0.8),on:"granite",k:q.k,a:q.a});}
scene("fresh",(ctx,S,t,sc)=>{const c=sc.cues,P=lw_once(sc,()=>({g0:lw_g0(sc),maliaW:wAt(sc,"monday","Malia"),samW:wAt(sc,"monday","Sam"),mei:wAt(sc,"monday","Mei Tanaka"),
    platform:wAt(sc,"knows","The platform"),users:wAt(sc,"knows","its users"),three:wAt(sc,"clocks","three clocks"),strictest:wAt(sc,"clocks","The strictest"),
    level:wAt(sc,"clocks","a day old"),agrees:wAt(sc,"contract","Malia agrees"),owns:wAt(sc,"contract","Mei owns"),first:wAt(sc,"pencil","This is its first rule")}));
  const T0=c.certs-0.5;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",later:true,dis:0.6,keys:[[0,960,540,1]],draw:(x,tt)=>lw_meet(x,tt,c,P)},
    {at:T0,place:"benchTop",keys:[[0,960,540,1]],draw:(x,tt)=>{lw_uses(x,tt,c,P);lw_rule(x,tt,c,P);}}]);
  setScreen(ctx,S);const top=ag_in(t,T0,0.5);dq_kicker(ctx,"4","How fresh, for what",{a:ag_in(t,0.9,0.6)*(1-top)});dq_kicker(ctx,"4","How fresh, for what",{dark:true,a:top});
  lw_date(ctx,S,"Monday 22 June",ag_io(t,c.monday,c.certs-0.6,0.5));});

/* ---------------------------------------------------------------- 5 · Say how old it is
   The bench from above. From Tuesday 23 June the list says how old it is: two columns, each source's age, lit in steel; that
   Thursday's values, the student system's amber (thirty hours), the portal's green. The printer's page, its age at the top, and the
   volunteers' three flags beside it: a signal everyone can read. Too good to be true labelled a number from the night before; here,
   every list says its age, on a good night too. Data that says its age can be trusted to be old; data that doesn't, can't. */
function lw_age(x,tt,c,P){const P0=c.shown-0.3,H0=P.here-0.2,E0=c.trust-0.3;
  let q=lw_pop(tt,c.says,P0);lw_table(x,210,170,{cells:ag_in(tt,c.row,0.6),lit:ag_in(tt,P.ageW,0.6),ssCol:tt>P.ownW?DQ_TONE.hold.word:null,poCol:tt>P.ownW?DQ_TONE.pass.word:null,on:"granite",k:q.k,a:q.a});
  const o1=ag_io(tt,P.ss,P0,0.4),o2=ag_io(tt,P.po,P0,0.4);dq_chip(x,918,620,"30 hours old",{icon:"clock",col:"hold",on:"granite",a:o1});dq_chip(x,1328,620,"6 hours old",{icon:"clock",col:"pass",on:"granite",a:o2});
  dq_chip(x,918,700,"student_system_as_of · portal_as_of",{col:"steel",on:"granite",a:ag_io(tt,c.row+0.8,c.own-0.2,0.4)});
  // the printer's page; then a good night's
  q=lw_pop(tt,c.shown,H0);lw_page(x,440,160,{ssCol:DQ_TONE.hold.word,poCol:DQ_TONE.pass.word,on:"granite",k:q.k,a:q.a});
  q=lw_pop(tt,c.flags,E0);lw_flagCard(x,1540,220,tt,{on:"granite",k:q.k,a:q.a});
  dq_chip(x,1540,610,"read by everyone",{on:"granite",a:ag_io(tt,P.everyone,E0,0.4)});
  dq_chip(x,440,660,"Too good to be true",{icon:"flag",on:"granite",a:ag_io(tt,c.labelled,E0,0.4)});
  q=lw_pop(tt,H0+0.4,E0);lw_page(x,440,160,{title:"Graduation list · December 2026 ceremonies",ss:"Thu 12 Nov, 02:00",po:"Thu 12 Nov, 02:00",ssCol:DQ_TONE.pass.word,poCol:DQ_TONE.pass.word,on:"granite",k:q.k,a:q.a});
  dq_chip(x,840,660,"on a good night too",{icon:"tick",col:"pass",on:"granite",a:ag_io(tt,P.good,E0,0.4)});
  q=lw_pop(tt,c.trust,null);dq_textCard(x,460,300,1000,{title:"Data that says its age can be trusted to be old"},{edge:"brass",on:"granite",k:q.k,a:q.a});
  q=lw_pop(tt,c.cant,null);const b=dq_textCard(x,460,450,1000,{title:"Data that doesn't, can't"},{on:"granite",k:q.k,a:q.a});
  dq_chip(x,460+1000-28,b.y+b.h/2,"as of ?",{icon:"why",col:"stop",align:"center",a:ag_in(tt,c.cant+0.5,0.4)});}
scene("age",(ctx,S,t,sc)=>{const c=sc.cues,P=lw_once(sc,()=>({g0:lw_g0(sc),ageW:wAt(sc,"row","age"),ownW:wAt(sc,"own","That Thursday"),ss:wAt(sc,"own","student system"),
    po:wAt(sc,"own","portal"),everyone:wAt(sc,"flags","everyone"),here:wAt(sc,"labelled","Here"),good:wAt(sc,"labelled","on good nights")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"benchTop",later:true,dis:0.6,keys:[[0,960,540,1]],draw:(x,tt)=>lw_age(x,tt,c,P)}]);
  setScreen(ctx,S);dq_kicker(ctx,"5","Say how old it is",{dark:true,a:ag_in(t,0.9,0.6)});lw_date(ctx,S,"From Tuesday 23 June",ag_io(t,c.says,c.shown-0.4,0.5));});

/* ---------------------------------------------------------------- 6 · Warn first, then stop the send
   The bench: Sam. The age is checked where it starts, at each source: when each night's file arrived (a receipts table, received_at in
   steel), not the newest row. One level on each: the source's file, error after 24 hours. The night's job: the check first, then the
   build, run if all done; the check fails, Sam and Malia hear at once, the list is still built, saying its age. The warning. The send's
   job: the same check, then the send, run if all succeeded; the check fails, the send waits, Malia is told why. */
const LW_NEW=["sources:","  - name: student_system","    tables:","      - name: nightly_files",[["        loaded_at_field: ",null],["received_at","steel"]],"        freshness:",
  [["          error_after: ",null],["{count: 24, period: hour}","brass"]]];
function lw_receipts(x,X,y,title,rows,o){const a=o.a;if(a<=0.004)return;x.save();x.globalAlpha*=a;if(o.k!=null)ag_about(x,X+290,y+150,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(x,X,y,580,300,{});dq_label(x,X+DQ_PAD,y+54,title,{});dq_T(x,"nightly_files",X+DQ_PAD,y+100,{w:500,size:28,f:"mono",col:DQ.soft});
  dq_rows(x,X+DQ_PAD,y+116,[{h:"received_at",w:520,f:"mono"}],rows,{rh:56,lit:o.lit,litCol:"steel"});x.restore();}
function lw_stop(x,tt,c,P){const G=P.g0+tt,J0=c.first-0.3,J1=c.send-0.3;lw_who(x,"sam",280,G,1);
  let q=lw_pop(tt,c.source+0.2,c.level-0.3);lw_receipts(x,560,200,"Student system",[["Tue 16 Jun, 02:00"],["Wed 17 Jun, 02:00"]],{lit:tt>P.arrivedW?[0,1]:[],k:q.k,a:q.a});
  q=lw_pop(tt,c.source+0.5,c.level-0.3);lw_receipts(x,1200,200,"Portal",[["Wed 17 Jun, 02:00"],["Thu 18 Jun, 02:00"]],{lit:tt>P.arrivedW?[0,1]:[],k:q.k,a:q.a});
  dq_chip(x,560,560,"not the newest row: days old when no board has met",{icon:"dash",col:"none",a:ag_io(tt,P.newest,c.level-0.3,0.4)});
  q=lw_pop(tt,c.level,J0);lw_yml(x,560,200,1280,{title:"sources",lines:LW_NEW,lit:tt>P.h24?[6]:[],k:q.k,a:q.a});
  dq_chip(x,560,690,"the same on the portal's",{icon:"tick",a:ag_io(tt,P.each,J0,0.4)});
  // the night's job: the check first; it fails, two people hear, the list is still built
  const fail1=ag_in(tt,c.tells+0.2,0.3)>0.5,built=tt>P.built;q=lw_pop(tt,c.first,J1);
  lw_job(x,560,200,{job:"the night's update",tasks:["Check the sources' age","Build the list"],runIf:"All done",states:[fail1?"stop":null,built?"pass":null],
    who:"Sam Okafor, Malia Fonoti",tell:ag_in(tt,P.hear,0.5),k:q.k,a:q.a});
  dq_chip(x,1210,660,"the list says its age",{icon:"clock",col:"steel",a:ag_io(tt,P.saying,c.warn-0.3,0.4)});
  q=lw_pop(tt,c.warn,J1);dq_textCard(x,560,650,900,{kick:"That's the warning",title:"Nothing stops, and the people who need to know, know"},{edge:"hold",k:q.k,a:q.a});
  // the send's job: the same check; it fails, the send waits, Malia is told why
  const fail2=tt>P.ifNot,wait=tt>P.waitsW;q=lw_pop(tt,P.sendW,null);
  lw_job(x,560,200,{job:"the send to the printer",tasks:["Check the sources' age","Send to the printer"],runIf:"All succeeded",states:[fail2?"stop":null,wait?"wait":null],
    who:"Malia Fonoti: told why",tell:ag_in(tt,P.told,0.5),k:q.k,a:q.a});
  q=lw_pop(tt,c.data,null);dq_textCard(x,560,660,900,{title:"The data isn't stopped. The send is."},{edge:"stop",k:q.k,a:q.a});}
scene("stop",(ctx,S,t,sc)=>{const c=sc.cues,P=lw_once(sc,()=>({g0:lw_g0(sc),arrivedW:wAt(sc,"arrived","arrived"),newest:wAt(sc,"arrived","not the newest row"),
    each:wAt(sc,"level","on each"),h24:wAt(sc,"level","twenty-four hours"),hear:wAt(sc,"tells","hear at once"),built:wAt(sc,"tells","still built"),saying:wAt(sc,"tells","saying its age"),
    sendW:wAt(sc,"send","a job too"),ifNot:wAt(sc,"waits","if not"),waitsW:wAt(sc,"waits","the list waits"),told:wAt(sc,"waits","told why")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",keys:[[0,960,540,1]],draw:(x,tt)=>lw_stop(x,tt,c,P)}]);
  setScreen(ctx,S);dq_kicker(ctx,"6","Warn first, then stop the send",{a:ag_in(t,0.9,0.6)});});

/* ---------------------------------------------------------------- 7 · In time
   The coast at dusk, 2007: the flags flying, the volunteers calling, people walking to the lit shelter. The bench: the printer's page
   with its age, and the send, waiting until the list is fresh; since June, no graduate left off a list by a late file. The film's line,
   then a use, a measure, a reference and a clock, and the next series. */
function lw_inTime(x,tt,c,P){const T0=c.take-0.3;
  let q=lw_pop(tt,c.list+0.2,T0);lw_page(x,200,150,{w:960,ssCol:DQ_TONE.hold.word,poCol:DQ_TONE.pass.word,k:q.k,a:q.a});
  q=lw_pop(tt,P.sendW,T0);lw_send(x,1260,170,{w:520,kick:"Due at 5 pm",k:q.k,a:q.a});
  dq_tag(x,1500,400,"hold",{text:"WAITS",icon:"hourglass",to:[1510,312],k:q.k,a:q.a*(1-ag_in(tt,P.fresh,0.3))});
  q=lw_pop(tt,P.fresh+0.3,T0);dq_tag(x,1500,400,"pass",{text:"FRESH · SENT",to:[1510,312],k:q.k,a:q.a});
  q=lw_pop(tt,c.since,T0);dq_figure(x,200,720,"0","graduates left off a list by a late file, since June",{size:96,col:"pass",a:q.a});
  q=lw_pop(tt,c.take,null);dq_textCard(x,330,250,1260,{title:"Agree how fresh it must be, and always say how old it is."},{edge:"brass",k:q.k,a:q.a});
  const words=[["a use",P.use],["a measure",P.measure],["a reference",P.reference],["a clock",P.clock]];let cx=330;
  words.forEach(([s,t0])=>{const b=dq_chip(x,cx,520,s,{a:ag_in(tt,t0,0.4)});cx=b.x+b.w+20;});
  dq_chip(x,330,610,"Next: Quality as a habit",{icon:"refresh",col:"brass",a:ag_in(tt,P.next,0.5)});}
scene("time",(ctx,S,t,sc)=>{const c=sc.cues,P=lw_once(sc,()=>({g0:lw_g0(sc),sendW:wAt(sc,"list","the send"),fresh:wAt(sc,"list","fresh"),use:wAt(sc,"series","a use"),
    measure:wAt(sc,"series","a measure"),reference:wAt(sc,"series","a reference"),clock:wAt(sc,"series","a clock"),next:wAt(sc,"series","Next")}));
  const B0=c.list-0.5;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lw_dusk07",keys:[[0,960,560,1.06],[0.2,960,540,1]],d:6,draw:(x,tt)=>{lw_flags(x,3,tt,{wind:1.4});lw_stream(x,tt,-5,6);
      lw_volunteer(x,700,702,70,{call:lw_call(tt,0.3,B0),light:0.25});lw_volunteer(x,1188,672,64,{flip:true,call:lw_call(tt+0.7,1.2,B0),light:0.25});}},
    {at:B0,place:"bench",keys:[[0,960,540,1]],draw:(x,tt)=>lw_inTime(x,tt,c,P)}]);
  lw_tags(ctx,S,t,[[0.3,"Bangladesh · 2007"],[B0-0.3,null]]);
  setScreen(ctx,S);dq_kicker(ctx,"7","In time",{a:ag_in(t,B0+0.4,0.6)});
  dq_end(ctx,S,t,c.breath,"Late is wrong too","Agree how fresh it must be, and always say how old it is.","Film 4 of 4","Fit for use");});

ag_cutInto(["green","hours","fresh","age"]);
