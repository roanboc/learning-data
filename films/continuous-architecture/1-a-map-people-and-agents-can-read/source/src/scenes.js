/* ===== A map people and agents can read: scenes =====
   Twelve chapters, as in ../script.md. Babylon in 652 BCE: each night a scholar watches the sky and writes down what he sees; an
   eclipse of the moon warns of the king's death; the sky repeats itself more slowly than a working life; what one watcher knew is
   lost when he stops, so they keep a diary, in the same order each night, half a year to a tablet, for six hundred years, under four
   lines of kings, whose cycles let later scholars predict the sky, and whose eclipses astronomers still read; the watcher's test.
   Then Tomás's map, used every week and going stale; moved into an enterprise architecture tool, which brings in what other systems
   already keep, with each one's ID; each element once, and once as a text file, the simplest approach; reviewed and versioned,
   with checks on the map itself; one map and many views, generated one way, down to dbt and Databricks; an agent that reads it, and
   is on it, with its rights; the retail code changing, the agent drafting and the head of retail confirming; a newcomer's first day,
   with a map; back to the watch, and the map kept by thirty people; and the answer.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame; what's drawn small is texture. Motion: every
   shot drifts slowly and things arrive with a spring. Sound: every effect in tools/score.py fires at the same moment as the thing it
   belongs to here, so keep the two in step. */

/* ---------- 1. The watch ---------- */
// the watcher's test, as a card over the night sky or the map
function d11_testCard(ctx,cx,y,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const q=o.q||"Could the next one read it, and carry on?",w=Math.max(tw(ctx,q,44,700)+110,560),col=o.col||ACA;
  glass(ctx,cx-w/2,y,w,150,22,col,{glow:16+10*(o.hi||0),ea:0.85,fill:"rgba(6,12,22,0.92)"});T(ctx,"the watcher's test",cx,y+52,{f:"mono",w:500,size:28,align:"center",color:rgba(col,1)});
  T(ctx,q,cx,y+112,{w:700,size:44,align:"center"});
  if(o.mark>0.01){const mx=cx+w/2-40,my=y+40;if(o.pass)kt_gtick(ctx,mx,my,20,o.mark);else kt_rcross(ctx,mx,my,20,o.mark);}});}
// Babylon's roof at night, as both ends of the opening show it: the sky, the moon, the city and the roof; o.ecl: the eclipse
function d11_babylon(ctx,t,o){o=o||{};d11_night(ctx,t,{cloud:o.cloud});d11_moon(ctx,1330,250,34,{ecl:o.ecl||0});
  // the planets out tonight: steady points among the stars
  [[520,300,3.2,[255,236,200]],[1720,170,2.6,[255,200,170]],[300,140,2.4,[240,232,214]]].forEach(([x,y,r,col])=>d11_planet(ctx,x,y,r,col,o.planets==null?1:o.planets));
  d11_city(ctx,t);d11_roof(ctx,t);}
// the six hundred years, on one line: the tablets kept, half a year to each, as a band above it (p: how far they reach, 0..1); the
// kings below it, each lit as it's named (k[i]); its two ends; u (0..1) widens the line to reach today
function d11_years(ctx,t,o){o=o||{};const u=o.u||0,X=yr=>d11_yx(yr,u),Y=600,p=clamp(o.p==null?1:o.p,0,1),a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{const x0=X(-652),x1=X(-61),xp=lerp(x0,x1,p);
    ctx.save();ctx.strokeStyle=rgba(BAB_CLAY,0.55);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x0-20,Y);ctx.lineTo(u>0.01?X(2026)+10:x1+20,Y);ctx.stroke();ctx.restore();
    // the tablets: one sliver for each half year, in clay, a little uneven, as far as they've reached
    if(xp>x0+1){ctx.save();const n=Math.round(1182*p),sw=(x1-x0)/1182;for(let i=0;i<n;i++){const x=x0+i*sw,h=30+hash(i,741)*12;ctx.fillStyle=rgba(mix(BAB_CLAY,BAB_MUD,0.25+0.5*hash(i,742)),0.75+0.25*hash(i,743));ctx.fillRect(x,Y-6-h,Math.max(0.9,sw*0.8),h);}ctx.restore();
      const g=ctx.createLinearGradient(0,Y-60,0,Y);g.addColorStop(0,rgba(BAB_SUN,0));g.addColorStop(1,rgba(BAB_SUN,0.1));ctx.fillStyle=g;ctx.fillRect(x0,Y-60,xp-x0,56);}
    // the kings they were kept under
    D11_KINGS.forEach(([nm,a0,a1,col],i)=>{const k=clamp((o.k||[])[i]||0,0,1);if(k<=0.01)return;const bx=X(a0),bw=X(a1)-bx;withA(ctx,k,()=>{ctx.fillStyle=rgba(col,0.22);rr(ctx,bx+2,Y+18,bw-4,46,10);ctx.fill();ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2;rr(ctx,bx+2,Y+18,bw-4,46,10);ctx.stroke();
      const s=bw-20>tw(ctx,nm,28,700)?nm:"";if(s)T(ctx,s,bx+bw/2,Y+51,{w:700,size:28,align:"center",color:rgba(mix(col,[255,255,255],0.45),1)});});});
    const e=o.ends||0;if(e>0.01)withA(ctx,e,()=>{T(ctx,"652 BCE",x0,Y+114,{f:"mono",w:500,size:28,color:rgba(BAB_CLAY,1)});T(ctx,"61 BCE",x1,Y+114,{f:"mono",w:500,size:28,align:u>0.5?"left":"right",color:rgba(BAB_CLAY,1)});});
    const b=o.span||0;if(b>0.01)withA(ctx,b,()=>{ctx.save();ctx.strokeStyle=rgba(BAB_SUN,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x0,Y-70);ctx.lineTo(x0,Y-84);ctx.lineTo(x1,Y-84);ctx.lineTo(x1,Y-70);ctx.stroke();ctx.restore();
      T(ctx,"nearly 600 years",(x0+x1)/2,Y-104,{w:800,size:34,align:"center",color:rgba(BAB_SUN,1)});});});}
