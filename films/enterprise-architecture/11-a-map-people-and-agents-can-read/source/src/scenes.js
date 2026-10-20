/* ===== A map people and agents can read: scenes =====
   Twelve chapters, as in ../script.md. The Pacific in May 1976: Hōkūleʻa sails for Tahiti with no compass and no charts, its
   navigator holding a star compass in memory; landfall, and a knowledge few still held, passed on; the navigator's test. Then
   Tomás's map, used every week and going stale; moved into an enterprise architecture tool, which brings in what other systems
   already keep, with each one's ID; each element once, and once as a text file, the simplest approach; reviewed and versioned,
   with checks on the map itself; one map and many views, generated one way, down to dbt and Databricks; an agent that reads it, and is on it,
   with its rights; the retail code changing, the agent drafting and the head of retail confirming; a newcomer's first day, with a
   map; Hōkūleʻa still sailing, fifty years on; and the series, layer by layer, handing over to From words to data.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: every
   shot drifts slowly and things arrive with a spring. Sound: every effect in tools/score.py fires at the same moment as the thing it
   belongs to here, so keep the two in step. */

/* ---------- 1. By the stars ---------- */
// the route on a small chart, Maui to Tahiti, drawn and then taken away: they sailed without one
function d11_inset(ctx,x,y,w,h,p,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[170,200,240],{glow:12,ea:0.6,fill:"rgba(6,10,22,0.9)"});
  const k=8.6,mx=x+w*0.42,my=y+70,tah=[mx+(210.57-203.74)*k,my+(20.8+17.65)*k];
  ctx.save();ctx.setLineDash([6,8]);ctx.strokeStyle="rgba(150,180,230,0.25)";ctx.lineWidth=1.2;const ey=my+20.8*k;ctx.beginPath();ctx.moveTo(x+16,ey);ctx.lineTo(x+w-16,ey);ctx.stroke();ctx.restore();
  [["Kauaʻi"],["Oʻahu"],["Molokaʻi"],["Maui"],["Hawaiʻi"],["Mataiva"],["Tahiti"]].forEach(([n])=>{const[lo,la]=D11_PAC[n],xx=mx+(lo-203.74)*k,yy=my+(20.8-la)*k;ctx.fillStyle="rgba(200,214,236,0.8)";ctx.beginPath();ctx.arc(xx,yy,n==="Hawaiʻi"?4:3,0,TAU);ctx.fill();});
  d11_pass(ctx,mx,my,tah[0],tah[1],p,D11_KNOW,{bend:-0.12,trail:0.85,lw:2.4});
  T(ctx,"Maui",mx+20,my-14,{w:700,size:30,color:rgba(INK,0.95)});T(ctx,"Tahiti",tah[0]+18,tah[1]+10,{w:700,size:30,color:rgba(INK,0.95)});
  // the distance, in two lines left of the route and under the equator, so it stays inside the chart
  withA(ctx,fin(p,0.5,0.4),()=>{const lx=(mx+tah[0])/2-26;T(ctx,"more than",lx,ey+62,{w:700,size:28,align:"right",color:rgba(D11_KNOW,1)});T(ctx,"4,000 km",lx,ey+98,{w:700,size:28,align:"right",color:rgba(D11_KNOW,1)});});
  T(ctx,"equator",x+w-22,ey-10,{w:600,size:28,align:"right",color:rgba(SOFT,0.8)});});}
// the navigator's test, as a card over the night sky
function d11_testCard(ctx,cx,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const q=o.q||"Could someone else sail by it?",w=Math.max(tw(ctx,q,44,700)+90,560);
  glass(ctx,cx-w/2,y,w,150,22,EAC,{glow:16+10*(o.hi||0),ea:0.85,fill:"rgba(6,12,22,0.92)"});T(ctx,"the navigator's test",cx,y+52,{f:"mono",w:500,size:28,align:"center",color:rgba(EAC,1)});
  T(ctx,q,cx,y+112,{w:700,size:44,align:"center"});
  if(o.mark>0.01){const mx=cx+w/2-36,my=y+36;if(o.pass)kt_gtick(ctx,mx,my,20,o.mark);else kt_rcross(ctx,mx,my,20,o.mark);}});}
scene("stars",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tF=c("few"),tL=c("link"),tR=c("ring"),tLa=c("land"),chartA=fin(t,tF-0.7,1.0)*(1-fin(t,tL-0.8,1.0)),seaA=1-chartA;
  // night, then dawn as they sight land, then a day in harbour; it stays day until the chart has covered it, then night again
  const tH=w("land","Three days"),dawn=fin(t,tLa-0.4,2.6)*(1-fin(t,tH,1.4)),day=fin(t,tH,1.6)*(1-fin(t,tF+0.35,0.3))*0.55;
  // the canoe sails on to the right (south), a little each second; the camera goes in to its navigator, then out to see the ring
  const cxN=600+t*5,cyN=700,sN=1.0,stern=cxN-282*sN;
  if(seaA>0.01){setScreen(ctx,S);ctx.save();
    focus(ctx,t,[[0,960,540,1.0],[w("mau","Its navigator")-0.2,stern+170,560,1.45],[tR+0.2,cxN+40,600,0.94],[tLa+0.4,cxN+220,560,1.0],[tH+0.3,cxN+470,590,1.38],[tL-0.8,cxN+40,560,0.94]],1.8);
    d11_sky(ctx,S,t,{dawn,day,turn:t*0.0016});
    d11_sea(ctx,t,{dawn,day,hi:pulseAt(t,w("mau","swells"),1.8)*0.8});
    // Mataiva on the horizon, then Papeʻete's shore
    d11_atoll(ctx,1500,D11_HOR,260,fin(t,w("land","Mataiva")-0.3,1.0)*(1-fin(t,tH,0.8)),dawn);
    d11_harbour(ctx,t,{a:fin(t,tH-0.2,1.2)*(1-fin(t,tF+0.35,0.3)),p:clamp((t-tH)/2.4,0,1)});
    // stars rising at the horizon ahead, in the east, as the navigator reads them
    const tS=w("mau","stars"),rs=fin(t,tS-0.2,0.8)*(1-fin(t,tR+0.4,0.8));if(rs>0.01)[[1120,0],[1340,1],[880,2]].forEach(([x,k])=>{const u=((t-tS)*0.08+k*0.3)%1,y=D11_HOR-6-u*120;withA(ctx,rs*(1-u),()=>{glow(ctx,x+u*8,y,16,[220,232,255],0.7);ctx.fillStyle="rgba(240,246,255,1)";ctx.beginPath();ctx.arc(x+u*8,y,2.6,0,TAU);ctx.fill();});});
    // the star compass, in memory: a ring round the canoe, its points where the stars rise and set
    const back=t>tL-0.8,RA=Math.max(fin(t,tR,0.6)*(1-fin(t,tLa+0.8,1.4)),fin(t,tL-0.7,1.0)),rp=back?1:clamp((t-tR-0.1)/2.2,0,1),pts=back?1:clamp((t-tR-0.6)/2.4,0,1);
    d11_compass(ctx,cxN,cyN+10,820,124,t,{a:RA,half:"back",p:rp,pts,rise:back?0.7:fin(t,w("ring","rise"),1.0)});
    d11_canoe(ctx,cxN,cyN,sN,t,{lit:0.45+0.4*dawn+0.3*day,col:mix([170,200,240],[255,196,150],Math.max(dawn,day)),nav:fin(t,w("mau","Mau")-0.2,0.8)*(1-fin(t,tR+1.6,1.0)),crew:4});
    d11_compass(ctx,cxN,cyN+10,820,124,t,{a:RA,half:"front",p:rp,pts});
    // the birds, which the navigator reads too: at dusk they fly home, to land
    const tB=w("mau","birds"),bA=fin(t,tB-0.3,0.5)*(1-fin(t,tB+4.2,0.8));if(bA>0.01)[[0,300,0.9],[1,250,0.7],[2,340,0.8]].forEach(([k,y,s])=>{const u=(t-tB+0.3)*120;d11_bird(ctx,1500-u-k*90,y+Math.sin(u*0.01+k)*10,s,t+k,-1,bA);});
    ctx.restore();
    // where and when; then how long they had been at sea
    eaYear(ctx,80,80,"Maui · May 1976",CLAY,fin(t,0.5,0.8)*(1-fin(t,tLa-0.6,0.6)));
    eaYear(ctx,80,80,"day 31 · Mataiva",CLAY,fin(t,tLa,0.6)*(1-fin(t,tH-0.3,0.6)));
    eaYear(ctx,80,80,"Papeʻete · 4 June",CLAY,fin(t,tH,0.6)*(1-fin(t,tF-0.8,0.6)));
    const tK=w("land","seventeen");if(t>tK-0.4&&t<tF)withA(ctx,fin(t,tK-0.3,0.6)*(1-fin(t,tF-0.9,0.5)),()=>tag(ctx,1340,400,"more than 17,000 people waiting",D11_KNOW,{align:"center",size:30}));
    d11_inset(ctx,1250,70,580,470,clamp((t-w("coast","leaves")+0.3)/2.4,0,1),fin(t,w("coast","leaves")-0.6,0.8)*(1-fin(t,w("coast","no charts")+0.2,1.0)));
    // what a map lives by, over the ring; then the test
    [["use it",520],["keep it true",960],["teach it",1400]].forEach(([s_,x])=>{const t0=w("link",s_)-0.1,a_=fin(t,t0,0.6)*(1-fin(t,c("test")-0.2,0.6));if(a_>0.01)arrive(ctx,x,206,t,t0,()=>tag(ctx,x,206,s_,D11_KNOW,{align:"center",size:34}),{dy:-14,a:a_});});
    d11_testCard(ctx,960,92,fin(t,c("test")-0.1,0.6)*(1-fin(t,B+0.6,0.6)),{hi:pulseAt(t,w("test","could"),1.6)});}
  // the chart: the few who still held the knowledge, and how it passed on
  if(chartA>0.01)withA(ctx,chartA,()=>{d11_chartBg(ctx,S);ctx.save();
    const tB=w("teach","beyond"),tN=w("teach","Nainoa"),tO=w("teach","taught others");
    const CK=[[0,372,380,2.6],[tB-0.3,880,500,1.0],[tO-0.4,1310,200,1.7]],z=focusZ(t,CK,2.0);focus(ctx,t,CK,2.0);
    d11_chart(ctx,t,{z,labM:fin(t,tF-0.2,0.8)*(1-fin(t,tO-0.4,0.6)),labH:fin(t,tB,0.8),labT:fin(t,tB,0.8)*(1-fin(t,tO-0.8,0.5))});
    // the few who still held it, in the central Carolines; each passing it to an apprentice
    const MIC=["Satawal","Puluwat","Lamotrek","Woleai","Pulusuk","Pulap"],tP=w("few","passed");
    MIC.forEach((n,i)=>{const[x,y]=d11_pac(n),k=fin(t,tF+0.2+i*0.18,0.6);d11_light(ctx,x,y,5,t,{k});
      if(i<4){const ax=x+[-14,16,-18,14][i],ay=y-[30,24,34,26][i],p=clamp((t-tP-i*0.35)/1.1,0,1);d11_pass(ctx,x,y,ax,ay,p,D11_KNOW,{bend:0.4,trail:0.5});d11_light(ctx,ax,ay,4,t,{k:fin(t,tP+i*0.35+1.0,0.5)});}});
    // beyond his own island: to Hawaiʻi, where Nainoa Thompson learned it, and taught others (Micronesia's names fade as the camera leaves)
    const[sx,sy]=d11_pac("Satawal"),[ox,oy]=d11_pac("Oʻahu");
    d11_name(ctx,"Satawal",sx,sy+50/z,"center",fin(t,c("teach")-0.2,0.6)*(1-fin(t,tO-0.4,0.6)),{size:32/z});
    d11_pass(ctx,sx,sy,ox,oy,clamp((t-tB+0.2)/2.2,0,1),D11_KNOW,{bend:-0.18,trail:0.55,lw:2.2});
    d11_light(ctx,ox,oy,6,t,{k:fin(t,tN,0.6)});d11_name(ctx,"Nainoa Thompson",ox-22/z,oy-24/z,"right",fin(t,tN+0.1,0.6),{size:32/z});
    [["Kauaʻi",0],["Maui",1],["Hawaiʻi",2],["Molokaʻi",3]].forEach(([n,i])=>{const[x,y]=d11_pac(n),dx=(i-1.5)*14,p=clamp((t-tO-i*0.22)/0.9,0,1);d11_pass(ctx,ox,oy,x+dx,y+12+i*6,p,D11_KNOW,{bend:0.5,trail:0.45});d11_light(ctx,x+dx,y+12+i*6,4,t,{k:fin(t,tO+i*0.22+0.8,0.5)});});
    ctx.restore();});
  vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"A map people and agents can read","kept in one tool, read by people and agents",EAC,"Film 11 of 11 · enterprise architecture, for data");});

