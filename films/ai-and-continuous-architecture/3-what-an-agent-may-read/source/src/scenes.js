/* ===== What an agent may read: scenes =====
   Nine chapters, as in ../script.md. Uruk, in December 229 BCE: a scribe copies the tablet of Etemenanki's measures from an original
   from Borsippa; copies made by hand slipped, and every copy after carried the slip; the learning was for the initiated. He checks
   his copy against the original and writes at its end where it came from, that it was checked, and who may read it; the tablet
   came down to us, and the base it gives is close to the one dug up. Then the utility: the website's chat, which read whatever it
   could reach; its context drawn from the map, products with contracts and the glossary's terms; levels, and a place of its own
   that holds only what it may read, under its own identity; a small tool that answers only "hand this to a person now"; who
   agrees, in a ticket; the same on Databricks; the copy and the chat's place side by side; and the answer.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: every shot
   drifts slowly, things arrive with a spring, and in one room the camera glides on and never cuts. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- 1. A copy, checked ---------- */
// the present, at the opening's end: the chat among the households it answers; what it reads coming into it; and what that should be
const A3_HX=[470,660,850,1070,1260,1450];
function a3_hh(ctx,t,st){const a=st.a==null?1:st.a;if(a<=0.01)return;
  withA(ctx,a,()=>{
    A3_HX.forEach((x,i)=>{const q=clamp((st.houses||0)*2.2-i*0.2,0,1);if(q<=0.01)return;const y=590+Math.pow((i-2.5)/2.5,2)*40;arrive(ctx,x,y,t,(st.tH||0)+i*0.12,()=>a3_house(ctx,x,y,1.15,A3_HH,1),{dy:12,a:q});});
    [[0,"my bill?"],[2,"this winter's price?"],[5,"work in my street?"]].forEach(([i,s],k)=>{const q=(st.ask||[])[k]||0;if(q<=0.01)return;const x=A3_HX[i],y=590+Math.pow((i-2.5)/2.5,2)*40;
      arrive(ctx,x,y-110,t,(st.tA||[])[k]||0,()=>a3_bubble(ctx,x+(i===5?40:-40),y-104,s,{align:i===5?"right":"left",size:28}),{dy:8,a:q});});
    // what it reads, coming into it from places nobody has named
    const rd=st.reads||0;if(rd>0.01)[[520,150],[960,96],[1400,150]].forEach(([x,y],k)=>{withA(ctx,rd,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.5);ctx.lineWidth=2;ctx.setLineDash([5,9]);ctx.beginPath();ctx.moveTo(x,y+24);ctx.lineTo(960,262);ctx.stroke();ctx.restore();
        T(ctx,"?",x,y+12,{w:800,size:40,align:"center",color:rgba(SOFT,0.95)});for(let j=0;j<3;j++){const u=((t*0.35+j/3+k*0.21)%1),px=lerp(x,960,u),py=lerp(y+24,262,u);glow(ctx,px,py,16,KT_AI,0.5*Math.sin(Math.PI*u));}});});
    aca_agent(ctx,960,290,44,t,{a:st.orb==null?1:st.orb,busy:st.busy||0.4,name:"the website's chat",size:30});
    [["from the original",560],["checked",960],["says who may read it",1370]].forEach(([s,x],k)=>{const q=(st.should||[])[k]||0;if(q<=0.01)return;arrive(ctx,x,780,t,(st.tS||[])[k]||0,()=>tag(ctx,x,780,s,ACA,{align:"center",size:30}),{dy:10,a:q});});});}
