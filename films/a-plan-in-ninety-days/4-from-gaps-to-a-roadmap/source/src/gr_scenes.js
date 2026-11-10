/* ===== From gaps to a roadmap: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, or cuts where both show the same words. Sizes in
   the 1920 x 1080 frame. */

const GR_TITLE="From gaps to a roadmap";
const GR_LAST="Turn the gaps into stages that each work on their own.";
const GR_DM={module:"Data management",mark:dm_mark};
function gr_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"4",GR_TITLE,{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function gr_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
const gr_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
function gr_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function gr_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// the railways' share of travel, on a sheet: 1960 and 1970, in orange (data)
function gr_share(ctx,x,y,t,t0,t1){const a=ag_in(t,t0,0.35)*(1-ag_in(t,t1,0.4));if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+300,y+260,lerp(0.6,1,ag_spr(t-t0,0,0.5)));
  lp_sheet(ctx,x,y,600,520,{col:LP.orange,light:null,pin:false});lp_T(ctx,"THE RAILWAYS' SHARE OF TRAVEL",x+36,y+80,{w:800,size:28,ls:3,col:LP.orange});
  lp_bars(ctx,x+90,y+140,420,340,[{v:27.8,label:"1960",show:"Over a quarter"},{v:16.0,label:"1970",show:"A sixth"}],{max:32,col:LP.orange,u:ag_in(t,t0+0.4,1.4)});
  ctx.restore();}

