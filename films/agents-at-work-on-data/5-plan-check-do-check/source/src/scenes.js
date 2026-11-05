/* ===== Plan, define the check, do, check: the eight chapters =====
   Each chapter is a few shots (the shared ag_shots): a place painted once, a slow camera, and what's drawn live over it. Between
   places a shot dissolves in. In the lab the camera never jumps: the next shot, or a chapter that opens there (ag_cutInto), glides
   on from where the camera is, and a later moment there (later:true) lets what was there leave, through the bare lab, before what
   comes next comes in, so nothing appears or vanishes in one frame. Times inside a chapter come from its cues (when each
   line starts) and the words of its lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on
   cards, labels and pills, at least 28 px as seen, and above the captions (y 890). */

// made once per chapter, the first time it draws: its cues are known by then
const pc_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the lab, bare for an instant between two moments in it (later:true): its place, and the light every shot of it draws
AG_BARE.lab=c=>ag_roomLight(c,1);
// a card that springs in at t0 and goes at t1 (or stays): its k and a
const pc_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// the place-and-year tag at the top left, in screen space: the latest of [[t, words, dissolve], ...] passed, dissolving from the one
// before over its shot's dissolve (0 for a cut); null words hide it
function pc_tags(ctx,S,t,list,a){a=a==null?1:a;if(a<=0.01)return;let i=0;for(let k=1;k<list.length;k++)if(t>=list[k][0])i=k;
  const d=list[i][2]==null?0.5:list[i][2],u=i>0?(d>0?ag_in(t,list[i][0],d):1):ag_in(t,list[0][0],0.6);setScreen(ctx,S);
  if(u<1&&i>0&&list[i-1][1])pc_tag(ctx,list[i-1][1],a*(1-u));if(list[i][1])pc_tag(ctx,list[i][1],a*u);}
// a card's flight out of the sphere (u 0 to 1) along a curve from (x0, y0) by (x1, y1) to (x2, y2): its middle and its size
function pc_fly(u,x0,y0,x1,y1,x2,y2){const e=ag_eo(u),q=(a0,a1,a2)=>(1-e)*(1-e)*a0+2*(1-e)*e*a1+e*e*a2;return{x:q(x0,x1,x2),y:q(y0,y1,y2),s:lerp(0.3,1,ag_eo(clamp(u/0.55,0,1)))};}
// draw fn (a card at its place, centred on (cx, cy)) as if it were at F: while it's still small, only a blank card of box's size
// ({w, h, a}), as its words would be under 28 px; full size, the card itself, moved
function pc_flown(ctx,F,cx,cy,fn,box){if(!F)return;ctx.save();
  if(F.s<0.999&&box){ctx.translate(F.x,F.y);ctx.scale(F.s,F.s);ag_box(ctx,-box.w/2,-box.h/2,box.w,box.h,22,{a:box.a==null?1:box.a});}
  else{ctx.translate(F.x,F.y);ctx.scale(F.s,F.s);ctx.translate(-cx,-cy);fn();}ctx.restore();}
const PC_TITLE="Plan, define the check, do, check",PC_LINE="AGENTS AT WORK ON DATA · FILM 5 OF 9";
// the agent: its sphere in its oak ring, without the ring's step pills (this film's four steps run across the top instead);
// R the ring, r the sphere; o.core, o.think, o.pulse {deg, a}, o.p (how much ring), o.a
function pc_agent(ctx,t,x,y,R,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;ctx.save();ctx.globalAlpha*=a;
  ag_modelLight(ctx,x,y,r,o.core==null?1:o.core);ag_ring(ctx,x,y,R,{p:o.p==null?1:o.p,from:-90,arrows:[-30,90,210],pulse:o.pulse});
  ag_model(ctx,x,y,r,{t,core:o.core,think:o.think,label:null});ctx.restore();}
// a pulse going once round the ring from the top, starting at t0 and taking d seconds: for o.pulse
const pc_round=(t,t0,d)=>{const u=(t-t0)/(d||1.6);return u<=0||u>=1.15?{deg:-90,a:0}:{deg:-90+360*ag_sine(clamp(u,0,1)),a:clamp(Math.min(u*6,(1.15-u)*6),0,1)};};
// a line of words on the wall, centred, in two sizes: the chapter's point
function pc_wall(ctx,lines,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||44,lh=sz*1.3;
  lines.forEach((l,i)=>ag_T(ctx,l,x,y+i*lh,{w:800,size:sz,align:o.align||"center",col:o.col||AG.ink,a:a*(o.k?clamp(o.k[i]==null?1:o.k[i],0,1):1)}));}
// a map label: a place's name, in the map's own grey-green
function pc_mapLabel(ctx,s,x,y,a){if(a<=0.01)return;ag_T(ctx,s.toUpperCase(),x,y,{w:700,size:34,ls:6,align:"center",col:[84,96,86],a});}

/* ---------------------------------------------------------------- 1 · Water people can trust
   Singapore, late 1990s: the city, the map and its pipes, the water a city could clean, a glass in a kitchen; 1998 to 2000: the test
   plant, dry, and the list written first; the panel; the parade; the reservoirs since 2003; the lab today. Then the university: the
   census-day count, what an agent brings back, and the check decided first. */
const PC_TAP=[1070,520,980,546];   // a tap off the hall's column, over the sample bottle
function pc_tap(x){const [tx0,ty0,tx1,ty1]=PC_TAP;x.save();x.lineCap="round";x.strokeStyle=rgba([110,116,120],1);x.lineWidth=16;x.beginPath();x.moveTo(tx0,ty0);x.lineTo(tx1,ty0);x.lineTo(tx1,ty1);x.stroke();
  x.strokeStyle=rgba([198,202,204],1);x.lineWidth=8;x.stroke();x.restore();}