/* ---------- 2. Useful, so at risk ---------- */
const D11_NOTE="How do we keep the map alive?";
scene("risk",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const tU=c("used"),tSt=c("stale"),tS=c("slides"),tC=c("copies"),tG=w("copies","glossary"),tW=c("worse"),tT=w("worse","trust"),tF=c("fails"),tN=w("fails","nobody"),tX=w("fails","fails");
  const st=fin(t,tSt,1.4),wv=fin(t,tW-0.1,0.7)*(1-fin(t,tF,0.6)),dim=fin(t,tN-0.4,0.8);
  // Tomás's note, from the end of When strategy moves: the question this film answers
  arrive(ctx,330,180,t,0.3,()=>sticky(ctx,330,180,500,128,D11_NOTE,{col:NOTEC[0],size:32,st:0,rot:-0.025}),{dy:-20});
  // the map, used every week: three uses pinned round it
  const pu=k=>pulseAt(t,w("used",k),1.4),uses=[["requests, read with the skipper's test",330,460,"skipper's test",NOTEC[2],-0.02],["rules, each given a home",1590,210,"rules",NOTEC[3],0.02],["one page for the minister",1590,430,"minister",NOTEC[1],-0.015]];
  const hiA=fin(t,w("typed","applications")-0.3,0.5)*(1-fin(t,c("copies")-0.3,0.5));
  arrive(ctx,960,330,t,0.6,()=>d11_mapCard(ctx,680,110,560,440,{stale:st,glow:Math.max(pu("skipper's test"),pu("rules"),pu("minister")),hi:[0,0,0,0,hiA,0]}),{dy:-16});
  const uOut=1-fin(t,tS-0.4,0.6);
  uses.forEach(([s_,x,y,k,col,rot])=>{const t0=w("used",k)-0.2;if(t<t0)return;const q=fin(t,t0,0.6)*uOut;if(q<=0.01)return;
    const ex=x<960?680:1240,ey=clamp(y,170,520);arrowTo(ctx,x<960?x+220:x-220,y,ex,ey,[90,80,64],0.7*q,{p:fin(t,t0+0.2,0.6),lw:3,head:12});
    arrive(ctx,x,y,t,t0,()=>withA(ctx,uOut*(1-0.3*st),()=>sticky(ctx,x,y,420,120,s_,{col,size:30,rot})),{dy:-16});});
  // every week: the weeks it's been used, ticked off under the map
  const wkA=uOut*(1-fin(t,tSt-0.3,0.5)),wk=clamp((t-tU-0.4)/4.5,0,1)*wkA;if(wk>0)for(let i=0;i<10;i++){const q=clamp(wk*10-i,0,1)*wkA;if(q<=0)continue;withA(ctx,q,()=>{ctx.fillStyle=rgba(EAC,0.85);ctx.beginPath();ctx.arc(780+i*40,590,7,0,TAU);ctx.fill();});}
  withA(ctx,fin(t,w("used","every week"),0.5)*wkA,()=>T(ctx,"used every week",960,642,{w:700,size:28,align:"center",color:rgba(EAC,1)}));
  if(st>0.01)withA(ctx,st*(1-fin(t,tS-0.4,0.5)),()=>tag(ctx,960,612,"last changed in March",CLAY,{align:"center",size:28}));
  // where it lives: slides, and a modelling tool only Tomás edits
  if(t>tS-0.1)arrive(ctx,330,640,t,tS-0.1,()=>{[2,1,0].forEach(i=>d11_slide(ctx,140+i*16,520-i*14,360,230,{rot:-0.03+i*0.02,head:i?null:"Our map",headSize:28,stale:st}));tag(ctx,320,800,"slides",[200,210,230],{align:"center",size:28});},{dy:-14});
  const tool=fin(t,w("slides","modelling tool")-0.2,0.6)*(1-fin(t,tG-0.4,0.6));
  if(tool>0.01)withA(ctx,tool,()=>{glass(ctx,1340,150,480,320,14,[180,190,210],{glow:10,ea:0.6,fill:"rgba(20,24,34,0.97)"});ctx.fillStyle="rgba(40,46,62,1)";rr(ctx,1340,150,480,50,14);ctx.fill();ctx.fillRect(1340,180,480,20);
    [0,1,2].forEach(i=>{ctx.fillStyle=rgba([[232,96,84],[245,206,140],[132,226,160]][i],0.9);ctx.beginPath();ctx.arc(1366+i*24,175,7,0,TAU);ctx.fill();});T(ctx,"modelling tool",1446,185,{w:700,size:28,color:rgba(SOFT,1)});
    d11_mini(ctx,1370,222,300,220,{stale:st});kt_lock(ctx,1748,330,1.1,[200,200,210],1,0);
    withA(ctx,fin(t,w("slides","only")-0.1,0.5),()=>tag(ctx,1580,500,"only Tomás edits",[200,210,230],{align:"center",size:30}));});
  // its applications, typed in by hand from the IT service management tool: one name typed, carried up into the map's application
  // row; then three of the row's five have changed at the source since
  const tY=c("typed"),yOut=1-fin(t,tC-0.3,0.5),tK=w("typed","typed"),tUp=w("typed","from")-0.2,AR=D11_MAP.R[4],ay=180+57.33*4+14.3,ab=k=>[710+AR[k].u*500-AR[k].w*250,ay,AR[k].w*500,28.7];
  if(t>tY-0.2&&yOut>0.01){
    arrive(ctx,960,756,t,tY+0.1,()=>withA(ctx,yOut,()=>d11_srcCard(ctx,2,700,700,520,112,{hi:pulseAt(t,w("typed","IT service")-0.2,1.4)})),{dy:16});
    const up=ease(fin(t,tUp,1.1)),cy=lerp(664,438,up),ca=fin(t,tK-0.2,0.4)*(1-fin(t,tUp+0.9,0.4))*yOut,nm="billing",typed=typeOn(nm,fin(t,tK,0.9));
    if(ca>0.01){withA(ctx,ca*0.7,()=>{ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(960,698);ctx.lineTo(960,Math.max(cy+24,552));ctx.stroke();ctx.restore();});
      withA(ctx,ca,()=>{const cw=tw(ctx,nm,28,500,"mono")+48;glass(ctx,960-cw/2,cy-22,cw,44,10,D11_SAND,{glow:10,ea:0.85,fill:"rgba(22,16,8,0.96)"});T(ctx,typed,960-cw/2+16,cy+10,{f:"mono",w:500,size:28,color:rgba(mix(D11_SAND,INK,0.4),1)});
        if(Math.floor(t*2.4)%2===0&&up<0.05){const cx=960-cw/2+16+tw(ctx,typed,28,500,"mono")+3;ctx.fillStyle=rgba(D11_SAND,0.9);ctx.fillRect(cx,cy-14,2.4,30);}});}
    withA(ctx,fin(t,w("typed","by hand")-0.1,0.5)*(1-fin(t,tUp+0.9,0.4))*yOut,()=>tag(ctx,1070,620,"typed by hand",SOFT,{size:28}));
    // where it lands, then the three that have changed since
    const land=pulseAt(t,tUp+0.9,1.2);if(land>0.01){const[bx,by,bw,bh]=ab(2);glow(ctx,bx+bw/2,by+bh/2,40,APL,0.35*land);}
    const tCh=w("typed","many");[0,2,3].forEach((k,i)=>{const q=fin(t,tCh+i*0.25,0.5)*yOut;if(q<=0.01)return;const[bx,by,bw,bh]=ab(k);withA(ctx,q,()=>{glow(ctx,bx+bw/2,by+bh/2,30,AMBER,0.3);ctx.strokeStyle=rgba(AMBER,0.95);ctx.lineWidth=3;rr(ctx,bx-4,by-4,bw+8,bh+8,6);ctx.stroke();});});
    withA(ctx,fin(t,w("typed","since")-0.3,0.5)*yOut,()=>{const s_="changed since March",tw_=tw(ctx,s_,28,700)+26;tag(ctx,666-tw_,438,s_,AMBER,{size:28});});}
  // the glossary and the catalogue, each with its own words for the same thing
  const gOut=1-fin(t,tW-0.3,0.6);
  if(t>tG-0.2)arrive(ctx,1580,215,t,tG-0.2,()=>withA(ctx,gOut,()=>{glass(ctx,1340,150,480,130,16,INF,{glow:12,ea:0.8,fill:"rgba(16,10,8,0.95)"});T(ctx,"glossary",1366,194,{f:"mono",w:500,size:28,color:rgba(INF,1)});T(ctx,"estimated reading",1366,252,{w:800,size:34});}),{dy:-12});
  if(t>w("copies","catalogue")-0.2)arrive(ctx,1580,425,t,w("copies","catalogue")-0.2,()=>withA(ctx,gOut,()=>{glass(ctx,1340,360,480,130,16,[150,190,255],{glow:12,ea:0.8,fill:"rgba(6,10,20,0.95)"});T(ctx,"catalogue",1366,404,{f:"mono",w:500,size:28,color:rgba([150,190,255],1)});T(ctx,"readings.est_flag",1366,462,{f:"mono",w:500,size:32});}),{dy:-12});
  withA(ctx,fin(t,w("copies","own words"),0.4)*gOut,()=>{glow(ctx,1580,318,40,D11_RED,0.25);T(ctx,"≠",1580,338,{w:800,size:56,align:"center",color:rgba(D11_RED,1)});});
  // the copies drift: three decks, each a little different
  const cps=[["board pack",800,700,-0.05,{wrong:7}],["retail plan",1130,712,0.03,{missing:11}],["data strategy",1460,692,-0.02,{missing:4,wrong:15}]],tCd=w("copies","drift"),dr=i=>fin(t,tCd-0.2+i*0.25,0.5)>0.5;
  cps.forEach(([nm,x,y,rot,o_],i)=>{const t0=tC+0.2+i*0.35,u=ease(clamp((t-t0)/1.1,0,1));if(u<=0||(i===0&&wv>0.01))return;const xx=lerp(330,x,u),yy=lerp(640,y,u);
    withA(ctx,1-dim*0.4,()=>d11_slide(ctx,xx-150,yy-100,300,200,{rot,head:nm,headSize:28,missing:dr(i)?o_.missing:null,wrong:dr(i)?o_.wrong:null}));});
  withA(ctx,fin(t,tCd-0.1,0.5)*(1-fin(t,tW-0.3,0.5)),()=>T(ctx,"the copies drift",1130,592,{w:800,size:32,align:"center",color:rgba([255,214,160],1)}));
  // a stale map is worse than none: the board pack's copy, which everyone trusts, and which is out of date
  if(wv>0.01){ctx.save();ctx.fillStyle=rgba([14,11,8],0.62*wv);ctx.fillRect(-100,-100,W+200,H+200);ctx.restore();
    const u=ease(fin(t,tW-0.1,0.9)),sc_=lerp(1,1.9,u),cx_=lerp(800,900,u),cy_=lerp(700,500,u);withA(ctx,wv,()=>{ctx.save();ctx.translate(cx_,cy_);ctx.scale(sc_,sc_);d11_slide(ctx,-150,-100,300,200,{rot:-0.05*(1-u),head:"board pack",headSize:28,wrong:7});ctx.restore();
      withA(ctx,fin(t,tT-0.3,0.5),()=>tag(ctx,cx_-sc_*150+70,cy_-sc_*100-30,"trusted",TRUST,{align:"center",size:30}));
      const e=D11_MAP.R[2][0],ex=cx_+(-120+e.u*240)*sc_,ey=cy_+(-34+18*2.5)*sc_,ro=fin(t,tT+0.4,0.5);if(ro>0.01)withA(ctx,ro,()=>{ring(ctx,ex,ey,30*sc_/1.4,D11_RED,0.95,3.5);tag(ctx,ex+40,ey+sc_*100-20,"out of date",D11_RED,{size:30});});});}
  // Tomás, the only one who edits it; then, if he left
  const tL=c("fails"),gone=fin(t,tL+0.3,1.2);
  withA(ctx,1-gone,()=>d11_personR(ctx,"tomas",1730,1060,0.78,{t,pose:t>c("note")&&t<c("note")+2.4?"explain":"stand",expr:t>tSt?"concerned":"calm"}));
  if(gone>0.01)withA(ctx,gone*(1-dim*0.5),()=>{ctx.save();ctx.setLineDash([9,9]);ctx.strokeStyle=rgba(TECH,0.55);ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(1730,612,40,50,0,0,TAU);ctx.moveTo(1650,1000);ctx.quadraticCurveTo(1660,700,1730,690);ctx.quadraticCurveTo(1800,700,1810,1000);ctx.stroke();ctx.restore();});
  ctx.restore();
  if(dim>0.01){setScreen(ctx,S);ctx.fillStyle=rgba([8,6,4],0.6*dim);ctx.fillRect(0,0,W,H);}
  d11_testCard(ctx,960,380,dim,{mark:fin(t,tX,0.5),pass:false,hi:pulseAt(t,tX,1.4)});
  vign(ctx,S);});

