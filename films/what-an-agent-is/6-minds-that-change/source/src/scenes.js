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
  // the teacher's hands stay on his knees: his voice, the line of light and the tiles carry the lesson (hands raised in the air read wrong)
  const pose=MC_POSE.sit;
  const talk={teacher:mc_recite(t,tPassed-0.2,tStudent+0.2)+mc_recite(t,tFix-0.2,tFix+1.2)*0,boy1:mc_recite(t,tStudent+0.3,tStudent+1.6)+mc_recite(t,tSlipped-0.2,tShow+0.4)+mc_recite(t,tFix,tFix+1.4)+mc_recite(t,tLater+3.2,tLater+5),
    boy2:mc_recite(t,tTaught+1.4,tTaught+3.2)+mc_recite(t,tLater+3.2,tLater+5)};
  const people=(ctx,o)=>{o=o||{};mc_reciters(ctx,t,{pose,talk,gaze1:t>tTaught&&t<tGen?[4,0]:[-3,0],nod1:t>tTaught&&t<tGen?0.03:0});};
  const ribbonT=(u,a)=>{const m=mc_mouth(T.teacher[0],T.teacher[1],T.teacher[2]),q=[T.boy1[0]-30,T.boy1[1]-150];mc_ribbon(ctx,[m[0]+10,m[1],m[0]+120,m[1]-90,q[0]-80,q[1]-110,q[0],q[1]-40],0,u,a,4);};

  const shots=[
    // dawn by the river: the place, the Rigveda, its hymns rising through the leaves
    {at:0,place:"mcDawn",keys:[[0,1180,520,1.16],[1.2,1000,540,1.0]],d:6,push:0.02,draw(ctx,t){mc_bank(ctx,t,"dawn");people(ctx);mc_leaves(ctx,t,"dawn");
      mc_rise(ctx,t,[[T.teacher[0]+30,T.teacher[1]-120],[T.boy1[0]+20,T.boy1[1]-110],[T.boy2[0]+20,T.boy2[1]-110]],ag_io(t,tHymns,tWritten+0.6,1.2),34);
      withA(ctx,ag_io(t,wAt(sc,"families","Rigveda"),tWritten+0.4,0.6),()=>mc_tag(ctx,1060,320,"the Rigveda · 1,028 hymns",{k:ag_spr(t,wAt(sc,"families","Rigveda"),0.5)}));}},
    // nothing is written down: a line passed from the teacher to the student, who says it back
    {cut:true,at:tWritten-0.3,place:"mcDawn",keys:[[0,720,600,1.75],[tPassed-0.4,820,600,1.42]],d:2.2,draw(ctx,t){mc_bank(ctx,t,"dawn");people(ctx);mc_leaves(ctx,t,"dawn");
      const u=ag_in(t,tPassed,1.2),back=ag_in(t,tStudent+0.3,1.0);ribbonT(ag_sine(u),ag_io(t,tPassed,tChanges+0.2,0.4));
      if(back>0){const m=mc_mouth(T.boy1[0],T.boy1[1],T.boy1[2]);mc_ribbon(ctx,[m[0]+6,m[1],m[0]+60,m[1]-60,m[0]+40,m[1]-160,m[0]-20,m[1]-210],0,ag_sine(back),0.6*ag_io(t,tStudent+0.3,tChanges+0.3,0.4),3);}
      // memory changes: the line over the student opens into four tiles; they're put back one by one; c slips
      const vx=T.boy1[0]-10,vy=T.boy1[1]-250,op=ag_in(t,tChanges+0.2,0.7);
      if(op>0){const lift=[0,1,2,3].map(i=>Math.sin(Math.PI*ag_in(t,tRebuild+i*0.32,0.5))*26),k=[0,1,2,3].map(i=>ag_spr(t,tChanges+0.2+i*0.12,0.45));
        mc_verse(ctx,vx,vy,{s:0.78,a:op,lift,k,slip:ag_in(t,tSlip+0.25,0.35),wob:Math.sin(t*20)*0.12*ag_io(t,tSlip-0.1,tSlip+0.4,0.15)});}}},
    // taught to a student, the slip becomes the hymn; passed on and on along the bank, while the true verse fades from memory
    {cut:true,at:tTaught-0.2,place:"mcDawn",keys:[[0,1060,560,1.12],[tGen-0.6,1210,520,1.0]],d:2.6,draw(ctx,t){mc_bank(ctx,t,"dawn");people(ctx);mc_leaves(ctx,t,"dawn");
      // the teacher's true verse, fading to grey and gone
      const keepA=1-ag_in(t,tLose+0.2,1.2);mc_verse(ctx,T.teacher[0]+20,T.teacher[1]-250,{s:0.7,a:keepA,grey:ag_in(t,tGen+0.6,2.4)});
      // the slipped verse: over the elder student, then the younger, then the generations along the bank, paler each time
      const gens=[[T.boy1[0]-10,T.boy1[1]-250,0.78],[T.boy2[0],T.boy2[1]-240,0.74],[1440,520,0.56],[1620,500,0.5],[1790,486,0.44]];
      const hop=[tTaught-0.2,tTaught+1.2,tGen+0.2,tGen+1.4,tGen+2.6];let gi=0;for(let i=0;i<gens.length;i++)if(t>=hop[i])gi=i;
      const u=ag_in(t,hop[gi],0.9),A=gens[Math.max(0,gi-1)],B=gens[gi],x=lerp(A[0],B[0],ag_sine(u)),y=lerp(A[1],B[1],ag_sine(u))-Math.sin(Math.PI*u)*60,s=lerp(A[2],B[2],u);
      mc_verse(ctx,x,y,{s,slip:1,a:(1-0.18*gi)*(1-ag_in(t,tLose+0.8,1.0))});
      // the generations: small pairs further along the bank, each a little paler
      [[1420,742,0.3],[1600,730,0.26],[1770,720,0.22]].forEach((p,i)=>{const a=ag_in(t,tGen+i*1.2-0.4,0.8)*(1-ag_in(t,tExact-0.6,0.8))*(0.85-0.18*i);if(a<=0)return;
        withA(ctx,a,()=>{mc_seated(ctx,MC_TEACHER,p[0],p[1],p[2],{t:t+i,talk:mc_recite(t,tGen+i*1.2,tGen+i*1.2+1)});mc_seated(ctx,MC_BOY2,p[0]+110*p[2]/0.3,p[1]+14,p[2]*0.92,{t:t+i+0.5,k:0.94,gaze:[-3,0]});});});}},
    // something had to keep them exact: the patterns, one at a time; the words must agree; a slip shows, and is set right
    {push:0,cut:true,at:tExact-0.3,place:"mcDawn",keys:[[0,960,540,1.0],[tPat-0.6,1010,520,1.06]],d:3,draw(ctx,t){mc_bank(ctx,t,"dawn");people(ctx);mc_leaves(ctx,t,"dawn");patterns(ctx,1);}},
    // it worked: the light moves from dawn to noon to dusk, the tree grows broader, the rows still float over the water
    {at:tWorked-0.1,place:"mcDawn",keys:[[0,1010,520,1.06],[tWorked,960,540,1.0]],d:3.2,push:0,draw(ctx,t){const noon=ag_in(t,tWorked+0.6,3),dusk=ag_in(t,tWorked+4,3.4);
      for(const [k,a] of [["mcNoon",noon*(1-dusk)],["mcDusk",dusk]])if(a>0){ctx.save();ctx.globalAlpha=a;ctx.drawImage(ag_place(k),0,0,W,H);ctx.restore();}
      const tod=dusk>0.5?"dusk":noon>0.5?"noon":"dawn";mc_bank(ctx,t,tod);people(ctx);mc_leaves(ctx,t,tod);
      patterns(ctx,1,{glow:1,slip:0,thr:1});
      withA(ctx,ag_in(t,tUnch,0.8),()=>mc_tag(ctx,RX,RY+3*RDY*RS+92,"the words almost unchanged",{align:"center",col:AG.green,k:ag_spr(t,tUnch,0.5)}));
      // a recording: one steady line of light under the rows
      const rl=ag_in(t,tRec,1.4);if(rl>0){ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle="rgba(255,240,206,"+(0.5*rl)+")";rr(ctx,RX-430*ag_sine(rl),RY+3*RDY*RS+40,860*ag_sine(rl),5,3);ctx.fill();ctx.restore();}}},
    // no single memory was trusted: the teacher, close, and the students listening; the work was checked
    {cut:true,at:tSingle-0.2,place:"mcDusk",keys:[[0,780,560,1.7],[tChecked-0.5,960,540,1.0]],d:2.4,push:0,draw(ctx,t){mc_bank(ctx,t,"dusk");people(ctx);mc_leaves(ctx,t,"dusk");
      withA(ctx,ag_in(t,tChecked+0.4,1.0),()=>patterns(ctx,1,{glow:1,slip:0,thr:1}));}},
    // it's the same with data: dusk, the four rows glowing green over the water; then they fold into one green tick, for the title
    {at:tData-0.2,place:"mcDusk",keys:[[0,960,540,1.0]],d:2,push:0.03,draw(ctx,t){mc_bank(ctx,t,"dusk");people(ctx);mc_leaves(ctx,t,"dusk");
      const fold=ag_in(t,br-0.2,1.0);patterns(ctx,1-fold,{glow:1,slip:0,thr:1});
      if(fold>0){const k=ag_spr(t,br+0.2,0.5);withA(ctx,fold*(1-ag_in(t,br+1.6,0.6)),()=>{glow(ctx,RX,RY+140,120*k,[110,190,140],0.5);ag_tick(ctx,RX,RY+140,90*k,rgba(AG.green,1),12);});}}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  // the place and the time, in the corner; "today" once three thousand years have passed
  const tagA=ag_in(t,C.place-0.2,0.8)*(1-ag_in(t,tToday-0.3,0.4))*(1-ag_in(t,br-0.4,0.5));
  withA(ctx,tagA,()=>mc_tag(ctx,96,100,"Northern India · about 3,000 years ago"));
  withA(ctx,ag_in(t,tToday,0.5)*(1-ag_in(t,tSingle-0.4,0.4)),()=>mc_tag(ctx,96,100,"today",{k:ag_spr(t,tToday,0.5)}));
  ag_title(ctx,S,t,br+0.6,"Minds that change","the agent's, and ours","FILM 6 OF 10 · WHAT AN AGENT IS");});

