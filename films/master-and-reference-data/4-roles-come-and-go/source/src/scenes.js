/* ===== Roles come and go: scenes =====
   Ten chapters, as in ../script.md: Cato's ladder of offices, each with its year, and the census his last office kept; census date at
   the university, and two questions about who someone is on that day; the statuses every system sends each night, true for a day; one
   shape for every role, and Linh's roles as dated bands under her; the tutor role as a contract each semester; one line at census date,
   and the same line a year back; what each role relates to, and the person who supervises her; an energy company's move-out; the role
   table, its tests and its question asked as at a date; and Linh today, her roles coming and going while she stays. Drawn in watercolour
   (shared/src/wash.js), made to read on a phone (tools/legible.py): text is at least 28 px in the frame. Chapters 4 to 7 share one
   picture, Linh's timeline (plan.js), which stays where it is from chapter to chapter, with no drift, and closes in on the months it
   needs, so the chapters cross without doubling it; chapter 3's board carries into chapter 4 the same way. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// the camera, as One person, many roles moves it (keys are [time, x, y, zoom], each move eased over d seconds), kept inside the place
function m4_focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  z=Math.max(1,z);x=clamp(x,960/z,W-960/z);y=clamp(y,540/z,H-540/z);ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return{x,y,z};}
// every scene's start and end: the place under the camera, and over it all, the paper
function m4_open(ctx,S,t,sc,place,keys,o){o=o||{};setScreen(ctx,S);ctx.save();const cam=m4_focus(ctx,t,keys,o.d||1.6);drift(ctx,t,sc,{z:o.z==null?0.018:o.z,x:o.dx||960,y:o.dy||560});
  if(place)m4_place(ctx,place);return cam;}
function m4_close(ctx,S){ctx.restore();setScreen(ctx,S);}

/* ---------- 1. A ladder of offices ---------- */
// Cato on the paving, at the left; "census", written under the list at the end, where the next chapter picks it up
const M4_CX=236,M4_CY=1004,M4_CW=[597,734];
// a line of the tablet lifting off as a terracotta band, and settling on its rung (u: 0 to 1)
function m4_lift(ctx,i,u){if(u<=0||u>=1)return;const [y0,d]=M4_OFF[i],q=ease(u),x0=M4_TB.x,yA=M4_TLY[i]-10,x1=m4_bc(y0)+d*31/2,y1=M4_STY[i];
  const x=lerp(x0,x1,q),y=lerp(yA,y1,q)-Math.sin(q*Math.PI)*110,w=lerp(tw(ctx,m4_offLine(i),30,700)+16,d*31,q),h=lerp(36,40,q);
  ctx.save();ctx.globalAlpha*=clamp(u*6,0,1)*(1-clamp((u-0.88)/0.12,0,1));rr(ctx,x-w/2,y-h/2,w,h,Math.min(8,h/2));ctx.fillStyle=rgba(M4_TERRA,0.82);ctx.fill();
  ctx.strokeStyle=rgba(wc_dim(M4_TERRA,0.45),0.7);ctx.lineWidth=1.6;ctx.stroke();ctx.restore();}
scene("rome",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tCit=w("ladder","ambitious"),tMar=c("cato"),tOff=[w("cato","quaestor"),w("cato","aedile"),w("cato","praetor"),w("cato","in 195")],
    tEach=c("roles"),tYear=w("roles","its year"),tOne=w("roles","one man"),tSeq=w("roles","sequence"),tStart=w("roles","a start"),tEnd=w("roles","an end"),
    tCen=w("census","censor."),tWrote=w("census","wrote"),tEvery=w("census","every"),tAge=w("census","age"),tOwn=w("census","owned"),tCensus=w("census","the census");
  // the camera: the Forum; in on the tablet as his offices are cut; back out for the ladder and the census
  m4_open(ctx,S,t,sc,"forum",[[0,960,540,1],[tMar-0.8,800,590,1.28],[tEach-0.5,960,540,1]],{z:0.02});
  // Cato, an ambitious citizen, in his toga
  arrive(ctx,M4_CX,M4_CY-320,t,tCit-0.5,()=>m4_togate(ctx,"cato",M4_CX,M4_CY,1.04,{t}),{d:0.9,from:0.97});
  // the stone tablet: his name, then each office as it's named; it gives way to the census list
  const tabA=1-fin(t,tWrote-0.6,0.8);
  if(tabA>0.01)withA(ctx,tabA,()=>arrive(ctx,M4_TB.x,M4_TB.y+150,t,tMar-0.7,()=>{m4_tablet(ctx);m4_carve(ctx,"Marcus Porcius Cato",M4_TB.x,M4_TNY,32,800,clamp((t-tMar)/1.4,0,1));
    for(let i=0;i<4;i++)m4_carve(ctx,m4_offLine(i),M4_TB.x,M4_TLY[i],30,700,clamp((t-tOff[i]+0.1)/0.8,0,1));},{dy:24,d:0.9}));
  // the ladder: his name on a sheet, a line of years; the four lines lift off the stone onto their rungs, each a year long, then a start
  // and an end on each; last, the censorship, eighteen months
  const ends=i=>t<tEnd?0.5*clamp((t-tStart-i*0.05)/0.4,0,1):0.5+0.5*clamp((t-tEnd-i*0.05)/0.4,0,1),lu=i=>clamp((t-tSeq+0.15-i*0.24)/0.9,0,1);
  arrive(ctx,M4_ST.x+M4_ST.w/2,M4_ST.y+M4_ST.h/2,t,tEach-0.3,()=>{m4_ladderSheet(ctx);wc_T(ctx,"Marcus Porcius Cato",M4_ST.x+40,M4_ST.y+76,{w:800,size:32,col:WC_DARK});
    m4_bcAxis(ctx,fin(t,tYear-0.2,0.6));
    for(let i=0;i<4;i++){const u=lu(i);m4_rung(ctx,i,clamp((u-0.82)/0.18,0,1),clamp((u-0.9)/0.1,0,1)*fin(t,tSeq+0.9+i*0.24,0.4));m4_ends(ctx,i,ends(i));}
    m4_rung(ctx,4,fin(t,tCen-0.05,0.5),fin(t,tCen+0.3,0.5));m4_ends(ctx,4,clamp((t-tCen-0.5)/0.8,0,1));},{dy:20,d:0.9});
  arrive(ctx,M4_ST.x+236,M4_ST.y+136,t,tOne-0.1,()=>wc_tag(ctx,M4_ST.x+40,M4_ST.y+136,"one man, a sequence of roles",{size:28,w:700}),{dy:10});
  for(let i=0;i<4;i++)m4_lift(ctx,i,lu(i));
  // the census: a list, unrolled over the tablet, name by name, with each one's age and property; and the word
  m4_scroll(ctx,t,clamp((t-tWrote+0.3)/1.1,0,1),{head:tWrote+0.5,names:tEvery-0.1,ages:tAge-0.1,props:tOwn-0.1});
  wc_hand(ctx,"census",M4_CW[0],M4_CW[1],{p:clamp((t-tCensus+0.05)/0.7,0,1),size:60,col:WC_PENCIL});
  m4_close(ctx,S);
  wc_year(ctx,64,80,"204 BC · Rome",fin(t,0.4,0.6)*(1-fin(t,tCen-0.25,0.4)));wc_year(ctx,64,80,"184 BC · Rome",fin(t,tCen-0.05,0.5));
  wc_paperOver(ctx,S);wc_fadeIn(ctx,S,t,1.4);
  wc_title(ctx,S,t,B+0.6,"Roles come and go","a start, an end and an owner for every role","Film 4 of 9 · master and reference data");});

