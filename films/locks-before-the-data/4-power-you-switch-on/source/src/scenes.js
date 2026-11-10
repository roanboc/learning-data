/* ===== Power you switch on: the eight chapters =====
   Each chapter is cut into shots (ag_shots), each a place under a slow camera; every moment waits for a word of the narration
   (wAt(sc, line, word)), so the pictures stay with the voice if it's recorded again. tools/score.py times its sounds to the same words.
   The opening story: robbers of the 1870s take bankers from their homes at night (Taken at night); James Sargent's lock with a clock
   in it, and Great Barrington in May 1875 (A lock with a clock), to the title. Then the platform's great power (Great power), a second
   account (A second account), how its power is switched on (Switched on for a task), one morning's task (One morning), who gets one
   (Who gets one), and back to the story (Only at its hour). The 1870s are in pw_past.js; the hall's two rooms and what is shown in
   them in pw_hall.js. In the team's room the board reads left to right, everyday account, admin account, power, with a lock between
   each step; to switch power on, the room makes way for the card (pw_adminXY, pw_shelfXY). In one room the camera glides and only what
   changes fades or slides; between rooms the film cuts, and it dissolves only where the whole picture changes (the 1870s into the
   hall). People are drawn in the film's own time (T), so a chapter that glides on from the last one draws them as it left them. */

const PW_TITLE="Power you switch on";
const PW_NAMES={sam:"Sam Okafor",jun:"Jun Park"};
const PW_MAIN=PW_HOUSES[1],PW_GBMAIN=PW_GB_HOUSES[1];
// lanterns coming down the side street to the main house's door, and the one that leaves with him, up the street
const PW_TO_DOOR=[[[2010,846],[1500,842],[1100,838],[900,800],[800,738]],[[2080,850],[1580,846],[1180,840],[960,806],[858,748]],[[2160,846],[1660,842],[1260,836],[1020,808],[730,744]]];
const PW_UP_ST=[[858,748],[960,806],[1300,842],[2100,846]];
// Great Barrington: lanterns come along the side street from the left to the Delands' door; one takes Fred up the street to his bank
const PW_GB_TO_DOOR=[[[-80,846],[300,844],[620,830],[790,744]],[[-140,850],[260,846],[600,834],[720,750]],[[-200,846],[220,842],[560,830],[846,752]]];
const PW_GB_UP=[[790,744],[900,812],[1150,822],[1450,772],[1630,706]];
// two others who were given one power each, for one task, and kept it
const PW_OTHERS=[{x:640,y:600,name:"A contractor"},{x:1110,y:600,name:"A tester"}];
// where a coral line from the dark comes down into Jun's everyday badge, and into his admin badge
const PW_TAKE_E=980,PW_TAKE_A=1450;

/* ---------------------------------------------------------------- what every chapter uses */
// a place and its year, top left, on a small panel (screen space)
function pw_where(ctx,S,s,a){if(!(a>0))return;setScreen(ctx,S);dp_tag(ctx,72,60,s,"grey",{a});}
// the film's kicker, top left, in the hall (screen space)
function pw_kick(ctx,S,a){if(!(a>0))return;setScreen(ctx,S);dp_kicker(ctx,"Locks before the data",PW_TITLE,{a});}
// Sam and Jun at the left of the team's room, Sam a step behind Jun, both looking at their board; T the film's time
function pw_two(ctx,T,o){o=o||{};const [jx,jy,js]=PW_T.jun,[sx,sy,ss]=PW_T.sam;
  dp_person(ctx,"sam",sx,sy,ss,{t:T+0.7,gaze:o.samGaze||[3,-2],nod:o.samNod||0});
  dp_person(ctx,"jun",jx,jy,js,{t:T,gaze:o.junGaze||[3,-2],nod:o.junNod||0});}
// a specialist's everyday badge; their admin badge, where the room has it (v: 0 the chain, 1 made way for switching on)
function pw_everyday(ctx,who,o){pw_id(ctx,PW_T.E,PW_T.row[who],PW_T.bw,Object.assign({name:PW_NAMES[who]},o));}
function pw_admin(ctx,who,o,v){const p=pw_adminXY(who,v||0);pw_id(ctx,p[0],p[1],PW_T.bw,Object.assign({name:PW_NAMES[who],kind:"ADMIN ACCOUNT",amber:1},o));}
// where a badge's right edge meets the middle of its row
const pw_eR=who=>[PW_T.E+PW_T.bw,PW_T.row[who]+75];
const pw_aR=(who,v)=>{const p=pw_adminXY(who,v||0);return[p[0]+PW_T.bw,p[1]+75];};
// the shelf's three tokens where the room has them (v); o(i) each one's options, or null to leave it out
function pw_shelf(ctx,v,o){PW_POWERS.forEach((l,i)=>{const q=o(i);if(!q)return;const p=pw_shelfXY(i,v);pw_token(ctx,p[0],p[1],l,q);});}
// the shelf's power hanging from both everyday badges (p draws the lines on, a their opacity)
const PW_SHELF_IN=[PW_T.S,PW_T.shelfY[1]+28];
function pw_hangE(ctx,p,a){if(!(a>0)||!(p>0))return;ctx.save();ctx.globalAlpha*=a;for(const w of ["jun","sam"])pw_hang(ctx,pw_eR(w),PW_SHELF_IN,p);ctx.restore();}
// someone in the dark takes one of Jun's accounts: a coral tag, "Taken", comes down from above the frame on a dotted line, which
// goes on into the top of the badge (p draws it on, a its opacity)
function pw_take(ctx,x,p,a){if(!(p>0)||!(a>0))return;pw_reach(ctx,[x,-30],[x,PW_T.row.jun],p,{a});
  dp_pill(ctx,x,lerp(-20,62,ag_eo(clamp(p/0.6,0,1))),"Taken","coral",{align:"center",a});}
// Jun's daily work on his everyday account: green pills under its badge (a(i) each one's opacity; glow a green light under them)
function pw_work(ctx,a,glow){let px=PW_T.E;["Code","Tests","Jobs"].forEach((s,i)=>{const w=dp_pill(ctx,px,352,s,"green",{a:a(i)});if(glow>0)dp_halo(ctx,px+w/2,340,90,"green",0.22*glow*a(i));px+=w+14;});}
// Jun's passkey: a sealed card with its gold chip, under his admin badge (k springs it in)
function pw_passkey(ctx,a,k){if(!(a>0))return;const x=PW_T.A,y=PW_T.row.jun+172;withA(ctx,a,()=>{ctx.save();ag_about(ctx,x+200,y+48,lerp(0.7,1,clamp(k,0,1.15)));
  dp_sealed(ctx,x,y,400,"Passkey",{});dp_chip(ctx,x+300,y+20);ctx.restore();});}
// the token's way from the shelf, made way, into the card's Power row: a curve that passes under Sam's admin badge
function pw_tokAt(u){const a=pw_shelfXY(0,1),c=[1180,640],b=pw_cardTok(),v=ag_sine(clamp(u,0,1));
  return[(1-v)*(1-v)*a[0]+2*v*(1-v)*c[0]+v*v*b[0],(1-v)*(1-v)*a[1]+2*v*(1-v)*c[1]+v*v*b[1]];}
// a coral rim round a lit window: a family in danger
function pw_rim(ctx,x,y,w,h,a){if(!(a>0))return;ctx.save();ctx.globalAlpha*=clamp(a,0,1);ctx.strokeStyle=rgba(DP.F.coral,1);ctx.shadowColor=rgba(DP.F.coral,0.9);ctx.shadowBlur=14;ctx.lineWidth=4;
  rr(ctx,x-9,y-9,w+18,h+18,8);ctx.stroke();ctx.restore();}
// morning in the hall: a pale light from high up, through the panes
function pw_morning(ctx,a){if(!(a>0))return;pw_glow(ctx,1500,-80,1100,[236,226,200],0.06*a);pw_glow(ctx,300,-120,800,[200,230,236],0.04*a);}
// morning at the bank: dawn in its window, and a pale light across the wall
function pw_bankMorning(ctx,a){if(!(a>0))return;const [wx,wy,ww,wh]=PW_BANKWIN;ctx.save();ctx.globalAlpha*=a;ctx.beginPath();ctx.moveTo(wx+3,wy+wh-3);ctx.lineTo(wx+3,wy+ww/2);
  ctx.arc(wx+ww/2,wy+ww/2,ww/2-3,Math.PI,0);ctx.lineTo(wx+ww-3,wy+wh-3);ctx.closePath();const g=ctx.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"rgba(120,160,186,0.8)");
  g.addColorStop(1,"rgba(232,176,122,0.8)");ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=rgba(PW_C.trim,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(wx+ww/2,wy+6);ctx.lineTo(wx+ww/2,wy+wh);
  ctx.moveTo(wx,wy+wh*0.55);ctx.lineTo(wx+ww,wy+wh*0.55);ctx.stroke();ctx.restore();pw_glow(ctx,wx+ww/2,wy+wh*0.6,760,[236,200,160],0.09*a);}
