/* ===== An application or a platform?: scenes =====
   Eleven chapters, as in ../script.md. Japan in 1601: the country in many domains, a traveller two weeks on the road from Edo to
   Kyoto, Ieyasu's order to each station (thirty-six horses, official travellers carried on, no seal, no horses), the five roads, a
   letter relayed in three or four days, and the road shared by lords, couriers, merchants and pilgrims. Then the utility: Ravi Menon
   and the data platform, drawn on Tomás's map as one more application; the two meanings of "platform"; the test; the finance
   system, which serves everyone and is still an application; whose logic it is; a measure nobody could say was whose; an owner who
   answers to every domain; why the map matters most here; the data practice on the map; and the road again.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame, and what's drawn small is texture. Motion: every
   shot drifts slowly and things arrive with a spring; inside a room the camera glides, and between rooms the whole picture
   dissolves. Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in
   step. */

/* ---------- shared by the chapters ---------- */
const P1_DOM=[["network",APPC,"Grace"],["retail",APPC,"head of retail"],["finance",APPC,"head of finance"],["enterprise",[176,196,255],"Ama"]];
// where the four domains' blocks sit on a platform that starts at x0: 290 wide, 300 apart
const p1_bx=(x0,i)=>x0+30+i*300;
// the domains of 1601: a patchwork of cells over the land, each a little different, clipped to the coast
function p1_domains(ctx,v,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.clip(psaLandPath(v));
  const g=0.42,cell=(i,j)=>{const lon=134.2+i*g+(hash(i*31+j,5)-0.5)*g*0.5,lat=33.4+j*g+(hash(i*17+j,6)-0.5)*g*0.5;return[lon,lat];};
  for(let i=0;i<18;i++)for(let j=0;j<12;j++){const P=[cell(i,j),cell(i+1,j),cell(i+1,j+1),cell(i,j+1)].map(p=>psaJP(p[0],p[1],v)),k=hash(i*7+j*13,9);
    ctx.beginPath();P.forEach(([x,y],n)=>n?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=rgba(mix([90,100,140],[170,130,90],k),0.08+0.08*hash(i,j+40));ctx.fill();
    ctx.strokeStyle="rgba(200,190,170,0.22)";ctx.lineWidth=1.2;ctx.setLineDash([5,6]);ctx.stroke();ctx.setLineDash([]);}
  ctx.restore();});}
// a light that travels along a path, with a fading trail: a traveller, or a letter
function p1_runner(ctx,pts,u,col,o){o=o||{};if(u<=0)return;const tr=o.trail||0.08,n=14;for(let i=n;i>=0;i--){const uu=u-tr*i/n;if(uu<0)continue;const[x,y]=psaAlong(pts,uu);withA(ctx,(1-i/n)*0.7,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,(o.r||6)*(1-i/n*0.6),0,TAU);ctx.fill();});}
  const[x,y]=psaAlong(pts,u);glow(ctx,x,y,(o.r||6)*6,col,0.55);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,y,o.r||6,0,TAU);ctx.fill();return[x,y];}
// the dusk road, with its pines and a station: shared by the opening, Whose logic and An owner who answers to all
function p1_road(ctx,S,t,o){o=o||{};psaDusk(ctx,S,{d:o.d==null?1:o.d,y0:760});
  [[80,0.95,1],[330,1.1,2],[1180,1.0,3],[1560,1.15,4],[1840,0.9,5]].forEach(([x,s,k])=>{if(o.noPine&&o.noPine(x))return;psaPine(ctx,x,762,s,k,{rim:PSC});});}
// the utility's room: dark, quiet, a few motes
function p1_room(ctx,S,t){setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40,col:[150,190,255]});}
// the plain dark a room leaves into, under a title or the end card
function p1_base(ctx,S){setScreen(ctx,S);ctx.fillStyle="rgb(3,5,11)";ctx.fillRect(0,0,W,H);}
// a small copy of Tomás's map, its six layers, for a corner of the frame
function p1_miniMap(ctx,x,y,w,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{layerStack(ctx,x,y,w,{sh:o.sh||34,gap:o.gap||9,size:o.size||28,hi:o.hi,fill:o.fill,deco:o.deco});});}

