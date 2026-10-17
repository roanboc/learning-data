/* ===== When strategy moves: scenes =====
   Eleven chapters, as in ../script.md. Kenya in 2007: a man in Nairobi sends part of his wages home, upcountry, with a bus driver,
   and not all of it arrives; the phones that send it and confirm it; the pilot for repaying loans, in which people sent money to
   others; the idea, in a sentence, and what it took on every layer of the map, down to an agent's counter. Then the utility: Tomás's
   note; the government's direction, a social tariff for every eligible household, automatically; the eligibility only the social
   services agency knows; the change walked down the map, layer by layer, each element it touches lit with its owner; the agreement
   that asks the agency for the least; the wall that holds, and the decision written down; new rules with homes; the counter, where
   households meet it, and the tenants an automatic match would miss; where the data lands, a contract versioned and its readers
   found through lineage; the path in plateaus; the page the minister's office reads in the morning; and the first of July.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; names drawn small are texture. Motion: every
   shot drifts slowly and things arrive with a spring. Sound: every effect in tools/score.py fires at the same moment as the thing
   it belongs to here, so keep the two in step. */

/* ---------- 1. Money by phone ---------- */
// Between Nairobi and the town upcountry: where the camera settles for the phones
const D10_MID=[(D10_NAI[0]+D10_UP[0])/2,(D10_NAI[1]+D10_UP[1])/2];
// the man's family, upcountry, drawn as a map draws people: [dx, dy, height], in pixels on screen, round the town
const D10_FAM=[[-24,2,30],[0,-2,32],[22,4,22]];
// the notes that don't arrive: where along the road each falls from the bus, and which way it drifts
const D10_LOST=[[0.34,-1],[0.55,1],[0.76,-1]];
// the pilot: five phones round a circle; the lender they repaid; the phones outside it that people sent money to; and who sent to whom
const D10_PIL=[0,1,2,3,4].map(i=>{const an=-Math.PI/2+i*TAU/5;return[720+Math.cos(an)*175,500+Math.sin(an)*165];});
const D10_LEND=[1290,540],D10_OUT=[[330,330],[300,690],[560,830],[1010,250],[1060,800]],D10_P2P=[[4,0],[3,1],[3,2],[0,3],[2,4]];
// what the idea needed on each layer: [layer, words, line, the word they're said at]
const D10_KL=[[0,"the central bank lets it run","bank","central bank"],[2,"money held in trust at a bank","bank","held in trust"],[2,"shops become agents","agents","become agents"],
  [3,"registered with an identity card","menu","register"],[4,"a short menu","menu","short menu"],[5,"the simplest phones","menu","simplest"]];
const D10_KX=1000;
scene("kenya",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tC=c("cash"),tL=c("launch"),tP=c("pilot"),tI=c("idea"),tA=c("agents"),tK=c("link");
  setScreen(ctx,S);ctx.fillStyle="#0b0f16";ctx.fillRect(0,0,W,H);
  // the camera: Kenya and its neighbours; the road west from Nairobi to the town upcountry; then centred between the two, for the phones
  const cam=d10_camAt(t,[[0,960,560,0.95],[2.8,D10_MID[0]+40,D10_MID[1]+16,2.1,4.4],[tL-0.7,D10_MID[0],D10_MID[1]-10,2.1,1.8]]);cam.z*=1+0.03*ease(t/sc.dur);
  const k=1/cam.z,dim=0.72*fin(t,tP-0.5,1.0)+0.12*fin(t,tI-0.2,1.0);
  // the bus west: it leaves Nairobi as the narration names it, and three notes fall from it on the way
  const tB0=tC+0.2,bu=t=>0.94*ease(clamp((t-tB0)/4.6,0,1)),u=bu(t);
  ctx.save();d10_camApply(ctx,cam);
  d10_map(ctx,t,cam,{labs:fin(t,0.4,1.0)*(1-fin(t,3.0,1.2)),road:clamp((t-w("home","sends")+0.3)/2.2,0,1),dim});
  // the man in Nairobi, and his family upcountry, as a map draws people
  const pa=1-dim*0.9;
  d10_icon(ctx,D10_NAI[0]+22*k,D10_NAI[1]+12*k,34*k,[255,236,206],fin(t,w("home","A man")-0.1,0.5)*pa);
  D10_FAM.forEach(([dx,dy,s_],j)=>d10_icon(ctx,D10_UP[0]+dx*k,D10_UP[1]+dy*k,s_*k,[255,236,206],fin(t,w("home","his family")-0.1+j*0.12,0.5)*pa));
  const nm=1-fin(t,tL+0.1,0.5);d10_name(ctx,cam,"Nairobi",D10_NAI[0]+46*k,D10_NAI[1]+12*k,30,null,fin(t,w("home","Nairobi")-0.2,0.6)*nm,"left");
  d10_name(ctx,cam,"his family, upcountry",D10_UP[0],D10_UP[1]-50*k,30,null,fin(t,w("home","his family")+0.2,0.6)*nm,"center");
  const ba=fin(t,tB0-0.3,0.4)*(1-fin(t,tB0+5.0,0.6)),bp=d10_roadAt(u);
  D10_LOST.forEach(([ud,side],j)=>{const td=tB0+4.6*d10_inv(ease,ud/0.94);if(t<td)return;const q=d10_roadAt(ud),dt=t-td,dr=1-Math.exp(-dt*1.6),nx=-Math.sin(q.an)*side,ny=Math.cos(q.an)*side;
    d10_note(ctx,q.x+nx*44*k*dr,q.y+ny*44*k*dr+12*k*dt,q.an+side*dt*2.2,26*k,j%2?[150,112,104]:[132,118,96],(1-fin(t,td+0.6,1.4))*pa);});
  d10_bus(ctx,bp.x,bp.y,bp.an,80*k,ba);
  // the envelope rides on the bus, and is thinner when it arrives
  const env=fin(t,tB0-0.2,0.4)*(1-fin(t,tP-0.6,0.6))*pa,es=lerp(20,14,sstep(0.3,0.8,u/0.94))*k,ea_=sstep(0.9,0.94,u)*fin(t,tB0+4.7,0.5);
  d10_envelope(ctx,lerp(bp.x,D10_UP[0]+34*k,ea_),lerp(bp.y-22*k,D10_UP[1]-6*k,ea_),es,env);
  ctx.restore();
  // what the bus carries, and what arrives
  const tg=1-fin(t,tL-0.7,0.5),rm=d10_roadAt(0.5),[mx_,my_]=d10_toS(cam,rm.x,rm.y),[ux_,uy_]=d10_toS(cam,D10_UP[0],D10_UP[1]);
  arrive(ctx,mx_+40,my_+70,t,w("cash","bus driver")-0.1,()=>withA(ctx,tg,()=>tag(ctx,mx_+40,my_+70,"with a bus driver, or a friend",[236,214,170],{align:"center",size:28})),{dy:8});
  arrive(ctx,ux_-140,uy_+50,t,w("cash","not all")+0.2,()=>withA(ctx,tg,()=>d10_tag(ctx,ux_-36,uy_+50,"not all of it arrives",[255,176,150],{align:"right",size:30})),{dy:8});

  // the phones: his in town, sending; theirs, upcountry, confirmed by a text message
  const tSel=w("launch","money sent")-0.3,tOK=w("launch","from a phone")+0.2,tGo=w("launch","confirmed")-0.7,tIn=tGo+1.0,pha=fin(t,tL+0.3,0.6)*(1-fin(t,tP-0.5,0.6));
  const snd=t<tOK?{title:"M-PESA",lines:["Send money","Withdraw cash","Buy airtime"],hi:t>tSel?0:null,hiA:fin(t,tSel,0.2)}:t<tGo+0.1?{title:"Send money",lines:["KSh 2,000","OK"],hi:t>tGo-0.5?1:null,hiA:fin(t,tGo-0.5,0.15)}:{title:"Sent.",lines:["KSh 2,000"]};
  if(pha>0.01){const[nx_,ny_]=d10_toS(cam,D10_NAI[0],D10_NAI[1]),pts=[[1300,424],[nx_,ny_]];for(let i=1;i<=16;i++){const f=i/16;pts.push([lerp(nx_,ux_,f),lerp(ny_,uy_,f)-Math.sin(Math.PI*f)*120]);}pts.push([620,424]);
    withA(ctx,pha*0.5,()=>d10_trace(ctx,pts,1,D10_SIG,{lw:2,a:0.35,dash:[6,8],nohead:1}));withA(ctx,pha,()=>d10_trace(ctx,pts,clamp((t-tGo)/1.0,0,1),D10_SIG,{lw:3.5,a:1-fin(t,tIn+0.4,0.6)}));}
  d10_phone(ctx,1300,130,560,700,t,{a:pha,bg:"room",skin:[104,66,46],sleeve:[70,92,120],...snd,lab:"Nairobi"});
  d10_phone(ctx,60,130,560,700,t,{a:pha,bg:"out",skin:[122,80,56],sleeve:[156,96,62],env:fin(t,tIn,0.3),clock:t>tIn?null:"18:42",lines:t>tIn?["Confirmed.","KSh 2,000","received"]:[],lab:"his family, upcountry"});

  // the pilot: phones that repaid loans to a lender; then people used them to send money to others, and sending money home became the plan
  const plA=fin(t,tP+0.1,0.5)*(1-fin(t,tI+0.1,0.6)),tRp=w("pilot","repaying"),tSd=w("pilot","send money"),tPl=w("pilot","became the plan"),loan=1-0.75*fin(t,tPl-0.2,0.6);
  if(plA>0.01)withA(ctx,plA,()=>{
    D10_PIL.forEach(([x,y],i)=>d10_trace(ctx,[[x+(D10_LEND[0]-x)*0.12,y+(D10_LEND[1]-60-y)*0.12],[D10_LEND[0]-70,D10_LEND[1]-50+(i-2)*14]],clamp((t-tRp-i*0.12)/0.8,0,1),[255,214,170],{lw:2.5,a:0.8*loan,dash:[8,8],nohead:1}));
    D10_P2P.forEach(([i,j],n)=>{const[x0,y0]=D10_PIL[i],[x1,y1]=D10_OUT[j],t0=tSd-0.1+n*0.16,mx=(x0+x1)/2-(y1-y0)*0.25,my=(y0+y1)/2+(x1-x0)*0.25,P=[];for(let q=0;q<=12;q++){const f=q/12,g=1-f;P.push([g*g*x0+2*g*f*mx+f*f*x1,g*g*y0+2*g*f*my+f*f*y1]);}
      d10_trace(ctx,P.slice(1,-1),clamp((t-t0)/0.7,0,1),TRUST,{lw:3,a:0.9});});
    arrive(ctx,D10_LEND[0],D10_LEND[1]-40,t,tRp-0.3,()=>d10_lender(ctx,D10_LEND[0],D10_LEND[1],110,[255,214,170],loan),{dy:-12});
    D10_PIL.forEach(([x,y],i)=>arrive(ctx,x,y,t,tP+0.3+i*0.08,()=>d10_phoneIcon(ctx,x,y,26,1,D10_SIG),{dy:-10}));
    D10_OUT.forEach(([x,y],j)=>arrive(ctx,x,y,t,tSd-0.4+j*0.1,()=>d10_phoneIcon(ctx,x,y,22,1,TRUST),{dy:-10}));
    arrive(ctx,D10_LEND[0],D10_LEND[1]-190,t,w("pilot","small loans")-0.1,()=>withA(ctx,loan,()=>tag(ctx,D10_LEND[0],D10_LEND[1]-190,"repaying small loans",[255,214,170],{align:"center",size:30})),{dy:8});
    arrive(ctx,720,180,t,w("pilot","sending money home"),()=>tag(ctx,720,180,"sending money home",TRUST,{align:"center",size:30}),{dy:8});});

  // the idea, on paper; then the map's six layers, and what it took on each, down to an agent's counter
  const tMk=w("idea","Making it real"),tFly=w("idea","much more")+0.3,fl=ease(clamp((t-tFly)/1.2,0,1)),tLk=w("link","every layer")-0.3,tG=w("link","shop counter")-0.1,gu=ease(clamp((t-tG)/1.6,0,1));
  const stA=1-0.88*gu,R=layerStack(ctx,700,170,1120,{a:0,sh:80,gap:18});
  const hi=[0,0,0,0,0,0];D10_KL.forEach(([li,,ln,wd])=>{hi[li]+=pulseAt(t,w(ln,wd)+0.1,1.2)*0.8;});hi[1]+=pulseAt(t,tFly+1.1,1.2)*0.8;
  // the change, as a light that runs down every layer to the counter
  const dp=clamp((t-tLk)/1.1,0,1);for(let i=1;i<6;i++)hi[i]+=pulseAt(t,tLk+1.1*(i-1)/4,0.9)*0.9;
  layerStack(ctx,700,170,1120,{a:stA,p:clamp((t-tMk+0.2)/1.4,0,1),sh:80,gap:18,size:30,hi});
  const kx=[D10_KX,D10_KX,D10_KX,D10_KX,D10_KX,D10_KX],cy=i=>R[i][1]+R[i][3]/2;
  withA(ctx,stA,()=>{
    // the idea itself, a chip in strategy once its note has landed there
    const cw=tw(ctx,"money, sent by phone",28,700)+36;
    if(fl>=1)d10_chip(ctx,D10_KX,cy(1),"money, sent by phone",STR,{hi:hi[1]});
    D10_KL.forEach(([li,s_,ln,wd])=>{const x=kx[li],t0=w(ln,wd)-0.2;kx[li]+=tw(ctx,s_,28,700)+36+18;arrive(ctx,x+120,cy(li),t,t0,()=>d10_chip(ctx,x,cy(li),s_,LAY6[li][1],{hi:hi[li]}),{dy:-10});});
    if(dp>0)d10_trace(ctx,[[D10_KX-24,cy(1)],[D10_KX-24,cy(5)]],dp,STR,{lw:5});
    if(t>tLk+1.0)d10_trace(ctx,[[D10_KX-24,cy(5)],[D10_KX-24,cy(5)+40],[900,800],[760,760],[668,700]],clamp((t-tLk-1.0)/0.7,0,1),STR,{lw:5,a:1-gu});
    arrive(ctx,1310,810,t,w("link","every layer")+0.5,()=>withA(ctx,1-fin(t,tG+1.0,0.5),()=>tag(ctx,1310,810,"every layer, down to the counter",STR,{align:"center",size:30})),{dy:8});
    if(fl>0&&fl<1)sticky(ctx,lerp(430,D10_KX+cw/2,fl),lerp(240,cy(1),fl),lerp(560,cw,fl),lerp(150,52,fl),"Money, sent by phone.",{col:NOTEC[0],edge:STR,glass:fl,size:lerp(44,28,fl),rot:-0.02});});
  if(fl<=0)arrive(ctx,430,240,t,tI+0.1,()=>sticky(ctx,430,240,560,150,"Money, sent by phone.",{col:NOTEC[0],size:44,rot:-0.02}),{dy:-24,from:1.06});
  // the counter: cash into mobile money at an agent's; then, close, upcountry, the man's family takes the cash he sent
  const coA=fin(t,tA+0.1,0.6),gv=clamp((t-w("link","where people")+0.3)/4.6,0,1);
  if(coA>0.01){ctx.save();const s_=lerp(1,1.3,gu);ctx.translate(lerp(360,960,gu),lerp(590,530,gu));ctx.scale(s_,s_);ctx.translate(-360,-590);
    arrive(ctx,360,590,t,tA+0.1,()=>{d10_counter(ctx,70,330,580,520,t,{in:clamp((t-w("agents","changing")+0.2)/2.6,0,1),give:gv,lit:pulseAt(t,w("agents","mobile money")+0.3,1.4)});
      withA(ctx,1-gu,()=>tag(ctx,88,364,"an agent's counter",[255,214,170],{size:28}));withA(ctx,gu,()=>tag(ctx,88,364,"his family, upcountry",[255,214,170],{size:28}));},{dy:-14});
    ctx.restore();}
  const ct=1-fin(t,tK-0.4,0.5);
  arrive(ctx,90,290,t,w("agents","changing cash")-0.1,()=>withA(ctx,ct,()=>tag(ctx,90,290,"cash in",[255,214,170],{size:28})),{dy:8});
  arrive(ctx,250,290,t,w("agents","and back")-0.1,()=>withA(ctx,ct,()=>tag(ctx,250,290,"cash out",[255,214,170],{size:28})),{dy:8});
  eaYear(ctx,90,90,"Kenya · 2007",CLAY,fin(t,0.6,0.6)*(1-fin(t,tL-0.3,0.4)));eaYear(ctx,90,90,"March 2007",CLAY,fin(t,tL,0.4)*(1-fin(t,tP-0.3,0.4)));
  eaYear(ctx,90,90,"2005 · a pilot",CLAY,fin(t,tP,0.4)*(1-fin(t,tI-0.3,0.4)));eaYear(ctx,90,90,"2007",CLAY,fin(t,tI,0.4)*(1-fin(t,B-0.4,0.6)));
  fadeIn(ctx,S,t);vign(ctx,S);
  eaTitle(ctx,S,t,B+1.0,"When strategy moves","one change, down every layer",EAC,"Film 10 of 11 · enterprise architecture, for data");});

