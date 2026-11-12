/* ===== How long, and then what: the chapters =====
   Seven chapters, re-timed to the voice: every moment is a word's time (wAt). The opening (A flood of paper, Decided once, before) is
   Washington in 1943, in its own places (hl_past.js) with its live pieces (hl_open.js); the rest is the university, in the module's hall
   (hl_uni.js). In one room the camera glides and only what changes fades; between rooms, a dissolve where the whole picture changes. */

DP_PEOPLE.push([HL_CLERK,"lamp"],"ingrid","yusuf","linh");

// the clerk at her cabinets, a manila folder of papers held to her chest
const HL_CLERK_AT=[225,591,1.0];
function hl_folder(c,x,y,w,h,rot){c.save();c.translate(x,y);c.rotate(rot||0);
  c.fillStyle="rgb(232,226,208)";c.fillRect(-w/2+12,-h/2-9,w-26,h);c.fillStyle="rgba(70,58,44,0.25)";c.fillRect(-w/2+12,-h/2-9,w-26,1.5);
  const g=c.createLinearGradient(0,-h/2-22,0,h/2);g.addColorStop(0,"rgb(224,198,142)");g.addColorStop(1,"rgb(186,156,102)");
  c.save();c.shadowColor="rgba(0,0,0,0.4)";c.shadowBlur=10;c.shadowOffsetY=4;c.fillStyle=g;c.beginPath();c.moveTo(-w/2,-h/2);c.lineTo(w/2-130,-h/2);
  c.lineTo(w/2-120,-h/2-22);c.lineTo(w/2-30,-h/2-22);c.lineTo(w/2-20,-h/2);c.lineTo(w/2,-h/2);c.lineTo(w/2,h/2);c.lineTo(-w/2,h/2);c.closePath();c.fill();c.restore();
  c.fillStyle="rgba(255,240,210,0.45)";c.fillRect(-w/2,-h/2,w-130,2);c.restore();}
function hl_clerk(c,t,a){if(a<=0)return;const [x,y,s]=HL_CLERK_AT;
  const draw=cc=>dp_person(cc,HL_CLERK,x,y,s,{light:"lamp",t,pose:"hold",gaze:[3,1],hold:(xx,h)=>hl_folder(xx,h.near[0]+60,h.near[1]-60,240,170,-0.1)});
  if(a>=1)draw(c);else{const [bc,bx]=ag_buf("clerk",c.canvas.width,c.canvas.height);bx.setTransform(c.getTransform());bx.clearRect(-4000,-4000,9000,9000);draw(bx);
    c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=a;c.drawImage(bc,0,0);c.restore();}}

