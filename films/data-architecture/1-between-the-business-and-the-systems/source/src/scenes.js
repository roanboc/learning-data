/* ===== Between the business and the systems: scenes =====
   Eight chapters, as in ../script.md. Chile in 1971: the state runs factories it can't see, its figures six months late; CORFO and
   Stafford Beer start Cybersyn, and before any computer, engineers walk a textile mill and draw it, then choose about five numbers.
   Then the utility's wall: Tomás's map and the layer between the business and the systems; three meanings of "information
   architecture"; DAMA's one discipline, TOGAF's four domains and ArchiMate's two layers; one word, connection point, its six records
   and the storm whose texts missed 180 homes; why data architecture is an architecture of its own, and the line Inés draws and owns;
   the data practice on the map; and back to the mill's drawing, and to every home getting its text.
   One room for the utility: the wall. Its chapters keep their places on it and the camera glides from one to the next (the model
   on the upper part of the wall, the world it serves below it). Chile is lamp-light: the map, then the mill, each dissolving into the
   next because the whole picture changes. Made to read on a phone (tools/legible.py): text is at least 28 px in the frame. Sound: every
   effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

// the camera on the wall: keys are [time, x, y, zoom]; every move eases over at least 1.6 s
function d1_cam(ctx,S,t,keys){setScreen(ctx,S);return focus(ctx,t,keys,1.7);}
// Inés's look, from calm to concerned and back, over half a second each way, never in one frame
const d1_face=(t,t0,t1)=>t<t0?"calm":t<t0+0.5?daExpr("calm","concerned",(t-t0)/0.5):t<t1?"concerned":t<t1+0.5?daExpr("concerned","calm",(t-t1)/0.5):"calm";
// where the people stand on the wall
const D1_TOM=[230,1010],D1_INES=[1800,1010];

/* ---------- 1. Before any computer ---------- */
const D1_MAP=[830,60,960];      // Chile's map: top-left and height
const D1_STEPS=["cotton","spinning","weaving","finishing","shipping"];
scene("walk",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tWent=c("went"),tSame=c("same"),toMill=fin(t,tWent-0.5,1.2),toWall=fin(t,tSame-0.6,1.2),wallOut=1-fin(t,B+1.1,0.6);
  // Chile, in lamp-light: the map, the agency, the six months, and the people who started Cybersyn
  const mapA=1-toMill;
  if(mapA>0.01){ctx.save();ctx.globalAlpha=mapA;d1_night(ctx,S,t);setScreen(ctx,S);
    focus(ctx,t,[[0,960,520,1.0],[w("year","factories")-0.3,930,500,1.06],[c("corfo")-0.2,1060,480,1.05],[c("lag")+0.3,1160,500,1.0],[c("beer")-0.3,820,560,1.0],[c("cyber"),900,520,0.98]],1.8);
    const[mx,my,mh]=D1_MAP,tF=w("year","factories"),tC=c("cyber");
    // Santiago is named over the sea, so the agency's card can sit to the east of it
    daChile(ctx,mx,my,mh,{dots:fin(t,tF-0.3,2.2),lines:fin(t,tC+0.2,3.2),pulse:i=>t>tC+2?((t-tC-2)*0.22+hash(i,5))%1:0,city:fin(t,0.6,1.0),label:"left"});
    // the agency in Santiago that had to run the factories
    d1_card(ctx,1010,392,500,"CORFO","the state's development agency",fin(t,c("corfo")-0.1,0.6));
    // six months: the calendar turns from January to July while a factory's figures for January are still on their way to the agency;
    // the figures leave once the people in charge say what they need instead
    const tL=c("lag"),tO=c("old"),tNd=c("need"),calA=fin(t,tL-0.2,0.6)*(1-fin(t,c("beer")-0.4,0.6)),m=clamp((t-tL-0.4)/(tO+0.6-tL-0.4),0,1)*6;
    d1_calendar(ctx,1540,150,m,calA,{ring:fin(t,tO+0.2,0.5)*(1-fin(t,tNd+0.2,0.5))});
    const rp=ease(clamp((t-tL-0.2)/(tO+0.4-tL-0.2),0,1));d1_report(ctx,lerp(1060,1520,rp),lerp(640,470,rp),"January",calA*fin(t,tL,0.5)*(1-fin(t,tNd-0.3,0.5)));
    withA(ctx,calA*fin(t,tO+0.3,0.5)*(1-fin(t,tNd-0.3,0.5)),()=>{tag(ctx,1650,720,"six months late",BAD,{align:"center",size:30});});
    // what they needed: each factory, now
    withA(ctx,fin(t,tNd+0.2,0.6)*(1-fin(t,c("beer")-0.4,0.6)),()=>{const ph=(t*1.6)%1;DA_SITES.forEach(([la,lo],i)=>{const[px,py]=daChileXY(la,lo,mx,my,mh);ring(ctx,px,py,8+16*((ph+i*0.07)%1),CY_LAMP,0.6*(1-((ph+i*0.07)%1)),2);});
      tag(ctx,600,600,"each factory, now",CY_LAMP,{align:"center",size:32});});
    // CORFO's people and Stafford Beer, at a table under a lamp: silhouettes, no faces, each named over their heads
    const pA=fin(t,c("beer")-0.2,0.8);if(pA>0.01){d1_table(ctx,420,960,pA);daSil(ctx,230,960,320,{a:pA});daSil(ctx,330,962,316,{a:pA});daSil(ctx,620,960,372,{a:pA,dir:-1,wide:1.18,beard:1});
      withA(ctx,pA,()=>{T(ctx,"CORFO's team",280,606,{w:700,size:28,align:"center",color:rgba(INK,0.9)});T(ctx,"Stafford Beer",620,554,{w:700,size:28,align:"center",color:rgba(INK,0.9)});});}
    withA(ctx,fin(t,tC-0.1,0.7),()=>d1_card(ctx,1080,560,440,"Cybersyn","factories linked to Santiago",1,{size:40}));
    // the year and the place, in the frame's corner, still while the camera moves
    setScreen(ctx,S);daYear(ctx,90,96,"Chile, 1971",fin(t,0.3,0.8));
    ctx.restore();}
  // inside a textile mill: the engineers walk it with a board, then draw it, then ring the few numbers chosen
  const millA=toMill*(1-toWall);
  if(millA>0.01){ctx.save();ctx.globalAlpha=millA;d1_mill(ctx,S,t);setScreen(ctx,S);const tD=c("drew"),tCh=c("chose"),tFv=c("five"),tM=c("meant");
    focus(ctx,t,[[tWent-0.5,960,560,1.06],[tD+0.6,960,470,1.0],[tCh,960,440,1.04]],1.8);
    const shA=1-0.55*fin(t,tD+0.4,1.0);withA(ctx,shA,()=>{d1_hall(ctx,t);
      // three engineers walking the aisle, left to right, one with a board
      [0,1,2].forEach(k=>{const u=t-tWent+0.6,x=-80+u*95-k*150;daSil(ctx,x,1040,300-k*6,{walk:u*4.6+k*1.1,board:k===0?1:0,rim:CY_LAMP});});});
    // the drawing: the mill as a flow, from cotton to shipping; then about five numbers ringed on it
    const pD=clamp((t-tD-0.2)/2.6,0,1),mk=(k,t0)=>clamp((t-t0)/0.9,0,1);
    const sheetA=fin(t,tD,0.6);if(sheetA>0.01)arrive(ctx,960,370,t,tD,()=>{
      daFlow(ctx,250,120,1420,500,D1_STEPS,{title:"how the mill works",p:pD,marks:[[0,"cotton in stock",mk(0,tCh+0.2)],[1,"yarn spun",mk(1,tCh+0.6)],[2,"cloth woven",mk(2,w("five","produced")-0.2)],[4,"cloth shipped",mk(3,tCh+1.0)]],mcol:[178,62,46]});
      // the fifth: the people, counted as those absent, Cybersyn's sign of unease in a factory
      d1_people(ctx,290,500,560,clamp((t-tD-1.8)/1.2,0,1),mk(4,w("five","absent")-0.2));
    },{d:0.9,dy:-30});
    // each number with its place in the drawing: the five glow together
    withA(ctx,pulseAt(t,tM+0.4,2.0)*0.9,()=>{const bw=(1420-80-4*44)/5;[0,1,2,4].forEach(i=>glow(ctx,250+40+i*(bw+44)+bw/2,318,140,CY_LAMP,0.18));glow(ctx,570,540,170,CY_LAMP,0.16);});
    withA(ctx,fin(t,tFv+0.6,0.6)*(1-fin(t,tSame-0.8,0.5)),()=>tag(ctx,960,680,"about five numbers a factory",CY_LAMP,{align:"center",size:32}));
    ctx.restore();}
  // the utility: Inés, and plenty of data with no agreed picture of what it means
  if(toWall*wallOut>0.01){ctx.save();ctx.globalAlpha=toWall*wallOut;wallBg(ctx,S,t);setScreen(ctx,S);const tSt=c("starts");
    focus(ctx,t,[[tSame-0.6,1000,540,1.0],[tSt-0.2,900,520,1.04]],1.8);
    const R=[["customers","412,118",0],["customers","398,240",1],["accounts","405,977",2],["premises","401,312",3],["supply addresses","409,880",4],["service points","396,054",5]];
    R.forEach(([n,v,i])=>{const q=fin(t,tSame+0.2+i*0.35,0.6)*(1-0.88*fin(t,tSt,0.8)),x=260+(i%3)*400+(i%2)*40,y=200+Math.floor(i/3)*230+(i%3)*18;
      withA(ctx,q,()=>{glass(ctx,x,y,330,120,14,APPC,{glow:8,ea:0.7,fill:"rgba(7,12,24,0.92)"});T(ctx,n,x+24,y+48,{w:700,size:30,color:rgba(mix(APPC,INK,0.35),1)});T(ctx,v,x+24,y+94,{f:"mono",w:500,size:30,color:rgba(INK,0.95)});});});
    withA(ctx,fin(t,tSame+2.4,0.6)*(1-fin(t,tSt,0.8)),()=>tag(ctx,760,760,"which one is right?",BAD,{align:"center",size:32}));
    // where she starts: a sheet, and the business drawn first
    const shA=fin(t,tSt+0.2,0.7);d1_pin(ctx,460,250,640,420,shA,-0.01,()=>{pencilText(ctx,"how the business works",500,320,{size:34,w:700,p:clamp((t-tSt-0.6)/1.4,0,1)});
      pencilBox(ctx,520,400,240,90,"connect",clamp((t-tSt-1.4)/0.9,0,1),{size:30});pencilBox(ctx,800,400,240,90,"supply",clamp((t-tSt-1.9)/0.9,0,1),{size:30});});
    daPerson(ctx,"ines",1500,1010,0.95,{t,dir:-1,expr:d1_face(t,tSame+1.2,tSt),a:fin(t,tSame,0.8)});
    ctx.restore();}
  vign(ctx,S);
  daTitle(ctx,S,t,B+1.0,"Between the business and the systems","the line nobody owned","Film 1 of 6 · data architecture");});