scene("tablet",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tSc=c("scribe"),tFr=c("from"),tSl=c("slip"),tCh=c("chain"),tFe=c("few"),tNe=c("need"),tCk=c("checked"),tWr=c("writes"),tWh=c("who"),tLa=c("lasted"),tBa=c("base"),tNo=c("now"),tRe=c("reads"),tSh=c("should");
  const uL=fin(t,tLa-0.5,1.3),uB=fin(t,tBa-0.5,1.3),uN=fin(t,tNo-0.5,1.3);
  // the present, once it comes: the chat and the households it answers
  if(uN>0.001){setScreen(ctx,S);bg2(ctx);motes(ctx,t);ctx.save();drift(ctx,t,sc,{z:0.015,y:480});
    a3_hh(ctx,t,{a:1-fin(t,B+0.4,0.8),orb:fin(t,tNo-0.2,0.8),busy:0.3+0.5*fin(t,tRe,1.0),houses:clamp((t-tNo-0.2)/1.6,0,1),tH:tNo-0.2,ask:[fin(t,w("now","bills")-0.3,0.6),fin(t,w("now","prices")-0.3,0.6),fin(t,w("now","planned work")-0.3,0.6)],
      tA:[w("now","bills")-0.3,w("now","prices")-0.3,w("now","planned work")-0.3],reads:fin(t,tRe-0.1,0.8)*(1-fin(t,tSh+0.4,1.0)),
      should:[fin(t,w("should","original")-0.3,0.6),fin(t,w("should","checked")-0.3,0.6),fin(t,w("should","who may read")-0.3,0.6)],tS:[w("should","original")-0.3,w("should","checked")-0.3,w("should","who may read")-0.3]});
    ctx.restore();vign(ctx,S);}
  // the tower's base, seen from above: the tablet's square, and the one archaeologists measured
  if(uB>0.001&&uN<0.999)a3_fade(ctx,uN>0.001?1-uN:1,cx=>{setScreen(cx,S);const g=cx.createRadialGradient(960,480,80,960,480,1100);g.addColorStop(0,"#3a2c20");g.addColorStop(1,"#0d0a08");cx.fillStyle=g;cx.fillRect(0,0,W,H);
    cx.save();drift(cx,t-tBa+0.5,{dur:sc.dur-tBa},{z:0.03,y:440});a3_base(cx,860,440,4.4,{tab:fin(t,w("base","a hundred and eighty")-0.3,1.0),labT:fin(t,w("base","about ninety")-0.2,0.7),
      dug:fin(t,w("base","archaeologists")-0.2,1.2),labD:fin(t,w("base","ninety-one")-0.3,0.7)});cx.restore();
    bab_tag(cx,960,110,"the tower's base, seen from above",fin(t,tBa-0.1,0.7));vign(cx,S);});
  // the tablet today, in its museum: the same lines at its end
  if(uL>0.001&&uB<0.999)a3_fade(ctx,uB>0.001?1-uB:1,cx=>{setScreen(cx,S);cx.fillStyle="#060508";cx.fillRect(0,0,W,H);
    const sp=cx.createRadialGradient(960,360,40,960,420,640);sp.addColorStop(0,"rgba(255,226,186,0.20)");sp.addColorStop(1,"rgba(255,226,186,0)");cx.fillStyle=sp;cx.fillRect(0,0,W,H);
    cx.save();drift(cx,t-tLa+0.5,{dur:sc.dur-tLa},{z:0.035,y:420});cx.fillStyle="#141016";cx.fillRect(800,668,320,60);cx.fillStyle="rgba(255,226,186,0.12)";cx.fillRect(800,668,320,3);
    a3_tablet(cx,740,170,440,500,{n:10,bottom:150,lit:0.3});a3_foot(cx,740,170,440,500,t,{p:1.5,hi:pulseAt(t,w("lasted","how far to trust it")-0.2,2.4)});cx.restore();
    bab_tag(cx,960,800,"the tablet, kept today at the Louvre",fin(t,tLa+0.2,0.7));vign(cx,S);});
  // the room in Uruk, and what the narration names over it
  if(uL<0.999)a3_fade(ctx,1-uL,cx=>{setScreen(cx,S);cx.save();
    const K=[[0,960,540,1.0],[tSc-0.4,800,580,1.25],[tSl-0.5,960,540,1.0]];focus(cx,t,K,1.9);
    a3_room(cx,t,{lamp:1});a3_lying(cx,A3_OX,A3_OY,150,{hi:pulseAt(t,w("from","original"),1.8)});
    a3_scribe(cx,A3_SX,A3_FL+14,330,t,{write:fin(t,0.4,1.0)*(1-fin(t,tCk-0.6,0.6))+fin(t,tWr-0.2,0.6),look:fin(t,tCk-0.4,0.8)*(1-fin(t,tWr-0.2,0.8))});
    cx.restore();vign(cx,S);setScreen(cx,S);
    // the room in shadow under the cards
    const dim=Math.max(fin(t,tSl-0.6,0.8)*(1-fin(t,tFe-0.6,0.8)),0.85*fin(t,tNe-0.5,0.8));if(dim>0.01){cx.fillStyle="rgba(8,6,6,"+(0.66*dim)+")";cx.fillRect(0,0,W,H);}
    eaYear(cx,80,80,"Uruk · December 229 BCE",ACA,fin(t,0.6,0.8)*(1-fin(t,tSc-0.4,0.6)));
    // where Uruk is, and Borsippa, and the way the original came
    const mA=fin(t,0.9,0.8)*(1-fin(t,tSl-0.7,0.6));if(mA>0.01)arrive(cx,1550,300,t,0.9,()=>a3_babMap(cx,1260,70,600,450,{ur:fin(t,w("city","Uruk")+0.4,0.8),ba:fin(t,w("scribe","Babylon's")-0.2,0.8)*(1-fin(t,tFr,0.6))+0.4*fin(t,tFr,0.6),
      bo:fin(t,w("from","Borsippa")-0.2,0.8),line:clamp((t-w("from","Borsippa"))/1.8,0,1)}),{dy:-14,a:mA});
    // the tablet he copies: the tower's measures, stage by stage
    const sA=fin(t,tSc+0.2,0.7)*(1-fin(t,tSl-0.7,0.6));if(sA>0.01)arrive(cx,310,300,t,tSc+0.2,()=>{a3_tablet(cx,70,80,480,450,{rules:0,lit:0.4});
      T(cx,"Etemenanki's measures,",310,146,{w:800,size:30,align:"center",color:rgba(ACA_INK,0.96)});T(cx,"stage by stage",310,184,{w:800,size:30,align:"center",color:rgba(ACA_INK,0.96)});
      a3_stages(cx,310,486,3.1,{p:clamp((t-w("scribe","stage by stage")+0.2)/1.8,0,1)});},{dy:-14,a:sA});
    bab_tag(cx,960,120,"his original: a tablet from Borsippa",fin(t,w("from","original")-0.2,0.7)*(1-fin(t,tSl-0.7,0.6)));
    // copies made by hand, one from another: a slip, and every copy after carries it
    const cA=fin(t,tSl-0.3,0.6)*(1-fin(t,tFe-0.6,0.6));if(cA>0.01){const X=[80,540,1000,1460],tc=[tSl-0.3,w("slip","by hand")-0.3,w("chain","copy of a copy")-0.3,w("chain","every slip")-0.3],sl=clamp((t-w("slip","could slip")+0.1)/0.9,0,1);
      [["the original",180,0],["a copy",160,1],["a copy of a copy",160,2],["every copy after",160,3]].forEach(([lb,n,i])=>{const q=fin(t,tc[i],0.6)*cA;if(q<=0.01)return;
        arrive(cx,X[i]+190,400,t,tc[i],()=>a3_copy(cx,X[i],200,380,400,lb,n,i===0?{}:i===1?{was:180,slip:sl,ring:pulseAt(t,w("chain","one wrong number")-0.2,2.2)}:{bad:1,p:clamp((t-tc[i]-0.2)/1.2,0,1)}),{dy:12,a:q});
        if(i>0)withA(cx,q,()=>{cx.save();cx.strokeStyle=rgba(BAB_CLAY,0.85);cx.lineWidth=3;cx.beginPath();cx.moveTo(X[i]-66,400);cx.lineTo(X[i]-14,400);cx.stroke();cx.beginPath();cx.moveTo(X[i]-26,390);cx.lineTo(X[i]-14,400);cx.lineTo(X[i]-26,410);cx.stroke();cx.restore();});});
      bab_tag(cx,960,700,"one wrong number, wrong for every reader after",fin(t,w("chain","one wrong number")-0.2,0.7)*cA);}
    // learning kept for the initiated
    bab_tag(cx,960,120,"learning kept for the initiated",fin(t,w("few","initiated")-0.3,0.7)*(1-fin(t,tNe-0.5,0.6)));
    bab_tag(cx,960,188,"not for every eye",fin(t,w("few","not for every eye")-0.3,0.7)*(1-fin(t,tNe-0.5,0.6)));
    // what a reader had to know
    const nA=fin(t,tNe-0.2,0.7)*(1-fin(t,tCk-0.6,0.6));if(nA>0.01){arrive(cx,820,330,t,tNe-0.2,()=>a3_tablet(cx,560,140,440,380,{n:8,lit:0.3}),{dy:-12,a:nA});
      [["where did it come from?",w("need","where")],["was it checked?",w("need","checked")],["who is it for?",w("need","who it was")]].forEach(([s,t0],k)=>{const q=fin(t,t0-0.3,0.6)*nA;if(q>0.01)arrive(cx,1060,230+k*90,t,t0-0.3,()=>tag(cx,1060,230+k*90,s,ACA_WARN,{size:30}),{dy:8,a:q});});}
    // the original and his copy, side by side, checked line by line; then what he writes at the copy's end
    const kA=fin(t,tCk-0.3,0.7)*(1-fin(t,tLa-0.7,0.6));if(kA>0.01){const L0=[220,84,480,480],R0=[1220,84,480,480],tk=w("checked","checks");
      arrive(cx,460,324,t,tCk-0.3,()=>{a3_tablet(cx,...L0,{n:8,top:100,bottom:150,lit:0.3});T(cx,"the original, from Borsippa",460,84+64,{w:800,size:28,align:"center",color:rgba(ACA_INK,0.96)});},{dy:-12,a:kA});
      arrive(cx,1460,324,t,tCk-0.1,()=>{a3_tablet(cx,...R0,{n:8,top:100,bottom:150,lit:0.3});T(cx,"his copy",1460,84+64,{w:800,size:28,align:"center",color:rgba(ACA_INK,0.96)});
        a3_foot(cx,...R0,t,{p:clamp((t-w("writes","where it came from")+0.3)/2.2,0,1)+clamp((t-w("who","who may read")+0.2)/1.2,0,1)*0.5,hi:pulseAt(t,w("who","who may read"),2.0)});},{dy:-12,a:kA});
      for(let i=0;i<8;i++){const q=clamp((t-tk-i*0.32)/0.4,0,1)*kA;if(q<=0.01)continue;const y=84+100+(i+0.5)*(480-250)/8;
        withA(cx,q,()=>{cx.save();cx.strokeStyle=rgba(BAB_CLAY,0.55);cx.lineWidth=2;cx.setLineDash([6,8]);cx.beginPath();cx.moveTo(706,y);cx.lineTo(1214,y);cx.stroke();cx.restore();
          cx.save();cx.strokeStyle=rgba(A3_OK,0.95);cx.lineWidth=4;cx.lineCap="round";cx.beginPath();cx.moveTo(950,y);cx.lineTo(958,y+8);cx.lineTo(974,y-10);cx.stroke();cx.restore();});}
      const qA=fin(t,tWh+0.2,0.8);if(qA>0.01)arrive(cx,960,720,t,tWh+0.2,()=>a3_quote(cx,500,616,920,["May the initiate instruct the initiate.","The uninitiate must not see."],"from the tablet's end · Uruk, 229 BCE",{size:34}),{dy:10,a:qA*kA});}
  });
  acaTitle(ctx,S,t,B+1.0,"What an agent may read","the original, checked, and only what it's meant to read","Film 3 of 6 · AI and continuous architecture");});

