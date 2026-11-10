/* ===== Owning the outcome: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, or cuts where both show the same people. Sizes in
   the 1920 x 1080 frame. */

const OO_LAST="Own what it's for, not only what you did.";
// the film's number and title at the top left, from the second chapter on
function oo_kick(ctx,S,a,o){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"1","Owning the outcome",Object.assign({a},o||{}));}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function oo_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const oo_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function oo_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 (and goes at t1)
function oo_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// people out of doors: the day's light, no wall behind them
const OO_OUT={light:"day",wall:0};
// the women of the hills and Maathai, where they stand on the near slope; o.a fades them, as one
function oo_hillPeople(x,tt,a,o){o=o||{};if(a<=0.004)return;OO_WOMEN.forEach((P,i)=>lp_person(x,P,[330,640,940][i],[700,720,712][i],0.8,{t:tt,light:OO_OUT,a}));
  if(!o.noMaathai)lp_person(x,OO_PEOPLE.maathai,1480,700,0.82,{t:tt,flip:true,light:OO_OUT,a});}
// the row of seedlings on the near slope: g how far they've grown, dry how far the ones that died have died, at a size s
function oo_row(x,tt,g,dry,s){OO_ROW.pts.forEach(([px,py],i)=>oo_seedling(x,px,py,s,{g:OO_ROW.alive[i]?g:Math.min(g,0.45),dry:OO_ROW.alive[i]?0:dry,seed:40+i}));}
// a tick over each seedling still alive
function oo_ticks(x,tt,t0,s){OO_ROW.pts.forEach(([px,py],i)=>{if(!OO_ROW.alive[i])return;const u=ag_in(tt,t0+i*0.08,0.4);if(u<=0.004)return;const f=lerp(0.5,1,ag_spr(tt,t0+i*0.08,0.5));
  x.save();x.globalAlpha*=u;x.fillStyle=rgba(LP.green,1);x.beginPath();x.arc(px,py-150*s,22*f,0,TAU);x.fill();lp_icon(x,"tick",px,py-150*s,30*f,[255,255,255]);x.restore();});}
// the team's table with a seedling in its sleeve, the end of the opening: g the seedling's growth
function oo_desk(x,tt,o){o=o||{};lp_table(x,420,840,640,{});oo_seedling(x,600,780,2.4,{g:o.g==null?0.7:o.g,sleeve:true,seed:7});}