/* ---------- 3. One map, many sources ---------- */
// the tool's window, and where the graph sits in it: its bands line up with the rows of the map's side panel in later chapters
const D11_WIN=[60,96,1100,560],D11_GX=380,D11_GW=740,D11_GY=270,D11_SCX=1240,D11_SCW=620,D11_SCY=[180,320,480];
const d11_gxy=i=>[D11_GX+D11_GN[i][1]*D11_GW,D11_GY+D11_GN[i][0]*56];
scene("sources",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);
  // the wall gives way to glass as the map moves into the tool
  const tE=w("move","enterprise"),wallA=1-fin(t,tE-0.6,1.0);bg2(ctx);motes(ctx,t);if(wallA>0.01)withA(ctx,wallA,()=>wallBg(ctx,S,t));
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const tK=w("kept","already"),tIn=c("in"),tR=c("rest"),tTm=c("terms"),tJ=c("job"),tG=w("move","graph");
  // the window: the map's name, what it is, and the people who use it
  const[WX,WY,WW,WH]=D11_WIN;arrive(ctx,WX+WW/2,WY+WH/2,t,tE-0.6,()=>d11_window(ctx,WX,WY,WW,WH,{sub:"an enterprise architecture tool",subA:fin(t,tE,0.5),people:clamp((t-w("move","everyone")+0.1)/1.2,0,1),glow:pulseAt(t,w("job","modelling"),1.6)}),{dy:-12});
  const wa=fin(t,tE-0.5,0.6);
  // what it's made of: a search, a database and a graph
  if(wa>0.01)withA(ctx,wa,()=>{glass(ctx,96,172,252,48,24,[170,200,245],{glow:0,ea:0.35,fill:"rgba(10,16,30,0.9)"});ctx.save();ctx.strokeStyle=rgba(SOFT,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(126,194,9,0,TAU);ctx.moveTo(133,201);ctx.lineTo(141,209);ctx.stroke();ctx.restore();T(ctx,"search",152,206,{w:600,size:28,color:rgba(SOFT,0.9)});});
  [["database",w("move","database"),d11_db,420],["graph",tG,d11_gglyph,640]].forEach(([s_,t0,g,x])=>{const q=fin(t,t0-0.15,0.5);if(q<=0.01)return;withA(ctx,q,()=>{glass(ctx,x,172,tw(ctx,s_,28,700)+76,48,24,EAC,{glow:8+14*pulseAt(t,t0,1.4),ea:0.8,fill:"rgba(6,14,16,0.95)"});g(ctx,x+28,196,26,EAC);T(ctx,s_,x+52,206,{w:700,size:28,color:rgba(EAC,1)});});});
  // the layers down its side, lined up with the graph's bands
  D11_TREE.forEach(([nm,col],i)=>{const q=fin(t,tE-0.2+i*0.08,0.5);if(q<=0.01)return;const y=D11_GY+i*56,hi=i===3?fin(t,w("terms","glossary")-0.2,0.5)*(1-fin(t,tJ-0.3,0.6)):0;withA(ctx,q,()=>{
    if(hi>0.01){ctx.fillStyle=rgba(col,0.12*hi);rr(ctx,80,y-24,1060,48,10);ctx.fill();}glow(ctx,102,y,14,col,0.3);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(102,y,8,0,TAU);ctx.fill();T(ctx,nm,124,y+10,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.3),1)});});});
  // the slide's boxes fly into the graph, each to its layer's band; the rest of the graph fills in
  const fl0=tE-0.1,byBand=D11_TREE.map((_,r)=>D11_GN.map((n,i)=>[n,i]).filter(([n])=>n[0]===r).sort((A,B)=>A[0][1]-B[0][1]).map(([,i])=>i)),FROM={};
  {let n=0;D11_MAP.R.forEach((row,i)=>row.forEach((e,k)=>{const SX=600,SY=210,SW=720,SH=480,py=SH*0.05+46,mx=SX+30,my=SY+py+10,mw=SW-60,mh=SH-py-36,rh=mh/6,bw=e.w*mw,bh=rh*0.5;
    FROM[byBand[i][k]]={x:mx+e.u*mw,y:my+rh*i+rh*0.5,w:bw,h:bh,d:n++*0.03};}));}
  const land=i=>FROM[i]?fl0+FROM[i].d+1.1:fl0+1.2+i*0.02,na=i=>FROM[i]?(t>=land(i)?1:0):fin(t,land(i),0.5);
  const sl=1-fin(t,fl0+0.3,0.9);if(sl>0.01)withA(ctx,sl,()=>d11_slide(ctx,600,210,720,480,{head:"Our map",headSize:32}));
  Object.entries(FROM).forEach(([i,F])=>{const u=ease(clamp((t-fl0-F.d)/1.1,0,1));if(u<=0||u>=1)return;const[nx,ny]=d11_gxy(+i),col=D11_TREE[D11_GN[i][0]][1],x=lerp(F.x,nx,u),y=lerp(F.y,ny,u)-Math.sin(u*Math.PI)*30,ww=lerp(F.w,18,u),hh=lerp(F.h,18,u);
    ctx.fillStyle=rgba(col,0.2+0.6*u);rr(ctx,x-ww/2,y-hh/2,ww,hh,Math.min(ww,hh)/2*u+4*(1-u));ctx.fill();ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=1.6;rr(ctx,x-ww/2,y-hh/2,ww,hh,Math.min(ww,hh)/2*u+4*(1-u));ctx.stroke();});
  // kept somewhere else: what comes from other systems empties to a dashed ring, then fills as its source brings it in, ringed in sand
  const thr=k=>w("in","brings")-0.3+k*0.4,arr=i=>{const k=D11_GN[i][2];return thr(k)+0.9+(1166-d11_gxy(i)[0])/1400;};
  const nh=i=>D11_GN[i][2]<0?0:fin(t,tK+i*0.02,0.5)*(1-fin(t,arr(i),0.35)),ns=i=>fin(t,arr(i),0.4);
  const own=i=>D11_GN[i][2]<0,cap=[6,7,8],rule=[3],dec=[28,29,30];
  const nl=i=>Math.max(D11_GN[i][2]>=0?pulseAt(t,arr(i),1.0)+pulseAt(t,w("where",["Strategy","goals","applications"][D11_GN[i][2]])+0.2,1.2)*0.6:0,
    own(i)?fin(t,w("rest","written"),0.5)*(1-fin(t,tTm-0.4,0.6))*0.6:0,cap.includes(i)?pulseAt(t,w("rest","capabilities"),1.2):0,rule.includes(i)?pulseAt(t,w("rest","rules"),1.2):0,dec.includes(i)?pulseAt(t,w("rest","decisions"),1.2):0,
    D11_GN[i][0]===3?fin(t,w("terms","glossary")-0.2,0.5)*(1-fin(t,tJ-0.3,0.6)):0,pulseAt(t,w("job","modelling")+0.1+D11_GN[i][1]*0.4,1.0)*0.8);
  const tL=w("rest","links"),el=e=>Math.max(fin(t,tL+e*0.02,0.4)*(1-fin(t,tTm-0.4,0.8)),pulseAt(t,w("job","modelling")+e*0.01,1.2));
  d11_graph(ctx,D11_GX,D11_GY,D11_GW,{a:wa,na,nh,ns,nl,ea:e=>fin(t,tG-0.1+e*0.02,0.5),el});
  // the sources, each where it's kept: a card, then threads into the tool, one for each layer it feeds
  const SRCB=[[0,1],[0,1],[4,5]];
  withA(ctx,fin(t,w("kept","somewhere")-0.2,0.5)*(1-fin(t,w("job","data integration")-0.4,0.5)),()=>T(ctx,"kept somewhere else",D11_SCX+D11_SCW/2,140,{w:800,size:30,align:"center",color:rgba(D11_SAND,1)}));
  [0,1,2].forEach(k=>{const t0=w("where",["Strategy","goals","applications"][k])-0.2,y=D11_SCY[k];if(t<t0)return;const ym=y+56;
    SRCB[k].forEach((r,j)=>{const tp=fin(t,thr(k)+j*0.12,0.9),p1=(t-(thr(k)+0.4))/0.8,p2=(t-(w("in","in step")+k*0.1))/0.9,p3=(t-(w("job","data integration")-0.1+k*0.12))/0.9;
      d11_thread(ctx,D11_SCX-8,ym,1168,D11_GY+r*56,tp,D11_SAND,{a:0.55,lw:2.4,pulse:p1>0&&p1<1?p1:p2>0&&p2<1?p2:p3>0&&p3<1?p3:null});});
    arrive(ctx,D11_SCX+D11_SCW/2,ym,t,t0,()=>d11_srcCard(ctx,k,D11_SCX,y,D11_SCW,112,{hi:Math.max(pulseAt(t,t0+0.25,1.3),pulseAt(t,thr(k)+0.1,1.2)*0.7)}),{dy:-14});});
  // brought in with its source's ID, and kept in step: billing, from IT service management
  const pgA=fin(t,w("in","source's")-0.3,0.5)*(1-fin(t,tR-0.3,0.5));
  if(pgA>0.01){const[nx,ny]=d11_gxy(20);withA(ctx,pgA,()=>{ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(D11_SAND,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(nx,ny+16);ctx.lineTo(nx,684);ctx.stroke();ctx.restore();ring(ctx,nx,ny,17,D11_SAND,0.9,2.4);});
    arrive(ctx,760,774,t,w("in","source's")-0.3,()=>d11_file(ctx,360,684,800,"application/APP-004.yml",[["name","billing"],["source","IT service management · CI-00417",{hiCol:D11_SAND}]],{col:APL,a:pgA,hi:[0,fin(t,w("in","source's ID")-0.1,0.4)],chip:["in step",D11_OK,fin(t,w("in","in step")-0.1,0.4)]}),{dy:-12});}
  // the rest is written in the map itself
  const rA=fin(t,w("rest","written")-0.2,0.5)*(1-fin(t,tTm-0.3,0.5));
  if(rA>0.01)withA(ctx,rA,()=>{const items=[["capabilities",STR],["rules",D11_RULE],["decisions",D11_KIND.decision[1]],["links",EAC]],lab="written in the map";let x=960-(tw(ctx,lab,28,500,"mono")+24+items.reduce((s_,[n])=>s_+tw(ctx,n,30,700)+26+16,0)-16)/2;
    T(ctx,lab,x,782,{f:"mono",w:500,size:28,color:rgba(EAC,1)});x+=tw(ctx,lab,28,500,"mono")+24;
    items.forEach(([n,col])=>{const q=fin(t,w("rest",n)-0.15,0.4);withA(ctx,q,()=>tag(ctx,x,772,n,col,{size:30}));x+=tw(ctx,n,30,700)+26+16;});});
  // even the glossary: each term a business object, defined once, by the business
  const gA=fin(t,w("terms","business object")-0.4,0.5)*(1-fin(t,tJ-0.3,0.5));
  if(gA>0.01){const[nx,ny]=d11_gxy(14);withA(ctx,gA,()=>{ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(INF,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(nx,ny+16);ctx.lineTo(nx,676);ctx.stroke();ctx.restore();ring(ctx,nx,ny,17,INF,0.9,2.4);});
    arrive(ctx,760,770,t,w("terms","business object")-0.4,()=>d11_term(ctx,360,676,800,{a:gA,by:fin(t,w("terms","defined")-0.1,0.5),tick:fin(t,w("terms","by the business")+0.3,0.5),glow:pulseAt(t,w("terms","defined"),1.4)}),{dy:-12});}
  // a data integration job, as well as a modelling one
  const jA=fin(t,w("job","data integration")-0.3,0.5);
  if(jA>0.01)withA(ctx,jA,()=>{const a1="data integration",mid="as well as",a2="modelling",w1=tw(ctx,a1,32,700)+26,wm=tw(ctx,mid,30,700),w2=tw(ctx,a2,32,700)+26,x0=960-(w1+wm+w2+48)/2,q2=fin(t,w("job","modelling")-0.2,0.4);
    tag(ctx,x0,774,a1,D11_SAND,{size:32});withA(ctx,q2,()=>{T(ctx,mid,x0+w1+24,785,{w:700,size:30,color:rgba(SOFT,1)});tag(ctx,x0+w1+wm+48,774,a2,EAC,{size:32});});});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Each element once ---------- */
const D11_SIX=[["capability","CAP-004","connect customers"],["step","STP-004","read · meter to cash"],["domain","DOM-001","network"],["object","OBJ-003","reading"],["rule","RUL-021","estimate replaced by actual"],["measure","MSR-002","working days to connect new solar"]];
// the same element in both ways of keeping a map: a page in the tool, and a text file in a repository
const D11_BOTH=[["id","RUL-021"],["name","estimate replaced by actual"],["owner","Grace Achieng"],["evidence","metering rules 7.4 · 14 Mar 2027"],["status","confirmed"]];
scene("text",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:440});
  const tI=c("id"),tFd=c("fields"),tD=c("decisions"),tF=c("files"),tS=c("scale"),out=fin(t,tF-0.5,0.6);
  // each element kept once: six of them, one of each kind
  const six=1-fin(t,tI-0.2,0.8);
  D11_SIX.forEach(([k,id,nm],i)=>{const t0=w("once",k==="object"?"business object":k)-0.15,x=140+(i%3)*560,y=210+Math.floor(i/3)*230;if(t<t0)return;const isR=k==="rule";
    if(isR&&t>tI-0.2)return;arrive(ctx,x+260,y+85,t,t0,()=>withA(ctx,six,()=>d11_fileMini(ctx,x,y,520,k,id,nm,{hi:pulseAt(t,t0+0.15,1.2)})),{dy:-14});});
  withA(ctx,fin(t,w("once","kept once")-0.1,0.5)*six,()=>T(ctx,"each element, kept once",960,130,{w:800,size:36,align:"center",color:rgba(EAC,1)}));
  // the rule's page, opened: its id first, then the rest, line by line
  const fo=fin(t,tI-0.3,0.8),dOut=fin(t,tD-0.3,0.8),FX=lerp(1260,110,ease(fo)),FY=lerp(440,140,ease(fo));
  if(fo>0.01&&out<0.99){const rows=D11_RUL021.map((_,i)=>{const at=[tI,tI+0.3,w("fields","named as")-0.3,w("fields","definition"),w("fields","definition")+0.2,w("fields","definition")+0.4,w("fields","owner"),w("fields","relationships"),w("fields","relationships")+0.25,w("fields","relationships")+0.5,w("rules","evidence"),w("rules","whether")][i];return fin(t,at,0.6);});
    const tN=w("id","Names change"),hi=D11_RUL021.map((_,i)=>i===0?Math.max(pulseAt(t,w("id","stable ID"),1.6),fin(t,w("id","IDs don't"),0.4)*(1-fin(t,tFd-0.2,0.6))):i===1?pulseAt(t,tN+0.2,1.6):(i===2||i===8||i===9)?pulseAt(t,w("fields","ArchiMate"),2.0):i===10?pulseAt(t,w("rules","evidence"),1.8):i===11?pulseAt(t,w("rules","confirmed"),1.8):0);
    const L=D11_RUL021.map(([k,v,op],i)=>i===1?[k,v,{from:"estimated reading superseded",u:clamp((t-tN-0.3)/0.9,0,1)}]:i===11?[k,v,{tick:fin(t,w("rules","confirmed"),0.5)}]:[k,v,op]);
    const nR=Math.max(2,...rows.map((r,i)=>r>0.01?i+ease(clamp(r*1.6,0,1)):0));withA(ctx,fo*(1-dOut*0.75)*(1-out),()=>{ctx.save();const sc2=lerp(0.45,1,ease(fo));ctx.translate(FX,FY);ctx.scale(sc2,sc2);d11_file(ctx,0,0,1180,"motivation/RUL-021.yml",L,{col:D11_RULE,rows,hi,h:84+nR*48+6});ctx.restore();});}
  // everything else points to the id
  const pt=fin(t,w("id","points")-0.6,0.6)*(1-fin(t,tFd-0.3,0.6));
  [["step","STP-004 · read",BUS,250],["check","on readings",D11_OK,370],["view","meter to cash",[170,205,255],490]].forEach(([k,s_,col,y],i)=>{const t0=w("id","everything")+i*0.25;if(t<t0-0.2||pt<=0.01)return;
    arrive(ctx,1620,y,t,t0-0.2,()=>withA(ctx,pt,()=>{const tx=1410;glass(ctx,tx,y-34,420,68,34,col,{glow:10,ea:0.8,fill:"rgba(6,10,20,0.95)"});T(ctx,k,tx+24,y+10,{f:"mono",w:500,size:28,color:rgba(col,1)});T(ctx,s_,tx+24+tw(ctx,k+"  ",28,500,"mono"),y+10,{w:700,size:30});
      arrowTo(ctx,tx-10,y,402,FY+66+24,col,0.85,{p:fin(t,t0,0.7),lw:2.6,head:12,bend:0.15*(i-1)});}),{dy:8});});
  const hiID=fin(t,w("id","IDs don't"),0.4)*(1-fin(t,tFd-0.2,0.6));if(hiID>0.01)withA(ctx,hiID,()=>tag(ctx,136,FY+66+2*48+56,"the id never changes",EAC,{size:30}));
  withA(ctx,pulseAt(t,w("fields","ArchiMate"),2.4),()=>tag(ctx,1330,FY+66+8.6*48,"named as ArchiMate names them",[200,186,255],{size:28}));
  // day one's two rules, now on every element
  const dr=fin(t,w("rules","two rules")-0.2,0.6)*(1-fin(t,tD-0.4,0.6));
  if(dr>0.01){const ey=FY+66+10*48+22,sy=FY+66+11*48+22,t1=ey-8,t2=sy+20;withA(ctx,dr,()=>{T(ctx,"from day one",1340,t1-62,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});tag(ctx,1340,t1,"every note names its source",EAC,{size:30});
    withA(ctx,fin(t,w("rules","whether")-0.3,0.5),()=>tag(ctx,1340,t2,"a draft until its owner confirms it",TRUST,{size:30}));
    arrowTo(ctx,1326,t1,880,ey,EAC,0.8,{p:fin(t,w("rules","evidence"),0.6),lw:2.6,head:12,bend:0});arrowTo(ctx,1326,t2,500,sy,TRUST,0.8,{p:fin(t,w("rules","whether"),0.6),lw:2.6,head:12,bend:0});});}
  // decisions are kept too, each saying why
  if(t>tD-0.3&&out<0.99){const L=D11_DEC007,rows=L.map((_,i)=>fin(t,tD+0.1+i*0.2,0.5));
    arrive(ctx,1340,460,t,tD-0.3,()=>withA(ctx,1-out,()=>d11_file(ctx,860,180,960,"decisions/DEC-007.yml",L,{col:D11_KIND.decision[1],rows,hi:L.map((_,i)=>i===3||i===4?pulseAt(t,w("decisions","why"),2.0)*1.2:0)})),{dy:-16});}
  // two ways to keep the same element: a page in the tool, and a text file in a repository, the simplest approach
  const bq=fin(t,B-0.4,1.2),sA=fin(t,tF-0.3,0.6),same=pulseAt(t,w("scale","Either way")+0.1,2.2),big=fin(t,w("scale","needs the tool")-0.1,0.5);
  if(sA>0.01){const L=D11_BOTH.map(([k,v],i)=>i===2?[k,v,{tick:1}]:[k,v]),hi=L.map((_,i)=>same*(i===1?0.6:1));
    arrive(ctx,510,410,t,tF-0.3,()=>{withA(ctx,sA*(1-bq),()=>T(ctx,"in the tool",120,222,{w:800,size:32,color:rgba(EAC,1)}));d11_file(ctx,100,250,820,"motivation/RUL-021.yml",L,{col:D11_RULE,a:sA*(1-bq*0.6),hi,glow:big*0.8+same*0.5});},{dy:-14});
    arrive(ctx,1410,410,t,w("files","text files")-0.3,()=>{const q=fin(t,w("files","text files")-0.3,0.6)*(1-bq);withA(ctx,q,()=>T(ctx,"as a text file, in a repository",1020,222,{w:800,size:32,color:rgba(SOFT,1)}));d11_file(ctx,1000,250,820,"motivation/RUL-021.yml",L,{col:D11_RULE,a:q,files:true,hi,glow:same*0.5});},{dy:-14});
    withA(ctx,fin(t,w("files","simplest")-0.2,0.5)*(1-bq),()=>tag(ctx,1020,630,"the simplest approach",[200,215,240],{size:30}));
    withA(ctx,fin(t,w("scale","many sources")-0.2,0.5)*(1-bq),()=>tag(ctx,120,630,"many sources",D11_SAND,{size:30}));
    withA(ctx,fin(t,w("scale","many people")-0.2,0.5)*(1-bq),()=>tag(ctx,120+tw(ctx,"many sources",30,700)+26+20,630,"many people, in their roles",EAC,{size:30}));
    withA(ctx,fin(t,w("scale","the same")-0.3,0.5)*(1-bq),()=>T(ctx,"the same ideas",960,760,{w:800,size:36,align:"center",color:rgba(TRUST,1)}));}
  // breathing out: the elements go into the map
  if(bq>0.01){ctx.restore();ctx.save();withA(ctx,bq,()=>{ctx.fillStyle="rgba(4,6,12,0.84)";ctx.fillRect(0,0,W,H);});arrive(ctx,300,470,t,B-0.2,()=>d11_tree(ctx,80,150,440,{p:clamp((t-B)/1.2,0,1)}),{dy:-12});
    const u=ease(clamp((t-B-0.3)/1.0,0,1));if(u>0&&u<1){const x=lerp(510,150,u),y=lerp(412,270,u)-Math.sin(u*Math.PI)*80;
      withA(ctx,1-u*0.5,()=>{ctx.save();ctx.translate(x,y);ctx.scale(1-u*0.85,1-u*0.85);glass(ctx,-150,-100,300,200,10,D11_RULE,{glow:12,ea:0.9,fill:"rgba(6,10,20,0.95)"});ctx.restore();});}}
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Reviewed and versioned ---------- */
const D11_VERS=[["v2.4","23 Jul"],["v2.5","6 Aug"],["v2.6","20 Aug"],["v2.7","3 Sep"],["v2.8","17 Sep"]];
const D11_HIST=[["v2.7","3 Sep","OBL-006 · evidence updated","Ama"],["v2.6","20 Aug","DEC-007 · one outage system, added","Grace"],["v2.5","6 Aug","RUL-021 · renamed and confirmed","Grace"],["v2.4","23 Jul","the map, moved into the tool","Tomás"]];
scene("review",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tP=c("pr"),tC=c("checks"),tW=c("power"),tV=c("repo")+0.4;
  ctx.save();focus(ctx,t,[[0,960,540,1.0]],1.8);
  // the map in the tool, as its side panel shows it
  d11_tree(ctx,80,150,440,{p:1,hi:D11_TREE.map((_,i)=>i===1?fin(t,tP+0.3,0.6)*(1-fin(t,tC-0.4,0.6)):0),scan:(t-tC-0.1)/2.2,warn:D11_TREE.map((_,i)=>i===1?fin(t,tW+0.3,0.5):0)});
  // every version is kept: the map's history, newest first; then the versions fly to a line under the side panel
  const f0=tP-1.1,fl=ease(clamp((t-f0)/1.1,0,1)),la=fin(t,f0+1.5,0.15);
  d11_history(ctx,600,150,1240,D11_HIST,{a:fin(t,tV-0.5,0.5)*(1-fin(t,f0+0.1,0.6)),rows:D11_HIST.map((_,i)=>fin(t,w("repo","who changed")-0.3+i*0.22,0.5)),nov:fl>0});
  // they fly down and round, under the side panel, the oldest first, each to its place on the line
  if(fl>0&&la<1)D11_HIST.forEach(([v],i)=>{const x0=660,y0=288+i*64,x1=120+(3-i)*90,y1=756,u=ease(clamp((t-f0-(3-i)*0.15)/1.1,0,1)),k=1-u;if(u<=0)return;withA(ctx,1-la,()=>T(ctx,v,k*k*x0+2*k*u*(x0-20)+u*u*x1,k*k*y0+2*k*u*800+u*u*y1,{f:"mono",w:500,size:28,align:"center",color:rgba(mix(mix(EAC,INK,0.3),TRUST,i===0?1:0),1)}));});
  const approved=w("owner","obligations")+0.8,vA=fin(t,f0+0.4,0.6),vn=4+fin(t,approved+0.4,0.6);
  if(vA>0.01){withA(ctx,vA,()=>T(ctx,"every version, kept",300,700,{w:700,size:28,align:"center",color:rgba(EAC,1)}));d11_vline(ctx,120,790,360,D11_VERS,{a:vA,n:vn,la,warn:D11_VERS.map((_,i)=>fin(t,tW+0.6+i*0.25,0.4))});}
  // a change, proposed as a draft, line by line; once approved it folds to its title
  const D=[["-","heat: red"],["+","heat: amber"],["+","evidence: MSR-002, 18 working days · Aug 2027"],[" ","reported to the regulator: OBL-006"]];
  const rows=D.map((_,i)=>fin(t,w("pr","proposed")-0.2+i*0.35,0.6)),rev=[["Grace Achieng","network",fin(t,w("owner","Grace")+0.6,0.5),fin(t,w("owner","Grace")-0.2,0.5)],["Ama Owusu","obligations",fin(t,w("owner","Ama")+0.7,0.5),fin(t,w("owner","Ama")-0.2,0.5)]];
  if(t>tP)arrive(ctx,1220,360,t,tP+0.05,()=>d11_pr(ctx,600,100,1240,"Connect customers: amber","strategy/CAP-004.yml",{diff:D,rows,rev,state:t>approved?"approved · v2.8":"draft",stateCol:t>approved?TRUST:EAC,glow:pulseAt(t,approved,1.4),fold:clamp((t-(tC-0.9))/0.9,0,1)}),{dy:-16});
  // the last line: the number is reported to the regulator under an obligation, so its owner reviews too
  withA(ctx,pulseAt(t,w("owner","Ama"),2.0),()=>{ctx.fillStyle=rgba(MOT,0.12);rr(ctx,614,276+3*50,1212,46,6);ctx.fill();});
  // checks on the map itself, on every change
  const CK=[["every element has an owner",t>tW+0.2?2:0,t>tW+0.2?"generate power":"",fin(t,w("list","Every element"),0.5)],["every rule has a reason and a home",t>w("list","Every rule")+1.4?1:0,"",fin(t,w("list","Every rule"),0.5)],["every measure has a definition",t>w("list","Every measure")+1.4?1:0,"",fin(t,w("list","Every measure"),0.5)]];
  if(t>tC-0.3)arrive(ctx,1220,400,t,tC-0.3,()=>d11_checks(ctx,600,262,1240,CK,{t,glow:pulseAt(t,tW+0.2,1.6)}),{dy:-14});
  withA(ctx,fin(t,tC+0.2,0.5)*(1-fin(t,w("list","Every element")-0.3,0.4)),()=>T(ctx,"running on every change…",1220,412,{w:700,size:30,align:"center",color:rgba(SOFT,0.9)}));
  // the element the check finds: generate power, with no owner
  const gA=fin(t,tW+0.5,0.5);if(gA>0.01){arrowTo(ctx,1700,404,1700,590,AMBER,gA,{p:fin(t,tW+0.3,0.6)});arrive(ctx,1450,710,t,tW+0.5,()=>d11_file(ctx,1060,600,780,"strategy/CAP-009.yml",[["id","CAP-009"],["name","generate power"],["owner","none",{vcol:AMBER,hiCol:AMBER}]],{col:STR,hi:[0,0,fin(t,tW+1.0,0.6)]}),{dy:-12});}
  ctx.restore();vign(ctx,S);});

