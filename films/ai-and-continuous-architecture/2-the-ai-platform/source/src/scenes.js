/* ===== The AI platform: scenes =====
   Eleven chapters, as in ../script.md. Babylon, in Nabopolassar's reign: a city of mud brick whose wall the rain carried away, and the
   fix: brick fired in kilns and laid in bitumen, an embankment of it outside the wall and a skin of it round the temple-tower; found in
   place two and a half thousand years later. Then the utility: six agents, each reaching a model its own way; a model retired that
   stopped the crew planner; the test that sorts platform from application; the platform's services at the foot of the map; one
   gateway in front of every model; the next retirement, handled in an afternoon; who owns what; the same on Databricks; the same
   brick under every purpose; and the answer to Ravi's note.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: every shot
   drifts slowly, things arrive with a spring, and in one room the camera glides on and never cuts. Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- the present, where the first and tenth chapters end and the last begins ---------- */
// The six agents in a row, each in its role: under each, its own stack of what it stands on (st.own, 0..1), and then one platform
// under all of them (st.one, 0..1). st: a, p (they arrive), roles, roleHi, own, hiK (a capability lit, as the voice names it), one,
// platHi, busy, deco (its words drawn small on purpose, as a picture of the map seen before)
const A2_PX=k=>335+k*250,A2_PY=356;
function a2_six(ctx,t,st){const a=st.a==null?1:st.a;if(a<=0.01)return;const one=clamp(st.one||0,0,1);
  withA(ctx,a,()=>{
    // what each agent's own stack holds, named once, beside the first
    const lg=(st.legend||0)*(1-clamp(one*2,0,1));if(lg>0.01)withA(ctx,lg,()=>A2_CAP.forEach(([nm,col],k)=>{const hi=(st.hiK||[])[k]||0;T(ctx,nm,248,A2_PY+130+k*34+10,{w:800,size:28,align:"right",color:rgba(mix(col,INK,0.35-0.2*hi),1)});}));
    A2_AG.forEach(([nm,rl],k)=>{const x=A2_PX(k),q=st.p==null?1:clamp(st.p*3-k*0.3,0,1);if(q<=0.01)return;const dy=(1-spring(q*1.3))*20;
      withA(ctx,q,()=>{
        if((st.roles||0)>0.01)withA(ctx,st.roles,()=>{const hi=st.roleHi||0;if(hi>0.01)glow(ctx,x,A2_PY-96,110,A2_BUS,0.35*hi);tag(ctx,x,A2_PY-96,rl,A2_BUS,{align:"center",size:28});});
        aca_agent(ctx,x,A2_PY+dy,30,t,{busy:st.busy||0});T(ctx,nm,x,A2_PY+76+dy,{w:800,size:28,align:"center",color:rgba(mix(KT_AI,INK,0.4),1),deco:st.deco});
        // its own stack, made its own way, which sinks into the one platform as it comes
        const own=(st.own||0)*(1-clamp(one*1.8,0,1));if(own>0.01)a2_stack(ctx,x,A2_PY+112+60*clamp(one*1.8,0,1),own,k+3,{hiK:st.hiK});
        // standing on the platform: a stem down to it
        if(one>0.3)withA(ctx,clamp((one-0.3)*2,0,1),()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,0.55);ctx.lineWidth=2.4;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(x,A2_PY+96);ctx.lineTo(x,606);ctx.stroke();ctx.restore();});});});
    if(one>0.01)a2_platform(ctx,220,610,1480,{a:clamp(one*1.5-0.2,0,1),name:"the AI platform, made once and shared",p:clamp(one*1.6-0.4,0,1),hi:st.platHi||0,hiK:st.platK,deco:st.deco});});}

/* ---------- 1. Mud and fired brick ---------- */
// Babylon from across the river: the city's two walls of mud brick, the brickfield, the rain that carries the wall away, the brick
// fired and laid in bitumen, the embankment rising outside the wall, the tower's skin, and the river held; then the dig, two and a half
// thousand years later; then the utility's six agents and what they stand on
scene("brick",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tWa=c("walls"),tCo=c("count"),tR=c("rain"),tH=c("harm"),tNe=c("need"),tF=c("fired"),tRi=c("river"),tT=c("tower"),tHe=c("held"),tN=c("now");
  const tX=w("held","two and a half")-0.2,uX=fin(t,tX,1.4),uN=fin(t,tN-0.4,1.3);
  // the present, once it comes: the six agents, then their stacks, then one platform
  if(uN>0.001){setScreen(ctx,S);bg2(ctx);motes(ctx,t);ctx.save();drift(ctx,t,sc,{z:0.015,y:480});const tS=c("same"),tO=c("once");
    a2_six(ctx,t,{p:clamp((t-tN)/1.6,0,1),roles:fin(t,w("now","role")-0.2,0.7),roleHi:pulseAt(t,w("once","what each agent is for"),2.2)+0.6*fin(t,B,1.2),
      own:clamp((t-w("same","same few")+0.1)/1.6,0,1),legend:fin(t,w("same","a model")-0.3,0.6),hiK:[pulseAt(t,w("same","a model"),1.4),pulseAt(t,w("same","tools"),1.4),pulseAt(t,w("same","memory"),1.4),pulseAt(t,w("same","search"),1.4)],
      one:clamp((t-w("once","made once")+0.1)/2.2,0,1),platHi:pulseAt(t,w("once","shared"),1.8)+0.4*fin(t,B+0.4,1.4)});ctx.restore();}
  // the dig, at the river wall
  if(uX>0.001&&uN<0.999)a2_fade(ctx,uN>0.001?1-uN:1,cx=>{setScreen(cx,S);cx.save();drift(cx,t,sc,{z:0.03,y:560});a2_dig(cx,t,{p:clamp((t-tX-0.3)/2.0,0,1)});cx.restore();vign(cx,S);
    eaYear(cx,80,80,"Babylon · the early 1900s",ACA,fin(t,tX+0.6,0.7));bab_tag(cx,960,214,"his bricks, still in place",fin(t,w("held","still in place")-0.2,0.7));});
  // Babylon's walls, from across the river
  if(uX<0.999)a2_fade(ctx,1-uX,cx=>{setScreen(cx,S);cx.save();
    const tMb=w("walls","mud brick"),K=[[0,960,560,1.0],[tWa-0.2,640,700,1.55],[tMb-0.5,470,792,3.0],[tCo+0.2,1180,640,1.25],[tR+0.4,960,580,1.05],[tH-0.2,1240,670,1.6],[tNe+0.2,1120,640,1.25],
      [tF-0.2,960,600,1.05],[tRi-0.1,780,780,1.9],[tT-0.3,1440,560,1.45],[tHe-0.2,960,640,1.12]];focus(cx,t,K,1.9);
    const storm=fin(t,tR-0.6,2.4)*(1-fin(t,tNe+0.6,3.0)),late=0.55*fin(t,tHe+0.2,1.6),rain=fin(t,tR+0.1,1.6)*(1-fin(t,tNe+0.4,2.4))+0.7*fin(t,tHe+0.4,1.4);
    const melt=clamp((t-w("rain","carried")+0.3)/3.6,0,1)*(1-fin(t,tRi-0.8,2.2)),wet=Math.max(storm,late)*0.9;
    // the people inside, standing in the inner wall's breach, on the heap it has become
    const pA=fin(t,tH-0.1,0.9)*(1-fin(t,tF-0.4,0.9)),inW=Object.assign({},A2_INW,{melt});
    a2_view(cx,t,{dawn:0.3+0.35*fin(t,0,9)+0.25*fin(t,tF,5),day:0.25*fin(t,tRi,6),storm:Math.max(storm,late),rain,melt,wet,field:fin(t,tMb-0.4,1.0)*(1-fin(t,tR,1.6)),
      emb:clamp((t-w("river","embankment")+0.2)/3.2,0,1),rise:10*rain+16*fin(t,tHe+0.3,2.4),towerHi:fin(t,w("tower","temple-tower"),1.2)*(1-fin(t,tHe,1.0)),
      innerHi:fin(t,w("count","inner wall")-0.2,0.6)*(1-fin(t,tR-0.4,0.8)),
      behind:c=>{if(pA>0.01)[[1296,40,1,true],[1322,43,1,false],[1348,38,-1,false]].forEach(([x,h,d,v])=>bab_folk(c,x,a2_top(x,A2_X0,A2_IN[0],A2_IN[1],inW)+2,h,"stand",t,{a:pA,dir:d,veil:v,rim:0.65}));}});
    // the brickfield's moulder, kneeling at the mould by the pit of mud, and a carrier with the next load
    const mA=fin(t,tMb-0.4,0.9)*(1-fin(t,tR,1.2));if(mA>0.01){bab_folk(cx,392,A2_OUT[0]+44,44,"mould",t,{a:mA,dir:1,rim:0.7});bab_folk(cx,262+(t-tMb)*6,A2_OUT[0]+50,48,"carry",t,{a:mA,dir:1,step:t*3,rim:0.7});}
    // bitumen coming by river, as the brick is fired
    const bA=fin(t,w("fired","bitumen")-0.6,1.0)*(1-fin(t,tT-0.2,1.2));if(bA>0.01)bab_boat(cx,1500-(t-tF)*14,A2_WY+40,0.42,t,{a:bA,rim:0.3});
    cx.restore();a2_rain(cx,S,t,rain);setScreen(cx,S);
    // what the narration names, in screen space so it reads on a phone
    eaYear(cx,80,80,"Babylon · Nabopolassar's reign, 625 to 605 BCE",ACA,fin(t,0.6,0.8)*(1-fin(t,tR-0.6,0.6)));
    bab_tag(cx,960,214,"the temple-tower, and the city's walls",fin(t,w("city","temple-tower")-0.2,0.7)*(1-fin(t,tWa-0.2,0.6)));
    bab_tag(cx,960,214,"two walls of mud brick, dried in the sun",fin(t,w("walls","two great walls"),0.7)*(1-fin(t,tCo-0.2,0.6)));
    bab_tag(cx,960,214,"nearly 100 million bricks, in the inner wall alone",fin(t,w("count","nearly"),0.7)*(1-fin(t,tR-0.2,0.6)));
    bab_quote(cx,1040,120,780,"on account of heavy rains and downpours, its walls were carried away, and its foundations had become a heap of ruins","Nabopolassar, on the city's wall",{a:fin(t,w("rain","own words")-0.2,0.8)*(1-fin(t,tH+0.4,0.7)),size:34});
    bab_tag(cx,960,214,"it kept out neither enemies nor the river",fin(t,w("harm","neither"),0.7)*(1-fin(t,tNe-0.2,0.6)));
    bab_tag(cx,960,214,"a brick the water couldn't wash away",fin(t,w("need","a brick"),0.7)*(1-fin(t,tF-0.2,0.6)));
    // the brick, as the kilns made it: three cards of clay
    const cE=fin(t,tRi-0.5,0.7);[w("fired","baked"),w("fired","kilns"),w("fired","bitumen")].forEach((tk,k)=>{const a=fin(t,tk-0.3,0.6)*(1-cE);if(a>0.01)arrive(cx,360+k*600,250,t,tk-0.3,()=>a2_brickCard(cx,k,120+k*600,120,480,262,t),{dy:-16,a});});
    bab_tag(cx,960,214,"an embankment of baked brick, outside the wall",fin(t,w("river","embankment"),0.7)*(1-fin(t,tT-0.2,0.6)));
    // the tower's skin, in section, on clay
    const sA=fin(t,w("tower","wrapped")-0.2,0.8)*(1-fin(t,tHe-0.3,0.7));if(sA>0.01)arrive(cx,1370,320,t,w("tower","wrapped")-0.2,()=>withA(cx,sA,()=>{bab_clay(cx,900,110,940,420);
      a2_section(cx,1170,486,3.2,{cut:fin(t,w("tower","core")-0.3,0.9),skin:fin(t,w("tower","skin")-0.2,0.8)});
      withA(cx,fin(t,w("tower","core")-0.2,0.6),()=>{T(cx,"a core of",1170,428,{w:800,size:30,align:"center",color:rgba(ACA_INK,1)});T(cx,"mud brick",1170,464,{w:800,size:30,align:"center",color:rgba(ACA_INK,1)});});
      withA(cx,fin(t,w("tower","sixteen")-0.3,0.7),()=>{T(cx,"a skin of baked brick,",1400,312,{w:800,size:30,color:rgba(ACA_INK,1)});T(cx,"nearly 16 m thick",1400,352,{w:800,size:30,color:rgba(ACA_INK,1)});
        cx.save();cx.strokeStyle=rgba(ACA_INK,0.8);cx.lineWidth=2.4;cx.beginPath();cx.moveTo(1392,348);cx.lineTo(1296,420);cx.stroke();cx.restore();});}),{dy:-14});
    bab_tag(cx,960,214,"it protected the city against the river",fin(t,w("held","protected")-0.2,0.7)*(1-fin(t,tX,0.6)));
  });
  acaTitle(ctx,S,t,B+1.0,"The AI platform","made once and shared, under every agent","Film 2 of 6 · AI and continuous architecture");});