/* ---------- 1. Five roads from Edo ---------- */
// the order each station received early in 1601 (the first month of Keichō 6), and the seal that came with it
const P1_ORDER=["ORDER · 1601","Keep thirty-six horses.","Carry official travellers","on to the next station."];
scene("road",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tO=c("order"),tR=c("roads"),tF=c("fast"),tSh=c("shared"),tRv=c("ravi"),tW=c("wrong"),tB=c("better");
  // which room: the map (to the order, and again from the roads to the shared road), the road at dusk, then the utility
  // and, under the title, the last room leaves whole, so no word of it shows under the title's
  const outA=1-fin(t,B+1.0,0.7),roadA0=fin(t,tO-0.7,0.9)*(1-fin(t,tR-0.7,0.9)),road2A0=fin(t,tSh-0.6,0.9)*(1-fin(t,tRv-0.6,0.9)),utilA0=fin(t,tRv-0.6,0.9);
  const roadA=roadA0*outA,road2A=road2A0*outA,utilA=utilA0*outA,mapA=Math.max(0,1-roadA0-road2A0-utilA0)*outA;if(outA<1)p1_base(ctx,S);
  /* the map */
  psaRooms(ctx,[[mapA,ctx=>{psaSea(ctx,S,{dusk:0.15});ctx.save();
    const tE=w("domains","Edo"),tK=w("domains","Kyoto"),tD=w("domains","many domains"),tS=c("slow"),tN=c("need");
    const CK=[[0,880,250,0.46],[tE-0.6,1000,560,1.0],[tR-0.2,1040,470,0.86],[tF-0.2,980,600,1.02]],z=focusZ(t,CK,2.4);focus(ctx,t,CK,2.4);
    const v=PSA_VIEW,lit=fin(t,tR,2.0)*0.4,second=t>tR-0.8;
    const TK=psaMap(ctx,v,t,{lit,tkd:second?1:fin(t,tS-0.2,1.0)*0.5,roads:second?clamp((t-tR-0.2)/3.6,0,1):0,st:second?fin(t,w("roads","stations"),1.4):0,
      lit_:i=>{const u=(t-w("fast","station")+0.2)/3.2,k=i/(PSA_TKD.length-1),d=(1-k)-u;return t>tF-0.4?clamp(1-Math.abs(d)*6,0,1)*0.9+fin(t,tF+3.6,1.0)*0.3:0;},
      ends:fin(t,tE-0.3,0.8),namesA:fin(t,tE-0.2,0.8),nameSize:34/z});
    // the emperor's city named as it's said; the domains between, each its own
    p1_domains(ctx,v,fin(t,tD-0.2,1.0)*(1-fin(t,tR-1.2,0.8))*0.9);
    // a traveller on foot: two weeks from Edo to Kyoto, a day at a time
    const walk=clamp((t-tS-0.3)/(tN-tS+0.3),0,1);if(t>tS&&t<tR-0.6){const RTK=TK.slice().reverse().reverse();p1_runner(ctx,RTK,walk,[255,226,180],{r:6,trail:0.06});}
    const day=Math.max(1,Math.min(14,Math.round(1+walk*13)));
    // the five roads named, and the relay: a letter that runs station to station
    withA(ctx,fin(t,w("roads","Gokaidō")-0.2,0.6)*(1-fin(t,tF-0.4,0.5)),()=>psaName(ctx,"the Gokaidō, five roads from Edo",1520,250,{size:34/z,align:"center",color:rgba(PSC,1)}));
    if(t>tF-0.2){const u=clamp((t-w("fast","station")+0.2)/3.2,0,1);p1_runner(ctx,TK,u,PSC,{r:7,trail:0.12});}
    ctx.restore();
    // where and when, then how long it took
    eaYear(ctx,80,80,"Japan · 1601",CLAY,fin(t,0.5,0.8)*(1-fin(t,tO-0.8,0.5)));
    withA(ctx,fin(t,tS+0.4,0.5)*(1-fin(t,tN+2.4,0.5)),()=>tag(ctx,960,160,"on foot · day "+day,[255,226,180],{align:"center",size:32}));
    withA(ctx,fin(t,w("need","days"),0.5)*(1-fin(t,tO-0.8,0.5)),()=>tag(ctx,960,240,"days, not weeks",PSC,{align:"center",size:36}));
    // the relay against the walk
    const tD3=w("fast","three or four");withA(ctx,fin(t,tF+0.4,0.5)*(1-fin(t,tSh-0.8,0.5)),()=>{tag(ctx,960,150,"on foot · about two weeks",[200,200,210],{align:"center",size:30});
      const sw=tw(ctx,"on foot · about two weeks",30,700)+26,k=fin(t,tD3-0.2,0.5);if(k>0.01){ctx.save();ctx.strokeStyle=rgba(PS_RED,0.95);ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(960-sw/2+8,150);ctx.lineTo(960-sw/2+8+(sw-16)*k,150);ctx.stroke();ctx.restore();}});
    withA(ctx,fin(t,tD3,0.6)*(1-fin(t,tSh-0.8,0.5)),()=>tag(ctx,960,226,"relayed · three or four days",PSC,{align:"center",size:36}));}],
  /* the road at dusk: a station, its horses, and the order with its seal */
  [roadA,ctx=>{const u=t-tO+0.7;p1_road(ctx,S,t,{d:1});ctx.save();drift(ctx,u,{dur:12},{z:0.03,y:640});
    psaStation(ctx,1260,762,1.05,{lit:fin(t,tO-0.3,1.2)});
    // its horses, waiting: four drawn, thirty-six kept
    [[960,0.62,1],[1236,0.6,-1],[1446,0.62,1],[1716,0.6,-1]].forEach(([x,s,d],i)=>psaHorse(ctx,x,776,s,t,{dir:d,still:true,ph:i*0.13,rim:PSC}));
    withA(ctx,fin(t,w("order","thirty-six"),0.5),()=>tag(ctx,1340,430,"36 horses at every station",PSC,{align:"center",size:32}));
    ctx.restore();
    const pp=clamp((t-w("order","keep")+0.3)/3.0,0,1),seal=fin(t,w("seal","seal")-0.1,0.4);
    arrive(ctx,430,385,t,tO-0.1,()=>psaPaper(ctx,110,150,640,470,P1_ORDER,{p:pp,size:38,kicker:true,seal,sx:540,sy:356,rot:-0.02,
      foot:"Without this seal, no horses.",footA:fin(t,w("seal","without")-0.1,0.5),footY:404,footSize:30}),{dy:-18});}],
  /* the road at dusk again: everyone on it */
  [road2A,ctx=>{const u=t-tSh+0.6;p1_road(ctx,S,t,{d:0.85,noPine:x=>x>1100&&x<1400});ctx.save();drift(ctx,u,{dur:10},{z:0.03,y:640});
    psaStation(ctx,250,762,0.8,{lit:1});
    const tL=w("shared","lords"),tC=w("shared","couriers"),tM=w("shared","merchants"),tP=w("shared","pilgrims");
    // farther off, a lord's procession on its way to Edo (to the right), slow and stately: retainers with their spears, the palanquin
    const sF=0.74,hz=[34,28,38],vF=psaPace("walker",sF,0.4),xF=v=>v+u*vF;
    [[150,0],[250,0.3],[350,0.6]].forEach(([x,ph])=>psaWalker(ctx,xF(x),758,sF,t,{kind:"spear",ph,rate:0.4,col:hz}));
    psaPalanquin(ctx,xF(560),758,sF,t,{ph:0.2,rate:0.4,col:hz});
    // nearer, a courier running the same way, a letter box on his pole
    const sC=0.88,cx_=-140+(t-tC+1.8)*psaPace("courier",sC);if(t>tC-1.9)psaWalker(ctx,cx_,778,sC,t,{kind:"courier",ph:0.1});
    // nearest, going the other way: a merchant's porter leading his pack horse, and two pilgrims with their staffs
    const vN=psaPace("walker",1,0.42),xN=v=>v-u*vN;
    psaWalker(ctx,xN(1470),802,1,t,{kind:"porter",dir:-1,ph:0.4,rate:0.42});psaHorse(ctx,xN(1720),804,0.9,t,{dir:-1,pack:true,ph:0.3,rate:vN/(93*0.9)});
    [[1880,0.2],[1985,0.7]].forEach(([x,ph])=>psaWalker(ctx,xN(x),802,1,t,{kind:"pilgrim",dir:-1,ph,rate:0.42}));
    ctx.restore();
    // each named as it's said, its name going with it
    const row=(s_,x,y,t0)=>withA(ctx,fin(t,t0-0.1,0.5)*(1-fin(t,tRv-0.9,0.5)),()=>tag(ctx,x,y,s_,PSC,{align:"center",size:32}));
    row("lords",xF(500),330,tL);row("couriers",clamp(cx_,240,1680),262,tC);row("merchants",xN(1595),330,tM);row("pilgrims",xN(1932),330,tP);
    withA(ctx,fin(t,w("shared","every domain")-0.2,0.6)*(1-fin(t,tRv-0.9,0.5)),()=>T(ctx,"one road, every domain",960,170,{w:800,size:44,align:"center",color:rgba(INK,0.96)}));}],
  /* the utility: Ravi, and the platform every domain builds on */
  [utilA,ctx=>{const u=t-tRv+0.6;p1_room(ctx,S,t);ctx.save();drift(ctx,u,{dur:16},{z:0.025,y:560});
    person(ctx,"ravi",260,1030,0.8,{t});
    withA(ctx,fin(t,w("ravi","Ravi")-0.2,0.6),()=>tag(ctx,300,520,"Ravi Menon · platform lead",TECH,{align:"center",size:30}));
    const wr=fin(t,tW-0.2,0.6)*(1-fin(t,tB-0.3,0.6)),blk=fin(t,w("ravi","carries")-0.3,0.4);
    withA(ctx,1-wr*0.85,()=>{psaPlatform(ctx,600,580,1240,90,{label:"the data platform",caps:["bring in","store","process","serve","govern"],cp:fin(t,w("ravi","data platform"),1.2),hi:pulseAt(t,w("ravi","every domain"),1.6)*0.6});
      P1_DOM.forEach(([nm,col,own],i)=>{const t0=w("ravi","every domain")-0.2+i*0.3;psaBlock(ctx,p1_bx(600,i),440,276,130,nm,{col,drop:clamp((t-t0)/0.9,0,1)*blk,t,owner:own,ownerA:fin(t,w("better","owner")-0.2+i*0.2,0.5),size:30,osize:28});});});
    // on the map: one box among the applications, and a number nobody can say is whose
    if(wr>0.01)withA(ctx,wr,()=>{glass(ctx,640,170,1180,330,18,APPC,{glow:12,ea:0.7,fill:"rgba(6,10,22,0.95)"});T(ctx,"the application layer",670,220,{f:"mono",w:500,size:28,color:rgba(APPC,1)});
      ["billing","outages","meter data","finance","data warehouse","customers","assets","network map"].forEach((s_,i)=>{const bx=670+(i%4)*284,by=250+Math.floor(i/4)*110,dw=s_==="data warehouse";
        archEl(ctx,bx,by,262,86,s_,APPC,"component",{size:28,hi:dw?pulseAt(t,w("wrong","one more application"),1.6)+0.4:0});});
      const tq=w("wrong","whose rule");withA(ctx,fin(t,tq-0.3,0.5),()=>{tag(ctx,1230,620,"a number goes wrong: whose rule is it?",AMBER,{align:"center",size:32});});});
    ctx.restore();}]]);
  vign(ctx,S);
  psaTitle(ctx,S,t,B+1.0,"An application or a platform?","why a data platform serves every domain","Film 1 of 8 · platform and solution architecture");});

