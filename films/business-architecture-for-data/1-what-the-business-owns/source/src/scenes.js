/* ===== What the business owns: scenes =====
   Nine chapters, as in ../script.md. The qanats of Iran: villages that live on water nobody sees, brought from the mountains by a
   tunnel and a line of shafts; never enough for every field at once, and a tunnel that one cave-in can cut; so each part has its own
   people: the shareholders own the water, in shares of time, the mirab keeps the turns, and the diggers, the muqannis, build and
   repair the tunnel, paid for the work. Then Tomás's map and the part of it this series covers; a ticket for "all customers" that
   gets three answers; whose meaning the data team's own table held; who owns what, written down; the parts of business architecture
   that matter for data; the owners answer; the data practice drawn on the map; and back to the village.
   The story's pictures (the desert from above, the qanat cut away, its people) are the series' own, in ../../../shared/src/ba.js.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: the camera
   glides between what the narration names and things arrive with a spring; in one room nothing is cut. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. Water under the desert ---------- */
// one turn of the water in one town: twelve days, the first opened out into its fifteen shares, one of them lit
// (P. W. English's account of Mahan: a share of 96 minutes every twelve days, fifteen in a day)
function b1_turn(ctx,a,o){if(a<=0.01)return;o=o||{};const X=520,Wd=1020,dw=Wd/12,sw=Wd/15,y1=96,y2=206;
  withA(ctx,a,()=>{glass(ctx,340,58,1240,300,22,BAC,{glow:14,ea:0.75,fill:"rgba(8,14,24,0.92)"});
    const pd=o.days==null?1:o.days;T(ctx,"12 days",372,y1+30,{w:700,size:30,color:rgba(INK,0.95)});
    for(let i=0;i<12;i++){const q=clamp(pd*12-i,0,1);if(q<=0)continue;ctx.fillStyle=rgba(i===0?BA_WATER:BA_SAND,(i===0?0.55:0.3)*q);ctx.fillRect(X+i*dw+3,y1,(dw-6)*q,40);}
    const po=o.open||0,L=o.lit||0;
    if(po>0.01){withA(ctx,po,()=>{ctx.strokeStyle=rgba(BA_WATER,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X+3,y1+40);ctx.lineTo(X,y2);ctx.moveTo(X+dw-3,y1+40);ctx.lineTo(X+Wd,y2);ctx.stroke();
        T(ctx,"day 1",372,y2+34,{w:700,size:30,color:rgba(INK,0.95)});});
      for(let i=0;i<15;i++){const q=clamp(po*15-i,0,1);if(q<=0)continue;const l=i===o.share?L:0;ctx.fillStyle=rgba(mix(BA_SAND,BA_WATER,l),0.3+0.5*l);ctx.fillRect(X+i*sw+3,y2,(sw-6)*q,46);}}
    if(L>0.01){const x0=X+o.share*sw;withA(ctx,L,()=>{ctx.strokeStyle=rgba(BA_WATER,1);ctx.lineWidth=3;ctx.strokeRect(x0+1,y2-2,sw-2,50);glow(ctx,x0+sw/2,y2+23,70,BA_WATER,0.35);
      T(ctx,"one share: 96 minutes",x0+sw/2,y2+96,{w:700,size:30,align:"center",color:rgba(BA_WATER,1)});});}});}
// an oil lamp set down on the tunnel's floor, lighting the digger beside it
function b1_lamp(ctx,x,y,s,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.fillStyle="rgba(150,104,60,1)";ctx.beginPath();ctx.ellipse(x,y-3*s,9*s,4*s,0,0,TAU);ctx.fill();
  const fl=0.85+0.15*Math.sin(t*9);ctx.fillStyle="rgba(255,214,140,1)";ctx.beginPath();ctx.ellipse(x+6*s,y-9*s,2.6*s,6*s*fl,0.3,0,TAU);ctx.fill();
  glow(ctx,x+6*s,y-9*s,64*s,[255,200,120],0.42);glow(ctx,x+6*s,y-9*s,18*s,[255,230,170],0.6);});}
// where the village's people stand: the four fields' gates, the shareholders by their fields (in what they wear), the mirab at the
// third field's gate
const B1_GATES=BA_VFIELDS.map(([x])=>x-6),B1_MIRAB=B1_GATES[2]-16,B1_S=0.14;
const B1_OWNERS=[[1640,-1,{dress:"robe",head:"turban"}],[1790,1,{dress:"tunic",head:"cap"}],[1990,-1,{dress:"chador"}],[2150,-1,{dress:"robe",head:"cap"}]];
// the qanat cut away, with its water, its village, its gates and its people, as the chapter's state st says
function b1_section(ctx,t,st){ba_secSky(ctx,{warm:0.35});
  ba_section(ctx,t,{water:st.water,block:900,blockA:st.blockA,hiSh:st.hiSh,hiT:st.hiT});
  ba_village(ctx,t,{wet:st.wet,fill:st.fill});ba_channel(ctx,t,2230,st.chTo,{from:st.chFrom});
  B1_GATES.forEach((x,i)=>ba_gate(ctx,x,st.gate[i],1));
  // the diggers: one at the windlass over the shaft, bringing the earth up; one in the tunnel, with a lamp, or a pick at the cave-in
  const dA=st.dig;if(dA>0.01){const sy=ba_ys(950);ba_windlass(ctx,950,sy,0.2,st.bucket,t,{f:-1,depth:(ba_yt(950)-sy)/0.2-30,a:dA});
    ba_fig(ctx,924,ba_ys(924),B1_S,{dress:"tunic",head:"cap",f:1,reach:ba_crank(950,sy,0.2,t,-1),a:dA,t});
    const dig={kind:"stoop",head:"cap",f:-1,a:dA,rimA:0.85,rim:[255,206,140],col:[52,40,34],t};
    if(st.pick){b1_lamp(ctx,982,ba_yt(982),1.0,t,dA);ba_fig(ctx,958,ba_yt(958),B1_S,Object.assign({hold:"pick"},dig));}
    else ba_fig(ctx,992,ba_yt(992),B1_S,Object.assign({hold:"lamp"},dig));}
  // the shareholders by their fields, and the mirab with his hand on the gate whose turn it is
  B1_OWNERS.forEach(([x,f,o],i)=>{const a=st.own[i];if(a>0.01)ba_fig(ctx,x,ba_ys(x),B1_S,Object.assign({f,a,t,rimA:0.6},o));});
  const gx=B1_GATES[2];if(st.mirab>0.01)ba_fig(ctx,B1_MIRAB,ba_ys(B1_MIRAB),B1_S,{dress:"robe",head:"turban",f:1,reach:[gx-7,ba_ys(gx)-12-st.gate[2]*16],a:st.mirab,t,rimA:0.6});}
