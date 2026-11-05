/* ===== Why we govern them: the scenes, chapter by chapter =====
   Each chapter is a run of shots (ag_shots): a place painted once, a slow camera, and what's drawn live. Times come from the cues
   (c.<line>, when each line starts) and from the words of the lines (wAt), so the pictures stay with the voice. */

// the kicker, on the frame (not in the room, where the camera would move it): the same in every shot, so a glide between two shots of
// the room never shows it twice
const WG_KICK=(x,S,o)=>{x.save();setScreen(x,S);ag_kicker(x,"1.8","Why we govern them",o);x.restore();};
// where something that moves between two shots of the room is: where it was until the shot's dissolve is over, then on its way (1 s)
const wg_slide=(tt,t0,a,b,d)=>{const u=ag_sine((tt-t0)/(d||1.0));return{x:lerp(a.x,b.x,u),y:lerp(a.y,b.y,u)};};

/* ---------------------------------------------------------------- pieces the scenes share */
// the train at rest at the platform, or easing out: u 0 (at rest) to 1 (gone); dusk at evening
function wg_platformShot(x,tt,o){o=o||{};const u=clamp(o.u||0,0,1),nose=1660+1900*u*u;
  wg_train(x,nose,WG_PLAT.rail,{k:1,cars:2,people:1,driver:1,lamp:o.dusk?0.6:0.25});wg_platformFront(x,o.dusk);
  if(o.people!==false){ag_person(x,WG_P.manHat,250,712,0.95,{t:tt,gaze:[4,-1]});ag_person(x,WG_P.womanCoat,470,700,0.92,{t:tt+0.7,gaze:[4,-1]});}}
// the line seen from beside it, riding with the train: the masts whip past (off grows with time), the train stays in frame
function wg_lineShot(x,tt,o){o=o||{};const off=(o.off||0),k=o.k||0.8;
  wg_lineFront(x,off);
  if(o.signal){const P=1700,sx=((o.signal-off)%P+P)%P;wg_signal(x,sx-200,WG_LINE.rail+6,180,o.lamp||null,{s:0.8,glow:o.lamp?0.5:0});}
  wg_train(x,o.nose==null?1500:o.nose,WG_LINE.rail,{k,cars:4,today:!!o.today,lamp:0.2});}
// the cab: the side window streaming, the driver, the speedometer (o.v the speed, o.allow, o.state, o.boxA), o.hand his hand on the lever
function wg_cabShot(x,tt,o){o=o||{};wg_cabWindow(x,tt*1500,o.sig?(q=>o.sig(q)):null);
  ag_person(x,WG_P.driver,560,600,1.05,{t:tt,gaze:o.gaze||[4,0],pose:o.hand?{near:[64,96,"hold"]}:null,holdBack:o.hand?wg_lever:null});
  wg_speedo(x,o.v==null?205:o.v,{allow:o.allow,state:o.state,boxA:o.boxA});}
// cards that circle the agent too fast to read, then slow to a stop and close up in an arc at its left, where they can be read:
// t0 when they come, T0 when they start to slow, D how long that takes. The phase is the speed's integral, so they never run backwards.
const WG_FLICK=["loop","check","read","plan"];
function wg_flick(x,tt,t0,T0,D){const A=WR.agent,X=clamp((tt-T0)/D,0,1),s=ag_sine(X),K=TAU/2.2*2.6,
  rest=tt<T0?(T0-tt)+D/2:D*(0.5-0.5*X-Math.sin(Math.PI*X)/(2*Math.PI));
  WG_FLICK.forEach((w,i)=>{const ph=2.44+lerp(i*TAU/4,i*0.454,s)-K*rest,px=A.x+Math.cos(ph)*(A.R+230),py=A.y+Math.sin(ph)*(A.R+70),a=ag_in(tt,t0+i*0.15,0.3);
    if(a<=0)return;x.save();if(s<0.7)x.filter="blur("+lerp(5,0,clamp(s/0.7,0,1))+"px)";ag_pill(x,px,py,w,{a,size:30});x.restore();});}
// the blue line round the tray: the limits built into how it works
function wg_trayLine(x,p,a){if(p<=0||a<=0)return;const T_=WR.tray,x0=T_.x-T_.w/2-26,x1=T_.x+T_.w/2+26,y0=T_.y-70-20,y1=T_.y+16+18;
  const pts=[[x0+30,y0],[x1-30,y0],[x1,y1],[x0,y1],[x0+30,y0]];x.save();x.globalAlpha*=a;x.shadowColor=rgba(AG.blue,0.6);x.shadowBlur=12;
  wg_wire(x,pts,p,{});x.restore();x.save();x.globalAlpha*=a;x.strokeStyle=rgba(AG.blue,0.95);x.lineWidth=5;x.lineJoin="round";x.lineCap="round";
  let L=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);L+=d;}
  let r=L*p;x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length&&r>0;i++){const u=Math.min(1,r/seg[i-1]);x.lineTo(lerp(pts[i-1][0],pts[i][0],u),lerp(pts[i-1][1],pts[i][1],u));r-=seg[i-1];}x.stroke();x.restore();}

