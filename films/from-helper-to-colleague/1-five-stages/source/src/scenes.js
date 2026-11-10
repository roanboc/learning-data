/* ===== Five stages, not a switch: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): a place painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice.
   The hills are one room, by day and by night: the camera glides from one framing to the next, the car drives on, and only the light
   changes. The lab is one room too, by day and by night: from chapter 2 on, each chapter opens where the last one ends (ag_cutInto),
   the five stages standing on the floor, big or small, and whatever moves slides there. Only the opening's step into the lab and the
   last chapter's step back to the hills change the whole picture, so they dissolve. The corner tag is drawn over the shots, after
   each one has come in and before the next. */

const FS_TAG_80S="New Zealand · 1980s",FS_TAG_87="New Zealand · from 1987";
function fs_tags(ctx,S,t,list){setScreen(ctx,S);for(const [t0,t1,s] of list){const a=ag_in(t,t0,0.5)*(1-ag_in(t,t1-0.4,0.4));if(a>0)fs_corner(ctx,s,a);}}
// the three signs, on the far verge: boards above the cars that pass in front of them
const FS_SIGNS=[[0.2,"Stage 1","Learner"],[0.52,"Stage 2","Restricted"],[0.84,"Stage 3","Full"]];
function fs_signAt(u){const r=fs_roadAt(u),nx=-Math.sin(r.ang),ny=Math.cos(r.ang),d=-(r.w*0.5+14);return{x:r.x+nx*d,y:r.y+ny*d};}
function fs_signs(x,o){o=o||{};FS_SIGNS.forEach(([u,kk,tl],i)=>{const p=fs_signAt(u),g=v=>v?(Array.isArray(v)?v[i]:v):0;
  fs_sign(x,p.x,p.y,{kick:kk,title:tl},{a:o.a==null?1:g(o.a),k:o.k?o.k[i]:null,lit:g(o.lit),dim:g(o.dim)});});}
// the young driver by the road, holding the licence
function fs_teen(x,tt,a){withA(x,a,()=>ag_person(x,FS_P.teen,700,646,0.95,{t:tt,pose:"hold",hold:fs_licence,gaze:[4,-1]}));}
// the workload agent's tasks: [text, stage (0 to 4), place on its stage (0 lowest)]. Stage 4 holds two: fix a model, and the night
// build in production above it, one place up, since stage 5's card stands only one tag higher than stage 4's and its tag sits
// beside that place; the place between them is the night task's in test, when it's moved down a stage
const FS_TASKS=[["a word about staff",0,0],["a new question",2,0],["fix a model",3,0],["night build · test",4,0],["night build · production",3,2]];
// where each task's tag rests on the stages L (a layout), the night task in test at stage 4 (index 3) when it's moved down (dn 0 to 1)
function fs_taskAt(x,st,i,dn){const T_=FS_TASKS[i];if(i===3&&dn>0){const a=fs_tagAt(x,st[4],0,T_[0]),b=fs_tagAt(x,st[3],1,T_[0]),k=ag_sine(dn);
    return{x:lerp(a.x,b.x,k),y:lerp(a.y,b.y,k)-Math.sin(Math.PI*dn)*40};}
  return fs_tagAt(x,st[T_[1]],T_[2],T_[0]);}
// the tags, each coming from the agent (u[i] 0 to 1) to its stage; o.col [i], o.glow [i], o.a [i], o.dn (the night task moved down)
function fs_tasks(x,st,o){const from={x:FL.agent.x+120,y:FL.agent.y+30};FS_TASKS.forEach(([tx],i)=>{const u=o.u?o.u[i]:1,a=(o.a?o.a[i]:1)*(o.all==null?1:o.all);if(u<=0||a<=0)return;
  const to=fs_taskAt(x,st,i,o.dn||0);fs_tagMove(x,from,to,u,tx,{a:a*clamp(u*4,0,1),col:o.col&&o.col[i]||AG.blue,glow:o.glow?o.glow[i]:0});});}

