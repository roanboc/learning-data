/* ===== Day one: scenes =====
   Ten chapters, as in ../script.md. The Domesday survey; Tomás's first day at the utility; true pieces from different puzzles; a way of
   looking, in layers held by three questions; the methods, named once, and what they agree on; rough drafts first, notation earned;
   evidence and an owner's confirmation; why it matters for data; the series; and the first note.
   Motion (In the weeds of data crafting's helpers): every shot drifts slowly (drift), things arrive with a spring (arrive), dust gives
   depth (motes). Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. Before you can govern it ---------- */
scene("govern",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");histBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.04,y:460});
  const cA=c("ask"),cT=c("then"),cBk=c("book"),bk=fin(t,cBk-0.3,1.0),keep=1-bk;
  eaYear(ctx,100,90,"1085 · England",CLAY,fin(t,0.3,0.6));
  // the map: the coast in ink, then the counties as the surveyors reach them
  withA(ctx,keep,()=>{arrive(ctx,460,500,t,0.5,()=>{sheet(ctx,140,130,640,760,{rot:-0.012,fill:PARCHP});
      d1_england(ctx,210,190,110,clamp((t-0.9)/3.2,0,1),clamp((t-w("sent","surveyors"))/6.5,0,1));},{d:1.1,from:0.94});});
  // the entry: who holds it, what is on it, what it's worth
  const eP=clamp((t-w("sent","surveyors")-0.8)/5.2,0,1),qW=[w("ask","Who holds"),w("ask","What is on"),w("ask","What is it worth")];
  const hi=[pulseAt(t,qW[0],2.0),Math.max(pulseAt(t,qW[1],2.0),pulseAt(t,cT,2.6)),Math.max(pulseAt(t,qW[1]+0.3,2.0),pulseAt(t,cT+0.2,2.4)),Math.max(pulseAt(t,qW[2],2.2),pulseAt(t,w("then","then and now"),2.4))];
  withA(ctx,keep,()=>{arrive(ctx,1310,420,t,w("sent","surveyors")+0.4,()=>d1_entry(ctx,860,170,920,450,eP,{hi}),{d:1.0,from:0.95,dy:30});
    [["who holds it?",0],["what is on it?",1],["what is it worth?",2]].forEach(([s_,j])=>arrive(ctx,[1010,1310,1630][j],690,t,qW[j],()=>tag(ctx,[1010,1310,1630][j],690,s_,CLAY,{align:"center",size:30}),{dy:14}));
    withA(ctx,fin(t,w("then","then and now")-0.1,0.5),()=>{tag(ctx,1330,775,"then · 40",CLAY,{size:30});tag(ctx,1530,775,"now · 60",TRUST,{size:30});});});
  // the record, bound: the Domesday Book
  d1_book(ctx,960,460,1,clamp((t-cBk+0.2)/2.2,0,1),t);
  withA(ctx,fin(t,w("book","Domesday")+0.3,0.6),()=>{glow(ctx,960,460,380,TRUST,0.06+0.05*Math.sin(t*1.3));T(ctx,"the Domesday Book",960,740,{w:800,size:30,align:"center",color:rgba(PARCH,1)});});
  arrive(ctx,960,800,t,w("know","know what it is"),()=>tag(ctx,960,810,"know the place first",TRUST,{align:"center",size:32}),{dy:16});
  ctx.restore();fadeIn(ctx,S,t);vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"Day one","a way of looking, before the questions",EAC,"Film 1 of 11 · enterprise architecture, for data");});

