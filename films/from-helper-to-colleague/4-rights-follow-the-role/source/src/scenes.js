/* ===== Rights follow the role: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): a place painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice.
   The opening goes from the ward of the late 1950s, wide, to its medicine cabinet, close (a cut, wide to close and back), then
   dissolves to the pharmacy at Little Rock and then to the lab: the whole picture changes each time. From chapter 2 on, each lab
   chapter opens where the last one ends (ag_cutInto): the camera stays, the planning agent stays put at the upper left, and only what
   changes fades; a later moment in the room (Clara, then Jun with his helper, then Noor and Sam, then the agent's own chapter) lets
   what was there leave before what comes later comes in, so the planning agent and Jun's helper, which look alike, never meet. The last
   chapter dissolves back to the pharmacy's drawer, and back to the lab. The corner tag is drawn over the hospital shots; the kicker
   over the lab's. */

// the corner tags over a chapter's shots: [t0, t1, text]
function rf_tags(ctx,S,t,list){setScreen(ctx,S);for(const [t0,t1,s] of list){const a=ag_in(t,t0,0.5)*(1-ag_in(t,t1-0.4,0.4));if(a>0)rf_corner(ctx,s,a);}}
// draw f in the frame's own coordinates, over a shot whose camera moves
const rf_scr=(x,S,f)=>{x.save();setScreen(x,S);f();x.restore();};

