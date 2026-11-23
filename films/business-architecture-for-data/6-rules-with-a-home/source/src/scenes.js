/* ===== Rules with a home: scenes =====
   Twelve chapters, as in ../script.md. Khorasan, in the ninth century: a new qanat dug too close to an old one, disputes over
   qanats brought to the governor in Nishapur with no rule to settle them, and the rules written in one book; then day one's data rule
   and the bill of $412.80 beside it; the household away in June, whose meter stored its readings; the nightly script on the wall
   between the network and retail, writing since March to a queue nothing reads; the rule in five places, none of them its home;
   the rule split in two, one on each side, joined by what crosses; where each comes from, and the goal that was an obligation;
   what a rule is about; the step it's attached to and what that step expects of the data; where ArchiMate 4 puts a rule, a
   requirement, with what it's linked to; the rule in a set form and the checks generated from it; generally, an ontology; and
   back in Khorasan.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: every
   shot drifts slowly and things arrive with a spring. Sound: every effect in tools/score.py fires at the same moment as the thing
   it belongs to here, so keep the two in step. */

/* ---------- 1. The book on qanats ---------- */
// Khorasan, in the ninth century, from high above: the qanats' shafts running down from the mountains to a town's fields, green, with
// the water underground; then a new qanat dug from its own outlet up, its head close beside the old one's, which takes the old one's
// water: its new fields turn green as the old village's go dry. Then, through a moment of dark, Nishapur, the governor's court: people
// who keep coming two by two with disputes over qanats; the law books in their niche, with nothing on qanats; an empty place on the
// table where the rules should be, and the field gone dry. The legal scholars of Khorasan and of Iraq gather at the table, and the
// rules are written in one book: the Kitab-i Qani. From then on a judge reads each dispute's answer in it; two hundred years later,
// a historian writes that qanats are still judged by it; and everyone who needs the rules comes to it, their one home.
// The people of the court, at one scale, nearer the lower they stand: the pairs who bring disputes, where each waits (front first)
// and how they're dressed; the scholars of Iraq, at the table's left (the nearer one stays, as the judge), and of Khorasan, at its
// right; and, at the end, those who need the rules: [x, y, dress, from the left (-1) or the right (1)]
const D9_S=0.66,D9_PAIRS=[[1160,1232],[1360,1432],[1560,1632],[1760,1832]];
const D9_DRESS=[[{dress:"robe",head:"turban"},{dress:"tunic",head:"cap"}],[{dress:"chador"},{dress:"robe",head:"cap"}],[{dress:"tunic",head:"cap"},{dress:"robe",head:"turban"}],[{dress:"robe",head:"turban"},{dress:"chador"}],
  [{dress:"tunic"},{dress:"robe",head:"turban"}],[{dress:"chador"},{dress:"tunic",head:"cap"}],[{dress:"robe",head:"cap"},{dress:"tunic"}],[{dress:"tunic",head:"cap"},{dress:"chador"}]];