/* bonds on the bank's desk, three sheets lying on its top; u from 0 to 1 the robbers take them: two lift and go to the left, the
   way the lantern leaves, and the third is pushed askew and stays */
function pw_bonds(ctx,u){const S0=[[262,671,-0.10],[356,666,0.06],[452,673,-0.04]];
  S0.forEach(([x,y,r],i)=>{let v=i<2?ag_sine(clamp((u-i*0.18)/0.7,0,1)):0,a=1-clamp((v-0.55)/0.45,0,1),px=x-300*v*v,py=y-46*Math.sin(Math.PI*Math.min(1,v*1.2)),rot=r+(i<2?-0.5*v:0);
    if(i===2){const w=ag_sine(clamp((u-0.15)/0.5,0,1));px=x+18*w;rot=r+0.28*w;}if(a<=0)return;
    ctx.save();ctx.globalAlpha*=a;ctx.translate(px,py);ctx.rotate(rot);ctx.transform(1,0,-0.35,1,0,0);ctx.shadowColor="rgba(0,0,0,0.35)";ctx.shadowBlur=6;ctx.shadowOffsetY=2;
    ctx.fillStyle="rgb(226,216,190)";ctx.fillRect(-48,-11,96,22);ctx.shadowColor="transparent";ctx.strokeStyle="rgba(120,96,62,0.8)";ctx.lineWidth=1.4;ctx.strokeRect(-44,-8,88,16);
    ctx.fillStyle="rgba(120,96,62,0.55)";ctx.fillRect(-36,-3,44,2);ctx.fillRect(-36,2,30,2);ctx.fillStyle="rgba(150,90,60,0.7)";ctx.beginPath();ctx.ellipse(30,0,6,4,0,0,TAU);ctx.fill();ctx.restore();});}
/* last night's file, opened on a clear pane: its rows run past, faint, and stop on one band (o.run 0 to 1); the band shows the row's
   number, the student number and the date of birth, the date turning coral as o.hot comes in; nothing else of the row is shown */
function pw_fileView(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=270;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,clamp(o.k,0,1.15)));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20});dp_T(ctx,"Last night's file",x+28,y+50,{w:700,size:32});
  const run=clamp(o.run||0,0,1),u=ag_eo(run),off=(1-u)*40*58,band=clamp((run-0.9)/0.1,0,1),my=y+176;
  ctx.save();rr(ctx,x+14,y+72,w-28,h-86,12);ctx.clip();
  for(let i=-3;i<=3;i++){const ry=my+i*58+(off%58);if(i===0&&band>=1)continue;const fa=0.24*(1-Math.min(1,Math.abs(ry-my)/170))*(i===0?1-band:1);
    ctx.fillStyle="rgba(200,236,238,"+fa.toFixed(3)+")";for(const [bx,bw] of [[36,150],[230,120],[430,250]]){rr(ctx,x+bx,ry-16,bw,16,8);ctx.fill();}}
  ctx.restore();
  if(band>0){ctx.save();ctx.globalAlpha*=band;dp_panel(ctx,x+16,my-42,w-32,62,{col:"cyan",r:14,glowA:0.9});const hot=clamp(o.hot||0,0,1),dw=dp_tw(ctx,"31 February 2006",{w:700,size:30});
    dp_T(ctx,"Row 9,317",x+36,my,{w:700,size:30});dp_T(ctx,"S-21877",x+230,my,{w:700,size:30});
    if(hot<1)dp_T(ctx,"31 February 2006",x+430,my,{w:700,size:30,a:1-hot});if(hot>0){dp_T(ctx,"31 February 2006",x+430,my,{w:700,size:30,col:"coral",a:hot});
      ctx.save();ctx.globalAlpha*=hot;ctx.strokeStyle=rgba(DP.F.coral,1);ctx.shadowColor=rgba(DP.F.coral,0.8);ctx.shadowBlur=10;ctx.lineWidth=3;ctx.lineCap="round";
      ctx.beginPath();ctx.moveTo(x+430,my+10);ctx.lineTo(x+430+dw,my+10);ctx.stroke();ctx.restore();}
    ctx.restore();}
  ctx.restore();}
// the registrar's office, top right: a pane with its name
function pw_office(ctx,a,o){o=o||{};if(!(a>0))return;const [x,y,w,h]=PW_P.office;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,clamp(o.k,0,1.15)));
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:20});dp_T(ctx,"Registrar's office",x+28,y+50,{w:700,size:30,col:"cyan"});ctx.restore();}
// the platform's three powers, each hanging under its place like a tab: the storage, the admin settings, a table's history
function pw_placeTokens(ctx,o){const [sx,sy,,sh]=PW_P.store,[gx,gy,,gh]=PW_P.settings,[hx,hy,,hh]=PW_P.history;
  [[sx+40,sy+sh-14],[gx+70,gy+gh+14],[hx+70,hy+hh+14]].forEach(([x,y],i)=>{const q=o(i);if(q)pw_token(ctx,x,y,PW_POWERS[i],q);});}

/* ================================================================ 1 · Taken at night */
scene("taken",(ctx,S,t,sc)=>{const C=sc.cues,end=sc.dur;
  const tVault=C.vault,tRoom=wAt(sc,"vault","a strong room"),tRow=wAt(sc,"dial","a row of numbers"),tFew=C.few,tWay=wAt(sc,"robbers","a way round");
  const tHome=C.home,tHold=wAt(sc,"hold","hold his family"),tTake=wAt(sc,"hold","take him"),tMake=wAt(sc,"hold","make him open");
  const tNum=wAt(sc,"stop","the right numbers"),tMan=wAt(sc,"stop","the right man"),tOpen=wAt(sc,"stop","open the door"),tDanger=wAt(sc,"danger","in danger");
  const M=PW_MAIN,[dx,dy,dw,dh]=pw_houseDoor(M),wins=pw_houseWins(M),V=PW_VAULT;
  const shots=[
    // a small town's main street at night, its bank across the street
    {at:0,place:"pwTown",keys:[[0,960,540,1.0],[1.6,1020,520,1.07]],d:4.0,push:0,draw(ctx,t){}},
    // inside the bank: its vault behind an iron door, the dial, the three slots; the numbers, known to a few; a lantern passes the window
    {cut:true,at:tVault-0.3,place:"pwBank",keys:[[0,1000,520,1.04]],push:0.02,draw(ctx,t){
      const dial=ag_keys(t,[[tRow-0.2,0],[tRow+0.7,1.3],[tRow+1.5,-0.4],[tRow+2.3,0.9]]),slots=clamp((t-tRow+0.1)/0.8,0,3);
      pw_door(ctx,V.x,V.y,V.r,{dial,slots});
      dp_tag(ctx,700,330,"Vault","grey",{to:[972,430],p:ag_in(t,tRoom-0.2,0.6),a:ag_io(t,tRoom-0.4,C.robbers-0.4,0.5)});
      dp_slip(ctx,640,436,"Known to a few","cyan",{a:ag_io(t,tFew-0.2,tHome,0.5)});
      const u=(t-(tWay-0.6))/2.6;if(u>0&&u<1){const [wx,wy,ww,wh]=PW_BANKWIN;ctx.save();ctx.beginPath();ctx.moveTo(wx,wy+wh);ctx.lineTo(wx,wy+ww/2);ctx.arc(wx+ww/2,wy+ww/2,ww/2,Math.PI,0);
        ctx.lineTo(wx+ww,wy+wh);ctx.closePath();ctx.clip();pw_lantern(ctx,lerp(wx-60,wx+ww+60,u),wy+290,Math.sin(Math.PI*u),{r:130,ring:24});ctx.restore();}}},
    // the side street: one house's windows lit late; lanterns come down the street to its door; the family held; he's taken away
    {cut:true,at:tHome-0.3,place:"pwHouses",keys:[[0,980,540,1.06],[tTake+0.3,1060,540,1.1]],d:2.6,push:0,draw(ctx,t){
      const up=1-ag_in(t,tHold+0.2,0.9);pw_lit(ctx,...wins[0],up);pw_lit(ctx,...wins[1],up);pw_lit(ctx,...wins[2],1);pw_lit(ctx,...wins[3],1);
      const door=ag_in(t,tHold-0.8,0.8);if(door>0)pw_lit(ctx,dx+dw-18,dy+6,14,dh-10,door*0.9,{r:3});
      PW_TO_DOOR.forEach((P,i)=>{const t0=tHome+0.4+i*0.35,u=clamp((t-t0)/4.0,0,1);if(u<=0)return;let p=pw_along(P,ag_sine(u)),a=ag_in(t,t0,0.5);
        if(i===1){const v=clamp((t-tTake)/4.2,0,1);if(v>0)p=pw_along(PW_UP_ST,ag_sine(v));a*=1-ag_in(t,tTake+3.4,0.6);}
        pw_lantern(ctx,p[0],p[1],a,{r:80,ring:16});});}},
    // the bank again: the dial turns, the slots fill, the bolts slide back
    {cut:true,at:tMake-0.3,place:"pwBank",keys:[[0,1000,520,1.04]],push:0.02,draw(ctx,t){
      const dial=ag_keys(t,[[tMake,0],[tMake+0.8,1.4],[tMake+1.6,-0.5],[tMake+2.4,0.8]]),slots=clamp((t-tMake-0.1)/0.8,0,3),bolts=1-ag_in(t,tMake+2.4,1.2);
      pw_door(ctx,V.x,V.y,V.r,{dial,slots,bolts,held:ag_in(t,tMake+2.2,0.6)});
      dp_pill(ctx,640,372,"Right numbers","coral",{a:ag_in(t,tNum-0.1,0.4)});dp_pill(ctx,640,452,"Right man","coral",{a:ag_in(t,tMan-0.1,0.4)});
      dp_pill(ctx,640,532,"Door open","coral",{a:ag_in(t,tOpen-0.1,0.4)});}},
    // every banker who knows them, and his family: a warm window in every house, each with a coral rim
    {cut:true,at:C.danger-0.3,place:"pwHouses",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      PW_HOUSES.forEach((h,i)=>{const w=pw_houseWins(h)[i%2?3:2];pw_lit(ctx,...w,1);pw_rim(ctx,...w,ag_in(t,tDanger-0.5+i*0.15,0.6));});}}];
  ag_shots(ctx,S,t,end,shots,0.6);
  pw_where(ctx,S,"The United States · 1870s",ag_in(t,0.9,0.6)*(1-ag_in(t,end-0.8,0.5)));});

