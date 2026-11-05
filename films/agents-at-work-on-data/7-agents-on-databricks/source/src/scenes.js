/* ===== Working with agents on Databricks: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The office is painted once
   (faculty.js) and the lab is the module's; what moves is drawn live in the shots of ag_shots. In one room the camera never jumps:
   ag_shots glides it from one framing to the next and fades only what changes (the lab by night is the lab). A later moment in the
   room, or the same person framed another way (Sam close, then at his desk), is later: true: what was there leaves, the bare room
   shows for an instant, in a pause of the voice, and what comes next comes in. Only framings far apart (a desk's close shot and the
   whole office) change on a cut (cut: true), never a dissolve, so nothing shows twice. A close shot's cards, the kicker and the four
   ways along the top are drawn in the frame (od_scr), so their words keep their size whatever the camera does; in a close shot of
   the office the cards stand where the next desk would be, and only that desk's person and things are drawn. */

// the bare lab, by day and by night, as a later moment passes through it: the light every shot of it draws
AG_BARE.lab=c=>ag_roomLight(c,1);AG_BARE.labNight=c=>ag_roomLight(c,1,{night:true});AG_BARE.odOffice=c=>ag_roomLight(c,1);

// a phase: 0 before tIn, rising to 1 over din; from tOut, from 1 to 2 over dout (for what is shown, then put away)
const od_ph=(t,tIn,tOut,din,dout)=>t<tOut?clamp((t-tIn)/(din||0.6),0,1):1+clamp((t-tOut)/(dout||0.5),0,1);
// lit from t0, put out at t1
const od_lit=(t,t0,t1)=>ag_in(t,t0,0.3)*(1-ag_in(t,t1,0.4));
// draw in the frame, whatever the camera is doing
function od_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// the kicker and the four ways, in the frame; lit: the chapter's card (0 to 3), or o.on for each
function od_chrome(ctx,S,t,lit,o){o=o||{};od_scr(ctx,S,()=>{const dk=o.dark===true?1:clamp(o.dark||0,0,1),a=o.a==null?1:o.a;  // dark 0 to 1: the night's kicker, blended into the day's as the room lights
    if(dk>0)ag_kicker(ctx,"2.7","Working with agents on Databricks",{dark:true,a:a*dk});if(dk<1)ag_kicker(ctx,"2.7","Working with agents on Databricks",{dark:false,a:a*(1-dk)});
  const on=o.on||[0,1,2,3].map(i=>i===lit?ag_in(t,0.3,0.8):0);od_strip(ctx,{on,k:o.k,a});});}
// the card of next year's places: what Anil plans from the census-day count. o.n (0 to 3) its lines come in. 500 wide, in the frame
function od_places(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=500,h=262;ctx.save();ctx.globalAlpha*=a;od_spring(ctx,x,y,w,h,o.k);
  ag_box(ctx,x,y,w,h,20,{});ag_T(ctx,"Next year's places",x+32,y+54,{w:700,size:32});
  ["classes","labs","hospital placements"].forEach((s,i)=>{const k=clamp((o.n||0)-i,0,1);if(k<=0)return;const yy=y+122+i*50;ctx.save();ctx.globalAlpha*=ag_in(k,0,0.4);
    ctx.fillStyle=rgba(AG_OAK.dark,0.9);ctx.beginPath();ctx.arc(x+42,yy-9,6,0,TAU);ctx.fill();ag_T(ctx,s,x+64,yy,{w:600,size:28});ctx.restore();});ctx.restore();}
// a tag that points down at what it names, with a short leader
function od_pointTag(ctx,x,y,text,px,py,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(AG.mut,0.7);ctx.lineWidth=2;ctx.setLineDash([5,6]);ctx.beginPath();ctx.moveTo(x,y+28);ctx.lineTo(px,py);ctx.stroke();ctx.setLineDash([]);
  const w=ag_tw(ctx,text,{w:500,size:28,f:"mono"})+44;ctx.fillStyle="rgba(243,241,237,0.96)";rr(ctx,x-w/2,y-28,w,56,12);ctx.fill();ctx.strokeStyle=AG.card.edge;ctx.lineWidth=1.2;rr(ctx,x-w/2,y-28,w,56,12);ctx.stroke();
  ag_T(ctx,text,x,y+10,{w:500,size:28,f:"mono",align:"center"});ctx.restore();}
// a statement on its own, in the frame over a veil: two lines, centred, each in its colour
function od_statement(ctx,S,a,l1,l2,o){o=o||{};if(a<=0)return;ag_veil(ctx,S,0.7*a);setScreen(ctx,S);const f={w:700,size:40},w=Math.max(ag_tw(ctx,l1,f),ag_tw(ctx,l2,f))+120,h=196,x=960-w/2,y=o.y||350;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,960,y+h/2,lerp(0.85,1,Math.min(1,ag_spr(o.k,0,0.5))));ag_box(ctx,x,y,w,h,24,{});
  ag_T(ctx,l1,960,y+80,Object.assign({align:"center",col:o.c1||AG.ink},f));ag_T(ctx,l2,960,y+142,Object.assign({align:"center",col:o.c2||AG.ink,a:o.a2==null?1:o.a2},f));ctx.restore();}

/* ---------------------------------------------------------------- the lab of the opening: Sam and Jun, the shelf, the three agents */
const OD_LAB={sph:[[300,700],[640,700],[980,700]],r:44};
// o.in (0 to 1) the agents come in from the left; o.plug (0 to 1) their cables leave their copies for the shelf's tools, turning blue;
// o.lock (0 to 1); o.names [Sam's card, Jun's card]; o.cards false for none
function od_labOpening(c,S,tt,o){o=o||{};const sk=od_shelf(c,{glow:clamp(o.plug||0,0,1)*0.8});
  ag_person(c,"sam",1430,620,0.94,{t:tt,flip:true,gaze:[4,0]});ag_person(c,"jun",1700,620,0.94,{t:tt+0.8,flip:true,gaze:[4,0]});
  const inn=o.in==null?1:o.in,pl=o.plug||0;
  OD_LAB.sph.forEach(([x,y],i)=>{const k=clamp(inn*1.4-i*0.2,0,1),e=ag_spr(k,0,0.55),px=lerp(-140,x,Math.min(1,e)),r=OD_LAB.r;if(k<=0)return;
    const u=clamp(pl*1.3-i*0.15,0,1),eu=ag_sine(u),from=[px+r*0.5,y-r*0.7],off=[px-300-i*40,y+64+i*10],to=sk[i];
    const end=[lerp(off[0],to[0],eu),lerp(off[1],to[1],eu)],col=mix([128,126,122],AG.blue,eu);
    od_cable(c,from,end,1,{col,sag:lerp(30,-40,eu),lw:5});
    ag_floorShadow(c,px+AG.sdx,y+r*0.98,r*1.2,r*0.24,0.3);ag_model(c,px,y,r,{t:tt+i*0.9,core:lerp(0.5,1,eu),think:0.3*eu});
    if(o.lock>0){const lx=px+r*0.85,ly=y-r*0.8,s=30;c.save();c.globalAlpha*=clamp(o.lock*1.4-i*0.2,0,1);c.fillStyle="rgba(243,241,237,0.96)";c.beginPath();c.arc(lx,ly,s*0.62,0,TAU);c.fill();
      c.strokeStyle=rgba(AG.blue,0.5);c.lineWidth=1.5;c.stroke();ag_lock(c,lx,ly+2,s*0.82,rgba(AG.blue,1));c.restore();}});
  ag_roomLight(c,1);
  if(o.cards!==false){const n=o.names||[1,1];if(n[0]>0)ag_textCard(c,1170,120,340,{title:"Sam Okafor",sub:"Data platform"},{a:ag_in(n[0],0,0.4),k:Math.min(1,ag_spr(n[0],0,0.5))});
    if(n[1]>0)ag_textCard(c,1530,120,340,{title:"Jun Park",sub:"Analytics engineer"},{a:ag_in(n[1],0,0.4),k:Math.min(1,ag_spr(n[1],0,0.5))});}
  if(o.lock>0)ag_pill(c,640,800,"each reads only what its person may read",{icon:"lock",col:AG.blue,a:ag_in(o.lock,0.3,0.5)});}