/* ---------- 2. Tomás's map ---------- */
// the map on the wall: six layers in glass; where it sits, and its business objects
const D1_STACK=[560,150,1080,86,20];
const D1_BOS=["connection point","customer","meter reading"];
function d1_map(ctx,t,o){const[x,y,w,sh,gap]=D1_STACK;const R=layerStack(ctx,x,y,w,{a:o.a,sh,gap,p:o.p,fill:o.fill,hi:o.hi,size:30});
  // the business layer's concepts, as business objects, each as wide as its name needs, side by side in the slab
  if(o.bo>0.01){let bx=790;D1_BOS.forEach((n,i)=>{const q=clamp(o.bo*3-i,0,1),bw=tw(ctx,n,28,700)+84;
    if(q>0)withA(ctx,o.a==null?1:o.a,()=>daBO(ctx,bx,R[2][1]+13,bw,60,n,{a:q,hi:i===0?o.boHi||0:0,size:28,gs:11}));bx+=bw+20;});}
  return R;}
scene("map",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  wallBg(ctx,S,t);d1_cam(ctx,S,t,[[0,960,520,1.0],[c("bo")-0.2,1060,420,1.12],[c("under")+0.2,1050,520,1.04],[c("hers")-0.2,1060,540,1.0]]);
  const tU=c("under"),fill=[0,0,0,0,0,0].map((_,i)=>0.25+0.35*fin(t,c("drawn")+0.3+i*0.2,0.6)),hi=[0,0,0,0,0,0];
  hi[2]=fin(t,c("biz"),0.6)*(1-fin(t,tU,0.6));hi[3]=fin(t,tU+0.3,0.6);
  const R=d1_map(ctx,t,{p:clamp((t-c("six")+0.2)/2.4,0,1),fill,hi,bo:clamp((t-w("biz","its concepts"))/1.4,0,1),boHi:fin(t,c("bo"),0.5)});
  // each layer confirmed by the people who own it
  R.forEach(([x,y,lw,lh],i)=>ownerTick(ctx,x+lw+40,y+lh/2,16,fin(t,c("drawn")+0.4+i*0.18,0.4)));
  // a business object, defined once in the business's words
  withA(ctx,fin(t,c("bo")+0.4,0.6)*(1-fin(t,tU,0.6)),()=>{glass(ctx,830,40,720,84,16,BUSC,{glow:12,ea:0.8,fill:"rgba(16,14,8,0.94)"});
    T(ctx,"where a home or a business meets the network",1190,94,{w:600,size:28,align:"center",color:rgba(INK,0.95)});});
  // the information layer: where data architecture works
  withA(ctx,fin(t,w("under","data architecture")-0.2,0.7),()=>{const y=R[3][1]+R[3][3]/2;arrowTo(ctx,1140,820,1140,R[5][1]+R[5][3]+18,DAC,0.8,{p:1,lw:2.4});
    tag(ctx,1140,850,"data architecture works here: in the information layer",DAC,{align:"center",size:30});ctx.save();ctx.strokeStyle=rgba(DAC,0.5);ctx.setLineDash([4,8]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1140,R[5][1]+R[5][3]+10);ctx.lineTo(1140,y+36);ctx.stroke();ctx.restore();});
  daPerson(ctx,"tomas",D1_TOM[0],D1_TOM[1],0.9,{t,a:fin(t,c("drawn")-0.3,0.8)});
  daPerson(ctx,"ines",D1_INES[0],D1_INES[1],0.95,{t,dir:-1,a:fin(t,c("hers")-0.2,0.8)});
  vign(ctx,S);});

