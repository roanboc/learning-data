/* ===== No secret to lose: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (ns_kit.js); what moves is drawn live in the shots of ag_shots. In one room the camera glides and only what changes fades: the hall
   at the end of Kept in the Bank's records glides on into Jun's token, and the ladder's room into Up the ladder (ag_cutInto, at the
   end). Between rooms the picture dissolves, since the whole picture changes there and nothing in it shows twice. The places and years
   of 1990 and the kickers are drawn in the frame, outside the shots, so they stay put and keep their size whatever the camera does; so
   are the cards over a shot whose camera is close in. Nothing is drawn under y 890, where the captions go. */

// the job's badge far off, at the platform's door; close, at the middle of the hall; and the sealed card clipped under it
const NS_MINI={x:1433,y:690,s:0.24},NS_B={x:640,y:250},NS_SC={x:670,y:662,w:540};
// shown from t0 (over d), put away from t1 (over d2)
const ns_on=(t,t0,t1,d,d2)=>ag_in(t,t0,d||0.5)*(t1==null?1:1-ag_in(t,t1,d2||d||0.5));
// the job's badge on its way from the door (u 0) to the middle of the hall (u 1), with no words; its words (w) come in once it's there
function ns_job(ctx,t,u,w,o){o=o||{};const e=ag_sine(u),x=lerp(NS_MINI.x,NS_B.x,e),y=lerp(NS_MINI.y,NS_B.y,e),s=lerp(NS_MINI.s,1,e),a=o.a==null?1:o.a;if(!(a>0))return;
  if(!(u>=1&&w>=1))ns_badgeMini(ctx,x,y,s,{t,a,glow:o.glow,card:o.card});
  if(u>=1&&w>0)ns_badge(ctx,NS_B.x,NS_B.y,{t,a:a*w,glow:o.glow});}
// the sealed card under the job's badge: clipped to it (clip), Jun's token, with "Pay the bearer" beside it (bearer)
function ns_junsCard(ctx,a,o){o=o||{};if(!(a>0))return;ctx.save();ctx.globalAlpha*=a;if(o.clip>0)ns_clipLine(ctx,NS_B.x+NS_BW/2,NS_B.y+NS_BH,o.clip);
  if(o.glow>0)dp_halo(ctx,NS_SC.x+NS_SC.w/2,NS_SC.y+60,420,"violet",0.22*o.glow);
  dp_sealed(ctx,NS_SC.x,NS_SC.y,NS_SC.w,"Jun Park's token",{sub:"Personal · Jun's rights",revoked:o.revoked});
  if(o.grey>0)ns_grey(ctx,NS_SC.x,NS_SC.y,NS_SC.w,120,o.grey);
  if(o.ended>0)ns_ended(ctx,NS_SC.x+NS_SC.w+96,NS_SC.y+60,o.ended,1);
  if(o.bearer>0)ns_bearer(ctx,NS_SC.x+NS_SC.w+22,NS_SC.y+28,o.bearer);ctx.restore();}
// the papers on a pane of glass, top right of the street: fanned (fan), "Pay the bearer" across them (bearer), carried off one by one (gone)
const NS_PP={x:1230,y:96,w:600,h:330};
function ns_papersPane(ctx,a,o){o=o||{};if(!(a>0))return;const P=NS_PP,u=o.fan==null?1:o.fan,g=o.gone||0;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,P.x,P.y,P.w,P.h,{col:o.col||NS_ICE,r:20,glowR:36,glowA:o.col==="coral"?1.6:1});
  ctx.save();rr(ctx,P.x+4,P.y+4,P.w-8,P.h-8,17);ctx.clip();const n=5,cx=P.x+P.w/2,cy=P.y+P.h/2+8,w=250;
  for(let i=0;i<n;i++){const k=i-(n-1)/2,q=clamp(g*1.8-(n-1-i)*0.2,0,1),e=ag_sine(q),rot=k*0.12*u+e*0.5,dx=k*w*0.16*u+e*(160+i*40),dy=Math.abs(k)*8*u-e*(220+i*30),P2=ns_paperPic(i,w);
    if(q>=1)continue;ctx.save();ctx.globalAlpha*=1-q;ctx.translate(cx+dx,cy+dy);ctx.rotate(rot);ctx.drawImage(P2,-P2.width/2,-P2.height/2);ctx.restore();}
  ctx.restore();if(o.bearer>0)ns_bearer(ctx,P.x+P.w-26,P.y+P.h-86,o.bearer,{align:"right"});ctx.restore();}
// a few places far off in the hall, lighting one after another, from which a copy of the token could be used (k: how many are lit)
const NS_FAR=[[96,236],[388,206],[1010,118],[560,132],[150,330],[1170,180]];
function ns_anywhere(ctx,k,a){if(!(a>0))return;NS_FAR.forEach(([x,y],i)=>{const q=clamp(k-i,0,1);if(q<=0)return;ctx.save();ctx.globalAlpha*=a*ag_eo(q);
  dp_halo(ctx,x+60,y+28,110,"violet",0.22);ns_cardIcon(ctx,x,y,120,1);ctx.restore();});}
// three panes, each with a copy of the token, as Sam finds them (k[i] 0 to 1), stamped "Ended" and greyed (ended[i])
const NS_COPIES=[["The job's settings",1370,104],["An old notebook",1370,312],["Jun's laptop",1370,520]];
function ns_copies(ctx,k,ended,a){NS_COPIES.forEach(([s,x,y],i)=>{const q=k[i];if(!(q>0))return;ctx.save();ag_about(ctx,x+NS_CPW/2,y+NS_CPH/2,lerp(0.9,1,ag_spr(q,0,0.7)));
  ns_copyPane(ctx,x+(1-ag_eo(q))*60,y,s,ag_in(q,0,0.6)*(a==null?1:a),{ended:ended?ended[i]:0});ctx.restore();});}
// the platform, its name and its door
function ns_platform(ctx,la,door){ns_platformLabel(ctx,la);ns_door(ctx,door);}