/* ---------------------------------------------------------------- 1 · A drawer filled from the order */
scene("ward",(ctx,S,t,sc)=>{const c=sc.cues,FT=t+sc.start,P=rf_once(sc,"P",()=>({big:wAt(sc,"stock","big bottles"),every:wAt(sc,"stock","for every patient"),
    shared:wAt(sc,"pour","the shared bottles"),hand:wAt(sc,"pour","by hand"),dorder:wAt(sc,"order","the doctor's order"),copy:wAt(sc,"order","only a copy"),
    clerk:wAt(sc,"order","written out"),slip:wAt(sc,"wrong","a slip"),drug:wAt(sc,"wrong","the wrong drug"),amount:wAt(sc,"wrong","the wrong amount"),
    inj:wAt(sc,"wrong","an injection"),hands:wAt(sc,"reach","every hand"),ark:wAt(sc,"arkansas","pharmacists"),another:wAt(sc,"arkansas","another way"),
    reado:wAt(sc,"drawer","each doctor's order"),single:wAt(sc,"drawer","single doses"),labelled:wAt(sc,"drawer","labelled"),
    ready:wAt(sc,"drawer","ready to give"),due:wAt(sc,"drawer","each as it fell due"),took:wAt(sc,"day","took it up"),gotd:wAt(sc,"day","a drawer"),
    from:wAt(sc,"day","filled from the order"),oneday:wAt(sc,"day","one day's doses"),ordered:c.each,checked:wAt(sc,"each","the pharmacist checked"),
    gave:wAt(sc,"each","the nurse gave"),study:wAt(sc,"fell","In their study"),five:wAt(sc,"fell","one dose in five"),thirty:wAt(sc,"fell","one in thirty"),
    nine:wAt(sc,"spread","nine American hospitals"),same:wAt(sc,"uni","the same question"),reachQ:wAt(sc,"uni","what should it"),
    persons:wAt(sc,"shelf","a person's rights"),whole:wAt(sc,"shelf","the whole shelf"),approving:wAt(sc,"shelf","approving"),prod:wAt(sc,"shelf","changing production"),
    work:wAt(sc,"fill","the rights of its work"),steps:wAt(sc,"fill","each of its steps"),drawerW:wAt(sc,"fill","a drawer"),
    cant:wAt(sc,"slip","can't reach"),further:wAt(sc,"slip","any further")}));
  const NX=1480,NY=660,NS=0.9,PX=430,PY=470,N2=1700,N2Y=640;
  // every medicine within reach of every hand, for every patient: the cabinet's outline lit amber, and from it a line to every bed,
  // each bed with a ring, drawn on bed by bed
  const web=(x,tt)=>{const g=ag_in(tt,P.hands-0.8,0.6),pulse=1+0.6*ag_io(tt,c.change,c.change+1.6,0.5);if(g<=0)return;
    const [za,zb]=RF_WD.cab,L=RF_WD.l,q=[[L+0.02,1.16,za],[L+0.02,2.36,za],[L+0.02,2.36,zb],[L+0.02,1.16,zb]].map(p=>rf_P(...p));
    x.save();x.globalAlpha*=g;x.strokeStyle=rgba(AG.amber,0.75*Math.min(1,pulse));x.lineWidth=4;x.lineJoin="round";x.shadowColor=rgba(AG.amber,0.5);x.shadowBlur=16*pulse;
    x.beginPath();q.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.stroke();x.restore();
    const o=rf_P(L+0.3,1.76,(za+zb)/2);rf_bedPoints().forEach((d,j)=>{const u=clamp((tt-P.hands+0.4-j*0.22)/0.8,0,1);if(u<=0)return;
      rf_line(x,o[0],o[1],d[0],d[1],u,AG.amber,{a:g,lineA:0.6*Math.min(1.4,pulse),lw:2.4,bow:-40-j*6,dash:[9,7]});
      if(u>=0.95){const r=900*0.34/RF_WD.beds[j];x.save();x.globalAlpha*=g*ag_in(u,0.95,0.05);x.strokeStyle=rgba(AG.amber,0.85);x.lineWidth=Math.max(2,r*0.16);
        x.beginPath();x.ellipse(d[0],d[1],r,r*0.55,0,0,TAU);x.stroke();x.restore();}});};
  ag_shots(ctx,S,t,sc.dur,[
    // an American hospital ward, late in the 1950s: the camera draws back down its length, then turns to the cabinet near us
    {at:0,place:"rfWard",keys:[[0,1100,470,1.2],[0.3,960,540,1.0],[c.stock,640,470,1.45]],d:4.4,push:0},
    // its medicines kept on the ward as stock, big bottles for every patient; a nurse pours each patient's doses from them, by hand
    {at:P.big-0.3,place:"rfStock",cut:true,keys:[[P.big-0.3,960,540,1]],push:0.03,draw:(x,tt)=>{
      const mx=ag_in(tt,P.shared-0.4,0.45);
      rf_who(x,RF_P.nurse,FT,NX,NY,NS,{p:{flip:true,pose:"hang",pose2:"hold",mix:mx,gaze:[3,1],
        hold:(cc,h)=>{if(mx<=0)return;cc.save();cc.globalAlpha*=mx;rf_holdBottle(cc,h);cc.restore();}}});
      rf_card(x,1250,130,610,"The ward's stock","Big bottles, for every patient",null,{kickCol:AG.blue,a:ag_io(tt,P.big+0.1,c.order-0.3,0.4),k:ag_spr(tt,P.big+0.1)});
      const p1=rf_pillL(x,1250,352,"shared bottles",{a:ag_io(tt,P.shared,c.order-0.3,0.4)});rf_pillL(x,p1.x+p1.w+18,352,"poured by hand",{a:ag_io(tt,P.hand,c.order-0.3,0.4)});
      // often the pharmacist never saw the doctor's order, only a copy, written out by a nurse or a ward clerk
      const oa=ag_in(tt,P.dorder,0.4),ca=ag_in(tt,P.copy,0.4);
      rf_order(x,1385,196,250,{h:150,r:-0.04,title:"ORDER",seed:3,a:oa*(1-ag_in(tt,c.reach-0.9,0.4))});
      rf_arrow(x,1545,196,ca*(1-ag_in(tt,c.reach-0.9,0.4)));
      rf_order(x,1705,204,250,{h:150,r:0.05,title:"COPY",copy:true,seed:8,edge:AG.amber,edgeA:0.85*ag_in(tt,P.slip,0.4),a:ca*(1-ag_in(tt,c.reach-0.9,0.4))});
      rf_pillL(x,1250,334,"copied by a nurse or a ward clerk",{a:ag_io(tt,P.clerk,c.reach-0.9,0.4)});
      // so a slip went unnoticed, and a patient got the wrong drug, the wrong amount, or an injection meant to be swallowed
      const w1=rf_pillL(x,290,476,"the wrong drug",{icon:"warn",col:AG.amber,a:ag_io(tt,P.drug,c.reach-0.9,0.4)});
      rf_pillL(x,w1.x+w1.w+20,476,"the wrong amount",{icon:"warn",col:AG.amber,a:ag_io(tt,P.amount,c.reach-0.9,0.4)});
      rf_pillL(x,290,556,"an injection meant to be swallowed",{icon:"warn",col:AG.amber,a:ag_io(tt,P.inj,c.reach-0.9,0.4)});}},
    // every medicine on the shelf, within reach of every hand, for every patient: a line from every bottle to every bed
    {at:c.reach-0.3,place:"rfWard",cut:true,keys:[[c.reach-0.3,960,540,1]],push:0.025,draw:(x,tt)=>{web(x,tt);
      rf_scr(x,S,()=>rf_card(x,1230,124,620,"Every medicine","Within reach of every hand",null,{kickCol:AG.amber,edge:AG.amber,edgeA:0.55,
        a:ag_in(tt,P.hands,0.4),k:ag_spr(tt,P.hands)}));}},
    // in the early 1960s, at Little Rock, the pharmacists tried another way: a pharmacist reads each doctor's order, and the pharmacy
    // sends single doses, labelled and ready to give, each as it falls due; the doctor orders, the pharmacist checks and fills, the
    // nurse gives; mistakes fell from almost one dose in five to one in thirty. As other hospitals took it up, each patient got a
    // drawer, filled from the order, no more than a day's doses; by 1990 nine hospitals in ten
    {at:c.arkansas-0.5,place:"rfPharm",keys:[[c.arkansas-0.5,960,540,1]],push:0.03,draw:(x,tt)=>{
      const mo=ag_in(tt,P.reado-0.4,0.45),ca=ag_in(tt,P.took-0.2,0.6),open=clamp((tt-P.gotd)/0.9,0,1),fill=clamp((tt-P.from-0.1)*2.4,0,3);
      // as other hospitals took it up, a cart with a drawer for each patient: it comes in whole, then Bed 4's drawer opens and is filled
      if(ca>=0.999)rf_cart(x,{open:[3,open],fill,lit:tt>P.gotd-0.2?3:-1});else rf_cartIn(x,ca);
      x.save();x.beginPath();x.rect(0,0,W,RF_PH.counter-12);x.clip();
      rf_who(x,RF_P.pharm,FT,PX,PY,1,{p:{cut:RF_PH.counter-12,pose:"hang",pose2:"hold",mix:mo,gaze:[4,1],
        hold:(cc,h)=>{if(mo<=0)return;cc.save();cc.globalAlpha*=mo;rf_holdOrder(cc,h);cc.restore();}}});x.restore();
      // the nurse comes for a dose and gives it, and goes as the story moves on to other hospitals
      const na=ag_in(tt,c.each-0.4,0.5)*(1-ag_in(tt,c.day+0.3,0.5)),gm=ag_in(tt,P.gave-0.4,0.45),
        gx=tt<c.day-0.6?rf_slide(tt,c.each-0.4,2150,N2,1.3):rf_slide(tt,c.day-0.6,N2,2150,1.3);
      if(na>0)rf_who(x,RF_P.nurse2,FT,gx,N2Y,0.9,{a:na,p:{flip:true,pose:"hang",pose2:"hold",mix:gm,gaze:[3,1],
        hold:(cc,h)=>{if(gm<=0)return;cc.save();cc.globalAlpha*=gm;rf_holdCup(cc,h);cc.restore();}}});
      rf_card(x,1250,96,610,"Pharmacists at the","University of Arkansas Medical Center",null,{kickCol:AG.blue,a:ag_io(tt,P.ark+0.2,c.drawer-0.3,0.4),k:ag_spr(tt,P.ark+0.2)});
      // single doses on the counter, sent one after another, each labelled and ready to give
      for(let i=0;i<3;i++){const pa=ag_in(tt,P.single+0.25*i,0.4)*(1-ag_in(tt,c.fell-0.4,0.4));if(pa>0)rf_packet(x,820+i*96,RF_PH.counter-38-(1-ag_eo(pa))*40,62,{a:clamp(pa*3,0,1),r:(i-1)*0.05});}
      const s1=rf_pillL(x,1250,150,"single doses",{col:AG.blue,a:ag_io(tt,P.single,P.due-0.3,0.4)});
      rf_pillL(x,s1.x+s1.w+18,150,"labelled",{col:AG.blue,a:ag_io(tt,P.labelled,P.due-0.3,0.4)});
      rf_pillL(x,1250,228,"ready to give",{col:AG.blue,a:ag_io(tt,P.ready,P.due-0.3,0.4)});
      rf_pillL(x,1250,150,"each dose, as it fell due",{col:AG.blue,a:ag_io(tt,P.due,c.each-0.4,0.4)});
      rf_pillL(x,1250,150,"one day's doses at most",{col:AG.blue,a:ag_io(tt,P.oneday,c.spread-0.4,0.4)});
      // the doctor ordered, the pharmacist checked and filled, the nurse gave: three cards along the top, one for each
      const ea=k=>ag_io(tt,[P.ordered,P.checked,P.gave][k],c.fell-0.4,0.4),kk=k=>ag_spr(tt,[P.ordered,P.checked,P.gave][k]);
      rf_card(x,560,64,320,"The doctor","orders",null,{kickCol:AG.kick,a:ea(0),k:kk(0)});rf_arrow(x,912,134,ea(1));
      rf_card(x,944,64,420,"The pharmacist","checks and fills",null,{kickCol:AG.kick,a:ea(1),k:kk(1)});rf_arrow(x,1396,134,ea(2));
      rf_card(x,1428,64,300,"The nurse","gives",null,{kickCol:AG.kick,a:ea(2),k:kk(2)});
      // what their study found, and how far it spread
      rf_card(x,560,64,860,"Mistakes other than timing","From almost 1 dose in 5 to 1 in 30","Barker's study, 1969",{kickCol:AG.blue,edge:AG.green,edgeA:0.6,
        a:ag_io(tt,P.study,c.day-0.4,0.4),k:ag_spr(tt,P.study)});
      rf_card(x,700,64,860,"By 1990","Nine American hospitals in ten","worked this way · ASHP's survey, 1990",{kickCol:AG.blue,edge:AG.green,edgeA:0.6,
        a:ag_io(tt,P.nine-0.2,c.uni-0.6,0.4),k:ag_spr(tt,P.nine-0.2)});}},
    // at the university, Planning's new agent raises the same question: what should it be able to reach? A person's rights reach the
    // whole shelf, approving and changing production included; the rights of its work reach only what each of its steps needs
    {at:c.uni-0.4,place:"rfLab",keys:[[c.uni-0.4,960,540,1]],push:0,draw:(x,tt)=>{const out=1-ag_in(tt,c.breath-0.2,0.6),M=RL.mid;
      withA(x,out,()=>{rf_agent(x,FT,{at:M,a:ag_in(tt,c.uni+0.2,0.6),think:ag_io(tt,P.reachQ,c.shelf,0.5)});ag_roomLight(x,1);
        rf_card(x,560,446,800,"The same question","What should it be able to reach?",null,{kickCol:AG.violet,a:ag_io(tt,P.same,c.shelf-0.3,0.4),k:ag_spr(tt,P.same)});
        const sh=rf_shelf(x,110,446,{a:ag_in(tt,P.persons,0.4),k:ag_spr(tt,P.persons),lit:clamp((tt-P.whole)/1.6,0,1),edge:ag_in(tt,P.whole,0.5),dim:ag_in(tt,P.cant,0.6)});
        // the shelf: the agent reaches all of it
        rf_line(x,M.x-M.r-6,M.y+20,sh.x+sh.w*0.62,sh.y-8,clamp((tt-P.whole+0.3)/0.8,0,1),AG.amber,{a:1-0.6*ag_in(tt,P.cant,0.6),lw:3.5,lineA:0.8,bow:40,head:true});
        const a1=rf_pillL(x,110,782,"approving",{icon:"lock",col:AG.amber,a:ag_in(tt,P.approving,0.4)*(1-0.55*ag_in(tt,P.cant,0.6))});
        rf_pillL(x,a1.x+a1.w+18,782,"changing production",{icon:"lock",col:AG.amber,a:ag_in(tt,P.prod,0.4)*(1-0.55*ag_in(tt,P.cant,0.6))});
        // the drawer: a line from the agent to each of its three steps
        const ri=[0,1,2].map(i=>ag_in(tt,P.steps+0.3*i,0.4)),dr=rf_drawer(x,1050,446,{a:ag_in(tt,P.work,0.4),k:ag_spr(tt,P.work),rows:ri,ok:ag_in(tt,P.cant,0.5)});
        rf_line(x,M.x+M.r+6,M.y+20,dr.x+dr.w*0.38,dr.y-8,clamp((tt-P.work+0.2)/0.8,0,1),AG.blue,{lw:3.5,lineA:0.8,bow:-40,head:true});
        rf_pillL(x,1050,782,"a slip stays inside its work",{icon:"tick",col:AG.green,a:ag_in(tt,P.further,0.4)});
        RF_KICK(x,{a:ag_in(tt,c.uni+0.6,0.6)});});}}
  ],0.6);
  rf_tags(ctx,S,t,[[0.8,c.arkansas-0.5,RF_TAG_50],[c.arkansas+0.6,c.each-0.5,RF_TAG_60],[c.day+0.3,c.uni-0.4,RF_TAG_US]]);
  ag_title(ctx,S,t,c.breath,"Rights follow the role","an agent's rights come from its work, not from a person's","FILM 4 OF 7 · FROM HELPER TO COLLEAGUE");});

