/* ===== When things go wrong · Too good to be true: scenes =====
   Eight chapters, as in ../script.md. The committee's room is a room at dawn light, as in Silent change; the platform is The Inner Life of Data's world of light.
   The layouts follow the approved style frames (../frames/): the gauge, Monday night, three Tuesdays and the reload. */
const pulse=(t,t0,d)=>t>t0&&t<t0+(d||2.2)?Math.sin(Math.PI*(t-t0)/(d||2.2)):0;
const TREND=[7240,7310,7390,7460,7520,7610,7700,7760,7840,7910,7990,8060,8200];
const trendTo=n=>TREND.concat([n]);
// a number rolling from a to b over d seconds from t0
const roll=(t,t0,a,b,d)=>lerp(a,b,ease(clamp((t-t0)/(d||1.6),0,1)));

/* ---------- 1. Tuesday, 10:05 · One version of Tuesday ---------- */
scene("open",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");
  room(ctx,S,t,{wx:70});camKeys(ctx,S,[[0,960,540,1.0],[c("number"),990,500,1.05],[c("version"),990,500,1.05],[sc.dur+1,1000,495,1.07]],t);
  const frozen=fin(t,c("version")+0.2,0.8);
  person(ctx,"david",560,1180,1.3,{pose:"stand",pose2:"explain",mix:fin(t,c("approve")+0.3,0.6),expr:t>c("number")+0.5?"relieved":"calm",t:frozen>0.5?c("version")+0.2:t});
  committeeDash(ctx,820,120,1000,500,{num:11340,delta:38.3,s:1.25,trend:trendTo(11340)});
  if(pulse(t,c("number")+0.3,2.4)>0)withA(ctx,pulse(t,c("number")+0.3,2.4),()=>{ctx.strokeStyle=DB.blue;ctx.lineWidth=4;rr(ctx,837,215,966,390,10);ctx.stroke();});
  withA(ctx,fin(t,c("approve")+1.2),()=>planBoard(ctx,860,660,300,["+600 places",fin(t,c("approve")+3.0)>0.5?"rooms booked":" ",fin(t,c("approve")+4.2)>0.5?"tutors to hire":" "],GRN));
  withA(ctx,fin(t,c("approve")+0.4),()=>tag(ctx,1410,700,"approved",GRN,{align:"center",size:24}));
  // the picture freezes: this is one version of Tuesday
  if(frozen>0){setScreen(ctx,S);ctx.fillStyle="rgba(8,10,18,"+(0.45*frozen)+")";ctx.fillRect(0,0,W,H);withA(ctx,frozen,()=>tag(ctx,1700,200,"Version 1 of Tuesday",SOFT,{align:"center",size:24}));}
  setScreen(ctx,S);clockChip(ctx,S,"Tue 10:05","planning committee",fin(t,0.3)*(1-fin(t,B,0.5)));
  // the title, over a darker frame
  const oA=fin(t,B+0.1,0.6),tA=fin(t,B+0.6,0.7);if(oA>0){setScreen(ctx,S);ctx.fillStyle="rgba(3,5,11,"+oA+")";ctx.fillRect(0,0,W,H);
    withA(ctx,tA,()=>{glow(ctx,960,500,420,AMB,0.1);T(ctx,"WHEN THINGS GO WRONG",960,450,{w:800,size:26,align:"center",color:rgba(AMB,0.95)});T(ctx,"Too good to be true",960,540,{w:800,size:88,align:"center"});
      T(ctx,"what a test on a number is for",960,600,{w:600,size:26,align:"center",color:rgba(SOFT,0.95)});});
    withA(ctx,fin(t,sc.dur-1.2,0.6),()=>T(ctx,"Monday",960,700,{w:700,size:30,align:"center",f:"mono",color:rgba(SOFT,0.9)}));}
  if(t<1.4){setScreen(ctx,S);ctx.fillStyle="rgba(0,0,0,"+(1-ease(t/1.4))+")";ctx.fillRect(0,0,W,H);}});