scene("water",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({rain:wAt(sc,"city","little"),island:wAt(sc,"city","island"),
    map:c.piped-0.5,piped:wAt(sc,"piped","piped"),mal:wAt(sc,"piped","Malaysia"),e11:wAt(sc,"piped","eleven"),e61:wAt(sc,"piped","sixty-one"),
    street:c.clean-0.5,used:wAt(sc,"clean","used"),sinks:wAt(sc,"clean","sinks"),until:wAt(sc,"clean","until"),pure:wAt(sc,"clean","pure"),
    kitchen:c.fear-0.6,drink:wAt(sc,"fear","drink"),trust:wAt(sc,"trust","trust"),border:wAt(sc,"trust","border"),worthy:wAt(sc,"change","trustworthy"),
    plant:c.study-0.6,agency:wAt(sc,"study","agency"),write:wAt(sc,"before","write"),judged:wAt(sc,"before","judged"),
    phys:wAt(sc,"measures","physical"),chem:wAt(sc,"measures","chemical"),micro:wAt(sc,"measures","microbiological"),world:wAt(sc,"measures","world's"),
    stds:wAt(sc,"measures","standards"),panel:c.panel-0.6,rules:wAt(sc,"panel","rules"),results:wAt(sc,"panel","results"),years:wAt(sc,"panel","two years"),
    july:wAt(sc,"report","July"),well:wAt(sc,"report","well"),parade:c.parade-0.6,raise:wAt(sc,"parade","raise"),gulp:wAt(sc,"parade","drink"),
    flows:c.flows-0.6,today:c.today-0.6,three:wAt(sc,"today","three hundred"),outside:wAt(sc,"today","outside"),
    uni:c.data-0.6,change:wAt(sc,"data","change"),census:wAt(sc,"data","census-day"),gov:wAt(sc,"data","government"),
    checked:wAt(sc,"unless","checked"),brings:wAt(sc,"unless","brings"),back:c.first-0.2,check:wAt(sc,"first","check"),starts:wAt(sc,"first","starts"),
    work:wAt(sc,"first","work"),use:wAt(sc,"first","use"),title:c.breath+0.2}));
  ag_shots(ctx,S,t,sc.dur,[
    // across calm water, the island city in soft daylight; a band of rain moves in from the left and falls on the city and the sea
    {at:0,place:"pcCity",keys:[[0,960,520,1.07],[0.1,960,540,1.0]],d:8.6,push:0,draw:(x,tt)=>{
      pc_cityLife(x,tt,lerp(-220,2300,ag_sine((tt-P.island+1.2)/7.5)),ag_in(tt,P.island-1.4,1.2));}},
    // the map: the island, the tip of the mainland across a narrow strait; water piped in along the causeway, under two agreements
    {at:P.map,dis:0.8,place:"pcMap",keys:[[P.map,960,560,1.05],[P.map+0.1,960,540,1.0]],d:5,push:0,draw:(x,tt)=>{
      pc_mapLife(x,tt,ag_sine((tt-P.piped+0.2)/2.8),1);
      pc_mapLabel(x,"Singapore",1030,708,ag_in(tt,P.map+0.4,0.6));pc_mapLabel(x,"Malaysia",470,300,ag_in(tt,P.mal-0.1,0.6));
      const a1=pc_pop(tt,P.e11-0.5,null),a2=pc_pop(tt,P.e61-0.5,null);
      ag_textCard(x,1530,590,360,{kick:"Agreement",title:"1961 · ends 2011"},{k:a1.k,a:a1.a,kickCol:AG.mut});
      ag_textCard(x,1530,742,360,{kick:"Agreement",title:"1962 · ends 2061"},{k:a2.k,a:a2.a,kickCol:AG.mut});}},
    // a street cut open: a sink and its drain, the pipe under the road to a plant; membranes, then light; a glass of clear water
    {at:P.street,dis:0.8,place:"pcStreet",keys:[[P.street,960,540,1.0],[P.street+0.1,980,530,1.03]],push:0,draw:(x,tt)=>{
      pc_streetLife(x,tt,{used:ag_sine((tt-P.used+0.3)/2.4),mem:ag_sine((tt-P.until+0.5)/1.4),clean:ag_sine((tt-P.until-0.5)/1.2),glass:ag_sine((tt-P.pure+0.1)/1.4)});
      ag_pill(x,640,800,"used water",{a:ag_in(tt,P.used-0.1,0.5)});
      ag_pill(x,1140,180,"fine membranes",{a:ag_in(tt,P.until-0.4,0.5)});ag_pill(x,1410,104,"ultraviolet light",{a:ag_in(tt,P.until+0.4,0.5)});
      ag_pill(x,1704,640,"pure enough to drink",{a:ag_in(tt,P.pure+0.2,0.5)});}},
    // a kitchen of the time: she holds up a glass of it and looks at it; her neighbour looks too
    {at:P.kitchen,dis:0.7,place:"pcKitchen",keys:[[P.kitchen,960,540,1.02],[P.kitchen+0.1,940,540,1.06]],d:9,push:0,draw:(x,tt)=>pc_kitchen(x,tt,P)},
    // 1998 to 2000: the test plant, dry; the study begins; before any water, the list of how it will be judged; then the plant runs
    {at:P.plant,dis:0.9,place:"pcPlant",keys:[[P.plant,980,540,1.0],[P.plant+0.1,960,540,1.03]],push:0,draw:(x,tt)=>pc_plantShot(x,tt,P)},
    // 2000 to 2002: the panel at its long table; results arrive, one by one, and are ticked; the years turn; their report
    {at:P.panel,dis:0.9,place:"pcPanel",keys:[[P.panel,960,540,1.0],[P.panel+0.1,960,520,1.03]],push:0,draw:(x,tt)=>pc_panelShot(x,tt,P)},
    // the parade, at dusk: a wave of plain bottles rises across the crowd, and they drink; the stadium holds a moment
    {at:P.parade,dis:1.0,place:"pcStadium",keys:[[P.parade,960,560,1.08],[P.parade+0.1,960,540,1.0]],d:7,push:0,draw:(x,tt)=>{
      pc_crowd(x,tt,ag_sine((tt-P.raise+0.4)/2.6),ag_sine((tt-P.gulp+0.1)/1.6),1);}},
    // since 2003: a reservoir among trees, clear water flowing into it
    {at:P.flows,dis:1.0,place:"pcReservoir",keys:[[P.flows,960,540,1.0],[P.flows+0.1,900,560,1.05]],push:0,draw:(x,tt)=>pc_reservoirLife(x,tt,1)},
    // today: a lab bench and its sample bottles; about 300 measures, and experts from outside every year
    {at:P.today,dis:0.8,place:"pcBench",keys:[[P.today,960,540,1.0],[P.today+0.1,960,540,1.03]],push:0,draw:(x,tt)=>{pc_benchBottles(x,tt,1);
      ag_pill(x,1580,200,"about 300 measures",{a:ag_in(tt,P.three-0.2,0.5)});ag_pill(x,1480,296,"audited every year · experts from outside",{a:ag_in(tt,P.outside-0.2,0.5)});}},
    // the university: Jun, the agent, the count it's about to change; what it brings back, and whether to trust it; the check, first
    {at:P.uni,dis:1.0,place:"lab",keys:[[P.uni,960,540,1.0]],push:0,draw:(x,tt)=>pc_trustRoom(x,tt,P)}]);
  pc_tags(ctx,S,t,[[0.6,"Singapore · late 1990s"],[P.plant,"Singapore · 1998 to 2000",0.9],[P.panel,"The panel · 2000 to 2002",0.9],
    [P.parade,"National Day Parade · 9 August 2002",1.0],[P.flows,"Since 2003",1.0],[P.today,"Today",0.8],[P.uni,"The university",1.0],[P.title,null,0.6]]);
  ag_title(ctx,S,t,P.title,PC_TITLE,null,PC_LINE);});

// the kitchen: she holds the glass up before her and looks at it; her neighbour, beside her, looks at it too; the question, then why it matters
function pc_kitchen(x,tt,P){
  ag_person(x,PC_W2,1240,610,1.0,{t:tt+0.8,flip:true,gaze:[3.4,3.4],nod:0.04*ag_io(tt,P.trust,P.trust+1.6,0.5)});
  ag_person(x,PC_W1,720,600,1.02,{t:tt,pose:"hold",gaze:[1.6,3.6],holdBack:(c,h)=>pc_glass(c,h.near[0]+50,h.near[1]-26,1.3,{fill:0.8,noShadow:true})});
  const q1=pc_pop(tt,P.drink-0.3,null),q2=pc_pop(tt,P.trust-0.2,null),q3=pc_pop(tt,P.worthy-0.2,null);
  ag_textCard(x,90,150,470,{title:"Would you drink it?"},{k:q1.k,a:q1.a});
  ag_textCard(x,90,282,470,{title:"No trust, no use"},{k:q2.k,a:q2.a});
  ag_textCard(x,90,414,470,{title:"Trustworthy, first"},{k:q3.k,a:q3.a});}

// the plant: the study's card; the list unrolls before any water; the bottle stands empty, its line already on it; when the list is
// whole, water runs through the plant, and from the tap into the bottle, up to its line
function pc_plantShot(x,tt,P){const run=ag_sine((tt-P.stds+0.6)/1.6),fill=ag_sine((tt-P.stds)/1.8),pour=ag_io(tt,P.stds-0.2,P.stds+1.8,0.3);
  pc_plantLife(x,tt,run,1);
  // the tap off the hall's column, and its stream into the bottle while it fills
  const [,,tx1,ty1]=PC_TAP;pc_tap(x);
  const bh=230,by=790,lvl=bh*0.66*0.78*fill;
  if(pour>0.01){x.save();x.strokeStyle=rgba(pc_shade(PC_SEA,0.8),0.85*pour);x.lineWidth=5;x.lineCap="round";x.beginPath();x.moveTo(tx1,ty1+6);x.lineTo(tx1,by-Math.max(lvl,4));x.stroke();x.restore();}
  pc_bottle(x,tx1,by,bh,{fill,line:0.78});
  const sa=pc_pop(tt,P.plant+0.9,P.write-0.6);ag_textCard(x,120,170,560,{kick:"1998",title:"A study begins",sub:"the water agency and the environment ministry"},{k:sa.k,a:sa.a,kickCol:AG.mut});
  pc_list(x,120,170,620,clamp((tt-P.write+0.1)/2.0,0,1),{k:[ag_in(tt,P.phys-0.2,0.4),ag_in(tt,P.chem-0.2,0.4),ag_in(tt,P.micro-0.2,0.4),ag_in(tt,P.world-0.2,0.5)]});}