/* ---------------------------------------------------------------- 2 · What Jun's helper had */
scene("borrowed",(ctx,S,t,sc)=>{const c=sc.cues,FT=t+sc.start,P=rf_once(sc,"P",()=>({clara:wAt(sc,"ask","Clara Jensen"),simple:wAt(sc,"ask","the simple way"),
    worked:wAt(sc,"quote","It worked."),signin:wAt(sc,"helper","own sign-in"),every:wAt(sc,"helper","every right"),tickets:wAt(sc,"helper","Planning's tickets"),
    gathered:wAt(sc,"many","gathered"),builds:wAt(sc,"today","builds the project"),reviews:wAt(sc,"today","reviews and approves"),
    approve:wAt(sc,"person","to approve"),merge:wAt(sc,"person","to merge"),prod:wAt(sc,"person","to change production"),
    research:wAt(sc,"old","the research system's"),report:wAt(sc,"old","a report"),wide:wAt(sc,"wide","too wide"),people:wAt(sc,"wide","only people"),
    tables:wAt(sc,"wide","tables"),years:wAt(sc,"history","years of"),none:wAt(sc,"history","none of them"),work:wAt(sc,"other","from the work")}));
  const lit=tt=>({today:ag_io(tt,c.today,c.person-0.2,0.4),person:ag_io(tt,c.person,c.old-0.2,0.4),old:ag_io(tt,c.old,c.twice-0.2,0.4)});
  ag_shots(ctx,S,t,sc.dur,[
    // on Thursday 22 October, Clara asks for the simple way: "Give it what Jun's helper had. It worked."
    {at:0,place:"rfLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      rf_who(x,"clara",FT,400,730,0.85,{a:ag_in(tt,c.ask,0.6),p:{gaze:[4,-1]}});ag_roomLight(x,1);
      rf_card(x,110,140,560,"Thursday 22 October","Clara Jensen · Planning",null,{kickCol:AG.blue,a:ag_in(tt,P.clara,0.4),k:ag_spr(tt,P.clara)});
      rf_pillL(x,110,332,"the simple way",{a:ag_in(tt,P.simple,0.4)});
      rf_card(x,720,300,700,null,"“Give it what Jun's helper had. It\u00a0worked.”",null,{tail:{side:"left",at:0.75,px:520,py:600},a:ag_in(tt,c.quote,0.4),k:ag_spr(tt,c.quote)});
      RF_KICK(x);}},
    // all year, Jun's helper drafted Planning's tickets on Jun's own sign-in, with every right he has: 46, gathered over the years.
    // Some for his work today, some only a person should use, some left from old work. Copying them would fail twice
    {at:c.helper-0.4,place:"rfLab",later:true,keys:[[c.helper-0.4,960,540,1]],push:0,draw:(x,tt)=>{
      rf_who(x,"jun",FT,380,740,0.85,{p:{gaze:[4,-2]}});
      rf_agent(x,FT,{at:{x:650,y:236,r:58},name:"Jun Park",glow:ag_io(tt,P.signin,P.signin+2.2,0.4),think:ag_io(tt,P.tickets,c.many,0.5)});
      ag_roomLight(x,1);
      rf_pillL(x,470,436,"drafts Planning's tickets",{a:ag_in(tt,P.tickets,0.4)*(1-ag_in(tt,c.twice-0.3,0.4))});
      const L=lit(tt),dim=Math.max(L.today,L.person,L.old);
      rf_chips(x,1000,120,{a:ag_in(tt,P.every,0.4),k:ag_spr(tt,P.every),lit:L,dim,warn:ag_io(tt,P.people,c.other-0.4,0.5)});
      // the three kinds, each named as it's said
      const b1=rf_pillL(x,1000,566,"builds the project",{col:AG.blue,a:ag_io(tt,P.builds,c.person-0.3,0.4)});
      rf_pillL(x,1000,644,"reviews and approves its code",{col:AG.blue,a:ag_io(tt,P.reviews,c.person-0.3,0.4)});
      const q1=rf_pillL(x,1000,566,"approve",{icon:"lock",col:AG.amber,a:ag_io(tt,P.approve,c.old-0.3,0.4)}),
        q2=rf_pillL(x,q1.x+q1.w+16,566,"merge",{icon:"lock",col:AG.amber,a:ag_io(tt,P.merge,c.old-0.3,0.4)});
      rf_pillL(x,q2.x+q2.w+16,566,"change production",{icon:"lock",col:AG.amber,a:ag_io(tt,P.prod,c.old-0.3,0.4)});
      rf_pillL(x,1000,566,"the research system's projects",{col:[96,100,108],a:ag_io(tt,P.research,c.twice-0.3,0.4)});
      rf_pillL(x,1000,644,"for a report in 2024",{col:[96,100,108],a:ag_io(tt,P.report,c.twice-0.3,0.4)});
      // copying them would fail twice: too wide, and made for a person's years, which the agent doesn't have
      rf_rows(x,1000,540,760,{kick:"Copying them would fail twice",kickCol:AG.amber},[
        {lab:"1",t:"Too wide: what only people may do, and tables no ticket needs",ta:ag_in(tt,P.wide,0.4)},
        {lab:"2",t:"Grown from a person's years: the agent has none",ta:ag_in(tt,P.years,0.4)}],
        {labW:44,edge:AG.amber,a:ag_in(tt,c.twice+0.2,0.4),k:ag_spr(tt,c.twice+0.2)});
      RF_KICK(x);}},
    // so Noor and Sam went the other way: from the work to the rights
    {at:c.other-0.4,place:"rfLab",later:true,keys:[[c.other-0.4,960,540,1]],push:0,draw:(x,tt)=>{
      rf_who(x,"noor",FT,330,740,0.82,{p:{gaze:[4,-1]}});rf_who(x,"sam",FT,650,752,0.82,{p:{gaze:[4,-1]}});ag_roomLight(x,1);
      rf_card(x,1000,250,760,"Noor and Sam","From the work to the rights",null,{kickCol:AG.blue,a:ag_in(tt,P.work-0.2,0.4),k:ag_spr(tt,P.work-0.2)});
      rf_flow(x,1000,470,[{t:"the work",a:ag_in(tt,P.work,0.4)},{t:"its steps",a:ag_in(tt,P.work+0.35,0.4)},{t:"its rights",a:ag_in(tt,P.work+0.7,0.4)}]);
      RF_KICK(x);}}
  ],0.6);});

