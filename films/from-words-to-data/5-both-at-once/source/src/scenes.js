/* ===== Both at once: scenes =====
   Nine chapters, as in ../script.md. In 1879, a cash register records each sale and keeps the day's total: recording and counting
   in one place. Today, the app writes and the lakehouse reads a day later; hybrid databases close that distance, with two shapes
   kept in step inside one system, or an operational database inside the lakehouse. They remove the copy. They don't remove the model. */
// a moment inside a narration line: f = 0 at its first word, 1 at its last
const bo_at=(sc,id,f)=>sc.cues[id]+(sc.ends[id]-sc.cues[id])*f;

/* ---------- 1. The till that kept the total ---------- */
// the register's keys, in the picture: where the bartender's finger lands
const bo_KX=i=>1180+(-125+i*50)*1.1,BO_KY=527;
scene("till",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),at=(id,f)=>bo_at(sc,id,f),B=c("breath");histBg(ctx,S,t,{light:0.13});
  bo_saloon(ctx,t);
  // the evening passes: the wall clock runs on to closing time
  const ffS=at("total",0.62),ff=fin(t,ffS,1.3);bo_clock(ctx,1700,150,58,(8.3+t*0.01+ff*2.6)%12);
  withA(ctx,fin(t,at("total",0.8),0.5),()=>tag(ctx,1700,262,"closing time",BO_AMB,{align:"center",size:24}));
  bo_counter(ctx,t);
  // bottles and a glass on the bar
  bo_bottle(ctx,1690,700,1.05,[110,160,100],t,1);bo_bottle(ctx,1770,700,1.15,[170,100,50],t,2);
  ctx.save();const gg=ctx.createLinearGradient(1830,0,1880,0);gg.addColorStop(0,"rgba(220,235,255,0.35)");gg.addColorStop(0.5,"rgba(220,235,255,0.1)");gg.addColorStop(1,"rgba(220,235,255,0.3)");ctx.fillStyle=gg;ctx.beginPath();ctx.moveTo(1832,640);ctx.quadraticCurveTo(1834,690,1840,700);ctx.lineTo(1874,700);ctx.quadraticCurveTo(1880,690,1882,640);ctx.closePath();ctx.fill();
  ctx.fillStyle="rgba(210,150,60,0.55)";ctx.beginPath();ctx.moveTo(1835,668);ctx.quadraticCurveTo(1857,672+2*Math.sin(t*2),1879,668);ctx.quadraticCurveTo(1878,690,1872,698);ctx.lineTo(1842,698);ctx.quadraticCurveTo(1836,690,1835,668);ctx.fill();ctx.restore();
  yearTag(ctx,120,90,"1879 · Dayton, Ohio",CLAY,fin(t,0.4,0.6));
  // the patent
  bo_patent(ctx,1450,300,420,290,fin(t,at("ritty",0.42),0.7)*(1-fin(t,c("total")+0.4,0.8)),0.03);
  // the sales, rung up one by one; then the rest of the evening, faster; then the day's total, read at closing time
  const sales=[[at("ritty",0.8),0,5],[at("total",0.22),1,10],[at("total",0.33),3,25],[at("total",0.44),2,15],[at("total",0.55),4,50]];
  let last=null,tot=0;sales.forEach(sl=>{if(t>=sl[0]-0.12){last=sl;}if(t>=sl[0]+0.25)tot+=sl[2];});
  let press=last?[last[1],pulseAt(t,last[0]-0.08,0.36)]:null,tab=last&&t>=last[0]?BO_KEYS[last[1]]:(last&&sales.indexOf(last)>0?BO_KEYS[sales[sales.indexOf(last)-1][1]]:null),pop=last?fin(t,last[0],0.3):0;
  let fk=-1;if(ff>0&&ff<1){const j=Math.floor(t*9),u=t*9-j;fk=j%6;press=[fk,u>0.35&&u<0.85?Math.sin(Math.PI*(u-0.35)/0.5):0];tab=BO_KEYS[fk];pop=1;}
  tot+=Math.round((3845-105)*ease(ff)/5)*5;
  const wT=c("wish"),rec=fin(t,wT,0.5),cnt=fin(t,at("wish",0.22),0.5),one=fin(t,at("wish",0.34),0.6);
  bo_register(ctx,1180,700,1.1,{t,press,tab,pop,total:tot,hi:pulseAt(t,at("ritty",0.84),1.4)+0.6*one,keysHi:rec,tabHi:rec,dialHi:Math.max(cnt,pulseAt(t,at("total",0.8),1.6)),totHi:cnt+fin(t,at("total",0.8),0.4)*(1-fin(t,wT-0.2,0.4))});
  // the bartender's hand: it comes in, rings up each sale, taps through the evening, and leaves at closing
  // between presses it drops back, below the total, so the running total stays in view
  const wp=[[sales[0][0]-1.4,-160,600]];sales.forEach(([ts,k])=>{wp.push([ts-0.28,bo_KX(k),BO_KY-14]);wp.push([ts+0.12,bo_KX(k),BO_KY-10]);wp.push([ts+0.5,bo_KX(k)-90,BO_KY+100]);});
  wp.push([ffS-0.25,bo_KX(1),BO_KY-14]);wp.push([ffS+1.35,bo_KX(3),BO_KY-14]);wp.push([ffS+1.9,bo_KX(1)-90,BO_KY+110]);wp.push([wT-0.6,bo_KX(1)-96,BO_KY+112]);wp.push([wT+0.3,-220,620]);
  let hx=wp[0][1],hy=wp[0][2];for(let i=0;i<wp.length-1;i++){if(t>=wp[i][0]&&t<wp[i+1][0]){const u=ease((t-wp[i][0])/(wp[i+1][0]-wp[i][0]));hx=lerp(wp[i][1],wp[i+1][1],u);hy=lerp(wp[i][2],wp[i+1][2],u);}}if(t>=wp[wp.length-1][0]){hx=wp[wp.length-1][1];hy=wp[wp.length-1][2];}
  if(fk>=0){const j=Math.floor(t*9),u=t*9-j,kp=(j+5)%6;hx=lerp(bo_KX(kp),bo_KX(fk),ease(Math.min(1,u*3)));hy=BO_KY-14;}
  if(press&&press[1]>0&&Math.abs(hx-bo_KX(press[0]))<30)hy=BO_KY-2+9*press[1];else if(press&&press[1]>0)hy+=0;
  hy+=Math.sin(t*1.7)*2.5;bo_hand(ctx,hx,hy,1.1,t,1);
  withA(ctx,fin(t,at("ritty",0.84),0.5)*(1-fin(t,c("total"),0.6)),()=>tag(ctx,1180,790,"the cash register",BO_BRASS,{align:"center",size:28}));
  // recording and counting, in one place
  withA(ctx,rec,()=>{tag(ctx,470,470,"recording: each sale",BO_W,{size:28});arrowTo(ctx,830,462,1050,300,BO_W,0.9,{bend:-0.15,head:16});arrowTo(ctx,830,482,1030,550,BO_W,0.9,{bend:0.1,head:16});});
  withA(ctx,cnt,()=>{tag(ctx,1400,470,"counting: the day's total",BO_R,{size:28});arrowTo(ctx,1390,466,1250,420,BO_R,0.9,{head:16});});
  withA(ctx,one,()=>{ctx.save();ctx.strokeStyle=rgba(BO_ACC,0.9);ctx.lineWidth=3;ctx.shadowColor=rgba(BO_ACC,0.9);ctx.shadowBlur=16;ctx.setLineDash([12,10]);ctx.lineDashOffset=-t*20;rr(ctx,970,110,420,606,26);ctx.stroke();ctx.restore();
    tag(ctx,1180,110,"in one place",BO_ACC,{align:"center",size:26});});
  seriesTitle(ctx,S,t,B,"Both at once","one database that writes and reads",BO_ACC);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. The distance ---------- */
