/* ===== Agents on the map: scenes =====
   Eleven chapters, as in ../script.md. Babylon, about 620 BCE: Etemenanki in ruins, a king who has it rebuilt by splitting the work
   into tasks and answering for it, and a tower that stands again; then the utility's own many hands, some of them agents. Tomás's
   map, with two agents on it; a payment plan nobody saw, agreed by a chat a vendor switched on; the search for every agent; an agent
   as software in a role of its own, covering tasks, never a whole activity; how far it may go on each task; its own identity and a
   hand-off; the person who answers for it; every agent on the map; the Tower of Babel, as the story Babylon's tower may have
   inspired; and the answer to Tomás's note.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: every shot
   drifts slowly, things arrive with a spring, and in one room the camera glides on and never cuts. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. Many hands ---------- */
// Babylon's precinct at dawn: the tower's mound, the people who see it, the plan pegged out, the tasks, the king at the foundation, and
// the tower rising stage by stage; then the present, in the same chapter, as the whole picture changes: many hands, some of them agents
const A1_BY=772,A1_S=5.2;
scene("hands",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tNow=c("now"),past=1-fin(t,tNow-0.3,1.3);
  // the light: before dawn as the king finds the ruin, dawn as the tower rises, a hazy morning when it stands again
  const dawn=0.22+0.43*fin(t,c("must"),7)+0.35*fin(t,c("rose"),6),day=0.5*fin(t,c("son")+1.2,5);
  const tR=c("rose"),tS=c("son"),m=15*clamp((t-tR-0.6)/3.4,0,1)+75*easeCam(clamp((t-tS-0.4)/6.2,0,1)),ruin=1-fin(t,tR,1.8);
  if(past<0.999){setScreen(ctx,S);bg2(ctx);motes(ctx,t);a1_hands(ctx,t,sc,c,w);}
  a1_fade(ctx,past,cx=>{setScreen(cx,S);cx.save();
    const tH=c("harm"),tM=c("must"),tB=c("big"),tP=c("plan"),tT=c("tasks"),tN=c("name");
    const K=[[0,960,610,1.3],[c("ruin")-0.4,960,700,1.7],[tH-0.2,960,660,1.35],[tM+0.3,960,470,0.9],[tB+0.2,960,600,1.0],[tP+0.3,960,690,1.2],
      [tT-0.2,960,560,1.0],[tN-0.3,890,712,1.85],[tR-0.6,960,610,1.08],[tS+0.3,960,500,0.9]];
    focus(cx,t,K,1.8);
    bab_sky(cx,t,{dawn,day});bab_city(cx,t,{dawn,day});bab_ground(cx,t,{dawn,day});
    // the plan, pegged out round the old foundation, and kept while the tower rises on it
    const rp=clamp((t-w("plan","ropes")+0.2)/2.4,0,1),FL=[694,A1_BY+8],FR=[1226,A1_BY+8],BR=[1184,A1_BY-26],BL=[736,A1_BY-26];
    bab_rope(cx,[FL,FR,BR,BL,FL],rp,{a:0.85*(1-fin(t,tS+2,2)),lw:1.6});
    bab_tower(cx,960,A1_BY,A1_S,{m,ruin,dawn,day,ghost:fin(t,w("must","raise"),1.4)*(1-fin(t,tB+0.6,1.0)),hi:fin(t,w("son","stood"),1.6)});
    // the work on the tower: tiny figures carrying up the stair and along the terraces as it rises
    if(m>2){const n=Math.min(34,Math.floor(m*0.6));for(let i=0;i<n;i++){const u=(t*0.03+hash(i,701))%1,st=i%3,yy=A1_BY-Math.min(m,st===0?33*u:12+u*(m-12))*A1_S,xx=st===0?960+(hash(i,702)-0.5)*30:960+(hash(i,703)-0.5)*BAB_T[Math.min(6,Math.floor(u*4))][0]*A1_S*0.9;
      if(A1_BY-yy>m*A1_S)continue;bab_folk(cx,xx,yy,9,"carry",t,{col:[26,18,14],rim:0.3,step:t*6+i,dir:hash(i,704)>0.5?1:-1});}}
    const rim=0.35+0.4*dawn;
    // the new king, before the ruin, then the people of Babylon who see it
    const kgA=fin(t,w("ruin","Nabopolassar")-0.6,1.0)*(1-fin(t,tM+0.2,0.9));if(kgA>0.01)bab_folk(cx,1330,880,176,"stand",t,{a:kgA,king:true,dir:-1,rim});
    const oA=fin(t,tH-0.3,1.0)*(1-fin(t,tM+0.2,0.9));
    if(oA>0.01){bab_folk(cx,560,890,186,"stand",t,{a:oA,dir:1,veil:true,rim});bab_folk(cx,622,896,198,"stand",t,{a:oA,dir:1,rim});bab_folk(cx,700,888,172,"stand",t,{a:oA*fin(t,tH+0.6,1.0),dir:1,rim});}
    // the scale: one person at the foot of the base, to measure ninety metres against
    const bA=fin(t,tB+0.4,0.8)*(1-fin(t,tP+0.2,0.8));
    if(bA>0.01){withA(cx,bA,()=>{cx.save();cx.strokeStyle=rgba(BAB_CLAY,0.95);cx.lineWidth=2.4;cx.beginPath();cx.moveTo(722,A1_BY+30);cx.lineTo(1198,A1_BY+30);cx.moveTo(722,A1_BY+18);cx.lineTo(722,A1_BY+42);cx.moveTo(1198,A1_BY+18);cx.lineTo(1198,A1_BY+42);cx.stroke();cx.restore();
      T(cx,"about 90 m",960,A1_BY+78,{w:800,size:30,align:"center",color:rgba(BAB_CLAY,1)});});
      bab_folk(cx,700+clamp(t-tB,0,9)*2,A1_BY+2,9,"carry",t,{a:bA,step:t*6,rim:0.5});}
    // the surveyor with the rod and the master builder with the rope, near the camera
    const sA=fin(t,tP+0.2,0.9)*(1-fin(t,tT-0.4,0.9));
    if(sA>0.01){bab_folk(cx,430,920,236,"rod",t,{a:sA,dir:1,rim});
      const hd=bab_folk(cx,1400,924,232,"rope",t,{a:sA,dir:-1,rim});if(hd)withA(cx,sA,()=>bab_rope(cx,[hd,[1226,A1_BY+8]],clamp((t-w("plan","ropes")+0.4)/1.4,0,1),{lw:2.4}));}
    // the tasks, at work across the precinct: a moulder at the left, the kiln, carriers and a boat on the river
    const k0=w("tasks","moulding"),k1=w("tasks","firing"),k2=w("tasks","carrying"),k3=w("tasks","bringing"),endT=fin(t,tN-0.6,1.0);
    if(t>k1-0.6){const a=fin(t,k1-0.4,0.9)*(1-fin(t,tS+3,2));bab_kiln(cx,236,866,0.95,t,{a,fire:a});}
    if(t>k0-0.6){const a=fin(t,k0-0.4,0.9)*(1-endT);bab_folk(cx,420,872,150,"mould",t,{a,dir:1,rim});}
    if(t>k2-0.6){for(let i=0;i<4;i++){const a=fin(t,k2-0.4+i*0.25,0.8)*(1-endT),x=(380+((t-k2)*34+i*230))%1500+200;bab_folk(cx,x,836+i*6,96-i*4,"carry",t,{a:a*clamp((1660-x)/120,0,1)*clamp((x-220)/120,0,1),dir:1,step:t*4.2+i*1.7,rim});}}
    if(t>k3-0.6){const a=fin(t,k3-0.4,0.9)*(1-fin(t,tS+3,2));bab_boat(cx,1800-(t-k3)*10,852,0.62,t,{a,rim:0.4*dawn});}
    // the king at the foundation, carrying bricks on his head
    const kA=fin(t,tN-0.3,0.9)*(1-fin(t,tR-0.2,0.9));
    if(kA>0.01)bab_folk(cx,840+clamp(t-tN,0,6)*6,884,232,"carry",t,{a:kA,king:true,dir:1,step:(tN+clamp(t-tN,0,6))*3.4,rim});
    cx.restore();
    // what the narration names, in screen space so it reads on a phone
    eaYear(cx,80,80,"Babylon · about 620 BCE",ACA,fin(t,0.6,0.8)*(1-fin(t,tR-0.6,0.6)));
    eaYear(cx,80,80,"605 BCE · about 15 m",ACA,fin(t,w("rose","605"),0.6)*(1-fin(t,tS-0.2,0.6)));
    bab_tag(cx,960,214,"Etemenanki, the temple-tower of Marduk",fin(t,w("city","Marduk")-0.2,0.7)*(1-fin(t,c("ruin")-0.4,0.6)));
    bab_quote(cx,1040,120,780,"it had become very weak, and had been allowed to collapse","Nabopolassar, in his own words",{a:fin(t,w("ruin","In his own words")-0.2,0.8)*(1-fin(t,tH+0.6,0.7)),size:36});
    bab_tag(cx,1560,560,"Nabopolassar, the new king",fin(t,w("ruin","Nabopolassar"),0.7)*(1-fin(t,w("ruin","In his own words")-0.4,0.6)));
    bab_tag(cx,960,214,"the house of their god, broken",fin(t,w("harm","house"),0.7)*(1-fin(t,tM-0.2,0.6)));
    bab_tag(cx,960,214,"raise it, its top to rival the heavens",fin(t,w("must","raise")+0.2,0.7)*(1-fin(t,tB+0.2,0.6)));
    bab_tag(cx,960,214,"every brick made and carried by hand",fin(t,w("big","every brick"),0.7)*(1-fin(t,tP-0.2,0.6)));
    bab_tag(cx,560,214,"measured with a rod",fin(t,w("plan","rod")-0.3,0.7)*(1-fin(t,tT-0.6,0.6)));bab_tag(cx,1360,214,"ropes for its plan",fin(t,w("plan","ropes"),0.7)*(1-fin(t,tT-0.6,0.6)));
    [k0,k1,k2,k3].forEach((tk,k)=>{const a=fin(t,tk-0.3,0.6)*(1-endT);if(a>0.01)arrive(cx,140+k*440+200,240,t,tk-0.3,()=>a1_taskCard(cx,k,140+k*440,120,400,250,t),{dy:-16,a});});
    bab_tag(cx,960,214,"the king answered for the work",fin(t,w("name","answered"),0.7)*(1-fin(t,tR-0.4,0.6)));
    bab_tag(cx,960,214,"Nebuchadnezzar, his son",fin(t,w("son","Nebuchadnezzar"),0.7)*(1-fin(t,w("son","many lands")-0.2,0.6)));
    bab_tag(cx,960,214,"people from many lands",fin(t,w("son","many lands"),0.7)*(1-fin(t,w("son","stood"),0.6)));
    bab_tag(cx,960,214,"their god's house, standing again",fin(t,w("son","stood"),0.7)*(1-fin(t,tNow-0.6,0.6)));
  });
  acaTitle(ctx,S,t,B+1.0,"Agents on the map","each in a role of its own, with someone who answers","Film 1 of 6 · AI and continuous architecture");});
