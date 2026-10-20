/* ===== Rules with a home: scenes =====
   Eleven chapters, as in ../script.md. Tartu today: a birth entered once in the population register, a benefit offered to parents
   who never applied, and no office asking the parents again, each asking the register over X-Road; then day one's data rule
   and the bill of $412.80 beside it; the household away in June, whose meter stored its readings; the nightly script on the wall
   between the network and retail, writing since March to a queue nothing reads; the rule in five places, none of them its home;
   the rule split in two, one on each side, joined by what crosses; where each comes from, and the goal that was an obligation;
   what a rule is about; the step it's attached to and what that step expects of the data; the rule in a set form and the checks
   generated from it; generally, an ontology; and back in Tartu.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: every
   shot drifts slowly and things arrive with a spring. Sound: every effect in tools/score.py fires at the same moment as the thing
   it belongs to here, so keep the two in step. */

/* ---------- 1. Once only ---------- */
// The offices that ask the register: two named, over it, and others like them on each side, unnamed (the register has many users).
// Named: [name, x, y], each 440 wide; the others: their centres. Each has a road, X-Road, to the register.
const D9_OFF=[["Health Insurance Fund",520,70],["Social Insurance Board",980,70]];
const D9_OTH=[[330,282],[220,382],[330,482],[1590,282],[1700,382],[1590,482]];
const D9_REG=[700,330,520,236];
const D9_ROADS=[d9_bez([740,160],[740,250],[830,240],[830,330]),d9_bez([1200,160],[1200,250],[1090,240],[1090,330])].concat(D9_OTH.map(([x,y],i)=>{const L=x<960,sx=L?x+34:x-34,ex=L?700:1220,ey=[396,448,500][i%3],mx=lerp(sx,ex,0.5);return d9_bez([sx,y],[mx,y],[mx,ey],[ex,ey]);}));
// the camera on Tartu: keys of [time, x, y, zoom], eased over d seconds, as ea.js's focus() moves it; and where a point of the view
// lands on screen, with the scene's drift
function d9_cam(t,keys,d){let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}return{x,y,z};}
function d9_onScreen(c,t,sc,px,py,dz,dy){const zd=1+dz*ease(clamp(t/Math.max(1,sc.dur),0,1)),X=960+(px-c.x)*c.z,Y=540+(py-c.y)*c.z;return[960+(X-960)*zd,dy+(Y-dy)*zd];}
scene("tartu",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);
  const tA=c("asks"),tK=c("link"),u=lerp(0.18,0.66,clamp(t/sc.dur,0,1));
  // Tartu at dawn: the camera pushes towards the family's window, then lifts to the sky over the town, where the offices are
  const tIn=w("email","Days later")-0.6,tOut=w("asks","No office")-0.5,net=ease(fin(t,tOut,1.6)),cam=d9_cam(t,[[0,960,540,1.0],[tIn,1400,560,1.2],[tOut,960,270,1.0]],1.8);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:520});ctx.translate(960,540);ctx.scale(cam.z,cam.z);ctx.translate(-cam.x,-cam.y);
  d9_tartu(ctx,t,{u,dim:0.45*ease(fin(t,tIn,1.4))*(1-net)+0.62*net,light:1+0.4*pulseAt(t,w("born","born"),1.6)});ctx.restore();
  const win=d9_onScreen(cam,t,sc,1679,476,0.03,520);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  // the register: first in the sky, then in the middle of the offices
  const r0=[150,150,560,236],r1=D9_REG,rk=ease(fin(t,tOut+0.2,1.6)),rx=lerp(r0[0],r1[0],rk),ry=lerp(r0[1],r1[1],rk),rw=lerp(r0[2],r1[2],rk),rh=lerp(r0[3],r1[3],rk);
  const tR=w("born","population register")-0.5,ent=w("born","entered"),rec=clamp((t-ent)/1.6,0,1),regA=1-0.85*fin(t,tIn+0.4,0.6)*(1-rk);
  const tHome=w("link","one home"),tOwn=w("link","one owner"),tOnce=w("link","asked for once"),tOnly=w("link","once only");
  arrive(ctx,rx+rw/2,ry+rh/2,t,tR,()=>d9_register(ctx,rx,ry,rw,rh,{a:regA,row:"a birth · Tartu · today",lit:clamp((t-ent-1.5)/0.6,0,1),hi:pulseAt(t,ent+1.6,1.4)+0.7*fin(t,tHome,0.6)+0.5*pulseAt(t,B+0.4,2.2)}),{dy:-16});
  // the birth, entered once: a record rising from the window to the register
  if(rec>0&&rec<1){const sx=1679,sy=530,ex=r0[0]+r0[2]/2,ey=r0[1]+r0[3]-30,q=ease(rec),P=q2=>[lerp(sx,ex,q2),lerp(sy,ey,q2)-Math.sin(q2*Math.PI)*170];
    for(let k=0;k<14;k++){const[x2,y2]=P(Math.max(0,q-k*0.018));glow(ctx,x2,y2,14-k*0.8,D9_DAWN,0.3*(1-k/14));}
    const[x,y]=P(q);glass(ctx,x-74,y-24,148,48,24,D9_DAWN,{glow:18,ea:0.95,fill:"rgba(30,20,12,0.92)"});T(ctx,"a birth",x,y+10,{w:800,size:28,align:"center",color:rgba(D9_DAWN,1)});}
  // the phone, close up: the offer; then the application they never made
  const tP=w("email","the parents")-0.4,ph=fin(t,tP,0.7),sh=ease(fin(t,tOut-0.1,0.9)),tN=c("never");
  if(ph>0.01&&sh<0.999){const k=lerp(1,0.16,sh),px=lerp(900,1152,sh),py=lerp(90,52,sh);ctx.save();ctx.translate(px,py);ctx.scale(k,k);d9_phone(ctx,0,0,600,780,t,{a:ph*(1-sh*sh),tap:pulseAt(t,w("email","accept it"),1.4)});ctx.restore();}
  arrive(ctx,530,490,t,tN-0.2,()=>withA(ctx,1-fin(t,tOut-0.3,0.5),()=>{d9_form(ctx,340,230,380,520,{rot:-0.03});tag(ctx,530,800,"no application",D9_DAWN,{align:"center",size:30});}),{dy:-20,from:1.04});
  // the offices, named and not; the parents aren't asked again; then each office's road to the register, with asks going out and
  // answers coming back
  const tPa=w("asks","parents"),tAsk=w("asks","Each one asks"),tX=w("asks","over X-Road"),tLw=w("law","second database"),tLs=w("law","listed");
  D9_OFF.forEach(([nm,x,y],i)=>arrive(ctx,x+220,y+45,t,tOut+[0.5,0.8][i],()=>d9_office(ctx,x,y,440,nm,{hi:pulseAt(t,tAsk+0.9+i*0.25,1.2)+0.5*pulseAt(t,tOnly+i*0.15,1.4)}),{dy:-12}));
  D9_OTH.forEach(([x,y],i)=>arrive(ctx,x,y,t,tOut+1.0+(i%3)*0.12+(i>2?0.06:0),()=>d9_officeS(ctx,x,y,{hi:pulseAt(t,tAsk+1.4+i*0.18,1.2)+0.5*pulseAt(t,tOnly+0.3+i*0.1,1.4)}),{dy:-10}));
  D9_ROADS.forEach((rd,i)=>{const k=i<2?i:2+(i-2)*0.5,rp=clamp((t-tAsk-0.1-k*0.22)/0.9,0,1),cyc=(t-tAsk-1.3-i*0.41)/2.4,ph_=cyc-Math.floor(cyc),live=t>tAsk+1.2;
    d9_road(ctx,rd,rp,{t,lw:i<2?1:0.6,ask:live&&ph_<0.5?ph_*2:null,ans:live&&ph_>=0.5?1-(ph_-0.5)*2:null,hi:pulseAt(t,tX+0.2,1.4)+0.6*pulseAt(t,tOnly+i*0.15,1.4)+0.5*pulseAt(t,B+0.4+i*0.2,1.6)});});
  arrive(ctx,960,236,t,tX-0.1,()=>tag(ctx,960,236,"X-Road",D9_TAR,{align:"center",size:30}),{dy:8});
  if(t>tPa-0.4&&t<tLw+1){const[wx,wy]=win;arrive(ctx,wx-230,wy+16,t,tPa-0.2,()=>withA(ctx,1-fin(t,c("law")-0.3,0.6),()=>tag(ctx,wx-230,wy+16,"not asked again",D9_DAWN,{align:"center",size:30})),{dy:8});}
  // the law: no second database of the same data; and every database listed, with the office that owns it
  arrive(ctx,270,190,t,tLw-0.3,()=>withA(ctx,1-fin(t,tLs-0.4,0.5),()=>{d9_ghostDb(ctx,160,148,220,84,"births");cross_(ctx,202,194,70,D9_RED,fin(t,tLw+0.5,0.3));tag(ctx,270,104,"no second database",D9_RED,{align:"center",size:30});}),{dy:-12});
  const cat=fin(t,tLs-0.3,0.5)*(1-fin(t,tOwn+0.8,0.6));
  arrive(ctx,360,728,t,tLs-0.3,()=>d9_catalogue(ctx,40,600,640,[["population register","Ministry of the Interior"],["health insurance database","Health Insurance Fund"],["social insurance database","Social Insurance Board"]],{a:cat,p:clamp((t-tLs)/1.4,0,1)}),{dy:-14});
  // each fact has one home and one owner; it's asked for once, and everyone who needs it asks there
  arrive(ctx,960,300,t,tHome-0.1,()=>tag(ctx,960,300,"one home",D9_TAR,{align:"center",size:30}),{dy:8});
  arrive(ctx,960,614,t,tOwn-0.1,()=>tag(ctx,960,614,"owner · Ministry of the Interior",TRUST,{align:"center",size:30}),{dy:8});
  const ln=clamp((t-tOnce+0.2)/0.9,0,1);if(ln>0){const[wx,wy]=win;d9_trace_(ctx,[[wx,wy],[lerp(wx,1180,0.5),lerp(wy,570,0.5)-30],[1180,570]],ln,D9_DAWN);
    arrive(ctx,lerp(wx,1180,0.5),lerp(wy,570,0.5)-34,t,tOnce+0.3,()=>tag(ctx,lerp(wx,1180,0.5),lerp(wy,570,0.5)-34,"asked once",D9_DAWN,{align:"center",size:28}),{dy:8});}
  arrive(ctx,960,760,t,tOnly-0.2,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.9)";ctx.shadowBlur=24;T(ctx,"once only",960,790,{w:800,size:84,align:"center",color:rgba(TRUST,1)});ctx.restore();},{dy:16,from:0.9});
  ctx.restore();
  eaYear(ctx,90,90,"today · Tartu, Estonia",D9_DAWN,fin(t,0.6,0.6)*(1-fin(t,tOut,0.5)));
  fadeIn(ctx,S,t,1.4);vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"Rules with a home","objects, owners and rules",EAC,"Film 9 of 11 · enterprise architecture, for data");});