// a cycle of the sky over the line of years: an arc for each return, from year a, every n years, k times, its height h; p (0..1)
function d11_cycle(ctx,a0,n,k,h,col,p,u){if(p<=0.01)return;ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.6;ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;
  for(let i=0;i<k;i++){const q=clamp(p*k-i,0,1);if(q<=0)break;const xa=d11_yx(a0+i*n,u),xb=d11_yx(a0+(i+1)*n,u),mx=(xa+xb)/2;ctx.beginPath();for(let s=0;s<=24*q;s++){const v=s/24,x=lerp(xa,xb,v),y=548-Math.sin(Math.PI*v)*h;s?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
    if(q>=1){ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(xb,548,4,0,TAU);ctx.fill();}}ctx.restore();}
scene("watch",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tSi=c("signs"),tSl=c("slow"),tNe=c("need"),tDi=c("diary"),tMo=c("month"),tCl=c("clouds"),tTa=c("tablet"),tYe=c("years"),tCy=c("cycles"),tTo=c("today"),tUt=c("utility"),tOu=c("outlive"),tTe=c("test");
  // the shots: Babylon's roof at night until the diary; the diary and its six hundred years, in one room; the utility; the roof again
  const A1=1-fin(t,tDi-0.7,1.0),A2=fin(t,tDi-0.7,1.0)*(1-fin(t,tUt-0.7,1.0)),A3=fin(t,tUt-0.7,1.0)*(1-fin(t,tTe-0.5,1.0)),A4=fin(t,tTe-0.5,1.0);
  // 1. the roof at night: a scholar watches the sky and writes; the moon, eclipsed; a planet's slow path; he stops, and the next carries on
  const night1=cx=>{setScreen(cx,S);cx.save();
    const tW=w("city","watches"),tWr=w("city","writes down"),tE=w("signs","eclipse"),tP=w("slow","some planets"),tL=w("need","lost"),tR=w("need","a record"),tN=w("need","the next"),tRd=w("need","read"),tC=w("need","carry on");
    focus(cx,t,[[0,960,560,1.0],[tW-0.6,860,600,1.2],[tSi-0.3,1120,480,1.08],[tSl-0.3,960,440,1.0],[tL-0.6,1000,610,1.16]],1.8);
    const ecl=clamp((t-tE+0.2)/2.2,0,1)*(1-fin(t,tSl-0.2,1.4));
    d11_babylon(cx,t,{ecl});
    // one planet's path over many nights, with its loop, and the planet moving along it
    const pp=clamp((t-tP+0.2)/5.6,0,1),pa=fin(t,tP-0.4,0.8)*(1-fin(t,tL-0.1,1.0));
    if(pa>0.01&&pp>0)withA(cx,pa,()=>{cx.save();cx.fillStyle=rgba([255,226,180],0.8);for(let s=0;s<=Math.floor(pp*90);s++){const[x,y]=d11_pathAt(s/90);cx.beginPath();cx.arc(x,y,2.2,0,TAU);cx.fill();}cx.restore();const[x,y]=d11_pathAt(pp);d11_planet(cx,x,y,4.4,[255,226,180],1);});
    // the scholar: he watches; writes down what he sees; looks up at the eclipse and the planet; then he stops, and is gone
    const up=1-fin(t,tWr-0.1,0.5)*(1-fin(t,tSi-0.4,0.6)),gone=1-fin(t,tL-0.1,1.1);
    d11_fade(cx,gone*fin(t,0.2,0.8),c2=>d11_scribe(c2,760,952,330,t,{dir:1,up,write:fin(t,tWr,0.4)*(1-fin(t,tSi-0.4,0.4))}));
    // the record left on the parapet; the next watcher comes up, takes it, reads it, and carries on
    const tabA=fin(t,tR-0.2,0.8),walk=clamp((t-tN+0.6)/2.2,0,1),nx=lerp(1700,1150,easeCam(walk)),take=easeCam(clamp((t-tRd+0.2)/0.6,0,1));
    const tabX=lerp(1010,nx-20*3.1,take),tabY=lerp(D11_WALL-10,952-68*3.1,take);
    if(tabA>0.01&&take<1)d11_tab(cx,tabX,tabY,46,{a:tabA,glow:0.6+0.4*pulseAt(t,tR,1.6)});
    const nA=fin(t,tN-0.6,0.8);if(nA>0.01)d11_fade(cx,nA,c2=>d11_scribe(c2,nx,952,310,t,{dir:-1,up:fin(t,tC-0.2,0.8),step:walk<1?t*5.2:null,tab:take>=1?1:0,glow:0.4*(1-fin(t,tC,1.0))}));
    cx.restore();
    // what the narration names, in screen space so it reads on a phone
    eaYear(cx,80,80,"Babylon · 652 BCE",ACA,fin(t,0.6,0.8)*(1-fin(t,tSi-0.6,0.6)));
    bab_tag(cx,760,214,"he watches the sky, and writes down what he sees",fin(t,tW-0.2,0.7)*(1-fin(t,tSi-0.5,0.6)));
    bab_tag(cx,960,214,"signs, for the king and the temples",fin(t,tSi+0.6,0.7)*(1-fin(t,tE-0.4,0.5)));
    bab_tag(cx,960,214,"an eclipse of the moon: a warning of the king's death",fin(t,tE-0.1,0.7)*(1-fin(t,tSl-0.5,0.6)),{col:ACA_WARN});
    // how long the sky takes to repeat itself, beside one watcher's working life
    const bA=fin(t,w("slow","seventy")-0.4,0.6)*(1-fin(t,tL-0.3,0.6));if(bA>0.01)withA(cx,bA,()=>{glass(cx,420,430,1080,210,22,ACA,{glow:10,ea:0.6,fill:"rgba(8,8,22,0.9)"});
      const f1=easeCam(clamp((t-w("slow","seventy")+0.2)/1.8,0,1)),f2=easeCam(clamp((t-w("slow","working life")+0.4)/1.4,0,1));
      T(cx,"a planet comes back: 70 to 80 years",464,482,{w:700,size:30,color:rgba([255,226,180],1)});cx.fillStyle=rgba([255,226,180],0.85);rr(cx,464,500,992*f1,20,10);cx.fill();
      withA(cx,fin(t,w("slow","working life")-0.5,0.5),()=>{T(cx,"one watcher's working life",464,572,{w:700,size:30,color:rgba(D11_MOONLIT,1)});cx.fillStyle=rgba(D11_MOONLIT,0.85);rr(cx,464,590,496*f2,20,10);cx.fill();});});
    bab_tag(cx,960,214,"what he knew, lost when he stopped",fin(t,tL-0.2,0.7)*(1-fin(t,tR-0.4,0.5)),{col:ACA_WARN});
    bab_tag(cx,960,214,"a record that outlives him",fin(t,tR-0.1,0.7)*(1-fin(t,tN-0.4,0.5)));
    bab_tag(cx,960,214,"the next can read it, and carry on",fin(t,tN-0.1,0.7)*(1-fin(t,tDi-0.9,0.5)));};
  // 2. the diary on clay, then half a year to each tablet, then six hundred years of them, the cycles they gave, and today
  const clay=cx=>{setScreen(cx,S);bab_sky(cx,t,{dawn:0,day:0,moon:false,hz:1300});cx.fillStyle="rgba(10,8,14,0.62)";cx.fillRect(0,0,W,H);
    const tN=w("diary","night after night"),tO=w("diary","same order"),tMn=w("diary","the moon"),tPl=w("diary","the planets"),tWe=w("diary","the weather");
    const rows=D11_NIGHTS.map((_,i)=>clamp((t-(tN-0.3+i*0.42))/0.7,0,1)),hi=t>tWe-0.2?3:t>tPl-0.2?2:t>tMn-0.2?1:-1,hiOn=t<tMo-0.3?hi:-1;
    const month=(fin(t,w("month","river")-0.2,0.5)+fin(t,w("month","prices")-0.2,0.5)+fin(t,w("month","what had happened")-0.2,0.5))/3;
    // half a year on each tablet: the tablet draws back, a second one comes beside it; then both go to the start of the line of years
    const sh=easeCam(clamp((t-(tTa-0.3))/1.5,0,1)),toLine=easeCam(clamp((t-(tYe-0.3))/1.4,0,1)),txtA=1-fin(t,tTa-0.4,0.35);
    const s1=lerp(lerp(1,0.26,sh),0.03,toLine),cxA=lerp(lerp(960,600,sh),206,toLine),cyA=lerp(lerp(480,470,sh),570,toLine);
    const bigA=1-fin(t,tYe+0.9,0.4);
    if(bigA>0.01)withA(cx,bigA,()=>{cx.save();cx.translate(cxA,cyA);cx.scale(s1,s1);cx.translate(-960,-480);
      d11_diary(cx,330,110,1260,740,t,{rows,cols:clamp((t-tO+0.2)/1.4,0,1),hi:hiOn,month,cloud:fin(t,tCl-0.1,1.0),cloudHi:pulseAt(t,w("clouds","I did not watch")-0.2,2.0),textA:txtA,deco:s1<0.98});cx.restore();});
    const s2=lerp(0.26,0.03,toLine),cxB=lerp(1040,224,toLine),cyB=lerp(470,570,toLine),bA=fin(t,w("tablet","the next watcher")-0.4,0.7)*bigA;
    if(bA>0.01)arrive(cx,cxB,cyB,t,w("tablet","the next watcher")-0.4,()=>withA(cx,bA,()=>{cx.save();cx.translate(cxB,cyB);cx.scale(s2,s2);cx.translate(-960,-480);d11_diary(cx,330,110,1260,740,t,{rows:[1,0.6,0,0],textA:0,deco:true});cx.restore();}),{dy:-12});
    const lA=fin(t,w("tablet","Half a year")-0.1,0.6)*(1-fin(t,tYe-0.4,0.5));if(lA>0.01)withA(cx,lA,()=>{T(cx,"half a year",600,700,{w:800,size:32,align:"center",color:rgba(BAB_CLAY,1)});
      const cA=fin(t,w("tablet","carried on")-0.3,0.6);if(cA>0.01)withA(cx,cA,()=>{arrowTo(cx,780,470,850,470,BAB_SUN,0.9,{p:clamp((t-w("tablet","carried on")+0.3)/0.6,0,1),lw:3,head:12});T(cx,"the next half year",1040,700,{w:800,size:32,align:"center",color:rgba(BAB_CLAY,1)});});});
    // the line of years: the tablets reach from 652 to 61 BCE, under four lines of kings
    const yA=fin(t,tYe-0.3,0.8);if(yA>0.01){const tK=["Babylonian","Persian","Greek","Parthian"].map(k=>w("years",k)),p=clamp((t-w("years","nearly six hundred")+0.4)/4.4,0,1),u=easeCam(clamp((t-(w("today","astronomers")-0.4))/1.8,0,1));
      d11_years(cx,t,{a:yA,p:toLine>0.99?Math.max(p,0.004):0.004,u,k:tK.map(x=>fin(t,x-0.2,0.6)),ends:fin(t,w("years","youngest")-0.3,0.6),span:fin(t,w("years","nearly six hundred")-0.2,0.6)*(1-fin(t,tCy-0.4,0.6))});
      // the cycles later scholars used: Venus every 8 years, Jupiter every 83; and the coming year, predicted
      const cyA=1-fin(t,tTo-0.3,0.7);
      if(cyA>0.01)withA(cx,cyA,()=>{const pV=clamp((t-w("cycles","eight years")+0.3)/1.6,0,1),pJ=clamp((t-w("cycles","eighty-three")+0.3)/1.6,0,1);
        d11_cycle(cx,-261,8,12,26,[255,226,170],pV,u);d11_cycle(cx,-250,83,1,150,[255,190,150],pJ,u);
        withA(cx,fin(t,w("cycles","eight years")-0.2,0.5),()=>T(cx,"Venus: every 8 years",d11_yx(-261,u)-18,532,{w:800,size:30,align:"right",color:rgba([255,226,170],1)}));
        withA(cx,fin(t,w("cycles","eighty-three")-0.2,0.5),()=>T(cx,"Jupiter: every 83 years",d11_yx(-208,u),370,{w:800,size:30,align:"center",color:rgba([255,190,150],1)}));
        const tPr=w("cycles","to predict");if(t>tPr-0.3)arrive(cx,1700,258,t,tPr-0.3,()=>{bab_clay(cx,1530,190,340,136);T(cx,"the coming year",1556,246,{f:"mono",w:500,size:28,color:rgba(mix(ACA_INK,BAB_BRICK,0.5),1)});T(cx,"planets, eclipses",1556,298,{w:800,size:30,color:rgba(ACA_INK,0.96)});},{dy:-12});});
      // today: the line reaches the present, and the eclipse records show the day growing longer
      const tdA=fin(t,w("today","eclipse records")-0.3,0.8);if(tdA>0.01)withA(cx,tdA,()=>{const X=yr=>d11_yx(yr,u),Ly=yr=>500-(yr+720)/2746*200;
        T(cx,"today",X(2026),714,{f:"mono",w:500,size:28,align:"right",color:rgba(INK,0.9)});
        const lp=clamp((t-w("today","the day")+0.3)/2.4,0,1);cx.save();cx.strokeStyle=rgba(D11_MOONLIT,0.95);cx.lineWidth=3;cx.shadowColor=rgba(D11_MOONLIT,0.7);cx.shadowBlur=10;cx.beginPath();
        for(let s=0;s<=60*lp;s++){const yr=-720+s/60*2746;s?cx.lineTo(X(yr),Ly(yr)):cx.moveTo(X(yr),Ly(yr));}cx.stroke();cx.restore();
        for(let i=0;i<14;i++){const yr=-720+i*48+hash(i,751)*20,q=fin(t,w("today","eclipse records")+i*0.06,0.4);if(q>0.01)withA(cx,q,()=>{glow(cx,X(yr),Ly(yr)+(hash(i,752)-0.5)*14,10,BAB_SUN,0.5);cx.fillStyle=rgba(BAB_SUN,1);cx.beginPath();cx.arc(X(yr),Ly(yr)+(hash(i,752)-0.5)*14,4,0,TAU);cx.fill();});}
        withA(cx,fin(t,w("today","eclipse records"),0.6),()=>T(cx,"Babylon's eclipse records",X(-560),420,{w:800,size:30,align:"left",color:rgba(BAB_SUN,1)}));
        withA(cx,fin(t,w("today","longer")-0.2,0.6),()=>{T(cx,"the day grows longer:",1720,190,{w:800,size:32,align:"right",color:rgba(D11_MOONLIT,1)});T(cx,"about 1.8 thousandths of a second a century",1720,236,{w:700,size:30,align:"right",color:rgba(INK,0.95)});});});}
  };
  // 3. the utility: Tomás's map, kept by him alone; without him it stops; kept one way, by everyone, it outlives anyone's job
  const now=cx=>{setScreen(cx,S);bg2(cx);motes(cx,t);cx.save();drift(cx,t-tUt,{dur:tTe-tUt+2},{z:0.02,y:440});
    const tO=w("utility","only he"),tS=w("utility","stops"),tK=w("outlive","one way"),tE=w("outlive","everyone"),gone=fin(t,tS-0.1,1.0)*(1-fin(t,tK-0.4,0.8)),back=fin(t,tE-0.5,0.8);
    const PEO=[["grace",300,0],["ama",540,1],["farah",1380,2]],st=gone;
    d11_mapCard(cx,690,150,540,400,{stale:st,hi:[0,1,2,3,4,5].map(i=>back*pulseAt(t,tE+i*0.18,1.6)),glow:back*0.6});
    if(t<tK+0.4){const lA=fin(t,tO-0.2,0.5)*(1-fin(t,tK-0.6,0.5));if(lA>0.01)withA(cx,lA,()=>{kt_lock(cx,1200,560,1.0,[200,200,210],1,0);tag(cx,960,620,"only Tomás can change it",[200,210,230],{align:"center",size:30});});}
    d11_fade(cx,(1-gone)*fin(t,tUt-0.4,0.8),c2=>d11_personR(c2,"tomas",1600,1060,0.8,{t,pose:"stand",expr:t>tO?"concerned":"calm"}));
    if(gone>0.01)withA(cx,gone*(1-back),()=>tag(cx,960,620,"it stops when he does",ACA_WARN,{align:"center",size:30}));
    PEO.forEach(([id,x,i])=>{const a=fin(t,tE-0.5+i*0.2,0.8);if(a<=0.01)return;d11_fade(cx,a,c2=>{if(x>960)d11_personR(c2,id,x,1060,0.78,{t});else person(c2,id,x,1060,0.78,{t});});
      d11_thread(cx,x<960?x+60:x-60,520,x<960?690:1230,230+i*90,clamp((t-tE-i*0.2)/0.8,0,1),LAY6[[2,0,4][i]][1],{a:0.6*a});});
    withA(cx,back,()=>tag(cx,960,620,"kept one way, by everyone",ACA,{align:"center",size:30}));
    cx.restore();vign(cx,S);};
  // 4. Babylon again: the next watcher on the roof, and the test
  const night2=cx=>{setScreen(cx,S);cx.save();focus(cx,t,[[tTe-0.6,980,560,1.04],[B,960,540,1.0]],4.0);d11_babylon(cx,t,{});
    d11_scribe(cx,1000,952,320,t,{dir:1,up:1-0.8*pulseAt(t,tTe+2.2,2.4),write:pulseAt(t,tTe+2.4,2.0)});cx.restore();
    d11_testCard(cx,960,300,fin(t,tTe-0.1,0.6)*(1-fin(t,B+0.6,0.6)),{hi:pulseAt(t,w("test","could"),1.6)});vign(cx,S);};
  let first=true;[[A1,night1],[A2,clay],[A3,now],[A4,night2]].forEach(([a,fn])=>{if(a<=0.002)return;if(first){fn(ctx);first=false;}else d11_fade(ctx,a,fn);});
  if(A1>0.002||A2>0.002)vign(ctx,S);
  acaTitle(ctx,S,t,B+1.0,"A map people and agents can read","kept in one tool, read by people and agents","Film 1 of 4 · Continuous architecture");});