/* ---------------------------------------------------------------- 1 · A flood of paper */
scene("flood",(ctx,S,t,sc)=>{
  const tGlide=wAt(sc,"war","country")-0.4,tWall=wAt(sc,"war","office")-0.3,tFour=wAt(sc,"cabinets","four"),tRooms=wAt(sc,"cabinets","rooms"),tFloors=wAt(sc,"cabinets","floors");
  const tCab=sc.cues.cabinets,tFlood=wAt(sc,"flood","flood"),tYear=wAt(sc,"flood","every year"),tWorth=wAt(sc,"flood","building");
  const tMost=wAt(sc,"eighty","most"),tEighty=wAt(sc,"eighty","eighty");
  const tList=wAt(sc,"list","destroyed"),tLift=wAt(sc,"list","list"),tCong=wAt(sc,"list","Congress"),tPile=wAt(sc,"again","every new pile"),tNew=wAt(sc,"again","new list");
  const tKept=wAt(sc,"kept","simply")-1.6,tJob=wAt(sc,"kept","nobody"),tRent=wAt(sc,"cost","rent"),tStaff=wAt(sc,"cost","staff"),tSteel=wAt(sc,"cost","steel");
  const tClose=wAt(sc,"close","close")-0.6,tVal=wAt(sc,"close","valuable"),tClaim=wAt(sc,"proof","prove a claim"),tServ=wAt(sc,"proof","their service"),tLost=sc.ends.proof+0.2;
  const tabs=[["Orders",wAt(sc,"war","orders")],["Contracts",wAt(sc,"war","contracts")],["Payrolls",wAt(sc,"war","payrolls")],["Letters",wAt(sc,"war","letters")]];
  ag_shots(ctx,S,t,sc.dur,[
    // Washington's avenue at night; the camera glides in to a lit window
    {at:0,place:"hlStreet",push:0.02,d:tWall-tGlide,keys:[[0,960,540,1],[tGlide,HL_STREET_WINDOW.x,HL_STREET_WINDOW.y,2.4]]},
    // the clerk at her cabinets: each top drawer's label is typed as its kind of paper is named; as the cabinets fill, the payrolls'
    // drawer slides open, full, and shuts; boxes pile on the cabinets' tops; the camera draws back along the row
    {at:tWall,place:"hlWall",dis:0.9,push:0.015,keys:[[tWall,960,600,1.1],[tFour,960,540,1]],draw:(x,tt)=>{
      hl_boxes(x,hl_wallX(2)+20,HL_WALL.top-16,HL_WALL.w-40,ag_in(tt,tRooms,1.2),3);hl_boxes(x,hl_wallX(3)+20,HL_WALL.top-16,HL_WALL.w-40,ag_in(tt,tRooms+0.3,1.2),7);
      const typed=k=>{const [w,at]=tabs[k];return w.slice(0,Math.floor(w.length*clamp((tt-at+0.1)/0.45,0,1)));};
      const op=ag_eo(clamp((tt-tCab+0.3)/0.8,0,1))*(1-ag_eo(clamp((tt-tRooms+0.3)/0.7,0,1)));
      hl_wallDrawer(x,0,{});[1,2,4].forEach(i=>hl_wallDrawer(x,i,{big:true,label:typed(i-1),typeOf:tabs[i-1][0]}));hl_wallDrawer(x,3,{big:true,label:typed(2),typeOf:tabs[2][0],out:op,full:1});
      hl_clerk(x,tt,1);}},
    // the building in section, its floors filling; the Archives beside it filling too; ten drawers, eight dimmed; the lists
    {at:tFloors,place:"hlNight",dis:0.8,push:0.015,draw:(x,tt)=>{
      const fill=[0,1,2,3,4,5].map(i=>ag_in(tt,tFloors+0.4+i*0.32,0.5)),aS=hl_v(tt,tFloors,tMost,0.6);
      hl_section(x,250,300,560,540,fill,aS);dp_slip(x,250,186,"A war office","grey",{a:aS*ag_in(tt,tFloors+0.3,0.5),ink:true,size:30});
      hl_archGlass(x,1010,330,700,510,ag_in(tt,tYear,2.4),hl_v(tt,tFlood,tMost,0.7));
      dp_card(x,1010,150,700,{title:"Every year: a building's worth"},{a:hl_v(tt,tWorth,tMost,0.6),k:ag_spr(tt,tWorth,0.9)});
      // ten drawers of the year's papers, eight of them dimming: no lasting value
      const aT=hl_v(tt,tMost+0.3,tList-0.4,0.6);if(aT>0){x.save();x.globalAlpha*=aT;for(let i=0;i<10;i++)hl_drawerIcon(x,250+i*146,450,124,120,i<8?ag_in(tt,tEighty+i*0.08,0.6):0);x.restore();}
      dp_card(x,250,240,620,{title:"80% · no lasting value"},{a:hl_v(tt,tEighty+0.4,tList-0.4,0.6),k:ag_spr(tt,tEighty+0.4,0.9)});
      // the lists: a pile, its list lifting and travelling to Congress; a second pile, a second list
      const aL=ag_in(tt,tList,0.7);hl_pile(x,420,820,Math.round(26*ag_in(tt,tList,1.2)),{a:aL,seed:4});
      const lu=ag_eo(clamp((tt-tLift)/1.8,0,1)),sx=lerp(270,1180,lu),sy=lerp(560,330,lu);
      dp_link(x,[600,600],[1220,330],"grey",ag_in(tt,tLift-0.2,1.2),{dash:[4,14],lw:3,dot:false,alpha:0.8});
      dp_card(x,1260,250,420,{title:"Congress"},{a:ag_in(tt,tCong,0.6),k:ag_spr(tt,tCong,0.9)});
      hl_sheet(x,sx,sy,330,230,{title:["List of papers","for disposal"],lines:3,a:aL,rot:lerp(-0.05,0.03,lu)});
      hl_pile(x,420,820-26*7,Math.round(30*ag_in(tt,tPile,1.6)),{a:ag_in(tt,tPile,0.5),seed:12});
      hl_sheet(x,250,330,330,180,{title:["List No. 2"],lines:2,a:ag_in(tt,tNew,0.8),rot:-0.04});}},
    // back in the office: the drawers stay shut, the room dims; nobody's job; what keeping it all costs
    {at:tKept,place:"hlOffice",dis:0.9,push:0.0,keys:[[tKept,1060,520,1],[tKept+0.5,1060,500,1.16]],d:6,draw:(x,tt)=>{
      x.fillStyle=rgba([0,6,8],0.32*ag_in(tt,tKept+1.2,2.5));x.fillRect(0,0,W,H);
      dp_card(x,640,170,840,{title:"No one's job to decide"},{a:ag_in(tt,tJob,0.6),k:ag_spr(tt,tJob,0.9)});
      [["Rent",tRent,700],["Staff",tStaff,900],["Steel cabinets",tSteel,1110]].forEach(([w,at,px])=>{const u=ag_in(tt,at,0.5);if(u>0){x.save();x.translate(0,(1-ag_spr(tt,at,0.9))*-20);dp_slip(x,px,330,w,"grey",{a:u,ink:true});x.restore();}});}},
    // the platform at night: crates of papers for a freight car; the valuable with the useless; two that someone will need, lost
    {at:tClose,place:"hlPlatform",dis:0.9,push:0.02,draw:(x,tt)=>{
      hl_heap(x,{a:ag_in(tt,tVal-0.3,0.8),warm:ag_in(tt,tVal,0.8)});
      dp_card(x,1060,110,760,{title:"The valuable with the useless"},{a:ag_in(tt,tVal+0.2,0.6),k:ag_spr(tt,tVal+0.2,0.9),behind:"hlPlatform"});
      const sink=ag_eo(clamp((tt-tLost)/1.4,0,1));
      [["To prove a claim",tClaim,560],["To prove their service",tServ,880]].forEach(([w,at,px],i)=>{const up=ag_eo(clamp((tt-at)/1.0,0,1))*(1-sink);if(up<=0)return;
        const y=lerp(640,380+i*120,up);x.save();x.globalAlpha*=clamp(up*2,0,1);x.save();x.shadowColor="rgba(255,226,180,0.55)";x.shadowBlur=24;x.fillStyle="rgb(246,236,212)";x.fillRect(px-20,y-46,dp_tw(x,w,{w:700,size:30})+40,70);x.restore();
        dp_T(x,w,px,y+3,{w:700,size:30,col:HL_INK});x.restore();});
      if(tt>tLost){const u=ag_in(tt,tLost+0.6,0.7);dp_pill(x,640,470,"Lost with the rest","closed",{a:u,align:"center"});}}}
  ],0.8);
  dp_kicker(ctx,"Opening story","Washington, 1943",{a:hl_v(t,0.5,tGlide+0.4,0.8)});
});

