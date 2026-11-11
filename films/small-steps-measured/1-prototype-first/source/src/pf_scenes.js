/* ===== Prototype first: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const PF_TITLE="Prototype first",PF_LAST="Something real in front of them in two weeks; learn; repeat.";
const PF_DM={module:"Data management",mark:dm_mark};
function pf_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"1",PF_TITLE,{a});}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function pf_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
const pf_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
function pf_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
function pf_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// the film's own time at a chapter's t, so whoever is in two chapters that join in one room breathes and blinks on, unbroken
function pf_ft(id,t){let s=0;for(const q of SCENES){if(q.id===id)return s+t;s+=q.dur;}return t;}
// the Friday reviews, in the team's room: Helena and Graham before the screen, facing it
function pf_review(x,ft,a){const lt={light:"late"};lp_person(x,"helena",1460,680,0.9,{t:ft,flip:true,a,light:lt});lp_person(x,"graham",1790,670,0.95,{t:ft+3,flip:true,a,light:lt});}
const PF_REV={x:1236,y:140,w:650};   // where their words go, on the wall above them

/* ---------------------------------------------------------------- 1. A street in a weekend: Curitiba, May 1972 */
// the people of the street: on the pavement, squeezed there by the cars; on the stones once the street is theirs
const PF_PAVE=pf_folk(301,6,{y0:724,y1:732,s:0.82,v:34});
const PF_SQUEEZE=pf_folk(302,13,{y0:722,y1:734,s:0.82,v:26});
const PF_STROLL=pf_folk(303,9,{y0:772,y1:884,s:0.9,v:20});
const PF_TODAY=pf_folk(304,13,{y0:768,y1:886,s:0.9,v:22});
const PF_CREW=[{x:1560,v:6,y:886,s:0.92,c:1,k:3},{x:1690,v:-5,y:880,s:0.92,c:5,k:1},{x:1250,v:4,y:884,s:0.92,c:1,k:5}];
const PF_BEDS=[330,860,1390];
const PF_KIDS=[420,560,720,880,1030,1190,1340,1490];
// the old lamps, and the new ones that rise in their place over the weekend
function pf_lamps(x,o){for(let i=0;i<4;i++){const lx=200+i*500;pf_lamp(x,lx,{kind:"old",glow:o.glow||0,a:1-(o.nw?o.nw[i]:0)});if(o.nw&&o.nw[i]>0)pf_lamp(x,lx+40,{kind:"new",glow:o.glow||0,k:o.nw[i]});}}
scene("street",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const close=w("crews","close",-0.2),truck0=w("crews","truck",-0.5),stone=tt=>tt<c.saturday?lerp(0.03,0.2,ag_sine((tt-c.real)/(c.saturday-c.real))):lerp(0.3,1,ag_sine((tt-c.saturday)/(c.flowers-c.saturday)));
  const nw=tt=>[0,1,2,3].map(i=>ag_in(tt,w("weekend","streetlights",-0.4)+i*0.35,0.9)),kio=tt=>[0,1].map(i=>ag_in(tt,w("weekend","kiosks",-0.3)+i*0.4,0.8));
  const sun=tt=>ag_in(tt,c.weekend+0.2,2.6);
  ag_shots(ctx,S,t,sc.dur,[
    // Friday evening: the road full, crawling; the crews arrive by truck and close it to cars, and the cars drive off
    {at:0,place:"pfDusk",keys:[[0,960,560,1.06],[c.when+0.4,960,540,1.0]],d:3,draw:(x,tt)=>{
      pf_lamps(x,{glow:1});pf_walkers(x,tt,PF_PAVE);pf_traffic(x,tt,{close});
      pf_barrier(x,1830,{a:ag_in(tt,close,0.6)});pf_barrier(x,110,{a:ag_in(tt,close+0.6,0.6)});
      if(tt>truck0)pf_truck(x,lerp(2320,1480,ag_sine((tt-truck0)/3.2)),{y:892});
      pf_sheet(x,tt,w("when","Curitiba",-0.2),120,110,640,{kick:"The south of Brazil",title:"Curitiba",lines:["Friday 19 May 1972, six in the evening"]},
        {light:null,pin:false,out:c.cars-0.7,u:ag_in(tt,w("when","Friday",-0.1),0.5)});
      pf_tag(x,tt,w("crews","Quinze",-0.2),c.cars-0.7,120,410,"Rua XV de Novembro",{col:LP.ink});}},
    // the years before: cars and buses filled it, people on foot squeezed to its edges; the plan to widen; the mayor's idea
    {at:c.cars-0.3,place:"pfDay",later:true,keys:[[c.cars-0.3,960,540,1.0]],draw:(x,tt)=>{
      pf_lamps(x,{});pf_walkers(x,tt,PF_SQUEEZE);pf_traffic(x,tt,{});pf_doom(x,{u:ag_in(tt,w("plan","knocking",-0.2),1.4)*(1-ag_in(tt,c.fear-0.9,0.5))});
      pf_tag(x,tt,w("cars","squeezed",-0.2),c.plan-0.4,960,590,"People on foot, squeezed to the edges",{align:"center",col:LP.amber});
      pf_sheet(x,tt,w("plan","widen",-0.2),120,110,620,{kick:"One plan",title:"Widen the streets",lines:["Knock down buildings from about 1900"]},
        {col:LP.amber,light:null,pin:false,out:c.mayor-0.6,u:ag_in(tt,w("plan","knocking",-0.1),0.5)});
      pf_sheet(x,tt,w("mayor","Jaime",-0.3),120,110,620,{kick:"The mayor, an architect",title:"Jaime Lerner",lines:["Give the street back to people on foot"]},
        {col:LP.blue,light:null,pin:false,out:c.fear-0.7,u:ag_in(tt,w("mayor","given",-0.2),0.5)});}},
    // one shop: the shopkeepers' fear, and the plan on paper that couldn't show them the street
    {at:c.fear-0.3,place:"pfShop",dis:1.4,keys:[[c.fear-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,PF_PEOPLE.shopkeeper,700,640,1.0,{t:tt,light:{light:"day"}});
      pf_sheet(x,tt,w("fear","feared",-0.2),1060,170,700,{kick:"The shopkeepers' fear",title:"No cars, no customers",lines:["Their sales would fall"]},
        {col:LP.amber,light:null,pin:false,out:c.change-0.5,u:ag_in(tt,w("fear","sales",-0.1),0.5)});
      pf_tag(x,tt,w("change","Arguing",-0.1),null,1410,140,"Plans on paper",{align:"center",col:LP.amber});
      const p0=w("change","plans",-0.2);if(tt>=p0)pf_sketch(x,1060,210,700,{a:ag_in(tt,p0,0.35),k:tt-p0});
      pf_tag(x,tt,w("change","show",-0.2),null,1410,700,"It can't show what the street would be like",{align:"center",col:LP.amber});}},
    // Friday night: the real thing, built fast; the crews at work, the first stones laid from the end of the street
    {at:c.real-0.3,place:"pfDusk",dis:1.4,keys:[[c.real-0.3,960,540,1.0]],draw:(x,tt)=>{
      pf_road(x,{stone:stone(tt)});pf_lamps(x,{glow:1});pf_barrier(x,1830,{});pf_barrier(x,110,{});pf_truck(x,1480,{y:892});pf_walkers(x,tt,PF_CREW);
      pf_pill(x,tt,w("real","real",-0.2),null,960,300,"The real thing, fast",{col:LP.blue});}},
    // Saturday morning, grey and damp: handed to the people; over the weekend, the stones, the lamps, the kiosks and the flowers; the
    // next weekend, the drivers, the paper and the children painting
    {at:c.saturday-0.3,place:"pfGrey",later:true,keys:[[c.saturday-0.3,960,540,1.0]],draw:(x,tt)=>{const sa=sun(tt);
      if(sa>0.004){x.save();x.globalAlpha*=sa;x.drawImage(ag_place("pfSun"),0,0);x.restore();}
      const k=stone(tt),edge=W*(1-k),crew=1-ag_in(tt,c.flowers-0.4,0.8),cars=w("drivers","drivers",-0.4);
      pf_road(x,{stone:k});pf_lamps(x,{nw:nw(tt)});kio(tt).forEach((u,i)=>pf_kiosk(x,640+i*640,{k:u}));
      pf_barrier(x,1830,{a:1-ag_in(tt,c.flowers+1.0,0.6)});pf_barrier(x,110,{a:1-ag_in(tt,c.flowers+1.0,0.6)});
      pf_walkers(x,tt,[{x:edge+40,v:0,y:884,s:0.92,c:1,k:3,a:crew},{x:edge+140,v:0,y:878,s:0.92,c:5,k:1,a:crew}]);
      PF_BEDS.forEach((bx,i)=>pf_bed(x,bx,{k:ag_in(tt,w("flowers","planted",-0.2)+i*0.35,2.2)}));
      pf_walkers(x,tt,PF_STROLL,{a:ag_in(tt,c.saturday+0.2,1.0)*(1-ag_in(tt,c.drivers-0.9,0.8))});
      // the drivers come from the end of the street, and stop at the paper
      if(tt>cars){pf_car(x,lerp(-340,150,ag_sine((tt-cars)/2.6)),850,{col:PF_K.cloth[4]});pf_car(x,lerp(-600,-110,ag_sine((tt-cars-0.3)/2.6)),850,{col:PF_K.cloth[1]});}
      const p0=w("painting","paper",-0.4),k0=w("painting","children",-0.4);
      pf_paper(x,320,1660,{y:846,u:ag_in(tt,k0+0.6,6.0),a:ag_in(tt,p0,0.6)});
      PF_KIDS.forEach((kx,i)=>pf_child(x,kx,852,1.0,{a:ag_in(tt,k0+i*0.12,0.6),col:PF_K.cloth[(i*2+1)%6],skin:PF_SKIN[i%6],ph:tt*2+i,flip:i%2===1}));
      pf_sheet(x,tt,w("saturday","handed",-0.3),120,110,640,{kick:"Saturday morning",title:"Handed to the people",lines:["Grey and damp, and no ceremony"]},
        {light:null,pin:false,out:c.weekend+1.6,u:ag_in(tt,w("saturday","ceremony",-0.2),0.5)});
      pf_tag(x,tt,w("flowers","thousands",-0.3),c.drivers-0.4,120,140,"Tens of thousands of flowers",{col:LP.green});
      pf_tag(x,tt,w("drivers","next",-0.2),c.sales-0.6,120,140,"The next weekend",{col:LP.ink});
      pf_tag(x,tt,w("painting","children",-0.1),c.sales-0.6,120,210,"Strips of paper, and children painting",{col:LP.green});}},
    // the shop again: within days, sales up a little; and the shopkeepers asking for more of the street
    {at:c.sales-0.3,place:"pfShop",dis:1.4,keys:[[c.sales-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,PF_PEOPLE.shopkeeper,700,640,1.0,{t:tt,light:{light:"day"}});
      pf_sheet(x,tt,w("sales","shopkeepers",-0.3),1060,170,700,{kick:"Within days",title:"Sales up a little",lines:["The shopkeepers tell the newspapers"]},
        {col:LP.green,light:null,pin:false,u:ag_in(tt,w("sales","newspapers",-0.2),0.5)});
      pf_tag(x,tt,w("more","asking",-0.2),null,1410,640,"Asking for more of the street",{align:"center",col:LP.green});}},
    // fifty years on: still a street for people on foot; the real thing, put before the people who had to decide
    {at:c.today-0.3,place:"pfSun",dis:1.4,keys:[[c.today-0.3,960,540,1.0]],draw:(x,tt)=>{
      pf_road(x,{stone:1});pf_lamps(x,{nw:[1,1,1,1]});pf_kiosk(x,640,{});pf_kiosk(x,1280,{});PF_BEDS.forEach(bx=>pf_bed(x,bx,{k:1}));pf_walkers(x,tt,PF_TODAY);
      pf_sheet(x,tt,w("today","fifty",-0.3),120,110,700,{kick:"Fifty years on",title:"Still a street for people on foot",lines:["Other streets followed"]},
        {col:LP.green,light:null,pin:false,out:c.paper-0.3,u:ag_in(tt,w("today","Other",0),0.5)});
      pf_sheet(x,tt,w("paper","put",-0.3),120,110,700,{kick:"Not on paper",title:"The real thing, in front of the people who decide"},
        {col:LP.blue,light:null,pin:false,out:c.data-0.6});}},
    // a data team, the same way: the street framed on the team's wall
    {at:c.data-0.3,place:"lpRoom",dis:1.4,keys:[[c.data-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.breath+0.2,0.8);
      pf_print(x,200,170,720,ag_in(tt,c.data-0.2,0.6)*g);
      pf_sheet(x,tt,w("data","team",-0.2),200,620,720,{kick:"A data team",title:"The same way"},{col:LP.blue,light:"day",out:c.breath+0.2});
      if(tt>=c.way-0.2)pf_loop(x,1420,470,{u:pf_u(tt,[w("way","real",-0.3),w("way","learn",-0.2),w("way","again",-0.3)]),a:g});}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,PF_TITLE,"Something real in front of the person who decides","Data management · Small steps, measured",PF_DM);
});

/* ---------------------------------------------------------------- 2. The question behind the dashboard */
scene("question",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),gy={light:"grey"},mo={light:"morning"},ft=tt=>pf_ft("question",tt);
  ag_shots(ctx,S,t,sc.dur,[
    // February 2027: Graham's request
    {at:0,place:"pfFeb",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"graham",1480,640,1.0,{t:ft(tt),flip:true,a:ag_in(tt,0.3,0.6),light:gy});
      lp_nameTag(x,1480,270,"graham",{align:"center",role:"Director of Facilities",a:ag_in(tt,w("ask","Graham",-0.1),0.5)});
      pf_sheet(x,tt,w("ask","February",-0.2),160,170,640,{kick:"February 2027",title:"A request from Facilities"},{light:"grey",out:c.email-0.5});
      pf_sheet(x,tt,c.email-0.05,160,170,700,{kick:"From Graham Ellis",title:"A dashboard of room use, by Easter?"},{light:"grey"});}},
    // the question behind it: a new teaching building, and its price
    {at:c.behind-0.3,place:"lpSky",dis:1.4,keys:[[c.behind-0.3,960,540,1.0]],draw:(x,tt)=>{
      pf_campus(x,{ghost:ag_in(tt,w("behind","new",-0.2),1.2)});
      pf_sheet(x,tt,w("behind","bigger",-0.2),120,130,640,{kick:"The question behind it",title:"Ask the University Council for a new building?"},{col:LP.blue,light:null,pin:false});
      pf_tag(x,tt,w("behind","building",-0.3),c.cost-0.3,1460,420,"A new teaching building",{align:"center",col:LP.blue});
      const f0=w("cost","cost",-0.2);if(tt>=f0)lp_figure(x,1080,110,760,{kick:"A new teaching building",num:"A$140 million",label:"About what it would cost"},{col:LP.amber,light:null,pin:false,a:ag_in(tt,f0,0.35),k:tt-f0});}},
    // then the request waits, as every request did
    {at:c.waited-0.3,place:"lpRoom",dis:1.4,keys:[[c.waited-0.3,960,540,1.0]],draw:(x,tt)=>{
      pf_queue(x,1000,150,{u:ag_in(tt,c.waited,1.6),mine:ag_in(tt,w("waited","request",-0.2),0.4),mk:tt-w("waited","request",-0.2),light:"day"});
      const f0=w("waited","forty-one",-0.3);if(tt>=f0)lp_figure(x,140,200,640,{kick:"Every request, on average",num:"41 days",label:"Working days, from asking to first use"},{col:LP.amber,light:"day",a:ag_in(tt,f0,0.35),k:tt-f0});}},
    // Tuesday 30 March: taken up the new way; Ivy's page; the real data, governed from the first day
    {at:c.newway-0.3,place:"pfApr",dis:1.4,keys:[[c.newway-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"helena",300,640,1.0,{t:ft(tt),a:ag_in(tt,c.newway-0.3,0.6),light:mo});
      lp_nameTag(x,300,270,"helena",{align:"center",a:ag_in(tt,w("newway","Helena's",-0.2),0.5)});
      pf_sheet(x,tt,w("newway","Tuesday",-0.2),620,170,720,{kick:"Tuesday 30 March 2027",title:"Taken up the new way",lines:["As Helena's ninety-day plan set out"]},
        {col:LP.blue,light:"morning",out:c.page-0.6,u:ag_in(tt,w("newway","plan",-0.2),0.5)});
      lp_person(x,"ivy",1640,640,1.0,{t:ft(tt)+5,flip:true,a:ag_in(tt,c.page-0.3,0.6),light:mo});
      lp_nameTag(x,1640,270,"ivy",{align:"center",a:ag_in(tt,w("page","Ivy",-0.1),0.5)});
      const p0=w("page","drawn",-0.3);if(tt>=p0)pf_page(x,620,150,720,{a:ag_in(tt,p0,0.35)*(1-ag_in(tt,c.data-0.6,0.4)),k:tt-p0,u:ag_in(tt,w("page","route",-0.2),2.2),rooms:ag_in(tt,w("rooms","rooms",-0.2),0.6),light:"morning"});
      pf_sheet(x,tt,w("data","bookings",-0.3),620,150,720,{kick:"Real data",title:"Thirteen weeks of bookings",lines:["From the timetable"]},{col:LP.orange,light:"morning",out:sc.dur-0.9});
      pf_sheet(x,tt,w("data","sensors",-0.3),620,420,720,{title:"Head counts",lines:["From the rooms' sensors"]},{col:LP.orange,light:"morning",out:sc.dur-0.9});
      pf_tag(x,tt,w("governed","counts",-0.2),sc.dur-0.9,980,680,"Counts per room, per hour",{align:"center",col:LP.orange});
      pf_pill(x,tt,w("governed","never",-0.2),sc.dur-0.9,980,770,"Never a person",{col:LP.green,icon:"tick"});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,w("ask","university's",-0.3),c.behind-0.3,0.5)});
  pf_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Something real in two weeks */