/* ---------- 2. Each its own way ---------- */
// Ravi brings Tomás a note; they follow each agent to its model, and find a different way every time; nobody can say which model
// answered a customer, or what it costs
const A2_NOTE="What should our agents share, and what is each one's own?";
const A2_WX=k=>560+k*160,A2_WY2=372;
// the three ways the narration names: [the agent's place in the row, what it is, its lines]
const A2_WAYS=[[0,"website chat",["its vendor's model, inside the","contact centre's software"]],[2,"crew planner",["a provider, called directly,","with a key kept in a script"]],[5,"map agent",["a model built into","the map's own tool"]]];
const A2_WCX=[510,900,1300];
scene("ways",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tF=c("follow"),tNo=c("nobody");ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  a2_who(ctx,"tomas",200,fin(t,0.4,0.8),t,{expr:t>tNo?"concerned":"calm"});a2_who(ctx,"ravi",1720,fin(t,c("ravi")-0.2,0.8),t,{right:true,expr:t>tNo?"concerned":"calm"});
  const nT=fin(t,w("ravi","Ravi Menon")-0.1,0.7)*(1-fin(t,c("note")+1.6,0.7));if(nT>0.01)withA(ctx,nT,()=>{tag(ctx,1690,540,"Ravi Menon · platform lead",TECH,{align:"center",size:30});T(ctx,"as in Platform and solution architecture",1876,600,{w:600,size:28,align:"right",color:rgba(SOFT,1)});});
  arrive(ctx,380,190,t,c("note")-0.3,()=>sticky(ctx,380,190,560,150,A2_NOTE,{col:NOTEC[1],size:34,rot:-0.02,p:fin(t,c("note"),1.6)}),{dy:-20});
  // the six agents, in a row
  const dim=fin(t,tNo-0.2,0.8);A2_AG.forEach(([nm],k)=>{arrive(ctx,A2_WX(k),A2_WY2,t,tF-0.4+k*0.1,()=>aca_agent(ctx,A2_WX(k),A2_WY2,24,t,{}),{dy:12});});
  // the three ways the narration names, each a card under its agent, with its own line to it
  [[c("chat"),0],[c("key"),1],[c("tool"),2]].forEach(([t0,i])=>{const[k,nm,ls]=A2_WAYS[i],x=A2_WCX[i],a=fin(t,t0-0.2,0.7)*(1-dim);if(a<=0.01)return;const ax=A2_WX(k),col=[[255,186,150],[245,206,140],[200,186,255]][i];
    withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2.6;ctx.setLineDash([8,7]);ctx.lineDashOffset=-t*10;ctx.beginPath();ctx.moveTo(ax,A2_WY2+28);ctx.bezierCurveTo(ax,A2_WY2+90,x,A2_WY2+70,x,484);ctx.stroke();ctx.restore();});
    arrive(ctx,x,560,t,t0-0.2,()=>a2_card(ctx,x-170,484,340,nm,ls,col,{size:28}),{dy:12,a});});
  // the other three, each off its own way: lines that leave in different directions, to models nobody listed
  const rA=fin(t,c("rest")-0.2,0.8)*(1-0.7*dim);if(rA>0.01)[[1,700,210],[3,1120,226],[4,1260,190]].forEach(([k,mx,my],i)=>{const ax=A2_WX(k),p=clamp((t-c("rest")+0.2-i*0.2)/1.0,0,1);
    withA(ctx,rA,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.75);ctx.lineWidth=2.2;ctx.setLineDash([6,8]);ctx.beginPath();ctx.moveTo(ax,A2_WY2-26);ctx.lineTo(lerp(ax,mx,p),lerp(A2_WY2-26,my,p));ctx.stroke();ctx.restore();});
    if(p>0.9)a2_model(ctx,mx,my,20,"",t,{a:rA*clamp((p-0.9)*10,0,1)});});
  // what nobody can say
  const q1=fin(t,w("nobody","which model")-0.2,0.7),q2=fin(t,w("nobody","what all of it costs")-0.2,0.7);
  if(q1>0.01)arrive(ctx,960,560,t,w("nobody","which model")-0.2,()=>tag(ctx,960,560,"which model answered a customer?",ACA_WARN,{align:"center",size:32}),{dy:10,a:q1});
  if(q2>0.01)arrive(ctx,960,650,t,w("nobody","what all of it costs")-0.2,()=>tag(ctx,960,650,"what does all of it cost?",ACA_WARN,{align:"center",size:32}),{dy:10,a:q2});
  ctx.restore();vign(ctx,S);});