/* ---------------------------------------------------------------- 2 · Decided once, before */
scene("before",(ctx,S,t,sc)=>{
  const P=HL_DESK_PAGE,tSign=wAt(sc,"law","signs"),tDraft=wAt(sc,"law","drafted"),tComm=wAt(sc,"law","committee");
  const tTurn=wAt(sc,"once","schedule"),tLong=wAt(sc,"kind","how long"),tThen=wAt(sc,"kind","then"),tArch=wAt(sc,"approve","Archivist"),tCong=wAt(sc,"approve","Congress");
  const tWall=wAt(sc,"approve","papers not")-0.5,tLabel=wAt(sc,"approve","written"),tFill=wAt(sc,"pile","pile"),tClaim=wAt(sc,"claim","money"),tBand=wAt(sc,"claim","stay until");
  const tOther=wAt(sc,"other","destroyed"),tOpen=sc.cues.saved,tSaves=wAt(sc,"saved","saves"),tBudget=wAt(sc,"budget","budget");
  const tSteps=sc.cues.today-0.4,tGood=wAt(sc,"today","kept for good"),tCase=sc.cues.family-0.3,tHall=sc.cues.uni-0.3,tNoEnd=wAt(sc,"uni","no end date"),tEnd=wAt(sc,"end","end date");
  // the drawers that empty, one at a time, each with its own note; the one under the band stays full
  const empties=[[1,tOpen+2.0,"Orders · 1943"],[4,tOpen+3.8,"Letters · 1943"]];
  const label="Payrolls · 1944",typed=Math.floor(label.length*clamp((t-tLabel)/1.1,0,1));
  ag_shots(ctx,S,t,sc.dur,[
    // the desk: the Act; who drafted it; the page turns to a schedule; its columns light; two stamps
    {at:0,place:"hlDesk",push:0.02,draw:(x,tt)=>{
      hl_actPage(x,P,{turn:ag_sine(clamp((tt-tTurn)/1.3,0,1)),litLong:hl_v(tt,tLong,tThen,0.4),litThen:ag_in(tt,tThen,0.4)});
      hl_stamp(x,P.x+P.w/2+40,P.y+P.h-210,"Approved · the Archivist",ag_in(tt,tArch,0.5),-0.05);
      hl_stamp(x,P.x+P.w/2-20,P.y+P.h-110,"Approved · Congress",ag_in(tt,tCong,0.5),0.04);
      const aC=hl_v(tt,tDraft,tTurn,0.6);dp_card(x,60,330,440,{title:"The National Archives"},{a:aC,k:ag_spr(tt,tDraft,0.9)});
      dp_card(x,1420,330,440,{title:"A committee of Congress"},{a:hl_v(tt,tComm,tTurn,0.6),k:ag_spr(tt,tComm,0.9)});
      dp_link(x,[500,420],[P.x,420],"grey",aC,{dot:false,alpha:0.7});dp_link(x,[P.x+P.w,420],[1420,420],"grey",hl_v(tt,tComm,tTurn,0.6),{dot:false,alpha:0.7});}},
    // the cabinets after the law, the clerk gone home: next year's payrolls get their drawer and its label before the papers exist; it
    // fills only after; 1943's payrolls, about money claimed, under a band; nothing any other way; the savings: the drawers of 1943's
    // orders and letters are emptied, one after the other, as their schedules say; the payrolls under the band stay
    {at:tWall,place:"hlWall",dis:0.9,push:0.0,keys:[[tWall,1120,560,1.2],[tOpen,960,540,1]],d:1.8,draw:(x,tt)=>{
      const open=ag_eo(clamp((tt-tOpen)/0.8,0,1)),emptied=([i,te,l])=>({i,big:true,label:l,out:open*(1-ag_eo(clamp((tt-te-0.7)/0.6,0,1))),full:1-ag_in(tt,te,0.6),
        eyeX:i===4?hl_wallX(4)+HL_WALL.w/2:null});// the drawer at the frame's right edge comes out straight towards us, so its label stays in the frame
      // the drawers, the most open drawn last (an open drawer stands in front of its shut neighbours)
      const dr=[{i:0},emptied(empties[0]),{i:2,big:true,label:"Payrolls · 1943",full:1},
        {i:3,big:true,label:label.slice(0,typed),typeOf:label,out:ag_eo(clamp((tt-tLabel-1.2)/0.6,0,1))*(1-ag_in(tt,tFill+1.2,0.6)),full:ag_in(tt,tFill,0.9)},emptied(empties[1])];
      const box={};dr.slice().sort((a,b)=>(a.out||0)-(b.out||0)).forEach(o=>box[o.i]=hl_wallDrawer(x,o.i,o));const d2=box[2],d=box[3];
      // the papers not yet written: a folder drawn in dashes, sliding down into the new drawer and out of sight behind its front
      const fu=clamp((tt-tLabel-1.4)/1.6,0,1);if(fu>0&&fu<1){const fx=d.x+d.w/2,fy=lerp(d.y-250,d.y+150,ag_sine(fu));x.save();x.globalAlpha*=Math.min(1,fu*5);
        x.beginPath();x.rect(d.x-40,0,d.w+80,d.y);x.clip();x.setLineDash([12,9]);x.strokeStyle=rgba(DP.ice,0.95);x.lineWidth=3;
        x.beginPath();x.moveTo(fx-120,fy+80);x.lineTo(fx-120,fy-60);x.lineTo(fx+10,fy-60);x.lineTo(fx+22,fy-84);x.lineTo(fx+100,fy-84);x.lineTo(fx+112,fy-60);x.lineTo(fx+120,fy-60);x.lineTo(fx+120,fy+80);x.stroke();x.restore();}
      hl_bandAcross(x,d2.x-40,d2.y+96,d2.w+80,58,"closed",["Until the claim","is settled"],ag_in(tt,tBand,0.8));
      dp_card(x,1100,130,720,{title:"No paper destroyed any other way"},{a:hl_v(tt,tOther,tSaves-0.3,0.6),k:ag_spr(tt,tOther,0.9)});
      const cs=dp_card(x,1160,110,640,{title:"$927,000 saved",sub:"Army Air Forces alone · 1944"},{a:ag_in(tt,tSaves,0.6),k:ag_spr(tt,tSaves,0.9)});
      dp_slip(x,1160,cs.y+cs.h+14,"About the Archives' whole budget","grey",{a:ag_in(tt,tBudget,0.6),ink:true});}},
    // the Archives today: the few folders go up the steps into the light
    {at:tSteps,place:"hlSteps",dis:0.9,push:0.025,draw:(x,tt)=>{
      const D=HL_STEPS_DOOR;dp_link(x,[960,1040],[960,D.y+D.h/2-30],"grey",ag_in(tt,tSteps+0.5,1.4),{dash:[4,14],lw:3,dot:false,alpha:0.7});
      for(let i=0;i<3;i++){const u=clamp((tt-tSteps-0.8-i*0.7)/2.6,0,1);if(u<=0||u>=1)continue;const y=lerp(1000,D.y+D.h/2,ag_sine(u)),a=Math.min(1,u*4,(1-u)*4);
        x.save();x.globalAlpha*=a;x.shadowColor="rgba(255,226,180,0.8)";x.shadowBlur=20;x.fillStyle="rgb(232,204,150)";x.fillRect(930,y-24,60,44);x.restore();}
      dp_card(x,1180,170,600,{title:"Kept for good today: 1 to 3%"},{a:ag_in(tt,tGood,0.6),k:ag_spr(tt,tGood,0.9),behind:"hlSteps"});}},
    // a family's page and a service record in a glass case, read by lamplight
    {at:tCase,place:"hlCase",dis:0.9,push:0.035},
    // the university: its platform keeps every record, with no end date; one shelf becomes a drawer with its end date
    {at:tHall,place:"hlHall",dis:0.9,push:0.02,draw:(x,tt)=>{
      const dr=ag_in(tt,tEnd,0.9),sh=[0,1,2,3,4,5,6].map(i=>({n:8,warm:i===0,drawer:i===2?dr:0,label:"Pay records"}));hl_block(x,sh,{behind:"hlHall"});
      dp_slip(x,HL_BLOCK.x+HL_BLOCK.w+30,hl_shelfAt(2,7)[1]-35,"Until …","grey",{a:ag_in(tt,tEnd+0.4,0.6),ink:true});
      hl_bandAcross(x,HL_BLOCK.x-60,470,HL_BLOCK.w+120,64,"none","No end date",hl_v(tt,tNoEnd,tEnd-0.2,0.7));}}
  ],0.8);
  if(t<tHall)dp_kicker(ctx,"Washington","7 July 1943",{a:hl_v(t,0.4,tWall-0.4,0.8)});
  dp_kicker(ctx,"Washington","Today",{a:hl_v(t,tSteps+0.4,tHall-0.6,0.8)});
  dp_title(ctx,S,t,sc.cues.breath,"How long, and then what","An end date for every record","FILM 2 OF 5 · KEPT FOR A REASON");
});

