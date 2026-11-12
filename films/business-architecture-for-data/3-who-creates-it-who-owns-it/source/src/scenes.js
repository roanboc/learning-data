/* ===== Who creates it, who owns it: scenes =====
   Nine chapters, as in ../script.md. The qanats of Iran, as Paul Ward English tells them: the Vakilabad qanat, dug at Mahan, near
   Kerman, in the 1860s, its water owned in six shares of time by three men, one share given to the keeper of the town's shrine; its
   shares sold, left to children and split; on many qanats two or three hundred owners; owners who meet each year and vote by their
   shares on the repairs, and a water master, the mirab, paid to guide the water to each field in its turn, with his helpers; and the
   Vakilabad's record of every change of owner, to the keeper's twenty descendants and some seventy families. Then Tomás's next note:
   who creates each concept, and who owns it; his CRUD matrix; the account, created by two capabilities; the business deciding which;
   owners and stewards; an owner found by capability where nothing was written down; the two roles on the data practice's map; and
   back to the qanat.
   The story's pictures (the desert from above, the qanat cut away, its village and people) are the series' own, in
   ../../../shared/src/ba.js; the turn of the water as a dial, the matrix and the new home are drawn here. Made to read on a phone
   (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: the camera glides between what the
   narration names and things arrive with a spring; in one room nothing is cut, what moves slides there, and what leaves goes before
   what comes in. Sound: every effect in tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in
   step. */

// a steward's colour, sea-green, beside an owner's gold (TRUST) and the data team's blue (TECH); and the shrine keeper's share, sage
const B3_STW=[150,222,196],B3_KEEP=[178,190,126];
// a tag whose right end sits at x (the engine's tags start at x, or centre on it)
function b3_tagR(ctx,x,y,s,col,o){o=o||{};const sz=o.size||28;tag(ctx,x-tw(ctx,s,sz,700)-26,y,s,col,{size:sz});}
// a dashed chip centred at (cx, y): o.cross (0..1) strikes it out with a red cross at its right end
function b3_chip(ctx,cx,y,s,col,o){o=o||{};const sz=o.size||28,cr=o.cross!=null,w=tw(ctx,s,sz,700)+56+(cr?50:0),x=o.left?cx:cx-w/2;
  ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;rr(ctx,x,y-30,w,60,12);ctx.stroke();ctx.restore();
  ctx.fillStyle=rgba(col,0.08);rr(ctx,x,y-30,w,60,12);ctx.fill();T(ctx,s,x+28,y+sz*0.36,{w:700,size:sz,color:rgba(col,1)});
  if(cr&&o.cross>0.01)kt_rcross(ctx,x+w-38,y,16,o.cross);return w;}

/* ---------- 1. Owners, and a water master ---------- */
// One turn of the qanat's water as a dial, where the opening keeps it: the dial's disc, with the top of the turn marked; and its parts,
// segs [[u0, u1, colour, k, mixK]]: from u0 to u1 of the turn (from the top, clockwise), in k slivers, each its own owner's colour
// mixed in by mixK. o.p draws them round; o.lit [[u0, u1, a], ...]: stretches lit in the water's blue, its turn; o.mark (0..1) goes
// round once, setting a mark at each sliver's outer edge, its named owner, with a hand going round (o.hand)
const B3_DX=640,B3_DY=520,B3_DR=280;
const B3_OWN=[[222,178,120],[196,150,108],[176,170,118],[214,156,132],[168,150,128],[226,196,150],[190,132,100]];
function b3_disc(ctx,x,y,r,a,t){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor=rgba(BAC,0.35);ctx.shadowBlur=30;ctx.fillStyle="rgba(10,14,22,0.92)";ctx.beginPath();ctx.arc(x,y,r+16,0,TAU);ctx.fill();ctx.restore();
  const rp=r*0.6,g=ctx.createRadialGradient(x,y-rp*0.2,0,x,y,rp);g.addColorStop(0,rgba(BA_WATER,0.26));g.addColorStop(1,rgba(BA_WATER,0.06));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rp,0,TAU);ctx.fill();
  for(let k=0;k<3;k++){const ph=((t||0)*0.12+k/3)%1;ctx.strokeStyle=rgba(BA_WATER,0.3*(1-ph)*clamp(ph*5,0,1));ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,rp*(0.12+0.84*ph),0,TAU);ctx.stroke();}
  ctx.strokeStyle=rgba(BAC,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r+16,0,TAU);ctx.stroke();
  ctx.strokeStyle=rgba(INK,0.55);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y-r-18);ctx.lineTo(x,y-r-34);ctx.stroke();});}
function b3_ring(ctx,x,y,r,segs,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=clamp(o.p==null?1:o.p,0,1),r0=r*0.64,ang=u=>-Math.PI/2+u*TAU;
  const seg=(u0,u1,c,al)=>{if(u1-u0<=0.0001)return;ctx.fillStyle=rgba(c,al);ctx.beginPath();ctx.arc(x,y,r,ang(u0),ang(u1));ctx.arc(x,y,r0,ang(u1),ang(u0),true);ctx.closePath();ctx.fill();};
  withA(ctx,a,()=>{segs.forEach(([u0,u1,c,k,mk],si)=>{k=k||1;const gp=Math.min(0.006,(u1-u0)/k*0.22);for(let j=0;j<k;j++){const v0=u0+(u1-u0)*j/k,v1=u0+(u1-u0)*(j+1)/k;if(v0>=p)break;
      const cj=B3_OWN[Math.floor(hash(si*97+j,977)*B3_OWN.length)];seg(v0+gp/2,Math.min(v1,p)-gp/2,mix(c,cj,mk||0),0.62);}});
    (o.lit||[]).forEach(([u0,u1,la])=>{if(la<=0.01)return;seg(u0+0.003,u1-0.003,BA_WATER,0.85*la);const am=ang((u0+u1)/2);glow(ctx,x+Math.cos(am)*(r+r0)/2,y+Math.sin(am)*(r+r0)/2,r*0.36,BA_WATER,0.4*la);});
    const mk=o.mark||0;if(mk>0.01){const ga=ctx.globalAlpha;ctx.fillStyle=rgba(BIZ,1);segs.forEach(([u0,u1,c,k])=>{k=k||1;for(let j=0;j<k;j++){const um=u0+(u1-u0)*(j+0.5)/k;if(um>mk)break;
        const an=ang(um);ctx.globalAlpha=ga*clamp((mk-um)*40,0,1);ctx.beginPath();ctx.arc(x+Math.cos(an)*(r+7),y+Math.sin(an)*(r+7),3.6,0,TAU);ctx.fill();}});ctx.globalAlpha=ga;
      if((o.mGlow||0)>0.01)glow(ctx,x,y,r*1.25,BIZ,0.18*o.mGlow);
      if((o.hand||0)>0.01&&mk<0.999){const an=ang(mk);ctx.save();ctx.globalAlpha=ga*o.hand;ctx.strokeStyle=rgba(BIZ,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.shadowColor=rgba(BIZ,0.8);ctx.shadowBlur=14;
        ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r0*0.4,y+Math.sin(an)*r0*0.4);ctx.lineTo(x+Math.cos(an)*(r+24),y+Math.sin(an)*(r+24));ctx.stroke();ctx.restore();}}});}
// the six shares of the Vakilabad's water, at level L of being split: whole (0), then sold, left to children and split finer (1 to 4);
// the first, the shrine keeper's, sage (by keep, 0..1)
const B3_SPLIT=[[1,0],[2,0.55],[4,0.75],[10,0.9],[40,1]];
function b3_six(L,keep){const[k,mk]=B3_SPLIT[L];return[[0,1/6,mix(BA_SAND,B3_KEEP,keep),k,mk*(1-0.75*keep)]].concat([1,2,3,4,5].map(i=>[i/6,(i+1)/6,BA_SAND,k,mk]));}
// three men, as the story's silhouettes, beside the dial, in a pool of warm light so they read on the dark
function b3_three(ctx,t,a){if(a<=0.01)return;glow(ctx,1290,700,280,BA_SAND,0.3*a);[[1190,1],[1290,-1],[1390,-1]].forEach(([x,f],i)=>{ctx.save();const g=ctx.createRadialGradient(x,780,2,x,780,70);g.addColorStop(0,"rgba(0,0,0,0.35)");g.addColorStop(1,"rgba(0,0,0,0)");
  ctx.globalAlpha*=a;ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,780,70,12,0,0,TAU);ctx.fill();ctx.restore();ba_fig(ctx,x,780,0.5,{dress:i===1?"tunic":"robe",head:i===2?"cap":"turban",f,a,t,rimA:0.8});});}
// a count on a card: what it counts, and the number
function b3_count(ctx,x,y,w,kick,big,col,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,150,18,col,{glow:12,ea:0.85,fill:"rgba(8,12,22,0.95)"});
  T(ctx,kick,x+28,y+48,{f:"mono",w:500,size:28,color:rgba(col,1)});T(ctx,big,x+28,y+118,{w:800,size:52});});}
// The Vakilabad's record of its owners: a sheet, its rows written in turn (o.n), each a share's mark, a name and a date in pen strokes
// (texture); the first three, the three men, lit (o.first)
function b3_ledger(ctx,x,y,w,h,a,o){if(a<=0.01)return;o=o||{};withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:-0.01,plain:true});ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(-0.01);ctx.translate(-w/2,-h/2);
  T(ctx,"the Vakilabad · its owners",36,62,{w:700,size:30,color:"rgba(52,40,30,0.95)"});ctx.strokeStyle="rgba(90,70,50,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(36,86);ctx.lineTo(w-36,86);ctx.stroke();
  const n=o.n||0,fi=o.first||0;for(let i=0;i<13;i++){const q=clamp(n-i,0,1);if(q<=0)break;const yy=122+i*28;
    if(i<3&&fi>0.01){ctx.fillStyle=rgba(BIZ,0.3*fi);ctx.fillRect(26,yy-15,w-52,26);}
    ctx.strokeStyle="rgba(58,44,32,0.85)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(48,yy-2,6,0,TAU);ctx.stroke();
    const L1=170+hash(i,401)*180,L2=56+hash(i,402)*34;ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();
    for(let k=0;k<=28;k++){const u=k/28;if(u>q*1.6)break;const xx=70+u*L1,yv=yy-2+Math.sin(u*24+i)*4*(0.6+0.4*hash(k+i*30,403));k?ctx.lineTo(xx,yv):ctx.moveTo(xx,yv);}ctx.stroke();
    if(q>0.62){ctx.beginPath();for(let k=0;k<=8;k++){const u=k/8;if(u>(q-0.62)*2.6)break;const xx=w-56-L2+u*L2,yv=yy-2+Math.sin(u*14+i*2)*3;k?ctx.lineTo(xx,yv):ctx.moveTo(xx,yv);}ctx.stroke();}}
  ctx.restore();});}
