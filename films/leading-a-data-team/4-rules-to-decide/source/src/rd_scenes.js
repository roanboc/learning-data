/* ===== Rules that let people decide: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, or cuts where both show the same people. Sizes in
   the 1920 x 1080 frame. */

const RD_LAST="A few clear rules, good tools, and trust.";
// the film's number and title at the top left, from the second chapter on
function rd_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"4","Rules that let people decide",{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function rd_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const rd_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function rd_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 and goes at t1
function rd_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// what's in a field at tt, from its events [[time, kind], ...]: the kind it's becoming, the one before, and how far along
function rd_evState(E,tt){E.sort((p,q)=>p[0]-q[0]);let i=0;for(let k=0;k<E.length;k++)if(E[k][0]<=tt)i=k;const cur=E[i],pv=E[Math.max(0,i-1)];
  return{kind:cur[1],from:i?pv[1]:cur[1],u:clamp((tt-cur[0])/0.9,0,1),seed:cur[1]==="water"?clamp((tt-cur[0]-0.6)/1.4,0,1):0};}

/* ---------------------------------------------------------------- 1. Water, shared: Bali, the 1970s */
scene("subak",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),out={light:"day",wall:0};
  const bare=c.turns-0.2,ripe=w("rest","harvested",-0.3),empty=w("rest","empty",-0.2),told=w("told","often",-0.4),dry=w("dry","downstream",-0.2),back=c.back,grow=w("pests","sprayed",-0.2);
  // each field's events: young rice; prepared; flooded in turns, subak by subak; ripe and harvested together; then every field on its own
  // clock; the downstream fields dry; then the temples' calendar again
  const ev=f=>{const E=[[-1e9,"young"],[bare,"bare"],[c.turns+0.6+f.subak*1.8+f.i*0.03,"water"],[ripe,"ripe"],[empty,"bare"]];
    const cyc=3.6,ph=f.seed*cyc,stop=f.subak===2?dry:back-0.6;for(let k=0;;k++){const t0=told+ph*0.6+k*cyc*0.3;if(t0>stop)break;E.push([t0,["water","young","ripe","bare"][(k+Math.floor(f.seed*4))%4]]);}
    if(f.subak===2)E.push([dry+0.3+f.i*0.06,"dry"]);
    E.push([back-0.4,"bare"],[back+0.6+f.subak*1.6+f.i*0.03,"water"],[grow+f.subak*0.3,"young"]);return E;};
  const st=(f,tt)=>rd_evState(ev(f),tt);
  const ALL=RD_TER.all,ripeF=ALL.filter(f=>f.r>2),pestA=tt=>Math.max(ag_io(tt,ripe-1.6,empty+0.4,0.6)*0.8,ag_in(tt,w("clock","pests",-0.6),1.2)*(1-ag_in(tt,c.back+1.0,3.0)));
  const pestN=tt=>tt<c.clock?14:Math.round(lerp(14,44,ag_in(tt,c.clock,6)));
  const terr=(x,tt,o)=>rd_terraces(x,tt,Object.assign({st,flow:1-0.5*ag_in(tt,dry,1)*(1-ag_in(tt,back,1)),reach:1-0.42*ag_in(tt,dry,1.2)*(1-ag_in(tt,back+0.4,2)),
    pests:rd_swarm(tt,tt<c.clock?ripeF:ALL,pestN(tt),pestA(tt),9)},o||{}));
  const sub0=w("subak","subak",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // the terraces, the water running down from the mountain, field to field
    {at:0,place:"rdTerraces",keys:[[0,960,600,1.1],[c.when+0.5,960,540,1.0]],d:5,draw:(x,tt)=>{
      terr(x,tt,{edge:f=>f.subak===0?{col:LP.ink,a:0.75*ag_io(tt,sub0,c.temple-0.2,0.5),w:3}:null});
      rd_sheet(x,tt,w("when","Bali",-0.2),120,110,560,{kick:"Bali, Indonesia",title:"The 1970s"},{light:null,pin:false,out:c.years+1.6});
      rd_tag(x,tt,w("years","thousand",-0.2),c.subak-0.3,120,350,"For over a thousand years",{col:LP.mut});
      rd_tag(x,tt,sub0+0.3,c.temple-0.3,1300,180,"A subak: the farmers of one canal",{col:LP.ink,align:"center"});}},
    // the water temple: the groups along a river meet, and agree a calendar
    {at:c.temple-0.3,place:"rdTemple",keys:[[c.temple-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const k0=w("temple","calendar",-0.2);
      lp_person(x,RD_FARMERS.f1,1180,770,0.68,{t:tt,light:out});lp_person(x,RD_FARMERS.f2,1500,770,0.68,{t:tt,flip:true,light:out});lp_person(x,RD_FARMERS.f3,1760,780,0.66,{t:tt,flip:true,light:out});
      rd_sheet(x,tt,k0,110,100,640,{kick:"The water temple's calendar",lines:["Days 1 to 10: the first subak plants","Days 10 to 20: the second","Days 20 to 30: the third"]},
        {col:LP.blue,light:null,pin:false,u:rd_u(tt,[w("temple","who",-0.1),w("temple","follows",-0.3),w("temple","follows",0.4)])});}},
    // planting in turns; harvesting together; then the push for more rice, and every field on its own clock
    {at:c.turns-0.3,place:"rdTerraces",keys:[[c.turns-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{terr(x,tt);
      rd_pill(x,tt,w("turns","downstream",-0.2),c.rest-0.3,1380,250,"Water reaches the fields downstream",{col:LP.green});
      rd_pill(x,tt,w("rest","hungry",-0.3),c.push-0.3,1380,250,"Resting together, the pests go hungry",{col:LP.green});
      rd_sheet(x,tt,w("push","grow",-0.3),110,100,640,{kick:"A national plan",title:"Grow more rice, fast"},{col:LP.blue,light:null,pin:false,out:c.fed-0.3});
      rd_sheet(x,tt,w("told","plant",-0.2),1200,100,620,{kick:"Farmers were told",title:"Plant new rice as often as you can"},{col:LP.blue,light:null,pin:false,out:c.clock-0.3});
      rd_pill(x,tt,w("fed","grain",-0.3),c.clock-0.3,480,250,"More grain from each crop",{col:LP.green});
      rd_tag(x,tt,w("clock","pests",-0.2),c.hopper-0.3,960,240,"Pests always find rice next door",{col:LP.amber,align:"center"});}},
    // the brown planthopper, drawn large; two million tons
    {at:c.hopper-0.3,place:"rdTerraces",later:true,keys:[[c.hopper-0.3,960,540,1.0]],draw:(x,tt)=>{const h0=w("hopper","planthopper",-0.4),n0=w("hopper","million",-0.3);
      // the fields the hoppers took, outlined in amber
      terr(x,tt,{edge:f=>f.seed<0.45?{col:LP.amber,a:0.9*ag_in(tt,n0+f.seed*1.6,0.5),w:4}:null});
      if(tt>=h0){const a=ag_in(tt,h0,0.4);lp_sheet(x,1060,90,700,330,{light:null,pin:false,a,k:tt-h0});rd_hopper(x,1400,260,1.7*lerp(0.6,1,ag_spr(tt-h0,0,0.5)),a);
        lp_T(x,"The brown planthopper",1410,392,{w:700,size:28,align:"center",col:LP.mut,a});}
      // the sheet is as wide as its number, which the kit draws at 96 px: at 640, 2 million tons ran 24 px past it
      if(tt>=n0)lp_figure(x,160,90,Math.max(640,Math.ceil(ag_tw(x,"2 million tons",{w:800,size:96}))+LP_PAD*2),{kick:"Indonesia, 1977",num:"2 million tons",label:"of rice destroyed"},{col:LP.amber,light:null,pin:false,a:ag_in(tt,n0,0.35),k:tt-n0});}},
    // the dry season: the water no longer reaches the fields downstream; a farmer's lost harvest
    {at:c.dry-0.3,place:"rdTerraces",later:true,keys:[[c.dry-0.3,960,540,1.0]],draw:(x,tt)=>{terr(x,tt);const f0=c.harm-0.4;
      rd_tag(x,tt,w("dry","downstream",0.2),null,1340,620,"Downstream: no water",{col:LP.amber,align:"center"});
      if(tt>=f0)lp_person(x,RD_FARMERS.f2,380,640,1.0,{t:tt,flip:false,a:ag_in(tt,f0,0.7),light:out});
      rd_sheet(x,tt,w("harm","harvest",-0.2),1180,100,620,{kick:"For a farming family",title:"A lost harvest",lines:["A season's food and income, gone"]},{col:LP.amber,light:null,pin:false,
        u:ag_in(tt,w("harm","food",-0.1),0.5)});}},
    // the model: two rivers and their 172 subaks
    {at:c.model-0.3,place:"rdModel",keys:[[c.model-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const s0=w("showed","calendar",-0.2),b0=c.bank-0.3,m0=w("model","hundred",-0.3);
      rd_cells(x,0,{a:ag_in(tt,m0,1.0)*(1-ag_in(tt,s0,0.8))});rd_cells(x,10,{a:ag_in(tt,s0,1.0)});
      rd_tag(x,tt,m0+0.6,s0,690,100,"Each colour: one planting calendar",{col:LP.mut,align:"center"});
      rd_tag(x,tt,s0+0.6,b0,690,100,"The temples' calendar: groups planting together",{col:LP.blue,align:"center"});
      rd_sheet(x,tt,w("model","computer",-0.3),1320,110,520,{kick:"In the 1980s",title:"A model of two rivers",lines:["Stephen Lansing, anthropologist","James Kremer, ecologist","172 subaks"]},
        {light:null,pin:false,out:s0-0.3,u:rd_u(tt,[w("model","Lansing",-0.2),w("model","Kremer",-0.2),w("model","hundred",-0.2)])});
      // what it showed, in words: the model's harvests aren't numbers the film can quote, so no chart
      rd_sheet(x,tt,s0+0.3,1320,110,520,{kick:"What the model showed",title:"The temples' calendar gave the biggest harvests",lines:["Fields resting together: pests go hungry","Planting in turns: the water is shared"]},
        {col:LP.green,light:null,pin:false,out:b0-0.2,u:rd_u(tt,[w("showed","pests",-0.2),w("showed","water",-0.2)])});
      rd_sheet(x,tt,b0+0.4,1320,110,520,{kick:"1988",title:"To the bank that paid for new irrigation works"},{light:null,pin:false});
      rd_pill(x,tt,w("bank","agreed",-0.2),null,1580,470,"The bank agreed",{col:LP.green,icon:"tick"});}},
    // the temples set the planting again: pests under control, less spraying; the bank's report; World Heritage
    {at:c.back-0.3,place:"rdTerraces",keys:[[c.back-0.3,960,560,1.04],[c.unesco,960,540,1.0]],d:6,dis:1.2,draw:(x,tt)=>{
      terr(x,tt,{edge:f=>({col:LP.blue,a:0.7*ag_io(tt,c.back+0.5+f.subak*1.6,c.pests-0.2,0.6),w:3})});
      rd_tag(x,tt,w("back","temples",-0.2),c.pests-0.3,960,240,"The temples set the planting again",{col:LP.blue,align:"center"});
      rd_pill(x,tt,w("pests","control",-0.3),c.report-0.3,960,250,"Pests under control, less spraying",{col:LP.green});
      rd_sheet(x,tt,w("report","report",-0.3),110,90,820,{kick:"The bank's final report",title:"“No post-evaluated project of the Bank exhibits self-sustained and high performance comparable to Bali.”"},
        {light:null,pin:false,out:c.unesco-0.3});
      rd_sheet(x,tt,w("unesco","twenty",-0.4),1140,100,660,{kick:"2012",title:"World Heritage",lines:["UNESCO lists the subak landscape"]},{col:LP.green,light:null,pin:false});}},
    // a data team: every decision taken in one place; then given back
    {at:c.data-0.3,place:"lpRoom",keys:[[c.data-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      rd_hub(x,960,480,{u:ag_in(tt,c.data+0.2,2.0),flip:ag_in(tt,w("film","back",-0.3),1.4),a:1-ag_in(tt,c.breath+0.2,0.8),centre:"The data team"});}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"Rules that let people decide","A few clear rules, good tools, and trust","Leading data people · Leading a data team");
});

/* ---------------------------------------------------------------- 2. Every question, one door */
scene("door",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},gy={light:"grey"};
  ag_shots(ctx,S,t,sc.dur,[
    // the university: its teaching building cut open, rooms lit and dark
    {at:0,place:"lpSky",keys:[[0,960,520,1.04],[1.0,960,540,1.0]],d:4,draw:(x,tt)=>{
      lp_section(x,LP_TEACHING,{room:(id,b)=>({lit:((id.charCodeAt(0)*7+id.charCodeAt(2)*3)%5)<3?0.9:0.1})});
      rd_sheet(x,tt,w("univ","September",-0.3),1240,160,560,{kick:"A year from now",title:"September 2027"},{light:null,pin:false,out:c.council-0.3});
      rd_sheet(x,tt,w("council","Council",-0.3),1180,160,620,{kick:"The University Council, June",title:"A new timetable from February",lines:["Fewer classes at peak hours","A new building put off"]},
        {col:LP.blue,light:null,pin:false,u:rd_u(tt,[w("council","fewer",-0.1),w("council","put",-0.1)])});}},
    // the four faculties' timetable officers
    {at:c.officers-0.3,place:"rdFaculty",keys:[[c.officers-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const o0=w("officers","officer",-0.4);
      [["arts",330],["business",750],["lucy",1170],["health",1590]].forEach(([who,px],i)=>{const a=ag_in(tt,c.officers+i*0.25,0.6);lp_person(x,RD_PEOPLE[who],px,740,0.74,{t:tt,flip:i>1,a,light:gy});
        rd_tag(x,tt,o0+i*0.2,null,px,420,RD_FAC[i],{align:"center",col:LP.ink});});
      rd_sheet(x,tt,o0+1.0,660,110,600,{kick:"Four timetable officers",title:"Each plans a faculty's classes"},{light:"grey",out:c.product-0.3});}},
    // Teaching space use, the one data product, and its owner
    {at:c.product-0.3,place:"lpRoom",keys:[[c.product-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const p0=w("product","Teaching",-0.3);
      lp_person(x,"ivy",420,660,1.0,{t:tt,light:dy});
      rd_sheet(x,tt,p0,860,150,760,{kick:"One data product",title:"Teaching space use",lines:["Every room's bookings and head counts, by the hour","Owner: Ivy Reyes"]},{col:LP.orange,light:"day",u:ag_in(tt,p0+0.5,1.2)});}},
    // every question to the team's one front door; 27 room reports; each a day and a half to make, two weeks waiting
    {at:c.only-0.3,place:"lpRoom",later:true,keys:[[c.only-0.3,960,540,1.0]],draw:(x,tt)=>{const q0=w("only","question",-0.3);
      lp_door(x,1380,250,260,560,{open:0.15});lp_tag(x,1510,210,"The team's front door",{align:"center",col:LP.mut});
      rd_queue(x,tt,{t0:q0,n:9,gap:0.42,door:[1380,620]});
      if(tt>=w("asked","twenty",-0.4)){const t0=w("asked","twenty",-0.4);lp_figure(x,140,170,420,{kick:"July to September",num:"27",label:"room reports asked for"},{col:LP.amber,a:ag_in(tt,t0,0.35)*(1-ag_in(tt,c.helena-0.3,0.4)),k:tt-t0});}
      rd_pill(x,tt,w("wait","day",-0.3),c.helena-0.3,860,170,"About 1.5 days to make each",{col:LP.amber});
      rd_pill(x,tt,w("wait","weeks",-0.3),c.helena-0.3,860,260,"About 2 weeks waiting in the list",{col:LP.amber,icon:"wait"});}},
    // Helena: whose rooms come first
    {at:c.helena-0.3,place:"lpRoom",later:true,keys:[[c.helena-0.3,960,540,1.0]],draw:(x,tt)=>{const c0=w("helena","asked",-0.3);
      lp_person(x,"helena",960,660,1.0,{t:tt,light:dy});lp_nameTag(x,960,180,"helena",{align:"center",a:ag_io(tt,c.helena+0.2,c0,0.4)});
      for(const [i,px,tl] of [[0,420,-4],[3,1500,4]]){const a=ag_in(tt,c0+i*0.1,0.4);if(a<=0.004)continue;x.save();x.globalAlpha*=a;lp_sheet(x,px-110,290,220,150,{col:LP.amber,light:"day",tilt:tl});
        lp_T(x,RD_FAC[i],px,378,{w:700,size:28,align:"center"});x.restore();}
      rd_tag(x,tt,w("helena","chose",-0.2),c.centre-0.3,960,190,"Whose rooms first?",{col:LP.amber,align:"center"});}},
    // every room decision through one team, and through her; then given back
    {at:c.centre-0.3,place:"lpRoom",later:true,keys:[[c.centre-0.3,960,540,1.0]],draw:(x,tt)=>{const f0=w("decide","stop",-0.3);
      rd_hub(x,960,470,{u:ag_in(tt,c.centre,1.6),flip:ag_in(tt,f0,1.4),centre:"The data team, and Helena"});
      rd_tag(x,tt,w("knew","courses",-0.3),f0,960,830,"Who knows the courses waits for who knows the data",{col:LP.amber,align:"center"});
      rd_pill(x,tt,w("decide","themselves",-0.4),null,960,830,"The faculties read the data themselves",{col:LP.blue});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.6,c.officers,0.5)});
  rd_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Three rules, each with its reason */
scene("rules",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const drawer=[1690,640];
  ag_shots(ctx,S,t,sc.dur,[
    // Yusuf's first list: eleven, each guarding against something; three needed now, eight in the drawer
    {at:0,place:"rdMorning",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const e0=w("eleven","eleven",-0.4),k0=w("three","Three",-0.2),d0=w("drawer","drawer",-0.6),r0=c.r1-0.2;
      const yu=1-ag_in(tt,r0,0.6);if(yu>0.004){lp_person(x,"yusuf",250,660,1.0,{t:tt,a:yu,light:mo});}
      lp_nameTag(x,250,190,"yusuf",{align:"center",a:ag_io(tt,0.6,e0,0.4)});
      rd_eleven(x,{u:ag_in(tt,e0,1.6),keep:ag_in(tt,k0,0.8),drop:ag_in(tt,d0,1.6),light:"morning",out:ag_in(tt,c.ostrom-0.6,0.5),drawer});
      rd_drawer(x,drawer[0]-130,drawer[1],260,{a:ag_in(tt,d0-0.6,0.5)*(1-ag_in(tt,c.ostrom-0.6,0.5)),h:130});
      rd_tag(x,tt,w("drawer","drawer",0.4),c.ostrom-0.6,drawer[0],drawer[1]-46,"Not now",{col:LP.mut,align:"center"});
      rd_sheet(x,tt,w("yusuf","drafted",-0.3),560,420,760,{kick:"A first draft",title:"Rules for letting the faculties in"},{light:"morning",out:e0-0.3});
      rd_tag(x,tt,w("ask","asked",-0.3),r0,1100,330,"What goes wrong here, now, without it?",{col:LP.blue,align:"center"});
      // the three, each with what it says and why
      const RX=[100,570,1040];[c.r1,c.r2,c.r3].forEach((t0,i)=>{const a=ag_in(tt,t0-0.1,0.35)*(1-ag_in(tt,c.ostrom-0.6,0.5));if(a<=0.004)return;
        rd_rule(x,RX[i],345,440,["one","two","three"][i],RD_RULES[i],{light:"morning",a,k:tt-t0+0.1,u:ag_in(tt,t0+0.8,1.4)});});}},
    // Elinor Ostrom: the commons that lasted
    {at:c.ostrom-0.3,place:"rdMorning",later:true,keys:[[c.ostrom-0.3,960,540,1.0]],draw:(x,tt)=>{const l0=w("lasted","lasted",-0.3);
      rd_sheet(x,tt,c.ostrom+0.2,150,280,760,{kick:"Elinor Ostrom",title:"Governing the Commons, 1990",lines:["Fishing grounds, forests and irrigation, shared for centuries"]},{light:"morning",u:ag_in(tt,w("ostrom","fishing",-0.1),0.8)});
      rd_sheet(x,tt,l0,1010,280,760,{kick:"The ones that lasted",lines:["A few clear rules","Fitted to the place","Made and changed by the people who live by them"]},
        {col:LP.blue,light:"morning",u:rd_u(tt,[w("lasted","few",-0.1),w("lasted","fitted",-0.1),w("lasted","made",-0.1)])});}},
    // Helena agrees the three with the four officers
    {at:c.with-0.3,place:"rdFaculty",keys:[[c.with-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const g={light:"grey"},a0=w("with","agreed",-0.2);
      const cut=lp_table(x,180,800,1560,{a:0});
      [["arts",330],["business",640],["helena",960],["lucy",1280],["health",1590]].forEach(([who,px],i)=>lp_person(x,typeof who==="string"&&RD_PEOPLE[who]?RD_PEOPLE[who]:who,px,650,0.78,{t:tt,flip:px>960,cut,light:g}));
      lp_table(x,180,800,1560);
      rd_pill(x,tt,a0+0.4,null,960,180,"Agreed with the four officers",{col:LP.green,icon:"tick"});
      rd_tag(x,tt,w("with","change",-0.3),null,960,280,"Any of them can ask to change one",{col:LP.blue,align:"center"});}}
  ]);
  rd_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. The right way, the easy way */
scene("tools",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},gy={light:"grey"};
  const scr=(x,tt,o)=>lp_screen(x,330,170,1260,670,{draw:(cx,X,Y,Wd,Hd)=>rd_template(cx,X,Y,Wd,Hd,o)});
  ag_shots(ctx,S,t,sc.dur,[
    // rules say what's right; tools make it easy: the template
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const t0=w("template","template",-0.3),r0=w("easy","Rules",-0.2),k0=w("easy","Tools",-0.2),go=1-ag_in(tt,t0,0.4);
      // the three rules, as cards; a tool, as the template's picture on a screen
      if(go>0.004){x.save();x.globalAlpha*=go;[0,1,2].forEach(i=>rd_card(x,410+i*165,390,{blue:true,s:0.9,tilt:(i-1)*2,light:"day",a:ag_in(tt,r0+i*0.15,0.4)}));
        rd_tag(x,tt,r0,null,640,320,"Rules say what's right",{col:LP.blue,align:"center"});
        const ka=ag_in(tt,k0,0.5);if(ka>0.004){x.save();x.globalAlpha*=ka;lp_screen(x,1060,390,440,250,{draw:(cx,X,Y,Wd,Hd)=>rd_mini(cx,X,Y,Wd,Hd)});x.restore();}
        rd_tag(x,tt,k0,null,1280,320,"Tools make it easy",{col:LP.orange,align:"center"});x.restore();}
      if(tt>=t0+0.4){x.save();x.globalAlpha*=ag_in(tt,t0+0.4,0.5);scr(x,tt,{u:ag_in(tt,w("template","booked",-0.3),1.6),use:ag_in(tt,w("template","agreed",-0.4),0.6)});x.restore();}
      if(tt>=t0)lp_person(x,"ivy",170,690,0.9,{t:tt,a:ag_in(tt,t0+0.2,0.6),light:dy});
      if(tt>=t0)lp_person(x,"jun",1760,690,0.9,{t:tt,flip:true,a:ag_in(tt,t0+0.4,0.6),light:dy});}},
    // an officer copies it: an afternoon, not two weeks
    {at:c.copy-0.3,place:"rdFaculty",keys:[[c.copy-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      const cut=lp_table(x,520,790,880,{a:0});lp_person(x,RD_PEOPLE.business,960,640,0.9,{t:tt,cut,light:gy});lp_table(x,520,790,880);lp_laptop(x,960,768,300,{glow:0.7});
      rd_pill(x,tt,w("copy","afternoon",-0.3),null,700,190,"An afternoon",{col:LP.green,icon:"tick"});
      rd_pill(x,tt,w("copy","weeks",-0.3),null,1240,190,"Not two weeks",{col:LP.amber,icon:"cross"});}},
    // Anil, Health's data partner, with its officer
    {at:c.anil-0.3,place:"rdFaculty",later:true,keys:[[c.anil-0.3,960,540,1.0]],draw:(x,tt)=>{
      const cut=lp_table(x,420,790,1080,{a:0});lp_person(x,"anil",760,640,0.9,{t:tt,cut,light:gy});lp_person(x,RD_PEOPLE.health,1180,640,0.9,{t:tt,flip:true,cut,light:gy});
      lp_table(x,420,790,1080);lp_laptop(x,970,768,280,{glow:0.6});
      lp_nameTag(x,760,190,{name:"Anil Kurian",role:"Data partner, Health"},{align:"center",a:ag_in(tt,w("anil","Anil",-0.2),0.4)});
      rd_tag(x,tt,w("anil","officer",-0.3),null,1180,190,"Health's timetable officer",{col:LP.ink,align:"center"});}},
    // who decides what, in a box beside the numbers
    {at:c.who-0.3,place:"lpRoom",keys:[[c.who-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      scr(x,tt,{u:1,use:1,who:ag_in(tt,w("who","box",-0.3),0.5),whoU:rd_u(tt,[w("whos","faculties",-0.2),w("whos","Ivy",-0.2),w("keeps","team",-0.2),w("keeps","registrar's",-0.2)])});}},
    // data mesh and Team Topologies
    {at:c.mesh-0.3,place:"lpRoom",later:true,keys:[[c.mesh-0.3,960,540,1.0]],draw:(x,tt)=>{
      rd_sheet(x,tt,w("mesh","mesh",-0.3),160,150,720,{kick:"Data mesh",title:"Zhamak Dehghani, 2022",lines:["Each domain owns its data, on a self-serve platform"]},{light:"day",u:ag_in(tt,w("mesh","decisions",-0.2),0.6)});
      rd_sheet(x,tt,w("mesh","Topologies",-0.3),1040,150,720,{kick:"Team Topologies",title:"Matthew Skelton and Manuel Pais, 2019",lines:["A platform that takes the hard parts off the teams who use it"]},{light:"day",u:ag_in(tt,w("mesh","platform",-0.2),0.6)});}},
    // Monday 4 October: each faculty on its own copy of the template; no more room reports by hand
    {at:c.start-0.3,place:"lpRoom",later:true,keys:[[c.start-0.3,960,540,1.0]],draw:(x,tt)=>{
      RD_FAC.forEach((f,i)=>{const t0=c.start+0.3+i*0.25,a=ag_in(tt,t0,0.5);if(a<=0.004)return;x.save();x.globalAlpha*=a;
        lp_screen(x,150+i*420,400,360,210,{draw:(cx,X,Y,Wd,Hd)=>rd_mini(cx,X,Y,Wd,Hd,31+i*13)});x.restore();rd_tag(x,tt,t0+0.2,null,330+i*420,680,f,{col:LP.ink,align:"center"});});
      rd_pill(x,tt,w("start","stopped",-0.4),null,960,260,"Monday 4 October: room reports by hand stop",{col:LP.green,icon:"tick"});}}
  ]);
  rd_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Labs on a Monday */
scene("labs",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},dy={light:"day"};
  const lab=(x,tt,o)=>lp_screen(x,560,250,1200,590,{draw:(cx,X,Y,Wd,Hd)=>rd_labs(cx,X,Y,Wd,Hd,o)});
  const labO=tt=>({u:ag_in(tt,w("labs","labs",-0.2),1.6),counts:ag_in(tt,w("side","counts",-0.4),1.0),mon:ag_in(tt,w("empty","nobody",-0.4),0.6),freed:ag_in(tt,w("freed","released",-0.2),1.2)});
  ag_shots(ctx,S,t,sc.dur,[
    // Lucy, Engineering's timetable officer, and her page
    {at:0,place:"rdEng",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const s0=w("labs","labs",-0.3);
      lp_person(x,RD_PEOPLE.lucy,300,660,1.0,{t:tt,light:mo});lp_nameTag(x,300,190,RD_PEOPLE.lucy,{align:"center",a:ag_io(tt,0.8,c.side,0.4)});
      if(tt>=s0-0.4){x.save();x.globalAlpha*=ag_in(tt,s0-0.4,0.5);lab(x,tt,labO(tt));x.restore();}
      // one at a time, over the screen
      rd_tag(x,tt,w("labs","never",-0.3),c.side-0.3,1160,185,"Never in the university's room reports",{col:LP.amber,align:"center"});
      rd_pill(x,tt,w("empty","nobody",0.1),w("nobody","report",-0.7),1160,185,"Booked, and nobody there",{col:LP.amber,icon:"wait"});
      rd_tag(x,tt,w("nobody","report",-0.3),c.why-0.3,1160,185,"No report had put the two side by side",{col:LP.mut,align:"center"});}},
    // what Lucy knew, and who she asked
    {at:c.why-0.3,place:"rdEng",later:true,keys:[[c.why-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=w("rule3","measure",-0.3),g0=w("gloss","glossary",-0.3);
      lp_person(x,RD_PEOPLE.lucy,300,660,1.0,{t:tt,light:mo});
      rd_sheet(x,tt,c.why+0.3,640,140,760,{kick:"What Lucy knew",lines:["Two first-year courses moved their lab classes to Thursdays","Their Monday bookings rolled over every year"]},
        {light:"morning",out:r0-0.3,u:rd_u(tt,[w("why","courses",-0.2),w("why","rolled",-0.3)])});
      if(tt>=r0-0.6)lp_person(x,"ivy",1640,660,1.0,{t:tt,flip:true,a:ag_in(tt,r0-0.6,0.7),light:mo});
      rd_rule(x,600,140,620,"three",RD_RULES[2],{light:"morning",a:ag_in(tt,r0+0.2,0.35)*(1-ag_in(tt,g0-0.4,0.4)),k:tt-r0-0.2});
      rd_sheet(x,tt,g0+0.1,600,140,720,{kick:"The glossary",title:"Lab use",lines:["The share of a lab's hours with someone counted"]},{col:LP.blue,light:"morning"});
      rd_pill(x,tt,w("gloss","product",-0.3),null,960,560,"In Teaching space use, for every faculty",{col:LP.orange});}},
    // the nine Monday mornings released; two new labs on hold
    {at:c.freed-0.3,place:"rdEng",later:true,keys:[[c.freed-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,RD_PEOPLE.lucy,300,660,1.0,{t:tt,light:mo});lab(x,tt,Object.assign(labO(tt),{u:1,counts:1,mon:1}));
      rd_pill(x,tt,w("freed","released",0.2),null,870,185,"Nine Monday mornings released",{col:LP.green,icon:"tick"});
      rd_pill(x,tt,w("freed","hold",-0.3),null,1460,185,"Two new labs: request on hold",{col:LP.green});}},
    // copied from faculty to faculty, with no instruction sent
    {at:c.then-0.3,place:"lpRoom",keys:[[c.then-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const h0=w("spread","Health",-0.3),a0=w("spread","Arts",-0.3);
      rd_spread(x,{u:ag_in(tt,c.then,1.2),lucy:ag_in(tt,c.then+0.6,0.6),copies:[ag_in(tt,h0,1.4),ag_in(tt,a0,1.4)],labels:[ag_in(tt,h0+1.2,0.4),ag_in(tt,a0+1.2,0.4)],light:"day"});
      rd_tag(x,tt,w("nobodysent","instruction",-0.4),null,960,880-30,"No instruction sent",{col:LP.mut,align:"center"});}},
    // the model again: each subak copies its best neighbour, and the temples' pattern appears
    {at:c.model-0.3,place:"rdModel",keys:[[c.model-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const y0=w("model","Each",-0.2),y1=w("emerge","appeared",0.2);
      const yr=clamp((tt-y0)/(y1-y0),0,1)*10;rd_cells(x,yr,{a:ag_in(tt,c.model,0.8)});
      rd_sheet(x,tt,c.model+0.2,1320,110,520,{kick:"The model, again",title:"One simple rule",lines:["Each year, copy the best harvest of your four neighbours"]},{light:null,pin:false,u:ag_in(tt,y0,0.6)});
      if(tt>=y0){const a=ag_in(tt,y0,0.4),H=RD_YEARS.harv,n=Math.min(H.length-1,Math.floor(yr)),fr=yr-n;lp_sheet(x,1320,500,520,330,{light:null,pin:false,a});
        x.save();x.globalAlpha*=a;lp_T(x,"HARVEST, YEAR BY YEAR",1356,560,{w:800,size:28,ls:3,col:LP.mut});const px=i=>1360+i*44,py=v=>800-(v-5)/2.8*200;
        x.strokeStyle=rgba(LP.green,1);x.lineWidth=6;x.lineCap="round";x.lineJoin="round";x.beginPath();for(let i=0;i<=n;i++){i?x.lineTo(px(i),py(H[i])):x.moveTo(px(i),py(H[i]));}
        if(n<H.length-1)x.lineTo(lerp(px(n),px(n+1),fr),lerp(py(H[n]),py(H[n+1]),fr));x.stroke();x.restore();}
      rd_tag(x,tt,c.model+0.6,w("emerge","temple",-0.7),690,100,"Each colour: one planting calendar",{col:LP.mut,align:"center"});
      rd_tag(x,tt,w("emerge","temple",-0.3),null,690,100,"Groups planting together, much like the temples'",{col:LP.blue,align:"center"});}}
  ]);
  // the film's title steps aside while the model from Bali fills the screen again, as it did in Bali
  rd_kick(ctx,S,1-ag_in(t,c.model-0.3,0.6));
});

/* ---------------------------------------------------------------- 6. Watch what emerges */
scene("watch",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"};
  const scr=(x,tt,o)=>lp_screen(x,330,170,1260,670,{draw:(cx,X,Y,Wd,Hd)=>rd_template(cx,X,Y,Wd,Hd,o)});
  ag_shots(ctx,S,t,sc.dur,[
    // four plans sent; one peak class in six moved; no room reports by hand
    {at:0,place:"rdLate",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const p0=w("plans","four",-0.3),n0=w("none","reports",-0.4);
      rd_sheet(x,tt,0.6,140,230,560,{kick:"Friday 26 November",title:"Plans for February, sent"},{light:"late",out:n0-0.3});
      RD_FAC.forEach((f,i)=>{const t0=p0+i*0.3,a=ag_in(tt,t0,0.35)*(1-ag_in(tt,n0-0.3,0.4));if(a<=0.004)return;x.save();x.globalAlpha*=a;
        lp_sheet(x,780+i*270,230,230,170,{light:"late",tilt:(i%2?2:-2)});lp_T(x,f,895+i*270,330,{w:700,size:28,align:"center"});x.restore();
        lp_pill(x,895+i*270,430,"Sent",{col:LP.green,icon:"tick",a:a*ag_in(tt,t0+0.2,0.35),k:tt-t0-0.2});});
      rd_pill(x,tt,w("moved","six",-0.3),n0-0.3,960,600,"One peak class in six moved",{col:LP.green});
      // once the plans have gone: 27 room reports by hand before, none since
      const f0=n0+0.3;if(tt>=f0){const a=ag_in(tt,f0,0.35);lp_figure(x,300,200,520,{kick:"July to September",num:"27",label:"room reports by hand"},{col:LP.amber,light:"late",a,k:tt-f0});
        lp_figure(x,1100,200,520,{kick:"October and November",num:"0",label:"room reports by hand"},{col:LP.green,light:"late",a:ag_in(tt,f0+0.4,0.35),k:tt-f0-0.4});}
      rd_pill(x,tt,w("none","roadmap",-0.3),null,960,620,"The time went back to the roadmap",{col:LP.blue});}},
    // Helena: less deciding, more watching
    {at:c.role-0.3,place:"rdLate",later:true,keys:[[c.role-0.3,960,540,1.0]],draw:(x,tt)=>{
      // Helena in front of the board, watching what the faculties made
      rd_spread(x,{u:1,lucy:1,copies:[1,1],labels:[1,1],light:"late"});lp_person(x,"helena",210,660,0.95,{t:tt,light:lt});
      rd_tag(x,tt,w("role","watching",-0.3),null,960,880-30,"Less deciding, more watching what emerges",{col:LP.blue,align:"center"});}},
    // a real problem: an old copy; the fourth rule out of the drawer; the date in the corner
    {at:c.problem-0.3,place:"rdLate",later:true,keys:[[c.problem-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=w("rule4","drawer",-0.4),d0=c.date-0.3;
      const cp=1-ag_in(tt,r0,0.4);if(cp>0.004&&tt>=c.problem){const a=ag_in(tt,c.problem,0.35)*cp;lp_sheet(x,640,160,640,440,{light:"late",tilt:-2,a,k:tt-c.problem});
        x.save();x.globalAlpha*=a;lp_T(x,"Health's page, a copy",700,240,{w:800,size:32});lp_T(x,"Saved Monday 1 November",700,290,{w:600,size:28,col:LP.mut});
        x.fillStyle=rgba(LP.orange,0.45);for(let r=0;r<5;r++)for(let k=0;k<8;k++)if((r*3+k)%4)x.fillRect(700+k*62,330+r*44,48,30);x.restore();
        rd_pill(x,tt,w("problem","weeks",-0.3),r0,960,640,"Three weeks old",{col:LP.amber,icon:"wait"});}
      rd_drawer(x,1580,700,240,{a:ag_in(tt,r0-0.6,0.4)*(1-ag_in(tt,d0,0.4)),open:ag_in(tt,r0,0.6),h:130});
      if(tt>=r0+0.2){const u=ag_sine(ag_in(tt,r0+0.2,1.0)),a=ag_in(tt,r0+0.2,0.3)*(1-ag_in(tt,d0,0.4));
        rd_rule(x,lerp(1460,640,u),lerp(700,160,u),640,"four",RD_RULES[3],{light:"late",a,u:ag_in(tt,w("rule4","copies",-0.2),0.6)});}
      if(tt>=d0+0.4){x.save();x.globalAlpha*=ag_in(tt,d0+0.4,0.5);scr(x,tt,{u:1,use:1,who:1,date:ag_in(tt,w("date","date",-0.3),0.6)});x.restore();}}},
    // four rules, each with its reason
    {at:c.four-0.3,place:"rdLate",later:true,keys:[[c.four-0.3,960,540,1.0]],draw:(x,tt)=>{
      RD_RULES.forEach((r,i)=>rd_rule(x,70+i*455,280,430,["one","two","three","four"][i],{title:r.title,why:r.why},{light:"late",a:ag_in(tt,c.four+i*0.25,0.35),k:tt-c.four-i*0.25}));}}
  ]);
  rd_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},e0=c.breath+0.6;
  const syncSt=(f,tt)=>({kind:"young",u:1});
  ag_shots(ctx,S,t,sc.dur,[
    // back to Bali: each subak's own work, timed together
    {at:0,place:"rdTerraces",keys:[[0,960,560,1.05],[1.0,960,540,1.0]],d:5,draw:(x,tt)=>{
      rd_terraces(x,tt,{st:syncSt,flow:1,edge:f=>({col:LP.blue,a:0.65*ag_io(tt,w("bali","calendar",-0.3)+f.subak*0.4,c.uni-0.3,0.5),w:3})});
      rd_pill(x,tt,w("bali","held",-0.3),c.uni-0.3,960,250,"The harvests held",{col:LP.green});}},
    // the university: four officers, a few rules, a pattern no one had looked for
    {at:c.uni-0.3,place:"lpRoom",keys:[[c.uni-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      rd_spread(x,{u:1,lucy:1,copies:[1,1],labels:[1,1],light:"day",a:1});}},
    // what to do on Monday
    {at:c.m1-0.3,place:"rdMorning",keys:[[c.m1-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const g=1-ag_in(tt,e0-0.4,0.6);if(g<=0.004)return;x.save();x.globalAlpha*=g;
      rd_sheet(x,tt,c.m1+0.2,120,150,520,{kick:"One",title:"Write few rules, each with its reason"},{light:"morning"});
      rd_sheet(x,tt,w("m2","right",-0.3),700,150,520,{kick:"Two",title:"Make the right way the easy way"},{light:"morning"});
      rd_sheet(x,tt,w("m3","decides",-0.3),1280,150,520,{kick:"Three",title:"Say who decides what"},{light:"morning"});
      rd_sheet(x,tt,w("m4","emerges",-0.3),400,480,520,{kick:"Four",title:"Watch what emerges, and learn from it"},{light:"morning"});
      rd_sheet(x,tt,w("m5","rule",-0.3),1000,480,520,{kick:"Five",title:"Add a rule only when a real problem shows"},{light:"morning"});x.restore();}}
  ]);
  lp_end(ctx,S,t,e0,"Rules that let people decide",RD_LAST,"Film 4 of 4","Leading a data team");
  rd_kick(ctx,S,1-ag_in(t,e0,0.8));
});
