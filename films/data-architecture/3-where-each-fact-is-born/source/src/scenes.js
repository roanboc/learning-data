/* ===== Where each fact is born: scenes =====
   Eight chapters, as in ../script.md. Chile in 1972, in lamp-light: the telex lines being extended to every factory the state ran,
   the free telex that won some managers over, the software that could only warn about a factory from its own number that day, the
   figures from anywhere else that mislead it, the mill short of cotton left waiting; each number sent from where it was made, the
   reminders, the number born at its factory and read in Santiago as a copy, the same day. Then the utility's wall, one room: a new
   home at 14 Quarry Lane (Q), created twice, by billing and by the network map, copied twice, and the cut nobody could match; the
   one system where a fact is born and the matrix of what each system creates or copies (M, to Q's right), where each fact is given
   a home and an owner; back at Q, the line back from every copy, and a correction made once, at home; the three records of one cut,
   which are three facts (T, under Q); the customer who has to be born in two places, and the data practice on the map (P, under M);
   and back to Chile, and to Quarry Lane in October. The camera glides from place to place; whatever it passes is drawn as it was
   left there. Chile is lamp-light: one long table of pictures the camera glides along, dissolving into the wall and back because
   the whole picture changes. Made to read on a phone (tools/legible.py): text is at least 28 px in the frame. Sound: every effect
   in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// the camera on the wall: keys are [time, x, y, zoom]; every move eases over 1.7 s
function d3_cam(ctx,S,t,keys){setScreen(ctx,S);return focus(ctx,t,keys,1.7);}
// where Inés stands, her feet on the bottom edge of the place: at Q in chapter 1, at M in chapters 3 and 4
const D3_INQ=[1760,1010],D3_INM=[D3_X2+1770,1010];

/* ---------- the Quarry Lane wall at the ends of its chapters ---------- */
// June, as chapter 2 leaves it: the power out, one home recorded twice, both records copied, the cut nobody matched
function d3_Qjune(){return{cal:[["June",1]],house:{a:1,lit:0,plate:1},
  bl:{star:1,f:["P-88213","14 Quarry Lane","account 4471-209"]},nm:{star:1,f:["CP-0061420","Lot 14, Quarry Lane"]},
  cs:{copy:1,f:["P-88213","14 Quarry Lane",["no cut found",1,BAD]]},ou:{copy:1,f:["CP-0061420","Lot 14, Quarry Lane",["cut at 19:40",1,CY_SIG],["account: none",1,BAD]]},
  dial:{a:1,tag:"customers counted here: 0"},tags:[["call an electrician",D3_CS[0],D3_CS[1]+d3_recH(3)+42,BAD,1,"left"]]};}
// after the fix, as chapter 5 leaves it: the network map the connection point's only home, every other record a copy with its line
// back, the address corrected once, at home; o.addr(k): the address card k shows (0 billing, 1 network map, 2 customer service,
// 3 outage system); o.la: the lines' labels; o.run(k): a light along line k (0 customer service, 1 outage system, 2 billing)
function d3_Qafter(o){o=o||{};const ad=o.addr||(()=>"14 Quarry Lane"),la=o.la==null?1:o.la,run=o.run||(()=>0);return{cal:o.cal||[["July",1]],house:{a:1,lit:o.lit==null?1:o.lit,plate:1},
  bl:{copy:1,f:["CP-0061420",ad(0),"account 4471-209"],hi:o.blHi||0},nm:{star:1,f:["CP-0061420",ad(1)],hi:o.nmHi||0,starHi:o.starHi||0},
  cs:{copy:1,f:["CP-0061420",ad(2)].concat(o.csMore||[]),rows:o.csRows,hi:o.csHi||0},ou:{copy:1,f:["CP-0061420",ad(3)],hi:o.ouHi||0},
  back:{cs:[1,run(0),la],ou:[1,run(1),la],bl:[1,run(2),la]},dial:Object.assign({a:1},o.dial||{}),tags:o.tags||[]};}