// the village, cut away, as the chapter's state st says: the qanat and its water (a cave-in at B3_XB), the fields and their gates, the
// owners by their fields or met together (st.meet), the mirab with his hand on the gate whose turn it is, and his helpers at the channel
const B3_GATES=BA_VFIELDS.map(([x])=>x-6),B3_S=0.14,B3_XB=900;
const B3_OWNERS=[[1640,1,{dress:"robe",head:"turban"}],[1790,1,{dress:"tunic",head:"cap"}],[1990,-1,{dress:"chador"}],[2150,-1,{dress:"robe",head:"cap"}]];
const B3_MEET=[1848,1902,1966,2022],B3_HELP=[[1496,1],[2262,-1]];
function b3_village(ctx,t,st){ba_secSky(ctx,{warm:0.35});
  ba_section(ctx,t,{water:st.water,block:B3_XB,blockA:st.blockA||0});
  ba_village(ctx,t,{wet:st.wet,fill:st.fill});ba_channel(ctx,t,2230,st.chTo==null?1:st.chTo,{from:st.chFrom||0});
  B3_GATES.forEach((x,i)=>ba_gate(ctx,x,st.gate[i]||0,1));
  if((st.help||0)>0.01)B3_HELP.forEach(([x,f],i)=>{const bob=Math.sin(t*2.6+i*1.7)*1.1;ba_fig(ctx,x,ba_ys(x)+3+bob,B3_S,{kind:"stoop",hold:"pick",head:"cap",f,a:st.help,rimA:0.7,t});});
  B3_OWNERS.forEach(([x,f,o],i)=>{const a=st.own?st.own[i]:1;if(a<=0.01)return;const xx=lerp(x,B3_MEET[i],ease(st.meet||0));ba_fig(ctx,xx,ba_ys(xx),B3_S,Object.assign({f,a,t,rimA:0.6},o));});
  const M=st.mirab;if(M&&M.a>0.01){const gx=B3_GATES[M.gi],ys=ba_ys(M.x),H0=[M.x+52*B3_S,ys-114*B3_S],G=[gx-7,ba_ys(gx)-12-(M.lift[M.gi]||0)*16];
    ba_fig(ctx,M.x,ys,B3_S,{dress:"robe",head:"turban",f:1,reach:[lerp(H0[0],G[0],M.k),lerp(H0[1],G[1],M.k)],a:M.a,t,rimA:0.6});}}
// The mirab's way along the gates: he comes in from the outlet (from t0) and, at each gate in its turn (TG[i]), walks there, puts his
// hand on its board, lifts it while the water turns into the field, lowers it and lets go. Where he stands (x), how far his hand is on
// the board (k), which gate (gi), and each gate's lift
function b3_mirab(t,TG,t0){const lift=[0,0,0,0];let x=lerp(1480,B3_GATES[0]-16,ease(clamp((t-t0)/1.6,0,1))),k=0,gi=0;
  TG.forEach((T0,i)=>{if(i>0&&t>T0-1.5)x=lerp(B3_GATES[i-1]-16,B3_GATES[i]-16,ease(clamp((t-T0+1.5)/0.9,0,1)));
    if(t>T0-0.6){gi=i;k=clamp((t-T0+0.5)/0.4,0,1)*(1-clamp((t-T0-1.3)/0.4,0,1));}
    lift[i]=clamp((t-T0)/0.4,0,1)*(1-clamp((t-T0-1.0)/0.3,0,1));});
  return{x,k,gi,lift,a:fin(t,t0-0.2,0.6)};}
// the owners' meeting, in a panel above the village: a bar of the qanat's shares, each owner's part as wide as their shares, turning
// gold as its owner votes (o.v, 0..4); then what they decided (o.ok)
const B3_VOTE=[0.36,0.27,0.22,0.15],B3_OC=[[222,178,120],[196,140,100],[166,174,118],[212,148,138]];
function b3_vote(ctx,a,o){if(a<=0.01)return;o=o||{};const X=490,Wd=1180,y=124,h=58;withA(ctx,a,()=>{glass(ctx,430,40,1300,262,22,BAC,{glow:14,ea:0.75,fill:"rgba(8,14,24,0.92)"});
  T(ctx,"the owners meet, each year: votes by shares",X,96,{w:700,size:30,color:rgba(INK,0.95)});
  let x0=X;B3_VOTE.forEach((f,i)=>{const pw=f*Wd,q=clamp((o.v||0)-i,0,1),c=mix(B3_OC[i],BIZ,q);ctx.fillStyle=rgba(c,0.45+0.4*q);ctx.fillRect(x0+3,y,pw-6,h);if(q>0.01&&q<1)glow(ctx,x0+pw/2,y+h/2,90,BIZ,0.35*q);x0+=pw;});
  ctx.strokeStyle=rgba(INK,0.4);ctx.lineWidth=2;ctx.strokeRect(X-2,y-4,Wd+4,h+8);
  if((o.ok||0)>0.01)withA(ctx,o.ok,()=>{T(ctx,"the repairs: agreed, and paid for",X,y+h+66,{w:800,size:32,color:rgba(BA_OK,1)});kt_gtick(ctx,X+580,y+h+55,16,o.ok);});});}