/* ---------- 2. The number and its limits ---------- */
// what the platform shows, in the approved gauge frame's layout
function limitsWorld(ctx,t,c,o){o=o||{};const card=o.card||0,leila=o.leila||0,rev=o.reveal==null?3:o.reveal;
  withA(ctx,leila,()=>{callTile(ctx,"leila",80,170,400,300,{t,expr:"calm",hi:1});
    glass(ctx,80,500,400,260,18,BIZ,{glow:12,ea:0.6,fill:"rgba(10,16,32,0.92)"});T(ctx,"Applications per night",102,538,{w:700,size:19});T(ctx,"last year",102,562,{w:500,size:15,color:rgba(SOFT,0.95)});
    const d=[1.1,0.9,1.3,1.0,1.2,0.8,1.1,1.4,1.0,1.2,5.0,1.3,1.0,1.1],bx=102,by=730,bw=356,g=ease(clamp(((o.chart||0)),0,1));
    d.forEach((v,i)=>{const hh=v*26*(i===10?g:1),xx=bx+i*(bw/d.length);ctx.fillStyle=rgba(i===10?AMB:BIZ,i===10?0.95:0.55);rr(ctx,xx,by-hh,bw/d.length-6,Math.max(1,hh),3);ctx.fill();});
    withA(ctx,g,()=>tag(ctx,bx+10*(bw/d.length)+10,by-160,"closing date · +15%",AMB,{align:"center",size:15}));});
  numberPainting(ctx,560,150,880,440,{num:8200,gauge:{reveal:rev},gaugeV:0.9,stamp:"Monday · intake 2027"});
  plaque(ctx,560,630,420,[["Data product","gold.applications_daily"],["Used by","Planning committee"]],LAYER.gold);
  withA(ctx,card,()=>appContract(ctx,1010,580,830,{hi:o.hi||0,h:300}));
  withA(ctx,o.warn||0,()=>tag(ctx,1470,300,"warn · the data goes through",AMB,{size:19}));
  withA(ctx,o.err||0,()=>tag(ctx,1470,360,"error · the build stops",RED,{size:19}));}
scene("limits",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  const o={card:fin(t,c("card")+0.3,0.8),hi:fin(t,c("card")+2.0,0.8),leila:fin(t,c("leila")+0.2,0.8),chart:(t-c("leila")-2.8)/1.2,
    reveal:clamp((t-c("warn")+0.6)/0.9,0,1)+clamp((t-c("warn")+0.2)/0.9,0,1)+clamp((t-c("error")+0.2)/0.9,0,1),warn:fin(t,c("warn")+1.2),err:fin(t,c("error")+1.2)};
  // through the screen: Sam at a desk on Monday afternoon; the laptop turns to glass, and the camera passes through it
  const SR={x:760,y:250,w:560,h:315},u=ease(clamp((t-0.9)/2.0,0,1)),z1=W/SR.w;
  if(u<1){const z=lerp(1,z1,u),cx=lerp(W/2,SR.x+SR.w/2,u),cy=lerp(H/2,SR.y+SR.h/2,u);room(ctx,S,t,{top:"#0d162c",cam:{z:lerp(1,1.35,u),x:cx,y:cy}});ctx.setTransform(S*z,0,0,S*z,S*(W/2-cx*z),S*(H/2-cy*z));
    ctx.save();ctx.shadowColor="rgba(120,200,255,0.5)";ctx.shadowBlur=50;ctx.fillStyle="#0e1526";rr(ctx,SR.x-18,SR.y-18,SR.w+36,SR.h+36,14);ctx.fill();ctx.restore();
    ctx.save();rr(ctx,SR.x,SR.y,SR.w,SR.h,6);ctx.clip();ctx.translate(SR.x,SR.y);ctx.scale(SR.w/W,SR.h/H);bg2(ctx);limitsWorld(ctx,t,c,{reveal:0});ctx.restore();
    ctx.fillStyle="#1a2338";ctx.beginPath();ctx.moveTo(SR.x-50,SR.y+SR.h+18);ctx.lineTo(SR.x+SR.w+50,SR.y+SR.h+18);ctx.lineTo(SR.x+SR.w+90,SR.y+SR.h+44);ctx.lineTo(SR.x-90,SR.y+SR.h+44);ctx.closePath();ctx.fill();
    const zf=1+(z-1)*1.5;if(zf<3.2){ctx.setTransform(S*zf,0,0,S*zf,S*(W/2-cx*zf),S*(H/2-cy*zf));personBack(ctx,"sam",420,1745,2.3,{t});}
    setScreen(ctx,S);clockChip(ctx,S,"Mon 15:10","Sam, the data engineer",fin(t,0.2));return;}
  world(ctx,S);camKeys(ctx,S,[[2.9,960,540,1.0],[sc.dur+1,960,535,1.01]],t);
  limitsWorld(ctx,t,c,o);setScreen(ctx,S);clockChip(ctx,S,"Mon 15:10","through Sam's screen",1);});