// the present, in the same chapter: the utility's work, many hands, some of them agents; then one agent, given a task, a role and someone
// who answers, and the same agent given a whole job
const A1_GRID=(()=>{const G=[];for(let r=0;r<3;r++)for(let k=0;k<8;k++){const ag=(r*8+k)%5===2;G.push({x:420+k*154+(r%2)*40,y:330+r*150,ag});}return G;})(),A1_ONE=12;
function a1_hands(ctx,t,sc,c,w){const tNow=c("now"),tH=c("help"),go=clamp((t-tH)/1.6,0,1),gA=1-fin(t,tH-0.2,0.8);
  A1_GRID.forEach((g,i)=>{const t0=tNow+0.4+i*0.06;if(i===A1_ONE)return;if(gA<=0.01)return;arrive(ctx,g.x,g.y,t,t0,()=>{if(g.ag)aca_agent(ctx,g.x,g.y,20,t,{});else a1_actor(ctx,g.x,g.y,26,i%3?BIZ:TECH,1);},{a:gA});});
  // the one agent: from its place among the others to the middle, larger
  const g=A1_GRID[A1_ONE],e=easeCam(go),x=lerp(g.x,960,e),y=lerp(g.y,520,e),r=lerp(20,46,e),oA=fin(t,tNow+0.4+A1_ONE*0.06,0.6);
  const whole=fin(t,w("help","whole")-0.2,0.8),tk=[["a task",620,520,KT_AI,w("help","task")],["a role",960,300,KT_AI,w("help","role")],["someone who answers",1300,520,BIZ,w("help","answers")]];
  tk.forEach(([s,tx,ty,col,t0])=>{const a=fin(t,t0-0.2,0.6)*(1-whole);if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.6);ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(tx,ty);ctx.stroke();ctx.restore();});
    arrive(ctx,tx,ty,t,t0-0.2,()=>tag(ctx,tx,ty,s,col,{align:"center",size:32}),{a});});
  const hp=fin(t,w("help","helps")-0.1,0.6)*(1-whole);if(hp>0.01)withA(ctx,hp,()=>{tick_(ctx,960,720,56,A1_OK,1);T(ctx,"it helps",960,800,{w:800,size:34,align:"center",color:rgba(A1_OK,1)});});
  // a whole job: the agent inside a box far larger than a task, and the household it serves, harmed
  if(whole>0.01){withA(ctx,whole,()=>{ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(ACA_WARN,0.9);ctx.lineWidth=3;rr(ctx,520,270,880,480,26);ctx.stroke();ctx.restore();
      T(ctx,"a whole job",560,330,{w:800,size:34,color:rgba(ACA_WARN,1)});});
    const hm=fin(t,w("help","harm")-0.2,0.7);a1_house(ctx,1560,640,1.6,mix(A1_HH,A1_RED,hm),whole);if(hm>0.01)withA(ctx,hm,()=>{kt_rcross(ctx,1630,560,26,1);T(ctx,"the people it serves",1560,770,{w:800,size:30,align:"center",color:rgba(A1_RED,1)});});}
  if(oA>0.01)aca_agent(ctx,x,y,r,t,{a:oA,busy:whole*0.8});}

/* ---------- 2. On Tomás's map ---------- */
// Tomás, faded in and out as one picture, at the left of the frame or (mirrored) at the right
function a1_tomas(ctx,x,a,t,o){o=o||{};if(a<=0.01)return;a1_fade(ctx,a,cx=>{if(o.right)a1_personR(cx,"tomas",x,1060,0.78,{t,pose:"stand",expr:o.expr||"calm"});else person(cx,"tomas",x,1060,0.78,{t,pose:"stand",expr:o.expr||"calm"});});}
const A1_NOTE="Where do agents belong on the map?";
scene("map",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tL=c("layers"),tT=c("two"),tR=c("rights"),tS=c("series"),tM=c("module");
  // the camera goes in to the layers where the agents are, and back out to the whole map
  const K=[[0,960,540,1],[tT-0.2,1340,540,1.45],[tS-0.3,960,540,1]],z=focusZ(t,K,1.8);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:480});focus(ctx,t,K,1.8);
  a1_tomas(ctx,230,fin(t,0.9,0.8),t);
  arrive(ctx,380,190,t,c("note")-0.3,()=>sticky(ctx,380,190,560,150,A1_NOTE,{col:NOTEC[0],size:36,rot:-0.02,p:fin(t,c("note"),1.6)}),{dy:-20});
  const tWh=w("layers","why"),tRu=w("layers","runs");
  a1_map(ctx,t,{p:clamp((t-w("layers","six")+0.3)/2.2,0,1),deco:z<1.3,hi:[pulseAt(t,tWh,1.8),0,0,0,0,pulseAt(t,tRu,1.8)],
    el:fin(t,tT+0.5,0.8),ag:[pulseAt(t,w("two","outage agent"),1.8),pulseAt(t,w("two","map agent"),1.8)],roles:clamp((t-tR+0.1)/1.6,0,1),
    own:[fin(t,w("rights","Grace")-0.1,0.6),fin(t,w("rights","Tomás")-0.1,0.6)],rights:pulseAt(t,w("rights","rights"),1.8),
    plat:fin(t,w("series","platform")-0.2,0.8)*(1-fin(t,tM-0.4,0.6)),here:pulseAt(t,w("module","where agents work"),2.4),who:pulseAt(t,w("module","who answers"),2.2)});
  // what the layers run from and to, inside the top and bottom layers
  const yA=fin(t,tWh-0.2,0.6)*(1-fin(t,tT-0.5,0.5)),yB=fin(t,tRu-0.2,0.6)*(1-fin(t,tT-0.5,0.5));
  if(yA>0.01)withA(ctx,yA,()=>tag(ctx,1580,a1_row(0)+42,"why it exists",LAY6[0][1],{align:"center",size:30}));
  if(yB>0.01)withA(ctx,yB,()=>tag(ctx,1580,a1_row(5)+42,"what it runs on",LAY6[5][1],{align:"center",size:30}));
  // what the two agents do, under them, while the camera is in close
  const dA=fin(t,w("two","proposes")-0.2,0.6)*(1-fin(t,tS-0.9,0.5)),dB=fin(t,w("two","drafts")-0.2,0.6)*(1-fin(t,tS-0.9,0.5));
  if(dA>0.01)withA(ctx,dA,()=>tag(ctx,1400,a1_row(5)+42,"proposes which fault matters most",KT_AI,{align:"center",size:21}));
  if(dB>0.01)withA(ctx,dB,()=>tag(ctx,1716,a1_row(5)+42,"drafts changes",KT_AI,{align:"center",size:21}));
  // what this series adds round the agents: the platform under them (in the map), AI in the architects' own work, and a map kept alive
  const sB=fin(t,w("series","architects")-0.2,0.7)*(1-fin(t,tM-0.4,0.6)),sC=fin(t,w("series","kept alive")-0.2,0.7)*(1-fin(t,tM-0.4,0.6));
  if(sB>0.01)arrive(ctx,400,470,t,w("series","architects")-0.2,()=>withA(ctx,sB,()=>{tag(ctx,400,470,"AI in the architects' own work",KT_AI,{align:"center",size:30});}),{dy:10});
  if(sC>0.01)arrive(ctx,1290,92,t,w("series","kept alive")-0.2,()=>withA(ctx,sC,()=>{tag(ctx,1290,92,"a map kept alive",LAY6[3][1],{align:"center",size:30});
    ctx.save();ctx.strokeStyle=rgba(LAY6[3][1],0.8);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.arc(1170,92,16,0.5,TAU-0.3);ctx.stroke();ctx.restore();}),{dy:-10});
  // how an agent works is another module's; here, the map: where agents work, and who answers for them
  const mA=fin(t,tM-0.1,0.7);if(mA>0.01)arrive(ctx,380,380,t,tM-0.1,()=>{a1_card(ctx,80,316,600,"the AI agents module",["how an agent works"],KT_AI,{size:34});aca_agent(ctx,620,362,18,t,{});},{dy:12});
  const hA=fin(t,w("module","where agents work")-0.2,0.6),wA=fin(t,w("module","who answers")-0.2,0.6);
  if(hA>0.01)withA(ctx,hA,()=>tag(ctx,1110,800,"where agents work",KT_AI,{align:"center",size:30}));
  if(wA>0.01)withA(ctx,wA,()=>tag(ctx,1510,800,"who answers for them",BIZ,{align:"center",size:30}));
  ctx.restore();vign(ctx,S);});

