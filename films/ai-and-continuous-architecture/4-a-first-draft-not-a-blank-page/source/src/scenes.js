/* ===== A first draft, not a blank page: scenes =====
   Eight chapters, as in ../script.md. Babylon, about 620 BCE: Nabopolassar's workmen clear the ruin of Etemenanki down to its
   foundation; a god's house belonged where the gods had set it, and a mistake laid in millions of bricks couldn't be moved; his
   specialists inspect the foundation and measure the site; the form, a stepped tower with a temple on top, was well over a thousand
   years old, as at Ur; the gods are asked to confirm the place, the foundation is set "on its original socle", and the tower rises on
   the exact spot. Then the utility: the government asks for community batteries in twelve weeks; the street at noon; the last new
   service's workshops, eight months from a blank page; the map agent's first draft, from the industry's reference models and the
   utility's own documents; where each element came from and who confirms it; what's wrong (a step across the wall between the
   network and retail) and what's missing (switching the battery off before crews work); only what the owners confirm; back to the
   old foundation; and the answer.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: every shot
   drifts slowly, things arrive with a spring, and in one room the camera glides on and never cuts. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. An old foundation ---------- */
// Babylon's precinct at dawn: the ruin cleared down to its foundation, the tower as it belonged, a mistake that couldn't be moved,
// the specialists, the form on clay and Ur on a map, the king at the foundation, and the tower rising on it; then the present, in the
// same chapter, as the whole picture changes
const A4_BY=772,A4_S=5.2;
// the present, at the opening's end: what the industry already knows and what the utility already has, a new service between them,
// not built, and the people who decide
function a4_now(ctx,t,c,w){const tK=w("now","industry already knows")-0.3,tH=w("now","utility already has")-0.3,tS=c("now")+0.3,tP=w("confirm","the people who decide")-0.3,tC=w("confirm","confirm it");
  const sA=fin(t,tS,0.8);if(sA>0.01)arrive(ctx,960,455,t,tS,()=>{ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle=rgba(KT_AI,0.85);ctx.lineWidth=3;rr(ctx,760,330,400,250,24);ctx.stroke();ctx.restore();
    ctx.fillStyle=rgba(KT_AI,0.05);rr(ctx,760,330,400,250,24);ctx.fill();T(ctx,"a new service",960,466,{w:800,size:32,align:"center",color:rgba(KT_AI,1)});},{dy:10,a:sA});
  // what the industry already knows: its reference models, in glass
  const kA=fin(t,tK,0.7);if(kA>0.01){arrive(ctx,390,455,t,tK,()=>{[2,1,0].forEach(i=>{const x=230+i*22,y=380-i*22;glass(ctx,x,y,320,150,16,EAC,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.95)"});});
      T(ctx,"reference",390,452,{w:800,size:30,align:"center",color:rgba(EAC,1)});T(ctx,"models",390,490,{w:800,size:30,align:"center",color:rgba(EAC,1)});},{dy:10,a:kA});
    withA(ctx,kA,()=>tag(ctx,390,250,"what the industry knows",EAC,{align:"center",size:28}));a4_flow(ctx,592,455,754,455,t,EAC,kA*sA,{lift:10});}
  // what the utility already has: its own documents, and its map
  const hA=fin(t,tH,0.7);if(hA>0.01){arrive(ctx,1540,455,t,tH,()=>{a4_doc(ctx,1450,450,0.9,"");a4_doc(ctx,1540,430,0.9,"");a4_doc(ctx,1630,450,0.9,"");},{dy:10,a:hA});
    withA(ctx,hA,()=>tag(ctx,1540,250,"what the utility has",[226,218,200],{align:"center",size:28}));a4_flow(ctx,1388,455,1166,455,t,[226,218,200],hA*sA,{lift:10});}
  // nothing built until the people who decide confirm it
  const pA=fin(t,tP,0.7);if(pA>0.01)arrive(ctx,960,680,t,tP,()=>{kt_gtick(ctx,820,670,15,1);T(ctx,"the people who decide",848,681,{w:800,size:30,color:rgba(BIZ,1)});},{dy:8,a:pA});
  const cA=fin(t,tC,0.6);if(cA>0.01){withA(ctx,cA,()=>{ctx.save();ctx.strokeStyle=rgba(BIZ,0.7);ctx.lineWidth=2.4;ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(960,640);ctx.lineTo(960,586);ctx.stroke();ctx.restore();});kt_gtick(ctx,1160,330,16,cA);}}
scene("found",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tNow=c("now"),past=1-fin(t,tNow-0.3,1.3);
  if(past<0.999){setScreen(ctx,S);bg2(ctx);motes(ctx,t);ctx.save();drift(ctx,t-tNow+0.3,{dur:sc.dur-tNow},{z:0.02,y:480});withA(ctx,1-fin(t,B+1.0,0.8),()=>a4_now(ctx,t,c,w));ctx.restore();vign(ctx,S);}
  a4_fade(ctx,past,cx=>{setScreen(cx,S);cx.save();
    const tBe=c("belong"),tFi=c("fixed"),tNe=c("need"),tIn=c("inspect"),tFo=c("form"),tUr=c("ur"),tGo=c("gods"),tSo=c("socle"),tRo=c("rose"),tHo=c("home"),tCl=w("city","cleared what");
    // the light: before dawn as the ruin is cleared, dawn as the king sets the foundation, a hazy morning when the tower stands
    const dawn=0.3+0.38*fin(t,tIn,9)+0.32*fin(t,tRo,5),day=0.5*fin(t,tRo+1.2,5);
    const ruin=1-fin(t,tCl-0.2,4.5),m=3+87*easeCam(clamp((t-tRo-0.3)/5.6,0,1));
    const K=[[0,960,650,1.12],[tCl-0.4,960,730,1.5],[tBe-0.3,960,560,1.0],[tFi-0.2,1040,580,0.98],[tNe-0.2,960,700,1.3],[tIn-0.4,960,740,1.45],[tGo-0.4,900,720,1.5],[tSo-0.2,960,700,1.28],[tRo-0.6,960,560,0.98],[tHo+0.4,960,540,1.0]];
    focus(cx,t,K,1.8);
    bab_sky(cx,t,{dawn,day});bab_city(cx,t,{dawn,day});bab_ground(cx,t,{dawn,day});
    // the measuring ropes, pegged round the foundation, and the line of what was measured
    const rp=clamp((t-w("inspect","inspected")+0.2)/2.4,0,1),rO=1-fin(t,tRo-0.4,1.0),FL=[694,A4_BY+8],FR=[1226,A4_BY+8],BR=[1184,A4_BY-26],BL=[736,A4_BY-26];
    if(rp>0)bab_rope(cx,[FL,FR,BR,BL,FL],rp,{a:0.85*rO,lw:1.6});
    // the tower: its ruin cleared down to the foundation, then rising on it
    bab_tower(cx,960,A4_BY,A4_S,{m,ruin,dawn,day,hi:fin(t,w("home","house"),1.6)});
    // the god's house as it belonged, on its old foundation; then a mistake: the same tower off its place
    const gB=fin(t,w("belong","a god's house")-0.2,1.0),sh=easeCam(clamp((t-w("fixed","A mistake"))/1.6,0,1)),gO=1-fin(t,tIn-0.4,0.8);
    a4_outline(cx,960+170*sh,A4_BY,A4_S,mix(ACA,ACA_WARN,sh),gB*gO);
    a4_footLine(cx,960,A4_BY,A4_S,ACA,fin(t,w("belong","old foundation")-0.2,0.6)*(1-fin(t,tFi+0.6,0.8))+0.8*fin(t,w("need","exactly where")-0.2,0.6)*(1-fin(t,tIn,0.8)));
    // the people of Babylon who see it
    const pA=fin(t,tBe-0.2,1.0)*(1-fin(t,tFi-0.2,0.9))+fin(t,tHo-0.4,1.0)*(1-fin(t,tNow-0.6,0.8)),rim=0.35+0.4*dawn;
    a4_fade(cx,pA,c2=>{bab_folk(c2,520,894,190,"stand",t,{dir:1,veil:true,rim});bab_folk(c2,598,900,202,"stand",t,{dir:1,rim});});
    // the workmen, carrying the ruin away
    const wA=fin(t,1.6,1.0)*(1-fin(t,tFi-0.6,0.9));if(wA>0.01)for(let i=0;i<4;i++){const x=1000-((t*32+i*215)%860);a4_folk(cx,x,812+i*6,94-i*4,"carry",t,{a:wA*clamp((x-150)/120,0,1)*clamp((1000-x)/60,0,1),dir:-1,step:t*4.4+i*1.7,rim});}
    // the work on the tower as it rises: tiny figures carrying up the stair and along the terraces
    if(t>tRo+0.3&&m>6)a4_fade(cx,fin(t,tRo+0.3,1.0)*(1-fin(t,tNow-0.6,0.8)),c2=>{const n=Math.min(30,Math.floor(m*0.5));for(let i=0;i<n;i++){const u=(t*0.03+hash(i,901))%1,st=i%3,yy=A4_BY-Math.min(m,st===0?33*u:12+u*(m-12))*A4_S,xx=st===0?960+(hash(i,902)-0.5)*30:960+(hash(i,903)-0.5)*BAB_T[Math.min(6,Math.floor(u*4))][0]*A4_S*0.9;
      if(A4_BY-yy>m*A4_S)continue;bab_folk(c2,xx,yy,9,"carry",t,{col:[26,18,14],rim:0.3,step:t*6+i,dir:hash(i,904)>0.5?1:-1});}});
    // the specialists: one with the measuring rod, one with the rope
    const sA=fin(t,tIn-0.3,0.9)*(1-fin(t,tGo-0.6,0.9));
    if(sA>0.01){const hd=a4_fade(cx,sA,c2=>{bab_folk(c2,560,918,226,"rod",t,{dir:1,rim});return bab_folk(c2,1360,922,222,"rope",t,{dir:-1,rim});});if(hd)withA(cx,sA,()=>bab_rope(cx,[hd,FR],clamp((t-w("inspect","inspected"))/1.4,0,1),{lw:2.4}));}
    const mA=fin(t,w("inspect","measured")-0.2,0.8)*(1-fin(t,tGo-0.6,0.8))+fin(t,w("rose","ninety metres")-0.4,0.8)*(1-fin(t,tHo+1.4,0.8));
    if(mA>0.01)withA(cx,mA,()=>{cx.save();cx.strokeStyle=rgba(BAB_CLAY,0.95);cx.lineWidth=2.4;cx.beginPath();cx.moveTo(722,A4_BY+30);cx.lineTo(1198,A4_BY+30);cx.moveTo(722,A4_BY+18);cx.lineTo(722,A4_BY+42);cx.moveTo(1198,A4_BY+18);cx.lineTo(1198,A4_BY+42);cx.stroke();cx.restore();
      const a90=fin(t,w("rose","ninety metres")-0.4,0.8);if(a90>0.01)withA(cx,a90,()=>T(cx,"about 90 m",960,A4_BY+78,{w:800,size:30,align:"center",color:rgba(BAB_CLAY,1)}));});
    // the king and his diviner at the foundation; the place confirmed; the first brick set on the old socle
    const kA=fin(t,tGo-0.4,1.0)*(1-fin(t,tRo+0.4,1.0));
    a4_fade(cx,kA,c2=>{bab_folk(c2,700,886,222,"stand",t,{dir:1,rim});bab_folk(c2,830,884,236,"stand",t,{king:true,dir:1,rim});});
    a4_footLine(cx,960,A4_BY,A4_S,BIZ,fin(t,w("gods","confirm")-0.2,0.8)*(1-fin(t,tRo+0.6,1.0)));
    const bk=w("socle","set its foundation")-0.2;if(t>bk)arrive(cx,960,A4_BY-3*A4_S-10,t,bk,()=>bab_brick(cx,960,A4_BY-3*A4_S-10,26,{stamp:1}),{dy:-30,a:fin(t,bk,0.5)*(1-fin(t,tRo+0.6,0.8))});
    // the tower rising on the exact spot: the form over it, aligned
    a4_outline(cx,960,A4_BY,A4_S,ACA,fin(t,w("rose","exact spot")-0.3,0.8)*(1-fin(t,tHo+0.6,1.2)));
    cx.restore();
    // what the narration names, in screen space so it reads on a phone
    eaYear(cx,80,80,"Babylon · about 620 BCE",ACA,fin(t,0.6,0.8)*(1-fin(t,tBe-0.4,0.6)));
    bab_tag(cx,960,214,"Etemenanki, Babylon's temple-tower",fin(t,w("city","temple-tower")-0.2,0.7)*(1-fin(t,w("city","down to its foundation")-0.4,0.6)));
    bab_tag(cx,960,214,"cleared down to its foundation",fin(t,w("city","down to its foundation")+0.25,0.6)*(1-fin(t,tBe-0.4,0.6)));
    bab_tag(cx,620,214,"on its old foundation",fin(t,w("belong","old foundation")-0.2,0.7)*(1-fin(t,tFi-0.3,0.6)));
    bab_tag(cx,1300,214,"to its old measures",fin(t,w("belong","old measures")-0.2,0.7)*(1-fin(t,tFi-0.3,0.6)));
    bab_tag(cx,960,214,"laid into millions of bricks, by hand",fin(t,w("fixed","millions of bricks")-0.3,0.7)*(1-fin(t,w("fixed","couldn't be moved")-0.4,0.6)));
    bab_tag(cx,960,214,"no moving it once the tower rose",fin(t,w("fixed","couldn't be moved")+0.25,0.6)*(1-fin(t,tNe-0.3,0.6)));
    bab_tag(cx,620,214,"exactly where it stood?",fin(t,w("need","exactly where")-0.3,0.7)*(1-fin(t,tIn-0.3,0.6)),{col:ACA_WARN});
    bab_tag(cx,1300,214,"how big it was?",fin(t,w("need","how big")-0.3,0.7)*(1-fin(t,tIn-0.3,0.6)),{col:ACA_WARN});
    bab_tag(cx,960,214,"specialists inspect it, and measure the site",fin(t,w("inspect","inspected")-0.3,0.7)*(1-fin(t,tFo-0.5,0.6)));
    // the form, on clay, and Ur, on a map
    const dim=0.72*fin(t,tFo-0.4,0.8)*(1-fin(t,tGo-0.6,0.8));if(dim>0.01){cx.fillStyle="rgba(8,6,6,"+dim+")";cx.fillRect(0,0,W,H);}
    const cA=fin(t,tFo-0.1,0.7)*(1-fin(t,tGo-0.6,0.6));
    if(cA>0.01){arrive(cx,540,440,t,tFo-0.1,()=>a4_formCard(cx,230,160,620,560,t,{p:clamp((t-w("form","A stepped tower")+0.2)/1.8,0,1),lab:fin(t,w("form","stepped tower of brick")-0.2,0.6),temple:fin(t,w("form","temple on top")-0.2,0.6)}),{dy:-14,a:cA});
      bab_tag(cx,540,800,"built in this land for over a thousand years",fin(t,w("form","over a thousand years")-0.3,0.7)*cA);
      const uA=fin(t,tUr-0.3,0.7);if(uA>0.01)arrive(cx,1380,440,t,tUr-0.3,()=>a4_map(cx,1070,160,620,560,{ba:fin(t,tUr,0.8)*0.5,ur:fin(t,w("ur","At Ur")+0.2,1.0)}),{dy:-14,a:uA*cA});
      bab_tag(cx,1380,800,"part of one, built 4,000 years ago, still stands",fin(t,w("ur","still stands")-0.5,0.7)*cA);}
    bab_tag(cx,960,214,"asked of the gods, through divination",fin(t,w("gods","asked the gods")-0.2,0.7)*(1-fin(t,w("gods","to confirm")-0.4,0.6)));
    bab_tag(cx,960,214,"the place and its measures, confirmed",fin(t,w("gods","to confirm")+0.25,0.6)*(1-fin(t,tSo-0.3,0.6)),{col:BIZ});
    bab_quote(cx,1040,120,780,"on its original socle","Nabopolassar, in his own words",{a:fin(t,w("socle","in his words")-0.2,0.8)*(1-fin(t,tRo-0.3,0.7)),size:40});
    bab_tag(cx,960,214,"on the exact spot, to the same measures",fin(t,w("rose","exact spot")-0.3,0.7)*(1-fin(t,tHo-0.3,0.6)));
    bab_tag(cx,960,214,"their god's house, where they believed it belonged",fin(t,w("home","house")-0.2,0.7)*(1-fin(t,tNow-0.6,0.6)));
  });
  acaTitle(ctx,S,t,B+1.0,"A first draft, not a blank page","start from what exists; keep only what's confirmed","Film 4 of 6 · AI and continuous architecture");});

/* ---------- 2. What do you do? ---------- */
// a person's name, over their head: at the left of the frame or (right) at the right
function a4_name(ctx,s,a,right){if(a>0.01)withA(ctx,a,()=>tag(ctx,right?1880-tw(ctx,s,28,700)-26:40,606,s,BIZ,{size:28}));}
// Tomás and the government's request; the street at noon, its voltage, its panels turned down; Farah; a community battery; what a
// design holds; the last new service's workshops, eight months long; and twelve weeks, with something to react to
scene("ask",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tNo=c("noon"),tD=c("down"),tF=c("farah"),tBa=c("battery"),tDe=c("design"),tL=c("last"),tSt=c("stalled"),tNe=c("need"),tPn=w("need","People need");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  // Tomás, and the request from the government that owns the utility
  const g1=1-fin(t,tNo-0.7,0.7);
  a4_who(ctx,"tomas",200,fin(t,0.3,0.8)*g1,t,{expr:a4_expr("calm","concerned",fin(t,w("gov","twelve weeks"),0.6))});
  arrive(ctx,1050,350,t,0.6,()=>a4_letter(ctx,640,170,820,"the regional government",["a plan: community batteries","in three suburbs","in twelve weeks"],{h:340,boldLast:true,
    p:[fin(t,w("gov","a plan")-0.2,1.0),fin(t,w("gov","three suburbs")-0.2,0.8),fin(t,w("gov","twelve weeks")-0.2,0.8)]}),{dy:12,a:fin(t,0.6,0.6)*g1});
  const oT=fin(t,w("gov","owns the utility")-0.3,0.6)*g1;if(oT>0.01)arrive(ctx,1050,580,t,w("gov","owns the utility")-0.3,()=>tag(ctx,1050,580,"it owns the utility",BIZ,{align:"center",size:28}),{dy:8,a:oT});
  // the street at noon: its roofs, the line that can't take their power, the voltage, the panels turning down; then the battery
  const stA=fin(t,tNo-0.5,0.8)*(1-fin(t,tDe-0.5,0.7)),tSto=w("battery","stores"),tEv=w("battery","for the evening");
  if(stA>0.01)withA(ctx,stA,()=>a4_street(ctx,t,{homes:clamp((t-tNo+0.5)/1.2,0,1),sun:1,flow:fin(t,w("noon","at noon")-0.2,0.8),jam:fin(t,w("noon","can't take")-0.2,0.8)*(1-fin(t,tSto,1.0)),
    down:A4_HX.map((x,i)=>fin(t,w("down","turn themselves down")-0.2+i*0.16,0.5)*(1-fin(t,tSto+0.3+i*0.1,0.8))),
    gauge:fin(t,tD-0.3,0.6)*(1-fin(t,tF-0.5,0.6)),v:0.42+0.5*easeCam(clamp((t-w("down","climbs")+0.2)/1.4,0,1)),
    bat:fin(t,w("battery","one large battery")-0.3,0.7),charge:clamp((t-tSto)/3.2,0,1)*(1-0.6*clamp((t-tEv-0.4)/3,0,1)),batHi:pulseAt(t,w("battery","shared by the homes"),2.0),
    store:fin(t,tSto-0.2,0.6)*(1-fin(t,tEv,0.6)),eve:fin(t,tEv-0.3,1.2),give:fin(t,tEv+0.4,0.8)}));
  const dT=fin(t,w("down","on sunny days")-0.3,0.6)*(1-fin(t,tF-0.3,0.6));if(dT>0.01)arrive(ctx,960,820,t,w("down","on sunny days")-0.3,()=>tag(ctx,960,820,"on sunny days, 2,400 homes lose power they could have used",ACA_WARN,{align:"center",size:30}),{dy:8,a:dT});
  // Farah hears it from them
  const fA=fin(t,tF-0.4,0.8)*(1-fin(t,tBa-0.3,0.7));
  a4_who(ctx,"farah",1720,fA,t,{right:true,expr:a4_expr("calm","concerned",fin(t,tF+0.5,0.6))});
  const fT=fin(t,w("farah","customer advocate")-0.3,0.6)*(1-fin(t,tBa-0.5,0.6));a4_name(ctx,"Farah Siddiqui · customer advocate",fT,true);
  const hB=fin(t,w("farah","hears it")-0.3,0.6)*(1-fin(t,tBa-0.5,0.6));if(hB>0.01)arrive(ctx,1360,760,t,w("farah","hears it")-0.3,()=>a4_bubble(ctx,1590,760,"my panels switched off again",{align:"right",size:28}),{dy:8,a:hB});
  // the battery: one, on the street, shared, storing noon power for the evening
  const bT=fin(t,w("battery","one large battery")-0.2,0.6)*(1-fin(t,tSto-0.4,0.5));if(bT>0.01)withA(ctx,bT,()=>tag(ctx,960,300,"one battery on the street, shared by its homes",A4_NET,{align:"center",size:30}));
  const sT=fin(t,tSto+0.15,0.6)*(1-fin(t,tDe-0.5,0.6));if(sT>0.01)withA(ctx,sT,()=>tag(ctx,960,300,"noon power, kept for the evening",A4_OK,{align:"center",size:30}));
  // what a new service's design holds
  const dA=1-fin(t,tL-0.5,0.7),hT=fin(t,tDe-0.1,0.6)*dA;if(hT>0.01)withA(ctx,hT,()=>tag(ctx,960,190,"a new service needs a design",KT_AI,{align:"center",size:30}));
  [["capability","capabilities",["what it must","be able to do"],A4_STR,w("design","what the utility")],["stream","value stream",["the steps, from","sign-up to credit"],A4_STR,w("design","the steps")],
   ["process","processes",["who does","each step"],A4_BUS,w("design","who does each")],["object","information",["what each","must know"],A4_INF,w("design","what each must")]].forEach(([k,lb,ln,col,t0],i)=>{
    const q=fin(t,t0-0.3,0.6)*dA;if(q<=0.01)return;const x=150+i*420;arrive(ctx,x+190,465,t,t0-0.3,()=>a4_part(ctx,x,290,380,330,k,lb,ln,col,{hi:pulseAt(t,t0,1.6)}),{dy:14,a:q});});
  // the last new service's workshops: what do you do, and how do you work? Eight months of them
  const wA=fin(t,tL-0.3,0.8)*(1-fin(t,tNe-0.5,0.7));
  if(wA>0.01){arrive(ctx,690,425,t,tL-0.3,()=>{sheet(ctx,200,150,980,540,{plain:true,rot:-0.006});
      // blank notes on the workshops' sheet: a few at first, more as the months go by
      for(let i=0;i<12;i++){const q=fin(t,i<4?tL+i*0.15:tSt+(i-3)*0.65,0.4);if(q<=0.01)continue;const k=i%6,x=320+k*150+hash(i,911)*20,y=i<6?236+hash(i,912)*12:614+hash(i,913)*12;
        sticky(ctx,x,y,110,96,"",{col:NOTEC[i%4],rot:(hash(i,914)-0.5)*0.12,a:q});}
      sticky(ctx,470,400,360,170,"what do you do?",{col:NOTEC[0],size:36,rot:-0.02,a:fin(t,w("last","what do you do")-0.3,0.5)});
      sticky(ctx,900,400,360,170,"how do you work?",{col:NOTEC[1],size:36,rot:0.02,a:fin(t,w("last","how do you work")-0.3,0.5)});},{dy:12,a:wA});
    const lA=fin(t,w("last","night tariff")-0.4,0.7);if(lA>0.01)arrive(ctx,1530,350,t,w("last","night tariff")-0.4,()=>{a4_card(ctx,1250,170,560,"the last new service",["a night tariff for charging cars"],A4_HH,{size:30,minH:440});
      a4_car(ctx,1460,470,1.3,A4_HH,1);a4_moon(ctx,1700,430,22,1);
      const yA=fin(t,w("stalled","waited a year")-0.3,0.6);if(yA>0.01){a4_clock(ctx,1700,540,30,ACA_WARN,t,yA);withA(ctx,yA,()=>T(ctx,"waited a year",1530,580,{w:800,size:30,align:"center",color:rgba(ACA_WARN,1)}));}},{dy:12,a:lA*wA});
    a4_blocks(ctx,200,736,8,108,clamp((t-w("stalled","eight months")+0.6)/1.8,0,1)*8,ACA_WARN,{a:fin(t,w("stalled","eight months")-0.7,0.5)*wA,label:"eight months of workshops"});}
  // twelve weeks: no room for that; something to react to, not a blank page
  const nA=fin(t,tNe-0.3,0.7)*(1-fin(t,tPn-0.4,0.6));
  if(nA>0.01)withA(ctx,nA,()=>{a4_blocks(ctx,240,350,35,36,35,ACA_WARN,{h:44,gap:6,label:"the last new service: eight months"});a4_blocks(ctx,240,580,12,36,clamp((t-tNe)/1.0,0,1)*12,KT_AI,{h:44,gap:6,label:"this one: twelve weeks"});
    const rA=fin(t,w("need","no room")-0.3,0.6);if(rA>0.01)withA(ctx,rA,()=>tag(ctx,800,602,"no room for that",ACA_WARN,{size:30}));});
  const pA=fin(t,tPn-0.3,0.7);
  if(pA>0.01){arrive(ctx,620,410,t,tPn-0.3,()=>{a4_page(ctx,360,190,520,420,{blank:true});kt_rcross(ctx,860,210,24,fin(t,w("need","blank page")-0.3,0.5));T(ctx,"a blank page",620,680,{w:800,size:30,align:"center",color:rgba(SOFT,1)});},{dy:12,a:pA});
    arrive(ctx,1300,410,t,tPn-0.1,()=>{a4_page(ctx,1040,190,520,420,{notes:clamp((t-tPn)/1.4,0,1)});kt_gtick(ctx,1540,210,22,fin(t,w("need","react to")-0.3,0.5));T(ctx,"something to react to",1300,680,{w:800,size:30,align:"center",color:rgba(KT_AI,1)});},{dy:12,a:pA});}
  ctx.restore();vign(ctx,S);});