// the panel: five experts at the long table, looking up at the board; result sheets pinned one by one, each ticked; the years turn;
// their report, with a green tick
const PC_SHEETS=[[660,166],[830,160],[1000,168],[1170,162],[1340,166]];
function pc_panelShot(x,tt,P){const t0=P.results-0.6,step=(P.july-0.8-t0)/PC_SHEETS.length,rep=pc_pop(tt,P.well-0.5,null),ru=pc_pop(tt,P.rules-0.3,null);
  ag_textCard(x,280,174,320,{kick:"The rules",title:"190 measures"},{k:ru.k,a:ru.a,kickCol:AG.mut});
  PC_SHEETS.forEach(([sx,sy],i)=>{const ti=t0+i*step,a=ag_in(tt,ti,0.4);if(a<=0.01)return;const k=clamp(ag_spr(tt,ti,0.7),0,1.2);x.save();x.globalAlpha*=a;
    ag_about(x,sx+70,sy+90,lerp(0.7,1,k));ag_box(x,sx,sy,140,180,8,{});x.fillStyle="rgba(90,92,96,0.32)";for(let j=0;j<6;j++)x.fillRect(sx+22,sy+30+j*20,j===5?54:96,4);
    ag_tick(x,sx+100,sy+150,26,rgba(AG.green,ag_in(tt,ti+0.5,0.3)),4);x.fillStyle="#7A7268";x.beginPath();x.arc(sx+70,sy+12,6,0,TAU);x.fill();x.restore();});
  pc_year(x,1696,176,170,clamp((tt-P.years+0.3)/2.4,0,1)*2,{a:ag_in(tt,P.years-0.6,0.5)});
  pc_panelPeople(x,tt,{gaze:[1,-1.4],nod:i=>0.05*ag_io(tt,P.well+0.2+i*0.12,P.well+1.4+i*0.12,0.3)});pc_panelTable(x);
  ag_textCard(x,640,196,760,{kick:"July 2002",title:"Well within the standards"},{k:rep.k,a:rep.a,kickCol:AG.mut,edge:AG.green,icon:rep.a>0.6?"tick":null});}

// the university, today: Jun at his desk; the agent, dim; the census-day count; what the agent brings back, and "Trust it?"; then it
// goes back, the check comes first, the agent works, and what it brings back takes a green tick
const PC_R1=[1150,470,170,84];
function pc_trustRoom(x,tt,P){const [rx,ry,R,r]=PC_R1,wake=ag_in(tt,P.starts-0.2,0.8),ans=[1380,250,420],gone=1-ag_in(tt,P.title-0.6,0.5);
  pc_agent(x,tt,rx,ry,R,r,{core:lerp(0.25,1,wake)+0.2*ag_io(tt,P.change-0.2,P.brings+0.6,0.5)*(1-wake),think:0.6*ag_io(tt,P.work-0.6,P.use+0.2,0.4),pulse:pc_round(tt,P.starts,1.5)});
  pc_jun(x,tt,{gaze:tt<P.census+0.4?[2.6,-0.8]:tt<P.brings?[2.2,-1.6]:[3.4,-1.4],nod:0.06*ag_io(tt,P.use-0.1,P.use+0.7,0.3),smile:0.2*ag_in(tt,P.use,0.8)});
  ag_roomLight(x,1);
  const cc=pc_pop(tt,P.census-0.3,null);ag_textCard(x,500,190,460,{kick:"Census-day count",title:"18,412 students",sub:"reported to the government"},{k:cc.k,a:cc.a*gone,kickCol:AG.mut});
  // what it brings back: out of the sphere, with "Trust it?"; at "Decide the check" it goes back in
  const out1=clamp((tt-P.brings+0.2)/1.0,0,1),back=clamp((tt-P.back)/0.8,0,1),out2=clamp((tt-P.work+0.3)/1.0,0,1),h=ag_textCard(x,0,0,ans[2],{kick:"From the agent",title:"A new count"},{measure:1}).h;
  const cx=ans[0]+ans[2]/2,cy=ans[1]+h/2,u=out2>0?out2:out1*(1-back),ok=out2>0;
  if(u>0.01){const F=pc_fly(u,rx,ry,rx+160,ry-220,cx,cy);
    pc_flown(x,F,cx,cy,()=>ag_textCard(x,ans[0],ans[1],ans[2],{kick:"From the agent",title:"A new count"},{a:clamp(u*3,0,1)*gone,edge:ok?AG.green:null,edgeA:ag_in(tt,P.use-0.3,0.4),icon:ok&&tt>P.use-0.3?"tick":null}),{w:ans[2],h,a:clamp(u*3,0,1)});}
  ag_pill(x,cx,ans[1]+h+46,"Trust it?",{col:AG.amber,icon:"warn",a:ag_in(tt,P.brings+0.7,0.4)*(1-ag_in(tt,P.back-0.2,0.4))});
  // the check, decided first: it comes in from Jun's side before the agent starts
  const ck=ag_eo(clamp((tt-P.check+0.3)/0.9,0,1));if(ck>0.01)ag_textCard(x,lerp(380,500,ck),430,460,{kick:"The check",title:"Decided first"},{a:ck*gone,edge:AG.blue,kickCol:AG.blue});}

/* ---------------------------------------------------------------- the lab chapters' shared pieces */
// a chapter's start in the film: people and the agent are drawn on the film's clock, so they breathe and blink on across a cut
const pc_g0=sc=>{let s=0;for(const x of SCENES){if(x.id===sc.id)return s;s+=x.dur;}return s;};
// a row's words typed from t0 to t1, as pc_plan's o.k (0.15 is the label alone); pc_type2 in two parts, the first f of the words
const pc_type=(t,t0,t1)=>0.15+0.85*clamp((t-t0)/(t1-t0),0,1);
const pc_type2=(t,a0,a1,f,b0,b1)=>0.15+0.85*(t<b0?f*clamp((t-a0)/(a1-a0),0,1):f+(1-f)*clamp((t-b0)/(b1-b0),0,1));
// a soft blue ring round a lock, as something tries it
function pc_lockFlash(x,lx,ly,a){if(a<=0.01)return;x.save();x.strokeStyle=rgba(AG.blue,0.7*a);x.lineWidth=3;x.beginPath();x.arc(lx,ly,24+14*a,0,TAU);x.stroke();x.restore();}

/* ---------------------------------------------------------------- 2 · The long way
   Once: Jun at his desk, the agent, and its three tools on the wall. Its plan has a goal and nothing else: the Tools row stays empty,
   in amber. It reaches past the tools to the web, and pages come back for 40 minutes, while Docs would have answered in one call;
   what it brings back is another university's rule. Jun catches it, and the work goes round again. The arm folds away; what was
   missing stays lit, and the point goes on the wall. */