/* ---------------------------------------------------------------- 1 · Bearer paper */
scene("city",(ctx,S,t,sc)=>{const C=sc.cues,
  tPaper=wAt(sc,"paper","money markets"),tPromise=wAt(sc,"promise","promises"),tMsg=wAt(sc,"walks","a messenger"),tBack=wAt(sc,"walks","comes back"),
  tBearer=wAt(sc,"bearer","bearer"),tHolds=wAt(sc,"bearer","whoever"),tMan=wAt(sc,"morning","a man"),tTakes=wAt(sc,"morning","takes"),
  t301=wAt(sc,"inside","three hundred"),tWorth=wAt(sc,"inside","worth"),tCash=wAt(sc,"cash","as good as cash"),tGone=wAt(sc,"gone","the money is gone"),
  tEvery=wAt(sc,"every","every messenger"),tChange=wAt(sc,"change","change");
  const tQ=C.morning-0.3,tW0=tQ,tStop=tTakes-0.25,tMap=C.every-0.3;
  // the messenger of the quiet street walks left at the pulse's pace (a step every 0.6 s), out of the frame before the camera reaches
  // the wall, and stops there; the case is gone when the camera comes back
  const walkX=tt=>2.0-1.25*(Math.min(tt,tStop)-tW0);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsStreet",keys:[[0,960,505,1.14],[C.london+1.0,960,540,1.0]],d:3.4,push:0.02,draw:(c,tt)=>{
      ns_walkers(c,tt,tPaper-2.2,{});
      // the messenger who walks a sale across, the route ahead of him, and the payment coming back along it
      const A=ns_streetPoint(-9.4,1.0,10),B=ns_streetPoint(9.4,1.0,10),ra=ns_on(tt,tMsg+0.3,tBearer-0.2,0.5,0.6);
      if(ra>0){c.save();c.globalAlpha*=ra;dp_link(c,A,B,NS_ICE,ag_sine(clamp((tt-tMsg-0.3)/1.6,0,1)),{dash:[10,10],alpha:0.85});c.restore();}
      const pu=clamp((tt-tBack)/2.4,0,1);if(pu>0&&ra>0){const e=ag_sine(pu);dp_slip(c,lerp(B[0]-40,A[0]+120,e),A[1]-86,"Payment",NS_ICE,{size:28,align:"center",ink:true,a:ra*ag_in(pu,0,0.15)});}
      ns_cross(c,tt,{Z:10,X0:-9.4,X1:9.4,t0:tMsg,v:1.5,ph:0.15});
      // the papers, their promise, and who may cash them
      ns_papersPane(c,ns_on(tt,tPromise,C.morning-1.0,0.6,0.6),{fan:ag_sine(clamp((tt-tPromise-0.2)/1.4,0,1)),bearer:ag_in(tt,tBearer,0.4)});
      ns_card(c,620,110,560,{title:"A promise to pay",sub:"A set sum, on a set day"},tt,tPromise+0.6,tMsg-0.2);
      ns_card(c,620,110,560,{title:"Whoever holds it",sub:"can cash it"},tt,tHolds,C.morning-1.0);}},
    {at:tQ,place:"nsQuiet",dis:0.8,keys:[[0,960,540,1.0],[tMan-0.7,1320,430,1.6],[tTakes+1.4,760,560,1.3]],d:2.0,push:0,draw:(c,tt)=>{
      const X=walkX(tt),p=ns_streetPoint(X,0,10),ph=(Math.min(tt,tStop)-tW0)/1.2+0.25;
      ns_walker(c,p[0],p[1],143.5,ph,{case:1-ag_in(tt,tTakes+0.1,0.2),dir:-1,rim:-1});
      // a shadow crosses the wall, thrown by the lamp behind someone who comes up to him
      const su=clamp((tt-tTakes+0.6)/2.0,0,1);if(su>0&&su<1)ns_shadow(c,lerp(15,10.8,ag_sine(su)),Math.min(1,Math.sin(Math.PI*su)*1.6));
      ns_pillAt(c,p[0]+34,p[1]-46,"Taken","coral",tt,tTakes+2.4,tMap-0.6,{size:30});
      // what was in the case, in the frame (the camera is close in)
      ns_scr(c,S,()=>{const pa=ns_on(tt,t301-0.1,tMap-0.7,0.6,0.6);ns_papersPane(c,pa,{col:"coral",bearer:ag_in(tt,tCash,0.4),gone:clamp((tt-tGone-0.3)/2.2,0,1)});
        ns_card(c,NS_PP.x,NS_PP.y+NS_PP.h+22,NS_PP.w,{title:"301 bills and certificates",sub:"Worth £292 million"},tt,tWorth,tMap-0.7,{col:"coral"});});}},
    {at:tMap,place:"nsMap",dis:0.8,keys:[[0,990,600,1.3],[tMap+0.2,960,540,1.0]],d:3.6,push:0.02,draw:(c,tt)=>{
      // every messenger's case, moving along the City's streets, until they slow and stop
      const R=ag_rnd(9),slow=tChange+0.3,dt=tt-tMap,go=dt<slow-tMap?dt:(slow-tMap)+1.2*ag_eo(clamp((tt-slow)/2.4,0,1))*1.0;
      for(let i=0;i<30;i++){const st=NS_MAP.streets[i%NS_MAP.streets.length],u0=R(),v=(0.022+R()*0.03)*(R()<0.5?1:-1),u=((u0+v*go)%1+1)%1,q=ns_mapAt(st,u);ns_mapCase(c,q[0],q[1],1,0.9);}}}],0.8);
  ns_where(ctx,S,"The City of London · 1990",ns_on(t,0.6,sc.dur-1.6,0.6,0.6));});