/* ---------- 3 to 6. The wall: the draft, its sources, the review and what's confirmed ---------- */
// The map agent drafts on a wall (a4_wall): four chapters in one room, each gliding on from where the one before ends.
// the notes the agent drafts, in the order of the wall
const A4_DRAFT=["v1","v2","v3","v4","c1","p1","p2","in","i1","i2","p4","c2","p5","i3","r1","r2"];
// each note's state once its source is shown: t0, when the first source comes (the rest follow it a little apart)
function a4_sourced(t,t0){const N={};A4_DRAFT.forEach((id,k)=>N[id]={srcA:t0==null?1:fin(t,t0+k*0.08,0.5)});return N;}
// the agent in its corner of the wall while it drafts: its orb, its step on the task (draft), and its name
function a4_corner(ctx,t,a,o){o=o||{};if(a<=0.01)return;aca_agent(ctx,1830,830,22,t,{a,busy:o.busy||0.3});aca_stepPill(ctx,1790,830,1,{a,align:"right",size:28,hi:o.hi||0});
  withA(ctx,a,()=>T(ctx,"the map agent",1626,840,{w:800,size:28,align:"right",color:rgba(KT_AI,1)}));}
// a highlight that comes and goes: in from a, out from b
const a4_win=(t,a,b)=>fin(t,a,0.5)*(1-fin(t,b,0.5));
scene("draft",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  const tM=c("models"),tDo=c("docs"),tT=c("two"),tC=c("count"),tR=c("react"),tS=c("start"),tB=w("react","answer a proposal");
  ctx.save();drift(ctx,t,sc,{z:0.012,y:500});
  // the wall, its lanes empty, then the draft pinned up on it as the voice names each part
  const N={},put=(id,t0)=>{N[id]={a:fin(t,t0,0.5),t0};};
  ["c1","c2"].forEach((id,i)=>put(id,w("two","capabilities")-0.2+i*0.25));["v1","v2","v3","v4"].forEach((id,i)=>put(id,w("two","value stream")-0.2+i*0.2));
  ["p1","p2","p4","p5"].forEach((id,i)=>put(id,w("two","processes")-0.2+i*0.2));["in","i1","i2","i3"].forEach((id,i)=>put(id,w("two","information")-0.2+i*0.2));
  ["r1","r2"].forEach((id,i)=>put(id,w("two","each uses")+0.5+i*0.3));
  const cHi=pulseAt(t,w("count","each one a draft")-0.1,1.6);if(cHi>0.01)A4_DRAFT.forEach(id=>{if(N[id]&&id!=="in")N[id].hi=cHi*0.6;});
  const dim=0.85*fin(t,tC-0.3,0.6)*(1-fin(t,tS-0.5,0.7));
  a4_wall(ctx,t,{lanes:fin(t,tT-0.8,1.0),dash:1-fin(t,w("two","capabilities")-0.2,1.4),lab:fin(t,tT-0.4,1.0),n:N,dim});
  // Tomás asks the map agent for a first draft
  a4_who(ctx,"tomas",200,fin(t,0.3,0.8)*(1-fin(t,tM+0.8,0.8)),t,{});
  const mv=easeCam(clamp((t-tT+0.2)/1.6,0,1)),ax=lerp(1180,1830,mv),ay=lerp(600,830,mv),ar=lerp(44,22,mv),rA=1-fin(t,tT-0.2,0.8);
  const aT=fin(t,w("agent","asks")-0.3,0.6)*(1-fin(t,tM+0.4,0.6));if(aT>0.01){withA(ctx,aT,()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,0.75);ctx.lineWidth=2.6;ctx.setLineDash([7,8]);ctx.beginPath();ctx.moveTo(360,640);ctx.lineTo(ax-ar*1.9,ay);ctx.stroke();ctx.restore();});
    arrive(ctx,760,590,t,w("agent","asks")-0.3,()=>tag(ctx,760,590,"a first draft",KT_AI,{align:"center",size:30}),{dy:8,a:aT});}
  // what it reads: the industry's reference models, on the left
  [["CIM: the common information model",w("models","CIM"),140],["the IEC's list of what a distribution utility does",w("models","the IEC's list"),322],["Europe's market role model",w("models","market role model"),504]].forEach(([nm,t0,y])=>{
    const q=fin(t,t0-0.3,0.6)*rA;if(q<=0.01)return;arrive(ctx,590,y+70,t,t0-0.3,()=>a4_ref(ctx,330,y,520,nm,{hi:pulseAt(t,t0,1.6)}),{dy:10,a:q});a4_flow(ctx,852,y+70,ax-ar*1.3,ay,t,EAC,q*0.9,{lift:20});});
  const mT=fin(t,w("models","reference models")-0.3,0.6)*rA;if(mT>0.01)withA(ctx,mT,()=>tag(ctx,590,96,"the models the map began from",EAC,{align:"center",size:28}));
  // and the utility's own documents, on the right
  [["the government's request",w("docs","government's request")],["the network's procedures",w("docs","network's procedures")],["retail's product rules",w("docs","product rules")],["the map",w("docs","the map itself")]].forEach(([nm,t0],i)=>{
    const q=fin(t,t0-0.3,0.6)*rA,y=210+i*118;if(q<=0.01)return;arrive(ctx,1600,y,t,t0-0.3,()=>{if(i<3)a4_doc(ctx,1430,y,0.55,"",{hi:pulseAt(t,t0,1.6)});
      else for(let k=0;k<4;k++){const L=LAY6[k+2][1];ctx.save();ctx.strokeStyle=rgba(L,0.9);ctx.fillStyle=rgba(L,0.15);ctx.lineWidth=2;ctx.beginPath();const yy=y-24+k*14;ctx.moveTo(1410,yy);ctx.lineTo(1460,yy);ctx.lineTo(1450,yy+9);ctx.lineTo(1400,yy+9);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
      T(ctx,nm,1480,y+10,{w:800,size:30,color:rgba(INK,0.92)});},{dy:10,a:q});a4_flow(ctx,1388,y,ax+ar*1.3,ay,t,[226,218,200],q*0.8,{lift:-10});});
  const dT=fin(t,w("docs","own documents")-0.3,0.6)*rA;if(dT>0.01)withA(ctx,dT,()=>tag(ctx,1600,110,"its own documents",[226,218,200],{align:"center",size:28}));
  // the map agent: in the middle while it reads, then in its corner of the wall while it drafts
  aca_agent(ctx,ax,ay,ar,t,{a:fin(t,0.5,0.8),busy:0.3+0.5*fin(t,tM,0.8)*(1-fin(t,tC,1.0))});
  {const nm="the map agent",R0=1180+tw(ctx,nm,30,800)/2;withA(ctx,fin(t,0.5,0.8),()=>T(ctx,nm,lerp(R0,1626,mv),lerp(600+44*1.95+40,840,mv),{w:800,size:lerp(30,28,mv),align:"right",color:rgba(KT_AI,1)}));}
  const pl=fin(t,w("agent","first draft")-0.3,0.6),pw=tw(ctx,"draft",28,800)+80;if(pl>0.01)aca_stepPill(ctx,lerp(1180,1790-pw/2,mv),lerp(486,830,mv),1,{a:pl,align:"center",size:28,hi:pulseAt(t,w("agent","first draft"),1.6)});
  const twA=fin(t,w("two","In two days")-0.3,0.6)*(1-fin(t,tC-0.3,0.6));if(twA>0.01)arrive(ctx,420,830,t,w("two","In two days")-0.3,()=>tag(ctx,420,830,"in two days",KT_AI,{align:"center",size:30}),{dy:8,a:twA});
  ctx.restore();
  // fifty-eight elements, each a draft
  const kA=fin(t,tC-0.1,0.6)*(1-fin(t,tR-0.3,0.6));if(kA>0.01)arrive(ctx,960,426,t,tC-0.1,()=>a4_count(ctx,410,200,1100,{p:clamp((t-tC)/2.4,0,1)}),{dy:12,a:kA});
  // reacting to a draft, and answering an open question
  const rP=fin(t,tR-0.1,0.7)*(1-fin(t,tS-0.5,0.6));
  if(rP>0.01){const o1=1-fin(t,tB-0.6,0.35),i2=fin(t,tB-0.2,0.4);arrive(ctx,620,410,t,tR-0.1,()=>{a4_page(ctx,360,190,520,420,{blank:true});
      withA(ctx,o1,()=>tag(ctx,620,676,"describing from nothing",SOFT,{align:"center",size:30}));withA(ctx,i2,()=>tag(ctx,620,676,"an open question",SOFT,{align:"center",size:30}));},{dy:12,a:rP});
    arrive(ctx,1300,410,t,tR+0.1,()=>{a4_page(ctx,1040,190,520,420,{notes:1,marks:clamp((t-w("react","faster")+0.2)/4.5,0,1)});
      withA(ctx,o1,()=>tag(ctx,1300,676,"reacting to a draft",KT_AI,{align:"center",size:30}));withA(ctx,i2,()=>tag(ctx,1300,676,"a proposal",KT_AI,{align:"center",size:30}));},{dy:12,a:rP});
    const fT=fin(t,w("react","faster")-0.2,0.6);if(fT>0.01)withA(ctx,fT*rP,()=>tag(ctx,960,780,"faster, and better answers",A4_OK,{align:"center",size:30}));}
  // the workshops start from it
  const sT=fin(t,tS-0.2,0.6)*(1-fin(t,sc.dur-1.0,0.6));if(sT>0.01){setScreen(ctx,S);arrive(ctx,860,830,t,tS-0.2,()=>tag(ctx,860,830,"the workshops start from the draft",BIZ,{align:"center",size:30}),{dy:8,a:sT});}
  vign(ctx,S);});

