/* ===== Now the questions appear: scenes =====
   Eleven chapters, as in ../script.md. Kerala in 1997: boats that could reach only one market, skippers who had to choose one at sea
   without knowing what it would pay, a catch poured back into the sea while buyers nearby went without, and the phones that brought a
   skipper the answer in time; then Tomás's backlog of forty-two requests, read again with the skipper's test; a request traced up to
   a decision, a capability and a goal, and one, as live as the skipper's call, that reaches nothing; all forty-two, half of which
   reach nothing; a goal traced down to a decision, a question and a measure, meeting the request at one decision; a goal with no
   measure; two reports that count one measure differently, and one definition; each measure's home and owner; four data products
   instead of twenty-one reports; back on the coast, the phones spread and the skipper's question traced the same way, with what
   changed; and Grace's measures confirmed.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; cards and names drawn small are texture. Motion:
   every shot drifts slowly and things arrive with a spring. Sound: every effect in tools/score.py fires at the same moment as the
   thing it belongs to here, so keep the two in step. */

/* ---------- 1. Where to land ---------- */
// The boats of two mornings. On the first, before the phones, each skipper chooses a market while still at sea and comes in to it,
// and eleven crews land at Badagara; on the second, after them, the boats wait at sea, and one of them (the skipper's) calls the
// markets before it chooses. Back on the coast (chapter 10), the same boats spread along the coast, each to a market within reach
// of where it fished.
const D8_BOATS=(()=>{const first=[2,3,3,2,3,3,2,3,3,2,3,11,2,3,3],B=[];first.forEach((n,m)=>{for(let j=0;j<n;j++)B.push({m1:m,k1:j,n1:n});});
  B.forEach((b,i)=>{b.m2=Math.min(14,Math.floor(i*15/B.length));b.out=12+hash(i,900)*16;b.al=(hash(i,901)-0.5)*12;b.go=hash(i,902);});
  const n2=Array(15).fill(0);B.forEach(b=>{b.k2=n2[b.m2]++;});B.forEach(b=>{b.n2=n2[b.m2];});return B;})();
const D8_HERO=D8_BOATS.findIndex(b=>b.m1===D8_BA&&b.m2===D8_CH);
Object.assign(D8_BOATS[D8_HERO],{out:12.5,al:0.5});
// the boats that wonder, out at sea, what the markets will pay: a few along the whole coast, and two of Badagara's eleven
const D8_WONDER=D8_BOATS.map((b,i)=>i).filter(i=>i!==D8_HERO&&(hash(i,903)<0.2||(D8_BOATS[i].m1===D8_BA&&D8_BOATS[i].k1%5===1)));
// where a boat is: out at sea (u = 0), coming in to market m along a curve, and pulled up on its beach beside the others (u = 1);
// it heads where it's going, rocks a little while it waits, and lies bow up the sand once it's in
function d8_boatAt(b,m,u,mor,t,i){const S_=D8_MK[b.m1],M=D8_MK[m],k=mor===1?b.k1:b.k2,n=mor===1?b.n1:b.n2,sp=n>6?1.05:1.5,al=(k-(n-1)/2)*sp;
  const sx=S_.x+S_.nx*b.out*D8_SK+S_.dx*b.al*D8_SK,sy=S_.y+S_.ny*b.out*D8_SK+S_.dy*b.al*D8_SK,ex=M.x+M.nx*0.5*D8_SK+M.dx*al*D8_SK,ey=M.y+M.ny*0.5*D8_SK+M.dy*al*D8_SK;
  const cx=M.x+M.nx*6*D8_SK+M.dx*al*0.6*D8_SK,cy=M.y+M.ny*6*D8_SK+M.dy*al*0.6*D8_SK,e=ease(clamp(u,0,1)),q=1-e;
  const x=q*q*sx+2*q*e*cx+e*e*ex,y=q*q*sy+2*q*e*cy+e*e*ey,dx=2*q*(cx-sx)+2*e*(ex-cx),dy=2*q*(cy-sy)+2*e*(ey-cy);
  const an=u>=1?Math.atan2(-M.ny,-M.nx):Math.atan2(dy,dx)+(u<=0?Math.sin(t*1.1+i*1.7)*0.08:0);return{x,y,an};}
// buyers waiting at a market, drawn as a map draws people, in rows inland of it; gone (0..1) walks them away inland, and near (0..1)
// brings them down to the beach
function d8_buyers(ctx,mi,n,a,gone,near){const M=D8_MK[mi],cols=Math.ceil(n/3);for(let k=0;k<n;k++){const row=k%3,col=Math.floor(k/3),inl=1.7+row*1.1+ease(gone||0)*(3+hash(k,905)*2)-ease(near||0)*1.1,al=(col-(cols-1)/2)*1.05+(row%2)*0.4;
  d8_buyer(ctx,M.x-M.nx*inl*D8_SK+M.dx*al*D8_SK,M.y-M.ny*inl*D8_SK+M.dy*al*D8_SK,5.6,[255,226,180],a*(1-sstep(0.4,1,gone||0)));}}