/* ---------------------------------------------------------------- 3 · Rights from the steps */
// a step's card: what it reads, writes and calls, each line coming in on its word (u [3]); o.a, o.k
function rf_stepCard(x,name,reads,writes,calls,u,o){return rf_rows(x,720,120,1100,{kick:"Step · "+name},[
  {lab:"READS",t:reads,ta:u[0]},{lab:"WRITES",t:writes,ta:u[1]},{lab:"CALLS",t:calls,ta:u[2],mute:true}],{labW:170,a:o.a,k:o.k});}
// the planning contributor's rights, each with the step that needs it; o.chips [6], o.glow
const RF_RIGHTS=[["read the ticket","draft the change"],["read what the change touches","draft the change"],["write its own branch","draft the change"],
  ["read production, names masked","build it in development"],["write its own development schema","build it in development"],["write one pull request","open a pull request"]];
function rf_rightsCard(x,o){const b=rf_rows(x,720,120,1100,{kick:"Its rights · made from its steps"},RF_RIGHTS.map(([t,ch],i)=>({t,chip:ch,chipA:o.chips?o.chips[i]:1,
    a:o.rows?o.rows[i]:1})),{a:o.a,k:o.k,glow:o.glow||0,glowCol:o.glowCol,edge:o.edge,edgeA:o.edgeA});
  return b;}
