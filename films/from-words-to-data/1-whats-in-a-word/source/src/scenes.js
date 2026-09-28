/* ===== What's in a word: scenes =====
   Ten chapters, as in ../script.md. Graduation week: four offices give four answers to "how many credentials did we award?".
   To see why, the film goes back before writing and before words: kinds without words, calls that point, what words add,
   one idea in many forms, the grain of a word, fuzzy edges and drifting meanings. Then the offices agree, on paper. */
const CRED_Q="How many credentials did we award this year?";
const ANS=[["reg",7420],["short",10600],["careers",14650],["lms",26900]];
const ANS_MEANING={reg:"awards: degrees and diplomas",short:"awards and microcredentials",careers:"plus every badge, even for turning up",lms:"plus every certificate of completion"};

/* ---------- 1. Four answers ---------- */
scene("answers",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const back=fin(t,c("back")+0.4,1.4);
  withA(ctx,1-back*0.96,()=>{
    tag(ctx,120,120,"Graduation week",TRUST,{size:22});
    // gowns and caps drifting down, for the week that's in it
    for(let i=0;i<14;i++){const x=(hash(i,2)*1920+t*12)%1920,y=((hash(i,3)*1200+t*(24+hash(i,4)*20))%1300)-120,r=Math.sin(t*0.8+i)*0.6;ctx.save();ctx.translate(x,y);ctx.rotate(r);ctx.fillStyle="rgba(255,209,102,0.10)";ctx.fillRect(-16,-4,32,8);ctx.fillRect(-4,-4,8,14);ctx.restore();}
    person(ctx,"david",300,880,0.62,{t,pose:t>c("q")&&t<c("four")?"explain":"stand",expr:t>c("none")?"relieved":"calm"});
    withA(ctx,fin(t,c("q")+0.6,0.6),()=>bubble(ctx,140,210,560,CRED_Q,TRUST,{size:30}));
    // four offices, four numbers, counted up as the narrator reads them
    const nT=c("nums"),gap=[0.2,2.4,4.6,6.9];
    ANS.forEach(([k,v],i)=>{const x=860+(i%2)*500,y=190+Math.floor(i/2)*250,a=fin(t,c("four")+0.3+i*0.25,0.5),n=countTo(t,nT+gap[i],0,v);
      officeCard(ctx,x,y,460,k,t>nT+gap[i]?fmtNum(n):"…",{a,ok:fin(t,c("none")+1.0+i*0.3,0.4),hi:pulseAt(t,nT+gap[i]+0.3,1.2)});});
    // one word over all four
    const w1=fin(t,c("none")+2.6,0.6);if(w1>0){withA(ctx,w1,()=>{[[1090,190],[1590,190],[1090,440],[1590,440]].forEach(([x,y])=>{ctx.strokeStyle=rgba(TRUST,0.35);ctx.lineWidth=1.5;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(1340,112);ctx.lineTo(x,y+2);ctx.stroke();ctx.setLineDash([]);});
      tag(ctx,1340,100,"“credential”",TRUST,{align:"center",size:26});});}});
  // going back: the years roll back, past writing, to before words
  if(back>0){const u=clamp((t-c("back")-0.6)/3.4,0,1),stops=["2026","1964","1494","c. 3300 BCE","before words"],k=Math.min(stops.length-1,Math.floor(ease(u)*stops.length));
    withA(ctx,back*(1-fin(t,B,0.6)),()=>{glow(ctx,960,470,260,WA_INK,0.12);T(ctx,stops[k],960,500,{w:800,size:k===4?72:96,align:"center",color:rgba(k>=3?CLAY:INK,1)});
      motifDots(ctx,960,580,10,WA_INK,0.6,u);});}
  seriesTitle(ctx,S,t,B,"What's in a word","how minds and words make the first data model",WA_INK);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Kinds without words ---------- */
const PHOTOS=[[0,1],[1,0],[2,1],[3,0],[4,0],[5,1],[6,1],[7,0],[8,0],[9,1],[10,0],[11,1]];
scene("kinds",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const nw=fin(t,c("noword")+0.2,0.8),fs=fin(t,c("first")+0.2,0.8);
  // left: the pigeons and the photos
  yearTag(ctx,120,120,"1964 · pigeons and photos",CLAY,fin(t,0.3,0.6));
  const pk=Math.floor(Math.max(0,t-c("pigeons")-1.5)/1.1);
  // sorted without words: photos with people gather on the right, the others on the left, three by two
  const slot=i=>{const has=PHOTOS[i][1],j=PHOTOS.filter((q,n)=>q[1]===has&&n<i).length,gx=has?640:250,gy=600;return[gx-180+(j%3)*120,gy-90+Math.floor(j/3)*90];};
  PHOTOS.forEach(([k,has],i)=>{const cx=150+(i%4)*175,cy=180+Math.floor(i/4)*135,sorted=slot(i);
    const x=lerp(cx,sorted[0],nw),y=lerp(cy,sorted[1],nw),w=lerp(150,110,nw),h=lerp(110,80,nw);
    const order=PHOTOS.filter(q=>q[1]).indexOf(PHOTOS[i]),mk=has&&order>=0&&order<=pk?fin(t,c("pigeons")+1.5+order*1.1,0.3):0;
    photoTile(ctx,x,y,w,h,k,has,fin(t,0.4+i*0.08,0.4),mk*(1-nw));});
  withA(ctx,1-nw,()=>{const tgt=PHOTOS.filter(q=>q[1])[Math.min(5,pk)]||PHOTOS[0],ti=PHOTOS.indexOf(tgt),px=150+(ti%4)*175+75,py=180+Math.floor(ti/4)*135+140,bob=Math.abs(Math.sin((t-c("pigeons"))*5.7))*14;
    {const c0=c("pigeons"),LIT=PHOTOS.filter(q=>q[1]),st=k=>{const i=PHOTOS.indexOf(LIT[k]);return[c0+1.38+k*1.1,190+(i%4)*175,350+Math.floor(i/4)*135,1];},R=bd_route(t,[[c0-0.55,120,350,0],st(0),st(3),st(5),[c0+11.1,630,620,0],[c0+16.05,700,620,0]],1.45);pigeon(ctx,R.x,R.y,1.45,[210,220,240],Object.assign({a:fin(t,0.6,0.6),t},R));}
    withA(ctx,fin(t,c("pigeons")+4.0,0.6),()=>tag(ctx,450,640,"people? peck",GOOD,{align:"center",size:20}));});
  // right: the bee, choosing the same
  const bT=c("bees"),ph2=fin(t,bT+3.4,0.3),sample=ph2>0.5?"hstripes":"blue",opts=ph2>0.5?["vstripes","hstripes"]:["blue","yellow"],ok=ph2>0.5?1:0;
  withA(ctx,fin(t,bT-0.2,0.6)*(1-nw),()=>{T(ctx,"the sample",1450,210,{w:700,size:20,align:"center",color:rgba(SOFT,1)});beeCard(ctx,1450,300,130,sample,1,false);
    opts.forEach((k,i)=>beeCard(ctx,1300+i*300,560,130,k,1,i===ok&&t>bT+(ph2>0.5?5.2:2.2)));
    {const F=bd_flight(t,[[bT-0.4,1590,285,-1],[bT+0.5,1588,292,-1],[bT+1.1,1560,405,-1],[bT+1.5,1450,430,-1],[bT+2,1305,426,-1],[bT+2.7,1300,428,-1],[bT+3,1330,440,1],[bT+3.4,1525,445,1],[bT+3.8,1596,300,1],[bT+4.2,1590,292,-1],[bT+5.1,1605,426,-1]]);bee(ctx,F.x,F.y,2.4,t,{a:1,vx:F.vx,vy:F.vy,face:F.face});}
    withA(ctx,fin(t,bT+(ph2>0.5?5.4:2.4),0.3),()=>tag(ctx,1300+ok*300,665,"same",GOOD,{align:"center",size:20}));});
  // no words: two kinds, sorted without a single word
  withA(ctx,nw,()=>{bubble(ctx,760,110,400,"no words",BAD,{size:30});cross_(ctx,1100,150,40,BAD,1);
    [[635,595,"with people",GOOD],[245,595,"without",SOFT]].forEach(([x,y,s,col])=>{ring(ctx,x,y,215,col,0.55,2,[8,10]);T(ctx,s,x,y+245,{w:700,size:20,align:"center",color:rgba(col,1)});});
    [["same",1350],["different",1650]].forEach(([s,x],i)=>{beeCard(ctx,x-60,470,90,i?"yellow":"blue",1,false);beeCard(ctx,x+50,470,90,i?"vstripes":"hstripes",1,false);ring(ctx,x,470,140,i?SOFT:GOOD,0.5,2,[8,10]);});});
  // concepts first, then words that point at them
  withA(ctx,fs,()=>{[[635,330],[1350,300],[1650,300]].forEach(([x,y],i)=>{glow(ctx,x,y,70,KIND,0.5+0.2*Math.sin(t*2+i));ctx.fillStyle=rgba(mix(KIND,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,y,16,0,TAU);ctx.fill();});
    T(ctx,"a concept",980,318,{w:700,size:22,align:"center",color:rgba(KIND,1)});arrowTo(ctx,900,312,680,326,KIND,0.6,{head:10,lw:1.6});arrowTo(ctx,1060,312,1310,300,KIND,0.6,{head:10,lw:1.6});
    withA(ctx,fin(t,c("first")+1.8,0.6),()=>{[["person",635,230],["same",1350,200],["different",1650,200]].forEach(([s,x,y])=>{tag(ctx,x,y,s,WA_INK,{align:"center",size:22});arrowTo(ctx,x,y+24,x,y+78,WA_INK,0.8,{head:10,lw:2});});});});
  vign(ctx,S);});

/* ---------- 3. Calls that point ---------- */
const MONK=[[500,745],[600,752],[700,742],[800,750]];
const TREE_SPOTS=[[230,560],[340,520],[270,470],[390,590]],BUSH_SPOTS=[[990,768],[1060,760],[1130,768],[1200,764]];
scene("calls",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const nm=fin(t,c("names")-0.2,0.9),idA=fin(t,c("ids")+0.2,0.8),cL=c("leopard"),cE=c("eagle"),cS=c("snake");
  const wL=fin(t,cL+1.0,1.2)*(1-fin(t,cE+0.3,0.8)),wE=fin(t,cE+1.4,1.1)*(1-fin(t,cS+0.3,0.8)),wS=fin(t,cS+0.8,0.8);
  withA(ctx,1-nm,()=>{
    // the grassland at dusk
    ground(ctx,760,t);
    tree(ctx,300,770,1.5,1,t);bush(ctx,1085,770,1.5,1,t);grass(ctx,0,1920,770,t,0.9);
    yearTag(ctx,120,120,"vervet monkeys · alarm calls",CLAY,fin(t,0.3,0.6));
    // the hunters, each with its own call
    leopard(ctx,lerp(2000,1500,fin(t,cL-0.5,3.4)),700,2.2,LEO,{a:fin(t,cL-0.4,0.5)*(1-fin(t,cE,0.6)),t,flip:1,walk:-500*(1-fin(t,cL-0.5,3.4))});
    {const u=fin(t,cE-0.7,4.4);eagle(ctx,lerp(1990,1060,u)-Math.max(0,t-cE-3.7)*12,lerp(440,360,u)+Math.sin(t*1.2)*6,1.3,EAG,{a:fin(t,cE-0.3,0.5)*(1-fin(t,cS,0.6)),t,yaw:lerp(-0.95,-0.6,u),bank:0.15,elev:1.2});}
    snake(ctx,1420,748,1.3,SNK,{a:fin(t,cS-0.2,0.5)*(1-fin(t,c("kind")+2,0.8)),t,flip:1,crawl:t-cS});
    [[cL,LEO],[cE,EAG],[cS,SNK]].forEach(([c0,col])=>{const u=clamp((t-c0-0.3)/1.4,0,1);if(u>0&&u<1)for(let k=0;k<3;k++){const r=40+u*260+k*40;ring(ctx,MONK[1][0]+30,MONK[1][1]-40,r,col,(1-u)*0.7,3);}});
    MONK.forEach((m,i)=>{let x=m[0],y=m[1];x+=(TREE_SPOTS[i][0]-m[0])*wL+(BUSH_SPOTS[i][0]-m[0])*wE;y+=(TREE_SPOTS[i][1]-m[1])*wL+(BUSH_SPOTS[i][1]-m[1])*wE-30*wS;
      monkey(ctx,x,y-44+30*wS,1.4,[225,205,175],{a:1,t,i,tree:wL,bush:wE,tall:wS,calls:[cL,cE,cS],path:[m,TREE_SPOTS[i],BUSH_SPOTS[i]]});if(wE>0.2&&wE<0.99)withA(ctx,wE,()=>T(ctx,"↑",x,y-100,{w:800,size:26,align:"center",color:rgba(EAG,1)}));if(wS>0.2)withA(ctx,wS,()=>T(ctx,"↓",x+16,y-96,{w:800,size:24,align:"center",color:rgba(SNK,1)}));});
    // the low front of the bush, over the monkeys that dive into it
    bush(ctx,1085,770,1.5,wE,t,{front:1});
    // the three calls, and what each one means
    [[cL,LEO,"leopard call","up into the trees"],[cE,EAG,"eagle call","look up, into the bushes"],[cS,SNK,"snake call","stand tall, search the grass"]].forEach(([c0,col,a1,a2],i)=>
      withA(ctx,fin(t,c0+0.4,0.5),()=>{glass(ctx,1240,110+i*96,560,76,16,col,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.92)"});ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(1276,148+i*96,9,0,TAU);ctx.fill();
        T(ctx,a1,1300,140+i*96,{w:800,size:22,color:rgba(col,1)});T(ctx,"→ "+a2,1300,168+i*96,{w:600,size:19});}));
    withA(ctx,fin(t,c("kind")+0.6,0.6),()=>{ctx.strokeStyle=rgba(KIND,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(1812,112);ctx.lineTo(1830,112);ctx.lineTo(1830,378);ctx.lineTo(1812,378);ctx.stroke();tag(ctx,1640,420,"each call: a kind of thing",KIND,{align:"center",size:20});});});
  // names: one particular animal
  withA(ctx,nm*(1-idA),()=>{[[dolphin,"dolphins",330],[elephant,"elephants",960],[marmoset,"marmosets",1590]].forEach(([f,s,x],i)=>{const a=fin(t,c("names")+0.4+i*0.7,0.6);
    withA(ctx,a,()=>{glass(ctx,x-250,230,500,440,22,NAMEC,{glow:14,ea:0.6,fill:"rgba(7,12,24,0.9)"});f(ctx,x,420,1.7,undefined,{a:1,t:t+i*1.3});T(ctx,s,x,300,{w:800,size:28,align:"center",color:rgba(NAMEC,1)});
      nameWave(ctx,x-160,560,320,70,i,NAMEC,1,clamp((t-c("names")-0.7-i*0.7)/1.4,0,1));T(ctx,"a call like a name",x,640,{w:600,size:19,align:"center",color:rgba(SOFT,1)});});});});
  // categories and identifiers
  withA(ctx,idA,()=>{glass(ctx,240,220,660,440,24,LEO,{glow:16,ea:0.75,fill:"rgba(7,12,24,0.92)"});leopard(ctx,570,420,1.5,LEO,{a:1,t});T(ctx,"a kind of thing",570,300,{w:800,size:30,align:"center",color:rgba(LEO,1)});T(ctx,"category",570,580,{f:"mono",w:500,size:26,align:"center",color:rgba(INK,0.95)});
    glass(ctx,1020,220,660,440,24,NAMEC,{glow:16,ea:0.75,fill:"rgba(7,12,24,0.92)"});dolphin(ctx,1350,410,1.5,NAMEC,{a:1,t});nameWave(ctx,1230,500,240,40,0,NAMEC,1,1);T(ctx,"one particular thing",1350,300,{w:800,size:30,align:"center",color:rgba(NAMEC,1)});T(ctx,"identifier",1350,580,{f:"mono",w:500,size:26,align:"center",color:rgba(INK,0.95)});
    withA(ctx,fin(t,c("ids")+3.2,0.6),()=>tag(ctx,960,740,"every data model needs both",KIND,{align:"center",size:26}));});
  vign(ctx,S);});

/* ---------- 4. What words add ---------- */
const TILES=["yesterday","a promise","a rule","tomorrow","we","if","never","here","not","will","keep","made"];
const PHRASES=[[4,1,0],[2,3],[5,6]];
scene("words",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const cb=fin(t,c("combine")-0.2,0.8),kn=fin(t,c("know")-0.2,0.8),fo=fin(t,c("fossil")-0.2,0.8);
  // pointing: a baby, a bird, and someone looking where the baby looks
  withA(ctx,1-cb,()=>{const bx=1040,by=330;robin(ctx,bx,by,1.6,{a:1,t});perch(ctx,bx,by+36,320,t);
    baby(ctx,520,720,2.0,fin(t,0.3,0.6),fin(t,c("point")+0.4,0.9));person(ctx,"mei",1500,900,0.62,{t,expr:"calm"});
    const ja=fin(t,c("point")+2.0,0.8);withA(ctx,ja,()=>{[[680,640],[1500,560]].forEach(([x,y])=>{ctx.strokeStyle=rgba(WA_INK,0.8);ctx.lineWidth=2.2;ctx.setLineDash([6,9]);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(bx,by+10);ctx.stroke();ctx.setLineDash([]);});tag(ctx,1060,520,"shared attention",WA_INK,{align:"center",size:22});});
    withA(ctx,fin(t,c("root")+0.6,0.6),()=>{[["this one",850,220],["here",1230,210],["that",1300,380]].forEach(([s,x,y],i)=>withA(ctx,fin(t,c("root")+0.8+i*0.5,0.4),()=>tag(ctx,x,y,s,KIND,{align:"center",size:24})));});});
  // combining without limit, and reaching what isn't here
  withA(ctx,cb*(1-kn),()=>{const u=clamp((t-c("combine")-1.2)/3,0,1);TILES.forEach((s,i)=>{let x=240+(i%6)*250,y=250+Math.floor(i/6)*110;
      PHRASES.forEach((ph,r)=>{const j=ph.indexOf(i);if(j>=0){const tx=520+j*230,ty=470+r*100;x=lerp(x,tx,ease(clamp(u*3-r,0,1)));y=lerp(y,ty,ease(clamp(u*3-r,0,1)));}});
      glass(ctx,x-95,y-30,190,60,12,WA_INK,{glow:8,ea:0.5,fill:"rgba(26,18,12,0.92)"});T(ctx,s,x,y+9,{w:700,size:24,align:"center",color:rgba(PARCH,1)});});
    withA(ctx,fin(t,c("combine")+5.0,0.6),()=>tag(ctx,960,160,"words reach what isn't here",KIND,{align:"center",size:24}));});
  // what someone knows: invisible, until a record shows it
  withA(ctx,kn*(1-fo),()=>{person(ctx,"mei",560,900,0.8,{t,expr:"calm"});const u=0.5+0.5*Math.sin(t*1.6);
    ctx.save();ctx.setLineDash([8,10]);ctx.strokeStyle=rgba(KIND,0.35+0.2*u);ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(560,230,220,90,0,0,TAU);ctx.stroke();ctx.restore();
    T(ctx,"what she knows",560,238,{w:700,size:26,align:"center",color:rgba(KIND,0.5+0.3*u)});T(ctx,"(you can't see it)",560,272,{w:600,size:18,align:"center",color:rgba(SOFT,0.8)});
    const rA=fin(t,c("know")+3.4,0.8);arrowTo(ctx,800,300,1010,360,TRUST,rA,{bend:-0.2});
    credCard(ctx,1050,280,560,{a:rA,era:"paper",title:"Diploma of Languages",issuer:"the university",holder:"Mei Tanaka",claim:"Spanish, advanced",date:"2019",press:fin(t,c("know")+4.2,0.5)});
    withA(ctx,fin(t,c("know")+4.8,0.6),()=>tag(ctx,1330,700,"a record shows it",TRUST,{align:"center",size:22}));});
  // no fossils
  withA(ctx,fo,()=>{strata(ctx,t);
    const qa=fin(t,c("fossil")+2.4,0.6);withA(ctx,qa,()=>{ctx.save();ctx.setLineDash([10,10]);ctx.strokeStyle=rgba(KIND,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(1000,560,120,70,0,0,TAU);ctx.stroke();ctx.restore();T(ctx,"?",1000,582,{w:800,size:64,align:"center",color:rgba(KIND,1)});});
    withA(ctx,fin(t,c("fossil")+3.2,0.6),()=>tag(ctx,960,180,"words leave no fossils",CLAY,{align:"center",size:26}));});
  vign(ctx,S);});

/* ---------- 5. One idea, many forms ---------- */
scene("forms",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  const tr=fin(t,c("tri")-0.2,0.9),cT=c("cell"),hits=[cT+2.6,cT+4.2,cT+6.0],act=Math.max(...hits.map(h=>pulseAt(t,h,1.2)),fin(t,c("one"),0.6)*0.8);
  withA(ctx,1-tr,()=>{yearTag(ctx,120,120,"2005 · concept cells",CLAY,fin(t,0.3,0.6));brain(ctx,1380,470,2.4,t,act,fin(t,0.4,0.8));
    [["photo","a photo"],["drawing","a drawing"],["name","her written name"]].forEach(([k,l],i)=>{const x=120+i*240,y=300,a=fin(t,cT+1.0+i*0.5,0.5),hi=pulseAt(t,hits[i],1.2);portrait(ctx,x,y,k,a,hi);withA(ctx,a,()=>T(ctx,l,x+100,y+270,{w:700,size:20,align:"center",color:rgba(SOFT,1)}));
      const u=clamp((t-hits[i]+0.6)/0.6,0,1);if(u>0&&t<hits[i]+1.2){ctx.strokeStyle="rgba(255,236,160,"+(0.8*(1-fin(t,hits[i]+0.6,0.6)))+")";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+200,y+117);ctx.lineTo(lerp(x+200,1414,u),lerp(y+117,532,u));ctx.stroke();}});
    withA(ctx,fin(t,c("one")+0.2,0.6),()=>tag(ctx,1414,680,"many forms, one idea",[255,236,160],{align:"center",size:24}));});
  withA(ctx,tr,()=>{const e1=fin(t,c("tri")+1.6,1.0),e2=fin(t,c("tri")+3.6,1.0),e3=fin(t,c("gap")+0.4,1.2);
    trio(ctx,960,470,1.15,{t,word:"Mei Tanaka",idea:"the idea of Mei",thing:(cx,x,y,s)=>person(cx,"mei",x,y+40*s,0.36*s,{t}),thingLab:"Mei herself",thingDy:92,e1,e2,e3,wa:fin(t,c("tri")+0.6,0.5),ia:fin(t,c("tri")+1.2,0.5),ha:fin(t,c("tri")+3.0,0.5),gapNote:fin(t,c("gap")+1.6,0.6),gapText:"the word never touches the thing"});
    withA(ctx,fin(t,c("gap")+3.2,0.6),()=>tag(ctx,960,800,"misunderstandings live in the gap",EDGE_,{align:"center",size:24}));});
  vign(ctx,S);});

