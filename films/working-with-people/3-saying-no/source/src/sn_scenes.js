/* ===== Saying no, and what instead: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. On the map the camera goes close to the dam and
   to Aralsk, so the words over it are laid on the screen, not on the map, and stay their size. Sizes in the 1920 x 1080 frame. */

const SN_LAST="Never a bare no: say what you can do, and when.";
// the film's number and title at the top left, from the second chapter on
function sn_kick(ctx,S,a,o){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"3","Saying no, and what instead",Object.assign({a},o||{}));}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function sn_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const sn_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function sn_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 (and goes at t1)
function sn_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// words laid on the screen inside a shot, whatever its camera: drawn in the frame's own coordinates, and faded with the shot
function sn_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn(ctx);ctx.restore();}
// an arrow drawn on from (x0, y0) to (x1, y1), u 0 to 1
function sn_arrow(ctx,x0,y0,x1,y1,u,col,wd){u=ag_sine(clamp(u,0,1));if(u<=0.004)return;const x=lerp(x0,x1,u),y=lerp(y0,y1,u),an=Math.atan2(y1-y0,x1-x0);ctx.save();
  ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=wd||5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x,y);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x+Math.cos(an)*12,y+Math.sin(an)*12);ctx.lineTo(x+Math.cos(an+2.5)*16,y+Math.sin(an+2.5)*16);ctx.lineTo(x+Math.cos(an-2.5)*16,y+Math.sin(an-2.5)*16);ctx.closePath();ctx.fill();ctx.restore();}
// a dashed ring round the part to save, drawn on (u 0 to 1)
function sn_ring(ctx,cx,cy,rx,ry,u,col){u=clamp(u,0,1);if(u<=0.004)return;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=5;ctx.setLineDash([16,12]);ctx.lineCap="round";
  ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,-Math.PI/2,-Math.PI/2+TAU*ag_sine(u));ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- 1. Save what can be saved: the Aral Sea, 1960 to 2014 */