/* ---------- 2. Useful, so at risk ---------- */
const D11_NOTE="How do we keep the map alive?";
scene("risk",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);wallBg(ctx,S,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:420});
  const tU=c("used"),tSt=c("stale"),tS=c("slides"),tC=c("copies"),tG=w("copies","glossary"),tW=c("worse"),tT=w("worse","trust"),tF=c("fails"),tN=w("fails","nobody"),tX=w("fails","fails");
  const st=fin(t,tSt,1.4),wv=fin(t,tW-0.1,0.7)*(1-fin(t,tF,0.6)),dim=fin(t,tN-0.4,0.8);
  // Tomás's note: the question this film answers
  arrive(ctx,330,180,t,0.3,()=>sticky(ctx,330,180,500,128,D11_NOTE,{col:NOTEC[0],size:32,st:0,rot:-0.025}),{dy:-20});
  // the map, used every week: three uses pinned round it
  const pu=k=>pulseAt(t,w("used",k),1.4),uses=[["requests, each tied to a decision",330,460,"requests",NOTEC[2],-0.02],["rules, each given a home",1590,210,"rules",NOTEC[3],0.02],["one page for the minister",1590,430,"minister",NOTEC[1],-0.015]];
  const hiA=fin(t,w("typed","applications")-0.3,0.5)*(1-fin(t,c("copies")-0.3,0.5));
  arrive(ctx,960,330,t,0.6,()=>d11_mapCard(ctx,680,110,560,440,{stale:st,glow:Math.max(pu("requests"),pu("rules"),pu("minister")),hi:[0,0,0,0,hiA,0]}),{dy:-16});
  const uOut=1-fin(t,tS-0.4,0.6);
  uses.forEach(([s_,x,y,k,col,rot])=>{const t0=w("used",k)-0.2;if(t<t0)return;const q=fin(t,t0,0.6)*uOut;if(q<=0.01)return;
    const ex=x<960?680:1240,ey=clamp(y,170,520);arrowTo(ctx,x<960?x+220:x-220,y,ex,ey,[90,80,64],0.7*q,{p:fin(t,t0+0.2,0.6),lw:3,head:12});
    arrive(ctx,x,y,t,t0,()=>withA(ctx,uOut*(1-0.3*st),()=>sticky(ctx,x,y,420,120,s_,{col,size:30,rot})),{dy:-16});});
  // every week: the weeks it's been used, ticked off under the map
  const wkA=uOut*(1-fin(t,tSt-0.3,0.5)),wk=clamp((t-tU-0.4)/4.5,0,1)*wkA;if(wk>0)for(let i=0;i<10;i++){const q=clamp(wk*10-i,0,1)*wkA;if(q<=0)continue;withA(ctx,q,()=>{ctx.fillStyle=rgba(EAC,0.85);ctx.beginPath();ctx.arc(780+i*40,590,7,0,TAU);ctx.fill();});}
  withA(ctx,fin(t,w("used","every week"),0.5)*wkA,()=>T(ctx,"used every week",960,642,{w:700,size:28,align:"center",color:rgba(EAC,1)}));
  if(st>0.01)withA(ctx,st*(1-fin(t,tS-0.4,0.5)),()=>tag(ctx,960,612,"last changed in March",CLAY,{align:"center",size:28}));
  // where it lives: slides, and a modelling tool only Tomás edits
  if(t>tS-0.1)arrive(ctx,330,640,t,tS-0.1,()=>{[2,1,0].forEach(i=>d11_slide(ctx,140+i*16,520-i*14,360,230,{rot:-0.03+i*0.02,head:i?null:"Our map",headSize:28,stale:st}));tag(ctx,320,800,"slides",[200,210,230],{align:"center",size:28});},{dy:-14});
  const tool=fin(t,w("slides","modelling tool")-0.2,0.6)*(1-fin(t,tG-0.4,0.6));
  if(tool>0.01)withA(ctx,tool,()=>{glass(ctx,1340,150,480,320,14,[180,190,210],{glow:10,ea:0.6,fill:"rgba(20,24,34,0.97)"});ctx.fillStyle="rgba(40,46,62,1)";rr(ctx,1340,150,480,50,14);ctx.fill();ctx.fillRect(1340,180,480,20);
    [0,1,2].forEach(i=>{ctx.fillStyle=rgba([[232,96,84],[245,206,140],[132,226,160]][i],0.9);ctx.beginPath();ctx.arc(1366+i*24,175,7,0,TAU);ctx.fill();});T(ctx,"modelling tool",1446,185,{w:700,size:28,color:rgba(SOFT,1)});
    d11_mini(ctx,1370,222,300,220,{stale:st});kt_lock(ctx,1748,330,1.1,[200,200,210],1,0);
    withA(ctx,fin(t,w("slides","only")-0.1,0.5),()=>tag(ctx,1580,500,"only Tomás edits",[200,210,230],{align:"center",size:30}));});
  // its applications, typed in by hand from the IT service management tool: one name typed, carried up into the map's application
  // row; then three of the row's five have changed at the source since
  const tY=c("typed"),yOut=1-fin(t,tC-0.3,0.5),tK=w("typed","typed"),tUp=w("typed","from")-0.2,AR=D11_MAP.R[4],ay=180+57.33*4+14.3,ab=k=>[710+AR[k].u*500-AR[k].w*250,ay,AR[k].w*500,28.7];
  if(t>tY-0.2&&yOut>0.01){
    arrive(ctx,960,756,t,tY+0.1,()=>withA(ctx,yOut,()=>d11_srcCard(ctx,2,700,700,520,112,{hi:pulseAt(t,w("typed","IT service")-0.2,1.4)})),{dy:16});
    const up=ease(fin(t,tUp,1.1)),cy=lerp(664,438,up),ca=fin(t,tK-0.2,0.4)*(1-fin(t,tUp+0.9,0.4))*yOut,nm="billing",typed=typeOn(nm,fin(t,tK,0.9));
    if(ca>0.01){withA(ctx,ca*0.7,()=>{ctx.save();ctx.setLineDash([8,8]);ctx.strokeStyle=rgba(SOFT,0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(960,698);ctx.lineTo(960,Math.max(cy+24,552));ctx.stroke();ctx.restore();});
      withA(ctx,ca,()=>{const cw=tw(ctx,nm,28,500,"mono")+48;glass(ctx,960-cw/2,cy-22,cw,44,10,D11_SAND,{glow:10,ea:0.85,fill:"rgba(22,16,8,0.96)"});T(ctx,typed,960-cw/2+16,cy+10,{f:"mono",w:500,size:28,color:rgba(mix(D11_SAND,INK,0.4),1)});
        if(Math.floor(t*2.4)%2===0&&up<0.05){const cx=960-cw/2+16+tw(ctx,typed,28,500,"mono")+3;ctx.fillStyle=rgba(D11_SAND,0.9);ctx.fillRect(cx,cy-14,2.4,30);}});}
    withA(ctx,fin(t,w("typed","by hand")-0.1,0.5)*(1-fin(t,tUp+0.9,0.4))*yOut,()=>tag(ctx,1070,620,"typed by hand",SOFT,{size:28}));
    // where it lands, then the three that have changed since
    const land=pulseAt(t,tUp+0.9,1.2);if(land>0.01){const[bx,by,bw,bh]=ab(2);glow(ctx,bx+bw/2,by+bh/2,40,APL,0.35*land);}
    const tCh=w("typed","many");[0,2,3].forEach((k,i)=>{const q=fin(t,tCh+i*0.25,0.5)*yOut;if(q<=0.01)return;const[bx,by,bw,bh]=ab(k);withA(ctx,q,()=>{glow(ctx,bx+bw/2,by+bh/2,30,AMBER,0.3);ctx.strokeStyle=rgba(AMBER,0.95);ctx.lineWidth=3;rr(ctx,bx-4,by-4,bw+8,bh+8,6);ctx.stroke();});});
    withA(ctx,fin(t,w("typed","since")-0.3,0.5)*yOut,()=>{const s_="changed since March",tw_=tw(ctx,s_,28,700)+26;tag(ctx,666-tw_,438,s_,AMBER,{size:28});});}
  // the glossary and the catalogue, each with its own words for the same thing
  const gOut=1-fin(t,tW-0.3,0.6);
  if(t>tG-0.2)arrive(ctx,1580,215,t,tG-0.2,()=>withA(ctx,gOut,()=>{glass(ctx,1340,150,480,130,16,INF,{glow:12,ea:0.8,fill:"rgba(16,10,8,0.95)"});T(ctx,"glossary",1366,194,{f:"mono",w:500,size:28,color:rgba(INF,1)});T(ctx,"estimated reading",1366,252,{w:800,size:34});}),{dy:-12});
  if(t>w("copies","catalogue")-0.2)arrive(ctx,1580,425,t,w("copies","catalogue")-0.2,()=>withA(ctx,gOut,()=>{glass(ctx,1340,360,480,130,16,[150,190,255],{glow:12,ea:0.8,fill:"rgba(6,10,20,0.95)"});T(ctx,"catalogue",1366,404,{f:"mono",w:500,size:28,color:rgba([150,190,255],1)});T(ctx,"readings.est_flag",1366,462,{f:"mono",w:500,size:32});}),{dy:-12});
  withA(ctx,fin(t,w("copies","own words"),0.4)*gOut,()=>{glow(ctx,1580,318,40,D11_RED,0.25);T(ctx,"≠",1580,338,{w:800,size:56,align:"center",color:rgba(D11_RED,1)});});
  // the copies drift: three decks, each a little different
  const cps=[["board pack",800,700,-0.05,{wrong:7}],["retail plan",1130,712,0.03,{missing:11}],["data strategy",1460,692,-0.02,{missing:4,wrong:15}]],tCd=w("copies","drift"),dr=i=>fin(t,tCd-0.2+i*0.25,0.5)>0.5;
  cps.forEach(([nm,x,y,rot,o_],i)=>{const t0=tC+0.2+i*0.35,u=ease(clamp((t-t0)/1.1,0,1));if(u<=0||(i===0&&wv>0.01))return;const xx=lerp(330,x,u),yy=lerp(640,y,u);
    withA(ctx,1-dim*0.4,()=>d11_slide(ctx,xx-150,yy-100,300,200,{rot,head:nm,headSize:28,missing:dr(i)?o_.missing:null,wrong:dr(i)?o_.wrong:null}));});
  withA(ctx,fin(t,tCd-0.1,0.5)*(1-fin(t,tW-0.3,0.5)),()=>T(ctx,"the copies drift",1130,592,{w:800,size:32,align:"center",color:rgba([255,214,160],1)}));
  // a stale map is worse than none: the board pack's copy, which everyone trusts, and which is out of date
  if(wv>0.01){ctx.save();ctx.fillStyle=rgba([14,11,8],0.62*wv);ctx.fillRect(-100,-100,W+200,H+200);ctx.restore();
    const u=ease(fin(t,tW-0.1,0.9)),sc_=lerp(1,1.9,u),cx_=lerp(800,900,u),cy_=lerp(700,500,u);withA(ctx,wv,()=>{ctx.save();ctx.translate(cx_,cy_);ctx.scale(sc_,sc_);d11_slide(ctx,-150,-100,300,200,{rot:-0.05*(1-u),head:"board pack",headSize:28,wrong:7});ctx.restore();
      withA(ctx,fin(t,tT-0.3,0.5),()=>tag(ctx,cx_-sc_*150+70,cy_-sc_*100-30,"trusted",TRUST,{align:"center",size:30}));
      const e=D11_MAP.R[2][0],ex=cx_+(-120+e.u*240)*sc_,ey=cy_+(-34+18*2.5)*sc_,ro=fin(t,tT+0.4,0.5);if(ro>0.01)withA(ctx,ro,()=>{ring(ctx,ex,ey,30*sc_/1.4,D11_RED,0.95,3.5);tag(ctx,ex+40,ey+sc_*100-20,"out of date",D11_RED,{size:30});});});}
  // Tomás, the only one who edits it; then, if he left
  const tL=c("fails"),gone=fin(t,tL+0.3,1.2);
  withA(ctx,1-gone,()=>d11_personR(ctx,"tomas",1730,1060,0.78,{t,pose:"stand",expr:t>tSt?"concerned":"calm"}));
  if(gone>0.01)withA(ctx,gone*(1-dim*0.5),()=>{ctx.save();ctx.setLineDash([9,9]);ctx.strokeStyle=rgba(TECH,0.55);ctx.lineWidth=2.4;ctx.beginPath();ctx.ellipse(1730,612,40,50,0,0,TAU);ctx.moveTo(1650,1000);ctx.quadraticCurveTo(1660,700,1730,690);ctx.quadraticCurveTo(1800,700,1810,1000);ctx.stroke();ctx.restore();});
  ctx.restore();
  if(dim>0.01){setScreen(ctx,S);ctx.fillStyle=rgba([8,6,4],0.6*dim);ctx.fillRect(0,0,W,H);}
  d11_testCard(ctx,960,380,dim,{mark:fin(t,tX,0.5),pass:false,hi:pulseAt(t,tX,1.4)});
  vign(ctx,S);});