scene("owners",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tSix=c("six"),tSo=c("sold"),tHu=c("hundreds"),tTu=c("turn"),tNe=c("needed"),tMe=c("met"),tMi=c("mirab"),tHe=c("helpers"),tDe=c("decided"),tRc=c("record"),tTh=c("third"),tSe=c("seventy"),tLi=c("link");
  // four places, each dissolving into the next as the whole picture changes: the desert from above, the turn of the water as a dial,
  // the village with its qanat cut away, and the dial again, with the record of its owners
  const bA=fin(t,tSix-1.0,1.2),cA=fin(t,tTu-1.0,1.2),dA=fin(t,tRc-1.0,1.2);
  // from above: a new qanat dug at the mountains' foot, its chain of shafts lit, and the water reaching the village
  if(bA<0.99){setScreen(ctx,S);ctx.save();focus(ctx,t,[[0,880,420,0.8],[2.6,960,480,0.96]],3.4);
    const tDug=w("edge","was dug")-0.2,tBr=w("edge","bringing water")-0.2,fl=clamp((t-tBr)/2.4,0,1);
    ba_aerial(ctx,t,{warm:0.5,lit:fin(t,tDug,0.6),litP:clamp((t-tDug)/2.4,0,1),flow:fl,green:lerp(0.32,0.8,fl)});
    baTagAt(ctx,S,BA_CHAIN[9][0],BA_CHAIN[9][1],"a new qanat: a tunnel from the mountains",BAC,{dy:-62,a:fin(t,w("edge","a tunnel")-0.2,0.5)*(1-fin(t,tSix-1.4,0.4))});
    ctx.restore();eaYear(ctx,80,80,"Mahan, near Kerman · the 1860s",CLAY,fin(t,0.5,0.8)*(1-fin(t,tSix-1.4,0.4)));}
  // the turn of its water: six shares of time, each lit in its turn; three men; the shrine keeper's share; then sold, left to
  // children and split, finer and finer; and on many qanats, hundreds of owners
  if(bA>0.01&&cA<0.99)withA(ctx,bA,()=>{histBg(ctx,S,t,{light:0.12});ctx.save();drift(ctx,t,sc,{z:0.015,x:900,y:520});
    const tSh=w("six","six shares of time")-0.2,tEa=w("six","each a turn")-0.1,tMen=w("six","three men")-0.3,tKe=w("shrine","keeper")-0.3;
    const tS1=w("sold","sold")-0.2,tS2=w("sold","left to children")-0.2,tS3=w("sold","split again and again")-0.2,tH1=w("hundreds","two or three hundred owners")-0.3,tH2=w("hundreds","ten thousand shares")-0.3;
    const keep=fin(t,w("shrine","One of the six")-0.1,0.8),TK=[-99,tS1,tS2,tS3,tH1];let L=0;for(let i=1;i<5;i++)if(t>TK[i])L=i;const q=L?fin(t,TK[L],0.6):1;
    const lit=[0,1,2,3,4,5].map(i=>[i/6,(i+1)/6,pulseAt(t,tEa+i*0.42,0.8)]);
    b3_disc(ctx,B3_DX,B3_DY,B3_DR,1,t);
    if(L&&q<1)b3_ring(ctx,B3_DX,B3_DY,B3_DR,b3_six(L-1,keep),{a:1-q,lit});
    b3_ring(ctx,B3_DX,B3_DY,B3_DR,b3_six(L,keep),{p:clamp((t-tSh)/1.4,0,1),a:L?q:1,lit});
    withA(ctx,fin(t,tSh,0.6)*(1-fin(t,tH1-0.5,0.5)),()=>T(ctx,"its water: six shares of time",B3_DX,170,{w:700,size:30,align:"center",color:rgba(INK,0.95)}));
    // the shrine keeper's share, pointed out where it sits on the turn
    const kA=fin(t,tKe+0.1,0.5)*(1-fin(t,tH1-0.5,0.5));if(kA>0.01)withA(ctx,kA,()=>{const an=-Math.PI/2+TAU/12,px=B3_DX+Math.cos(an)*(B3_DR+20),py=B3_DY+Math.sin(an)*(B3_DR+20);
      ctx.strokeStyle=rgba(B3_KEEP,0.9);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(830,250);ctx.stroke();ctx.fillStyle=rgba(B3_KEEP,1);ctx.beginPath();ctx.arc(px,py,5,0,TAU);ctx.fill();
      tag(ctx,830,250,"one of the six: the keeper of the town's shrine",B3_KEEP,{size:28});});
    b3_three(ctx,t,fin(t,tMen,0.7)*(1-fin(t,tS3,0.6)));
    withA(ctx,fin(t,tMen+0.3,0.5)*(1-fin(t,tS3,0.5)),()=>tag(ctx,1290,590,"three men",BIZ,{align:"center",size:28}));
    [["sold",tS1,390],["left to children",tS2,460],["split, again and again",tS3,530]].forEach(([s_,t0,y])=>{if(t<t0)return;arrive(ctx,1220,y,t,t0,()=>withA(ctx,1-fin(t,tH1-0.5,0.5),()=>tag(ctx,1120,y,s_,AMBER,{size:30})),{dy:10});});
    // on many qanats: hundreds of owners, and thousands of shares
    if(t>tH1)arrive(ctx,1450,405,t,tH1+0.1,()=>b3_count(ctx,1120,330,640,"many qanats","200 to 300 owners",BAC,1),{dy:12});
    if(t>tH2)arrive(ctx,1450,615,t,tH2+0.1,()=>b3_count(ctx,1120,540,640,"some","10,000 shares",BAC,1),{dy:12});
    ctx.restore();});
  // the village: each field's water in its turn, and a turn missed; a cave-in, and the questions it raises; the owners meet and vote;
  // the mirab, paid to guide the water to each field in its turn, and his helpers keeping the channels clean
  if(cA>0.01&&dA<0.99)withA(ctx,cA,()=>{setScreen(ctx,S);ctx.save();
    const tF0=w("turn","right field")-0.4,tLose=w("turn","lose its crop")-0.2,tCave=w("repairs","repairs")-0.2,tWho=w("repairs","decide on")-0.2;
    const tTog=w("needed","decide together")-0.2,tLook=w("needed","look after the water")-0.2,tVote=w("met","voting")-0.2,tFix=w("met","size of their shares")+0.4;
    const tWm=w("mirab","water master")-0.2,tPaid=w("mirab","paid")-0.2,tGuide=w("mirab","each field in its turn")-0.3,tClean=w("helpers","channels clean")-0.2;
    const tLook2=w("decided","looked after the water")-0.2,tDec=w("decided","owners decided")-0.2;
    focus(ctx,t,[[0,1880,736,2.2],[tCave-0.6,960,730,1.9],[tNe-0.4,1320,700,1.05],[tMe-0.4,1935,743,2.4],[tMi-0.2,1640,754,2.8],[tGuide+2.5,1880,754,2.8],[tHe-0.2,1880,732,1.85],[tLook2-0.4,1880,736,2.2]],1.8);
    // the water: running; then stopped by a cave-in, and what's below drains away, the channel last; once the repairs are agreed, cleared
    const drain=clamp((t-tCave-0.3)/2.6,0,1),refill=clamp((t-tFix-0.8)/2.2,0,1),blockA=fin(t,tCave,0.5)*(1-fin(t,tFix,1.6));
    const water=t<tCave?[[BA_XM,BA_XO+30]]:t<tFix+0.8?[[BA_XM,B3_XB-34],[lerp(B3_XB+36,BA_XO+30,drain),BA_XO+30]]:[[BA_XM,lerp(B3_XB-34,BA_XO+30,refill)]];
    const chTo=t<tFix+3.0?1:clamp((t-tFix-3.0)/1.6,0,1),chFrom=t<tCave||t>=tFix+3.0?0:clamp((t-tCave-1.2)/1.8,0,1);
    // the turns: fields one, two and four, the third missed, its crop drying; later each in its turn under the mirab's hand
    const TA=[tF0,tF0+1.3,null,tF0+2.6],TG=[tGuide,tGuide+2.1,tGuide+4.2,tGuide+6.3],M=b3_mirab(t,TG,tWm);
    const fill=[0,1,2,3].map(i=>Math.max(TA[i]==null?0:fin(t,TA[i],0.4)*(1-fin(t,TA[i]+1.1,0.4)),M.lift[i]));
    const dry=fin(t,tCave+1.6,3.0)*(1-fin(t,tFix+3.2,2.0));
    const wet=[0,1,2,3].map(i=>(i===2?lerp(lerp(0.86,0.24,fin(t,tLose-0.6,2.0)),0.9,fin(t,TG[2]+0.2,1.6)):0.86)-0.2*dry);
    const meet=fin(t,tMe-0.3,1.4)*(1-fin(t,tMi-0.6,1.4));
    b3_village(ctx,t,{water,blockA,chTo,chFrom,wet,fill,gate:fill,own:[1,1,1,1],meet,help:fin(t,c("helpers")-0.2,0.7),mirab:M});
    // what the story names, at the screen's own size
    const tg=(s_,x,y,col,a,o)=>baTagAt(ctx,S,x,y,s_,col,Object.assign({a},o||{}));
    tg("the right field, at the right time",1800,ba_ys(1800)-70,BA_WATER,fin(t,tF0+0.2,0.5)*(1-fin(t,tLose-0.5,0.4)),{dy:-30});
    tg("a turn missed: a crop lost",1975,ba_ys(1975)-60,BA_RED,fin(t,tLose,0.5)*(1-fin(t,tCave-0.9,0.5)),{dy:-30});
    tg("every year: repairs",B3_XB,ba_yt(B3_XB)+46,BA_RED,fin(t,tCave+0.3,0.5)*(1-fin(t,tNe-0.6,0.5)));
    tg("who decides? who pays?",B3_XB,ba_ys(B3_XB)-50,AMBER,fin(t,tWho,0.5)*(1-fin(t,tNe-0.6,0.5)));
    tg("decide together",1900,ba_ys(1900)-60,BIZ,fin(t,tTog,0.5)*(1-fin(t,tMe-0.6,0.5)),{dy:-30});
    tg("someone to look after the water",1240,ba_ys(1240)-70,B3_STW,fin(t,tLook,0.5)*(1-fin(t,tMe-0.6,0.5)));
    tg("the mirab, the water master",M.x,ba_ys(M.x)-62,B3_STW,fin(t,tWm+0.2,0.5)*(1-fin(t,tHe-0.5,0.5)),{dy:-40});
    tg("paid by the owners",M.x,ba_ys(M.x)-62,BIZ,fin(t,tPaid,0.5)*(1-fin(t,tHe-0.5,0.5)),{dy:14});
    tg("his helpers: the channels clean",1880,ba_ys(1880)-110,B3_STW,fin(t,tClean,0.5)*(1-fin(t,tDe-0.5,0.5)));
    tg("the mirab: looks after the water",M.x,ba_ys(M.x)-48,B3_STW,fin(t,tLook2,0.5)*(1-fin(t,tRc-1.5,0.5)),{dy:-36});
    tg("the owners: decide",1715,ba_ys(1715)-48,BIZ,fin(t,tDec,0.5)*(1-fin(t,tRc-1.5,0.5)),{dy:-36});
    ctx.restore();
    b3_vote(ctx,fin(t,tMe-0.1,0.6)*(1-fin(t,tMi-0.7,0.6)),{v:clamp((t-tVote)/0.4,0,4),ok:fin(t,tFix-0.3,0.5)});});
  // the record: every change of owner, from the three men on; the keeper's share grown to a third, held by twenty of his descendants;
  // some seventy families holding the rest, each share with a named owner; and what the utility needs of each concept
  const dOut=1-fin(t,B-0.2,0.8);if(dA>0.01)withA(ctx,dA,()=>{histBg(ctx,S,t,{light:0.12});if(dOut>0.01)withA(ctx,dOut,()=>{ctx.save();drift(ctx,t,sc,{z:0.015,x:900,y:520});
    const tVa=w("record","the Vakilabad")-0.2,tCh=w("record","every change of owner")-0.2,tFi=w("record","first three men")-0.2;
    const tCe=w("third","Generations later")-0.2,tTd=w("third","a third")-0.4,tDs=w("third","twenty of his descendants")-0.2;
    const tSv=w("seventy","seventy families")-0.2,tNm=w("seventy","named owner")-0.5,tOw=w("link","an owner who decides")-0.2,tLk=w("link","someone to look after it")-0.2;
    const g=ease(clamp((t-tTd)/1.4,0,1)),uK=lerp(1/6,1/3,g),rest=i=>[uK+(1-uK)*i/5,uK+(1-uK)*(i+1)/5,BA_SAND,1,0];
    const S0=[[0,uK,B3_KEEP,1,0]].concat([0,1,2,3,4].map(rest)),S1=[[0,uK,B3_KEEP,20,0.22]].concat([0,1,2,3,4].map(rest)),S2=[[0,uK,B3_KEEP,20,0.22],[uK,1,BA_SAND,70,0.9]];
    const q1=fin(t,tDs,0.6),q2=fin(t,tSv,0.6),mk=clamp((t-tNm)/2.6,0,1),mG=pulseAt(t,B+0.4,3.6);
    b3_disc(ctx,B3_DX,B3_DY,B3_DR,1,t);
    const ring=(sg,a)=>b3_ring(ctx,B3_DX,B3_DY,B3_DR,sg,{a,mark:mk,hand:1-fin(t,tNm+2.4,0.4),mGlow:mG});
    if(q1<1)ring(S0,1-q1);if(q1>0&&q2<1)ring(S1,q1*(1-q2));if(q2>0)ring(S2,q2);
    withA(ctx,fin(t,tVa,0.5),()=>tag(ctx,B3_DX,166,"the Vakilabad",BAC,{align:"center",size:30}));
    b3_ledger(ctx,1080,190,700,520,fin(t,tCh-0.4,0.6)*(1-fin(t,tCe-0.4,0.6)),{n:clamp((t-tCh)/0.32,0,13),first:fin(t,tFi,0.5)});
    withA(ctx,fin(t,tCh+0.4,0.5)*(1-fin(t,tCe-0.4,0.6)),()=>tag(ctx,1430,760,"every change of owner, on record",CLAY,{align:"center",size:28}));
    const rA=1-fin(t,tLi-0.5,0.5);
    if(t>tDs)arrive(ctx,1300,330,t,tDs+0.1,()=>withA(ctx,rA,()=>tag(ctx,1120,330,"a third: twenty of his descendants",B3_KEEP,{size:30})),{dy:10});
    if(t>tSv)arrive(ctx,1300,420,t,tSv+0.1,()=>withA(ctx,rA,()=>tag(ctx,1120,420,"the rest: some seventy families",BA_SAND,{size:30})),{dy:10});
    if(t>tNm+0.3)arrive(ctx,1300,510,t,tNm+0.4,()=>withA(ctx,rA,()=>tag(ctx,1120,510,"every share: a named owner",BIZ,{size:30})),{dy:10});
    // at the utility, the same for each concept
    withA(ctx,fin(t,tLi-0.1,0.6),()=>T(ctx,"at the utility, each concept needs",1120,410,{w:700,size:34}));
    if(t>tOw)arrive(ctx,1300,490,t,tOw,()=>tag(ctx,1120,490,"an owner who decides",TRUST,{size:30}),{dy:10});
    if(t>tLk)arrive(ctx,1300,575,t,tLk,()=>tag(ctx,1120,575,"someone to look after it, every day",B3_STW,{size:30}),{dy:10});
    ctx.restore();eaYear(ctx,80,80,"generations later",CLAY,fin(t,tCe,0.6)*(1-fin(t,tLi-0.6,0.6)));});});
  vign(ctx,S);
  baTitle(ctx,S,t,B+0.6,"Who creates it, who owns it","an owner who decides, someone who looks after it","Film 3 of 5");});

/* ---------- the wall: Tomás's map, as What the business needs to know leaves it ---------- */
// The capabilities across the top, in the strategy layer; the concepts below them, in the information layer, each confirmed in its
// domain (glass), with the line from the capability that creates it (solid) or only reads it (dashed). Each concept:
// [id, name, x, y, from CIM, capability, created (or only read), the side its line comes down (-1 left, 1 right)]
const B3_CAPX=i=>40+i*232,B3_CAPY=136,B3_CAPW=220,B3_CAPH=112,B3_NW=210,B3_NH=76;
const B3_NOTES=[["reading","meter reading",382,470,1,1,0,1],["outage","outage",382,590,1,1,1,1],
  ["request","connection request",730,470,0,3,1,-1],["capacity","hosting capacity",990,470,0,3,0,-1],["cp","connection point",730,590,1,3,1,-1],["meter","meter",990,590,1,3,1,-1],
  ["account","account",1620,470,1,6,1,-1],["bill","bill",1620,590,0,6,1,-1],["complaint","complaint",1620,710,0,6,1,-1],["location","location",1290,768,0,-1,1,0]];
const B3_GROUPS=[["network",196,372,928,292,BA_NET,"Grace"],["retail",1450,372,340,412,BA_RET,"head of retail"],["shared",1150,680,280,140,BAC,"Grace"]];
const B3_DOM=id=>id==="location"?BAC:["account","bill","complaint"].includes(id)?BA_RET:BA_NET;
// A capability, as the map draws one (baCap), with its name in the lines its box's width gives it. Moving from the wall to the
// matrix (o.k, 0..1), the name in the wall's lines leaves before the name in the matrix's one line comes in, so no line re-wraps.
// In a box one line high, the name sits a little left of centre, clear of ArchiMate's glyph in the box's corner
function b3_cap(ctx,x,y,w,h,name,o){o=o||{};baCap(ctx,x,y,w,h,"",o);const a=(o.a==null?1:o.a)*(1-0.6*(o.dim||0)),sz=28;
  const lines=(ww,al,off)=>{if(al*a<=0.01)return;const ls=wrapT(ctx,name,0,0,ww-44,{size:sz,w:700,measure:true});
    withA(ctx,al*a,()=>ls.forEach((l,i)=>T(ctx,l,x+w/2-off,y+h/2+sz*0.36-(ls.length-1)*sz*0.58+4+i*sz*1.15,{w:700,size:sz,align:"center",color:rgba(INK,0.96)})));};
  if(o.k==null)lines(w,1,h<70?14:0);else{lines(B3_CAPW,1-clamp(o.k/0.4,0,1),0);lines(B3_MCW,clamp((o.k-0.6)/0.4,0,1),14);}}