scene("aral",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),grey={light:"grey",wall:0},dy={light:"day"};
  // the years as the voice tells them: the sea shrinks from 1960 to 2004 over the line that says so; after the split, the north holds
  // at about 15 m down until the dam, then rises 4 m; the south goes on falling to 2014
  const s0=w("shrank","shrank",-0.1),s1=c.split-0.2,yr1=lerp(1960,2004,ag_sine(clamp((t-s0)/(s1-s0),0,1)));
  const rise=ag_sine(clamp((t-w("rose","rose",-0.2))/3.2,0,1)),dry=ag_sine(clamp((t-w("south","shrinking",-0.3))/3.4,0,1));
  const dS=t<c.south?sn_drop(yr1):lerp(20,27,dry),dN=Math.min(sn_drop(yr1),15)-4*rise;
  const flow=1-0.62*ag_sine(clamp((t-w("rivers","turned",-0.1))/2.6,0,1)),fields=ag_sine(clamp((t-w("rivers","cotton",-0.3))/2.8,0,1));
  const damU=clamp((t-w("dam","Kok",-0.1))/1.8,0,1),syr=ag_in(t,w("done","upstream",-0.2),0.8);
  const sea=(x,tt)=>{sn_sea(x,{dropN:dN,dropS:dS,dam:damU});sn_rivers(x,{flow,fields,syr,t:tt});};
  ag_shots(ctx,S,t,sc.dur,[
    // the sea in 1960, its rivers full; the farms come in along them, and the sea shrinks to 2004, splitting in two
    {at:0,place:"snMap",keys:[[0,960,520,1.1],[0.4,960,540,1.0]],d:3.2,push:0,draw:(x,tt)=>{sea(x,tt);
      sn_scr(x,S,q=>{
        sn_sheet(q,tt,w("sea","Aral",-0.3),90,96,520,{kick:"Until the 1960s",title:"The Aral Sea",lines:["The world's fourth-largest lake"]},{light:null,pin:false,out:c.rivers-0.4,u:ag_in(tt,w("sea","fourth",-0.2),0.5)});
        lp_label(q,1500,150,"Kazakhstan",{a:ag_io(tt,w("sea","Kazakhstan",-0.1),c.towns-0.6)});lp_label(q,300,840,"Uzbekistan",{a:ag_io(tt,w("sea","Uzbekistan",-0.1),c.towns-0.6)});
        sn_tag(q,tt,w("rivers","cotton",-0.1),c.shrank-0.4,1600,560,"Cotton and rice, in the desert",{align:"center",col:LP.ink});
        sn_tag(q,tt,w("rivers","families",-0.2),c.shrank-0.4,1600,640,"Farms many families depend on",{align:"center",col:LP.ink});
        // the year, as the sea shrinks, on the plateau to the west
        const ya=ag_io(tt,s0-0.3,c.split-0.1,0.4);if(ya>0.004){lp_T(q,String(Math.round(t<c.south?yr1:2004)),300,560,{w:800,size:64,col:LP.ink,align:"center",a:ya});}
        sn_sheet(q,tt,w("shrank","lost",-0.3),90,96,520,{kick:"1960 to 2004",title:"Almost 70% of its surface lost",lines:["Its level almost 20 m lower"]},{col:LP.amber,light:null,pin:false,out:c.towns-0.6,u:ag_in(tt,w("shrank","level",-0.2),0.5)});
        sn_tag(q,tt,w("split","split",-0.1),c.towns-0.6,985,96,"Around 1990: split in two",{align:"center",col:LP.ink});
        sn_tag(q,tt,w("split","north",-0.1),c.towns-0.6,1250,250,"The north",{align:"left",col:LP.ink});
        sn_tag(q,tt,w("split","south",-0.1),c.towns-0.6,1250,640,"The south",{align:"left",col:LP.ink});});}},
    // Aralsk's old harbour: the boat on the dry seabed, the fisher; then the dust
    {at:c.towns-0.3,place:"snHarbour",keys:[[c.towns-0.3,960,540,1.0]],dis:1.3,draw:(x,tt)=>{
      lp_person(x,SN_FISHER,600,800,0.66,{t:tt,light:grey});
      sn_dust(x,tt,{a:ag_in(tt,w("dust","Storms",-0.4),1.4)});
      sn_sheet(x,tt,w("towns","Aralsk",-0.3),1160,96,640,{kick:"Aralsk, a fishing town",title:"Left far from the water"},{col:LP.amber,light:null,pin:false,out:c.dust-0.4});
      sn_sheet(x,tt,w("towns","salty",-0.3),1160,330,640,{kick:"The sea grew salty",title:"The fish died",lines:["Tens of thousands of jobs lost"]},{col:LP.amber,light:null,pin:false,out:c.dust-0.4,u:ag_in(tt,w("towns","jobs",-0.3),0.5)});
      sn_sheet(x,tt,w("dust","Storms",-0.2),1160,96,640,{kick:"Salt and dust storms",title:"Polluted drinking water",lines:["People fell ill"]},{col:LP.amber,light:null,pin:false,u:ag_in(tt,w("dust","ill",-0.4),0.5)});}},
    // back on the map, 2004: the whole sea, or the part that could be saved; the dam; the river let through; the north rising; the
    // shore coming back towards Aralsk; the south, not saved
    {at:c.whole-0.3,place:"snMap",dis:1.3,push:0,d:1.8,keys:[[c.whole-0.3,960,540,1.0],[c.dam-0.2,930,330,2.4],[c.done+0.4,1180,320,1.3],[c.rose-0.2,1000,300,1.5],
        [c.shore-0.3,1120,190,2.0],[c.south-0.4,960,540,1.0]],draw:(x,tt)=>{sea(x,tt);
      sn_ring(x,1000,226,285,150,ag_in(tt,w("chose","northern",-0.3),1.2)*(1-ag_in(tt,c.dam-0.4,0.5)),LP.blue);
      // the old shore near Aralsk, dashed, and the way the water came back
      const sa=ag_io(tt,c.shore,c.south-0.6,0.5);if(sa>0.004){x.save();x.globalAlpha*=sa;sn_arrow(x,1078,238,1150,184,ag_in(tt,c.shore+0.3,1.0),LP.green,4);x.restore();}
      sn_scr(x,S,q=>{
        sn_sheet(q,tt,w("whole","whole",-0.3),90,96,560,{kick:"The whole sea back?",title:"Only by taking the rivers back from the farms"},{col:LP.amber,light:null,pin:false,out:c.chose-0.4});
        sn_sheet(q,tt,w("chose","chose",-0.3),90,96,560,{kick:"Kazakhstan's choice",title:"Save the part that can be saved",lines:["The northern sea"]},{col:LP.blue,light:null,pin:false,out:c.dam-0.4,u:ag_in(tt,w("chose","northern",-0.2),0.5)});
        sn_sheet(q,tt,w("dam","dam",-0.3),1200,96,620,{kick:"With a World Bank loan",title:"The Kok-Aral dam",lines:["13 km long","Keeps the Syr Darya's water in the north"]},{col:LP.blue,light:null,pin:false,out:c.done-0.4,u:sn_u(tt,[w("dam","kilometres",-0.3),w("dam","keep",-0.2)])});
        sn_sheet(q,tt,w("done","finished",-0.3),90,96,600,{kick:"Finished in August 2005",title:"Works upstream",lines:["More of the river arrives"]},{col:LP.blue,light:null,pin:false,out:c.rose-0.4,u:ag_in(tt,w("done","upstream",-0.1),0.5)});
        sn_tag(q,tt,w("done","river",-0.3),c.rose-0.4,1420,560,"Syr Darya",{align:"center",col:LP.ink});
        sn_sheet(q,tt,w("rose","faster",-0.3),90,96,560,{kick:"By 2006",title:"Four metres higher",lines:["The level it was built for","Much faster than planned"]},{col:LP.green,light:null,pin:false,out:c.fresh-0.4,u:sn_u(tt,[w("rose","level",-0.3),w("rose","rose",0.3)])});
        sn_sheet(q,tt,w("fresh","salty",-0.4),90,96,520,{kick:"By 2007",title:"Half as salty"},{col:LP.green,light:null,pin:false,out:c.shore-0.4});
        const fa=ag_in(tt,w("fresh","catch",-0.3),0.4)*(1-ag_in(tt,c.shore-0.4,0.4));if(fa>0.004)lp_figure(q,1220,96,560,{kick:"The catch, 2004 to 2007",num:"40×",label:"From 50 tonnes to about 2,000"},{col:LP.green,light:null,pin:false,a:fa,k:tt-w("fresh","catch",-0.3)});
        sn_sheet(q,tt,w("plants","plants",-0.3),90,330,520,{kick:"Four fish plants opened",title:"Fish sold abroad, 2008",lines:["The first time in years"]},{col:LP.green,light:null,pin:false,out:c.shore-0.4,u:ag_in(tt,w("plants","abroad",-0.3),0.5)});
        sn_tag(q,tt,w("shore","Aralsk",-0.3),c.south-0.6,1196,372,"Aralsk",{align:"left",col:LP.ink});
        sn_tag(q,tt,w("shore","kilometres",-0.3),c.south-0.6,1060,560,"The shore, tens of kilometres closer",{align:"left",col:LP.green});
        sn_sheet(q,tt,w("south","southern",-0.3),90,96,560,{kick:"The southern sea",title:"Not saved",lines:["By 2014, its eastern part dry"]},{col:LP.amber,light:null,pin:false,out:c.data-0.5,u:ag_in(tt,w("south","eastern",-0.3),0.5)});
        sn_pill(q,tt,w("no","no",-0.1),c.data-0.5,930,640,"No: the whole sea",{col:LP.ink,size:30});
        sn_pill(q,tt,w("no","yes",-0.1),c.data-0.5,900,84,"Yes: the part it could save",{col:LP.green,size:30,icon:"tick"});});}},
    // and data work: a bare no, a yes nobody can keep, and what helps instead
    {at:c.data-0.3,place:"lpRoom",keys:[[c.data-0.3,960,540,1.0]],dis:1.2,push:0,draw:(x,tt)=>{const ga=1-ag_in(tt,c.breath+0.2,0.8);x.save();x.globalAlpha*=ga;
      sn_sheet(x,tt,w("data","asked",-0.3),470,110,980,{kick:"In data work",title:"More is asked than a team can do well"},{col:LP.amber,light:"day"});
      sn_pill(x,tt,w("data","bare",-0.1),null,620,420,"A bare no: it helps nobody",{col:LP.amber,size:32});
      sn_pill(x,tt,w("data","neither",-0.1),null,1300,420,"A yes nobody can keep",{col:LP.amber,size:32});
      sn_pill(x,tt,w("instead","honest",-0.1),null,960,600,"An honest no: what you can do, and when",{col:LP.green,size:34,icon:"tick"});x.restore();}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"Saying no, and what instead","Never a bare no","Leading data people · Working with people");
});