// a name on the map, with a dark halo so it reads over land and sea
function d8_name(ctx,s,x,y,al,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.95)";ctx.shadowBlur=10;T(ctx,s,x,y,{w:800,size:30,align:al,color:"rgba(255,244,226,0.98)"});ctx.restore();});}
// a tag that ends at x (its right edge) instead of starting there
const d8_tagR=(ctx,x,y,s,col)=>tag(ctx,x-(tw(ctx,s,28,700)+26),y,s,col,{size:28});
// the sea, from night (sun 0) towards day (sun 1)
function d8_sky(ctx,S,sun){setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba(mix([6,12,26],[34,72,104],sun),1));g.addColorStop(1,rgba(mix([4,8,18],[22,54,82],sun),1));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
scene("kerala",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tM=c("markets"),tBl=c("blind"),tD=c("dump"),tP=c("phones"),tA=c("act"),sun=clamp((t-1)/46,0,1);
  d8_sky(ctx,S,sun);
  // the camera: India's south; the north Kerala coast; then Badagara, close, for the rest of the chapter
  const BA=D8_MK[D8_BA],CH=D8_MK[D8_CH],QU=D8_MK[D8_QU],cam=d8_camAt(t,[[0,2439,2000,0.15],[3.4,1000,545,1,4.2],[tD-0.3,BA.x-108,BA.y+15,2.6,2.2]]);cam.z*=1+0.025*ease(t/sc.dur);
  const twK=fin(t,tP+0.2,1.6),near=fin(t,tD+1.6,0.6)*(1-fin(t,B-0.4,0.6));
  ctx.save();d8_camApply(ctx,cam);
  d8_map(ctx,t,cam,{sun,ker:fin(t,1.8,1.2)*(1-fin(t,6.2,1.4)),labs:fin(t,0.3,1.0)*(1-fin(t,3.4,1.0)),sea:fin(t,6.6,1.0)*(1-fin(t,tD-0.3,0.8)),mk:fin(t,w("markets","beach markets")-0.4,1.4),tw:[twK,0,0]});
  // fifteen kilometres round Badagara
  const rg=fin(t,w("dump","Within fifteen")-0.2,0.8)*(1-fin(t,tP-0.2,0.6));if(rg>0.01)withA(ctx,rg,()=>{ctx.save();ctx.setLineDash([10/cam.z,8/cam.z]);ctx.strokeStyle=rgba(TRUST,0.85);ctx.lineWidth=2.4/cam.z;ctx.beginPath();ctx.arc(BA.x,BA.y,15*D8_SK*ease(rg),0,TAU);ctx.stroke();ctx.restore();});
  // the catch, going back into the sea at Badagara
  d8_spill(ctx,BA.x+BA.nx*1.6*D8_SK,BA.y+BA.ny*1.6*D8_SK,3*D8_SK,t,fin(t,w("dump","goes back"),1.0)*(1-fin(t,tP,0.8)));
  // buyers with no fish, fifteen at Chombala and twelve at Quilandi, who leave; and, the morning the skipper calls, buyers at
  // Chombala, who come down to the beach as his boat comes in
  const bIn=fin(t,w("dump","Within fifteen")-0.4,0.6),bOut=clamp((t-w("dump","leave with"))/2.2,0,1),tAg=w("phones","agrees"),tOn=w("phones","only then");
  d8_buyers(ctx,D8_CH,15,bIn,bOut,0);d8_buyers(ctx,D8_QU,12,bIn,bOut,0);d8_buyers(ctx,D8_CH,7,fin(t,tAg-0.2,0.6),0,clamp((t-tOn-2.2)/1.4,0,1));
  // the boats: the first morning's come in from the sea to where they fished, wait there, and once each skipper has chosen, go on to
  // that market; the second morning's wait at sea, and the skipper's, a little bigger and lit while the phone is on screen, comes in
  // to Chombala once the price is agreed
  const bs=15*Math.pow(cam.z,-0.4),lamp=1-sstep(0.3,0.65,sun),fade1=fin(t,tP-0.1,0.9),in2=fin(t,tP-0.2,0.9),bAp=fin(t,5.4,1.6),cnt=w("dump","eleven crews"),tCh=w("blind","must choose"),tWo=w("blind","without knowing");
  const ph=fin(t,w("phones","At sea")-0.3,0.6)*(1-fin(t,tA-0.4,0.5));
  // how far a first-morning boat has come: in from the sea to where it fished (0.3); then, its skipper having chosen without knowing
  // what the markets will pay, on to that market
  const u1=b=>{const p1=ease(clamp((t-(tM+0.2+b.go*1.6))/3.2,0,1)),p2=clamp((t-(tWo+b.go*1.0))/2.8,0,1);return[0.3*p1+0.7*p2,(p1>0&&p1<1)||(p2>0&&p2<1)];};
  D8_BOATS.forEach((b,i)=>{
    if(fade1<1){const[u,mv]=u1(b),q=d8_boatAt(b,b.m1,u,1,t,i),hi=b.m1===D8_BA?pulseAt(t,cnt+b.k1*0.09,0.8):0;
      if(hi>0.01)glow(ctx,q.x,q.y,bs*1.4,TRUST,0.8*hi);d8_boat(ctx,q.x,q.y,q.an,bs,{a:bAp*(1-fade1),wake:mv?1:0,lamp});}
    if(in2>0){const hero=i===D8_HERO,u=hero?clamp((t-tOn)/3.2,0,1):0,q=d8_boatAt(b,hero?D8_CH:b.m2,u,2,t,i);
      if(hero&&ph>0.01)glow(ctx,q.x,q.y,bs*2.4,D8_SIG,0.6*ph);d8_boat(ctx,q.x,q.y,q.an,hero?bs*1.4:bs,{a:in2*(hero?1:0.8),wake:u>0&&u<1?1:0,lamp:lamp*0.6});}});
  const hq=d8_boatAt(D8_BOATS[D8_HERO],D8_CH,clamp((t-tOn)/3.2,0,1),2,t,D8_HERO);
  const wq=D8_WONDER.map(i=>{const b=D8_BOATS[i],q=d8_boatAt(b,b.m1,u1(b)[0],1,t,i);return d8_toS(cam,q.x,q.y);});
  ctx.restore();
  // out at sea, nobody knows what the markets will pay, and they go in not knowing
  wq.forEach(([x,y],j)=>d8_qmark(ctx,x,y-30,fin(t,tCh-0.1+j*0.08,0.4)*(1-fin(t,tD-0.6,0.5))));
  // the coast, close: the three markets' names, and what each had that morning
  const[cx_,cy_]=d8_toS(cam,CH.x,CH.y),[bx_,by_]=d8_toS(cam,BA.x,BA.y),[qx_,qy_]=d8_toS(cam,QU.x,QU.y);
  // Badagara's name is on the sea side while its boats are on the beach, and moves inland when the phone's calls come in from the sea
  d8_name(ctx,"Chombala",cx_+96,cy_+10,"left",near);d8_name(ctx,"Badagara",bx_-30,by_+10,"right",near*(1-fin(t,tP-0.4,0.5)));d8_name(ctx,"Badagara",bx_+96,by_+10,"left",near*fin(t,tP,0.5));
  d8_name(ctx,"Quilandi",qx_+96,qy_+10,"left",near);
  const dT=1-fin(t,tP-0.3,0.5);
  arrive(ctx,bx_-130,by_+56,t,w("dump","eleven crews")+0.2,()=>withA(ctx,dT,()=>d8_tagR(ctx,bx_-30,by_+56,"11 crews, no buyers",[255,176,150])),{dy:8});
  [[cx_,cy_,"15 buyers, no fish",0],[qx_,qy_,"12 buyers, no fish",0.3]].forEach(([x,y,s_,d])=>arrive(ctx,x+200,y+56,t,w("dump","twenty-seven")+d,()=>withA(ctx,dT,()=>tag(ctx,x+96,y+56,s_,[255,226,180],{size:28})),{dy:8}));
  arrive(ctx,bx_,by_-268,t,w("dump","Within fifteen")+0.4,()=>withA(ctx,dT,()=>tag(ctx,bx_,by_-268,"within 15 km",TRUST,{align:"center",size:28})),{dy:8});
  arrive(ctx,1500,170,t,w("dump","leave with"),()=>withA(ctx,dT,()=>tag(ctx,1500,170,"27 buyers leave with no fish",[255,176,150],{align:"center",size:30})),{dy:8});
  d8_beach(ctx,60,140,620,380,t,{a:fin(t,w("dump","their catch")-0.5,0.7)*(1-fin(t,tP-0.3,0.6)),pour:clamp((t-w("dump","goes back"))/2.4,0,1),lab:"Badagara, 7:45 a.m."});
  // the phones: the skipper at sea calls three markets in turn, agrees a price with one, and only then turns for it. The calls go out
  // from the phone over the boat and end at each market; each price comes back beside its name
  const tC=w("phones","calls buyers"),[hx,hy]=d8_toS(cam,hq.x,hq.y),px_=hx,py_=hy-58;
  const CALLS=[[bx_,by_,"Rs 6",tC-0.1,"BADAGARA"],[qx_,qy_,"Rs 8",tC+0.55,"QUILANDI"],[cx_,cy_,"Rs 9.5",tC+1.2,"CHOMBALA"]];
  if(ph>0.01)withA(ctx,ph,()=>{CALLS.forEach(([mx,my,pr,t0],k)=>{const q=clamp((t-t0)/0.5,0,1);if(q<=0)return;const won=k===2?fin(t,tAg,0.4):0,lose=k<2?fin(t,tAg,0.4)*0.6:0,col=mix(D8_SIG,TRUST,won),
        dx=mx-px_,dy=my-py_,dl=Math.hypot(dx,dy)||1,s_=pr+" a kg",cw=tw(ctx,s_,28,700)+26;
      arrowTo(ctx,px_,py_,mx-dx/dl*16,my-dy/dl*16,col,0.9*(1-lose),{p:q,lw:3,head:12,dash:won>0.5?null:[9,7],bend:k===1?-0.12:0.12});
      if(q>=1)arrive(ctx,mx+96+cw/2,my-40,t,t0+0.5,()=>{withA(ctx,1-lose,()=>tag(ctx,mx+96,my-40,s_,col,{size:28}));if(k===2&&won>0.01)kt_gtick(ctx,mx+96+cw+26,my-40,16,won);},{dy:6});});
    ctx.save();ctx.strokeStyle=rgba(D8_SIG,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hx,hy-14);ctx.lineTo(px_,py_+24);ctx.stroke();ctx.restore();d8_phoneIcon(ctx,px_,py_,24,1);});
  const scr=t<tC-0.1?["",""]:t<tAg?["CALLING",CALLS[Math.min(2,Math.floor((t-tC+0.1)/0.65))][4]]:["AGREED","RS 9.5"];
  d8_phone(ctx,60,130,560,560,t,{a:ph,bars:Math.floor(4*clamp((t-w("phones","At sea")-0.1)/0.8,0,1)+0.01),l1:scr[0],l2:scr[1],lab:"a skipper, at sea"});
  // the question was always the same, and it mattered because the skipper would act on its answer; what the phones changed is when
  // the answer arrived: no longer at the market, after the choice, but at sea, before it
  const ov=1-fin(t,B-0.4,0.7);
  arrive(ctx,430,300,t,w("act","what will")-0.3,()=>withA(ctx,ov,()=>sticky(ctx,430,300,620,150,"What will each market pay?",{col:NOTEC[0],size:42,rot:-0.02})),{dy:-24,from:1.06});
  d8_when(ctx,60,480,780,clamp((t-w("time","brought"))/1.8,0,1),{a:fin(t,w("act","It mattered")-0.3,0.6)*ov,hi:pulseAt(t,w("act","choosing")-0.1,1.6)});
  eaYear(ctx,90,90,"January 1997 · Kerala",CLAY,fin(t,0.6,0.6)*(1-fin(t,tP-0.2,0.4)));eaYear(ctx,90,90,"February 1997",CLAY,fin(t,tP,0.4)*(1-fin(t,B-0.4,0.6)));
  fadeIn(ctx,S,t);vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"Now the questions appear","decisions, questions and measures",EAC,"Film 8 of 11 · enterprise architecture, for data");});

