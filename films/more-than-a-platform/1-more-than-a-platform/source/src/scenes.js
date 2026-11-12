/* ===== More than a platform: the scenes =====
   Six chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The whole film is on the module's
   map, one room, and the camera never moves: a new moment is a later one (later:true), so what was there leaves before what comes
   in, and a chapter opens on what the one before ends on (ag_cutInto). From the fourth chapter on the route stays where it is, and
   only what is added to it comes and goes. The title card ends chapter 1, the end card chapter 6. */
const MP_CAM=[[0,960,540,1]];

/* ---------------------------------------------------------------- 1 · It worked */
scene("worked",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>({dec:wAt(sc,"tap","decision"),cls:wAt(sc,"seat","A new class"),two:wAt(sc,"why","two offices"),nums:wAt(sc,"why","two numbers"),same:wAt(sc,"why","same meeting")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the last picture of The Inner Life of Data: the tap, and the decision it became
    {at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{
      mp_phone(cx,320,180,330,640,tt-0.3,ag_in(tt,0.3,0.4));
      const pts=md_curve([650,500],[960,430]);md_lane(cx,pts,MD.flow,1,{u:ag_sine((tt-c.tap-0.2)/(T.dec-c.tap+0.2))});md_flow(cx,pts,tt,{kind:"events",a:ag_in(tt,T.dec+0.2,0.4)});
      md_textCard(cx,960,330,640,{kick:"Decision",title:"New class added",sub:"140 more seats"},{edge:MD.agreed,icon:"tick",k:tt-T.cls,a:ag_in(tt,T.cls,0.35)});
      md_pill(cx,1280,640,"It worked",{col:MD.pass,icon:"tick",k:tt-c.job-0.2,a:ag_in(tt,c.job+0.2,0.3)});}},
    // a week later: a meeting table from above, and two sheets with two counts of the same class
    {later:true,at:c.why-0.1,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{
      md_label(cx,960,170,"One week later",{align:"center",col:MD.flow});mp_table(cx,1);md_label(cx,960,312,"Data Science 101 · 180 seats",{align:"center"});
      if(tt>T.two)mp_sheet(cx,lerp(-260,700,ag_eo((tt-T.two)/0.9)),545,360,390,-0.05,{head:"Student office",num:"176",foot:"enrolled"},1,{col:MD.sys.sis});
      if(tt>T.nums)mp_sheet(cx,lerp(2180,1220,ag_eo((tt-T.nums)/0.9)),545,360,390,0.04,{head:"Finance",num:"149",foot:"enrolled"},1,{col:MD.sys.fin});
      md_tag(cx,960,790,"Which one?",{align:"center",col:MD.wait,a:ag_in(tt,T.same+0.4,0.35)});}}],0.6);
  setScreen(ctx,S);md_title(ctx,S,t,c.breath,"More than a platform",null,"AFTER THE INNER LIFE OF DATA");});