/* ---------------------------------------------------------------- 2. Two asks, the same weeks */
scene("asks",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  ag_shots(ctx,S,t,sc.dur,[
    // Monday 12 July: Clara's request, through the front door
    {at:0,place:"snMorning",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      sn_sheet(x,tt,w("clara","Clara",-0.3),180,150,800,{kick:"Monday 12 July",title:"A new student forecast model",lines:["From Clara Jensen, in Planning","By the end of August"]},{light:"morning",u:sn_u(tt,[w("clara","Planning",-0.3),w("clara","end",-0.3)])});
      lp_person(x,"clara",1420,650,1.0,{t:tt,flip:true,light:mo});}},
    // the same weeks: the rooms' data for the timetable change, for Mei and Graham
    {at:c.same-0.3,place:"snMorning",later:true,keys:[[c.same-0.3,960,540,1.0]],draw:(x,tt)=>{
      sn_sheet(x,tt,w("same","registrar's",-0.3),560,120,800,{kick:"The same weeks · The registrar's office",title:"The rooms' data for the timetable change",lines:["Asked for by the University Council in June","For the faculties, by the end of August"]},
        {light:"morning",col:LP.orange,u:sn_u(tt,[w("same","Council",-0.3),w("mei","faculties",-0.3)])});
      lp_person(x,"mei",330,660,0.95,{t:tt,light:mo});lp_person(x,"graham",1590,660,0.95,{t:tt,flip:true,light:mo});}},
    // both on the one list (what Clara's is for not yet asked); both need Jun and Noor, in August's same four weeks
    {at:c.list-0.3,place:"snMorning",later:true,keys:[[c.list-0.3,960,540,1.0]],draw:(x,tt)=>{
      const la=1-ag_in(tt,c.both-0.4,0.5);if(la>0.004){x.save();x.globalAlpha*=la;sn_list(x,160,130,1600,{rows:2*ag_in(tt,w("list","list",-0.2),0.8),unasked:{1:true},light:"morning",k:tt-w("list","list",-0.3)});
        sn_tag(x,tt,w("list","module",-0.3),null,960,640,"The one list, from the data management module",{align:"center",col:LP.mut});x.restore();}
      sn_weeks(x,150,150,{span:4,both:1,rooms:ag_in(tt,w("both","Jun",-0.3),1.0),model:ag_in(tt,w("both","weeks",-0.3),1.0),light:"morning",a:ag_in(tt,c.both,0.4)});
      const pa=ag_in(tt,w("both","Jun",-0.2),0.6);lp_person(x,"jun",1330,660,0.9,{t:tt,flip:true,light:mo,a:pa});lp_person(x,"noor",1690,660,0.9,{t:tt,flip:true,light:mo,a:pa});}},
    // a yes to both, a bare no, and what Helena does instead
    {at:c.yes-0.3,place:"snMorning",later:true,keys:[[c.yes-0.3,960,540,1.0]],draw:(x,tt)=>{
      sn_sheet(x,tt,w("yes","yes",-0.2),120,130,700,{kick:"A yes to both",title:"One of them done badly",lines:["A model nobody had time to test","Or the rooms' data, late"]},{col:LP.amber,light:"morning",u:sn_u(tt,[w("yes","model",-0.3),w("yes","late",-0.4)])});
      sn_sheet(x,tt,w("bare","bare",-0.2),120,560,700,{kick:"A bare no",title:"Nothing for Clara"},{col:LP.amber,light:"morning"});
      lp_person(x,"helena",1420,650,1.0,{t:tt,flip:true,light:mo,a:ag_in(tt,c.asks-0.2,0.8)});
      sn_tag(x,tt,w("asks","asks",-0.2),null,1000,560,"First, she asks",{align:"center",col:LP.ink});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.8,c.same-0.5,0.5)});
  sn_kick(ctx,S,ag_in(t,0.6,0.6),{light:"morning"});
});