scene("steps",(ctx,S,t,sc)=>{const c=sc.cues,FT=t+sc.start,P=rf_once(sc,"P",()=>({pa:wAt(sc,"monday","the planning agent"),map:wAt(sc,"monday","on the map"),
    role:wAt(sc,"monday","planning contributor"),svc:wAt(sc,"service","one service"),seven:wAt(sc,"service","seven steps"),three:wAt(sc,"three","three of them"),
    dft:wAt(sc,"three","draft the change"),bld:wAt(sc,"three","build it"),opn:wAt(sc,"three","open a pull request"),
    reads:wAt(sc,"each","what it reads"),writes:wAt(sc,"each","what it writes"),calls:wAt(sc,"each","which tools"),
    d1:wAt(sc,"draft","it reads"),d2:wAt(sc,"draft","writes on"),b1:wAt(sc,"build","it reads"),b2:wAt(sc,"build","writes its"),
    o1:wAt(sc,"open","it reads"),o2:wAt(sc,"open","writes one"),ex:wAt(sc,"exactly","exactly those"),names:wAt(sc,"exactly","every right names"),
    drawerW:wAt(sc,"like","the drawer"),short:wAt(sc,"short","is short"),mapm:wAt(sc,"short","the map makes"),grants:wAt(sc,"grants","set up its grants"),
    nothing:wAt(sc,"grants","nothing more")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"rfLab",later:true,keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      rf_agent(x,FT,{a:ag_in(tt,c.monday-0.2,0.6),glow:ag_io(tt,P.role,P.role+2,0.4)});ag_roomLight(x,1);
      rf_card(x,720,130,600,"Monday 26 October","A place on the map",null,{kickCol:AG.blue,a:ag_io(tt,P.map,c.service-0.3,0.4),k:ag_spr(tt,P.map)});
      rf_pillL(x,110,470,"planning contributor",{col:AG.blue,a:ag_io(tt,P.role,P.three,0.4)});
      // its work is one service, change a data product: seven steps, from a ticket to production; it does three of them
      rf_card(x,720,130,700,"Its work · one service","Change a data product","seven steps, from a ticket to production",{kickCol:AG.blue,
        a:ag_io(tt,P.svc,c.each-0.3,0.4),k:ag_spr(tt,P.svc)});
      const mine=[0,1,1,1,0,0,0],lit3=i=>Math.max(ag_io(tt,[P.dft,P.bld,P.opn][i-1],c.each,0.4),
        ag_io(tt,[c.draft,c.build,c.open][i-1],[c.build,c.open,c.exactly][i-1]-0.3,0.4),ag_io(tt,P.names+0.5*(i-1),P.names+0.5*(i-1)+1.4,0.4),
        ag_io(tt,P.mapm+0.25*(i-1),P.mapm+1.8,0.4));
      rf_chain(x,{p:[0,1,2,3,4,5,6].map(i=>clamp((tt-P.seven-0.12*i)/0.7,0,1)),col:mine.map(m=>m?AG.blue:null),ek:ag_in(tt,P.three,0.5),lit:mine.map((m,i)=>m?lit3(i):0),
        dim:mine.map(m=>m?0:0.7*ag_in(tt,P.three,0.5)),roles:ag_in(tt,P.seven+1.0,0.5),bracket:ag_in(tt,P.three,0.5)});
      // each step says what it reads, writes and calls: first the card's headings, then each step's own
      const cw=k=>[ag_in(tt,[P.d1,P.b1,P.o1][k],0.4),ag_in(tt,[P.d2,P.b2,P.o2][k],0.4),ag_in(tt,[P.d2+1.0,P.b2+1.2,P.o2+0.8][k],0.4)];
      rf_stepCard(x,"draft the change","the ticket · what the change touches","the change, on its own branch","tickets · docs · catalog · repository · memory · language model",
        cw(0),{a:ag_io(tt,P.reads-0.3,c.build-0.3,0.4),k:ag_spr(tt,P.reads-0.3)});
      rf_stepCard(x,"build it in development","production, names masked","its tests' results, in its own development schema","build · query · language model",
        cw(1),{a:ag_io(tt,c.build+0.2,c.open-0.3,0.4)});
      rf_stepCard(x,"open a pull request","its change and its results","one pull request","repository · language model",cw(2),{a:ag_io(tt,c.open+0.2,c.exactly-0.3,0.4)});
      // its rights are exactly those, each naming the step that needs it; like the drawer; the map makes the list from the steps
      rf_rightsCard(x,{a:ag_in(tt,P.ex,0.4),k:ag_spr(tt,P.ex),chips:[0,1,2,3,4,5].map(i=>ag_in(tt,P.names+0.25*i,0.4)),
        glow:ag_io(tt,P.nothing,P.nothing+2.4,0.5),glowCol:AG.green});
      // like the drawer on the ward: filled from the order, not from the shelf
      rf_frame(x,432,164,238,206,(cc,fx,fy,fw,fh)=>rf_drawerPic(cc,fx,fy,fw,fh),{a:ag_io(tt,P.drawerW-0.2,c.short-0.2,0.5),k:ag_spr(tt,P.drawerW-0.2)});
      rf_pillL(x,110,470,"the map makes it, from the steps",{col:AG.blue,a:ag_io(tt,P.mapm,c.grants-0.3,0.4)});
      rf_pillL(x,110,470,"Sam's grants: this list only",{icon:"tick",col:AG.green,a:ag_in(tt,P.grants,0.4)});
      RF_KICK(x);}}
  ],0.6);});

