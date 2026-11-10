/* ===== People and groups: the eight chapters =====
   Each chapter is cut into shots (ag_shots), each a place under a slow camera; every moment waits for a word of the narration
   (wAt(sc, line, word)), so the pictures stay with the voice if it's recorded again; tools/score.py times its sounds to the same words.
   The opening is the hotel card lock (Moss and its hotels in the 1970s, Atlanta in 1978) to the title; then the university: the
   platform as it was (Still a key), one directory, one way to sign in, admin power switched on for a task, no personal token left,
   and back to the hotel's corridor to close. The 1970s places and people are in pg_past.js, the university's in pg_uni.js, and the
   pieces both use in pg_kit.js. */

const PG_LINE="FILM 5 OF 9 · LOCKS BEFORE THE DATA";

/* ================================================================ 1 · Keys that outlive the stay */
// Room 312's pigeonhole at the hotel's desk: an empty one near the middle (the same dice as the desk's painter, in the same order)
const PG_HOLE=(()=>{const R=ag_rnd(21),px=90,py=150,cw=78,ch=74;let best=null;for(let j=0;j<5;j++)for(let i=0;i<8;i++){const has=R()<0.6,d=Math.abs(i-4.5)+Math.abs(j-2.2);
  if(!has&&(!best||d<best.d))best={x:px+i*cw,y:py+j*ch,w:cw,h:ch,d};}return best;})();
// the key's place on the pavement, under the street lamp
const PG_KEYST=[1420,815];
scene("keys",(ctx,S,t,sc)=>{const C=sc.cues;
  const tMakes=wAt(sc,"factory","makes locks"),tSornes=C.sornes,tHotels=C.hotels,tForget=wAt(sc,"forget","forget to hand"),tLose=wAt(sc,"forget","or lose"),
    tStill=wAt(sc,"opens","still opens"),tAnyone=C.anyone,tLet=wAt(sc,"anyone","let themselves"),tSlept=wAt(sc,"anyone","while that guest slept");
  const HO=PG_HOLE,[lx,ly]=PG_LOCK;
  const shots=[
    // dusk on the fjord at Moss: the factory on the water, its windows warm
    {at:0,place:"pgFjord",keys:[[0,960,540,1.0],[0.4,1000,470,1.14]],d:7,push:0,draw(ctx,t){pg_tag(ctx,S,"Moss, Norway · 1970s",ag_in(t,1.0,0.7));}},
    // its workshop: lock cases, springs and ice skates on the bench; Tor Sørnes behind it, a lock case in his hand
    {at:tMakes-0.5,place:"pgWorkshop",keys:[[0,900,520,1.0],[tSornes-0.6,780,520,1.08]],d:3,push:0,draw(ctx,t){
      dp_person(ctx,PG_SORNES,470,520,1.0,{t,light:"lamp",cut:PG_BENCH,pose:"hold",hold:(c,h)=>pg_heldCase(c,h),gaze:[3,2],nod:0.04});pg_front(ctx,"pgWorkshop",PG_BENCH);
      dp_slip(ctx,720,300,"Tor Sørnes · research","cyan",{a:ag_in(t,tSornes-0.1,0.5),ink:true});}},
    // a hotel's front desk at night, its rooms' keys in their pigeonholes: Room 312's is empty, its key not handed in
    {at:tHotels-0.5,place:"pgDesk",keys:[[0,960,540,1.0],[tHotels+1.0,HO.x+HO.w/2+170,HO.y+70,1.5]],d:2.2,push:0,draw(ctx,t){
      pg_tag(ctx,S,"A hotel · 1970s",ag_in(t,tHotels+0.1,0.6)*(1-ag_in(t,tHotels+1.0,0.5)));
      const ha=ag_in(t,tForget-0.1,0.5);if(ha>0){ctx.save();ctx.globalAlpha*=ha;ctx.strokeStyle=rgba(DP.F.coral,1);ctx.shadowColor=rgba(DP.F.coral,0.9);ctx.shadowBlur=14;ctx.lineWidth=3;
        ctx.strokeRect(HO.x+5,HO.y+5,HO.w-10,HO.h-10);ctx.restore();}
      dp_pill(ctx,HO.x+HO.w+30,HO.y+HO.h/2+14,"Room 312 · key not handed in","coral",{a:ha});}},
    // or lost on the way: the key on a wet pavement, under a street lamp; whoever holds it, it still opens its door
    {at:tLose+0.1,place:"pgStreet",keys:[[0,1180,640,1.3],[tStill-0.5,1280,700,1.5]],d:2.4,push:0,draw(ctx,t){const ka=ag_in(t,tStill+0.1,0.6);
      pg_key(ctx,PG_KEYST[0],PG_KEYST[1],0.62,{rot:-0.15,num:"312",rim:"coral",rimA:ka,deco:1});
      dp_pill(ctx,1150,640,"Still opens Room 312","coral",{a:ka});}},
    // anyone who found it, or kept it: the key in Room 312's lock, and the light under the door dims as the next guest sleeps
    {cut:true,at:tAnyone-0.4,place:"pgCorridor",keys:[[0,960,540,1.0],[tAnyone+0.2,990,520,1.6]],d:4.4,push:0.015,draw(ctx,t){
      pg_doorLight(ctx,ag_in(t,tSlept,1.8));pg_plate(ctx);pg_escutcheon(ctx,lx,ly,0.42);
      const ka=ag_in(t,tLet-0.2,0.7);pg_keyInLock(ctx,lx,ly,0.42,{a:ka,rim:"coral",rimA:0.9*ka,deco:1});}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);});

/* ================================================================ 2 · A card for each stay */
const PG_RD={x:860,y:150,w:960};   // the lock, drawn as glass beside the bench and the desk: the corridor on its left, the room on its right
scene("card",(ctx,S,t,sc)=>{const C=sc.cues;
  const tInside=wAt(sc,"inside","Inside each lock"),tPut=wAt(sc,"inside","put in from inside"),tNewPat=wAt(sc,"guest","puts in a new pattern"),tGives=wAt(sc,"guest","gives the guest"),
    tLast=C.last,tNothing=wAt(sc,"last","opens nothing"),tAtl=C.atlanta,tFirst=wAt(sc,"atlanta","the first go"),tBurg=wAt(sc,"atlanta","troubled by burglaries"),
    tLost=C.lost,tLostN=wAt(sc,"lost","opens nothing"),tNew=wAt(sc,"lost","only a new card"),tSpread=C.spread,tRooms=wAt(sc,"spread","six and a half million"),tEnds=C.ends,
    tUni=C.uni,tJob=wAt(sc,"uni","outlive a person's job"),tTask=wAt(sc,"uni","outlived the task"),tToken=C.token,tBuilds=C.builds,tThree=wAt(sc,"builds","three earlier films"),
    tEntra=wAt(sc,"builds","Microsoft Entra ID"),tAzure=wAt(sc,"builds","Azure Databricks");
  const R=PG_RD,u=(a,d)=>clamp((t-a)/d,0,1);
  // the lock at the desk: the old pattern out and the new one in; the guest's new card in, and green; then the last guest's card, coral
  const deskLock=(t)=>{const o={a:1,labels:[ag_in(t,tGives+0.7,0.5),1]};const swap=tNewPat+0.6;
    if(t<swap){o.seed=5;o.pattern=1;o.pOut=u(tNewPat-0.3,0.9);}else{o.seed=9;o.pattern=u(swap,1.0);}
    const g2=tLast+0.25;
    if(t<g2){o.gSeed=9;o.guest=u(tGives+0.05,1.1);o.gOut=u(tLast-0.45,0.7);o.check=u(tGives+1.2,0.8)*(1-ag_in(t,tLast-0.8,0.3));o.verdict=ag_in(t,tGives+1.7,0.5)*(1-ag_in(t,tLast-0.8,0.3));}
    else{o.gSeed=5;o.old=true;o.guest=u(g2,1.0);o.check=u(tNothing-0.4,0.8);o.verdict=ag_in(t,tNothing+0.1,0.5);}
    return o;};
  const toDoor=[PG_PLAT.door[0]-8,PG_PLAT.door[1]+PG_PLAT.door[3]*0.45];
  const shots=[
    // the workshop: Sørnes with a punched plastic card; the lock beside him, as glass: the pattern card goes in from inside the room
    {at:0,place:"pgWorkshop",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      dp_person(ctx,PG_SORNES,400,520,1.0,{t:t+3,light:"lamp",cut:PG_BENCH,pose:"hold",hold:(c,h)=>pg_heldCard(c,h,5),gaze:[3,2],nod:0.03});pg_front(ctx,"pgWorkshop",PG_BENCH);
      pg_reader(ctx,R.x,R.y,R.w,{a:ag_in(t,tInside-0.3,0.5),k:ag_spr(t,tInside-0.3,0.7),seed:5,pattern:u(tPut-0.2,1.2),labels:[0,ag_in(t,tPut+0.5,0.5)]});}},
    // the hotel's desk: for each new guest, a new pattern, and a card punched to match; the last guest's card opens nothing
    {cut:true,at:tNewPat-1.4,place:"pgDesk",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){const gone=ag_in(t,tGives-0.35,0.4);
      dp_person(ctx,PG_CLERK,400,470,1.0,{t,light:"lamp",cut:PG_COUNTER,pose:"hold",pose2:"hang",mix:ag_in(t,tGives+0.15,0.45),hold:(c,h)=>pg_heldCard(c,h,9,1-gone),gaze:[3,1],nod:0.03});
      pg_front(ctx,"pgDesk",PG_COUNTER);pg_reader(ctx,R.x,R.y,R.w,deskLock(t));}},
    // Atlanta, 1978: a big new hotel, troubled by burglaries; its floors light as the card locks go in
    {at:tAtl-0.4,place:"pgAtlanta",keys:[[0,960,560,1.0],[tAtl,980,520,1.1]],d:6,push:0,draw(ctx,t){pg_towerLights(ctx,ag_in(t,tFirst,4.5));
      pg_tag(ctx,S,"Atlanta · 1978",ag_in(t,tAtl+0.2,0.6));dp_slip(ctx,1240,330,"Troubled by burglaries","coral",{a:ag_in(t,tBurg-0.2,0.5)});}},
    // a lost card opens nothing once the next guest arrives; changing the lock takes only a new pattern card
    {at:tLost-0.4,place:"pgStreet",keys:[[0,1234,640,1.4]],push:0.015,draw(ctx,t){const ca=ag_in(t,tLostN-0.1,0.6);
      pg_punch(ctx,1330,770,170,{seed:5,rot:-0.12,rim:"coral",rimA:ca});dp_slip(ctx,1060,690,"Opens nothing","coral",{a:ca});
      pg_reader(ctx,1250,300,560,{a:ag_in(t,tNew-0.4,0.5),k:ag_spr(t,tNew-0.4,0.6),mini:true,seed:11,pattern:u(tNew+0.1,1.0)});}},
    // by 2011, six and a half million rooms: the corridor's doors light green, one card lock after another
    {at:tSpread-0.4,place:"pgCorridor",keys:[[0,960,540,1.0],[tEnds-0.6,990,500,1.55]],d:2.6,push:0,draw(ctx,t){
      pg_plate(ctx);pg_sideLocks(ctx,ag_in(t,tRooms-0.3,3.2));pg_cardLock(ctx,ag_in(t,tRooms+2.8,0.6),true);
      dp_card(ctx,100,170,600,{kick:"By 2011",title:"6.5 million hotel rooms, in 166 countries",sub:"The company's figure"},{a:ag_io(t,tSpread+0.1,tEnds-1.0,0.6),k:ag_spr(t,tSpread+0.1,0.6)});
      dp_pill(ctx,990,236,"A key that ends with the stay","green",{a:ag_in(t,tEnds-0.1,0.6),align:"center"});}},
    // the university's hall: the platform's block of glass, its one lit door, and what outlived the stay
    {at:tUni-0.4,place:"pgHall",keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){const ta=1-ag_in(t,tBuilds-0.3,0.5);
      dp_tag(ctx,560,300,"A place that outlived the job","coral",{a:ag_in(t,tJob-0.1,0.5)*ta,to:toDoor,p:ag_in(t,tJob+0.2,0.6)});
      dp_tag(ctx,560,420,"Power that outlived the task","coral",{a:ag_in(t,tTask-0.1,0.5)*ta,to:toDoor,p:ag_in(t,tTask+0.2,0.6)});
      dp_tag(ctx,560,540,"A token with no end date","coral",{a:ag_in(t,tToken+0.1,0.5)*ta,to:toDoor,p:ag_in(t,tToken+0.4,0.6)});
      // the answer, built from three earlier films, in the two tools
      // they leave before the title card comes in, so no word shows under its own
      ["Who is it, really?","No secret to lose","Power you switch on"].forEach((s,i)=>dp_tag(ctx,560,300+i*120,s,"grey",{a:ag_in(t,tThree-0.2+0.3*i,0.5)*(1-ag_in(t,C.breath-0.5,0.6))}));
      pg_toolSlip(ctx,120,420,"entra","Microsoft Entra ID",ag_in(t,tEntra-0.1,0.5),{k:ag_spr(t,tEntra-0.1,0.6)});pg_platName(ctx,ag_in(t,tAzure-0.1,0.5));}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  dp_title(ctx,S,t,C.breath,"People and groups","Keys that end with the stay",PG_LINE);});