/* ---------- 2. The backlog, read again ---------- */
// The reporting team's backlog: forty-two requests, in seven columns of six, each column under the decision its live requests serve
// (chapter 4): whom to offer help and next year's tariffs (bills affordable); which lines to renew and which poles to inspect
// (assets); where to add capacity and how to connect solar faster (renewable power); and the regulator's own (an obligation).
// Each is [number, what it asks for, 1 if it serves that column's decision].
const D8_REQ=[
 [[26,"households falling behind",1],[6,"customer 360",0],[28,"customers on payment plans",1],[10,"all fields from billing",0],[31,"a weekly PDF nobody opens",0],[30,"disconnections for debt",1]],
 [[24,"the old KPI pack, again",0],[33,"bills by tariff",1],[29,"posts about outages",0],[35,"cost to serve, by customer type",1],[37,"energy bought, by hour",1],[34,"emails sent, by team",0]],
 [[2,"which lines fail most often?",1],[1,"a dashboard of every outage, refreshed every minute, for the lobby",0],[5,"faults by line, last ten years",1],[13,"website visits, live",0],[9,"age of every overhead line",1],[18,"a copy of the asset register",0]],
 [[8,"fleet fuel, 2019",0],[11,"poles not inspected in five years",1],[20,"training hours since 2018",0],[14,"vegetation near lines",1],[38,"every system's logins",0],[16,"pole failures by type",1]],
 [[17,"peak load by substation",1],[4,"a data lake",0],[19,"solar exported, by street",1],[27,"a dashboard like the other utility's",0],[22,"new homes planned, by suburb",1],[42,"an AI dashboard",0]],
 [[15,"every meter reading, as a spreadsheet",0],[21,"days to connect new solar",1],[36,"a report for a meeting in 2022",0],[23,"applications waiting, by step",1],[25,"incomplete applications",1],[32,"export of the CRM, all fields",0]],
 [[39,"interruptions by region, for the regulator",1],[3,"export every customer",0],[40,"complaints by month, for the regulator",1],[7,"outages as a heat map",0],[41,"connection times, for the regulator",1],[12,"the board pack, as a dashboard",0]]];
// a request's place in a grid of seven columns: [x, y] of its centre
const d8_cell=(c,r,x0,y0,cw,chh,gx,gy)=>[x0+c*(cw+gx)+cw/2,y0+r*(chh+gy)+chh/2];
const d8_urgent=n=>hash(n,875)<0.72;
scene("backlog",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const tPl=c("pile"),tT=c("test"),tMap=w("test","Now there's"),nt=ease(fin(t,tPl-0.4,0.8)),mv=ease(fin(t,tMap-0.5,1.1));
  person(ctx,"tomas",230,1030,0.78,{t,pose:(t>0.6&&t<c("note")+2.6)||(t>w("test","skipper's test")&&t<w("test","skipper's test")+2.4)?"explain":"stand",expr:t>tT-0.2&&t<tMap?"concerned":"calm"});
  // the note: which questions matter?
  arrive(ctx,960,360,t,0.3,()=>{ctx.save();ctx.translate(lerp(960,1560,nt),lerp(360,120,nt));ctx.scale(lerp(1,0.55,nt),lerp(1,0.55,nt));sticky(ctx,0,0,760,210,"Which questions matter?",{col:NOTEC[0],size:50,st:0,rot:-0.02});ctx.restore();},{dy:-30});
  // the backlog: a stack of cards, dealt into a grid; then, once there's a map, moved aside to be read against it
  const tDeal=w("pile","their backlog"),gs=lerp(1,0.62,mv),gx0=lerp(470,400,mv),gy0=lerp(240,300,mv),kinds={2:w("pile","reports"),1:w("pile","dashboards"),3:w("pile","extracts")},tUrg=w("pile","urgent");
  D8_REQ.forEach((col,ci)=>col.forEach(([n,s_],ri)=>{const k=ci*6+ri,t0=tDeal+k*0.045,u=ease(clamp((t-t0)/0.6,0,1));if(t<w("pile","handed")-0.2)return;
    const[gx,gy]=d8_cell(ci,ri,gx0,gy0,150*gs,84*gs,14*gs,14*gs),sx=1700+hash(k,880)*12,sy=520+(hash(k,881)-0.5)*14-k*1.2,x=lerp(sx,gx,u),y=lerp(sy,gy,u);
    const kt=kinds[n],big=kt?fin(t,kt-0.1,0.4)*(1-fin(t,tUrg-0.3,0.5)):0,sc_=gs*(1+1.6*big);if(big>0.01)return;
    d8_card(ctx,x,y,150*sc_,84*sc_,n,s_,{size:15*sc_,deco:1,a:fin(t,w("pile","handed")-0.2,0.4),urgent:d8_urgent(n)?fin(t,tUrg+(k%14)*0.03,0.15):0});}));
  // three of them, close enough to read: a report, a dashboard, an extract
  [[2,"which lines fail most often?","reports",560],[1,"a dashboard of every outage, refreshed every minute, for the lobby","dashboards",1040],[3,"export every customer","extracts",1520]].forEach(([n,s_,word,x])=>{const t0=w("pile",word),a=fin(t,t0-0.1,0.4)*(1-fin(t,tUrg-0.3,0.5));
    if(a>0.01)arrive(ctx,x,560,t,t0-0.1,()=>withA(ctx,a,()=>d8_card(ctx,x,560,420,180,n,s_,{size:30,rot:(hash(n,882)-0.5)*0.04,hi:0.5})),{dy:-14});});
  arrive(ctx,lerp(1037,618,mv),lerp(185,255,mv),t,w("pile","forty-two"),()=>tag(ctx,lerp(1037,618,mv),lerp(185,255,mv),"42 requests",[255,176,150],{align:"center",size:30}),{dy:8});
  // the map, and the skipper's test for every request, with his boat on the card
  arrive(ctx,1500,380,t,tMap+0.3,()=>layerStack(ctx,1180,190,640,{p:clamp((t-tMap-0.3)/1.2,0,1),sh:54,gap:10,size:28}),{dy:-12});
  arrive(ctx,1500,720,t,w("test","skipper's test")-0.1,()=>{ruleCard(ctx,1150,640,700,"Who will decide what with the answer, and when?",{kicker:"the skipper's test",col:TRUST,size:34,hi:pulseAt(t,w("test","who will"),2.4)});
    d8_boat(ctx,1786,682,-0.12,52,{lamp:0.5});},{dy:-14});
  ctx.restore();
  eaYear(ctx,90,90,"day one",CLAY,fin(t,w("pile","day one")-0.2,0.5)*(1-fin(t,tT-0.3,0.5)));
  vign(ctx,S);});