/* ---------- 6. One map, many views ---------- */
const D11_READERS=["architects","everyone","data teams","machines","owners","the board"];
// where view k sits: first a wide card in a column, then (as u goes 0..1) a chip in a narrower column, with dbt and Databricks below
function d11_vrect(k,u){const A=[800,130+k*120,1040,104],B=[1456,112+k*86,384,72];return k>5?B:A.map((v,i)=>lerp(v,B[i],u));}
scene("views",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tG=c("gen"),tRd=c("readers"),tD=c("dbt"),tX=c("dbx"),tN=c("nobody");
  ctx.save();focus(ctx,t,[[0,960,540,1.0]],1.8);
  // the fix: a pencil tries the glossary, then goes to the map; every view follows
  const pIn=tN-0.3,pBlock=w("nobody","edits")+0.15,pGo=w("nobody","fix")-0.3,pAt=pGo+0.9,pul=pAt+0.15;
  d11_tree(ctx,80,150,440,{p:1,hi:D11_TREE.map((_,i)=>i===3?fin(t,pAt-0.1,0.3)*(1-fin(t,pul+2.2,0.8)):0)});
  const u=ease(clamp((t-(tD-1.5))/1.5,0,1)),sx=522,sy=401,oneWay=w("gen","one way");
  const named=["ArchiMate","glossary","conceptual","ontology","tests","heat"].map(s_=>w("list",s_));
  // the threads, one way, from the map to every view
  for(let k=0;k<8;k++){const[x,y,cw,ch]=d11_vrect(k,u),tp=k<6?fin(t,tG+0.4+k*0.15,1.0):fin(t,(k===6?tD:tX)-0.3,0.8);if(tp<=0.01)continue;
    const p1=(t-(oneWay-0.2+k*0.12))/1.0,p2=(t-(pul+k*0.07))/0.9;d11_thread(ctx,sx,sy,x-8,y+ch/2,tp,EAC,{a:0.5,pulse:p1>0&&p1<1?p1:p2>0&&p2<1?p2:null});}
  const gT=fin(t,tN-0.9,0.6);if(gT>0.01){const p2=(t-(pul+0.2))/0.9;d11_thread(ctx,sx,sy,552,422,gT,EAC,{a:0.5,pulse:p2>0&&p2<1?p2:null});}
  withA(ctx,fin(t,oneWay-0.3,0.5)*(1-u),()=>T(ctx,"generated from the map · one way",800,100,{f:"mono",w:500,size:28,color:rgba(EAC,1)}));
  // the views: named one by one, each with who reads it; then a column of chips, with dbt and Databricks
  for(let k=0;k<8;k++){const ap=k<6?fin(t,tG+0.9+k*0.15,0.5):fin(t,(k===6?tD:tX)-0.2,0.5);if(ap<=0.01)continue;const[x,y,cw,ch]=d11_vrect(k,u);
    const arr=pul+k*0.07+0.9,hi=k===6?fin(t,tD,0.4)*(1-fin(t,tX-0.6,0.4)):k===7?fin(t,tX,0.4)*(1-fin(t,tN-1.2,0.4)):k===1?fin(t,tN-0.9,0.4):0;
    d11_vcard(ctx,k,x,y,cw,ch,{a:k<6?lerp(0.4,1,fin(t,named[k]-0.2,0.4))*ap:ap,fill:k<6?fin(t,named[k]-0.2,0.4):1,reader:D11_READERS[k],rd:k<6?fin(t,tRd+0.2+k*0.25,0.4)*(1-clamp(u*3,0,1)):0,hi,fl:pulseAt(t,arr,1.1)});}
  // dbt: each model carries its owner, its domain and the IDs of its rules
  const dA=fin(t,tD+0.05,0.5)*(1-fin(t,tX-0.6,0.4));if(dA>0.01)arrive(ctx,980,410,t,tD+0.05,()=>d11_dbt(ctx,560,180,840,{a:dA,lit:[0,0,0,0,0,fin(t,w("dbt","owner")-0.1,0.4),fin(t,w("dbt","domain")-0.1,0.4),fin(t,w("dbt","IDs")-0.1,0.4)]}),{dy:-14});
  // Databricks: each table shows its owner, its tags and its description, beside its lineage
  const xA=fin(t,tX+0.05,0.5)*(1-fin(t,tN-1.2,0.4));if(xA>0.01)arrive(ctx,980,440,t,tX+0.05,()=>d11_dbx(ctx,560,170,840,{a:xA,h:540,lit:{owner:fin(t,w("dbx","owner")-0.1,0.4),tags:fin(t,w("dbx","tags")-0.1,0.4),desc:fin(t,w("dbx","description")-0.1,0.4),lineage:fin(t,w("dbx","lineage")-0.1,0.4)}}),{dy:-14});
  // nobody edits a view: the glossary says where it comes from, and the pencil can't change it
  if(gT>0.01){const fx=clamp((t-(pul+1.1))/0.8,0,1);arrive(ctx,980,420,t,tN-0.9,()=>d11_gloss(ctx,560,220,840,{a:gT,hi:fin(t,pIn+0.4,0.4)*(1-fin(t,pGo,0.4)),fix:fx,glow:pulseAt(t,pul+1.1,1.2)}),{dy:-14});
    const bk=fin(t,pBlock,0.3)*(1-fin(t,pGo+0.2,0.4));if(bk>0.01)withA(ctx,bk,()=>{const cx=1040,cy=356;glass(ctx,cx-20,cy-20,40,40,20,D11_RED,{glow:12,ea:0.9,fill:"rgba(30,8,10,0.95)"});ctx.strokeStyle=rgba(D11_RED,1);ctx.lineWidth=3.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx-8,cy-8);ctx.lineTo(cx+8,cy+8);ctx.moveTo(cx+8,cy-8);ctx.lineTo(cx-8,cy+8);ctx.stroke();tag(ctx,cx+34,cy,"read only",D11_RED,{size:28});});}
  // the pencil: to the glossary, then to the map
  const pa=fin(t,pIn,0.4)*(1-fin(t,pAt+0.9,0.4));if(pa>0.01){const g1=ease(clamp((t-pIn)/0.8,0,1)),g2=ease(clamp((t-pGo)/0.9,0,1)),sh=t>pBlock&&t<pBlock+0.4?Math.sin((t-pBlock)*60)*5*(1-(t-pBlock)/0.4):0;
    const x=lerp(lerp(1200,1006,g1),372,g2)+sh,y=lerp(lerp(560,400,g1),446,g2)-Math.sin(g2*Math.PI)*90;d11_pencil(ctx,x,y,1.3,pa,-0.75);}
  ctx.restore();vign(ctx,S);});