/* ---------------------------------------------------------------- 2 · One word */
const MP_SYS=["sis","lms","fin"],MP_N=["176","171","149"],MP_MEANS=["= signed up","= can open the course","= has paid"];
scene("word",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>({enr:wAt(sc,"one","enrolled"),sys1:wAt(sc,"office","one system"),thing:wAt(sc,"office","one thing"),
    said:[wAt(sc,"sis","signed up"),wAt(sc,"lms","can open"),wAt(sc,"fin","has paid")],right:wAt(sc,"three","each one"),fault:wAt(sc,"moves","without"),
    every:wAt(sc,"repeat","everywhere"),conf:wAt(sc,"repeat","confidence"),org:wAt(sc,"answer","how the organisation"),def:wAt(sc,"answer","what was defined"),who:wAt(sc,"answer","who decided")}));
  const col=i=>MD.sys[MP_SYS[i]],lineAt=[c.sis,c.lms,c.fin];
  ag_shots(ctx,S,t,sc.dur,[
    // one office, one system, one meaning
    {later:true,at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{
      md_label(cx,960,250,"Start with one word",{align:"center",a:ag_in(tt,c.one,0.5)});
      md_T(cx,"enrolled",960,450,{w:800,size:140,align:"center",a:ag_in(tt,T.enr-0.15,0.5)});
      md_system(cx,740,540,440,"sis",{a:ag_in(tt,T.sys1,0.4)});
      md_tag(cx,960,730,"one meaning",{align:"center",col:MD.agreed,icon:"tick",a:ag_in(tt,T.thing,0.4)});}},
    // the university grows: three systems, three meanings, three counts, each right
    {later:true,at:c.grows,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{
      [330,960,1590].forEach((x,i)=>{md_system(cx,x-220,190,440,MP_SYS[i],{a:ag_in(tt,c.grows+0.7+i*0.25,0.4)});
        md_T(cx,"enrolled",x,418,{w:800,size:60,align:"center",a:ag_in(tt,lineAt[i]+0.2,0.4)});
        md_T(cx,MP_MEANS[i],x,474,{w:600,size:32,align:"center",col:MD.soft,a:ag_in(tt,T.said[i]-0.1,0.4)});
        md_T(cx,MP_N[i],x,612,{w:800,size:116,align:"center",col:col(i),a:ag_in(tt,T.said[i]+0.3,0.4)});
        md_tag(cx,x,696,"right",{align:"center",col:MD.pass,icon:"tick",a:ag_in(tt,T.right+i*0.25,0.3)});});}},
    // the platform moves all three, unchanged; then more teams read them, and an agent
    {later:true,at:c.moves-0.2,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const sy=[206,406,606],ry=[262,416,570];
      md_card(cx,700,170,520,590,{edge:MD.flow,glow:0.6});md_label(cx,732,228,"The platform",{col:MD.flow});
      for(let i=0;i<3;i++){md_system(cx,100,sy[i],420,MP_SYS[i],{sub:"enrolled: "+MP_N[i]});
        const pts=md_curve([520,sy[i]+55],[732,ry[i]+48]),t0=c.moves+0.5+i*0.2;md_lane(cx,pts,col(i),1,{u:ag_sine((tt-t0)/0.9)});md_flow(cx,pts,tt,{col:col(i),kind:"events",off:i*0.3,a:ag_in(tt,t0+0.9,0.4)});
        mp_row(cx,732,ry[i],456,col(i),MP_N[i],ag_in(tt,t0+0.7,0.4));}
      md_pill(cx,960,806,"Moved without a fault",{col:MD.pass,icon:"tick",k:tt-T.fault,a:ag_in(tt,T.fault,0.3)});
      const who=[["Student office",200,0],["Finance",330,2],["Teaching",460,1]];
      who.forEach((w,i)=>{const t0=c.teams+0.2+i*0.25,pts=md_curve([1220,ry[i]+48],[1400,w[1]+48]);md_lane(cx,pts,MD.flow,1,{u:ag_sine((tt-t0)/0.7)});
        mp_reader(cx,1400,w[1],420,w[0],null,ag_in(tt,t0+0.3,0.4),MP_N[w[2]],col(w[2]),tt-T.every-i*0.22);});
      const ta=c.agent+0.2,pa=md_curve([1220,ry[2]+48],[1400,688]);md_lane(cx,pa,MP.agents,1,{u:ag_sine((tt-ta)/0.7)});
      mp_reader(cx,1400,640,420,"AI agent",MP.agents,ag_in(tt,ta+0.3,0.4),MP_N[0],col(0),tt-T.conf);}},
    // what changes the answer
    {later:true,at:c.answer-0.2,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{
      md_label(cx,960,250,"What changes the answer",{align:"center",a:ag_in(tt,c.answer+0.3,0.5)});
      mp_thing(cx,430,"share","the organisation",ag_in(tt,T.org,0.4),tt-T.org);mp_thing(cx,570,"contract","the definition",ag_in(tt,T.def,0.4),tt-T.def);mp_thing(cx,710,"person","who decides",ag_in(tt,T.who,0.4),tt-T.who);}}],0.6);
  setScreen(ctx,S);});

/* ---------------------------------------------------------------- 3 · The route */
// each station's question, under its name, for as long as it is spoken
const MP_Q={ea:["Enterprise architecture","How does this organisation work?"],gov:["Data governance","Who decides?"],model:["Data modelling","What does each word mean?"],
  basics:["Modern data basics","How does data move, run and get served today?"],ae:["Analytics engineering","How is it built, and tested?"],dq:["Data quality","Is it right, and in time?"],
  mdm:["Master and reference data","Is it the same student everywhere?"],prot:["Data protection and privacy","Who may see it, and for how long?"],
  agents:["AI agents in data work","What may an agent do with it?"],dm:["Data management","How does it all fit in one plan?"],lead:["Leading data people","Who leads the people who do the work?"]};