const PC_R2=[1200,650,150,76],PC_WEB=[1730,160,58],PC_LONG=[1380,650,1450,620,1440,250,1660,168];
scene("long",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({g0:pc_g0(sc),goal:wAt(sc,"once","goal"),check:wAt(sc,"once","check"),
    plan:wAt(sc,"knew","plan"),use:wAt(sc,"knew","use"),searched:wAt(sc,"knew","searched"),web:wAt(sc,"knew","web"),pages:c.pages,
    n38:wAt(sc,"pages","thirty-eight"),forty:wAt(sc,"pages","forty"),docs:c.docs,call:wAt(sc,"docs","one call"),other:c.other,
    brought:wAt(sc,"other","brought"),another:wAt(sc,"other","another"),caught:wAt(sc,"caught","caught"),again:wAt(sc,"caught","again"),
    broken:c.broken,nobody:wAt(sc,"broken","nobody"),waste:wAt(sc,"waste","waste")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",later:true,keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_longRoom(x,tt,P)}]);
  pc_tags(ctx,S,t,[[0.4,"Once"]]);});

function pc_longRoom(x,tt,P){const [rx,ry,R,r]=PC_R2,G=P.g0+tt;
  // the arm out to the web: it reaches as "searched" is said, holds while the pages come, and folds away at "broken"
  const reach=ag_sine((tt-P.searched+0.1)/1.3)*(1-ag_sine((tt-P.broken-0.2)/1.5)),flow0=P.searched+1.2,flow1=P.forty+0.4;
  pc_agent(x,G,rx,ry,R,r,{think:0.7*ag_io(tt,P.searched,P.forty+0.6,0.5),pulse:pc_round(tt,P.again,1.6)});
  ag_reach(x,PC_LONG,reach);
  // pages of the web coming back along it, three at a time
  const pf=ag_io(tt,flow0,flow1,0.3)*clamp((reach-0.9)*10,0,1);
  if(pf>0.01)for(let j=0;j<3;j++){const v=(((tt-flow0)/1.4+j/3)%1+1)%1,q=ag_bz(PC_LONG,1-v);pc_webPage(x,q[0],q[1]-20,0.8,pf*clamp(Math.min(v*5,(1-v)*5),0,1));}
  pc_jun(x,G,{gaze:tt<P.searched?[2.6,-1.2]:tt<P.brought?[3.4,-2.2]:tt<P.broken?[2.6,0]:[2.8,-1.2]});
  ag_roomLight(x,1);
  pc_steps(x,0,{a:ag_in(tt,P.plan-0.3,0.6)});
  // the web, top right; the tools on the wall, Docs lit while it's named, all three as "what was there" is said
  pc_globe(x,PC_WEB[0],PC_WEB[1],PC_WEB[2],ag_in(tt,P.web-0.6,0.5)*(1-ag_in(tt,P.broken+0.8,0.6)));
  const there=0.55*ag_io(tt,P.nobody-0.2,P.waste+2.5,0.5),docs=ag_io(tt,P.docs-0.2,P.brought,0.4);
  for(let i=0;i<3;i++)pc_tool(x,i,{glow:i===2?Math.max(docs,there):there});
  // one call: a dotted line from the ring to Docs
  const dc=ag_io(tt,P.call-0.5,P.brought,0.4);if(dc>0.01){const u=ag_sine((tt-P.call+0.5)/0.7);x.save();x.globalAlpha*=dc;x.strokeStyle=rgba(AG.blue,0.85);
    x.lineWidth=4;x.setLineDash([2,12]);x.lineCap="round";x.beginPath();x.moveTo(1352,700);x.lineTo(lerp(1352,1534,u),lerp(700,690,u));x.stroke();x.restore();
    ag_pill(x,1446,758,"1 call",{col:AG.blue,a:dc*ag_in(tt,P.call-0.1,0.4)});}
  // the plan: a goal, and nothing else; the Tools row stays empty, in amber
  const pk=pc_pop(tt,P.goal-0.4,null);
  pc_plan(x,480,150,640,[{k:"Goal",v:"Check the count against the census rules"},{k:"Tools",v:""}],{ka:pk.k,a:pk.a,
    lab:[ag_in(tt,P.goal-0.2,0.4),ag_in(tt,P.use-0.2,0.4)],k:[tt<P.goal-0.2?0:pc_type(tt,P.check-0.1,P.check+2.0),0],amber:[false,true],
    hi:[0,0.9*ag_io(tt,P.nobody-0.3,P.waste+2.5,0.5)],hiCol:AG.amber,blank:1});
  // 38 pages, 40 minutes
  const nA=ag_io(tt,flow0-0.2,P.other-0.7,0.4),n=Math.round(38*clamp((tt-flow0)/(P.n38-flow0),0,1));
  pc_num(x,500,440,330,"The web",n===1?"1 page":n+" pages",{k:clamp(ag_spr(tt,flow0-0.2,0.8),0,1.2),a:nA});
  const mins=40*clamp((tt-flow0)/(P.forty+0.3-flow0),0,1);
  pc_clock(x,500,590,330,mins,Math.round(mins)+" min",{k:clamp(ag_spr(tt,P.pages-0.2,0.8),0,1.2),a:ag_io(tt,P.pages-0.2,P.other-0.7,0.4)});
  // what it brought back, out of the sphere: another university's rule; caught in review, it goes back, and round again
  const CR={kick:"Census rules",title:"Another university’s"},cw=420,chh=ag_textCard(x,0,0,cw,CR,{measure:1}).h,ccx=500+cw/2,ccy=440+chh/2;
  const out=clamp((tt-P.brought+0.2)/1.0,0,1)*(1-clamp((tt-P.again+0.1)/0.8,0,1));
  if(out>0.01){const F=pc_fly(out,rx,ry,rx-240,ry-260,ccx,ccy);
    pc_flown(x,F,ccx,ccy,()=>ag_textCard(x,500,440,cw,CR,{a:clamp(out*3,0,1),kickCol:AG.orange,edge:AG.amber,edgeA:0.85*ag_in(tt,P.another-0.2,0.4)}),{w:cw,h:chh,a:clamp(out*3,0,1)});}
  ag_pill(x,710,640,"Not our rule",{col:AG.amber,icon:"warn",a:ag_io(tt,P.caught-0.1,P.again,0.35)});
  ag_verdict(x,rx,ry-R-46,"Again","loop",ag_io(tt,P.again-0.1,P.broken+0.6,0.4));
  // the point, on the wall
  pc_wall(x,["A plan that doesn’t say","what the agent may use"],500,520,{size:40,align:"left",a:ag_in(tt,P.waste-0.1,0.7)});}

/* ---------------------------------------------------------------- 3 · Plan
   Clara, from Planning, stands by Jun's desk and asks for the count by level; she goes, and her request becomes the page Jun writes
   before the agent starts, a row as each is said: the goal, what to read, the tools, where it may write, what it must never do, a
   limit. Two rows wait, closed, for the checks: the next chapter goes on in the same shot. */
const PC_PAGE=[470,140,900],PC_R3=[1660,760,110,56];
const PC_ROWS=[{k:"Goal",v:"Students on census day, by level"},
  {k:"Read",v:"Glossary: student, census day, level of study; the census-day count it builds on"},
  {k:"Tools",v:"Catalog, Query, Docs, read only",icon:"lock"},{k:"Write",v:"Own branch and sandbox only"},
  {k:"Never",v:"Names, student IDs, writes to production"},
  {k:"Checks",v:"Levels add up to 18,412; every student has one level"},
  {k:"Tests",v:"Written first, approved by Jun; only a person changes them"},{k:"Limit",v:"10 rounds, then report"}];
const pc_page=(x,o)=>pc_plan(x,PC_PAGE[0],PC_PAGE[1],PC_PAGE[2],PC_ROWS,Object.assign({title:"Census-day count by level"},o));
scene("plan",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({g0:pc_g0(sc),asks:wAt(sc,"asks","asks"),page:c.page,one:wAt(sc,"page","one page"),
    goal:c.goal,students:wAt(sc,"goal","students"),reads:c.reads,glossary:wAt(sc,"reads","glossary's"),builds:wAt(sc,"reads","builds"),
    tools:c.tools,catalog:wAt(sc,"tools","Catalog"),ronly:wAt(sc,"tools","read only"),writes:c.writes,only:wAt(sc,"writes","only"),
    never:c.never,names:wAt(sc,"never","names"),prod:wAt(sc,"never","production"),limit:c.limit,ten:wAt(sc,"limit","ten"),reports:wAt(sc,"limit","reports")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_planRoom(x,tt,P)}]);});

function pc_planRoom(x,tt,P){const G=P.g0+tt,[rx,ry,R,r]=PC_R3,cl=1-ag_in(tt,P.page-0.2,0.9);
  // the agent, dim, waiting for the page: it comes once Clara has gone
  pc_agent(x,G,rx,ry,R,r,{core:0.25,a:ag_in(tt,P.page+0.8,0.8)});
  if(cl>0.004)withA(x,cl,()=>ag_person(x,"clara",1480,640,0.92,{t:G+1.3,flip:true,gaze:[3,0.2],smile:0.3}));
  pc_jun(x,G,{gaze:tt<P.page?[3.4,-0.4]:[2.6,-0.6]});
  ag_roomLight(x,1);
  pc_steps(x,0);
  // Clara's request, by her; it goes as the page comes
  const q=pc_pop(tt,P.asks-0.3,P.page+0.1);
  ag_textCard(x,640,210,600,{kick:"Planning",title:"Census-day count by level",sub:"for the government’s report"},{k:q.k,a:q.a,kickCol:AG.mut,tail:{side:"right",at:0.75,px:1350,py:440}});
  // the page: each row's label as its line starts, its words as they're said, the row being written in a soft light
  const pg=pc_pop(tt,P.one-0.2,null),RT=[[P.goal,P.students-0.1,P.students+2.2],[P.reads,P.glossary-0.1,P.builds+0.6],[P.tools,P.catalog-0.1,P.ronly+0.6],
    [P.writes,P.only-0.1,P.only+2.0],[P.never,P.names-0.3,P.prod+0.5],null,null,[P.limit,P.ten-0.1,P.reports+0.3]];
  pc_page(x,{ka:pg.k,a:pg.a,grow:RT.map(T=>T?clamp((tt-T[0]+0.5)/0.7,0,1):0),lab:RT.map(T=>T?ag_in(tt,T[0]-0.1,0.4):0),k:RT.map(T=>T?(tt<T[0]-0.1?0:pc_type(tt,T[1],T[2])):0),
    hi:RT.map(T=>T?0.9*ag_io(tt,T[0]-0.1,T[2]+0.6,0.4):0),hiCol:AG_OAK.dark});}