/* ---------- 2. Where it sits ---------- */
// the hundred and forty systems, as small tiles: four named, the rest texture
const P1_SYS=["billing","outages","meter data","finance"];
function p1_tiles(ctx,x,y,w,h,t,o){o=o||{};const cols=14,rows=10,gw=w/cols,gh=h/rows,p=o.p==null?1:o.p;
  for(let i=0;i<140;i++){const q=clamp(p*1.6-i/140,0,1);if(q<=0.01)continue;const cx=x+(i%cols)*gw,cy=y+Math.floor(i/cols)*gh;withA(ctx,q*(o.dim==null?1:o.dim),()=>{ctx.fillStyle=rgba(APPC,0.1+0.06*hash(i,3));rr(ctx,cx+4,cy+4,gw-8,gh-8,5);ctx.fill();ctx.strokeStyle=rgba(APPC,0.4);ctx.lineWidth=1.2;rr(ctx,cx+4,cy+4,gw-8,gh-8,5);ctx.stroke();
    ctx.fillStyle=rgba(APPC,0.5);ctx.fillRect(cx+12,cy+gh/2-2,(gw-24)*(0.4+0.5*hash(i,4)),4);});}}
scene("map",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p1_room(ctx,S,t);
  const tL=c("list"),tA=c("above"),tBx=c("box"),tAk=c("ask");
  ctx.save();const CK=[[0,960,420,1.0],[w("layers","bottom two")-0.3,960,560,1.18],[tL-0.2,960,470,1.0],[tAk-0.2,960,500,0.96]];focus(ctx,t,CK,1.8);
  // the map: six layers, the bottom two lit for this series
  const dW=fin(t,w("ask","a word")-0.2,0.6);ctx.globalAlpha*=1-0.78*dW;
  const lyA=1-fin(t,tL-0.2,0.6)+fin(t,tA-0.3,0.6)*(1-fin(t,tBx-0.3,0.6)),hiB=fin(t,w("layers","bottom two")-0.2,0.6);
  withA(ctx,lyA,()=>layerStack(ctx,520,150,880,{p:clamp(t/1.6,0,1),sh:62,gap:14,size:30,hi:[0,0,0,fin(t,tA-0.1,0.6)*(1-fin(t,tBx-0.3,0.5)),hiB,hiB],fill:[0,0,0,0,0.25*hiB,0.25*hiB]}));
  withA(ctx,hiB*(1-fin(t,tL-0.3,0.5)),()=>tag(ctx,1470,560,"this series",PSC,{size:30}));
  withA(ctx,fin(t,w("above","what the data")-0.2,0.6)*(1-fin(t,tBx-0.4,0.5)),()=>tag(ctx,960,128,"what the data means, and where each fact is born",LAY6[3][1],{align:"center",size:30}));
  // the hundred and forty systems, opened out of the application layer
  const pa=fin(t,tL-0.3,0.8)*(1-fin(t,tA-0.3,0.6)+fin(t,tBx-0.4,0.6));
  if(pa>0.01)withA(ctx,pa,()=>{glass(ctx,300,190,1320,620,20,APPC,{glow:14,ea:0.75,fill:"rgba(5,9,20,0.96)"});T(ctx,"applications · 140 systems",330,240,{f:"mono",w:500,size:28,color:rgba(APPC,1)});
    p1_tiles(ctx,330,262,1260,520,t,{p:clamp((t-tL)/2.0,0,1),dim:1-0.5*fin(t,w("list","billing")-0.2,0.6)});
    P1_SYS.forEach((s_,i)=>{const t0=w("list",s_)-0.15;withA(ctx,fin(t,t0,0.4),()=>arrive(ctx,505+i*300,448,t,t0,()=>archEl(ctx,370+i*300,400,270,96,s_,APPC,"component",{size:30,hi:pulseAt(t,t0+0.1,1.2)}),{dy:-10}));});
    // one box: data warehouse
    const tD=w("box","data warehouse");withA(ctx,fin(t,tD-0.2,0.5),()=>{archEl(ctx,760,560,400,110,"data warehouse",APPC,"component",{size:34,hi:0.5+0.5*pulseAt(t,w("box","one more application"),1.8)});
      glow(ctx,960,615,200,AMBER,0.12*fin(t,w("box","drawn"),0.6));});
    withA(ctx,fin(t,w("box","data platform")-0.2,0.5),()=>tag(ctx,960,724,"the data platform, drawn as one more application",AMBER,{align:"center",size:30}));});
  ctx.restore();
  // Ravi asks Tomás: it isn't one more application
  const pA=fin(t,tAk-0.4,0.8);if(pA>0.01){withA(ctx,pA,()=>{person(ctx,"ravi",170,1040,0.72,{t});person(ctx,"tomas",1750,1040,0.72,{t});});
    withA(ctx,1-0.78*dW,()=>arrive(ctx,1400,650,t,w("ask","move it")-0.2,()=>sticky(ctx,1400,650,380,130,"not one more application?",{col:NOTEC[2],size:32,rot:0.03}),{dy:-14}));
    if(dW>0.01)withA(ctx,dW,()=>arrive(ctx,960,470,t,w("ask","a word")-0.2,()=>{glass(ctx,610,370,700,200,24,PSC,{glow:18,ea:0.9,fill:"rgba(16,10,6,0.97)"});T(ctx,"platform",960,470,{w:800,size:72,align:"center",color:rgba(PSC,1)});T(ctx,"one word, two meanings",960,532,{w:600,size:32,align:"center",color:rgba(SOFT,1)});},{dy:-12}));}
  vign(ctx,S);});

/* ---------- 3. Two kinds of platform ---------- */
const P1_PROD=["storage","compute","catalogue","pipelines","serving"];
const P1_AROUND=[["identity",0],["network",1],["integration",2],["orchestration",3],["reporting tools",4],["observability",5]];
function p1_product(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,TECC,{glow:14+12*(o.hi||0),ea:0.85,fill:"rgba(6,14,10,0.96)"});ctx.fillStyle=rgba(TECC,0.08);rr(ctx,x,y,w,h,18);ctx.fill();
  const lw=logo(ctx,"databricks",x+26,y+22,o.lh||40);if(o.label!==false)T(ctx,"a platform product",x+w-24,y+52,{f:"mono",w:500,size:30,align:"right",color:rgba(TECC,1)});
  const ch=o.chips==null?1:o.chips,n=P1_PROD.length,cw=(w-52),rh=Math.min(80,(h-110)/n);P1_PROD.forEach((s_,i)=>{const q=clamp(ch*n-i,0,1);if(q<=0.01)return;withA(ctx,q,()=>{const yy=y+90+i*rh;ctx.fillStyle=rgba(TECC,0.13);rr(ctx,x+26,yy,cw,rh-12,10);ctx.fill();ctx.strokeStyle=rgba(TECC,0.55);ctx.lineWidth=1.5;rr(ctx,x+26,yy,cw,rh-12,10);ctx.stroke();
    psaGlyph(ctx,"software",x+54,yy+(rh-12)/2,11,TECC);T(ctx,s_,x+80,yy+(rh-12)/2+10,{w:700,size:o.cs||30});});});});}
