/* ===== Listen first: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, or cuts where both show Helena. Sheets on a wall
   are drawn before the people who stand in front of it. Sizes in the 1920 x 1080 frame; the kicker sits at the top left from chapter 2,
   so sheets start at y 150 there, and nothing goes below y 890. */

const LF_TITLE="Listen first",LF_LAST="Ask people, count from the systems, and write down what is.";
const LF_MOD={module:"Data management",mark:dm_mark};
const LF_MO={light:"morning"};
function lf_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"2",LF_TITLE,{a});}
function lf_where(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a});}
// a line's words, to name another film only while its line names it (the line changes at merge if that film isn't on main)
const lf_says=(sc,id,s)=>{const ln=sc.vo.find(v=>v.id===id);return !!ln&&ln.text.indexOf(s)>=0;};
// two people side by side, each with their own words over them: [who, name tag's spec or key, line id, the word their words start on, words]
function lf_pair(x,tt,sc,A,B){const w=(id,word,off)=>wAt(sc,id,word,off);
  [A,B].forEach((P,i)=>{const t0=w(P.line,P.name,-0.6);
    lf_sheet(x,tt,w(P.line,P.at,-0.2),i?1040:120,160,760,{title:P.words},{light:"morning"});
    lp_nameTag(x,i?1260:660,560,P.who,{align:i?"right":"left",a:ag_in(tt,t0+0.3,0.5)});});
  [A,B].forEach((P,i)=>lp_person(x,P.who,i?1440:480,720,0.8,{t:tt,flip:!!i,a:ag_in(tt,w(P.line,P.name,-0.6),0.6),light:LF_MO}));}

