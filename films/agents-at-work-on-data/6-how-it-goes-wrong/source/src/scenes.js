/* ===== How it goes wrong: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): a place painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice.
   The room's shots keep a still camera: the tray's label stays above the captions, and each chapter ends on the plain room the next
   one opens on (its cards go 1.6 s before its end), so the crossfade between chapters shows nothing twice. Lisbon's pictures carry
   the corner tag, drawn over the shots (never in a dissolve), after each shot has come in and before the next. */

const HW_TAG_1755="Lisbon · 1755",HW_TAG_TODAY="Lisbon · today";
// the corner tags: [from, till, text]
function hw_tags(ctx,S,t,list){setScreen(ctx,S);for(const [t0,t1,s] of list){const a=ag_in(t,t0,0.5)*(1-ag_in(t,t1-0.4,0.4));if(a>0)hw_corner(ctx,s,a);}}
// the chapter's cards, as it ends: gone 1 s before its end
const hw_out=(tt,sc)=>1-ag_in(tt,sc.dur-1.6,0.6);
// a pill whose left edge is at x (ag_pill takes its middle)
function hw_pillL(ctx,x,y,text,o){o=o||{};const w=ag_tw(ctx,text,{w:700,size:o.size||30})+(o.icon?96:56);return ag_pill(ctx,x+w/2,y,text,o);}
// the three ways the city failed, side by side over the ruins (in screen space: they stay while the shots change under them)
const HW_WAYS3=["Walls that broke","Fire that leapt","Narrow, crowded lanes"];
function hw_ways3(ctx,S,t,ts,t1){setScreen(ctx,S);const ws=HW_WAYS3.map(s=>ag_tw(ctx,s,{w:700,size:36})+62),gap=36;let x=960-(ws.reduce((a,b)=>a+b,0)+gap*2)/2;
  HW_WAYS3.forEach((s,i)=>{const a=ag_io(t,ts[i],t1,0.4);if(a>0)ag_textCard(ctx,x,196,ws[i],{title:s},{edge:AG.amber,edgeA:0.85,a,k:ag_spr(t,ts[i])});x+=ws[i]+gap;});}
// the query that now comes with every number: a blue tab under the answer
function hw_queryTab(ctx,x,y,a){if(a<=0)return;const w=ag_tw(ctx,"its query",{w:600,size:28})+48;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,54,14,{edge:AG.blue,edgeA:0.8});ag_T(ctx,"its query",x+24,y+37,{w:600,size:28,col:AG.blue});ctx.restore();}