/* ---------- 3. A plan nobody saw ---------- */
// Farah, at the right, faded in as one picture; the household, the website's chat, the bill, the vendor's update; then what the chat was
// given (a whole activity), whose decision a plan is, and where its plans went: the contact centre's notes, which billing doesn't read
function a1_farah(ctx,x,a,t,o){o=o||{};if(a<=0.01)return;a1_fade(ctx,a,cx=>{if(o.left)person(cx,"farah",x,1060,0.78,{t,pose:"stand",expr:o.expr||"calm"});else a1_personR(cx,"farah",x,1060,0.78,{t,pose:"stand",expr:o.expr||"calm"});});}
const A1_INKP=[52,44,40];
scene("unseen",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tF=c("fee"),tV=c("vendor"),tW=c("whole"),tO=c("officer"),tN=c("notes"),tAg=w("vendor","agent");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  a1_farah(ctx,1760,fin(t,0.9,0.8),t,{expr:t>tF+0.6&&t<tN+4?"concerned":"calm"});
  // the household, behind on their bill; red once the warning comes
  const hA=fin(t,w("farah","household")-0.3,0.7),warn=fin(t,w("fee","warning"),0.8);
  if(hA>0.01)arrive(ctx,240,330,t,w("farah","household")-0.3,()=>{a1_house(ctx,240,300,1.5,mix(A1_HH,A1_RED,warn),1);tag(ctx,240,420,"behind on their bill",mix(A1_HH,A1_RED,warn),{align:"center",size:30});},{dy:12});
  // the chat on the utility's website: the household asks, and the chat says yes
  const tWin=w("farah","website")-0.3;
  if(t>tWin)arrive(ctx,800,360,t,tWin,()=>{a1_win(ctx,420,110,760,500,"chat on the utility's website",A1_APP);
    // the chat's mark in the window's bar: a speech bubble, until it shows what it is, an agent nobody put on the map
    const ag=fin(t,tAg-0.2,0.8);withA(ctx,1-ag,()=>{ctx.save();ctx.strokeStyle=rgba(A1_APP,0.9);ctx.lineWidth=3;rr(ctx,1112,124,40,30,8);ctx.stroke();ctx.beginPath();ctx.moveTo(1122,154);ctx.lineTo(1118,164);ctx.lineTo(1132,154);ctx.stroke();ctx.restore();});
    if(ag>0.01)aca_agent(ctx,1132,140,14,t,{a:ag,ghost:fin(t,c("whole")-0.2,0.8)});
    const q=w("farah","more time")-0.4;if(t>q)arrive(ctx,560,220,t,q,()=>a1_bubble(ctx,452,190,600,"Can we have more time to pay?",0),{dy:10});
    const y_=c("yes")-0.1;if(t>y_)arrive(ctx,960,330,t,y_,()=>a1_bubble(ctx,1148,290,560,"Yes: a plan over three months, and no late fee.",1),{dy:10});
    // so it agreed plans: plans, agreed, as the chat tells the households; amber once it's clear they weren't its to agree
    const tA=w("whole","agreed")-0.2,am=fin(t,w("officer","decision")-0.3,0.6);
    for(let i=0;i<3;i++){const t0=tA+i*0.3,x=440+i*248;if(t<t0)continue;arrive(ctx,x+116,540,t,t0,()=>{const col=mix(KT_AI,ACA_WARN,am);glass(ctx,x,512,232,56,28,col,{glow:8+10*am,ea:0.85,fill:"rgba(8,20,24,0.95)"});tick_(ctx,x+34,538,26,col,1);T(ctx,"plan agreed",x+58,550,{w:700,size:28,color:rgba(col,1)});},{dy:8});}
  },{dy:16});
  // the whole activity it was given: payment requests
  const gA=fin(t,w("whole","whole")-0.2,0.7);if(gA>0.01)a1_group(ctx,398,88,804,546,"payment requests: the whole activity",A1_BUS,{a:gA,t,hi:pulseAt(t,w("whole","payment"),1.6)});
  // the right of the frame, one thing at a time: the bill; the vendor's update; the map it isn't on; whose decision a plan is; billing
  const bA=fin(t,tF-0.1,0.6)*(1-fin(t,tV-0.6,0.5));
  if(bA>0.01){withA(ctx,bA,()=>tag(ctx,1440,120,"two weeks later",A1_HH,{align:"center",size:30}));
    arrive(ctx,1440,360,t,tF+0.2,()=>withA(ctx,bA,()=>a1_paper(ctx,1210,170,460,"Your bill",[["payment plan: none",A1_INKP,28],["late fee added",[178,48,36],30],["your power could be cut",[178,48,36],30]],{rot:0.012,stamp:true,p:clamp((t-tF-0.4)/2.6,0,1)})),{dy:20});}
  const vA=fin(t,tV+0.4,0.6)*(1-fin(t,tW-0.5,0.5));
  if(vA>0.01)arrive(ctx,1440,290,t,tV+0.4,()=>withA(ctx,vA,()=>{const h=a1_card(ctx,1210,170,460,"the vendor's update",["contact centre software","chat agent"],ACA_WARN,{size:30});
    a1_switch(ctx,1210+460-118,170+h-40,1-fin(t,w("vendor","switched"),0.6),KT_AI,1);}),{dy:14});
  const mA=fin(t,tW-0.1,0.6)*(1-fin(t,tO-0.5,0.5));
  if(mA>0.01)arrive(ctx,1440,300,t,tW-0.1,()=>withA(ctx,mA,()=>{layerStack(ctx,1262,180,330,{sh:30,gap:9,size:20,deco:true});
    aca_agent(ctx,1440,470,20,t,{ghost:1});tag(ctx,1440,540,"not on the map",ACA_WARN,{align:"center",size:30});}),{dy:12});
  const oA=fin(t,w("officer","billing officer")-0.3,0.6)*(1-fin(t,tN-0.5,0.5));
  if(oA>0.01){arrive(ctx,1440,215,t,w("officer","billing officer")-0.3,()=>withA(ctx,oA,()=>{a1_el(ctx,1210,170,460,90,"billing officer",A1_BUS,"role",{size:32});a1_owner(ctx,1252,300,"a person decides",1,{size:28});}),{dy:-12});
    const r0=w("officer","regulator's")-0.3;if(t>r0)arrive(ctx,1440,440,t,r0,()=>withA(ctx,oA,()=>ruleCard(ctx,1210,360,460,"for households who can't pay",{kicker:"the regulator's rules",col:LAY6[0][1],size:30})),{dy:12});}
  // where its plans went: the contact centre's notes, which billing doesn't read
  const nA=fin(t,tN-0.1,0.6);
  if(nA>0.01)arrive(ctx,800,760,t,tN-0.1,()=>{a1_win(ctx,420,652,760,214,"contact centre notes",A1_APP);ctx.save();ctx.beginPath();ctx.rect(420,714,760,148);ctx.clip();
    const sc_=Math.max(0,t-tN-0.6)*1.6;for(let i=0;i<5;i++){const y=752+i*50-(sc_%1)*50,e=clamp((y-722)/34,0,1)*clamp((878-y)/34,0,1);if(e>0.01)T(ctx,"plan agreed · three months · no late fee",452,y,{f:"mono",w:500,size:28,color:rgba(mix(A1_APP,INK,0.4),0.92*e)});}ctx.restore();},{dy:16});
  const blA=fin(t,w("notes","billing")-0.3,0.6);
  if(blA>0.01){arrive(ctx,1440,215,t,w("notes","billing")-0.3,()=>a1_el(ctx,1210,170,460,90,"billing",A1_APP,"component",{size:32}),{dy:-12});
    withA(ctx,blA,()=>{ctx.save();ctx.setLineDash([10,9]);ctx.lineDashOffset=-t*10;ctx.strokeStyle=rgba(A1_APP,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1180,700);ctx.quadraticCurveTo(1380,620,1440,262);ctx.stroke();ctx.restore();
      kt_rcross(ctx,1362,520,24,fin(t,w("notes","doesn't")-0.1,0.5));});
    withA(ctx,fin(t,w("notes","doesn't")-0.1,0.5),()=>tag(ctx,1440,326,"billing doesn't read them",A1_RED,{align:"center",size:28}));}
  const tC=w("notes","two hundred")-0.2,cA=fin(t,tC,0.5);
  if(cA>0.01)withA(ctx,cA,()=>{const n=Math.round(212*ease(clamp((t-tC)/3.2,0,1)));T(ctx,String(n),1440,770,{w:800,size:96,align:"center",color:rgba(ACA_WARN,1)});
    withA(ctx,fin(t,w("notes","six weeks")-0.2,0.5),()=>T(ctx,"plans in six weeks",1440,832,{w:700,size:30,align:"center",color:rgba(INK,0.95)}));});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. How many agents? ---------- */
// what the IT service management tool lists: applications, not what's switched on inside them
const A1_ITSM=["billing","contact centre","outage system","field app","meter data","network planning"];
// where agents leave traces
const A1_TRACE=[["vendors' release notes and contracts","notes"],["logs of calls to language models","logs"],["each team's answer","each team's"]];
// what Tomás finds: [name, what it does, on the map (1), not on it (0) or a helper (2)]
const A1_FOUND=[["outage agent","proposes which fault matters most",1],["map agent","drafts changes to the map",1],["website chat","agreed 212 payment plans",0],
  ["crew planner","built by the network's analysts",0],["meter agent","drafts a work order when a meter goes quiet",0],["field assistant","answers crews' questions from the manuals",0],
  ["billing assistant","works on each officer's sign-in, with their rights",2]];
function a1_found(ctx,x,y,w,h,f,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[nm,ds,k]=f,col=k===1?KT_AI:k===2?BIZ:ACA_WARN;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,k===1?KT_AI:[120,130,150],{glow:k===1?12:4,ea:k===1?0.8:0.3,fill:"rgba(7,11,22,0.95)"});
    if(k===0){ctx.save();ctx.setLineDash([10,9]);ctx.lineDashOffset=-t*8;ctx.strokeStyle=rgba(ACA_WARN,0.7);ctx.lineWidth=2.2;rr(ctx,x,y,w,h,18);ctx.stroke();ctx.restore();}
    if(k===2){a1_who(ctx,x+50,y+56,22,BIZ,1);aca_agent(ctx,x+80,y+38,9,t,{});}else aca_agent(ctx,x+52,y+56,16,t,{ghost:k===0?1:0});
    T(ctx,nm,x+96,y+66,{w:800,size:30,color:rgba(INK,0.97)});
    wrapT(ctx,ds,x+28,y+124,w-56,{size:28,w:600,lh:34,color:rgba(INK,0.85)});
    const st=k===1?"on the map":k===2?"a helper, not an agent":"not on the map";T(ctx,st,x+28,y+h-24,{w:800,size:28,color:rgba(col,1)});});}