scene("distance",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),at=(id,f)=>bo_at(sc,id,f);setScreen(ctx,S);bg2(ctx);
  const ap=fin(t,c("apart")+0.1,0.7),wr=clamp((t-c("path")-0.2)/2.2,0,1);
  // writing: the app and its own database
  withA(ctx,ap,()=>{tag(ctx,350,196,"writing",BO_W,{align:"center",size:26});bo_phone(ctx,105,370,1.0,{screen:"issue",press:Math.sin(t*6)>0.6&&wr>0&&wr<1});
    bo_store(ctx,205,240,290,260,"rows",{title:"the app's database",ts:23,n:6,p:0.4+0.6*wr,t,hi:pulseAt(t,c("path")+0.2,1.4)});
    if(wr>0)packets(ctx,t,[P(165,370),P(210,370)],0.45,0.5,c("path"),BO_W,13,1,c("path")+2.3);});
  // reading: the answer, far away
  const sunA=fin(t,at("path",0.86),0.8);
  withA(ctx,ap,()=>{tag(ctx,1650,196,"reading",BO_R,{align:"center",size:26});bo_answer(ctx,1460,240,380,260,"the answer",sunA>0.5?"ready tomorrow":"…",BO_R,t,0.35+0.65*sunA);});
  withA(ctx,ap*(1-fin(t,c("path"),0.8)),()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.45);ctx.lineWidth=2;ctx.setLineDash([6,12]);ctx.beginPath();ctx.moveTo(510,370);ctx.lineTo(1445,370);ctx.stroke();ctx.restore();tag(ctx,975,370,"apart",SOFT,{align:"center",size:24});});
  // overnight, a copy travels to the lakehouse and gets refined
  const mo=fin(t,at("path",0.3),0.8);bo_moon(ctx,605,118,40,mo*(1-0.5*sunA),t);
  withA(ctx,mo,()=>T(ctx,"overnight",605,206,{w:700,size:22,align:"center",color:rgba([190,205,255],1)}));
  const cp0=at("path",0.36);if(t>cp0-0.1)packets(ctx,t,bez(P(495,370),P(560,250),P(660,250),P(722,370),24),0.3,1.2,cp0,BO_W,17,1,cp0+2.2);
  const lit=[fin(t,at("path",0.5),0.6),fin(t,at("path",0.62),0.6),fin(t,at("path",0.74),0.6)],la=fin(t,at("path",0.4),0.7);
  bo_lake(ctx,742,262,200,260,24,{a:la,lit});
  if(t>at("path",0.55))packets(ctx,t,[P(942,440),P(966,440)],0.35,0.4,at("path",0.55),LAYER.bronze,11,la,at("path",0.72));
  if(t>at("path",0.67))packets(ctx,t,[P(1166,440),P(1190,440)],0.35,0.4,at("path",0.67),LAYER.silver,11,la,at("path",0.84));
  bo_sun(ctx,1650,104,32,t,sunA);
  // but some questions can't wait
  const eA=fin(t,at("now",0.18),0.6),wA=fin(t,at("now",0.44),0.6),wait=fin(t,at("now",0.05),0.6);
  withA(ctx,wait,()=>{glow(ctx,1650,370,220,BO_AMB,0.12+0.06*Math.sin(t*3));T(ctx,"tomorrow, 06:00",1650,538,{f:"mono",w:500,size:24,align:"center",color:rgba(BO_AMB,1)});});
  withA(ctx,eA,()=>{glass(ctx,160,642,620,170,20,BO_AMB,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});ICON.uni(ctx,208,688);T(ctx,"An employer",250,696,{w:800,size:28});T(ctx,"Is award A-1042 still valid?",190,744,{w:600,size:24,color:rgba(SOFT,1)});
    T(ctx,"now?",190,792,{w:800,size:30,color:rgba(BO_AMB,1)});T(ctx,"the check reads last night's copy",282,790,{w:600,size:20,color:rgba(SOFT,0.9)});bo_hourglass(ctx,720,726,1.5,(t-at("now",0.18))/13,BO_AMB,1,t);
    arrowTo(ctx,780,690,1540,560,BO_AMB,0.55,{bend:-0.12,dash:[8,10],p:fin(t,at("now",0.24),0.8),nohead:true});});
  withA(ctx,wA,()=>{glass(ctx,860,642,740,170,20,TRUST,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(ctx,"Aisha's wallet",890,696,{w:800,size:28});
    for(let i=0;i<4;i++){const on=i<2;ctx.fillStyle=on?rgba(TRUST,0.9):"rgba(160,190,240,0.1)";rr(ctx,1120+i*46,668,38,42,6);ctx.fill();if(!on){ctx.strokeStyle="rgba(160,190,240,0.45)";ctx.lineWidth=1.4;rr(ctx,1120+i*46,668,38,42,6);ctx.stroke();}}
    T(ctx,"2 of 4 microcredentials towards a graduate certificate",890,746,{w:600,size:23,color:rgba(SOFT,1)});T(ctx,"now?",890,794,{w:800,size:30,color:rgba(BO_AMB,1)});bo_hourglass(ctx,1540,690,1.5,(t-at("now",0.44))/13,BO_AMB,1,t);
    arrowTo(ctx,1480,642,1620,560,BO_AMB,0.55,{bend:0.1,dash:[8,10],p:fin(t,at("now",0.5),0.8),nohead:true});});
  // that distance
  bo_span(ctx,350,1650,600,BO_ACC,"the distance",fin(t,c("appeal")+0.2,0.6),fin(t,c("appeal")+0.2,1.2));
  vign(ctx,S);});