/* ---------------------------------------------------------------- 1 · Rebuilt for the next one */
scene("lisbon",(ctx,S,t,sc)=>{const c=sc.cues,P=hw_once(sc,"P",()=>({ch:wAt(sc,"saints","the churches"),gs:wAt(sc,"shakes","the ground shakes"),
    sev:wAt(sc,"shakes","several minutes"),fall:wAt(sc,"fall","fall"),gw:wAt(sc,"wave","a great wave"),fires:wAt(sc,"wave","fires burn"),
    w:[wAt(sc,"ways","walls that broke"),wAt(sc,"ways","fire that leapt"),wAt(sc,"ways","narrow, crowded lanes")],
    shake2:wAt(sc,"again","shake again"),rebuilt:wAt(sc,"oldway","Rebuilt"),same:wAt(sc,"oldway","the same way"),
    reb:wAt(sc,"engineers","rebuilt the lower town"),crosses:wAt(sc,"cage","braced with crosses"),bends:wAt(sc,"cage","bends instead"),
    walls:wAt(sc,"firewall","stone walls"),fire2:wAt(sc,"firewall","so fire"),wide:wAt(sc,"streets","wide, straight streets"),
    thirteen:wAt(sc,"questions","thirteen questions"),
    q:[wAt(sc,"asked","when did it start"),wAt(sc,"asked","what fell"),wAt(sc,"asked","what did the sea do"),wAt(sc,"asked","had one struck before")],
    years:wAt(sc,"stands","more than"),withstand:wAt(sc,"first","built to withstand"),ans:wAt(sc,"read","the parishes' answers"),
    cnt:wAt(sc,"uni","census-day count"),known:wAt(sc,"known","a few known ways"),each:wAt(sc,"builds","expects each one"),bfor:wAt(sc,"builds","builds for it")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Lisbon from across the river, on the morning of All Saints' Day: the lower town at the water, its churches' towers and domes
    {at:0,place:"hwCity",keys:[[0,1010,520,1.1],[0.3,960,540,1.0]],d:4.2,push:0},
    // the churches are full: people going in at a church's open doors
    {at:P.ch-0.2,place:"hwChurch",keys:[[P.ch-0.2,900,560,1.04]],push:0.03,draw:(x,tt)=>hw_churchgoers(x,tt,clamp((tt-P.ch)/3.2,0,1))},
    // the ground shakes, for minutes: the city trembles, and its houses and churches fall into the dust
    {cut:true,at:c.shakes,keys:[[c.shakes,960,540,1]],push:0,draw:(x,tt)=>{const amp=5*ag_in(tt,P.gs,0.3)*(1-ag_in(tt,c.wave-1.6,1.2)),ru=ag_in(tt,P.fall-0.3,1.4);
      if(ru<1)hw_shaken(x,"hwCity",tt,amp,1);if(ru>0)hw_shaken(x,"hwRuin",tt,amp,ru);hw_dust(x,tt,P.fall-0.5,1-ag_in(tt,c.wave-0.8,0.7));
      ag_pill(x,1540,210,"for several minutes",{a:ag_io(tt,P.sev,c.fall+1.4,0.4)});}},
    // a great wave from the sea: the water draws back from the quay, then a long grey-green wave runs up the river
    {at:P.gw-0.2,place:"hwRuin",keys:[[P.gw-0.2,960,540,1]],push:0,draw:(x,tt)=>hw_river(x,tt,{back:ag_sine((tt-P.gw)/0.8),wave:clamp((tt-P.gw-0.6)/2.6,0,1)})},
    // and fires burn for days: the ruins at dusk under the fires' glow and smoke
    {at:P.fires+0.3,place:"hwDusk",keys:[[P.fires+0.3,980,530,1]],push:0.04,draw:(x,tt)=>hw_fires(x,tt,ag_in(tt,P.fires+0.3,1.2))},
    // the grey morning after: tens of thousands of people died, and the heart of the city lay in ruins
    {at:c.died,place:"hwGrey",keys:[[c.died,980,530,1.04]],push:0.03,draw:(x,tt)=>{
      hw_card(x,600,186,720,"By most estimates","Tens of thousands of people died",null,{kickCol:AG.mut,edge:[150,148,144],edgeA:0.6,a:ag_io(tt,c.died+0.3,c.failed-0.5,0.6)});}},
    // it had failed in every way at once: closer, on the ruins (the three ways come up over it)
    {cut:true,at:c.failed,place:"hwGrey",keys:[[c.failed,1000,580,1.16]],push:0.02},
    // and the ground would shake again; rebuilt the old way, the city stands up again, and falls the same way
    {cut:true,at:c.again,keys:[[c.again,960,540,1]],push:0,draw:(x,tt)=>{const tr=u=>Math.sin(Math.PI*clamp(u,0,1)),
      amp=4*Math.max(tr((tt-P.shake2+0.1)/1.4),tr((tt-P.same+0.1)/1.6)),up=ag_in(tt,P.rebuilt+0.2,1.2)*(1-ag_in(tt,P.same,0.9));
      hw_shaken(x,"hwGrey",tt,amp,1);if(up>0)hw_shaken(x,"hwCity",tt,amp,up);hw_dust(x,tt,P.same,1-ag_in(tt,c.engineers-1.2,0.8));}},
    // so the king's engineers rebuilt the lower town for each way it had failed: the old lanes, and the new plan drawing itself over them
    {at:c.engineers,place:"hwDraft",keys:[[c.engineers,960,540,1]],push:0.03,draw:(x,tt)=>{hw_plan(x,560,120,740,580,{p:(tt-P.reb)/3.4,pins:true});hw_engineers(x,tt);}},
    // inside the walls, a cage of timber braced with crosses: a house cut open; it sways once, and settles
    {at:c.cage,place:"hwStreet",keys:[[c.cage,960,540,1]],push:0.03,draw:(x,tt)=>{const u=Math.max(0,tt-P.bends);
      hw_cutaway(x,960,836,1,{sway:tt>P.bends?0.05*Math.exp(-2.3*u)*Math.sin(5.2*u):0});
      ag_pill(x,1560,104,"a timber cage that bends",{col:AG.blue,a:ag_in(tt,P.crosses,0.5)});}},
    // between the houses, stone walls raised above the roofs: a fire on one roof stops at the wall
    {at:c.firewall,place:"hwRow",keys:[[c.firewall,980,560,1.04]],push:0.03,draw:(x,tt)=>{hw_roofFire(x,tt,P.fire2-0.8,1);
      ag_pill(x,980,196,"stone walls above the roofs",{col:AG.blue,a:ag_in(tt,P.walls,0.5)});}},
    // and wide, straight streets in place of the lanes: the plan on its table, its long streets lit
    {at:c.streets,place:"hwPlanTable",keys:[[c.streets,960,540,1]],push:0.03,draw:(x,tt)=>{hw_plan(x,170,90,1580,740,{p:1,old:0.7,hl:ag_in(tt,P.wide,0.8)});
      ag_pill(x,960,810,"wide, straight streets",{col:AG.blue,a:ag_in(tt,P.wide+0.2,0.5)});}},
    // the king's minister sent thirteen questions to every parish: the sheet, and letters out across the map
    {at:c.questions,place:"hwDesk",keys:[[c.questions,960,540,1]],push:0.03,draw:(x,tt)=>{
      hw_sheet(x,190,200,820,{p:[0,0,0,0],k:ag_spr(tt,c.questions+0.1),a:ag_in(tt,c.questions+0.1,0.4)});
      hw_map(x,1200,96,{out:(tt-P.thirteen-0.3)/2.2,k:ag_spr(tt,c.questions+0.5),a:ag_in(tt,c.questions+0.5,0.4)});}},
    // when did it start, what fell, what did the sea do: a parish priest writes his answers, and the questions write themselves
    {cut:true,at:c.asked,place:"hwParish",keys:[[c.asked,960,540,1]],push:0.02,draw:(x,tt)=>{
      hw_table(x,940,1760,800,900);hw_papers(x,1330,846,{n:2,ink:true});
      ag_person(x,HW_P.priest,1180,600,0.9,{t:tt,cut:800,pose:{near:[40,95,"hold"]},hold:hw_quill,gaze:[3,3]});
      hw_sheet(x,90,150,860,{p:P.q.map(q=>(tt-q+0.1)/0.9)});}},
    // the lower town today: the same straight street, still standing, and one of the first built to withstand an earthquake
    {at:c.stands,place:"hwToday",keys:[[c.stands,960,540,1]],push:0.04,draw:(x,tt)=>{hw_walkers(x,tt-c.stands);
      ag_pill(x,960,206,"more than 250 years on",{a:ag_io(tt,P.years,c.read-0.4,0.4)});
      hw_card(x,620,300,680,"One of the first in Europe","Built to withstand an earthquake",null,{kickCol:AG.blue,edge:AG.blue,edgeA:0.5,a:ag_io(tt,P.withstand-0.6,c.read-0.4,0.4),k:ag_spr(tt,P.withstand-0.6)});}},
    // and scientists still read the parishes' answers: an archive today
    {at:c.read,place:"hwArchive",keys:[[c.read,960,540,1]],push:0.03,draw:(x,tt)=>{hw_table(x,560,1500,820,920,[196,186,170]);hw_papers(x,980,864,{n:5});
      ag_person(x,HW_P.sci,820,610,0.9,{t:tt,cut:820,gaze:[3,4]});
      ag_pill(x,1260,740,"the parishes' answers",{a:ag_in(tt,P.ans,0.5)});}},
    // at the university, Jun's agent works on the census-day count; agents go wrong in a few known ways too; the team expects each one
    {at:c.uni,place:"hwLab",keys:[[c.uni,960,540,1]],push:0,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.8),()=>{
      hw_base(x,tt,{six:{k:[0,1,2,3,4,5].map(i=>ag_spr(tt,P.known+0.15*i,0.7)),lit:[0,1,2,3,4,5].map(i=>ag_io(tt,P.each+0.12*i,c.breath-0.3,0.3))},
        glow:ag_io(tt,P.bfor,c.breath,0.5)});
      hw_count(x,476,250,560,{a:ag_in(tt,P.cnt,0.4),k:ag_spr(tt,P.cnt)});})}
  ],0.6);
  hw_tags(ctx,S,t,[[0.6,c.stands,HW_TAG_1755],[c.stands+0.5,c.uni,HW_TAG_TODAY]]);
  setScreen(ctx,S);ag_pill(ctx,1660,300,"All Saints' Day",{a:ag_io(t,c.saints+0.1,c.shakes-0.2,0.4)});
  hw_ways3(ctx,S,t,P.w,c.engineers-0.5);
  ag_title(ctx,S,t,c.breath,"How it goes wrong","six ways an agent goes wrong, and a design for each","FILM 6 OF 9 · AGENTS AT WORK ON DATA");});