/* ---------------------------------------------------------------- 1 · Three answers */
scene("three",(ctx,S,t,sc)=>{
  const T={tMon:wAt(sc,"monday","Monday"),tAnil:wAt(sc,"anil","Anil"),tPlaces:wAt(sc,"anil","next year's"),tClasses:wAt(sc,"anil","classes"),tLabs:wAt(sc,"anil","labs"),tHosp:wAt(sc,"anil","hospitals"),
    tCensus:wAt(sc,"census","census day"),tCounts:wAt(sc,"census","counts who"),
    tAsks:wAt(sc,"asks","He asks"),tHis:wAt(sc,"asks","his agent"),tTwo:wAt(sc,"asks","two colleagues"),tTheirs:wAt(sc,"asks","theirs"),tOwn:wAt(sc,"asks","Each set up"),tCopy:wAt(sc,"asks","own copy"),
    tLoad:wAt(sc,"load","Anil's reads"),tSheet:wAt(sc,"load","spreadsheet"),tBid:wAt(sc,"load","funding bid"),
    tHalf:wAt(sc,"fte","two half-time"),tOne:wAt(sc,"fte","as one"),tPeople:wAt(sc,"fte","takes it for people"),tN1:wAt(sc,"fte","two thousand"),
    tTable:wAt(sc,"table","The second"),tName:wAt(sc,"table","with Health"),
    tJoint:wAt(sc,"joint","Health data"),tN2:wAt(sc,"joint","two thousand"),
    tFolder:wAt(sc,"folder","The third"),tReports:wAt(sc,"folder","folder of reports"),tN3:wAt(sc,"folder","two thousand"),
    tWhich:wAt(sc,"which","One is right"),tNobody:wAt(sc,"which","nobody can tell"),
    tShort:wAt(sc,"short","Plan for"),tLowest:wAt(sc,"short","lowest"),tGap:wAt(sc,"short","seven hundred"),
    tNames:wAt(sc,"names","And a copy"),tEvery:wAt(sc,"names","every name"),
    tChange:wAt(sc,"change","Something"),
    tBring:wAt(sc,"bring","So Sam"),tJun:wAt(sc,"bring","Jun"),tAgents:wAt(sc,"bring","bring the agents"),
    tSame:wAt(sc,"same","the same governed"),tOnly:wAt(sc,"same","only what"),
    tWeek:wAt(sc,"week","A week later"),tAll:wAt(sc,"week","all three"),tN4:wAt(sc,"week","two thousand"),tQuery:wAt(sc,"week","its query"),tDef:wAt(sc,"week","its definition"),
    tChecks:wAt(sc,"minute","Anil checks"),tPlan:wAt(sc,"minute","plans a place"),tDel:wAt(sc,"minute","The copies"),
    tData:wAt(sc,"data","When every"),tAgree:wAt(sc,"data","the answers agree")};
  const lit3=tt=>[ag_in(tt,T.tHis,0.5),ag_in(tt,T.tTwo+0.3,0.5),ag_in(tt,T.tTheirs,0.5)],cab=tt=>[0,1,2].map(i=>ag_sine((tt-(T.tOwn+0.2+i*0.3))/1.1));
  const A=OD.answer,nums=["2,160","2,911","2,880"],fromW=i=>[OD.answer[i],OD.ansY+OD_ANS_H/2+90];  // in the wide shot, an answer rises from just over its person's head, never across a face
  const wideAns=(c,tt,o)=>A.forEach((x,i)=>od_answer(c,x,OD.ansY,o.num?o.num[i]:nums[i],{none:o.none||0,ev:o.ev?o.ev[i]:0,tick:o.tick?o.tick[i]:0,u:o.u?o.u[i]:1,from:fromW(i)}));
  // in a close shot, an answer rises from where its agent is in the frame
  const fromZ=(cam,i)=>od_see(cam,[OD.agent[i][0],OD.agent[i][1]-20]);
  ag_shots(ctx,S,t,sc.dur,[
    // Monday: Anil at his desk, close; the places he plans; census day. Then the camera draws back to the three desks, and the question
    {at:0,place:"odOffice",keys:[[0,OD_Z1[1],OD_Z1[2],OD_Z1[3]],[T.tAsks-0.1,960,540,1]],d:2.2,draw:(c,tt)=>{
      od_room(c,tt,{lit:lit3(tt),cable:cab(tt),gaze:[[5,-1],[4,1],[4,1]]});
      od_pointTag(c,400,340,"their own agent",400,704,ag_in(tt,T.tOwn+0.8,0.4)*(1-ag_in(tt,T.tLoad-0.6,0.4)));
      od_pointTag(c,1150,340,"their own copy",1150,640,ag_in(tt,T.tCopy,0.4)*(1-ag_in(tt,T.tLoad-0.6,0.4)));
      const back=ag_in(tt,T.tAsks-0.3,0.5);
      od_scr(c,S,()=>{od_tag(c,"Faculty of Health · Monday",ag_in(tt,0.4,0.6));
        if(back<1){c.save();c.globalAlpha*=1-back;od_cardAt(c,470,290,360,{title:"Anil Kurian",sub:"Faculty of Health"},tt,T.tAnil-0.1,null);
          od_places(c,1340,96,{k:(tt-T.tPlaces)/0.5,a:ag_in(tt,T.tPlaces-0.1,0.4),n:clamp((tt-T.tClasses+0.1)/0.45,0,1)+clamp((tt-T.tLabs+0.1)/0.45,0,1)+clamp((tt-T.tHosp+0.1)/0.45,0,1)});
          od_pillAt(c,1590,420,"census day · 31 March 2026",tt,T.tCensus-0.1,null,{size:28});c.restore();}
        const qa=ag_in(tt,T.tAsks-0.2,0.5);if(qa>0)ag_textCard(c,610,36,700,{title:"Health's students on census day?"},{a:qa,k:Math.min(1,ag_spr(tt,T.tAsks-0.2,0.5))});});}},
    // Anil's spreadsheet: student load, for the funding bid; two half-time students as one; 2,160
    {at:T.tLoad-0.15,cut:true,place:"odOffice",keys:[OD_Z1],draw:(c,tt)=>{od_room(c,tt,{only:0,lit:[1,1,1],cable:[1,1,1],sheet:ag_in(tt,T.tBid,0.5),gaze:[[6,-1]]});
      od_scr(c,S,()=>{const k=(tt-T.tSheet+0.3)/0.6;od_sheet(c,1060,72,{k,a:ag_in(k,0,0.3),rows:clamp((tt-T.tSheet)/1.2,0,1),pick:ag_in(tt,T.tBid+0.4,0.5),half:(tt-T.tHalf-0.4)/(T.tOne-T.tHalf+0.2)});
        od_answer(c,1440,566,"2,160",{u:clamp((tt-T.tPeople)/0.7,0,1),from:fromZ(OD_Z1,0),numA:ag_in(tt,T.tN1-0.15,0.3)});});}},
    // the second desk: a copy of the student table, its degrees with Health in their names, and the joint degree in no faculty
    {at:T.tTable-0.15,cut:true,place:"odOffice",keys:[OD_Z2],draw:(c,tt)=>{od_room(c,tt,{only:1,lit:[1,1,1],cable:[1,1,1],gaze:[null,[6,0]]});
      od_scr(c,S,()=>{const k=(tt-T.tTable-0.4)/0.6;od_tableCard(c,1040,72,{k,a:ag_in(k,0,0.3),rows:clamp((tt-T.tTable-0.6)/1.0,0,1),hl:clamp((tt-T.tName)/0.45,0,3),joint:ag_in(tt,T.tJoint,0.6)});
        od_answer(c,1450,432,"2,911",{u:clamp((tt-T.tN2+0.9)/0.7,0,1),from:fromZ(OD_Z2,1),numA:ag_in(tt,T.tN2-0.15,0.3)});});}},
    // the third desk: a folder of reports, and 2,880; the second desk leaves before it comes in, so no agent shows in two places
    {at:T.tFolder-0.15,later:true,dis:0.45,place:"odOffice",keys:[OD_Z3],draw:(c,tt)=>{od_room(c,tt,{only:2,lit:[1,1,1],cable:[1,1,1],gaze:[null,null,[5,0]]});
      od_scr(c,S,()=>{const k=(tt-T.tReports+0.3)/0.6;od_reports(c,64,72,clamp((tt-T.tReports)/1.4,0,1),{k,a:ag_in(k,0,0.3)});
        od_answer(c,1630,80,"2,880",{u:clamp((tt-T.tN3+0.9)/0.7,0,1),from:fromZ(OD_Z3,2),numA:ag_in(tt,T.tN3-0.15,0.3)});});}},
    // three answers, and nothing to tell them apart
    {at:T.tWhich-0.15,cut:true,place:"odOffice",keys:[OD_WIDE],draw:(c,tt)=>{od_room(c,tt,{lit:[1,1,1],cable:[1,1,1],gaze:[[4,-3],[4,-3],[4,-3]]});
      wideAns(c,tt,{none:ag_in(tt,T.tNobody+0.3,0.6)});}},
    // planned for the lowest: 720 students with no place
    {at:T.tShort-0.15,cut:true,place:"odOffice",keys:[OD_Z1],draw:(c,tt)=>{od_room(c,tt,{only:0,lit:[1,1,1],cable:[1,1,1],gaze:[[6,-1]]});
      od_scr(c,S,()=>{const k=(tt-T.tShort)/0.6;od_plan(c,1060,72,{k,a:ag_in(k,0,0.3),lo:ag_in(tt,T.tGap-0.1,0.5)});
        od_answer(c,1440,452,"2,160",{none:1,a:ag_in(tt,T.tLowest-0.2,0.4)});});}},
    // and every student's name, on a laptop; something had to change
    {at:T.tNames-0.15,cut:true,place:"odOffice",keys:[OD_Z2],draw:(c,tt)=>{od_room(c,tt,{only:1,lit:[1,1,1],cable:[1,1,1],gaze:[null,[6,0]]});
      od_scr(c,S,()=>{od_tableCard(c,1040,72,{names:ag_in(tt,T.tNames+0.2,0.6)});od_pillAt(c,1450,452,"every student's name, on a laptop",tt,T.tEvery,null,{col:AG.amber,icon:"warn",size:28});
        ag_veil(c,S,0.62*ag_in(tt,T.tChange-0.1,1.0));});}},
    // Sam and Jun bring the agents to the data: the platform's shelf, and the three agents' cables plugged into its tools
    {at:T.tBring-0.3,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>od_labOpening(c,S,tt,{in:clamp((tt-T.tAgents+0.2)/1.4,0,1),plug:clamp((tt-T.tSame)/1.6,0,1),lock:clamp((tt-T.tOnly)/0.8,0,1),
      names:[(tt-T.tBring-0.3)/0.5,(tt-T.tJun+0.1)/0.5]})},
    // a week later: three answers, the same, each with its evidence; each agent wired to the platform, its copy unplugged (a cut: the lab shows the same agents)
    {at:T.tWeek-0.3,cut:true,place:"odOffice",keys:[OD_WIDE],draw:(c,tt)=>{od_room(c,tt,{lit:[1,1,1],blue:1,gaze:[[4,-3],[4,-3],[4,-3]]});
      wideAns(c,tt,{num:["2,880","2,880","2,880"],u:[0,1,2].map(i=>clamp((tt-T.tAll-i*0.25)/0.7,0,1)),ev:[0,1,2].map(i=>clamp((tt-T.tQuery+0.2-i*0.12)/(T.tDef-T.tQuery+0.6),0,1))});
      od_scr(c,S,()=>od_tag(c,"A week later",ag_in(tt,T.tWeek,0.5)));}},
    // Anil checks it in a minute, and plans a place for every student
    {at:T.tChecks-0.15,cut:true,place:"odOffice",keys:[OD_Z1],draw:(c,tt)=>{od_room(c,tt,{only:0,lit:[1,1,1],blue:1,smile:[ag_in(tt,T.tChecks+0.6,0.8)],gaze:[[6,-2]]});
      od_scr(c,S,()=>{const k=(tt-T.tPlan+0.3)/0.6;od_plan(c,1060,72,{k,a:ag_in(k,0,0.3),ok:ag_in(tt,T.tPlan+0.3,0.6)});
        od_answer(c,1440,452,"2,880",{ev:1,tick:ag_in(tt,T.tChecks+0.8,0.4)});});}},
    // the copies are deleted
    {at:T.tDel-0.15,cut:true,place:"odOffice",keys:[OD_WIDE],draw:(c,tt)=>{const g=ag_in(tt,T.tDel+0.3,1.0);od_room(c,tt,{lit:[1,1,1],blue:1,gone:g,smile:[0.8,0.3,0.3]});
      wideAns(c,tt,{num:["2,880","2,880","2,880"],ev:[1,1,1]});
      [[540,556],[1150,600],[1745,600]].forEach(([x,y],i)=>od_note(c,x,y,"deleted",ag_in(tt,T.tDel+0.5+i*0.2,0.4)));}},
    // every agent reads the same data through the same tools: the shelf, and a blue thread from each agent (a cut: the office shows the same agents)
    {at:T.tData-0.3,cut:true,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{const f=1-ag_in(tt,sc.cues.breath,0.6);if(f<=0)return;c.save();c.globalAlpha*=f;  // gone before the card's words come in (0.5 s after its veil)
      od_labOpening(c,S,tt,{in:1,plug:1,lock:0,cards:false});c.restore();}}
  ],0.6);
  ag_title(ctx,S,t,sc.cues.breath,"Working with agents on Databricks","the same data and tools people use, in one place","FILM 7 OF 9 · AGENTS AT WORK ON DATA");
});