// a pose held between two moments, eased in and out: for person()'s pose mix
const d9_pz=(t,a,b)=>fin(t,a,0.5)*(1-fin(t,b,0.5));

/* ---------- 2. The bill from day one ---------- */
// The wall, with Tomás's note from the last film. Day one's rule and the bill beside it; then Farah's case: the household, June day by
// day, the three weeks away when the meter went quiet, the estimate from last June, and the readings it sent when it came back.
const D9_HS=[540,548],D9_JN=[776,388,770,320];
scene("bill",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  const tD1=w("note","On day one"),tSh=w("note","shown one"),tF=c("flag"),tFw=w("flag","wrong"),tFa=w("away","Farah"),tHh=w("away","household"),tJ=w("away","In June"),tTw=w("away","three weeks"),tSt=w("away","stopped");
  const tE=c("est"),tE2=w("est","last year"),tAm=w("est","four hundred"),tB=c("stored"),tBs=w("stored","sent the readings"),tNo=w("stored","almost nothing"),tN=c("never"),tNa=w("never","arrived"),tNc=w("never","never corrected");
  ctx.save();drift(ctx,t,sc,{z:0.025,y:440});focus(ctx,t,[[0,960,540,1],[tHh-0.6,990,500,1.08],[tN-0.8,970,510,1.04]],1.6);
  person(ctx,"tomas",250,1030,0.78,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,0.5,3.6),expr:t>tNc-0.2?"concerned":"calm"});
  // the note: where does each rule belong? Then aside, to the corner
  const nt=ease(fin(t,tD1-0.7,1.5));arrive(ctx,960,330,t,0.3,()=>{ctx.save();ctx.translate(lerp(960,1590,nt),lerp(330,118,nt));ctx.scale(lerp(1,0.58,nt),lerp(1,0.58,nt));sticky(ctx,0,0,760,210,D9_Q,{col:NOTEC[0],size:50,st:0,rot:-0.02});ctx.restore();},{dy:-30});
  // day one's rule, and the bill beside it, flagged wrong
  const rA=1-fin(t,tFa-0.3,0.8);if(rA>0.01)arrive(ctx,730,387,t,tSh-0.2,()=>withA(ctx,rA,()=>ruleCard(ctx,330,300-30*(1-rA),800,D9_R0,{kicker:"data rule",size:36,hi:pulseAt(t,tSh+0.4,1.6)})),{dy:-14});
  const bm=ease(fin(t,tFa-0.2,1.5)),bx=lerp(1200,830,bm),by=lerp(280,52,bm),fix=fin(t,tNc+0.1,0.5);
  arrive(ctx,bx+230,by+118,t,tF-0.1,()=>d9_bill(ctx,bx,by,460,{bad:fin(t,tFw-0.1,0.4),hi:pulseAt(t,tAm+0.2,1.6)+0.6*pulseAt(t,tNc,1.4),stamp:"never corrected",st:fix}),{dy:-14});
  // Farah, who speaks for the customers, brings the household behind it
  arrive(ctx,1720,900,t,tFa-0.5,()=>d9_personR(ctx,"farah",1720,1030,0.74,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,tFa,tFa+2.8),expr:t>tNc-0.2?"concerned":"calm"}),{dy:-10});
  const[hx,hy]=D9_HS,home=1-fin(t,tTw-0.2,0.8)+fin(t,tB-0.1,0.6),sig=(1-fin(t,tSt-0.1,0.5))+fin(t,tB-0.2,0.5);
  arrive(ctx,hx,hy,t,tHh-0.1,()=>d9_house(ctx,hx,hy,t,{lit:clamp(home,0,1),sig:clamp(sig,0,1),off:fin(t,tSt+0.2,0.4)*(1-fin(t,tB-0.3,0.4))}),{dy:-16});
  // June, day by day: the stored readings, sent when the meter came back, land on the weeks away
  const[jx,jy,jw,jh]=D9_JN,n=D9_AWAY[1]-D9_AWAY[0]+1,act=[],land=i=>tBs+0.2+i*0.07+0.9;for(let i=0;i<n;i++)act.push(fin(t,land(i),0.35));
  arrive(ctx,jx+jw/2,jy+jh/2,t,tJ-0.3,()=>d9_june(ctx,jx,jy,jw,jh,t,{p:fin(t,tJ-0.1,1.4),away:fin(t,tTw-0.2,0.9),gap:fin(t,tSt+0.3,0.6),est:fin(t,tE2-0.2,1.6),estL:fin(t,tE2+0.6,0.5),act,actL:fin(t,tNo-0.3,0.5)}),{dy:-14});
  const mx=hx+68,my=hy+28;for(let i=0;i<n;i++){const s0=tBs+0.2+i*0.07,q=clamp((t-s0)/0.9,0,1);if(q<=0||q>=1)continue;const[bx_,bb]=d9_juneAt(jx,jy,jw,jh,D9_AWAY[0]+i),e=ease(q),px=lerp(mx,bx_,e),py=lerp(my,bb-12,e)-Math.sin(e*Math.PI)*120;
    glow(ctx,px,py,16,D9_NET,0.7);ctx.fillStyle=rgba(mix(D9_NET,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();}
  // the estimate went into the bill; the actual readings arrived, and nothing went back to it
  const mid=(d9_juneAt(jx,jy,jw,jh,D9_AWAY[0])[0]+d9_juneAt(jx,jy,jw,jh,D9_AWAY[1])[0])/2;
  d9_trace_(ctx,[[mid,jy+150],[mid+40,jy-20],[1060,52+236+4]],clamp((t-tAm+0.6)/0.9,0,1),[214,150,60],{dash:[10,8],a:1-fin(t,tB-0.4,0.6)});
  if(t>tNa-0.3)arrive(ctx,jx+jw-84,jy+46,t,tNa-0.2,()=>tag(ctx,jx+jw-84,jy+46,"arrived",D9_OK,{align:"center",size:28}),{dy:8});
  const back=clamp((t-tNc+0.9)/0.8,0,1);if(back>0){const P=[[jx+jw-84,jy+22],[jx+jw-120,jy-40],[1292,196]];d9_trace_(ctx,P.slice(0,2).concat([[lerp(P[1][0],P[2][0],0.5),lerp(P[1][1],P[2][1],0.5)]]),back,D9_OK,{dash:[10,8]});
    if(back>=1)cross_(ctx,lerp(P[1][0],P[2][0],0.5),lerp(P[1][1],P[2][1],0.5),40,BAD,fin(t,tNc,0.3));}
  ctx.restore();
  eaYear(ctx,90,90,"day one",CLAY,fin(t,tD1-0.2,0.5)*(1-fin(t,tFa-0.4,0.5)));
  eaYear(ctx,90,90,"June · this year",[164,200,255],fin(t,tJ-0.2,0.5)*(1-fin(t,tN-0.2,0.5)));
  vign(ctx,S);});