/* ================================================================ 2 · A lock with a clock */
scene("clock",(ctx,S,t,sc)=>{const C=sc.cues,br=C.breath;
  const tBuilds=wAt(sc,"sargent","builds clocks"),tSets=wAt(sc,"evening","sets the hour"),tUntil=C.until,tNoOne=wAt(sc,"until","no one can open"),tEven=wAt(sc,"until","even with");
  const tFirst=C.first,tFitted=wAt(sc,"first","the first is fitted"),tFri=C.friday,tEight=wAt(sc,"friday","eight robbers"),tHoldD=wAt(sc,"friday","hold the Deland family");
  const tTakeF=wAt(sc,"fred","take Fred Deland"),tTurns=C.turns,tWont=wAt(sc,"turns","won't move"),tHolds=C.holds,tThree=wAt(sc,"holds","put on three days");
  const tBonds=wAt(sc,"flee","a few bonds"),tFled=wAt(sc,"flee","and flee"),tShut=wAt(sc,"flee","the vault stays shut"),tNothing=C.nothing,tThou=wAt(sc,"sells","in the thousands");
  const tSame=C.same,tGreat=wAt(sc,"accounts","greatest power"),tHour=wAt(sc,"accounts","every hour"),tWho=C.whoever,tAll=wAt(sc,"whoever","takes all of it"),tShutU=wAt(sc,"needs","shut until");
  const gw=pw_houseWins(PW_GBMAIN),V=PW_VAULT;
  const shots=[
    // Rochester, 1874: James Sargent at his bench, a lock with two clocks in it under the lamp; set each evening to the hour it may open
    {at:0,place:"pwBench",keys:[[0,960,540,1.0],[1.0,1010,560,1.08]],d:4.0,push:0,draw(ctx,t){
      dp_person(ctx,PW_SARGENT,1350,470,0.95,{t,light:"lamp",cut:690,flip:true,gaze:[-3,2],nod:0.05});
      pw_timeLock(ctx,810,540,380,150,{hours:ag_keys(t,[[tSets-0.1,12],[tSets+1.3,9]]),lit:ag_in(t,tBuilds-0.2,1.2)});
      dp_pill(ctx,1000,500,"Opens at 9:00","amber",{align:"center",a:ag_in(t,tSets+1.2,0.5)});}},
    // a vault's door, a frosted cutaway onto its time lock: the dial turns, the slots fill, and the bolts won't move before nine
    {cut:true,at:tUntil-0.3,place:"pwBank",keys:[[0,1150,470,1.3],[tFirst-0.3,960,540,1.0]],d:1.8,push:0,draw(ctx,t){
      const dial=ag_keys(t,[[tNoOne-0.2,0],[tNoOne+0.6,1.3],[tNoOne+1.4,-0.5],[tNoOne+2.2,0.9]]),slots=clamp((t-tNoOne)/0.75,0,3);
      pw_door(ctx,V.x,V.y,V.r,{dial,slots,held:ag_io(t,tEven,tFirst+0.2,0.5),cut:1,hours:9});
      dp_pill(ctx,1240,150,"Not before 9:00","coral",{align:"center",a:ag_io(t,tEven+0.2,tFirst-0.2,0.45)});
      dp_card(ctx,72,150,620,{kick:"26 May 1874",title:"Morrison, Illinois",sub:"The first fitted to a bank's vault"},{a:ag_in(t,tFitted-0.2,0.5),k:ag_spr(t,tFitted-0.2,0.6)});}},
    // Great Barrington, May 1875: lanterns at the Delands' door; the house held; a lantern takes Fred up the street to his bank
    {cut:true,at:tFri-0.3,place:"pwGB",keys:[[0,980,540,1.04],[tTakeF,1047,530,1.1]],d:3.0,push:0,draw(ctx,t){
      const up=1-ag_in(t,tHoldD+0.3,0.9);pw_lit(ctx,...gw[0],up);pw_lit(ctx,...gw[1],up);pw_lit(ctx,...gw[2],1);pw_lit(ctx,...gw[3],1);
      PW_GB_TO_DOOR.forEach((P,i)=>{const t0=tEight-1.0+i*0.3,u=clamp((t-t0)/3.2,0,1);if(u<=0)return;let p=pw_along(P,ag_sine(u));
        if(i===0){const v=clamp((t-tTakeF)/4.4,0,1);if(v>0)p=pw_along(PW_GB_UP,ag_sine(v));}
        pw_lantern(ctx,p[0],p[1],ag_in(t,t0,0.5),{r:80,ring:16});});}},
    // his bank: Fred by the vault; the dial turns, the slots fill, the bolts won't move; the time lock, put on three days before, holds them;
    // the robbers take a few bonds from the desk and flee, and the vault stays shut
    {cut:true,at:tTurns-0.3,place:"pwBank",keys:[[0,1000,520,1.06]],push:0.02,draw(ctx,t){
      pw_bonds(ctx,ag_in(t,tBonds-0.1,1.8));
      dp_person(ctx,PW_FRED,800,560,0.9,{t,light:"lamp",cut:792,gaze:[3,0],nod:0.04});
      const dial=ag_keys(t,[[tTurns,0],[tTurns+0.8,1.3],[tTurns+1.6,-0.5],[tTurns+2.4,0.8]]),slots=clamp((t-tTurns-0.1)/0.8,0,3);
      pw_door(ctx,V.x,V.y,V.r,{dial,slots,held:ag_in(t,tWont-0.2,0.5)*(1-ag_in(t,tShut,0.8)),cut:ag_in(t,tHolds-0.2,0.8),hours:9});
      dp_pill(ctx,1600,470,"Opens at 9:00","amber",{a:ag_in(t,tHolds+0.3,0.5)});
      ctx.save();setScreen(ctx,S);dp_card(ctx,72,170,480,{title:"Fitted on Tuesday",sub:"The robbers came on Friday"},{a:ag_in(t,tThree-0.2,0.5),k:ag_spr(t,tThree-0.2,0.6)});ctx.restore();
      const lu=clamp((t-tFled+0.2)/1.8,0,1);pw_lantern(ctx,lerp(470,-80,ag_sine(lu)),lerp(612,560,lu),ag_in(t,tTurns-0.3,0.4)*(1-ag_in(t,tFled+1.2,0.5)),{r:90,ring:18});
      const va=ag_in(t,tShut,0.5);if(va>0){dp_tick(ctx,1622,546,"green",ag_in(t,tShut,0.6));dp_pill(ctx,1656,560,"Vault held","green",{a:va});}}},
    // now, taking a banker from his home at night opens nothing: the windows warm, no rims; the lock sells in the thousands
    {cut:true,at:tNothing-0.3,place:"pwHouses",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      PW_HOUSES.forEach((h,i)=>{const w=pw_houseWins(h);pw_lit(ctx,...w[i%2?3:2],1);pw_lit(ctx,...w[i%2?0:1],ag_in(t,tNothing+0.6+i*0.4,0.9));});
      dp_card(ctx,1180,110,620,{title:"Sold in the thousands",sub:"Soon, banks expect one"},{a:ag_in(t,tThou-0.3,0.5),k:ag_spr(t,tThou-0.3,0.6)});}},
    // the university: Sam's and Jun's everyday accounts hold the platform's greatest power, every hour of every day
    {at:tSame-0.4,place:"pwTeam",keys:[[0,960,540,1.0]],push:0,draw(ctx,t){const T=t+sc.start;
      pw_two(ctx,T);
      const rOut=1-ag_in(t,tShutU,0.6),off=ag_in(t,tShutU+0.2,1.2);
      // the badges and the shelf leave before the title comes in over the room, so no word shows under it
      withA(ctx,1-ag_in(t,br-0.7,0.6),()=>{
        pw_hangE(ctx,ag_in(t,tGreat,0.8),1-off);
        pw_everyday(ctx,"sam",{});pw_everyday(ctx,"jun",{coral:ag_in(t,tWho+0.8,0.4)*rOut});
        pw_take(ctx,PW_TAKE_E,ag_in(t,tWho-0.1,1.0),rOut);
        const on=ag_in(t,tGreat-0.2,0.6)*(1-off);
        pw_day(ctx,PW_T.S,400,PW_T.sw,24*ag_in(t,tHour-0.1,2.4),{a:ag_in(t,tHour-0.3,0.4)*(1-off),label:"Every hour",la:ag_in(t,tHour+0.6,0.5)});
        pw_shelf(ctx,0,i=>({a:ag_in(t,tGreat-0.2+i*0.15,0.5),k:ag_spr(t,tGreat-0.2+i*0.15,0.6),on,coral:ag_in(t,tAll-0.2+i*0.12,0.4)*rOut}));});}}];
  const si=ag_shots(ctx,S,t,sc.dur,shots,0.6);
  const where=["Rochester, New York · 1874",null,"Great Barrington, Massachusetts · May 1875","Great Barrington, Massachusetts · May 1875",null,"The university"][si];
  if(where)pw_where(ctx,S,where,si===0?ag_in(t,0.9,0.6):si===5?ag_in(t,tSame+0.4,0.6)*(1-ag_in(t,br-0.6,0.4)):1);
  dp_title(ctx,S,t,br,PW_TITLE,"Great power, only for a task","FILM 4 OF 9 · LOCKS BEFORE THE DATA");});