/* ---------- 3. Two engines, one place ---------- */
scene("engines",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),at=(id,f)=>bo_at(sc,id,f);setScreen(ctx,S);bg2(ctx);
  const L=c("lake"),aA=1-fin(t,L-0.6,0.7),bA=fin(t,L-0.2,0.8);
  // one database, two stores inside it: rows for writing, columns for reading, kept in step
  withA(ctx,aA,()=>{const oa=fin(t,c("one")-0.2,0.8),sp=fin(t,at("two",0.1),1.1);
    withA(ctx,oa,()=>{glow(ctx,960,480,520,BO_ACC,0.08);glass(ctx,510,150,900,660,34,BO_ACC,{glow:30,ea:0.85,fill:"rgba(8,16,30,0.7)"});dbGlyph(ctx,590,210,BO_ACC,0.9);T(ctx,"one database",630,222,{w:800,size:34,color:rgba(BO_ACC,1)});
      tag(ctx,230,300,"the app writes",BO_W,{align:"center",size:26});bo_phone(ctx,230,470,1.1,{screen:"issue",press:Math.sin(t*5)>0.5});
      tag(ctx,1680,300,"a report reads",BO_R,{align:"center",size:26});bo_answer(ctx,1520,370,320,210,"the report",null,BO_R,t,1);});
    const rx=lerp(760,560,sp),cx=lerp(760,1010,sp),rH=pulseAt(t,at("two",0.34),1.4),cH=pulseAt(t,at("two",0.52),1.4);
    bo_store(ctx,rx,270,350,470,"rows",{a:oa,n:8,t,hi:rH,title:sp>0.5?"rows":null,sub:sp>0.5?"for writing":null,ts:34,ss:24});
    bo_store(ctx,cx,270,350,470,"cols",{a:oa*(0.55+0.45*sp),n:7,t,hi:cH,title:sp>0.5?"columns":null,sub:sp>0.5?"for reading":null,ts:34,ss:24});
    withA(ctx,fin(t,at("two",0.08),0.6),()=>tag(ctx,1250,212,"two shapes inside",BO_ACC,{align:"center",size:24}));
    if(oa>0.5){packets(ctx,t,[P(300,470),P(rx+4,470)],0.5,0.9,0,BO_W,13,oa);packets(ctx,t,[P(cx+346,480),P(1516,480)],0.6,0.9,0.3,BO_R,13,oa);}
    const ks=fin(t,at("two",0.62),0.6);if(ks>0){arrowTo(ctx,914,470,1004,470,BO_ACC,ks,{head:16,lw:3});[560,620,680].forEach((y,i)=>packets(ctx,t,[P(912,y),P(1008,y)],0.7,0.6,at("two",0.62)+i*0.23,BO_ACC,11,ks));
      withA(ctx,ks,()=>tag(ctx,960,770,"kept in step, by the database",BO_ACC,{align:"center",size:26}));}});
  // or: an operational database inside the lakehouse, tables synced both ways
  withA(ctx,bA,()=>{ctx.save();ctx.strokeStyle="rgba(170,200,245,0.3)";ctx.lineWidth=1.8;ctx.setLineDash([10,8]);rr(ctx,450,270,1400,560,28);ctx.stroke();ctx.restore();tag(ctx,1150,270,"the lakehouse",[214,228,255],{align:"center",size:26});
    bo_phone(ctx,220,540,1.1,{screen:"issue",press:Math.sin(t*5)>0.5});tag(ctx,220,380,"the app writes",BO_W,{align:"center",size:26});packets(ctx,t,[P(290,540),P(484,540)],0.5,0.8,0,BO_W,13,1);
    const oa=fin(t,at("lake",0.12),0.7);bo_store(ctx,490,340,300,400,"rows",{a:oa,title:"operational",sub:"database",ts:30,ss:24,n:6,t,hi:pulseAt(t,at("lake",0.2),1.4)});
    bo_lake(ctx,910,380,284,320,30,{a:fin(t,at("lake",0.3),0.7),frame:false});
    const sy=fin(t,at("lake",0.7),0.6);if(sy>0){arrowTo(ctx,796,420,900,420,BO_W,sy,{head:14});packets(ctx,t,[P(796,440),P(906,440)],0.5,0.6,at("lake",0.7),BO_W,12,sy);
      ctx.save();ctx.globalAlpha*=sy;ctx.strokeStyle=rgba(BO_M,0.8);ctx.lineWidth=2.4;ctx.setLineDash([8,8]);ctx.lineDashOffset=t*30;ctx.beginPath();ctx.moveTo(1678,704);ctx.lineTo(1678,770);ctx.lineTo(640,770);ctx.lineTo(640,746);ctx.stroke();ctx.restore();
      arrowTo(ctx,640,768,640,748,BO_M,sy,{head:14});packets(ctx,t,[P(1678,704),P(1678,770),P(640,770),P(640,748)],0.45,1.6,at("lake",0.72),BO_M,12,sy);
      withA(ctx,fin(t,at("lake",0.78),0.5),()=>tag(ctx,1160,770,"synced both ways",BO_ACC,{align:"center",size:26}));}});
  // the name
  const hA=fin(t,at("htap",0.3),0.6);bo_capsule(ctx,290,64,0.54,t,hA);withA(ctx,hA,()=>{ctx.save();ctx.strokeStyle=rgba(BO_ACC,0.6);ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(530,145);ctx.lineTo(560,145);ctx.stroke();ctx.restore();glass(ctx,560,70,800,150,24,BO_ACC,{glow:22,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(ctx,"HTAP",960,140,{w:800,size:60,align:"center",color:rgba(BO_ACC,1)});
    const ex=fin(t,at("htap",0.45),0.8),parts=[["hybrid ",INK],["transactional",BO_W],[" and ",INK],["analytical",BO_R],[" processing",INK]],full=parts.map(p=>p[0]).join(""),wT=tw(ctx,full,26,700);
    withA(ctx,ex,()=>{let x=960-wT/2;parts.forEach(([s,col])=>{T(ctx,s,x,192,{w:700,size:26,color:rgba(col,1)});x+=tw(ctx,s,26,700);});});});
  vign(ctx,S);});

