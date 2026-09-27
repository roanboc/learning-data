/* Style frames for Too good to be true: four stills, one per moment the script's next checkpoint names.
   Every function draws a 1920 x 1080 frame with the film's own components (../source/src/good.js); render.py saves them.
   Captions sit between y 946 and 1026, so nothing that matters goes below about y 930. */
CAPS_ON=false;
const FRAMES=[["gauge","The gauge on the painting","chapter 2 · The number and its limits"],
  ["rows-pass","The row checks pass, the gauge goes red","chapter 3 · Monday night"],
  ["three-tuesdays","Three Tuesdays","chapter 4 · Three Tuesdays"],
  ["reload","The reload","chapter 7 · Fix at the source"]];
const sc1=ctx=>{ctx.setTransform(1,0,0,1,0,0);};
// a clock chip like Silent change's, without its camera
function clock(ctx,s,sub){sc1(ctx);clockChip(ctx,1,s,sub,1);}
// the week's applications in bronze: tiles in pairs where the sync copied them twice
const pairCells=(dup,k)=>(r,c)=>{const h=hash(r*29+c,4);if(h>0.82)return null;return dup&&c%2===1&&r<k?[235,215,255]:ADM;};

/* 1 · the gauge on the painting: Monday afternoon, through Sam's screen */
function frameGauge(ctx,t){bg2(ctx);clock(ctx,"Mon 15:10","through Sam's screen");
  // Leila, on a call, and the closing-date spike she draws
  callTile(ctx,"leila",80,170,400,300,{t,expr:"calm"});
  glass(ctx,80,500,400,260,18,BIZ,{glow:12,ea:0.6,fill:"rgba(10,16,32,0.92)"});T(ctx,"Applications per night",102,538,{w:700,size:19});T(ctx,"last year",102,562,{w:500,size:15,color:rgba(SOFT,0.95)});
  const d=[1.1,0.9,1.3,1.0,1.2,0.8,1.1,1.4,1.0,1.2,5.0,1.3,1.0,1.1],bx=102,by=730,bw=356;d.forEach((v,i)=>{const hh=v*26,xx=bx+i*(bw/d.length);ctx.fillStyle=rgba(i===10?AMB:BIZ,i===10?0.95:0.55);rr(ctx,xx,by-hh,bw/d.length-6,hh,3);ctx.fill();});
  tag(ctx,bx+10*(bw/d.length)+10,by-160,"closing date · +15%",AMB,{align:"center",size:15});
  // the painting, its gauge and its plaque
  numberPainting(ctx,560,150,880,440,{num:8200,gauge:{},gaugeV:0.9});
  plaque(ctx,560,630,420,[["Data product","gold.applications_daily"],["Used by","Planning committee"]],LAYER.gold);
  // the contract card, with the line that matters lit
  appContract(ctx,1010,600,830,{hi:1,h:320});}

