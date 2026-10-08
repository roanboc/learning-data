/* ===== What it must be able to do: scenes =====
   Ten chapters, as in ../script.md. The Inca road and its relay posts, where the runners change and the road stays; Tomás's
   first wall, drawn as the org chart; Grace, who says a team is not a capability; what, not who; the map in three levels, in the
   strategy layer's amber; an owner for each level-1 capability, and a gap where there is none; a heat map, from cool to hot; a
   reorganisation that moves two teams under a spine that stays; the depth where the map stops; and the answer, for now.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame. The camera moves in on the branch being
   described, and pulls back for the depth. Motion: every shot drifts slowly and things arrive with a spring. Sound: every effect
   in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// the map's places (see plan.js): level 1 along the top, level 2 under its parents, level 3 as a stack under manage outages
const D4_L1 = [["run the network", 385, 510], ["serve customers", 800, 240], ["generate energy", 1080, 240], ["invest in the network", 1360, 240], ["report to the regulator", 1640, 240]];
const D4_L1Y = 270, D4_L1H = 120;
const D4_L2 = [["manage outages", 250, 440], ["maintain assets", 520, 440], ["connect customers", 800, 440]];
const D4_L3 = [["detect faults", 590], ["dispatch crews", 700], ["restore supply", 810]];
// the connectors from each level-1 box to its children: run the network has two, serve customers one
function d4_brackets(ctx, p, a) { d4_link(ctx, 385, 330, 385, 365, p, a); d4_link(ctx, 250, 365, 520, 365, p, a); d4_link(ctx, 250, 365, 250, 385, p, a); d4_link(ctx, 520, 365, 520, 385, p, a); d4_link(ctx, 800, 330, 800, 385, p, a); }

/* ---------- 1. The road that carried messages ---------- */
scene("road",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t,{light:0.05});
  const out=1-fin(t,B,0.8),tP=w("posts","relays");
  eaYear(ctx,90,90,"1400s · the Andes",CLAY,fin(t,0.3,0.6));
  withA(ctx,out,()=>{ctx.save();drift(ctx,t,sc,{z:0.02,y:500});
    d4_mountains(ctx,fin(t,c("years"),2.0),fin(t,c("years"),0.8));
    d4_road(ctx,fin(t,c("years")+0.3,3.2),1);
    D4_POSTS.forEach((s,i)=>{const[x,y]=d4_bez(s);d4_post(ctx,x,y,fin(t,tP+i*0.25,0.6));});
    // the message moves from post to post; its runner changes at each post
    const p=clamp((t-(tP+0.6))/(w("changed","road")-(tP+0.6)),0,1),sC=lerp(D4_POSTS[0],D4_POSTS[4],p);
    const k=clamp(D4_POSTS.filter(q=>sC>=q-0.001).length-1,0,4);
    if(t>tP+0.6)d4_carrier(ctx,sC,D4_BANDS[k],fin(t,tP+0.6,0.4));
    ctx.restore();});
  arrive(ctx,960,850,t,w("changed","runner"),()=>withA(ctx,out*(1-fin(t,c("outlasts"),0.4)),()=>tag(ctx,960,850,"the runners change · the road stays",PARCH,{align:"center",size:32})),{dy:10});
  arrive(ctx,960,850,t,c("outlasts"),()=>withA(ctx,out,()=>tag(ctx,960,850,"a capability outlasts whoever performs it",STR,{align:"center",size:32})),{dy:10});
  vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"What it must be able to do","what the utility must be able to do, whoever does it",EAC,"Film 4 of 11 · enterprise architecture, for data");});

/* ---------- 2. A note on the wall ---------- */
scene("wall",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  person(ctx,"tomas",300,1030,0.8,{t,pose:t<c("note")+2.2?"explain":"stand"});
  arrive(ctx,1100,200,t,c("note"),()=>sticky(ctx,1100,200,520,130,"What must it be able to do?",{col:NOTEC[0],size:34,st:0,rot:-0.02}),{dy:-30});
  // the org chart, copied to the wall: one paper note for each team
  [["Network Operations",640,"Network"],["Customer Service",960,"Customer"],["Finance",1280,"Finance"],["Regulatory affairs",1600,"Regulatory"]].forEach(([n,x,k],i)=>
    arrive(ctx,x,520,t,w("teams",k)-0.3,()=>sticky(ctx,x,520,280,130,n,{col:NOTEC[i],size:32,rot:(i-1.5)*0.03,st:0.5}),{dy:-24,from:1.06}));
  ctx.restore();
  arrive(ctx,960,800,t,c("complete"),()=>tag(ctx,960,800,"It looks complete. It isn't.",[255,140,120],{align:"center",size:32}),{dy:12});
  vign(ctx,S);});