/* ---------- 2. Whatever it could reach ---------- */
// Farah brings Tomás two complaints; the chat's first version read whatever it could reach: a copy of a copy of the tariffs, an
// export of customers and the contact centre's notes; one family planned on an old price, another's medical needs reached a stranger
const A3_SRC=[[600,600],[960,640],[1320,600]];
scene("reach",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tP=c("price"),tSt=c("stranger"),tR=c("reach"),tE=c("export"),tNo=c("notes"),tH=c("harm"),tNe=c("need");ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  const wr=fin(t,tSt+0.6,0.5)*(1-fin(t,tNe,0.5));
  a3_who(ctx,"tomas",200,fin(t,0.4,0.8),t,{expr:a3_expr("calm","concerned",wr)});a3_who(ctx,"farah",1720,fin(t,c("farah")-0.2,0.8),t,{right:true,expr:a3_expr("calm","concerned",fin(t,tP,0.5)*(1-fin(t,tNe,0.5)))});
  const fT=fin(t,w("farah","customer advocate")-0.3,0.7)*(1-fin(t,tP-0.2,0.6));if(fT>0.01)withA(ctx,fT,()=>tag(ctx,1590,560,"Farah Siddiqui · customer advocate",BIZ,{align:"center",size:28}));
  // her two complaints
  const kO=1-fin(t,tR-0.5,0.6);
  arrive(ctx,690,230,t,tP-0.2,()=>a3_card(ctx,440,130,500,"a complaint",["a household was quoted","last year's price"],A3_HH,{size:30}),{dy:12,a:fin(t,tP-0.2,0.6)*kO});
  arrive(ctx,1230,230,t,tSt-0.2,()=>a3_card(ctx,980,130,500,"a complaint",["a caller who isn't the account","holder heard about someone's","medical equipment"],A3_RED,{size:30}),{dy:12,a:fin(t,tSt-0.2,0.6)*kO});
  // the chat, and whatever it could reach
  const oA=fin(t,tR-0.3,0.7);if(oA>0.01){const rp=clamp((t-tR)/1.4,0,1);
    [[440,520],[1490,500],[760,170],[1170,160]].forEach(([x,y],k)=>withA(ctx,oA*0.6,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=2;ctx.setLineDash([5,9]);ctx.beginPath();ctx.moveTo(960,330);ctx.lineTo(lerp(960,x,rp),lerp(330,y,rp));ctx.stroke();ctx.restore();}));
    A3_SRC.forEach(([x,y],k)=>{const hi=k===0?fin(t,tE-0.2,0.6)*(1-fin(t,tNo-0.2,0.6)):k===2?fin(t,tNo-0.2,0.6)*(1-fin(t,tH+2,0.6)):0,col=k===2?mix(SOFT,A3_RED,hi):mix(SOFT,ACA_WARN,hi);
      withA(ctx,oA,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2.6;ctx.setLineDash([7,8]);ctx.lineDashOffset=-t*10;ctx.beginPath();ctx.moveTo(lerp(960,x,0.12),466);ctx.lineTo(lerp(lerp(960,x,0.12),x,rp),lerp(466,y-90,rp));ctx.stroke();ctx.restore();});});
    aca_agent(ctx,960,330,40,t,{a:oA,busy:0.6,name:"the chat's first version",size:28});
    const s0=fin(t,tR+0.6,0.7),s1=fin(t,tR+0.9,0.7),s2=fin(t,tR+1.2,0.7);
    a3_file(ctx,600,600,1.0,"a copy of a copy",{a:s0,n:2,stale:fin(t,w("export","nobody kept")-0.3,0.6),date:"a year old",col:mix([214,206,190],ACA_WARN,fin(t,tE-0.2,0.6)*(1-fin(t,tNo-0.2,0.6)))});
    a3_file(ctx,960,640,0.8,"customers, exported",{a:s1*0.75,n:1});
    a3_notes(ctx,1320,600,{a:s2,name:"the contact centre's notes",hi:fin(t,w("notes","medical needs")-0.3,0.6)});
    const mN=fin(t,w("notes","medical needs")-0.2,0.6);if(mN>0.01)withA(ctx,mN,()=>T(ctx,"medical needs",1320,674,{w:800,size:28,align:"center",color:rgba(A3_RED,1)}));}
  // what it did to people
  const h1=fin(t,w("harm","price that had changed")-0.3,0.7),h2=fin(t,w("harm","reached a stranger")-0.3,0.7),hO=1-fin(t,tNe-0.4,0.6);
  if(h1>0.01)arrive(ctx,600,808,t,w("harm","price that had changed")-0.3,()=>tag(ctx,600,808,"planned on a price that had changed",ACA_WARN,{align:"center",size:28}),{dy:8,a:h1*hO});
  if(h2>0.01)arrive(ctx,1320,808,t,w("harm","reached a stranger")-0.3,()=>tag(ctx,1320,808,"medical needs, told to a stranger",A3_RED,{align:"center",size:28}),{dy:8,a:h2*hO});
  const aA=fin(t,w("harm","Ama")-0.2,0.7)*(1-fin(t,tNe-0.4,0.6));if(aA>0.01)arrive(ctx,960,150,t,w("harm","Ama")-0.2,()=>{tag(ctx,960,150,"a breach, reported by Ama Owusu, regulatory lead",BIZ,{align:"center",size:28});},{dy:-8,a:aA});
  // what an agent that answers the public needs
  const nA=fin(t,w("need","official figures")-0.3,0.7),nB=fin(t,w("need","only what")-0.3,0.7);
  if(nA>0.01)arrive(ctx,740,150,t,w("need","official figures")-0.3,()=>tag(ctx,740,150,"the official figures",KT_AI,{align:"center",size:30}),{dy:-8,a:nA});
  if(nB>0.01)arrive(ctx,1200,150,t,w("need","only what")-0.3,()=>tag(ctx,1200,150,"only what it's meant to read",KT_AI,{align:"center",size:30}),{dy:-8,a:nB});
  ctx.restore();vign(ctx,S);});