/* ---------------------------------------------------------------- 4 · What it reads, and in what order */
scene("reads",(ctx,S,t,sc)=>{const c=sc.cues,FT=t+sc.start,P=rf_once(sc,"P",()=>({part:wAt(sc,"part","part of its rights"),order:wAt(sc,"part","the order matters"),gov:wAt(sc,"first","the governed context"),
    m1:wAt(sc,"first","its place on the map"),m2:wAt(sc,"first","the glossary"),m3:wAt(sc,"first","the business and data rules"),m4:wAt(sc,"first","the data's own descriptions"),
    own:wAt(sc,"owner","an owner"),rev:wAt(sc,"owner","through review"),mem:wAt(sc,"second","the team's memory"),learned:wAt(sc,"second","what agents learned"),
    sess:wAt(sc,"second","earlier sessions"),kept:wAt(sc,"second","kept by"),canw:wAt(sc,"wrong","can be wrong"),nobody:wAt(sc,"wrong","nobody checks"),
    dis:wAt(sc,"wins","disagree"),win:wAt(sc,"wins","the definition wins"),rep:wAt(sc,"says","in its report"),ownr:wAt(sc,"says","the definition's owner"),
    orig:wAt(sc,"original","the doctor's own order"),first2:wAt(sc,"original","the original first"),copy2:wAt(sc,"original","a copy only second")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"rfLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      rf_agent(x,FT,{think:ag_io(tt,P.dis,P.win+0.6,0.5)});ag_roomLight(x,1);
      const ok=ag_in(tt,P.win,0.5),dimB=0.5*ag_in(tt,P.win,0.5);
      // what a role reads is part of its rights, and the order matters
      rf_pillL(x,110,470,"what it reads is part of its rights",{col:AG.blue,a:ag_io(tt,P.part,c.second-0.3,0.4)});
      rf_pillL(x,110,548,"and the order matters",{col:AG.blue,a:ag_io(tt,P.order,c.second-0.3,0.4)});
      // first, the governed context, each with an owner, changed only through review
      rf_rows(x,720,120,580,{kick:"1 · Governed context"},[{t:"its place on the map",icon:"dot",a:ag_in(tt,P.m1,0.4)},{t:"the glossary",icon:"dot",a:ag_in(tt,P.m2,0.4)},
        {t:"the business and data rules",icon:"dot",a:ag_in(tt,P.m3,0.4)},{t:"the data's own descriptions",icon:"dot",a:ag_in(tt,P.m4,0.4)}],
        {a:ag_in(tt,P.gov-0.2,0.4),k:ag_spr(tt,P.gov-0.2),edge:ok>0.5?AG.green:AG.blue,edgeA:0.5+0.3*ok,glow:ok*0.7,glowCol:AG.green});
      rf_pillL(x,720,452,"each has an owner",{icon:"tick",col:AG.blue,a:ag_in(tt,P.own,0.4)});
      rf_pillL(x,720,530,"changes only through review",{icon:"tick",col:AG.blue,a:ag_in(tt,P.rev,0.4)});
      // second, the team's memory: it helps, but it can be wrong, and nobody checks every line of it
      withA(x,1-dimB,()=>{rf_rows(x,1330,120,500,{kick:"2 · The team's memory",kickCol:AG.mut},[{t:"what agents learned",mute:true,a:ag_in(tt,P.learned,0.4)},
        {t:"in earlier sessions",mute:true,a:ag_in(tt,P.sess,0.4)},{t:"kept by the platform",mute:true,a:ag_in(tt,P.kept,0.4)}],
        {a:ag_in(tt,P.mem,0.4),k:ag_spr(tt,P.mem),edge:AG.mut,edgeA:0.35});
        rf_pillL(x,1330,410,"can be wrong",{icon:"warn",col:AG.amber,a:ag_in(tt,P.canw,0.4)});
        rf_pillL(x,1330,488,"nobody checks every line",{icon:"warn",col:AG.amber,a:ag_in(tt,P.nobody,0.4)});});
      // when they disagree, the definition wins
      const da=ag_io(tt,P.dis,P.win+0.4,0.3);if(da>0){x.save();x.globalAlpha*=da;x.fillStyle=rgba(AG.amber,0.95);x.beginPath();x.arc(1315,252,22,0,TAU);x.fill();
        x.strokeStyle="#fff";x.lineWidth=3.5;x.lineCap="round";x.beginPath();x.moveTo(1305,246);x.lineTo(1325,246);x.moveTo(1305,258);x.lineTo(1325,258);x.moveTo(1320,240);x.lineTo(1310,264);x.stroke();x.restore();}
      rf_pillL(x,720,608,"the definition wins",{icon:"tick",col:AG.green,a:ag_in(tt,P.win,0.4)});
      // and the agent says so in its report, so the definition's owner sees it
      rf_card(x,110,470,560,"Its report","Memory disagreed with a definition","it used the definition",{kickCol:AG.violet,a:ag_in(tt,P.rep,0.4),k:ag_spr(tt,P.rep)});
      rf_line(x,390,700,390,738,clamp((tt-P.ownr+0.2)/0.4,0,1),AG.blue,{lw:3,head:true});
      rf_pillL(x,110,782,"the definition's owner sees it",{col:AG.blue,a:ag_in(tt,P.ownr,0.4)});
      // like the pharmacist with the doctor's own order: the original first, a copy only second
      rf_frame(x,1310,572,480,240,(cc,fx,fy,fw,fh)=>rf_originalPic(cc,fx,fy,fw,fh),{a:ag_in(tt,P.orig,0.5),k:ag_spr(tt,P.orig)});
      RF_KICK(x);}}
  ],0.6);});