/* ================================================================ 3 · Great power */
scene("great",(ctx,S,t,sc)=>{const C=sc.cues;
  const tGoes=wAt(sc,"catalog","goes through"),tReq=wAt(sc,"checks","every request"),tShows=wAt(sc,"checks","shows each person"),tMask=wAt(sc,"checks","masked"),tCant=C.cant,tStore=C.storage;
  const tNoMask=wAt(sc,"clear","no mask"),tName=wAt(sc,"clear","every name"),tDoor=C.door,tBack=wAt(sc,"door","shut that back door"),tSet=C.settings,tRest=C.restore,tBack2=wAt(sc,"restore","putting it back");
  const tPower=C.power,tKeepers=wAt(sc,"keepers","its keepers"),tSat=C.sat,tEveryday=wAt(sc,"sat","everyday accounts"),tEmail=wAt(sc,"email","their email"),tEach=wAt(sc,"others","each for one task"),tNever=wAt(sc,"others","never come back");
  const R=PW_P.ring,M=PW_P.mei,TB=PW_P.table;
  const shots=[
    // the catalog, the front door: it checks every request and shows each person what their role allows, masked where it must be;
    // the storage under it, every file in the clear; the back door; the admin settings; a table's history; the three powers by them
    {at:0,place:"pwPlat",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      pw_catalog(ctx,ag_in(t,0.2,0.8),{glow:ag_io(t,tReq-0.2,tShows+0.4,0.4)});
      const ma=ag_in(t,C.catalog+0.1,0.5)*(1-ag_in(t,tStore-0.6,0.6));
      if(ma>0){const A=[M[0]+PW_P.bw,M[1]+75],B=[R[0]-R[2],R[1]];withA(ctx,ma,()=>{dp_link(ctx,A,B,"cyan",ag_in(t,tGoes-0.3,0.7));
        const u=(t-tReq)/1.0;if(u>0&&u<1)dp_halo(ctx,lerp(A[0],B[0],u),lerp(A[1],B[1],u),34,"cyan",0.9);});}
      pw_id(ctx,M[0],M[1],PW_P.bw,{a:ma,k:ag_spr(t,C.catalog+0.1,0.6),kind:"REGISTRAR'S OFFICE",name:"Mei Tanaka"});
      const ta=ag_in(t,tGoes+0.2,0.6)*(1-ag_in(t,tStore-0.6,0.6)),tb=pw_table(ctx,...TB,{a:ta,k:ag_spr(t,tGoes+0.2,0.6)});
      if(ta>0)dp_halo(ctx,tb.x+390,tb.y+140,240,"violet",0.22*ag_io(t,tMask-0.2,tMask+1.6,0.4)*ta);
      pw_store(ctx,ag_in(t,tStore-0.3,0.6),{file:ag_in(t,tNoMask-0.4,0.6)});
      // a file opened: every name and every date of birth, in the clear
      const fa=ag_in(t,tName-0.3,0.5)*(1-ag_in(t,tDoor-0.3,0.6));
      if(fa>0){withA(ctx,fa,()=>dp_link(ctx,[PW_FILE[0],PW_FILE[1]-33],[PW_FILE[0],TB[1]+178],"cyan",ag_in(t,tName-0.3,0.6),{dot:false}));
        pw_table(ctx,...TB,{a:fa,k:ag_spr(t,tName-0.2,0.6),clear:true,title:"A file, in the clear"});}
      pw_door2(ctx,ag_in(t,tDoor-0.2,0.6),0,{glow:ag_io(t,tBack-0.2,tBack+1.2,0.3)});
      dp_card(ctx,1450,660,430,{kick:"Film 3 of 9",title:"Walls, doors and keys"},{a:ag_io(t,tBack-0.4,tSet-0.4,0.5),k:ag_spr(t,tBack-0.4,0.6)});
      pw_settings(ctx,ag_in(t,tSet-0.1,0.6),{});
      pw_history(ctx,ag_in(t,tRest-0.1,0.6),{back:ag_in(t,tBack2,1.6)});
      pw_placeTokens(ctx,i=>({a:ag_in(t,tPower+0.1+i*0.25,0.5),k:ag_spr(t,tPower+0.1+i*0.25,0.6)}));
      dp_card(ctx,72,260,520,{kick:"Data governance",title:"Keepers",sub:"The platform team"},{a:ag_in(t,tKeepers-0.3,0.5),k:ag_spr(t,tKeepers-0.3,0.6)});}},
    // until now, that power sat in Sam's and Jun's everyday accounts, the ones that open their email; some went to others too, never back
    {cut:true,at:tSat-0.3,place:"pwTeam",keys:[[0,960,540,1.0]],push:0,draw(ctx,t){const T=t+sc.start;
      pw_two(ctx,T);
      const on=ag_in(t,tEveryday-0.4,0.8);pw_hangE(ctx,on,1);
      PW_OTHERS.forEach((o,i)=>{const a=ag_in(t,tEach-0.3+i*0.4,0.6);if(a<=0)return;
        withA(ctx,a,()=>pw_hang(ctx,[o.x+PW_T.bw,o.y],[PW_T.S,PW_T.shelfY[i+1]+28],ag_in(t,tEach-0.1+i*0.4,0.8),{alpha:0.6}));
        pw_id(ctx,o.x,o.y,PW_T.bw,{a:a*0.78,name:o.name});dp_pill(ctx,o.x,800,"Never taken back","coral",{a:ag_in(t,tNever-0.2+i*0.3,0.4)});});
      const ic=ag_in(t,tEmail-0.2,0.6);pw_everyday(ctx,"sam",{icons:ic});pw_everyday(ctx,"jun",{icons:ic});
      pw_shelf(ctx,0,i=>({on}));}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  pw_kick(ctx,S,ag_in(t,1.0,0.8));});

/* ================================================================ 4 · A second account */
scene("second",(ctx,S,t,sc)=>{const C=sc.cues,br=C.breath;
  const tSecond=wAt(sc,"gets","a second account"),tAlone=C.alone,tUsed=wAt(sc,"never","never used"),tPass=wAt(sc,"passkey","a passkey"),tDaily=C.daily;
  const tCode=wAt(sc,"daily","writing code"),tTest=wAt(sc,"daily","testing it"),tJobs=wAt(sc,"daily","watching the jobs"),tAdm=C.admin,tUntil=wAt(sc,"none","until it's switched on");
  const tLocks=wAt(sc,"locks","two locks"),tStolen=C.stolen,tSteals=C.steals,tOff=wAt(sc,"steals","finds its power off"),tAlone2=wAt(sc,"steals","can't switch it on alone");
  const L1=PW_T.lock1,L2=PW_T.lock2;
  const shots=[{at:0,place:"pwTeam",keys:[[0,960,540,1.0]],push:0,draw(ctx,t){const T=t+sc.start;
    const out=ag_in(t,br-0.7,0.6);   // what this chapter showed leaves before the next one, which opens on the room as it is
    pw_two(ctx,T);
    // the power leaves the everyday accounts, which keep the daily work; the admin accounts' way to it, switched off
    const leave=ag_in(t,tDaily-0.2,1.0);pw_hangE(ctx,1,1-leave);
    const al=ag_in(t,tAdm-0.2,0.8)*(1-out);
    if(al>0)withA(ctx,al,()=>{pw_hang(ctx,pw_aR("jun"),[PW_T.S,PW_T.shelfY[0]+28],1,{col:"grey",dash:[8,10],alpha:0.8});pw_hang(ctx,pw_aR("sam"),[PW_T.S,PW_T.shelfY[2]+28],1,{col:"grey",dash:[8,10],alpha:0.8});});
    pw_everyday(ctx,"sam",{icons:1});pw_everyday(ctx,"jun",{icons:1,coral:ag_in(t,tStolen+1.0,0.4)*(1-out)});
    pw_admin(ctx,"sam",{a:ag_in(t,tSecond+0.4,0.6),k:ag_spr(t,tSecond+0.4,0.6)});
    pw_admin(ctx,"jun",{a:ag_in(t,tSecond-0.2,0.6),k:ag_spr(t,tSecond-0.2,0.6),glow:ag_io(t,tAlone-0.2,tAlone+1.6,0.4),
      icons:ag_in(t,tUsed-0.2,0.5)*(1-ag_in(t,tDaily,0.6)),iconCross:ag_in(t,tUsed+0.3,0.5),coral:ag_in(t,tSteals+1.0,0.4)*(1-out)});
    pw_shelf(ctx,0,i=>({on:1-leave}));
    pw_passkey(ctx,ag_io(t,tPass-0.3,tDaily+0.4,0.5),ag_spr(t,tPass-0.3,0.6));
    pw_work(ctx,i=>ag_in(t,[tCode,tTest,tJobs][i]-0.2,0.4)*(1-out),0);
    dp_pill(ctx,PW_T.S+PW_T.sw/2,436,"Off","grey",{align:"center",a:ag_in(t,tUntil,0.5)*(1-out)});
    // two locks; someone in the dark: a stolen everyday sign-in stops at the first, the stolen admin account at the second
    pw_take(ctx,PW_TAKE_E,ag_in(t,tStolen+0.1,1.0),1-out);
    pw_take(ctx,PW_TAKE_A,ag_in(t,tSteals+0.2,0.9),1-out);
    const lk=ag_in(t,tLocks-0.2,0.5)*(1-out);
    dp_halo(ctx,...L1,96,"coral",0.5*ag_io(t,tStolen+1.4,tStolen+2.8,0.3)*(1-out));dp_halo(ctx,...L2,96,"coral",0.5*ag_io(t,tOff,tOff+1.4,0.3)*(1-out));
    pw_lockMark(ctx,...L1,lk,{k:ag_spr(t,tLocks-0.2,0.6)});pw_lockMark(ctx,...L2,lk,{k:ag_spr(t,tLocks+0.2,0.6)});
    dp_pill(ctx,1870,620,"Needs someone else's yes","coral",{align:"right",a:ag_in(t,tAlone2-0.2,0.5)*(1-out)});}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  pw_kick(ctx,S,1);});

/* ================================================================ 5 · Switched on for a task */
scene("switched",(ctx,S,t,sc)=>{const C=sc.cues,br=C.breath;
  const tWhatFor=wAt(sc,"what","what for"),tRead=wAt(sc,"which","read the storage"),tChange=wAt(sc,"which","change the settings"),tRestore=wAt(sc,"which","restore a table"),tMove=sc.ends.which-0.2;
  const tWords=wAt(sc,"reason","in words"),tFour=wAt(sc,"time","four hours"),tSamOK=wAt(sc,"approves","Sam approves Jun's"),tNoOne=wAt(sc,"approves","no one approves");
  const tOn=sc.ends.approves+0.3,tGets=wAt(sc,"alert","gets an alert"),tRec=wAt(sc,"recorded","is recorded"),tOwn=wAt(sc,"recorded","its own name"),tUp=C.off,tBy=wAt(sc,"off","switches off by itself"),tDone=wAt(sc,"off","as soon as");
  const tLock=C.lock,tHour=wAt(sc,"lock","at its hour"),tTask=wAt(sc,"task","only for a task"),tYes=wAt(sc,"task","someone else says yes");
  const tOut=wAt(sc,"slow","keeps them out"),tMin=wAt(sc,"costs","a minute"),tAYes=wAt(sc,"costs","a yes");
  const K=PW_T.card,P1=pw_cardTok();
  // the room makes way: the everyday accounts leave, the admin accounts slide left, the shelf goes round under them
  const vE=1-ag_in(t,0.1,0.6),vA=clamp((t-0.4)/1.2,0,1),vS=clamp((t-1.0)/1.4,0,1);
  const lit=ag_in(t,tOn-0.1,0.5)*(1-ag_in(t,tBy+0.4,0.5)),mv=clamp((t-tMove)/1.3,0,1);
  const card=(o)=>{o=o||{};pw_card(ctx,K[0],K[1],K[2],{a:o.a,k:o.k,on:o.on||0,left:o.left,rows:[
    ["Power",null,{glow:o.gP||0}],["Reason","Words others can check",{a:o.aR==null?1:o.aR,glow:o.gR||0}],["Time","4 hours at most",{a:o.aT==null?1:o.aT,day:o.day==null?4:o.day}],
    ["Approved by","Sam Okafor",{a:o.aA==null?1:o.aA,tick:o.tick==null?1:o.tick,glow:o.gA||0,glowCol:"green"}]]});};
  const record=(a,u)=>pw_record(ctx,[["Jun Park (admin) · switched on",u[0]],["Jun Park (admin) · read a file",u[1]],["Jun Park (admin) · switched off",u[2]]],{a});
  const ask=a=>withA(ctx,a,()=>dp_link(ctx,pw_aR("jun",1),[K[0],PW_T.row.jun+75],"amber",1,{dot:false}));
  const shots=[
    {at:0,place:"pwTeam",keys:[[0,960,540,1.0]],push:0,draw(ctx,t){const T=t+sc.start;
      pw_two(ctx,T,{samGaze:t>tSamOK-0.3?[3,-1]:[3,-2],samNod:0.08*ag_io(t,tSamOK,tSamOK+1.0,0.3)});
      pw_everyday(ctx,"sam",{icons:1,a:vE});pw_everyday(ctx,"jun",{icons:1,a:vE});
      const ca=ag_in(t,tWhatFor-0.3,0.5);
      // Jun's admin account asks, and the card says what for; Sam's yes; and no one's own
      withA(ctx,ca,()=>dp_link(ctx,pw_aR("jun",1),[K[0],PW_T.row.jun+75],"amber",ag_in(t,tWhatFor-0.2,0.5),{dot:false}));
      withA(ctx,ag_io(t,tSamOK-0.2,tNoOne+1.6,0.4),()=>dp_link(ctx,pw_aR("sam",1),[K[0],pw_cardRow(3)-10],"cyan",ag_in(t,tSamOK-0.2,0.6)));
      const own=ag_io(t,tNoOne-0.2,tNoOne+1.8,0.4);
      if(own>0){withA(ctx,own,()=>dp_link(ctx,[PW_T.A2+PW_T.bw,PW_T.row.jun+130],[K[0],pw_cardRow(3)-16],"coral",ag_in(t,tNoOne-0.2,0.5),{dash:[8,9],dot:false}));
        dp_cross(ctx,1075,PW_T.row.jun+194,"coral",ag_in(t,tNoOne+0.2,0.6)*own);}
      pw_admin(ctx,"sam",{glow:ag_io(t,tSamOK-0.2,tNoOne,0.4)},vA);pw_admin(ctx,"jun",{on:lit},vA);
      // the shelf: only the one power the task needs goes into the card
      const glow=[tRead,tChange,tRestore];
      // each power glows as it is named, from under its token, so its words stay on their own glass
      PW_POWERS.forEach((l,i)=>{const p=pw_shelfXY(i,vS);dp_halo(ctx,p[0]+145,p[1]+28,190,"amber",0.22*ag_io(t,glow[i]-0.2,glow[i]+1.0,0.3)*(i===0?1-mv:1));});
      pw_shelf(ctx,vS,i=>i===0&&mv>0?null:{on:0});
      card({a:ca,k:ag_spr(t,tWhatFor-0.3,0.6),on:lit,aR:ag_in(t,tWords-0.2,0.5),aT:ag_in(t,tFour-0.2,0.5),day:4*ag_in(t,tFour,1.0),aA:ag_in(t,tSamOK,0.5),tick:ag_in(t,tSamOK+0.3,0.6),
        left:t>=tUp-0.2&&t<tBy+0.6?1-ag_in(t,tUp,tBy+0.2-tUp):null});
      if(mv>0){const p=pw_tokAt(mv);pw_token(ctx,p[0],p[1],"Read the storage",{on:lit});}
      dp_pill(ctx,P1[0]+306,P1[1]+40,"Off","grey",{a:ag_in(t,tBy+0.6,0.5)});
      dp_pill(ctx,K[0]+28,486,"Not by its owner","coral",{a:own});
      pw_team(ctx,{a:ag_in(t,tOn+0.2,0.5),alert:["Power switched on","Jun Park (admin)"],al:ag_in(t,tGets,0.5),ring:clamp((t-tGets)/1.6,0,1)});
      record(ag_in(t,tRec-0.4,0.5),[ag_in(t,tRec,0.6),ag_in(t,tOwn,0.6),ag_in(t,tDone,0.6)]);}},
    // a time lock opened at its hour, for whoever had the numbers
    {cut:true,at:tLock-0.3,place:"pwBank",keys:[[0,1150,470,1.25]],push:0.02,draw(ctx,t){
      pw_bankMorning(ctx,1);
      const dial=ag_keys(t,[[tLock,0],[tLock+0.8,1.3],[tLock+1.6,-0.4],[tLock+2.3,0.8]]),slots=clamp((t-tLock-0.1)/0.7,0,3);
      pw_door(ctx,PW_VAULT.x,PW_VAULT.y,PW_VAULT.r,{dial,slots,bolts:1-ag_in(t,Math.max(tHour+0.4,tLock+2.4),1.2),cut:1,hours:9});
      dp_pill(ctx,1600,470,"Opens at 9:00","amber",{a:ag_in(t,tLock+0.2,0.5)});}},
    // this power opens only for a task, and only when someone else says yes; slow at first, it keeps them out too; a minute, and a yes
    {cut:true,at:C.task-0.3,place:"pwTeam",keys:[[0,960,540,1.0]],push:0,draw(ctx,t){const T=t+sc.start;
      const out=ag_in(t,tOut-0.4,0.6);
      pw_two(ctx,T);
      const rim=ag_io(t,tOut-0.2,tOut+1.8,0.4);pw_admin(ctx,"sam",{coral:rim},1);pw_admin(ctx,"jun",{coral:rim},1);
      pw_shelf(ctx,1,i=>i===0?null:{on:0});ask(1);
      card({gP:ag_io(t,tTask-0.2,tYes-0.4,0.4),gR:ag_io(t,tMin-0.2,tMin+1.2,0.4),gA:Math.max(ag_io(t,tYes-0.2,tYes+1.4,0.4),ag_io(t,tAYes-0.2,tAYes+1.4,0.4))});
      pw_token(ctx,P1[0],P1[1],"Read the storage",{});dp_pill(ctx,P1[0]+306,P1[1]+40,"Off","grey",{});
      pw_team(ctx,{a:1-out,alert:["Power switched on","Jun Park (admin)"],al:1});record(1-out,[1,1,1]);
      dp_pill(ctx,PW_T.A2+PW_T.bw/2,366,"Kept out too","coral",{align:"center",a:ag_in(t,tOut,0.5)});
      dp_slip(ctx,K[0]+K[2]/2,470,"1 minute · 1 yes","grey",{align:"center",ink:true,a:ag_in(t,tMin-0.3,0.5)});}}];
  const si=ag_shots(ctx,S,t,sc.dur,shots,0.6);
  pw_kick(ctx,S,si===1?0:1);});

/* ================================================================ 6 · One morning */
scene("morning",(ctx,S,t,sc)=>{const C=sc.cues;
  const tStopped=wAt(sc,"stopped","has stopped"),tFile=wAt(sc,"row","last night's file"),tShutD=wAt(sc,"cant","the back door is shut");
  const tSw=C.switches,tRead=wAt(sc,"switches","read the storage"),tHourV=wAt(sc,"switches","for one hour"),tReason=wAt(sc,"reason","open last night's file"),tSam=C.sam,tApp=wAt(sc,"sam","and approves");
  const tAlert=C.alert,tMatch=wAt(sc,"alert","and matches"),tOpens=C.opens,tStraight=wAt(sc,"opens","goes straight"),tThirty=wAt(sc,"date","the thirty-first");
  const tTells=C.tells,tWhich=wAt(sc,"tells","which record"),tOffS=wAt(sc,"tells","and switches off"),tFourteen=C.fourteen;
  const tRec=C.record,tWho=wAt(sc,"record","who switched on"),tWhy=wAt(sc,"record","why"),tYes=wAt(sc,"record","who said yes"),tWhat=wAt(sc,"record","what was read"),tEnded=wAt(sc,"record","when it ended");
  const tNight=C.night,tClean=wAt(sc,"night","runs clean"),tNext=wAt(sc,"asks","could the next one"),tAside=C.aside,tAsideW=wAt(sc,"aside","aside"),tGuards=wAt(sc,"aside","the catalog guards"),tSee=wAt(sc,"aside","to see");
  const K=PW_T.card,P1=pw_cardTok(),D=PW_P.door,TB=PW_P.table;
  const card=(o)=>{o=o||{};pw_card(ctx,K[0],K[1],K[2],{a:o.a,k:o.k,on:o.on||0,rows:[["Power",null,{}],["Reason","Open last night's file",{a:o.aR==null?1:o.aR,glow:o.gR||0}],
    ["Time","1 hour",{a:o.aT==null?1:o.aT,day:o.day==null?1:o.day}],["Approved by","Sam Okafor",{a:o.aA==null?1:o.aA,tick:o.tick==null?1:o.tick,glow:o.gA||0,glowCol:"green"}]]});};
  const ALERT=["Power switched on","Jun Park (admin) · 09:05"];
  const shots=[
    // the two o'clock load has stopped: a row it couldn't read, in last night's file; Jun's everyday account can't reach the storage
    {at:0,place:"pwPlat",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      pw_morning(ctx,1);pw_catalog(ctx,1,{});pw_store(ctx,1,{file:ag_in(t,tFile-0.3,0.6)});
      pw_door2(ctx,1,0,{});dp_halo(ctx,D[0]+46,D[1]+120,150,"coral",0.4*ag_io(t,tShutD-0.2,tShutD+1.4,0.3));
      dp_card(ctx,72,260,520,{kick:"02:00 load",title:"Stopped",sub:"A row it can't read"},{col:"coral",a:ag_in(t,tStopped-0.3,0.5),k:ag_spr(t,tStopped-0.3,0.6)});
      dp_tag(ctx,880,500,"Last night's file","grey",{to:[PW_FILE[0],PW_FILE[1]-33],p:ag_in(t,tFile-0.2,0.5),a:ag_in(t,tFile-0.3,0.5)});
      pw_id(ctx,1450,640,400,{a:ag_in(t,C.cant-0.3,0.5),k:ag_spr(t,C.cant-0.3,0.6),name:"Jun Park",icons:1,coral:ag_in(t,tShutD,0.4)});
      dp_pill(ctx,1450,612,"Refused","coral",{a:ag_in(t,tShutD+0.1,0.4)});}},
    // so he switches on his admin account's power to read the storage, for one hour; his reason; Sam reads it, and approves; the alert
    {cut:true,at:tSw-0.3,place:"pwTeam",keys:[[0,960,540,1.0]],push:0,draw(ctx,t){const T=t+sc.start;
      const lit=ag_in(t,sc.ends.sam+0.1,0.5),mv=clamp((t-tRead+0.2)/1.3,0,1),ca=ag_in(t,tSw,0.5);   // on in the beat after Sam's yes
      pw_two(ctx,T,{samGaze:t>tSam-0.3?[3,-1]:[3,-2],samNod:0.1*ag_io(t,tApp-0.2,tApp+1.0,0.3)});
      withA(ctx,ca,()=>dp_link(ctx,pw_aR("jun",1),[K[0],PW_T.row.jun+75],"amber",ag_in(t,tSw+0.1,0.6),{dot:false}));
      withA(ctx,ag_io(t,tSam-0.2,tApp+1.4,0.4),()=>dp_link(ctx,pw_aR("sam",1),[K[0],pw_cardRow(3)-10],"cyan",ag_in(t,tSam-0.2,0.6)));
      pw_admin(ctx,"sam",{glow:ag_io(t,tSam-0.2,tApp+1.2,0.4)},1);pw_admin(ctx,"jun",{on:lit},1);
      pw_shelf(ctx,1,i=>i===0&&mv>0?null:{on:0});
      card({a:ca,k:ag_spr(t,tSw,0.6),on:lit,aR:ag_in(t,tReason-0.3,0.5),aT:ag_in(t,tHourV-0.2,0.5),day:ag_in(t,tHourV,0.6),aA:ag_in(t,tApp-0.1,0.5),tick:ag_in(t,tApp,0.6)});
      if(mv>0){const p=pw_tokAt(mv);pw_token(ctx,p[0],p[1],"Read the storage",{on:lit});}
      pw_team(ctx,{a:ag_in(t,tAlert-0.3,0.5),alert:ALERT,al:ag_in(t,tAlert+0.2,0.5),ring:clamp((t-tAlert-0.2)/1.6,0,1),match:ag_in(t,tMatch-0.1,0.6)});}},
    // he opens the file, and goes straight to the row: a date of birth that doesn't exist; tells the registrar's office; switches off
    {cut:true,at:tOpens-0.3,place:"pwPlat",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      const open=ag_in(t,tOpens+0.2,1.2)*(1-ag_in(t,tOffS,1.0)),on=1-ag_in(t,tOffS,0.6);
      pw_morning(ctx,1);pw_catalog(ctx,1,{});pw_store(ctx,1,{file:on});
      pw_door2(ctx,1,open,{glow:ag_io(t,tOpens-0.2,tOffS,0.5)});
      pw_id(ctx,1450,640,400,{kind:"ADMIN ACCOUNT",name:"Jun Park",amber:1,on});
      pw_token(ctx,1500,806,"Read the storage",{on});
      pw_fileView(ctx,230,290,860,{a:ag_in(t,tOpens+0.8,0.5)*(1-ag_in(t,tOffS,0.6)),k:ag_spr(t,tOpens+0.8,0.6),run:clamp((t-tStraight+0.2)/2.2,0,1),hot:ag_in(t,tThirty-0.2,0.5)});
      pw_office(ctx,ag_in(t,tTells-0.1,0.5),{k:ag_spr(t,tTells-0.1,0.6)});
      const nu=ag_sine(clamp((t-tWhich)/1.4,0,1)),na=ag_in(t,tWhich-0.3,0.4);
      dp_card(ctx,lerp(1120,1475,nu),lerp(400,170,nu),380,{title:"Fix S-21877",sub:"Date of birth"},{a:na,k:ag_spr(t,tWhich-0.3,0.5)});
      dp_slip(ctx,660,400,"Switched off · 09:19 · 14 minutes","grey",{align:"center",ink:true,a:ag_in(t,tFourteen-0.4,0.5)});}},
    // the record keeps it all: who switched on, why, who said yes, what was read, and when it ended
    {cut:true,at:tRec-0.3,place:"pwTeam",keys:[[0,960,540,1.0]],push:0.01,draw(ctx,t){const T=t+sc.start;
      pw_two(ctx,T);
      dp_link(ctx,pw_aR("jun",1),[K[0],PW_T.row.jun+75],"amber",1,{dot:false});
      pw_admin(ctx,"sam",{},1);pw_admin(ctx,"jun",{},1);
      pw_shelf(ctx,1,i=>i===0?null:{on:0});
      card({gR:ag_io(t,tWhy-0.2,tWhy+1.2,0.4),gA:ag_io(t,tYes-0.2,tYes+1.2,0.4)});pw_token(ctx,P1[0],P1[1],"Read the storage",{});dp_pill(ctx,P1[0]+306,P1[1]+40,"Off","grey",{});
      pw_team(ctx,{alert:ALERT,al:1,match:1});
      pw_record(ctx,[["09:05 · switched on · Sam's yes",ag_in(t,tWho,0.6)],["09:11 · read last night's file",ag_in(t,tWhat,0.6)],["09:19 · switched off",ag_in(t,tEnded,0.6)]],{});}},
    // that night, the load runs clean; could the next one be avoided? Now it sets a row it can't read aside, for the registrar's office
    {cut:true,at:tNight-0.3,place:"pwPlat",keys:[[0,960,540,1.0]],push:0.01,draw(ctx,t){
      const away=ag_in(t,tAside,0.6);
      pw_catalog(ctx,1,{glow:ag_io(t,tGuards-0.2,tGuards+1.4,0.4)});pw_store(ctx,1,{});pw_door2(ctx,1,0,{});
      dp_card(ctx,72,260,520,{kick:"02:00 load",title:"Ran"},{col:"green",a:ag_in(t,tClean-0.3,0.5)*(1-away),k:ag_spr(t,tClean-0.3,0.6)});
      dp_card(ctx,1450,280,430,{title:"Could the next one be avoided?"},{a:ag_in(t,tNext-0.3,0.5)*(1-away),k:ag_spr(t,tNext-0.3,0.6)});
      pw_table(ctx,...TB,{a:ag_in(t,tAsideW-0.2,0.6),k:ag_spr(t,tAsideW-0.2,0.6),title:"Rows set aside",rows:[["S-21877","Tomás Herrera","31 February 2006"]]});
      const M=PW_P.clara,ma=ag_in(t,tSee-0.4,0.5);pw_id(ctx,M[0],M[1],PW_P.bw,{a:ma,k:ag_spr(t,tSee-0.4,0.6),kind:"REGISTRAR'S OFFICE",name:"Mei Tanaka"});
      withA(ctx,ma,()=>dp_link(ctx,[M[0]+PW_P.bw,M[1]+75],[TB[0],TB[1]+150],"cyan",ag_in(t,tSee-0.2,0.6)));
      const sa=ag_in(t,tSee+0.2,0.5);if(sa>0){dp_tick(ctx,M[0]+22,M[1]+200,"green",ag_in(t,tSee+0.2,0.6));dp_pill(ctx,M[0]+54,M[1]+214,"Sees it","green",{a:sa});}}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  pw_kick(ctx,S,1);});

/* ================================================================ 7 · Who gets one */
scene("who",(ctx,S,t,sc)=>{const C=sc.cues;
  const tSJ=wAt(sc,"only","Sam and Jun"),tMei=wAt(sc,"business","Mei Tanaka"),tClara=wAt(sc,"analysts","Clara Jensen"),tShows=wAt(sc,"through","which shows"),tAsk=wAt(sc,"ask","they ask"),tOwner=wAt(sc,"ask","the data's owner"),tNotP=wAt(sc,"ask","not for power");
  const tAgent=C.agent,tPropose=wAt(sc,"propose","propose a task"),tDecides=wAt(sc,"propose","a person decides"),tOwn=wAt(sc,"propose","their own admin account"),tRights=C.rights,tTwo=wAt(sc,"exception","two emergency accounts"),tWatched=C.watched;
  const MEI=PW_P.mei,CL=PW_P.clara,R=PW_P.ring;
  const shots=[
    // only the data specialists who keep the platform running: here, Sam and Jun
    {at:0,place:"pwTeam",keys:[[0,960,540,1.0]],push:0.01,draw(ctx,t){const T=t+sc.start;
      pw_two(ctx,T);pw_everyday(ctx,"sam",{icons:1});pw_everyday(ctx,"jun",{icons:1});pw_admin(ctx,"sam",{});pw_admin(ctx,"jun",{});pw_shelf(ctx,0,i=>({on:0}));
      [["jun",0],["sam",0.4]].forEach(([w,d])=>{const p=pw_adminXY(w,0);dp_tick(ctx,p[0]+PW_T.bw-40,p[1]+98,"green",ag_in(t,tSJ-0.2+d,0.6));});}},
    // never business users, like Mei; never analysts, like Clara: their work goes through the catalog; for more, they ask the owner
    {cut:true,at:C.business-0.3,place:"pwPlat",keys:[[0,960,540,1.0]],push:0.015,draw(ctx,t){
      pw_catalog(ctx,1,{glow:ag_io(t,tShows-0.2,tShows+1.6,0.4)});pw_store(ctx,1,{});pw_door2(ctx,1,0,{});
      const tb=pw_table(ctx,...PW_P.table,{});dp_halo(ctx,tb.x+390,tb.y+140,240,"violet",0.2*ag_io(t,tShows,tShows+1.8,0.4));
      const ma=ag_in(t,tMei-0.3,0.5),ca=ag_in(t,tClara-0.3,0.5),la=1-ag_in(t,tAsk-0.4,0.5);
      for(const [P,a] of [[MEI,ma],[CL,ca]])withA(ctx,a*la,()=>dp_link(ctx,[P[0]+PW_P.bw,P[1]+75],[R[0]-R[2],R[1]],"cyan",ag_in(t,tShows-0.4,0.8),{dot:false}));
      pw_id(ctx,MEI[0],MEI[1],PW_P.bw,{a:ma,k:ag_spr(t,tMei-0.3,0.6),kind:"REGISTRAR'S OFFICE",name:"Mei Tanaka",glow:ag_io(t,tOwner-0.2,tNotP+1.2,0.4)});
      dp_pill(ctx,MEI[0],MEI[1]+200,"No admin account","coral",{a:ag_in(t,tMei+0.3,0.4)});
      pw_id(ctx,CL[0],CL[1],PW_P.bw,{a:ca,k:ag_spr(t,tClara-0.3,0.6),kind:"PLANNING",name:"Clara Jensen"});
      dp_pill(ctx,CL[0],CL[1]+200,"No admin account","coral",{a:ag_in(t,tClara+0.3,0.4)});
      // Clara asks the data's owner, the registrar's office, for access: her request goes up to Mei, who answers it; not for power
      const su=ag_sine(clamp((t-tAsk+0.1)/1.6,0,1)),sa=ag_in(t,tAsk-0.3,0.4)*(1-ag_in(t,tNotP+1.0,0.5));
      dp_slip(ctx,500,lerp(560,330,su),"Asks for access","cyan",{a:sa});
      dp_tick(ctx,MEI[0]+PW_P.bw-40,MEI[1]+98,"green",ag_in(t,tNotP-0.6,0.6));
      dp_pill(ctx,500,612,"Access, not power","green",{a:ag_in(t,tNotP-0.2,0.5)});}},
    // never an agent: it can propose a task that needs power; a person decides, and does it with their own admin account;
    // two emergency accounts, locked away for the day nothing else works
    {cut:true,at:tAgent-0.3,place:"pwTeam",keys:[[0,960,540,1.0]],push:0,draw(ctx,t){const T=t+sc.start;
      const gone=ag_in(t,C.exception-0.2,0.6),on=ag_in(t,tOwn,0.6)*(1-gone);
      pw_two(ctx,T,{junNod:0.08*ag_io(t,tDecides-0.2,tDecides+1.0,0.3)});
      pw_admin(ctx,"sam",{},1);pw_admin(ctx,"jun",{on,glow:ag_io(t,tDecides-0.2,tOwn+0.6,0.4)},1);
      pw_shelf(ctx,1,i=>({on:i===2?on:0}));
      const ga=ag_in(t,tAgent-0.2,0.6)*(1-gone),ax=lerp(1780,1640,ag_eo(clamp((t-tAgent+0.2)/1.4,0,1)));
      if(ga>0){ag_model(ctx,ax,250,64,{t:T,a:ga,col:"cyan"});withA(ctx,ga,()=>dp_T(ctx,"Agent",ax,360,{w:700,size:30,align:"center",col:"cyan"}));}
      dp_pill(ctx,1640,440,"No admin account","coral",{align:"center",a:ag_in(t,tAgent+0.4,0.4)*(1-gone)});
      // its proposal goes to Jun; he decides
      const pu=ag_sine(clamp((t-tPropose)/1.4,0,1)),pa=ag_in(t,tPropose-0.3,0.4)*(1-gone),px=lerp(1400,1110,pu),py=lerp(500,150,pu);
      dp_card(ctx,px,py,360,{kick:"Proposal",title:"Restore a table"},{a:pa,k:ag_spr(t,tPropose-0.3,0.5)});
      if(pa>0)dp_tick(ctx,px+360-40,py+40,"green",ag_in(t,tDecides,0.6)*(1-gone));
      dp_card(ctx,1110,560,600,{kick:"Module",title:"AI agents in data work"},{a:ag_in(t,tRights-0.2,0.5)*(1-gone),k:ag_spr(t,tRights-0.2,0.6)});
      pw_breakGlass(ctx,1400,140,460,ag_in(t,tTwo-0.2,0.6));
      dp_card(ctx,1400,480,460,{kick:"Film 9 of 9",title:"Who did what"},{a:ag_in(t,tWatched-0.2,0.5),k:ag_spr(t,tWatched-0.2,0.6)});}}];
  ag_shots(ctx,S,t,sc.dur,shots,0.6);
  pw_kick(ctx,S,1);});

/* ================================================================ 8 · Only at its hour */
scene("hour",(ctx,S,t,sc)=>{const C=sc.cues,br=C.breath;
  const tEnough=wAt(sc,"numbers","weren't enough"),tOpened=C.opened,tAcc=C.account,tRight=wAt(sc,"account","the right account"),tIsnt=wAt(sc,"account","isn't enough");
  const tUntil=wAt(sc,"off","until it's switched on"),tTask=wAt(sc,"off","for a task"),tYes=wAt(sc,"off","someone else says yes");
  const tTakes=C.takes,tWork=wAt(sc,"takes","his everyday work"),tMore=wAt(sc,"takes","nothing more"),tGreat=C.great,tSep=wAt(sc,"great","a separate account");
  const L1=PW_T.lock1,L2=PW_T.lock2;
  const shots=[
    // Great Barrington, 1875: the right numbers, from the right man, weren't enough; the vault opened only at its hour
    {at:0,place:"pwBank",keys:[[0,1150,470,1.25]],push:0.02,draw(ctx,t){
      pw_bankMorning(ctx,ag_in(t,tOpened-0.4,1.6));
      const dial=ag_keys(t,[[0.8,0],[1.6,1.3],[2.4,-0.5],[3.2,0.8]]),slots=clamp((t-0.9)/0.8,0,3);
      pw_door(ctx,PW_VAULT.x,PW_VAULT.y,PW_VAULT.r,{dial,slots,held:ag_in(t,tEnough-0.3,0.5)*(1-ag_in(t,tOpened,0.6)),bolts:1-ag_in(t,tOpened+0.3,1.2),cut:1,hours:9});
      const va=ag_in(t,tOpened+0.6,0.5);if(va>0){dp_tick(ctx,1622,546,"green",ag_in(t,tOpened+0.6,0.6));dp_pill(ctx,1656,560,"Opens at 9:00","amber",{a:va});}}},
    // on the platform, the right account isn't enough either: its power is off until it's switched on for a task, and someone else
    // says yes; whoever takes Jun's everyday account gets his everyday work, and nothing more; great power is a separate account
    {at:tAcc-0.4,place:"pwTeam",keys:[[0,960,540,1.0]],push:0.01,draw(ctx,t){const T=t+sc.start;
      // after the last line, in the quiet before the end card: Jun's power switched on for a task, held a moment, and off again
      const tEnd=sc.ends.great,fin=ag_in(t,br-0.9,0.8),opn=Math.max(ag_io(t,tTask-0.2,tYes+1.6,0.5),ag_in(t,tEnd+0.2,0.5)*(1-ag_in(t,tEnd+1.9,0.5)));
      pw_two(ctx,T);
      withA(ctx,1-fin,()=>{
        pw_everyday(ctx,"sam",{icons:1});pw_everyday(ctx,"jun",{icons:1,coral:ag_io(t,tTakes+0.8,tGreat-0.2,0.4)});
        pw_admin(ctx,"sam",{});pw_admin(ctx,"jun",{coral:ag_io(t,tRight+0.8,tUntil,0.4),on:opn});
        pw_shelf(ctx,0,i=>({on:i===0?opn:0}));
        pw_work(ctx,()=>1,ag_io(t,tWork-0.2,tMore+1.6,0.4));
        pw_take(ctx,PW_TAKE_A,ag_in(t,tRight-0.2,1.0),1-ag_in(t,tUntil,0.8));
        pw_take(ctx,PW_TAKE_E,ag_in(t,tTakes-0.1,1.0),1-ag_in(t,tGreat-0.2,0.8));
        dp_halo(ctx,...L2,96,"coral",0.5*ag_io(t,tIsnt,tIsnt+1.4,0.3));dp_halo(ctx,...L1,96,"coral",0.5*ag_io(t,tMore-0.4,tMore+1.0,0.3));
        pw_lockMark(ctx,...L1,ag_in(t,tAcc-0.2,0.5),{});pw_lockMark(ctx,...L2,ag_in(t,tAcc-0.2,0.5),{open:opn});
        dp_pill(ctx,1590,150,"A task","amber",{a:ag_io(t,tTask-0.2,tYes+1.6,0.4)});dp_pill(ctx,1740,150,"A yes","green",{a:ag_io(t,tYes-0.2,tYes+1.6,0.4)});
        for(const w of ["jun","sam"]){const p=pw_adminXY(w,0);dp_halo(ctx,p[0]+200,p[1]+75,300,"amber",0.18*ag_in(t,tSep-0.2,0.6));}});}}];
  const si=ag_shots(ctx,S,t,sc.dur,shots,0.6);
  // the place's name leaves with its shot, over the dissolve into the team room
  pw_where(ctx,S,"Great Barrington, Massachusetts · 1875",ag_in(t,0.9,0.6)*(1-ease(clamp((t-shots[1].at)/0.6,0,1))));
  pw_kick(ctx,S,si>=1?ag_in(t,tAcc+0.3,0.6)*(1-ag_in(t,br-0.6,0.5)):0);
  dp_end(ctx,S,t,br,PW_TITLE,"Great power is a separate account, switched on for a task.","Film 4 of 9","Locks before the data");});

// chapters that open in the same room the last one ends in glide on from it; those that open in another room cut to it
ag_cutInto(["second","switched","morning","who","hour"]);