scene("find",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tA=c("ask"),tL=c("look"),tF=c("four"),tFi=c("field"),tH=c("helper"),tS=c("seven");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  a1_tomas(ctx,1760,fin(t,0.9,0.8),t,{right:true,expr:t>w("ask","can't")&&t<tF?"concerned":"calm"});
  arrive(ctx,440,150,t,tA-0.1,()=>sticky(ctx,440,150,620,124,"How many agents work here?",{col:NOTEC[0],size:38,rot:0.015,p:fin(t,tA,1.4)}),{dy:-20});
  // the tool that lists the applications, and can't say what's switched on inside them
  const iA=fin(t,w("ask","IT service")-0.3,0.6)*(1-fin(t,tF-0.6,0.5)),q=fin(t,w("ask","switched")-0.2,0.6);
  if(iA>0.01)arrive(ctx,540,520,t,w("ask","IT service")-0.3,()=>withA(ctx,iA,()=>{a1_win(ctx,120,250,840,560,"IT service management",[170,190,220]);
    A1_ITSM.forEach((nm,i)=>{const y=346+i*76;archGlyph(ctx,"component",172,y-10,14,A1_APP);T(ctx,nm,214,y,{w:700,size:32});T(ctx,"application",660,y,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});
      if(q>0.01)withA(ctx,clamp(q*2-i*0.15,0,1),()=>{glass(ctx,882,y-32,44,44,22,ACA_WARN,{glow:8,ea:0.9,fill:"rgba(30,20,8,0.95)"});T(ctx,"?",904,y+1,{w:800,size:30,align:"center",color:rgba(ACA_WARN,1)});});});}),{dy:16});
  // where agents leave traces
  A1_TRACE.forEach(([s_,k],i)=>{const t0=w("look",k)-0.3,a=fin(t,t0,0.6)*(1-fin(t,tF-0.6,0.5));if(a<=0.01)return;
    arrive(ctx,1300,320+i*170,t,t0,()=>withA(ctx,a,()=>{glass(ctx,1010,250+i*170,580,140,18,LAY6[3][1],{glow:10+14*pulseAt(t,t0+0.3,1.4),ea:0.75,fill:"rgba(16,10,8,0.95)"});
      const gx=1066,gy=320+i*170;ctx.save();ctx.strokeStyle=rgba(LAY6[3][1],0.95);ctx.fillStyle=rgba(LAY6[3][1],0.95);ctx.lineWidth=2.6;
      if(i===0){ctx.strokeRect(gx-18,gy-24,36,48);[-10,0,10].forEach(d=>{ctx.beginPath();ctx.moveTo(gx-10,gy+d);ctx.lineTo(gx+10,gy+d);ctx.stroke();});}
      else if(i===1){[-16,-4,8,20].forEach((d,j)=>ctx.fillRect(gx-20,gy+d-3,[30,40,22,34][j],5));}
      else{rr(ctx,gx-22,gy-20,44,32,10);ctx.stroke();ctx.beginPath();ctx.moveTo(gx-8,gy+12);ctx.lineTo(gx-14,gy+24);ctx.lineTo(gx+2,gy+12);ctx.stroke();}ctx.restore();
      wrapT(ctx,s_,1116,320+i*170+(wrapT(ctx,s_,0,0,446,{size:30,w:700,measure:true}).length>1?-8:10),446,{size:30,w:700,lh:36});}),{dy:12});});
  // what he finds: the two on the map, the chat, and the rest; then the tally
  A1_FOUND.forEach((f,i)=>{const t0=i<3?tF-0.1+i*0.25:i===3?w("four","crew planner")-0.2:i===4?w("four","meter agent")-0.2:i===5?tFi-0.1:w("helper","assistant")-0.2;if(t<t0)return;
    const col=i%4,row=Math.floor(i/4),x=100+col*380,y=246+row*284;arrive(ctx,x+180,y+130,t,t0,()=>a1_found(ctx,x,y,360,264,f,t),{dy:14});});
  if(t>tS-0.1)arrive(ctx,1420,662,t,tS-0.1,()=>{glass(ctx,1240,530,360,264,18,KT_AI,{glow:16,ea:0.9,fill:"rgba(6,14,20,0.96)"});
    T(ctx,"the map showed 2",1420,600,{w:700,size:30,align:"center",color:rgba(SOFT,1)});T(ctx,"6 agents",1420,690,{w:800,size:56,align:"center",color:rgba(KT_AI,1)});T(ctx,"and a helper",1420,748,{w:700,size:32,align:"center"});},{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Software in a role ---------- */
// the chat, drawn as ArchiMate 4 draws software that works beside people: an application, assigned to a role of its own. Not a billing
// officer's: in that role it would hold all an officer's rights, and its work would look like theirs. Then the tasks it covers, which
// are never the whole activity: the activity and its decision stay with people (the process, as the next chapter shows it)
scene("role",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tD=c("drawn"),tO=c("own"),tW=c("why"),tT=c("tasks"),out=1-fin(t,tT-0.6,0.5);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  if(out>0.01){withA(ctx,out,()=>{
    eaYear(ctx,90,130,"ArchiMate 4",SOFT,fin(t,w("drawn","ArchiMate")-0.2,0.6));
    const tApp=w("drawn","an application")-0.3,tRo=w("drawn","assigned")-0.2;
    if(t>tApp)arrive(ctx,520,675,t,tApp,()=>{a1_el(ctx,300,620,440,110,"website chat",A1_APP,"component",{size:34,agent:true,t,gs:20});tag(ctx,520,780,"an application",A1_APP,{align:"center",size:30});},{dy:14});
    a1_assign(ctx,520,620,520,412,KT_AI,ease(clamp((t-tRo)/0.9,0,1)),fin(t,tRo,0.3),{lw:3.5});
    if(t>tRo+0.4)arrive(ctx,520,355,t,tRo+0.4,()=>{a1_el(ctx,300,300,440,110,"billing chat",A1_BUS,"role",{size:34,gs:20,hi:pulseAt(t,w("own","own"),1.6)});tag(ctx,520,250,"a role",A1_BUS,{align:"center",size:30});},{dy:-14});
    // a role of its own, never a person's
    const oA=fin(t,w("own","own")-0.2,0.6);if(oA>0.01)withA(ctx,oA,()=>{tick_(ctx,790,352,38,A1_OK,1);T(ctx,"its own",822,366,{w:800,size:30,color:rgba(A1_OK,1)});});
    const pA=fin(t,w("own","person's")-0.3,0.6);if(pA>0.01){arrive(ctx,1320,355,t,w("own","person's")-0.3,()=>{a1_el(ctx,1100,300,440,110,"billing officer",A1_BUS,"role",{size:34,gs:20});a1_who(ctx,1320,232,28,BIZ,1);},{dy:-14});
      withA(ctx,pA,()=>{ctx.save();ctx.setLineDash([10,9]);ctx.strokeStyle=rgba(KT_AI,0.6);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(740,660);ctx.quadraticCurveTo(960,640,1094,372);ctx.stroke();ctx.restore();kt_rcross(ctx,962,560,24,fin(t,w("own","never")-0.1,0.5));});}
    // why: in an officer's role it would hold all their rights, and its work would look like theirs
    const rA=fin(t,tW-0.1,0.6);if(rA>0.01){const lit=fin(t,w("why","every right")-0.2,0.8);
      arrive(ctx,1320,520,t,tW-0.1,()=>{glass(ctx,1100,440,440,190,18,mix(A1_BUS,ACA_WARN,lit),{glow:10+14*lit,ea:0.85,fill:"rgba(16,14,6,0.96)"});T(ctx,"an officer's rights",1128,484,{f:"mono",w:500,size:28,color:rgba(mix(A1_BUS,ACA_WARN,lit),1)});
        ["agree a plan","waive a late fee","change a bill"].forEach((r_,i)=>withA(ctx,clamp(lit*3-i,0,1)*0.6+0.4,()=>T(ctx,r_,1128,532+i*38,{w:700,size:30,color:rgba(mix(INK,ACA_WARN,lit*0.5),1)})));},{dy:12});
      const lA=fin(t,w("why","no one")-0.3,0.6);if(lA>0.01)arrive(ctx,1320,750,t,w("why","no one")-0.3,()=>{glass(ctx,1100,660,440,170,18,[170,190,220],{glow:8,ea:0.6,fill:"rgba(10,14,24,0.96)"});T(ctx,"the log",1128,702,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});
        ["officer · plan agreed","officer · plan agreed"].forEach((l,i)=>{T(ctx,l,1128,748+i*40,{w:700,size:30});glass(ctx,1470,722+i*40,40,36,18,ACA_WARN,{glow:6,ea:0.9,fill:"rgba(30,20,8,0.95)"});T(ctx,"?",1490,749+i*40,{w:800,size:28,align:"center",color:rgba(ACA_WARN,1)});});},{dy:12});}});}
  // the tasks it covers, never the whole activity: the activity and the decision in it stay with the people who own them
  if(t>tT-0.2)arrive(ctx,960,380,t,tT-0.2,()=>a1_proc(ctx,t,{cover:fin(t,w("tasks","covers")-0.1,0.7),keep:fin(t,w("tasks","activity:")-0.1,0.8),own:fin(t,w("tasks","people")-0.1,0.6)}),{dy:12,from:0.94});
  const kA=fin(t,w("tasks","decisions")-0.2,0.6);if(kA>0.01)withA(ctx,kA,()=>tag(ctx,A1_PX(4)+A1_PW/2,500,"a person decides",BIZ,{align:"center",size:30}));
  const cA=fin(t,w("tasks","covers")-0.2,0.6);if(cA>0.01)withA(ctx,cA,()=>tag(ctx,(A1_PX(0)+A1_PX(3)+A1_PW)/2,500,"the tasks its role covers",KT_AI,{align:"center",size:30}));
  ctx.restore();vign(ctx,S);});

