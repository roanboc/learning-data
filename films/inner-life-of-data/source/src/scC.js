/* ===== v4 scenes, part C ===== */
const ORDER24=(()=>{const a=[...Array(24).keys()];for(let i=a.length-1;i>0;i--){const j=Math.floor(hash(i,77)*(i+1));const tmp=a[i];a[i]=a[j];a[j]=tmp;}return a;})();
const KSRC=[{n:"Intranet",x:150,ic:"doc"},{n:"Policy library",x:560,ic:"books"},{n:"Handbook",x:1060,ic:"hand"},{n:"Process maps",x:1470,ic:"flow"}];
scene("meaning",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cNo=c("noise"),cBr=c("bricks"),cCa=c("catalog"),cDe=c("define"),cUc=c("uc"),cKn=c("knowledge"),cMc=c("mcp"),cRd=c("reads"),cOn=c("onto");
  const cam=camAt([[0,960,540,1.0],[cKn-0.3,960,540,1.0],[cKn+2.0,960,-560,1.0],[sc.dur+2,960,-560,1.03]],t);bgW(ctx,S,cam);
  const nz=(1-sstep(cNo+0.5,cBr,t))*0.9;
  for(let r=0;r<3;r++)for(let k=0;k<4;k++){const n=r*4+k,dk=["students","teaching","research","finance"][(n+r)%4],vi=(n*5+r)%6,d=DOM[dk].c,X=90+k*245,Y=220+r*200;ledFrame(ctx,X,Y,190,126,d,pv(dk,vi),{pad:5,lw:2,glow:12});pvLive(ctx,dk,vi,X,Y,190,126,t);T(ctx,pvTitle(dk,vi),X-2,Y+152,{w:600,size:15,color:rgba(SOFT,0.95)});
    if(nz>0){for(let j=0;j<70;j++){ctx.fillStyle=hash(j,n+Math.floor(t*14))>0.5?"rgba(255,255,255,"+0.6*nz+")":"rgba(0,0,0,"+0.6*nz+")";ctx.fillRect(X+hash(j,n*3+Math.floor(t*12))*190,Y+hash(j+50,n*5+Math.floor(t*12))*126,5,5);}}}
  const wA=fin(t,cBr+0.3)*(1-sstep(cCa+1,cCa+2,t));withA(ctx,wA,()=>["census date","enrolled student","class fill rate","research income","waitlist","degree code"].forEach((w,i)=>{const x=110+(i%3)*330+Math.sin(t*0.6+i)*16,y=300+Math.floor(i/3)*300+Math.sin(t*0.9+i*2)*14;tag(ctx,x,y,w,[255,228,170],{size:22});}));
  withA(ctx,fin(t,cCa-0.1),()=>{glass(ctx,1120,180,760,380,18,DBT,{glow:16,ea:0.5,fill:"rgba(7,12,24,0.94)"});logo(ctx,"dbt",1144,200,34);T(ctx,"Catalog",1188,230,{w:800,size:28});T(ctx,"in dbt",1310,230,{w:500,size:18,color:rgba(SOFT,0.9)});
    let tx=1144;["Definitions","Sources","Lineage","Data products"].forEach((s,i)=>{const w=tw(ctx,s,16,700)+26;ctx.fillStyle=i===0?"rgba(255,105,75,0.9)":"rgba(255,255,255,0.08)";rr(ctx,tx,254,w,32,16);ctx.fill();T(ctx,s,tx+13,276,{w:700,size:16,color:i===0?"#fff":rgba(INK,0.85)});tx+=w+10;});
    const dC=nextCue(sc,"catalog")-cCa,rows=[["What it shows","Enrolled students by class",cCa+0.2],["Where it came from","Student system → staging → marts",cCa+dC*0.45],["Who owns it","Student services",cCa+dC*0.75]];
    rows.forEach(([a,b,tt],i)=>withA(ctx,fin(t,tt,0.4),()=>{const y=312+i*50;ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.beginPath();ctx.moveTo(1144,y+34);ctx.lineTo(1856,y+34);ctx.stroke();T(ctx,a,1144,y+24,{w:700,size:19,color:rgba(SOFT,0.95)});T(ctx,b,1400,y+24,{w:700,size:20});}));
    withA(ctx,fin(t,cDe,0.5),()=>{glass(ctx,1136,466,728,76,12,LAYER.gold,{glow:14,ea:0.8,fill:"rgba(60,48,20,0.55)"});T(ctx,"Enrolled student",1156,496,{w:800,size:18,color:rgba(LAYER.gold,1)});T(ctx,"still enrolled on census date",1156,526,{w:700,size:22});});});
  withA(ctx,fin(t,cUc-0.1),()=>{glass(ctx,1120,590,760,280,18,DBX,{glow:16,ea:0.5,fill:"rgba(7,12,24,0.94)"});logo(ctx,"databricks",1144,608,36);T(ctx,"Unity Catalog",1192,638,{w:800,size:26});
    const dU=nextCue(sc,"uc")-cUc;withA(ctx,fin(t,cUc+0.2,0.4),()=>{T(ctx,"fct_census_enrolments",1144,690,{f:"mono",w:500,size:19});tag(ctx,1500,684,"✓ certified",GOOD,{size:16});});
    withA(ctx,fin(t,cUc+dU*0.35,0.4),()=>{T(ctx,"Student services",1144,736,{w:700,size:18});T(ctx,"can see everything",1360,736,{w:500,size:18,color:rgba(SOFT,0.95)});T(ctx,"Analysts",1144,768,{w:700,size:18});T(ctx,"names and IDs masked",1360,768,{w:500,size:18,color:rgba(SOFT,0.95)});});
    withA(ctx,fin(t,cUc+dU*0.7,0.4),()=>{T(ctx,"Student",1144,826,{w:600,size:18,color:rgba(SOFT,0.9)});ctx.fillStyle="rgba(140,150,175,0.85)";rr(ctx,1232,806,230,28,6);ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=2.5;rr(ctx,1338,813,18,14,3);ctx.stroke();ctx.beginPath();ctx.arc(1347,813,6,Math.PI,0);ctx.stroke();T(ctx,"Degree: BSc Data Science",1480,826,{w:600,size:18,color:rgba(SOFT,0.9)});});});
  const sky=fin(t,cKn-0.6,1.2);
  withA(ctx,sky,()=>{KSRC.forEach((s,i)=>withA(ctx,fin(t,cKn+0.4+i*0.5),()=>sysCard(ctx,s.x,-1000,300,110,s.n,null,[120,180,255],ICON[s.ic])));
    const BX=960,BY=-565,BS=0.78,act=0.15+0.35*fin(t,cMc)+0.5*fin(t,cOn),ents=[0,1,2,3,4].map(i=>brainHub(BX,BY,BS,i));
    brainNet(ctx,BX,BY,BS,t,act,{});
    // the breather: snippets keep arriving, and new connections light up across the brain
    const Bm=c("breath");if(sc.breathe&&t>Bm){spawn(t,0.45,1.6,Bm,(u,k)=>{const e=BRAIN.E[(k*53+7)%BRAIN.E.length],a=BRAIN.N[e[0]],b=BRAIN.N[e[1]],f=Math.sin(u*Math.PI);ctx.save();ctx.strokeStyle=rgba(LAYER.gold,0.8*f);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(BX+a[0]*BS,BY+a[1]*BS);ctx.lineTo(BX+b[0]*BS,BY+b[1]*BS);ctx.stroke();ctx.restore();glow(ctx,BX+a[0]*BS,BY+a[1]*BS,30,LAYER.gold,0.8*f);glow(ctx,BX+b[0]*BS,BY+b[1]*BS,30,LAYER.gold,0.8*f);});}
    const mA=fin(t,cMc);KSRC.forEach((s,i)=>{if(mA<=0)return;const gx=s.x+150,gy=-860,tg=ents[[0,1,2,3][i]];withA(ctx,mA,()=>{ctx.save();ctx.lineWidth=6;ctx.strokeStyle=metal(ctx,gx-20,0,gx+20,0,MET.silver);ctx.beginPath();ctx.ellipse(gx,gy,20,11,0,0,TAU);ctx.stroke();ctx.restore();});
      const L=[P(gx,gy+10),P(lerp(gx,tg.x,0.5),gy+70),P(tg.x,tg.y-30)];beam(ctx,L,C.mcp,[[12,0.05*mA],[4,0.2*mA],[1.6,0.9*mA]]);
      if(t>cRd)spawn(t,2.0,1.6,cRd+i*0.35,u=>{const q=at(mk(L),u);withA(ctx,1-sstep(0.85,1,u),()=>{ctx.fillStyle="#f4f1ea";rr(ctx,q.x-40,q.y-14,80,28,5);ctx.fill();ctx.fillStyle="#6b7280";ctx.fillRect(q.x-30,q.y-5,50,4);ctx.fillRect(q.x-30,q.y+3,34,4);});glow(ctx,q.x,q.y,36,C.mcp,0.35);});});
    withA(ctx,fin(t,cMc+0.4)*(1-sstep(cOn,cOn+0.6,t)),()=>chip(ctx,300,-700,null,"MCP","one standard plug for AI",{align:"center",edge:C.mcp}));
    const gA=fin(t,cOn-0.2);if(gA>0){const L=mk([P(1500,170),P(1500,-150),P(1200,-330),P(1128,-430)]),n=40,sub=[];for(let i=0;i<=n;i++)sub.push(at(L,gA*i/n));beam(ctx,sub,LAYER.gold,[[16,0.06],[6,0.22],[2.2,0.95]]);
      withA(ctx,gA,()=>{glow(ctx,960,-600,420,LAYER.gold,0.12);chip(ctx,960,-292,"databricks","Genie Ontology","the organisational brain",{align:"center",edge:LAYER.gold});});}});
  vign(ctx,S);
});