/* ---------- 3 and 4. The chat's context, on the map ---------- */
// Tomás's map, as its six layers, then opened as a view of three: the business layer, where the data practice draws its data
// products, their contracts and the glossary; the information layer, where each one's level is set; and the application layer,
// where the chat is. st: tr (0..1) from the map to the view; p, the layers rising; prod[i], ct, own, lv[i], lvHi[i], reads[i], place,
// badge, signin, never, mask, crack, out (the exports, crossed), dim[i], hi[i], hide[i] (a product's card hidden, its level kept)
const A3_SL=i=>364+i*234,A3_SW=222,A3_SH=124,A3_SY=164,A3_PX=800,A3_PY=650,A3_PL=[346,132,966,326],A3_BX=560;
const A3_PROD=[["tariffs","retail","public"],["planned work","Grace","public"],["help pages","retail","public"],["glossary","the glossary's owners","internal"],["accounts","retail","confidential"],["medical needs","priority team","restricted"]];
function a3_geo(i,tr){const S=[260,150+i*102,1400,84,58.8],F=i===2?[120,96,1680,236,30]:i===3?[120,352,1680,118,20]:i===4?[120,490,1680,330,30]:S,e=easeCam(clamp(tr,0,1));return S.map((v,k)=>lerp(v,F[k],e));}
function a3_view(ctx,t,st){const tr=clamp(st.tr||0,0,1),p=st.p==null?1:st.p,deco=!!st.deco;
  // the six layers, three of them opening into the view
  LAY6.forEach(([nm,col],i)=>{const q=clamp(p*6.5-i,0,1);if(q<=0)return;const keep=i>=2&&i<=4,a=clamp(q*2.2,0,1)*(keep?1:1-easeCam(clamp(tr*1.6,0,1)));if(a<=0.01)return;
    const[x,y,w,h,sk]=a3_geo(i,tr),yy=y-(1-spring(q*1.4))*40;slab(ctx,x,yy,w,h,nm,col,{a,sk,hi:(st.hi||[])[i]||0,size:30,deco:deco&&tr<0.5});});
  if(tr<0.5&&(st.ghosts||0)>0.01)withA(ctx,st.ghosts*(1-tr*2),()=>{const[,y]=a3_geo(2,tr);for(let i=0;i<6;i++){ctx.save();ctx.setLineDash([7,7]);ctx.strokeStyle=rgba(A3_BUS,0.75);ctx.lineWidth=2;rr(ctx,520+i*180,y+14,150,56,8);ctx.stroke();ctx.restore();}});
  if(tr<0.6)return;const vA=clamp((tr-0.6)/0.4,0,1);
  withA(ctx,vA,()=>{
    // the chat's place: a room round what it may read
    const pl=st.place||0;if(pl>0.01)a3_place(ctx,...A3_PL,{p:pl,name:"the chat's place",hi:st.placeHi||0});
    // what the chat reads: a line from it up to each product
    A3_PROD.forEach((P,i)=>{const r=(st.reads||[])[i]||0;if(r<=0.01)return;const x=A3_SL(i)+A3_SW/2,y0=A3_PY-46,y1=A3_SY+A3_SH+6;
      withA(ctx,r,()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,0.8);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(A3_PX+(i-1.5)*10,y0);ctx.bezierCurveTo(A3_PX+(i-1.5)*10,y0-120,x,y1+150,x,y1);ctx.stroke();
        ctx.fillStyle=rgba(KT_AI,0.9);ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x-7,y1+12);ctx.lineTo(x+7,y1+12);ctx.closePath();ctx.fill();ctx.restore();
        const u=((t*0.45+i*0.23)%1);glow(ctx,lerp(x,A3_PX,easeCam(u)),lerp(y1+10,y0,easeCam(u)),14,KT_AI,0.5*Math.sin(Math.PI*u));});});
    // the products, the glossary, and each one's level
    A3_PROD.forEach(([nm,own,lv],i)=>{const q=(st.prod||[])[i]||0;if(q<=0.01)return;const x=A3_SL(i),dm=(st.dim||[])[i]||0,hi=(st.phi||[])[i]||0;
      const hd=1-clamp((st.hide||[])[i]||0,0,1);if(hd>0.01)arrive(ctx,x+A3_SW/2,A3_SY+A3_SH/2,t,(st.tP||[])[i]||0,()=>{if(i===3)archEl(ctx,x,A3_SY,A3_SW,A3_SH,nm,A3_BUS,"object",{a:1-0.55*dm,hi,size:28});
        else a3_product(ctx,x,A3_SY,A3_SW,A3_SH,nm,{ct:st.ct||0,own:(st.own||0)>0.01?own:null,ownA:st.own||0,dim:dm,hi,size:28,osize:28});},{dy:-12,a:q*hd});
      const lq=(st.lv||[])[i]||0;if(lq>0.01){const lx=x+A3_SW/2;withA(ctx,lq,()=>{ctx.save();ctx.strokeStyle=rgba(A3_INF,0.55);ctx.lineWidth=2;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(lx,A3_SY+A3_SH+4);ctx.lineTo(lx,388);ctx.stroke();ctx.restore();});
        arrive(ctx,lx,411,t,(st.tL||[])[i]||0,()=>a3_level(ctx,lx,411,lv,{hi:(st.lvHi||[])[i]||0,size:28}),{dy:8,a:lq*(1-0.5*dm)});}});
    // a mask over medical needs, and the one wrong rule that lets them through
    const mk=st.mask||0;if(mk>0.01){a3_mask(ctx,A3_SL(5)-6,A3_SY-6,A3_SW+12,A3_SH+12,{a:mk,crack:st.crack||0});withA(ctx,mk,()=>T(ctx,"a mask",A3_SL(5)+A3_SW/2,A3_SY+A3_SH/2+10,{w:800,size:30,align:"center",color:rgba([200,206,224],1)}));
      const ck=st.crack||0;if(ck>0.3)for(let j=0;j<5;j++){const u=((t*0.5+j/5)%1),x=lerp(A3_SL(5)+A3_SW/2,A3_PX+30,u),y=lerp(A3_SY+A3_SH,A3_PY-40,u);withA(ctx,mk*(ck-0.3)/0.7*Math.sin(Math.PI*u),()=>{glow(ctx,x,y,18,A3_RED,0.7);ctx.fillStyle=rgba(A3_RED,1);ctx.beginPath();ctx.arc(x,y,5,0,TAU);ctx.fill();});}}
    const nv=st.never||0;if(nv>0.01)withA(ctx,nv,()=>{ctx.save();ctx.strokeStyle=rgba(A3_RED,0.95);ctx.lineWidth=3.2;ctx.shadowColor=rgba(A3_RED,0.7);ctx.shadowBlur=12;rr(ctx,A3_SL(5)-14,A3_SY-14,A3_SW+28,A3_SH+28,14);ctx.stroke();ctx.restore();
      tag(ctx,A3_SL(5)+A3_SW/2,520,"never read",A3_RED,{align:"center",size:28});});
    // the old exports, crossed out
    const ex=st.out||0;if(ex>0.01){a3_file(ctx,1450,660,0.7,"",{a:ex,n:2});a3_file(ctx,1620,660,0.7,"",{a:ex,n:1});kt_rcross(ctx,1476,620,20,ex);kt_rcross(ctx,1646,620,20,ex);withA(ctx,ex,()=>T(ctx,"no exports, no copies",1540,760,{w:800,size:28,align:"center",color:rgba(A3_RED,1)}));}
    // the chat, its own identity, and a household's own sign-in
    aca_agent(ctx,A3_PX,A3_PY,44,t,{busy:st.busy||0.4,name:"the website's chat",size:28});
    const bg=st.badge||0;if(bg>0.01){a3_badge(ctx,A3_BX,630,t,{a:bg,name:"its own identity",hi:st.badgeHi||0});withA(ctx,bg,()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,0.9);ctx.lineWidth=3;ctx.setLineDash([2,7]);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(A3_BX,568);ctx.lineTo(A3_BX,462);ctx.stroke();ctx.restore();});}
    const si=st.signin||0;if(si>0.01){const hx=A3_SL(4)+A3_SW/2;a3_house(ctx,hx,690,1.15,A3_HH,si);a3_key(ctx,hx+76,660,1.0,si);
      withA(ctx,si,()=>{ctx.save();ctx.strokeStyle=rgba(A3_HH,0.85);ctx.lineWidth=2.6;ctx.setLineDash([8,7]);ctx.lineDashOffset=-t*10;ctx.beginPath();ctx.moveTo(A3_PX+50,A3_PY+10);ctx.lineTo(hx-50,680);ctx.moveTo(hx,646);ctx.lineTo(hx,446);ctx.stroke();ctx.restore();
        T(ctx,"on the holder's own sign-in",hx,790,{w:800,size:28,align:"center",color:rgba(A3_HH,1)});});}
  });}