/* ---------- 3. A model retired ---------- */
// The provider's notice, to someone who has moved on; three months later the crew planner stops; rosters by hand, jobs slip and
// households are told again; and nobody can say which other agents call the same model
const A2_JX=i=>770+i*70;
scene("retired",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tSt=c("stop"),tHa=c("hand"),tTo=c("told"),tWh=c("which");ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  // the notice, and the analyst it went to (it leaves before three months later comes)
  const nA=fin(t,0.5,0.7)*(1-fin(t,tSt-0.6,0.6));if(nA>0.01){arrive(ctx,760,300,t,0.5,()=>{a2_win(ctx,420,170,680,262,"from the model's provider",A2_RED,{size:28});
      T(ctx,"The model your key calls",452,300,{w:700,size:30,color:rgba(INK,0.95)});T(ctx,"will be retired.",452,342,{w:700,size:30,color:rgba(INK,0.95)});T(ctx,"Notice: three months.",452,400,{w:700,size:28,f:"mono",color:rgba(mix(A2_RED,INK,0.3),1)});},{dy:12,a:nA});
    const pA=fin(t,w("notice","analyst")-0.2,0.7)*nA;if(pA>0.01)withA(ctx,pA,()=>{archGlyph(ctx,"actor",1380,280,40,TECH);tag(ctx,1380,380,"the analyst who set up the key",TECH,{align:"center",size:28});
      ctx.save();ctx.strokeStyle=rgba(A2_RED,0.7);ctx.lineWidth=2.4;ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(1104,300);ctx.lineTo(1320,290);ctx.stroke();ctx.restore();});
    const mA=fin(t,w("notice","moved")-0.2,0.7)*nA;if(mA>0.01)withA(ctx,mA,()=>tag(ctx,1380,450,"moved to another team",SOFT,{align:"center",size:28}));}
  // three months later: the crew planner stops; the rosters by hand; the jobs that slip; the households told again
  const lA=fin(t,tSt-0.2,0.7)*(1-fin(t,tWh-0.6,0.6));if(lA>0.01){
    eaYear(ctx,80,80,"three months later · Monday morning",KT_AI,lA);
    const off=fin(t,w("stop","stops")-0.1,0.8);withA(ctx,lA,()=>{aca_agent(ctx,960,290,44,t,{busy:1-off});T(ctx,"crew planner",960,380,{w:800,size:30,align:"center",color:rgba(mix(KT_AI,INK,0.4),1)});
      if(off>0.01){withA(ctx,off,()=>{ctx.fillStyle="rgba(7,11,22,0.6)";ctx.beginPath();ctx.arc(960,290,48,0,TAU);ctx.fill();});kt_rcross(ctx,1010,240,24,off);}});
    const sA=fin(t,w("stop","drafting")-0.2,0.6)*lA;if(sA>0.01)withA(ctx,sA,()=>tag(ctx,960,440,"no rosters drafted",A2_RED,{align:"center",size:28}));
    const hA=fin(t,w("hand","by hand")-0.4,0.7)*lA;if(hA>0.01)arrive(ctx,380,620,t,w("hand","by hand")-0.4,()=>a2_paper(ctx,170,500,420,"this week's rosters",[["Mon: crew 3, crew 7",[52,44,40],28],["Tue: crew 2, crew 5",[52,44,40],28],["Wed: crew 4 ...",[52,44,40],28]],{rot:-0.02,p:clamp((t-w("hand","by hand")+0.2)/2.4,0,1),tsize:30}),{dy:14,a:hA});
    const jA=fin(t,w("hand","fourteen")-0.3,0.6)*lA,jS=easeCam(clamp((t-w("hand","slip")+0.1)/1.4,0,1));
    if(jA>0.01)withA(ctx,jA,()=>{for(let i=0;i<14;i++){const x=A2_JX(i)+jS*(30+8*hash(i,751)),y=494+jS*6*hash(i,752),col=mix(A2_TEC,ACA_WARN,jS);ctx.save();ctx.translate(x+28,y+30);ctx.rotate(jS*(hash(i,753)-0.5)*0.16);ctx.translate(-x-28,-y-30);
      glass(ctx,x,y,56,60,8,col,{glow:6,ea:0.8,fill:"rgba(8,12,22,0.95)"});ctx.fillStyle=rgba(col,0.85);ctx.fillRect(x+3,y+3,50,12);ctx.fillStyle=rgba(col,0.6);ctx.fillRect(x+12,y+26,32,4);ctx.fillRect(x+12,y+38,22,4);ctx.restore();}
      tag(ctx,1280,598,"14 planned jobs slip",mix(A2_TEC,ACA_WARN,jS),{align:"center",size:30});});
    const uA=fin(t,tTo-0.2,0.7)*lA,uC=clamp((t-w("told","told again")+0.2)/1.4,0,1);
    if(uA>0.01)withA(ctx,uA,()=>{for(let i=0;i<14;i++){const x=A2_JX(i)+28,y=700,q=clamp(uC*14-i*0.6,0,1);a2_house(ctx,x,y,0.62,mix(A2_HH,ACA_WARN,q),1);
        if(q>0.01)withA(ctx,q,()=>{ctx.fillStyle=rgba(ACA_WARN,0.95);ctx.beginPath();ctx.arc(x+22,y-26,7,0,TAU);ctx.fill();});}
      tag(ctx,1280,790,"310 households, told again",mix(A2_HH,ACA_WARN,uC),{align:"center",size:30});});}
  // and which other agents call that model? nobody can say
  const wA=fin(t,tWh-0.2,0.7);if(wA>0.01){A2_AG.forEach(([nm],k)=>{const x=560+k*160;arrive(ctx,x,440,t,tWh-0.2+k*0.08,()=>{aca_agent(ctx,x,440,24,t,{ghost:0.6});T(ctx,"?",x,452-56,{w:800,size:34,align:"center",color:rgba(ACA_WARN,1)});},{dy:10,a:wA});});
    withA(ctx,wA,()=>tag(ctx,960,250,"which other agents call that model?",TECH,{align:"center",size:32}));
    const nA2=fin(t,w("which","Nobody")-0.2,0.7);if(nA2>0.01)arrive(ctx,960,580,t,w("which","Nobody")-0.2,()=>tag(ctx,960,580,"nobody can say",ACA_WARN,{align:"center",size:34}),{dy:10,a:nA2});}
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Platform or application ---------- */
// The test, from Platform and solution architecture, in its own words; a model two agents could share, then tools, memory and search,
// into the platform; and what each agent is for, its own: an application, with an owner
scene("test",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tA=c("app"),tP=c("plat"),tM=c("model"),tTo=c("tools"),tMe=c("memory"),tSh=c("shared"),tO=c("own");ctx.save();drift(ctx,t,sc,{z:0.015,y:480});
  const hA=fin(t,0.4,0.7);if(hA>0.01)withA(ctx,hA,()=>T(ctx,"the test, from Platform and solution architecture",960,96,{w:700,size:30,align:"center",color:rgba(SOFT,1)}));
  arrive(ctx,510,200,t,tA-0.2,()=>a2_card(ctx,130,130,760,"an application",["one purpose, with its logic built in"],A2_APP,{size:32,hi:pulseAt(t,tO+0.4,2.0)}),{dy:12});
  arrive(ctx,1410,200,t,tP-0.2,()=>a2_card(ctx,1030,130,760,"a platform",["shared capabilities, on which many","owners build their own"],A2_TEC,{size:32,hi:pulseAt(t,tSh,2.0)}),{dy:12});
  // the platform's tray, and a model two agents could share, sliding into it
  const pA=fin(t,tM-0.3,0.7);if(pA>0.01)a2_platform(ctx,1030,600,760,{a:pA,p:0,h:150});
  const mv=easeCam(clamp((t-w("model","could use")-0.4)/1.4,0,1)),mA=fin(t,w("model","A model")-0.3,0.7);
  if(mA>0.01){const x=lerp(1410,1030+28+(760-56-72)/8,mv),y=lerp(440,600+24+20,mv),sh=1-mv;
    if(sh>0.01)withA(ctx,mA*sh,()=>{[[1180,"website chat"],[1640,"crew planner"]].forEach(([ax,nm],i)=>{const q=fin(t,w("model","the chat")-0.2+i*0.3,0.6);if(q<=0.01)return;withA(ctx,q,()=>{aca_agent(ctx,ax,400,24,t,{});T(ctx,nm,ax,464,{w:800,size:28,align:"center",color:rgba(mix(KT_AI,INK,0.4),1)});
      ctx.save();ctx.strokeStyle=rgba(KT_AI,0.7);ctx.lineWidth=2.4;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(ax+(i?-26:26),408);ctx.lineTo(x+(i?36:-36),y);ctx.stroke();ctx.restore();});});});
    if(sh>0.01)a2_model(ctx,x,y,40,"a model",t,{a:mA*sh});}
  // the four, in the tray, as each is named
  const P=[fin(t,w("model","could use")+1.4,0.5),fin(t,w("tools","tools")-0.1,0.6),fin(t,w("memory","memory")-0.1,0.6),fin(t,w("memory","search")-0.1,0.6)];
  if(pA>0.01){const bw=(760-56-72)/4;A2_CAP.forEach((cp,k)=>{const q=P[k];if(q<=0.01)return;arrive(ctx,1058+k*(bw+24)+bw/2,624+30,t,[w("model","could use")+1.4,w("tools","tools")-0.1,w("memory","memory")-0.1,w("memory","search")-0.1][k],()=>a2_capBlock(ctx,1058+k*(bw+24),624,bw,60,k,{label:true,size:30,hi:pulseAt(t,tSh,2.0)}),{dy:-16,a:q});});
    // what tools, memory and search do, under the tray, a line each as the voice says it
    const dT=fin(t,w("tools","look something up")-0.2,0.6)*(1-fin(t,tMe-0.3,0.5)),dM=fin(t,w("memory","keeps")-0.2,0.6)*(1-fin(t,w("memory","search")-0.3,0.5)),dS=fin(t,w("memory","finds")-0.2,0.6)*(1-fin(t,tSh-0.3,0.5));
    const dMo=fin(t,w("model","writes")-0.2,0.6)*(1-fin(t,w("model","serves")-0.1,0.5));if(dMo>0.01)withA(ctx,dMo,()=>T(ctx,"writes an agent's answers",1410,820,{w:700,size:30,align:"center",color:rgba(A2_CAP[0][1],1)}));
    if(dT>0.01)withA(ctx,dT,()=>T(ctx,"look something up, or do something",1410,820,{w:700,size:30,align:"center",color:rgba(A2_CAP[1][1],1)}));
    if(dM>0.01)withA(ctx,dM,()=>T(ctx,"keeps what's needed, step to step",1410,820,{w:700,size:30,align:"center",color:rgba(A2_CAP[2][1],1)}));
    if(dS>0.01)withA(ctx,dS,()=>T(ctx,"finds the right page",1410,820,{w:700,size:30,align:"center",color:rgba(A2_CAP[3][1],1)}));
    const sA=fin(t,w("shared","platform's")-0.2,0.7);if(sA>0.01)withA(ctx,sA,()=>T(ctx,"the platform's",1410,820,{w:800,size:32,align:"center",color:rgba(A2_TEC,1)}));}
  // what each agent is for: its own, an application with an owner
  const oA=fin(t,tO-0.2,0.7);if(oA>0.01){arrive(ctx,510,640,t,tO-0.2,()=>{glass(ctx,130,500,760,300,22,A2_APP,{glow:10,ea:0.85,fill:"rgba(6,12,22,0.95)"});aca_agent(ctx,230,600,30,t,{});T(ctx,"website chat",230,676,{w:800,size:28,align:"center",color:rgba(mix(KT_AI,INK,0.4),1)});
      A2_OWN.forEach((s,k)=>{const q=fin(t,w("own",["purpose","instructions","logic"][k])-0.2,0.6);if(q>0.01)withA(ctx,q,()=>tag(ctx,360,560+k*62,s,A2_APP,{size:30}));});},{dy:12,a:oA});
    const ow=fin(t,w("own","owner")-0.2,0.7);if(ow>0.01)a2_owner(ctx,380,760,"its owner answers for it",ow,{size:30});}
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Under every agent ---------- */
// Tomás's map: the six agents in the application layer, each in its role with its owner, and the platform's services at the foot,
// in the technology layer, serving every agent
const A2_MX=700,A2_MY=150,A2_MW=1080,A2_SH=84,A2_GAP=18,a2_row=i=>A2_MY+i*(A2_SH+A2_GAP);
const A2_SVC=["reach a model","call a tool","remember","search"];
// the map, with the six agents and the platform's services: o.p draws the layers, o.deco marks names as texture, o.ag (0..1) the agents
// and their roles and owners, o.svc (0..1) the services, o.serve (0..1) the lines from them up to the agents, o.agHi, o.svcHi light them
function a2_map(ctx,t,o){o=o||{};const p=o.p==null?1:o.p,deco=!!o.deco,R=layerStack(ctx,A2_MX,A2_MY,A2_MW,{p,sh:A2_SH,gap:A2_GAP,hi:o.hi,size:30});if(p<=0)return R;
  const y4=a2_row(4)+12,y2=a2_row(2)+12,y5=a2_row(5)+14,ag=o.ag||0;
  if(ag>0.01)A2_AG.forEach(([nm,rl,own],k)=>{const x=960+k*136,q=clamp(ag*2.2-k*0.24,0,1);if(q<=0.01)return;
    a2_mapEl(ctx,x,y4,124,60,nm,A2_APP,true,{a:q,t,hi:o.agHi||0});a2_mapEl(ctx,x,y2,124,60,rl,A2_BUS,false,{a:q,t});
    withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(KT_AI,0.9);ctx.fillStyle=rgba(KT_AI,1);ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+62,y4,4,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(x+62,y4);ctx.lineTo(x+62,y2+66);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x+62,y2+62);ctx.lineTo(x+57,y2+72);ctx.lineTo(x+67,y2+72);ctx.closePath();ctx.fill();ctx.restore();kt_gtick(ctx,x+62,a2_row(1)+42,13,1);
      ctx.save();ctx.strokeStyle=rgba(BIZ,0.55);ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(x+62,a2_row(1)+56);ctx.lineTo(x+62,y2-2);ctx.stroke();ctx.restore();});});
  const sv=o.svc||0;if(sv>0.01)A2_SVC.forEach((nm,k)=>{const q=clamp(sv*2-k*0.3,0,1);if(q<=0.01)return;const x=962+k*202;a2_svc(ctx,x,y5,188,56,nm,{a:q,size:21,deco,hi:(o.svcHi||[])[k]||0});
    // serving: a line up from the service to the application layer, its open arrowhead at the agents
    const sr=clamp((o.serve||0)*1.5-k*0.15,0,1);if(sr>0.01)withA(ctx,sr,()=>{ctx.save();ctx.strokeStyle=rgba(A2_TEC,0.95);ctx.lineWidth=2.4;const ax=x+94,ty=y4+62;ctx.beginPath();ctx.moveTo(ax,y5);ctx.lineTo(ax,lerp(y5,ty+4,sr));ctx.stroke();
      if(sr>0.95){ctx.beginPath();ctx.moveTo(ax-8,ty+14);ctx.lineTo(ax,ty+3);ctx.lineTo(ax+8,ty+14);ctx.stroke();}ctx.restore();});});
  return R;}