const D9_IRAQ=[716,806],D9_KHOR=[1110,1190,1270],D9_JUDGE=[1156,1228];
const D9_ALL=[[300,900,{dress:"tunic",head:"cap"},-1],[420,930,{dress:"chador"},-1],[1330,912,{dress:"robe",head:"turban"},1],[1450,886,{dress:"tunic"},1],[1570,936,{dress:"chador"},1],[1690,898,{dress:"robe",head:"cap"},1]];
scene("book",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);
  const tC=c("court"),tNd=c("needed"),tCa=c("called"),tJ=c("judged"),tL=c("later"),tH=c("home"),tSw=tC-0.75,tSa=w("gather","So Abdallah");
  // the plain, until the moment of dark that takes us to the court
  if(t<tSw+0.6){const tQ=w("edge","qanats"),tNw=w("close","new tunnel"),tTc=w("close","too close"),tTk=w("close","take its water"),tDr=w("close","fields dry");
    const tDn=tTc+0.2,dug=clamp((t-tNw+0.4)/(tDn-tNw+0.4),0,1),take=fin(t,tTk-0.3,1.4),dry=fin(t,tDr-0.9,1.8),out=1-fin(t,tSw-0.15,0.35);
    ctx.save();focus(ctx,t,[[0,900,440,0.8],[tNw-0.6,700,520,1.25],[tDr-1.0,1160,700,0.98]],1.9);
    ba_aerial(ctx,t,{flow:1-0.82*take,wet:BA_FIELDS.map((_,i)=>lerp(0.86,0.1,clamp(dry*1.4-0.4*hash(i,977),0,1))),warm:0.35,lit:pulseAt(t,tQ,2.2),litP:clamp((t-tQ+0.3)/1.4,0,1)});
    d9_seep(ctx,t,BA_CHAIN,fin(t,w("edge","tunnels")-0.3,0.8)*(1-0.85*take));
    d9_chain2(ctx,t,{dug,flow:clamp((t-tTk-0.4)/2.0,0,1),hi:pulseAt(t,tDn+0.1,2.0)});d9_seep(ctx,t,D9_CH2,take);
    baTagAt(ctx,S,900,440,"an old qanat",BAC,{a:fin(t,w("close","old one")-0.2,0.5)*out,dy:-24});
    baTagAt(ctx,S,560,540,"a new one, too close",BA_RED,{a:fin(t,tTc-0.2,0.5)*out,dy:30});
    baTagAt(ctx,S,1574,700,"fields dry",BA_RED,{a:fin(t,tDr,0.5)*out,dy:-60});
    ctx.restore();eaYear(ctx,90,90,"Khorasan · the 9th century",CLAY,fin(t,0.6,0.6)*(1-fin(t,tSw,0.4)));}
  else{const tAb=w("court","Abdallah"),tDs=w("court","disputes"),tLb=w("books","law books"),tSn=w("books","said nothing"),tNr=w("books","no rule"),tKr=w("needed","know the rules"),tWd=w("needed","went dry");
    const tKh=w("gather","Khorasan"),tIq=w("gather","Iraq"),tOb=w("gather","one book"),tSj=w("judged","judged"),tHi=w("later","historian"),tSt=w("later","still judged"),tWl=w("home","where to look");
    const late=fin(t,tL-0.2,1.6);
    ctx.save();focus(ctx,t,[[0,1110,640,1.2],[tLb-0.8,930,640,1.2],[tSa-0.4,980,620,1.15],[tCa-0.3,900,790,2.3],[tJ-0.2,1000,640,1.2],[tH-0.3,980,600,1.0]],1.8);
    d9_court(ctx,t,{books:fin(t,tLb-0.3,0.5)*(1-fin(t,tNd,0.6))+0.6*pulseAt(t,tSn,1.4),dusk:0.2+0.5*late});
    // who's in the court, drawn from the furthest to the nearest: the governor on the dais, who turns from the people who come to the
    // table as the scholars gather (gone, two hundred years on); then the table and its book; then everyone in the courtyard
    const Q=[[D9_DS,()=>d9_fig(ctx,1046,D9_DS,0.58,{dress:"robe",head:"turban",f:lerp(1,-1,ease(fin(t,tSa+0.6,0.4))),a:1-late,rimA:0.75,t})]];
    Q.push([D9_FL-0.5,()=>{d9_table(ctx,D9_DESK[0],D9_DESK[1]);d9_slot(ctx,D9_DESK[0]-92,D9_DESK[1]-58,184,50,BA_RED,fin(t,tKr-0.2,0.5)*(1-fin(t,tOb-0.4,0.4)),"rules?");
      arrive(ctx,D9_DESK[0],D9_DESK[1]-16,t,tOb-0.2,()=>d9_codex(ctx,D9_DESK[0],D9_DESK[1]-2,124,{p:clamp((t-tOb)/3.2,0,1),old:late,hi:pulseAt(t,tCa+0.4,2.0)+0.7*fin(t,tH-0.2,0.8)}),{dy:-10});}]);
    // the disputes, two by two: each pair comes in from the right and waits its turn, facing the governor; as the scholars are called,
    // the pairs turn and go, the furthest back first
    const tA=[-9,tSw+0.4,tAb-0.6,tDs-0.6];
    D9_PAIRS.forEach((xs,k)=>xs.forEach((x1,j)=>{const t0=tA[k]+j*0.3,x0=2080+j*70,[xa,ba]=d9_go(t,x0,x1,t0,(x0-x1)/250),tl=tSa-0.3+(3-k)*0.3+(1-j)*0.15,turn=ease(fin(t,tl,0.4)),[xb,bb]=d9_go(t,x1,x1+1100,tl+0.3,4.2);
      if(t<t0||xb>2200)return;const on=t>=tl+0.3;Q.push([D9_FL,()=>d9_fig(ctx,on?xb:xa,D9_FL+(on?bb:ba),D9_S,Object.assign({f:lerp(-1,1,turn),t},D9_DRESS[k][j]))]);}));
    // the scholars: of Khorasan from the right and of Iraq from the left, to the table. From then on, only the judge stays, his hand on
    // the book; two hundred years on, another judge
    const gone=fin(t,tJ-0.6,0.5);
    D9_KHOR.forEach((x1,j)=>{const t0=tKh-2.6+j*0.35,x0=2080+j*80,[x,b]=d9_go(t,x0,x1,t0,(x0-x1)/250);if(t<t0)return;Q.push([D9_FL+20,()=>d9_fig(ctx,x,D9_FL+20+b,D9_S,{dress:"robe",head:j===1?"cap":"turban",f:-1,a:1-gone,t})]);});
    D9_IRAQ.forEach((x1,j)=>{const t0=tIq-3.0+j*0.35,x0=-200-j*80,[x,b]=d9_go(t,x0,x1,t0,(x1-x0)/250);if(t<t0)return;const judge=j===1,a=judge?1-fin(t,tL-0.3,0.5):1-gone,k=judge?ease(fin(t,tJ-0.4,0.45)):0;
      const hand=[x+52*D9_S,D9_FL+20-114*D9_S],to=[D9_DESK[0]-34,D9_DESK[1]-12];Q.push([D9_FL+20,()=>d9_fig(ctx,x,D9_FL+20+b,D9_S,{dress:"robe",head:"turban",f:1,a,t,reach:k>0.01?[lerp(hand[0],to[0],k),lerp(hand[1],to[1],k)]:null})]);});
    const nj=fin(t,tL+0.4,0.5);if(nj>0.01)Q.push([D9_FL+20,()=>d9_fig(ctx,D9_IRAQ[1],D9_FL+20,D9_S,{dress:"robe",head:"cap",f:1,a:nj,t,reach:[D9_DESK[0]-36,D9_DESK[1]-12]})]);
    // the disputes judged by what the book says: a pair at a time before the judge, each settled
    [0,1,2,3].forEach(i=>{const t0=i<3?tJ+0.1+i*1.35:tL+0.9,t1=i<3?t0+1.25:tH-0.3,a=fin(t,t0,0.4)*(1-fin(t,t1,0.4));if(a<=0.01)return;
      D9_JUDGE.forEach((x,j)=>Q.push([D9_FL,()=>d9_fig(ctx,x,D9_FL,D9_S,Object.assign({f:-1,a,t},D9_DRESS[4+i][j]))]));
      if(i<3)Q.push([D9_FL+1,()=>{const g=fin(t,t0+0.6,0.3)*(1-fin(t,t1,0.4));if(g>0.01)kt_gtick(ctx,(D9_JUDGE[0]+D9_JUDGE[1])/2,628,20,g);}]);});
    // a historian, two hundred years on, with the book he writes
    const ha=fin(t,tHi-0.5,0.5);if(ha>0.01)Q.push([D9_FL+36,()=>{d9_fig(ctx,580,D9_FL+36,D9_S,{dress:"robe",head:"turban",f:1,a:ha,t,reach:[636,D9_FL+36-114]});withA(ctx,ha,()=>{ctx.fillStyle="rgba(238,224,196,1)";ctx.fillRect(628,D9_FL+36-130,40,18);ctx.fillStyle="rgba(120,62,42,1)";ctx.fillRect(626,D9_FL+36-113,44,4);});}]);
    // and everyone who needs the rules, coming to the book from both sides
    D9_ALL.forEach(([x1,y,o,sd],i)=>{const t0=tH-0.2+i*0.3,x0=sd<0?-200:2160,[x,b]=d9_go(t,x0,x1,t0,Math.abs(x1-x0)/260);if(t<t0)return;
      Q.push([y,()=>{d9_fig(ctx,x,y+b,D9_S*(y/D9_FL),Object.assign({f:sd<0?1:-1,t},o));const lk=clamp((t-tWl+0.4-i*0.12)/0.9,0,1);
        if(lk>0)d9_trace_(ctx,[[x,y-240*D9_S],[lerp(x,D9_DESK[0],0.5),Math.min(y,D9_DESK[1])-150],[D9_DESK[0],D9_DESK[1]-24]],lk,D9_LAMP,{dash:[6,9],a:0.75*(1-fin(t,B+2.5,1.0)),lw:2.5,nohead:1});}]);});
    Q.sort((p,q)=>p[0]-q[0]).forEach(q=>q[1]());
    // what the narration names, where it is
    const off=1-fin(t,tNd-0.2,0.5);
    baTagAt(ctx,S,1046,604,"Abdallah ibn Tahir · governor",TRUST,{a:fin(t,tAb-0.2,0.5)*(1-fin(t,tLb-0.6,0.5)),dy:-18});
    baTagAt(ctx,S,1480,640,"disputes over qanats",BA_RED,{a:fin(t,tDs-0.2,0.5)*(1-fin(t,tLb-0.6,0.5)),dy:-18});
    baTagAt(ctx,S,590,474,"the law books",CLAY,{a:fin(t,tLb-0.2,0.5)*off});
    baTagAt(ctx,S,590,474,"nothing on qanats",BA_RED,{a:fin(t,tSn-0.1,0.5)*off,dy:52});
    arrive(ctx,1196,616,t,tNr-0.2,()=>withA(ctx,1-fin(t,tNd+0.6,0.5),()=>{glass(ctx,1162,582,68,68,34,BA_RED,{glow:14,ea:0.8,fill:"rgba(24,12,10,0.94)"});T(ctx,"?",1196,632,{w:800,size:44,align:"center",color:rgba(BA_RED,1)});}),{dy:-10});
    baTagAt(ctx,S,1190,640,"scholars of Khorasan",CLAY,{a:fin(t,tKh+0.2,0.5)*(1-fin(t,tCa-0.6,0.4)),dy:-18});
    baTagAt(ctx,S,761,640,"from Iraq",CLAY,{a:fin(t,tIq+0.2,0.5)*(1-fin(t,tCa-0.6,0.4)),dy:-18});
    baTagAt(ctx,S,1191,580,"judged by the book",BA_OK,{a:fin(t,tSj-0.2,0.5)*(1-fin(t,tL-0.3,0.4)),dy:-24});
    baTagAt(ctx,S,580,690,"a historian",CLAY,{a:fin(t,tHi-0.2,0.5)*(1-fin(t,tH-0.4,0.4)),dy:-18});
    baTagAt(ctx,S,900,700,"still judged by it",BA_OK,{a:fin(t,tSt-0.2,0.5)*(1-fin(t,tH-0.4,0.4)),dy:-60});
    ctx.restore();
    eaYear(ctx,90,90,"Nishapur · the 9th century",CLAY,fin(t,tSw+0.9,0.6)*(1-fin(t,tL-0.3,0.4)));eaYear(ctx,90,90,"about 1050",CLAY,fin(t,tL+0.2,0.5)*(1-fin(t,tH-0.3,0.4)));
    // the field gone dry, beside the court, as the narration says why the rules were needed
    const ia=fin(t,tWd-0.6,0.5)*(1-fin(t,tSa-0.3,0.5));if(ia>0.01)withA(ctx,ia,()=>{const x=1400,y=110,ww=440,hh=256;glass(ctx,x,y,ww,hh,18,BA_RED,{glow:12,ea:0.8,fill:"rgba(20,12,10,0.95)"});
      ctx.save();rr(ctx,x+10,y+10,ww-20,hh-76,12);ctx.clip();ctx.translate(x+10,y+10);ctx.scale(0.44,0.44);ctx.translate(-1180,-560);ba_aerial(ctx,t,{flow:0.18,wet:BA_FIELDS.map(()=>0.1),warm:0.35});d9_chain2(ctx,t,{dug:1,flow:1});ctx.restore();
      T(ctx,"a field gone dry",x+ww/2,y+hh-24,{w:700,size:30,align:"center",color:rgba(BA_RED,1)});});
    // the book's name, as the camera comes close
    const nA=fin(t,tCa+0.5,0.5)*(1-fin(t,tJ-0.5,0.4));if(nA>0.01)withA(ctx,nA,()=>{glass(ctx,640,140,640,176,22,D9_LAMP,{glow:16,ea:0.85,fill:"rgba(20,14,10,0.93)"});
      T(ctx,"Kitab-i Qani",960,224,{w:800,size:58,align:"center",color:rgba(INK,0.98)});T(ctx,"the book on qanats",960,280,{w:700,size:32,align:"center",color:rgba(D9_LAMP,1)});});
    // one home, written once
    const tOh=w("home","one home"),tWo=w("home","written once");
    const oh=fin(t,tOh-0.3,0.6)*(1-fin(t,B+1.0,0.8));if(oh>0.01){const g=ctx.createRadialGradient(960,490,10,960,490,340);g.addColorStop(0,"rgba(14,8,4,"+(0.6*oh)+")");g.addColorStop(1,"rgba(14,8,4,0)");ctx.fillStyle=g;ctx.fillRect(620,150,680,680);}
    arrive(ctx,960,440,t,tOh-0.2,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.9)";ctx.shadowBlur=22;T(ctx,"one home",960,462,{w:800,size:76,align:"center",color:rgba(TRUST,1)});ctx.restore();},{dy:14,from:0.9});
    arrive(ctx,960,520,t,tWo-0.2,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.9)";ctx.shadowBlur=18;T(ctx,"written once",960,530,{w:700,size:40,align:"center",color:rgba(D9_LAMP,1)});ctx.restore();},{dy:10});}
  dark(ctx,S,fin(t,tSw,0.6)*(1-fin(t,tSw+0.6,0.7)));
  fadeIn(ctx,S,t,1.4);vign(ctx,S);
  baTitle(ctx,S,t,B+1.0,"Rules with a home","objects, owners and rules","Film 6 of 7");});
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
// place where its home should be, beside Khorasan's book on qanats.
scene("five",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  const tFo=w("four","four more"),tW=[0.5,w("where","retail code"),w("where","settings"),w("where","notes"),w("where","spreadsheet")],tWhy=w("how","says why"),tHow=w("how","each say how"),tDif=w("how","differently"),tNone=w("how","None of them"),tO=c("once"),tTa=w("once","Khorasan"),tOo=w("once","one home");
  ctx.save();drift(ctx,t,sc,{z:0.025,y:440});
  person(ctx,"tomas",230,1030,0.78,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,0.6,3.2)+d9_pz(t,tO-0.2,tO+2.6),expr:t>tNone-0.3&&t<tO?"concerned":"calm"});
  const dW=332,dH=262,dx=i=>84+i*352,dy=176;
  D9_DOCS.forEach(([k,ti,ln],i)=>{const why=i===1,dim=fin(t,tNone-0.2,0.6)*0.35*(1-fin(t,B-1,1));arrive(ctx,dx(i)+dW/2,dy+dH/2,t,tW[i]-0.15,()=>withA(ctx,1-dim,()=>d9_doc(ctx,k,dx(i),dy,dW,dH,ti,ln,{rot:(hash(i,940)-0.5)*0.03,hi:why?pulseAt(t,tWhy,1.6):pulseAt(t,tDif+0.15*Math.max(0,i-2),1.2)*0.9,hiCol:why?MOT:TRUST})),{dy:-16});
    const lab=why?"why":"how",col=why?MOT:[255,214,140];arrive(ctx,dx(i)+dW/2,dy+dH+44,t,why?tWhy-0.1:tHow+0.1+0.12*Math.max(0,i-1),()=>tag(ctx,dx(i)+dW/2,dy+dH+44,lab,col,{align:"center",size:30}),{dy:8});});
  // none of them is its home
  const sl=fin(t,tNone-0.1,0.6);d9_slot(ctx,700,606,420,140,TRUST,sl,"its home?");
  D9_DOCS.forEach((_,i)=>{const p=clamp((t-tNone-0.1-i*0.08)/0.7,0,1);if(p<=0)return;const x0=dx(i)+dW/2,y0=dy+dH+70,x1=lerp(740,1080,i/4),y1=600;ctx.save();ctx.globalAlpha*=0.5*(1-fin(t,tO,0.6));ctx.setLineDash([6,8]);ctx.strokeStyle=rgba(TRUST,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,0.82*ease(p)),lerp(y0,y1,0.82*ease(p)));ctx.stroke();ctx.restore();});
  // what Khorasan had for qanats: one book, where everyone looked
  arrive(ctx,1460,668,t,tTa-0.3,()=>d9_bookMini(ctx,1460,668,t,1),{dy:-14});
  arrive(ctx,1460,812,t,tOo-0.2,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.85)";ctx.shadowBlur=18;T(ctx,"one home",1460,846,{w:800,size:52,align:"center",color:rgba(TRUST,1)});ctx.restore();},{dy:12,from:0.9});
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
/* ---------- 9. A rule in ArchiMate 4 ---------- */
// Where the standard puts a rule. The three rules, on their cards: each is a requirement, one of the motivation elements ArchiMate 4
// lists, and the parallelogram on each card is the requirement's symbol. ArchiMate has no element called a rule; the map makes data
// rules and business rules two kinds of requirement, each a specialisation of it. Then retail's rule, in the middle, with what's
// linked to it, each link drawn as ArchiMate draws it and each part in the words of the set form (chapter 10): its reason, a driver,
// by an influence; its home, billing in meter to cash, by a realisation; its owner and the data objects it applies to, by
// associations. The standard says where a rule sits; how it's checked comes from the rule.
const D9_ST=[["RUL-020",D9_R20,D9_NET,80],["RUL-021",D9_R21,D9_NET,700],["RUL-022",D9_R22,D9_RET,1320]],D9_SY=450,D9_SW=520;
// retail's rule in the middle: its top-left corner and scale; the motivation elements' row, and where the requirement's chip settles,
// above the rule's corner; the driver above, the steps of meter to cash below, the owner on the left and the data objects on the right;
// and the place for its checks, outside the map
const D9_HX=674,D9_HY=330,D9_HK=1.1,D9_MY=150,D9_RQ=[787,295],D9_DV=[660,70,600,104],D9_VSY=700,D9_VSH=110,D9_VSS=[["read",543,290],["bill",810,300],["paid",1087,280]],D9_OB=[1500,330,330,90,120],
  D9_CK=[1466,690,330,100];