/* ---------- 1. From the factory itself ---------- */
scene("sender",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tU=c("utility"),toU=fin(t,tU-0.6,1.2);
  // Chile, in lamp-light
  if(toU<0.99){ctx.save();ctx.globalAlpha=1-toU;d3_night(ctx,S,t);setScreen(ctx,S);
    const tFr=c("free"),tOw=c("own"),tEl=c("else"),tHa=c("harm"),tNe=c("needed"),tSe=c("sent"),tRe=c("remind"),tBo=c("born"),tCo=c("copy"),tSi=c("six");
    focus(ctx,t,[[0,960,540,1.0],[1.6,940,520,1.03],[tFr-0.4,1080,520,1.03],[tOw-0.6,D3_B+960,520,1.0],[tHa-0.2,D3_B+960,560,1.02],[tNe-0.6,D3_C+960,520,1.0],
      [tRe-0.3,D3_C+1000,540,1.02],[tBo-0.6,D3_D+960,520,1.0],[tSi-0.3,D3_D+1000,540,1.02]],1.7);
    // A: the network, the telex lines still being extended along the country; the project's name; the free telex
    const tFa=w("year","every factory"),tEx=w("year","being extended"),tLo=w("year","four thousand"),tCy=w("year","Cybersyn");
    daChile(ctx,560,60,960,{dots:fin(t,tFa-0.3,1.6),lines:0.82*clamp((t-tEx+0.2)/6.0,0,1),pulse:i=>t>tFr?((t-tFr)*0.3+hash(i,5))%1:0,city:fin(t,0.8,1.0),label:"left"});
    const mA=fin(t,tLo-0.3,0.8);if(mA>0.01)withA(ctx,mA,()=>{const p=clamp((t-tLo+0.3)/1.4,0,1);ctx.save();ctx.strokeStyle=rgba(CY_LAMP,0.75);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(470,66);ctx.lineTo(470,lerp(66,1016,ease(p)));ctx.stroke();
      [66,lerp(66,1016,ease(p))].forEach(y=>{ctx.beginPath();ctx.moveTo(456,y);ctx.lineTo(484,y);ctx.stroke();});ctx.restore();
      withA(ctx,fin(t,tLo+0.6,0.6),()=>{const s="more than 4,000 km",tw_=tw(ctx,s,30,700)+26;tag(ctx,450-tw_,760,s,CY_LAMP,{size:30});});});
    d3_card(ctx,820,170,0,"Cybersyn","a telex network for the state's factories",fin(t,tCy-0.2,0.7),{size:40});
    const pp=0.3+0.6*clamp((t-tFr+0.2)/3.0,0,1);daTelex(ctx,1500,990,1.0,{paper:pp,typing:t>tFr&&t<tFr+3.0?1:null,t,a:fin(t,tFr-0.5,0.8)});
    withA(ctx,fin(t,w("free","free telex")-0.4,0.6),()=>tag(ctx,1500,990-(342+pp*230)-52,"a free telex",CY_LAMP,{align:"center",size:30}));
    daSil(ctx,1790,1000,330,{a:fin(t,w("free","managers")-0.2,0.9),dir:-1});
    // B: the software needs the mill's own number from that day: with it, a warning; with a figure from anywhere else, a bad day looks
    // normal, and the mill, short of cotton, waits
    ctx.save();ctx.translate(D3_B,0);const tOn=w("own","own numbers"),tLa=w("else","last month"),tGu=w("else","a guess"),tLn=w("harm","look normal"),tSh=w("harm","short of cotton"),tWa=w("harm","wait");
    d3_card(ctx,120,60,0,"Cyberstride","the project's software",fin(t,tOw-0.2,0.7));
    const CX=120,CY=210,CW=1000,CH=400;d3_ind(ctx,CX,CY,CW,CH,D3_DAYS,{n:D3_N,p:clamp((t-tOw-0.2)/2.2,0,1),band:fin(t,tOw+1.4,0.8),title:"cotton in stock, at one mill",a:fin(t,tOw-0.4,0.7)});
    const[sx]=d3_indXY(CX,CY,CW,CH,D3_N,13,0),slotA=fin(t,w("own","from that day")-0.4,0.6);
    withA(ctx,slotA,()=>tag(ctx,sx,CY-36,"today, from this mill",CY_LAMP,{align:"center",size:28}));
    // today's dot: from the mill's own number, under its normal and lit; then from a figure from anywhere else, inside it, grey
    const own=fin(t,tOn+0.4,0.5)*(1-fin(t,tLa+0.3,0.5)),wrong=fin(t,tLa+0.8,0.5);
    if(slotA>0.01&&own<0.01&&wrong<0.01){const[,yy]=d3_indXY(CX,CY,CW,CH,D3_N,13,0.51);withA(ctx,slotA,()=>ring(ctx,sx,yy,14,CY_LAMP,0.8,2,[4,4]));}
    if(own>0.01){const[,yy]=d3_indXY(CX,CY,CW,CH,D3_N,13,D3_TODAY);withA(ctx,own,()=>{glow(ctx,sx,yy,26,CY_SIG,0.55);ctx.fillStyle=rgba(CY_SIG,1);ctx.beginPath();ctx.arc(sx,yy,8,0,TAU);ctx.fill();
      const s="a warning",ww=tw(ctx,s,28,700)+26;tag(ctx,sx-26-ww,yy,s,CY_SIG,{size:28});});}
    if(wrong>0.01){const[,yy]=d3_indXY(CX,CY,CW,CH,D3_N,13,D3_WRONG);withA(ctx,wrong,()=>{ctx.fillStyle=rgba(INK,0.85);ctx.beginPath();ctx.arc(sx,yy,6,0,TAU);ctx.fill();});
      withA(ctx,fin(t,tLn-0.3,0.6),()=>tag(ctx,sx-40,yy+52,"looks normal",SOFT,{align:"center",size:28}));}
    // the strips: the mill's own, that day; last month's; an office's guess, each crossed out as it would mislead
    d3_strip(ctx,1180,230,620,"COTTON IN STOCK   2 DAYS",fin(t,tOn-0.3,0.6)*(1-fin(t,tLa-0.1,0.5)),{size:32,h:90,sig:fin(t,tOn+0.4,0.4)});
    [["LAST MONTH'S   9 DAYS",tLa],["OFFICE GUESS   8 DAYS",tGu]].forEach(([s,t0],i)=>{const q=fin(t,t0-0.3,0.6);if(q<=0.01)return;d3_strip(ctx,1180,230+i*130,620,s,q,{size:32,h:90,rot:i?0.01:-0.006});
      kt_rcross(ctx,1838,275+i*130,18,fin(t,t0+0.5,0.4));});
    daFactory(ctx,260,870,0.55,{lit:0.5,t,a:fin(t,tSh-0.5,0.8)});withA(ctx,fin(t,tSh-0.2,0.6),()=>tag(ctx,430,830,"short of cotton",BAD,{size:28}));
    d3_clock(ctx,900,800,46,clamp((t-tWa)/4.0,0,1),fin(t,tWa-0.3,0.6));withA(ctx,fin(t,w("harm","never came")-0.2,0.6),()=>tag(ctx,966,800,"no help came",SOFT,{size:28}));
    ctx.restore();
    // C: the number has to come from where it's made: the mill sends its own, by telex, once a day; the reminders
    ctx.save();ctx.translate(D3_C,0);const tWh=w("needed","where it was made"),tTx=w("sent","by telex"),tOd=w("sent","once a day");
    daFactory(ctx,480,800,0.9,{lit:0.9,t,a:fin(t,tNe-0.4,0.8),name:"the mill"});
    withA(ctx,fin(t,tWh-0.2,0.6),()=>{ring(ctx,480,680,250,TRUST,0.85*fin(t,tWh-0.2,0.6),3);tag(ctx,480,380,"where it's made",TRUST,{align:"center",size:30});});
    const pq=0.25+0.6*clamp((t-tTx+0.3)/2.4,0,1);daTelex(ctx,960,840,0.8,{paper:pq,typing:t>tTx-0.2&&t<tTx+2.2?1:null,t,a:fin(t,tSe-0.2,0.7)});
    d3_card(ctx,1320,80,0,"Santiago","the people in charge",fin(t,tTx-0.4,0.6));
    const fl=sstep(0,1,clamp((t-tOd+0.6)/1.4,0,1));if(t>tTx+0.4){const x=lerp(700,1200,fl),y=lerp(460,250,fl);d3_strip(ctx,x,y,600,"COTTON IN STOCK   2 DAYS",fin(t,tTx+0.4,0.5),{size:30,h:84,rot:lerp(0.02,-0.01,fl)});}
    withA(ctx,fin(t,tOd+0.6,0.6),()=>tag(ctx,1500,390,"once a day",CY_LAMP,{align:"center",size:30}));
    const tKe=w("remind","keep reminding");D3_REMIND.forEach((s,i)=>{const t0=tKe-0.3+i*0.55;if(t>t0)arrive(ctx,1500,520+i*110,t,t0,()=>d3_strip(ctx,1150,480+i*110,700,s,1,{size:30,h:80,rot:[-0.012,0.008,-0.004][i]}),{d:0.8,dy:-24});});
    ctx.restore();
    // D: born at the mill, read in Santiago as a copy, the same day; the statistics before, six months late
    ctx.save();ctx.translate(D3_D,0);const tBh=w("born","one place where it was born"),tMa=w("born","the factory that made"),tSd=w("copy","the same day");
    daFactory(ctx,420,800,0.9,{lit:0.9,t,a:fin(t,tBo-0.4,0.8),name:"the mill"});
    d3_strip(ctx,120,200,620,"COTTON IN STOCK   2 DAYS",fin(t,tBo-0.2,0.6),{size:32,h:90,star:fin(t,tBh-0.1,0.5),starHi:pulseAt(t,tMa,1.4)});
    d3_star(ctx,420,566,32,fin(t,tBh-0.1,0.5),{hi:pulseAt(t,tMa,1.4),pop:spring(clamp((t-tBh+0.1)/0.8,0,1.6))});withA(ctx,fin(t,tBh+0.2,0.6),()=>tag(ctx,420,504,"born here",TRUST,{align:"center",size:30}));
    d3_card(ctx,1320,80,0,"Santiago","the people in charge",fin(t,tCo-0.5,0.6));
    const cA=fin(t,tCo+0.2,0.7);d3_strip(ctx,1120,300,620,"COTTON IN STOCK   2 DAYS",cA,{size:32,h:90,copy:1,rot:0.008});
    withA(ctx,cA,()=>tag(ctx,1430,436,"a copy",SOFT,{align:"center",size:28}));
    d3_back(ctx,1112,345,750,250,clamp((t-tCo-0.6)/0.9,0,1),{bend:0.08});withA(ctx,fin(t,tSd-0.2,0.6),()=>tag(ctx,930,330,"the same day",CY_LAMP,{align:"center",size:28}));
    d3_card(ctx,1120,600,0,"the statistics before","six months late",fin(t,tSi-0.2,0.7),{size:34});
    ctx.restore();
    // the year and the place, in the frame's corner while the camera is on the map
    setScreen(ctx,S);daYear(ctx,90,96,"Chile, 1972",fin(t,0.3,0.8)*(1-fin(t,tFr-0.6,0.6)));
    ctx.restore();}
  // the utility: Inés finds a fact born in two places: a new home, its premise in billing and its service point in the network map
  if(toU>0.01){ctx.save();ctx.globalAlpha=toU;wallBg(ctx,S,t);d3_cam(ctx,S,t,[[0,960,540,1.0],[tU+0.8,950,530,1.015]]);ctx.globalAlpha=toU*(1-0.6*fin(t,B+0.8,0.8));  // dimmed under the title
    const tBi=w("both","billing creates"),tNm=w("both","network map creates"),tTw=c("twice");
    d3_Q(ctx,t,{house:{a:fin(t,tU+0.3,0.8),lit:1},toBl:clamp((t-tBi-0.1)/0.8,0,1),toNm:clamp((t-tNm-0.1)/0.8,0,1),toY:60,
      bl:{a:fin(t,tBi-0.2,0.6),star:fin(t,tBi+0.3,0.4),pop:spring(clamp((t-tBi-0.3)/0.8,0,1.6))},nm:{a:fin(t,tNm-0.2,0.6),star:fin(t,tNm+0.3,0.4),pop:spring(clamp((t-tNm-0.3)/0.8,0,1.6))},
      twice:{a:fin(t,tTw-0.1,0.7),hi:pulseAt(t,w("twice","created twice"),1.4)}});
    daPerson(ctx,"ines",D3_INQ[0],D3_INQ[1],0.95,{t:sc.start+t,dir:-1,a:fin(t,tU+0.2,0.8)});
    ctx.restore();}
  vign(ctx,S);
  daTitle(ctx,S,t,B+1.0,"Where each fact is born","one home, one owner","Film 3 of 6 · data architecture");});