/* ---------- 2. Day one ---------- */
scene("dayone",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:520});
  const cL=c("lunch"),cK=c("asks"),cN=c("know"),desk=ease(fin(t,cL-0.5,1.1));
  // the region at night, and what the utility does in it
  withA(ctx,1-desk,()=>{d1_region(ctx,t,{lines:fin(t,w("runs","poles and wires"),0.8),gen:fin(t,w("runs","hydro"),0.8),homes:fin(t,w("runs","homes"),1.2)});
    arrive(ctx,960,140,t,w("starts","owned by"),()=>tag(ctx,960,140,"owned by the regional government",EAC,{align:"center",size:32}),{dy:14});
    arrive(ctx,930,470,t,w("runs","poles and wires"),()=>tag(ctx,930,460,"poles and wires",[255,220,140],{align:"center",size:30}),{dy:12});
    arrive(ctx,300,430,t,w("runs","hydro"),()=>tag(ctx,300,420,"hydro",[140,200,255],{align:"center",size:30}),{dy:12});
    arrive(ctx,1610,330,t,w("runs","wind farms"),()=>tag(ctx,1610,320,"wind",[180,230,170],{align:"center",size:30}),{dy:12});
    arrive(ctx,1250,690,t,w("runs","homes"),()=>tag(ctx,1180,690,"homes and businesses",[255,214,140],{size:30}),{dy:12});});
  // his desk, and what lands on it
  if(desk>0)withA(ctx,desk,()=>{const ex=t>cN-0.2?"concerned":"calm";person(ctx,"tomas",1520,1010,0.95,{t,expr:ex});
    const g=ctx.createLinearGradient(0,790,0,H);g.addColorStop(0,"rgba(30,38,58,0.99)");g.addColorStop(1,"rgba(10,14,24,1)");ctx.fillStyle=g;ctx.fillRect(-40,790,W+80,320);ctx.fillStyle="rgba(150,180,230,0.25)";ctx.fillRect(-40,790,W+80,2);
    arrive(ctx,260,560,t,w("lunch","badge"),()=>d1_badge(ctx,260,560,0.9),{dy:-40});
    arrive(ctx,630,500,t,w("lunch","org chart"),()=>{glass(ctx,420,380,420,250,16,[180,200,230],{glow:12,ea:0.7,fill:"rgba(6,10,20,0.95)"});T(ctx,"org chart",440,422,{f:"mono",w:500,size:28,color:"rgba(180,200,230,1)"});d1_org(ctx,440,432,380,190);},{dy:-40});
    arrive(ctx,1070,560,t,w("lunch","list"),()=>d1_sysList(ctx,880,370,380,400,{scroll:Math.max(0,t-w("lunch","list"))*1.6,count:Math.round(clamp((t-w("lunch","list"))/1.6,0,1)*140)}),{dy:-40});
    arrive(ctx,630,700,t,w("lunch","invitation"),()=>d1_invite(ctx,420,650,420),{dy:-30});
    // everyone asks what he thinks
    const out=1-fin(t,cN-0.3,0.5);[["What's our data strategy?",840,90],["Can you fix the reporting?",1390,70],["Which system should we keep?",1080,240]].forEach(([s_,x,y],i)=>arrive(ctx,x+250,y+50,t,cK+0.1+i*0.55,()=>withA(ctx,out,()=>bubble(ctx,x,y,510,s_,[200,210,230],{size:30,tail:i===1?"left":"right"})),{dy:20}));
    // the organisation's language, not yet his
    const ac=["OMS","CIS","SCADA","AMI","RAB","DUoS","GIS","EAM"];ac.forEach((s_,i)=>{const a0=fin(t,cN-0.1+i*0.18,0.5),an=t*0.25+i*TAU/ac.length,x=1520+Math.cos(an)*(250+30*hash(i,4)),y=330+Math.sin(an)*90;withA(ctx,a0*0.85,()=>T(ctx,s_,x,y,{f:"mono",w:500,size:30,align:"center",color:rgba(SOFT,1)}));});
    arrive(ctx,1520,250,t,w("know","what to ask"),()=>{glow(ctx,1520,240,60,EAC,0.3);T(ctx,"?",1520,270,{w:800,size:84,align:"center",color:rgba(EAC,1)});},{dy:20});});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. True, and not enough ---------- */
