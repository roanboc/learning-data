/* ===== Kept alive: scenes =====
   Nine chapters, as in ../script.md. Babylon, 331 BCE, at dusk: Alexander enters the city; Etemenanki, falling into ruin; his order to
   clear it and build it again, Strabo's ten thousand men for two months, the tower outlined as it was to be; his death in June 323 BCE,
   and the outline gone; the ruin as a quarry for centuries, the houses nearby rising from its bricks; a house wall, its stamped bricks
   in it; the hole in the ground the excavators found; World Heritage, asked for in 1983 and listed in 2019; Iraq's archaeologists at the
   site today. Then the utility: the map as a tower, and what it describes moving under it; a solar home, the field app's four steps and
   the manual's five, the panels that could keep a street's wires live, and the copy the assistant answered from; the map agent's full
   read against what's running, and the differences it finds; copies, and reading where things are kept; the metering lead who retired,
   and the owner check that now reads the staff directory; keeping the map as a capability with an owner, a budget and a rhythm; the
   five series, one idea; back to Babylon, the city wall's words, the tower that fell, Babel; the next spring; and the answer.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: every shot
   drifts slowly, things arrive with a spring, a picture that leaves while another comes fades as one (a6_fade). Sound: every effect in
   tools/score.py fires at the same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- small helpers ---------- */
// a label that comes in with a spring at t0 and leaves at t1 (or stays, if t1 is null), in screen space: what the narration names
function a6_say(ctx,t,x,y,s,col,t0,t1,o){o=o||{};const q=fin(t,t0,0.6)*(t1==null?1:1-fin(t,t1,0.6))*(o.a==null?1:o.a);if(q<=0.01)return;
  arrive(ctx,x,y,t,t0,()=>tag(ctx,x,y,s,col,{align:o.align||"center",size:o.size||30}),{dy:8,a:q});}
// a moment: in from a, out from b, each over d seconds
const a6_win=(t,a,b,d)=>fin(t,a,d||0.5)*(1-fin(t,b,d||0.5));

/* ---------- 1. Allowed to collapse, again ---------- */
// Babylon, wide: the horizon at A6_HZ, the tower at A6_TX on the ground at A6_TY, s pixels to a metre
const A6_HZ=600,A6_TX=980,A6_TY=662,A6_TS=3.4;
// Alexander's party, walking in from the left along the near ground and stopping to face the tower: Alexander first, cloaked, then his
// soldiers with their helmets and spears; t0: when they start; a: faded as one picture (at his death)
function a6_party(ctx,t,t0,a){if(a<=0.01)return;const u=clamp((t-t0)/7.5,0,1),walking=u<1,x=lerp(-260,600,easeCam(u));
  a6_fade(ctx,a,c2=>{for(let i=3;i>=0;i--){const xi=x-i*64-(i?24:0),y=772+(i%2)*6;a6_figure(c2,xi,y,i?60:64,t,i?{wear:"chiton",head:"helm",spear:true,walk:walking,step:t*3.1+i*1.6,dir:1,rim:0.6}:{wear:"chiton",cloak:true,head:"mane",walk:walking,step:t*3.1,dir:1,rim:0.7});}});}
// Workers clearing the mound, as Alexander ordered: two streams carrying baskets from the ruin outwards, each walking in and out of the
// dusk; a: how many are at work (0..1)
function a6_clearing(ctx,t,a){if(a<=0.01)return;for(let i=0;i<30;i++){const side=i%2?1:-1,u=((t*0.06+hash(i,791))%1),x0=A6_TX+side*(70+hash(i,792)*70),x1=A6_TX+side*(330+hash(i,793)*280),y=688+hash(i,794)*48,al=Math.sin(Math.PI*u)*clamp(a*1.6-hash(i,798)*0.6,0,1);
  if(al<=0.01)continue;a6_figure(ctx,lerp(x0,x1,u),y,24+hash(i,795)*8+(y-688)*0.18,t,{wear:"robe",head:hash(i,796)<0.4?"cloth":null,beard:hash(i,797)<0.6,carry:true,dir:side,step:t*3.6+i*1.3,a:al,rim:0.5*Math.pow(al,6)});}}
// The townspeople of later centuries, carrying the ruin's bricks to the houses nearby, in robes and head cloths; a (0..1)
function a6_quarry(ctx,t,a){if(a<=0.01)return;for(let i=0;i<16;i++){const u=((t*0.075+hash(i,801))%1),y=704+hash(i,802)*44,x0=A6_TX+90+hash(i,803)*60,x1=1430+hash(i,804)*420,al=Math.sin(Math.PI*u)*a;
  if(al<=0.01)continue;a6_figure(ctx,lerp(x0,x1,u),y,28+(y-704)*0.2,t,{wear:"robe",head:"cloth",beard:hash(i,805)<0.5,carry:true,dir:1,step:t*3.4+i*1.7,a:al,rim:0.5*Math.pow(al,6)});}}
// the World Heritage List's entry, as a card: Babylon, the year Iraq asked, the year it was listed; p1, p2 (0..1) each year's row
function a6_wh(ctx,x,y,w,p1,p2,a){if(a<=0.01)return;const h=262;withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,BAB_CLAY,{glow:12,ea:0.88,fill:"rgba(20,14,10,0.95)"});
  T(ctx,"World Heritage List",x+30,y+50,{f:"mono",w:500,size:28,color:rgba(BAB_CLAY,1)});T(ctx,"Babylon, Iraq",x+30,y+104,{w:800,size:36,color:rgba(INK,0.98)});
  withA(ctx,p1,()=>{T(ctx,"1983",x+30,y+166,{w:800,size:30,color:rgba(BAB_CLAY,1)});T(ctx,"Iraq asks",x+130,y+166,{w:700,size:30,color:rgba(INK,0.94)});});
  withA(ctx,p2,()=>{T(ctx,"2019",x+30,y+222,{w:800,size:30,color:rgba(A6_OK,1)});T(ctx,"listed",x+130,y+222,{w:700,size:30,color:rgba(INK,0.94)});});});}
// The utility, at the opening's end: the map as a tower of glass, its layers its stages, kept by someone whose job it is; under it,
// what it describes, moving: processes, words, people and what agents know; then, wordless, the map kept while they move
function a6_now(ctx,t,c,w,B){const tUt=c("utility"),tMo=c("moves"),kp=fin(t,w("utility","someone keeps")-0.3,1.0);
  a6_mapTower(ctx,960,560,1.0,t,{p:clamp((t-tUt+0.3)/2.0,0,1),hi:kp*(0.8+0.2*Math.sin(t*1.3))});
  const kA=kp;if(kA>0.01)withA(ctx,kA,()=>{const s="kept by someone whose job it is",w2=tw(ctx,s,28,800)+64;glass(ctx,960-w2/2,578,w2,48,24,BIZ,{glow:10,ea:0.9,fill:"rgba(14,12,6,0.97)"});kt_gtick(ctx,960-w2/2+24,602,11,1);T(ctx,s,960-w2/2+46,612,{w:800,size:28,color:rgba(BIZ,1)});});
  a6_say(ctx,t,960,96,"the map, like the tower",BIZ,w("utility","like the tower")-0.3,w("utility","it stays")-0.7);
  a6_say(ctx,t,960,96,"true only while someone keeps it",BIZ,w("utility","it stays")-0.1,tMo-0.8);
  a6_say(ctx,t,960,96,"and what it describes keeps moving",SOFT,tMo-0.2,B+0.6);
  a6_lanes(ctx,t,680,{a:fin(t,tMo-0.4,0.8),on:[fin(t,w("moves","processes")-0.3,0.6),fin(t,w("moves","words")-0.3,0.6),fin(t,w("moves","people")-0.3,0.6),fin(t,w("moves","what agents")-0.3,0.6)]});}
