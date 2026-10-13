/* ===== Today, and where it's going: scenes =====
   Ten chapters, as in ../script.md. An imagined morning in 2045 in the utility's own region: a street trading power from its batteries,
   and a crew sent before a transformer fails; then today's hundred and forty systems, as a list and placed under the capabilities they
   serve; three systems for one job, a capability with only a spreadsheet, and a system that serves nothing; the technology beneath
   them; the drafts made into one model in ArchiMate's notation; the target, drawn on the same map; the gaps between them; the path,
   plateau by plateau, in the order the gaps must close; a decision written down with why; and today confirmed, the target and the path
   to the board as drafts.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; names of systems placed in bulk are texture. Motion
   (In the weeds of data crafting's helpers): every shot drifts slowly and things arrive with a spring. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. An imagined morning ---------- */
// the street at sunrise, in whatever transform the caller set: the sky, and turbines on the hills; the ground in section, with power
// moving in the cables under the street; the homes, a street light, trees, the kiosk, a car on charge, and the crew's van
function d7_scene(ctx,S,t,o){const sun=o.sun;d7_sky(ctx,S,sun,true);[900,980,1250].forEach((x,i)=>d7_turbine(ctx,x,612+Math.sin(x*0.004)*36,0.9,t+i,rgba(mix([60,64,90],[230,220,230],sun),0.8)));
  d7_ground(ctx,t,sun,{trade:o.trade,grid:o.grid,lab:o.lab});
  D7_HOUSES.forEach((hs,i)=>d7_house(ctx,hs,i,t,sun,{level:0.4+0.45*hash(i,730)+0.1*Math.sin(t*0.6+i),lit:o.trade*(0.5+0.5*Math.sin(t*1.4+i*1.7)),room:1-sstep(0.25,0.7,sun)}));
  d7_lamp(ctx,1625,D7_GY+12,sun);d7_tree(ctx,622,D7_GY+12,0.86,t,sun,1.3);d7_tree(ctx,1290,D7_GY+12,0.82,t,sun,4.1);
  d7_kiosk(ctx,t,sun,{drift:o.drift,door:o.door,swap:o.swap});
  d7_charger(ctx,322,D7_GY+12,470-118,D7_RY-46,t,sun);d7_ev(ctx,470,D7_RY,1,t,sun);d7_evan(ctx,o.vx,D7_RY,0.95,t,sun,o.van);}