scene("std",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tA4=w("req","ArchiMate 4"),tRq=w("req","a requirement"),tMo=w("req","motivation elements"),tPa=w("sym","parallelogram"),tSy=w("sym","symbol"),
    tNo=w("kinds","no element"),tRu=w("kinds","called a rule"),tDr=w("kinds","data rules"),tBr=w("kinds","business rules"),tTk=w("kinds","two kinds"),
    tD=c("drv"),tRs=w("drv","Its reason"),tIn=w("drv","an influence"),tRc=w("drv","retail code"),
    tSt=w("real","the step"),tRl=w("real","a realisation"),tBi=w("real","billing"),tMc=w("real","meter to cash"),
    tOw=w("assoc","Its owner"),tDo=w("assoc","the data objects"),tAs=w("assoc","an association"),
    tWh=w("where","where a rule"),tNh=w("where","not how"),tCk=w("where","The checks"),tFr=w("where","from the rule");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  // from the three rules to retail's, in the middle: what was about all three leaves as it moves
  const tB=tD-1.4,m=ease(fin(t,tB+0.2,1.5)),gA=1-fin(t,tB-0.2,0.6);
  arrive(ctx,186,96,t,tA4-0.2,()=>T(ctx,"ArchiMate 4",80,108,{f:"mono",w:600,size:32,color:rgba(BAC,1)}),{dy:8});
  const MW=D9_MOTS.map(([l])=>tw(ctx,l,30,700)+86);
  // the three rules: each card lights as its kind is named, and its parallelogram as the symbol is; then each card's rises to the
  // requirement's chip
  const hs=D9_ST.map(([id,txt])=>d9_rule(ctx,0,0,D9_SW,id,txt,null,{a:0,size:28})),hH=hs[2]*D9_HK,
    hiH=pulseAt(t,tIn+0.5,1.2)+pulseAt(t,tRl+0.5,1.2)+pulseAt(t,tAs+0.5,1.2)+pulseAt(t,tWh+0.8,1.6)+pulseAt(t,tFr,1.4);
  D9_ST.forEach(([id,txt,side,x],i)=>{const h=hs[i],hi=(i?pulseAt(t,tBr+0.1+(i-1)*0.2,1.4):pulseAt(t,tDr+0.1,1.4)),gp=pulseAt(t,tPa+0.2+i*0.3,1.2);let gx=x+D9_SW-36,gy=D9_SY+36;
    if(i<2){const out=ease(fin(t,tB-0.3+i*0.1,0.7));if(out>=1)return;arrive(ctx,x+D9_SW/2,D9_SY+h/2,t,0.3+i*0.15,()=>withA(ctx,1-out,()=>d9_rule(ctx,x,D9_SY+70*out,D9_SW,id,txt,side,{size:28,hi})),{dy:-12});}
    else{const X=lerp(x,D9_HX,m),Y=lerp(D9_SY,D9_HY,m),k=lerp(1,D9_HK,m);ctx.save();ctx.translate(X,Y);ctx.scale(k,k);arrive(ctx,D9_SW/2,h/2,t,0.6,()=>d9_rule(ctx,0,0,D9_SW,id,txt,side,{size:28,hi:hi+hiH}),{dy:-12});ctx.restore();gx=X+k*(D9_SW-36);gy=Y+k*36;}
    if(gp>0.01){glow(ctx,gx,gy,56,MOT,0.85*gp);ring(ctx,gx,gy,30,MOT,gp,2.4);}
    const fq=clamp((t-tSy+0.75-i*0.08)/0.8,0,1);if(fq>0&&fq<1){const e=ease(fq),ex=960-MW[2]/2+36,px=lerp(gx,ex,e),py=lerp(gy,D9_MY,e)-Math.sin(e*Math.PI)*60;
      glow(ctx,px,py,30,MOT,0.7*Math.sin(Math.PI*fq));withA(ctx,Math.sin(Math.PI*fq),()=>d9_reqGlyph(ctx,px,py,16,mix(MOT,INK,0.3)));}});
  // the motivation elements: the requirement first, then the others, out from it; they step back as the parallelogram is named
  const MX=[];MX[2]=960;MX[1]=960-MW[2]/2-24-MW[1]/2;MX[0]=MX[1]-MW[1]/2-24-MW[0]/2;MX[3]=960+MW[2]/2+24+MW[3]/2;MX[4]=MX[3]+MW[3]/2+24+MW[4]/2;
  D9_MOTS.forEach(([l,g],i)=>{if(i===2)return;const a=gA*(1-0.45*fin(t,tPa-0.3,0.8));arrive(ctx,MX[i],D9_MY,t,tMo-0.25+Math.abs(i-2)*0.14,()=>d9_why(ctx,MX[i],D9_MY,l,g,a,{}),{dy:-10});});
  // ArchiMate has no element called a rule
  const nX=MX[4]+MW[4]/2+110;arrive(ctx,nX,D9_MY,t,tNo-0.2,()=>{d9_noEl(ctx,nX,D9_MY,"rule",gA,clamp((t-tRu-0.2)/0.5,0,1));withA(ctx,gA*fin(t,tRu+0.4,0.5),()=>tag(ctx,nX,D9_MY+68,"not an element",SOFT,{align:"center",size:28}));},{dy:-10});
  // the map's two kinds of requirement, the data rule and the business rule, each a specialisation of it
  [["data rule",340,tDr,925],["business rule",1270,tBr,995]].forEach(([l,x,t0,ex])=>{arrive(ctx,x,318,t,t0-0.2,()=>d9_why(ctx,x,318,l,"requirement",gA,{hi:pulseAt(t,t0+0.1,1.4)}),{dy:-10});
    d9_spec(ctx,x,289,ex,D9_MY+30,MOT,clamp((t-t0-0.1)/0.7,0,1),gA);});
  d9_relName(ctx,960,262,"specialisation",gA*fin(t,tTk-0.3,0.5),{align:"center"});
  // the requirement: in the middle of the row, then settled above retail's rule
  const rqx=lerp(960,D9_RQ[0],m),rqy=lerp(D9_MY,D9_RQ[1],m);arrive(ctx,rqx,rqy,t,tRq-0.15,()=>d9_why(ctx,rqx,rqy,"requirement","requirement",1,{hi:pulseAt(t,tRq+0.2,1.4)+pulseAt(t,tSy,1.4)+0.6*pulseAt(t,tTk+0.3,1.2)}),{dy:-10});
  glow(ctx,rqx-MW[2]/2+36,rqy,50,MOT,0.85*pulseAt(t,tSy,1.2));
  // its reason: a driver, linked by an influence
  const[dx,dy,dw,dh]=D9_DV;arrive(ctx,dx+dw/2,dy+dh/2,t,tRs+0.3,()=>d9_hubEl(ctx,dx,dy,dw,dh,"reason · driver","the regulator's retail code",MOT,"driver",{hi:pulseAt(t,tRc,1.4)+pulseAt(t,tWh+0.1,1.4)}),{dy:-12});
  d9_infl(ctx,960,dy+dh,960,D9_HY-2,MOT,clamp((t-tIn+0.1)/0.7,0,1),1);d9_relName(ctx,984,262,"influence",fin(t,tIn,0.5));
  // its home: the step that applies it, linked by a realisation: billing, in meter to cash
  withA(ctx,fin(t,tSt-0.3,0.6),()=>{T(ctx,"home · value stream",515,D9_VSY+46,{f:"mono",w:500,size:28,align:"right",color:rgba(STR,1)});T(ctx,"meter to cash",515,D9_VSY+88,{w:700,size:30,align:"right",color:rgba(INK,0.97)});});
  D9_VSS.forEach(([nm,x,w_],i)=>arrive(ctx,x+w_/2,D9_VSY+D9_VSH/2,t,tSt-0.2+i*0.15,()=>d9_chev(ctx,x,D9_VSY,w_,D9_VSH,nm,{first:i===0,size:30,a:i===1?1:0.62,hi:i===1?pulseAt(t,tBi,1.4)+pulseAt(t,tWh+0.25,1.4):0.4*pulseAt(t,tMc,1.2)}),{dy:-12}));
  d9_real(ctx,958,D9_VSY,958,D9_HY+hH+2,MOT,clamp((t-tRl+0.1)/0.7,0,1),1);d9_relName(ctx,982,650,"realisation",fin(t,tRl,0.5));
  // its owner, and the data objects it applies to, linked by associations
  const opw=tw(ctx,"owner · head of retail",28,700)+70,ox0=270+opw/2;
  arrive(ctx,270,435,t,tOw-0.1,()=>d9_owner(ctx,270,435,"head of retail",1,{align:"center",hi:pulseAt(t,tOw+0.3,1.4)+pulseAt(t,tWh+0.4,1.4)}),{dy:8});
  const[ox,oy,ow,oh,og]=D9_OB;withA(ctx,fin(t,tDo-0.2,0.5),()=>T(ctx,"applies to · data objects",ox+ow,oy-18,{f:"mono",w:500,size:28,align:"right",color:rgba(INF,1)}));
  [["bill",tDo],["meter reading",tDo+0.15]].forEach(([nm,t0],i)=>arrive(ctx,ox+ow/2,oy+i*og+oh/2,t,t0-0.1,()=>d9_obj(ctx,ox,oy+i*og,ow,oh,nm,null,{hi:pulseAt(t,t0+0.3,1.2)+pulseAt(t,tWh+0.55+i*0.1,1.4)}),{dy:-10}));
  const pa=clamp((t-tAs+0.1)/0.7,0,1),hR=D9_HX+D9_SW*D9_HK;d9_assoc(ctx,ox0+2,435,D9_HX-2,435,MOT,pa,1);d9_assoc(ctx,hR+2,395,ox-2,oy+oh/2,MOT,pa,1);d9_assoc(ctx,hR+2,475,ox-2,oy+og+oh/2,MOT,pa,1);
  d9_relName(ctx,(ox0+D9_HX)/2,404,"association",fin(t,tAs,0.5),{align:"center"});d9_relName(ctx,(hR+ox)/2,447,"association",fin(t,tAs+0.1,0.5),{align:"center"});
  // where a rule sits: a light along each link, into the rule
  if(t>tWh-0.2)[[960,dy+dh,960,D9_HY],[958,D9_VSY,958,D9_HY+hH],[ox0,435,D9_HX,435],[ox,oy+oh/2,hR,395],[ox,oy+og+oh/2,hR,475]].forEach(([x0,y0,x1,y1],i)=>{const f=clamp((t-tWh-0.1-i*0.15)/0.9,0,1);
    if(f>0&&f<1)glow(ctx,lerp(x0,x1,ease(f)),lerp(y0,y1,ease(f)),32,MOT,0.85*Math.sin(Math.PI*f));});
  // not how it's checked: a place the standard leaves open; the checks come from the rule
  const[cx_,cy_,cw,ch]=D9_CK,ax=cx_-8,ay=cy_+ch/2,ap=clamp((t-tCk+0.1)/0.8,0,1);
  arrive(ctx,cx_+cw/2,cy_+ch/2,t,tNh-0.1,()=>d9_checks(ctx,cx_,cy_,cw,ch,fin(t,tFr-0.2,0.6),1,{hi:pulseAt(t,tFr+0.2,1.4)}),{dy:-8});
  if(ap>0){d9_trace_(ctx,[[1238,546],[ax,ay]],ap,MOT,{lw:3,nohead:ap>=1});if(ap>=1){const an=Math.atan2(ay-546,ax-1238);ctx.save();ctx.strokeStyle=rgba(MOT,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
    ctx.moveTo(ax-Math.cos(an-0.45)*16,ay-Math.sin(an-0.45)*16);ctx.lineTo(ax,ay);ctx.lineTo(ax-Math.cos(an+0.45)*16,ay-Math.sin(an+0.45)*16);ctx.stroke();ctx.restore();}}
  ctx.restore();vign(ctx,S);});