/* ---------- 4. Keeping two shapes in step ---------- */
const BO_LOG=[[1,"issue A-1042","A-1042"],[2,"update email","L-207"],[3,"revoke A-1042","A-1042"]];
scene("sync",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),at=(id,f)=>bo_at(sc,id,f),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const sa=fin(t,0.3,0.8),ch=[at("capture",0.26),at("capture",0.36),at("capture",0.46)],ap=[at("capture",0.44),at("capture",0.56),at("capture",0.68)];
  const kT=c("keys"),oT=c("order"),kh=fin(t,at("keys",0.24),0.5),upd=pulseAt(t,at("keys",0.4),2.4),del=at("keys",0.62),delA=at("keys",0.78),keyHi=kh*(0.6+0.4*Math.sin(t*3))*(1-fin(t,oT,0.8));
  // the three boxes sit in the middle, and rise to make room for the two orders
  const dy=lerp(130,0,ease(fin(t,oT-0.9,1.2)));ctx.save();ctx.translate(0,dy);
  // the rows: where the app writes
  withA(ctx,sa,()=>{glass(ctx,40,130,580,380,20,BO_W,{glow:16,ea:0.8,fill:"rgba(7,12,24,0.93)"});T(ctx,"rows",68,182,{w:800,size:32,color:rgba(BO_W,1)});T(ctx,"the app writes here",162,182,{w:600,size:22,color:rgba(SOFT,1)});
    T(ctx,"learners",68,230,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});T(ctx,"awards",68,322,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});
    const em=t>ch[1]?"aisha@work":"aisha@mail";bo_row(ctx,60,242,540,"L-207",["Aisha K.",em],{hi:pulseAt(t,ch[1],1.0)+upd,keyHi:keyHi+upd});
    bo_row(ctx,60,334,540,"A-1041",["L-150","issued"],{a:1-fin(t,del+0.3,0.6),hi:pulseAt(t,del,1.0),bad:t>del,keyHi});bo_strike(ctx,68,356,592,356,fin(t,del,0.4),BAD,1-fin(t,del+0.3,0.6));
    const rv=t>ch[2];bo_row(ctx,60,388,540,"A-1042",["L-207",rv?"revoked":"issued"],{a:fin(t,ch[0],0.4),hi:pulseAt(t,ch[0],1.0)+pulseAt(t,ch[2],1.0),keyHi,vc:[null,rv?BAD:null]});});
  // the columns: the reading side
  withA(ctx,sa,()=>{glass(ctx,1300,130,580,380,20,BO_R,{glow:16,ea:0.8,fill:"rgba(7,12,24,0.93)"});T(ctx,"columns",1328,182,{w:800,size:32,color:rgba(BO_R,1)});T(ctx,"the reading side",1478,182,{w:600,size:22,color:rgba(SOFT,1)});
    const a1=fin(t,ap[0],0.4),gone=1-fin(t,delA,0.6),st=t>ap[2]?"revoked":"issued",em=t>ap[1]?"aisha@work":"aisha@mail";
    T(ctx,"learners",1328,224,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});T(ctx,"awards",1328,354,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});
    const cw=177,X=i=>1316+i*(cw+8);
    bo_colStripe(ctx,X(0),234,cw,90,"learner",[{key:"L-207",keyHi:keyHi+upd}]);
    bo_colStripe(ctx,X(1),234,cw,90,"name",[{t:"Aisha K."}]);
    bo_colStripe(ctx,X(2),234,cw,90,"email",[{t:em,hi:pulseAt(t,ap[1],1)+upd*0.6}]);
    bo_colStripe(ctx,X(0),364,cw,134,"award",[{key:"A-1041",a:gone,hi:pulseAt(t,delA-0.2,0.8),hc:BAD,keyHi},{key:"A-1042",a:a1,keyHi}],{gap:40});
    bo_colStripe(ctx,X(1),364,cw,134,"learner",[{t:"L-150",a:gone},{t:"L-207",a:a1}],{gap:40});
    bo_colStripe(ctx,X(2),364,cw,134,"status",[{t:"issued",a:gone},{t:st,a:a1,c:t>ap[2]?BAD:null,hi:pulseAt(t,ap[0],1)+pulseAt(t,ap[2],1)}],{gap:40});});
  // the change log, in order
  withA(ctx,sa,()=>{glass(ctx,660,130,600,380,20,BO_ACC,{glow:14,ea:0.7,fill:"rgba(7,12,24,0.9)"});T(ctx,"change log",686,182,{w:800,size:32,color:rgba(BO_ACC,1)});T(ctx,"in order",870,182,{w:600,size:22,color:rgba(SOFT,1)});
    BO_LOG.forEach(([n,s,id],i)=>{const a=fin(t,ch[i]+0.25,0.4),x=lerp(610,680,ease(fin(t,ch[i]+0.25,0.5))),y=210+i*70,ord=pulseAt(t,at("capture",0.8)+i*0.35,0.8);
      if(a>0.02&&a<0.98)arrowTo(ctx,600,y+28,x,y+28,BO_W,a,{nohead:true,lw:3});
      bo_change(ctx,x,y,500,n,s,id,{a,hi:ord+pulseAt(t,ap[i],0.9)+(i===1?upd:0),keyHi:keyHi+(i===1?upd:0)});
      if(t>ap[i]){tick_(ctx,x+535,y+28,30,GOOD,fin(t,ap[i],0.3));const u=clamp((t-ap[i])/0.5,0,1);if(u<1)arrowTo(ctx,1200,y+28,1310,y+28,BO_R,1-u,{p:u*2,head:12});}});
    const dA=fin(t,del+0.2,0.4)*(1-fin(t,oT-0.4,0.6));if(dA>0){bo_change(ctx,680,420,500,4,"delete A-1041","A-1041",{a:dA,dash:true,keyHi,hi:pulseAt(t,delA-0.3,0.9)});if(t>delA)tick_(ctx,1215,448,30,GOOD,fin(t,delA,0.3));}
    withA(ctx,fin(t,at("capture",0.8),0.6)*(1-fin(t,kT,0.5)),()=>tag(ctx,960,470,"1, 2, 3: the same order on both sides",BO_ACC,{align:"center",size:22}));});
  // a stable key: an update and a delete find their rows
  withA(ctx,kh*(1-fin(t,oT-0.9,0.6)),()=>tag(ctx,960,580,"every row has a stable key",TRUST,{align:"center",size:26}));
  if(upd>0.02){ctx.save();ctx.globalAlpha*=upd;ctx.strokeStyle=rgba(bo_kc("L-207"),0.9);ctx.lineWidth=2.6;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(1144,308);ctx.bezierCurveTo(900,250,500,300,84,264);ctx.moveTo(1144,308);ctx.bezierCurveTo(1230,320,1290,302,1326,302);ctx.stroke();ctx.restore();
    withA(ctx,upd,()=>tag(ctx,960,646,"an update finds the row it changes",bo_kc("L-207"),{align:"center",size:24}));}
  const dp=pulseAt(t,del,2.2);if(dp>0.02){ctx.save();ctx.globalAlpha*=dp;ctx.strokeStyle=rgba(bo_kc("A-1041"),0.9);ctx.lineWidth=2.6;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(1144,448);ctx.bezierCurveTo(900,430,400,420,84,356);ctx.moveTo(1144,448);ctx.bezierCurveTo(1230,452,1290,432,1326,432);ctx.stroke();ctx.restore();
    withA(ctx,dp,()=>tag(ctx,960,712,"a delete finds the row it removes",bo_kc("A-1041"),{align:"center",size:24}));}
  ctx.restore();
  // the wrong order, then the right one
  const wA=fin(t,oT+0.1,0.6),w1=fin(t,at("order",0.1),0.4),w2=fin(t,at("order",0.26),0.4),gh=fin(t,at("order",0.42),0.5),rA=fin(t,at("order",0.62),0.6),r1=fin(t,at("order",0.66),0.4),r2=fin(t,at("order",0.76),0.4),ok=fin(t,at("order",0.86),0.5);
  withA(ctx,wA,()=>{glass(ctx,110,540,830,300,22,BAD,{glow:14,ea:0.7,fill:"rgba(20,8,12,0.9)"});T(ctx,"wrong order",140,590,{w:800,size:30,color:rgba(BAD,1)});
    bo_change(ctx,140,618,380,3,"revoke A-1042","A-1042",{a:w1,bad:true});bo_change(ctx,140,692,380,1,"issue A-1042","A-1042",{a:w2});
    withA(ctx,w1*(1-w2),()=>T(ctx,"no row to revoke yet",736,690,{w:600,size:22,align:"center",color:rgba(SOFT,1)}));
    bo_ghost(ctx,570,630,340,110,t,gh,"A-1042 · issued","back to life");
    withA(ctx,gh,()=>T(ctx,"a revoked award, valid again",525,812,{w:700,size:22,align:"center",color:rgba(BAD,1)}));});
  withA(ctx,rA,()=>{glass(ctx,980,540,830,300,22,GOOD,{glow:14,ea:0.7,fill:"rgba(7,20,14,0.9)"});T(ctx,"right order",1010,590,{w:800,size:30,color:rgba(GOOD,1)});
    bo_change(ctx,1010,618,380,1,"issue A-1042","A-1042",{a:r1});bo_change(ctx,1010,692,380,3,"revoke A-1042","A-1042",{a:r2});
    withA(ctx,ok,()=>{glass(ctx,1430,630,340,110,16,GOOD,{glow:18+8*Math.sin(t*2.4),ea:0.9,fill:"rgba(7,12,24,0.95)"});T(ctx,"A-1042 · revoked",1600,676,{w:800,size:25,align:"center"});T(ctx,"order matters",1600,714,{w:600,size:21,align:"center",color:rgba(GOOD,1)});tick_(ctx,1752,648,30,GOOD,1);});});
  withA(ctx,fin(t,B,0.6),()=>glow(ctx,1600,685,230,GOOD,0.12+0.06*Math.sin(t*2)));
  vign(ctx,S);});