/* ---------------------------------------------------------------- 1. The mothers' word: Accra, the early 1930s */
scene("word",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),L=LF_LIGHT;
  const tW=w("cicely","Cicely",-0.6),tM=w("cicely","mothers",-0.6),tG=w("listened","grandmothers",-0.6),tN=w("listened","nurses",-0.6);
  const tK=w("told","kwashiorkor",0.1),tN2=w("name","Doctors",-0.2),gone=c.when-0.5;
  ag_shots(ctx,S,t,sc.dur,[
    // the clinic's room in the morning; Cicely Williams, and the people who bring their children to her
    {at:0,place:"lfClinic",keys:[[0,960,540,1.04],[c.accra+0.4,960,540,1.0],[c.when-0.3,860,600,1.12]],d:3,draw:(x,tt)=>{
      // the wall first: where and when
      lf_sheet(x,tt,c.accra+0.1,120,110,640,{kick:"The Gold Coast, now Ghana",title:"Accra, early 1930s"},{light:null,out:c.sick-0.5});
      lp_nameTag(x,1060,400,LF_PEOPLE.williams,{align:"center",a:ag_io(tt,w("cicely","Williams",-0.2),c.sick-0.6,0.4)});
      // the harm: what the children suffered, and that it killed them
      lf_sheet(x,tt,w("sick","Children",-0.1),700,110,540,{kick:"Children of 1 to 4",lines:["Swollen hands and feet","Peeling skin","Wasting"]},
        {light:null,u:lf_u(tt,[w("sick","hands",-0.1),w("sick","skin",-0.1),w("sick","wasted",-0.1)]),out:c.pellagra-0.5});
      lf_sheet(x,tt,w("died","nearly",-0.2),120,110,520,{kick:"Unless treated early",title:"Nearly always fatal"},{col:LP.amber,light:null,out:c.pellagra-0.5});
      // the wrong cure, and no book that knew it
      lf_sheet(x,tt,w("pellagra","pellagra",-0.3),700,110,540,{kick:"Many doctors said",title:"Pellagra?",sub:"A disease of a missing vitamin"},{light:null,out:c.listened-0.5});
      lf_tag(x,tt,w("pellagra","kept",-0.1),c.listened-0.5,970,470,"Children kept dying",{align:"center",col:LP.amber});
      lf_tag(x,tt,w("nobook","medical",-0.1),c.listened-0.5,968,690,"In no medical book",{align:"center",col:LP.ink});
      // she listens; for three years nobody says its name
      lf_sheet(x,tt,w("listened","listened",-0.2),120,110,600,{kick:"She listened",lines:["To mothers and grandmothers","To nurses and healers"]},
        {light:null,u:lf_u(tt,[w("listened","mothers",-0.1),w("listened","nurses",-0.1)]),out:c.feared-0.5});
      lf_sheet(x,tt,w("feared","three",-0.2),760,110,520,{kick:"For three years",title:"Nobody said its name",sub:"The word was feared"},{light:null,out:c.told-0.4});
      // the mothers' word, written down, then large on its own card, with its meaning; and again when doctors everywhere use it
      const wa=Math.max(ag_in(tt,tK,0.35)*(1-ag_in(tt,c.wrote-0.6,0.4)),ag_io(tt,tN2,gone,0.5));
      lf_wordCard(x,560,110,800,{a:wa,k:tt<c.wrote?tt-tK:null,mean:ag_in(tt,w("means","displaced",-0.3),0.6),light:null});
      lf_sheet(x,tt,w("maize","maize",-0.4),740,420,440,{kick:"When it came",title:"Little but maize"},{light:null,out:c.wrote-0.6});
      // what she wrote, and what it gave three children
      lf_sheet(x,tt,w("wrote","nineteen",-0.2),120,110,520,{kick:"1933",title:"Archives of Disease in Childhood"},{light:null,out:c.cured-0.5});
      lf_sheet(x,tt,w("wrote","two years",-0.2),700,110,520,{kick:"1935 · The Lancet",title:"Kwashiorkor"},{light:null,out:c.cured-0.5});
      lf_sheet(x,tt,w("cured","Three",-0.2),400,110,660,{kick:"3 children seen early",title:"Each went home “apparently cured”",lines:["Milk, eggs and fruit"]},
        {col:LP.green,light:null,u:ag_in(tt,w("cured","milk",-0.1),0.5),out:c.name-0.5});
      lf_tag(x,tt,w("name","name",-0.2),c.known-0.4,960,430,"The name doctors still use",{align:"center",col:LP.green});
      lf_tag(x,tt,w("known","protein",-0.4),gone,960,430,"Then: too little protein",{align:"center",col:LP.ink});
      lf_tag(x,tt,w("known","today",-0.2),gone,960,500,"Now: more than that",{align:"center",col:LP.ink});
      // the people, in front of the wall; no sick child is drawn
      lp_person(x,LF_PEOPLE.grandmother,250,690,0.8,{t:tt,a:ag_in(tt,tG,0.6),light:L});
      lp_person(x,LF_PEOPLE.mother,560,690,0.8,{t:tt,a:ag_in(tt,tM,0.6),light:L});
      lp_person(x,LF_PEOPLE.nurse,1660,690,0.8,{t:tt,flip:true,a:ag_in(tt,tN,0.6),light:L});
      lp_person(x,LF_PEOPLE.williams,1340,690,0.8,{t:tt,flip:true,a:ag_in(tt,tW,0.6),pose:"hold",holdBack:(cc,h)=>lf_notebook(cc,h,{write:ag_in(tt,tK-0.6,1.4)}),light:L});}},
    // a year from now: the team's room at the university
    {at:c.same-0.3,place:"lfFeb",keys:[[c.same-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const f0=w("uni","forty-one",-0.2),h0=w("listens","data manager",-0.6),s0=w("sees","Six",-0.1),e=c.breath+0.2;
      lf_sheet(x,tt,w("same","people",-0.2),360,330,1000,{title:"The people who live with a problem often know it best"},{light:"morning",out:f0-0.4});
      if(tt>=f0)lp_figure(x,160,180,620,{kick:"A request for data",num:"41",label:"Working days, on average, from the ask to first use"},
        {col:LP.amber,light:"morning",a:ag_in(tt,f0,0.35)*(1-ag_in(tt,s0-0.6,0.4)),k:tt-f0});
      lf_sheet(x,tt,w("uni","nobody",-0.2),160,600,620,{title:"Nobody sees the whole picture"},{light:"morning",out:s0-0.6});
      lf_tag(x,tt,w("listens","thirty-one",-0.1),s0-0.6,860,300,"31 people",{col:LP.ink});
      lf_tag(x,tt,w("listens","three questions",-0.1),s0-0.6,860,380,"3 questions",{col:LP.ink});
      lf_tag(x,tt,w("listens","systems",-0.1),s0-0.6,860,460,"What the systems count",{col:LP.ink});
      lf_fivePages(x,150,250,190,{a:ag_in(tt,s0,0.35)*(1-ag_in(tt,e,0.8)),u:ag_in(tt,s0,1.4),light:"morning"});
      lf_pill(x,tt,w("sees","seven",-0.1),e,670,620,"7 opportunities",{col:LP.green,icon:"tick"});
      lp_person(x,"helena",1500,640,1.0,{t:tt,flip:true,a:ag_in(tt,h0,0.6),light:LF_MO});}}
  ]);
  lf_where(ctx,S,ag_io(t,w("uni","university",-0.3),c.listens,0.5));
  lp_title(ctx,S,t,c.breath+0.2,LF_TITLE,"Discovery, before design","Data management · A plan in ninety days",LF_MOD);
});