scene("real",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},ft=tt=>pf_ft("real",tt);
  const zoom=ag_io(t,c.heat-0.3,c.mind+1.1,0.6);  // back once the camera is home
  ag_shots(ctx,S,t,sc.dur,[
    // the Agile Manifesto, said once
    {at:0,place:"pfApr",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      pf_sheet(x,tt,c.manifesto+0.3,560,220,800,{kick:"The Agile Manifesto, 2001",title:"Working software over comprehensive documentation"},{light:"morning",out:c.first-0.6});}},
    // the first round asks one thing
    {at:c.first-0.3,place:"pfApr",keys:[[c.first-0.3,960,540,1.0]],draw:(x,tt)=>{
      const r0=w("first","round",-0.3);if(tt>=r0)pf_rounds(x,160,150,1600,{a:ag_in(tt,r0,0.35)*(1-ag_in(tt,c.draft-0.7,0.4)),k:tt-r0,u:ag_in(tt,r0+0.2,1.6),lit:tt>=w("first","one",0)?1:0,light:"morning"});
      pf_sheet(x,tt,w("first","when",-0.2),360,540,1200,{kick:"Round 1 asks one thing",title:"When are rooms booked, and when used, hour by hour?"},{col:LP.blue,light:"morning",out:c.draft-0.7});}},
    // Wednesday 7 April: the agent's draft, wrong in one place; Ivy catches it; the definition in the glossary; Jun's review
    {at:c.draft-0.3,place:"pfApr",keys:[[c.draft-0.3,960,540,1.0]],draw:(x,tt)=>{
      const ag=ag_in(tt,c.draft,0.6)*(1-ag_in(tt,c.glossary-0.2,0.6));
      if(ag>0.004){x.save();x.globalAlpha*=ag;ag_modelLight(x,1560,420,78,1);ag_model(x,1560,420,78,{t:tt,core:1,think:ag_io(tt,w("draft","drafts",-0.2),c.wrong,0.4)});x.restore();
        lp_tag(x,1560,560,"The team's agent",{align:"center",col:LP.violet,a:ag});}
      const d0=w("draft","drafts",-0.2);if(tt>=d0)pf_draft(x,540,180,780,{a:ag_in(tt,d0,0.35)*(1-ag_in(tt,c.glossary-0.5,0.4)),k:tt-d0,u:ag_in(tt,d0+0.3,1.6),flag:ag_in(tt,w("wrong","booked",-0.1),0.5),light:"morning"});
      pf_tag(x,tt,w("draft","Wednesday",-0.1),c.caught-0.4,930,620,"Wednesday 7 April",{align:"center",col:LP.ink});
      lp_person(x,"ivy",260,640,1.0,{t:ft(tt),a:ag_in(tt,c.caught-0.2,0.6),light:mo});
      pf_tag(x,tt,w("caught","notes",-0.2),c.glossary-0.5,930,630,"Read to the end",{align:"center",col:LP.ink});
      pf_tag(x,tt,w("caught","sensors",-0.3),c.glossary-0.5,930,710,"Checked against the sensors",{align:"center",col:LP.orange});
      pf_sheet(x,tt,w("glossary","glossary",-0.3),540,170,460,{kick:"The glossary",title:"Room use",lines:["People in the room, hour by hour","Owner: Graham Ellis"]},
        {col:LP.blue,light:"morning",out:c.fast-0.5,u:ag_in(tt,w("glossary","people",-0.2),0.8)});
      pf_sheet(x,tt,w("glossary","model",-0.3),1040,170,460,{kick:"The model",title:"Room use, booked and used",lines:["Built from the glossary"]},{col:LP.orange,light:"morning",out:c.fast-0.5});
      lp_person(x,"jun",1720,640,1.0,{t:ft(tt)+2,flip:true,a:ag_in(tt,c.review-0.2,0.6),light:mo});
      lp_nameTag(x,1720,270,"jun",{align:"center",a:ag_in(tt,w("review","Jun",-0.1),0.5)*(1-ag_in(tt,c.fast-0.5,0.4))});
      pf_pill(x,tt,w("review","reviews",-0.1),c.fast-0.5,1270,560,"Reviewed by Jun",{col:LP.green,icon:"tick"});
      pf_sheet(x,tt,w("fast","Fast",-0.1),560,200,800,{kick:"Fast isn't careless",lines:["The agent proposes","People check","No one approves their own work"]},
        {light:"morning",out:c.friday-0.7,u:pf_u(tt,[w("fast","proposes",-0.3),w("fast","check",-0.2),w("fast","approves",-0.3)])});}},
    // Friday 9 April: Graham sees the prototype, a heat map of the week on a dashboard; the question for every round, and his answer
    {at:c.friday-0.3,place:"pfFri",dis:1.4,keys:[[c.friday-0.3,960,540,1.0],[c.heat-0.3,640,480,1.5],[c.mind-0.5,960,540,1.0]],d:1.6,draw:(x,tt)=>{
      const h0=w("heat","heat",-0.3);
      pf_glass(x,PF_SCR,{a:ag_in(tt,c.friday+0.4,0.8),draw:(cx,X,Y,Wd,Hd)=>pf_dash(cx,X,Y,Wd,Hd,{first:true,u:ag_in(tt,h0,2.6)})});
      pf_review(x,ft(tt),1);
      pf_tag(x,tt,w("friday","ten",-0.2),c.heat-0.6,1560,200,"Friday 9 April: ten days in",{align:"center",col:LP.ink});
      pf_sheet(x,tt,w("mind","question",-0.2),PF_REV.x,PF_REV.y,PF_REV.w,{kick:"Helena asks, every round",title:"What would change your mind?"},{col:LP.blue,light:"late",out:c.answer-0.4});
      pf_sheet(x,tt,w("answer","answer",-0.1),PF_REV.x,PF_REV.y,PF_REV.w,{kick:"Graham's answer",lines:["Full all week: ask for the building","If not: don't"]},
        {light:"late",out:sc.dur-0.9,u:pf_u(tt,[w("answer","full",-0.2),w("answer","aren't",-0.3)])});}}
  ]);
  pf_kick(ctx,S,1-zoom);
});

