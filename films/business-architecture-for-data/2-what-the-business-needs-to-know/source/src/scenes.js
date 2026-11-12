/* ===== What the business needs to know: scenes =====
   Nine chapters, as in ../script.md. The qanats of Iran: a qanat's water is owned in shares of time, but a share didn't mean the same
   everywhere; in the 1960s, when the government asked for written deeds, some villages' deeds added up to more than a day of water;
   in Mahan, near Kerman, one qanat's shares were measured against the day itself, fifteen of them to a day, so they add up to the
   water; another, shared by three men in the 1860s, passed bit by bit to some seventy families. Then Tomás's next note: the
   capabilities on his map, and the concepts each one needs; the industry's reference models, as a first draft; what each capability
   needs; the business's own words, one definition in each domain; a concept nobody holds, hosting capacity; the glossary, drawn from
   the map; the data practice's domains; and back to Mahan.
   The story's pictures (the qanat cut away, its village and people, the day of water as a dial) are the series' own, in
   ../../../shared/src/ba.js. Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is
   texture. Motion: the camera glides between what the narration names and things arrive with a spring; in one room nothing is cut,
   what moves slides there, and a panel's contents leave before the next come in. Sound: every effect in tools/score.py fires at the
   same moment as the thing it belongs to here, so keep the two in step. */

// a tag whose right end sits at x (the engine's tags start at x, or centre on it)
function b2_tagR(ctx,x,y,s,col,o){o=o||{};const sz=o.size||28;tag(ctx,x-tw(ctx,s,sz,700)-26,y,s,col,{size:sz});}
// a dashed chip: something still to come, such as data nobody has yet
function b2_chip(ctx,x,y,w,s,col,o){o=o||{};ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;rr(ctx,x,y,w,60,12);ctx.stroke();ctx.restore();
  ctx.fillStyle=rgba(col,0.08);rr(ctx,x,y,w,60,12);ctx.fill();T(ctx,s,x+w/2,y+40,{w:700,size:o.size||28,align:"center",color:rgba(col,1)});}

/* ---------- 1. A share of water ---------- */
// the village's people: four shareholders by their fields, in what they wear, and a child beside the fourth
const B2_GATES=BA_VFIELDS.map(([x])=>x-6),B2_S=0.14;
const B2_OWNERS=[[1640,-1,{dress:"robe",head:"turban"}],[1790,1,{dress:"tunic",head:"cap"}],[1990,-1,{dress:"chador"}],[2150,-1,{dress:"robe",head:"cap"}]];
// each owner's colour on the bar of the day: sand, clay, sage and rose, muted so the water's blue stands out
const B2_OC=[[222,178,120],[196,140,100],[166,174,118],[212,148,138]];
// One panel above the village, in the same place all through the story: what a share is. Its contents change in place, each
// leaving before the next comes in: a day of water in its owners' shares, two turns of the water, and the deeds of the 1960s
const B2_PX=430,B2_PY=40,B2_PW=1300,B2_PH=260;
function b2_panel(ctx,a){if(a<=0.01)return;withA(ctx,a,()=>glass(ctx,B2_PX,B2_PY,B2_PW,B2_PH,22,BAC,{glow:14,ea:0.75,fill:"rgba(8,14,24,0.92)"}));}
// One day of the qanat's water as a bar, in its owners' shares, each lit in its turn. o.lit[i] (0..1): share i's turn; o.sold,
// o.split, o.heir (0..1): the second share passes to a new owner, the third is split in two, the fourth goes to a child; o.q (0..1):
// those three leave (its first half), then the question comes in (its second)
function b2_daybar(ctx,a,o){if(a<=0.01)return;o=o||{};const X=490,Wd=1180,y=118,h=58,sw=Wd/4;
  withA(ctx,a,()=>{T(ctx,"one day of the qanat's water",X,96,{w:700,size:30,color:rgba(INK,0.95)});
    for(let i=0;i<4;i++){const x0=X+i*sw,lit=o.lit?o.lit[i]||0:0;let c=B2_OC[i];if(i===1)c=mix(c,[150,170,200],o.sold||0);if(i===3)c=mix(c,[236,210,170],o.heir||0);
      const parts=i===2?[[0,0.5,c],[0.5,1,mix(c,[200,190,150],o.split||0)]]:[[0,1,c]],gp=i===2?8*(o.split||0):0;
      parts.forEach(([u0,u1,cc],j)=>{const xa=x0+3+u0*(sw-6)+(j?gp/2:0),xb=x0+3+u1*(sw-6)-(j?0:gp/2);ctx.fillStyle=rgba(mix(cc,BA_WATER,lit),0.45+0.45*lit);ctx.fillRect(xa,y,xb-xa,h);});
      if(lit>0.01){ctx.strokeStyle=rgba(BA_WATER,lit);ctx.lineWidth=3;ctx.strokeRect(x0+2,y-2,sw-4,h+4);glow(ctx,x0+sw/2,y+h/2,90,BA_WATER,0.3*lit);}}
    ctx.strokeStyle="rgba(255,255,255,0.18)";ctx.lineWidth=2;for(let hh=0;hh<=24;hh+=6){const x=X+hh/24*Wd;ctx.beginPath();ctx.moveTo(x,y+h+6);ctx.lineTo(x,y+h+16);ctx.stroke();}
    const q=o.q||0,qo=clamp(q*2,0,1),qi=clamp(q*2-1,0,1);[["sold",1,o.sold],["split",2,o.split],["left to a child",3,o.heir]].forEach(([s_,i,v])=>{const va=(v||0)*(1-qo);if(va>0.01)withA(ctx,va,()=>tag(ctx,X+i*sw+sw/2,y+h+56,s_,AMBER,{align:"center",size:28}));});
    if(qi>0.01)withA(ctx,qi,()=>tag(ctx,X+Wd/2,y+h+56,"one share: the same everywhere?",AMBER,{align:"center",size:28}));});}
// Two turns of the water: on one qanat a share comes round every six days, on another every twenty-two. Each row is the days of its
// turn, with the share's own day lit; o.l6, o.l22 (0..1) bring in each row's words, o.p6, o.p22 (0..1) its days
function b2_turns(ctx,a,o){if(a<=0.01)return;o=o||{};const X=880,Wd=820;
  withA(ctx,a,()=>{[["one qanat: every 6 days",6,o.l6,o.p6,90],["another: every 22 days",22,o.l22,o.p22,196]].forEach(([lab,n,l,p,y])=>{
      if((l||0)>0.01)withA(ctx,l,()=>T(ctx,lab,470,y+38,{w:700,size:30,color:rgba(INK,0.95)}));if((p||0)<=0.01)return;const cw=Wd/n;
      for(let i=0;i<n;i++){const q=clamp(p*n-i,0,1);if(q<=0)break;ctx.fillStyle=rgba(i===0?BA_WATER:BA_SAND,(i===0?0.75:0.3)*q);ctx.fillRect(X+i*cw+2,y,(cw-4)*q,52);}
      if(p>0.2)withA(ctx,clamp((p-0.2)*3,0,1),()=>{ctx.strokeStyle=rgba(BA_WATER,1);ctx.lineWidth=3;ctx.strokeRect(X+1,y-2,cw-2,56);glow(ctx,X+cw/2,y+26,70,BA_WATER,0.25);});});});}
// The deeds of the 1960s on one day of water: each a slip of paper with its hours, laid along the day; the last runs past the
// twenty-four hours, in red. o.n (0..7): how many have landed; o.over (0..1): the overflow named; o.q (0..1): what was needed
const B2_DEEDS=[6,5,4,4,3,2,2];
function b2_deeds(ctx,a,o){if(a<=0.01)return;o=o||{};const X=490,Wd=1008,hw=Wd/24,y=120,h=74;
  withA(ctx,a,()=>{T(ctx,"one day of water: 24 hours",X,96,{w:700,size:30,color:rgba(INK,0.95)});
    ctx.strokeStyle=rgba(INK,0.5);ctx.lineWidth=3;ctx.strokeRect(X-2,y-6,Wd+4,h+12);
    let hx=0;B2_DEEDS.forEach((d,i)=>{const q=clamp((o.n||0)-i,0,1);const x0=X+hx*hw;hx+=d;if(q<=0)return;const k=spring(q*1.3),dy=(1-k)*-90,rot=(1-k)*(hash(i,41)-0.5)*0.5,over=X+hx*hw>X+Wd+1;
      ctx.save();ctx.translate(x0+d*hw/2,y+h/2+dy);ctx.rotate(rot);ctx.globalAlpha*=clamp(q*3,0,1);ctx.fillStyle=over?"rgba(240,206,196,0.97)":"rgba(238,230,212,0.97)";ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=10;ctx.fillRect(-d*hw/2+2,-h/2,d*hw-4,h);ctx.shadowBlur=0;
      ctx.strokeStyle="rgba(90,70,50,0.35)";ctx.lineWidth=1.5;for(let k2=0;k2<2;k2++){ctx.beginPath();ctx.moveTo(-d*hw/2+12,-h/2+16+k2*9);ctx.lineTo(d*hw/2-12-k2*14,-h/2+16+k2*9);ctx.stroke();}
      T(ctx,d+" h",0,h/2-14,{w:800,size:28,align:"center",color:over?"rgba(170,40,30,1)":"rgba(52,40,30,0.95)"});ctx.restore();});
    // past the end of the day
    const ov=o.over||0;if(ov>0.01)withA(ctx,ov,()=>{ctx.fillStyle=rgba(BA_RED,0.22);ctx.fillRect(X+Wd+2,y-10,2*hw+12,h+20);ctx.strokeStyle=rgba(BA_RED,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(X+Wd+2,y-18);ctx.lineTo(X+Wd+2,y+h+18);ctx.stroke();
      b2_tagR(ctx,B2_PX+B2_PW-24,y+h+50,"26 hours of deeds in a day of 24",BA_RED);});
    if((o.q||0)>0.01)withA(ctx,o.q,()=>tag(ctx,X,y+h+50,"a share has to mean the same to everyone",AMBER,{size:28}));});}
// the village, cut away, as the chapter's state st says: the qanat and its water, the fields, the gates, the shareholders and a child
function b2_village(ctx,t,st){ba_secSky(ctx,{warm:0.35});ba_section(ctx,t,{});ba_village(ctx,t,{wet:st.wet,fill:st.fill});ba_channel(ctx,t,2230,1);
  B2_GATES.forEach((x,i)=>ba_gate(ctx,x,st.gate[i],1));
  B2_OWNERS.forEach(([x,f,o],i)=>{const a=st.own[i];if(a>0.01)ba_fig(ctx,x+(st.dx?st.dx[i]:0),ba_ys(x),B2_S,Object.assign({f,a,t,rimA:0.6},o));});
  if(st.child>0.01)ba_fig(ctx,2196,ba_ys(2196),B2_S*0.68,{dress:"tunic",head:"cap",f:-1,a:st.child,t,rimA:0.6});
  if(st.dim>0.01){ctx.save();ctx.fillStyle="rgba(10,8,6,"+(0.42*st.dim)+")";ctx.fillRect(-1400,-900,4700,2900);ctx.restore();}}
// the days of water in Mahan: the first qanat's, in the middle and then aside; and another's, beside it
const B2_DX=640,B2_DY=500,B2_DR=290,B2_D2=[1240,520,240];
// three men, as the story's silhouettes, standing by the second qanat's day, in a pool of warm light so they read on the dark
function b2_three(ctx,t,a){if(a<=0.01)return;glow(ctx,1680,620,260,BA_SAND,0.3*a);[[1590,1],[1680,-1],[1770,-1]].forEach(([x,f],i)=>{ctx.save();const g=ctx.createRadialGradient(x,700,2,x,700,70);g.addColorStop(0,"rgba(0,0,0,0.35)");g.addColorStop(1,"rgba(0,0,0,0)");
  ctx.globalAlpha*=a;ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,700,70,12,0,0,TAU);ctx.fill();ctx.restore();ba_fig(ctx,x,700,0.5,{dress:i===1?"tunic":"robe",head:i===2?"cap":"turban",f,a,t,rimA:0.8});});}