/* ---------------------------------------------------------------- 4 · Define the check
   The same shot: the step moves on, and the Checks row opens on the page. Nobody knows the answer yet: beside the page, the count
   by level with a question mark for each level and only its total known, 18,412. What must be true of any right answer comes in as
   it's said: the + and = that make the levels add up to the total, one level each, the word as the glossary (the Read row) defines
   it; neither says how many. The count goes, and the agent writes the two checks as tests: they fly up beside the page, Jun approves
   them, and they lock, so only a person changes them; the agent's arm tries for one and stops. The tests go, and two rules for the
   agent come in their place: what everyone uses can be wrong, and it says so, with its evidence; where nobody can say what's right,
   it brings the options, for a person to choose. Then Singapore's list, whole before the plant made any water: none of its measures
   said what the results would be, only what the water had to meet (the bottle's mark). */
const PC_T1=[1410,150,450],PC_T2=[1410,370,450],PC_TT=["Levels add up to 18,412","Every student has exactly one level"];
// the two rules, in the tests' place: what the agent does when the data disagrees, and when nobody can say what's right
const PC_RULES=[{kick:"What everyone uses",title:"Can be wrong",sub:"sometimes for years"},{kick:"If nobody can say",title:"The options",sub:"for a person to choose"}];
scene("define",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({g0:pc_g0(sc),matters:wAt(sc,"matters","matters"),unknown:c.unknown,
    nobody:wAt(sc,"unknown","nobody"),must:c.must,right:wAt(sc,"must","right answer"),levels:wAt(sc,"adds","levels"),add:wAt(sc,"adds","add up"),
    count:wAt(sc,"adds","count already"),every:wAt(sc,"one","every"),exactly:wAt(sc,"one","exactly"),glossary:wAt(sc,"one","glossary"),
    neither:c.neither,many:wAt(sc,"neither","how many"),relate:wAt(sc,"neither","parts relate"),mean:wAt(sc,"neither","words mean"),tests:c.tests,writes:wAt(sc,"tests","writes"),approves:wAt(sc,"tests","approves"),
    onlyw:wAt(sc,"only","only"),person:wAt(sc,"only","person"),moving:wAt(sc,"only","moving"),wrong:c.wrong,years:wAt(sc,"wrong","years"),
    says:wAt(sc,"wrong","says so"),options:c.options,brings:wAt(sc,"options","brings"),choose:wAt(sc,"options","choose"),
    like:c.like,written:wAt(sc,"like","written"),meet:c.meet,had:wAt(sc,"meet","had to meet")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_defineRoom(x,tt,P)},
    {at:P.like-0.3,dis:0.9,place:"pcPlant",keys:[[P.like-0.3,960,540,1.03],[P.like-0.2,980,540,1.0]],push:0,draw:(x,tt)=>pc_plantAgain(x,tt,P)}]);
  pc_tags(ctx,S,t,[[P.like-0.3,"Singapore · 1998 to 2000"]]);});

function pc_defineRoom(x,tt,P){const G=P.g0+tt,[rx,ry,R,r]=PC_R3,wake=ag_in(tt,P.writes-0.4,0.6);
  // the agent: awake as it writes the tests, and thinking again while its two rules are said
  pc_agent(x,G,rx,ry,R,r,{core:lerp(0.25,1,wake),think:Math.max(0.6*ag_io(tt,P.writes-0.2,P.approves,0.4),0.5*ag_io(tt,P.says-0.3,P.like-0.6,0.5))});
  // its arm tries for the second test as "moving the mark" is said, and stops short of it
  const tr=ag_sine((tt-P.moving+0.5)/0.7)*(1-ag_sine((tt-P.moving-0.5)/0.8));if(tr>0.002)ag_reach(x,[1700,650,1712,616,1730,592,1752,552],tr*0.78);
  pc_jun(x,G,{gaze:tt<P.writes?[2.6,-0.8]:tt<P.person?[3.6,-1.6]:[3.2,-1.2],nod:0.06*ag_io(tt,P.approves-0.1,P.approves+0.7,0.3)});
  ag_roomLight(x,1);
  pc_steps(x,ag_sine((tt-P.matters+0.2)/0.9));
  // the page: Checks opens and is written as the two checks are said; the Read row lit as the glossary is named; then Tests, in two parts
  pc_page(x,{grow:[1,1,1,1,1,clamp((tt-P.matters+0.3)/0.9,0,1),clamp((tt-P.tests+0.3)/0.9,0,1),1],
    k:[1,1,1,1,1,pc_type2(tt,P.levels-0.1,P.count-0.2,24/52,P.every-0.1,P.every+1.5),pc_type2(tt,P.writes-0.1,P.approves+0.5,31/58,P.onlyw-0.1,P.person+1.3),1],
    lab:[1,1,1,1,1,ag_in(tt,P.matters,0.4),ag_in(tt,P.tests,0.4),1],
    hi:[0,0.9*Math.max(ag_io(tt,P.glossary-0.3,P.glossary+1.6,0.4),ag_io(tt,P.mean-0.3,P.mean+1.4,0.4)),0,0,0,0.9*ag_io(tt,P.matters,P.tests-0.2,0.4),0.9*ag_io(tt,P.tests,P.wrong-0.4,0.4),0],hiCol:AG.blue});
  // the count nobody knows yet, beside the page: a question mark for each level, its total known; the + and = come in as "add up" is
  // said, "one level each" under it; the question marks pulse as neither check says how many; then the + and = as "how the parts
  // relate" is said, and the Read row, the glossary's words, as "what the words mean"; it goes before the tests come
  const uk=pc_pop(tt,P.nobody-0.3,P.tests-0.45);
  pc_unknown(x,PC_T1[0],PC_T1[1],PC_T1[2],{k:uk.k,a:uk.a,rel:ag_in(tt,P.add-0.2,0.6),one:ag_in(tt,P.exactly-0.1,0.5),
    q:Math.max(ag_io(tt,P.nobody,P.nobody+0.9,0.35),ag_io(tt,P.many-0.2,P.many+1.0,0.35)),relHi:ag_io(tt,P.relate-0.2,P.relate+1.0,0.35),
    oneHi:ag_io(tt,P.mean-0.2,P.mean+1.0,0.35)});
  // the two tests, out of the sphere and up beside the page; approved by Jun; locked; they go as the agent's rules are said
  const tg=1-ag_in(tt,P.wrong-0.3,0.45);
  [PC_T1,PC_T2].forEach(([tx,ty,tw],i)=>{const u=clamp((tt-P.writes-0.35*i+0.1)/1.0,0,1);if(u<=0.01||tg<=0.01)return;const h=pc_test(x,tx,ty,tw,PC_TT[i],{lock:0,a:0}).h,cx=tx+tw/2,cy=ty+h/2;
    const F=pc_fly(u,rx,ry,rx-80,ry-260,cx,cy),lk=clamp((tt-P.person+0.2-0.15*i)/0.6,0,1);
    x.save();x.globalAlpha*=tg;
    pc_flown(x,F,cx,cy,()=>pc_test(x,tx,ty,tw,PC_TT[i],{a:clamp(u*3,0,1),lock:lk,ok:clamp((tt-P.approves+0.1-0.2*i)/1.0,0,1),okLeft:1}),{w:tw,h,a:clamp(u*3,0,1)});
    if(i===1)pc_lockFlash(x,tx+tw-40,ty+36,ag_io(tt,P.moving+0.1,P.moving+0.8,0.25));x.restore();});
  // the agent's two rules, in the tests' place: the first, amber, as what everyone uses can be wrong, its pill as it says so; the
  // second, violet, as it brings the options
  const [rx0,ry0,rw]=PC_T1,h1=ag_textCard(x,0,0,rw,PC_RULES[0],{measure:1}).h,r1=pc_pop(tt,P.wrong+0.15,null),r2=pc_pop(tt,P.options-0.1,null);
  if(r1.a>0.01){ag_textCard(x,rx0,ry0,rw,{kick:PC_RULES[0].kick,title:PC_RULES[0].title,sub:" "},{k:r1.k,a:r1.a,kickCol:AG.amber,edge:AG.amber,edgeA:0.85});
    ag_T(x,PC_RULES[0].sub,rx0+28,ry0+148,{w:500,size:28,col:AG.mut,a:r1.a*ag_in(tt,P.years-0.3,0.5)});}
  ag_pill(x,rx0+rw/2,ry0+h1+42,"Says so, with evidence",{col:AG.amber,icon:"warn",a:ag_in(tt,P.says-0.1,0.4)});
  const y2=ry0+h1+96;
  if(r2.a>0.01){ag_textCard(x,rx0,y2,rw,{kick:PC_RULES[1].kick,title:PC_RULES[1].title,sub:" "},{k:r2.k,a:r2.a,kickCol:AG.violet,edge:AG.violet,edgeA:0.6});
    ag_T(x,PC_RULES[1].sub,rx0+28,y2+148,{w:500,size:28,col:AG.green,a:r2.a*ag_in(tt,P.choose-0.4,0.5)});}}