/* ---------------------------------------------------------------- 2 · A column that isn't there */
scene("column",(ctx,S,t,sc)=>{const c=sc.cues,P=hw_once(sc,"P",()=>({cs:wAt(sc,"draft","census status"),sr:wAt(sc,"sounds","sounds right"),
    no:wAt(sc,"sounds","no such column"),cat:wAt(sc,"catalog","the catalog"),before:wAt(sc,"catalog","before it writes"),
    sb:wAt(sc,"sandbox","in its sandbox"),stops:wAt(sc,"sandbox","stops the build"),takes:wAt(sc,"shock","takes the shock"),
    fixes:wAt(sc,"fix","fixes the line"),again:wAt(sc,"fix","builds again")}));
  const row=tt=>hw_rowAt(1,ag_sine((tt-0.9)/0.8),ag_in(tt,1.0,0.5)*(1-ag_in(tt,sc.dur-1.8,0.8)));
  // the agent's arms: down to the tray, to put its draft there; out to the Catalog, to read the real names (data comes back)
  const reach=(x,tt)=>{let u=ag_sine((tt-c.draft+0.2)/0.6)*(1-ag_sine((tt-c.draft-1.2)/0.6));if(u>0.01)ag_reach(x,hw_armTo(HR.tray.x+46,HR.tray.y-52,{bow:36,bow2:-12}),u,{});
    u=ag_sine((tt-P.cat+0.3)/0.7)*(1-ag_sine((tt-P.before-0.6)/0.7));if(u>0.01)ag_reach(x,hw_armTo(HR.tool.x,HR.tool.y+56),u,{data:clamp((tt-P.cat+0.1)/1.2,0,1)});};
  ag_shots(ctx,S,t,sc.dur,[
    // Jun asks for a draft; it reads a column called census status, which sounds right; the database finds no such column, and never guesses;
    // so the agent reads the real names from the catalog first, and builds in its sandbox, where a wrong name stops the build
    {at:0,place:"hwLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      hw_base(x,tt,{six:row(tt),chip:"draft",chipA:ag_in(tt,c.draft+0.5,0.3)*(1-ag_in(tt,c.shock-0.6,0.4)),
        think:Math.min(1,ag_io(tt,c.draft-0.4,c.draft+1.4,0.4)+ag_io(tt,c.likely,c.never,0.5)),glow:ag_io(tt,P.sb,c.shock-0.2,0.4),
        under:x=>{reach(x,tt);hw_tool(x,"Catalog",{a:ag_io(tt,P.cat-0.5,c.shock-0.4,0.5),touch:ag_io(tt,P.cat+0.3,P.before+0.6,0.3)});}});
      hw_chapter(x,1,{a:ag_io(tt,c.first,c.asks-0.1,0.4),k:ag_spr(tt,c.first)});
      hw_card(x,476,300,560,"Jun","Draft the census-day count by faculty",null,{tail:{side:"left",at:0.5,px:404,py:452},a:ag_io(tt,c.asks+0.3,c.draft-0.1,0.4),k:ag_spr(tt,c.asks+0.3)});
      hw_draft(x,476,190,{hl:ag_in(tt,P.cs,0.4),a:ag_in(tt,c.draft+0.3,0.4)*(1-ag_in(tt,c.shock-0.8,0.5)),k:ag_spr(tt,c.draft+0.3)});
      ag_pill(x,740,456,"sounds right",{col:AG.violet,a:ag_io(tt,P.sr,c.catalog-0.3,0.4)});
      hw_build(x,476,520,false,{a:ag_io(tt,P.no,c.catalog-0.2,0.4),k:ag_spr(tt,P.no),glow:ag_io(tt,c.never,c.never+1.8,0.4)});
      hw_catalog(x,476,500,{a:ag_io(tt,P.cat+0.6,c.shock-0.6,0.4),rows:clamp((tt-P.cat-0.8)/1.0,0,1),lit:ag_in(tt,P.before,0.5)});
      ag_verdict(x,HR.tray.x,672,"the build stops","fail",ag_io(tt,P.stops,c.shock-0.4,0.3));}},
    // like the cage in Lisbon's walls, the sandbox takes the shock: the house sways, and settles
    {at:c.shock,place:"hwStreet",keys:[[c.shock,960,540,1]],push:0.03,draw:(x,tt)=>{const u=Math.max(0,tt-P.takes+0.4);
      hw_cutaway(x,960,836,1,{sway:tt>P.takes-0.4?0.05*Math.exp(-2.3*u)*Math.sin(5.2*u):0});}},
    // then the agent fixes the line, and builds again: it builds
    {at:c.fix,place:"hwLab",keys:[[c.fix,960,540,1]],push:0,draw:(x,tt)=>{const o=hw_out(tt,sc);
      hw_base(x,tt,{six:row(tt),chip:"draft",chipA:o,think:ag_io(tt,c.fix,P.fixes+0.8,0.4)});
      hw_draft(x,476,190,{fix:tt>P.fixes+0.2?1:0,hl:1,a:o});
      hw_build(x,476,450,true,{a:ag_in(tt,P.again,0.4)*o,k:ag_spr(tt,P.again)});}}
  ],0.6);
  hw_tags(ctx,S,t,[[c.shock+0.5,c.fix,HW_TAG_1755]]);});