// What the wall shows, from w: w.layers (0..1) the two layers' names; w.groups[k] (0..1), w.owners (0..1) their owners; w.caps
// (0 for none, or each capability's 0..1), w.capHi[i]; w.lines (0..1) each concept's line, w.lineHi (0..1) lit; w.loc (0..1) the
// shared word's lines; w.notes[id]: {a, hi}
function b3_wall(ctx,t,w){const lA=w.layers||0;
  if(lA>0.01)withA(ctx,lA,()=>{tag(ctx,40,96,"strategy layer",BA_STR,{size:28});tag(ctx,40,318,"information layer",BA_INF,{size:28});});
  B3_GROUPS.forEach(([nm,x,y,gw,gh,col,own],k)=>{const v=w.groups?w.groups[k]||0:0;if(v<=0.01)return;withA(ctx,v,()=>{ctx.save();ctx.setLineDash([12,9]);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2.5;rr(ctx,x,y,gw,gh,14);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=rgba(col,0.06);rr(ctx,x,y,gw,gh,14);ctx.fill();ctx.restore();T(ctx,nm,x+gw-18,y+38,{w:800,size:28,align:"right",color:rgba(col,1)});
      if((w.owners||0)>0.01)withA(ctx,w.owners,()=>tag(ctx,x+gw/2,y+gh+28,"owner: "+own,TRUST,{align:"center",size:28}));});});
  if(w.caps!==0)BA_CAPS.forEach(([nm],i)=>{const v=w.caps?w.caps[i]==null?1:w.caps[i]:1;if(v<=0.01)return;b3_cap(ctx,B3_CAPX(i),B3_CAPY,B3_CAPW,B3_CAPH,nm,{a:v,hi:w.capHi?w.capHi[i]||0:0});});
  const lp=w.lines||0,lh=w.lineHi||0;if(lp>0.01)B3_NOTES.forEach(([id,nm,x,y,cim,ci,cr,sd])=>{if(ci<0)return;const cx=B3_CAPX(ci)+B3_CAPW/2+60*sd,tx=x+sd*(B3_NW/2+30),y0=B3_CAPY+B3_CAPH,ym=y0+24;
    ctx.save();ctx.globalAlpha*=lp;ctx.strokeStyle=rgba(mix(BA_STR,[255,255,255],0.3*lh),0.8+0.2*lh);ctx.lineWidth=2.5+1.5*lh;ctx.lineJoin="round";if(lh>0.01){ctx.shadowColor=rgba(BA_STR,0.7*lh);ctx.shadowBlur=12;}
    ctx.beginPath();ctx.moveTo(cx,y0);ctx.lineTo(cx,ym);ctx.lineTo(tx,ym);ctx.lineTo(tx,y);ctx.stroke();if(!cr)ctx.setLineDash([7,6]);ctx.beginPath();ctx.moveTo(tx,y);ctx.lineTo(x+sd*B3_NW/2,y);ctx.stroke();ctx.restore();});
  if((w.loc||0)>0.01)withA(ctx,w.loc,()=>{[[1290-B3_NW/2,768,1124,640],[1290+B3_NW/2,768,1450,744]].forEach(([x0,y0,x1,y1])=>{ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle=rgba(BAC,0.7);ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();});});
  B3_NOTES.forEach(([id,nm,x,y])=>{const n=w.notes?w.notes[id]:null;if(!n||(n.a||0)<=0.01)return;const dom=B3_DOM(id);
    sticky(ctx,x,y,B3_NW,B3_NH,nm,{col:NOTEC[2],size:28,glass:1,edge:mix(BA_INF,dom,0.35),rot:0,a:n.a});if((n.hi||0)>0.01)glow(ctx,x,y,150,dom,0.3*n.hi);});}
const b3_done=()=>Object.fromEntries(B3_NOTES.map(([id])=>[id,{a:1}]));

/* ---------- 2. Tomás's next note ---------- */
// the note from the end of the film before, over the wall; read, it's set aside, and the wall comes back: each concept under the
// capabilities that use it, and the question of what each one does with it
const B3_FIVE=["outage","cp","meter","account","bill"];
scene("note",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
  const tMa=c("map"),up=fin(t,tMa-0.5,1.0),tBe=w("map","beneath the capabilities")-0.1,tDo=w("exactly","exactly what each capability does")-0.2;
  const notes=b3_done();B3_FIVE.forEach(id=>{notes[id].hi=fin(t,tDo,0.6);});
  withA(ctx,lerp(0.25,1,up),()=>b3_wall(ctx,t,{layers:1,notes,lines:1,lineHi:pulseAt(t,tBe,1.8),groups:[1,1,1],loc:1,capHi:BA_CAPS.map(()=>0.6*pulseAt(t,tBe,1.8))}));
  const nP=Math.min(1,pulseAt(t,w("note","who creates each concept")-0.1,1.6)+pulseAt(t,w("note","who owns it")-0.1,1.3));if(nP>0.01)glow(ctx,860,470,380,NOTEC[0],0.2*nP);
  sticky(ctx,860,470,560,150,"Who creates it? "+ba_nb("Who owns it?"),{col:NOTEC[0],size:36,rot:-0.02,a:1-fin(t,tMa-0.5,0.6)});
  withA(ctx,1-fin(t,tMa-0.3,0.8),()=>baPersonR(ctx,"tomas",1790,1040,0.74,{t,expr:"calm"}));
  ctx.restore();
  withA(ctx,fin(t,tDo,0.6),()=>tag(ctx,960,60,"what does each capability do with each one?",AMBER,{align:"center",size:30}));
  vign(ctx,S);});

/* ---------- the matrix ---------- */
// Tomás's CRUD matrix: the eight capabilities down the left (B3_MCX), the people who run them (B3_MOX), and five of the concepts
// across the top, the network's three and retail's two; under each concept, its owner (B3_MFY) and, at the end, its steward (B3_MSY).
// Room is left at the right for whoever stands there.
const B3_MCX=40,B3_MCW=330,B3_MOX=380,B3_MOW=210,B3_MX0=600,B3_MCOLW=200,B3_MHY=150,B3_MHW=190,B3_MHH=80,B3_MY0=204,B3_MRH=64,B3_MFY=748,B3_MSY=830;
// the stewards each owner names, under each concept's owner at the end
const B3_STWN=["outage desk lead","connections lead","metering lead","billing lead","billing lead"];
// a name under a column, centred at (x, y): in one line where it fits the column, else in two, split at the space nearest its middle
function b3_lab(ctx,s,x,y,col){if(tw(ctx,s,28,700)<=B3_MCOLW-34){T(ctx,s,x,y+10,{w:700,size:28,align:"center",color:col});return;}
  let b=-1;[...s].forEach((ch,i)=>{if(ch===" "&&(b<0||Math.abs(i-s.length/2)<Math.abs(b-s.length/2)))b=i;});
  T(ctx,s.slice(0,b),x,y-6,{w:700,size:28,align:"center",color:col});T(ctx,s.slice(b+1),x,y+26,{w:700,size:28,align:"center",color:col});}
const B3_COLS=[["outage","outage",BA_NET],["cp","connection point",BA_NET],["meter","meter",BA_NET],["account","account",BA_RET],["bill","bill",BA_RET]];
// what each capability does with each concept, as the people who run it say: a row for each capability, in BA_CAPS' order
const B3_CRUD=[["R","R","","",""],["CU","R","R","",""],["R","","UD","",""],["","C","C","C",""],["","","","",""],["","","","R","R"],["R","R","","CRU","CRU"],["R","","","",""]];
const b3_cx=j=>B3_MX0+j*B3_MCOLW+B3_MCOLW/2,b3_ry=i=>B3_MY0+i*B3_MRH,b3_rc=i=>B3_MY0+i*B3_MRH+28;
// What the matrix shows, from m: m.grid (0..1) its squares; m.caps (0..1) the capabilities, or m.capR(i) {x, y, w, h, k, a} while
// they move from the wall; m.heads (0..1) the concepts, or m.headR(j) likewise; m.headHi[j]; m.capHi[i], m.capHeat[i] [colour, a];
// m.letters (0..1), or m.rowA[i], each row's letters; m.cell["i,j"] {s, k}: a square's letters becoming others; m.hi["i,j"] {a, col}
// a square lit; m.ring["i,j"] {a, col} outlined; m.colHi[j] (0..1), m.colHiCol; m.own (0..1) the people who run each capability,
// m.ownRow[i], m.ownHi[i]; m.colOwn[j] {a, name, na, q, x, y, hi}: each concept's owner (q: a red "?" where there is none yet);
// m.ownLab (0..1) the owners' row named; m.stw (0..1) the stewards' row, m.stwHi; m.title, m.legend (0..1), m.legA[k], m.legHi[k]
function b3_matrix(ctx,t,m){const R=B3_MX0+5*B3_MCOLW,yT=B3_MY0-8,yB=b3_ry(8)-4;
  const gA=m.grid||0;if(gA>0.01)withA(ctx,gA,()=>{for(let i=0;i<8;i+=2){ctx.fillStyle="rgba(255,255,255,0.03)";ctx.fillRect(B3_MOX,b3_ry(i)-4,R-B3_MOX,B3_MRH);}
    ctx.strokeStyle="rgba(255,255,255,0.10)";ctx.lineWidth=1.5;for(let j=0;j<=5;j++){const x=B3_MX0+j*B3_MCOLW;ctx.beginPath();ctx.moveTo(x,yT);ctx.lineTo(x,yB);ctx.stroke();}
    for(let i=0;i<=8;i++){const y=b3_ry(i)-4;ctx.beginPath();ctx.moveTo(B3_MOX,y);ctx.lineTo(R,y);ctx.stroke();}});
  (m.colHi||[]).forEach((v,j)=>{if(!v||v<=0.01)return;const c=m.colHiCol||BA_STR;ctx.fillStyle=rgba(c,0.10*v);ctx.fillRect(B3_MX0+j*B3_MCOLW+3,yT+2,B3_MCOLW-6,yB-yT-4);glow(ctx,b3_cx(j),(yT+yB)/2,240,c,0.12*v);});
  B3_COLS.forEach(([id,nm,dc],j)=>{const r=m.headR?m.headR(j):null,a=r?r.a:(m.heads||0);if(a<=0.01)return;const cx=r?r.x:b3_cx(j),cy=r?r.y:B3_MHY,ww=r?r.w:B3_MHW,hh=r?r.h:B3_MHH;
    sticky(ctx,cx,cy,ww,hh,nm,{col:NOTEC[2],glass:1,edge:mix(BA_INF,dc,0.35),size:28,a,rot:0});const hi=m.headHi?m.headHi[j]||0:0;if(hi>0.01)glow(ctx,cx,cy,150,m.headHiCol||dc,0.3*hi);});
  BA_CAPS.forEach(([nm],i)=>{const r=m.capR?m.capR(i):null,a=r?r.a:(m.caps||0);if(a<=0.01)return;const ht=m.capHeat&&m.capHeat[i];
    b3_cap(ctx,r?r.x:B3_MCX,r?r.y:b3_ry(i),r?r.w:B3_MCW,r?r.h:56,nm,{a,k:r?r.k:null,hi:m.capHi?m.capHi[i]||0:0,heat:ht?ht[0]:null,heatA:ht?ht[1]:0});});
  const oA=m.own||0;if(oA>0.01)withA(ctx,oA,()=>{T(ctx,"owner",B3_MOX+B3_MOW/2,B3_MHY+10,{f:"mono",w:500,size:28,align:"center",color:rgba(TRUST,0.9)});
    BA_CAPS.forEach(([,own],i)=>{const q=m.ownRow?m.ownRow[i]==null?1:m.ownRow[i]:1;if(q<=0.01)return;const hi=m.ownHi?m.ownHi[i]||0:0;withA(ctx,q,()=>{if(hi>0.01)glow(ctx,B3_MOX+B3_MOW/2,b3_rc(i),120,TRUST,0.4*hi);
      T(ctx,own||"—",B3_MOX+B3_MOW/2,b3_rc(i)+10,{w:700,size:28,align:"center",color:own?rgba(mix(TRUST,[255,255,255],0.35*hi),1):rgba(SOFT,0.6)});});});});
  for(let i=0;i<8;i++){const ra=m.rowA?m.rowA[i]||0:(m.letters||0);for(let j=0;j<5;j++){const key=i+","+j,cc=m.cell&&m.cell[key],x=b3_cx(j),y=b3_rc(i)+11,hi=m.hi&&m.hi[key],rg=m.ring&&m.ring[key];
    if(hi&&hi.a>0.01)glow(ctx,x,y-10,110,hi.col||BA_STR,0.45*hi.a);
    const draw=(s,al)=>{if(!s||al<=0.01)return;const cr=s.indexOf("C")>=0;withA(ctx,al,()=>T(ctx,s,x,y,{w:800,size:32,align:"center",color:cr?rgba(INK,1):rgba(SOFT,0.85)}));};
    if(cc){draw(B3_CRUD[i][j],ra*(1-clamp(cc.k||0,0,1)));draw(cc.s,ra*clamp(cc.k||0,0,1));}else draw(B3_CRUD[i][j],ra);
    if(rg&&rg.a>0.01){ctx.save();ctx.globalAlpha*=rg.a;ctx.strokeStyle=rgba(rg.col,1);ctx.lineWidth=3.5;ctx.shadowColor=rgba(rg.col,0.8);ctx.shadowBlur=12;rr(ctx,x-58,b3_ry(i)+3,116,50,12);ctx.stroke();ctx.restore();}}}
  if((m.ownLab||0)>0.01)withA(ctx,m.ownLab,()=>T(ctx,"owner",B3_MX0-24,B3_MFY+10,{f:"mono",w:500,size:28,align:"right",color:rgba(TRUST,0.9)}));
  (m.colOwn||[]).forEach((co,j)=>{if(!co||(co.a||0)<=0.01)return;const x=co.x==null?b3_cx(j):co.x,y=co.y==null?B3_MFY:co.y;withA(ctx,co.a,()=>{
    if((co.q||0)>0.01)withA(ctx,co.q,()=>{ctx.save();ctx.setLineDash([8,6]);ctx.strokeStyle=rgba(BA_RED,0.9);ctx.lineWidth=2.5;rr(ctx,x-30,y-26,60,52,12);ctx.stroke();ctx.restore();T(ctx,"?",x,y+12,{w:800,size:32,align:"center",color:rgba(BA_RED,1)});});
    const na=co.name?(co.na==null?1:co.na):0;if(na>0.01)withA(ctx,na,()=>{if((co.hi||0)>0.01)glow(ctx,x,y,110,TRUST,0.4*co.hi);b3_lab(ctx,co.name,x,y,rgba(mix(TRUST,[255,255,255],0.3*(co.hi||0)),1));});});});
  const sA=m.stw||0;if(sA>0.01)withA(ctx,sA,()=>{const hi=m.stwHi||0;T(ctx,"steward",B3_MX0-24,B3_MSY+10,{f:"mono",w:500,size:28,align:"right",color:rgba(B3_STW,0.95)});
    for(let j=0;j<5;j++){const x=b3_cx(j);if(hi>0.01)glow(ctx,x,B3_MSY,80,B3_STW,0.35*hi);b3_lab(ctx,B3_STWN[j],x,B3_MSY,rgba(B3_STW,1));}});
  if((m.title||0)>0.01)withA(ctx,m.title,()=>T(ctx,"CRUD matrix",B3_MCX,84,{w:800,size:40}));
  const lA=m.legend||0;if(lA>0.01){const L=[["C","creates"],["R","reads"],["U","updates"],["D","deletes"]];let x=R;
    for(let k=3;k>=0;k--){const[l,wd]=L[k],a=lA*(m.legA?m.legA[k]||0:1),hi=m.legHi?m.legHi[k]||0:0,ww=tw(ctx,wd,28,600),lw=tw(ctx,l,32,800);x-=ww;
      if(a>0.01)withA(ctx,a,()=>{if(hi>0.01)glow(ctx,x-lw/2-10,72,60,BA_STR,0.5*hi);T(ctx,l,x-lw-12,84,{w:800,size:32,color:l==="C"?rgba(INK,1):rgba(SOFT,0.95)});T(ctx,wd,x,84,{w:600,size:28,color:rgba(INK,0.85)});});x-=lw+12+30;}}}