/* ---------- 3. A team isn't a thing you can do ---------- */
scene("team",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const cS=w("team","is a team");
  person(ctx,"grace",1690,1030,0.8,{t,pose:t>c("grace")&&t<c("grace")+2.2||t>cS&&t<cS+2?"explain":"stand"});
  if(t>c("grace")-0.3)withA(ctx,fin(t,c("grace")-0.3,0.6),()=>tag(ctx,1690,430,"Grace · network operations",TRUST,{align:"center",size:28}));
  // the team note, from the wall, with the stamp: a team is not a capability
  sticky(ctx,640,520,280,130,"Network Operations",{col:NOTEC[0],size:32,rot:-0.045,st:0.5});
  kt_rstamp(ctx,850,425,"who, not what?",[220,80,70],fin(t,cS-0.2,0.3),fin(t,cS,0.35),{size:36,rot:-0.1});
  [["manage outages",470,"list","manage outages"],["maintain assets",830,"list","maintain assets"],["connect customers",1190,"list","connect customers"]].forEach(([n,x,lid,k])=>{
    const t0=w(lid,k)-0.2;arrive(ctx,x,735,t,t0,()=>d4_cap(ctx,x,735,320,130,n,0),{dy:-24,from:1.06});});
  ctx.restore();
  arrive(ctx,960,850,t,c("capability"),()=>tag(ctx,960,850,"capability: what it must be able to do, whoever does it",STR,{align:"center",size:30}),{dy:12});
  vign(ctx,S);});

/* ---------- 4. What, not who ---------- */
scene("what",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  arrive(ctx,960,190,t,c("says"),()=>sticky(ctx,960,190,900,130,"A capability says what, not who, and not how.",{col:NOTEC[0],size:34,st:0,rot:-0.01}),{dy:-24,from:1.06});
  arrive(ctx,960,420,t,w("test","would it still")-0.2,()=>sticky(ctx,960,420,980,170,"Would it still be needed after a reorganisation?",{col:NOTEC[2],size:36,rot:0.01}),{dy:-24,from:1.06});
  // manage outages passes the test; the team might not
  const tO=w("outages","Manage outages"),tT=w("outages","The team");
  arrive(ctx,560,740,t,tO-0.2,()=>{d4_cap(ctx,560,740,340,130,"manage outages",0);tick_(ctx,560+140,740-42,24,[90,190,110],fin(t,tO+0.4,0.3));},{dy:-24,from:1.06});
  arrive(ctx,1360,740,t,tT-0.2,()=>{d4_cap(ctx,1360,740,340,130,"Network Operations",0);T(ctx,"?",1360+140,740-44,{w:800,size:46,align:"center",color:rgba([255,140,120],1)});},{dy:-24,from:1.06});
  ctx.restore();
  arrive(ctx,960,850,t,w("name","an ability"),()=>tag(ctx,960,850,"capability: an ability, in a few words",STR,{align:"center",size:32}),{dy:12});
  vign(ctx,S);});

/* ---------- 5. Three levels ---------- */
scene("levels",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  // level 1: five glass boxes along the top, in the strategy layer's amber
  D4_L1.forEach(([n,cx,w_],i)=>{const t0=c("top")+0.2+i*0.25;arrive(ctx,cx,D4_L1Y,t,t0,()=>d4_cap(ctx,cx,D4_L1Y,w_,D4_L1H,n,1,{size:32}),{dy:-24,from:1.06});});
  // level 2: manage outages and maintain assets under run the network, connect customers under serve customers
  const b2=w("parts","Under run");d4_brackets(ctx,fin(t,b2,0.8),1);
  D4_L2.forEach(([n,cx],i)=>{const t0=i===2?w("connect","Connect customers"):w("parts",n)-0.1;arrive(ctx,cx,440,t,t0,()=>d4_cap(ctx,cx,440,240,110,n,1,{size:30}),{dy:-24,from:1.06});});
  // level 3: only under manage outages, in order, with arrows
  const a3=[w("depth","a fault is found"),w("depth","a crew is sent"),w("depth","supply comes back")];
  if(t>a3[0]-0.2)d4_link(ctx,250,495,250,550,fin(t,a3[0]-0.3,0.5),0.85);
  D4_L3.forEach(([n,cy],i)=>arrive(ctx,250,cy,t,a3[i]-0.2,()=>d4_cap(ctx,250,cy,240,80,n,1,{size:30}),{dy:-20,from:1.06}));
  if(t>a3[1]-0.2)arrowTo(ctx,250,634,250,656,STR,0.9,{p:fin(t,a3[1]-0.2,0.4),lw:3,head:10});
  if(t>a3[2]-0.2)arrowTo(ctx,250,744,250,766,STR,0.9,{p:fin(t,a3[2]-0.2,0.4),lw:3,head:10});
  ctx.restore();
  arrive(ctx,960,150,t,c("top")+0.5,()=>tag(ctx,960,150,"level 1 · level 2 · level 3, only where order matters",STR,{align:"center",size:32}),{dy:10});
  vign(ctx,S);});