// a question's card is as wide as its words, and sits in the middle, under the route
const MP_QW={},mp_qw=(ctx,id)=>MP_QW[id]||(MP_QW[id]=Math.ceil(Math.max(520,md_tw(ctx,MP_Q[id][1],{w:700,size:36})+64,md_tw(ctx,MP_Q[id][0].toUpperCase(),{w:800,size:28,ls:4})+64)));
scene("route",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>{const lead=wAt(sc,"lead","leading data people"),X=id=>MP_ST[id][0],U=MP_LOOP;
    // when each station is named, and when its card leaves
    const said={ea:c.ea,gov:c.gov,model:c.model,basics:c.basics,ae:c.ae,dq:c.dq,mdm:c.mdm,prot:c.prot,agents:c.agents,dm:c.dm,lead},
      till={ea:c.gov,gov:c.found,model:c.basics,basics:c.ae,ae:c.dq,dq:c.side,mdm:c.prot,prot:c.agents,agents:c.meet,dm:c.lead,lead:sc.dur-0.9};
    let mainK=[[c.here,X("start")]];for(const id of["ea","gov"])mainK.push([said[id]-0.1,mainK[mainK.length-1][1]],[said[id]+0.6,X(id)]);
    mainK.push([c.build,X("gov")],[c.build+0.7,MP_J1[0]]);for(const id of["model","basics","ae","dq"])mainK.push([said[id]-0.1,mainK[mainK.length-1][1]],[said[id]+0.6,X(id)]);
    mainK.push([c.meet,X("dq")],[c.meet+0.9,MP_J2[0]]);for(const id of["dm","lead"])mainK.push([said[id]-0.1,mainK[mainK.length-1][1]],[said[id]+0.6,X(id)]);
    const upK=[[c.side+0.2,0],[c.side+1.5,U.share.rise],[c.mdm-0.1,U.share.rise],[c.mdm+0.6,U.share.u.mdm],[c.prot-0.1,U.share.u.mdm],[c.prot+0.6,U.share.u.prot],[c.meet,U.share.u.prot],[c.meet+0.9,1]],
      dnK=[[c.side+0.2,0],[c.side+1.5,U.agents.rise],[c.agents-0.1,U.agents.rise],[c.agents+0.6,U.agents.u.agents],[c.meet,U.agents.u.agents],[c.meet+0.9,1]];
    return{not:wAt(sc,"where","Not with"),sharing:wAt(sc,"share","sharing"),said,till,mainK,upK,dnK};});
  ag_shots(ctx,S,t,sc.dur,[
    {later:true,at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{
      md_T(cx,"Where do you start?",960,470,{w:800,size:92,align:"center",a:ag_in(tt,c.where+0.2,0.5)});
      md_T(cx,"Not with the platform.",960,566,{w:600,size:44,align:"center",col:MD.soft,a:ag_in(tt,T.not,0.4)});}},
    // the route draws itself, station by station, each with its question
    {later:true,at:c.here-0.4,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const on={start:ag_spr(tt,c.here+0.2,0.7)},lab={start:ag_in(tt,c.here+0.4,0.4)},lit={};
      for(const id in T.said){on[id]=ag_spr(tt,T.said[id]+0.45,0.7);lab[id]=ag_in(tt,T.said[id]+0.5,0.4);lit[id]=ag_io(tt,T.said[id]+0.4,T.till[id]-0.2,0.3);}
      const fo=ag_io(tt,c.found,c.build-0.2,0.3);lit.ea=Math.max(lit.ea,fo);lit.gov=Math.max(lit.gov,fo);
      mp_route(cx,{mainX:ag_keys(tt,T.mainK),up:ag_keys(tt,T.upK),dn:ag_keys(tt,T.dnK),on,lab,lit,
        grp:{found:ag_in(tt,c.found+0.2,0.4),build:ag_in(tt,c.build+0.2,0.4),share:ag_in(tt,T.sharing,0.4),agents:ag_in(tt,c.agents+0.5,0.4),lead:ag_in(tt,c.dm+0.5,0.4)}});
      for(const id in MP_Q){const a=ag_io(tt,T.said[id]+0.25,T.till[id]-0.15,0.3);if(a>0.004){const w=mp_qw(cx,id);md_textCard(cx,960-w/2,676,w,{kick:MP_Q[id][0],title:MP_Q[id][1]},{edge:MP[MP_ST[id][2]],a});}}
      // who decides: the meeting's two sheets, for a moment, and the one definition that replaces them
      const sA=ag_io(tt,c.gov+0.3,c.gov+1.5,0.3);mp_sheet(cx,1450,750,170,150,-0.05,{num:"176",foot:"enrolled"},sA,{big:60,small:true});mp_sheet(cx,1650,750,170,150,0.04,{num:"149",foot:"enrolled"},sA,{big:60,small:true});
      md_textCard(cx,1330,676,440,{kick:"Agreed",title:"enrolled",sub:"one definition"},{edge:MD.agreed,icon:"contract",a:ag_io(tt,c.gov+1.8,c.build-0.2,0.35),k:tt-c.gov-1.8});}}],0.6);
  setScreen(ctx,S);});