/* ---------------------------------------------------------------- 2 · One place */
scene("place",(ctx,S,t,sc)=>{
  const T={tUC:wAt(sc,"holds","Unity Catalog"),tTables:wAt(sc,"holds","its tables"),tDefs:wAt(sc,"holds","its definitions"),tWho:wAt(sc,"holds","who may read"),
    tPeople:wAt(sc,"people","People"),tEd:wAt(sc,"people","editors"),tNb:wAt(sc,"people","notebooks"),tDash:wAt(sc,"people","dashboards"),
    tFour:wAt(sc,"four","four ways"),tA1:wAt(sc,"answer","Agents that answer"),tA2:wAt(sc,"servers","Tool servers"),tA3:wAt(sc,"builds","Agents the team"),tA4:wAt(sc,"writes","write code"),
    tEach:wAt(sc,"each","Each reads"),tTools:wAt(sc,"each","same tools")};
  const named=[T.tA1,T.tA2,T.tA3,T.tA4,T.tEach];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      // the shelf of the opening grows into the platform
      const u=ag_in(tt,0.2,1.6);if(u<1)od_shelf(c,{a:1-ag_in(tt,0.2,0.6)});  // the shelf's name is gone before the card's comes in: one name at a time
      // the people already at work: three desks, three screens, each with its own kind of work
      const pa=ag_in(tt,T.tPeople-0.2,0.6);if(pa>0){c.save();c.globalAlpha*=pa;ag_desk(c,280,880,1360,{depth:64});
        [["yusuf",400,T.tEd,"editors"],["noor",840,T.tNb,"notebooks"],["clara",1280,T.tDash,"dashboards"]].forEach(([who,x,tl,lab],i)=>{
          ag_person(c,who,x,720,0.5,{t:tt+i,cut:816,gaze:[5,0]});ag_screen(c,x+60,694,220,96,{stand:16,draw:(sx,gx,gy,gw,gh)=>{
            const la=ag_in(tt,tl-0.1,0.4);if(la>0)ag_T(sx,lab,gx+gw/2,gy+gh/2+10,{w:700,size:28,align:"center",a:la});}});});
        c.restore();}
      ag_roomLight(c,1);
      od_dbCard(c,{from:{x:OD_SHELF.x,y:OD_SHELF.y,w:OD_SHELF.w,h:176},u,a:ag_in(tt,0.1,0.6),title:ag_in(tt,0.85,0.4),uc:ag_in(tt,T.tUC-0.2,0.6),parts:[ag_in(tt,T.tTables,0.4),ag_in(tt,T.tDefs,0.4),ag_in(tt,T.tWho,0.4)]});
      // the people's threads into Unity Catalog, and the agents', beside them
      if(pa>0)[400,840,1280].forEach((x,i)=>od_thread(c,[x+170,684],[x+170-(i-1)*60,OD_UC.y+OD_UC.h],ag_in(tt,T.tPeople+0.8+i*0.25,0.8),AG.blue,{lw:3.5,a:0.8}));
      const b=od_wayBoxes(c);b.forEach((r,i)=>od_thread(c,[r.x+r.w-40,r.y+r.h],[OD_UC.x+180+i*280,OD_UC.y],ag_in(tt,T.tTools-0.2+i*0.2,0.9),AG.blue,{lw:3.5,a:0.8}));}}
  ],0.6);
  // the four ways spring in along the top, and light as they're named
  const k=[0,1,2,3].map(i=>(t-(T.tFour+0.1+i*0.18))/0.5),on=[0,1,2,3].map(i=>ag_in(t,named[i]-0.15,0.35)*(1-0.65*ag_in(t,named[i+1]-0.15,0.5)));
  od_chrome(ctx,S,t,-1,{on,k});
});