/* ---------------------------------------------------------------- 4. Three rounds, a week each */
scene("rounds",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},dy={light:"day"},ft=tt=>pf_ft("rounds",tt);
  const close=ag_io(t,c.showed-0.3,c.right+1.1,0.5);  // back once the close-up has dissolved
  ag_shots(ctx,S,t,sc.dur,[
    // rounds of a week, each ending on a Friday with the person who decides and the real thing
    {at:0,place:"pfApr",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      pf_rounds(x,160,150,1600,{a:ag_in(tt,c.rounds-0.2,0.4),k:tt-c.rounds+0.2,u:ag_in(tt,c.rounds,1.8),light:"morning"});
      pf_sheet(x,tt,w("scrum","Scrum",-0.1),360,540,1200,{kick:"Scrum calls it",title:"A sprint review",lines:["Here: half an hour with Graham, at one screen"]},
        {col:LP.blue,light:"morning",u:ag_in(tt,w("scrum","Here",-0.1),0.5)});}},
    // Wednesday 14 April: Graham uses it himself, with his team
    {at:c.used-0.3,place:"pfGraham",dis:1.4,keys:[[c.used-0.3,960,540,1.0]],draw:(x,tt)=>{
      pf_glass(x,PF_GSCR,{draw:(cx,X,Y,Wd,Hd)=>pf_dash(cx,X,Y,Wd,Hd,{first:true})});
      lp_person(x,lp_crowd(2),190,690,0.9,{t:ft(tt)+4,light:dy});lp_person(x,"graham",450,650,1.0,{t:ft(tt),light:dy});
      pf_pill(x,tt,w("used","uses",-0.3),null,1280,92,"First used, Wednesday 14 April",{col:LP.green,icon:"tick"});}},
    // it had waited seven weeks; then the new way took 11 working days, against 41; as in Curitiba, the talk changes
    {at:c.waited-0.3,place:"pfApr",dis:1.4,keys:[[c.waited-0.3,960,540,1.0]],draw:(x,tt)=>{
      pf_days(x,210,230,1500,{a:ag_in(tt,c.waited-0.1,0.35)*(1-ag_in(tt,c.back-0.5,0.4)),k:tt-c.waited+0.1,wait:ag_in(tt,w("waited","seven",-0.3),1.4),took:ag_in(tt,w("took","new",-0.3),1.8),light:"morning"});
      pf_print(x,600,170,720,ag_in(tt,c.back,0.6));
      pf_tag(x,tt,w("back","talk",-0.2),null,960,660,"Once people can use the real thing, the talk changes",{align:"center",col:LP.ink});}},
    // the real thing surprises everyone: booked 38% of the week, but 93% at the peak; one booked hour in five, nobody there
    {at:c.showed-0.3,place:"pfFri",dis:1.4,keys:[[c.showed-0.3,640,480,1.5]],draw:(x,tt)=>{const u0=w("empty","nobody",-0.3);
      pf_glass(x,PF_SCR,{draw:(cx,X,Y,Wd,Hd)=>pf_dash(cx,X,Y,Wd,Hd,{used:ag_in(tt,u0,0.8),peak:ag_in(tt,w("booked","ninety-three",-0.3),0.8),
        figs:[ag_in(tt,w("booked","thirty-eight",-0.3),0.6),ag_in(tt,w("booked","ninety-three",-0.3),0.6),ag_in(tt,u0,0.6)+ag_in(tt,w("empty","half",-0.3),0.6)]})});}},
    // the average hid both: the peak, every room full; a quiet hour, most rooms empty, and the booked ones nobody came to
    {at:c.right-0.3,place:"lpSky",dis:1.4,keys:[[c.right-0.3,960,540,1.0]],draw:(x,tt)=>{
      pf_twoHours(x,{peak:ag_in(tt,c.right,0.8),quiet:ag_in(tt,w("right","saw",-0.3),0.8),empty:ag_in(tt,w("right","empty",-0.3),0.6)});
      pf_tag(x,tt,c.right+0.2,null,PF_HX[0]+768*PF_HK,400,"Tuesday, 11:00: every room full",{align:"center",col:LP.ink});
      pf_tag(x,tt,w("right","saw",-0.2),null,PF_HX[1]+768*PF_HK,400,"Friday, 16:00: most rooms empty",{align:"center",col:LP.ink});
      pf_pill(x,tt,w("right","average",-0.2),null,960,180,"The average hid both",{col:LP.amber});}},
    // the second review: his answer moves
    {at:c.next-0.3,place:"pfFri",dis:1.4,keys:[[c.next-0.3,960,540,1.0]],draw:(x,tt)=>{
      pf_glass(x,PF_SCR,{draw:(cx,X,Y,Wd,Hd)=>pf_dash(cx,X,Y,Wd,Hd,{used:1,peak:1,figs:[1,1,2]})});pf_review(x,ft(tt),1);
      pf_sheet(x,tt,w("next","second",-0.2),PF_REV.x,PF_REV.y,PF_REV.w,{kick:"The second review",title:"Show me it works in 2030",lines:["Planning expects 6% more students"]},
        {col:LP.blue,light:"late",out:sc.dur-0.9,u:ag_in(tt,w("next","Planning",-0.2),0.5)});}}
  ]);
  pf_kick(ctx,S,1-close);
});