/* ---------------------------------------------------------------- 1. Trees still standing: Kenya, the 1970s to 2004 */
scene("trees",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const pplA=tt=>ag_in(tt,w("women","rural",-0.4),0.8);
  ag_shots(ctx,S,t,sc.dur,[
    // the hills of the central highlands, their forests cleared; the women tell Maathai what's going wrong
    {at:0,place:"ooHills",keys:[[0,1060,470,1.16],[c.when+0.2,980,520,1.06],[c.women,960,560,1.0]],d:3.4,draw:(x,tt)=>{
      oo_hillPeople(x,tt,pplA(tt));
      oo_tag(x,tt,w("women","rural",-0.1),c.streams-0.6,640,400,"Rural women",{align:"center",col:LP.ink});
      lp_nameTag(x,1480,392,OO_PEOPLE.maathai,{align:"center",a:ag_io(tt,w("women","Maathai",-0.2),c.streams-0.6,0.4)});
      oo_sheet(x,tt,w("streams","streams",-0.3),150,110,780,{kick:"What's going wrong",lines:["Their streams are drying up","Their food is less sure","Further, each year, for firewood"]},
        {col:LP.amber,light:null,pin:false,out:c.cleared-0.7,u:oo_u(tt,[w("streams","streams",-0.2),w("streams","food",-0.2),w("streams","walk",-0.2)])});}},
    // the forests, cleared for farms, for tea and coffee to sell, for timber; each choice made sense
    {at:c.cleared-0.3,place:"ooHills",later:true,keys:[[c.cleared-0.3,980,530,1.04]],d:2.0,draw:(x,tt)=>{
      oo_tag(x,tt,w("cleared","forests",-0.1),c.soil-0.6,960,250,"The forests, cleared",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("cleared","farms",-0.1),c.soil-0.6,300,600,"For farms",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("cleared","tea",-0.1),c.soil-0.6,960,640,"Tea and coffee, to sell",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("cleared","plantations",-0.1),c.soil-0.6,1530,500,"Timber plantations",{align:"center",col:LP.ink});
      oo_pill(x,tt,w("sense","sense",-0.2),c.soil-0.6,960,350,"Each choice made sense to the people who made it",{col:LP.ink});}},
    // without trees, the rain washes the soil off the slope, and the springs run dry: the camera glides in from where it is
    {at:c.soil-0.3,place:"ooHills",keys:[[c.soil-0.3,980,530,1.04],[c.soil-0.3,1040,640,1.24]],d:2.2,draw:(x,tt)=>{
      oo_run(x,tt,ag_io(tt,w("soil","washed",-0.6),c.harm-0.2,0.8));
      oo_tag(x,tt,w("soil","soil",-0.1),c.harm-0.6,700,470,"The soil washed off the hills",{align:"center",col:LP.amber});
      oo_tag(x,tt,w("soil","springs",-0.1),c.harm-0.6,1360,560,"The springs ran dry",{align:"center",col:LP.amber});}},
    // the women carried it: water, firewood, food
    {at:c.harm-0.3,place:"ooHills",later:true,keys:[[c.harm-0.3,1040,640,1.24],[c.harm-0.3,960,560,1.0]],d:2.0,draw:(x,tt)=>{
      oo_hillPeople(x,tt,1,{noMaathai:true});
      oo_sheet(x,tt,w("harm","women",-0.2),1140,110,640,{kick:"The women",lines:["Fetched the water","Gathered the firewood","Grew the food"]},
        {light:null,pin:false,out:c.change-0.5,u:oo_u(tt,[w("harm","fetched",-0.1),w("harm","gathered",-0.1),w("harm","grew",-0.1)])});
      oo_pill(x,tt,w("harm","harm",-0.2),c.change-0.5,1400,500,"The harm fell first on them, and their children",{col:LP.amber,size:28});
      oo_tag(x,tt,w("change","change",-0.3),c.start-0.6,1460,190,"Something had to change",{align:"center",col:LP.ink});}},
    // 1977: the Green Belt Movement
    {at:c.start-0.3,place:"ooNursery",keys:[[c.start-0.3,960,520,1.0]],dis:1.2,draw:(x,tt)=>{const nA=ag_in(tt,w("nursery","Groups",-0.4),0.8);
      if(nA>0.004){lp_person(x,OO_PEOPLE.wan,280,700,0.62,{t:tt,cut:796,light:OO_OUT,a:nA});lp_person(x,OO_PEOPLE.nya,560,690,0.62,{t:tt,cut:796,light:OO_OUT,a:nA});
        lp_person(x,OO_PEOPLE.mum,1320,700,0.62,{t:tt,cut:796,light:OO_OUT,flip:true,a:nA});}
      lp_person(x,OO_PEOPLE.maathai,1640,690,0.62,{t:tt,cut:796,light:OO_OUT,flip:true});
      oo_beds(x,tt,{g:lerp(0.15,1,ag_sine(ag_in(tt,w("nursery","seedlings",-0.2),3.2)))});
      oo_sheet(x,tt,w("start","nineteen",-0.2),660,300,600,{kick:"1977",title:"The Green Belt Movement",lines:["With the National Council of Women of Kenya"]},
        {col:LP.blue,light:null,pin:false,out:c.nursery+0.6,u:ag_in(tt,w("start","National",-0.2),0.5)});
      oo_tag(x,tt,w("nursery","nurseries",-0.2),c.paid-0.6,960,380,"Seedlings in their own nurseries",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("nursery","local",-0.2),c.paid-0.6,960,460,"From the seeds of local trees",{align:"center",col:LP.ink});}},
    // planted out on the slope; months later, paid for each tree still alive
    {at:c.paid-0.3,place:"ooHills",keys:[[c.paid-0.3,1050,640,1.25]],dis:1.2,draw:(x,tt)=>{const m0=w("paid","months",-0.3),g=lerp(0.25,1,ag_sine(ag_in(tt,m0,1.6))),dry=ag_sine(ag_in(tt,m0+0.2,1.4));
      oo_row(x,tt,g,dry,1.0);
      oo_tag(x,tt,m0,c.fifty-0.6,1050,440,"Months later",{align:"center",col:LP.ink});
      oo_ticks(x,tt,w("paid","alive",-0.1),1.0);
      oo_pill(x,tt,w("paid","paid",-0.1),c.answer-0.4,1050,330,"Paid for each tree still alive",{col:LP.green});
      oo_tag(x,tt,w("paid","not",-0.1),c.answer-0.4,1050,520,"Not for each seedling planted",{align:"center",col:LP.mut});
      oo_pill(x,tt,w("answer","living",-0.2),c.fifty-0.6,1050,330,"Living trees, not the planting",{col:LP.green});}},
    // years later: the same hills, with trees
    {at:c.fifty-0.3,place:"ooGreen",later:true,dis:1.0,keys:[[c.fifty-0.3,960,540,1.0]],d:2.6,draw:(x,tt)=>{
      lp_figure(x,150,110,560,{kick:"Since then, in Kenya",num:"50 million",label:"More than that many trees planted"},{col:LP.green,light:null,pin:false,a:ag_io(tt,w("fifty","fifty",-0.2),c.nobel-0.5,0.4),k:tt-w("fifty","fifty",-0.2)});
      oo_tag(x,tt,w("give","fuel",-0.1),c.nobel-0.5,980,300,"Fuel",{align:"center",col:LP.green});
      oo_tag(x,tt,w("give","food",-0.1),c.nobel-0.5,1200,300,"Food",{align:"center",col:LP.green});
      oo_tag(x,tt,w("give","shelter",-0.1),c.nobel-0.5,1440,300,"Shelter",{align:"center",col:LP.green});
      oo_pill(x,tt,w("give","income",-0.2),c.nobel-0.5,1210,390,"An income for thousands of women",{col:LP.green});
      oo_sheet(x,tt,w("nobel","two",-0.2),560,120,800,{kick:"2004",title:"The Nobel Peace Prize",lines:["Wangari Maathai, the first African woman to win it"]},
        {light:null,pin:false,out:c.data-0.5,u:ag_in(tt,w("nobel","first",-0.2),0.5)});}},
    // and data work: a job that ran, a report that was sent; the seedling, on the team's table
    {at:c.data-0.3,place:"lpRoom",keys:[[c.data-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const ga=1-ag_in(tt,c.breath+0.2,0.8);x.save();x.globalAlpha*=ga;
      oo_desk(x,tt,{g:lerp(0.55,0.75,ag_sine(ag_in(tt,c.breath-0.4,3.0)))});
      oo_status(x,1040,150,720,420,{when:"Monday, 07:00",ran:ag_in(tt,w("data","job",-0.1),0.4),kRan:tt-w("data","job",-0.1),bars:ag_in(tt,c.breath,1.2),a:1});
      oo_sheet(x,tt,w("data","report",-0.2),180,150,560,{kick:"A report",title:"Sent"},{light:"day"});
      oo_pill(x,tt,w("data","sent",-0.1),null,460,400,"Sent",{col:LP.green,icon:"tick"});
      oo_tag(x,tt,w("own","answering",-0.2),c.breath-0.2,1400,660,"Owning the outcome: answering for what they're for",{align:"center",col:LP.ink});x.restore();}}
  ]);
  // where and when, held still on the screen while the camera glides out over the hills
  setScreen(ctx,S);oo_sheet(ctx,t,w("when","Kenya",-0.2),150,110,560,{kick:"Kenya",title:"The 1970s",sub:"The central highlands"},{light:null,pin:false,out:c.streams-0.6});
  lp_title(ctx,S,t,c.breath+0.2,"Owning the outcome","Answer for what it's for","Leading data people · Ownership and performance");
});