const D1_PZ=[[0,1,-1,0],[1,-1,0,1],[-1,0,1,1],[0,1,1,-1]];
scene("pieces",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const K=["org","sys","manual","slogan"],cP=c("puzzle"),pz=ease(fin(t,cP-0.2,1.6)),col=[[180,200,230],[170,205,255],[150,180,230],[120,220,190]];
  const L=[[["who reports to whom",1],["what it must do",0]],[["what was bought",1],["what it's for",0]],[["how work was done",1],["how it's done now",0]],[["what matters",1],["how it happens",0]]];
  arrive(ctx,960,120,t,w("true","true"),()=>withA(ctx,1-fin(t,c("org")-0.3,0.5),()=>T(ctx,"all true · none of it explains the place",960,134,{w:700,size:36,align:"center",color:rgba(SOFT,1)})),{dy:12});
  K.forEach((k,i)=>{const x0=110+i*440,y0=240,cw=380,ch=280,on=fin(t,c(k)-0.1,0.5),fo=pulseAt(t,c(k),Math.max(2.2,sc.ends[k]-sc.cues[k]+1.2));
    // in the puzzle, the four cards move together into the middle, but their edges don't fit
    const gx=960+(i%2?1:-1)*215-cw*0.4,gy=420+(i<2?-170:170)-ch*0.4+((i<2)?-10:10),j=Math.sin(t*2.4+i*1.7)*6*pz,x=lerp(x0,gx,pz)+j,y=lerp(y0,gy,pz),s=lerp(1+0.05*fo,0.8,pz);
    arrive(ctx,x0+cw/2,y0+ch/2,t,w("true","given")+i*0.25,()=>{ctx.save();ctx.translate(x+cw*s/2,y+ch*s/2);ctx.rotate((hash(i,9)-0.5)*0.12*pz);ctx.scale(s,s);ctx.translate(-cw/2,-ch/2);
      withA(ctx,0.55+0.45*Math.max(on,pz),()=>{if(i===0){glass(ctx,0,0,cw,ch,16,col[0],{glow:12+14*fo,ea:0.75,fill:"rgba(6,10,20,0.95)"});T(ctx,"org chart",20,32,{f:"mono",w:500,size:16,color:rgba(col[0],1),deco:1});d1_org(ctx,16,46,cw-32,ch-70);}
        else if(i===1)d1_sysList(ctx,0,0,cw,ch,{scroll:t*0.8});else if(i===2){glass(ctx,0,0,cw,ch,16,col[2],{glow:12+14*fo,ea:0.6,fill:"rgba(6,10,20,0.9)"});d1_manual(ctx,70,30,220,220);}else d1_slide(ctx,10,30,cw-20,ch-60);});
      if(pz>0){ctx.save();ctx.strokeStyle=rgba(col[i],0.9*pz);ctx.lineWidth=3;ctx.shadowColor=rgba(col[i],0.7);ctx.shadowBlur=12;d1_jigsaw(ctx,-6,-6,cw+12,ch+12,D1_PZ[i]);ctx.stroke();ctx.restore();}
      ctx.restore();},{dy:30});
    // what each shows, and what it doesn't
    withA(ctx,on*(1-pz),()=>L[i].forEach(([s_,ok],r)=>{const yy=y0+ch+56+r*50,a1=fin(t,w(k,ok?(k==="slogan"?"strategy":k==="manual"?"process manual":k==="org"?"who reports":"what was bought"):(k==="slogan"?"slide":k==="manual"?"six years":k==="org"?"not what":"not what"))-0.1,0.4);
      withA(ctx,a1,()=>{(ok?tick_:cross_)(ctx,x0+18,yy-10,26,ok?GOOD:BAD,1);T(ctx,s_,x0+46,yy,{w:700,size:30,color:rgba(ok?INK:mix(INK,BAD,0.35),1)});});}));});
  arrive(ctx,960,830,t,w("puzzle","different puzzle"),()=>tag(ctx,960,830,"pieces from different puzzles",EAC,{align:"center",size:32}),{dy:14});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. A way of looking ---------- */
scene("looking",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const cW=c("way"),cA=c("above"),cB=c("bottom"),qs=[w("why","Why"),w("how","How"),w("runs","what runs")],X=720,Y=150,WD=800;
  const qOn=k=>fin(t,qs[k]-0.1,0.5),hiQ=k=>pulseAt(t,qs[k],3.0);
  const hiL=[hiQ(0),hiQ(0),hiQ(1),hiQ(1),hiQ(2),hiQ(2)],bot=fin(t,w("bottom","every system"),1.2);
  arrive(ctx,960,90,t,w("way","enterprise")-0.2,()=>withA(ctx,1-fin(t,c("three")-0.2,0.5),()=>T(ctx,"a way of looking, in layers",960,100,{w:800,size:34,align:"center"})),{dy:12});
  const R=layerStack(ctx,X,Y,WD,{p:clamp((t-w("way","layers")+0.3)/2.4,0,1),hi:hiL,br:fin(t,c("three"),0.5),bq:[qOn(0),qOn(1),qOn(2)],fill:[0,0,0,0,bot,bot]});
  // each layer is worked out from the one above
  const dn=fin(t,cA,1.2)*(1-fin(t,cB,0.5));withA(ctx,dn,()=>{arrowTo(ctx,1610,R[0][1]+10,1610,R[5][1]+R[5][3]-10,EAC,1,{p:fin(t,cA,1.2),lw:4,head:16});});
  arrive(ctx,960,720,t,w("above","worked out"),()=>withA(ctx,1-fin(t,cB,0.5),()=>tag(ctx,960,730,"each layer, from the one above",EAC,{align:"center",size:32})),{dy:14});
  // start from the bottom: every system described perfectly, and nothing above it
  if(bot>0){[4,5].forEach(i=>{const[x,y,ww,hh]=R[i];withA(ctx,bot,()=>{for(let k=0;k<5;k++)T(ctx,D1_SYS[(k+i*5)%D1_SYS.length].split(" · ")[0],x+270+k*100,y+hh/2+7,{f:"mono",w:500,size:16,color:rgba(LAY6[i][1],0.85),deco:1});});});
    [0,1,2,3].forEach(i=>{const[x,y,ww,hh]=R[i];withA(ctx,fin(t,w("bottom","still not know")+i*0.15,0.5),()=>T(ctx,"?",x+ww-20,y+hh/2+12,{w:800,size:34,align:"center",color:rgba(SOFT,0.95)}));});
    const up=fin(t,w("bottom","Start from"),1.4);withA(ctx,up,()=>{arrowTo(ctx,1610,R[5][1]+R[5][3]-10,1610,lerp(R[5][1]+R[5][3],R[3][1]+20,up),[255,140,120],1,{p:up,lw:4,head:16});});
    withA(ctx,fin(t,w("bottom","still not know"),0.4),()=>kt_rcross(ctx,1610,R[3][1]+10,18,1));
    arrive(ctx,960,720,t,w("bottom","still not know"),()=>tag(ctx,960,730,"every system, perfectly · and what for?",[255,140,120],{align:"center",size:32}),{dy:14});}
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Many maps, the same lessons ---------- */
const D1_LESSONS=["start with why","capabilities outlast reorganisations","describe today first","trace it to evidence","just enough"];
scene("methods",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:450});
  const cC=c("champ"),gat=w("champ","Under the vocabulary"),cT=c("takes");
  // the map, small, in the middle; it gives way to what the methods agree on
  const shrink=ease(fin(t,0,1.2));withA(ctx,1-fin(t,gat-0.4,0.6),()=>layerStack(ctx,lerp(720,800,shrink),lerp(150,330,shrink),lerp(800,320,shrink),{sh:lerp(66,24,shrink),gap:lerp(16,8,shrink),size:lerp(30,13,shrink),deco:1}));
  const P=[[40,96],[500,96],[960,96],[1420,96],[270,650],[730,650],[1190,650]],words=[["three","Toe-gaff"],["three","Arky-mate"],["three","Zack-man"],["more","Business architecture"],["more","process frameworks"],["more","domain-driven"],["more","data management"]];
  P.forEach(([x,y],i)=>arrive(ctx,x+225,y+75,t,w(words[i][0],words[i][1])-0.15,()=>d1_methodCard(ctx,i,x,y,450,150,{hi:pulseAt(t,w(words[i][0],words[i][1]),1.6),a:1-0.45*fin(t,gat,0.8)}),{dy:24}));
  withA(ctx,fin(t,w("champ","champions"),0.5)*(1-fin(t,gat,0.5)),()=>T(ctx,"each has its champions",960,560,{w:700,size:34,align:"center",color:rgba(SOFT,1)}));
  // the lessons lift from the cards and gather in the middle
  D1_LESSONS.forEach((s_,j)=>{const src=P[(j*3+1)%7],q=ease(fin(t,gat+j*0.3,1.0)),x=lerp(src[0]+225,960,q),y=lerp(src[1]+75,300+j*62,q);if(q<=0)return;
    withA(ctx,clamp(q*2,0,1),()=>tag(ctx,x,y,s_,EAC,{align:"center",size:30}));});
  arrive(ctx,960,612,t,w("takes","agree on")-0.2,()=>T(ctx,"this series: what they agree on",960,616,{w:800,size:34,align:"center",color:rgba(INK,1)}),{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 6. Rough first ---------- */
const D1_CAPS=["keep the lights on","connect customers","bill customers","maintain assets","manage outages","plan the network"],D1_VS=["report","locate","repair","restore"];
scene("rough",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:420});
  // the camera moves in on each canvas as it's talked about, then pulls back for the map
  focus(ctx,t,[[0,960,540,1],[c("starts"),520,350,1.32],[w("canvas","paid for")-0.6,1400,350,1.3],[c("argue")-0.3,560,420,1.3],[w("later","capability map")-0.6,960,540,1]]);
  const cL=c("later"),cE=c("earned"),cY=c("early"),cv=1-fin(t,w("later","capability map")-0.5,0.8),capT=w("later","capability map"),vsT=w("later","value streams"),fmT=w("later","formal notation"),fm=fin(t,fmT,1.2),left=ease(fin(t,cY-0.3,1.0));
  // two canvases on the wall, in marker
  withA(ctx,cv,()=>{arrive(ctx,510,345,t,c("starts")+0.2,()=>vpCanvas(ctx,110,110,800,470,clamp((t-c("starts")-0.5)/2.6,0,1)),{d:1.0,from:0.95});
    arrive(ctx,1400,350,t,w("canvas","paid for")-0.6,()=>bmCanvas(ctx,990,100,820,500,clamp((t-w("canvas","paid for")+0.4)/1.8,0,1)),{d:1.0,from:0.95});
    const N=[["households",650,282,1,w("canvas","who the utility")],["keep the lights on",780,368,0,w("canvas","what they need")],["reliable supply",318,350,0,w("canvas","what they need")+0.4],["network tariffs",1600,508,2,w("canvas","paid for")],["households",1712,300,1,w("canvas","paid for")+0.4],["the network",1244,368,3,w("canvas","paid for")+0.7]];
    N.forEach(([s_,x,y,k,t0])=>arrive(ctx,x,y,t,t0,()=>sticky(ctx,x,y,160,110,s_,{col:NOTEC[k],size:23}),{dy:-30,from:1.1}));
    // one is moved, by someone who disagrees
    const mv=ease(fin(t,w("argue","argued")-0.2,1.0)),mx=lerp(560,662,mv),my=lerp(640,460,mv);arrive(ctx,560,640,t,c("argue")-0.4,()=>{ctx.save();if(mv>0&&mv<1){ctx.translate(mx,my);ctx.scale(1.06,1.06);ctx.translate(-mx,-my);}sticky(ctx,mx,my,160,110,"bills too high",{col:NOTEC[1],size:23});ctx.restore();},{dy:-30,from:1.1});});
  // later: a capability map, value streams, then a formal notation
  ctx.save();ctx.translate(-560*left,0);ctx.scale(1-0.25*left,1-0.25*left);
  withA(ctx,fin(t,capT-0.2,0.6)*(1-0.6*left),()=>D1_CAPS.forEach((s_,i)=>{const x=430+(i%3)*360,y=150+Math.floor(i/3)*150,q=fin(t,capT+i*0.12,0.5);if(q<=0)return;
    withA(ctx,1-fm,()=>{marker(ctx,[[x,y],[x+320,y],[x+320,y+110],[x,y+110],[x,y]],q,{col:"rgba(236,228,206,0.85)",lw:2.6,seed:i+20});withA(ctx,q,()=>T(ctx,s_,x+160,y+66,{w:700,size:30,align:"center",color:"rgba(236,228,206,0.95)"}));});
    archEl(ctx,x,y,320,110,s_,LAY6[1][1],"capability",{a:fm,size:30});}));
  withA(ctx,fin(t,vsT-0.2,0.6)*(1-0.6*left),()=>D1_VS.forEach((s_,i)=>{const x=430+i*265,y=480,q=fin(t,vsT+i*0.15,0.5);if(q<=0)return;const ch=[[x,y],[x+230,y],[x+262,y+50],[x+230,y+100],[x,y+100],[x+32,y+50],[x,y]];
    withA(ctx,1-fm,()=>{marker(ctx,ch,q,{col:"rgba(236,228,206,0.85)",lw:2.6,seed:i+40});withA(ctx,q,()=>T(ctx,s_,x+140,y+61,{w:700,size:30,align:"center",color:"rgba(236,228,206,0.95)"}));});
    if(fm>0)withA(ctx,fm,()=>{ctx.save();ctx.beginPath();ch.forEach(([px,py],k)=>k?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();ctx.fillStyle="rgba(7,12,24,0.94)";ctx.fill();ctx.fillStyle=rgba(LAY6[2][1],0.2);ctx.fill();ctx.strokeStyle=rgba(LAY6[2][1],1);ctx.lineWidth=2;ctx.shadowColor=rgba(LAY6[2][1],0.6);ctx.shadowBlur=12;ctx.stroke();ctx.restore();T(ctx,s_,x+140,y+61,{w:700,size:30,align:"center"});});}));
  withA(ctx,fin(t,fmT+0.3,0.8)*(1-0.6*left),()=>{archEl(ctx,430,636,320,100,"households",LAY6[0][1],"stakeholder",{size:30});archEl(ctx,790,636,440,100,"affordable, reliable power",LAY6[0][1],"goal",{size:30});});
  ctx.restore();
  arrive(ctx,960,90,t,w("earned","earned")-0.2,()=>withA(ctx,1-fin(t,cY-0.3,0.5),()=>tag(ctx,960,90,"notation is earned",EAC,{align:"center",size:32})),{dy:14});
  // too precise, too early: people correct the drawing, not the understanding
  if(left>0)withA(ctx,left,()=>{const X=1060;archEl(ctx,X,150,300,90,"Customer Mgmt",LAY6[1][1],"capability");archEl(ctx,X+400,150,300,90,"Grid Ops",LAY6[1][1],"capability");archEl(ctx,X,330,300,90,"Billing Process",LAY6[2][1],"process");archEl(ctx,X+400,330,300,90,"Outage Process",LAY6[2][1],"process");archEl(ctx,X+200,510,300,90,"CIS",LAY6[4][1],"component");
      [[X+150,240,X+150,330],[X+550,240,X+550,330],[X+150,420,X+300,510],[X+550,420,X+400,510]].forEach(([a,b,cc,d])=>arrowTo(ctx,a,b,cc,d,[200,215,240],0.9,{lw:2.2,head:12}));
      const RED=[230,70,70],m=[[w("early","correct")-0.3,X+150,322,"wrong arrowhead"],[w("early","drawing"),X+690,180,"not this colour"],[w("early","drawing")+0.4,X+520,560,"should be a role?"]];
      m.forEach(([t0,x,y,s_],k)=>withA(ctx,fin(t,t0,0.4),()=>{ctx.save();ctx.strokeStyle=rgba(RED,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y,58,30,0.1,0,TAU*fin(t,t0,0.5));ctx.stroke();ctx.restore();T(ctx,s_,k===1?x+30:x+40,y-42,{w:700,size:28,align:k===1?"right":"left",color:rgba(RED,1)});}));
      withA(ctx,fin(t,w("early","understanding"),0.6),()=>T(ctx,"what is it for? — nobody asked",X+350,720,{w:700,size:32,align:"center",color:rgba(SOFT,1)}));});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Evidence, then confirmation ---------- */
const D1_WALL=[["keep the lights on",0],["households",1],["bills too high",1],["ageing poles",3],["rooftop solar",2],["the regulator sets prices",0],["crews in the field",3],["network tariffs",2]];
scene("evidence",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const cS=c("source"),cD=c("draft"),cO=c("opinion");
  person(ctx,"tomas",165,1030,0.8,{t,pose:t>cS&&t<cD?"explain":"stand"});
  arrive(ctx,1760,800,t,w("draft","the person who owns")-0.4,()=>{person(ctx,"grace",1760,1030,0.8,{t,pose:t>w("draft","says it's right")-0.6&&t<w("draft","says it's right")+1.6?"explain":"stand"});tag(ctx,1650,606,"Grace · network operations",TRUST,{align:"center",size:28});},{dy:20,from:0.96});
  // sources clipped to the notes, as each is named; one note has none, and fades
  const src={0:["annual report",w("source","annual report")],5:["regulator",w("source","regulator's decision")],3:["expectations",w("source","statement of expectations")],6:["interview",w("source","an interview")],1:["annual report",w("source","an interview")+0.8],2:["complaints",w("source","an interview")+1.1],7:["tariffs",w("source","an interview")+1.4]};
  // confirmed: two now, by Grace; four more in the wordless ending
  const conf={0:w("draft","says it's right"),6:w("draft","says it's right")+0.5,1:B+0.6,5:B+1.2,2:B+1.8,7:B+2.4};
  D1_WALL.forEach(([s_,k],i)=>{const x=590+(i%4)*262,y=232+Math.floor(i/4)*244,t0=0.3+i*0.12,sv=src[i],ok=conf[i]!=null?fin(t,conf[i],0.8):0,st=fin(t,w("draft","stays a draft")+i*0.08,0.6)*0.5+ok*0.5;
    const fade=i===4?1-0.6*fin(t,sc.ends.source,1.0):1,edge=[LAY6[1][1],LAY6[0][1],LAY6[0][1],LAY6[5][1],LAY6[5][1],LAY6[0][1],LAY6[2][1],LAY6[2][1]][i];
    arrive(ctx,x,y,t,t0,()=>withA(ctx,fade,()=>sticky(ctx,x,y,226,150,s_,{col:NOTEC[k],size:28,glass:ok,edge,st:t>c("rules")?st:null,src:sv?sv[0]:null,srcA:sv?fin(t,sv[1],0.4):0})),{dy:-24,from:1.06});
    if(conf[i]!=null)withA(ctx,fin(t,conf[i]-0.1,0.3)*(1-fin(t,conf[i]+1.6,0.6)),()=>ownerTick(ctx,x+100,y+62,20,1));});
  arrive(ctx,960,90,t,w("rules","two rules"),()=>withA(ctx,1-fin(t,cO-0.3,0.5),()=>{tag(ctx,260,86,"every note names its source",EAC,{size:30});withA(ctx,fin(t,cD,0.5),()=>tag(ctx,960,86,"a draft until its owner confirms it",TRUST,{size:30}));}),{dy:14});
  arrive(ctx,960,90,t,w("opinion","nobody"),()=>tag(ctx,960,86,"unconfirmed: one person's opinion, drawn neatly",[255,170,150],{align:"center",size:30}),{dy:14});
  // the three states, as a key
  withA(ctx,fin(t,w("draft","stays a draft"),0.6),()=>{[["not started",0],["draft",0.5],["confirmed",1]].forEach(([s_,v],j)=>{const x=640+j*250;statusDot(ctx,x,740,14,v,j===2?TRUST:[236,228,206]);T(ctx,s_,x+26,750,{w:700,size:28,color:"rgba(236,228,206,0.95)"});});});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. Why this matters for data ---------- */
scene("data",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:450});
  const cR=c("rule"),cQ=c("qs"),cG=c("guess"),cH=c("home"),home=ease(fin(t,cH,1.2)),gs=fin(t,cG,0.6)*(1-home);
  arrive(ctx,960,150,t,w("care","data architect")-0.3,()=>withA(ctx,1-fin(t,cR-0.3,0.5),()=>T(ctx,"why would a data architect care?",960,160,{w:800,size:36,align:"center"})),{dy:12});
  arrive(ctx,960,250,t,w("claim","every data rule"),()=>withA(ctx,1-fin(t,cR-0.3,0.5),()=>T(ctx,"every data rule is a claim about the organisation",960,260,{w:700,size:30,align:"center",color:rgba(TRUST,1)})),{dy:12});
  // the layers, faintly behind, once the rule has a home
  withA(ctx,home*0.35,()=>layerStack(ctx,420,120,1000,{sh:56,gap:20,size:20}));
  // the rule, floating; it drifts while it has no home
  const dx=Math.sin(t*0.9)*40*gs,dy=Math.cos(t*0.7)*18*gs,rot=Math.sin(t*0.8)*0.05*gs;
  arrive(ctx,960,447,t,cR,()=>{ctx.save();ctx.translate(960+dx,447+dy);ctx.rotate(rot);ctx.translate(-960,-447);ruleCard(ctx,600,380,720,"an estimated reading stands only until the next actual reading",{hi:home*(0.6+0.4*Math.sin(t*2))});ctx.restore();},{dy:24});
  // three empty sockets: which process, who owns it, which goal
  const So=[[300,462,"which process?",w("qs","Which process")],[1620,462,"who owns it?",w("qs","Who owns")],[960,180,"which goal?",w("qs","Which goal")]];
  So.forEach(([x,y,s_,t0],j)=>{const a0=fin(t,t0-0.1,0.5)*(1-home)*(1-0.5*gs);withA(ctx,a0,()=>{ring(ctx,x,y,58,SOFT,0.8,2.2,[6,8]);T(ctx,"?",x,y+16,{w:800,size:44,align:"center",color:rgba(SOFT,1)});T(ctx,s_,x,y+(j===2?-80:100),{w:700,size:30,align:"center",color:rgba(INK,0.95)});});});
  // without the map: a wrong bill, and nobody to fix it
  withA(ctx,gs,()=>{d1_bill(ctx,1330,610,460,{bad:fin(t,w("guess","wrong"),0.4)});T(ctx,"who should fix it?",880,720,{w:700,size:36,align:"center",color:rgba([255,140,120],1)});});
  // with the map: a process, an owner and a goal
  if(home>0){const P0=[[100,414,400,96,"read meters",LAY6[2][1],"process"],[1420,414,400,96,"owner · metering",TRUST,"role"],[730,104,460,96,"fair, accurate bills",LAY6[0][1],"goal"]];
    P0.forEach(([x,y,ww,hh,s_,col,kd],j)=>{const q=fin(t,cH+0.3+j*0.35,0.6);archEl(ctx,x,y,ww,hh,s_,col,kd,{a:q});});
    arrowTo(ctx,600,462,500,462,LAY6[2][1],fin(t,cH+0.3,0.5),{p:fin(t,cH+0.3,0.6),lw:2.6,head:12});arrowTo(ctx,1320,462,1420,462,TRUST,fin(t,cH+0.65,0.5),{p:fin(t,cH+0.65,0.6),lw:2.6,head:12});arrowTo(ctx,960,380,960,204,LAY6[0][1],fin(t,cH+1.0,0.5),{p:fin(t,cH+1.0,0.6),lw:2.6,head:12});
    arrive(ctx,960,700,t,w("home","a home"),()=>tag(ctx,960,710,"a rule with a home",EAC,{align:"center",size:34}),{dy:14});}
  ctx.restore();vign(ctx,S);});

/* ---------- 9. The series ---------- */
const D1_FILMS=["Day one","Who it serves, and how it pays","Why it moves","What it must be able to do","How value reaches people","Who does it, and where meaning changes","Today, and where it's going","Now the questions appear","Rules with a home","When strategy moves","A map people and agents can read"];
// the layers each film adds to the map
const D1_ADDS=[[],[0],[0],[1],[2],[2,3],[4,5],[0,1],[3],[0,1,2,3,4,5],[3]];
scene("series",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const W7=["who it serves","why it moves","what it must be able","how value","who does what","what runs it"],W4=["the questions","rules with","a change","a map that"];
  const lit=D1_FILMS.map((_,i)=>i===0?fin(t,w("eleven","builds the map"),0.5):i<7?fin(t,w("seven",W7[i-1])-0.1,0.5):fin(t,w("four",W4[i-7])-0.1,0.5));
  const fill=[0,0,0,0,0,0],hi=[0,0,0,0,0,0];D1_ADDS.forEach((ls,i)=>ls.forEach(l=>{fill[l]=Math.max(fill[l],lit[i]*(i<7?1:0.6));}));
  lit.forEach((v,i)=>{const p_=i===0?0:pulseAt(t,i<7?w("seven",W7[i-1]):w("four",W4[i-7]),2.0);D1_ADDS[i].forEach(l=>{hi[l]=Math.max(hi[l],p_);});});
  arrive(ctx,470,130,t,0.3,()=>T(ctx,"the map, one layer at a time",470,134,{w:800,size:32,align:"center",color:rgba(SOFT,1)}),{dy:10});
  layerStack(ctx,150,190,600,{sh:66,gap:20,fill,hi,p:clamp((t-0.2)/1.6,0,1)});
  // one column of films: the seven that understand the utility, then the four for data
  const card=(i,x,y)=>{const v=lit[i],col=i<7?EAC:[170,205,255];withA(ctx,0.35+0.65*v,()=>{glass(ctx,x,y,770,54,14,col,{glow:8+14*v,ea:0.5+0.4*v,fill:"rgba(7,12,24,0.94)"});
    T(ctx,(i+1)+"",x+26,y+38,{f:"mono",w:500,size:28,color:rgba(col,1)});T(ctx,D1_FILMS[i],x+76,y+38,{w:700,size:28,color:rgba(INK,0.6+0.4*v)});});};
  const Y=i=>i<7?118+i*62:620+(i-7)*62;
  arrive(ctx,1100,96,t,0.6,()=>T(ctx,"understand the utility",1050,100,{w:800,size:28,color:rgba(EAC,1)}),{dy:10});
  for(let i=0;i<7;i++)arrive(ctx,1440,Y(i)+27,t,0.6+i*0.1,()=>card(i,1050,Y(i)),{dy:16});
  withA(ctx,fin(t,c("four")-0.3,0.6),()=>T(ctx,"for data",1050,602,{w:800,size:28,color:"rgba(170,205,255,1)"}));
  for(let i=7;i<11;i++)arrive(ctx,1440,Y(i)+27,t,c("four")-0.2+(i-7)*0.1,()=>card(i,1050,Y(i)),{dy:16});
  ctx.restore();vign(ctx,S);});