/* ---------- 2. Born twice ---------- */
scene("twice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tH=c("home"),tMa=c("march"),tAp=c("april"),tCp=c("copies"),tJu=c("june"),tSa=c("saw"),tCa=c("call"),tCo=c("count");
  wallBg(ctx,S,t);d3_cam(ctx,S,t,[[0,960,540,1.0],[tMa+0.4,940,530,1.015],[tAp+0.4,980,530,1.015],[tCp-0.2,960,540,1.0],[tSa-0.2,975,545,1.015],[tCo-0.3,960,548,1.015]]);
  const tSu=w("march","signed up"),tNo=w("march","no network ID"),tBc=w("march","billing created"),tFo=w("march","address on their form"),tNc=w("april","network map created"),tBu=w("april","builder");
  const tCS=w("copies","Customer service copied"),tOU=w("copies","outage system copied"),tOut=w("june","power went out"),tSc=w("saw","saw the cut"),tNa=w("saw","no account");
  const tFn=w("call","found no cut"),tEl=w("call","electrician"),tNc2=w("count","no customer");
  const months=d3_months(t,["March","April","June"],[tMa,tAp,tJu]),calA=fin(t,tMa-0.2,0.6);
  const csRows=2+sstep(0,1,clamp((t-tFn+0.4)/0.5,0,1)),ouRows=2+sstep(0,1,clamp((t-tSc+0.4)/0.5,0,1))+sstep(0,1,clamp((t-tNa+0.4)/0.5,0,1));
  const formA=fin(t,tSu-0.4,0.6)*(1-fin(t,tAp+0.6,0.6));
  d3_Q(ctx,t,{cal:months,calA,house:{a:fin(t,tH-0.3,0.8),lit:1-fin(t,tOut,0.8),plate:fin(t,w("home","fourteen")-0.2,0.6)},
    form:{a:formA,p1:clamp((t-tSu)/0.8,0,1),p2:clamp((t-tSu-0.7)/1.0,0,1),hi:pulseAt(t,tFo,1.4)},
    bl:{a:fin(t,tBc-0.2,0.6),star:fin(t,w("march","of its own")-0.1,0.4),pop:spring(clamp((t-w("march","of its own")+0.1)/0.8,0,1.6)),f:["P-88213",["14 Quarry Lane",fin(t,tFo+0.3,0.5)],"account 4471-209"],rows:3},
    nm:{a:fin(t,tNc-0.2,0.6),star:fin(t,tNc+0.4,0.4),pop:spring(clamp((t-tNc-0.4)/0.8,0,1.6)),f:["CP-0061420",["Lot 14, Quarry Lane",fin(t,w("april","Lot fourteen")-0.2,0.5)]],hi:pulseAt(t,tBu,1.3)},
    cs:{a:fin(t,tCS+0.7,0.5),copy:1,rows:csRows,f:["P-88213","14 Quarry Lane",["no cut found",fin(t,tFn,0.5),BAD]]},
    ou:{a:fin(t,tOU+0.7,0.5),copy:1,rows:ouRows,hi:pulseAt(t,tSc+0.2,1.4),f:["CP-0061420","Lot 14, Quarry Lane",["cut at 19:40",fin(t,tSc,0.5),CY_SIG],["account: none",fin(t,tNa,0.5),BAD]]},
    gh:[[D3_BL,D3_CS,clamp((t-tCS+0.1)/0.9,0,1),d3_recH(3)],[D3_NM,D3_OU,clamp((t-tOU+0.1)/0.9,0,1)]],
    call:fin(t,tCa-0.1,0.6)*(1-fin(t,tCo-0.5,0.4)),
    dial:{a:fin(t,tCo-0.1,0.7),hi:pulseAt(t,tNc2,1.4),tag:"customers counted here: 0",tagA:fin(t,tNc2-0.2,0.6)},
    tags:[["network ID: none yet",960,650,BAD,fin(t,tNo-0.2,0.6)*(1-fin(t,tAp,0.5))],["the builder's name for the plot",1600,362,SOFT,fin(t,tBu-0.2,0.6)*(1-fin(t,tCp,0.5))],
      ["call an electrician",D3_CS[0],D3_CS[1]+d3_recH(3)+42,BAD,fin(t,tEl-0.3,0.6),"left"]]});
  // the form's address, written into billing's premise
  const fa=formA*clamp((t-tFo-0.1)/0.7,0,1);if(fa>0.01)arrowTo(ctx,300,D3_CS[1]-6,300,D3_BL[1]+d3_recH(3)+8,CY_SIG,0.9*formA,{p:fa,lw:2.6});
  vign(ctx,S);});