scene("shares",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tSo=c("sold"),tSa=c("same"),tTu=c("turns"),tDe=c("deeds"),tAd=c("added"),tFo=c("fought"),tNe=c("needed"),tMa=c("mahan"),tSe=c("seventy"),tMe=c("meant"),tLi=c("link");
  // the village; then, in Mahan, the days of water: the whole picture changes, so the two dissolve
  const dialA=fin(t,tMa-0.8,1.2);
  if(dialA<0.99){setScreen(ctx,S);ctx.save();
    focus(ctx,t,[[0,1880,690,1.45],[tSo-0.6,1900,712,1.85],[tSa-0.2,1880,690,1.5],[w("deeds","farmers")-0.6,1860,712,1.8],[tFo-0.4,1890,725,2.25],[tNe-0.2,1880,690,1.5]],2.0);
    // the turns: each field's gate lifted as the water comes round to it; in the disputes, the fields dry and two owners walk away
    const T0=[1.2,3.2,5.2,7.2],cut=fin(t,w("fought","broke apart")-0.4,2.0),leave=fin(t,w("fought","broke apart")-0.2,1.6);
    const fill=[0,1,2,3].map(i=>fin(t,T0[i],0.4)*(1-fin(t,T0[i]+1.8,0.4))),wet=[0,1,2,3].map(()=>lerp(0.86,0.22,cut));
    b2_village(ctx,t,{wet,fill,gate:fill,own:[0,1,2,3].map(i=>(i===0||i===3?1-leave:1)*fin(t,0.4+i*0.15,0.6)),dx:[-160*ease(leave),0,0,180*ease(leave)],
      child:fin(t,w("sold","children")-0.3,0.6)*(1-fin(t,tSa-0.3,0.6)),dim:cut*0.8});
    // the people, and what happened between them
    baTagAt(ctx,S,1790,ba_ys(1790)-60,"the farmers who worked it",BIZ,{dy:-30,a:fin(t,w("deeds","farmers")-0.2,0.5)*(1-fin(t,w("deeds","asked")-0.5,0.5))});
    baTagAt(ctx,S,1890,ba_ys(1890)-70,"disputes",BA_RED,{dy:-30,a:fin(t,w("fought","fought")-0.2,0.5)*(1-fin(t,tNe+0.4,0.6))});
    baTagAt(ctx,S,1890,ba_ys(1890)+40,"some villages broke apart",BA_RED,{dy:20,a:fin(t,w("fought","broke apart")-0.2,0.5)*(1-fin(t,tNe+0.4,0.6))});
    ctx.restore();
    // above the village, the panel: a day of water in its owners' shares; then two turns; it goes, and comes back for the deeds
    const tSh=w("edge","shares of time")-0.3,tAs=w("deeds","asked")-0.3;
    b2_panel(ctx,fin(t,tSh,0.6)*(1-fin(t,tDe-0.5,0.6))+fin(t,tAs,0.6));
    b2_daybar(ctx,fin(t,tSh+0.2,0.6)*(1-fin(t,tTu-0.45,0.4)),{lit:fill,sold:fin(t,w("sold","sold")-0.1,0.5),split:fin(t,w("sold","split")-0.1,0.5),heir:fin(t,w("sold","children")-0.2,0.5),
      q:fin(t,w("same","the same")-0.7,1.0)});
    b2_turns(ctx,fin(t,tTu-0.05,0.5)*(1-fin(t,tDe-0.9,0.5)),{l6:fin(t,tTu-0.05,0.5),p6:clamp((t-w("turns","every six")+0.3)/1.0,0,1),l22:fin(t,w("turns","On another")-0.2,0.5),p22:clamp((t-w("turns","every twenty-two")+0.3)/1.4,0,1)});
    const nD=clamp((t-w("deeds","written deeds")+0.1)/0.5,0,5)+clamp((t-w("added","more than")+0.3)/0.5,0,2);
    b2_deeds(ctx,fin(t,tAs+0.1,0.6),{n:nD,over:fin(t,w("added","twenty-four")-0.1,0.5),q:fin(t,w("needed","mean the same")-0.2,0.5)});
    eaYear(ctx,80,80,"Iran · desert villages",CLAY,fin(t,0.6,0.8)*(1-fin(t,tSh-0.6,0.6)));
    eaYear(ctx,80,80,"Iran · the 1960s",CLAY,fin(t,tDe-0.1,0.6));}
  // in Mahan: one qanat's day, cut into fifteen shares that add up to it; then another qanat's, from three men to some seventy families;
  // shares sold, inherited and split very fine, and each day still adding up
  if(dialA>0.01)withA(ctx,dialA,()=>{histBg(ctx,S,t,{light:0.12});
    const tOw=w("mahan","owners")-0.3,tMs=w("mahan","measured")-0.1,tDay=w("mahan","the day itself")-0.2;
    const tFs=w("fifteen","fifteen shares")-0.2,tTw=w("fifteen","every twelve")-0.2,tNs=w("adds","ninety-six")-0.2,tEx=w("adds","exactly one day")-0.2;
    const tAn=tSe-0.2,tTh=w("seventy","three men")-0.2,tBit=w("seventy","bit by bit")-0.2,tSv=w("seventy","seventy families")-0.2;
    const tThi=w("meant","thirty seconds")-0.2,tUp=w("meant","still add up")-0.2;
    // the first qanat's day: in the middle, then aside and smaller as another comes in
    const mv=ease(clamp((t-tAn+0.2)/1.4,0,1)),d1x=lerp(B2_DX,420,mv),d1y=lerp(B2_DY,540,mv),d1r=lerp(B2_DR,200,mv),[d2x,d2y,d2r]=B2_D2;
    const sweep=clamp((t-tMs)/2.2,0,1),full1=Math.max(fin(t,tEx,0.6),fin(t,tUp,0.6)),go=B-0.3,hiG=t>go?Math.floor((t-go)/0.55)%15:0;
    ba_day(ctx,d1x,d1y,d1r,{p:clamp((t-tFs)/1.6,0,1),cols:[...Array(15)].map(()=>BA_SAND),hi:t>go?hiG:0,hiA:t>go?1:fin(t,tNs,0.5)*(1-fin(t,tAn-0.4,0.5)),full:full1,
      mid:mv>0.5?null:t<tFs+0.4?"the day":"one day",sub:mv>0.5||t<tFs+0.4?null:"24 hours",midSize:40,a:fin(t,tMa-0.3,0.8)});
    // the day itself: a hand goes once round its twenty-four hours
    if(sweep>0&&sweep<1||t>tMs&&t<tMs+2.8){const an=-Math.PI/2+sweep*TAU,ha=fin(t,tMs,0.3)*(1-fin(t,tMs+2.3,0.5));withA(ctx,ha,()=>{ctx.save();ctx.strokeStyle=rgba(BA_WATER,0.95);ctx.lineWidth=4;ctx.lineCap="round";
      ctx.shadowColor=rgba(BA_WATER,0.8);ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(d1x,d1y);ctx.lineTo(d1x+Math.cos(an)*(d1r+20),d1y+Math.sin(an)*(d1r+20));ctx.stroke();
      ctx.lineWidth=6;ctx.beginPath();ctx.arc(d1x,d1y,d1r+24,-Math.PI/2,an);ctx.stroke();ctx.restore();});}
    withA(ctx,fin(t,tOw,0.6)*(1-fin(t,tLi-0.6,0.5)),()=>tag(ctx,d1x,d1y-d1r-70,"one of the town's qanats",BAC,{align:"center",size:28}));
    // the second qanat's day: six shares at first, by three men; then split, bit by bit, into some seventy families' slivers
    const two=fin(t,tAn,0.8);if(two>0.01){const sp=clamp((t-tBit)/2.6,0,1);
      ba_day(ctx,d2x,d2y,d2r,{n:6,k:12,p:1,cols:[...Array(6)].map(()=>BA_SAND),split:sp,full:fin(t,tUp,0.6),a:two});
      withA(ctx,two*(1-fin(t,tLi-0.6,0.5)),()=>tag(ctx,d2x,d2y-d2r-70,"another, built in the 1860s",BAC,{align:"center",size:28}));}
    b2_three(ctx,t,fin(t,tTh,0.7)*(1-fin(t,tBit,0.6)));
    withA(ctx,fin(t,tTh+0.3,0.5)*(1-fin(t,tBit,0.4)),()=>tag(ctx,1680,760,"first, three men",BIZ,{align:"center",size:28}));
    withA(ctx,fin(t,tSv,0.5)*(1-fin(t,tMe-0.4,0.5)),()=>tag(ctx,1680,760,"then some seventy families",BIZ,{align:"center",size:28}));
    // beside the first, at the screen's own size: what a share is in Mahan
    const X=1150,r1=1-fin(t,tAn-0.5,0.4);
    arrive(ctx,X+200,250,t,tFs+0.6,()=>withA(ctx,r1,()=>T(ctx,"fifteen shares to a day",X,260,{w:800,size:38})),{dy:10});
    if(t>tTw-0.1)arrive(ctx,X+320,380,t,tTw,()=>withA(ctx,r1,()=>{T(ctx,"each share comes round every 12 days",X,346,{w:600,size:30,color:rgba(SOFT,1)});
      for(let i=0;i<12;i++){const cx=X+24+i*56,cy=410,q=clamp((t-tTw-0.1)*8-i,0,1);if(q<=0)break;ctx.strokeStyle=rgba(BAC,0.5*q);ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,20,0,TAU);ctx.stroke();
        if(i===0){ctx.fillStyle=rgba(BA_WATER,0.9*q);ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,20,-Math.PI/2,-Math.PI/2+TAU/15);ctx.closePath();ctx.fill();}}}),{dy:10});
    arrive(ctx,X+200,520,t,tNs,()=>withA(ctx,r1,()=>tag(ctx,X,520,"one share: 96 minutes",BA_WATER,{size:30})),{dy:10});
    if(t>tEx-0.1)arrive(ctx,X+260,630,t,tEx,()=>withA(ctx,r1,()=>{T(ctx,"15 × 96 minutes = 24 hours",X,640,{w:800,size:36,color:rgba(BA_OK,1)});kt_gtick(ctx,X+560,628,18,fin(t,tEx+0.4,0.5));}),{dy:10});
    // sold, inherited, split as fine as thirty seconds (in another of the town's qanats, so it stays in the list, not on a day), and
    // each day still adding up
    const r3=1-fin(t,tLi-0.6,0.5);
    if(t>tMe)withA(ctx,r3,()=>{[["sold",w("meant","sold")],["inherited",w("meant","inherited")],["split",w("meant","split")]].forEach(([s_,t0],i)=>arrive(ctx,1590,330+i*70,t,t0-0.2,()=>tag(ctx,1530,330+i*70,s_,AMBER,{size:30}),{dy:10}));
      arrive(ctx,1590,540,t,tThi-0.1,()=>tag(ctx,1530,540,"as fine as 30 seconds",BA_WATER,{size:30}),{dy:10});
      withA(ctx,fin(t,tUp,0.5),()=>{T(ctx,"and the day still adds up",d2x,846,{w:800,size:34,align:"center",color:rgba(BA_OK,1)});kt_gtick(ctx,d2x+250,834,16,fin(t,tUp+0.4,0.5));});});
    eaYear(ctx,80,80,"Mahan, near Kerman · Iran",CLAY,fin(t,tMa-0.4,0.6)*(1-fin(t,B,0.6)));
    // and at the utility, the same
    withA(ctx,fin(t,tLi-0.2,0.6),()=>tag(ctx,960,104,"Mahan: one share, one meaning",BIZ,{align:"center",size:30}));
    withA(ctx,fin(t,w("link","each thing")-0.2,0.6),()=>tag(ctx,960,168,"the utility: each thing it counts, defined once",BAC,{align:"center",size:30}));});
  vign(ctx,S);
  baTitle(ctx,S,t,B+0.6,"What the business needs to know","each thing it counts, defined once","Film 2 of 5");});