scene("water",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tQ=c("qanat"),tS=c("shafts"),tN=c("never"),tF=c("fragile"),tNd=c("needed"),tSh=c("shares"),tM=c("mirab"),tD=c("diggers"),tL=c("lasted"),tT=c("today"),tK=c("link");
  // from above, then cut away, then from above again: the whole picture changes, so the two dissolve
  const secA=fin(t,tQ-0.7,1.2)*(1-fin(t,tT-0.7,1.2));
  // the water runs down the tunnel as the narration says how; a cave-in stops it, and what's below drains away, the channel first;
  // then each part has its own people, and the diggers clear it: the water comes back down the tunnel and along the channel
  const tRun=w("qanat","brings")-0.2,run=clamp((t-tRun)/3,0,1),tCave=w("fragile","One cave-in")-0.1,tFix=tSh+0.9;
  const blockA=fin(t,tCave,0.5)*(1-fin(t,tFix,2.2)),XB=900,drain=clamp((t-tCave-0.3)/2.6,0,1),refill=clamp((t-tFix-1.4)/2.4,0,1);
  const water=t<tCave?[[BA_XM,lerp(BA_XM,BA_XO+30,run)]]:t<tFix+1.4?[[BA_XM,XB-34],[lerp(XB+36,BA_XO+30,drain),BA_XO+30]]:[[BA_XM,lerp(XB-34,BA_XO+30,refill)]];
  const chTo=t<tCave?clamp((t-tRun-3)/1.4,0,1):t<tFix+3.8?1:clamp((t-tFix-3.8)/1.4,0,1),chFrom=t<tCave||t>=tFix+3.8?0:clamp((t-tCave-1.2)/1.8,0,1);
  // the fields' turns: one after another while the water runs; dry once it's cut off; again as it comes back, the third under the mirab's hand
  const T0=[tN+0.6,tN+2.2,tN+3.8,tN+5.4],tCut=w("fragile","cut off")-0.2,tBack=tFix+5.2,T1=[tBack,tBack+2.6,w("mirab","keeps")-0.3,w("diggers","paid")];
  const wet=[0,1,2,3].map(i=>{const b=[0.5,0.42,0.36,0.3][i];let v=b+(0.95-b)*fin(t,T0[i],1.2);v*=1-0.75*fin(t,tCut,3.0);return lerp(v,0.95,fin(t,T1[i],1.4));});
  const fill=[0,1,2,3].map(i=>Math.max(fin(t,T0[i],0.4)*(1-fin(t,T0[i]+1.6,0.4))*(t<tCave?1:0),fin(t,T1[i],0.4)*(1-fin(t,i<3?T1[i+1]:T1[3]+3.0,0.4))));
  // the people: the diggers when the shafts let them in, and again when each part has its own people; the mirab, then the shareholders
  const tDi=w("shafts","diggers")-0.5,dig=Math.max(fin(t,tDi,0.6)*(1-fin(t,tN+0.6,0.8)),fin(t,tSh+0.2,0.6));
  const tEa=w("shafts","earth")-0.6,bucket=t<tSh?clamp((t-tEa)/1.8,0,1)*(1-fin(t,tN+0.6,0.8)):0.5-0.5*Math.cos(TAU*clamp((t-tFix)/1.6,0,3));
  const st={water,blockA,chTo,chFrom,wet,fill,gate:fill,dig,bucket,pick:t>tSh,hiSh:fin(t,w("shafts","shafts")-0.2,0.5)*(1-fin(t,tN-0.3,0.8)),hiT:pulseAt(t,w("qanat","a tunnel")-0.1,1.6),
    own:[0,1,2,3].map(i=>fin(t,tSh+1.0+i*0.15,0.6)),mirab:fin(t,tSh+0.6,0.6)};
  // from above: the desert at the mountains' foot, the chain of shafts lit as the water nobody sees is named
  const tWa=w("edge","water")-0.3;
  if(secA<0.99){setScreen(ctx,S);ctx.save();focus(ctx,t,[[0,880,420,0.8],[3.0,980,500,0.98],[tT-0.8,1000,540,0.92],[tK-0.3,1080,600,1.0]],3.0);
    ba_aerial(ctx,t,{warm:t<tQ?0.55:0.3,lit:fin(t,tWa,0.6),litP:clamp((t-tWa)/2.2,0,1),flow:1,green:0.8});
    // today, and what the story says for data
    baTagAt(ctx,S,BA_CHAIN[9][0],BA_CHAIN[9][1],"the data team: keeps the channel",TECH,{dy:-56,a:fin(t,w("link","keeps the channel")-0.3,0.6)*(1-fin(t,B+0.2,0.6))});
    baTagAt(ctx,S,1574,830,"the business: the water, and what it means",BIZ,{dy:0,a:fin(t,w("link","The water")-0.3,0.6)*(1-fin(t,B+0.2,0.6))});
    ctx.restore();
    eaYear(ctx,80,80,"Iran · for more than 2,000 years",CLAY,fin(t,0.6,0.8)*(1-fin(t,tQ-1.0,0.6)));
    eaYear(ctx,80,80,"Qasabeh, Gonabad · 33 km · still flowing",CLAY,fin(t,w("today","Qasabeh")-0.2,0.6)*(1-fin(t,tK-0.6,0.6)));
    eaYear(ctx,80,160,"UNESCO, 2016 · eleven qanats listed",CLAY,fin(t,w("today","UNESCO")-0.2,0.6)*(1-fin(t,tK-0.6,0.6)));}
  // cut away: the camera goes to what the narration names
  if(secA>0.01)withA(ctx,secA,()=>{setScreen(ctx,S);ctx.save();
    focus(ctx,t,[[0,800,640,1.0],[tS-0.3,900,660,1.3],[tDi+0.1,960,700,2.0],[tN-0.2,1880,745,1.6],[tF-0.2,930,740,1.9],[tNd-0.1,1300,700,1.05],[w("shares","shareholders")-0.4,1880,745,1.6],[tM-0.3,1880,770,2.1],[tD-0.3,950,735,2.4],[tL-0.2,1180,620,0.9]],1.8);
    b1_section(ctx,t,st);
    const tg=(s_,x,y,col,a,o)=>baTagAt(ctx,S,x,y,s_,col,Object.assign({a},o||{}));
    const qOut=1-fin(t,tS-0.5,0.5);
    tg("groundwater",60,760,BA_WATER,fin(t,w("qanat","groundwater")-0.2,0.5)*qOut);
    tg("a tunnel, sloping gently",760,836,[226,206,176],fin(t,w("qanat","a tunnel")-0.2,0.5)*qOut);
    tg("by gravity alone",1300,866,BA_WATER,fin(t,w("qanat","gravity")-0.2,0.5)*qOut);
    tg("shafts",650,520,CLAY,fin(t,Math.max(w("shafts","shafts")-0.2,tS+1.5),0.5)*(1-fin(t,tDi,0.5)));
    tg("the earth out",950,600,CLAY,fin(t,Math.max(tEa+0.3,tDi+2.0),0.5)*(1-fin(t,tN-0.3,0.5)));
    tg("one field at a time",1890,700,[196,230,150],fin(t,w("never","every field")-0.2,0.5)*(1-fin(t,tF-0.4,0.5)));
    tg("a cave-in",900,846,BA_RED,fin(t,tCave+0.2,0.5)*(1-fin(t,tNd-0.3,0.5)));
    tg("whose water?",1890,690,BIZ,fin(t,w("needed","whose")-0.2,0.5)*(1-fin(t,tSh-0.2,0.5)));
    tg("who keeps it flowing?",900,600,TECH,fin(t,w("needed","who would")-0.2,0.5)*(1-fin(t,tSh-0.2,0.5)));
    tg("the shareholders: own the water",1890,736,BIZ,fin(t,w("shares","shareholders")-0.2,0.5)*(1-fin(t,tM-0.5,0.5)));
    tg("the mirab: keeps the turns",B1_MIRAB,742,AMBER,fin(t,w("mirab","mirab")-0.2,0.5)*(1-fin(t,tD-0.6,0.5)));
    tg("the muqannis: build and repair it",950,600,TECH,fin(t,w("diggers","muqannis")-0.2,0.5)*(1-fin(t,tL-0.5,0.5)));
    tg("paid for the work",950,600,[226,206,176],fin(t,w("diggers","paid")-0.2,0.5)*(1-fin(t,tL-0.5,0.5)),{dy:58});
    // each part in its own hands
    const tE=Math.max(w("lasted","each part")-0.2,tL+1.7),lOut=1-fin(t,tT-1.0,0.5);
    tg("the shareholders: the water",2000,700,BIZ,fin(t,tE,0.5)*lOut);
    tg("the mirab: the turns",B1_MIRAB,900,AMBER,fin(t,tE+0.3,0.5)*lOut);
    tg("the muqannis: the tunnel",900,600,TECH,fin(t,tE+0.6,0.5)*lOut);
    ctx.restore();
    b1_turn(ctx,fin(t,w("shares","shares of time")-0.3,0.6)*(1-fin(t,tM-0.6,0.6)),{days:clamp((t-w("shares","shares of time")+0.2)/1.2,0,1),open:clamp((t-w("town","In one town")+0.2)/1.2,0,1),share:5,lit:fin(t,w("town","ninety-six")-0.2,0.5)});});
  vign(ctx,S);
  baTitle(ctx,S,t,B+0.6,"What the business owns","and what the data team keeps for it","Film 1 of 5");});