/* ---------------------------------------------------------------- 1 · A licence in stages */
scene("licence",(ctx,S,t,sc)=>{const c=sc.cues,scr=(x,f)=>{x.save();setScreen(x,S);f();x.restore();},P=fs_once(sc,"P",()=>({tests:wAt(sc,"fifteen","the driving tests"),lic:wAt(sc,"fifteen","get a licence"),
    al:wAt(sc,"alone","drive alone"),hour:wAt(sc,"alone","at any hour"),car:wAt(sc,"alone","a car full"),far:wAt(sc,"crashed","far more often"),
    night:wAt(sc,"crashed","at night"),friends:wAt(sc,"crashed","with friends"),off:wAt(sc,"switch","off one day"),on:wAt(sc,"switch","fully on"),
    exp:wAt(sc,"switch","experience"),three:wAt(sc,"stages87","three stages"),beside:wAt(sc,"learner","beside you"),alone2:wAt(sc,"restricted","drive alone"),
    ten:wAt(sc,"restricted","not between"),nop:wAt(sc,"passengers","no passengers"),unless:wAt(sc,"passengers","unless"),another:wAt(sc,"full","another test"),
    fullL:wAt(sc,"full","the full licence"),quarter:wAt(sc,"fell","almost a quarter"),ages:wAt(sc,"notall","other ages"),fewer:wAt(sc,"notall","fewer young"),
    lessN:wAt(sc,"worked","fewer of those"),wfirst:wAt(sc,"first","the world's first"),usa:wAt(sc,"first","every American state"),
    count:wAt(sc,"anil","how many people"),every:wAt(sc,"risk","every right"),fifteen2:wAt(sc,"risk","a full licence"),how:wAt(sc,"risk2","how those numbers"),
    alone3:wAt(sc,"risk2","alone"),atnight:wAt(sc,"risk2","at night"),shown:wAt(sc,"risk2","before it had"),plan:wAt(sc,"harm","plan the next semester"),
    atime:wAt(sc,"stage","a stage at a time"),each:wAt(sc,"stage","each kind"),behind:wAt(sc,"stage","stand behind")}));
  // the car through the three stages, in one drive: the young driver and the parent, then the young driver alone, then the full licence
  // the learner slowly past the first sign, the restricted driver past the second, then on past the third, faster
  const carU=tt=>tt<c.restricted?lerp(-0.3,0.34,ag_sine((tt-c.learner+1.5)/(c.restricted-c.learner+1.5))):tt<c.full?lerp(0.34,0.62,ag_sine((tt-c.restricted)/(c.full-c.restricted)))
    :lerp(0.62,1.32,clamp((tt-c.full)/(c.last-c.full),0,1));
  ag_shots(ctx,S,t,sc.dur,[
    // New Zealand in the 1980s: green hills, a road, a car going by
    {at:0,place:"fsHills",keys:[[0,1060,560,1.12],[0.4,960,540,1.0]],d:5,push:0,draw:(x,tt)=>{
      const L=fs_lane(lerp(-0.3,2.0,clamp((tt-0.6)/(c.fifteen+0.6),0,1)));fs_car(x,L.x,L.y,L.s,{ang:L.ang,rot:tt*6,people:[fs_seat("f1","driver")],a:1-ag_in(tt,c.fifteen-0.6,0.5)});}},
    // at fifteen, a young person could pass the tests and get a licence: the young driver by the road, holding it
    {at:c.fifteen,place:"fsHills",keys:[[c.fifteen,860,560,1.12]],push:0.02,draw:(x,tt)=>{fs_teen(x,tt,ag_in(tt,c.fifteen,0.6));
      fs_card(x,1010,236,560,"New Zealand · before 1987","A licence at fifteen",null,{kickCol:AG.blue,a:ag_in(tt,P.lic,0.4),k:ag_spr(tt,P.lic)});}},
    // from that day they could drive alone, at any hour, with a car full of friends: the same road at night, a car of friends going by
    {at:c.alone,place:"fsHillsNight",keys:[[c.alone,960,560,1.06]],push:0.03,draw:(x,tt)=>{
      fs_drive(x,tt,c.alone-0.2,c.hurt-0.4,-0.36,1.9,{lin:1,night:true,people:[fs_seat("teen","driver"),fs_seat("f1","front"),fs_seat("f2","back"),fs_seat("f3","back2")]});
      const p1=fs_pillL(x,980,206,"alone",{a:ag_io(tt,P.al,c.crashed-0.3,0.4)}),p2=fs_pillL(x,p1.x+p1.w+18,206,"at any hour",{a:ag_io(tt,P.hour,c.crashed-0.3,0.4)});
      fs_pillL(x,p2.x+p2.w+18,206,"with friends",{a:ag_io(tt,P.car,c.crashed-0.3,0.4)});
      // they crashed far more often than older drivers, most of all at night and with friends in the car
      fs_card(x,600,170,690,"New drivers that young","Far more crashes than older ones",null,{kickCol:AG.amber,edge:AG.amber,edgeA:0.6,a:ag_io(tt,P.far,c.hurt-0.2,0.5),k:ag_spr(tt,P.far)});
      const q1=fs_pillL(x,600,360,"at night",{icon:"warn",col:AG.amber,a:ag_io(tt,P.night,c.hurt-0.2,0.5)});
      fs_pillL(x,q1.x+q1.w+18,360,"with friends in the car",{icon:"warn",col:AG.amber,a:ag_io(tt,P.friends,c.hurt-0.2,0.5)});}},
    // many were badly hurt, and some were killed: the empty road at night, held in silence
    {at:c.hurt,place:"fsHillsNight",keys:[[c.hurt,1120,600,1.14]],d:3,push:0.04},
    // the licence was a switch, off one day and fully on the next, and experience came only after it
    {at:c.switch,place:"fsHills",keys:[[c.switch,960,520,1.04]],push:0.02,draw:(x,tt)=>{
      fs_switch(x,560,250,ag_sine((tt-P.on+0.2)/0.35),{a:ag_in(tt,c.switch+0.2,0.5)*(1-ag_in(tt,c.stages87-0.7,0.5)),k:ag_spr(tt,c.switch+0.2)});
      fs_pillL(x,560,640,"experience comes only after it",{a:ag_io(tt,P.exp,c.stages87-0.7,0.4)});}},
    // on 1 August 1987 the licence comes in three stages: three signs along the road, and the car drives past them, the camera wide,
    // all three in view, the camera closing in slowly: the learner with a fully licensed driver beside them; then a test, and alone
    // (the parent leaves the car, faded as one picture), but not at night and with no passengers; another test, and the full licence.
    // The cards stay on the screen, above the signs
    {at:c.stages87,place:"fsHills",keys:[[c.stages87,960,540,1]],push:0.03,draw:(x,tt)=>{
      const k=FS_SIGNS.map((_,i)=>ag_spr(tt,P.three+0.32*i)),a=FS_SIGNS.map((_,i)=>ag_in(tt,P.three+0.32*i+0.06,0.3)),
        lit=[ag_io(tt,c.learner,c.restricted,0.5),ag_io(tt,c.restricted,c.full,0.5),ag_in(tt,c.full,0.5)];
      fs_signs(x,{a,k,lit});
      const u=carU(tt),L=fs_lane(u),solo=ag_in(tt,c.restricted-0.4,0.6);
      fs_car(x,L.x,L.y,L.s,{ang:L.ang,rot:u*60,people:[fs_seat("teen","driver"),Object.assign(fs_seat("parent","front"),{a:1-solo})]});
      scr(x,()=>{
        fs_card(x,560,150,800,"1 August 1987","A licence in three stages",null,{kickCol:AG.blue,a:ag_io(tt,c.stages87+0.4,c.learner-0.3,0.4),k:ag_spr(tt,c.stages87+0.4)});
        fs_list(x,170,150,560,"Learner · 6 months",[{t:"Only with a fully licensed"},{t:"driver beside you"}],{a:ag_io(tt,c.learner+0.4,c.restricted-0.3,0.4),k:ag_spr(tt,c.learner+0.4)});
        fs_list(x,560,150,680,"Restricted · after a test",[{t:"Alone, but not 10 pm to 5 am"},{t:"No passengers, unless a fully",a:ag_in(tt,P.nop,0.4)},{t:"licensed driver sits beside you",a:ag_in(tt,P.unless,0.4)}],
          {a:ag_io(tt,c.restricted+0.4,c.full-0.3,0.4),k:ag_spr(tt,c.restricted+0.4)});
        fs_list(x,930,150,600,"Full · after another test",[{t:"Alone, at any hour"},{t:"With friends in the car"}],{a:ag_io(tt,P.fullL,c.last-0.3,0.4),k:ag_spr(tt,P.fullL)});});}},
    // the riskiest driving, at night and with friends, came last: the road at night, the car of friends past the last sign
    {at:c.last,place:"fsHillsNight",keys:[[c.last,1180,540,1.12]],push:0.02,draw:(x,tt)=>{fs_signs(x,{a:[0,1,1],lit:[0,0,ag_in(tt,c.last+0.6,0.5)],dim:[0,0.6,0]});
      fs_drive(x,tt,c.last-0.3,c.fell,0.5,1.8,{lin:1,night:true,people:[fs_seat("teen","driver"),fs_seat("f1","front"),fs_seat("f2","back"),fs_seat("f3","back2")]});
      fs_pillL(x,980,236,"at night, with friends: last",{col:AG.blue,a:ag_in(tt,c.last+0.6,0.5)*(1-ag_in(tt,c.fell-0.5,0.4))});}},
    // in the years after, serious car-crash injuries among 15 to 19 year olds fell by almost a quarter; not all of it the stages; but
    // the stages did their part; the world's first licence in stages
    {at:c.fell,place:"fsHills",keys:[[c.fell,960,540,1]],push:0.02,draw:(x,tt)=>{fs_signs(x,{dim:0.5});
      fs_card(x,500,160,920,"Ages 15 to 19 · the years after 1987","Serious car-crash injuries: almost a quarter fewer","about 23% fewer · Langley, Wagenaar and Begg, 1996",
        {kickCol:AG.blue,edge:AG.green,edgeA:0.6,a:ag_io(tt,c.fell+0.3,c.worked-0.3,0.4),k:ag_spr(tt,c.fell+0.3)});
      fs_pillL(x,500,330,"injuries fell at other ages too",{a:ag_io(tt,P.ages,c.worked-0.3,0.4)});
      fs_pillL(x,500,404,"fewer young people drove",{a:ag_io(tt,P.fewer,c.worked-0.3,0.4)});
      fs_card(x,500,160,920,"When restricted drivers crashed","Fewer crashes at night, and with passengers","Begg, Stephenson, Alsop and Langley, 2001",
        {kickCol:AG.blue,edge:AG.green,edgeA:0.6,icon:"tick",a:ag_io(tt,P.lessN-0.2,c.first-0.3,0.4),k:ag_spr(tt,P.lessN-0.2)});
      fs_card(x,500,160,920,"New Zealand · 1987","The world's first licence in stages",null,{kickCol:AG.blue,a:ag_io(tt,P.wfirst,c.uni-0.4,0.4),k:ag_spr(tt,P.wfirst)});
      fs_pillL(x,500,330,"every American state has one now",{a:ag_io(tt,P.usa,c.uni-0.4,0.4)});}},
    // at the university, an agent earns its freedom the same way: Anil's workload agent, its answer for Health's heads of school,
    // every right at once, the next semester planned on numbers no one checked, and its freedom a stage at a time
    {at:c.uni,place:"fsLab",keys:[[c.uni,960,540,1]],push:0,draw:(x,tt)=>{withA(x,1-ag_in(tt,c.breath+0.1,0.6),()=>{const ga=1-ag_in(tt,P.atime-0.2,0.7);
      fs_agent(x,tt,{at:FL.agentWide,a:ag_in(tt,c.uni+0.3,0.6)*ga,think:ag_io(tt,P.how,P.shown+1.2,0.5),drop:60});
      fs_answer(x,230,200,660,{a:ag_in(tt,P.count-0.2,0.4)*(1-ag_in(tt,c.breath-0.9,0.5)),k:ag_spr(tt,P.count-0.2),warn:ag_io(tt,P.how,P.atime,0.3)>0.5,ok:tt>P.behind});
      fs_card(x,230,420,620,"Like a full licence at fifteen","Every right, at once",null,{kickCol:AG.amber,edge:AG.amber,edgeA:0.6,a:ag_io(tt,P.every,P.atime-0.3,0.4),k:ag_spr(tt,P.every)});
      const r1=fs_pillL(x,230,610,"alone",{icon:"warn",col:AG.amber,a:ag_io(tt,P.alone3,P.atime-0.3,0.4)}),r2=fs_pillL(x,r1.x+r1.w+16,610,"at night",{icon:"warn",col:AG.amber,a:ag_io(tt,P.atnight,P.atime-0.3,0.4)});
      fs_pillL(x,230,690,"before it has shown it can",{icon:"warn",col:AG.amber,a:ag_io(tt,P.shown,P.atime-0.3,0.4)});
      fs_pillL(x,230,770,"planned on numbers no one checked",{icon:"warn",col:AG.amber,a:ag_io(tt,P.plan,P.atime-0.3,0.4)});
      const B=FL.big;fs_stages(x,B.x,B.y,B.w,{k:[0,1,2,3,4].map(i=>ag_spr(tt,P.atime+0.25+0.28*i)),lit:[0,1,2,3,4].map(i=>ag_io(tt,P.each+0.2*i,P.each+1.2+0.2*i,0.4))});
      FS_KICK(x,{a:ag_in(tt,c.uni+0.6,0.6)});});ag_roomLight(x,1);}}
  ],0.6);
  fs_tags(ctx,S,t,[[0.6,c.stages87,FS_TAG_80S],[c.stages87+0.6,c.uni,FS_TAG_87]]);
  ag_title(ctx,S,t,c.breath,"Five stages, not a switch","how an agent earns its freedom, one kind of task at a time","FILM 1 OF 7 · FROM HELPER TO COLLEAGUE");});