/* ---------- 6. How far, task by task ---------- */
// the same process, written down, with its owner: for each task, how far the agent may go, in the order the narration takes them
const A1_FAR=[[0,3,"run"],[1,1,"draft"],[2,0,"inform"],[4,-1,"none"],[3,2,"verify"]];
scene("far",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tL=c("levels"),tSt=c("stages");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  // as the chapter before left it, then its teal and gold let go, and the step each task is given comes under it
  const hi=[0,0,0,0,0];A1_FAR.forEach(([i,k,id])=>{hi[i]=pulseAt(t,c(id)-0.1,2.2)*0.8;});
  a1_proc(ctx,t,{cover:1-fin(t,1.0,0.8),keep:1-fin(t,1.0,0.8),own:Math.max(1-fin(t,1.0,0.8),fin(t,w("process","owner")-0.2,0.6)),hi});
  const wd=fin(t,w("process","written")-0.2,0.6);if(wd>0.01)withA(ctx,wd,()=>{ctx.save();ctx.translate(1404,238);ctx.rotate(-0.06);ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=8;ctx.fillStyle="rgba(238,232,218,0.97)";ctx.fillRect(-16,-22,32,40);ctx.shadowBlur=0;ctx.fillStyle="rgba(80,70,60,0.6)";[-12,-4,4].forEach(yy=>ctx.fillRect(-10,yy,20,3));ctx.restore();});
  // how far the agent may go, set by the task's owner: four steps, like the tower's tiers
  const sp=clamp((t-w("levels","inform")+0.6)/2.4,0,1),sA=fin(t,w("levels","how far")-0.4,0.6);
  let on=-1;A1_FAR.forEach(([i,k,id])=>{if(t>c(id)-0.1)on=k;});["inform","draft","verify","run"].forEach((s_,k)=>{if(t>w("levels",s_)-0.1&&t<c("run")-0.1)on=k;});
  if(sA>0.01){aca_steps(ctx,660,846,600,{a:sA,p:sp,on,sh:50,size:30,hi:1});withA(ctx,sA,()=>tag(ctx,380,800,"how far it may go",KT_AI,{align:"center",size:30}));}
  // each task's step, under it, as the narration gives it
  A1_FAR.forEach(([i,k,id])=>{const t0=c(id)+0.2;if(t<t0)return;arrive(ctx,A1_PX(i)+A1_PW/2,500,t,t0,()=>aca_stepPill(ctx,A1_PX(i)+A1_PW/2,500,k,{size:30,align:"center",none:"a person",hi:pulseAt(t,t0,1.6)}),{dy:-10});});
  // what draft and none mean here: it writes for an officer; agreeing stays with them
  const dA=fin(t,w("draft","writes")-0.2,0.6)*(1-fin(t,c("inform")-0.4,0.5));if(dA>0.01)withA(ctx,dA,()=>tag(ctx,A1_PX(1)+A1_PW/2,150,"it writes the request for an officer",KT_AI,{align:"center",size:28}));
  const nA=fin(t,w("none","stays")-0.2,0.6)*(1-fin(t,c("verify")-0.4,0.5));if(nA>0.01)withA(ctx,nA,()=>tag(ctx,A1_PX(4)+A1_PW/2-60,150,"stays with the officer",BIZ,{align:"center",size:28}));
  const vA=fin(t,w("verify","checks")-0.2,0.6)*(1-fin(t,tSt-0.4,0.5));if(vA>0.01)withA(ctx,vA,()=>tag(ctx,A1_PX(3)+A1_PW/2-40,150,"it checks; the officer decides",KT_AI,{align:"center",size:28}));
  // how an agent earns more: the AI agents module's five stages, not a switch
  const gA=fin(t,tSt-0.1,0.6);if(gA>0.01)arrive(ctx,1560,720,t,tSt-0.1,()=>{const h=a1_card(ctx,1330,640,460,"the AI agents module",["Five stages"],KT_AI,{size:34});
    for(let i=0;i<5;i++){const bh=14+i*9;ctx.fillStyle=rgba(KT_AI,0.85);ctx.fillRect(1600+i*30,640+h-26-bh,20,bh);}
    const xA=fin(t,w("stages","not a switch")-0.1,0.5);if(xA>0.01)withA(ctx,xA,()=>{a1_switch(ctx,1350,640+h+46,0,KT_AI,1);kt_rcross(ctx,1392,640+h+46,20,1);T(ctx,"not a switch",1460,640+h+56,{w:800,size:30,color:rgba(A1_RED,1)});});},{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Its own name, and a hand-off ---------- */
// the chat, under identities of its own, one for each set of rights, never an officer's sign-in; a log that says which agent did what,
// and a switch that stops it alone; then its role's hand-off: who it hands over to, and when, and what it tells the household
function a1_key(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.arc(x-s*0.45,y,s*0.36,0,TAU);ctx.moveTo(x-s*0.09,y);ctx.lineTo(x+s*0.8,y);ctx.moveTo(x+s*0.5,y);ctx.lineTo(x+s*0.5,y+s*0.3);ctx.moveTo(x+s*0.75,y);ctx.lineTo(x+s*0.75,y+s*0.26);ctx.stroke();ctx.restore();}
scene("name",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tI=c("identity"),tP=c("pair"),tL=c("logs"),tH=c("hands"),tPe=c("person"),out=1-fin(t,tH-0.5,0.5),stop=fin(t,w("logs","stopped"),0.6)*out;
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  // the chat, as an agent: its own name under it
  const gA=fin(t,0.9,0.8);if(gA>0.01){aca_agent(ctx,330,390,64,t,{a:gA*(1-0.55*stop),busy:0.4*(1-stop)});withA(ctx,gA,()=>T(ctx,"website chat",330,566,{w:800,size:32,align:"center",color:rgba(KT_AI,1)}));}
  if(out>0.01)withA(ctx,out,()=>{
    // its identities: one for each set of rights it needs
    const B=[[w("identity","own identity")-0.2,190,"identity 1",["may read bills"],w("pair","read bills")],[w("identity","one for each")-0.2,346,"identity 2",["may only write requests into billing's queue"],w("pair","only write")]];
    B.forEach(([t0,y,k,ls,tp],i)=>{if(t<t0)return;const q=fin(t,t0,0.6);withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,0.45);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(404,390);ctx.lineTo(640,y+60);ctx.stroke();ctx.restore();});
      arrive(ctx,940,y+70,t,t0,()=>{a1_card(ctx,640,y,600,k,ls,KT_AI,{size:30,hi:pulseAt(t,tp-0.1,1.6),minH:132});a1_key(ctx,1190,y+44,40,KT_AI);},{dy:10});});
    // never a person's: an officer's sign-in, crossed out
    const nA=fin(t,w("identity","never")-0.2,0.6);if(nA>0.01)arrive(ctx,1530,256,t,w("identity","never")-0.2,()=>{withA(ctx,0.75,()=>a1_card(ctx,1300,190,460,"an officer's sign-in",["a person's identity"],BIZ,{size:30,minH:132}));kt_rcross(ctx,1736,214,22,1);},{dy:10});
    // the log says which agent did what; and it can be stopped on its own
    if(t>tL-0.2)arrive(ctx,1160,700,t,tL-0.2,()=>{a1_win(ctx,640,580,1040,250,"the log",[170,190,220]);
      [["09:12","website chat, identity 1: read a bill",1],["09:13","website chat, identity 2: wrote a request",1],["09:20","billing officer: agreed a plan",0]].forEach(([tm,l,ag],i)=>{const q=fin(t,tL+0.2+i*0.35,0.4);if(q<=0.01)return;
        withA(ctx,q*(ag?1-0.6*stop:1),()=>{T(ctx,tm,670,680+i*48,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});T(ctx,l,790,680+i*48,{w:700,size:30,color:rgba(ag?mix(INK,KT_AI,0.4):mix(INK,BIZ,0.5),1)});});});
      const sw=fin(t,w("logs","stopped")-0.4,0.5);if(sw>0.01)withA(ctx,sw,()=>{T(ctx,"stop the chat",1460,621,{w:700,size:28,align:"right",color:rgba(SOFT,1)});a1_switch(ctx,1480,610,stop,KT_AI,1);});},{dy:14});});
  // its role says when it hands over, and to whom
  if(t>tH-0.2)arrive(ctx,920,250,t,tH-0.2,()=>a1_el(ctx,640,200,560,100,"billing chat",A1_BUS,"role",{size:34,gs:18}),{dy:-12});
  if(t>tH+0.4)arrive(ctx,1160,420,t,tH+0.4,()=>{glass(ctx,640,340,1060,176,18,BIZ,{glow:12,ea:0.85,fill:"rgba(16,12,6,0.96)"});T(ctx,"hand-off",668,386,{f:"mono",w:500,size:28,color:rgba(BIZ,1)});
    const ws=[["hardship",w("person","hardship")],["illness",w("person","illness")],["life support",w("person","life support")]];let x=668;
    ws.forEach(([s_,t0],i)=>{const q=fin(t,t0-0.1,0.4);withA(ctx,0.35+0.65*q,()=>{T(ctx,s_,x,454,{w:800,size:32,color:rgba(mix(INK,ACA_WARN,q*0.6),1)});});x+=tw(ctx,s_,32,800)+(i<2?18:0);if(i<2){T(ctx,"·",x,454,{w:800,size:32,color:rgba(SOFT,0.8)});x+=26;}});
    const pq=fin(t,w("person","a person")-0.2,0.5);if(pq>0.01){arrowTo(ctx,x+24,444,x+110,444,BIZ,pq,{p:pq,lw:3,head:12});withA(ctx,pq,()=>{a1_who(ctx,x+150,446,24,BIZ,1);T(ctx,"a person,",x+186,436,{w:800,size:32,color:rgba(BIZ,1)});});
      withA(ctx,fin(t,w("person","same day")-0.2,0.5),()=>T(ctx,"the same day",x+186,476,{w:800,size:32,color:rgba(BIZ,1)}));}},{dy:12});
  // and the agent says so
  const sA=w("person","says so")-0.3;if(t>sA)arrive(ctx,470,690,t,sA,()=>a1_bubble(ctx,760,650,700,"I'm passing you to a person, today.",1,{tailLeft:true,up:true}),{dy:10});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. Someone who answers ---------- */