// the shadow of someone who isn't shown, thrown up the quiet street's right-hand wall by the lamp behind him: long, and growing as he
// comes nearer (Z his depth along the street; a its strength)
function ns_shadow(ctx,Z,a){if(!(a>0))return;const X=7.5,base=ns_streetPoint(X,0,Z),top=ns_streetPoint(X,4.6,Z+1.2),w=820*0.5/Z,h=base[1]-top[1],x=base[0];ctx.save();ctx.globalAlpha*=a*0.8;
  ctx.filter="blur(5px)";ctx.fillStyle="rgb(3,8,10)";
  ctx.beginPath();ctx.ellipse(top[0]+w*0.1,top[1]+h*0.07,w*0.4,h*0.07,-0.12,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(top[0]-w*0.75,top[1]+h*0.17);ctx.quadraticCurveTo(top[0],top[1]+h*0.11,top[0]+w*0.8,top[1]+h*0.18);ctx.lineTo(x+w*0.55,base[1]-h*0.01);ctx.lineTo(x-w*0.5,base[1]);ctx.closePath();ctx.fill();
  ctx.filter="none";ctx.restore();}

/* ---------------------------------------------------------------- 2 · Kept in the Bank's records */
scene("bank",(ctx,S,t,sc)=>{const C=sc.cues,
  tCmo=wAt(sc,"opens","Central Money Markets Office"),tStays=wAt(sc,"vault","stays there"),tKept=wAt(sc,"records","kept"),
  tSale=wAt(sc,"sale","changes the record"),tBoth=wAt(sc,"sale","both sides"),tFirst=wAt(sc,"first","Forty-four"),tWhy=wAt(sc,"why","why"),
  tEmpty=wAt(sc,"streets","off the streets"),tToo=wAt(sc,"too","bearer paper"),tYou=wAt(sc,"too","whoever holds it"),tJob=wAt(sc,"job","a nightly job"),
  tCarry=wAt(sc,"nobody","carry a secret");
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsFront",keys:[[0,960,560,1.06]],push:0.03,draw:(c,tt)=>{
      ns_scr(c,S,()=>ns_card(c,520,118,880,{kick:"1 October 1990",title:"The Central Moneymarkets Office",sub:"Opened by the Bank of England"},tt,tCmo,C.vault-1.0));}},
    {at:C.vault-0.3,place:"nsVault",dis:0.8,keys:[[0,960,520,1.0],[tStays,960,500,1.1]],d:2.6,push:0,draw:(c,tt)=>{
      ns_vaultDoor(c,clamp((tt-tStays)/1.8,0,1));
      ns_scr(c,S,()=>dp_slip(c,960,64,"The paper stays at the Bank",NS_ICE,{align:"center",ink:true,a:ns_on(tt,tStays+1.4,C.records-1.0,0.5,0.5)}));}},
    {at:C.records-0.3,place:"nsOffice",dis:0.8,keys:[[0,1020,470,1.08]],push:0.02,draw:(c,tt)=>{
      ns_screen(c,tt,{rows:tKept,sale:tSale,both:tBoth});
      ns_scr(c,S,()=>{ns_card(c,1552,186,340,{title:"44 firms",sub:"from the first day"},tt,tFirst,tWhy-0.4);
        ns_card(c,420,596,1080,{kick:"The Bank of England, 1990",title:"“…avoiding the risks and expense of moving paper physically around the City.”"},tt,tWhy+0.3,C.streets-1.0,{col:NS_ICE});});}},
    {at:C.streets-0.3,place:"nsStreet",dis:0.8,keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      ns_walkers(c,tt,C.streets-6.0,{case:0});
      ns_scr(c,S,()=>dp_slip(c,960,160,"No paper in their hands",NS_ICE,{align:"center",ink:true,a:ns_on(tt,tEmpty,C.too-0.9,0.5,0.5)}));}},
    {at:C.too-0.4,place:"nsHall",dis:0.8,keys:[[0,900,540,1.0],[tJob-0.1,1182,600,1.3],[C.breath-0.6,960,540,1.0]],d:2.4,push:0,draw:(c,tt)=>{
      // a sign-in secret is bearer paper too
      const ka=ns_on(tt,tToo-0.5,tJob-0.5,0.6,0.6);if(ka>0){c.save();c.globalAlpha*=ka;ag_about(c,640,410,lerp(0.9,1,ag_spr(tt,tToo-0.5,0.7)));
        dp_sealed(c,320,362,640,"A password, a token or a key",{});ns_bearer(c,960-24,330,ag_in(tt,tToo+0.3,0.4),{align:"right"});
        dp_pill(c,640,560,"Whoever holds it, is you","cyan",{align:"center",size:30,a:ag_in(tt,tYou,0.4)});c.restore();}
      // and the nightly job still carries one, to the platform's door; until nobody has to carry a secret at all
      ns_door(c,0.5*ag_in(tt,tJob,0.8)+0.5*ag_in(tt,tCarry,0.8));
      ns_badgeMini(c,NS_MINI.x,NS_MINI.y,NS_MINI.s,{t:tt,a:ag_in(tt,tJob,0.6),card:1-ag_in(tt,tCarry+0.2,0.9)});}}],0.8);
  // the place and its year, in the frame: the Bank's, then the City's
  ns_where(ctx,S,"The Bank of England · 1990",ns_on(t,0.6,C.streets-0.9,0.6,0.5));
  ns_where(ctx,S,"The City of London · 1990",ns_on(t,C.streets+0.2,C.too-0.9,0.5,0.5));
  dp_title(ctx,S,t,C.breath,NS_TITLE,null,NS_LINE);});

// the back office's screen: the papers, each with its owner; a sale; both sides' acceptance; the owner changing; nothing leaves the vault
const NS_ROWS=[["TREASURY BILL  0412","MEMBER A"],["TREASURY BILL  0413","MEMBER A"],["TREASURY BILL  0414","MEMBER C"],["CERT OF DEPOSIT  1187","MEMBER D"]];
function ns_screen(ctx,t,o){const X=NS_SCREEN.x+60,Y=NS_SCREEN.y+70,ink=NS_PHOSPHOR,f={w:500,size:30,f:"mono",col:ink};ns_screenGlass(ctx,1);
  dp_T(ctx,"CENTRAL MONEYMARKETS OFFICE",X,Y,Object.assign({},f,{a:ag_in(t,o.rows-0.6,0.4),col:"mut"}));
  const sold=ag_in(t,o.both+2.0,0.3);
  NS_ROWS.forEach(([p,own],i)=>{const a=ag_in(t,o.rows+i*0.3,0.25);if(a<=0)return;const y=Y+70+i*52;dp_T(ctx,p,X,y,Object.assign({},f,{a}));
    const nw=i<2&&sold>0;dp_T(ctx,nw&&sold>=1?"MEMBER B":own,X+560,y,Object.assign({},f,{a:a*(nw&&sold<1?1-sold:1)}));if(nw&&sold<1)dp_T(ctx,"MEMBER B",X+560,y,Object.assign({},f,{a:a*sold}));
    if(i<2){const h=ns_on(t,o.both+2.0,o.both+4.2,0.3,0.8);if(h>0){ctx.save();ctx.globalAlpha*=h*0.35;ctx.fillStyle=rgba(ink,1);rr(ctx,X+548,y-30,190,40,6);ctx.fill();ctx.restore();}}});
  const s=ag_in(t,o.sale,0.3);if(s<=0)return;const y0=Y+300;dp_T(ctx,"SALE  50 BILLS  MEMBER A TO MEMBER B",X,y0,Object.assign({},f,{a:s}));
  [["ACCEPTED BY A",o.both],["ACCEPTED BY B",o.both+0.8]].forEach(([w,tk],i)=>{const a=ag_in(t,tk,0.25);if(a<=0)return;const y=y0+56+i*50;dp_tick(ctx,X+18,y-10,"green",clamp((t-tk)/0.5,0,1));dp_T(ctx,w,X+56,y,Object.assign({},f,{a}));});}

