/* ===== Measure the work, not the people: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const MW_LAST="Measure the work together. Fix the system, not the people.";
// the film's number and title at the top left, from the second chapter on
function mw_kick(ctx,S,a,o){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"2","Measure the work, not the people",Object.assign({a},o||{}));}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function mw_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const mw_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays); o.strike draws a line through it, from o.strike's time
function mw_tag(ctx,t,t0,t1,x,y,text,o){o=o||{};const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a<=0.004)return;lp_tag(ctx,x,y,text,Object.assign({},o,{a}));
  if(o.strike!=null){const s=ag_sine(ag_in(t,o.strike,0.5));if(s>0.004){const tw0=lp_tw(ctx,text,{w:700,size:28}),tw=tw0+12,x0=(o.align==="center"?x-tw0/2:o.align==="right"?x-tw0-26:x+26)-6;
    ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(o.col||LP.ink,1);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y+3);ctx.lineTo(x0+tw*s,y+3);ctx.stroke();ctx.restore();}}}
// a pill that springs in at t0 (and goes at t1)
function mw_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// the road's traffic clock: from t0 every car eases to a halt over sec seconds, and stays (null: never)
function mw_clock(tt,ph,t0,sec){const f=tt+ph;if(t0==null||tt<t0)return f;const d=Math.min(tt-t0,sec);return t0+ph+d-d*d/(2*sec);}

/* ---------------------------------------------------------------- 1. Roads, not drivers: Sweden, 1997 to 2024 */
scene("vision",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const dT=w("drift","drifts",-0.4),catchT=w("care","mistake",-0.9),buildT=w("barrier","barrier",-0.3);
  // 1997: the car that drifts is the second one heading right; it meets the one heading left a little to the right of the middle
  const ph1=2.917-dT,drift=tt=>{const f=mw_clock(tt,ph1,dT,1.4),u=ag_sine(clamp((tt-dT)/1.4,0,1));return{x:mw_flowX(1,f),y:lerp(MW_ROAD.dn,532,u),rot:-0.28*u*(1-0.35*u),x4:mw_flowX(4,f)};};
  // with the barrier: the second car heading left drifts towards it, leans on its cables, and is held
  const ph2=3.57-catchT,lean=tt=>{const d=tt-catchT,u=d<0?0:d<0.7?ag_sine(d/0.7):d<1.9?1-ag_sine((d-0.7)/1.2):0;return u;};
  ag_shots(ctx,S,t,sc.dur,[
    // 1997: the road through the fields, its traffic, and a mistake
    {at:0,place:"mwRoad",keys:[[0,980,520,1.06],[c.when+0.4,960,540,1.0]],d:3,draw:(x,tt)=>{mw_roadPaint(x,{old:1});
      const ca=1-ag_in(tt,c.change-1.2,0.9),f=mw_clock(tt,ph1,dT,1.4),dr=drift(tt);
      if(ca>0.004){x.save();x.globalAlpha*=ca;mw_traffic(x,f,{lanes:"old",skip:[1]});mw_car(x,dr.x,dr.y,{dir:1,paint:MW_FLOW[1].paint,rot:dr.rot});
        // the two cars about to meet: an amber ring round them
        const ra=ag_in(tt,w("drift","line",-0.1),0.5);if(ra>0.004){x.save();x.globalAlpha*=ra;x.setLineDash([14,10]);x.strokeStyle=rgba(LP.amber,1);x.lineWidth=5;
          x.beginPath();x.ellipse((dr.x+dr.x4)/2,514,150,74,0,0,TAU);x.stroke();x.restore();}x.restore();}
      mw_sheet(x,tt,w("when","nineteen",-0.2),150,110,700,{kick:"Sweden · 1997",title:"541 people killed on the roads"},{col:LP.amber,light:null,pin:false,out:c.drift-0.5});
      mw_sheet(x,tt,w("counted","crashes",-0.1),1200,110,580,{kick:"Most crashes",title:"Put down to a driver's mistake"},{light:null,pin:false,out:c.drift-0.5});
      mw_tag(x,tt,w("answer","teach",-0.1),c.drift-0.5,1210,730,"Teach them",{col:LP.ink});
      mw_tag(x,tt,w("answer","fine",-0.1),c.drift-0.5,1430,730,"Fine them",{col:LP.ink});
      mw_tag(x,tt,w("answer","blame",-0.1),c.drift-0.5,1636,730,"Blame them",{col:LP.ink});
      mw_tag(x,tt,w("harm","kill",-0.2),c.change-1.0,(dr.x+dr.x4)/2,700,"On a fast road, a mistake can kill",{align:"center",col:LP.amber});
      mw_sheet(x,tt,w("harm","families",-0.2),580,110,760,{kick:"For hundreds of families a year",title:"Someone who never came home"},{col:LP.amber,light:null,pin:false,out:c.change-1.0});}},
    // October 1997: Vision Zero, and who answers for it
    {at:c.adopt-0.3,place:"mwRoad",later:true,keys:[[c.adopt-0.3,960,540,1.0]],draw:(x,tt)=>{mw_roadPaint(x,{old:1});
      mw_sheet(x,tt,c.adopt+0.2,150,110,780,{kick:"October 1997 · Vision Zero",title:"No one killed or seriously injured on the roads"},{col:LP.blue,light:null,pin:false});
      mw_sheet(x,tt,w("who","design",-0.2),990,110,780,{kick:"Who answers for it",title:"Those who design and run the roads",lines:["Not only drivers"]},{col:LP.blue,light:null,pin:false,u:ag_in(tt,w("who","drivers",-0.2),0.5)});}},
    // every fatal crash studied: where people died
    {at:c.study-0.3,place:"mwStudy",keys:[[c.study-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const s0=w("study","studied",-0.3),f0=w("found","head",-0.3);
      mw_crashes(x,ag_in(tt,s0,2.6),{focus:ag_in(tt,f0,0.8)});
      mw_sheet(x,tt,w("study","Every",-0.1),130,110,700,{kick:"Every fatal crash",title:"Studied in depth",lines:["How could it have been prevented?"]},{col:LP.orange,light:null,pin:false,u:ag_in(tt,w("study","prevented",-0.4),0.5)});
      mw_tag(x,tt,f0+0.2,null,980,900-110,"Many: head-on, on fast roads with two lanes",{align:"center",col:LP.amber});}},
    // from 1998: a barrier of steel cables down the middle, two lanes one way and one the other, swapping sides
    {at:c.barrier-0.3,place:"mwRoad",keys:[[c.barrier-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const o=1-ag_in(tt,buildT,1.0),n=ag_in(tt,buildT+1.2,1.0);
      mw_roadPaint(x,{old:o,neu:n});mw_barrier(x,ag_sine(ag_in(tt,buildT+0.2,3.2)));
      mw_sheet(x,tt,c.barrier+0.2,150,110,760,{kick:"From 1998",title:"A barrier of steel cables down the middle"},{col:LP.blue,light:null,pin:false});
      mw_tag(x,tt,w("barrier","middle",0.2),null,1500,730,"Two lanes one way, one the other",{align:"center",col:LP.blue});}},
    // roundabouts for crossroads, and slower where people walk
    {at:c.more-0.3,place:"mwTown",keys:[[c.more-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      mw_junction(x,ag_in(tt,w("more","Roundabouts",-0.1),1.6),{walk:ag_in(tt,w("more","speeds",-0.1),0.8)});
      mw_tag(x,tt,w("more","Roundabouts",0.2),null,540,350,"Roundabouts for crossroads",{align:"center",col:LP.blue});
      mw_tag(x,tt,w("more","walk",-0.3),null,1500,350,"Slower where people walk",{align:"center",col:LP.blue});}},
    // what it gave: deaths down by three quarters on roads with the barrier, by more than half across the country; a mistake held
    {at:c.fell-0.3,place:"mwRoad",keys:[[c.fell-0.3,960,540,1.0],[catchT-1.4,980,500,1.25],[catchT+2.2,960,540,1.0]],dis:1.2,d:1.6,draw:(x,tt)=>{
      const f=tt+ph2,ln=lean(tt);mw_roadPaint(x,{old:0,neu:1});
      mw_traffic(x,f,{lanes:"new",skip:[4]});const cx=mw_flowX(4,f);mw_car(x,cx,MW_NEW.up+12*ln,{dir:-1,paint:MW_FLOW[4].paint,rot:-0.12*ln*(tt<catchT+0.7?1:-0.6)});
      mw_barrier(x,1,{bow:ln*0.8,at:cx});
      mw_sheet(x,tt,c.fell+0.2,150,110,760,{kick:"Roads with a middle barrier",title:"Deaths down about three quarters"},{col:LP.green,light:null,pin:false,out:catchT-2.0});
      const da=ag_in(tt,w("half","country",-0.2),0.4)*(1-ag_in(tt,catchT-2.0,0.4));
      if(da>0.004)mw_deaths(x,1180,110,{a:da,k:tt-w("half","country",-0.2),u:ag_in(tt,w("half","country",0.1),0.8),u2:ag_in(tt,w("half","half",-0.6),0.9)});
      mw_tag(x,tt,w("half","traffic",-0.1),catchT-2.0,1480,700,"Traffic grew",{align:"center",col:LP.ink});
      mw_pill(x,tt,w("care","mistake",-0.1),c.measured-0.3,960,400,"A mistake shouldn't cost a life",{col:LP.green,size:30});
      mw_tag(x,tt,w("measured","blame",-0.1),null,700,780,"Not who to blame",{align:"center",col:LP.mut,strike:w("measured","measured",-0.1)});
      mw_tag(x,tt,w("measured","fix",-0.3),null,1220,780,"What in the road to fix",{align:"center",col:LP.blue});}},
    // and data work: how the work flows, not who did it
    {at:c.data-0.3,place:"lpRoom",keys:[[c.data-0.3,960,540,1.0]],dis:1.2,push:0,draw:(x,tt)=>{const ga=1-ag_in(tt,c.breath+0.2,0.8);if(ga<=0.004)return;x.save();x.globalAlpha*=ga;
      mw_flowStrip(x,tt,300,170,1320,{a:ag_in(tt,c.data+0.1,0.4),k:tt-c.data-0.1,wait:ag_in(tt,w("data","flows",-0.2),0.5)});
      mw_tag(x,tt,w("data","who",-0.1),null,960,520,"Not who did it",{align:"center",col:LP.mut,strike:w("data","who",0.3)});
      for(const [s,wd,px,col] of [["Measure the work","Measure",960-480,LP.orange],["Read it together","read",960,LP.blue],["Find what to fix","find",960+480,LP.green]])
        mw_pill(x,tt,w("fix",wd,-0.1),null,px,680,s,{col,size:32});x.restore();}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"Measure the work, not the people","Read it together; fix the system","Leading data people · Ownership and performance");
});
// how a request flows, station by station: asked, waiting, building, in use; o.wait (0 to 1): the waiting lit amber
function mw_flowStrip(ctx,t,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=250;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.orange,light:"day",pin:true});lp_T(ctx,"HOW A PIECE OF WORK FLOWS",x+44,y+80,{w:800,size:28,ls:3,col:LP.orange});
  const st=["Asked","Waiting","Building","In use"],bw=250,gp=(w-88-bw*4)/3,wa=clamp(o.wait||0,0,1);
  st.forEach((s,i)=>{const bx=x+44+i*(bw+gp),by=y+120,col=i===1?mix([150,140,132],LP.amber,wa):[150,140,132];ctx.fillStyle=rgba(col,1);ctx.fillRect(bx,by,bw,80);
    lp_T(ctx,s,bx+bw/2,by+52,{w:800,size:32,align:"center",color:"rgba(255,255,255,1)"});
    if(i<3){ctx.fillStyle=rgba(LP.mut,0.8);const ax=bx+bw+gp/2;ctx.beginPath();ctx.moveTo(ax-12,by+28);ctx.lineTo(ax+12,by+40);ctx.lineTo(ax-12,by+52);ctx.closePath();ctx.fill();}});
  ctx.restore();}

/* ---------------------------------------------------------------- 2. Management, for this work */
scene("manage",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"mwMorning",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      mw_sheet(x,tt,w("uni","Helena",-0.1),160,140,700,{kick:"The data manager",title:"Helena Novak"},{light:"morning",out:c.sides-0.4});
      mw_sheet(x,tt,c.sides+0.1,160,130,860,{kick:"One role",title:"Managing and leading: two sides",lines:["Calling one good, the other old-fashioned, did harm"]},{light:"morning",out:c.fit-0.4,u:ag_in(tt,w("sides","harm",-0.2),0.5)});
      mw_sheet(x,tt,c.see+0.1,160,470,860,{kick:"Management",title:"Measure, and keep dates and plans",lines:["What's hard to see is hard to improve"]},{col:LP.blue,light:"morning",out:c.fit-0.4,u:ag_in(tt,w("see","improve",-0.4),0.5)});
      mw_sheet(x,tt,c.fit+0.1,160,200,860,{kick:"Fitted to thinking work",title:"Hours or tickets per person say little"},{light:"morning",out:c.page-0.4});
      mw_page(x,160,110,1000,{a:ag_in(tt,c.page+0.1,0.4),k:tt-c.page-0.1,light:"morning",rows:mw_u(tt,[w("page","flows",-0.3),c.back,c.promise,c.load])*4,
        vals:{0:ag_in(tt,w("days","forty",-0.2),0.4)},pairs:ag_in(tt,w("pairs","speed",-0.2),0.6)+ag_in(tt,w("pairs","promises",-0.2),0.6)});
      lp_person(x,"helena",1480,640,1.0,{t:tt,flip:true,light:mo});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.8,c.see-0.4,0.5)});
  mw_kick(ctx,S,ag_in(t,0.6,0.6),{light:"morning"});
});