/* ---------- 3. Up from a request ---------- */
// the rows of the map a request is traced up through, and where each sits
const D8_ROWS=[["goal",MOT,190],["capability",STR,375],["decision",BUS,560],["request",[255,214,170],760]];
scene("up",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const tF=c("first"),tC=c("climb"),tL=c("lobby"),top=w("climb","reaches the top");
  D8_ROWS.forEach(([n,col,y],i)=>withA(ctx,fin(t,0.2+i*0.12,0.5),()=>T(ctx,n,60,y+10,{f:"mono",w:600,size:28,color:rgba(col,0.85)})));
  // the first request, traced up: a decision, the capability it belongs to, and the goal it serves
  const x=640,t1=w("first","to decide")-0.2,t2=w("climb","maintaining assets")-0.2,t3=w("climb","replace assets")-0.2;
  arrive(ctx,x,760,t,tF+0.1,()=>d8_card(ctx,x,760,500,150,2,"which lines fail most often?",{size:30,rot:-0.012,hi:pulseAt(t,top,1.6)}),{dy:-14});
  d8_trace(ctx,[[x,684],[x,612]],clamp((t-w("first","need it"))/0.9,0,1),TRUST,{lw:3.5});
  arrive(ctx,x,560,t,t1,()=>d8_el(ctx,x-290,512,580,96,"renew which lines first",BUS,"decision",{size:30,gs:14,hi:pulseAt(t,t1+0.2,1.2)+pulseAt(t,top,1.6)}),{dy:-12});
  arrive(ctx,x-250,646,t,w("first","Grace's"),()=>d8_tagR(ctx,x-24,646,"Grace's planners · each spring",BUS),{dy:8});
  d8_trace(ctx,[[x,512],[x,422]],clamp((t-w("climb","belongs to"))/0.8,0,1),TRUST,{lw:3.5});
  arrive(ctx,x,375,t,t2,()=>d8_el(ctx,x-230,330,460,90,"maintain assets",STR,"capability",{size:30,gs:14,hi:pulseAt(t,t2+0.2,1.2)+pulseAt(t,top,1.6)}),{dy:-12});
  d8_trace(ctx,[[x,330],[x,240]],clamp((t-w("climb","serves a goal"))/0.8,0,1),TRUST,{lw:3.5});
  arrive(ctx,x,190,t,t3,()=>d8_el(ctx,x-320,140,640,100,"replace assets before they fail",MOT,"goal",{size:32,gs:15,hi:pulseAt(t,t3+0.2,1.2)+fin(t,top,0.6)*0.8}),{dy:-12});
  if(t>top)kt_gtick(ctx,x+340,140,20,fin(t,top,0.4));
  arrive(ctx,x,96,t,top,()=>tag(ctx,x,96,"the request reaches the top",TRUST,{align:"center",size:30}),{dy:8});
  // the next: a dashboard for the lobby, which finds no decision, and fades
  const X=1400,tW=w("live","who decides"),tN=w("live","No one"),tR=w("live","reaches nothing"),dead=fin(t,tR,0.8),tLv=w("live","as live");
  arrive(ctx,X,760,t,tL+0.1,()=>d8_card(ctx,X,760,560,170,1,"a dashboard of every outage, refreshed every minute, for the lobby",{size:30,rot:0.01,dead:dead*0.7}),{dy:-14});
  // it's as live as the skipper's call: the phone from Kerala beside it
  arrive(ctx,1446,640,t,tLv-0.1,()=>{d8_phoneIcon(ctx,1446,640,22,1);tag(ctx,1476,640,"as live as the skipper's call",D8_SIG,{size:28});},{dy:8});
  withA(ctx,1-dead*0.7,()=>d8_trace(ctx,[[X,674],[X,612]],clamp((t-tW)/0.7,0,1),mix(TRUST,D8_RED,fin(t,tN,0.5)),{lw:3.5,dash:t>tN?[8,8]:null}));
  arrive(ctx,X,560,t,tW+0.4,()=>d8_slot(ctx,X-290,512,580,96,BUS,1),{dy:-12});
  arrive(ctx,X,440,t,tW,()=>withA(ctx,1-fin(t,tR,0.4),()=>tag(ctx,X,440,"who decides what with it?",BUS,{align:"center",size:30})),{dy:8});
  arrive(ctx,X,440,t,tN,()=>withA(ctx,1-fin(t,tR,0.4),()=>T(ctx,"no one",X,500,{w:800,size:34,align:"center",color:rgba(D8_RED,1)})),{dy:8});
  arrive(ctx,X,330,t,tR,()=>tag(ctx,X,330,"it reaches nothing",D8_RED,{align:"center",size:30}),{dy:8});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Half of them ---------- */
// the goals at the top (and the regulator, whose decisions some reports serve), and the decisions in a row beneath, one over each
// column of requests: [name, x, width, kind]
const D8_GOALS=[["keep bills affordable",80,400,"goal"],["replace assets "+d8_nb("before they fail"),530,470,"goal"],["connect renewable power",1050,440,"goal"],["the regulator",1540,300,"stakeholder"]];
const D8_DEC=["whom to offer help","next year's tariffs","which lines to renew","which poles to inspect","where to add capacity","how to connect solar faster","targets and penalties"],D8_DG=[0,0,1,1,2,2,3];
const d8_dx=i=>192+i*256;
scene("half",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:500});
  const tAll=c("all"),tNo=c("none"),tBk=c("back"),reach=w("all","Twenty-one reach"),obl=w("all","obligation"),gone=w("back","goes back");
  D8_GOALS.forEach(([n,x,wd,kind],i)=>arrive(ctx,x+wd/2,148,t,0.2+i*0.1,()=>d8_el(ctx,x,104,wd,90,n,MOT,kind,{size:28,gs:12,hi:fin(t,reach+0.6+i*0.15,0.6)*0.5+(i===3?pulseAt(t,obl,1.6):0)}),{dy:-10}));
  D8_DEC.forEach((n,i)=>arrive(ctx,d8_dx(i),330,t,0.4+i*0.06,()=>d8_el(ctx,d8_dx(i)-115,296,230,70,n,BUS,"decision",{size:22,gs:10,deco:1,hi:fin(t,reach+0.3,0.5)*0.6+(i===6?pulseAt(t,obl,1.6):0)}),{dy:-10}));
  // from each decision to its goal, once requests reach it
  D8_DEC.forEach((n,i)=>{const g=D8_GOALS[D8_DG[i]],gx=g[1]+g[2]/2;d8_trace(ctx,[[d8_dx(i),296],[gx,194]],clamp((t-reach-0.3)/0.6,0,1),TRUST,{lw:2.5,a:0.8,nohead:1});});
  // all forty-two, traced: half reach their decision, half stop short and fade
  const fly=k=>{const r=hash(k,890);return clamp((t-gone-r*0.8)/0.9,0,1);};
  D8_REQ.forEach((col,ci)=>col.forEach(([n,s_,live],ri)=>{const[x,y]=d8_cell(ci,ri,77,470,230,56,26,14),k=ci*6+ri,t0=tAll+0.2+k*0.035,p=clamp((t-t0)/1.1,0,1),lx=x+(ri-2.5)*12;
    if(live)d8_trace(ctx,[[lx,y-28],[lx,410],[d8_dx(ci),366]],p,TRUST,{lw:2.2,a:0.85,nohead:p>0.98});
    else withA(ctx,1-fin(t,t0+1.2,0.6),()=>d8_trace(ctx,[[lx,y-28],[lx,y-28-(y-28-400)*0.7]],p,D8_RED,{lw:2,a:0.6,dash:[6,6]}));}));
  D8_REQ.forEach((col,ci)=>col.forEach(([n,s_,live],ri)=>{const[x,y]=d8_cell(ci,ri,77,470,230,56,26,14),k=ci*6+ri,dd=live?0:fin(t,tAll+1.4+k*0.035,0.5),f=live?0:fly(k),big=[36,13,3].includes(n)?fin(t,w("none",n===36?"needed once":n===13?"nobody acts":"nobody can")-0.3,0.4):0;
    if(f>=1||big>0.98)return;const ang=hash(k,891)*TAU,dx_=Math.cos(ang)*1300*ease(f),dy_=(500+Math.sin(ang)*300)*ease(f);
    d8_card(ctx,x+dx_,y+dy_,230,56,n,s_,{size:17,deco:1,dead:dd*0.8,hi:live?fin(t,tAll+1.4+k*0.035,0.5)*0.35:0,a:arrive_a(t,0.6+k*0.02)*(1-big),urgent:d8_urgent(n)?1:0,rot:(hash(n,870)-0.5)*0.03});}));
  // the three that stand for the rest, close enough to read, over the grid, dimmed; each goes back with one question
  const dim=fin(t,w("none","needed once")-0.4,0.5)*(1-fin(t,w("back","decide with")+0.3,0.8));if(dim>0.01){ctx.fillStyle="rgba(6,8,16,"+(0.62*dim)+")";ctx.fillRect(-100,436,2120,470);}
  [[36,"a report for a meeting in 2022","a report someone needed once","needed once",330],[13,"website visits, live","a dashboard nobody acts on","nobody acts",960],[3,"export every customer","an export nobody can explain","nobody can",1590]].forEach(([n,s_,lab,word,x],j)=>{
    const t0=w("none",word)-0.3,f=clamp((t-w("back","decide with")-0.4-j*0.15)/1.0,0,1),q=w("back","one question")+j*0.25;if(t<t0||f>=1)return;
    const y=690+ease(f)*500;withA(ctx,1-f,()=>{arrive(ctx,x,y,t,t0,()=>{d8_card(ctx,x,y,440,140,n,s_,{size:30,dead:0.35,rot:(hash(n,882)-0.5)*0.05});
      arrive(ctx,x+130,y+64,t,q,()=>sticky(ctx,x+130,y+64,300,110,"What would you decide with it?",{col:NOTEC[1],size:28,rot:0.05}),{dy:-20,from:1.1});},{dy:-14});
      arrive(ctx,x,560,t,t0+0.2,()=>withA(ctx,1-fin(t,q-0.2,0.4),()=>tag(ctx,x,560,lab,[255,176,150],{align:"center",size:28})),{dy:8});});});
  ctx.restore();
  arrive(ctx,560,252,t,reach,()=>tag(ctx,560,252,"21 reach a decision and a goal",TRUST,{align:"center",size:30}),{dy:8});
  arrive(ctx,1380,252,t,obl,()=>withA(ctx,1-fin(t,tNo-0.3,0.5),()=>tag(ctx,1380,252,"through an obligation: the regulator decides with them",MOT,{align:"center",size:28})),{dy:8});
  arrive(ctx,1380,252,t,tNo,()=>tag(ctx,1380,252,"21 reach nothing",D8_RED,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});
// how far an element has arrived, for something drawn without arrive(): it fades in over a third of a second
const arrive_a=(t,t0)=>fin(t,t0,0.35);

/* ---------- 5. Down from a goal ---------- */
// a goal implies decisions, a decision needs questions answered, a question needs a measure: the shape, then one path through it
const D8_TREE=[["goal",MOT,"goal",[[830,120,260,80]]],["decision",BUS,"decision",[[560,280,240,76],[1120,280,240,76]]],["question",INF,"question",[[420,440,220,76],[700,440,220,76],[1000,440,220,76],[1280,440,220,76]]],
  ["measure",INF,"measure",[[420,600,220,76],[700,600,220,76],[1000,600,220,76],[1280,600,220,76]]]];