/* ---------------------------------------------------------------- 3 · A confident wrong number */
scene("number",(ctx,S,t,sc)=>{const c=sc.cues,P=hw_once(sc,"P",()=>({once:wAt(sc,"once","at once"),every:wAt(sc,"counted","every degree"),
    thirty:wAt(sc,"joint","thirty-one"),withq:wAt(sc,"query","with its query"),second:wAt(sc,"query","a second way")}));
  const row=tt=>hw_rowAt(2,ag_sine((tt-0.9)/0.8),ag_in(tt,1.0,0.5)*(1-ag_in(tt,sc.dur-1.8,0.8)));
  const report=(x,y,a,k)=>hw_card(x,476,y,640,"Census team's report","Faculty of Health: 2,880",null,{kickCol:AG.blue,edge:AG.blue,edgeA:0.5,a,k});
  ag_shots(ctx,S,t,sc.dur,[
    // Clara asks how many students Health had; the agent answers at once, and sounds sure; but it counted every degree with Health in its
    // name, the joint degree's 31 too; Health had 2,880
    {at:0,place:"hwLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      hw_base(x,tt,{six:row(tt),right:"clara",ra:ag_in(tt,c.clara-0.4,0.6),think:ag_io(tt,c.once-0.2,P.once+0.3,0.3)});
      hw_chapter(x,2,{a:ag_io(tt,c.second,c.clara,0.4),k:ag_spr(tt,c.second)});
      hw_card(x,476,190,720,"Clara · Planning","How many students did the Faculty of Health have on census day?",null,{a:ag_io(tt,c.clara+0.3,P.once-0.1,0.3),k:ag_spr(tt,c.clara+0.3)});
      const ka=ag_spr(tt,P.once,0.6),aa=ag_in(tt,P.once,0.2)*(1-ag_in(tt,c.parish-0.9,0.5));
      if(aa>0)withA(x,aa,()=>{x.save();ag_about(x,796,308,lerp(0.6,1,ka));
        hw_turn(x,796,308,ag_sine((tt-P.every)/0.7),(q,ta)=>hw_answer(q,476,190,640,ta),(q,ta)=>hw_counted(q,476,190,640,ta,ag_in(tt,P.thirty,0.5)));x.restore();});
      ag_pill(x,740,470,"sounds sure",{col:AG.violet,a:ag_io(tt,c.sure,P.every-0.2,0.3)});
      report(x,520,ag_io(tt,c.had,c.parish-0.9,0.4),ag_spr(tt,c.had));}},
    // in Lisbon, every parish answered the same questions: three answers, side by side, in three hands
    {at:c.parish,place:"hwDesk",keys:[[c.parish,960,540,1]],push:0.03,draw:(x,tt)=>hw_answers(x,tt,{t0:c.parish+0.2})},
    // so every number comes with its query, and a second way to reach it: where the two differ, it's a question for a person
    {at:c.query,place:"hwLab",keys:[[c.query,960,540,1]],push:0,draw:(x,tt)=>{const o=hw_out(tt,sc),q=1-ag_in(tt,c.person-0.3,0.4);
      hw_base(x,tt,{six:row(tt),right:"clara",jp:{gaze:tt>c.person?[4,-2]:[3,0]}});
      if(q>0)withA(x,q,()=>{hw_answer(x,476,190,640,1);hw_queryTab(x,500,438,ag_in(tt,P.withq,0.4));
        report(x,584,ag_in(tt,P.second,0.4),ag_spr(tt,P.second));
        ag_pill(x,1000,530,"differs by 31",{col:AG.amber,a:ag_in(tt,c.differ,0.4)});});
      hw_card(x,476,300,640,"To Jun","Count Health data in Health?","the joint degree belongs to no faculty",{kickCol:AG.violet,tail:{side:"left",at:0.4,px:404,py:452},
        a:ag_in(tt,c.person+0.1,0.4)*o,k:ag_spr(tt,c.person+0.1)});}}
  ],0.6);
  hw_tags(ctx,S,t,[[c.parish+0.5,c.query,HW_TAG_1755]]);});