scene("source",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  const tE=c("each"),tX=c("ex"),tBi=c("bill"),tG=c("guess"),tO=c("owner"),tCk=c("check");
  ctx.save();drift(ctx,t,sc,{z:0.012,y:500});
  const N=a4_sourced(t,tE-0.1);
  // the examples: running the battery, from the IEC's list; the battery, as information, from CIM; crediting each bill; a guess
  const tI1=w("ex","the battery, as information");
  const F={c1:a4_win(t,w("ex","Running the battery")-0.3,tI1-0.3),i1:a4_win(t,tI1-0.3,tBi-0.3),p5:a4_win(t,w("bill","Crediting")-0.3,tG-0.3),p2:a4_win(t,w("guess","who decides")-0.3,tO-0.4)};
  const foc=Math.max(...Object.values(F));
  A4_DRAFT.forEach(id=>{N[id].dim=0.5*foc*(1-(F[id]||0));N[id].hi=(F[id]||0);});
  N.p2.guess=fin(t,w("guess","marked as a guess")-0.3,0.6);N.p2.hiCol=ACA_WARN;
  // every element names who confirms it: each side lights as its owner is named
  const oG=w("owner","Grace"),oR=w("owner","head of retail"),oA=w("owner","Ama");
  A4_DRAFT.forEach(id=>{const sd=A4_N[id].side;N[id].hi=Math.max(N[id].hi,0.7*pulseAt(t,sd==="net"?oG:sd==="ret"?oR:oA,1.8));});
  // each owner checks every line against what it came from
  A4_DRAFT.forEach((id,k)=>{N[id].hi=Math.max(N[id].hi,0.55*pulseAt(t,w("check","check every line")-0.2+k*0.1,1.0));});
  a4_wall(ctx,t,{n:N,own:[fin(t,oG-0.3,0.6),fin(t,oA-0.3,0.6),fin(t,oR-0.3,0.6)],ownHi:[pulseAt(t,oG,1.8)+pulseAt(t,w("check","each owner"),1.6),pulseAt(t,oA,1.8)+pulseAt(t,w("check","each owner"),1.6),pulseAt(t,oR,1.8)+pulseAt(t,w("check","each owner"),1.6)]});
  // what each focused element came from, under the wall, one at a time
  const tC1=w("ex","Running the battery")-0.3,tP5=w("bill","Crediting")-0.3,tP2=w("guess","who decides")-0.3,tEo=w("check","each owner")-0.3;
  [["run the battery: under operating the network, from the IEC's list",EAC,tC1,tI1-0.75],["the battery, as information: from CIM",EAC,tI1-0.2,tBi-0.75],
   ["credit each bill: from retail's product rules",A4_RET,tP5,tG-0.75],["no source says it: the agent's own guess, marked as a guess",ACA_WARN,tP2,tO-0.5],
   ["each owner checks every line against its source",BIZ,tEo,sc.dur-1.4]].forEach(([s_,col,a0,a1])=>{const q=a4_win(t,a0,a1);if(q>0.01)arrive(ctx,860,830,t,a0,()=>tag(ctx,860,830,s_,col,{align:"center",size:28}),{dy:8,a:q});});
  a4_corner(ctx,t,1,{});
  ctx.restore();vign(ctx,S);});