scene("words",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p1_room(ctx,S,t);
  const tY=c("yours"),tP=c("parts"),tT=c("team"),tK=c("keep");
  ctx.save();const CK=[[0,520,470,1.12],[tY-0.3,980,480,0.96],[tK-0.3,960,470,0.94]];focus(ctx,t,CK,1.8);
  // left: the product, many components sold as one
  arrive(ctx,500,430,t,0.3,()=>p1_product(ctx,220,170,560,520,{chips:clamp((t-w("vendor","many components")+0.2)/1.4,0,1),hi:pulseAt(t,w("vendor","sold as one"),1.6)}),{dy:-14});
  withA(ctx,fin(t,w("vendor","sold as one")-0.2,0.6),()=>tag(ctx,500,742,"many components, sold as one",TECC,{align:"center",size:30}));
  // right: your data platform, the service, built from the product and what's around it, and the team that runs it
  const fA=fin(t,tY-0.2,0.8);if(fA>0.01)withA(ctx,fA,()=>{glass(ctx,880,120,960,700,24,PSC,{glow:16,ea:0.8,fill:"rgba(14,10,6,0.9)"});T(ctx,"your data platform",910,172,{f:"mono",w:500,size:30,color:rgba(PSC,1)});
    withA(ctx,fin(t,w("yours","service"),0.6),()=>T(ctx,"a service for all the utility's domains",1810,172,{w:700,size:30,align:"right",color:rgba(INK,0.9)}));
    // the product, inside it, small
    withA(ctx,fin(t,tP-0.2,0.6),()=>p1_product(ctx,1180,220,360,370,{lh:30,cs:30,hi:0,label:false}));
    P1_AROUND.forEach(([s_,i])=>{const t0=w("parts",s_==="observability"?"watches":s_)-0.15,col=i===5?[180,220,255]:TECC,xx=i<3?920:1570,yy=250+(i%3)*120;
      if(t>t0)arrive(ctx,xx+120,yy+45,t,t0,()=>psaEl(ctx,xx,yy,240,90,s_==="observability"?"what watches it":s_,col,i<2?"node":i===5?"function":"software",{size:30,hi:pulseAt(t,t0+0.1,1.0)}),{dy:-10});});
    // the team, its rules and its support
    const tq=w("team","team")-0.2;withA(ctx,fin(t,tq,0.6),()=>{[0,1,2].forEach(k=>{const hx=1010+k*58,hy=680;ctx.fillStyle=rgba(TECH,0.9);ctx.beginPath();ctx.arc(hx,hy-18,13,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(hx,hy+16,22,16,0,Math.PI,TAU);ctx.fill();});
      T(ctx,"a team",1080,750,{w:700,size:30,align:"center",color:rgba(TECH,1)});});
    withA(ctx,fin(t,w("team","rules")-0.2,0.6),()=>{psaPaper(ctx,1290,640,120,120,[],{size:28});ctx.strokeStyle="rgba(70,60,50,0.55)";ctx.lineWidth=3;ctx.lineCap="round";[0,1,2,3].forEach(k=>{ctx.beginPath();ctx.moveTo(1308,668+k*22);ctx.lineTo(1392-(k%2)*22-(k===3?24:0),668+k*22);ctx.stroke();});T(ctx,"rules",1350,800,{w:700,size:30,align:"center",color:rgba(WASHI,1)});});
    withA(ctx,fin(t,w("team","support")-0.2,0.6),()=>{ctx.save();ctx.strokeStyle=rgba(TECH,0.95);ctx.lineWidth=5;ctx.beginPath();ctx.arc(1620,700,34,Math.PI,TAU);ctx.stroke();ctx.fillStyle=rgba(TECH,0.95);rr(ctx,1578,694,16,30,6);ctx.fill();rr(ctx,1646,694,16,30,6);ctx.fill();ctx.restore();
      T(ctx,"support",1620,780,{w:700,size:30,align:"center",color:rgba(TECH,1)});});});
  ctx.restore();
  // the two words, as the series uses them
  withA(ctx,fin(t,w("keep","product")-0.3,0.6),()=>tag(ctx,528,140,"Databricks · the product",TECC,{align:"center",size:32}));
  withA(ctx,fin(t,w("keep","service")-0.3,0.6),()=>tag(ctx,1336,140,"the data platform · the service",PSC,{align:"center",size:32}));
  vign(ctx,S);});

/* ---------- 4. The test ---------- */
const P1_CAPS=["bring in","store","process","serve","govern"];
scene("test",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p1_room(ctx,S,t);
  const tO=c("owner"),tN=c("none"),tM=c("many"),tE=c("ent"),tT=c("test"),dimK=fin(t,tT-0.2,0.7);
  withA(ctx,1-0.85*dimK,()=>{ctx.save();const CK=[[0,520,480,1.12],[tN-0.3,1000,500,1.0],[tT-0.3,960,520,0.92]];focus(ctx,t,CK,1.8);
  // billing: one purpose, its rules inside, its owner, its measure
  arrive(ctx,460,390,t,0.3,()=>psaApp(ctx,180,250,560,280,"billing",{rules:["tariffs","estimates","discounts"],rp:clamp((t-w("billing","tariffs")+0.2)/1.6,0,1),t,owner:"head of retail",ownerA:fin(t,w("owner","head of retail")-0.2,0.5),hi:pulseAt(t,w("billing","one purpose"),1.4)}),{dy:-12});
  withA(ctx,fin(t,w("billing","one purpose")-0.1,0.5),()=>tag(ctx,460,200,"one purpose: bill customers",APPC,{align:"center",size:30}));
  withA(ctx,fin(t,w("owner","measured")-0.1,0.5),()=>tag(ctx,460,660,"measured by: bills right, and on time",SOFT,{align:"center",size:28}));
  // the data platform: shared capabilities, and the logic of many owners set down on it
  const pA=fin(t,tN-0.3,0.8);if(pA>0.01)withA(ctx,pA,()=>{psaPlatform(ctx,900,560,940,90,{label:"the data platform",caps:P1_CAPS,cp:clamp((t-w("none","bring data in")+0.2)/2.6,0,1),csize:28});
    withA(ctx,fin(t,w("none","no purpose")-0.2,0.5),()=>tag(ctx,1370,200,"no purpose of its own",TECC,{align:"center",size:30}));
    P1_DOM.forEach(([nm,col,own],i)=>{const t0=i<3?w("many",nm)-0.2:w("ent","enterprise")-0.2;psaBlock(ctx,930+i*228,420,196,128,nm,{col,drop:clamp((t-t0)/0.9,0,1),t,size:28});});
    withA(ctx,fin(t,w("ent","measures")-0.1,0.5),()=>tag(ctx,1640,320,"measures that cross domains",[176,196,255],{align:"center",size:28}));});
  ctx.restore();});
  // the test, as a card: one purpose with its logic built in, or shared capabilities with many owners' logic
  const tA=fin(t,tT-0.1,0.6);if(tA>0.01)withA(ctx,tA,()=>arrive(ctx,960,485,t,tT-0.1,()=>{glass(ctx,300,360,1320,250,22,PSC,{glow:18,ea:0.9,fill:"rgba(12,9,6,0.97)"});T(ctx,"the test",340,414,{f:"mono",w:500,size:28,color:rgba(PSC,1)});
    withA(ctx,fin(t,w("test","One purpose")-0.2,0.5),()=>{T(ctx,"one purpose, its logic built in",340,488,{w:700,size:38});T(ctx,"an application",1580,488,{w:800,size:38,align:"right",color:rgba(APPC,1)});});
    withA(ctx,fin(t,w("test","Shared")-0.2,0.5),()=>{T(ctx,"shared capabilities, many owners' logic",340,566,{w:700,size:38});T(ctx,"a platform",1580,566,{w:800,size:38,align:"right",color:rgba(TECC,1)});});},{dy:-12}));
  vign(ctx,S);});

