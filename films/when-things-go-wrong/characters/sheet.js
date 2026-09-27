/* The character sheet for When things go wrong: a line-up, one card per character, and the shot through Sam's screen into the platform.
   Every function draws a 1920 x 1080 frame; render.py saves them as images and a short video. */
CAPS_ON=false;
const ORDER=["mei","ben","ana","sam","leila","rosa","david"];
const EPI={mei:"Episode 1 · Silent change",ben:"Episode 1 · Silent change",ana:"Episode 1 · Silent change",sam:"Episodes 1 and 2 · the guide",
  leila:"Episode 2 · Too good to be true",rosa:"Episode 2 · Too good to be true",david:"Episode 2 · Too good to be true"};
function sideTag(ctx,P,x,y,align){const s=P.side+" · "+P.does+" the data",w=tw(ctx,s,17,700)+44,x0=align==="center"?x-w/2:x;
  glass(ctx,x0,y,w,34,17,P.edge,{glow:10,ea:0.7,fill:"rgba(12,20,40,0.8)"});led(ctx,x0+14,y+12,10,10,P.edge);T(ctx,s,x0+32,y+23,{w:700,size:17});}

function lineup(ctx,t){bg2(ctx);
  T(ctx,"When things go wrong · the people",80,92,{w:800,size:42});
  T(ctx,"Seven characters for the first two episodes. Their outline shows their side: cyan for technical, gold for business.",80,132,{w:500,size:21,color:rgba(SOFT,0.95)});
  const X=i=>240*(i+1);
  const group=(a,b,label,c)=>{const x0=X(a)-95,x1=X(b)+95;ctx.strokeStyle=rgba(c,0.35);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x0,262);ctx.lineTo(x1,262);ctx.stroke();T(ctx,label,(x0+x1)/2,248,{w:700,size:19,align:"center",color:rgba(c,0.95)});};
  group(0,2,"Episode 1 · Silent change",INK);group(3,3,"Both episodes · the guide",TECH);group(4,6,"Episode 2 · Too good to be true",INK);
  ORDER.forEach((id,i)=>{const P=PEOPLE[id];person(ctx,id,X(i),870,0.9,{pose:"stand",expr:"calm",t:t+i*0.7});
    T(ctx,P.name,X(i),920,{w:800,size:21,align:"center"});T(ctx,P.role,X(i),948,{w:500,size:16,align:"center",color:rgba(SOFT,0.95)});
    const s=P.side+" · "+P.does;T(ctx,s,X(i),978,{w:700,size:15,align:"center",color:rgba(P.edge,0.95)});});}

function card(ctx,id,t){bg2(ctx);const P=PEOPLE[id];
  T(ctx,P.name,80,100,{w:800,size:46});T(ctx,P.role+" · "+EPI[id],80,140,{w:500,size:22,color:rgba(SOFT,0.95)});sideTag(ctx,P,80,164);
  const poses=[["stand","Standing"],["phone","Reading an alert"],["explain","Explaining"]];
  poses.forEach(([p,label],i)=>{const x=220+i*350;person(ctx,id,x,1000,1.1,{pose:p,expr:p==="phone"?"concerned":"calm",t:t+i});T(ctx,label,x,1050,{w:600,size:19,align:"center",color:rgba(SOFT,0.95)});});
  const ex=[["calm","Calm","most of the time"],["concerned","Concerned","when numbers don't add up"],["relieved","Relieved","when it's fixed"]];
  ex.forEach(([e,label,note],i)=>{const x=1250,y=96+i*318,w=610,h=292;glass(ctx,x,y,w,h,22,P.edge,{glow:12,ea:0.45});
    ctx.save();rr(ctx,x+2,y+2,w-4,h-4,20);ctx.clip();const k=1.95*P.build.h;person(ctx,id,x+180,y+h/2+505*k+10,1.95,{pose:"stand",expr:e,t:t+2+i*1.3,glow:0.35});ctx.restore();
    T(ctx,label,x+360,y+h/2-6,{w:800,size:28});T(ctx,note,x+360,y+h/2+26,{w:500,size:18,color:rgba(SOFT,0.95)});});}