/* ---------------------------------------------------------------- 2 · Five stages and their gates */
scene("stages",(ctx,S,t,sc)=>{const c=sc.cues,P=fs_once(sc,"P",()=>({junior:wAt(sc,"road","a junior assistant"),contrib:wAt(sc,"road","a team contributor"),
    who:wAt(sc,"three","whose identity"),how:wAt(sc,"three","how much"),what:wAt(sc,"three","what the person"),
    passed:wAt(sc,"decide","has passed"),not:c.notswitch}));
  const B=FL.big,lines=["s1","s2","s3","s4","s5"],at=[c.s1,c.s2,c.s3,c.s4,c.s5],end=[c.s2,c.s3,c.s4,c.s5,c.gates];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"fsLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      const lit=[0,1,2,3,4].map(i=>Math.max(ag_io(tt,at[i]+0.1,end[i]-0.2,0.4),ag_io(tt,P.not+0.15*i,P.not+1.4+0.15*i,0.4)));
      const fi=[0,1,2,3,4].filter(i=>tt>=at[i]-0.3&&tt<end[i]).pop(),fa=fi==null?0:ag_io(tt,at[fi]+0.2,end[fi]-0.3,0.4);
      const gi=[c.g1,c.g2,c.g3,c.g4,c.g5],gEnd=[c.g2,c.g3,c.g4,c.g5,c.decide],gk=[0,1,2,3,4].filter(i=>tt>=gi[i]-0.3&&tt<gEnd[i]).pop();
      const R=fs_stages(x,B.x,B.y,B.w,{lit,dim:0.4*Math.max(ag_io(tt,c.s1,c.gates-0.2,0.6),ag_io(tt,c.g1,c.decide,0.6)),
        gates:[0,1,2,3,4].map(i=>ag_in(tt,c.gates+0.3+0.18*i,0.4)),passed:[0,1,2,3,4].map(i=>ag_in(tt,P.passed-0.3+0.2*i,0.4)),
        facts:fi==null?null:{i:fi,a:fa,x:120,y:128,w:680,k:ag_spr(tt,at[fi]+0.2)},
        gate:gk==null?null:{i:gk,a:ag_io(tt,gi[gk]+0.05,gEnd[gk]-0.15,0.3),x:120,y:150,k:ag_spr(tt,gi[gk]+0.05)}});
      // from a junior assistant to a team contributor
      ag_pill(x,R.stages[0].cx,R.stages[0].y-44,"a junior assistant",{a:ag_io(tt,P.junior,c.s1-0.2,0.4),size:28});
      ag_pill(x,R.stages[4].cx-40,R.stages[4].y-44,"a team contributor",{a:ag_io(tt,P.contrib,c.s1-0.2,0.4),size:28});
      // each stage changes three things
      const q=[P.who,P.how,P.what];["Whose identity it uses","How much it may do","What the person does"].forEach((s,i)=>
        fs_pillL(x,150,170+i*84,s,{col:AG.blue,a:ag_io(tt,q[i],c.s1-0.3,0.4)}));
      // a person decides when it has passed
      fs_pillL(x,150,170,"A person decides it has passed",{icon:"tick",col:AG.green,a:ag_io(tt,P.passed-0.2,sc.dur-1.6,0.4)});
      ag_roomLight(x,1);FS_KICK(x);}}
  ],0.6);});

