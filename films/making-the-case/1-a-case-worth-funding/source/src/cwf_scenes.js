/* ===== A case worth funding: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; between rooms a
   shot dissolves, or cuts where both show the same people. Helena breathes on the film's own clock (sc.start + t), so where one chapter
   glides into the next in the team's room she is drawn the same on both sides. Sizes in the 1920 x 1080 frame. */

const CWF_TITLE="A case worth funding";
const CWF_LAST="Options, costs, benefits with owners, and one clear ask.";
const CWF_MARK={module:"Data management",mark:dm_mark};
function cwf_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"1",CWF_TITLE,{a});}
// Helena in the team's room, where she stands for chapters 2 to 5
const cwf_hel=(x,sc,tt,o)=>lp_person(x,"helena",330,640,1.0,Object.assign({t:sc.start+tt,light:{light:"morning"}},o||{}));
// the far bank of the cutting's floor, over the waists of the diggers further along it
function cwf_midBank(ctx){const g=ctx.createLinearGradient(0,676,0,780);g.addColorStop(0,rgba(ag_lt(CWF_K.earth,0.16),1));g.addColorStop(1,rgba(CWF_K.earthDk,1));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(0,690);ctx.bezierCurveTo(600,676,1300,700,W,682);ctx.lineTo(W,800);ctx.lineTo(0,800);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(ag_lt(CWF_K.earth,0.4),0.7);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,690);ctx.bezierCurveTo(600,676,1300,700,W,682);ctx.stroke();}

