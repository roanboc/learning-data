/* ===== Risks, said out loud: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const RSO_LAST="Name each risk, give it an owner, watch its early sign.";
const RSO_TITLE="Risks, said out loud";
const RSO_O={module:"Data management",mark:dm_mark};
function rso_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"2",RSO_TITLE,{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function rso_card(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
const rso_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
function rso_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function rso_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// two faint lines of ski tracks running off to the horizon
function rso_tracks(ctx,a){if(a<=0.004)return;ctx.save();ctx.strokeStyle=rgba(RSO_K.snowDk,0.5*a);ctx.lineCap="round";for(const dx of [-26,26]){ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(880+dx*2.2,H+10);ctx.lineTo(1040+dx*0.08,RSO_HZ+3);ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- 1. Flags across the route: Antarctica, 1911 */
scene("depots",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const fog0=w("fog","fog",-0.4),miss0=w("along","drift",-0.8),cross0=c.cross-0.1;
  ag_shots(ctx,S,t,sc.dur,[
    // February 1911: the Barrier's ice, flat to the horizon, a track running south
    {at:0,place:"rsoIce",keys:[[0,960,560,1.06],[c.when+0.4,960,540,1.0]],d:3,draw:(x,tt)=>{rso_tracks(x,ag_in(tt,0.4,1.6));
      rso_card(x,tt,w("when","Antarctica",-0.2),140,130,640,{kick:"The Bay of Whales",title:"Antarctica, February 1911"},{light:null,pin:false,out:c.plan-0.7});}},
    // the route on a map: to the Pole and back, and its three depots
    {at:c.plan-0.3,place:"rsoMap",keys:[[c.plan-0.3,960,480,1.0]],dis:1.4,draw:(x,tt)=>{
      rso_route(x,{u:ag_in(tt,w("plan","South",-0.2),2.6),dep:ag_in(tt,w("depots","three",-0.2),1.2),lat:ag_in(tt,w("depots","depots",-0.3),0.6)});
      rso_tag(x,tt,w("plan","three",-0.2),c.fog-0.7,1010,660,"About 3,000 km, there and back, on skis",{col:LP.blue});
      rso_tag(x,tt,w("depots","depots",-0.1),c.fog-0.7,1010,282,"Three depots: stores of food",{col:LP.blue});}},
    // fog: the depot fades, a track goes by a kilometre off, and never sees it
    {at:c.fog-0.3,place:"rsoIce",keys:[[c.fog-0.3,960,540,1.0],[c.fog+3.4,1010,560,1.1]],dis:1.4,d:3,draw:(x,tt)=>{rso_tracks(x,1);
      rso_depot(x,1260,RSO_HZ+80,0.5,{t:tt});rso_fog(x,0.94*ag_in(tt,fog0,3.0),tt);
      rso_tag(x,tt,w("fog","pass",-0.2),c.harm-0.5,140,820,"In fog: a depot a kilometre away, unseen",{col:LP.amber});
      rso_card(x,tt,w("harm","Miss",-0.2),560,180,800,{kick:"Missed on the way home",title:"No food, far from any help"},{col:LP.amber,light:null,pin:false,out:c.along-0.7});}},
    // from above: marks along the route, and a party in fog drifting off the line, past the depot
    {at:c.along-0.3,place:"rsoNear",keys:[[c.along-0.3,960,470,1.0]],dis:1.4,draw:(x,tt)=>{
      rso_near(x,{t:tt,along:ag_in(tt,w("along","Marks",-0.1),1.4),track:clamp((tt-miss0)/5.0,0,1),fog:ag_in(tt,c.along+0.4,0.8)});
      rso_card(x,tt,c.along+0.2,96,130,560,{kick:"From above",title:"The depot at 80° S"},{light:null,pin:false});
      rso_tag(x,tt,w("along","missed",-0.2),null,140,780,"Marks along the route: easily missed",{col:LP.amber});
      rso_tag(x,tt,miss0+4.2,null,1480,470,"The depot, missed",{col:LP.amber});}},
    // the new way: flags across the route, nine kilometres out on each side
    {at:c.across-0.3,place:"rsoNear",later:true,keys:[[c.across-0.3,960,470,1.0]],draw:(x,tt)=>{
      rso_near(x,{t:tt,across:ag_in(tt,w("across","marked",-0.2),2.6)});
      rso_card(x,tt,c.across+0.3,96,130,560,{kick:"From above",title:"Marked across the route"},{col:LP.blue,light:null,pin:false});
      rso_tag(x,tt,w("across","nine",-0.1),null,645,380,"9 km",{align:"center",col:LP.ink});
      rso_tag(x,tt,w("across","nine",0.1),null,1275,380,"9 km",{align:"center",col:LP.ink});}},
    // on the ice: the line of black flags on their bamboo poles, the nearest numbered; the card over them, top right, where the camera's
    // push towards the near flags keeps it in the frame
    {at:c.flags-0.3,place:"rsoIce",keys:[[c.flags-0.3,1000,560,1.04],[c.flags+1.0,1060,580,1.08]],dis:1.4,d:3,draw:(x,tt)=>{
      rso_flagRow(x,{t:tt,u:ag_in(tt,c.flags+0.1,2.2),n:10,first:20,depot:[330,RSO_HZ+36],near:[1500,812]});
      rso_card(x,tt,w("flags","twenty",-0.2),1180,150,620,{kick:"At 80° S",title:"Twenty black flags",lines:["Each numbered: which side the depot lies, and how far"]},
        {light:null,pin:false,u:ag_in(tt,w("flags","numbered",-0.1),0.5)});}},
    // in fog again, but now the party crosses the line, reads a flag, and turns along it to the depot
    {at:c.cross-0.3,place:"rsoNear",keys:[[c.cross-0.3,960,470,1.0]],dis:1.4,draw:(x,tt)=>{const f0=cross0+2.2,found=ag_in(tt,cross0+3.6,0.6);
      rso_near(x,{t:tt,across:1,nums:ag_in(tt,c.cross+1.2,0.6),track:clamp((tt-cross0)/3.6,0,1),turn:true,hi:tt>f0?14:null,found,fog:1-0.65*found});
      rso_tag(x,tt,f0+0.1,null,1212,600,"14: east of it, 3.6 km",{align:"center",col:LP.ink});
      rso_pill(x,tt,cross0+3.7,null,960,250,"Off course, and still found",{col:LP.green,icon:"tick"});}},
    // home: Framheim, five pairs of skis by the hut; ninety-nine days; then his words
    {at:c.home-0.3,place:"rsoHut",keys:[[c.home-0.3,960,540,1.0],[c.home+2.0,940,530,1.03]],dis:1.4,draw:(x,tt)=>{rso_smoke(x,tt,1);
      rso_skis(x,1200,RSO_HUT.ground+16,ag_in(tt,w("home","five",-0.6),1.8));
      if(tt>=w("home","Ninety-nine",-0.2))lp_figure(x,140,130,460,{kick:"Since setting out",num:"99 days",label:"About 3,000 km, on skis"},
        {col:LP.green,light:null,pin:false,a:ag_in(tt,w("home","Ninety-nine",-0.2),0.35)*(1-ag_in(tt,c.luck-0.8,0.4)),k:tt-w("home","Ninety-nine",-0.2)});
      rso_card(x,tt,w("home","January",-0.2),1180,130,620,{kick:"25 January 1912",title:"All five home, well",lines:["With food to spare"]},{col:LP.green,light:null,pin:false,out:c.luck-0.8,u:ag_in(tt,w("home","food",-0.1),0.5)});
      rso_card(x,tt,c.luck-0.1,420,130,1080,{kick:"Roald Amundsen, The South Pole, 1912",title:"“Victory awaits him who has everything in order: luck, people call it.”"},{light:null,pin:false,out:c.data-0.8});}},
    // the same work, today: the move off the old warehouse, its risks hard to see, then said out loud
    {at:c.data-0.3,place:"rsoTeam",keys:[[c.data-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const end=1-ag_in(tt,c.breath+0.2,0.8),said=ag_in(tt,w("found","loud",-0.2),0.8);
      rso_card(x,tt,w("data","move",-0.3),140,140,860,{kick:"Helena's team",title:"21 reports to move off the old warehouse"},{col:LP.blue,light:"morning",out:c.breath+0.2});
      const risks=[["A report that stops",w("hidden","stops",-0.3)],["Personal data where it shouldn't be",w("hidden","personal",-0.3)]],
        foot=470+Math.max(...risks.map(([txt])=>lp_textSheet(x,0,470,560,{kick:"A risk",title:txt},{measure:true}).h));
      risks.forEach(([txt,who],i)=>{const a=ag_in(tt,who,0.4)*end;if(a<=0.004)return;const bx=140+i*600;
        lp_textSheet(x,bx,470,560,{kick:"A risk",title:txt},{col:LP.amber,light:"morning",a:a*(0.4+0.6*said),k:tt-who});
        if(said>0){x.save();x.globalAlpha*=a*said;rso_sign(x,bx+44,foot+44,1.2);lp_T(x,"An owner, an early sign",bx+80,foot+54,{w:700,size:28,col:LP.ink});x.restore();}});
      lp_nameTag(x,1450,240,"helena",{role:"The data manager",a:ag_in(tt,w("data","Helena's",-0.2),0.5)*end});
      lp_person(x,"helena",1640,640,1.0,{t:tt,flip:true,a:ag_in(tt,c.data-0.1,0.6)*end,light:mo});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("data","university",-0.3),c.breath,0.5)});
  lp_title(ctx,S,t,c.breath+0.2,RSO_TITLE,"A risk register that lives","Data management · Making the case",RSO_O);
});

/* ---------------------------------------------------------------- 2. How much risk: the data council, April 2027 */
scene("appetite",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"rsoCouncil",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      rso_card(x,tt,0.9,560,150,800,{kick:"Tuesday 27 April 2027",title:"The data council"},{light:"late",out:c.ask-0.5});
      rso_card(x,tt,w("ask","How",-0.2),560,150,800,{kick:"Helena asks",title:"How much risk will you take, and on what?"},{col:LP.amber,light:"late",out:c.name-0.4});
      if(tt>=c.name-0.1)rso_appetite(x,530,150,860,{a:ag_in(tt,c.name-0.1,0.35),k:tt-c.name+0.1,light:"late",u:[ag_in(tt,w("low","Low",-0.1),0.8),ag_in(tt,w("medium","Medium",-0.1),0.8),ag_in(tt,w("high","high",-0.1),0.8)]});
      rso_pill(x,tt,w("means","avoided",-0.3),null,960,720,"Personal data: avoided, not just watched",{col:LP.amber});
      rso_tag(x,tt,w("who","team",-0.2),null,330,250,"The team names the risks",{align:"center",col:LP.ink});
      rso_tag(x,tt,w("who","decide",-0.2),null,1630,250,"The council says how much",{align:"center",col:LP.ink});
      lp_nameTag(x,120,250,"helena",{role:"The data manager",a:ag_io(tt,0.8,w("who","team",-0.7),0.5)});
      lp_nameTag(x,1450,250,"david",{a:ag_io(tt,1.4,w("who","team",-0.7),0.5)});
      lp_person(x,"david",1600,640,1.0,{t:tt,flip:true,cut:844,light:lt});lp_table(x,1300,850,560,{});
      lp_person(x,"helena",330,640,1.0,{t:tt,light:lt});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.6,c.ask,0.5)});
  rso_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. One sentence, one owner: the register, May 2027 */