/* ---------------------------------------------------------------- 1 · Built into the line */
scene("line",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({tokyo:wAt(sc,"opening","Tokyo"),fast:wAt(sc,"first","two hundred and ten"),out:wAt(sc,"first","built for"),
    km:wAt(sc,"speed","a kilometre"),sig:wAt(sc,"signals","the signals"),slow:wAt(sc,"signals","and the train"),tok:wAt(sc,"missed","in Tokyo"),
    faster:wAt(sc,"cab","goes faster"),slows:wAt(sc,"cab","slows itself down"),answers:wAt(sc,"driver","answers"),
    six:wAt(sc,"trip","six and a half"),four:wAt(sc,"trip","to four"),since:wAt(sc,"safe","since that first day"),watch:wAt(sc,"uni","no one can watch"),
    round:wAt(sc,"limits","its limits")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Japan, 1964: the platform in morning light, the train waiting; the new line on a map, and the speed it was built for
    {at:0,place:"wgPlatform",keys:[[0,960,540,1.04],[P.tokyo,960,540,1]],push:0.02,draw:(x,tt)=>{wg_platformShot(x,tt,{u:clamp((tt-P.out-0.6)/(c.speed-P.out-0.6),0,1)});
      wg_corner(x,"Japan · 1964",ag_in(tt,0.8,0.8));wg_mapCard(x,640,150,{a:ag_in(tt,P.tokyo-0.2,0.4),k:ag_spr(tt,P.tokyo-0.2),p:ag_sine((tt-P.tokyo)/1.8)});
      ag_pill(x,920,416,"built for 210 km/h",{a:ag_in(tt,P.fast,0.5)});}},
    // at that speed: riding beside it, the masts whip past
    {at:c.speed,place:"wgCountry",keys:[[c.speed,960,540,1]],push:0.02,draw:(x,tt)=>{wg_lineShot(x,tt,{off:tt*2400});
      ag_pill(x,560,300,"1 km every 17 seconds",{a:ag_in(tt,P.km,0.5)});wg_corner(x,"Japan · 1964",1);}},
    // the driver can't read a signal beside the track in time: it smears past the window before his eyes reach it
    {at:c.signals,place:"wgCab",keys:[[c.signals,960,540,1]],push:0.02,draw:(x,tt)=>{const us=[(tt-P.sig+0.4)/0.8,(tt-P.sig-1.3)/0.8];
      wg_cabShot(x,tt,{v:208,gaze:[lerp(4,-5,ag_sine((tt-P.sig-0.1)/0.7)),0],sig:q=>{for(const u of us)if(u>-0.1&&u<1.1)wg_signal(q,lerp(1320,-80,u),560,240,"green",{s:0.8,blur:150,glow:0.7});}});}},
    // and it can't slow down at once: an arrow runs on ahead of it, past the next signal
    {at:P.slow,place:"wgCountry",keys:[[P.slow,960,540,1]],push:0.015,draw:(x,tt)=>{wg_lineShot(x,tt,{off:tt*2400,nose:1000});
      wg_signal(x,1640,WG_LINE.rail+6,180,null,{s:0.8});wg_ahead(x,1010,1850,WG_LINE.rail-44,(tt-P.slow-0.3)/2.4,1);}},
    // Tokyo, 1962: one red signal over plain track, at night, and what a missed one cost
    {at:c.missed,place:"wgNight",keys:[[c.missed,1000,540,1],[P.tok,1060,520,1.06]],push:0.03,draw:(x,tt)=>{wg_signal(x,1330,700,330,"red",{s:1.2,glow:0.7+0.3*ag_in(tt,c.missed+0.4,1.2)});
      wg_card(x,230,250,600,{kick:"Tokyo · 1962",title:"A red signal missed",sub:"160 people died"},{a:ag_in(tt,P.tok,0.8)});}},
    // passengers' lives rest on one person: the carriage, slowly, row by row
    {at:c.rest,place:"wgCarriage",keys:[[c.rest,760,560,1.14],[c.rest+0.2,1160,560,1.14]],d:5.6,push:0,draw:(x,tt)=>{wg_passengers(x,tt);}},
    // something had to change: the driver alone at the front
    {at:c.change,place:"wgCab",keys:[[c.change,700,560,1.12]],push:0.03,draw:(x,tt)=>{wg_cabShot(x,tt,{v:208,gaze:[4,0]});}},
    // the limits built into the line itself: a thin blue line along the rails, ahead of the train, as far as we can see
    {at:c.build,place:"wgCountry",keys:[[c.build,960,540,1]],push:0.02,draw:(x,tt)=>{wg_lineShot(x,tt,{off:tt*2400,nose:900});
      wg_blueLine(x,900,1960,WG_LINE.rail-1,(tt-wAt(sc,"build","the limits"))/1.8,1);}},
    // the signal in the cab: the speed allowed; faster, and it turns amber, and the train slows itself; then lower for what's ahead
    {at:c.cab,place:"wgCab",keys:[[c.cab,1120,560,1.08],[c.cab+0.4,1360,600,1.3]],d:1.8,push:0.02,draw:(x,tt)=>{
      const f=P.faster,dn=c.room-2.2,v=ag_keys(tt,[[c.cab,200],[f,203],[f+0.9,221],[f+1.3,221],[f+2.6,204],[f+3.0,206.5],[f+3.4,205],[dn+0.3,205],[dn+1.5,157],[dn+1.8,158.5],[dn+2.1,158]]);
      const allow=tt<dn?210:160,state=v>allow?"over":tt>f+0.5?"under":"set";
      wg_cabShot(x,tt,{v,allow,state,boxA:ag_in(tt,wAt(sc,"cab","the speed allowed"),0.5),gaze:[5,-1]});}},
    // one control room watches every train on the line
    {at:c.room,place:"wgControl",keys:[[c.room,960,540,1]],push:0.025,draw:(x,tt)=>{wg_controlRoom(x,tt,{});}},
    // and the driver still drives, and answers for the train
    {at:c.driver,place:"wgCab",keys:[[c.driver,820,580,1.1]],push:0.03,draw:(x,tt)=>{wg_cabShot(x,tt,{v:206,allow:210,state:"under",hand:true,gaze:[5,-1]});
      ag_pill(x,880,860,"the driver drives, and answers for the train",{a:ag_in(tt,P.answers,0.5)});}},
    // it worked: the train in full daylight, the trip from six and a half hours to four, and no passenger lost since
    {at:c.worked,place:"wgCountry",keys:[[c.worked,960,540,1]],push:0.02,draw:(x,tt)=>{wg_lineShot(x,tt,{off:tt*2400,nose:1180});
      const ta=1-ag_in(tt,P.since-0.4,0.5);
      wg_card(x,150,170,300,{kick:"before",title:"6 h 30"},{a:ag_in(tt,P.six,0.5)*ta,k:ag_spr(tt,P.six)});
      wg_card(x,480,170,300,{kick:"1964",title:"4 h 00"},{a:ag_in(tt,P.four,0.5)*ta,k:ag_spr(tt,P.four),edge:AG.green,kickCol:AG.green});
      wg_card(x,150,170,780,{kick:"since 1964",title:"No passenger has died",sub:"in a derailment or a collision"},{a:ag_in(tt,P.since,0.7),k:ag_spr(tt,P.since)});}},
    // the limits weren't there because the trains were bad: evening at the platform, the train at rest
    {at:c.bad,place:"wgDusk",keys:[[c.bad,1100,540,1.06]],push:0.03,draw:(x,tt)=>{wg_platformShot(x,tt,{dusk:true,people:false});}},
    // at the university, Jun's agent is fast too: cards flick past it, too fast to follow; the limits built into how it works
    {at:c.uni,place:"wgLab",keys:[[c.uni,960,540,1]],push:0,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.8),()=>{const st=ag_sine((tt-P.round-0.4)/2.2);
      ag_sandbox(x,WR.tray.x,WR.tray.y,WR.tray.w);wg_trayLine(x,(tt-P.round)/2.0,1);
      wg_agent(x,tt,{think:1-st*0.7,pulse:{deg:(tt*lerp(520,90,st))%360,a:1}});
      if(tt>c.more+0.4)for(const i of [0,1]){const u=ag_sine((tt-c.more-0.4-i*0.5)/1.3);ag_reach(x,wg_armTo(WR.tools.x,WR.tools.y[i]+58),u,{data:clamp((tt-c.more-1.6-i*0.5)/1.2,0,1)});}
      wg_tools(x,{a:[0,1].map(i=>ag_in(tt,c.more+0.2+i*0.3,0.5)).concat([0]),touch:[0,1].map(i=>ag_in(tt,c.more+1.5+i*0.5,0.4)).concat([0])});
      wg_jun(x,tt,{p:{gaze:[lerp(6*Math.sin(tt*7),3,st),lerp(-2+2*Math.cos(tt*5),0,st)]}});
      ag_roomLight(x,1);WG_KICK(x,S);wg_flick(x,tt,P.watch-0.4,P.round+0.4,2.2);})}
  ],0.6);
  ag_title(ctx,S,t,c.breath,"Why we govern them","because they're capable, not because they're bad","FILM 8 OF 10 · WHAT AN AGENT IS");});