/* ---------------------------------------------------------------- 3. What's the date for? */
scene("date",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // Fisher and Ury: a position, and the interest behind it
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      sn_sheet(x,tt,w("book","Fisher",-0.3),140,150,800,{kick:"Roger Fisher and William Ury, 1981",title:"Getting to Yes",lines:["A position: what someone asks for","An interest: why they ask"]},
        {light:"day",u:sn_u(tt,[w("position","position",-0.2),w("position","interest",-0.2)])});
      const ga=1-ag_in(tt,c.wed-0.8,0.4);sn_tag(x,tt,w("position","asks",-0.1),c.wed-0.8,1400,330,"“By the end of August”",{align:"center",col:LP.ink});
      if(ga>0.004){x.save();x.globalAlpha*=ga;sn_arrow(x,1400,372,1400,470,ag_in(tt,w("position","why",-0.2),0.6),LP.blue,5);x.restore();}
      sn_tag(x,tt,w("position","date",-0.2),c.wed-0.8,1400,520,"What's the date for?",{align:"center",col:LP.blue});}},
    // Wednesday 14 July: Helena and Noor sit down with Clara; they stay at the table while the wall above shows what the date is for
    // (the budget round, and the admissions round), what the budget needs, then her position and her interests, said back
    {at:c.wed-0.3,place:"snMeet",keys:[[c.wed-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      sn_meet(x,tt,{lt:dy});
      sn_sheet(x,tt,w("wed","Wednesday",-0.2),620,130,680,{kick:"Wednesday 14 July",title:"What's the date for?"},{light:"day",out:c.budget-0.4});
      sn_sheet(x,tt,w("budget","budget",-0.3),120,130,820,{kick:"The 2028 budget round",title:"Closes Friday 17 September",lines:["Next year's student numbers go in"]},{col:LP.blue,light:"day",out:c.interest-0.5,u:ag_in(tt,w("budget","numbers",-0.3),0.5)});
      sn_sheet(x,tt,w("new","model",-0.3),980,130,820,{kick:"The new model",title:"Applications, week by week",lines:["Early warning of a change in demand","For the admissions round, in December"]},{col:LP.orange,light:"day",out:c.interest-0.5,u:sn_u(tt,[w("new","warn",-0.3),w("new","admissions",-0.3)])});
      sn_pill(x,tt,w("enough","current",-0.2),c.interest-0.5,530,404,"The budget needs the current model, this year's figures",{col:LP.green,size:28,icon:"tick"});
      sn_sheet(x,tt,w("interest","position",-0.2),120,130,700,{kick:"Her position",title:"A new model by August"},{light:"day"});
      sn_sheet(x,tt,w("interest","interests",-0.2),980,130,820,{kick:"Her interests",lines:["A number to trust in the budget","Earlier warning, for admissions"]},{col:LP.blue,light:"day",u:sn_u(tt,[w("interest","number",-0.2),w("interest","warning",-0.3)])});
      sn_tag(x,tt,w("back","says",-0.2),null,960,430,"Said back, and agreed",{align:"center",col:LP.ink});}}
  ]);
  sn_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. The trade-off, in the open */