/* ---------- 3. Three meanings ---------- */
const D1_SH=[[370,210,410,440,-0.012],[815,200,410,450,0.008],[1260,214,410,436,-0.006]];
// the team's decision, written down under the three sheets
const D1_RULE="Here, information architecture means data architecture, as DAMA defines it.";
function d1_rule(ctx){ruleCard(ctx,435,740,1170,D1_RULE,{kicker:"the team's decision",col:DAC,size:30});}
scene("three",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  wallBg(ctx,S,t);d1_cam(ctx,S,t,[[0,1060,540,1.0],[c("three")-0.4,1020,520,1.0],[c("web")-0.2,850,470,1.12],[c("analyst")-0.2,1030,470,1.12],[c("togaf")-0.2,1210,470,1.12],[c("writes")-0.1,1020,540,1.0]]);
  // the map leaves the wall first; the sheets come in after it
  const out=1-fin(t,0.1,0.7);if(out>0.01)d1_map(ctx,t,{a:out,p:1,fill:[0.6,0.6,0.6,0.6,0.6,0.6],hi:[0,0,0,1,0,0],bo:1});
  // her question
  withA(ctx,fin(t,c("asks")+0.2,0.6)*(1-fin(t,c("web")-0.6,0.6)),()=>{const s="Who here works on information architecture?",ww=tw(ctx,s,36,700)+80;glass(ctx,1020-ww/2,70,ww,92,20,TECH,{glow:12,ea:0.8,fill:"rgba(6,12,22,0.94)"});T(ctx,s,1020,128,{w:700,size:36,align:"center"});});
  // three people, three sheets: a website's menus, an analyst's model, and TOGAF's method
  const who=["the web team","an analyst","Tomás"];
  D1_SH.forEach(([x,y,sw,sh,rot],i)=>{const a=fin(t,c("three")+0.2+i*0.35,0.6);if(a<=0.01)return;
    arrive(ctx,x+sw/2,y+sh/2,t,c("three")+0.2+i*0.35,()=>d1_pin(ctx,x,y,sw,sh,1,rot,()=>{
      if(i===0)d1_web(ctx,x,y,sw,clamp((t-c("web")+0.1)/2.2,0,1));
      if(i===1)d1_model(ctx,x+10,y+20,sw,clamp((t-c("analyst")+0.1)/2.2,0,1));
      if(i===2)d1_adm(ctx,x+sw/2,y+sh/2-6,134,clamp((t-c("togaf")+0.1)/1.8,0,1),fin(t,w("togaf","a phase"),0.6));}),{d:0.8,dy:24});
    withA(ctx,a,()=>daOwner(ctx,x+40,y+sh+40,who[i],{col:TECH}));});
  // the website's menus are a real discipline, and out of scope here
  withA(ctx,fin(t,c("real")+0.1,0.4),()=>{ctx.save();ctx.translate(590,552);ctx.rotate(-0.1);const k=1+0.25*(1-spring(clamp((t-c("real")-0.1)/0.5,0,1.6)));ctx.scale(k,k);
    ctx.strokeStyle=rgba(BAD,0.9);ctx.lineWidth=4;rr(ctx,-130,-32,260,64,8);ctx.stroke();T(ctx,"not this one",0,11,{w:800,size:32,align:"center",color:rgba(BAD,0.95)});ctx.restore();});
  // what each one means, under its sheet
  [["a website's menus",c("web")+1.0],["information, and how it flows",c("analyst")+1.4],["a phase of TOGAF's method",c("togaf")+1.2]].forEach(([s,t0],i)=>{const[x,y,sw,sh]=D1_SH[i];
    withA(ctx,fin(t,t0,0.5),()=>T(ctx,s,x+sw/2,y+sh-24,{w:700,size:28,align:"center",color:"rgba(150,52,40,0.95)"}));});
  // the team's decision, written down
  const dA=fin(t,c("writes")+0.6,0.6);if(dA>0.01)arrive(ctx,1020,800,t,c("writes")+0.6,()=>d1_rule(ctx),{d:0.8});
  daPerson(ctx,"tomas",D1_TOM[0],D1_TOM[1],0.9,{t});
  daPerson(ctx,"ines",D1_INES[0],D1_INES[1],0.95,{t,dir:-1});
  vign(ctx,S);});