scene("fall",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tCi=c("city"),tRu=c("ruin"),tOr=c("order"),tSt=c("strabo"),tDi=c("died"),tQu=c("quarry"),tWa=c("walls"),tNe=c("need"),tLi=c("listed"),tKe=c("keepers"),tUt=c("utility");
  const tHo=w("walls","until the tower"),uW=fin(t,tWa-0.6,1.2),uH=fin(t,tHo-0.5,1.3),uU=fin(t,tUt-0.6,1.3);
  // the utility, today
  if(uU>0.001){setScreen(ctx,S);bg2(ctx);motes(ctx,t);ctx.save();drift(ctx,t-tUt+0.6,{dur:sc.dur-tUt},{z:0.02,y:480});a6_now(ctx,t,c,w,B);ctx.restore();vign(ctx,S);}
  // where the tower stood: the hole in the ground the excavators found, at dusk; then, as the years pass to 2019, the morning; and today,
  // Iraq's archaeologists along its edge
  if(uH>0.001&&uU<0.999)a6_fade(ctx,uU>0.001?1-uU:1,cx=>{setScreen(cx,S);cx.save();
      focus(cx,t,[[0,960,650,1.04],[tNe-0.4,960,700,1.14],[tLi-0.2,960,640,1.0],[tKe-0.3,900,690,1.1]],2.0);
      const mo=clamp((t-tLi-0.3)/(w("listed","In twenty nineteen")-tLi+0.6),0,1),dawn=lerp(0.5,0.95,mo),day=lerp(0,0.85,easeCam(mo));
      a6_plain(cx,t,{hz:560,dawn,day,sunX:1700});a6_hole(cx,t,{hz:560,dawn,day,fence:fin(t,tKe+0.4,1.0),hi:0.8*a6_win(t,w("walls","a hole")-0.2,tNe+1.5,0.8)});
      const kA=fin(t,tKe-0.2,0.8);if(kA>0.01)for(let i=0;i<2;i++){const u=clamp((t-tKe+0.2)/9,0,1);a6_figure(cx,lerp(240,700,u)+i*96,862+i*4,76,t,{wear:"work",head:"hat",rod:i===0,walk:u<1,step:t*2.8+i*1.9,dir:1,a:kA,rim:0.4*Math.pow(kA,6)});}
      cx.restore();setScreen(cx,S);vign(cx,S);
      eaYear(cx,80,80,"Babylon · the early 1900s",ACA,a6_win(t,tHo+0.2,tLi-0.8,0.6));
      eaYear(cx,80,80,"Babylon · 1983",ACA,a6_win(t,w("listed","In nineteen")-0.2,w("listed","In twenty nineteen")-0.7,0.5));
      eaYear(cx,80,80,"Babylon · 2019",ACA,a6_win(t,w("listed","In twenty nineteen")-0.1,tKe-0.7,0.5));
      eaYear(cx,80,80,"Babylon · today",ACA,fin(t,tKe-0.1,0.6));
      bab_tag(cx,960,214,"mostly a hole in the ground",a6_win(t,w("walls","a hole")-0.2,tNe-0.7,0.6));
      bab_tag(cx,960,214,"what was left needed keepers",a6_win(t,tNe-0.1,w("need","whose job")-0.7,0.6));
      bab_tag(cx,960,214,"keepers, whose job it was",a6_win(t,w("need","whose job")-0.1,tLi-0.4,0.6),{col:ACA_WARN});
      a6_wh(cx,1250,150,560,fin(t,w("listed","Iraq asked")-0.2,0.6),fin(t,w("listed","UNESCO listed")-0.2,0.6),fin(t,w("listed","In nineteen")-0.3,0.7));
      bab_tag(cx,620,214,"Iraq's archaeologists keep it",a6_win(t,w("keepers","archaeologists")-0.2,B+0.5,0.6));
      bab_tag(cx,620,290,"under the world's protection",a6_win(t,w("keepers","protection")-0.2,B+0.5,0.6));
      bab_tag(cx,620,366,"UNESCO: extremely vulnerable",a6_win(t,w("keepers","extremely")-0.2,B+0.5,0.6),{col:ACA_WARN});});
  // a house's wall nearby, built of the tower's bricks, its stamped bricks among them
  if(uW>0.001&&uH<0.999)a6_fade(ctx,uH>0.001?1-uH:1,cx=>{setScreen(cx,S);cx.save();focus(cx,t,[[0,940,520,1.04],[w("walls","history")-0.5,780,560,1.16]],2.4);
      a6_houseWall(cx,t,{st:fin(t,w("walls","history")-0.3,0.9),lamp:1});cx.restore();setScreen(cx,S);vign(cx,S);
      eaYear(cx,80,80,"Hillah, near Babylon · the 1800s",ACA,a6_win(t,tWa+0.1,tHo-1.1,0.6));
      bab_tag(cx,960,214,"Babylon's stamped bricks, in house walls",a6_win(t,tWa-0.1,tHo-0.6,0.6));});
  // Babylon at dusk: Alexander's party; the ruin; the order to clear it and build it again, and the work; his death, and the outline
  // gone; then the centuries, the ruin a quarry and the houses nearby rising from its bricks
  if(uW<0.999)a6_fade(ctx,1-uW,cx=>{setScreen(cx,S);cx.save();
      focus(cx,t,[[0,960,560,1.0],[w("city","Alexander")-0.4,700,640,1.2],[tRu-0.3,A6_TX,560,1.46],[tOr-0.2,840,610,1.16],[tSt-0.2,980,590,1.04],[tDi+0.8,960,560,1.0],[tQu-0.2,1240,620,1.1]],1.9);
      const night=fin(t,tDi-0.2,6.0),dawn=0.62-0.26*night+0.14*fin(t,tQu+2.5,5),day=0,q=clamp((t-tQu+0.3)/(tWa-tQu+0.4),0,1),clr=clamp((t-tSt)/(tDi-tSt+1),0,1);
      bab_sky(cx,t,{hz:A6_HZ,dawn,day,sunX:1760,moonX:420});bab_city(cx,t,{hz:A6_HZ,dawn,day,gap:[760,1220]});a6_lamps(cx,A6_HZ,clamp(0.45+0.55*night,0,1),t);
      bab_ground(cx,t,{hz:A6_HZ,dawn,day,river:false});
      const gh=fin(t,w("order","build it again")-0.3,1.1)*(1-fin(t,w("died","never rebuilt")-0.2,1.8));
      a6_ruin(cx,A6_TX,A6_TY,A6_TS,{m:38-7*clr-26*q,ruin:1-0.35*q,rubble:1-0.7*q,ghost:gh,dawn,day,hi:0.5*pulseAt(t,tRu+0.4,2.4)});
      a6_houses(cx,746,q,t,{dawn,day,lamp:clamp(0.3+night,0,1)});
      a6_clearing(cx,t,fin(t,w("order","cleared")-0.4,1.6)*(1-fin(t,w("died","dies")-0.3,2.4)));
      a6_quarry(cx,t,fin(t,w("quarry","became a quarry")-0.3,1.4)*(1-fin(t,tWa-1.4,1.0)));
      a6_party(cx,t,tCi+0.6,1-fin(t,w("died","dies")-0.4,1.8));
      cx.restore();setScreen(cx,S);vign(cx,S);
      eaYear(cx,80,80,"Babylon · 331 BCE",ACA,fin(t,tCi-0.2,0.8)*(1-fin(t,tDi-0.7,0.6)));
      eaYear(cx,80,80,"Babylon · June 323 BCE",ACA,a6_win(t,tDi-0.1,tQu-0.7,0.6));
      eaYear(cx,80,80,"Babylon · the centuries after",ACA,a6_win(t,tQu-0.1,tWa-0.7,0.6));
      bab_tag(cx,960,214,"Alexander the Great enters Babylon",a6_win(t,w("city","Alexander")-0.2,w("city","nearly")-0.6,0.6));
      bab_tag(cx,960,214,"nearly 300 years after Nabopolassar began to rebuild it",a6_win(t,w("city","nearly"),tRu-0.7,0.6));
      bab_tag(cx,960,214,"Etemenanki, falling into ruin",a6_win(t,tRu-0.1,w("ruin","In the centuries")-0.6,0.6));
      bab_tag(cx,960,214,"for centuries, not kept up",a6_win(t,w("ruin","In the centuries"),tOr-0.4,0.6),{col:ACA_WARN});
      bab_tag(cx,960,214,"cleared away, to build it again",a6_win(t,w("order","cleared")-0.2,tSt-0.3,0.6));
      const pA=a6_win(t,tSt-0.1,tDi-0.3,0.7);if(pA>0.01)a6_parch(cx,1220,110,600,["Clearing it was work","for ten thousand men,","for two months."],"after Strabo, Geography 16.1.5",{a:pA,size:36});
      bab_tag(cx,600,214,"10,000 men · two months",a6_win(t,w("strabo","ten thousand")-0.2,tDi-0.3,0.6));
      bab_tag(cx,960,214,"Alexander dies in Babylon",a6_win(t,w("died","Alexander dies")-0.2,w("died","and the tower")-0.6,0.6));
      bab_tag(cx,960,214,"the tower is never rebuilt",a6_win(t,w("died","and the tower"),tQu-0.7,0.6),{col:ACA_WARN});
      bab_tag(cx,960,214,"with nobody to keep them: a quarry",a6_win(t,tQu-0.1,w("quarry","For centuries")-0.6,0.6));
      bab_tag(cx,960,214,"its bricks carried off to houses nearby",a6_win(t,w("quarry","For centuries"),tWa-0.6,0.6));});
  acaTitle(ctx,S,t,B+0.8,"Kept alive","an owner, a budget and a rhythm, not an end date","Film 6 of 6 · AI and continuous architecture");});

/* ---------- 2. Five steps, not four ---------- */
// The street, on the right: its line from the pole, a home with new solar panels and two homes without, each with its line down from
// the street's; the field app's steps, the manual's, and the copy the assistant answers from
const A6_ST={x0:1000,x1:1860,y:560},A6_HOMES=[[1240,0],[1480,1],[1720,1]],A6_HY=740,A6_HS=1.5;
const A6_FOUR=["Check the home's approval","Fit a two-way meter","Connect the panels","Switch the panels on"],A6_FIVE=[...A6_FOUR,"Check they stop if the street is off"];
// the homes along the street: o.off (0..1) the street's power off; o.live (0..1) the solar home's panels keeping its line live; o.ok
function a6_homes(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const off=clamp(o.off||0,0,1);
  withA(ctx,a,()=>{A6_HOMES.forEach(([x,plain])=>{ctx.save();ctx.strokeStyle=rgba(mix(A6_NET,A6_DIM,0.7*off),0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+40,A6_ST.y);ctx.lineTo(x+22*A6_HS,A6_HY+4*A6_HS);ctx.stroke();ctx.restore();
    a6_solar(ctx,x,A6_HY,A6_HS,t,{plain:!!plain,dark:off,live:plain?0:o.live||0,ok:plain?0:o.ok||0});});});}
// the week's job sheets, as a supervisor reads them: a row for each home, its street and how many of its steps were done; a row short
// of one is marked amber as o.flag goes to 1
const A6_JOBS=[["Ash Lane","4 of 5 steps",1],["Mill Road","5 of 5 steps",0],["Hill Row","4 of 5 steps",1],["Quay Street","5 of 5 steps",0]];
function a6_sheets(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,gap=64,h=112+rows.length*gap;if(a<=0.01)return h;const fl=clamp(o.flag||0,0,1);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,A6_NET,{glow:12,ea:0.85,fill:"rgba(7,11,22,0.97)"});T(ctx,"job sheets · this week",x+32,y+54,{f:"mono",w:500,size:28,color:rgba(A6_NET,1)});
    rows.forEach(([st,done,short],i)=>{const yy=y+122+i*gap,am=short?fl:0,mx=x+w-56,my=yy-10;
      if(am>0.01){ctx.save();ctx.fillStyle=rgba(ACA_WARN,0.12*am);rr(ctx,x+18,yy-38,w-36,56,14);ctx.fill();ctx.restore();}
      T(ctx,st,x+40,yy,{w:800,size:30,color:rgba(INK,0.96)});T(ctx,done,x+w*0.46,yy,{w:700,size:30,color:rgba(mix(SOFT,ACA_WARN,am),1)});
      if(!short){ring(ctx,mx,my,15,A6_OK,0.9,2.2);tick_(ctx,mx,my,15,A6_OK,0.9);}
      else{ctx.save();ctx.strokeStyle=rgba(mix(SOFT,ACA_WARN,am),0.5+0.5*am);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(mx,my,15,0,TAU);ctx.stroke();
        if(am>0.01){ctx.globalAlpha*=am;ctx.lineCap="round";ctx.strokeStyle=rgba(ACA_WARN,1);ctx.beginPath();ctx.moveTo(mx,my-8);ctx.lineTo(mx,my+2);ctx.moveTo(mx,my+7);ctx.lineTo(mx,my+8);ctx.stroke();}ctx.restore();}});});return h;}
