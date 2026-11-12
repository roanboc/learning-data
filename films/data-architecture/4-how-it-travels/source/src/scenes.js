/* ===== How it travels: scenes =====
   Eight chapters, as in ../script.md. Chile in October 1972, in lamp-light, one long table of pictures the camera glides along: the
   telex lines from the north to the south, each factory's numbers sent every afternoon, one way, to Santiago (A); the truck owners'
   strike, and those who joined it (B); the shops and factories running out (G); the report once a day that couldn't keep goods
   moving, the two questions the government needed answered as things happened, and the emergency operations centre that read and
   answered two thousand telexes a day (C); the same lines carrying messages both ways, and the trucks still running sent where they
   were needed (D). Then the utility's wall, one room: the systems on each side and the eleven paths across it (W); the Mendozas'
   home at 14 Quarry Lane and its replaced estimate (Q, to W's left); what crosses, under the agreed list (X, under W); the three
   shapes (S, to X's right); the reading published once (X); its contract (C, to X's left); and the flow on the data practice on the
   map (P, under X), the wall running down through W, X and P. Chile and the wall dissolve into each other because the whole picture
   changes; in the room the camera glides from place to place, and whatever it passes is drawn as it was left there. Made to read on
   a phone (tools/legible.py): text is at least 28 px in the frame. Sound: every effect in tools/score.py fires at the same moment as
   the thing it belongs to here, so keep the two in step. */

// the camera in the room: keys are [time, x, y, zoom]; every move eases over 1.7 s
function d4_cam(ctx,S,t,keys){setScreen(ctx,S);return focus(ctx,t,keys,1.7);}
// where Inés stands at W, her feet on the bottom edge
const D4_INW=[1800,1010];
// the contract's place, C, to X's left
const D4_CX=-1920,D4_CY=D4_XY;

/* ---------- the room: its two sides, the wall, and the places' names ---------- */
function d4_room(ctx,o){o=o||{};d4_sides(ctx,{a:o.tint==null?1:o.tint});d4_wall(ctx,D4_WT,o.wb||D4_WB,Object.assign({a:o.wall==null?1:o.wall},o.wo||{}));
  d4_labels(ctx,0,o.labW==null?1:o.labW);d4_labels(ctx,D4_XY,o.labX==null?1:o.labX);}

/* ---------- W: the systems and the paths across the wall ---------- */
// o.card(side, row): a card's options; o.path(k): path k's options, or null; o.tags: [[text, x, y, colour, alpha, align]];
// o.ines: Inés's alpha (0 leaves her out)
function d4_W(ctx,t,o){o=o||{};
  for(let k=0;k<11;k++){const po=o.path?o.path(k):{};if(po)d4_path(ctx,k,po);}
  D4_LS.forEach((s,i)=>d4_sys(ctx,D4_LX,D4_ROWY[i],s,o.card?o.card("L",i)||{}:{}));
  D4_RS.forEach((s,i)=>d4_sys(ctx,D4_RX,D4_ROWY[i],s,o.card?o.card("R",i)||{}:{}));
  (o.extra||[]).forEach(f=>f(ctx));
  (o.tags||[]).forEach(([s,x,y,c,q,al])=>{if(q>0.01)withA(ctx,q,()=>tag(ctx,x,y,s,c,{align:al||"center",size:28}));});
  if(o.ines>0.01)daPerson(ctx,"ines",D4_INW[0],D4_INW[1],0.95,{t:o.T,dir:-1,a:o.ines});}
// W as chapter 1 leaves it: the eleven paths, the four on the map drawn solid, and the two counts
const D4_C11=["11 paths across the wall",960,760,INK],D4_C4=["on the map: 4",960,830,INFC];
function d4_W1(T,a){a=a==null?1:a;return{path:k=>({}),tags:[D4_C11.concat([a]),D4_C4.concat([a])],ines:1,T};}
// W as chapter 2 leaves it: the copied table broken where it ends, the nightly script writing to the old queue, the months, the bills
const D4_QU=[1310,284],D4_QEND=[D4_QU[0]-6,D4_QU[1]+30];
function d4_W2(T,o){o=o||{};const months=o.months||[["August",1]];return{path:k=>k===6?{cut:1,red:1}:k===5?{end:D4_QEND,hi:o.sHi||0}:{},
  extra:[ctx=>{d4_queue(ctx,D4_QU[0],D4_QU[1],{fill:o.fill==null?1:o.fill});withA(ctx,o.nr==null?1:o.nr,()=>tag(ctx,D4_QU[0]+316,D4_QU[1]+30,"nothing reads it",D4_RED,{size:28}));
    d4_cal(ctx,300,670,months,o.cal==null?1:o.cal);const s="about 1,900 bills uncorrected",vw=d4_verdictW(ctx,s);d4_verdict(ctx,960-vw/2+120,760,s,false,o.bills==null?1:o.bills);}],
  tags:[["changed",D4_LX+D4_CW/2,D4_ROWY[0]+D4_CH+32,D4_RED,o.chg==null?1:o.chg]],ines:1,T};}

/* ---------- Q: the Mendozas' home, at 14 Quarry Lane ---------- */
const D4_HOUSE=[D4_QX+470,800],D4_HS=1.2,D4_MAST=[D4_QX+900,800],D4_CHART=[D4_QX+1210,110],D4_QCAL=[D4_QX+110,90];
// o.cal: [[month, alpha]]; o.house: {a, lit, meter}; o.mast: {a, broken}; o.waves (0..1); o.chart: d4_chart's options; o.tags
function d4_Q(ctx,t,o){o=o||{};if(o.cal)d4_cal(ctx,D4_QCAL[0],D4_QCAL[1],o.cal,o.calA==null?1:o.calA);
  const h=o.house||{};if(h.a>0.01){d4_house(ctx,D4_HOUSE[0],D4_HOUSE[1],D4_HS,h);withA(ctx,h.a*(h.plate==null?1:h.plate),()=>tag(ctx,D4_HOUSE[0],D4_HOUSE[1]+40,"14 Quarry Lane",SOFT,{align:"center",size:30}));}
  const m=o.mast||{};if(m.a>0.01)d4_mast(ctx,D4_MAST[0],D4_MAST[1],1.0,m);
  // the meter's radio, from its box by the door to the mast's aerial
  d4_waves(ctx,D4_HOUSE[0]+94*D4_HS,D4_HOUSE[1]-50*D4_HS,D4_MAST[0],D4_MAST[1]-440,t,{on:o.waves||0});
  if(o.chart)d4_chart(ctx,D4_CHART[0],D4_CHART[1],o.chart);
  (o.tags||[]).forEach(([s,x,y,c,q,al])=>{if(q>0.01)withA(ctx,q,()=>tag(ctx,x,y,s,c,{align:al||"center",size:28}));});
  (o.extra||[]).forEach(f=>f(ctx));}