/* ---------- 5. What it removes ---------- */
const BO_GONE=[["the nightly copy","moon"],["the pipelines","pipe"],["the wait","wait"],["a second set of permissions","lock"]];
scene("removes",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),at=(id,f)=>bo_at(sc,id,f);setScreen(ctx,S);bg2(ctx);
  const named=[at("gone",0.1),at("gone",0.28),at("gone",0.5),at("gone",0.62)],e0=at("gone",1.0),go=fin(t,e0+0.1,0.6),col_=fin(t,e0+0.5,1.3),rl=fin(t,c("real")+0.1,0.6);
  // the two ends come together as what sat between them goes
  const lx=lerp(90,560,ease(col_)),rx=lerp(1570,1100,ease(col_)),sa=fin(t,0.2,0.7);
  withA(ctx,fin(t,e0+1.0,0.8),()=>{glow(ctx,960,480,460,BO_ACC,0.08);glass(ctx,520,230,880,480,30,BO_ACC,{glow:26,ea:0.85,fill:"rgba(8,16,30,0.6)"});T(ctx,"one place",960,284,{w:800,size:34,align:"center",color:rgba(BO_ACC,1)});});
  bo_store(ctx,lx,320,260,360,"rows",{a:sa,title:"writing",ts:30,n:6,t,col:BO_W});bo_store(ctx,rx,320,260,360,"cols",{a:sa,title:"reading",ts:30,n:6,t,col:BO_R});
  BO_GONE.forEach(([s,k],i)=>{const x=400+i*285,y=340,a=fin(t,named[i],0.5)*(1-go),st=fin(t,named[i]+0.9,0.4);if(a<=0.01)return;
    withA(ctx,a,()=>{glass(ctx,x,y,250,320,20,[200,215,240],{glow:10,ea:0.6,fill:"rgba(7,12,24,0.93)"});const cx=x+125,cy=y+110;
      withA(ctx,1-0.4*st,()=>{if(k==="moon"){bo_moon(ctx,cx-30,cy-10,32,1,t);for(let j=0;j<3;j++){ctx.fillStyle=rgba(BO_W,0.9);rr(ctx,cx+12+j*20,cy+6-j*12,14,14,3);ctx.fill();}}
        if(k==="pipe"){ctx.save();ctx.strokeStyle=rgba(INK,0.9);ctx.lineWidth=10;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx-75,cy+22);ctx.lineTo(cx-22,cy+22);ctx.lineTo(cx-22,cy-22);ctx.lineTo(cx+32,cy-22);ctx.lineTo(cx+32,cy+22);ctx.lineTo(cx+75,cy+22);ctx.stroke();ctx.restore();packets(ctx,t,[P(cx-75,cy+22),P(cx-22,cy+22),P(cx-22,cy-22),P(cx+32,cy-22),P(cx+32,cy+22),P(cx+75,cy+22)],0.4,1.4,0,BO_W,11,1);}
        if(k==="wait")bo_hourglass(ctx,cx,cy,2.1,(t-named[2]+1)/7,BO_AMB,1,t);
        if(k==="lock"){bo_lock(ctx,cx-32,cy,1.8,BO_W);bo_lock(ctx,cx+32,cy,1.8,BO_R);}});
      wrapT(ctx,s,cx,y+236,220,{w:700,size:25,align:"center",lh:31});
      cross_(ctx,cx,cy,84*ease(st),SOFT,0.7*st);});});
  withA(ctx,rl,()=>{tag(ctx,940,790,"real gains",GOOD,{align:"center",size:36});tick_(ctx,1070,790,40,GOOD,1);});
  vign(ctx,S);});