/* ---------------------------------------------------------------- 3. Read it together */
scene("read",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{const dOut=c.unclear-0.4;
      mw_sheet(x,tt,c.thurs+0.2,600,120,860,{kick:"Every second Thursday · 20 minutes",title:"The team reads the page together"},{light:"day",out:c.june-0.5});
      mw_tag(x,tt,w("what","what",-0.1),c.june-0.5,1030,440,"What slowed the work?",{align:"center",col:LP.ink});
      mw_tag(x,tt,w("what","Never",-0.1),c.june-0.5,1030,520,"Who was slow?",{align:"center",col:LP.mut,strike:w("what","Never",0.3)});
      mw_tag(x,tt,w("sweden","Sweden",-0.1),c.june-0.5,1030,620,"In Sweden: what in the road let a mistake kill?",{align:"center",col:LP.blue});
      // June's 24 days, taken apart; the wait for access lit, then shrinking once it's asked for early
      mw_days(x,600,110,860,{a:ag_in(tt,c.june+0.1,0.4)*(1-ag_in(tt,dOut,0.4)),k:tt-c.june-0.1,light:"day",u:ag_in(tt,c.june+0.5,1.6),
        hi:ag_in(tt,w("access","waiting",-0.2),0.6),fix:ag_in(tt,w("one","September",-0.1),1.2)});
      mw_tag(x,tt,w("why","started",-0.2),c.nobody-0.3,600,650,"Asked for when work started",{col:LP.amber});
      mw_tag(x,tt,w("why","dataset",-0.2),c.nobody-0.3,600,720,"One dataset at a time",{col:LP.amber});
      mw_tag(x,tt,w("why","five",-0.2),c.nobody-0.3,600,790,"Up to five days each",{col:LP.amber});
      mw_pill(x,tt,w("nobody","Nobody",-0.1),c.early-0.4,1030,660,"Nobody was slow",{col:LP.ink});
      mw_tag(x,tt,w("nobody","arranged",-0.4),c.early-0.4,1030,750,"The wait: in how the work was arranged",{align:"center",col:LP.ink});
      mw_sheet(x,tt,c.early+0.1,600,620,860,{kick:"From Monday 19 July",title:"Access asked for early",lines:["On the day a request is accepted"]},{col:LP.green,light:"day",out:c.one-0.3,u:ag_in(tt,w("early","accepted",-0.4),0.5)});
      mw_tag(x,tt,w("one","September",-0.1),dOut,1030,700,"By September: from 7 days to 1",{align:"center",col:LP.green});
      // the second cause: work sent back, and fifteen minutes first
      mw_sheet(x,tt,c.unclear+0.1,600,120,860,{kick:"A second cause",title:"1 in 8 pieces of work sent back",lines:["Read one way, meant another"]},{col:LP.amber,light:"day",out:c.dec-0.4,u:ag_in(tt,w("unclear","meant",-0.4),0.5)});
      mw_sheet(x,tt,c.talk+0.1,600,450,860,{kick:"Now, before work starts",title:"Fifteen minutes first",lines:["With the person who asked","To agree what done looks like"]},{col:LP.green,light:"day",out:c.dec-0.4,u:mw_u(tt,[w("talk","person",-0.3),w("talk","done",-0.4)])});
      mw_pill(x,tt,w("dec","December",-0.1),null,1030,300,"Days to first use: 24 to 14",{col:LP.orange,size:32});
      mw_pill(x,tt,w("dec","halved",-0.2),null,1030,410,"Sent back: 12 in 100 to 6",{col:LP.green,size:32});
      mw_tag(x,tt,w("most","waits",-0.2),null,1030,530,"Waits found and removed, one at a time",{align:"center",col:LP.green});
      // the team, at the wall: Ivy and Jun at the left, Helena at the right
      lp_person(x,"jun",420,716,0.76,{t:tt,light:dy});lp_person(x,"ivy",210,700,0.8,{t:tt,light:dy});
      lp_person(x,"helena",1700,700,0.8,{t:tt,flip:true,light:dy});}}
  ]);
  mw_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Each measure has a partner */