/* ---------- 4. One discipline ---------- */
scene("dama",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tD=c("domains"),tA=c("archimate");
  wallBg(ctx,S,t);d1_cam(ctx,S,t,[[0,1020,540,1.0],[0.9,960,520,1.0],[tD-0.6,2880,520,1.0],[tA,2880,560,1.0],[c("draws")+0.4,2880,560,1.02]]);
  // the sheets and the decision leave the wall first
  const out=1-fin(t,0.0,0.6);if(out>0.01)withA(ctx,out,()=>{D1_SH.forEach(([x,y,sw,sh,rot])=>d1_pin(ctx,x,y,sw,sh,1,rot,null));d1_rule(ctx);});
  // DAMA's body of knowledge, and the old distinction, data and information
  const tB=c("dmbok"),tF=c("form"),tO=c("one"),mg=ease(clamp((t-tO-0.3)/1.2,0,1));
  const dmOut=1-fin(t,tD-0.8,0.6);if(dmOut>0.01)withA(ctx,dmOut,()=>{arrive(ctx,420,400,t,tB+0.2,()=>d1_book(ctx,300,250,"DAMA-DMBOK",1),{d:0.8});
  const dx=lerp(860,1260,mg),ix=lerp(1520,1260,mg),split=1-fin(t,tO+0.5,0.5);
  if(split>0.01){withA(ctx,split,()=>{d1_word(ctx,dx,370,"data","facts",[170,205,255],fin(t,w("dmbok","data as")-0.2,0.6));d1_word(ctx,ix,370,"information","data with meaning",INFC,fin(t,w("dmbok","information as")-0.2,0.6));});
    withA(ctx,fin(t,tF+0.1,0.6)*(1-fin(t,tO+0.2,0.5)),()=>{arrowTo(ctx,dx+120,330,ix-170,330,SOFT,0.8,{p:1,bend:-0.12,lw:2.4});arrowTo(ctx,ix-170,412,dx+120,412,SOFT,0.8,{p:1,bend:-0.12,lw:2.4});});}
  withA(ctx,fin(t,tF+0.6,0.6)*(1-fin(t,tO+0.2,0.5)),()=>wrapT(ctx,"Data is a form of information, and information is a form of data.",1190,560,900,{size:34,w:700,align:"center",color:rgba(INK,0.95),lh:44}));
  if(fin(t,tO+1.05,0.5)>0.01)d1_word(ctx,1260,370,"data architecture","one discipline",DAC,fin(t,tO+1.05,0.5),{hi:pulseAt(t,tO+1.4,1.6)});});
  // TOGAF: four domains, data and applications held together
  const dmA=1-fin(t,tA-0.3,0.5);if(dmA>0.01)withA(ctx,dmA,()=>{withA(ctx,fin(t,tD+0.3,0.6),()=>T(ctx,"TOGAF",2880,326,{w:800,size:34,align:"center",color:rgba(INK,0.9)}));
    d1_domains(ctx,2235,380,clamp((t-tD-0.3)/1.4,0,1),clamp((t-w("domains","but groups"))/1.0,0,1));});
  // ArchiMate: the business layer and the application layer, and nothing between them; then the map's layer there
  const bA=fin(t,tA+0.2,0.6),tBt=c("between"),tDr=c("draws");
  if(bA>0.01){withA(ctx,bA,()=>T(ctx,"ArchiMate",2880,166,{w:800,size:34,align:"center",color:rgba(INK,0.9)}));d1_band(ctx,2120,200,1520,170,"business layer",BUSC,bA);d1_band(ctx,2120,560,1520,170,"application layer",APPC,bA);
    withA(ctx,bA,()=>{daBO(ctx,2780,246,360,96,"connection point",{size:30});daDO(ctx,2780,606,360,96,"service point",null,{col:APPC,size:30});});
    const gapA=fin(t,tBt-0.2,0.6)*(1-fin(t,tDr+0.4,0.6));withA(ctx,gapA,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.7);ctx.setLineDash([8,10]);ctx.lineWidth=2;rr(ctx,2120,392,1520,146,14);ctx.stroke();ctx.restore();
      T(ctx,"nothing in between",2880,478,{w:700,size:32,align:"center",color:rgba(SOFT,1)});});
    const inA=fin(t,tDr+0.2,0.7);if(inA>0.01)d1_band(ctx,2120,392,1520,146,"information layer",INFC,inA,{hi:pulseAt(t,tDr+0.8,1.6)});
    withA(ctx,fin(t,tDr+0.9,0.6),()=>T(ctx,"where data architecture works",2880,486,{w:700,size:30,align:"center",color:rgba(mix(INFC,INK,0.3),1)}));}
  daPerson(ctx,"tomas",D1_TOM[0],D1_TOM[1],0.9,{t});
  daPerson(ctx,"ines",D1_INES[0],D1_INES[1],0.95,{t,dir:-1});
  vign(ctx,S);});