// Farah's question; not the vendor, not Tomás, but the head of retail, who owns the process; what AI frameworks ask; and it never approves
const A1_WHO=[["the vendor",["answers to the utility, under its contract"],SOFT,"Not the vendor"],["Tomás",["draws the map"],TECH,"Not Tomás"],["the head of retail",["owns the process, and set its tasks"],BIZ,"head of retail"]];
scene("answers",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tW=c("who"),tN=c("not"),tO=c("owner"),tF=c("frames"),tA=c("approve");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  a1_farah(ctx,230,fin(t,0.9,0.8),t,{left:true,expr:t<tO+1?"concerned":"calm"});
  arrive(ctx,1010,150,t,tW-0.1,()=>sticky(ctx,1010,150,900,128,"When the agent is wrong, who answers for it?",{col:NOTEC[1],size:38,rot:-0.012,p:fin(t,w("who","when"),1.8)}),{dy:-20});
  A1_WHO.forEach(([k,ls,col,wd],i)=>{const sid=i<2?"not":"owner",t0=w(sid,wd)-0.3;if(t<t0)return;const x=520+i*440;
    arrive(ctx,x+200,375,t,t0,()=>{withA(ctx,i<2?1-0.45*fin(t,t0+0.8,0.6):1,()=>a1_card(ctx,x,290,400,k,ls,col,{size:30,minH:170,hi:i===2?fin(t,w("owner","answers")-0.2,0.8):0}));
      if(i<2)kt_rcross(ctx,x+372,320,20,fin(t,t0+0.5,0.4));else kt_gtick(ctx,x+372,320,20,fin(t,t0+0.5,0.4));},{dy:12});});
  const aA=fin(t,w("owner","answers")-0.2,0.6);if(aA>0.01)withA(ctx,aA,()=>tag(ctx,1600,512,"answers for it",BIZ,{align:"center",size:32}));
  // AI frameworks ask the same: clear roles, and people accountable for each AI system
  [["NIST AI RMF",w("frames","NIST's")],["ISO/IEC 42001",w("frames","ISO's")]].forEach(([s_,t0],i)=>{if(t<t0-0.2)return;arrive(ctx,860+i*400,630,t,t0-0.2,()=>tag(ctx,860+i*400,630,s_,[170,205,255],{align:"center",size:32}),{dy:10});});
  const nA=fin(t,w("frames","clear")-0.2,0.6);if(nA>0.01)withA(ctx,nA,()=>T(ctx,"clear roles, and people accountable for each AI system",1060,712,{w:760,size:32,align:"center"}));
  // and it never approves: approving is a person's job
  const pA=fin(t,tA-0.1,0.6);if(pA>0.01)arrive(ctx,1060,800,t,tA-0.1,()=>{aca_agent(ctx,640,800,20,t,{});kt_rcross(ctx,690,780,16,1);tag(ctx,700,800,"never approves",A1_RED,{size:30});},{dy:10});
  const qA=fin(t,w("approve","person's")-0.2,0.6);if(qA>0.01)arrive(ctx,1380,800,t,w("approve","person's")-0.2,()=>{kt_gtick(ctx,1180,800,18,1);tag(ctx,1214,800,"approving is a person's job",BIZ,{size:30});},{dy:10});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. Every agent on the map ---------- */
// the register on the map: each agent, its role, how far it may go, its identity, its hand-off and who answers for it
const A1_REG=[["website chat","billing chat",1,1,"head of retail"],["outage agent","fault triage",1,1,"Grace"],["crew planner","crew rostering",1,1,"Grace"],
  ["meter agent","meter follow-up",1,1,"Grace"],["field assistant","crew questions",3,0,"Grace"],["map agent","map drafting",1,1,"Tomás"]];
const A1_COLS=[["agent",130,""],["role",510,"its role"],["how far",820,"how far"],["identity",1110,"identity"],["hand-off",1300,"hand-off"],["who answers",1490,"who answers"]],A1_RY=i=>272+i*74;
scene("all",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tE=c("each"),tC=c("crew"),tO=c("off"),tK=c("check"),tF=c("flag"),tP=c("plans"),dim=fin(t,tP-0.6,0.6),tSc=w("check","check runs")-0.2;
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  withA(ctx,1-0.9*dim,()=>{
    if(t>0.9)arrive(ctx,960,420,t,0.9,()=>{glass(ctx,90,140,1740,560,20,[170,190,220],{glow:10,ea:0.5,fill:"rgba(8,12,22,0.95)"});
      A1_COLS.forEach(([h_,x,wd],k)=>{const hi=wd?pulseAt(t,w("each",wd)-0.1,1.6):0;T(ctx,h_,x,198,{f:"mono",w:500,size:28,color:rgba(mix(SOFT,INK,hi),1)});if(hi>0.01)withA(ctx,hi,()=>{ctx.fillStyle=rgba(KT_AI,0.9);ctx.fillRect(x,212,tw(ctx,h_,28,500,"mono"),3);});});
      ctx.fillStyle="rgba(170,190,220,0.25)";ctx.fillRect(110,226,1700,2);},{dy:12,from:0.96});
    A1_REG.forEach(([nm,rl,k,id,who],i)=>{const t0=tE+0.4+i*0.5;if(t<t0)return;const y=A1_RY(i),hiC=i===2?fin(t,tC-0.2,0.5)*(1-fin(t,tO-0.3,0.5)):0,hiF=i===4?fin(t,tF-0.2,0.5):0;
      arrive(ctx,960,y,t,t0,()=>{if(hiC+hiF>0.01){ctx.save();ctx.fillStyle=rgba(hiF>0.01?ACA_WARN:KT_AI,0.1*(hiC+hiF));rr(ctx,104,y-34,1712,66,12);ctx.fill();ctx.restore();}
        aca_agent(ctx,150,y-10,13,t,{});T(ctx,nm,180,y,{w:800,size:30});T(ctx,rl,510,y,{w:700,size:30,color:rgba(mix(A1_BUS,INK,0.3),1)});
        // how far: the chat's vendor setting let it run; switched off, it drafts
        if(i===0){const sw=fin(t,w("off","drafts")-0.2,0.6);withA(ctx,1-sw,()=>{aca_stepPill(ctx,820,y-10,3,{size:28});ctx.save();ctx.strokeStyle=rgba(ACA_WARN,0.9);ctx.lineWidth=2.5;rr(ctx,814,y-38,152,56,28);ctx.stroke();ctx.restore();});withA(ctx,sw,()=>aca_stepPill(ctx,820,y-10,1,{size:28,hi:pulseAt(t,w("off","drafts"),1.4)}));}
        else aca_stepPill(ctx,820,y-10,k,{size:28});
        if(id)tick_(ctx,1162,y-10,32,A1_OK,1);else{glass(ctx,1140,y-32,44,44,22,ACA_WARN,{glow:8,ea:0.9,fill:"rgba(30,20,8,0.95)"});T(ctx,"?",1162,y,{w:800,size:30,align:"center",color:rgba(ACA_WARN,1)});}
        tick_(ctx,1352,y-10,32,A1_OK,1);kt_gtick(ctx,1504,y-10,14,1);T(ctx,who,1528,y,{w:800,size:30,color:rgba(BIZ,1)});},{dy:10});
      // the check on the map: a tick for each agent that has all four, a flag for the one that doesn't
      const ck=fin(t,tSc+0.4+i*0.35,0.4);if(ck>0.01){if(id)withA(ctx,ck,()=>tick_(ctx,1790,y-10,30,A1_OK,1));else kt_flag(ctx,1786,y-10,0.9,ck);}});
    // the check, sweeping down the register
    const sc_=clamp((t-tSc)/2.6,0,1);if(sc_>0&&sc_<1)withA(ctx,Math.sin(Math.PI*sc_),()=>{const y=A1_RY(0)-40+sc_*(A1_RY(5)-A1_RY(0)+60);ctx.save();ctx.fillStyle=rgba(A1_OK,0.12);ctx.fillRect(104,y-14,1712,28);ctx.fillStyle=rgba(A1_OK,0.8);ctx.fillRect(104,y,1712,2);ctx.restore();});
    // under the register, one at a time: the crew planner's chain; the vendor's setting; the check; the flag
    const cA=fin(t,tC+0.2,0.5)*(1-fin(t,tO-0.4,0.5));if(cA>0.01)withA(ctx,cA,()=>{const ch=[["drafts rosters",KT_AI,w("crew","drafts")],["a supervisor approves",BIZ,w("crew","supervisor")],["Grace answers",BIZ,w("crew","Grace")]];let x=330;
      ch.forEach(([s_,col,t0],j)=>{const q=fin(t,t0-0.2,0.5),ww=tw(ctx,s_,30,700)+26;withA(ctx,q,()=>tag(ctx,x,790,s_,col,{size:30}));if(j<2)arrowTo(ctx,x+ww+14,790,x+ww+70,790,SOFT,q,{p:q,lw:3,head:12});x+=ww+90;});});
    const oA=fin(t,tO-0.1,0.5)*(1-fin(t,tK-0.4,0.5));if(oA>0.01)withA(ctx,oA,()=>{T(ctx,"the vendor's setting: agree payment plans",960,800,{w:700,size:30,align:"right"});a1_switch(ctx,1000,790,fin(t,w("off","switched off")-0.1,0.6),KT_AI,1);T(ctx,"off",1110,800,{w:800,size:30,color:rgba(SOFT,fin(t,w("off","switched off"),0.5))});});
    const kA=fin(t,tK-0.1,0.5)*(1-fin(t,tF-0.4,0.5));if(kA>0.01)withA(ctx,kA,()=>tag(ctx,960,790,"with every change: no agent without a role, an identity, a hand-off and a person who answers",A1_OK,{align:"center",size:28}));
    const fA=fin(t,tF-0.1,0.5)*(1-fin(t,tP-0.4,0.5));if(fA>0.01)withA(ctx,fA,()=>tag(ctx,960,790,"flagged: its vendor hasn't said which identity it uses",ACA_WARN,{align:"center",size:30}));});
  // the 212 plans: honoured, fees refunded, each household called
  if(dim>0.01)arrive(ctx,960,470,t,tP-0.1,()=>{glass(ctx,520,200,880,520,22,A1_HH,{glow:16,ea:0.8,fill:"rgba(22,16,10,0.97)"});T(ctx,"the 212 plans",960,282,{w:800,size:52,align:"center",color:rgba(A1_HH,1)});
    [["billing honours every one",w("plans","honours")],["late fees refunded",w("plans","refunds")],["each household called",w("plans","calls")]].forEach(([s_,t0],j)=>{const q=fin(t,t0-0.2,0.5);withA(ctx,q,()=>{tick_(ctx,640,352+j*64,34,A1_OK,1);T(ctx,s_,690,364+j*64,{w:700,size:34});});});
    const hc=fin(t,w("plans","calls")-0.1,1.6);for(let k=0;k<9;k++){const q=clamp(hc*9-k,0,1);a1_house(ctx,640+k*80,630,0.62,mix(A1_HH,A1_OK,q*0.5),0.5+0.5*q);}},{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 10. Many languages, one plan ---------- */
// Babylon's tower, and the story it may have inspired: the Tower of Babel, in the Book of Genesis, as a page; in the story, one language,
// then none they share, and the building stops. Babylon's real builders spoke many languages; what they shared was the plan.
const A1_INK=[58,40,28],A1_PARCH=[233,220,192];
// a speech mark: a bubble with a glyph in it; k picks the glyph, so different languages look different (no real script is imitated)
function a1_speech(ctx,x,y,s,k,col,a,k2,m){if(a<=0.01)return;m=k2==null?0:clamp(m||0,0,1);withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=rgba(mix(col,[255,255,255],0.75),0.92);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4;
  rr(ctx,-24,-18,48,34,12);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(-6,16);ctx.lineTo(-12,26);ctx.lineTo(4,16);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle=rgba(mix(col,[0,0,0],0.4),1);ctx.lineWidth=2.6;ctx.lineCap="round";
  if(m<0.999)withA(ctx,1-m,()=>a1_glyph(ctx,k));if(m>0.001)withA(ctx,m,()=>a1_glyph(ctx,k2));ctx.restore();});}
function a1_glyph(ctx,k){ctx.beginPath();
  if(k===0){ctx.moveTo(-14,-1);ctx.bezierCurveTo(-8,-9,-4,7,2,-1);ctx.bezierCurveTo(7,-8,10,5,15,-1);}
  else if(k===1){[-10,0,10].forEach(dx=>{ctx.moveTo(dx+3,-1);ctx.arc(dx,-1,3,0,TAU);});}
  else if(k===2){ctx.moveTo(-14,6);ctx.lineTo(-7,-8);ctx.lineTo(0,6);ctx.lineTo(7,-8);ctx.lineTo(14,6);}
  else if(k===3){ctx.rect(-13,-8,10,12);ctx.rect(3,-8,10,12);}
  else if(k===4){ctx.moveTo(-12,-8);ctx.lineTo(12,6);ctx.moveTo(12,-8);ctx.lineTo(-12,6);ctx.moveTo(0,-10);ctx.lineTo(0,8);}
  else{ctx.moveTo(-14,4);ctx.quadraticCurveTo(-7,-12,0,4);ctx.quadraticCurveTo(7,-12,14,4);}
  ctx.stroke();}
// the story's tower, in ink on a page: tiers, an unfinished top with its scaffold, and its builders; talk (0..1) gives them one language,
// split (0..1) many, and stop (0..1) stops the work
function a1_babelPage(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=26;ctx.shadowOffsetY=10;ctx.fillStyle=rgba(A1_PARCH,1);ctx.beginPath();ctx.moveTo(x+6,y);ctx.lineTo(x+w-4,y+4);ctx.lineTo(x+w,y+h-6);ctx.lineTo(x+2,y+h);ctx.closePath();ctx.fill();ctx.restore();
  const g=ctx.createRadialGradient(x+w/2,y+h/2,h*0.2,x+w/2,y+h/2,h*0.8);g.addColorStop(0,"rgba(255,250,235,0.2)");g.addColorStop(1,"rgba(120,90,50,0.22)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  T(ctx,"the Tower of Babel",x+w/2,y+62,{w:800,size:40,align:"center",color:rgba(A1_INK,0.95)});T(ctx,"a story in the Book of Genesis",x+w/2,y+106,{w:600,size:30,align:"center",color:rgba(A1_INK,0.8)});
  // the tower: six tiers in ink, the top one unfinished, with a scaffold
  const cx=x+w/2,by=y+h-60,tw_=[460,380,300,228,160,100],th=58;ctx.save();ctx.strokeStyle=rgba(A1_INK,0.9);ctx.lineWidth=2.4;ctx.lineJoin="round";
  tw_.forEach((ww,i)=>{const yy=by-(i+1)*th,top=i===5;ctx.fillStyle=rgba(mix(A1_PARCH,A1_INK,0.08+i*0.02),1);ctx.beginPath();if(top){ctx.moveTo(cx-ww/2,yy+th);ctx.lineTo(cx-ww/2,yy+22);ctx.lineTo(cx-ww/6,yy+14);ctx.lineTo(cx,yy+28);ctx.lineTo(cx+ww/5,yy+10);ctx.lineTo(cx+ww/2,yy+30);ctx.lineTo(cx+ww/2,yy+th);}
    else ctx.rect(cx-ww/2,yy,ww,th);ctx.fill();ctx.stroke();ctx.save();ctx.globalAlpha*=0.35;for(let k=1;k<3;k++){ctx.beginPath();ctx.moveTo(cx-ww/2,yy+k*th/3);ctx.lineTo(cx+ww/2,yy+k*th/3);ctx.stroke();}ctx.restore();});
  const sy=by-6*th;[-36,0,36].forEach(dx=>{ctx.beginPath();ctx.moveTo(cx+dx,sy+28);ctx.lineTo(cx+dx,sy-34);ctx.stroke();});ctx.beginPath();ctx.moveTo(cx-44,sy-10);ctx.lineTo(cx+44,sy-10);ctx.moveTo(cx-44,sy-30);ctx.lineTo(cx+44,sy-30);ctx.stroke();ctx.restore();
  // the builders: on the tiers and at the foot, at work until the building stops
  const st=clamp(o.stop||0,0,1),B=[[cx-150,by,46,"carry"],[cx+120,by,46,"carry"],[cx-90,by-2*th,40,"carry"],[cx+60,by-3*th,38,"carry"],[cx-24,by-5*th,34,"pole"]];
  B.forEach(([bx,byy,hh,k],i)=>{const tt=st>0.5?(o.t0||t):t,mv=(1-st)*Math.sin(t*0.3+i)*6;bab_folk(ctx,bx+mv,byy,hh,k,tt,{col:A1_INK,rim:0,dir:i%2?-1:1,step:tt*4*(1-st)+i});
    const tk=clamp(o.talk||0,0,1),sp=clamp(o.split||0,0,1);if(tk>0.01){const dx=sp*(i%2?18:-18),dy=-sp*10;a1_speech(ctx,bx+dx,byy-hh-34+dy,0.8,0,mix([150,110,60],[[176,90,60],[90,120,150],[120,140,70],[150,90,140],[170,130,60]][i],sp),tk,[1,2,3,4,5][i],sp);}});});}
scene("babel",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tSt=c("story"),tS=c("stop"),tR=c("real"),tSh=c("shared"),pg=fin(t,tSt-0.1,0.8)*(1-fin(t,tR-0.6,0.8));
  setScreen(ctx,S);ctx.save();
  // Babylon at a hazy midday, its tower standing on the left while the page is open beside it; then the camera to the builders
  focus(ctx,t,[[0,1200,560,1.0],[tR-0.6,960,600,1.0],[tSh-0.2,960,560,0.95]],2.0);
  bab_sky(ctx,t,{dawn:1,day:0.7});bab_city(ctx,t,{dawn:1,day:0.7});bab_ground(ctx,t,{dawn:1,day:0.7});
  const rp=clamp((t-w("shared","plan")+0.2)/2.4,0,1),FL=[694,A1_BY+8],FR=[1226,A1_BY+8],BR=[1184,A1_BY-26],BL=[736,A1_BY-26];bab_rope(ctx,[FL,FR,BR,BL,FL],rp,{a:0.9,lw:2});
  bab_tower(ctx,960,A1_BY,A1_S,{m:BAB_TH,ruin:0,dawn:1,day:0.7,hi:0.4});
  // Babylon's real builders, from many lands: each speaks their own language
  const rA=fin(t,tR-0.2,0.9);if(rA>0.01){const F=[[330,912,206,"carry",1,{veil:true}],[560,900,192,"walk",1,{}],[800,920,214,"rope",1,{}],[1120,914,200,"carry",-1,{}],[1360,906,196,"pole",-1,{veil:true}],[1600,918,210,"walk",-1,{}]];
    F.forEach(([x,y,h,k,d,op],i)=>{const hd=bab_folk(ctx,x,y,h,k,t,Object.assign({a:rA,dir:d,step:t*3.2+i,rim:0.6},op));a1_speech(ctx,x+d*10,y-h-40,1.15,(i+1)%6,[[176,90,60],[90,120,150],[120,140,70],[150,90,140],[170,130,60],[110,110,170]][i],rA*fin(t,w("real","many languages")-0.6+i*0.15,0.5));});}
  ctx.restore();
  // what the narration names, in screen space
  bab_tag(ctx,960,214,"builders from many lands",fin(t,w("real","many lands")-0.2,0.6)*(1-fin(t,tSh-0.4,0.5)));
  [0,1,2,3].forEach(k=>{const tk=w("shared","a task")-0.2+k*0.25,a=fin(t,tk,0.6);if(a>0.01)arrive(ctx,140+k*440+200,240,t,tk,()=>a1_taskCard(ctx,k,140+k*440,120,400,250,t),{dy:-16,a});});
  bab_tag(ctx,960,430,"a name that answered for the work",fin(t,w("shared","a name")-0.2,0.6));
  // the story, on a page: one language, then many, and the building stops
  if(pg>0.01){a1_babelPage(ctx,1060,110,770,640,t,{a:pg,talk:fin(t,w("stop","one language")-0.3,0.6),split:fin(t,w("stop","until")+0.3,1.2),stop:fin(t,w("stop","stop building")-0.2,0.8),t0:c("stop")+5});
    // from the real tower to the story's: may have inspired it
    const iq=fin(t,w("story","inspired")-0.3,0.6);if(iq>0.01)withA(ctx,pg*iq,()=>{const p_=ease(clamp((t-w("story","inspired")+0.3)/1.2,0,1));ctx.save();ctx.strokeStyle=rgba(BAB_CLAY,0.95);ctx.fillStyle=rgba(BAB_CLAY,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.setLineDash([10,9]);
      const P=u=>{const v=1-u;return[v*v*800+2*v*u*920+u*u*1040,v*v*300+2*v*u*236+u*u*300];};ctx.beginPath();for(let k=0;k<=24;k++){const[x,y]=P(p_*k/24);k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);
      if(p_>0.96){const[x1,y1]=P(1),[x0,y0]=P(0.94),an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-16*Math.cos(an-0.45),y1-16*Math.sin(an-0.45));ctx.lineTo(x1-16*Math.cos(an+0.45),y1-16*Math.sin(an+0.45));ctx.closePath();ctx.fill();}ctx.restore();
      tag(ctx,1445,800,"Babylon's tower may have inspired it",BAB_CLAY,{align:"center",size:30});});}
  vign(ctx,S);});