scene("ines",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tD=c("draw"),tPr=c("products"),tC=c("contract"),tTe=c("terms"),tO=c("only"),tF=c("fresh");
  const K=[[0,960,540,1]];
  ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  // Tomás, and Inés, before the map comes; then they leave it to the map
  const pO=1-fin(t,w("draw","Tomás's map")-0.5,0.8);a3_who(ctx,"tomas",200,pO,t,{});a3_who(ctx,"ines",1720,fin(t,c("ines")-0.1,0.8)*pO,t,{right:true});
  const iT=fin(t,w("ines","Inés Duarte")-0.1,0.7)*(1-fin(t,tD-0.2,0.6));if(iT>0.01)withA(ctx,iT,()=>{tag(ctx,1640,540,"Inés Duarte · data architect",TECH,{align:"center",size:30});T(ctx,"as in Data architecture",1840,600,{w:600,size:28,align:"right",color:rgba(SOFT,1)});});
  ctx.save();focus(ctx,t,K,1.9);
  const tr=clamp((t-tPr+0.4)/2.2,0,1),mp=clamp((t-w("draw","Tomás's map")+0.6)/1.6,0,1);
  if(mp>0.001)a3_view(ctx,t,{p:mp,tr,deco:true,ghosts:fin(t,w("draw","data practice")-0.3,0.8),hi:[0,0,pulseAt(t,w("draw","data practice"),1.8),0,0,0],
    prod:[0,1,2,3,4,5].map(i=>i===3?fin(t,w("terms","glossary")-0.3,0.6):i===5?0:fin(t,[w("products","tariffs"),w("products","planned work"),w("products","help pages"),0,w("products","account")][i]-0.2,0.6)),
    tP:[w("products","tariffs")-0.2,w("products","planned work")-0.2,w("products","help pages")-0.2,w("terms","glossary")-0.3,w("products","account")-0.2,0],
    ct:fin(t,w("contract","contract")-0.2,0.8),own:fin(t,w("contract","who owns it")-0.2,0.8),phi:[pulseAt(t,w("contract","contract")-0.2,2.2)+pulseAt(t,w("fresh","tariffs product"),2.0),0,0,pulseAt(t,w("terms","glossary"),2.0),0,0],
    reads:[0,1,2,3,4,5].map(i=>i===5?0:fin(t,w("only","reads those")-0.2+i*0.12,0.6)),out:fin(t,w("only","no exports")-0.3,0.6)*(1-fin(t,tF-0.4,0.6)),busy:0.3+0.5*fin(t,tF,0.8)});
  // the chat, before the map comes, where it was
  const oP=1-mp;if(oP>0.01)aca_agent(ctx,960,330,40,t,{a:oP,busy:0.4});
  ctx.restore();ctx.restore();
  // what the narration names, in screen space
  const cA=fin(t,w("contract","contract")-0.1,0.6)*(1-fin(t,tTe-0.6,0.6));if(cA>0.01)arrive(ctx,1460,654,t,w("contract","contract")-0.1,()=>a3_contract(ctx,1160,492,600,[["what it holds","today's prices, every tariff"],["how fresh","changed the day prices change"],["who owns it","retail"]],{title:"the tariffs' contract",p:clamp((t-w("contract","what it holds")+0.3)/2.4,0,1)}),{dy:-12,a:cA});
  const gA=fin(t,w("terms","account holder")-0.3,0.7)*(1-fin(t,tO-0.4,0.6));if(gA>0.01)arrive(ctx,1500,640,t,w("terms","account holder")-0.3,()=>a3_card(ctx,1210,560,580,"glossary · account holder",["the person the account is in","the name of"],A3_BUS,{size:30}),{dy:10,a:gA});
  const fA=fin(t,w("fresh","prices change")-0.2,0.6);if(fA>0.01){arrive(ctx,A3_SL(0)+A3_SW/2,124,t,w("fresh","prices change")-0.2,()=>tag(ctx,A3_SL(0)+A3_SW/2,124,"new prices, today",A3_BUS,{align:"center",size:28}),{dy:-8,a:fA});
    const bA=fin(t,w("fresh","chat's answer")-0.3,0.6);if(bA>0.01)arrive(ctx,1000,560,t,w("fresh","chat's answer")-0.3,()=>a3_bubble(ctx,872,566,"this year's price",{chat:true,size:28}),{dy:8,a:bA});}
  vign(ctx,S);});
scene("level",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tM=c("may"),tN=c("never"),tMa=c("mask"),tPl=c("place"),tI=c("identity"),tA=c("account"),tS=c("signin");
  ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  const lvT=[w("level","public"),w("level","public")+0.15,w("level","public")+0.3,w("level","internal"),w("level","confidential"),w("level","restricted")];
  const out=fin(t,tPl-0.2,1.0),accO=fin(t,w("account","confidential")-0.2,0.6);
  const mk=fin(t,tMa-0.1,0.6)*(1-fin(t,tPl-0.4,0.6));
  a3_view(ctx,t,{p:1,tr:1,prod:[1,1,1,1,1,fin(t,w("level","restricted")-0.4,0.6)],hide:[0,0,0,0,0,mk],tP:[0,0,0,0,0,w("level","restricted")-0.4],ct:1,own:1,
    lv:lvT.map(x=>fin(t,x-0.2,0.6)),tL:lvT.map(x=>x-0.2),lvHi:[0,1,2,3,4,5].map(i=>i<4?pulseAt(t,i===3?w("may","internal"):w("may","public"),1.8):i===4?pulseAt(t,w("account","confidential"),1.8):pulseAt(t,w("never","Restricted"),1.8)),
    reads:[1,1,1,1,1-fin(t,tPl-0.6,0.8),0].map((v,i)=>v*(i<4?1+0*pulseAt(t,tM,1):1)),busy:0.4,
    never:fin(t,w("never","never reads")-0.3,0.6)*(1-fin(t,tMa-0.2,0.5))+fin(t,tPl+0.4,0.6)*(1-fin(t,tI,0.6))*0,
    mask:mk,crack:clamp((t-w("mask","one wrong rule")+0.1)/0.8,0,1),
    place:clamp((t-w("place","a place of its own")+0.2)/1.8,0,1),placeHi:pulseAt(t,w("place","isn't there at all"),2.0)+pulseAt(t,w("identity","that place"),1.8),
    dim:[0,0,0,0,0.5*out,0.5*out],phi:[0,0,0,0,pulseAt(t,w("account","confidential"),2.0)+0.6*accO*(1-fin(t,tS+1.5,1.0)),0],
    badge:fin(t,w("identity","own identity")-0.3,0.7),badgeHi:pulseAt(t,w("identity","own identity"),1.8),signin:fin(t,w("signin","own sign-in")-0.4,0.8)});
  ctx.restore();
  // what the narration names, in screen space
  const aT=fin(t,w("account","isn't there")-0.3,0.6)*(1-fin(t,tS+0.6,0.6));if(aT>0.01)arrive(ctx,A3_SL(4)+A3_SW/2,520,t,w("account","isn't there")-0.3,()=>tag(ctx,A3_SL(4)+A3_SW/2,520,"not in its place",ACA_WARN,{align:"center",size:28}),{dy:8,a:aT});
  const tT=fin(t,w("signin","theirs")-0.3,0.6);if(tT>0.01)arrive(ctx,1600,560,t,w("signin","theirs")-0.3,()=>tag(ctx,1600,560,"theirs, and no one else's",A3_HH,{align:"center",size:28}),{dy:8,a:tT});
  vign(ctx,S);});