const RSO_R1={kick:"R1",title:"One risk, in full",parts:["The licence ends on 31 December,",["so a report not moved","by then would stop,"],"and its readers would lose it."],
  fields:[["Owner","Helena Novak"],["Look again","Tuesday 29 June"],["Likely, impact","Medium, high"],["Response","Reduce: the busiest reports move first"],["Early sign","A report two weeks behind its date","sign"]]};
scene("sentence",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  ag_shots(ctx,S,t,sc.dur,[
    // the register: three of its eight rows, and the three parts of every risk's sentence
    {at:0,place:"rsoTeam",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      if(tt>=0.8)rso_register(x,220,140,{a:ag_in(tt,0.8,0.35),k:tt-0.8,light:"morning",u:ag_in(tt,w("may","register",-0.3),1.4)});
      rso_tag(x,tt,w("may","cause",-0.1),null,520,780,"A cause",{align:"center",col:LP.amber});
      rso_tag(x,tt,w("may","happen",-0.2),null,960,780,"What could happen",{align:"center",col:LP.amber});
      rso_tag(x,tt,w("may","would",-0.1),null,1400,780,"What it would do",{align:"center",col:LP.amber});}},
    // R1 in full: its sentence in three parts, then its owner, its date, how likely and how bad, its response and its early sign
    {at:c.r1-0.3,place:"rsoTeam",later:true,keys:[[c.r1-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=c.r1-0.1,tail=1-ag_in(tt,c.r8-0.8,0.4);
      if(tt>=r0)rso_risk(x,110,140,1000,RSO_R1,{a:ag_in(tt,r0,0.35)*tail,k:tt-r0,light:"morning",mark:ag_in(tt,r0+0.4,0.6),
        u:[ag_in(tt,w("r1","licence",-0.2),0.6),ag_in(tt,w("r1","report",-0.2),0.6),ag_in(tt,w("r1","readers",-0.2),0.6)],
        f:[ag_in(tt,w("owner","owner",-0.1),0.5),ag_in(tt,w("owner","date",-0.2),0.5),ag_in(tt,w("rate","likely",-0.2),0.5),ag_in(tt,w("response","reduced",-0.2),0.5),ag_in(tt,w("sign","sign",-0.2),0.5)],
        hl:tt>w("sign","sign",-0.2)&&tt<c.iso?4:null});
      x.save();x.globalAlpha*=tail;rso_responses(x,1500,240,{a:ag_in(tt,w("response","avoid",-0.3),0.4),u:clamp((tt-w("response","avoid",-0.3))/1.6,0,1),hi:tt>w("response","reduced",-0.2)?1:null,k:tt-w("response","reduced",-0.2)});x.restore();
      rso_tag(x,tt,w("iso","standard",-0.3),c.r8-0.8,1500,150,"The standard: ISO 31000 (2018)",{align:"center",col:LP.ink});
      lp_person(x,"helena",1640,640,1.0,{t:tt,flip:true,a:ag_in(tt,w("owner","owner",-0.6),0.6)*tail,light:mo});}},
    // R8, reduced long before: payroll's export lives in the project now
    {at:c.r8-0.3,place:"rsoTeam",later:true,keys:[[c.r8-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=c.r8-0.1;
      if(tt>=r0)rso_register(x,220,140,{a:ag_in(tt,r0,0.35)*(1-ag_in(tt,c.eight-0.8,0.4)),k:tt-r0,light:"morning",rows:["R6","R7","R8"],hl:2});
      rso_tag(x,tt,w("r8","Scripts",-0.2),c.eight-0.8,960,780,"Scripts became software",{align:"center",col:LP.ink});}},
    // 25 May: the case goes to the council with its eight risks, and it says yes
    {at:c.eight-0.3,place:"rsoTeam",later:true,keys:[[c.eight-0.3,960,540,1.0]],draw:(x,tt)=>{
      rso_card(x,tt,c.eight-0.1,560,170,800,{kick:"Tuesday 25 May 2027",title:"The case, with its eight risks"},{col:LP.blue,light:"morning",out:c.vague-0.8});
      rso_pill(x,tt,w("eight","yes",-0.2),c.vague-0.8,960,520,"The council says yes",{col:LP.green,icon:"tick"});}},
    // but R3 is only a worry: no cause, no early sign
    {at:c.vague-0.3,place:"rsoTeam",later:true,keys:[[c.vague-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=c.vague-0.1;
      if(tt>=r0)rso_register(x,220,140,{a:ag_in(tt,r0,0.35),k:tt-r0,light:"morning",hl:2,hla:ag_in(tt,w("vague","R3",-0.2),0.4)});
      rso_tag(x,tt,w("vague","worry",-0.2),null,960,780,"R3: no cause yet, and no early sign",{align:"center",col:LP.amber});}}
  ]);
  rso_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. It failed. Why? The pre-mortem, 1 June 2027 */
const RSO_R3={kick:"R3",title:"Written again, after the pre-mortem",parts:["Old extracts take whole tables,",["so personal data nobody needs","could be copied across,"],"and sit where it shouldn't."],
  fields:[["Owner","Yusuf Demir"],["Response",["Avoid: each extract is checked against","the protection rules before it moves"]],["","What no report needs stays behind"],["Early sign",["An extract carrying personal fields","its report never shows"],"sign"]]};
scene("premortem",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // the move begins: imagine it's over, and it failed
    {at:0,place:"rsoMeet",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const end=1-ag_in(tt,c.alone-0.8,0.4);
      rso_card(x,tt,0.8,560,150,800,{kick:"Tuesday 1 June 2027",title:"The move begins"},{light:"day",out:c.failed-0.4});
      rso_card(x,tt,w("failed","January",-0.3),560,150,800,{kick:"Imagine",title:"It's January 2028, and the move has failed. Why?"},{col:LP.amber,light:"day",out:c.alone-0.8});
      rso_tag(x,tt,w("klein","pre-mortem",-0.2),c.alone-0.8,960,470,"A pre-mortem: Gary Klein, Harvard Business Review, 2007",{align:"center",col:LP.ink});
      rso_card(x,tt,w("easier","failure",-0.2),620,550,680,{kick:"Once failure is a given",lines:["Its reasons come more easily","And are said more freely"]},{light:"day",out:c.alone-0.8,u:rso_u(tt,[w("easier","easily",-0.4),w("easier","freely",-0.4)])});
      lp_nameTag(x,120,250,"helena",{role:"The data manager",a:ag_in(tt,0.8,0.5)*end});
      lp_person(x,"helena",330,640,1.0,{t:tt,a:ag_in(tt,0.3,0.6)*end,light:dy});}},
    // eight people's reasons on the wall: five minutes alone, then one each, in turn
    {at:c.alone-0.3,place:"rsoMeet",later:true,keys:[[c.alone-0.3,960,540,1.0]],draw:(x,tt)=>{
      rso_wall(x,360,170,{a:1-ag_in(tt,c.extract-0.5,0.4),u:clamp((tt-c.alone)/3.6,0,1)});
      rso_tag(x,tt,w("alone","alone",-0.2),c.extract-0.5,620,790,"Five minutes, alone",{align:"center",col:LP.ink});
      rso_tag(x,tt,w("alone","turn",-0.3),c.extract-0.5,1300,790,"Then one each, in turn",{align:"center",col:LP.ink});}},
    // what an extract is: a copy the old warehouse takes from another system
    {at:c.extract-0.3,place:"rsoMeet",later:true,keys:[[c.extract-0.3,960,540,1.0]],draw:(x,tt)=>{
      rso_extract(x,160,300,{a:1-ag_in(tt,c.ivy-0.8,0.4),light:"day",p:[ag_in(tt,w("extract","copy",-0.3),0.5),ag_in(tt,w("extract","copy",-0.1),0.6),ag_in(tt,w("extract","extract",-0.3),0.5),
        ag_in(tt,w("extract","extract",0.2),0.6),ag_in(tt,w("extract","report",-0.3),0.5)]});
      rso_tag(x,tt,w("extract","HR's",-0.1),c.ivy-0.8,960,640,"An extract: a copy taken from another system",{align:"center",col:LP.orange});}},
    // Ivy, the newest, reads hers
    {at:c.ivy-0.3,place:"rsoMeet",later:true,keys:[[c.ivy-0.3,960,540,1.0]],draw:(x,tt)=>{const end=1-ag_in(tt,c.cause-0.8,0.4);
      rso_card(x,tt,w("ivy","hers",-0.2),220,200,1000,{kick:"Ivy's reason",title:"The old extracts take whole tables, personal fields and all."},{col:LP.amber,light:"day",out:c.cause-0.8});
      lp_nameTag(x,1420,250,"ivy",{role:"Data analyst, the newest",a:ag_in(tt,w("ivy","Ivy",-0.1),0.5)*end});
      lp_person(x,"ivy",1620,640,1.0,{t:tt,flip:true,a:ag_in(tt,c.ivy-0.1,0.6)*end,light:dy});}},
    // R3, written again: a cause and an early sign; Yusuf, its owner, writes the response
    {at:c.cause-0.3,place:"rsoMeet",later:true,keys:[[c.cause-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=c.cause-0.1;
      if(tt>=r0)rso_risk(x,110,140,1100,RSO_R3,{a:ag_in(tt,r0,0.35),k:tt-r0,light:"day",mark:ag_in(tt,r0+0.4,0.6),
        u:[ag_in(tt,r0+0.3,0.5),ag_in(tt,r0+0.6,0.5),ag_in(tt,r0+0.9,0.5)],
        f:[ag_in(tt,r0+1.2,0.5),ag_in(tt,w("yusuf","checked",-0.3),0.5),ag_in(tt,w("behind","stays",-0.4),0.5),ag_in(tt,w("cause","sign",-0.2),0.5)],
        hl:tt>w("cause","sign",-0.2)&&tt<c.yusuf?3:null});
      lp_nameTag(x,1420,250,"yusuf",{role:"Data governance lead",a:ag_in(tt,w("yusuf","Yusuf",-0.1),0.5)});
      lp_person(x,"yusuf",1640,640,1.0,{t:tt,flip:true,a:ag_in(tt,c.yusuf-0.4,0.6),light:dy});}}
  ]);
  rso_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. The early sign: 16 June 2027 */
scene("sign",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),gy={light:"grey"};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"rsoGrey",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      rso_card(x,tt,0.8,560,170,800,{kick:"Wednesday 16 June 2027",title:"The move's third week",lines:["Next: Facilities' report of who holds an access card"]},{light:"grey",u:ag_in(tt,w("week","Next",-0.2),0.5),out:c.columns-0.6});}},
    // the catalog: 42 columns come with the old extract; the report shows five; two are tagged personal, and no report uses them
    {at:c.columns-0.3,place:"rsoGrey",later:true,keys:[[c.columns-0.3,960,540,1.0]],draw:(x,tt)=>{const end=1-ag_in(tt,c.stays+1.6,0.4),s0=c.columns-0.1;
      lp_screen(x,120,150,1240,720,{a:ag_in(tt,s0,0.5)*end,draw:(cx,X,Y,Wd,Hd)=>rso_catalog(cx,X,Y,Wd,Hd,{used:ag_in(tt,w("columns","shows",-0.2),0.8),tags:ag_in(tt,w("tags","home",-0.2),0.6),
        out:ag_in(tt,w("stays","behind",-0.4),0.8),k:tt-w("tags","home",-0.2)})});
      lp_nameTag(x,1420,250,"yusuf",{role:"R3's owner",a:ag_in(tt,c.columns+0.4,0.5)*end});
      lp_person(x,"yusuf",1640,640,1.0,{t:tt,flip:true,a:ag_in(tt,c.columns,0.6)*end,light:gy});}},
    // what the check does: the extract stays behind; the report is rebuilt from the one governed staff list
    {at:c.stays+1.4,place:"rsoGrey",later:true,keys:[[c.stays+1.4,960,540,1.0]],draw:(x,tt)=>{const t0=c.stays+1.7;
      rso_card(x,tt,t0,140,180,780,{kick:"Stays behind",title:"The old extract",lines:["Home address and date of birth, used by no report"]},{col:LP.amber,light:"grey",out:c.issue-0.6});
      rso_card(x,tt,t0+0.6,1000,180,780,{kick:"Rebuilt",title:"From the one governed staff list",lines:["The five columns the report shows"]},{col:LP.green,light:"grey",out:c.issue-0.6});}},
    // a risk might happen; an issue has
    {at:c.issue-0.3,place:"rsoGrey",later:true,keys:[[c.issue-0.3,960,540,1.0]],draw:(x,tt)=>{
      const r0=c.issue+0.1,i0=w("issue","issue",-0.3),ar=ag_in(tt,w("issue","become",-0.3),0.7);
      rso_card(x,tt,r0,100,300,680,{kick:"R3, a risk",title:"Something that might happen"},{col:LP.amber,light:"grey"});
      if(ar>0){x.save();x.strokeStyle=rgba(LP.amber,1);x.lineWidth=5;x.lineCap="round";const x0=820,x1=lerp(x0,1092,ag_sine(ar));x.beginPath();x.moveTo(x0,400);x.lineTo(x1,400);x.stroke();
        if(ar>0.98){x.fillStyle=rgba(LP.amber,1);x.beginPath();x.moveTo(1100,400);x.lineTo(1080,388);x.lineTo(1080,412);x.closePath();x.fill();}
        lp_T(x,"Had they moved",960,370,{w:800,size:28,align:"center",col:LP.amber,a:clamp(ar*2-1,0,1)});x.restore();}
      rso_card(x,tt,i0,1140,300,680,{kick:"An issue",title:"Something that has happened",lines:["Dealt with now, not watched"]},{col:LP.amber,light:"grey",u:ag_in(tt,w("issue","had",-0.2),0.5)});
      rso_tag(x,tt,w("locks","Locks",-0.2),null,960,720,"Locks before the data",{align:"center",col:LP.ink});}}
  ]);
  rso_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. Read every month: the council, 29 June 2027 */