/* ================================================================ 3 · Still a key */
// the people the workspace was given by hand, and the team each is in today: two have moved to jobs that don't need it
const PG_USERS=[["T. Brennan","Registrar's office"],["K. Osei","Planning"],["L. Haddad","Finance",1],["R. Novak","Registrar's office"],["P. Sato","Library",1],["J. Ferreira","Data team"]];
// the workspace's eleven admins, each on the everyday account they read their email with (n shown, 0 to 11; caught: the sixth's sign-in)
function pg_admins(ctx,x,y,n,caught){for(let i=0;i<11;i++){const q=clamp(n-i,0,1);if(q<=0)break;const c=i%4,r=Math.floor(i/4),bx=x+c*138,by=y+r*124,hit=i===5?clamp(caught||0,0,1):0;
  ctx.save();ctx.globalAlpha*=q;const col=hit>0.5?"coral":"cyan";dp_panel(ctx,bx,by,118,106,{col:hit>0?mix(DP.F.cyan,DP.F.coral,hit):DP.F.cyan,r:16,glowR:20});
  ctx.save();ctx.translate(bx+44,by+50);ctx.scale(0.5,0.5);dp_personPic(ctx,0,10,col);ctx.restore();pg_envelope(ctx,bx+88,by+80,0.62,col);ctx.restore();}}