// Singapore again: the plant still dry, its bottle empty by the tap, the list of how it will be judged already whole; as "had to meet"
// is said, the bottle's mark lights, and its pill: each measure set what the water had to meet, not what it would show
function pc_plantAgain(x,tt,P){pc_tap(x);const m=ag_io(tt,P.had-0.2,P.had+2.4,0.5);pc_bottle(x,PC_TAP[2],790,230,{fill:0,line:0.78,mark:m});pc_list(x,120,170,620,1,{});
  ag_pill(x,430,624,"written before any water",{a:ag_in(tt,P.written-0.1,0.5)});
  ag_pill(x,430,704,"what it had to meet",{a:ag_in(tt,P.had-0.1,0.5)});}

/* ---------------------------------------------------------------- 5 · Do
   The agent at work, in its sandbox, with the three tools the plan gave it: three words from Docs, the tables from Catalog, the count
   by level built in the sandbox. The first run fails the first test, 28 short; Query finds 28 students with no level, exchange
   students, and, asked of every census day since 2021, the same each year: every split by level since was short. It doesn't drop them
   or touch the test: it asks Mei, with its evidence and two options that both add up, and she decides from the government's list; the
   years before go to Planning, for people to look into. Then the third level goes in, both tests pass, the description is written
   from the glossary, and the pull request opens with its evidence. */
const PC_R5=[1230,400,150,76],PC_SB=[780,760,600],PC_CX=[570,740,420],PC_DT=[[90,160,450],[90,420,450]];
const PC_QEV=[{kick:"Query",title:"census day, no level",col:AG.blue},{kick:"Result",title:"28 students",col:AG.orange}];
scene("do",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({g0:pc_g0(sc),words:wAt(sc,"builds","three words"),tables:wAt(sc,"builds","tables"),
    count:wAt(sc,"builds","count by level"),red:c.red,fails:wAt(sc,"red","fails"),n384:wAt(sc,"red","eighteen"),short:c.short,query:wAt(sc,"looks","Query"),
    n28:wAt(sc,"looks","twenty-eight"),exchange:c.exchange,since:c.since,n2021:wAt(sc,"since","twenty twenty-one"),split:c.split,
    shortw:wAt(sc,"split","short"),doesnt:c.doesnt,touch:wAt(sc,"doesnt","touch"),meaning:c.meaning,meis:wAt(sc,"meaning","Mei's"),
    asks:c.asks,two:wAt(sc,"asks","two options"),options:c.options,home:wAt(sc,"options","or the level"),
    mei:c.mei,list:wAt(sc,"mei","government's"),nonaward:wAt(sc,"mei","non-award"),own:wAt(sc,"mei","own"),
    years:c.years,planning:wAt(sc,"years","Planning"),look:wAt(sc,"years","look into"),
    again:c.again,adds:wAt(sc,"again","adds"),runs:wAt(sc,"again","runs"),n412:wAt(sc,"again","eighteen"),every:wAt(sc,"again","every"),pass:c.pass,
    descr:wAt(sc,"pr","description"),opens:wAt(sc,"pr","pull request"),evidence:c.evidence,claim:wAt(sc,"evidence","claim")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_doRoom(x,tt,P,0)},
    {at:P.asks-0.4,later:true,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_meiRoom(x,tt,P)},
    {at:P.again-0.4,later:true,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_doRoom(x,tt,P,1)}]);
  // the steps stay put over the shots, while one moment in the lab gives way to the next
  pc_steps(ctx,2);});

function pc_doRoom(x,tt,P,part){const G=P.g0+tt,[rx,ry,R,r]=PC_R5,[sx,sy,sw]=PC_SB,after=part===1,keep=after?1-ag_in(tt,P.opens-0.5,0.5):1;
  // the agent, at work; its arms out to each tool in turn (Catalog, Query, Docs), data coming back along them
  const RT=after?[null,null,[P.descr-0.4,P.opens-0.3]]:[[P.tables-0.3,P.count+0.4],[P.query-0.4,P.shortw-0.2],[P.words-0.4,P.tables-0.2]],
    U=RT.map(T=>T?ag_sine((tt-T[0])/0.9)*(1-ag_sine((tt-T[1])/0.9)):0);
  pc_agent(x,G,rx,ry,R,r,{think:after?0.6*ag_io(tt,P.adds-0.3,P.pass,0.4):0.6*ag_io(tt,P.words-0.4,P.touch+0.4,0.4)});
  U.forEach((u,i)=>{if(u>0.002)ag_reach(x,pc_arm(i,rx,ry,R),u,{data:RT[i]?clamp((tt-RT[i][0]-0.9)/1.4,0,1):0});});
  ag_sandbox(x,sx,sy,sw,{depth:110,a:keep});
  ag_roomLight(x,1);
  for(let i=0;i<3;i++)pc_tool(x,i,{touch:clamp((U[i]-0.85)/0.15,0,1)});
  if(!after){
    // three words from Docs, in orange: data brought back
    ["student","census day","level of study"].forEach((s,i)=>ag_pill(x,1310,612+i*64,s,{col:AG.orange,a:ag_io(tt,P.words+0.6+0.3*i,P.count+0.6,0.35)}));
    // the query's answer, at the top: 28 students with no level; exchange students
    const qa=ag_io(tt,P.n28-0.3,P.since-0.55,0.35),qk=clamp(ag_spr(tt,P.n28-0.3,0.8),0,1.2);
    if(qa>0.01){ag_textCard(x,560,170,500,{kick:"Query · census day",title:"28 students, no level",sub:" "},{k:qk,a:qa,kickCol:AG.blue,edge:AG.orange});
      ag_T(x,"exchange students, single units",560+28,170+148,{w:500,size:28,col:AG.mut,a:qa*ag_in(tt,P.exchange-0.1,0.5)});}
    // then every census day since 2021, in its place: no level, every year, a mark for each as it's said; every split since, short
    const ya=pc_pop(tt,P.since-0.1,P.meaning-0.6);
    pc_years(x,560,170,500,{k:ya.k,a:ya.a,n:5*clamp((tt-P.n2021+0.1)/1.4,0,1),split:ag_in(tt,P.shortw-0.2,0.5)});
    // the question for Mei, with its query and the result clipped to it; it goes to her
    const qs=pc_pop(tt,P.meaning-0.2,null),off=ag_sine((tt-P.asks+1.3)/0.9);
    ag_evidence(x,560-640*off,160,500,{kick:"For Mei",title:"Which level are these 28?"},PC_QEV,{k:qs.k,a:qs.a*(1-off),kickCol:AG.mut,ew:240});}
  // the tests, on the left, locked; the first fails, 28 short, until the third level goes in; then both pass
  const s1=after?(tt>P.n412+0.3?"pass":"fail"):(tt>P.fails-0.1?"fail":"set"),s2=after&&tt>P.every+0.3?"pass":"set";
  const T1=pc_test(x,PC_DT[0][0],PC_DT[0][1],PC_DT[0][2],PC_TT[0],{state:s1,lock:1,note:s1==="fail"?"18,384 · 28 short":null,noteA:after?1:ag_in(tt,P.short-0.2,0.5),a:keep});
  pc_lockFlash(x,PC_DT[0][0]+PC_DT[0][2]-40,PC_DT[0][1]+36,after?0:ag_io(tt,P.touch-0.1,P.touch+0.7,0.25));
  pc_test(x,PC_DT[1][0],PC_DT[1][1],PC_DT[1][2],PC_TT[1],{state:s2,lock:1,a:keep});
  if(after)ag_verdict(x,PC_DT[1][0]+PC_DT[1][2]/2,660,"Both tests pass","pass",ag_in(tt,P.pass-0.1,0.4)*keep);
  // the count by level, in the sandbox: two levels, then the third; its total, orange, then green once it matches
  const k2=after?ag_sine((tt-P.adds+0.1)/1.0):0,cg=after&&tt>P.n412-0.2,cnt=after?1:ag_in(tt,P.count-0.1,0.5),[cx0,cbot,cw]=PC_CX,ch=288+50*ag_sine(k2);
  pc_count(x,cx0,cbot-ch,cw,{k:[cnt,after?1:ag_in(tt,P.count+0.3,0.5),k2],newA:after?ag_io(tt,P.adds,P.pass+0.6,0.4):0,total:cg?"18,412":"18,384",totalCol:cg?AG.green:AG.orange,
    totalA:after?(cg?ag_in(tt,P.n412-0.2,0.4):1-ag_in(tt,P.runs-0.2,0.4)):ag_in(tt,P.n384-0.2,0.4),edge:cg?AG.green:null,
    a:keep*(after?1:ag_in(tt,P.count-0.5,0.35)),ka:after?null:clamp(ag_spr(tt,P.count-0.5,0.8),0,1.2)});
  // its description, from the glossary; then the pull request, with what changed, why, and the evidence
  if(after){const dk=pc_pop(tt,P.descr-0.2,null);ag_textCard(x,cx0,190,cw,{kick:"Description",title:"Level of study",sub:"source: the glossary"},{k:dk.k,a:dk.a*keep,kickCol:AG.mut});
    const pk=pc_pop(tt,P.opens-0.3,null),op=clamp((tt-P.evidence+0.1)/(P.claim+0.4-P.evidence),0,1);
    ag_evidence(x,140,180,800,{kick:"Pull request",title:"Census-day count by level",sub:"from the agent’s branch"},PC_PREV,{k:pk.k,a:pk.a,open:op,kickCol:AG.mut});}}