/* ---------------------------------------------------------------- 1. Clinton's Ditch: New York State, 1816 to 1825 */
scene("ditch",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},out={light:"day",wall:0},P=CWF_PEOPLE;
  const dig=(x,who,px,py,s,tt,fl)=>lp_person(x,P[who],px,py,s,{t:tt,flip:fl,covered:true,light:out,pose:"hold",hold:cwf_shovel});
  ag_shots(ctx,S,t,sc.dur,[
    // New York State in 1816: the lakes, the river, three towns; farms spreading west; the only way east, by wagon; what a ton cost
    {at:0,place:"cwfMap",keys:[[0,960,560,1.1],[c.when+0.6,960,540,1.0],[c.farms+0.2,720,600,1.15],[c.road-0.2,960,540,1.0]],draw:(x,tt)=>{
      cwf_mapLive(x,{names:ag_in(tt,c.when+1.2,1.0),farms:ag_in(tt,w("farms","Farms",-0.1),2.6),road:ag_in(tt,w("road","wagon",-0.3),2.8)});
      cwf_sheet(x,tt,w("when","eighteen",-0.3),110,110,440,{kick:"New York State",title:"1816"},{light:null,pin:false,out:c.farms+1.2});
      cwf_tag(x,tt,w("farms","west",-0.2),c.road-0.3,560,650,"Farms and towns, spreading west",{align:"center",col:LP.ink});
      cwf_tag(x,tt,w("farms","coast",-0.2),c.road-0.3,1390,700,"Grain to sell on the coast",{align:"right",col:LP.ink});
      cwf_tag(x,tt,w("road","rough",-0.2),c.harm-0.6,1080,490,"By wagon, on rough roads",{align:"center",col:LP.amber});
      const f0=w("cost","ton",-0.2);if(tt>=f0)cwf_freight(x,300,540,640,{a:ag_in(tt,f0,0.35)*(1-ag_in(tt,c.harm-0.7,0.4)),k:tt-f0,u:ag_in(tt,w("cost","hundred",-0.1),1.0),light:null,pin:false});}},
    // a farm family out west: plenty grown, and no price that paid
    {at:c.harm-0.4,place:"cwfFarm",keys:[[c.harm-0.4,960,540,1.05],[c.harm+0.8,960,540,1.0]],d:2.2,dis:1.4,draw:(x,tt)=>{
      lp_person(x,P.farmer,620,650,1.0,{t:tt,light:out});lp_person(x,P.farmwife,1060,660,0.96,{t:tt+1.3,flip:true,light:out});
      cwf_tag(x,tt,w("harm","plenty",-0.1),null,1540,250,"Plenty grown",{align:"center",col:LP.ink});
      cwf_tag(x,tt,w("harm","price",-0.1),null,1540,330,"But no price that paid",{align:"center",col:LP.amber});}},
    // a canal: 363 miles through forest and swamp; the federal government wouldn't pay; "Clinton's Ditch"; something had to change
    {at:c.canal-0.4,place:"cwfMap",keys:[[c.canal-0.4,960,540,1.0],[c.change-0.2,900,560,1.04]],d:2.4,dis:1.4,draw:(x,tt)=>{
      cwf_mapLive(x,{names:1,farms:1,road:1,plan:ag_in(tt,w("canal","canal",-0.1),3.0)});
      cwf_tag(x,tt,w("canal","miles",-0.3),c.case-0.9,900,250,"363 miles, through forest and swamp",{align:"center",col:LP.blue});
      cwf_tag(x,tt,w("refuse","federal",-0.2),c.case-0.9,750,480,"The federal government wouldn't pay",{align:"center",col:LP.amber});
      cwf_sheet(x,tt,w("refuse","Jefferson",-0.2),440,540,620,{kick:"President Jefferson",title:"“Little short of madness”"},{light:null,pin:false,col:LP.amber,out:c.case-0.9});
      cwf_pill(x,tt,w("refuse","Critics",-0.1),c.case-0.9,750,820,"“Clinton's Ditch”",{col:LP.amber});}},
    // the case, to New York's legislature: where, what it costs, how it's repaid; and its yes
    {at:c.case-0.4,place:"cwfHall",keys:[[c.case-0.4,960,540,1.04],[c.case+0.8,960,540,1.0]],d:2.2,dis:1.4,draw:(x,tt)=>{
      lp_person(x,P.clinton,520,640,1.0,{t:tt,pose:"hold",hold:cwf_roll,front:cwf_cravat,light:mo});
      lp_nameTag(x,150,250,P.clinton,{role:"A canal commissioner",a:ag_in(tt,w("case","Clinton",-0.2),0.5)});
      cwf_sheet(x,tt,w("case","legislature",-0.6),960,170,800,CWF_CASE,{col:LP.blue,light:"morning",u:cwf_u(tt,[w("what","Where",-0.1),w("what","cost",-0.1),w("what","taxes",-0.1)])});
      cwf_pill(x,tt,w("yes","fifteenth",-0.2),null,1360,640,"15 April 1817: yes",{col:LP.green,icon:"tick"});}},
    // the digging: thousands, with picks and shovels; many just arrived from Ireland and Wales; engineers who learned on the job
    {at:c.dug-0.4,place:"cwfCut",keys:[[c.dug-0.4,960,560,1.06],[c.dug+0.8,960,540,1.0]],d:2.2,dis:1.4,draw:(x,tt)=>{
      for(const [px,py,s,k,fl] of [[250,560,0.34,"digger2",false],[430,566,0.36,"digger",true],[1530,560,0.34,"digger",false],[1720,566,0.35,"digger2",true]])dig(x,k,px,py,s,tt+px*0.002,fl);
      cwf_midBank(x);
      dig(x,"digger",760,640,0.92,tt,false);dig(x,"digger2",1180,650,0.9,tt+1.7,true);
      cwf_bank(x);
      cwf_tag(x,tt,w("dug","Thousands",-0.1),null,120,130,"Thousands, with picks and shovels",{col:LP.ink});
      cwf_tag(x,tt,w("dug","Ireland",-0.2),null,120,210,"Many just arrived from Ireland and Wales",{col:LP.ink});
      cwf_tag(x,tt,w("dug","engineers",-0.2),null,120,290,"Engineers who learned on the job",{col:LP.ink});}},
    // the land it crossed, the Haudenosaunee nations' homelands; open, two years ahead of plan; a ton for under nine dollars; the tolls; the port
    {at:c.land-0.4,place:"cwfMap",keys:[[c.land-0.4,940,560,1.06],[c.open-0.4,960,540,1.0]],d:2.2,dis:1.4,draw:(x,tt)=>{const d0=c.land-0.4;
      cwf_mapLive(x,{names:1,farms:1,road:1,roadA:1-0.75*ag_in(tt,c.land-0.2,1.2),plan:1,dug:ag_in(tt,d0,c.open-d0),open:ag_in(tt,w("open","opened",-0.1),1.4),
        boat:clamp((tt-w("cheaper","days",-0.2))/6.5,0,1),nations:ag_in(tt,w("land","Haudenosaunee",-0.3),2.2),port:ag_in(tt,w("port","busiest",-0.2),1.0)});
      cwf_tag(x,tt,w("land","taken",-0.2),c.open-0.4,960,640,"Much of it taken in the years before",{align:"center",col:LP.ink});
      cwf_pill(x,tt,w("open","opened",0.1),c.cheaper-0.5,1180,600,"Open, 26 October 1825",{col:LP.green,icon:"tick"});
      cwf_tag(x,tt,w("open","ahead",-0.4),c.cheaper-0.5,1180,690,"Two years ahead of plan",{align:"center",col:LP.green});
      const f0=c.cheaper-0.2;if(tt>=f0)cwf_freight(x,300,540,640,{a:ag_in(tt,f0,0.35)*(1-ag_in(tt,c.tolls-0.6,0.4)),k:tt-f0,u:1,after:ag_in(tt,w("cheaper","nine",-0.1),1.0),light:null,pin:false});
      const t0=c.tolls-0.1;if(tt>=t0)cwf_tolls(x,300,540,640,{a:ag_in(tt,t0,0.35),k:tt-t0,u:ag_in(tt,w("tolls","tolls",0),2.6),light:null,pin:false});
      cwf_tag(x,tt,w("port","busiest",0.2),null,1380,790,"The busiest port in the country",{align:"right",col:LP.green});}},
    // a data team asks for money too; its case needs the same parts
    {at:c.data-0.4,place:"cwfRoom",keys:[[c.data-0.4,960,540,1.0]],dis:1.4,draw:(x,tt)=>{cwf_hel(x,sc,tt);
      cwf_sheet(x,tt,w("data","team",-0.3),700,170,1000,{kick:"A data team asks for money too",lines:["To build something new","Or to stop paying for something old"]},
        {light:"morning",u:cwf_u(tt,[w("data","build",-0.1),w("data","stop",-0.1)]),out:c.same-0.5});
      cwf_sheet(x,tt,w("same","parts",-0.4),700,170,1000,{kick:"Its case needs the same parts",lines:["The choices","What each costs, once and every year","What it saves","Who will see the benefit"]},
        {col:LP.blue,light:"morning",out:c.breath-0.2,u:cwf_u(tt,[w("same","choices",-0.1),w("same","costs",-0.1),w("same","saves",-0.1),w("same","benefit",-0.1)])});}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,CWF_TITLE,"A business case for data work, made so people can decide","Data management · Making the case",CWF_MARK);
});