/* ---------- 2. Tomás's map ---------- */
// what each of the three layers this series covers holds, inside its slab
const B1_INSIDE=[[1,"capabilities","capabilities"],[2,"processes and roles","the work"],[3,"business objects","concepts"]];
// a bracket down the right side of the map, from layer l0 to l1, with its label (one or two lines)
function b1_rbr(ctx,R,l0,l1,x,lines,col,a,p){if(a<=0.01)return;const y0=R[l0][1]+4,y1=R[l1][1]+R[l1][3]-4;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
  ctx.moveTo(x-12,y0);ctx.lineTo(x,y0);ctx.lineTo(x,lerp(y0,y1,ease(clamp(p==null?1:p,0,1))));if((p==null?1:p)>0.75)ctx.lineTo(x-12,y1);ctx.stroke();ctx.restore();
  const ym=(y0+y1)/2-(lines.length-1)*19;lines.forEach((l,i)=>T(ctx,l,x+22,ym+11+i*38,{w:800,size:30,color:rgba(col,1)}));});}
scene("map",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,x:880,y:520});
  const tP=c("part"),tT=c("three"),tN=c("next");
  // the map, drawn layer by layer, held by the three questions on its left; then this series' part of it lit, the rest dimmed
  const bq=[w("drawn","why it exists"),w("drawn","how it works"),w("drawn","what runs it")].map(x=>fin(t,x-0.3,0.6)),part=fin(t,w("part","one part")-0.2,0.8);
  const fill=[0,part*0.55,part*0.55,part*0.55,0,0],hi=[0,0,0,0,0,0];B1_INSIDE.forEach(([l,,k])=>{hi[l]=Math.max(part*0.35,pulseAt(t,w("three",k)-0.1,1.8));});
  const R=layerStack(ctx,460,236,640,{sh:72,gap:20,p:clamp((t-w("drawn","layer by layer")+0.4)/1.8,0,1),fill,hi,br:bq[0],bq});
  if(part>0.01)[0,4,5].forEach(l=>{const[x,y,w_,h]=R[l],k=h*0.7;ctx.save();ctx.beginPath();ctx.moveTo(x+k-4,y-4);ctx.lineTo(x+w_+k+6,y-4);ctx.lineTo(x+w_+4,y+h+10);ctx.lineTo(x-6,y+h+10);ctx.closePath();ctx.fillStyle="rgba(26,22,18,"+(0.5*part)+")";ctx.fill();ctx.restore();});
  // what each of the three holds, inside its slab, as the narration names it
  B1_INSIDE.forEach(([l,s_,k])=>{const t0=w("three",k)-0.2;if(t<t0)return;const[x,y,w_,h]=R[l],tw_=tw(ctx,s_,28,700)+26;arrive(ctx,x+w_-tw_/2-24,y+h/2,t,t0,()=>tag(ctx,x+w_-tw_-24,y+h/2,s_,LAY6[l][1],{size:28}),{dy:-10});});
  // this series, down the right of its three layers; then the series after it, further down the map, starting from here
  b1_rbr(ctx,R,1,3,1190,["business architecture","for data"],BAC,part,clamp((t-w("part","one part")+0.1)/1.0,0,1));
  const nA=fin(t,w("next","the data")-0.3,0.6),pA=fin(t,w("next","the platform")-0.3,0.6);
  if(nA>0.01){const x=1190,y0=R[3][1]+R[3][3]+6,y1=R[5][1]+R[5][3];arrowTo(ctx,x,y0,x,lerp(y0,y1,ease(clamp((t-w("next","the data")+0.3)/1.4,0,1))),SOFT,0.8*nA,{lw:3,head:12});
    withA(ctx,nA,()=>T(ctx,"data architecture",x+22,R[4][1]+30,{w:700,size:30,color:rgba(LAY6[4][1],1)}));withA(ctx,pA,()=>T(ctx,"platform and solution architecture",x+22,R[5][1]+46,{w:700,size:30,color:rgba(LAY6[5][1],1)}));}
  if(t>w("next","start from here")-0.3)glow(ctx,1190,(R[1][1]+R[3][1]+R[3][3])/2,160,BAC,0.25*pulseAt(t,w("next","start from here")-0.2,1.6));
  // Tomás, who drew it
  arrive(ctx,1760,760,t,0.3,()=>baPersonR(ctx,"tomas",1760,1040,0.8,{t,expr:"calm"}),{dy:20});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Three answers ---------- */