/* ---------- 3. One map, many sources ---------- */
// the tool's window, and where the graph sits in it: its bands line up with the rows of the map's side panel in later chapters
const D11_WIN=[60,96,1100,560],D11_GX=380,D11_GW=740,D11_GY=270,D11_SCX=1240,D11_SCW=620,D11_SCY=[180,320,480];
const d11_gxy=i=>[D11_GX+D11_GN[i][1]*D11_GW,D11_GY+D11_GN[i][0]*56];
scene("sources",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);
  // the wall gives way to glass as the map moves into the tool
  const tE=w("move","enterprise"),wallA=1-fin(t,tE-0.6,1.0);bg2(ctx);motes(ctx,t);if(wallA>0.01)withA(ctx,wallA,()=>wallBg(ctx,S,t));
  ctx.save();drift(ctx,t,sc,{z:0.02,y:440});
  const tK=w("kept","already"),tIn=c("in"),tR=c("rest"),tTm=c("terms"),tJ=c("job"),tG=w("move","graph");
  // the window: the map's name, what it is, and the people who use it
  const[WX,WY,WW,WH]=D11_WIN;arrive(ctx,WX+WW/2,WY+WH/2,t,tE-0.6,()=>d11_window(ctx,WX,WY,WW,WH,{sub:"an enterprise architecture tool",subA:fin(t,tE,0.5),people:clamp((t-w("move","everyone")+0.1)/1.2,0,1),glow:pulseAt(t,w("job","modelling"),1.6)}),{dy:-12});
  const wa=fin(t,tE-0.5,0.6);
  // what it's made of: a search, a database and a graph
  if(wa>0.01)withA(ctx,wa,()=>{glass(ctx,96,172,252,48,24,[170,200,245],{glow:0,ea:0.35,fill:"rgba(10,16,30,0.9)"});ctx.save();ctx.strokeStyle=rgba(SOFT,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(126,194,9,0,TAU);ctx.moveTo(133,201);ctx.lineTo(141,209);ctx.stroke();ctx.restore();T(ctx,"search",152,206,{w:600,size:28,color:rgba(SOFT,0.9)});});
  [["database",w("move","database"),d11_db,420],["graph",tG,d11_gglyph,640]].forEach(([s_,t0,g,x])=>{const q=fin(t,t0-0.15,0.5);if(q<=0.01)return;withA(ctx,q,()=>{glass(ctx,x,172,tw(ctx,s_,28,700)+76,48,24,EAC,{glow:8+14*pulseAt(t,t0,1.4),ea:0.8,fill:"rgba(6,14,16,0.95)"});g(ctx,x+28,196,26,EAC);T(ctx,s_,x+52,206,{w:700,size:28,color:rgba(EAC,1)});});});
  // the layers down its side, lined up with the graph's bands
  D11_TREE.forEach(([nm,col],i)=>{const q=fin(t,tE-0.2+i*0.08,0.5);if(q<=0.01)return;const y=D11_GY+i*56,hi=i===3?fin(t,w("terms","glossary")-0.2,0.5)*(1-fin(t,tJ-0.3,0.6)):0;withA(ctx,q,()=>{
    if(hi>0.01){ctx.fillStyle=rgba(col,0.12*hi);rr(ctx,80,y-24,1060,48,10);ctx.fill();}glow(ctx,102,y,14,col,0.3);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(102,y,8,0,TAU);ctx.fill();T(ctx,nm,124,y+10,{f:"mono",w:500,size:28,color:rgba(mix(col,INK,0.3),1)});});});
  // the slide's boxes fly into the graph, each to its layer's band; the rest of the graph fills in
  const fl0=tE-0.1,byBand=D11_TREE.map((_,r)=>D11_GN.map((n,i)=>[n,i]).filter(([n])=>n[0]===r).sort((A,B)=>A[0][1]-B[0][1]).map(([,i])=>i)),FROM={};
  {let n=0;D11_MAP.R.forEach((row,i)=>row.forEach((e,k)=>{const SX=600,SY=210,SW=720,SH=480,py=SH*0.05+46,mx=SX+30,my=SY+py+10,mw=SW-60,mh=SH-py-36,rh=mh/6,bw=e.w*mw,bh=rh*0.5;
    FROM[byBand[i][k]]={x:mx+e.u*mw,y:my+rh*i+rh*0.5,w:bw,h:bh,d:n++*0.03};}));}
  const land=i=>FROM[i]?fl0+FROM[i].d+1.1:fl0+1.2+i*0.02,na=i=>FROM[i]?(t>=land(i)?1:0):fin(t,land(i),0.5);
  const sl=1-fin(t,fl0+0.3,0.9);if(sl>0.01)withA(ctx,sl,()=>d11_slide(ctx,600,210,720,480,{head:"Our map",headSize:32}));
  Object.entries(FROM).forEach(([i,F])=>{const u=ease(clamp((t-fl0-F.d)/1.1,0,1));if(u<=0||u>=1)return;const[nx,ny]=d11_gxy(+i),col=D11_TREE[D11_GN[i][0]][1],x=lerp(F.x,nx,u),y=lerp(F.y,ny,u)-Math.sin(u*Math.PI)*30,ww=lerp(F.w,18,u),hh=lerp(F.h,18,u);
    ctx.fillStyle=rgba(col,0.2+0.6*u);rr(ctx,x-ww/2,y-hh/2,ww,hh,Math.min(ww,hh)/2*u+4*(1-u));ctx.fill();ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=1.6;rr(ctx,x-ww/2,y-hh/2,ww,hh,Math.min(ww,hh)/2*u+4*(1-u));ctx.stroke();});
  // kept somewhere else: what comes from other systems empties to a dashed ring, then fills as its source brings it in, ringed in sand
  const thr=k=>w("in","brings")-0.3+k*0.4,arr=i=>{const k=D11_GN[i][2];return thr(k)+0.9+(1166-d11_gxy(i)[0])/1400;};
  const nh=i=>D11_GN[i][2]<0?0:fin(t,tK+i*0.02,0.5)*(1-fin(t,arr(i),0.35)),ns=i=>fin(t,arr(i),0.4);
  const own=i=>D11_GN[i][2]<0,cap=[6,7,8],rule=[3],dec=[28,29,30];
  const nl=i=>Math.max(D11_GN[i][2]>=0?pulseAt(t,arr(i),1.0)+pulseAt(t,w("where",["Strategy","goals","applications"][D11_GN[i][2]])+0.2,1.2)*0.6:0,
    own(i)?fin(t,w("rest","written"),0.5)*(1-fin(t,tTm-0.4,0.6))*0.6:0,cap.includes(i)?pulseAt(t,w("rest","capabilities"),1.2):0,rule.includes(i)?pulseAt(t,w("rest","rules"),1.2):0,dec.includes(i)?pulseAt(t,w("rest","decisions"),1.2):0,
    D11_GN[i][0]===3?fin(t,w("terms","glossary")-0.2,0.5)*(1-fin(t,tJ-0.3,0.6)):0,pulseAt(t,w("job","modelling")+0.1+D11_GN[i][1]*0.4,1.0)*0.8);
  const tL=w("rest","links"),el=e=>Math.max(fin(t,tL+e*0.02,0.4)*(1-fin(t,tTm-0.4,0.8)),pulseAt(t,w("job","modelling")+e*0.01,1.2));
  d11_graph(ctx,D11_GX,D11_GY,D11_GW,{a:wa,na,nh,ns,nl,ea:e=>fin(t,tG-0.1+e*0.02,0.5),el});
  // the sources, each where it's kept: a card, then threads into the tool, one for each layer it feeds
  const SRCB=[[0,1],[0,1],[4,5]];
  withA(ctx,fin(t,w("kept","somewhere")-0.2,0.5)*(1-fin(t,w("job","data integration")-0.4,0.5)),()=>T(ctx,"kept somewhere else",D11_SCX+D11_SCW/2,140,{w:800,size:30,align:"center",color:rgba(D11_SAND,1)}));
  [0,1,2].forEach(k=>{const t0=w("where",["Strategy","goals","applications"][k])-0.2,y=D11_SCY[k];if(t<t0)return;const ym=y+56;
    SRCB[k].forEach((r,j)=>{const tp=fin(t,thr(k)+j*0.12,0.9),p1=(t-(thr(k)+0.4))/0.8,p2=(t-(w("in","in step")+k*0.1))/0.9,p3=(t-(w("job","data integration")-0.1+k*0.12))/0.9;
      d11_thread(ctx,D11_SCX-8,ym,1168,D11_GY+r*56,tp,D11_SAND,{a:0.55,lw:2.4,pulse:p1>0&&p1<1?p1:p2>0&&p2<1?p2:p3>0&&p3<1?p3:null});});
    arrive(ctx,D11_SCX+D11_SCW/2,ym,t,t0,()=>d11_srcCard(ctx,k,D11_SCX,y,D11_SCW,112,{hi:Math.max(pulseAt(t,t0+0.25,1.3),pulseAt(t,thr(k)+0.1,1.2)*0.7)}),{dy:-14});});
  // brought in with its source's ID, and kept in step: billing, from IT service management
  const pgA=fin(t,w("in","source's")-0.3,0.5)*(1-fin(t,tR-0.3,0.5));
  if(pgA>0.01){const[nx,ny]=d11_gxy(20);withA(ctx,pgA,()=>{ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(D11_SAND,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(nx,ny+16);ctx.lineTo(nx,684);ctx.stroke();ctx.restore();ring(ctx,nx,ny,17,D11_SAND,0.9,2.4);});
    arrive(ctx,760,774,t,w("in","source's")-0.3,()=>d11_file(ctx,360,684,800,"application/APP-004.yml",[["name","billing"],["source","IT service management · CI-00417",{hiCol:D11_SAND}]],{col:APL,a:pgA,hi:[0,fin(t,w("in","source's ID")-0.1,0.4)],chip:["in step",D11_OK,fin(t,w("in","in step")-0.1,0.4)]}),{dy:-12});}
  // the rest is written in the map itself
  const rA=fin(t,w("rest","written")-0.2,0.5)*(1-fin(t,tTm-0.3,0.5));
  if(rA>0.01)withA(ctx,rA,()=>{const items=[["capabilities",STR],["rules",D11_RULE],["decisions",D11_KIND.decision[1]],["links",EAC]],lab="written in the map";let x=960-(tw(ctx,lab,28,500,"mono")+24+items.reduce((s_,[n])=>s_+tw(ctx,n,30,700)+26+16,0)-16)/2;
    T(ctx,lab,x,782,{f:"mono",w:500,size:28,color:rgba(EAC,1)});x+=tw(ctx,lab,28,500,"mono")+24;
    items.forEach(([n,col])=>{const q=fin(t,w("rest",n)-0.15,0.4);withA(ctx,q,()=>tag(ctx,x,772,n,col,{size:30}));x+=tw(ctx,n,30,700)+26+16;});});
  // even the glossary: each term a business object, defined once, by the business
  const gA=fin(t,w("terms","business object")-0.4,0.5)*(1-fin(t,tJ-0.3,0.5));
  if(gA>0.01){const[nx,ny]=d11_gxy(14);withA(ctx,gA,()=>{ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(INF,0.8);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(nx,ny+16);ctx.lineTo(nx,676);ctx.stroke();ctx.restore();ring(ctx,nx,ny,17,INF,0.9,2.4);});
    arrive(ctx,760,770,t,w("terms","business object")-0.4,()=>d11_term(ctx,360,676,800,{a:gA,by:fin(t,w("terms","defined")-0.1,0.5),tick:fin(t,w("terms","by the business")+0.3,0.5),glow:pulseAt(t,w("terms","defined"),1.4)}),{dy:-12});}
  // a data integration job, as well as a modelling one
  const jA=fin(t,w("job","data integration")-0.3,0.5);
  if(jA>0.01)withA(ctx,jA,()=>{const a1="data integration",mid="as well as",a2="modelling",w1=tw(ctx,a1,32,700)+26,wm=tw(ctx,mid,30,700),w2=tw(ctx,a2,32,700)+26,x0=960-(w1+wm+w2+48)/2,q2=fin(t,w("job","modelling")-0.2,0.4);
    tag(ctx,x0,774,a1,D11_SAND,{size:32});withA(ctx,q2,()=>{T(ctx,mid,x0+w1+24,785,{w:700,size:30,color:rgba(SOFT,1)});tag(ctx,x0+w1+wm+48,774,a2,EAC,{size:32});});});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Each element once ---------- */
const D11_SIX=[["capability","CAP-004","connect customers"],["step","STP-004","read · meter to cash"],["domain","DOM-001","network"],["object","OBJ-003","reading"],["rule","RUL-021","estimate replaced by actual"],["measure","MSR-002","working days to connect new solar"]];
// the same element in both ways of keeping a map: a page in the tool, and a text file in a repository
const D11_BOTH=[["id","RUL-021"],["name","estimate replaced by actual"],["owner","Grace Achieng"],["evidence","metering rules 7.4 · 14 Mar 2027"],["status","confirmed"]];
scene("text",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,y:440});
  const tI=c("id"),tFd=c("fields"),tD=c("decisions"),tF=c("files"),tS=c("scale"),out=fin(t,tF-0.5,0.6);
  // each element kept once: six of them, one of each kind
  const six=1-fin(t,tI-0.2,0.8);
  D11_SIX.forEach(([k,id,nm],i)=>{const t0=w("once",k==="object"?"business object":k)-0.15,x=140+(i%3)*560,y=210+Math.floor(i/3)*230;if(t<t0)return;const isR=k==="rule";
    if(isR&&t>tI-0.2)return;arrive(ctx,x+260,y+85,t,t0,()=>withA(ctx,six,()=>d11_fileMini(ctx,x,y,520,k,id,nm,{hi:pulseAt(t,t0+0.15,1.2)})),{dy:-14});});
  withA(ctx,fin(t,w("once","kept once")-0.1,0.5)*six,()=>T(ctx,"each element, kept once",960,130,{w:800,size:36,align:"center",color:rgba(EAC,1)}));
  // the rule's page, opened: its id first, then the rest, line by line
  const fo=fin(t,tI-0.3,0.8),dOut=fin(t,tD-0.3,0.8),FX=lerp(1260,110,ease(fo)),FY=lerp(440,140,ease(fo));
  if(fo>0.01&&out<0.99){const rows=D11_RUL021.map((_,i)=>{const at=[tI,tI+0.3,w("fields","named as")-0.3,w("fields","definition"),w("fields","definition")+0.2,w("fields","definition")+0.4,w("fields","owner"),w("fields","relationships"),w("fields","relationships")+0.25,w("fields","relationships")+0.5,w("rules","evidence"),w("rules","whether")][i];return fin(t,at,0.6);});
    const tN=w("id","Names change"),hi=D11_RUL021.map((_,i)=>i===0?Math.max(pulseAt(t,w("id","stable ID"),1.6),fin(t,w("id","IDs don't"),0.4)*(1-fin(t,tFd-0.2,0.6))):i===1?pulseAt(t,tN+0.2,1.6):(i===2||i===8||i===9)?pulseAt(t,w("fields","ArchiMate"),2.0):i===10?pulseAt(t,w("rules","evidence"),1.8):i===11?pulseAt(t,w("rules","confirmed"),1.8):0);
    const L=D11_RUL021.map(([k,v,op],i)=>i===1?[k,v,{from:"estimated reading superseded",u:clamp((t-tN-0.3)/0.9,0,1)}]:i===11?[k,v,{tick:fin(t,w("rules","confirmed"),0.5)}]:[k,v,op]);
    const nR=Math.max(2,...rows.map((r,i)=>r>0.01?i+ease(clamp(r*1.6,0,1)):0));withA(ctx,fo*(1-dOut*0.75)*(1-out),()=>{ctx.save();const sc2=lerp(0.45,1,ease(fo));ctx.translate(FX,FY);ctx.scale(sc2,sc2);d11_file(ctx,0,0,1180,"motivation/RUL-021.yml",L,{col:D11_RULE,rows,hi,h:84+nR*48+6});ctx.restore();});}
  // everything else points to the id
  const pt=fin(t,w("id","points")-0.6,0.6)*(1-fin(t,tFd-0.3,0.6));
  [["step","STP-004 · read",BUS,250],["check","on readings",D11_OK,370],["view","meter to cash",[170,205,255],490]].forEach(([k,s_,col,y],i)=>{const t0=w("id","everything")+i*0.25;if(t<t0-0.2||pt<=0.01)return;
    arrive(ctx,1620,y,t,t0-0.2,()=>withA(ctx,pt,()=>{const tx=1410;glass(ctx,tx,y-34,420,68,34,col,{glow:10,ea:0.8,fill:"rgba(6,10,20,0.95)"});T(ctx,k,tx+24,y+10,{f:"mono",w:500,size:28,color:rgba(col,1)});T(ctx,s_,tx+24+tw(ctx,k+"  ",28,500,"mono"),y+10,{w:700,size:30});
      arrowTo(ctx,tx-10,y,402,FY+66+24,col,0.85,{p:fin(t,t0,0.7),lw:2.6,head:12,bend:0.15*(i-1)});}),{dy:8});});
  const hiID=fin(t,w("id","IDs don't"),0.4)*(1-fin(t,tFd-0.2,0.6));if(hiID>0.01)withA(ctx,hiID,()=>tag(ctx,136,FY+66+2*48+56,"the id never changes",EAC,{size:30}));
  withA(ctx,pulseAt(t,w("fields","ArchiMate"),2.4),()=>tag(ctx,1330,FY+66+8.6*48,"named as ArchiMate names them",[200,186,255],{size:28}));
  // day one's two rules, now on every element
  const dr=fin(t,w("rules","two rules")-0.2,0.6)*(1-fin(t,tD-0.4,0.6));
  if(dr>0.01){const ey=FY+66+10*48+22,sy=FY+66+11*48+22,t1=ey-8,t2=sy+20;withA(ctx,dr,()=>{T(ctx,"from day one",1340,t1-62,{f:"mono",w:500,size:28,color:rgba(SOFT,0.9)});tag(ctx,1340,t1,"every note names its source",EAC,{size:30});
    withA(ctx,fin(t,w("rules","whether")-0.3,0.5),()=>tag(ctx,1340,t2,"a draft until its owner confirms it",TRUST,{size:30}));
    arrowTo(ctx,1326,t1,880,ey,EAC,0.8,{p:fin(t,w("rules","evidence"),0.6),lw:2.6,head:12,bend:0});arrowTo(ctx,1326,t2,500,sy,TRUST,0.8,{p:fin(t,w("rules","whether"),0.6),lw:2.6,head:12,bend:0});});}
  // decisions are kept too, each saying why
  if(t>tD-0.3&&out<0.99){const L=D11_DEC007,rows=L.map((_,i)=>fin(t,tD+0.1+i*0.2,0.5));
    arrive(ctx,1340,460,t,tD-0.3,()=>withA(ctx,1-out,()=>d11_file(ctx,860,180,960,"decisions/DEC-007.yml",L,{col:D11_KIND.decision[1],rows,hi:L.map((_,i)=>i===3||i===4?pulseAt(t,w("decisions","why"),2.0)*1.2:0)})),{dy:-16});}
  // two ways to keep the same element: a page in the tool, and a text file in a repository, the simplest approach
  const bq=fin(t,B-0.4,1.2),sA=fin(t,tF-0.3,0.6),same=pulseAt(t,w("scale","Either way")+0.1,2.2),big=fin(t,w("scale","needs the tool")-0.1,0.5);
  if(sA>0.01){const L=D11_BOTH.map(([k,v],i)=>i===2?[k,v,{tick:1}]:[k,v]),hi=L.map((_,i)=>same*(i===1?0.6:1));
    arrive(ctx,510,410,t,tF-0.3,()=>{withA(ctx,sA*(1-bq),()=>T(ctx,"in the tool",120,222,{w:800,size:32,color:rgba(EAC,1)}));d11_file(ctx,100,250,820,"motivation/RUL-021.yml",L,{col:D11_RULE,a:sA*(1-bq*0.6),hi,glow:big*0.8+same*0.5});},{dy:-14});
    arrive(ctx,1410,410,t,w("files","text files")-0.3,()=>{const q=fin(t,w("files","text files")-0.3,0.6)*(1-bq);withA(ctx,q,()=>T(ctx,"as a text file, in a repository",1020,222,{w:800,size:32,color:rgba(SOFT,1)}));d11_file(ctx,1000,250,820,"motivation/RUL-021.yml",L,{col:D11_RULE,a:q,files:true,hi,glow:same*0.5});},{dy:-14});
    withA(ctx,fin(t,w("files","simplest")-0.2,0.5)*(1-bq),()=>tag(ctx,1020,630,"the simplest approach",[200,215,240],{size:30}));
    withA(ctx,fin(t,w("scale","many sources")-0.2,0.5)*(1-bq),()=>tag(ctx,120,630,"many sources",D11_SAND,{size:30}));
    withA(ctx,fin(t,w("scale","many people")-0.2,0.5)*(1-bq),()=>tag(ctx,120+tw(ctx,"many sources",30,700)+26+20,630,"many people, in their roles",EAC,{size:30}));
    withA(ctx,fin(t,w("scale","the same")-0.3,0.5)*(1-bq),()=>T(ctx,"the same ideas",960,760,{w:800,size:36,align:"center",color:rgba(TRUST,1)}));}
  // breathing out: the elements go into the map
  if(bq>0.01){ctx.restore();ctx.save();withA(ctx,bq,()=>{ctx.fillStyle="rgba(4,6,12,0.84)";ctx.fillRect(0,0,W,H);});arrive(ctx,300,470,t,B-0.2,()=>d11_tree(ctx,80,150,440,{p:clamp((t-B)/1.2,0,1)}),{dy:-12});
    const u=ease(clamp((t-B-0.3)/1.0,0,1));if(u>0&&u<1){const x=lerp(510,150,u),y=lerp(412,270,u)-Math.sin(u*Math.PI)*80;
      withA(ctx,1-u*0.5,()=>{ctx.save();ctx.translate(x,y);ctx.scale(1-u*0.85,1-u*0.85);glass(ctx,-150,-100,300,200,10,D11_RULE,{glow:12,ea:0.9,fill:"rgba(6,10,20,0.95)"});ctx.restore();});}}
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Reviewed and versioned ---------- */
const D11_VERS=[["v2.4","23 Jul"],["v2.5","6 Aug"],["v2.6","20 Aug"],["v2.7","3 Sep"],["v2.8","17 Sep"]];
const D11_HIST=[["v2.7","3 Sep","OBL-006 · evidence updated","Ama"],["v2.6","20 Aug","DEC-007 · one outage system, added","Grace"],["v2.5","6 Aug","RUL-021 · renamed and confirmed","Grace"],["v2.4","23 Jul","the map, moved into the tool","Tomás"]];
scene("review",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tP=c("pr"),tC=c("checks"),tW=c("power"),tV=c("repo")+0.4;
  ctx.save();focus(ctx,t,[[0,960,540,1.0]],1.8);
  // the map in the tool, as its side panel shows it
  d11_tree(ctx,80,150,440,{p:1,hi:D11_TREE.map((_,i)=>i===1?fin(t,tP+0.3,0.6)*(1-fin(t,tC-0.4,0.6)):0),scan:(t-tC-0.1)/2.2,warn:D11_TREE.map((_,i)=>i===1?fin(t,tW+0.3,0.5):0)});
  // every version is kept: the map's history, newest first; then the versions fly to a line under the side panel
  const f0=tP-1.1,fl=ease(clamp((t-f0)/1.1,0,1)),la=fin(t,f0+1.5,0.15);
  d11_history(ctx,600,150,1240,D11_HIST,{a:fin(t,tV-0.5,0.5)*(1-fin(t,f0+0.1,0.6)),rows:D11_HIST.map((_,i)=>fin(t,w("repo","who changed")-0.3+i*0.22,0.5)),nov:fl>0});
  // they fly down and round, under the side panel, the oldest first, each to its place on the line
  if(fl>0&&la<1)D11_HIST.forEach(([v],i)=>{const x0=660,y0=288+i*64,x1=120+(3-i)*90,y1=756,u=ease(clamp((t-f0-(3-i)*0.15)/1.1,0,1)),k=1-u;if(u<=0)return;withA(ctx,1-la,()=>T(ctx,v,k*k*x0+2*k*u*(x0-20)+u*u*x1,k*k*y0+2*k*u*800+u*u*y1,{f:"mono",w:500,size:28,align:"center",color:rgba(mix(mix(EAC,INK,0.3),TRUST,i===0?1:0),1)}));});
  const approved=w("owner","obligations")+0.8,vA=fin(t,f0+0.4,0.6),vn=4+fin(t,approved+0.4,0.6);
  if(vA>0.01){withA(ctx,vA,()=>T(ctx,"every version, kept",300,700,{w:700,size:28,align:"center",color:rgba(EAC,1)}));d11_vline(ctx,120,790,360,D11_VERS,{a:vA,n:vn,la,warn:D11_VERS.map((_,i)=>fin(t,tW+0.6+i*0.25,0.4))});}
  // a change, proposed as a draft, line by line; once approved it folds to its title
  const D=[["-","heat: red"],["+","heat: amber"],["+","evidence: MSR-002, 18 working days · Aug 2027"],[" ","reported to the regulator: OBL-006"]];
  const rows=D.map((_,i)=>fin(t,w("pr","proposed")-0.2+i*0.35,0.6)),rev=[["Grace Achieng","network",fin(t,w("owner","Grace")+0.6,0.5),fin(t,w("owner","Grace")-0.2,0.5)],["Ama Owusu","obligations",fin(t,w("owner","Ama")+0.7,0.5),fin(t,w("owner","Ama")-0.2,0.5)]];
  if(t>tP)arrive(ctx,1220,360,t,tP+0.05,()=>d11_pr(ctx,600,100,1240,"Connect customers: amber","strategy/CAP-004.yml",{diff:D,rows,rev,state:t>approved?"approved · v2.8":"draft",stateCol:t>approved?TRUST:EAC,glow:pulseAt(t,approved,1.4),fold:clamp((t-(tC-0.9))/0.9,0,1)}),{dy:-16});
  // the last line: the number is reported to the regulator under an obligation, so its owner reviews too
  withA(ctx,pulseAt(t,w("owner","Ama"),2.0),()=>{ctx.fillStyle=rgba(MOT,0.12);rr(ctx,614,276+3*50,1212,46,6);ctx.fill();});
  // checks on the map itself, on every change
  const CK=[["every element has an owner",t>tW+0.2?2:0,t>tW+0.2?"generate power":"",fin(t,w("list","Every element"),0.5)],["every rule has a reason and a home",t>w("list","Every rule")+1.4?1:0,"",fin(t,w("list","Every rule"),0.5)],["every measure has a definition",t>w("list","Every measure")+1.4?1:0,"",fin(t,w("list","Every measure"),0.5)]];
  if(t>tC-0.3)arrive(ctx,1220,400,t,tC-0.3,()=>d11_checks(ctx,600,262,1240,CK,{t,glow:pulseAt(t,tW+0.2,1.6)}),{dy:-14});
  withA(ctx,fin(t,tC+0.2,0.5)*(1-fin(t,w("list","Every element")-0.3,0.4)),()=>T(ctx,"running on every change…",1220,412,{w:700,size:30,align:"center",color:rgba(SOFT,0.9)}));
  // the element the check finds: generate power, with no owner
  const gA=fin(t,tW+0.5,0.5);if(gA>0.01){arrowTo(ctx,1700,404,1700,590,AMBER,gA,{p:fin(t,tW+0.3,0.6)});arrive(ctx,1450,710,t,tW+0.5,()=>d11_file(ctx,1060,600,780,"strategy/CAP-009.yml",[["id","CAP-009"],["name","generate power"],["owner","none",{vcol:AMBER,hiCol:AMBER}]],{col:STR,hi:[0,0,fin(t,tW+1.0,0.6)]}),{dy:-12});}
  ctx.restore();vign(ctx,S);});