/* ---------- 7. An agent reads it ---------- */
scene("reads",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tA=c("now"),tQ=c("request"),tCh=c("change"),tK=c("column"),tI=c("cites");
  ctx.save();focus(ctx,t,[[0,960,540,1.0]],1.8);
  const RY=i=>270+i*56;// the middle of each row in the side panel
  // the agent walks the layers for the change, then goes to the rules for the column
  const walk0=w("change","walks")-0.3,wp=clamp((t-walk0)/2.8,0,1),toTop=ease(clamp((t-(tCh-0.2))/0.8,0,1)),toRule=ease(clamp((t-(tK+0.2))/0.9,0,1));
  const AY=t<tK?lerp(lerp(420,RY(0),toTop),RY(5),ease(wp)):lerp(RY(5),RY(0),toRule),busy=fin(t,w("request","applies")-0.2,0.4)*(1-fin(t,w("request","decision"),0.5))+fin(t,walk0,0.3)*(1-fin(t,walk0+2.9,0.4))+fin(t,tK+0.2,0.3)*(1-fin(t,w("column","rule")+0.5,0.5));
  const hiRow=D11_TREE.map((_,i)=>{const pass=t>=walk0&&t<walk0+3.2&&i<6?clamp(1-Math.abs(AY-RY(i))/56,0,1):0;return Math.max(pass,i===0?fin(t,w("column","rule")-0.3,0.4)*(1-fin(t,tI+1.0,0.6)):0);});
  d11_tree(ctx,80,150,440,{p:1,hi:hiRow});
  // the agent arrives, and reads the map
  const ag=fin(t,tA-0.3,0.8);if(ag>0.01){const sw=fin(t,tA+0.3,0.6)*(1-fin(t,tQ+0.4,0.5)),one=t>=walk0-0.2&&t<tCh+7.4||t>tK+0.2;
    kt_scan(ctx,570,AY,300,one?AY:400,Math.max(sw,busy*0.9)*ag,t,{w:one?24:230});
    arrive(ctx,600,AY,t,tA-0.3,()=>kt_agent(ctx,600,AY,30,t,{busy}),{dy:0,from:0.6});
    withA(ctx,fin(t,tA+0.2,0.5)*(1-fin(t,tQ-0.2,0.4)),()=>T(ctx,"an agent",600,AY+80,{w:700,size:28,align:"center",color:rgba(KT_AI,1)}));}
  // a request: the skipper's test, then the decision, the capability and the owner, or nothing
  const q1=fin(t,tQ-0.1,0.5)*(1-fin(t,tCh-0.7,0.5));if(q1>0.01){
    arrive(ctx,1270,182,t,tQ-0.1,()=>d11_ask(ctx,700,120,1140,"a request","Which streets can take more solar?",{a:q1}),{dy:-14});
    withA(ctx,q1*fin(t,w("request","skipper's")-0.2,0.5),()=>{T(ctx,"the skipper's test",720,292,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});T(ctx,"who will decide what with the answer, and when?",720+tw(ctx,"the skipper's test",28,500,"mono")+22,292,{w:700,size:28,color:rgba(INK,0.92)});});
    const TR=[["decision","decision","approve a solar connection",D11_KIND.decision[1]],["capability","capability","assess network capacity",STR],["actor","owner","Grace Achieng",TRUST]];
    if(t>w("request","decision")-0.4)arrive(ctx,1270,450,t,w("request","decision")-0.4,()=>d11_trace(ctx,700,320,1140,TR,{a:q1,rows:[fin(t,w("request","decision")-0.1,0.4),fin(t,w("request","capability")-0.1,0.4),fin(t,w("request","owner")-0.1,0.4)]}),{dy:-12});
    const nA=fin(t,w("request","nothing")-1.0,0.5);if(nA>0.01){arrive(ctx,1270,682,t,w("request","nothing")-1.0,()=>d11_ask(ctx,700,620,1140,"a request","A live outage dashboard for the lobby",{a:q1*nA,size:32}),{dy:-12});
      const nn=fin(t,w("request","nothing")-0.1,0.4)*q1;if(nn>0.01){kt_rcross(ctx,1560,682,17,nn);withA(ctx,nn,()=>T(ctx,"reaches nothing",1590,692,{w:700,size:28,color:rgba(SOFT,1)}));}}}
  // a change: the agent walks the layers and lists the owners who must agree
  const q2=fin(t,tCh-0.1,0.5)*(1-fin(t,tK-0.7,0.5));if(q2>0.01){
    arrive(ctx,1270,182,t,tCh-0.1,()=>d11_ask(ctx,700,120,1140,"a change","Time-of-use prices, from April",{a:q2,note:"as for the social tariff",noteA:fin(t,w("change","social")-0.2,0.5)}),{dy:-14});
    const H=[[0,"obligation","OBL-009","tariffs the regulator approves","Ama Owusu"],[2,"step","STP-005","bill","head of retail"],[3,"object","OBJ-003","reading, every half hour","Grace Achieng"],[5,"node","TEC-002","meter network","Grace Achieng"]];
    H.forEach(([row,kind,id,nm,ow],i)=>{const at=walk0+row/5*2.8,ha=fin(t,at,0.4)*q2;if(ha<=0.01)return;const y=300+i*86;d11_thread(ctx,522,RY(row),694,y+35,fin(t,at,0.5),D11_TREE[row][1],{a:0.55*q2});
      arrive(ctx,1270,y+35,t,at,()=>d11_hit(ctx,700,y,1140,kind,id,nm,ow,{a:ha}),{dy:-10});});
    const oA=fin(t,w("change","owners")-0.3,0.5)*q2;if(oA>0.01)arrive(ctx,1270,715,t,w("change","owners")-0.3,()=>d11_agree(ctx,700,660,1140,["head of retail","Grace Achieng","Ama Owusu"],{a:oA,rows:[0,1,2].map(i=>fin(t,w("change","owners")+i*0.3,0.4))}),{dy:-10});}
  // a column: the rule behind it, with its owner and its reason; then the answer, which cites them
  const q3=fin(t,tK-0.1,0.5);if(q3>0.01){
    arrive(ctx,1270,210,t,tK-0.1,()=>d11_col(ctx,700,120,1140,{a:q3,hi:fin(t,tK+0.4,0.5)}),{dy:-14});
    // (the rule's page gives way at the click, then its source opens in its place)
    const rA=fin(t,w("column","rule")-0.3,0.5),sO=fin(t,w("cites","check")-0.25,0.35);if(rA*(1-sO)>0.01){d11_thread(ctx,522,RY(0),694,470,rA,D11_RULE,{a:0.55*(1-sO)});
      arrive(ctx,1270,470,t,w("column","rule")-0.3,()=>d11_file(ctx,700,330,1140,"motivation/RUL-020.yml",[["id","RUL-020"],["name","every reading is marked actual or estimated"],["owner","Grace Achieng",{tick:1}],["evidence","metering rules 7.2 · 14 Mar 2027"]],{col:D11_RULE,a:rA*(1-sO),rows:[0,1,2,3].map(i=>fin(t,w("column","rule")-0.1+i*0.2,0.4)),hi:[0,0,fin(t,w("column","owner")-0.1,0.4)*(1-fin(t,tI,0.6)),fin(t,w("column","reason")-0.1,0.4)*(1-fin(t,tI,0.6))]}),{dy:-12});}
    const aA=fin(t,tI-0.3,0.5);if(aA>0.01){let link=[0,0];const ck=w("cites","check");
      arrive(ctx,1270,722,t,tI-0.3,()=>d11_answer(ctx,700,640,1140,{a:aA,t,ul:fin(t,w("cites","IDs")-0.1,0.5),chk:fin(t,ck+0.9,0.4),glow:pulseAt(t,ck+0.9,1.2),linkAt:(lx,ly)=>{link=[lx,ly];}}),{dy:-12});
      // a person can check it: open the source, and it says what the answer says
      const cA=fin(t,w("cites","person")-0.5,0.4)*(1-fin(t,ck+1.6,0.5)),cm=ease(clamp((t-(w("cites","person")-0.5))/0.9,0,1));d11_cursor(ctx,lerp(1500,link[0],cm),lerp(880,link[1]+6,cm),1.3,cA,clamp((t-(ck-0.1))/0.5,0,1));
      const sA=fin(t,ck,0.4);if(sA>0.01)arrive(ctx,1270,470,t,ck,()=>d11_source(ctx,960,360,620,220,t,{a:sA,hl:clamp((t-(ck+0.5))/0.6,0,1)}),{dy:-10});}}
  ctx.restore();vign(ctx,S);});