/* ---------------------------------------------------------------- 4 · One map among many */
scene("wheel",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>({best:wAt(sc,"dama","DAMA's wheel"),gov:wAt(sc,"dama","governance"),
    dots:mp_wheelDots(960,470,250),to:["gov","ea","model","basics","ae","dq","mdm","prot","agents","dm","lead"]}));
  ag_shots(ctx,S,t,sc.dur,[
    {later:true,at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const out=1-ag_in(tt,c.ours,0.7),any=ag_in(tt,c.any,0.5);
      // maps of the same ground: layers, a wheel, a grid; the wheel is the best known
      mp_layers(cx,380,470,out*ag_in(tt,c.before+0.3,0.5)*lerp(0.45,0.9,any));mp_grid(cx,1540,470,out*ag_in(tt,c.before+0.9,0.5)*lerp(0.45,0.9,any));
      mp_wheel(cx,960,470,250,(tt-c.before-0.5)/2.4,out*lerp(0.55,1,ag_in(tt,T.best-0.2,0.5)),ag_in(tt,T.best,0.6));
      md_label(cx,960,160,"DAMA-DMBOK",{align:"center",a:out*ag_in(tt,T.best,0.4)});md_T(cx,"Governance",960,480,{w:800,size:28,align:"center",col:MD.agreed,a:out*ag_in(tt,T.gov-0.2,0.4)});
      // it opens out and lays itself along the route: the hub goes to Data governance
      const u=ag_sine((tt-c.ours-0.2)/1.3),dA=ag_in(tt,c.ours,0.3)*(1-ag_in(tt,c.ours+1.6,0.5));
      if(dA>0.004)T.dots.forEach((d,i)=>{const s=MP_ST[T.to[i]],x=lerp(d[0],s[0],u),y=lerp(d[1],s[1],u),col=mix(i?MD.flow:MD.agreed,MP[s[2]],u);glow(cx,x,y,44,col,0.5*dA);cx.beginPath();cx.arc(x,y,10,0,TAU);cx.fillStyle=rgba(col,dA);cx.fill();});
      mp_route(cx,{a:ag_in(tt,c.ours+1.3,0.8)});}}],0.6);
  setScreen(ctx,S);});

/* ---------------------------------------------------------------- 5 · What you can do here */
const MP_TOOLS=[["watch","Watch"],["think","Pause and think"],["lab","Take it apart"],["call","Make the call"],["goal","Pick a goal"],["search","Search"]];
scene("here",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>({at:[wAt(sc,"films","short films"),c.ask+0.2,c.lab+0.2,c.call+0.2,c.goal+0.2,c.search+0.3],lights:wAt(sc,"goal","lights up")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const nA=ag_io(tt,T.lights,c.search-0.1,0.35);
      // a goal lights up its stops and numbers them; what is done stays: the first station's ring closes
      mp_route(cx,{num:{start:1,model:2,ae:3,dq:4},numA:nA,lit:{start:nA,model:nA,ae:nA,dq:nA},done:{start:ag_sine((tt-c.stays-0.3)/1.4)}});
      MP_TOOLS.forEach((w,i)=>{const x=210+i*300,a=ag_in(tt,T.at[i],0.3);mp_tool(cx,w[0],x,728,MD.flow,tt-T.at[i],a);mp_toolName(cx,x,836,w[1],a);});}}],0.6);
  setScreen(ctx,S);});

/* ---------------------------------------------------------------- 6 · Start */
scene("start",(ctx,S,t,sc)=>{const c=sc.cues;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const lit={start:ag_io(tt,c.matured,c.hard,0.4)},go=ag_in(tt,c.there,0.3);
      // the platform's station is done; everything else lights, and the next stop is the first of the foundations
      MP_ORDER.slice(1).forEach((id,i)=>{lit[id]=0.7*ag_io(tt,c.hard+0.2+i*0.1,c.there,0.4);});lit.ea=Math.max(lit.ea,go);
      mp_route(cx,{done:{start:1},lit});md_tag(cx,300,540,"Start here",{align:"center",col:MD.flow,a:ag_in(tt,c.there+0.1,0.3)});}}],0.6);
  setScreen(ctx,S);md_end(ctx,S,t,c.breath,"More than a platform","The hard part is everything else.","","Start here");});

ag_cutInto(["word","route","wheel","here","start"]);