/* ---------------------------------------------------------------- 3 · Agents that answer */
scene("ask",(ctx,S,t,sc)=>{
  const T={tG1:wAt(sc,"genie","Genie One"),tAsst:wAt(sc,"genie","assistant"),tQ:wAt(sc,"genie","business questions"),tWords:wAt(sc,"genie","where its words"),
    tCare:wAt(sc,"care","For questions"),tTeam:wAt(sc,"care","the data team"),
    tGov:wAt(sc,"census","governed table"),tIns:wAt(sc,"instr","Its instructions"),tStud:wAt(sc,"instr","a student is"),
    tTests:wAt(sc,"bench","Its tests"),tBehind:wAt(sc,"bench","questions behind"),tRight:wAt(sc,"bench","right answer"),
    tRuns:wAt(sc,"runs","runs them"),tSql:wAt(sc,"sql","shows its"),tCheck:wAt(sc,"sql","anyone can check")};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{ag_roomLight(c,1);
      const g1=ag_in(tt,0.4,0.6)*(1-ag_in(tt,T.tCare,0.45));
      od_genieOne(c,{q:(tt-T.tG1-0.2)/1.8,ans:(tt-T.tQ-0.2)/0.6,chip:(tt-T.tWords+0.1)/0.5,tag:(tt-T.tWords-0.9)/0.5},{a:g1,t:tt,dx:-60*ag_in(tt,T.tCare,0.45)});
      const ga=ag_in(tt,T.tCare+0.25,0.5);if(ga>0){const tab=[ag_io(tt,T.tGov-0.4,T.tIns-0.2),ag_io(tt,T.tIns-0.2,T.tTests-0.2),0,ag_io(tt,T.tTests-0.2,T.tSql-0.3)];
        od_genieAgent(c,{top:ag_in(tt,T.tTeam-0.2,0.5),tab,data:od_ph(tt,T.tGov-0.3,T.tIns-0.4),instr:od_ph(tt,T.tIns-0.1,T.tTests-0.4),
          bench:od_ph(tt,T.tTests-0.1,T.tSql-0.4,2.2),sqlA:(tt-T.tRight+0.1)/0.9,good:clamp((tt-T.tRuns)/0.5,0,3),code:od_ph(tt,T.tSql-0.1,99,0.7)},
          {a:ga,dx:220*(1-ag_eo(ga)),t:tt});}}}
  ],0.6);
  od_chrome(ctx,S,t,0);
});