// an element on the map: a glass box with its name; an agent carries the teal orb on its corner
function a2_mapEl(ctx,x,y,w,h,name,col,agent,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const hi=o.hi||0;
  withA(ctx,a,()=>{const r=agent?8:Math.min(h/2.4,22);glass(ctx,x,y,w,h,r,col,{glow:8+18*hi,ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.12+0.14*hi);rr(ctx,x,y,w,h,r);ctx.fill();
    const gx=x+w-6,gy=y+4;ctx.save();ctx.fillStyle="rgba(7,12,24,0.97)";ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(gx,gy,14.5,0,TAU);ctx.fill();ctx.stroke();ctx.restore();
    if(agent)aca_agent(ctx,gx,gy,9,o.t||0,{});else archGlyph(ctx,"role",gx,gy,10,mix(col,INK,0.15));
    const ls=wrapT(ctx,name,0,0,w-20,{size:21,w:700,measure:true}),lh=23.5;ls.forEach((l,i)=>T(ctx,l,x+w/2,y+h/2+7.5-(ls.length-1)*lh/2+i*lh,{w:700,size:21,align:"center",color:rgba(INK,0.96),deco:true}));});}
scene("map",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tF=c("foot"),tA=c("apps"),tO=c("once"),tP=c("part");
  const K=[[0,960,540,1],[w("foot","services")-0.6,1300,620,1.48],[tO-0.2,960,540,1],[w("part","which agents")-0.5,1300,640,1.4]],z=focusZ(t,K,1.9);
  ctx.save();drift(ctx,t,sc,{z:0.015,y:480});focus(ctx,t,K,1.9);
  a2_who(ctx,"tomas",230,fin(t,0.4,0.8),t);
  a2_map(ctx,t,{p:clamp((t-0.6)/1.8,0,1),deco:z<1.3,ag:clamp((t-1.2)/2.0,0,1),agHi:pulseAt(t,w("apps","application layer"),1.8)+pulseAt(t,w("part","which agents"),1.8),
    svc:clamp((t-w("foot","services")+0.2)/1.6,0,1),svcHi:A2_SVC.map((s,k)=>pulseAt(t,w("foot",["reach a model","call a tool","remember","search"][k]),1.4)+pulseAt(t,w("part","which service"),1.8)),
    serve:clamp((t-w("apps","using")+0.2)/1.6,0,1),hi:[0,0,0,0,pulseAt(t,w("apps","application layer"),1.8),pulseAt(t,w("foot","foot"),1.8)]});
  ctx.restore();
  // what the narration names, in screen space
  const fA=fin(t,w("foot","foot")-0.2,0.6)*(1-fin(t,tA-0.3,0.6));if(fA>0.01)withA(ctx,fA,()=>tag(ctx,1300,806,"the platform's services, at the foot",A2_TEC,{align:"center",size:30}));
  const oA=fin(t,w("once","Drawn once")-0.2,0.6)*(1-fin(t,tP-0.3,0.6));if(oA>0.01)withA(ctx,oA,()=>tag(ctx,1240,84,"drawn once, under every agent",A2_TEC,{align:"center",size:30}));
  const pA=fin(t,w("part","which agents")-0.2,0.6);if(pA>0.01)withA(ctx,pA,()=>tag(ctx,1240,84,"which agents use which service",TECH,{align:"center",size:30}));
  vign(ctx,S);});