/* ---------------------------------------------------------------- 3 · Three stages of a record */
// Ingrid and Yusuf at the hall's edges, looking in at the platform; between them, the block, then the three stages
const HL_INGRID=[200,712,0.76],HL_YUSUF=[1720,712,0.76];
function hl_pair(c,t,o){o=o||{};dp_person(c,"ingrid",HL_INGRID[0],HL_INGRID[1],HL_INGRID[2],{t,gaze:[3,0]});dp_person(c,"yusuf",HL_YUSUF[0],HL_YUSUF[1],HL_YUSUF[2],{t,flip:true,gaze:[3,0]});
  if(o.names>0){dp_pill(c,322,566,"Ingrid Holm","identity",{a:o.names*(o.ingrid==null?1:o.ingrid)});dp_pill(c,1598,566,"Yusuf Demir","identity",{a:o.names*(o.yusuf==null?1:o.yusuf),align:"right"});}}
scene("lives",(ctx,S,t,sc)=>{
  const tPay=wAt(sc,"pay","Pay records"),tApps=wAt(sc,"pay","applications"),tNever=wAt(sc,"never","Nothing"),tThree=wAt(sc,"three","three stages");
  const tUse=wAt(sc,"use","live"),tLinh=wAt(sc,"use","Linh"),tArch=wAt(sc,"archived","archived"),tCold=wAt(sc,"archived","read rarely");
  const tDel=wAt(sc,"deleted","deleted"),tGood=wAt(sc,"good","kept for good"),tYear=sc.cues.year-0.3,tLeak=wAt(sc,"year","leak"),tPlan=wAt(sc,"plan","deleting"),tLaw=wAt(sc,"plan","the law");
  const panesA=hl_v(t,tThree,tYear,0.8);
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"hlHall",push:0.012,draw:(x,tt)=>{
    // the platform: full, nothing ever deleted; dimmed while the three stages are shown
    const bA=1-0.82*panesA,yrs=Math.round(lerp(2016,2026,clamp((tt-tLeak+1.5)/2.6,0,1))),coral=ag_in(tt,tLeak,1.2);
    const sh=[0,1,2,3,4,5,6].map(i=>({n:8,warm:i===6,coral:i===0?coral:0}));hl_block(x,sh,{a:bA,behind:"hlHall"});
    hl_greyTag(x,1190,hl_shelfAt(1,7),"Pay records · since 2016",{behind:"hlHall",a:hl_v(tt,tPay,tThree-0.6,0.6)*bA,p:ag_in(tt,tPay+0.2,0.6)});
    hl_greyTag(x,1190,hl_shelfAt(3,7),"Applications · since 2017",{behind:"hlHall",a:hl_v(tt,tApps,tThree-0.6,0.6)*bA,p:ag_in(tt,tApps+0.2,0.6)});
    hl_bandAcross(x,HL_BLOCK.x-80,62,HL_BLOCK.w+160,64,"none","Nothing ever deleted",hl_v(tt,tNever,tThree-0.6,0.7));
    // the oldest card: its years counting up, its rim turning coral
    if(tt>tYear){const a=hl_v(tt,tYear+0.6,tPlan-0.3,0.6);dp_slip(x,HL_BLOCK.x-190,HL_BLOCK.y+4,String(yrs),"grey",{a,ink:true});
      dp_slip(x,1190,HL_BLOCK.y+60,"Could leak · could be misused","coral",{a:hl_v(tt,tLeak+0.3,tPlan-0.3,0.6)});}
    // deleting without a plan: a record the law needs goes too soon
    if(tt>tPlan){const u=ag_in(tt,tLaw,1.6);hl_rec(x,1180,420,410,["Pay record the law needs"],{a:ag_in(tt,tPlan,0.6)*(1-0.75*u),coral:u,behind:"hlHall"});
      dp_pill(x,1180,566,"Gone too soon","closed",{a:ag_in(tt,tLaw+1.0,0.6)});}
    // three stages: live (in use), archived, deleted; kept for good above archived (the author's names, 12 November 2026)
    if(panesA>0){x.save();x.globalAlpha*=panesA;
      hl_pane(x,440,470,330,330,"Live",{behind:"hlHall",glow:0.8+ag_in(tt,tUse,0.6)*hl_v(tt,tUse,tArch,0.5)});
      hl_pane(x,800,470,330,330,"Archived",{behind:"hlHall"});hl_pane(x,1160,470,330,330,"Deleted",{behind:"hlHall"});
      hl_pane(x,800,200,330,240,"Kept for good",{behind:"hlHall",a:ag_in(tt,tGood-0.4,0.6)});
      hl_rec(x,465,575,280,["Pay records","this year"],{a:ag_in(tt,tUse+0.3,0.6),warm:true,behind:"hlHall"});
      dp_pill(x,605,725,"Linh Nguyen","identity",{a:ag_in(tt,tLinh,0.6),align:"center"});
      ["2023","2024","2025"].forEach((y,i)=>hl_rec(x,822+i*98,575,88,[y],{a:ag_in(tt,tArch+0.3+i*0.25,0.6),dim:0.35,behind:"hlHall"}));
      dp_slip(x,965,668,"Read rarely","grey",{a:ag_in(tt,tCold,0.6),ink:true,align:"center"});
      const fade=ag_in(tt,tDel+0.3,1.4);hl_rec(x,1255,575,140,["2016"],{a:ag_in(tt,tDel-0.3,0.4)*(1-fade),dim:0.4,behind:"hlHall"});
      const up=ag_eo(clamp((tt-tGood)/1.4,0,1));hl_rec(x,835,lerp(575,300,up),260,["Degrees","and results"],{a:ag_in(tt,tGood-0.2,0.5),behind:"hlHall"});
      x.restore();}
    // Ingrid, who owns HR's records, and Yusuf, from data governance
    hl_pair(x,tt,{names:hl_v(tt,sc.cues.look,tPay-0.2,0.6),yusuf:ag_in(tt,wAt(sc,"look","Yusuf"),0.6)});}}]);
  dp_kicker(ctx,"The university","October 2026",{a:hl_v(t,0.5,sc.cues.look+3.5,0.8)});
});