/* ---------- 3. Monday night ---------- */
function nightWorld(ctx,t,c,o){const y=470;
  sysCard(ctx,40,y-70,280,140,"Admissions system",o.restart>0.5?"sync restarted · 23:14":"sync · 23:00",ADM);
  withA(ctx,o.restart*fout(t,c("rows"),0.8),()=>tag(ctx,180,y-110,"timeout · restart",AMB,{align:"center",size:16}));
  lane(ctx,[{x:320,y},{x:380,y}],ADM,0.8);
  packets(ctx,t,[{x:320,y},{x:350,y},{x:380,y}],0.5,0.9,c("sync"),ADM,14,0.9,c("rows"));
  packets(ctx,t,[{x:320,y},{x:350,y},{x:380,y}],0.35,0.9,c("restart")+1.2,[235,215,255],14,0.9,c("rows"));
  vault(ctx,380,y-170,260,340,LAYER.bronze,pairCells(true,Math.floor(11*o.dup)),"Bronze","as it arrived");
  lane(ctx,[{x:640,y},{x:720,y}],ADM,0.6);gate(ctx,720,y,150,o.checks>0?GRN:[170,205,255],"tests");
  ["unique ID","not empty","course exists"].forEach((s,i)=>{const a=clamp(o.checks*3-i,0,1);if(a>0)withA(ctx,a,()=>checkPill(ctx,620,y-345+i*54,s,"pass"));});
  withA(ctx,clamp(o.checks,0,1),()=>T(ctx,"row checks",720,y+110,{w:700,size:18,align:"center",color:rgba(GRN,0.95)}));
  lane(ctx,[{x:750,y},{x:800,y}],[214,228,255],0.6);vault(ctx,800,y-170,240,340,LAYER.silver,(r,c2)=>hash(r*7+c2,3)<0.78?[214,228,255]:null,"Silver","consistent");
  const red=o.red;lane(ctx,[{x:1040,y},{x:1110,y}],[214,228,255],0.6);gate(ctx,1110,y,150,mixc([170,205,255],RED,red),"tests");if(red>0)glow(ctx,1110,y,110,RED,0.35*red);
  T(ctx,"total",1110,y+110,{w:700,size:18,align:"center",color:rgba(mixc(SOFT,RED,red),1)});
  withA(ctx,1-0.45*red,()=>vault(ctx,1180,y-170,220,340,LAYER.gold,(r,c2)=>hash(r*5+c2,2)<0.6?LAYER.gold:null,"Gold",red>0.5?"not rebuilt":"the painting"));
  if(red>0)withA(ctx,red,()=>{ctx.save();ctx.shadowColor=rgba(RED,0.9);ctx.shadowBlur=16;ctx.strokeStyle=rgba(RED,1);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(1160,y-60);ctx.lineTo(1160,y+60);ctx.stroke();ctx.restore();});
  // the total, and its gauge
  withA(ctx,o.panel,()=>{const col=mixc([170,205,255],RED,red);glass(ctx,1440,150,440,620,24,col,{glow:26,ea:0.9,fill:red>0.5?"rgba(20,8,12,0.9)":"rgba(8,14,28,0.9)"});
    T(ctx,"Applications for next year",1660,206,{w:700,size:22,align:"center"});T(ctx,"8,200  →  "+fmtN(o.num),1660,262,{w:800,size:40,align:"center",f:"mono"});
    gauge(ctx,1660,500,150,(o.num/8200-1)*100,{});
    withA(ctx,o.real,()=>T(ctx,"real growth: 40",1660,660,{w:700,size:24,align:"center",color:rgba(SOFT,1)}));
    withA(ctx,red,()=>T(ctx,"error · the build stops before gold",1660,720,{w:700,size:20,align:"center",color:"rgba(255,170,160,1)"}));});
  withA(ctx,o.pair,()=>{glass(ctx,380,730,660,180,18,[170,205,255],{glow:8,ea:0.45,fill:"rgba(8,14,28,0.9)"});T(ctx,"3,100 applications, copied again with new IDs",404,768,{w:700,size:19});
    appTile(ctx,404,800,30,"A-40211 · applicant 88213 · BSc Data Science · 2027");appTile(ctx,404,852,30,"A-47988 · applicant 88213 · BSc Data Science · 2027",{dup:true});});}
scene("night",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  world(ctx,S);camKeys(ctx,S,[[0,600,470,1.25],[c("twice"),600,470,1.25],[c("rows")-0.2,760,500,1.05],[c("total")-0.2,960,540,1.0],[c("red"),1180,480,1.12],[c("see")-0.3,1180,480,1.12],[c("see")+1.0,960,540,1.0],[sc.dur+1,960,540,1.0]],t);
  const num=roll(t,c("total")+0.6,8200,11340,1.8);
  nightWorld(ctx,t,c,{restart:fin(t,c("restart")+0.4),dup:clamp((t-c("restart")-1.2)/5,0,1),checks:clamp((t-c("rows")-1.6)/3.0,0,1)*1.001,
    panel:fin(t,c("total")+0.1,0.6),num,red:fin(t,c("red")+0.2,0.5),real:fin(t,c("total")+3.2),pair:fin(t,c("see")+0.6,0.8)});
  setScreen(ctx,S);clockChip(ctx,S,t<c("rows")?"Mon 23:00":"Tue 02:00",t<c("rows")?"the nightly sync":"the nightly build",fin(t,0.2));});