/* ---------- 6. One map, many views ---------- */
const D11_READERS=["architects","everyone","data teams","machines","owners","the board"];
// where view k sits: first a wide card in a column, then (as u goes 0..1) a chip in a narrower column, with dbt and Databricks below
function d11_vrect(k,u){const A=[800,130+k*120,1040,104],B=[1456,112+k*86,384,72];return k>5?B:A.map((v,i)=>lerp(v,B[i],u));}
scene("views",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tG=c("gen"),tRd=c("readers"),tD=c("dbt"),tX=c("dbx"),tN=c("nobody");
  ctx.save();focus(ctx,t,[[0,960,540,1.0]],1.8);
  // the fix: a pencil tries the glossary, then goes to the map; every view follows
  const pIn=tN-0.3,pBlock=w("nobody","edits")+0.15,pGo=w("nobody","fix")-0.3,pAt=pGo+0.9,pul=pAt+0.15;
  d11_tree(ctx,80,150,440,{p:1,hi:D11_TREE.map((_,i)=>i===3?fin(t,pAt-0.1,0.3)*(1-fin(t,pul+2.2,0.8)):0)});
  const u=ease(clamp((t-(tD-1.5))/1.5,0,1)),sx=522,sy=401,oneWay=w("gen","one way");
  const named=["ArchiMate","glossary","conceptual","ontology","tests","heat"].map(s_=>w("list",s_));
  // the threads, one way, from the map to every view
  for(let k=0;k<8;k++){const[x,y,cw,ch]=d11_vrect(k,u),tp=k<6?fin(t,tG+0.4+k*0.15,1.0):fin(t,(k===6?tD:tX)-0.3,0.8);if(tp<=0.01)continue;
    const p1=(t-(oneWay-0.2+k*0.12))/1.0,p2=(t-(pul+k*0.07))/0.9;d11_thread(ctx,sx,sy,x-8,y+ch/2,tp,EAC,{a:0.5,pulse:p1>0&&p1<1?p1:p2>0&&p2<1?p2:null});}
  const gT=fin(t,tN-0.9,0.6);if(gT>0.01){const p2=(t-(pul+0.2))/0.9;d11_thread(ctx,sx,sy,552,422,gT,EAC,{a:0.5,pulse:p2>0&&p2<1?p2:null});}
  withA(ctx,fin(t,oneWay-0.3,0.5)*(1-u),()=>T(ctx,"generated from the map · one way",800,100,{f:"mono",w:500,size:28,color:rgba(EAC,1)}));
  // the views: named one by one, each with who reads it; then a column of chips, with dbt and Databricks
  for(let k=0;k<8;k++){const ap=k<6?fin(t,tG+0.9+k*0.15,0.5):fin(t,(k===6?tD:tX)-0.2,0.5);if(ap<=0.01)continue;const[x,y,cw,ch]=d11_vrect(k,u);
    const arr=pul+k*0.07+0.9,hi=k===6?fin(t,tD,0.4)*(1-fin(t,tX-0.6,0.4)):k===7?fin(t,tX,0.4)*(1-fin(t,tN-1.2,0.4)):k===1?fin(t,tN-0.9,0.4):0;
    d11_vcard(ctx,k,x,y,cw,ch,{a:k<6?lerp(0.4,1,fin(t,named[k]-0.2,0.4))*ap:ap,fill:k<6?fin(t,named[k]-0.2,0.4):1,reader:D11_READERS[k],rd:k<6?fin(t,tRd+0.2+k*0.25,0.4)*(1-clamp(u*3,0,1)):0,hi,fl:pulseAt(t,arr,1.1)});}
  // dbt: each model carries its owner, its domain and the IDs of its rules
  const dA=fin(t,tD+0.05,0.5)*(1-fin(t,tX-0.6,0.4));if(dA>0.01)arrive(ctx,980,410,t,tD+0.05,()=>d11_dbt(ctx,560,180,840,{a:dA,lit:[0,0,0,0,0,fin(t,w("dbt","owner")-0.1,0.4),fin(t,w("dbt","domain")-0.1,0.4),fin(t,w("dbt","IDs")-0.1,0.4)]}),{dy:-14});
  // Databricks: each table shows its owner, its tags and its description, beside its lineage
  const xA=fin(t,tX+0.05,0.5)*(1-fin(t,tN-1.2,0.4));if(xA>0.01)arrive(ctx,980,440,t,tX+0.05,()=>d11_dbx(ctx,560,170,840,{a:xA,h:540,lit:{owner:fin(t,w("dbx","owner")-0.1,0.4),tags:fin(t,w("dbx","tags")-0.1,0.4),desc:fin(t,w("dbx","description")-0.1,0.4),lineage:fin(t,w("dbx","lineage")-0.1,0.4)}}),{dy:-14});
  // nobody edits a view: the glossary says where it comes from, and the pencil can't change it
  if(gT>0.01){const fx=clamp((t-(pul+1.1))/0.8,0,1);arrive(ctx,980,420,t,tN-0.9,()=>d11_gloss(ctx,560,220,840,{a:gT,hi:fin(t,pIn+0.4,0.4)*(1-fin(t,pGo,0.4)),fix:fx,glow:pulseAt(t,pul+1.1,1.2)}),{dy:-14});
    const bk=fin(t,pBlock,0.3)*(1-fin(t,pGo+0.2,0.4));if(bk>0.01)withA(ctx,bk,()=>{const cx=1040,cy=356;glass(ctx,cx-20,cy-20,40,40,20,D11_RED,{glow:12,ea:0.9,fill:"rgba(30,8,10,0.95)"});ctx.strokeStyle=rgba(D11_RED,1);ctx.lineWidth=3.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx-8,cy-8);ctx.lineTo(cx+8,cy+8);ctx.moveTo(cx+8,cy-8);ctx.lineTo(cx-8,cy+8);ctx.stroke();tag(ctx,cx+34,cy,"read only",D11_RED,{size:28});});}
  // the pencil: to the glossary, then to the map
  const pa=fin(t,pIn,0.4)*(1-fin(t,pAt+0.9,0.4));if(pa>0.01){const g1=ease(clamp((t-pIn)/0.8,0,1)),g2=ease(clamp((t-pGo)/0.9,0,1)),sh=t>pBlock&&t<pBlock+0.4?Math.sin((t-pBlock)*60)*5*(1-(t-pBlock)/0.4):0;
    const x=lerp(lerp(1200,1006,g1),372,g2)+sh,y=lerp(lerp(560,400,g1),446,g2)-Math.sin(g2*Math.PI)*90;d11_pencil(ctx,x,y,1.3,pa,-0.75);}
  ctx.restore();vign(ctx,S);});

