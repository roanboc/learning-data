/* ===== Making of · Data for Films: scenes =====
   Nine chapters, as in ../script.md. The film freezes The Inner Life of Data at 2:31, dives to one pixel, and builds the frame back up. */

/* ---------- 1. One frame ---------- */
scene("frame",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath"),tf=c("stop")+1.0;
  // the film plays, then stops at 2:31
  if(t<tf){ildAt(ctx,S,T231-(tf-t));}
  else{const z0=c("closer")-0.4,z1=c("squares")+1.2,u=easeCam(clamp((t-z0)/(z1-z0),0,1)),z=Math.exp(lerp(0,Math.log(150),u));
    pixelView(ctx,S,FOCUS.x+0.5,FOCUS.y+0.5,z,{sx:lerp(FOCUS.x+0.5,W/2-250*u,u),sy:lerp(FOCUS.y+0.5,H/2-40*u,u),only:t<c("rgb")+0.6,others:fin(t,c("rgb")+0.6,1.4)});
    // the pixel in question, outlined
    const pa=fin(t,z1-0.4,0.6);if(pa>0){const s=z;withA(ctx,pa,()=>{ctx.strokeStyle="#fff";ctx.lineWidth=4;ctx.strokeRect(W/2-250-s/2,H/2-40-s/2,s,s);});}
    rgbCard(ctx,1320,300,pix(FOCUS.x,FOCUS.y),fin(t,c("rgb")-0.2,0.6),{grow:clamp((t-c("rgb"))/2.4,0,1)});
    // the pause: a flash, and the pause mark
    const fl=pulse(t,tf-0.1,0.7);if(fl>0){setScreen(ctx,S);ctx.fillStyle="rgba(255,255,255,"+(0.25*fl)+")";ctx.fillRect(0,0,W,H);}
    withA(ctx,fin(t,tf,0.3)*(1-fin(t,z0+0.4,0.5)),()=>{setScreen(ctx,S);ctx.fillStyle="rgba(0,0,0,0.5)";ctx.beginPath();ctx.arc(W/2,H/2,70,0,TAU);ctx.fill();ctx.fillStyle="#fff";ctx.fillRect(W/2-24,H/2-30,16,60);ctx.fillRect(W/2+8,H/2-30,16,60);});}
  // where we are: the film and its clock
  setScreen(ctx,S);const tc=Math.min(T231,T231-(tf-t));withA(ctx,fin(t,0.6,0.6)*(1-fin(t,c("closer"),0.6)),()=>{glass(ctx,64,56,470,76,16,[190,210,240],{glow:10,ea:0.4,fill:"rgba(6,10,20,0.9)"});
    T(ctx,"The Inner Life of Data",88,90,{w:700,size:22});T(ctx,"Refining with dbt",88,116,{w:500,size:16,color:rgba(SOFT,0.95)});T(ctx,Math.floor(tc/60)+":"+String(Math.floor(tc%60)).padStart(2,"0"),510,108,{f:"mono",w:500,size:30,align:"right",color:rgba(t>=tf?AMBER:INK,1)});});
  // the title
  const oA=fin(t,B+0.1,0.7),tA=fin(t,B+0.6,0.7);if(oA>0){dark(ctx,S,oA*0.9);setScreen(ctx,S);withA(ctx,tA,()=>{glow(ctx,960,500,460,CYAN,0.08);T(ctx,"MAKING OF",960,440,{w:800,size:26,align:"center",color:rgba(CYAN,0.95)});
    T(ctx,"Data for Films",960,540,{w:800,size:96,align:"center"});T(ctx,"how the films are drawn",960,604,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)});});}
  if(t<1.0){setScreen(ctx,S);ctx.fillStyle="rgba(0,0,0,"+(1-ease(t/1.0))+")";ctx.fillRect(0,0,W,H);}});