scene("pairs",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{const out=c.accel-0.4,f0=w("aug","eighty",-0.3);
      const fa=ag_in(tt,f0,0.4)*(1-ag_in(tt,out,0.4));
      if(fa>0.004)lp_figure(x,560,110,440,{kick:"Promises met · 12 Aug",num:"82%",label:"Up from 58% in March"},{col:LP.green,light:"day",a:fa,k:tt-f0});
      mw_tag(x,tt,w("alone","celebrate",-0.4),c.six-0.3,1040,250,"Alone: worth celebrating",{col:LP.green});
      mw_tag(x,tt,w("six","December",-0.4),out,1040,250,"December: 86%",{col:LP.green});
      // the load: nine pieces of work open at once, against the team's limit of six; the extra ones finished by mid-September
      const la=ag_in(tt,w("nine","nine",-0.2),0.4)*(1-ag_in(tt,out,0.4));
      if(la>0.004){x.save();x.globalAlpha*=la;ag_about(x,1010,570,lerp(0.6,1,ag_spr(tt-w("nine","nine",-0.2),0,0.5)));
        lp_sheet(x,560,420,900,300,{col:LP.amber,light:"day",pin:false});lp_T(x,"LOAD · PIECES OF WORK OPEN AT ONCE",604,500,{w:800,size:28,ls:3,col:LP.amber});
        mw_load(x,604,600,{n:9-3*ag_sine(ag_in(tt,w("six","back",-0.6),1.4)),limit:ag_in(tt,w("nine","limit",-0.2),0.6),light:"day"});x.restore();}
      mw_tag(x,tt,w("carry","carrying",-0.3),c.finish-0.3,600,780,"Promises kept by carrying too much",{col:LP.amber});
      mw_tag(x,tt,w("last","tired",-0.2),c.finish-0.3,600,850,"Tired people make mistakes",{col:LP.amber});
      mw_pill(x,tt,w("finish","finishes",-0.1),c.six-0.3,1010,780,"Finish before starting",{col:LP.blue});
      mw_tag(x,tt,w("notnow","Two",-0.1),c.six-0.3,1010,856,"Two requests: not now, with a reason and a date",{align:"center",col:LP.amber});
      mw_pill(x,tt,w("six","back",-0.1),out,1010,790,"Mid-September: back to 6",{col:LP.green});
      // Accelerate, and the two pairs
      mw_sheet(x,tt,c.accel+0.1,560,110,900,{kick:"Accelerate, 2018",title:"The best teams: fast and stable at once",lines:["Measured side by side"]},{light:"day",u:ag_in(tt,w("accel","side",-0.4),0.5)});
      mw_sheet(x,tt,w("honest","Speed",-0.2),560,450,440,{kick:"A pair",title:"Speed, beside sent back",lines:["Alone, speed can hide rushed work"]},{col:LP.orange,light:"day",u:ag_in(tt,w("honest","Speed",0.6),0.5)});
      mw_sheet(x,tt,w("honest","Promises",-0.2),1020,450,440,{kick:"A pair",title:"Promises, beside load",lines:["Alone, promises can hide tired people"]},{col:LP.orange,light:"day",u:ag_in(tt,w("honest","Promises",0.6),0.5)});
      lp_person(x,"sam",250,700,0.8,{t:tt,light:dy});lp_person(x,"helena",1700,700,0.8,{t:tt,flip:true,light:dy});}}
  ]);
  mw_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Not a target */