const PC_PREV=[{kick:"What",title:"the count by level, with non-award"},{kick:"Why",title:"Clara’s request; Mei’s decision"},
  {kick:"Evidence",title:"both tests pass; the query and its result",col:AG.green}];

// Mei, in the lab: the question has come to her; she checks the government's list, and decides
function pc_govList(x,X,Y,w,o){o=o||{};const a=o.a==null?1:o.a,rows=["Undergraduate","Postgraduate","Non-award"],h=28+38+rows.length*48+20;if(a<=0.01)return;x.save();x.globalAlpha*=a;
  if(o.k!=null)ag_about(x,X+w/2,Y+h/2,lerp(0.5,1,o.k));ag_box(x,X,Y,w,h,22,{});
  ag_T(x,"THE GOVERNMENT’S LIST",X+28,Y+50,{w:700,size:28,ls:4,col:AG.mut});
  rows.forEach((s,i)=>{const yy=Y+104+i*48;if(i===2&&o.hi>0.01){x.save();x.globalAlpha*=o.hi;x.fillStyle=rgba(AG_OAK.dark,0.14);x.beginPath();ag_rect(x,X+14,yy-34,w-28,46,12);x.fill();x.restore();}
    ag_T(x,s,X+28,yy,{w:600,size:32});});
  x.restore();}
function pc_meiRoom(x,tt,P){const G=P.g0+tt;
  ag_person(x,"mei",520,640,0.95,{t:G+0.6,gaze:tt<P.list?[3.2,-1.2]:tt<P.own?[3.8,-0.6]:tt<P.years?[3.4,0.2]:[3.8,0.6],nod:0.05*ag_io(tt,P.own-0.1,P.own+0.8,0.3),smile:0.25*ag_in(tt,P.own,0.8)});
  ag_roomLight(x,1);
  // the question comes to her, with its evidence; the two options under it, both adding up, each as it's said
  const qs=ag_eo(clamp((tt-P.asks+0.4)/0.7,0,1));ag_evidence(x,lerp(680,800,qs),150,560,{kick:"For Mei",title:"Which level are these 28?"},PC_QEV,{a:qs,kickCol:AG.mut,ew:240});
  const op=pc_pop(tt,P.two-0.2,null);pc_options(x,800,376,560,{k:op.k,a:op.a,A:ag_in(tt,P.options-0.1,0.4),B:ag_in(tt,P.home-0.1,0.4),pick:ag_in(tt,P.nonaward-0.1,0.5)});
  // she checks the government's list, and decides: the first
  const lk=pc_pop(tt,P.list-0.3,null);pc_govList(x,1390,376,480,{k:lk.k,a:lk.a,hi:ag_in(tt,P.nonaward-0.1,0.5)});
  const dk=pc_pop(tt,P.own-0.3,null);ag_textCard(x,800,656,560,{kick:"Decided",title:"Non-award: a level of its own",sub:"Mei Tanaka, Registrar’s office"},{k:dk.k,a:dk.a,kickCol:AG.mut});
  // the years before, with the agent's evidence, to Planning: for people to look into
  const pl=pc_pop(tt,P.planning-0.3,null);ag_textCard(x,1390,626,480,{kick:"To Planning",title:"Splits since 2021",sub:"for people to look into"},{k:pl.k,a:pl.a,kickCol:AG.mut,edge:AG.amber,edgeA:0.7});}

/* ---------------------------------------------------------------- 6 · Check
   Jun reads the pull request against his page, not the agent's word: a tick by each row it meets; four of ten rounds; the change is
   his. Noor, the second person, approves it into production; the agent's own review is there for reference, and approves nothing. As
   with the panel in Singapore, the work is held to its checks by people who didn't do it. */
const PC_PR=[1410,150,450];
scene("check",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({g0:pc_g0(sc),plan:wAt(sc,"person","plan"),jun:c.jun,goal:wAt(sc,"jun","goal"),
    tools:wAt(sc,"jun","tools"),names:wAt(sc,"jun","names"),untouched:wAt(sc,"jun","untouched"),green:wAt(sc,"jun","green"),four:wAt(sc,"rounds","four"),
    his:c.his,answers:wAt(sc,"his","answers"),noor:c.noor,prod:wAt(sc,"noor","production"),approve:wAt(sc,"noor","approve"),
    review:wAt(sc,"never","review"),approves:wAt(sc,"never","approves"),outside:c.outside}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",later:true,keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_checkRoom(x,tt,P)},
    {at:P.noor-0.4,later:true,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_noorRoom(x,tt,P)},
    {at:P.outside-0.4,later:true,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_heldRoom(x,tt,P)}]);
  pc_steps(ctx,3);});

function pc_checkRoom(x,tt,P){const G=P.g0+tt,[rx,ry,R,r]=PC_R3,[px,py,pw]=PC_PR;
  pc_agent(x,G,rx,ry,R,r,{core:0.6});
  pc_jun(x,G,{gaze:tt<P.plan?[3.4,-1.6]:tt<P.four?[2.8,-0.8]:[3.4,-1.4],nod:0.06*ag_io(tt,P.answers-0.1,P.answers+0.8,0.3)});
  ag_roomLight(x,1);
  // the page, a tick by each row the pull request meets, as it's said
  pc_page(x,{tick:[P.goal,0,P.tools,0,P.names,P.green,P.untouched,P.four].map(v=>v?ag_in(tt,v+0.1,0.4):0),hi:[0,0,0,0,0,0,0,0]});
  ag_evidence(x,px,py,pw,{kick:"Pull request",title:"Census-day count by level",sub:"from the agent’s branch"},PC_PREV,{kickCol:AG.mut});
  ag_pill(x,px+pw/2,506,"4 of 10 rounds",{a:ag_in(tt,P.four-0.1,0.4)});
  ag_pill(x,px+pw/2,586,"Owner · Jun",{a:ag_in(tt,P.his+0.6,0.4)});}

function pc_noorRoom(x,tt,P){const G=P.g0+tt,into=ag_sine((tt-P.approves-0.5)/1.0);
  ag_person(x,"noor",330,640,0.92,{t:G+0.4,gaze:tt<P.prod?[3.2,-1.4]:[3.6,-1.0],nod:0.05*ag_io(tt,P.approve-0.1,P.approve+0.8,0.3)});
  // the agent, small, below the pull request: its review is for reference only
  pc_agent(x,G,840,760,80,40,{a:ag_in(tt,P.review-0.5,0.6),core:0.8});
  ag_roomLight(x,1);
  // the pull request: Noor approves it, and it goes behind the glass, into production
  pc_flown(x,{x:lerp(840,1540,into),y:lerp(343,470,into),s:1},840,343,()=>{
    ag_evidence(x,560,220,560,{kick:"Pull request",title:"Census-day count by level",sub:"from the agent’s branch"},PC_PREV,{kickCol:AG.mut});
    ag_pill(x,840,520,"Approved · Noor",{col:AG.green,icon:"tick",a:ag_in(tt,P.approve+0.2,0.4)});});
  ag_pill(x,840,610,"Agent’s review · for reference",{col:AG.violet,a:ag_io(tt,P.review-0.2,P.approves+0.6,0.4)});
  ag_glass(x,1230,200,620,620,{label:"Production",a:ag_in(tt,P.prod-0.3,0.6)});}