/* ---------- 2. A picture is data ---------- */
scene("data",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  const u=easeCam(clamp((t-0.2)/(c("count")+0.6),0,1)),z=Math.exp(lerp(Math.log(150),Math.log(0.6),u)),sx=lerp(W/2-250,W/2-230,u),sy=lerp(H/2-40,H/2-60,u),fx=lerp(FOCUS.x+0.5,W/2,u),fy=lerp(FOCUS.y+0.5,H/2,u);
  pixelView(ctx,S,fx,fy,z,{sx,sy});setScreen(ctx,S);
  // the frame's edges, measured
  const fw=W*z,fh=H*z,X0=sx-fx*z,Y0=sy-fy*z,ra=fin(t,c("grid")+0.8,0.8);
  if(z<1.2)withA(ctx,ra,()=>{ctx.strokeStyle=rgba(CYAN,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X0,Y0-26);ctx.lineTo(X0+fw,Y0-26);ctx.moveTo(X0-26,Y0);ctx.lineTo(X0-26,Y0+fh);ctx.stroke();
    tag(ctx,X0+fw/2,Y0-26,"1,920 pixels across",CYAN,{align:"center",size:18});ctx.save();ctx.translate(X0-26,Y0+fh/2);ctx.rotate(-Math.PI/2);tag(ctx,0,0,"1,080 down",CYAN,{align:"center",size:18});ctx.restore();});
  // the count
  const rows=[["1,920 × 1,080","= "+fmtN(1920*1080)+" pixels",c("count")+0.2],["× 3 numbers each","= "+fmtN(1920*1080*3)+" numbers",c("count")+1.8],["× 30 frames a second","= "+fmtN(1920*1080*3*30)+" a second",c("thirty")+0.3]];
  withA(ctx,fin(t,c("count"),0.6)*(1-fin(t,c("where")+0.4,0.8)*0.0),()=>{glass(ctx,1420,560,470,rows.length*74+40,16,CYAN,{glow:12,ea:0.5,fill:"rgba(6,10,20,0.92)"});
    rows.forEach(([a,b,tt],i)=>withA(ctx,fin(t,tt,0.5),()=>{T(ctx,a,1444,604+i*74,{w:600,size:19,color:rgba(SOFT,0.95)});T(ctx,b,1444,634+i*74,{f:"mono",w:500,size:22});}));});
  // thirty frames, one behind the other
  const fa=fin(t,c("thirty")+0.2,0.8);if(fa>0&&FR.img){withA(ctx,fa*(1-fin(t,c("where")+0.2,0.6)),()=>{for(let i=29;i>=0;i--){const d=i*3.4*fa;ctx.globalAlpha=Math.min(1,fa)*(1-i/34);ctx.drawImage(FR.img,X0+d,Y0-d,fw,fh);}});}
  // the question
  withA(ctx,fin(t,c("where")+0.9,0.6),()=>tag(ctx,X0+fw/2,Y0+fh+44,"typed by nobody",AMBER,{align:"center",size:22}));
  vign(ctx,S);});

/* ---------- 3. Instructions, not pixels ---------- */
scene("draw",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const shp=t<c("rect")?0:t<c("more")?clamp((t-c("rect")-0.4)/1.2,0,1):1+clamp((t-c("more")+0.1)/0.8,0,4),hi=t<c("rect")?-1:Math.min(4,Math.floor(shp>=1?shp:0));
  const real=fin(t,c("real")-0.1,0.6),ras=fin(t,c("raster")-0.2,0.7);
  withA(ctx,fin(t,c("code")+0.4,0.6)*(1-real)*(1-ras),()=>codePanel(ctx,90,200,840,SIMPLE,{title:"simplified code",shown:t<c("rect")?0:shp+1,hi:hi<0?null:hi,size:23,lh:62,h:430}));
  withA(ctx,fin(t,0.3,0.6)*(1-ras),()=>stage(ctx,shp));
  // rasterising: the circle's edge, pixel by pixel
  withA(ctx,ras*(1-real),()=>{const cell=50,x=STG.x+10,y=STG.y+10,soft=fin(t,c("edge")+0.2,1.2);glass(ctx,STG.x-14,STG.y-14,STG.w+28,STG.h+28,20,AMBER,{glow:14,ea:0.4,fill:"rgba(4,7,14,0.96)"});
    ctx.save();ctx.beginPath();ctx.rect(STG.x-14,STG.y-14,STG.w+28,STG.h+28);ctx.clip();rasterGrid(ctx,x,y,cell,{hard:soft<0.5,fill:fin(t,c("raster")+0.3,0.8),outline:fin(t,c("raster")+1.0,0.6)*(1-0.6*soft),pct:fin(t,c("edge")+1.8,0.8)});ctx.restore();
    T(ctx,soft<0.5?"the edge of the circle: covered, or not":"the edge of the circle: part-covered pixels, part-coloured",STG.x,STG.y-30,{w:700,size:18,color:rgba(AMBER,1)});});
  withA(ctx,ras*(1-real),()=>codePanel(ctx,90,200,840,[[["fill ",CYAN],["circle ",INK],["x 560  y 150  r 100",SOFT]]],{title:"which pixels does this cover?",hi:0,size:23,lh:62,h:170}));
  // the real code: the film's lens, as it's drawn
  withA(ctx,real,()=>{realCode(ctx,90,150,860,560,SRC.gate,{title:"the real code: gate(), which draws a lens",file:"style2.js",size:19,reveal:(t-c("real"))/1.6});
    glass(ctx,1060,150,760,560,20,[190,210,240],{glow:14,ea:0.4,fill:"rgba(4,7,14,0.96)"});gate(ctx,1250,430,380,[190,225,255],"lens");gate(ctx,1440,430,380,[190,225,255],"tests");gate(ctx,1630,430,380,[190,225,255],"join");
    T(ctx,"lens",1250,665,{w:600,size:18,align:"center",color:rgba(SOFT,1)});T(ctx,"tests",1440,665,{w:600,size:18,align:"center",color:rgba(SOFT,1)});T(ctx,"join",1630,665,{w:600,size:18,align:"center",color:rgba(SOFT,1)});});
  vign(ctx,S);});

