/* ===== Many hats, one picture: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const MH_LAST="Grow people who go deep in one thing and see the whole.";
// the film's number and title at the top left, from the second chapter on
function mh_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"1","Many hats, one picture",{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function mh_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const mh_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function mh_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a green tick in a disc, springing in from t0
function mh_tick(ctx,t,t0,x,y){if(t<t0)return;const f=lerp(0.6,1,ag_spr(t-t0,0,0.5));ctx.save();ctx.globalAlpha*=ag_in(t,t0,0.3);ctx.fillStyle=rgba(LP.green,1);
  ctx.beginPath();ctx.arc(x,y,22*f,0,TAU);ctx.fill();lp_icon(ctx,"tick",x,y,30*f,[255,255,255]);ctx.restore();}

/* ---------------------------------------------------------------- 1. One move, three jobs: Kaifeng, 1015 */
scene("trench",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),out={light:"day",wall:0};
  // the burned halls, still smoking the next day: drawn the same in both shots of the court that show it
  const smoking=(x,tt)=>{for(const [hx,s] of [[612,0.2],[902,0.7],[1180,1.3],[1520,1.9]])mh_smoke(x,hx,MH_COURT.ground-70,tt+s*4,0.85,{n:7,h:440,sp:20,r:42,col:[92,86,88],drift:110});};
  const fire0=w("fire","spreads",-0.3),cartsT=w("cost","carts",-0.2),planT=w("plan","makes",-0.1),flt0=w("boats","float",-0.4),gateT=w("boats","gate",0.2);
  // the street: the trench dug, the earth heaped, the bank broken, the water let in; the raft waiting in the canal, then the raft and the
  // boat floating up to the gate
  const street=tt=>({dig:0.5*ag_in(tt,w("dig","dug",-0.1),1.6)+0.5*ag_in(tt,w("dig","trenches",-0.3),1.6),heaps:ag_in(tt,w("dig","dug",0.4),1.6),
    bank:ag_in(tt,w("canal","breaks",0.1),1.2),water:ag_in(tt,w("canal","lets",-0.2),2.8),
    boats:[{x:lerp(290,1430,ag_sine((tt-flt0)/(gateT-flt0))),kind:"raft"},{x:lerp(-40,1120,ag_sine((tt-flt0-0.4)/(gateT+0.2-flt0))),kind:"boat"}]});
  ag_shots(ctx,S,t,sc.dur,[
    // Kaifeng, by day
    {at:0,place:"mhCourt",keys:[[0,1000,540,1.08],[c.when+0.4,940,540,1.0]],d:3,draw:(x,tt)=>{
      mh_sheet(x,tt,w("when","year",-0.2),150,120,540,{kick:"Kaifeng, China",title:"The year 1015",sub:"Capital of the Song dynasty"},{light:null,pin:false,out:c.fire-0.6});}},
    // the fire, that night
    {at:c.fire-0.3,place:"mhCourtFire",keys:[[c.fire-0.3,940,540,1.0]],dis:1.6,draw:(x,tt)=>{mh_fire(x,tt,0.25+0.75*ag_in(tt,fire0,2.6),1);}},
    // the next day: what burned
    {at:c.burns-0.3,place:"mhCourtBurned",keys:[[c.burns-0.3,960,540,1.0]],dis:1.6,draw:(x,tt)=>{smoking(x,tt);
      // what burned, as the Song history lists it, one ruin each, in the order the voice names them
      for(const [word,hx,hy,text] of [["gates",612,500,"Two gates"],["hall",902,470,"A great hall"],["treasury",1180,470,"A treasury"],["library",1520,440,"The imperial library"]])
        mh_tag(x,tt,w("burns",word,0.1),c.ding-0.4,hx,hy,text,{align:"center"});}},
    // Ding Wei, put in charge of the repairs
    {at:c.ding-0.3,place:"mhCourtBurned",keys:[[c.ding-0.3,960,540,1.0]],draw:(x,tt)=>{smoking(x,tt);
      mh_sheet(x,tt,w("ding","Ding",-0.1),600,130,600,{kick:"A senior minister",title:"Ding Wei",lines:["Ran the state's finances","Ran the building of a palace"]},
        {light:null,pin:false,u:mh_u(tt,[w("ding","finances",-0.1),w("ding","building",-0.1)])});
      mh_tag(x,tt,w("ding","charge",-0.1),null,600,476,"In charge of the repairs",{col:LP.ink});
      lp_person(x,MH_PEOPLE.ding,330,650,1.0,{t:tt,light:out});}},
    // the three jobs, across the city, and the one line of Ding Wei's plan
    {at:c.jobs-0.3,place:"mhPlan",keys:[[c.jobs-0.3,960,540,1.0]],draw:(x,tt)=>{const P=MH_PLAN,ra=(1-0.45*ag_in(tt,c.change,0.6))*(1-ag_in(tt,planT,0.8));
      mh_route(x,P.earth,ag_in(tt,w("earth","dug",0.1),1.6),{a:ra});mh_route(x,P.timber,ag_in(tt,w("timber","hauled",0.1),1.6),{a:ra});mh_route(x,P.rubble,ag_in(tt,w("rubble","carted",0.1),1.6),{a:ra});
      mh_carts(x,P.earth,tt,cartsT,{load:"earth",a:ra,sp:0.1});mh_carts(x,P.timber,tt,cartsT+0.6,{load:"timber",a:ra,sp:0.11});mh_carts(x,P.rubble,tt,cartsT+1.2,{load:"rubble",a:ra,sp:0.1});
      mh_tag(x,tt,w("earth","dug",0.3),planT,60,736,"Earth, dug far away",{col:LP.amber});
      mh_tag(x,tt,w("timber","hauled",0.3),planT,60,262,"Timber, by water",{col:LP.amber});
      mh_tag(x,tt,w("rubble","carted",0.3),planT,1860,236,"Rubble, carted away",{col:LP.amber,align:"right"});
      mh_sheet(x,tt,c.cost-0.1,1160,480,480,{kick:"Rebuilding",title:"Three jobs",lines:["Slow for the palace","Costly for the state","In everyone's way"]},
        {col:LP.amber,light:null,pin:false,out:c.plan-0.2,u:mh_u(tt,[w("cost","slow",-0.1),w("cost","costly",-0.1),w("cost","way",-0.1)])});
      const pu=ag_sine(ag_in(tt,planT+0.2,1.4));if(pu>0){x.save();x.lineCap="round";x.strokeStyle="rgba(250,247,240,0.85)";x.lineWidth=28;x.beginPath();x.moveTo(960,592);x.lineTo(960,lerp(592,440,pu));x.stroke();
        x.strokeStyle=rgba(LP.blue,1);x.lineWidth=16;x.beginPath();x.moveTo(960,592);x.lineTo(960,lerp(592,440,pu));x.stroke();x.restore();}
      mh_tag(x,tt,planT+0.9,null,1000,520,"Ding Wei's plan",{col:LP.blue});}},
    // the street, cut open: the trenches dug, the canal let in, the raft and the boat at the gate
    {at:c.dig-0.3,place:"mhStreet",keys:[[c.dig-0.3,960,540,1.0],[c.canal-0.2,760,560,1.22],[w("canal","lets",0.8),960,540,1.0]],draw:(x,tt)=>{
      mh_street(x,tt,street(tt));
      mh_tag(x,tt,w("dig","dug",0.6),c.canal-0.4,900,480,"Earth to build with",{align:"center"});
      mh_tag(x,tt,w("canal","Bian",-0.1),c.boats-0.4,60,380,"The Bian canal");
      mh_tag(x,tt,w("boats","Rafts",-0.1),c.fill-0.4,1100,480,"Timber and stone, by water",{align:"center"});}},
    // the work done: the rubble in the trenches, the streets again, the halls rebuilt beyond the gate
    {at:c.fill-0.3,place:"mhStreetNew",keys:[[c.fill-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const s=street(tt),f0=c.fill-0.3,k0=w("saving","streets",-0.1);
      s.heaps=1-ag_in(tt,f0+0.3,1.4);s.drain=ag_in(tt,f0+0.2,1.6);s.boats=s.boats.map(b=>Object.assign(b,{a:1-ag_in(tt,f0+0.2,1.2)}));
      s.fill=ag_in(tt,w("fill","rubble",-0.2),1.6);s.street=ag_in(tt,w("fill","again",-0.1),1.2);s.bank=1-s.street;
      s.carts=[{x:lerp(-260,1260,clamp((tt-k0)/9,0,1)),dir:1,load:"timber",a:ag_in(tt,k0,0.5)},{x:lerp(2180,700,clamp((tt-k0-1.2)/9,0,1)),dir:-1,load:"earth",a:ag_in(tt,k0+1.2,0.5)}];
      mh_street(x,tt,s);
      mh_sheet(x,tt,c.shen+0.1,120,120,760,{title:"“One move, and three jobs done.”"},{light:null,pin:false,out:c.saving-0.4});
      mh_sheet(x,tt,w("shen","Shen",-0.2),1120,120,620,{kick:"Shen Kuo",title:"A scholar",sub:"Who told the story some 70 years later"},{light:null,pin:false,out:c.saving-0.4});
      mh_sheet(x,tt,w("saving","hundreds",-0.1),640,130,640,{kick:"The state's saving",title:"Hundreds of millions",sub:"In Shen Kuo's words"},{col:LP.green,light:null,pin:false});}},
    // the three crafts, each known well, and the one move that joined them
    {at:c.one-0.3,place:"mhCourt",keys:[[c.one-0.3,960,540,1.0]],draw:(x,tt)=>{const j=w("one","one",-0.2),ju=ag_sine(ag_in(tt,j,1.2));
      lp_person(x,MH_PEOPLE.digger,420,690,0.82,{t:tt,pose:"hold",holdBack:mh_spade,light:out});
      lp_person(x,MH_PEOPLE.boatman,960,690,0.82,{t:tt,pose:"hold",holdBack:mh_pole,light:out});
      lp_person(x,MH_PEOPLE.carter,1500,690,0.82,{t:tt,flip:true,pose:"hold",holdBack:mh_whip,light:out});
      if(ju>0){x.save();x.strokeStyle=rgba(LP.blue,1);x.lineWidth=6;x.lineCap="round";for(const tx of [420,960,1500]){x.beginPath();x.moveTo(tx,300);x.lineTo(lerp(tx,960,ju),lerp(300,206,ju));x.stroke();}x.restore();}
      lp_pill(x,960,176,"One move",{col:LP.blue,a:ag_in(tt,j+0.6,0.4),k:tt-j-0.6});
      mh_tag(x,tt,w("one","diggers",0.05),null,420,330,"The diggers",{align:"center"});
      mh_tag(x,tt,w("one","boatmen",0.05),null,960,330,"The boatmen",{align:"center"});
      mh_tag(x,tt,w("one","carters",0.05),null,1500,330,"The carters",{align:"center"});}},
    // a data team's parts, each known deeply, and whoever leads them seeing them as one picture
    {at:c.data-0.3,place:"lpRoom",keys:[[c.data-0.3,960,540,1.0]],push:0,draw:(x,tt)=>{const p0=w("data","parts",-0.2),d0=w("data","deeply",-0.2);
      mh_parts(x,{light:"day",a:1-ag_in(tt,c.breath+0.2,0.8),ks:MH_PARTS.map((_,i)=>tt-p0-i*0.3),stems:MH_PARTS.map((_,i)=>ag_in(tt,d0+i*0.12,1.0)),
        bar:ag_in(tt,w("see","parts",-0.1),2.2),gap:clamp(tt-w("see","between",0.1),0,1)});}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"Many hats, one picture","See the hats your team wears, and what falls between them","Leading data people · The new skills");
});

/* ---------------------------------------------------------------- 2. One question to follow */
scene("question",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const ivy=(x,tt)=>lp_person(x,"ivy",560,640,1.0,{t:tt,light:mo});
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      mh_sheet(x,tt,1.0,560,300,800,{kick:"Leading data people",title:"Data work now asks for new skills",lines:["And leading the people who do it is a skill too"]},
        {light:"day",u:ag_in(tt,w("promise","leading",-0.1),0.5)});}},
    // the university: its teaching building, cut open, a room lit for each practice
    {at:c.films-0.3,place:"lpSky",keys:[[c.films-0.3,960,540,1.0]],draw:(x,tt)=>{mh_building(x,tt,{t0:w("films","practice",-0.1),step:0.35});}},
    // Ivy's first day
    {at:c.ivy-0.3,place:"mhMorning",keys:[[c.ivy-0.3,960,540,1.0]],draw:(x,tt)=>{
      mh_sheet(x,tt,w("ivy","Ivy",-0.1),1000,170,640,{kick:"Monday 1 March 2027",title:"Ivy Reyes",sub:"Graduate data analyst",lines:["Her depth: statistics"]},
        {light:"morning",u:ag_in(tt,w("depth","statistics",-0.1),0.5)});
      ivy(x,tt);}},
    // Helena's two hats, two sides of one role (the author's advice, 10 November 2026), her team's many hats, and the month she gives Ivy
    {at:c.helena-0.3,place:"mhMorning",keys:[[c.helena-0.3,960,540,1.0]],draw:(x,tt)=>{
      mh_sheet(x,tt,c.helena+0.4,780,170,420,{kick:"The data manager",title:"Helena Novak",sub:"Two hats",lines:["Product owner, who thinks like an architect","People leader"]},
        {light:"morning",out:c.role-0.5,u:mh_u(tt,[w("helena","product",-0.1),w("helena","people",-0.1)])});
      const r0=w("role","managing",-0.2);if(tt>=r0)mh_sides(x,720,170,540,{t:tt,a:ag_in(tt,r0,0.35)*(1-ag_in(tt,c.hats-0.5,0.4)),k:tt-r0,light:"morning",
        left:[w("role","plans",-0.1),w("role","dates",-0.1),w("role","measures",-0.1)],right:w("role","people",-0.1),arrow:w("role","serve",-0.1)});
      mh_sheet(x,tt,c.hats+0.2,780,170,420,{kick:"Her team",title:"More than one hat each",lines:["A job title names only one"]},
        {light:"morning",out:c.month-0.5,u:ag_in(tt,w("hats","title",-0.1),0.5)});
      mh_sheet(x,tt,w("month","month",-0.1),780,170,420,{kick:"Ivy's first month",lines:["Learn every part of the team's work","Follow one real question through all of it"]},
        {col:LP.blue,light:"morning",u:mh_u(tt,[w("month","learn",-0.1),w("month","question",-0.1)])});
      ivy(x,tt);lp_person(x,"helena",1420,640,1.0,{t:tt,flip:true,light:mo});}},
    // Graham's question, agreed in writing
    {at:c.graham-0.3,place:"mhGraham",keys:[[c.graham-0.3,960,540,1.0]],draw:(x,tt)=>{
      mh_sheet(x,tt,w("graham","Graham",-0.1),1000,150,640,{kick:"Director of Facilities",title:"Graham Ellis",sub:"New this year"},{light:"grey",out:c.q-0.5});
      mh_sheet(x,tt,w("graham","Council",-0.2),1000,410,640,{kick:"For the University Council",title:"A new teaching building?"},{light:"grey",out:c.q-0.5});
      mh_sheet(x,tt,w("q","question",-0.1),1000,150,640,{kick:"Agreed in writing",title:"Too few rooms, or too few at some hours?"},{col:LP.blue,light:"grey"});
      lp_person(x,"graham",560,640,1.0,{t:tt,light:{light:"grey"}});}},
    // Ivy's first goals
    {at:c.goals-0.3,place:"mhMorning",keys:[[c.goals-0.3,960,540,1.0]],draw:(x,tt)=>{const g0=w("goals","writes",-0.1),a0=w("goals","agrees",-0.1);
      if(tt>=g0)mh_goals(x,880,150,760,{a:ag_in(tt,g0,0.35),k:tt-g0,u:ag_in(tt,g0+0.3,2.4),dim:ag_in(tt,w("first","first",-0.1),0.6),line:ag_in(tt,w("first","route",0.1),0.8),light:"morning"});
      lp_pill(x,1260,612,"Agreed with Helena",{col:LP.green,icon:"tick",a:ag_in(tt,a0,0.4),k:tt-a0});
      ivy(x,tt);}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("films","university",-0.3),c.helena,0.5)});
  mh_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. A few days with each */