/* ---------------------------------------------------------------- 2. The decision first */
scene("decide",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"cwfRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const g1=c.first-0.6,g2=c.five-0.6;cwf_hel(x,sc,tt);
      lp_nameTag(x,110,236,"helena",{role:"Data manager",a:ag_io(tt,w("helena","Helena",-0.2),c.first+2,0.5)});
      // the old warehouse: since 2012, what it costs every year, when its licence ends, and what Helena will ask
      const o0=w("old","warehouse",-0.3);if(tt>=o0)cwf_old(x,700,150,560,{a:ag_in(tt,o0,0.35)*(1-ag_in(tt,g1,0.4)),k:tt-o0,light:"morning"});
      const p0=w("pay","licence",-0.2);if(tt>=p0)lp_figure(x,1290,150,560,{kick:"Every year",num:"A$310,000",label:"Licence, servers and support"},{col:LP.amber,light:"morning",a:ag_in(tt,p0,0.35)*(1-ag_in(tt,g1,0.4)),k:tt-p0});
      cwf_sheet(x,tt,w("renew","ends",-0.3),1290,500,560,{kick:"The licence",title:"Ends 31 December 2027",lines:["If nobody decides, it renews for three more years"]},{col:LP.amber,light:"morning",out:g1,u:ag_in(tt,w("renew","nobody",-0.1),0.5)});
      cwf_sheet(x,tt,w("helena","council",-0.3),700,500,560,{kick:"Tuesday 25 May",title:"Ask the data council to retire it"},{col:LP.blue,light:"morning",out:g1});
      // the decision first, in one line; then the money: every year for governance, once for this
      cwf_sheet(x,tt,c.first+0.2,650,150,1200,{kick:"The decision Helena needs",title:"Retire the old warehouse this year, or pay for three more?"},{col:LP.blue,light:"morning",out:g2});
      cwf_sheet(x,tt,w("capability","Governance",-0.2),650,470,580,{kick:"Governance",title:"A budget line every year",lines:["“A capability, not a project”"]},{light:"morning",out:g2});
      cwf_sheet(x,tt,w("capability","ask",-0.2),1270,470,580,{kick:"This ask",title:"Money once",lines:["To stop paying every year"]},{col:LP.blue,light:"morning",out:g2});
      // the five questions, as a checklist, each ticked
      const f0=w("five","questions",-0.4);if(tt>=f0)cwf_five(x,700,130,1150,{a:ag_in(tt,f0,0.35),k:tt-f0,light:"morning",
        u:cwf_u(tt,[w("questions","needed",-0.6),w("questions","value",-0.6),w("questions","bought",-0.6),w("questions","afforded",-0.6),w("questions","delivered",-0.6)]),
        tick:ag_in(tt,w("checklist","checklist",-0.2),1.6)});
      cwf_pill(x,tt,w("checklist","form",-0.2),null,930,830,"A checklist, not a form",{col:LP.green,icon:"tick"});
      // the author's advice (12 November 2026): heavy methods where a mistake can cost lives and where the law requires them, and even
      // there only when required; light ones everywhere else, because they can change quickly. The four take turns beside the pill:
      // each leaves before the next comes in
      cwf_tag(x,tt,w("heavy","heavy",-0.2),c.law-0.5,1200,830,"Heavy: where a mistake can cost lives",{col:LP.amber});
      cwf_tag(x,tt,w("law","law",-0.2),c.only-0.5,1200,830,"Heavy: where the law requires it",{col:LP.amber});
      cwf_tag(x,tt,c.only+0.1,c.light-0.5,1200,830,"Even there: only when required",{col:LP.amber});
      cwf_tag(x,tt,c.light+0.1,null,1200,830,"Light: try, learn, change course",{col:LP.green});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("may","May",-0.3),c.helena,0.5)});
  cwf_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Three options */