/* ---------- 4. Layers ---------- */
const GLITCH_CELL=8;
scene("layers",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const lt=fin(t,c("light")-0.3,0.7),gl=fin(t,c("glitch")-0.3,0.7),tileA=1-lt;
  // five sheets, pulled apart, then pressed together; then the picture goes on top and covers the timestamp
  if(tileA>0)withA(ctx,tileA*fin(t,0.2,0.6),()=>{const sw=fin(t,c("swap")-0.1,1.0),back=fin(t,c("swap")+2.6,0.8);
    const ex=t<c("order")+0.6?1:(1-fin(t,c("order")+0.6,1.2))+0.9*sw*(1-fin(t,c("swap")+1.3,0.9))*(1-back)+0*back;
    const order=sw>0.5&&back<0.5?["card","frame","corners","timestamp","picture"]:TL5;
    const shown=t<c("five")?clamp((t-c("tile")-1.0)/0.5,0,1):1+clamp((t-c("five"))/0.62,0,4);
    tileStack(ctx,820,520,300,order,ex,{dx:150,dy:-70,shown,hl:t>c("five")?TL5[clamp(Math.floor((t-c("five"))/0.62),0,4)]:null,names:1});
    withA(ctx,fin(t,c("swap")+1.8,0.6)*(1-back),()=>tag(ctx,820,760,"the timestamp is still there, underneath",AMBER,{align:"center",size:20}));
    withA(ctx,fin(t,c("order")+1.8,0.6)*(1-sw),()=>tag(ctx,820,760,"drawn in order, one on top of the other",CYAN,{align:"center",size:20}));});
  // light adds up
  withA(ctx,lt*(1-gl),()=>{const L=fin(t,c("lens")-0.2,0.7);
    withA(ctx,1-L,()=>{[[520,"painted: the later one covers","source-over",[255,110,60]],[1400,"light: the numbers add up","lighter",[255,240,255]]].forEach(([x,title,mode,res],i)=>{glass(ctx,x-360,170,720,560,20,i?CYAN:[190,210,240],{glow:12,ea:0.4,fill:"rgba(2,3,8,0.98)"});
        T(ctx,title,x,222,{w:700,size:22,align:"center",color:rgba(i?CYAN:SOFT,1)});glowPair(ctx,x,450,170,150*(1-0.3*fin(t,c("light")+0.8,1.2)),mode,1);
        withA(ctx,fin(t,c("light")+1.6+i*0.6,0.5),()=>{T(ctx,i?"70 + 255,  130 + 110,  255 + 60":"only the top colour",x,672,{f:"mono",w:500,size:18,align:"center",color:rgba(SOFT,1)});T(ctx,"= "+res.join(", "),x,702,{f:"mono",w:500,size:20,align:"center"});});});});
    // the film's lenses: glows added over tiles
    withA(ctx,L,()=>{const cam={x:1180,y:WX.Y,z:1.55};setCam(ctx,S,cam);worldBase(ctx,t);worldTiles(ctx,t+40);const gw=0.6+0.4*Math.sin(t*3);[1080,1290].forEach(x=>{glow(ctx,x,WX.Y,160,[190,225,255],0.35*gw);glow(ctx,x,WX.Y-60,90,C.hot,0.3);});
      setScreen(ctx,S);tag(ctx,960,92,"glow: drawn with lighter, so light adds to light",CYAN,{align:"center",size:20});});});
  // the glitch: red and blue slid sideways
  withA(ctx,gl,()=>{dark(ctx,S,0.0);const g0=c("glitch"),spread=150*(1-fin(t,g0+0.6,1.4)),sh=18*fin(t,g0+2.6,0.8)*(0.7+0.3*Math.sin(t*9)),size=380;
    glass(ctx,480,170,960,580,20,[190,210,240],{glow:12,ea:0.4,fill:"rgba(2,3,8,0.98)"});splitTile(ctx,960-size/2,450-size/2,size,sh,GLITCH_CELL,spread);
    if(spread>8)[["red",R_,-1],["green",G_,0],["blue",B_,1]].forEach(([n,cc,k])=>T(ctx,n,960+k*(size+2*spread)/3.2,700,{w:700,size:20,align:"center",color:rgba(cc,1)}));
    withA(ctx,fin(t,g0+2.8,0.6),()=>{tag(ctx,700,720,"← red",R_,{align:"center",size:19});tag(ctx,1220,720,"blue →",B_,{align:"center",size:19});});
    T(ctx,"one tile's picture, as three layers of numbers",960,215,{w:700,size:21,align:"center",color:rgba(SOFT,1)});});
  vign(ctx,S);});