/* ---------- 2. A direction ---------- */
// Tomás's note; the government's direction, as a letter, each phrase marked as it's read; who knows which households are eligible
// (the social services agency) and who doesn't (the utility): the same ten homes on both; and the minister's office's question
const D10_DIR=[["From 1 July 2027,","first of July"],["every eligible household","every eligible"],["gets a social tariff:","social tariff"],["a discount on its bill,","a discount"],["automatically,","automatically"],["with no forms.","no forms"]];
const D10_ELIG=[1,4,6,9];
// the letter: a sheet, a little crooked, from the government; hl[i] (0..1) marks line i as it's read
function d10_dirLetter(ctx,x,y,w,hl,o){o=o||{};const h=650,ink="rgba(40,38,40,0.96)",soft="rgba(96,86,76,0.95)";ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?0.012:o.rot);ctx.translate(-x-w/2,-y-h/2);
  sheet(ctx,x,y,w,h,{rot:0,plain:true});T(ctx,"direction",x+40,y+62,{f:"mono",w:500,size:28,color:"rgba(150,60,60,0.95)"});T(ctx,"November 2026",x+w-40,y+62,{f:"mono",w:500,size:28,align:"right",color:soft});
  T(ctx,"from the government, the utility's owner",x+40,y+108,{w:600,size:28,color:soft});ctx.fillStyle="rgba(96,86,76,0.35)";ctx.fillRect(x+40,y+134,w-80,2);
  T(ctx,"A social tariff",x+40,y+196,{w:800,size:44,color:ink});
  D10_DIR.forEach(([s_],i)=>{const yy=y+262+i*54,hv=hl[i]||0;if(hv>0.01){const tw_=tw(ctx,s_,36,700);withA(ctx,clamp(hv,0,1),()=>{ctx.fillStyle="rgba(255,206,84,0.5)";ctx.fillRect(x+32,yy-34,(tw_+16)*ease(clamp(hv*1.4,0,1)),46);});}
    T(ctx,s_,x+40,yy,{w:700,size:36,color:ink});});
  T(ctx,"the Minister",x+w-40,y+h-42,{w:600,size:28,align:"right",color:soft});ctx.restore();return h;}
// an organisation, as a card of glass in its colour: its name, and ten homes. o.lit[i] lights home i; o.q (0..1): a question mark
// over each; o.say: what it knows, at the bottom
function d10_org(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:12+12*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.1);rr(ctx,x,y,w,h,18);ctx.fill();
  archGlyph(ctx,"actor",x+34,y+48,13,col);T(ctx,name,x+60,y+58,{w:800,size:30,color:rgba(INK,0.97)});const cw=(w-60)/5;
  for(let i=0;i<10;i++){const hx=x+30+cw*(i%5+0.5),hy=y+148+Math.floor(i/5)*78,lt=o.lit?o.lit[i]||0:0;d10_house(ctx,hx,hy,46,1,{lit:lt});
    if(lt>0.5)kt_gtick(ctx,hx+22,hy-36,10,lt);if((o.q||0)>0.01)withA(ctx,o.q,()=>T(ctx,"?",hx+24,hy-30,{w:800,size:28,align:"center",color:rgba(col,1),deco:1}));}
  if(o.say)withA(ctx,o.sayA==null?1:o.sayA,()=>T(ctx,o.say,x+30,y+h-26,{w:700,size:28,color:rgba(col,1)}));});}
// a clock, for a deadline: its minute hand moves round, a little fast
function d10_clock(ctx,x,y,r,t,a,col){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-r,y-r,2*r,2*r,r,col,{glow:14,ea:0.9,fill:"rgba(20,8,12,0.95)"});ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineCap="round";
  for(let k=0;k<12;k++){const an=k*TAU/12;ctx.lineWidth=k%3?1.5:2.5;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.72,y+Math.sin(an)*r*0.72);ctx.lineTo(x+Math.cos(an)*r*0.84,y+Math.sin(an)*r*0.84);ctx.stroke();}
  const m=-Math.PI/2+t*1.2,hh=-Math.PI/2+t*0.1+2.2;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(hh)*r*0.42,y+Math.sin(hh)*r*0.42);ctx.stroke();ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(m)*r*0.66,y+Math.sin(m)*r*0.66);ctx.stroke();ctx.restore();});}
scene("direction",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const tLt=c("letter"),tT=c("tariff"),tAg=c("agency"),tAsk=c("ask"),nt=ease(fin(t,tLt-0.5,0.9));
  person(ctx,"tomas",230,1030,0.78,{t,pose:t>0.6&&t<c("note")+3.4?"explain":"stand",expr:t>w("ask","by tomorrow")-0.3?"concerned":"calm"});
  // the note: what does a change in strategy mean for the data?
  arrive(ctx,960,330,t,0.3,()=>{ctx.save();ctx.translate(lerp(960,1612,nt),lerp(330,118,nt));ctx.scale(lerp(1,0.58,nt),lerp(1,0.58,nt));sticky(ctx,0,0,800,230,"What does a change in strategy mean for the data?",{col:NOTEC[0],size:50,st:0,rot:-0.02});ctx.restore();},{dy:-30});
  // the direction, from the utility's owner, its phrases marked as they're read
  const hl=D10_DIR.map(([,wd])=>clamp((t-w("tariff",wd)+0.1)/0.7,0,1)*(1-0.5*fin(t,tAg-0.2,0.6))),mv=ease(fin(t,tAg-0.4,1.0));
  hl[1]=Math.max(hl[1],fin(t,tAg-0.2,0.6));
  arrive(ctx,925,515,t,tLt+0.2,()=>{ctx.save();ctx.translate(lerp(0,-40,mv),0);d10_dirLetter(ctx,560,190,730,hl,{});ctx.restore();},{dy:-20,from:1.04});
  // who is eligible: the agency knows, and the utility doesn't; the same ten homes on both
  const ga=fin(t,tAg+0.1,0.6),tKn=w("agency","another organisation"),tNot=w("agency","not to the utility");
  arrive(ctx,1590,380,t,tKn-0.2,()=>d10_org(ctx,1330,230,520,300,"the social services agency",BUS,{lit:[0,1,2,3,4,5,6,7,8,9].map(i=>D10_ELIG.includes(i)?fin(t,w("agency","social services")+0.2+i*0.05,0.4):0),say:"knows which are eligible",sayA:fin(t,w("agency","social services")+0.6,0.5)}),{dy:-14});
  arrive(ctx,1590,710,t,tNot-0.3,()=>d10_org(ctx,1330,560,520,300,"the utility",D10_RET,{q:fin(t,tNot+0.2,0.5),say:"doesn't know which",sayA:fin(t,tNot+0.4,0.5)}),{dy:-14});
  if(ga>0.01){const lw=tw(ctx,D10_DIR[1][0],36,700);arrowTo(ctx,560-40+40+lw+28,190+262+54-12,1318,382,TRUST,0.9*ga,{p:clamp((t-tKn)/0.8,0,1),lw:3,head:12,dash:[9,7],bend:-0.08});}
  // the question, from the minister's office: what will it take, by tomorrow?
  arrive(ctx,930,700,t,tAsk+0.1,()=>{sticky(ctx,930,700,640,190,"What will it take? "+d10_nb("By tomorrow."),{col:NOTEC[1],size:44,rot:0.03,src:"the minister's office"});},{dy:-30,from:1.06});
  d10_clock(ctx,1222,618,38,t*(1+3*fin(t,w("ask","by tomorrow")-0.2,0.4)),fin(t,w("ask","by tomorrow")-0.2,0.4),[255,150,170]);
  if(t>w("ask","by tomorrow"))ring(ctx,1222,618,38+30*((t-w("ask","by tomorrow"))%0.9)/0.9,[255,150,170],0.6*(1-((t-w("ask","by tomorrow"))%0.9)/0.9),2);
  ctx.restore();
  eaYear(ctx,90,90,"November 2026",CLAY,fin(t,tLt,0.5));
  vign(ctx,S);});