/* ---------- 5. Not every shared system ---------- */
scene("erp",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p1_room(ctx,S,t);
  const tS=c("suite"),tL=c("line");ctx.save();drift(ctx,t,sc,{z:0.03,y:470});
  // the finance system: one suite, a part for each function, each with its logic inside
  const parts=["finance","procurement","people"];
  arrive(ctx,960,460,t,0.3,()=>{glass(ctx,300,250,1320,420,22,APPC,{glow:14,ea:0.8,fill:"rgba(6,10,22,0.95)"});T(ctx,"the finance system",340,306,{w:800,size:36});
    withA(ctx,fin(t,tS-0.1,0.5),()=>T(ctx,"an application suite",1580,306,{f:"mono",w:500,size:28,align:"right",color:rgba(APPC,1)}));
    parts.forEach((p,i)=>{const t0=w("erp",p)-0.2;withA(ctx,fin(t,t0,0.5),()=>psaApp(ctx,340+i*424,350,392,270,p,{rules:i===0?["ledger","invoices"]:i===1?["orders","suppliers"]:["payroll","leave"],rp:fin(t,w("suite","logic")-0.2,1.0),t,hi:pulseAt(t,t0+0.1,1.2)}));});},{dy:-12});
  withA(ctx,fin(t,w("erp","isn't the test")-0.2,0.5)*(1-fin(t,tS-0.2,0.5)),()=>tag(ctx,960,180,"it serves many functions",SOFT,{align:"center",size:30}));
  withA(ctx,fin(t,w("suite","vendor")-0.2,0.5),()=>tag(ctx,960,180,"built in, the way its vendor designed it",APPC,{align:"center",size:30}));
  ctx.restore();
  // the line: where the logic lives
  withA(ctx,fin(t,tL-0.1,0.6),()=>{glass(ctx,300,696,1320,172,20,PSC,{glow:14,ea:0.85,fill:"rgba(12,9,6,0.96)"});
    withA(ctx,fin(t,w("line","inside")-0.2,0.5),()=>{psaCog(ctx,356,753,14,APPC,t);T(ctx,"logic inside the system",388,764,{w:700,size:32});T(ctx,"an application",1580,764,{w:800,size:32,align:"right",color:rgba(APPC,1)});});
    withA(ctx,fin(t,w("line","brought")-0.2,0.5),()=>{psaCog(ctx,356,821,14,TECC,t);T(ctx,"brought to it by its owners",388,832,{w:700,size:32});T(ctx,"a platform",1580,832,{w:800,size:32,align:"right",color:rgba(TECC,1)});});});
  vign(ctx,S);});

/* ---------- 6. Whose logic ---------- */
scene("logic",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tR=c("runs"),tA=c("always"),tH=c("hard");const roadA=1-fin(t,tR-0.6,0.9);
  // the station: horses and porters, ready; the letter in its box, the sender's
  const pA=fin(t,tR-0.6,0.9);psaRooms(ctx,[[roadA,ctx=>{p1_road(ctx,S,t,{d:0.9});ctx.save();drift(ctx,t,sc,{z:0.03,y:640});psaStation(ctx,900,762,1.0,{lit:1});
    // the station's horses and porters, ready
    psaHorse(ctx,330,780,0.82,t,{dir:1,still:true,ph:0.2});psaHorse(ctx,620,782,0.84,t,{dir:1,still:true,ph:0.6});
    [[1290,0.2],[1400,0.6]].forEach(([x,ph])=>psaWalker(ctx,x,780,0.98,t,{kind:"porter",dir:-1,still:true,ph}));
    // a courier runs in, slows, and stops at the station, the letter box on his pole: the stride shortens as he slows, so his feet hold
    const T_=3.2,p=clamp((t-0.2)/T_,0,1),D=psaPace("courier",0.98)*T_/2,cx_=1990-D*(1-(1-p)*(1-p)),tw_=w("horses","letters")-0.6;
    psaWalker(ctx,cx_,782,0.98,t,{kind:"courier",dir:-1,ph:0.3,amp:1-p,box:fin(t,tw_,0.5)});
    ctx.restore();const B_=psaBoxAt(cx_,782,0.98,-1);
    withA(ctx,fin(t,w("horses","horses")-0.2,0.5),()=>tag(ctx,760,300,"the station: horses and porters, ready",PSC,{align:"center",size:32}));
    withA(ctx,fin(t,tw_+0.2,0.5),()=>tag(ctx,B_[0],B_[1]-90,"the letter: its sender's",BIZ,{align:"center",size:32}));}],
  [pA,ctx=>{p1_room(ctx,S,t);ctx.save();drift(ctx,t-tR,{dur:14},{z:0.03,y:540});
    psaPlatform(ctx,340,540,1240,96,{label:"the platform's own components",lalign:"right",caps:P1_CAPS,csize:28,hi:pulseAt(t,w("hard","brings"),1.4)*0.8+pulseAt(t,w("hard","runs"),1.4)*0.8});
    // each domain's data product on it; one pushed into the platform's components, and refused
    const tN=w("runs","never"),sink=clamp((t-tN+0.2)/0.8,0,1)*(1-clamp((t-tN-1.0)/0.8,0,1));
    P1_DOM.forEach(([nm,col,own],i)=>{const t0=w("runs","data products")-0.4+i*0.22,yy=400+(i===1?sink*120:0);psaBlock(ctx,p1_bx(340,i),yy,276,128,nm,{col,drop:clamp((t-t0)/0.9,0,1),t,size:28,owner:own,ownerA:fin(t,w("always","business")-0.2+i*0.15,0.5),ownerHi:pulseAt(t,w("always","business"),1.2)});});
    if(t>tN)withA(ctx,fin(t,tN+0.5,0.3)*(1-fin(t,tN+2.0,0.5)),()=>{kt_rcross(ctx,840,600,26,1);});
    withA(ctx,fin(t,w("runs","on it")-0.2,0.5),()=>tag(ctx,960,250,"logic runs on it, never in it",APPC,{align:"center",size:34}));
    // never the platform team, by default
    const tP=w("always","platform team");withA(ctx,fin(t,tP-0.3,0.5)*(1-fin(t,tH-0.3,0.5)),()=>{tag(ctx,1640,330,"the platform team",TECH,{align:"center",size:30});const k=fin(t,tP+0.5,0.4);if(k>0.01)kt_rcross(ctx,1790,330,18,k);});
    withA(ctx,fin(t,tH-0.1,0.5),()=>tag(ctx,960,800,"it brings the data in, and runs the code",TECC,{align:"center",size:30}));
    ctx.restore();}]]);
  vign(ctx,S);});