/* ---------- 3. A rule on the wall ---------- */
// The rule existed: a nightly script, on the wall between the network and retail. It found estimates with an actual reading behind
// them and queued their bills to be corrected; since billing moved in March, it writes to a queue nothing reads. Every night: no error.
const D9_SC=[770,300,380,268],D9_TB=[86,286,524],D9_QU=[1310,548,470,226],D9_BS=[1310,256,470,112];
scene("script",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tYr=w("existed","Years ago"),tAn=w("existed","analyst"),tSg=w("existed","stopgap"),tF=c("found"),tEs=w("found","estimates"),tAc=w("found","actual reading"),tQ=w("found","queued");
  const tM=c("march"),tNs=w("march","new system"),tOq=w("march","old queue"),tNr=w("march","nothing reads"),tC=c("clean"),tNe=w("clean","no error"),tCn=w("clean","corrected nothing"),tNh=w("clean","nineteen hundred"),tW=c("wall"),tNi=w("wall","neither side");
  const sd=fin(t,tW-0.5,1.2);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});focus(ctx,t,[[0,960,434,1.5],[tF-0.7,840,470,1.1],[tQ-0.3,1010,490,1.0],[tW-0.7,960,510,1.0]],1.6);
  d9_sides(ctx,{a:0.3+0.7*sd,lab:sd});d9_wall(ctx,t,{a:0.3+0.7*sd,hi:pulseAt(t,tW+0.4,1.8)});
  // the readings it looks through: estimates, and the actual readings behind some of them
  const[tx,ty,tw_]=D9_TB,eH=fin(t,tEs-0.1,0.4),aH=fin(t,tAc-0.1,0.4),pr=fin(t,tAc+0.4,0.6);
  arrive(ctx,tx+tw_/2,ty+180,t,tF-0.5,()=>d9_readings(ctx,tx,ty,tw_,{hi:[eH,aH,eH*(1-pr*0.7),eH,aH],pairs:[[0,1],[3,4]],pp:[pr,clamp(pr*1.2-0.2,0,1)]}),{dy:-14});
  // the script looks along the rows
  const sw=fin(t,tEs-0.3,0.4)*(1-fin(t,tQ,0.5));if(sw>0.01){const u=((t-tEs)*0.6)%1,ry=ty+82+u*5*56+24;ctx.save();ctx.globalAlpha*=0.5*sw;const g=ctx.createLinearGradient(D9_SC[0],0,tx+tw_,0);g.addColorStop(0,rgba(TECH,0.35));g.addColorStop(1,rgba(TECH,0.05));ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(D9_SC[0],D9_SC[1]+130);ctx.lineTo(tx+tw_,ry-26);ctx.lineTo(tx+tw_,ry+26);ctx.lineTo(D9_SC[0],D9_SC[1]+150);ctx.closePath();ctx.fill();ctx.restore();}
  // the billing system that read the queue, until March; then the new one, which doesn't
  const mv=ease(fin(t,tNs-0.5,1.4)),[bx,by,bw,bh]=D9_BS;
  if(mv<0.99)arrive(ctx,bx+bw/2,by+bh/2,t,tQ-0.2,()=>withA(ctx,1-mv,()=>archEl(ctx,bx+mv*60,by+mv*30,bw,bh,"billing system",mix(APL,[130,130,140],mv),"component",{size:30})),{dy:-12});
  if(mv>0.01)withA(ctx,mv,()=>{archEl(ctx,bx,by-mv*0+(1-mv)*-30,bw,bh,"new billing system",APL,"component",{size:30,hi:pulseAt(t,tNs+0.6,1.4)});tag(ctx,bx+bw/2,by-30,"since March",APL,{align:"center",size:28});});
  const rd=fin(t,tQ-0.1,0.6)*(1-fin(t,tNs-0.3,0.5));if(rd>0.01){ctx.save();ctx.globalAlpha*=rd;ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(APL,0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(bx+bw/2,D9_QU[1]);ctx.lineTo(bx+bw/2,by+bh);ctx.stroke();ctx.restore();
    const u=((t*0.8)%1);glow(ctx,bx+bw/2,lerp(D9_QU[1],by+bh,u),14,APL,0.7*rd);}
  const cut=fin(t,tNr-0.2,0.5);if(cut>0.01){ctx.save();ctx.globalAlpha*=cut;ctx.setLineDash([8,8]);ctx.strokeStyle="rgba(140,140,150,0.6)";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(bx+bw/2,D9_QU[1]);ctx.lineTo(bx+bw/2,D9_QU[1]-60);ctx.stroke();ctx.restore();cross_(ctx,bx+bw/2,D9_QU[1]-80,40,BAD,cut);}
  // the queue it writes to: the old one, which nothing reads now. Every night more bills, and none corrected
  const[qx,qy,qw,qh]=D9_QU,nights=Math.max(0,Math.floor((t-tC)/0.42)),night=1+Math.round(219*ease(clamp((t-tC)/(tNh-tC+1.2),0,1))),cnt=Math.round(1900*ease(clamp((t-tCn+0.6)/(tNh-tCn+1.4),0,1))),old=fin(t,tOq-0.1,0.6);
  arrive(ctx,qx+qw/2,qy+qh/2,t,tQ-0.2,()=>{withA(ctx,1-old,()=>d9_queue(ctx,qx,qy,qw,qh,"billing queue",{n:t<tQ+0.9?0:t<tC?2:2+nights}));withA(ctx,old,()=>d9_queue(ctx,qx,qy,qw,qh,"old billing queue",{n:t<tC?2:2+nights,dead:fin(t,tNr,0.8),count:t>tCn-0.6?cnt.toLocaleString("en-US"):"",cA:fin(t,tCn-0.6,0.5),what:"bills, never corrected",hi:pulseAt(t,tCn,1.4)+0.6*pulseAt(t,tNh,1.6)}));},{dy:-12});
  if(cut>0.01)arrive(ctx,qx+qw/2,qy+qh+40,t,tNr-0.1,()=>tag(ctx,qx+qw/2,qy+qh+40,"nothing reads it",BAD,{align:"center",size:28}),{dy:8});
  // bills it queued: the first two, then every night
  const tok=(s0)=>{const q=clamp((t-s0)/0.9,0,1);if(q<=0||q>=1)return;const e=ease(q),P=[[D9_SC[0]+D9_SC[2],D9_SC[1]+150],[1230,qy-20],[qx+120,qy+110]],x=lerp(lerp(P[0][0],P[1][0],e),lerp(P[1][0],P[2][0],e),e),y=lerp(lerp(P[0][1],P[1][1],e),lerp(P[1][1],P[2][1],e),e);
    glow(ctx,x,y,20,[236,240,246],0.4);ctx.save();ctx.translate(x,y);ctx.rotate(0.1);ctx.fillStyle="rgba(236,240,246,0.95)";ctx.fillRect(-20,-13,40,26);ctx.fillStyle="rgba(200,50,50,0.7)";ctx.fillRect(-15,-6,17,3);ctx.restore();};
  tok(tQ+0.1);tok(tQ+0.35);if(t>tC)for(let k=0;k<=nights;k++){const s0=tC+k*0.42;if(t-s0<1)tok(s0);}
  // the script, on the wall; every night it runs and reports no error
  const[sx,sy,sw_,sh]=D9_SC;arrive(ctx,sx+sw_/2,sy+sh/2,t,0.3,()=>d9_script(ctx,sx,sy,sw_,sh,t,{scan:t>tEs-0.2&&t<tQ?((t-tEs+0.2)*0.5)%1:null,hi:pulseAt(t,tAn,1.4)+0.8*sd*(1-fin(t,tNi+1.2,1.2))+0.5*pulseAt(t,tNe,1.2),stop:fin(t,tSg-0.2,0.5)}),{dy:-16});
  if(t>tC-0.2){const k=(t-tC)/0.42,ph=k-Math.floor(k);arrive(ctx,sx+sw_/2,sy+sh+58,t,tC,()=>{glass(ctx,sx-24,sy+sh+28,sw_+48,60,30,D9_OK,{glow:10+10*(1-ph),ea:0.8,fill:"rgba(8,20,12,0.92)"});tick_(ctx,sx+12,sy+sh+58,30,D9_OK,1);
    T(ctx,"no error",sx+40,sy+sh+68,{w:800,size:28,color:rgba(D9_OK,1)});T(ctx,"night "+night,sx+sw_+4,sy+sh+68,{f:"mono",w:500,size:28,align:"right",color:rgba(SOFT,0.95)});},{dy:10});}
  arrive(ctx,D9_SC[0]+D9_SC[2]/2,D9_SC[1]+D9_SC[3]+44,t,tAn-0.1,()=>withA(ctx,1-fin(t,tF-0.6,0.5),()=>tag(ctx,D9_SC[0]+D9_SC[2]/2,D9_SC[1]+D9_SC[3]+44,"written by metering",D9_NET,{align:"center",size:28})),{dy:8});
  // it lived on the wall, and belonged to neither side
  arrive(ctx,700,720,t,tNi-0.3,()=>tag(ctx,700,720,"the network's?",D9_NET,{align:"center",size:28}),{dy:8});arrive(ctx,1222,720,t,tNi-0.1,()=>tag(ctx,1222,720,"retail's?",D9_RET,{align:"center",size:28}),{dy:8});
  ctx.restore();
  eaYear(ctx,90,90,"years ago",CLAY,fin(t,tYr-0.2,0.5)*(1-fin(t,tF-0.4,0.5)));eaYear(ctx,90,90,"March 2026",[164,200,255],fin(t,tM-0.2,0.5)*(1-fin(t,tC-0.3,0.5)));
  vign(ctx,S);});

/* ---------- 4. Five places, no home ---------- */
// Back at the wall: the rule written five ways, the regulator's code saying why and the rest how, a little differently; and an empty
// place where its home should be, beside Tartu's register, asked once.
scene("five",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  const tFo=w("four","four more"),tW=[0.5,w("where","retail code"),w("where","settings"),w("where","notes"),w("where","spreadsheet")],tWhy=w("how","says why"),tHow=w("how","each say how"),tDif=w("how","differently"),tNone=w("how","None of them"),tO=c("once"),tTa=w("once","Tartu"),tOo=w("once","once only");
  ctx.save();drift(ctx,t,sc,{z:0.025,y:440});
  person(ctx,"tomas",230,1030,0.78,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,0.6,3.2)+d9_pz(t,tO-0.2,tO+2.6),expr:t>tNone-0.3&&t<tO?"concerned":"calm"});
  const dW=332,dH=262,dx=i=>84+i*352,dy=176;
  D9_DOCS.forEach(([k,ti,ln],i)=>{const why=i===1,dim=fin(t,tNone-0.2,0.6)*0.35*(1-fin(t,B-1,1));arrive(ctx,dx(i)+dW/2,dy+dH/2,t,tW[i]-0.15,()=>withA(ctx,1-dim,()=>d9_doc(ctx,k,dx(i),dy,dW,dH,ti,ln,{rot:(hash(i,940)-0.5)*0.03,hi:why?pulseAt(t,tWhy,1.6):pulseAt(t,tDif+0.15*Math.max(0,i-2),1.2)*0.9,hiCol:why?MOT:TRUST})),{dy:-16});
    const lab=why?"why":"how",col=why?MOT:[255,214,140];arrive(ctx,dx(i)+dW/2,dy+dH+44,t,why?tWhy-0.1:tHow+0.1+0.12*Math.max(0,i-1),()=>tag(ctx,dx(i)+dW/2,dy+dH+44,lab,col,{align:"center",size:30}),{dy:8});});
  // none of them is its home
  const sl=fin(t,tNone-0.1,0.6);d9_slot(ctx,700,606,420,140,TRUST,sl,"its home?");
  D9_DOCS.forEach((_,i)=>{const p=clamp((t-tNone-0.1-i*0.08)/0.7,0,1);if(p<=0)return;const x0=dx(i)+dW/2,y0=dy+dH+70,x1=lerp(740,1080,i/4),y1=600;ctx.save();ctx.globalAlpha*=0.5*(1-fin(t,tO,0.6));ctx.setLineDash([6,8]);ctx.strokeStyle=rgba(TRUST,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,0.82*ease(p)),lerp(y0,y1,0.82*ease(p)));ctx.stroke();ctx.restore();});
  // what Tartu has for a birth: one register, asked once
  arrive(ctx,1460,668,t,tTa-0.3,()=>d9_regMini(ctx,1460,668,t,1),{dy:-14});
  arrive(ctx,1460,812,t,tOo-0.2,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.85)";ctx.shadowBlur=18;T(ctx,"once only",1460,846,{w:800,size:52,align:"center",color:rgba(TRUST,1)});ctx.restore();},{dy:12,from:0.9});
  ctx.restore();vign(ctx,S);});