/* ---------------------------------------------------------------- 2. Three questions */
scene("ask",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const pl=w("plan","plan",-0.2),who=w("who","Thirty-one",-0.2),qs=c.same-0.1,gd=c.side;
  const behind=lf_says(sc,"behind","The question behind the request");
  ag_shots(ctx,S,t,sc.dur,[
    // February 2027: Helena, her plan for ninety days, the 31 people she'll talk to, the same three questions, the answers side by side
    {at:0,place:"lfFeb",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      lf_sheet(x,tt,0.9,140,190,700,{kick:"February 2027",title:"Helena Novak",sub:"The university's new data manager"},{light:"morning",out:pl-0.5});
      lf_plan(x,120,170,1120,{lit:ag_in(tt,w("plan","six weeks",-0.1),0.6),a:ag_in(tt,pl,0.35)*(1-ag_in(tt,who-0.6,0.4)),k:tt-pl,light:"morning"});
      lf_marks(x,120,170,1120,{u:ag_in(tt,who+0.2,3.0),a:ag_in(tt,who,0.35)*(1-ag_in(tt,qs-0.6,0.4)),k:tt-who,light:"morning"});
      lf_questions(x,100,180,560,{u:[ag_in(tt,c.q1,0.4),ag_in(tt,c.q2,0.4),ag_in(tt,c.q3,0.4)],a:ag_in(tt,qs,0.35),k:tt-qs,light:"morning"});
      lf_grid(x,700,150,540,{u:ag_in(tt,gd+0.3,2.4),pair:ag_in(tt,w("side","side by side",0.1),0.6),a:ag_in(tt,gd,0.35),k:tt-gd,light:"morning"});
      lp_person(x,"helena",1500,640,1.0,{t:tt,flip:true,light:LF_MO});}},
    // where people work: Helena walks to each door as it's named; go and see
    {at:c.go-0.3,place:"lfCorridor",cut:true,keys:[[c.go-0.3,960,540,1.0]],draw:(x,tt)=>{const g1=w("go","Finance",-0.7),g2=Math.max(w("go","Facilities",-0.5),g1+1.0);
      ["Registrar's office","Finance","Facilities"].forEach((s,i)=>lf_doorPlate(x,LF_DOORS[i]+110,296,s));
      lf_sheet(x,tt,w("lean","go and see",-0.3),100,150,500,{kick:"Lean thinking",title:"Go and see",lines:["genchi genbutsu","The real place, and the real thing"]},
        {light:"day",u:lf_u(tt,[w("lean","genchi",-0.1),w("lean","real place",-0.1)])});
      const hx=640+440*ease(clamp((tt-g1)/1.0,0,1))+440*ease(clamp((tt-g2)/1.0,0,1));
      lp_person(x,"helena",hx,760,0.75,{t:tt,light:{light:"day"}});}},
    // back in the room: her notes, in people's own words
    {at:c.words-0.3,place:"lfFeb",cut:true,keys:[[c.words-0.3,960,540,1.0]],draw:(x,tt)=>{
      lf_sheet(x,tt,c.words+0.1,140,190,640,{kick:"Helena's notes",title:"In people's own words"},{light:"morning"});
      lf_tag(x,tt,w("words","Williams",-0.2),null,140,470,"As Williams kept the mothers' word",{col:LP.ink});
      lp_person(x,"helena",1500,640,1.0,{t:tt,flip:true,pose:"hold",holdBack:(cc,h)=>lf_notebook(cc,h,{write:ag_in(tt,c.words+0.3,2.4)}),light:LF_MO});}},
    {at:c.clara-0.3,place:"lfFeb",later:true,keys:[[c.clara-0.3,960,540,1.0]],draw:(x,tt)=>lf_pair(x,tt,sc,
      {who:"clara",line:"clara",name:"Clara",at:"I ask",words:"“I ask for one number, and I get three.”"},
      {who:LF_INGRID,line:"ingrid",name:"Ingrid",at:"Our",words:"“Our staff list is right. It's the copies.”"})},
    {at:c.anil-0.3,place:"lfFeb",later:true,keys:[[c.anil-0.3,960,540,1.0]],draw:(x,tt)=>lf_pair(x,tt,sc,
      {who:"anil",line:"anil",name:"Anil",at:"I keep",words:"“I keep my own spreadsheet. I can't wait.”"},
      {who:"mei",line:"mei",name:"Mei",at:"Our",words:"“Our Thursday fifteen minutes works. Keep it.”"})},
    // Graham's email, waiting its turn with the rest
    {at:c.graham-0.3,place:"lfFeb",later:true,keys:[[c.graham-0.3,960,540,1.0]],draw:(x,tt)=>{const g0=w("graham","Graham",-0.6),m0=w("graham","dashboard",-0.6),b0=w("behind","leading",-0.3);
      for(let k=0;k<3;k++){const v=ag_in(tt,m0+0.2+k*0.15,0.4);if(v>0){x.save();x.globalAlpha*=v;lf_leaf(x,930+k*34,206+k*26,220,150,{lines:3});x.restore();}}
      lf_sheet(x,tt,m0,140,180,760,{kick:"Thu 11 Feb",title:"“Could I have a dashboard of room use, by Easter?”"},{light:"morning"});
      lf_tag(x,tt,w("graham","waits",-0.2),null,140,470,"Waits its turn",{col:LP.amber});
      lf_sheet(x,tt,b0,140,560,620,behind?{kick:"See · Leading data people",title:"The question behind the request"}:{kick:"See",title:"Leading data people"},{light:"morning"});
      lp_nameTag(x,1260,560,"graham",{align:"right",a:ag_in(tt,g0+0.3,0.5)});
      lp_person(x,"graham",1440,720,0.8,{t:tt,flip:true,a:ag_in(tt,g0,0.6),light:LF_MO});}}
  ]);
  lf_where(ctx,S,ag_io(t,0.6,who,0.5));
  lf_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. What's written */