/* ---------- 2. Census date ---------- */
// Linh, on the campus path
const M4_LNX=820,M4_LNY=1012;
scene("census",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tUni=w("date","university"),tCD=w("date","census date"),tDt=w("date","date is"),t31=w("date","thirty-first"),
    tPl=c("planning"),tHow=w("planning","How"),tAl=w("alumni","alumni office"),tInv=w("alumni","invited"),tWh=w("alumni","which of");
  m4_open(ctx,S,t,sc,"campus",[[0,960,540,1]],{z:0.02});
  // the paper clears off the campus
  m4_hush(ctx,0.9*(1-fin(t,0.2,1.3)));
  // Linh on the path; she reads the alumni office's email on her phone
  const ph=ease(fin(t,tInv-0.2,0.6))*(1-ease(fin(t,tWh-0.3,0.7)));
  arrive(ctx,M4_LNX,M4_LNY-300,t,1.0,()=>person(ctx,"linh",M4_LNX,M4_LNY,0.98,{pose:"ease",pose2:"phone",mix:ph,t}),{d:0.9,from:0.97});
  // the calendar page: 31 March, census date
  const C=M4_CAL;arrive(ctx,C.x+C.w/2,C.y+C.h/2,t,tUni-0.4,()=>{m4_calendar(ctx,t,{date:clamp((t-tDt+0.05)/0.5,0,1)});
    wc_ring(ctx,C.x+C.w/2,C.y+186,98,74,clamp((t-t31+0.1)/0.7,0,1),{seed:21,lw:3});},{dy:20,d:0.9});
  // the word "census", carried from Rome onto the calendar, before "date"
  const cw=tw(ctx,"census",40,600),q=easeCam(clamp((t-tCD+0.95)/0.85,0,1));
  wc_hand(ctx,"census",lerp(M4_CW[0],C.x+C.w/2+4-cw,q),lerp(M4_CW[1],C.y+336,q),{size:lerp(60,40,q),col:WC_PENCIL});
  // Planning's question, then the alumni office's, over the ghost of its email from One person, many roles
  arrive(ctx,1380,280,t,tPl-0.2,()=>m4_ask(ctx,1100,180,560,200,M4_SLATE,"Planning",null,clamp((t-tHow+0.1)/1.9,0,1),{lines:["How many of our students","also work here?"],seed:41}),{dy:16});
  arrive(ctx,1380,520,t,tAl-0.2,()=>m4_ask(ctx,1100,420,560,200,WC_ROLE.alumna,"Alumni office",null,clamp((t-tWh+0.1)/2.0,0,1),{lines:["Which of our alumni","are studying again?"],seed:47}),{dy:16});
  arrive(ctx,1380,682,t,tInv-0.1,()=>m4_ghost(ctx,1120,650,0.85),{dy:10});
  m4_close(ctx,S);
  wc_year(ctx,64,80,"31 March 2026 · the university",fin(t,0.9,0.6));wc_paperOver(ctx,S);});

/* ---------- 3. True for a day ---------- */
// Planning's card, at the right of the platform's copy; the moon, at the left
const M4_PLX=1300,M4_PLY=470,M4_MOON=[300,580];
// the board chapter 3 builds and chapter 4 opens on: the four systems (o.cards, arriving at o.cardT; o.night: each one's status; o.dates),
// the moon, a dotted line from each system to the platform's copy (o.links), the copy (o.cp), Planning's card asking about last year
// (o.q, o.asat, o.ans), and the error in red ink (o.red, o.note); o.rest fades all but the cards
function m4_board(ctx,t,o){const rest=o.rest==null?1:o.rest;
  for(let i=0;i<4;i++){const ca=o.cards[i];if(ca<=0.01)continue;arrive(ctx,M4_SX[i]+M4_SW/2,M4_SY+M4_SH/2,t,o.cardT[i],()=>m4_sys(ctx,t,i,{night:o.night[i],dates:o.dates?o.dates[i]:0}),{dy:-16,a:ca});}
  if(rest<=0.01)return;withA(ctx,rest,()=>{
    arrive(ctx,M4_MOON[0],M4_MOON[1],t,o.moonT,()=>{m4_moon(ctx,M4_MOON[0],M4_MOON[1],1,o.glow||0);wc_tag(ctx,M4_MOON[0],M4_MOON[1]+96,"each night",{align:"center",size:28});},{dy:-10});
    for(let i=0;i<4;i++)if(o.links[i]>0)wc_link(ctx,M4_SX[i]+M4_SW/2,M4_SY+M4_SH+10,M4_BX+90+i*173,M4_BY-10,WC_PENCIL,{p:o.links[i],vertical:true,a:0.55});
    arrive(ctx,M4_BX+M4_BW/2,M4_BY+M4_BH/2,t,o.copyT,()=>m4_copy(ctx,t,o.cp),{dy:16});
    arrive(ctx,M4_PLX+280,M4_PLY+150,t,o.planT,()=>m4_planAsk(ctx,t,M4_PLX,M4_PLY,{q:o.q,asat:o.asat,ans:o.ans}),{dy:16});
    if(o.red>0){const sw=tw(ctx,"student",28,700);wc_ring(ctx,M4_PLX+82+sw/2,M4_PLY+263,sw/2+18,25,o.red,{col:WC_NO,seed:23,lw:3.6});}
    if(o.note>0)wc_hand(ctx,"she came back in Jul 2025",M4_PLX+36,M4_PLY+356,{p:o.note,size:30,col:WC_NO});});}