// the carriage's passengers, row by row, in front of their seats (each row's armrest in front of them)
function wg_passengers(x,tt){const R=WG_ROWS,y=WG_SEAT.seat-212,cut=WG_SEAT.seat-4;
  const seat=[[0,WG_P.oldWoman,0.4,70,-16,{}],[0,WG_P.oldMan,0.44,0,0,{}],[1,WG_P.clerk,0.44,0,0,{pose:{near:[34,120,"hold"]},hold:wg_paper}],
    [2,WG_P.child,0.32,80,26,{gaze:[-3,-1]}],[2,WG_P.mother,0.44,0,0,{}],[3,WG_P.youngMan,0.44,0,0,{}],[4,WG_P.womanCoat,0.43,0,0,{}],[4,WG_P.manHat,0.44,80,-6,{}]];
  for(const [i,who,s,dx,dy,o] of seat)ag_person(x,who,R[i]+110+dx,y+dy,s,Object.assign({t:tt+i*0.7,cut},o));
  for(const r of R)wg_armrest(x,r);}

/* ---------------------------------------------------------------- 2 · Capable, convincing, unaccountable */
scene("three",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({cnt:wAt(sc,"count","census-day count"),gov:wAt(sc,"count","sends the government"),
    cause:wAt(sc,"night","finds the cause"),test:wAt(sc,"night","in test"),appr:wAt(sc,"night","people approve"),dm:wAt(sc,"more","do more"),
    team:wAt(sc,"more","work for all of them"),pipe:wAt(sc,"more","change the pipeline"),pa:wAt(sc,"acts","a person answers"),asks:wAt(sc,"yusuf","asks what"),
    q:[c.who,c.name,c.touch,c.checks],f:[c.four,wAt(sc,"four","an identity"),wAt(sc,"four","limits"),wAt(sc,"four","review")]}));
  const tools=(x,tt,o)=>{wg_tools(x,{a:[0,1,2].map(i=>o.a),touch:[0,1,2].map(i=>o.touch?o.touch[i]:0)});};
  const reach=(x,tt)=>{for(let i=0;i<3;i++){const t0=P.cause+i*0.7,u=ag_sine((tt-t0)/0.6)*(1-ag_sine((tt-t0-1.2)/0.6));if(u>0.01)ag_reach(x,wg_armTo(WR.tools.x,WR.tools.y[i]+58),u,{data:clamp((tt-t0-0.5)/0.8,0,1)});}};
  const touch=tt=>[0,1,2].map(i=>ag_io(tt,P.cause+i*0.7+0.5,P.cause+i*0.7+1.4,0.25));
  const cards=(x,tt,fail,okA,night)=>{const out=1-ag_in(tt,P.dm,0.6);if(out<=0)return;withA(x,out,()=>{
    wg_count(x,WR.cards.x,WR.cards.y,{w:470,k:ag_spr(tt,P.cnt),a:ag_in(tt,P.cnt,0.4),fail,gov:night?0:ag_in(tt,P.gov,0.5)});
    wg_plain(x,WR.cards.x,WR.cards.y+290,{k:ag_spr(tt,c.plain),a:ag_in(tt,c.plain,0.4),tick:okA});});};
  ag_shots(ctx,S,t,sc.dur,[
    // the census-day count, the number the university sends the government, and the plain job that counts it
    {at:0,place:"wgLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{wg_agent(x,tt,{});wg_jun(x,tt,{});
      ag_sandbox(x,WR.tray.x,WR.tray.y,WR.tray.w);ag_roomLight(x,1);WG_KICK(x,S);cards(x,tt,0,ag_in(tt,c.plain+0.6,0.4));}},
    // at night it fails: the agent finds the cause with its read-only tools, and puts a fix, as a draft, in its tray
    {cut:true,at:c.night,place:"wgLabNight",keys:[[c.night,1060,520,1.04]],push:0.02,draw:(x,tt)=>{const A=WR.agent;
      ag_sandbox(x,WR.tray.x,WR.tray.y,WR.tray.w);wg_draft(x,WR.tray.x,WR.tray.y-36,"draft fix",{a:ag_in(tt,P.test,0.3),k:ag_spr(tt,P.test)});
      tools(x,tt,{a:ag_in(tt,c.night+0.3,0.6),touch:touch(tt)});wg_agent(x,tt,{think:ag_io(tt,P.cause-0.3,P.test+0.8,0.4)});reach(x,tt);
      ag_roomLight(x,1,{night:true,lamp:[860,780]});ag_model(x,A.x,A.y,A.r,{only:"light",t:tt,think:ag_io(tt,P.cause-0.3,P.test+0.8,0.4)});
      WG_KICK(x,S,{dark:true});cards(x,tt,ag_in(tt,c.night+0.5,0.5),0,true);}},
    // in the morning, people approve its fix: Jun reviews it, Noor approves it, and the count matches again; then, could it do more?
    {cut:true,at:P.appr,place:"wgLab",keys:[[P.appr,960,540,1]],push:0.02,draw:(x,tt)=>{const yi=ag_sine((tt-P.team)/2.0);
      ag_sandbox(x,WR.tray.x,WR.tray.y,WR.tray.w);wg_draft(x,WR.tray.x,WR.tray.y-36,"draft fix",{a:1-ag_in(tt,P.dm,0.5)});
      tools(x,tt,{a:1-ag_in(tt,P.dm-0.4,0.6)});wg_agent(x,tt,{});
      wg_jun(x,tt,{p:{gaze:[3,tt>P.team?-2:0]}});
      if(yi>0)ag_person(x,"yusuf",lerp(-260,640,yi),640,0.92,{t:tt,gaze:[3,-2]});
      ag_roomLight(x,1);WG_KICK(x,S);
      const mk=1-ag_in(tt,P.dm,0.5);wg_mark(x,WR.tray.x,612,"reviewed · Jun",{k:ag_spr(tt,P.appr+0.5,0.6),a:mk});wg_mark(x,WR.tray.x,680,"approved · Noor",{ok:1,k:ag_spr(tt,P.appr+1.2,0.6),a:mk});
      cards(x,tt,1-ag_in(tt,P.appr+1.6,0.5),ag_in(tt,P.appr+1.8,0.4));
      wg_ghost(x,1400,300,"Work for the whole team?",{a:ag_in(tt,P.team,0.6),k:ag_spr(tt,P.team)});wg_ghost(x,1400,420,"Change the pipeline itself?",{a:ag_in(tt,P.pipe,0.6),k:ag_spr(tt,P.pipe)});}},
    // what the series' earlier films showed, each card under a phrase from its film's title: capable, convincing, unaccountable
    {cut:true,at:c.capable,place:"wgLab",keys:[[c.capable,960,540,1]],push:0.02,draw:(x,tt)=>{wg_agent(x,tt,wg_slide(tt,c.capable+0.6,WR.agent,{x:1320,y:460}));ag_roomLight(x,1);WG_KICK(x,S);
      const W_=[["More than a junior","Capable","knows more · works faster",c.capable],["It feels like understanding","Convincing","sounds sure · feeling sure is not knowing",c.convincing],["Accountability it can't hold","Unaccountable","the agent acts · a person answers",c.unacc]];
      W_.forEach(([f,ti,su,t0],i)=>wg_word(x,150,170+i*196,800,f,ti,su,{a:ag_in(tt,t0+0.1,0.4),k:ag_spr(tt,t0+0.1),hl:i===2?ag_in(tt,P.pa,0.5):0}));}},
    // Yusuf asks what the university asks of any new colleague; the four questions, and their answers
    {cut:true,at:c.yusuf,place:"wgLab",keys:[[c.yusuf,960,540,1]],push:0,draw:(x,tt)=>{wg_agent(x,tt,wg_slide(tt,c.yusuf+0.6,{x:1320,y:460},WR.agent));
      wg_jun(x,tt,{p:{gaze:[4,-3]}});ag_person(x,"yusuf",640,640,0.92,{t:tt,gaze:[4,-3]});
      ag_roomLight(x,1);WG_KICK(x,S);
      wg_ghost(x,1400,300,"Work for the whole team?",{});wg_ghost(x,1400,420,"Change the pipeline itself?",{});
      wg_four(x,{q:P.q.map(q=>ag_spr(tt,q+0.1,0.6)),flip:P.f.map(f=>ag_sine((tt-f)/0.6))});}}
  ],0.6);});