/* ---------- 3. Where it's born ---------- */
// what Inés's matrix shows as chapter 3 leaves it: a home where a row has one "creates", born twice where it has two
const D3_ONE=[1,3],D3_TWO=[0,2];
function d3_M3(o){o=o||{};return{row:()=>1,cells:()=>1,verdict:i=>D3_ONE.includes(i)?[["one home",true,1]]:[["born twice",false,1]],box:i=>D3_TWO.includes(i)?[BAD,1]:[TRUST,0.5]};}
// the account, born in billing: created there and corrected there; and its copies
function d3_acct(ctx,t,o){const X=D3_X2;d3_rec(ctx,X+200,170,"billing","account",{a:o.a,star:o.star,pop:o.pop,starHi:o.starHi||0,hi:o.hi||0,f:["4471-209",d3_swap("A Mendosa","A. Mendoza",o.fix||0,INK,TRUST)]});
  ["customer service","outage system"].forEach((s,k)=>{const q=o.copies?o.copies(k):0;if(q<=0.01)return;const y=170+k*250;
    d3_rec(ctx,X+1140,y,s,"account",{a:q,copy:1,f:["4471-209","A. Mendoza"]});d3_back(ctx,X+1134,y+100,X+726,250+k*70,clamp(q*1.6-0.6,0,1),{bend:k?-0.06:0});});}
scene("born",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),X=D3_X2;
  const tPl=c("place"),tDa=c("dama"),tMx=c("matrix"),tOn=c("one"),tTw=c("two");
  wallBg(ctx,S,t);d3_cam(ctx,S,t,[[0,960,548,1.015],[0.8,X+960,540,1.0],[tMx-0.2,X+930,520,1.02],[tTw-0.2,X+960,540,1.0]]);
  // Quarry Lane, left as it was, while the camera moves on
  if(t<2.8)d3_Q(ctx,t,d3_Qjune());
  // a fact's place: the one system where it's created, and corrected; DAMA's name for it; every other system holds a copy
  const tBn=w("place","born"),tCr=w("place","created"),tCo=w("place","corrected"),tOt=w("dama","Every other");
  const fA=1-fin(t,tMx-0.3,0.6);
  if(fA>0.01)withA(ctx,fA,()=>{d3_acct(ctx,t,{a:fin(t,tPl+0.9,0.7),star:fin(t,tBn-0.1,0.4),pop:spring(clamp((t-tBn+0.1)/0.8,0,1.6)),starHi:pulseAt(t,tCr,1.2),fix:clamp((t-tCo-0.1)/0.8,0,1),
      copies:k=>fin(t,tOt+0.6+k*0.5,0.7)});
    const tg=1-fin(t,tOt-0.4,0.5);withA(ctx,tg*fin(t,tCr-0.2,0.5),()=>tag(ctx,X+760,240,"created here",TRUST,{size:28}));withA(ctx,tg*fin(t,tCo-0.2,0.5),()=>tag(ctx,X+760,310,"corrected here",TRUST,{size:28}));
    d3_def(ctx,X+200,660,1460,"system of record · DAMA-DMBOK","The one system where a fact is created, and corrected.",clamp((t-w("dama","system of record")+0.3)/1.6,0,1),fin(t,tDa-0.2,0.6));});
  // the matrix: what each system does with each thing, drawn as she says it; one "creates" is a home, two is born twice
  const tHd=w("matrix","each system"),tTh=w("matrix","each thing"),tCe=w("matrix","creates it"),tCP=w("two","the connection point"),tCu=w("two","the customer");
  d3_matrix(ctx,{a:1,grid:fin(t,tHd-0.4,0.8),head:j=>fin(t,tHd-0.2+j*0.18,0.5),row:i=>fin(t,tTh-0.2+i*0.18,0.5),cells:(i,j)=>fin(t,tCe-0.2+(i*4+j)*0.12,0.3),
    verdict:i=>D3_ONE.includes(i)?[["one home",true,fin(t,tOn+0.3+D3_ONE.indexOf(i)*0.3,0.5)]]:[["born twice",false,fin(t,w("two","born twice")-0.1+D3_TWO.indexOf(i)*0.3,0.5)]],
    box:i=>D3_TWO.includes(i)?[BAD,fin(t,w("two","born twice")-0.1+D3_TWO.indexOf(i)*0.3,0.6)]:[TRUST,0.5*fin(t,tOn+0.3+D3_ONE.indexOf(i)*0.3,0.6)],
    cellO:(i,j)=>({hi:(i===0&&j<2?pulseAt(t,tCP+0.2,1.4):0)+(i===2&&(j===1||j===2)?pulseAt(t,tCu+0.2,1.4):0)})});
  daPerson(ctx,"ines",D3_INM[0],D3_INM[1],0.95,{t:sc.start+t,dir:-1,a:fin(t,tMx-0.2,0.8)});
  vign(ctx,S);});