scene("before",(ctx,S,t,sc)=>{const C=sc.cues;
  const tTables=wAt(sc,"tables","give their rights"),tGov=wAt(sc,"tables","Governed in Unity Catalog"),tHand=C.hand,t214=wAt(sc,"people","two hundred"),tMoved=C.moved,
    tGroups=C.groups,tKnew=wAt(sc,"groups","the directory knew nothing"),tAdmins=C.admins,tEmail=wAt(sc,"admins","read their email"),tFake=C.fake,tCatch=wAt(sc,"fake","would catch an admin"),
    tPw=C.password,tToken=C.token,tNoEnd=wAt(sc,"token","no end date"),tNightly=wAt(sc,"token","ran the nightly job"),tStill=C.still,tLong=wAt(sc,"still","long after the stay");
  // the pages on Sam's screen, one at a time: each leaves before the next comes in
  const aA=ag_io(t,tTables-0.3,tHand+0.1,0.5),aB=ag_io(t,tHand+0.6,tGroups-0.7,0.5),aC=ag_io(t,tGroups-0.2,tAdmins-0.6,0.5),aD=ag_io(t,tAdmins-0.1,tToken-0.7,0.5),
    aF=ag_io(t,tFake-0.2,tPw-0.6,0.5),aP=ag_io(t,tPw-0.1,tToken-0.7,0.5),aE=ag_in(t,tToken-0.2,0.5);
  const shots=[{at:0,place:"pgTeam",keys:[[0,860,560,1.12],[C.sam+2.4,960,540,1.0]],d:2.0,push:0,draw(ctx,t){
    dp_person(ctx,"sam",330,600,1.0,{t,cut:PG_DESK,gaze:[3,1],nod:0.03});
    dp_slip(ctx,480,250,"Sam Okafor · data platform","cyan",{a:ag_io(t,C.sam-0.1,tHand,0.5),ink:true});
    // its tables give their rights to groups from the directory
    if(aA>0){const b=dp_page(ctx,940,150,900,480,{tool:"databricks",name:"Azure Databricks",where:"Catalog · registrar",title:"Permissions",a:aA});
      dp_rows(ctx,b.x,b.y,[{t:"Group",w:470},{t:"Privilege",w:170},{t:"On",w:196}],[["registrar_office","core"],["registrar_exam_support","support"],["planning_learner_readers","core"]].map(r=>[{mono:true,t:r[0]},"SELECT",{mono:true,t:r[1]}]),{a:aA});
      dp_slip(ctx,940,650,"Governed in Unity Catalog","grey",{a:aA*ag_in(t,tGov-0.2,0.5),ink:true});}
    // who could come in at all: people, added one by one; nineteen of them have moved on
    if(aB>0){const b=dp_page(ctx,940,130,900,720,{tool:"databricks",name:"Azure Databricks",where:"Settings · Identity and access",title:"Users",a:aB}),mv=ag_in(t,tMoved+0.3,0.6);
      dp_pill(ctx,b.x+b.w,270,"214 people · added by hand","cyan",{align:"right",a:aB*ag_in(t,t214-0.1,0.5)});
      dp_rows(ctx,b.x,b.y,[{t:"User",w:300},{t:"Added",w:220},{t:"Team today",w:316}],PG_USERS.map(r=>{const c=r[2]?mix(DP.T.ink,DP.T.coral,mv):DP.T.ink;return[{t:r[0],col:c},{t:"By hand",col:"mut"},{t:r[1],col:c}];}),{a:aB});
      if(mv>0){ctx.save();ctx.globalAlpha*=aB*mv;ctx.strokeStyle=rgba(DP.F.coral,1);ctx.shadowColor=rgba(DP.F.coral,0.8);ctx.shadowBlur=10;ctx.lineWidth=2.4;
        PG_USERS.forEach((r,j)=>{if(r[2]){rr(ctx,b.x-12,b.y+58*(j+1)-12,b.w+24,54,12);ctx.stroke();}});ctx.restore();}
      dp_pill(ctx,b.x,790,"19 moved on · still in","coral",{a:aB*mv});}
    // groups made inside the workspace, which the directory knew nothing of
    if(aC>0){const b=dp_page(ctx,940,130,900,520,{tool:"databricks",name:"Azure Databricks",where:"Settings · Identity and access",title:"Groups",a:aC});
      dp_rows(ctx,b.x,b.y,[{t:"Group",w:380},{t:"Made in",w:456}],["analysts","etl_users","report_builders","temp_access"].map(g=>[{mono:true,t:g},{pill:"This workspace",col:"coral"}]),{a:aC});
      dp_slip(ctx,940,676,"Unknown to the directory","coral",{a:aC*ag_in(t,tKnew-0.1,0.5),ink:true});}
    // eleven admins on their everyday accounts; a fake page that catches one sign-in catches an admin
    if(aD>0){const b=dp_page(ctx,1240,130,620,600,{tool:"databricks",name:"Azure Databricks",where:"Groups",a:aD});
      withA(ctx,aD,()=>{dp_T(ctx,"admins",b.x,b.y+30,{w:500,size:36,f:"mono"});dp_T(ctx,"11 members",b.x+b.w,b.y+30,{w:600,size:28,col:"mut",align:"right"});
        pg_admins(ctx,b.x,b.y+70,(t-tAdmins)/0.12,ag_in(t,tCatch-0.2,0.5));});}
    pg_fake(ctx,660,330,{a:aF,fill:u3(t,tFake+0.4,2.4)});
    dp_card(ctx,660,360,540,{kick:"Every sign-in",title:"A password",sub:"And a code by text message"},{a:aP,k:ag_spr(t,tPw-0.1,0.6)});
    // the nightly job, on Jun's personal token with no end date; like the hotel's keys, long after the stay
    if(aE>0){dp_card(ctx,900,190,760,{kick:"The nightly job",title:"registrar_nightly_load",sub:"Runs every night at 02:00"},{a:aE,k:ag_spr(t,tToken-0.2,0.6)});
      dp_sealed(ctx,900,420,760,"Jun Park's personal token",{sub:"Made 14 March 2024 · no end date",a:ag_in(t,tToken+0.6,0.5)});
      const ka=ag_in(t,tStill-0.1,0.6);pg_key(ctx,1190,650,0.62,{rot:-0.08,num:"312",rim:"coral",rimA:ka,a:ka,deco:1});dp_pill(ctx,1300,678,"Long after the stay","coral",{a:ag_in(t,tLong-0.1,0.5)});}}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);pg_kick(ctx,S,"Still a key",ag_io(t,0.4,4.6,0.6));});
// a line typed on from t0 over d seconds (0 to 1)
function u3(t,t0,d){return clamp((t-t0)/d,0,1);}

/* ================================================================ 4 · One directory */
scene("directory",(ctx,S,t,sc)=>{const C=sc.cues;
  const tHR=wAt(sc,"entra","HR's records"),tTeam=wAt(sc,"joins","already in their team's groups"),tMoves=C.moves,tChange=wAt(sc,"moves","their groups change"),tLeave=wAt(sc,"moves","when they leave"),
    tOff=wAt(sc,"moves","turned off"),tReads=C.reads,tFor=wAt(sc,"reads","for itself"),tNested=wAt(sc,"reads","groups inside groups"),tAim=C.aim,tAimOn=wAt(sc,"aim","automatic identity management"),
    tGiven=C.given,tNever=wAt(sc,"given","never people"),tTeamP=wAt(sc,"prod","the data team"),tReg=wAt(sc,"prod","the registrar's office"),tReaders=wAt(sc,"prod","the readers"),
    tGone=C.gone,tTheir=wAt(sc,"gone","their people"),tOne=C.one,tPlace=wAt(sc,"one","the directory"),tSigns=C.signs,tAgain=wAt(sc,"signs","reads their groups again"),
    tFollows=C.follows,tNext=wAt(sc,"follows","at their next sign-in"),tLeaves=C.leaves,tSync=wAt(sc,"leaves","at its next sync");
  const D=PG_DIR,rc=i=>D.y+104+i*D.lh+39,SX=880,away=1-ag_in(t,tAim-0.7,0.5);
  // the pages on the right, one at a time
  const aAim=ag_io(t,tAim-0.2,tGiven-0.6,0.5),aPerm=ag_io(t,tGiven-0.1,tGone-0.6,0.5),aGone=ag_io(t,tGone-0.1,tOne-0.6,0.5),aOne=ag_io(t,tOne-0.1,tSigns-0.6,0.5),aUsers=ag_in(t,tSync-0.2,0.5);
  const shots=[{at:0,place:"pgHall",keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){
    // the directory, a drawer for each group, fed by HR's records; a group inside a group
    const lit=t>tPlace-0.2&&t<tSigns-0.5?1:t>tFollows-0.2&&t<tLeaves-0.4?4:null;
    pg_directory(ctx,{a:ag_in(t,C.entra-0.5,0.6),rows:(t-(C.entra+0.3))/0.3,lit});
    pg_nested(ctx,ag_in(t,tNested-0.1,0.5));
    const ha=ag_in(t,tHR-0.2,0.5)*away;dp_slip(ctx,SX,150,"HR · staff records","cyan",{a:ha,ink:true});withA(ctx,ha,()=>dp_link(ctx,[SX+40,220],[D.x+D.w+8,rc(1)-20],"cyan",ag_in(t,tHR+0.2,0.6),{lw:2}));
    // joins, moves, leaves: each person's card beside their group
    pg_cardAt(ctx,"N. Adeyemi",[SX+30,150],[SX,rc(1)-59],u3(t,tTeam-0.3,1.2),{col:"green",sub:"Joined",subCol:"green",a:ag_in(t,tTeam-0.4,0.4)*(1-ag_in(t,tMoves-0.7,0.4))});
    const ma=ag_in(t,tMoves-0.2,0.4)*away;if(ma>0)pg_cardAt(ctx,"A. Moreau",[SX,rc(1)-59],[SX,rc(4)-59],u3(t,tChange-0.1,1.4),{sub:"To Finance",a:ma});
    const ma2=ag_in(t,tFollows-0.2,0.5);if(ma2>0)pg_who(ctx,SX,rc(4)-59,"A. Moreau",{sub:"Finance",a:ma2});
    const va=ag_in(t,tLeave-0.2,0.4)*away,vg=ag_in(t,tOff-0.1,0.5);if(va>0){pg_who(ctx,SX,rc(0)-59,"D. Varga",{sub:"Left · sign-in off",a:va*(1-vg)});pg_who(ctx,SX,rc(0)-59,"D. Varga",{sub:"Left · sign-in off",dim:1,col:"grey",a:va*vg});}
    const va2=ag_in(t,tLeaves-0.2,0.5);if(va2>0)pg_who(ctx,SX,rc(0)-59,"D. Varga",{sub:"Left · sign-in off",dim:1,col:"grey",a:va2});
    // Azure Databricks reads the directory for itself; a person's sign-in runs along it
    pg_platName(ctx,ag_in(t,tReads-0.2,0.5));
    const g1=u3(t,tAgain-0.3,1.4),g2=u3(t,tNext-0.3,1.4),gl=g1>0&&g1<1?g1:g2;
    pg_reads(ctx,ag_in(t,tFor-0.3,1.0),gl,ag_in(t,tFor+0.5,0.5)*(1-ag_io(t,tAim-0.7,tSigns-0.5,0.5))*(1-aUsers));pg_disc(ctx,g1);
    // the account's automatic identity management, switched on once
    if(aAim>0){const b=dp_page(ctx,980,150,880,300,{tool:"databricks",name:"Azure Databricks",where:"Account console · Security",title:"Identity provider setup",a:aAim});
      withA(ctx,aAim,()=>{const on=ag_in(t,tAimOn+0.5,0.6);dp_switch(ctx,b.x,b.y+12,on,{col:"green",label:"Automatic identity management"});
        dp_T(ctx,"Enabled",b.x+b.w,b.y+42,{w:700,size:30,col:"green",align:"right",a:on});});}
    // production is given groups, never people
    if(aPerm>0){const b=dp_page(ctx,980,150,880,560,{tool:"databricks",name:"Azure Databricks",where:"Account console · Workspaces",title:"production · Permissions",a:aPerm}),
        ra=[ag_in(t,tTeamP-0.1,0.4),ag_in(t,tReg-0.1,0.4),ag_in(t,tReaders-0.1,0.4),ag_in(t,tReaders+0.3,0.4)];
      dp_rows(ctx,b.x,b.y,[{t:"Group",w:520},{t:"Permission",w:296}],["data_team","registrar_office","registrar_exam_support","planning_learner_readers"].map((g,i)=>[{mono:true,t:g,a:ra[i]},{t:"User",a:ra[i]}]),{a:aPerm});
      dp_pill(ctx,b.x+b.w,270,"Groups only","green",{align:"right",a:aPerm*ag_in(t,tNever-0.1,0.5)});}
    // the four groups made by hand fold away
    if(aGone>0){const b=dp_page(ctx,980,150,880,470,{tool:"databricks",name:"Azure Databricks",where:"production · Groups",title:"Made in the workspace",a:aGone});
      ["analysts","etl_users","report_builders","temp_access"].forEach((g,i)=>{const f=ag_in(t,tGone+0.6+0.45*i,0.5);if(f>=1)return;
        dp_T(ctx,g,b.x,b.y+34+i*62-24*f,{w:500,size:30,f:"mono",col:"coral",a:aGone*(1-f)});});
      dp_slip(ctx,b.x,b.y+20,"Their people: in the directory's groups","green",{a:aGone*ag_in(t,tTheir-0.1,0.5),ink:true});}
    // a group from the directory: changed in one place only
    if(aOne>0){const b=dp_page(ctx,980,150,880,330,{tool:"databricks",name:"Azure Databricks",where:"Account console · Groups",a:aOne});
      withA(ctx,aOne,()=>{dp_T(ctx,"registrar_office",b.x,b.y+40,{w:500,size:36,f:"mono"});dp_lock(ctx,b.x+18,b.y+102,34,"cyan",0);
        dp_T(ctx,"External",b.x+54,b.y+114,{w:700,size:30,col:"cyan"});dp_T(ctx,"Changed in the directory",b.x+54,b.y+160,{w:600,size:28,col:"mut"});});}
    // someone who has left: their user turned off at the next sync
    if(aUsers>0){const b=dp_page(ctx,1210,150,650,280,{tool:"databricks",name:"Azure Databricks",where:"Users",a:aUsers});
      dp_rows(ctx,b.x,b.y,[{t:"User",w:300},{t:"Status",w:286}],[["D. Varga",{t:"Deactivated",col:"coral",a:ag_in(t,tSync+0.3,0.5)}]],{a:aUsers});}}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);pg_kick(ctx,S,"One directory",ag_io(t,0.3,4.6,0.6));});

/* ================================================================ 5 · Sign in once */
// who has accepted the confidentiality agreement, and when, as the directory keeps it
const PG_ACCEPT=[["Mei Tanaka","5 Oct 2026, 08:51"],["Sam Okafor","5 Oct 2026, 08:03"],["Jun Park","5 Oct 2026, 08:10"],["Noor Rahman","5 Oct 2026, 09:26"]];
scene("signin",(ctx,S,t,sc)=>{const C=sc.cues;
  const tRule=C.rule,tNo=wAt(sc,"rule","lets no one"),tReach=wAt(sc,"rule","reach Azure Databricks"),tPass=wAt(sc,"rule","without a passkey"),tFake=wAt(sc,"rule","no fake page can catch"),
    tLives=C.lives,tPhone=wAt(sc,"lives","their own phone"),tAuth=wAt(sc,"lives","the Authenticator app"),tKey=wAt(sc,"lives","a security key"),
    tMei=C.mei,tSigns=wAt(sc,"mei","signs in with her phone"),tFace=wAt(sc,"mei","her face unlocks"),tUnl=wAt(sc,"mei","unlocks the passkey"),tIn=wAt(sc,"mei","she's in"),
    tNone=C.none,tCould=wAt(sc,"none","a fake page could use"),tAgree=C.agree,tConf=wAt(sc,"agree","confidentiality agreement"),tFirst=wAt(sc,"agree","Who is it"),
    tAcc=wAt(sc,"before","before accepting it"),tYear=wAt(sc,"before","again each year"),tKeeps=C.keeps,tWhen=wAt(sc,"keeps","and when");
  const aDir=1-ag_in(t,tRule-0.2,0.5),aRule=ag_in(t,tRule+0.35,0.5)*(1-ag_in(t,tLives-0.3,0.5)),aKit=1-ag_in(t,tMei-1.0,0.5),tKit=Math.max(tPhone-0.2,tLives+0.25);
  const shots=[
    // the hall: everyone's sign-in runs through the directory to the platform's door; then the directory's rule for it
    {at:0,place:"pgHall",keys:[[0,960,540,1.02]],push:0.01,draw(ctx,t){
      pg_directory(ctx,{a:aDir});pg_nested(ctx,aDir);pg_platName(ctx,1);pg_reads(ctx,1,0,0);
      for(let i=0;i<3;i++)pg_disc(ctx,u3(t,C.once+0.5+0.8*i,1.5));
      if(aRule>0){const b=pg_rule(ctx,aRule,[ag_in(t,tNo-0.1,0.4),ag_in(t,tReach-0.1,0.4),ag_in(t,tPass-0.1,0.4)],3);
        dp_pill(ctx,b.x,676,"No fake page can catch it","green",{a:aRule*ag_in(t,tFake-0.1,0.5)});}
      // where a passkey lives: the Authenticator app, on a person's own phone, or a security key
      if(aKit>0&&t>tKit){pg_phone(ctx,170,240,1.0,{a:aKit*ag_in(t,tKit,0.5)});pg_passkey(ctx,284,560,1.0,"cyan",aKit*ag_in(t,tKit+0.3,0.5));
        dp_slip(ctx,280,712,"Authenticator app","cyan",{align:"center",a:aKit*ag_in(t,tAuth-0.1,0.5),ink:true});
        pg_seckey(ctx,640,440,2.4,{a:aKit*ag_in(t,tKey-0.2,0.5),rot:-0.1});dp_slip(ctx,640,540,"A security key","cyan",{align:"center",a:aKit*ag_in(t,tKey,0.5),ink:true});}}},
    // the registrar's office: Mei signs in with her phone; her face unlocks the passkey, and she's in; a fake page gets nothing
    {at:tMei-0.4,place:"pgOffice",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){const f=u3(t,tFace,1.1),ok=ag_in(t,tUnl+0.4,0.5),sA=ag_io(t,tSigns-0.3,tNone-0.4,0.5);
      dp_person(ctx,"mei",1400,600,1.0,{t,cut:PG_DESK,flip:true,pose:"hold",hold:(c,h)=>pg_heldPhone(c,h,f,ok),gaze:[3,1],nod:0.03});
      dp_slip(ctx,1060,170,"Mei Tanaka · registrar's data","cyan",{a:ag_io(t,tMei+0.1,tNone-0.4,0.5),ink:true});
      pg_signin(ctx,120,220,760,{a:sA,k:ag_spr(t,tSigns-0.3,0.6),face:f,tick:ok,signed:ag_in(t,tIn-0.1,0.5)});
      pg_fake(ctx,180,250,{a:ag_in(t,tNone,0.5),empty:true,nothing:ag_in(t,tCould-0.1,0.5)});}},
    // back in the hall: the same rule asks for each person's confidentiality agreement, accepted again each year; who accepted, and when
    {at:tAgree-0.5,place:"pgHall",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){const cA=ag_io(t,tConf+0.3,tKeeps-0.5,0.5);
      pg_platName(ctx,1);pg_rule(ctx,ag_in(t,tAgree-0.2,0.5),[1,1,1,ag_in(t,tConf-0.1,0.4)],4);
      pg_agreement(ctx,960,170,720,{a:cA,k:ag_spr(t,tConf+0.3,0.6),accept:u3(t,tAcc+0.2,0.6)});
      dp_tag(ctx,960,660,"Who is it, really?","grey",{a:cA*ag_in(t,tFirst-0.2,0.5)});
      dp_pill(ctx,1680,700,"Again every 365 days","cyan",{align:"right",a:cA*ag_in(t,tYear-0.1,0.5)});
      const lA=ag_in(t,tKeeps,0.5);if(lA>0){const b=dp_page(ctx,960,170,880,470,{tool:"entra",name:"Microsoft Entra ID",where:"Terms of use",title:"Confidentiality agreement",a:lA});
        dp_rows(ctx,b.x,b.y,[{t:"User",w:300},{t:"Status",w:220},{t:"When",w:296}],PG_ACCEPT.map((r,i)=>[{t:r[0],col:i?"ink":"cyan"},{t:"Accepted",col:"green"},{t:r[1],col:"mut",a:ag_in(t,tWhen-0.1+0.12*i,0.4)}]),{a:lA});}}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);pg_kick(ctx,S,"Sign in once",ag_io(t,0.4,4.6,0.6));});