/* ---------- X: what crosses ---------- */
const D4_REC=[80,D4_XY+190],D4_RECW=540,D4_LIST=[80,D4_XY+470],D4_LISTW=560;
const D4_LROWS=["connection point, by network ID","days","estimate it replaces","readings","when it was replaced"];
// where a message leaves the record, on its right edge
const D4_OUT=[D4_REC[0]+D4_RECW+6,D4_REC[1]+100];
// o.rec: the record's options; o.list: {a, p, hi}; o.ret(i): retailer i's options; o.msgs: [[label, u, retailer, alpha, hi]] messages
// on their way, u from 0 (leaving the record) to 1 (arrived); o.extra: more to draw
function d4_X(ctx,t,o){o=o||{};const r=o.rec||{};d4_rec(ctx,D4_REC[0],D4_REC[1],"meter data","replaced reading",Object.assign({w:D4_RECW,f:["CP-0061420","20 to 28 November"]},r));
  const L=o.list||{};if(L.a>0.01)d4_list(ctx,D4_LIST[0],D4_LIST[1],D4_LISTW,"agreed list: a replaced reading",D4_LROWS,L);
  for(let i=0;i<3;i++){const ro=o.ret?o.ret(i):null;if(ro)d4_ret(ctx,D4_RTX,D4_XY+D4_RETY[i],i,ro);}
  (o.msgs||[]).forEach(([s,u,i,q,hi])=>{if(q<=0.01||u<=0||u>=1)return;const[x1,y1]=d4_retIn(i,D4_XY),e=ease(u),x=lerp(D4_OUT[0]+60,x1-d4_msgW(ctx,s)/2,e),y=lerp(D4_OUT[1],y1,e);
    d4_msg(ctx,x,y,s,q*clamp(u*8,0,1)*clamp((1-u)*8,0,1),{hi:hi||0});});
  (o.extra||[]).forEach(f=>f(ctx));}
// X as chapter 3 leaves it: the record at home, the list written, the three retailers
function d4_X3(){return{rec:{star:1},list:{a:1,p:1},ret:i=>({})};}

/* ---------- S: three shapes ---------- */
function d4_panel(ctx,k,title,a,o){o=o||{};if(a<=0.01)return;const x=D4_SX+D4_SPX[k],y=D4_XY+D4_SPY;withA(ctx,a,()=>{glass(ctx,x,y,D4_SPW,D4_SPH,18,INFC,{glow:8+12*(o.hi||0),ea:0.55,fill:"rgba(6,10,20,0.6)"});
  T(ctx,title,x+D4_SPW/2,y+52,{w:800,size:32,align:"center",color:rgba(INK,0.96)});});}
// the board as chapter 4 leaves it, or as far as it's drawn: o.p1, o.p2, o.p3 (0..1) each panel; o.t: the time, for its messages
function d4_S(ctx,t,o){o=o||{};const X0=D4_SX,Y0=D4_XY;
  withA(ctx,o.dama==null?1:o.dama,()=>tag(ctx,X0+960,Y0+80,"three shapes · DAMA-DMBOK",INFC,{align:"center",size:30}));
  // point to point: one system wired straight to another; each new reader adds a wire; a change at one end breaks one, unseen
  const p1=o.p1==null?1:o.p1;if(p1>0.01){d4_panel(ctx,0,"point to point",p1,{hi:o.hi1||0});const px=X0+D4_SPX[0],py=Y0+D4_SPY,A=[px+D4_P2P_A[0],py+D4_P2P_A[1]];
    const nR=o.readers==null?4:o.readers,brk=o.brk==null?1:o.brk;
    D4_P2P_R.forEach(([rx,ry],k)=>{const q=k===0?p1:clamp(nR-k,0,1)*p1;if(q<=0.01)return;const R=[px+rx,py+ry];const br=k===3?brk:0;
      withA(ctx,q,()=>{if(br>0.01){arrowTo(ctx,A[0]+46,A[1],lerp(A[0]+46,R[0]-48,0.7),lerp(A[1],R[1],0.7),mix(INFC,D4_RED,br),0.9,{lw:2.6,nohead:true});kt_rcross(ctx,lerp(A[0]+46,R[0]-48,0.82),lerp(A[1],R[1],0.82),12,br);}
        else arrowTo(ctx,A[0]+46,A[1],R[0]-48,R[1],INFC,0.9,{lw:2.6,head:11});d4_node(ctx,R[0],R[1],{red:br});});});
    d4_node(ctx,A[0],A[1],{a:p1,hi:o.aHi||0});
    withA(ctx,(o.unseen||0)*p1,()=>tag(ctx,px+200,py+472,"unseen",D4_RED,{align:"center",size:28}));
    withA(ctx,(o.like==null?1:o.like)*p1,()=>tag(ctx,px+D4_SPW/2,py+D4_SPH-48,"like the complaints team's link",SOFT,{align:"center",size:28}));}
  // hub and spoke: every system sends to one hub, and reads from it
  const p2=o.p2==null?1:o.p2;if(p2>0.01){d4_panel(ctx,1,"hub and spoke",p2,{hi:o.hi2||0});const px=X0+D4_SPX[1],py=Y0+D4_SPY,Hc=[px+D4_HUB[0],py+D4_HUB[1]];
    D4_HUBN.forEach(([nx,ny],k)=>{const q=clamp(p2*6-k*0.8,0,1);if(q<=0.01)return;const N=[px+nx,py+ny];withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(INFC,0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(N[0],N[1]);ctx.lineTo(Hc[0],Hc[1]);ctx.stroke();ctx.restore();d4_node(ctx,N[0],N[1],{w:76,h:50});});
      const ph=((t*0.45+k*0.37)%1);if(o.run>0.01){const inn=ph<0.5,u=inn?ph*2:(ph-0.5)*2;d4_dot(ctx,inn?N[0]:Hc[0],inn?N[1]:Hc[1],inn?Hc[0]:N[0],inn?Hc[1]:N[1],u,INFC,o.run*q);}});
    withA(ctx,p2,()=>{glow(ctx,Hc[0],Hc[1],60,INFC,0.4);ctx.fillStyle="rgba(8,12,22,0.96)";ctx.beginPath();ctx.arc(Hc[0],Hc[1],34,0,TAU);ctx.fill();ring(ctx,Hc[0],Hc[1],34,INFC,1,3);T(ctx,"hub",Hc[0],Hc[1]+10,{w:800,size:28,align:"center",color:rgba(INFC,1)});});
    withA(ctx,(o.cy||0)*p2,()=>tag(ctx,px+D4_SPW/2,py+D4_SPH-48,"Cybersyn: factories → Santiago",CY_LAMP,{align:"center",size:28}));}
  // publish and subscribe: the home sends each change once, as it happens; each reader allowed to read it subscribes
  const p3=o.p3==null?1:o.p3;if(p3>0.01){d4_panel(ctx,2,"publish and subscribe",p3,{hi:o.hi3||0});const px=X0+D4_SPX[2],py=Y0+D4_SPY,Hm=[px+D4_PS_H[0],py+D4_PS_H[1]];
    const ch0=[px+D4_PS_CH[0][0],py+D4_PS_CH[0][1]],ch1=[px+D4_PS_CH[1][0],py+D4_PS_CH[1][1]];
    withA(ctx,p3,()=>{ctx.save();ctx.strokeStyle=rgba(INFC,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ch0[0],ch0[1]);ctx.lineTo(ch1[0],ch1[1]);ctx.stroke();ctx.restore();
      arrowTo(ctx,Hm[0],Hm[1]+32,ch0[0]+10,ch0[1]-8,INFC,0.9,{lw:2.6,head:11});});
    d4_node(ctx,Hm[0],Hm[1],{a:p3,star:1,starHi:o.homeHi||0});
    D4_PS_R.forEach(([rx,ry],k)=>{const q=clamp(p3*4-k*0.7-0.5,0,1);if(q<=0.01)return;const R=[px+rx,py+ry];withA(ctx,q,()=>{arrowTo(ctx,R[0],ch0[1]+6,R[0],R[1]-30,INFC,0.85,{lw:2.4,head:10});d4_node(ctx,R[0],R[1],{w:76,h:50,hi:o.subHi?o.subHi(k):0});});});
    const nq=clamp(p3*3-1.6,0,1);d4_node(ctx,px+D4_PS_NO[0],py+D4_PS_NO[1],{a:nq,w:76,h:50,lock:1});
    // one change, sent once along the channel, and a copy down to each subscriber
    const u=o.send||0;if(u>0&&u<1){const a1=clamp(u*3,0,1),a2=clamp(u*3-1,0,1),a3=clamp(u*3-2,0,1);
      if(a1<1)d4_dot(ctx,Hm[0],Hm[1]+32,ch0[0]+10,ch0[1],a1,INFC,1);else if(a2<1)d4_dot(ctx,ch0[0],ch0[1],ch1[0],ch1[1],a2,INFC,1);
      if(a2>0)D4_PS_R.forEach(([rx,ry])=>{const xr=px+rx;if(lerp(ch0[0],ch1[0],ease(a2))>=xr-4)d4_dot(ctx,xr,ch0[1],xr,py+ry-30,clamp((ease(a2)*(ch1[0]-ch0[0])-(xr-ch0[0]))/180,0,1),INFC,1);});}
    withA(ctx,(o.once||0)*p3,()=>tag(ctx,px+D4_SPW/2,py+D4_SPH-48,"once, as it happens",INFC,{align:"center",size:28}));}
  // the three questions
  [["who reads it?",617],["when do they act on it?",960],["what may each see?",1351]].forEach(([s,x],k)=>{const q=o.q?o.q(k):0;if(q>0.01)withA(ctx,q,()=>tag(ctx,X0+x,Y0+826,s,TRUST,{align:"center",size:30}));});}