/* ---------- 5. Hand it to a person ---------- */
// A street with planned work; some homes must hear it from a person first, and the chat can't tell which; the priority team's
// small tool answers only "hand this to a person now"; a person calls back, sees why and checks who they're speaking to
const A3_STX=i=>420+i*180,A3_STY=660,A3_TX=1220,A3_TY=250;
scene("tool",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tW=c("which"),tAn=c("answer"),tWy=c("why"),tTo=c("today");ctx.save();drift(ctx,t,sc,{z:0.015,y:480});
  // the street, and its planned work
  const pw=fin(t,0.4,0.8);withA(ctx,pw,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.35);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(300,A3_STY+40);ctx.lineTo(1620,A3_STY+40);ctx.stroke();ctx.restore();});
  arrive(ctx,960,500,t,0.6,()=>tag(ctx,960,500,"planned work · Tuesday, 9 to 1 · power off",A3_BUS,{align:"center",size:30}),{dy:-8,a:fin(t,0.6,0.6)*(1-fin(t,tTo-0.6,0.5))});
  const frost=fin(t,w("which","medical needs")-0.3,0.8),hl=fin(t,w("cut","some homes")-0.3,0.8);
  for(let i=0;i<7;i++){const x=A3_STX(i),cl=i===2||i===5,sg=i===2?fin(t,tAn+0.2,0.6):0;arrive(ctx,x,A3_STY,t,0.5+i*0.08,()=>a3_house(ctx,x,A3_STY,1.2,mix(A3_HH,KT_AI,0.6*sg),1),{dy:10,a:pw});
    if(cl&&hl>0.01){withA(ctx,hl*(1-0.75*frost),()=>glow(ctx,x,A3_STY,90,BIZ,0.45));if(frost>0.01)withA(ctx,frost,()=>{glass(ctx,x-56,A3_STY-56,112,112,22,A3_RED,{glow:6,ea:0.7,fill:"rgba(30,34,48,0.72)"});T(ctx,"?",x,A3_STY+14,{w:800,size:40,align:"center",color:rgba(INK,0.9)});});}
    if(sg>0.01)a3_key(ctx,x+64,A3_STY-40,0.9,sg);}
  const hA=fin(t,w("cut","from a person")-0.3,0.6)*(1-fin(t,tW-0.3,0.6));if(hA>0.01)withA(ctx,hA,()=>tag(ctx,960,800,"some homes must hear it from a person first",BIZ,{align:"center",size:28}));
  const rA=fin(t,w("which","medical needs")-0.3,0.6)*(1-fin(t,tAn-0.3,0.6));if(rA>0.01)withA(ctx,rA,()=>tag(ctx,960,800,"which ones? that would mean reading medical needs",A3_RED,{align:"center",size:28}));
  // the chat, the small tool on its wall, and the list it reads, kept by the priority team
  aca_agent(ctx,820,A3_TY,40,t,{a:fin(t,0.8,0.8),busy:0.4,name:"the chat",size:28});
  const lA=fin(t,tAn-0.2,0.7);if(lA>0.01){arrive(ctx,1600,250,t,tAn-0.2,()=>{a3_card(ctx,1390,150,440,"the priority team",["the list of homes to","hand to a person"],A3_RED,{size:28});a3_icon(ctx,"lock",1790,186,A3_RED,1);},{dy:-10,a:lA});
    const tl=fin(t,w("answer","small tool")-0.3,0.7);a3_tool(ctx,A3_TX,A3_TY,{a:tl,name:"the small tool",hi:pulseAt(t,w("answer","hand this")-0.2,2.0)});
    // a signed-in household asks; the tool answers only yes or no, never why
    const u=clamp((t-w("answer","signed-in")+0.2)/1.8,0,1);if(u>0&&u<1){const x=u<0.5?lerp(A3_STX(2),820,easeCam(u*2)):lerp(820,A3_TX,easeCam(u*2-1)),y=u<0.5?lerp(A3_STY-50,A3_TY+40,easeCam(u*2)):A3_TY;glow(ctx,x,y,22,A3_HH,0.8*Math.sin(Math.PI*u));}
    const aA=fin(t,w("answer","hand this")-0.3,0.6);if(aA>0.01)arrive(ctx,A3_TX,A3_TY+170,t,w("answer","hand this")-0.3,()=>a3_bubble(ctx,A3_TX,A3_TY+168,"hand this to a person now",{chat:true,up:true,align:"center",size:28}),{dy:8,a:aA*(1-fin(t,tTo-0.3,0.6))});}
  const nW=fin(t,tWy-0.2,0.6)*(1-fin(t,tTo-0.3,0.6));if(nW>0.01)withA(ctx,nW,()=>{tag(ctx,A3_TX+290,A3_TY+168,"why?",SOFT,{align:"center",size:30});ctx.save();ctx.strokeStyle=rgba(A3_RED,0.95);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(A3_TX+240,A3_TY+184);ctx.lineTo(A3_TX+340,A3_TY+152);ctx.stroke();ctx.restore();});
  // the person who calls them back: sees why, and first checks who they're speaking to
  const pA=fin(t,w("why","calls them back")-0.3,0.7);if(pA>0.01){withA(ctx,pA,()=>{archGlyph(ctx,"actor",300,250,42,BIZ);T(ctx,"a person at the",300,360,{w:800,size:28,align:"center",color:rgba(BIZ,1)});T(ctx,"contact centre",300,396,{w:800,size:28,align:"center",color:rgba(BIZ,1)});});
    const sw=fin(t,w("why","sees why")-0.3,0.6)*(1-fin(t,tTo-0.3,0.6));if(sw>0.01)withA(ctx,sw,()=>{ctx.save();ctx.strokeStyle=rgba(BIZ,0.7);ctx.lineWidth=2.4;ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(370,200);ctx.quadraticCurveTo(900,40,1390,190);ctx.stroke();ctx.restore();T(ctx,"sees why",880,120,{w:800,size:28,align:"center",color:rgba(BIZ,1)});});
    const ck=fin(t,w("why","checks who")-0.3,0.6);if(ck>0.01){a3_phone(ctx,A3_STX(2)-70,A3_STY-80,1.0,BIZ,ck);withA(ctx,ck,()=>{ctx.save();ctx.strokeStyle=rgba(BIZ,0.8);ctx.lineWidth=2.4;ctx.setLineDash([3,8]);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(320,420);ctx.quadraticCurveTo(360,600,A3_STX(2)-100,A3_STY-70);ctx.stroke();ctx.restore();});
      arrive(ctx,560,440,t,w("why","checks who")-0.3,()=>tag(ctx,560,440,"first: who's speaking?",BIZ,{align:"center",size:28}),{dy:8,a:ck*(1-fin(t,tTo-0.3,0.6))});}}
  // the chat hands over, and tells the household
  const tA=fin(t,w("today","tells")-0.3,0.6);if(tA>0.01)arrive(ctx,960,500,t,w("today","tells")-0.3,()=>a3_bubble(ctx,760,500,"A person will call you today.",{chat:true,size:30}),{dy:8,a:tA});
  const hO=fin(t,w("today","hands over")-0.3,0.6);if(hO>0.01)withA(ctx,hO,()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,0.85);ctx.lineWidth=2.6;ctx.setLineDash([8,7]);ctx.lineDashOffset=-t*12;ctx.beginPath();ctx.moveTo(770,A3_TY);ctx.lineTo(360,250);ctx.stroke();ctx.restore();T(ctx,"hands over",560,226,{w:800,size:28,align:"center",color:rgba(KT_AI,1)});});
  ctx.restore();vign(ctx,S);});