scene("options",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),g=1-ag_in(t,sc.dur-1.3,0.6);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"cwfRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{cwf_hel(x,sc,tt);if(g<=0.004)return;x.save();x.globalAlpha*=g;
      cwf_pill(x,tt,w("options","nothing",-0.2),c.b,1185,96,"Doing nothing has a price too",{col:LP.amber});
      const rec=ag_in(tt,w("recommend","recommends",-0.2),0.6),lg=ag_io(tt,c.logs,c.c-0.5,0.4);
      const A0=c.a-0.1;if(tt>=A0)cwf_option(x,0,{a:ag_in(tt,A0,0.35),k:tt-A0,u:cwf_u(tt,[w("a","renew",-0.1),w("a","version",-0.2)]),cost:ag_in(tt,w("a","Nine",-0.1),0.5),light:"morning",dim:lg*0.4});
      const B0=c.b-0.1;if(tt>=B0)cwf_option(x,1,{a:ag_in(tt,B0,0.35),k:tt-B0,u:ag_in(tt,w("b","move",-0.1),0.5),cost:ag_in(tt,w("b","Five",-0.1),0.5),light:"morning",dim:lg*0.4});
      // the warehouse's own logs: who opens what
      if(lg>0.004)cwf_logs(x,1410,190,450,560,{a:lg,u:ag_in(tt,c.logs+0.3,1.6),amb:ag_in(tt,w("unopened","Seventeen",-0.1),1.0),used:ag_in(tt,w("unopened","other",-0.1),0.6)});
      const C0=c.c-0.1;if(tt>=C0)cwf_option(x,2,{a:ag_in(tt,C0,0.35),k:tt-C0,u:cwf_u(tt,[w("c","rebuilt",-0.3),w("c","retire",-0.2)]),cost:ag_in(tt,w("c","Three",-0.1),0.5),rec,light:"morning"});
      cwf_pill(x,tt,w("recommend","recommends",0.1),null,1595,830,"Recommended",{col:LP.blue,icon:"tick"});
      cwf_tag(x,tt,w("recommend","stay",-0.2),null,980,830,"A and B stay, so the council can see why",{align:"center",col:LP.ink});
      x.restore();}}
  ]);
  cwf_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Once, and every year */