/* ---------------------------------------------------------------- the university's room
   One room for chapters 2 to 6 (mcLab): the agent in its ring in the middle; Jun at his desk on the left, facing it; Clara standing
   on the right, facing it; her draft on the wall at the top right; the answers come out of the agent between them. */
const MC_AG=[960,330],MC_JUN=[250,720,0.76],MC_CL=[1660,700,0.78],MC_PAPER=[1420,130],MC_CUT=890;
// Cambridge: the row of retellings on the desk between Bartlett and the woman: where each page stands (the folk tale first, at s0 of
// its size), how tall each retelling is, its grey lines, and when it comes after "again and again" (the first two) or "over years"
const MC_ROW={x:[600,818,996,1174],base:770,s0:0.76,h:[210,165,120],n:[7,5,3],at:[-0.1,0.5,0.15]};
const MC_JMOUTH=[MC_JUN[0]+70*MC_JUN[2],MC_JUN[1]-112*MC_JUN[2]],MC_CMOUTH=[MC_CL[0]-70*MC_CL[2],MC_CL[1]-112*MC_CL[2]];
// Jun at his desk: the desk, Jun cut at its back edge, his screen (o.screen draws on it); o as ag_person's, o.a, o.dx moves them all
function mc_jun(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const J=MC_JUN;ctx.save();ctx.globalAlpha*=a;if(o.dx)ctx.translate(o.dx,0);
  ag_desk(ctx,-60,1040,720,{depth:150});
  ag_person(ctx,"jun",J[0],J[1],J[2],{t,talk:o.talk||0,gaze:o.gaze,nod:o.nod||0,smile:o.smile||0,cut:MC_CUT});
  ag_screen(ctx,430,770,190,116,{stand:12,draw:o.screen});ctx.restore();}