scene("morning",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tS=c("street"),tC=c("crew"),tD=c("drawing"),tT=c("today"),tSent=w("crew","crew is sent"),k=ease(fin(t,tT-0.3,1.3));
  // the sun comes up; in the night the street is fed from the grid, and once the sun is up the homes trade among themselves; the readings
  // drift, the van drives up, a door of the kiosk opens, and the transformer is changed
  const tTr=w("street","trade"),sun=clamp((t-0.3)/(tC+2),0,1),dr=clamp((t-w("crew","drift"))/2.0,0,1),vx=lerp(2200,D7_KX+210,ease(clamp((t-tSent)/2.2,0,1)));
  const door=fin(t,tSent+2.2,0.4)*(1-fin(t,tSent+3.8,0.5)),swap=fin(t,tSent+2.6,0.8),trade=fin(t,tTr,0.8),grid=fin(t,0.6,0.8)*(1-fin(t,tTr-0.3,1.0));
  // the street, full frame, then drawn small on the right as "the target", beside today's list
  setScreen(ctx,S);ctx.fillStyle="#05070d";ctx.fillRect(0,0,W,H);ctx.save();drift(ctx,t,sc,{z:0.02,y:600});
  ctx.translate(lerp(0,1000,k),lerp(0,250,k));ctx.scale(lerp(1,0.46,k),lerp(1,0.46,k));ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();
  d7_scene(ctx,S,t,{sun,trade,grid,lab:fin(t,1.2,0.6)*(1-fin(t,tT-0.9,0.5)),drift:dr,door,swap,vx,van:fin(t,tSent,0.4)});
  // the box on the pavement is the transformer
  arrive(ctx,D7_KX,552,t,w("crew","transformer"),()=>withA(ctx,1-fin(t,tD-0.3,0.4),()=>tag(ctx,D7_KX,552,"transformer",[255,200,140],{align:"center",size:28})),{dy:8});
  ctx.restore();
  // the frame: a drawing, not a forecast
  const fr=fin(t,w("drawing","drawing")-0.2,0.8);if(fr>0){const x0=lerp(40,1000,k),y0=lerp(40,250,k),fw=lerp(W-80,W*0.46,k),fh=lerp(H-80,H*0.46,k);withA(ctx,fr,()=>{ctx.save();ctx.strokeStyle=rgba(MIG,0.9);ctx.lineWidth=3;ctx.setLineDash([14,10]);ctx.shadowColor=rgba(MIG,0.6);ctx.shadowBlur=14;rr(ctx,x0,y0,fw,fh,18);ctx.stroke();ctx.restore();});}
  setScreen(ctx,S);
  eaYear(ctx,90,90,"imagined · 2045",CLAY,fin(t,0.3,0.6)*(1-fin(t,tT-0.4,0.4)));
  arrive(ctx,960,160,t,tTr,()=>withA(ctx,1-fin(t,tC-0.3,0.4),()=>tag(ctx,960,160,"homes trading power, house to house",[170,245,190],{align:"center",size:32})),{dy:10});
  d7_trend(ctx,1360,120,500,260,clamp((t-w("crew","readings"))/2.2,0,1),t,fin(t,w("crew","readings")-0.3,0.5)*(1-fin(t,tD-0.3,0.5)));
  arrive(ctx,700,160,t,tSent,()=>withA(ctx,1-fin(t,tD-0.3,0.4),()=>tag(ctx,700,160,"a crew, before it fails",[255,214,170],{align:"center",size:32})),{dy:10});
  arrive(ctx,960,160,t,w("drawing","drawing"),()=>withA(ctx,1-fin(t,tT-0.3,0.4),()=>tag(ctx,960,160,"the target: a drawing, not a forecast",MIG,{align:"center",size:32})),{dy:10});
  // today: the list of a hundred and forty systems
  d7_list(ctx,120,240,620,600,t,{a:fin(t,tT-0.1,0.6)});
  arrive(ctx,430,170,t,tT+0.2,()=>tag(ctx,430,170,"today",APL,{align:"center",size:32}),{dy:8});
  arrive(ctx,1460,170,t,tT+0.6,()=>tag(ctx,1460,170,"where it's going",MIG,{align:"center",size:32}),{dy:8});
  fadeIn(ctx,S,t);vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"Today, and where it's going","applications, technology, and the path to a target",EAC,"Film 7 of 11 · enterprise architecture, for data");});

/* ---------- 2. A hundred and forty systems ---------- */
const D7_CAPS=["plan the network","operate the network","maintain assets","connect customers","generate power","sell energy","serve customers","meet obligations"];
// the systems each capability's evidence put under it (Fleet portal 2 isn't here: it serves nothing anyone can name)
const D7_PLACE=[["Network model","Planning studies","GIS · network map","Load forecast","Design tool"],["SCADA · network control","DMS · distribution","OMS · outages","Storm tool","Weather feed","Field mobility","Protection settings","Vegetation app"],
  ["EAM · assets","Asset photos","Fleet portal","Procurement","Safety incidents","Training records"],["Connections portal","AMI head-end · meters","Contracts register","Spreadsheet · ops roster"],["Hydro scheduling","Wind SCADA","Market gateway"],
  ["Billing","Settlement","Spreadsheet · tariffs","CRM"],["CIS · customers","Contact centre phones","Website","Complaints log","Hardship register","Life support register","MDM · meter data"],["Data warehouse","Regulatory reports","Document store","HR · payroll"]];