/* ---------- 6 to 8. The gateway's room ---------- */
// One room for three chapters (One door to every model, The next retirement, Who owns what): the agents along the top, the gateway
// across the middle, the models behind it, the log at the bottom left and a card at the bottom right. Each chapter passes the room's
// state; where one chapter ends the next begins from the same state, and the camera glides on (CHAPTER_JOINS).
const A2_RX=k=>260+k*280,A2_RY=200,A2_GY=440,A2_DX=960,A2_MRY=650;
const A2_MOD=[["model A",720],["model B",890],["vendor's model",1060],["model D",1230]],A2_MODE=["model E",1390];
// the vendor's model, outside the gateway beside the website chat until the chat is set to reach it through the gateway (o.vendor)
const A2_VOUT=[150,316];function a2_vendorAt(v){const e=easeCam(clamp(v,0,1)),[x0,y0]=A2_VOUT,x1=A2_MOD[2][1];return e<0.5?[lerp(x0,A2_DX,e*2),lerp(y0,A2_GY,e*2)]:[lerp(A2_DX,x1,e*2-1),lerp(A2_GY,A2_MRY,e*2-1)];}
// which model each agent calls through the gateway: model B for the crew planner, the meter agent and the map agent
const A2_USE=[2,0,1,1,0,1];
// the log's rows, in the order calls come: [agent, model]
const A2_LOG=[[2,1],[1,0],[3,1],[5,1],[4,0],[0,2]];
function a2_room(ctx,t,st){
  // the gateway's log, at the bottom left: its rows, or (st.cost) what each team's agents cost this month
  const lgA=st.log||0;if(lgA>0.01){a2_win(ctx,70,540,530,330,(st.costA||0)>0.5?"cost by team, this month":"the gateway's log",TECH,{a:lgA,size:28});
    const rows=st.rows||0,rL=1-clamp((st.costA||0)*2,0,1);if(rL>0.01)A2_LOG.forEach(([k,m],i)=>{const q=clamp(rows-i,0,1)*(i===5?fin(st.vendor||0,0.6,0.4):1);if(q<=0.01)return;const y=636+i*38,hiB=(st.logB||0)*(m===1?1:0),ret=st.moved||0,mm=m===1&&ret>0.5?"model E":A2_MOD[m][0];
      withA(ctx,q*rL*lgA*(1-0.5*(st.logB||0)*(m===1?0:1)),()=>{if(hiB>0.01){ctx.fillStyle=rgba(ACA_WARN,0.16*hiB);ctx.fillRect(84,y-27,502,36);}T(ctx,A2_AG[k][0],94,y,{f:"mono",w:500,size:28,color:rgba(mix(KT_AI,INK,0.45),1)});
        T(ctx,mm.replace("vendor's model","vendor's"),392,y,{f:"mono",w:500,size:28,color:rgba(mix(A2_CAP[0][1],INK,0.3),1)});ctx.fillStyle=rgba(TECH,0.6);ctx.fillRect(578-12-hash(i,741)*26,y-16,12+hash(i,741)*26,14);});});
    const cA=clamp((st.costA||0)*2-1,0,1);if(cA>0.01)[["retail",0.42],["network",0.86],["architecture",0.18]].forEach(([nm,v],i)=>{const q=clamp(cA*3-i*0.5,0,1);if(q<=0.01)return;const y=650+i*70;
      withA(ctx,q*lgA,()=>{T(ctx,nm,94,y,{w:800,size:30,color:rgba(BIZ,1)});glass(ctx,290,y-26,300*v*q,34,10,BIZ,{glow:6,ea:0.8,fill:"rgba(26,20,8,0.9)"});});});}
  // the models, behind the gateway: those the utility has terms with, and one it hasn't
  const mA=st.models||0;if(mA>0.01)A2_MOD.forEach(([nm,x],i)=>{const q=clamp(mA*2-i*0.25,0,1);if(q<=0.01)return;const gone=i===1?(st.gone||0):0;
    if(i===2){const v=st.vendor||0,[vx,vy]=a2_vendorAt(v),la=1-Math.sin(Math.PI*clamp(v,0,1));a2_model(ctx,vx,vy,38,null,t,{a:q,hi:(st.mHi||[])[i]||0});
      if(la>0.01)withA(ctx,q*la,()=>T(ctx,v<0.5?nm:"vendor's",vx,vy+78,{w:800,size:28,align:"center",color:rgba(mix(A2_CAP[0][1],INK,0.3),1)}));return;}
    a2_model(ctx,x,A2_MRY,38,nm,t,{a:q*(1-0.7*(st.goneFade||0)*(i===1?1:0)),dim:i===3?(st.dim||0):0,gone,hi:(st.mHi||[])[i]||0,size:28});
    if(i===1&&(st.retire||0)>0.01)withA(ctx,st.retire*(1-(st.goneFade||0)),()=>{ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(ACA_WARN,0.95);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,A2_MRY,54,0,TAU);ctx.stroke();ctx.restore();});});
  if((st.newM||0)>0.01)a2_model(ctx,A2_MODE[1],A2_MRY,38,A2_MODE[0],t,{a:st.newM,hi:st.newHi||0,size:28});
  if((st.dim||0)>0.01)withA(ctx,st.dim*mA,()=>tag(ctx,A2_MOD[3][1],A2_MRY-78,"no terms",ACA_WARN,{align:"center",size:28}));
  // the gateway
  a2_gate(ctx,110,1810,A2_GY,A2_DX,t,{a:1,p:st.gate||0,hi:st.gateHi||0});
  if((st.gate||0)>0.6)withA(ctx,clamp((st.gate-0.6)*2.5,0,1)*(1-0.9*Math.sin(Math.PI*clamp(((st.vendor||0)-0.38)/0.4,0,1))),()=>T(ctx,"gateway",A2_DX,A2_GY+70,{w:800,size:30,align:"center",color:rgba(TECH,1)}));
  // the agents along the top, each with its name, its owner (st.owners) and, for the one stuck in a loop, its limit
  A2_AG.forEach(([nm,,own],k)=>{const x=A2_RX(k),q=clamp((st.agents||0)*2-k*0.15,0,1);if(q<=0.01)return;const hi=(st.agHi||[])[k]||0,warn=(st.agWarn||[])[k]||0;
    withA(ctx,q,()=>{if(warn>0.01)withA(ctx,warn,()=>{ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(ACA_WARN,0.95);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,A2_RY,44,0,TAU);ctx.stroke();ctx.restore();});
      if(hi>0.01)glow(ctx,x,A2_RY,90,KT_AI,0.45*hi);aca_agent(ctx,x,A2_RY,30,t,{busy:(st.busy||[])[k]||0});T(ctx,nm,x,A2_RY+72,{w:800,size:28,align:"center",color:rgba(mix(KT_AI,INK,0.4),1)});
      const ow=st.owners||0;if(ow>0.01){const wd=tw(ctx,own,28,800)+46;a2_owner(ctx,x-wd/2+14,A2_RY-74,own,ow*clamp(ow*3-k*0.3,0,1),{size:28});}});});
  // the crew planner's identity, held at the door
  if((st.idA||0)>0.01)withA(ctx,st.idA,()=>tag(ctx,A2_DX+92,A2_GY-62,"comes in as: crew planner",KT_AI,{size:28}));
  // a limit: the meter agent's calls, beyond it, stop at the door
  if((st.limA||0)>0.01)withA(ctx,st.limA,()=>{const x=A2_RX(3),fl=clamp(st.limF||0,0,1);glass(ctx,x-70,A2_RY+96,140,20,10,ACA_WARN,{glow:4,ea:0.8,fill:"rgba(26,18,8,0.9)"});ctx.fillStyle=rgba(ACA_WARN,0.85);rr(ctx,x-68,A2_RY+98,136*fl,16,8);ctx.fill();
    tag(ctx,x,A2_RY+150,"its limit",ACA_WARN,{align:"center",size:28});});
  // the terms the utility has with the models' providers, and the cards that follow it at the bottom right
  if((st.terms||0)>0.01)a2_card(ctx,1480,540,384,"the utility's terms",["where its data is kept","not used for training"],BIZ,{a:st.terms,size:28});
  if((st.notice||0)>0.01)a2_card(ctx,1480,540,384,"from a provider",["model B will be retired"],ACA_WARN,{a:st.notice,size:28});
  if((st.done||0)>0.01)withA(ctx,st.done,()=>{a2_card(ctx,1480,540,384,"this time",["no roster late","no household told twice"],A2_OK,{size:28});tick_(ctx,1480+384-46,540+38,26,A2_OK,1);});
  if((st.team||0)>0.01)a2_card(ctx,1480,540,384,"Ravi's team",["runs it","sets its limits","holds the contracts"],TECH,{a:st.team,size:28});
  // calls, through the door: each agent's in turn, while the room is open
  const cl=st.calls||0;if(cl>0.01)A2_AG.forEach((ag,k)=>{const vq=k===0?clamp(((st.vendor||0)-0.85)/0.15,0,1):1;if(vq<=0.01)return;const per=3.6,ph=(t*1+k*0.61)%per/per*1.0,u=ph*2.2;if(u>=1)return;
    const m=A2_USE[k]===1&&(st.moved||0)>0.5?-1:A2_USE[k],mx=m<0?A2_MODE[1]:A2_MOD[m][1];a2_call(ctx,A2_RX(k),A2_RY+34,A2_DX,A2_GY,mx,A2_MRY-40,u,KT_AI,cl*vq);});
  // the meter agent's loop: calls fast, and stopped at the door once over its limit
  if((st.loop||0)>0.01){for(let i=0;i<6;i++){const u=((t*2.4+i/6)%1)*1.0;const x=A2_RX(3),stop=(st.limF||0)>=0.99;if(stop&&u>0.5)continue;a2_call(ctx,x,A2_RY+34,A2_DX,A2_GY,A2_MOD[1][1],A2_MRY-40,u,ACA_WARN,st.loop);}}
  // the website chat, before it comes through the gateway: its own line out to its vendor
  const vA=(st.chatOut||0)*(1-clamp((st.vendor||0)*3,0,1));if(vA>0.01)withA(ctx,vA,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=2.4;ctx.setLineDash([7,8]);ctx.beginPath();ctx.moveTo(A2_RX(0)-46,A2_RY+4);ctx.quadraticCurveTo(A2_VOUT[0]+10,A2_RY,A2_VOUT[0],A2_VOUT[1]-42);ctx.stroke();ctx.restore();});}