/* ================================================================ 6 · Power you borrow */
scene("power",(ctx,S,t,sc)=>{const C=sc.cues;
  const tAcct=wAt(sc,"roles","in the Databricks account"),tWs=wAt(sc,"roles","in each workspace"),tAz=wAt(sc,"roles","in Azure"),
    tTwo=C.two,tSJ=wAt(sc,"two","Sam and Jun"),tSecond=wAt(sc,"two","a second account"),tSK=wAt(sc,"two","a security key"),
    tPimName=wAt(sc,"pim","privileged identity management"),tElig=wAt(sc,"pim","eligible for the groups"),tNever=wAt(sc,"pim","never in them"),
    tReport=C.report,tRep=wAt(sc,"report","the account's token report"),tOnly=wAt(sc,"report","only an account admin"),
    tHour=C.hour,tOne=wAt(sc,"hour","for one hour"),tWhy=wAt(sc,"hour","types why"),tAppr=C.approves,
    tSec=C.seconds,tIn=wAt(sc,"seconds","in the group"),tAlert=C.alert,tWho=wAt(sc,"alert","who"),tWhich=wAt(sc,"alert","which group"),tWhyA=wAt(sc,"alert","why"),
    tWhoA=wAt(sc,"alert","who approved"),tUntil=wAt(sc,"alert","until when"),tReads=C.reads,tSignsIn=wAt(sc,"reads","as he signs in"),tCan=wAt(sc,"reads","he can read the report"),
    tOut=C.out,tSO=wAt(sc,"out","he signs out"),tUp=wAt(sc,"out","the hour is up"),tTakes=wAt(sc,"out","takes his admin account out"),
    tLike=C.like,tPat=wAt(sc,"like","a new pattern"),tOpens=wAt(sc,"like","opens one stay"),tEnds=wAt(sc,"like","ends with it");
  const rA=1-ag_in(t,tTwo-0.6,0.5),sA=ag_in(t,tSJ-0.1,0.5),jA=ag_in(t,tSJ+0.4,0.5),bA=ag_in(t,tSecond-0.1,0.5),touch=ag_io(t,tSK-0.1,tSK+1.6,0.3),fan=u3(t,tElig-0.2,0.9);
  const shots=[
    // the hall: the directory's admin groups, no one in them; every admin role belongs to one of them
    {at:0,later:true,place:"pgHall",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      pg_slots(ctx,{n:(t-(C.groups+0.2))/0.25});
      pg_roleCard(ctx,980,110,860,"databricks","Account console","Account admin","admin_account_settings",{a:rA*ag_in(t,tAcct-0.1,0.5),k:ag_spr(t,tAcct-0.1,0.6)});
      pg_roleCard(ctx,980,270,860,"databricks","production · Permissions","Admin","admin_production_settings",{a:rA*ag_in(t,tWs-0.1,0.5),k:ag_spr(t,tWs-0.1,0.6)});
      pg_roleCard(ctx,980,430,860,"azure","Azure · role assignments","Contributor","admin_production_settings",{a:rA*ag_in(t,tAz-0.1,0.5),k:ag_spr(t,tAz-0.1,0.6)});
      const eA=rA*ag_in(t,tAz+1.0,0.6);const eb=dp_slip(ctx,90,800,"Emergency accounts: two, kept in safes","grey",{a:eA});dp_tag(ctx,eb.x+eb.w+20,804,"Who did what","grey",{a:eA});
      // the only two who can switch one on, each from a second account, signed in only with a security key
      pg_who(ctx,1500,225,"Sam Okafor",{a:sA});pg_who(ctx,1500,465,"Jun Park",{a:jA});
      withA(ctx,bA,()=>{dp_link(ctx,[1442,265],[1498,265],"cyan",1,{lw:2,dot:false});dp_link(ctx,[1442,505],[1498,505],"cyan",1,{lw:2,dot:false});});
      pg_admin(ctx,980,190,"Sam Okafor (admin)",{a:bA,touch});pg_admin(ctx,980,430,"Jun Park (admin)",{a:bA*ag_in(t,tSecond+0.3,0.5),touch});
      // the switch: privileged identity management; the two accounts are eligible for each group, never in one
      pg_toolSlip(ctx,980,96,"pim","Privileged Identity Management",ag_in(t,tPimName-0.2,0.5),{k:ag_spr(t,tPimName-0.2,0.6)});
      if(fan>0)for(const by of [265,505])for(let i=0;i<6;i++)pg_dots(ctx,[976,by],pg_slotEnd(i),"amber",fan,0.7);
      dp_tag(ctx,90,800,"Eligible, never in them","grey",{a:ag_in(t,tNever-0.1,0.5)});}},
    // the data team's room, 19 October: the token report, which only an account admin can read; Sam switches on for an hour, says why; Jun approves
    {at:tReport-0.4,place:"pgTeam",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      dp_person(ctx,"sam",330,600,1.0,{t,cut:PG_DESK,gaze:[3,1],nod:0.03});
      pg_tag(ctx,S,"19 October 2026",ag_in(t,tReport+0.1,0.6));
      const qA=ag_io(t,tRep-0.2,tHour-0.5,0.5);if(qA>0){const b=dp_page(ctx,940,150,900,480,{tool:"databricks",name:"Azure Databricks",where:"Account console · Security",title:"Token report",a:qA});
        withA(ctx,qA*ag_in(t,tOnly-0.1,0.5),()=>{dp_lock(ctx,b.x+b.w/2,b.y+90,90,"coral",0);dp_T(ctx,"Account admins only",b.x+b.w/2,b.y+200,{w:700,size:32,col:"coral",align:"center"});});}
      const pA=ag_in(t,tHour-0.1,0.5);if(pA>0){const b=dp_page(ctx,940,150,900,550,{tool:"pim",name:"Privileged Identity Management",where:"My roles · Groups",title:"Eligible assignments",a:pA});
        dp_rows(ctx,b.x,b.y,[{t:"Group",w:560},{t:"",w:276}],[[{mono:true,t:"admin_account_settings"},{pill:"Activate",col:"cyan"}],[{mono:true,t:"admin_production_settings"},{pill:"Activate",col:"grey"}]],{a:pA});
        withA(ctx,pA,()=>{rr(ctx,b.x-12,b.y+50,b.w+24,58,12);ctx.strokeStyle=rgba(DP.F.cyan,0.9);ctx.lineWidth=2.4;ctx.stroke();
          dp_T(ctx,"Duration",b.x,b.y+222,{w:600,size:28,col:"mut"});dp_pill(ctx,b.x+170,b.y+222,"1 hour","amber",{a:ag_in(t,tOne-0.1,0.4)});
          dp_T(ctx,"Reason",b.x,b.y+282,{w:600,size:28,col:"mut"});rr(ctx,b.x,b.y+300,b.w,62,12);ctx.fillStyle="rgba(4,14,18,0.6)";ctx.fill();ctx.strokeStyle=rgba(DP.F.cyan,0.6);ctx.lineWidth=1.6;ctx.stroke();
          const rs="Read the token report",n=Math.round(rs.length*u3(t,tWhy-0.1,1.2));if(n>0)dp_T(ctx,rs.slice(0,n),b.x+20,b.y+342,{w:600,size:28});});}
      pg_who(ctx,940,740,"Jun Park",{col:"green",sub:"Approved",subCol:"green",a:ag_in(t,tAppr-0.1,0.4),k:ag_spr(t,tAppr-0.1,0.5)});}},
    // the hall again: within seconds the admin account is in the group; an alert to the platform team; Databricks reads its groups
    // as it signs in; then it signs out, and when the hour is up the directory takes it out of the group
    {cut:true,at:tSec-0.4,place:"pgHall",keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){
      const inU=u3(t,tIn-0.7,0.7),outU=u3(t,tTakes,0.8),on=ag_in(t,tIn,0.4)*(1-ag_in(t,tTakes+0.6,0.4)),pE=[898,675],sE=pg_slotEnd(0),pillA=1-ag_in(t,tLike-0.3,0.5);
      pg_slots(ctx,{on:[on]});pg_dots(ctx,pE,sE,"amber",1,0.7);
      for(const [g,from,to] of [[inU,pE,sE],[outU,sE,pE]])if(g>0&&g<1){const q=ag_sine(g),x=lerp(from[0],to[0],q),y=lerp(from[1],to[1],q);
        ctx.save();ctx.globalAlpha*=Math.min(1,g*6)*(1-ag_in(g,0.85,0.15));dp_panel(ctx,x-30,y-30,60,60,{col:"amber",r:30,glowR:24});ctx.translate(x,y);ctx.scale(0.42,0.42);dp_personPic(ctx,0,8,"amber");ctx.restore();}
      pg_admin(ctx,900,600,"Sam Okafor (admin)",{on,touch:ag_io(t,tSignsIn-0.2,tSignsIn+1.4,0.3)});
      dp_pill(ctx,900,580,"Until 11:42","amber",{a:ag_in(t,tIn+0.2,0.5)*(1-ag_in(t,tUp,0.4))});dp_pill(ctx,900,580,"Ended 11:42","grey",{a:ag_in(t,tUp+0.2,0.4)*pillA});
      dp_pill(ctx,1120,580,"Signed out","grey",{a:ag_in(t,tSO-0.1,0.4)*pillA});
      // the alert, to the platform team's shared address
      pg_email(ctx,980,130,880,{a:ag_io(t,tAlert-0.2,tReads-0.5,0.5),k:ag_spr(t,tAlert-0.2,0.6),from:"PIM · to the platform team",subject:"Sam Okafor (admin) activated a group",
        lines:["Who: Sam Okafor (admin)","Group: admin_account_settings","Why: Read the token report","Approved by: Jun Park","Until: 11:42"],
        on:[ag_in(t,tWho-0.1,0.3),ag_in(t,tWhich-0.1,0.3),ag_in(t,tWhyA-0.1,0.3),ag_in(t,tWhoA-0.1,0.3),ag_in(t,tUntil-0.1,0.3)]});
      // for this hour, he can read the report
      const qA=ag_io(t,tSignsIn-0.2,tOut-0.3,0.5);if(qA>0){const b=dp_page(ctx,980,130,880,390,{tool:"databricks",name:"Azure Databricks",where:"Account console · Security",title:"Token report",a:qA}),op=ag_in(t,tCan-0.1,0.6);
        withA(ctx,qA,()=>{withA(ctx,1-op,()=>dp_lock(ctx,b.x+b.w/2,b.y+70,80,"coral",0));withA(ctx,op,()=>dp_lock(ctx,b.x+b.w/2,b.y+70,80,"green",op));
          dp_T(ctx,"Account admins only",b.x+b.w/2,b.y+170,{w:700,size:32,col:"coral",align:"center",a:1-op});dp_T(ctx,"Open until 11:42",b.x+b.w/2,b.y+170,{w:700,size:32,col:"green",align:"center",a:op});});}
      // like a new pattern in the hotel's lock: it opens one stay, and ends with it
      const lA=ag_io(t,tPat-0.4,sc.dur-0.6,0.5);if(lA>0){const sw=tPat+0.2,o={a:lA,k:ag_spr(t,tPat-0.4,0.6),mini:true,gSeed:13};
        if(t<sw){o.seed=9;o.pattern=1;o.pOut=u3(t,tPat-0.4,0.6);}else{o.seed=13;o.pattern=u3(t,sw,0.9);}
        o.guest=u3(t,tOpens-0.3,1.0);o.check=u3(t,tOpens+0.7,0.6)*(1-ag_in(t,tEnds-0.3,0.3));o.verdict=ag_in(t,tOpens+1.0,0.4)*(1-ag_in(t,tEnds-0.3,0.3));o.gOut=u3(t,tEnds,0.8);
        pg_reader(ctx,980,170,700,o);}}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);pg_kick(ctx,S,"Power you borrow",ag_io(t,0.9,5.0,0.6));});