/* ---------- 6. What it doesn't ---------- */
const BO_AW=[["A-0977","Science","issued"],["A-0981","Science","revoked"],["A-0990","Science","issued"],["A-1002","Science","issued"],["A-1042","Science","revoked"],["A-1057","Arts","issued"]];
scene("doesnt",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),at=(id,f)=>bo_at(sc,id,f);setScreen(ctx,S);bg2(ctx);
  const ta=fin(t,0.3,0.7),rvT=at("revoked",0.02),rv=fin(t,rvT,0.5),owT=at("revoked",0.42),ow=fin(t,owT,0.6),wr=at("revoked",0.74),mT=c("model"),dimT=at("model",0.48),dim=fin(t,dimT,0.6),tg=fin(t,dimT+0.4,0.7);
  withA(ctx,1-0.85*dim,()=>{
    // the app's own table
    withA(ctx,ta,()=>{glass(ctx,60,110,800,450,20,BO_W,{glow:16,ea:0.8,fill:"rgba(7,12,24,0.93)"});T(ctx,"awards",88,160,{w:800,size:32,color:rgba(BO_W,1)});T(ctx,"the app's own table, today",214,160,{w:600,size:22,color:rgba(SOFT,1)});
      const hx0=128,hx1=hx0+tw(ctx,"A-0977",21,500,"mono")+20,hx2=hx1+tw(ctx,"Science",21,500,"mono")+20;
      [["award",hx0],["faculty",hx1],["status",hx2]].forEach(([s_,x])=>T(ctx,s_,x,202,{f:"mono",w:500,size:18,color:rgba(SOFT,1)}));
      BO_AW.forEach(([id,f,st],i)=>{const y=214+i*54,isR=st==="revoked",isO=id==="A-0990";
        bo_row(ctx,80,y,760,id,[f.padEnd(7),st],{hi:isR?pulseAt(t,rvT,1.2):isO?pulseAt(t,owT,1.2):0,hiCol:isR?BAD:BO_AMB,bad:isR&&rv>0.5,vc:[isO&&ow>0.3?BO_AMB:null,isR&&rv>0.3?BAD:null]});
        if(isR)withA(ctx,rv,()=>tag(ctx,560,y+22,"revoked, still in there",BAD,{size:19}));
        if(isO)withA(ctx,ow,()=>{T(ctx,"Health",530,y+29,{f:"mono",w:500,size:21,color:rgba(SOFT,0.85)});bo_strike(ctx,526,y+22,612,y+22,1,SOFT,0.85);tag(ctx,630,y+22,"overwritten",BO_AMB,{size:19});});});});
    // counted straight from it
    const qa=fin(t,at("direct",0.4),0.6);arrowTo(ctx,870,330,1080,330,BO_W,qa,{dash:[8,8],head:14,p:fin(t,at("direct",0.4),0.9)});
    withA(ctx,qa,()=>T(ctx,"count",975,312,{f:"mono",w:500,size:21,align:"center",color:rgba(SOFT,1)}));
    withA(ctx,fin(t,at("direct",0.6),0.6),()=>{glass(ctx,1090,110,640,420,22,[200,215,240],{glow:14,ea:0.7,fill:"rgba(7,12,24,0.94)"});T(ctx,"Science awards, last year",1120,164,{w:700,size:28,color:rgba(SOFT,1)});
      const n=t<wr?"…":fmtNum(countTo(t,wr,0,131)),gl=t>wr+1?pulseAt(t,wr+1,0.5):0;ctx.save();ctx.translate(gl*6*Math.sin(t*60),0);T(ctx,n,1120,294,{w:800,size:116,color:rgba(t>wr+0.9?BAD:INK,1)});ctx.restore();
      withA(ctx,fin(t,wr+1.0,0.4),()=>{cross_(ctx,1430,254,54,BAD,1);T(ctx,"counted straight from the app",1120,336,{w:600,size:22,color:rgba(BAD,1)});});
      withA(ctx,fin(t,wr+1.8,0.5),()=>{ctx.strokeStyle="rgba(170,200,245,0.2)";ctx.beginPath();ctx.moveTo(1116,366);ctx.lineTo(1704,366);ctx.stroke();T(ctx,"118",1120,448,{w:800,size:70,color:rgba(GOOD,1)});tick_(ctx,1282,424,38,GOOD,1);
        T(ctx,"the right count",1330,420,{w:700,size:24,color:rgba(GOOD,1)});T(ctx,"131 − 9 revoked",1330,456,{f:"mono",w:500,size:19,color:rgba(SOFT,1)});T(ctx,"− 4 not Science then",1330,484,{f:"mono",w:500,size:19,color:rgba(SOFT,1)});});});
    // the same mistake: counting today, instead of on census date
    const sA=fin(t,at("same",0.1),0.6);withA(ctx,sA,()=>{bo_cal(ctx,1090,570,"counted","28 Sep","today",BAD,1,pulseAt(t,at("same",0.4),1.2));bo_cal(ctx,1430,570,"counted","31 Mar","census date",GOOD,1,pulseAt(t,at("same",0.8),1.2));
      T(ctx,"≠",1410,640,{w:800,size:40,align:"center",color:rgba(BAD,1)});T(ctx,"enrolments: counted today,",1410,728,{w:700,size:23,align:"center",color:rgba(SOFT,1)});T(ctx,"not on census date",1410,758,{w:700,size:23,align:"center",color:rgba(SOFT,1)});});});
  // what still needs modelling
  [["history","status and faculty, with their dates"],["shared dimensions","Faculty, Time"],["definitions","an award: issued, not revoked"]].forEach(([s_,sub],i)=>{const a=fin(t,mT+[0.1,0.7,1.9][i],0.5);
    withA(ctx,a,()=>chip(ctx,[70,70,70][i],[620,706,792][i],null,s_,sub,{edge:KIND,ts:26,ss:20}));});
  // the lesson
  withA(ctx,tg,()=>{glow(ctx,960,430,520,BO_ACC,0.1);const y=440;
    const p1="Hybrid removes ",p2="the copy",p3=", not the model.",w1=tw(ctx,p1,62,800),w2=tw(ctx,p2,62,800),w3=tw(ctx,p3,62,800),x0=960-(w1+w2+w3)/2;
    T(ctx,p1,x0,y,{w:800,size:62});T(ctx,p2,x0+w1,y,{w:800,size:62,color:rgba(SOFT,0.75)});bo_strike(ctx,x0+w1-4,y-20,x0+w1+w2+4,y-20,fin(t,at("model",0.72),0.5),SOFT,0.9);T(ctx,p3,x0+w1+w2,y,{w:800,size:62,color:rgba(BO_ACC,1)});});
  vign(ctx,S);});