scene("down",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const tB=c("better"),tMs=c("measure"),tMt=c("meet"),chk=w("meet","can be checked"),mv=ease(fin(t,tB-0.5,1.6)),meet=w("meet","meet at one");
  const X=760,gl=w("better","Take"),oc=w("better","a better network")-0.3,dc=w("measure","Its decision"),qu=w("measure","its question"),me=w("unit","The measure"),rq=w("measure","the planners asked");
  const rows=[w("way","the other way"),w("way","implies decisions"),w("way","needs questions"),w("way","needs a measure")],path=[gl,dc,qu,me];
  // the shape, built from the top (the goal comes down from above the frame); then moved aside, small, where the example's path
  // through it lights up as the example is drawn beside it
  ctx.save();ctx.translate(lerp(0,-470,mv),lerp(70,160,mv));const sk=lerp(1,0.46,mv);ctx.translate(960,400);ctx.scale(sk,sk);ctx.translate(-960,-400);
  D8_TREE.forEach(([n,col,kind,boxes],r)=>boxes.forEach(([x,y,bw,bh],j)=>{const on=j===0?fin(t,path[r],0.5):0,o={size:28,gs:11,deco:mv>0.1?1:0,a:1-0.35*mv*(1-on),hi:on};
    if(r>0){const t0=rows[r]-0.2+j*0.08,pb=D8_TREE[r-1][3][r===1?0:r===2?Math.floor(j/2):j],q=clamp((t-t0+0.3)/0.5,0,1);
      if(q>0)arrowTo(ctx,pb[0]+pb[2]/2,pb[1]+pb[3],x+bw/2,y,col,0.7+0.3*on,{p:q,lw:2.5,head:10});
      arrive(ctx,x+bw/2,y+bh/2,t,t0,()=>d8_el(ctx,x,y,bw,bh,n,col,kind,o),{dy:-10});return;}
    const u=clamp((t-rows[0])/1.4,0,1);if(u<=0)return;const yy=lerp(-230,y,1-Math.pow(1-u,3));
    if(u<1){const g=ctx.createLinearGradient(0,yy-300,0,yy);g.addColorStop(0,rgba(col,0));g.addColorStop(1,rgba(col,0.5*(1-u)));ctx.strokeStyle=g;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+bw/2,yy-300);ctx.lineTo(x+bw/2,yy);ctx.stroke();}
    withA(ctx,Math.min(1,u*2.5),()=>d8_el(ctx,x,yy,bw,bh,n,col,kind,o));}));
  ctx.restore();
  // one goal, traced down: the outcome nobody could check; the decision, the question and the measure
  arrive(ctx,X+280,178,t,gl,()=>d8_el(ctx,X,130,560,96,"replace assets before they fail",MOT,"goal",{size:30,gs:14}),{dy:-12});
  const nw=fin(t,chk+1.2,0.8),stp=fin(t,w("better","nobody could")-0.2,0.3);
  d8_trace(ctx,[[X+562,178],[1368,178]],clamp((t-oc-0.1)/0.5,0,1),MOT,{lw:2.5});
  arrive(ctx,1590,178,t,oc,()=>{withA(ctx,1-nw,()=>d8_el(ctx,1370,130,440,96,"a better network",MOT,"outcome",{size:30,gs:14}));withA(ctx,nw,()=>d8_el(ctx,1370,130,440,96,"fewer interruptions "+d8_nb("per customer, each year"),MOT,"outcome",{size:28,gs:14,hi:pulseAt(t,chk+1.3,1.6)}));
    kt_rstamp(ctx,1590,272,"how would anyone check?",[200,60,60],stp*(1-nw),fin(t,w("better","nobody could"),0.35),{size:28});if(nw>0.01)kt_gtick(ctx,1834,122,20,nw);},{dy:-12});
  d8_trace(ctx,[[X+280,226],[X+280,320]],clamp((t-dc+0.4)/0.6,0,1),MOT,{lw:3.5});
  arrive(ctx,X+280,368,t,dc,()=>d8_el(ctx,X,320,560,96,"renew which lines first",BUS,"decision",{size:30,gs:14,hi:pulseAt(t,meet,1.4)+fin(t,meet,0.6)*(1-fin(t,B+2.6,0.8))*0.7}),{dy:-12});
  d8_trace(ctx,[[X+280,416],[X+280,500]],clamp((t-qu+0.3)/0.5,0,1),MOT,{lw:3.5});
  arrive(ctx,X+280,548,t,qu,()=>d8_el(ctx,X,500,560,96,"which lines fail most often?",INF,"question",{size:30,gs:14}),{dy:-12});
  d8_trace(ctx,[[X+280,596],[X+280,680]],clamp((t-me+0.3)/0.5,0,1),MOT,{lw:3.5});
  arrive(ctx,X+280,740,t,me,()=>d8_el(ctx,X,680,560,120,"interruptions per customer, "+d8_nb("per year")+", line by line",INF,"measure",{size:30,gs:14,v:0.45+0.08*Math.sin(t*0.9),hi:pulseAt(t,chk,1.6)}),{dy:-12});
  arrive(ctx,1560,800,t,w("unit","per year"),()=>tag(ctx,1360,800,"known as SAIFI",INF,{size:28}),{dy:8});
  // the planners' request, from the bottom, and the goal's line, from the top, meet at the decision
  arrive(ctx,1600,560,t,rq,()=>d8_card(ctx,1600,560,420,130,2,"which lines fail most often?",{size:30,rot:0.02,hi:pulseAt(t,meet,1.4)}),{dy:-14});
  d8_trace(ctx,[[1600,494],[1600,410],[X+562,380]],clamp((t-tMt-0.2)/1.0,0,1),TRUST,{lw:3.5});
  const lit=fin(t,meet,0.5)*(1-fin(t,B+2.6,0.8));if(lit>0.01){glow(ctx,X+280,368,180,TRUST,0.25*lit);glow(ctx,X+562,380,60,TRUST,0.6*lit);}
  arrive(ctx,X-300,368,t,meet,()=>d8_tagR(ctx,X-22,368,"from the top and from the bottom: one decision",TRUST),{dy:8});
  // the measure checks the goal: a light climbs the chain from the measure to the goal, and crosses to the outcome, which can now be checked
  const u=clamp((t-chk)/1.2,0,1);if(u>0&&u<1)glow(ctx,X+280,lerp(690,200,ease(u)),70,TRUST,0.8*Math.sin(Math.PI*u));
  const v=clamp((t-chk-1.0)/0.5,0,1);if(v>0&&v<1)glow(ctx,lerp(X+560,1370,v),178,50,TRUST,0.8*Math.sin(Math.PI*v));
  ctx.restore();vign(ctx,S);});