/* ---------------------------------------------------------------- 3 · An owner */
scene("owner",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({drv:wAt(sc,"must","as the driver"),owns:wAt(sc,"jun","so he owns it"),
    for_:wAt(sc,"decides","what it's for"),reads:wAt(sc,"decides","reads what it did"),stop:wAt(sc,"decides","can stop it"),
    over:wAt(sc,"moves","hands it over"),stops:wAt(sc,"moves","or it stops"),wrong:wAt(sc,"hands","the wrong hands"),anyone:wAt(sc,"hands","not just anyone")}));
  const lit=tt=>[ag_in(tt,c.first,0.6),0,0,0];
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wgLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{wg_agent(x,tt,{});wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});}},
    // as the driver answered for the train
    {at:P.drv,place:"wgCab",keys:[[P.drv,820,580,1.1]],push:0.03,draw:(x,tt)=>{wg_cabShot(x,tt,{v:206,allow:210,state:"under",hand:true,gaze:[5,-1]});}},
    // Jun set it up, so he owns it: what it's for, what it did, and a switch to stop it; handed over, or stopped; not just anyone may own one
    {at:c.jun,place:"wgLab",keys:[[c.jun,960,540,1]],push:0,draw:(x,tt)=>{
      const go=ag_sine((tt-P.over)/1.0),back=ag_sine((tt-P.stops-1.4)/0.9),dim=ag_in(tt,P.stops,0.5)*(1-ag_in(tt,P.stops+1.6,0.6));
      const sw=0.32*Math.exp(-1.6*Math.max(0,tt-P.wrong))*Math.sin(Math.max(0,tt-P.wrong)*7)*(tt>P.wrong?1:0);
      wg_switchWire(x,1-dim,{a:ag_in(tt,P.stop,0.4),p:ag_sine((tt-P.stop-0.2)/0.9),lit:ag_in(tt,P.stop+1.0,0.4)});
      wg_agent(x,tt,{dim});
      // the tag: tied on, then out towards the next owner's hand, and back
      const ta=ag_in(tt,P.owns-0.3,0.4),dy=lerp(-70,0,ag_spr(tt,P.owns-0.3,0.7));
      if(go<0.02||back>0.98)wg_tagOn(x,{a:ta,dy:go<0.02?dy:0,sw:sw});
      else{const u=back>0?1-back:go,fade=tt>P.stops&&back<=0?1-ag_in(tt,P.stops,0.5):1;withA(x,fade,()=>wg_tag(x,lerp(WR.agent.x-30,700,u),lerp(WR.hook-2,470,u),"owner · Jun Park",{dx:lerp(-170,-20,u),dy:lerp(80,60,u)}));}
      wg_hand(x,690,560,{a:ag_io(tt,c.moves-0.2,P.stops+2.4,0.4)});
      wg_jun(x,tt,{p:{gaze:[4,0]}});
      ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});
      wg_card(x,WR.cards.x,WR.cards.y,470,{kick:"For",title:"the census-day count"},{a:ag_in(tt,P.for_,0.4),k:ag_spr(tt,P.for_)});
      wg_log(x,1400,300,470,[{text:"read the failed check"},{text:"found the cause"},{text:"drafted a fix, in test"}],{a:ag_in(tt,P.reads,0.4),k:ag_spr(tt,P.reads)});
      ag_pill(x,940,786,"who may own an agent · decided",{a:ag_in(tt,P.anyone,0.5)});}}
  ],0.6);});