scene("target",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"mwLate",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      // the director's message on the screen; two fair questions behind it
      const ma=ag_in(tt,c.mon+0.1,0.5)*(1-ag_in(tt,c.goodhart-0.4,0.4));
      if(ma>0.004)mw_mail(x,150,140,980,400,{a:ma,u:mw_u(tt,[w("mon","Monday",-0.2),c.count,w("count","month",-0.3)])});
      mw_tag(x,tt,w("fair","faster",-0.3),c.goodhart-0.4,160,640,"Is the team getting faster?",{col:LP.ink});
      mw_tag(x,tt,w("fair","help",-0.3),c.goodhart-0.4,160,720,"Does anyone need help?",{col:LP.ink});
      mw_pill(x,tt,w("fair","fair",-0.1),c.goodhart-0.4,820,700,"Fair questions",{col:LP.ink});
      // Goodhart and Strathern; what counting tickets per person does
      mw_sheet(x,tt,c.goodhart+0.1,150,120,960,{kick:"Charles Goodhart, 1975",title:"A number pushed to move stops meaning what it did"},{light:"late",out:c.split-0.4});
      mw_sheet(x,tt,w("strathern","Marilyn",-0.2),150,420,960,{kick:"Marilyn Strathern, 1997",title:"When a measure becomes a target, it ceases to be a good measure"},{light:"late",out:c.split-0.4});
      mw_sheet(x,tt,c.split+0.1,150,110,960,{kick:"Count tickets per person",lines:["Work split small","Easy tickets picked","Less help for each other","Mistakes hidden"]},
        {col:LP.amber,light:"late",out:c.deming-0.4,u:mw_u(tt,[w("split","split",-0.2),w("split","easy",-0.2),w("split","helping",-0.2),w("split","hidden",-0.3)])});
      mw_sheet(x,tt,c.space+0.1,150,500,960,{kick:"The SPACE framework, 2021",title:"A count of activity, alone, never shows how well people work"},{light:"late",out:c.deming-0.4});
      const da=ag_in(tt,w("deming","Deming",-0.3),0.4)*(1-ag_in(tt,c.no-0.4,0.4));
      if(da>0.004)lp_figure(x,150,150,760,{kick:"W. Edwards Deming, 1986",num:"94 in 100",label:"Problems that belong to the system, not to the people in it"},{col:LP.mut,light:"late",a:da,k:tt-w("deming","Deming",-0.3)});
      // Helena's reply
      mw_sheet(x,tt,w("no","no",-0.2),150,110,960,{kick:"Helena's reply",title:"No to the count",lines:["Instead: the team's page","And what its readings changed","How each person grows: their own goals"]},
        {col:LP.blue,light:"late",u:mw_u(tt,[w("no","instead",-0.2),w("no","changed",-0.4),w("own","goals",-0.4)])});
      mw_pill(x,tt,w("review","quarterly",-0.2),null,630,640,"The page goes to the quarterly review",{col:LP.green});
      mw_pill(x,tt,w("review","ranked",-0.3),null,630,740,"No one is ranked",{col:LP.ink});
      // Helena at her table, late in the day
      const cut=812;lp_person(x,"helena",1460,700,0.9,{t:tt,flip:true,cut,light:lt});lp_table(x,1160,820,620);lp_laptop(x,1440,790,230,{glow:0.3});}}
  ]);
  mw_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back in Sweden: the roads measured, and changed
    {at:0,place:"mwRoad",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{mw_roadPaint(x,{old:0,neu:1});mw_traffic(x,tt+6.0,{lanes:"new"});mw_barrier(x,1);
      mw_pill(x,tt,w("back","measured",-0.1),null,960,300,"Sweden measured its roads",{col:LP.orange});
      mw_pill(x,tt,w("back","fixed",-0.1),null,960,770,"And fixed what turned a mistake into a death",{col:LP.green});}},
    // Helena's team did the same
    {at:c.helena-0.3,place:"mwMorning",keys:[[c.helena-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      mw_pill(x,tt,w("helena","measured",-0.1),null,1250,300,"Measured how the work flowed",{col:LP.orange});
      mw_pill(x,tt,w("helena","read",-0.1),null,1250,400,"Read it together",{col:LP.blue});
      mw_pill(x,tt,w("helena","fixed",-0.1),null,1250,500,"Fixed what slowed it",{col:LP.green,icon:"tick"});
      lp_person(x,"helena",520,650,1.0,{t:tt,light:mo});}},
    // what to do on Monday
    {at:c.flow-0.3,place:"mwMorning",later:true,keys:[[c.flow-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.end-0.4,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        mw_sheet(x,tt,c.flow+0.3,120,120,820,{kick:"One",title:"Measure the flow of the work",lines:["Days, sent back, promises, load"]},{col:LP.orange,light:"morning",u:ag_in(tt,w("flow","days",-0.2),0.5)});
        mw_sheet(x,tt,w("pair","Pair",-0.1),980,120,820,{kick:"Two",title:"Pair each measure",lines:["With one that balances it"]},{light:"morning",u:ag_in(tt,w("pair","balances",-0.3),0.5)});
        mw_sheet(x,tt,w("read","Read",-0.1),120,470,820,{kick:"Three",title:"Read them together, often",lines:["Ask what slowed it, never who"]},{col:LP.blue,light:"morning",u:ag_in(tt,w("read","ask",-0.2),0.5)});
        mw_sheet(x,tt,w("rank","rank",-0.2),980,470,820,{kick:"Four",title:"Asked to rank people?",lines:["Say no, and show the team's flow"]},{col:LP.green,light:"morning",u:ag_in(tt,w("rank","say",-0.2),0.5)});
        x.restore();}
      mw_tag(x,tt,w("next","falls",-0.2),c.end-0.4,960,800,"Next: When someone falls behind",{align:"center",col:LP.ink});
      const ta=ag_in(tt,c.end,0.4)*(1-ag_in(tt,e0,0.8));
      if(ta>0.004){for(const [s,wd,px,col] of [["Measure the work together","Measure",960-330,LP.orange],["Fix the system, not the people","Fix",960+330,LP.green]])
        {const t0=w("end",wd,-0.1);lp_pill(x,px,470,s,{col,size:34,a:ta*ag_in(tt,t0,0.4),k:tt-t0});}}}}
  ]);
  lp_end(ctx,S,t,e0,"Measure the work, not the people",MW_LAST,"Film 2 of 4","Ownership and performance");
  mw_kick(ctx,S,ag_in(t,c.helena-0.3,1.2)*(1-ag_in(t,e0,0.8)),{light:"morning"});
});
ag_cutInto(["read","pairs","target"]);