scene("five",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tYe=c("year"),tAs=c("asks"),tFi=c("five"),tWh=c("why"),tCo=c("copy"),tTw=c("two"),tGr=c("grace");
  ctx.save();focus(ctx,t,[[0,1430,640,1.22],[tAs-1.9,960,540,1.0]],1.9);drift(ctx,t,sc,{z:0.02,y:480});
  // the street, as one of Grace's crews connects the home's new panels; away while the manual shows the fifth step; back, switched off,
  // to say why it matters
  const sA=fin(t,0.2,0.9)*(1-fin(t,tFi-0.9,0.5)),wA=a6_win(t,tWh-0.3,tCo-0.9,0.6);
  if(sA>0.01){withA(ctx,sA,()=>{a6_street(ctx,t,A6_ST.x0,A6_ST.x1,A6_ST.y,{});a6_homes(ctx,t,{});
      const u=clamp((t-tYe-0.4)/2.2,0,1);a6_crew(ctx,lerp(1030,1132,easeCam(u)),800,46,A6_NET,fin(t,tYe+0.2,0.6));
      const cn=pulseAt(t,w("year","connects")+0.3,1.8);if(cn>0.01)glow(ctx,1240+22*A6_HS,A6_HY+10*A6_HS,44,A6_HH,0.6*cn);});
    a6_say(ctx,t,1430,330,"one of Grace's crews",A6_NET,w("year","Grace's crews")-0.2,tFi-0.9,{a:sA});
    a6_say(ctx,t,1430,406,"a home's new solar panels",A6_HH,w("year","new solar panels")-0.2,tFi-0.9,{a:sA});}
  if(wA>0.01){const tCr=w("why","when a crew"),tOf=w("why","switches the street off"),tLv=w("why","the panels could"),tHu=w("why","hurt the crew");
    withA(ctx,wA,()=>{a6_street(ctx,t,A6_ST.x0,A6_ST.x1,A6_ST.y,{work:fin(t,tCr-0.3,0.6),off:fin(t,tOf,0.6),back:fin(t,tLv,0.8),xb:1280,danger:fin(t,tHu-0.3,0.5)});
      a6_homes(ctx,t,{off:fin(t,tOf,0.6),live:fin(t,tLv-0.1,0.7)});});
    a6_say(ctx,t,1430,214,"the street switched off, to mend a line",A6_NET,tCr-0.2,tLv-0.9,{a:wA});
    a6_say(ctx,t,1430,214,"the panels could keep its wires live",ACA_WARN,tLv-0.3,tCo-0.9,{a:wA});
    a6_say(ctx,t,1430,290,"and hurt the crew",A6_RED,tHu-0.2,tCo-0.9,{a:wA});}
  // the field app on the crew's tablet: their question, and the assistant's four steps
  const tA=fin(t,tAs-0.3,0.7)*(1-fin(t,tTw-0.9,0.5));
  if(tA>0.01){arrive(ctx,430,430,t,tAs-0.3,()=>a6_tablet(ctx,80,150,{w:700,h:560,t,q:"Steps to connect solar panels?",steps:A6_FOUR,p:clamp((t-w("asks","It answers")+0.1)/1.8,0,1),hi:pulseAt(t,w("asks","with four")-0.1,1.6)}),{dy:-12,a:tA});
    a6_say(ctx,t,430,770,"four steps",A6_NET,w("asks","with four")-0.2,tTw-0.9,{a:tA});}
  // the manual, as the network keeps it: five steps since the spring, the fifth new
  const mA=a6_win(t,tFi-0.3,tWh-0.9,0.6);
  if(mA>0.01){arrive(ctx,1440,380,t,tFi-0.3,()=>a6_manual(ctx,1060,150,760,"Connecting a solar home","changed in the spring",A6_FIVE,{newAt:4,nw:fin(t,w("five","there are five")-0.2,0.8),hi:pulseAt(t,w("five","checks that")-0.1,1.6)}),{dy:-12,a:mA});
    a6_say(ctx,t,1440,690,"since the spring: five",BIZ,w("five","Since the spring")-0.2,tWh-0.9,{a:mA});
    a6_say(ctx,t,1440,766,"before a home may sell power back",SOFT,w("five","Before a home")-0.2,tWh-0.9,{a:mA});}
  // the copy the assistant answers from: last year's manual, pasted into its instructions when it was built
  const cA=a6_win(t,tCo-0.3,tTw-0.9,0.6);
  if(cA>0.01){arrive(ctx,1420,350,t,tCo-0.3,()=>a6_copy(ctx,1100,190,640,"the assistant's instructions","pasted in: last year",["Connecting a solar home:",...A6_FOUR.map((s,i)=>(i+1)+". "+s)],{old:fin(t,w("copy","last year's")-0.2,1.0)}),{dy:-12,a:cA});
    a6_flow(ctx,1094,356,792,356,t,A6_COPY,cA*fin(t,w("copy","answers from")-0.1,0.6),{head:true,n:3,v:0.5});
    a6_say(ctx,t,940,300,"answers from a copy",A6_COPY,w("copy","from a copy")-0.2,tTw-0.9,{size:28,a:cA});
    a6_say(ctx,t,1420,590,"last year's manual",ACA_WARN,w("copy","last year's")-0.2,tTw-0.9,{a:cA});}
  // the week's job sheets: two homes connected without the check, caught that week; nobody hurt
  const jA=a6_win(t,tTw-0.3,tGr-0.9,0.6),tCa=w("two","caught it");
  if(jA>0.01){arrive(ctx,960,360,t,tTw-0.3,()=>a6_sheets(ctx,560,170,800,A6_JOBS,{flag:fin(t,tCa-0.2,0.6)}),{dy:-12,a:jA});
    a6_say(ctx,t,960,660,"two homes, without the check",ACA_WARN,w("two","Two homes")-0.2,tCa-0.9,{a:jA});
    a6_say(ctx,t,960,660,"a supervisor caught it that week",A6_OK,tCa-0.3,tGr-0.9,{a:jA});
    a6_say(ctx,t,960,736,"nobody was hurt",A6_OK,w("two","nobody was hurt")-0.2,tGr-0.9,{a:jA});}
  // Grace asks Tomás, and the question stays through the pause
  const pA=fin(t,tGr-0.3,0.8),tWe=w("grace","what else"),ex=a6_expr("calm","concerned",fin(t,tWe-0.3,0.5));
  a6_who(ctx,"tomas",230,pA,t,{expr:ex});a6_who(ctx,"grace",1690,pA,t,{right:true,expr:ex});
  a6_name(ctx,"Tomás Herrera · enterprise architect",fin(t,tGr,0.6),false);a6_name(ctx,"Grace Achieng · network operations",fin(t,tGr+0.2,0.6),true);
  const bA=fin(t,tWe-0.2,0.6);if(bA>0.01)arrive(ctx,1522,470,t,tWe-0.2,()=>a6_bubble(ctx,1744,470,["What else has moved,","without the map knowing?"],{align:"right",col:A6_HH}),{dy:8,a:bA});
  ctx.restore();vign(ctx,S);eaYear(ctx,80,80,"the utility · a year on",ACA,fin(t,tYe-0.2,0.7)*sA);});

/* ---------- 3. What moved ---------- */
// what's running, as the map agent reads it: a panel of the systems at work, each a gear and its name, the personal and sensitive
// fields in them masked; o.miss (0..1): a step that runs but isn't on the map, dashed amber, under them; returns its height
const A6_RUN=[["the field app",A6_NET,0],["work orders",A6_NET,0],["meter reads",A6_NET,1],["billing",A6_RET,1]];
function a6_running(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a,gap=88,ms=clamp(o.miss||0,0,1),h=96+(A6_RUN.length+1)*gap;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,LAY6[4][1],{glow:12+12*(o.hi||0),ea:0.85,fill:"rgba(6,11,22,0.97)"});T(ctx,"what's running",x+32,y+54,{f:"mono",w:500,size:28,color:rgba(LAY6[4][1],1)});
    A6_RUN.forEach(([nm,col,pii],i)=>{const yy=y+82+i*gap;a6_job(ctx,x+28,yy,w-56,nm,{col,t,h:70});if(pii)a6_mask(ctx,x+w-28-96,yy+16,72,38,{a:clamp(o.mask==null?1:o.mask,0,1)});});
    if(ms>0.01)a6_job(ctx,x+28,y+82+A6_RUN.length*gap,w-56,"the solar check",{t,h:70,miss:1,a:ms});});return h;}
// a sheet of grey paper, for a copy an agent was given: its title and, if there's room, a few lines as texture; o.old (0..1) yellowed
function a6_sheet(ctx,x,y,w,h,title,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const old=clamp(o.old==null?1:o.old,0,1),pc=mix([206,206,210],[214,200,160],old),ink=[56,54,60];
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.012:o.rot);ctx.translate(-w/2,-h/2);ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=14;ctx.shadowOffsetY=5;ctx.fillStyle=rgba(pc,0.97);ctx.fillRect(0,0,w,h);ctx.restore();
    T(ctx,title,20,40,{w:700,size:28,color:rgba(ink,0.95)});if(h>90){ctx.fillStyle="rgba(60,52,46,0.28)";for(let i=0;i<Math.floor((h-66)/22);i++)ctx.fillRect(20,66+i*22,(w-40)*(0.55+0.4*hash(i,861)),5);}ctx.restore();});}
// a soft band of light passing over the map, left to right, as the agent reads it
function a6_scan(ctx,M,t,a){if(a<=0.01)return;const h=6*(M.sh+M.gap)-M.gap,x=M.x+((t*190)%(M.w+200))-100;ctx.save();ctx.beginPath();ctx.rect(M.x,M.y-6,M.w,h+12);ctx.clip();
  const g=ctx.createLinearGradient(x-90,0,x+90,0);g.addColorStop(0,rgba(KT_AI,0));g.addColorStop(0.5,rgba(KT_AI,0.16*a));g.addColorStop(1,rgba(KT_AI,0));ctx.fillStyle=g;ctx.fillRect(x-90,M.y-6,180,h+12);ctx.restore();}