/* ---------- the wall: Tomás's map, its capabilities and the concepts they need ---------- */
// The capabilities across the top, in the strategy layer; the concepts below them, in the information layer, under the three
// capabilities the film follows: operating the network, connecting customers and serving customers. Each concept:
// [id, name, x, y, from CIM, capability, created (or only read), the side its line comes down (-1 left, 1 right)]
const B2_CAPX=i=>40+i*232,B2_CAPY=136,B2_CAPW=220,B2_CAPH=112,B2_NW=210,B2_NH=76;
const B2_NOTES=[["reading","meter reading",382,470,1,1,0,1],["outage","outage",382,590,1,1,1,1],
  ["request","connection request",730,470,0,3,1,-1],["capacity","network capacity",990,470,0,3,0,-1],["cp","connection point",730,590,1,3,1,-1],["meter","meter",990,590,1,3,1,-1],
  ["account","account",1620,470,1,6,1,-1],["bill","bill",1620,590,0,6,1,-1],["complaint","complaint",1620,710,0,6,1,-1]];
const B2_LOC=[1290,768];
// the domains, as the words are grouped: the network's, retail's, and the one they share; [name, x, y, w, h, colour, owner]
const B2_GROUPS=[["network",196,372,928,292,BA_NET,"Grace"],["retail",1450,372,340,412,BA_RET,"head of retail"],["shared",1150,680,280,140,BAC,"Grace"]];
const B2_DOM=id=>id==="location"?BAC:["account","bill","complaint"].includes(id)?BA_RET:BA_NET;
// What the wall shows at a moment, from the chapter's state w: w.caps[i] (0..1) each capability (w.capT[i]: when it arrives);
// w.capHi[i], w.capDim[i]; w.heat (0..1): connecting customers in red; w.layerS, w.layerI (0..1) the two layers' names (w.layers sets
// both); w.notes[id]: {a, t, glass, hi, src, srcHi, st, name, dim}; w.lines[id] (0..1) the line from its capability; w.lineKind (0..1):
// created solid, only read dashed; w.groups[k] (0..1); w.owners (0..1); w.loc (0..1) the shared word's lines to both domains
function b2_wall(ctx,t,w){
  const lS=w.layerS==null?w.layers||0:w.layerS,lI=w.layerI==null?w.layers||0:w.layerI;
  if(lS>0.01)withA(ctx,lS,()=>tag(ctx,40,96,"strategy layer",BA_STR,{size:28}));if(lI>0.01)withA(ctx,lI,()=>tag(ctx,40,318,"information layer",BA_INF,{size:28}));
  // the domains, behind the concepts: each named in its top right corner, its owner below it
  B2_GROUPS.forEach(([nm,x,y,gw,gh,col,own],k)=>{const v=w.groups?w.groups[k]||0:0;if(v<=0.01)return;withA(ctx,v,()=>{ctx.save();ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2.5;rr(ctx,x,y,gw,gh,14);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=rgba(col,0.06);rr(ctx,x,y,gw,gh,14);ctx.fill();ctx.restore();T(ctx,nm,x+gw-18,y+38,{w:800,size:28,align:"right",color:rgba(col,1)});
      if((w.owners||0)>0.01)withA(ctx,w.owners,()=>tag(ctx,x+gw/2,y+gh+28,"owner: "+own,TRUST,{align:"center",size:28}));});});
  // the capabilities
  BA_CAPS.forEach(([nm],i)=>{const v=w.caps?w.caps[i]==null?1:w.caps[i]:1;if(v<=0.01)return;const x=B2_CAPX(i);
    arrive(ctx,x+B2_CAPW/2,B2_CAPY+B2_CAPH/2,t,w.capT?w.capT[i]:-9,()=>baCap(ctx,x,B2_CAPY,B2_CAPW,B2_CAPH,nm,{a:v,hi:w.capHi?w.capHi[i]||0:0,dim:w.capDim?w.capDim[i]||0:0,heat:i===3&&(w.heat||0)>0?BA_RED:null,heatA:w.heat}),{dy:-12});});
  // each concept's line from its capability: down from the capability, along its side of the column, and into the concept
  B2_NOTES.forEach(([id,nm,x,y,cim,ci,cr,sd])=>{const p=w.lines?w.lines[id]||0:0;if(p<=0.01)return;const cx=B2_CAPX(ci)+B2_CAPW/2+60*sd,tx=x+sd*(B2_NW/2+30),y0=B2_CAPY+B2_CAPH,ym=y0+24,dash=!cr&&(w.lineKind||0)>0.5;
    const P=[[cx,y0],[cx,ym],[tx,ym],[tx,y],[x+sd*B2_NW/2,y]],L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));let left=L[L.length-1]*clamp(p,0,1);
    ctx.save();ctx.strokeStyle=rgba(BA_STR,0.8);ctx.lineWidth=2.5;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length&&left>0;i++){const d=L[i]-L[i-1],f=Math.min(1,left/d);
      if(i===P.length-1&&dash)ctx.setLineDash([7,6]);ctx.lineTo(lerp(P[i-1][0],P[i][0],f),lerp(P[i-1][1],P[i][1],f));if(i===P.length-1){ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.moveTo(lerp(P[i-1][0],P[i][0],f),lerp(P[i-1][1],P[i][1],f));}left-=d;}ctx.stroke();ctx.restore();});
  // the shared word's lines to the two domains that use it
  if((w.loc||0)>0.01)withA(ctx,w.loc,()=>{[[B2_LOC[0]-B2_NW/2,B2_LOC[1],1124,640],[B2_LOC[0]+B2_NW/2,B2_LOC[1],1450,744]].forEach(([x0,y0,x1,y1])=>{ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(BAC,0.7);ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();});});
  // the concepts: paper drafts, blue where CIM gave them and yellow where the business named them; glass once confirmed in their domain
  B2_NOTES.concat([["location","location",B2_LOC[0],B2_LOC[1],0,-1,1,0]]).forEach(([id,nm,x,y,cim])=>{const n=w.notes?w.notes[id]:null;if(!n||(n.a||0)<=0.01)return;
    const dom=B2_DOM(id),nx=n.x==null?x:n.x,ny=n.y==null?y:n.y;
    arrive(ctx,nx,ny,t,n.t==null?-9:n.t,()=>sticky(ctx,nx,ny,B2_NW,B2_NH,n.name||nm,{col:cim?NOTEC[2]:NOTEC[0],size:28,glass:n.glass||0,edge:mix(BA_INF,dom,0.35),rot:[-0.02,0.015,-0.012,0.02][(x+y)%4]*(1-(n.glass||0)),
      a:(n.a)*(1-0.7*(n.dim||0)),st:n.st,src:(n.src||0)>0.01?"CIM":null,srcA:n.src,srcSize:28}),{dy:-12});
    if((n.srcHi||0)>0.01&&(n.src||0)>0.01)glow(ctx,nx-B2_NW/2+44,ny+B2_NH/2+12,70,BAC,0.5*n.srcHi*n.src);
    if((n.hi||0)>0.01)glow(ctx,nx,ny,150,dom,0.3*n.hi);});}