/* ---------- 7. A number nobody owns ---------- */
// the measure, month by month: a storm counted in March, then left out again
function p1_chart(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[176,196,255],{glow:12+12*(o.hi||0),ea:0.85,fill:"rgba(6,9,20,0.96)"});
  T(ctx,"minutes without power,",x+26,y+48,{w:800,size:30});T(ctx,"per customer, each month",x+26,y+86,{w:700,size:28,color:rgba(SOFT,1)});
  const M=[["Jan",8.1],["Feb",7.9],["Mar",o.fix>0?lerp(19.4,9.2,ease(o.fix)):19.4]],bw=(w-120)/3,base=y+h-62,sc_=(h-190)/20;
  M.forEach(([m,v],i)=>{const q=i<2?fin(o.t0==null?0:t,(o.t0||0)+i*0.2,0.6):o.mar==null?1:o.mar;if(q<=0.01)return;const bx=x+60+i*bw+bw*0.2,bh=v*sc_*q,hot=i===2&&!o.fix?o.jump||0:0;
    withA(ctx,1,()=>{ctx.fillStyle=rgba(mix([176,196,255],AMBER,hot),0.35+0.2*hot);rr(ctx,bx,base-bh,bw*0.6,bh,6);ctx.fill();ctx.strokeStyle=rgba(mix([176,196,255],AMBER,hot),0.95);ctx.lineWidth=2;rr(ctx,bx,base-bh,bw*0.6,bh,6);ctx.stroke();
      T(ctx,m,bx+bw*0.3,base+40,{w:700,size:28,align:"center",color:rgba(SOFT,1)});if(q>0.6)T(ctx,v.toFixed(1),bx+bw*0.3,base-bh-14,{w:800,size:30,align:"center",color:rgba(INK,0.95)});});});
  if(o.tick>0.01)withA(ctx,o.tick,()=>{kt_gtick(ctx,x+w-46,y+46,16,1);});});}
// a source system feeding the measure; the old storm tool is greyer, its export holding a rule nobody wrote down
function p1_src(ctx,x,y,w,name,sub,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const col=o.old?[170,170,176]:APPC;glass(ctx,x,y,w,100,14,col,{glow:10+12*(o.hi||0),ea:0.8,fill:"rgba(7,10,20,0.95)"});
  archGlyph(ctx,"component",x+w-26,y+26,13,col);T(ctx,name,x+22,y+46,{w:800,size:32});T(ctx,sub,x+22,y+84,{w:600,size:28,color:rgba(o.old?[190,184,170]:SOFT,1)});});}
scene("minutes",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p1_room(ctx,S,t);
  const tB=c("built"),tJ=c("jump"),tW=c("why"),tWh=c("whose"),tF=c("find"),tT=c("ticket"),tBu=c("build"),tC=c("check");
  const ph1=1-fin(t,tF-0.5,0.8),ph2=fin(t,tF-0.4,0.8);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:500});
  // the chart, kept on the right all through
  const fixK=clamp((t-w("check","back to nine")+0.3)/1.2,0,1);
  arrive(ctx,1560,375,t,0.4,()=>p1_chart(ctx,1300,140,520,470,t,{t0:0.6,mar:fin(t,w("jump","March")-0.2,0.6),jump:fin(t,w("jump","nineteen")-0.3,0.5),fix:fixK,tick:fin(t,w("check","checks")-0.1,0.5)*0+fin(t,w("check","back to nine")+0.9,0.5),hi:pulseAt(t,w("jump","jumps"),1.6)}),{dy:-12});
  withA(ctx,fin(t,w("measure","regulator")-0.2,0.5)*(1-fin(t,tF-0.4,0.5)),()=>tag(ctx,1560,660,"reported to the regulator",[176,196,255],{align:"center",size:28}));
  // phase 1: three sources, the measure's product on the platform, the rule that came in the storm tool's export
  if(ph1>0.01)withA(ctx,ph1,()=>{const S3=[["outages","OMS"],["network map","GIS"],["storm tool","old, from 2009"]];
    S3.forEach(([n,s_],i)=>{const t0=w("built",n==="storm tool"?"storm tool":n)-0.2;if(t>t0)arrive(ctx,280,220+i*140,t,t0,()=>p1_src(ctx,90,170+i*140,380,n,s_,{old:i===2,hi:i===2?pulseAt(t,w("why","export"),1.4):0}),{dy:-10});
      psaArrow(ctx,474,220+i*140,640,420,i===2?[190,184,170]:APPC,0.8*fin(t,t0+0.4,0.4),fin(t,t0+0.4,0.8),{lw:2.6});});
    psaPlatform(ctx,600,520,640,80,{label:"platform",csize:28,fh:0});
    psaBlock(ctx,660,380,460,128,"minutes without power",{col:[176,196,255],drop:fin(t,0.4,0.9),t,size:30,owner:fin(t,tF-0.6,0.1)>0?null:null});
    psaArrow(ctx,1125,440,1290,380,[176,196,255],0.8*fin(t,tB+1.6,0.5),fin(t,tB+1.6,0.8),{lw:2.6});
    // the rule, in the storm tool's export; then dropped by an update
    const tX=w("why","export")-0.2,tDr=w("why","dropped");if(t>tX)withA(ctx,1-fin(t,tF-0.8,0.5),()=>{const dr=fin(t,tDr-0.1,0.6);
      ruleCard(ctx,90,610,520,"leave out major storms",{kicker:"in the storm tool's export",size:30,a:fin(t,tX,0.5)*(1-0.6*dr),col:[190,184,170]});
      if(dr>0.01){kt_rcross(ctx,580,640,20,dr);withA(ctx,dr,()=>tag(ctx,350,800,"dropped by an update in February",AMBER,{align:"center",size:28}));}});
    withA(ctx,fin(t,w("why","storm counted")-0.3,0.5)*(1-fin(t,tWh-0.2,0.5)),()=>tag(ctx,1560,96,"a major storm counted",AMBER,{align:"center",size:30}));
    // whose rule was it?
    const q=fin(t,tWh-0.1,0.5)*(1-fin(t,tF-0.6,0.5));if(q>0.01)withA(ctx,q,()=>{[["the platform team's code?",w("whose","platform team's")],["the storm tool: no notes",w("whose","no notes")],["its author: left",w("whose","had left")]].forEach(([s_,t0],i)=>withA(ctx,fin(t,t0-0.3,0.5),()=>tag(ctx,880,680+i*62,s_,i===0?TECH:[200,196,190],{align:"center",size:30})));});});
  // phase 2: the map and the catalogue find the owner; the ticket, the glossary, the pull request, the check
  if(ph2>0.01)withA(ctx,ph2,()=>{const tFm=w("find","map"),tFc=w("find","catalogue");
    withA(ctx,fin(t,tFm-0.3,0.6)*(1-fin(t,tT-0.4,0.6)),()=>p1_miniMap(ctx,180,150,560,1,{hi:[0,0,0,0,0.5,0.4],sh:36,gap:10}));
    withA(ctx,fin(t,tFc-0.2,0.6)*(1-fin(t,tT-0.4,0.6)),()=>psaCard(ctx,140,560,700,"catalogue · minutes without power",["domain: enterprise","owner: Ama Owusu"],[176,196,255],{size:32,hi:pulseAt(t,w("find","Ama"),1.4)}));
    const tAm=w("find","Ama")-0.3;withA(ctx,fin(t,tAm,0.7),()=>{person(ctx,"ama",1120,1040,0.68,{t});withA(ctx,fin(t,tAm+0.3,0.5),()=>{tag(ctx,1120,612,"Ama Owusu",BIZ,{align:"center",size:30});});});
    // Ama's ticket and her glossary entry; the data team's pull request, with its test
    if(t>tT-0.3)arrive(ctx,520,250,t,tT-0.2,()=>psaCard(ctx,90,150,860,"ticket · raised by Ama",["Leave out major storms,","as the regulator's method says."],BIZ,{size:32,foot:fixK>0.5?"closed":"open",footCol:fixK>0.5?PS_OK:SOFT,footTick:fixK>0.5?1:0}),{dy:-10});
    if(t>w("ticket","glossary")-0.3)arrive(ctx,520,475,t,w("ticket","glossary")-0.2,()=>psaCard(ctx,90,400,860,"glossary · major storm",["A day the regulator's method","names as a major event."],LAY6[3][1],{size:32}),{dy:-10});
    if(t>tBu-0.2)arrive(ctx,520,720,t,tBu-0.1,()=>psaCard(ctx,90,640,860,"pull request · data team",["Rule and test: major storms left out"],TECH,{size:30,foot:fin(t,w("build","reviews")-0.2,0.3)>0.5?"reviewed by the data team":"",footTick:fin(t,w("build","reviews"),0.5),footCol:TECH}),{dy:-10});
    withA(ctx,fin(t,w("check","checks")-0.2,0.5),()=>tag(ctx,1560,660,"checked by Ama, in test",BIZ,{align:"center",size:28}));});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. An owner who answers to all ---------- */