/* ---------------------------------------------------------------- 5 · What's left out, and why */
scene("left",(ctx,S,t,sc)=>{const c=sc.cues,FT=t+sc.start,P=rf_once(sc,"P",()=>({left:wAt(sc,"left","written down"),four:wAt(sc,"four","other four steps"),
    roles:wAt(sc,"four","other roles"),tk:c.ticket,tkw:wAt(sc,"ticket","Clara's"),rv:c.review,rvw:wAt(sc,"review","Jun's"),ap:c.approve,apw:wAt(sc,"approve","Clara's again"),
    rl:c.release,rlw:wAt(sc,"release","Noor's"),wd:wAt(sc,"word","what a word means"),mei:wAt(sc,"word","such as Mei"),gl:wAt(sc,"word","the glossary"),
    n1:wAt(sc,"never","never approves"),n2:wAt(sc,"never","never releases"),n3:wAt(sc,"never","never changes"),n4:wAt(sc,"never","never writes"),
    forbid:wAt(sc,"falls","forbid"),sod:wAt(sc,"falls","separation of duties"),ord:wAt(sc,"ward","one ordered"),chk:wAt(sc,"check","a check fails"),
    fills:wAt(sc,"check","an agent fills")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"rfLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      rf_agent(x,FT,{});ag_roomLight(x,1);
      // the seven steps again: the planning contributor's three in blue, the other four in amber, each with its role and its person
      const others=[0,4,5,6],at=[P.tk,P.rv,P.ap,P.rl],who=[P.tkw,P.rvw,P.apw,P.rlw],ends=[c.review,c.approve,c.release,c.word];
      rf_chain(x,{p:[0,1,2,3,4,5,6].map(i=>clamp((tt-c.left-0.1*i)/0.7,0,1)),col:[AG.amber,AG.blue,AG.blue,AG.blue,AG.amber,AG.amber,AG.amber],
        ek:[0,1,2,3,4,5,6].map(i=>{const k=others.indexOf(i);return k<0?1:ag_in(tt,P.four+0.2*k,0.5);}),
        lit:[0,1,2,3,4,5,6].map(i=>{const k=others.indexOf(i);return k<0?0.3:Math.max(ag_io(tt,P.four+0.2*k,P.four+1.6+0.2*k,0.4),ag_io(tt,at[k],ends[k]-0.2,0.4),ag_io(tt,P.n1,c.falls,0.5),k>0?ag_in(tt,P.chk+0.4,0.5):0);}),
        roles:ag_in(tt,P.roles,0.5),who:[0,1,2,3,4,5,6].map(i=>{const k=others.indexOf(i);return k<0?0:ag_in(tt,who[k],0.4);}),bracket:ag_in(tt,c.left+0.5,0.5)});
      rf_card(x,720,130,620,"What's left out","Written down too, with the reason",null,{kickCol:AG.amber,edge:AG.amber,edgeA:0.5,a:ag_io(tt,P.left,c.word-0.3,0.4),k:ag_spr(tt,P.left)});
      // and what a word means is decided by its owner, such as Mei for the students' words, before it goes into the glossary
      rf_card(x,720,130,700,"What a word means","Decided by its owner","such as Mei, for the students' words, before it goes into the glossary",{kickCol:AG.amber,edge:AG.amber,edgeA:0.5,
        a:ag_io(tt,P.wd,c.never-0.3,0.4),k:ag_spr(tt,P.wd)});
      // so it never approves, releases, changes what a word means, or writes to production
      const nv=[P.n1,P.n2,P.n3,P.n4],ns=["never approves","never releases","never changes what a word means","never writes to production"];
      ns.forEach((s,i)=>rf_pillL(x,720,168+i*80,s,{icon:"lock",col:AG.amber,a:ag_io(tt,nv[i],c.ward-0.3,0.4)}));
      // nobody had to forbid each one: separation of duties falls out of the steps
      rf_card(x,1320,140,520,null,"Separation of duties","falls out of the steps",{edge:AG.green,edgeA:0.6,icon:"tick",a:ag_io(tt,P.sod,c.check-0.3,0.4),k:ag_spr(tt,P.sod)});
      // as on the ward: one ordered, one filled, one gave
      rf_frame(x,720,150,520,280,(cc,fx,fy,fw,fh)=>rf_triadPic(cc,fx,fy,fw,fh),{a:ag_io(tt,P.ord-0.2,c.check-0.3,0.5),k:ag_spr(tt,P.ord-0.2)});
      // and a check fails the map if a step only people do is given to a role an agent fills
      rf_card(x,720,130,1000,"The map's check","A step only people do, given to a role an agent fills",null,{kickCol:AG.blue,edge:AG.amber,edgeA:0.6,
        a:ag_in(tt,P.chk,0.4),k:ag_spr(tt,P.chk)});
      ag_verdict(x,1220,400,"the map fails","fail",ag_in(tt,P.fills+0.3,0.4));
      RF_KICK(x);}}
  ],0.6);});

/* ---------------------------------------------------------------- 6 · When the work changes */
scene("change",(ctx,S,t,sc)=>{const c=sc.cues,FT=t+sc.start,P=rf_once(sc,"P",()=>({follow:wAt(sc,"follow","the rights follow"),q:wAt(sc,"say","answer its questions"),
    neww:wAt(sc,"step","new work"),newstep:wAt(sc,"step","a new step"),saying:wAt(sc,"step","saying what"),noor:wAt(sc,"agree","Noor adds"),
    clara:wAt(sc,"agree","once Clara"),owners:wAt(sc,"agree","the owners"),agreed:wAt(sc,"agree","reads agree"),rights:wAt(sc,"view","its rights follow"),
    lines:wAt(sc,"view","new lines"),tools:wAt(sc,"tools","the tools follow"),byhand:wAt(sc,"tools","a grant by hand"),more:wAt(sc,"asks","needs more"),
    borrow:wAt(sc,"asks","borrow a way in"),stops:wAt(sc,"asks","it stops"),goes:wAt(sc,"goes","a step goes"),go:wAt(sc,"goes","go with it"),
    drift:wAt(sc,"drift","is drift"),next:wAt(sc,"drift","the next film")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"rfLab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>{
      // Noor comes in from the right while the role changes, and leaves when it's done
      const nx=tt<c.asks-0.2?rf_slide(tt,P.noor-0.4,2150,1690,1.3):rf_slide(tt,c.asks-0.2,1690,2150,1.3),na=ag_in(tt,P.noor-0.4,0.5)*(1-ag_in(tt,c.asks+0.4,0.6));
      rf_agent(x,FT,{think:ag_io(tt,P.more,P.stops+0.4,0.5)});if(na>0)rf_who(x,"noor",FT,nx,735,0.7,{a:na,p:{flip:true,gaze:[4,0]}});ag_roomLight(x,1);
      // work changes, and the rights follow it: the work, its steps on the map, its rights, its tools
      rf_flow(x,720,160,[{t:"the work",a:ag_in(tt,c.follow,0.4)},{t:"its steps",a:ag_in(tt,P.follow-0.2,0.4)},{t:"its rights",a:ag_in(tt,P.follow+0.2,0.4)},
        {t:"its tools",a:ag_in(tt,P.follow+0.6,0.4)}]);
      // say Planning wants it to answer its questions too: new work, so first a new step on the map
      rf_rows(x,720,240,700,{kick:"New work",title:"Answer Planning's questions too"},[],{dash:true,a:ag_io(tt,P.q-0.2,P.saying-0.2,0.4),k:ag_spr(tt,P.q-0.2)});
      const gone=ag_in(tt,P.goes,0.6),nr=ag_in(tt,P.newstep,0.4)*(1-gone),solid=ag_in(tt,P.agreed,0.4);
      rf_rows(x,110,440,560,{kick:"Planning contributor"},[{t:"draft the change",icon:"dot"},{t:"build it in development",icon:"dot"},{t:"open a pull request",icon:"dot"},
        {t:"answer a question",icon:"dot",dash:solid<0.5,a:nr,col:solid>0.5?AG.blue:AG.ink}],{a:ag_in(tt,P.newstep-0.4,0.4),k:ag_spr(tt,P.newstep-0.4)});
      rf_rows(x,720,240,1100,{kick:"New step · answer a question"},[{lab:"READS",t:"Planning's question, and the governed context",ta:ag_in(tt,P.saying+0.2,0.4)},
        {lab:"WRITES",t:"an answer, with its evidence",ta:ag_in(tt,P.saying+0.6,0.4)},{lab:"CALLS",t:"docs · catalog · query · language model",mute:true,ta:ag_in(tt,P.saying+1.0,0.4)}],
        {labW:170,dash:solid<0.5,a:ag_io(tt,P.saying,c.view-0.3,0.4)});
      // Noor adds it to the role once Clara and the owners of what it reads agree
      rf_pillL(x,760,600,"Clara agrees",{icon:"tick",col:AG.green,a:ag_io(tt,P.clara,c.tools-0.3,0.4)});
      rf_pillL(x,760,680,"the owners of what it reads agree",{icon:"tick",col:AG.green,a:ag_io(tt,P.owners+0.3,c.tools-0.3,0.4)});
      // then its rights follow: new lines, each with the new step; when the step goes, its rights go with it
      rf_rows(x,720,240,1100,{kick:"Its rights"},[{t:"six rights, from its three steps",mute:true},
        {t:"read Planning's questions",chip:"answer a question",a:ag_in(tt,P.lines,0.4)*(1-gone)},{t:"write its answers",chip:"answer a question",a:ag_in(tt,P.lines+0.4,0.4)*(1-gone)}],
        {a:ag_in(tt,P.rights-0.2,0.4),k:ag_spr(tt,P.rights-0.2)});
      // and the tools follow the rights, never a grant by hand
      rf_pillL(x,760,600,"the tools follow the rights",{icon:"tick",col:AG.blue,a:ag_io(tt,P.tools,c.asks-0.3,0.4)});
      const gh=rf_pillL(x,760,680,"a grant by hand",{icon:"lock",col:AG.amber,a:ag_io(tt,P.byhand,c.asks-0.3,0.4)});rf_strike(x,gh,(tt-P.byhand-0.3)/0.5,ag_io(tt,P.byhand,c.asks-0.3,0.4));
      // until then, a ticket that needs more than its steps give: the agent doesn't borrow a way in; it stops, and asks
      rf_card(x,760,560,760,"A ticket","needs more than its steps give",null,{kickCol:AG.amber,edge:AG.amber,edgeA:0.5,a:ag_io(tt,P.more-0.2,c.drift-0.3,0.4),k:ag_spr(tt,P.more-0.2)});
      const bw=rf_pillL(x,760,766,"borrow a way in",{col:AG.amber,a:ag_io(tt,P.borrow,c.drift-0.3,0.4)});rf_strike(x,bw,(tt-P.borrow-0.3)/0.5,ag_io(tt,P.borrow,c.drift-0.3,0.4));
      rf_pillL(x,bw.x+bw.w+24,766,"it stops, and asks",{icon:"tick",col:AG.green,a:ag_io(tt,P.stops,c.drift-0.3,0.4)});
      // a right given by hand is drift; the next film shows the check that finds it
      rf_pillL(x,760,600,"a right given by hand is drift",{icon:"warn",col:AG.amber,a:ag_in(tt,P.drift-0.2,0.4)});
      rf_pillL(x,760,680,"next film: the check that finds it",{col:AG.mut,a:ag_in(tt,P.next,0.4)});
      RF_KICK(x);}}
  ],0.6);});