/* ---------- 3. Down every layer ---------- */
// The map as one tall column of six layers, walked from the top: a light runs down its left edge, layer by layer, and in each one
// the elements the change touches light up with their owners' tags, while the rest of the map stays dark. Every element is
// [layer, x, y offset, width, height, name, kind, new?, owner, line, word]; the rest, [layer, x, y offset, width, height, name, kind].
const D10_LY=i=>120+i*330,D10_LH=270;
const D10_WALK=[
 [0,110,48,360,92,"the direction","driver",1,"Ama","mot","new driver"],[0,560,48,400,92,"keep bills affordable","goal",0,"the board","mot","keep bills"],
 [0,1050,48,480,92,"eligible households "+d10_nb("on the tariff"),"outcome",1,"head of retail","out","an outcome"],
 [1,1190,44,200,104,"sell energy","capability",0,"","str","selling energy"],[1,1408,44,200,104,"serve customers","capability",0,"","str","serving customers"],[1,1626,44,200,104,"meet obligations","capability",0,"Ama","str","meeting obligations"],
 [2,110,48,300,92,"social tariff","product",1,"head of retail","bus","new product"],[2,840,76,250,84,"apply the discount","process",1,"head of retail","bus","new step"],
 [2,1300,48,300,92,"social services agency","actor",1,"","bus","new partner"],[2,1650,48,190,92,"agreement","object",1,"Ama","bus","agreement"],
 [3,760,48,400,104,"eligibility","object",1,"head of retail","inf","eligibility"],
 [4,420,48,340,92,"billing system","component",0,"head of retail","runs","billing system"],[4,840,48,360,92,"customer system","component",0,"head of retail","runs","customer system"],
 [5,1000,48,360,92,"secure exchange","node",1,"IT","runs","secure exchange"]];
const D10_REST=[[0,1580,30,260,96,"replace assets before they fail","goal"],[0,1580,142,260,96,"connect renewable power","goal"],
 [1,100,44,200,104,"plan the network","capability"],[1,318,44,200,104,"operate the network","capability"],[1,536,44,200,104,"maintain assets","capability"],[1,754,44,200,104,"connect customers","capability"],[1,972,44,200,104,"generate power","capability"],
 [3,110,48,260,92,"customer","object"],[3,410,48,300,92,"account","object"],[3,1210,48,280,92,"meter reading","object"],[3,1530,48,300,92,"bill","object"],
 [4,110,48,260,92,"meter data","component"],[4,1260,48,280,92,"outage system","component"],[4,1580,48,260,92,"asset register","component"],
 [5,110,48,320,92,"the network","node"],[5,480,48,420,92,"data platform","node"],[5,1460,48,360,92,"office systems","node"]];
// who must agree: each owner, and what of the change is theirs
const D10_AGREE=[["Ama","the direction · obligations · the agreement"],["the board","keep bills affordable"],["head of retail","eight elements, from the outcome to the systems"],["IT","the secure exchange"],["the agency","the agreement, as the other party"]];
scene("walk",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const L=["mot","out","str","bus","inf","runs"].map(c),tW=c("walk"),tO=c("owners"),tA=w("owners","the list");
  // the camera: the whole column; then each layer in turn, close; then back, with the column on the left and who must agree beside it
  const cam=d10_camAt(t,[[0,960,1207,0.46],[L[0]-0.5,960,D10_LY(0)+250,1.0,1.8],[L[2]-0.6,960,D10_LY(1)+250,1.0,1.6],[L[3]-0.6,960,D10_LY(2)+250,1.0,1.6],[L[4]-0.6,960,D10_LY(3)+250,1.0,1.6],[L[5]-0.6,960,D10_LY(4)+330,1.0,1.6],[tO+0.6,2060,1207,0.46,2.2]]);
  cam.z*=1+0.02*Math.sin(Math.PI*clamp(t/sc.dur,0,1));
  const D=cam.z<0.85?1:0,lv=t<L[0]?-1:t<L[2]?0:t<L[3]?1:t<L[4]?2:t<L[5]?3:t<tO?5:5;
  // how far down the light has run: to the top layer as the walk begins, then a layer at a time
  const yRun=t<w("walk","layer by")?lerp(-400,D10_LY(0)+20,ease(clamp((t-tW-0.4)/2.0,0,1))):D10_LY(0)+20+[L[2],L[3],L[4],L[5],w("runs","secure exchange")].reduce((s_,tl)=>s_+330*ease(clamp((t-tl+0.6)/1.2,0,1)),0)+(D10_LH-20)*ease(clamp((t-B+0.6)/1.4,0,1));
  ctx.save();d10_camApply(ctx,cam);
  // the six layers, their names above them
  LAY6.forEach(([nm,col],i)=>{const y0=D10_LY(i),on=yRun>y0+30?1:0,hi=pulseAt(t,[L[0],L[2],L[3],L[4],L[5],L[5]+0.3][i]-0.2,1.6)*0.7;
    slab(ctx,60,y0,1800,D10_LH,nm,col,{label:false,sk:22,fill:0.06+0.1*on,hi});withA(ctx,clamp((880-d10_toS(cam,72,y0-28)[1])/40,0,1),()=>d10_tag(ctx,72,y0-28,nm,col,{size:30,deco:D}));});
  // the light, down the left edge, and a ring where it reaches each layer
  d10_trace(ctx,[[38,-400],[38,Math.min(yRun,D10_LY(5)+D10_LH)]],1,MOT,{lw:5/cam.z*0.9+1,a:0.9,nohead:1});
  if(yRun>-380){glow(ctx,38,Math.min(yRun,D10_LY(5)+D10_LH),36,MOT,0.9);ctx.fillStyle=rgba([236,226,255],1);ctx.beginPath();ctx.arc(38,Math.min(yRun,D10_LY(5)+D10_LH),7,0,TAU);ctx.fill();}
  [0,1,2,3,4,5].forEach(i=>{const tl=i===0?tW+2.3:i===1?L[2]:i===2?L[3]:i===3?L[4]:i===4?L[5]:w("runs","secure exchange"),q=clamp((t-tl)/1.4,0,1);if(q>0&&q<1)ring(ctx,38,D10_LY(i)+20,20+120*q,MOT,0.8*(1-q),3);});
  // the rest of the map, untouched, stays dark
  D10_REST.forEach(([li,x,dy,ww,hh,nm,kind])=>d10_el(ctx,x,D10_LY(li)+dy,ww,hh,nm,LAY6[li][1],kind,{size:22,gs:10,deco:1,a:0.32}));
  // billing, the business process the new step goes into, between two steps it already has
  const by=D10_LY(2);withA(ctx,0.9,()=>{archEl(ctx,470,by+28,780,190,"",BUS,"process",{gs:13,hi:pulseAt(t,w("bus","in billing"),1.4)*0.6});T(ctx,"billing",496,by+66,{w:800,size:30,color:rgba(INK,0.96),deco:D});
    [[500,"calculate",300],[1120,"issue the bill",110]].forEach(([x,nm,ww])=>archEl(ctx,x,by+76,ww,84,ww>200?nm:"issue",BUS,"process",{size:26,gs:10,deco:1,a:0.5}));});
  // the change: each element it touches lights, with its owner; what it adds arrives, marked new
  D10_WALK.forEach(([li,x,dy,ww,hh,nm,kind,nw,own,ln,wd],k)=>{const y=D10_LY(li)+dy,t0=w(ln,wd)-0.15,on=fin(t,t0,0.5),hi=pulseAt(t,t0+0.2,1.4)+(t>tO?0.35*fin(t,tO,0.6):0)+pulseAt(t,tA+0.15*(k%2),1.2)*0.5+pulseAt(t,B+li*0.22,1.0)*0.8;
    if(nw)arrive(ctx,x+ww/2,y+hh/2,t,t0,()=>{const dt=nm==="eligibility";d10_el(ctx,x,y,ww,hh,dt?"":nm,LAY6[li][1],kind,{size:28,gs:13,hi,deco:D});d10_new(ctx,x+ww-20,y-12,1,D);
      if(dt){T(ctx,nm,x+ww/2-8,y+46,{w:700,size:28,align:"center",color:rgba(INK,0.96),deco:D});withA(ctx,fin(t,w("inf","its dates")-0.1,0.5),()=>T(ctx,"from · until",x+ww/2-8,y+88,{f:"mono",w:500,size:28,align:"center",color:rgba(INF,1),deco:D}));}},{dy:-14});
    else d10_el(ctx,x,y,ww,hh,nm,LAY6[li][1],kind,{size:28,gs:13,hi:hi*on,deco:D||on<0.5?1:0,a:0.32+0.68*on});
    const oy=kind==="process"?D10_LY(2)+250:y+hh+52;if(own)arrive(ctx,x+ww/2,oy,t,t0+0.5,()=>d10_owner(ctx,x+ww/2,oy,own,1,{align:"center",hi:pulseAt(t,tA,1.2)+pulseAt(t,B+li*0.22+0.1,1.0)*0.8,deco:D}),{dy:8});});
  // sell energy and serve customers share an owner: one tag under both
  arrive(ctx,1399,D10_LY(1)+200,t,w("str","serving customers")+0.4,()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1290,D10_LY(1)+152);ctx.lineTo(1290,D10_LY(1)+172);ctx.lineTo(1508,D10_LY(1)+172);ctx.lineTo(1508,D10_LY(1)+152);ctx.stroke();ctx.restore();
    d10_owner(ctx,1399,D10_LY(1)+204,"head of retail",1,{align:"center",hi:pulseAt(t,tA,1.2),deco:D});},{dy:8});
  // how they're related: the direction and the outcome bear on the goal; the agency and the utility share the agreement
  const rel=(pts,t0,col)=>d10_trace(ctx,pts,clamp((t-t0)/0.6,0,1),col,{lw:2.5,a:0.75,dash:[8,7],nohead:1});
  rel([[470,D10_LY(0)+94],[560,D10_LY(0)+94]],w("mot","under a goal")+0.2,MOT);rel([[1050,D10_LY(0)+94],[960,D10_LY(0)+94]],w("out","an outcome")+0.6,MOT);
  rel([[1600,D10_LY(2)+94],[1650,D10_LY(2)+94]],w("bus","agreement")+0.4,BUS);
  [[790,"calculate"],[1090,"apply"]].forEach(([x])=>rel([[x+4,D10_LY(2)+118],[x+46,D10_LY(2)+118]],w("bus","new step")+0.3,BUS));
  ctx.restore();
  // who must agree, beside the map
  const tl=fin(t,tO+1.0,0.6);
  arrive(ctx,1440,500,t,tO+1.0,()=>{glass(ctx,1010,180,850,650,22,TRUST,{glow:14,ea:0.8,fill:"rgba(16,13,6,0.94)"});T(ctx,"who must agree",1046,230,{f:"mono",w:500,size:28,color:rgba(TRUST,1)});
    D10_AGREE.forEach(([nm,what],i)=>{const y=300+i*104,a=fin(t,tO+1.3+i*0.3,0.5);withA(ctx,a,()=>{d10_owner(ctx,1046,y,nm,1,{pre:"",hi:pulseAt(t,tA+0.2+i*0.2,1.2)+pulseAt(t,B+0.4+i*0.25,1.0)});T(ctx,what,1046,y+52,{w:700,size:28,color:rgba(SOFT,0.95)});});});},{dy:-16});
  eaYear(ctx,90,90,"November 2026",CLAY,fin(t,0.4,0.5)*(1-fin(t,L[0]-0.8,0.5)));
  vign(ctx,S);});