/* ---------------------------------------------------------------- 3 · One agent, four stages */
scene("tasks",(ctx,S,t,sc)=>{const c=sc.cues,P=fs_once(sc,"P",()=>({id:wAt(sc,"own","its own identity"),since:wAt(sc,"own","since September"),
    hr:wAt(sc,"word","HR decides"),anil:wAt(sc,"question","Anil checks"),pr:wAt(sc,"fix","a pull request"),noor:wAt(sc,"fix","Noor approves"),
    mand:wAt(sc,"night","within its mandate"),morning:wAt(sc,"night","reports by morning"),drafts:wAt(sc,"prod","drafts the fix"),noor2:wAt(sc,"prod","Noor approves"),
    plain:wAt(sc,"rerun","a plain job"),day:wAt(sc,"driver","free by day"),test:wAt(sc,"driver","more freedom in test"),
    ident:wAt(sc,"rule","Identity"),stage:wAt(sc,"rule","The stage")}));
  // the stages hold still while the chapter before fades out (its first 0.8 s), then slide to the right and take their short names
  const lay=tt=>fs_layout(clamp((tt-0.9)/1.8,0,1));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"fsLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{const L=lay(tt),all=ag_in(tt,P.stage,0.5);
      // each stage lit while its task is told; stage 4 again for the night build in production, and stages 4 and 5 together for the
      // same task in test and in production; at the end, every stage that holds a task
      const R=fs_stages(x,L.x,L.y,L.w,{short:ag_in(tt,1.2,1.0),gates:1-ag_in(tt,0.9,0.7),passed:1,
        lit:[Math.max(ag_io(tt,c.word,c.question,0.4),all),0,Math.max(ag_io(tt,c.question,c.fix,0.4),all),
          Math.max(ag_io(tt,c.fix,c.night,0.4),ag_io(tt,c.prod,P.ident,0.4),all),Math.max(ag_io(tt,c.night,c.prod,0.4),ag_io(tt,c.driver,P.ident,0.4),all)]});
      // Anil's workload agent, with its own identity since September
      fs_agent(x,tt,{a:ag_in(tt,c.own-0.3,0.6),glow:Math.max(ag_io(tt,P.id,c.notone+0.4,0.4),ag_in(tt,P.ident,0.5)),think:ag_io(tt,c.night,P.morning+0.6,0.4)});
      fs_card(x,410,120,520,"Its own identity since","September 2026",null,{kickCol:AG.mut,a:ag_io(tt,P.since-0.2,c.word-0.2,0.4),k:ag_spr(tt,P.since-0.2)});
      // its tasks, each to its own stage
      const ts=[c.word+0.3,c.question+0.3,c.fix+0.3,c.night+0.3,c.prod+0.3];
      fs_tasks(x,R.stages,{u:ts.map(s=>clamp((tt-s)/1.1,0,1)),glow:[0,1,2,3,4].map(i=>Math.max(ag_io(tt,ts[i]+0.9,ts[i]+2.6,0.4),all))});
      // who decides, for each: HR for a word about staff (no one drawn: an office); Anil checks a new question; Jun reviews a fix and
      // Noor approves it for production; Anil reads the night's report; Noor approves the fix the agent drafts in production
      fs_pillL(x,500,470,"HR decides",{a:ag_io(tt,P.hr,c.question-0.2,0.4)});
      fs_who(x,"anil",tt,{a:ag_io(tt,c.question+0.5,c.fix-0.1,0.5)+ag_io(tt,c.night+0.2,c.prod-0.1,0.5)});
      fs_pillL(x,500,470,"checks it against the plan",{a:ag_io(tt,P.anil,c.fix-0.2,0.4)});
      fs_who(x,"jun",tt,{a:ag_io(tt,c.fix+0.2,P.noor-0.3,0.5)});
      fs_pillL(x,500,470,"reviews its pull request",{a:ag_io(tt,P.pr,P.noor-0.4,0.4)});
      fs_who(x,"noor",tt,{a:ag_io(tt,P.noor+0.2,c.night-0.1,0.5)+ag_io(tt,P.noor2+0.2,c.driver-0.2,0.5)});
      fs_pillL(x,500,470,"approves production",{icon:"tick",col:AG.green,a:ag_io(tt,P.noor+0.3,c.night-0.2,0.4)+ag_io(tt,P.noor2+0.3,c.rerun-0.2,0.4)});
      fs_pillL(x,500,470,"reads its report",{a:ag_io(tt,P.morning,c.prod-0.2,0.4)});
      // in test and in production: at the top, above the tags' flight from the agent to their stages
      fs_pillL(x,680,120,"in test: alone, then a report",{col:AG.blue,a:ag_io(tt,P.morning,c.rule-0.2,0.4)});
      fs_pillL(x,680,196,"in production: drafts only",{col:AG.blue,a:ag_io(tt,P.drafts,c.rule-0.2,0.4)});
      fs_pillL(x,500,470,"a plain job reruns it",{a:ag_io(tt,P.plain,c.driver-0.2,0.4)});
      // like a restricted driver: the road, framed on the wall where the people stood, free by day but not at night
      ag_picture(x,120,440,420,236,{img:ag_place("fsHills"),a:ag_io(tt,c.driver+0.3,c.rule-0.2,0.5)});
      fs_pillL(x,120,752,"free by day, not at night",{a:ag_io(tt,P.day,c.rule-0.2,0.4)});
      // identity belongs to the agent; the stage belongs to each kind of task, in each place
      fs_pillL(x,410,160,"Identity: the agent's",{col:AG.blue,a:ag_in(tt,P.ident,0.4)});
      fs_pillL(x,820,120,"The stage: each task, in each place",{col:AG.blue,a:ag_in(tt,P.stage,0.4)});
      ag_roomLight(x,1);FS_KICK(x);}}
  ],0.6);});