/* ---------- 5. Two rules, not one ---------- */
// Day one's rule, set down on the wall, splits in two: the network's and retail's, each with its owner. The replaced reading crosses
// at the gate, on the agreed list, where the script once reached across unseen.
const D9_C21=[70,200,820],D9_C22=[1030,200,820];
scene("split",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tTw=w("two","two rules"),tSd=w("two","each side"),tN1=w("net","an estimate"),tG=w("net","Grace"),tR1=w("ret","a bill"),tH=w("ret","head of retail"),tX=c("cross"),tL=w("cross","agreed list"),tSc=w("cross","the script"),tU=w("cross","unseen");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  d9_sides(ctx,{a:fin(t,0.1,0.8)});d9_wall(ctx,t,{gate:fin(t,tX-0.3,0.8),gy:520,hi:pulseAt(t,tSd,1.6)});
  // day one's rule cracks down the wall, and its halves part
  const cr=fin(t,tTw-0.35,0.4),pt=ease(fin(t,tTw,1.0)),gone=fin(t,tTw+0.5,0.8);
  if(gone<1)arrive(ctx,960,284,t,0.2,()=>withA(ctx,1-gone,()=>{[[-1,0,960],[1,960,W]].forEach(([d,x0,x1])=>{ctx.save();ctx.beginPath();ctx.rect(x0,0,x1-x0,H);ctx.clip();ctx.translate(d*130*pt,d*6*pt);ruleCard(ctx,560,200,800,D9_R0,{kicker:"data rule · day one",size:34});ctx.restore();});
    if(cr>0.01&&pt<0.6){ctx.save();ctx.globalAlpha*=cr*(1-pt/0.6);ctx.strokeStyle="rgba(240,244,255,0.95)";ctx.lineWidth=3;ctx.shadowColor="rgba(220,230,255,0.9)";ctx.shadowBlur=14;ctx.beginPath();for(let k=0;k<=8;k++){const yy=lerp(196,374,k/8*cr);ctx.lineTo(960+(k%2?-7:7),yy);}ctx.stroke();ctx.restore();}}),{dy:-14});
  // the two rules: the network's, then retail's, each with its owner
  const h21=d9_rule(ctx,0,0,D9_C21[2],"",D9_R21,null,{a:0,size:34}),h22=d9_rule(ctx,0,0,D9_C22[2],"",D9_R22,null,{a:0,size:34});
  arrive(ctx,D9_C21[0]+410,D9_C21[1]+h21/2,t,tTw+0.4,()=>d9_rule(ctx,D9_C21[0],D9_C21[1],D9_C21[2],"RUL-021",D9_R21,D9_NET,{size:34,p:clamp((t-tN1+0.1)/4.4,0,1),hi:pulseAt(t,tG,1.4)}),{dy:-12});
  arrive(ctx,D9_C22[0]+410,D9_C22[1]+h22/2,t,tTw+0.55,()=>d9_rule(ctx,D9_C22[0],D9_C22[1],D9_C22[2],"RUL-022",D9_R22,D9_RET,{size:34,p:clamp((t-tR1+0.1)/3.2,0,1),hi:pulseAt(t,tH,1.4)}),{dy:-12});
  arrive(ctx,480,D9_C21[1]+h21+44,t,tG-0.1,()=>d9_owner(ctx,480,D9_C21[1]+h21+44,"Grace",1,{align:"center",hi:pulseAt(t,tG+0.2,1.4)}),{dy:8});
  arrive(ctx,1440,D9_C22[1]+h22+44,t,tH-0.1,()=>d9_owner(ctx,1440,D9_C22[1]+h22+44,"head of retail",1,{align:"center",hi:pulseAt(t,tH+0.2,1.4)}),{dy:8});
  arrive(ctx,210,900,t,tG-0.7,()=>person(ctx,"grace",210,1030,0.72,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,tG-0.2,tG+2.4)}),{dy:-10});
  // the gate opens and the replaced reading crosses through it; below, the agreed list of what crosses, with the replaced reading on it
  arrive(ctx,960,710,t,tL-0.5,()=>d9_list(ctx,660,590,600,"what crosses, and how",["which connection point","planned outages","replaced readings"],{p:clamp((t-tL+0.4)/1.5,0,1),hi:fin(t,tL+0.7,0.5),rot:0.004}),{dy:12});
  if(t>tX+0.6){const u=((t-tX-0.6)/2.6)%1,e=ease(clamp(u*1.15,0,1)),x=lerp(700,1220,e),a=sstep(0,0.08,u)*(1-sstep(0.86,0.98,u));d9_msg(ctx,x,520+Math.sin(u*TAU)*4,0.9,mix(D9_NET,D9_RET,sstep(0.42,0.58,e)),a);}
  // where the script once reached across, unseen
  const gh=fin(t,tSc-0.3,0.6)*(1-fin(t,tU+1.2,0.8));if(gh>0.01){d9_trace_(ctx,[[720,476],[840,428],[960,416],[1080,428],[1200,476]],clamp((t-tSc+0.3)/1.0,0,1),[210,170,170],{dash:[8,8],a:0.8*gh,nohead:true});
    withA(ctx,gh,()=>{ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle="rgba(210,170,170,0.8)";ctx.lineWidth=2;rr(ctx,898,390,124,52,10);ctx.fillStyle="rgba(10,12,22,0.9)";ctx.fill();ctx.stroke();ctx.restore();T(ctx,"script",960,425,{f:"mono",w:500,size:28,align:"center",color:"rgba(210,170,170,0.9)"});});
    arrive(ctx,960,346,t,tU-0.2,()=>withA(ctx,gh,()=>tag(ctx,960,346,"unseen",[200,200,210],{align:"center",size:28})),{dy:8});}
  ctx.restore();vign(ctx,S);});

/* ---------- 6. Where a rule comes from ---------- */
// Each rule's reason, above it in motivation's purple: the metering rules for the network's, the regulator's retail code for retail's.
// Without its reason, a rule can't be changed safely; without its owner, it can't be fixed. Then Ama corrects day one's draft: its
// goal was an obligation.
const D9_RS=[[170,150,620,92,"the metering rules"],[1130,150,620,92,"the regulator's retail code"]];
scene("why",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tReg=w("reason","a regulation"),tPr=w("reason","a principle"),tSl=w("reason","service level"),tT=c("these"),tMr=w("these","metering rules"),tRc=w("these","retail code"),tNr=w("safe","no reason"),tCs=w("safe","changed safely"),tNo=w("safe","no owner"),tCf=w("safe","be fixed"),tA=c("ama"),tFa=w("ama","Fair, accurate"),tGo=w("ama","goals"),tOb=w("ama","obligation"),tCo=w("ama","regulator's code");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});d9_sides(ctx,{});d9_wall(ctx,t,{});
  // the two rules, moved down to make room for their reasons; then, while Ama speaks, the network's dims and retail's goes
  const mv=ease(fin(t,0.1,1.4)),off=fin(t,tA-0.4,0.9),aL=1-0.75*off,aR=1-off,h21=d9_rule(ctx,0,0,D9_C21[2],"",D9_R21,null,{a:0,size:34}),h22=d9_rule(ctx,0,0,D9_C22[2],"",D9_R22,null,{a:0,size:34}),y21=lerp(D9_C21[1],320,mv),y22=lerp(D9_C22[1],320,mv);
  const noR=fin(t,tNr-0.2,0.5)*(1-fin(t,tCs+1.0,0.6)),noO=fin(t,tNo-0.2,0.5)*(1-fin(t,tCf+1.0,0.6));
  withA(ctx,aL,()=>{d9_rule(ctx,D9_C21[0],y21,D9_C21[2],"RUL-021",D9_R21,D9_NET,{size:34});d9_owner(ctx,480,y21+h21+44,"Grace",1,{align:"center"});});
  withA(ctx,aR,()=>{d9_rule(ctx,D9_C22[0],y22,D9_C22[2],"RUL-022",D9_R22,D9_RET,{size:34});d9_owner(ctx,1440,y22+h22+44,"head of retail",1-noO,{align:"center"});});
  // without its owner, a rule can't be fixed
  if(noO>0.01){d9_slot(ctx,1300,y22+h22+20,280,48,TRUST,noO,"owner?");arrive(ctx,1440,y22+h22+110,t,tCf-0.4,()=>withA(ctx,noO,()=>tag(ctx,1440,y22+h22+110,"can't be fixed",BAD,{align:"center",size:30})),{dy:8});}
  // the kinds of reason, then each rule's own; without its reason, a rule can't be changed safely
  const gen=1-fin(t,tT-0.3,0.6);[["a regulation","driver",420,tReg],["a principle","principle",960,tPr],["a service level","clock",1500,tSl]].forEach(([l,k,x,t0])=>arrive(ctx,x,196,t,t0-0.1,()=>d9_why(ctx,x,196,l,k,gen,{hi:pulseAt(t,t0+0.2,1.2)}),{dy:-10}));
  D9_RS.forEach(([x,y,w_,h_,nm],i)=>{const t0=i?tRc:tMr,a=i?1:(1-noR)*aL;if(i&&off>0.01)return;arrive(ctx,x+w_/2,y+h_/2,t,t0-0.3,()=>{d9_el(ctx,x,y,w_,h_,nm,MOT,"driver",{size:30,a,hi:pulseAt(t,t0,1.4)});d9_infl(ctx,x+w_/2,y+h_,x+w_/2,(i?y22:y21)-4,MOT,clamp((t-t0)/0.7,0,1),a);},{dy:-12});});
  if(noR>0.01){d9_slot(ctx,170,150,620,92,MOT,noR,"reason?");arrive(ctx,480,284,t,tCs-0.6,()=>withA(ctx,noR,()=>tag(ctx,480,284,"can't be changed safely",BAD,{align:"center",size:30})),{dy:8});}
  // the retail code stays: day one's goal was really an obligation in it
  if(off>0.01){const[x,y,w_,h_,nm]=D9_RS[1];d9_el(ctx,x,y,w_,h_,nm,MOT,"driver",{size:30,hi:pulseAt(t,tCo,1.4)});d9_infl(ctx,x+w_/2,y+h_,x+w_/2,y22-4,MOT,1,aR);
    const ob=fin(t,tOb-0.3,0.7),ex=1130,ey=470,ew=620,eh=100;arrive(ctx,ex+ew/2,ey+eh/2,t,tFa-0.3,()=>{glass(ctx,ex,ey,ew,eh,8,MOT,{glow:12+14*pulseAt(t,tOb,1.6),ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(MOT,0.16);rr(ctx,ex,ey,ew,eh,8);ctx.fill();
      const gx=ex+56,gy=ey+eh/2;withA(ctx,1-ob,()=>archGlyph(ctx,"goal",gx,gy,26,MOT));withA(ctx,ob,()=>d9_reqGlyph(ctx,gx,gy,30,MOT));T(ctx,"fair, accurate bills",ex+108,ey+eh/2+12,{w:800,size:34,color:rgba(INK,0.97)});},{dy:-12});
    arrive(ctx,ex+ew/2,ey-34,t,tFa-0.1,()=>tag(ctx,ex+ew/2,ey-34,"day one's draft",PARCH,{align:"center",size:28}),{dy:8});
    const gl=fin(t,tGo-0.6,0.5)*(1-fin(t,tOb-0.55,0.3));if(gl>0.01){withA(ctx,gl,()=>{tag(ctx,ex+ew/2,ey+eh+44,"a goal",MOT,{align:"center",size:30});});const st=clamp((t-tGo+0.1)/0.4,0,1);if(st>0)withA(ctx,gl,()=>{ctx.save();ctx.strokeStyle=rgba(BAD,0.95);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(ex+ew/2-70,ey+eh+44);ctx.lineTo(ex+ew/2-70+140*st,ey+eh+44);ctx.stroke();ctx.restore();});}
    if(ob>0.01)arrive(ctx,ex+ew/2,ey+eh+44,t,tOb-0.15,()=>tag(ctx,ex+ew/2,ey+eh+44,"an obligation",MOT,{align:"center",size:30}),{dy:8});
    d9_infl(ctx,x+w_/2,y+h_,ex+ew/2,ey-62,MOT,clamp((t-tCo+0.2)/0.7,0,1),off);}
  arrive(ctx,1770,900,t,tA-0.6,()=>d9_personR(ctx,"ama",1770,1030,0.74,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,tA,tA+3.0)+d9_pz(t,tOb-0.2,tOb+2.2)}),{dy:-10});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. What a rule is about ---------- */