/* ---------- 4. Ask once ---------- */
// The agency, which knows who is eligible, on the right; the utility, which doesn't, on the left; the principle that spares the
// household from proving it, and the form it won't fill in. Then the agreement between them, which asks for the least: what goes
// (every account holder's matching details), what comes back (only the eligible, with a date), and what never does; and, below,
// when it starts: today, and for longer than the code
const D10_AG=[640,300,640,392],D10_ROWY=[498,582,666];
scene("once",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tK=c("knows"),tL=c("least"),tF=c("first"),tO=w("knows","Once only")-0.1,tAg=w("least","the agreement")-0.1;
  // when each line of the agreement is read, and when what it carries arrives
  const tGo=w("least","matching details")-0.2,tBack=w("least","eligible")-0.2,tNo=w("never","which support")-0.2,back=fin(t,tBack+1.3,0.5),[ax,ay,aw,ah]=D10_AG;
  // the camera: close on the two organisations; then back a little, for when it starts
  const cam=d10_camAt(t,[[0,960,470,1.04],[tF-1.2,960,540,1.0,1.8]]);cam.z*=1+0.012*Math.sin(Math.PI*clamp(t/sc.dur,0,1));
  ctx.save();d10_camApply(ctx,cam);
  // the two organisations, as in A direction: the agency lights as everyone's details reach it; the utility learns which, not why
  const ten=[...Array(10).keys()];
  arrive(ctx,1595,485,t,tK-0.1,()=>d10_org(ctx,1350,320,490,360,"the social services agency",BUS,{lit:ten.map(i=>D10_ELIG.includes(i)?1:0),hi:pulseAt(t,tGo+1.4,1.2)+pulseAt(t,tNo+0.9,1.0),say:"knows who is eligible"}),{dy:-14});
  arrive(ctx,325,485,t,tK+0.2,()=>d10_org(ctx,80,320,490,360,"the utility",D10_RET,{q:1-back,lit:ten.map(i=>D10_ELIG.includes(i)?fin(t,tBack+1.3+i*0.06,0.4):0),hi:pulseAt(t,tBack+1.4,1.2),
    say:back<0.5?"doesn't know which":"knows which, not why",sayA:Math.abs(1-2*back)}),{dy:-14});
  // the principle: once only, as in Tartu
  arrive(ctx,960,170,t,tO,()=>{d10_principle(ctx,560,60,800,"once only","don't make a household prove what the government already knows",{p:fin(t,w("knows","don't make")-0.2,0.6),hi:pulseAt(t,tO+0.3,1.4)});
    withA(ctx,fin(t,w("knows","as in Tartu")-0.1,0.4),()=>d10_tag(ctx,1336,112,"as in Tartu",MOT,{align:"right",size:28}));},{dy:-20});
  // the household, and the form it would have filled in, crossed out
  const hA=fin(t,w("knows","a household")-0.3,0.5)*(1-fin(t,tL-0.4,0.5));
  if(hA>0.01)withA(ctx,hA,()=>{d10_house(ctx,850,640,140,1,{});[[650,664,58],[700,666,64],[744,666,44]].forEach(([x,y,s_])=>d10_icon(ctx,x,y,s_,[255,236,206],1));
    arrive(ctx,1110,505,t,w("knows","prove")-0.2,()=>d10_form(ctx,960,340,300,330,{x:clamp((t-w("knows","already knows")+0.1)/0.9,0,1)}),{dy:-18,from:1.04});
    arrive(ctx,1110,716,t,w("knows","already knows")+0.6,()=>d10_tag(ctx,1110,716,"no forms",[255,170,150],{align:"center",size:30}),{dy:8});});
  // the flows, through the agreement: a stub from the side that sends, a light that crosses, and an arrow into the side that receives
  // (what never goes stops at the agreement's edge, in red)
  const flow=(i,dir,t0,col,stop)=>{if(t<t0)return;const fy=D10_ROWY[i]-10,x0=dir>0?570:1350,x1=dir>0?1350:570,e0=dir>0?ax:ax+aw,e1=dir>0?ax+aw:ax,q=clamp((t-t0)/1.5,0,1);
    d10_trace(ctx,[[x0,fy],[e0,fy]],clamp((t-t0)/0.3,0,1),col,{lw:3,a:0.85,nohead:1});
    if(stop){const sx=e0+6*dir,sa=fin(t,t0+0.35,0.3);withA(ctx,sa,()=>{ctx.save();ctx.strokeStyle=rgba(D10_RED,1);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(sx,fy-22);ctx.lineTo(sx,fy+22);ctx.stroke();ctx.restore();});
      const r=clamp((t-t0-0.35)/0.8,0,1);if(r>0&&r<1)ring(ctx,sx,fy,14+40*r,D10_RED,0.8*(1-r),3);return;}
    if(q>0.2)arrowTo(ctx,e1,fy,x1,fy,col,0.9,{p:clamp((q-0.2)/0.3,0,1),lw:3,head:12});
    if(q<1){const lx=lerp(x0,x1,ease(q));glow(ctx,lx,fy,46,col,0.75*Math.sin(Math.PI*q));}};
  // the agreement: a business object, owned by Ama; what goes, what comes back, and what never does
  arrive(ctx,960,490,t,tAg,()=>{glass(ctx,ax,ay,aw,ah,10,BUS,{glow:14+12*pulseAt(t,tAg+0.3,1.4),ea:0.85,fill:"rgba(12,12,6,0.95)"});ctx.fillStyle=rgba(BUS,0.09);rr(ctx,ax,ay,aw,ah,10);ctx.fill();
    archGlyph(ctx,"object",ax+aw-32,ay+38,13,BUS);T(ctx,"the agreement",ax+30,ay+64,{w:800,size:34,color:rgba(INK,0.97)});
    withA(ctx,fin(t,tAg+0.5,0.5),()=>d10_owner(ctx,ax+aw-62,ay+54,"Ama",1,{align:"right",hi:pulseAt(t,tAg+0.7,1.2)}));
    withA(ctx,fin(t,w("least","the least")-0.1,0.5),()=>T(ctx,"asks for the least",ax+30,ay+108,{w:700,size:28,color:rgba(BUS,0.95)}));
    [["goes","name · supply address",tGo],["comes back","eligible · from 1 July 2027",tBack],["never","which support",tNo]].forEach(([k,v,t0],i)=>{const yy=D10_ROWY[i],q=fin(t,t0,0.5);if(q<=0.01)return;
      withA(ctx,q,()=>{const red=i===2;T(ctx,k,ax+30,yy-40,{f:"mono",w:500,size:28,color:red?rgba(D10_RED,1):rgba(BUS,0.9)});T(ctx,v,ax+30,yy,{w:700,size:30,color:red?"rgba(255,206,196,0.85)":rgba(INK,0.96)});
        if(red){const sw=tw(ctx,v,30,700);ctx.save();ctx.strokeStyle=rgba(D10_RED,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(ax+24,yy-10);ctx.lineTo(ax+24+(sw+12)*ease(clamp((t-t0-0.5)/0.5,0,1)),yy-10);ctx.stroke();ctx.restore();}});});},{dy:-16});
  flow(0,1,tGo+0.2,INK);flow(1,-1,tBack+0.2,TRUST);flow(2,-1,tNo+0.1,D10_RED,1);
  // when it starts: the agreement today, for longer than the code
  d10_gantt(ctx,340,744,1240,t,[["the agreement",0,5.5,BUS,w("first","starts today")-0.2],["the code",3,6.5,APL,w("first","the code")-0.3]],fin(t,tF-0.1,0.6));
  ctx.restore();
  vign(ctx,S);});

/* ---------- 5. The wall holds ---------- */
// The network and retail, either side of the wall, as in Who does it, and where meaning changes: eligibility on retail's side, the
// network charge on the network's. Tomás's first draft, on paper, sends the list across the wall; Ama checks it against the
// principles and crosses it out. Then the decision record, with why, over retail's side, while the wall holds; and each principle,
// checked
const D10_ADR=[["decided","retail applies the whole discount; nothing new crosses the wall",88],["considered","send the list to the network, to take its part off the network charge",88],
  ["why","principle 3: customer information stays with the business that collected it",88],["decided by","Ama and the head of retail · November 2026",70],["status","accepted",60]];
scene("wall",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tD=c("draft"),tC=c("check"),tX=c("cross"),tDe=c("decide"),tS=c("same"),tLn=w("draft","the network too")-0.3,tOut=w("cross","crosses it out")-0.1,tRec=w("decide","decision")-0.2;
  ctx.save();drift(ctx,t,sc,{z:0.02,y:520});
  const rec=fin(t,tRec,0.6);d10_sides(ctx,{a:fin(t,0.2,0.8)});
  d10_wall(ctx,{a:fin(t,0.4,0.8),red:pulseAt(t,w("cross","cross the wall")-0.1,1.4)*0.9+fin(t,w("cross","cross the wall"),0.4)*(1-fin(t,tOut+0.8,0.8))*0.5,ry:516,hi:pulseAt(t,w("decide","nothing new")+0.2,1.6)+fin(t,w("decide","nothing new"),0.8)*0.3});
  // each side's element: the network charge, and eligibility, the list
  const nc=pulseAt(t,w("draft","network charge"),1.4);arrive(ctx,610,516,t,0.6,()=>d10_el(ctx,420,470,380,92,"network charge",INF,"object",{size:28,gs:13,hi:nc}),{dy:-12});
  arrive(ctx,1470,516,t,0.8,()=>withA(ctx,1-0.75*rec,()=>d10_el(ctx,1280,470,380,92,"eligibility",INF,"object",{size:28,gs:13,hi:pulseAt(t,w("draft","the list"),1.4)})),{dy:-12});
  // where retail would apply the discount, in billing, as walked down the map
  arrive(ctx,1470,692,t,1.0,()=>withA(ctx,1-rec,()=>{d10_trace(ctx,[[1470,562],[1470,650]],1,BUS,{lw:2.5,a:0.7,dash:[8,7],nohead:1});d10_el(ctx,1280,650,380,84,"apply the discount",BUS,"process",{size:28,gs:13});}),{dy:-12});
  // Tomás's draft: a note, and its line across the wall, in marker; crossed out in red
  const dr=1-0.7*fin(t,tOut+0.6,0.8),dl=clamp((t-tLn)/1.3,0,1);
  arrive(ctx,1440,300,t,tD+0.1,()=>withA(ctx,1-rec,()=>{sticky(ctx,1440,300,520,170,"Send the list to the "+d10_nb("network too."),{col:NOTEC[0],size:36,rot:-0.02,src:"Tomás · first draft"});
    marker(ctx,[[1210,300],[1680,296]],clamp((t-tOut-0.5)/0.6,0,1),{col:rgba(D10_RED,0.95),lw:7,seed:6});}),{dy:-24,from:1.05});
  if(dl>0)withA(ctx,dr*(1-rec*0.6),()=>{const pc=rgba(NOTEC[0],0.95);marker(ctx,[[1268,516],[1110,512],[960,518],[812,514]],dl,{col:pc,lw:6,seed:8});
    if(dl>=1)marker(ctx,[[836,494],[812,514],[838,536]],clamp((t-tLn-1.3)/0.25,0,1),{col:pc,lw:6,seed:9});
    withA(ctx,fin(t,tLn+0.6,0.5),()=>T(ctx,"the list",1110,484,{w:800,size:30,align:"center",color:pc}));});
  // Ama crosses it out where it would cross the wall
  const xp=clamp((t-tOut)/0.7,0,1);if(xp>0){marker(ctx,[[905,460],[1015,572]],clamp(xp*2,0,1),{col:rgba(D10_RED,0.98),lw:11,seed:3});marker(ctx,[[1015,460],[905,572]],clamp(xp*2-1,0,1),{col:rgba(D10_RED,0.98),lw:11,seed:4});}
  // the principles Ama checks it against: the third lights; then each is checked, for the decision
  const tTk=w("same","the principles")-0.2;
  arrive(ctx,490,290,t,tC+0.4,()=>d10_principles(ctx,80,150,820,{hi:[pulseAt(t,tTk,1.0)*0.8,pulseAt(t,tTk+0.35,1.0)*0.8,fin(t,w("check","third principle")-0.2,0.5)*(1-0.6*fin(t,tS,0.6))+pulseAt(t,tTk+0.7,1.0)*0.8],
    dim:0.5*(1-fin(t,tTk-0.4,0.6)),tick:[0,1,2].map(i=>fin(t,tTk+i*0.35,0.4))}),{dy:-16});
  // Ama, who checks it
  const ama=fin(t,tC-0.3,0.6),ex=t>w("check","checks")-0.1&&t<tOut+1.6?1:0;
  if(ama>0.01)withA(ctx,ama,()=>person(ctx,"ama",210,1030,0.78,{t,pose:ex?"explain":"stand",expr:t>w("cross","would cross")-0.2&&t<tDe?"concerned":"calm"}));
  // the decision, written down with why, over retail's side; the wall holds; checked against each principle
  arrive(ctx,1440,450,t,tRec,()=>{d10_adr(ctx,1000,170,880,"12 · the social tariff stays with retail",D10_ADR,{p:clamp((t-w("decide","written down"))/(w("decide","crosses the wall")+0.4-w("decide","written down")),0,1),
    hi:pulseAt(t,w("same","every time")-0.2,1.6)});
    kt_rstamp(ctx,1772,262,"checked",[112,78,196],fin(t,w("same","Checked")-0.1,0.3),clamp((t-w("same","Checked")+0.1)/0.4,0,1),{size:30,rot:-0.1});},{dy:-20,from:1.04});
  ctx.restore();
  vign(ctx,S);});