// The review needs room for people: the camera tilts down from the wall, so they stand below it (A4_LIFT pixels), and the
// confirmation glides back up. The agent's corner leaves while a person stands at the right, and is back before the chapter ends.
const A4_LIFT=190;
scene("review",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  const tRi=c("risk"),tAs=c("ask"),tAm=c("ama"),tW=c("wall"),tJ=c("join"),tF=c("fix"),tG=c("grace"),tFe=c("feed"),tN=c("nodoc"),gEnd=w("nodoc","Grace adds")+1.7;
  const lift=easeCam(clamp((t-tRi-1.0)/1.8,0,1)),yT=830-140*lift;
  ctx.save();drift(ctx,t,sc,{z:0.012,y:500});ctx.translate(0,-A4_LIFT*lift);
  const N=a4_sourced(t,null);N.p2.guess=1;
  // what's wrong: retail inviting households from the network's list, across the wall
  const tL=w("ama","network's list"),cross=clamp((t-tL+0.2)/1.2,0,1),xO=1-fin(t,tF-0.2,0.8),wrong=a4_win(t,w("ama","the draft has retail")-0.3,tF+0.4);
  const fx=clamp((t-w("fix","each retailer invites")+0.2)/1.2,0,1),nn=w("fix","every retailer on")-0.3;
  N.p4.hi=wrong;N.p4.hiCol=A4_RED;N.p4.fixP=fx;N.in.hi=Math.max(wrong*0.8,pulseAt(t,w("wall","the network's"),1.8));
  N.r2.hi=pulseAt(t,w("wall","Customer information"),2.2);N.r1.hi=pulseAt(t,w("wall","treat every retailer"),2.0);
  N.nn={a:fin(t,nn,0.5),t0:nn,srcA:fin(t,nn+0.4,0.5),add:fin(t,nn+0.2,0.6),hi:pulseAt(t,nn+0.3,1.8)};
  // what's missing: switching the battery off before crews work; Grace adds the step
  const p3=w("nodoc","Grace adds")-0.1;N.p3={a:fin(t,p3,0.5),t0:p3,srcA:fin(t,p3+0.4,0.5),add:fin(t,p3+0.2,0.6),hi:pulseAt(t,p3+0.3,1.8)};
  // the wall dims under the question and under Grace's card
  const dRisk=a4_win(t,tRi-0.2,tAm-0.4),dG=a4_win(t,tG-0.3,tN+0.3);
  a4_wall(ctx,t,{n:N,own:[1,1,1],dim:Math.max(0.5*dRisk,0.85*dG)});
  // the step that joined them crossed the wall
  if(cross>0&&xO>0.01){const x0=A4_COL[0],y0=A4_RB+A4_NH+4,y1=A4_RR-4,yy=lerp(y0,y1,cross);withA(ctx,xO,()=>{ctx.save();ctx.strokeStyle=rgba(A4_RED,0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.shadowColor=rgba(A4_RED,0.8);ctx.shadowBlur=14;
      ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x0,yy);ctx.stroke();if(cross>=1){ctx.fillStyle=rgba(A4_RED,1);ctx.beginPath();ctx.moveTo(x0,y1+8);ctx.lineTo(x0-12,y1-12);ctx.lineTo(x0+12,y1-12);ctx.closePath();ctx.fill();}ctx.restore();
      const jp=fin(t,w("join","crossed the wall")-0.3,0.6);if(jp>0.01){ctx.save();ctx.strokeStyle=rgba(A4_RED,0.95*jp);ctx.lineWidth=4;ctx.beginPath();ctx.arc(x0,A4_WY+A4_WH/2,46+8*pulseAt(t,w("join","crossed the wall"),1.4),0,TAU);ctx.stroke();ctx.restore();}});
    // each source right on its own
    const ok=fin(t,w("join","right on its own")-0.3,0.6)*xO;if(ok>0.01){["in","p4"].forEach(id=>{const[x,y,ww,hh]=a4_box(A4_N[id]);withA(ctx,ok,()=>tick_(ctx,x+ww-34,y+hh-30,30,A4_OK,1));});}}
  // a tidy draft's sheen
  const sh=a4_win(t,tRi,tRi+3.2);if(sh>0.01){const u=clamp((t-tRi)/3.2,0,1),gx=lerp(200,2100,u);ctx.save();const g=ctx.createLinearGradient(gx-260,0,gx+260,0);g.addColorStop(0,"rgba(255,250,235,0)");g.addColorStop(0.5,"rgba(255,250,235,"+(0.10*sh)+")");g.addColorStop(1,"rgba(255,250,235,0)");ctx.fillStyle=g;ctx.fillRect(A4_LX,A4_VY,A4_LW,A4_RR+A4_NH-A4_VY);ctx.restore();}
  // the agent's corner of the wall, away while Ama and then Grace stand at the right
  a4_corner(ctx,t,1-a4_win(t,tAm-1.1,gEnd+0.6),{});
  ctx.restore();
  // below the wall: Tomás asks what's missing and what's wrong, not whether it's right
  a4_who(ctx,"tomas",200,a4_win(t,tAs-0.6,tAm-0.3),t,{});
  const rT=fin(t,w("risk","nod through")-0.3,0.6)*(1-fin(t,tAs-0.3,0.6));if(rT>0.01)arrive(ctx,960,yT,t,w("risk","nod through")-0.3,()=>tag(ctx,960,yT,"people tend to nod through what looks confident",ACA_WARN,{align:"center",size:30}),{dy:8,a:rT});
  const q0=fin(t,w("ask","whether it's right")-0.3,0.6),qO=1-fin(t,tAm+0.4,0.6);
  if(q0*qO>0.01)withA(ctx,q0*qO,()=>{tag(ctx,560,yT,"is it right?",SOFT,{align:"center",size:30});ctx.save();ctx.strokeStyle=rgba(A4_RED,0.9);ctx.lineWidth=4;ctx.beginPath();const k=clamp((t-w("ask","whether it's right")-0.2)/0.5,0,1);ctx.moveTo(470,yT);ctx.lineTo(470+180*k,yT);ctx.stroke();ctx.restore();});
  [["what's missing?",900,w("ask","what's missing")],["what's wrong?",1220,w("ask","what's wrong")]].forEach(([s,x,t0])=>{const q=fin(t,t0-0.3,0.6)*qO;if(q>0.01)arrive(ctx,x,yT,t,t0-0.3,()=>tag(ctx,x,yT,s,BIZ,{align:"center",size:30}),{dy:8,a:q});});
  // Ama finds what's wrong
  const aW=a4_win(t,tAm-0.5,tF+1.6);a4_who(ctx,"ama",1720,aW,t,{right:true,expr:a4_expr("calm","concerned",a4_win(t,tAm+0.4,tF+0.6))});
  a4_name(ctx,"Ama Owusu · regulatory lead",fin(t,w("ama","Ama")-0.2,0.6)*(1-fin(t,tW-0.4,0.6)),true);
  const xT=fin(t,w("join","crossed the wall")-0.3,0.6)*(1-fin(t,tF-0.3,0.6));if(xT>0.01)arrive(ctx,860,yT,t,w("join","crossed the wall")-0.3,()=>tag(ctx,860,yT,"the step that joined them crossed the wall",A4_RED,{align:"center",size:30}),{dy:8,a:xT});
  // the fix, as a decision
  const dD=fin(t,tF+0.4,0.6)*(1-fin(t,tG-0.5,0.6));if(dD>0.01)arrive(ctx,860,yT,t,tF+0.4,()=>tag(ctx,860,yT,"DEC-031 · the network offers it to every retailer, on the same terms",BIZ,{align:"center",size:28}),{dy:8,a:dD});
  // Grace finds what's missing, and adds the step
  a4_who(ctx,"grace",1720,a4_win(t,tG-0.5,gEnd),t,{right:true,expr:a4_expr("calm","concerned",a4_win(t,tFe-0.2,tN+1.6))});
  a4_name(ctx,"Grace Achieng · network operations",fin(t,w("grace","Grace")-0.2,0.6)*(1-fin(t,tFe-0.6,0.6)),true);
  const iA=fin(t,w("grace","Before a crew")-0.4,0.7)*(1-fin(t,tN+0.2,0.6));
  if(iA>0.01)arrive(ctx,960,365,t,w("grace","Before a crew")-0.4,()=>a4_isolate(ctx,370,150,1180,t,{sub:fin(t,w("grace","switched off and locked")-0.3,0.7),bat:fin(t,tFe-0.3,0.7),feed:fin(t,w("feed","new source")-0.2,0.7)}),{dy:12,a:iA});
  const nT=fin(t,tN-0.1,0.6)*(1-fin(t,gEnd-0.2,0.6));if(nT>0.01)arrive(ctx,860,yT,t,tN-0.1,()=>{a4_doc(ctx,452,yT-4,0.36,"");T(ctx,"the network's procedures: written before batteries stood on streets",490,yT+10,{w:800,size:28,color:rgba(ACA_WARN,1)});},{dy:8,a:nT});
  vign(ctx,S);});