/* ---------- 7. An agent reads it ---------- */
scene("reads",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tA=c("now"),tQ=c("request"),tCh=c("change"),tK=c("column"),tI=c("cites");
  ctx.save();focus(ctx,t,[[0,960,540,1.0]],1.8);
  const RY=i=>270+i*56;// the middle of each row in the side panel
  // the agent walks the layers for the change, then goes to the rules for the column
  const walk0=w("change","walks")-0.3,wp=clamp((t-walk0)/2.8,0,1),toTop=ease(clamp((t-(tCh-0.2))/0.8,0,1)),toRule=ease(clamp((t-(tK+0.2))/0.9,0,1));
  const AY=t<tK?lerp(lerp(420,RY(0),toTop),RY(5),ease(wp)):lerp(RY(5),RY(0),toRule),busy=fin(t,w("request","asks")-0.2,0.4)*(1-fin(t,w("request","decision"),0.5))+fin(t,walk0,0.3)*(1-fin(t,walk0+2.9,0.4))+fin(t,tK+0.2,0.3)*(1-fin(t,w("column","rule")+0.5,0.5));
  const hiRow=D11_TREE.map((_,i)=>{const pass=t>=walk0&&t<walk0+3.2&&i<6?clamp(1-Math.abs(AY-RY(i))/56,0,1):0;return Math.max(pass,i===0?fin(t,w("column","rule")-0.3,0.4)*(1-fin(t,tI+1.0,0.6)):0);});
  d11_tree(ctx,80,150,440,{p:1,hi:hiRow});
  // the agent arrives, and reads the map
  const ag=fin(t,tA-0.3,0.8);if(ag>0.01){const sw=fin(t,tA+0.3,0.6)*(1-fin(t,tQ+0.4,0.5)),one=t>=walk0-0.2&&t<tCh+7.4||t>tK+0.2;
    kt_scan(ctx,570,AY,300,one?AY:400,Math.max(sw,busy*0.9)*ag,t,{w:one?24:230});
    arrive(ctx,600,AY,t,tA-0.3,()=>kt_agent(ctx,600,AY,30,t,{busy}),{dy:0,from:0.6});
    withA(ctx,fin(t,tA+0.2,0.5)*(1-fin(t,tQ-0.2,0.4)),()=>T(ctx,"an agent",600,AY+80,{w:700,size:28,align:"center",color:rgba(KT_AI,1)}));}
  // a request: who will decide what with the answer, then the decision, the capability and the owner, or nothing
  const q1=fin(t,tQ-0.1,0.5)*(1-fin(t,tCh-0.7,0.5));if(q1>0.01){
    arrive(ctx,1270,182,t,tQ-0.1,()=>d11_ask(ctx,700,120,1140,"a request","Which streets can take more solar?",{a:q1}),{dy:-14});
    withA(ctx,q1*fin(t,w("request","asks")-0.2,0.5),()=>{T(ctx,"it asks",720,292,{f:"mono",w:500,size:28,color:rgba(KT_AI,1)});T(ctx,"who will decide what with the answer?",720+tw(ctx,"it asks",28,500,"mono")+22,292,{w:700,size:28,color:rgba(INK,0.92)});});
    const TR=[["decision","decision","approve a solar connection",D11_KIND.decision[1]],["capability","capability","assess network capacity",STR],["actor","owner","Grace Achieng",TRUST]];
    if(t>w("request","decision")-0.4)arrive(ctx,1270,450,t,w("request","decision")-0.4,()=>d11_trace(ctx,700,320,1140,TR,{a:q1,rows:[fin(t,w("request","decision")-0.1,0.4),fin(t,w("request","capability")-0.1,0.4),fin(t,w("request","owner")-0.1,0.4)]}),{dy:-12});
    const nA=fin(t,w("request","nothing")-1.0,0.5);if(nA>0.01){arrive(ctx,1270,682,t,w("request","nothing")-1.0,()=>d11_ask(ctx,700,620,1140,"a request","A live outage dashboard for the lobby",{a:q1*nA,size:32}),{dy:-12});
      const nn=fin(t,w("request","nothing")-0.1,0.4)*q1;if(nn>0.01){kt_rcross(ctx,1560,682,17,nn);withA(ctx,nn,()=>T(ctx,"reaches nothing",1590,692,{w:700,size:28,color:rgba(SOFT,1)}));}}}
  // a change: the agent walks the layers and lists the owners who must agree
  const q2=fin(t,tCh-0.1,0.5)*(1-fin(t,tK-0.7,0.5));if(q2>0.01){
    arrive(ctx,1270,182,t,tCh-0.1,()=>d11_ask(ctx,700,120,1140,"a change","Time-of-use prices, from April",{a:q2,note:"as for the social tariff",noteA:fin(t,w("change","social")-0.2,0.5)}),{dy:-14});
    const H=[[0,"obligation","OBL-009","tariffs the regulator approves","Ama Owusu"],[2,"step","STP-005","bill","head of retail"],[3,"object","OBJ-003","reading, every half hour","Grace Achieng"],[5,"node","TEC-002","meter network","Grace Achieng"]];
    H.forEach(([row,kind,id,nm,ow],i)=>{const at=walk0+row/5*2.8,ha=fin(t,at,0.4)*q2;if(ha<=0.01)return;const y=300+i*86;d11_thread(ctx,522,RY(row),694,y+35,fin(t,at,0.5),D11_TREE[row][1],{a:0.55*q2});
      arrive(ctx,1270,y+35,t,at,()=>d11_hit(ctx,700,y,1140,kind,id,nm,ow,{a:ha}),{dy:-10});});
    const oA=fin(t,w("change","owners")-0.3,0.5)*q2;if(oA>0.01)arrive(ctx,1270,715,t,w("change","owners")-0.3,()=>d11_agree(ctx,700,660,1140,["head of retail","Grace Achieng","Ama Owusu"],{a:oA,rows:[0,1,2].map(i=>fin(t,w("change","owners")+i*0.3,0.4))}),{dy:-10});}
  // a column: the rule behind it, with its owner and its reason; then the answer, which cites them
  const q3=fin(t,tK-0.1,0.5);if(q3>0.01){
    arrive(ctx,1270,210,t,tK-0.1,()=>d11_col(ctx,700,120,1140,{a:q3,hi:fin(t,tK+0.4,0.5)}),{dy:-14});
    // (the rule's page gives way at the click, then its source opens in its place)
    const rA=fin(t,w("column","rule")-0.3,0.5),sO=fin(t,w("cites","check")-0.25,0.35);if(rA*(1-sO)>0.01){d11_thread(ctx,522,RY(0),694,470,rA,D11_RULE,{a:0.55*(1-sO)});
      arrive(ctx,1270,470,t,w("column","rule")-0.3,()=>d11_file(ctx,700,330,1140,"motivation/RUL-020.yml",[["id","RUL-020"],["name","every reading is marked actual or estimated"],["owner","Grace Achieng",{tick:1}],["evidence","metering rules 7.2 · 14 Mar 2027"]],{col:D11_RULE,a:rA*(1-sO),rows:[0,1,2,3].map(i=>fin(t,w("column","rule")-0.1+i*0.2,0.4)),hi:[0,0,fin(t,w("column","owner")-0.1,0.4)*(1-fin(t,tI,0.6)),fin(t,w("column","reason")-0.1,0.4)*(1-fin(t,tI,0.6))]}),{dy:-12});}
    const aA=fin(t,tI-0.3,0.5);if(aA>0.01){let link=[0,0];const ck=w("cites","check");
      arrive(ctx,1270,722,t,tI-0.3,()=>d11_answer(ctx,700,640,1140,{a:aA,t,ul:fin(t,w("cites","IDs")-0.1,0.5),chk:fin(t,ck+0.9,0.4),glow:pulseAt(t,ck+0.9,1.2),linkAt:(lx,ly)=>{link=[lx,ly];}}),{dy:-12});
      // a person can check it: open the source, and it says what the answer says
      const cA=fin(t,w("cites","person")-0.5,0.4)*(1-fin(t,ck+1.6,0.5)),cm=ease(clamp((t-(w("cites","person")-0.5))/0.9,0,1));d11_cursor(ctx,lerp(1500,link[0],cm),lerp(880,link[1]+6,cm),1.3,cA,clamp((t-(ck-0.1))/0.5,0,1));
      const sA=fin(t,ck,0.4);if(sA>0.01)arrive(ctx,1270,470,t,ck,()=>d11_source(ctx,960,360,620,220,t,{a:sA,hl:clamp((t-(ck+0.5))/0.6,0,1)}),{dy:-10});}}
  ctx.restore();vign(ctx,S);});