/* ---------- 6. Who agrees ---------- */
// The head of retail asks in a ticket; each product's owner agrees in it; the data team builds the chat's place and reviews it in a
// pull request; Ama checks in test that nothing restricted is in it, and the ticket closes
scene("who",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tO=c("owners"),tT=c("team"),tA=c("ama");ctx.save();drift(ctx,t,sc,{z:0.015,y:480});
  arrive(ctx,505,450,t,0.5,()=>a3_ticket(ctx,110,200,790,"let the chat read the official products","asked by the head of retail, who answers for the chat",[["Grace","planned work"],["retail","tariffs"],["retail","accounts"]],
    {ok:[fin(t,w("owners","Grace")-0.1,0.5),fin(t,w("owners","retail")-0.1,0.5),fin(t,w("owners","tariffs and accounts")+0.4,0.5)],rowA:[fin(t,tO-0.3,0.6),fin(t,tO-0.1,0.6),fin(t,tO+0.1,0.6)],done:fin(t,w("ama","chat's place")+0.3,0.6),hi:pulseAt(t,w("ama","chat's place")+0.3,1.8)}),{dy:12,a:fin(t,0.5,0.7)});
  const oT=fin(t,w("owners","as for any new reader")-0.3,0.6)*(1-fin(t,tT-0.3,0.6));if(oT>0.01)withA(ctx,oT,()=>tag(ctx,505,640,"as for any new reader",BIZ,{align:"center",size:28}));
  // the pull request: the data team builds the place and reviews the change
  const pA=fin(t,tT-0.2,0.7);if(pA>0.01){arrive(ctx,1405,320,t,tT-0.2,()=>{const h=a3_card(ctx,1010,200,790,"pull request",["the chat's place: what it may read"],TECH,{size:30});
      withA(ctx,fin(t,w("team","reviews")-0.3,0.6),()=>{kt_gtick(ctx,1056,200+h+40,15,1);T(ctx,"reviewed by the data team",1086,200+h+50,{w:800,size:28,color:rgba(TECH,1)});});},{dy:12,a:pA});
    withA(ctx,pA,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.6);ctx.lineWidth=2.2;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(906,270);ctx.lineTo(1004,270);ctx.stroke();ctx.restore();T(ctx,"linked",955,254,{w:700,size:28,align:"center",color:rgba(SOFT,1)});});}
  // Ama, in test, before the ticket closes
  const aA=fin(t,tA-0.2,0.7);if(aA>0.01)arrive(ctx,1405,670,t,tA-0.2,()=>{const h=a3_card(ctx,1010,540,790,"in test",["nothing restricted in the chat's place"],A3_OK,{size:30});
      a3_owner(ctx,1056,540+h+40,"checked by Ama Owusu, regulatory lead",fin(t,w("ama","nothing restricted")-0.2,0.6),{size:28});},{dy:12,a:aA});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. On Databricks ---------- */
// A drawn screen, not a real one. The chat as a Databricks app, running as its own service principal; its place, one schema in
// Unity Catalog, and the only grants it holds; its help pages in a search index; the small tool, a function it may run, that
// answers yes or no; and Databricks' own advice
const A3_DWX=120,A3_DWY=100,A3_DWW=1680,A3_DWH=680,A3_DWP=640,A3_DWC=700;
const A3_TREE=[["cat","prod",0],["schema","chat_context",1],["data","tariffs",2],["data","planned_work",2],["data","glossary_terms",2],["index","help_pages_index",2],["fn","needs_person_now",2]];
scene("dbx",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tSc=c("schema"),tIx=c("index"),tFn=c("fn"),tAd=c("advice");ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  arrive(ctx,960,440,t,0.3,()=>{a3_win(ctx,A3_DWX,A3_DWY,A3_DWW,A3_DWH,"Databricks · the website's chat",TECH,{size:30});ctx.fillStyle=rgba(TECH,0.22);ctx.fillRect(A3_DWP,A3_DWY+76,2,A3_DWH-100);
    // the left pane: what Unity Catalog holds, its catalog for production, the chat's schema and what's in it, each lit as the voice
    // names it
    const tU=w("schema","one schema")-0.4;withA(ctx,fin(t,tU,0.6),()=>T(ctx,"Unity Catalog",162,206,{f:"mono",w:500,size:28,color:rgba(TECH,1)}));
    const sel=[pulseAt(t,w("schema","Unity Catalog"),1.8),pulseAt(t,w("schema","one schema"),1.8),pulseAt(t,w("schema","products there"),1.8),pulseAt(t,w("schema","products there")+0.2,1.8),pulseAt(t,w("schema","products there")+0.4,1.8),pulseAt(t,w("index","search index"),1.8),pulseAt(t,w("fn","function"),1.8)+fin(t,tFn,0.6)*(1-fin(t,tAd-0.4,0.6))];
    A3_TREE.forEach(([ic,nm,d],i)=>{const q=fin(t,(i<2?w("schema","one schema"):i<5?w("schema","products there"):i===5?w("index","search index"):w("fn","function"))-0.4+(i>=2&&i<5?(i-2)*0.15:0)+(i===1?0.15:0),0.6);if(q<=0.01)return;const y=272+i*66,x=162+d*36,s=clamp(sel[i],0,1);
      withA(ctx,q,()=>{if(s>0.01){ctx.fillStyle=rgba(TECH,0.16*s);rr(ctx,142,y-38,480,54,12);ctx.fill();}a3_icon(ctx,ic,x+14,y-12,mix(SOFT,ic==="fn"?A3_APP:TECH,0.5+0.5*s),1);T(ctx,nm,x+44,y,{f:i<2?null:"mono",w:i<2?700:500,size:28,color:rgba(mix(SOFT,INK,0.4+0.5*s),1)});});});
    // the right pane, first: the app, and who it runs as
    const aA=fin(t,0.8,0.7)*(1-fin(t,tSc-0.6,0.5));if(aA>0.01)withA(ctx,aA,()=>{T(ctx,"app",A3_DWC,226,{f:"mono",w:500,size:28,color:rgba(TECH,1)});ctx.fillStyle=rgba(TECH,0.3);ctx.fillRect(A3_DWC-10,244,1060,2);
      T(ctx,"website-chat",A3_DWC,310,{w:800,size:34,color:rgba(mix(KT_AI,INK,0.3),1)});aca_agent(ctx,A3_DWC+330,298,22,t,{});
      withA(ctx,fin(t,w("app","own identity")-0.3,0.6),()=>{T(ctx,"runs as",A3_DWC,400,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});a3_icon(ctx,"id",A3_DWC+150,390,KT_AI,1);T(ctx,"its own service principal",A3_DWC+180,400,{w:800,size:30,color:rgba(INK,0.96)});});});
    // then its grants: on its schema and what's in it, and nothing else
    const gA=fin(t,tSc-0.2,0.6);if(gA>0.01){withA(ctx,gA,()=>{[["grant",A3_DWC],["on",A3_DWC+330]].forEach(([s,x])=>T(ctx,s,x,226,{f:"mono",w:500,size:28,color:rgba(TECH,1)}));ctx.fillStyle=rgba(TECH,0.3);ctx.fillRect(A3_DWC-10,244,1060,2);
        T(ctx,"service principal: website-chat",A3_DWC+560,226,{w:700,size:28,color:rgba(mix(KT_AI,INK,0.4),1)});});
      [["USE CATALOG","prod",w("schema","Unity Catalog")],["USE SCHEMA","chat_context",w("schema","one schema")],["SELECT","chat_context",w("schema","select")],["SELECT","help_pages_index",w("index","may read")],["EXECUTE","needs_person_now",w("fn","may run")]].forEach(([g,on,t0],i)=>{const q=fin(t,t0-0.3,0.6);if(q<=0.01)return;const y=296+i*56;
        withA(ctx,q*gA,()=>{T(ctx,g,A3_DWC,y,{f:"mono",w:500,size:30,color:rgba(A3_OK,1)});T(ctx,on,A3_DWC+330,y,{f:"mono",w:500,size:30,color:rgba(INK,0.95)});});});
      const nE=fin(t,w("schema","nothing else")-0.3,0.6);if(nE>0.01)withA(ctx,nE*gA,()=>{T(ctx,"everything else",A3_DWC,584,{w:800,size:30,color:rgba(SOFT,1)});T(ctx,"no grant",A3_DWC+330,584,{w:800,size:30,color:rgba(A3_RED,1)});});}
    // the small tool, opened: what it reads and what it answers
    const fA=fin(t,w("fn","reads only")-0.3,0.6)*(1-fin(t,tAd-0.4,0.6));if(fA>0.01)arrive(ctx,1280,700,t,w("fn","reads only")-0.3,()=>{a3_card(ctx,A3_DWC-20,636,1080,"needs_person_now(account)",["reads only the list of homes to hand to a person"],A3_APP,{size:28});
      withA(ctx,fin(t,w("fn","yes or no")-0.3,0.6),()=>{tag(ctx,A3_DWC+940,670,"yes",A3_OK,{align:"center",size:28});tag(ctx,A3_DWC+1020,670,"no",SOFT,{align:"center",size:28});});},{dy:10,a:fA});
  },{dy:12});
  // Databricks' own advice
  const vA=fin(t,tAd-0.1,0.7);if(vA>0.01)arrive(ctx,960,832,t,tAd-0.1,()=>tag(ctx,960,832,"one identity for each agent, granted only what it needs",TECH,{align:"center",size:30}),{dy:8,a:vA});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. Read from the original ---------- */