/* ---------------------------------------------------------------- 4 · A test weakened to pass */
scene("test",(ctx,S,t,sc)=>{const c=sc.cues,P=hw_once(sc,"P",()=>({warn:wAt(sc,"team","to warn"),caught:wAt(sc,"team","Jun caught it"),
    written:wAt(sc,"people","written first"),lists:wAt(sc,"lists","lists the tests"),owner:wAt(sc,"lists","each with its owner")}));
  const row=tt=>hw_rowAt(3,ag_sine((tt-0.9)/0.8),ag_in(tt,1.0,0.5)*(1-ag_in(tt,sc.dur-1.8,0.8)));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"hwLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{const o=hw_out(tt,sc),nd=ag_sine((tt-c.decides-0.3)/0.5)*(1-ag_sine((tt-c.decides-1.1)/0.5));
      hw_base(x,tt,{six:row(tt),jp:{gaze:tt>c.decides?[3,-1]:[3,0],nod:0.06*nd}});
      hw_chapter(x,3,{a:ag_io(tt,c.third,c.research-0.1,0.4),k:ag_spr(tt,c.third)});
      // researchers have caught recent models changing tests to get a pass
      hw_card(x,476,190,640,"Researchers · 2025","Recent models changed tests to get a pass",null,{a:ag_io(tt,c.research+0.2,c.team-0.1,0.4),k:ag_spr(tt,c.research+0.2)});
      // from An agent on the team: the draft that set the census check to warn, caught in review by Jun
      hw_lines(x,476,190,0,"From An agent on the team",[{t:"reconcile_planning_with_census_report",mono:true},
        {t:"+ severity: warn",mono:true,col:AG.amber,hl:ag_in(tt,P.warn,0.4),hlCol:AG.amber,strike:ag_in(tt,P.caught+0.4,0.6)},
        {t:"caught in review by Jun",col:AG.green,tick:true,a:ag_in(tt,P.caught,0.4)}],
        {a:ag_io(tt,c.team+0.2,c.people-0.2,0.4)*(1-0.45*ag_in(tt,c.eye+0.3,0.6)),k:ag_spr(tt,c.team+0.2)});
      // tests belong to people: the plan's line for tests
      hw_plan2(x,476,190,700,HW_PLAN,{lit:2,litA:ag_in(tt,P.written,0.5),a:ag_io(tt,c.people+0.1,c.lists-0.1,0.4),k:ag_spr(tt,c.people+0.1)});
      // every pull request lists the tests it changes, each with its owner; the agent may propose; a person decides
      hw_pr(x,476,190,740,{sec:ag_in(tt,P.lists,0.5),own:ag_in(tt,P.owner,0.5),a:ag_in(tt,c.lists+0.1,0.4)*o,k:ag_spr(tt,c.lists+0.1)});
      hw_pillL(x,476,580,"proposed by the agent",{col:AG.violet,icon:"draft",a:ag_in(tt,c.propose+0.2,0.4)*o});
      hw_pillL(x,476,660,"Jun decides",{col:AG.green,icon:"tick",a:ag_in(tt,c.decides,0.4)*o});}}
  ],0.6);});

/* ---------------------------------------------------------------- 5 · A line hidden in a ticket */
scene("ticket",(ctx,S,t,sc)=>{const c=sc.cues,P=hw_once(sc,"P",()=>({white:wAt(sc,"white","in white letters"),
    pl:[wAt(sc,"risk","a file"),wAt(sc,"risk","a table"),wAt(sc,"risk","a web page")],order:wAt(sc,"tell","an order from data"),
    rely:wAt(sc,"tell","doesn't rely on it"),hand:wAt(sc,"data","no hand it holds"),out:wAt(sc,"data","send anything out")}));
  const row=tt=>hw_rowAt(4,ag_sine((tt-0.9)/0.8),ag_in(tt,1.0,0.5)*(1-ag_in(tt,c.walls-1.0,0.8)));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"hwLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{const end=1-ag_in(tt,c.walls-0.9,0.5);
      hw_base(x,tt,{six:row(tt),think:ag_io(tt,c.tell,P.rely,0.5),jp:{gaze:tt>c.didnt&&tt<c.risk?[4,-2]:[3,0]}});
      hw_chapter(x,4,{a:ag_io(tt,c.fourth,c.hands+0.2,0.4),k:ag_spr(tt,c.fourth)});
      // Clara's ticket, and at its foot, in white letters, a line for the agent
      hw_ticket(x,476,200,700,{hid:clamp((tt-P.white)/1.4,0,1),a:ag_io(tt,c.hands+0.5,c.didnt-0.2,0.4),k:ag_spr(tt,c.hands+0.5)});
      // it didn't, and it told Jun
      hw_card(x,476,300,640,"The agent, to Jun","Clara's ticket hides an instruction","to send the student list out · not followed",{kickCol:AG.violet,
        tail:{side:"left",at:0.4,px:404,py:452},a:ag_io(tt,c.didnt+0.1,c.risk-0.2,0.4),k:ag_spr(tt,c.didnt+0.1)});
      // security experts put this risk first: anything it reads can try to steer it, a file, a table or a web page
      hw_card(x,476,196,640,"Security experts' list","Risk 1: what it reads can steer it",null,{kickCol:AG.amber,edge:AG.amber,edgeA:0.6,
        a:ag_io(tt,c.risk+0.2,c.data-0.2,0.4),k:ag_spr(tt,c.risk+0.2)});
      ["a file","a table","a web page"].forEach((s,i)=>hw_place(x,476+i*264,380,s,{a:ag_io(tt,P.pl[i],c.data-0.2,0.4),k:ag_spr(tt,P.pl[i])}));
      ag_pill(x,800,626,"an order, or data?",{col:AG.violet,a:ag_io(tt,P.order,c.data-0.2,0.4)});
      // what it reads is data, never orders, and no hand it holds can send anything out
      hw_rule(x,476,196,780,{a:ag_in(tt,c.data+0.1,0.4)*end,k:ag_spr(tt,c.data+0.1)});
      hw_tools6(x,476,476,{a:[0,1,2,3,4,5].map(i=>ag_in(tt,P.hand+0.1*i,0.4)*end)});
      hw_pillL(x,476,790,"No tool can send anything out",{icon:"lock",col:AG.blue,a:ag_in(tt,P.out,0.4)*end});}},
    // like the walls above Lisbon's roofs, the fire stops where it starts
    {at:c.walls,place:"hwRow",keys:[[c.walls,980,560,1.04]],push:0.03,draw:(x,tt)=>hw_roofFire(x,tt,c.walls+0.2,1)}
  ],0.6);
  hw_tags(ctx,S,t,[[c.walls+0.5,sc.dur-0.1,HW_TAG_1755]]);});