/* ---------------------------------------------------------------- 2. What she owns */
scene("owns",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  const ivy=(x,tt)=>lp_person(x,"ivy",1480,650,1.0,{t:tt,flip:true,light:dy});
  ag_shots(ctx,S,t,sc.dur,[
    // Thursday 1 July 2027: Ivy owns her first data product; what it is, who's its owner, and its promise
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{ivy(x,tt);
      oo_sheet(x,tt,w("owner","Ivy",-0.2),180,150,800,{kick:"Thursday 1 July 2027",title:"Ivy Reyes",lines:["Owner of her first data product"]},{light:"day",out:c.what-0.5,u:ag_in(tt,w("owner","owner",-0.1),0.5)});
      oo_sheet(x,tt,w("what","Teaching",-0.2),180,150,800,{kick:"The data product",title:"Teaching space use",lines:["Every teaching room, every hour","What was booked","How many people came"]},
        {col:LP.orange,light:"day",out:c.mesh-0.5,u:oo_u(tt,[w("what","every",-0.1),w("what","booked",-0.1),w("what","many",-0.1)])});
      oo_pill(x,tt,w("what","Counts",-0.1),c.mesh-0.5,580,560,"Counts, never people",{col:LP.blue});
      oo_sheet(x,tt,w("mesh","Zhamak",-0.2),180,150,800,{kick:"Zhamak Dehghani · Data mesh",title:"The data product owner",lines:["Answers for what the product does for its readers"]},
        {col:LP.blue,light:"day",out:c.film-0.5,u:ag_in(tt,w("mesh","answers",-0.1),0.5)});
      oo_sheet(x,tt,w("film","product",-0.2),180,150,800,{kick:"The film before",title:"A product with an owner",sub:"How a product gets one"},{light:"day",out:c.promise-0.5});
      oo_pill(x,tt,w("film","owning",-0.4),c.promise-0.5,580,500,"This film: the owning",{col:LP.ink});
      oo_sheet(x,tt,w("promise","promise",-0.2),180,150,800,{kick:"Its promise",title:"Every Monday by 07:00",lines:["With the week before"]},{col:LP.blue,light:"day",out:c.readers-0.5,u:ag_in(tt,w("promise","week",-0.1),0.5)});}},
    // its readers, by name
    {at:c.readers-0.3,place:"lpRoom",keys:[[c.readers-0.3,960,540,1.0]],draw:(x,tt)=>{ivy(x,tt);
      lp_person(x,"graham",440,700,0.9,{t:tt,light:dy});lp_person(x,"mei",860,700,0.9,{t:tt,light:dy});
      lp_nameTag(x,440,360,"graham",{align:"center",a:ag_in(tt,w("readers","Graham",-0.1),0.4)});
      lp_nameTag(x,860,360,"mei",{align:"center",a:ag_in(tt,w("readers","Mei",-0.1),0.4)});
      oo_tag(x,tt,w("readers","teams",-0.2),null,650,170,"Its readers, with their teams",{align:"center",col:LP.ink});}},
    // what it's for: next year's timetable; owning that it's judged on true counts
    {at:c.for-0.3,place:"lpRoom",keys:[[c.for-0.3,960,540,1.0]],draw:(x,tt)=>{ivy(x,tt);
      oo_sheet(x,tt,w("for","knows",-0.1),180,150,820,{kick:"What it's for",title:"Next year's timetable",lines:["Moves about one peak class in six","Releases rooms nobody uses"]},
        {col:LP.blue,light:"day",out:c.truly-0.5,u:oo_u(tt,[w("for","move",-0.1),w("for","release",-0.1)])});
      oo_tag(x,tt,w("which","Which",-0.1),c.truly-0.5,590,560,"Which ones: chosen from her counts",{align:"center",col:LP.orange});
      oo_tag(x,tt,w("truly","isn't",-0.2),c.many-0.5,590,300,"Not only Monday's job",{align:"center",col:LP.mut});
      oo_pill(x,tt,w("truly","judged",-0.4),c.many-0.5,590,400,"The timetable change, judged on true counts",{col:LP.green,size:28});}},
    // many do part of the work; one answers for the outcome
    {at:c.many-0.3,place:"lpRoom",keys:[[c.many-0.3,960,540,1.0]],draw:(x,tt)=>{ivy(x,tt);
      for(const [who,px,word] of [["graham",300,"Facilities"],["sam",680,"Sam"],["jun",1060,"Jun"]])lp_person(x,who,px,760,0.78,{t:tt,light:dy,a:ag_in(tt,w("many",word,-0.3),0.6)*(1-ag_in(tt,c.helena-1.0,0.5))});
      oo_tag(x,tt,w("many","sensors",-0.1),c.one-0.4,300,450,"The sensors",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("many","platform",-0.1),c.one-0.4,680,450,"The platform",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("many","reviews",-0.1),c.one-0.4,1060,450,"Reviews her changes",{align:"center",col:LP.ink});
      oo_raci(x,120,140,{r:ag_in(tt,c.one,0.9),aa:ag_in(tt,w("one","accountable",-0.5),0.4),a:ag_io(tt,c.one-0.2,c.helena-0.5,0.4),k:tt-c.one+0.2,light:"day"});
      oo_tag(x,tt,w("one","only",-0.1),c.helena-0.5,1085,520,"Only one A",{align:"center",col:LP.blue});}},
    // Helena gives her the authority to match: the three have left, and Ivy stays where she is
    {at:c.helena-0.3,place:"lpRoom",keys:[[c.helena-0.3,960,540,1.0]],draw:(x,tt)=>{ivy(x,tt);lp_person(x,"helena",480,650,1.0,{t:tt,light:dy,a:ag_in(tt,c.helena-0.2,0.6)});
      oo_tag(x,tt,w("helena","authority",-0.2),c.can-0.3,960,200,"The authority to match",{align:"center",col:LP.blue});
      oo_pill(x,tt,w("can","hold",-0.1),null,960,290,"Hold a refresh",{col:LP.blue});
      oo_pill(x,tt,w("can","change",-0.1),null,960,380,"Change the model, with a review",{col:LP.blue});
      oo_pill(x,tt,w("can","tell",-0.1),null,960,470,"Tell the readers",{col:LP.blue});
      oo_tag(x,tt,w("can","without",-0.1),null,960,560,"Without asking first",{align:"center",col:LP.ink});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.8,c.mesh-0.4,0.5)});
  oo_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. A Monday that looked fine */
AG_ROOMS.ooMorning="lpRoom";
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const ivy=(x,tt,a)=>lp_person(x,"ivy",1480,650,1.0,{t:tt,flip:true,light:mo,a});
  ag_shots(ctx,S,t,sc.dur,[
    // Tuesday 17 August: Facilities upgrades the sensors in 40 rooms; four counts an hour, not one
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      oo_rooms(x,340,150,{mark:ag_in(tt,w("upgrade","sensors",-0.1),0.8),a:ag_in(tt,0.5,0.5),k:tt-0.5,light:"day"});
      oo_tag(x,tt,w("upgrade","seventeenth",-0.2),c.quarter-0.4,960,560,"Tuesday 17 August: new sensors in 40 rooms",{align:"center",col:LP.ink});
      oo_hour(x,510,530,{old:ag_in(tt,w("quarter","once",-0.2),0.5),nw:ag_in(tt,w("quarter","quarter",-0.3),1.2),a:ag_in(tt,c.quarter,0.4),k:tt-c.quarter,light:"day"});
      oo_pill(x,tt,w("quarter","detail",-0.1),c.tells-0.4,1160,90,"More detail: a real improvement",{col:LP.green});
      oo_tag(x,tt,w("tells","nobody",-0.1),c.ran-0.6,1160,90,"Nobody tells the data team",{align:"center",col:LP.ink});}},
    // Monday 23 August, seven o'clock: the refresh runs, every check passes
    {at:c.ran-0.3,place:"ooMorning",later:true,keys:[[c.ran-0.3,960,540,1.0]],draw:(x,tt)=>{ivy(x,tt);
      oo_status(x,200,150,860,460,{ran:ag_in(tt,w("ran","runs",-0.1),0.4),kRan:tt-w("ran","runs",-0.1),checks:ag_in(tt,w("ran","check",-0.1),0.4),kCh:tt-w("ran","check",-0.1),bars:ag_in(tt,w("ran","seven",0),1.0)});}},
    // at the Green Belt, a seedling earned nothing until it lived
    {at:c.seedling-0.3,place:"ooHills",keys:[[c.seedling-0.3,980,660,1.4]],dis:1.0,draw:(x,tt)=>{const p=OO_ROW.pts[3];
      oo_seedling(x,p[0],p[1],1.3,{g:lerp(0.3,1,ag_sine(ag_in(tt,w("seedling","until",-0.3),1.4))),seed:43});
      const u=ag_in(tt,w("seedling","lived",-0.1),0.4);if(u>0.004){const f=lerp(0.5,1,ag_spr(tt,w("seedling","lived",-0.1),0.5));x.save();x.globalAlpha*=u;x.fillStyle=rgba(LP.green,1);x.beginPath();x.arc(p[0],p[1]-200,24*f,0,TAU);x.fill();lp_icon(x,"tick",p[0],p[1]-200,32*f,[255,255,255]);x.restore();}
      oo_tag(x,tt,w("seedling","earned",-0.2),null,980,440,"It earned nothing until it lived",{align:"center",col:LP.ink});}},
    // so Ivy reads the numbers, not only the tick
    {at:c.reads-0.3,place:"ooMorning",keys:[[c.reads-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{ivy(x,tt);
      oo_status(x,200,150,860,460,{ran:1,checks:1,bars:1});
      oo_tag(x,tt,w("reads","numbers",-0.1),c.drop-0.4,630,700,"The numbers, not only the tick",{align:"center",col:LP.orange});}},
    // forty rooms: the counts dropped to about a quarter; booked hours with nobody in, from one in five to more than half
    {at:c.drop-0.3,place:"ooMorning",keys:[[c.drop-0.3,960,540,1.0]],draw:(x,tt)=>{const d0=c.drop-0.1;
      oo_chart(x,120,130,1000,610,{u:ag_in(tt,d0,1.8),drop:ag_in(tt,w("drop","dropped",-0.1),0.5),vals:ag_in(tt,w("drop","quarter",-0.2),0.5),a:ag_in(tt,d0-0.2,0.4),k:tt-d0+0.2,light:"morning"});
      oo_empty(x,1200,170,{u:ag_in(tt,w("empty","more",-0.2),0.8),u2:ag_in(tt,w("empty","one",-0.2),0.6),a:ag_in(tt,c.empty,0.4),k:tt-c.empty,light:"morning"});}},
    // if nobody noticed: rooms released that classes really use
    {at:c.release-0.3,place:"ooMorning",later:true,keys:[[c.release-0.3,960,540,1.0]],draw:(x,tt)=>{
      oo_rooms(x,340,150,{mark:1,amber:ag_in(tt,c.release,0.6),lose:ag_in(tt,w("release","release",-0.1),0.5),light:"morning"});
      oo_tag(x,tt,w("release","classes",-0.2),c.wait-0.4,960,560,"Rooms that classes really use",{align:"center",col:LP.amber});}},
    // Ivy doesn't wait: at ten past eight, she writes to the readers
    {at:c.wait-0.3,place:"ooMorning",later:true,keys:[[c.wait-0.3,960,540,1.0]],draw:(x,tt)=>{ivy(x,tt);
      oo_tag(x,tt,w("wait","wait",-0.2),c.writes-0.3,640,300,"Not waiting to be sure, or to be asked",{align:"center",col:LP.ink});
      oo_sheet(x,tt,w("writes","ten",-0.2),180,150,900,{kick:"08:10 · To the readers",title:"The counts for 40 rooms look wrong",lines:["Don't use them yet","The right ones by tomorrow"]},
        {col:LP.amber,light:"morning",u:oo_u(tt,[w("writes","don't",-0.1),w("writes","right",-0.1)])});
      oo_pill(x,tt,w("first","first",-0.2),null,630,600,"Said first, before the fix",{col:LP.green});}}
  ]);
  oo_kick(ctx,S,1,{light:"morning"});
});