// the panel, framed on the wall: painted once, with everything it ended with
const pc_panelPic=()=>ag_kept("pcPanelPic",W,H,c=>{c.drawImage(ag_place("pcPanel"),0,0);pc_panelShot(c,60,{results:-20,july:-10,well:-10,rules:-10,years:-10});});
function pc_heldRoom(x,tt,P){const G=P.g0+tt;
  ag_picture(x,560,190,800,450,{img:pc_panelPic()});
  pc_jun(x,G,{gaze:[3.0,-1.6]});
  ag_person(x,"noor",1600,640,0.92,{t:G+0.4,flip:true,gaze:[3.0,-1.4]});
  ag_roomLight(x,1);
  ag_label(x,960,742,"The panel · Singapore, 2000 to 2002",{align:"center",col:AG.mut,a:ag_in(tt,P.outside-0.2,0.5)});}

/* ---------------------------------------------------------------- 7 · What the loop leaves
   The four steps become a ring, and a light goes round it; on the bench, "In the project", the loop leaves a decision, its
   metadata and an updated skill; and the page itself comes back, its rows ready for the next job. */
const PC_CY=[760,310,170];
scene("leaves",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({loop:wAt(sc,"next","loop"),nextOne:wAt(sc,"next","next one"),
    decision:c.decision,meta:c.meta,skill:c.skill,plan:c.plan,starts:wAt(sc,"plan","starts")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"lab",later:true,keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_leavesRoom(x,tt,P)}]);
  // the steps, kept from the chapter before, give way to the ring as it starts
  const t0=P.loop-0.4;if(t<t0+1.6)pc_steps(ctx,3,{a:1-ag_in(t,t0,0.5)});});

function pc_leavesRoom(x,tt,P){const [cx,cy,R]=PC_CY;
  ag_roomLight(x,1);
  pc_shelf(x,110,800,1360);
  // the steps across the top give way to the ring: it draws itself from the top, clockwise, each step coming on as it's reached;
  // then a light goes round it
  const t0=P.loop-0.4,dr=1.6,ring=clamp((tt-t0)/dr,0,1);
  const pu=pc_round(tt,t0+dr+0.3,2.0),lit=PC_CYC.map((d,i)=>{const dd=((pu.deg-d)%360+540)%360-180;return Math.max(clamp(1-Math.abs(dd)/50,0,1)*pu.a,i===0?ag_in(tt,P.starts-0.3,0.5):0);});
  if(ring>0){if(ring<1){ag_ring(x,cx,cy,R,{p:ag_sine(ring),from:-90,arrows:[-45,45,135,225].filter(d=>(d+90)/360<ag_sine(ring))});
      PC_CYC.forEach((d,i)=>{const a=ag_in(tt,t0+dr*(i/4)-0.05,0.35);if(a<=0.01)return;const q=d*Math.PI/180,px=cx+Math.cos(q)*R,py=cy+Math.sin(q)*R,w=ag_tw(x,PC_STEPS[i],{w:700,size:30})+54;
        ag_box(x,px-w/2,py-26,w,52,26,{a});ag_T(x,PC_STEPS[i],px,py+10,{w:700,size:30,align:"center",a});});}
    else pc_cycle(x,cx,cy,R,{pulse:pu,lit});}
  // on the shelf: a decision, metadata, a skill
  [[P.decision,{kick:"Decision",title:"Exchange students count as non-award",sub:"Mei Tanaka, Registrar’s office"}],
   [P.meta,{kick:"Metadata",title:"Level of study",sub:"in the glossary and the model, with its source"}],
   [P.skill,{kick:"Skill, updated",title:"reconcile-and-diff",sub:"every split adds up to its total"}]].forEach(([t0,wd],i)=>{
    const a=ag_in(tt,t0-0.1,0.3);if(a<=0.01)return;const h=ag_textCard(x,0,0,440,wd,{measure:1}).h,dr=ag_eo(clamp((tt-t0+0.1)/0.7,0,1));
    ag_textCard(x,120+i*470,784-h-lerp(90,0,dr),440,wd,{a,kickCol:AG.mut});});
  // the plan itself, its rows ready for the next job
  const pl=ag_eo(clamp((tt-P.plan+0.2)/0.9,0,1));if(pl>0.01)pc_plan(x,lerp(1940,1530,pl),130,350,PC_ROWS.map(r=>({k:r.k,v:""})),{lab:PC_ROWS.map(()=>1),k:PC_ROWS.map(()=>0),blank:1,a:pl});}

/* ---------------------------------------------------------------- 8 · Trust, earned
   Singapore once more: the panel, with its measures and its ticks; then the parade, the bottles raised again. Then the university:
   the count by level, checked, with its evidence, goes into the report to the government. The end card carries the takeaway. */
scene("trust",(ctx,S,t,sc)=>{const c=sc.cues,P=pc_once(sc,"P",()=>({g0:pc_g0(sc),outside:wAt(sc,"sg","outside"),bottle:c.bottle,raised:wAt(sc,"bottle","raised"),
    trust:wAt(sc,"bottle","trust"),uni:c.uni,person:wAt(sc,"uni","person"),gov:wAt(sc,"send","government"),evidence:wAt(sc,"send","evidence"),breath:c.breath}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"pcPanel",keys:[[0,960,520,1.03],[0.1,960,540,1.0]],d:6,push:0,draw:(x,tt)=>pc_panelShot(x,tt,{results:-20,july:-10,well:P.outside-0.2,rules:-10,years:-10})},
    {at:P.bottle-0.5,dis:1.0,place:"pcStadium",keys:[[P.bottle-0.5,960,560,1.08],[P.bottle-0.4,960,540,1.0]],d:7,push:0,draw:(x,tt)=>pc_crowd(x,tt,ag_sine((tt-P.raised+0.4)/2.6),ag_sine((tt-P.trust+0.1)/1.6),1)},
    {at:P.uni-0.4,dis:1.0,place:"lab",keys:[[0,960,540,1]],push:0,draw:(x,tt)=>pc_sendRoom(x,tt,P)}]);
  pc_tags(ctx,S,t,[[0.4,"The panel · 2000 to 2002"],[P.bottle-0.5,"National Day Parade · 9 August 2002",1.0],[P.uni-0.4,"The university",1.0],[P.breath,null,0.6]]);
  ag_end(ctx,S,t,P.breath+0.2,PC_TITLE,"Decide how you’ll check before the agent starts.","Film 5 of 9","Agents at work on data");});

const PC_SENDEV=[{kick:"Tests",title:"2 of 2 pass",col:AG.green},{kick:"Query",title:"the 28, and its result",col:AG.orange},{kick:"Decision",title:"non-award, Mei Tanaka"}];
function pc_sendRoom(x,tt,P){const G=P.g0+tt,[rx,ry,R,r]=PC_R3,go=ag_sine((tt-P.gov+0.2)/1.1);
  pc_agent(x,G,rx,ry,R,r,{core:0.8});
  pc_jun(x,G,{gaze:tt<P.gov?[3.0,-1.2]:[3.6,-1.4],smile:0.25*ag_in(tt,P.evidence,0.8)});
  ag_roomLight(x,1);
  pc_outbox(x,1240,220,620,{h:400,a:ag_in(tt,P.uni+0.6,0.6)});
  // the count, checked, with its evidence; at "government" it goes into the report
  const ck=pc_pop(tt,P.uni-0.2,null);
  pc_flown(x,{x:lerp(800,1550,go),y:lerp(323,467,go),s:1},800,323,()=>ag_evidence(x,520,200,560,{kick:"Census-day count",title:"18,412 students",sub:"by level: 13,906 · 4,478 · 28"},
    PC_SENDEV,{k:ck.k,a:ck.a,kickCol:AG.mut,edge:AG.green,edgeA:0.8*ag_in(tt,P.person,0.5)}));
  ag_tick(x,1820,264,26,rgba(AG.green,ag_in(tt,P.evidence,0.4)),4);}

// the chapters that open on a cut: the title card to the lab, the same shot going on (plan to define), the plant to the sandbox, and
// the lab between people; plan (Jun where he was) and trust (the lab to the panel) keep the engine's dissolve, as nothing shows twice
ag_cutInto(["long","define","do","check","leaves"]);