/* ---------- 5. One word, six records ---------- */
// the model on the upper part of the wall, at x0: the business object, its owner, its six records, and the lines between them. The
// records sit four over two, each lower one under a gap of the row above, so all six lines run clear (D1_POS, d1_route in plan.js)
const D1_X0=3840,D1_BOX=[D1_X0+760,70,400,110];
// where the people stand at the model (their feet), and the top of the world under it, on the lower part of the wall
const D1_PY=1070,D1_LY=1340;
// the order the lines arrive at the business object, left to right: each record's place in it
const D1_ORD=[0,2,3,5,1,4];
function d1_model5(ctx,t,o){const X=D1_X0,[bx,by,bw,bh]=D1_BOX,B=by+bh;o=o||{};const rq=i=>o.rec?o.rec(i):0;
  // the lines first, so the records sit over where they start: faint while nobody has drawn them, then drawn and owned
  D1_REC.forEach((_,i)=>{const q=rq(i);if(q<=0.01)return;const P=d1_route(i,X,B),lp=o.line?o.line(i):0;
    if(o.dash>0.01&&lp<1)d1_faint(ctx,P,o.dash*q*(1-lp));if(lp>0.01)d1_real(ctx,P,lp,{});});
  if(o.bo>0.01){daBO(ctx,bx,by,bw,bh,"connection point",{a:o.bo,size:36,hi:o.boHi||0});
    withA(ctx,o.def==null?o.bo:o.def,()=>T(ctx,"where a home or a business meets the network",bx+bw/2,by+bh+46,{w:600,size:30,align:"center",color:rgba(INK,0.9)}));}
  if(o.own>0.01)daOwner(ctx,bx+bw+40,by+bh/2,"Grace · network operations",{a:o.own,col:BIZ,hi:o.ownHi||0});
  D1_REC.forEach(([n,s],i)=>{const q=rq(i);if(q<=0.01)return;const[rx,ry]=D1_POS[i];
    arrive(ctx,X+rx+D1_RW/2,ry+D1_RH/2,q*0.8,0,()=>daDO(ctx,X+rx,ry,D1_RW,D1_RH,n,"in "+s,{hi:o.recHi?o.recHi(i):0,size:30}),{d:0.8});
    // the network's ID, on a chip under the record's right end
    if(o.id>0.01)d1_id(ctx,X+rx+D1_RW-214,ry+D1_RH+14,o.id*clamp(o.id*6-D1_ORD[i],0,1),o.idHi);});
  // the owner's mark on each line, all at one height: a question while nobody owns it, a tick once someone does
  if(o.q>0.01)D1_REC.forEach((_,i)=>{const q=rq(i);if(q<=0.01)return;const[mx,my]=d1_mark(i,X,B);
    if(o.qHi>0.01)glow(ctx,mx,my,46,BAD,0.5*o.qHi*(1-(o.owned?o.owned(i):0)));daUnowned(ctx,mx,my,o.q*q,{owned:o.owned?o.owned(i):0});});}