/* ---------------------------------------------------------------- 1. Every hour, at the same minutes: Switzerland, from the 1970s */
scene("clock",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),pl={light:"day",wall:0.1};
  const folk=(x,tt,a)=>{lp_person(x,GR_FOLK.student,640,700,0.86,{t:tt,a:a*ag_in(tt,w("whom","students",-0.4),0.6),light:pl});
    lp_person(x,GR_FOLK.worker,930,706,0.88,{t:tt,flip:true,a:a*ag_in(tt,w("whom","workers",-0.4),0.6),light:pl});
    lp_person(x,GR_FOLK.older,1250,704,0.84,{t:tt,flip:true,a:a*ag_in(tt,w("whom","older",-0.4),0.6),light:pl});};
  ag_shots(ctx,S,t,sc.dur,[
    // Switzerland in the 1970s: a valley, its small town and its railway; a train passes; then the motorway, and the railways' share falls
    {at:0,place:"grValley",keys:[[0,990,500,1.06],[c.cars,960,540,1.0]],draw:(x,tt)=>{
      gr_train(x,lerp(-260,2300,clamp((tt-0.6)/15,0,1)),4);
      gr_motorway(x,ag_in(tt,w("cars","motorways",-0.4),2.4),tt);
      gr_sheet(x,tt,w("swiss","Switzerland",-0.2),120,120,600,{kick:"The 1970s",title:"Switzerland",lines:["Valleys and small towns","Joined by its railways"]},
        {light:null,pin:false,out:w("cars","share",-0.7),u:gr_u(tt,[w("swiss","valleys",-0.1),w("swiss","railways",-0.1)])});
      gr_share(x,120,120,tt,w("cars","share",-0.3),c.odd-0.6);}},
    // the platform: trains at different minutes every hour, and a long wait
    {at:c.odd-0.3,place:"grPlatform",keys:[[c.odd-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const m=ag_keys(tt,[[c.odd,14],[c.whom,21],[c.engineers,47]]);
      gr_clock(x,1460,250,82,8,m);
      gr_sheet(x,tt,w("odd","different",-0.4),130,200,420,{kick:"Departures to Bern",lines:["7:04","8:21","9:47","11:12"]},{light:null,u:ag_in(tt,w("odd","different",-0.2),1.4)});
      folk(x,tt,1);
      gr_tag(x,tt,w("odd","wait",-0.2),c.whom+0.4,1460,420,"A long wait",{align:"center",col:LP.amber});
      gr_tag(x,tt,w("whom","looking",-0.2),null,960,180,"Looking up times, and waiting",{align:"center",col:LP.amber});
      gr_pill(x,tt,w("debt","loss",-0.3),null,1460,440,"At a loss",{col:LP.amber});}},
    // 1972: three young railway engineers write it down
    {at:c.engineers-0.3,place:"grPlatform",later:true,keys:[[c.engineers-0.3,960,540,1.0]],draw:(x,tt)=>{
      gr_clock(x,1460,250,82,9,10);
      gr_sheet(x,tt,c.engineers+0.3,150,200,1060,{kick:"1972 · Three young railway engineers",title:"The trains no longer fit what people want",lines:["The timetable is the heart of it"]},
        {col:LP.blue,light:null,u:ag_in(tt,w("engineers","timetable",-0.1),0.5)});}},
    // the railways' own plan: fast new lines across the country, costing billions; dropped
    {at:c.fast-0.3,place:"grMap",keys:[[c.fast-0.3,960,470,1.0]],dis:1.2,draw:(x,tt)=>{const d0=w("fast","dropped",-0.2),f=1-ag_in(tt,d0,1.4);
      gr_lines(x);GR_FAST.forEach((P,i)=>gr_mark(x,P,ag_in(tt,w("fast","fast",-0.3)+i*0.5,1.6),LP.amber,{dash:[18,14],lw:10,a:f}));gr_cities(x);
      gr_tag(x,tt,w("fast","billions",-0.2),null,1820,770,"Would cost billions",{align:"right",col:LP.amber});
      gr_tag(x,tt,d0,null,1820,840,"Dropped, early 1980s",{align:"right",col:LP.ink});}},
    // from 23 May 1982: every line, every hour, at the same minutes
    {at:c.clock-0.3,place:"grPlatform",keys:[[c.clock-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const s0=w("clock","every",-0.1),mins=4+60*clamp((tt-s0)/2.4,0,3);
      gr_clock(x,1460,250,82,7+Math.floor(mins/60),mins%60,{ring:ag_in(tt,w("clock","same",-0.1),0.6)});
      gr_sheet(x,tt,w("clock","From",-0.2),130,200,420,{kick:"From 23 May 1982",title:"To Bern",lines:["7:04","8:04","9:04","10:04"]},{col:LP.blue,light:null,u:ag_in(tt,w("clock","every",-0.1),2.2)});
      gr_tag(x,tt,w("clock","minutes",-0.2),null,1460,420,"The same minutes, every hour",{align:"center",col:LP.blue});}},
    // Rail 2000: start from the timetable people want; the hubs, where trains meet
    {at:c.around-0.3,place:"grMap",keys:[[c.around-0.3,960,470,1.0]],dis:1.2,draw:(x,tt)=>{const h0=w("hubs","hubs",-0.2),tr0=w("hubs","arrive",-1.2),tr1=c.slow-0.6;
      gr_lines(x);gr_trains(x,clamp((tt-tr0)/(tr1-tr0),0,1),{a:ag_io(tt,tr0,tr1,0.4)});
      gr_cities(x,{hub:tt>=h0?tt-h0:0});
      gr_sheet(x,tt,w("around","Rail",-0.2),1270,600,560,{kick:"Rail 2000",title:"Start from the timetable people want"},{col:LP.blue,light:null,pin:false,out:h0-0.2});
      gr_tag(x,tt,w("hubs","before",-0.3),w("hubs","after",-0.2),1820,780,"Arrive just before the hour",{align:"right",col:LP.blue});
      gr_tag(x,tt,w("hubs","after",-0.2),c.slow-0.3,1820,780,"Leave just after",{align:"right",col:LP.blue});}},
    // the slow stretch between two hubs: a gap; only the gaps are built; the slogan; the vote; built in stages
    {at:c.slow-0.3,place:"grMap",keys:[[c.slow-0.3,960,470,1.0]],draw:(x,tt)=>{const g0=w("slow","slow",-0.2),gp=w("slow","gap",-0.2),b0=w("only","built",-0.3),n0=w("costs","stages",-0.4),
        k0=w("costs","first",-0.2),op=w("opened","opened",-0.2),cn=w("hour","connected",-0.3),hr=w("hour","hour",-0.2);
      gr_lines(x);
      // too slow between two hubs: Bern to Zürich first, then the other stretches; each a gap, in amber, until the new lines are planned
      const ga=1-ag_in(tt,b0+0.6,0.6);
      gr_mark(x,gr_pts("bo"),ag_in(tt,g0,1.0),LP.amber,{lw:10,a:ga});gr_mark(x,gr_pts("oz"),ag_in(tt,g0+0.6,0.8),LP.amber,{lw:10,a:ga});
      [gr_pts("bao"),gr_pts("lb"),gr_pts("zs").slice(0,2)].forEach((P,i)=>gr_mark(x,P,ag_in(tt,gp+i*0.3,0.8),LP.amber,{lw:10,a:ga}));
      // only the gaps are built: four new lines, dashed blue beside the old; when the costs rose, three wait and one is kept; it opens, green
      ["bo","bao","lb","zw"].forEach((k,i)=>{const keep=k==="bo",f=keep?1-ag_in(tt,op,0.8):lerp(1,0.22,ag_in(tt,k0,1.0));
        gr_mark(x,GR_NEW[k],ag_in(tt,b0+i*0.3,1.0),LP.blue,{dash:[14,10],lw:9,off:13,a:f});});
      gr_mark(x,GR_NEW.bo,ag_in(tt,op,1.2),LP.green,{lw:10,off:13});
      gr_cities(x,{hub:1,hubCol:{bern:tt>=cn?LP.green:LP.blue,zurich:tt>=cn?LP.green:LP.blue}});
      gr_tag(x,tt,g0+0.3,b0-0.2,1820,700,"Bern to Zürich: 69 minutes",{align:"right",col:LP.amber});
      gr_tag(x,tt,gp,b0-0.2,1820,770,"Too slow: a gap",{align:"right",col:LP.amber});
      gr_tag(x,tt,b0,c.slogan-0.2,1820,770,"Build only the gaps",{align:"right",col:LP.blue});
      gr_sheet(x,tt,w("slogan","fast",-0.4),1170,560,660,{kick:"Its slogan",title:"As fast as necessary, not as fast as possible"},{col:LP.blue,light:null,pin:false,out:c.costs-0.3});
      gr_pill(x,tt,w("vote","approved",-0.2),c.costs-0.3,1500,810,"Voters said yes: 6 December 1987",{col:LP.green,icon:"tick"});
      gr_tag(x,tt,n0,op-0.3,1820,700,"Costs rose: built in stages",{align:"right",col:LP.amber});
      gr_tag(x,tt,k0,op-0.3,1820,770,"Stage one: one new line of four",{align:"right",col:LP.blue});
      gr_sheet(x,tt,op+0.2,1230,560,600,{kick:"12 December 2004",title:"The first stage opens",lines:["About 130 projects","A new line, Bern to Olten"]},
        {col:LP.green,light:null,pin:false,out:c.hour-0.2,u:gr_u(tt,[w("opened","projects",-0.1),w("opened","Bern",-0.1)])});
      gr_tag(x,tt,hr,c.bern-0.4,1820,700,"Bern to Zürich: under an hour",{align:"right",col:LP.green});
      gr_bern(x,1260,530,560,ag_in(tt,w("bern","trains",-0.4),2.6),ag_in(tt,w("bern","change",-0.4),2.4),{a:ag_io(tt,c.bern-0.1,c.far-0.3,0.4),k:tt-c.bern+0.1});
      if(tt>=c.far-0.2)lp_figure(x,1250,540,580,{kick:"2019",num:"2,500 km",label:"By train, each, in a year: the most in Europe"},{col:LP.green,light:null,pin:false,a:ag_in(tt,c.far-0.2,0.35),k:tt-c.far+0.2});}},
    // a data team, and the same idea
    {at:c.same-0.3,place:"grRoom",keys:[[c.same-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      gr_sheet(x,tt,w("same","Data",-0.2),560,180,800,{kick:"Data is the same",lines:["Start from what people need","Find the gaps","Build in stages that each work on their own"]},
        {col:LP.blue,light:"day",out:c.uni-0.5,u:gr_u(tt,[w("same","start",-0.1),w("same","find",-0.1),w("same","build",-0.1)])});}},
    // a year from now, at a university: today, the target, and nine gaps between them; all at once, or in stages
    {at:c.uni-0.3,place:"grRoom",later:true,keys:[[c.uni-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=w("risk","once",-0.4),s0=w("team","three",-0.4);
      const g=1-ag_in(tt,r0,0.5);gr_sheet(x,tt,w("uni","target",-0.4),160,250,420,{kick:"Today",title:"How it works now"},{light:"day",out:r0});
      gr_sheet(x,tt,w("uni","target",-0.2),1340,250,420,{kick:"The target",title:"How it should work"},{col:LP.blue,light:"day",out:r0});
      for(let i=0;i<9;i++){const a=ag_in(tt,w("uni","nine",-0.2)+i*0.12,0.4)*g;if(a<=0.004)continue;lp_tag(x,660+(i%3)*200,330+Math.floor(i/3)*80,"Gap",{col:LP.amber,a});}
      gr_risk(x,tt,r0+0.4,s0-0.4);
      gr_stagesSmall(x,tt,s0,c.breath+0.2);}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("uni","university",-0.3),c.risk,0.5)});
  lp_title(ctx,S,t,c.breath+0.2,GR_TITLE,"Stages that each work on their own","Data management · A plan in ninety days",GR_DM);
});
// all at once: a long bar of years, broken half way where the money stops, and nothing to use
function gr_risk(ctx,t,t0,t1){const a=ag_in(t,t0,0.35)*(1-ag_in(t,t1,0.4));if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const x=260,y=300,w=1400,u=ag_in(t,t0+0.3,2.4),br=ag_in(t,t0+2.8,0.8);
  lp_sheet(ctx,x-60,y-110,w+120,420,{col:LP.amber,light:"day",pin:false});lp_T(ctx,"BUILT ALL AT ONCE",x,y-30,{w:800,size:28,ls:3,col:LP.amber});
  ctx.fillStyle=rgba(LP.amber,0.85);const bw=w*u;rr(ctx,x,y+20,Math.min(bw,w/2-6),56,10);ctx.fill();
  if(bw>w/2){ctx.save();ctx.globalAlpha*=1-br*0.7;rr(ctx,x+w/2+br*40,y+20+br*30,bw-w/2-br*40,56,10);ctx.fill();ctx.restore();}lp_T(ctx,"Years",x+24,y+60,{w:800,size:32,color:rgba([255,255,255],clamp((bw-130)/60,0,1))});
  if(br>0.01){lp_T(ctx,"The money stops",x+w/2,y+140,{w:800,size:32,align:"center",a:br});lp_T(ctx,"Nothing to use",x+w/2,y+190,{w:600,size:28,align:"center",col:LP.amber,a:br});}
  ctx.restore();}
// three stages, each with a tick: useful on its own
function gr_stagesSmall(ctx,t,t0,t1){const a=ag_in(t,t0,0.35)*(t1==null?1:1-ag_in(t,t1,0.8));if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  ["Stage one","Stage two","Stage three"].forEach((s,i)=>{const x=260+i*480,f=ag_in(t,t0+i*0.4,0.4);if(f<=0.004)return;const bb=lp_textSheet(ctx,x,280,420,{kick:s,title:"Useful on its own"},{col:LP.blue,light:"day",a:f,k:t-t0-i*0.4});
    lp_pill(ctx,x+210,bb.y+bb.h+50,"Works",{col:LP.green,icon:"tick",a:ag_in(t,t0+1.6+i*0.4,0.4)});});
  ctx.restore();}
AG_PLACES.grRoom=c=>lp_paintRoom(c,{light:"day",seed:4});
AG_PLACES.grCouncil=c=>lp_paintRoom(c,{light:"late",seed:7});

/* ---------------------------------------------------------------- 2. Nine gaps: today beside the target, on Noor's map */
scene("gaps",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  // when each gap is named in the voice, in GR_GAPS's order, and when each layer is read
  const gm=[w("strat","slow",-0.1),w("biz","ask",-0.1),w("biz","order",-0.1),w("biz","alone",-0.1),w("info","three",-0.1),w("info","owner",-0.1),w("app","two",-0.1),w("app","mandate",-0.1),w("tech","servers",-0.1)];
  const rd=[c.strat,c.biz,c.info,c.app,c.tech,c.nine],R=[0,1,2,3,4].map(gr_rowCam);
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 5 April 2027: Helena, the target drawn, three weeks to plan; by Monday 26 April, a roadmap and a data strategy
    {at:0,place:"grRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      gr_sheet(x,tt,w("april","Monday",-0.2),130,180,640,{kick:"Monday 5 April 2027",title:"The target is drawn",lines:["Three weeks to plan"]},{light:"day",u:ag_in(tt,w("april","three",-0.1),0.5)});
      gr_sheet(x,tt,w("plan","roadmap",-0.5),130,470,640,{kick:"By Monday 26 April",title:"For the data council",lines:["A roadmap","A data strategy"]},
        {col:LP.blue,light:"day",u:gr_u(tt,[w("plan","roadmap",-0.1),w("plan","strategy",-0.1)])});
      lp_person(x,"helena",1400,650,1.0,{t:tt,flip:true,light:dy});
      lp_nameTag(x,1860,330,"helena",{align:"right",a:ag_io(tt,w("april","Helena",-0.1),c.beside-0.8,0.4)});}},
    // Noor's map: today beside the target, layer by layer; wherever they differ, a gap; the camera reads each layer as the voice does
    {at:c.beside-0.3,place:"grRoom",later:true,push:0,keys:[[c.beside-0.3,960,540,1.0],[c.strat-1.2,...R[0]],[c.biz-0.8,...R[1]],[c.info-0.8,...R[2]],[c.app-0.8,...R[3]],[c.tech-0.8,...R[4]],[c.nine-1.4,960,540,1.0]],
      draw:(x,tt)=>{const b0=w("beside","current",-0.2),g0=w("beside","target",-0.2);
      const rows=[0,1,2,3,4].map(l=>ag_in(tt,b0+l*0.3,0.5)),goal=[0,1,2,3,4].map(l=>ag_in(tt,g0+l*0.3,0.5)),mark=gm.map(t0=>ag_in(tt,t0,0.5));
      const hi=[0,1,2,3,4].map(l=>ag_io(tt,rd[l]-0.2,rd[l+1]-0.5,0.5));
      // while the camera is close, the rows two or more from the one read leave, and the column heads once it's past the second row,
      // so nothing faint shows behind the kicker or under the captions
      // (each camera key starts a 1.6 s glide at its time; the rows and heads come back once the camera is out again)
      const z=ag_keys(tt,[[c.strat-1.2,0],[c.strat+0.4,1],[c.nine-0.1,1],[c.nine+0.5,0]]),f=ag_keys(tt,[[c.biz-0.8,0],[c.biz+0.8,1],[c.info-0.8,1],[c.info+0.8,2],[c.app-0.8,2],[c.app+0.8,3],[c.tech-0.8,3],[c.tech+0.8,4]]);
      const fade=[0,1,2,3,4].map(l=>1-z*clamp(Math.abs(l-f)-1,0,1));
      lp_screen(x,GR_SCR.x,GR_SCR.y,GR_SCR.w,GR_SCR.h,{a:ag_in(tt,c.beside+0.1,0.5),draw:cx=>gr_map(cx,{rows,goal,mark,hi,fade,head:ag_in(tt,b0-0.3,0.5)*(1-z*clamp(f-1,0,1))})});
      lp_person(x,"noor",1600,730,0.78,{t:tt,flip:true,a:ag_in(tt,c.beside+0.1,0.6),light:dy});
      lp_nameTag(x,1490,560,"noor",{align:"right",a:ag_io(tt,w("beside","Noor",0),c.differ+0.4,0.4)});
      // beside the screen: what a gap is; the names TOGAF and ArchiMate give the steps; where this series drew them
      gr_sheet(x,tt,w("differ","differ",-0.4),1290,160,580,{kick:"A gap",title:"Wherever today and the target differ"},{col:LP.amber,light:"day",out:c.names-0.3});
      gr_sheet(x,tt,c.names+0.2,1290,160,580,{kick:"TOGAF and ArchiMate",title:"Gaps, work packages, plateaus",lines:["A plateau: a steady state on the way"]},
        {light:"day",out:c.map-0.3,u:ag_in(tt,w("names","plateaus",-0.1),0.5)});
      gr_sheet(x,tt,c.map+0.2,1290,160,580,{kick:"The map before the data",title:"Today, and where it's going"},{light:"day",out:c.strat-1.6});
      // nine: too many at once, and some wait on others
      gr_pill(x,tt,c.nine+0.2,null,1580,220,"Nine gaps",{col:LP.amber});
      gr_pill(x,tt,w("nine","until",-0.3),null,1580,300,"Some wait on others",{col:LP.amber,icon:"wait"});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.6,c.plan-0.2,0.5)});
  gr_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Six pieces of work: the gaps grouped into work packages */
scene("work",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const pk=[c.p1,c.p2,c.p3,c.p4,c.p5,c.p6],e0=w("end","door",-0.3),e1=w("end","server",-0.3);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"grRoom",later:true,push:0,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const g0=w("group","group",-0.4),s0=w("two","share",-0.3);
      // the six packages, each as the voice names it: its owner and its date
      for(let i=0;i<6;i++)gr_card(x,i,{a:ag_in(tt,pk[i]-0.2,0.35),k:tt-pk[i]+0.2});
      // the two that close together, side by side in the lower row: an edge round them, and below it what they make
      const b6=gr_slipAt(x,6),b8=gr_slipAt(x,8),ea=ag_io(tt,s0,c.p1-0.3,0.4);
      if(ea>0.004){x.save();x.globalAlpha*=ea;x.strokeStyle=rgba(LP.blue,1);x.lineWidth=4;const x0=b6[0]-14,x1=b8[0]+gr_tagW(x,GR_GAPS[8].chip)+14;rr(x,x0,b6[1]-41,x1-x0,82,14);x.stroke();x.restore();
        lp_tag(x,(x0+x1)/2,b6[1]+84,"Closed together: one package",{align:"center",col:LP.blue,a:ea});}
      // the nine gaps, as slips: each waits at the top, then joins the package that closes it
      gr_slips(x,{in:GR_GAPS.map((G,g)=>ag_in(tt,g0+0.12*g,0.4)),go:GR_GAPS.map(G=>clamp((tt-pk[G.p]-0.1)/1.2,0,1)),ga:GR_GAPS.map(G=>G.p===0?1-ag_in(tt,e0-0.2,0.4):G.p===1?1-ag_in(tt,e1-0.2,0.4):1)});
      // each ends in something people can see
      for(const [i,t0,s] of [[0,e0,"A door that opens"],[1,e1,"A server switched off"]]){const b=gr_cardBox(i);gr_pill(x,tt,t0+0.1,null,b.x+b.w/2,b.y+b.h-44,s,{col:LP.green,icon:"tick"});}}}
  ]);
  gr_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. What each unlocks: the order, and what waits on what */