scene("open",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // both asks on the one list, side by side, where Clara and Mei can both see them
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      sn_list(x,140,130,1640,{rows:2*ag_in(tt,w("side","side",-0.3),0.9),hi:{0:ag_io(tt,w("each","date",-0.2),c.weeks-0.6),1:ag_io(tt,w("each","weeks",-0.2),c.weeks-0.6)},light:"day",a:ag_in(tt,w("side","puts",-0.3),0.4),k:tt-w("side","puts",-0.3)});
      lp_person(x,"clara",300,846,0.8,{t:tt,light:dy,a:ag_in(tt,w("side","Clara",-0.3),0.8)});lp_person(x,"mei",1620,846,0.8,{t:tt,flip:true,light:dy,a:ag_in(tt,w("side","Mei",-0.3),0.8)});}},
    // August's weeks: the rooms' data takes three; a new model, six and its tests, runs past the month; the refresh takes one
    {at:c.weeks-0.3,place:"lpRoom",later:true,keys:[[c.weeks-0.3,960,540,1.0]],draw:(x,tt)=>{
      sn_weeks(x,120,130,{span:7.6,rooms:ag_in(tt,w("weeks","rooms",-0.3),1.0),model:ag_in(tt,w("weeks","model",-0.3),1.6),over:ag_in(tt,w("weeks","six",-0.1),0.6),refresh:ag_in(tt,w("refresh","Refreshing",-0.2),0.8),light:"day"});
      sn_tag(x,tt,w("weeks","six",0.2),null,1390,672,"Past the end of August",{align:"center",col:LP.amber});
      sn_tag(x,tt,w("refresh","week",-0.2),null,1015,672,"The refresh fits",{align:"center",col:LP.orange});}},
    // the order isn't Helena's: fair criteria; then options that serve both interests
    {at:c.order-0.3,place:"lpRoom",later:true,keys:[[c.order-0.3,960,540,1.0]],draw:(x,tt)=>{
      sn_sheet(x,tt,w("order","order",-0.2),120,130,820,{kick:"The order",title:"Not Helena's to choose",lines:["By value, urgency, effort and risk","Never by who asks"]},{light:"day",u:sn_u(tt,[w("order","value",-0.2),w("order","never",-0.1)])});
      sn_sheet(x,tt,w("fair","Fisher",-0.3),980,130,820,{kick:"Fisher and Ury",title:"Fair criteria",lines:["What both sides can check","Not who pushes harder"]},{light:"day",u:sn_u(tt,[w("fair","check",-0.3),w("fair","pushes",-0.3)])});
      sn_sheet(x,tt,w("options","options",-0.3),550,500,820,{kick:"Options for both interests",lines:["The budget, by September","Early warning, by December"]},{col:LP.blue,light:"day",u:sn_u(tt,[w("options","budget",-0.3),w("options","warning",-0.3)])});}}
  ]);
  sn_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. A no, and what instead */