// Clara standing on the right, facing the agent: o.x where she stands, o.walk (0 to 1) a step's bob as she comes in, o.a; her arms
// stay down
function mc_clara(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const C=MC_CL,x=o.x==null?C[0]:o.x,bob=(o.walk||0)*Math.abs(Math.sin(t*5.4))*7;
  ctx.save();ctx.globalAlpha*=a;ag_person(ctx,"clara",x,C[1]-bob,C[2],{t,flip:true,talk:o.talk||0,gaze:o.gaze,nod:o.nod||0,smile:o.smile||0});ctx.restore();}
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
    think:ag_io(t,tAsks+0.8,tEng,0.3)+ag_io(t,tHerself+0.8,tHealth,0.3)+ag_io(t,tSure+0.3,tBus,0.3),label:null});
  // its name, until the second answer moves up over it
  const agentName=ctx=>ag_T(ctx,"Agent",MC_AG[0],MC_AG[1]+118,{w:700,size:28,align:"center",col:AG.label,a:1-ag_in(t,tApol,0.4)});
  // the cards: where each is, and when it comes out
  const L=mc_lineup(ctx),line=ag_in(t,tEach-0.1,1.6),cx=o=>960-mc_answerW(ctx,o)/2,go=(a,b,u)=>[lerp(a[0],b[0],ag_sine(u)),lerp(a[1],b[1],ag_sine(u))];
  let p1=go([cx(MC_A1),540],[280,130],ag_in(t,tTue+0.3,1.4));p1=go(p1,[L[0],470],line);
  // the second answer moves up and back as the third comes, so the third covers none of its words
  let p2=go([cx(MC_A2),540],[cx(MC_A2)-70,440],ag_in(t,tApol,0.9));p2=go(p2,[L[1],470],line);
  const p3=go([cx(MC_A3)+130,612],[L[2],470],line);
  const slot=ag_io(t,tNone-0.1,tNone+1.6,0.5)*Math.sin(Math.PI*clamp((t-tNone)/1.2,0,1));
  const cards=ctx=>{const kx=MC_AG[0],ky=MC_AG[1],jp=ag_io(t,tJuns-0.2,tSure,0.4);
    mc_answer(ctx,p1[0],p1[1],Object.assign({a:ag_in(t,tEng-0.25,0.35)*(1-0.65*ag_io(t,tFits-0.5,tJuns-0.2,1.0)),k:t<tEng+1?ag_spr(t,tEng-0.25,0.5):1+0.06*jp,kx:t<tEng+1?kx:null,ky:t<tEng+1?ky:null,edge:jp>0.05?AG.violet:null,edgeA:jp,pulse:slot},MC_A1));
    mc_answer(ctx,p2[0],p2[1],Object.assign({a:ag_in(t,tHealth-0.2,0.35)*(1-0.25*ag_io(t,tApol,tEach,0.6)),k:ag_spr(t,tHealth-0.2,0.5),kx,ky,srcA:ag_in(t,tRev,0.8),false:ag_in(t,tNo+1.0,0.7),pulse:slot},MC_A2));
    mc_answer(ctx,p3[0],p3[1],Object.assign({a:ag_in(t,tBus-0.35,0.35),k:ag_spr(t,tBus-0.35,0.5),kx,ky,pulse:slot},MC_A3));};
  // Jun asks on Monday; Clara on Tuesday, and then "Are you sure?"; her memory of last year
  const words=ctx=>{
    mc_bubble(ctx,110,330,620,"Which faculty lost the most first-years this semester?",MC_JMOUTH[0]+8,MC_JMOUTH[1]-26,{a:ag_io(t,tAsks-0.1,tEng+0.3,0.35),k:ag_spr(t,tAsks-0.1,0.5),at:0.3});
    mc_bubble(ctx,1080,420,430,"Which faculty lost the most first-years this semester?",MC_CMOUTH[0]-8,MC_CMOUTH[1]-26,{a:ag_io(t,tHerself-0.1,tHealth-0.25,0.3),k:ag_spr(t,tHerself-0.1,0.5),at:0.85});
    mc_memory(ctx,1110,394,"last year: Health",{a:ag_io(t,tFits+0.1,tBut+0.4,0.5),k:ag_spr(t,tFits+0.1,0.6),tail:[MC_CMOUTH[0]-30,MC_CMOUTH[1]-110]});
    mc_bubble(ctx,1150,410,330,"Are you sure?",MC_CMOUTH[0]-8,MC_CMOUTH[1]-26,{a:ag_io(t,tSure-0.15,tBus+0.5,0.3),k:ag_spr(t,tSure-0.15,0.5),at:0.8});};
  // the day, top right
  const day=ctx=>{ag_kicker(ctx,"1.6","Minds that change",{a:ag_in(t,0.2,0.8)});
    mc_corner(ctx,"Today",ag_io(t,C.today-0.3,tMon-0.5,0.5));mc_corner(ctx,"Monday",ag_io(t,tMon-0.1,tTue-0.3,0.4));mc_corner(ctx,"Tuesday",ag_in(t,tTue-0.1,0.4)*(1-ag_in(t,tEach-0.2,0.6)));};
  // Clara's people: Jun at his desk, who asks on Monday; Clara on Tuesday, who nods at her memory
  const jun=ctx=>mc_jun(ctx,t,{talk:mc_talkAt(t,tAsks,tAsks+1.6),gaze:t>tTue+0.3&&t<tJuns?[-2,-3]:null});
  const shots=[
    // today: Clara comes in and pins her draft to the wall: two new advisers, and where they go is still blank
    {at:0,place:"mcLab",keys:[[0,1400,430,1.34]],push:0.03,draw(ctx,t){agent(ctx);agentName(ctx);jun(ctx);
      const w=mc_walkIn(t,C.today-0.6,1.6);mc_clara(ctx,t,{x:w.x,walk:w.walk,a:w.a});
      ag_roomLight(ctx,1);const pu=ag_in(t,tWrite-0.1,0.9),px=lerp(1330,MC_PAPER[0],ag_sine(pu)),py=lerp(560,MC_PAPER[1],ag_sine(pu));
      mc_deco(pu<0.97,()=>mc_draft(ctx,px,py,{a:ag_in(t,tWrite-0.1,0.25),k:lerp(0.35,1,ag_sine(pu)),glow:ag_io(t,tGo-0.2,tMon,0.5)+ag_io(t,tLost-0.1,tMon,0.5)}));}},
    // Monday and Tuesday: Jun asks, then Clara; three answers, the same shape and type; a library search for the review comes back empty
    {cut:true,at:tMon-0.4,place:"mcLab",keys:[[0,960,540,1.0],[tFits-0.6,1300,480,1.26],[tJuns-0.6,960,540,1.0]],d:1.6,push:0.015,draw(ctx,t){agent(ctx);agentName(ctx);jun(ctx);
      const w=mc_walkIn(t,tHerself-1.7,1.5);mc_clara(ctx,t,{x:w.x,walk:w.walk,a:w.a,
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
  const tShorter=C.shorter,tShortW=wAt(sc,"shorter","shorter"),tWorld=wAt(sc,"shorter","their own world"),tCanoe=wAt(sc,"shorter","a canoe became"),tBoat=wAt(sc,"shorter","a boat"),tAdded=C.added,tTotem=wAt(sc,"added","a totem"),tPilg=wAt(sc,"added","a pilgrimage"),tNeither=wAt(sc,"surest","Neither was in the story"),tSurest=wAt(sc,"surest","surest");
  const tSea=C.seattle,tShowed=wAt(sc,"seattle","showed students"),tHitW=wAt(sc,"hit","hit each other"),tSmW=wAt(sc,"smashed","smashed"),tFaster=C.faster,tWeek=wAt(sc,"glass","A week later"),tBroken=wAt(sc,"glass","broken glass"),tNone=C.none,tQ=C.question;
  // Clara's two years: last year's record and the year before's, laid on one another so her memory's two halves show (amber), then apart
  const join=ag_in(t,tTwo-0.3,0.9)*(1-ag_in(t,tSureOf+0.7,1.0)),laugh=ag_in(t,tSureOf+0.9,0.6);
  const shots=[
    // it's easy to say the agent makes things up: Tuesday's answer, its source struck; our memories do it too: Clara's memory, her papers
    // it opens as Three answers ended (the same camera, Tuesday's answer still in the line), then closes in on it
    {at:0,place:"mcLab",keys:[[0,960,540,1.015],[0.6,960,500,1.2],[tToo-0.2,1300,470,1.3]],d:1.8,push:0.02,draw(ctx,t){
      // no name for the agent here: Three answers ended without it, and last year's record will cover where it goes
      mc_agent(ctx,MC_AG[0],MC_AG[1],{t,core:0.6,label:null});mc_jun(ctx,t,{});
      mc_clara(ctx,t,{smile:laugh,nod:laugh>0?Math.sin((t-tSureOf-0.9)*7)*0.03*(1-ag_in(t,tSureOf+2,0.8)):0,gaze:t>tPaperL&&t<tCent?[-5,1]:null});
      ag_roomLight(ctx,1);mc_draft(ctx,MC_PAPER[0],MC_PAPER[1],{});
      const w2=mc_answerW(ctx,MC_A2),mv=ag_sine(ag_in(t,0.2,1.6));mc_answer(ctx,lerp(mc_lineup(ctx)[1],960-w2/2,mv),lerp(470,540,mv),Object.assign({a:1-ag_in(t,tToo-0.4,0.8),false:1},MC_A2));
      // her memory, rising again; then the two records under it
      mc_memory(ctx,1110,300,"last year: Health",{a:ag_in(t,tToo+0.2,0.6),k:ag_spr(t,tToo+0.2,0.6),tail:[MC_CMOUTH[0]-30,MC_CMOUTH[1]-110]});
      const y1=lerp(430,520,ag_sine(join)),y2=lerp(600,520,ag_sine(join)),a1=ag_in(t,tPaperL-0.1,0.5),a2=ag_in(t,tBefore-0.1,0.5),edge=join>0.3?AG.amber:AG.blue;
      mc_yearCard(ctx,880,y2,480,"the year before","Health",{a:a2,k:ag_spr(t,tBefore-0.1,0.5),kickA:1-join,edge,titleCol:mix(AG.ink,AG.amber,join)});
      mc_yearCard(ctx,880,y1,480,"last year","Engineering and IT",{a:a1,k:ag_spr(t,tPaperL-0.1,0.5),titleA:1-join,box:join<0.5,edge,kickCol:mix(AG.blue,AG.amber,join)});
    }},
    // Cambridge, about 1920: Bartlett hands a page across the desk; she retells it, again and again: her retellings stand in a row
    // between them, each shorter (a dashed amber line falls along their tops); then one line of the last, close: a canoe became a boat
    {at:tCent-0.4,place:"mcCambridge",keys:[[0,960,560,1.14],[tShorter-0.3,960,520,1.2]],d:1.6,push:0.03,draw(ctx,t){
      ag_person(ctx,MC_BARTLETT,430,560,0.8,{t,cut:750,talk:mc_talkAt(t,tRetell-0.3,tRetell+0.9)});
      ag_person(ctx,MC_WOMAN,1490,570,0.78,{t:t+1,flip:true,cut:750,gaze:[0,3]});
      mc_desk1920(ctx,220,1700,830,{});
      const X=MC_ROW.x,B=MC_ROW.base,hand=ag_in(t,tRetell,1.2),row=ag_sine(ag_in(t,tAgain-0.6,1.0)),s0=lerp(1,MC_ROW.s0,row);
      // the folk tale's page: from his side of the desk to hers, then back to the head of the row, smaller
      withA(ctx,ag_in(t,tBart,0.6),()=>{ctx.save();ctx.translate(lerp(lerp(540,1110,ag_sine(hand)),X[0],row),B-330*s0);ctx.scale(s0,s0);
        mc_paper(ctx,0,0,250,330,{title:"The War of the Ghosts",lines:8,rot:lerp(lerp(-0.05,0.04,hand),-0.02,row),seed:5});ctx.restore();});
      // her retellings, each from her side of the desk to its place; the last one's first line ringed once it shows up close
      const ring=ag_in(t,tWorld-0.5,0.4);
      MC_ROW.at.forEach((d,i)=>{const t0=(i<2?tAgain:tYears)+d,a=ag_in(t,t0,0.4);if(a<=0)return;const k=ag_spr(t,t0,0.5),h=MC_ROW.h[i];
        mc_paper(ctx,lerp(1300,X[i+1],ag_sine(ag_in(t,t0,0.7))),B-h,150,h,{lines:MC_ROW.n[i],a,rot:(i%2?0.03:-0.03)*k,seed:11+i,
          draw:i===2&&ring>0?(c,w)=>{c.save();c.globalAlpha*=ring;c.strokeStyle=rgba(AG.amber,0.9);c.lineWidth=3;rr(c,18,62,w-36,28,9);c.stroke();c.restore();}:null});});
      // shorter: a dashed amber line falls along the tops, from the folk tale to the last retelling
      const fall=ag_in(t,tShortW-0.3,0.9);if(fall>0){const x0=X[0]+95,y0=B-330*MC_ROW.s0-24,x1=X[3]+75,y1=B-MC_ROW.h[2]-24,u=ag_sine(fall),xe=lerp(x0,x1,u),ye=lerp(y0,y1,u),an=Math.atan2(y1-y0,x1-x0);
        // drawn twice, a pale halo under the amber, so it shows on the dark panelling
        ctx.save();ctx.globalAlpha*=1-0.45*ag_in(t,tWorld,0.6);ctx.lineCap="round";ctx.lineJoin="round";
        for(const [col,lw,dash] of [["rgba(252,246,234,0.5)",8,[]],[rgba(AG.amber,0.95),3.5,[10,9]]]){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);
          if(u>0.12){ctx.save();ctx.globalAlpha*=clamp((u-0.12)/0.15,0,1);ctx.beginPath();ctx.moveTo(xe-16*Math.cos(an-0.5),ye-16*Math.sin(an-0.5));ctx.lineTo(xe,ye);ctx.lineTo(xe-16*Math.cos(an+0.5),ye-16*Math.sin(an+0.5));ctx.stroke();ctx.restore();}}ctx.restore();}
      // the ringed line, close: it rises out of the last retelling to the wall between them, as wide as the row
      const up=ag_in(t,tWorld-0.15,0.7);if(up>0){const u=ag_eo(up),cx=lerp(X[3]+75,962,u),cy=lerp(B-MC_ROW.h[2]+76,290,u),zs=lerp(0.12,1,u);
        mc_deco(up<0.97,()=>{ctx.save();ctx.translate(cx,cy);ctx.scale(zs,zs);ctx.translate(-962,-290);
          mc_strip(ctx,602,190,720,{a:ag_in(t,tWorld-0.15,0.25),strike:ag_in(t,tCanoe+0.5,0.6),boat:ag_in(t,tBoat-0.1,0.9)});ctx.restore();});}
    }},
    // six and a half years on: the man writes his retelling as a numbered list; two lines weren't in the story, and he's surest of them
    {cut:true,at:tAdded-0.4,place:"mcCambridge",keys:[[0,860,520,1.18]],push:0.03,draw(ctx,t){
      ag_person(ctx,MC_MAN2,420,560,0.8,{t,cut:750,gaze:[3,2],smile:ag_in(t,tSurest,0.8)*0.6,nod:ag_in(t,tSurest,0.6)*0.04});
      mc_desk1920(ctx,120,1260,830,{});
      // his list stands on the desk (its foot at the row's base, as the retellings did)
      const LY=MC_ROW.base-470;
      mc_list(ctx,760,LY,380,{n:ag_in(t,tAdded,2.6),hi:ag_in(t,tPilg+0.6,0.6),a:ag_in(t,tAdded-0.2,0.4),k:ag_spr(t,tAdded-0.2,0.5)});
      // a bracket by the two amber lines, and the tags: not in the story; most certain
      const br=ag_in(t,tNeither,0.6);if(br>0){ctx.save();ctx.strokeStyle=rgba(AG.amber,0.9*br);ctx.lineWidth=4;ctx.lineCap="round";const bx=1160,y0=LY+70+2*66-30,y1=LY+70+4*66+10;
        ctx.beginPath();ctx.moveTo(bx,y0);ctx.lineTo(bx+16,y0);ctx.lineTo(bx+16,y1);ctx.lineTo(bx,y1);ctx.moveTo(bx+16,(y0+y1)/2);ctx.lineTo(bx+34,(y0+y1)/2);ctx.stroke();ctx.restore();}
      mc_tag(ctx,1200,LY+70+3*66-40,"not in the story",{a:br,col:AG.amber,k:ag_spr(t,tNeither,0.5)});
      mc_tag(ctx,1200,LY+70+3*66+34,"most certain",{a:ag_in(t,tSurest,0.5),k:ag_spr(t,tSurest,0.5)});
    }},
    // Seattle, 1974: a film of two cars meeting; half the room asked "hit", half "smashed"; their guesses; a week later, broken glass
    {at:tSea-0.4,place:"mcSeattle",keys:[[0,960,520,1.04],[tNone-0.5,960,330,2.0],[tQ+0.2,960,520,1.04]],d:1.5,push:0.02,draw(ctx,t){
      const run=ag_in(t,tShowed-0.6,0.6),u=((t-tShowed)%3.2)/2.2;mc_crash(ctx,566,104,788,436,t<tShowed?0:t>tNone-1?1:clamp(u,0,1));
      mc_projector(ctx,960,742,t,run);mc_students(ctx,t,1);
      const L=ag_in(t,tHitW-0.6,0.5),R=ag_in(t,tSmW-0.4,0.5),ql=1-ag_io(t,tNone-0.7,tQ+1.1,0.5),glass=ag_in(t,tBroken-0.2,0.5);
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
  ag_kicker(ctx,"1.6","Minds that change",{a:1-ag_in(t,tCent-0.6,0.5)});
  withA(ctx,ag_in(t,tCent-0.2,0.6)*(1-ag_in(t,tAdded-0.6,0.4)),()=>mc_tag(ctx,96,100,"Cambridge · about 1920"));
  withA(ctx,ag_in(t,tAdded-0.2,0.6)*(1-ag_in(t,tSea-0.6,0.4)),()=>mc_tag(ctx,96,100,"Cambridge · six and a half years later"));
  withA(ctx,ag_in(t,tSea-0.2,0.6)*(1-ag_io(t,tNone-0.7,tQ+0.4,0.5)),()=>mc_tag(ctx,96,100,"Seattle · 1974"));});

/* ================================================================ 4 · Rebuilt, not replayed */
// the agent's two answers to one question, word by word: each word taken from a small stack of likely ones, the top one
const MC_LINE1=[["Health","Business","Engineering"],["lost","had","kept"],["the","its","a"],["most","more","fewest"]],
  MC_LINE2=[["Engineering and IT","Health","Business"],["lost","had","saw"],["the","its","a"],["most","more","fewest"]],
  MC_GAP=[["university's 2025 retention review","data platform's","student system's"]];
const MC_Q="Which faculty lost the most first-years this semester?";
// a line of words at (x, y), each taken from its stack at ts[i]; returns where the line ends
function mc_written(ctx,x,y,line,ts,t,o){o=o||{};let xx=x;line.forEach((st,i)=>{mc_pick(ctx,xx,y,st,t,ts[i],o);xx+=ag_tw(ctx,st[0],{w:700,size:34})+22;});return xx;}
scene("rebuilt",(ctx,S,t,sc)=>{const C=sc.cues;
  const tFew=wAt(sc,"details","a few details"),tFill=wAt(sc,"details","fill the rest"),tModel=C.model,tOne=wAt(sc,"writes","one at a time"),tNewc=wAt(sc,"again","in a new chat"),tRoute=wAt(sc,"again","another route");
  const tNeither=wAt(sc,"gap","Where neither knows"),tLikely=wAt(sc,"gap","something likely"),tSure=wAt(sc,"gap","as sure as a fact"),tBend=C.bend,tStudy=C.study,tAsked=wAt(sc,"study","are you sure"),tHalf=wAt(sc,"study","almost half");
  const tLying=C.lying,tTrouble=C.trouble,tReason=wAt(sc,"reason","the reason");
  // the head on the left; the agent up on the right, and under it the page it writes on: one line, and a second for the gap
  const HX=420,HY=470,AX=1500,AY=226,PX=900,PW=880,LX=PX+56,LY=598,LY2=788,PY=LY-190;
  const ts1=[0,1,2,3].map(i=>tOne-0.1+i*0.75),ts2=[0,1,2,3].map(i=>tRoute-0.2+i*0.75),tsG=[tLikely+0.2];
  // the question, as it's given: a bubble that goes into the ring, once, and again in the new chat
  const qs=[[tModel+0.6,tOne-1.3],[tNewc+0.15,tRoute-0.75]];
  const shots=[{at:0,place:"mcLab",keys:[[0,520,470,1.42],[tModel-0.5,960,500,1.0],[tReason-0.8,960,540,1.0]],d:2.2,push:0.015,draw(ctx,t){
    const page=ag_in(t,tOne-1.0,0.5)*(1-ag_in(t,tBend-0.4,0.6)),grow=ag_sine(ag_in(t,tNeither-0.3,0.6));
    // the agent: answers once; a new chat empties it, and the second time its light goes round the other way
    const home=ag_sine(ag_in(t,tTrouble,1.6));  // as the three answers come back, the agent goes back to its place in the room
    mc_agent(ctx,lerp(AX,MC_AG[0],home),lerp(AY,MC_AG[1],home),{t,a:ag_in(t,tModel-0.4,0.8),core:0.7,clear:ag_io(t,tNewc-0.1,tNewc+0.9,0.3),
      think:ag_io(t,tOne-0.5,ts1[3]+0.4,0.3)+ag_io(t,tRoute-0.4,ts2[3]+0.4,0.3)+ag_io(t,tLikely-0.2,tsG[0]+0.5,0.3),
      spin:t<tNewc?ag_in(t,tOne-0.6,3.2):ag_in(t,tRoute-0.5,2.8),dir:t<tNewc?1:-1});
    ag_roomLight(ctx,1);
    // a head of light: a few details, the rest filled in; a gap, filled with something likely, as bright as the rest; it leans to the question too
    const sure=ag_in(t,tSure,0.8),lean=ag_in(t,tBend+0.5,0.6)*(1-ag_in(t,tLying-0.6,1.0));
    ctx.save();ctx.translate(HX,HY+230);ctx.rotate(0.05*ag_sine(lean));ctx.translate(-HX,-(HY+230));
    mc_head(ctx,HX,HY,0.95,{a:ag_in(t,0.4,1.0)*(1-0.75*ag_in(t,tTrouble-0.4,1.2)),pts:ag_in(t,tFew-0.1,1.4),fill:ag_in(t,tFill,2.4),gap:ag_in(t,tNeither,0.8),likely:ag_in(t,tLikely+0.2,1.0),sure});
    ctx.restore();
    // the page the agent writes on
    if(page>0){withA(ctx,page,()=>{ag_box(ctx,PX,PY,PW,lerp(LY+58,LY2+58,grow)-PY,26,{});
      // the first line; in a new chat it goes, and another comes; then a gap after "as the", filled with something likely
      const l1=1-ag_in(t,tNewc-0.2,0.5);if(l1>0)withA(ctx,l1,()=>mc_written(ctx,LX,LY,MC_LINE1,ts1,t));
      if(t>tNewc){mc_written(ctx,LX,LY,MC_LINE2,ts2,t);
        const g=ag_in(t,tNeither,0.5);if(g>0)withA(ctx,g,()=>{ag_T(ctx,"as the",LX,LY2,{w:700,size:34,col:AG.violet});
          const bx=LX+ag_tw(ctx,"as the",{w:700,size:34})+22,fl=ag_in(t,tsG[0],0.3);
          if(fl<1){ctx.save();ctx.globalAlpha*=1-fl;ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(AG.mut,0.75);ctx.lineWidth=2.4;rr(ctx,bx-14,LY2-33,330,46,12);ctx.stroke();ctx.restore();}
          mc_written(ctx,bx,LY2,MC_GAP,tsG,t,{a:lerp(0.6,1,sure)});});}});}
    // the question goes in
    qs.forEach(([q0,q1])=>{const a=ag_in(t,q0,0.35)*(1-ag_in(t,q1,0.45));if(a<=0)return;const g=ag_sine(ag_in(t,q1,0.45)),px=AX-160,py=AY;
      ctx.save();ag_about(ctx,px,py,1-0.5*g);mc_bubble(ctx,690,AY-70,600,MC_Q,px,py,{a,k:ag_spr(t,q0,0.5),side:"right",at:0.5});ctx.restore();});
    // both bend to the question: "Are you sure?" leans on an answer until it turns over
    const ca=ag_io(t,tBend-0.3,tLying-0.2,0.5),bub=ag_io(t,tBend+0.1,tAsked+0.6,0.4),push=ag_in(t,tBend+0.5,0.6),turn=ag_in(t,tBend+1.0,0.9);
    if(ca>0){const w=Math.max(mc_answerW(ctx,MC_A1),mc_answerW(ctx,MC_A3)),x0=AX-w/2,y0=470;
      ctx.save();ctx.translate(x0,y0+60);ctx.rotate(0.035*push*(1-turn));ctx.translate(-x0,-(y0+60));
      mc_answer(ctx,x0,y0,Object.assign({a:ca,w,turn,back:MC_A3},MC_A1));ctx.restore();
      mc_bubble(ctx,x0-350+24*push*(1-turn),y0+10,320,"Are you sure?",x0+12,y0+60,{a:bub,k:ag_spr(t,tBend+0.1,0.5),side:"right",at:0.5});}
    // the 2023 study
    ag_textCard(ctx,690,110,560,{kick:"2023 study",title:"asked “Are you sure?”",sub:"answers changed 46% of the time"},{a:ag_io(t,tStudy+0.2,tLying,0.5),k:ag_spr(t,tStudy+0.2,0.5),edge:AG.blue,kickCol:AG.blue});
    // a change we can't see the reason for: the three answers again, their slots empty, pulsing once
    const ra=ag_in(t,tTrouble+0.6,0.8),L=mc_lineup(ctx),pl=Math.sin(Math.PI*clamp((t-tReason)/1.4,0,1));
    [MC_A1,MC_A2,MC_A3].forEach((o,i)=>mc_answer(ctx,L[i],600,Object.assign({a:ra,k:ag_spr(t,tTrouble+0.6+i*0.15,0.5),pulse:pl,false:i===1?1:0},o)));}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);ag_kicker(ctx,"1.6","Minds that change",{a:ag_in(t,0.3,0.8)});});

/* ================================================================ 5 · Check the work */
// the two routes to the number, read only, either side of the agent; Jun and Clara a little further out, to leave them room
const MC_R1=[290,530,520],MC_R2=[1110,530,520],MC_JDX=-60,MC_CX=1760,MC_CY=738,MC_VY=595,MC_REC=[120,150,560],MC_ANX=1140,MC_ANY=128;
scene("check",(ctx,S,t,sc)=>{const C=sc.cues;
  const tInstead=C.instead,tCame=wAt(sc,"shows","where it came from"),tQuery=wAt(sc,"shows","the query"),tRows=wAt(sc,"shows","the rows"),tLYP=wAt(sc,"shows","last year's paper");
  const tSecond=wAt(sc,"second","a second way"),tPat=wAt(sc,"second","reciters' patterns"),tPlat=wAt(sc,"counts","data platform"),tSys=wAt(sc,"counts","student system");
  const t134=wAt(sc,"disagree","a hundred and thirty-four"),t131=wAt(sc,"disagree","a hundred and thirty-one"),tTwice=wAt(sc,"twice","counted twice"),tSays=wAt(sc,"says","says so");
  const tFixed=wAt(sc,"fixed","fixed"),tBoth=wAt(sc,"fixed","both say"),tChanges=wAt(sc,"fixed","changes its answer"),tReasonW=wAt(sc,"fixed","with the reason"),tJob=C.job;
  const tMon=C.monday,tWithout=wAt(sc,"monday","without its evidence"),tPlain=wAt(sc,"nightly","A plain check"),tNight=wAt(sc,"nightly","every night");
  const tDown=wAt(sc,"written","written down"),tTeam=wAt(sc,"written","the whole team"),tNext=wAt(sc,"written","the next chat"),tApp=wAt(sc,"person","a person approves"),tReads=wAt(sc,"person","reads the evidence"),tSigns=wAt(sc,"person","signs");
  const tNever=C.never,tSem=C.next,tStart=wAt(sc,"next","start in");
  // the answer as the agent first gives it (from the platform alone), then "the two ways disagree", then the checked answer, with its reason
  const ANS0={kick:"answer",title:"Engineering and IT · 134"},ANSD={kick:"answer",title:"the two ways disagree",why:"3 students counted twice",whyCol:AG.amber},
    ANSF={kick:"checked two ways",title:"Engineering and IT · 131",why:"reason: 3 students counted twice",whyCol:AG.ink};
  const people=(ctx,o)=>{o=o||{};mc_jun(ctx,t,{dx:MC_JDX,talk:0,a:o.ja});
    mc_clara(ctx,t,{x:MC_CX,gaze:o.cg,smile:ag_in(t,tStart,0.8)*0.7,a:o.ca});};
  const agent=(ctx,o)=>{o=o||{};mc_agent(ctx,MC_AG[0],MC_AG[1],{t,core:lerp(0.8,0.4,ag_in(t,tNever,1.0)),think:o.think||0,spin:o.spin,clear:o.clear||0});};
  // the routes, the hands reaching to them, the counts and the verdict
  const routes=(ctx,a)=>{if(a<=0)return;const r1=ag_in(t,tSecond-0.2,0.6),r2=ag_in(t,tSecond+0.3,0.6),u1=ag_in(t,tPlat-0.5,1.0),u2=ag_in(t,tSys-0.5,1.0);
    withA(ctx,a,()=>{
      ag_reach(ctx,[930,380,880,470,840,520,MC_R1[0]+MC_R1[2]-40,MC_R1[1]+6],u1,{data:ag_in(t,tPlat+0.5,1.6)});
      ag_reach(ctx,[990,380,1040,470,1080,520,MC_R2[0]+40,MC_R2[1]+6],u2,{data:ag_in(t,tSys+0.5,1.6)});
      ag_tool(ctx,MC_R1[0],MC_R1[1],MC_R1[2],130,"the data platform's enrolments",{a:r1,touch:ag_in(t,tPlat+0.2,0.4)});
      ag_tool(ctx,MC_R2[0],MC_R2[1],MC_R2[2],130,"the student system's report",{a:r2,touch:ag_in(t,tSys+0.2,0.4)});
      const fx=ag_in(t,tBoth-0.3,0.6),c1=MC_R1[0]+MC_R1[2]/2,c2=MC_R2[0]+MC_R2[2]/2;
      mc_count(ctx,c1,MC_CY,"134",{a:ag_in(t,t134-0.1,0.4)*(1-fx),k:ag_spr(t,t134-0.1,0.5),col:AG.amber});
      mc_count(ctx,c1,MC_CY,"131",{a:fx,k:ag_spr(t,tBoth-0.3,0.5),col:AG.green});
      mc_count(ctx,c2,MC_CY,"131",{a:ag_in(t,t131-0.1,0.4),k:ag_spr(t,t131-0.1,0.5),col:mix(AG.amber,AG.green,fx)});
      ag_verdict(ctx,960,MC_VY,"3 apart","fail",ag_in(t,t131+0.6,0.4)*(1-fx));ag_verdict(ctx,960,MC_VY,"agrees two ways","pass",ag_in(t,tBoth+0.4,0.5));});};
  const shots=[
    // nobody is blamed: the three answers go to the wall; the team checks the work instead; every answer shows where it came from
    {at:0,place:"mcLab",keys:[[0,960,540,1.015]],push:0.02,draw(ctx,t){agent(ctx,{think:ag_io(t,tCame-0.8,tQuery,0.3),spin:ag_in(t,tCame-0.9,1.0)});people(ctx);ag_roomLight(ctx,1);
      const aside=ag_sine(ag_in(t,C.blamed+0.2,1.6)),L=mc_lineup(ctx);
      [MC_A1,MC_A2,MC_A3].forEach((o,i)=>{const x=lerp(L[i],120+i*70,aside),y=lerp(600,150+i*48,aside),k=lerp(1,0.66,aside);ctx.save();ctx.translate(x,y);ctx.scale(k,k);
        mc_deco(aside>0,()=>mc_answer(ctx,0,0,Object.assign({a:lerp(1,0.2,aside)*(1-ag_in(t,tCame-0.6,0.5)),false:i===1?1:0},o)));ctx.restore();});
      const w=mc_answerW(ctx,ANS0);mc_answer(ctx,960-w/2,520,Object.assign({a:ag_in(t,tCame,0.35),k:ag_spr(t,tCame,0.5),kx:MC_AG[0],ky:MC_AG[1],fill:ag_in(t,tQuery-0.2,(tRows-tQuery)+1.0)},ANS0));
      // or last year's paper: Clara's, signed
      mc_paper(ctx,1300,160,440,250,{kick:"Planning · last year",title:"First-years who left",sub:"Engineering and IT · signed",lines:1,a:ag_in(t,tLYP-0.1,0.4),rot:0.02*ag_spr(t,tLYP-0.1,0.5),seed:9});}},
    // a second way: the platform's enrolments and the student system's report, read only; they disagree; three counted twice; fixed
    {cut:true,at:tSecond-0.4,place:"mcLab",keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){
      agent(ctx,{think:ag_io(t,tPlat-0.6,t131,0.4)+ag_io(t,tSays-0.4,tSays+0.8,0.3)+ag_io(t,tChanges-0.4,tChanges+0.8,0.3),spin:t<tChanges-1?ag_in(t,tPlat-0.6,1.6):ag_in(t,tChanges-0.6,1.0)});
      people(ctx,{cg:[-3,0]});ag_roomLight(ctx,1);
      // the reciters' patterns, faint, behind the two routes for a moment
      withA(ctx,0.34*ag_io(t,tPat-0.2,tPlat-0.4,0.6),()=>mc_rows(ctx,360,176,{s:0.56,dy:96,glow:1,labelA:0}));
      routes(ctx,1);
      // counted twice: the platform's rows open over its card, three pairs lit; struck out once it's fixed
      const ro=ag_io(t,tTwice-0.5,tMon-0.6,0.6);mc_rows2(ctx,MC_R1[0]+40,150,420,{a:ro,hi:ag_in(t,tTwice,0.6),fixed:ag_in(t,tFixed,0.9)});
      withA(ctx,ro*ag_in(t,tTwice+0.2,0.5)*(1-ag_in(t,tFixed+0.6,0.5)),()=>mc_tag(ctx,MC_R1[0]+40-16,326,"counted twice",{align:"right",col:AG.amber}));
      // the agent says so, rather than picking one; once fixed, its answer changes, with the reason
      const ans=ag_in(t,tSays-0.3,0.4),tn=ag_in(t,tChanges-0.2,0.9),wd=Math.max(mc_answerW(ctx,ANSD),mc_answerW(ctx,ANSF)),fl=ag_in(t,tReasonW,1.2);
      mc_answer(ctx,MC_ANX,MC_ANY,Object.assign({a:ans,k:ag_spr(t,tSays-0.3,0.5),kx:MC_AG[0],ky:MC_AG[1],w:wd,turn:tn,back:Object.assign({fill:fl},ANSF),edge:tn>0.5?AG.green:null,edgeA:ag_in(t,tJob,0.8)},ANSD));}},
    // Monday's answer was right after all, but without its evidence nobody could tell; a plain check, every night
    {cut:true,at:tMon-0.4,place:"mcLab",keys:[[0,960,540,1.0]],push:0,draw(ctx,t){agent(ctx);people(ctx);ag_roomLight(ctx,1);routes(ctx,1-ag_in(t,tDown-0.6,0.6));
      const wd=mc_answerW(ctx,ANSF);mc_answer(ctx,MC_ANX,MC_ANY,Object.assign({w:wd,fill:1,edge:AG.green,edgeA:1,a:1-ag_in(t,tDown-0.6,0.6)},ANSF));
      mc_answer(ctx,lerp(-560,262,ag_eo(ag_in(t,tMon,1.2))),150,Object.assign({a:ag_in(t,tMon,0.3)*(1-ag_in(t,tPlain-0.4,0.5)),pulse:Math.sin(Math.PI*clamp((t-tWithout)/1.4,0,1))},MC_A1));
      mc_nightly(ctx,MC_R1[0]+6,384,{w:470,a:ag_in(t,tPlain,0.4)*(1-ag_in(t,tDown-0.6,0.6)),k:ag_spr(t,tPlain,0.5),moon:clamp((t-tNight)/1.4,0,2)*TAU,tick:ag_in(t,tNight+1.4,0.5)});}},
    // written down for the whole team, outside any one chat or head; Wednesday, a new chat starts from it; a person approves and signs
    {at:tDown-0.4,place:"mcLab",keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){const cl=ag_io(t,tNext-0.2,tNext+0.9,0.3);
      agent(ctx,{clear:cl,think:ag_io(t,tNext+0.6,tNext+2.0,0.3)});people(ctx,{cg:t>tReads?[-2,3]:null});ag_roomLight(ctx,1);
      mc_record(ctx,MC_REC[0],MC_REC[1],MC_REC[2],{a:ag_in(t,tDown,0.4),k:ag_spr(t,tDown,0.5),row:ag_in(t,tTeam-0.4,1.4)});
      // the next chat starts from it: a thread of light from the card on the wall into the ring
      const th=ag_in(t,tNext+0.5,1.0);mc_ribbon(ctx,[690,250,740,244,786,272,816,306],0,ag_sine(th),ag_io(t,tNext+0.5,tApp,0.4),4);
      // drafted by the agent; Clara reads the evidence and signs
      const wd=mc_answerW(ctx,ANSF),b=mc_answer(ctx,MC_ANX,MC_ANY,Object.assign({w:wd,fill:1,a:ag_in(t,tApp-0.4,0.5),edge:AG.green,edgeA:0.8},ANSF));
      mc_signoff(ctx,MC_ANX,MC_ANY+mc_answerH(Object.assign({fill:1},ANSF))-20,wd,{a:ag_in(t,tApp,0.5),k:ag_spr(t,tApp,0.5),sign:ag_in(t,tSigns-0.2,1.2)});}},
    // next semester: Clara's draft on the wall, its blank filled at last: the two new advisers start in Engineering and IT
    {cut:true,at:tSem-0.4,place:"mcLab",keys:[[0,960,540,1.0]],push:0.03,draw(ctx,t){agent(ctx);people(ctx,{cg:[2,-4]});ag_roomLight(ctx,1);
      mc_draft(ctx,MC_PAPER[0],MC_PAPER[1],{fill:ag_in(t,tStart+0.2,1.2)});
      mc_record(ctx,MC_REC[0],MC_REC[1],MC_REC[2],{row:1});}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  ag_kicker(ctx,"1.6","Minds that change");
  mc_corner(ctx,"Wednesday",ag_io(t,tNext-0.3,tSem-0.4,0.4));mc_corner(ctx,"Next semester",ag_in(t,tSem-0.2,0.5));});

/* ================================================================ 6 · Every pattern, every time */
scene("every",(ctx,S,t,sc)=>{const C=sc.cues,br=C.breath,T=MC_AT;
  const tPat=wAt(sc,"hymn","every pattern"),tTime=wAt(sc,"hymn","every time"),tYears=wAt(sc,"hymn","three thousand years"),tData=C.data,tWay=wAt(sc,"holds","more than one way"),tHolds=wAt(sc,"holds","the work holds"),tTrust=C.trust;
  const RX=1350,RY=168,RS=0.84,RDY=92;
  const shots=[
    // the riverbank at dusk: the teacher and the two students, the four rows green over them, lighting one after another
    {at:0,place:"mcDusk",keys:[[0,1000,520,1.08],[tData-1.5,1150,420,1.18]],d:3,push:0.02,draw(ctx,t){mc_bank(ctx,t,"dusk");
      const talk={teacher:mc_recite(t,C.asked+0.2,C.asked+1.6),boy1:mc_recite(t,tTime-0.3,tTime+1.4),boy2:mc_recite(t,tTime-0.3,tTime+1.4)};
      mc_reciters(ctx,t,{pose:MC_POSE.sit,talk});mc_leaves(ctx,t,"dusk");
      const rows=mc_rows(ctx,RX,RY,{s:RS,dy:RDY,tiles:false,labelA:1});mc_threads(ctx,rows,1,{s:RS});
      const glowR=r=>0.55+0.45*Math.sin(Math.PI*clamp((t-tTime-r*0.35)/0.9,0,1))+0.45*ag_in(t,tYears,1.0);
      for(let r=0;r<4;r++){ctx.save();const op=[0,0,0,0];op[r]=1;mc_rows(ctx,RX,RY,{s:RS,dy:RDY,open:op,labelA:0,glow:Math.min(1,glowR(r))});ctx.restore();}}},
    // the same with data: the room, the two routes agreeing, the team's card on the wall; the camera eases back for the end card
    {at:tData-0.3,place:"mcLab",keys:[[0,955,585,1.06],[tWay-0.4,960,540,1.0]],d:3.2,push:0,draw(ctx,t){
      mc_agent(ctx,MC_AG[0],MC_AG[1],{t,core:0.55});mc_jun(ctx,t,{dx:MC_JDX});mc_clara(ctx,t,{x:MC_CX,smile:0.5});ag_roomLight(ctx,1);
      ag_tool(ctx,MC_R1[0],MC_R1[1],MC_R1[2],130,"the data platform's enrolments",{touch:0.5});ag_tool(ctx,MC_R2[0],MC_R2[1],MC_R2[2],130,"the student system's report",{touch:0.5});
      mc_count(ctx,MC_R1[0]+MC_R1[2]/2,MC_CY,"131",{col:AG.green});mc_count(ctx,MC_R2[0]+MC_R2[2]/2,MC_CY,"131",{col:AG.green});
      ag_verdict(ctx,960,MC_VY,"agrees two ways","pass",1);mc_record(ctx,MC_REC[0],MC_REC[1],MC_REC[2],{row:1});mc_draft(ctx,MC_PAPER[0],MC_PAPER[1],{fill:1});
      const g=ag_io(t,tHolds-0.2,tHolds+1.6,0.5);if(g>0)glow(ctx,960,MC_VY,180,[110,190,140],0.35*g);}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.8);
  ag_end(ctx,S,t,tTrust-0.1,"Minds that change","Trust no mind blindly. Check the work.","Film 6 of 10");});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["ours", "check"]);