/* ---------------------------------------------------------------- 3 · Jun's token */
scene("token",(ctx,S,t,sc)=>{const C=sc.cues,
  tTwo=wAt(sc,"two","at two"),tJob=wAt(sc,"two","a job"),tPlat=wAt(sc,"two","data platform"),tSam=wAt(sc,"own","Sam Okafor"),tId=wAt(sc,"own","an identity"),tName=wAt(sc,"own","registrar loader"),
  tJuns=wAt(sc,"still","Jun Park's"),tMade=wAt(sc,"made","Jun made it"),tDate=wAt(sc,"made","fourteenth"),tNoEnd=wAt(sc,"made","no end date"),
  tIs=wAt(sc,"whoever","is Jun"),tAny=wAt(sc,"reads","from anywhere"),tHour=wAt(sc,"reads","at any hour"),tLong=wAt(sc,"reads","for as long as"),
  tSet=wAt(sc,"finds","the job's settings"),tNote=wAt(sc,"finds","an old notebook"),tLap=wAt(sc,"finds","a file"),tMany=wAt(sc,"copy","how many"),
  tMoves=wAt(sc,"moves","moves"),tWrong=wAt(sc,"wrong","quickest"),tBearer=wAt(sc,"streets","bearer paper");
  const tGrow=tId-0.2,tWords=Math.max(tGrow+1.8,tName-0.3);
  // Jun: in when he's named, out to the side while Sam looks for copies, back in, then off to another team
  const junX=tt=>tt<C.place?1720:tt<tMoves?1720+180*ag_sine((tt-C.place)/1.0):lerp(1900,1830,ag_sine((tt-tMoves+0.2)/1.4)),
        junA=tt=>ag_in(tt,tMade,0.6)*(tt<tMoves-0.2?1-ag_in(tt,C.place,0.8):ag_in(tt,tMoves-0.2,0.6));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsHall",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      ns_platform(c,ag_in(tt,tPlat,0.6),0.5+0.4*ns_on(tt,tJob,tJob+2.4,0.5,0.8));
      ns_clock(c,700,100,ag_in(tt,tTwo-0.2,0.5));
      dp_person(c,"sam",250,640,0.9,{t:tt,a:ag_in(tt,tSam,0.6),gaze:[3,0]});
      const ja=junA(tt);if(ja>0)dp_person(c,"jun",junX(tt),640,0.9,{t:tt+1.3,flip:true,a:ja,gaze:[-3,0]});
      // the job: at the door, then close, with its name; Jun's token clipped under it
      const u=clamp((tt-tGrow)/1.7,0,1);ns_job(c,tt,u,ag_in(tt,tWords,0.5));
      const ca=ag_in(tt,tJuns-0.2,0.5);ns_junsCard(c,ca,{clip:ag_in(tt,tJuns-0.4,0.4),glow:ns_on(tt,tIs-0.2,C.reads+1.0,0.5,0.8),bearer:ag_in(tt,tBearer,0.4)});
      if(ca>0){const pa=ns_on(tt,tDate,C.place,0.4,0.6);if(pa>0){const w1=dp_tw(c,"Made 14 March 2024",{w:700,size:28})+36;
        ns_pillAt(c,NS_SC.x,846,"Made 14 March 2024","violet",tt,tDate,C.place);ns_pillAt(c,NS_SC.x+w1+18,846,"No end date","violet",tt,tNoEnd,C.place);}}
      // to the platform, whoever holds it is Jun: from anywhere, at any hour
      const la=ns_on(tt,tIs,C.place-0.4,0.5,0.6);if(la>0){dp_link(c,[NS_SC.x+NS_SC.w,NS_SC.y+60],[junX(tt)-110,770],"cyan",ag_sine(clamp((tt-tIs)/0.9,0,1)),{alpha:la});
        dp_tag(c,1300,250,"To the platform: Jun","cyan",{a:la});}
      ns_anywhere(c,ag_in(tt,tAny,0.3)*2+ag_in(tt,tHour,0.3)*2+ag_in(tt,tLong,0.3)*2,ns_on(tt,tAny,C.place-0.4,0.3,0.6));
      // the copies Sam finds, and nobody can say how many more
      ns_copies(c,[ag_in(tt,tSet,0.6),ag_in(tt,tNote,0.6),ag_in(tt,tLap,0.6)],null,1-ag_in(tt,C.moves-0.4,0.6));
      ns_pillAt(c,1605,846,"How many more?","coral",tt,tMany,C.moves-0.4,{align:"center",size:30});
      // when Jun moves to another team, the job's line to him stretches
      const ma=ns_on(tt,tMoves,C.streets-0.4,0.5,0.6);if(ma>0){dp_link(c,[NS_SC.x+NS_SC.w,NS_SC.y+60],[junX(tt)-110,770],"cyan",1,{alpha:ma*0.9,dash:[12,10]});
        dp_tag(c,1560,282,"Another team",NS_ICE,{a:ma});}
      ns_card(c,1250,96,560,{title:"The quickest way to start",sub:"It has worked since March 2024"},tt,tWrong,C.streets-0.4);}}],0.8);
  ns_kick(ctx,S,t,"Jun's token");});