/* ---------- 6. New rules, with homes ---------- */
// A slice of the map, on the left: billing's new step, and eligibility, with its dates. On the right, the form every data rule is
// written in, as in Rules with a home: its labels first, home, owner and reason lit as they're named; then each rule, written in,
// and moved onto the map beside its home, joined by a realisation line; and, for the last, the catalogue, where a column mask lets
// the call centre see "on the social tariff", and nothing more
const D10_RULES=[["RUL-023","from the agency's date",["bills on the social tariff","the discount applies to every bill from the date the agency gives","head of retail","the direction","apply the discount","error, to the billing team"],[500,222],[420,272]],
 ["RUL-024","until the next match",["eligibility answers","an answer is kept only until the next match","Ama","the agreement","eligibility","error, to the data team"],[500,512],[420,602]],
 ["RUL-025","only billing reads it",["eligibility","only billing reads it; the call centre sees “on the social tariff”","head of retail","the agreement","eligibility","access refused, and logged"],[500,632],[420,610]]];
scene("rules",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tN=c("new"),tR=[c("r1"),c("r2"),c("r3")],tCat=w("r3","the call centre sees")-0.9;
  ctx.save();drift(ctx,t,sc,{z:0.015,y:480});
  // the map's slice: billing's new step in business, and eligibility in information
  const mA=fin(t,0.2,0.7);withA(ctx,mA,()=>{[[1,"business",BUS,150,240],[3,"information",INF,450,410]].forEach(([li,nm,col,y0,hh])=>{slab(ctx,60,y0,860,hh,nm,col,{label:false,sk:16,fill:0.1});d10_tag(ctx,72,y0-24,nm,col,{size:28});});
    d10_el(ctx,90,230,330,84,"apply the discount",BUS,"process",{size:28,gs:13,hi:pulseAt(t,w("r1","every bill"),1.4)});});
  arrive(ctx,255,602,t,0.5,()=>{d10_el(ctx,90,550,330,104,"",INF,"object",{size:28,gs:13,hi:pulseAt(t,w("new","Eligibility")+0.1,1.6)+pulseAt(t,tR[1]+1.0,1.2)+pulseAt(t,tR[2]+1.0,1.2)});
    T(ctx,"eligibility",247,596,{w:700,size:28,align:"center",color:rgba(INK,0.96)});T(ctx,"from · until",247,638,{f:"mono",w:500,size:28,align:"center",color:rgba(INF,1)});},{dy:-12});
  // the form: its labels, and home, owner and reason lit as they're named
  const gA=fin(t,w("new","new rules")-0.3,0.5)*(1-fin(t,tR[0]-0.3,0.4));
  d10_rule(ctx,960,200,900,"",null,{a:gA,ghost:1,lit:[0,0,fin(t,w("new","an owner")-0.1,0.3),fin(t,w("new","a reason")-0.1,0.3),fin(t,w("new","a home")-0.1,0.3),0]});
  // each rule: written into the form; then moved onto the map, beside its home
  D10_RULES.forEach(([id,nm,vals,[mx,my],[hx,hy]],k)=>{const t0=tR[k]-0.3,tGo=k<2?tR[k+1]-0.5:tCat,fl=ease(clamp((t-tGo)/1.2,0,1));if(t<t0)return;
    const ln=["r1","r2","r3"][k],rw=[w(ln,["The discount","An answer","only billing"][k])-0.2],rt=[rw[0],rw[0],w(ln,["every bill","kept only","reads it"][k])+0.2,w(ln,"Its reason")-0.1,w(ln,["every bill","kept only","reads it"][k])+0.5,w(ln,"Its reason")+0.6];
    if(k===2){rt[2]=rt[4]=w(ln,"only billing")+0.3;rt[3]=rt[5]=w(ln,"only billing")+0.7;}
    if(fl<1){const s_=lerp(1,380/900,fl),cx=lerp(960,mx,fl),cy=lerp(200,my,fl);ctx.save();ctx.translate(cx,cy);ctx.scale(s_,s_);ctx.translate(-960,-200);
      d10_rule(ctx,960,200,900,id,vals,{a:fin(t,t0,0.4)*(1-sstep(0.55,0.95,fl)),ra:rt.map(x=>fin(t,x,0.4))});ctx.restore();}
    const ma=sstep(0.6,1,fl);if(ma>0.01){d10_ruleMini(ctx,mx,my,380,id,nm,{a:ma,hi:pulseAt(t,tGo+1.2,1.2)});d10_realise(ctx,hx,hy,mx,my+46,MOT,clamp((t-tGo-1.0)/0.5,0,1),ma);}});
  // the catalogue: the call centre sees "on the social tariff", and nothing more
  arrive(ctx,1410,500,t,tCat+0.5,()=>d10_catalogue(ctx,960,200,900,t,{cc:fin(t,w("r3","the call centre sees")-0.2,0.5),yes:fin(t,w("r3","on the social tariff")-0.1,0.4),mask:fin(t,w("r3","nothing more")-0.1,0.4)}),{dy:-18,from:1.04});
  ctx.restore();
  vign(ctx,S);});

/* ---------- 7. Down to the counter ---------- */
// Where households meet it: the bill's new line, the letter and the call centre's answer. Then Farah, and who the match misses: a
// tenant the agency knows is eligible, in a home whose account is in the landlord's name, so the two sides never meet. Found now,
// they get a second route: an application, by December
scene("counter",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  const tDn=c("down"),tM=c("miss"),tRt=c("route"),tB=w("down","a line on the bill")-0.2,tLt=w("down","a letter")-0.2,tCc=w("down","call centre's")-0.2;
  ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  // the three, side by side; then up and smaller, for who they miss
  const up=ease(fin(t,tM-0.4,1.6)),sh=(cx,cy,f)=>{ctx.translate(cx,cy);ctx.scale(f,f);ctx.translate(-cx,-cy);};
  ctx.save();ctx.translate(0,lerp(0,-40,up));sh(960,0,lerp(1,0.6,up));
  const lit=(x,y,w_,h_,t0)=>{const q=pulseAt(t,t0+0.2,1.4);if(q>0.01)withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.9);ctx.lineWidth=4;ctx.shadowColor=rgba(TRUST,0.8);ctx.shadowBlur=18;rr(ctx,x-10,y-10,w_+20,h_+20,12);ctx.stroke();ctx.restore();});};
  arrive(ctx,370,420,t,tDn+0.1,()=>{lit(90,180,560,470,tB);d10_bill(ctx,90,180,560,470,{hi:pulseAt(t,tB+0.5,1.6)+fin(t,tB+0.5,0.6)*0.4});},{dy:-24,from:1.04});
  arrive(ctx,960,420,t,tDn+0.5,()=>{lit(710,190,500,420,tLt);d10_letter(ctx,710,190,500,420,{});},{dy:-24,from:1.04});
  arrive(ctx,1550,420,t,tDn+0.9,()=>{lit(1290,200,540,420,tCc);d10_call(ctx,1290,200,540,t,{q:fin(t,tCc+0.1,0.4),ans:fin(t,tCc+0.8,0.4)});},{dy:-24,from:1.04});
  withA(ctx,1-up,()=>{[[370,"a line on the bill",tB],[960,"a letter",tLt],[1560,"the call centre's answer",tCc]].forEach(([x,s_,t0])=>arrive(ctx,x,720,t,t0+0.3,()=>d10_tag(ctx,x,720,s_,[255,214,170],{align:"center",size:30}),{dy:8}));});
  ctx.restore();
  // who the match misses: the tenant the agency knows is eligible, and the account the utility holds, in the landlord's name
  const mA=fin(t,w("miss","tenants")-0.4,0.6),tK=w("miss","The agency knows"),tU=w("miss","the utility doesn't");
  const fd=1-0.75*fin(t,w("route","an application")-0.3,0.6);
  if(mA>0.01)withA(ctx,mA,()=>{const hx=820,hy=760;d10_house(ctx,hx,hy,230,1,{lit:pulseAt(t,tRt+0.6,1.6)*0.6+fin(t,tRt+0.6,0.6)*0.4});d10_icon(ctx,hx,hy-6,72,[255,236,206],1);
    d10_tag(ctx,hx,hy+40,"the tenant",[255,236,206],{align:"center",size:28});
    // the landlord, elsewhere, whose name is on the account
    withA(ctx,fd,()=>{d10_icon(ctx,1300,700,64,[200,200,214],1);d10_tag(ctx,1300,740,"the landlord",[200,200,214],{align:"center",size:28});});
    // the agency knows the tenant; the utility knows the landlord's account; the match looks for one in the other and finds no one
    d10_tag(ctx,420,470,"the agency: eligible",BUS,{align:"center",size:30});d10_trace(ctx,[[480,500],[760,650]],clamp((t-w("miss","tenants")+0.1)/0.6,0,1),BUS,{lw:3,a:0.9,dash:[9,7],nohead:1});
    withA(ctx,fd,()=>{d10_tag(ctx,1300,470,"the utility: account holder",D10_RET,{align:"center",size:30});d10_trace(ctx,[[1300,500],[1300,616]],clamp((t-w("miss","landlord's name")+0.1)/0.6,0,1),D10_RET,{lw:3,a:0.9,dash:[9,7],nohead:1});});
    const gq=fin(t,w("miss","landlord's name")+0.5,0.5)*fd;if(gq>0.01)withA(ctx,gq,()=>{d10_trace(ctx,[[600,470],[790,470]],1,[200,200,214],{lw:3,a:0.8,dash:[6,8],nohead:1});d10_trace(ctx,[[1130,470],[940,470]],1,[200,200,214],{lw:3,a:0.8,dash:[6,8],nohead:1});
      kt_rcross(ctx,865,470,20,1);T(ctx,"no match",865,430,{w:800,size:28,align:"center",color:rgba(D10_RED,1)});});
    withA(ctx,fin(t,tK,0.4),()=>kt_gtick(ctx,420+tw(ctx,"the agency: eligible",30,700)/2+40,470,16,1));
    withA(ctx,fin(t,tU,0.4)*(1-fin(t,tRt+0.4,0.5)),()=>T(ctx,"?",hx+70,hy-200,{w:800,size:56,align:"center",color:rgba(D10_RET,1)}));});
  // Farah, who asks
  const fA=fin(t,tM-0.4,0.6);if(fA>0.01)withA(ctx,fA,()=>d10_personR(ctx,"farah",1700,1030,0.78,{t,pose:t>w("miss","who the match")-0.2&&t<tRt-0.4?"explain":"stand",expr:t>w("miss","will miss")&&t<tRt?"concerned":"calm"}));
  // found now: a second route, an application, by December
  arrive(ctx,1290,590,t,w("route","an application")-0.3,()=>d10_apply(ctx,1090,400,460,380,{tick:fin(t,w("route","later in")+0.2,0.4)}),{dy:-24,from:1.05});
  arrive(ctx,1320,830,t,w("route","later in the year")-0.1,()=>d10_tag(ctx,1320,830,"by December 2027",D10_MIG,{align:"center",size:30}),{dy:8});
  arrive(ctx,470,700,t,w("route","Found now")-0.1,()=>d10_tag(ctx,470,700,"found now, not in the first bills",[170,245,190],{align:"center",size:30}),{dy:8});
  ctx.restore();
  vign(ctx,S);});