// the wall's concepts as Never a blank page leaves it, and What each capability needs starts: the five CIM gave, each with its source
function b2_draft(tIn,stA){const notes={};B2_NOTES.forEach(([id,nm,x,y,cim],i)=>{if(cim)notes[id]={a:1,t:tIn==null?-9:tIn+0.15*i,src:1,st:stA};});return notes;}
// every concept on the wall, confirmed in its domain (glass), with the shared one
function b2_done(){const notes={};B2_NOTES.forEach(([id])=>{notes[id]={a:1,glass:1};});notes.location={a:1,glass:1};return notes;}
const B2_ALL=()=>Object.fromEntries(B2_NOTES.map(([id])=>[id,1]));
// A concept lifted off the wall to be read: from its note at (x0, y0) to a card in the middle (k, 0..1, how far); o.name, o.kick, the
// words on it; o.glassA (0..1): from its paper to the map's glass, as a business object. A soft shadow lies under it as it lifts, so
// the wall's notes behind it don't peek out at its edges. Its name is only ever drawn once: the paper's name leaves before the glass
// card's words come in, and the card's words stay inside it. Small, it shows its name in the middle, in the lines the wall's note
// has (nA), as the paper does, so its lines never re-wrap; the card's words come in only once it is large (cA). On the way back, o.out (0..1) sends the card's words away and then
// o.back (0..1) brings its name back to the middle, before it shrinks
function b2_lift(ctx,x0,y0,k,cx,cy,cw,ch,o){const x=lerp(x0,cx,k),y=lerp(y0,cy,k),w_=lerp(B2_NW,cw,k),h_=lerp(B2_NH,ch,k),gA=o.glassA||0,sz=Math.round(lerp(28,44,k)),rot=lerp(-0.012,0,k),
    cA=clamp((k-0.62)/0.28,0,1)*(1-(o.out||0))*clamp((gA-0.6)/0.4,0,1),nA=Math.max(1-clamp((k-0.35)/0.23,0,1),o.back||0)*clamp((gA-0.6)/0.4,0,1),
    ls=wrapT(ctx,o.name,0,0,B2_NW-28,{size:28,w:700,measure:true}),lh=sz*1.18,ty=-((ls.length-1)*lh)/2+sz*0.36;
  if(k>0.01){ctx.save();ctx.globalAlpha*=clamp(k*1.5,0,1);ctx.shadowColor="rgba(0,0,0,0.85)";ctx.shadowBlur=48;ctx.fillStyle="rgba(12,9,7,0.75)";rr(ctx,x-w_/2-8,y-h_/2-8,w_+16,h_+16,22);ctx.fill();ctx.restore();}
  // the paper, and its name, which leaves as the glass comes in
  if(gA<0.99){sticky(ctx,x,y,w_,h_,"",{col:o.paper||NOTEC[2],size:sz,rot,a:1-gA});const pA=1-clamp(gA/0.4,0,1);
    if(pA>0.01)withA(ctx,pA,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot);ls.forEach((l,i)=>T(ctx,l,0,ty+i*lh,{w:700,size:sz,align:"center",color:rgba(INKD,0.9)}));ctx.restore();});}
  if(gA>0.01)withA(ctx,gA,()=>{glass(ctx,x-w_/2,y-h_/2,w_,h_,16,BA_INF,{glow:16,ea:0.85,fill:"rgba(16,10,8,0.96)"});ctx.fillStyle=rgba(BA_INF,0.1);rr(ctx,x-w_/2,y-h_/2,w_,h_,16);ctx.fill();});
  if(cA>0.01)withA(ctx,cA,()=>{ctx.save();rr(ctx,x-w_/2,y-h_/2,w_,h_,16);ctx.clip();archGlyph(ctx,"object",x+w_/2-36,y-h_/2+34,13,BA_INF);T(ctx,"business object",x-w_/2+28,y-h_/2+48,{f:"mono",w:500,size:28,color:rgba(BA_INF,1)});
    T(ctx,o.name,x-w_/2+28,y-h_/2+112,{w:800,size:44});if(o.body)o.body(x-w_/2,y-h_/2,w_,h_);ctx.restore();});
  if(nA>0.01)withA(ctx,nA,()=>ls.forEach((l,i)=>T(ctx,l,x,y+ty+i*lh,{w:700,size:sz,align:"center",color:rgba(INK,0.96)})));
  return[x,y,w_,h_];}

/* ---------- 2. Tomás's next note ---------- */
scene("note",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
  const tCa=c("caps"),tEa=c("each"),tCo=c("concepts");
  // the note from the end of the film before, then moved aside as the capabilities come in
  const mv=ease(clamp((t-tCa+0.4)/1.4,0,1)),nx=lerp(860,1500,mv),ny=lerp(420,600,mv),nw=lerp(560,400,mv),nh=lerp(150,120,mv);
  sticky(ctx,nx,ny,nw,nh,"What does the business "+ba_nb("need to know?"),{col:NOTEC[0],size:Math.round(lerp(36,30,mv)),rot:-0.02,a:1-fin(t,tEa-0.4,0.6)});
  const capT=BA_CAPS.map((_,i)=>w("caps","eight things")-0.4+i*0.12);
  // each one needs something, creates something, or changes it: three outlines still to fill, under three of them
  const ph=[["needs",1,w("each","needs")],["creates",3,w("each","creates")],["changes",6,w("each","changes")]];
  ph.forEach(([s_,ci,t0])=>{const v=fin(t,t0-0.2,0.5);if(v<=0.01)return;const cx=B2_CAPX(ci)+B2_CAPW/2,glo=pulseAt(t,w("concepts","concepts")-0.1,1.6);withA(ctx,v,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(BA_INF,0.75+0.25*glo);ctx.lineWidth=2.5;
    rr(ctx,cx-B2_NW/2,470-B2_NH/2,B2_NW,B2_NH,8);ctx.stroke();ctx.restore();if(glo>0.01)glow(ctx,cx,470,140,BA_INF,0.3*glo);ctx.strokeStyle=rgba(BA_STR,0.7);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(cx,B2_CAPY+B2_CAPH);ctx.lineTo(cx,lerp(B2_CAPY+B2_CAPH,470-B2_NH/2,clamp((t-t0+0.2)/0.5,0,1)));ctx.stroke();
    tag(ctx,cx,560,s_,BA_INF,{align:"center",size:28});});});
  b2_wall(ctx,t,{caps:BA_CAPS.map((_,i)=>fin(t,capT[i],0.4)),capT,layerS:fin(t,w("caps","capabilities")-0.2,0.6),layerI:fin(t,w("concepts","information layer")-0.3,0.6),
    capHi:BA_CAPS.map((_,i)=>[1,3,6].includes(i)?pulseAt(t,tEa+0.2,1.6):0)});
  if(t>tCa-0.3)glow(ctx,960,192,700,BA_STR,0.12*pulseAt(t,w("caps","capabilities")-0.1,1.6));
  arrive(ctx,1780,760,t,0.3,()=>baPersonR(ctx,"tomas",1790,1040,0.74,{t,expr:"calm"}),{dy:20});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Never a blank page ---------- */
// the industry's reference models, as cards: who keeps each, and what it is
const B2_REF=[["IEC 61970 · 61968","Common Information Model","iec"],["IEC 61968-1:2020","interface reference model","irm"],
  ["CEN-CENELEC-ETSI","Smart Grid Architecture Model","sgam"],["ENTSO-E · ebIX · EFET","market role model","roles"]];
// what a distribution utility does, as IEC 61968-1 lists its business functions
const B2_IRM=["network operations","records and asset management","operational planning","maintenance and construction","network extension planning","customer support","meter reading and control","customer account management"];
// a business function, as ArchiMate draws its glyph: a chevron pointing up, like a bookmark
function b2_fnGlyph(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-s*0.6,y+s*0.7);ctx.lineTo(x-s*0.6,y-s*0.2);ctx.lineTo(x,y-s*0.7);
  ctx.lineTo(x+s*0.6,y-s*0.2);ctx.lineTo(x+s*0.6,y+s*0.7);ctx.lineTo(x,y+s*0.25);ctx.closePath();ctx.stroke();ctx.restore();}
// the Smart Grid Architecture Model's planes, one above another, seen at an angle: business at the top, component at the bottom
// (y); p brings them in from the bottom up
function b2_sgam(ctx,x,y,a,p){if(a<=0.01)return;const L=["business","function","information","communication","component"],cols=[BA_BUS,[255,200,150],BA_INF,[150,200,255],[160,224,140]];
  withA(ctx,a,()=>{for(let i=L.length-1;i>=0;i--){const j=L.length-1-i,q=clamp(p*5-j,0,1);if(q<=0)continue;const yy=y-j*70+(1-spring(q*1.3))*30;
    withA(ctx,clamp(q*2,0,1),()=>{rhomb(ctx,x,yy,560,120);ctx.fillStyle=rgba(cols[i],0.10);ctx.fill();ctx.strokeStyle=rgba(cols[i],0.75);ctx.lineWidth=2;ctx.stroke();T(ctx,L[i],x+330,yy+10,{w:700,size:28,color:rgba(cols[i],1)});});}});}