scene("order",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"grRoom",later:true,push:0,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      const d0=w("door","front",-0.3),dl=w("door","list",-0.2),wo=w("worth","worth",-0.3),li=w("worth","licence",-0.2),dr=w("draft","draft",-0.3),sm=w("sam","Sam",-0.4),
        ct=w("sam","catch",-0.2),ow=w("owners","owners",-0.3),wt=w("wait","wait",-0.2),rl=c.rail;
      // the packages, as tiles: the two that come first on the left; what each unlocks beside them; the two that run alongside, quieter
      [0,4,3,1,2,5].forEach((i,k)=>gr_tile(x,i,{a:ag_in(tt,0.9+k*0.15,0.35),k:tt-0.9-k*0.15,dim:i===2||i===5?ag_in(tt,d0-0.4,0.6):0,
        hi:i===0?ag_io(tt,d0,wo-0.4,0.4):i===1?ag_io(tt,wo,rl-0.4,0.4):0}));
      // not by who asks loudest, but by what each unlocks, and what it's worth
      const la=ag_io(tt,w("order","loudest",-0.4),wo-0.4,0.4);if(la>0.004){lp_tag(x,120,720,"Who asks loudest",{col:LP.amber,a:la});x.save();x.globalAlpha*=la;gr_strike(x,140,720,gr_tagW(x,"Who asks loudest")-40,ag_in(tt,w("order","but",-0.1),0.4));x.restore();}
      gr_tag(x,tt,w("order","unlocks",-0.3),wo-0.4,120,800,"What each unlocks, and what it's worth",{col:LP.blue});
      // the front door first: it unlocks the list, and the days counted
      gr_pill(x,tt,d0,null,470,230,"First",{col:LP.blue});
      const pu=4+3*ag_io(tt,wt,rl,0.4);
      gr_arrow(x,532,315,706,315,ag_in(tt,dl,0.8),LP.blue,{lw:pu});lp_T(x,"unlocks",620,292,{w:600,size:28,align:"center",col:LP.blue,a:ag_in(tt,dl+0.4,0.4)});
      // the old warehouse: worth the most to retire
      gr_tag(x,tt,wo+0.2,rl-0.4,720,700,"Costs A$310,000 a year",{col:LP.amber});
      gr_tag(x,tt,li,rl-0.4,720,768,"Licence ends 31 December",{col:LP.amber});
      // Helena's first draft; Sam sees the catch; so the owners come first, then the move
      const da=ag_io(tt,dr,ow-0.3,0.4);if(da>0.004){lp_tag(x,720,836,"First draft: move from June",{col:LP.blue,a:da});x.save();x.globalAlpha*=da;gr_strike(x,740,836,gr_tagW(x,"First draft: move from June")-40,ag_in(tt,ct,0.5),LP.amber);x.restore();}
      gr_tag(x,tt,ct+0.2,ow-0.3,1180,836,"No owner: can't be moved",{col:LP.amber});
      gr_tag(x,tt,ow+0.2,rl-0.4,720,836,"21 reports: owners first, then the move",{col:LP.blue});
      gr_arrow(x,532,565,706,565,ag_in(tt,ow,0.8),LP.blue,{lw:pu});lp_T(x,"owners",620,527,{w:600,size:28,align:"center",col:LP.blue,a:ag_in(tt,ow+0.4,0.4)});
      lp_T(x,"first",620,627,{w:600,size:28,align:"center",col:LP.blue,a:ag_in(tt,ow+0.4,0.4)});
      // Sam walks in from the right
      lp_person(x,"sam",lerp(2150,1760,ag_sine(clamp((tt-sm)/1.4,0,1))),740,0.8,{t:tt,flip:true,light:dy});
      lp_nameTag(x,1880,430,"sam",{align:"right",a:ag_io(tt,sm+1.0,ow,0.4)});
      // as the timetable decided what Switzerland would build
      gr_sheet(x,tt,rl+0.2,120,690,1000,{kick:"As the timetable did",title:"The target decides what comes first"},{col:LP.blue,light:"day"});}}
  ]);
  gr_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Each stage on its own: three plateaus, and one test */