scene("confirm",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tO=c("owners"),tNv=c("never"),tAg=c("again"),tWk=c("weeks"),tMo=c("model"),tPl=c("plan");
  // the wall, and then the model: the paper's room gives way to the map's dark
  wallBg(ctx,S,t);const md=fin(t,tMo-0.2,1.4);if(md>0.01){withA(ctx,md,()=>bg2(ctx));withA(ctx,md,()=>motes(ctx,t));}
  ctx.save();drift(ctx,t,sc,{z:0.012,y:500});ctx.translate(0,-A4_LIFT*(1-easeCam(clamp((t-XF)/1.8,0,1))));
  const N=a4_sourced(t,null);N.p2.guess=1;N.p4.fixP=1;
  N.nn={srcA:1,add:1};N.p3={srcA:1,add:1};
  // each owner confirms their part: glass, their name and the date; corrected or added ones on a later date
  const t0=w("owners","confirms their part")-0.3,late=id=>A4_N[id].fix||A4_N[id].added;
  const order={net:["v2","v3","c1","p1","in","i1","i2","nn","p3"],ret:["v1","v4","p4","c2","p5"],rule:["r1","r2"]};
  [["net",0],["ret",1.0],["rule",2.0]].forEach(([sd,d])=>order[sd].forEach((id,k)=>{if(id==="in")return;const g=fin(t,t0+d+k*0.14,0.6);N[id].glass=g;N[id].conf=A4_OWN[sd][0]+" · "+(late(id)?A4_LATE:A4_OWN[sd][1]);}));
  // what an owner corrects, the agent drafts again for them to confirm; what they strike out leaves the map
  const fx=clamp((t-w("again","corrects")+0.1)/1.2,0,1),g2=fin(t,w("again","for them to confirm")-0.1,0.6);
  N.p2.fixP=fx;N.p2.guess=1-fx;N.p2.glass=g2;N.p2.conf="Grace · "+A4_LATE;N.p2.hi=a4_win(t,w("again","corrects")-0.3,w("again","strike out")-0.3);
  const sk=clamp((t-w("again","strike out")+0.2)/0.6,0,1),gone=fin(t,w("again","leaves the map")-0.1,0.9);
  N.i3.strike=sk;N.i3.a=1-gone;N.i3.hi=a4_win(t,w("again","strike out")-0.3,w("again","leaves the map")+0.4);N.i3.hiCol=A4_RED;
  // only what the owners confirmed becomes the model
  const mHi=pulseAt(t,w("model","becomes the model")-0.3,2.2);A4_DRAFT.concat(["nn","p3"]).forEach(id=>{if(N[id]&&id!=="i3")N[id].hi=Math.max(N[id].hi||0,0.5*mHi);});
  const tally=a4_win(t,tWk-0.2,tMo-0.3);
  a4_wall(ctx,t,{n:N,own:[1,1,1],ownHi:[pulseAt(t,t0,1.8),pulseAt(t,t0+2.0,1.8),pulseAt(t,t0+1.0,1.8)],dim:0.85*tally});
  // the agent drafts; it never confirms
  a4_corner(ctx,t,1,{hi:pulseAt(t,w("never","The agent drafts"),1.6)});
  const nv=fin(t,w("never","never confirms")-0.3,0.6)*(1-fin(t,tAg+0.6,0.6));if(nv>0.01)withA(ctx,nv,()=>{const ww=tw(ctx,"confirm",28,800)+48,cx0=1626-tw(ctx,"the map agent",28,800)-28-ww/2;glass(ctx,cx0-ww/2,808,ww,44,22,SOFT,{glow:4,ea:0.6,fill:"rgba(7,12,24,0.94)"});T(ctx,"confirm",cx0,840,{w:800,size:28,align:"center",color:rgba(SOFT,1)});kt_rcross(ctx,cx0+ww/2-4,812,16,1);});
  const mT=fin(t,tMo-0.1,0.6);if(mT>0.01)arrive(ctx,700,830,t,tMo-0.1,()=>tag(ctx,700,830,"only what the owners confirmed: the model",BIZ,{align:"center",size:30}),{dy:8,a:mT*(1-fin(t,tPl-0.4,0.6))});
  const tPg=Math.max(w("plan","reaches the government")-0.3,tPl+0.25),pT=fin(t,tPg,0.6);if(pT>0.01)arrive(ctx,700,830,t,tPg,()=>tag(ctx,700,830,"the plan, to the government: week 11 of 12",BIZ,{align:"center",size:30}),{dy:8,a:pT});
  ctx.restore();
  // five weeks on
  if(tally>0.01){const rr_=[fin(t,w("weeks","forty-one")-0.3,0.8),fin(t,w("weeks","nine corrected")-0.3,0.8),fin(t,w("weeks","eight struck out")-0.3,0.8),fin(t,w("weeks","four added")-0.3,0.8)];
    arrive(ctx,960,420,t,tWk-0.2,()=>a4_tally(ctx,380,210,1160,{rows:rr_}),{dy:12,a:tally});}
  vign(ctx,S);});