/* ---------- 4. Three Tuesdays ---------- */
const COLS=[[40,"Version 1 · no test",SOFT],[670,"Version 2 · warning",AMB],[1300,"Version 3 · error",RED]],CW=580;
function tuesdayCol(ctx,t,c,i,o){const [x,label,col]=COLS[i],cx=x+CW/2;glass(ctx,x,110,CW,820,24,col,{glow:o.focus?22:10,ea:o.focus?0.9:0.5,fill:"rgba(10,16,32,0.72)"});tag(ctx,cx,150,label,col,{align:"center",size:20});
  const g=o.g,v=38.3*ease(clamp(g,0,1));
  if(i===0){gauge(ctx,cx,308,60,38.3,{none:true});
    committeeDash(ctx,x+30,360,520,250,{num:11340,delta:38.3,s:0.9,crack:o.later,trend:trendTo(11340)});
    withA(ctx,o.decide,()=>planBoard(ctx,x+30,640,250,["+600 places","rooms booked","tutors to hire"],GRN));
    withA(ctx,o.later,()=>planBoard(ctx,x+300,640,250,["3 weeks later","copies found","−600 places","rooms released"],RED));
    withA(ctx,o.note,()=>T(ctx,"acted on a wrong number",cx,200,{w:700,size:20,align:"center",color:rgba(SOFT,1)}));}
  if(i===1){gauge(ctx,cx,308,60,v,{warnOnly:true});
    committeeDash(ctx,x+30,360,520,250,{num:11340,delta:38.3,s:0.9,trend:trendTo(11340)});
    withA(ctx,o.channel,()=>alertChannel(ctx,x+30,640,300,234,40,{hi:4}));
    withA(ctx,o.decide,()=>planBoard(ctx,x+350,640,200,["+600 places","same decision"],GRN));
    withA(ctx,o.note,()=>T(ctx,"a note, not a brake",cx,200,{w:700,size:20,align:"center",color:"rgba(255,220,160,1)"}));}
  if(i===2){gauge(ctx,cx,308,60,v,{});
    committeeDash(ctx,x+30,360,520,250,{num:8200,note:o.banner>0.5,s:0.9,noteText:"Last good data as of Mon 02:00",trend:TREND});
    withA(ctx,o.decide,()=>{callTile(ctx,"david",x+30,640,230,230,{t,expr:"calm"});planBoard(ctx,x+280,640,270,["Decision","moved to Wednesday"],BIZ);});
    withA(ctx,o.note,()=>T(ctx,"a day late, and right",cx,200,{w:700,size:20,align:"center",color:rgba(GRN,1)}));}}
scene("tuesdays",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");
  world(ctx,S);
  // in the wordless breather, the first two versions fade and the third fills the screen
  const pick=ease(clamp((t-c("ours")-0.4)/2.4,0,1));
  camKeys(ctx,S,[[0,960,520,1.0],[B,960,520,1.0],[B+2.6,1590,520,1.3],[sc.dur+1,1590,520,1.32]],t);
  withA(ctx,fin(t,0.2,0.8),()=>T(ctx,"Tuesday 10:05 · three versions",960,74,{w:800,size:30,align:"center"}));
  const f=t<c("warning")?0:t<c("error")?1:2,all=t>c("acted")-0.3;
  const O=[{g:1,decide:fin(t,c("none")+1.4),later:fin(t,c("later")+0.4),note:fin(t,c("later")+2.8)},
    {g:clamp((t-c("warning")-0.6)/1.4,0,1),channel:fin(t,c("channel")+0.2),decide:fin(t,c("channel")+3.6),note:fin(t,c("channel")+4.4)},
    {g:clamp((t-c("error")-0.4)/1.4,0,1),banner:fin(t,c("banner")+0.2),decide:fin(t,c("david")+0.2),note:fin(t,c("david")+2.6)}];
  [0,1,2].forEach(i=>{const shown=fin(t,c(["none","warning","error"][i])-0.8,0.8),dim=all?1:(i===f?1:0.4),gone=i<2?1-pick*0.85:1;
    if(shown>0)withA(ctx,shown*dim*gone,()=>tuesdayCol(ctx,t,c,i,Object.assign({focus:(!all&&i===f)||(i===2&&pick>0.5)},O[i])));});
});