/* ---------- 8. An agent on the map ---------- */
scene("rights",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tOn=c("on"),tM=c("may"),tAs=c("asks"),tO=c("owner"),tS=c("same");
  ctx.save();focus(ctx,t,[[0,960,540,1.0]],1.8);
  // the agent goes into the map, as software in its application layer
  const f0=tOn-0.2,f1=w("on","map itself")+0.2,fu=ease(clamp((t-f0)/(f1-f0),0,1)),land=fin(t,f1-0.1,0.4);
  d11_tree(ctx,80,150,440,{p:1,plus:[0,0,0,0,land,0,0],hi:D11_TREE.map((_,i)=>i===4?pulseAt(t,f1,1.6)*0.9+fin(t,tS+0.4,0.5)*0.5:0)});
  const ox=lerp(600,404,fu),oy=lerp(270,494,fu)-Math.sin(fu*Math.PI)*60;kt_agent(ctx,ox,oy,lerp(30,12,fu),t,{busy:fu<1?0.6:0});
  // its page: software, an application component, filling a role, with its rights written down
  const fA=fin(t,w("on","software")-0.4,0.5),rl=w("on","role"),rw=w("on","rights"),own=w("owner","Tomás"),FY=84;
  if(fA>0.01){d11_thread(ctx,522,494,694,300,fA,APL,{a:0.5});
    const L=[["id","APP-030"],["name","map agent"],["kind","application component"],["assigned to","ROL-009 · map drafter"],["rights",""],[null,"may: read everything, draft changes",{ind:1,vcol:mix(D11_OK,INK,0.35),hiCol:D11_OK}],[null,"may not: confirm a change",{ind:1,vcol:mix(D11_RED,INK,0.35),hiCol:D11_RED}],
      [null,"asks: the owner, when sources disagree",{ind:1,vcol:mix(TRUST,INK,0.35),hiCol:TRUST}],["owner","Tomás Herrera",{tick:fin(t,own+0.5,0.4)}],["evidence","DEC-015 · an agent for the map · Sep 2027"],["status","confirmed",{from:"draft",u:clamp((t-own-0.8)/0.6,0,1),tick:fin(t,own+1.3,0.4)}]];
    const rows=L.map((_,i)=>i<3?fin(t,w("on","software")-0.2+i*0.2,0.4):i===3?fin(t,rl-0.1,0.4):i<8?fin(t,rw-0.3+(i-4)*0.25,0.4):i===8?fin(t,own-0.2,0.5):fin(t,rw+0.9+(i-9)*0.2,0.4));
    const hi=L.map((_,i)=>i===3?fin(t,rl,0.4)*(1-fin(t,rw-0.2,0.5)):i===5?fin(t,w("may","read")-0.2,0.4)*(1-fin(t,tAs-0.3,0.5)):i===6?fin(t,w("may","may not")-0.1,0.4)*(1-fin(t,tAs-0.3,0.5)):i===7?fin(t,tAs,0.4)*(1-fin(t,tO-0.3,0.5)):i===8?fin(t,own-0.2,0.4)*(1-fin(t,tS-0.3,0.5)):0);
    arrive(ctx,1270,390,t,w("on","software")-0.4,()=>d11_file(ctx,700,FY,1140,"application/APP-030.yml",L,{col:APL,a:fA,rows,hi,glow:pulseAt(t,own+1.3,1.2)}),{dy:-14});
    // a tick for what it may do, a cross for what it may not
    const mk=(i,k,at)=>{const q=fin(t,at,0.4);if(q<=0.01)return;const yy=FY+66+i*48+48*0.66-10,xx=1790;if(k===0)withA(ctx,q,()=>tick_(ctx,xx,yy+2,30,D11_OK,1));else if(k===1)withA(ctx,q,()=>cross_(ctx,xx,yy,26,D11_RED,1));else withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(xx-14,yy);ctx.lineTo(xx+12,yy);ctx.moveTo(xx+3,yy-9);ctx.lineTo(xx+12,yy);ctx.lineTo(xx+3,yy+9);ctx.stroke();ctx.restore();});};
    mk(5,0,w("may","read"));mk(6,1,w("may","may not"));mk(7,2,tAs+0.2);}
  // like the outage agent's
  const oA=fin(t,w("on","outage")-0.5,0.5)*(1-fin(t,tAs-0.7,0.5));if(oA>0.01)arrive(ctx,1270,800,t,w("on","outage")-0.5,()=>d11_outage(ctx,700,724,1140,{a:oA}),{dy:-12});
  // where two sources disagree, it doesn't choose: it asks the owner
  const dA=fin(t,tAs-0.2,0.5)*(1-fin(t,tS-0.6,0.5));if(dA>0.01){d11_disagree(ctx,700,724,t,{a:dA,pa:fin(t,tAs-0.2,0.4),pb:fin(t,tAs+0.2,0.4),ne:fin(t,w("asks","disagree")-0.1,0.4)});
    const qA=fin(t,w("asks","owner")-0.4,0.5)*dA;if(qA>0.01)arrive(ctx,1678,800,t,w("asks","owner")-0.4,()=>d11_question(ctx,1516,724,324,t,{a:qA,glow:pulseAt(t,w("asks","owner"),1.2)}),{dy:-12});}
  // agents draft, people confirm, every version is kept: the rule that keeps data models true, applied to the map
  const rA=fin(t,tS-0.3,0.5);if(rA>0.01)arrive(ctx,1270,800,t,tS-0.3,()=>d11_rule3(ctx,700,724,1140,t,{a:rA,rows:[fin(t,w("same","Agents")-0.1,0.4),fin(t,w("same","people")-0.1,0.4),fin(t,w("same","every version")-0.1,0.4)],sw:clamp((t-(w("same","applied")-0.1))/0.6,0,1),glow:pulseAt(t,w("same","applied")+0.4,1.4)}),{dy:-12});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. People confirm ---------- */