/* ---------------------------------------------------------------- 4 · One schedule, by kind of record */
scene("schedule",(ctx,S,t,sc)=>{
  const tLists=wAt(sc,"lists","Washington"),tOne=wAt(sc,"one","one schedule"),tRow=wAt(sc,"row","kind"),tOwner=wAt(sc,"row","owner"),tReason=wAt(sc,"row","reason");
  const tLong=wAt(sc,"row","how long"),tThen=wAt(sc,"row","then what"),tOwners=wAt(sc,"owners","Ingrid"),tMei=wAt(sc,"owners","Mei Tanaka"),tKeeps=wAt(sc,"owners","Yusuf keeps");
  const tPay=sc.cues.payrow,tAcad=sc.cues.academic,tMail=wAt(sc,"others","mailing"),tApps=wAt(sc,"others","applications"),tPills=wAt(sc,"reason","A reason");
  const tSign=wAt(sc,"signed","sign"),tClean=wAt(sc,"first","clean-up"),tGone=sc.cues.went;
  const aT=hl_v(t,tOne,tClean-0.6,0.8);
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"hlHall",push:0.0,keys:[[0,960,540,1],[tClean,960,500,1.1]],d:1.8,draw:(x,tt)=>{
    // record by record, like Washington's lists: one list after another, never ending
    for(let i=0;i<4;i++)hl_sheet(x,520+i*170,210+i*56,380,230,{title:["List No. "+(i+1)],lines:3,a:hl_v(tt,0.3+i*0.7,tOne-0.8,0.6),rot:-0.05+i*0.032});
    hl_schedule(x,{a:aT,behind:"hlHall",head:[ag_in(tt,tRow,0.4),ag_in(tt,tOwner,0.4),ag_in(tt,tReason,0.4),ag_in(tt,tLong,0.4),ag_in(tt,tThen,0.4)],
      rows:[ag_in(tt,tPay,0.8),ag_in(tt,tAcad,0.8),ag_in(tt,tMail,0.8),ag_in(tt,tApps,0.8)],owners:[ag_in(tt,tOwners,0.5),ag_in(tt,tMei,0.5),ag_in(tt,tOwners+0.25,0.5),ag_in(tt,tOwners+0.5,0.5)],pills:1,pillGlow:hl_v(tt,tPills,tSign,0.5),
      kept:ag_in(tt,tKeeps,0.6),signed:ag_in(tt,tSign,0.8)});
    // the first clean-up: the shelves of 2016, 2017 and 2018 empty one after another, and old applications leave together
    const bA=ag_in(tt,tClean-0.4,0.8);if(bA>0){const years=["2016","2017","2018","2019","2020"],sh=years.map((y,i)=>({n:8*(i<3?1-ag_in(tt,tGone+i*0.9,0.7):1),drawer:0}));
      sh.push({n:8*(1-ag_in(tt,tGone+3.0,1.2))});sh.push({n:8,warm:true});hl_block(x,sh,{a:bA,behind:"hlHall"});
      years.forEach((y,i)=>dp_slip(x,HL_BLOCK.x-160,HL_BLOCK.y+i*HL_BLOCK.h/7+14,y,"grey",{a:bA*(i<3?1-0.6*ag_in(tt,tGone+i*0.9+0.6,0.6):1),ink:true,size:28}));
      hl_greyTag(x,1200,hl_shelfAt(5,7),"Applications, not hired",{behind:"hlHall",a:bA});}}}]);
});