const LF_GOALS=[["students","Students who succeed"],["research","Research that reaches people"],["campus","A campus used well"],["finances","Finances that last"]];
scene("read",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // what's already written: three documents, set out one by one
    {at:0,place:"lfFeb",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      [[{kick:"The university",title:"Strategy to 2030"},"proposing"],[{kick:"The university",title:"Digital strategy"},"reads"],[{kick:"An earlier study",title:"Information needs assessment"},"written"]]
        .forEach(([wd,word],i)=>lf_sheet(x,tt,w("read",word,-0.2),140+i*570,240,520,wd,{light:"morning"}));}},
    // the strategy's four goals, and the digital strategy that serves it
    {at:c.goals-0.3,place:"lfFeb",later:true,keys:[[c.goals-0.3,960,540,1.0]],draw:(x,tt)=>{
      lf_sheet(x,tt,w("goals","strategy",-0.2),100,160,640,{kick:"Strategy to 2030",title:"Four goals"},{col:LP.blue,light:"morning"});
      LF_GOALS.forEach(([wd,s],i)=>{const t0=w("four",wd,-0.2);lf_goalTile(x,81+i*446,380,420,200,s,{a:ag_in(tt,t0,0.35),k:tt-t0,light:"morning"});});
      lf_sheet(x,tt,w("digital","digital",-0.2),410,630,1100,{kick:"The digital strategy serves it",title:"Data quality · Integration · Satisfaction"},{light:"morning"});}},
    // the earlier assessment's twelve decisions
    {at:c.assess-0.3,place:"lfFeb",later:true,keys:[[c.assess-0.3,960,540,1.0]],draw:(x,tt)=>{
      lf_sheet(x,tt,c.assess+0.2,530,160,860,{kick:"Information needs assessment",title:"12 decisions, made with data every year",
        lines:["The budget","Casual staff","The timetable and rooms","Which courses to offer","Research reporting","And 7 more"]},
        {light:"morning",u:lf_u(tt,["budget","casual","timetable","courses","research","seven"].map(s=>w("twelve",s,-0.1)))});}},
    // an answer tied to a decision, and the decision to a goal
    {at:c.tie-0.3,place:"lfFeb",later:true,keys:[[c.tie-0.3,960,540,1.0]],draw:(x,tt)=>{const t1=w("tie","tied",-0.2),t2=w("tie","goal",-0.6);
      lf_sheet(x,tt,c.tie,100,300,480,{kick:"Clara, in Planning",title:"“I ask for one number, and I get three.”"},{light:"morning"});
      lf_sheet(x,tt,t1,740,300,440,{kick:"A decision",title:"The budget"},{light:"morning"});
      if(tt>=t2)lf_goalTile(x,1340,300,440,200,"Finances that last",{a:ag_in(tt,t2,0.35),k:tt-t2,light:"morning"});
      lf_thread(x,[580,400],[740,400],ag_in(tt,t1+0.2,0.7),{bend:30});
      lf_thread(x,[1180,400],[1340,400],ag_in(tt,t2+0.2,0.7),{bend:30});}}
  ]);
  lf_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. What the systems count */