const d7_cx=i=>177+i*224;
scene("list",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const tB=c("bought"),tP=c("place"),tM=c("most"),nt=ease(fin(t,tB-0.4,0.7)),lo=fin(t,w("place","Each system")+3.2,0.6);
  arrive(ctx,960,420,t,0.3,()=>{ctx.save();ctx.translate(lerp(960,1570,nt),lerp(420,120,nt));ctx.scale(lerp(1,0.6,nt),lerp(1,0.6,nt));sticky(ctx,0,0,780,220,"What runs it today, and where is it going?",{col:NOTEC[0],size:46,st:0,rot:-0.02});ctx.restore();},{dy:-30});
  withA(ctx,1-fin(t,tB+0.8,0.6),()=>person(ctx,"tomas",300,1030,0.8,{t,pose:t<c("note")+2.2?"explain":"stand"}));
  // the list, then the map to place it on
  arrive(ctx,700,560,t,w("bought","list")-0.2,()=>withA(ctx,1-lo,()=>d7_list(ctx,440,330,520,520,t,{})),{dy:14});
  D7_CAPS.forEach((n,i)=>arrive(ctx,d7_cx(i),250,t,w("place","map")+i*0.08,()=>archEl(ctx,d7_cx(i)-104,200,208,100,n,STR,"capability",{size:28,gs:11}),{dy:-12}));
  // each system flies from the list to the capability it serves
  let k=0;D7_CAPS.forEach((n,i)=>{for(let j=0;j<D7_PLACE[i].length;j++,k++){const t0=w("place","Each system")+k*0.07,u=ease(clamp((t-t0)/0.8,0,1));if(u<=0)continue;
    const x=lerp(700,d7_cx(i),u),y=lerp(590,346+j*58,u),nm=D7_PLACE[i][j];withA(ctx,clamp(u*3,0,1),()=>archEl(ctx,x-100,y-23,200,46,nm,APL,"component",{size:20,gs:9,deco:1,hi:pulseAt(t,tM+0.2+((i*3+j)%7)*0.12,0.8)*0.6}));}});
  ctx.restore();
  arrive(ctx,700,110,t,w("place","capability it serves"),()=>withA(ctx,1-fin(t,w("place","from evidence")-0.3,0.4),()=>tag(ctx,700,110,"each system, under the capability it serves",APL,{align:"center",size:30})),{dy:8});
  arrive(ctx,700,110,t,w("place","from evidence"),()=>tag(ctx,700,110,"from evidence: who uses it, and for what",APL,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 3. Three, none, and one too many ---------- */
scene("find",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tN=c("none"),tO=c("orphan"),tNm=c("names");
  // three systems under managing outages
  arrive(ctx,370,240,t,0.2,()=>archEl(ctx,90,190,560,100,"manage outages",STR,"capability",{size:32,gs:14,hi:pulseAt(t,c("three"),1.2)}),{dy:-12});
  [["OMS · outages","an outage"],["DMS · network control","network control"],["storm tool · 2015","storm tool"]].forEach(([n,word],j)=>arrive(ctx,370,370+j*100,t,w("three",word)-0.1,()=>archEl(ctx,130,330+j*100,480,80,n,APL,"component",{size:30,gs:13,hi:pulseAt(t,w("three",word),1.0)}),{dy:-12}));
  const ov=fin(t,w("three","storm tool")+0.6,0.5);if(ov>0)withA(ctx,ov,()=>{ctx.save();ctx.strokeStyle=rgba([255,190,110],0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(624,336);ctx.lineTo(644,336);ctx.lineTo(644,604);ctx.lineTo(624,604);ctx.stroke();ctx.restore();});
  // nothing under assessing network capacity but a spreadsheet
  arrive(ctx,990,240,t,tN-0.2,()=>archEl(ctx,740,190,500,100,"assess network capacity",STR,"capability",{size:30,gs:14,hi:0.6+0.4*Math.sin(t*2)}),{dy:-12});
  if(t>tN-0.2)withA(ctx,fin(t,tN-0.2,0.5)*(1-fin(t,w("none","spreadsheet")-0.2,0.5)),()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(APL,0.7);ctx.lineWidth=2.5;rr(ctx,770,330,440,80,8);ctx.stroke();ctx.restore();T(ctx,"no system",990,382,{w:700,size:30,align:"center",color:rgba(APL,0.9)});});
  arrive(ctx,990,470,t,w("none","spreadsheet")-0.1,()=>d7_sheet(ctx,790,330,400,300,{title:"spreadsheet",line:"kept by one engineer"}),{dy:-14});
  // and one system that serves nothing anyone can name
  arrive(ctx,1590,240,t,w("orphan","serves no")-0.2,()=>d7_slot(ctx,1340,190,500,100,1),{dy:-12});
  arrive(ctx,1590,375,t,w("orphan","one system")-0.1,()=>archEl(ctx,1360,330,460,90,"Fleet portal 2",APL,"component",{size:30,gs:13}),{dy:-12});
  arrive(ctx,1590,480,t,w("orphan","licence"),()=>tag(ctx,1590,480,"a licence, every year",[255,190,110],{align:"center",size:28}),{dy:8});
  // what a map shows that a list can't
  [["overlap",370,720,"Overlaps"],["gap",990,690,"gaps"],["shadow system",990,760,"shadow"],["serves nothing",1590,560,"shadow"]].forEach(([s_,x,y,word],i)=>arrive(ctx,x,y,t,w("names",word)+(i===3?0.3:0),()=>tag(ctx,x,y,s_,[255,190,110],{align:"center",size:30}),{dy:8}));
  ctx.restore();
  arrive(ctx,960,850,t,w("names","list could"),()=>tag(ctx,960,850,"a list could never show them; a map does",PARCH,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 4. What runs it ---------- */
const D7_L4C=[["manage outages",330],["connect customers",960],["bill customers",1590]];
const D7_L4A=[["OMS · outages",330,0],["DMS · control",650,0],["GIS · network map",970,1],["CIS · customers",1290,2],["Billing",1610,2]];
const D7_L4T=[["data centre 1",400,"two data centres"],["data centre 2",800,"two data centres"],["cloud",1200,"a cloud"],["field radio network",1620,"radio network"]];
const D7_L4R=[[0,0],[1,0],[1,3],[2,1],[3,2],[4,1]];  // which app runs on which technology
scene("layers",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tD=c("derive"),tF=c("follow"),dn=w("follow","Change"),up=w("follow","Switch off");
  const pulse=(a,b)=>fin(t,a,0.4)*(1-fin(t,b,0.6));
  [["strategy",STR,162,w("derive","capability")],["application",APL,414,w("derive","applications serve")],["technology",TEC,664,w("derive","technology runs")]].forEach(([n,col,y,t0])=>{withA(ctx,fin(t,0.2,0.5),()=>T(ctx,n,60,y,{f:"mono",w:600,size:28,color:rgba(col,0.6+0.4*pulseAt(t,t0,1.4))}));});
  // capabilities and the applications that serve them, then the technology they run on
  const dnC=pulse(dn,up),upA=fin(t,up+0.6,0.4),upC=fin(t,up+1.2,0.4);
  D7_L4C.forEach(([n,x],i)=>arrive(ctx,x,225,t,0.2+i*0.1,()=>archEl(ctx,x-210,180,420,90,n,STR,"capability",{size:30,gs:13,hi:(i===0?dnC:0)+(i>0?upC:0)}),{dy:-10}));
  D7_L4A.forEach(([n,x,ci],i)=>{arrive(ctx,x,475,t,0.5+i*0.1,()=>archEl(ctx,x-150,432,300,86,n,APL,"component",{size:28,gs:12,hi:(i<2?pulse(dn+0.4,up):0)+((i===2||i===4)?upA:0)}),{dy:-10});
    const q=fin(t,0.9+i*0.1,0.5);if(q>0)d7_link(ctx,D7_L4C[ci][1],270,x,432,STR,q,{a:0.5});});
  D7_L4T.forEach(([n,x,word],i)=>arrive(ctx,x,725,t,w("below",word)-0.1+(i===1?0.25:0),()=>{archEl(ctx,x-170,682,340,86,n,TEC,"node",{size:28,gs:12,hi:(i===0||i===3?pulse(dn+0.8,up):0)});
    if(i===1){const xx=fin(t,up,0.4);if(xx>0)cross_(ctx,x,725,70,D7_RED,xx);}},{dy:-10}));
  D7_L4R.forEach(([ai,ti],k)=>{const word=D7_L4T[ti][2],q=fin(t,w("below",word)+0.3,0.5);if(q>0)d7_link(ctx,D7_L4A[ai][1],518,D7_L4T[ti][1],682,TEC,q,{a:0.45,dash:[6,6]});});
  // following a change down, and a switched-off server up
  ctx.restore();
  arrive(ctx,960,840,t,dn,()=>withA(ctx,1-fin(t,up-0.3,0.4),()=>tag(ctx,960,840,"change a capability: follow it down",STR,{align:"center",size:30})),{dy:8});
  arrive(ctx,960,840,t,up,()=>tag(ctx,960,840,"switch off a server: follow it up",D7_RED,{align:"center",size:30}),{dy:8});
  arrive(ctx,960,110,t,tD,()=>tag(ctx,960,110,"each layer serves the one above",PARCH,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 5. One map, one notation ---------- */
// the canvas notes, and the element each becomes: [paper, its block, its canvas, note colour, layer, element name, kind, colour, x in the layer, the word]
const D7_BLK=[["households","customer segment","value proposition canvas",NOTEC[1],0,"households",
  "stakeholder",MOT,420,"customer segment"],["fewer, shorter outages","pain reliever","value proposition canvas",NOTEC[0],1,"manage outages","capability",STR,420,"pain reliever"],
  ["restore supply","key activity","business model canvas",NOTEC[2],2,"restore supply","process",BUS,420,"key activity"],["poles, wires and crews","key resource","business model canvas",NOTEC[3],1,"poles, wires and crews","resource",STR,790,"key resource"]];
const D7_DECO=[["affordable bills","connect renewables"],[],["take the call","decide who goes first"],["outage record","account"],["OMS","CIS","GIS"],["data centre","radio network"]];
const D7_WHY=[[0,"why it exists"],[1,"what it must be able to do"],[2,"how the work flows, who does it"],[4,"what runs it"]];
scene("views",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tB=c("blocks"),tW=c("whole"),tT=c("tools"),lx=820,ly=150,lw=1000;
  const fill=[0,1,2,3,4,5].map(i=>fin(t,tW+0.3+i*0.4,0.6)*0.8);
  const R=layerStack(ctx,lx,ly,lw,{p:clamp((t-0.3)/1.4,0,1),sh:96,gap:14,size:30,fill,hi:fill.map((f,i)=>pulseAt(t,tW+0.3+i*0.4,1.0))});
  // the notes from the canvases, each flying into its layer and turning to glass
  D7_BLK.forEach(([txt,blk,cv,col,li,el,kind,ecol,fx,word],i)=>{const t0=w("blocks",word),u=ease(clamp((t-t0)/1.1,0,1)),nx=330,ny=200+i*170,[bx,by,bw,bh]=R[li],tx=bx+fx,ty=by+bh/2;
    if(u<0.55)arrive(ctx,nx,ny,t,0.4+i*0.15,()=>{withA(ctx,1-clamp((u-0.3)/0.25,0,1),()=>{ctx.save();ctx.translate(lerp(nx,tx,u),lerp(ny,ty,u));T(ctx,blk,220,10,{w:700,size:28,color:rgba(PARCH,0.9)});sticky(ctx,0,0,400,110,txt,{col,size:30,src:cv,srcSize:28,srcA:1-u*2});ctx.restore();});},{dy:-14});
    if(u>0.3)withA(ctx,clamp((u-0.3)/0.4,0,1),()=>archEl(ctx,tx-170,ty-38,340,76,el,ecol,kind,{size:28,gs:12,hi:pulseAt(t,t0+1.1,1.0)}));});
  // the rest of the map, layer by layer, as texture
  D7_DECO.forEach((els,li)=>{const[bx,by,bw,bh]=R[li],q=fin(t,tW+0.3+li*0.4,0.6);if(q>0)withA(ctx,q*0.8,()=>els.forEach((n,j)=>{const used=D7_BLK.some(b=>b[4]===li);const x0=bx+(used?620:250)+j*190;if(x0+180>bx+bw+20)return;archEl(ctx,x0,by+bh/2-30,180,60,n,LAY6[li][1],["stakeholder","capability","process","object","component","node"][li],{size:20,gs:9,deco:1});}));});
  D7_WHY.forEach(([li,s_],k)=>{const[bx,by,bw,bh]=R[li];arrive(ctx,lx-40,by+bh/2,t,w("whole",s_.split(",")[0])-0.1,()=>T(ctx,s_,lx-40,by+bh/2+10,{w:700,size:28,align:"right",color:rgba(mix(LAY6[li][1],INK,0.3),1)}),{dy:6});});
  ctx.restore();
  arrive(ctx,960,100,t,w("drafts","one model"),()=>withA(ctx,1-fin(t,tT-0.3,0.4),()=>tag(ctx,960,100,"one model, in ArchiMate's notation",PARCH,{align:"center",size:30})),{dy:8});
  arrive(ctx,960,100,t,tT,()=>tag(ctx,960,100,"modelling tools such as Archi or LeanIX keep it; the ideas don't depend on them",PARCH,{align:"center",size:28}),{dy:8});
  vign(ctx,S);});

/* ---------- 6. Where it's going ---------- */
// one column of the map: capabilities, and what serves each; o.x is the column's left edge
function d7_today(ctx,t,x,o){o=o||{};archEl(ctx,x+20,200,360,90,"manage outages",STR,"capability",{size:28,gs:12});archEl(ctx,x+400,200,360,90,"assess network capacity",STR,"capability",{size:28,gs:12,hi:0.5});
  ["OMS · outages","DMS · network control","storm tool · 2015"].forEach((n,j)=>archEl(ctx,x+40,320+j*92,320,76,n,APL,"component",{size:26,gs:11,deco:1}));
  d7_sheet(ctx,x+420,316,320,236,{title:"spreadsheet"});
  const g=o.gone||0;archEl(ctx,x+420,580,320,76,"Fleet portal 2",APL,"component",{size:28,gs:11,a:1-0.6*g});if(g>0){ctx.save();ctx.strokeStyle=rgba(D7_RED,0.95*g);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+426,618);ctx.lineTo(x+426+308*ease(g),618);ctx.stroke();ctx.restore();}}
scene("target",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tN=c("new"),tC=c("change"),tg=fin(t,w("second","the target")-0.2,0.6);
  withA(ctx,fin(t,0.2,0.6),()=>{d7_today(ctx,t,60,{gone:fin(t,w("change","gone")-0.2,0.5)});tag(ctx,470,140,"today",APL,{align:"center",size:32});});
  withA(ctx,tg,()=>{ctx.save();ctx.setLineDash([10,10]);ctx.strokeStyle="rgba(220,230,255,0.25)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(960,130);ctx.lineTo(960,860);ctx.stroke();ctx.restore();tag(ctx,1450,140,"target · 2045",MIG,{align:"center",size:32});
    archEl(ctx,1080,200,360,90,"manage outages",STR,"capability",{size:28,gs:12});archEl(ctx,1460,200,360,90,"assess network capacity",STR,"capability",{size:28,gs:12});});
  [["predict faults",1080,"predicting"],["trade power locally",1460,"trading"]].forEach(([n,x,word])=>arrive(ctx,x+180,645,t,w("new",word)-0.1,()=>{archEl(ctx,x,600,360,90,n,STR,"capability",{size:28,gs:12,hi:pulseAt(t,w("new",word),1.2)});d7_new(ctx,x+300,600,1);},{dy:-12}));
  [["one outage system",1100,320,"One outage"],["network capacity model",1480,320,"capacity"],["fault prediction",1100,720,"capacity"],["local trading platform",1480,720,"capacity"]].forEach(([n,x,y,word],i)=>arrive(ctx,x+160,y+38,t,w("change",word)+(i>1?0.6+i*0.3:0),()=>archEl(ctx,x,y,320,76,n,APL,"component",{size:28,gs:11}),{dy:-10}));
  ctx.restore();
  arrive(ctx,960,862,t,w("second","same map"),()=>tag(ctx,960,862,"on the same map, so the two can be compared",PARCH,{align:"center",size:28}),{dy:8});
  vign(ctx,S);});

/* ---------- 7. The gaps ---------- */
const D7_GAPS=[["three outage systems","merge three outage systems into one","one outage system","Merge"],["a spreadsheet","build the capacity model","network capacity model","Build"],
  ["Fleet portal 2","switch off the system nobody uses","—","Switch off"],["no sensors","add sensors, predict faults","fault prediction","Add sensors"],["no trading","open local trading","local trading platform","Open local"]];
scene("gaps",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  withA(ctx,fin(t,0.2,0.5),()=>{tag(ctx,300,130,"today",APL,{align:"center",size:30});tag(ctx,1620,130,"target · 2045",MIG,{align:"center",size:30});});
  arrive(ctx,960,130,t,w("diff","gaps")-0.1,()=>tag(ctx,960,130,"gaps",MIG,{align:"center",size:30}),{dy:8});
  D7_GAPS.forEach(([a,g,b,word],i)=>{const y=190+i*136,t0=w("five",word)-0.1,q=fin(t,t0,0.5);
    arrive(ctx,300,y+44,t,0.3+i*0.12,()=>archEl(ctx,80,y,440,88,a,APL,"component",{size:28,gs:11,a:a.startsWith("no ")?0.6:1}),{dy:-10});
    arrive(ctx,1620,y+44,t,0.5+i*0.12,()=>{if(b==="—")T(ctx,"—",1620,y+58,{w:800,size:40,align:"center",color:rgba(SOFT,0.8)});else archEl(ctx,1400,y,440,88,b,APL,"component",{size:28,gs:11});},{dy:-10});
    if(q>0){d7_link(ctx,520,y+44,620,y+44,MIG,q,{a:0.7});d7_link(ctx,1300,y+44,1400,y+44,MIG,q,{a:0.7});}
    arrive(ctx,960,y+44,t,t0,()=>archEl(ctx,620,y,680,88,g,MIG,"gap",{size:28,gs:13,hi:pulseAt(t,t0+0.1,1.2)}),{dy:-10});});
  ctx.restore();
  arrive(ctx,960,862,t,w("diff","piece of work"),()=>tag(ctx,960,862,"each gap: a piece of work",MIG,{align:"center",size:28}),{dy:8});
  vign(ctx,S);});

/* ---------- 8. The path, in order ---------- */
const D7_PLAT=[["today",240],["2028",720],["2033",1200],["2045 · target",1680]];
const D7_WORK=[["one outage system",480,430],["capacity model",480,530],["switch off the unused system",480,630],["sensors",960,430],["fault prediction",960,530],["local trading",1440,430]];
scene("path",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  const tO=c("order"),tD=c("dates"),d1=w("order","capacity model comes"),d2=w("order","sensors come");
  const pd=[0,w("dates","2028"),w("dates","2033"),w("dates","after that")];
  D7_PLAT.forEach(([n,x],i)=>{const t0=w("third","plateaus")+i*0.25;if(i>0){const q=fin(t,t0-0.1,0.5);if(q>0)arrowTo(ctx,D7_PLAT[i-1][1]+150,280,x-150,280,MIG,0.8*q,{p:q,lw:3,head:12});}
    arrive(ctx,x,280,t,t0,()=>archEl(ctx,x-150,232,300,96,n,MIG,"plateau",{size:30,gs:13,hi:i>0?pulseAt(t,pd[i],1.4):0}),{dy:-12});});
  D7_WORK.forEach(([n,x,y],i)=>arrive(ctx,x,y,t,w("third","order")+0.2+i*0.18,()=>archEl(ctx,x-195,y-38,390,76,n,MIG,"gap",{size:28,gs:12,hi:(i===1?pulseAt(t,d1,1.4):0)+(i===3?pulseAt(t,d2,1.4):0)+(i===5?pulseAt(t,w("order","Trading"),1.4):0)}),{dy:-10}));
  // what depends on what
  const q1=fin(t,d1,0.7);if(q1>0)arrowTo(ctx,675,550,1440,470,TRUST,0.9*q1,{p:q1,lw:3,head:14,dash:[9,7],bend:0.25});
  const q2=fin(t,d2,0.6);if(q2>0)arrowTo(ctx,960,468,960,492,TRUST,0.9*q2,{p:q2,lw:3,head:12});
  // in the wordless moment, the organisation moves along the path, plateau by plateau
  if(t>B-0.3){const u=clamp((t-B)/3.0,0,1),seg=u*3,k=Math.min(2,Math.floor(seg)),f=ease(seg-k),x=lerp(D7_PLAT[k][1],D7_PLAT[k+1][1],f);withA(ctx,fin(t,B-0.3,0.4),()=>{glow(ctx,x,350,60,MIG,0.7);ctx.fillStyle="rgba(255,240,250,0.95)";ctx.beginPath();ctx.arc(x,352,9,0,TAU);ctx.fill();});}
  ctx.restore();
  arrive(ctx,960,780,t,tO+0.3,()=>tag(ctx,960,780,"the order: what depends on what",TRUST,{align:"center",size:30}),{dy:8});
  arrive(ctx,960,130,t,w("third","plateaus"),()=>tag(ctx,960,130,"plateaus: the steady states in between",MIG,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 9. Why, written down ---------- */
const D7_ADR=[["decided","keep the newest outage system; fold the storm tool into it",88,"Keep"],["considered","keep all three · buy a new one",88,"Considered"],["why","three systems: three versions of every outage",88,"Considered"],["decided by","Grace · October 2026",70,"Decided by"],["status","accepted",60,"Decided by"]];
scene("why",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const tL=c("later"),rows=D7_ADR.map(([k,v,h])=>[k,v,h]),rt=D7_ADR.map(([,,,word],i)=>w("outage",word)+(i===2?1.4:i===4?0.8:0)),p=rt.reduce((a,x)=>a+clamp((t-x)/0.4,0,1),0)/rt.length;
  arrive(ctx,700,420,t,0.3,()=>d7_adr(ctx,160,150,1080,"7 · one outage system",rows,{p,hi:pulseAt(t,w("later","answer"),1.6)+fin(t,w("later","answer"),0.6)*0.5}),{dy:-16});
  arrive(ctx,1560,330,t,w("later","Three years"),()=>{eaYear(ctx,1380,200,"2029",CLAY,1);sticky(ctx,1580,360,460,150,"Why was the storm tool switched off?",{col:NOTEC[1],size:30,rot:0.03});},{dy:-20});
  const q=fin(t,w("later","answer")-0.2,0.6);if(q>0)arrowTo(ctx,1350,380,1250,380,TRUST,0.9*q,{p:q,lw:3,head:14});
  arrive(ctx,1700,800,t,w("outage","Decided by")-0.3,()=>person(ctx,"grace",1790,1030,0.72,{t,pose:t>w("outage","Decided by")&&t<w("outage","Decided by")+1.8?"explain":"stand"}),{dy:20,from:0.96});
  ctx.restore();
  arrive(ctx,700,840,t,w("each","why"),()=>tag(ctx,700,840,"what was decided, what else was considered, who decided",PARCH,{align:"center",size:28}),{dy:8});
  vign(ctx,S);});

/* ---------- 10. Three drawings ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const gN=fin(t,w("confirm","Grace")+0.3,0.8),bd=fin(t,w("confirm","board"),0.5),cA=c("answer"),dn=pulseAt(t,c("done"),1.6);
  arrive(ctx,430,220,t,0.3,()=>{sticky(ctx,430,220,640,110,"today: 140 systems, placed on the map",{col:NOTEC[2],edge:APL,glass:gN,size:30,rot:0});archGlyph(ctx,"component",130,190,12,gN>0.5?APL:[40,80,120]);},{dy:-14});
  if(gN>0)withA(ctx,gN,()=>{kt_gtick(ctx,130,316,20,1);T(ctx,"confirmed · Grace",162,326,{w:700,size:28,color:rgba(TRUST,1)});});
  arrive(ctx,430,440,t,0.5,()=>sticky(ctx,430,440,640,100,"target · 2045",{col:NOTEC[1],size:30,rot:-0.01,st:0.5}),{dy:-14});
  arrive(ctx,430,580,t,0.7,()=>sticky(ctx,430,580,640,100,"path · three plateaus, with reasons",{col:NOTEC[1],size:30,rot:0.012,st:0.5}),{dy:-14});
  if(bd>0)withA(ctx,bd,()=>tag(ctx,430,690,"to the board, as drafts",MIG,{align:"center",size:28}));
  if(dn>0)[220,440,580].forEach(y=>glow(ctx,430,y,240,EAC,0.18*dn));
  person(ctx,"grace",1020,1030,0.74,{t,pose:t>w("confirm","Grace")&&t<w("confirm","Grace")+2.0?"explain":"stand"});
  person(ctx,"tomas",1820,1030,0.78,{t,pose:t>cA&&t<cA+2.2?"explain":"stand"});
  arrive(ctx,1560,140,t,0.4,()=>sticky(ctx,1560,140,500,120,"What runs it today, and where is it going?",{col:NOTEC[0],size:30,st:fin(t,cA+1.4,0.5)*0.5,rot:-0.03}),{dy:-20});
  arrive(ctx,1580,420,t,cA,()=>sticky(ctx,1580,420,500,300,"Today, placed on the map. A target, drawn as carefully. A path between them, with reasons.",{col:NOTEC[0],size:30,p:clamp((t-cA-0.2)/2.8,0,1),rot:0.015}),{dy:-30,from:1.06});
  arrive(ctx,1500,730,t,w("next","backlog"),()=>sticky(ctx,1500,730,420,130,"Which questions matter?",{col:NOTEC[0],size:32,st:0,rot:0.03}),{dy:-30,from:1.06});
  ctx.restore();vign(ctx,S);
  eaEnd(ctx,S,t,B+0.8,"Today, and where it's going",EAC,"Today, a target, and the path between: three drawings.","Film 7 of 11");});
