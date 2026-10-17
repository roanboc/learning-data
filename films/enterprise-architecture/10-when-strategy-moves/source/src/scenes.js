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