/* ---------- 7. Data flowing back ---------- */
const BO_FEAT=[["credits so far","18"],["days since last login","12"],["may need help","0.72"]];
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),at=(id,f)=>bo_at(sc,id,f);setScreen(ctx,S);bg2(ctx);
  const sa=fin(t,0.2,0.7),fl=fin(t,c("serve")+0.3,0.8),gs=pulseAt(t,at("serve",0.3),2.0),sg=fin(t,at("serve",0.56),0.6),fg=fin(t,at("serve",0.78),0.6);
  const fT=c("features"),fc=fin(t,at("features",0.62),0.6),fs=at("features",0.72),aT=c("agents"),oa=fin(t,aT+0.2,0.7),rd=fin(t,at("agents",0.42),0.6),wr=fin(t,at("agents",0.66),0.6),dim=1-0.55*oa;
  // gold, where the answers are calculated
  withA(ctx,sa,()=>{if(gs)glow(ctx,1590,400,300,LAYER.gold,0.25*gs);vault(ctx,1400,150,380,520,LAYER.gold,(r,cc)=>hash(r*11+cc,5)<0.62?LAYER.gold:null,null);chip(ctx,1590,212,null,"Gold","ready to read",{align:"center",edge:LAYER.gold});});
  // the app, and its own database
  bo_phone(ctx,330,380,1.55,{a:sa,screen:sg>0?"suggest":"issue",sa:sg,hi:pulseAt(t,at("serve",0.58),1.2),edge:sg>0?BO_M:null});
  withA(ctx,sa,()=>{glass(ctx,110,620,580,236,18,BO_W,{glow:14+10*pulseAt(t,at("agents",0.3),1.4),ea:0.8,fill:"rgba(7,12,24,0.93)"});T(ctx,"the app's database",134,662,{w:800,size:26,color:rgba(BO_W,1)});
    bo_row(ctx,130,680,540,"L-207",["Aisha K.","2 of 4"],{fs:20});bo_row(ctx,130,726,540,"A-1042",["L-207","revoked"],{fs:20,vc:[null,BAD]});
    if(wr>0)bo_row(ctx,130,772,540,"S-0091",["L-207","agent: suggested Data Ethics"],{a:wr,fs:19,hi:pulseAt(t,at("agents",0.7),1.2),col:BO_W});});
  // data flowing back to the app
  withA(ctx,fl*dim,()=>{arrowTo(ctx,1390,300,440,300,BO_M,0.5,{head:18,lw:3,bend:0.06});packets(ctx,t,bez(P(1390,300),P(1100,250),P(740,250),P(446,300),20),0.35,1.4,c("serve"),BO_M,14,1);
    tag(ctx,915,214,t>fs+0.4?"served in 8 ms":"data flowing back",BO_M,{align:"center",size:28});});
  withA(ctx,sg*dim,()=>tag(ctx,360,110,"next: Data Ethics microcredential",BO_M,{align:"center",size:26}));
  withA(ctx,fg*dim,()=>{glass(ctx,540,410,500,130,18,BO_M,{glow:14,ea:0.85,fill:"rgba(24,8,24,0.9)"});bo_flag(ctx,590,482,1.6,BO_M,t);T(ctx,"a learner who may need help",646,464,{w:700,size:26});T(ctx,"L-311 · for an adviser",646,504,{w:600,size:21,color:rgba(SOFT,1)});
    arrowTo(ctx,1000,320,900,414,BO_M,0.8,{head:12,bend:-0.2,p:fin(t,at("serve",0.78),0.6)});});
  // features, calculated in gold and served in milliseconds
  BO_FEAT.forEach(([k,v],i)=>{const a=fin(t,fT+0.2+i*0.3,0.4),u=ease(clamp((t-fs-i*0.12)/0.55,0,1)),x=lerp(1430,420,u),y=lerp(420+i*62,300,u),fa=a*(1-fin(t,fs+0.5+i*0.12,0.25))*dim;if(fa<=0.01)return;
    withA(ctx,fa,()=>{if(fc>0)glow(ctx,x+160,y+24,120,LAYER.gold,0.3*fc*(1-u));glass(ctx,x,y,330,54,12,u>0?BO_M:LAYER.gold,{glow:10,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(ctx,k,x+18,y+35,{w:600,size:22});T(ctx,v,x+312,y+35,{f:"mono",w:500,size:22,align:"right",color:rgba(LAYER.gold,1)});});});
  withA(ctx,fin(t,fT+0.2,0.5)*(1-fin(t,fs,0.4))*dim,()=>tag(ctx,1590,716,fc>0.5?"calculated in gold":"features, for machine learning",LAYER.gold,{align:"center",size:24}));
  // an AI agent reads what's known and writes down what it did
  withA(ctx,oa,()=>{orb(ctx,1080,640,30,t);tag(ctx,1080,570,"an AI agent",[255,226,160],{align:"center",size:24});
    withA(ctx,rd,()=>{arrowTo(ctx,1396,560,1124,630,BO_R,1,{head:16,lw:3,bend:-0.1});packets(ctx,t,[P(1396,560),P(1124,630)],0.4,0.8,at("agents",0.42),BO_R,11,1);tag(ctx,1250,500,"reads what's known",BO_R,{align:"center",size:24});});
    withA(ctx,wr,()=>{arrowTo(ctx,1040,662,698,790,BO_W,1,{head:16,lw:3,bend:0.1});packets(ctx,t,[P(1040,662),P(698,790)],0.4,0.8,at("agents",0.66),BO_W,11,1);tag(ctx,930,830,"writes what it did",BO_W,{align:"center",size:24});});});
  vign(ctx,S);});

/* ---------- 8. New questions for the modeller ---------- */
const BO_Q=[["truth","For each idea, which shape is the source of truth?"],["sync","Which way does each table sync, and who owns it?"],["fresh","How fresh must each answer be?"],["defs","Where do the definitions live?"],["contract","Contracts, in both directions"]];
scene("questions",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),at=(id,f)=>bo_at(sc,id,f);setScreen(ctx,S);bg2(ctx);
  const starts=BO_Q.map(([id])=>id==="truth"?at("truth",0.36):c(id)),cur=starts.reduce((k,s,i)=>t>=s-0.2?i:k,-1);
  let y=100;BO_Q.forEach(([id,q],i)=>{const a=fin(t,starts[i]-0.2,0.5),hi=i===cur?1:0;bo_qcard(ctx,40,y,660,i+1,q,[BO_ACC,BO_ACC,BO_M,TRUST,[236,243,255]][i],a,hi);y+=(wrapT(ctx,q,0,0,570,{size:24,w:700,measure:true}).length>1?112:92)+16;});
  const vis=i=>fin(t,i?starts[i]-0.1:0.5,0.6)*(i<4?1-fin(t,starts[i+1]-0.4,0.4):1);
  // 1: the source of truth, per idea
  withA(ctx,vis(0),()=>{bo_store(ctx,760,110,520,400,"rows",{title:"rows",sub:"built to write",ts:34,ss:24,n:5,t});bo_store(ctx,1340,110,520,400,"cols",{title:"columns",sub:"built to read",ts:34,ss:24,n:7,t});
    withA(ctx,fin(t,at("truth",0.5),0.5),()=>T(ctx,"the source of truth for…",1310,566,{w:600,size:24,align:"center",color:rgba(SOFT,1)}));
    [[1020,630,"an award's status",BO_W,0.5],[1020,706,"a learner's email",BO_W,0.66],[1600,630,"awards by faculty, ten years",BO_R,0.82]].forEach(([x,y,s_,col,f])=>withA(ctx,fin(t,at("truth",f),0.4),()=>tag(ctx,x,y,"★ "+s_,col,{align:"center",size:26})));});
  // 2: which way each table syncs, and who owns it
  withA(ctx,vis(1),()=>{[[160,"awards",BO_W,"rows","columns","registrar's team"],[430,"next suggestion",BO_M,"gold","the app","data team"]].forEach(([y,n,col,a_,b_,own],i)=>{const a=fin(t,c("sync")+i*0.9,0.5);withA(ctx,a,()=>{
      glass(ctx,760,y,1100,230,22,col,{glow:12,ea:0.7,fill:"rgba(7,12,24,0.93)"});T(ctx,n,794,y+58,{w:800,size:34,color:rgba(col,1)});
      tag(ctx,794,y+150,a_,a_==="gold"?LAYER.gold:BO_W,{size:28});arrowTo(ctx,960,y+150,1170,y+150,col,1,{head:18,lw:3.5});tag(ctx,1190,y+150,b_,a_==="gold"?BO_W:BO_R,{size:28});
      T(ctx,"one direction",1065,y+124,{w:600,size:21,align:"center",color:rgba(SOFT,1)});tag(ctx,1450,y+150,"owner: "+own,TRUST,{size:26});});});});
  // 3: how fresh
  withA(ctx,vis(2),()=>{const w1=fin(t,at("fresh",0.42),0.5),p1=fin(t,at("fresh",0.72),0.5);
    bo_fresh(ctx,860,640,940,{labels:["seconds","minutes","hours","a day"],ls:26,ms:26,marks:[w1>0.02?[0,"a wallet",BO_M,0]:null,p1>0.02?[3,"a plan",BO_R,0]:null].filter(Boolean)});
    const kx=860+940*clamp(ease(clamp((t-c("fresh"))/1.4,0,1))*0.5+0.5*ease(fin(t,at("fresh",0.5),1.2))-0.0,0,1)*(1-w1)*(1-p1);withA(ctx,(1-w1)*fin(t,c("fresh"),0.4),()=>{glow(ctx,kx,640,44,BO_ACC,0.6);ctx.fillStyle=rgba(INK,1);ctx.beginPath();ctx.arc(kx,640,13,0,TAU);ctx.fill();});
    withA(ctx,w1,()=>bo_phone(ctx,860,330,1.35,{screen:"wallet"}));withA(ctx,p1,()=>bo_answer(ctx,1480,170,360,280,"a plan","ten years of awards",BO_R,t,1));});
  // 4: definitions in one place
  withA(ctx,vis(3),()=>{const o1=fin(t,at("defs",0.3),0.5),nt=fin(t,at("defs",0.78),0.5);
    glass(ctx,1060,190,540,270,22,TRUST,{glow:20,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(ctx,"credits towards a certificate",1090,242,{w:800,size:27,color:rgba(TRUST,1)});
    wrapT(ctx,"approved microcredentials only, counted when issued, not revoked",1090,290,480,{w:600,size:23,lh:31,color:rgba(INK,0.9)});T(ctx,"one definition · owner: registrar",1090,428,{w:600,size:20,color:rgba(SOFT,1)});
    withA(ctx,o1,()=>{bo_store(ctx,740,210,250,230,"rows",{title:"the app",n:3,ts:28});bo_store(ctx,1660,210,220,230,"cols",{title:"the report",n:4,ts:28});arrowTo(ctx,1054,325,996,325,TRUST,1,{head:16,lw:3});arrowTo(ctx,1606,325,1654,325,TRUST,1,{head:16,lw:3});});
    withA(ctx,nt,()=>{ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=2;rr(ctx,1140,510,380,130,18);ctx.stroke();ctx.restore();T(ctx,"a second copy",1330,584,{w:700,size:26,align:"center",color:rgba(SOFT,0.7)});const w2=tw(ctx,"a second copy",26,700);bo_strike(ctx,1330-w2/2-6,575,1330+w2/2+6,575,fin(t,at("defs",0.84),0.4),BAD,0.9);cross_(ctx,1568,575,52,BAD,0.9);
      tag(ctx,1330,716,"one place, not two",GOOD,{align:"center",size:30});});});
  // 5: data contracts, in both directions
  withA(ctx,vis(4),()=>{const cA=fin(t,c("contract")+0.1,0.6),bw=fin(t,at("contract",0.7),0.6);
    ctx.save();ctx.translate(1040,110);ctx.scale(0.74,0.74);bo_contract(ctx,0,0,760,560);ctx.restore();
    withA(ctx,cA,()=>{bo_store(ctx,740,150,270,230,"rows",{title:"the app",n:3,ts:28});vault(ctx,1640,130,230,300,LAYER.gold,(r,cc)=>hash(r*5+cc,6)<0.6?LAYER.gold:null,null);chip(ctx,1755,192,null,"Gold",null,{align:"center",edge:LAYER.gold});});
    withA(ctx,bw,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(875,384);ctx.lineTo(875,650);ctx.moveTo(1755,434);ctx.lineTo(1755,650);ctx.stroke();ctx.restore();
      arrowTo(ctx,880,586,1750,586,BO_W,1,{head:18,lw:3.5});arrowTo(ctx,1750,640,880,640,BO_M,1,{head:18,lw:3.5});T(ctx,"what the app writes",1315,574,{w:600,size:21,align:"center",color:rgba(BO_W,1)});T(ctx,"what gold serves back",1315,672,{w:600,size:21,align:"center",color:rgba(BO_M,1)});
      tag(ctx,1315,746,"both directions",BO_ACC,{align:"center",size:30});});});
  vign(ctx,S);});