/* ---------------------------------------------------------------- 7 · A drawer of its own */
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,FT=t+sc.start,P=rf_once(sc,"P",()=>({one:wAt(sc,"drawer","one day's doses"),order:wAt(sc,"drawer","one order"),
    three:wAt(sc,"here","its three steps"),more:wAt(sc,"here","nothing more"),reason:wAt(sc,"reason","a reason"),prod:wAt(sc,"reason","reaches production"),
    jun:wAt(sc,"jun","Jun's rights"),own:wAt(sc,"jun","his own"),lesson:wAt(sc,"lesson","An agent's rights")}));
  ag_shots(ctx,S,t,sc.dur,[
    // on the ward, each patient's drawer held one day's doses, filled from one order
    {at:0,place:"rfPharm",keys:[[0,1500,520,1.22]],push:0.03,draw:(x,tt)=>{const cl=1-clamp((tt-c.here+1.5)/0.8,0,1);
      rf_cart(x,{open:[3,cl],fill:3,lit:3});
      rf_order(x,1374,232,190,{h:118,r:-0.05,title:"ORDER",seed:3,a:ag_in(tt,P.order-0.3,0.4)});
      rf_scr(x,S,()=>{rf_pillL(x,560,170,"one day's doses",{col:AG.blue,a:ag_in(tt,P.one,0.4)});rf_pillL(x,560,250,"filled from one order",{col:AG.blue,a:ag_in(tt,P.order,0.4)});});}},
    // here, the planning agent holds what its three steps need, and nothing more; every right has a reason anyone can read, and none
    // of them reaches production; and Jun's rights stay his own
    {at:c.here-0.5,place:"rfLab",keys:[[c.here-0.5,960,540,1]],push:0,draw:(x,tt)=>{const out=1-ag_in(tt,c.breath+0.4,0.8);withA(x,out,()=>{
      const jx=rf_slide(tt,P.jun-0.5,2150,1690,1.3),ja=ag_in(tt,P.jun-0.5,0.5);
      rf_agent(x,FT,{});if(ja>0)rf_who(x,"jun",FT,jx,742,0.72,{a:ja,p:{flip:true,gaze:[4,-1]}});ag_roomLight(x,1);
      rf_rightsCard(x,{chips:[0,1,2,3,4,5].map(i=>1),glow:Math.max(ag_io(tt,P.reason,P.reason+1.8,0.4),ag_in(tt,P.lesson,0.6)),glowCol:AG.green,
        edge:tt>P.lesson?AG.green:AG.blue,edgeA:0.6});
      rf_pillL(x,720,566,"none reaches production",{icon:"lock",col:AG.amber,a:ag_in(tt,P.prod,0.4)});
      rf_pillL(x,720,662,"Jun's rights stay his own",{col:AG.blue,a:ag_in(tt,P.own-0.2,0.4)});
      RF_KICK(x);});}}
  ],0.6);
  rf_tags(ctx,S,t,[[0.6,c.here-0.7,RF_TAG_US]]);
  ag_end(ctx,S,t,c.breath,"Rights follow the role","An agent's rights come from its work, not from a person's.","Film 4 of 7","From helper to colleague");});

ag_cutInto(["borrowed","steps","reads","left","change"]);