/* ---------- 10. Test the data, track the business ---------- */
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
  // the tests dim to half before they fold into their pills, so none of their words is read smaller than it's drawn
  D9_GEN.forEach(([ti,ls],i)=>{const y=D9_GY[i],t0=tGn[i],my=y+111,pl=D9_TP[i],px=pX[i];
    d9_feed(ctx,D9_PY,my,clamp((t-t0+0.2)/0.6,0,1),1-cl);
    if(cl<0.99){ctx.save();const k=lerp(1,0.25,cl);ctx.translate(lerp(1435,px,cl),lerp(my,D9_PY,cl));ctx.scale(k,k);ctx.translate(-1435,-my);
      withA(ctx,(1-cl)*(1-0.45*fin(t,tAr-0.65,0.3)),()=>arrive(ctx,1435,my,t,t0-0.1,()=>d9_gen(ctx,1010,y,850,222,ti,ls,{p:clamp((t-t0-0.1)/1.4,0,1),hi:pulseAt(t,t0+0.3,1.4),lock:i===0?pulseAt(t,tBh,1.6):0}),{dy:-14}));ctx.restore();}
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
/* ---------- 11. Generally, an ontology ---------- */
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
    tag(ctx,370,196,"one map",BAC,{align:"center",size:30});withA(ctx,fin(t,tOm-0.2,0.5),()=>tag(ctx,1350,100,"one map, many views",BAC,{align:"center",size:28}));});
  D9_VW.forEach(([ti,sub,g],i)=>{const y=vy0+i*(vh+vg),t0=[tGl,tMo,tOt,tCh][i],q=fin(t,t0-0.3,0.5)*(1-gone);if(q<=0.01)return;const fp=clamp((t-t0+0.3)/0.6,0,1);
    withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(BAC,0.8);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(716,466);ctx.lineTo(lerp(716,vx-6,ease(fp)),lerp(466,y+vh/2,ease(fp)));ctx.stroke();ctx.restore();});
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
/* ---------- 12. Back in Khorasan ---------- */
// The wall again, toured left to right: the household's bill corrected and the 1,900 found; the two rules, confirmed by their owners;
// Khorasan's book, where everyone looked for the rules on qanats; Tomás's note answered; then the whole wall, and the next question.
const D9_E21=[590,110,560],D9_E22=[590,400,560],D9_ETC=[590,676,560,186];
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  const tBk=w("refund","forty back"),t19=w("refund","nineteen hundred"),tFc=w("refund","found and corrected"),tC=c("confirm"),tG=w("confirm","Grace"),tHr=w("confirm","head of retail"),
    tT=c("book"),tPd=w("book","looked"),tTw=w("book","one book"),tA=c("answer"),tAn=w("answer","an answer"),tGf=w("owner","generated from it"),tN=c("next"),tNx=w("next","Next:");
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
  // Khorasan: the rules on qanats in one book, where everyone looked
  arrive(ctx,D9_ETC[0]+D9_ETC[2]/2,D9_ETC[1]+D9_ETC[3]/2,t,tT-0.6,()=>d9_bookCard(ctx,...D9_ETC,t,{a:zR,open:fin(t,tPd-0.2,0.5),once:fin(t,tTw-0.4,0.5),hi:pulseAt(t,tPd,1.4)}),{dy:-14});
  // Tomás's note, and its answer; then the next question
  person(ctx,"tomas",1790,1030,0.74,{t,pose:"stand",pose2:"explain",mix:d9_pz(t,tA,tA+2.6)});
  arrive(ctx,1480,150,t,tA-1.0,()=>sticky(ctx,1480,150,500,120,D9_Q,{col:NOTEC[0],size:32,st:fin(t,tAn+0.4,0.5),rot:-0.03}),{dy:-20});
  arrive(ctx,1480,440,t,tAn-0.2,()=>sticky(ctx,1480,440,540,300,D9_A,{col:NOTEC[0],size:30,p:clamp((t-tAn)/(tGf-tAn+0.8),0,1),rot:0.012}),{dy:-30,from:1.06});
  arrive(ctx,1460,770,t,tNx-0.1,()=>sticky(ctx,1460,770,460,150,D9_NEXT,{col:NOTEC[0],size:30,st:0,rot:0.03}),{dy:-30,from:1.06});
  ctx.restore();vign(ctx,S);
  baEnd(ctx,S,t,B+0.8,"Rules with a home","Write each rule once, where it applies, with an owner and a reason.","Film 6 of 7");});

// where the chapters meet (From words to data's joins.js): the five questions go from the screen to the wall, with the script in
// another place, so they open on a cut; why carries on from the split, so the camera carries on; the standard's three rules and the
// rule's form are later pictures with the same rules elsewhere, so what was there leaves first, over the bare screen
const CHAPTER_JOINS={cut:["five"],glide:["why"],leave:["std","checks"],bare:(ctx,S,t)=>{setScreen(ctx,S);bg2(ctx);motes(ctx,t);vign(ctx,S);}};