scene("owner",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tSp=c("sponsor"),tA=c("all"),tM=c("measured");const roadA=1-fin(t,tSp-0.6,0.9);
  const pA=fin(t,tSp-0.6,0.9);psaRooms(ctx,[[roadA,ctx=>{p1_road(ctx,S,t,{d:0.95});ctx.save();drift(ctx,t,sc,{z:0.03,y:640});psaStation(ctx,1520,762,0.9,{lit:1});
    // an official rides free; a merchant leading his pack horse pays his way; the station's people and the villagers wait with the loads
    const tF=w("road","free"),tP=w("road","others paid"),tBd=w("road","burden"),vR=psaPace("horse",0.86,0.5),vM=psaPace("walker",1,0.35),xR=150+t*vR,xM=v=>v+t*vM;
    psaHorse(ctx,xR,780,0.86,t,{dir:1,rider:true,rate:0.5,ph:0.1});
    psaWalker(ctx,xM(720),804,1,t,{kind:"porter",ph:0.3,rate:0.35});psaHorse(ctx,xM(480),806,0.9,t,{dir:1,pack:true,ph:0.6,rate:vM/(93*0.9)});
    [[1330,0.1],[1440,0.6],[1720,0.3]].forEach(([x,ph])=>psaWalker(ctx,x,758,0.84,t,{kind:"porter",dir:-1,still:true,ph}));
    ctx.restore();
    withA(ctx,fin(t,w("road","shogunate")-0.2,0.5),()=>tag(ctx,960,150,"the owner: the shogunate",PSC,{align:"center",size:34}));
    withA(ctx,fin(t,tF-0.2,0.5),()=>tag(ctx,xR+20,330,"its officials: free",PSC,{align:"center",size:30}));
    withA(ctx,fin(t,tP-0.2,0.5),()=>tag(ctx,xM(600),330,"others: paid their way",[220,210,190],{align:"center",size:30}));
    withA(ctx,fin(t,tBd-0.2,0.5),()=>tag(ctx,1600,330,"the stations and villages: the burden",[220,190,170],{align:"center",size:30}));}],
  [pA,ctx=>{p1_room(ctx,S,t);ctx.save();focus(ctx,t,[[0,960,540,1],[tM-0.4,960,640,1]],1.8);drift(ctx,t-tSp,{dur:16},{z:0.025,y:560});
    psaPlatform(ctx,340,600,1240,90,{label:"the data platform",caps:P1_CAPS,csize:28});
    P1_DOM.forEach(([nm,col,own],i)=>psaBlock(ctx,p1_bx(340,i),460,276,128,nm,{col,t,size:30}));
    // its business owner: a sponsor, with a platform product owner
    const tS=w("sponsor","sponsor")-0.2,tPo=w("sponsor","platform product owner")-0.2;
    withA(ctx,fin(t,tS,0.5),()=>psaOwner(ctx,760,180,"sponsor",{align:"center",size:32}));withA(ctx,fin(t,tPo,0.5),()=>psaOwner(ctx,1160,180,"platform product owner",{align:"center",size:32}));
    // it answers to every domain: a line from each up to its owner
    P1_DOM.forEach((d,i)=>{const t0=w("all","every domain")-0.2+i*0.2;psaArrow(ctx,p1_bx(340,i)+138,440,960,230,BIZ,0.7*fin(t,t0,0.4),fin(t,t0,0.8),{lw:2.4,head:12});});
    withA(ctx,fin(t,w("all","decides less")-0.2,0.5),()=>tag(ctx,620,320,"decides less of what's built",SOFT,{align:"center",size:28}));
    withA(ctx,fin(t,w("all","how well")-0.2,0.5),()=>tag(ctx,1300,320,"answers for how well it serves",BIZ,{align:"center",size:28}));
    ctx.restore();
    // measured by its users' outcomes
    const M=[["how many build on it","build"],["how fast a first data product ships","first"],["how reliable it is","reliable"],["what it costs","costs"]];
    M.forEach(([s_,k],i)=>{const t0=w("measured",k)-0.2;withA(ctx,fin(t,t0,0.5)*fin(t,tM-0.2,0.4),()=>arrive(ctx,345+i*420,795,t,t0,()=>{const x=150+i*420,o={size:28,w:700,align:"center",color:rgba(INK,0.95)},L=wrapT(ctx,s_,0,0,350,{...o,measure:true});
      glass(ctx,x,740,390,110,16,TECC,{glow:12,ea:0.8,fill:"rgba(6,14,10,0.95)"});wrapT(ctx,s_,x+195,805-(L.length-1)*18.5,350,o);},{dy:-10}));});}]]);
  vign(ctx,S);});

/* ---------- 9. Why the map matters most here ---------- */
scene("why",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p1_room(ctx,S,t);
  const tC=c("crosses"),tI=c("inside");ctx.save();drift(ctx,t,sc,{z:0.03,y:480});
  const R=layerStack(ctx,420,170,1080,{p:clamp(t/1.4,0,1),sh:64,gap:16,size:30});
  // every domain, across; the platform, crossing every layer
  const D=["network","retail","finance","people","enterprise"];D.forEach((d,i)=>withA(ctx,fin(t,w("crosses","every domain")-0.2+i*0.12,0.5),()=>T(ctx,d,752+i*184,140,{w:700,size:28,align:"center",color:rgba(SOFT,1)})));
  const band=fin(t,w("crosses","every layer")-0.2,0.8),hi=pulseAt(t,w("crosses","every layer"),1.6);
  if(band>0.01)withA(ctx,band,()=>{ctx.save();ctx.fillStyle=rgba(PSC,0.14+0.08*hi);ctx.shadowColor=rgba(PSC,0.7);ctx.shadowBlur=24;rr(ctx,660,160,920,510,24);ctx.fill();ctx.restore();ctx.strokeStyle=rgba(PSC,0.9);ctx.lineWidth=3;rr(ctx,660,160,920,510,24);ctx.stroke();
    T(ctx,"the data platform",1120,720,{w:800,size:34,align:"center",color:rgba(PSC,1)});});
  // designed from inside one of them: one domain in one layer, and it can't be
  const one=fin(t,tI-0.1,0.5);if(one>0.01)withA(ctx,one,()=>{ctx.strokeStyle=rgba(AMBER,1);ctx.lineWidth=4;rr(ctx,852,R[4][1]-6,168,R[4][3]+12,10);ctx.stroke();withA(ctx,fin(t,w("inside","any one")-0.1,0.4),()=>kt_rcross(ctx,1020,R[4][1]-6,18,1));
    tag(ctx,1056,R[4][1]+R[4][3]/2,"from inside one domain",AMBER,{size:28});});
  ctx.restore();vign(ctx,S);});