/* ---------- 4. One home, one owner ---------- */
// billing asks the network team for the connection point, the network map creates it with its ID, billing copies it, the same day
function d3_ask(ctx,o){const X=D3_X2,y=770,A="billing asks the network team",B="network map creates CP-0061420",C="billing copies it, ID and all";
  const wa=tw(ctx,A,28,700)+26,wb=tw(ctx,B,28,700)+26,wc=tw(ctx,C,28,700)+26,gap=(1540-wa-wb-wc)/2;let x=X+80;
  withA(ctx,o.a1||0,()=>tag(ctx,x,y,A,APPC,{size:28}));const xa=x+wa;x+=wa+gap;if(o.p1>0.01)arrowTo(ctx,xa+10,y,x-10,y,INK,0.9,{p:o.p1,lw:2.6});
  withA(ctx,o.a2||0,()=>tag(ctx,x,y,B,TRUST,{size:28}));const xb=x+wb;x+=wb+gap;if(o.p2>0.01)arrowTo(ctx,xb+10,y,x-10,y,INK,0.9,{p:o.p2,lw:2.6});
  withA(ctx,o.a3||0,()=>tag(ctx,x,y,C,APPC,{size:28}));withA(ctx,o.a4||0,()=>tag(ctx,x+wc/2,y+52,"the same day",SOFT,{align:"center",size:28}));}
// the matrix as chapter 4 changes it: the connection point's home, the network map, and its owner; billing's copy; the account's
// home, billing, and its owner. m: how far each change has gone (0..1): cp the home named, gr Grace's chip, bk billing's copy, ac the
// account's home, rt its owner's chip
const D3_RULE="One fact, one home, one owner. A copy can be read anywhere, but it's corrected only at home.";
function d3_M4(m,hi){hi=hi||{};const sw=(a,b,q)=>[[a,clamp(1-2*q,0,1)],[b,clamp(2*q-1,0,1)]];
  return{row:()=>1,cells:()=>1,
    kind:(i,j)=>i===0&&j===0?sw("c","h",m.cp):i===0&&j===1?sw("c","k",m.bk):i===1&&j===1?sw("c","h",m.ac):null,
    cellO:(i,j)=>i===0&&j===0?{own:["Grace",m.gr],ownHi:hi.gr||0,ring:hi.cp||0}:i===1&&j===1?{own:["head of retail",m.rt],ownHi:hi.rt||0,ring:hi.ac||0}:{},
    verdict:i=>i===0?[["born twice",false,1-m.bk],["one home",true,m.bk]]:D3_ONE.includes(i)?[["one home",true,1]]:[["born twice",false,1]],
    box:i=>i===0?[mix(BAD,TRUST,m.bk),lerp(1,0.5,m.bk)]:D3_TWO.includes(i)?[BAD,1]:[TRUST,0.5]};}
scene("home",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),X=D3_X2;
  const tNa=c("names"),tOn=c("only"),tAs=c("ask"),tAc=c("account"),tRu=c("rule");
  wallBg(ctx,S,t);d3_cam(ctx,S,t,[[0,X+960,540,1.0],[tNa-0.2,X+900,500,1.02],[tAs-0.3,X+960,560,1.0]]);
  const tNm=w("names","the network map"),tGr=w("names","Grace"),tAg=w("names","agrees"),tOnl=w("only","only the network map"),tId=w("only","with its ID"),tPl=w("only","planned");
  const tAsk=w("ask","It asks"),tCop=w("ask","copies it"),tSd=w("ask","the same day"),tBi=w("account","billing"),tHr=w("account","head of retail");
  const m={cp:clamp((t-tNm+0.1)/0.6,0,1),gr:fin(t,tGr-0.2,0.6),bk:clamp((t-w("only","creates")-0.2)/0.6,0,1),ac:clamp((t-tBi+0.1)/0.6,0,1),rt:fin(t,tHr-0.2,0.6)};
  d3_matrix(ctx,Object.assign(d3_M4(m,{gr:pulseAt(t,tAg,1.4),cp:0.8*pulseAt(t,tNm+0.3,1.6),rt:pulseAt(t,tHr+0.3,1.4),ac:0.8*pulseAt(t,tBi+0.3,1.6)}),{a:1,hiCol:j=>j===0?pulseAt(t,tOnl,1.4)+pulseAt(t,tAsk+1.0,1.2):j===1?pulseAt(t,tAsk,1.2):0}));
  withA(ctx,fin(t,tId-0.2,0.6)*(1-fin(t,tAs-0.6,0.5)),()=>tag(ctx,X+d3_cellX(0),66,"creates each one, with its ID, when it's planned",TRUST,{align:"center",size:28}));
  const flow=1-fin(t,tRu-0.5,0.5);if(flow>0.01)withA(ctx,flow,()=>d3_ask(ctx,{a1:fin(t,tAsk-0.2,0.5),p1:clamp((t-tAsk+0.1)/0.7,0,1),a2:fin(t,tAsk+0.5,0.5),p2:clamp((t-tCop+0.1)/0.7,0,1),a3:fin(t,tCop+0.3,0.5),a4:fin(t,tSd-0.2,0.5)}));
  ruleCard(ctx,X+80,712,1520,D3_RULE,{kicker:"the rule",col:DAC,size:30,a:fin(t,tRu-0.1,0.7),hi:pulseAt(t,w("rule","corrected only at home"),1.4)});
  daPerson(ctx,"ines",D3_INM[0],D3_INM[1],0.95,{t:sc.start+t,dir:-1});
  vign(ctx,S);});

/* ---------- 5. A line back ---------- */
// the matrix as chapter 4 leaves it, with the rule under it
function d3_Mend(ctx,t,sc){d3_matrix(ctx,Object.assign(d3_M4({cp:1,gr:1,bk:1,ac:1,rt:1}),{a:1}));ruleCard(ctx,D3_X2+80,712,1520,D3_RULE,{kicker:"the rule",col:DAC,size:30});
  daPerson(ctx,"ines",D3_INM[0],D3_INM[1],0.95,{t,dir:-1});}