/* ---------- 6. Which part do you mean? ---------- */
scene("gavagai",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);bg2(ctx);
  ground(ctx,700,t);grass(ctx,0,1920,710,t,0.8);
  yearTag(ctx,120,120,"1960 · a philosopher's puzzle",CLAY,fin(t,0.3,0.6));
  const run=fin(t,0.6,4.0),rx=lerp(200,900,run),ry=660;rabbit(ctx,rx,ry,1.9,[235,225,205],t,{run:1,dist:rx-200+(t>2.6?175*Math.pow(Math.min(1,(t-2.6)/2),3)+262.5*Math.max(0,t-4.6):0)});
  // the stranger's pointing arm, and the word
  pointArm(ctx,-60,560,230,480,1.1,fin(t,c("rabbit")+0.8,0.6));
  withA(ctx,fin(t,c("rabbit")+3.2,0.4),()=>bubble(ctx,300,250,340,"gavagai!",WA_INK,{size:44}));
  // three things the word could mean
  const mT=c("mean"),opt=[["the rabbit",mT+0.4],["its ears",mT+1.6],["this moment of running",mT+2.8]];
  opt.forEach(([s,t0],i)=>{const a=fin(t,t0,0.5),hi=pulseAt(t,t0,1.6);withA(ctx,a,()=>{
    if(i===0)ring(ctx,rx,ry-10,120,KIND,0.5+0.5*hi,3);if(i===1){ring(ctx,rx+56,ry-96,44,KIND,0.5+0.5*hi,3);}if(i===2){ctx.strokeStyle=rgba(KIND,0.5+0.5*hi);ctx.lineWidth=3;ctx.strokeRect(rx-150,ry-150,300,230);for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(rx-200-k*30,ry-80+k*30);ctx.lineTo(rx-160-k*30,ry-80+k*30);ctx.stroke();}}
    glass(ctx,1240,230+i*120,560,86,18,KIND,{glow:10+10*hi,ea:0.6+0.4*hi,fill:"rgba(7,12,24,0.92)"});T(ctx,s,1270,283+i*120,{w:700,size:28});});});
  // children guess the whole thing
  withA(ctx,fin(t,c("kids")+1.0,0.6),()=>{baby(ctx,1120,780,1.3,1,0.9);tick_(ctx,1770,273,34,GOOD,1);tag(ctx,1500,190,"children: the whole thing",GOOD,{align:"center",size:22});});
  // the grain
  withA(ctx,fin(t,c("grain")+1.8,0.6),()=>{glass(ctx,1240,630,560,150,20,TRUST,{glow:16,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(ctx,"the grain",1270,680,{w:800,size:28,color:rgba(TRUST,1)});T(ctx,"what counts as one?",1270,722,{w:600,size:24});T(ctx,"1 row = 1 rabbit? 1 ear? 1 moment?",1270,758,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});});
  vign(ctx,S);});