/* ---- the shot through Sam's screen ---- */
const SR={x:840,y:296,w:640,h:360};  // the laptop screen, in the room's coordinates
const FILM_T=259.5;                    // the moment of The Inner Life of Data seen through the screen: the whole platform, at the end of "The layers together"
let PF=null;
function platformFrame(t){if(!PF){PF=document.createElement("canvas");PF.width=1920;PF.height=1080;}const x=PF.getContext("2d");x.setTransform(1,0,0,1,0,0);renderFrame(x,1,FILM_T+t);return PF;}
function room(ctx,t){
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#0b1224");g.addColorStop(1,"#05080f");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // the window at dawn, with the campus outside
  const wx=70,wy=80,ww=600,wh=560;ctx.save();rr(ctx,wx,wy,ww,wh,10);ctx.clip();
  const sky=ctx.createLinearGradient(0,wy,0,wy+wh);sky.addColorStop(0,"#16264c");sky.addColorStop(0.55,"#5b4a78");sky.addColorStop(0.82,"#e0876a");sky.addColorStop(1,"#f6c37e");ctx.fillStyle=sky;ctx.fillRect(wx,wy,ww,wh);
  glow(ctx,wx+ww*0.62,wy+wh*0.9,220,[255,190,120],0.55);
  ctx.fillStyle="#0d1020";const bl=[[0,120,90],[80,70,150],[140,110,60],[240,160,100],[330,90,70],[390,200,40],[430,130,80],[500,80,110],[560,150,60]];
  for(const [x,h2,w2] of bl)ctx.fillRect(wx+x,wy+wh-h2,w2,h2);ctx.fillRect(wx+398,wy+wh-260,24,70);ctx.beginPath();ctx.moveTo(wx+396,wy+wh-260);ctx.lineTo(wx+410,wy+wh-292);ctx.lineTo(wx+424,wy+wh-260);ctx.fill();
  ctx.fillStyle="rgba(255,214,150,0.8)";for(let i=0;i<22;i++){const x=wx+hash(i,1)*ww,y=wy+wh-hash(i,2)*120;if(y>wy+wh-40||hash(i,3)>0.5)ctx.fillRect(x,y,4,5);}
  ctx.restore();glass(ctx,wx,wy,ww,wh,10,[255,200,150],{glow:30,ga:0.25,fill:"rgba(0,0,0,0)",ea:0.5});
  ctx.strokeStyle="rgba(20,26,44,0.95)";ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh);ctx.moveTo(wx,wy+wh*0.45);ctx.lineTo(wx+ww,wy+wh*0.45);ctx.stroke();
  const spill=ctx.createRadialGradient(wx+ww*0.6,wy+wh,50,wx+ww*0.6,wy+wh,900);spill.addColorStop(0,"rgba(255,170,110,0.18)");spill.addColorStop(1,"rgba(255,170,110,0)");ctx.fillStyle=spill;ctx.fillRect(0,0,W,H);
  // the desk
  const d=ctx.createLinearGradient(0,700,0,H);d.addColorStop(0,"#1a2440");d.addColorStop(1,"#0a0f1c");ctx.fillStyle=d;ctx.beginPath();ctx.moveTo(0,712);ctx.lineTo(W,700);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(170,200,245,0.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,712);ctx.lineTo(W,700);ctx.stroke();
  // a mug, still warm
  const mx=1660,my=706;ctx.save();ctx.fillStyle="#d9dde6";ctx.beginPath();rr(ctx,mx-38,my-86,76,86,10);ctx.fill();ctx.strokeStyle="#d9dde6";ctx.lineWidth=10;ctx.beginPath();ctx.arc(mx+44,my-46,20,-1.2,1.2);ctx.stroke();
  ctx.fillStyle=rgba(TECH,0.9);ctx.fillRect(mx-38,my-60,76,10);ctx.restore();
  ctx.strokeStyle="rgba(230,236,250,0.18)";ctx.lineWidth=4;ctx.lineCap="round";for(let i=0;i<3;i++){const p=((t*0.35+i/3)%1);ctx.globalAlpha=Math.sin(p*Math.PI);ctx.beginPath();ctx.moveTo(mx-16+i*16,my-96-p*60);ctx.bezierCurveTo(mx-30+i*16,my-120-p*60,mx+i*16,my-140-p*60,mx-14+i*16,my-170-p*60);ctx.stroke();}ctx.globalAlpha=1;
  // the laptop
  ctx.save();ctx.shadowColor="rgba(120,200,255,0.5)";ctx.shadowBlur=60;ctx.fillStyle="#0e1526";ctx.beginPath();rr(ctx,SR.x-22,SR.y-22,SR.w+44,SR.h+44,16);ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(170,200,245,0.4)";ctx.lineWidth=2;ctx.beginPath();rr(ctx,SR.x-22,SR.y-22,SR.w+44,SR.h+44,16);ctx.stroke();
  ctx.fillStyle="#1a2338";ctx.beginPath();ctx.moveTo(SR.x-60,SR.y+SR.h+22);ctx.lineTo(SR.x+SR.w+60,SR.y+SR.h+22);ctx.lineTo(SR.x+SR.w+100,SR.y+SR.h+50);ctx.lineTo(SR.x-100,SR.y+SR.h+50);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(170,200,245,0.3)";ctx.stroke();}