/* ---------------------------------------------------------------- 4 · Tools any agent can use */
scene("tools",(ctx,S,t,sc)=>{
  const T={tServers:wAt(sc,"second","tool servers"),tHands:wAt(sc,"second","the hands"),
    tRuns:wAt(sc,"runs","The platform runs"),tQ1:wAt(sc,"query","runs queries"),tQ2:wAt(sc,"query","governed function"),tQ3:wAt(sc,"query","searches"),
    tG:wAt(sc,"genie","Genie One"),tGA:wAt(sc,"genie","each Genie Agent"),tAsk:wAt(sc,"genie","can ask them"),
    tAnil:wAt(sc,"anil","Anil's agent"),tConn:wAt(sc,"anil","connects"),tSign:wAt(sc,"anil","sign-in"),tOnly:wAt(sc,"anil","only what"),
    tOnce:wAt(sc,"once","census count"),tAny:wAt(sc,"once","any faculty"),
    tCalls:wAt(sc,"calls","Every agent"),tNone:wAt(sc,"calls","none writes"),
    tMcp:wAt(sc,"mcp","open standard"),tPlug:wAt(sc,"mcp","plug in"),tGa:wAt(sc,"ga","generally available"),tPrev:wAt(sc,"ga","in preview")};
  const cue=[T.tQ1,T.tQ2,T.tQ3,T.tG,T.tGA],next=[T.tQ2,T.tQ3,T.tG-0.3,T.tGA,T.tAsk+0.6];
  const row=[[170,740],[390,740],[610,740],[830,740]],who=["Anil's agent","Genie","census check","Jun's agent"],AX=420,AY=470,AR=64;
  const tb=i=>{const b=od_toolBox(i);return[b.x-14,b.y+b.h/2];};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      // an agent, then Anil's, which takes its place among the agents that call the census count; it comes in once the last chapter's end has gone
      const an=ag_in(tt,0.8,0.6),mv=ag_sine((tt-T.tOnce+0.7)/1.0),ax=lerp(AX,row[0][0],mv),ay=lerp(AY,row[0][1],mv),ar=lerp(AR,30,mv);
      const calls=clamp((tt-T.tCalls)/1.6,0,1);
      if(an>0){c.save();c.globalAlpha*=an;ag_floorShadow(c,ax+AG.sdx,ay+ar*0.98+(1-mv)*170,ar*1.2,ar*0.24,0.3);ag_model(c,ax,ay,ar,{t:tt,core:0.9,think:0.3});c.restore();}
      [1,2,3].forEach(i=>{const k=ag_in(tt,T.tCalls+0.2+i*0.2,0.5);if(k>0){c.save();c.globalAlpha*=k;ag_floorShadow(c,row[i][0]+AG.sdx,row[i][1]+29,36,8,0.3);ag_model(c,row[i][0],row[i][1]-(1-ag_eo(k))*30,30,{t:tt+i,core:0.9});c.restore();}});
      ag_roomLight(c,1);
      // the panel the platform runs them in, and a card for each tool server
      od_toolPanel(c,ag_in(tt,T.tRuns-0.2,0.6),{mcp:(tt-T.tMcp+0.1)/0.5});
      // the agent's hand: first toward the tools, the hands any agent can use; then, signed in as Anil, to each in turn
      const r1=ag_in(tt,T.tHands-0.1,0.6)*(1-ag_in(tt,T.tRuns+0.6,0.6)),r2=ag_in(tt,T.tConn-0.2,0.7)*(1-ag_in(tt,T.tOnce-1.0,0.5));
      const seg=clamp((tt-T.tConn-0.5)/0.55,0,4),si=Math.min(3,Math.floor(seg)),sf=ag_sine(seg-si),tp=r2>r1?[lerp(tb(si)[0],tb(si+1)[0],sf),lerp(tb(si)[1],tb(si+1)[1],sf)]:tb(2);
      OD_TOOLS.forEach((d,i)=>{const b=od_toolBox(i),k=(tt-(T.tServers+0.2+i*0.15))/0.6,touch=r2>0.6?clamp(1-Math.abs(seg-i)*1.6,0,1):0,ga=i===3?T.tGa:T.tPrev+0.12*(i>3?i-1:i);
        const named=od_lit(tt,cue[i]-0.1,next[i]),called=i===1?0.8*clamp(calls*2,0,1)*(1-ag_in(tt,T.tMcp,0.6)):0,held=i===2?r1*0.7:0;
        od_tool(c,b,d[0],d[1],{k:clamp(k,0,1),a:ag_in(k,0,0.3),touch:Math.max(touch,named,called,held),plug:ag_in(tt,T.tMcp+0.2+i*0.12,0.4),badge:[i===3?"generally available":"preview",(tt-ga+0.1)/0.45]});});
      const u=Math.max(r1,r2);if(u>0)ag_reach(c,[ax+ar*0.9,ay,ax+360,ay-50,tp[0]-300,tp[1]+30,tp[0],tp[1]],u,{data:r2>0.95?clamp((tt-T.tConn-0.6)%0.55/0.55,0,1):0});
      if(an>0&&mv<1){c.save();c.globalAlpha*=an*(1-mv);const na=ag_in(tt,T.tAnil-0.2,0.4);if(na>0)ag_T(c,"Anil's agent",ax,ay+ar+48,{w:700,size:28,align:"center",col:AG.label,a:na});
        if(tt>T.tSign-0.2)ag_pill(c,ax,ay+ar+112,"signed in as Anil",{icon:"lock",col:AG.blue,a:ag_in(tt,T.tSign-0.2,0.4)});c.restore();
        const la=ag_in(tt,T.tOnly,0.4);if(la>0){const lx=ax+ar*0.85,ly=ay-ar*0.8;c.save();c.globalAlpha*=la*(1-mv);c.fillStyle="rgba(243,241,237,0.96)";c.beginPath();c.arc(lx,ly,22,0,TAU);c.fill();
          c.strokeStyle=rgba(AG.blue,0.5);c.lineWidth=1.5;c.stroke();ag_lock(c,lx,ly+2,28,rgba(AG.blue,1));c.restore();}}
      // the census count, written once, as a function; every agent calls it, and each gets 2,880
      const fk=(tt-T.tOnce-0.2)/0.6,fn=od_fnCard(c,{k:clamp(fk,0,1),a:ag_in(fk,0,0.3),rev:(tt-T.tAny-0.2)/0.4,app:(tt-T.tAny-0.8)/0.4,glow:calls*(1-ag_in(tt,T.tMcp,0.6))});
      if(fk>0){row.forEach(([x,y],i)=>{const st=T.tCalls+(i?0.45+0.2*i:0),v=clamp((tt-st)/0.8,0,1),top=[OD_FN.x+150+i*140,fn.y+fn.h];if(v<=0)return;  // a thread only from an agent that is there
          od_thread(c,[x,y-32],top,v,AG.blue,{lw:3.5});const back=clamp((tt-st-0.9)/0.7,0,1);
          if(back>0&&back<1){const p=[x,y-32,x,y-32-(y-32-top[1])*0.6,top[0],top[1]+(y-32-top[1])*0.6,top[0],top[1]],q=ag_bz(p,1-back);ag_pellet(c,q[0],q[1]);}
          if(back>=1)ag_T(c,"2,880",(x+top[0])/2+16,(y-32+top[1])/2+10,{w:800,size:30,col:AG.orange,a:ag_in(tt,st+1.6,0.3)});});
        row.forEach(([x,y],i)=>{const k=i===0?ag_in(mv,0.6,0.4):ag_in(tt,T.tCalls+0.2+i*0.2,0.5);if(k>0)ag_T(c,who[i],x,y+70,{w:700,size:28,align:"center",col:AG.label,a:k});});}}}
  ],0.6);
  od_chrome(ctx,S,t,1);
});