const A6_M3={x:790,y:150,w:1000,sh:66,gap:12};
const A6_OWN=[["meter reads","process",LAY6[2][1],"Nadia Karimi"],["tariff rules","principle",LAY6[0][1],"Nadia Karimi"],["outage list","object",LAY6[3][1],"Sam Ortiz"]];
const A6_AGS=[["the field app's assistant","copy: last year's manual"],["the meter agent","copy: last year's glossary"]];
scene("moved",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tRe=c("read"),tSt=c("steps"),tWo=c("words"),tPe=c("people"),tAg=c("agents"),tPa=c("passed"),tNe=c("never");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  // the whole map, as the agent compares it with what's running: the steps it doesn't show, the words that drifted, the owners who left
  const tNi=w("steps","Nine steps"),tTh=w("words","Three words"),tFo=w("people","Forty-one"),tTw=w("agents","two agents"),tEv=w("passed","Every check");
  a6_texMap(ctx,t,A6_M3,{p:clamp((t-0.3)/1.6,0,1),stamp:1,miss:clamp((t-tNi-0.2)/1.4,0,1),amber:fin(t,tTh-0.2,0.8),gone:fin(t,w("people","who has left")-0.3,0.8),chk:clamp((t-tEv+0.1)/2.4,0,1)});
  a6_scan(ctx,A6_M3,t,a6_win(t,tRe+0.4,tSt-0.4,0.8));
  // what it found, counted under the map
  [[900,9,["steps","not on it"],tNi],[1130,3,["words","changed"],tTh],[1360,41,["owners","who left"],tFo],[1590,2,["agents","on copies"],tTw]].forEach(([x,n,ls,t0])=>{
    const q=fin(t,t0-0.2,0.6);if(q>0.01)a6_count(ctx,x,724,n,ls,ACA_WARN,{a:q,p:clamp((t-t0+0.2)/1.2,0,1),hi:pulseAt(t,t0,1.6)});});
  // the map agent, between what's running and the map; it leaves once all is said
  const gA=fin(t,0.4,0.7)*(1-fin(t,tNe+0.8,0.6));aca_agent(ctx,690,420,32,t,{a:gA,busy:a6_win(t,tRe,tPa,1.0)});
  // what's running: read-only, the personal and sensitive fields masked; the solar check, one of nine steps the map doesn't show
  const rA=a6_win(t,0.3,tWo-0.9,0.6),tRo=w("read","read-only");
  if(rA>0.01){a6_running(ctx,50,150,560,t,{a:rA,miss:fin(t,w("steps","solar check")-0.3,0.7),mask:fin(t,w("read","personal")-0.3,0.6)});
    a6_flow(ctx,616,420,652,420,t,KT_AI,rA*fin(t,tRe+0.2,0.6),{n:2,v:0.7});a6_flow(ctx,728,412,786,360,t,KT_AI,rA*fin(t,tRe+0.6,0.6),{n:2,v:0.7});
    a6_say(ctx,t,330,750,"read-only",KT_AI,tRo-0.2,tSt-0.9,{size:28,a:rA});
    a6_say(ctx,t,330,820,"personal and sensitive data masked",KT_AI,w("read","personal")-0.2,tSt-0.9,{size:28,a:rA});
    a6_say(ctx,t,330,750,"like the solar check",ACA_WARN,w("steps","solar check")-0.2,tWo-0.9,{size:28,a:rA});}
  // the glossary: "customer" still says "buys", though it now includes households that sell power back
  const yA=a6_win(t,tWo-0.3,tPe-0.9,0.6);
  if(yA>0.01)arrive(ctx,330,310,t,tWo-0.3,()=>a6_gloss(ctx,50,170,560,"customer","a household or business that buys power from us",{word:"buys",amb:fin(t,w("words","still says")-0.2,0.6),note:"now also: those who sell power back",noteA:fin(t,w("words","now includes")-0.2,0.6)}),{dy:-10,a:yA});
  // elements whose owner has left, their names greyed
  const oA=a6_win(t,tPe-0.3,tAg-0.9,0.6),gn=fin(t,w("people","who has left")-0.3,0.8);
  if(oA>0.01)A6_OWN.forEach(([nm,kind,col,own],i)=>a6_el(ctx,74,250+i*130,512,64,nm,col,kind,{a:oA*fin(t,tPe-0.3+i*0.15,0.6),own,gone:gn,t}));
  // two agents that work from copies
  const aA=a6_win(t,tAg-0.3,tPa-0.9,0.6);
  if(aA>0.01)A6_AGS.forEach(([nm,cp],i)=>{const y=300+i*220,q=aA*fin(t,(i?w("agents","the meter agent"):w("agents","the field app's"))-0.3,0.6);if(q<=0.01)return;
    aca_agent(ctx,110,y,28,t,{a:q});T(ctx,nm,166,y+10,{w:700,size:30,color:rgba(KT_AI,q)});a6_sheet(ctx,166,y+38,420,62,cp,{a:q});});
  // the checks: every one had passed, because they test each change made to the map
  const kA=a6_win(t,tPa-0.3,tNe-0.9,0.6),tHp=w("passed","had passed");
  if(kA>0.01){a6_checks(ctx,50,190,560,["every element has an owner","every change is tested","no element is left unlinked"].map((label,i)=>({label,run:fin(t,tPa-0.2,0.4),pass:fin(t,tHp-0.3+i*0.25,0.4)})),{a:kA,t});
    a6_say(ctx,t,330,560,"they test each change made to the map",TECH,w("passed","because")-0.2,tNe-0.9,{a:kA});}
  // none of it came to the map as a change: the work, the words and the people moved; the map didn't
  a6_say(ctx,t,1290,92,"55 differences, none came as a change",ACA_WARN,tNe-0.2,null);
  a6_say(ctx,t,330,260,"the work moved",LAY6[2][1],w("never","The work")-0.2,null);
  a6_say(ctx,t,330,340,"the words moved",BIZ,w("never","the words")-0.2,null);
  a6_say(ctx,t,330,420,"the people moved",A6_HH,w("never","the people")-0.2,null);
  a6_say(ctx,t,330,520,"the map didn't",ACA_WARN,w("never","the map didn't")-0.2,null,{size:34});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Last year's words ---------- */
// an agent's instructions, as a panel of glass: what it's for, as lines of texture, with what was pasted into it laid on top
function a6_instr(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,KT_AI,{glow:12,ea:0.85,fill:"rgba(6,14,20,0.97)"});T(ctx,"the agent's instructions",x+32,y+54,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});
    ctx.fillStyle=rgba(KT_AI,0.22);for(let i=0;i<3;i++)ctx.fillRect(x+32,y+88+i*22,(w-64)*(0.5+0.45*hash(i,871)),5);});}
// equal, then not: two bars, and a slash through them as p goes to 1, in amber
function a6_neq(ctx,x,y,p,a){if(a<=0.01)return;p=clamp(p,0,1);const col=mix(A6_OK,ACA_WARN,p);
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=7;ctx.lineCap="round";ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(x-26,y-12);ctx.lineTo(x+26,y-12);ctx.moveTo(x-26,y+12);ctx.lineTo(x+26,y+12);ctx.stroke();
    if(p>0.01){ctx.beginPath();ctx.moveTo(x+14,y-34);ctx.lineTo(lerp(x+14,x-14,p),lerp(y-34,y+34,p));ctx.stroke();}ctx.restore();});}
// the website's chat, as a browser window: a customer's question on the right, the chat's answer on the left from its orb, both as
// lines of texture; o.p (0..1) the two come in turn
function a6_chat(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=clamp(o.p==null?1:o.p,0,1),q=clamp(p*2,0,1),r=clamp(p*2-1,0,1);
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,A6_RET,{glow:12,ea:0.85,fill:"rgba(14,8,14,0.97)"});ctx.fillStyle="rgba(255,255,255,0.05)";rr(ctx,x+3,y+3,w-6,62,20);ctx.fill();
    for(let i=0;i<3;i++){ctx.fillStyle=rgba(A6_RET,0.5);ctx.beginPath();ctx.arc(x+34+i*24,y+34,7,0,TAU);ctx.fill();}
    T(ctx,"the website's chat",x+120,y+44,{f:"mono",w:500,size:28,color:rgba(A6_RET,1)});
    if(q>0.01)withA(ctx,q,()=>{const bw=w*0.5,bx=x+w-bw-34,by=y+100;ctx.fillStyle=rgba(A6_HH,0.16);rr(ctx,bx,by,bw,84,20);ctx.fill();ctx.fillStyle=rgba(A6_HH,0.6);ctx.fillRect(bx+24,by+28,bw*0.7,6);ctx.fillRect(bx+24,by+50,bw*0.45,6);});
    if(r>0.01)withA(ctx,r,()=>{kt_agent(ctx,x+62,y+252,16,t,{spin:2});const bw=w*0.66,bx=x+98,by=y+214;ctx.fillStyle=rgba(KT_AI,0.13);rr(ctx,bx,by,bw,150,20);ctx.fill();ctx.fillStyle=rgba(KT_AI,0.55);for(let i=0;i<4;i++)ctx.fillRect(bx+24,by+32+i*28,bw*(0.78-0.12*(i%3)),6);});});}
// where something is kept, as a card: its glyph (a map of glass, a book, a data product), its name and, if given, o.sub under it (such
// as the version read); returns its height
function a6_src(ctx,x,y,w,kind,title,col,o){o=o||{};const a=o.a==null?1:o.a,h=o.h||110;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,col,{glow:12+14*(o.hi||0),ea:0.88,fill:"rgba(7,11,22,0.97)"});
    if(kind==="map"){for(let k=0;k<3;k++){ctx.save();ctx.fillStyle=rgba(LAY6[k*2][1],0.3);ctx.strokeStyle=rgba(LAY6[k*2][1],0.9);ctx.lineWidth=1.6;rr(ctx,x+26,y+h/2-34+k*24,60,16,5);ctx.fill();ctx.stroke();ctx.restore();}}
    else a6_glyph(ctx,kind,x+56,y+h/2,20,col);
    if(o.sub){T(ctx,title,x+110,y+h/2-6,{w:800,size:34,color:rgba(INK,0.98)});T(ctx,o.sub,x+110,y+h/2+36,{f:"mono",w:500,size:28,color:rgba(col,1)});}
    else T(ctx,title,x+110,y+h/2+12,{w:800,size:34,color:rgba(INK,0.98)});});return h;}
// a tool an agent reads through: a ring of glass with a key in it, and its name under it
function a6_tool(ctx,x,y,t,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-56,y-56,112,112,56,TECH,{glow:16,ea:0.88,fill:"rgba(6,12,22,0.97)"});
  ctx.save();ctx.strokeStyle=rgba(TECH,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.arc(x-12,y,14,0,TAU);ctx.moveTo(x+2,y);ctx.lineTo(x+30,y);ctx.moveTo(x+22,y);ctx.lineTo(x+22,y+12);ctx.moveTo(x+30,y);ctx.lineTo(x+30,y+10);ctx.stroke();ctx.restore();
  T(ctx,"a tool",x,y+98,{w:800,size:30,align:"center",color:rgba(TECH,1)});});}
