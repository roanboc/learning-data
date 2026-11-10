/* ===== Strategy is a habit: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, or cuts where the same people are on both sides.
   Where a person stays through a chapter, it's one shot, and each sheet leaves before the next one comes in its place.
   Sizes in the 1920 x 1080 frame. */

const SIH_LAST="Review the plan every quarter; move it out loud when the world moves.";
const SIH_TITLE="Strategy is a habit";
const SIH_MOD={module:"Data management",mark:dm_mark};
function sih_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"4",SIH_TITLE,{a});}
// the treaty's habit, framed on the team's wall: a small picture of the sky over the layer, healed
function sih_print(ctx,x,y,w,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const h=w*0.56;lp_sheet(ctx,x,y,w,h,{light:"day"});
  ctx.save();ctx.beginPath();ctx.rect(x+24,y+24,w-48,h-48);ctx.clip();ctx.translate(x+24,y+24);ctx.scale((w-48)/W,(w-48)/W);
  ctx.drawImage(ag_place("sihSky"),0,0,W,H);sih_sky(ctx,{thick:1,rays:1,pass:0});ctx.restore();ctx.restore();}

/* ---------------------------------------------------------------- 1. Look again: the Montreal Protocol, from 1974 */
scene("ozone",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const rise0=w("rise","drift",-0.2),ray0=w("layer","stops",-0.6),thin0=w("harm","Without",-0.2),heal0=w("heal","healing",-0.3);
  ag_shots(ctx,S,t,sc.dur,[
    // the 1970s: the gases in things everyone has
    {at:0,place:"sihHome",keys:[[0,960,560,1.06],[c.when+0.4,960,540,1.0]],d:3,draw:(x,tt)=>{
      sih_tag(x,tt,w("when","fridges",-0.1),c.ask-0.6,1345,288,"Fridges",{align:"center",col:LP.ink});
      sih_tag(x,tt,w("when","spray",-0.1),c.ask-0.6,370,380,"Spray cans",{align:"center",col:LP.ink});
      sih_tag(x,tt,w("when","foam",-0.1),c.ask-0.6,540,446,"Foam",{align:"center",col:LP.ink});
      sih_sheet(x,tt,w("when","gases",-0.2),640,130,520,{kick:"The 1970s",title:"Gases called CFCs",lines:["Cheap","Safe to handle","Slow to break down"]},
        {col:LP.amber,light:"late",out:c.ask-0.6,u:sih_u(tt,[w("when","cheap",-0.1),w("when","safe",-0.1),w("when","slow",-0.1)])});}},
    // 1974: where do they end up? Up, over years, to the ozone layer, which stops most of the sun's ultraviolet light; without it, harm
    {at:c.ask-0.3,place:"sihSky",keys:[[c.ask-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      const thick=1-0.45*ag_in(tt,thin0,1.6),pass=ag_in(tt,thin0+0.6,2.2);
      sih_sky(x,{thick,rays:ag_in(tt,ray0,2.2),pass,rise:tt>=rise0?tt-rise0:null});
      sih_sheet(x,tt,w("ask","California",-0.3),140,290,700,{kick:"1974 · California",title:"Mario Molina and Sherwood Rowland",lines:["Two chemists","Where do these gases end up?"]},
        {light:null,pin:false,out:c.layer-0.4,u:sih_u(tt,[w("ask","chemists",-0.1),w("ask","where",-0.1)])});
      sih_tag(x,tt,w("rise","ozone",-0.1),null,120,96,"The ozone layer",{col:LP.ink});
      sih_tag(x,tt,w("layer","ultraviolet",-0.1),c.harm-0.4,1240,330,"It stops most harmful ultraviolet light",{align:"center",col:LP.ink});
      sih_tag(x,tt,w("harm","skin",-0.1),null,430,740,"More skin cancer",{align:"center",col:LP.amber});
      sih_tag(x,tt,w("harm","eyes",-0.1),null,960,740,"More eyes damaged",{align:"center",col:LP.amber});
      sih_tag(x,tt,w("harm","crops",-0.1),null,1490,740,"Crops grow less",{align:"center",col:LP.amber});}},
    // 1985: the station on the Antarctic ice, and its readings since 1957; much unsure, and waiting could be too late
    {at:c.hole-0.3,place:"sihIce",keys:[[c.hole-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      sih_sheet(x,tt,w("hole","Antarctica",-0.3),140,150,760,{kick:"1985 · British Antarctic Survey",title:"Joe Farman, Brian Gardiner and Jonathan Shanklin",lines:["Measuring the ozone layer since 1957"]},
        {light:null,pin:false,out:c.thin-0.5,u:ag_in(tt,w("hole","measured",-0.1),0.5)});
      const k0=c.thin-0.1;if(tt>=k0)sih_chart(x,140,150,760,{a:ag_in(tt,k0,0.35),k:tt-k0,u:ag_in(tt,k0+0.3,2.6),lab:ag_in(tt,w("thin","thirds",-0.1),0.5)});
      sih_sheet(x,tt,w("late","unsure",-0.3),1000,170,780,{kick:"1985",title:"Much is still unsure",lines:["Waiting could be too late","Something has to change"]},
        {col:LP.amber,light:null,pin:false,u:sih_u(tt,[w("late","waiting",-0.1),w("late","Something",-0.1)])});}},
    // 16 September 1987, Montreal: a modest first step, and a habit written in
    {at:c.sign-0.3,place:"sihHall",keys:[[c.sign-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      sih_delegates(x,tt);
      sih_sheet(x,tt,w("sign","Montreal",-0.2),520,70,880,{kick:"16 September 1987 · Montreal",title:"The Montreal Protocol",lines:["First step: the main CFCs cut by half, by 1998","Look again from 1990, at least every four years"]},
        {col:LP.blue,light:"day",u:sih_u(tt,[w("first","modest",-0.1),w("habit","every",-0.2)])});}},
    // the plan moves: London, 1990, with a fund for poorer countries; Copenhagen, 1992; each time out loud, with the science behind it
    {at:c.london-0.3,place:"sihHall",later:true,keys:[[c.london-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=c.london-0.3;
      sih_plan(x,260,96,1400,{k:tt-s0-0.4,a:ag_in(tt,s0+0.4,0.35),light:"day",look:ag_in(tt,s0+0.8,1.0),fund:ag_in(tt,w("fund","fund",-0.2),0.5),
        u:[ag_in(tt,s0+0.6,1.0),ag_in(tt,w("london","further",-0.1),1.6),ag_in(tt,w("copen","forward",-0.2),1.4)]});
      sih_pill(x,tt,w("loud","loud",-0.2),null,960,820,"Moved out loud, with the science behind it",{col:LP.blue});}},
    // what got better: nearly all the gases gone, the layer healing, skin cancers prevented
    {at:c.gone-0.3,place:"sihSky",keys:[[c.gone-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const hu=ag_in(tt,heal0,3.2);
      sih_sky(x,{thick:lerp(0.55,1,hu),rays:1,pass:1-hu});
      const f0=w("gone","nearly",-0.2);if(tt>=f0)lp_figure(x,140,300,700,{kick:"By 2023",num:"99%",label:"Of the banned gases, no longer made or used"},{col:LP.green,light:null,pin:false,a:ag_in(tt,f0,0.35),k:tt-f0});
      sih_tag(x,tt,w("heal","forty",-0.2),null,1180,300,"Around 2040: most of the world",{col:LP.green});
      sih_tag(x,tt,w("heal","sixty-six",-0.2),null,1180,376,"Around 2066: over Antarctica",{col:LP.green});
      const f1=w("skin","prevent",-0.2);if(tt>=f1)lp_figure(x,1180,440,620,{kick:"By 2030, each year",num:"2 million",label:"Cases of skin cancer prevented"},{col:LP.green,light:null,pin:false,a:ag_in(tt,f1,0.35),k:tt-f1});}},
    // a data strategy, written with what's known on the day; looked at again on a rhythm; it all leaves before the title card
    {at:c.data-0.3,place:"sihApril",keys:[[c.data-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const g=1-ag_in(tt,c.breath-0.3,0.5);if(g<=0.004)return;x.save();x.globalAlpha*=g;
      sih_sheet(x,tt,w("data","strategy",-0.2),510,170,900,{kick:"A data strategy",title:"Written with what's known on the day"},{col:LP.blue,light:"late"});
      sih_tag(x,tt,w("data","world",-0.1),null,960,470,"The world won't wait for it",{align:"center",col:LP.amber});
      const r0=w("rhythm","rhythm",-0.3);if(tt>=r0){x.save();x.globalAlpha*=ag_in(tt,r0,0.4);
        for(let i=0;i<4;i++){const k=ag_in(tt,r0+0.2+i*0.25,0.4);x.fillStyle=rgba(LP.blue,k);x.beginPath();x.arc(690+i*180,600,20,0,TAU);x.fill();}
        x.strokeStyle=rgba(LP.blue,0.5);x.lineWidth=3;x.beginPath();x.moveTo(690,600);x.lineTo(690+540*ag_in(tt,r0+0.2,1.0),600);x.stroke();
        lp_T(x,"Looked at again, on a rhythm",960,680,{w:800,size:30,align:"center",col:LP.blue,a:ag_in(tt,w("rhythm","loud",-0.2),0.5)});x.restore();}
      x.restore();}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,SIH_TITLE,"Look again on a rhythm; move the plan out loud","Data management · Small steps, measured",SIH_MOD);
});

/* ---------------------------------------------------------------- 2. Reviews in the calendar */
scene("dates",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"};
  const hel=(x,tt)=>lp_person(x,"helena",1660,640,1.0,{t:tt,flip:true,a:ag_in(tt,0.4,0.6),light:lt});
  const rows=["going","must","principles","target","packages","measures"].map(k=>w("page",k,-0.2));
  const cal0=w("calendar","puts",-0.2),q0=w("three","same",-0.6);
  ag_shots(ctx,S,t,sc.dur,[
    // 27 April 2027: the strategy approved, on one page; Rumelt's core in it
    {at:0,place:"sihApril",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      sih_sheet(x,tt,w("april","Tuesday",-0.3),110,150,780,{kick:"Tuesday 27 April 2027",title:"The data council approves the data strategy"},{light:"late",out:c.page-0.5});
      const p0=c.page-0.1;if(tt>=p0)sih_page(x,110,140,780,{a:ag_in(tt,p0,0.35)*(1-ag_in(tt,cal0,0.4)),k:tt-p0,light:"late",
        u:sih_u(tt,rows),core:sih_u(tt,[w("kernel","diagnosis",-0.1),w("kernel","guiding",-0.1),w("kernel","actions",-0.1)]),hers:["slows","principles","packages"].map(k=>ag_in(tt,w("hers",k,-0.2),0.6))});
      hel(x,tt);}},
    // before anyone leaves: the year's reviews in the calendar; no new committee
    {at:cal0,place:"sihApril",keys:[[cal0,960,540,1.0]],draw:(x,tt)=>{
      const k0=cal0+0.4;if(tt>=k0)sih_cal(x,110,150,820,{a:ag_in(tt,k0,0.35)*(1-ag_in(tt,q0,0.4)),k:tt-k0,light:"late",
        u:[ag_in(tt,w("dates","July",-0.2),0.5),ag_in(tt,w("dates","October",-0.2),0.5),ag_in(tt,w("dates","January",-0.2),0.5),ag_in(tt,w("year","Monday",-0.2),0.5)]});
      sih_tag(x,tt,c.nocomm-0.2,q0,980,300,"No new committee",{col:LP.ink});
      hel(x,tt);}},
    // three questions at every review
    {at:q0,place:"sihApril",keys:[[q0,960,540,1.0]],draw:(x,tt)=>{
      sih_sheet(x,tt,q0+0.4,110,150,860,{kick:"At every review",title:"The same three questions",lines:["What do the measures say?","What do the risks say?","What has changed around us?"]},
        {col:LP.blue,light:"late",u:sih_u(tt,[w("three","measures",-0.2),w("three","risks",-0.2),w("three","changed",-0.2)])});
      hel(x,tt);}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("april","university",-0.3),c.page,0.5)});
  sih_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. The first review */
scene("july",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),gy="grey",m0=w("none","minutes",-0.3);
  const council=(x,tt)=>sih_council(x,tt,{who:["david","helena"],light:gy});
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"sihJuly",keys:[[0,960,540,1.0]],draw:(x,tt)=>{council(x,tt);
      lp_nameTag(x,1450,286,"david",{align:"center",role:"Chairs the steering group",a:ag_io(tt,0.8,c.measures,0.5)});
      sih_sheet(x,tt,0.6,110,150,760,{kick:"Tuesday 27 July 2027",title:"The first review"},{light:gy,out:c.measures-0.5});
      const ms=c.measures-0.1;if(tt>=ms)sih_measures(x,110,150,760,{a:ag_in(tt,ms,0.35)*(1-ag_in(tt,c.risks-0.6,0.4)),k:tt-ms,light:gy,u:ag_in(tt,w("measures","twenty-four",-0.6),1.2)});
      const r0=c.risks-0.1;if(tt>=r0)sih_risks(x,110,150,900,{a:ag_in(tt,r0,0.35)*(1-ag_in(tt,c.map-0.6,0.4)),k:tt-r0,light:gy,u:ag_in(tt,w("risks","early",-0.6),2.2)});
      const h0=c.map-0.1;lp_screen(x,110,150,980,520,{a:ag_in(tt,h0,0.5)*(1-ag_in(tt,m0-0.4,0.4)),draw:(cx,X,Y,Wd,Hd)=>sih_history(cx,X,Y,Wd,Hd,{u:ag_in(tt,w("map","changed",-0.4),2.0)})});
      sih_sheet(x,tt,m0,110,170,960,{kick:"The minutes · 27 July",title:"The data strategy: reviewed, no change"},{col:LP.green,light:gy});
      sih_pill(x,tt,w("counts","holds",-0.2),null,520,520,"The plan holds",{col:LP.green,icon:"tick"});}}
  ]);
  sih_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. When the world moves */
scene("moves",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo="morning";
  // the roadmap's running note: one at a time, each gone before the next comes
  const NOTES=[[w("kernel","diagnosis",-0.2),"The diagnosis has grown · the policy holds · the actions move",LP.blue],[c.up,"Up: the courses' products, by December",LP.blue],
    [c.waits,"Waits: the agents' mandates, to March",LP.amber],[c.why,"Half the team's time: not both by December",LP.ink],
    [c.watch,"No new agent until its mandate is written",LP.amber],[w("loud","page",-0.3),"Changed on 26 October, with the reason",LP.blue]];
  ag_shots(ctx,S,t,sc.dur,[
    // 14 October: the University Council decides; a new kind of student; the data the choice needs
    {at:0,place:"sihOct",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      sih_sheet(x,tt,0.8,110,150,860,{kick:"Thursday 14 October 2027",title:"The University Council: short online courses for working adults",lines:["From 2028"]},
        {col:LP.blue,light:mo,out:c.review-0.5,u:ag_in(tt,w("oct","from",-0.1),0.5)});
      sih_sheet(x,tt,w("who","job",-0.6),1030,150,760,{kick:"A new kind of student",lines:["Has a job","Studies online","A few weeks at a time"]},
        {light:mo,out:c.review-0.5,u:sih_u(tt,[w("who","job",-0.1),w("who","online",-0.1),w("who","weeks",-0.1)])});
      sih_sheet(x,tt,w("need","choose",-0.3),1030,520,760,{kick:"To choose which courses",title:"Data they can trust, by December",lines:["Who asks about what"]},
        {col:LP.orange,light:mo,out:c.review-0.5,u:ag_in(tt,w("need","trust",0),0.5)});}},
    // 26 October: the steering group; one part of the plan moves up, one waits, and why
    {at:c.review-0.3,place:"sihOct",later:true,keys:[[c.review-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=c.review-0.3;
      sih_roadmap(x,110,124,1700,{a:ag_in(tt,s0+0.5,0.35),k:tt-s0-0.5,light:mo,u:ag_in(tt,s0+0.7,1.6),now:ag_in(tt,w("review","reviews",-0.2),0.6),
        up:ag_in(tt,w("up","owner",-0.2),1.6),wait:ag_in(tt,w("waits","mandates",-0.3),1.6)});
      NOTES.forEach(([t0,s,col],i)=>sih_tag(x,tt,t0,i+1<NOTES.length?NOTES[i+1][0]-0.45:null,1770,194,s,{align:"right",col}));}},
    // Noor's map: the courses' platform in the target, with its reason; TOGAF's change management
    {at:c.map-0.3,place:"sihOct",later:true,keys:[[c.map-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_screen(x,110,150,1180,600,{a:ag_in(tt,c.map,0.5)*(1-ag_in(tt,c.togaf-0.6,0.4)),draw:(cx,X,Y,Wd,Hd)=>sih_target(cx,X,Y,Wd,Hd,{add:ag_in(tt,w("map","platform",-0.2),1.0),why:ag_in(tt,w("map","reason",-0.2),0.5)})});
      sih_tag(x,tt,w("walk","When",-0.2),c.togaf-0.6,700,812,"When strategy moves · The map before the data",{align:"center",col:LP.blue});
      sih_tag(x,tt,w("togaf","TOGAF",-0.2),null,740,236,"TOGAF: change management",{align:"center",col:LP.blue});
      [["fit","Fit the plan",null],["move","Move the plan",LP.blue],["new","Need a new one",null]].forEach(([word,s,col],i)=>
        sih_sheet(x,tt,w("togaf",word,-0.3),110+i*430,300,400,{kick:"Some changes",title:s},{col,light:mo}));
      lp_nameTag(x,1640,236,"noor",{align:"center",role:"The data architect",a:ag_in(tt,w("map","Noor",-0.2),0.5)});
      lp_person(x,"noor",1640,660,0.95,{t:tt,flip:true,a:ag_in(tt,c.map-0.1,0.6),light:{light:mo}});}}
  ]);
  sih_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Promised beside delivered */
scene("year",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy="day";
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"sihJan",keys:[[0,960,540,1.0]],draw:(x,tt)=>{sih_council(x,tt,{who:["david","helena"],light:dy});
      const l0=w("two","promised",-0.3);if(tt>=l0)sih_ledger(x,110,120,1140,{a:ag_in(tt,l0,0.35),k:tt-l0,light:dy,
        u:[ag_in(tt,c.days,0.5),ag_in(tt,c.promise,0.5),ag_in(tt,c.people,0.5),ag_in(tt,c.warehouse,0.5),ag_in(tt,c.partners,0.5),ag_in(tt,w("didnt","didn't",-0.1),0.5)]});
      sih_tag(x,tt,w("deans","deans",-0.3),null,1575,228,"Helena sees both deans in February",{align:"center",col:LP.amber});
      sih_tag(x,tt,w("deans","risk",-0.2),null,1575,300,"That risk: to the top of the register",{align:"center",col:LP.amber});}},
    // next year starts from here: the same three questions, asked again of the same people
    {at:c.next-0.3,place:"sihJan",later:true,keys:[[c.next-0.3,960,540,1.0]],draw:(x,tt)=>{
      sih_sheet(x,tt,c.next+0.4,510,170,900,{kick:"Next year starts here",title:"The same three questions",lines:["What do you decide?","What data do you trust?","What slows you down?"]},
        {col:LP.blue,light:dy,u:ag_in(tt,w("next","questions",-0.2),1.4)});
      sih_tag(x,tt,w("next","again",-0.2),null,960,610,"Asked again of the same people",{align:"center",col:LP.ink});}}
  ]);
  sih_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
// one shot in the team's room: Helena stays from her line to the end; each picture leaves before the next comes
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),e0=c.breath+0.6,dy={light:"day"};
  const go1=c.cal-0.6,go2=c.job-0.6,go3=c.loop-0.6;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      // back to Montreal: the treaty's habit, framed on the team's wall; Helena's strategy kept it
      const o1=1-ag_in(tt,go1,0.4);if(o1>0.004){x.save();x.globalAlpha*=o1;
        sih_print(x,120,140,700,ag_in(tt,0.8,0.6));
        sih_sheet(x,tt,w("back","habit",-0.3),120,580,900,{kick:"The Montreal Protocol",title:"Look again, at least every four years"},{col:LP.blue,light:"day"});
        sih_pill(x,tt,w("helena","quarter",-0.2),null,1200,300,"Read every quarter",{col:LP.green,icon:"tick"});
        sih_pill(x,tt,w("helena","moved",-0.2),null,1200,400,"Moved out loud",{col:LP.green,icon:"tick"});
        sih_pill(x,tt,w("helena","beside",-0.2),null,1200,500,"Set beside what it delivered",{col:LP.green,icon:"tick"});x.restore();}
      // what to do on Monday
      const l0=go1+0.4;if(tt>=l0)sih_list(x,120,150,1180,{a:ag_in(tt,l0,0.35)*(1-ag_in(tt,go2,0.4)),k:tt-l0,light:"day",kick:"On Monday",title:"Keep the strategy a habit",
        rows:["Put the year's reviews in the calendar","At each, read the measures, the risks and what's changed","When the world moves, move the plan out loud","Keep the one page current, and the map with it","End the year: promised beside delivered"],
        u:[ag_in(tt,c.cal,0.5),ag_in(tt,w("read","measures",-0.3),0.5),ag_in(tt,w("move","loud",-0.4),0.5),ag_in(tt,w("page","page",-0.3),0.5),ag_in(tt,w("end","promised",-0.3),0.5)]});
      // the whole job, then the module's loop, going round once more
      sih_tag(x,tt,go2+0.4,go3,860,200,"That's the whole job",{align:"center",col:LP.mut});
      [["area","Every area at once"],["stages","A plan in stages"],["real","Each proved with something real"],["table","Everyone at the table"]].forEach(([word,s],i)=>
        sih_tag(x,tt,w("job",word,-0.2),go3,860,320+i*100,s,{align:"center",col:LP.ink}));
      const p0=go3+0.4;if(tt>=p0)sih_loop(x,860,470,300,{a:ag_in(tt,p0,0.4)*(1-ag_in(tt,e0,0.8)),
        u:sih_u(tt,["Discover","define","plan","Deliver","measure","improve"].map(k=>w("loop",k,-0.2))),again:ag_in(tt,w("loop","again",-0.2),0.6)});
      lp_person(x,"helena",1700,640,1.0,{t:tt,flip:true,a:ag_in(tt,c.helena-0.6,0.6),light:dy});}}
  ]);
  lp_end(ctx,S,t,e0,SIH_TITLE,SIH_LAST,"Film 4 of 4","Small steps, measured",SIH_MOD);
  sih_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["dates","july"]);
