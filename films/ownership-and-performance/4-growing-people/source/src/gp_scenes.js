/* ===== Growing people: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, or cuts where both show the same people. Sizes in
   the 1920 x 1080 frame. */

const GP_LAST="Their goals, weekly feedback about the work, the next step.";
// the film's number and title at the top left, from the second chapter on
function gp_kick(ctx,S,a,o){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"4","Growing people",Object.assign({a},o||{}));}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function gp_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const gp_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function gp_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 (and goes at t1)
function gp_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// a person who walks in from off the frame: x from x0 to x1 over 1.8 s from t0
const gp_walk=(t,t0,x0,x1)=>lerp(x0,x1,ag_sine((t-t0)/1.8));
// Ivy and Helena at the small table of her one-to-ones, seated across it (o.light, o.ivy, o.hel: their opacity)
function gp_oneToOne(x,tt,o){o=o||{};const lt={light:o.light||"late"},cut=lp_table(x,520,820,880,{a:0});
  lp_person(x,"ivy",620,690,0.95,{t:tt,cut,light:lt,a:o.ivy==null?1:o.ivy,gaze:[3,0]});lp_person(x,"helena",1300,690,0.95,{t:tt,flip:true,cut,light:lt,a:o.hel==null?1:o.hel,gaze:[3,0]});
  lp_table(x,520,820,880);}