/* ---------------------------------------------------------------- 4 · A name of its own */
scene("identity",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({name:wAt(sc,"today","under Jun's name"),looks:wAt(sc,"looks","looks like his"),
    stopJ:wAt(sc,"looks","to stop it"),jun:wAt(sc,"looks","stop Jun"),own:wAt(sc,"own","a name of its own"),ctrl:wAt(sc,"sees","as the control room"),
    team:wAt(sc,"sees","the team sees"),stop:wAt(sc,"sees","can stop it"),noone:wAt(sc,"sees","without stopping")}));
  const lit=tt=>[1,ag_in(tt,c.second,0.6),0,0];
  const log=(x,tt,re,hl)=>{const r=(s,i)=>({text:s,who:re>0.5?"census agent":"Jun Park",agent:re>0.5,a:ag_in(tt,P.name+0.3+i*0.35,0.3),hl});
    const rows=[r("read a table",0),r("ran a query",1),r("wrote a draft",2),{text:"changed a model",who:"Jun Park",a:ag_in(tt,P.looks+0.2,0.4)}];
    wg_log(x,WR.cards.x,WR.cards.y,470,rows,{a:ag_in(tt,P.name,0.4),k:ag_spr(tt,P.name),n:3+ag_sine((tt-P.looks)/0.4)});};
  ag_shots(ctx,S,t,sc.dur,[
    // it works under Jun's name: a badge with his name, and a log where every line says "Jun Park"
    {at:0,place:"wgLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{wg_switchWire(x,1,{});wg_agent(x,tt,{});wg_tagOn(x,{});
      wg_badgeOn(x,tt,{a:ag_in(tt,P.name,0.4),dy:lerp(-60,0,ag_spr(tt,P.name,0.7))});wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});log(x,tt,0,0);}},
    // while it's learning: read-only tools, its drafts in a sandbox, and production behind glass
    {cut:true,at:c.learning,place:"wgLab",keys:[[c.learning,960,540,1]],push:0.025,draw:(x,tt)=>{
      wg_production(x,1120,236,700,560);ag_glass(x,1120,236,700,560);
      ag_sandbox(x,700,800,380);wg_draft(x,700,764,"draft fix",{});
      wg_agent(x,tt,wg_slide(tt,c.learning+0.6,WR.agent,{x:700,y:400}));ag_roomLight(x,1);WG_KICK(x,S);
      for(let i=0;i<2;i++)ag_tool(x,170,300+i*150,300,116,["Query","Docs"][i],{a:ag_in(tt,c.learning+0.4+i*0.3,0.5)});}},
    // its work looks like his; to stop it, you'd have to stop Jun; then a name of its own
    {cut:true,at:c.looks,place:"wgLab",keys:[[c.looks,960,540,1]],push:0.02,draw:(x,tt)=>{const fl=ag_sine((tt-P.own)/0.7),wj=ag_sine((tt-P.jun+0.3)/1.0)*(1-ag_in(tt,P.own,0.5));
      wg_switchWire(x,1,{});wg_wire(x,[[WR.agent.x+50,WR.hook+70],[1000,800],[640,800],[400,700]],wj,{lit:1});
      const back=ag_in(tt,c.looks+1.5,0.4);wg_agent(x,tt,wg_slide(tt,c.looks+0.6,{x:700,y:400},WR.agent));wg_tagOn(x,{a:back});wg_badgeOn(x,tt,{flip:fl,a:back});
      wg_jun(x,tt,{p:{gaze:tt>P.jun&&tt<P.own+0.6?[6,3]:[3,0],smile:tt>P.jun&&tt<P.own+0.6?0:0.3}});
      ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});log(x,tt,fl,0);}},
    // as the control room saw each train
    {at:P.ctrl,place:"wgControl",keys:[[P.ctrl,960,400,1.12]],push:0.03,draw:(x,tt)=>{wg_controlRoom(x,tt,{});}},
    // the team sees everything it does, and can stop it without stopping anyone else
    {at:P.team,place:"wgLab",keys:[[P.team,960,540,1]],push:0.02,draw:(x,tt)=>{const off=ag_in(tt,P.noone,0.3)*(1-ag_in(tt,sc.dur-2.2,0.3));
      wg_switchWire(x,1-off,{});wg_agent(x,tt,{dim:off});wg_tagOn(x,{});wg_badgeOn(x,tt,{flip:1});
      wg_jun(x,tt,{});
      ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});log(x,tt,1,ag_in(tt,P.team+0.3,0.5));}}
  ],0.6);});