// the world under the model, on the lower part of the wall: the storm, the homes, the texts
const D1_HOMES=[...Array(11)].map((_,i)=>[D1_X0+200+i*125,D1_LY+650+(i%2)*26]);
// the two records the outage texts are matched on, side by side, and the arrow from one to the other
function d1_pair(ctx,X,y,a){if(a<=0.01)return;withA(ctx,a,()=>{daDO(ctx,X+980,y,330,96,"service location",null,{size:28});daDO(ctx,X+1350,y,330,96,"supply address",null,{size:28});arrowTo(ctx,X+1310,y+48,X+1350,y+48,INFC,0.9,{p:1,lw:2.4});});}
scene("point",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tS=c("storm"),tN=c("nobody"),X=D1_X0;
  wallBg(ctx,S,t);d1_cam(ctx,S,t,[[0,2880,560,1.02],[0.6,X+960,430,1.0],[tS-0.5,X+960,D1_LY+360,1.0],[tN-0.4,X+960,430,1.0]]);
  // the earlier part of the wall, left behind as the camera moves on
  const keep=1-fin(t,0.5,0.6);if(keep>0.01)withA(ctx,keep,()=>{T(ctx,"ArchiMate",2880,166,{w:800,size:34,align:"center",color:rgba(INK,0.9)});d1_band(ctx,2120,200,1520,170,"business layer",BUSC,1);d1_band(ctx,2120,392,1520,146,"information layer",INFC,1);d1_band(ctx,2120,560,1520,170,"application layer",APPC,1);
    daBO(ctx,2780,246,360,96,"connection point",{size:30});daDO(ctx,2780,606,360,96,"service point",null,{col:APPC,size:30});T(ctx,"where data architecture works",2880,486,{w:700,size:30,align:"center",color:rgba(mix(INFC,INK,0.3),1)});});
  const tR=[c("names"),w("names","Meter"),w("names","Billing"),c("more"),w("more","The outage"),w("more","the data platform")];
  d1_model5(ctx,t,{bo:fin(t,c("word")+0.2,0.7),boHi:pulseAt(t,c("word")+0.4,1.4),own:fin(t,w("grace","Grace")-0.1,0.6),rec:i=>fin(t,tR[i]-0.2,0.5),recHi:i=>pulseAt(t,tR[i],1.2)*0.8,
    dash:fin(t,tN-0.6,0.6),q:fin(t,w("nobody","Nobody")-0.3,0.5)});
  withA(ctx,fin(t,c("six")+0.2,0.5)*(1-fin(t,tS-0.9,0.5)),()=>tag(ctx,X+960,650,"six systems, six names",APPC,{align:"center",size:30}));
  daPerson(ctx,"grace",X+170,D1_PY,0.9,{t,a:fin(t,w("grace","Grace")-0.3,0.8)});
  daPerson(ctx,"ines",X+1760,D1_PY,0.95,{t,dir:-1,expr:d1_face(t,w("nobody","Nobody")-0.2,1e9)});
  // the storm: 3,400 connection points without power
  const stA=fin(t,tS-0.3,0.7);d1_storm(ctx,X+150,D1_LY,700,360,t,clamp((t-w("storm","a storm"))/0.6,0,1),stA);
  withA(ctx,stA,()=>{T(ctx,"3,400",X+500,D1_LY+180,{w:800,size:84,align:"center",color:rgba(INK,1)});T(ctx,"connection points without power",X+500,D1_LY+240,{w:600,size:30,align:"center",color:rgba(INK,0.92)});});
  // the texts: from the outage system's locations to customer service's addresses
  const tT=c("texts"),tM=c("missed");withA(ctx,fin(t,tT-0.1,0.6),()=>d1_text(ctx,X+980,D1_LY+30,700,"Power is out on your street. We're on it.",1));d1_pair(ctx,X,D1_LY+150,fin(t,tT-0.1,0.6));
  d1_addr(ctx,X+980,D1_LY+290,fin(t,tM+0.5,0.6),pulseAt(t,tM+1.4,1.6));
  // the homes: most get a text, 180 don't, and sit in the dark
  D1_HOMES.forEach(([hx,hy],i)=>{const miss=i===3||i===8,q=fin(t,tT+0.6+i*0.08,0.5);d1_home(ctx,hx,hy,0.95,0,q,{mark:fin(t,(miss?tM+0.3:tT+1.2)+i*0.05,0.4),ok:!miss});});
  withA(ctx,fin(t,tM+0.2,0.6),()=>{T(ctx,"180",X+1760,D1_LY+650,{w:800,size:72,align:"right",color:rgba(BAD,1)});T(ctx,"households: no text",X+1760,D1_LY+692,{w:700,size:30,align:"right",color:rgba(BAD,0.95)});});
  vign(ctx,S);});