/* ---------- 11. Agents on the map ---------- */
// Tomás's note, and its answer, beside the map with every agent on it, each in a role of its own with its owner; then the platform they
// all run on, which the next film is about; then the end card
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tA=c("answer"),tN=c("next"),fade=1-fin(t,B,1.0);
  ctx.save();ctx.globalAlpha*=fade;drift(ctx,t,sc,{z:0.02,y:480});
  a1_tomas(ctx,230,fin(t,0.9,0.8),t,{expr:t>w("answer","answer")?"relieved":"calm"});
  arrive(ctx,380,190,t,0.9,()=>sticky(ctx,380,190,560,150,A1_NOTE,{col:NOTEC[0],size:36,rot:-0.02}),{dy:-20});
  arrive(ctx,400,420,t,tA+0.4,()=>sticky(ctx,400,420,600,232,"Each agent in a role of its own, with its tasks, its identity, a hand-off and someone who answers.",{col:NOTEC[3],size:32,rot:0.012,p:clamp((t-tA-0.6)/6.4,0,1)}),{dy:-16});
  a1_map(ctx,t,{p:clamp((t-0.9)/1.8,0,1),deco:true,all:clamp((t-tA-0.2)/2.6,0,1),roleHi:pulseAt(t,w("answer","a role"),1.8),here:pulseAt(t,w("answer","its identity"),1.8),who:pulseAt(t,w("answer","someone who answers"),2.0),
    plat:fin(t,w("next","platform")-0.4,0.8),platHi:pulseAt(t,w("next","platform"),2.0)});
  ctx.restore();vign(ctx,S);
  acaEnd(ctx,S,t,B,"Agents on the map","An agent works in a role of its own, with someone who answers.","Film 1 of 6");});

/* ---------- where the chapters meet ---------- */
// The role chapter ends on the process, and How far opens on it, in the same place: the camera carries on from where it was.
const CHAPTER_JOINS={glide:["far"]};