/* ---------- 7. Back to the old foundation ---------- */
// Babylon on the left, the tower on its foundation in its form, and the king's own words; the utility on the right: what the plan
// started from and the model, confirmed; five weeks; next summer's battery; and nothing across the wall
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:30});
  const tCa=c("called"),tU=c("utility"),tWk=c("weeks"),tSu=c("summer"),tWa=c("wall");
  // Babylon, on the left
  ctx.save();ctx.beginPath();ctx.rect(0,0,948,H);ctx.clip();ctx.save();drift(ctx,t,sc,{z:0.02,x:470,y:520});
  ctx.translate(470,600);ctx.scale(0.8,0.8);ctx.translate(-960,-600);
  const dawn=1,day=0.45;bab_sky(ctx,t,{dawn,day});bab_city(ctx,t,{dawn,day});bab_ground(ctx,t,{dawn,day,river:false});
  bab_tower(ctx,960,A4_BY,A4_S,{dawn,day,hi:0.35});
  a4_outline(ctx,960,A4_BY,A4_S,ACA,fin(t,w("king","a form")-0.2,0.8)*(1-fin(t,tU-0.6,1.0)));
  a4_footLine(ctx,960,A4_BY,A4_S,BIZ,fin(t,w("king","foundation in the ground")-0.2,0.8)*(1-fin(t,tU-0.6,1.0)));
  ctx.restore();const sg=ctx.createLinearGradient(800,0,948,0);sg.addColorStop(0,"rgba(3,5,11,0)");sg.addColorStop(1,"rgba(3,5,11,0.95)");ctx.fillStyle=sg;ctx.fillRect(800,0,148,H);ctx.restore();
  const kO=1-fin(t,tCa-0.5,0.6);
  bab_tag(ctx,450,560,"a form a thousand years old",fin(t,w("king","a form")-0.2,0.7)*kO);
  bab_tag(ctx,450,626,"the foundation in the ground",fin(t,w("king","foundation in the ground")-0.2,0.7)*kO);
  const kC=fin(t,w("king","confirmed")-0.2,0.7)*kO;if(kC>0.01)withA(ctx,kC,()=>{kt_gtick(ctx,318,692,14,1);T(ctx,"the place, confirmed",344,702,{w:800,size:30,color:rgba(BIZ,1)});});
  bab_quote(ctx,60,600,820,"the one who examines the old foundation of Babylon","Nabopolassar, in his own words",{a:fin(t,w("called","the one who examines")-0.3,0.8),size:34});
  // the utility, on the right: what its plan started from, and the model, confirmed
  const uA=fin(t,tU-0.3,0.8)*(1-fin(t,tSu-1.0,0.6));
  if(uA>0.01){withA(ctx,uA,()=>a4_mini(ctx,1012,268,0.5,t,{}));
    const k1=fin(t,w("utility","industry's models")-0.3,0.6),k2=fin(t,w("utility","own documents")-0.3,0.6),k3=fin(t,w("utility","only what the owners")-0.3,0.6);
    if(k1>0.01)withA(ctx,k1*uA,()=>tag(ctx,1200,180,"the industry's models",EAC,{align:"center",size:28}));if(k2>0.01)withA(ctx,k2*uA,()=>tag(ctx,1630,180,"its own documents",[226,218,200],{align:"center",size:28}));
    if(k3>0.01)withA(ctx,k3*uA,()=>{kt_gtick(ctx,1180,670,14,1);T(ctx,"only what the owners confirmed",1206,680,{w:800,size:30,color:rgba(BIZ,1)});});
    const wT=fin(t,tWk-0.2,0.6);if(wT>0.01)arrive(ctx,1412,756,t,tWk-0.2,()=>tag(ctx,1412,756,"five weeks, where the last took eight months",BIZ,{align:"center",size:30}),{dy:8,a:wT*uA});}
  // next summer: the first battery's homes store their noon power
  const sA=fin(t,tSu-0.3,0.7);
  if(sA>0.01){withA(ctx,sA,()=>{ctx.save();ctx.translate(1420,440);ctx.scale(0.48,0.48);ctx.translate(-960,-440);a4_street(ctx,t,{homes:1,sun:1,flow:1,bat:1,charge:0.3+0.6*clamp((t-tSu)/3.5,0,1),store:1,batHi:0.4});ctx.restore();});
    const nT=fin(t,w("summer","Next summer")-0.2,0.6);if(nT>0.01)arrive(ctx,1420,700,t,w("summer","Next summer")-0.2,()=>tag(ctx,1420,700,"next summer: noon power, kept for the evening",A4_OK,{align:"center",size:30}),{dy:8,a:nT});
    const xT=fin(t,tWa-0.2,0.6);if(xT>0.01)arrive(ctx,1420,780,t,tWa-0.2,()=>tag(ctx,1420,780,"not one household's details crossed the wall",A4_OK,{align:"center",size:30}),{dy:8,a:xT});}
  vign(ctx,S);});