/* ---------- 6. An architecture of its own ---------- */
scene("own",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const X=D1_X0,tF=c("for"),tO=c("outlives"),tMn=c("many"),tJ=c("join"),tDs=c("discipline"),tL=c("lines"),tDc=c("decides"),tMt=c("matched"),tNx=c("next");
  const tMe=w("join","Meaning"),tSt=w("join","storage"),tSo=w("join","Someone");
  wallBg(ctx,S,t);d1_cam(ctx,S,t,[[0,X+960,430,1.0],[tO-0.3,X+960,D1_LY+380,1.0],[tMn-0.4,X+960,430,1.0],[tMt-0.3,X+960,D1_LY+360,1.0]]);
  // the model stays where it was; its lines get drawn, left to right, and owned, and each record gets the network's ID
  const lineP=i=>clamp((t-tL-0.3-D1_ORD[i]*0.35)/0.9,0,1);
  d1_model5(ctx,t,{bo:1,def:1-fin(t,tDc-0.3,0.4),boHi:pulseAt(t,tMe+0.1,1.4),own:1,ownHi:pulseAt(t,tMe+0.1,1.4),rec:()=>1,recHi:i=>pulseAt(t,tMn+0.4+D1_ORD[i]*0.12,1.2)*0.6+pulseAt(t,tSt+0.1+D1_ORD[i]*0.06,1.2)*0.5,
    dash:1,q:1,qHi:pulseAt(t,tF+0.4,1.8)+pulseAt(t,tSo+0.2,1.6),owned:i=>fin(t,tL+0.9+D1_ORD[i]*0.35,0.4),line:lineP,id:fin(t,w("decides","carries")-0.2,1.0),idHi:pulseAt(t,tMt+0.4,1.4)});
  daPerson(ctx,"grace",X+170,D1_PY,0.9,{t});
  daPerson(ctx,"ines",X+1760,D1_PY,0.95,{t,dir:-1,expr:d1_face(t,-1,tL)});
  // the systems come and go; the connection points stay
  const lfA=fin(t,tO-0.1,0.6)*(1-fin(t,tMn-0.6,0.5));if(lfA>0.01)d1_life(ctx,X+260,D1_LY+140,1400,clamp((t-tO)/2.4,0,1),fin(t,w("march","Billing")+0.2,1.0),lfA);
  // meaning, storage, and the join between them: nobody's, until DAMA makes it a discipline of its own
  withA(ctx,fin(t,tMe-0.1,0.5)*(1-fin(t,tL,0.5)),()=>tag(ctx,X+60,125,"meaning: the business",BIZ,{size:28}));
  withA(ctx,fin(t,tSt-0.1,0.5)*(1-fin(t,tL,0.5)),()=>tag(ctx,X+960,650,"storage: the systems",APPC,{align:"center",size:28}));
  const jN=fin(t,tSo-0.1,0.5)*(1-fin(t,tDs,0.3)),jD=fin(t,tDs+0.3,0.5)*(1-fin(t,tDc-0.6,0.5));
  withA(ctx,jN,()=>tag(ctx,X+60,290,"the join: nobody",BAD,{size:28}));withA(ctx,jD,()=>tag(ctx,X+60,290,"the join: data architecture",DAC,{size:28}));
  // the decision: every system that needs a connection point carries the network's ID for it
  const dcA=fin(t,tDc+0.1,0.6)*(1-fin(t,tMt-0.6,0.5));if(dcA>0.01)withA(ctx,dcA,()=>ruleCard(ctx,X+60,50,640,"Every system that needs a connection point carries the network's ID for it.",{kicker:"decision · Inés, data architect",col:DAC,size:30}));
  // the next storm: texts matched on the ID, and every home gets one
  const mA=fin(t,tMt-0.2,0.6);d1_pair(ctx,X,D1_LY+30,mA);withA(ctx,mA,()=>{d1_id(ctx,X+990,D1_LY+150,1,pulseAt(t,tMt+0.6,1.2));d1_id(ctx,X+1360,D1_LY+150,1,pulseAt(t,tMt+0.6,1.2));kt_gtick(ctx,X+1330,D1_LY+78,18,fin(t,tMt+1.0,0.4));
    d1_storm(ctx,X+150,D1_LY,700,360,t,clamp((t-tNx+0.2)/0.6,0,1),1);T(ctx,"2,100",X+500,D1_LY+180,{w:800,size:84,align:"center",color:rgba(INK,1)});T(ctx,"households on the list",X+500,D1_LY+240,{w:600,size:30,align:"center",color:rgba(INK,0.92)});});
  D1_HOMES.forEach(([hx,hy],i)=>d1_home(ctx,hx,hy,0.95,0,mA*fin(t,tMt+0.2+i*0.05,0.5),{mark:fin(t,tNx+0.6+i*0.08,0.4),ok:true}));
  withA(ctx,fin(t,tNx+1.6,0.6),()=>{T(ctx,"every one",X+1760,D1_LY+650,{w:800,size:60,align:"right",color:rgba(TRUST,1)});T(ctx,"got its text",X+1760,D1_LY+692,{w:700,size:30,align:"right",color:rgba(TRUST,0.95)});});
  vign(ctx,S);});