/* 2 · Monday night: the row checks light green one after another, while the total's gauge swings into red */
function frameRows(ctx,t){bg2(ctx);clock(ctx,"Tue 02:00","the nightly build");const y=470;
  sysCard(ctx,40,y-70,280,140,"Admissions system","sync restarted · 23:14",ADM);
  tag(ctx,180,y-110,"timeout · restart",AMB,{align:"center",size:16});
  lane(ctx,[{x:320,y},{x:380,y}],ADM,0.8);
  // copies arrive as pairs, each with a new ID
  vault(ctx,380,y-170,260,340,LAYER.bronze,pairCells(true,11),"Bronze","as it arrived");
  // the row checks, all green
  lane(ctx,[{x:640,y},{x:720,y}],ADM,0.6);gate(ctx,720,y,150,GRN,"tests");
  ["unique ID","not empty","course exists"].forEach((s,i)=>checkPill(ctx,620,y-345+i*54,s,"pass"));
  T(ctx,"row checks",720,y+110,{w:700,size:18,align:"center",color:rgba(GRN,0.95)});
  lane(ctx,[{x:750,y},{x:800,y}],[214,228,255],0.6);vault(ctx,800,y-170,240,340,LAYER.silver,(r,c)=>hash(r*7+c,3)<0.78?[214,228,255]:null,"Silver","consistent");
  // the total reaches its test, before gold
  lane(ctx,[{x:1040,y},{x:1110,y}],[214,228,255],0.6);gate(ctx,1110,y,150,RED,"tests");glow(ctx,1110,y,110,RED,0.35);
  T(ctx,"total",1110,y+110,{w:700,size:18,align:"center",color:rgba(RED,1)});
  withA(ctx,0.55,()=>vault(ctx,1180,y-170,220,340,LAYER.gold,(r,c)=>hash(r*5+c,2)<0.6?LAYER.gold:null,"Gold","not rebuilt"));
  // the way into gold is closed
  ctx.save();ctx.shadowColor=rgba(RED,0.9);ctx.shadowBlur=16;ctx.strokeStyle=rgba(RED,1);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(1160,y-60);ctx.lineTo(1160,y+60);ctx.stroke();ctx.restore();
  // the gauge, large, on the right
  glass(ctx,1440,150,440,620,24,RED,{glow:26,ea:0.9,fill:"rgba(20,8,12,0.9)"});
  T(ctx,"Applications for next year",1660,206,{w:700,size:22,align:"center"});
  T(ctx,"8,200  →  11,340",1660,262,{w:800,size:40,align:"center",f:"mono"});
  gauge(ctx,1660,500,150,38.3,{});
  T(ctx,"real growth: 40",1660,660,{w:700,size:24,align:"center",color:rgba(SOFT,1)});
  T(ctx,"error · the build stops before gold",1660,720,{w:700,size:20,align:"center",color:"rgba(255,170,160,1)"});
  // under bronze: one pair, close up
  glass(ctx,380,730,660,180,18,[170,205,255],{glow:8,ea:0.45,fill:"rgba(8,14,28,0.9)"});T(ctx,"3,100 applications, copied again with new IDs",404,768,{w:700,size:19});
  appTile(ctx,404,800,30,"A-40211 · applicant 88213 · BSc Data Science · 2027");appTile(ctx,404,852,30,"A-47988 · applicant 88213 · BSc Data Science · 2027",{dup:true});}

/* 3 · three versions of the same Tuesday, side by side */
function frameTuesdays(ctx,t){bg2(ctx);
  T(ctx,"Tuesday 10:05 · three versions",960,74,{w:800,size:30,align:"center"});
  const cols=[[40,"Version 1 · no test",SOFT],[670,"Version 2 · warning",AMB],[1300,"Version 3 · error",RED]],cw=580;
  cols.forEach(([x,label,c])=>{glass(ctx,x,110,cw,820,24,c,{glow:12,ea:0.55,fill:"rgba(10,16,32,0.7)"});tag(ctx,x+cw/2,150,label,c,{align:"center",size:20});});
  // 1 · no test: the wrong number is acted on, and three weeks later undone
  gauge(ctx,40+cw/2,300,70,38.3,{none:true});
  committeeDash(ctx,70,360,520,250,{num:11340,delta:38.3,s:0.9,crack:0.9,trend:[7240,7310,7390,7460,7520,7610,7700,7760,7840,7910,7990,8060,8200,11340]});
  board(ctx,70,640,250,["+600 places","rooms booked","tutors to hire"],GRN);
  board(ctx,340,640,250,["3 weeks later","copies found","−600 places","rooms released"],RED);
  T(ctx,"acted on a wrong number",40+cw/2,900,{w:700,size:21,align:"center",color:rgba(SOFT,1)});
  // 2 · a warning: amber, published anyway, lost among forty others
  gauge(ctx,670+cw/2,300,70,38.3,{warnOnly:true});
  committeeDash(ctx,700,360,520,250,{num:11340,delta:38.3,s:0.9,trend:[7240,7310,7390,7460,7520,7610,7700,7760,7840,7910,7990,8060,8200,11340]});
  alertChannel(ctx,700,640,300,234,40,{hi:4});
  board(ctx,1020,640,200,["+600 places","same decision"],GRN);
  T(ctx,"a note, not a brake",670+cw/2,900,{w:700,size:21,align:"center",color:"rgba(255,220,160,1)"});
  // 3 · an error: the painting keeps Monday's number, labelled; David moves the decision
  gauge(ctx,1300+cw/2,300,70,38.3,{});
  committeeDash(ctx,1330,360,520,250,{num:8200,note:true,s:0.9,noteText:"Last good data as of Mon 02:00"});
  callTile(ctx,"david",1330,640,230,230,{t,expr:"calm"});
  board(ctx,1580,640,270,["Decision","moved to Wednesday"],BIZ);
  T(ctx,"a day late, and right",1300+cw/2,900,{w:700,size:21,align:"center",color:rgba(GRN,1)});}

