/* ===== Measures that matter: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. What the team's screen shows changes by sliding
   across it, like a turned page, never by fading one view over another. Sizes in the 1920 x 1080 frame. */

const MM_TITLE="Measures that matter",MM_LAST="Few measures, each with a baseline and a decision.";
// the team's room in July's morning light, and on a grey December day; the screen on its wall, where the page is shown
AG_PLACES.mmJuly=c=>lp_paintRoom(c,{light:"morning",seed:6});
AG_PLACES.mmDec=c=>lp_paintRoom(c,{light:"grey",seed:6});
const MM_SCR={x:96,y:150,w:1240,h:680},MM_RX=1640;
function mm_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"2",MM_TITLE,{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function mm_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
const mm_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
function mm_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function mm_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
function mm_fig(ctx,t,t0,t1,x,y,w,words,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.35);if(a>0.004)lp_figure(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// bars that each grow at their own word (ts), their value shown once grown; the labels under them are there from the start
function mm_bars(ctx,t,x,y,w,h,bars,ts,o){lp_bars(ctx,x,y,w,h,bars.map((b,i)=>{const u=ts[i]==null?1:ag_in(t,ts[i],0.7);return{v:b.v*ag_eo(u),label:b.label,show:u>0.98?b.show:null};}),o);}
// the screen on the team's wall, lit; what it shows slides across like a turned page: views [[from, draw(ctx, X, Y, Wd, Hd)], ...].
// While it slides, the two views are drawn on a spare canvas and laid on the glass, which hides what is off it.
function mm_screen(ctx,t,views,o){o=o||{};const S0=MM_SCR,a=o.a==null?1:o.a;if(a<=0.004)return;
  lp_screen(ctx,S0.x,S0.y,S0.w,S0.h,{a,draw:(cx,X,Y,Wd,Hd)=>{let i=0;for(let k=0;k<views.length;k++)if(t>=views[k][0])i=k;
    const u=i>0?ag_sine(clamp((t-views[i][0])/0.8,0,1)):1;
    if(u<1){const m=cx.getTransform(),[bc,bx]=ag_buf("mmSlide",cx.canvas.width,cx.canvas.height);bx.setTransform(m);
      bx.save();bx.translate(-Wd*u,0);views[i-1][1](bx,X,Y,Wd,Hd);bx.restore();bx.save();bx.translate(Wd*(1-u),0);views[i][1](bx,X,Y,Wd,Hd);bx.restore();
      cx.save();cx.setTransform(1,0,0,1,0,0);cx.drawImage(bc,0,0);cx.restore();}
    else views[i][1](cx,X,Y,Wd,Hd);}});}
// each measure's tile coming in at its own time
const mm_tilesIn=(t,ts)=>ts.map(t0=>t0==null?0:ag_in(t,t0,0.5));
// the 1952 room's people, where the story puts them
const MM_MO={light:"morning",wall:0.1};
const mm_apgarAt=(x,tt,X,flip,a,o)=>lp_person(x,MM_PEOPLE.apgar,X,700,0.78,Object.assign({t:tt,flip,a,light:MM_MO},o||{}));
const mm_nurseAt=(x,tt,X,flip,a,o)=>lp_person(x,MM_PEOPLE.nurse,X,706,0.76,Object.assign({t:tt,flip,a,light:MM_MO},o||{}));
const mm_juniorAt=(x,tt,a)=>lp_person(x,MM_PEOPLE.junior,1790,700,0.78,{t:tt,flip:true,a,light:MM_MO});

/* ---------------------------------------------------------------- 1. The first minute: New York, 1952 */
scene("minute",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const cot=(x,tt,o)=>mm_cot(x,1500,700,tt,o),blue0=w("harm","trouble",-0.4);
  ag_shots(ctx,S,t,sc.dur,[
    // New York, 1952: a delivery room, the baby in its cot
    {at:0,place:"mmDelivery",keys:[[0,960,560,1.06],[c.when+0.4,960,540,1.0]],d:3,draw:(x,tt)=>{mm_clock(x,tt);cot(x,tt);
      mm_sheet(x,tt,w("when","York",-0.4),640,140,640,{kick:"New York, 1952",title:"A delivery room",sub:"At the Sloane Hospital for Women"},{light:"morning",out:c.apgar-0.6});}},
    // Dr Virginia Apgar, there for the mothers
    {at:c.apgar-0.3,place:"mmDelivery",keys:[[c.apgar-0.3,900,540,1.08]],draw:(x,tt)=>{mm_clock(x,tt);cot(x,tt);
      mm_apgarAt(x,tt,660,true,ag_in(tt,c.apgar-0.1,0.6));
      mm_sheet(x,tt,w("apgar","Virginia",-0.3),900,150,620,{kick:"An anaesthetist",title:"Dr Virginia Apgar",lines:["She keeps the mothers out of pain"]},
        {light:"morning",u:ag_in(tt,w("apgar","pain",-0.5),0.5),out:c.deaths-0.5});}},
    // in America, the deaths of the first weeks and the first day; at least half from a lack of oxygen
    {at:c.deaths-0.3,place:"mmHall",keys:[[c.deaths-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      mm_fig(x,tt,w("deaths","America",-0.2),null,200,140,700,{kick:"In America, 1950",num:"1 in 50",label:"Babies who die in their first four weeks"},{col:LP.amber,light:"morning"});
      mm_sheet(x,tt,w("deaths","day",-0.4),1000,140,720,{kick:"Deaths in the first day",title:"Hardly fallen in 20 years"},{col:LP.amber,light:"morning"});
      mm_sheet(x,tt,w("air","half",-0.4),460,500,1000,{kick:"At least half of them",title:"From a lack of oxygen",lines:["A baby who can't breathe well","Who needs help in its first minutes"]},
        {col:LP.amber,light:"morning",u:mm_u(tt,[w("air","breathe",-0.3),w("air","help",-0.3)])});}},
    // in the room, everyone looks after the mother; the newborn is left to the most junior doctor
    {at:c.mother-0.3,place:"mmDelivery",keys:[[c.mother-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{mm_clock(x,tt);
      mm_juniorAt(x,tt,1);cot(x,tt);mm_nurseAt(x,tt,900,true,1);mm_apgarAt(x,tt,660,true,1);
      mm_tag(x,tt,w("mother","everyone",-0.2),c.words-0.4,600,330,"Everyone looks after the mother",{align:"center",col:LP.ink});
      mm_tag(x,tt,w("mother","junior",-0.3),c.words-0.4,1500,330,"The newborn: the most junior doctor",{align:"center",col:LP.amber});}},
    // is the baby well? each doctor's own words for it
    {at:c.words-0.3,place:"mmDelivery",keys:[[c.words-0.3,960,540,1.0],[c.words-0.1,1240,560,1.22]],d:2.2,draw:(x,tt)=>{mm_clock(x,tt);
      mm_juniorAt(x,tt,1);cot(x,tt);mm_nurseAt(x,tt,900,true,1);mm_apgarAt(x,tt,660,true,1);
      mm_tag(x,tt,w("words","baby",-0.2),c.harm-0.4,1500,560,"Is the baby well?",{align:"center",col:LP.ink});
      mm_tag(x,tt,w("words","mild",-0.2),c.harm-0.4,1640,330,"“Mild”",{align:"center",col:LP.ink});
      mm_tag(x,tt,w("words","severe",-0.2),c.harm-0.4,700,330,"“Severe”",{align:"center",col:LP.ink});
      mm_pill(x,tt,w("words","means",-0.2),c.harm-0.4,1170,220,"Each means something different",{col:LP.amber});}},
    // so a baby in trouble can be missed, and no hospital can tell what helps
    {at:c.harm-0.3,place:"mmDelivery",keys:[[c.harm-0.3,1300,600,1.4]],draw:(x,tt)=>{mm_clock(x,tt);
      mm_juniorAt(x,tt,1);cot(x,tt,{blue:ag_in(tt,blue0,2.0)});mm_nurseAt(x,tt,900,true,1);
      mm_tag(x,tt,w("harm","missed",-0.2),c.score-0.6,1260,430,"Missed until it's too late",{align:"center",col:LP.amber});
      mm_tag(x,tt,w("harm","hospital",-0.2),c.score-0.6,1260,500,"No hospital can tell what helps",{align:"center",col:LP.amber});}},
    // 1952: a score anyone in the room can take, the same way every time
    {at:c.score-0.3,place:"mmDelivery",later:true,keys:[[c.score-0.3,1234,600,1.4],[c.score-0.1,960,540,1.0]],d:2.2,draw:(x,tt)=>{mm_clock(x,tt);cot(x,tt);
      mm_apgarAt(x,tt,1100,false,1,{pose:"hold",hold:mm_holdCard});
      mm_sheet(x,tt,w("score","score",-0.3),380,140,640,{kick:"1952",title:"A score anyone in the room can take",lines:["The same way, every time"]},
        {col:LP.blue,light:"morning",u:ag_in(tt,w("score","same",-0.3),0.5),out:c.signs-0.6});}},
    // the score card: five signs at one minute, each 0, 1 or 2; ten, a baby doing well
    {at:c.signs-0.3,place:"mmDelivery",keys:[[c.signs-0.3,960,540,1.0]],draw:(x,tt)=>{mm_clock(x,tt);cot(x,tt);
      const k0=w("signs","minute",-0.3);
      if(tt>=k0)mm_card(x,420,110,880,{a:ag_in(tt,k0,0.35),k:tt-k0,light:"morning",
        u:mm_u(tt,[w("signs","heartbeat",-0.3),w("signs","breathing",-0.3),w("signs","firmly",-0.4),w("signs","reacts",-0.4),w("signs","colour",-0.3)]),
        cols:ag_in(tt,w("points","zero",-0.3),0.5),marks:[2,2,2,2,2],mk:ag_in(tt,w("points","Ten",-0.4),1.0),total:ag_in(tt,w("points","Ten",0.1),0.5),mcol:LP.green});
      mm_pill(x,tt,w("points","well",-0.3),c.trial-0.4,1500,420,"Ten: a baby doing well",{col:LP.green});}},
    // tried on 1,021 babies; published in 1953
    {at:c.trial-0.3,place:"mmHall",keys:[[c.trial-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      mm_fig(x,tt,w("trial","tries",-0.2),null,220,170,640,{kick:"Tried on",num:"1,021",label:"Babies at the Sloane Hospital"},{col:LP.orange,light:"morning"});
      mm_sheet(x,tt,w("trial","publishes",-0.3),960,170,740,{kick:"Published in 1953",title:"A proposal for a new method of evaluation of the newborn infant",sub:"Virginia Apgar"},{col:LP.blue,light:"morning"});}},
    // a baby in trouble shows at once, as a low score, to everyone in the room
    {at:c.seen-0.3,place:"mmDelivery",keys:[[c.seen-0.3,1120,560,1.2]],dis:1.4,draw:(x,tt)=>{mm_clock(x,tt);
      mm_juniorAt(x,tt,1);cot(x,tt,{blue:0.6,card:ag_in(tt,w("seen","low",-0.3),0.5),score:3,col:LP.amber});
      mm_nurseAt(x,tt,760,false,1);mm_apgarAt(x,tt,1060,false,1);
      mm_pill(x,tt,w("seen","low",-0.1),c.compare-0.4,1500,450,"A low score: seen at once",{col:LP.amber});
      mm_tag(x,tt,w("seen","everyone",-0.2),c.compare-0.4,1000,250,"By everyone in the room",{align:"center",col:LP.ink});}},
    // doctors can compare what they do: after a caesarean, put to sleep 5, a spinal anaesthetic 8
    {at:c.compare-0.3,place:"mmHall",keys:[[c.compare-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const s0=w("compare","compare",-0.4);
      if(tt>=s0){const a=ag_in(tt,s0,0.35);x.save();x.globalAlpha*=a;lp_sheet(x,360,130,1200,680,{col:LP.orange,light:"morning",k:tt-s0});
        lp_T(x,"AFTER A CAESAREAN",396,210,{w:800,size:28,ls:3,col:LP.orange});lp_T(x,"The babies' average score",396,268,{w:800,size:40});
        mm_bars(x,tt,640,330,640,440,[{v:5,label:"The mother put to sleep",show:"5"},{v:8,label:"A spinal anaesthetic",show:"8"}],[w("spinal","five",-0.3),w("spinal","spinal",-0.1)],{max:10});x.restore();}}},
    // by the early 1960s many hospitals; today most, at one minute and again at five
    {at:c.spread-0.3,place:"mmHall",later:true,keys:[[c.spread-0.3,960,540,1.0]],draw:(x,tt)=>{
      mm_sheet(x,tt,w("spread","sixties",-0.4),560,200,800,{kick:"Since then",title:"Every baby, scored",lines:["By the early 1960s: many hospitals","Today: most, at one minute and again at five"]},
        {col:LP.green,light:"morning",u:mm_u(tt,[w("spread","sixties",-0.1),w("spread","today",-0.1)])});}},
    // newborn deaths fell, for many reasons: 20.5, 8.5, 3.9 in every thousand
    {at:c.fell-0.3,place:"mmHall",later:true,keys:[[c.fell-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=c.fell+0.1;
      if(tt>=s0){const a=ag_in(tt,s0,0.35);x.save();x.globalAlpha*=a;lp_sheet(x,360,130,1200,680,{col:LP.green,light:"morning",k:tt-s0});
        lp_T(x,"IN THE UNITED STATES",396,210,{w:800,size:28,ls:3,col:LP.green});lp_T(x,"Newborn deaths, in every 1,000 births",396,268,{w:800,size:40});
        const r=ag_in(tt,w("fell","reasons",-0.3),0.5);if(r>0.004)lp_T(x,"They fell for many reasons",396,318,{w:600,size:28,col:LP.mut,a:r});
        mm_bars(x,tt,620,350,680,420,[{v:20.5,label:"1950",show:"20.5"},{v:3.9,label:"2016",show:"3.9"}],[w("fell","twenty",-0.3),w("fell","sixteen",-0.6)],{max:22});x.restore();}}},
    // a data team, busy every day: do people get what they need? A few measures, taken the same way every month, can show it
    {at:c.data-0.3,place:"mmJuly",keys:[[c.data-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      MM_TEAM.forEach(([who,X,s,flip],i)=>lp_person(x,who,X,760,s,{t:tt,flip,a:ag_in(tt,c.data+0.2+i*0.15,0.6)*(1-ag_in(tt,c.breath+0.2,0.5)),light:mo}));
      mm_sheet(x,tt,w("data","team",-0.3),560,170,800,{kick:"A data team",title:"Busy, every day"},{light:"morning",out:c.few-0.5});
      mm_tag(x,tt,w("data","need",-0.6),c.few-0.5,960,450,"Do people get what they need?",{align:"center",col:LP.amber});
      mm_sheet(x,tt,w("few","few",-0.2),560,170,800,{kick:"What can show it",title:"A few measures, taken the same way every month"},{col:LP.blue,light:"morning",out:c.breath+0.2});}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,MM_TITLE,"Measure what people get, not how busy the team is","Data management · Small steps, measured",{module:"Data management",mark:dm_mark});
});

/* ---------------------------------------------------------------- 2. Busy isn't better */
scene("busy",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const hel=(x,tt,a)=>lp_person(x,"helena",330,640,1.0,{t:tt,a,light:mo});
  ag_shots(ctx,S,t,sc.dur,[
    // July 2027: the strategy promised the team's measures on one page
    {at:0,place:"mmJuly",keys:[[0,960,540,1.0]],draw:(x,tt)=>{hel(x,tt,ag_in(tt,0.3,0.6));
      mm_sheet(x,tt,c.july+0.3,760,170,760,{kick:"July 2027",title:"The data strategy promised",lines:["The team's measures, on one page"]},
        {col:LP.blue,light:"morning",u:ag_in(tt,w("july","page",-0.4),0.5),out:c.easy-0.5});
      // what keeps a team busy: three counts that only go up, while the people who asked wait
      const b0=w("easy","requests",-0.3);
      if(tt>=b0-0.2){const a=ag_in(tt,b0-0.2,0.35)*(1-ag_in(tt,w("get","Helena",-0.7),0.4)),g=1+0.35*ag_in(tt,c.rise,3.0);if(a>0.004){x.save();x.globalAlpha*=a;
        lp_sheet(x,760,150,840,600,{light:"morning",k:tt-b0+0.2});lp_T(x,"WHAT KEEPS A TEAM BUSY",796,230,{w:800,size:28,ls:3,col:LP.mut});
        lp_bars(x,830,260,700,440,[{v:52*g,label:"Requests closed"},{v:64*g,label:"Hours worked"},{v:44*g,label:"Reports built"}],{max:100,col:[150,140,132],
          u:mm_u(tt,[w("easy","requests",-0.1),w("easy","hours",-0.1),w("easy","reports",-0.1)])});x.restore();}}
      mm_pill(x,tt,w("rise","people",-0.3),w("get","Helena",-0.7),1180,812,"The people who asked: still waiting",{col:LP.amber,icon:"wait"});
      // start from what people get, and from the decisions the measures serve
      mm_sheet(x,tt,w("get","Helena",-0.1),760,170,760,{kick:"Helena starts",title:"From what people get",lines:["And from the decisions the measures will serve"]},
        {col:LP.blue,light:"morning",u:ag_in(tt,w("get","decisions",-0.3),0.5),out:c.ask-0.5});
      mm_sheet(x,tt,w("ask","question",-0.4),760,170,760,{kick:"For every measure, one question",title:"When it moves, what will we do differently?",lines:["And who decides?"]},
        {col:LP.blue,light:"morning",u:ag_in(tt,w("ask","decides",-0.4),0.5),out:c.breath-0.2});
      mm_tag(x,tt,w("gov","governance",-0.3),c.breath-0.2,1140,600,"Data governance: measured from the work",{align:"center",col:LP.ink});
      mm_tag(x,tt,w("gov","Teachers",-0.3),c.breath-0.2,1140,680,"As Teachers of data showed",{align:"center",col:LP.mut});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("july","university",-0.4),c.easy,0.5)});
  mm_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Three groups, few measures */
scene("groups",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const tin=tt=>mm_tilesIn(tt,[w("delivery","days",-0.2),w("delivery","sent",-0.2),w("delivery","open",-0.2),w("mgmt","promise",-0.3),
    w("value","benefits",-0.3),w("value","decisions",-0.3),w("value","people",-0.3),w("two","two",-0.2)]);
  ag_shots(ctx,S,t,sc.dur,[
    // the balanced scorecard: a few measures, in groups, so a gain can't hide a loss
    {at:0,place:"mmJuly",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      mm_sheet(x,tt,0.9,560,180,800,{kick:"1992 · Robert Kaplan and David Norton",title:"A balanced scorecard",lines:["A few measures, in groups","So a gain in one place can't hide a loss in another"]},
        {col:LP.blue,light:"morning",u:mm_u(tt,[w("gain","groups",-0.3),w("gain","gain",-0.3)]),out:c.three-0.6});}},
    // Helena's page: three groups, eight measures
    {at:c.three-0.3,place:"mmJuly",later:true,keys:[[c.three-0.3,960,540,1.0]],draw:(x,tt)=>{
      mm_screen(x,tt,[[0,(cx,X,Y,Wd,Hd)=>mm_page(cx,X,Y,Wd,Hd,{now:MM_JUL15,groups:ag_in(tt,w("three","three",-0.2),0.6),u:tin(tt)})]],{a:ag_in(tt,c.three-0.1,0.5)});
      mm_sheet(x,tt,w("two","two",-0.1),1400,200,480,{kick:"Twice a year",lines:["Did our work help a decision you made?","Was it easy to get what you needed?"]},
        {col:LP.blue,light:"morning",u:mm_u(tt,[w("two","twice",-0.1),w("two","people",-0.1)]),out:c.rest-0.4});
      mm_pill(x,tt,w("eight","Eight",-0.2),c.rest-0.4,MM_RX,640,"Eight, on one page",{col:LP.blue});
      mm_tag(x,tt,w("eight","Apgar",-0.2),c.rest-0.4,MM_RX,730,"Apgar needed five",{align:"center",col:LP.ink});
      x.save();if(tt>=c.rest+0.1)lp_label(x,1430,270,"Off the page",{a:ag_in(tt,c.rest+0.1,0.5)});x.restore();
      mm_tag(x,tt,w("rest","counted",-0.4),null,1430,340,"Requests closed",{col:LP.mut});
      mm_tag(x,tt,w("rest","counted",-0.2),null,1430,410,"Hours worked",{col:LP.mut});
      mm_tag(x,tt,w("rest","counted",0.0),null,1430,480,"Reports built",{col:LP.mut});}}
  ]);
  mm_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. A baseline and a decision */
scene("baseline",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  ag_shots(ctx,S,t,sc.dur,[
    // each measure gets four things
    {at:0,place:"mmJuly",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      mm_sheet(x,tt,0.9,560,180,800,{kick:"Each measure gets four things",lines:["A baseline","One definition","A reader","The decision it serves"]},
        {col:LP.blue,light:"morning",u:mm_u(tt,[w("four","baseline",-0.3),w("four","definition",-0.3),w("four","reader",-0.3),w("four","decision",-0.3)]),out:c.base-0.6});}},
    // days from ask to first use: its baseline, its definition in the glossary, its readers, its decision
    {at:c.base-0.3,place:"mmJuly",later:true,keys:[[c.base-0.3,960,540,1.0]],draw:(x,tt)=>{
      mm_sheet(x,tt,c.base-0.1,120,150,860,{kick:"One measure",title:"Days from ask to first use",
        lines:["Baseline: 41 working days, from February","Definition: one, in the catalog's glossary","Readers: the team, every second Thursday; the data council, every month","Decision: where to take the waiting out of the work"]},
        {col:LP.blue,light:"morning",u:mm_u(tt,[w("base","forty-one",-0.2),w("def","glossary",-0.2),w("reader","Thursday",-0.5),w("decide","waiting",-0.4)])});
      mm_fig(x,tt,w("base","February",-0.2),c.def-0.4,1080,170,640,{kick:"Its baseline · February 2027",num:"41",label:"Working days, before anything changed"},{col:LP.amber,light:"morning"});
      const g0=w("def","definition",-0.3);
      lp_screen(x,1060,150,760,560,{a:ag_in(tt,g0,0.5)*(1-ag_in(tt,c.pair-0.5,0.4)),draw:(cx,X,Y,Wd,Hd)=>mm_glossary(cx,X,Y,Wd,Hd,{u:mm_u(tt,[w("defn","working",-0.4),c.reader-0.6,c.reader-0.2])})});
      // beside it, its quality measure: sent back
      mm_sheet(x,tt,w("pair","quality",-0.3),1080,150,720,{kick:"Beside it: its quality",title:"Sent back",lines:["The share of finished work sent back for changes","July: one piece in eight, 12%"]},
        {col:LP.amber,light:"morning",u:mm_u(tt,[w("pair","share",-0.3),w("pair","July",-0.3)]),out:c.product-0.6});
      // speed could hide rework: half-done work sent out, and back again
      const r0=w("why","rework",-0.4);
      if(tt>=r0-0.2&&tt<c.product){const a=ag_in(tt,r0-0.2,0.4)*(1-ag_in(tt,c.product-0.6,0.4));
        mm_rework(x,1180,1700,660,{a,u:ag_in(tt,r0,2.6)});
        mm_tag(x,tt,r0-0.2,c.product-0.6,1180,800,"The team",{align:"center",col:LP.mut});
        mm_tag(x,tt,r0-0.2,c.product-0.6,1700,800,"Who asked",{align:"center",col:LP.mut});
        mm_tag(x,tt,w("why","again",-0.3),c.product-0.6,1440,800,"Rework",{align:"center",col:LP.amber});}}},
    // the page itself: a small governed product, and Helena owns it
    {at:c.product-0.3,place:"mmJuly",later:true,keys:[[c.product-0.3,960,540,1.0]],draw:(x,tt)=>{
      mm_screen(x,tt,[[0,(cx,X,Y,Wd,Hd)=>mm_page(cx,X,Y,Wd,Hd,{now:MM_JUL15,owner:ag_in(tt,w("product","owns",-0.3),0.5)})]],{a:ag_in(tt,c.product-0.1,0.5)});
      mm_pill(x,tt,w("product","governed",-0.4),null,MM_RX,300,"A small governed product",{col:LP.blue});
      lp_person(x,"helena",1690,700,0.9,{t:tt,flip:true,a:ag_in(tt,w("product","Helena",-0.4),0.6),light:mo});}}
  ]);
  mm_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. The trend, not one number */
scene("trend",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const ask=MM_MEASURES[mm_idx("ask")],prom=MM_MEASURES[mm_idx("promise")],load=MM_MEASURES[mm_idx("load")],dec=MM_MEASURES[mm_idx("decision")];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"mmJuly",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      // the dates the screen is drawn to, as the voice goes: June; then 12 August; then mid-September
      const nowAsk=lerp(mm_at(1,1),mm_at(6,1),ag_sine(clamp((tt-0.6)/3.2,0,1)));
      const nowAug=lerp(mm_at(2,1),MM_AUG12+0.22,ag_sine(clamp((tt-c.aug)/2.6,0,1)));
      const nowLoad=lerp(MM_JUL15-0.2,MM_AUG12+0.22,ag_sine(clamp((tt-w("load","Beside",-0.3))/2.0,0,1)));
      const nowFix=lerp(MM_AUG12+0.22,MM_SEP15+0.22,ag_sine(clamp((tt-w("fix","mid-September",-0.5))/1.6,0,1)));
      const over=ag_in(tt,w("load","nine",-0.2),0.6)*(1-ag_in(tt,w("fix","mid-September",0.4),0.8));
      mm_screen(x,tt,[
        [0,(cx,X,Y,Wd,Hd)=>mm_chart(cx,X+40,Y+20,Wd-80,Hd-40,ask,{now:nowAsk,labels:[0,4],levelLabel:"Baseline: 41, in February",levelAbove:false})],
        [c.line-0.2,(cx,X,Y,Wd,Hd)=>mm_page(cx,X,Y,Wd,Hd,{now:mm_at(6,30)})],
        [c.aug-0.3,(cx,X,Y,Wd,Hd)=>mm_pair(cx,X,Y,Wd,Hd,
          (c2,x2,y2,w2,h2)=>mm_chart(c2,x2,y2,w2,h2,prom,{now:nowAug,labels:[0,5],levelLabel:"Baseline: 58%",monthStep:2}),
          tt>=w("load","Beside",-0.5)?(c2,x2,y2,w2,h2)=>{c2.save();c2.globalAlpha*=ag_in(tt,w("load","Beside",-0.5),0.5);
            mm_chart(c2,x2,y2,w2,h2,load,{now:Math.max(nowLoad,nowFix),labels:tt>=w("fix","mid-September",-0.5)?[1,2]:[1],levelLabel:"Limit: 6",levelRight:true,over,monthStep:2});c2.restore();}:null)],
        [c.decision-0.3,(cx,X,Y,Wd,Hd)=>mm_pair(cx,X,Y,Wd,Hd,
          (c2,x2,y2,w2,h2)=>mm_events(c2,x2,y2,w2,h2,dec,{now:lerp(mm_at(1,1),mm_at(6,1),ag_sine(clamp((tt-w("decision","decision",-0.3))/1.8,0,1))),lines:["24 June: the University Council","A new building deferred"],monthStep:2}),
          tt>=w("benefit","benefit",-0.5)?(c2,x2,y2,w2,h2)=>{c2.save();c2.globalAlpha*=ag_in(tt,w("benefit","benefit",-0.5),0.5);mm_case(c2,x2,y2,w2,h2,{u:mm_u(tt,[w("benefit","seventy",-0.5),w("benefit","January",-0.3),w("owner","director",-0.3)])});c2.restore();}:null)]
      ]);
      mm_tag(x,tt,w("june","June",-0.3),c.line-0.4,MM_RX,300,"June: 24 days",{align:"center",col:LP.ink});
      mm_tag(x,tt,w("line","line",-0.3),c.aug-0.5,MM_RX,300,"A line across the months",{align:"center",col:LP.ink});
      mm_tag(x,tt,w("line","baseline",-0.3),c.aug-0.5,MM_RX,380,"Its baseline beneath it",{align:"center",col:LP.mut});
      mm_tag(x,tt,w("line","never",-0.2),c.aug-0.5,MM_RX,460,"Never one number, lit up",{align:"center",col:LP.mut});
      mm_tag(x,tt,w("aug","Thursday",-0.3),c.load-0.3,MM_RX,300,"Thursday 12 August",{align:"center",col:LP.ink});
      mm_pill(x,tt,w("load","nine",-0.1),w("fix","mid-September",-0.2),MM_RX,380,"9 open, limit 6",{col:LP.amber});
      mm_pill(x,tt,w("fix","finished",-0.2),c.decision-0.5,MM_RX,300,"Finish, then start",{col:LP.blue});
      mm_pill(x,tt,w("fix","six",-0.1),c.decision-0.5,MM_RX,380,"Six again",{col:LP.green,icon:"tick"});
      mm_pill(x,tt,w("decision","deferred",-0.2),null,MM_RX,300,"A decision informed",{col:LP.green,icon:"tick"});
      mm_pill(x,tt,w("owner","director",-0.2),null,MM_RX,380,"A benefit, owned",{col:LP.green,icon:"tick"});}}
  ]);
  mm_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. For the team, never a target */
const MM_TEAM=[["sam",440,0.66,false],["ivy",760,0.66,false],["jun",1160,0.66,true],["helena",1480,0.66,true]];
scene("team",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  ag_shots(ctx,S,t,sc.dur,[
    // Goodhart's law, as it's often put
    {at:0,place:"mmJuly",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      mm_sheet(x,tt,0.9,520,200,880,{kick:"Every measure carries a risk",title:"When a measure becomes a target, it stops being a good measure",sub:"Goodhart's law, 1975, as it's often put"},
        {col:LP.amber,light:"morning"});}},
    // in the delivery room: doctors scored their own babies higher, so someone else took the score
    {at:c.apgar-0.3,place:"mmDelivery",keys:[[c.apgar-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{mm_clock(x,tt);
      const n0=w("apgar","someone",-0.4);
      mm_juniorAt(x,tt,1);mm_cot(x,1500,700,tt,{});
      lp_person(x,MM_PEOPLE.obst,1100,700,0.78,{t:tt,a:1-ag_in(tt,n0,0.6),pose:"hold",hold:mm_holdCard,light:MM_MO});
      mm_nurseAt(x,tt,1100,false,ag_in(tt,n0+0.4,0.6),{pose:"hold",hold:mm_holdCard});
      mm_tag(x,tt,w("apgar","own",-0.3),n0,1000,250,"Their own babies: scored several points higher",{align:"center",col:LP.amber});
      mm_pill(x,tt,n0+0.2,c.counted-0.4,1000,250,"Someone else takes the score",{col:LP.green});}},
    // Helena's measures, counted the same way: from the tracker and the platform's logs; first use confirmed by who asked
    {at:c.counted-0.3,place:"mmJuly",keys:[[c.counted-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      mm_sheet(x,tt,w("counted","counted",-0.4),560,170,800,{kick:"Counted the same way",title:"From the tracker and the platform's own logs"},{col:LP.orange,light:"morning",out:c.theirs-0.5});
      mm_pill(x,tt,w("confirm","confirmed",-0.4),c.theirs-0.5,960,560,"First use: confirmed by who asked",{col:LP.green,icon:"tick"});
      mm_tag(x,tt,w("confirm","never",-0.2),c.theirs-0.5,960,660,"Never by who built it",{align:"center",col:LP.ink});}},
    // every measure the team's: never one person's number, never a target
    {at:c.theirs-0.3,place:"mmJuly",later:true,keys:[[c.theirs-0.3,960,540,1.0]],draw:(x,tt)=>{
      mm_sheet(x,tt,w("theirs","team's",-0.4),560,140,800,{kick:"Every measure is the team's",lines:["Never one person's number","Never a target for anyone"]},
        {col:LP.blue,light:"morning",u:mm_u(tt,[w("theirs","number",-0.3),w("theirs","target",-0.3)])});
      MM_TEAM.forEach(([who,X,s,flip],i)=>lp_person(x,who,X,760,s,{t:tt,flip,a:ag_in(tt,c.theirs+0.1+i*0.15,0.6),light:mo}));
      mm_tag(x,tt,w("ldp","leading",-0.4),null,960,470,"How the team reads them together: the leading data people module",{align:"center",col:LP.mut});}}
  ]);
  mm_kick(ctx,S,1-ag_io(t,c.apgar-0.3,c.counted-0.3,0.7));
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"grey"},e0=c.breath+0.6;
  const I=id=>mm_idx(id);
  ag_shots(ctx,S,t,sc.dur,[
    // back to New York: five signs, taken the same way, by someone else, every baby seen in its first minute
    {at:0,place:"mmDelivery",keys:[[0,960,540,1.0]],draw:(x,tt)=>{mm_clock(x,tt);
      mm_juniorAt(x,tt,1);mm_cot(x,1500,700,tt,{card:ag_in(tt,w("back","seen",-0.4),0.5),score:9,col:LP.green});
      mm_nurseAt(x,tt,1100,false,1,{pose:"hold",hold:mm_holdCard});
      mm_sheet(x,tt,w("back","five",-0.3),380,140,640,{title:"Five signs, the same way, by someone else"},{col:LP.blue,light:"morning",out:c.dec-0.5});}},
    // December: what people got
    {at:c.dec-0.3,place:"mmDec",keys:[[c.dec-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      const hl=tt<c.more-0.2?[I("ask"),I("back")]:tt<c.retire-0.2?[I("promise"),I("people")]:tt<c.list-0.4?[I("benefit")]:null;
      mm_screen(x,tt,[[0,(cx,X,Y,Wd,Hd)=>mm_page(cx,X,Y,Wd,Hd,{now:MM_DEC31,hl:tt>=w("dec","fourteen",-0.6)&&tt<c.list-0.4?hl:null,owner:1})]],{a:1-ag_in(tt,c.list-0.5,0.5)});
      mm_tag(x,tt,w("dec","December",-0.3),c.list-0.5,MM_RX,220,"December 2027",{align:"center",col:LP.ink});
      mm_pill(x,tt,w("dec","fourteen",-0.2),c.list-0.5,MM_RX,300,"14 days, not 41",{col:LP.green,icon:"tick"});
      mm_pill(x,tt,w("dec","half",-0.2),c.list-0.5,MM_RX,380,"Sent back: 12% to 6%",{col:LP.green,icon:"tick"});
      mm_pill(x,tt,w("more","eighty-six",-0.3),c.list-0.5,MM_RX,460,"Promises met: 86%",{col:LP.green,icon:"tick"});
      mm_pill(x,tt,w("more","nine",-0.3),c.list-0.5,MM_RX,540,"910 people a month",{col:LP.green,icon:"tick"});
      mm_pill(x,tt,w("retire","seventeenth",-0.3),c.list-0.5,MM_RX,620,"Warehouse retired",{col:LP.green,icon:"tick"});
      mm_tag(x,tt,w("retire","saving",-0.3),c.list-0.5,MM_RX,700,"Its saving from January",{align:"center",col:LP.green});}},
    // on Monday
    {at:c.list-0.3,place:"mmDec",later:true,keys:[[c.list-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,e0,0.8);
      if(g>0.004){x.save();x.globalAlpha*=g;
        mm_sheet(x,tt,c.list+0.3,120,160,540,{kick:"One",title:"List the decisions your measures will serve"},{col:LP.blue,light:"grey"});
        mm_sheet(x,tt,w("few","few",-0.3),690,160,540,{kick:"Two",title:"Keep them few, in groups"},{light:"grey"});
        mm_sheet(x,tt,w("base","baseline",-0.4),1260,160,540,{kick:"Three",title:"A baseline first, and one definition each"},{col:LP.blue,light:"grey"});
        mm_sheet(x,tt,w("pair","quality",-0.4),300,500,620,{kick:"Four",title:"A quality measure beside every speed measure; show the trend"},{col:LP.amber,light:"grey"});
        mm_sheet(x,tt,w("theirs","team",-0.4),1000,500,620,{kick:"Five",title:"Every measure for the team, never a target"},{col:LP.green,light:"grey"});
        x.restore();}}}
  ]);
  lp_end(ctx,S,t,e0,MM_TITLE,MM_LAST,"Film 2 of 4","Small steps, measured",{module:"Data management",mark:dm_mark});
  mm_kick(ctx,S,ag_in(t,c.dec-0.3,0.7)*(1-ag_in(t,e0,0.8)));
});
ag_cutInto(["busy","groups","baseline","trend","team"]);