const A6_THREE=[["the field app's assistant",300],["the meter agent",470],["the map agent",640]],A6_SRC3=[["map","the map",LAY6[4][1],"the map"],["book","the glossary",BIZ,"the glossary"],["book","the manuals",A6_NET,"the manuals"]];
scene("copy",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tPs=c("paste"),tDr=c("drift"),tCh=c("chat"),tRu=c("rule"),tCi=c("cite"),tRt=c("retest");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  // an agent, and what its instructions can hold: a copy of a manual, a process or the glossary
  const gA=fin(t,0.3,0.7)*(1-fin(t,tCh-0.9,0.5));aca_agent(ctx,300,470,36,t,{a:gA});
  const iA=a6_win(t,0.4,tDr-0.9,0.6);
  if(iA>0.01){a6_instr(ctx,520,200,1320,430,{a:iA});a6_flow(ctx,516,420,346,462,t,A6_COPY,iA*fin(t,w("paste","a copy")-0.2,0.6),{n:2,v:0.5});
    [["a manual",560,-0.02],["a process",980,0.015],["the glossary",1400,-0.01]].forEach(([nm,x,rot])=>{const t0=w("paste",nm)-0.25,q=fin(t,t0,0.5)*iA;if(q>0.01)arrive(ctx,x+190,480,t,t0,()=>a6_sheet(ctx,x,380,380,200,nm,{rot}),{dy:-14,a:q});});
    a6_say(ctx,t,1180,700,"a copy, pasted in",A6_COPY,w("paste","a copy")-0.2,tDr-0.9,{a:iA});}
  // the copy, right the day it's pasted in; from then on it drifts from the manual, and nothing tells the agent
  const dA=a6_win(t,tDr-0.3,tCh-0.9,0.6),tDf=w("drift","it drifts");
  if(dA>0.01){arrive(ctx,780,386,t,tDr-0.3,()=>a6_copy(ctx,480,240,600,"the manual, pasted in","last year",A6_FOUR.map((s,i)=>(i+1)+". "+s),{old:fin(t,tDf-0.2,1.0)}),{dy:-12,a:dA});
    arrive(ctx,1530,420,t,tDr-0.1,()=>a6_manual(ctx,1200,200,660,"Connecting a solar home","changed in the spring",A6_FIVE,{newAt:4,nw:fin(t,tDf-0.3,0.8)}),{dy:-12,a:dA});
    a6_neq(ctx,1140,390,fin(t,tDf-0.1,0.6),dA);a6_flow(ctx,476,392,340,456,t,A6_COPY,dA*0.9,{n:2,v:0.5});
    a6_say(ctx,t,780,620,"right the day it's pasted in",A6_OK,w("drift","right the day")-0.2,w("drift","From then on")-0.9,{a:dA});
    a6_say(ctx,t,780,620,"from then on, it drifts",ACA_WARN,w("drift","From then on")-0.3,tCh-0.9,{a:dA});
    a6_say(ctx,t,780,696,"nothing tells the agent",ACA_WARN,w("drift","nothing tells")-0.2,tCh-0.9,{a:dA});}
  // the website's chat never had this trouble: it reads the glossary and its data products where they're kept
  const hA=a6_win(t,tCh-0.3,tRu-0.9,0.6);
  if(hA>0.01){arrive(ctx,540,430,t,tCh-0.3,()=>a6_chat(ctx,140,180,800,500,t,{p:clamp((t-tCh)/1.6,0,1)}),{dy:-12,a:hA});
    const g1=fin(t,w("chat","the glossary")-0.2,0.6)*hA,g2=fin(t,w("chat","data products")-0.2,0.6)*hA;
    if(g1>0.01){arrive(ctx,1530,265,t,w("chat","the glossary")-0.2,()=>a6_src(ctx,1220,210,620,"book","the glossary",BIZ,{hi:pulseAt(t,w("chat","where they're kept"),1.6)}),{dy:-10,a:g1});a6_flow(ctx,944,380,1216,266,t,BIZ,g1,{solid:true,n:3,v:0.6});}
    if(g2>0.01){arrive(ctx,1530,485,t,w("chat","data products")-0.2,()=>a6_src(ctx,1220,430,620,"product","data products",LAY6[3][1],{hi:pulseAt(t,w("chat","where they're kept"),1.6)}),{dy:-10,a:g2});a6_flow(ctx,944,440,1216,486,t,LAY6[3][1],g2,{solid:true,n:3,v:0.6});}
    a6_say(ctx,t,1530,640,"where they're kept",A6_OK,w("chat","where they're kept")-0.2,tRu-0.9,{a:hA});
    a6_say(ctx,t,540,750,"never had this trouble",A6_OK,w("chat","never had")-0.2,tRu-0.9,{a:hA});}
  // now every agent does the same: the map, the glossary and the manuals, read through a tool as it answers, never from a copy
  const uA=a6_win(t,tRu-0.3,tCi-0.9,0.6),tTo=w("rule","through a tool"),tNv=w("rule","never from a copy");
  if(uA>0.01){withA(ctx,uA,()=>{A6_THREE.forEach(([nm,y],i)=>{const q=fin(t,tRu-0.3+i*0.15,0.6);if(q<=0.01)return;aca_agent(ctx,150,y,28,t,{a:q});T(ctx,nm,200,y+10,{w:700,size:30,color:rgba(KT_AI,q)});
        a6_sheet(ctx,620,y-28,200,56,"a copy",{a:q*(1-fin(t,tNv-0.3,0.7)),rot:(i-1)*0.02});a6_flow(ctx,840,y,982,470,t,KT_AI,fin(t,tTo-0.1,0.6),{n:2,v:0.6,solid:true});});
      a6_tool(ctx,1040,470,t,fin(t,tTo-0.3,0.6));
      A6_SRC3.forEach(([kind,nm,col,cw],i)=>{const t0=w("rule",cw)-0.2,q=fin(t,t0,0.6);if(q<=0.01)return;const y=245+i*170;arrive(ctx,1550,y+55,t,t0,()=>a6_src(ctx,1260,y,580,kind,nm,col,{hi:pulseAt(t,t0+0.2,1.4)}),{dy:-10,a:q});
        a6_flow(ctx,1098,470,1256,y+55,t,col,fin(t,tTo,0.6),{n:2,v:0.6,solid:true});});});
    a6_say(ctx,t,960,800,"never from a copy",A6_OK,tNv-0.2,tCi-0.9,{size:34,a:uA});}
  // the field app's answer names the version it read; tested again when what it reads changes: five steps, and the reason for the fifth
  const bA=fin(t,tCi-0.3,0.6),tFs=w("retest","five steps");
  if(bA>0.01){arrive(ctx,960,460,t,tCi-0.3,()=>a6_tablet(ctx,580,110,{w:760,h:700,t,q:"Steps to connect solar panels?",steps:A6_FIVE,p:clamp((t-tCi+0.1)/1.4,0,1),newAt:4,nwA:fin(t,tFs-0.2,0.6),
        why:"so the panels can't keep the street's wires live while a crew mends them",whyA:fin(t,w("retest","the reason")-0.2,0.7),src:"read: the manual, 2 April version",srcA:fin(t,w("cite","names the version")-0.2,0.6),hi:pulseAt(t,w("cite","names the version"),1.6)}),{dy:-12,a:bA});
    const tNv2=w("cite","names the version"),vA=fin(t,tNv2-0.3,0.6);
    if(vA>0.01){arrive(ctx,305,750,t,tNv2-0.3,()=>a6_src(ctx,80,685,450,"book","the manual",A6_NET,{h:130,sub:"2 April version",hi:pulseAt(t,tNv2+0.2,1.6)+pulseAt(t,w("retest","when what")+0.1,1.6)}),{dy:-10,a:vA});
      a6_flow(ctx,534,750,586,750,t,A6_NET,vA,{head:true,n:2,v:0.5});}
    a6_say(ctx,t,305,620,"so a person can check it",BIZ,w("cite","so a person")-0.2,tRt-0.9);
    a6_loop(ctx,1630,300,56,t,KT_AI,fin(t,tRt-0.2,0.6));
    a6_say(ctx,t,1630,420,"tested again",KT_AI,w("retest","tested again")-0.2,null);
    a6_say(ctx,t,1630,496,"when what it reads changes",KT_AI,w("retest","when what")-0.2,null,{size:28});
    a6_checkRow(ctx,1390,640,480,"five steps, and why",{a:fin(t,tFs-0.2,0.6),run:fin(t,tFs-0.2,0.4),pass:fin(t,tFs+0.6,0.4),t});}
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Someone moves on ---------- */
// thirty elements of the map, as tiles, each with its owner's name on it. st(i) gives each tile's {nm, a (the name's opacity), gone
// (0..1, greyed: an empty ring)}; o.p (0..1) they arrive, tile by tile; o.dim
const A6_TG={x:760,y:170,cw:180,rh:76,w:166,h:58};
function a6_tiles(ctx,t,st,o){o=o||{};const a=(o.a==null?1:o.a)*(1-0.6*clamp(o.dim||0,0,1)),p=o.p==null?1:o.p;if(a<=0.01)return;
  withA(ctx,a,()=>{for(let i=0;i<30;i++){const q=clamp(p*31-i,0,1);if(q<=0.01)continue;const x=A6_TG.x+(i%6)*A6_TG.cw,y=A6_TG.y+Math.floor(i/6)*A6_TG.rh,col=LAY6[[2,2,3,4,4,5][i%6]][1],s=st(i),gn=clamp(s.gone||0,0,1),gc=mix(BIZ,A6_DIM,gn);
    withA(ctx,clamp(q*1.6,0,1),()=>{glass(ctx,x,y,A6_TG.w,A6_TG.h,10,col,{glow:6,ea:0.8,fill:"rgba(7,12,24,0.95)"});
      if(gn<0.999)kt_gtick(ctx,x+24,y+29,10,1-gn);if(gn>0.001)withA(ctx,gn,()=>{ctx.save();ctx.strokeStyle=rgba(A6_DIM,1);ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(x+24,y+29,10,0,TAU);ctx.stroke();ctx.restore();});
      if(s.a>0.01)T(ctx,s.nm,x+44,y+39,{w:800,size:28,color:rgba(gc,s.a)});});}});}
// the tiles' new owners, once the new metering lead has confirmed each: Kofi, but two handed to Grace and one to Inés
const A6_NEW=i=>i===7||i===19?"Grace":i===24?"Inés":"Kofi";
// where someone stood, empty: a dashed outline of a head and shoulders
function a6_empty(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([9,9]);ctx.strokeStyle=rgba(A6_DIM,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y-150,62,0,TAU);ctx.moveTo(x-150,y+60);ctx.quadraticCurveTo(x-140,y-60,x,y-66);ctx.quadraticCurveTo(x+140,y-60,x+150,y+60);ctx.stroke();ctx.restore();});}
scene("leaves",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tLe=c("lead"),tNa=c("name"),tSe=c("sees"),tAg=c("agent"),tNo=c("now"),tCf=c("confirm"),tRt=w("lead","She retired");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  // the metering lead, who retires in March after thirty-one years; where she stood, empty
  a6_who(ctx,"nadia",230,fin(t,0.3,0.8)*(1-fin(t,tRt+0.8,1.0)),t,{expr:"calm"});
  a6_name(ctx,"Nadia Karimi · metering lead",fin(t,0.6,0.6)*(1-fin(t,tRt+0.6,0.6)),false);
  a6_say(ctx,t,330,520,"retired in March, after 31 years",A6_HH,tRt-0.2,tNa-0.9);
  a6_empty(ctx,230,900,a6_win(t,tSe-0.3,tAg-0.9,0.6));
  a6_say(ctx,t,330,520,"it can't see who has left",ACA_WARN,w("sees","It can't see")-0.2,tAg-0.9);
  // thirty of the forty-one elements, each still with her name on it; back again as the new lead confirms each, or hands it on
  const tA=fin(t,tLe-0.2,0.6)*(1-fin(t,tNo-0.9,0.5)),tB=fin(t,tCf-0.3,0.6),tCo=w("confirm","confirms"),tHa=w("confirm","hands it");
  if(tA>0.01)a6_tiles(ctx,t,()=>({nm:"Nadia",a:1}),{a:tA,p:clamp((t-tLe+0.2)/1.6,0,1),dim:fin(t,tAg-0.3,0.6)});
  if(tB>0.01)a6_tiles(ctx,t,i=>{const nw=A6_NEW(i),f=clamp((t-(nw==="Kofi"?tCo-0.1+i*0.07:tHa-0.1+(i%5)*0.12))/0.8,0,1);return f<0.5?{nm:"Nadia",a:1-f*2,gone:1}:{nm:nw,a:f*2-1,gone:0};},{a:tB});
  a6_say(ctx,t,1300,128,"30 of the 41",BIZ,w("lead","Thirty")-0.2,tNa-0.9);
  a6_say(ctx,t,1300,128,"her name, still on them",BIZ,w("name","Her name")-0.2,tSe-0.9);
  a6_say(ctx,t,1300,128,"confirmed, or handed on",BIZ,tCo-0.2,null);
  // the check that every element has an owner kept passing: it reads the map, and can't see who has left
  const kA=a6_win(t,tNa-0.3,tNo-0.9,0.6);
  if(kA>0.01)a6_checks(ctx,760,640,700,[{label:"every element has an owner",run:fin(t,tNa,0.4),pass:fin(t,w("name","kept passing")-0.4,0.4)}],{a:kA*(1-0.5*fin(t,tAg-0.3,0.6)),t});
  // the meter agent, handed to her by Grace; for five months, nobody answered for it
  const mA=a6_win(t,tAg-0.3,tNo-0.9,0.6),tHd=w("agent","handed to her"),tNb=w("agent","nobody answered"),tFm=w("agent","five months");
  if(mA>0.01){aca_agent(ctx,330,330,44,t,{a:mA,warn:fin(t,tNb-0.3,0.6),name:"the meter agent"});
    a6_owner(ctx,286,520,"Grace",a6_win(t,tAg-0.3,tHd-0.3,0.6)*mA,{});a6_owner(ctx,286,520,"Nadia",fin(t,tHd+0.3,0.6)*mA,{ring:fin(t,tNb-0.3,0.6),col:mix(BIZ,A6_DIM,fin(t,tNb-0.3,0.6))});
    a6_blocks(ctx,130,640,5,76,clamp((t-tFm+0.2)/0.4,0,5),ACA_WARN,{a:fin(t,tFm-0.3,0.6)*mA,names:["Apr","May","Jun","Jul","Aug"],label:"nobody answered for it"});}
  // now the owner check also reads the staff directory: the day someone leaves or changes job, it lists what they owned, for their manager
  const nA=a6_win(t,tNo-0.3,tCf-0.9,0.6),tSd=w("now","staff directory"),tSl=w("now","someone leaves"),tCj=w("now","changes job"),tLi=w("now","it lists");
  if(nA>0.01){withA(ctx,nA,()=>{a6_checks(ctx,820,200,560,[{label:"every element has an owner",pass:1},{label:"every owner still works here",a:fin(t,w("now","also reads")-0.2,0.6),add:fin(t,w("now","also reads")-0.2,0.6),run:fin(t,tSl-0.2,0.4),hold:fin(t,tSl+0.4,0.5)}],{t});
      const sA=fin(t,tSd-0.4,0.6);if(sA>0.01){arrive(ctx,420,340,t,tSd-0.4,()=>a6_staff(ctx,80,170,680,[["Nadia Karimi","metering lead","left"],["Grace Achieng","network operations",""],["Wei Chen","billing","new job"],["Kofi Boateng","metering lead",""]],{st:[fin(t,tSl-0.2,0.6),0,fin(t,tCj-0.2,0.6),0]}),{dy:-10,a:sA});
        a6_flow(ctx,764,318,816,312,t,A6_HH,sA,{n:1,v:0.6});}
      const lA=fin(t,tLi-0.2,0.6);if(lA>0.01){arrive(ctx,1650,290,t,tLi-0.2,()=>a6_card(ctx,1420,190,460,"for her manager, Grace",["Nadia Karimi owned 30.","Confirm each one,","or hand it on."],BIZ,{}),{dy:-10,a:lA});a6_flow(ctx,1384,312,1416,296,t,BIZ,lA,{n:1,v:0.6});}});
    a6_say(ctx,t,960,580,"the day someone leaves or changes job",A6_HH,w("now","The day someone")-0.2,tCf-0.9,{a:nA});}
  // the new metering lead
  a6_who(ctx,"kofi",230,fin(t,tCf-0.3,0.8),t,{expr:"calm"});a6_name(ctx,"Kofi Boateng · metering lead",fin(t,tCf,0.6),false);
  ctx.restore();vign(ctx,S);});