// the ticket, the three counts and last year's two reports; drawn the same way in Whose meaning?, which carries the picture on
const B1_TICKET={kicker:"ticket · DATA-2041",ask:"All customers, by district, for the annual report",from:"from Ama Owusu, regulatory lead"};
const B1_COUNTS=[[120,"310,000","accounts","billing",BA_RET],[700,"540,000","connection points","network",BA_NET],[1280,"352,000","customers","data team's table",TECH]];
// a report on paper: its name and year, and the number it gave
function b1_report(ctx,x,y,w,name,lines,a,o){if(a<=0.01)return;o=o||{};withA(ctx,a,()=>{sheet(ctx,x,y,w,o.h||170,{rot:o.rot||-0.012,plain:true});ctx.save();ctx.translate(x+w/2,y+(o.h||170)/2);ctx.rotate(o.rot||-0.012);ctx.translate(-w/2,-(o.h||170)/2);
  T(ctx,name,28,46,{w:700,size:28,color:"rgba(70,62,56,0.95)"});lines.forEach((l,i)=>T(ctx,l,28,106+i*50,{w:800,size:o.size||40,color:"rgba(36,32,30,0.95)"}));ctx.restore();});}
scene("three",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});
  ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
  const tA=c("answers"),tL=c("last"),tM=c("minister"),tW=c("which"),tBw=w("which","But which"),gone=fin(t,tBw-0.4,0.6);
  arrive(ctx,960,190,t,c("ticket")-0.3,()=>baTicket(ctx,430,70,1060,Object.assign({state:"open"},B1_TICKET)),{dy:-16});
  // three answers: three places, each filled as its count is read
  const right=i=>fin(t,w("which","right about")-0.2+i*0.25,0.5);
  B1_COUNTS.forEach(([x,num,what,src,col],i)=>{const slot=fin(t,tA-0.1+i*0.12,0.5),t0=c(["billing","network","own"][i])-0.2;
    if(t<t0+0.3)withA(ctx,slot*(1-fin(t,t0,0.4)),()=>{ctx.save();ctx.setLineDash([10,9]);ctx.strokeStyle=rgba(col,0.6);ctx.lineWidth=2.4;rr(ctx,x,380,520,200,18);ctx.stroke();ctx.restore();});
    if(t>t0)arrive(ctx,x+260,480,t,t0,()=>baCount(ctx,x,380,520,200,num,what,src,col,{mark:right(i),ok:true}),{dy:14});});
  // last year: the annual report and the regulator's return, each with its own number of customers; then the minister, asked which
  b1_report(ctx,1280,640,520,"annual report · 2025",["352,000 customers"],fin(t,w("last","annual report")-0.3,0.6)*(1-gone),{rot:-0.014});
  b1_report(ctx,700,640,520,"regulator's return · 2025",["540,000 customers"],fin(t,w("last","regulator's return")-0.3,0.6)*(1-gone),{rot:0.012});
  if(t>tM-0.3)arrive(ctx,380,730,t,tM-0.3,()=>withA(ctx,1-gone,()=>{glass(ctx,120,640,520,180,18,BA_RED,{glow:12,ea:0.7,fill:"rgba(20,8,10,0.94)"});T(ctx,"in parliament",146,688,{f:"mono",w:500,size:28,color:rgba(BA_RED,1)});
    T(ctx,"Which number is true?",146,752,{w:700,size:36});withA(ctx,fin(t,w("minister","couldn't say")-0.2,0.5),()=>{tag(ctx,146,792,"no answer",BA_RED,{size:28});});}),{dy:14});
  // each count is right about something; but which one is a customer?
  arrive(ctx,960,690,t,tBw-0.1,()=>tag(ctx,960,690,"which one is a customer?",AMBER,{align:"center",size:36}),{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Whose meaning? ---------- */
// a business object as its owner defines it: its name, what it is, and who owns it
function b1_object(ctx,x,y,w,name,def,owner,a,o){if(a<=0.01)return;o=o||{};withA(ctx,a,()=>{glass(ctx,x,y,w,170,16,BA_INF,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(16,10,8,0.95)"});ctx.fillStyle=rgba(BA_INF,0.1);rr(ctx,x,y,w,170,16);ctx.fill();
  archGlyph(ctx,"object",x+w-36,y+34,13,BA_INF);T(ctx,"business object",x+24,y+44,{f:"mono",w:500,size:28,color:rgba(BA_INF,1)});T(ctx,name,x+24,y+100,{w:800,size:36});T(ctx,def,x+24,y+146,{w:600,size:28,color:rgba(INK,0.85)});
  if(owner)withA(ctx,o.ownerA==null?1:o.ownerA,()=>tag(ctx,x+w/2,y+206,"owner: "+owner,TRUST,{align:"center",size:28}));});}
// the data team's own table: when it was built, the rule it counts by, and the owner it never had
function b1_script(ctx,x,y,w,o){const a=o.a==null?1:o.a;if(a<=0.01)return;const L=o.lines||[0,0,0,0];withA(ctx,a,()=>{glass(ctx,x,y,w,300,16,TECH,{glow:12,ea:0.85,fill:"rgba(6,12,22,0.95)"});
  if(o.dash>0.01)withA(ctx,o.dash,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(BA_RED,0.95);ctx.lineWidth=3;rr(ctx,x-6,y-6,w+12,312,20);ctx.stroke();ctx.restore();});
  withA(ctx,L[0],()=>T(ctx,"customers · built in 2023",x+24,y+46,{f:"mono",w:500,size:28,color:rgba(TECH,1)}));
  withA(ctx,L[1],()=>T(ctx,"one customer per address",x+24,y+108,{w:700,size:32}));
  withA(ctx,L[2],()=>{T(ctx,"accounts and connection",x+24,y+156,{w:700,size:32});T(ctx,"points, merged",x+24,y+198,{w:700,size:32});});
  withA(ctx,L[3],()=>T(ctx,"owner: none",x+24,y+262,{w:700,size:30,color:rgba(BA_RED,1)}));});}
// a small window onto the village: the qanat at its outlet, a digger keeping the channel, the mirab at a gate whose turn it is
function b1_inset(ctx,t,x,y,w,h,a,o){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-6,y-6,w+12,h+12,22,BAC,{glow:16,ea:0.8,fill:"rgba(8,14,24,0.96)"});
  const cx=1690,cy=740,z=1.3;ctx.save();rr(ctx,x,y,w,h,18);ctx.clip();ctx.translate(x+w/2,y+h/2);ctx.scale(z,z);ctx.translate(-cx,-cy);
  ba_secSky(ctx,{warm:0.35});ba_section(ctx,t,{});ba_village(ctx,t,{wet:[0.9,0.92,0.9,0.86],fill:[0,o.lift,0,0]});ba_channel(ctx,t,2230,1);B1_GATES.forEach((gx,i)=>ba_gate(ctx,gx,i===1?o.lift:0,1));
  ba_fig(ctx,1500,ba_ys(1500),B1_S,{kind:"stoop",hold:"pick",head:"cap",f:1,rimA:0.7,t});
  const gx=B1_GATES[1];ba_fig(ctx,gx-16,ba_ys(gx-16),B1_S,{dress:"robe",head:"turban",f:1,reach:[gx-7,ba_ys(gx)-12-o.lift*16],rimA:0.6,t});
  ba_fig(ctx,1830,ba_ys(1830),B1_S,{dress:"chador",f:-1,rimA:0.6,t});ctx.restore();
  const at=(wx,wy)=>[x+w/2+(wx-cx)*z,y+h/2+(wy-cy)*z];
  const[ax,ay]=at(1500,700);withA(ctx,o.tagA,()=>tag(ctx,ax,ay,"keeps the channel",TECH,{align:"center",size:28}));
  const[bx,by]=at(gx-12,690);withA(ctx,o.tagB,()=>tag(ctx,bx+40,by-30,"whose turn: not the diggers' call",AMBER,{align:"center",size:28}));});}