// A rule builds on facts, and facts on concepts: retail's rule, the facts it rests on, and the concepts beneath them, in the business's
// words. Each concept becomes a data object on the side that owns it; the industry's model gives starting words, kept beside the
// utility's own.
const D9_FACTS=[[90,"a reading is taken at a connection point",[0,1]],[690,"a reading is actual or estimated",[1,2]],[1290,"a bill is based on readings",[1,3]]];
const D9_TERMS=[["connection point",290],["reading",650],["estimate",1010],["bill",1520]];
scene("about",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tF=w("words","on facts"),tC=w("words","on concepts"),tBw=w("terms","business's words"),tT=[w("terms","a connection point"),w("terms","a reading"),w("terms","an estimate"),w("terms","a bill")],tO=c("objects"),tDo=w("objects","data object"),tNs=w("objects","network's side"),tRs=w("objects","bills on"),tCi=c("cim"),tUp=w("cim","usage point"),tOw=w("own","own words");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const sd=fin(t,tO-0.3,1.0),mvO=ease(fin(t,tDo-0.6,1.4)),pyr=1-fin(t,tO-0.5,0.8);
  d9_sides(ctx,{a:sd});d9_wall(ctx,t,{a:sd});
  // the rule, the facts it builds on, and the concepts beneath them
  if(pyr>0.01)withA(ctx,pyr,()=>{const hR=d9_rule(ctx,510,96,900,"RUL-022",D9_R22,D9_RET,{a:fin(t,0.3,0.6),hi:pulseAt(t,tBw,1.6)});
    D9_FACTS.forEach(([x,s_,to],i)=>{const t0=tF+i*0.2,q=fin(t,t0-0.1,0.5);if(q<=0.01)return;d9_trace_(ctx,[[960,96+hR],[x+270,360]],clamp((t-t0)/0.6,0,1),[150,160,190],{lw:2,nohead:true,a:0.7});
      arrive(ctx,x+270,420,t,t0,()=>d9_fact(ctx,x,360,540,s_,{}),{dy:-10});});
    D9_FACTS.forEach(([x,,to],i)=>to.forEach(j=>{const p=clamp((t-tC-0.2-j*0.1)/0.6,0,1);if(p>0)d9_trace_(ctx,[[x+270,360+104],[D9_TERMS[j][1],640-30]],p,[150,160,190],{lw:2,nohead:true,a:0.6});}));});
  // each concept: a term, then a data object on the side that owns it; the estimate becomes part of the reading
  const OBJ={reading:[150,250,640,130],"connection point":[150,480,640,100],bill:[1130,250,640,100]};
  D9_TERMS.forEach(([nm,x],j)=>{const t0=tC+j*0.15,hi=pulseAt(t,tT[j]+0.1,1.2);if(t<t0-0.2)return;const o=OBJ[nm];
    if(o){const k=nm==="reading"?0:nm==="connection point"?1:2,mo=ease(fin(t,tDo-0.6+k*0.25,1.2)),cx=lerp(x,o[0]+o[2]/2,mo),cy=lerp(640,o[1]+o[3]/2,mo);
      if(mo<0.5)arrive(ctx,x,640,t,t0,()=>withA(ctx,1-mo*2,()=>d9_term(ctx,cx,cy,nm,{hi})),{dy:-10});
      if(mo>0.3){const sv=nm==="reading"?fin(t,tDo+1.4,0.6):0;withA(ctx,clamp((mo-0.3)/0.5,0,1),()=>d9_obj(ctx,lerp(cx-o[2]/2,o[0],mo),lerp(cy-o[3]/2,o[1],mo),o[2],o[3],nm==="reading"?"meter reading":nm,nm==="reading"?"actual or estimated":null,{sv,hi:pulseAt(t,nm==="bill"?tRs:tNs,1.4)+0.6*pulseAt(t,tOw+(k===1?0:0.4),1.4)}));}}
    else{const me=ease(fin(t,tDo+0.6,1.0)),tx=OBJ.reading[0]+180,ty=OBJ.reading[1]+92;arrive(ctx,x,640,t,t0,()=>withA(ctx,1-sstep(0.7,1,me),()=>{ctx.save();ctx.translate(lerp(x,tx,me),lerp(640,ty,me));ctx.scale(lerp(1,0.6,me),lerp(1,0.6,me));d9_term(ctx,0,0,nm,{hi,deco:me>0.02?1:0});ctx.restore();}),{dy:-10});}});
  // the industry's model gives the starting words; the map keeps the utility's own beside them
  arrive(ctx,470,420,t,tCi+0.6,()=>d9_ind(ctx,470,420,"reading quality",1,{hi:pulseAt(t,tOw+0.4,1.4)}),{dy:-8});
  arrive(ctx,470,624,t,tUp-0.2,()=>d9_ind(ctx,470,624,"usage point",1,{hi:pulseAt(t,tUp,1.4)+pulseAt(t,tOw,1.4)}),{dy:-8});
  ctx.restore();vign(ctx,S);});
/* ---------- 8. What the process expects ---------- */
// Meter to cash, as the series draws a value stream: read on the network's side, bill and paid on retail's, crossing at the gate.
// Each rule is attached to its step by a realisation, not written inside it. Then the read step: what it expects of the data, each
// from where it comes: timeliness from its service level, completeness from its steps, validity from another rule.
const D9_VS=[["read",80,830],["bill",1010,490],["paid",1470,390]],D9_VY=290,D9_VH=150,D9_RY=510,D9_EX=[80,600,830,110,126];
scene("expect",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tMc=w("step","meter to cash"),tNw=w("step","network's"),tRt=w("step","retail's"),tAt=w("inside","Attached,"),tNi=w("inside","not inside"),tIp=w("inside","isn't the process"),
    tTi=c("time"),tEx=w("time","what to expect"),tTl=w("time","Timeliness"),tSl=w("time","service level"),tEr=w("time","an estimate replaced"),
    tCo=c("comp"),tSt=w("comp","its steps"),tEv=w("comp","every estimate"),tVa=w("comp","Validity"),tAr=w("comp","another rule"),tMk=w("comp","every reading");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});focus(ctx,t,[[0,960,540,1],[tTi-0.9,560,670,1.04]],1.8);
  // the read step becomes the subject: retail's side steps back, and both rules fold to their ids to make room
  const fo=ease(fin(t,tTi-0.6,1.2)),dimR=1-0.6*fo,op=ease(fin(t,tTi+0.2,1.2)),RY=D9_RY,PY=RY+29,mid=D9_VY+D9_VH/2;
  d9_sides(ctx,{});d9_wall(ctx,t,{gate:1,gy:mid,a:1-0.4*fo});
  withA(ctx,fin(t,tMc-0.3,0.5),()=>T(ctx,"meter to cash",84,D9_VY-24,{f:"mono",w:600,size:30,color:rgba(STR,1)}));
  D9_VS.forEach(([nm,x,w_],i)=>{const r=i===0,lx=r?lerp(x+w_/2-12,196,op):null,ly=r?lerp(mid+12,D9_VY+62,op):null;
    arrive(ctx,x+w_/2,mid,t,tMc-0.2+i*0.18,()=>d9_chev(ctx,x,D9_VY,w_,D9_VH,nm,{first:r,a:r?1:dimR+0.1*fo,deco:!r&&fo>0.3?1:0,lx,ly,hi:pulseAt(t,r?tNw+0.2:tRt+0.2,1.4)*(r||i===1?1:0)}),{dy:-14});});
  // each rule, attached to its step by a realisation: it rises to meet the line
  const h21=d9_rule(ctx,0,0,830,"",D9_R21,null,{a:0,size:30}),h22=d9_rule(ctx,0,0,850,"",D9_R22,null,{a:0,size:30}),rx=lerp(495,300,fo),u21=26*(1-ease(fin(t,tNw+0.2,0.6))),u22=26*(1-ease(fin(t,tRt+0.2,0.6)));
  withA(ctx,1-fo,()=>arrive(ctx,495,RY+h21/2,t,0.4,()=>d9_rule(ctx,80,RY+u21,830,"RUL-021",D9_R21,D9_NET,{size:30,hi:pulseAt(t,tNw+0.5,1.4)}),{dy:-12}));
  withA(ctx,(1-fo)*dimR,()=>arrive(ctx,1435,RY+h22/2,t,0.6,()=>d9_rule(ctx,1010,RY+u22,850,"RUL-022",D9_R22,D9_RET,{size:30,hi:pulseAt(t,tRt+0.5,1.4)}),{dy:-12}));
  d9_rulePill(ctx,300,PY,"RUL-021",D9_NET,{a:fo});d9_rulePill(ctx,1255,PY,"RUL-022",D9_RET,{a:fo*dimR,deco:fo>0.3?1:0});
  d9_real(ctx,rx,D9_VY+D9_VH+2,rx,RY+u21,MOT,clamp((t-tNw+0.1)/0.7,0,1),1);d9_real(ctx,1255,D9_VY+D9_VH+2,1255,RY+u22,MOT,clamp((t-tRt+0.1)/0.7,0,1),dimR);
  // written inside the step, a rule would be the process: it doesn't go there
  const gq=clamp((t-tAt+0.2)/1.1,0,1),gOut=fin(t,tIp+0.5,0.6);
  if(gq>0&&gOut<1){const e=ease(gq),cx=lerp(495,700,e),cy=lerp(RY+h21/2,mid,e),k=lerp(1,0.4,e);ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);ctx.translate(-495,-(RY+h21/2));
    withA(ctx,0.8*(1-gOut),()=>d9_rule(ctx,80,RY,830,"RUL-021",D9_R21,D9_NET,{size:30,deco:1}));ctx.restore();cross_(ctx,700,mid,74,BAD,fin(t,tNi+0.2,0.3)*(1-gOut));}
  arrive(ctx,520,RY-36,t,tNi-0.1,()=>withA(ctx,1-fin(t,tTi-0.6,0.5),()=>tag(ctx,520,RY-36,"attached, not inside",MOT,{size:28})),{dy:8});
  // what the step expects of the data: a bracket from the step to each expectation
  const br=clamp((t-tEx+0.2)/1.2,0,1),[ex,ey,ew,eh,eg]=D9_EX;
  if(br>0){ctx.save();ctx.strokeStyle=rgba(STR,0.85);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(100,D9_VY+D9_VH+2);ctx.lineTo(56,D9_VY+D9_VH+40);ctx.lineTo(56,lerp(D9_VY+D9_VH+40,ey+2*eg+eh/2,ease(br)));ctx.stroke();ctx.restore();}
  // where each comes from: the step's service level, its own steps, and another rule attached to it
  arrive(ctx,700,D9_VY+48,t,tSl-0.3,()=>d9_why(ctx,700,D9_VY+48,"2 working days","clock",1,{hi:pulseAt(t,tSl,1.4)+pulseAt(t,tEr+0.4,1.2)}),{dy:-8});
  d9_steps(ctx,130,D9_VY+112,clamp((t-tSt+0.4)/1.0,0,1),{hi:pulseAt(t,tEv+0.4,1.2)});
  if(t>tAr-0.4){d9_real(ctx,728,D9_VY+D9_VH+2,728,RY,MOT,clamp((t-tAr)/0.7,0,1),1);arrive(ctx,728,PY,t,tAr-0.2,()=>d9_rulePill(ctx,728,PY,"RUL-020",D9_NET,{hi:pulseAt(t,tMk+0.4,1.2)}),{dy:-8});}
  [["timeliness","from its service level","an estimate replaced within 2 working days","clock",tTl,tEr],["completeness","from its steps","every estimate replaced, or explained","process",tCo,tEv],
   ["validity","from another rule","every reading marked actual or estimated","requirement",tVa,tMk]].forEach(([d,s_,txt,g,t0,t1],i)=>{const y=ey+i*eg;
    if(br>0)withA(ctx,fin(t,t0-0.3,0.4),()=>{ctx.save();ctx.strokeStyle=rgba(STR,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(56,y+eh/2);ctx.lineTo(ex,y+eh/2);ctx.stroke();ctx.restore();});
    arrive(ctx,ex+ew/2,y+eh/2,t,t0-0.2,()=>d9_expect(ctx,ex,y,ew,eh,d,s_,txt,g,{p:clamp((t-t1)/1.3,0,1),hi:pulseAt(t,t1+0.4,1.4)}),{dy:-12});
    // the step hands it down: a light runs from the step along the bracket into it
    const fl=clamp((t-t1+0.5)/1.0,0,1);if(fl>0&&fl<1){const P=[[100,D9_VY+D9_VH+2],[56,D9_VY+D9_VH+40],[56,y+eh/2],[ex+20,y+eh/2]],L=[0];for(let k=1;k<P.length;k++)L.push(L[k-1]+Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]));
      const d_=L[3]*ease(fl);let k=1;while(k<3&&L[k]<d_)k++;const u=(d_-L[k-1])/Math.max(1,L[k]-L[k-1]),x=lerp(P[k-1][0],P[k][0],u),yy=lerp(P[k-1][1],P[k][1],u);glow(ctx,x,yy,34,STR,0.8*Math.sin(Math.PI*fl));}});
  ctx.restore();vign(ctx,S);});