scene("gateway",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tG=c("gate"),tI=c("id"),tL=c("log"),tLi=c("limit"),tAl=c("allow"),tV=c("vendor");
  ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  a2_room(ctx,t,{agents:clamp((t-0.3)/1.4,0,1),models:clamp((t-0.6)/1.4,0,1),gate:clamp((t-w("gate","gateway")+0.2)/1.8,0,1),gateHi:pulseAt(t,w("gate","one door"),2.0),calls:fin(t,w("gate","goes through")-0.4,0.8),chatOut:fin(t,0.4,0.8),
    idA:fin(t,w("id","identity")-0.3,0.6)*(1-fin(t,tL-0.2,0.6)),agHi:[0,0,pulseAt(t,w("id","own identity"),2.0),0,0,0],
    log:fin(t,tL-0.3,0.7),rows:clamp((t-w("log","which agent")+0.2)/0.5,0,6),
    loop:fin(t,w("limit","stuck")-0.4,0.6)*(1-fin(t,tAl-0.4,0.6)),limA:fin(t,w("limit","limits")-0.3,0.6)*(1-fin(t,tAl-0.4,0.6)),limF:clamp((t-w("limit","stuck")+0.2)/1.6,0,1),agWarn:[0,0,0,fin(t,w("limit","stuck")-0.4,0.6)*(1-fin(t,tAl-0.4,0.6)),0,0],
    dim:fin(t,w("allow","only models")-0.2,0.8),terms:fin(t,w("allow","terms")-0.2,0.7),mHi:[pulseAt(t,w("allow","terms with"),1.6),pulseAt(t,w("allow","terms with"),1.6),pulseAt(t,w("allow","terms with"),1.6),0],
    vendor:clamp((t-w("vendor","set to")+0.2)/1.8,0,1)});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. The next retirement ---------- */
// The same room: a provider's notice; the log shows the three agents that call the model; the replacement tried on each agent's own
// checks, the owners agree; all three move in an afternoon; nothing late, nobody told twice
const A2_B3=[2,3,5];
function a2_roomEnd6(){return{agents:1,models:1,gate:1,calls:1,chatOut:1,vendor:1,log:1,rows:6,dim:1,terms:1};}
scene("swap",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tT=c("three"),tC=c("checks"),tM=c("move"),tN=c("none");ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  const st=a2_roomEnd6(),b3=fin(t,w("three","log")-0.2,0.8),mv=fin(t,w("move","move")-0.2,1.2);
  st.terms=1-fin(t,w("next","retires")-0.6,0.5);st.notice=fin(t,w("next","retires")-0.1,0.6)*(1-fin(t,tN-0.6,0.5));st.retire=fin(t,w("next","retires"),0.7);
  st.logB=b3*(1-fin(t,tN-0.4,0.8));st.agWarn=[0,0,0,0,0,0];A2_B3.forEach(k=>st.agWarn[k]=b3*(1-mv));
  st.newM=fin(t,w("checks","replacement")-0.3,0.7);st.newHi=pulseAt(t,w("checks","replacement"),1.6)+pulseAt(t,w("move","new model"),1.8);
  st.moved=mv>0.5?1:0;st.gone=fin(t,w("move","new model"),0.8);st.goneFade=fin(t,tN-0.2,1.0);st.done=fin(t,tN-0.1,0.7);
  st.agHi=[0,0,0,0,0,0];A2_B3.forEach(k=>st.agHi[k]=pulseAt(t,w("move","all three"),1.8));
  a2_room(ctx,t,st);
  // three agents: a tag over them
  const tA=fin(t,w("three","three of them")-0.2,0.6)*(1-fin(t,tC-0.3,0.5));if(tA>0.01)withA(ctx,tA,()=>tag(ctx,960,330,"three agents call model B",ACA_WARN,{align:"center",size:30}));
  // each agent's own checks, and its owner's look at the results; then the owners agree
  A2_B3.forEach((k,i)=>{const x=A2_RX(k),q=fin(t,w("checks","own checks")-0.3+i*0.25,0.6)*(1-fin(t,w("move","all three")-0.2,0.6));if(q<=0.01)return;const ok=fin(t,w("checks","results")-0.2+i*0.3,0.5);
    withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(A2_OK,0.6);ctx.lineWidth=2;ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(x,A2_RY+142);ctx.quadraticCurveTo(x,A2_GY-40,A2_DX,A2_GY-6);ctx.quadraticCurveTo(A2_MODE[1]-60,A2_GY+60,A2_MODE[1]-30,A2_MRY-34);ctx.stroke();ctx.restore();
      glass(ctx,x-100,A2_RY+96,200,44,22,A2_OK,{glow:6,ea:0.85,fill:"rgba(8,20,14,0.95)"});T(ctx,"its checks",x-82,A2_RY+127,{w:800,size:28,color:rgba(A2_OK,1)});tick_(ctx,x+76,A2_RY+118,24,A2_OK,ok);});
    const ag=fin(t,w("move","owners agree")-0.2+i*0.2,0.6)*(1-fin(t,tN-0.4,0.6));if(ag>0.01)a2_owner(ctx,x-70,A2_RY-74,A2_AG[k][2]+" agrees",ag,{size:28});});
  const aA=fin(t,w("move","afternoon")-0.2,0.6)*(1-fin(t,tN-0.3,0.5));if(aA>0.01)withA(ctx,aA,()=>tag(ctx,960,330,"all three moved, in an afternoon",A2_OK,{align:"center",size:30}));
  ctx.restore();vign(ctx,S);});