/* ---------------------------------------------------------------- 5. Stop when it's enough */
scene("enough",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},dy={light:"day"},ft=tt=>pf_ft("enough",tt);
  ag_shots(ctx,S,t,sc.dur,[
    // Friday 23 April, the third round: short only at the peak; move a sixth of the peak's classes, release the bookings nobody uses
    {at:0,place:"pfFri",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const back=ag_in(tt,0.4,1.2);
      pf_glass(x,PF_SCR,{draw:(cx,X,Y,Wd,Hd)=>pf_dash(cx,X,Y,Wd,Hd,{used:1-back,peak:1,figs:[1-back,1-back,2*(1-back)],short:ag_in(tt,w("third","short",-0.2),0.8),
        arrows:ag_in(tt,w("move","Move",-0.1),2.0),move:ag_in(tt,w("move","other",-0.2),2.4),release:ag_in(tt,w("move","release",-0.2),1.8)})});
      pf_review(x,ft(tt),1);
      pf_sheet(x,tt,w("third","plain",-0.2),PF_REV.x,PF_REV.y,PF_REV.w,{kick:"Friday 23 April, round 3",title:"Short only at the peak"},{col:LP.amber,light:"late",out:c.move-0.3});
      pf_sheet(x,tt,c.move+0.1,PF_REV.x,PF_REV.y,PF_REV.w,{kick:"The answer",lines:["Move one peak class in six","Release the bookings nobody uses"]},
        {col:LP.blue,light:"late",out:c.met-0.4,u:pf_u(tt,[c.move+0.2,w("move","release",-0.3)])});
      pf_sheet(x,tt,w("met","meets",-0.2),PF_REV.x,PF_REV.y,PF_REV.w,{kick:"To 2030",title:"Room enough, without a new building"},{col:LP.green,light:"late",out:c.stop-0.7});}},
    // the decision is served, so the rounds stop: a fourth would only polish it
    {at:c.stop-0.3,place:"pfApr",dis:1.4,keys:[[c.stop-0.3,960,540,1.0]],draw:(x,tt)=>{
      pf_rounds(x,160,150,1600,{a:1-ag_in(tt,c.keep-0.5,0.4),lit:3,used:1,fourth:ag_in(tt,w("stop","fourth",-0.3),0.6),stop:ag_in(tt,w("stop","polish",-0.2),0.8),light:"morning"});
      pf_pill(x,tt,w("stop","served",-0.2),c.keep-0.5,960,580,"The decision is served",{col:LP.green,icon:"tick"});
      // what the prototype taught stays in the product: the definition and the reviewed model
      pf_sheet(x,tt,w("keep","taught",-0.1),260,190,620,{kick:"Kept: the definition",title:"Room use",lines:["People in the room, hour by hour"]},{col:LP.blue,light:"morning",out:c.owns-0.5});
      pf_sheet(x,tt,w("keep","model",-0.3),1040,190,620,{kick:"Kept: the model",title:"Room use, booked and used",lines:["Reviewed by Jun"]},{col:LP.orange,light:"morning",out:c.owns-0.5});
      // and a product of its own, which Ivy owns from July
      lp_person(x,"ivy",1640,640,1.0,{t:ft(tt),flip:true,a:ag_in(tt,c.owns-0.3,0.6)*(1-ag_in(tt,sc.dur-1.6,0.6)),light:mo});
      pf_sheet(x,tt,w("owns","product",-0.3),420,190,900,{kick:"A product of its own",title:"Room use, booked and used, by hour and day",lines:["Owner: Ivy Reyes, from July"]},
        {col:LP.green,light:"morning",out:sc.dur-1.6,u:ag_in(tt,w("owns","Ivy",-0.2),0.5)});}},
    // June: Graham takes one page to the University Council; its decision
    {at:c.council-0.3,place:"pfJune",dis:1.4,keys:[[c.council-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,"graham",520,650,1.0,{t:ft(tt),pose:"hold",hold:pf_held(),light:dy});
      pf_sheet(x,tt,w("council","University",-0.3),880,190,860,{kick:"The University Council, June 2027",title:"Its decision",lines:["The new building: put off for two years","The timetable: to change"]},
        {col:LP.green,light:"day",u:pf_u(tt,[w("decided","building",-0.3),w("decided","timetable",-0.3)])});}}
  ]);
  pf_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back to Curitiba: the street on the team's wall; Helena's team did it in three weeks
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      pf_print(x,200,150,720,ag_in(tt,0.8,0.6));
      pf_sheet(x,tt,w("back","weekend",-0.3),200,600,720,{title:"A street built in a weekend"},{col:LP.green,light:"day"});
      lp_person(x,"helena",1640,640,1.0,{t:tt,flip:true,a:ag_in(tt,c.helena-0.6,0.6),light:dy});
      pf_pill(x,tt,w("helena","three",-0.2),null,1180,300,"Three weeks",{col:LP.green,icon:"tick"});
      pf_pill(x,tt,w("helena","round",-0.2),null,1180,400,"A round at a time",{col:LP.green,icon:"tick"});}},
    // what to do on Monday; then the loop, the whole film in one shape
    {at:c.define-0.3,place:"lpRoom",later:true,keys:[[c.define-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        pf_sheet(x,tt,c.define+0.3,140,170,520,{kick:"One",title:"Something real in front of them, within two weeks"},{col:LP.blue,light:"day"});
        pf_sheet(x,tt,w("data","real",-0.2),700,170,520,{kick:"Two",title:"Real data from the start, governed"},{col:LP.orange,light:"day"});
        pf_sheet(x,tt,w("ask","Ask",-0.2),1260,170,520,{kick:"Three",title:"Ask every round: what would change your mind?"},{col:LP.blue,light:"day"});
        pf_sheet(x,tt,w("stop","short",-0.2),560,520,800,{kick:"Four",title:"Short, fixed rounds; stop when the decision is served"},{col:LP.green,light:"day"});
        x.restore();}
      if(tt>=c.take-0.2)pf_loop(x,960,470,{u:pf_u(tt,[w("take","real",-0.3),w("take","learn",-0.2),w("take","repeat",-0.3)]),a:ag_in(tt,c.take-0.2,0.6)*(1-ag_in(tt,e0,0.8))});}}
  ]);
  lp_end(ctx,S,t,e0,PF_TITLE,PF_LAST,"Film 1 of 4","Small steps, measured",PF_DM);
  pf_kick(ctx,S,1-ag_in(t,e0,0.8));
});
ag_cutInto(["real","enough"]);