/* ---------- 6. A job, not a project ---------- */
const A6_M6={x:460,y:180,w:1000,sh:70,gap:14};
// the map, whole, ringed in dashed amber: keeping all of it true was nobody's job
function a6_whole(ctx,M,t,a){if(a<=0.01)return;const h=6*(M.sh+M.gap)-M.gap;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([14,10]);ctx.lineDashOffset=-t*10;ctx.strokeStyle=rgba(ACA_WARN,0.95);ctx.lineWidth=3.4;ctx.shadowColor=rgba(ACA_WARN,0.7);ctx.shadowBlur=14;rr(ctx,M.x-22,M.y-22,M.w+44,h+44,26);ctx.stroke();ctx.restore();});}
// the book that named it, as a card: its glyph, title, authors, year and field; returns its height
function a6_book(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=250;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,TECH,{glow:14+12*(o.hi||0),ea:0.88,fill:"rgba(6,11,22,0.97)"});a6_glyph(ctx,"book",x+82,y+h/2,40,TECH);
    T(ctx,"Continuous Architecture",x+160,y+100,{w:800,size:44,color:rgba(INK,0.98)});T(ctx,"Murat Erder and Pierre Pureur",x+160,y+152,{w:700,size:32,color:rgba(mix(INK,TECH,0.3),1)});
    T(ctx,"2015 · in software",x+160,y+202,{f:"mono",w:500,size:28,color:rgba(TECH,1)});});return h;}