/* ---------- 8. Who owns what ---------- */
// The same room: Ravi's team owns the platform; each agent's owner answers for it; and every month, what each team's agents cost
function a2_roomEnd7(){const s=a2_roomEnd6();s.terms=0;s.notice=0;s.newM=1;s.moved=1;s.gone=1;s.goneFade=1;s.done=1;return s;}
scene("owners",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tA=c("agents"),tC=c("cost");ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  const st=a2_roomEnd7();st.done=1-fin(t,0.6,0.5);st.team=fin(t,w("platform","Ravi's team")-0.2,0.7);st.gateHi=pulseAt(t,w("platform","runs it"),1.8)+pulseAt(t,w("platform","limits"),1.6);
  st.owners=clamp((t-w("agents","owner")+0.2)/1.6,0,1);st.agHi=A2_AG.map((a,k)=>k===0?pulseAt(t,w("agents","head of retail"),1.6):k===2?pulseAt(t,w("agents","Grace"),1.6):0);
  st.costA=clamp((t-w("cost","each team")+0.6)/1.6,0,1);
  a2_room(ctx,t,st);
  // the platform, outlined as Ravi's team's: the gateway and the models behind it
  const pO=fin(t,w("platform","owner")-0.2,0.8);if(pO>0.01)withA(ctx,pO,()=>{ctx.save();ctx.setLineDash([12,9]);ctx.lineDashOffset=-t*6;ctx.strokeStyle=rgba(TECH,0.8);ctx.lineWidth=2.6;rr(ctx,640,384,820,404,26);ctx.stroke();ctx.restore();});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. On Databricks ---------- */
// A drawn screen, not a real one: Unity Gateway, built on Unity Catalog. The door from Ravi's room; then each model, who may use it,
// its limit and its calls, a split to try a new model and a fallback; the functions agents use as tools, under the data's
// permissions; and last, who serves each model: Databricks' own and other providers', through the same gateway
const A2_DBX=[["model A","network, architecture","60 a minute",0.7,"Databricks"],["model E","network, architecture","60 a minute",0.5,"another provider"],["the vendor's model","retail","30 a minute",0.4,"the chat's vendor"],["model D","nobody","",0,"another provider"]];
const A2_TOOLS=[["get_bill_summary","website chat"],["draft_work_order","meter agent"],["find_outage_notes","outage agent"]];
// one window, two panes: what Unity Catalog holds on the left, and the page that's open on the right
const A2_DWX=120,A2_DWY=100,A2_DWW=1680,A2_DWH=660,A2_DWP=500,A2_DWC=560;
// small icons for the catalog's list: a stack (the catalog), a grid (data), a hexagon (a model), braces (a function), a lock
function a2_icon(ctx,kind,x,y,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.4;ctx.lineJoin="round";ctx.lineCap="round";
  if(kind==="cat"){for(let i=0;i<3;i++){rr(ctx,x-14,y-14+i*9,28,10,4);ctx.stroke();}}
  else if(kind==="data"){rr(ctx,x-13,y-11,26,22,3);ctx.stroke();ctx.beginPath();ctx.moveTo(x-13,y-3);ctx.lineTo(x+13,y-3);ctx.moveTo(x-13,y+4);ctx.lineTo(x+13,y+4);ctx.moveTo(x-3,y-11);ctx.lineTo(x-3,y+11);ctx.stroke();}
  else if(kind==="model"){ctx.beginPath();for(let i=0;i<6;i++){const an=i*TAU/6+Math.PI/6;ctx[i?"lineTo":"moveTo"](x+13*Math.cos(an),y+13*Math.sin(an));}ctx.closePath();ctx.stroke();ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.arc(x,y,3,0,TAU);ctx.fill();}
  else if(kind==="tool"){[-1,1].forEach(d=>{ctx.beginPath();ctx.moveTo(x+d*5,y-12);ctx.quadraticCurveTo(x+d*12,y-12,x+d*12,y-5);ctx.quadraticCurveTo(x+d*12,y,x+d*16,y);ctx.quadraticCurveTo(x+d*12,y,x+d*12,y+5);ctx.quadraticCurveTo(x+d*12,y+12,x+d*5,y+12);ctx.stroke();});}
  else if(kind==="lock"){rr(ctx,x-11,y-3,22,17,4);ctx.fillStyle=rgba(col,0.25);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(x,y-4,7,Math.PI,0);ctx.stroke();}
  ctx.restore();});}