/* ---------- 6. Owners ---------- */
scene("owners",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  // the level 1 map, as in Three levels, with owners written above each box
  D4_L1.forEach(([n,cx,w_])=>d4_cap(ctx,cx,D4_L1Y,w_,D4_L1H,n,1,{size:32}));
  d4_brackets(ctx,1,1);
  D4_L2.forEach(([n,cx])=>d4_cap(ctx,cx,440,240,110,n,1,{size:30}));
  // the owners: a name above each box that has one, and a gold tick at its corner
  [["Grace",385,510,"names"],["Farah",800,240,"names"],["Ama",1640,240,"names"]].forEach(([nm,cx,bw,lid])=>{const t0=w(lid,nm)-0.2,q=fin(t,t0,0.5);
    if(q>0)withA(ctx,q,()=>{kt_gtick(ctx,cx+bw/2-26,190,22,1);T(ctx,nm,cx,150,{w:800,size:32,align:"center",color:rgba(TRUST,1)});});});
  // generate energy has no owner: a red stamp
  kt_rstamp(ctx,1080,150,"no owner yet",[220,80,70],fin(t,w("gap","no owner")-0.2,0.3),fin(t,w("gap","no owner"),0.35),{size:32,rot:-0.06});
  ctx.restore();
  arrive(ctx,960,850,t,c("own"),()=>tag(ctx,960,850,"owner: the person who answers for whether it works",STR,{align:"center",size:30}),{dy:12});
  arrive(ctx,960,800,t,c("empty"),()=>tag(ctx,960,800,"a capability with no owner is a gap in the map",[255,140,120],{align:"center",size:30}),{dy:12});
  vign(ctx,S);});

/* ---------- 7. Where it hurts ---------- */
scene("heat",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});const K=[[c("hot")-0.4,760,540,1.15],[c("look")+0.5,960,540,1.0]];focus(ctx,t,K);
  D4_L1.forEach(([n,cx,w_])=>d4_cap(ctx,cx,D4_L1Y,w_,D4_L1H,n,1,{size:32}));
  d4_brackets(ctx,1,1);
  // the level 2 boxes, coloured by the evidence: cool is working, hot is hurting
  const HEAT=[0.5,0.65,0.95];
  D4_L2.forEach(([n,cx],i)=>d4_heat(ctx,cx,440,240,110,n,HEAT[i],fin(t,w("heat","heat map")+i*0.2,0.6)));
  d4_legend(ctx,1000,470,560,fin(t,w("heat","heat map"),0.6));
  // the hottest, against its target
  arrive(ctx,1280,600,t,w("hot","thirty-five")-0.4,()=>sticky(ctx,1280,600,520,120,"target: 10 working days",{col:NOTEC[1],size:32,rot:0.01}),{dy:-20,from:1.06});
  arrive(ctx,1280,720,t,w("hot","thirty-five"),()=>sticky(ctx,1280,720,520,120,"today: about 35 working days",{col:NOTEC[0],size:32,rot:-0.01}),{dy:-20,from:1.06});
  ctx.restore();
  arrive(ctx,960,850,t,w("look","where to look"),()=>tag(ctx,960,850,"where to look first · not where the money goes",STR,{align:"center",size:30}),{dy:12});
  vign(ctx,S);});

/* ---------- 8. The spine stays ---------- */
scene("spine",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const sp=w("stable","stable spine"),tS=w("reorg","Network Operations"),tM=w("move","The teams move");
  // the level 1 row is the spine: it stays, and lights up as the stable one
  D4_L1.forEach(([n,cx,w_])=>d4_cap(ctx,cx,D4_L1Y,w_,D4_L1H,n,1,{size:32,hi:fin(t,sp,0.6)*0.6}));
  d4_brackets(ctx,1,1);
  D4_L2.forEach(([n,cx])=>d4_cap(ctx,cx,440,240,110,n,1,{size:30}));
  // Network Operations splits in two: the teams slide to new homes under the capabilities they serve
  const q=fin(t,tS+0.2,1.8),ex=ease(q);
  withA(ctx,1-fin(t,tS,0.3),()=>sticky(ctx,960,560,300,110,"Network Operations",{col:NOTEC[0],size:32,rot:0,st:0.5}));
  if(t>tS){const TEAM=[["grid operations",lerp(960,520,ex),lerp(560,620,ex)],["network planning",lerp(960,1360,ex),lerp(560,470,ex)]];
    withA(ctx,fin(t,tS,0.3),()=>TEAM.forEach(([n,x,y],i)=>sticky(ctx,x,y,240,90,n,{col:NOTEC[i+1],size:30,rot:0,st:0.5})));}
  ctx.restore();
  arrive(ctx,960,850,t,tM,()=>tag(ctx,960,850,t>sp?"capabilities: the stable spine":"the teams move · the capabilities stay",STR,{align:"center",size:32}),{dy:12});
  vign(ctx,S);});