// the matrix as Who creates it leaves it: everything in, and each concept's owner under it, the account's still a question; o.dec
// (0..1) gives the account its owner, the head of retail, and connecting customers only reads it
function b3_mFull(o){o=o||{};const d=o.dec||0;return{grid:1,caps:1,heads:1,letters:1,own:1,title:1,legend:1,ownLab:1,cell:d>0?{"3,3":{s:"R",k:d}}:null,
  colOwn:[{a:1,name:"Grace"},{a:1,name:"Grace"},{a:1,name:"Grace"},{a:1,q:1-d,name:"head of retail",na:d},{a:1,name:"head of retail"}]};}

/* ---------- 3. Creates, reads, updates, deletes ---------- */
scene("matrix",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
  const tLe=c("letters"),tPe=c("people"),tCo=c("column"),tOw=c("owner"),tCp=c("cp");
  const tM=w("draws","a matrix")-0.3,tC0=w("draws","capabilities down one side")-0.4,tH0=w("draws","concepts across the top")-0.4;
  // the wall goes: what isn't in the matrix leaves, the capabilities move down the left, the five concepts across the top
  const off=fin(t,tM,0.7),notes=b3_done();Object.keys(notes).forEach(id=>{notes[id].a=B3_FIVE.includes(id)?0:1-off;});
  b3_wall(ctx,t,{layers:1-off,notes,lines:1-off,groups:[1-off,1-off,1-off],loc:1-off,caps:0});
  const kC=i=>ease(clamp((t-tC0-i*0.12)/1.6,0,1)),kH=j=>ease(clamp((t-tH0-j*0.1)/1.6,0,1)),fromW=B3_COLS.map(([id])=>B3_NOTES.find(n=>n[0]===id));
  // what each capability does with each: the people who run it say, row by row; then each column read down for its one C
  const tRun=w("people","the people who run each capability")-0.3,tRow=i=>tRun+i*0.26,tSys=w("people","not from what the systems say")-0.2;
  const tDown=w("column","reads down each column")-0.2,tOne=w("column","created by one capability")-0.2,tTh=w("owner","the owner of that capability")-0.2;
  const tCc=w("cp","Connecting customers creates")-0.2,tGr=w("cp","Grace's")-0.4,mv=ease(clamp((t-tGr)/1.1,0,1));
  const hi={},ring={};B3_COLS.forEach((_,j)=>{const v=pulseAt(t,tDown+j*0.75,1.3);if(v<=0.01)return;for(let i=0;i<8;i++)if(B3_CRUD[i][j].indexOf("C")>=0)hi[i+","+j]={a:v,col:BA_STR};});
  const sq=pulseAt(t,w("letters","In each square")-0.1,2.0);if(sq>0.01)hi["3,1"]={a:sq*0.8,col:BA_INF};
  const cpA=fin(t,tCc,0.5)*(1-fin(t,sc.dur-2.2,0.8));if(cpA>0.01){hi["3,1"]={a:cpA,col:BA_STR};ring["3,1"]={a:cpA,col:TRUST};}
  const later=j=>fin(t,tGr+1.4+[0,0,0.3,0,0.6][j],0.5);
  const colOwn=[{a:later(0),name:"Grace"},{a:t>tGr?1:0,name:"Grace",x:lerp(B3_MOX+B3_MOW/2,b3_cx(1),mv),y:lerp(b3_rc(3),B3_MFY,mv),hi:pulseAt(t,tGr+0.9,1.2)},{a:later(2),name:"Grace"},{a:fin(t,tGr+2.4,0.5),q:1},{a:later(4),name:"head of retail"}];
  b3_matrix(ctx,t,{grid:fin(t,tH0+1.0,0.8),capR:i=>{const k=kC(i);return{x:lerp(B3_CAPX(i),B3_MCX,k),y:lerp(B3_CAPY,b3_ry(i),k),w:lerp(B3_CAPW,B3_MCW,k),h:lerp(B3_CAPH,56,k),k,a:1};},
    headR:j=>{const k=kH(j),n=fromW[j];return{x:lerp(n[2],b3_cx(j),k),y:lerp(n[3],B3_MHY,k),w:lerp(B3_NW,B3_MHW,k),h:lerp(B3_NH,B3_MHH,k),a:1};},
    headHi:B3_COLS.map(()=>1-fin(t,0.4,0.8)),legend:1,legA:["creates it","reads it","updates it","deletes it"].map(s_=>fin(t,w("letters",s_)-0.2,0.4)),
    legHi:[0,1,2,3].map(k=>pulseAt(t,w("crud","four letters")-0.1+k*0.18,1.0)),title:fin(t,w("crud","CRUD matrix")-0.2,0.6),
    own:fin(t,tRun-0.2,0.5),ownRow:BA_CAPS.map((_,i)=>fin(t,tRow(i),0.4)),rowA:BA_CAPS.map((_,i)=>fin(t,tRow(i)+0.15,0.4)),
    ownHi:BA_CAPS.map((_,i)=>0.8*pulseAt(t,tTh,1.5)+(i===3?fin(t,tCc+0.3,0.5)*(1-fin(t,sc.dur-2.2,0.8)):0)),capHi:BA_CAPS.map((_,i)=>i===3?cpA*0.8:0),
    hi,ring,colHi:B3_COLS.map((_,j)=>pulseAt(t,tDown+j*0.75,1.3)),ownLab:fin(t,tGr+0.6,0.6),colOwn});
  // the people who run each capability, not the systems' records
  arrive(ctx,1790,760,t,tPe+0.2,()=>withA(ctx,1-fin(t,sc.dur-1.8,1.0),()=>baPersonR(ctx,"grace",1790,1050,0.7,{t,expr:"calm"})),{dy:20});
  withA(ctx,fin(t,tSys,0.5)*(1-fin(t,tCo-0.5,0.5)),()=>b3_chip(ctx,900,B3_MSY,"what the systems say",SOFT,{cross:fin(t,tSys+0.5,0.4)}));
  withA(ctx,fin(t,tOne,0.5)*(1-fin(t,tCp-0.6,0.5)),()=>tag(ctx,900,B3_MSY,"one C in each column",AMBER,{align:"center",size:30}));
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Two that create ---------- */
// A new home at dusk, just switched on: its walls, roof and door, its windows lit (o.on), the meter by its door glowing; the account
// cards that come to it (o.cards [{a, t0, x, col, kick, name}]), and the first bills on its step (o.bills [{a, t0, x, rot}])
function b3_home(ctx,t,o){o=o||{};const on=o.on||0;
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#17213c");g.addColorStop(0.5,"#3b3e5c");g.addColorStop(0.72,"#8a7280");g.addColorStop(0.72,"#2f2925");g.addColorStop(1,"#1d1916");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(let i=0;i<40;i++){const x=hash(i,301)*W,y=hash(i,302)*380;ctx.fillStyle="rgba(255,250,235,"+(0.25+0.4*hash(i,303))*(0.6+0.4*Math.sin(t*0.7+i))+")";ctx.beginPath();ctx.arc(x,y,1+hash(i,304)*1.2,0,TAU);ctx.fill();}
  ctx.fillStyle="#4a423a";ctx.beginPath();ctx.moveTo(918,778);ctx.lineTo(1002,778);ctx.lineTo(1090,H);ctx.lineTo(830,H);ctx.closePath();ctx.fill();
  const hx=700,hw=520,hy=480,hh=298;
  if(on>0.01)glow(ctx,960,700,520,[255,214,150],0.22*on);
  ctx.fillStyle="rgba(0,0,0,0.35)";ctx.fillRect(hx+14,hy+14,hw,hh);
  const wg=ctx.createLinearGradient(hx,hy,hx+hw,hy+hh);wg.addColorStop(0,"#cdb79a");wg.addColorStop(1,"#9c8670");ctx.fillStyle=wg;ctx.fillRect(hx,hy,hw,hh);
  ctx.fillStyle="#6e3f33";ctx.beginPath();ctx.moveTo(hx-34,hy+6);ctx.lineTo(hx+hw/2,hy-168);ctx.lineTo(hx+hw+34,hy+6);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(255,220,190,0.25)";ctx.lineWidth=3;ctx.stroke();
  // the windows and the door; lit as the power comes on
  [[hx+56,hy+70],[hx+hw-176,hy+70]].forEach(([x,y])=>{ctx.fillStyle=rgba(mix([40,44,58],[255,214,150],on),1);ctx.fillRect(x,y,120,96);if(on>0.01)glow(ctx,x+60,y+48,130,[255,210,140],0.4*on);
    ctx.strokeStyle="rgba(60,44,34,0.9)";ctx.lineWidth=5;ctx.strokeRect(x,y,120,96);ctx.beginPath();ctx.moveTo(x+60,y);ctx.lineTo(x+60,y+96);ctx.moveTo(x,y+48);ctx.lineTo(x+120,y+48);ctx.stroke();});
  ctx.fillStyle="#4b3427";ctx.fillRect(hx+hw/2-46,hy+hh-150,92,150);ctx.fillStyle="rgba(240,200,140,0.8)";ctx.beginPath();ctx.arc(hx+hw/2+30,hy+hh-74,5,0,TAU);ctx.fill();
  ctx.fillStyle="#2a1d16";ctx.fillRect(hx+hw/2-24,hy+hh-104,48,8);
  // the meter by the door, its light blue once the home is switched on
  const mx=hx+hw/2+80,my=hy+hh-136;ctx.fillStyle="#5d6168";rr(ctx,mx,my,40,56,6);ctx.fill();ctx.fillStyle=rgba(mix([40,50,60],BA_NET,on),1);ctx.beginPath();ctx.arc(mx+20,my+22,8,0,TAU);ctx.fill();if(on>0.01)glow(ctx,mx+20,my+22,60,BA_NET,0.6*on);
  (o.cards||[]).forEach(cd=>{if((cd.a||0)<=0.01||t<cd.t0)return;arrive(ctx,cd.x+210,375,t,cd.t0,()=>withA(ctx,cd.a,()=>{glass(ctx,cd.x,300,420,150,18,cd.col,{glow:14,ea:0.85,fill:"rgba(8,12,22,0.95)"});
    T(ctx,cd.kick,cd.x+28,348,{f:"mono",w:500,size:28,color:rgba(cd.col,1)});T(ctx,cd.name,cd.x+28,412,{w:700,size:34});}),{dy:14});});
  (o.bills||[]).forEach(b=>{if((b.a||0)<=0.01||t<b.t0)return;const k=spring((t-b.t0)/0.8),dy=(1-k)*-120;withA(ctx,b.a*clamp((t-b.t0)*3,0,1),()=>{ctx.save();ctx.translate(b.x,812+dy);ctx.rotate(b.rot||0);
    ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=12;ctx.fillStyle="rgba(240,232,214,0.98)";ctx.fillRect(-90,-46,180,92);ctx.shadowBlur=0;ctx.strokeStyle="rgba(120,100,80,0.5)";ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(-90,-46);ctx.lineTo(0,4);ctx.lineTo(90,-46);ctx.stroke();T(ctx,"first bill",0,32,{w:700,size:28,align:"center",color:"rgba(52,40,30,0.95)"});ctx.restore();});});}
scene("two",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tSe=c("serve"),tCn=c("connect"),tBo=c("both"),tLa=c("last"),tFa=c("farah"),tWh=c("whose");
  // the matrix; a new home, as the narration follows a family into it; the matrix again, where Farah's question is answered
  const homeA=fin(t,tBo-0.9,1.2)*(1-fin(t,tFa-0.9,1.2));
  if(homeA<0.99){wallBg(ctx,S,t);ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
    const two=fin(t,w("two","has two")-0.3,0.5),sh=pulseAt(t,w("farah","The matrix shows it")-0.1,1.6),m=b3_mFull();
    const sA=fin(t,w("serve","Serving customers")-0.2,0.5)*(1-fin(t,tCn-0.4,0.5)),cA=fin(t,w("connect","connecting customers")-0.2,0.5)*(1-fin(t,tBo-1.0,0.5));
    m.ring={"3,3":{a:two,col:BA_RED},"6,3":{a:two,col:BA_RED}};m.colHi=[0,0,0,0.7*two+0.5*sh,0];m.colHiCol=BA_RED;m.headHi=[0,0,0,two*(1-fin(t,tSe-0.3,0.6))+sh,0];m.headHiCol=BA_RED;
    m.capHi=BA_CAPS.map((_,i)=>i===6?sA:i===3?cA:0);m.hi={"6,3":{a:sA,col:BA_RET},"3,3":{a:cA,col:BA_NET}};
    b3_matrix(ctx,t,m);
    withA(ctx,sA,()=>tag(ctx,900,B3_MSY,"serving customers: when someone signs up",BA_RET,{align:"center",size:30}));
    withA(ctx,cA,()=>tag(ctx,900,B3_MSY,"connecting customers: when a new home is switched on",BA_NET,{align:"center",size:30}));
    // Farah, who speaks for the customers, and her question; then not Tomás's to decide, nor the data team's
    arrive(ctx,1790,760,t,tFa-0.3,()=>withA(ctx,1-fin(t,tWh-0.2,0.9),()=>baPersonR(ctx,"farah",1790,1050,0.7,{t,expr:t<w("farah","The matrix shows it")?"concerned":"calm"})),{dy:20});
    withA(ctx,fin(t,w("farah","asking why")-0.2,0.5)*(1-fin(t,tWh-0.4,0.5)),()=>b3_tagR(ctx,1890,556,"why two bills?",BIZ));
    const nA=1-fin(t,sc.dur-1.6,0.6);
    withA(ctx,fin(t,w("whose","isn't for Tomás")-0.2,0.5)*nA,()=>b3_chip(ctx,690,B3_MSY,"not Tomás's to decide",SOFT,{cross:fin(t,w("whose","isn't for Tomás")+0.4,0.4)}));
    withA(ctx,fin(t,w("whose","the data team")-0.2,0.5)*nA,()=>b3_chip(ctx,1210,B3_MSY,"nor the data team's",TECH,{cross:fin(t,w("whose","the data team")+0.4,0.4)}));
    ctx.restore();}
  if(homeA>0.01)withA(ctx,homeA,()=>{setScreen(ctx,S);
    const tA1=w("both","a family")-0.2,tA2=w("both","end up with two")-0.3,tB1=w("last","three hundred and forty families")-0.2;
    b3_home(ctx,t,{on:fin(t,tBo-0.6,0.8),cards:[{a:1,t0:tA1,x:110,col:BA_RET,kick:"account",name:"opened by retail"},{a:1,t0:tA2,x:1390,col:BA_NET,kick:"account",name:"opened at switch-on"}],
      bills:[{a:1,t0:w("last","two first bills")-0.5,x:880,rot:-0.06},{a:1,t0:w("last","two first bills")-0.1,x:1046,rot:0.05}]});
    withA(ctx,fin(t,tA2+0.3,0.5),()=>tag(ctx,960,256,"one home, two accounts",BA_RED,{align:"center",size:30}));
    if(t>tLa-0.2)arrive(ctx,960,130,t,tLa-0.1,()=>{glass(ctx,600,36,720,182,18,BA_RED,{glow:12,ea:0.85,fill:"rgba(16,8,10,0.94)"});T(ctx,"last year",630,82,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});
      T(ctx,"1,200 new homes: two accounts",630,138,{w:800,size:36});withA(ctx,fin(t,tB1,0.5),()=>T(ctx,"340 families: two first bills",630,190,{w:800,size:36,color:rgba(mix(INK,BA_RED,0.35),1)}));},{dy:-12});});
  vign(ctx,S);});