/* ---------- 1. The same lines ---------- */
// the trucks still running, on the map: [from town, to town, when it sets off]; they go where goods are short
const D4_TRUCKS=[[8,4,0],[8,13,0.35],[9,15,0.7],[6,11,0.2],[10,16,0.55],[7,2,0.9]];
function d4_town(i){return daChileXY(DA_SITES[i][0],DA_SITES[i][1],D4_MX,D4_MY,D4_MH);}
scene("strike",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tU=c("utility"),toU=fin(t,tU-0.6,1.2);
  if(toU<0.99){ctx.save();ctx.globalAlpha=1-toU;d4_night(ctx,S,t);setScreen(ctx,S);
    const tDa=c("daily"),tSt=c("strike"),tGo=c("goods"),tOn=c("once"),tNe=c("needed"),tCe=c("centre"),tRe=c("read"),tBo=c("both"),tTr=c("trucks");
    focus(ctx,t,[[0,960,540,1.0],[tSt-0.7,D4_CB+960,540,1.0],[tGo-0.6,D4_CG+960,540,1.0],[tOn-0.6,D4_CC+960,540,1.0],[tBo-0.7,D4_CD+960,540,1.0]],1.7);
    // A: the country and its telex lines, north to south; every afternoon, each factory's numbers, one way, to Santiago
    if(t<tSt+2.4){const tLi=w("year","telex lines"),tNo=w("year","north"),tSo=w("year","south"),tAf=w("daily","Every afternoon"),tOw=w("daily","one way"),tSa=w("daily","to Santiago");
      daChile(ctx,D4_MX,D4_MY,D4_MH,{dots:fin(t,0.5,1.4),lines:clamp((t-tLi+0.4)/3.2,0,1),city:fin(t,0.8,1.0),label:"left"});
      d4_pulses(ctx,t,{out:fin(t,tAf-0.2,0.8),rate:0.26});
      withA(ctx,fin(t,tNo-0.2,0.6),()=>tag(ctx,660,120,"north",CY_LAMP,{size:28}));withA(ctx,fin(t,tSo-0.2,0.6),()=>tag(ctx,660,800,"south",CY_LAMP,{size:28}));
      d4_card(ctx,820,150,0,"Cybersyn","its telex lines, from the north to the south",fin(t,tLi-0.4,0.7));
      daFactory(ctx,980,820,0.55,{lit:0.85,t,a:fin(t,tDa-0.4,0.8),name:"a factory"});
      const pq=0.3+0.5*clamp((t-tAf)/2.0,0,1);daTelex(ctx,1250,830,0.55,{paper:pq,typing:t>tAf&&t<tAf+2.2?1:null,t,a:fin(t,tDa-0.3,0.7)});
      d4_card(ctx,1380,330,0,"Santiago","where the numbers were read",fin(t,tSa-0.7,0.6));
      // the day's figures go one way: from the telex to Santiago, and nothing comes back
      const fp=clamp((t-tOw+0.3)/1.4,0,1);if(fp>0.01){arrowTo(ctx,1330,560,1560,468,CY_LAMP,0.9,{p:fp,lw:2.8,head:14});const u=sstep(0,1,fp);d4_strip(ctx,lerp(1180,1420,u),lerp(590,500,u)-30,280,"FIGURES",fin(t,tOw-0.3,0.4)*(1-fin(fp,0.85,0.15)),{size:28,h:60,rot:-0.02});}
      withA(ctx,fin(t,tOw,0.6),()=>tag(ctx,1500,620,"every afternoon · one way",CY_LAMP,{size:28}));}
    // B: the truck owners' strike, and those who joined it
    if(t>tSt-2.6&&t<tGo+2.4){ctx.save();ctx.translate(D4_CB,0);const tTo=w("strike","truck owners"),tSh=w("strike","shopkeepers"),tBa=w("strike","bank clerks"),tOt=w("strike","others");
      d4_card(ctx,120,110,0,"the truck owners' strike","against a plan for a state trucking company",fin(t,tTo-0.3,0.7));
      [260,600,940].forEach((x,i)=>d4_truck(ctx,x,800,0.95,{a:fin(t,tSt-0.6+i*0.25,0.8)}));
      [[1290,"shopkeepers",tSh],[1530,"bank clerks",tBa],[1770,"and others",tOt]].forEach(([x,s,t0],k)=>{const q=fin(t,t0-0.3,0.7);daSil(ctx,x,830,300,{a:q,dir:k===2?-1:1});withA(ctx,q,()=>tag(ctx,x,420,s,CY_LAMP,{align:"center",size:28}));});
      ctx.restore();}
    // G: with most trucks standing still, shops and factories running out
    if(t>tGo-2.6&&t<tOn+2.4){ctx.save();ctx.translate(D4_CG,0);const tSs=w("goods","standing still"),tSf=w("goods","shops and factories"),tRu=w("goods","run out");
      d4_truck(ctx,230,820,0.8,{a:fin(t,tGo-0.6,0.7)});withA(ctx,fin(t,tSs-0.2,0.6),()=>tag(ctx,230,640,"standing still",SOFT,{align:"center",size:28}));
      const run=clamp((t-tRu+0.3)/3.2,0,1);d4_shop(ctx,800,820,1.0,{a:fin(t,tSf-0.4,0.7),stock:1-0.85*run});
      daFactory(ctx,1420,820,0.8,{lit:0.9-0.6*run,t,a:fin(t,tSf-0.1,0.7)});
      withA(ctx,fin(t,tSf-0.2,0.6),()=>{tag(ctx,800,470,"shops",CY_LAMP,{align:"center",size:28});tag(ctx,1340,440,"factories",CY_LAMP,{align:"center",size:28});});
      withA(ctx,fin(t,tRu-0.1,0.6),()=>tag(ctx,960,200,"running out of essential goods",CY_SIG,{align:"center",size:32}));
      ctx.restore();}
    // C: once a day wasn't enough; what the government needed to hear, as it happened; the emergency operations centre
    if(t>tOn-2.6&&t<tBo+2.4){ctx.save();ctx.translate(D4_CC,0);const tOd=w("once","once a day"),tCk=w("once","couldn't");
      const sA=fin(t,tOn-0.4,0.6)*(1-fin(t,tCe-0.7,0.5));d4_strip(ctx,120,140,600,"TODAY'S FIGURES",sA,{size:32,h:90});
      withA(ctx,fin(t,tOd-0.2,0.5)*(1-fin(t,tCe-0.7,0.5)),()=>tag(ctx,140,290,"once a day · one way",CY_LAMP,{size:28}));
      withA(ctx,1-fin(t,tCe-0.7,0.5),()=>kt_rcross(ctx,770,185,22,fin(t,tCk,0.4)));
      const tWh=w("needed","where goods"),tWt=w("needed","which trucks"),tAs=w("needed","as it happened");
      d4_card(ctx,1020,140,0,"where are goods short?",null,fin(t,tWh-0.3,0.6),{size:34});d4_card(ctx,1020,250,0,"which trucks can still run?",null,fin(t,tWt-0.3,0.6),{size:34});
      withA(ctx,fin(t,tAs-0.2,0.6),()=>tag(ctx,1048,372,"as it happens",CY_SIG,{size:28}));
      const tEm=w("centre","emergency"),tFl=w("centre","Fernando Flores"),tTw=w("read","two thousand"),tAn=w("read","answered");
      d4_card(ctx,120,140,0,"an emergency operations centre","set up by Fernando Flores, in Santiago",fin(t,tEm-0.3,0.7),{hi:pulseAt(t,tFl,1.2)});
      d4_card(ctx,120,300,0,"about 2,000 telexes a day","read, and answered",fin(t,tTw-0.3,0.6));
      // the room: three telexes, the people reading and answering at them, the strips coming in and the answers going out
      [900,1200,1500].forEach((x,k)=>{const q=fin(t,tCe+0.4+k*0.25,0.8);daTelex(ctx,x,850,0.5,{paper:0.4+0.4*clamp((t-tRe-k*0.6)/4,0,1),typing:t>tAn+k*0.3&&t<tAn+2+k*0.3?1:null,t:t+k,a:q});daSil(ctx,x+112,860,270,{a:q,dir:-1,rim:CY_LAMP});});
      const inA=fin(t,tRe,0.6)*(1-fin(t,tBo-0.9,0.5));if(inA>0.01)for(let k=0;k<3;k++){const u=((t-tRe)*0.22+k/3)%1,q=inA*Math.sin(Math.PI*u);d4_strip(ctx,lerp(-120,700,u),470+k*70,240,"GOODS SHORT",q,{size:28,h:54,rot:0.01*(k-1)});}
      const outA=fin(t,tAn,0.6)*(1-fin(t,tBo-0.9,0.5));if(outA>0.01)for(let k=0;k<2;k++){const u=((t-tAn)*0.22+k/2)%1,q=outA*Math.sin(Math.PI*u);d4_strip(ctx,lerp(1240,1660,u),470+k*80,280,"TRUCKS COMING",q,{size:28,h:54,rot:-0.01,sig:1,scol:D4_MINT});}
      ctx.restore();}
    // D: the same lines, now carrying messages many times a day, both ways; the trucks still running, sent where they're needed most
    if(t>tBo-2.6){ctx.save();ctx.translate(D4_CD,0);const tBd=w("both","both directions"),tTw=w("trucks","two hundred"),tNm=w("trucks","needed most"),tFo=w("trucks","forty thousand");
      daChile(ctx,D4_MX,D4_MY,D4_MH,{dots:1,lines:1,city:1,label:"left"});d4_pulses(ctx,t,{out:fin(t,tBo-0.6,0.8),back:fin(t,tBd-0.3,0.8),n:3,rate:0.3});
      d4_card(ctx,820,150,0,"the same lines","new messages, many times a day, both ways",fin(t,tBo-0.4,0.7));
      const dest=new Set(D4_TRUCKS.map(r=>r[1]));dest.forEach(i=>{const[x,y]=d4_town(i);ring(ctx,x,y,15,CY_SIG,0.9*fin(t,tNm-0.3,0.6),2.4);});
      D4_TRUCKS.forEach(([a,b,d],k)=>{const u=sstep(0,1,clamp((t-tTw-d)/4.5,0,1)),q=fin(t,tTw-0.3+d,0.5);if(q<=0.01)return;const[x0,y0]=d4_town(a),[x1,y1]=d4_town(b);
        d4_mini(ctx,lerp(x0,x1,u)+18,lerp(y0,y1,u),q,{rot:y1>y0?Math.PI/2:-Math.PI/2});});
      withA(ctx,fin(t,tTw-0.2,0.6),()=>tag(ctx,820,360,"about 200 trucks still running",D4_MINT,{size:30}));
      withA(ctx,fin(t,tFo-0.2,0.6),()=>tag(ctx,820,440,"against the effects of 40,000 on strike",SOFT,{size:28}));
      ctx.restore();}
    // the year and the place, in the frame's corner while the country is on screen
    setScreen(ctx,S);daYear(ctx,90,96,"Chile, October 1972",fin(t,0.3,0.8)*(1-fin(t,tSt-1.0,0.6)));
    ctx.restore();}
  // the utility: Inés lists every path across the wall between the network and retail; eleven, four of them on the map
  if(toU>0.01){ctx.save();ctx.globalAlpha=toU;wallBg(ctx,S,t);d4_cam(ctx,S,t,[[0,960,540,1.0]]);ctx.globalAlpha=toU*(1-0.6*fin(t,B+0.8,0.8));  // dimmed under the title
    const tLs=w("utility","lists every path"),tWa=w("utility","the wall"),tNe=w("utility","the network"),tEl=w("eleven","finds eleven"),tMa=w("eleven","on the map");
    d4_sides(ctx,{a:fin(t,tU+0.2,0.8)});d4_labels(ctx,0,fin(t,tNe-0.2,0.6));d4_wall(ctx,D4_WT,1100,{a:fin(t,tU+0.2,0.6),p:clamp((t-tWa+0.4)/1.0,0,1),hi:pulseAt(t,tWa+0.4,1.4)});
    const span=(tEl-tLs-0.2)/11,mp=clamp((t-tMa-0.1)/0.7,0,1);
    d4_W(ctx,t,{path:k=>{const j=D4_FIND.indexOf(k),t0=tLs+0.1+j*span;return{p:clamp((t-t0)/0.5,0,1),map:D4_P[k][6]*mp,hi:D4_P[k][6]*pulseAt(t,tMa+0.4,1.4)};},
      card:(s,i)=>({a:fin(t,tU+0.4+(s==="L"?0:0.3)+i*0.15,0.6)}),
      tags:[D4_C11.concat([fin(t,tEl-0.1,0.6)]),D4_C4.concat([fin(t,tMa-0.1,0.6)])],ines:fin(t,tU+0.3,0.8),T:sc.start+t});
    ctx.restore();}
  vign(ctx,S);
  daTitle(ctx,S,t,B+1.0,"How it travels","what crosses, in which shape, under which contract","Film 4 of 6 · data architecture");});