/* ---------- 5. Choosing the level ---------- */
scene("level",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);
  world(ctx,S);camKeys(ctx,S,[[0,960,520,1.0],[sc.dur+1,960,520,1.03]],t);
  const cards=fin(t,c("count")-0.2,0.8),gA=1-cards;
  withA(ctx,gA,()=>{const v=roll(t,c("real")+0.6,0.8,14,1.6);glass(ctx,160,150,760,640,28,[170,205,255],{glow:14,ea:0.5,fill:"rgba(8,14,28,0.88)"});
    T(ctx,"Applications for next year",540,210,{w:700,size:24,align:"center"});T(ctx,t<c("real")+0.6?"an ordinary night":"a closing date",540,246,{w:600,size:19,align:"center",color:rgba(SOFT,0.95)});
    gauge(ctx,540,520,210,v,{});
    withA(ctx,fin(t,c("two")+0.6),()=>{tag(ctx,540,700,"amber · worth a look",AMB,{align:"center",size:20});});
    withA(ctx,fin(t,c("two")+2.0),()=>{tag(ctx,540,752,"red · must not reach a decision",RED,{align:"center",size:20});});
    // the warning goes to its owner, who reads it
    withA(ctx,fin(t,c("real")+2.4),()=>{callTile(ctx,"leila",1040,150,300,220,{t,expr:"calm",hi:1});
      msg(ctx,1370,160,470,"Warning → Leila","applications +14% overnight",AMB,1);});
    withA(ctx,fin(t,c("real")+4.2),()=>msg(ctx,1370,290,470,"Leila","A closing date: expected. Closing it.",BIZ,1));
    // a wall of alarms, crossed out; then a short list with owners
    const wall=fin(t,c("reads")-0.2,0.6)*fout(t,c("reads")+2.4,0.6),few=fin(t,c("reads")+2.6,0.7);
    withA(ctx,wall,()=>{alertChannel(ctx,1040,440,800,330,40,{});ctx.strokeStyle=rgba(RED,0.9);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(1060,460);ctx.lineTo(1820,750);ctx.stroke();});
    withA(ctx,few,()=>{glass(ctx,1040,440,800,250,18,[170,205,255],{glow:10,ea:0.5,fill:"rgba(8,14,28,0.92)"});T(ctx,"Warnings, each with an owner",1064,484,{w:800,size:22});
      [["applications · overnight change","leila"],["tuition file · late","rosa"],["enrolments · status","sam"]].forEach(([s,id],i)=>{const P=PEOPLE[id],yy=530+i*50;
        ctx.fillStyle="rgba(40,32,14,0.8)";rr(ctx,1060,yy-4,760,40,8);ctx.fill();led(ctx,1078,yy+10,12,12,AMB);T(ctx,s,1102,yy+23,{w:600,size:18});T(ctx,P.name.replace("Prof. ","").split(" ")[0],1800,yy+23,{w:700,size:18,align:"right",color:rgba(P.edge,1)});});});
    withA(ctx,fin(t,c("cost")+0.3),()=>tag(ctx,1440,800,"choose the level by the cost of a wrong number",INK,{align:"center",size:22}));});
  // the cost is easy to count after the fact; the value of a right number, on an ordinary day, is not
  withA(ctx,cards,()=>{glass(ctx,160,190,760,560,26,RED,{glow:18,ea:0.8,fill:"rgba(24,10,14,0.9)"});T(ctx,"The first Tuesday",200,250,{w:800,size:30});T(ctx,"an incident",200,286,{w:600,size:20,color:rgba(SOFT,0.95)});
    [["date","Tuesday, 10:05"],["decision","+600 places"],["reversed","three weeks later"],["cost","rooms, tutors, offers, trust"]].forEach(([k,v],i)=>{const a=fin(t,c("count")+0.6+i*0.45);withA(ctx,a,()=>{T(ctx,k,200,370+i*80,{w:700,size:20,color:rgba(SOFT,0.95)});T(ctx,v,400,370+i*80,{w:700,size:26});});});
    withA(ctx,fin(t,c("count")+2.8),()=>tag(ctx,540,712,"easy to count, afterwards",RED,{align:"center",size:20}));
    glass(ctx,1000,190,760,560,26,GRN,{glow:14,ea:0.6,fill:"rgba(8,20,16,0.88)"});T(ctx,"An ordinary Tuesday",1040,250,{w:800,size:30});T(ctx,"the right number, on time",1040,286,{w:600,size:20,color:rgba(SOFT,0.95)});
    gauge(ctx,1380,500,130,0.6,{});withA(ctx,fin(t,c("count")+4.4),()=>tag(ctx,1380,712,"nothing to count",GRN,{align:"center",size:20}));});});