scene("parts",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  const PX=[330,770,1210,1650],PS=[
    {who:"sam",line:"sam",word:"Sam",uw:"sensor",col:LP.orange,words:{kick:"Sam Okafor",title:"The platform",lines:["And the sensors' feed: people counted in each room, every hour"]}},
    {who:"yusuf",line:"yusuf",word:"Yusuf",uw:"rule",col:null,words:{kick:"Yusuf Demir",title:"Governance",lines:["His rule for that feed: counts, never people"]}},
    {who:"noor",line:"noor",word:"Noor",uw:"map",col:LP.blue,words:{kick:"Noor Rahman",title:"The map",lines:["Where data is born, and where it goes"]}},
    {who:"jun",line:"jun",word:"Jun",uw:"raw",col:LP.orange,words:{kick:"Jun Park",title:"The models",lines:["From raw data to tables people can trust","And he teaches"]}}];
  ag_shots(ctx,S,t,sc.dur,[
    // where the data is born: Mei's timetable
    {at:0,place:"mhRegistrar",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      lp_screen(x,600,160,720,480,{draw:(cx,X,Y,Wd,Hd)=>mh_timetable(cx,X,Y,Wd,Hd,{u:ag_in(tt,w("mei","timetable",0.1),2.2),more:ag_in(tt,w("mei","186",-0.1),0.6)})});
      lp_nameTag(x,96,250,"mei",{role:"The registrar's office",a:ag_in(tt,w("mei","Mei",-0.1),0.5)});
      mh_tag(x,tt,c.names+0.2,null,960,712,"She names the rooms, too",{align:"center",col:LP.ink});
      lp_person(x,"mei",330,640,0.95,{t:tt,light:dy});
      lp_person(x,"ivy",1600,640,0.95,{t:tt,flip:true,a:ag_in(tt,c.born,0.6),light:dy});}},
    // the others, one after another, the camera moving along their sheets
    {at:c.sam-0.3,place:"lpRoom",keys:[[c.sam-0.3,711,449,1.35],[c.yusuf-0.5,800,449,1.35],[c.noor-0.5,1209,449,1.35]],draw:(x,tt)=>{
      // Sam and his sheet go before the camera moves on to Noor, so nothing is left cut by the frame's edge
      const g=i=>i===0?1-ag_in(tt,c.noor-0.9,0.4):1;
      PS.forEach((p,i)=>mh_sheet(x,tt,w(p.line,p.word,-0.1),PX[i]-200,150,400,p.words,{col:p.col,light:"day",out:i===0?c.noor-0.9:null,u:ag_in(tt,w(p.line,p.uw,-0.1),0.5)}));
      mh_tick(x,tt,w("jun","trust",0),PX[3]+200-36,150+56);
      PS.forEach((p,i)=>lp_person(x,p.who,PX[i],720,0.75,{t:tt,flip:i>=2,a:ag_in(tt,w(p.line,p.word,-0.6),0.6)*g(i),light:dy}));}},
    // an hour a day beside Jun
    {at:c.pair-0.3,place:"lpRoom",later:true,keys:[[c.pair-0.3,1209,449,1.35],[c.pair+0.3,960,540,1.0]],draw:(x,tt)=>{
      mh_sheet(x,tt,c.pair+0.5,760,150,400,{kick:"Pairing",title:"An hour a day"},{light:"day"});
      lp_person(x,"jun",760,690,0.85,{t:tt,cut:794,light:dy});lp_person(x,"ivy",1160,690,0.85,{t:tt,flip:true,cut:794,light:dy});
      lp_table(x,460,800,1000);lp_laptop(x,960,768,220,{glow:0.6});}},
    // the films of their own
    {at:c.films-0.3,place:"lpRoom",later:true,keys:[[c.films-0.3,960,540,1.0]],draw:(x,tt)=>{
      mh_sheet(x,tt,w("films","moves",-0.2),380,220,520,{kick:"How data moves",title:"The Inner Life of Data",sub:"A film of its own"},{light:"day"});
      mh_sheet(x,tt,w("films","drawn",-0.2),1020,220,520,{kick:"How the map is drawn",title:"The map before the data",sub:"A film of its own"},{light:"day"});}},
    // each deep in one part, and right about it; Ivy enough of each; and one question for all of them
    {at:c.deep-0.3,place:"lpRoom",later:true,keys:[[c.deep-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=w("deep","deep",-0.1),r0=w("deep","right",-0.1),e0=w("learn","enough",-0.2);
      mh_parts(x,{light:"day",names:1,stemTop:MH_PY+MH_PH+72,stemBot:610,stems:MH_PARTS.map((_,i)=>ag_in(tt,s0+i*0.12,1.0)),ticks:MH_PARTS.map((_,i)=>clamp(tt-r0-i*0.1,0,1)),bar:ag_in(tt,e0,2.0)});
      mh_tag(x,tt,w("deep","hats",-0.1),c.learn-0.3,960,790,"More hats than their titles say",{align:"center",col:LP.ink});
      mh_tag(x,tt,e0+0.8,null,1850,108,"Ivy: enough of each",{align:"right",col:LP.ink});
      mh_tag(x,tt,w("learn","words",-0.1),c.ask-0.3,600,790,"Their words",{align:"center"});
      mh_tag(x,tt,w("learn","tools",-0.1),c.ask-0.3,960,790,"Their tools",{align:"center"});
      mh_tag(x,tt,w("learn","worries",-0.1),c.ask-0.3,1320,790,"What worries them",{align:"center"});
      mh_sheet(x,tt,w("ask","who",-0.1),560,650,800,{title:"Who uses this, and for which decision?"},{col:LP.blue,light:"day"});}}
  ]);
  mh_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. The whole route, on one page */
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"};
  const R0=[w("decision","decision",-0.1),w("question","question",-0.1),w("data","data",-0.1),w("born","born",-0.1),w("keeps","keeps",-0.1)];
  const m0=w("names","172",-0.2),b0=w("fourteen","14",0.1),d0=w("drop","drop",-0.2),s0=w("nobody","side",-0.2),j0=w("join","bookings",-0.1);
  ag_shots(ctx,S,t,sc.dur,[
    // Ivy's page, row by row, from Graham's decision
    {at:0,place:"mhLate",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const p0=w("draw","draws",-0.1);
      if(tt>=p0)mh_page(x,{a:ag_in(tt,p0,0.35),k:tt-p0,rows:R0.map(t0=>ag_in(tt,t0,1.2)),rule:ag_in(tt,w("keeps","rule",-0.1),0.6),hl:ag_in(tt,j0,0.8),dim:ag_in(tt,j0,0.8),light:"late"});
      lp_person(x,"ivy",330,650,1.0,{t:tt,a:ag_in(tt,c.draw-0.2,0.6),light:lt});}},
    // where the bookings meet the counts: the two lists of room names
    {at:c.names-0.3,place:"mhLate",later:true,keys:[[c.names-0.3,960,540,1.0]],draw:(x,tt)=>{const su=ag_in(tt,s0,1.4);
      mh_lists(x,{lx:lerp(280,520,su),rx:lerp(1200,960,su),match:ag_in(tt,m0,1.2),bad:ag_in(tt,b0,0.8),drop:ag_in(tt,d0,1.0),
        ticks:[clamp(tt-w("nobody","right",-0.1),0,1),clamp(tt-w("nobody","sensors",-0.1),0,1)],light:"late"});
      lp_pill(x,960,730,"172 rooms match",{col:LP.green,icon:"tick",a:ag_io(tt,m0+0.6,c.fourteen-0.3,0.4)});
      lp_pill(x,960,730,"14 renumbered",{col:LP.amber,a:ag_io(tt,w("fourteen","renumbered",-0.1),c.drop-0.3,0.4)});
      mh_sheet(x,tt,w("drop","172",-0.2),600,694,720,{kick:"Graham's answer",title:"172 rooms, not 186"},{col:LP.amber,light:"late",out:c.nobody-0.3});
      // the join, between two people's hats: nobody's job to check
      mh_tag(x,tt,w("hats","between",-0.1),null,960,760,"Between two people's hats: nobody's job",{align:"center",col:LP.amber});}}
  ]);
  mh_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Deep in one, enough of the rest */