/* ---------- 2. Paths nobody drew ---------- */
scene("paths",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tLi=c("link"),tAl=c("all"),tWa=c("wall"),tOw=c("owner"),tMa=c("march");
  wallBg(ctx,S,t);d4_cam(ctx,S,t,[[0,960,540,1.0]]);
  const tDb=w("link","database"),tCo=w("link","complaints team"),tEv=w("all","every connection"),tOt=w("all","other retailers"),tSt=w("wall","there to stop"),tCu=w("wall","customer information");
  const tNo=w("owner","no owner"),tCh=w("owner","one end changes"),tBr=w("owner","breaks"),tSc=w("march","nightly script"),tQu=w("march","a queue"),tBi=w("march","bills");
  // the link: from meter data's database to customer service, the others dimmed; then the copied table, which has no owner at either
  // end and breaks; then the nightly script, writing to a queue nothing reads
  const lk=fin(t,tDb-0.4,0.5)*(1-fin(t,tNo-0.5,0.5)),ct=fin(t,tNo-0.4,0.5)*(1-fin(t,tMa-0.5,0.5)),scr=fin(t,tSc-0.4,0.5),dim=Math.max(lk,ct,scr);
  const cut=clamp((t-tBr+0.1)/0.5,0,1),qm=sstep(0,1,clamp((t-tQu+0.2)/0.7,0,1));
  const months=d4_months(t,["March","April","May","June","July","August"],[tMa,tQu+0.2,tQu+0.8,tQu+1.4,tQu+2.0,tQu+2.6]);
  d4_room(ctx,{wo:{red:pulseAt(t,tSt+0.1,1.6),redY:lerp(209,368,0.5)}});
  const ends5=d4_pathEnds(5),qEnd=[lerp(ends5[1][0],D4_QEND[0],qm),lerp(ends5[1][1],D4_QEND[1],qm)];
  d4_W(ctx,t,{path:k=>{const me=k===4?lk:k===6?ct:k===5?scr:0;return{a:lerp(1,0.3,dim*(1-me)),hi:me,cut:k===6?cut:0,red:k===6?cut:0,end:k===5&&qm>0?qEnd:undefined};},
    card:(s,i)=>({hi:(s==="L"&&i===0?pulseAt(t,tCh+0.2,1.4):0)+(s==="R"&&i===1?pulseAt(t,tCo+0.2,1.4):0)}),
    extra:[ctx=>{
      // what the link shows: every connection point's readings, those served by other retailers among them
      const gA=fin(t,tEv-0.4,0.6)*(1-fin(t,tWa-0.5,0.5));d4_grid(ctx,640,646,{a:gA,p:clamp((t-tEv+0.2)/1.6,0,1),v:fin(t,tOt-0.2,0.7)});
      // why the wall is there
      ruleCard(ctx,560,664,800,"Customer information stays with the business that collected it.",{kicker:"the wall",col:D4_RED,size:30,a:fin(t,tCu-0.3,0.7)*(1-fin(t,tNo-0.6,0.5)),hi:pulseAt(t,tCu+0.6,1.4)});
      // no owner at either end of the copied table; one end changes, and the other finds out when it breaks
      const[[ax,ay],[bx,by]]=d4_pathEnds(6);daUnowned(ctx,ax+30,ay+4,fin(t,tNo-0.2,0.5)*(1-fin(t,tMa-0.5,0.5)));daUnowned(ctx,bx-30,by-4,fin(t,tNo+0.2,0.5)*(1-fin(t,tMa-0.5,0.5)));
      // the nightly script and the old queue: slip by slip, month after month, and nothing reads it
      const qA=fin(t,tQu-0.3,0.6);d4_queue(ctx,D4_QU[0],D4_QU[1],{a:qA,fill:clamp((t-tQu-0.2)/3.2,0,1),hi:pulseAt(t,w("march","nothing read")+0.2,1.4)});
      withA(ctx,fin(t,w("march","nothing read")-0.1,0.6),()=>tag(ctx,D4_QU[0]+316,D4_QU[1]+30,"nothing reads it",D4_RED,{size:28}));
      d4_cal(ctx,300,670,months,fin(t,tMa-0.2,0.6));
      const s="about 1,900 bills uncorrected",vw=d4_verdictW(ctx,s);d4_verdict(ctx,960-vw/2+120,760,s,false,fin(t,tBi-0.4,0.6),{hi:pulseAt(t,tBi,1.4)});}],
    tags:[D4_C11.concat([1-fin(t,tLi-0.4,0.5)]),D4_C4.concat([1-fin(t,tLi-0.4,0.5)]),["database link",843,262,SOFT,lk],["complaints team",D4_RX+10,D4_ROWY[1]+D4_CH+34,APPC,fin(t,tCo-0.2,0.6)*(1-fin(t,tNo-0.5,0.5)),"left"],
      ["copied table",960,lerp(d4_pathEnds(6)[0][1],d4_pathEnds(6)[1][1],0.5)-30,SOFT,ct*(1-fin(t,tBr-0.3,0.4))],["changed",D4_LX+D4_CW/2,D4_ROWY[0]+D4_CH+32,D4_RED,fin(t,tCh-0.1,0.5)],
      ["nightly script",780,232,SOFT,scr]],ines:1,T:sc.start+t});
  vign(ctx,S);});