/* ================================================================ 7 · No token to copy */
// the account's token report on 19 October: owner, created, expires, last used; six people's, for their command lines, and Jun's
const PG_TOKENS=[["N. Rahman","3 Feb 2026","3 Feb 2028","19 Oct"],["J. Ferreira","12 May 2025","12 May 2027","16 Oct"],["L. Brandt","20 Jan 2026","20 Jan 2027","19 Oct"],
  ["S. Ito","8 Sep 2025","8 Sep 2027","15 Oct"],["R. Duarte","2 Mar 2026","2 Mar 2027","9 Oct"],["K. Osei","14 Jul 2025","14 Jul 2027","19 Oct"],["Jun Park","14 Mar 2024","Never","19 Oct"]];
// the report's page: each row shown (shown[j]) and ended by its owner (ended[j], 0 to 1); Jun's row lit in coral (jun) and stamped (stamp)
function pg_report(ctx,a,o){if(!(a>0.004))return null;o=o||{};const b=dp_page(ctx,90,130,900,654,{tool:"databricks",name:"Azure Databricks",where:"Account console · Security",title:"Token report",a});
  const sh=o.shown||[],en=o.ended||[],jl=clamp(o.jun||0,0,1);
  dp_rows(ctx,b.x,b.y,[{t:"Owner",w:280},{t:"Created",w:210},{t:"Expires",w:200},{t:"Last used",w:146}],PG_TOKENS.map((r,j)=>{const s=sh[j]==null?1:sh[j],e=en[j]||0,c=e>0.5?"mut":j===6&&jl>0.5?"coral":"ink";
    return[{t:r[0],col:c,a:s},{t:r[1],col:e>0.5?"mut":"ink",a:s},{t:r[2],col:c,a:s},{t:r[3],col:e>0.5?"mut":"ink",a:s*(1-e)*(j===6?1-clamp((o.stamp||0)*2,0,1):1)}];}),{a});
  withA(ctx,a,()=>{en.forEach((e,j)=>{if(e>0)dp_pill(ctx,b.x+690,b.y+58*(j+1)+30,"Ended","grey",{a:e*(sh[j]==null?1:sh[j])});});
    if(jl>0)withA(ctx,jl,()=>{ctx.strokeStyle=rgba(DP.F.coral,1);ctx.shadowColor=rgba(DP.F.coral,0.8);ctx.shadowBlur=10;ctx.lineWidth=2.4;rr(ctx,b.x-12,b.y+58*7-12,b.w+24,54,12);ctx.stroke();});
    if(o.stamp>0)pg_stamp(ctx,b.x+740,b.y+58*7+20,"Ended","coral",o.stamp);});
  return b;}