scene("monthly",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // the one page: the month's top three risks, each with its owner and its early sign
    {at:0,place:"rsoCouncil",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      if(tt>=0.8)rso_page(x,210,130,{a:ag_in(tt,0.8,0.35)*(1-ag_in(tt,c.closed-0.8,0.4)),k:tt-0.8,light:"late",
        u:[ag_in(tt,w("three","R1",-0.1),0.6),ag_in(tt,w("three","R4",-0.1),0.6),ag_in(tt,w("three","R3",-0.1),0.6)],hl:tt>w("three","R3",-0.1)?2:null});}},
    // R8 closed; R7 stays, watched; said early, trust
    {at:c.closed-0.3,place:"rsoCouncil",later:true,keys:[[c.closed-0.3,960,540,1.0]],draw:(x,tt)=>{const out=c.flags-0.8;
      rso_card(x,tt,c.closed-0.1,110,170,820,{kick:"R8",title:"One person keeps payroll's export",lines:["In the project, run every pay day since March 2026"]},{col:LP.green,light:"late",out,u:ag_in(tt,w("closed","project",-0.2),0.5)});
      rso_pill(x,tt,w("closed","closed",-0.2),out,520,560,"Closed",{col:LP.green,icon:"tick"});
      rso_card(x,tt,c.r7-0.1,990,170,820,{kick:"R7",title:"An agent with more rights than its job",lines:["Watched, in each month's access review"]},{col:LP.amber,light:"late",out,u:ag_in(tt,w("r7","watched",-0.2),0.5)});
      rso_tag(x,tt,w("r7","How",-0.2),out,1400,560,"How it goes wrong",{align:"center",col:LP.ink});
      rso_pill(x,tt,w("trust","builds",-0.3),out,640,720,"Said early: trust built",{col:LP.green});
      rso_pill(x,tt,w("trust","spends",-0.3),out,1280,720,"Hidden: trust spent",{col:LP.amber});}},
    // back on the ice: the flags were early signs too
    {at:c.flags-0.3,place:"rsoNear",keys:[[c.flags-0.3,960,470,1.0]],dis:1.4,draw:(x,tt)=>{
      rso_near(x,{t:tt,across:1,nums:1,track:1,turn:true,hi:14,found:1,fog:0.3});
      rso_tag(x,tt,c.flags+0.4,c.monday-0.7,960,250,"Early signs, set where they'd be crossed in time",{align:"center",col:LP.ink});}},
    // on Monday: four steps; then the end card
    {at:c.monday-0.3,place:"rsoTeam",keys:[[c.monday-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const g=1-ag_in(tt,e0,0.8);if(g<=0.004)return;x.save();x.globalAlpha*=g;
      rso_card(x,tt,w("monday","take",-0.3),140,230,800,{kick:"One",title:"Take your three biggest risks"},{col:LP.amber,light:"morning"});
      rso_card(x,tt,w("monday","sentence",-0.3),980,230,800,{kick:"Two",title:"Write each in one sentence"},{col:LP.amber,light:"morning"});
      rso_card(x,tt,w("monday","owner",-0.2),140,500,800,{kick:"Three",title:"Give each one owner"},{col:LP.amber,light:"morning"});
      rso_card(x,tt,w("monday","sign",-0.3),980,500,800,{kick:"Four",title:"Say its early sign, and watch it"},{col:LP.amber,light:"morning"});x.restore();}}
  ]);
  lp_end(ctx,S,t,e0,RSO_TITLE,RSO_LAST,"Film 2 of 4","Making the case",RSO_O);
  rso_kick(ctx,S,1-ag_in(t,e0,0.8));
});