/* ---------- 3. What crosses ---------- */
scene("crosses",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tMe=c("meter"),tEs=c("est"),tBa=c("back"),tLi=c("list"),tFi=c("five"),tPa=c("parts"),tOw=c("own"),tNo=c("nothing");
  wallBg(ctx,S,t);d4_cam(ctx,S,t,[[0,960,540,1.0],[0.8,D4_QX+960,540,1.0],[tLi-0.7,960,D4_XY+540,1.0]]);
  d4_room(ctx,{});
  // W, as chapter 2 left it, while the camera moves on
  d4_W(ctx,t,d4_W2(sc.start+t));
  // Q: in November the meter stopped sending, for nine days, while the mast was mended; the network estimated them, billing used the
  // estimate; the meter came back, sent what it had stored, and the estimate was replaced
  const tSt=w("meter","stopped sending"),tNi=w("meter","nine days"),tMa=w("meter","radio mast"),tEd=w("est","estimated"),tBu=w("est","billing used"),tCb=w("back","came back"),tSo=w("back","stored"),tRe=w("back","replaced");
  const broken=fin(t,tMa-0.3,0.5)*(1-fin(t,tCb-0.3,0.5)),rep=clamp((t-tRe+0.1)/1.4,0,1);
  d4_Q(ctx,t,{cal:[["November",1]],calA:fin(t,tMe-0.4,0.6),house:{a:fin(t,0.6,0.8),lit:1,meter:1-0.8*fin(t,tSt,0.4)+0.8*fin(t,tCb,0.4)},mast:{a:fin(t,0.9,0.8),broken},
    waves:(1-fin(t,tSt-0.2,0.4))*fin(t,0.9,0.6)+fin(t,tSo-0.4,0.5),
    chart:{a:fin(t,tNi-0.5,0.6),miss:fin(t,tNi-0.2,0.5),est:fin(t,tEd-0.1,0.6),rep,star:fin(t,tRe+1.2,0.4),pop:spring(clamp((t-tRe-1.2)/0.8,0,1.6))},
    tags:[["being mended",D4_MAST[0],D4_MAST[1]-520,D4_RED,broken],["no readings: 9 days",D4_CHART[0]+320,D4_CHART[1]-34,SOFT,fin(t,tNi-0.1,0.5)*(1-fin(t,tEd-0.4,0.4))],
      ["estimated",D4_CHART[0]+320,D4_CHART[1]-34,CY_SIG,fin(t,tEd,0.5)*(1-fin(t,tRe-0.3,0.4))],["replaced",D4_CHART[0]+320,D4_CHART[1]-34,TECH,fin(t,tRe+0.2,0.5)],
      ["billing used the estimate",D4_CHART[0]+320,D4_CHART[1]+460,APPC,fin(t,tBu-0.2,0.6)*(1-fin(t,tRe-0.3,0.4))]]});
  // X: the replacement has to cross the wall; the agreed list says what may cross, five things; each retailer gets them only for
  // the connection points it serves; nothing else from the meter crosses
  const tAg=w("list","agreed list"),tCP=w("parts","connection point"),tDy=w("parts","the days"),tEt=w("parts","the estimate"),tRd=w("parts","the readings"),tWh=w("parts","when it was replaced");
  const tEa=w("own","Each retailer"),tSv=w("own","serves"),tGr=w("own","group's own");
  const rows=[tCP,tDy,tEt,tRd,tWh],lp=rows.reduce((m,r,i)=>Math.max(m,clamp((t-r+0.2)/0.5,0,1)>0?(i+clamp((t-r+0.2)/0.5,0,1))/5:0),0);
  d4_X(ctx,t,{rec:{a:fin(t,tLi-0.4,0.6),star:fin(t,tLi-0.1,0.4),pop:spring(clamp((t-tLi+0.1)/0.8,0,1.6)),hi:pulseAt(t,w("list","the replacement")+0.2,1.4)},
    list:{a:fin(t,tAg-0.3,0.6),p:lp,hi:i=>pulseAt(t,rows[i]+0.2,1.2)},ret:i=>({a:fin(t,tEa-0.3+i*0.2,0.6),hi:i===0?pulseAt(t,tGr+0.2,1.6):0}),
    msgs:D4_CPS.map((s,i)=>[s,clamp((t-tSv+0.2-i*0.45)/1.4,0,1),i,1,0]),
    extra:[ctx=>{withA(ctx,fin(t,tFi-0.1,0.5),()=>tag(ctx,D4_LIST[0]+D4_LISTW-110,D4_LIST[1]-6,"5 things",INFC,{align:"center",size:28}));
      withA(ctx,fin(t,tGr-0.1,0.6),()=>tag(ctx,D4_RTX+D4_RW/2,D4_XY+D4_RETY[2]+D4_RH+42,"the same rule for every retailer",TRUST,{align:"center",size:28}));
      // what else the meter records, stopped at the wall
      [["voltage",0],["power quality",1],["meter events",2]].forEach(([s,k])=>{const t0=w("nothing","Nothing else")+k*0.35,u=sstep(0,1,clamp((t-t0)/0.9,0,1)),q=fin(t,t0-0.1,0.3)*(1-fin(t,t0+2.4,0.5));if(q<=0.01)return;
        const ww=tw(ctx,s,28,700)+26,x=lerp(D4_OUT[0]+20,940-ww-8,u)-8*Math.sin(clamp((t-t0-0.9)/0.4,0,1)*Math.PI),y=D4_XY+520+k*70;
        withA(ctx,q,()=>{tag(ctx,x,y,s,SOFT,{size:28});if(u>=1)kt_rcross(ctx,940+8,y,13,fin(t,t0+0.9,0.3));});});}]});
  vign(ctx,S);});