const D11_VERS2=[["v2.9","1 Oct"],["v3.0","14 Jan"],["v3.1","4 Feb"]];
scene("confirm",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tCo=c("code"),tCl=c("clause"),tF=c("finds"),tD=c("drafts"),tC=c("confirms"),tV=c("track");
  ctx.save();focus(ctx,t,[[0,960,540,1.0]],1.8);
  // the agent leaves application/ to search the rules; then signs its draft
  const out=ease(clamp((t-(tF-0.6))/0.8,0,1)),toPR=ease(clamp((t-(tD-0.3))/0.9,0,1)),scan=fin(t,tF+0.2,0.4)*(1-fin(t,w("finds","reason")+0.3,0.5));
  d11_tree(ctx,80,150,440,{p:1,plus:[0,0,0,0,1,0,0],hi:D11_TREE.map((_,i)=>i===0?scan:0)});
  const ox=lerp(lerp(404,600,out),742,toPR),oy=lerp(lerp(494,270,out),396,toPR)-Math.sin(toPR*Math.PI)*50,orr=lerp(lerp(12,26,out),14,toPR);
  if(scan>0.01)kt_scan(ctx,ox-26,oy,320,270,scan,t,{w:26});
  // the regulator changes the retail code: a sentence added to clause 4.2, written in as it's read
  const pA=fin(t,tCo-0.2,0.6);if(pA>0.01)arrive(ctx,1270,209,t,tCo-0.2,()=>d11_code(ctx,700,84,1140,250,t,{a:pA,hl:fin(t,tCl,0.6)*(1-fin(t,tD-0.4,0.6)),nw:clamp((t-(tCl-0.1))/(w("clause","not")-tCl),0,1)}),{dy:-16});
  // the one rule whose reason is that clause: retail's half of day one's rule
  const fA=fin(t,w("finds","one rule")-0.3,0.5)*(1-fin(t,tD-0.6,0.5));if(fA>0.01){d11_thread(ctx,522,270,694,520,fA,D11_RULE,{a:0.5});
    const L=[["id","RUL-022"],["definition",""],[null,"A bill based on a replaced estimate",{ind:1}],[null,"is corrected on the next bill.",{ind:1}],["owner","head of retail",{tick:1}],["evidence","retail code 4.2 · Jul 2026"],["status","confirmed",{tick:1}]];
    const ev=fin(t,w("finds","reason")-0.2,0.4);
    arrive(ctx,1270,560,t,w("finds","one rule")-0.3,()=>d11_file(ctx,700,350,1140,"motivation/RUL-022.yml",L,{col:D11_RULE,a:fA,rows:L.map((_,i)=>fin(t,w("finds","one rule")-0.1+i*0.15,0.4)),hi:[0,0,0,0,fin(t,w("finds","retail's")-0.2,0.4),ev,0]}),{dy:-12});
    if(ev>0.01)arrowTo(ctx,1560,334,1230,668,AMBER,ev*fA*0.9,{p:clamp((t-(w("finds","reason")-0.2))/0.6,0,1),bend:-0.18});
    const pr=fin(t,w("finds","half")-0.4,0.5)*fA;if(pr>0.01)arrive(ctx,1270,825,t,w("finds","half")-0.4,()=>d11_hit(ctx,700,790,1140,"rule","RUL-021","its pair, the network's half","Grace Achieng",{a:pr}),{dy:-10});}
  // the draft: the rule's new words; and what they touch, the billing team's tracking table and two views
  const dA=fin(t,tD-0.1,0.5),conf=w("confirms","confirms")+0.1,merged=t>conf+0.6;
  if(dA>0.01){const D=[["-","is corrected on the next bill."],["+","is corrected within ten working days."],["-","evidence: retail code 4.2 · Jul 2026"],["+","evidence: retail code 4.2 · Jan 2028"]];
    arrive(ctx,1270,548,t,tD-0.1,()=>d11_pr(ctx,700,350,1140,"RUL-022: corrected within ten working days","motivation/RUL-022.yml",{a:dA,kicker:"      drafted by the map agent",diff:D,rows:D.map((_,i)=>fin(t,w("drafts","new words")-0.3+i*0.3,0.6)),state:merged?"confirmed · v3.1":"waiting for the head of retail",stateCol:merged?TRUST:AMBER,glow:pulseAt(t,conf,1.4),fold:clamp((t-(tV-0.7))/0.9,0,1)}),{dy:-14});
    const tTb=w("drafts","tracking table"),tTv=w("drafts","two views"),tA=fin(t,w("drafts","what they touch")-0.3,0.4)*(1-fin(t,tV-0.8,0.5));
    if(tA>0.01)d11_touches(ctx,700,790,[[4,"bills to correct"],[2,"meter to cash"],[3,"ontology"]],{a:tA,rows:[fin(t,tTb-0.2,0.4),fin(t,tTv-0.2,0.4),fin(t,tTv+0.15,0.4)]});
    // the head of retail, who owns the rule, confirms it
    kt_rstamp(ctx,1600,610,"confirmed · head of retail",TRUST,fin(t,conf,0.3)*(1-fin(t,tV-0.8,0.5)),clamp((t-conf)/0.35,0,1),{size:30});}
  kt_agent(ctx,ox,oy,orr,t,{busy:scan>0.3||(toPR>0&&toPR<1)?0.8:0});
  // the map's new version, as the head of retail confirms it: every version is kept
  const vA=fin(t,conf+0.4,0.5);if(vA>0.01){withA(ctx,vA,()=>T(ctx,"every version, kept",300,700,{w:700,size:28,align:"center",color:rgba(EAC,1)}));d11_vline(ctx,120,790,360,D11_VERS2,{a:vA,n:2+fin(t,conf+0.9,0.6)});}
  // from the next morning, the billing team's tracking table shows each bill not corrected within ten working days
  const tK=w("track","tracking table"),bA=fin(t,tK-0.4,0.5);if(bA>0.01)arrive(ctx,1270,678,t,tK-0.4,()=>d11_track(ctx,700,494,1140,{a:bA,sw:clamp((t-(w("track","within")-0.1))/0.8,0,1),late:fin(t,w("track","working days")+0.2,0.5),rows:[0,1,2].map(i=>fin(t,w("track","each bill")-0.2+i*0.2,0.5)),glow:pulseAt(t,w("track","working days")+0.4,1.2)}),{dy:-12});
  ctx.restore();vign(ctx,S);});

/* ---------- 10. Day one, again ---------- */
scene("again",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tSp=c("spring"),tD=c("day"),tM=c("map"),tA=c("asks"),tG=c("gets"),tF=c("first");
  ctx.save();focus(ctx,t,[[0,1540,640,1.35],[w("day","badge")-1.4,960,540,1.0]],1.8);
  // her desk, as Tomás's was: a badge, a page of acronyms, a list of systems; and this time, the map
  const desk=fin(t,0.2,1.0),dk=1-fin(t,tA-0.7,0.6);
  const ex=t>tG+0.6?"relieved":t>w("day","list")&&t<tM+0.4?"concerned":"calm",pose=t>tF+0.4&&t<tF+3.0?"explain":"stand";
  withA(ctx,desk,()=>{arrive(ctx,1560,700,t,tSp-0.2,()=>d11_personR(ctx,"zofia",1560,1010,0.95,{t,expr:ex,pose}),{dy:20});
    const g=ctx.createLinearGradient(0,790,0,H);g.addColorStop(0,"rgba(30,38,58,0.99)");g.addColorStop(1,"rgba(10,14,24,1)");ctx.fillStyle=g;ctx.fillRect(-400,790,W+800,320);ctx.fillStyle="rgba(150,180,230,0.25)";ctx.fillRect(-400,790,W+800,2);});
  if(dk>0.01)withA(ctx,dk,()=>{
    arrive(ctx,260,560,t,w("day","badge")-0.2,()=>d11_badge(ctx,260,560,0.9),{dy:-40});
    arrive(ctx,630,500,t,w("day","acronyms")-0.2,()=>d11_acr(ctx,420,380,420,250,t),{dy:-40});
    arrive(ctx,1070,560,t,w("day","list")-0.2,()=>d11_sys(ctx,880,370,380,400,{scroll:Math.max(0,t-w("day","list"))*1.6,count:Math.round(clamp((t-w("day","list"))/1.6,0,1)*138)}),{dy:-40});
    // this time, there's also a map
    arrive(ctx,630,560,t,tM-0.2,()=>d11_mapCard(ctx,420,646,420,138,{title:"the map · v3.4",glow:pulseAt(t,w("map","map"),1.8)*1.4}),{dy:-30,from:0.9});});
  // she asks the agent, and back come an owner and two rules, each with its reason and a link
  const cA=fin(t,tA-0.4,0.5)*(1-fin(t,tF-0.7,0.5));if(cA>0.01){const ans=w("gets","owner");
    arrive(ctx,820,410,t,tA-0.4,()=>d11_chat(ctx,360,150,920,520,t,{a:cA,q:clamp((t-(tA+0.1))/2.6,0,1),dots:clamp((t-(tA+2.8))/(ans-tA-2.8),0,1),busy:t>tA+2.8&&t<ans?1:0,rows:[fin(t,ans-0.2,0.4),fin(t,w("gets","two rules")-0.1,0.4),fin(t,w("gets","two rules")+0.4,0.4)],ul:fin(t,w("gets","links")-0.1,0.5)}),{dy:-16});}
  // by the afternoon, her first change, for Grace to confirm
  const pA=fin(t,tF-0.3,0.5);if(pA>0.01){withA(ctx,pA,()=>tag(ctx,360,214,"3:40 pm · day one",EAC,{size:28}));
    arrive(ctx,820,400,t,tF-0.3,()=>d11_pr(ctx,360,260,920,"OBJ-003 reading: a 30-minute interval","information/OBJ-003.yml",{a:pA,kicker:"drafted by Zofia Nowak",diff:[["+","interval: 30 minutes"],["+","evidence: DEC-018 · time-of-use · Mar 2028"]],rows:[fin(t,w("first","drafted")-0.1,0.6),fin(t,w("first","drafted")+0.4,0.6)],state:"waiting for Grace Achieng",stateCol:AMBER,glow:pulseAt(t,w("first","Grace")+0.3,1.4)}),{dy:-14});}
  ctx.restore();eaYear(ctx,80,80,"spring 2028",EAC,fin(t,tSp,0.6)*(1-fin(t,tA-0.6,0.6)));vign(ctx,S);});

/* ---------- 11. Still sailing ---------- */
// 2007: five Hawaiian navigators sail to Satawal, and Mau makes them master navigators, with eleven more round him. Each Hawaiian
// light starts by an island ([island, dx, dy]; Nainoa's, the middle one, from Oʻahu) and takes its place in an arc above Mau's.
const D11_PWO=[[-62,-24],[-32,-44],[0,-52],[32,-44],[62,-24]],D11_FROM=[["Hawaiʻi",-10,-14],["Maui",10,-16],["Oʻahu",-4,-14],["Molokaʻi",4,16],["Hawaiʻi",18,14]];
// the Hawaiian navigators who stay at home in 2007
const D11_STAY=[["Kauaʻi",-10,10],["Oʻahu",-18,12],["Maui",-6,20]];
// the people the five taught, two each, and some of the people those taught: [x, y, teacher's x, y, generation, delay], from the five's homes
const D11_GEN=(()=>{const G=[],F=D11_FROM.map(([n,dx,dy])=>{const[x,y]=d11_pac(n);return[x+dx,y+dy];});
  F.forEach(([x,y],i)=>[0,1].forEach(j=>{const an=hash(i*2+j,601)*TAU,r=30+16*hash(i*2+j,602),sx=x+Math.cos(an)*r,sy=y+Math.sin(an)*r*0.75;G.push([sx,sy,x,y,1,i*0.22+j*0.3]);
    if(hash(i*2+j,603)<0.7){const a2=an+(hash(i*2+j,604)-0.5)*1.6,r2=22+10*hash(i*2+j,605);G.push([sx+Math.cos(a2)*r2,sy+Math.sin(a2)*r2*0.75,sx,sy,2,1.1+i*0.18+j*0.25]);}}));return G;})();