scene("stages",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"grRoom",later:true,push:0,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const st=w("set","plateaus",-0.4);
      // the test, and later the slogan, in the band at the top
      gr_sheet(x,tt,w("test","test",-0.3),110,140,1700,{kick:"The test",title:"If the money stopped here, would people still have something they use?"},{light:"day",out:c.fast-0.4});
      gr_sheet(x,tt,c.fast+0.2,110,140,1700,{kick:"As Rail 2000 put it",title:"As fast as necessary, not as fast as possible"},{col:LP.blue,light:"day"});
      // the three stages, each filled as the voice reads it; how firm each date is; and each works on its own
      const its=[[w("s1","front",-0.2),w("s1","list",-0.2),w("s1","measures",-0.2),w("s1","partners",-0.2)],[w("s2","platform",-0.2),w("s2","owned",-0.2),w("s2","mandates",-0.2)],[w("s3","seven",-0.2)]];
      const dt=[w("s1","Thursday",-0.3),w("s2","end",-0.3),w("s3","end",-0.3)],fm=[w("dates","day",-0.3),w("dates","month",-0.3),w("dates","year",-0.3)],wk=w("rail","each",-0.3);
      for(let i=0;i<3;i++)gr_stage(x,i,{a:ag_in(tt,st+i*0.3,0.4),k:tt-st-i*0.3,date:ag_in(tt,dt[i],0.5),u:its[i].map(t0=>ag_in(tt,t0,0.5)),firm:ag_in(tt,fm[i],0.5),
        works:ag_in(tt,wk+i*0.4,0.4),wk:tt-wk-i*0.4});
      // Helena's first draft: half the old reports moved in stage one; half a move is no use; the whole move goes to stage two
      const c1=gr_colBox(0),c2=gr_colBox(1),y1=gr_itemsY(x,0)-10,y2=gr_itemsY(x,1)-10,h0=w("half","half",-0.3),n0=w("no","two",-0.3),n1=w("no","licence",-0.3),wh=w("whole","whole",-0.3);
      const ha=ag_io(tt,h0,wh,0.4);if(ha>0.004){lp_tag(x,c1.x+LP_PAD,y1,"Half the old reports moved",{col:LP.blue,a:ha});x.save();x.globalAlpha*=ha;gr_strike(x,c1.x+LP_PAD+20,y1,gr_tagW(x,"Half the old reports moved")-40,ag_in(tt,w("no","use",-0.2),0.5),LP.amber);x.restore();}
      gr_tag(x,tt,n0,wh,c1.x+LP_PAD,y1+70,"Reports in two places",{col:LP.amber});
      gr_tag(x,tt,n1,wh,c1.x+LP_PAD,y1+140,"The licence still paid",{col:LP.amber});
      const mv=ag_sine(clamp((tt-wh-0.3)/1.2,0,1)),ma=ag_io(tt,wh+0.1,c.s1-0.2,0.4);if(ma>0.004)lp_tag(x,lerp(c1.x,c2.x,mv)+LP_PAD,lerp(y1,y2,mv),"The whole move",{col:LP.blue,a:ma});
      // as fast as necessary: the old warehouse before its licence ends; the partners as the faculties can spare a day a week
      gr_tag(x,tt,w("fast","licence",-0.3),null,c2.x+LP_PAD,c2.y+412,"Before the licence ends",{col:LP.amber});
      const c3=gr_colBox(2),ga=ag_in(tt,w("grow","spare",-0.4),0.5);lp_T(x,"As fast as the faculties",c3.x+LP_PAD,c3.y+320,{w:600,size:28,col:LP.mut,a:ga});lp_T(x,"can spare a day a week",c3.x+LP_PAD,c3.y+358,{w:600,size:28,col:LP.mut,a:ga});}}
  ]);
  gr_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On one page: the data strategy */
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const pt=[c.where,c.must,c.princ,c.pic,c.road,c.meas],cam=i=>{const b=gr_panelBox(i);return[clamp(b.x+b.w/2,860,1060),i<3?520:540,1.06];};   // a gentle push: the page's top stays clear of the kicker
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"grRoom",later:true,push:0,keys:[[0,960,540,1.0],[c.where-0.8,...cam(0)],[c.must-0.8,...cam(1)],[c.princ-0.8,...cam(2)],[c.pic-0.8,...cam(3)],[c.road-0.8,...cam(4)],[c.meas-0.8,...cam(5)],[c.same-0.8,960,540,1.0]],
      draw:(x,tt)=>{gr_onePage(x,{a:ag_in(tt,0.9,0.5),k:tt-0.9,u:pt.map(t0=>ag_in(tt,t0-0.1,0.6)),hi:pt.map((t0,i)=>ag_io(tt,t0-0.1,(i<5?pt[i+1]:c.same)-0.3,0.4))});
      gr_pill(x,tt,w("same","fund",-0.3),null,1500,186,"Read by those who fund it and use it",{col:LP.green,icon:"tick"});}}
  ]);
  gr_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 7. Approved: the data council, and back to the timetable */