/* ---------- 6. Follow the thread ---------- */
const STEPS=[["gold.applications_daily","the painting",1640,LAYER.gold],["applications_daily","gold",1180,LAYER.gold],["applications_total","silver",720,LAYER.silver],["admissions.applications","bronze",260,LAYER.bronze]];
const PAIRS=[["A-40211","88213","BSc Data Science","2027","Mon 09:12"],["A-47988","88213","BSc Data Science","2027","Mon 23:14"],["A-40377","90140","BA Economics","2027","Tue 11:40"],["A-48102","90140","BA Economics","2027","Mon 23:14"]],PCX=[40,210,350,600,720];
scene("thread",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),y=250;
  world(ctx,S);camKeys(ctx,S,[[0,960,520,1.0],[sc.dur+1,960,520,1.02]],t);
  const k=clamp((t-c("upstream")-0.8)/1.3,0,3.001);
  ctx.strokeStyle="rgba(170,200,245,0.35)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(STEPS[0][2],y);ctx.lineTo(STEPS[3][2],y);ctx.stroke();
  if(k>0){const i=Math.floor(Math.min(k,3)),f=Math.min(k,3)-i,ex=i<3?lerp(STEPS[i][2],STEPS[i+1][2],ease(f)):STEPS[3][2];beam(ctx,[{x:STEPS[0][2],y},{x:ex,y}],BAD,[[22,0.08],[9,0.22],[3,0.85],[1.5,1]]);glow(ctx,ex,y,36,BAD,0.7);}
  STEPS.forEach(([n,sub,x,col],i)=>{const on=k>=i-0.05,w=Math.max(tw(ctx,n,22,700,"mono"),tw(ctx,sub,17,500))+44;glass(ctx,x-w/2,y-48,w,96,18,col,{glow:on?22:8,ea:on?0.95:0.45,fill:"rgba(8,14,28,0.92)"});
    T(ctx,n,x,y-6,{w:700,size:22,f:"mono",align:"center"});T(ctx,sub,x,y+26,{w:500,size:17,align:"center",color:rgba(SOFT,0.95)});});
  // bronze, as it arrived: pairs that differ only by their ID and when they were created
  const a=fin(t,c("pairs")-0.2,0.8),idHi=fin(t,c("id")+0.2),keyHi=fin(t,c("key")+0.4);
  withA(ctx,a,()=>{const x=160,yy=380,w=1000;glass(ctx,x,yy,w,330,20,LAYER.bronze,{glow:16,ea:0.8,fill:"rgba(20,12,6,0.9)"});
    T(ctx,"bronze.admissions.applications",x+24,yy+40,{w:700,size:20,f:"mono",color:rgba(LAYER.bronze,1)});
    ["application_id","applicant","course","intake","created"].forEach((h,i)=>T(ctx,h,x+PCX[i],yy+80,{w:700,size:16,color:rgba(SOFT,0.9)}));
    if(idHi>0){ctx.fillStyle=rgba(GRN,0.12*idHi);rr(ctx,x+PCX[0]-10,yy+56,150,250,8);ctx.fill();}
    if(keyHi>0){ctx.fillStyle=rgba(RED,0.12*keyHi);rr(ctx,x+PCX[1]-10,yy+56,PCX[4]-PCX[1]-10,250,8);ctx.fill();}
    PAIRS.forEach((r,i)=>{const ry=yy+118+i*48+(i>1?14:0);r.forEach((v,j)=>T(ctx,v,x+PCX[j],ry,{w:600,size:19,f:"mono",color:j>=1&&j<=3&&keyHi>0.5?rgba(mixc(INK,[255,170,160],keyHi),1):rgba(INK,0.9)}));});
    T(ctx,"3,100 pairs like these",x+24,yy+314,{w:500,size:16,color:rgba(SOFT,0.85)});});
  withA(ctx,idHi,()=>checkPill(ctx,1220,420,"unique: application_id","pass",{size:19}));
  withA(ctx,keyHi,()=>checkPill(ctx,1220,480,"unique: applicant + course + intake","fail",{size:19}));
  withA(ctx,fin(t,c("key")+2.2),()=>tag(ctx,1500,580,"the business key",BIZ,{align:"center",size:21}));
  withA(ctx,fin(t,c("test")+0.8),()=>tag(ctx,1500,640,"test what makes it unique in the real world",INK,{align:"center",size:19}));
  setScreen(ctx,S);clockChip(ctx,S,"Tue 08:15","follow the thread",fin(t,0.2));});