/* ---------- 8. An agent on the map ---------- */
scene("rights",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tOn=c("on"),tM=c("may"),tAs=c("asks"),tO=c("owner"),tS=c("same");
  ctx.save();focus(ctx,t,[[0,960,540,1.0]],1.8);
  // the agent goes into the map, as software in its application layer
  const f0=tOn-0.2,f1=w("on","map itself")+0.2,fu=ease(clamp((t-f0)/(f1-f0),0,1)),land=fin(t,f1-0.1,0.4);
  d11_tree(ctx,80,150,440,{p:1,plus:[0,0,0,0,land,0,0],hi:D11_TREE.map((_,i)=>i===4?pulseAt(t,f1,1.6)*0.9+fin(t,tS+0.4,0.5)*0.5:0)});
  const ox=lerp(600,404,fu),oy=lerp(270,494,fu)-Math.sin(fu*Math.PI)*60;kt_agent(ctx,ox,oy,lerp(30,12,fu),t,{busy:fu<1?0.6:0});
  // its page: software, an application component, filling a role, with its rights written down
  const fA=fin(t,w("on","software")-0.4,0.5),rl=w("on","role"),rw=w("on","rights"),own=w("owner","Tomás"),FY=84;
  if(fA>0.01){d11_thread(ctx,522,494,694,300,fA,APL,{a:0.5});
    const L=[["id","APP-030"],["name","map agent"],["kind","application component"],["assigned to","ROL-009 · map drafter"],["rights",""],[null,"may: read everything, draft changes",{ind:1,vcol:mix(D11_OK,INK,0.35),hiCol:D11_OK}],[null,"may not: confirm a change",{ind:1,vcol:mix(D11_RED,INK,0.35),hiCol:D11_RED}],
      [null,"asks: the owner, when sources disagree",{ind:1,vcol:mix(TRUST,INK,0.35),hiCol:TRUST}],["owner","Tomás Herrera",{tick:fin(t,own+0.5,0.4)}],["evidence","DEC-015 · an agent for the map · Sep 2027"],["status","confirmed",{from:"draft",u:clamp((t-own-0.8)/0.6,0,1),tick:fin(t,own+1.3,0.4)}]];
    const rows=L.map((_,i)=>i<3?fin(t,w("on","software")-0.2+i*0.2,0.4):i===3?fin(t,rl-0.1,0.4):i<8?fin(t,rw-0.3+(i-4)*0.25,0.4):i===8?fin(t,own-0.2,0.5):fin(t,rw+0.9+(i-9)*0.2,0.4));
    const hi=L.map((_,i)=>i===3?fin(t,rl,0.4)*(1-fin(t,rw-0.2,0.5)):i===5?fin(t,w("may","read")-0.2,0.4)*(1-fin(t,tAs-0.3,0.5)):i===6?fin(t,w("may","may not")-0.1,0.4)*(1-fin(t,tAs-0.3,0.5)):i===7?fin(t,tAs,0.4)*(1-fin(t,tO-0.3,0.5)):i===8?fin(t,own-0.2,0.4)*(1-fin(t,tS-0.3,0.5)):0);
    arrive(ctx,1270,390,t,w("on","software")-0.4,()=>d11_file(ctx,700,FY,1140,"application/APP-030.yml",L,{col:APL,a:fA,rows,hi,glow:pulseAt(t,own+1.3,1.2)}),{dy:-14});
    // a tick for what it may do, a cross for what it may not
    const mk=(i,k,at)=>{const q=fin(t,at,0.4);if(q<=0.01)return;const yy=FY+66+i*48+48*0.66-10,xx=1790;if(k===0)withA(ctx,q,()=>tick_(ctx,xx,yy+2,30,D11_OK,1));else if(k===1)withA(ctx,q,()=>cross_(ctx,xx,yy,26,D11_RED,1));else withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(xx-14,yy);ctx.lineTo(xx+12,yy);ctx.moveTo(xx+3,yy-9);ctx.lineTo(xx+12,yy);ctx.lineTo(xx+3,yy+9);ctx.stroke();ctx.restore();});};
    mk(5,0,w("may","read"));mk(6,1,w("may","may not"));mk(7,2,tAs+0.2);}
  // like the outage agent's
  const oA=fin(t,w("on","outage")-0.5,0.5)*(1-fin(t,tAs-0.7,0.5));if(oA>0.01)arrive(ctx,1270,800,t,w("on","outage")-0.5,()=>d11_outage(ctx,700,724,1140,{a:oA}),{dy:-12});
  // where two sources disagree, it doesn't choose: it asks the owner
  const dA=fin(t,tAs-0.2,0.5)*(1-fin(t,tS-0.6,0.5));if(dA>0.01){d11_disagree(ctx,700,724,t,{a:dA,pa:fin(t,tAs-0.2,0.4),pb:fin(t,tAs+0.2,0.4),ne:fin(t,w("asks","disagree")-0.1,0.4)});
    const qA=fin(t,w("asks","owner")-0.4,0.5)*dA;if(qA>0.01)arrive(ctx,1678,800,t,w("asks","owner")-0.4,()=>d11_question(ctx,1516,724,324,t,{a:qA,glow:pulseAt(t,w("asks","owner"),1.2)}),{dy:-12});}
  // agents draft, people confirm, every version is kept: the rule that keeps data models true, applied to the map
  const rA=fin(t,tS-0.3,0.5);if(rA>0.01)arrive(ctx,1270,800,t,tS-0.3,()=>d11_rule3(ctx,700,724,1140,t,{a:rA,rows:[fin(t,w("same","Agents")-0.1,0.4),fin(t,w("same","people")-0.1,0.4),fin(t,w("same","every version")-0.1,0.4)],sw:clamp((t-(w("same","applied")-0.1))/0.6,0,1),glow:pulseAt(t,w("same","applied")+0.4,1.4)}),{dy:-12});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. People confirm ---------- */
const D11_VERS2=[["v2.9","1 Oct"],["v3.0","14 Jan"],["v3.1","4 Feb"]];
scene("confirm",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tCo=c("code"),tCl=c("clause"),tF=c("finds"),tD=c("drafts"),tC=c("confirms"),tV=c("track");
  ctx.save();focus(ctx,t,[[0,960,540,1.0]],1.8);
  // the agent leaves application/ to search the rules; then signs its draft
  const out=ease(clamp((t-(tF-0.6))/0.8,0,1)),toPR=ease(clamp((t-(tD-0.3))/0.9,0,1)),scan=fin(t,tF+0.2,0.4)*(1-fin(t,w("finds","reason")+0.3,0.5));
  d11_tree(ctx,80,150,440,{p:1,plus:[0,0,0,0,1,0,0],hi:D11_TREE.map((_,i)=>i===0?scan:0)});
  const ox=lerp(lerp(404,600,out),742,toPR),oy=lerp(lerp(494,270,out),396,toPR)-Math.sin(toPR*Math.PI)*50,orr=lerp(lerp(12,26,out),14,toPR);
  if(scan>0.01)kt_scan(ctx,ox-26,oy,320,270,scan,t,{w:26});
  // the regulator changes the retail code: a sentence added to clause 4.2, written in as it's read
  const pA=fin(t,tCo-0.2,0.6);if(pA>0.01)arrive(ctx,1270,209,t,tCo-0.2,()=>d11_code(ctx,700,84,1140,250,t,{a:pA,hl:fin(t,tCl,0.6)*(1-fin(t,tD-0.4,0.6)),nw:clamp((t-(tCl-0.1))/(w("clause","not")-tCl),0,1)}),{dy:-16});
  // the one rule whose reason is that clause: retail's half of day one's rule
  const fA=fin(t,w("finds","one rule")-0.3,0.5)*(1-fin(t,tD-0.6,0.5));if(fA>0.01){d11_thread(ctx,522,270,694,520,fA,D11_RULE,{a:0.5});
    const L=[["id","RUL-022"],["definition",""],[null,"A bill based on a replaced estimate",{ind:1}],[null,"is corrected on the next bill.",{ind:1}],["owner","head of retail",{tick:1}],["evidence","retail code 4.2 · Jul 2026"],["status","confirmed",{tick:1}]];
    const ev=fin(t,w("finds","reason")-0.2,0.4);
    arrive(ctx,1270,560,t,w("finds","one rule")-0.3,()=>d11_file(ctx,700,350,1140,"motivation/RUL-022.yml",L,{col:D11_RULE,a:fA,rows:L.map((_,i)=>fin(t,w("finds","one rule")-0.1+i*0.15,0.4)),hi:[0,0,0,0,fin(t,w("finds","retail's")-0.2,0.4),ev,0]}),{dy:-12});
    if(ev>0.01)arrowTo(ctx,1560,334,1230,668,AMBER,ev*fA*0.9,{p:clamp((t-(w("finds","reason")-0.2))/0.6,0,1),bend:-0.18});
    const pr=fin(t,w("finds","half")-0.4,0.5)*fA;if(pr>0.01)arrive(ctx,1270,825,t,w("finds","half")-0.4,()=>d11_hit(ctx,700,790,1140,"rule","RUL-021","its pair, the network's half","Grace Achieng",{a:pr}),{dy:-10});}
  // the draft: the rule's new words; and what they touch, the billing team's tracking table and two views
  const dA=fin(t,tD-0.1,0.5),conf=w("confirms","confirms")+0.1,merged=t>conf+0.6;
  if(dA>0.01){const D=[["-","is corrected on the next bill."],["+","is corrected within ten working days."],["-","evidence: retail code 4.2 · Jul 2026"],["+","evidence: retail code 4.2 · Jan 2028"]];
    arrive(ctx,1270,548,t,tD-0.1,()=>d11_pr(ctx,700,350,1140,"RUL-022: corrected within ten working days","motivation/RUL-022.yml",{a:dA,kicker:"      drafted by the map agent",diff:D,rows:D.map((_,i)=>fin(t,w("drafts","new words")-0.3+i*0.3,0.6)),state:merged?"confirmed · v3.1":"waiting for the head of retail",stateCol:merged?TRUST:AMBER,glow:pulseAt(t,conf,1.4),fold:clamp((t-(tV-0.7))/0.9,0,1)}),{dy:-14});
    const tTb=w("drafts","tracking table"),tTv=w("drafts","two views"),tA=fin(t,w("drafts","what they touch")-0.3,0.4)*(1-fin(t,tV-0.8,0.5));
    if(tA>0.01)d11_touches(ctx,700,790,[[4,"bills to correct"],[2,"meter to cash"],[3,"ontology"]],{a:tA,rows:[fin(t,tTb-0.2,0.4),fin(t,tTv-0.2,0.4),fin(t,tTv+0.15,0.4)]});
    // the head of retail, who owns the rule, confirms it
    kt_rstamp(ctx,1600,610,"confirmed · head of retail",TRUST,fin(t,conf,0.3)*(1-fin(t,tV-0.8,0.5)),clamp((t-conf)/0.35,0,1),{size:30});}
  kt_agent(ctx,ox,oy,orr,t,{busy:scan>0.3||(toPR>0&&toPR<1)?0.8:0});
  // the map's new version, as the head of retail confirms it: every version is kept
  const vA=fin(t,conf+0.4,0.5);if(vA>0.01){withA(ctx,vA,()=>T(ctx,"every version, kept",300,700,{w:700,size:28,align:"center",color:rgba(EAC,1)}));d11_vline(ctx,120,790,360,D11_VERS2,{a:vA,n:2+fin(t,conf+0.9,0.6)});}
  // from the next morning, the billing team's tracking table shows each bill not corrected within ten working days
  const tK=w("track","tracking table"),bA=fin(t,tK-0.4,0.5);if(bA>0.01)arrive(ctx,1270,678,t,tK-0.4,()=>d11_track(ctx,700,494,1140,{a:bA,sw:clamp((t-(w("track","within")-0.1))/0.8,0,1),late:fin(t,w("track","working days")+0.2,0.5),rows:[0,1,2].map(i=>fin(t,w("track","each bill")-0.2+i*0.2,0.5)),glow:pulseAt(t,w("track","working days")+0.4,1.2)}),{dy:-12});
  ctx.restore();vign(ctx,S);});