/* ---------------------------------------------------------------- 5 · The clock starts at an event */
// a window back to 1943, over the hall: part of the clerk's cabinets, one drawer drawn live in it (sx, sy, sw, sh: the part of the place)
function hl_inset1943(c,X,Y,Wd,Hd,src,drawer,a){if(a<=0)return;const [sx,sy,sw,sh]=src,k=Wd/sw;c.save();c.globalAlpha*=a;dp_panel(c,X-16,Y-16,Wd+32,Hd+32,{r:18,behind:"hlHall"});
  c.save();rr(c,X,Y,Wd,Hd,12);c.clip();c.drawImage(ag_place("hlWall"),sx,sy,sw,sh,X,Y,Wd,Hd);c.translate(X-sx*k,Y-sy*k);c.scale(k,Hd/sh);drawer(c);c.restore();c.restore();}
scene("clock",(ctx,S,t,sc)=>{
  const tEvent=wAt(sc,"event","event"),tNot=wAt(sc,"event","not from"),tEach=wAt(sc,"contract","each contract"),tEight=wAt(sc,"eight","eight end dates");
  const tFirst=wAt(sc,"firstc","kept until"),tLast=wAt(sc,"lastc","kept until"),tApp=wAt(sc,"others","application"),tMail=wAt(sc,"others","mailing");
  const tFollow=wAt(sc,"follows","end date"),tFri=wAt(sc,"friday","Friday"),tEnds=wAt(sc,"friday","ends"),tNobody=sc.cues.nobody,t43=sc.cues.as43;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"hlHall",push:0.015,draw:(x,tt)=>{
    // a record's time: the day it was made at the line's start; the event, later; how long counts from the event to the end date
    const aE=hl_v(tt,0.4,tEach-0.3,0.7);if(aE>0){const y=470,x0=560,xe=1000,x1=1600;x.save();x.globalAlpha*=aE;
      x.save();x.strokeStyle=rgba(DP.ice,0.9);x.lineWidth=3;x.shadowColor=rgba(DP.F.cyan,0.6);x.shadowBlur=10;x.beginPath();x.moveTo(x0,y);x.lineTo(1780,y);x.stroke();x.restore();
      x.fillStyle=rgba(DP.ice,1);x.beginPath();x.arc(x0,y,8,0,TAU);x.fill();hl_rec(x,x0-40,y-170,300,["Pay record"],{behind:"hlHall"});dp_T(x,"Made",x0,y+58,{w:700,size:28,align:"center",col:"mut"});
      const ev=ag_in(tt,tEvent,0.6);if(ev>0){x.save();x.globalAlpha*=ev;x.strokeStyle=rgba(DP.ice,1);x.lineWidth=3;x.beginPath();x.moveTo(xe,y-60);x.lineTo(xe,y+60);x.stroke();x.restore();
        dp_slip(x,xe,y+76,"Event","grey",{a:ev,ink:true,align:"center"});}
      const p=ag_eo(clamp((tt-tNot)/1.4,0,1));if(p>0){const xa=lerp(xe,x1,p);dp_link(x,[xe,y-34],[xa,y-34],"grey",1,{dot:false,lw:4});
        dp_T(x,"How long",(xe+x1)/2,y-58,{w:700,size:30,align:"center",a:clamp(p*2,0,1)});
        if(p>=1){const u=ag_in(tt,tNot+1.4,0.5);x.save();x.globalAlpha*=u;x.strokeStyle=rgba(DP.ice,1);x.lineWidth=3;x.beginPath();x.moveTo(x1,y-60);x.lineTo(x1,y+60);x.stroke();x.restore();
          dp_T(x,"End date",x1,y+108,{w:700,size:30,align:"center",a:u});}}
      x.restore();}
    // Linh's eight contracts, and each one's end date: the first, then the last, picked out in turn
    const d43=0.65*ag_in(tt,t43-0.2,0.7);
    for(let i=0;i<8;i++){const pick=i===0?hl_v(tt,tFirst,tLast-0.2,0.5):i===7?ag_in(tt,tLast,0.5)*(1-ag_in(tt,tApp-0.2,0.5)):0;
      const dim=Math.max(0.55*ag_in(tt,tFirst,0.5)*(1-pick)*(1-ag_in(tt,tApp-0.2,0.6)),d43);
      hl_contract(x,i,ag_in(tt,tEach+i*0.18,0.6),ag_in(tt,tEight+0.3+i*0.15,0.5),{dim,behind:"hlHall",lit:Math.max(pick,hl_v(tt,tNobody+i*0.12,t43-0.2,0.5))});}
    dp_slip(x,1350,HL_CY+7*HL_CH-3,"Ended","grey",{a:hl_v(tt,tEnds,t43-0.3,0.6),ink:true});
    // other kinds, other events
    dp_card(x,1350,190,540,{title:"Application",sub:"from the decision"},{a:hl_v(tt,tApp,tFollow-0.2,0.6),k:ag_spr(tt,tApp,0.9)});
    dp_card(x,1350,400,540,{title:"Mailing list",sub:"from the last contact, or a no"},{a:hl_v(tt,tMail,tFollow-0.2,0.6),k:ag_spr(tt,tMail,0.9)});
    dp_card(x,1350,190,540,{title:"Friday 20 November 2026"},{a:hl_v(tt,tFri,t43-0.3,0.6),k:ag_spr(tt,tFri,0.9)});
    // as in 1943: the drawer labelled before its papers
    hl_inset1943(x,1130,330,700,282,[1100,590,490,197],cc=>hl_wallDrawer(cc,3,{big:true,label:"Payrolls · 1944",full:1}),hl_v(tt,t43,sc.dur,0.7));
    // Linh, the casual tutor whose contracts they are
    dp_person(x,"linh",270,612,0.95,{t:tt,gaze:[3,0]});
    dp_pill(x,270,742,"Linh Nguyen","identity",{a:hl_v(tt,wAt(sc,"eight","Linh"),tFirst,0.6),align:"center"});}}]);
});