/* ---------- 8. Where the data lands ---------- */
// The bill's new line, carried from the counter, into the data product it comes from: accounts and bills, whose amount due now
// means something else. Its contract isn't changed in place: the new meaning stops at version 1's edge, and version 2 goes beside
// it, in dbt, with a date for version 1 to go. The catalogue's lineage finds everyone who reads version 1, and each owner is told
// first. Then the exchange with the agency, and its own contract, under the agreement: what goes, what comes back, and how often
// the contract in dbt, line by line: [text, its row before version 2, its row after, what it is]
const D10_YML=[["models:",0,0],["  - name: accounts_and_bills",1,1],["    latest_version: 2",2,2,"v2"],["    config:",2,3],["      contract: {enforced: true}",3,4,"contract"],["    versions:",4,5],
  ["      - v: 2",5,6,"v2"],["      - v: 1",5,7,"v1"],["        deprecation_date: 2027-09-30",6,8,"date"]];
const D10_GR=[150,240,170],D10_AMB=[255,190,120];
scene("lands",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tV=c("version"),tL=c("lineage"),tX=c("exchange");
  ctx.save();drift(ctx,t,sc,{z:0.015,y:480});
  // A. the bill, from the counter, its new line lit; it slides out as the contract comes in
  const mvB=easeCam(clamp((t-0.2)/1.6,0,1)),goA=fin(t,tV-0.9,0.6),bX=lerp(438,80,mvB)-60*goA,bY=lerp(68,256,mvB),bS=lerp(0.6,0.94,mvB),tLn=w("line","discount line")-0.2;
  if(goA<1)withA(ctx,1-goA,()=>{ctx.save();ctx.translate(bX,bY);ctx.scale(bS,bS);d10_bill(ctx,0,0,560,470,{hi:pulseAt(t,tLn,1.6)+fin(t,tLn,0.6)*0.5,deco:bS<0.93});ctx.restore();});
  // the product it comes from: accounts and bills, retail's, as Now the questions appear found it; up, for its versions
  const tP=w("line","the accounts")-0.3,mvP=easeCam(clamp((t-tV+1.0)/1.4,0,1)),goP=fin(t,tL-0.9,0.5),pX=lerp(720,80,mvP),pY=lerp(256,230,mvP),pW=lerp(1100,820,mvP);
  if(goP<1)arrive(ctx,pX+pW/2,pY+62,t,tP,()=>withA(ctx,1-goP,()=>{d10_product(ctx,pX,pY,pW,124,"accounts and bills","sell energy · serve customers",{hi:pulseAt(t,tP+0.6,1.4)});
    withA(ctx,fin(t,tP+0.5,0.5)*(1-mvP),()=>d10_owner(ctx,1820,426,"head of retail",1,{align:"right",hi:pulseAt(t,tP+0.8,1.2)}));}),{dy:-14});
  // the bill's new line flows into it
  if(goA<1){const P=[];for(let k=0;k<=20;k++){const f=k/20,g=1-f;P.push([g*g*g*594+3*g*g*f*660+3*g*f*f*650+f*f*f*716,g*g*g*517+3*g*g*f*517+3*g*f*f*322+f*f*f*322]);}d10_trace(ctx,P,clamp((t-tP-0.3)/0.7,0,1),TRUST,{lw:3.5,a:0.9*(1-goA)});}
  // what amount due means: what it was, struck out, and what it is now
  const tCh=w("line","changes")-0.3;arrive(ctx,1270,615,t,tCh,()=>d10_meaning(ctx,720,470,1100,{a:1-goA,strike:clamp((t-w("line","amount due")-0.1)/0.6,0,1),now:fin(t,w("line","means")-0.2,0.5)}),{dy:-14});

  // B. the contract, in dbt; version 1 as it is; the new meaning, stopped at its edge; version 2 beside it; a date for version 1
  const tK=w("version","contract")-0.2,tIP=w("version","in place")-0.3,tV2=w("version","Version two")-0.2,tV1=w("version","version one")-0.2,tDt=w("version","a date")-0.1,goB=fin(t,tL-0.9,0.5);
  const g2=ease(fin(t,tV2,0.6)),dd=fin(t,tDt,0.5);
  if(goB<1&&t>tV-1.4)withA(ctx,1-goB,()=>{
    arrive(ctx,1410,490,t,tK,()=>d10_yml(ctx,980,230,860,520,"accounts_and_bills.yml",D10_YML.map(([s,r0,r1,k])=>({s,at:lerp(r0,r1,g2),a:k==="v2"?g2:k==="date"?dd:1,
      hi:k==="contract"?pulseAt(t,tK+0.4,1.8):k==="v2"?pulseAt(t,tV2+0.3,1.6)+0.3*g2:k==="v1"?pulseAt(t,tV1+0.2,1.4):k==="date"?pulseAt(t,tDt+0.3,1.6)+0.3*dd:0,col:k==="v2"?D10_GR:k==="date"?D10_AMB:TRUST}))),{dy:-16});
    arrive(ctx,277,555,t,tV-0.3,()=>d10_ver(ctx,80,420,395,1,[["amount_due","before the discount"],["goes",d10_nb("30 September 2027"),D10_AMB,dd]],{hi:pulseAt(t,tV1+0.2,1.4)+pulseAt(t,tDt+0.2,1.4)}),{dy:-14});
    // the new meaning tries version 1, and stops at its edge
    const ch=fin(t,tIP-0.6,0.3)*(1-fin(t,tV2+0.2,0.4)),u=ease(clamp((t-tIP+0.6)/0.6,0,1)),bk=ease(clamp((t-tIP-0.1)/0.5,0,1)),cx=lerp(lerp(560,490,u),518,bk),cy=lerp(800,568,u);
    if(ch>0.01)withA(ctx,ch,()=>d10_tag(ctx,cx,cy,"after the discount",D10_GR,{size:28}));
    const sa=fin(t,tIP,0.25)*(1-fin(t,tV2+0.6,0.5));if(sa>0.01)withA(ctx,sa,()=>{ctx.save();ctx.strokeStyle=rgba(D10_RED,1);ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(482,538);ctx.lineTo(482,598);ctx.stroke();ctx.restore();});
    const r=clamp((t-tIP)/0.8,0,1);if(r>0&&r<1)ring(ctx,482,568,14+44*r,D10_RED,0.8*(1-r),3);
    withA(ctx,fin(t,tIP+0.1,0.4)*(1-fin(t,tV2+1.2,0.5)),()=>d10_tag(ctx,490,387,"not changed in place",D10_RED,{align:"center",size:28}));
    arrive(ctx,702,555,t,tV2,()=>d10_ver(ctx,505,420,395,2,[["amount_due","after the discount",D10_GR],["discount","its own column",D10_GR]],{badge:1,hi:pulseAt(t,tV2+0.4,1.4)}),{dy:-14});});

  // C. lineage, in the catalogue: everyone who reads version 1; each owner, told first
  const tE=[w("lineage","a measure")-0.2,w("lineage","a report")-0.2,w("lineage","collections")-0.3],tT=w("lineage","Each owner")-0.1,goC=fin(t,tX-0.9,0.5);
  if(goC<1&&t>tL-0.6)arrive(ctx,960,470,t,tL-0.5,()=>withA(ctx,1-goC,()=>{d10_lineage(ctx,80,150,1760,620,t,{e:tE.map(x=>clamp((t-x)/0.8,0,1)),draft:1});
    // lineage looks downstream from the table
    const sc_=clamp((t-w("lineage","finds")+0.1)/1.0,0,1);if(sc_>0&&sc_<1)ring(ctx,D10_LSRC[0]+D10_LSRC[2],D10_LSRC[1]+D10_LSRC[3]/2,16+90*sc_,[7,122,157],0.8*(1-sc_),3);
    D10_LIN.forEach(([,,cy,own],i)=>{const oa=fin(t,tE[i]+0.9,0.4),tt=tT+i*0.35,ar=clamp((t-tt)/0.9,0,1),ow=tw(ctx,own,28,700)+70;
      withA(ctx,oa,()=>d10_owner(ctx,1504,cy,own,1,{pre:"",hi:pulseAt(t,tt+0.9,1.2)}));
      if(ar>0&&ar<1){const[ex,ey]=ar<0.8?d10_linAt(i,ar/0.8):[lerp(D10_LNX,1504,(ar-0.8)/0.2),cy];d10_envelope(ctx,ex,ey-26,22,1);}
      withA(ctx,fin(t,tt+0.9,0.3),()=>kt_gtick(ctx,1504+ow+28,cy,15,1));});
    arrive(ctx,960,846,t,w("lineage","told first")-0.2,()=>d10_tag(ctx,960,846,"told before version 1 goes",TRUST,{align:"center",size:30}),{dy:8});}),{dy:-16,from:1.03});

  // D. the exchange with the agency, and its own contract, under the agreement: what goes, what comes back, and how often
  const xA=fin(t,tX-0.5,0.6),tXc=tX-0.1,tOwn=w("exchange","own contract")-0.2,tToo=w("exchange","too")-0.3,tGo=w("exchange","what goes")-0.1,tBk=w("exchange","comes back")-0.1,tOf=w("exchange","how often")-0.1,XC=[520,250,880,500],RY=[452,562,672];
  if(xA>0.01){
    arrive(ctx,245,500,t,tX-0.3,()=>d10_el(ctx,80,400,330,200,"the utility",D10_RET,"actor",{size:30,gs:14}),{dy:-14});
    arrive(ctx,1675,500,t,w("exchange","the agency")-0.2,()=>d10_el(ctx,1510,400,330,200,"the social services agency",BUS,"actor",{size:30,gs:14}),{dy:-14});
    // the agreement it serves, above, and the contract realising it
    arrive(ctx,960,142,t,tToo,()=>d10_el(ctx,800,100,320,84,"the agreement",BUS,"object",{size:28,gs:12,hi:pulseAt(t,tToo+0.3,1.2)}),{dy:-10});
    d10_realise(ctx,960,XC[1]-4,960,190,BUS,clamp((t-tToo-0.3)/0.5,0,1),1);
    const flow=(i,dir,t0,col)=>{if(t<t0)return;const fy=RY[i]-10,x0=dir>0?410:1510,x1=dir>0?1510:410,e0=dir>0?XC[0]:XC[0]+XC[2],e1=dir>0?XC[0]+XC[2]:XC[0],q=clamp((t-t0)/1.2,0,1);
      d10_trace(ctx,[[x0,fy],[e0,fy]],clamp((t-t0)/0.3,0,1),col,{lw:3,a:0.85,nohead:1});if(q>0.2)arrowTo(ctx,e1,fy,x1,fy,col,0.9,{p:clamp((q-0.2)/0.3,0,1),lw:3,head:12});
      if(q<1){const lx=lerp(x0,x1,ease(q));glow(ctx,lx,fy,46,col,0.75*Math.sin(Math.PI*q));}};
    arrive(ctx,960,500,t,tXc,()=>{const[x,y,w_,h]=XC;glass(ctx,x,y,w_,h,14,INF,{glow:14+12*pulseAt(t,tOwn+0.2,1.4),ea:0.85,fill:"rgba(12,10,14,0.95)"});ctx.fillStyle=rgba(INF,0.08);rr(ctx,x,y,w_,h,14);ctx.fill();
      archGlyph(ctx,"object",x+w_-34,y+36,13,INF);withA(ctx,fin(t,tOwn,0.4),()=>T(ctx,"data contract",x+30,y+52,{f:"mono",w:500,size:28,color:rgba(INF,1)}));T(ctx,"the exchange with the agency",x+30,y+104,{w:800,size:34,color:rgba(INK,0.97)});
      [["goes","account holder's name · supply address",tGo],["comes back","eligible, yes or no · from which date",tBk],["how often","every month",tOf]].forEach(([k,v,t0],i)=>{const q=fin(t,t0,0.5);if(q<=0.01)return;
        withA(ctx,q,()=>{T(ctx,k,x+30,RY[i]-40,{f:"mono",w:500,size:28,color:rgba(INF,0.95)});T(ctx,v,x+30,RY[i],{w:700,size:30,color:rgba(INK,0.96)});});});
      // every month: a turn of the year's wheel
      const oq=clamp((t-tOf)/1.2,0,1);if(oq>0){const ox=x+30+tw(ctx,"every month",30,700)+46,oy=RY[2]-10;ctx.save();ctx.strokeStyle=rgba(INF,0.95);ctx.lineWidth=3.5;ctx.lineCap="round";ctx.beginPath();ctx.arc(ox,oy,17,-Math.PI/2,-Math.PI/2+TAU*0.85*ease(oq));ctx.stroke();
        if(oq>=1){const an=-Math.PI/2+TAU*0.85;ctx.beginPath();ctx.moveTo(ox+Math.cos(an)*17-6,oy+Math.sin(an)*17-8);ctx.lineTo(ox+Math.cos(an)*17,oy+Math.sin(an)*17);ctx.lineTo(ox+Math.cos(an)*17+9,oy+Math.sin(an)*17-4);ctx.stroke();}ctx.restore();}},{dy:-16});
    flow(0,1,tGo+0.2,INK);flow(1,-1,tBk+0.2,TRUST);}
  ctx.restore();
  vign(ctx,S);});