scene("sailing",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tD=c("died"),tN=c("now"),tMa=w("pwo","master"),tDi=w("died","died"),tL=w("died","What he"),tF=w("now","first voyage"),tH=w("now","Hōkūleʻa");
  const sea=fin(t,tH-0.4,1.0);
  // the chart: Satawal in 2007 and in 2010; then the five go home, and what Mau taught passes on
  if(sea<0.99){d11_chartBg(ctx,S);ctx.save();
    const CK=[[0,860,260,1.25],[w("pwo","Mau made")-0.5,362,350,2.3],[tL,860,250,1.15],[tL+1.6,1365,140,2.6]],z=focusZ(t,CK,1.9);focus(ctx,t,CK,1.9);
    d11_chart(ctx,t,{z,labH:fin(t,0.4,0.6)*(1-fin(t,w("pwo","Mau made")-0.6,0.5))});
    const[sx,sy]=d11_pac("Satawal"),isl=(n,dx,dy)=>{const[x,y]=d11_pac(n);return[x+dx,y+dy];};
    // Mau, on Satawal; in 2010 his light fades to a ring, which stays
    d11_light(ctx,sx,sy,5.5,t,{k:fin(t,0.2,0.8),dim:fin(t,tDi-0.1,1.6)});
    d11_name(ctx,"Mau Piailug",sx,sy+20+52/z,"center",fin(t,w("pwo","Mau")-0.1,0.6)*(1-fin(t,tL,0.6)),{size:32/z});
    // the pwo: light rings out from Mau as they become master navigators; eleven more round him, who stay on Satawal
    const pw=clamp((t-tMa+0.1)/1.6,0,1);if(pw>0&&pw<1)ring(ctx,sx,sy,8+pw*80,D11_KNOW,0.75*(1-pw),2.4/z);
    for(let i=0;i<11;i++){const an=-Math.PI/2+(i+0.5)*TAU/11;d11_light(ctx,sx+Math.cos(an)*24,sy+Math.sin(an)*20,2.6,t,{k:fin(t,tMa+0.2+i*0.05,0.5)});}
    // the Hawaiians who stay at home; the five who sail to Satawal, and home again
    D11_STAY.forEach(([n,dx,dy],i)=>{const[x,y]=isl(n,dx,dy);d11_light(ctx,x,y,4,t,{k:fin(t,0.3+i*0.1,0.6)});});
    let back=0;D11_FROM.forEach(([n,dx,dy],i)=>{const[hx,hy]=isl(n,dx,dy),px=sx+D11_PWO[i][0],py=sy+D11_PWO[i][1],t1=0.7+i*0.16,p1=(t-t1)/2.3,t2=tL+0.3+i*0.12,p2=(t-t2)/2.1,mst=fin(t,tMa+0.1+i*0.08,0.6);back=Math.max(back,t2+2.1);
      if(p1<=0)d11_light(ctx,hx,hy,4,t,{k:fin(t,0.4+i*0.1,0.6)});
      else{const tr=1-fin(t,t1+2.3,1.0);if(tr>0.01)withA(ctx,tr,()=>d11_pass(ctx,hx,hy,px,py,Math.min(p1,1),D11_KNOW,{bend:-0.14,trail:0.3}));}
      if(p1>=1&&p2<=0)d11_light(ctx,px,py,4.4,t,{k:fin(t,t1+2.2,0.4)*lerp(0.6,1,mst)});
      if(p2>0){const tr=1-fin(t,t2+2.1,1.0);if(tr>0.01)withA(ctx,tr,()=>d11_pass(ctx,px,py,hx,hy,Math.min(p2,1),D11_KNOW,{bend:0.14,trail:0.3}));if(p2>=1)d11_light(ctx,hx,hy,4.4,t,{k:1});}});
    d11_name(ctx,"Nainoa Thompson",sx,sy-52-30/z,"center",fin(t,w("pwo","Nainoa")-0.1,0.6)*(1-fin(t,tL-0.2,0.6)),{size:32/z});
    // home, each teaches others, and they teach others in turn
    D11_GEN.forEach(([x,y,x0,y0,g,dt])=>{const t0=back-0.3+dt,p=(t-t0)/0.9;if(p<=0)return;withA(ctx,1-fin(t,t0+0.9,1.2),()=>d11_pass(ctx,x0,y0,x,y,Math.min(p,1),D11_KNOW,{bend:0.35,trail:0.4}));d11_light(ctx,x,y,g===1?3.8:3.2,t,{k:fin(t,t0+0.8,0.4)});});
    d11_name(ctx,"Hawaiʻi",1290,124,"right",fin(t,back-0.2,0.6),{size:32/z});
    // that first voyage, from Maui towards Tahiti, fifty years ago
    const[mx,my]=d11_pac("Maui"),[tx,ty]=d11_pac("Tahiti"),pR=clamp((t-(tF-0.6))/3.0,0,1);if(pR>0){d11_pass(ctx,mx,my,tx,ty,pR,CLAY,{bend:-0.12,trail:0.8,lw:2.4/z});
      d11_name(ctx,"1976",mx+40/z,my+210/z,"left",fin(t,tF-0.2,0.5),{size:32/z,color:rgba(mix(CLAY,INK,0.3),1)});}
    ctx.restore();}
  // fifty years on: Hōkūleʻa at sea at dawn, navigated by people Mau taught, and by people they taught
  if(sea>0.01)withA(ctx,sea,()=>{setScreen(ctx,S);ctx.save();
    const t0=tH-0.4,cxN=640+(t-t0)*6,cyN=700,stern=cxN-282,tM=w("now","people Mau"),tT=w("now","people they");
    focus(ctx,t,[[0,cxN+80,560,1.0],[tM-0.7,stern+240,600,1.3],[tT+0.9,cxN+80,560,1.0]],1.8);
    const dawn=0.3+0.5*fin(t,t0,5.0);
    d11_sky(ctx,S,t,{dawn,turn:t*0.0016});d11_sea(ctx,t,{dawn});
    // the star compass round the canoe, as Nainoa Thompson teaches it: thirty-two equal houses
    const RA=0.85*fin(t,tH+0.2,1.0),rp=clamp((t-tH-0.2)/2.4,0,1);
    d11_compass(ctx,cxN,cyN+10,820,124,t,{a:RA,half:"back",p:rp,pts:rp,equal:true});
    d11_canoe(ctx,cxN,cyN,1.0,t,{lit:0.5+0.4*dawn,col:mix([170,200,240],[255,196,150],dawn),nav:fin(t,tM-0.2,0.8),app:fin(t,tT-0.2,0.8),crew:6});
    d11_compass(ctx,cxN,cyN+10,820,124,t,{a:RA,half:"front",p:rp,pts:rp,equal:true});
    ctx.restore();});
  // where and when
  setScreen(ctx,S);eaYear(ctx,80,80,"Satawal · 2007",CLAY,fin(t,0.4,0.6)*(1-fin(t,tD-0.6,0.5)));
  eaYear(ctx,80,80,"Satawal · 2010",CLAY,fin(t,tD-0.1,0.6)*(1-fin(t,tN-0.6,0.5)));
  eaYear(ctx,80,80,"Hōkūleʻa · 2026",CLAY,fin(t,tH-0.1,0.6));
  vign(ctx,S);});

/* ---------- 12. The map before the data ---------- */
const D11_FILMS=["Day one","Who it serves, and how it pays","Why it moves","What it must be able to do","How value reaches people","Who does it, and where meaning changes","Today, and where it's going","Now the questions appear","Rules with a home","When strategy moves","A map people and agents can read"];
// the layers each film adds to the map, as Day one showed them
const D11_ADDS=[[],[0],[0],[1],[2],[2,3],[4,5],[0,1],[3],[0,1,2,3,4,5],[3]];
const D11_ANS="A map stays alive while people use it, keep it true, and can pass it on.";
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tC=w("confirm","confirms"),tT=w("confirm","The map"),tPs=w("confirm","passes"),tA=c("answer"),tLy=c("layers"),tDa=c("data"),tO=c("over"),tIn=w("over","into");
  const wall=1-fin(t,tLy-0.8,1.0);setScreen(ctx,S);bg2(ctx);motes(ctx,t);if(wall>0.01)withA(ctx,wall,()=>wallBg(ctx,S,t));
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  if(wall>0.01)withA(ctx,wall,()=>{
    // Grace confirms Zofia's change, and a new version of the map goes out
    const ok=t>tC+0.5,pA=1-fin(t,tA-0.7,0.6);
    if(pA>0.01)arrive(ctx,600,385,t,0.1,()=>d11_pr(ctx,130,190,940,"OBJ-003 reading: a 30-minute interval","information/OBJ-003.yml",{a:pA,kicker:"drafted by Zofia Nowak",diff:[["+","interval: 30 minutes"],["+","evidence: DEC-018 · time-of-use · Mar 2028"]],rev:[["Grace Achieng","network",fin(t,tC+0.1,0.5),fin(t,c("confirm")-0.3,0.5)]],okWord:"confirmed",state:ok?"confirmed · v3.5":"waiting for Grace Achieng",stateCol:ok?TRUST:AMBER,glow:pulseAt(t,tC+0.5,1.4)}),{dy:-14});
    // the navigator's test, passed: someone else can sail by it
    d11_testCard(ctx,600,650,fin(t,tT-0.3,0.6)*pA,{mark:fin(t,tPs,0.5),pass:true,hi:pulseAt(t,tPs+0.2,1.6)});
    // Tomás's last note, from When strategy moves, and its answer, written out
    const tW=w("answer","answer:"),wr=clamp((t-w("answer","a map"))/4.4,0,1);
    arrive(ctx,660,240,t,tA-0.2,()=>sticky(ctx,660,240,660,150,D11_NOTE,{col:NOTEC[0],size:38,st:wr,rot:-0.025}),{dy:-20});
    arrive(ctx,700,540,t,tW-0.2,()=>sticky(ctx,700,540,800,290,D11_ANS,{col:NOTEC[0],size:42,p:wr,rot:0.012}),{dy:-24,from:1.06});
    // the people who keep it true
    arrive(ctx,1270,700,t,0.1,()=>d11_personR(ctx,"grace",1270,1030,0.8,{t,pose:t>tC-0.4&&t<tC+1.9?"explain":"stand"}),{dy:20});
    arrive(ctx,1540,700,t,0.3,()=>d11_personR(ctx,"zofia",1540,1030,0.84,{t,expr:ok?"relieved":"calm"}),{dy:20});
    arrive(ctx,1800,700,t,tA-0.7,()=>d11_personR(ctx,"tomas",1800,1030,0.8,{t,pose:t>tA&&t<tA+2.6?"explain":"stand"}),{dy:20});});
  // the map, layer by layer, as Day one promised it: the films that drew each layer, and the map now full
  const sA=fin(t,tLy-0.7,0.9);if(sA>0.01)withA(ctx,sA,()=>{
    const W7=["who it serves","why it moves","what it must","how value","who does the work","what runs"],W3=["the questions","rules with","a change"];
    const at_=i=>i===0?w("layers","Layer"):i<7?w("layers",W7[i-1]):i<10?w("data",W3[i-7]):tO;
    const lit=D11_FILMS.map((_,i)=>fin(t,at_(i)-0.1,0.5)),fill=[0,0,0,0,0,0],hi=[0,0,0,0,0,0];
    D11_ADDS.forEach((ls,i)=>ls.forEach(l=>{fill[l]=Math.max(fill[l],lit[i]);hi[l]=Math.max(hi[l],i?pulseAt(t,at_(i),2.0):0);}));
    // a change walked down every layer: a light goes down the map; then the whole map glows, holding what the organisation means
    const tWk=w("data","walked");for(let l=0;l<6;l++)hi[l]=Math.max(hi[l],pulseAt(t,tWk+l*0.22,0.9),0.6*pulseAt(t,w("over","holds"),2.6));
    arrive(ctx,470,130,t,tLy-0.4,()=>T(ctx,"the map, layer by layer",470,134,{w:800,size:32,align:"center",color:rgba(SOFT,1)}),{dy:10});
    const R=layerStack(ctx,150,190,600,{sh:66,gap:20,fill,hi,p:clamp((t-tLy+0.5)/1.6,0,1)});
    // the eleven films: seven to understand the utility, then four for data
    const cA=1-fin(t,w("over","Turning")-0.4,0.8),Y=i=>i<7?118+i*62:620+(i-7)*62;
    const card=(i,x,y)=>{const v=lit[i],col=i<7?EAC:D11_RULE;withA(ctx,(0.35+0.65*v)*cA,()=>{glass(ctx,x,y,770,54,14,col,{glow:8+14*v,ea:0.5+0.4*v,fill:"rgba(7,12,24,0.94)"});
      T(ctx,(i+1)+"",x+26,y+38,{f:"mono",w:500,size:28,color:rgba(col,1)});T(ctx,D11_FILMS[i],x+76,y+38,{w:700,size:28,color:rgba(INK,0.6+0.4*v)});});};
    if(cA>0.01){arrive(ctx,1100,96,t,tLy-0.3,()=>withA(ctx,cA,()=>T(ctx,"understand the utility",1050,100,{w:800,size:28,color:rgba(EAC,1)})),{dy:10});
      for(let i=0;i<7;i++)arrive(ctx,1440,Y(i)+27,t,tLy-0.3+i*0.08,()=>card(i,1050,Y(i)),{dy:16});
      withA(ctx,fin(t,tDa-0.3,0.6)*cA,()=>T(ctx,"for data",1050,602,{w:800,size:28,color:rgba(D11_RULE,1)}));
      for(let i=7;i<11;i++)arrive(ctx,1440,Y(i)+27,t,tDa-0.3+(i-7)*0.1,()=>card(i,1050,Y(i)),{dy:16});}
    // over to From words to data: the meaning the map holds, carried one way into the data
    const t0=tIn-0.5;if(t>t0){const HX=1100,HY=380,HW=700,HH=220,gl=pulseAt(t,w("over","From"),2.0);
      R.forEach(([x,y,w_,h],l)=>{const pu=(t-(t0+0.6+l*0.1))/1.0;d11_thread(ctx,x+w_+30,y+h/2,HX-10,HY+40+l*28,clamp((t-t0-l*0.08)/1.0,0,1),LAY6[l][1],{a:0.5,pulse:pu>0&&pu<1?pu:null});});
      arrive(ctx,HX+HW/2,HY+HH/2,t,t0,()=>{glass(ctx,HX,HY,HW,HH,20,D11_RULE,{glow:14+16*gl,ea:0.85,fill:"rgba(6,10,20,0.96)"});
        T(ctx,"seven films on data modelling",HX+34,HY+64,{f:"mono",w:500,size:28,color:rgba(D11_RULE,1)});T(ctx,"From words to data",HX+34,HY+152,{w:800,size:60});},{dy:-16});}});
  ctx.restore();vign(ctx,S);
  eaEnd(ctx,S,t,B+0.8,"A map people and agents can read",EAC,"A map lives while people use it, keep it true, and can pass it on.","Film 11 of 11");});