/* ---------------------------------------------------------------- 6 · A loop all night */
scene("loop",(ctx,S,t,sc)=>{const c=sc.cues,P=hw_once(sc,"P",()=>({at11:wAt(sc,"eleven","At eleven"),fails:wAt(sc,"eleven","the census build fails"),
    job:wAt(sc,"eleven","its agreed job"),find:wAt(sc,"eleven","find the cause"),morning:wAt(sc,"eleven","report by morning"),
    copy:wAt(sc,"cause","the student system's copy"),change:wAt(sc,"round","changes something"),six:wAt(sc,"ten","until six"),
    nothing:wAt(sc,"counted","and nothing else"),week:wAt(sc,"sam","a week's budget"),stopsw:wAt(sc,"limits","stops when"),
    nstart:wAt(sc,"plain","nothing starts"),told:wAt(sc,"plain","Sam is told")}));
  const row=tt=>hw_rowAt(5,ag_sine((tt-0.9)/0.8),ag_in(tt,1.0,0.5)*(1-ag_in(tt,sc.dur-1.8,0.8)));
  // the night's ten rounds: the first slowly (the agent changes something, rebuilds, the same error); the other nine quickly, until six
  const R0=P.change-0.3,RT=i=>i===0?R0:c.ten-0.2+(i-1)*(P.six+0.5-c.ten)/8,RD=i=>i===0?2.4:0.42;
  const done=tt=>{let n=0;for(let i=0;i<10;i++)n+=clamp((tt-RT(i))/RD(i),0,1);return n;};
  const clockAt=tt=>{const m=Math.round(420*clamp((tt-R0)/(RT(9)+RD(9)-R0),0,1)/10)*10,h=(23+Math.floor(m/60))%24;return String(h).padStart(2,"0")+":"+String(m%60).padStart(2,"0");};
  // the room at night, until the dawn (0 to 1) brings the day back: the tray, the agent, the lamp, the kicker, the six ways
  const night=(x,tt,o)=>{const dawn=o.dawn||0,A=HR.agent;if(dawn>0)withA(x,dawn,()=>x.drawImage(ag_place("hwLab"),0,0,W,H));
    hw_tray(x,{});if(o.chipA>0)hw_chip(x,HR.tray.x,HR.tray.y-36,"change",{a:o.chipA});
    hw_agent(x,tt,{think:o.think||0,pulse:o.pulse});if(o.under)o.under(x);
    if(dawn<1)ag_roomLight(x,1-dawn,{night:true,lamp:HR.lamp});if(dawn>0)ag_roomLight(x,dawn);
    if(dawn<1)ag_model(x,A.x,A.y,A.r,{only:"light",t:tt,think:o.think||0,a:1-dawn});
    x.save();setScreen(x,S);HW_KICK(x,{dark:dawn<0.5});x.restore();hw_six(x,row(tt));};
  ag_shots(ctx,S,t,sc.dur,[
    // at eleven one night the census build fails; the agent's agreed job, in test: find the cause, report by morning; but the copy
    // hasn't arrived; each round it changes something and rebuilds everything: ten rounds, the same error, until six
    {at:0,place:"hwLabNight",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{const n=done(tt),ph=n-Math.floor(n),dawn=ag_sine((tt-P.six-0.3)/1.8);
      const arm=i=>{const u=ag_sine((tt-RT(i))/(i?0.14:0.5))*(1-ag_sine((tt-RT(i)-(i?0.22:1.2))/(i?0.14:0.5)));if(u>0.01)ag_reach(x,hw_armTo(HR.tray.x+46,HR.tray.y-52,{bow:36,bow2:-12}),u,{});};
      night(x,tt,{dawn,think:ag_io(tt,c.cause-0.2,P.copy+0.6,0.4),chipA:ag_io(tt,R0+0.6,c.counted-0.6,0.3),
        pulse:n>0&&n<10?{deg:(ph*360-90+360)%360,a:1}:null,under:x=>{for(let i=0;i<10;i++)if(tt>RT(i)-0.2&&tt<RT(i)+1.8)arm(i);}});
      hw_chapter(x,5,{a:ag_io(tt,c.fifth,c.eleven-0.1,0.4),k:ag_spr(tt,c.fifth)});
      hw_clock(x,1650,226,tt<R0?"23:00":clockAt(tt),{a:ag_io(tt,P.at11,c.counted-0.6,0.4),k:ag_spr(tt,P.at11)});
      hw_card(x,476,190,560,"Census build","Failed",null,{kickCol:AG.amber,edge:AG.amber,edgeA:0.6,a:ag_io(tt,P.fails,P.copy-0.6,0.4),k:ag_spr(tt,P.fails)});
      hw_lines(x,476,420,0,"Agreed job · in test",[{t:"find the cause",a:ag_in(tt,P.find,0.4)},{t:"report by morning",a:ag_in(tt,P.morning,0.4)}],
        {kickCol:AG.blue,edge:AG.blue,edgeA:0.5,a:ag_io(tt,P.job,P.copy-0.6,0.4),k:ag_spr(tt,P.job)});
      hw_source(x,476,190,560,{a:ag_io(tt,P.copy-0.2,R0+0.2,0.4),k:ag_spr(tt,P.copy-0.2)});
      hw_rounds(x,476,190,560,done(tt+0.3),{a:ag_io(tt,R0+0.3,c.counted-0.5,0.4)});
      ag_pill(x,1730,380,"round "+Math.min(10,Math.max(1,Math.ceil(n))),{icon:"loop",col:AG.amber,a:ag_io(tt,R0+0.2,c.counted-0.6,0.3)});}},
    // in the morning: its limit counted rounds and nothing else; Sam finds a week's budget gone; now every loop has limits on rounds,
    // time and money, and stops when the same error comes back; and a plain check runs first: no copy, nothing starts, Sam is told
    {at:c.counted,place:"hwLab",keys:[[c.counted,960,540,1]],push:0,draw:(x,tt)=>{const o=hw_out(tt,sc);
      hw_base(x,tt,{six:row(tt),right:"sam",ra:ag_in(tt,c.sam-0.3,0.6),core:1-0.7*ag_in(tt,P.nstart,0.6)});
      hw_lines(x,476,190,560,"Limit",[{t:"10 rounds, then report"},{t:"time: none · money: none",col:AG.amber,a:ag_in(tt,P.nothing,0.4)}],
        {kickCol:AG.amber,edge:AG.amber,edgeA:0.6,a:ag_io(tt,c.counted+0.2,c.limits-0.2,0.4),k:ag_spr(tt,c.counted+0.2)});
      hw_budget(x,476,420,560,ag_sine((tt-P.week)/1.6),{a:ag_io(tt,P.week-0.3,c.limits-0.2,0.4),k:ag_spr(tt,P.week-0.3)});
      hw_lines(x,476,190,640,"Limits",[{t:"10 rounds · 1 hour · a set budget"},{t:"the same error twice: stop and report",col:AG.blue,a:ag_in(tt,P.stopsw,0.4)}],
        {kickCol:AG.blue,edge:AG.blue,edgeA:0.6,a:ag_in(tt,c.limits+0.1,0.4)*o,k:ag_spr(tt,c.limits+0.1)});
      const pc=hw_card(x,476,420,640,"Plain check · first","Has tonight's copy arrived?",null,{kickCol:AG.blue,edge:AG.blue,edgeA:0.6,a:ag_in(tt,c.plain+0.2,0.4)*o,k:ag_spr(tt,c.plain+0.2)});
      withA(x,ag_in(tt,c.plain+0.2,0.4)*o,()=>hw_gear(x,pc.x+pc.w-48,pc.y+48,13,rgba(AG.blue,1)));
      const p1=hw_pillL(x,476,pc.y+pc.h+52,"no: nothing starts",{col:AG.blue,a:ag_in(tt,P.nstart,0.4)*o});
      hw_pillL(x,p1.x+p1.w+20,pc.y+pc.h+52,"Sam is told",{col:AG.blue,a:ag_in(tt,P.told,0.4)*o});}}
  ],0.6);});