/* ---------- 9. Just enough ---------- */
scene("depth",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});const K=[[0,400,640,1.25],[c("deeper")+1.0,960,540,1.0]];focus(ctx,t,K);
  D4_L1.forEach(([n,cx,w_])=>d4_cap(ctx,cx,D4_L1Y,w_,D4_L1H,n,1,{size:32}));
  d4_brackets(ctx,1,1);
  D4_L2.forEach(([n,cx])=>d4_cap(ctx,cx,440,240,110,n,1,{size:30}));
  d4_link(ctx,250,495,250,550,1,0.85);
  D4_L3.forEach(([n,cy])=>d4_cap(ctx,250,cy,240,80,n,1,{size:30}));
  // levels 4 and 5 are drawn faint beside detect faults, and stop there
  const f4=fin(t,w("deeper","level 4"),0.8),f5=fin(t,w("deeper","level 5"),0.8);
  d4_link(ctx,370,590,440,590,f4,0.6);
  d4_faint(ctx,560,590,240,80,"level 4: check each feeder",0.6*f4*(1-fin(t,B,0.8)));
  d4_faint(ctx,560,700,240,80,"level 5: check each switch",0.6*f5*(1-fin(t,B,0.8)));
  kt_rstamp(ctx,560,820,"stop here",[220,80,70],fin(t,w("declare","stop there")-0.2,0.3),fin(t,w("declare","stop there"),0.35),{size:40,rot:-0.08});
  ctx.restore();
  arrive(ctx,960,850,t,w("declare","Declare"),()=>withA(ctx,1-fin(t,B,0.8),()=>tag(ctx,960,850,"declare how deep · then stop",STR,{align:"center",size:32})),{dy:12});
  arrive(ctx,960,800,t,w("fewer","Fewer"),()=>withA(ctx,1-fin(t,B,0.8),()=>tag(ctx,960,800,"fewer, well-made boxes",TRUST,{align:"center",size:30})),{dy:12});
  vign(ctx,S);});

/* ---------- 10. Checked, for now ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const cC=c("confirms"),cA=c("answer"),ok=fin(t,w("confirms","confirms")+0.2,0.8),gb=fin(t,w("confirms","to the board"),0.5);
  // the level 1 map is confirmed: glass, with a gold tick above each box; the level 2 boxes stay paper, as drafts
  D4_L1.forEach(([n,cx,w_])=>d4_cap(ctx,cx,D4_L1Y,w_,D4_L1H,n,ok,{size:32,st:0.5+0.5*ok}));
  if(ok>0)withA(ctx,ok,()=>{D4_L1.forEach(([n,cx,bw])=>kt_gtick(ctx,cx+bw/2-26,190,22,1));});
  d4_brackets(ctx,1,1);
  D4_L2.forEach(([n,cx])=>d4_cap(ctx,cx,440,240,110,n,0,{size:30,st:0.5}));
  withA(ctx,gb,()=>tag(ctx,560,600,"to the board, as a draft",PARCH,{align:"center",size:30}));
  person(ctx,"grace",1250,1030,0.76,{t,pose:t>cC&&t<cC+2.0?"explain":"stand"});
  person(ctx,"tomas",1800,1030,0.78,{t,pose:t>cA&&t<cA+2.2?"explain":"stand"});
  arrive(ctx,1500,470,t,cA,()=>sticky(ctx,1500,470,380,150,"Five things, each with an owner.",{col:NOTEC[0],size:32,p:clamp((t-cA-0.2)/2.2,0,1),rot:0.015}),{dy:-30,from:1.06});
  arrive(ctx,1500,690,t,w("next","how value"),()=>sticky(ctx,1500,690,380,140,"How does value reach a customer?",{col:NOTEC[0],size:32,st:0,rot:0.03}),{dy:-30,from:1.06});
  ctx.restore();vign(ctx,S);
  eaEnd(ctx,S,t,B+0.8,"What it must be able to do",EAC,"Know what it must be able to do, whoever does it.","Film 4 of 11");});
