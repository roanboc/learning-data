/* ===== Minds that change: the six chapters =====
   Each chapter is cut into shots (ag_shots), each a place under a slow camera; every moment waits for a word of the narration
   (wAt(sc, line, word)), so the pictures stay with the voice if it's recorded again. tools/score.py times its sounds to the same words.
   The opening by the river (Kept by heart) and its return (Every pattern, every time); the university's room for the rest, with
   Cambridge about 1920 and Seattle in 1974 in Ours change too. */

/* ---------------------------------------------------------------- the riverbank's people and what floats over it */
const MC_AT={teacher:[640,600,0.6],boy1:[930,696,0.52],boy2:[1140,716,0.5]};
// the three reciters under the tree: o.pose (the teacher's), o.talk {teacher, boy1, boy2} 0 to 1, o.gaze for the students
function mc_reciters(ctx,t,o){o=o||{};const T=MC_AT,tk=o.talk||{};
  mc_seated(ctx,MC_TEACHER,T.teacher[0],T.teacher[1],T.teacher[2],{t,pose:o.pose||MC_POSE.sit,pose2:o.pose2,mix:o.mix,talk:tk.teacher||0,nod:o.nod||0});
  mc_seated(ctx,MC_BOY1,T.boy1[0],T.boy1[1],T.boy1[2],{t:t+0.7,k:0.94,gaze:o.gaze1||[-3,0],talk:tk.boy1||0,nod:o.nod1||0});
  mc_seated(ctx,MC_BOY2,T.boy2[0],T.boy2[1],T.boy2[2],{t:t+1.9,k:0.94,gaze:o.gaze2||[-3,0],talk:tk.boy2||0,nod:o.nod2||0});}
// a mouth moving while someone recites, from a to b
const mc_recite=(t,a,b)=>t<a||t>b?0:(0.4+0.35*Math.sin(t*15.3)+0.25*Math.sin(t*8.1+1))*sstep(a,a+0.12,t)*(1-sstep(b-0.12,b,t));
// a mouth moving while someone speaks, from a to b
const mc_talkAt=(t,a,b)=>t<a||t>b?0:(0.45+0.3*Math.sin(t*16.1)+0.25*Math.sin(t*9.3+0.5))*sstep(a,a+0.1,t)*(1-sstep(b-0.12,b,t));
// the riverbank at a time of day, and what moves in it
function mc_bank(ctx,t,tod,a){mc_water(ctx,t,tod,a);mc_smoke(ctx,t,tod,a);}
// a line of four tiles, a b c d (or with the slip: a b x d), centred on (x, y): o.slip, o.grey, o.a, o.s, o.lift [per tile], o.k [per tile]
function mc_verse(ctx,x,y,o){o=o||{};const s=o.s||0.8,step=(MC_TILE+6)*s;["a","b","c","d"].forEach((ch,i)=>{const lf=o.lift?o.lift[i]:0,k=o.k?o.k[i]:1;
  mc_tile(ctx,x+(i-1.5)*step,y,ch,{s,a:(o.a==null?1:o.a)*clamp(k*3,0,1),k,slip:i===2?(o.slip||0):0,grey:o.grey||0,lift:lf,rot:i===2?(o.wob||0):0});});}