/* ---------------------------------------------------------------- 7 · A simple job made complicated */
scene("simple",(ctx,S,t,sc)=>{const c=sc.cues,P=hw_once(sc,"P",()=>({n38:wAt(sc,"long","thirty-eight web pages"),docs:wAt(sc,"long","Docs gives"),
    nine:wAt(sc,"rename","nine changed files"),macro:wAt(sc,"rename","a new macro"),run:wAt(sc,"costs","to run"),
    names:wAt(sc,"names","names its tools"),back:wAt(sc,"names","Jun sends back"),nobody:wAt(sc,"keep","nobody can write down")}));
  const row=tt=>hw_rowAt(6,ag_sine((tt-0.9)/0.8),ag_in(tt,1.0,0.5)*(1-ag_in(tt,sc.dur-1.8,0.8)));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"hwLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{const o=hw_out(tt,sc);
      hw_base(x,tt,{six:row(tt),think:ag_in(tt,P.nobody,0.6)*o});
      hw_chapter(x,6,{a:ag_io(tt,c.sixth,c.long-0.1,0.4),k:ag_spr(tt,c.sixth)});
      // the long way: 38 web pages in 40 minutes, for rules Docs gives in one call, because its plan didn't name its tools
      hw_card(x,476,190,620,"From","Plan, define the check, do, check",null,{a:ag_io(tt,c.long+0.2,P.n38-0.5,0.4),k:ag_spr(tt,c.long+0.2)});
      hw_card(x,476,190,340,"The long way","38 web pages","40 minutes",{kickCol:AG.amber,edge:AG.amber,edgeA:0.6,a:ag_io(tt,P.n38,c.rename-0.2,0.4),k:ag_spr(tt,P.n38)});
      hw_card(x,846,190,300,"Docs","1 call",null,{kickCol:AG.blue,edge:AG.green,edgeA:0.7,icon:"tick",a:ag_io(tt,P.docs,c.rename-0.2,0.4),k:ag_spr(tt,P.docs)});
      hw_plan2(x,476,420,640,[["Goal","the census rules, to check the count"],["Tools","not named"]],{title:"Check the count",lit:1,litCol:AG.amber,
        a:ag_io(tt,c.tools,c.rename-0.2,0.4),k:ag_spr(tt,c.tools)});
      // asked to rename one column: nine changed files, a new macro and a new model; every extra step costs, to run and to review
      hw_card(x,476,300,460,"Jun asks","Rename one column",null,{tail:{side:"left",at:0.5,px:404,py:452},a:ag_io(tt,c.rename+0.2,c.names-0.2,0.4),k:ag_spr(tt,c.rename+0.2)});
      hw_lines(x,476,480,0,"Pull request",[{t:"9 files changed",col:AG.amber},{t:"a new macro · a new model",col:AG.amber,a:ag_in(tt,P.macro,0.4)}],
        {kickCol:AG.violet,edge:AG.amber,edgeA:0.6,a:ag_io(tt,P.nine,c.names-0.2,0.4),k:ag_spr(tt,P.nine)});
      hw_costs(x,980,300,(tt-P.run)/1.4,{a:ag_io(tt,P.run-0.2,c.names-0.2,0.4)});
      // so each plan names its tools, and Jun sends back a change bigger than its job
      hw_plan2(x,476,190,700,HW_PLAN,{lit:1,litA:ag_in(tt,P.names,0.5),a:ag_io(tt,c.names+0.1,c.script-0.2,0.4),k:ag_spr(tt,c.names+0.1)});
      hw_card(x,476,600,560,"Jun · review","Sent back","bigger than its job",{kickCol:AG.amber,edge:AG.amber,edgeA:0.6,a:ag_io(tt,P.back,c.script-0.2,0.4),k:ag_spr(tt,P.back)});
      // where the steps can be written down, a plain script runs them; agents for the work nobody can write down in advance
      const pa=ag_in(tt,c.script+0.2,0.4)*o,pb=hw_card(x,476,190,380,"Plain script","Steps written down",null,{kickCol:AG.blue,edge:AG.blue,edgeA:0.6,a:pa,k:ag_spr(tt,c.script+0.2)});
      if(pa>0)withA(x,pa,()=>hw_gear(x,pb.x+pb.w-48,pb.y+48,13,rgba(AG.blue,1)));
      hw_card(x,876,190,380,"Agent","Work nobody can write down in advance",null,{kickCol:AG.violet,edge:AG.violet,edgeA:0.6,a:ag_in(tt,c.keep+0.2,0.4)*o,k:ag_spr(tt,c.keep+0.2)});}}
  ],0.6);});