/* ---------- 7. The data practice on the map ---------- */
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const X=D1_X0,tAb=c("above"),tLy=c("layer"),tRe=c("realises"),tOw=c("owned"),tLt=c("later");
  wallBg(ctx,S,t);d1_cam(ctx,S,t,[[0,X+960,D1_LY+360,1.0],[0.5,X+960,400,1.0]]);
  // the lower part of the wall, left as it was while the camera rises
  const keep=1-fin(t,1.2,0.6);if(keep>0.01)withA(ctx,keep,()=>{d1_storm(ctx,X+150,D1_LY,700,360,t,0,1);T(ctx,"2,100",X+500,D1_LY+180,{w:800,size:84,align:"center",color:rgba(INK,1)});T(ctx,"households on the list",X+500,D1_LY+240,{w:600,size:30,align:"center",color:rgba(INK,0.92)});
    D1_HOMES.forEach(([hx,hy])=>d1_home(ctx,hx,hy,0.95,0,1,{mark:1,ok:true}));d1_pair(ctx,X,D1_LY+30,1);d1_id(ctx,X+990,D1_LY+150,1,0);d1_id(ctx,X+1360,D1_LY+150,1,0);kt_gtick(ctx,X+1330,D1_LY+78,18,1);
    T(ctx,"every one",X+1760,D1_LY+650,{w:800,size:60,align:"right",color:rgba(TRUST,1)});T(ctx,"got its text",X+1760,D1_LY+692,{w:700,size:30,align:"right",color:rgba(TRUST,0.95)});});
  // the two layers behind the model: business above, information under it; the lines cross from one to the other
  const bA=fin(t,tAb-0.2,0.7),iA=fin(t,tLy-0.2,0.7);
  withA(ctx,bA,()=>{ctx.save();ctx.fillStyle=rgba(BUSC,0.07);ctx.strokeStyle=rgba(BUSC,0.55);ctx.lineWidth=2;rr(ctx,X+40,20,1840,240,18);ctx.fill();ctx.stroke();ctx.restore();T(ctx,"business",X+70,62,{w:800,size:30,color:rgba(mix(BUSC,INK,0.35),1)});});
  withA(ctx,iA,()=>{ctx.save();ctx.fillStyle=rgba(INFC,0.07);ctx.strokeStyle=rgba(INFC,0.55);ctx.lineWidth=2;rr(ctx,X+40,340,1840,400,18);ctx.fill();ctx.stroke();ctx.restore();T(ctx,"information",X+70,378,{w:800,size:30,color:rgba(mix(INFC,INK,0.35),1)});});
  // the model, its lines drawn again as the narration names them, each one owned; the IDs stay with their records
  const rp=i=>clamp((t-tRe-0.3-D1_ORD[i]*0.25)/0.7,0,1);
  d1_model5(ctx,t,{bo:1,def:0,own:1,rec:()=>1,recHi:i=>pulseAt(t,tRe+0.2+D1_ORD[i]*0.1,1.0)*0.5,line:i=>Math.max(1-fin(t,0.2,0.4),rp(i)),q:fin(t,tOw,0.5),owned:i=>fin(t,tOw+0.2+D1_ORD[i]*0.15,0.4),id:1-fin(t,0.2,0.5)});
  withA(ctx,fin(t,c("adds")+0.2,0.6),()=>tag(ctx,X+960,-50,"the data practice on the map",DAC,{align:"center",size:30}));
  daPerson(ctx,"grace",X+170,D1_PY,0.9,{t});daPerson(ctx,"ines",X+1760,D1_PY,0.95,{t,dir:-1});
  // what the next films add to this layer, in its free middle
  ["where each fact is born","how it travels","who owns which data"].forEach((s,i)=>withA(ctx,fin(t,w("later",["born","travels","owns"][i])-0.2,0.5),()=>{const y=560+i*60,ww=tw(ctx,s,28,700)+48;
    ctx.save();ctx.setLineDash([6,8]);ctx.strokeStyle=rgba(INFC,0.7);ctx.lineWidth=2;rr(ctx,X+960-ww/2,y,ww,46,23);ctx.stroke();ctx.restore();T(ctx,s,X+960,y+33,{w:700,size:28,align:"center",color:rgba(mix(INFC,INK,0.3),1)});}));
  vign(ctx,S);});

/* ---------- 8. Draw it first ---------- */
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tI=c("ines"),tH=c("home"),tP=c("pyramid"),toU=fin(t,tI-0.6,1.2);
  // the mill's drawing again, every number in its place, in lamp-light
  const chA=1-toU;if(chA>0.01){ctx.save();ctx.globalAlpha=chA;d1_night(ctx,S,t);setScreen(ctx,S);focus(ctx,t,[[0,960,480,1.0],[c("same"),960,440,1.06]],1.8);
    withA(ctx,0.5,()=>daChile(ctx,1660,40,620,{lines:1,dots:1,label:false,pulse:i=>((t*0.22+hash(i,5))%1)}));
    daFlow(ctx,150,120,1420,500,D1_STEPS,{title:"how the mill works",p:1,marks:[[0,"cotton in stock",1],[1,"yarn spun",1],[2,"cloth woven",1],[4,"cloth shipped",1]],mcol:[178,62,46]});
    d1_people(ctx,190,500,560,1,1);
    // the same numbers, read the same way: the telex paper carries them to Santiago
    daTelex(ctx,1300,960,0.95,{paper:clamp((t-c("same"))/3,0,1),t,a:fin(t,c("same")-0.2,0.7)});
    daSil(ctx,1080,960,330,{a:fin(t,c("same"),0.8)});
    ctx.restore();}
  // the utility: one word, its records, and a line with an owner; then every home gets its text
  if(toU>0.01){ctx.save();ctx.globalAlpha=toU;wallBg(ctx,S,t);const X=D1_X0;setScreen(ctx,S);focus(ctx,t,[[tI-0.6,X+960,430,1.0],[tH-0.3,X+960,D1_LY+360,1.0]],1.8);
    d1_model5(ctx,t,{bo:1,def:0,own:1,rec:()=>1,line:()=>1,q:1,owned:()=>1});
    daPerson(ctx,"grace",X+170,D1_PY,0.9,{t});daPerson(ctx,"ines",X+1760,D1_PY,0.95,{t,dir:-1});
    D1_HOMES.forEach(([hx,hy],i)=>d1_home(ctx,hx,hy,0.95,fin(t,tH+0.2+i*0.06,0.5),1,{mark:fin(t,tH+0.6+i*0.06,0.4),ok:true}));
    withA(ctx,fin(t,tH+0.8,0.6),()=>d1_text(ctx,X+560,D1_LY+80,600,"Power is out on your street. We're on it.",1));
    // a famous pyramid, drawn faintly, for the next film
    withA(ctx,fin(t,w("pyramid","famous pyramid")-0.2,0.8)*0.9,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.7);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(X+1560,D1_LY-40);ctx.lineTo(X+1380,D1_LY+270);ctx.lineTo(X+1740,D1_LY+270);ctx.closePath();ctx.stroke();
      [40,120,200].map(d=>D1_LY+d).forEach(y=>{const hw=(y-D1_LY+40)/310*180;ctx.beginPath();ctx.moveTo(X+1560-hw,y);ctx.lineTo(X+1560+hw,y);ctx.stroke();});ctx.restore();T(ctx,"half right",X+1560,D1_LY+326,{w:700,size:30,align:"center",color:rgba(SOFT,1)});});
    ctx.restore();}
  vign(ctx,S);
  daEnd(ctx,S,t,B+0.8,"Between the business and the systems","Draw what the business means first; then every record has a line to it.","Film 1 of 6");});