/* ---------- 4. Three shapes ---------- */
scene("shapes",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tCh=c("choice"),tP2=c("p2p"),tWi=c("wires"),tHu=c("hub"),tPs=c("pubsub"),tTh=c("three");
  wallBg(ctx,S,t);d4_cam(ctx,S,t,[[0,960,D4_XY+540,1.0],[0.8,D4_SX+960,D4_XY+540,1.0]]);
  d4_room(ctx,{});
  // X, as chapter 3 left it, while the camera moves on
  if(t<3.2)d4_X(ctx,t,d4_X3());
  const tDa=w("choice","DAMA"),tWr=w("p2p","wired straight"),tLk=w("p2p","complaints team"),tNr=w("wires","each new reader"),tCe=w("wires","a change"),tBr=w("wires","break the other"),tUn=w("wires","unseen");
  const tEv=w("hub","every system"),tCy=w("hub","Cybersyn"),tHo=w("pubsub","the home"),tOn=w("pubsub","once"),tSu=w("pubsub","subscribes");
  d4_S(ctx,t,{dama:fin(t,tDa-0.3,0.6),p1:fin(t,tP2-0.2,0.7),like:fin(t,tLk-0.2,0.6),readers:1+clamp((t-tNr+0.2)/1.4,0,1)*3,aHi:pulseAt(t,tCe+0.1,1.2),brk:clamp((t-tBr+0.1)/0.5,0,1),unseen:fin(t,tUn-0.1,0.5),
    p2:fin(t,tHu-0.2,0.7),run:fin(t,tEv,0.6),cy:fin(t,tCy-0.2,0.6),p3:fin(t,tPs-0.2,0.7),homeHi:pulseAt(t,tHo+0.2,1.2),send:clamp((t-tOn+0.2)/2.2,0,1),once:fin(t,tOn+0.2,0.6),subHi:k=>pulseAt(t,tSu+0.2+k*0.2,1.2),
    q:k=>fin(t,[w("three","who reads it"),w("three","when they act"),w("three","what each may see")][k]-0.2,0.6)});
  vign(ctx,S);});

/* ---------- 5. Published once ---------- */
scene("once",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tWo=c("who"),tWe=c("when"),tSe=c("see"),tSo=c("so"),tHo=c("hour"),tCl=c("closed");
  wallBg(ctx,S,t);d4_cam(ctx,S,t,[[0,D4_SX+960,D4_XY+540,1.0],[0.8,960,D4_XY+540,1.0]]);
  d4_room(ctx,{});
  // the shapes, as chapter 4 left them, while the camera moves back
  if(t<3.2)d4_S(ctx,sc.start+t,{readers:4,brk:1,unseen:1,run:1,cy:1,once:1,like:1,q:()=>1});
  const tBi=w("who","billing"),tCs=w("who","customer service"),tNb=w("when","next bill"),tPh=w("when","on the phone"),tOn=w("see","only its own");
  const tPu=w("so","publishes"),tRo=w("so","receives only its own"),tLc=w("closed","link is closed"),tSm=w("closed","same messages");
  // three readings published, one after another, each going only to its own retailer, where both its readers get it
  const pub=[tPu+0.1,tPu+0.9,tPu+1.7],arr=i=>pub[i]+1.4,cl=clamp((t-tLc+0.1)/0.6,0,1),cs=fin(t,tSm-0.3,0.6);
  d4_X(ctx,t,{rec:{star:1,hi:pulseAt(t,tPu,1.4)},list:{a:1,p:1},
    ret:i=>({lock:fin(t,tOn-0.2+i*0.2,0.5),when:fin(t,tNb-0.4+i*0.15,0.6),hi:pulseAt(t,arr(i),1.2)+(i===0?pulseAt(t,tSm+0.6,1.2):0),
      rhi:k=>(k===0?pulseAt(t,tBi+0.1+i*0.15,1.2):pulseAt(t,tCs+0.1+i*0.15,1.2))+pulseAt(t,arr(i)+0.1,1.2),extra:i===0?["complaints team too",cs]:null,whenA:i===0?1-cs:1}),
    msgs:D4_CPS.map((s,i)=>[s,clamp((t-pub[i])/1.4,0,1),i,1,0]),
    extra:[ctx=>{
      // published once, when it's replaced: a ring at the home as each leaves
      pub.forEach(p=>{const u=clamp((t-p+0.1)/0.7,0,1);if(u>0&&u<1)ring(ctx,D4_OUT[0],D4_OUT[1],20+50*u,INFC,0.8*(1-u),3);});
      withA(ctx,fin(t,tPu-0.2,0.6),()=>tag(ctx,D4_REC[0]+D4_RECW/2,D4_REC[1]-36,"published once, when it's replaced",INFC,{align:"center",size:28}));
      // soon enough: within the hour
      d4_clock(ctx,960,D4_XY+700,42,clamp((t-tHo)/2.6,0,1),fin(t,tHo-0.3,0.6),{col:INFC});withA(ctx,fin(t,tHo-0.1,0.6),()=>tag(ctx,960,D4_XY+784,"within the hour",INFC,{align:"center",size:28}));
      // the complaints team's link, still there, and closed
      const la=fin(t,tCl-0.4,0.5)*(1-fin(t,tLc+0.8,0.6));if(la>0.01){const[x1,y1]=[D4_RTX-8,D4_XY+D4_RETY[0]+162];withA(ctx,la,()=>{d4_pathLine(ctx,D4_OUT[0],D4_OUT[1]+40,x1,y1,cl);
        tag(ctx,lerp(D4_OUT[0],x1,0.42),lerp(D4_OUT[1]+40,y1,0.42)-34,"the complaints team's link",SOFT,{align:"center",size:28});});}}]});
  vign(ctx,S);});