scene("blank",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tMo=c("models"),tIe=c("iec"),tCi=c("cim"),tIr=c("irm"),tAr=c("arch"),tSg=c("sgam"),tRo=c("roles"),tOt=c("others"),tFi=c("first"),tDr=c("draft");
  // the reference models, then back on the wall: the whole picture changes, so the two dissolve
  const wallA=fin(t,tFi-0.8,1.2);
  if(wallA<0.99){setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
    // a blank page, then set aside
    const bp=ease(clamp((t-w("blank","blank page")-0.1)/1.3,0,1));sheet(ctx,lerp(760,180,bp),lerp(210,330,bp),400,520,{rot:lerp(-0.02,-0.16,bp),plain:true,a:fin(t,0.2,0.6)*(1-bp)});
    // four places for the energy industry's reference models, each filled as it's named
    withA(ctx,fin(t,tMo+0.2,0.6)*(1-fin(t,tOt-0.4,0.6)*0.6),()=>T(ctx,"the industry's reference models",960,74,{f:"mono",w:500,size:28,align:"center",color:rgba(BAC,1)}));
    const lit=[pulseAt(t,w("iec","Common Information")-0.1,1.4)+0.5*fin(t,tCi-0.2,0.4)*(1-fin(t,tIr-0.3,0.4)),pulseAt(t,w("arch","twenty twenty")-0.1,1.6),0,0];
    B2_REF.forEach(([k,nm,lid],i)=>{const x=60+i*460,slot=fin(t,tMo+0.3+i*0.12,0.5),t0=lid==="iec"?w("iec","Common Information")-0.3:c(lid)-0.2,dimA=1-0.55*fin(t,tOt-0.4,0.6);
      if(t<t0+0.3)withA(ctx,slot*(1-fin(t,t0,0.4)),()=>{ctx.save();ctx.setLineDash([10,9]);ctx.strokeStyle=rgba(BAC,0.6+0.4*pulseAt(t,w("models","standards bodies")-0.1,1.4));ctx.lineWidth=2.4;rr(ctx,x,110,420,170,18);ctx.stroke();ctx.restore();});
      if(t>t0)arrive(ctx,x+210,195,t,t0,()=>withA(ctx,dimA,()=>{glass(ctx,x,110,420,170,18,BAC,{glow:12+16*pulseAt(t,t0+0.2,1.4)+14*(lit[i]||0),ea:0.85,fill:"rgba(7,12,24,0.95)"});
        T(ctx,k,x+24,156,{f:"mono",w:500,size:28,color:rgba(BAC,1)});wrapT(ctx,nm,x+24,214,370,{w:800,size:32,lh:38});}),{dy:12});});
    // the IEC, which sets the world's electrical standards
    const dIe=fin(t,tIe,0.5)*(1-fin(t,w("iec","Common Information")+0.6,0.6));
    if(dIe>0.01)withA(ctx,dIe,()=>{T(ctx,"IEC",960,500,{w:800,size:120,align:"center",color:rgba(BAC,1)});
      withA(ctx,fin(t,w("iec","world's")-0.2,0.5),()=>T(ctx,"sets the world's electrical standards",960,580,{w:600,size:36,align:"center",color:rgba(INK,0.9)}));});
    // what CIM names: the things a utility works with, and how they relate
    const dCim=fin(t,tCi-0.2,0.5)*(1-fin(t,tIr-0.3,0.5));
    if(dCim>0.01)withA(ctx,dCim,()=>{const Bx=[["cable",420,470,"cables"],["usage point",790,470,"cables"],["meter",1160,470,"meters"],["customer",790,660,"customers"],["account",1160,660,"customers"]];
      const pos={};Bx.forEach(([nm,x,y])=>{pos[nm]=[x,y];});
      [["cable","usage point"],["usage point","meter"],["usage point","customer"],["customer","account"]].forEach(([a_,b_],i)=>{const[x0,y0]=pos[a_],[x1,y1]=pos[b_],q=clamp((t-w("cim","how they relate")+0.3)/0.6-i*0.3,0,1);if(q<=0)return;
        ctx.strokeStyle=rgba(BAC,0.7);ctx.lineWidth=2.5;ctx.beginPath();const sx=x0+(x1>x0?140:0),sy=y0+(y1>y0?40:0),ex=x1-(x1>x0?140:0),ey=y1-(y1>y0?40:0);ctx.moveTo(sx,sy);ctx.lineTo(lerp(sx,ex,q),lerp(sy,ey,q));ctx.stroke();});
      Bx.forEach(([nm,x,y,k])=>{const t0=w("cim",k)-0.2+(nm==="usage point"||nm==="account"?0.3:0);if(t<t0)return;arrive(ctx,x,y,t,t0,()=>{glass(ctx,x-140,y-40,280,80,12,BAC,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,nm,x,y+10,{w:700,size:30,align:"center"});},{dy:10});});});
    // IEC 61968-1: what a distribution utility does, and the business objects each part uses; in its 2020 edition, drawn in ArchiMate
    const dIrm=fin(t,tIr-0.1,0.5)*(1-fin(t,tSg-0.3,0.5)),arA=fin(t,w("arch","ArchiMate")-0.3,0.6);
    if(dIrm>0.01)withA(ctx,dIrm,()=>{B2_IRM.forEach((nm,i)=>{const x=230+(i%2)*760,y=330+Math.floor(i/2)*76,t0=w("irm","what a distribution")-0.2+i*0.12;if(t<t0)return;
        arrive(ctx,x+350,y+32,t,t0,()=>{glass(ctx,x,y,700,64,14,BA_BUS,{glow:10,ea:0.8,fill:"rgba(12,12,8,0.95)"});T(ctx,nm,x+24,y+43,{w:700,size:28});if(arA>0.01)withA(ctx,arA,()=>b2_fnGlyph(ctx,x+672,y+32,13,BA_BUS));},{dy:10});});
      // the objects two of them use, under them
      [["meter reading",255,6],["meter",565,6],["account",1015,7],["bill",1305,7]].forEach(([nm,x,fi],i)=>{const t0=w("irm","business objects")-0.2+i*0.15;if(t<t0)return;const fx=230+(fi%2)*760,bw=nm.length>6?270:190;
        const q=clamp((t-t0)/0.5,0,1);ctx.strokeStyle=rgba(BA_INF,0.7*q);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+bw/2,558+64);ctx.lineTo(x+bw/2,lerp(622,690,q));ctx.stroke();
        arrive(ctx,x+bw/2,722,t,t0+0.2,()=>baEl(ctx,x,690,bw,64,nm,BA_INF,"object",{size:28}),{dy:10});});
      withA(ctx,fin(t,w("arch","language")-0.2,0.5),()=>tag(ctx,960,820,"ArchiMate: the language of Tomás's map",BAC,{align:"center",size:30}));});
    // the Smart Grid Architecture Model: where each part sits, from the power station to the home
    const dSg=fin(t,tSg-0.1,0.5)*(1-fin(t,tRo-0.3,0.5));
    if(dSg>0.01)withA(ctx,dSg,()=>{b2_sgam(ctx,760,640,1,clamp((t-tSg+0.1)/1.4,0,1));
      const pA=fin(t,w("sgam","from the power station")-0.2,0.5),pp=clamp((t-w("sgam","from the power station")+0.1)/1.4,0,1);
      if(pA>0.01)withA(ctx,pA,()=>{arrowTo(ctx,500,750,lerp(500,1020,pp),750,BAC,0.9,{lw:3,head:14});T(ctx,"power station",500,800,{w:700,size:28,align:"center",color:rgba(BAC,1)});
        withA(ctx,fin(t,w("sgam","home")-0.2,0.4),()=>T(ctx,"home",1020,800,{w:700,size:28,align:"center",color:rgba(BAC,1)}));});});
    // the market role model: who does what in the market
    const dRo=fin(t,tRo-0.1,0.5)*(1-fin(t,tOt-0.4,0.5));
    if(dRo>0.01)withA(ctx,dRo,()=>{[["balance supplier",420,460],["grid access provider",960,460],["metered data responsible",1500,460]].forEach(([nm,x,y],i)=>{const t0=w("roles","who does what")-0.3+i*0.2;if(t<t0)return;
        arrive(ctx,x,y,t,t0,()=>baEl(ctx,x-230,y-46,460,92,nm,BA_BUS,"role",{size:30}),{dy:10});});
      const t1=w("roles","electricity market")-0.2;if(t>t1)arrive(ctx,960,640,t,t1,()=>baEl(ctx,760,596,400,88,"metering point",BA_INF,"object",{size:30}),{dy:10});});
    // other industries, their own
    const dOt=fin(t,tOt-0.1,0.5);
    if(dOt>0.01)withA(ctx,dOt,()=>{[["BIAN","banks"],["TM Forum","telecoms"],["ACORD","insurers"],["HL7 FHIR","health"],["HERM","universities"],["APQC","any industry"]].forEach(([k,v],i)=>{const x=240+(i%3)*500,y=420+Math.floor(i/3)*170,t0=tOt+0.2+i*0.18;if(t<t0)return;
      arrive(ctx,x+210,y+60,t,t0,()=>{glass(ctx,x,y,420,120,16,SOFT,{glow:10+12*(k==="BIAN"?pulseAt(t,w("others","BIAN")-0.1,1.2):k==="HERM"?pulseAt(t,w("others","HERM")-0.1,1.2):0),ea:0.75,fill:"rgba(7,12,24,0.95)"});
        T(ctx,k,x+28,y+54,{f:"mono",w:500,size:30,color:rgba(BAC,1)});T(ctx,v,x+28,y+98,{w:700,size:30});},{dy:12});});});
    ctx.restore();vign(ctx,S);}
  // back on the wall: the first draft, from CIM, every element of it a draft until the utility's people confirm it
  if(wallA>0.01)withA(ctx,wallA,()=>{wallBg(ctx,S,t);ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
    const tIn=w("first","first draft")-0.3,tSt=w("draft","isn't")-0.2,notes=b2_draft(tIn,t>tSt?0.5*fin(t,tSt,0.6):null),sh=pulseAt(t,w("first","where each element")-0.1,1.8);
    Object.values(notes).forEach(n=>{n.srcHi=sh;});
    b2_wall(ctx,t,{layers:1,notes});
    withA(ctx,fin(t,w("first","where each element")-0.2,0.5)*(1-fin(t,tDr-0.4,0.4)),()=>tag(ctx,960,780,"each element: where it came from",BAC,{align:"center",size:30}));
    withA(ctx,fin(t,tSt+0.2,0.5),()=>tag(ctx,960,780,"a draft, until its people confirm it",AMBER,{align:"center",size:30}));
    ctx.restore();vign(ctx,S);});});