/* ---------------------------------------------------------------- 5 · Limits it can't raise */
scene("limits",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({only:wAt(sc,"role","only its role's"),reach:wAt(sc,"reach","wherever its tools reach"),
    ro:wAt(sc,"fewest","read-only"),dr:wAt(sc,"fewest","writing only drafts"),sens:wAt(sc,"fewest","no sensitive data"),ours:wAt(sc,"choice","our choice"),
    signs:wAt(sc,"mandate","its owner signs"),low:wAt(sc,"cab","lowered"),raise:wAt(sc,"cab","never raise it")}));
  const lit=tt=>[1,1,ag_in(tt,c.third,0.6),0];
  const base=(x,tt,o)=>{o=o||{};wg_switchWire(x,1,{});wg_agent(x,tt,{});wg_tagOn(x,{});wg_badgeOn(x,tt,{flip:1});};
  const role=(x,tt)=>wg_role(x,WR.cards.x,WR.cards.y,470,"census agent",[{text:"read: the tables it needs",lock:1,a:ag_in(tt,P.ro,0.4),hl:ag_io(tt,P.ro,P.dr,0.3)},
    {text:"write: drafts, in its sandbox",a:ag_in(tt,P.dr,0.4),hl:ag_io(tt,P.dr,P.sens,0.3)},{text:"sensitive data: none",a:ag_in(tt,P.sens,0.4),hl:ag_in(tt,P.sens,0.3)}],{a:ag_in(tt,P.only,0.4),k:ag_spr(tt,P.only)});
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"wgLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{base(x,tt);wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});role(x,tt);}},
    // a train can only go where its rails go
    {at:c.rails,place:"wgCountry",keys:[[c.rails,960,540,1]],push:0.02,draw:(x,tt)=>{wg_lineShot(x,tt,{off:tt*2400,nose:1100});wg_blueLine(x,0,1960,WG_LINE.rail-1,1,1);}},
    // an agent can go wherever its tools reach: rails to its tools, and no further; the fewest rights on each
    {at:c.reach,place:"wgLab",keys:[[c.reach,960,540,1]],push:0.02,draw:(x,tt)=>{
      ag_sandbox(x,WR.tray.x,WR.tray.y,WR.tray.w);
      for(let i=0;i<3;i++)wg_rail(x,wg_armTo(WR.tools.x,WR.tools.y[i]+58),ag_sine((tt-c.reach-0.2-i*0.3)/1.0),1);
      base(x,tt);
      for(let i=0;i<3;i++){const t0=P.reach+i*0.9,u=ag_sine((tt-t0)/0.7)*(1-ag_sine((tt-t0-0.9)/0.5)*(i<2?1:0));if(u>0.01)ag_reach(x,wg_armTo(WR.tools.x,WR.tools.y[i]+58),u,{});}
      wg_tools(x,{a:[0,1,2].map(i=>ag_in(tt,c.reach+0.3+i*0.3,0.4)),touch:[0,1,2].map(i=>Math.max(ag_io(tt,P.reach+i*0.9+0.5,P.reach+i*0.9+1.2,0.2),ag_io(tt,P.ro,P.dr,0.3)))});
      wg_trayLine(x,ag_io(tt,P.dr,P.sens+1.5,0.4),1);
      wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});role(x,tt);}},
    // how much it may do alone is our choice; its skill doesn't decide it
    {cut:true,at:c.choice,place:"wgLab",keys:[[c.choice,960,540,1]],push:0,draw:(x,tt)=>{base(x,tt);
      wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});
      wg_bars(x,476,320,460,{a:ag_in(tt,c.choice,0.4),can:ag_sine((tt-c.choice-0.3)/1.2),alone:ag_sine((tt-P.ours)/0.9)*0.3,knob:ag_in(tt,P.ours,0.4)});}},
    // written down as a mandate its owner signs
    {at:c.mandate,place:"wgLab",keys:[[c.mandate,960,540,1]],push:0,draw:(x,tt)=>{base(x,tt);wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});
      wg_mandate(x,476,148,470,{a:ag_in(tt,c.mandate,0.4),k:ag_spr(tt,c.mandate),sign:(tt-P.signs)/1.3});}},
    // like the speed in the cab: set from outside, lowered at any time, and the agent can never raise it
    {at:c.cab,place:"wgLab",keys:[[c.cab,960,540,1]],push:0,draw:(x,tt)=>{base(x,tt);
      const r=ag_sine((tt-P.raise)/0.8)*(1-ag_sine((tt-P.raise-1.6)/0.8));if(r>0.01){const A=WR.agent;ag_reach(x,[A.x-A.R*0.62,A.y+A.R*0.42,990,620,900,500,876,452],r*0.82,{});}
      wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});
      const low=tt>P.low+0.2;wg_allowBox(x,700,420,low?160:210,"set",{a:ag_in(tt,c.cab+0.2,0.4),k:low?ag_spr(tt,P.low+0.2,0.6):ag_spr(tt,c.cab+0.2)});
      if(tt>P.raise+0.5)ag_lock(x,830,404,30,rgba(AG.blue,ag_io(tt,P.raise+0.5,sc.dur,0.3)));}}
  ],0.6);});