/* ---------------------------------------------------------------- 4 · Who holds a secret? */
scene("ladder",(ctx,S,t,sc)=>{const C=sc.cues,
  tProve=wAt(sc,"prove","prove"),tQ=wAt(sc,"ways","one question"),tSomeone=wAt(sc,"someone","someone else"),tBear=wAt(sc,"rights","bearer paper"),
  tReads=wAt(sc,"vault","reads"),tMach=wAt(sc,"vault","a machine changes"),tCopy=wAt(sc,"types","a copy"),tNever=wAt(sc,"cert","never sends"),
  tSign=wAt(sc,"signing","by signing"),tWire=wAt(sc,"signing","never crosses"),tRenew=wAt(sc,"renewed","renewed"),
  tShort=wAt(sc,"signs","a short note"),tLets=wAt(sc,"signs","lets it in"),tVouch=wAt(sc,"knows","vouches"),tNew=wAt(sc,"passes","a new one"),tHour=wAt(sc,"passes","within the hour");
  const tIn=[C.person,C.own,C.vault,C.cert,C.note,C.top],tOut=[C.own,C.vault,C.cert,C.note,C.top,C.goal],L=NS_WL;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsLadder",keys:[[0,960,571,1.06],[C.own,960,560,1.06],[C.vault,960,549,1.06],[C.cert,960,538,1.06],[C.note,960,527,1.06],[C.top,960,516,1.06],[C.goal,960,540,1.0]],d:2.0,push:0,draw:(c,tt)=>{
      const goal=ag_in(tt,C.goal,0.8);
      ns_ladder(c,L,{rails:clamp((tt-tProve+0.4)/2.2,0,1),rung:k=>({in:ag_in(tt,tIn[k],0.6),words:ag_in(tt,tIn[k]+0.15,0.5),card:ag_in(tt,tIn[k]+0.7,0.5),
        lit:Math.max(ns_on(tt,tIn[k],tOut[k],0.5,0.6),k>=4?goal:0),dim:0.45*ag_in(tt,tOut[k],0.6)*(1-goal)})});
      ns_goal(c,L,ag_in(tt,C.goal+0.6,0.7));
      // the one question; then what each rung means, one picture at a time
      ns_card(c,120,236,640,{kick:"One question",title:"Who holds a secret, and for how long?"},tt,tQ,C.person-0.4);
      ns_rungPics(c,tt,{tIn,tOut,tSomeone,tBear,tReads,tMach,tCopy,tNever,tSign,tWire,tRenew,tShort,tLets,tVouch,tNew,tHour});
      ns_card(c,120,430,640,{kick:"The goal",title:"Nobody makes, keeps, copies or changes a secret"},tt,C.goal+1.2,null,{col:"green"});}}],0.8);
  ns_kick(ctx,S,t,"Who holds a secret?");});

// what each rung of the job's ladder means, drawn at the left while it's named (T: the times of its words)
function ns_rungPics(c,tt,T){const A=k=>ns_on(tt,T.tIn[k]+0.2,T.tOut[k]-0.5,0.6,0.5),mp=Math.max(A(3),A(4),A(5));
  // the platform the job signs in to, at the right of the pictures, for the rungs that sign or are vouched for
  ns_miniPlatform(c,mp,Math.max(ns_on(tt,T.tWire,T.tOut[3]-0.5,0.4,0.5),ns_on(tt,T.tLets,T.tOut[4]-0.5,0.4,0.5),ns_on(tt,T.tVouch,T.tOut[5]-0.5,0.5,0.5)));
  // 0: the job runs as a person, with everything they may do; a person's token clipped to it
  let a=A(0);if(a>0){const g=0.55+0.45*ag_in(tt,T.tSomeone,0.8);ns_ghost(c,330,300,2.4,a*g);ns_jobSmall(c,250,338,0.5,a,tt);
    c.save();c.globalAlpha*=a;ns_clipLine(c,400,524,1);dp_sealed(c,190,566,420,"A person's token",{});c.restore();}
  // 1: a token of its own: its own rights, still bearer paper
  a=A(1);if(a>0){ns_jobSmall(c,250,338,0.5,a,tt);c.save();c.globalAlpha*=a;ns_clipLine(c,400,524,1);dp_sealed(c,190,566,420,"The job's own token",{});
    ns_bearer(c,610,520,ag_in(tt,T.tBear,0.4),{align:"right"});c.restore();}
  // 2: a secret in a vault, read as the job starts, changed by a machine; a copy still works while it's valid
  a=A(2);if(a>0){ns_vault(c,160,250,480,290,a,clamp((tt-T.tMach)/1.0,0,1),{title:"A vault"});ns_jobSmall(c,200,600,0.42,a,tt);
    const ra=a*ag_in(tt,T.tReads,0.5);if(ra>0){c.save();c.globalAlpha*=ra;dp_link(c,[326,600],[326,542],"violet",ag_sine(clamp((tt-T.tReads)/0.6,0,1)),{dash:[8,8]});c.restore();}
    const cp=clamp((tt-T.tCopy)/1.0,0,1);if(cp>0){c.save();c.globalAlpha*=a;const e=ag_eo(cp);dp_halo(c,lerp(400,560,e),lerp(430,680,e),110,"coral",0.25*cp);ns_cardIcon(c,lerp(320,470,e),lerp(400,640,e),190,1);c.restore();}}
  // 3: a certificate: a key the job keeps, and a signature that crosses instead; renewed before it ends
  a=A(3);if(a>0){ns_jobSmall(c,170,330,0.5,a,tt);ns_key(c,248,580,1.4,"violet",a*(0.8+0.2*ns_on(tt,T.tRenew,T.tOut[3],0.4,0.4)));
    ns_signature(c,[472,420],NS_MPDOOR,clamp((tt-T.tSign)/1.4,0,1),a);ns_pillAt(c,170,700,"Renewed before it ends","violet",tt,T.tRenew,T.tOut[3]-0.5);}
  // 4: a note from where the job runs, signed there, used once at the door, then gone
  a=A(4);if(a>0){ns_builder(c,150,296,a,tt,"Where it runs");
    const nu=clamp((tt-T.tShort)/1.0,0,1),go=clamp((tt-T.tLets)/1.2,0,1);if(nu>0){c.save();const e=ag_sine(go);c.translate(lerp(0,240,e),lerp(0,-30,e));
      ns_note(c,110,480,a*ag_in(nu,0,0.6)*(1-ag_in(go,0.55,0.45)),tt,{title:"This job",from:"from here"});c.restore();}}
  // 5: an identity the platform gives it: vouched for, and a pass made for each run that ends within the hour
  a=A(5);if(a>0){ns_jobSmall(c,170,330,0.5,a,tt,{glow:ag_in(tt,T.tVouch,0.6)});
    c.save();c.globalAlpha*=a;dp_link(c,[470,423],[NS_MPDOOR[0]-40,NS_MPDOOR[1]],"cyan",ag_sine(clamp((tt-T.tVouch)/0.8,0,1)),{alpha:0.9});c.restore();
    dp_slip(c,100,234,"Vouched for by the platform","cyan",{size:28,a:a*ag_in(tt,T.tVouch,0.5)});
    ns_pass(c,170,580,a*ns_on(tt,T.tNew,T.tOut[5]-0.4,0.5,0.4),clamp((tt-T.tNew-0.4)/0.6,0,1),clamp((tt-T.tHour)/0.6,0,1));}}