/* ---------- 9. Test the data, track the business ---------- */
// Retail's rule in its set form, each part as it's named. Then the two kinds of rule, each with what's generated from it, one way.
// The data rule, RUL-020, gets its tests, as each tool writes them, and a hand that would edit one is stopped. Retail's rule is about
// what the business does: every test passes while a bill goes uncorrected, so a tracking table is generated from it instead. Then what
// it tracks: not whether the nightly job ran (it always did), but whether each bill was corrected; the morning after billing moved,
// the first one listed, and the list sent each morning to the owner's team, not to a shared mailbox.
const D9_FROWS=[["applies to","bills based on a replaced estimate",INF],["must be true","corrected on the next bill",INK],["owner","head of retail",TRUST,"owner"],
  ["reason","the regulator's retail code",MOT],["home","bill, in meter to cash",STR],["when it fails","listed for the billing team",D9_RED]];
const D9_GY=[116,358,600],D9_COL=[540,760,980,1200,1420,1640],D9_MV=1090,D9_L1=450,D9_L2=610,D9_TY=792;
// the two kinds of rule, on the left, each with what's generated from it to its right: the data rule above, level with the first test
// and the pills the tests fold into; retail's below, level with its tracking table
const D9_Y20=165,D9_Y22=490,D9_PY=227,D9_TK=[1010,437,850,266],D9_TP=["dbt test","data contract","SHACL shape"];
// an arrow from a rule to what's generated from it: right, down a spine at x 966 if it must, and right again into it, drawn up to p
function d9_feed(ctx,y0,y1,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{const P=y0===y1?[[934,y0],[1002,y1]]:[[934,y0],[966,y0],[966,y1],[1002,y1]],L=[0];
  for(let k=1;k<P.length;k++)L.push(L[k-1]+Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]));const d=L[L.length-1]*ease(clamp(p,0,1));
  ctx.save();ctx.strokeStyle=rgba(MOT,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);
  for(let k=1;k<P.length;k++){if(L[k]<=d)ctx.lineTo(P[k][0],P[k][1]);else{const u=(d-L[k-1])/Math.max(1,L[k]-L[k-1]);ctx.lineTo(lerp(P[k-1][0],P[k][0],u),lerp(P[k-1][1],P[k][1],u));break;}}ctx.stroke();
  if(p>=1){ctx.beginPath();ctx.moveTo(990,y1-9);ctx.lineTo(1003,y1);ctx.lineTo(990,y1+9);ctx.stroke();}ctx.restore();});}