/* ---------------------------------------------------------------- 4 · Down a stage, and back */
scene("down",(ctx,S,t,sc)=>{const c=sc.cues,P=fs_once(sc,"P",()=>({alone:wAt(sc,"oct","alone, as agreed"),changed:wAt(sc,"other","changed a model"),
    built:wAt(sc,"other","other teams"),saw:wAt(sc,"test","Jun saw it"),five:wAt(sc,"moved","from five to four"),
    waits:wAt(sc,"four","waited for Anil"),prop:wAt(sc,"four","proposed its fix"),kept:wAt(sc,"only","kept their stages"),
    plain:wAt(sc,"limits","a plain check"),fourteen:wAt(sc,"nights","fourteen nights"),
    signedW:wAt(sc,"signed","signed its mandate"),up:wAt(sc,"signed","went back up"),notsw:wAt(sc,"keeps","not a switch"),help:wAt(sc,"keeps","kept its help")}));
  // the night task in test moves down from stage 5 to stage 4 (dn 0 to 1), and back up once its mandate is signed; it turns amber
  // when it changes the model that wasn't its own, stays amber while it's down, and green when it goes back up
  const L=FL.small,dn=tt=>ag_sine((tt-P.five)/1.2)*(1-ag_sine((tt-P.up)/1.2));
  const base=(x,tt,o)=>{const R=fs_stages(x,L.x,L.y,L.w,{short:1,gates:[0,0,0,0,ag_in(tt,c.back,0.5)],passed:[0,0,0,0,ag_in(tt,P.signedW+0.3,0.5)],lit:o.lit||0});
      fs_agent(x,tt,{think:o.think||0});
      const d=dn(tt),amb=Math.max(ag_in(tt,P.changed,0.4),clamp(d*1.5,0,1))*(1-ag_in(tt,P.up+0.4,0.5)),back=ag_in(tt,P.up+0.3,0.6);
      fs_tasks(x,R.stages,{dn:d,col:[null,null,null,back>0.5?AG.green:(amb>0.2?AG.amber:null),null],
        glow:[0,1,2,3,4].map(i=>i===3?Math.max(ag_io(tt,c.oct+0.3,c.test,0.5),amb*0.6,ag_io(tt,P.up+0.4,P.up+2.4,0.5)):Math.max(ag_io(tt,P.kept,P.kept+1.8,0.4),ag_io(tt,P.help,P.help+2.2,0.5)))});
      return R;};
  ag_shots(ctx,S,t,sc.dur,[
    // one night in October, the build failed in test, and the agent worked on it alone, as agreed; to make it pass, it also changed a
    // model that wasn't its own, which other teams' reports are built on: the room by night
    {at:0,place:"fsLabNight",keys:[[0,960,540,1]],d:2,push:0,draw:(x,tt)=>{base(x,tt,{think:ag_io(tt,c.oct+0.4,c.test-0.4,0.5)});
      fs_card(x,410,120,560,"One night in October","The build failed in test",null,{kickCol:AG.amber,edge:AG.amber,edgeA:0.6,a:ag_io(tt,c.oct+0.2,c.test-0.2,0.4),k:ag_spr(tt,c.oct+0.2)});
      fs_pillL(x,410,330,"it worked alone, as agreed",{col:AG.blue,a:ag_io(tt,P.alone,c.other-0.2,0.4)});
      fs_card(x,410,300,620,"Not its own","The model of HR's contracts","Other teams' reports are built on it",{kickCol:AG.amber,edge:AG.amber,edgeA:0.6,
        a:ag_io(tt,P.changed,c.test-0.2,0.4),k:ag_spr(tt,P.changed)});
      ag_roomLight(x,1,{night:true,lamp:[1880,790]});FS_KICK(x,{dark:true});}},
    // in the morning: only in test, nothing reached production, and Jun saw it; that day Anil moved the night task down a stage; each
    // time the build failed it waited for Anil, and proposed; only that task moved; to go back up: its folders, limits, a plain check,
    // fourteen nights; on the thirtieth of October, Anil signs its mandate, and the night task goes back up; a step down, not a switch off
    {at:c.test,place:"fsLab",keys:[[c.test,960,540,1]],d:2,push:0,draw:(x,tt)=>{base(x,tt,{});
      fs_pillL(x,410,170,"only in test: nothing reached production",{icon:"tick",col:AG.green,a:ag_io(tt,c.test+0.3,c.moved-0.2,0.4)});
      fs_who(x,"jun",tt,{a:ag_io(tt,c.test+0.4,c.moved-0.1,0.5)});
      fs_pillL(x,500,470,"sees it in the morning",{a:ag_io(tt,P.saw,c.moved-0.2,0.4)});
      fs_who(x,"anil",tt,{a:ag_io(tt,c.moved+0.2,c.back-0.1,0.5)+ag_io(tt,P.signedW-0.2,sc.dur-1.0,0.5)});
      fs_pillL(x,410,280,"stage 5 → stage 4",{icon:"warn",col:AG.amber,a:ag_io(tt,P.five,c.only-0.2,0.4)});
      fs_pillL(x,410,352,"it waits for Anil to start it",{col:AG.amber,a:ag_io(tt,P.waits,c.only-0.2,0.4)});
      fs_pillL(x,410,424,"it proposes its fix",{col:AG.amber,a:ag_io(tt,P.prop,c.only-0.2,0.4)});
      fs_pillL(x,410,280,"its other tasks: the same stages",{col:AG.blue,a:ag_io(tt,P.kept,c.back-0.2,0.4)});
      fs_list(x,410,120,640,"To go back up",[{t:"Its folders, written down and held",a:ag_in(tt,c.folders+0.3,0.4)},{t:"10 rounds · 1 hour · a set budget",a:ag_in(tt,c.limits+0.2,0.4)},
        {t:"A plain check before it starts",a:ag_in(tt,P.plain,0.4)},{t:"14 nights in test, no miss",a:ag_in(tt,P.fourteen,0.4)}],{a:ag_io(tt,c.back+0.3,c.signed-0.2,0.4),k:ag_spr(tt,c.back+0.3)});
      fs_nights(x,188,640,14,(tt-P.fourteen)/0.11,{a:ag_io(tt,P.fourteen-0.2,c.signed-0.2,0.4)});
      fs_card(x,410,120,660,"Mandate · 30 October 2026","The night task, in test","signed by Anil · approved by Noor",{kickCol:AG.blue,edge:AG.blue,edgeA:0.6,
        a:ag_io(tt,P.signedW-0.2,c.keeps-0.2,0.4),k:ag_spr(tt,P.signedW-0.2)});
      fs_pillL(x,410,170,"a step down, not a switch off",{col:AG.blue,a:ag_in(tt,P.notsw,0.4)*(1-ag_in(tt,sc.dur-1.4,0.5))});
      ag_roomLight(x,1);FS_KICK(x);}}
  ],0.6);});