scene("dbx",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tTe=c("teams"),tSp=c("split"),tTo=c("tools"),tAn=c("any");ctx.save();drift(ctx,t,sc,{z:0.012,y:480});
  arrive(ctx,960,430,t,0.3,()=>{a2_win(ctx,A2_DWX,A2_DWY,A2_DWW,A2_DWH,"Databricks · Unity Gateway",TECH,{size:30,hi:pulseAt(t,w("any","same gateway")-0.2,1.8)});
    ctx.fillStyle=rgba(TECH,0.22);ctx.fillRect(A2_DWP,A2_DWY+76,2,A2_DWH-100);
    // the left pane: what Unity Catalog holds; the open page is lit, and data and tools share a lock once their permissions are named
    const uc=fin(t,w("ug","Unity Catalog")-0.3,0.6),lk=fin(t,w("tools","same permissions")-0.2,0.6);
    if(uc>0.01){a2_icon(ctx,"cat",162,218,TECH,uc);withA(ctx,uc,()=>T(ctx,"Unity Catalog",190,228,{w:800,size:30,color:rgba(mix(TECH,INK,0.3),1)}));}
    const sel=[0,fin(t,tTe-0.3,0.5)*(1-fin(t,tTo-0.5,0.4))+fin(t,tAn-0.3,0.5),fin(t,tTo-0.3,0.5)*(1-fin(t,tAn-0.5,0.4))];
    [["data","data"],["models","model"],["tools","tool"]].forEach(([nm,ic],i)=>{const q=fin(t,w("ug","Unity Catalog")+0.1+i*0.25,0.6);if(q<=0.01)return;const y=300+i*62,s=clamp(sel[i],0,1);
      withA(ctx,q,()=>{if(s>0.01){ctx.fillStyle=rgba(TECH,0.16*s);rr(ctx,142,y-36,340,52,12);ctx.fill();ctx.fillStyle=rgba(TECH,0.9*s);rr(ctx,142,y-36,5,52,3);ctx.fill();}
        a2_icon(ctx,ic,196,y-10,mix(SOFT,TECH,s),1);T(ctx,nm,226,y,{w:700,size:30,color:rgba(mix(SOFT,INK,0.3+0.6*s),1)});
        if(i!==1&&lk>0.01)a2_icon(ctx,"lock",452,y-10,A2_TEC,lk);});});
    // the right pane, first: the door from Ravi's room
    const dA=fin(t,0.7,0.8)*(1-fin(t,tTe-0.7,0.5));if(dA>0.01){a2_gate(ctx,640,1680,470,1160,t,{a:dA,p:1});withA(ctx,dA,()=>T(ctx,"one door to every model",1160,600,{w:800,size:34,align:"center",color:rgba(TECH,1)}));}
    // then the models: who may use each, its limit and its calls; a split to try a new model, and a fallback. Last, who serves each
    const m1=fin(t,tTe-0.2,0.6)*(1-fin(t,tTo-0.6,0.4)),m2=fin(t,tAn-0.1,0.6),last=m2>0.01,mA=last?m2:m1;
    if(mA>0.01)withA(ctx,mA,()=>{[["model",A2_DWC],["who may use it",880],["limit",1250],[last?"served by":"calls today",1470]].forEach(([s,x])=>T(ctx,s,x,226,{f:"mono",w:500,size:28,color:rgba(TECH,1)}));ctx.fillStyle=rgba(TECH,0.3);ctx.fillRect(A2_DWC-10,244,1220,2);});
    A2_DBX.forEach(([m,who,lim,v,by],i)=>{const q=last?fin(t,tAn-0.1+i*0.15,0.6):fin(t,w("teams","which models")-0.2+i*0.25,0.6)*m1;if(q<=0.01)return;const y=306+i*62;
      withA(ctx,q,()=>{T(ctx,m,A2_DWC,y,{w:800,size:30,color:rgba(mix(A2_CAP[0][1],INK,0.3),i===3?0.5:1)});T(ctx,who,880,y,{w:700,size:30,color:rgba(i===3?SOFT:BIZ,1)});
        withA(ctx,last?1:fin(t,w("teams","limits")-0.2,0.6),()=>T(ctx,lim,1250,y,{w:700,size:30,color:rgba(ACA_WARN,1)}));
        if(last){const hi=i===0?pulseAt(t,w("any","own models")-0.2,1.6):pulseAt(t,w("any","other")-0.2,1.6);withA(ctx,fin(t,tAn+0.3+i*0.15,0.5),()=>T(ctx,by,1470,y,{w:700,size:30,color:rgba(mix(SOFT,mix(TECH,INK,0.35),0.4+0.6*hi),1)}));}
        else{const cv=fin(t,w("teams","keeps track")-0.2,0.8);if(cv>0.01&&v>0)withA(ctx,cv,()=>{for(let k=0;k<12;k++){const hh=6+v*30*(0.4+0.6*hash(k+i*13,751));ctx.fillStyle=rgba(TECH,0.7);ctx.fillRect(1470+k*22,y-hh+4,14,hh);}});}});});
    const sA=fin(t,tSp-0.2,0.7)*m1;if(sA>0.01)withA(ctx,sA,()=>{T(ctx,"split calls:",A2_DWC,600,{w:700,size:30,color:rgba(INK,0.9)});
      tag(ctx,780,590,"90% model E",A2_CAP[0][1],{size:28});tag(ctx,1000,590,"10% a new model",A2_CAP[0][1],{size:28});
      const fb=fin(t,w("split","fall back")-0.2,0.6);if(fb>0.01)withA(ctx,fb,()=>{T(ctx,"if one fails:",A2_DWC,676,{w:700,size:30,color:rgba(INK,0.9)});tag(ctx,780,666,"fall back to model A",ACA_WARN,{size:28});});});
    // the functions agents use as tools, kept in Unity Catalog under the data's permissions
    const uA=fin(t,tTo-0.1,0.6)*(1-fin(t,tAn-0.6,0.4));if(uA>0.01){withA(ctx,uA,()=>{[["function",A2_DWC],["who may run it",1100]].forEach(([s,x])=>T(ctx,s,x,226,{f:"mono",w:500,size:28,color:rgba(A2_TEC,1)}));ctx.fillStyle=rgba(A2_TEC,0.3);ctx.fillRect(A2_DWC-10,244,1220,2);});
      A2_TOOLS.forEach(([f,who],i)=>{const q=fin(t,tTo+0.3+i*0.3,0.6)*uA;if(q<=0.01)return;const y=314+i*70;withA(ctx,q,()=>{T(ctx,f,A2_DWC,y,{f:"mono",w:500,size:30,color:rgba(mix(A2_CAP[1][1],INK,0.25),1)});T(ctx,who,1100,y,{w:800,size:30,color:rgba(mix(KT_AI,INK,0.4),1)});});});
      if(lk>0.01)withA(ctx,lk*uA,()=>tag(ctx,1160,580,"the same permissions as the data",A2_TEC,{align:"center",size:30}));}
  },{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 10. One brick, many purposes ---------- */
// Babylon again at dawn: the river wall and the temple-tower, one baked brick in both, each for its own purpose; then the utility's
// six agents on one platform
scene("brickback",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tAg=c("agents"),uN=fin(t,tAg-0.4,1.3);
  if(uN>0.001){setScreen(ctx,S);bg2(ctx);motes(ctx,t);ctx.save();drift(ctx,t,sc,{z:0.012,y:480});a2_six(ctx,t,{p:1,roles:1,roleHi:pulseAt(t,w("agents","own purpose"),2.0)+0.5*fin(t,B,1.2),one:1,platHi:pulseAt(t,w("agents","one platform"),2.0)});ctx.restore();}
  if(uN<0.999)a2_fade(ctx,1-uN,cx=>{setScreen(cx,S);cx.save();const K=[[0,960,600,1.05],[c("purpose")-0.2,960,560,1.0]];focus(cx,t,K,2.2);
    // the same brick in both: the river wall lights, then the tower; then what each was for, said at each. All leaves before the agents come
    const out=1-fin(t,tAg-1.2,0.6),hR=fin(t,w("purpose","holding back")-0.2,0.7)*out,hT=fin(t,w("purpose","raising")-0.2,0.7)*out;
    a2_view(cx,t,{dawn:0.75,day:0.35,emb:1,embHi:pulseAt(t,w("same","river wall")-0.2,2.4)+0.5*hR,towerHi:pulseAt(t,w("same","temple-tower")-0.2,2.4)+0.5*hT});
    [[520,735,762,790,"holding back a river",hR],[1100,336,359,392,"raising the house of a god",hT]].forEach(([x,y,y0,y1,s,a])=>{if(a<=0.01)return;
      withA(cx,a,()=>{cx.save();cx.strokeStyle=rgba(BAB_CLAY,0.85);cx.lineWidth=2;cx.setLineDash([4,5]);cx.beginPath();cx.moveTo(x,y0);cx.lineTo(x,y1);cx.stroke();cx.restore();});bab_tag(cx,x,y,s,a);});
    cx.restore();setScreen(cx,S);
    const bA=fin(t,1.1,0.8)*(1-fin(t,c("purpose")-0.4,0.6));if(bA>0.01)arrive(cx,960,250,t,1.1,()=>{bab_clay(cx,760,120,400,250);bab_brick(cx,960,214,110,{});T(cx,"one baked brick",960,340,{w:800,size:30,align:"center",color:rgba(ACA_INK,0.96)});},{dy:-14,a:bA});
    vign(cx,S);});});

/* ---------- 11. The AI platform ---------- */
// Tomás and Ravi, the note and its answer, and the six agents on one platform; then the end card
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tA=c("answer"),tN=c("next"),fade=1-fin(t,B,1.0);
  ctx.save();ctx.globalAlpha*=fade;drift(ctx,t,sc,{z:0.02,y:480});
  a2_who(ctx,"tomas",230,fin(t,0.6,0.8),t,{expr:t>w("answer","answer")?"relieved":"calm"});a2_who(ctx,"ravi",1690,fin(t,0.8,0.8),t,{right:true,expr:t>w("answer","answer")?"relieved":"calm"});
  arrive(ctx,380,190,t,0.6,()=>sticky(ctx,380,190,560,150,A2_NOTE,{col:NOTEC[1],size:34,rot:-0.02}),{dy:-20});
  arrive(ctx,960,250,t,tA+0.3,()=>sticky(ctx,1040,236,640,200,"Share the platform's models, gateway, tools, memory and search. Keep each agent's purpose its own.",{col:NOTEC[3],size:30,rot:0.012,p:clamp((t-tA-0.5)/6.0,0,1)}),{dy:-16});
  // the agents on the platform, small, under the notes
  ctx.save();ctx.translate(960,0);ctx.scale(0.62,0.62);ctx.translate(-960,330);a2_six(ctx,t,{a:fin(t,1.0,1.0),p:clamp((t-1.0)/1.6,0,1),roles:0,deco:1,one:clamp((t-1.4)/1.8,0,1),platHi:pulseAt(t,w("answer","share"),2.0)+pulseAt(t,w("next","read"),2.0)});ctx.restore();
  ctx.restore();vign(ctx,S);
  acaEnd(ctx,S,t,B,"The AI platform","Agents share one platform; what each is for stays its own.","Film 2 of 6");});

/* ---------- where the chapters meet ---------- */
// The gateway's room holds three chapters: The next retirement and Who owns what glide on from where the one before ends.
const CHAPTER_JOINS={glide:["swap","owners"]};