/* ---------------------------------------------------------------- 6 · A hold stops the clock */
scene("hold",(ctx,S,t,sc)=>{
  const tTutor=wAt(sc,"tutor","former tutor"),tDue=wAt(sc,"due","due to go"),tShow=wAt(sc,"show","neither"),tPlace=wAt(sc,"places","places a hold");
  const tNames=wAt(sc,"names","names"),tReason=wAt(sc,"names","reason"),tPlaced=wAt(sc,"names","placed"),tLift=wAt(sc,"names","lift");
  const tSkips=wAt(sc,"skips","skips"),tCase=wAt(sc,"never","just in case"),tSettled=wAt(sc,"lifts","settled"),tLifts=wAt(sc,"lifts","lifts"),tNext=wAt(sc,"lifts","next clean-up");
  const t43=sc.cues.as43;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"hlHall",push:0.015,draw:(x,tt)=>{
    // the drawer of 2019's pay records, due to go in January; hers among them
    const aD=ag_in(tt,0.6,0.8),dim=0.35*hl_v(tt,tShow,tPlace,0.6),D={x:150,y:300,w:820,h:300};
    x.save();x.globalAlpha*=aD*(1-dim);dp_panel(x,D.x,D.y,D.w,D.h,{r:18,behind:"hlHall"});dp_T(x,"Pay records · 2019",D.x+30,D.y+56,{w:700,size:34});
    for(let k=0;k<10;k++){const hers=k>=7,leave=hers?ag_in(tt,tNext,1.0):ag_in(tt,tSkips+0.4+k*0.08,0.9),a=1-leave;if(a<=0)continue;x.save();x.globalAlpha*=a;x.translate(0,-30*leave);
      x.fillStyle="rgba(190,240,240,0.16)";rr(x,D.x+40+k*76,D.y+100,56,160,6);x.fill();x.strokeStyle=rgba(DP.ice,0.6);x.lineWidth=1.6;rr(x,D.x+40+k*76,D.y+100,56,160,6);x.stroke();x.restore();}
    x.restore();
    dp_slip(x,D.x+D.w-370,D.y-90,"Due to go: January","grey",{a:aD*hl_v(tt,tDue,tSkips-0.3,0.6),ink:true});
    // the hold, across her records only
    const band=ag_in(tt,tPlace,0.9)*(1-ag_in(tt,tLifts,0.9));hl_bandAcross(x,D.x+40+7*76-14,D.y+150,3*76+12,60,"closed","Hold",band);
    // the claim, and the hold's card
    dp_card(x,1060,150,700,{title:"A former tutor's pay claim",sub:"not settled"},{a:hl_v(tt,tTutor,tNames-0.4,0.6)*(1-dim*0.8),k:ag_spr(tt,tTutor,0.9),behind:"hlHall"});
    const hc=hl_v(tt,tNames,tSettled,0.6);if(hc>0){x.save();x.globalAlpha*=hc;dp_panel(x,1060,150,760,360,{col:"coral",r:20,behind:"hlHall"});
      dp_T(x,"HOLD",1100,214,{w:800,size:28,ls:4,col:"coral"});
      [["Records: her pay records, 2019",tNames],["Reason: her pay claim",tReason],["Placed by: the legal office",tPlaced],["Lifted by: the legal office",tLift]].forEach(([s,at],i)=>
        dp_T(x,s,1100,282+i*58,{w:600,size:30,a:ag_in(tt,at,0.5)}));x.restore();}
    dp_card(x,1060,560,380,{title:"January"},{a:hl_v(tt,tSkips-0.2,tCase-0.2,0.6),k:ag_spr(tt,tSkips-0.2,0.9),behind:"hlHall"});
    // never just in case
    const jc=hl_v(tt,tCase-0.4,tSettled-0.2,0.6);if(jc>0){const bb=dp_slip(x,1060,560,"Just in case","grey",{a:jc,ink:true});hl_strike(x,bb.x+16,bb.y+bb.h/2+2,bb.w-32,ag_in(tt,tCase+0.2,0.6)*jc);}
    dp_card(x,1060,560,420,{title:"Next clean-up"},{a:hl_v(tt,tNext-0.4,t43-0.2,0.6),k:ag_spr(tt,tNext-0.4,0.9),behind:"hlHall"});
    // as in 1943: the drawer kept until the claim is settled, for a moment
    const m=hl_v(tt,t43,sc.dur,0.7);hl_inset1943(x,1100,300,700,282,[715,590,490,197],cc=>hl_wallDrawer(cc,2,{big:true,label:"Payrolls · 1943",full:1}),m);
    hl_bandAcross(x,1090,446,720,58,"closed",["Until the claim","is settled"],ag_in(tt,t43+0.5,0.8)*m);}}]);
});