scene("checks",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tR=[w("form","applies to"),w("form","must be true"),w("form","its owner"),w("form","its reason"),w("form","its home"),w("form","when it fails")],
    tD=c("data"),tDa=w("data","about the data"),tEr=w("data","every reading"),tRt=w("data","data is right"),tG=c("gen"),tOw=w("gen","one way"),tGn=[w("gen","a dbt test"),w("gen","quality rule"),w("gen","a shape")],
    tH=c("hand"),tBh=w("hand","by hand"),tBr=w("biz","Retail's rule"),tBd=w("biz","what the business"),tAr=w("biz","all be right"),tUn=w("biz","uncorrected"),
    tTt=w("track","tracking table"),tLi=w("track","listing"),tP=c("promise"),tPr=w("promise","what the rule"),tJr=w("promise","not whether"),
    tF=c("first"),tMa=w("first","morning after"),tT=c("team"),tTl=w("team","the list goes"),tOt=w("team","owner's team"),tMb=w("team","mailbox");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  // the set form, centred; then it folds into retail's rule, below on the left, as the data rule arrives above it (it dims to half
  // before it shrinks, so none of its words is read smaller than it's drawn)
  const sh=ease(fin(t,tD-0.9,1.4)),fA=(1-fin(t,tD-0.6,0.9))*(1-0.52*fin(t,tD-1.25,0.3)),fB=ease(fin(t,tP-1.1,1.0)),bA=1-fB,tA=1-fin(t,tP-1.2,0.5);
  let hr=-1;tR.forEach((t0,i)=>{if(t>t0-0.15&&t<t0+1.3)hr=i;});
  if(fA>0.01){ctx.save();const k=lerp(1,0.3,sh);ctx.translate(lerp(960,500,sh),lerp(472,570,sh));ctx.scale(k,k);ctx.translate(-960,-472);
    withA(ctx,fA,()=>arrive(ctx,960,472,t,0.3,()=>d9_ruleForm(ctx,530,120,860,"RUL-022",D9_FROWS,{r:tR.map(t0=>fin(t,t0-0.15,0.5)),hiRow:hr}),{dy:-16}));ctx.restore();}
  // retail's rule: waiting, dimmed, while the data rule is tested; lit as it's named; then up to the top, for what it tracks
  const h22=d9_rule(ctx,0,0,860,"",D9_R22,null,{a:0,size:30}),y22=lerp(D9_Y22,110,fB),r22=fin(t,tD-0.5,0.8)*lerp(0.45,1,fin(t,tBr-0.2,0.5));
  d9_rule(ctx,70,y22,860,"RUL-022",D9_R22,D9_RET,{size:30,a:r22,hi:pulseAt(t,tBr,1.4)+pulseAt(t,tPr+0.2,1.4)});
  withA(ctx,bA*fin(t,tBd-0.2,0.5),()=>tag(ctx,70,y22-34,"a rule about what the business does",D9_RET,{size:28}));
  // the data rule, and its tests, generated from it, one way, as each tool writes them
  withA(ctx,tA,()=>{arrive(ctx,500,D9_Y20+62,t,tDa-0.3,()=>d9_rule(ctx,70,D9_Y20,860,"RUL-020",D9_R20,D9_NET,{size:30,hi:pulseAt(t,tDa,1.4)+pulseAt(t,tAr,1.4)}),{dy:-12});
    withA(ctx,fin(t,tDa-0.1,0.5),()=>tag(ctx,70,D9_Y20-34,"a rule about the data",D9_NET,{size:28}));
    withA(ctx,fin(t,tOw-0.3,0.5)*(1-fin(t,tAr-0.3,0.6)),()=>tag(ctx,970,80,"generated, one way",MOT,{align:"center",size:28}));});
  // the pills the tests fold into, side by side from the arrow
  // the readings it's about, each marked actual or estimate; a test passes every mark
  const rA=1-fin(t,tG-0.5,0.5);if(rA>0.01)withA(ctx,rA*tA,()=>arrive(ctx,1435,333,t,tEr-0.3,()=>d9_readings(ctx,1010,150,850,{hi:D9_ROWS.map((_,i)=>fin(t,tEr+0.3+i*0.15,0.4)),ok:clamp((t-tRt+0.1)/0.9,0,1)}),{dy:-14}));
  const cl=ease(fin(t,tAr-0.3,0.9)),pw=D9_TP.map(l=>tw(ctx,l,30,700)+86),pX=pw.map((w_,i)=>1012+pw.slice(0,i).reduce((a,b)=>a+b,0)+28*i+w_/2);
  D9_GEN.forEach(([ti,ls],i)=>{const y=D9_GY[i],t0=tGn[i],my=y+111,pl=D9_TP[i],px=pX[i];
    d9_feed(ctx,D9_PY,my,clamp((t-t0+0.2)/0.6,0,1),1-cl);
    if(cl<0.99){ctx.save();const k=lerp(1,0.25,cl);ctx.translate(lerp(1435,px,cl),lerp(my,D9_PY,cl));ctx.scale(k,k);ctx.translate(-1435,-my);
      withA(ctx,1-cl,()=>arrive(ctx,1435,my,t,t0-0.1,()=>d9_gen(ctx,1010,y,850,222,ti,ls,{p:clamp((t-t0-0.1)/1.4,0,1),hi:pulseAt(t,t0+0.3,1.4),lock:i===0?pulseAt(t,tBh,1.6):0}),{dy:-14}));ctx.restore();}
    // every test passes: the data is right
    withA(ctx,tA*cl,()=>d9_pill(ctx,px,D9_PY,pl,TECH,"ok",{hi:pulseAt(t,tAr+0.3+i*0.15,1.2)}));});
  d9_feed(ctx,D9_PY,D9_PY,1,tA*cl);
  // nobody edits a check by hand: a pencil comes for the code, and stops at it
  const pin=ease(fin(t,tH-0.5,1.2)),pout=ease(fin(t,tBh+0.6,0.9));if(pin>0&&pout<1){const px=lerp(1900,1520,pin)+380*pout,py=lerp(1040,250,pin)+790*pout;
    d9_pencil(ctx,px,py,1.1,1);cross_(ctx,1520,250,64,D9_RED,fin(t,tBh-0.1,0.3)*(1-pout));}
  // ... while a bill goes uncorrected
  arrive(ctx,260,716,t,tUn-0.3,()=>withA(ctx,tA,()=>{const iw=d9_inst(ctx,0,0,"June bill · $412.80",{a:0}),x0=70;d9_inst(ctx,x0+iw/2,716,"June bill · $412.80",{hi:pulseAt(t,tUn,1.4)});
    d9_res(ctx,x0+iw+40,716,26,false,D9_RED,fin(t,tUn,0.4));withA(ctx,fin(t,tUn+0.1,0.4),()=>T(ctx,"not corrected",x0+iw+80,727,{w:700,size:30,color:rgba(D9_RED,1)}));}),{dy:8});
  // so from retail's rule, a tracking table is generated: the bills it applies to that the next bill didn't correct, with the rule
  // and its owner's team; it folds into a pill as the rule goes up
  const[kx,ky,kw,kh]=D9_TK,tpw=tw(ctx,"tracking table",30,700)+86,tcx=1012+tpw/2;
  d9_feed(ctx,y22+h22/2,y22+h22/2,clamp((t-tTt+0.4)/0.6,0,1),1);
  if(fB<0.99){ctx.save();const k=lerp(1,0.25,fB);ctx.translate(lerp(kx+kw/2,tcx,fB),lerp(ky+kh/2,190,fB));ctx.scale(k,k);ctx.translate(-(kx+kw/2),-(ky+kh/2));
    withA(ctx,1-fB,()=>arrive(ctx,kx+kw/2,ky+kh/2,t,tTt-0.1,()=>d9_gen(ctx,kx,ky,kw,kh,"tracking table",D9_TRK,{p:clamp((t-tTt-0.1)/1.8,0,1),hi:pulseAt(t,tTt+0.3,1.4),hiLine:4,hl:fin(t,tLi,0.5)}),{dy:-14}));ctx.restore();}
  withA(ctx,fin(t,tP-0.5,0.4),()=>d9_pill(ctx,tcx,190,"tracking table",TECH,"table",{hi:pulseAt(t,tPr+0.4,1.2)}));
  // did the job run? every night, yes: that isn't what the rule promised
  const l1=fin(t,tP-0.2,0.5)*(1-0.55*fin(t,tJr+0.1,0.6)),l2=fin(t,tPr-0.3,0.5),st=clamp((t-tJr-0.1)/0.5,0,1);
  withA(ctx,l1,()=>{d9_moon(ctx,92,D9_L1,16,TECH,1);T(ctx,"did the job run?",124,D9_L1+11,{w:700,size:30,color:rgba(TECH,1)});});
  if(st>0){const w_=tw(ctx,"did the job run?",30,700);ctx.save();ctx.strokeStyle=rgba(D9_RED,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(118,D9_L1);ctx.lineTo(118+(w_+12)*st,D9_L1);ctx.stroke();ctx.restore();}
  D9_COL.forEach((x,i)=>arrive(ctx,x,D9_L1,t,tP+0.1+i*0.12,()=>d9_res(ctx,x,D9_L1,26,true,[150,170,200],l1),{dy:-8}));
  // is each bill corrected? yes, until billing moves; the morning after, the first one isn't, and it's listed
  withA(ctx,l2,()=>{d9_sun(ctx,92,D9_L2,20,STR);T(ctx,"is each bill corrected?",124,D9_L2+11,{w:700,size:30,color:rgba(INK,0.97)});});
  D9_COL.slice(0,3).forEach((x,i)=>arrive(ctx,x,D9_L2,t,tPr+0.2+i*0.15,()=>d9_res(ctx,x,D9_L2,26,true,D9_OK,1),{dy:-8}));
  const mv=fin(t,tF+0.2,0.6);if(mv>0)withA(ctx,mv,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(D9_RET,0.8);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(D9_MV,372);ctx.lineTo(D9_MV,700);ctx.stroke();ctx.restore();
    tag(ctx,D9_MV,346,"billing moves · March 2026",D9_RET,{align:"center",size:28});});
  const fx_=D9_COL[3];glow(ctx,fx_,D9_L2,90,D9_RED,0.55*pulseAt(t,tMa+0.2,1.6)+0.5*pulseAt(t,tTl+0.2,1.4));
  arrive(ctx,fx_,D9_L2,t,tMa-0.2,()=>d9_res(ctx,fx_,D9_L2,30,false,D9_RED,1),{dy:-10});
  arrive(ctx,fx_,530,t,tMa,()=>tag(ctx,fx_,530,"the morning after",D9_RED,{align:"center",size:28}),{dy:8});
  arrive(ctx,fx_,688,t,tMa+0.5,()=>tag(ctx,fx_,688,"1 bill not corrected",D9_RED,{align:"center",size:28}),{dy:8});
  // each morning, the list goes to the owner's team, not to a shared mailbox
  arrive(ctx,1440,D9_TY,t,tT-0.2,()=>{d9_pill(ctx,1440,D9_TY,"billing team",TRUST,"team",{hi:pulseAt(t,tOt,1.4)});withA(ctx,fin(t,tT,0.5),()=>tag(ctx,1440,D9_TY+58,"each morning",TRUST,{align:"center",size:28}));},{dy:-10});
  arrive(ctx,620,D9_TY,t,tMb-0.5,()=>{const st=fin(t,tMb+0.2,0.4),pw=d9_pill(ctx,620,D9_TY,"a shared mailbox",[150,160,180],"mail",{a:1-0.35*st});
    if(st>0){const x0=620-pw/2+60,x1=620+pw/2-18;ctx.save();ctx.strokeStyle=rgba(D9_RED,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,D9_TY+2);ctx.lineTo(lerp(x0,x1,ease(st)),D9_TY+2);ctx.stroke();ctx.restore();}},{dy:-10});
  const al=clamp((t-tTl-0.1)/1.0,0,1);if(al>0&&al<1){const e=ease(al),x=lerp(fx_,1440,e),y=lerp(D9_L2+34,D9_TY-34,e)-Math.sin(e*Math.PI)*70;d9_msg(ctx,x,y,0.8,D9_RED,1);}
  ctx.restore();vign(ctx,S);});