/* ---------------------------------------------------------------- 5 · What never changes */
scene("never",(ctx,S,t,sc)=>{const c=sc.cues,P=fs_once(sc,"P",()=>({never:wAt(sc,"under","never change"),loop:wAt(sc,"owner","every critical loop"),
    op:wAt(sc,"levels","from operator"),obs:wAt(sc,"levels","to observer"),always:wAt(sc,"here","always approves"),watching:wAt(sc,"here","only watching"),
    stop:wAt(sc,"law","stop it"),resp:wAt(sc,"iso","who is responsible")}));
  const lay=tt=>fs_layout(1-clamp((tt-0.9)/1.8,0,1));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"fsLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{const L=lay(tt),go=1-ag_in(tt,0.1,0.6);
      fs_plinth(x,L,{a:ag_in(tt,P.never-0.3,0.6)});
      const R=fs_stages(x,L.x,L.y,L.w,{short:1-ag_in(tt,1.9,0.8),gates:[0,0,0,0,go],passed:[0,0,0,0,1],
        lit:[0,1,2,3,4].map(i=>ag_io(tt,P.never+0.12*i,P.never+1.4+0.12*i,0.4)),col:[null,null,null,null,ag_in(tt,P.always,0.5)>0.5?AG.green:null]});
      fs_agent(x,tt,{a:go});fs_tasks(x,R.stages,{all:go});
      fs_list(x,150,128,660,"What never changes",[{t:"A person owns the agent, and answers for it",a:ag_in(tt,c.owner+0.2,0.4)},
        {t:"A second person approves production",a:ag_in(tt,c.second+0.2,0.4)},{t:"Agents never approve",a:ag_in(tt,c.review+0.2,0.4)},
        {t:"Never its own change, a weaker check,",a:ag_in(tt,c.self+0.2,0.4)},{t:"or rights it gave itself",a:ag_in(tt,c.self+0.2,0.4)}],
        {a:ag_io(tt,P.never,c.levels-0.2,0.5),k:ag_spr(tt,P.never)});
      // the researchers' five levels, by what the person does; here a person always approves production
      fs_levels(x,R.stages,{p:[0,1,2,3,4].map(i=>ag_in(tt,P.op+0.3*i,0.4)),a:1-ag_in(tt,c.law-0.3,0.5),cross:ag_in(tt,P.watching-0.3,0.6)});
      // a person approves production: beside the struck observer, and kept once the levels have gone
      const gp="A person approves production",gpw=ag_tw(x,gp,{w:700,size:30})+96;
      ag_pill(x,R.stages[4].x+46-gpw/2,R.stages[4].y-40,gp,{icon:"tick",col:AG.green,a:ag_in(tt,P.always,0.5)*(1-ag_in(tt,c.law-0.3,0.5))});
      // the law and the standard, side by side at the top, once the levels have gone
      fs_card(x,150,128,680,"Europe's AI law · high-risk systems","People who can understand it, watch it, and stop it",null,{kickCol:AG.blue,a:ag_in(tt,c.law+0.2,0.4),k:ag_spr(tt,c.law+0.2)});
      fs_card(x,860,128,600,"ISO/IEC 42001 · managing AI","Who is responsible for what",null,{kickCol:AG.blue,a:ag_in(tt,P.resp-0.3,0.4),k:ag_spr(tt,P.resp-0.3)});
      ag_roomLight(x,1);FS_KICK(x);}}
  ],0.6);});