scene("offer",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // Helena and Clara at the table all through; above them, William Ury's positive no; the dam's, back from the opening (its yes and
    // its no, in the places Helena's take next); Helena's yes and her no; her offer, with its dates; would that work? It's Clara's to
    // choose, and the data council if she disagreed
    {at:0,place:"snMeet",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      sn_meet(x,tt,{lt:dy,who:SN_TWO,table:[440,858,1040]});
      sn_sheet(x,tt,w("ury","Ury",-0.3),560,130,800,{kick:"William Ury, 2007",title:"The Power of a Positive No",lines:["Yes: to what you must protect","Then a clear no","Then an offer"]},
        {light:"day",out:c.dam-0.4,u:sn_u(tt,[w("ury","yes",-0.2),w("ury","clear",-0.2),w("ury","offer",-0.3)])});
      sn_tag(x,tt,w("dam","Kok",-0.2),c.yes-0.4,960,112,"The Kok-Aral dam",{align:"center",col:LP.ink});
      sn_pill(x,tt,w("dam","yes",-0.1),c.yes-0.4,960,190,"Yes: the part it could save",{col:LP.green,size:30,icon:"tick"});
      sn_pill(x,tt,w("dam","no",-0.1),c.yes-0.4,960,276,"No: the whole sea",{col:LP.ink,size:30});
      sn_pill(x,tt,w("yes","yes",-0.1),c.refresh-0.4,960,190,"Yes: the timetable change, done well",{col:LP.green,size:30,icon:"tick"});
      sn_pill(x,tt,w("no","no",-0.1),c.refresh-0.4,960,276,"No: a new model by August",{col:LP.ink,size:30});
      sn_sheet(x,tt,w("refresh","offer",-0.2),120,130,820,{kick:"Friday 27 August",title:"The current model, refreshed",lines:["In time for the budget"]},{col:LP.blue,light:"day",out:c.choose-0.4,u:ag_in(tt,w("refresh","budget",-0.3),0.5)});
      sn_sheet(x,tt,w("october","new",-0.3),980,130,820,{kick:"Friday 29 October",title:"The new model",lines:["Before the admissions round"]},{col:LP.blue,light:"day",out:c.choose-0.4,u:ag_in(tt,w("october","admissions",-0.3),0.5)});
      sn_tag(x,tt,w("work","work",-0.4),c.choose-0.4,960,420,"Would that work?",{align:"center",col:LP.ink});
      sn_sheet(x,tt,w("choose","choose",-0.3),560,130,800,{kick:"Clara's to choose",title:"If not, the data council settles it",lines:["In the open, on Tuesday 27 July"]},{light:"day",u:ag_in(tt,w("choose","open",-0.3),0.5)});}},
    // agreed: both dates on the one list, in writing
    {at:c.agrees-0.3,place:"lpRoom",keys:[[c.agrees-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      sn_list(x,140,130,1640,{rows:3,dates:ag_in(tt,w("agrees","dates",-0.2),1.0),tick:ag_in(tt,w("agrees","writing",-0.2),0.5),light:"day",a:ag_in(tt,c.agrees+0.2,0.4)});
      sn_pill(x,tt,w("agrees","not",-0.1),null,960,740,"Not now, with a reason and a date",{col:LP.blue,size:30});}}
  ]);
  sn_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. Kept, on time */