/* ---------------------------------------------------------------- 1. Watching the children: Japan's schools, from 1872 */
scene("lesson",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const kidsT=w("when","child",-0.4),teachT=w("new","Teaching",-0.2),walkT=w("open","opened",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // Japan, 1872: an empty schoolroom, then the children at their desks
    {at:0,place:"gpClass",keys:[[0,960,520,1.06],[c.new,960,540,1.0]],d:3,draw:(x,tt)=>{
      gp_class(x,tt,{era:"meiji",teacher:ag_in(tt,teachT,0.8),kids:ag_in(tt,kidsT,1.0),obs:0});
      gp_sheet(x,tt,w("when","Japan",-0.2),70,150,450,{kick:"Japan, 1872",title:"A school for every child"},{light:null,pin:false,out:c.new-0.4});
      gp_sheet(x,tt,c.new+0.1,70,150,450,{kick:"Teaching",title:"New work",lines:["New subjects and methods","Few teachers trained for it"]},
        {col:LP.amber,light:null,pin:false,out:c.alone-0.6,u:gp_u(tt,[w("new","subjects",-0.1),w("new","few",-0.1)])});}},
    // 1877: schools across Japan, the four in ten with a single teacher, and the three in ten with a single classroom
    {at:c.alone-0.3,place:"gpWall",keys:[[c.alone-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      gp_sheet(x,tt,c.alone,660,110,600,{kick:"By 1877",title:"Schools across Japan"},{light:"day"});
      gp_schools(x,960,390,{u:ag_in(tt,c.alone+0.2,1.4),one:ag_in(tt,w("alone","teacher",-0.3),0.6),room:ag_in(tt,w("alone","classroom",-0.3),0.6)});
      gp_tag(x,tt,w("alone","teacher",0),null,960,500,"A single teacher: 4 in 10",{align:"center",col:LP.amber});
      gp_tag(x,tt,w("alone","classroom",0),null,960,750,"A single classroom: nearly 1 in 3",{align:"center",col:LP.amber});}},
    // the teacher alone: what each child has understood is out of sight, and nobody sees the lesson
    {at:c.see-0.3,place:"gpClass",keys:[[c.see-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const qa=ag_in(tt,w("see","understood",-0.4),0.6)*(1-ag_in(tt,c.change-0.2,0.6));
      gp_class(x,tt,{era:"meiji",obs:0});
      // a question over some of the children: what they understood, which the teacher can't see
      if(qa>0.004)[0,3,4,7,9].forEach((k,i)=>{const [hx,hy]=GP_HEADS[k],qi=qa*ag_in(tt,w("see","understood",-0.4)+i*0.12,0.5);lp_T(x,"?",hx,hy-14,{w:800,size:48,align:"center",col:LP.amber,a:qi});});
      gp_tag(x,tt,w("see","nobody",-0.1),c.change-0.2,280,520,"Nobody sees the lesson",{align:"center",col:LP.amber});
      gp_tag(x,tt,w("lost","behind",-0.2),c.change-0.2,1650,470,"They fall behind",{align:"center",col:LP.amber});
      gp_tag(x,tt,w("lost","never",-0.2),c.change-0.2,1650,550,"Nobody learns why",{align:"center",col:LP.amber});}},
    // the classroom opened: the visitors walk in and stand at the sides, notebooks in hand
    {at:c.open-0.3,place:"gpClass",keys:[[c.open-0.3,960,540,1.0]],draw:(x,tt)=>{const lx=gp_walk(tt,walkT,-430,0),rx=gp_walk(tt,walkT+0.3,430,0);
      gp_class(x,tt,{era:"meiji",lx,rx,look:ag_in(tt,walkT+1.6,0.8)});
      gp_tag(x,tt,w("groups","watching",-0.3),c.watch-0.4,300,170,"New teachers watch lessons",{align:"center",col:LP.blue});
      gp_tag(x,tt,w("groups","groups",-0.2),c.watch-0.4,300,250,"Groups learn together",{align:"center",col:LP.blue});}},
    // the visitors watch the children, not the teacher
    {at:c.watch-0.3,place:"gpClass",keys:[[c.watch-0.3,960,540,1.0],[c.watch,600,640,1.42]],d:1.8,draw:(x,tt)=>{
      gp_class(x,tt,{era:"meiji",look:1});}},
    // after the lesson, in the staffroom: what the children learned, where they got stuck; in the 1880s, lesson study
    {at:c.after-0.3,place:"gpStaff",keys:[[c.after-0.3,960,540,1.0]],cut:true,draw:(x,tt)=>{
      gp_staff(x,tt,{});
      gp_tag(x,tt,w("after","learned",-0.2),c.study-0.4,560,210,"What the children learned",{align:"center",col:LP.green});
      gp_tag(x,tt,w("after","stuck",-0.2),c.study-0.4,1360,210,"Where they got stuck",{align:"center",col:LP.amber});
      gp_sheet(x,tt,c.study+0.1,660,110,600,{kick:"The 1880s",title:"Lesson study",lines:["Jugyō kenkyū, in Japanese"]},{col:LP.blue,light:"late",u:ag_in(tt,w("study","Japanese",-0.6),0.5)});}},
    // the cycle: choose a goal, plan it together, one teaches while the others watch, improve it
    {at:c.cycle-0.3,place:"gpWall",keys:[[c.cycle-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      gp_cycle(x,960,480,300,{u:ag_in(tt,c.cycle,2.2),hi:[w("cycle","goal",-0.2),w("cycle","plan",-0.2),w("teach","teaches",-0.2),w("teach","improve",-0.2)].map(t0=>ag_in(tt,t0,0.4))});}},
    // today: lesson study in a classroom of now
    {at:c.spread-0.3,place:"gpClassToday",keys:[[c.spread-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      gp_class(x,tt,{era:"today",look:1});
      const fa=ag_in(tt,w("spread","ninety",-0.3),0.4);if(fa>0.004)lp_figure(x,70,118,470,{kick:"Japan, today",num:"99 in 100",label:"primary teachers took part in the past year"},{col:LP.green,light:null,pin:false,a:fa,k:tt-w("spread","ninety",-0.3)});}},
    // 1999: a book carries it to many countries
    {at:c.world-0.3,place:"gpWall",keys:[[c.world-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      gp_shut(x,520,300,1.0,{a:ag_in(tt,c.world,0.5)});
      gp_sheet(x,tt,w("world","book",-0.2),880,330,640,{kick:"After 1999",title:"A book carries it to many countries"},{light:"day"});}},
    // a trial in the United States: 39 teams, about three months
    {at:c.trial-0.3,place:"gpWall",later:true,keys:[[c.trial-0.3,960,540,1.0]],draw:(x,tt)=>{
      gp_sheet(x,tt,c.trial,240,140,760,{kick:"A trial in the United States",title:"39 teams of teachers, split at random",lines:["Some: about three months of lesson study, with research on fractions","The others: trained another way"]},
        {col:LP.blue,light:"day",u:gp_u(tt,[w("some","Some",-0.1),w("fractions","another",-0.2)])});
      gp_teams(x,1110,220,{u:ag_in(tt,w("trial","thirty",-0.2),1.6)});
      // their students' fractions, against teams who trained another way
      gp_sheet(x,tt,w("fractions","fractions",-0.3),240,600,760,{kick:"Their students",title:"Understood fractions better"},{col:LP.green,light:"day"});
      const sa=ag_in(tt,w("some","fractions",-0.2),0.5);if(sa>0.004){lp_sheet(x,1110,430,620,300,{light:"day",a:sa,k:tt-w("some","fractions",-0.2)});gp_strip(x,1160,480,520,{a:sa});}}},
    // at work: a new analyst, alone with her work, and a grade once a year
    {at:c.data-0.3,place:"gpGrey",keys:[[c.data-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const lt={light:"grey"},cut=lp_table(x,560,860,800,{a:0});
      lp_person(x,GP_ANALYST,960,660,1.0,{t:tt,cut,light:lt,gaze:[2,3]});lp_table(x,560,860,800,{floor:1060});lp_laptop(x,960,850,300,{glow:0.5});
      gp_tag(x,tt,w("data","nobody",-0.1),c.grow-0.4,960,170,"Nobody sees her work until it's done",{align:"center",col:LP.amber});
      gp_pill(x,tt,w("data","once",-0.1),c.grow-0.4,960,260,"Once a year, a grade",{col:LP.amber,icon:"wait"});}},
    // how people grow: goals they help set, weekly feedback about the work, a next step
    {at:c.grow-0.3,place:"gpMorning",keys:[[c.grow-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const ga=1-ag_in(tt,c.breath+0.2,0.8);x.save();x.globalAlpha*=ga;
      gp_pill(x,tt,w("grow","goals",-0.2),null,960,330,"Goals they help set",{col:LP.blue});
      gp_pill(x,tt,w("grow","feedback",-0.2),null,960,440,"Feedback every week, about the work",{col:LP.green});
      gp_pill(x,tt,w("grow","next",-0.2),null,960,550,"A next step",{col:LP.blue});x.restore();}}
  ]);
  // what the visitors look for, beside them as the camera comes close
  setScreen(ctx,S);for(const [wd,y,s] of [["answered",360,"How they answer"],["interested",450,"Whether they're interested"],["questions",540,"Whether the questions suit them"]])
    gp_tag(ctx,t,w("watch",wd,-0.2),c.after-0.6,1290,y,s,{col:LP.blue});
  lp_title(ctx,S,t,c.breath+0.2,"Growing people","Their goals, weekly feedback, the next step","Leading data people · Ownership and performance");
});

/* ---------------------------------------------------------------- 2. Goals of her own */
scene("goals",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 1 March: Ivy arrives; Helena doesn't hand her a list
    {at:0,place:"gpMorning",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      lp_person(x,"ivy",gp_walk(tt,0.3,-260,480),690,0.95,{t:tt,light:mo});
      lp_person(x,"helena",gp_walk(tt,c.helena-0.4,2180,1420),660,1.0,{t:tt,flip:true,light:mo});
      gp_sheet(x,tt,w("join","Ivy",-0.2),900,170,720,{kick:"Monday 1 March",title:"Ivy Reyes",lines:["A data analyst: her first job","A degree in statistics"]},
        {light:"morning",out:c.helena-0.5,u:gp_u(tt,[w("join","job",-0.4),w("join","statistics",-0.3)])});
      gp_pill(x,tt,w("helena","list",-0.2),c.write-0.4,970,330,"No list of goals handed down",{col:LP.ink,icon:"cross"});}},
    // her three goals, written by her, agreed on Friday 5 March
    {at:c.write-0.3,place:"gpMorning",keys:[[c.write-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"ivy",480,690,0.95,{t:tt,light:mo});
      gp_goals(x,780,170,{w:1000,light:"morning",a:ag_in(tt,c.write,0.4),k:tt-c.write,n:ag_in(tt,c.route,0.6)+ag_in(tt,c.pr,0.6)+ag_in(tt,c.own,0.6),
        agreed:ag_in(tt,w("write","Friday",-0.2),0.4),agreedK:tt-w("write","Friday",-0.2)});}},
    // Helena's part: real work to grow on, Graham's question
    {at:c.real-0.3,place:"gpMorning",later:true,keys:[[c.real-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"graham",1460,690,0.95,{t:tt,flip:true,light:mo});
      gp_sheet(x,tt,w("real","Graham",-0.3),180,170,820,{kick:"From Graham Ellis, Facilities",title:"Ask the University Council for a new teaching building?",lines:["Real work for Ivy to grow on"]},
        {col:LP.blue,light:"morning",u:ag_in(tt,w("real","rooms",-0.2),0.5)});}},
    // her goals are hers; the team's measures stay the team's
    {at:c.hers-0.3,place:"gpMorning",later:true,keys:[[c.hers-0.3,960,540,1.0]],draw:(x,tt)=>{
      gp_sheet(x,tt,c.hers,240,190,640,{kick:"Her goals",title:"Her own"},{col:LP.blue,light:"morning"});
      gp_sheet(x,tt,w("hers","measures",-0.2),1040,190,640,{kick:"The team's measures",title:"The team's"},{col:LP.orange,light:"morning"});
      gp_pill(x,tt,w("hers","targets",-0.3),null,1360,480,"Never her targets",{col:LP.amber,icon:"cross"});
      gp_tag(x,tt,w("teachers","teachers",-0.2),null,560,480,"Like the teachers: she chose",{align:"center",col:LP.blue});}},
    // Thursday 25 March: the first goal met, the route of Graham's question on one page
    {at:c.met-0.3,place:"gpMorning",later:true,keys:[[c.met-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"ivy",400,690,0.95,{t:tt,light:mo,pose:"hold",hold:gp_paper(6)});
      gp_route(x,960,150,{w:820,light:"morning",a:ag_in(tt,w("met","route",-0.4),0.4),k:tt-w("met","route",-0.4),u:ag_in(tt,w("met","decision",-0.2),w("met","sensors",0)-w("met","decision",-0.2)+0.4)});
      gp_pill(x,tt,w("met","met",-0.2),null,480,250,"First goal met, 25 March",{col:LP.green,icon:"tick"});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.8,c.helena-0.4,0.5)});
  gp_kick(ctx,S,ag_in(t,0.6,0.6),{light:"morning"});
});

/* ---------------------------------------------------------------- 3. Every Tuesday */
scene("tuesday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  // the three parts, each a card: o.lines for each, o.cols their bands
  const sbi=(x,tt,lines,cols,ts,out)=>["Situation","Behaviour","Impact"].forEach((k,i)=>gp_sheet(x,tt,ts[i],120+i*560,160,520,{kick:k,lines:[lines[i]]},{col:cols[i],light:"late",out}));
  ag_shots(ctx,S,t,sc.dur,[
    // every Tuesday, thirty minutes: Ivy's time, never a status report
    {at:0,place:"gpOne",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{gp_oneToOne(x,tt);
      gp_sheet(x,tt,w("meet","Tuesday",-0.2),560,110,800,{kick:"Every Tuesday, 30 minutes",title:"Ivy's time, about her"},{light:"late",out:c.kluger-0.5});
      gp_pill(x,tt,w("meet","status",-0.2),c.kluger-0.5,960,345,"Never a status report",{col:LP.ink,icon:"cross"});}},
    // 1996: more than 600 results on feedback; on average it helped, but more than a third of the time it made the work worse
    {at:c.kluger-0.3,place:"gpWall",keys:[[c.kluger-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      gp_sheet(x,tt,c.kluger,240,150,900,{kick:"1996",title:"More than 600 results on feedback",lines:["Avraham Kluger and Angelo DeNisi"]},{light:"day",u:ag_in(tt,w("kluger","Avraham",0),0.5)});
      gp_split(x,240,520,1440,{a:ag_in(tt,c.third-0.2,0.4),g:ag_in(tt,w("third","helped",-0.3),0.8),am:ag_in(tt,w("third","third",-0.3),0.9)});
      gp_tag(x,tt,w("third","helped",0),null,480,680,"On average, it helped",{align:"center",col:LP.green});
      gp_tag(x,tt,w("third","third",0),null,1410,680,"More than a third: worse",{align:"center",col:LP.amber});}},
    // least of all when it turned from the task to the person
    {at:c.person-0.3,place:"gpWall",later:true,keys:[[c.person-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=w("person","person",-0.3),u=ag_sine(ag_in(tt,p0,0.8));
      gp_pill(x,tt,c.person+0.2,null,560,420,"The task",{col:LP.green,size:34});
      gp_pill(x,tt,p0,null,1360,420,"The person",{col:LP.amber,size:34});
      if(u>0.004){x.save();x.strokeStyle=rgba(LP.ink,0.75);x.lineWidth=5;x.lineCap="round";x.beginPath();x.moveTo(720,420);x.lineTo(lerp(720,1180,u),420);x.stroke();
        if(u>0.9){x.beginPath();x.moveTo(1180,420);x.lineTo(1160,404);x.moveTo(1180,420);x.lineTo(1160,436);x.stroke();}x.restore();}
      gp_tag(x,tt,p0+0.5,null,1360,530,"Where it helped least",{align:"center",col:LP.amber});}},
    // so Helena's feedback has three parts
    {at:c.sbi-0.3,place:"gpWall",later:true,keys:[[c.sbi-0.3,960,540,1.0]],draw:(x,tt)=>{
      gp_sheet(x,tt,c.sbi+0.2,660,140,600,{kick:"Helena's feedback",title:"Three parts"},{light:"day"});
      ["Situation","Behaviour","Impact"].forEach((k,i)=>gp_sheet(x,tt,w("sbi",k.toLowerCase(),-0.3),120+i*560,400,520,{title:k},{col:i===2?LP.green:null,light:"day"}));
      gp_tag(x,tt,w("sbi","Center",-0.2),null,960,640,"The Center for Creative Leadership",{align:"center",col:LP.ink});}},
    // Tuesday 13 April: what she did, and what it changed
    {at:c.april-0.3,place:"gpOne",keys:[[c.april-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{gp_oneToOne(x,tt);
      gp_tag(x,tt,c.april,c.not-0.5,960,112,"Tuesday 13 April",{align:"center",col:LP.ink});
      sbi(x,tt,["Last Wednesday, reviewing the agent's draft","You checked it against Graham's word for “used”","His answer counts people in rooms, not bookings"],[null,null,LP.green],
        [w("april","Wednesday",-0.3),w("april","checked",-0.3),w("counts","counts",-0.4)],c.not-0.5);}},
    // not "you're brilliant": what she did, and what it changed
    {at:c.not-0.3,place:"gpOne",later:true,keys:[[c.not-0.3,960,540,1.0]],draw:(x,tt)=>{const b0=w("not","brilliant",-0.4);
      gp_pill(x,tt,b0,null,960,300,"“You're brilliant”",{col:LP.amber,icon:"cross",size:34});
      gp_tag(x,tt,b0+0.4,null,960,400,"About who she is",{align:"center",col:LP.amber});
      gp_pill(x,tt,w("not","did",-0.2),null,700,560,"What she did",{col:LP.ink});
      gp_pill(x,tt,w("not","changed",-0.2),null,1220,560,"What it changed",{col:LP.green});}},
    // hard feedback the same way: care personally, challenge directly
    {at:c.scott-0.3,place:"gpWall",keys:[[c.scott-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      gp_tag(x,tt,c.scott+0.2,null,960,150,"Hard feedback, the same way",{align:"center",col:LP.ink});
      gp_sheet(x,tt,w("scott","Candor",-0.6),360,240,1200,{kick:"Kim Scott, Radical Candor, 2017",title:"Care personally, and challenge directly"},{light:"day"});
      gp_pill(x,tt,w("scott","care",-0.2),null,700,580,"Care personally",{col:LP.green});
      gp_pill(x,tt,w("scott","challenge",-0.2),null,1220,580,"Challenge directly",{col:LP.blue});}},
    // Tuesday 25 May: the change she kept to herself, and the rushed review
    {at:c.may-0.3,place:"gpOne",keys:[[c.may-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{gp_oneToOne(x,tt);
      gp_tag(x,tt,c.may,c.works-0.4,960,112,"Tuesday 25 May",{align:"center",col:LP.ink});
      sbi(x,tt,["Last week, your change","Kept to yourself four days, to make it perfect","Jun had one afternoon: a rushed review"],[null,null,LP.amber],
        [w("may","Last",-0.3),w("may","four",-0.6),w("rushed","Jun",-0.3)],c.works-0.4);
      gp_pill(x,tt,w("works","works",-0.6),c.fresh-0.4,960,250,"Ask for review when it works",{col:LP.blue,size:34});}},
    // small and often, while the work is fresh: nothing waits for once a year
    {at:c.fresh-0.3,place:"gpOne",later:true,keys:[[c.fresh-0.3,960,540,1.0]],draw:(x,tt)=>{
      gp_weeks(x,330,420,{u:ag_in(tt,c.fresh,2.0),once:ag_in(tt,w("fresh","year",-1.0),0.4),x:ag_in(tt,w("fresh","year",-0.2),0.6)});
      gp_tag(x,tt,w("fresh","often",-0.3),null,830,330,"Small and often",{align:"center",col:LP.green});
      gp_tag(x,tt,w("fresh","year",-0.8),null,1430,330,"Once a year",{align:"center",col:LP.amber});}}
  ]);
  gp_kick(ctx,S,1,{light:"late"});
});

/* ---------------------------------------------------------------- 4. Both ways */
scene("both",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // Helena asks for feedback on herself; in June, Ivy tells her; Helena thanks her, and asks first what Ivy has tried
    {at:0,place:"gpOne",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{gp_oneToOne(x,tt);
      gp_sheet(x,tt,w("asks","feedback",-0.4),560,120,800,{kick:"Helena asks",title:"What should I do differently?"},{light:"late",out:c.june-0.4});
      gp_sheet(x,tt,c.june+0.1,460,110,1000,{kick:"June, Ivy",title:"When I bring you a question, you answer it at once, and I stop looking"},{col:LP.amber,light:"late",out:c.thanks-0.2});
      gp_sheet(x,tt,w("thanks","tried",-0.8),560,120,800,{kick:"From then on",title:"First: what have you tried?"},{col:LP.blue,light:"late"});
      gp_pill(x,tt,w("thanks","thanks",-0.3),w("thanks","tried",-1.0),960,250,"Thank you",{col:LP.green});}},
    // lesson study: planned together, so the talk afterwards is about the lesson and the learning
    {at:c.lesson-0.3,place:"gpStaff",keys:[[c.lesson-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      gp_staff(x,tt,{});
      gp_tag(x,tt,w("lesson","planned",-0.2),null,560,210,"Planned together",{align:"center",col:LP.blue});
      gp_tag(x,tt,w("lesson","talk",-0.2),null,1340,210,"The talk: the lesson, the learning",{align:"center",col:LP.green});}},
    // Thursday 24 June: the University Council puts off the building, and Graham writes to thank Helena
    {at:c.council-0.3,place:"gpWall",keys:[[c.council-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      gp_sheet(x,tt,c.council,160,190,800,{kick:"Thursday 24 June",title:"The University Council puts off the new teaching building"},{light:"day"});
      gp_sheet(x,tt,w("council","Graham",-0.2),1060,260,680,{kick:"From Graham Ellis",title:"Thank you",lines:["Your team's page let the University Council decide"]},{light:"day",tilt:-2});}},
    // at the next review, the note read to the team, and who did each part
    {at:c.names-0.3,place:"lpRoom",keys:[[c.names-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const dy={light:"day"};
      lp_person(x,"helena",300,690,0.9,{t:tt,light:dy,pose:"hold",hold:gp_paper(4)});
      [["ivy",700,"route","Ivy's route"],["jun",1020,"models","Jun's models"],["sam",1340,"sensors","Sam's sensors"],["mei",1660,"bookings","Mei's bookings"]].forEach(([k,px,wd,s])=>{
        lp_person(x,k,px,710,0.86,{t:tt,flip:true,light:dy});gp_pill(x,tt,w("parts",wd,-0.2),null,px,300,s,{col:LP.green});});
      gp_pill(x,tt,w("credit","credit",-0.3),null,960,170,"The team's credit, in public",{col:LP.green,size:34});}}
  ]);
  gp_kick(ctx,S,1,{light:"late"});
});

/* ---------------------------------------------------------------- 5. The next step */
scene("next",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},ev={light:"evening"};
  ag_shots(ctx,S,t,sc.dur,[
    // Thursday 1 July: Ivy owns her first data product
    {at:0,place:"gpMorning",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      lp_person(x,"ivy",420,690,0.95,{t:tt,light:mo});
      gp_sheet(x,tt,w("july","July",-0.2),820,150,960,{kick:"Data product, from Thursday 1 July",title:"Teaching space use",lines:["Owner: Ivy Reyes","Counts per room per hour, never a person","Refreshed every Monday by 07:00"]},
        {col:LP.orange,light:"morning",u:gp_u(tt,[w("july","owns",0),w("july","counts",-0.2),w("july","refreshed",-0.2)])});}},
    // Tuesday 20 July: her half year, back and forward
    {at:c.mid-0.3,place:"gpOne",keys:[[c.mid-0.3,960,540,1.0]],cut:true,draw:(x,tt)=>{gp_oneToOne(x,tt);
      gp_sheet(x,tt,c.mid,560,110,800,{kick:"Tuesday 20 July, her half year",title:"All three goals met"},{col:LP.green,light:"late",out:c.well-0.4});
      gp_sheet(x,tt,w("well","well",-0.4),120,110,820,{kick:"Went well",title:"Graham's page for the University Council"},{col:LP.green,light:"late",out:c.wants-0.4});
      gp_sheet(x,tt,w("well","differently",-0.4),980,110,820,{kick:"She'd do differently",title:"Ask for review earlier"},{col:LP.blue,light:"late",out:c.wants-0.4});
      gp_sheet(x,tt,w("wants","wants",-0.4),560,110,800,{kick:"What she wants next",lines:["Make her Monday refresh better","Teach what she learns"]},
        {col:LP.blue,light:"late",out:c.forward-0.4,u:gp_u(tt,[w("wants","wants",0),w("wants","teach",-0.2)])});
      gp_tag(x,tt,c.forward+0.1,c.dec-0.4,960,140,"A growth conversation looks forward",{align:"center",col:LP.ink});
      gp_pill(x,tt,w("forward","wants",-0.3),c.dec-0.4,640,250,"Where she wants to go",{col:LP.blue});
      gp_pill(x,tt,w("forward","needs",-0.3),c.dec-0.4,1280,250,"What she needs to get there",{col:LP.blue});}},
    // Tuesday 14 December: six months owning it; her next goal, chosen by her
    {at:c.dec-0.3,place:"gpDecember",later:true,keys:[[c.dec-0.3,960,540,1.0]],draw:(x,tt)=>{gp_oneToOne(x,tt,{light:"evening"});
      gp_sheet(x,tt,c.dec,560,110,800,{kick:"Tuesday 14 December",title:"Nearly six months owning Teaching space use"},{col:LP.orange,light:"evening",out:c.coach-0.4});
      gp_sheet(x,tt,c.coach+0.15,560,110,800,{kick:"Her next goal, chosen by her",title:"Coach the next graduate, in 2028"},{col:LP.blue,light:"evening"});}},
    // analyst, then owner, then coach
    {at:c.steps-0.3,place:"gpDecember",later:true,keys:[[c.steps-0.3,960,540,1.0]],draw:(x,tt)=>{
      gp_steps(x,360,990,{sw:400,sh:140,u:ag_in(tt,w("steps","Analyst",-0.3),w("steps","coach",0)-w("steps","Analyst",-0.3)+0.3)});}}
  ]);
  gp_kick(ctx,S,1,{light:t>c.dec?"evening":"morning"});
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},dy={light:"day"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back in Japan's schools: a goal they chose, eyes on the children's learning, a better lesson next time
    {at:0,place:"gpClassToday",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      gp_class(x,tt,{era:"today",look:1});
      gp_pill(x,tt,w("way","goal",-0.2),null,960,210,"A goal they chose",{col:LP.blue});
      gp_pill(x,tt,w("way","eyes",-0.2),null,960,310,"Eyes on the children's learning",{col:LP.green});
      gp_pill(x,tt,w("way","better",-0.2),null,960,410,"A better lesson next time",{col:LP.blue});}},
    // Helena did the same for Ivy
    {at:c.helena-0.3,place:"gpMorning",keys:[[c.helena-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      lp_person(x,"helena",380,660,0.95,{t:tt,light:mo});lp_person(x,"ivy",800,670,0.92,{t:tt,flip:true,light:mo});
      gp_pill(x,tt,w("helena","goals",-0.2),null,1390,300,"Goals of her own",{col:LP.blue});
      gp_pill(x,tt,w("helena","feedback",-0.2),null,1390,410,"Feedback every week, about the work",{col:LP.green});
      gp_pill(x,tt,w("helena","next",-0.2),null,1390,520,"The next step",{col:LP.blue});}},
    // what to do on Monday
    {at:c.goals-0.3,place:"gpMorning",later:true,keys:[[c.goals-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.module-0.4,0.6);if(g<=0.004)return;x.save();x.globalAlpha*=g;
      gp_sheet(x,tt,c.goals+0.2,120,140,820,{kick:"One",title:"Let people write their own goals, then agree them"},{col:LP.blue,light:"morning"});
      gp_sheet(x,tt,w("feedback","feedback",-0.4),980,140,820,{kick:"Two",title:"Feedback every week: the situation, what they did, its effect"},{col:LP.green,light:"morning"});
      gp_sheet(x,tt,w("ask","Ask",-0.2),120,460,820,{kick:"Three",title:"Ask for feedback on yourself, and act on it"},{light:"morning"});
      gp_sheet(x,tt,w("forward","Look",-0.2),980,460,820,{kick:"Four",title:"Look forward, and give the credit in public"},{col:LP.blue,light:"morning"});x.restore();}},
    // the module's last word: leading the people who do the work is a skill too; and the film's
    {at:c.module-0.3,place:"lpRoom",keys:[[c.module-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      [["noor",250],["yusuf",480],["jun",710],["helena",940],["ivy",1170],["sam",1400],["mei",1640]].forEach(([k,px],i)=>lp_person(x,k,px,730,0.72,{t:tt,flip:i>=4,light:dy}));
      gp_tag(x,tt,w("module","Leading",-0.3),c.take-0.4,960,250,"Leading the people who do it: a skill too",{align:"center",col:LP.ink});
      const ta=ag_in(tt,c.take,0.4)*(1-ag_in(tt,e0,0.8));
      if(ta>0.004){for(const [s,wd,px,col] of [["Their goals","goals",420,LP.blue],["Weekly feedback about the work","weekly",960,LP.green],["The next step","next",1500,LP.blue]])
        {const t0=w("take",wd,-0.1);lp_pill(x,px,300,s,{col,size:34,a:ta*ag_in(tt,t0,0.4),k:tt-t0});}}}}
  ]);
  lp_end(ctx,S,t,e0,"Growing people",GP_LAST,"Film 4 of 4","Ownership and performance");
  gp_kick(ctx,S,1-ag_in(t,e0,0.8),{light:"morning"});
});
ag_cutInto(["goals","tuesday","both","next"]);