scene("lineage",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tLi=c("line"),tCa=c("called"),tCo=c("council"),tMo=c("morning"),tMe=c("measure");
  wallBg(ctx,S,t);d3_cam(ctx,S,t,[[0,D3_X2+960,560,1.0],[0.8,960,540,1.0],[tCo-0.3,1000,520,1.015],[tMe-0.3,960,560,1.015]]);
  // the matrix, left as it was, while the camera moves back to Quarry Lane
  if(t<2.8)d3_Mend(ctx,sc.start+t,sc);
  // every copy's line back: which system it points to, which record, and when it was copied; then the address corrected once, at
  // home, and by the next morning the same in every copy; Grace's measure traced to the records it counts
  const tLb=w("line","line back"),tWs=w("line","which system"),tWr=w("line","which record"),tWh=w("line","when it was copied");
  const tAd=w("council","corrected the address"),tHo=w("council","at home"),tEi=w("measure","each interruption"),tEc=w("measure","each customer");
  // the correction runs from home along each line back, billing's first, then the outage system's, then customer service's, which
  // copies billing; each copy's address changes as it arrives. tR[k]: when the light leaves along line k (0 customer service's,
  // 1 the outage system's, 2 billing's); card k's address (0 billing, 1 the network map, 2 customer service, 3 the outage system)
  const tR=[tMo+1.1,tMo+0.5,tMo+0.1],at=k=>k===1?tAd+0.2:tR[[2,0,0,1][k]]+0.75;
  const sw=k=>d3_swap("Lot 14, Quarry Lane","14 Quarry Lane",clamp((t-at(k))/0.6,0,1),INK,k===1?TRUST:INK);
  const st=d3Qlines(t,{p:[clamp((t-tLb+0.1)/0.9,0,1),clamp((t-tLb+0.3)/0.9,0,1),clamp((t-tLb+0.5)/0.9,0,1)],la:fin(t,tWr-0.2,0.6),run:k=>clamp((t-tR[k])/0.8,0,1)});
  const Q=d3_Qafter({cal:[["July",1]],la:fin(t,tWr-0.2,0.6),nmHi:pulseAt(t,tWs,1.2)+pulseAt(t,tHo,1.4),starHi:pulseAt(t,tHo+0.1,1.4),
    dial:{hi:pulseAt(t,tMe+0.2,1.4),tr:[clamp((t-tEi+0.1)/0.9,0,1),clamp((t-tEc+0.1)/0.9,0,1)]},ouHi:pulseAt(t,tEi+0.7,1.2),blHi:pulseAt(t,tEc+0.7,1.2),
    tags:[["lineage",960,224,INFC,fin(t,tCa+0.1,0.6)]]});
  Q.back=st.back;Q.bl.f[1]=sw(0);Q.nm.f[1]=sw(1);Q.cs.f[1]=sw(2);Q.ou.f[1]=sw(3);
  d3_Q(ctx,t,Q);
  vign(ctx,S);});
// the lines back at Quarry Lane, drawn in turn: o.p[k] how far line k is drawn (0 customer service's, 1 the outage system's, 2 billing's)
function d3Qlines(t,o){return{back:{cs:[o.p[0],o.run(0),o.la],ou:[o.p[1],o.run(1),o.la],bl:[o.p[2],o.run(2),o.la]}};}

/* ---------- 6. Three records, three facts ---------- */
// the three records of one cut, each born in its own system, and Grace's measure counting the outage system's
function d3_three(ctx,t,o){o=o||{};const Y=D3_Y1;
  [[D3_T_ME,"meter data","power off",["meter M-2207114","19:40:12"],"what the meter saw",0],[D3_T_CS,"customer service","no-power call",["14 Quarry Lane","19:52"],"what a person told us",1],
    [D3_T_OU,"outage system","interruption",["CP-0061420","19:40 to 21:15"],"the cut, as Grace's team defines it",2]].forEach(([p,sy,nm,f,s,k])=>{const q=o.card?o.card(k):1;if(q<=0.01)return;
    d3_rec(ctx,p[0],Y+p[1],sy,nm,{a:q,f,star:o.star?o.star(k):1,pop:o.pop?o.pop(k):1,starHi:o.starHi?o.starHi(k):0,hi:o.hi?o.hi(k):0});
    withA(ctx,q*(o.tag?o.tag(k):1),()=>tag(ctx,p[0]+D3_CW/2,k===2?Y+p[1]-44:Y+p[1]+d3_recH(2)+40,s,k===2?BUSC:SOFT,{align:"center",size:28}));});
  // evidence: the meter's event and the call, read by the outage system
  const ev=o.ev||[1,1];[[D3_T_ME[0]+D3_CW-30,Y+D3_T_ME[1]-6,D3_T_OU[0]+70,Y+D3_T_OU[1]+d3_recH(2)+8,560,-0.1,"right"],[D3_T_CS[0]+30,Y+D3_T_CS[1]-6,D3_T_OU[0]+D3_CW-70,Y+D3_T_OU[1]+d3_recH(2)+8,1360,0.1,"left"]].forEach(([x0,y0,x1,y1,lx,bd,al],k)=>{
    if(ev[k]<=0.01)return;arrowTo(ctx,x0,y0,x1,y1,mix(SOFT,INK,0.3),0.9,{p:ev[k],lw:2.6,bend:bd});
    withA(ctx,fin(ev[k],0.6,0.4),()=>{const s="evidence",ww=tw(ctx,s,28,700)+26;tag(ctx,al==="right"?lx-ww:lx,Y+440,s,SOFT,{size:28});});});
  const di=o.dial==null?1:o.dial;if(di>0.01){d3_dial(ctx,D3_T_DI[0],Y+D3_T_DI[1],520,"interruptions per customer, per year","1.4",di,{h:150,hi:o.dialHi||0});
    arrowTo(ctx,D3_T_OU[0]+D3_CW+6,Y+D3_T_OU[1]+90,D3_T_DI[0]-8,Y+D3_T_DI[1]+75,BUSC,0.9*di,{p:o.dp==null?1:o.dp,lw:2.6});}}