const A6_RHY=[["on every change","the map's checks",TECH],["the day someone leaves","the owner check",A6_HH],["every month","the read, and a draft for each difference",KT_AI],["every quarter","each agent, tested again",KT_AI],["every year","each owner confirms what they own",BIZ]];
scene("job",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tWh=c("whole"),tTe=c("term"),tPr=c("product"),tCa=c("cap"),tOw=c("owner"),tBu=c("budget"),tRh=c("rhythm"),tMo=c("month"),tQu=c("quarter");
  ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  // the map: every part kept by its owner, the whole by nobody; later, with a capability of its own that keeps it true
  const mA=a6_win(t,0.2,tTe-0.9,0.6)+a6_win(t,tCa-0.3,tOw-0.9,0.6),tKm=w("cap","keeping the map");
  if(mA>0.01){a6_texMap(ctx,t,A6_M6,{a:mA,p:clamp((t-0.2)/1.6,0,1),stamp:clamp((t-tWh-0.2)/2.6,0,1)});a6_whole(ctx,A6_M6,t,mA*a6_win(t,w("whole","the whole")-0.2,tTe-0.9,0.6));
    a6_say(ctx,t,960,760,"the whole: nobody's job",ACA_WARN,w("whole","nobody's job")-0.3,tTe-0.9,{a:mA});
    const kA=fin(t,tKm-0.2,0.8)*mA;if(kA>0.01){const ex=A6_M6.x+250+4*152,ey=A6_M6.y+(A6_M6.sh+A6_M6.gap)+12;
      a6_el(ctx,ex,ey,136,A6_M6.sh-24,"",LAY6[1][1],"capability",{a:kA,ghost:1-fin(t,tKm+0.4,1.0),hi:0.6+0.4*Math.sin(t*2),t});
      withA(ctx,kA,()=>{ctx.save();ctx.strokeStyle=rgba(LAY6[1][1],0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(ex+68,143);ctx.lineTo(ex+68,ey-4);ctx.stroke();ctx.restore();});
      a6_say(ctx,t,ex+68,120,"Keep the map true",LAY6[1][1],tKm-0.1,tOw-0.9,{a:mA});}
    a6_say(ctx,t,960,760,"a capability of its own, on the map",BIZ,w("cap","a capability")-0.2,tOw-0.9,{a:mA});}
  // in software, Murat Erder and Pierre Pureur's name for the answer
  const bA=a6_win(t,tTe-0.3,tPr-0.9,0.6);if(bA>0.01)arrive(ctx,960,415,t,tTe-0.3,()=>a6_book(ctx,560,290,800,{hi:pulseAt(t,w("term","continuous architecture")-0.1,1.8)}),{dy:-12,a:bA});
  // kept as a product, not a project, and checked as the system changes
  const lA=a6_win(t,tPr-0.3,tCa-0.9,0.6),tNp=w("product","not a project");
  if(lA>0.01){a6_lines(ctx,400,380,1120,t,{a:lA,pd:clamp((t-w("product","as a product")+0.3)/1.6,0,1),pj:clamp((t-tNp+0.3)/1.0,0,1),end:fin(t,tNp+0.6,0.6)});
    a6_say(ctx,t,960,700,"checked as the system changes",A6_OK,w("product","checked as")-0.2,tCa-0.9,{a:lA});}
  // its owner, a role held by Tomás with Inés as deputy; its budget in the yearly plan
  const cA=a6_win(t,tOw-0.3,tRh-0.9,0.6);
  if(cA>0.01){arrive(ctx,960,320,t,tOw-0.3,()=>a6_cap(ctx,560,140,800,[["owner","the architecture lead, a role"],["held by","Tomás, with Inés as deputy"],["budget","the yearly plan, not a project's"]],
      {r:[fin(t,w("owner","a role")-0.3,0.6),fin(t,w("owner","held by")-0.2,0.6),fin(t,w("budget","the yearly plan")-0.3,0.6)],rh:[pulseAt(t,w("owner","a role"),1.6),pulseAt(t,w("owner","held by"),1.6),pulseAt(t,w("budget","the yearly plan"),1.6)]}),{dy:-12,a:cA});
    a6_say(ctx,t,960,700,"it doesn't stop when one of them moves on",BIZ,w("owner","so it doesn't stop")-0.2,tBu-0.9,{a:cA});
    a6_say(ctx,t,960,700,"it doesn't end when a project does",BIZ,w("budget","so it doesn't end")-0.2,tRh-0.9,{a:cA});}
  a6_who(ctx,"tomas",230,fin(t,w("owner","held by")-0.3,0.8)*(1-fin(t,tRh-0.9,0.5)),t,{expr:"calm"});a6_who(ctx,"ines",1690,fin(t,w("owner","as deputy")-0.3,0.8)*(1-fin(t,tRh-0.9,0.5)),t,{right:true,expr:"calm"});
  a6_name(ctx,"Tomás Herrera · architecture lead",a6_win(t,w("owner","held by")-0.2,tRh-0.9,0.6),false);a6_name(ctx,"Inés Duarte · deputy",a6_win(t,w("owner","as deputy")-0.2,tRh-0.9,0.6),true,{col:TECH});
  // and its rhythm: on every change, the day someone leaves, every month, every quarter, every year
  const rA=fin(t,tRh-0.3,0.6),R0=[w("rhythm","On every change"),w("rhythm","The day someone"),w("month","Every month"),w("quarter","Every quarter"),w("quarter","every year")];
  if(rA>0.01){a6_say(ctx,t,960,120,"and a rhythm",BIZ,tRh-0.2,null,{a:rA});
    a6_rhythm(ctx,260,220,1400,A6_RHY,t,{a:rA,gap:120,r:R0.map(t0=>fin(t,t0-0.2,0.6)),spin:R0.map(t0=>clamp((t-t0+0.1)/1.2,0,1)),hi:[0,0,a6_win(t,tMo-0.2,tQu-0.4,0.6),a6_win(t,R0[3]-0.2,R0[4]-0.4,0.6),fin(t,R0[4]-0.2,0.6)]});
    aca_agent(ctx,1606,460,18,t,{a:a6_win(t,tMo+0.2,tQu-0.4,0.6),busy:1});
    a6_say(ctx,t,960,830,"for its owner to confirm",BIZ,w("month","for its owner")-0.2,tQu-0.6);}
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Five series, one idea ---------- */
const A6_LINES=["A map stays alive while people use it, keep it true, and pass it on.","Rules last only while people keep them, and change them when the world changes.","It's never finished. It matures one change at a time.",
  "A practice isn't built once. It's kept, every part with a stage, a date and a way out.","An architecture stays true only while keeping it is someone's job."];
scene("series",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tLa=c("last"),tLk=c("links"),T5=[c("map"),c("business"),c("data"),c("platform"),c("here")],all=fin(t,w("here","someone's job")+0.4,0.8)*(1-fin(t,tLk-0.3,0.6));
  ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  // the topic's five series, as a tower: each lit as its last film's idea is read; all five at once, as they meet in one idea
  a6_series(ctx,560,760,t,{p:clamp((t-tLa-0.2)/2.4,0,1),on:T5.map((t0,k)=>Math.max(a6_win(t,t0-0.3,(T5[k+1]||tLk)-0.9,0.6),all)),dim:T5.map(()=>fin(t,tLk-0.3,0.8))});
  a6_say(ctx,t,1470,380,"the last film on enterprise architecture",SOFT,w("last","the last film")-0.2,T5[0]-0.9);
  a6_say(ctx,t,1470,460,"five series, one idea",BIZ,w("last","five series")-0.2,T5[0]-0.9);
  // what each series' last film says, on a card beside it
  T5.forEach((t0,k)=>{const q=a6_win(t,t0-0.3,(T5[k+1]||tLk)-0.9,0.6);if(q>0.01)arrive(ctx,1470,390,t,t0-0.3,()=>a6_card(ctx,1080,300,780,A6_SERIES[k][0],[A6_LINES[k]],A6_SERIES[k][1],{size:34}),{dy:-10,a:q});});
  // how to keep one map: in a tool, or in a repository
  const k1=fin(t,w("links","in a tool")-0.2,0.6),k2=fin(t,w("links","in a repository")-0.2,0.6);
  a6_say(ctx,t,1470,190,"how to keep one map",SOFT,tLk-0.2,null);
  if(k1>0.01)arrive(ctx,1470,325,t,w("links","in a tool")-0.2,()=>a6_link(ctx,1080,250,780,"in a tool","A map people and agents can read","map",{hi:pulseAt(t,w("links","A map people"),1.8)}),{dy:-10,a:k1});
  if(k2>0.01)arrive(ctx,1470,525,t,w("links","in a repository")-0.2,()=>a6_link(ctx,1080,450,780,"in a repository","One map, in the repo","repo",{hi:pulseAt(t,w("links","One map"),1.8)}),{dy:-10,a:k2});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. Back to Babylon ---------- */
// Babylon's city wall at dusk, seen from outside: mud brick in courses across the frame from y0 down, its top stepped in merlons; set
// in its brickwork, opened as if cut away, the king's clay cylinder (o.cyl, 0..1: lit). o.dawn, o.day: the light; o.wear (0..1): worn
// by the centuries, some merlons broken; o.x0, o.x1: how far across it's drawn
function a6_cylinder(ctx,x,y,s,lit){const w=150*s,h=58*s;ctx.save();ctx.fillStyle="rgba(10,6,6,0.92)";rr(ctx,x-w/2-20*s,y-h/2-18*s,w+40*s,h+36*s,8*s);ctx.fill();
  const g=ctx.createLinearGradient(0,y-h/2,0,y+h/2);g.addColorStop(0,rgba(mix(BAB_CLAY,[255,240,210],0.25),1));g.addColorStop(0.55,rgba(BAB_CLAY,1));g.addColorStop(1,rgba(mix(BAB_CLAY,[60,40,30],0.5),1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-w/2,y-h/2);ctx.lineTo(x+w/2,y-h/2);ctx.ellipse(x+w/2,y,10*s,h/2,0,-Math.PI/2,Math.PI/2);ctx.lineTo(x-w/2,y+h/2);ctx.ellipse(x-w/2,y,10*s,h/2,0,Math.PI/2,Math.PI*1.5);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(ACA_INK,0.45);ctx.lineWidth=1.2;ctx.beginPath();for(let r=0;r<5;r++){const yy=y-h/2+9*s+r*9.4*s;for(let x0=x-w/2+8*s;x0<x+w/2-8*s;x0+=7*s){ctx.moveTo(x0,yy);ctx.lineTo(x0+(3+2*hash(r*40+x0,891))*s,yy);}}ctx.stroke();
  if(lit>0.01){glow(ctx,x,y,w*0.9,BAB_SUN,0.4*lit);ctx.strokeStyle=rgba(mix(BAB_SUN,[255,255,255],0.3),0.85*lit);ctx.lineWidth=2.6;ctx.shadowColor=rgba(BAB_SUN,0.9);ctx.shadowBlur=14;rr(ctx,x-w/2-20*s,y-h/2-18*s,w+40*s,h+36*s,8*s);ctx.stroke();}ctx.restore();}
function a6_cityWall(ctx,t,o){o=o||{};const[dw,dy]=bab_light(o),y0=o.y0||640,wr=clamp(o.wear||0,0,1),x0=o.x0==null?-400:o.x0,x1=o.x1==null?2400:o.x1;
  const face=mix(mix([34,24,22],[148,102,72],dw),[190,150,110],dy),lit=mix(face,BAB_SUN,0.22*dw+0.1*dy),shade=mix(face,[0,0,0],0.45);
  const g=ctx.createLinearGradient(0,y0,0,H+80);g.addColorStop(0,rgba(lit,1));g.addColorStop(1,rgba(shade,1));ctx.fillStyle=g;ctx.fillRect(x0,y0,x1-x0,H+600-y0);
  ctx.fillStyle=rgba(lit,1);for(let x=x0-(x0%96+96)%96;x<x1;x+=96){const br=wr*hash(Math.round(x/96)+400,881);if(br>0.62)continue;const h1=32*(1-0.5*br);
    ctx.beginPath();ctx.moveTo(x+12,y0+1);ctx.lineTo(x+12,y0-h1*0.5);ctx.lineTo(x+20,y0-h1*0.5);ctx.lineTo(x+20,y0-h1);ctx.lineTo(x+44,y0-h1);ctx.lineTo(x+44,y0-h1*0.5);ctx.lineTo(x+52,y0-h1*0.5);ctx.lineTo(x+52,y0+1);ctx.closePath();ctx.fill();}
  ctx.strokeStyle="rgba(0,0,0,0.15)";ctx.lineWidth=1.3;ctx.beginPath();for(let yy=y0+15,r=0;yy<H+120;yy+=15,r++){ctx.moveTo(x0,yy);ctx.lineTo(x1,yy);for(let x=x0+(r%2)*23;x<x1;x+=46){ctx.moveTo(x,yy);ctx.lineTo(x,yy+15);}}ctx.stroke();
  ctx.fillStyle="rgba(0,0,0,0.1)";for(let i=0;i<160;i++){const x=x0+hash(i,882)*(x1-x0),y=y0+20+hash(i,883)*300;ctx.fillRect(x,y,8+hash(i,884)*26,3);}
  if(wr>0.01){ctx.fillStyle=rgba(shade,0.5*wr);for(let i=0;i<40;i++){const x=x0+hash(i,885)*(x1-x0),y=y0+hash(i,886)*260;ctx.beginPath();ctx.ellipse(x,y,20+hash(i,887)*50,8+hash(i,888)*14,0,0,TAU);ctx.fill();}}
  const sh=ctx.createLinearGradient(x0,0,x1,0);sh.addColorStop(0,"rgba(10,6,12,0.35)");sh.addColorStop(1,"rgba(255,170,110,0.06)");ctx.fillStyle=sh;ctx.fillRect(x0,y0-40,x1-x0,H+600-y0);
  if(o.cyl!=null)a6_cylinder(ctx,o.cx||700,o.cy||770,1,clamp(o.cyl,0,1));}
// a speech bubble with a shape in it, not words: each builder's is another shape, and none answers another's (kind 0 to 3)
function a6_babble(ctx,x,y,kind,a){if(a<=0.01)return;const col=[[255,206,140],[164,212,255],[188,236,164],[255,176,196]][kind%4];
  withA(ctx,a,()=>{ctx.save();ctx.fillStyle="rgba(26,18,14,0.94)";ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(x,y,46,34,0,0,TAU);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(x-10,y+30);ctx.lineTo(x-4,y+52);ctx.lineTo(x+8,y+31);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();
    if(kind===0)ctx.arc(x,y,13,0,TAU);else if(kind===1){ctx.moveTo(x,y-14);ctx.lineTo(x+15,y+11);ctx.lineTo(x-15,y+11);ctx.closePath();}
    else if(kind===2){ctx.moveTo(x-20,y+6);for(let i=1;i<=5;i++)ctx.lineTo(x-20+i*8,y+(i%2?-8:6));}else{ctx.rect(x-12,y-12,24,24);}ctx.stroke();ctx.restore();});}
// the glossary, a few words in it drifting one at a time: each row's meaning lit amber and slipping a little out of line as d(i) goes to 1
const A6_GLOSS=[["customer","a household that buys power"],["connection","a home on the network"],["outage","power off, planned or not"],["meter read","a reading, once a month"],["tariff","the price of a unit"]];
function a6_drifting(ctx,x,y,w,d,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,96+A6_GLOSS.length*86,22,BIZ,{glow:12,ea:0.85,fill:"rgba(12,11,8,0.97)"});a6_glyph(ctx,"book",x+44,y+48,15,BIZ);T(ctx,"glossary",x+76,y+58,{f:"mono",w:500,size:28,color:rgba(BIZ,1)});
  A6_GLOSS.forEach(([k,v],i)=>{const q=clamp(d(i),0,1),yy=y+128+i*86,dx=22*easeCam(q);ctx.save();ctx.translate(x+w/2+dx,yy);ctx.rotate(0.012*q*(i%2?1:-1));ctx.translate(-(x+w/2),-yy);
    ctx.fillStyle=rgba(mix(BIZ,ACA_WARN,q),0.08+0.1*q);rr(ctx,x+20,yy-40,w-62,62,14);ctx.fill();T(ctx,k,x+40,yy,{w:800,size:30,color:rgba(BIZ,1)});T(ctx,v,x+300,yy,{w:700,size:30,color:rgba(mix(INK,ACA_WARN,q),0.96)});ctx.restore();});});}
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tWa=c("wall"),tPr=c("practice"),tBa=c("babel"),tSl=c("slowly"),tSp=c("spring"),tHo=c("homes"),tFe=w("practice","it fell");
  const uP=fin(t,tSl-0.6,1.0),uS=fin(t,B-0.3,1.0),out=fin(t,sc.dur-1.0,0.9);setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:30});
  // the next spring, at the utility: a map nobody keeps drifts one word at a time; the monthly read, from fifty-five differences to six;
  // every new solar home checked, every agent reading this month's words
  if(uP>0.001&&uS<0.999)a6_fade(ctx,uS>0.001?1-uS:1,cx=>{setScreen(cx,S);cx.save();drift(cx,t-tSl+0.6,{dur:sc.dur-tSl},{z:0.02,y:480});
      const dA=a6_win(t,tSl-0.4,tSp-0.9,0.6);a6_drifting(cx,560,170,800,i=>clamp((t-tSl-0.3-i*0.55)/0.8,0,1),dA);
      a6_say(cx,t,960,740,"one word at a time",ACA_WARN,w("slowly","one word")-0.2,tSp-0.9,{a:dA});
      const sA=a6_win(t,tSp-0.3,tHo-0.9,0.6);
      if(sA>0.01){a6_bars(cx,460,250,1000,400,[55,31,22,15,12,9,8,7,6],["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr"],{a:sA,p:clamp((t-w("spring","monthly read")+0.2)/2.4,0,1),fix:clamp((t-w("spring","each fixed")+0.2)/1.6,0,1)});
        a6_say(cx,t,960,170,"the monthly read",KT_AI,w("spring","monthly read")-0.2,tHo-0.9,{a:sA});
        a6_say(cx,t,960,770,"each fixed within a month",A6_OK,w("spring","each fixed")-0.2,tHo-0.9,{a:sA});}
      const hA=a6_win(t,tHo-0.3,B-0.9,0.6),tSo=w("homes","solar home"),tEa=w("homes","every agent");
      if(hA>0.01){withA(cx,hA,()=>{for(let i=0;i<5;i++)a6_solar(cx,220+i*150,430,1.2,t,{ok:fin(t,tSo-0.2+i*0.2,0.5)});
          const sq=fin(t,tEa-0.3,0.6);if(sq>0.01){a6_src(cx,1250,370,600,"book","this month's words",BIZ,{a:sq,hi:pulseAt(t,w("homes","this month's words"),1.6)});
            [300,425,550].forEach((y,i)=>{aca_agent(cx,1090,y,22,t,{a:fin(t,tEa-0.2+i*0.15,0.6)});a6_flow(cx,1118,y,1246,425,t,BIZ,fin(t,tEa+i*0.15,0.6),{solid:true,n:2,v:0.6});});}});
        a6_say(cx,t,520,600,"every new solar home, checked",A6_OK,tSo-0.2,B-0.9,{a:hA});
        a6_say(cx,t,1400,600,"every agent: this month's words",BIZ,tEa-0.2,B-0.9,{a:hA});}
      cx.restore();setScreen(cx,S);eaYear(cx,80,80,"the utility · the next spring",ACA,a6_win(t,tSp-0.2,B-0.9,0.6));vign(cx,S);});
  // Babylon at dusk: the city wall Nabopolassar rebuilt, his words in clay set in it; his request, in his own words; the tower, falling
  // once keeping it was nobody's job; the story of Babel, its builders no longer understanding each other
  if(uP<0.999)a6_fade(ctx,1-uP,cx=>{setScreen(cx,S);cx.save();
      focus(cx,t,[[0,960,560,1.0],[w("wall","left words")-0.4,720,720,1.3],[w("wall","when this wall")-0.3,960,600,1.04],[tBa-0.3,900,560,1.0]],1.9);
      const night=fin(t,tPr+0.4,3.0),dawn=0.62-0.3*night,fall=clamp((t-tFe+0.8)/2.6,0,1);
      bab_sky(cx,t,{hz:640,dawn,day:0,sunX:1760,moonX:420});
      if(fall<=0)bab_tower(cx,1180,640,2.4,{m:BAB_TH,dawn,day:0});else a6_ruin(cx,1180,640,2.4,{m:lerp(BAB_TH,14,easeCam(fall)),ruin:fall,rubble:fall,dawn,day:0,ghost:a6_win(t,tBa-0.2,tSl-0.9,0.8)*0.8});
      const bl=a6_win(t,tBa,tSl-0.9,0.6),bs=fin(t,w("babel","stopped understanding")-0.3,0.6);
      if(bl>0.01)[[360,1],[600,-1],[840,1],[1020,-1]].forEach(([x,d],i)=>a6_figure(cx,x,668,124,t,{wear:"robe",head:i%2?"cloth":null,beard:i!==2,carry:i%2===0,load:i%2===0?1:0,dir:d,step:bs>0.5?0:t*3+i,a:bl,rim:0.5*Math.pow(bl,6)}));
      a6_cityWall(cx,t,{y0:640,dawn,day:0,wear:0.7*fall,cyl:pulseAt(t,w("wall","left words")+0.2,3.0)+0.35*fin(t,w("wall","left words"),1.0)});
      if(bl>0.01)[[360,0],[600,1],[840,2],[1020,3]].forEach(([x,k],i)=>arrive(cx,x+30,466,t,w("babel","stopped understanding")-0.3+i*0.25,()=>a6_babble(cx,x+30,466,k,1),{dy:8,a:fin(t,w("babel","stopped understanding")-0.3+i*0.25,0.6)*bl}));
      cx.restore();setScreen(cx,S);vign(cx,S);
      eaYear(cx,80,80,"Babylon · over 2,600 years ago",ACA,a6_win(t,tWa-0.2,tPr-0.9,0.6));
      eaYear(cx,80,80,"Babylon · the centuries after",ACA,a6_win(t,w("practice","Once keeping")-0.3,tBa-0.9,0.6));
      eaYear(cx,80,80,"the story of Babel",ACA,a6_win(t,tBa-0.3,tSl-0.9,0.6));
      bab_tag(cx,960,214,"his words, for the kings after him",a6_win(t,tWa-0.1,w("wall","when this wall")-1.0,0.6));
      bab_quote(cx,100,130,1000,"When that wall becomes dilapidated and you repair its dilapidated sections, … find an inscription in my name and place it with your inscribed objects","Nabopolassar, on his cylinder for Babylon's wall",{a:a6_win(t,w("wall","when this wall")-0.4,tPr-0.9,0.7),size:36});
      bab_tag(cx,960,214,"a request in clay isn't a practice",a6_win(t,w("practice","a request")-0.2,w("practice","Once keeping")-0.9,0.6));
      bab_tag(cx,960,214,"nobody's job: it fell",a6_win(t,w("practice","Once keeping")-0.3,tBa-0.9,0.6),{col:ACA_WARN});
      bab_tag(cx,960,214,"the tower that may have inspired it",a6_win(t,w("babel","which many scholars")-0.2,w("babel","the builders")-0.9,0.6));
      bab_tag(cx,960,214,"they stopped understanding each other",a6_win(t,w("babel","the builders")-0.3,tSl-0.9,0.6),{col:ACA_WARN});});
  // wordless: the city wall, its words in clay still in it, beside the map, kept
  if(uS>0.001){const k=uS*(1-out);a6_fade(ctx,k,cx=>{setScreen(cx,S);cx.save();cx.beginPath();cx.rect(0,0,948,H);cx.clip();cx.translate(-250,-60);
      bab_sky(cx,t,{hz:700,dawn:0.4,day:0,sunX:1500,moonX:520});a6_ruin(cx,1000,700,2.4,{m:14,ruin:1,rubble:1,dawn:0.4,day:0});a6_cityWall(cx,t,{y0:700,dawn:0.4,day:0,wear:0.7,cyl:1,cx:620,cy:830});cx.restore();
      const sg=cx.createLinearGradient(800,0,948,0);sg.addColorStop(0,"rgba(3,5,11,0)");sg.addColorStop(1,"rgba(3,5,11,0.95)");cx.fillStyle=sg;cx.fillRect(800,0,148,H);
      a6_mapTower(cx,1434,640,0.5,t,{hi:0.75+0.25*Math.sin(t*1.3)});vign(cx,S);});}});