/* ---------- 9. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),at=(id,f)=>bo_at(sc,id,f),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const m=fin(t,0.4,0.8),sh=fin(t,at("one",0.3),0.7),pl=fin(t,at("one",0.55),0.6),ds=fin(t,at("one",0.78),0.6),tg=fin(t,c("tag")+0.1,0.6),nx=fin(t,c("next")+0.2,0.7);
  // one logical model
  withA(ctx,m,()=>{tag(ctx,900,70,"one logical model",KIND,{align:"center",size:26});const E={l:{x:540,y:180,name:"Learner",col:KIND,s:1.25},a:{x:900,y:180,name:"Award",col:KIND,s:1.25},k:{x:1300,y:180,name:"Credential type",col:KIND,s:1.25}};
    const b=k=>entBox(ctx,E[k]);relLine(ctx,b("l"),b("a"),"1","*",{col:KIND,s:1.25});relLine(ctx,b("a"),b("k"),"*","1",{col:KIND,s:1.25});Object.values(E).forEach(e=>ent(ctx,e));});
  // a shape for writing, a shape for reading, on one platform, a short distance apart
  withA(ctx,sh,()=>{ctx.save();ctx.strokeStyle=rgba(KIND,0.45);ctx.lineWidth=2;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(900,220);ctx.lineTo(640,340);ctx.moveTo(900,220);ctx.lineTo(1160,340);ctx.stroke();ctx.restore();
    bo_store(ctx,420,340,420,300,"rows",{title:"for writing",ts:32,n:6,t});bo_store(ctx,960,340,420,300,"cols",{title:"for reading",ts:32,n:8,t});});
  withA(ctx,pl,()=>{glass(ctx,360,660,1080,76,20,BO_ACC,{glow:20,ea:0.85,fill:"rgba(8,16,30,0.9)"});T(ctx,"one platform",900,708,{w:800,size:28,align:"center",color:rgba(BO_ACC,1)});});
  withA(ctx,ds,()=>{arrowTo(ctx,846,500,954,500,BO_ACC,1,{head:14,lw:3});arrowTo(ctx,954,524,846,524,BO_ACC,0.6,{head:12,lw:3});});
  withA(ctx,tg,()=>{const y=816,p1="Hybrid removes the copy, ",p2="not the model.",w1=tw(ctx,p1,46,800),w2=tw(ctx,p2,46,800),x0=900-(w1+w2)/2;T(ctx,p1,x0,y,{w:800,size:46});T(ctx,p2,x0+w1,y,{w:800,size:46,color:rgba(BO_ACC,1)});});
  // next: meaning a machine can read
  withA(ctx,nx,()=>{orb(ctx,1690,330,28,t);glass(ctx,1510,400,360,140,16,KIND,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.94)"});T(ctx,"award",1536,446,{w:800,size:26,color:rgba(KIND,1)});T(ctx,"is a kind of credential",1536,486,{w:600,size:22});
    arrowTo(ctx,1690,394,1690,370,KIND,0.8,{head:10});tag(ctx,1690,600,"next: meaning",KIND,{align:"center",size:24});tag(ctx,1690,650,"a machine can read",KIND,{align:"center",size:24});});
  endCard(ctx,S,t,B+0.3,"Both at once",BO_ACC,"Hybrid removes the copy, not the model.");
  vign(ctx,S);});