/* ---------------------------------------------------------------- 5 · Up the ladder */
scene("climb",(ctx,S,t,sc)=>{const C=sc.cues,
  tVouch=wAt(sc,"vouches","vouches"),tRole=wAt(sc,"role","the loader role's"),tBuild=wAt(sc,"build","the build service"),tSigns=wAt(sc,"build","signs a note"),
  tNo=wAt(sc,"build","no secret"),tEnds=wAt(sc,"ends","ends"),tSet=wAt(sc,"worthless","the settings"),tNote=wAt(sc,"worthless","the notebook"),tLap=wAt(sc,"worthless","the laptop"),
  tThief=wAt(sc,"thief","a thief"),tB=wAt(sc,"before","Before"),tN=wAt(sc,"now","Now"),tTeam=wAt(sc,"never","moves team"),tNever=wAt(sc,"never","never his"),
  tCant=wAt(sc,"cant","can't climb"),tPw=wAt(sc,"cant","the password goes"),tMach=wAt(sc,"owner","A machine"),tDown=wAt(sc,"owner","written down"),tTop=wAt(sc,"starts","at the top");
  const L=NS_WL,tHall=tVouch-0.6,tBack=C.starts-0.4,clU=tt=>5*ag_sine(clamp((tt-C.up-0.2)/(tHall-C.up-0.9),0,1));
  const junX=tt=>lerp(1720,1840,ag_sine((tt-tTeam)/1.6)),junA=tt=>ns_on(tt,C.never-0.2,C.cant-0.2,0.6,0.7);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsLadder",keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      // the job climbs, each rung lit as it passes
      const p=clU(tt);ns_ladder(c,L,{rung:k=>({lit:Math.max(0,1-Math.abs(p-k)*1.4)})});ns_goal(c,L,1-ag_in(tt,0.2,0.8));
      ns_jobSmall(c,690,ns_rungY(L,0)+6-(ns_rungY(L,0)-ns_rungY(L,5))*p/5,0.27,ag_in(tt,0.2,0.6),tt,{glow:clamp(p-4,0,1)});}},
    {at:tHall,place:"nsHall",dis:0.8,keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      ns_platform(c,1,0.6+0.4*ag_in(tt,tVouch,0.6));
      dp_person(c,"sam",250,640,0.9,{t:tt,gaze:[3,0]});
      const ja=junA(tt);if(ja>0)dp_person(c,"jun",junX(tt),640,0.9,{t:tt+1.3,flip:true,a:ja,gaze:[-3,0]});
      // vouched for: the job's badge, lit, with nothing clipped to it (away while the two cards compare what a thief would find)
      const ba=1-ns_on(tt,tThief-0.2,C.never-0.4,0.6,0.6);ns_badge(c,NS_B.x,NS_B.y,{t:tt,a:ba,glow:ag_in(tt,tVouch,0.8)});
      dp_slip(c,NS_B.x,166,"Vouched for by the platform","cyan",{a:ba*ag_in(tt,tVouch+0.2,0.5)});
      dp_tag(c,1290,440,"Decided when it got its name","cyan",{a:ns_on(tt,tRole,C.build+0.6,0.5,0.6),to:[NS_B.x+NS_BW-60,NS_B.y+262],p:ag_sine(clamp((tt-tRole-0.2)/0.6,0,1))});
      // the build service signs a note for each run: it takes the token's place, is used once, and goes; no secret stored there
      ns_builder(c,84,176,ns_on(tt,tBuild,C.ends-0.3,0.5,0.6),tt);
      const na=ns_on(tt,tSigns,tNo+1.2,0.5,0.6);if(na>0){c.save();c.globalAlpha*=na;dp_link(c,[414,252],[NS_SC.x,NS_SC.y+88],"cyan",ag_sine(clamp((tt-tSigns)/0.8,0,1)),{dash:[10,9]});
        ns_clipLine(c,NS_B.x+NS_BW/2,NS_B.y+NS_BH,1);c.restore();ns_note(c,NS_SC.x,NS_SC.y,na,tt);}
      ns_pillAt(c,84,364,"No secret stored","green",tt,tNo+0.4,C.ends-0.3);
      // Jun's token ended: the card stamped and greyed, as its copies are
      const ea=ns_on(tt,tEnds-0.3,tThief-0.3,0.5,0.6),ek=clamp((tt-tEnds-0.3)/0.7,0,1);
      ns_junsCard(c,ea,{ended:ek,grey:clamp((tt-tEnds-1.0)/1.2,0,1)});
      const ck=[ag_in(tt,tSet-0.3,0.5),ag_in(tt,tNote-0.3,0.5),ag_in(tt,tLap-0.3,0.5)];
      ns_copies(c,ck,[clamp((tt-tSet-0.1)/0.7,0,1),clamp((tt-tNote-0.1)/0.7,0,1),clamp((tt-tLap-0.1)/0.7,0,1)],1-ag_in(tt,tThief-0.3,0.6));
      // what a thief would find tonight, before and now
      ns_card(c,384,190,560,{kick:"Before",title:"Jun's token",sub:"Everything Jun can read, from anywhere, with no end date"},tt,tB,C.never-0.5,{col:"coral"});
      ns_card(c,984,190,560,{kick:"Now",title:"A pass for one run",sub:"One job's rights, stored by nobody, ends within the hour"},tt,tN,C.never-0.5,{col:"green"});
      // Jun moves team, and nothing breaks
      dp_tag(c,1560,282,"Another team",NS_ICE,{a:ns_on(tt,tTeam,C.cant-0.3,0.5,0.6)});dp_tick(c,NS_B.x+NS_BW-6,NS_B.y-2,"green",clamp((tt-tNever)/0.6,0,1)*(1-ag_in(tt,C.cant-0.3,0.6)));
      // a system that can't climb yet: its password in a vault, changed by a machine, the exception written down
      const va=ns_on(tt,tCant,tBack-0.2,0.6,0.5);if(va>0){dp_slip(c,1300,118,"Only takes a password",NS_ICE,{ink:true,a:va});
        ns_vault(c,1300,214,540,290,va,clamp((tt-tMach)/1.0,0,1),{title:"A vault",label:"The password",label2:"A new password",open:ns_on(tt,tPw+0.4,tPw+2.2,0.4,0.5)});
        c.save();c.globalAlpha*=va*ag_in(tt,tPw,0.5);dp_link(c,[NS_B.x+NS_BW,NS_B.y+200],[1300,360],"cyan",ag_sine(clamp((tt-tPw)/0.7,0,1)),{dash:[10,9]});c.restore();
        ns_card(c,1300,530,540,{kick:"The exception",title:"Written down",sub:"Why, and who owns it"},tt,tDown,tBack-0.2);}}},
    {at:tBack,place:"nsLadder",dis:0.8,keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      // every new job starts at the top
      ns_ladder(c,L,{rung:k=>({lit:k===5?ag_in(tt,tTop-0.2,0.6):0,dim:k<4?0.45:0})});
      [0,1,2].forEach(i=>{const q=clamp((tt-tTop+0.3-i*0.35)/1.0,0,1);if(q<=0)return;const e=ag_sine(q);ns_jobSmall(c,lerp(380,690-i*186,e),ns_rungY(L,5)+6,0.27,ag_in(q,0,0.5),tt+i,{glow:e});});}}],0.8);
  ns_kick(ctx,S,t,"Up the ladder");});