/* ---------------------------------------------------------------- 6 · One kind of task at a time */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,P=fs_once(sc,"P",()=>({last:wAt(sc,"nz","the riskiest"),gates:wAt(sc,"earned","its own gates"),
    down:wAt(sc,"earned","back down"),map:wAt(sc,"map","the university's map"),beside:wAt(sc,"map","beside its kind"),helper:wAt(sc,"monday","Jun's helper"),pa:wAt(sc,"monday","the planning agent"),own:wAt(sc,"monday","a name of its own"),
    road:wAt(sc,"next","that road"),more:wAt(sc,"count","do more"),every:wAt(sc,"count","every number")}));
  const L=FL.small;
  ag_shots(ctx,S,t,sc.dur,[
    // in New Zealand, freedom on the road came a stage at a time, the riskiest driving last
    {at:0,place:"fsHills",keys:[[0,960,540,1]],push:0.03,draw:(x,tt)=>{
      const d=fs_drive(x,tt,0.2,c.earned-0.2,-0.34,1.6,{lin:1,people:[fs_seat("teen","driver")]});
      const sa=ag_in(tt,0.9,0.5)*(1-ag_in(tt,c.earned-0.9,0.5));fs_signs(x,{a:[sa,sa,sa],lit:[0,1,2].map(i=>clamp(1-Math.abs(d.u-FS_SIGNS[i][0])/0.16,0,1))});}},
    // an agent earns its freedom the same way: each kind of task through its own gates, and back down a stage when something goes
    // wrong; and each stage is written on the university's map, beside its kind of task
    {at:c.earned,place:"fsLab",keys:[[c.earned,960,540,1]],push:0,draw:(x,tt)=>{const out=1-ag_in(tt,c.monday-1.2,0.6);
      const R=fs_stages(x,L.x,L.y,L.w,{short:1,gates:ag_in(tt,P.gates,0.5),passed:1});
      fs_agent(x,tt,{a:out});
      const d=ag_sine((tt-P.down)/0.9)*(1-ag_sine((tt-P.down-1.6)/0.9));
      fs_tasks(x,R.stages,{all:out,dn:d,col:[null,null,null,d>0.2?AG.amber:null,null],glow:[0,1,2,3,4].map(()=>ag_io(tt,P.beside,c.monday-1.2,0.5))});
      const mi=i=>ag_in(tt,P.beside+0.3*i,0.4);
      fs_list(x,410,120,620,"On the university's map",[{t:"A word about staff · stage 1",a:mi(0)},{t:"A new question · stage 3",a:mi(1)},{t:"Fix a model · stage 4",a:mi(2)},
        {t:"Night build, test · stage 5",a:mi(3)},{t:"Night build, production · stage 4",a:mi(4)}],{a:ag_io(tt,P.map-0.2,c.monday-1.2,0.4),k:ag_spr(tt,P.map-0.2)});
      ag_roomLight(x,1);FS_KICK(x);}},
    // on 2 November, Planning's tickets passed from Jun's helper, on his sign-in, to the planning agent, with a name of its own; Clara
    // owns it; the films that follow take it along that road; and the team still stands behind every number
    {at:c.monday,place:"fsLab",later:true,keys:[[c.monday,960,540,1]],push:0,draw:(x,tt)=>{withA(x,1-ag_in(tt,c.breath+0.1,0.7),()=>{
      const R=fs_stages(x,L.x,L.y,L.w,{short:1,gates:[1,1,1,1,1],passed:[1,1,1,1,0],lit:[0,0,0,ag_in(tt,P.pa+0.6,0.5),ag_io(tt,P.road,P.road+2.4,0.5)]});
      fs_card(x,370,120,440,"Until 2 November","Jun's helper",null,{kickCol:AG.mut,a:ag_in(tt,P.helper-0.3,0.4)*(1-ag_in(tt,P.pa+0.8,0.5)),k:ag_spr(tt,P.helper-0.3)});
      fs_pillL(x,370,300,"on Jun's sign-in · stages 1 to 3",{a:ag_in(tt,P.helper,0.4)*(1-ag_in(tt,P.pa+0.8,0.5))});
      fs_agent(x,tt,{name:"planning agent",a:ag_in(tt,P.pa,0.6),glow:ag_io(tt,P.own,P.own+2.2,0.4)});
      fs_tagMove(x,{x:590,y:300},fs_tagAt(x,R.stages[3],0,"Planning's tickets"),clamp((tt-P.pa-0.2)/1.2,0,1),"Planning's tickets",{a:ag_in(tt,P.pa-0.1,0.4)});
      fs_who(x,"clara",tt,{a:ag_in(tt,P.own+0.4,0.6)});fs_pillL(x,500,470,"Clara owns it",{a:ag_in(tt,P.own+0.8,0.4)});
      fs_answer(x,1060,120,660,{ok:true,a:ag_in(tt,P.more-0.2,0.4),k:ag_spr(tt,P.more-0.2)});
      FS_KICK(x);});ag_roomLight(x,1);}}
  ],0.6);
  fs_tags(ctx,S,t,[[0.6,c.earned,FS_TAG_87]]);
  ag_end(ctx,S,t,c.breath,"Five stages, not a switch","Autonomy is earned one kind of task at a time.","Film 1 of 7","From helper to colleague");});

ag_cutInto(["stages","tasks","down","never"]);