scene("kept",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"};
  ag_shots(ctx,S,t,sc.dur,[
    // the dates kept, one by one
    {at:0,place:"snLate",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      const u=ag_in(tt,w("aug","refreshed",-0.4),1.0)+ag_in(tt,w("sep","budget",-0.4),1.0)+ag_in(tt,w("oct","ready",-0.4),1.0);
      sn_kept(x,240,420,1440,{u:0.35+u*0.98,a:ag_in(tt,0.3,0.5)});
      sn_tag(x,tt,w("oct","reviewed",-0.2),null,1440,700,"Reviewed before anyone reads it",{align:"center",col:LP.ink});}},
    // November: Clara brings the next request early; and what it built
    {at:c.next-0.3,place:"snLate",later:true,keys:[[c.next-0.3,960,540,1.0]],draw:(x,tt)=>{
      sn_sheet(x,tt,w("next","November",-0.2),180,150,780,{kick:"November · Planning",title:"The next request, early",lines:["What it's for","When she needs it"]},{light:"late",u:sn_u(tt,[w("next","for",-0.3),w("next","needs",-0.3)])});
      lp_person(x,"clara",1420,650,1.0,{t:tt,flip:true,light:lt});
      sn_pill(x,tt,w("trust","clear",-0.1),null,570,620,"A clear no, an offer, kept",{col:LP.green,size:30,icon:"tick"});
      sn_tag(x,tt,w("trust","trust",-0.2),null,570,710,"More trust than a yes nobody could keep",{align:"center",col:LP.ink});}}
  ]);
  sn_kick(ctx,S,1,{light:"late"});
});