/* ---------- 9. The path ---------- */
// The path, as Today, and where it's going draws one: plateaus in migration's pink, from today to 2028, joined in order, and the
// order lit in gold as its reason is named. Between each two plateaus, what changes from one to the next (ArchiMate 4 draws the
// difference as an assessment: the magnifying glass), filled in as the dates are read
const D10_PLAT=[["today",240],["1 July 2027",720],["December 2027",1200],["2028",1680]];
// what changes between plateau k and k+1: [its centre, [item, the words it's read at], the words its date is read at]
const D10_DIFF=[[480,[["the match","the match"],["the bills","the bills"],["the call centre's answer","call centre's"]],"first of July"],[960,[["the second route","second route"]],"By December"],
  [1440,[["the outcome, measured","the outcome"]],"Next year"]];
scene("path",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tOr=w("plateaus","in the order")-0.1,PY=250,AY=392;
  // the camera: close on the plateaus as they arrive; back, for what changes between them
  const cam=d10_camAt(t,[[0,960,330,1.06],[c("dates")-0.9,960,470,1.0,1.8]]);cam.z*=1+0.012*Math.sin(Math.PI*clamp(t/sc.dur,0,1));
  ctx.save();d10_camApply(ctx,cam);
  // the plateaus, and the path between them, lit in gold, in order
  D10_PLAT.forEach(([n,x],i)=>{const t0=0.5+i*0.3,hi=i>0?pulseAt(t,w("dates",D10_DIFF[i-1][2])-0.1,1.4)+0.25*fin(t,w("dates",D10_DIFF[i-1][2]),0.6):0;
    if(i>0){const q=fin(t,t0-0.1,0.5),g=fin(t,tOr+0.35*(i-1),0.5);if(q>0)arrowTo(ctx,D10_PLAT[i-1][1]+150,PY,x-150,PY,mix(D10_MIG,TRUST,g),0.85*q,{p:q,lw:3+1.5*g,head:12});
      if(g>0&&g<1)glow(ctx,(D10_PLAT[i-1][1]+x)/2,PY,50,TRUST,0.6*Math.sin(Math.PI*g));}
    arrive(ctx,x,PY,t,t0,()=>archEl(ctx,x-150,PY-48,300,96,n,D10_MIG,"plateau",{size:30,gs:13,hi}),{dy:-12});});
  // between each two: what changes, associated with the two plateaus it compares
  D10_DIFF.forEach(([x,items,wd],k)=>{const t0=w("dates",wd)-0.3,h=100+items.length*64,q=fin(t,t0+0.2,0.5);
    if(q>0)withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(MOT,0.7);ctx.lineWidth=2.5;ctx.setLineDash([3,6]);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x-120,AY);ctx.lineTo(D10_PLAT[k][1]+60,PY+48);ctx.moveTo(x+120,AY);ctx.lineTo(D10_PLAT[k+1][1]-60,PY+48);ctx.stroke();ctx.restore();});
    arrive(ctx,x,AY+h/2,t,t0,()=>{glass(ctx,x-210,AY,420,h,14,MOT,{glow:12+10*pulseAt(t,t0+0.3,1.2),ea:0.85,fill:"rgba(10,8,24,0.95)"});ctx.fillStyle=rgba(MOT,0.1);rr(ctx,x-210,AY,420,h,14);ctx.fill();
      archGlyph(ctx,"assessment",x+210-32,AY+36,13,MOT);T(ctx,"what changes",x-184,AY+52,{f:"mono",w:500,size:28,color:rgba(MOT,1)});
      items.forEach(([s_,iw],j)=>{const yy=AY+118+j*64,qi=fin(t,w("dates",iw)-0.25,0.4);withA(ctx,qi,()=>{ctx.save();ctx.translate(x-176,yy-10);ctx.rotate(Math.PI/4);ctx.fillStyle=rgba(D10_MIG,1);ctx.fillRect(-6,-6,12,12);ctx.restore();
        T(ctx,s_,x-152,yy,{w:700,size:28,color:rgba(INK,0.96)});});});},{dy:-14});});
  ctx.restore();
  arrive(ctx,960,130,t,w("plateaus","plateaus")-0.1,()=>tag(ctx,960,130,"plateaus: the steady states on the way",D10_MIG,{align:"center",size:30}),{dy:8});
  arrive(ctx,960,812,t,tOr+0.9,()=>tag(ctx,960,812,"the order: what depends on what",TRUST,{align:"center",size:30}),{dy:8});
  vign(ctx,S);});

/* ---------- 10. Answered in a day ---------- */
// The page the minister's office reads in the morning: what changes, who owns each change, what's ready by 1 July and what isn't,
// each row written as it's read. Then the page beside what an unmapped organisation would find instead, in production: the tenants
// left out, a report changed overnight, and the list sent across the wall
const D10_PAGE=[["what changes","a product, a step in billing, eligibility and its rules, an agreement, a secure exchange","what changes"],["who owns each","head of retail · Ama · IT · the agency","who owns"],
  ["ready by 1 July","the match · the bills · the call centre's answer","ready by July"],["not yet","the second route, by December · the outcome, measured, in 2028","what isn't"]];
const D10_PROD=["tenants left out of the first bills","a regulator's report, changed overnight","the list, sent across the wall"];
function d10_page(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const ink="rgba(40,38,40,0.96)",soft="rgba(96,86,76,0.95)",vw=w-330,L=D10_PAGE.map(r=>wrapT(ctx,r[1],0,0,vw,{deco:o.deco,size:30,w:700,measure:true})),hs=L.map(l=>l.length*40+34),h=190+hs.reduce((s,v)=>s+v,0)+30;
  withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.006:o.rot,plain:true});
    if(o.hi)withA(ctx,clamp(o.hi,0,1),()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(TRUST,0.8);ctx.shadowBlur=18;rr(ctx,x-8,y-8,w+16,h+16,10);ctx.stroke();ctx.restore();});
    T(ctx,"one page",x+40,y+56,{deco:o.deco,f:"mono",w:500,size:28,color:"rgba(150,60,60,0.95)"});T(ctx,"for the minister's office · the next morning",x+w-40,y+56,{deco:o.deco,f:"mono",w:500,size:28,align:"right",color:soft});
    T(ctx,"The social tariff: what it will take",x+40,y+122,{deco:o.deco,w:800,size:40,color:ink});ctx.fillStyle="rgba(96,86,76,0.35)";ctx.fillRect(x+40,y+150,w-80,2);
    let yy=y+202;D10_PAGE.forEach(([k],i)=>{const q=o.rows?clamp(o.rows[i]||0,0,1):1;if(q>0.01)withA(ctx,q,()=>{const col=i===2?"rgba(30,110,60,1)":i===3?"rgba(160,96,20,1)":"rgba(110,90,60,0.95)";
      T(ctx,k,x+40,yy,{deco:o.deco,w:800,size:28,color:col});if(i===2)tick_(ctx,x+40+tw(ctx,k,28,800)+26,yy-10,24,[30,110,60],1);L[i].forEach((l,j)=>T(ctx,l,x+300,yy+j*40,{deco:o.deco,w:700,size:30,color:ink}));});yy+=hs[i];});});return h;}
scene("page",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  const tPg=c("page"),tDy=c("day"),tUn=w("day","an unmapped")-0.2,mv=easeCam(clamp((t-tDy+0.7)/1.6,0,1));
  ctx.save();drift(ctx,t,sc,{z:0.02,y:470});
  // the page, its rows written as they're read; then to the left, answered in a day
  const rows=D10_PAGE.map(r=>fin(t,w("page",r[2])-0.2,0.5));
  ctx.save();const s_=lerp(1,0.64,mv);ctx.translate(lerp(960,540,mv),lerp(470,450,mv));ctx.scale(s_,s_);ctx.translate(-960,-470);
  arrive(ctx,960,470,t,0.3,()=>d10_page(ctx,300,160,1320,t,{rows,hi:pulseAt(t,w("day","in a day")-0.1,1.6),deco:s_<0.93}),{dy:-24,from:1.04});ctx.restore();
  withA(ctx,fin(t,w("day","in a day")-0.2,0.5),()=>{d10_tag(ctx,540,800,"mapped: answered in a day",TRUST,{align:"center",size:30});});
  // what an unmapped organisation finds instead, in production
  arrive(ctx,1460,470,t,tUn,()=>{glass(ctx,1070,250,780,440,18,D10_RED,{glow:16+10*pulseAt(t,tUn+0.3,1.4),ea:0.85,fill:"rgba(24,8,10,0.95)"});
    T(ctx,"found in production",1104,306,{f:"mono",w:500,size:28,color:rgba(D10_RED,1)});ctx.fillStyle=rgba(D10_RED,0.3);ctx.fillRect(1094,330,732,1.5);
    D10_PROD.forEach((s2,i)=>{const q=fin(t,w("day","finds out")+i*0.4,0.4);if(q<=0.01)return;withA(ctx,q,()=>{const yy=420+i*100;kt_rcross(ctx,1120,yy-10,16,1);wrapT(ctx,s2,1156,yy,670,{size:30,w:700,color:rgba(INK,0.95),lh:36});});});},{dy:-18});
  withA(ctx,fin(t,tUn+0.4,0.5),()=>d10_tag(ctx,1460,800,"unmapped: found out in production",D10_RED,{align:"center",size:30}));
  ctx.restore();
  eaYear(ctx,90,90,"November 2026",CLAY,fin(t,0.4,0.5)*(1-fin(t,tDy-0.6,0.5)));
  vign(ctx,S);});