/* ---------- 7. Fix at the source ---------- */
scene("reload",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),y=540,bx=440,by=y-170,bw=300,bh=340;
  world(ctx,S);camKeys(ctx,S,[[0,700,470,1.12],[c("patch")-0.2,700,470,1.12],[c("rebuild")-0.4,960,540,1.0],[sc.dur+1,960,540,1.0]],t);
  withA(ctx,fin(t,c("rosa")+0.2),()=>callTile(ctx,"rosa",40,150,280,210,{t,expr:t>c("source")?"relieved":"calm"}));
  msg(ctx,340,160,420,"Rosa → Sam","Found it: the sync restarted from Monday. Copies removed.",TECH,fin(t,c("rosa")+2.4,0.4),t>c("rosa")+1.2&&t<c("rosa")+2.6?t:0);
  const rem=fin(t,c("source")+0.4),safe=fin(t,c("source")+3.4),lift=clamp((t-c("patch")-0.6)/2.4,0,1),pour=clamp((t-c("patch")-2.6)/2.4,0,1),reb=clamp((t-c("rebuild")-0.1)/1.8,0,1);
  sysCard(ctx,40,y-70,300,140,"Admissions system",rem>0.5?"copies removed":"a week, twice",ADM);
  withA(ctx,safe,()=>{glass(ctx,60,y+100,260,52,14,GRN,{glow:10,ea:0.8,fill:"rgba(8,24,16,0.9)"});ctx.save();ctx.strokeStyle=rgba(GRN,1);ctx.lineWidth=3;rr(ctx,80,y+120,22,18,4);ctx.stroke();ctx.beginPath();ctx.arc(91,y+120,7,Math.PI,0);ctx.stroke();ctx.restore();T(ctx,"sync: safe to run twice",116,y+134,{w:700,size:18});});
  // the week in bronze: first with its copies, then lifted out, then poured in again once
  vault(ctx,bx,by,bw,bh,LAYER.bronze,(r,c2)=>{if(r>=3&&r<=6){const k=(r-3)/4;if(lift>0&&pour<k+0.25)return null;}return hash(r*29+c2,4)<0.82?(lift===0&&c2%2===1&&r<11?[235,215,255]:ADM):null;},"Bronze","as it arrived");
  withA(ctx,fin(t,c("patch")+0.4),()=>{ctx.save();ctx.setLineDash([8,6]);ctx.strokeStyle=rgba(AMB,0.9);ctx.lineWidth=2;rr(ctx,bx+14,by+184,bw-28,96,10);ctx.stroke();ctx.restore();tag(ctx,bx+bw/2,by+bh+34,"replace one week",AMB,{align:"center",size:17});});
  if(lift>0)for(let i=0;i<14;i++){const u=i/13,p=ease(clamp(lift*1.4-u*0.4,0,1)),px=lerp(bx+30,bx+bw-10,u),py=lerp(by+230,by+bh+80+Math.sin(u*Math.PI)*40,p);withA(ctx,(0.15+0.35*(1-u))*(p>0?1:0)*(1-fin(t,c("travel"),1)),()=>appTile(ctx,px-9,py,18,null,{col:[235,215,255],dup:true}));}
  if(pour>0&&pour<1){const P=[{x:340,y},{x:390,y:y-10},{x:bx+60,y:by+230}];beam(ctx,P,ADM,[[18,0.08],[7,0.25],[2.5,0.9]]);for(let i=0;i<5;i++){const q=at(mk(P),(pour*1.6+i*0.16)%1);appTile(ctx,q.x-8,q.y-8,16,null);}}
  lane(ctx,[{x:bx+bw,y},{x:820,y}],[214,228,255],0.7);vault(ctx,820,by,240,bh,LAYER.silver,(r,c2)=>hash(r*7+c2,3)<0.72?[214,228,255]:null,"Silver",reb>0.4?"rebuilt":"consistent");
  lane(ctx,[{x:1060,y},{x:1120,y}],LAYER.gold,0.7);vault(ctx,1120,by,240,bh,LAYER.gold,(r,c2)=>hash(r*5+c2,2)<0.6?LAYER.gold:null,"Gold",reb>0.8?"rebuilt":"last good data");
  if(reb>0&&reb<1)glow(ctx,lerp(900,1240,reb),y,90,GRN,0.45);
  withA(ctx,fin(t,c("rebuild")+1.6),()=>{checkPill(ctx,830,by-120,"total: +0.5% overnight","pass",{size:17});checkPill(ctx,830,by-66,"unique: applicant + course + intake","pass",{size:17});});
  // time travel: the table before and after
  const tv=fin(t,c("travel")+0.1,0.8);withA(ctx,tv,()=>{T(ctx,"Time travel · silver.applications_total",1640,160,{w:700,size:20,align:"center",color:rgba(SOFT,1)});
    versionPane(ctx,1430,190,420,190,"41","Tue 02:00",11340,RED,"with the copies");});
  withA(ctx,fin(t,c("travel")+1.6),()=>versionPane(ctx,1430,410,420,190,"43","Tue 11:30",8240,GRN,"from the corrected source"));
  withA(ctx,fin(t,c("travel")+3.4),()=>T(ctx,"+40 since Monday",1640,650,{w:800,size:30,align:"center",color:rgba(GRN,1)}));
  withA(ctx,fin(t,c("wednesday")+0.2),()=>{gauge(ctx,1640,820,90,0.5,{sub:"overnight change"});tag(ctx,1180,860,"Wednesday · the committee plans with 8,240",BIZ,{align:"center",size:19});});
  setScreen(ctx,S);clockChip(ctx,S,t<c("wednesday")?"Tue 11:30":"Wed 10:05",t<c("wednesday")?"fix at the source":"the committee",fin(t,0.2));});