/* ---------------------------------------------------------------- 5 · Agents the team builds */
scene("build",(ctx,S,t,sc)=>{
  const T={tFails:wAt(sc,"fails","fails its check"),tWhy:wAt(sc,"fails","find out why"),
    tAgent:wAt(sc,"bricks","census check agent"),tCode:wAt(sc,"bricks","in code"),tBricks:wAt(sc,"bricks","Agent Bricks"),
    tRT:wAt(sc,"runtime","Agent Runtime"),tJob:wAt(sc,"runtime","the job calls"),tTraced:wAt(sc,"runtime","every step"),
    tSame:wAt(sc,"same","same tool servers"),tBefore:wAt(sc,"before","Before anyone"),tCases:wAt(sc,"before","cases"),
    tC1:wAt(sc,"cases","thirty-seven"),tC2:wAt(sc,"cases","Three students"),tC3:wAt(sc,"cases","And Health's"),
    tJudges:wAt(sc,"judges","Judges"),tSums:wAt(sc,"judges","plain test"),tMei:wAt(sc,"judges","Mei and Jun"),
    tNote:wAt(sc,"note","Its note"),tReads:wAt(sc,"note","Jun reads"),tDecides:wAt(sc,"note","decides")};
  const RX=980,RY=560,TB=i=>od_toolBox(i,{x:1330,y:330,w:500,h:76,pitch:92});
  ag_shots(ctx,S,t,sc.dur,[
    // night: the plain job's check fails, and nobody can write down in advance why
    {at:0,place:"labNight",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{
      const ra=ag_in(tt,T.tAgent-0.2,0.6),steps=clamp((tt-T.tTraced-0.2)/0.6,0,4),sm=ag_in(tt,T.tSame-0.2,0.5);
      ag_loop(c,RX,RY,{R:140,r:64,a:ra,p:ag_in(tt,T.tAgent,1.2),core:0.4+0.6*ag_in(tt,T.tJob,0.5),think:steps>0&&steps<4?0.8:0.2,lit:steps>0&&steps<4?Math.floor(steps)%3:null,label:null,t:tt,floor:RY+190});
      // its hands: to the tool servers, one step after another
      const tgt=[0,0,2,null],si=Math.min(3,Math.floor(steps)),sf=steps-si;
      if(steps>0&&steps<4&&tgt[si]!=null){const b=TB(tgt[si]),p=[b.x-30,b.y+38],u=Math.sin(Math.PI*clamp(sf,0,1));ag_reach(c,[RX+70,RY-10,RX+170,RY-60,p[0]-120,p[1],p[0],p[1]],u,{data:sf>0.5?(sf-0.5)*2:0});}
      ag_roomLight(c,1,{night:true});if(ra>0)ag_model(c,RX,RY,64,{only:"light",t:tt,core:1,a:ra});
      // the job, its check, and why (after the chapter's dissolve, so no words of the last chapter's show under them)
      od_job(c,96,236,{a:ag_in(tt,0.7,0.5),fail:ag_in(tt,T.tFails,0.4)});od_ask(c,96,450,"Why?",ag_in(tt,T.tWhy,0.4),{k:(tt-T.tWhy)/0.5});
      if(ra>0)ag_pill(c,RX,360,"Census check agent",{a:ra,size:28});
      ag_pill(c,1430,267,"built in code",{icon:"draft",col:AG.blue,a:ag_in(tt,T.tCode,0.4),size:28});
      od_bricks(c,700,236,560,ag_in(tt,T.tBricks-0.1,0.5));
      od_runtime(c,RX,724,420,ag_in(tt,T.tRT-0.2,0.5),{u:clamp((tt-T.tRT+0.2)/0.6,0,1)});
      const cl=ag_in(tt,T.tJob-0.1,0.9);if(cl>0)od_thread(c,[636,300],[RX-150,RY],cl,AG.blue,{lw:4,bend:-40});  // the job calls it: a thread from the job to the agent, no word between the pills
      od_trace(c,96,560,{a:ag_in(tt,T.tTraced-0.3,0.5),n:steps});
      // the same tool servers as everyone else
      OD_TOOLS.forEach((d,i)=>{const hit=steps>0&&steps<4&&tgt[si]===i?Math.sin(Math.PI*clamp(sf,0,1)):0;
        od_tool(c,TB(i),d[0],null,{a:ag_in(tt,T.tRT+0.2+i*0.12,0.4)*lerp(0.75,1,sm),touch:Math.max(hit,sm*0.7*(1-ag_in(tt,T.tBefore-1.0,0.6)))});});}},
    // morning: the cases the team has met before, and the three ways each answer is scored
    {at:T.tBefore-0.1,later:true,dis:0.45,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{ag_roomLight(c,1);
      od_eval(c,{a:ag_in(tt,T.tBefore,0.5),ghost:ag_in(tt,T.tCases-0.2,0.6),rows:clamp((tt-T.tC1+0.2)/0.5,0,1)+clamp((tt-T.tC2+0.1)/0.5,0,1)+clamp((tt-T.tC3+0.1)/0.5,0,1)+clamp((tt-T.tC3-0.7)/0.5,0,1),
        colA:[ag_in(tt,T.tJudges-0.1,0.4),ag_in(tt,T.tSums-0.1,0.4),ag_in(tt,T.tMei-0.1,0.4)],cols:[(tt-T.tJudges-0.2)/0.3,(tt-T.tSums-0.1)/0.3,(tt-T.tMei-0.1)/0.3],amber:2});}},
    // its note is evidence, not a decision: Jun reads it, and decides
    {at:T.tNote-0.2,later:true,dis:0.45,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{ag_person(c,"jun",330,640,0.92,{t:tt,gaze:[6,-2],nod:0.03*ag_in(tt,T.tDecides,0.5)});ag_roomLight(c,1);
      ag_evidence(c,640,300,640,{kick:"Note for Jun",title:"Three students counted twice?",sub:"Engineering and IT: 134 against 131"},
        [{kick:"query",title:"count by faculty",col:AG.orange},{kick:"trace",title:"its four steps",col:AG.blue}],{open:clamp((tt-T.tReads+0.2)/1.2,0,1),a:ag_in(tt,T.tNote-0.1,0.4),k:Math.min(1,ag_spr(tt,T.tNote-0.1,0.5)),kickCol:AG.violet});
      ag_pill(c,960,800,"Jun decides",{col:AG.ink,a:ag_in(tt,T.tDecides,0.4),size:30});}}
  ],0.6);
  od_chrome(ctx,S,t,2,{dark:1-ag_in(t,T.tBefore-0.1,0.45)});
});