/* ---------- 9. Kept alive ---------- */
// Tomás and Inés, and the answer, with the map under it, kept; the next topic; then the end card
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tA=c("answer"),tN=c("next"),fade=1-fin(t,B,1.0),rl=fin(t,w("next","is kept")-0.3,0.6),tDg=w("next","Data governance");
  ctx.save();ctx.globalAlpha*=fade;drift(ctx,t,sc,{z:0.02,y:480});
  a6_who(ctx,"tomas",230,fin(t,0.6,0.8),t,{expr:a6_expr("calm","relieved",rl)});a6_who(ctx,"ines",1690,fin(t,0.8,0.8),t,{right:true,expr:a6_expr("calm","relieved",rl)});
  arrive(ctx,960,250,t,tA-0.2,()=>sticky(ctx,960,250,900,300,"Give the map an owner, a budget and a rhythm, not a project's end date. Check every change, read the map again from what's running, and let agents read the map itself, never a copy.",
    {col:NOTEC[3],size:30,rot:0.01,p:clamp((t-tA)/12.0,0,1)}),{dy:-16});
  withA(ctx,fin(t,1.0,1.0),()=>a6_mapTower(ctx,760,700,0.42,t,{hi:fin(t,w("next","is kept")-0.3,0.8)}));
  const nA=fin(t,tDg-0.3,0.7);if(nA>0.01)arrive(ctx,1230,632,t,tDg-0.3,()=>a6_card(ctx,1000,560,460,"next",["Data governance"],A6_OK,{size:40}),{dy:-10,a:nA});
  ctx.restore();vign(ctx,S);
  acaEnd(ctx,S,t,B,"Kept alive","Give the map an owner, a budget and a rhythm.","Film 6 of 6");});