/* ---------- 8. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath"),y=500;
  world(ctx,S);camKeys(ctx,S,[[0,760,470,1.25],[5.0,960,520,0.96],[sc.dur+1,960,520,0.92]],t);
  // the platform, calm: the door, bronze, the checks, silver, gold and the painting
  sysCard(ctx,60,y-70,260,140,"Admissions system","safe to run twice",ADM);lane(ctx,[{x:320,y},{x:420,y}],ADM,0.8);
  const late=fin(t,B+0.3,0.8);packets(ctx,t,[{x:320,y},{x:370,y},{x:420,y}],0.6,1.0,0,ADM,14,0.9,late>0?B+0.3:null);
  vault(ctx,420,y-170,240,340,LAYER.bronze,(r,c2)=>hash(r*29+c2,4)<0.8?ADM:null,"Bronze","as it arrived");
  lane(ctx,[{x:660,y},{x:740,y}],ADM,0.6);gate(ctx,740,y,150,GRN,"tests");
  const nt=fin(t,c("behind")+0.8,0.8);["unique ID","not empty","course exists"].forEach((s,i)=>checkPill(ctx,[440,600,760][i],y+200,s,"pass",{size:17}));
  withA(ctx,nt,()=>{const glowA=pulse(t,c("behind")+0.8,2.4);if(glowA>0)glow(ctx,640,y+274,140,GRN,0.4*glowA);checkPill(ctx,440,y+254,"unique: applicant + course + intake","pass",{size:17});});
  lane(ctx,[{x:770,y},{x:820,y}],[214,228,255],0.6);vault(ctx,820,y-170,220,340,LAYER.silver,(r,c2)=>hash(r*7+c2,3)<0.72?[214,228,255]:null,"Silver","consistent");
  lane(ctx,[{x:1040,y},{x:1090,y}],[214,228,255],0.6);gate(ctx,1090,y,150,GRN,"tests");
  lane(ctx,[{x:1120,y},{x:1160,y}],LAYER.gold,0.6);vault(ctx,1160,y-170,220,340,LAYER.gold,(r,c2)=>hash(r*5+c2,2)<0.6?LAYER.gold:null,"Gold","applications");
  lane(ctx,[{x:1380,y},{x:1420,y}],LAYER.gold,0.6);
  // the painting; in the last seconds, the next night's file doesn't arrive, and its data starts to age: a hint of the next film
  numberPainting(ctx,1420,y-150,460,300,{num:8290,gauge:{},gaugeV:0.6,stamp:late>0.5?"updated "+Math.floor(26+(t-B)*1.5)+" hours ago":"intake 2027",note:0});
  withA(ctx,late,()=>{ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(AMB,0.5+0.4*Math.sin(t*3));ctx.lineWidth=2;rr(ctx,346,y-12,24,24,6);ctx.stroke();ctx.restore();tag(ctx,190,y+130,"02:00 · file expected",AMB,{align:"center",size:17});});
  // the last line, once it has been said
  setScreen(ctx,S);withA(ctx,fin(t,c("tag")+2.0,0.8),()=>{T(ctx,"Stale and labelled beats fresh and wrong.",960,150,{w:800,size:50,align:"center"});T(ctx,"When things go wrong · Too good to be true",960,196,{w:600,size:22,align:"center",color:rgba(SOFT,0.95)});});});