/* 4 · the reload: fixed at the source, the week loaded again, silver and gold rebuilt, checked with time travel */
function frameReload(ctx,t){bg2(ctx);clock(ctx,"Tue 11:30","fix at the source");const y=540;
  callTile(ctx,"rosa",40,150,280,210,{t,expr:"relieved"});
  msg(ctx,340,160,420,"Rosa → Sam","Found it: the sync restarted from Monday. Copies removed.",TECH,1);
  sysCard(ctx,40,y-70,300,140,"Admissions system","copies removed",ADM);
  // the sync, now safe to run twice
  glass(ctx,60,y+100,260,52,14,GRN,{glow:10,ea:0.8,fill:"rgba(8,24,16,0.9)"});
  ctx.save();ctx.strokeStyle=rgba(GRN,1);ctx.lineWidth=3;rr(ctx,80,y+120,22,18,4);ctx.stroke();ctx.beginPath();ctx.arc(91,y+120,7,Math.PI,0);ctx.stroke();ctx.restore();
  T(ctx,"sync: safe to run twice",116,y+134,{w:700,size:18});
  // the affected week lifts out of bronze, and pours in again from the source, once each
  const bx=440,by=y-170,bw=300,bh=340;vault(ctx,bx,by,bw,bh,LAYER.bronze,(r,c)=>r>=5&&r<=6?null:hash(r*29+c,4)<0.82?ADM:null,"Bronze","as it arrived");
  ctx.save();ctx.setLineDash([8,6]);ctx.strokeStyle=rgba(AMB,0.9);ctx.lineWidth=2;rr(ctx,bx+14,by+184,bw-28,96,10);ctx.stroke();ctx.restore();
  tag(ctx,bx+bw/2,by+bh+34,"replace one week",AMB,{align:"center",size:17});
  // the old copies leave the vault, fading
  for(let i=0;i<14;i++){const u=i/13,px=lerp(bx+30,bx+bw-10,u),py=by+bh+80+Math.sin(u*Math.PI)*40;withA(ctx,0.15+0.35*(1-u),()=>appTile(ctx,px-9,py,18,null,{col:[235,215,255],dup:true}));}
  T(ctx,"the week as it was, with the copies: replaced",bx+bw/2,by+bh+170,{w:600,size:17,align:"center",color:rgba(SOFT,0.95)});
  const pour=[{x:340,y},{x:390,y:y-10},{x:bx+60,y:by+230}];beam(ctx,pour,ADM,[[18,0.08],[7,0.25],[2.5,0.9]]);
  for(let i=0;i<5;i++){const q=at(mk(pour),0.2+i*0.16);appTile(ctx,q.x-8,q.y-8,16,null);}
  // silver and gold, rebuilt
  lane(ctx,[{x:bx+bw,y},{x:820,y}],[214,228,255],0.7);vault(ctx,820,by,240,bh,LAYER.silver,(r,c)=>hash(r*7+c,3)<0.72?[214,228,255]:null,"Silver","rebuilt");
  lane(ctx,[{x:1060,y},{x:1120,y}],LAYER.gold,0.7);vault(ctx,1120,by,240,bh,LAYER.gold,(r,c)=>hash(r*5+c,2)<0.6?LAYER.gold:null,"Gold","rebuilt");
  checkPill(ctx,830,by-120,"total: +0.5% overnight","pass",{size:17});checkPill(ctx,830,by-66,"unique: applicant + course + intake","pass",{size:17});
  // time travel: the table before and after
  T(ctx,"Time travel · silver.applications_total",1640,160,{w:700,size:20,align:"center",color:rgba(SOFT,1)});
  versionPane(ctx,1430,190,420,190,"41","Tue 02:00",11340,RED,"with the copies");
  versionPane(ctx,1430,410,420,190,"43","Tue 11:30",8240,GRN,"from the corrected source");
  T(ctx,"+40 since Monday",1640,650,{w:800,size:30,align:"center",color:rgba(GRN,1)});
  gauge(ctx,1640,820,90,0.5,{sub:"overnight change"});}

const DRAW={gauge:frameGauge,"rows-pass":frameRows,"three-tuesdays":frameTuesdays,reload:frameReload};