/* ---------------------------------------------------------------- 4. Fix it, or raise it */
scene("fix",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // with Sam, the feed for one room: four counts an hour; the step kept the first; the fix keeps the highest
    {at:0,place:"ooWork",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      const go=1-ag_in(tt,c.review-0.9,0.5);
      lp_person(x,"ivy",1150,690,0.95,{t:tt,cut:812,light:dy});lp_person(x,"sam",1580,690,0.95,{t:tt,flip:true,cut:812,light:dy,a:go});lp_table(x,940,820,860);
      oo_feed(x,200,140,{u:ag_in(tt,w("sam","feed",-0.2),1.2),first:ag_in(tt,w("step","kept",-0.1),0.6),max:ag_in(tt,w("fix","highest",-0.1),0.6),a:ag_in(tt,0.3,0.4)*go,light:"day"});
      oo_tag(x,tt,w("four","four",-0.1),c.step-0.4,520,660,"Since Tuesday: four an hour",{align:"center",col:LP.orange});
      oo_tag(x,tt,w("four","model",-0.1),c.step-0.4,520,740,"The model: built for one",{align:"center",col:LP.ink});
      oo_tag(x,tt,w("step","kept",-0.1),c.early-0.4,520,660,"Kept the first, dropped three",{align:"center",col:LP.amber});
      oo_tag(x,tt,w("early","first",-0.1),c.fix-0.4,520,660,"The first: one class leaving",{align:"center",col:LP.amber});
      oo_tag(x,tt,w("early","nearly",-0.2),c.fix-0.4,520,740,"So the rooms looked nearly empty",{align:"center",col:LP.amber});
      oo_pill(x,tt,w("fix","keep",-0.1),c.review-0.9,520,670,"Keep the hour's highest",{col:LP.green});}},
    // Jun reviews her pull request: Sam has left, and Ivy stays where she is
    {at:c.review-0.3,place:"ooWork",keys:[[c.review-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"ivy",1150,690,0.95,{t:tt,cut:812,light:dy});lp_person(x,"jun",1580,690,0.95,{t:tt,flip:true,cut:812,light:dy,a:ag_in(tt,c.review-0.2,0.6)});lp_table(x,940,820,860);
      oo_sheet(x,tt,w("review","pull",-0.2),180,150,700,{kick:"Pull request · Ivy Reyes",title:"Keep the hour's highest count",lines:["Reviewed by Jun Park"]},{light:"day",u:ag_in(tt,w("review","reviews",-0.1),0.5)});
      oo_pill(x,tt,w("review","every",-0.1),null,530,560,"Every change, reviewed by another",{col:LP.green,icon:"tick",size:28});}},
    // the days since Tuesday run again; on Tuesday morning, the right counts and a short note
    {at:c.rerun-0.3,place:"ooWork",later:true,keys:[[c.rerun-0.3,960,540,1.0]],draw:(x,tt)=>{
      oo_chart(x,120,130,1000,610,{u:1,drop:1,fixed:ag_in(tt,w("rerun","run",-0.1),2.0),a:ag_in(tt,c.rerun,0.4),light:"day"});
      oo_pill(x,tt,w("rerun","right",-0.2),null,620,800,"Tuesday 24 August: the right counts",{col:LP.green,icon:"tick",size:28});
      oo_sheet(x,tt,w("rerun","note",-0.1),1190,150,620,{kick:"Ivy's note to the readers",lines:["What happened","What it touched","What's fixed","What changes"]},
        {light:"day",u:oo_u(tt,[w("note","happened",-0.1),w("note","touched",-0.1),w("note","fixed",-0.1),w("note","changes",-0.1)])});}},
    // the sensors aren't hers: she raises it with Graham
    {at:c.mine-0.3,place:"ooWork",later:true,keys:[[c.mine-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"ivy",1060,680,0.95,{t:tt,light:dy});lp_person(x,"graham",1520,680,0.95,{t:tt,flip:true,light:dy});
      oo_tag(x,tt,w("mine","sensors",-0.1),c.raise+0.4,500,300,"The sensors: Facilities'",{align:"center",col:LP.ink});
      oo_sheet(x,tt,w("raise","From",-0.2),160,150,700,{kick:"From now on",title:"Facilities tells the data team before a sensor changes"},{col:LP.blue,light:"day"});}},
    // and a check of her own, which holds the refresh
    {at:c.check-0.3,place:"ooWork",later:true,keys:[[c.check-0.3,960,540,1.0]],draw:(x,tt)=>{lp_person(x,"ivy",1480,650,1.0,{t:tt,flip:true,light:dy});
      oo_check(x,180,150,{u:ag_in(tt,w("check","check",-0.1),1.4),today:ag_in(tt,w("holds","drop",-0.2),0.8),a:ag_in(tt,c.check,0.4),k:tt-c.check,light:"day"});
      oo_pill(x,tt,w("holds","holds",-0.1),null,560,690,"Refresh held",{col:LP.amber,icon:"wait"});
      oo_tag(x,tt,w("holds","tells",-0.1),null,560,780,"Ivy told, before anyone reads it",{align:"center",col:LP.ink});}}
  ]);
  oo_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Nobody to blame */