/* ---------- 6. A goal with no measure ---------- */
scene("missing",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const tAf=c("afford"),tBh=c("behind"),tFa=c("farah"),none=w("afford","but none"),dc=w("behind","Retail decides"),qu=w("behind","Its question"),reg=w("register","The hardship"),help=w("register","already getting");
  arrive(ctx,960,158,t,0.2,()=>d8_el(ctx,640,110,640,96,"keep bills affordable",MOT,"goal",{size:32,gs:15,hi:pulseAt(t,w("farah","A goal"),1.8)}),{dy:-12});
  // the measured half: the network charge
  const lA=w("afford","network charge")-0.2;d8_trace(ctx,[[700,206],[400,290]],clamp((t-lA)/0.5,0,1),MOT,{lw:3,nohead:1});
  arrive(ctx,400,345,t,lA+0.3,()=>d8_el(ctx,80,290,640,110,"network charge no higher "+d8_nb("in real terms in 2030"),MOT,"outcome",{size:30,gs:14}),{dy:-12});
  d8_trace(ctx,[[400,400],[400,462]],clamp((t-lA-0.6)/0.4,0,1),INF,{lw:3,nohead:1});
  arrive(ctx,400,510,t,lA+0.8,()=>{d8_el(ctx,80,462,640,96,"network charge, in real terms",INF,"measure",{size:30,gs:14,v:0.4});kt_gtick(ctx,720,462,18,1);},{dy:-12});
  arrive(ctx,400,612,t,lA+1.2,()=>tag(ctx,400,612,"measured",TRUST,{align:"center",size:28}),{dy:8});
  // the people who pay it: a decision, a question, and no measure
  d8_trace(ctx,[[1220,206],[1060,290]],clamp((t-none)/0.5,0,1),MOT,{lw:3,dash:[8,8],nohead:1});
  arrive(ctx,1060,250,t,none,()=>withA(ctx,1-fin(t,dc,0.4),()=>tag(ctx,1250,250,"the people who pay it",MOT,{size:28})),{dy:8});
  arrive(ctx,1060,350,t,dc,()=>{d8_el(ctx,780,290,560,120,"whom to offer help, "+d8_nb("before they fall too far behind"),BUS,"decision",{size:28,gs:13});},{dy:-12});
  arrive(ctx,1060,442,t,dc+0.5,()=>d8_owner(ctx,1060,442,"retail",1,{align:"center"}),{dy:8});
  d8_trace(ctx,[[1060,466],[1060,510]],clamp((t-qu)/0.4,0,1),INF,{lw:3,nohead:1});
  arrive(ctx,1060,558,t,qu,()=>d8_el(ctx,780,510,560,96,"how many are falling behind?",INF,"question",{size:30,gs:14}),{dy:-12});
  d8_trace(ctx,[[1060,606],[1060,650]],clamp((t-qu-0.8)/0.4,0,1),INF,{lw:3,dash:[8,8],nohead:1});
  const tG=w("farah","A goal");arrive(ctx,1060,695,t,qu+0.9,()=>{glow(ctx,1060,695,260,MOT,0.3*pulseAt(t,tG,1.8));d8_slot(ctx,780,650,560,90,INF,1,"no measure");},{dy:-10});
  arrive(ctx,1060,792,t,tG,()=>tag(ctx,1060,792,"a goal without a measure can't be steered",MOT,{align:"center",size:30}),{dy:8});
  // households, and the few the register counts
  const B_={},hl=[25,26,33],far=fin(t,qu+0.4,0.8);[3,9,14,18,22,25,26,30,33,37].forEach((i,k)=>{B_[i]=fin(t,qu+0.4+k*0.1,0.5);});
  arrive(ctx,1630,220,t,dc+0.6,()=>d8_homes(ctx,1420,110,8,5,54,{behind:B_,help:hl,ring:fin(t,help-0.3,0.6)}),{dy:-10});
  arrive(ctx,1630,420,t,qu+1.2,()=>tag(ctx,1630,420,"falling behind",[255,190,90],{align:"center",size:28}),{dy:8});
  arrive(ctx,1630,520,t,reg,()=>d8_el(ctx,1420,476,432,88,"Hardship register",APL,"component",{size:30,gs:13}),{dy:-12});
  arrive(ctx,1636,612,t,help-0.2,()=>tag(ctx,1636,612,"only those already getting help",APL,{align:"center",size:28}),{dy:8});
  // Farah, bottom left, has asked for the number for years
  arrive(ctx,170,820,t,tFa-0.3,()=>person(ctx,"farah",150,1030,0.6,{t,pose:t>tFa&&t<tFa+2.4?"explain":"stand",expr:"concerned"}),{dy:20,from:0.96});
  arrive(ctx,500,750,t,w("farah","asked for"),()=>{sticky(ctx,500,740,330,130,"How many are falling behind?",{col:NOTEC[1],size:28,rot:-0.03});["2024","2025","2026"].forEach((y_,k)=>withA(ctx,fin(t,w("farah","for years")+k*0.25,0.3),()=>T(ctx,y_,370+k*96,848,{f:"mono",w:500,size:28,color:rgba([255,200,214],0.95)})));},{dy:-20,from:1.06});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. What counts ---------- */
// one connection, in working days: the application comes in (0), is complete (10), approved (31), and the new meter fitted (34)
const D8_DX=d=>140+d*(1640/34),D8_AX=400;
scene("count",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const tTw=c("two"),tCl=c("clock"),tDf=c("define"),tSm=c("same"),r1=w("disagree","thirty-four"),r2=w("disagree","twenty-one"),same=fin(t,tSm+0.2,1.0);
  // the goal, and the measure it does have; the measure then moves up to the top left, and the goal gives way to the reports
  const up=ease(fin(t,w("disagree","Two reports")-0.8,1.0)),mx=lerp(960,490,up),my=lerp(510,148,up);
  withA(ctx,1-up,()=>{arrive(ctx,960,340,t,0.6,()=>d8_el(ctx,640,292,640,96,"connect renewable power",MOT,"goal",{size:32,gs:15}),{dy:-12});
    d8_trace(ctx,[[960,388],[960,462]],clamp((t-w("two","a measure"))/0.5,0,1),MOT,{lw:3,nohead:1});});
  arrive(ctx,mx,my,t,w("two","new solar")-0.3,()=>d8_el(ctx,mx-410,my-48,820,96,"new solar connected within 10 working days",MOT,"outcome",{size:30,gs:14}),{dy:-12});
  const n1=Math.round(lerp(34,24,ease(same))),n2=Math.round(lerp(21,24,ease(same)));
  arrive(ctx,1170,185,t,r1-0.3,()=>d8_report(ctx,960,80,420,210,"connections report",""+n1,APL,{tick:fin(t,tSm+1.2,0.4),hi:pulseAt(t,r1,1.2)}),{dy:-12});
  arrive(ctx,1650,185,t,r2-0.3,()=>d8_report(ctx,1440,80,420,210,"network report",""+n2,STR,{tick:fin(t,tSm+1.2,0.4),hi:pulseAt(t,r2,1.2)}),{dy:-12});
  // the timeline of one connection
  const ax=fin(t,w("disagree","Two reports")-0.2,0.8);if(ax>0)withA(ctx,ax,()=>{ctx.save();ctx.strokeStyle="rgba(220,230,255,0.6)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(D8_DX(0),D8_AX);ctx.lineTo(D8_DX(0)+(D8_DX(34)-D8_DX(0))*ease(ax),D8_AX);ctx.stroke();
    for(let d=0;d<=34;d++){const x=D8_DX(d),big=d%5===0;ctx.strokeStyle="rgba(220,230,255,"+(big?0.55:0.25)+")";ctx.lineWidth=big?2:1.2;ctx.beginPath();ctx.moveTo(x,D8_AX-(big?9:5));ctx.lineTo(x,D8_AX+(big?9:5));ctx.stroke();}ctx.restore();
    [[0,"application in",0],[10,"application complete",0],[31,"approved",1],[34,"new meter",0]].forEach(([d,s_,up_])=>{const x=D8_DX(d);ctx.fillStyle="rgba(240,244,255,0.95)";ctx.beginPath();ctx.arc(x,D8_AX,7,0,TAU);ctx.fill();
      T(ctx,s_,d===0?x-6:x,up_?D8_AX-24:D8_AX+44,{w:700,size:28,align:d===0?"left":"center",color:rgba(SOFT,1)});});});
  // where each report starts and stops its clock: the connections report above the line, the network report below; both give way
  // to the measure once it is defined
  const tFr=w("define","complete application"),p1=clamp((t-r1+0.2)/0.9,0,1),p2=clamp((t-r2+0.2)/0.9,0,1),gone=fin(t,tFr-0.4,0.6);
  withA(ctx,1-gone,()=>{d8_span(ctx,D8_DX(0),D8_DX(34),D8_AX-70,1,APL,p1,"34 days",1);d8_span(ctx,D8_DX(10),D8_DX(31),D8_AX+80,-1,STR,p2,"21 days",1);});
  const ck=fin(t,tCl+0.2,0.4)*(1-gone);[[0,APL,D8_AX-70],[34,APL,D8_AX-70],[10,STR,D8_AX+80],[31,STR,D8_AX+80]].forEach(([d,col,y],k)=>d8_clock(ctx,D8_DX(d),y,17,col,ck*(0.6+0.4*pulseAt(t,w("clock","start")+k*0.25,0.8)),t));
  arrive(ctx,700,570,t,w("clock","Both are right"),()=>withA(ctx,1-fin(t,tDf-0.3,0.4),()=>tag(ctx,700,570,"both are right",TRUST,{align:"center",size:30})),{dy:8});
  arrive(ctx,1260,570,t,w("clock","Neither"),()=>withA(ctx,1-fin(t,tDf-0.3,0.4),()=>tag(ctx,1260,570,"neither is the measure",D8_RED,{align:"center",size:30})),{dy:8});
  // the definition, written down: from a complete application to the new meter, in working days
  const rows=[["from","a complete application",44,"complete application"],["to","the new meter",44,"new meter"],["counts","Monday to Friday, not public holidays",44,"Monday"],["owner","Grace",44,"Grace writes"]];
  const rt=rows.map(([,,,word])=>w("define",word)),p=rt.reduce((a,x)=>a+clamp((t-x)/0.4,0,1),0)/rt.length;
  arrive(ctx,940,700,t,tDf,()=>d8_def(ctx,560,540,760,"working days to connect new solar",rows.map(r=>[r[0],r[1],r[2]]),{p,hi:pulseAt(t,tSm,1.6)}),{dy:-16});
  const pd=clamp((t-tFr)/0.9,0,1);d8_span(ctx,D8_DX(10),D8_DX(34),D8_AX-70,1,TRUST,pd,same>0.5?"24 days, in both":"the measure",fin(t,tFr-0.2,0.4));
  // the questions Why it moves left open, each answered beside the line that answers it
  [["connected, from when?",688,"complete application"],["what counts as a working day?",776,"Monday"]].forEach(([s_,y,word])=>arrive(ctx,1600,y,t,tDf+0.3,()=>{tag(ctx,1374,y,s_,INF,{size:28});const a=fin(t,w("define",word)+0.4,0.4);if(a>0)kt_gtick(ctx,1352,y,15,a);},{dy:8}));
  arrive(ctx,170,820,t,tDf-0.6,()=>person(ctx,"grace",150,1030,0.7,{t,pose:t>tDf&&t<tDf+3?"explain":"stand"}),{dy:20,from:0.96});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. A home and an owner ---------- */
// the capability map, as in Today, and where it's going (a no-break space keeps "the network" on one line in its box)
const D8_CAPS=["plan the network","operate the network","maintain assets","connect customers","generate power","sell energy","serve customers","meet obligations"],d8_cx=i=>177+i*224;
// each measure, its capability, where it hangs, and its owner
const D8_HOME=[["interruptions per customer, "+d8_nb("per year"),2,370,"Grace","Interruptions"],["working days to connect "+d8_nb("new solar"),3,960,"Grace","Days to connect"],["households falling behind",6,1550,"head of retail","Households"]];
scene("home",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const tO=c("owner"),acts=w("means","acts when");
  D8_CAPS.forEach((n,i)=>{const hm=D8_HOME.find(h=>h[1]===i),hi=hm?fin(t,w("homes",hm[4])-0.1,0.5):0;arrive(ctx,d8_cx(i),320,t,0.2+i*0.06,()=>archEl(ctx,d8_cx(i)-104,270,208,100,n,STR,"capability",{size:28,gs:11,hi:hi*0.8,a:1-0.45*(1-hi)*fin(t,w("homes","Interruptions")-0.4,0.6)}),{dy:-12});});
  // each measure hangs under the capability whose work it measures, with that capability's owner
  D8_HOME.forEach(([n,ci,x,own,word],k)=>{const t0=w("homes",word)-0.1,u=ease(clamp((t-t0)/1.0,0,1)),y=lerp(810,580,u),mv=pulseAt(t,acts+k*0.3,1.4);
    if(u>0)d8_trace(ctx,[[d8_cx(ci),370],[d8_cx(ci),440],[x,440],[x,y-62]],clamp((t-t0-0.6)/0.6,0,1),INF,{lw:2.5,nohead:1});
    arrive(ctx,x,y,t,t0,()=>{sticky(ctx,x,y,500,124,n,{col:NOTEC[0],size:30,rot:(k-1)*0.012,st:0.5});d8_glyph(ctx,"measure",x-226,y-40,12,[120,80,40],0.5+0.25*Math.sin(t*0.8+k)+0.3*mv);},{dy:-16});
    arrive(ctx,x,y+108,t,w("owner",k<2?"Grace":"head of retail")+(k===1?0.3:0),()=>d8_owner(ctx,x,y+108,own,1,{align:"center",hi:mv}),{dy:8});});
  ctx.restore();
  arrive(ctx,960,190,t,w("home","home on the map"),()=>withA(ctx,1-fin(t,tO-0.3,0.4),()=>tag(ctx,960,190,"a home: the capability whose work it measures",INF,{align:"center",size:28})),{dy:8});
  arrive(ctx,960,800,t,w("means","An owner"),()=>tag(ctx,960,800,"an owner says what the number means, and acts when it moves",TRUST,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 9. By capability, not by request ---------- */
// the twenty-one live requests, and the four data products they need: [name, the capabilities it serves, x, y, its side (0 the
// network, 1 retail), its owner, the request columns it answers]
const D8_LIVE=[];D8_REQ.forEach((col,ci)=>col.forEach(([n,s_,live],ri)=>{if(live)D8_LIVE.push({n,s:s_,ci});}));
const D8_PROD=[["assets and faults","maintain assets · operate the network",100,250,0,"Grace"],["connections","connect customers",100,450,0,"Grace"],["load and capacity","plan the network",100,650,0,"Grace"],["accounts and bills","sell energy · serve customers",1110,450,1,"head of retail"]];
// which product answers each live request: by the decision its column serves (the regulator's three go where their data lives)
const d8_prodOf=r=>r.ci<=1?3:r.ci<=3?0:r.ci===4?2:r.ci===5?1:r.n===39?0:r.n===40?3:1;
function d8_product(ctx,x,y,w,h,name,caps,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,INF,{glow:14+14*(o.hi||0),ea:0.85,fill:"rgba(12,10,14,0.95)"});ctx.fillStyle=rgba(INF,0.12+0.1*(o.hi||0));rr(ctx,x,y,w,h,18);ctx.fill();
  ctx.fillStyle=rgba(col,0.9);rr(ctx,x,y+14,6,h-28,3);ctx.fill();d8_glyph(ctx,"product",x+w-34,y+34,15,INF);T(ctx,name,x+28,y+48,{w:800,size:34,color:rgba(INK,0.97)});T(ctx,caps,x+28,y+h-24,{w:700,size:28,color:rgba(STR,0.95)});});}
scene("build",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tR=c("reports"),tG=c("group"),tE=c("each"),dom=w("group","the domain"),four=w("group","four data products"),sd=fin(t,dom-0.2,0.8);
  d8_sides(ctx,{a:sd});
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  d8_wall(ctx,{p:clamp((t-dom+0.2)/1.0,0,1),hi:pulseAt(t,w("each","own side"),1.6)});
  // twenty-one requests become twenty-one reports, each kept by someone else; then each flies to the product that answers it
  const fl=ease(clamp((t-four+0.4)/1.4,0,1)),cnt=[0,0,0,0];
  D8_LIVE.forEach((r,k)=>{const cx=180+(k%7)*260,cy=280+Math.floor(k/7)*190,pi=d8_prodOf(r),P=D8_PROD[pi],j=cnt[pi]++,tx=P[2]+80+j*36,ty=P[3]+56,x=lerp(cx,tx,fl),y=lerp(cy,ty,fl),sz=lerp(1,0.18,fl),becomes=fin(t,w("reports","could become")+k*0.04,0.4);
    if(fl>=1)return;withA(ctx,1-sstep(0.75,1,fl),()=>{ctx.save();ctx.translate(x,y);ctx.scale(sz,sz);withA(ctx,1-becomes,()=>d8_card(ctx,0,0,220,110,r.n,r.s,{size:20,deco:1,a:fin(t,0.2+k*0.03,0.4),rot:0}));
      d8_dash(ctx,-110,-60,220,120,k,becomes,{keeper:[[255,150,150],[150,220,255],[255,214,120],[170,240,170],[220,170,255],[255,180,110],[140,230,220]][k%7]});ctx.restore();});});
  arrive(ctx,960,180,t,w("reports","twenty-one reports"),()=>withA(ctx,1-fin(t,dom-0.4,0.4),()=>tag(ctx,960,180,"21 reports, each kept by someone different",[255,176,150],{align:"center",size:30})),{dy:8});
  // four data products: three on the network's side of the wall, one on retail's
  D8_PROD.forEach(([n,caps,x,y,side,own],i)=>{const t0=four+0.2+i*0.25;arrive(ctx,x+330,y+60,t,t0,()=>{d8_product(ctx,x,y,660,120,n,caps,side?D8_RET:D8_NET,{hi:pulseAt(t,t0+1.0,1.0)});},{dy:-12});
    arrive(ctx,x+330,y+150,t,w("each","one owner")+i*0.12,()=>d8_owner(ctx,x+330,y+150,own,1,{align:"center"}),{dy:8});
    // each answers many questions: they fan out from it, on its own side
    for(let q=0;q<5;q++){const a=fin(t,w("each","many questions")+i*0.1+q*0.08,0.4);if(a<=0.01)continue;const qx=side?1800:850,qy=y+10+q*25;ctx.save();ctx.strokeStyle=rgba(INF,0.5*a);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+660,y+60);ctx.lineTo(qx-22,qy);ctx.stroke();ctx.restore();
      withA(ctx,a,()=>{glass(ctx,qx-18,qy-14,36,28,14,INF,{glow:6,ea:0.8,fill:"rgba(16,10,8,0.95)"});d8_glyph(ctx,"question",qx,qy-1,8,INF);});}});
  ctx.restore();
  arrive(ctx,960,128,t,four,()=>tag(ctx,960,128,"scoped by capability and domain, not by request",PARCH,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 10. Back on the coast ---------- */
// The coast from 1997 to 2001: the phones spread, district by district, and on boat after boat the skipper calls, learns what each
// market will pay, and only then comes in, so the boats spread along the coast instead of crowding one beach. On the open sea beside
// the map, the skipper's question is traced as the film traces a request: a measure, a question, a decision (who decides, and when)
// and the goal it serves; then what changed. The rows: [kind, colour, name, y, height]
const D8_KC=[["goal",MOT,"sell the whole catch",150,88],["decision",BUS,"where to land",290,124],["question",INF,"what will each market pay?",470,88],["measure",INF,"rupees a kilo, "+d8_nb("market by market"),614,88]];
scene("coast",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);d8_sky(ctx,S,1);
  // the camera: Badagara, close, where the opening left it; then back to the whole north coast, with the open sea on the left
  const BA=D8_MK[D8_BA],CH=D8_MK[D8_CH],QU=D8_MK[D8_QU],cam=d8_camAt(t,[[0,BA.x-108,BA.y+15,2.6],[1.4,700,545,1,3.4]]);cam.z*=1+0.02*ease(clamp((t-4.8)/(sc.dur-4.8),0,1));
  const tDi=w("spread","district by"),tDl=w("spread","district."),tB=w("knew","boat after");
  ctx.save();d8_camApply(ctx,cam);
  d8_map(ctx,t,cam,{sun:1,mk:1,tw:[1,fin(t,tDi-0.2,1.4),fin(t,tDl-0.1,1.4)]});
  // the buyers at Chombala, as the opening left them
  d8_buyers(ctx,D8_CH,7,1,0,1);
  // the boats: the skipper's is in at Chombala; the rest wait at sea until, one after another, each skipper calls (a light on the
  // boat), learns what each market will pay, and only then comes in. By 2001 more than 60% of the boats had a phone, so about two in
  // three call; the rest come in too, to a coast where prices no longer swing
  const bs=15*Math.pow(cam.z,-0.4);
  D8_BOATS.forEach((b,i)=>{const hero=i===D8_HERO,tc=tB-0.4+b.go*1.8,u=hero?1:clamp((t-tc-0.6)/3.2,0,1),q=d8_boatAt(b,hero?D8_CH:b.m2,u,2,t,i),call=hero||hash(i,906)>0.66?0:fin(t,tc,0.3)*(1-fin(t,tc+2.6,0.8));
    if(call>0.01)glow(ctx,q.x,q.y,bs*2.2,D8_SIG,0.7*call);d8_boat(ctx,q.x,q.y,q.an,hero?bs*1.4:bs,{a:hero?1:0.8+0.2*fin(t,tc,0.3),wake:u>0&&u<1?1:0});});
  ctx.restore();
  // the three markets' names, while the camera is close
  const near=clamp((cam.z-1.5)/0.7,0,1),[cx_,cy_]=d8_toS(cam,CH.x,CH.y),[bx_,by_]=d8_toS(cam,BA.x,BA.y),[qx_,qy_]=d8_toS(cam,QU.x,QU.y);
  d8_name(ctx,"Chombala",cx_+96,cy_+10,"left",near);d8_name(ctx,"Badagara",bx_+96,by_+10,"left",near);d8_name(ctx,"Quilandi",qx_+96,qy_+10,"left",near);
  // the phones, district by district
  [[0,"Kozhikode · 1997",w("spread","phones spread")],[1,"Kannur · 1998",tDi],[2,"Kasaragod · 2000",tDl]].forEach(([d,s_,t0])=>{const T0=D8_TW.find(q=>q.r===d),[x,y]=d8_toS(cam,T0.x,T0.y);
    arrive(ctx,x+70,y-30,t,t0,()=>tag(ctx,x+70,y-30,s_,D8_SIG,{size:28}),{dy:8});});
  // the skipper's question, traced up from the measure to the goal it serves, in gold, as the film traces a request
  const X0=230,BW=560,XC=X0+BW/2,tWs=w("gain","The waste"),tEv=w("gain","evened out"),steady=fin(t,tEv-0.6,1.4);
  const T_=[sc.ends.knew+0.3,w("knew","before choosing")-0.1,w("knew","what each"),w("knew","knew what")-0.3];
  D8_KC.forEach(([kind,col,name,y,h],r)=>{const t0=T_[r],hi=pulseAt(t,t0+0.2,1.2)+(r===0?pulseAt(t,tWs+0.1,1.6):0)+(r===3?pulseAt(t,tEv,1.6):0);
    withA(ctx,fin(t,t0,0.4),()=>T(ctx,kind,60,y+h/2+10,{f:"mono",w:600,size:28,color:rgba(col,0.85)}));
    arrive(ctx,XC,y+h/2,t,t0,()=>{if(kind!=="decision")return d8_el(ctx,X0,y,BW,h,name,col,kind,{size:r===0?32:30,gs:14,hi,v:0.5+0.32*Math.sin(t*2.1)*Math.sin(t*0.63+1)*(1-steady)});
      d8_el(ctx,X0,y,BW,h,"",col,kind,{gs:14,hi});T(ctx,name,XC,y+50,{w:700,size:32,align:"center",color:rgba(INK,0.96)});T(ctx,"the skipper · at sea, before eight",XC,y+98,{w:700,size:28,align:"center",color:rgba(BUS,1)});},{dy:-12});});
  [[614,558,T_[2]],[470,414,T_[1]],[290,238,T_[0]]].forEach(([y0,y1,t0])=>d8_trace(ctx,[[XC,y0],[XC,y1]],clamp((t-t0+0.4)/0.5,0,1),TRUST,{lw:3.5}));
  // the answer, in time, serves the goal: a light climbs the chain to it, and the goal is met
  const u_=clamp((t-tWs+0.9)/1.0,0,1);if(u_>0&&u_<1)glow(ctx,XC,lerp(658,194,ease(u_)),70,TRUST,0.8*Math.sin(Math.PI*u_));
  if(t>tWs)kt_gtick(ctx,X0+BW+20,150,20,fin(t,tWs+0.1,0.4));
  // what changed: the outcomes, in a row of their own under the chain
  withA(ctx,fin(t,tWs+0.2,0.4),()=>T(ctx,"outcomes",60,802,{f:"mono",w:600,size:28,color:rgba(MOT,0.85)}));
  [["the waste stopped",X0,762,tWs+0.2],["prices evened out",603,762,tEv-0.3],["crews earned 8% more",X0,822,w("gain","Crews earned")],["fish cost 4% less",603,822,w("gain","fish cost")]].forEach(([s_,x,y,t0])=>
    arrive(ctx,x,y,t,t0,()=>tag(ctx,x,y,s_,TRUST,{size:30}),{dy:8}));
  eaYear(ctx,90,90,"Kerala · 1997 to 2001",CLAY,fin(t,0.8,0.6));
  vign(ctx,S);});

/* ---------- 11. Questions that matter ---------- */
const D8_Q="Which questions matter?",D8_A=["The ones someone will act on, in time:","traced to a goal,","with a measure and an owner."].map(d8_nb).join(" ");
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,y:420});
  const g1=fin(t,w("confirm","Grace")+0.3,0.8),g2=fin(t,w("confirm","definitions"),0.8),dr=fin(t,w("confirm","head of retail"),0.5),cA=c("answer"),dn=pulseAt(t,B+0.2,1.6);
  [["interruptions per customer, per year",220,g1],["working days to connect new solar",420,g2]].forEach(([s_,y,g],k)=>{arrive(ctx,430,y,t,0.3+k*0.2,()=>{sticky(ctx,430,y,640,110,s_,{col:NOTEC[0],edge:INF,glass:g,size:30,rot:0});d8_glyph(ctx,"measure",136,y-28,12,g>0.5?INF:[120,80,40],0.5);},{dy:-14});
    if(g>0)withA(ctx,g,()=>{kt_gtick(ctx,130,y+86,18,1);T(ctx,"confirmed · Grace",160,y+96,{w:700,size:28,color:rgba(TRUST,1)});});});
  arrive(ctx,430,620,t,0.7,()=>sticky(ctx,430,620,640,110,"households falling behind",{col:NOTEC[0],size:30,rot:0.012,st:0.5}),{dy:-14});
  if(dr>0)withA(ctx,dr,()=>tag(ctx,430,730,"to the head of retail, as a draft",INF,{align:"center",size:28}));
  if(dn>0)[220,420,620].forEach(y=>glow(ctx,430,y,240,EAC,0.18*dn));
  person(ctx,"grace",1020,1030,0.74,{t,pose:t>w("confirm","Grace")&&t<w("confirm","Grace")+2.2?"explain":"stand"});
  d8_personR(ctx,"tomas",1820,1030,0.78,{t,pose:t>cA&&t<cA+2.4?"explain":"stand"});
  arrive(ctx,1560,140,t,0.4,()=>sticky(ctx,1560,140,500,120,D8_Q,{col:NOTEC[0],size:32,st:fin(t,cA+1.6,0.5)*0.5,rot:-0.03}),{dy:-20});
  arrive(ctx,1570,420,t,cA,()=>sticky(ctx,1570,420,580,270,D8_A,{col:NOTEC[0],size:30,p:clamp((t-cA-0.2)/3.2,0,1),rot:0.015}),{dy:-30,from:1.06});
  arrive(ctx,1500,730,t,w("next","Next"),()=>sticky(ctx,1500,730,420,130,"Where does each rule belong?",{col:NOTEC[0],size:32,st:0,rot:0.03}),{dy:-30,from:1.06});
  ctx.restore();vign(ctx,S);
  eaEnd(ctx,S,t,B+0.8,"Now the questions appear",EAC,"A question matters when someone will act on its answer, in time.","Film 8 of 11");});