scene("tokens",(ctx,S,t,sc)=>{const C=sc.cues;
  const tCmd=wAt(sc,"seven","for their command lines"),tJuns=wAt(sc,"seven","and Jun's"),tBrowser=C.browser,tThrough=wAt(sc,"browser","through the browser"),tSame=wAt(sc,"browser","the same passkey"),
    tCli=C.cli,tShort=wAt(sc,"cli","short passes"),tStore=wAt(sc,"cli","the computer's secure store"),tCopy=wAt(sc,"cli","nothing to copy"),
    tSix=C.six,tEnd=wAt(sc,"six","end their own tokens"),tWws=wAt(sc,"jun","Workloads without secrets"),tEndsIt=wAt(sc,"jun","ends it"),tNov=wAt(sc,"jun","third of November"),
    tOff=C.off,tSw=wAt(sc,"off","switches on"),tThirty=wAt(sc,"off","thirty minutes"),tJA=wAt(sc,"off","Jun approves"),tTurns=wAt(sc,"off","turns personal tokens off"),
    tNone=C.none,tMake=wAt(sc,"none","no one can make");
  const shown=PG_TOKENS.map((r,j)=>ag_in(t,C.seven+0.2+0.12*j,0.4)),ended=PG_TOKENS.map((r,j)=>j<6?ag_in(t,tEnd+0.25*j,0.4):0);
  const shots=[
    // the hall, that morning: the token report shows seven personal tokens, six people's for their command lines, and Jun's
    {at:0,later:true,place:"pgHall",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){pg_platName(ctx,1);
      const ra=ag_in(t,0.9,0.5)*(1-ag_in(t,tBrowser-0.9,0.5)),b=pg_report(ctx,ra,{shown,jun:ag_in(t,tJuns-0.1,0.4)});
      if(b){const ca=ra*ag_in(t,tCmd-0.1,0.4);withA(ctx,ca,()=>{ctx.strokeStyle=rgba(DP.F.cyan,0.9);ctx.lineWidth=2.4;rr(ctx,b.x-12,b.y+58-12,b.w+24,58*6-4,12);ctx.stroke();});
        dp_pill(ctx,b.x+b.w,264,"Command lines","cyan",{align:"right",a:ca});}}},
    // the data team's room: Noor's command line signs in through the browser, with the same passkey; its short passes go in the secure store
    {at:tBrowser-0.4,place:"pgTeam",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      dp_person(ctx,"noor",330,600,1.0,{t,cut:PG_DESK,gaze:[3,1],nod:0.03});
      dp_slip(ctx,120,170,"Noor Rahman · data architect","cyan",{a:ag_io(t,tBrowser+0.1,tSix-0.8,0.5),ink:true});
      pg_term(ctx,920,160,960,280,{a:ag_in(t,tBrowser-0.1,0.5),title:"Terminal",lines:[["$ databricks auth login --host",u3(t,tBrowser+0.3,0.9)],["https://adb-1234567890123456.7.azuredatabricks.net",u3(t,tBrowser+1.2,1.0)]]});
      const sA=ag_io(t,tThrough-0.2,tCli-0.4,0.5),ok=ag_in(t,tSame+0.6,0.4);
      pg_signin(ctx,920,500,760,{a:sA,k:ag_spr(t,tThrough-0.2,0.6),face:u3(t,tSame-0.1,0.9),tick:ok,signed:ag_in(t,tSame+0.9,0.4)});
      dp_pill(ctx,1880,500,"Signed in","green",{align:"right",a:ag_in(t,tSame+1.1,0.4)});
      // the CLI's own short passes, an hour each, kept in the computer's secure store
      const pv=u3(t,tStore-0.2,1.0),pa=ag_in(t,tShort-0.1,0.5)*(1-ag_in(pv,0.35,0.3));
      dp_sealed(ctx,920,lerp(500,700,ag_sine(pv)),560,"A pass from the CLI",{sub:"Ends after 1 hour",a:pa});
      pg_store(ctx,920,720,760,{a:ag_in(t,tStore-0.6,0.5)});
      dp_pill(ctx,1880,690,"Nothing to copy or paste","green",{align:"right",a:ag_in(t,tCopy-0.1,0.5)});}},
    // the hall again: the six end their own tokens; Jun's runs the nightly job until 3 November; that afternoon, personal tokens off
    {at:tSix-0.4,place:"pgHall",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      const on=ag_in(t,tSw+0.3,0.5)*(1-ag_in(t,tNone+1.2,0.6));pg_platName(ctx,1);pg_slots(ctx,{a:ag_in(t,tOff+0.15,0.5),on:[0,on,on,on]});
      const ra=1-ag_in(t,tOff-0.4,0.5);pg_report(ctx,ra,{ended,jun:1,stamp:u3(t,tEndsIt+0.1,0.5)});
      dp_tag(ctx,122,800,"Workloads without secrets","grey",{a:ra*ag_in(t,tWws-0.2,0.5)});
      pg_tag(ctx,S,"3 November 2026",ag_in(t,tNov-0.3,0.5));
      // that afternoon: the workspaces' settings switched on for thirty minutes, Jun's approval, and personal tokens turned off
      const oA=ag_in(t,tSw-0.2,0.5);if(oA>0){pg_admin(ctx,980,170,"Sam Okafor (admin)",{a:oA,on});dp_pill(ctx,1470,240,"30 minutes","amber",{a:ag_in(t,tThirty-0.1,0.4)*on});
        dp_pill(ctx,1470,306,"Approved by Jun Park","green",{a:ag_in(t,tJA-0.1,0.4)});
        const gA=ag_in(t,tTurns-1.2,0.5),b=dp_page(ctx,980,370,880,420,{tool:"databricks",name:"Azure Databricks",where:"production · Settings",title:"Advanced",a:gA}),off=u3(t,tTurns+0.4,0.6);
        withA(ctx,gA,()=>{dp_switch(ctx,b.x,b.y+8,1-off,{col:"cyan",label:"Personal Access Tokens"});
          dp_pill(ctx,b.x+b.w,b.y+40,"Confirm","cyan",{align:"right",a:ag_io(t,tTurns+0.1,tTurns+1.4,0.3)});
          dp_pill(ctx,b.x,b.y+130,"And in test and development","grey",{a:ag_in(t,tTurns+1.0,0.5)});
          dp_pill(ctx,b.x,b.y+196,"No one can make or use one","green",{a:ag_in(t,tMake-0.1,0.5)});});}}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);pg_kick(ctx,S,"No token to copy",ag_io(t,0.4,4.6,0.6));});

