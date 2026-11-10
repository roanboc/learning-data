/* ===== Services with customers: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const SWC_LAST="Know your services and who they're for; then design every layer for them.";
const SWC_TITLE="Services with customers";
function swc_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"1",SWC_TITLE,{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function swc_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
const swc_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
function swc_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function swc_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// the hospital's sentence, framed on the team's wall: a small picture of the hospital over its one line
function swc_print(ctx,x,y,w,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const h=w*0.56;lp_sheet(ctx,x,y,w,h,{light:"morning"});
  ctx.save();ctx.beginPath();ctx.rect(x+24,y+24,w-48,h-48);ctx.clip();ctx.translate(x+24,y+24);ctx.scale((w-48)/W,(w-48)/W);
  ctx.fillStyle=rgba(SWC_K.sky1,1);ctx.fillRect(0,0,W,H);swc_skyGround(ctx,SWC_H.ground);swc_hospital(ctx,{beds:1,free:1});ctx.restore();ctx.restore();}

/* ---------------------------------------------------------------- 1. Sight, for everyone: Madurai, from 1976 */
scene("sight",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),out={light:"day",wall:0},mo={light:"morning"};
  const beds0=w("beds","eleven",-0.1),free0=w("free","Six",-0.1);
  ag_shots(ctx,S,t,sc.dur,[
    // Madurai, 1976: the building that will be the hospital, cut open, still empty
    {at:0,place:"swcSky",keys:[[0,960,560,1.06],[c.when+0.4,960,540,1.0]],d:3,draw:(x,tt)=>{swc_hospital(x,{beds:0});
      swc_sheet(x,tt,w("when","Madurai",-0.2),140,120,600,{kick:"The south of India",title:"Madurai, 1976"},{light:null,pin:false,out:c.doctor-0.6});}},
    // the doctor, just retired
    {at:c.doctor-0.3,place:"swcWard",keys:[[c.doctor-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      swc_sheet(x,tt,w("doctor","Venkataswamy",-0.4),940,170,760,{kick:"A government eye surgeon",title:"Dr Govindappa Venkataswamy",lines:["Retired at 58"]},
        {light:"morning",u:ag_in(tt,w("doctor","fifty-eight",-0.1),0.5)});
      lp_person(x,SWC_PEOPLE.doctor,520,640,1.0,{t:tt,light:mo});}},
    // his hospital: eleven beds
    {at:c.beds-0.3,place:"swcSky",keys:[[c.beds-0.3,960,600,1.15]],dis:1.4,draw:(x,tt)=>{swc_hospital(x,{beds:ag_in(tt,beds0,2.0)});
      swc_tag(x,tt,beds0+0.6,c.cataract-0.6,950,430,"Eleven beds",{align:"center",col:LP.ink});}},
    // a cataract: the lens clouds over, and no light gets through
    {at:c.cataract-0.3,place:"swcWard",keys:[[c.cataract-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      swc_eye(x,820,470,230,{rays:ag_in(tt,c.cataract+0.2,1.6),cloud:ag_in(tt,w("cataract","cloudy",-0.1),2.4)});
      swc_tag(x,tt,w("cataract","lens",-0.1),null,620,170,"The lens",{align:"center",col:LP.ink});
      swc_tag(x,tt,w("cataract","cloudy",0.2),null,1160,330,"A cataract: the lens turns cloudy",{col:LP.amber});
      swc_tag(x,tt,w("cataract","light",0.0),null,1160,420,"No light gets through",{col:LP.amber});
      swc_tag(x,tt,w("cataract","millions",-0.1),null,1160,240,"Millions of people blind",{col:LP.amber});}},
    // what it costs a family; the short operation; why most never have it
    {at:c.harm-0.3,place:"swcField",keys:[[c.harm-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      swc_tag(x,tt,w("harm","farmer",0),c.fix-0.4,520,250,"Can't work his field",{align:"center",col:LP.amber});
      swc_tag(x,tt,w("harm","grandmother",0),c.fix-0.4,1400,180,"Needs a child to lead her",{align:"center",col:LP.amber});
      swc_tag(x,tt,w("harm","school",-0.2),c.fix-0.4,1400,250,"The child leaves school",{align:"center",col:LP.amber});
      swc_sheet(x,tt,w("fix","operation",-0.1),700,120,520,{kick:"The fix",title:"A short operation",lines:["Their sight given back"]},{col:LP.green,light:null,pin:false,u:ag_in(tt,w("fix","sight",-0.1),0.5)});
      swc_sheet(x,tt,w("cost","poor",-0.2),700,420,520,{kick:"But most",lines:["Are too poor to pay for it","Live far from any surgeon"]},{col:LP.amber,light:null,pin:false,u:swc_u(tt,[w("cost","poor",-0.1),w("cost","surgeon",-0.3)])});
      lp_person(x,SWC_PEOPLE.farmer,520,640,1.0,{t:tt,light:out});
      lp_person(x,SWC_PEOPLE.gran,1400,640,1.0,{t:tt,flip:true,a:ag_in(tt,w("harm","grandmother",-0.6),0.6),light:out});}},
    // what the hospital is for, and who it's for, in groups; six of the eleven beds for those who pay nothing
    {at:c.service-0.3,place:"swcSky",keys:[[c.service-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{swc_hospital(x,{beds:1,free:ag_in(tt,free0+0.3,0.8),lit:0.6});
      swc_sheet(x,tt,w("service","for",-0.1),460,90,1000,{kick:"What the hospital is for",title:"Sight given back, to everyone who needs it"},{col:LP.blue,light:null,pin:false});
      swc_tag(x,tt,w("groups","can",-0.1),null,560,400,"Can pay",{align:"center",col:LP.ink});
      swc_tag(x,tt,w("groups","little",-0.2),null,960,400,"Can pay a little",{align:"center",col:LP.ink});
      swc_tag(x,tt,w("groups","nothing",-0.2),null,1360,400,"Can pay nothing",{align:"center",col:ag_in(tt,free0,0.4)>0.5?LP.blue:LP.ink});}},
    // the eye camps in the villages, and the buses that bring people in
    {at:c.camps-0.3,place:"swcMap",keys:[[c.camps-0.3,960,500,1.0]],dis:1.4,draw:(x,tt)=>{
      swc_camps(x,tt,{camps:ag_in(tt,w("camps","villages",-0.2),1.6),bus0:w("camps","bus",-0.6)});
      swc_tag(x,tt,w("camps","camps",-0.1),null,96,890-60,"Eye camps, in the villages",{col:LP.green});}},
    // everything below, designed for them: the operating room's flow, its people and its costs
    {at:c.below-0.3,place:"swcWard",keys:[[c.below-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const f0=w("below","operating",-0.2);
      if(tt>=f0)swc_flow(x,210,220,{a:ag_in(tt,f0,0.35)*(1-ag_in(tt,c.lenses-0.6,0.4)),k:tt-f0,u:ag_in(tt,f0+0.2,2.0),cost:ag_in(tt,w("below","costs",-0.1),0.5),light:"morning"});}},
    // its own lenses
    {at:c.lenses-0.3,place:"swcWard",later:true,keys:[[c.lenses-0.3,960,540,1.0]],draw:(x,tt)=>{
      swc_sheet(x,tt,w("lenses","makes",-0.1),560,200,800,{kick:"Lenses",title:"Made in its own workshop, from 1992",lines:["A few dollars each"]},
        {col:LP.amber,light:"morning",out:c.today-0.6,u:ag_in(tt,w("lenses","few",-0.1),0.5)});}},
    // what got better: the operations, those who pay covering those who can't, and the outcomes
    {at:c.today-0.3,place:"swcWard",later:true,keys:[[c.today-0.3,960,540,1.0]],draw:(x,tt)=>{const f0=w("today","four",-0.2);
      if(tt>=f0)lp_figure(x,240,190,680,{kick:"Aravind's hospitals, today",num:"400,000+",label:"Operations a year, more than half free or for very little"},{col:LP.green,light:"morning",a:ag_in(tt,f0,0.35),k:tt-f0});
      swc_sheet(x,tt,w("pays","pay",-0.1),1000,190,680,{kick:"And it holds",lines:["Those who pay cover those who can't","2007: complications in under 2 operations in 100"]},
        {col:LP.green,light:"morning",u:swc_u(tt,[w("pays","cover",-0.1),w("pays","complications",-0.2)])});}},
    // a data team, and the same question
    {at:c.data-0.3,place:"lpRoom",keys:[[c.data-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      swc_sheet(x,tt,w("data","team",-0.2),560,180,800,{kick:"A data team",title:"Who is each service for?"},{col:LP.blue,light:"day",out:c.breath+0.2});
      const l0=w("design","layer",-0.6);if(tt>=l0-0.2)swc_layers(x,560,390,800,{a:1-ag_in(tt,c.breath+0.2,0.8),u:SWC_LAYERS.map((_,i)=>ag_in(tt,l0+i*0.18,0.6)),compact:1,light:"day"});}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,SWC_TITLE,"Know who each service is for, then design every layer","Data management · Architecture that keeps up",{mark:swc_mark});
});

/* ---------------------------------------------------------------- 2. Four services, one page */
scene("services",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const hel=(x,tt,a)=>lp_person(x,"helena",330,640,1.0,{t:tt,a,light:mo});
  ag_shots(ctx,S,t,sc.dur,[
    // the series, said once
    {at:0,place:"swcMay",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      swc_sheet(x,tt,0.9,560,240,800,{kick:"Architecture that keeps up",title:"The product owner's side of the job",lines:["Borrowed from architecture"]},
        {col:LP.blue,light:"morning",out:c.may-0.6,u:ag_in(tt,w("series","borrow",-0.1),0.5)});}},
    // May 2027: the strategy approved; the team's work run as a business
    {at:c.may-0.3,place:"swcMay",later:true,keys:[[c.may-0.3,960,540,1.0]],draw:(x,tt)=>{
      swc_sheet(x,tt,w("may","council",-0.3),760,170,760,{kick:"Tuesday 27 April 2027",title:"The data strategy, approved",sub:"By the data council"},{light:"morning",out:c.run-0.5});
      swc_sheet(x,tt,w("run","business",-0.2),760,170,760,{kick:"Helena's team",title:"A business of its own",lines:["Suppliers","Customers"]},
        {col:LP.blue,light:"morning",out:c.first-0.5,u:swc_u(tt,[w("run","suppliers",-0.1),w("run","customers",-0.1)])});
      hel(x,tt,ag_in(tt,c.may+0.4,0.6));}},
    // the four services, on one page
    {at:c.first-0.3,place:"swcMay",later:true,keys:[[c.first-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=w("first","services",-0.2);
      if(tt>=p0)swc_services(x,760,120,760,{a:ag_in(tt,p0,0.35)*(1-ag_in(tt,c.suppliers-0.7,0.4)),k:tt-p0,light:"morning",
        u:[ag_in(tt,c.products+0.2,0.5),ag_in(tt,c.platform+0.2,0.5),ag_in(tt,c.analysis+0.2,0.5),ag_in(tt,c.advice+0.2,0.5)]});
      swc_tag(x,tt,w("catalogue","catalogue",-0.1),c.suppliers-0.7,1140,790,"A service catalogue",{align:"center",col:LP.blue});
      hel(x,tt,1-ag_in(tt,c.suppliers-0.9,0.5));}},
    // its suppliers, and the services between them and the customers
    {at:c.suppliers-0.3,place:"swcMay",later:true,keys:[[c.suppliers-0.3,960,540,1.0]],draw:(x,tt)=>{
      swc_chain(x,{a:ag_in(tt,c.suppliers-0.1,0.4),sup:ag_in(tt,w("suppliers","payroll",-0.2),3.4),cus:0,light:"morning"});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("may","university",-0.3),c.first,0.5)});
  swc_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Who each is for */
const SWC_CUST=[
  {line:"decide",who:"People who decide",hurts:"two numbers for the same thing",wants:"answers they can defend, in time",x:120,y:130},
  {line:"partners",who:"Data partners",hurts:"weeks of waiting for access",wants:"to build their own products",x:980,y:130},
  {line:"readers",who:"Analysts and report readers",hurts:"which table can they trust?",wants:"to find it, trust it and use it",x:120,y:470},
  {line:"whose",who:"Staff and students",hurts:"who can see their data?",wants:"used fairly, and kept safe",x:980,y:470}];
scene("customers",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  ag_shots(ctx,S,t,sc.dur,[
    // the customers, in four groups, on the right of the chain
    {at:0,place:"swcMay",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      swc_chain(x,{a:1-ag_in(tt,c.decide-0.7,0.4),sup:1,cus:ag_in(tt,w("groups","four",-0.2),2.4),light:"morning"});
      swc_tag(x,tt,w("listen","thirty-one",-0.1),c.decide-0.7,960,840,"From 31 conversations, in Listen first",{align:"center",col:LP.ink});}},
    // each group: what hurts, and what drives them
    {at:c.decide-0.3,place:"swcMay",later:true,keys:[[c.decide-0.3,960,540,1.0]],draw:(x,tt)=>{
      for(const g of SWC_CUST){const t0=c[g.line]-0.1;if(tt<t0)continue;
        swc_customer(x,g.x,g.y,820,g,{a:ag_in(tt,t0,0.35)*(1-ag_in(tt,c.noor-0.7,0.4)),k:tt-t0,light:"morning",u:ag_in(tt,t0+0.8,1.6)});}
      swc_tag(x,tt,w("canvas","canvas",-0.3),c.noor-0.7,960,840,"Pains and gains: the value proposition canvas",{align:"center",col:LP.ink});}},
    // Noor puts the services and their customers on her map
    {at:c.noor-0.3,place:"swcMay",later:true,keys:[[c.noor-0.3,960,540,1.0]],draw:(x,tt)=>{
      const tail=1-ag_in(tt,sc.dur-1.4,0.6);
      lp_screen(x,150,150,1180,640,{a:ag_in(tt,c.noor,0.5)*tail,draw:(cx,X,Y,Wd,Hd)=>swc_map(cx,X,Y,Wd,Hd,{sv:ag_in(tt,w("noor","services",-0.1),1.4),cu:ag_in(tt,w("noor","customers",-0.1),1.4)})});
      lp_nameTag(x,1450,240,"noor",{role:"The data architect",a:ag_in(tt,w("noor","Noor",-0.1),0.5)*tail});
      lp_person(x,"noor",1620,660,0.95,{t:tt,flip:true,a:ag_in(tt,c.noor-0.2,0.6),light:mo});}}
  ]);
  swc_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Down every layer */
scene("layers",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"};
  const L0=[w("five","strategy",-0.1),w("five","business",-0.1),w("five","information",-0.1),w("five","application",-0.1),w("five","technology",-0.1)];
  const HL=[["strategy",0],["business",1],["info",2],["app",3],["tech",4]];
  ag_shots(ctx,S,t,sc.dur,[
    // Helena and Noor, and the one service they walk down
    {at:0,place:"swcMay",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.five-0.9,0.5);
      swc_sheet(x,tt,w("walk","governed",-0.2),660,170,600,{kick:"One service",title:"Governed data products"},{col:LP.blue,light:"morning",out:c.five-0.7});
      lp_person(x,"helena",330,640,1.0,{t:tt,a:g*ag_in(tt,0.4,0.6),light:mo});lp_person(x,"noor",1620,660,0.95,{t:tt,flip:true,a:g,light:mo});}},
    // five layers, a picture each
    {at:c.five-0.3,place:"swcMay",later:true,keys:[[c.five-0.3,960,540,1.0]],draw:(x,tt)=>{
      let hl=-1;for(const [id,i] of HL)if(tt>=c[id]-0.1)hl=i;if(tt>=c.each-0.2)hl=-1;
      swc_layers(x,360,206,1200,{a:1-ag_in(tt,c.none-0.7,0.4),u:L0.map(t0=>ag_in(tt,t0,0.6)),hl,top:ag_in(tt,w("each","customer",-0.2),0.6),light:"morning"});
      swc_tag(x,tt,w("names","ArchiMate's",-0.2),c.strategy-0.3,960,130,"ArchiMate's layers; TOGAF's data is information",{align:"center",col:LP.ink});}},
    // the old warehouse: the reports no one opens
    {at:c.none-0.3,place:"swcMay",later:true,keys:[[c.none-0.3,960,540,1.0]],draw:(x,tt)=>{const r0=w("none","warehouse",-0.1);
      swc_reports(x,540,170,{a:ag_in(tt,r0,0.4),u:ag_in(tt,r0,1.4),amb:ag_in(tt,w("none","seventeen",-0.1),1.0)});
      swc_sheet(x,tt,w("none","seventeen",0.2),560,620,800,{kick:"The old warehouse",title:"17 of 38 reports, unopened in a year"},{col:LP.amber,light:"morning"});
      swc_pill(x,tt,w("why","why",-0.1),null,1650,380,"Why is it there?",{col:LP.amber});}}
  ]);
  swc_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Every request lands somewhere */
// which service each of the 42 requests lands on: 15 products, 8 platform, 12 analysis, 7 advice, mixed
const SWC_LAND=(()=>{const n=[15,8,12,7],out=[],left=n.slice();let i=0;while(out.length<42){const k=[0,2,1,0,3,2,0,1,2,3,0,2][i%12];i++;if(left[k]>0){left[k]--;out.push(k);}
  else{const j=left.findIndex(v=>v>0);left[j]--;out.push(j);}}return out;})();
scene("door",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),gy={light:"grey"};
  const f0=w("list","forty-two",-0.3),step=0.11,fly=0.9,fill0=w("fill","joins",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"swcJune",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      lp_door(x,860,180,200,400,{open:ag_in(tt,w("open","opens",-0.2),1.2)});
      swc_sheet(x,tt,0.8,120,170,620,{kick:"Monday 7 June 2027",title:"One front door"},{light:"grey"});
      const n=[0,0,0,0];SWC_LAND.forEach((k,j)=>{const u=(tt-f0-j*step)/fly;if(u>=1)n[k]++;else swc_flyer(x,960,420,k,u);});
      n[3]+=ag_in(tt,fill0+1.0,0.3)>=1?1:0;
      swc_door(x,{n,none:ag_in(tt,w("three","none",-0.2),1.0),hand:ag_in(tt,w("hand","digital",-0.2),1.4),fill:ag_in(tt,fill0,1.2),light:"grey"});
      swc_pill(x,tt,f0+42*step+0.6,c.three-0.4,1440,330,"42 of 45 land on a service",{col:LP.green,icon:"tick"});
      swc_tag(x,tt,w("graham","analysis",-0.1),c.three-0.4,SWC_TRAYX[2]+SWC_TRAYW/2,600,"Graham's rooms",{align:"center",col:LP.green});
      swc_tag(x,tt,w("hand","digital",-0.1),c.fill-0.4,1850,200,"To digital services, with a note",{align:"right",col:LP.ink});
      swc_tag(x,tt,w("fill","gap",-0.1),c.gap-0.4,1850,200,"A gap the team can fill",{align:"right",col:LP.blue});
      swc_pill(x,tt,w("gap","shows",-0.1),null,1400,120,"Where the page needs to change",{col:LP.blue});}}
  ]);
  swc_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back to Madurai: the hospital's one sentence, framed on the team's wall
    {at:0,place:"swcMay",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      swc_print(x,200,150,720,ag_in(tt,0.8,0.6));
      swc_sheet(x,tt,w("back","sentence",-0.1),200,600,720,{title:"Sight, for everyone who needs it"},{col:LP.blue,light:"morning"});
      swc_pill(x,tt,w("helena","request",-0.1),null,1180,330,"Every request: its service",{col:LP.green,icon:"tick"});
      swc_pill(x,tt,w("helena","system",-0.1),null,1180,430,"Every system: its customer",{col:LP.green,icon:"tick"});
      lp_person(x,"helena",1600,640,1.0,{t:tt,flip:true,a:ag_in(tt,c.helena-0.6,0.6),light:mo});}},
    // what to do on Monday; then the five layers under the customers, the whole film in one shape
    {at:c.define-0.3,place:"swcMay",later:true,keys:[[c.define-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        swc_sheet(x,tt,c.define+0.3,140,170,520,{kick:"One",title:"Write your services on one page"},{col:LP.blue,light:"morning"});
        swc_sheet(x,tt,w("name","suppliers",-0.2),700,170,520,{kick:"Two",title:"Name suppliers and customers, in groups"},{light:"morning"});
        swc_sheet(x,tt,w("walk","layer",-0.3),1260,170,520,{kick:"Three",title:"Walk each service down every layer"},{col:LP.blue,light:"morning"});
        swc_sheet(x,tt,w("ask","why",-0.2),560,520,800,{kick:"Four",title:"If a system serves no one, ask why"},{col:LP.amber,light:"morning"});
        x.restore();}
      const l0=w("take","layer",-0.6);if(tt>=c.take-0.2)swc_layers(x,560,290,800,{a:ag_in(tt,c.take-0.2,0.6)*(1-ag_in(tt,e0,0.8)),u:SWC_LAYERS.map((_,i)=>ag_in(tt,l0+i*0.15,0.6)),compact:1,top:ag_in(tt,w("take","who",-0.1),0.6),light:"morning"});}}
  ]);
  lp_end(ctx,S,t,e0,SWC_TITLE,SWC_LAST,"Film 1 of 3","Architecture that keeps up",{mark:swc_mark});
  swc_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["customers","layers"]);