/* ---------- 4. What each capability needs ---------- */
// what each of the three capabilities needs, as the people who run it name it, in the order the narration does
const B2_NEED={connect:["request","capacity","cp","meter"],serve:["account","bill","complaint"],operate:["reading","outage"]};
const B2_NEEDW={request:"connection request",capacity:"capacity",cp:"connection point",meter:"meter",account:"accounts",bill:"bills",complaint:"complaints",reading:"meter readings",outage:"outages"};
scene("needs",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
  const tTh=c("through"),tCr=c("creates"),tMo=c("most"),off=1-fin(t,sc.dur-1.8,1.0);
  const notes=b2_draft(null,0.5),lines={},capHi=BA_CAPS.map(()=>0);
  // one capability at a time: it lights, and the concepts it needs come in, each with its line
  [["connect",3],["serve",6],["operate",1]].forEach(([lid,ci])=>{const t0=c(lid)-0.2,t1=c(lid==="connect"?"serve":lid==="serve"?"operate":"creates")-0.3;capHi[ci]=fin(t,t0,0.5)*(1-fin(t,t1,0.6))+pulseAt(t,tCr+0.2,1.6)*0.6;
    B2_NEED[lid].forEach(id=>{const tw_=w(lid,B2_NEEDW[id])-0.2;lines[id]=clamp((t-tw_)/0.6,0,1);if(!notes[id])notes[id]={a:fin(t,tw_+0.2,0.4),t:tw_+0.2,st:0.5};notes[id].hi=pulseAt(t,tw_+0.1,1.2);});});
  // the line of a concept a capability only reads is dashed
  const kind=fin(t,w("creates","creates")-0.2,0.5);
  // most of them, CIM already names
  B2_NOTES.forEach(([id,,,,cim])=>{if(cim&&notes[id]){notes[id].hi=Math.max(notes[id].hi||0,pulseAt(t,tMo+0.2,1.6));notes[id].srcHi=pulseAt(t,tMo+0.2,1.6);}});
  b2_wall(ctx,t,{layers:1,notes,lines,lineKind:kind,capHi});
  // who runs them: Grace, and the head of retail, named over their capabilities
  arrive(ctx,1790,760,t,tTh-0.1,()=>withA(ctx,off,()=>baPersonR(ctx,"grace",1800,1050,0.7,{t,expr:"calm"})),{dy:20});
  withA(ctx,fin(t,w("through","people who run")-0.2,0.5)*off,()=>{[[1,"Grace"],[3,"Grace"],[6,"head of retail"]].forEach(([ci,s_])=>tag(ctx,B2_CAPX(ci)+B2_CAPW/2,96,s_,TRUST,{align:"center",size:28}));});
  withA(ctx,kind*off,()=>{ctx.strokeStyle=rgba(BA_STR,0.85);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(1170,460);ctx.lineTo(1226,460);ctx.stroke();T(ctx,"creates it",1240,470,{w:700,size:28,color:rgba(INK,0.9)});
    ctx.save();ctx.setLineDash([7,6]);ctx.beginPath();ctx.moveTo(1170,530);ctx.lineTo(1226,530);ctx.stroke();ctx.restore();T(ctx,"only reads it",1240,540,{w:700,size:28,color:rgba(INK,0.9)});});
  withA(ctx,fin(t,w("most","CIM already")-0.2,0.5)*off,()=>tag(ctx,1290,612,"most from CIM",BAC,{align:"center",size:28}));
  ctx.restore();vign(ctx,S);});

/* ---------- 5. In the business's words ---------- */
// the connection point, lifted off the wall, with the names the reference models give it; the business's word on the map, and theirs beside it
scene("words",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
  const tBu=c("but"),tGr=c("grace"),tMa=c("map"),tMh=c("mahan"),tOn=c("one"),tDo=c("domains");
  const lift=ease(clamp((t-tBu-0.2)/1.4,0,1)),down=ease(clamp((t-tDo+0.4)/1.4,0,1)),up=lift*(1-down),glassA=fin(t,w("map","the map uses")-0.2,0.8),out=fin(t,tDo-1.0,0.5),back=fin(t,tDo-0.5,0.4);
  const notes=b2_draft(null,0.5);["request","capacity","bill","complaint"].forEach(id=>{notes[id]={a:1,st:0.5};});
  // each word confirmed in its domain, as the domains are drawn: glass in its domain's colour
  const conf=fin(t,w("domains","The network's")-0.2,0.8),confR=fin(t,w("domains","retail's")-0.2,0.8);
  B2_NOTES.forEach(([id])=>{const n=notes[id];n.dim=up*0.6;n.glass=["account","bill","complaint"].includes(id)?confR:conf;if(n.glass>0.01){n.st=null;n.src=(n.src||0)*(1-n.glass);}});
  notes.cp.a=up>0.001?0:1;notes.cp.glass=Math.max(conf,glassA);if(notes.cp.glass>0.01){notes.cp.st=null;notes.cp.src=(notes.cp.src||0)*(1-notes.cp.glass);}
  notes.location={a:fin(t,w("shared","location")-0.2,0.5),t:w("shared","location")-0.2,glass:fin(t,w("shared","shared domain")-0.2,0.8)};
  b2_wall(ctx,t,{layers:1,notes,lines:B2_ALL(),lineKind:1,capDim:BA_CAPS.map(()=>up*0.6),groups:[conf,confR,fin(t,w("shared","shared domain")-0.2,0.6)],owners:fin(t,w("shared","owner")-0.2,0.6),loc:fin(t,w("shared","location")+0.3,0.6)});
  // the rest of the wall steps back while the connection point is read
  if(up>0.01){ctx.fillStyle="rgba(14,11,8,"+(0.8*up)+")";ctx.fillRect(-200,-200,2320,1480);}
  // the connection point's card, lifted from its place on the wall and carried back to it
  if(up>0.001){const defA=fin(t,w("one","one definition")-0.2,0.5);
    b2_lift(ctx,730,590,up,960,400,640,170,{name:"connection point",glassA,out,back,body:(x,y)=>withA(ctx,defA,()=>T(ctx,"a place where power is delivered",x+28,y+152,{w:600,size:30,color:rgba(INK,0.88)}))});
    // what the reference models call it
    const nmA=1-fin(t,w("map","keeps the reference")-0.3,0.6);
    [["CIM","usage point",340,w("usage","usage point")],["market role model","metering point",1580,w("usage","metering point")]].forEach(([k_,nm,x0,t0])=>{if(t<t0-0.2)return;
      arrive(ctx,x0,424,t,t0-0.2,()=>withA(ctx,up*nmA,()=>{glass(ctx,x0-230,354,460,140,16,BAC,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(ctx,k_,x0-204,400,{f:"mono",w:500,size:28,color:rgba(BAC,1)});T(ctx,nm,x0-204,462,{w:800,size:36});}),{dy:12});});
    // Grace's people: their word, on their forms and reports and letters
    const gA=fin(t,tGr-0.2,0.5)*(1-fin(t,tMa+0.3,0.6));
    if(gA>0.01)withA(ctx,gA*up,()=>{tag(ctx,960,272,"Grace's people",TRUST,{align:"center",size:30});
      [["connection form",500,w("grace","forms")],["network report",960,w("grace","reports")],["letter to a customer",1420,w("grace","customers")]].forEach(([nm,x0,t0],i)=>{if(t<t0-0.2)return;
        arrive(ctx,x0,640,t,t0-0.2,()=>{sheet(ctx,x0-200,560,400,160,{rot:[-0.02,0.012,-0.01][i],plain:true});ctx.save();ctx.translate(x0,640);ctx.rotate([-0.02,0.012,-0.01][i]);T(ctx,nm,-176,-30,{w:700,size:28,color:"rgba(70,62,56,0.95)"});
          T(ctx,"connection point",-176,30,{w:800,size:32,color:"rgba(36,32,30,0.95)"});ctx.restore();},{dy:12});});});
    // on the map: the business's word, with the reference models' kept beside it
    withA(ctx,fin(t,w("map","keeps the reference")-0.2,0.6)*up*(1-out),()=>{T(ctx,"also: usage point (CIM) · metering point (market)",960,540,{w:700,size:30,align:"center",color:rgba(BAC,1)});
      withA(ctx,fin(t,w("map","exchanged")-0.3,0.5)*(1-fin(t,tMh-0.4,0.5)),()=>tag(ctx,960,610,"kept for when data is exchanged",BAC,{align:"center",size:28}));});
    // as in Mahan: the measure shared, the words the town's own
    const mA=fin(t,tMh-0.2,0.6)*(1-fin(t,tOn-0.3,0.6));
    if(mA>0.01)withA(ctx,mA*up,()=>{glass(ctx,500,610,920,230,22,BAC,{glow:16,ea:0.8,fill:"rgba(8,14,24,0.96)"});ba_day(ctx,630,725,84,{p:1,full:0.6,cols:[...Array(15)].map(()=>BA_SAND)});
      T(ctx,"the measure: the day, shared by everyone",760,705,{w:700,size:28,color:rgba(BA_WATER,1)});T(ctx,"the words: the town's own",760,770,{w:700,size:28,color:rgba(BIZ,1)});});
    // one definition, in its domain, written with the people who use it
    withA(ctx,fin(t,w("one","in its domain")-0.2,0.5)*(1-out),()=>{tag(ctx,760,620,"domain: network",BA_NET,{align:"center",size:28});
      withA(ctx,fin(t,w("one","written with")-0.2,0.5),()=>tag(ctx,1140,620,"written with Grace's people",TRUST,{align:"center",size:28}));});}
  ctx.restore();vign(ctx,S);});

