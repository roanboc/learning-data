/* ===== Written once: scenes =====
   Eight chapters, as in ../script.md. Paris, 1859: one tuning fork kept as the home of the note A, and everything tuned from it;
   four copies of a definition, three drifted; what goes where; written once, shown everywhere; diagrams that can't drift;
   one direction, out to the catalog; the next version; and the loop of ten steps, closed and starting again.
   Motion (the series' helpers in shared/src/weeds.js): every shot drifts slowly (drift), things arrive with a spring (arrive),
   dust gives depth (motes), and where two chapters share a thing it carries across the cut instead of fading: the four copies
   and the conceptual model (2 → 3), the conceptual model into the chain (3 → 4), the wiki card (4 → 5), the two diagrams'
   places (5), the catalog (6 → 7) and the loop (8).
   Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

const WR_DEF="A qualification the university confers, such as a graduate certificate or a master, for a set number of credit points. When it's conferred on a learner, it's a credential too.";
const WR_C1=["  - name: award","    definition: >","      A qualification the university confers, such as a graduate certificate or a master, for","      a set number of credit points. When it's conferred on a learner, it's a credential too.","    owner: Mei Tanaka, registrar's office"];
// the four copies, where chapter 2 leaves them and chapter 3 picks them up
const WR_CP={wiki:[80,200,560,220],yaml:[80,450,560,200],cat:[80,670,560,180],tip:[690,200,500,250],dash:[690,520,500,300],con:[1226,200,630]};
const WR_TXT={wiki:"A qualification the university confers on paper, such as a graduate certificate or a master, for a set number of credit points.",
  yaml:"A qualification the university confers, such as a graduate certificate or a master. [gap]",cat:"A degree the university confers, for a set number of credit points."};
function wr_copies(ctx,t,o){const P=WR_CP,dx=o.dx||0,a=o.a==null?1:o.a;if(a<=0.01)return;
  [["wiki","wiki"],["yaml","YAML description"],["cat","catalog"]].forEach(([k,kind],i)=>{const[x,y,w,h]=P[k],q=o.in?o.in[i]:1;
    arrive(ctx,x+w/2+dx,y+h/2,t,o.t0?o.t0[i]:-9,()=>wr_copy(ctx,x+dx,y,w,h,kind,WR_TXT[k],{a:a,amb:o.amb[i],hl:o.hl[i],gapA:k==="yaml"?o.amb[1]:0,ghost:o.ghost||0,pin:o.pin?o.pin[i]:0}),{dy:30});});
  const[dx0,dy0,dw,dh]=P.dash,[tx,ty,tw_,th]=P.tip;
  arrive(ctx,dx0+dw/2+dx,dy0+dh/2,t,o.t0?o.t0[3]:-9,()=>{wr_dash(ctx,dx0+dx,dy0,dw,dh,t,{a});wr_tip(ctx,tx+dx,ty,tw_,th,dx0+dw-24-tw(ctx,"award",19,700)/2+dx,dy0+26,WR_DEF,{a:a*(o.tipA==null?1:o.tipA)});
    if(o.pin&&o.pin[3]>0)kt_flag(ctx,tx+tw_-22+dx,ty-8,0.9,o.pin[3]*a);},{dy:30});}

/* ---------- 1. One note ---------- */
const WR_FX=[560,960,1360],WR_OFF=[-30,26,4];
scene("fork",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.04,y:460});
  const cL=c("law"),cC=c("copies"),cT=c("today"),cB=c("bridge");
  const outA=1-fin(t,cL-0.4,0.7),outC=1-fin(t,cC-0.3,0.7),outT=1-fin(t,cT-0.3,0.7),outO=1-fin(t,cB-0.3,0.8);
  // the table, then the stage of today's orchestra
  wr_table(ctx,640,t,1-fin(t,cT-0.2,0.8)+fin(t,cB,1.0));
  if(t>cT-0.4&&t<cB+1){withA(ctx,fin(t,cT-0.2,0.8)*outO,()=>{const g=ctx.createLinearGradient(0,760,0,H);g.addColorStop(0,"#3a2616");g.addColorStop(1,"#120a05");ctx.fillStyle=g;ctx.fillRect(0,760,W,H-760);
    const sp=ctx.createRadialGradient(960,300,40,960,520,900);sp.addColorStop(0,"rgba(255,226,170,0.14)");sp.addColorStop(1,"rgba(255,226,170,0)");ctx.fillStyle=sp;ctx.fillRect(0,0,W,H);});}
  // the 1850s: three forks from three cities, three notes that don't line up, all creeping higher
  yearTag(ctx,120,110,"1850s · the note A",CLAY,fin(t,0.3,0.6)*outA);
  if(outA>0.01){const rise=40*ease(fin(t,w("drift","creeping"),1.2)),sl=-260*ease(1-outA);
    withA(ctx,outA,()=>{WR_FX.forEach((x,i)=>{const t0=0.5+i*0.45,rg=Math.max(0,1-(t-t0)/3)*fin(t,t0,0.1);
      arrive(ctx,x+sl,560,t,t0-0.3,()=>{wr_block(ctx,x+sl,662,1);wr_fork(ctx,x+sl,662,0.95,t,{ring:rg,ph:i});tag(ctx,x+sl,744,["one city","another","a third"][i],CLAY,{align:"center",size:20});},{dy:20,from:0.94});
      wr_wave(ctx,180,1740,300+WR_OFF[i]-rise-i*4,mix(WR_LINE,[[255,200,150],[255,236,190],[230,210,255]][i],0.6),fin(t,t0+0.2,1.0)*0.85,t,{wl:[40,47,54][i],amp:6,lw:2.2});});
      withA(ctx,fin(t,w("drift","different"),0.5),()=>T(ctx,"a different pitch in every city",960,200,{w:700,size:30,align:"center",color:rgba(PARCH,1)}));
      arrive(ctx,1780,260,t,w("drift","creeping"),()=>{arrowTo(ctx,1780,320,1780,214,TRUST,1,{head:14});tag(ctx,1780,170,"creeping higher",TRUST,{size:20,align:"center"});},{dy:20});});}
  // 1859, Paris: the decree, and one fork laid in its case
  const lawA=fin(t,cL-0.3,0.6)*outC;
  yearTag(ctx,120,110,"1859 · Paris",CLAY,lawA);
  arrive(ctx,440,410,t,cL,()=>withA(ctx,outC,()=>{wr_decree(ctx,180,150,520,520,t,1,clamp((t-cL)/2.2,0,1));}),{d:1.0,from:0.92,dy:30});
  arrive(ctx,440,712,t,w("law","decree"),()=>withA(ctx,outC,()=>tag(ctx,440,712,"fixed by decree",PARCH,{align:"center",size:20})),{dy:14});
  // the case: in the middle for the law, to the left for the copies, back to the middle at the bridge
  const mvC=ease(fin(t,cC-0.4,1.2)),bk=ease(fin(t,cB+0.2,1.0)),inT=1-fin(t,cT-0.3,0.6),cA=fin(t,w("law","tuning fork")-0.2,0.7)*Math.max(inT,fin(t,cB+0.3,0.8));
  const bt=ease(fin(t,B-0.5,1.2)),cx_=lerp(lerp(lerp(900,120,mvC),640,bk),690,bt),cy_=lerp(lerp(lerp(560,560,mvC),600,bk),800,bt),cw_=lerp(lerp(lerp(620,520,mvC),640,bk),540,bt),ch_=lerp(lerp(lerp(210,180,mvC),220,bk),130,bt);
  if(cA>0.01)arrive(ctx,cx_+cw_/2,cy_+ch_/2,t,w("law","tuning fork")-0.2,()=>wr_case(ctx,cx_,cy_,cw_,ch_,t,{a:cA,ring:Math.max(0,1-Math.abs(t-w("law","its home")-0.6)/1.2)*0.6}),{d:1.0,from:0.9,dy:20});
  arrive(ctx,1210,820,t,w("law","its home"),()=>withA(ctx,outC,()=>tag(ctx,1210,820,"one fork · its home",TRUST,{align:"center",size:20})),{dy:14});
  // the standard's note: one line of light, from the case across the room
  const stdA=fin(t,w("law","its home")+0.2,1.0)*inT*outO,SY=330;
  wr_wave(ctx,lerp(980,180,mvC),1760,SY,TRUST,stdA*0.9,t,{wl:46,amp:6,lw:2.6});
  // copies checked against it, one by one, each stamped; a violin tuned from one of them; no arrow back
  if(t>cC-0.5&&outT>0.01){const CX=[820,1000,1180,1360];withA(ctx,fin(t,cC-0.2,0.6)*outT,()=>{
    CX.forEach((x,k)=>{const t0=w("copies","checked")+k*0.55,st=ease(fin(t,t0,0.9)),off=[34,-26,18,-40][k];
      arrive(ctx,x,640,t,cC+k*0.18,()=>{wr_block(ctx,x,700,0.9);wr_fork(ctx,x,700,0.6,t,{ring:Math.max(0,1-(t-t0)/2)*fin(t,t0,0.1)*0.7,ph:k,mark:fin(t,t0+0.9,0.3)});},{dy:20,from:0.92});
      wr_wave(ctx,x-74,x+74,SY+off*(1-st)+60*(1-st),WR_LINE,fin(t,t0-0.2,0.4),t,{wl:46,amp:5,lw:2});
      wr_proof(ctx,x,560,fin(t,t0+0.9,0.2),fin(t,t0+0.9,0.35));});
    arrive(ctx,1090,790,t,w("copies","checked"),()=>tag(ctx,1090,790,"checked against it",PARCH,{align:"center",size:20}),{dy:14});
    const tv=w("copies","tuned from those"),vs=ease(fin(t,tv+0.3,1.2));
    arrive(ctx,1650,600,t,tv-0.3,()=>{wr_violin(ctx,1650,600,0.62,t,{rot:-0.35,vib:Math.max(0,1-(t-tv-0.3)/2.4)});},{d:0.9,dy:30,from:0.9});
    wr_wave(ctx,1560,1760,SY+50*(1-vs),WR_LINE,fin(t,tv,0.4),t,{wl:46,amp:5,lw:2});
    arrowTo(ctx,1420,560,1540,560,TRUST,fin(t,tv+0.2,0.4),{p:fin(t,tv+0.2,0.6),head:14});
    wr_noBack(ctx,1540,610,1420,610,fin(t,w("copies","never the other"),0.5));
    arrive(ctx,1650,820,t,tv,()=>tag(ctx,1650,820,"tuned from it",PARCH,{align:"center",size:20}),{dy:14});
    withA(ctx,fin(t,w("copies","never the other"),0.5),()=>T(ctx,"never the other way round",1180,210,{w:700,size:30,align:"center",color:rgba(TRUST,1)}));});}
  // today: an orchestra, every line settling onto the oboe's A
  if(t>cT-0.5&&outO>0.01){const PX=[250,500,740,960,1180,1420,1670],K=[0,0,3,2,3,1,1];withA(ctx,outO,()=>{
    yearTag(ctx,120,110,"today",CLAY,fin(t,cT,0.6));
    const ob=w("today","tunes"),oa=fin(t,ob-0.6,0.8);
    PX.forEach((x,i)=>{const t0=ob+0.4+Math.abs(i-3)*0.35,st=ease(fin(t,t0,1.0)),off=[40,-30,22,0,-24,34,-38][i];
      arrive(ctx,x,640,t,cT+0.1+i*0.12,()=>wr_player(ctx,x,780,1.05,K[i],t,{flip:i>3}),{dy:24,from:0.94});
      if(i!==3)wr_wave(ctx,x-90,x+90,SY+off*(1-st),WR_LINE,fin(t,cT+0.6+i*0.1,0.5)*0.8,t,{wl:46,amp:5,lw:2});});
    wr_wave(ctx,lerp(960,180,ease(fin(t,ob-0.6,1.6))),lerp(960,1740,ease(fin(t,ob-0.6,1.6))),SY,TRUST,oa,t,{wl:46,amp:6,lw:2.6});
    arrive(ctx,960,200,t,w("today","one note"),()=>T(ctx,"one note",960,200,{w:800,size:36,align:"center",color:rgba(PARCH,1)}),{from:0.9});});}
  // the bridge: the case comes back; its line drifts right, towards the present, and becomes a definition
  if(t>cB-0.5){const bp=ease(fin(t,w("bridge","kept in one place")-0.6,1.6));withA(ctx,fin(t,cB,0.8)*(1-fin(t,B-0.7,0.6)),()=>{
    wr_wave(ctx,1000,lerp(1000,1380,bp),400,TRUST,1,t,{wl:46,amp:6*(1-bp*0.5),lw:2.6});
    arrive(ctx,1600,400,t,w("bridge","kept in one place")+0.6,()=>{glass(ctx,1390,340,440,120,18,TRUST,{glow:18,ea:0.85,fill:"rgba(7,12,24,0.96)"});T(ctx,"award",1420,388,{f:"mono",w:500,size:24,color:rgba(TRUST,1)});
      T(ctx,"one definition",1420,430,{w:700,size:24});},{d:0.9,from:0.85});
    withA(ctx,fin(t,w("bridge","kept in one place"),0.5),()=>T(ctx,"kept in one place",960,200,{w:800,size:36,align:"center",color:rgba(PARCH,1)}));
    withA(ctx,fin(t,w("bridge","everything else"),0.5),()=>T(ctx,"everything else tuned from it",960,250,{w:600,size:26,align:"center",color:rgba(SOFT,1)}));});}
  ctx.restore();weedsTitle(ctx,S,t,B,"Written once","one home per fact; everything else driven from it",WEED);
  // the fork in its case, below the title: it shows through the title card's dark
  if(t>B){ctx.save();drift(ctx,t,sc,{z:0.04,y:460});wr_case(ctx,cx_,cy_,cw_,ch_,t,{a:0.65*fin(t,B+0.3,1.0)});ctx.restore();}
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Four copies ---------- */
scene("four",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,x:900,y:520});
  const cF=c("found"),cD=c("drift"),cO=c("one"),cS=c("step");
  // the agent's review, picking up where the last film left off
  kt_agent(ctx,1000,112,22,t,{a:fin(t,0.2,0.6),busy:1-fin(t,cD,1)});
  arrive(ctx,1300,112,t,0.6,()=>{glass(ctx,1050,80,560,64,18,KT_AI,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,"the agent's review",1074,121,{w:700,size:20,color:rgba(KT_AI,1)});
    T(ctx,"award",1290,121,{f:"mono",w:500,size:20});withA(ctx,fin(t,w("review","four places"),0.4),()=>T(ctx,"· 4 places",1360,121,{w:800,size:20,color:rgba(WR_AMB,1)}));},{dy:16});
  // the one definition, carried from the past, now found in four places
  const one=1-fin(t,w("found","wiki")-0.5,0.6);if(one>0.01)withA(ctx,one,()=>{const sp=ease(fin(t,w("review","four places")-0.2,1.0));
    for(let k=3;k>=0;k--){const ox=k*16*sp,oy=k*16*sp;withA(ctx,k?sp*0.8:1,()=>{glass(ctx,1390-ox,340+oy,440,120,18,k?WR_AMB:TRUST,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.97)"});T(ctx,"award",1420-ox,388+oy,{f:"mono",w:500,size:24,color:rgba(k?WR_AMB:TRUST,1)});T(ctx,"one definition",1420-ox,430+oy,{w:700,size:24});});}
    withA(ctx,sp,()=>tag(ctx,1610,560,"four places",WR_AMB,{align:"center",size:20}));});
  // the four copies, each named and pinned as it's said
  const nm=[w("found","wiki"),w("found","YAML description"),w("found","catalog"),w("found","tooltip")];
  const amb=[fin(t,w("drift","on paper"),0.6),fin(t,w("drift","lost its credit"),0.6),fin(t,w("drift","a degree"),0.6)];
  const hl=[[["on paper",fin(t,w("drift","on paper")+0.2,0.8),WR_AMB]],[],[["degree",fin(t,w("drift","a degree")+0.2,0.8),WR_AMB]]];
  wr_copies(ctx,t,{t0:[nm[0]-0.3,nm[1]-0.3,nm[2]-0.3,nm[3]-0.4],amb,hl,ghost:fin(t,w("step","one small edit"),0.8),pin:nm.map(x=>fin(t,x+0.2,0.4))});
  // only the tooltip still says what Mei approved: the words in the conceptual model, drawn in beside it
  const con=WR_CP.con;arrive(ctx,con[0]+280,con[1]+160,t,w("one","conceptual model")-0.3,()=>{const h=wr_code(ctx,con[0],con[1],con[2],"models/core/course/_course__conceptual.yml",WR_C1,{label:"",wrapMark:true,wrap:54,size:18,lh:29,edge:BPL,lit:{2:fin(t,w("one","conceptual model")+0.6,0.5),3:fin(t,w("one","conceptual model")+0.6,0.5)},litCol:TRUST});
    kt_gtick(ctx,con[0]+con[2]-24,con[1]+h+30,16,fin(t,w("one","Mei approved"),0.4));withA(ctx,fin(t,w("one","Mei approved")+0.2,0.4),()=>T(ctx,"Mei · 1 Oct",con[0]+con[2]-50,con[1]+h+37,{w:700,size:19,align:"right",color:rgba(TRUST,1)}));},{dy:30});
  const ln=fin(t,w("one","words in")+0.3,0.8);if(ln>0){ctx.save();ctx.setLineDash([5,8]);ctx.strokeStyle=rgba(INK,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1192,330);ctx.lineTo(lerp(1192,1226,ln),lerp(330,380,ln));ctx.stroke();ctx.restore();}
  arrive(ctx,1450,640,t,w("one","words in")+0.6,()=>tag(ctx,1450,640,"same words · no wire",SOFT,{align:"center",size:19}),{dy:14});
  arrive(ctx,1580,700,t,w("one","Only the tooltip"),()=>tag(ctx,1580,700,"only the tooltip · what Mei approved",TRUST,{align:"center",size:19}),{dy:14});
  // nothing kept them in step: one small edit at a time
  arrive(ctx,80,140,t,cS,()=>tag(ctx,80,140,"nothing kept them in step",WR_AMB,{size:20}),{dy:14});
  arrive(ctx,420,140,t,w("step","one small edit"),()=>tag(ctx,420,140,"one small edit at a time",WR_AMB,{size:20}),{dy:14});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. What goes where ---------- */
const WR_DEC=["  - id: DEC-PRJ-04","    title: Definitions are written once and generated","    …","    why: Four copies of a definition drift apart. One home, and one direction of sync, keeps them the same.","    decided_by: Jun Park and Noor"];
const WR_WHY=["Four copies of a definition drift apart. One home, and one","direction of sync, keeps them the same."];
const WR_GAPS=["  - name: core_credential","    …","        limitations:","          - id: LIM-STU-06","            was: GAP-STU-02","            text: >","              No source records an expiry. status allows expired; nothing sets it yet."];
const WR_CONV=["## Metadata","","- `meta.grain`: on every core and mart model, the grain in one sentence (\"One row per credential\"). Each domain's physical diagram (`_<domain>__physical.md`) reads it; a test proves it.",
  "- `meta.owner`: who owns the meaning (models) or the data (sources, seeds).","- `meta.domain`: the domain that owns the model, seed or source: `registrar` or `learning` (application domains: the teams whose systems are the sources), `student` or `course` (data domains), `planning` or `wallet` (business domains), or `shared`.","- `meta.glossary_term`: the term in the domain's conceptual model a model or key holds.","…"];
const WR_CON9=["  - name: award","    definition: >","      A qualification the university confers, such as a graduate certificate or a master, for","      a set number of credit points. When it's conferred on a learner, it's a credential too.","    owner: Mei Tanaka, registrar's office","    business_key:","      issued_by: Registrar's office","      rule: The award code, qualified by its key set, SIS|GCDA.","    history: Every version, dated when it was recorded."];
scene("where",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cM=c("meaning"),cW=c("why"),cB=c("build"),cL=c("log");
  // the four copies, carried from the last chapter, slide aside
  const sl=ease(fin(t,0.2,1.4));wr_copies(ctx,t,{dx:-420*sl,a:1-sl,amb:[1,1,1],hl:[[["on paper",1,WR_AMB]],[],[["degree",1,WR_AMB]]],ghost:1-sl});
  // not a fifth copy: the home already exists
  wr_fifth(ctx,500,330,460,180,fin(t,w("fifth","fifth copy")-0.2,0.5)*(1-fin(t,w("fifth","already has")+0.6,0.6)),fin(t,w("fifth","or a better")-0.1,0.5));
  // the conceptual model: from the card on the right to the home at the top, white on blue; later a strip, with the columns below
  const mv=ease(fin(t,cM-1.0,1.3)),sh=ease(fin(t,cW-0.6,1.0)),con=WR_CP.con;
  if(mv<1){const h0=wr_code(ctx,0,0,con[2],"",WR_C1,{wrapMark:true,wrap:54,size:18,lh:29,a:0});withA(ctx,1-mv,()=>{const x=lerp(con[0],360,mv),y=lerp(con[1],110,mv);
    wr_code(ctx,x,y,con[2],"models/core/course/_course__conceptual.yml",WR_C1,{label:"",wrapMark:true,wrap:54,size:18,lh:29,edge:BPL,hi:fin(t,w("fifth","already has"),0.5),lit:{2:1,3:1}});kt_gtick(ctx,x+con[2]-24,y+h0+30,16,1);});}
  arrive(ctx,1500,640,t,w("fifth","already has"),()=>withA(ctx,1-mv,()=>tag(ctx,1500,640,"the home already exists",TRUST,{align:"center",size:20})),{dy:14});
  arrive(ctx,960,640,t,w("fifth","Everything else"),()=>withA(ctx,1-fin(t,cM-0.6,0.5),()=>T(ctx,"one home per fact",960,640,{w:800,size:44,align:"center",color:rgba(TRUST,1)})),{from:0.9});
  if(mv>0){const lit={2:fin(t,w("meaning","what each"),0.4),3:fin(t,w("meaning","what each"),0.4),7:fin(t,w("meaning","its key"),0.4),4:fin(t,w("meaning","who owns"),0.4)};
    withA(ctx,mv*(1-sh),()=>wr_bpCode(ctx,360,110,1200,"models/core/course/_course__conceptual.yml · the conceptual model",WR_CON9,{size:18,lh:27,lit,tags:[[2,"what it is",lit[2]],[7,"its key",lit[7]],[4,"its owner",lit[4]]]}));
    withA(ctx,sh,()=>{bpPaper(ctx,360,90,1200,96,1,{});T(ctx,"models/core/course/_course__conceptual.yml",390,148,{f:"mono",w:500,size:20,color:rgba(BPL,1)});T(ctx,"the conceptual model · meaning",1530,148,{w:700,size:20,align:"right",color:rgba(BPL,0.9)});});}
  // two columns below it: what was decided and accepted, beside what it's about; and the YAML the build uses
  const MX=80,YX=980,CW=860;
  arrive(ctx,YX+50,224,t,cB-0.2,()=>tag(ctx,YX,224,"YAML",TRUST,{size:22}),{dy:12});
  const whyA=fin(t,w("log","It holds why"),0.5);
  arrive(ctx,MX+CW/2,360,t,w("why","Decisions"),()=>{wr_code(ctx,MX,260,CW,"models/_shared/_shared__decisions.yml",WR_DEC,{wrap:74,size:18,lh:28,edge:KIND,p:clamp((t-w("why","Decisions"))/1.6,0,1),hi:whyA,
    seg:WR_WHY.map(s=>[-1,s,whyA,TRUST])});},{dy:30});
  arrive(ctx,MX+150,224,t,w("why","Decisions"),()=>tag(ctx,MX,224,"a decision log · why · who",KIND,{size:20}),{dy:12});
  arrive(ctx,MX+CW/2,650,t,w("why","gaps"),()=>wr_code(ctx,MX,522,CW,"models/core/student/_core_student__models.yml",WR_GAPS,{wrap:74,size:18,lh:28,edge:KIND,p:clamp((t-w("why","gaps"))/1.2,0,1)}),{dy:30});
  arrive(ctx,MX+560,224,t,w("why","gaps")+0.3,()=>tag(ctx,MX+400,224,"accepted gaps · on the model",KIND,{size:20}),{dy:12});
  // the YAML column: what the build uses, then the conventions' rules
  ["grain","keys","contracts","tests","owners"].forEach((s,i)=>{const x=[YX+140,YX+250,YX+350,YX+500,YX+610][i];arrive(ctx,x+30,224,t,w("build",s)-0.1,()=>tag(ctx,x,224,s,TRUST,{size:18}),{from:0.7});});
  const cvA=1-fin(t,cL+0.2,0.6)*0.75;
  arrive(ctx,YX+CW/2,450,t,w("build","grain")+0.6,()=>withA(ctx,cvA,()=>wr_code(ctx,YX,260,CW,"docs/conventions.md",WR_CONV,{wrap:74,size:18,lh:28,edge:TRUST,p:clamp((t-w("build","grain")-0.6)/1.8,0,1)})),{dy:30});
  // a model's YAML has no place for why
  withA(ctx,fin(t,w("log","no place"),0.5),()=>{ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(WR_AMB,0.85);ctx.lineWidth=2;rr(ctx,YX,756,CW,96,16);ctx.stroke();ctx.restore();ctx.fillStyle="rgba(7,12,24,0.92)";rr(ctx,YX+2,758,CW-4,92,16);ctx.fill();
    T(ctx,"why: ?",YX+30,812,{f:"mono",w:500,size:22,color:rgba(WR_AMB,1)});T(ctx,"a model's YAML has no place for why",YX+CW-30,812,{w:700,size:22,align:"right",color:rgba(WR_AMB,1)});});
  arrive(ctx,MX+CW/2,850,t,w("log","isn't a copy"),()=>T(ctx,"a decision log holds why",MX+CW/2,850,{w:700,size:26,align:"center",color:rgba(TRUST,1)}),{dy:14});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Written once, shown everywhere ---------- */
const WR_HEAD=["# The course domain's conceptual model: the awards the university offers. Owned by the registrar's","# office.","#","# Not parsed by dbt (.dbtignore). scripts/generate/definitions.py turns each definition into a","# doc block in _course__definitions.md, next to this file, which the dbt YAML shows with doc() and","# Databricks pushes to Unity Catalog. The diagram is drawn by hand in _course__conceptual.md."];
const WR_PY=["\"\"\"Writes each domain's definitions, the university's map and the key sets seed from the conceptual model.","","The meaning is written once, in the conceptual model:","- one file per core domain and per mart, next to its models","  (models/core/<domain>/_<domain>__conceptual.yml, models/marts/<consumer>/_<consumer>__conceptual.yml).","  This script turns its entities and relationships into doc blocks in _<domain>__definitions.md,","  next to it; the dbt YAML shows them with doc(), and on Databricks persist_docs pushes them to","  Unity Catalog.","…","    python scripts/generate/definitions.py           # write the definitions and the key sets seed","    python scripts/generate/definitions.py --check   # fail if any is out of date","\"\"\""];
const WR_MD=["# Course domain: definitions","","*Generated by `scripts/generate/definitions.py` from `_course__conceptual.yml`, next to this file. Edit the conceptual model, then run the script; don't edit this file.*","","{% docs award %}","**Award.** "+WR_DEF,"","- Business key: The award code, qualified by its key set, SIS|GCDA. Issued by: Registrar's office.","- Owner of the meaning: Mei Tanaka, registrar's office.","- History: Every version, dated when it was recorded.","{% enddocs %}"];
const WR_YML=["  - name: core_award","    description: >","      An award the university offers, as it stood from valid_from until valid_to.","      {{ doc(\"award\") }}"];
const WR_CHAIN=[["_course__conceptual.yml",0,BPL],["scripts/generate/definitions.py",1,KT_AI],["_course__definitions.md",1,KIND],["doc(\"award\")",0,TRUST],["the docs site",0,KIND]];
function wr_chainX(ctx){const W_=WR_CHAIN.map(([n,cg])=>tw(ctx,n,18,500,"mono")+(cg?76:44)),gap=(1760-W_.reduce((s,x)=>s+x,0))/4;let x=80;return W_.map(w_=>{const r=[x,w_];x+=w_+gap;return r;});}
function wr_chain(ctx,y,t,on,a,o){o=o||{};if(a<=0.01)return;const X=wr_chainX(ctx);withA(ctx,a,()=>{WR_CHAIN.forEach(([n,cg,col],i)=>{const[x,w_]=X[i],q=on[i];if(q<=0)return;
  if(i>0){const[px,pw]=X[i-1];arrowTo(ctx,px+pw+8,y,x-8,y,col,q,{p:q,head:12});}
  arrive(ctx,x+w_/2,y,t,o.t0?o.t0[i]:-9,()=>wr_link(ctx,x,y,w_,n,{cog:!!cg,on:o.lit?o.lit[i]:0.5,col,t,spin:cg&&o.spin?o.spin[i]:0}),{from:0.8});});});return X;}
scene("blocks",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const cS=c("script"),cP=c("points"),cC=c("change"),cZ=c("zero"),tPage=w("script","Markdown page");
  // the strip from the last chapter folds into the chain's first link
  const fold=ease(fin(t,0,1.0));withA(ctx,1-fold,()=>{bpPaper(ctx,lerp(360,80,fold),90,lerp(1200,280,fold),96,1,{});});
  const on=[fin(t,0.4,0.6),fin(t,cS,0.6),fin(t,tPage-0.2,0.6),fin(t,cP,0.6),fin(t,w("points","dbt shows"),0.6)];
  const lit=[fin(t,0.4,0.5)*(1-fin(t,cS,0.5))+fin(t,w("change","one line"),0.4),pulseAt(t,cS+0.4,3.4),pulseAt(t,tPage+0.3,3.4)+fin(t,w("change","generated page"),0.4),pulseAt(t,cP+0.3,3.6),pulseAt(t,w("points","dbt shows")+0.2,3)];
  wr_chain(ctx,128,t,on,1,{t0:[0.4,cS,tPage-0.2,cP,w("points","dbt shows")],lit,spin:[0,1-fin(t,tPage+2,1),0,0,0]});
  // one card at a time below the chain: the header, the script, the page it writes
  const A1=1-fin(t,cS-0.4,0.5),A2=fin(t,cS,0.4)*(1-fin(t,tPage-0.6,0.5)),A3=fin(t,tPage-0.3,0.4)*(1-fin(t,cP-0.5,0.5));
  if(A1>0.01)arrive(ctx,960,420,t,0.8,()=>withA(ctx,A1,()=>wr_code(ctx,260,300,1400,"models/core/course/_course__conceptual.yml",WR_HEAD,{size:19,edge:BPL,p:clamp((t-0.9)/1.8,0,1),seg:[[0,"The course domain's conceptual model",fin(t,w("once","defined once"),0.5),TRUST]]})),{dy:30});
  if(A2>0.01)arrive(ctx,960,460,t,cS-0.1,()=>withA(ctx,A2,()=>{wr_code(ctx,260,280,1400,"scripts/generate/definitions.py",WR_PY,{size:19,edge:KT_AI,cog:true,spin:1,t,p:clamp((t-cS)/2.6,0,1),seg:[[5,"turns its entities and relationships into doc blocks",fin(t,w("script","doc block"),0.5),KT_AI]]});}),{dy:30});
  if(A3>0.01)arrive(ctx,960,470,t,tPage-0.3,()=>withA(ctx,A3,()=>wr_code(ctx,260,230,1400,"models/core/course/_course__definitions.md",WR_MD,{wrap:112,size:19,edge:KIND,cog:true,t,p:clamp((t-tPage)/2.2,0,1),seg:[[3,"don't edit this file.*",fin(t,w("script","Nobody edits"),0.5),WR_AMB]]})),{dy:30});
  arrive(ctx,960,830,t,w("script","Nobody edits"),()=>withA(ctx,A3,()=>tag(ctx,960,830,"generated · don't edit this file",WR_AMB,{align:"center",size:20})),{dy:14});
  // the YAML names it; dbt shows it on the docs site
  const A4=fin(t,cP-0.3,0.4)*(1-fin(t,cC-0.5,0.5));
  if(A4>0.01){arrive(ctx,560,330,t,cP-0.2,()=>withA(ctx,A4,()=>wr_code(ctx,80,240,960,"models/core/course/_core_course__models.yml",WR_YML,{size:18,lh:30,edge:TRUST,p:clamp((t-cP)/1.4,0,1),seg:[[3,"{{ doc(\"award\") }}",fin(t,w("points","names it"),0.5),TRUST]]})),{dy:30});
    arrive(ctx,560,470,t,w("points","names it"),()=>withA(ctx,A4,()=>tag(ctx,560,470,"named, not copied",TRUST,{align:"center",size:20})),{dy:14});
    arrive(ctx,1460,460,t,w("points","dbt shows"),()=>withA(ctx,A4,()=>wr_docs(ctx,1080,240,760,440,{def:fin(t,w("points","dbt shows")+0.5,0.6)})),{dy:30});
    withA(ctx,A4*fin(t,w("points","dbt shows")+0.5,0.6),()=>arrowTo(ctx,1040,320,1076,420,TRUST,0.9,{head:12,bend:-0.2}));}
  // change the meaning in one line, with Mei's approval; edit the generated page instead, and CI fails
  const A5=fin(t,cC-0.3,0.5)*(1-fin(t,cZ-0.5,0.4)),tE=w("change","generated page"),tF=w("change","check in CI");
  if(A5>0.01){arrive(ctx,510,380,t,cC-0.2,()=>withA(ctx,A5,()=>{const h=wr_code(ctx,80,240,860,"models/core/course/_course__conceptual.yml",WR_C1,{wrapMark:true,wrap:54,size:18,lh:30,edge:BPL,lit:{2:fin(t,w("change","one line"),0.4),3:fin(t,w("change","one line"),0.4)}});
      kt_gtick(ctx,900,240+h-30,16,fin(t,w("change","Mei's approval"),0.4));withA(ctx,fin(t,w("change","Mei's approval")+0.2,0.4),()=>T(ctx,"Mei's approval",874,240+h-23,{w:700,size:18,align:"right",color:rgba(TRUST,1)}));}),{dy:30});
    const fail=fin(t,tF,0.3),fix=fin(t,tF+1.2,0.5),edit=fin(t,tE,1.0)*(1-fix);
    arrive(ctx,1410,420,t,tE-0.5,()=>withA(ctx,A5,()=>wr_code(ctx,980,240,860,"models/core/course/_course__definitions.md",WR_MD.slice(4,11),{wrap:64,size:18,lh:30,edge:mix(KIND,WR_AMB,edit),cog:true,t,amb:edit*0.6,ins:[1,49," on paper",edit,EDGE_]})),{dy:30});
    arrive(ctx,1410,770,t,tF-0.2,()=>withA(ctx,A5,()=>wr_ci(ctx,980,724,860,"Doc blocks and key sets match the conceptual model",fail>0?(fix>0.5?2:1):0,fix>0.5?"the definitions, the map and seeds/reference/shared/key_sets.csv\nare up to date":"models/core/course/_course__definitions.md is out of date:\nrun python scripts/generate/definitions.py",{})),{dy:20});
    arrive(ctx,1410,862,t,tF,()=>withA(ctx,A5*(1-fix),()=>tag(ctx,1410,862,"the check fails",BAD,{align:"center",size:20})),{dy:14});}
  // the agent's review runs again; the wiki links to the docs site
  const A6=fin(t,cZ-0.1,0.5);
  if(A6>0.01){kt_agent(ctx,190,400,24,t,{a:A6,busy:1-fin(t,cZ+1.4,0.8)});
    arrive(ctx,690,400,t,cZ,()=>wr_code(ctx,270,332,860,"review-metadata",["$ python skills/review-metadata/find_repeats.py","0 description(s) written more than once"],{size:18,lh:30,edge:KT_AI,p:clamp((t-cZ-0.2)/1.4,0,1),seg:[[1,"0 description(s) written more than once",fin(t,w("zero","no description"),0.5),GOOD]]}),{dy:30});
    arrive(ctx,700,540,t,w("zero","in the project"),()=>tag(ctx,700,540,"in the project: 0 descriptions written twice",GOOD,{align:"center",size:20}),{dy:14});
    const lk=fin(t,w("zero","wiki now links")+0.8,0.6),st=fin(t,w("zero","wiki now links"),0.5),gone=fin(t,w("zero","wiki now links")+0.5,0.3);
    arrive(ctx,1500,455,t,cZ+0.6,()=>wr_copy(ctx,1200,330,600,250,"wiki",WR_TXT.wiki,{amb:1-lk,hl:[["on paper",1-gone,WR_AMB]],strike:st,link:lk,out:gone}),{dy:30});
    arrive(ctx,1500,630,t,w("zero","docs site"),()=>tag(ctx,1500,630,"the wiki links to the docs site",KIND,{align:"center",size:20}),{dy:14});}
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Diagrams that can't drift ---------- */
const WR_ERD=["```mermaid","erDiagram","    LEARNER ||--o{ CREDENTIAL : holds","    LEARNER ||--o{ CREDIT_TOWARDS_AWARD : \"holds credit\"","    AWARD ||--o{ CREDIT_TOWARDS_AWARD : \"is earned by\"","    CREDENTIAL }o--o{ AWARD : \"counts towards\"","    LEARNER }o--o| AWARD : \"is enrolled in\"","```"];
const WR_PHY=["# Student domain: physical model","","*Generated by `scripts/generate/diagrams.py` from `target/manifest.json`. Don't edit this file: change the YAML, run `dbt parse`, then run the script. CI fails if it's out of date.*","…","    core_credential_v2 {","        string credential_key PK","        string credential_bk","        string learner_key FK","        …"];
const WR_WF=["      - name: Doc blocks and key sets match the conceptual model","        run: python scripts/generate/definitions.py --check","","      - name: Physical diagram matches the YAML","        run: python scripts/generate/diagrams.py --check"];
scene("diagrams",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cH=c("hand"),cG=c("generated"),cF=c("fails"),cR=c("rule");
  // the wiki card, carried from the last chapter, now shows last year's diagram, going amber
  const wl=fin(t,cH-0.5,0.8),sw=ease(fin(t,0.3,0.8));
  wr_chain(ctx,128,t,[1,1,1,1,1],1-fin(t,0,0.8),{lit:[0,0,0,0,0]});
  withA(ctx,(1-sw)*(1-wl),()=>wr_copy(ctx,1200,330,600,250,"wiki",WR_TXT.wiki,{link:1}));
  wr_oldWiki(ctx,1200+300*wl,330,600,250,t,{a:sw*(1-wl),amb:fin(t,w("too","drift")-0.2,0.8)});
  arrive(ctx,1500,630,t,w("too","drift"),()=>withA(ctx,1-wl,()=>tag(ctx,1500,630,"diagrams drift too",WR_AMB,{align:"center",size:20})),{dy:14});
  // both diagrams rise into their final places for the rule
  const up=ease(fin(t,cR-0.4,1.2)),codeA=1-fin(t,cF-0.4,0.5);
  // left: the conceptual diagram, drawn by hand
  arrive(ctx,510,280,t,cH-0.2,()=>withA(ctx,codeA,()=>wr_code(ctx,80,120,860,"models/core/student/_student__conceptual.md",WR_ERD,{size:18,lh:29,edge:BPL,p:clamp((t-cH)/2.4,0,1)})),{dy:30});
  const hy=lerp(456,180,up);arrive(ctx,510,hy+185,t,cH+0.2,()=>{wr_erdHand(ctx,80,hy,860,370,clamp((t-cH-0.2)/2.6,0,1),t,{});
    withA(ctx,fin(t,w("hand","by hand"),0.5)*(1-up),()=>tag(ctx,96,hy+398,"conceptual · drawn by hand · for people",BPL,{size:19}));},{dy:30});
  // right: the physical diagram, generated
  arrive(ctx,1410,300,t,cG-0.2,()=>withA(ctx,codeA,()=>wr_code(ctx,980,120,860,"models/core/student/_student__physical.md",WR_PHY,{wrap:73,size:18,lh:28,edge:[170,205,255],cog:true,t,p:clamp((t-cG)/2.0,0,1),seg:[[2,"*Generated by `scripts/generate/diagrams.py` from `target/manifest.json`.",fin(t,w("generated","generated"),0.5),KT_AI]]})),{dy:30});
  const tY=w("fails","YAML changes"),stale=fin(t,tY+0.4,0.4)*(1-fin(t,tY+2.6,0.5)),upd=fin(t,tY+2.4,0.3),gy=lerp(530,240,up);
  arrive(ctx,1410,gy+150,t,cG+0.2,()=>{wr_erdGen(ctx,980,gy,860,300,clamp((t-cG-0.2)/2.4,0,1),t,{amb:stale,upd:fin(t,tY,0.1)*(upd>0.5?1:0.4),spin:fin(t,tY+1.6,0.3)*(1-upd)});
    withA(ctx,fin(t,w("generated","from what dbt parsed"),0.5)*(1-up),()=>tag(ctx,996,gy+326,"physical · generated · from what dbt parsed",[170,205,255],{size:19}));},{dy:30});
  // if the YAML changes and the diagram doesn't, CI fails; the script runs, and it passes
  const wfA=fin(t,cF-0.2,0.5)*(1-fin(t,cR-0.5,0.5));
  if(wfA>0.01){arrive(ctx,490,230,t,cF-0.2,()=>withA(ctx,wfA,()=>wr_code(ctx,80,120,820,".github/workflows/credential-project.yml",WR_WF,{size:18,lh:29,edge:[170,205,255]})),{dy:24});
    arrive(ctx,1410,166,t,cF,()=>withA(ctx,wfA,()=>wr_ci(ctx,930,120,930,"Doc blocks and key sets match the conceptual model",2,"the definitions, the map and seeds/reference/shared/key_sets.csv are up to date",{})),{dy:20});
    arrive(ctx,1410,276,t,cF+0.2,()=>withA(ctx,wfA,()=>wr_ci(ctx,930,230,930,"Physical diagram matches the YAML",stale>0.3?1:(upd>0.5?2:0),stale>0.3?"models/core/student/_student__physical.md is out of date:\nrun dbt parse, then python scripts/generate/diagrams.py":(upd>0.5?"the physical models are up to date":""),{})),{dy:20});
    arrive(ctx,1410,382,t,tY,()=>withA(ctx,wfA*(1-upd),()=>tag(ctx,1410,382,"_core_student__models.yml: data_type changed",WR_AMB,{align:"center",size:19})),{dy:14});
    arrive(ctx,1410,382,t,tY+2.4,()=>withA(ctx,wfA*upd,()=>tag(ctx,1410,382,"CI fails if it's out of date",KIND,{align:"center",size:19})),{dy:14});}
  // draw the meaning; generate the structure
  arrive(ctx,510,640,t,w("rule","Draw the meaning"),()=>T(ctx,"draw the meaning",510,640,{w:800,size:36,align:"center",color:rgba(BPL,1)}),{dy:16});
  arrive(ctx,1410,640,t,w("rule","Generate the structure"),()=>T(ctx,"generate the structure",1410,640,{w:800,size:36,align:"center",color:rgba([170,205,255],1)}),{dy:16});
  ctx.restore();vign(ctx,S);});

/* ---------- 6. One direction ---------- */
const WR_PROJ=["models:","  credentials:","    # Databricks only: push descriptions to Unity Catalog. DuckDB leaves them in the docs site.","    +persist_docs:","      relation: \"{{ target.type == 'databricks' }}\"","      columns: \"{{ target.type == 'databricks' }}\""];
const WR_HOME=[["_course__conceptual.yml",BPL],["_course__definitions.md",KIND],["_core_course__models.yml",TRUST]];
function wr_homes(ctx,y,t,on,a){if(a<=0.01)return[];let x=80;const R=[];withA(ctx,a,()=>{WR_HOME.forEach(([n,col],i)=>{const w_=tw(ctx,n,18,500,"mono")+44;if(i>0)arrowTo(ctx,x-34,y,x-6,y,col,1,{head:10});wr_link(ctx,x,y,w_,n,{on:on[i],col});R.push([x,w_]);x+=w_+40;});});return R;}
scene("catalog",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,x:1100});
  const cP=c("push"),cT=c("there"),cG=c("gate"),tH=w("there","Fix it at home"),tW=w("there","writes over");
  // the catalog, where people on Databricks find tables
  arrive(ctx,1450,370,t,0.3,()=>wr_catalog(ctx,1060,100,780,540,t,{search:clamp((t-w("find","catalog"))/0.8,0,1),desc:clamp((t-cP-0.6)/1.8,0,1),cols:clamp((t-w("push","its columns"))/1.0,0,1),
    edit:fin(t,w("there","Nobody edits"),1.2),reset:clamp((t-tW)/1.0,0,1),hi:pulseAt(t,w("find","descriptions"),1.6)}),{d:1.0,from:0.92,dy:30});
  // the setting that pushes them, and the homes they come from
  arrive(ctx,530,240,t,cP-0.3,()=>wr_code(ctx,80,100,900,"dbt_project.yml",WR_PROJ,{wrapMark:true,wrap:78,size:18,lh:30,edge:TRUST,lit:{3:fin(t,w("push","pushes"),0.4),4:fin(t,w("push","each table"),0.4),5:fin(t,w("push","its columns"),0.4)}}),{dy:30});
  arrive(ctx,280,430,t,cP+0.4,()=>tag(ctx,80,430,"persist_docs · Databricks only",TRUST,{size:18}),{dy:12});
  const hA=fin(t,cP+0.2,0.6),hl=pulseAt(t,tH,2.4);const R=wr_homes(ctx,510,t,[0.5+0.5*hl,0.5+0.5*pulseAt(t,tH+0.6,2),0.5+0.5*pulseAt(t,tH+1.1,2)],hA);
  // one direction: the descriptions flow from the files out to the catalog, table then columns
  if(R.length){const sx=R[2][0]+R[2][1]+6;wr_flow(ctx,[[sx,510],[sx+60,510],[1050,310]],t,fin(t,w("push","pushes")-0.2,0.5),KIND,{p:fin(t,w("push","pushes")-0.2,0.8),n:4});
    wr_flow(ctx,[[R[0][0]+R[0][1]/2,540],[R[0][0]+R[0][1]/2,566],[sx+30,566],[1050,520]],t,fin(t,tH+0.4,0.5)*(1-fin(t,cG+1,0.6)),BPL,{p:fin(t,tH+0.4,1.2),n:6,sp:0.5});}
  arrive(ctx,560,610,t,w("push","each table"),()=>withA(ctx,1-fin(t,tH,0.4),()=>tag(ctx,560,610,"each table · its columns",KIND,{align:"center",size:19})),{dy:12});
  arrive(ctx,1450,680,t,w("there","Nobody edits"),()=>withA(ctx,1-fin(t,cG-0.3,0.5),()=>tag(ctx,1450,680,"nobody edits them there",EDGE_,{align:"center",size:20})),{dy:12});
  arrive(ctx,1450,730,t,tW,()=>withA(ctx,1-fin(t,cG-0.3,0.5),()=>tag(ctx,1450,730,"a rebuild writes over it",KIND,{align:"center",size:20})),{dy:12});
  arrive(ctx,560,610,t,tH,()=>withA(ctx,1-fin(t,cG-0.3,0.5),()=>tag(ctx,560,610,"fix it at home",BPL,{align:"center",size:20})),{dy:12});
  // one direction: and whatever reads the catalog, like the dashboard's tooltip, reads it from there
  arrive(ctx,560,610,t,cG,()=>tag(ctx,560,610,"one direction →",KIND,{align:"center",size:22}),{dy:12});
  const rd=w("gate","whatever reads it");arrive(ctx,1450,760,t,rd-0.2,()=>{wr_dash(ctx,1180,700,540,140,t,{});tag(ctx,1500,668,"tooltip · reads the catalog",KIND,{size:18});},{dy:24});
  withA(ctx,fin(t,rd,0.5),()=>arrowTo(ctx,1460,644,1460,694,KIND,1,{head:10}));
  // a brief echo of the past: the fork in its case, an arrow out to a violin, and none back
  const eA=fin(t,w("gate","Tuned from")-0.3,0.6);if(eA>0.01){withA(ctx,eA,()=>{ctx.save();ctx.fillStyle="rgba(26,16,8,0.92)";rr(ctx,70,650,900,220,18);ctx.fill();ctx.strokeStyle=rgba(CLAY,0.5);ctx.lineWidth=1.5;rr(ctx,70,650,900,220,18);ctx.stroke();ctx.restore();
    wr_case(ctx,110,740,360,90,t,{});wr_violin(ctx,800,750,0.3,t,{rot:-1.1});arrowTo(ctx,500,745,680,745,TRUST,1,{p:fin(t,w("gate","Tuned from"),0.6),head:12});wr_noBack(ctx,680,790,500,790,fin(t,w("gate","never the other"),0.5));
    withA(ctx,fin(t,w("gate","never the other"),0.5),()=>T(ctx,"tuned from one source, never the other way round",520,850,{w:700,size:22,align:"center",color:rgba(TRUST,1)}));});}
  ctx.restore();vign(ctx,S);});

/* ---------- 7. The next version ---------- */
const WR_VER=["    versions:","      - v: 2","        …","      - v: 1","        deprecation_date: 2027-03-31","        description: >","          Version 1: a credential issued to a learner, with is_revoked in place of status.","          Deprecated: status replaces is_revoked in version 2, because a credential can also","          expire. Built from version 2 until 31 March 2027. Temporary: removed after its","          deprecation date, once its consumers have moved to version 2.","        …","        columns:","          - include: all","            exclude: [learner_bk, status, revoked_on, loaded_at]","          - name: is_revoked"];
const WR_V1=["-- Version 1, built from version 2 until its deprecation date: the logic lives once.","with","","credentials as (","","    select * from {{ ref('core_credential', v=2) }}","…","    status = 'revoked' as is_revoked"];
const WR_WAL=["credentials as (","","    select * from {{ ref('core_credential', v=2) }}","","),"];
const WR_WARN=["[WARNING]: While compiling 'mart_wallet__old_reader': Found a reference to","core_credential.v1, which is slated for deprecation on '2027-03-31T00:00:00+00:00'.","A new version of 'core_credential' is available. Try it out:","{{ ref('credentials', 'core_credential', v='2') }}."];
scene("version",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cE=c("expire"),cB=c("breaks"),cD=c("date"),cT=c("tell"),cW=c("warn"),cC=c("choice");
  // the catalog, carried from the last chapter, slides away
  const go=ease(fin(t,0,1.0));withA(ctx,1-go,()=>wr_catalog(ctx,1060+500*go,100,780,600,t,{}));
  withA(ctx,fin(t,0.4,0.6)*(1-fin(t,cE+1.5,0.6)),()=>T(ctx,"written once ≠ never changed",960,140,{w:800,size:40,align:"center"}));
  // core_credential, its old column, and the status a true or false can't hold
  const tNew=w("breaks","new version"),split=ease(fin(t,tNew-0.2,1.0)),tl=ease(fin(t,cT-0.6,1.2));
  const vx=lerp(120,80,tl),vy=lerp(lerp(260,300,split),200,tl),vw=lerp(600,520,tl);
  const rowsOld=[["credential_key","string"],["credential_kind","string"],["is_revoked","boolean",WR_AMB]],rowsNew=[["credential_key","string"],["credential_kind","string"],["status","string",TRUST]];
  arrive(ctx,vx+vw/2,vy+120,t,0.6,()=>{
    if(split>0.01)wr_prod(ctx,vx,vy-60*split,vw,{ver:"v1",dim:0.5,rows:rowsOld,a:split});
    if(split>0.01)kt_rstamp(ctx,vx+vw-200,vy-40,"31 Mar 2027",WR_AMB,fin(t,w("date","date to go"),0.3),fin(t,w("date","date to go")+0.1,0.35),{size:18,rot:0.06});
    wr_prod(ctx,vx,vy,vw,{ver:split>0.5?"v2":null,rows:split>0.5?rowsNew:rowsOld,lit:{2:fin(t,w("expire","true or false"),0.4)*(1-split)+split*fin(t,cB,0.4)},hi:split});},{d:0.9,dy:30});
  const stA=fin(t,w("expire","becomes")-0.2,0.5)*(1-fin(t,tNew,0.5));
  if(stA>0.01)withA(ctx,stA,()=>{glass(ctx,840,260,700,150,18,TRUST,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,"status",870,304,{f:"mono",w:500,size:22,color:rgba(TRUST,1)});
    wr_chips(ctx,870,358,[["valid",GOOD,0],["expired",WR_AMB,fin(t,w("expire","expired"),0.4)],["revoked",BAD,0]],1);arrowTo(ctx,726,lerp(418,418,0),836,340,TRUST,1,{head:12,bend:0.15});});
  withA(ctx,fin(t,w("expire","expire"),0.4)*(1-fin(t,w("expire","becomes")-0.3,0.4)),()=>tag(ctx,840,330,"a credential can expire",WR_AMB,{size:20}));
  withA(ctx,fin(t,w("expire","true or false"),0.4)*(1-fin(t,tNew,0.5)),()=>tag(ctx,840,470,"a true or false can't say so",WR_AMB,{size:19}));
  // a consumer still reading the old column strains
  const brA=fin(t,cB,0.5)*(1-fin(t,tNew+0.4,0.5));if(brA>0.01)withA(ctx,brA,()=>{const nx=1300,ny=640;ctx.save();ctx.strokeStyle=rgba(WR_AMB,0.9);ctx.lineWidth=2.4;ctx.beginPath();
    for(let k=0;k<=40;k++){const u=k/40,x=lerp(726,nx,u),y=lerp(418,ny,u)+Math.sin(u*30+t*14)*4*Math.sin(u*Math.PI);k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.restore();
    wr_node(ctx,nx,ny,"a consumer · reads is_revoked",WR_AMB,{on:1});tag(ctx,nx,ny+60,"breaks the old column",WR_AMB,{size:19});});
  // the versions, beside each other; v1 built from v2 with a date to go
  const yA=fin(t,tNew,0.5)*(1-fin(t,cT-0.6,0.5));
  if(yA>0.01){arrive(ctx,1320,307,t,tNew,()=>withA(ctx,yA,()=>wr_code(ctx,776,80,1084,"models/core/student/_core_student__models.yml",WR_VER,{size:18,lh:26,edge:TRUST,p:clamp((t-tNew)/2.4,0,1),lit:{4:fin(t,w("date","date to go"),0.4)},litCol:WR_AMB})),{dy:30});
    arrive(ctx,1320,702,t,w("date","built from")-0.2,()=>withA(ctx,yA,()=>wr_code(ctx,776,556,1084,"models/core/student/core_credential_v1.sql",WR_V1,{size:18,lh:27,edge:TRUST,p:clamp((t-w("date","built from"))/1.6,0,1),seg:[[5,"{{ ref('core_credential', v=2) }}",fin(t,w("date","built from")+0.8,0.4),TRUST],[0,"the logic lives once",fin(t,w("date","logic lives once"),0.4),TRUST]]})),{dy:30});
    withA(ctx,yA*fin(t,w("date","built from"),0.5),()=>{arrowTo(ctx,vx-12,vy+170,vx-12,vy-34,TRUST,1,{p:fin(t,w("date","built from"),0.8),head:12,bend:-0.3});tag(ctx,vx+20,vy+290,"v1 built from v2",TRUST,{size:19});});}
  // who to tell: lineage from core_credential to one exposure; Planning's dashboard stays dark
  const lA=fin(t,cT-0.2,0.6)*(1-fin(t,cC-0.4,0.6)*0.6),NX=720;
  if(lA>0.01)withA(ctx,lA,()=>{const N=[["mart_wallet__credentials",250,0],["mart_wallet__learners",350,0.25],["mart_planning__near_award",470,0.6]];
    N.forEach(([n,y,d],i)=>{const q=fin(t,w("tell","exposures")+d,0.5),dk=i===2?1:0;if(q<=0)return;if(!dk){ctx.strokeStyle=rgba(dk?[70,80,95]:LAYER4[3][1],0.6*q);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(vx+vw+6,vy+60);ctx.bezierCurveTo(NX-40,vy+60,NX-60,y,lerp(vx+vw,NX+70,q),y);ctx.stroke();}
      arrive(ctx,NX+150,y,t,w("tell","exposures")+d,()=>{const ww=wr_node(ctx,NX+70,y,n,LAYER4[3][1],{dark:dk,on:dk?0:fin(t,w("tell","only the wallet"),0.5)});
        withA(ctx,dk?1:fin(t,w("tell","only the wallet")-0.2,0.5),()=>{ctx.strokeStyle=rgba(dk?[70,80,95]:WR_CON,0.6);ctx.beginPath();ctx.moveTo(NX+70+ww+4,y);ctx.lineTo(1470,i===2?470:300);ctx.stroke();});},{from:0.85});});
    arrive(ctx,1510,300,t,w("tell","only the wallet")-0.2,()=>{wr_badge(ctx,1510,300,36,"wallet","wallet_app",{hi:1});kt_gtick(ctx,1545,268,13,fin(t,w("tell","pins")+0.8,0.4));},{from:0.7});
    arrive(ctx,1510,470,t,w("tell","exposures")+0.6,()=>wr_badge(ctx,1510,470,30,"planning","census_dashboard",{dark:1,size:18}),{from:0.7});
    arrive(ctx,NX+70,532,t,w("tell","exposures")+0.9,()=>withA(ctx,0.85,()=>tag(ctx,NX+70,532,"not downstream",SOFT,{size:18})),{dy:12});
    arrive(ctx,1700,300,t,w("tell","only the wallet"),()=>tag(ctx,1610,300,"one exposure",WR_CON,{size:19}),{from:0.7});});
  const lsA=fin(t,w("tell","say who")-0.2,0.5)*(1-fin(t,w("tell","pins")-0.3,0.4)),pnA=fin(t,w("tell","pins")-0.2,0.5)*(1-fin(t,cW-0.4,0.5));
  if(lsA>0.01)arrive(ctx,1160,650,t,w("tell","say who")-0.2,()=>withA(ctx,lsA,()=>wr_code(ctx,780,590,760,"lineage",["$ dbt ls --select core_credential+ --resource-type exposure","exposure:credentials.wallet_app"],{size:18,lh:30,edge:WR_CON,p:clamp((t-w("tell","say who"))/1.2,0,1)})),{dy:24});
  if(pnA>0.01)arrive(ctx,1160,690,t,w("tell","pins")-0.2,()=>withA(ctx,pnA,()=>wr_code(ctx,760,590,880,"models/marts/wallet/mart_wallet__credentials.sql",WR_WAL,{size:18,lh:30,edge:WR_CON,seg:[[2,"{{ ref('core_credential', v=2) }}",fin(t,w("tell","pins")+0.3,0.4),WR_CON]]})),{dy:24});
  // anyone still reading v1 gets dbt's warning, with the date
  const wA=fin(t,cW-0.2,0.5);
  if(wA>0.01){arrive(ctx,260,600,t,cW-0.2,()=>{ctx.strokeStyle=rgba(WR_AMB,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(vx+40,vy+244);ctx.lineTo(vx+40,580);ctx.stroke();wr_node(ctx,vx+60,604,"mart_wallet__old_reader",WR_AMB,{on:0.6});},{from:0.85});
    arrive(ctx,570,742,t,w("warn","dbt's warning"),()=>wr_code(ctx,80,650,960,"dbt's warning",WR_WARN,{size:18,lh:28,edge:WR_AMB,p:clamp((t-w("warn","dbt's warning"))/2.2,0,1),seg:[[1,"'2027-03-31T00:00:00+00:00'",fin(t,w("warn","with the date"),0.4),WR_AMB]]}),{dy:30});}
  // a choice with a deadline, not a surprise: the decision, with Noor's and Mei's approval
  const chA=fin(t,cC-0.2,0.5);
  if(chA>0.01){arrive(ctx,1450,678,t,cC,()=>wr_code(ctx,1060,570,780,"models/core/student/_student__decisions.yml",["  - id: DEC-STU-07","    title: core_credential version 2 replaces is_revoked with status","    …","    decided_by: Noor and Mei Tanaka","    informed: [Wallet app team]"],{wrap:68,size:18,lh:28,edge:KIND}),{dy:30});
    [["noor",1300],["mei",1460]].forEach(([id,x],i)=>{arrive(ctx,x,840,t,cC+0.6+i*0.3,()=>{wr_face(ctx,id,x,830,40,1,{t,name:PEOPLE[id].name.split(" ")[0]});kt_gtick(ctx,x+32,800,12,fin(t,cC+1.2+i*0.3,0.3));},{from:0.8});});
    arrive(ctx,960,140,t,w("choice","a choice"),()=>T(ctx,"a choice with a deadline",960,140,{w:800,size:40,align:"center",color:rgba(TRUST,1)}),{from:0.9});
    arrive(ctx,1660,840,t,w("choice","not as a surprise"),()=>tag(ctx,1560,840,"not a surprise",TRUST,{size:20}),{dy:14});}
  ctx.restore();vign(ctx,S);});

/* ---------- 8. The loop closes ---------- */
// who approved at which station: Planning at the question, Mei at the sources, the wallet team at its contract, the learning team at the tests' warn and stop, Jun at review, Noor at the versions
const WR_WHO=[[0,"planning"],[1,"mei"],[3,"wallet"],[4,"tom"],[7,"jun"],[9,"noor"]];
scene("loop",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:480});
  const cA=c("approved"),cN=c("new"),cD=c("declare"),CX=960,CY=470,RX=600,RY=310;
  const K=["A question","the sources","the consumers","gaps and","tests","layers","trusted number","review","written once","and change"];
  const on=K.map((s,i)=>fin(t,w("steps",s)-0.1,0.4)*(i===0?1-0.5*fin(t,cN-0.2,0.3)+0.5*fin(t,w("new","new question")+0.4,0.4):1));
  const lpA=1-fin(t,cD-0.3,0.8),teal=K.map((_,i)=>fin(t,w("approved","drafted")+i*0.1,0.3)),ticks=K.map((_,i)=>fin(t,w("approved","a person")+i*0.1,0.3));
  const ag=8.5+1.5*ease(fin(t,w("new","new question")+0.6,2.4)),agA=fin(t,cA-0.2,0.6);
  arrive(ctx,CX,CY,t,0,()=>wr_stepLoop(ctx,CX,CY,RX,RY,t,{a:lpA,on,teal,ticks,agent:ag%10,agentA:agA,settle:fin(t,w("new","new question")+2.2,1.0)}),{d:1.2,from:0.92});
  arrive(ctx,CX,CY-20,t,w("approved","drafted"),()=>withA(ctx,lpA,()=>tag(ctx,CX,CY-20,"the agent drafts and checks",KT_AI,{align:"center",size:20})),{dy:14});
  arrive(ctx,CX,CY+36,t,w("approved","a person"),()=>withA(ctx,lpA,()=>tag(ctx,CX,CY+36,"a person approves",TRUST,{align:"center",size:20})),{dy:14});
  // the people of the series, each at the station where they approved
  WR_WHO.forEach(([i,id],k)=>{const an=-Math.PI/2+i/10*TAU,px=CX+Math.cos(an)*(RX-190),py=CY+Math.sin(an)*(RY-140),t0=w("approved","a person")+0.3+k*0.18;
    arrive(ctx,px,py,t,t0,()=>withA(ctx,lpA,()=>{if(id==="planning"||id==="wallet")wr_badge(ctx,px,py,28,id,null,{});else wr_face(ctx,id,px,py,30,1,{t,name:PEOPLE[id].name.split(" ")[0]});}),{from:0.75});});
  // a new question arrives, from the wallet team, at the first station
  arrive(ctx,1220,96,t,w("new","new question")-0.2,()=>withA(ctx,lpA,()=>wr_qcard(ctx,1030,52,380,1,t)),{d:0.9,dy:-30,from:0.85});
  arrive(ctx,CX,CY+100,t,w("new","starts again"),()=>withA(ctx,lpA,()=>tag(ctx,CX,CY+100,"the loop starts again",WEED,{align:"center",size:20})),{dy:14});
  // declare it, then build it: the credential blueprint over the lineage graph, as at the end of the first film
  const dA=fin(t,cD-0.3,0.9);if(dA>0.01)withA(ctx,dA,()=>{lineageGraph(ctx,260,520,1400,380,t,{core:1,dim:0.35,heads:0.8});
    arrive(ctx,960,250,t,cD-0.1,()=>{bpPaper(ctx,560,110,800,280,1,{title:"CREDENTIAL MODEL · v3"});bpModel(ctx,960,290,0.62,{b:1});},{d:1.1,from:0.9,dy:-20});
    arrive(ctx,960,440,t,w("declare","Then build"),()=>T(ctx,"Declare it. Then build it.",960,450,{w:800,size:34,align:"center"}),{dy:14});});
  ctx.restore();weedsEnd(ctx,S,t,B,"Written once",WEED,"One home per fact. Everything else, generated.");
  vign(ctx,S);});