/* ---------- 5. The business decides ---------- */
scene("decides",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tCr=c("creates"),tTe=c("tells"),tOw=c("owner"),tDa=c("dated"),tSi=c("since");
  // the matrix, where the two who run them decide; then the new home again, with one account and one first bill
  const homeA=fin(t,tSi-0.9,1.2);
  if(homeA<0.99){wallBg(ctx,S,t);ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
    const tG=w("who","Grace runs")-0.2,tR=w("who","the head of retail")-0.2,tTo=w("who","decide it together")-0.2;
    const tSc=w("creates","Serving customers creates")-0.2,tCc=w("creates","Connecting customers creates the connection point")-0.2,tOn=w("creates","only reads the account")-0.2;
    const tTl=w("tells","tells retail")-0.3,tOp=w("tells","retail opens")-0.2,tAo=w("owner","head of retail")-0.3;
    const dec=fin(t,tOn,0.6),own=fin(t,tAo,0.6),m=b3_mFull({dec:own});m.cell={"3,3":{s:"R",k:dec}};m.colOwn[3].q=1-own;
    const okA=fin(t,tSc,0.5),two=1-fin(t,tSc,0.6);
    m.ring={"3,3":{a:two,col:BA_RED},"6,3":{a:Math.max(two,okA),col:mix(BA_RED,BA_OK,okA)}};m.hi={"6,3":{a:pulseAt(t,tSc,1.6)+pulseAt(t,tOp,1.4),col:BA_OK},"3,1":{a:pulseAt(t,tCc,1.8),col:BA_STR}};
    m.ownHi=BA_CAPS.map((_,i)=>i===3?fin(t,tG,0.5)*(1-fin(t,tSc-0.4,0.6)):i===6?fin(t,tR,0.5)*(1-fin(t,tSc-0.4,0.6))+pulseAt(t,tAo,1.6):0);
    m.colOwn[3].hi=pulseAt(t,tAo+0.4,1.6);
    // the decision, on a card; its words leave, and it goes onto the matrix with its date, as a pin on the account
    const tCd=w("dated","on the map")-0.4,tPin=w("dated","settle it again")-0.4,up=fin(t,tCd,0.6)*(1-fin(t,tPin+0.5,0.6)),pin=fin(t,tPin+0.7,0.4);
    withA(ctx,1-0.75*up,()=>b3_matrix(ctx,t,m));
    // when a new home is switched on, connecting customers tells retail, and retail opens the account
    const tlA=fin(t,tTl-0.1,0.4)*(1-fin(t,tDa-0.6,0.6));if(tlA>0.01){const x=b3_cx(3)-64,y0=b3_rc(3),y1=b3_rc(6);withA(ctx,tlA,()=>{arrowTo(ctx,x,y0,x,y1,BA_NET,0.95,{p:clamp((t-tTl)/0.8,0,1),lw:3,head:14,bend:0.28});
      tag(ctx,b3_cx(2),(y0+y1)/2,"tells retail",BA_NET,{align:"center",size:28});});}
    if(pin>0.01)withA(ctx,pin,()=>{const px=b3_cx(3)+B3_MHW/2-6,py=B3_MHY-B3_MHH/2+6;glow(ctx,px,py,40,TRUST,0.6);ctx.fillStyle=rgba(TRUST,1);ctx.beginPath();ctx.arc(px,py,10,0,TAU);ctx.fill();ctx.strokeStyle="rgba(40,30,10,0.8)";ctx.lineWidth=2;ctx.stroke();});
    if(up>0.01){const k=1-fin(t,tPin,0.7),cw=lerp(40,920,ease(k)),ch=lerp(30,330,ease(k)),cx=lerp(b3_cx(3)+B3_MHW/2-6,960,ease(k)),cy=lerp(B3_MHY-B3_MHH/2+6,440,ease(k)),tA=fin(t,tCd+0.1,0.5)*(1-fin(t,tPin-0.5,0.4));
      withA(ctx,up,()=>{glass(ctx,cx-cw/2,cy-ch/2,cw,ch,18,TRUST,{glow:16,ea:0.85,fill:"rgba(16,12,6,0.96)"});
        if(tA>0.01)withA(ctx,tA,()=>{const x=cx-cw/2+36,y=cy-ch/2;T(ctx,"decision · 12 May",x,y+56,{f:"mono",w:500,size:28,color:rgba(TRUST,1)});T(ctx,"Serving customers creates the account.",x,y+128,{w:800,size:36});
          T(ctx,"Connecting customers reads it, and tells retail.",x,y+186,{w:600,size:32,color:rgba(INK,0.9)});T(ctx,"decided by Grace and the head of retail",x,y+262,{w:600,size:28,color:rgba(TRUST,0.95)});});});}
    withA(ctx,fin(t,tTo,0.5)*(1-fin(t,tSc-0.4,0.5)),()=>tag(ctx,900,B3_MSY,"Grace and the head of retail decide it together",TRUST,{align:"center",size:30}));
    arrive(ctx,1790,760,t,0.5,()=>withA(ctx,1-fin(t,tSi-1.6,0.7),()=>baPersonR(ctx,"grace",1790,1050,0.7,{t,expr:"calm"})),{dy:20});
    ctx.restore();}
  if(homeA>0.01)withA(ctx,homeA,()=>{setScreen(ctx,S);const tO=w("since","one account")-0.3,tF=w("since","one first bill")-0.3;
    b3_home(ctx,t,{on:1,cards:[{a:1,t0:tO,x:110,col:BA_RET,kick:"account",name:"opened by retail"}],bills:[{a:1,t0:tF,x:960,rot:-0.03}]});
    withA(ctx,fin(t,tF+0.5,0.5),()=>{tag(ctx,960,256,"one home: one account, one first bill",BA_OK,{align:"center",size:30});kt_gtick(ctx,1290,256,16,fin(t,tF+0.9,0.5));});});
  vign(ctx,S);});