scene("three",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),Y=D3_Y1;
  const tBa=c("back"),tMe=c("meter"),tCa=c("call"),tCu=c("cut"),tNo=c("not"),tEv=c("evidence");
  wallBg(ctx,S,t);d3_cam(ctx,S,t,[[0,960,560,1.015],[0.8,960,Y+540,1.0],[tNo-0.3,960,Y+560,1.015],[tEv-0.2,980,Y+540,1.0]]);
  // Quarry Lane, as it was left, while the camera moves down
  if(t<2.8)d3_Q(ctx,t,d3_Qafter());
  // one cut, recorded by more than one system: three places, then each record as it's named, born in its own system
  const tMo=w("back","more than one"),tK=[w("meter","power off"),w("call","family's call"),w("cut","interruption")],tB=[w("meter","born in meter data"),w("call","born in customer service"),w("cut","born in the outage system")];
  const tTc=w("not","three copies"),tTf=w("not","three facts"),tOw=w("not","its own home"),tRe=w("evidence","reads the other two"),tGm=w("evidence","Grace's measure");
  const slots=fin(t,tMo,0.6);if(slots>0.01)[D3_T_ME,D3_T_CS,D3_T_OU].forEach((p,k)=>{const q=slots*(1-fin(t,tK[k]-0.3,0.4));if(q<=0.01)return;withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.5);ctx.setLineDash([8,10]);ctx.lineWidth=2;rr(ctx,p[0],Y+p[1],D3_CW,d3_recH(2),16);ctx.stroke();ctx.restore();});});
  withA(ctx,fin(t,w("back","the cut")-0.2,0.6)*(1-fin(t,tMe-0.3,0.5)),()=>tag(ctx,960,Y+640,"one cut, on Quarry Lane",CY_SIG,{align:"center",size:30}));
  d3_three(ctx,t,{card:k=>fin(t,tK[k]-0.3,0.6),star:k=>fin(t,tB[k]-0.1,0.4),pop:k=>spring(clamp((t-tB[k]+0.1)/0.8,0,1.6)),starHi:k=>pulseAt(t,tOw+0.1*k,1.4),tag:k=>fin(t,[w("meter","what the meter saw"),w("call","what a person"),w("cut","as Grace's team")][k]-0.2,0.6),
    hi:k=>k===2?pulseAt(t,tRe+0.8,1.4):0,ev:[clamp((t-tRe+0.1)/0.9,0,1),clamp((t-tRe+0.4)/0.9,0,1)],dial:fin(t,tGm-0.3,0.7),dialHi:pulseAt(t,tGm+0.6,1.4),dp:clamp((t-tGm-0.1)/0.7,0,1)});
  // not three copies of one fact: three facts, each with its own home
  d3_verdict(ctx,960-(tw(ctx,"three copies of one fact?",28,700)+86)/2,Y+650,"three copies of one fact?",false,fin(t,tTc-0.2,0.5)*(1-fin(t,tTf-0.5,0.4)));
  d3_verdict(ctx,960-(tw(ctx,"three facts, three homes",28,700)+86)/2,Y+650,"three facts, three homes",true,fin(t,tTf-0.1,0.5),{hi:pulseAt(t,tOw,1.4)});
  vign(ctx,S);});

/* ---------- 7. Two places, one person ---------- */
scene("master",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),X=D3_X2,Y=D3_Y1,B=c("breath");
  const tSo=c("some"),tCu=c("customer"),tBo=c("both"),tSe=c("series"),tMa=c("map");
  wallBg(ctx,S,t);d3_cam(ctx,S,t,[[0,980,Y+540,1.0],[tSo+0.6,960,Y+520,1.0],[tMa-0.5,X+960,Y+540,1.0]]);
  // the three records leave, as a later moment comes to the same place
  const out=1-fin(t,w("some","only one place")+0.2,0.6);if(out>0.01)withA(ctx,out,()=>{d3_three(ctx,t,{});d3_verdict(ctx,960-(tw(ctx,"three facts, three homes",28,700)+86)/2,Y+650,"three facts, three homes",true,1);});
  // a customer, created in billing at sign-up, or in customer service by a call before anything is signed: both must create one
  const tBi=w("customer","in billing"),tCs=w("customer","in customer service"),tSp=w("both","same person"),tVw=w("both","which value wins");
  // first, the two places a customer can start: empty, each named, filled as the voice names it
  const sl=fin(t,w("some","only one place")+0.5,0.6);if(sl>0.01)[[120,"billing",tBi],[1280,"customer service",tCs]].forEach(([x,sy,t0])=>{const q=sl*(1-fin(t,t0-0.3,0.4));if(q<=0.01)return;
    withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.8);ctx.setLineDash([8,10]);ctx.lineWidth=2.4;rr(ctx,x,Y+300,D3_CW,d3_recH(2),16);ctx.stroke();ctx.restore();
      T(ctx,sy,x+26,Y+344,{f:"mono",w:500,size:28,color:rgba(mix(APPC,INK,0.3),0.9)});});});
  [[120,"billing",["A. Mendoza","signed up 3 March"],tBi],[1280,"customer service",["Ana Mendoza","called 20 February"],tCs]].forEach(([x,sy,f,t0],k)=>{const q=fin(t,t0-0.2,0.6);if(q<=0.01)return;
    d3_rec(ctx,x,Y+300,sy,"customer",{a:q,f:[[f[0],1,mix(INK,CY_SIG,pulseAt(t,tVw+0.2,1.6))],f[1]],star:fin(t,t0+0.3,0.4),pop:spring(clamp((t-t0-0.3)/0.8,0,1.6)),starHi:pulseAt(t,tBo+0.3,1.4)});});
  const lk=clamp((t-tSp+0.3)/0.9,0,1);if(lk>0.01){ctx.save();ctx.strokeStyle=rgba(CY_SIG,0.85);ctx.lineWidth=2.6;ctx.setLineDash([10,9]);ctx.beginPath();ctx.moveTo(646,Y+404);ctx.lineTo(lerp(646,1274,lk),Y+404);ctx.stroke();ctx.restore();}
  withA(ctx,fin(t,tSp,0.5),()=>tag(ctx,960,Y+404,"the same person?",CY_SIG,{align:"center",size:28}));
  withA(ctx,fin(t,tVw-0.1,0.5),()=>tag(ctx,960,Y+490,"which value wins?",CY_SIG,{align:"center",size:28}));
  d3_card(ctx,600,Y+600,720,"master data","the series \u201cThe same one, everywhere\u201d",fin(t,tSe-0.1,0.7),{col:DAC,size:36,hi:pulseAt(t,w("series","The same one"),1.4)});
  // on the map: each data object names its home, a star, or is a copy, with its line back
  const tDo=w("map","each data object"),tNh=w("map","names its home"),tLb=w("map","a line back");
  d3_map(ctx,{band:fin(t,tMa-0.3,0.8),bo:fin(t,tMa+0.2,0.6),own:fin(t,tMa+0.5,0.6),dos:k=>fin(t,tDo-0.2+k*0.2,0.5),mark:fin(t,tNh-0.2,0.5),starHi:pulseAt(t,tNh+0.1,1.4),
    real:clamp((t-tDo-0.6)/0.9,0,1),lines:k=>clamp((t-tLb+0.2-k*0.25)/0.9,0,1),lineTag:fin(t,tLb+0.6,0.6),run:k=>clamp((t-B-0.4-k*0.35)/1.4,0,1)});
  vign(ctx,S);});