/* ---------- 10. Generally, an ontology ---------- */
// The concepts the rules are about, how they relate, and the rules attached: generally, an ontology, ready for OWL. Then the map as the
// one source, with the glossary, the models, the ontology (the graph, shrunk into place) and the checks as its views, as in Meaning
// machines can read. Then one bill, as facts: OWL, reasoning only from what is said, finds its correction unknown; the tracking table
// finds none.
const D9_VW=[["glossary","terms and their definitions","book"],["models","data objects and their keys","object"],["ontology","concepts, relations and rules, in OWL","graph"],["checks","tests and tracking tables","tick"]];
const D9_VR=[860,166,980,138,22],D9_IN=[["June bill · $412.80",330,360],["June estimate",900,360],["actual readings",1470,360]];
scene("onto",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tCo=w("onto","the concepts"),tRel=w("onto","how they relate"),tRu=w("onto","the rules about"),tOn=w("onto","an ontology"),tOwl=w("owl","ready for OWL"),
    tV=c("views"),tGl=w("views","the glossary"),tMo=w("views","the models"),tOt=w("views","the ontology"),tCh=w("views","the checks"),tOm=w("views","one map"),
    tO=c("open"),tSaid=w("open","what is said"),tNev=w("open","never happened"),tUnk=w("open","simply unknown"),tFind=w("job","Finding"),tJob=w("job","tracking table's job");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const[vx,vy0,vw,vh,vg]=D9_VR,shr=ease(fin(t,tV-0.4,1.6)),gone=fin(t,tO-0.9,0.7),k=lerp(1,0.17,shr),gx=lerp(975,vx+vw-180,shr),gy=lerp(455,vy0+2*(vh+vg)+vh/2,shr),dc=shr>0.001?1:0;
  // the map, the one source; each view drawn from it as it's named
  const vA=fin(t,tV-0.1,0.6)*(1-gone);
  if(vA>0.01)withA(ctx,vA,()=>{layerStack(ctx,110,250,520,{sh:56,gap:16,size:28,p:clamp((t-tV)/1.4,0,1),hi:[0,0,0,0,0,0].map((_,i)=>0.5*pulseAt(t,tOm+i*0.08,1.4))});
    tag(ctx,370,196,"one map",EAC,{align:"center",size:30});withA(ctx,fin(t,tOm-0.2,0.5),()=>tag(ctx,1350,100,"one map, many views",EAC,{align:"center",size:28}));});
  D9_VW.forEach(([ti,sub,g],i)=>{const y=vy0+i*(vh+vg),t0=[tGl,tMo,tOt,tCh][i],q=fin(t,t0-0.3,0.5)*(1-gone);if(q<=0.01)return;const fp=clamp((t-t0+0.3)/0.6,0,1);
    withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(EAC,0.8);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(716,466);ctx.lineTo(lerp(716,vx-6,ease(fp)),lerp(466,y+vh/2,ease(fp)));ctx.stroke();ctx.restore();});
    arrive(ctx,vx+vw/2,y+vh/2,t,t0-0.2,()=>d9_view(ctx,vx,y,vw,vh,ti,sub,g,{a:1-gone,hi:pulseAt(t,t0+0.2,1.4)+0.6*pulseAt(t,tOm+0.3,1.4)}),{dy:-10});});
  // the graph: the concepts, then how they relate, then the rules about them; then it shrinks into the ontology's view of the map
  if(gone<0.99){ctx.save();ctx.translate(gx,gy);ctx.scale(k,k);ctx.translate(-975,-455);withA(ctx,1-gone,()=>{
    const P={};D9_ON.forEach(([id,l,x,y])=>P[id]=[x,y,d9_termW(ctx,l)]);
    D9_OE.forEach(([f,to,l,sd],i)=>d9_rel(ctx,P[f],P[to],l,sd,clamp((t-tRel-0.1-i*0.22)/0.7,0,1),{deco:dc}));
    D9_ON.forEach(([id,l,x,y],i)=>arrive(ctx,x,y,t,tCo-0.2+i*0.14,()=>d9_term(ctx,x,y,l,{deco:dc,hi:pulseAt(t,tCo+0.2+i*0.14,1.2)}),{dy:-10}));
    D9_OR.forEach(([id,cid,x,y],i)=>{const t0=tRu+i*0.25,q=fin(t,t0-0.2,0.5);if(q<=0)return;const[cx,cy]=P[cid],side=x>cx+200;
      withA(ctx,q,()=>{ctx.save();ctx.setLineDash([6,7]);ctx.strokeStyle=rgba(MOT,0.75);ctx.lineWidth=2.2;ctx.beginPath();if(side){ctx.moveTo(x-212,y);ctx.lineTo(cx+6,y);}else{ctx.moveTo(x,y<cy?y+29:y-29);ctx.lineTo(cx,y<cy?cy-32:cy+32);}ctx.stroke();ctx.restore();});
      arrive(ctx,x,y,t,t0,()=>d9_rulePill(ctx,x,y,id,id==="RUL-022"?D9_RET:D9_NET,{deco:dc,hi:pulseAt(t,t0+0.2,1.2)}),{dy:-8});});
    const ttl=1-fin(t,tV-1.0,0.5);withA(ctx,fin(t,tOn-0.2,0.5)*ttl,()=>T(ctx,"an ontology",90,150,{w:800,size:44,color:rgba(INK,0.97),deco:dc}));
    arrive(ctx,470,138,t,tOwl-0.2,()=>withA(ctx,ttl,()=>tag(ctx,470,138,"ready for OWL",[176,196,222],{size:28})),{dy:8});});ctx.restore();}
  // one bill, as facts: what was said about it, and the correction nobody said
  const iA=fin(t,tO-0.4,0.6);if(iA>0.01){const W=D9_IN.map(([l])=>tw(ctx,l,30,800)+56),[b,e,ac]=D9_IN;
    d9_rel(ctx,[b[1],b[2],W[0]],[e[1],e[2],W[1]],"based on","above",clamp((t-tO)/0.7,0,1),{a:iA});
    d9_rel(ctx,[e[1],e[2],W[1]],[ac[1],ac[2],W[2]],"replaced by","above",clamp((t-tO-0.4)/0.7,0,1),{a:iA});
    d9_rel(ctx,[b[1],b[2],W[0]],[b[1],604,140],"corrected on","right",clamp((t-tNev+0.6)/0.7,0,1),{a:iA,dash:true,col:[150,160,180]});
    D9_IN.forEach(([l,x,y],i)=>arrive(ctx,x,y,t,tO-0.3+i*0.15,()=>d9_inst(ctx,x,y,l,{hi:pulseAt(t,tSaid+0.1+i*0.12,1.3)+(i===0?pulseAt(t,tJob,1.4):0)}),{dy:-10}));
    arrive(ctx,b[1],604,t,tNev-0.3,()=>d9_slot(ctx,b[1]-70,574,140,60,[150,160,180],1,null),{dy:-8});
    arrive(ctx,b[1]+260,604,t,tNev+0.1,()=>tag(ctx,b[1]+110,604,"never said",[150,160,180],{size:28}),{dy:8});
    arrive(ctx,495,770,t,tUnk-0.6,()=>d9_verdict(ctx,90,700,810,140,"OWL","was it corrected?","unknown",[176,186,206],"?",{v:fin(t,tUnk-0.1,0.5),hi:pulseAt(t,tUnk,1.4)}),{dy:-12});
    arrive(ctx,1425,770,t,tFind-0.3,()=>d9_verdict(ctx,1020,700,810,140,"the tracking table","was it corrected?","no",D9_RED,"x",{v:fin(t,tJob-0.5,0.5),hi:pulseAt(t,tJob,1.4)}),{dy:-12});}
  ctx.restore();vign(ctx,S);});
/* ---------- 11. Back in Tartu ---------- */
// The wall again, toured left to right: the household's bill corrected and the 1,900 found; the two rules, confirmed by their owners;
// Tartu, where the benefit is paid and nobody was asked twice; Tomás's note answered; then the whole wall, and the next question.
const D9_E21=[590,110,560],D9_E22=[590,400,560],D9_ETC=[590,676,560,186];
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  const tBk=w("refund","forty back"),t19=w("refund","nineteen hundred"),tFc=w("refund","found and corrected"),tC=c("confirm"),tG=w("confirm","Grace"),tHr=w("confirm","head of retail"),
    tT=c("tartu"),tPd=w("tartu","is paid"),tTw=w("tartu","asked twice"),tA=c("answer"),tAn=w("answer","an answer"),tGf=w("owner","generated from it"),tN=c("next"),tNx=w("next","Next:");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});focus(ctx,t,[[0,330,330,1.3],[tC-0.9,840,385,1.25],[tT-0.9,870,560,1.1],[tA-0.9,1420,450,1.15],[tN-0.4,960,520,1.0]],1.6);
  // what the camera leaves behind dims as it goes, and comes back for the whole wall (the bill and the count once they are back in frame)
  const back=fin(t,tN-0.4,0.8),zB=1-0.7*fin(t,tT-0.9,0.8)*(1-fin(t,tN+0.7,0.7)),zR=1-0.7*fin(t,tA-0.9,0.8)*(1-back);
  // the household's bill, corrected on the next bill: $144.40 back; and the 1,900 like it, found and corrected
  const fix=fin(t,tBk-0.6,0.6);arrive(ctx,310,228,t,0.3,()=>d9_bill(ctx,90,110,440,{a:zB,amount:fix>0.5?"268.40":"412.80",good:fix>0.5,was:"412.80",wa:fix,note:fix>0.5?"corrected on the next bill":"an estimated reading",
    stamp:"$144.40 back",st:fin(t,tBk,0.5),stampCol:[40,130,70],hi:pulseAt(t,tBk,1.6)}),{dy:-14});
  arrive(ctx,310,480,t,t19-0.4,()=>d9_count(ctx,90,400,440,1900*ease(clamp((t-t19)/1.6,0,1)),{a:zB,tk:clamp((t-tFc)/0.9,0,1),hi:pulseAt(t,tFc+0.3,1.4)}),{dy:-12});
  // the two rules, each confirmed by its owner
  [[D9_E21,"RUL-021",D9_R21,D9_NET,"Grace",tG],[D9_E22,"RUL-022",D9_R22,D9_RET,"head of retail",tHr]].forEach(([[x,y,w_],id,txt,side,who,t0],i)=>{
    const h=d9_rule(ctx,0,0,w_,"",txt,null,{a:0,size:28}),g=fin(t,t0+0.2,0.5);
    arrive(ctx,x+w_/2,y+h/2,t,tC-0.4+i*0.2,()=>d9_rule(ctx,x,y,w_,id,txt,side,{size:28,a:zR,hi:pulseAt(t,t0+0.3,1.4)}),{dy:-12});
    if(g>0)withA(ctx,g*zR,()=>{kt_gtick(ctx,x+22,y+h+30,18,1);T(ctx,"confirmed · "+who,x+52,y+h+40,{w:700,size:28,color:rgba(TRUST,1)});});});
  // Tartu: the benefit paid, and nobody asked twice
  arrive(ctx,D9_ETC[0]+D9_ETC[2]/2,D9_ETC[1]+D9_ETC[3]/2,t,tT-0.6,()=>d9_tartuCard(ctx,...D9_ETC,t,{a:zR,paid:fin(t,tPd-0.2,0.5),once:fin(t,tTw-0.4,0.5),hi:pulseAt(t,tPd,1.4)}),{dy:-14});
  // Tomás's note, and its answer; then the next question
  person(ctx,"tomas",1790,1030,0.74,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,tA,tA+2.6)});
  arrive(ctx,1480,150,t,tA-1.0,()=>sticky(ctx,1480,150,500,120,D9_Q,{col:NOTEC[0],size:32,st:fin(t,tAn+0.4,0.5),rot:-0.03}),{dy:-20});
  arrive(ctx,1480,440,t,tAn-0.2,()=>sticky(ctx,1480,440,540,300,D9_A,{col:NOTEC[0],size:30,p:clamp((t-tAn)/(tGf-tAn+0.8),0,1),rot:0.012}),{dy:-30,from:1.06});
  arrive(ctx,1460,770,t,tNx-0.1,()=>sticky(ctx,1460,770,460,150,D9_NEXT,{col:NOTEC[0],size:30,st:0,rot:0.03}),{dy:-30,from:1.06});
  ctx.restore();vign(ctx,S);
  eaEnd(ctx,S,t,B+0.8,"Rules with a home",EAC,"Write each rule once, where it applies, with an owner and a reason.","Film 9 of 11");});