scene("shape",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // Mei's depth, Sam's, and Ivy's
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      mh_tag(x,tt,w("needed","timetable",-0.1),null,300,380,"The timetable",{align:"center",col:LP.orange});
      mh_tag(x,tt,w("needed","sensors",-0.1),null,1620,380,"The sensors",{align:"center",col:LP.orange});
      mh_tag(x,tt,w("own","statistics",-0.1),null,960,380,"Statistics",{align:"center",col:LP.ink});
      mh_tag(x,tt,w("own","business",-0.2),null,960,300,"Enough of the business, the systems and the data",{align:"center",col:LP.ink});
      lp_person(x,"mei",300,690,0.8,{t:tt,light:dy});lp_person(x,"ivy",960,690,0.8,{t:tt,a:ag_in(tt,0.9,0.6),light:dy});lp_person(x,"sam",1620,690,0.8,{t:tt,flip:true,light:dy});}},
    // the shape's name
    {at:c.t-0.3,place:"lpRoom",later:true,keys:[[c.t-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=w("t","deep",-0.1),b0=w("t","wide",-0.1);
      mh_sheet(x,tt,w("t","name",-0.3),700,150,520,{kick:"A shape with a name",title:"T-shaped"},{light:"day"});
      mh_T(x,960,480,{bw:900,sl:300,stem:ag_in(tt,s0,1.0),bar:ag_in(tt,b0,1.2)});
      lp_T(x,"Deep in one thing",1000,700,{w:700,size:32,a:ag_in(tt,s0+0.4,0.5)});
      lp_T(x,"Enough of the rest",960,446,{w:700,size:32,align:"center",a:ag_in(tt,b0+0.5,0.5)});}},
    // the frameworks' maps of the work, and one person's T across them
    {at:c.lists-0.3,place:"lpRoom",later:true,keys:[[c.lists-0.3,960,540,1.0]],draw:(x,tt)=>{const f0=c.lists+0.2;
      if(tt>=f0)mh_sfia(x,240,170,680,600,{a:ag_in(tt,f0,0.35),k:tt-f0,u:ag_in(tt,f0+0.3,2.0),T:ag_in(tt,w("nobody","all",-0.1),1.0),light:"day"});
      mh_sheet(x,tt,w("lists","DAMA's",-0.1),1040,200,640,{kick:"DAMA-DMBOK",title:"The roles of data work",lines:["Stewards, architects, modellers, analysts, and more"]},{light:"day",u:ag_in(tt,w("lists","roles",-0.1),0.5)});}},
    // range: where the rules stay fixed, and where problems are messy
    {at:c.range-0.3,place:"lpRoom",later:true,keys:[[c.range-0.3,960,540,1.0]],draw:(x,tt)=>{const m0=w("messy","messy",-0.2);
      mh_chess(x,330,250,420,ag_in(tt,w("range","rules",-0.3),0.6)*(1-ag_in(tt,m0-0.3,0.6)));
      mh_tangle(x,540,460,ag_in(tt,m0,1.8));
      mh_sheet(x,tt,w("range","Range",-0.1),1000,190,700,{kick:"Range · David Epstein, 2019",title:"Specialists win where the rules stay fixed",lines:["Where problems are messy, range does better"]},{light:"day",u:ag_in(tt,m0,0.5)});}},
    // the specialists stay essential; someone sees across them
    {at:c.essential-0.3,place:"lpRoom",later:true,keys:[[c.essential-0.3,960,540,1.0]],draw:(x,tt)=>{const m0=w("essential","matched",0.2),a0=w("across","across",-0.3);
      mh_sheet(x,tt,m0-0.4,760,130,400,{title:"14 rooms matched",lines:["In a day"]},{col:LP.green,light:"day"});
      mh_tick(x,tt,m0,760+400-36,130+56);
      mh_bar(x,1590,450,414,ag_in(tt,a0,1.4),{th:22});
      lp_person(x,"mei",700,700,0.85,{t:tt,cut:814,light:dy});lp_person(x,"sam",1220,700,0.85,{t:tt,flip:true,cut:814,light:dy});
      lp_table(x,420,820,1080);lp_laptop(x,960,786,220,{glow:0.6});
      lp_person(x,"ivy",1700,690,0.8,{t:tt,flip:true,a:ag_in(tt,c.across-0.4,0.6),light:dy});}}
  ]);
  mh_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. From her page */