/* ---------------------------------------------------------------- 6 · Agents that write code */
scene("code",(ctx,S,t,sc)=>{
  const T={tSam:wAt(sc,"sam","Sam builds"),tPipes:wAt(sc,"sam","pipelines"),
    tGC:wAt(sc,"genie","Genie Code"),tRights:wAt(sc,"genie","his rights"),
    tSkills:wAt(sc,"skills","the team's skills"),tFiles:wAt(sc,"skills","the same files"),tFormat:wAt(sc,"skills","open format"),
    tAsked:wAt(sc,"profile","Asked to profile"),tFollows:wAt(sc,"profile","follows"),tQuery:wAt(sc,"profile","the query"),tClaim:wAt(sc,"profile","every claim"),
    tJun:wAt(sc,"jun","Jun's own"),tDbt:wAt(sc,"jun","dbt project"),
    tReach:wAt(sc,"reach","same tool servers"),tDbs:wAt(sc,"reach","Databricks' own"),
    tTeach:wAt(sc,"teach","Skills teach"),tLet:wAt(sc,"teach","tool servers let"),
    tDraft:wAt(sc,"draft","a draft"),tRev:wAt(sc,"draft","reviews it"),tSecond:wAt(sc,"draft","a second person"),tProd:wAt(sc,"draft","production")};
  // Sam, standing beside his pipeline editor, Genie Code in its panel
  const pipe=(c,tt,o)=>{ag_person(c,"sam",250,640,0.92,{t:tt,gaze:[5,-1]});ag_roomLight(c,1);
    ag_textCard(c,64,212,330,{title:"Sam Okafor",sub:"Data platform"},{a:o.name==null?1:o.name});od_pipeline(c,o,{t:tt});};
  // the wide shot: Sam's desk and Jun's; the team's skills, read by both agents; Jun's agent on his screen, with the platform's
  // tool servers and Databricks' own skills
  const JX=1745,JY=398;
  const wide=(c,tt,o)=>{ag_desk(c,80,840,680,{depth:70});ag_desk(c,1160,840,680,{depth:70});
    ag_person(c,"sam",230,600,0.66,{t:tt,cut:770,gaze:[5,-1]});ag_person(c,"jun",1310,600,0.66,{t:tt+0.7,cut:770,gaze:[5,-1]});
    ag_screen(c,330,440,400,260,{stand:60,draw:(x,gx,gy,gw,gh)=>od_skillsScreen(x,gx,gy,gw,gh,{t:tt})});
    ag_screen(c,1410,440,400,260,{stand:60,draw:(x,gx,gy,gw,gh)=>od_editorScreen(x,gx,gy,gw,gh,{tree:o.tree==null?1:o.tree})});
    if(o.jun>0){const k=o.jun;c.save();c.globalAlpha*=ag_in(k,0,0.4);ag_floorShadow(c,JX+AG.sdx*0.6,JY+28,30,6,0.3);ag_model(c,JX,JY-(1-ag_eo(clamp(k,0,1)))*24,30,{t:tt,core:0.6+0.4*k,think:0.4*k});c.restore();}
    ag_roomLight(c,1);
    od_folderCard(c,960-117,214,"skills/",{a:1});
    od_thread(c,[960,292],[530,426],o.th==null?1:o.th,AG.violet,{lw:4});od_thread(c,[960,292],[1610,426],o.th==null?1:o.th,AG.violet,{lw:4});
    if(o.md>0){const s="SKILL.md · name · description",f={w:500,size:28,f:"mono"},w=ag_tw(c,s,f)+48;c.save();c.globalAlpha*=ag_in(o.md,0,0.4);
      ag_box(c,960-w/2,312,w,60,14,{edge:AG.violet,edgeA:0.5});ag_T(c,s,960,352,Object.assign({align:"center"},f));c.restore();}
    // what Jun's agent reaches: the platform's tool servers (blue) and Databricks' own skills (violet), each on a thread to it
    if(o.tools>0){const w=od_folderCard(c,1500,214,"tool servers",{mono:false,col:AG.blue,k:o.tools,a:ag_in(o.tools,0,0.4)});od_thread(c,[JX,JY-32],[1500+w/2,292],ag_in(o.tools,0.2,0.8),AG.blue,{lw:3.5});}
    if(o.dbs>0){const w=od_folderCard(c,1110,214,"Databricks' skills",{mono:false,col:AG.violet,k:o.dbs,a:ag_in(o.dbs,0,0.4)});od_thread(c,[JX-12,JY-30],[1110+w/2,292],ag_in(o.dbs,0.2,0.8),AG.violet,{lw:3.5});}};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>pipe(c,tt,{name:ag_in(tt,T.tSam-0.2,0.5),code:clamp((tt-T.tPipes)/1.4,0,1),panel:(tt-T.tGC+0.1)/0.6,rights:(tt-T.tRights+0.1)/0.4,
      skills:clamp((tt-T.tSkills)/0.6,0,1),think:0.3})},
    {at:T.tFiles+0.4,later:true,dis:0.45,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>wide(c,tt,{th:ag_in(tt,T.tFiles+0.9,1.0),md:(tt-T.tFormat+0.1)/0.5,tree:0})},
    {at:T.tAsked-0.2,later:true,dis:0.45,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>pipe(c,tt,{panel:1,rights:1,skills:1,using:(tt-T.tFollows+0.2)/0.5,claim:(tt-T.tFollows-0.3)/0.5,
      chip:(tt-T.tQuery)/0.4,res:(tt-T.tClaim+0.2)/0.4,think:0.6})},
    {at:T.tJun-0.2,later:true,dis:0.45,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{wide(c,tt,{tree:clamp((tt-T.tDbt+0.2)/1.0,0,1),jun:ag_in(tt,T.tJun,0.5),tools:(tt-T.tReach+0.2)/0.6,dbs:(tt-T.tDbs+0.1)/0.6});
      // skills teach an agent how to work; tool servers let it do the work
      od_statement(c,S,ag_in(tt,T.tTeach-0.2,0.5),"Skills teach an agent how to work;","tool servers let it do the work.",{c1:AG.violet,c2:AG.blue,a2:ag_in(tt,T.tLet-0.2,0.4),k:(tt-T.tTeach+0.2)/0.5});}},
    // a draft on a branch: its person reviews it, and a second person approves what reaches production
    {at:T.tDraft-0.3,place:"lab",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{ag_glass(c,1260,200,580,640,{label:"Production"});ag_sandbox(c,640,790,940,{});ag_roomLight(c,1);
      const mv=ag_sine((tt-T.tProd+0.1)/1.3),app=(tt-T.tSecond-0.3)/0.4;
      [["Genie Code","reviewed · Sam",150,470],["Jun's agent","reviewed · Jun",690,470]].forEach(([who,rev,x,y],i)=>{const m=clamp(mv*1.3-(1-i)*0.3,0,1),e=ag_sine(m);
        od_draft(c,lerp(x,1300,e),lerp(y,300+i*240,e),who,{a:ag_in(tt,T.tDraft-0.2+i*0.2,0.4),rev:[rev,(tt-T.tRev+0.1-i*0.25)/0.4],app});});}}
  ],0.6);
  od_chrome(ctx,S,t,3,{a:1-ag_in(t,sc.dur-1.2,0.8)});
});