/* ---------- 8. A first draft, not a blank page ---------- */
// Tomás and Grace, and the answer; then the end card
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tA=c("answer"),fade=1-fin(t,B,1.0),rl=fin(t,w("keep","keep only")-0.2,0.5);
  ctx.save();ctx.globalAlpha*=fade;drift(ctx,t,sc,{z:0.02,y:480});
  a4_who(ctx,"tomas",230,fin(t,0.6,0.8),t,{expr:a4_expr("calm","relieved",rl)});a4_who(ctx,"grace",1690,fin(t,0.8,0.8),t,{right:true,expr:a4_expr("calm","relieved",rl)});
  arrive(ctx,960,250,t,tA+0.2,()=>sticky(ctx,960,250,820,250,"Start from a first draft, every source shown. Ask what's missing and what's wrong. Keep only what the owners confirm.",{col:NOTEC[3],size:32,rot:0.01,p:clamp((t-tA-0.4)/7.0,0,1)}),{dy:-16});
  // the design, confirmed, small, under the note
  withA(ctx,fin(t,1.0,1.0),()=>a4_mini(ctx,760,470,0.25,t,{}));
  ctx.restore();vign(ctx,S);
  acaEnd(ctx,S,t,B,"A first draft, not a blank page","Start from a draft. Keep only what's confirmed.","Film 4 of 6");});

/* ---------- where the chapters meet ---------- */
// The wall holds four chapters: Where each came from, What's missing, what's wrong and Only what's confirmed each glide on from where
// the one before ends.
const CHAPTER_JOINS={glide:["source","review","confirm"]};