scene("whose",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});
  ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
  const tWho=c("who"),tAn=c("analyst"),tCh=c("choose"),tAc=c("account"),tPo=c("point"),tNo=c("none"),tTu=c("turn");
  // first, the picture as Three answers left it: the ticket, the three counts with their ticks, and the question
  const up=ease(clamp((t-tWho+0.2)/1.3,0,1)),cy=lerp(380,110,up),dim=fin(t,tTu-0.5,0.8);
  withA(ctx,1-fin(t,tWho-0.7,0.5),()=>baTicket(ctx,430,70,1060,Object.assign({state:"open"},B1_TICKET)));
  withA(ctx,1-dim*0.75,()=>B1_COUNTS.forEach(([x,num,what,src,col],i)=>baCount(ctx,x,cy,520,200,num,what,src,col,{mark:1-fin(t,tWho-0.6,0.5),ok:true,hi:i===2?pulseAt(t,w("pick","fix its own")-0.1,1.4):0})));
  withA(ctx,1-fin(t,0.9,0.5),()=>tag(ctx,960,690,"which one is a customer?",AMBER,{align:"center",size:36}));
  // the data team's first ideas
  const idA=1-fin(t,tWho-0.6,0.5);
  arrive(ctx,660,640,t,w("pick","pick one")-0.2,()=>withA(ctx,idA,()=>tag(ctx,660,640,"pick one?",AMBER,{align:"center",size:32})),{dy:10});
  arrive(ctx,1540,640,t,w("pick","fix its own")-0.2,()=>withA(ctx,idA,()=>tag(ctx,1540,640,"fix our own table?",AMBER,{align:"center",size:32})),{dy:10});
  // Tomás asks who decided what the table counts
  const tomA=1-fin(t,tAc-0.8,0.6);if(t>tWho-0.3)arrive(ctx,320,760,t,tWho-0.3,()=>withA(ctx,tomA,()=>{person(ctx,"tomas",320,1050,0.74,{t,expr:"calm"});tag(ctx,320,486,"who decided what it counts?",TECH,{align:"center",size:30});}),{dy:20});
  // the analyst's rule, three years ago, for a deadline: one per address, both merged into it
  const sA=fin(t,tAn-0.4,0.6),mergeA=fin(t,w("analyst","merged")-0.4,0.6)*(1-fin(t,tAc-0.8,0.6));
  if(mergeA>0.01){arrowTo(ctx,380,cy+204,1272,450,BA_RET,0.85*mergeA,{p:clamp((t-w("analyst","merged")+0.4)/0.9,0,1),bend:-0.14,lw:3,head:12});arrowTo(ctx,960,cy+204,1272,500,BA_NET,0.85*mergeA,{p:clamp((t-w("analyst","merged")+0.2)/0.9,0,1),bend:-0.12,lw:3,head:12});}
  if(t>tAn-0.4)arrive(ctx,1540,510,t,tAn-0.4,()=>b1_script(ctx,1280,360,520,{a:sA*(1-dim*0.75),lines:[fin(t,w("analyst","three years ago")-0.3,0.5),fin(t,w("analyst","one customer per address")-0.2,0.5),fin(t,w("analyst","merged")-0.4,0.5),fin(t,w("none","no owner")-0.3,0.5)],dash:fin(t,w("none","no owner")-0.2,0.5)}),{dy:14});
  // nobody in the business had said which customer the report meant: an empty place for its definition, filled by someone's choice
  const dA=fin(t,tCh-0.2,0.6)*(1-fin(t,tAc-0.8,0.6));
  if(dA>0.01)withA(ctx,dA,()=>{ctx.save();ctx.setLineDash([10,9]);ctx.strokeStyle=rgba(TRUST,0.8);ctx.lineWidth=2.5;rr(ctx,600,400,560,150,16);ctx.stroke();ctx.restore();
    T(ctx,"the business's definition",628,450,{f:"mono",w:500,size:28,color:rgba(TRUST,1)});T(ctx,"none given",628,512,{w:700,size:34,color:rgba(INK,0.7)});
    arrowTo(ctx,1164,476,1272,476,AMBER,0.9*fin(t,w("choose","someone had to choose")-0.2,0.5),{lw:3,head:12});
    withA(ctx,fin(t,w("choose","someone had to choose")-0.1,0.5),()=>tag(ctx,880,600,"someone had to choose",AMBER,{align:"center",size:30}));});
  // what an account and a connection point are, each from its owner
  b1_object(ctx,120,360,520,"account","someone who pays a bill","head of retail",fin(t,tAc-0.2,0.6)*(1-dim*0.75),{ownerA:fin(t,w("account","head of retail")-0.2,0.5)});
  b1_object(ctx,700,360,520,"connection point","a place power is delivered","Grace, network",fin(t,tPo-0.2,0.6)*(1-dim*0.75),{ownerA:fin(t,w("point","Grace")-0.2,0.5)});
  withA(ctx,fin(t,w("none","confirmed")-0.3,0.5)*(1-dim),()=>tag(ctx,1540,712,"never confirmed by the business",BA_RED,{align:"center",size:28}));
  // in the village, the diggers don't decide whose turn it is
  b1_inset(ctx,t,460,230,1000,560,dim,{lift:fin(t,tTu+0.4,1.2),tagA:fin(t,tTu+0.2,0.5),tagB:fin(t,tTu+0.9,0.5)});
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Who owns what ---------- */
const B1_BIZ=[["what its data means","what its data means"],["who creates it","who creates it"],["the rules on it","the rules on it"],["the quality it needs","the quality it needs"],["the decisions it serves","the decisions it serves"]];
const B1_TEAM=[["how it's stored","stored"],["how it's moved","moved"],["how it's checked","checked"]];
scene("owns",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,x:860,y:480});
  const tTe=c("team"),tLi=c("like"),tBo=c("both");
  // two columns, written by hand: what the business owns, and what the data team owns
  arrive(ctx,470,162,t,c("writes")-0.1,()=>T(ctx,"the business owns",470,172,{w:800,size:36,align:"center",color:rgba(BIZ,1)}),{dy:-10});
  B1_BIZ.forEach(([s_,k],i)=>{const t0=w("business",k)-0.2;if(t<t0)return;sticky(ctx,470,250+i*92,460,76,s_,{col:NOTEC[0],size:30,p:clamp((t-t0)/0.7,0,1),rot:[-0.012,0.01,-0.008,0.012,-0.01][i]});});
  arrive(ctx,1080,162,t,tTe-0.2,()=>T(ctx,"the data team owns",1080,172,{w:800,size:36,align:"center",color:rgba(TECH,1)}),{dy:-10});
  B1_TEAM.forEach(([s_,k],i)=>{const t0=w("team",k)-0.2;if(t<t0)return;sticky(ctx,1080,250+i*92,420,76,s_,{col:NOTEC[2],size:30,p:clamp((t-t0)/0.6,0,1),rot:[0.01,-0.012,0.008][i]});});
  // like the shareholders and the diggers
  arrive(ctx,470,724,t,w("like","one owns")-0.2,()=>tag(ctx,470,724,"the shareholders: the water and its rules",BIZ,{align:"center",size:30}),{dy:10});
  arrive(ctx,1080,540,t,w("like","the other keeps")-0.2,()=>tag(ctx,1080,540,"the diggers: the channel",TECH,{align:"center",size:30}),{dy:10});
  // both matter
  if(t>w("both","A channel nobody")-0.2)sticky(ctx,1080,646,420,92,"a channel nobody "+ba_nb("keeps silts up"),{col:NOTEC[1],size:30,p:clamp((t-w("both","A channel nobody")+0.2)/0.8,0,1),rot:-0.014});
  if(t>w("both","water nobody owns")-0.2)sticky(ctx,470,812,460,92,"water nobody owns "+ba_nb("is fought over"),{col:NOTEC[1],size:30,p:clamp((t-w("both","water nobody owns")+0.2)/0.8,0,1),rot:0.012});
  arrive(ctx,1760,760,t,0.2,()=>baPersonR(ctx,"tomas",1760,1040,0.8,{t,expr:"calm"}),{dy:20});
  ctx.restore();vign(ctx,S);});