/* ---------- 6. A concept nobody holds ---------- */
// A street of houses with solar on their roofs, fed by one cable from the transformer at its end. o.on (0..1): how much solar is on
// and shining; o.v (0..1): the voltage at the street's end; o.lim (0..1): its limit drawn; o.hot (0..1): the cable warming; o.gA: the gauge
const B2_HOUSES=[[300,1],[560,0],[820,1],[1080,1],[1340,0],[1600,1]];
function b2_street(ctx,t,o){o=o||{};const on=o.on||0,v=o.v||0;
  const g=ctx.createLinearGradient(0,0,0,760);g.addColorStop(0,"#25466e");g.addColorStop(0.7,"#6d8fb5");g.addColorStop(1,"#b9c7d3");ctx.fillStyle=g;ctx.fillRect(-200,-200,2400,1100);
  glow(ctx,1640,170,260,[255,226,160],0.55);ctx.fillStyle="rgba(255,240,200,0.95)";ctx.beginPath();ctx.arc(1640,170,46,0,TAU);ctx.fill();
  ctx.fillStyle="#5a5249";ctx.fillRect(-200,760,2400,400);ctx.fillStyle="#3c3833";ctx.fillRect(-200,800,2400,90);ctx.strokeStyle="rgba(240,230,200,0.35)";ctx.lineWidth=4;ctx.setLineDash([40,30]);ctx.beginPath();ctx.moveTo(-200,845);ctx.lineTo(2200,845);ctx.stroke();ctx.setLineDash([]);
  // the poles and the cable along the street, warming as more solar pushes back along it; the transformer on the first pole
  const poles=[120,430,690,950,1210,1470,1730],cy=470;poles.forEach(x=>{ctx.fillStyle="#4a3a2c";ctx.fillRect(x-7,cy-10,14,770-cy);ctx.fillRect(x-40,cy-4,80,8);});
  ctx.fillStyle="#6b737c";rr(ctx,96,cy+40,48,70,6);ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.3)";ctx.lineWidth=2;rr(ctx,96,cy+40,48,70,6);ctx.stroke();
  const hot=o.hot||0;ctx.save();ctx.strokeStyle=rgba(mix([40,40,44],[255,120,70],hot),1);ctx.lineWidth=4+2*hot;if(hot>0.05){ctx.shadowColor=rgba([255,120,70],0.7*hot);ctx.shadowBlur=16*hot;}
  ctx.beginPath();for(let i=1;i<poles.length;i++){const x0=poles[i-1],x1=poles[i];ctx.moveTo(x0,cy-4);ctx.quadraticCurveTo((x0+x1)/2,cy+26,x1,cy-4);}ctx.stroke();ctx.restore();
  // the houses, each with its line from the cable; solar on four of their roofs, lying on the roof's slope, lit as it comes on
  B2_HOUSES.forEach(([x,pv],i)=>{const wd=200,hh=170,yb=770,roof=yb-hh;ctx.strokeStyle="rgba(40,40,44,0.9)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-30,cy+18);ctx.lineTo(x+wd/2-30,roof-30);ctx.stroke();
    const hg=ctx.createLinearGradient(x-wd/2,roof,x+wd/2,yb);hg.addColorStop(0,"#e4d2b4");hg.addColorStop(1,"#bda587");ctx.fillStyle=hg;ctx.fillRect(x-wd/2,roof,wd,hh);
    ctx.fillStyle="#8a4b3a";ctx.beginPath();ctx.moveTo(x-wd/2-16,roof+4);ctx.lineTo(x,roof-80);ctx.lineTo(x+wd/2+16,roof+4);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgba(60,48,40,0.9)";ctx.fillRect(x-24,yb-74,48,74);ctx.fillStyle="rgba(250,236,200,0.75)";ctx.fillRect(x-80,roof+40,44,38);ctx.fillRect(x+36,roof+40,44,38);
    if(pv){const q=clamp(on*4-[0,0,1,2,0,3][i],0,1),an=Math.atan2(-84,116);ctx.save();ctx.translate(x-62,roof-44);ctx.rotate(an);ctx.fillStyle=rgba(mix([30,40,70],[60,110,190],q),1);ctx.fillRect(-52,-9,104,18);
      ctx.strokeStyle="rgba(200,220,255,0.55)";ctx.lineWidth=1.4;for(let k=1;k<4;k++){ctx.beginPath();ctx.moveTo(-52+k*26,-9);ctx.lineTo(-52+k*26,9);ctx.stroke();}ctx.restore();if(q>0.01)glow(ctx,x-62,roof-48,80,[200,230,255],0.35*q);}});
  // the voltage at the street's end, against its limit
  if((o.gA||0)>0.01)withA(ctx,o.gA,()=>{const gx=1830,gy0=600,gy1=240;glass(ctx,gx-44,gy1-30,88,gy0-gy1+60,16,SOFT,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.92)"});
    const lv=lerp(gy0,gy1+60,clamp(v,0,1));ctx.fillStyle=rgba(mix(BA_OK,AMBER,clamp((v-0.55)*2.5,0,1)),0.9);ctx.fillRect(gx-20,lv,40,gy0-lv);
    withA(ctx,o.lim||0,()=>{ctx.strokeStyle=rgba(BA_RED,1);ctx.lineWidth=4;ctx.setLineDash([10,7]);ctx.beginPath();ctx.moveTo(gx-56,gy1+90);ctx.lineTo(gx+56,gy1+90);ctx.stroke();ctx.setLineDash([]);});});}
scene("missing",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tWa=c("wait"),tNo=c("nobody"),tNa=c("name"),tOw=c("owner");
  // on the wall, then on the street, then on the wall again: the whole picture changes, so they dissolve
  const stA=fin(t,tWa-0.8,1.2)*(1-fin(t,tOw-0.8,1.2)),back=t>tOw-1;
  if(stA<0.99){wallBg(ctx,S,t);ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
    const notes=b2_done();
    // hosting capacity, in Grace's engineers' words, lifted off the wall to be read: its owner, Grace, and no data yet
    const lift=ease(clamp((t-w("owner","on the map")+0.3)/1.4,0,1)),down=ease(clamp((t-B-0.2)/1.4,0,1)),up=back?lift*(1-down):0;
    if(back){notes.capacity.name="hosting capacity";notes.capacity.hi=pulseAt(t,tOw-0.4,1.6);notes.capacity.a=up>0.001?0:1;}
    b2_wall(ctx,t,{layers:1,notes,lines:B2_ALL(),lineKind:1,groups:[1,1,1],owners:1,loc:1,heat:fin(t,w("hurts","connecting customers")-0.3,0.6),capHi:BA_CAPS.map((_,i)=>i===3?pulseAt(t,w("hurts","hurts")-0.1,1.6):0),capDim:BA_CAPS.map(()=>up*0.6)});
    withA(ctx,fin(t,w("hurts","thirty-four")-0.2,0.5)*(1-fin(t,tWa-0.8,0.5)),()=>tag(ctx,B2_CAPX(3)+B2_CAPW/2,96,"new solar: 34 working days",BA_RED,{align:"center",size:28}));
    if(up>0.01){ctx.fillStyle="rgba(14,11,8,"+(0.8*up)+")";ctx.fillRect(-200,-200,2320,1480);}
    if(up>0.001)b2_lift(ctx,990,470,up,960,430,820,340,{name:"hosting capacity",paper:NOTEC[0],glassA:1,out:fin(t,B-0.3,0.45),back:fin(t,B+0.15,0.4),body:(x,y,cw)=>{const dg=pulseAt(t,w("first","says what it means")-0.1,1.8);
      if(dg>0.01)glow(ctx,x+380,y+186,260,BA_INF,0.3*dg);T(ctx,"the solar a street can take before its voltage",x+28,y+166,{w:600,size:30,color:rgba(INK,0.9)});T(ctx,"or its cables pass their limits",x+28,y+206,{w:600,size:30,color:rgba(INK,0.9)});
      withA(ctx,fin(t,w("owner","Grace")-0.2,0.5),()=>tag(ctx,x+28,y+282,"owner: Grace",TRUST,{size:28}));
      withA(ctx,fin(t,w("owner","no data")-0.2,0.5),()=>b2_chip(ctx,x+250,y+252,210,"no data yet",BA_RED));
      withA(ctx,fin(t,w("first","build it later")-0.3,0.5),()=>b2_chip(ctx,x+484,y+252,300,"data team: later",TECH));}});
    ctx.restore();vign(ctx,S);}
  // the street: how much solar can it take?
  if(stA>0.01)withA(ctx,stA,()=>{setScreen(ctx,S);ctx.save();drift(ctx,t,sc,{z:0.025,x:960,y:520});
    const tS=w("name","the solar")-0.2,on=clamp((t-tWa)/3,0,0.5)+clamp((t-tS)/2.4,0,0.5),v=lerp(0.25,0.9,clamp((t-tS)/2.6,0,1))*(1-0.12*fin(t,w("name","pass their limits")+0.6,1.0));
    b2_street(ctx,t,{on,v,lim:fin(t,w("name","limits")-0.4,0.5),hot:clamp((t-w("name","cables")+0.2)/1.4,0,1)*0.8,gA:fin(t,w("name","voltage")-0.4,0.6)});
    ctx.restore();
    // what the wait is, then the one number it needs
    withA(ctx,fin(t,w("wait","assessing")-0.2,0.5)*(1-fin(t,w("wait","how much solar")-0.6,0.4)),()=>tag(ctx,960,100,"the wait: assessing the network's capacity",BA_RED,{align:"center",size:30}));
    withA(ctx,fin(t,w("wait","how much solar")-0.1,0.5)*(1-fin(t,tNa-0.3,0.5)),()=>tag(ctx,960,100,"how much solar can each street take?",AMBER,{align:"center",size:34}));
    [["no system",w("nobody","No system")],["no report",w("nobody","no report")],["no owner",w("nobody","nobody owns")]].forEach(([s_,t0],i)=>{if(t<t0-0.2)return;const x=520+i*440;
      arrive(ctx,x,190,t,t0-0.2,()=>withA(ctx,1-fin(t,tNa-0.2,0.5),()=>{glass(ctx,x-190,150,380,80,14,BA_RED,{glow:10,ea:0.8,fill:"rgba(20,8,10,0.94)"});T(ctx,s_,x-150,202,{w:700,size:30});kt_rcross(ctx,x+150,190,16,fin(t,t0+0.1,0.4));}),{dy:10});});
    // Grace's engineers' word for it, and what it means; gone before the wall comes back, where the same words are
    if(t>w("name","hosting capacity")-0.3)arrive(ctx,560,190,t,w("name","hosting capacity")-0.2,()=>withA(ctx,1-fin(t,tOw-1.4,0.5),()=>{glass(ctx,80,100,960,190,18,BA_INF,{glow:16,ea:0.85,fill:"rgba(16,10,8,0.95)"});T(ctx,"hosting capacity",110,168,{w:800,size:44});
      T(ctx,"the solar a street can take before its",110,220,{w:600,size:28,color:rgba(INK,0.9)});T(ctx,"voltage or its cables pass their limits",110,258,{w:600,size:28,color:rgba(INK,0.9)});}),{dy:12});
    withA(ctx,fin(t,w("name","voltage")-0.2,0.5),()=>tag(ctx,1830,656,"voltage",SOFT,{align:"center",size:28}));
    withA(ctx,fin(t,w("name","limits")-0.2,0.5),()=>b2_tagR(ctx,1764,330,"limit",BA_RED));
    withA(ctx,fin(t,w("name","cables")-0.2,0.5),()=>tag(ctx,700,420,"the cable warms",[255,140,90],{align:"center",size:28}));});
  vign(ctx,S);});