scene("costs",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),g=1-ag_in(t,sc.dur-1.3,0.6);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"cwfRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{cwf_hel(x,sc,tt);if(g<=0.004)return;x.save();x.globalAlpha*=g;
      // the canal's case counted its tolls: its sheet, pinned on the team's wall
      const k0=w("running","counted",-0.4);if(tt>=k0)cwf_tolls(x,600,170,640,{a:ag_in(tt,k0,0.35)*(1-ag_in(tt,c.forty-0.6,0.4)),k:tt-k0,u:1,light:"morning"});
      cwf_tag(x,tt,w("running","digging",-0.2),c.forty-0.6,920,560,"Not only the digging",{align:"center",col:LP.ink});
      // option C's costs: once, and every year; then what stops, what starts, and the saving
      const s1=c.payback-0.7;
      const f0=w("forty","Running",-0.3);if(tt>=f0)cwf_costs(x,600,170,560,{a:ag_in(tt,f0,0.35)*(1-ag_in(tt,s1,0.4)),k:tt-f0,u:cwf_u(tt,[f0+0.2,w("forty","forty",-0.2)]),light:"morning"});
      const v0=w("stops","stops",-0.5);if(tt>=v0)cwf_saving(x,1190,170,660,{a:ag_in(tt,v0,0.35)*(1-ag_in(tt,s1,0.4)),k:tt-v0,u1:ag_in(tt,v0+0.2,0.8),u2:ag_in(tt,w("stops","starts",-0.2),0.8),sv:ag_in(tt,w("stops","saving",-0.2),1.4),light:"morning"});
      // the payback: covered in about 17 months; five years on, A$970,000 ahead; Rohan checks every figure
      const b0=c.payback-0.3;if(tt>=b0){const m=20*ag_sine(clamp((tt-b0-0.4)/(w("payback","covers",0)-b0-0.4),0,1))+40*ag_sine(clamp((tt-c.five)/(w("five","nine",0)-c.five),0,1));
        cwf_payback(x,580,150,840,640,{a:ag_in(tt,b0,0.35),k:tt-b0,m,pb:ag_in(tt,w("payback","seventeen",-0.1),0.6),end:ag_in(tt,w("five","nine",0),0.6),light:"morning"});}
      const r0=c.rohan-0.5;lp_person(x,CWF_UNI.rohan,1660,650,0.98,{t:sc.start+tt,flip:true,a:ag_in(tt,r0,0.6),light:{light:"morning"}});
      lp_nameTag(x,1860,236,CWF_UNI.rohan,{role:"Finance",align:"right",a:ag_in(tt,w("rohan","Rohan",-0.1),0.5)});
      cwf_pill(x,tt,w("rohan","checks",-0.1),null,1000,846,"Every figure checked by Finance",{col:LP.green,icon:"tick"});
      x.restore();}}
  ]);
  cwf_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Benefits with owners */
scene("benefits",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"cwfRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{cwf_hel(x,sc,tt);
      const b0=w("each","benefits",-0.3);if(tt>=b0)cwf_benefits(x,600,140,1240,{a:ag_in(tt,b0,0.35),k:tt-b0,light:"morning",
        u:cwf_u(tt,[w("saving","saving",-0.2),w("staff","staff",-0.6),w("owner","owner",-0.6)]),nm:ag_in(tt,w("money","money",-0.4),0.5),seen:ag_in(tt,w("quarter","quarter",-0.1),1.2)});
      // benefits management: one more step after the decision
      const s0=w("ward","step",-0.4),y=836;
      if(tt>=s0){const a=ag_in(tt,s0,0.4);lp_T(x,"Ward and Daniel:",640,y+10,{w:600,size:28,col:LP.mut,a});
        lp_tag(x,880,y,"The case",{col:LP.blue,a});lp_T(x,"→",1090,y+11,{w:800,size:32,col:LP.mut,a});
        lp_tag(x,1130,y,"The decision",{col:LP.ink,a});
        const tr=ag_in(tt,w("ward","track",-0.2),0.4);lp_T(x,"→",1418,y+11,{w:800,size:32,col:LP.mut,a:tr});
        lp_pill(x,1640,y,"Track the benefits",{col:LP.green,icon:"wait",a:tr,k:tt-w("ward","track",-0.2)});}}}
  ]);
  cwf_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. Ten minutes, one ask */