/* ---------- 6. Only what data needs ---------- */
// BIZBOK's core, its four parts in the layers' colours; the parts around it; and more that business architecture covers, beyond data
const B1_CORE=[["capabilities",590,330,BA_STR,"capabilities"],["value streams",970,330,BA_STR,"value streams"],["information",590,470,BA_INF,"information"],["the organisation",970,470,BA_BUS,"the organisation"]];
const B1_AROUND=[["stakeholders",700,240,"stakeholders",0],["products",1220,240,"products",0],["policies",700,660,"policies",1],["initiatives",1220,660,"initiatives",0],["and more",960,742,"and more",0]];
const B1_WIDER=[["partners",330,330,"partners"],["finance",330,470,"finance"],["organisation design",1590,400,"how the organisation"]];
// the four films to come, and the parts each draws on; a film's number on each part it draws on
function b1_badge(ctx,x,y,n,a,hi){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor=rgba(BAC,0.7);ctx.shadowBlur=10+16*(hi||0);ctx.fillStyle="rgba(7,12,24,0.97)";ctx.beginPath();ctx.arc(x,y,25,0,TAU);ctx.fill();ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(BAC,1);ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x,y,25,0,TAU);ctx.stroke();ctx.restore();T(ctx,n+"",x,y+10,{f:"mono",w:600,size:28,align:"center",color:rgba(BAC,1)});});}
const B1_NEXT=[[2,"What the business needs to know","What the business",[2]],[3,"Who creates it, who owns it","Who creates",[0,3]],[4,"Processes, as deep as data needs","The processes",[1]],[5,"Rules and expectations the business owns","The rules",["policies"]]];
scene("parts",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});
  ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
  const tOn=c("only"),tF=c("four"),tE=c("each"),only=fin(t,tOn-0.2,0.8),mv=ease(clamp((t-tF+0.6)/1.4,0,1));
  // the diagram slides left and a little smaller to make room for the films
  const k=lerp(1,0.94,mv),dx=lerp(0,-440,mv);ctx.save();ctx.translate(960+dx,480);ctx.scale(k,k);ctx.translate(-960,-480);
  arrive(ctx,960,150,t,w("core","BIZBOK")-0.2,()=>T(ctx,"the BIZBOK Guide · its core",960,156,{f:"mono",w:500,size:30,align:"center",color:rgba(SOFT,1)}),{dy:-10});
  const pos={};B1_CORE.forEach(([nm,x,y,col,kw],i)=>{pos[i]=[x+180,y+55];const t0=w("core",kw)-0.2;if(t<t0)return;
    arrive(ctx,x+180,y+55,t,t0,()=>{glass(ctx,x,y,360,110,16,col,{glow:12+16*pulseAt(t,t0+0.2,1.4),ea:0.85,fill:"rgba(7,12,24,0.95)"});ctx.fillStyle=rgba(col,0.12);rr(ctx,x,y,360,110,16);ctx.fill();T(ctx,nm,x+180,y+68,{w:800,size:34,align:"center"});},{dy:12});});
  // around the core: the parts that matter for data stay lit, the rest dim
  B1_AROUND.forEach(([nm,x,y,kw,data])=>{pos[nm]=[x,y];const t0=w("around",kw)-0.2;if(t<t0)return;const dimA=data?1:1-0.72*only;
    arrive(ctx,x,y,t,t0,()=>withA(ctx,dimA*(1-fin(t,tF-0.4,0.6)*(data?0:1)),()=>tag(ctx,x,y,nm,data?BA_RET:SOFT,{align:"center",size:30})),{dy:10});});
  // much more than data: products again, partners, finance, how the organisation is designed
  if(t>w("wider","products")-0.3)glow(ctx,1220,240,110,SOFT,0.3*pulseAt(t,w("wider","products")-0.2,1.4));
  B1_WIDER.forEach(([nm,x,y,kw])=>{const t0=w("wider",kw)-0.2;if(t<t0)return;arrive(ctx,x,y,t,t0,()=>withA(ctx,(1-0.72*only)*(1-fin(t,tF-0.4,0.6)),()=>tag(ctx,x,y,nm,SOFT,{align:"center",size:30})),{dy:10});});
  // only what matters for data: a line round the parts kept
  const oA=fin(t,w("only","only")-0.2,0.8);if(oA>0.01)withA(ctx,oA,()=>{ctx.save();ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(BAC,0.85);ctx.lineWidth=3;rr(ctx,560,300,800,420,26);ctx.stroke();ctx.restore();
    T(ctx,"what matters for data",960,286,{w:800,size:30,align:"center",color:rgba(BAC,1)});});
  ctx.restore();
  // the four films to come, each drawing on its parts, one film each
  const toS=([x,y])=>[960+dx+(x-960)*k,480+(y-480)*k];
  B1_NEXT.forEach(([n,title,kw,parts],i)=>{const t0=w("four",kw)-0.2;if(t<t0)return;const y=236+i*136,hi=pulseAt(t,tE+i*0.35,1.0);
    // each part the film draws on takes its number, at its corner, as the film's card comes in
    parts.forEach(pt=>{const[px,py]=toS(pos[pt]),bx=typeof pt==="string"?px+104*k:px+176*k,by=typeof pt==="string"?py-12*k:py-51*k;glow(ctx,px,py,150,BAC,0.22*pulseAt(t,t0+0.2,1.2));
      arrive(ctx,bx,by,t,t0+0.25,()=>b1_badge(ctx,bx,by,n,1,hi),{dy:-8});});
    arrive(ctx,1470,y+50,t,t0,()=>{glass(ctx,1120,y,720,100,16,BAC,{glow:10+18*hi,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(ctx,n+"",1150,y+62,{f:"mono",w:500,size:30,color:rgba(BAC,1)});T(ctx,title,1196,y+62,{w:700,size:30});},{dy:12});});
  withA(ctx,fin(t,tF-0.3,0.6),()=>T(ctx,"the films to come",1120,206,{f:"mono",w:500,size:28,color:rgba(SOFT,1)}));
  ctx.restore();vign(ctx,S);});