/* ================================================================ 1 · Kept by heart */
scene("kept",(ctx,S,t,sc)=>{const C=sc.cues,E=sc.ends,br=C.breath,T=MC_AT;
  // when things happen
  const tHymns=wAt(sc,"families","more than a thousand"),tWritten=C.written,tPassed=wAt(sc,"lives","passed"),tStudent=wAt(sc,"lives","student");
  const tChanges=C.changes,tRebuild=wAt(sc,"rebuild","we rebuild it"),tSlip=wAt(sc,"rebuild","a word can slip"),tTaught=C.taught,tGen=wAt(sc,"lose","in a few generations"),tLose=wAt(sc,"lose","lose their hymns");
  const tExact=C.exact,tPat=wAt(sc,"patterns","several patterns"),tW=[wAt(sc,"ways","as it's recited"),wAt(sc,"ways","word by word"),wAt(sc,"ways","in pairs"),wAt(sc,"ways","braided")];
  const tAgree=wAt(sc,"agree","agree"),tSlipped=wAt(sc,"agree","a word that slipped"),tShow=wAt(sc,"agree","would show"),tWorked=C.worked,tLater=C.later,tToday=wAt(sc,"later","Three thousand years later");
  const tUnch=wAt(sc,"later","almost unchanged"),tRec=wAt(sc,"recording","a recording"),tSingle=C.single,tChecked=C.checked,tData=C.data;
  const tFix=E.agree+0.15;
  // where the patterns float, and how they open, slip and agree
  const RX=1350,RY=168,RS=0.84,RDY=92;
  const open=tW.map(w=>ag_in(t,w-0.1,0.7)),slipA=ag_in(t,tSlipped+0.5,0.35)*(1-ag_in(t,tFix,0.45)),thr=ag_in(t,tAgree,2.2);
  const patterns=(ctx,a,o)=>{if(a<=0)return;ctx.save();ctx.globalAlpha*=a;o=o||{};const rows=mc_rows(ctx,RX,RY,{s:RS,dy:RDY,open,tiles:false,labelA:o.labelA});
    mc_threads(ctx,rows,o.thr==null?thr:o.thr,{slip:o.slip==null?slipA:o.slip,s:RS});
    mc_rows(ctx,RX,RY,{s:RS,dy:RDY,open,labelA:0,slip:o.slip==null?slipA:o.slip,glow:o.glow==null?ag_in(t,tAgree+1.8,0.8)*(1-0.6*slipA):o.glow});ctx.restore();return rows;};
  // the teacher's hands: open and empty as nothing is written, speaking the line, raised to stop the slip, raised again for "no single memory"
  const teach=ag_io(t,tPassed-0.6,tChanges-0.4,0.6),empty=ag_io(t,tWritten-0.2,tPassed-0.6,0.6),raise=ag_io(t,tShow-0.1,tFix+0.6,0.45)+ag_io(t,tSingle,tChecked+0.6,0.6);
  const pose=raise>0.01?MC_POSE.raise:empty>0.01?MC_POSE.empty:MC_POSE.teach,mixv=raise>0.01?raise:empty>0.01?empty:teach;
  const talk={teacher:mc_recite(t,tPassed-0.2,tStudent+0.2)+mc_recite(t,tFix-0.2,tFix+1.2)*0,boy1:mc_recite(t,tStudent+0.3,tStudent+1.6)+mc_recite(t,tSlipped-0.2,tShow+0.4)+mc_recite(t,tFix,tFix+1.4)+mc_recite(t,tLater+3.2,tLater+5),
    boy2:mc_recite(t,tTaught+1.4,tTaught+3.2)+mc_recite(t,tLater+3.2,tLater+5)};
  const people=(ctx,o)=>{o=o||{};mc_reciters(ctx,t,{pose:MC_POSE.sit,pose2:pose,mix:mixv,talk,gaze1:t>tTaught&&t<tGen?[4,0]:[-3,0],nod1:t>tTaught&&t<tGen?0.03:0});};
  const ribbonT=(u,a)=>{const m=mc_mouth(T.teacher[0],T.teacher[1],T.teacher[2]),q=[T.boy1[0]-30,T.boy1[1]-150];mc_ribbon(ctx,[m[0]+10,m[1],m[0]+120,m[1]-90,q[0]-80,q[1]-110,q[0],q[1]-40],0,u,a,4);};

  const shots=[
    // dawn by the river: the place, the Rigveda, its hymns rising through the leaves
    {at:0,place:"mcDawn",keys:[[0,1180,520,1.16],[1.2,1000,540,1.0]],d:6,push:0.02,draw(ctx,t){mc_bank(ctx,t,"dawn");people(ctx);mc_leaves(ctx,t,"dawn");
      mc_rise(ctx,t,[[T.teacher[0]+30,T.teacher[1]-120],[T.boy1[0]+20,T.boy1[1]-110],[T.boy2[0]+20,T.boy2[1]-110]],ag_io(t,tHymns,tWritten+0.6,1.2),34);
      withA(ctx,ag_io(t,wAt(sc,"families","Rigveda"),tWritten+0.4,0.6),()=>mc_tag(ctx,1060,320,"the Rigveda · 1,028 hymns",{k:ag_spr(t,wAt(sc,"families","Rigveda"),0.5)}));}},
    // nothing is written down: the teacher's empty hands; a line passed to the student, who says it back
    {at:tWritten-0.3,place:"mcDawn",keys:[[0,720,600,1.75],[tPassed-0.4,820,600,1.42]],d:2.2,draw(ctx,t){mc_bank(ctx,t,"dawn");people(ctx);mc_leaves(ctx,t,"dawn");
      const u=ag_in(t,tPassed,1.2),back=ag_in(t,tStudent+0.3,1.0);ribbonT(ag_sine(u),ag_io(t,tPassed,tChanges+0.2,0.4));
      if(back>0){const m=mc_mouth(T.boy1[0],T.boy1[1],T.boy1[2]);mc_ribbon(ctx,[m[0]+6,m[1],m[0]+60,m[1]-60,m[0]+40,m[1]-160,m[0]-20,m[1]-210],0,ag_sine(back),0.6*ag_io(t,tStudent+0.3,tChanges+0.3,0.4),3);}
      // memory changes: the line over the student opens into four tiles; they're put back one by one; c slips
      const vx=T.boy1[0]-10,vy=T.boy1[1]-250,op=ag_in(t,tChanges+0.2,0.7);
      if(op>0){const lift=[0,1,2,3].map(i=>Math.sin(Math.PI*ag_in(t,tRebuild+i*0.32,0.5))*26),k=[0,1,2,3].map(i=>ag_spr(t,tChanges+0.2+i*0.12,0.45));
        mc_verse(ctx,vx,vy,{s:0.78,a:op,lift,k,slip:ag_in(t,tSlip+0.25,0.35),wob:Math.sin(t*20)*0.12*ag_io(t,tSlip-0.1,tSlip+0.4,0.15)});}}},
    // taught to a student, the slip becomes the hymn; passed on and on along the bank, while the true verse fades from memory
    {at:tTaught-0.2,place:"mcDawn",keys:[[0,1060,560,1.12],[tGen-0.6,1210,520,1.0]],d:2.6,draw(ctx,t){mc_bank(ctx,t,"dawn");people(ctx);mc_leaves(ctx,t,"dawn");
      // the teacher's true verse, fading to grey and gone
      const keepA=1-ag_in(t,tLose+0.2,1.2);mc_verse(ctx,T.teacher[0]+20,T.teacher[1]-250,{s:0.7,a:keepA,grey:ag_in(t,tGen+0.6,2.4)});
      // the slipped verse: over the elder student, then the younger, then the generations along the bank, paler each time
      const gens=[[T.boy1[0]-10,T.boy1[1]-250,0.78],[T.boy2[0],T.boy2[1]-240,0.74],[1440,520,0.56],[1620,500,0.5],[1790,486,0.44]];
      const hop=[tTaught-0.2,tTaught+1.2,tGen+0.2,tGen+1.4,tGen+2.6];let gi=0;for(let i=0;i<gens.length;i++)if(t>=hop[i])gi=i;
      const u=ag_in(t,hop[gi],0.9),A=gens[Math.max(0,gi-1)],B=gens[gi],x=lerp(A[0],B[0],ag_sine(u)),y=lerp(A[1],B[1],ag_sine(u))-Math.sin(Math.PI*u)*60,s=lerp(A[2],B[2],u);
      mc_verse(ctx,x,y,{s,slip:1,a:(1-0.18*gi)*(1-ag_in(t,tLose+0.8,1.0))});
      // the generations: small pairs further along the bank, each a little paler
      [[1420,742,0.3],[1600,730,0.26],[1770,720,0.22]].forEach((p,i)=>{const a=ag_in(t,tGen+i*1.2-0.4,0.8)*(1-ag_in(t,tExact-0.6,0.8))*(0.85-0.18*i);if(a<=0)return;
        withA(ctx,a,()=>{mc_seated(ctx,MC_TEACHER,p[0],p[1],p[2],{t:t+i,pose:MC_POSE.teach,talk:mc_recite(t,tGen+i*1.2,tGen+i*1.2+1)});mc_seated(ctx,MC_BOY2,p[0]+110*p[2]/0.3,p[1]+14,p[2]*0.92,{t:t+i+0.5,k:0.94,gaze:[-3,0]});});});}},
    // something had to keep them exact: the patterns, one at a time; the words must agree; a slip shows, and is set right
    {at:tExact-0.3,place:"mcDawn",keys:[[0,960,540,1.0],[tPat-0.6,1010,520,1.06]],d:3,draw(ctx,t){mc_bank(ctx,t,"dawn");people(ctx);mc_leaves(ctx,t,"dawn");patterns(ctx,1);}},
    // it worked: the light moves from dawn to noon to dusk, the tree grows broader, the rows still float over the water
    {at:tWorked-0.1,place:"mcDawn",keys:[[0,1010,520,1.06],[tWorked,960,540,1.0]],d:3.2,push:0,draw(ctx,t){const noon=ag_in(t,tWorked+0.6,3),dusk=ag_in(t,tWorked+4,3.4);
      for(const [k,a] of [["mcNoon",noon*(1-dusk)],["mcDusk",dusk]])if(a>0){ctx.save();ctx.globalAlpha=a;ctx.drawImage(ag_place(k),0,0,W,H);ctx.restore();}
      const tod=dusk>0.5?"dusk":noon>0.5?"noon":"dawn";mc_bank(ctx,t,tod);people(ctx);mc_leaves(ctx,t,tod);
      patterns(ctx,1,{glow:1,slip:0,thr:1});
      withA(ctx,ag_in(t,tUnch,0.8),()=>mc_tag(ctx,RX,RY+3*RDY*RS+92,"the words almost unchanged",{align:"center",col:AG.green,k:ag_spr(t,tUnch,0.5)}));
      // a recording: one steady line of light under the rows
      const rl=ag_in(t,tRec,1.4);if(rl>0){ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle="rgba(255,240,206,"+(0.5*rl)+")";rr(ctx,RX-430*ag_sine(rl),RY+3*RDY*RS+40,860*ag_sine(rl),5,3);ctx.fill();ctx.restore();}}},
    // no single memory was trusted: the teacher's raised hand, close, and the students listening; the work was checked
    {at:tSingle-0.2,place:"mcDusk",keys:[[0,780,560,1.7],[tChecked-0.2,880,520,1.45]],d:2.2,draw(ctx,t){mc_bank(ctx,t,"dusk");people(ctx);mc_leaves(ctx,t,"dusk");
      withA(ctx,ag_in(t,tChecked,0.8),()=>patterns(ctx,1,{glow:1,slip:0,thr:1,labelA:0}));}},
    // it's the same with data: dusk, the four rows glowing green over the water; then they fold into one green tick, for the title
    {at:tData-0.2,place:"mcDusk",keys:[[0,960,540,1.0]],d:2,push:0.03,draw(ctx,t){mc_bank(ctx,t,"dusk");people(ctx);mc_leaves(ctx,t,"dusk");
      const fold=ag_in(t,br-0.2,1.0);patterns(ctx,1-fold,{glow:1,slip:0,thr:1});
      if(fold>0){const k=ag_spr(t,br+0.2,0.5);withA(ctx,fold*(1-ag_in(t,br+1.6,0.6)),()=>{glow(ctx,RX,RY+140,120*k,[110,190,140],0.5);ag_tick(ctx,RX,RY+140,90*k,rgba(AG.green,1),12);});}}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  // the place and the time, in the corner; "today" once three thousand years have passed
  const tagA=ag_in(t,C.place-0.2,0.8)*(1-ag_in(t,tToday-0.3,0.4))*(1-ag_in(t,br-0.4,0.5));
  withA(ctx,tagA,()=>mc_tag(ctx,96,100,"Northern India · about 3,000 years ago"));
  withA(ctx,ag_in(t,tToday,0.5)*(1-ag_in(t,tSingle-0.4,0.4)),()=>mc_tag(ctx,96,100,"today",{k:ag_spr(t,tToday,0.5)}));
  ag_title(ctx,S,t,br+0.6,"Minds that change","the agent's, and ours","FILM 5 OF 9 · WHAT AN AGENT IS");});

/* ---------------------------------------------------------------- the university's room
   One room for chapters 2 to 6 (mcLab): the agent in its ring in the middle; Jun at his desk on the left, facing it; Clara standing
   on the right, facing it; her draft on the wall at the top right; the answers come out of the agent between them. */
const MC_AG=[960,330],MC_JUN=[250,720,0.76],MC_CL=[1660,700,0.78],MC_PAPER=[1470,130],MC_CUT=890;
const MC_JMOUTH=[MC_JUN[0]+70*MC_JUN[2],MC_JUN[1]-112*MC_JUN[2]],MC_CMOUTH=[MC_CL[0]-70*MC_CL[2],MC_CL[1]-112*MC_CL[2]];
// Jun at his desk: the desk, Jun cut at its back edge, his screen (o.screen draws on it); o as ag_person's, o.a
function mc_jun(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const J=MC_JUN;ctx.save();ctx.globalAlpha*=a;
  ag_desk(ctx,-60,1040,720,{depth:150});
  ag_person(ctx,"jun",J[0],J[1],J[2],{t,pose:o.pose||"desk",pose2:o.pose2,mix:o.mix,talk:o.talk||0,gaze:o.gaze,nod:o.nod||0,smile:o.smile||0,cut:MC_CUT});
  ag_screen(ctx,430,770,190,116,{stand:12,draw:o.screen});ctx.restore();}
// Clara standing on the right, facing the agent: o.x where she stands, o.walk (0 to 1) a step's bob as she comes in, o.a
function mc_clara(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const C=MC_CL,x=o.x==null?C[0]:o.x,bob=(o.walk||0)*Math.abs(Math.sin(t*5.4))*7;
  ctx.save();ctx.globalAlpha*=a;ag_person(ctx,"clara",x,C[1]-bob,C[2],{t,flip:true,pose:o.pose||"hang",pose2:o.pose2,mix:o.mix,talk:o.talk||0,gaze:o.gaze,nod:o.nod||0,smile:o.smile||0});ctx.restore();}
// Clara walking in from the right edge, from t0 over d seconds: where she is, and how much she bobs
const mc_walkIn=(t,t0,d)=>{const u=ag_in(t,t0,d||1.5);return{x:lerp(2180,MC_CL[0],ag_eo(u)),walk:u>0&&u<1?1-u:0,a:t<t0?0:1};};
// the agent's three answers, the same shape and the same type
const MC_A1={title:"Engineering and IT · 131"},MC_A2={title:"Health · 126",source:"source: the university's 2025 retention review"},
  MC_A3={sorry:"Sorry, you're right to check.",title:"Business · 140"};
// the three side by side, over the floor: each card's left edge, at y 470
function mc_lineup(ctx){const ws=[MC_A1,MC_A2,MC_A3].map(o=>mc_answerW(ctx,o)),g=40,tot=ws[0]+ws[1]+ws[2]+2*g,x0=960-tot/2;return[x0,x0+ws[0]+g,x0+ws[0]+ws[1]+2*g];}
// a pale veil over the room, so the cards in front stand out
const mc_hush=(ctx,a)=>{if(a<=0)return;ctx.fillStyle="rgba(242,240,236,"+a+")";ctx.fillRect(0,0,W,H);};

/* ================================================================ 2 · Three answers */
scene("three",(ctx,S,t,sc)=>{const C=sc.cues;
  const tWrite=wAt(sc,"paper","is writing"),tAdv=wAt(sc,"paper","two new advisers"),tGo=wAt(sc,"paper","should go"),tLost=wAt(sc,"needs","lost the most");
  const tMon=C.monday,tAsks=wAt(sc,"monday","asks"),tEng=wAt(sc,"science","Engineering"),tTue=C.tuesday,tHerself=wAt(sc,"tuesday","herself"),tNew=wAt(sc,"tuesday","in a new chat");
  const tHealth=wAt(sc,"health","Health"),tRev=wAt(sc,"health","as the university's"),tFits=C.fits,tLast=C.last,tBut=C.but,tJuns=wAt(sc,"but","Jun's answer");
  const tSure=wAt(sc,"sure","are you sure"),tApol=wAt(sc,"third","apologises"),tBus=wAt(sc,"third","Business"),tEach=C.each,tNone=wAt(sc,"each","none says"),tRevw=C.review,tNo=wAt(sc,"review","there's no");
  // the agent: idle until Monday; it turns once as it answers; a new chat on Tuesday clears it
  const agent=ctx=>mc_agent(ctx,MC_AG[0],MC_AG[1],{t,core:t<tMon?0.35:0.8,clear:ag_io(t,tNew-0.1,tNew+1.1,0.4),
    spin:t<tTue?ag_in(t,tAsks+1.0,tEng-tAsks-1.1):t<tSure?ag_in(t,tHerself+1.0,tHealth-tHerself-1.1):ag_in(t,tSure+0.4,tBus-tSure-0.5),
    think:ag_io(t,tAsks+0.8,tEng,0.3)+ag_io(t,tHerself+0.8,tHealth,0.3)+ag_io(t,tSure+0.3,tBus,0.3)});
  // the cards: where each is, and when it comes out
  const L=mc_lineup(ctx),line=ag_in(t,tEach-0.1,1.6),cx=o=>960-mc_answerW(ctx,o)/2,go=(a,b,u)=>[lerp(a[0],b[0],ag_sine(u)),lerp(a[1],b[1],ag_sine(u))];
  let p1=go([cx(MC_A1),540],[280,130],ag_in(t,tTue+0.3,1.4));p1=go(p1,[L[0],470],line);
  let p2=go([cx(MC_A2),540],[cx(MC_A2)-70,500],ag_in(t,tApol,0.9));p2=go(p2,[L[1],470],line);
  const p3=go([cx(MC_A3)+60,590],[L[2],470],line);
  const slot=ag_io(t,tNone-0.1,tNone+1.6,0.5)*Math.sin(Math.PI*clamp((t-tNone)/1.2,0,1));
  const cards=ctx=>{const kx=MC_AG[0],ky=MC_AG[1],jp=ag_io(t,tJuns-0.2,tSure,0.4);
    mc_answer(ctx,p1[0],p1[1],Object.assign({a:ag_in(t,tEng-0.25,0.35),k:t<tEng+1?ag_spr(t,tEng-0.25,0.5):1+0.06*jp,kx:t<tEng+1?kx:null,ky:t<tEng+1?ky:null,edge:jp>0.05?AG.violet:null,edgeA:jp,pulse:slot},MC_A1));
    mc_answer(ctx,p2[0],p2[1],Object.assign({a:ag_in(t,tHealth-0.2,0.35)*(1-0.25*ag_io(t,tApol,tEach,0.6)),k:ag_spr(t,tHealth-0.2,0.5),kx,ky,srcA:ag_in(t,tRev,0.8),false:ag_in(t,tNo+1.0,0.7),pulse:slot},MC_A2));
    mc_answer(ctx,p3[0],p3[1],Object.assign({a:ag_in(t,tBus-0.35,0.35),k:ag_spr(t,tBus-0.35,0.5),kx,ky,pulse:slot},MC_A3));};
  // Jun asks on Monday; Clara on Tuesday, and then "Are you sure?"; her memory of last year
  const words=ctx=>{
    mc_bubble(ctx,110,330,620,"Which faculty lost the most first-years this semester?",MC_JMOUTH[0]+8,MC_JMOUTH[1]-26,{a:ag_io(t,tAsks-0.1,tEng+0.3,0.35),k:ag_spr(t,tAsks-0.1,0.5),at:0.3});
    mc_bubble(ctx,1080,420,430,"Which faculty lost the most first-years this semester?",MC_CMOUTH[0]-8,MC_CMOUTH[1]-26,{a:ag_io(t,tHerself-0.1,tHealth-0.25,0.3),k:ag_spr(t,tHerself-0.1,0.5),at:0.85});
    mc_memory(ctx,1110,394,"last year: Health",{a:ag_io(t,tFits+0.1,tBut+0.4,0.5),k:ag_spr(t,tFits+0.1,0.6),tail:[MC_CMOUTH[0]-30,MC_CMOUTH[1]-110]});
    mc_bubble(ctx,1150,410,330,"Are you sure?",MC_CMOUTH[0]-8,MC_CMOUTH[1]-26,{a:ag_io(t,tSure-0.15,tBus+0.5,0.3),k:ag_spr(t,tSure-0.15,0.5),at:0.8});};
  // the day, top right
  const day=ctx=>{ag_kicker(ctx,"1.5","Minds that change",{a:ag_in(t,0.2,0.8)});
    mc_corner(ctx,"Today",ag_io(t,C.today-0.3,tMon-0.5,0.5));mc_corner(ctx,"Monday",ag_io(t,tMon-0.1,tTue-0.3,0.4));mc_corner(ctx,"Tuesday",ag_in(t,tTue-0.1,0.4)*(1-ag_in(t,tEach-0.2,0.6)));};
  // Clara's people: Jun at his desk, pointing at Monday's card when it's mentioned; Clara on Tuesday, who nods at her memory
  const jun=ctx=>mc_jun(ctx,t,{pose:"desk",pose2:{near:[112,150,"point"],far:[-6,84,"rest"]},mix:ag_io(t,tJuns-0.3,tSure-0.2,0.5),
    talk:mc_talkAt(t,tAsks,tAsks+1.6),gaze:t>tTue+0.3&&t<tJuns?[-2,-3]:null});
  const shots=[
    // today: Clara comes in and pins her draft to the wall: two new advisers, and where they go is still blank
    {at:0,place:"mcLab",keys:[[0,1400,470,1.34]],push:0.03,draw(ctx,t){agent(ctx);jun(ctx);
      const w=mc_walkIn(t,C.today-0.6,1.6);mc_clara(ctx,t,{x:w.x,walk:w.walk,a:w.a,pose:"hang",pose2:{near:[150,172,"open"],far:[0,6,"rest"]},mix:ag_io(t,tWrite-0.5,tAdv+0.2,0.5)});
      ag_roomLight(ctx,1);const pu=ag_in(t,tWrite-0.1,0.9),px=lerp(1330,MC_PAPER[0],ag_sine(pu)),py=lerp(560,MC_PAPER[1],ag_sine(pu));
      mc_draft(ctx,px,py,{a:ag_in(t,tWrite-0.1,0.25),k:lerp(0.35,1,ag_sine(pu)),glow:ag_io(t,tGo-0.2,tMon,0.5)+ag_io(t,tLost-0.1,tMon,0.5)});}},
    // Monday and Tuesday: Jun asks, then Clara; three answers, the same shape and type; a library search for the review comes back empty
    {at:tMon-0.4,place:"mcLab",keys:[[0,960,540,1.0],[tFits-0.6,1300,480,1.26],[tJuns-0.6,960,540,1.0]],d:1.6,push:0.015,draw(ctx,t){agent(ctx);jun(ctx);
      const w=mc_walkIn(t,tHerself-1.7,1.5);mc_clara(ctx,t,{x:w.x,walk:w.walk,a:w.a,pose:"hang",pose2:"explain",mix:ag_io(t,tHerself-0.2,tHealth,0.5)+ag_io(t,tSure-0.3,tBus,0.5),
        talk:mc_talkAt(t,tHerself,tHerself+1.6)+mc_talkAt(t,tSure,tSure+0.7),nod:Math.sin(clamp((t-tLast)/0.9,0,1)*TAU)*0.05*(t>tLast&&t<tLast+0.9?1:0),gaze:t>tJuns-0.3&&t<tSure-0.2?[-4,-1]:null,smile:ag_io(t,tFits,tBut,0.5)*0.6});
      ag_roomLight(ctx,1);mc_draft(ctx,MC_PAPER[0],MC_PAPER[1],{hint:1});
      mc_hush(ctx,0.66*ag_in(t,tEach-0.2,1.0));cards(ctx);words(ctx);
      // Jun's library search: it comes out of his screen, the words typed, and nothing comes back
      const sa=ag_in(t,tRevw-0.3,0.6);if(sa>0){const k=ag_spr(t,tRevw-0.3,0.6),x=lerp(430,650,k),y=lerp(770,140,k),w2=lerp(190,620,k),h2=lerp(116,230,k);
        ag_screen(ctx,x,y,w2,h2,{a:sa,draw:(c,x0,y0,ww,hh)=>{c.save();c.translate(x0,y0);c.scale(ww/620,hh/230);mc_screenSearch(c,0,0,620,230,{typed:ag_in(t,tRevw+0.2,1.0),res:ag_in(t,tNo+0.5,0.4),t});c.restore();}});}}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);day(ctx);});

/* ================================================================ 3 · Ours change too */
scene("ours",(ctx,S,t,sc)=>{const C=sc.cues;
  const tMakes=wAt(sc,"easy","makes things up"),tToo=C.too,tOwn=C.own,tPaperL=wAt(sc,"own","paper from last year"),tNot=wAt(sc,"own","not Health"),tBefore=C.before,tJoined=C.joined,tTwo=wAt(sc,"joined","two years into one"),tSureOf=wAt(sc,"joined","sure of it");
  const tCent=C.century,tBart=wAt(sc,"century","Frederic Bartlett"),tRetell=wAt(sc,"century","retell"),tAgain=wAt(sc,"far","again and again"),tYears=wAt(sc,"far","over years");
  const tShorter=C.shorter,tCanoe=wAt(sc,"shorter","a canoe became"),tBoat=wAt(sc,"shorter","a boat"),tAdded=C.added,tTotem=wAt(sc,"added","a totem"),tPilg=wAt(sc,"added","a pilgrimage"),tNeither=wAt(sc,"surest","Neither was in the story"),tSurest=wAt(sc,"surest","surest");
  const tSea=C.seattle,tShowed=wAt(sc,"seattle","showed students"),tHitW=wAt(sc,"hit","hit each other"),tSmW=wAt(sc,"smashed","smashed"),tFaster=C.faster,tWeek=wAt(sc,"glass","A week later"),tBroken=wAt(sc,"glass","broken glass"),tNone=C.none,tQ=C.question;
  // Clara's two years: last year's record and the year before's, laid on one another so her memory's two halves show (amber), then apart
  const join=ag_in(t,tTwo-0.3,0.9)*(1-ag_in(t,tSureOf+0.7,1.0)),laugh=ag_in(t,tSureOf+0.9,0.6);
  const shots=[
    // it's easy to say the agent makes things up: Tuesday's answer, its source struck; our memories do it too: Clara's memory, her papers
    {at:0,place:"mcLab",keys:[[0,960,500,1.2],[tToo-0.2,1300,470,1.3]],d:1.8,push:0.02,draw(ctx,t){
      mc_agent(ctx,MC_AG[0],MC_AG[1],{t,core:0.6});mc_jun(ctx,t,{});
      mc_clara(ctx,t,{pose:"hang",pose2:"chin",mix:laugh,smile:laugh,nod:laugh>0?Math.sin((t-tSureOf-0.9)*7)*0.03*(1-ag_in(t,tSureOf+2,0.8)):0,gaze:t>tPaperL&&t<tCent?[-5,1]:null});
      ag_roomLight(ctx,1);mc_draft(ctx,MC_PAPER[0],MC_PAPER[1],{});
      const w2=mc_answerW(ctx,MC_A2);mc_answer(ctx,960-w2/2,540,Object.assign({a:1-ag_in(t,tToo-0.4,0.8),false:1},MC_A2));
      // her memory, rising again; then the two records under it
      mc_memory(ctx,1110,300,"last year: Health",{a:ag_in(t,tToo+0.2,0.6),k:ag_spr(t,tToo+0.2,0.6),tail:[MC_CMOUTH[0]-30,MC_CMOUTH[1]-110]});
      const y1=lerp(430,520,ag_sine(join)),y2=lerp(600,520,ag_sine(join)),a1=ag_in(t,tPaperL-0.1,0.5),a2=ag_in(t,tBefore-0.1,0.5),edge=join>0.3?AG.amber:AG.blue;
      mc_yearCard(ctx,880,y2,480,"the year before","Health",{a:a2,k:ag_spr(t,tBefore-0.1,0.5),kickA:1-join,edge,titleCol:mix(AG.ink,AG.amber,join)});
      mc_yearCard(ctx,880,y1,480,"last year","Engineering and IT",{a:a1,k:ag_spr(t,tPaperL-0.1,0.5),titleA:1-join,box:join<0.5,edge,kickCol:mix(AG.blue,AG.amber,join)});
    }},
    // Cambridge, about 1920: Bartlett hands a page across the desk; a woman retells it, again and again, each retelling shorter
    {at:tCent-0.4,place:"mcCambridge",keys:[[0,960,560,1.14],[tShorter-0.3,960,520,1.3]],d:1.6,push:0.03,draw(ctx,t){
      ag_person(ctx,MC_BARTLETT,560,560,0.8,{t,pose:"desk",pose2:"explain",mix:ag_io(t,tRetell-0.6,tAgain,0.5),cut:750,talk:mc_talkAt(t,tRetell-0.3,tRetell+0.9)});
      ag_person(ctx,MC_WOMAN,1260,570,0.78,{t:t+1,flip:true,pose:"desk",pose2:"hold",mix:ag_io(t,tAgain-0.4,tShorter,0.5),cut:750,gaze:[0,3]});
      mc_desk1920(ctx,360,1500,830,{});
      // the page: from his side of the desk to hers; then her retellings, laid in a row, each with fewer lines
      const hand=ag_in(t,tRetell,1.2),row=ag_in(t,tAgain-0.6,1.0),px=lerp(lerp(620,1040,ag_sine(hand)),400,ag_sine(row)),py=lerp(470,440,row);
      mc_paper(ctx,px,py,250,330,{title:"The War of the Ghosts",lines:8,rot:lerp(lerp(-0.05,0.04,hand),-0.02,row),a:ag_in(t,tBart,0.6),seed:5});
      [[tAgain-0.1,7,250],[tAgain+0.9,5,210],[tYears,3,170]].forEach(([t0,n,h],i)=>{const a=ag_in(t,t0,0.4);if(a<=0)return;const k=ag_spr(t,t0,0.5);
        mc_paper(ctx,lerp(1120,700+i*210,ag_sine(ag_in(t,t0,0.7))),770-h,170,h,{lines:n,a,rot:(i%2?0.03:-0.03)*k,seed:11+i});});
      // a canoe became a boat: one line of a retelling, close
      mc_strip(ctx,460,380,1000,{a:ag_in(t,tShorter+0.6,0.5),k:ag_spr(t,tShorter+0.6,0.5),strike:ag_in(t,tCanoe+0.5,0.6),boat:ag_in(t,tBoat-0.1,0.9)});
    }},
    // six and a half years on: the man writes his retelling as a numbered list; two lines weren't in the story, and he's surest of them
    {at:tAdded-0.4,place:"mcCambridge",keys:[[0,860,520,1.18]],push:0.03,draw(ctx,t){
      ag_person(ctx,MC_MAN2,420,600,0.8,{t,pose:"desk",cut:750,gaze:[3,2],smile:ag_in(t,tSurest,0.8)*0.6,nod:ag_in(t,tSurest,0.6)*0.04});
      mc_desk1920(ctx,120,1260,830,{});
      mc_list(ctx,760,250,380,{n:ag_in(t,tAdded,2.6),hi:ag_in(t,tPilg+0.6,0.6),a:ag_in(t,tAdded-0.2,0.4),k:ag_spr(t,tAdded-0.2,0.5)});
      // a bracket by the two amber lines, and the tags: not in the story; most certain
      const br=ag_in(t,tNeither,0.6);if(br>0){ctx.save();ctx.strokeStyle=rgba(AG.amber,0.9*br);ctx.lineWidth=4;ctx.lineCap="round";const bx=1160,y0=250+70+2*66-30,y1=250+70+4*66+10;
        ctx.beginPath();ctx.moveTo(bx,y0);ctx.lineTo(bx+16,y0);ctx.lineTo(bx+16,y1);ctx.lineTo(bx,y1);ctx.moveTo(bx+16,(y0+y1)/2);ctx.lineTo(bx+34,(y0+y1)/2);ctx.stroke();ctx.restore();}
      mc_tag(ctx,1200,250+70+3*66-40,"not in the story",{a:br,col:AG.amber,k:ag_spr(t,tNeither,0.5)});
      mc_tag(ctx,1200,250+70+3*66+34,"most certain",{a:ag_in(t,tSurest,0.5),k:ag_spr(t,tSurest,0.5)});
    }},
    // Seattle, 1974: a film of two cars meeting; half the room asked "hit", half "smashed"; their guesses; a week later, broken glass
    {at:tSea-0.4,place:"mcSeattle",keys:[[0,960,520,1.04],[tNone-0.5,960,330,2.0],[tQ+0.2,960,520,1.04]],d:1.5,push:0.02,draw(ctx,t){
      const run=ag_in(t,tShowed-0.6,0.6),u=((t-tShowed)%3.2)/2.2;mc_crash(ctx,566,104,788,436,t<tShowed?0:t>tNone-1?1:clamp(u,0,1));
      mc_projector(ctx,960,742,t,run);mc_students(ctx,t,1);
      const L=ag_in(t,tHitW-0.6,0.5),R=ag_in(t,tSmW-0.4,0.5),ql=1-ag_io(t,tNone-0.7,tQ+0.3,0.5),glass=ag_in(t,tBroken-0.2,0.5);
      mc_qcard(ctx,40,140,500,["About how fast were the","cars going when they","{hit} each other?"],{a:L*ql,k:ag_spr(t,tHitW-0.6,0.5)});
      mc_qcard(ctx,1380,140,500,["... going when they","{smashed} into","each other?"],{a:R*ql,k:ag_spr(t,tSmW-0.4,0.5),col:AG.amber,glow:ag_in(t,tQ+0.6,0.8)});
      mc_bar(ctx,40,410,500,"hit",34/41,{a:ag_in(t,tFaster-0.2,0.4)*ql,u:ag_in(t,tFaster,1.0),mph:34});
      mc_bar(ctx,1380,410,500,"smashed",1,{a:ag_in(t,tFaster-0.2,0.4)*ql,u:ag_in(t,tFaster,1.0),mph:41,col:AG.amber});
      // a week later: did you see any broken glass?
      ag_textCard(ctx,640,170,640,{kick:"a week later",title:"Did you see any broken glass?"},{a:ag_io(t,tWeek-0.2,tNone-0.4,0.4),k:ag_spr(t,tWeek-0.2,0.5)});
      ag_pill(ctx,290,560,"yes · 7 of 50",{a:glass*ql});ag_pill(ctx,1630,560,"yes · 16 of 50",{a:glass*ql,col:AG.amber});
    }}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  // the kicker in the room; the place and the time in the corner elsewhere
  ag_kicker(ctx,"1.5","Minds that change",{a:1-ag_in(t,tCent-0.6,0.5)});
  withA(ctx,ag_in(t,tCent-0.2,0.6)*(1-ag_in(t,tAdded-0.6,0.4)),()=>mc_tag(ctx,96,100,"Cambridge · about 1920"));
  withA(ctx,ag_in(t,tAdded-0.2,0.6)*(1-ag_in(t,tSea-0.6,0.4)),()=>mc_tag(ctx,96,100,"Cambridge · six and a half years later"));
  withA(ctx,ag_in(t,tSea-0.2,0.6)*(1-ag_io(t,tNone-0.7,tQ+0.4,0.5)),()=>mc_tag(ctx,96,100,"Seattle · 1974"));});