/* ---------- 5. Components ---------- */
const ROWS10=[["e-1041","SIS",3,"raw"],["e-1042","LMS",8,"raw"],["e-1043","HR",15,"clean"],["e-1044","FIN",20,"raw"],["e-1045","SIS",1,"clean"],["e-1046","LMS",11,"clean"],["e-1047","SIS",17,"raw"],["e-1048","HR",6,"clean"],["e-1049","FIN",22,"clean"],["e-1050","LMS",13,"raw"]];
const APPK={SIS:"sis",LMS:"lms",HR:"hr",FIN:"fin"};
scene("parts",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const rw=fin(t,c("rows")-0.3,0.7),rl=fin(t,c("really")-0.2,0.6),sm=fin(t,c("same")-0.2,0.7);
  // the tile as a function, with its four inputs
  withA(ctx,(1-rw),()=>{const g=c("give"),step=i=>fin(t,g+0.3+i*0.75,0.4);
    codePanel(ctx,90,230,860,[[["tile",AMBER],["(",INK]],[["  position",INK],[":  x 1230, y 470",SOFT]],[["  size",INK],[":  260",SOFT]],[["  picture",INK],[":  piece 14 of the campus",SOFT]],[["  how clean",INK],[":  raw, clean",SOFT]],[[")",INK]]],
      {title:"simplified code",shown:t<c("hand")+0.8?0:6,hi:t<g?0:1+clamp(Math.floor((t-g-0.3)/0.75),0,3),size:23,lh:56});
    const x=lerp(1500,1230,step(0)),y=lerp(300,470,step(0)),sz=lerp(90,260,step(1)),cell=step(2)>0.5?14:5,q=step(3)>0.5?2:0;
    withA(ctx,fin(t,c("hand")+1.2,0.6),()=>dtile(ctx,x,y,sz,0,{cell,q,app:"lms",hi:true},1));});
  // ten rows of data, ten tiles
  withA(ctx,rw*(1-rl)*(1-sm),()=>{glass(ctx,90,170,720,620,18,CYAN,{glow:12,ea:0.5,fill:"rgba(6,10,20,0.93)"});T(ctx,"ten rows of data",114,210,{w:700,size:19,color:rgba(CYAN,1)});
    ["id","source","picture","stage"].forEach((h,i)=>T(ctx,h,120+i*170,254,{w:700,size:17,color:rgba(SOFT,0.9)}));
    ROWS10.forEach((r,i)=>{const on=fin(t,c("rows")+0.3+i*0.28,0.3),y=298+i*48;withA(ctx,0.35+0.65*on,()=>{r.forEach((v,j)=>T(ctx,""+v,120+j*170,y,{f:"mono",w:500,size:19,color:j===1?rgba(APP[APPK[r[1]]].c,1):rgba(INK,0.95)}));});
      if(on>0){const tx=1010+(i%5)*190,ty=330+Math.floor(i/5)*230;dtile(ctx,tx,ty,lerp(40,150,ease(on)),0,{cell:r[2],q:r[3]==="clean"?2:0,app:APPK[r[1]]},on);}});});
  // the real one
  withA(ctx,rl*(1-sm),()=>{realCode(ctx,160,170,1600,240,SRC.dtile,{title:"the real code: dtile(), which draws a data tile",file:"style2.js",size:21,reveal:(t-c("really"))/1.4});
    for(let i=0;i<9;i++)dtile(ctx,340+i*160,650,110,(hash(i,4)-0.5)*0.3,{cell:(i*5)%24,q:i%3===0?0:2,app:["sis","lms","hr","fin"][i%4]},fin(t,c("really")+1.2+i*0.12,0.3));});
  // the same functions, everywhere
  withA(ctx,sm,()=>{const s0=c("same");chip(ctx,960,230,null,"style2.js","the shared components",{align:"center",edge:AMBER});
    [["the film",460],["the labs",960],["the scenarios",1460]].forEach(([n,x],i)=>{glass(ctx,x-210,380,420,300,18,[190,210,240],{glow:12,ea:0.4,fill:"rgba(6,10,20,0.9)"});T(ctx,n,x,428,{w:700,size:22,align:"center"});
      for(let k=0;k<3;k++)dtile(ctx,x-120+k*120,560,90,0,{cell:(i*7+k*3)%24,q:2},1);
      ctx.strokeStyle=rgba(AMBER,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(960,262);ctx.quadraticCurveTo((960+x)/2,300,x,380);ctx.stroke();
      const v=(t-s0-2.6)/1.0;if(v>0&&v<1){const q=at(mk(bez(P(960,262),P((960+x)/2,300),P((960+x)/2,330),P(x,380),20)),v);glow(ctx,q.x,q.y,50,AMBER,0.9);}
      if(v>=1)glow(ctx,x,530,220,AMBER,0.25*(1-clamp(v-1,0,1)));});
    withA(ctx,fin(t,s0+2.4,0.5),()=>tag(ctx,960,300,"one fix",AMBER,{align:"center",size:18}));});
  vign(ctx,S);});