scene("speeds",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cNo=c("now"),cYe=c("years"),cJo=c("jobs"),cLa=c("lake"),cSy=c("sync"),q0=cNo+3.4;
  const cam=camAt([[0,960,520,1],[sc.dur+2,960,520,1.04]],t);bgW(ctx,S,cam);
  ctx.save();ctx.strokeStyle="rgba(170,200,245,0.16)";ctx.lineWidth=2;ctx.setLineDash([10,12]);ctx.beginPath();ctx.moveTo(960,190);ctx.lineTo(960,660);ctx.stroke();ctx.restore();
  withA(ctx,fin(t,cNo),()=>T(ctx,"One answer, right now",480,150,{w:800,size:40,align:"center"}));withA(ctx,fin(t,cYe),()=>T(ctx,"Every record, over years",1440,150,{w:800,size:40,align:"center"}));
  const ans=fin(t,q0+0.35,0.25);phone3(ctx,280,470,1.5,{screen:"seat",ans});
  // the breather: three more seat checks answer at once, while one long scan crosses the whole history
  const B=c("breath"),Q=sc.breathe?[0.4,1.9,3.4].map(x=>B+x):[];let flash=0;
  Q.forEach(q=>{if(t>q-0.3&&t<q)glow(ctx,lerp(370,540,(t-q+0.3)/0.3),470,24,C.hot,1);if(t>q+0.05&&t<q+0.35)glow(ctx,lerp(540,370,(t-q-0.05)/0.3),470,24,GOOD,1);if(t>q&&t<q+0.8)flash=Math.max(flash,1-(t-q)/0.8);});
  if(t>q0-0.3&&t<q0){glow(ctx,lerp(370,540,(t-q0+0.3)/0.3),470,24,C.hot,1);}if(t>q0+0.3&&t<q0+0.6){glow(ctx,lerp(540,370,(t-q0-0.3)/0.3),470,24,GOOD,1);}
  glass(ctx,540,330,380,290,18,DBX,{glow:16,ea:0.5,fill:"rgba(7,12,24,0.92)"});withA(ctx,fin(t,cLa-0.2),()=>{logo(ctx,"databricks",560,346,32);T(ctx,"Lakebase",602,372,{w:800,size:24});T(ctx,"a fast desk copy for apps",602,396,{w:500,size:16,color:rgba(SOFT,0.95)});});
  for(let r=0;r<5;r++){const hl=r===2?ans:0;ctx.fillStyle=hl>0?rgba(mix([40,60,100],GOOD,hl),0.9):"rgba(120,150,200,0.18)";rr(ctx,564,420+r*36,332,26,6);ctx.fill();if(r===2&&hl>0.5)T(ctx,"DS101 · Tue 9 am · 1 seat left",580,438+r*36,{w:700,size:15,color:"#08140c"});}
  withA(ctx,fin(t,q0+0.5,0.3),()=>tag(ctx,730,652,"8 ms",GOOD,{align:"center",size:18}));if(flash>0){glow(ctx,730,505,170,GOOD,0.35*flash);glow(ctx,730,652,60,GOOD,0.5*flash);}
  withA(ctx,fin(t,cYe-0.2),()=>{for(let s2=0;s2<7;s2++){ctx.fillStyle=rgba(mix(APP[["sis","lms","hr","fin"][s2%4]].c,[30,40,60],0.55),1);rr(ctx,1030+s2*14,300-s2*6,110,330+s2*6,8);ctx.fill();}
    ctx.save();ctx.globalCompositeOperation="lighter";const sy=300+((t*0.8)%1)*330;ctx.fillStyle=rgba(C.hot,0.8);ctx.fillRect(1030,sy,210,4);ctx.restore();glow(ctx,1135,sy,60,C.hot,0.5);
    const hm=sstep(cYe+0.6,cYe+3.6,t);for(let r=0;r<8;r++)for(let k=0;k<14;k++){const v=0.25+0.75*Math.abs(Math.sin(r*1.7+k*0.6)*Math.cos(k*0.3+r));ctx.fillStyle=hm*14>k?rgba(mix([40,60,110],[255,140,90],v),0.95):"rgba(40,50,70,0.35)";rr(ctx,1280+k*40,300+r*40,34,34,6);ctx.fill();}
    if(sc.breathe&&t>B+0.3&&t<sc.dur-0.2){const v=clamp((t-B-0.3)/(sc.breathe-0.9),0,1),sx=1280+v*560;ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=rgba(C.hot,0.55);ctx.fillRect(sx-2,292,4,334);ctx.restore();glow(ctx,sx,460,90,C.hot,0.35);}
    T(ctx,"weeks →",1280,650,{w:600,size:18,color:rgba(SOFT,0.85)});T(ctx,"classes ↓",1280,286,{w:600,size:18,color:rgba(SOFT,0.85)});});
  withA(ctx,fin(t,cJo),()=>chip(ctx,1560,720,"databricks","Lakehouse","history at scale",{align:"center"}));
  const sa=fin(t,cSy-0.1);withA(ctx,sa,()=>{vault(ctx,820,690,280,150,LAYER.gold,(r,k)=>hash(r*9+k,4)>0.7?null:DOM[["students","teaching","research","finance"][(r+k)%4]].c,null);
    const A=[P(880,690),P(820,650),P(760,622)],B=[P(840,622),P(1000,650),P(1040,690)];lane(ctx,A,LAYER.gold,sa);lane(ctx,B,GOOD,sa);spawn(t,0.7,0.9,cSy,u=>glow(ctx,at(mk(A),u).x,at(mk(A),u).y,14,LAYER.gold,1));spawn(t,0.7,0.9,cSy+0.35,u=>glow(ctx,at(mk(B),u).x,at(mk(B),u).y,14,GOOD,1));
    tag(ctx,640,700,"synced automatically",LAYER.gold,{align:"center",size:16});tag(ctx,1250,760,"changes flow back",GOOD,{align:"center",size:16});});
  vign(ctx,S);
});