/* ---------- 7. A glossary from the map ---------- */
const B2_GLOSS=[["connection point","a place where power is delivered","network","Grace",BA_NET],["meter reading","what a meter measured, and when","network","Grace",BA_NET],
  ["hosting capacity","the solar a street can take within its limits","network","Grace",BA_NET],["account","someone who pays a bill","retail","head of retail",BA_RET],
  ["bill","what an account owes for a period","retail","head of retail",BA_RET],["location","where something is, by address and on the map","shared","Grace",BAC]];
scene("glossary",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});
  ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
  const tDr=c("drawn"),tPo=c("point"),X=210,Y=170;
  // one business object, with its four parts; carried into its row as the glossary is drawn from the map
  const mv=ease(clamp((t-tDr+0.1)/1.2,0,1)),G=baGlossary(ctx,X,Y,B2_GLOSS,{a:0}),ry=G.top[2];
  const fields=[["name","hosting capacity",w("object","a name")],["definition","the solar a street can take within its limits",w("object","a definition")],["domain","network",w("object","a domain")],["owner","Grace",w("object","an owner")]];
  const cA=fin(t,0.9,0.6)*(1-fin(t,tDr+0.9,0.4));
  if(cA>0.01){const x=lerp(360,X,mv),y=lerp(250,ry,mv),cw=lerp(1200,G.w,mv),ch=lerp(430,66,mv);withA(ctx,cA,()=>{glass(ctx,x,y,cw,ch,18,BA_INF,{glow:16,ea:0.85,fill:"rgba(16,10,8,0.95)"});
    withA(ctx,1-mv,()=>{archGlyph(ctx,"object",x+cw-40,y+40,15,BA_INF);T(ctx,"business object",x+30,y+56,{f:"mono",w:500,size:28,color:rgba(BA_INF,1)});
      fields.forEach(([k,v,t0],i)=>{const q=fin(t,t0-0.2,0.5),yy=y+132+i*80;withA(ctx,0.35+0.65*q,()=>{T(ctx,k,x+30,yy,{f:"mono",w:500,size:28,color:rgba(i===3?TRUST:SOFT,1)});T(ctx,v,x+280,yy,{w:700,size:i===0?36:30,color:rgba(i===3?TRUST:INK,0.95)});});
        if(q>0.01&&q<1)glow(ctx,x+600,yy-10,200,BA_INF,0.25*(1-q));});});});}
  // the glossary: one term for each, grouped by domain; then the owners' column
  const rowA=B2_GLOSS.map((_,i)=>i===2?fin(t,tDr+0.9,0.3):fin(t,tDr+0.4+[0.1,0.25,0,0.55,0.7,0.9][i],0.5));
  baGlossary(ctx,X,Y,B2_GLOSS,{a:fin(t,tDr-0.1,0.6),rowA,col:3,colA:fin(t,w("tool","every term has an owner")-0.3,0.6),hiRow:B2_GLOSS.map((_,i)=>i===0||i===1?fin(t,tPo+0.8,0.5):0)});
  withA(ctx,fin(t,w("tool","A table is enough")-0.2,0.5),()=>tag(ctx,960,700,"no tool needed to start: a table is enough",AMBER,{align:"center",size:30}));
  // later, what the data team builds points to the terms it holds
  const pA=fin(t,tPo-0.1,0.6);
  if(pA>0.01)withA(ctx,pA,()=>{[["table · meter readings",60,G.top[1]+33,"each table",-1],["report · connections",1460,G.top[0]+33,"report",1]].forEach(([s_,x,ry_,wd,sd])=>{const t0=w("point",wd)-0.2,q=fin(t,t0,0.5);if(q<=0.01)return;
      withA(ctx,q,()=>{b2_chip(ctx,x,778,400,s_,TECH);const ex=sd<0?X-8:X+G.w+8,sx=sd<0?x+70:x+330;arrowTo(ctx,sx,776,ex,ry_,TECH,0.85,{p:clamp((t-t0-0.2)/0.7,0,1),lw:2.5,head:12,dash:[8,7],bend:sd*0.12});});});
    withA(ctx,fin(t,w("point","Later")-0.2,0.5),()=>tag(ctx,960,808,"later",TECH,{align:"center",size:28}));});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. The data practice on the map ---------- */
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});
  ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
  arrive(ctx,500,120,t,0.2,()=>{T(ctx,"the data practice, on the map",120,128,{w:800,size:38});tag(ctx,1800-tw(ctx,"business layer",28,700)-26,116,"business layer",BA_BUS,{size:28});},{dy:-10});
  const at={net:w("domains","the network")-0.3,ret:w("domains","retail")-0.3,shared:w("domains","what they share")-0.3,reading:w("join","Meter readings")-0.3,solar:w("join","hosting capacity")-0.3,bill:w("join","bills")-0.3,location:w("join","Location")-0.3};
  baPractice(ctx,t,{film:2,at,pre:fin(t,0.4,0.8),owners:true,ownersA:fin(t,w("already","its owner")-0.3,0.6),ghost:1,hi:{cp:pulseAt(t,w("already","connection point")-0.1,1.4),account:pulseAt(t,w("already","account")-0.1,1.4)}});
  baPracticeLine(ctx,"team","tickets",1,BA_BUS);baPracticeLine(ctx,"tickets","requests",1,BA_BUS);
  baPracticeAccess(ctx,"requests","cp",1);baPracticeAccess(ctx,"requests","account",1,{lift:330});
  withA(ctx,fin(t,w("domains","glossary's domains")-0.2,0.5)*(1-fin(t,c("already")-0.4,0.5)),()=>tag(ctx,1245,812,"the glossary's domains",BAC,{align:"center",size:28}));
  ctx.restore();vign(ctx,S);});

/* ---------- 9. One meaning, everywhere ---------- */
// Mahan's day of water as a bar in the story's panel: fifteen shares of ninety-six minutes, filling the twenty-four hours exactly,
// each lit in its turn (o.hi, a share's index, and o.hiA); o.ok (0..1): the day adds up
function b2_mahanBar(ctx,a,o){if(a<=0.01)return;o=o||{};const X=490,Wd=1180,y=118,h=58,sw=Wd/15;
  withA(ctx,a,()=>{T(ctx,"one day of water in Mahan: fifteen shares",X,96,{w:700,size:30,color:rgba(INK,0.95)});
    for(let i=0;i<15;i++){const lit=o.hi===i?o.hiA||0:0;ctx.fillStyle=rgba(mix(BA_SAND,BA_WATER,lit),0.45+0.45*lit);ctx.fillRect(X+i*sw+2,y,sw-4,h);if(lit>0.01)glow(ctx,X+i*sw+sw/2,y+h/2,70,BA_WATER,0.3*lit);}
    const ok=o.ok||0;ctx.strokeStyle=rgba(mix(INK,BA_OK,ok),0.5+0.5*ok);ctx.lineWidth=3;ctx.strokeRect(X-2,y-6,Wd+4,h+12);
    if(ok>0.01)withA(ctx,ok,()=>{T(ctx,"15 × 96 minutes = 24 hours",X,y+h+58,{w:800,size:30,color:rgba(BA_OK,1)});kt_gtick(ctx,X+440,y+h+48,16,ok);});});}
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tU=c("utility"),tN=c("next"),wall=fin(t,tU-0.9,1.3);
  // in Mahan: one day of water, and its shares, the same to everyone who holds one, so the water can be counted, and shared
  if(wall<0.99){setScreen(ctx,S);ctx.save();focus(ctx,t,[[0,1880,690,1.5],[3,1900,705,1.65]],5);
    const tS=w("village","shared")-0.4,f1=fin(t,tS,0.5)*(1-fin(t,tS+2.6,0.5));
    b2_village(ctx,t,{wet:[0.9,0.92,0.9,0.88],fill:[0,f1,0,0],gate:[0,f1,0,0],own:[1,1,1,1],child:0,dim:0});
    baTagAt(ctx,S,1790,ba_ys(1790)-60,"a share: the same to everyone who holds one",BIZ,{dy:-30,a:fin(t,w("village","the same")-0.2,0.5)*(1-fin(t,tU-0.7,0.5))});
    ctx.restore();const pA=fin(t,0.6,0.8)*(1-fin(t,tU-0.7,0.5));b2_panel(ctx,pA);
    b2_mahanBar(ctx,pA,{hi:t<tS?Math.floor(Math.max(0,t-1.0)/0.5)%15:6,hiA:t<tS?fin(t,1.0,0.4):f1,ok:fin(t,w("village","counted")-0.2,0.6)});
    eaYear(ctx,80,80,"Mahan · Iran",CLAY,fin(t,0.6,0.8)*(1-fin(t,tU-0.7,0.5)));}
  // at the utility: each concept, one meaning in its domain; then Tomás's next note
  if(wall>0.01)withA(ctx,wall,()=>{wallBg(ctx,S,t);ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
    const notes=b2_done();notes.capacity.name="hosting capacity";
    const nA=1-fin(t,tN-0.6,0.8)*0.75;
    // the owners' names step back with the wall as Tomás comes in, so none is cut off behind him
    withA(ctx,nA,()=>b2_wall(ctx,t,{layers:1,notes,lines:B2_ALL(),lineKind:1,groups:[1,1,1],owners:fin(t,w("utility","in its domain")-0.2,0.6)*(1-fin(t,tN-0.6,0.8)),loc:1}));
    arrive(ctx,860,470,t,tN-0.2,()=>sticky(ctx,860,470,560,150,"Who creates it? "+ba_nb("Who owns it?"),{col:NOTEC[0],size:36,rot:-0.02}),{dy:-16});
    arrive(ctx,1780,760,t,tN-0.4,()=>baPersonR(ctx,"tomas",1790,1040,0.74,{t,expr:"calm"}),{dy:20});ctx.restore();});
  vign(ctx,S);
  baEnd(ctx,S,t,B+0.8,"What the business needs to know","Each concept, defined once in its domain, "+ba_nb("in the business's own words."),"Film 2 of 5");});

// where the chapters meet (From words to data's joins.js): What each capability needs opens on the wall as Never a blank page leaves it,
// In the business's words on the wall as What each capability needs leaves it, and A concept nobody holds on the wall as In the
// business's words leaves it, so each camera carries on from there and nothing shows twice. The data practice's map shows some of the
// glossary's words (account, location) in other places, on the same dark screen: the glossary leaves first, then the map comes in
const CHAPTER_JOINS={glide:["needs","words","missing"],leave:["practice"],bare:(ctx,S,t)=>{setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});vign(ctx,S);}};