/* ---------- 6. The camera ---------- */
const CAM_FIT=[1460,470,0.49],CAM_IN=[1190,470,1.8];
scene("camera",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),f0=c("fly")+0.4,f1=f0+4.0;
  const cam=camAt([[0,CAM_FIT[0],CAM_FIT[1],CAM_FIT[2]],[f0,CAM_FIT[0],CAM_FIT[1],CAM_FIT[2]],[f1,CAM_IN[0],CAM_IN[1],CAM_IN[2]],[sc.dur+2,CAM_IN[0]+40,CAM_IN[1],CAM_IN[2]*1.04]],t);
  bgWorld(ctx,S,cam);worldBase(ctx,t);worldTiles(ctx,t+30);
  // what the camera will show: a screen-sized window onto the world
  const va=fin(t,c("notlens")+0.4,0.6)*(1-fin(t,f1-1.4,0.9));if(va>0){const w=W/CAM_IN[2],h=H/CAM_IN[2];withA(ctx,va,()=>{ctx.strokeStyle=rgba(AMBER,0.95);ctx.lineWidth=3/cam.z;ctx.setLineDash([16/cam.z,10/cam.z]);ctx.strokeRect(CAM_IN[0]-w/2,CAM_IN[1]-h/2,w,h);ctx.setLineDash([]);});}
  setScreen(ctx,S);
  withA(ctx,fin(t,c("world")+1.0,0.6)*(1-fin(t,c("notlens")-0.2,0.5)),()=>tag(ctx,960,110,"the whole platform, drawn once, in its own units",CYAN,{align:"center",size:20}));
  // the camera's three numbers
  withA(ctx,fin(t,c("notlens")-0.1,0.6),()=>{glass(ctx,1380,70,480,150,16,AMBER,{glow:12,ea:0.5,fill:"rgba(6,10,20,0.93)"});T(ctx,"the camera",1404,106,{w:700,size:19,color:rgba(AMBER,1)});
    [["across",cam.x.toFixed(0)],["down",cam.y.toFixed(0)],["zoom",cam.z.toFixed(2)]].forEach(([k,v],i)=>{const on=fin(t,c("notlens")+1.6+i*0.6,0.4);withA(ctx,0.35+0.65*on,()=>{T(ctx,k,1404+i*152,150,{w:600,size:17,color:rgba(SOFT,1)});T(ctx,v,1404+i*152,190,{f:"mono",w:500,size:30});});});});
  withA(ctx,fin(t,c("before")-0.1,0.6)*(1-fin(t,f0,0.6)),()=>{glass(ctx,60,70,1200,150,16,AMBER,{glow:14,ea:0.5,fill:"rgba(8,8,14,0.95)"});T(ctx,"the real code: setCam(), from core.js, run before anything is drawn",84,108,{w:700,size:18,color:rgba(AMBER,1)});
    const L=srcLines(SRC.setCam,96);L.forEach((l,i)=>T(ctx,l,84,150+i*30,{f:"mono",w:500,size:19,color:"rgba(255,226,190,0.95)"}));});
  vign(ctx,S);});