scene("count",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const small=lf_says(sc,"small","Small, every week");
  ag_shots(ctx,S,t,sc.dur,[
    // the tracker: the requests closed in February, 41 working days from the ask to first use
    {at:0,place:"lfFeb",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const s0=c.hurts+0.4,f0=w("tracker","forty-one",-0.2);
      lp_screen(x,120,160,1100,640,{a:ag_in(tt,s0,0.5),draw:(cx,X,Y,Wd,Hd)=>lf_screenTracker(cx,X,Y,Wd,Hd,{u:ag_in(tt,w("tracker","tracker",-0.1),2.4)})});
      if(tt>=f0)lp_figure(x,1300,200,520,{kick:"On average",num:"41",label:"Working days, from the ask to first use"},{col:LP.amber,light:"morning",a:ag_in(tt,f0,0.35),k:tt-f0});}},
    // the old warehouse's own logs: 38 reports, 17 not opened in a year, 21 used; what it costs, and when its licence ends
    {at:c.logs-0.3,place:"lfFeb",later:true,keys:[[c.logs-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=c.logs,f0=w("cost","costs",-0.2),a=ag_in(tt,r0,0.35);
      if(a>0.004){x.save();x.globalAlpha*=a;lp_sheet(x,100,150,1000,600,{light:"morning"});lp_label(x,144,232,"The old warehouse · 38 reports");
        lp_T(x,"On the university's own servers since 2012",144,280,{w:600,size:28,col:LP.mut});x.restore();}
      lf_reports(x,150,330,{s:0.95,a,u:ag_in(tt,w("logs","thirty-eight",-0.2),2.0),dim:ag_in(tt,w("unopened","Seventeen",-0.1),0.8),lit:ag_in(tt,w("used","twenty-one",-0.1),0.8)});
      lf_tag(x,tt,w("unopened","Seventeen",0.1),null,1160,240,"17 not opened in a year",{col:LP.amber});
      lf_tag(x,tt,w("used","twenty-one",0.1),null,1160,320,"21 used, by about 260 people",{col:LP.ink});
      if(tt>=f0)lp_figure(x,1160,400,600,{kick:"It costs, a year",num:"A$310,000"},{col:LP.amber,light:"morning",a:ag_in(tt,f0,0.35),k:tt-f0});
      lf_pill(x,tt,w("cost","licence",-0.1),null,1460,700,"Licence ends 31 Dec 2027",{col:LP.amber,icon:"wait"});}},
    // laid beside what people said: three findings
    {at:c.beside-0.3,place:"lfFeb",later:true,keys:[[c.beside-0.3,960,540,1.0]],draw:(x,tt)=>{const f=[w("eleven","eleven",-0.3),w("copies","three copies",-0.3),w("forty","forty",-0.3)];
      lf_sheet(x,tt,c.beside+0.1,560,300,800,{kick:"Laid beside what people said",title:"Three findings"},{light:"morning",out:f[0]-0.6});
      ["ways","copies","forty"].forEach((kind,i)=>{if(tt>=f[i])lf_finding(x,100+i*590,170,540,kind,{u:ag_in(tt,f[i]+0.3,1.8),a:ag_in(tt,f[i],0.35),k:tt-f[i],light:"morning"});});}},
    // and one thing that already works: the graduation list's fifteen minutes every Thursday
    {at:c.thurs-0.3,place:"lfFeb",later:true,keys:[[c.thurs-0.3,960,540,1.0]],draw:(x,tt)=>{const b0=c.fell-0.2,ba=ag_in(tt,b0,0.35);
      lf_sheet(x,tt,c.thurs+0.2,120,170,620,{kick:"What already works",title:"The graduation list",lines:["15 minutes, every Thursday","Since January 2026"]},
        {col:LP.green,light:"morning",u:lf_u(tt,[w("thurs","fifteen",-0.1),w("thurs","January",-0.1)])});
      if(ba>0.004){x.save();x.globalAlpha*=ba;lp_sheet(x,800,170,1000,560,{light:"morning"});lp_label(x,844,252,"Certificates printed again");x.restore();
        lp_bars(x,860,300,880,380,[{v:41,label:"Dec 2025",show:"41"},{v:14,label:"Mar 2026",show:"14"},{v:6,label:"Jul 2026",show:"6"},{v:3,label:"Dec 2026",show:"3"}],
          {col:LP.green,max:45,u:ag_in(tt,c.fell,1.8),a:ba});}
      lf_sheet(x,tt,w("small",small?"Small":"tells",-0.3),120,520,620,small?{kick:"See · The data quality module",title:"Small, every week"}:{kick:"See",title:"The data quality module"},{light:"morning"});
      lf_pill(x,tt,c.keep+0.1,null,1300,800,"Write down what works",{col:LP.green,icon:"tick"});}}
  ]);
  lf_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Five layers */
scene("layers",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const T=[c.strat,c.biz,c.info,c.app,c.tech].map(v=>v-0.1),tab0=w("five","five layers",-0.2);
  // each page's picture, step by step at the words
  const P=[
    [w("strat","four goals",-0.2),w("strat","able",-0.3),w("strat","Governing",-0.1),w("strat","delivering",-0.1)],
    [w("ways","eleven",-0.2),w("ways","forty-one",-0.3)],
    [w("info","about",-0.1),w("staff","copied",-0.3)],
    [w("app","thirty-eight",-0.3),w("app","platform",-0.3),w("app","systems",-0.1)],
    [w("tech","servers",-0.3),w("tech","servers",0.5),w("tech","cloud",-0.2)]];
  const LU=[[w("strat","four goals",-0.2),w("strat","able",-0.3)],["twelve","services","processes","who does"].map(s=>w("biz",s,-0.1)),[w("info","about",-0.2),w("info","born",-0.2)],[w("app","systems",-0.2)],[w("tech","run",-0.2)]];
  ag_shots(ctx,S,t,sc.dur,[
    // the current state, TOGAF's baseline; then the five layers, a page at a time, each with its picture
    {at:0,place:"lfFeb",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      lf_sheet(x,tt,w("baseline","current state",-0.2),560,260,800,{kick:"What is",title:"The current state",sub:"TOGAF's method calls it the baseline"},{light:"morning",out:tab0-0.4});
      const cur=T.reduce((s,t0)=>s+ag_in(tt,t0-0.2,0.5),0)-1;
      lf_layerTabs(x,90,180,{cur,u:ag_in(tt,tab0,1.4),a:ag_in(tt,tab0,0.35),light:"morning"});
      T.forEach((t0,i)=>{const out=i<4?T[i+1]-0.5:1e9,a=ag_in(tt,t0,0.35)*(1-ag_in(tt,out,0.4));if(a<=0.004)return;
        lf_layerPage(x,i,500,130,1330,700,{p:P[i].map(p=>ag_in(tt,p,1.0)),lu:lf_u(tt,LU[i]),a,k:tt-t0,light:"morning"});});}},
    // ArchiMate has no information layer; Helena keeps one, because data is her job
    {at:c.archi-0.3,place:"lfFeb",later:true,keys:[[c.archi-0.3,960,540,1.0]],draw:(x,tt)=>{const o0=w("own","layer of its own",-0.4),h0=c.own-0.6;
      lf_archimate(x,120,280,760,{u:ag_in(tt,c.archi,1.0),obj:[ag_in(tt,w("archi2","business layer",-0.2),0.5),ag_in(tt,w("archi2","application layer",-0.2),0.5),0],a:ag_in(tt,c.archi,0.35),light:"morning"});
      lf_tag(x,tt,w("archi","no information",-0.1),null,840,228,"No information layer",{align:"right",col:LP.ink});
      lf_layerTabs(x,1000,250,{cur:2*ag_in(tt,o0,0.6)+(1-ag_in(tt,o0,0.6))*-1,u:ag_in(tt,h0,1.0),a:ag_in(tt,h0,0.35),light:"morning"});
      lf_tag(x,tt,o0+0.3,null,1180,790,"Information, a layer of its own",{align:"center",col:LP.orange});
      lp_person(x,"helena",1660,640,1.0,{t:tt,flip:true,a:ag_in(tt,h0,0.6),light:LF_MO});}},
    // Noor puts each page on her map
    {at:c.map-0.3,place:"lfFeb",later:true,keys:[[c.map-0.3,960,540,1.0]],draw:(x,tt)=>{const n0=w("map","Noor",-0.6);
      lp_screen(x,620,150,1180,520,{a:ag_in(tt,n0,0.5),draw:(cx,X,Y,Wd,Hd)=>lf_map(cx,X,Y,Wd,Hd,{u:ag_in(tt,w("map","map",-0.4),1.6)})});
      lp_nameTag(x,120,236,"noor",{a:ag_in(tt,n0+0.3,0.5)});
      lf_sheet(x,tt,w("today","Today",-0.4),620,700,720,{kick:"See · The map before the data",title:"Today, and where it's going"},{light:"morning"});
      lp_person(x,"noor",300,660,0.95,{t:tt,a:ag_in(tt,n0,0.6),light:LF_MO});}}
  ]);
  lf_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. Sent back */
const LF_OPPS=[["seven","one way","One way to ask"],["seven","retire","Retire the old warehouse"],["seven","owner","An owner for every report and product"],["seven2","data partners","Data partners"],
  ["seven2","measure","Measure delivery"],["seven2","critical","Write down the critical procedures"],["seven2","agents","Agents with mandates"]];
scene("back",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),e0=c.breath+0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // a finding written as someone's fault turns over into an opportunity
    {at:0,place:"lfFeb",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const f1=w("blame","fault",-0.6),f2=w("not2","faculties",-0.4);
      lf_flip(x,140,220,760,{kick:"A finding",title:"“Requests get lost”"},{kick:"An opportunity",title:"One way to ask"},ag_in(tt,w("not1","one way",-0.3),0.8),{a:ag_in(tt,f1,0.35),k:tt-f1,light:"morning"});
      lf_flip(x,1020,220,760,{kick:"A finding",title:"“Faculties keep their own copies”"},{kick:"An opportunity",title:"Data partners in faculties and offices"},ag_in(tt,w("not2","data partners",-0.3),0.8),
        {a:ag_in(tt,f2,0.35),k:tt-f2,light:"morning"});}},
    // the seven opportunities, four and then three
    {at:c.seven-0.3,place:"lfFeb",later:true,keys:[[c.seven-0.3,960,540,1.0]],draw:(x,tt)=>{
      LF_OPPS.forEach(([id,word,s],i)=>{const t0=w(id,word,-0.2),cx=i<4?100+i*440:320+(i-4)*440,cy=i<4?180:440;lf_oppCard(x,cx,cy,400,200,i+1,s,{a:ag_in(tt,t0,0.35),k:tt-t0,light:"morning"});});}},
    // Monday 15 March, the discovery milestone: the current state in five layers, and seven opportunities
    {at:c.march-0.3,place:"lfFeb",later:true,keys:[[c.march-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=w("pages","five layers",-0.3),s0=w("pages","seven",-0.2);
      lf_sheet(x,tt,c.march+0.1,140,170,640,{kick:"Monday 15 March",title:"Discovery milestone"},{col:LP.blue,light:"morning"});
      lf_fivePages(x,140,420,170,{a:ag_in(tt,p0,0.35),u:ag_in(tt,p0,1.2),light:"morning"});
      lf_miniCards(x,1160,420,{a:ag_in(tt,s0,0.35),u:ag_in(tt,s0,1.2),light:"morning"});}},
    // the summary sent back to everyone she spoke to; replies, and a page that changes
    {at:c.sends-0.3,place:"lfFeb",later:true,keys:[[c.sends-0.3,960,540,1.0]],draw:(x,tt)=>{const m0=w("sends","summary",-0.3);
      lf_mail(x,140,240,{a:ag_in(tt,m0,0.4),re:ag_in(tt,w("fix","write back",-0.2),1.4),fix:ag_in(tt,w("fix","pages change",-0.2),1.8),light:"morning"});}},
    // in Accra, the mothers knew, and Williams wrote it in their word
    {at:c.accra-0.3,place:"lfClinic",keys:[[c.accra-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const k0=w("accra","Williams",-0.2);
      lf_wordCard(x,560,110,800,{a:ag_in(tt,k0,0.4),k:tt-k0,mean:1,light:null});
      lp_person(x,LF_PEOPLE.mother,560,690,0.8,{t:tt,light:LF_LIGHT});
      lp_person(x,LF_PEOPLE.williams,1340,690,0.8,{t:tt,flip:true,pose:"hold",holdBack:(cc,h)=>lf_notebook(cc,h,{write:1}),light:LF_LIGHT});}},
    // at the university, the current state in their words; next, the target, with them
    {at:c.knew-0.3,place:"lfFeb",keys:[[c.knew-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      lf_fivePages(x,357,250,220,{a:1-ag_in(tt,c.next-0.6,0.4),light:"morning"});
      lf_tag(x,tt,w("knew","their words",-0.3),c.next-0.6,960,640,"In their words",{align:"center",col:LP.ink});
      lf_sheet(x,tt,w("next","Next",-0.1),560,240,800,{kick:"Next · Film 3 of 4",title:"Design it simple"},{col:LP.blue,light:"morning",out:c.take-0.5});
      lf_tag(x,tt,w("take","Ask",-0.1),e0,960,330,"Ask people",{align:"center",col:LP.ink});
      lf_tag(x,tt,w("take","count",-0.1),e0,960,410,"Count from the systems",{align:"center",col:LP.ink});
      lf_tag(x,tt,w("take","write",-0.1),e0,960,490,"Write down what is",{align:"center",col:LP.ink});}}
  ]);
  lp_end(ctx,S,t,e0,LF_TITLE,LF_LAST,"Film 2 of 4","A plan in ninety days",LF_MOD);
  lf_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["ask","read","count","layers","back"]);