/* ---------- 11. The first of July ---------- */
// A street of homes on the first of July: every home gets its bill, and the eligible ones carry the discount, about nine in ten of
// them without asking; the one the match missed waits for the second route. Then the measure Farah has asked for since 2024,
// confirmed by the head of retail, under the goal it lets them steer, while a few homes are marked as falling behind. Kenya, a few
// years on: phones everywhere, and money sent home in minutes. Then Tomás's note and its answer, beside what the walk produced:
// owners, rules and contracts, in order; the map that goes stale; and the next note
// the street: 12 homes a row, 6 rows; the eligible ones (the last, a tenant the match missed); the ones falling behind
const D10_ST=[...Array(72).keys()].map(k=>[365+(k%12)*110,300+Math.floor(k/12)*92]),D10_STE=[3,9,14,22,27,33,41,53,58,70],D10_STB=[6,19,30,50,67];
// what the walk produced: owners, rules and contracts, each column with its heading, at the word it's read at
const D10_OWN=["Ama","head of retail","IT","the agency"],D10_RMIN=[["RUL-023","from the agency's date"],["RUL-024","until the next match"],["RUL-025","only billing reads it"]];
const D10_ANS="It lands in every layer. Walked down the map, it's a list of owners, rules and contracts, in order.";
scene("july",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tB=c("bills"),tM=c("measure"),tK=c("kenya"),tA=c("answer"),tN=c("next");
  const aAB=1-fin(t,tK-0.9,0.8),kA=fin(t,tK-0.9,0.8)*(1-fin(t,tA-0.9,0.8)),wA=fin(t,tA-0.9,0.8);
  // A. the street on the first of July, then, smaller, on the left, for the measure
  if(aAB>0.01)withA(ctx,aAB,()=>{ctx.save();drift(ctx,t,sc,{z:0.02,y:520});
    const mvN=easeCam(clamp((t-tM+0.6)/1.6,0,1)),sN=lerp(1,0.62,mvN);ctx.save();ctx.translate(lerp(965,500,mvN),lerp(530,600,mvN));ctx.scale(sN,sN);ctx.translate(-965,-530);
    const tFb=w("bills","first bills")-0.2,tDs=w("bills","the discount")-0.2,tNn=w("bills","nine in ten")-0.2,tFB=w("measure","falling behind")-0.2;
    D10_ST.forEach(([hx,hy],k)=>{const col=k%12,row=Math.floor(k/12),a=fin(t,0.2+row*0.12+col*0.03,0.5),el=D10_STE.indexOf(k),miss=k===D10_STE[9];
      const lit=el>=0&&!miss?fin(t,tDs+el*0.06,0.5):0;d10_house(ctx,hx,hy,64,a,{lit,dim:miss?0.3*fin(t,tNn,0.5):0});
      if(el>=0&&!miss)withA(ctx,fin(t,tNn+el*0.05,0.3),()=>kt_gtick(ctx,hx+26,hy-56,10,1));
      // its bill, dropping in
      const q=clamp((t-tFb-col*0.06-row*0.04)/0.6,0,1);if(q>0&&q<1)d10_envelope(ctx,hx,lerp(hy-130,hy-30,ease(q)),16,Math.sin(Math.PI*q),el>=0&&!miss?[255,224,160]:[200,214,240]);
      if(miss){const r=fin(t,tNn+0.4,0.5);if(r>0)withA(ctx,r,()=>{ctx.save();ctx.strokeStyle=rgba(D10_MIG,0.95);ctx.lineWidth=3;ctx.setLineDash([7,6]);ctx.beginPath();ctx.arc(hx,hy-26,50,0,TAU);ctx.stroke();ctx.restore();});}
      // falling behind: an amber mark over the home
      const fb=D10_STB.indexOf(k);if(fb>=0){const f=fin(t,tFB+fb*0.12,0.4);if(f>0.01)withA(ctx,f,()=>{glow(ctx,hx,hy-80,26,[255,190,90],0.6);ctx.fillStyle=rgba([255,190,90],1);ctx.beginPath();ctx.moveTo(hx,hy-98);ctx.lineTo(hx+13,hy-74);ctx.lineTo(hx-13,hy-74);ctx.closePath();ctx.fill();});}});
    ctx.restore();ctx.restore();
    withA(ctx,1-mvN,()=>{arrive(ctx,960,170,t,w("bills","nine in ten")-0.1,()=>d10_tag(ctx,960,170,"about 9 in 10 eligible homes, without asking",TRUST,{align:"center",size:30}),{dy:8});
      const[mx,my]=[365+(D10_STE[9]%12)*110,300+Math.floor(D10_STE[9]/12)*92];arrive(ctx,mx-60,my+66,t,tNn+0.7,()=>d10_tag(ctx,mx-60,my+66,"the rest: the second route",D10_MIG,{align:"center",size:28}),{dy:8});});
    // the measure Farah has asked for since 2024, confirmed; under the goal it lets them steer
    const tCf=w("measure","confirms")-0.1,g=fin(t,tCf,0.8),tGl=w("measure","the goal")-0.3,tYr=w("measure","since 2024")-0.2;
    arrive(ctx,1340,330,t,tGl,()=>d10_el(ctx,1080,280,520,96,"keep bills affordable",MOT,"goal",{size:30,gs:14,hi:pulseAt(t,tGl+0.4,1.6)}),{dy:-12});
    if(t>tGl)d10_trace(ctx,[[1340,376],[1340,436]],clamp((t-tGl-0.3)/0.5,0,1),MOT,{lw:3,a:0.85,dash:[8,7],nohead:1});
    arrive(ctx,1340,510,t,tM-0.2,()=>{sticky(ctx,1340,510,560,140,"households falling behind",{col:NOTEC[0],edge:INF,glass:g,size:34,rot:0,st:0.5+0.5*g});
      withA(ctx,g,()=>d10_glyph(ctx,"measure",1340+250,510-40,16,INF,0.35+0.4*ease(clamp((t-tGl-0.2)/1.6,0,1))));},{dy:-16});
    withA(ctx,fin(t,tCf+0.6,0.5),()=>{kt_gtick(ctx,1110,622,18,1);T(ctx,"confirmed · head of retail",1140,632,{w:700,size:28,color:rgba(TRUST,1)});});
    ["2024","2025","2026","2027"].forEach((y_,k)=>withA(ctx,fin(t,tYr+k*0.25,0.3),()=>{const x=1130+k*120,last=k===3;T(ctx,y_,x,700,{f:"mono",w:500,size:28,color:last?rgba(TRUST,1):"rgba(255,200,214,0.95)"});if(last)kt_gtick(ctx,x+86,690,12,fin(t,tCf+0.9,0.3));}));
    const fA=fin(t,tM-0.4,0.6);if(fA>0.01)withA(ctx,fA*(1-fin(t,tK-1.0,0.5)),()=>d10_personR(ctx,"farah",1790,1030,0.74,{t,pose:t>tYr-0.3&&t<tYr+2.0?"explain":"stand",expr:t>tCf+0.4?"relieved":"calm"}));});
  eaYear(ctx,90,90,"1 July 2027",CLAY,fin(t,0.4,0.5)*(1-fin(t,tK-1.0,0.5)));
  // C. Kenya, a few years on: phones everywhere, and money sent home in minutes
  if(kA>0.01)withA(ctx,kA,()=>{const cam=d10_camAt(t,[[tK-0.9,960,560,0.95],[tK+1.4,D10_MID[0],D10_MID[1]-10,1.7,4.6]]);cam.z*=1+0.02*ease(clamp((t-tK)/8,0,1));const k=1/cam.z;
    ctx.save();d10_camApply(ctx,cam);d10_map(ctx,t,cam,{labs:fin(t,tK-0.6,0.6)*(1-fin(t,tK+1.8,1.0)),many:clamp((t-w("kenya","within")+0.2)/3.4,0,1),road:0});
    d10_icon(ctx,D10_NAI[0]+22*k,D10_NAI[1]+12*k,34*k,[255,236,206],fin(t,tK+1.4,0.5));D10_FAM.forEach(([dx,dy,s_],j)=>d10_icon(ctx,D10_UP[0]+dx*k,D10_UP[1]+dy*k,s_*k,[255,236,206],fin(t,tK+1.6+j*0.1,0.5)));ctx.restore();
    const tSn=w("kenya","money sent home")-0.3,[nx,ny]=d10_toS(cam,D10_NAI[0],D10_NAI[1]),[ux,uy]=d10_toS(cam,D10_UP[0],D10_UP[1]);
    if(t>tSn){const P=[];for(let i=0;i<=20;i++){const f=i/20;P.push([lerp(nx,ux,f),lerp(ny,uy,f)-Math.sin(Math.PI*f)*120]);}const q=clamp((t-tSn)/1.0,0,1);d10_trace(ctx,P,q,D10_SIG,{lw:3.5,a:1-fin(t,tSn+2.4,0.8)});
      const r=clamp((t-tSn-1.0)/1.0,0,1);if(r>0&&r<1)ring(ctx,ux,uy,16+70*r,D10_SIG,0.9*(1-r),3);}
    arrive(ctx,ux-30,uy+70,t,w("kenya","in minutes")-0.2,()=>d10_tag(ctx,ux-30,uy+70,"money home, in minutes",D10_SIG,{align:"center",size:30}),{dy:8});
    eaYear(ctx,90,90,"Kenya · 2011",CLAY,fin(t,tK-0.4,0.5));});
  // D. Tomás's note, and its answer, beside what the walk produced: owners, rules and contracts, in order
  if(wA>0.01)withA(ctx,wA,()=>{wallBg(ctx,S,t);ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
    const tO=w("answer","owners")-0.2,tR=w("answer","rules")-0.2,tC=w("answer","contracts")-0.2,tIo=w("answer","in order")-0.2,st=1-0.45*fin(t,w("next","goes stale")-0.3,1.2);
    person(ctx,"tomas",170,1030,0.78,{t,pose:t>tA&&t<tA+2.6?"explain":"stand"});
    withA(ctx,st,()=>{
      [["owners",TRUST,420,tO],["rules",MOT,700,tR],["contracts",INF,1040,tC]].forEach(([h,col,x,t0])=>withA(ctx,fin(t,t0,0.4),()=>T(ctx,h,x,190,{f:"mono",w:500,size:28,color:rgba(col,1)})));
      D10_OWN.forEach((o_,i)=>arrive(ctx,420+110,260+i*92,t,tO+0.15*i,()=>d10_owner(ctx,420,260+i*92,o_,1,{pre:"",hi:pulseAt(t,tIo+0.1,1.2)}),{dy:-10}));
      D10_RMIN.forEach(([id,nm],i)=>arrive(ctx,700+170,214+i*112+46,t,tR+0.15*i,()=>d10_ruleMini(ctx,700,214+i*112,340,id,nm,{hi:pulseAt(t,tIo+0.3,1.2)}),{dy:-10}));
      [["accounts and bills · v2","product"],["the exchange · monthly","object"]].forEach(([nm,kind],i)=>arrive(ctx,1040+150,214+i*112+46,t,tC+0.15*i,()=>d10_el(ctx,1040,214+i*112,300,92,nm,INF,kind,{size:28,gs:12,hi:pulseAt(t,tIo+0.5,1.2)}),{dy:-10}));
      // in order: the path's plateaus, small, under them
      D10_PLAT.forEach(([n,_],i)=>{const x=440+i*235,q=fin(t,tIo+i*0.2,0.4);if(q<=0.01)return;withA(ctx,q,()=>{if(i>0)arrowTo(ctx,x-235+90,610,x-90,610,TRUST,0.85,{p:1,lw:3,head:10});archEl(ctx,x-90,566,180,88,n,D10_MIG,"plateau",{size:28,gs:11});});});});
    // the note, and its answer
    arrive(ctx,1560,190,t,tA-0.6,()=>sticky(ctx,1560,190,560,170,"What does a change in strategy mean for the data?",{col:NOTEC[0],size:34,st:0.5*fin(t,tA+1.4,0.5),rot:-0.025}),{dy:-20});
    arrive(ctx,1570,500,t,w("answer","has an answer")-0.1,()=>sticky(ctx,1570,500,580,300,D10_ANS,{col:NOTEC[0],size:32,p:clamp((t-w("answer","an answer"))/(tIo+0.6-w("answer","an answer")),0,1),rot:0.015}),{dy:-30,from:1.06});
    // a map used every week goes stale: the next note
    withA(ctx,fin(t,w("next","goes stale")-0.2,0.8)*0.5,()=>{ctx.fillStyle="rgba(60,52,40,0.35)";ctx.fillRect(380,150,1000,560);});
    arrive(ctx,1560,770,t,w("next","Next")-0.1,()=>sticky(ctx,1560,770,480,130,"How do we keep the map alive?",{col:NOTEC[0],size:32,st:0,rot:0.03}),{dy:-30,from:1.06});
    const dn=pulseAt(t,B+0.2,1.6);if(dn>0)glow(ctx,1570,500,320,EAC,0.2*dn);
    ctx.restore();});
  vign(ctx,S);
  eaEnd(ctx,S,t,B+0.8,"When strategy moves",EAC,"A change in strategy lands in every layer: walk it down, in order.","Film 10 of 11");});