/* ---------- 8. From where it was made ---------- */
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tCh=c("chile"),tRe=c("read"),tUt=c("utility"),tOc=c("october"),tSi=c("since"),tNx=c("next"),toU=fin(t,tUt-0.6,1.2);
  // Chile again, in lamp-light: each number born at its factory, sent once a day, read in Santiago as a copy with its line back
  if(toU<0.99){ctx.save();ctx.globalAlpha=1-toU;d3_night(ctx,S,t);setScreen(ctx,S);focus(ctx,t,[[0,960,540,1.0],[tRe-0.3,980,540,1.02]],1.7);
    const tBn=w("chile","born in its factory"),tSf=w("chile","sent from there"),tOd=w("chile","once a day"),tCo=w("read","read copies"),tKn=w("read","knew where");
    d3_card(ctx,1180,40,0,"Santiago","the people in charge",fin(t,tSf-0.6,0.6));
    D3_FACT.forEach(([nm,s],k)=>{const q=fin(t,tCh-0.2+k*0.3,0.7);if(q<=0.01)return;const fy=290+k*240,ty=200+k*124;
      daFactory(ctx,260,fy,0.42,{lit:0.9,t,a:q});withA(ctx,q,()=>T(ctx,nm,430,fy-20,{w:700,size:30,color:rgba(INK,0.95)}));
      d3_star(ctx,260,fy-118,18,q*fin(t,tBn-0.1+k*0.15,0.5),{pop:spring(clamp((t-tBn+0.1-k*0.15)/0.8,0,1.6))});
      // its strip: typed at the factory, then on Santiago's board as a copy, with its line back to the factory
      // (it moves out to the right first, then up, so it never crosses a factory's name)
      const mv=clamp((t-tSf+0.1-k*0.25)/1.5,0,1),mx=sstep(0,1,clamp(mv/0.65,0,1)),my=sstep(0,1,clamp((mv-0.35)/0.65,0,1)),sx=lerp(430,1180,mx),sy=lerp(fy+10,ty,my);
      d3_strip(ctx,sx,sy,600,s,q*fin(t,tBn-0.3+k*0.15,0.5),{size:28,h:80,copy:mv>=1?fin(t,tCo-0.2+k*0.15,0.5):0,rot:lerp(0.01,-0.006,mx)});
      if(mv>=1)d3_back(ctx,1174,ty+40,392,fy-110,clamp((t-tKn+0.2-k*0.3)/0.9,0,1),{bend:0.06});});
    withA(ctx,fin(t,tOd-0.2,0.6),()=>tag(ctx,1180+Math.max(tw(ctx,"Santiago",36,800),tw(ctx,"the people in charge",28,600))+60+28,102,"once a day",CY_LAMP,{size:30}));
    withA(ctx,fin(t,tKn+0.3,0.6),()=>tag(ctx,1480,610,"each copy knew where it came from",CY_LAMP,{align:"center",size:28}));
    ctx.restore();}
  // the utility in October: the power out again on Quarry Lane; the call finds the cut, the measure counts the family; no new home
  // created twice since July; and the next question: a replaced meter reading has to reach billing, so how does it travel? As in
  // chapter 2, the measure makes way for the call, and comes back to count the family
  if(toU>0.01){ctx.save();ctx.globalAlpha=toU;wallBg(ctx,S,t);d3_cam(ctx,S,t,[[0,960,540,1.0],[tOc+0.4,960,540,1.015],[tNx-0.2,960,520,1.015]]);ctx.globalAlpha=toU*(1-0.6*fin(t,B+0.6,0.8));  // dimmed under the end card
    const tPo=w("october","power went out"),tFc=w("october","found the cut"),tCt=w("october","counted them"),tRd=w("next","A meter reading"),tHt=w("next","How does it travel");
    const Q=d3_Qafter({cal:d3_months(t,["July","October"],[-9,tOc+0.1]),lit:1-fin(t,tPo,0.8),la:0,nmHi:pulseAt(t,w("utility","one home")+0.1,1.4),starHi:pulseAt(t,w("utility","one home")+0.1,1.4),
      run:k=>clamp((t-w("utility","a line back")-0.1-k*0.3)/0.9,0,1),csRows:2+sstep(0,1,clamp((t-tFc+0.4)/0.5,0,1)),csMore:[["cut found: 20:15",fin(t,tFc,0.5),TRUST]],csHi:pulseAt(t,tFc+0.3,1.4),
      dial:{a:1-fin(t,tPo+0.2,0.4)+fin(t,tCt-0.2,0.5),hi:pulseAt(t,tCt+0.3,1.4),tag:"customers counted here: 1",tagCol:TRUST,tagA:fin(t,tCt+0.1,0.6)},
      tags:[["since July: no new home created twice",960,224,TRUST,fin(t,tSi-0.1,0.6)*(1-fin(t,tRd-0.6,0.5))],["how does it travel?",960,224,INFC,fin(t,tHt-0.2,0.6)]]});
    Q.call=fin(t,tPo+0.4,0.6)*(1-fin(t,tCt-0.6,0.4));
    d3_Q(ctx,t,Q);
    // a replaced meter reading leaves the network side, on its way to billing
    const rp=sstep(0,1,clamp((t-tRd-0.2)/1.8,0,1)),ra=fin(t,tRd-0.2,0.5);if(ra>0.01){const x=lerp(1180,980,rp);withA(ctx,ra,()=>tag(ctx,x,276,"meter reading · replaced",TECH,{align:"center",size:28}));}
    ctx.restore();}
  vign(ctx,S);
  daEnd(ctx,S,t,B+0.8,"Where each fact is born","Give each fact one home and one owner, and every copy a line back to it.","Film 3 of 6");});