// the old link, as it's closed: grey and dashed, then red and cut, as c goes to 1
function d4_pathLine(ctx,x0,y0,x1,y1,c){arrowTo(ctx,x0,y0,lerp(x0,x1,1-0.2*c),lerp(y0,y1,1-0.2*c),mix(SOFT,D4_RED,c),0.85,{dash:[8,8],lw:2.4,nohead:c>0.01});if(c>0.01)kt_rcross(ctx,lerp(x0,x1,0.9),lerp(y0,y1,0.9),14,c);}

/* ---------- 6. Under a contract ---------- */
scene("contract",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tAg=c("agreed"),tNb=c("nobody"),tWh=c("what"),tSo=c("soon"),tLa=c("late"),tCh=c("change");
  wallBg(ctx,S,t);d4_cam(ctx,S,t,[[0,960,D4_XY+540,1.0],[0.8,D4_CX+960,D4_CY+540,1.0]]);
  d4_room(ctx,{});
  // X, as chapter 5 left it, while the camera moves on
  if(t<3.2)d4_X(ctx,t,{rec:{star:1},list:{a:1,p:1},ret:i=>({lock:1,when:1,extra:i===0?["complaints team too",1]:null,whenA:i===0?0:1})});
  // the flow and the two teams at its ends: Grace's, which sends it, and billing's, which reads it; then its contract, term by term
  const X0=D4_CX,Y0=D4_CY+50,tGr=w("agreed","Grace's"),tBl=w("agreed","billing's");
  const gw=daOwner(ctx,X0+160,Y0+140,"Grace · network operations",{a:fin(t,tGr-0.3,0.6),hi:pulseAt(t,tGr+0.2,1.4)});
  const bw=tw(ctx,"billing",28,700)+70;daOwner(ctx,X0+1760-bw,Y0+140,"billing",{a:fin(t,tBl-0.3,0.6),hi:pulseAt(t,tBl+0.2,1.4)});
  daFlowLine(ctx,X0+160+gw+16,Y0+140,X0+1760-bw-16,Y0+140,clamp((t-tAg-0.2)/1.0,0,1),{col:INFC,lw:3});
  withA(ctx,fin(t,tAg+0.3,0.6),()=>tag(ctx,X0+960,Y0+100,"replaced readings",INFC,{align:"center",size:28}));
  withA(ctx,fin(t,tGr,0.5),()=>T(ctx,"sends",X0+160+gw/2,Y0+204,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)}));withA(ctx,fin(t,tBl,0.5),()=>T(ctx,"reads",X0+1760-bw/2,Y0+204,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)}));
  const ts=[w("agreed","agreed by"),w("nobody","nobody else"),w("what","what crosses"),w("soon","How soon"),w("late","late or wrong"),w("change","how it changes")];
  d4_contract(ctx,X0+260,Y0+250,1400,{a:fin(t,tAg-0.2,0.7),p:i=>fin(t,ts[i]-0.2,0.6),hiT:i=>pulseAt(t,ts[i]+0.3,1.4)});
  vign(ctx,S);});

/* ---------- 7. On the map ---------- */
scene("map",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tDr=c("drawn"),tNa=c("names"),tEv=c("every"),tFi=c("five"),tBu=c("built");
  wallBg(ctx,S,t);d4_cam(ctx,S,t,[[0,D4_CX+960,D4_CY+540,1.0],[0.8,960,D4_PY+540,1.0]]);
  d4_room(ctx,{});
  // the contract, as chapter 6 left it, while the camera moves down
  if(t<3.2){const X0=D4_CX,Y0=D4_CY+50,gw=daOwner(ctx,X0+160,Y0+140,"Grace · network operations",{}),bw=tw(ctx,"billing",28,700)+70;daOwner(ctx,X0+1760-bw,Y0+140,"billing",{});
    daFlowLine(ctx,X0+160+gw+16,Y0+140,X0+1760-bw-16,Y0+140,1,{col:INFC,lw:3});tag(ctx,X0+960,Y0+100,"replaced readings",INFC,{align:"center",size:28});
    T(ctx,"sends",X0+160+gw/2,Y0+204,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)});T(ctx,"reads",X0+1760-bw/2,Y0+204,{w:600,size:28,align:"center",color:rgba(SOFT,0.95)});
    d4_contract(ctx,X0+260,Y0+250,1400,{});
    d4_X(ctx,t,{rec:{star:1},list:{a:1,p:1},ret:i=>({lock:1,when:1,extra:i===0?["complaints team too",1]:null,whenA:i===0?0:1})});}
  const tAc=w("drawn","across the wall"),tMd=w("drawn","in meter data"),tCo=w("drawn","its copy"),tSh=w("names","shape"),tCt=w("names","contract"),tOw=w("names","an owner");
  d4_map(ctx,t,{band:fin(t,tDr-0.3,0.8),bo:fin(t,tDr+0.2,0.6),own:fin(t,tOw-0.2,0.6),dos:fin(t,tMd-0.4,0.6),mark:fin(t,tCo-0.1,0.5),real:clamp((t-tMd-0.2)/0.9,0,1),
    flow:clamp((t-tAc+0.1)/1.1,0,1),shape:fin(t,tSh-0.2,0.6),contract:fin(t,tCt-0.2,0.6),ownHi:pulseAt(t,tOw+0.3,1.6),doHi:pulseAt(t,B+0.4,2.4),starHi:pulseAt(t,B+0.4,2.4),run:clamp((t-B-0.4)/1.8,0,1)});
  // every path across the wall goes on the map, or goes: five flows, each with its contract; six closed, the link among them;
  // and how each flow is built is the next series
  d4_ledger(ctx,{a:1-fin(t,tBu-0.5,0.5),head:fin(t,tEv-0.2,0.6),p:clamp((t-tFi+0.1)/2.4,0,1)});
  const s1="Data that moves",s2="how each flow is built: connectors, events, pipelines",cw=d4_cardW(ctx,s1,s2,36);
  d4_card(ctx,960-cw/2,D4_PY+690,0,s1,s2,fin(t,tBu-0.1,0.7),{col:DAC,hi:pulseAt(t,w("built","Data that moves"),1.4)});
  vign(ctx,S);});