/* ---------------------------------------------------------------- 7 · An end date for every record */
scene("end",(ctx,S,t,sc)=>{
  const tSoon=wAt(sc,"short","Deleted too soon"),tLong=wAt(sc,"long","Kept too long"),tLaws=wAt(sc,"laws","keep personal"),tOut=wAt(sc,"outside","outside the schedule");
  const tHold=wAt(sc,"outside","except"),tCopy=wAt(sc,"copy","every copy"),tDmd=wAt(sc,"dmd","Deleted means"),t43=sc.cues.pile-0.3,tFew=wAt(sc,"few","rest went"),tUni=sc.cues.every-0.3;
  const panes=["Platform","Archive","Old versions","Logs"];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"hlHall",push:0.015,draw:(x,tt)=>{
      hl_lifeline(x,{a:hl_v(tt,0.4,tLaws-0.3,0.8),soon:hl_v(tt,tSoon,tLong,0.5),long:ag_in(tt,tLong,0.5)});
      dp_card(x,360,170,1200,{title:"Keep personal data no longer than its reason needs"},{a:hl_v(tt,tLaws,tCopy-0.4,0.6),k:ag_spr(tt,tLaws,0.9),behind:"hlHall"});
      const sg=hl_v(tt,tOut,tCopy-0.4,0.6);if(sg>0){dp_card(x,560,420,520,{title:"Retention schedule"},{a:sg,behind:"hlHall"});hl_bandAcross(x,1130,436,200,64,"closed","Hold",ag_in(tt,tHold,0.8)*sg);}
      const slide=ag_eo(clamp((tt-tDmd)/1.6,0,1));
      panes.forEach((p,i)=>{const a=ag_in(tt,tCopy+i*0.35,0.6)*(1-ag_in(tt,tDmd+0.8,0.8));if(a<=0)return;const px=240+i*370+(i<2?-1:1)*slide*260;
        hl_pane(x,px,300,330,300,p,{a,behind:"hlHall"});dp_slip(x,px+165,430,"Until 20 Nov 2033","grey",{a,ink:true,align:"center",size:28});});}},
    // 1943: the cabinets labelled; most drawers empty, a few folders on their way to the Archives
    {at:t43,place:"hlWall",dis:0.9,push:0.02,keys:[[t43,960,540,1]],draw:(x,tt)=>{
      [["Orders · 1941",0.1,0],["Contracts · 1942",0.15,0.6],["Payrolls · 1943",1,0.6],["Letters · 1943",0.1,0.35]].forEach(([l,f,o],k)=>hl_wallDrawer(x,k+1,{big:true,label:l,out:o,full:f}));
      hl_wallDrawer(x,0,{});hl_clerk(x,tt,1);
      for(let i=0;i<3;i++){const u=clamp((tt-tFew-i*0.6)/2.4,0,1);if(u<=0||u>=1)continue;const px=lerp(1210,1900,ag_sine(u)),py=lerp(700,420,ag_sine(u))-Math.sin(u*Math.PI)*60;
        x.save();x.globalAlpha*=Math.min(1,u*4,(1-u)*3);x.shadowColor="rgba(255,226,180,0.7)";x.shadowBlur=18;x.fillStyle="rgb(222,196,140)";x.fillRect(px-36,py-26,72,52);x.restore();}}},
    // the university: the platform's shelves now drawers, one for each kind of record, each with how long it's kept
    {at:tUni,place:"hlHall",dis:0.9,push:0.02,draw:(x,tt)=>{
      const rows=[["Pay records","7 years after each contract"],["Academic records","Kept for good"],["Mailing list","Until a no, or 2 years"],["Applications","12 months after the decision"]];
      const sh=rows.map((r,i)=>({n:8,drawer:1,label:r[0],warm:i===0}));hl_block(x,sh,{behind:"hlHall"});
      rows.forEach((r,i)=>dp_slip(x,HL_BLOCK.x+HL_BLOCK.w+24,HL_BLOCK.y+(i+0.5)*HL_BLOCK.h/4-34,r[1],"grey",{ink:true,size:28,a:ag_in(tt,tUni+0.8+i*0.25,0.6)}));}}
  ],0.8);
  dp_end(ctx,S,t,sc.cues.breath,"How long, and then what","Every record has an end date, decided before it's needed.","Film 2 of 5","Kept for a reason");
});

ag_cutInto(["lives","schedule","clock","hold","end"]);