scene("kept",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"};
  ag_shots(ctx,S,t,sc.dur,[
    // the first goal, met
    {at:0,place:"mhLate",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const m0=w("goal","met",0);
      if(tt>=1.0)mh_goals(x,300,170,780,{a:ag_in(tt,1.0,0.5),dim:1,tick:clamp(tt-m0,0,1),light:"late"});
      lp_pill(x,690,640,"Met on Thursday 25 March",{col:LP.green,icon:"tick",a:ag_in(tt,m0+0.3,0.4),k:tt-m0-0.3});
      lp_person(x,"ivy",1500,650,1.0,{t:tt,flip:true,a:ag_in(tt,0.9,0.6),light:lt});}},
    // the team starts from her page
    {at:c.team-0.3,place:"mhLate",later:true,keys:[[c.team-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=w("team","186",0.1);
      mh_sheet(x,tt,c.team+0.3,640,150,640,{kick:"Ivy's page",title:"The route of Graham's question"},{col:LP.blue,light:"late",out:c.owner-0.6});
      lp_pill(x,960,452,"All 186 rooms",{col:LP.green,icon:"tick",a:ag_io(tt,r0,c.owner-0.6,0.4),k:tt-r0});
      // Helena gives the join an owner: the sheet comes in once Ivy's page has gone, so no words show twice
      mh_sheet(x,tt,w("owner","owner",-0.1),640,150,640,{kick:"The join, with an owner",title:"Mei and Sam",lines:["Check the room names together, each term"]},
        {col:LP.green,light:"late",u:ag_in(tt,w("owner","check",-0.1),0.5)});
      for(const [who,px,fl] of [["helena",330,false],["noor",700,false],["jun",1220,true],["ivy",1590,true]])lp_person(x,who,px,720,0.72,{t:tt,flip:fl,light:lt});}},
    // what the catalog draws by itself, and what stays on her page
    {at:c.catalog-0.3,place:"mhLate",later:true,keys:[[c.catalog-0.3,960,540,1.0]],draw:(x,tt)=>{const d0=w("catalog","draws",-0.1);
      lp_screen(x,140,170,1060,560,{draw:(cx,X,Y,Wd,Hd)=>mh_lineage(cx,X,Y,Wd,Hd,{u:ag_in(tt,d0,1.6),
        lit:[ag_in(tt,w("lineage","raw",-0.1),0.5),ag_in(tt,w("lineage","counts",-0.1),0.5),ag_in(tt,w("lineage","models",-0.1),0.5),ag_in(tt,w("lineage","page",-0.1),0.5)]})});
      mh_sheet(x,tt,w("cant","decision",-0.2),1290,170,500,{kick:"Ivy's page",lines:["The decision: whether to ask for the building","The question: too few rooms, or too few at some hours?"]},{col:LP.blue,light:"late"});
      mh_tag(x,tt,w("cant","page",0.1),null,1540,560,"Only on Ivy's page",{align:"center",col:LP.blue});}}
  ]);
  mh_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back to Kaifeng: a print of the street on the team room's wall; three jobs, one move
    {at:0,place:"mhMorning",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const o0=w("back","one",-0.2),mu=ag_sine(ag_in(tt,o0,1.0));
      mh_print(x,520,160,940);
      for(const [s,px,wd] of [["Dig for earth",680,"dig"],["Float timber",990,"float"],["Cart rubble",1300,"cart"]]){const a=ag_in(tt,w("back",wd,-0.1),0.4)*(1-mu);
        if(a>0.004)lp_tag(x,lerp(px,990,mu),806,s,{align:"center",a});}
      lp_pill(x,990,806,"One move",{col:LP.blue,a:ag_in(tt,o0+0.3,0.4),k:tt-o0-0.3});
      lp_person(x,"ivy",300,650,1.0,{t:tt,a:ag_in(tt,0.9,0.6),light:mo});}},
    // Helena did the same with her team: she gave Ivy the time to see the parts as one
    {at:c.ivy-0.3,place:"mhMorning",later:true,keys:[[c.ivy-0.3,960,540,1.0]],draw:(x,tt)=>{const k0=w("ivy","stayed",-0.1);
      mh_parts(x,{light:"morning",names:1,stemTop:MH_PY+MH_PH+72,stemBot:640,stems:1,bar:ag_in(tt,w("ivy","one",-0.2),1.6)});
      lp_pill(x,960,770,"14 rooms stayed in Graham's answer",{col:LP.green,icon:"tick",a:ag_in(tt,k0,0.4),k:tt-k0});}},
    // what to do on Monday; then the T, the whole film in one shape
    {at:c.depth-0.3,place:"mhMorning",later:true,keys:[[c.depth-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        mh_sheet(x,tt,c.depth+0.3,140,170,520,{kick:"One",title:"Write down the hats each person wears"},{light:"morning"});
        mh_sheet(x,tt,w("words","learn",-0.1),700,170,520,{kick:"Two",title:"Give someone new time with every part"},{light:"morning"});
        mh_sheet(x,tt,w("route","route",-0.1),1260,170,520,{kick:"Three",title:"Have them draw one question's whole route"},{col:LP.blue,light:"morning"});
        mh_sheet(x,tt,w("ask","give",-0.1),560,520,800,{kick:"Four",title:"Give what falls between the hats an owner"},{col:LP.green,light:"morning"});
        x.restore();}
      mh_T(x,960,420,{bw:960,sl:340,a:1-ag_in(tt,e0,0.8),stem:ag_in(tt,w("take","deep",-0.1),1.0),bar:ag_in(tt,w("take","enough",-0.1),1.2)});}}
  ]);
  lp_end(ctx,S,t,e0,"Many hats, one picture",MH_LAST,"Film 1 of 3","The new skills");
  mh_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["question"]);