/* ---------------------------------------------------------------- 6 · A person checks */
scene("review",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({ev:wAt(sc,"checks","checks its evidence"),own:wAt(sc,"never","its own work"),
    noag:wAt(sc,"never","no agent approves"),ref:wAt(sc,"never","only for reference"),alone:wAt(sc,"test","agreed tasks alone"),rep:wAt(sc,"test","report what it did"),
    ownr:wAt(sc,"prod","checked by its owner"),sec:wAt(sc,"prod","approved by a second person")}));
  const lit=tt=>[1,1,1,ag_in(tt,c.fourth,0.6)];
  const base=(x,tt)=>{wg_switchWire(x,1,{});wg_agent(x,tt,{});wg_tagOn(x,{});wg_badgeOn(x,tt,{flip:1});};
  const change=(x,tt,a,open)=>ag_evidence(x,476,182,470,{kick:"Change",title:"Fix a failing step"},[{kick:"before",title:"3 checks fail",col:AG.orange},{kick:"after",title:"3 checks pass",col:AG.orange}],
    {a,open,ew:240,kickCol:AG.violet});
  ag_shots(ctx,S,t,sc.dur,[
    // a person checks its evidence, not its tone; it never approves, and no agent approves anyone's
    {at:0,place:"wgLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{base(x,tt);
      wg_jun(x,tt,{p:{gaze:[4,-2]}});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});
      const r=change(x,tt,ag_in(tt,c.checks,0.4),ag_sine((tt-P.ev+0.2)/1.2));
      // Jun's eye runs down the evidence, not the title
      const hi=ag_io(tt,P.ev+0.9,P.ev+3.0,0.3);if(hi>0)r.items.forEach((it,i)=>{const on=ag_io(tt,P.ev+0.9+i*0.8,P.ev+1.9+i*0.8,0.25);if(on>0){x.save();x.globalAlpha*=on*hi;x.strokeStyle=rgba(AG.orange,0.95);x.lineWidth=4;rr(x,it.to.x-6,it.to.y-6,it.to.w+12,it.to.h+12,20);x.stroke();x.restore();}});
      wg_approve(x,1500,560,{a:ag_in(tt,P.own-0.2,0.4),grey:ag_sine((tt-P.noag)/0.8)});
      ag_pill(x,1560,650,"agent's review · for reference",{col:AG.violet,a:ag_in(tt,P.ref,0.4)});}},
    // no train turns its own signal green: it's set from the line
    {at:c.signal,place:"wgCab",keys:[[c.signal,1120,560,1.08]],push:0.03,draw:(x,tt)=>{const g=tt>c.signal+0.9;wg_cabShot(x,tt,{v:g?206:150,allow:g?210:120,state:g?"under":"over",hand:true,gaze:[5,-1]});}},
    // in test, away from the real work, it may do agreed tasks alone, and report what it did
    {at:c.test,place:"wgLab",keys:[[c.test,960,540,1]],push:0,draw:(x,tt)=>{
      wg_testFrame(x,1140,800,460,96,{label:"in test",a:ag_in(tt,c.test+0.2,0.5)});
      for(let i=0;i<2;i++)ag_verdict(x,1060+i*170,774,"check","pass",ag_in(tt,P.alone+i*0.6,0.3));
      base(x,tt);wg_jun(x,tt,{p:{gaze:[3,-1]}});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:lit(tt)});
      const rk=ag_sine((tt-P.rep)/0.8);wg_card(x,476,lerp(276,260,rk),470,{kick:"Report",title:"2 checks rerun · 1 draft",sub:"nothing changed in production"},{a:ag_in(tt,P.rep,0.3),kickCol:AG.violet});}},
    // every change to production: checked by its owner, approved by a second person, the same as people's changes
    {at:c.prod,place:"wgLab",keys:[[c.prod,960,540,1]],push:0.02,draw:(x,tt)=>{const pass=ag_sine((tt-P.sec-1.2)/1.2),jp=ag_sine((tt-c.same)/1.0);
      wg_production(x,880,180,560,620);ag_glass(x,880,180,560,620,{label:null});
      ag_person(x,"noor",1690,640,0.94,{t:tt,flip:true,gaze:[4,0]});
      ag_roomLight(x,1);WG_KICK(x,S);
      const cx=lerp(240,980,pass),ca=1-0.55*pass;
      withA(x,ca,()=>{wg_card(x,cx,300,460,{kick:"by census agent",title:"Fix a failing step"},{kickCol:AG.violet});
        wg_mark(x,cx+230,530,"reviewed · Jun",{k:ag_spr(tt,P.ownr,0.6)});wg_mark(x,cx+230,600,"approved · Noor",{ok:1,k:ag_spr(tt,P.sec,0.6)});});
      withA(x,ag_in(tt,c.same,0.4),()=>{const jx=lerp(-300,240,jp);wg_card(x,jx,300,460,{kick:"by Jun Park",title:"Rename a column"},{});
        wg_mark(x,jx+230,530,"reviewed · Mei",{k:ag_spr(tt,c.same+0.9,0.6)});wg_mark(x,jx+230,600,"approved · Noor",{ok:1,k:ag_spr(tt,c.same+1.5,0.6)});});}}
  ],0.6);});