/* ---------- 6. Owners and stewards ---------- */
// a picture from the qanat in a circle, in a role's corner: fn draws it inside; lit by hi
function b3_pic(ctx,cx,cy,r,a,col,hi,fn){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.clip();fn();ctx.restore();
  ctx.strokeStyle=rgba(col,0.75+0.25*hi);ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();if(hi>0.01)glow(ctx,cx,cy,r*1.9,col,0.32*hi);});}
// the qanat's world at a gate, scaled into a circle at (cx, cy): the sky, the ground, the channel and the gate at gx, with fig drawn in
function b3_picGate(ctx,t,cx,cy,r,gx,lift,fig){const k=2.3,ys=ba_ys(gx);const g=ctx.createLinearGradient(0,cy-r,0,cy+r);g.addColorStop(0,"#7f9cc2");g.addColorStop(0.62,"#f0d9b8");g.addColorStop(1,"#c9a77c");ctx.fillStyle=g;ctx.fillRect(cx-r,cy-r,2*r,2*r);
  ctx.save();ctx.translate(cx-(gx+18)*k,cy+30-ys*k);ctx.scale(k,k);ctx.fillStyle="rgba(132,92,62,1)";ctx.fillRect(gx-200,ys,400,200);
  ba_village(ctx,t,{wet:[0.9,0.9,0.9,0.9],fill:[0,0,0,0].map((_,i)=>B3_GATES[i]===gx?lift:0)});ba_channel(ctx,t,2230,1);ba_gate(ctx,gx,lift,1);fig();ctx.restore();}
// a digger in the tunnel, bent over the work, his lamp beside him
function b3_picDigger(ctx,t,cx,cy,r){const k=2.3,x0=990,yt=ba_yt(x0);const g=ctx.createLinearGradient(0,cy-r,0,cy+r);g.addColorStop(0,"#7a5238");g.addColorStop(1,"#3a2618");ctx.fillStyle=g;ctx.fillRect(cx-r,cy-r,2*r,2*r);
  ctx.save();ctx.translate(cx-(x0+6)*k,cy+18-yt*k);ctx.scale(k,k);ctx.fillStyle="rgba(28,18,13,0.97)";ctx.fillRect(x0-80,yt-BA_TH,160,BA_TH+3);
  ctx.strokeStyle=rgba(BA_WATER,0.95);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x0-80,yt);ctx.lineTo(x0+80,yt);ctx.stroke();
  ba_fig(ctx,x0+4,yt,B3_S,{kind:"stoop",hold:"lamp",head:"cap",f:-1,rimA:0.85,rim:[255,206,140],col:[52,40,34],t});ctx.restore();}
// a role, as a card: its kicker and colour, what it does (o.title, lines), its parts (o.items [[text, a]]), who holds it for accounts
// (o.foot, o.footA), and a picture from the qanat in its corner (o.pic, o.picA, o.picHi, with its name, o.picName)
function b3_role(ctx,x,y,w,h,col,o){const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,col,{glow:14+14*(o.hi||0),ea:0.85,fill:"rgba(8,12,22,0.95)"});
  T(ctx,o.kick,x+32,y+56,{f:"mono",w:500,size:28,color:rgba(col,1)});o.title.forEach((l,i)=>T(ctx,l,x+32,y+124+i*52,{w:800,size:44}));
  const y0=y+292;(o.items||[]).forEach(([s_,ia,c2],i)=>{if(ia<=0.01)return;withA(ctx,ia,()=>{const yy=y0+i*54;ctx.fillStyle=rgba(c2||col,1);ctx.beginPath();ctx.arc(x+42,yy-10,5,0,TAU);ctx.fill();
    T(ctx,s_,x+62,yy,{w:600,size:30,color:c2?rgba(c2,1):rgba(INK,0.92)});if(ia<1)glow(ctx,x+200,yy-10,120,col,0.25*(1-ia));});});
  if((o.footA||0)>0.01)withA(ctx,o.footA,()=>T(ctx,o.foot,x+32,y+h-40,{w:700,size:28,color:rgba(col,1)}));
  if(o.pic){const px=x+w-96,py=y+108;b3_pic(ctx,px,py,66,o.picA==null?1:o.picA,col,o.picHi||0,o.pic);if(o.picName&&(o.picNameA||0)>0.01)withA(ctx,o.picNameA,()=>T(ctx,o.picName,px,py+108,{w:700,size:28,align:"center",color:rgba(col,1)}));}});}
scene("stewards",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});
  ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
  const tCa=c("cant"),tNa=c("names"),tBi=c("billing"),tMi=c("mirab"),tDi=c("diggers");
  const it=(id,s_,off)=>fin(t,w(id,s_)-(off==null?0.2:off),0.5);
  // the owner: what an owner decides, and who it is for accounts; the owners of the qanat in its corner
  arrive(ctx,360,480,t,0.3,()=>b3_role(ctx,80,150,560,590,TRUST,{kick:"owner",title:["decides"],items:[["what it means",it("decides","decides what a concept means")],["who creates it",it("decides","who creates it")],
    ["the rules on it",it("decides","the rules on it")],["how good it must be",it("decides","how good it must be")]],foot:"accounts: the head of retail",footA:fin(t,tCa-0.2,0.5),
    pic:()=>b3_picGate(ctx,t,360+184,258,66,B3_GATES[2],0,()=>{[[1950,1],[2016,-1]].forEach(([x,f],i)=>ba_fig(ctx,x,ba_ys(x),B3_S,Object.assign({f,t,rimA:0.6},i?{dress:"chador"}:{dress:"robe",head:"turban"})));}),
    picA:1,picName:"the owners",picNameA:fin(t,0.9,0.5)}),{dy:16});
  // too many to look after, day to day
  const nA=fin(t,w("cant","three hundred and ten thousand accounts")-0.3,0.5)*(1-fin(t,tNa-0.6,0.5));
  if(nA>0.01){arrive(ctx,960,430,t,w("cant","three hundred and ten thousand accounts")-0.3,()=>withA(ctx,nA,()=>{b3_count(ctx,700,330,520,"at the utility","310,000 accounts",BA_RET,1);}),{dy:12});
    withA(ctx,nA*fin(t,w("cant","day to day")-0.2,0.5),()=>tag(ctx,960,540,"looked after by one person, every day?",AMBER,{align:"center",size:28}));}
  // the steward, named by the owner: what a steward does, and who it is for accounts; the mirab in its corner
  const tSt=w("names","names a steward")-0.2;
  if(t>tSt)arrive(ctx,960,480,t,tSt,()=>b3_role(ctx,680,150,560,590,B3_STW,{kick:"steward",title:["looks after it,","day to day"],items:[["keeps the definition",it("billing","keeps the definition")],["answers questions about it",it("billing","answers questions")],
    ["follows up when it's wrong",it("billing","follows up")],["doesn't own it",it("mirab","doesn't own it"),SOFT]],foot:"accounts: retail's billing lead",footA:fin(t,w("billing","billing lead")-0.2,0.5),
    pic:()=>b3_picGate(ctx,t,960+184,258,66,B3_GATES[1],0.6+0.4*Math.sin(t*0.9)*0,()=>{const gx=B3_GATES[1],ys=ba_ys(gx-16);ba_fig(ctx,gx-16,ys,B3_S,{dress:"robe",head:"turban",f:1,reach:[gx-7,ba_ys(gx)-12-0.6*16],t,rimA:0.6});}),
    picA:1,picHi:fin(t,w("mirab","Like the mirab")-0.2,0.5)*(1-fin(t,tDi-0.4,0.6)),picName:"the mirab",picNameA:fin(t,w("mirab","Like the mirab")-0.2,0.5)}),{dy:16});
  // named by the owner
  const arA=fin(t,tSt+0.2,0.5);if(arA>0.01){arrowTo(ctx,470,146,850,146,TRUST,arA,{p:clamp((t-tSt-0.2)/0.7,0,1),lw:3,head:14,bend:-0.12});withA(ctx,arA,()=>tag(ctx,660,94,"names",TRUST,{align:"center",size:28}));}
  // the data team: builds and runs what holds it, and owns none of it; the diggers in its corner
  const tTe=w("diggers","the data team builds")-0.3;
  if(t>tTe)arrive(ctx,1560,480,t,tTe,()=>b3_role(ctx,1280,150,560,590,TECH,{kick:"data team",title:["builds and runs","what holds it"],items:[["owns none of it",it("diggers","owns none of it")]],
    pic:()=>b3_picDigger(ctx,t,1560+184,258,66),picA:1,picHi:fin(t,w("diggers","as diggers")-0.2,0.5),picName:"the diggers",picNameA:fin(t,w("diggers","as diggers")-0.2,0.5)}),{dy:16});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. An owner nobody wrote down ---------- */
// the outage table, as the data team keeps it: its name and when it was built, its columns and rows (texture), and its owner's line:
// o.own (0..1) from a red "?" to Grace; o.stw (0..1) its steward
function b3_table(ctx,t,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=420;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,TECH,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(8,12,22,0.95)"});
  T(ctx,"table · outages",x+28,y+52,{f:"mono",w:500,size:28,color:rgba(TECH,1)});T(ctx,"built 2019",x+w-28,y+52,{w:600,size:28,align:"right",color:rgba(SOFT,1)});
  [["outage",28],["started",290],["homes",520]].forEach(([s_,dx])=>T(ctx,s_,x+dx,y+112,{f:"mono",w:500,size:28,color:rgba(INK,0.8)}));
  ctx.strokeStyle=rgba(TECH,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+20,y+130);ctx.lineTo(x+w-20,y+130);ctx.stroke();
  for(let i=0;i<5;i++){const yy=y+160+i*36;[[28,150],[290,170],[520,70]].forEach(([dx,L],k)=>{ctx.fillStyle="rgba(200,220,255,"+(0.16+0.1*hash(i*3+k,505))+")";rr(ctx,x+dx,yy-8,L*(0.6+0.4*hash(i*3+k,506)),12,6);ctx.fill();});}
  const ow=o.own||0;if(ow<0.99)withA(ctx,1-ow,()=>b3_chip(ctx,x+28,y+h-58,"owner: ?",BA_RED,{left:true}));
  if(ow>0.01)withA(ctx,ow,()=>{if((o.ownHi||0)>0.01)glow(ctx,x+120,y+h-58,140,TRUST,0.4*o.ownHi);tag(ctx,x+28,y+h-58,"owner: Grace",TRUST,{size:28});});
  if((o.stw||0)>0.01)withA(ctx,o.stw,()=>tag(ctx,x+260,y+h-58,"steward: outage desk lead",B3_STW,{size:28}));});}