scene("flags",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tN=c("night"),tNi=w("night","night"),tPf=w("night","platform"),tSt=[w("says","enrolled"),w("says","casual staff"),w("says","project member"),w("says","graduate")],
    tDay=w("over","a day"),tNext=w("over","the next"),tPl=w("again","Planning"),tCD=w("again","census date"),tToday=w("again","today"),
    tCnt=w("wrong","counts"),tMar=w("wrong","March"),tFour=w("wrong","four months");
  // no drift: chapter 4 opens on this board, as it's left
  m4_open(ctx,S,t,sc,"plain",[[0,960,540,1]],{z:0});
  // each night the copy is made again: the date turns, and every status is rubbed out and written again
  const nights=[0,tDay+0.15,tNext+0.05];
  m4_board(ctx,t,{cards:[1,1,1,1],cardT:[0,1,2,3].map(i=>tN+0.1+i*0.22),night:tSt.map((s,i)=>m4_night(t,s-0.1,nights,i*0.12)),
    moonT:tNi-0.2,glow:nights.slice(1).reduce((g,n)=>Math.max(g,Math.exp(-Math.pow((t-n-0.25)/0.35,2))),0),
    links:[0,1,2,3].map(i=>clamp((t-tPf-0.1-i*0.15)/0.7,0,1)),copyT:tPf-0.3,
    cp:{nights,ring:clamp((t-tToday+0.1)/0.7,0,1),rows:tSt.map(s=>fin(t,s+0.2,0.4)),first:tSt.map(s=>s+0.35)},
    planT:tPl-0.3,q:clamp((t-tPl-0.2)/1.4,0,1),asat:fin(t,tCD-0.2,0.5),ans:clamp((t-tCnt+0.1)/1.0,0,1),red:clamp((t-tMar+0.1)/0.8,0,1),note:clamp((t-tFour)/1.5,0,1)});
  m4_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 4. A start and an end ---------- */
const M4_NOOR=[400,930],M4_MEI=[1520,930],M4_FORM=[620,150];
// the timeline's rows in the order they're named: student, tutor, researcher, alumna, applicant
scene("bands",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),tEnd=sc.dur;
  const tKnow=w("know","knows"),tSh=c("shape"),tNoor=w("shape","Noor"),tMei=w("shape","Mei"),tSame=w("shape","same shape"),
    tF=[w("shape","the person"),w("shape","kind of role"),w("shape","office that owns"),w("shape","when it starts"),w("shape","when it ends")],
    tUn=c("under"),tB=w("under","bands"),tApp=c("first"),tStu=w("first","then student"),t19=w("first","nineteen"),t22=w("first","twenty-two"),tAlu=w("first","Then alumna"),
    tTut=c("tutor"),tTf=w("tutor","from"),tAg=c("again"),tJul=w("again","July"),tRes=c("research"),tMarch=w("research","March"),tDec=w("research","December"),
    tFol=w("stays","follow"),tOnce=w("stays","run at once"),tPer=w("stays","The person"),tYr=w("research","this year");
  m4_open(ctx,S,t,sc,"plain",[[0,960,540,1]],{z:0});m4_range(t,[[0,2018.5,2027]]);
  // chapter 3's board: all but the four systems step back, and each system writes in the dates it knows; then they go
  const out=1-fin(t,tSh-0.5,0.6);
  if(out>0.01)m4_board(ctx,t,{cards:[out,out,out,out],cardT:[-9,-9,-9,-9],night:[0,1,2,3].map(()=>({p:1,rub:0})),dates:[0,1,2,3].map(i=>clamp((t-tKnow+0.2-i*0.4)/0.8,0,1)),
    rest:1-fin(t,0.5,0.7),moonT:-9,links:[1,1,1,1],copyT:-9,cp:{nights:[-9,-8,-7],ring:1,rows:[1,1,1,1],first:[-9,-9,-9,-9]},planT:-9,q:1,asat:1,ans:1,red:1,note:1});
  // Noor and Mei, and the form they give every role, filled in as it's said; then it shrinks to the top of the frame
  const nm=1-fin(t,tUn-0.7,0.6);
  if(nm>0.01)withA(ctx,nm,()=>{arrive(ctx,M4_NOOR[0],M4_NOOR[1]-300,t,tNoor-0.3,()=>person(ctx,"noor",M4_NOOR[0],M4_NOOR[1],0.98,{pose:"explain",t}),{d:0.9,from:0.97});
    arrive(ctx,M4_MEI[0],M4_MEI[1]-300,t,tMei-0.3,()=>m4_person(ctx,"mei",M4_MEI[0],M4_MEI[1],0.98,{pose:"explain",flip:true,t}),{d:0.9,from:0.97});});
  const fs=ease(fin(t,tUn-0.6,0.9));
  if(fs<0.99){const cx=M4_FORM[0]+340,cy=M4_FORM[1]+280,k=lerp(1,0.3,fs);ctx.save();ctx.translate(lerp(cx,1100,fs),lerp(cy,70,fs));ctx.scale(k,k);ctx.translate(-cx,-cy);
    withA(ctx,1-fs,()=>arrive(ctx,cx,cy,t,tSame-0.5,()=>m4_form(ctx,M4_FORM[0],M4_FORM[1],tF.map(s=>clamp((t-s+0.1)/0.55,0,1))),{dy:20,d:0.9}));ctx.restore();}
  m4_formStrip(ctx,1100,70,fin(t,tUn-0.2,0.6)*(1-fin(t,tEnd-1.6,0.8)));
  // Linh, white, at the left of a line of years; each role, as it's named, a band on her and a dated period on its row, with its owner
  const rowT=[tStu,tTut,tRes,tAlu,tApp],lab=rowT.map(s=>fin(t,s-0.15,0.5));
  m4_tl(ctx,t,{lane:lab,lab,own:rowT.map(s=>fin(t,s+0.35,0.5)),figA:fin(t,tUn-0.2,0.8),fig:rowT.map(s=>fin(t,s,0.6)),axis:clamp((t-tB+0.2)/1.4,0,1),
    glow:0.6*fin(t,tPer,0.8)*(1-fin(t,tEnd-0.7,0.8)),
    per:{app1:clamp((t-tApp-0.1)/0.6,0,1),stu1:clamp((t-t19+0.25)/(t22-t19+0.5),0,1),alu:clamp((t-tAlu)/1.0,0,1),tut:clamp((t-tTf+0.1)/1.0,0,1),
      app2:clamp((t-tAg-0.05)/0.5,0,1),stu2:clamp((t-tJul+0.2)/1.0,0,1),res:clamp((t-tMarch+0.1)/(tDec-tMarch+0.4),0,1)}});
  // this year: today's line, its tag giving way to the loop round the roles that run at once
  withA(ctx,1-fin(t,tEnd-1.2,0.8),()=>m4_today(ctx,clamp((t-tYr+0.3)/0.9,0,1),fin(t,tYr,0.5)*(1-fin(t,tOnce-0.5,0.4))));
  // some follow each other: applicant to student, student to alumna; some run at once: the four bands of 2026
  const fo=1-fin(t,tEnd-1.8,0.7);
  if(fo>0.01)withA(ctx,fo,()=>{const xa=m4_x(M4_PER[0].B),xb=m4_x(M4_PER[1].B);
    m4_arrow(ctx,xa,m4_rowY(4)-26,xa,m4_rowY(0)+28,clamp((t-tFol+0.1)/0.6,0,1));m4_arrow(ctx,xb,m4_rowY(0)+26,xb,m4_rowY(3)-28,clamp((t-tFol-0.35)/0.5,0,1));
    m4_loop(ctx,m4_x(2026)-14,m4_rowY(0)-42,M4_X1+6,m4_rowY(3)+42,clamp((t-tOnce)/0.9,0,1),{seed:29});});
  m4_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 5. A contract each term ---------- */
// a date pinned to the tutor row: its tag at the top, what it finds under it, and the pin down to the row
const M4_PINY=240;
function m4_datePin(ctx,t,x,lab,res,col,o){const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{arrive(ctx,x,M4_PINY,t,o.t0,()=>m4_tagAt(ctx,x,M4_PINY,lab,{size:28,w:700}),{dy:-10});
  m4_pin(ctx,x,M4_PINY+90,m4_rowY(1),o.pn);if(o.nt>0)wc_hand(ctx,res,x-tw(ctx,res,30,600)/2+6,M4_PINY+72,{p:o.nt,size:30,col});});}