/* ---------- 7. The owners answer ---------- */
scene("answer",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});
  ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
  const tAm=c("ama"),tBo=c("both"),tBu=c("builds"),tRe=c("retired"),tCk=c("checks"),tSa=c("same"),out=fin(t,tSa-0.6,0.6),later=fin(t,tSa+0.1,0.7);
  // the ticket, back to the person who asked, with one question
  const st=t<w("checks","checks")-0.1?["open",AMBER]:t<w("checks","closes")-0.1?["checked by Ama",TRUST]:["closed",BA_OK];
  arrive(ctx,670,190,t,0.3,()=>baTicket(ctx,120,70,1100,Object.assign({},B1_TICKET,{state:st[0],stateCol:st[1],hi:pulseAt(t,w("ama","asked for it")-0.2,1.4)+pulseAt(t,w("checks","closes")-0.1,1.2)})),{dy:-16});
  const rA=1-fin(t,tBo-0.6,0.5);
  arrive(ctx,690,400,t,w("back","one question")-0.2,()=>withA(ctx,rA,()=>{glass(ctx,160,340,1060,130,16,TECH,{glow:12,ea:0.85,fill:"rgba(6,12,22,0.95)"});T(ctx,"reply · data team",188,384,{f:"mono",w:500,size:28,color:rgba(TECH,1)});T(ctx,"Which customers does the report mean?",188,440,{w:700,size:36});}),{dy:12});
  // Ama decides, with the two owners
  arrive(ctx,1700,760,t,tAm-0.3,()=>baPersonR(ctx,"ama",1700,1050,0.8,{t,expr:t>tSa+0.6?"relieved":"calm"}),{dy:20});
  withA(ctx,fin(t,w("ama","obligations")-0.2,0.5)*(1-out),()=>tag(ctx,1660,330,"owns the utility's obligations",TRUST,{align:"center",size:28}));
  withA(ctx,fin(t,w("ama","She decides")-0.2,0.5)*(1-out),()=>{tag(ctx,1660,394,"decides, with Grace",TRUST,{align:"center",size:28});tag(ctx,1660,452,"and the head of retail",TRUST,{align:"center",size:28});});
  // both counts, each by its own name; built from the definitions and tested
  const dA=fin(t,tBo-0.2,0.6)*(1-out);
  if(t>tBo-0.2)arrive(ctx,690,490,t,tBo-0.2,()=>withA(ctx,1-out,()=>{glass(ctx,160,340,1060,300,16,TRUST,{glow:12,ea:0.85,fill:"rgba(16,12,6,0.95)"});T(ctx,"decided · Ama, with both owners",188,386,{f:"mono",w:500,size:28,color:rgba(TRUST,1)});
    [[w("both","accounts"),BA_RET,"accounts, as retail defines them","310,000"],[w("both","connection points"),BA_NET,"connection points, as the network does","540,000"]].forEach(([t0,col,s_,n],i)=>{const y=460+i*96,q=fin(t,t0-0.2,0.5);if(q<=0.01)return;
      withA(ctx,q,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(204,y-11,10,0,TAU);ctx.fill();T(ctx,s_,232,y,{w:700,size:32});});
      withA(ctx,fin(t,tBu-0.1+i*0.3,0.5),()=>T(ctx,n,1080,y,{w:800,size:36,align:"right"}));kt_gtick(ctx,1160,y-11,17,fin(t,w("builds","tests them")-0.2+i*0.3,0.5));});}),{dy:12});
  withA(ctx,fin(t,tBu+0.4,0.5)*(1-out),()=>tag(ctx,690,690,"built from the owners' definitions, and tested",TECH,{align:"center",size:28}));
  // the merged table, retired
  const mA=fin(t,tRe-0.3,0.5)*(1-out),gone=fin(t,w("retired","never the business's")-0.4,0.8);
  if(mA>0.01)withA(ctx,mA,()=>{withA(ctx,1-0.55*gone,()=>{glass(ctx,1280,560,300,130,16,TECH,{glow:10,ea:0.7,fill:"rgba(6,12,22,0.95)"});T(ctx,"customers",1304,606,{f:"mono",w:500,size:28,color:rgba(TECH,1)});T(ctx,"merged table",1304,660,{w:700,size:30});});
    ctx.save();ctx.strokeStyle=rgba(BA_RED,0.9);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(1296,624);ctx.lineTo(lerp(1296,1564,ease(gone)),624+lerp(0,8,gone));ctx.stroke();ctx.restore();withA(ctx,gone,()=>tag(ctx,1430,730,"retired",BA_RED,{align:"center",size:28}));});
  // this year: both reports agree, and each number says what it counts
  if(later>0.01)withA(ctx,later,()=>{const R2=["310,000 accounts","540,000 connection points"];
    arrive(ctx,470,500,t,tSa+0.1,()=>b1_report(ctx,140,380,620,"annual report · 2026",R2,1,{h:230,size:36,rot:-0.012}),{dy:14});
    arrive(ctx,1140,500,t,tSa+0.4,()=>b1_report(ctx,830,380,620,"regulator's return · 2026",R2,1,{h:230,size:36,rot:0.01}),{dy:14});
    withA(ctx,fin(t,w("same","agree")-0.2,0.5),()=>{glow(ctx,795,500,60,BA_OK,0.35);T(ctx,"=",795,522,{w:800,size:64,align:"center",color:rgba(BA_OK,1)});});
    withA(ctx,fin(t,w("same","each number")-0.2,0.5),()=>tag(ctx,795,700,"each number says what it counts",BA_OK,{align:"center",size:30}));});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. The data practice on the map ---------- */
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});
  ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
  const tAc=w("actor","business actor")-0.3,tSe=w("actor","business services")-0.3,tTi=w("tickets","tickets")-0.3,tOb=w("objects","Account")-0.3,tCp=w("objects","connection point")-0.3,tOw=w("objects","owners")-0.3;
  arrive(ctx,500,120,t,c("itself")-0.1,()=>{T(ctx,"the data practice, on the map",120,128,{w:800,size:38});tag(ctx,1800-tw(ctx,"business layer",28,700)-26,116,"business layer",BA_BUS,{size:28});},{dy:-10});
  const fl=fin(t,c("fills")-0.2,0.6);
  baPractice(ctx,t,{film:1,at:{team:tAc,requests:tSe,tickets:tTi,account:tOb,cp:tCp},pre:fin(t,w("itself","the data practice")-0.2,0.8),owners:true,ownersA:fin(t,tOw,0.6),hi:{requests:pulseAt(t,w("actor","answering")-0.1,1.4),tickets:pulseAt(t,w("tickets","its interface")-0.1,1.4)},
    ghost:fl,ghostAt:{2:w("fills","glossary")-0.3,3:w("fills","owners")-0.3,4:w("fills","processes")-0.3,5:w("fills","products")-0.3}});
  baPracticeLine(ctx,"team","tickets",clamp((t-tTi-0.3)/0.6,0,1),BA_BUS);baPracticeLine(ctx,"tickets","requests",clamp((t-tTi-0.6)/0.6,0,1),BA_BUS);
  baPracticeAccess(ctx,"requests","cp",clamp((t-tOb-0.4)/0.9,0,1));baPracticeAccess(ctx,"requests","account",clamp((t-tOb-0.6)/1.1,0,1),{lift:330});
  withA(ctx,fin(t,w("objects","stays with")-0.2,0.5)*(1-fl),()=>tag(ctx,1449,560,"what they mean stays with their owners",TRUST,{align:"center",size:28}));
  // film by film, the practice fills in
  [["its glossary",1245,722,"glossary"],["its owners",1440,212,"owners"],["its processes",800,390,"processes"],["its products",800,658,"products"]].forEach(([s_,x,y,k])=>{const t0=w("fills",k)-0.2;if(t<t0)return;arrive(ctx,x,y,t,t0,()=>tag(ctx,x,y,s_,BAC,{align:"center",size:30}),{dy:10});});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. The water and the channel ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tU=c("utility"),tN=c("next"),wall=fin(t,tN-0.9,1.3);
  if(wall<0.99){setScreen(ctx,S);ctx.save();focus(ctx,t,[[0,880,560,0.8],[2,900,575,0.84]],10);
    ba_aerial(ctx,t,{warm:0.45,lit:1,litP:1,flow:1,green:0.85});
    const vOut=1-fin(t,tU-0.6,0.5),uOut=1-fin(t,tN-0.6,0.5);
    baTagAt(ctx,S,BA_CHAIN[9][0],BA_CHAIN[9][1],"the diggers: keep the channel",TECH,{dy:-56,a:fin(t,w("village","diggers")-0.2,0.5)*vOut});
    baTagAt(ctx,S,1574,830,"the shareholders: whose water it is",BIZ,{a:fin(t,w("village","shareholders")-0.2,0.5)*vOut});
    baTagAt(ctx,S,BA_CHAIN[9][0],BA_CHAIN[9][1],"the data team: keeps the channel",TECH,{dy:-56,a:fin(t,w("utility","data team")-0.2,0.5)*uOut});
    baTagAt(ctx,S,1574,830,"the business: what flows in it, and what it means",BIZ,{a:fin(t,w("utility","What flows")-0.2,0.5)*uOut});
    ctx.restore();}
  // back at the wall: Tomás's next note
  if(wall>0.01)withA(ctx,wall,()=>{wallBg(ctx,S,t);ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
    arrive(ctx,860,420,t,tN-0.2,()=>sticky(ctx,860,420,560,150,"What does the business "+ba_nb("need to know?"),{col:NOTEC[0],size:36,rot:-0.02}),{dy:-16});
    baPersonR(ctx,"tomas",1700,1040,0.8,{t,expr:"calm"});ctx.restore();});
  vign(ctx,S);
  baEnd(ctx,S,t,B+0.8,"What the business owns","The business owns what its data means. "+ba_nb("The data team keeps the channel."),"Film 1 of 5");});

// where the chapters meet (From words to data's joins.js): Whose meaning? opens on the ticket and the three counts as Three answers
// leaves them, so its camera carries on from there and nothing shows twice
const CHAPTER_JOINS={glide:["whose"]};