// a question card: two lines; o.cross strikes it out
function b3_q(ctx,x,y,w,l1,l2,col,o){o=o||{};glass(ctx,x,y,w,124,18,col,{glow:12,ea:0.85,fill:"rgba(8,12,22,0.95)"});T(ctx,l1,x+28,y+52,{w:700,size:32});T(ctx,l2,x+28,y+98,{w:700,size:32});
  if((o.cross||0)>0.01){withA(ctx,o.cross,()=>{ctx.strokeStyle=rgba(BA_RED,0.9);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+20,y+66);ctx.lineTo(x+w-80,y+60);ctx.stroke();});kt_rcross(ctx,x+w-42,y+62,18,o.cross);}}
scene("unwritten",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});
  ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
  const tTa=c("table"),tLe=c("left"),tAs=c("asks"),tGr=c("grace"),tFo=c("found");
  const tRep=w("table","Ama's yearly report")-0.3,tSys=w("asks","which system")-0.2,tCap=w("asks","which capability creates outages")-0.3;
  const tOp=w("grace","Operating the network")-0.2,tGs=w("grace","Grace's")-0.3,tDl=w("grace","outage desk lead")-0.3;
  // the table: every outage, and no owner written down
  arrive(ctx,500,380,t,0.4,()=>b3_table(ctx,t,120,170,760,{own:fin(t,tGs,0.6),ownHi:pulseAt(t,tGs+0.3,1.6),stw:fin(t,tDl,0.6),hi:pulseAt(t,w("table","holds every outage")-0.1,1.4)}),{dy:14});
  const pulse=pulseAt(t,w("some","no owner written down")-0.1,1.4)+pulseAt(t,w("left","nobody knows")-0.1,1.4);if(pulse>0.01)glow(ctx,240,532,120,BA_RED,0.45*Math.min(1,pulse));
  withA(ctx,fin(t,w("left","Whoever built it has left")-0.2,0.5),()=>b3_chip(ctx,120,656,"built by: someone who has left",SOFT,{left:true}));
  // Ama's yearly report to the regulator, counted from it
  const aA=1-fin(t,tSys-0.9,0.7);
  if(t>tRep&&aA>0.01){arrive(ctx,1280,400,t,tRep,()=>withA(ctx,aA,()=>{sheet(ctx,1060,250,440,300,{rot:0.012,plain:true});ctx.save();ctx.translate(1280,400);ctx.rotate(0.012);
      T(ctx,"yearly report",-190,-82,{w:800,size:32,color:"rgba(40,32,26,0.95)"});T(ctx,"to the regulator",-190,-36,{w:600,size:28,color:"rgba(70,58,48,0.95)"});
      T(ctx,"outages: counted",-190,40,{w:700,size:28,color:"rgba(40,32,26,0.95)"});T(ctx,"from the table",-190,80,{w:600,size:28,color:"rgba(70,58,48,0.95)"});ctx.restore();}),{dy:12});
    withA(ctx,aA,()=>arrowTo(ctx,890,400,1052,410,TECH,0.85,{p:clamp((t-w("table","counts them")+0.2)/0.7,0,1),lw:2.5,head:12,dash:[8,7]}));}
  arrive(ctx,1780,760,t,tRep-0.2,()=>withA(ctx,aA,()=>baPersonR(ctx,"ama",1780,1040,0.76,{t,expr:"calm"})),{dy:20});
  // Tomás's question: not which system, but which capability; operating the network creates outages, so they're Grace's
  arrive(ctx,1790,760,t,tSys-0.4,()=>baPersonR(ctx,"tomas",1790,1040,0.74,{t,expr:"calm"}),{dy:20});
  if(t>tSys)arrive(ctx,1230,290,t,tSys,()=>b3_q(ctx,1000,230,470,"which system","did it come from?",SOFT,{cross:fin(t,w("asks","He asks")-0.2,0.4)}),{dy:12});
  if(t>tCap)arrive(ctx,1230,440,t,tCap,()=>b3_q(ctx,1000,380,470,"which capability","creates outages?",AMBER),{dy:12});
  if(t>tOp)arrive(ctx,1230,594,t,tOp,()=>{b3_cap(ctx,1000,566,330,58,"operate the network",{hi:pulseAt(t,tOp+0.2,1.6)});glass(ctx,1344,566,124,58,12,BA_STR,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.94)"});
    T(ctx,"C",1406,606,{w:800,size:32,align:"center"});T(ctx,"outage",1406,548,{f:"mono",w:500,size:28,align:"center",color:rgba(SOFT,1)});},{dy:12});
  withA(ctx,fin(t,w("found","found by capability")-0.2,0.5),()=>tag(ctx,960,790,"owners: found by capability, not by system",BIZ,{align:"center",size:30}));
  ctx.restore();vign(ctx,S);});

/* ---------- 8. The data practice on the map ---------- */
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});
  ctx.save();drift(ctx,t,sc,{z:0.02,x:960,y:480});
  arrive(ctx,500,120,t,0.2,()=>{T(ctx,"the data practice, on the map",120,128,{w:800,size:38});tag(ctx,1800-tw(ctx,"business layer",28,700)-26,116,"business layer",BA_BUS,{size:28});},{dy:-10});
  const at={owner:w("roles","the data owner")-0.3,steward:w("roles","the data steward")-0.3};
  const tHo=w("holds","Each domain's owner")-0.1,tSn=w("stewards","names the stewards")-0.1,hoP=pulseAt(t,tHo,2.4)+0.45*fin(t,tHo+1.2,1.0),stP=pulseAt(t,tSn,2.4)+0.6*fin(t,tSn+1.2,1.0);
  // each domain's owner holds the owner's role: the role lit with their names; the stewards each owner names look after its concepts
  if(stP>0.01)BA_PRACTICE.forEach(([id,kind,,f,x,y,w_,h_])=>{if(kind==="object"&&f<=3)glow(ctx,x+w_/2,y+h_/2,170,B3_STW,0.28*stP);});
  baPractice(ctx,t,{film:3,at,pre:fin(t,0.4,0.8),owners:true,ownersA:1,ghost:1,hi:{owner:hoP,steward:stP}});
  if(hoP>0.01)[[1245,717],[1635,590],[1635,800]].forEach(([x,y])=>glow(ctx,x,y,130,TRUST,0.45*hoP));
  baPracticeLine(ctx,"team","tickets",1,BA_BUS);baPracticeLine(ctx,"tickets","requests",1,BA_BUS);
  baPracticeAccess(ctx,"requests","cp",1);baPracticeAccess(ctx,"requests","account",1,{lift:330});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. Every share, a name ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tU=c("utility"),tN=c("next"),mA=fin(t,tU-0.9,1.3);
  // on a qanat: every share has a named owner; the owners decide, and the mirab looks after the water
  if(mA<0.99){setScreen(ctx,S);ctx.save();focus(ctx,t,[[0,1880,736,2.1],[3,1880,740,2.25]],5);
    const tS=w("village","the mirab looks after")-0.6,lf=fin(t,tS,0.4)*(1-fin(t,tS+2.6,0.4)),M={x:B3_GATES[1]-16,k:fin(t,tS-0.5,0.4)*(1-fin(t,tS+2.9,0.4)),gi:1,lift:[0,lf,0,0],a:1};
    b3_village(ctx,t,{water:[[BA_XM,BA_XO+30]],wet:[0.9,0.92,0.9,0.88],fill:[0,lf,0,0],gate:[0,lf,0,0],own:[1,1,1,1],mirab:M});
    baTagAt(ctx,S,2070,ba_ys(2070)-48,"the owners: decide",TRUST,{dy:-36,a:fin(t,w("village","the owners decide")-0.2,0.5)*(1-fin(t,tU-0.7,0.5))});
    baTagAt(ctx,S,M.x,ba_ys(M.x)-48,"the mirab: looks after the water",B3_STW,{dy:-36,a:fin(t,tS+0.4,0.5)*(1-fin(t,tU-0.7,0.5))});
    ctx.restore();
    // the Vakilabad's turn of water, every share with its named owner, in a panel over the sky
    const pA=fin(t,0.6,0.8)*(1-fin(t,tU-0.7,0.5));if(pA>0.01)withA(ctx,pA,()=>{glass(ctx,60,50,620,330,22,BAC,{glow:14,ea:0.75,fill:"rgba(8,14,24,0.92)"});
      b3_disc(ctx,210,215,110,1,t);b3_ring(ctx,210,215,110,[[0,1/3,B3_KEEP,20,0.22],[1/3,1,BA_SAND,70,0.9]],{mark:1,mGlow:pulseAt(t,w("village","every share")-0.1,1.8)});
      T(ctx,"every share,",380,196,{w:800,size:32});T(ctx,"a named owner",380,244,{w:800,size:32,color:rgba(BIZ,1)});});}
  // at the utility: every concept, one capability that creates it, an owner and a steward; then Tomás's next note
  const eOut=1-fin(t,B+0.9,0.7);if(mA>0.01)withA(ctx,mA,()=>{wallBg(ctx,S,t);if(eOut>0.01)withA(ctx,eOut,()=>{ctx.save();drift(ctx,t,sc,{z:0.02,x:900,y:480});
    const tOne=w("utility","one capability that creates it")-0.2,tOd=w("utility","an owner who decides")-0.2,tSw=w("utility","a steward who looks after it")-0.2;
    const m=b3_mFull({dec:1}),hi={};B3_COLS.forEach((_,j)=>{const v=pulseAt(t,tOne+j*0.3,1.4);for(let i=0;i<8;i++)if(B3_CRUD[i][j].indexOf("C")>=0&&!(i===3&&j===3))hi[i+","+j]={a:v,col:BA_STR};});
    m.hi=hi;m.colOwn.forEach((co,j)=>{co.hi=pulseAt(t,tOd+j*0.15,1.5);});m.stw=fin(t,tSw,0.6);m.stwHi=pulseAt(t,tSw+0.3,1.6);
    withA(ctx,1-0.72*fin(t,tN-0.6,0.8),()=>b3_matrix(ctx,t,m));
    arrive(ctx,860,470,t,tN-0.2,()=>sticky(ctx,860,470,620,170,"Where is it born? "+ba_nb("In which process,")+" "+ba_nb("at which step?"),{col:NOTEC[0],size:36,rot:-0.02}),{dy:-16});
    arrive(ctx,1780,760,t,tN-0.4,()=>baPersonR(ctx,"tomas",1790,1040,0.74,{t,expr:"calm"}),{dy:20});ctx.restore();});});
  vign(ctx,S);
  baEnd(ctx,S,t,B+1.4,"Who creates it, who owns it","Each concept: one capability creates it, an owner decides, "+ba_nb("a steward looks after it."),"Film 3 of 5");});

// where the chapters meet (From words to data's joins.js): Creates, reads, updates, deletes opens on the wall as Tomás's next note
// leaves it, and Two that create and The business decides on the matrix as the chapter before leaves it, so each camera carries on
// from there and nothing shows twice. The data practice's map comes in on the same dark screen as An owner nobody wrote down: the
// table and its people leave first, then the map comes in
const CHAPTER_JOINS={glide:["matrix","two","decides"],leave:["practice"],bare:(ctx,S,t)=>{setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40});vign(ctx,S);}};