const M4_JAN=m4_d("2026-01-15");
scene("terms",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tOneB=w("drew","one band"),tHR=c("hr"),tOff=w("hr","offers"),tPer=w("hr","teaching period"),tNew=w("hr","new contract"),tUnit=w("hr","one unit"),
    tSt=w("every","starts"),tEn=w("every","ends"),tJan=c("jan"),tBet=w("jan","between"),tNot=w("jan","isn't staff"),tCD=w("jan","census date"),tIs=w("jan","she is.");
  m4_open(ctx,S,t,sc,"plain",[[0,960,540,1]],{z:0});
  // in on the tutor row: the other rows step back, and the line of years closes in on 2023 to 2026, then on the turn of 2026
  m4_range(t,[[0,2018.5,2027],[0.9,2022.6,2027],[tJan-0.7,2025.55,2026.6]],1.6);
  const hush=fin(t,0.8,0.8),row=[0,1,2,3,4].map(i=>i===1?1:1-0.62*hush);
  m4_tl(ctx,t,{row,all:true,split:clamp((t-tNew+0.1)/1.6,0,1),fig:[1,1,1,1,1]});
  // film 1's picture, named: one band
  const nA=1-fin(t,tNew-0.2,0.6),nx=m4_x(M4_TUT[0].A);
  if(nA>0.01)withA(ctx,nA,()=>{wc_hand(ctx,"film 1: one band",nx+4,300,{p:clamp((t-tOneB+0.4)/0.9,0,1),size:30,col:WC_INK});
    m4_arrow(ctx,nx+40,318,nx+40,m4_rowY(1)-28,clamp((t-tOneB)/0.5,0,1),{lw:2.4});});
  // HR's card: an offer of work, each teaching period, for one unit
  const hA=1-fin(t,tJan-1.0,0.6);
  if(hA>0.01)withA(ctx,hA,()=>arrive(ctx,1540,178,t,tHR-0.2,()=>m4_hrCard(ctx,1260,60,[clamp((t-tOff+0.1)/0.7,0,1),clamp((t-tPer+0.1)/0.8,0,1),clamp((t-tUnit+0.1)/0.5,0,1)]),{dy:16}));
  // every contract starts and ends: a pencil mark at each end, in turn
  const mA=1-fin(t,tJan-0.9,0.6);
  if(mA>0.01)withA(ctx,mA,()=>M4_TUT.forEach((p,i)=>{const y=m4_rowY(1),xs=m4_x(p.A),xe=m4_x(p.B);
    if(xs>=M4_X0&&xs<=M4_X1)m4_rule(ctx,xs,y-30,y+30,clamp((t-tSt+0.1-i*0.1)/0.3,0,1),{lw:3});if(xe>=M4_X0&&xe<=M4_X1)m4_rule(ctx,xe,y-30,y+30,clamp((t-tEn+0.1-i*0.1)/0.3,0,1),{lw:3});}));
  // two dates: 15 January, between contracts; census date, in one
  m4_datePin(ctx,t,m4_x(M4_JAN),"15 Jan 2026","not staff",WC_INK,{t0:tBet-0.4,pn:clamp((t-tBet+0.1)/0.7,0,1),nt:clamp((t-tNot+0.1)/0.5,0,1)});
  m4_datePin(ctx,t,m4_x(M4_CEN),"31 Mar 2026","staff",WC_ROLEINK.tutor,{t0:tCD-0.4,pn:clamp((t-tCD+0.1)/0.7,0,1),nt:clamp((t-tIs+0.05)/0.4,0,1)});
  m4_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 6. One line, one date ---------- */
// the line's tag, the line's top; Planning's card, top left
const M4_PCX=330,M4_PCY=20;
scene("line",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tPlan=w("draw","Planning"),tLine=w("draw","one line"),tCen=w("draw","census"),tDot=[c("open"),w("open","tutor"),w("open","researcher"),w("open","alumna")],
    tCnt=w("once","counts once"),tOneP=w("once","one person"),tMove=c("back"),tTA=w("back","a tutor"),tKept=w("kept","stays"),
    tFil=c("filter"),tAlOf=w("filter","alumni office"),tFw=w("filter","a filter"),tRole=w("filter","student role"),tBk=w("since","back"),tJul=w("since","July");
  m4_open(ctx,S,t,sc,"plain",[[0,960,540,1]],{z:0});
  m4_range(t,[[0,2025.55,2026.6],[0.9,2024.55,2027]],1.6);
  // the line's date: census date; back a year; and back again
  const bk=easeCam(clamp((t-tMove+0.1)/1.5,0,1))-easeCam(clamp((t-tFil+0.5)/1.5,0,1)),ld=M4_CEN-bk*(M4_CEN-M4_CEN0),lx=m4_x(ld);
  // her figure wears only the roles open where the line stands
  const unh=fin(t,0.8,0.8),open=m4_openAt(ld,true),fp=fin(t,tLine+0.3,0.9);
  m4_tl(ctx,t,{row:[0,1,2,3,4].map(i=>i===1?1:lerp(0.38,1,unh)),all:true,split:1,fig:[0,1,2,3,4].map(i=>lerp(1,open[i],fp)),avoid:lx,avoidK:fin(t,tLine-0.3,0.6)});
  // chapter 5's pins go
  const pa=1-fin(t,0.7,0.5);
  m4_datePin(ctx,t,m4_x(M4_JAN),"15 Jan 2026","not staff",WC_INK,{t0:-9,pn:1,nt:1,a:pa});m4_datePin(ctx,t,m4_x(M4_CEN),"31 Mar 2026","staff",WC_ROLEINK.tutor,{t0:-9,pn:1,nt:1,a:pa});
  // the line, drawn down at census date, with its tag; a dot where it crosses each open role
  m4_rule(ctx,lx,M4_LY0,M4_AXY+12,clamp((t-tLine+0.1)/0.9,0,1),{lw:3.4});
  const ta=fin(t,tCen-0.2,0.5);if(ta>0.01)withA(ctx,ta,()=>{withA(ctx,1-bk,()=>m4_tagAt(ctx,lx,M4_LTY,"census date · 31 Mar 2026",{size:28,w:700,wash:WC_BADGE,washA:0.5}));
    if(bk>0.01)withA(ctx,bk,()=>m4_tagAt(ctx,lx,M4_LTY,"census date · 31 Mar 2025",{size:28,w:700,wash:WC_BADGE,washA:0.5}));});
  const dim=fin(t,tFil+0.6,0.6);[0,1,2,3,4].forEach(i=>m4_dot(ctx,lx,m4_rowY(i),M4_ROWS[i],fin(t,tDot[Math.min(i,3)]-0.05,0.35)*open[i]*(i===1||i===2?1-0.7*dim:1)));
  // Planning counts: three rows from three lists fold into one person; a year back, a tutor and an alumna; last year's answer, kept
  const pcA=1-fin(t,tFil-0.4,0.5);
  if(pcA>0.01)withA(ctx,pcA,()=>arrive(ctx,M4_PCX+320,M4_PCY+140,t,tPlan-0.3,()=>m4_planCount(ctx,t,M4_PCX,M4_PCY,{rows:clamp((t-tCnt+0.1)/0.9,0,1),
    fold:clamp((t-tOneP+0.2)/1.0,0,1),tick:clamp((t-tOneP-0.5)/0.6,0,1),back:fin(t,tTA-0.5,0.7),kept:fin(t,tKept-0.1,0.5)}),{dy:16}));
  // the alumni office's question, as a filter, and who it finds: Linh, back since July 2025
  arrive(ctx,M4_PCX+320,M4_PCY+140,t,tAlOf-0.2,()=>m4_alumFilter(ctx,t,M4_PCX,M4_PCY,{q:clamp((t-tFw+0.1)/(tRole-tFw+0.6),0,1),found:clamp((t-tBk+0.1)/0.9,0,1)}),{dy:16});
  const xj=m4_x(M4_PER[5].A);m4_loop(ctx,xj-44,m4_rowY(0)-36,xj+44,m4_rowY(0)+36,clamp((t-tJul+0.1)/0.8,0,1),{seed:37});
  m4_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 7. What a role is for ---------- */
// Ana Ruiz, white, at the right, sized so her coral band lines up with Linh's researcher row
const M4_ANA=[1716,872],M4_ANS=0.98;
scene("relates",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tRel=w("for","relates"),tMa=w("items","master's"),tUnit=w("items","one unit"),tProj=w("items","one project"),tPeo=c("people"),tRl=w("people","relate"),
    tAna=w("people","Ana"),tSup=w("people","supervises"),tDates=w("ends","own dates"),tEnds=w("ends","ends with"),tBoth=w("ends","Both");
  m4_open(ctx,S,t,sc,"plain",[[0,960,540,1]],{z:0});
  // when Ana joins, the timeline draws in from the right to give her room, with the project's end still in view
  m4_range(t,[[0,2024.55,2027],[0.9,2025.4,2027],[tPeo-0.3,2025.45,2027.05]],1.6,lerp(M4_XR,1440,easeCam(clamp((t-tPeo+0.3)/1.6,0,1))));
  const gl=0.55*fin(t,tBoth-0.1,0.7),oa=1-fin(t,0.7,0.6),lx=m4_x(M4_CEN);
  m4_tl(ctx,t,{all:true,split:1,fig:[1,1,1,1,0],glow:gl,avoid:lx,avoidK:oa});
  // chapter 6's line, dots, card and ring go
  if(oa>0.01)withA(ctx,oa,()=>{m4_rule(ctx,lx,M4_LY0,M4_AXY+12,1,{lw:3.4});m4_tagAt(ctx,lx,M4_LTY,"census date · 31 Mar 2026",{size:28,w:700,wash:WC_BADGE,washA:0.5});
    [0,1,2,3].forEach(i=>m4_dot(ctx,lx,m4_rowY(i),M4_ROWS[i],i===1||i===2?0.3:1));m4_alumFilter(ctx,t,M4_PCX,M4_PCY,{q:1,found:1});});
  const ra=1-fin(t,0.3,0.5);if(ra>0.01)withA(ctx,ra,()=>{const xj=m4_x(M4_PER[5].A);m4_loop(ctx,xj-44,m4_rowY(0)-36,xj+44,m4_rowY(0)+36,1,{seed:37});});
  // what each open role relates to: a tag in the sky over the timeline, hung from its period by a pencil line, so the periods stay in
  // sight (a tag on the row would hide the shorter ones). Laid out from their widths so no line crosses a tag or a name: the tutor's
  // hangs from the start of its contract, clear of "S1", and the researcher's, above it, from the end of the project
  const tg=1-fin(t,tPeo-0.5,0.6);
  if(tg>0.01)withA(ctx,tg,()=>{const tc=M4_TUT[6],xs=m4_x(M4_PER[5].A)+16,W=s=>tw(ctx,s,28,700)+64;
    withA(ctx,fin(t,tRel-0.2,0.6),()=>wc_hand(ctx,"relates to",xs+4,130,{size:30,col:WC_INK}));
    const sR="project · wait times in emergency care",xR=1890-W(sR),xT=m4_x(tc.A)+6;
    [["student","master's · health informatics",tMa-0.2,184,xs,xs+24],["tutor","a first-year unit · S1 2026",tUnit-0.3,328,xT,xT+24],
     ["researcher",sR,tProj-0.3,256,xR,Math.min(m4_x(M4_PER[6].B)-60,xR+W(sR)-40)]].forEach(([r,s,t0,y,x,lx])=>{
      m4_rule(ctx,lx,y+26,m4_rowY(M4_ROWS.indexOf(r))-22,clamp((t-t0-0.15)/0.5,0,1),{lw:2.4,dash:[6,7]});
      arrive(ctx,x+W(s)/2,y,t,t0,()=>m4_rel(ctx,x,y,r,s,1),{dy:8});});});
  // Ana joins at the right, in white, with her own coral band, and her name
  const anaA=fin(t,tRl-0.1,0.8);m4_glow(ctx,M4_ANA[0],M4_ANA[1]-330,gl,280);
  wc_white(ctx,"ana",M4_ANA[0],M4_ANA[1],M4_ANS,[{col:WC_ROLE.researcher,a:fin(t,tAna,0.6),i:1}],{a:anaA});
  arrive(ctx,1705,165,t,tAna-0.2,()=>{wc_panel(ctx,1530,90,350,150,{kind:"card",role:WC_ROLE.researcher,sw:tw(ctx,"Ana Ruiz",30,800)+36,seed:57});
    wc_T(ctx,"Ana Ruiz",1562,138,{w:800,size:30,col:WC_DARK});wc_T(ctx,"Head of School",1562,180,{w:600,size:28,col:WC_MUTED});wc_T(ctx,"leads the project",1562,220,{w:600,size:28,col:WC_INK});},{dy:12});
  // a dotted line from her to Linh, and what it is: supervises, from March to December 2026, ending with the project
  const L0=[M4_FX+80,M4_FY-448*M4_FS*PEOPLE.linh.build.h],A0=[M4_ANA[0]-76,M4_ANA[1]-448*M4_ANS*PEOPLE.ana.build.h],CP=[960,92],arc=[];
  for(let i=0;i<=40;i++){const u=i/40,v=1-u;arc.push([v*v*A0[0]+2*v*u*CP[0]+u*u*L0[0],v*v*A0[1]+2*v*u*CP[1]+u*u*L0[1]]);}
  const ap=clamp((t-tSup+0.2)/1.1,0,1);wc_pencil(ctx,arc,ap,{dash:[3,11],lw:3.2,seed:61,amp:0.6});
  if(ap>=1){const [x1,y1]=arc[40],[x0,y0]=arc[37],an=Math.atan2(y1-y0,x1-x0);ctx.save();ctx.fillStyle=rgba(WC_PENCIL,0.9);ctx.beginPath();ctx.moveTo(x1,y1);
    ctx.lineTo(x1-16*Math.cos(an-0.45),y1-16*Math.sin(an-0.45));ctx.lineTo(x1-16*Math.cos(an+0.45),y1-16*Math.sin(an+0.45));ctx.closePath();ctx.fill();ctx.restore();}
  const mid=arc[20],dA=fin(t,tDates-0.2,0.5);
  arrive(ctx,mid[0],mid[1],t,tSup+0.3,()=>{withA(ctx,1-dA,()=>wc_tag(ctx,mid[0],mid[1],"supervises",{align:"center",size:28,w:700}));
    if(dA>0.01)withA(ctx,dA,()=>wc_tag(ctx,mid[0],mid[1],"supervises · Mar–Dec 2026",{align:"center",size:28,w:700,wash:WC_ROLE.researcher,washA:0.22}));},{dy:-10});
  // it ends with the project: a dashed line from its dates to the project's end
  const xe=m4_x(M4_PER[6].B),ye=m4_rowY(2);wc_link(ctx,mid[0]+150,mid[1]+28,xe,ye-30,WC_PENCIL,{p:clamp((t-tEnds+0.1)/0.7,0,1),vertical:true,a:0.8,dash:[7,8],lw:2.6});
  m4_loop(ctx,xe-34,ye-36,xe+34,ye+36,clamp((t-tEnds-0.4)/0.7,0,1),{seed:43});
  m4_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 8. Elsewhere ---------- */
// the person who stays, in the doorway, and her heart; the account holder, by the meter
const M4_OCC=[1357,712],M4_CHEST=[1357,512],M4_AH=[1664,838];
// the need, kept on a band: a red dotted line along it
function m4_need(ctx,x0,x1,y,a){if(a<=0.01||x1<=x0)return;ctx.save();ctx.strokeStyle=rgba(M4_HEART,0.95*a);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.setLineDash([2,10]);
  ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();ctx.restore();}
scene("elsewhere",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tCo=w("energy","company"),tAH=w("moves","account holder"),tOut=w("moves","moves out"),tJun=w("moves","June"),tEnd=w("moves","role ends"),
    tSt=w("need","person who stays"),tLS=w("need","life support"),tGo=w("need","goes on"),tHis=w("kept","his account"),tClose=w("kept","close"),tHer=w("kept","Kept on her"),tStays=w("kept","it stays");
  m4_open(ctx,S,t,sc,"street",[[0,960,540,1]],{z:0.02});
  // the person who stays, in the doorway; the account holder walks away down the street
  m4_whiteOn(ctx,"leila",M4_OCC[0],M4_OCC[1],0.56,{a:fin(t,0.5,0.8)});
  const wk=clamp((t-tOut)/2.8,0,1),aa=fin(t,0.8,0.8)*(1-clamp((wk-0.45)/0.5,0,1));
  if(aa>0.01)m4_whiteOn(ctx,"minh",M4_AH[0]+easeCam(wk)*420,M4_AH[1]-Math.abs(Math.sin(wk*Math.PI*6))*5*Math.min(1,wk*8),0.66,{a:aa});
  // her need: a heart, which beats; its tag, on the wall above the company's sheet, and a pencil arrow to it
  const hb=1+0.09*Math.pow(Math.max(0,Math.sin(t*5.4)),3)*fin(t,tGo-0.3,0.5);
  arrive(ctx,M4_CHEST[0],M4_CHEST[1],t,tLS-0.1,()=>m4_heart(ctx,M4_CHEST[0],M4_CHEST[1],1.9*hb,1),{dy:-8});
  arrive(ctx,1128,448,t,tLS+0.25,()=>wc_tag(ctx,1222,448,"life support",{align:"right",size:28,w:600}),{dy:-6});
  m4_arrow(ctx,1232,456,1318,490,clamp((t-tLS-0.45)/0.5,0,1),{lw:2.4});
  // the company's sheet: his role, to 14 June, and hers, open
  const [y1,y2]=M4_ERY,xJ=m4_em(M4_MOVE);
  arrive(ctx,M4_ES.x+M4_ES.w/2,M4_ES.y+M4_ES.h/2,t,tCo-0.4,()=>{m4_energySheet(ctx,{rowA:[fin(t,tAH-0.1,0.5),fin(t,tSt-0.1,0.5)],axis:1});
    m4_eband(ctx,M4_EX0,lerp(M4_EX0,xJ,ease(clamp((t-tAH-0.2)/(tJun-tAH+0.2),0,1))),y1,fin(t,tAH,0.4),{open:true});
    m4_edge(ctx,[[xJ,y1-20],[xJ,y1+20]],fin(t,tEnd-0.15,0.4));
    m4_eband(ctx,M4_EX0,lerp(M4_EX0,M4_EX1+10,ease(clamp((t-tSt)/1.3,0,1))),y2,fin(t,tSt,0.4),{open:true});},{dy:20,d:0.9});
  arrive(ctx,xJ+86,y1,t,tJun-0.1,()=>wc_tag(ctx,xJ+44,y1,"14 Jun",{size:28,w:700}),{dy:-6});
  // where the company keeps her need: on his account, it would close with it; on her, it stays
  const f1=clamp((t-tHis+0.6)/0.9,0,1),f2=clamp((t-tHer+0.15)/0.9,0,1),hx=M4_EX0+64;
  if(f1>0){const q1=ease(f1),fx=f2>0?hx:lerp(M4_CHEST[0],hx,q1),fy=f2>0?lerp(y1,y2,ease(f2))-Math.sin(ease(f2)*Math.PI)*30:lerp(M4_CHEST[1],y1,q1)-Math.sin(q1*Math.PI)*90;
    m4_need(ctx,hx+22,lerp(hx+22,xJ,ease(clamp((t-tHis-0.3)/0.8,0,1))),y1,1-0.65*f2);
    m4_need(ctx,hx+22,lerp(hx+22,M4_EX1,ease(clamp((t-tHer-0.5)/1.2,0,1))),y2,1);
    m4_heart(ctx,fx,fy,1.5,1);}
  withA(ctx,1-0.55*f2,()=>{wc_ring(ctx,xJ-2,y1,34,30,clamp((t-tClose+0.1)/0.7,0,1),{col:WC_NO,seed:47,lw:3.4});
    wc_hand(ctx,"closes with the account",M4_EX0+12,y1+54,{p:clamp((t-tClose-0.2)/1.1,0,1),size:30,col:WC_NO});});
  wc_hand(ctx,"kept on the person",M4_EX0+12,y2+54,{p:clamp((t-tStays+0.1)/0.9,0,1),size:30,col:WC_ROLEINK.alumna});
  m4_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 9. One table, any date ---------- */
const M4_JUN=[262,900],M4_CY2=648;
scene("table",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tPf=w("row","platform"),tRow=w("row","a row"),tCol=[w("cols","the person"),w("cols","role type"),w("cols","its owner"),w("cols","relates"),w("cols","valid from"),w("cols","and to")],
    tJun=c("tests"),tDbt=w("tests","dbt"),tE=w("tests","end before"),tBel=w("tests","belongs"),tQ=w("asat","question"),tP=[w("asat","census date"),w("asat","last year"),w("asat","today")],
    tRec=w("late","recorded"),tCon=w("late","a contract"),tBeg=w("late","the day it began");
  m4_open(ctx,S,t,sc,"office",[[0,960,540,1]],{z:0.015});
  // Jun, who builds it
  arrive(ctx,M4_JUN[0],M4_JUN[1]-300,t,tJun-0.3,()=>person(ctx,"jun",M4_JUN[0],M4_JUN[1],0.98,{pose:"stand",t}),{d:0.9,from:0.97});
  // the table: a row for each of Linh's roles; each column lit as it's named (the dates together); last, when each row was recorded
  const col=tCol.map((s,k)=>fin(t,s-0.1,0.3)*(1-fin(t,(k===4?tCol[5]:tCol[k+1]||s)+(k>=4?1.4:0.2),0.4)));
  arrive(ctx,M4_TB2.x+M4_TB2.w/2,M4_TB2.y+M4_TB2.h/2,t,tPf-0.3,()=>m4_table(ctx,t,{rows:clamp((t-tRow+0.2)/1.6,0,1),col,rec:fin(t,tRec-0.2,0.6),hiRow:fin(t,tCon-0.1,0.5)}),{dy:20,d:0.9});
  // its two tests, in plain words; then the question, and the dates it can take
  arrive(ctx,M4_TB2.x+345,M4_CY2+118,t,tDbt-0.2,()=>m4_yaml(ctx,M4_TB2.x,M4_CY2,{t1:clamp((t-tE+0.4)/1.4,0,1),t2:clamp((t-tBel+0.4)/1.4,0,1)}),{dy:16});
  const on=tP.reduce((k,s,i)=>t>=s-0.2?i:k,-1),qx=M4_TB2.x+M4_TB2.w-690;
  arrive(ctx,qx+345,M4_CY2+118,t,tQ-0.3,()=>m4_query(ctx,qx,M4_CY2,{pins:tP.map(s=>fin(t,s-0.2,0.3)),t,t0:tP.map(s=>s-0.2),on}),{dy:16});
  // the contract entered late counts from the day it began
  const X=k=>M4_TB2.x+M4_TC[k][1];m4_loop(ctx,X(4)-14,M4_TRY(6)-34,X(4)+182,M4_TRY(6)+14,clamp((t-tBeg+0.1)/0.8,0,1),{seed:71});
  m4_close(ctx,S);wc_paperOver(ctx,S);});

/* ---------- 10. The person stays ---------- */
// one day she'll graduate again: her student role gets an end, somewhere ahead
const M4_GRAD=2027.75;
scene("stays",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tTo=c("today"),tD=[w("today","a student"),w("today","a tutor"),w("today","a researcher"),w("today","an alumna")],tDec=w("next","December"),tGrad=w("next","graduate"),
    tCome=c("come"),tK=c("last"),tSt=w("last","The person");
  m4_open(ctx,S,t,sc,"plain",[[0,960,540,1]],{z:0});
  // the 2026 end of her timeline; on "roles come and go", the whole of it
  m4_range(t,[[0,2025.4,2028],[tCome-0.4,2018.5,2028]],1.8);
  const gr=fin(t,tGrad-0.1,0.8),xn=m4_x(M4_NOW),stu=M4_PER[5];
  m4_tl(ctx,t,{all:true,split:1,fig:[1,1,1,1,0],glow:0.6*fin(t,tSt-0.1,0.8),over:{stu2:{fade:1-gr}},avoid:xn,avoidK:fin(t,tTo-0.3,0.6)});
  if(gr>0.01)m4_per(ctx,Object.assign({},stu,{B:M4_GRAD}),m4_rowY(0),{a:gr,seed:stu.k.length*7+Math.round(stu.A*3)});
  // today: the line, and a dot on each of the four roles open on it
  m4_rule(ctx,xn,M4_LY0,M4_AXY+12,clamp((t-tTo+0.2)/0.9,0,1),{lw:3.4});
  withA(ctx,fin(t,tTo+0.3,0.5),()=>m4_tagAt(ctx,xn,M4_LTY,"today",{size:28,w:700,wash:WC_BADGE,washA:0.5}));
  [0,1,2,3].forEach(i=>m4_dot(ctx,xn,m4_rowY(i),M4_ROWS[i],fin(t,tD[i]-0.05,0.35)));
  // in December the project ends; one day she'll graduate again
  const ra=1-fin(t,tCome-0.9,0.5);if(ra>0.01)withA(ctx,ra,()=>{const xe=m4_x(M4_PER[6].B),ye=m4_rowY(2);m4_loop(ctx,xe-34,ye-36,xe+34,ye+36,clamp((t-tDec+0.1)/0.7,0,1),{seed:43});
    const xg=m4_x(M4_GRAD),yg=m4_rowY(0);m4_loop(ctx,xg-34,yg-36,xg+34,yg+36,clamp((t-tGrad-0.2)/0.7,0,1),{seed:53});});
  m4_close(ctx,S);wc_paperOver(ctx,S);
  // the last line, then carried down onto the end card, above the veil, landing where the card's own line fades in and takes it over
  const KL="A role has a start and an end. The person stays.",kl=fin(t,tK-0.1,0.6),ky=lerp(176,420,fin(t,B+0.3,1.1)),kg=kl*(1-fin(t,B+0.8,0.9));
  if(kg>0.01){setScreen(ctx,S);withA(ctx,kg,()=>{ctx.save();ctx.translate(960,ky-16);ctx.scale(1,0.2);const g=ctx.createRadialGradient(0,0,10,0,0,700);
    g.addColorStop(0,rgba(WC_PAPER,0.94));g.addColorStop(0.7,rgba(WC_PAPER,0.7));g.addColorStop(1,rgba(WC_PAPER,0));ctx.fillStyle=g;ctx.fillRect(-700,-700,1400,1400);ctx.restore();});}
  wc_end(ctx,S,t,B+0.8,"Roles come and go",KL,"Film 4 of 9");
  if(kl>0.01&&t<B+2.4){setScreen(ctx,S);withA(ctx,kl,()=>wc_T(ctx,KL,960,ky,{w:700,size:48,align:"center",col:WC_DARK}));}});