/* ---------------------------------------------------------------- 8 · Expect these */
scene("expect",(ctx,S,t,sc)=>{const c=sc.cues,P=hw_once(sc,"P",()=>({design:wAt(sc,"six","a design for each"),stands:wAt(sc,"expected","the lower town still stands"),
    num:wAt(sc,"same","the number the university reports"),stand:wAt(sc,"count","stand behind it")}));
  const all=[1,1,1,1,1,1];
  ag_shots(ctx,S,t,sc.dur,[
    // six ways an agent goes wrong, and a design for each: the six come down into a grid and turn over, from amber to green
    {at:0,place:"hwLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{ag_roomLight(x,1);HW_KICK(x);
      hw_grid(x,{m:[0,1,2,3,4,5].map(i=>(tt-0.9-0.06*i)/0.8),u:[0,1,2,3,4,5].map(i=>(tt-1.84-0.06*i)/0.55),f:[0,1,2,3,4,5].map(i=>ag_sine((tt-P.design+0.2-0.36*i)/0.6))});}},
    // Lisbon's builders didn't blame the ground, or hope it would stay still: the house and its cage
    {at:c.blame,place:"hwStreet",keys:[[c.blame,960,540,1]],push:0.03,draw:(x,tt)=>hw_cutaway(x,960,836,1,{})},
    // they expected each way the city had failed, and built for it: the walls above the roofs
    {at:c.expected,place:"hwRow",keys:[[c.expected,980,560,1.04]],push:0.03},
    // and the lower town still stands: its street at evening
    {at:P.stands-0.2,place:"hwEvening",keys:[[P.stands-0.2,960,540,1]],push:0.04,draw:(x,tt)=>hw_walkers(x,tt-P.stands+4)},
    // Jun's team does the same: the six ways designed for, and the census-day count, checked two ways, that the team stands behind
    {at:c.same,place:"hwLab",keys:[[c.same,960,540,1]],push:0,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.8),()=>{
      hw_base(x,tt,{six:{up:all,done:all,lit:[0,1,2,3,4,5].map(i=>ag_io(tt,P.stand+0.1*i,P.stand+1.6+0.1*i,0.4))},glow:ag_io(tt,c.count,c.breath,0.6)});
      hw_count(x,476,250,600,{ok:true,a:ag_in(tt,P.num,0.4),k:ag_spr(tt,P.num)});})}
  ],0.6);
  hw_tags(ctx,S,t,[[c.blame+0.5,P.stands-0.2,HW_TAG_1755],[P.stands+0.3,c.same,HW_TAG_TODAY]]);
  ag_end(ctx,S,t,c.breath,"How it goes wrong","Expect these, and design for them.","Film 6 of 9","Agents at work on data");});