/* ---------------------------------------------------------------- 6 · A ladder for people */
scene("people",(ctx,S,t,sc)=>{const C=sc.cues,
  tWho=wAt(sc,"shared","who did what"),tFake=wAt(sc,"password","a fake page"),tMoved=wAt(sc,"text","moved"),tCode=wAt(sc,"text","the code typed"),
  tPassOn=wAt(sc,"app","pass on"),tYes=wAt(sc,"app","your yes"),tKey=wAt(sc,"passkey","a passkey"),tStays=wAt(sc,"stays","stays"),
  tFace=wAt(sc,"unlock","your face"),tFinger=wAt(sc,"unlock","your fingerprint"),tReal=wAt(sc,"real","the real site"),tNothing=wAt(sc,"real","gets nothing"),
  tHalf=wAt(sc,"half","the matching half"),tSam=wAt(sc,"once","Sam"),tJun=wAt(sc,"once","Jun"),tMei=wAt(sc,"once","Mei"),tItself=wAt(sc,"agents","as itself"),tToken=wAt(sc,"agents","a person's token");
  const tIn=[C.shared,C.password,C.text,C.app,C.passkey],tOut=[C.password,C.text,C.app,C.passkey,C.once],L=NS_PL,tRow=C.once-0.3,tAg=C.agents-0.4;
  const P={x:430,y:150,w:360,h:600};   // Mei's phone, large, at the left of the ladder
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsPeople",keys:[[0,960,540,1.0]],push:0.025,draw:(c,tt)=>{
      const la=1-ag_in(tt,tRow,0.8);
      ns_ladder(c,L,{a:la,rails:clamp((tt-C.too-0.2)/2.0,0,1),rung:k=>({in:ag_in(tt,tIn[k],0.6),words:ag_in(tt,tIn[k]+0.15,0.5),card:ag_in(tt,tIn[k]+0.7,0.5),
        lit:ns_on(tt,tIn[k],k===4?tRow:tOut[k],0.5,0.6),dim:k<4?0.6*ag_in(tt,tOut[k],0.6):0})});
      ns_peoplePics(c,tt,{tIn,tOut,tWho,tFake,tMoved,tCode,tPassOn,tYes,tKey,tStays,tFace,tFinger,tReal,tNothing,tHalf,tRow,P});
      // everyone at the university signs in once, with a passkey
      [["sam",430,tSam,"Sam"],["jun",960,tJun,"Jun"],["mei",1490,tMei,"Mei"]].forEach(([w,x,tn,nm],i)=>{const a=ns_on(tt,tRow+0.5+i*0.25,tAg-0.4,0.8,0.5);if(a<=0)return;
        dp_person(c,w,x,664,0.85,{t:tt+i*0.7,a,gaze:[i===2?-3:3,0],flip:i===2});
        const na=a*ag_in(tt,tn-0.2,0.4);if(na>0){c.save();c.globalAlpha*=na;const pw=dp_pill(c,x,352,nm,"cyan",{align:"center",size:30});dp_tick(c,x+pw/2+30,340,"green",clamp((tt-tn)/0.6,0,1));c.restore();}});}},
    {at:tAg,place:"nsLadder",dis:0.8,keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      // agents climb the job's ladder too: each signs in as itself, never on a person's token
      ns_ladder(c,NS_WL,{rung:k=>({lit:k===5?ag_in(tt,tItself-0.3,0.6):0,dim:k<4?0.45:0})});
      ag_model(c,786,ns_rungY(NS_WL,5)+54,46,{t:tt,a:ag_in(tt,tAg+0.5,0.6),col:"cyan"});
      dp_slip(c,150,300,"Signs in as itself","cyan",{a:ag_in(tt,tItself,0.5)});
      c.save();c.globalAlpha*=ag_in(tt,tToken-0.2,0.5);dp_sealed(c,150,420,460,"A person's token",{revoked:clamp((tt-tToken)/0.8,0,1)});c.restore();}}],0.8);
  ns_kick(ctx,S,t,"A ladder for people");});