/* ---------- 7. Fuzzy edges ---------- */
const BIRDS=[[(c,x,y,s,a,t)=>robin(c,x,y,s,{a,t}),0,0,1.3],[(c,x,y,s,a,t)=>sparrow(c,x,y,s,{a,t}),-110,40,1.1],[(c,x,y,s,a,t)=>pigeon(c,x,y,s,undefined,{a,t}),190,-120,0.9],[(c,x,y,s,a,t)=>eagle(c,x,y,s,undefined,{a,t}),-230,-150,0.8],[(c,x,y,s,a,t)=>penguin(c,x,y,s,{a,t}),290,150,1.2],[(c,x,y,s,a,t)=>ostrich(c,x,y,s,{a,t}),-300,160,1.1]];
const CREDS=[["degree",-40,-18,0],["diploma",45,32,0],["microcredential",-135,-105,1],["badge · assessed",175,-135,2],["badge · turned up",180,150,3],["certificate of completion",-235,200,4]];
const RINGS=[["reg",95],["short",185],["careers",262],["lms",345]];
scene("edges",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");setScreen(ctx,S);bg2(ctx);
  const cx=900,cy=450,cr=fin(t,c("cred")-0.2,0.9);
  withA(ctx,1-cr,()=>{fuzzyRing(ctx,cx,cy,330,KIND,fin(t,c("typical"),0.8),70);glow(ctx,cx,cy,200,TRUST,0.2*fin(t,c("typical"),0.8));
    BIRDS.forEach(([f,dx,dy,s],i)=>{const a=fin(t,0.4+i*0.5,0.5),edge=Math.hypot(dx,dy)>250;f(ctx,cx+dx+Math.sin(t*0.45+i*1.9)*4,cy+dy+Math.sin(t*0.6+i*2.7)*5,s,a*(edge?0.75:1),t+i*7);});
    T(ctx,"bird",cx,180,{w:800,size:30,align:"center",color:rgba(KIND,1)});
    withA(ctx,fin(t,c("typical")+0.6,0.5),()=>{tag(ctx,cx,cy+90,"typical",TRUST,{align:"center",size:20});tag(ctx,cx+330,cy-20,"fuzzy edge",KIND,{align:"center",size:20});});
    withA(ctx,fin(t,c("agree")+0.2,0.5),()=>{tag(ctx,1500,380,"agree in the middle",GOOD,{align:"center",size:24});tag(ctx,1500,470,"argue at the edges",EDGE_,{align:"center",size:24});});});
  withA(ctx,cr,()=>{fuzzyRing(ctx,cx,cy,300,KIND,0.45,60);
    CREDS.forEach(([s,dx,dy,lv],i)=>{const a=fin(t,c("cred")+0.4+i*0.35,0.5);withA(ctx,a,()=>{const w=tw(ctx,s,20,700)+36;glass(ctx,cx+dx-w/2,cy+dy-22,w,44,22,lv<1?TRUST:lv<2?OFFICE.short.c:lv<4?OFFICE.careers.c:OFFICE.lms.c,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.92)"});T(ctx,s,cx+dx,cy+dy+7,{w:700,size:20,align:"center"});});});
    T(ctx,"credential",cx-520,120,{w:800,size:34,align:"center",color:rgba(TRUST,1)});T(ctx,"one word, and what it takes in",cx-520,156,{w:600,size:19,align:"center",color:rgba(SOFT,1)});
    // each office draws its own boundary
    RINGS.forEach(([k,r],i)=>{const a=fin(t,c("cred")+6.5+i*0.9,0.7),col=OFFICE[k].c;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=3;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(cx,cy,Math.max(0,r*clamp(a*1.2,0,1)+Math.sin(t*1.5+i)*2),0,TAU);ctx.stroke();ctx.restore();
      withA(ctx,a,()=>{const ly=cy-r-6,w=tw(ctx,OFFICE[k].n,17,700)+24;ctx.fillStyle="rgba(7,12,24,0.9)";rr(ctx,cx-w/2,ly-16,w,30,15);ctx.fill();T(ctx,OFFICE[k].n,cx,ly+5,{w:700,size:17,align:"center",color:rgba(col,1)});
        T(ctx,fmtNum(ANS[i][1]),1560,300+i*110,{w:800,size:48,color:rgba(col,1)});T(ctx,OFFICE[k].n,1560,330+i*110,{w:600,size:18,color:rgba(SOFT,1)});});});});
  withA(ctx,fin(t,B+0.4,0.8),()=>tag(ctx,1500,760,"four boundaries, one word",TRUST,{align:"center",size:22}));
  vign(ctx,S);});

/* ---------- 8. Words drift ---------- */
scene("drift",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);histBg(ctx,S,t);
  const st=fin(t,c("still")-0.2,0.8),mv=fin(t,c("move")-0.2,0.8);
  withA(ctx,1-st,()=>{etym(ctx,240,210,{a:fin(t,c("nice")+0.3,0.5),p:clamp((t-c("nice")-0.4)/1.6,0,1),old:"foolish",lang:"nice, in the 1300s",word:"nice",gloss:"then: foolish · now: pleasant",gap:300});
    const cT=c("cred");
    etym(ctx,240,410,{a:fin(t,cT+0.2,0.5),p:clamp((t-cT-0.3)/1.4,0,1),old:"credere",lang:"Latin",word:"credential",gloss:"to believe",gap:280});
    etym(ctx,240,570,{a:fin(t,cT+2.6,0.5),p:clamp((t-cT-2.7)/1.4,0,1),old:"en rolle",lang:"Old French",word:"enrol",gloss:"on the roll",gap:280});
    etym(ctx,240,730,{a:fin(t,cT+4.9,0.5),p:clamp((t-cT-5.0)/1.4,0,1),old:"diplōma",lang:"Greek",word:"diploma",gloss:"folded in two",gap:280});
    roll(ctx,1350,340,380,200,["Tanaka, M.","Okafor, S.","Ruiz, A.","Carter, B."],clamp((t-cT-2.8)/2,0,1),fin(t,cT+2.6,0.6));
    // a sheet, folding in two
    const fd=clamp((t-cT-5.4)/1.2,0,1);withA(ctx,fin(t,cT+4.9,0.5),()=>{ctx.save();ctx.translate(1540,700);ctx.fillStyle="#efe6d2";ctx.fillRect(-150,-90,150,180);ctx.save();ctx.scale(Math.cos(fd*Math.PI*0.96),1);ctx.fillStyle=fd>0.5?"#d8ccb2":"#efe6d2";ctx.fillRect(0,-90,150,180);ctx.restore();ctx.strokeStyle="rgba(120,90,50,0.5)";ctx.beginPath();ctx.moveTo(0,-90);ctx.lineTo(0,90);ctx.stroke();ctx.restore();});});
  // an ambassador's letters of credence
  withA(ctx,st*(1-mv),()=>{yearTag(ctx,120,120,"today · letters of credence",CLAY,1);const u=ease(clamp((t-c("still")-0.6)/1.8,0,1));
    const lx=700+u*140;pointArm(ctx,-80,560,lx-150,540,1.2,1);pointArm(ctx,2000,600,lx+560,560,1.2,u);
    credCard(ctx,700+u*140,380,420,{a:1,era:"wax",title:"Letter of credence",issuer:"a head of state",holder:"the ambassador",claim:"trust this person",rot:-0.03,rh:40});
    withA(ctx,fin(t,c("still")+2.6,0.6),()=>tag(ctx,960,800,"credential: the letter that asks for trust",TRUST,{align:"center",size:24}));});
  // meaning moves along a line of years
  withA(ctx,mv,()=>{const x0=200,x1=1720,y=560;ctx.strokeStyle=rgba(CLAY,0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();
    [["1300",0],["1600",0.3],["1800",0.55],["1900",0.72],["2026",1]].forEach(([s,u])=>{ctx.fillStyle=rgba(CLAY,1);ctx.beginPath();ctx.arc(lerp(x0,x1,u),y,6,0,TAU);ctx.fill();T(ctx,s,lerp(x0,x1,u),y+44,{f:"mono",w:500,size:18,align:"center",color:rgba(CLAY,1)});});
    const u=ease(clamp((t-c("move")-0.4)/3.2,0,1)),m=["foolish","shy","precise","pleasant"][Math.min(3,Math.floor(u*4))];
    tag(ctx,lerp(x0,x1,u),y-80,"nice: "+m,KIND,{align:"center",size:24});
    withA(ctx,fin(t,c("move")+2.0,0.6),()=>tag(ctx,lerp(x0,x1,0.9),y-170,"credential → microcredential",TRUST,{align:"center",size:22}));});
  vign(ctx,S);});

/* ---------- 9. Agreed on paper ---------- */
const DEF="credential: a trusted statement, that others can check, that someone has shown what they know or can do.";
scene("paper",(ctx,S,t,sc)=>{const c=id=>cue(sc,id);setScreen(ctx,S);
  // a quiet room: warm light on a board, the four offices around it
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#15110d");g.addColorStop(1,"#07060a");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);glow(ctx,820,380,700,[255,220,170],0.08);
  const ans=fin(t,c("answer")-0.2,0.8);
  sheet(ctx,300,70,1040,760,{a:fin(t,0.3,0.8),rot:-0.008});
  const sx=300,sy=70;
  // the definition, written out
  const dA=clamp((t-c("def")-0.2)/4.2,0,1),lines=wrapT(ctx,DEF,0,0,900,{size:30,w:600,measure:true});let left=Math.round(DEF.length*dA);
  lines.forEach((l,i)=>{const n=Math.max(0,Math.min(l.length,left));left-=l.length+1;if(n>0)pencilText(ctx,l.slice(0,n),sx+90,sy+92+i*44,{size:30});});
  // the kind, and what sets it apart: underlines on the exact words, measured on the lines as written
  const under=(phrase,col,p,lab,dy)=>{if(p<=0)return;let from=DEF.indexOf(phrase),to=from+phrase.length,off=0;ctx.save();ctx.font=font(600,30);let first=null,last=null;
    lines.forEach((l,i)=>{const a0=Math.max(from,off),a1=Math.min(to,off+l.length);if(a1>a0){const x0=sx+90+ctx.measureText(l.slice(0,a0-off)).width,x1=sx+90+ctx.measureText(l.slice(0,a1-off)).width,y=sy+100+i*44;
      ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,x1,p),y);ctx.stroke();if(!first)first=[x0,x1,y];last=[x0,x1,y];}off+=l.length+1;});ctx.restore();
    const at=dy<0?first:last;if(at&&lab)withA(ctx,p,()=>T(ctx,lab,(at[0]+at[1])/2,at[2]+dy,{w:700,size:19,align:"center",color:rgba(col,1)}));};
  under("statement",[40,90,200],fin(t,c("recipe")+0.4,0.6),"the kind of thing",-40);
  ["trusted","that others can check","that someone has shown what they know or can do"].forEach((ph,k)=>under(ph,[200,110,20],fin(t,c("recipe")+1.8+k*0.4,0.5),k===2?"what sets it apart":null,30));
  // the kinds, in pencil
  const kT=c("kinds"),ox=52,oy=136,s=0.8;
  credKinds(ctx,{paper:true,ox,oy,s,p:{cred:clamp((t-kT-0.2)/0.9,0,1),award:clamp((t-kT-0.8)/0.9,0,1),micro:clamp((t-kT-1.8)/0.9,0,1),badge:clamp((t-kT-3.2)/0.9,0,1)}});
  const ca=clamp((t-kT-5.2)/0.9,0,1);pencilBox(ctx,940,690,320,64,"Certificate of attendance",ca,{size:22});if(ca>0.9){cross_(ctx,1290,722,40,[190,50,40],fin(t,kT+6.0,0.3));withA(ctx,fin(t,kT+6.3,0.4),()=>pencilText(ctx,"shows you were there, not what you learned",940,788,{size:19}));}
  // owners, and a new version of the sketch
  const oT=c("owner");withA(ctx,fin(t,oT+0.4,0.5),()=>{pencilText(ctx,"owner: Registrar",564,650,{size:19,align:"center",color:"rgba(150,100,20,0.95)"});pencilText(ctx,"owner: Short courses",820,650,{size:19,align:"center",color:"rgba(170,60,90,0.95)"});pencilText(ctx,"agreed 28 Sep",480,760,{size:19,color:"rgba(80,80,80,0.95)"});});
  withA(ctx,fin(t,oT+2.4,0.5),()=>stamp(ctx,sx+1010,sy+40,"sketch v3 · draft",[150,90,30],1,t<oT+3.2?t-oT:0));
  // people around the board
  person(ctx,"mei",150,960,0.55,{t,pose:t>c("def")&&t<c("kinds")?"explain":"stand",expr:t>c("answer")?"relieved":"calm"});
  person(ctx,"tom",1480,960,0.55,{t,pose:t>c("kinds")&&t<c("recipe")?"explain":"stand",expr:t>c("answer")?"relieved":"calm"});
  withA(ctx,fin(t,c("back")+1.0,0.6)*(1-ans),()=>{["reg","short","careers","lms"].forEach((k,i)=>tag(ctx,1400+(i%2)*260,150+Math.floor(i/2)*70,OFFICE[k].n,OFFICE[k].c,{size:18}));});
  // the answer, and a name for each number
  withA(ctx,ans,()=>{glass(ctx,1380,90,480,170,20,TRUST,{glow:18,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(ctx,"credentials awarded",1408,138,{w:700,size:22,color:rgba(SOFT,1)});T(ctx,fmtNum(countTo(t,c("answer")+1.0,0,11890)),1408,222,{w:800,size:72,color:rgba(TRUST,1)});
    T(ctx,"7,420 awards + 3,180 microcredentials + 1,290 assessed badges",1408,250,{f:"mono",w:500,size:12,color:rgba(SOFT,1)});
    ANS.forEach(([k,v],i)=>withA(ctx,fin(t,c("answer")+4.0+i*0.5,0.5),()=>{const y=300+i*120;glass(ctx,1380,y,480,100,16,OFFICE[k].c,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.93)"});T(ctx,fmtNum(v),1404,y+50,{w:800,size:36,color:rgba(OFFICE[k].c,1)});T(ctx,ANS_MEANING[k],1404,y+80,{w:600,size:17});}));});
  fadeIn(ctx,S,t,0.8);vign(ctx,S);});

/* ---------- 10. Pull back ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),B=c("breath");const cl=fin(t,c("clay")-0.3,1.0),la=fin(t,c("last")+0.2,0.8);
  if(cl<1){setScreen(ctx,S);bg2(ctx);withA(ctx,1-cl,()=>{const wT=c("why");
    // a contract's definitions
    withA(ctx,fin(t,wT+0.4,0.6),()=>{sheet(ctx,180,220,420,520,{rot:-0.02});T(ctx,"AGREEMENT",390,290,{w:800,size:24,align:"center",color:"rgba(40,36,34,0.95)"});T(ctx,"1. Definitions",214,350,{w:800,size:22,color:"rgba(40,36,34,0.95)"});
      ["“Customer” means…","“Credential” means…","“Census date” means…"].forEach((s,i)=>T(ctx,s,230,398+i*40,{w:600,size:19,color:"rgba(60,56,52,0.9)"}));for(let i=0;i<5;i++){ctx.fillStyle="rgba(80,76,70,0.25)";ctx.fillRect(214,540+i*30,300-hash(i,2)*90,8);}});
    // a merger, stalled on one word
    withA(ctx,fin(t,wT+2.6,0.6),()=>{[[700,"Company A","a customer is a person"],[1010,"Company B","a customer is an account"]].forEach(([x,n,d],i)=>{glass(ctx,x,300,280,200,18,i?[255,150,110]:[120,190,255],{glow:14,ea:0.8,fill:"rgba(7,12,24,0.92)"});T(ctx,n,x+24,344,{w:800,size:22});wrapT(ctx,d,x+24,392,240,{w:600,size:20,color:rgba(SOFT,1)});});
      withA(ctx,0.6+0.4*Math.sin(t*4),()=>T(ctx,"≠",990,420,{w:800,size:44,align:"center",color:rgba(BAD,1)}));T(ctx,"merger: on hold",990,560,{w:700,size:20,align:"center",color:rgba(BAD,1)});});
    // funding, by who is counted
    withA(ctx,fin(t,wT+4.6,0.6),()=>{glass(ctx,1400,260,380,400,18,TRUST,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.92)"});T(ctx,"funding",1430,306,{w:800,size:24,color:rgba(TRUST,1)});
      [0.55,0.8,0.68].forEach((h,i)=>{ctx.fillStyle=rgba(TRUST,0.75);rr(ctx,1450+i*100,620-h*240,70,h*240,8);ctx.fill();});T(ctx,"depends on who is counted",1590,650,{w:600,size:17,align:"center",color:rgba(SOFT,1)});});
    // a meeting, against everything else
    withA(ctx,fin(t,c("cost")+0.2,0.6),()=>{tag(ctx,700,720,"agreeing: a meeting",GOOD,{size:24});tag(ctx,1120,720,"disagreeing: disputes, rework, wrong decisions",BAD,{size:24});});});}
  if(cl>0){histBg(ctx,S,t,{light:0.14});withA(ctx,cl*(1-la*0.6),()=>{const p=clamp((t-c("clay")-0.6)/5,0,1);tablet(ctx,660,230,600,380,p,1);
      const k=Math.floor(p*48),sx=660+40+(k%12)*(600-80)/12,sy=230+Math.floor(k/12)*76+46;if(p<1)stylus(ctx,sx+8,sy-6,t,1);
      yearTag(ctx,120,120,"c. 3300 BCE · Uruk",CLAY,1);});
    withA(ctx,la,()=>{[["minds",560],["marks",960],["systems",1360]].forEach(([s,x],i)=>withA(ctx,fin(t,c("last")+0.4+i*0.6,0.5),()=>{const col=[KIND,CLAY,CYAN][i];glass(ctx,x-150,690,300,110,20,col,{glow:16,ea:0.85,fill:"rgba(7,12,24,0.93)"});T(ctx,s,x,758,{w:800,size:34,align:"center",color:rgba(col,1)});if(i<2)arrowTo(ctx,x+160,745,x+240,745,SOFT,0.8,{head:12});}));});}
  endCard(ctx,S,t,B+0.3,"What's in a word",WA_INK,"Before you can count anything, you have to agree what it is.");
  vign(ctx,S);});