/* ---------------------------------------------------------------- 7 · The same answer */
scene("same",(ctx,S,t,sc)=>{
  const T={tBack:wAt(sc,"back","Back at"),tRead:wAt(sc,"read","the same governed"),tAsked:wAt(sc,"asked","Asked for"),tN:wAt(sc,"asked","two thousand"),
    tQ:wAt(sc,"asked","its query"),tDef:wAt(sc,"asked","its definition"),tPlans:wAt(sc,"plans","Anil plans"),
    tTake:wAt(sc,"takeaway","The platform"),tLeft:wAt(sc,"left","One question"),tWhose:wAt(sc,"left","whose reads"),tPays:wAt(sc,"left","who pays"),tNext:wAt(sc,"next","the next film")};
  ag_shots(ctx,S,t,sc.dur,[
    // the faculty again: the agents still their owners' own, reading the same data through the same tools
    {at:0,place:"odOffice",keys:[OD_WIDE],draw:(c,tt)=>{od_room(c,tt,{lit:[1,1,1],gone:1,blue:ag_in(tt,T.tRead-0.2,1.4)+0.0001,gaze:[[4,-3],[4,-3],[4,-3]]});
      ag_textCard(c,610,24,700,{title:"Health's students on census day?"},{a:ag_in(tt,T.tAsked-0.2,0.4),k:Math.min(1,ag_spr(tt,T.tAsked-0.2,0.5))});
      OD.answer.forEach((x,i)=>od_answer(c,x,OD.ansY+22,"2,880",{u:clamp((tt-T.tN+0.8-i*0.25)/0.7,0,1),from:[OD.agent[i][0],OD.agent[i][1]-20],ev:clamp((tt-T.tQ+0.2-i*0.12)/(T.tDef-T.tQ+0.6),0,1)}));
      od_scr(c,S,()=>od_tag(c,"Faculty of Health",ag_in(tt,0.3,0.6)*(1-ag_in(tt,T.tAsked-0.4,0.4))));}},
    // Anil plans a place for every student
    {at:T.tPlans-0.2,cut:true,place:"odOffice",keys:[OD_Z1],draw:(c,tt)=>{od_room(c,tt,{only:0,lit:[1,1,1],gone:1,blue:1,smile:[0.8],gaze:[[6,-2]]});
      od_scr(c,S,()=>{const k=(tt-T.tPlans+0.1)/0.6;od_plan(c,1060,72,{k,a:ag_in(k,0,0.3),ok:1});od_answer(c,1440,452,"2,880",{ev:1,tick:1});});}},  // the plan as it now stands: every student has a place
    // one question is left: the census check agent, alone at night (a cut under the takeaway's veil, so no agent shows in two places)
    {at:T.tLeft-0.6,cut:true,place:"labNight",keys:[[0,960,540,1]],push:0.02,draw:(c,tt)=>{const f=1-ag_in(tt,sc.cues.breath,0.6);if(f<=0)return;c.save();c.globalAlpha*=f;  // gone before the card's words come in (0.5 s after its veil)
      ag_loop(c,960,500,{R:140,r:64,core:0.7,think:0.2,label:null,t:tt,floor:690});
      ag_roomLight(c,1,{night:true});ag_model(c,960,500,64,{only:"light",t:tt,core:0.8});ag_pill(c,960,300,"Census check agent",{size:28});
      od_ask(c,330,410,"Whose reads?",ag_in(tt,T.tWhose-0.1,0.4),{k:(tt-T.tWhose+0.1)/0.5});od_ask(c,1200,410,"Who pays for its model?",ag_in(tt,T.tPays-0.1,0.4),{k:(tt-T.tPays+0.1)/0.5});
      const na=ag_in(tt,T.tNext-0.3,0.5);if(na>0)ag_textCard(c,460,704,1000,{kick:"Next",title:"Why Unity Catalog and Unity Gateway govern them"},{a:na,k:Math.min(1,ag_spr(tt,T.tNext-0.3,0.5)),kickCol:AG.blue});c.restore();}}
  ],0.6);
  // the takeaway, over the faculty
  od_statement(ctx,S,ag_in(t,T.tTake-0.3,0.6)*(1-ag_in(t,T.tLeft-0.6,0.5)),"The platform gives agents the same data","and tools people use, in one place.",{k:(t-T.tTake+0.3)/0.5});
  ag_end(ctx,S,t,sc.cues.breath,"Working with agents on Databricks","The same data and tools people use, in one place.","Film 7 of 9","Agents at work on data");
});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["place","ask","tools","build","code"]);