/* ---------- 10. The data practice on the map ---------- */
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p1_room(ctx,S,t);
  const tT=c("tech"),tA=c("app"),tP=c("port"),tN=c("none");
  ctx.save();const CK=[[0,960,520,1.0],[tT-0.2,960,620,1.08],[tA-0.2,960,470,1.03],[tN-0.3,960,500,0.98]];focus(ctx,t,CK,1.8);
  psaBand(ctx,150,330,"application layer",APPC,fin(t,0.3,0.8));psaBand(ctx,510,360,"technology layer",TECC,fin(t,0.5,0.8));
  // the platform's services, realised by Databricks as system software
  const SV=[["storage","storage"],["compute","compute"],["catalogue","catalogue"]];
  SV.forEach(([s_,k],i)=>{const t0=w("tech",k)-0.2,x=330+i*360;psaEl(ctx,x,560,300,84,s_,TECC,"service",{a:fin(t,t0,0.5),size:30,hi:pulseAt(t,t0+0.1,1.0)});});
  const tR=w("tech","realises")-0.2;withA(ctx,fin(t,w("tech","Databricks")-0.2,0.5),()=>{psaEl(ctx,600,730,520,96,"",TECC,"software",{size:30});const lw=logo(ctx,"databricks",640,752,52);T(ctx,"system software",1090,792,{f:"mono",w:500,size:28,align:"right",color:rgba(TECC,1)});});
  SV.forEach((s,i)=>psaRel(ctx,860,730,480+i*360,644,"realise",TECC,fin(t,tR,0.4),fin(t,tR+i*0.15,0.6)));
  // the measure's data product: its pipeline and models, one application component, owned by the enterprise domain; its port, an interface
  const tC=w("app","pipeline")-0.2;psaEl(ctx,640,240,440,110,"minutes without power",APPC,"component",{a:fin(t,tC,0.5),size:32,hi:pulseAt(t,w("app","application component"),1.2)});
  withA(ctx,fin(t,w("app","pipeline"),0.5),()=>{psaCog(ctx,690,330,10,APPC,t);T(ctx,"pipeline and models",712,340,{w:600,size:28,color:rgba(SOFT,1)});});
  withA(ctx,fin(t,w("app","owned")-0.2,0.5),()=>psaOwner(ctx,860,196,"enterprise domain",{align:"center",size:28}));
  SV.forEach((s,i)=>psaRel(ctx,480+i*360,560,700+i*160,352,"serve",TECC,fin(t,tC+0.4,0.4)*0.85,fin(t,tC+0.5+i*0.15,0.6)));
  const tI=w("port","Where others")-0.2;psaEl(ctx,1260,250,340,90,"output port",APPC,"interface",{a:fin(t,tI,0.5),size:30,hi:pulseAt(t,w("port","output port"),1.2)+pulseAt(t,w("port","application interface"),1.2)});psaRel(ctx,1082,295,1258,295,"compose",APPC,fin(t,tI,0.4),fin(t,tI+0.1,0.6));
  withA(ctx,fin(t,tI+0.2,0.5),()=>T(ctx,"where others read it",1430,390,{w:600,size:28,align:"center",color:rgba(SOFT,1)}));
  const tAr=w("port","artifacts")-0.2;psaEl(ctx,1300,730,320,96,"its tables",TECC,"artifact",{a:fin(t,tAr,0.5),size:30});psaRel(ctx,1122,778,1298,778,"assign",TECC,fin(t,tAr,0.4),fin(t,tAr+0.1,0.6));
  // no rule in the platform's components; the rule, in the product, with its owner
  const k=fin(t,tN-0.1,0.5);if(k>0.01){SV.forEach((s,i)=>withA(ctx,k,()=>kt_rcross(ctx,610+i*360,560,15,1)));withA(ctx,fin(t,w("none","product")-0.2,0.5),()=>{glow(ctx,860,295,180,APPC,0.18);psaCog(ctx,1050,262,14,APPC,t);});}
  ctx.restore();vign(ctx,S);});

/* ---------- 11. Every domain's road ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tD=c("data"),tN=c("next"),outA=1-fin(t,B+0.6,0.8);const mapA=(1-fin(t,tD-0.6,0.9))*outA;if(outA<1)p1_base(ctx,S);
  const pA=fin(t,tD-0.6,0.9)*outA;psaRooms(ctx,[[mapA,ctx=>{psaSea(ctx,S,{dusk:0.5});ctx.save();focus(ctx,t,[[0,980,540,0.96],[3,960,560,1.02]],3.0);
    const TK=psaMap(ctx,PSA_VIEW,t,{lit:0.6,roads:1,st:1,lit_:i=>0.4+0.4*Math.max(0,Math.sin(t*1.3-i*0.4)),ends:1});
    // travellers on every road, as lights
    PSA_ROADS.forEach(([n,pts],k)=>{const P=pts.map(p=>psaJP(p[0],p[1])),u=((t*0.05+k*0.23)%1);p1_runner(ctx,P,u,PSC,{r:4,trail:0.05});});
    for(let i=0;i<5;i++){const u=((t*0.035+i*0.2)%1);p1_runner(ctx,i%2?TK:TK.slice().reverse(),u,[255,226,180],{r:4,trail:0.04});}
    ctx.restore();
    withA(ctx,fin(t,w("letters","sender's")-0.3,0.6),()=>T(ctx,"what they carried was always the sender's business",960,170,{w:800,size:38,align:"center",color:rgba(INK,0.95)}));}],
  [pA,ctx=>{p1_room(ctx,S,t);ctx.save();drift(ctx,t-tD,{dur:12},{z:0.025,y:520});
    psaPlatform(ctx,340,560,1240,90,{label:"the data platform",caps:P1_CAPS,csize:28,hi:pulseAt(t,w("data","every domain"),1.6)*0.6});
    P1_DOM.forEach(([nm,col,own],i)=>psaBlock(ctx,p1_bx(340,i),420,276,128,nm,{col,t,size:30,owner:own,ownerA:fin(t,w("data","owner")-0.2+i*0.18,0.5)}));
    withA(ctx,fin(t,w("data","map can find")-0.3,0.6),()=>p1_miniMap(ctx,1496,96,340,1,{sh:34,gap:8,size:28,hi:[0,0,0,0,0.6,0.6]}));
    ctx.restore();
    withA(ctx,fin(t,tN-0.1,0.6),()=>tag(ctx,960,800,"Next: Inside the platform",PSC,{align:"center",size:34}));}]]);
  vign(ctx,S);
  psaEnd(ctx,S,t,B+0.6,"An application or a platform?","Every domain's road, and every rule with an owner.","film 1 of 8");});