/* ---------- 8. In time to act ---------- */
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tCh=c("chile"),tCr=c("crossed"),tUt=c("utility"),tMe=c("mendoza"),tMi=c("minute"),tBi=c("bill"),tMo=c("month"),tNi=c("nine"),tNx=c("next"),toU=fin(t,tUt-0.6,1.2);
  // Chile again, in lamp-light: the same lines, new messages both ways, in time for whoever could act
  if(toU<0.99){ctx.save();ctx.globalAlpha=1-toU;d4_night(ctx,S,t);setScreen(ctx,S);focus(ctx,t,[[0,960,540,1.0],[tCr-0.3,975,540,1.015]],1.7);
    const tLd=w("chile","didn't change"),tMt=w("crossed","many times"),tBw=w("crossed","both ways"),tIt=w("crossed","in time");
    daChile(ctx,D4_MX,D4_MY,D4_MH,{dots:1,lines:1,city:1,label:"left"});d4_pulses(ctx,t,{out:fin(t,tMt-0.6,0.8),back:fin(t,tBw-0.4,0.8),n:3,rate:0.3});
    d4_card(ctx,820,150,0,"the same lines",null,fin(t,tLd-0.6,0.7));
    D4_TRUCKS.forEach(([a,b,d],k)=>{const u=sstep(0,1,clamp((t-tIt-d)/4.5,0,1)),q=fin(t,tIt-0.3+d,0.5);if(q<=0.01)return;const[x0,y0]=d4_town(a),[x1,y1]=d4_town(b);d4_mini(ctx,lerp(x0,x1,u)+18,lerp(y0,y1,u),q,{rot:y1>y0?Math.PI/2:-Math.PI/2});});
    withA(ctx,fin(t,tMt-0.2,0.6),()=>tag(ctx,820,290,"new messages, many times a day, both ways",CY_LAMP,{size:28}));
    withA(ctx,fin(t,tIt-0.1,0.6),()=>tag(ctx,820,360,"in time to act",D4_MINT,{size:30}));
    setScreen(ctx,S);daYear(ctx,90,96,"Chile, October 1972",fin(t,0.3,0.8));
    ctx.restore();}
  // the utility: every fact across the wall crosses on purpose, drawn, with its shape and its contract; the Mendozas' nine days;
  // their December bill; that month's replacements; and the next question
  if(toU>0.01){ctx.save();ctx.globalAlpha=toU;wallBg(ctx,S,t);d4_cam(ctx,S,t,[[0,960,540,1.0],[tMe-0.7,D4_QX+960,540,1.0],[tMo-0.7,960,540,1.0]]);ctx.globalAlpha=toU*(1-0.6*fin(t,B+0.6,0.8));  // dimmed under the end card
    const tOp=w("utility","on purpose"),tSc=w("utility","shape and its contract"),tTw=w("mendoza","twenty-ninth"),tSd=w("mendoza","nine stored days"),tRp=w("minute","replaced"),tLt=w("minute","a minute later");
    const tCf=w("bill","charged"),tNc=w("bill","nobody had to call"),tTh=w("month","two thousand"),tAb=w("nine","All but nine"),tSm=w("nine","same day"),tWo=w("next","who owns");
    d4_room(ctx,{});
    // W: five flows, each drawn, with its shape and its contract; the other six are closed and gone
    d4_W(ctx,t,{path:k=>D4_FLOWS.includes(k)?{map:1,hi:pulseAt(t,tOp+0.2+D4_FLOWS.indexOf(k)*0.15,1.2)}:null,
      extra:[ctx=>{D4_FLOWS.forEach((k,j)=>{const[x,y]=d4_pathAt(k,k===3?0.62:0.38);withA(ctx,fin(t,tSc-0.3+j*0.15,0.5),()=>{ctx.fillStyle="rgba(8,12,22,0.95)";rr(ctx,x-14,y-11,28,22,4);ctx.fill();ctx.strokeStyle=rgba(INFC,1);ctx.lineWidth=2;rr(ctx,x-14,y-11,28,22,4);ctx.stroke();
          ctx.fillStyle=rgba(INFC,0.9);ctx.fillRect(x-8,y-5,16,2);ctx.fillRect(x-8,y,16,2);ctx.fillRect(x-8,y+5,10,2);});});
        // that month: the estimates replaced, nearly all within the hour, the rest the same day
        const sA=fin(t,tTh-0.4,0.7);if(sA>0.01)withA(ctx,sA,()=>{glass(ctx,520,650,880,214,18,INFC,{glow:14,ea:0.85,fill:"rgba(6,10,20,0.96)"});T(ctx,"November",548,690,{f:"mono",w:500,size:28,color:rgba(INFC,1)});
          T(ctx,"2,140 estimates replaced",548,736,{w:800,size:34,color:rgba(INK,0.97)});
          withA(ctx,fin(t,tAb-0.2,0.6),()=>{kt_gtick(ctx,566,780,13,1);T(ctx,"within the hour: all but nine",592,790,{w:700,size:28,color:rgba(mix(TRUST,INK,0.35),1)});});
          withA(ctx,fin(t,tSm-0.3,0.6),()=>{kt_gtick(ctx,566,824,13,1);T(ctx,"those nine: sent the same day",592,834,{w:700,size:28,color:rgba(mix(TRUST,INK,0.35),1)});});});}],
      tags:[["every path: drawn, with its shape and its contract",960,760,INFC,fin(t,tSc-0.2,0.6)*(1-fin(t,tTh-0.8,0.5))],["who owns which data?",960,150,TRUST,fin(t,tWo-0.2,0.6)]],ines:1,T:sc.start+t});
    // Q: on the 29th, the meter sent its nine stored days; replaced at 10:14, billing had it at 10:15; the December bill
    const tl=fin(t,tRp-0.3,0.6)*(1-fin(t,tBi-0.6,0.5));
    d4_Q(ctx,t,{cal:[["November",1]],house:{a:1,lit:1,meter:1},mast:{a:1,broken:0},waves:fin(t,tSd-0.6,0.5)*(1-fin(t,tSd+3.0,0.6)),
      chart:{a:1,rep:1,star:1,starHi:pulseAt(t,tRp+0.2,1.4)},
      tags:[["29 November",D4_CHART[0]+320,D4_CHART[1]-34,TECH,fin(t,tTw-0.2,0.6)]],
      extra:[ctx=>{if(tl>0.01)withA(ctx,tl,()=>{tag(ctx,D4_CHART[0]+40,D4_CHART[1]+470,"10:14 replaced, in meter data",TECH,{size:28});
          withA(ctx,fin(t,tLt-0.4,0.5),()=>{arrowTo(ctx,D4_CHART[0]+60,D4_CHART[1]+500,D4_CHART[0]+60,D4_CHART[1]+548,INFC,0.9,{lw:2.6,head:11});tag(ctx,D4_CHART[0]+40,D4_CHART[1]+580,"10:15 billing has it",APPC,{size:28});});});
        d4_bill(ctx,D4_CHART[0]+70,D4_CHART[1]+450,fin(t,tBi-0.2,0.7),{tick:fin(t,tCf+0.2,0.5),est:fin(t,tCf+0.6,0.5)});
        const s="nobody had to call",vw=d4_verdictW(ctx,s);d4_verdict(ctx,D4_CHART[0]+320-vw/2,D4_CHART[1]+760,s,true,fin(t,tNc-0.2,0.6),{hi:pulseAt(t,tNc+0.2,1.4)});}]});
    ctx.restore();}
  vign(ctx,S);
  daEnd(ctx,S,t,B+0.8,"How it travels","Let every fact cross on purpose: drawn, with its shape and its contract.","Film 4 of 6");});