scene("blame",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"};
  // the three parts, each right about what it saw, and the joins between them
  const parts=[["Facilities","Made the sensors better","Facilities"],["Sam's platform","Loaded every count","platform"],["The step","Right for the data it was built for","step"]];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"ooOne",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      oo_tag(x,tt,w("nobody","Nobody",-0.1),null,1040,110,"Nobody did anything wrong",{align:"center",col:LP.ink});
      parts.forEach(([k,ti,word],i)=>{const t0=w("each",word,-0.2);oo_sheet(x,tt,t0,120+i*570,200,540,{kick:k,title:ti},{light:"late"});
        const u=ag_in(tt,w("fit","right",-0.1)+i*0.15,0.4);if(u>0.004){x.save();x.globalAlpha*=u;x.fillStyle=rgba(LP.green,1);x.beginPath();x.arc(390+i*570,500,24,0,TAU);x.fill();lp_icon(x,"tick",390+i*570,500,32,[255,255,255]);x.restore();}});
      // where the parts meet: each join, dashed and marked, the thing that failed
      const fA=ag_in(tt,w("fit","fit",-0.4),0.6);
      if(fA>0.004){x.save();x.globalAlpha*=fA;x.strokeStyle=rgba(LP.amber,1);x.lineWidth=5;x.setLineDash([14,12]);
        for(const [x0,x1] of [[430,920],[1000,1490]]){x.beginPath();x.moveTo(x0,500);x.lineTo(x1,500);x.stroke();}x.setLineDash([]);
        for(const [i,jx] of [[0,675],[1,1245]]){const f=lerp(0.5,1,ag_spr(tt,w("fit","fit",-0.4)+i*0.12,0.5));x.fillStyle=rgba(LP.amber,1);x.beginPath();x.arc(jx,500,24*f,0,TAU);x.fill();lp_icon(x,"cross",jx,500,28*f,[255,255,255]);}
        x.restore();}
      oo_pill(x,tt,w("fit","failed",-0.1),null,960,640,"What failed: how the parts fit together",{col:LP.amber});}},
    // a just culture
    {at:c.dekker-0.3,place:"ooOne",later:true,keys:[[c.dekker-0.3,960,540,1.0]],draw:(x,tt)=>{
      oo_sheet(x,tt,w("dekker","Sidney",-0.2),560,150,800,{kick:"Sidney Dekker · 2007",title:"A just culture",lines:["Ask what happened","And what must change","Not who to blame"]},
        {col:LP.blue,light:"late",u:oo_u(tt,[w("dekker","happened",-0.1),w("dekker","change",-0.1),w("dekker","blame",-0.2)])});}},
    // Helena's first question; why Ivy could say it first; giving an account
    {at:c.helena-0.3,place:"ooOne",later:true,keys:[[c.helena-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"helena",620,690,0.95,{t:tt,cut:812,light:lt});lp_person(x,"ivy",1300,690,0.95,{t:tt,flip:true,cut:812,light:lt});lp_table(x,520,820,880);
      oo_tag(x,tt,w("helena","who",-0.2),c.safe-0.4,960,200,"Not: who?",{align:"center",col:LP.mut});
      oo_tag(x,tt,w("helena","happened",-0.2),c.safe-0.4,960,280,"What happened? What do you need?",{align:"center",col:LP.ink});
      oo_pill(x,tt,w("safe","blamed",-0.2),c.account-0.5,960,240,"Where nobody is blamed, saying it early is safe",{col:LP.green,size:28});
      oo_sheet(x,tt,w("account","accountable",-0.2),560,90,800,{kick:"Accountable",title:"Giving an account",lines:["What happened, and how the next time goes better"]},
        {light:"late",u:ag_in(tt,w("account","happened",-0.1),0.5)});}}
  ]);
  oo_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back at the Green Belt: trees still standing
    {at:0,place:"ooGreen",keys:[[0,960,560,1.04],[0.2,960,540,1.0]],d:3,draw:(x,tt)=>{
      OO_WOMEN.forEach((P,i)=>lp_person(x,P,[420,760,1100][i],[740,756,748][i],0.75,{t:tt,light:OO_OUT}));
      oo_pill(x,tt,w("back","trees",-0.1),null,960,190,"Trees still standing, months later",{col:LP.green});
      oo_tag(x,tt,w("back","planting",-0.2),null,960,280,"Not the planting",{align:"center",col:LP.mut});}},
    // and Ivy: true counts, judged in June 2029
    {at:c.ivy-0.3,place:"ooMorning",keys:[[c.ivy-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{lp_person(x,"ivy",1480,650,1.0,{t:tt,flip:true,light:mo});
      oo_pill(x,tt,w("ivy","true",-0.2),null,640,300,"True counts, not a job that ran",{col:LP.green});
      oo_tag(x,tt,w("ivy","June",-0.2),null,640,390,"June 2029: the timetable change, judged on them",{align:"center",col:LP.blue});}},
    // what to do on Monday
    {at:c.know-0.3,place:"ooMorning",later:true,keys:[[c.know-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        oo_sheet(x,tt,c.know+0.3,120,120,820,{kick:"One",title:"Know who uses it, and for which decision"},{light:"morning"});
        oo_sheet(x,tt,w("watch","Watch",-0.1),980,120,820,{kick:"Two",title:"Watch what it's for, not only that it ran"},{col:LP.green,light:"morning"});
        oo_sheet(x,tt,w("say","say",-0.1),120,440,820,{kick:"Three",title:"When it's wrong, say so first"},{col:LP.amber,light:"morning"});
        oo_sheet(x,tt,w("mend","Fix",-0.1),980,440,820,{kick:"Four",title:"Fix yours, raise the rest, mend the fit"},{col:LP.blue,light:"morning"});
        x.restore();}
      oo_tag(x,tt,w("next","Measure",-0.1),c.take-0.4,960,780,"Next: Measure the work, not the people",{align:"center",col:LP.ink});
      const ta=ag_in(tt,c.take,0.4)*(1-ag_in(tt,e0,0.8));
      if(ta>0.004){for(const [s,wd,px,col] of [["Own what it's for","Own",960-300,LP.green],["Not only what you did","only",960+300,LP.ink]])
        {const t0=w("take",wd,-0.1);lp_pill(x,px,470,s,{col,size:34,a:ta*ag_in(tt,t0,0.4),k:tt-t0});}}}}
  ]);
  lp_end(ctx,S,t,e0,"Owning the outcome",OO_LAST,"Film 1 of 4","Ownership and performance");
  oo_kick(ctx,S,1-ag_in(t,e0,0.8),{light:"morning"});
});
ag_cutInto(["owns","monday","fix"]);