/* ================================================================ 8 · Ends with the stay */
scene("close",(ctx,S,t,sc)=>{const C=sc.cues;
  const tLost=wAt(sc,"hotels","a lost card opened nothing"),tUni=C.uni,tJob=wAt(sc,"uni","ends with the job"),tTask=wAt(sc,"uni","ends with the task"),tToken=C.token,tTake=C.take;
  const toDoor=[PG_PLAT.door[0]-8,PG_PLAT.door[1]+PG_PLAT.door[3]*0.45];
  const shots=[
    // the hotel's corridor of the 1970s: Room 312's card lock, green; the camera glides back past the doors, each with its own
    {at:0,place:"pgCorridor",keys:[[0,990,500,1.55],[1.2,960,540,1.0]],d:3.4,push:0,draw(ctx,t){pg_plate(ctx);pg_sideLocks(ctx,1);pg_cardLock(ctx,1,true);
      pg_tag(ctx,S,"A hotel · 1970s",ag_io(t,0.6,tUni-1.0,0.6));
      const la=ag_in(t,tLost-0.1,0.6);pg_punch(ctx,560,740,190,{seed:5,rot:0.22,rim:"coral",rimA:la,a:la});}},
    // the university's hall: what now ends with the stay, by the platform's door, where the film's first tags were coral
    // the three leave as the end card comes in, so its words show over the hall alone
    {at:tUni-0.4,place:"pgHall",keys:[[0,960,540,1.0]],push:0.02,draw(ctx,t){pg_platName(ctx,1);const ea=1-ag_in(t,tTake-0.5,0.6);
      dp_tag(ctx,560,300,"A place that ends with the job","green",{a:ag_in(t,tJob-0.1,0.5)*ea,to:toDoor,p:ag_in(t,tJob+0.2,0.6)});
      dp_tag(ctx,560,420,"Power that ends with the task","green",{a:ag_in(t,tTask-0.1,0.5)*ea,to:toDoor,p:ag_in(t,tTask+0.2,0.6)});
      dp_tag(ctx,560,540,"No token left to outlive anyone","green",{a:ag_in(t,tToken+0.1,0.5)*ea,to:toDoor,p:ag_in(t,tToken+0.4,0.6)});}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  pg_end(ctx,S,t,tTake-0.3,"People and groups","People sign in once, with no password to steal;","power is borrowed, not kept.","Film 5 of 9 · Locks before the data · Learning Data");});

// chapters that open in the room the one before ends in: the camera glides on, and only what changes fades
ag_cutInto(["signin","power","tokens"]);