/* ---------- 10. The first note ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const cQ=c("qs"),cN=c("note");
  arrive(ctx,470,400,t,0.2,()=>d1_entry(ctx,110,160,720,390,1,{hi:[pulseAt(t,w("qs","Who holds"),1.8),0,0,pulseAt(t,w("qs","worth"),1.8)]}),{d:1.0,from:0.95});
  [["What is this place?","What is this"],["Who holds it?","Who holds"],["What is it worth?","worth"]].forEach(([s_,k],j)=>arrive(ctx,470,610+j*58,t,w("qs",k)-0.1,()=>T(ctx,s_,470,620+j*58,{w:800,size:30,align:"center",color:rgba(PARCH,1)}),{dy:12}));
  person(ctx,"tomas",1560,1030,0.9,{t,pose:t>cN-0.3&&t<cN+1.8?"explain":"stand"});
  arrive(ctx,1220,300,t,cN,()=>sticky(ctx,1220,300,280,180,"Why does it exist?",{col:NOTEC[0],size:30,p:clamp((t-cN-0.3)/1.2,0,1),st:fin(t,cN+1.4,0.4)>0?0:null,rot:-0.03}),{dy:-40,from:1.08});
  ctx.restore();vign(ctx,S);
  eaEnd(ctx,S,t,B+0.8,"Day one",EAC,"Learn the place before you ask the questions.","Film 1 of 11");});