/* ---------- 7. Time ---------- */
scene("time",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),b0=c("back")+0.3;
  // world time: the film's clock, dragged back and forward while the narration says so
  const scrub=t<b0?0:-7*Math.sin(Math.PI*clamp((t-b0)/1.6,0,1))+(t>b0+1.6?9*Math.sin(Math.PI*clamp((t-b0-1.6)/1.8,0,1)):0),tw=t+58+scrub;
  const ov=fin(t,c("ease")-0.3,0.6),ex=fin(t,c("exact")-0.3,0.6);
  const cam={x:1300,y:540,z:1.3};bgWorld(ctx,S,cam);worldBase(ctx,t);const tiles=worldTiles(ctx,tw);
  // one tile, followed
  const k=Math.floor((58+c("where")+0.5-(1300-(WX.X0-180))/WX.V)/WX.INT),x=tileX(k,tw),fa=fin(t,c("where")-0.2,0.5)*(1-ov);
  if(fa>0&&x>720&&x<2050){withA(ctx,fa,()=>{ctx.strokeStyle=rgba(AMBER,0.95);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,WX.Y,44,0,TAU);ctx.stroke();ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(WX.X0-180,WX.Y+80);ctx.lineTo(x,WX.Y+80);ctx.stroke();ctx.setLineDash([]);
    T(ctx,"set off at "+(k*WX.INT).toFixed(1)+" s",x,WX.Y+116,{w:600,size:17,align:"center",color:rgba(AMBER,1)});});}
  setScreen(ctx,S);timeBar(ctx,120,140,1000,tw,40,110,fin(t,c("function")-0.2,0.6)*(1-ov),{label:"the moment to draw"});
  withA(ctx,fa,()=>{glass(ctx,1200,90,660,120,16,AMBER,{glow:12,ea:0.5,fill:"rgba(6,10,20,0.93)"});T(ctx,"x = 720 + 65 × (t − "+(k*WX.INT).toFixed(1)+")",1224,138,{f:"mono",w:500,size:22});
    T(ctx,"= "+x.toFixed(0),1224,178,{f:"mono",w:500,size:22,color:rgba(AMBER,1)});T(ctx,"start + speed × time since it set off",1836,178,{w:500,size:15,align:"right",color:rgba(SOFT,0.9)});});
  // easing, and randomness
  if(ov>0){dark(ctx,S,0.82*ov);setScreen(ctx,S);withA(ctx,ov*(1-ex),()=>{const ra=fin(t,c("random")-0.3,0.6);
    withA(ctx,1-ra,()=>{const u=((t-c("ease"))%2.6)/2.2;curvePlot(ctx,160,170,760,440,x=>x,clamp(u,0,1),[200,210,230],"constant speed: mechanical");curvePlot(ctx,1000,170,760,440,easeCam,clamp(u,0,1),CYAN,"eased in and out: calm");
      withA(ctx,fin(t,c("ease")+2.4,0.6),()=>{glass(ctx,1000,640,760,90,14,AMBER,{glow:10,ea:0.5,fill:"rgba(8,8,14,0.95)"});T(ctx,"the real code, core.js",1022,672,{w:700,size:16,color:rgba(AMBER,1)});T(ctx,SRC.easeCam,1022,708,{f:"mono",w:500,size:17,color:"rgba(255,226,190,0.95)"});});});
    withA(ctx,ra,()=>{glass(ctx,160,170,1600,120,14,AMBER,{glow:10,ea:0.5,fill:"rgba(8,8,14,0.95)"});T(ctx,"the real code, core.js: a number that looks random, but is always the same for the same n",184,206,{w:700,size:17,color:rgba(AMBER,1)});
      T(ctx,SRC.hash,184,254,{f:"mono",w:500,size:19,color:"rgba(255,226,190,0.95)"});
      for(let i=0;i<10;i++){const kk=40+i,p=tileProps(kk),x=250+i*160;dtile(ctx,x,470,110,0,{cell:p.cell,q:p.err||p.dup?0:1,app:p.app,err:p.err},fin(t,c("random")+0.6+i*0.1,0.3));
        T(ctx,"hash("+kk+")",x,560,{f:"mono",w:500,size:15,align:"center",color:rgba(SOFT,0.95)});T(ctx,hash(kk,51).toFixed(3),x,586,{f:"mono",w:500,size:17,align:"center"});
        if(p.err||p.dup)withA(ctx,fin(t,c("random")+1.6,0.4),()=>tag(ctx,x,630,p.err?"error":"duplicate",p.err?BAD:APP.hr.c,{align:"center",size:15}));}});});}
  // the same moment, twice
  if(ex>0){dark(ctx,S,0.9*ex);setScreen(ctx,S);withA(ctx,ex,()=>{["one computer","another computer"].forEach((n,i)=>{const x=150+i*840;glass(ctx,x-10,230,800,470,16,[190,210,240],{glow:10,ea:0.4,fill:"rgba(4,7,14,0.96)"});if(FR.img)ctx.drawImage(FR.img,x+10,250,760,428);T(ctx,n+" · t = 151.00",x+10,212,{w:600,size:19,color:rgba(SOFT,1)});});
    withA(ctx,fin(t,c("exact")+1.2,0.5),()=>tag(ctx,960,760,"the same numbers, pixel for pixel",GOOD,{align:"center",size:21}));});}
  vign(ctx,S);});