scene("yes",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late",wall:0.12},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // the page, ready on Monday 26 April
    {at:0,place:"grRoom",push:0,keys:[[0,960,540,1.0]],draw:(x,tt)=>{gr_onePage(x,{});
      gr_pill(x,tt,-1,0.4,1500,186,"Read by those who fund it and use it",{col:LP.green,icon:"tick"});
      gr_pill(x,tt,w("ready","ready",-0.6),null,1500,186,"Ready: Monday 26 April",{col:LP.green,icon:"tick"});}},
    // Tuesday 27 April, the data council: the people who'll fund it and use it, round the table
    {at:c.council-0.3,place:"grCouncil",keys:[[c.council-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const ar=w("arts","asks",-0.4),lo=c.loose,ap=w("approve","approves",-0.3),mo=c.money,en=c.end;
      gr_pageSmall(x,700,130,700,ag_in(tt,c.council,0.5)*(1-ag_in(tt,lo-0.1,0.4))+ag_in(tt,ap-0.6,0.4)*(1-ag_in(tt,en-0.4,0.4)));
      gr_sheet(x,tt,w("council","Tuesday",-0.2),120,150,520,{kick:"Tuesday 27 April 2027",title:"The data council"},{light:"late",out:mo-0.3});
      const cut=794;lp_person(x,"david",640,690,0.8,{t:tt,flip:true,cut,light:lt});
      lp_person(x,GR_DEAN,980,690,0.8,{t:tt,flip:true,cut,talk:ag_io(tt,ar,lo-0.3,0.3),light:lt});
      lp_person(x,lp_crowd(3),1320,690,0.8,{t:tt,flip:true,cut,light:lt});lp_person(x,lp_crowd(4),1660,690,0.8,{t:tt,flip:true,cut,light:lt});
      lp_table(x,450,800,1420);
      const tb=w("table","table",-0.2);gr_plates(x,796,[[640,"Prof. David Mensah",ag_in(tt,w("council","David",-0.2),0.4)],[980,"Dean of Arts",ag_in(tt,w("table","faculties",-0.2),0.4)],
        [1320,"Finance",ag_in(tt,w("table","offices",-0.2),0.4)],[1660,"A data owner",ag_in(tt,w("table","owners",-0.2),0.4)]]);
      lp_person(x,"helena",270,680,0.92,{t:tt,talk:ag_io(tt,lo,ap-0.4,0.3),light:lt});
      // the dean's question, and Helena's answer
      gr_tag(x,tt,ar,ap-0.3,980,420,"Why does Arts wait until 2028?",{align:"center",col:LP.amber});
      gr_sheet(x,tt,lo+0.1,700,130,820,{kick:"The far dates are loose",title:"When Arts can spare a day a week, its partner starts"},{col:LP.blue,light:"late",out:ap-0.3});
      // approved; one package needs money first; its case next month
      gr_pill(x,tt,ap+0.1,en-0.4,1050,230,"Approved: the strategy and the roadmap",{col:LP.green,icon:"tick"});
      gr_tag(x,tt,w("money","money",-0.3),en-0.4,120,210,"The move needs money first",{col:LP.amber});
      gr_tag(x,tt,w("money","case",-0.3),en-0.4,120,280,"Its case: Tuesday 25 May",{col:LP.mut});
      // ninety days, and a plan anyone can read
      gr_sheet(x,tt,en+0.1,560,130,800,{kick:"1 February to 26 April 2027",title:"Ninety days",lines:["A plan anyone at the university can read"]},{col:LP.green,light:"late",u:ag_in(tt,w("end","anyone",-0.1),0.5)});}},
    // in Switzerland: the first stage built only the gaps the timetable needed, and the hubs connected
    {at:c.back-0.3,place:"grMap",keys:[[c.back-0.3,960,470,1.0]],dis:1.2,draw:(x,tt)=>{
      gr_lines(x);gr_mark(x,GR_NEW.bo,1,LP.green,{lw:10,off:13});
      const tr0=c.back+0.6,tr1=c.uni-0.6;gr_trains(x,clamp((tt-tr0)/(tr1-tr0),0,1),{a:ag_io(tt,tr0,tr1,0.4)});
      gr_cities(x,{hub:1,hubCol:{bern:LP.green,zurich:LP.green}});
      gr_tag(x,tt,w("back","gaps",-0.2),null,1820,700,"Only the gaps the timetable needed",{align:"right",col:LP.blue});
      gr_tag(x,tt,w("back","connected",-0.2),null,1820,770,"The hubs connected",{align:"right",col:LP.green});}},
    // at the university: stage one, useful even if the money stopped there; a roadmap ends, keeping data well doesn't
    {at:c.uni-0.3,place:"grRoom",keys:[[c.uni-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      gr_sheet(x,tt,c.uni+0.3,560,170,800,{kick:"Stage one · 30 September 2027",title:"Useful even if the money stopped there",lines:["One front door","One list","A measure they can see"]},
        {col:LP.blue,light:"day",out:c.cap-0.4,u:gr_u(tt,[w("uni","door",-0.1),w("uni","list",-0.1),w("uni","measure",-0.1)])});
      gr_pill(x,tt,w("uni","even",-0.3),c.cap-0.4,960,640,"Works on its own",{col:LP.green,icon:"tick"});
      gr_sheet(x,tt,c.cap+0.2,560,260,800,{kick:"A capability, not a project",title:"A roadmap ends; keeping data well doesn't"},{light:"day",out:c.take-0.4});
      gr_stagesSmall(x,tt,c.take+0.1,e0-0.2);}}
  ]);
  lp_end(ctx,S,t,e0,GR_TITLE,GR_LAST,"Film 4 of 4","A plan in ninety days",GR_DM);
  gr_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["gaps","work","order","stages","page","yes"]);