/* ---------------------------------------------------------------- 7. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back at the Aral: the northern sea full behind its dam
    {at:0,place:"snMap",keys:[[0,960,540,1.06],[0.2,980,420,1.25]],d:4,push:0,draw:(x,tt)=>{sn_sea(x,{dropN:11,dropS:27,dam:1});sn_rivers(x,{flow:0.42,fields:1,syr:1,t:tt});
      sn_scr(x,S,q=>{sn_pill(q,tt,w("back","whole",-0.2),null,400,150,"Not the whole sea",{col:LP.ink,size:30});
        sn_pill(q,tt,w("back","saved",-0.2),null,400,240,"The part it could save",{col:LP.green,size:30,icon:"tick"});});}},
    // Helena did the same
    {at:c.helena-0.3,place:"snMorning",keys:[[c.helena-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      sn_pill(x,tt,w("helena","asked",-0.1),null,1220,220,"Asked what the date was for",{col:LP.blue});
      sn_pill(x,tt,w("helena","showed",-0.1),null,1220,320,"Showed the trade-off",{col:LP.blue});
      sn_pill(x,tt,w("helena","offered",-0.1),null,1220,420,"Offered what the team could do well",{col:LP.blue});
      sn_pill(x,tt,w("helena","kept",-0.1),null,1220,520,"Kept her word",{col:LP.green,icon:"tick"});
      lp_person(x,"helena",470,650,1.0,{t:tt,light:mo});}},
    // what to do on Monday
    {at:c.ask-0.3,place:"snMorning",later:true,keys:[[c.ask-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        sn_sheet(x,tt,c.ask+0.3,120,120,820,{kick:"One",title:"Ask what the date is for"},{light:"morning"});
        sn_sheet(x,tt,w("show","Put",-0.1),980,120,820,{kick:"Two",title:"Show the trade-off on the list"},{light:"morning"});
        sn_sheet(x,tt,w("offer","Say",-0.1),120,400,820,{kick:"Three",title:"No to the date, not the person: offer what you can do, and when"},{col:LP.blue,light:"morning"});
        sn_sheet(x,tt,w("write","Let",-0.1),980,400,820,{kick:"Four",title:"Let those who decide choose, write it down, keep your word"},{col:LP.green,light:"morning"});
        x.restore();}
      sn_tag(x,tt,w("next","next",-0.1),c.take-0.4,960,780,"Next: Less, on purpose",{align:"center",col:LP.ink});
      const ta=ag_in(tt,c.take,0.4)*(1-ag_in(tt,e0,0.8));
      if(ta>0.004){for(const [s,wd,px,col] of [["Never a bare no","Never",960-400,LP.ink],["Say what you can do, and when","say",960+300,LP.blue]])
        {const t0=w("take",wd,-0.1);lp_pill(x,px,470,s,{col,size:34,a:ta*ag_in(tt,t0,0.4),k:tt-t0});}}}}
  ]);
  lp_end(ctx,S,t,e0,"Saying no, and what instead",SN_LAST,"Film 3 of 3","Working with people");
  sn_kick(ctx,S,1-ag_in(t,e0,0.8),{light:"morning"});
});

// the dates kept open with a cut from the dates agreed, which show the same dates; every other join changes the whole picture, so it dissolves
ag_cutInto(["kept"]);