/* ---------- 10. Day one, again ---------- */
scene("again",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  const tSp=c("spring"),tD=c("day"),tM=c("map"),tA=c("asks"),tG=c("gets"),tF=c("first");
  ctx.save();focus(ctx,t,[[0,1540,640,1.35],[w("day","badge")-1.4,960,540,1.0]],1.8);
  // her desk, as Tomás's was: a badge, a page of acronyms, a list of systems; and this time, the map
  const desk=fin(t,0.2,1.0),dk=1-fin(t,tA-0.7,0.6);
  const ex=t>tG+0.6?"relieved":t>w("day","list")&&t<tM+0.4?"concerned":"calm",pose="stand";
  withA(ctx,desk,()=>{arrive(ctx,1560,700,t,tSp-0.2,()=>d11_personR(ctx,"zofia",1560,1010,0.95,{t,expr:ex,pose}),{dy:20});
    const g=ctx.createLinearGradient(0,790,0,H);g.addColorStop(0,"rgba(30,38,58,0.99)");g.addColorStop(1,"rgba(10,14,24,1)");ctx.fillStyle=g;ctx.fillRect(-400,790,W+800,320);ctx.fillStyle="rgba(150,180,230,0.25)";ctx.fillRect(-400,790,W+800,2);});
  if(dk>0.01)withA(ctx,dk,()=>{
    arrive(ctx,260,560,t,w("day","badge")-0.2,()=>d11_badge(ctx,260,560,0.9),{dy:-40});
    arrive(ctx,630,500,t,w("day","acronyms")-0.2,()=>d11_acr(ctx,420,380,420,250,t),{dy:-40});
    arrive(ctx,1070,560,t,w("day","list")-0.2,()=>d11_sys(ctx,880,370,380,400,{scroll:Math.max(0,t-w("day","list"))*1.6,count:Math.round(clamp((t-w("day","list"))/1.6,0,1)*138)}),{dy:-40});
    // this time, there's also a map
    arrive(ctx,630,560,t,tM-0.2,()=>d11_mapCard(ctx,420,646,420,138,{title:"the map · v3.4",glow:pulseAt(t,w("map","map"),1.8)*1.4}),{dy:-30,from:0.9});});
  // she asks the agent, and back come an owner and two rules, each with its reason and a link
  const cA=fin(t,tA-0.4,0.5)*(1-fin(t,tF-0.7,0.5));if(cA>0.01){const ans=w("gets","owner");
    arrive(ctx,820,410,t,tA-0.4,()=>d11_chat(ctx,360,150,920,520,t,{a:cA,q:clamp((t-(tA+0.1))/2.6,0,1),dots:clamp((t-(tA+2.8))/(ans-tA-2.8),0,1),busy:t>tA+2.8&&t<ans?1:0,rows:[fin(t,ans-0.2,0.4),fin(t,w("gets","two rules")-0.1,0.4),fin(t,w("gets","two rules")+0.4,0.4)],ul:fin(t,w("gets","links")-0.1,0.5)}),{dy:-16});}
  // by the afternoon, her first change, for Grace to confirm
  const pA=fin(t,tF-0.3,0.5);if(pA>0.01){withA(ctx,pA,()=>tag(ctx,360,214,"3:40 pm · day one",EAC,{size:28}));
    arrive(ctx,820,400,t,tF-0.3,()=>d11_pr(ctx,360,260,920,"OBJ-003 reading: a 30-minute interval","information/OBJ-003.yml",{a:pA,kicker:"drafted by Zofia Nowak",diff:[["+","interval: 30 minutes"],["+","evidence: DEC-018 · time-of-use · Mar 2028"]],rows:[fin(t,w("first","drafted")-0.1,0.6),fin(t,w("first","drafted")+0.4,0.6)],state:"waiting for Grace Achieng",stateCol:AMBER,glow:pulseAt(t,w("first","Grace")+0.3,1.4)}),{dy:-14});}
  ctx.restore();eaYear(ctx,80,80,"spring 2028",EAC,fin(t,tSp,0.6)*(1-fin(t,tA-0.6,0.6)));vign(ctx,S);});

/* ---------- 11. Back to the watch ---------- */
// Babylon: watcher after watcher on the same roof, each reading the last tablet and carrying on, the tablets piling up on the
// parapet; the six hundred years again, every king along them. Then the utility: Grace confirms Zofia's change, and the map passes
// the watcher's test; by the summer, thirty people keep their parts of it; and if Tomás left tomorrow, it would carry on.
const D11_RELAY=[[820,1,0.92],[1010,1,1.0],[900,-1,0.95],[1060,1,0.97]];
scene("back",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tK=c("kings"),tC=c("confirm"),tSu=c("summer"),tL=c("left");
  const A1=1-fin(t,tK-0.6,1.0),A2=fin(t,tK-0.6,1.0)*(1-fin(t,tC-0.6,1.0)),A3=fin(t,tC-0.6,1.0);
  const roof=cx=>{setScreen(cx,S);cx.save();focus(cx,t,[[0,980,600,1.12],[tK-1.6,980,560,1.04]],1.8);d11_babylon(cx,t,{});
    // the watchers, one after another, each faded in and out as one picture; each leaves a tablet on the pile
    const T0=i=>0.5+i*1.75;let done=0;
    D11_RELAY.forEach(([x,dir,s],i)=>{const t0=T0(i),last=i===D11_RELAY.length-1,a=fin(t,t0,0.6)*(last?1:1-fin(t,t0+1.9,0.6));if(t>t0+2.1)done=i+1;if(a<=0.01)return;
      d11_fade(cx,a,c2=>d11_scribe(c2,x,952,320*s,t,{dir,up:fin(t,t0+0.9,0.6),write:pulseAt(t,t0+0.2,0.9)}));});
    for(let i=0;i<done;i++)d11_tab(cx,1290+(i%2)*10,D11_WALL-12-i*16,48,{rot:(hash(i,761)-0.5)*0.12,glow:0.25,a:fin(t,T0(i)+2.1,0.5)});
    cx.restore();
    bab_tag(cx,760,214,"no one kept it alone",fin(t,w("each","no one")-0.2,0.7)*(1-fin(t,w("each","Each watcher")-0.4,0.5)));
    bab_tag(cx,760,214,"each read the last tablet, and carried on",fin(t,w("each","Each watcher")-0.1,0.7)*(1-fin(t,tK-0.8,0.5)));};
  const years=cx=>{setScreen(cx,S);bab_sky(cx,t,{dawn:0,day:0,moon:false,hz:1300});cx.fillStyle="rgba(10,8,14,0.62)";cx.fillRect(0,0,W,H);
    const tKi=w("kings","every king");d11_years(cx,t,{p:1,k:D11_KINGS.map((_,i)=>0.55+0.45*fin(t,tKi+i*0.25,0.5)),ends:1});
    bab_tag(cx,960,300,"written one way",fin(t,tK-0.2,0.7));
    bab_tag(cx,700,400,"it outlived every watcher who kept it",fin(t,w("kings","every watcher")-0.2,0.7));
    bab_tag(cx,1220,780,"and every king they served",fin(t,tKi-0.2,0.7));vign(cx,S);};
  const utility=cx=>{setScreen(cx,S);bg2(cx);motes(cx,t);cx.save();drift(cx,t-tC,{dur:sc.dur-tC},{z:0.02,y:440});
    const tOk=w("confirm","confirms"),tPs=w("confirm","passes"),ok=t>tOk+0.5,prA=1-fin(t,tSu-0.6,0.6),gone=fin(t,w("left","left")-0.1,1.2);
    // Grace confirms Zofia's change, and a new version of the map goes out; the watcher's test, passed
    if(prA>0.01){arrive(cx,600,385,t,tC-0.4,()=>d11_pr(cx,130,190,940,"OBJ-003 reading: a 30-minute interval","information/OBJ-003.yml",{a:prA,kicker:"drafted by Zofia Nowak",diff:[["+","interval: 30 minutes"],["+","evidence: DEC-018 · time-of-use · Mar 2028"]],rev:[["Grace Achieng","network",fin(t,tOk+0.1,0.5),fin(t,tOk-0.3,0.5)]],okWord:"confirmed",state:ok?"confirmed · v3.5":"waiting for Grace Achieng",stateCol:ok?TRUST:AMBER,glow:pulseAt(t,tOk+0.5,1.4)}),{dy:-14});
      d11_testCard(cx,600,640,fin(t,tPs-0.6,0.6)*prA,{mark:fin(t,tPs,0.5),pass:true,hi:pulseAt(t,tPs+0.2,1.6)});}
    // by the summer: thirty people keep their parts of the map, and each change is confirmed by its owner
    const mA=fin(t,tSu-0.4,0.8);if(mA>0.01){arrive(cx,610,390,t,tSu-0.4,()=>d11_mapCard(cx,300,170,620,440,{title:"the map · v4.2",glow:0.4+0.6*pulseAt(t,w("summer","thirty")+1.2,1.6),hi:[0,1,2,3,4,5].map(i=>0.6*pulseAt(t,w("summer","owners")+i*0.3,1.2))}),{dy:-14});
      for(let i=0;i<30;i++){const an=Math.PI*(0.95+1.1*i/29),x=610+Math.cos(an)*430,y=390+Math.sin(an)*300,q=fin(t,w("summer","thirty")-0.2+i*0.05,0.4)*mA;if(q<=0.01)continue;
        withA(cx,q,()=>{const col=i%3?BIZ:TECH;glow(cx,x,y,18,col,0.35);cx.fillStyle=rgba(mix(col,[255,255,255],0.2),1);cx.beginPath();cx.arc(x,y-8,7,0,TAU);cx.fill();rr(cx,x-9,y+2,18,12,6);cx.fill();});}
      [0,1,2].forEach(i=>{const t0=w("summer","confirm")+i*0.6;kt_gtick(cx,420+i*190,300+i*90,13,fin(t,t0,0.4)*mA);});
      withA(cx,fin(t,w("summer","thirty")-0.1,0.6)*mA,()=>tag(cx,610,770,"30 people keep their parts",BIZ,{align:"center",size:30}));
      // a change confirmed after Tomás has gone: the map carries on
      kt_gtick(cx,820,520,14,fin(t,tL+1.6,0.4));withA(cx,fin(t,tL+1.4,0.6),()=>tag(cx,1300,214,"the map carries on",TRUST,{align:"center",size:30}));}
    // the people who keep it true: Grace, Zofia and Tomás, who leaves
    arrive(cx,1270,700,t,tC-0.3,()=>d11_personR(cx,"grace",1270,1030,0.8,{t,pose:"stand"}),{dy:20});
    arrive(cx,1540,700,t,tC-0.1,()=>d11_personR(cx,"zofia",1540,1030,0.84,{t,expr:ok?"relieved":"calm"}),{dy:20});
    d11_fade(cx,fin(t,tC,0.8)*(1-gone),c2=>d11_personR(c2,"tomas",1800,1030,0.8,{t}));
    cx.restore();vign(cx,S);};
  let first=true;[[A1,roof],[A2,years],[A3,utility]].forEach(([a,fn])=>{if(a<=0.002)return;if(first){fn(ctx);first=false;}else d11_fade(ctx,a,fn);});
  if(A1>0.002)vign(ctx,S);});

/* ---------- 12. A map people and agents can read ---------- */
// the answer, in six cards: how the map is kept, and how it changes; then what's next, and the end card
const D11_ANS=[["answer","once","each element once, in one tool",EAC],["answer","ID","an ID, an owner and its evidence",TRUST],["answer","every view","every view made from it",[150,190,255]],
  ["keep","Review","every change reviewed",EAC],["keep","agents","agents read and draft",KT_AI],["keep","owners confirm","the owners confirm",BIZ]];
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.02,y:480});
  D11_ANS.forEach(([id,word,s,col],i)=>{const t0=w(id,word)-0.2,x=i<3?190:1010,y=230+(i%3)*150;if(t<t0)return;
    arrive(ctx,x+360,y+48,t,t0,()=>{glass(ctx,x,y,720,96,18,col,{glow:12+10*pulseAt(t,t0+0.2,1.4),ea:0.85,fill:"rgba(7,12,24,0.95)"});ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x+44,y+48,9,0,TAU);ctx.fill();T(ctx,s,x+76,y+60,{w:800,size:34});},{dy:-12});});
  withA(ctx,fin(t,w("answer","Keep")-0.2,0.6),()=>T(ctx,"how the map is kept",550,190,{f:"mono",w:500,size:28,align:"center",color:rgba(SOFT,1)}));
  withA(ctx,fin(t,c("keep")-0.2,0.6),()=>T(ctx,"how it changes",1370,190,{f:"mono",w:500,size:28,align:"center",color:rgba(SOFT,1)}));
  const nA=fin(t,c("next")-0.2,0.6);if(nA>0.01)arrive(ctx,960,760,t,c("next")-0.2,()=>tag(ctx,960,760,"next: a first draft, not a blank page",ACA,{align:"center",size:32}),{dy:10,a:nA});
  ctx.restore();vign(ctx,S);
  acaEnd(ctx,S,t,B+0.8,"A map people and agents can read","Kept one way, by everyone, a map outlives any one keeper.","Film 1 of 4 · Continuous architecture");});

// where the chapters meet (From words to data's joins.js): the tool's window shows the map's name where the slides showed it, a little
// way off, so the wall's slides and copies leave first, over the bare wall, and then the window comes in
const CHAPTER_JOINS={leave:["sources"],bare:(ctx,S,t)=>{wallBg(ctx,S,t);vign(ctx,S);}};