// Uruk again: the scribe's copy, its last lines lit; beside it, the chat's place and the products it reads; then what three months
// gave the households
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tC=c("chat"),tSi=c("since"),tN=c("none");setScreen(ctx,S);
  // the room's warmth on the left, the present's dark on the right
  bg2(ctx);const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(58,40,28,0.95)");g.addColorStop(0.46,"rgba(30,22,18,0.75)");g.addColorStop(0.62,"rgba(10,12,22,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);motes(ctx,t,{n:30});
  ctx.save();drift(ctx,t,sc,{z:0.015,y:460});
  const L=[180,150,480,520];arrive(ctx,420,410,t,0.4,()=>{a3_tablet(ctx,...L,{n:8,top:100,bottom:150,lit:0.6});T(ctx,"his copy",420,196,{w:800,size:28,align:"center",color:rgba(ACA_INK,0.96)});
    a3_foot(ctx,...L,t,{p:1.5,hi:pulseAt(t,w("scribe","copied from the original"),1.8)+pulseAt(t,w("scribe","checked his copy"),1.8)+pulseAt(t,w("scribe","who may read it"),1.8)+0.6*fin(t,B,1.2)});},{dy:-12,a:fin(t,0.4,0.8)});
  bab_tag(ctx,420,760,"Uruk, 229 BCE",fin(t,0.8,0.7));
  // the chat's place, and what it reads
  const pA=fin(t,tC-0.3,0.8);if(pA>0.01)withA(ctx,pA,()=>{ctx.save();ctx.translate(1340,180);ctx.scale(0.5,0.5);ctx.translate(-800,-136);
    a3_place(ctx,...A3_PL,{p:clamp((t-tC)/1.6,0,1),name:"the chat's place",hi:0.6*fin(t,B,1.2),deco:1});
    [0,1,2,3].forEach(i=>{const x=A3_SL(i);if(i===3)archEl(ctx,x,A3_SY,A3_SW,A3_SH,A3_PROD[i][0],A3_BUS,"object",{size:28,deco:1});else a3_product(ctx,x,A3_SY,A3_SW,A3_SH,A3_PROD[i][0],{ct:1,size:28,deco:1});a3_level(ctx,x+A3_SW/2,411,A3_PROD[i][2],{size:28,deco:1});});
    aca_agent(ctx,800,650,44,t,{busy:0.5});a3_badge(ctx,A3_BX,630,t,{});
    [0,1,2,3].forEach(i=>{const x=A3_SL(i)+A3_SW/2;ctx.save();ctx.strokeStyle=rgba(KT_AI,0.8);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(800+(i-1.5)*10,604);ctx.bezierCurveTo(800+(i-1.5)*10,484,x,428,x,A3_SY+A3_SH+6);ctx.stroke();ctx.restore();});
    ctx.restore();});
  const cT=fin(t,w("chat","official products")-0.3,0.6);if(cT>0.01)withA(ctx,cT,()=>tag(ctx,1340,560,"the official products, and only what it may read",KT_AI,{align:"center",size:28}));
  ctx.restore();
  // three months on
  const sA=fin(t,tSi-0.2,0.7);if(sA>0.01)arrive(ctx,1340,670,t,tSi-0.2,()=>{tag(ctx,1340,650,"three months: 41,000 questions about prices",A3_HH,{align:"center",size:30});withA(ctx,fin(t,w("since","every one")-0.3,0.6),()=>tag(ctx,1340,716,"every answer from this year's tariffs",A3_OK,{align:"center",size:28}));},{dy:8,a:sA});
  const nA=fin(t,tN-0.2,0.7);if(nA>0.01)arrive(ctx,1340,790,t,tN-0.2,()=>tag(ctx,1340,790,"no caller heard about any household but their own",A3_OK,{align:"center",size:28}),{dy:8,a:nA});
  vign(ctx,S);});

/* ---------- 9. What an agent may read ---------- */
// Tomás and Inés, and the answer; then the end card
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tA=c("answer"),fade=1-fin(t,B,1.0),rl=fin(t,w("answer","belongs")-0.2,0.5);
  ctx.save();ctx.globalAlpha*=fade;drift(ctx,t,sc,{z:0.02,y:480});
  a3_who(ctx,"tomas",230,fin(t,0.6,0.8),t,{expr:a3_expr("calm","relieved",rl)});a3_who(ctx,"ines",1690,fin(t,0.8,0.8),t,{right:true,expr:a3_expr("calm","relieved",rl)});
  arrive(ctx,960,250,t,tA+0.2,()=>sticky(ctx,960,250,820,240,"An agent's context belongs on the map: the products it may read, with contracts and terms, in a place of its own, under its own identity.",{col:NOTEC[3],size:32,rot:0.01,p:clamp((t-tA-0.4)/7.0,0,1)}),{dy:-16});
  // the chat's place, small, under the note
  withA(ctx,fin(t,1.0,1.0),()=>{ctx.save();ctx.translate(960,560);ctx.scale(0.42,0.42);ctx.translate(-800,-300);a3_place(ctx,...A3_PL,{p:clamp((t-1.0)/1.8,0,1),hi:pulseAt(t,w("answer","place of its own"),2.0)});
    [0,1,2,3].forEach(i=>{const x=A3_SL(i);if(i===3)archEl(ctx,x,A3_SY,A3_SW,A3_SH,A3_PROD[i][0],A3_BUS,"object",{size:28,deco:1});else a3_product(ctx,x,A3_SY,A3_SW,A3_SH,A3_PROD[i][0],{ct:1,size:28,deco:1});});
    aca_agent(ctx,800,650,44,t,{busy:0.4});a3_badge(ctx,A3_BX,630,t,{hi:pulseAt(t,w("answer","own identity"),2.0)});ctx.restore();});
  ctx.restore();vign(ctx,S);
  acaEnd(ctx,S,t,B,"What an agent may read","The original, checked, and only what it's meant to read.","Film 3 of 6");});

/* ---------- where the chapters meet ---------- */
// The map holds two chapters: Only what it's meant to read glides on from where Context from the map ends.
const CHAPTER_JOINS={glide:["ines","level"]};