scene("out",(ctx,S,t,sc)=>{
  const c=id=>cue(sc,id),cFo=c("four"),cEv=c("events"),cSq=c("sql"),cCp=c("copies"),cSt=c("stale"),cTw=c("twist"),cPr=c("projector"),cSh=c("share"),cMi=c("mirror"),cFe=c("fed"),cOn=c("one");
  const pzT=(sc.pauses&&sc.pauses.twist)||1;
  const cam=camAt([[0,1500,540,0.6],[cEv-0.3,1500,540,0.6],[cEv+0.6,960,330,1.3],[cSq-0.2,960,330,1.3],[cSq+0.6,1700,260,1.3],[cCp-0.2,1700,260,1.3],[cCp+0.6,1150,440,1.3],[cTw-pzT-1.1,1150,440,1.3],[cTw-pzT*0.4-0.5,1500,540,0.6],[cPr+0.4,1050,790,1.05],[cSh+0.4,1300,790,1.3],[cMi+0.4,1790,790,1.3],[cFe+0.5,2440,800,1.25],[cOn+0.4,1500,560,0.6],[sc.dur+2,1500,560,0.62]],t);
  bgW(ctx,S,cam);const dim=(a,b)=>0.35+0.65*fin(t,a,b||0.6);
  vault(ctx,120,280,300,560,LAYER.gold,(r,k)=>hash(r*13+k,3)>0.8?null:DOM[["students","teaching","research","finance"][(hash(r*7+k,2)*4)|0]].c,"Gold","data products");
  const chg=cSt+0.2;if(t>chg&&t<chg+1.2)glow(ctx,270,560,240,LAYER.gold,0.6*(1-(t-chg)/1.2));
  // during the hold, the original changes again, and the copies fall behind again
  const chg2=(sc.ends.stale||cSt)+0.8;if(t>chg2&&t<chg2+1.2)glow(ctx,270,560,240,LAYER.gold,0.6*(1-(t-chg2)/1.2));if(t>chg2+0.3&&t<chg2+2.0)glow(ctx,1470,520,110,BAD,0.5*Math.sin((t-chg2-0.3)/1.7*Math.PI));
  withA(ctx,dim(cEv-0.3),()=>{lane(ctx,[P(422,420),P(680,360)],LAYER.gold,0.9);hub(ctx,760,360,78,t*0.6);chip(ctx,760,478,null,"Integration platform",null,{align:"center",edge:CYAN,ts:18});
    const ring=clamp((t-cEv-0.8)/2.4,0,1);bellGlyph(ctx,760,212,1,ring>0&&ring<1?1-ring*0.3:0);
    sysCard(ctx,1000,190,300,86,"Learning platform",null,[150,190,255],ICON.lms);sysCard(ctx,1000,296,300,86,"Library",null,[150,190,255],ICON.lib);
    [[1000,233],[1000,339]].forEach(([x,y],i)=>{const s0=cEv+0.9+i*0.3;if(t>s0&&t<s0+1)lane(ctx,[P(838,360),P(x,y)],LAYER.gold,1-(t-s0));const s1=cEv+2.6+i*0.5;if(t>s1&&t<s1+2){const u=(t-s1)/2,f=u<0.5?u*2:(1-u)*2;lane(ctx,[P(x,y),P(lerp(x,420,f),lerp(y,500,f))],C.hot,1);if(u>0.4&&u<0.6)glow(ctx,420,500,60,C.hot,0.8);}});});
  withA(ctx,dim(cSq-0.3),()=>{lane(ctx,[P(270,280),P(270,110),P(1740,110),P(1740,176)],C.hot,0.8);screen2(ctx,1540,176,400,210,[150,200,255]);bars(ctx,1570,206,340,150,t,C.hot,7);chip(ctx,1740,430,"databricks","SQL endpoint","a reading room for big questions",{align:"center"});
    if(t>cSq&&t<cCp+0.5)spawn(t,0.15,1.3,cSq,(u,k)=>{const q=at(mk([P(270,280),P(270,110),P(1740,110),P(1740,176)]),u);glow(ctx,q.x,q.y,9,C.hot,1);});});
  withA(ctx,dim(cCp-0.3),()=>{sysCard(ctx,1000,430,300,86,"Older system","can't read the originals",[200,200,215],ICON.old);lane(ctx,[P(838,380),P(1000,473)],C.warm,0.9);
    if(t>cCp)spawn(t,0.6,1.1,cCp,(u,k)=>{const x=lerp(1300,1420,u);ctx.fillStyle="rgba(236,240,246,0.95)";rr(ctx,x-18,470-(k%3)*3,36,26,4);ctx.fill();});
    for(let i=0;i<4;i++){const x=1440+i*10,y=520-i*6;ctx.fillStyle="rgba(236,240,246,0.95)";rr(ctx,x-18,y,36,26,4);ctx.fill();if(t>chg+0.4){ctx.fillStyle=rgba(BAD,0.95);ctx.beginPath();ctx.arc(x+16,y+2,9,0,TAU);ctx.fill();T(ctx,"!",x+16,y+7,{w:800,size:13,align:"center",color:"#fff"});}}
    withA(ctx,fin(t,chg+0.6),()=>tag(ctx,1470,590,"out of date",BAD,{align:"center",size:16}));});
  const pa=dim(cPr-0.2);withA(ctx,pa,()=>{lane(ctx,[P(270,840),P(270,790),P(650,790)],LAYER.gold,0.9);projector2(ctx,700,790,1.2,false);chip(ctx,700,690,null,"Projector","the original, shown elsewhere",{align:"center",edge:LAYER.gold});
    [{x:1100,c:fin(t,cSh),n:"OpenSharing",s:"partner university",ic:ICON.uni},{x:1600,c:fin(t,cMi),n:"Mirroring",s:"Microsoft Fabric",ic:null}].forEach(o=>{screen2(ctx,o.x,690,380,210,DOM.research.c);if(o.c>0){cone(ctx,760,790,o.x,690,o.x,900,LAYER.gold,o.c);withA(ctx,o.c,()=>{if(o.n==="OpenSharing")ctx.drawImage(pv("research",0),o.x+8,698,364,194);else[["teaching",0],["students",0],["research",3],["finance",1]].forEach(([dk,vi],k)=>{ctx.drawImage(pv(dk,vi),o.x+10+(k%2)*182,700+((k/2)|0)*97,178,93);pvLive(ctx,dk,vi,o.x+10+(k%2)*182,700+((k/2)|0)*97,178,93,t);ctx.strokeStyle=rgba(DOM[dk].c,0.9);ctx.lineWidth=2;ctx.strokeRect(o.x+10+(k%2)*182,700+((k/2)|0)*97,178,93);});glow(ctx,o.x+190+130*Math.sin(t*1.3),795,40,DOM.research.c,0.6);});}withA(ctx,o.c,()=>chip(ctx,o.x+190,950,null,o.n,o.s,{align:"center",edge:DOM.research.c,ts:20,ss:16}));});
    const fe=fin(t,cFe);withA(ctx,fe,()=>{screen2(ctx,2150,710,280,180,C.mcp);cone(ctx,2520,800,2430,710,2430,890,C.mcp,1);projector2(ctx,2560,800,1.1,true);sysCard(ctx,2640,740,320,110,"Research grants system","stays where it lives",[150,230,190],ICON.doc);for(let r=0;r<5;r++){ctx.fillStyle=rgba(C.mcp,0.85);rr(ctx,2170,730+r*30,120+((r*37)%80),14,4);ctx.fill();}chip(ctx,2290,950,null,"Federation","their data, where it lives",{align:"center",edge:C.mcp,ts:20,ss:16});});});
  withA(ctx,fin(t,cOn),()=>chip(ctx,1500,1040,null,"Zero-copy","projected, never copied",{align:"center",edge:LAYER.gold}));
  if(t>cTw-pzT-0.1&&t<cTw+0.6){const a=clamp((t-cTw+pzT+0.1)/(pzT+0.1),0,1)*(1-sstep(cTw+0.2,cTw+0.6,t));glow(ctx,756,790,40+70*a,[255,236,190],0.7*a);}
  // the breather: the original changes; both projected screens show it in the same instant, while the copy falls behind
  const B=c("breath");if(sc.breathe&&t>B){[1.0,3.6].forEach(d=>{const u=t-B-d;if(u>0&&u<1.4){const a=1-u/1.4;glow(ctx,270,560,260,LAYER.gold,0.6*a);if(u>0.15)[[1290,795],[1790,795]].forEach(([x,y])=>glow(ctx,x,y,240,[255,245,220],0.5*(1-(u-0.15)/1.25)));}if(u>0.3&&u<2.3)glow(ctx,1470,520,120,BAD,0.5*Math.sin((u-0.3)/2*Math.PI));});}
  vign(ctx,S);
});