function dashboard(ctx,t,thread){ // what Sam's screen shows, drawn at 1920 x 1080 and scaled into the laptop
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#0d1630");g.addColorStop(1,"#070b18");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  T(ctx,"Learning Data · Enrolments",80,96,{w:800,size:40});T(ctx,"Tuesday 07:58",1840,96,{w:600,size:30,align:"right",color:rgba(SOFT,0.95)});
  glass(ctx,80,160,980,840,28,LAYER.gold,{glow:26});
  glass(ctx,110,190,920,72,20,[255,190,90],{fill:"rgba(90,60,10,0.55)",glow:14});led(ctx,138,218,16,16,[255,190,90]);
  T(ctx,"Last good data as of yesterday, 23:02 · checking a failed test",170,238,{w:700,size:28,color:"rgba(255,226,170,0.98)"});
  T(ctx,"Class fill · Data Science 101",130,340,{w:700,size:40});T(ctx,"94%",130,600,{w:800,size:230});T(ctx,"of 120 seats, on census date",136,670,{w:500,size:32,color:rgba(SOFT,0.95)});
  ctx.fillStyle="rgba(255,255,255,0.08)";rr(ctx,136,720,860,26,13);ctx.fill();ctx.fillStyle=rgba(LAYER.gold,0.9);rr(ctx,136,720,860*0.94,26,13);ctx.fill();
  T(ctx,"Owner: Registrar's office · exposure: census_report",136,830,{w:500,size:26,f:"mono",color:rgba(SOFT,0.9)});
  glass(ctx,1120,160,720,400,28,BAD,{glow:22});led(ctx,1156,206,18,18,BAD);T(ctx,"Test failed overnight",1190,226,{w:800,size:36});
  T(ctx,"accepted_values",1156,300,{w:500,size:28,f:"mono",color:rgba(INK,0.95)});T(ctx,"stg_enrolments.status",1156,342,{w:500,size:28,f:"mono",color:rgba(INK,0.95)});
  T(ctx,"new value: WAITLISTED",1156,410,{w:500,size:28,f:"mono",color:"rgba(255,150,140,1)"});T(ctx,"Build stopped · 14 models skipped",1156,480,{w:600,size:26,color:rgba(SOFT,0.95)});
  const N=[["exposure",1180,660],["mart",1400,640],["intermediate",1620,700],["staging",1620,840],["source",1400,900],["bronze",1180,880]];
  ctx.strokeStyle="rgba(170,200,245,0.4)";ctx.lineWidth=3;ctx.beginPath();N.forEach(([,x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
  N.forEach(([n,x,y])=>{const bad=n==="staging",w=tw(ctx,n,24,600)+40;glass(ctx,x-w/2,y-26,w,52,14,bad?BAD:[170,200,245],{glow:bad?16:6});T(ctx,n,x,y+9,{w:600,size:24,align:"center"});});
  if(thread>0){const pts=[[400,560],[700,760],[1180,660],[1400,640],[1620,700],[1620,840],[1400,900],[1180,880],[960,560]];const n=pts.length-1,k=thread*n;
    const sub=[pts[0]];for(let i=1;i<=Math.ceil(k)&&i<=n;i++){const f=Math.min(1,k-(i-1));sub.push([lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f)]);}
    beam(ctx,sub.map(([x,y])=>({x,y})),BAD,[[22,0.08],[9,0.2],[3,0.8],[1.4,1]]);}}
function throughScreen(ctx,u,t){
  const z1=W/SR.w,z=u<0.12?1+u*0.2:u<0.86?lerp(1.024,z1,ease((u-0.12)/0.74)):z1*(1+(u-0.86)*0.35);
  const p=clamp((z-1)/(z1-1),0,1),cx=lerp(W/2,SR.x+SR.w/2,p),cy=lerp(H/2,SR.y+SR.h/2,p);
  ctx.save();ctx.fillStyle="#000";ctx.fillRect(0,0,W,H);ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-cx,-cy);
  room(ctx,t);
  // the screen: the dashboard fades like glass, and the platform shows through it
  const see=ease(clamp((u-0.5)/0.22,0,1));ctx.save();rr(ctx,SR.x,SR.y,SR.w,SR.h,6);ctx.clip();ctx.translate(SR.x,SR.y);ctx.scale(SR.w/W,SR.h/H);
  if(see>0)ctx.drawImage(platformFrame(t),0,0);
  if(see<1){ctx.globalAlpha=1-see;dashboard(ctx,t,clamp((u-0.2)/0.3,0,1));ctx.globalAlpha=1;}
  // the red thread runs upstream across the platform: from the data product, through gold, silver and bronze, to the student system
  if(see>0.15){const pts=[[1480,490],[1300,560],[1096,580],[776,580],[442,580],[250,520],[120,470]],k=ease(clamp((u-0.58)/0.36,0,1))*(pts.length-1),a=clamp((see-0.15)/0.4,0,1);
    const sub=[pts[0]];for(let i=1;i<=Math.ceil(k)&&i<pts.length;i++){const f=Math.min(1,k-(i-1));sub.push([lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f)]);}
    if(sub.length>1){beam(ctx,sub.map(([x,y])=>({x,y})),BAD,[[30,0.08*a],[12,0.22*a],[4,0.85*a],[1.8,a]]);const e=sub[sub.length-1];glow(ctx,e[0],e[1],40,BAD,0.8*a);}}
  const sh=ctx.createLinearGradient(0,0,W,H);sh.addColorStop(0,"rgba(255,255,255,"+(0.06*(1-see))+")");sh.addColorStop(0.4,"rgba(255,255,255,0)");ctx.fillStyle=sh;ctx.fillRect(0,0,W,H);
  ctx.restore();ctx.restore();
  // Sam, in the foreground, moves out of frame faster than the room: that difference gives the push its depth
  const zf=1+(z-1)*1.5;if(zf<4){ctx.save();ctx.translate(W/2,H/2);ctx.scale(zf,zf);ctx.translate(-lerp(W/2,SR.x+SR.w/2,p),-lerp(H/2,SR.y+SR.h/2,p));
    personBack(ctx,"sam",430,1765,2.4,{t});ctx.restore();}}