/* ---------- 8. Two ways to play ---------- */
scene("play",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const sz=fin(t,c("sizes")-0.3,0.7),fl=fin(t,c("flip")-0.3,0.7),A=(1-sz);
  withA(ctx,A*fin(t,0.2,0.6),()=>{T(ctx,"live, on the site",490,140,{w:800,size:30,align:"center",color:rgba(CYAN,1)});T(ctx,"a video file",1430,140,{w:800,size:30,align:"center",color:rgba(AMBER,1)});
    ctx.strokeStyle="rgba(255,255,255,0.1)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(960,110);ctx.lineTo(960,820);ctx.stroke();});
  // live: the browser asks the soundtrack where it is, and draws that moment
  withA(ctx,A*fin(t,c("live")-0.2,0.6),()=>{const tl=T231+Math.max(0,t-c("live")),mw=640;browserWin(ctx,170,180,mw,414,"roanboc.github.io/learning-data");
    const mini=ildMini(tl,mw-24);ctx.drawImage(mini,182,226,mw-24,(mw-24)*9/16);
    glass(ctx,170,620,mw,170,16,CYAN,{glow:10,ea:0.4,fill:"rgba(6,10,20,0.92)"});T(ctx,"soundtrack",194,656,{w:700,size:17,color:rgba(CYAN,1)});waveBar(ctx,194,672,mw-48,50,(tl-120)/60,CYAN);
    const tick=Math.floor(t*6)%2;T(ctx,"has played "+Math.floor(tl/60)+":"+(tl%60).toFixed(2).padStart(5,"0")+"  →  draw that moment",194,766,{f:"mono",w:500,size:18});
    withA(ctx,fin(t,c("live")+4.0,0.5),()=>tag(ctx,660,656,"every screen refresh",CYAN,{align:"center",size:15}));glow(ctx,800,656,16,CYAN,0.4+0.5*tick);});
  // video: a browser with no window draws every frame; an encoder keeps what changed
  withA(ctx,A*fin(t,c("video")-0.2,0.6),()=>{browserWin(ctx,1110,180,640,260,"a browser with no window, drawing every frame",{chrome:false});
    if(FR.img){for(let i=0;i<6;i++){const u=((t-c("video"))*1.2+i/6)%1,x=lerp(1180,1560,u),y=lerp(300,300,u);withA(ctx,sstep(0,0.1,u)*(1-sstep(0.85,1,u)),()=>ctx.drawImage(FR.img,x,y,160,90));}}
    chip(ctx,1430,500,null,"encoder","H.264",{align:"center",edge:AMBER});
    const d=fin(t,c("diff")-0.2,0.6);for(let i=0;i<5;i++){const x=1130+i*124,y=610;glass(ctx,x,y,112,63,6,[190,210,240],{glow:0,fill:"rgba(4,7,14,0.96)"});if(FR.img){ctx.save();ctx.globalAlpha*=i===0||d<0.5?1:0.18;ctx.drawImage(FR.img,x,y,112,63);ctx.restore();
      if(i>0&&d>0){withA(ctx,d,()=>{ctx.save();ctx.beginPath();ctx.rect(x+18,y+26,80,14);ctx.clip();ctx.drawImage(FR.img,x,y,112,63);ctx.restore();ctx.strokeStyle=rgba(AMBER,0.9);ctx.lineWidth=1.5;ctx.strokeRect(x+18,y+26,80,14);});}}}
    withA(ctx,d,()=>{T(ctx,"frame 1: all of it",1186,700,{w:600,size:15,align:"center",color:rgba(SOFT,0.95)});T(ctx,"then: only what changed",1500,700,{w:600,size:15,align:"center",color:rgba(AMBER,1)});});
    withA(ctx,fin(t,c("video")+3.2,0.6),()=>{ctx.fillStyle=rgba(AMBER,0.7);ctx.beginPath();ctx.moveTo(1430,540);ctx.lineTo(1420,580);ctx.lineTo(1440,580);ctx.fill();T(ctx,"inner-life-of-data.mp4",1430,760,{f:"mono",w:500,size:18,align:"center"});});});
  // the sizes, as areas
  withA(ctx,sz*(1-fl),()=>{const base=800,big=560,side=v=>big*Math.sqrt(v/84000);T(ctx,"The Inner Life of Data, 7 minutes 32 seconds, stored three ways",960,140,{w:700,size:24,align:"center",color:rgba(SOFT,1)});
    sizeSquare(ctx,300,base,big*fin(t,c("sizes")+0.2,1.0),[160,175,200],"about 84 GB","every frame as raw numbers",1);
    sizeSquare(ctx,1180,base-300,side(196)*fin(t,c("sizes")+3.4,0.6),AMBER,"about 200 MB","the video",fin(t,c("sizes")+3.2,0.4));
    sizeSquare(ctx,1180,base-60,Math.max(3,side(6.6))*fin(t,c("sizes")+6.0,0.5),CYAN,"about 7 MB","the code and the sound",fin(t,c("sizes")+5.8,0.4));});
  // a flipbook keeps every page; the recipe keeps none
  withA(ctx,fl,()=>{const f0=c("flip");T(ctx,"a flipbook",520,180,{w:800,size:28,align:"center"});T(ctx,"the recipe",1400,180,{w:800,size:28,align:"center",color:rgba(CYAN,1)});
    if(FR.img)for(let i=11;i>=0;i--){const lift=i===0?0:Math.max(0,Math.sin((t*3-i*0.4)))*0.0,x=300+i*8,y=260+i*10;ctx.save();ctx.globalAlpha*=1-i/14;ctx.drawImage(FR.img,x,y,440,248);ctx.strokeStyle="rgba(255,255,255,0.25)";ctx.strokeRect(x,y,440,248);ctx.restore();}
    const rf=(t*4)%1;if(FR.img){ctx.save();ctx.translate(300,260+248);ctx.transform(1,0,0,Math.cos(rf*Math.PI),0,0);ctx.globalAlpha*=0.9*(1-rf);ctx.drawImage(FR.img,0,-248,440,248);ctx.restore();}
    T(ctx,"13,566 pages, all kept",520,640,{w:600,size:19,align:"center",color:rgba(SOFT,1)});
    codePanel(ctx,1090,240,620,[[["for each moment ",INK],["t",AMBER],[":",INK]],[["  draw the film at ",INK],["t",AMBER]]],{size:24,lh:56,edge:CYAN});
    T(ctx,"no pages kept",1400,440,{w:600,size:19,align:"center",color:rgba(SOFT,1)});
    withA(ctx,fin(t,f0+4.0,0.6),()=>{ctx.strokeStyle=rgba(AMBER,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1400,470);ctx.quadraticCurveTo(1150,640,790,560);ctx.stroke();ctx.fillStyle=rgba(AMBER,0.9);ctx.beginPath();ctx.moveTo(780,556);ctx.lineTo(804,546);ctx.lineTo(800,572);ctx.fill();tag(ctx,1160,660,"the video: a flipbook made from the recipe",AMBER,{align:"center",size:18});});});
  vign(ctx,S);});

/* ---------- 9. 2:31 again ---------- */
scene("again",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),on=c("on"),B=c("breath");
  if(t<on)pixelView(ctx,S,W/2,H/2,1,{});else ildAt(ctx,S,T231+(t-on));
  const L=c("list"),words=[["numbers",0],["shapes",0.75],["layers",1.5],["components",2.35],["a camera",3.4],["time",4.4]],gone=1-fin(t,on+1.2,1.0);
  dark(ctx,S,0.35*fin(t,0.2,0.6)*(1-fin(t,on,0.8)));setScreen(ctx,S);
  words.forEach(([w,d],i)=>withA(ctx,fin(t,L+d,0.35)*gone,()=>tag(ctx,310+i*262,110,w,[CYAN,[190,210,240],VIOLET,AMBER,GOOD,CYAN][i],{align:"center",size:22})));
  // each idea, over the frame
  const e=i=>fin(t,L+words[i][1],0.4)*(1-fin(t,L+(words[i+1]?words[i+1][1]:5.4),0.4));
  withA(ctx,e(0),()=>{ctx.save();ctx.beginPath();ctx.arc(FOCUS.x,FOCUS.y,120,0,TAU);ctx.clip();ctx.imageSmoothingEnabled=false;const z=24;if(FR.img)ctx.drawImage(FR.img,FOCUS.x-FOCUS.x*z,FOCUS.y-FOCUS.y*z,W*z,H*z);ctx.restore();ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.beginPath();ctx.arc(FOCUS.x,FOCUS.y,120,0,TAU);ctx.stroke();});
  withA(ctx,e(1),()=>{ctx.save();ctx.translate(1200,330);ctx.scale(0.5,0.5);SHAPES.forEach(s=>s.d(ctx,1));ctx.restore();});
  withA(ctx,e(2),()=>tileStack(ctx,1450,420,200,TL5,0.8,{dx:90,dy:-50,names:0}));
  withA(ctx,e(3),()=>{for(let i=0;i<6;i++)dtile(ctx,1150+i*110,420,90,0,{cell:(i*4+2)%24,q:2},1);});
  const ca=fin(t,L+words[4][1],0.4),ta=fin(t,L+words[5][1],0.4);
  withA(ctx,ca*(1-ta),()=>{ctx.strokeStyle=rgba(GOOD,0.9);ctx.lineWidth=3;ctx.setLineDash([14,10]);ctx.strokeRect(240,170,1440,810);ctx.setLineDash([]);});
  const tv=t<on?T231:T231+(t-on);timeBar(ctx,560,230,800,tv,120,200,ta*gone);
  // the last line, then the end
  const eA=fin(t,B+0.8,0.8);withA(ctx,fin(t,c("end")-0.1,0.6)*(1-eA),()=>{dark(ctx,S,0.78);setScreen(ctx,S);T(ctx,"A picture is data.",960,470,{w:800,size:64,align:"center"});T(ctx,"A film is a function.",960,560,{w:800,size:64,align:"center",color:rgba(CYAN,1)});});
  if(eA>0){dark(ctx,S,eA*0.92);setScreen(ctx,S);withA(ctx,fin(t,B+1.2,0.8),()=>{T(ctx,"MAKING OF",960,420,{w:800,size:24,align:"center",color:rgba(CYAN,0.95)});T(ctx,"Data for Films",960,510,{w:800,size:80,align:"center"});
    T(ctx,"Every frame drawn by code. The narration is a synthetic voice.",960,580,{w:500,size:24,align:"center",color:rgba(SOFT,0.95)});T(ctx,"Learning Data",960,650,{w:700,size:22,align:"center",color:rgba(SOFT,0.8)});});}
  vign(ctx,S);});