// what each rung of the people's ladder means, drawn at the left while it's named
function ns_peoplePics(c,tt,T){const A=k=>ns_on(tt,T.tIn[k]+0.2,T.tOut[k]-0.5,0.6,0.5),P=T.P;
  // 0: one account, three people: who did what?
  let a=A(0);if(a>0){ns_shared(c,150,250,a);ns_pillAt(c,180,660,"Who did what?","coral",tt,T.tWho,T.tOut[0]-0.5,{size:30});}
  // 1: a password alone, typed into a fake page
  // typed in, the page gets a copy of it: the copy lands in the page's field, under its name, and the password stays where it was
  a=A(1);if(a>0){const u=clamp((tt-T.tFake)/1.1,0,1);c.save();c.globalAlpha*=a;dp_sealed(c,160,260,460,"Your password",{});
    if(u>0)ns_relay(c,[430,356],[430,474],ag_sine(Math.min(1,u*1.6)),"coral",1);ns_page(c,150,470,560,250,"A fake page","coral",1);
    if(u>0){c.save();c.globalAlpha*=ag_in(u,0.4,0.5);ag_about(c,430,614,lerp(0.92,1,ag_spr(u,0.4,0.6)));dp_sealed(c,190,566,480,"Your password",{});c.restore();}c.restore();}
  // 2: a code by text; the number moved to a thief's phone
  a=A(2);if(a>0){ns_phone(c,160,250,240,440,a,(x,sx,sy,sw)=>{c.save();dp_panel(c,sx+14,sy+60,sw-28,150,{col:NS_ICE,r:14,glowR:20});dp_T(c,"A text",sx+34,sy+110,{w:700,size:30});ns_cardIcon(c,sx+34,sy+130,140,1);c.restore();});
    ns_phone(c,560,250,240,440,a*ag_in(tt,T.tMoved-0.6,0.5),null,{col:"coral"});ns_numberMove(c,[280,470],[680,470],clamp((tt-T.tMoved)/1.4,0,1),a);}
  // 3: an app asks "Is this you?", and a fake page passes on your yes
  a=A(3);if(a>0){ns_phone(c,160,250,260,460,a,(x,sx,sy,sw)=>{dp_T(c,"Is this you?",sx+20,sy+90,{w:700,size:30});
      dp_pill(c,sx+20,sy+170,"Yes","green",{size:30,glow:10+14*ns_on(tt,T.tYes,T.tOut[3],0.3,0.4)});});
    ns_page(c,500,300,330,230,"A fake page","coral",a);ns_relay(c,[500,420],[420,420],ag_sine(clamp((tt-T.tPassOn)/0.8,0,1)),"coral",a);}
  // 4: a passkey: a key that stays on the phone, unlocked with a face or a fingerprint; it answers only the real site
  a=ns_on(tt,T.tIn[4]+0.2,T.tRow,0.6,0.6);if(a>0){const mei=1-ag_in(tt,T.tReal-0.6,0.8);
    if(mei>0)dp_person(c,"mei",210,640,0.9,{t:tt,a:a*mei,pose:"hold",hold:ns_heldPhone,gaze:[3,-1]});
    const px=lerp(P.x,P.x+50,ag_sine(clamp((tt-T.tReal+0.6)/1.2,0,1)));
    ns_phone(c,px,P.y,P.w,P.h,a,(x,sx,sy,sw,sh)=>{dp_T(c,"Sign in to",sx+22,sy+60,{w:700,size:30});dp_T(c,"the university",sx+22,sy+100,{w:700,size:30});
      dp_pill(c,sx+22,sy+170,"Use your passkey","cyan",{size:28});
      const kg=0.6+0.4*ns_on(tt,T.tStays,T.tStays+2.4,0.4,0.8);dp_halo(c,sx+sw/2,sy+290,120,"violet",0.25*kg);ns_key(c,sx+sw/2+6,sy+290,1.3,"violet",1);
      ns_faceIcon(c,sx+sw/2-60,sy+430,32,"cyan",0.45+0.55*ag_in(tt,T.tFace,0.4));ns_fingerIcon(c,sx+sw/2+60,sy+430,32,"cyan",0.45+0.55*ag_in(tt,T.tFinger,0.4));});
    // only the real site gets an answer; a fake page gets nothing
    const ra=ns_on(tt,T.tReal+0.3,T.tHalf-0.4,0.5,0.6);if(ra>0){ns_page(c,110,170,330,220,"The university","cyan",ra,{draw:(x,y,w,h)=>dp_tick(c,x+w/2,y+h/2,"green",clamp((tt-T.tReal)/0.6,0,1))});
      ns_page(c,110,430,330,220,"A fake page","coral",ra,{draw:(x,y,w,h)=>ns_emptyCard(c,x+20,y+16,w-40,h-32,ag_in(tt,T.tNothing,0.5))});}
    // the platform keeps only the matching half
    const ha=ns_on(tt,T.tHalf-0.2,T.tRow,0.5,0.6);if(ha>0){ns_card(c,110,190,330,{kick:"The platform",title:"The matching half",sub:"It opens nothing on its own"},tt,T.tHalf-0.2,T.tRow);ns_halfKey(c,280,560,1.3,ha);}}}

/* ---------------------------------------------------------------- 7 · Nothing to carry */
scene("close",(ctx,S,t,sc)=>{const C=sc.cues,
  tStop=wAt(sc,"city","stopped travelling"),tKnows=wAt(sc,"job","knows"),tLeak=wAt(sc,"nothing","nothing to leak"),tSched=wAt(sc,"nothing","nothing to change"),tBreaks=wAt(sc,"nothing","nothing that breaks");
  const tHall=C.job-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"nsStreet",keys:[[0,960,560,1.0],[tStop,960,432,1.25]],d:3.0,push:0,draw:(c,tt)=>{ns_walkers(c,tt,-7.0,{case:0});}},
    {at:tHall,place:"nsHall",dis:0.8,keys:[[0,960,540,1.0]],push:0.02,draw:(c,tt)=>{
      ns_platform(c,1,0.6+0.4*ag_in(tt,tKnows,0.6));ns_badge(c,NS_B.x,NS_B.y,{t:tt,glow:0.6+0.4*ag_in(tt,tKnows,0.8)});
      [["Nothing to leak",tLeak],["Nothing to change on a schedule",tSched],["Nothing breaks when someone moves on",tBreaks]].forEach(([s,tw],i)=>ns_pillAt(c,NS_SC.x,712+i*70,s,"green",tt,tw,C.breath-0.3,{size:30}));}}],0.8);
  ns_kick(ctx,S,t,"Nothing to carry");
  dp_end(ctx,S,t,C.breath,NS_TITLE,"The best secret is the one nobody holds.","Film 2 of 9","Locks before the data");});

// the hall glides on from the title card into Jun's token; the ladder's room into Up the ladder
ag_cutInto(["token","climb"]);