/* ---------------------------------------------------------------- 7 · Like any colleague */
scene("rules",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({role:wAt(sc,"most","a role"),rules:wAt(sc,"most","the same rules"),sec:wAt(sc,"most","the same security"),
    iso:c.iso,nist:wAt(sc,"iso","NIST's")}));
  ag_shots(ctx,S,t,sc.dur,[
    // in most ways, a colleague like any other: a role, the same rules, the same security
    {at:0,place:"wgLab",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{wg_group(x,tt,960,470,1,{});
      wg_jun(x,tt,{});ag_person(x,"noor",1690,640,0.94,{t:tt,flip:true,gaze:[4,0]});ag_roomLight(x,1);WG_KICK(x,S);
      [[110,"analytics engineer"],[745,"census agent"],[1380,"data architect"]].forEach(([rx,rn],i)=>wg_role(x,rx,140,430,rn,[],{a:ag_in(tt,P.role+i*0.3,0.4),k:ag_spr(tt,P.role+i*0.3)}));
      ag_pill(x,810,806,"the same rules",{col:AG.blue,a:ag_in(tt,P.rules,0.4)});ag_pill(x,1110,806,"the same security",{col:AG.blue,a:ag_in(tt,P.sec,0.4)});}},
    // four rules of its own, beside the four needs
    {cut:true,at:c.four,place:"wgLab",keys:[[c.four,960,540,1]],push:0,draw:(x,tt)=>{const A=WR.agent,m=wg_slide(tt,c.four+0.6,{x:960,y:470},A);
      wg_switchWire(x,1,{a:ag_in(tt,c.four+1.5,0.4)});wg_group(x,tt,m.x,m.y,1,{});
      wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);
      // each rule swells the need (or needs) it belongs to
      const R4=[[c.rights,["No rights of its own,","only a role's"],[2]],[c.owner,["Always a human owner"],[0]],[c.approve,["Never an approver"],[3]],
        [c.mandate,["A written mandate","that can be taken back;","a person approves every","change to production"],[2,3]]],pop=[0,0,0,0];
      R4.forEach(([t0,ls,ns])=>{for(const n of ns)pop[n]=Math.max(pop[n],Math.sin(Math.PI*clamp((tt-t0)/0.8,0,1)));});
      const L=ag_in(tt,c.four,0.5);wg_four(x,{lit:[L,L,L,L],pop});
      let ry=244;R4.forEach(([t0,ls],i)=>{ry+=wg_rule(x,1392,ry,480,i+1,ls,{a:ag_in(tt,t0,0.4),k:ag_spr(tt,t0)})+12;});}},
    // these ideas have names in the field; series 3 and 4 put them to work
    {at:c.names,place:"wgLab",keys:[[c.names,960,540,1]],push:0.02,draw:(x,tt)=>{ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:[1,1,1,1]});
      wg_shelf(x,300,600,1320,["Levels of autonomy · Feng, McDonald and Zhang, 2025","ISO/IEC 42001","NIST AI Risk Management Framework"],{k:[c.feng,P.iso,P.nist].map(q=>ag_sine((tt-q)/0.9))});
      ag_T(x,"IN THE FIELD",330,372,{w:700,size:28,ls:4,col:AG.kick,a:ag_in(tt,c.names+0.2,0.5)});
      ag_pill(x,1340,568,"Series 3",{a:ag_in(tt,c.series,0.4)});ag_pill(x,1530,568,"Series 4",{a:ag_in(tt,c.series+0.3,0.4)});}}
  ],0.6);});

/* ---------------------------------------------------------------- 8 · Because they are capable */
scene("capable",(ctx,S,t,sc)=>{const c=sc.cues,P=wg_once(sc,"P",()=>({k285:wAt(sc,"sixty","two hundred and eighty-five"),dm:wAt(sc,"more","do more"),
    num:wAt(sc,"trust","the number"),named:[wAt(sc,"more","an owner"),wAt(sc,"more","a name"),wAt(sc,"more","limits"),wAt(sc,"more","review")]}));
  const base=(x,tt)=>{wg_switchWire(x,1,{});wg_agent(x,tt,{});wg_tagOn(x,{});wg_badgeOn(x,tt,{flip:1});};
  ag_shots(ctx,S,t,sc.dur,[
    // today: longer, sleeker, faster, and the limits still built in
    {at:0,place:"wgCountry",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{wg_lineShot(x,tt,{off:tt*2800,nose:1560,today:true,k:0.78});
      wg_corner(x,"Today",ag_in(tt,0.6,0.6));wg_allowBox(x,1440,380,285,"set",{a:ag_in(tt,P.k285,0.4),k:ag_spr(tt,P.k285)});}},
    // not because the trains are bad: the first one, at rest, in the morning
    {at:c.notbad,place:"wgPlatform",keys:[[c.notbad,1000,540,1.04]],push:0.03,draw:(x,tt)=>{wg_platformShot(x,tt,{people:false});x.save();setScreen(x,S);wg_corner(x,"Japan · 1964",1);x.restore();}},
    // we govern agents because they are capable, not because they are bad; then more, and a number still trusted
    {at:c.govern,place:"wgLab",keys:[[c.govern,960,540,1]],push:0.02,draw:(x,tt)=>withA(x,1-ag_in(tt,c.breath,0.9),()=>{base(x,tt);
      const fill=ag_sine((tt-P.dm)/0.9),gone=ag_sine((tt-P.num-0.2)/1.6);
      for(let i=0;i<2;i++){const u=ag_sine((tt-P.dm-0.3-i*0.4)/0.9);if(u>0.01)ag_reach(x,wg_armTo(1400,340+i*120),u,{});}
      wg_jun(x,tt,{});ag_roomLight(x,1);WG_KICK(x,S);wg_four(x,{lit:[1,1,1,1],pop:P.named.map(q=>Math.sin(Math.PI*clamp((tt-q)/0.8,0,1)))});
      const la=ag_in(tt,c.govern+0.3,0.6)*(1-ag_in(tt,c.next-0.2,0.5));
      ["We govern agents","because they are capable,","not because they are bad."].forEach((s,i)=>ag_T(x,s,476,292+i*50,{w:700,size:36,a:la}));
      wg_ghost(x,1400,300,"Work for the whole team",{a:ag_in(tt,c.more,0.4),fill});wg_ghost(x,1400,420,"Change the pipeline itself",{a:ag_in(tt,c.more+0.2,0.4),fill});
      if(gone<1)withA(x,ag_in(tt,c.trust,0.4)*(1-gone*0.2),()=>{x.save();x.translate(lerp(0,700,gone*gone),lerp(0,-260,gone*gone));x.rotate(gone*0.06);
        wg_count(x,1400,556,{w:470,gov:1});x.restore();});
      wg_card(x,476,200,470,{kick:"Next",title:"What they tell us about\u00a0ourselves"},{a:ag_in(tt,c.next,0.4),k:ag_spr(tt,c.next)});
      wg_card(x,476,398,470,{kick:"Series 2",title:"Agents at work on data"},{a:ag_in(tt,c.series2,0.4),k:ag_spr(tt,c.series2)});})}
  ],0.6);
  ag_end(ctx,S,t,c.breath,"Why we govern them","We govern agents because they're capable, not bad.","Film 8 of 10");});

// chapters that open on a cut: each shows people, a place or words the chapter before ends on, which a crossfade would show twice
ag_cutInto(["limits", "rules"]);