// the council's room: the one page on the screen at the left; Helena and Rohan standing beside it; Mei and Clara seated at the table,
// further back, facing them. The page's words read at 28 px only at the camera's close framing (k 0.487, zoom 2.05, the whole page above the
// captions), so they come in once it's there
const CWF_SCR=[100,130,760,419];
scene("ask",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  const near=[[c.page-0.4,c.mei-0.6],[c.wait-0.3,c.yes-0.8]],words=tt=>Math.max(...near.map(([a,b])=>ag_in(tt,a+1.7,0.4)*(1-ag_in(tt,b-0.35,0.3))));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"cwfCouncil",keys:[[0,960,540,1.0],[c.ten-0.2,1152,470,1.25],[c.page-0.4,480,384,2.05],[c.mei-0.6,1387,470,1.8],[c.wait-0.3,480,384,2.05],[c.yes-0.8,960,540,1.0]],d:1.7,push:0.015,draw:(x,tt)=>{
      // the one page on the screen: its words only once the camera is close enough to read them
      const hl=tt>=c.wait-0.3?"a":tt>=c.ask-0.2?"ask":tt>=c.page?"decision":null,hlA=hl==="a"?ag_in(tt,w("wait","option",-0.3),0.5):hl==="ask"?ag_in(tt,w("ask","ask",-0.2),0.5):hl==="decision"?ag_in(tt,w("page","decision",-0.4),0.5):0;
      lp_screen(x,CWF_SCR[0],CWF_SCR[1],CWF_SCR[2],CWF_SCR[3],{draw:(cx,X,Y,Wd,Hd)=>cwf_page(cx,X,Y,Wd/CWF_PW,{words:words(tt),hl,hlA:hlA*(1-ag_in(tt,c.yes-1.2,0.4))})});
      // Mei and Clara at the table, further back, facing them; Helena and Rohan standing by the screen
      const cut=lp_table(x,1440,850,480,{a:0});
      lp_person(x,"mei",1560,690,0.72,{t:tt+0.4,flip:true,cut,light:dy});lp_person(x,"clara",1760,694,0.72,{t:tt+2.1,flip:true,cut,light:dy});
      lp_table(x,1440,850,480,{floor:936});
      lp_person(x,CWF_UNI.rohan,1230,630,0.96,{t:sc.start+tt,light:dy});lp_person(x,"helena",1020,640,1.0,{t:sc.start+tt,light:dy});
      cwf_tag(x,tt,w("ten","minutes",-0.2),c.page-0.6,1125,236,"Ten minutes, one page",{align:"center",col:LP.ink});
      // her name once the camera has come to her
      lp_nameTag(x,1560,384,"mei",{align:"center",a:ag_io(tt,c.mei+1.1,c.wait-0.6,0.4)});
      cwf_tag(x,tt,w("mei","waiting",-0.3),c.wait-0.6,1560,300,"What would waiting a year cost?",{align:"center",col:LP.ink});
      cwf_pill(x,tt,w("yes","yes",-0.2),null,1125,236,"Yes, that day",{col:LP.green,icon:"tick"});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"Tuesday 25 May 2027 · the data council",{a:ag_io(t,0.6,c.ten-0.4,0.5)});
  // the film's name steps aside while the camera is close: the page, and the people, fill the frame up to its top
  cwf_kick(ctx,S,1-ag_io(t,c.ten-0.4,c.yes+0.4,0.5));
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),e0=c.breath+0.6,dl={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"cwfMon",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const g1=c.start-0.6,g2=c.take-0.4;
      // the canal's case, pinned beside Helena's: one decision put plainly, each paid back, each seen after
      cwf_sheet(x,tt,0.8,130,200,780,CWF_CASE,Object.assign({col:LP.blue,out:g1},dl));
      cwf_tag(x,tt,w("helena","tolls",-0.2),g1,520,636,"Its tolls repaid it within ten years",{align:"center",col:LP.green});
      cwf_sheet(x,tt,w("helena","Helena's",-0.3),1010,200,780,{kick:"Helena's case",title:"Retire the old warehouse",lines:["Paid back in about 17 months","Seen by the council every quarter"]},
        Object.assign({col:LP.green,out:g1,u:cwf_u(tt,[w("helena","seventeen",-0.2),w("helena","quarter",-0.4)])},dl));
      // what to do on Monday
      const adv=[["start","One","Start from the decision you need",LP.blue,120,150,540],["carry","Two","Show carrying on as now",LP.amber,690,150,540],["count","Three","Count running costs, not only building",LP.amber,1260,150,540],
        ["owners","Four","Give each benefit an owner and a date, and track it",LP.green,120,500,825],["check","Five","Have Finance check the money; ask for a decision, with a date",LP.blue,975,500,825]];
      for(const [id,k,s,col,ax,ay,aw] of adv)cwf_sheet(x,tt,c[id]+0.1,ax,ay,aw,{kick:k,title:s},Object.assign({col,out:g2},dl));
      // the whole film in one shape: the one page's four parts
      if(tt>=g2)cwf_parts(x,560,190,800,{a:1-ag_in(tt,e0,0.8),u:[w("take","Options",-0.2),w("take","costs",-0.2),w("take","benefits",-0.2),w("take","ask",-0.3)].map(t0=>ag_in(tt,t0,0.6)),light:"day"});}}
  ]);
  lp_end(ctx,S,t,e0,CWF_TITLE,CWF_LAST,"Film 1 of 4","Making the case",CWF_MARK);
  cwf_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["decide","options","costs","benefits","ask"]);
