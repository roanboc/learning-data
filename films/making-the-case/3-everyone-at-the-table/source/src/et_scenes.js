/* ===== Everyone at the table: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves, since the whole picture changes. Sheets on a wall
   are drawn before the people who stand in front of it. Sizes in the 1920 x 1080 frame; the kicker sits at the top left from chapter 2,
   so sheets start at y 150 there, and nothing goes below y 890. In the park the cards stand either side of the hall (x 100 to 660, and
   1260 to 1820), so its middle and the elms stay clear. */

const ET_TITLE="Everyone at the table",ET_LAST="Know what each person needs from data; tell everyone the same story.";
const ET_MOD={module:"Data management",mark:dm_mark};
function et_kick(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"3",ET_TITLE,{a});}
function et_where(ctx,S,a){if(a<=0.004)return;setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a});}
// a figure that springs in at t0 and leaves at out (null: stays)
function et_fig(ctx,t,t0,out,x,y,w,words,o){const a=ag_io(t,t0,out==null?1e9:out,0.4);if(a<=0.004)return;lp_figure(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}

/* ---------------------------------------------------------------- small compositions */
// Paxton's sheet: who he was, and a glasshouse of the kind he built, drawing itself (o.u)
function et_paxtonSheet(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=500;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{light:null});lp_T(ctx,"JOSEPH PAXTON",x+LP_PAD,y+80,{w:800,size:28,ls:3,col:LP.mut});lp_T(ctx,"A gardener who built glasshouses",x+LP_PAD,y+152,{w:800,size:40});
  et_glasshouse(ctx,x+80,y+200,w-160,{u:o.u});ctx.restore();}
// the newspaper's page in many hands: twelve small copies, one after another (o.u, 0 to 1); decoration, with no words on them
function et_copies(ctx,x,y,o){o=o||{};const u=clamp(o.u||0,0,1);if(u<=0)return;for(let i=0;i<12;i++){const v=ag_eo(clamp(u*12-i*0.8,0,1));if(v<=0)continue;
  const c=i%4,r=(i/4)|0;ctx.save();ctx.globalAlpha*=v;et_news(ctx,x+c*220,y+r*168,200,{small:true});ctx.restore();}}
// the park as it ended: the opening day's crowd under the glass, the elms inside under the arch
function et_hallOpen(ctx,o){o=o||{};et_crowd(ctx,o.crowd==null?1:o.crowd);et_glassHall(ctx,{u:1,arch:1,lit:o.lit==null?0.6:o.lit,t:o.t});}
// the four answers, where the four worries stood (the elms; no building in the park; the bricks; the time), one after another from t0
const ET_ANSWERS=[[380,190,"The elms stay, inside"],[1540,190,"Down again after"],[380,320,"The same few parts, not bricks"],[1540,320,"Up in months, open on time"]];
function et_answers(ctx,tt,t0,out){ET_ANSWERS.forEach(([px,py,s],i)=>et_pill(ctx,tt,t0+i*0.3,out,px,py,s,{col:LP.green,icon:"tick"}));}
// what each will judge the plan by: their words beside their names, on Helena's map; o.rows (0 to 1: one after another), o.a
const ET_JUDGE=[["Deputy vice-chancellor","“One set of numbers for the University Council”"],["Finance","“Month-end reports right on the first working day”"],
  ["HR","“Every report from our staff list, not a copy”"],["Staff","“Who sees our records, and why?”"],["The data team","“Time to do the move well”"]];
function et_judge(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=560;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  lp_sheet(ctx,x,y,w,h,{light:"day"});lp_T(ctx,"HELENA'S MAP",x+44,y+84,{w:800,size:28,ls:3,col:LP.mut});lp_T(ctx,"What each will judge the plan by",x+44,y+138,{w:800,size:40});
  const r=clamp(o.rows||0,0,1),c2=x+520;ctx.fillStyle=rgba(LP.mut,0.35);ctx.fillRect(x+44,y+176,w-88,2);
  ET_JUDGE.forEach(([n,s],i)=>{const v=clamp(r*5-i,0,1);if(v<=0)return;const yy=y+246+i*66;ctx.save();ctx.globalAlpha*=ag_sine(v);
    ctx.fillStyle=rgba(LP.ink,1);ctx.beginPath();ctx.arc(x+52,yy-10,6,0,TAU);ctx.fill();lp_T(ctx,n,x+76,yy,{w:700,size:28});lp_T(ctx,s,c2,yy,{w:600,size:28});ctx.restore();});
  ctx.restore();}
// a page a month, June to December, each with the plan's six work packages further along; o.u (0 to 1: one after another)
function et_months(ctx,x,y,o){o=o||{};const u=clamp(o.u||0,0,1);if(u<=0)return;
  ET_MONTHS.forEach((m,i)=>{const v=ag_eo(clamp(u*7-i*0.85,0,1));if(v<=0)return;const px=x+i*240;ctx.save();ctx.globalAlpha*=v;
    lp_T(ctx,m.slice(0,3),px+100,y-22,{w:700,size:28,align:"center",col:LP.mut});lp_sheet(ctx,px,y,200,270,{col:LP.blue,light:"day"});
    for(let k=0;k<6;k++){const p=clamp((i+1)/7*1.15-k*0.05,0.06,1),by=y+70+k*30;ctx.fillStyle=rgba(mix(LP.mut,LP.paper,0.8),1);rr(ctx,px+24,by,152,12,6);ctx.fill();
      ctx.fillStyle=rgba(LP.blue,1);rr(ctx,px+24,by,Math.max(12,152*p),12,6);ctx.fill();}
    ctx.restore();});}
// the end card, the takeaway in two lines when it's too wide for one
function et_end(ctx,S,t,t0){setScreen(ctx,S);if(lp_tw(ctx,ET_LAST,{w:700,size:48})<=1600)return lp_end(ctx,S,t,t0,ET_TITLE,ET_LAST,"Film 3 of 4","Making the case",ET_MOD);
  lp_end(ctx,S,t,t0,ET_TITLE,null,"Film 3 of 4","Making the case",ET_MOD);const tA=ag_in(t,t0+0.6,0.9);if(tA<=0)return;setScreen(ctx,S);const i=ET_LAST.indexOf("; ");
  withA(ctx,tA,()=>{lp_T(ctx,ET_LAST.slice(0,i+1),960,292,{w:700,size:48,align:"center"});lp_T(ctx,ET_LAST.slice(i+2),960,354,{w:700,size:48,align:"center"});});}

/* ---------------------------------------------------------------- 1. The elms of Hyde Park: London, 1850 and 1851 */
scene("elms",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const tDrawn=w("designs","drawn",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // Hyde Park in the summer of 1850: the three old elms; the building committee's hall of brick, and each stakeholder's worry round it
    {at:0,place:"etPark",keys:[[0,960,500,1.08],[c.london+0.4,960,540,1.0]],d:3.2,draw:(x,tt)=>{
      et_brickHall(x,{u:ag_in(tt,tDrawn,3.2),elms:ag_in(tt,w("trees","elms",-0.3),1.2),a:1-ag_in(tt,c.change+0.3,1.8)});
      et_sheet(x,tt,c.london+0.1,80,110,600,{kick:"London, 1850",title:"A great exhibition",sub:"Of the work of every nation, planned for May 1851 in Hyde Park"},{light:null,pin:false,out:c.designs-0.5});
      et_sheet(x,tt,w("commission","royal",-0.2),1240,110,600,{kick:"A royal commission",title:"Prince Albert at its head",lines:["Must put up a building to hold it"]},
        {light:null,pin:false,u:ag_in(tt,w("commission","must",-0.1),0.5),out:c.stake-0.5});
      et_fig(x,tt,w("designs","turned",-0.2),c.stake-0.5,80,110,600,{kick:"Designs sent in",num:"245",label:"All turned down"},{col:LP.amber,light:null,pin:false});
      et_tag(x,tt,tDrawn+0.8,c.mocked-0.4,960,800,"The building committee's own design",{align:"center",col:LP.ink});
      et_tag(x,tt,w("mocked","mocked",-0.3),c.trees-0.4,960,800,"Mocked when the papers printed it",{align:"center",col:LP.amber});
      et_sheet(x,tt,w("stake","stake",-0.3),80,110,600,{kick:"Everyone with a stake",title:"Something to lose or gain",lines:["Against it, each for a reason of their own"]},
        {light:null,pin:false,u:ag_in(tt,w("stake","against",-0.1),0.5),out:c.trees-0.5});
      // each worry, one after another, and they stay
      et_sheet(x,tt,c.trees+0.1,80,110,600,{kick:"The park's friends",title:"Its old elms, cut down"},{col:LP.amber,light:null,pin:false});
      et_sheet(x,tt,c.times+0.1,1240,110,600,{kick:"The Times",title:"No building in Hyde Park",lines:["And some members of parliament"]},{col:LP.amber,light:null,pin:false});
      et_sheet(x,tt,c.bricks+0.1,80,360,600,{kick:"Millions of bricks",title:"Hard to take away again",sub:"Though it was only for the exhibition"},{col:LP.amber,light:null,pin:false});
      et_sheet(x,tt,c.doubt+0.1,1240,360,600,{kick:"Less than a year to go",title:"The exhibition in doubt"},{col:LP.amber,light:null,pin:false});}},
    // a railway meeting in Derby: Paxton, the sketch on blotting paper, the same few parts, and the newspaper's page
    {at:c.paxton-0.3,place:"etDerby",keys:[[c.paxton-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      const p0=w("paxton","gardener",-0.2),s0=w("sketch","eleventh",-0.2),q0=c.parts+0.1,n0=c.showed+0.1,c0=w("showed","whole",-0.2);
      et_paxtonSheet(x,120,150,760,{u:ag_in(tt,w("paxton","glasshouses",-0.2),2.4),a:ag_in(tt,p0,0.35)*(1-ag_in(tt,s0-0.6,0.4)),k:tt-p0});
      et_tag(x,tt,w("paxton","answer",-0.2),s0-0.6,500,720,"A way to answer every worry",{align:"center",col:LP.ink});
      et_blotter(x,120,150,860,560,{u:ag_in(tt,w("sketch","sketched",-0.2),4.0),a:ag_in(tt,s0,0.35)*(1-ag_in(tt,c.parts-0.5,0.4)),k:tt-s0});
      et_tag(x,tt,s0+0.3,c.parts-0.5,550,780,"11 June 1850 · A railway meeting, Derby",{align:"center",col:LP.ink});
      et_parts(x,100,170,1000,{u:ag_in(tt,w("parts","same",-0.3),2.2),again:ag_in(tt,w("parts","again",-0.1),1.4),a:ag_in(tt,q0,0.35)*(1-ag_in(tt,c.showed-0.5,0.4)),k:tt-q0,light:"day"});
      et_tag(x,tt,w("parts","fast",-0.2),c.showed-0.5,300,670,"Up fast",{align:"center",col:LP.ink});
      et_tag(x,tt,w("parts","come down",-0.2),c.showed-0.5,620,670,"Down again after",{align:"center",col:LP.ink});
      et_news(x,120,150,900,{a:ag_in(tt,n0,0.35)*(1-ag_in(tt,c0-0.5,0.4)),k:tt-n0});
      et_copies(x,120,170,{u:ag_in(tt,c0,1.6)});
      et_person(x,ET_PAXTON,1440,690,0.9,{t:tt,flip:true,light:ET_DERBY});}},
    // Hyde Park: the hall of iron and glass, the arch over the elms, the opening day, and what it gave
    {at:c.accepted-0.3,place:"etPark",keys:[[c.accepted-0.3,960,540,1.0],[c.arch-0.2,960,470,1.22],[c.opened-0.9,960,540,1.0]],d:1.8,dis:1.2,draw:(x,tt)=>{
      const lit=ag_in(tt,w("opened","first",-0.3),1.4),a0=w("answer","answer",-0.3),n0=w("answer","same picture",-0.4);
      et_crowd(x,lit);
      et_glassHall(x,{u:ag_in(tt,c.accepted+0.2,3.6),arch:ag_in(tt,w("arch","arched",-0.6),2.8),lit,t:tt});
      et_elmOutline(x,LP.green,ag_io(tt,w("accepted","three",-0.2),c.visits+1.0,0.6));
      et_pill(x,tt,w("accepted","accepted",-0.3),c.arch-0.6,380,180,"Accepted · 15 July 1850",{col:LP.green,icon:"tick"});
      et_sheet(x,tt,w("accepted","condition",-0.2),1240,110,600,{kick:"One condition",title:"Three old elms stay, inside"},{light:null,pin:false,out:c.arch-0.6});
      et_sheet(x,tt,w("opened","months",-0.3),80,110,600,{kick:"Up in months",title:"Opened 1 May 1851",sub:"As planned"},{col:LP.green,light:null,pin:false,out:c.surplus-0.5});
      et_fig(x,tt,w("visits","six million",-0.4),a0-0.2,1240,110,600,{kick:"By October 1851",num:"6 million",label:"About that many visits"},{col:LP.green,light:null,pin:false});
      et_fig(x,tt,w("surplus","surplus",-0.2),a0-0.2,80,110,600,{kick:"Its surplus, over",num:"£186,000",label:"Bought land in South Kensington, where museums stand today"},{col:LP.green,light:null,pin:false});
      et_answers(x,tt,a0+0.3,null);
      if(tt>=n0)et_news(x,860,730,200,{small:true,a:ag_in(tt,n0,0.5)});}},
    // a year from now, at a university: fourteen stakeholders round the move, and its data manager
    {at:c.data-0.3,place:"etUni",keys:[[c.data-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      const r0=w("uni","fourteen",-0.2),h0=w("asks","data manager",-0.6);
      et_sheet(x,tt,w("data","stakeholders",-0.3),560,330,800,{kick:"Stakeholders",title:"Everyone a plan touches, or who can shape it"},{light:"day",out:c.uni-0.4});
      et_pill(x,tt,w("uni","says yes",-0.2),c.loud-0.4,960,190,"Yes: retire the old system",{col:LP.green,icon:"tick"});
      et_ring(x,960,520,210,{u:ag_in(tt,r0,1.6),loud:ag_in(tt,w("loud","loudest",-0.3),1.0),leaves:ag_in(tt,w("asks","same story",-0.2),2.0),a:ag_in(tt,r0,0.3)});
      et_tag(x,tt,w("loud","HR's",-0.2),w("moves","plan",-0.6),960,834,"HR's reports in payroll's busiest weeks",{align:"center",col:LP.amber});
      et_tag(x,tt,w("moves","plan",-0.2),null,960,834,"The plan moves round it",{align:"center",col:LP.blue});
      lp_nameTag(x,1420,300,"helena",{align:"right",a:ag_in(tt,h0+0.3,0.5)});
      lp_person(x,"helena",1680,660,1.0,{t:tt,flip:true,a:ag_in(tt,h0,0.6),light:ET_DAY});}}
  ]);
  et_where(ctx,S,ag_in(t,w("uni","year",-0.3),0.5));
  lp_title(ctx,S,t,c.breath+0.2,ET_TITLE,"Who a plan touches, and what each needs","Data management · Making the case",ET_MOD);
});

/* ---------------------------------------------------------------- 2. Everyone it touches */
scene("map",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  const tF=w("first","first names",-0.1),tU=w("more","uses",-0.1),tM=w("more","makes",-0.1),tP=w("more","pays",-0.1),tD=w("more","decides",-0.1),tW=w("more","whose",-0.1);
  // when each of the fourteen goes on the grid, in ET_FOURTEEN's order
  const S14=[w("both","deputy",-0.2),w("both","director",-0.2),w("fin","Finance",-0.2),w("fin","HR",-0.2),w("deans","deans",-0.3),w("deans","IT",-0.2),
    w("near","registrar's",-0.2),w("near","Planning",-0.2),w("team","team",-0.2),w("near","Facilities",-0.2),w("near","data partners",-0.2),
    w("near","two hundred and sixty",-0.3),w("quiet","staff",-0.2),w("quiet","students",-0.2)];
  ag_shots(ctx,S,t,sc.dur,[
    // Tuesday 25 May 2027: the council says yes; the reports that move, and the ones nobody opens; the next morning, Helena's list
    {at:0,place:"etUni",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const l0=w("list","starts a list",-0.2),h0=w("list","Helena",-0.6);
      et_sheet(x,tt,c.may+0.1,500,280,920,{kick:"Tuesday 25 May 2027",title:"The data council says yes to the case"},{light:"day",out:c.reports-0.5});
      et_pill(x,tt,w("may","old warehouse",-0.2),c.reports-0.5,960,580,"Old warehouse retired by December",{col:LP.blue});
      et_reports(x,{u:ag_in(tt,c.reports+0.1,1.4),split:ag_in(tt,w("reports","move",-0.2),1.8),retire:ag_in(tt,w("reports","seventeen",-0.1),1.2),a:ag_io(tt,c.reports,c.list-0.5,0.4)});
      et_tag(x,tt,w("reports","platform",-0.1),c.list-0.5,1500,800,"21 people use: to the platform",{align:"center",col:LP.orange});
      et_tag(x,tt,w("reports","retired",-0.3),c.list-0.5,600,740,"17 nobody opens: retired",{align:"center",col:LP.amber});
      et_list(x,120,170,860,{n:3*ag_in(tt,tF,0.9)+3*ag_in(tt,tU,0.9)+4*ag_in(tt,tM,1.1)+ag_in(tt,tP,0.5)+ag_in(tt,tD,0.5)+2*ag_in(tt,tW,0.7),a:ag_in(tt,l0,0.35),k:tt-l0});
      et_sheet(x,tt,w("more","keeps going",-0.2),1010,170,440,{kick:"She asks",lines:["Who uses the data?","Who makes it?","Who pays for it?","Who decides?","Whose data is it?"]},
        {light:"day",u:et_u(tt,[tU,tM,tP,tD,tW])});
      et_tag(x,tt,w("first","most often",-0.2),c.fourteen-0.5,550,750,"Those who ask most often, and most loudly",{align:"center",col:LP.ink});
      et_tag(x,tt,c.fourteen+0.1,null,550,750,"14 people and groups",{align:"center",col:LP.ink});
      lp_nameTag(x,1460,300,"helena",{align:"right",a:ag_io(tt,h0+0.3,c.more-0.5,0.5)});
      lp_person(x,"helena",1680,660,1.0,{t:tt,flip:true,a:ag_in(tt,h0,0.6),light:ET_DAY});}},
    // the power and interest grid: the fourteen, each placed by the two questions; the quiet ones low, and asked too
    {at:c.grid-0.3,place:"etUni",later:true,keys:[[c.grid-0.3,960,540,1.0]],draw:(x,tt)=>{
      et_grid(x,{show:S14.map(s=>ag_in(tt,s,0.6)),axes:ag_in(tt,c.grid+0.3,0.8),pw:ag_in(tt,w("grid","shape",-0.3),0.6),it:ag_in(tt,w("grid","touch",-0.3),0.6),
        title:ag_in(tt,w("mendelow","power",-0.3),0.8),rings:ag_in(tt,w("asked","quiet ones",-0.2),1.0)});
      et_tag(x,tt,w("asked","asked too",-0.2),null,540,640,"Asked too, through their representatives",{align:"center",col:LP.ink});}}
  ]);
  et_kick(ctx,S,ag_in(t,0.6,0.6));et_where(ctx,S,1);
});

/* ---------------------------------------------------------------- 3. In their own words */
scene("words",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    // the same question for each
    {at:0,place:"etUni",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{
      et_sheet(x,tt,c.want+0.2,120,200,900,{kick:"The same question for each",title:"What do you want from data?"},{light:"day"});
      et_tag(x,tt,w("writes","their words",-0.2),null,570,470,"In their words, not hers",{align:"center",col:LP.ink});
      lp_person(x,"helena",1680,660,1.0,{t:tt,flip:true,light:ET_DAY});}},
    // their answers, each in their own words
    {at:c.david-0.3,place:"etUni",later:true,keys:[[c.david-0.3,960,540,1.0]],draw:(x,tt)=>et_pair(x,tt,sc,
      {who:"david",line:"david",name:"deputy",at:"One",words:"“One set of numbers I can take to the University Council.”",role:ET_DAVID_ROLE},
      {who:ET_ROHAN,line:"rohan",name:"Rohan",at:"Month-end",words:"“Month-end reports right on the first working day.”"})},
    {at:c.ingrid-0.3,place:"etUni",later:true,keys:[[c.ingrid-0.3,960,540,1.0]],draw:(x,tt)=>et_pair(x,tt,sc,
      {who:ET_INGRID,line:"ingrid",name:"Ingrid",at:"Every",words:"“Every report built from our staff list, not from a copy.”"},
      {who:ET_STAFFREP,line:"reps",name:"Staff",at:"Who",words:"“Who sees our records, and why?”"})},
    // her own team
    {at:c.team-0.3,place:"etUni",later:true,keys:[[c.team-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=w("team","own team",-0.6);
      et_sheet(x,tt,w("team","Time",-0.2),480,170,960,{kick:"The data team",title:"“Time to do the move well, not squeezed in between requests.”"},{light:"day"});
      lp_nameTag(x,660,560,"sam",{a:ag_in(tt,p0+0.3,0.5)});lp_nameTag(x,1260,560,"ivy",{align:"right",a:ag_in(tt,p0+0.3,0.5)});
      lp_person(x,"sam",480,720,0.8,{t:tt,a:ag_in(tt,p0,0.6),light:ET_DAY});lp_person(x,"ivy",1440,720,0.8,{t:tt,flip:true,a:ag_in(tt,p0,0.6),light:ET_DAY});}},
    // each answer beside each name: what they'll judge the plan by
    {at:c.judge-0.3,place:"etUni",later:true,keys:[[c.judge-0.3,960,540,1.0]],draw:(x,tt)=>{
      et_judge(x,120,150,1680,{rows:ag_in(tt,w("judge","map",-0.8),1.6),a:ag_in(tt,c.judge+0.1,0.35)});}},
    // who speaks to whom, and how often; one voice for each
    {at:c.often-0.3,place:"etUni",later:true,keys:[[c.often-0.3,960,540,1.0]],draw:(x,tt)=>{const s0=c.often+0.2;
      et_speakers(x,120,170,1180,{rows:[w("speak","deputy",-0.2),w("speak","data partner",-0.2),w("speak","Noor",-0.2),w("yusuf","Yusuf",-0.2)].map(r=>ag_in(tt,r,0.6)),
        one:ag_in(tt,w("one","One person",-0.1),1.4),a:ag_in(tt,s0,0.35)*(1-ag_in(tt,c.teachers-0.5,0.4)),k:tt-s0});
      et_tag(x,tt,w("one","nobody",-0.3),c.teachers-0.5,710,750,"One voice for each, so nobody hears two versions",{align:"center",col:LP.blue});
      et_sheet(x,tt,w("teachers","Teachers",-0.3),120,300,800,{kick:"See · Governance principles",title:"Teachers of data",sub:"Getting people to take part comes first"},{light:"day"});
      lp_person(x,"helena",1680,660,1.0,{t:tt,flip:true,light:ET_DAY});}}
  ]);
  et_kick(ctx,S,1);et_where(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. One page, every month */
scene("page",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"etUni",later:true,keys:[[0,960,540,1.0]],draw:(x,tt)=>{const p0=w("same","same page",-0.2),f0=c.lines+0.1,k0=w("link","links",-0.3);
      // the page: where the plan is, the measures, the top three risks, the decisions needed; bad news on it too
      et_page(x,180,150,800,{month:"Every first Monday",blank:true,u:["Where","measures","risks","decisions"].map(s=>ag_in(tt,w("holds",s,-0.2),0.6)),
        bad:ag_in(tt,w("bad","bad news",-0.2),0.8),a:ag_in(tt,p0,0.35),k:tt-p0});
      // a short line for each of the fourteen, and the same page for all
      et_forYou(x,1040,150,700,{lines:ag_in(tt,w("lines","short line",-0.2),2.6),same:ag_in(tt,w("nobody","same story",-0.3),1.8),a:ag_in(tt,f0,0.35)*(1-ag_in(tt,c.first-0.5,0.4)),k:tt-f0});
      // the first, on the day the front door opens; from July, the measures on the platform
      et_pill(x,tt,w("first","Monday",-0.2),c.link-0.5,1390,300,"First page: Monday 7 June",{col:LP.blue});
      et_tag(x,tt,w("first","front door",-0.3),c.link-0.5,1390,390,"The day the one front door opens",{align:"center",col:LP.ink});
      lp_screen(x,1060,180,740,460,{a:ag_in(tt,k0,0.5),draw:(cx,X,Y,Wd,Hd)=>et_measures(cx,X,Y,Wd,Hd,{u:ag_in(tt,k0+0.6,1.4)})});
      et_thread(x,[984,486],[1054,404],ag_in(tt,k0+0.2,0.8),{col:LP.blue,w:5,bend:20});
      et_tag(x,tt,k0+0.4,null,1430,704,"From July",{align:"center",col:LP.blue});}}
  ]);
  et_kick(ctx,S,1);et_where(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. A real constraint */
scene("june",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),hr=w("elms","here",-0.4);
  ag_shots(ctx,S,t,sc.dur,[
    // Wednesday 2 June, in HR's office: Ingrid shows Jun payroll's year
    {at:0,place:"etHR",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const p0=w("wed","Ingrid",-0.6),j0=w("wed","Jun",-0.6),l0=c.july+0.1;
      et_sheet(x,tt,c.wed+0.2,560,170,800,{kick:"Wednesday 2 June",title:"Going through the move's dates"},{light:"morning",out:c.july-0.5});
      et_timeline(x,430,150,1060,{hr:ag_in(tt,w("july","July",-0.2),0.6),end:ag_in(tt,w("payroll","thirtieth",-0.3),0.6),band:ag_in(tt,w("payroll","last returns",-0.3),0.8),
        move:ag_in(tt,w("change","August",-0.4),1.4),a:ag_in(tt,l0,0.35),k:tt-l0});
      et_tag(x,tt,w("worst","least",-0.3),c.real-0.4,960,730,"July: no room for a surprise",{align:"center",col:LP.amber});
      et_tag(x,tt,w("real","fact",-0.3),c.change-0.4,960,730,"A real constraint: a fact, not a preference",{align:"center",col:LP.ink});
      et_tag(x,tt,w("change","August",-0.1),null,960,730,"HR's reports move in August",{align:"center",col:LP.blue});
      lp_nameTag(x,430,770,ET_INGRID,{a:ag_io(tt,p0+0.3,c.worst-0.5,0.5)});
      lp_nameTag(x,1490,770,"jun",{align:"right",role:"Speaks to HR for the team",a:ag_io(tt,j0+0.3,c.worst-0.5,0.5)});
      lp_person(x,ET_INGRID,250,720,0.8,{t:tt,a:ag_in(tt,p0,0.6),light:ET_MO});
      lp_person(x,"jun",1670,720,0.8,{t:tt,flip:true,a:ag_in(tt,j0,0.6),light:ET_MO});}},
    // the June page, with the decision and its reason; the council agrees; the July page tells everyone
    {at:c.page-0.3,place:"etUni",keys:[[c.page-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const j0=w("council","July page",-0.2);
      et_page(x,180,150,800,{month:"June 2027",decision:ag_in(tt,w("page","decisions needed",-0.2),0.8),a:1-ag_in(tt,j0-0.5,0.4)});
      et_page(x,180,150,800,{month:"July 2027",agreed:1,link:1,a:ag_in(tt,j0,0.35),k:tt-j0});
      et_pill(x,tt,w("council","agrees",-0.3),null,1220,230,"Agreed · Tue 29 June",{col:LP.green,icon:"tick"});
      lp_person(x,"helena",1680,660,1.0,{t:tt,flip:true,light:ET_DAY});}},
    // in Hyde Park, the roof rose over the elms
    {at:c.elms-0.3,place:"etPark",keys:[[c.elms-0.3,960,500,1.12],[c.elms+0.5,960,480,1.2]],d:3.0,dis:1.4,draw:(x,tt)=>{
      et_glassHall(x,{u:1,arch:ag_in(tt,w("elms","roof",-0.4),2.4)});
      et_elmOutline(x,LP.green,ag_in(tt,w("elms","three",-0.2),0.6));}},
    // here, the plan moved round payroll's weeks
    {at:hr,place:"etHR",keys:[[hr,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      et_timeline(x,430,150,1060,{hr:1,end:1,band:1,move:ag_in(tt,w("elms","moved",-0.4),1.4)});
      lp_person(x,ET_INGRID,250,720,0.8,{t:tt,light:ET_MO});
      lp_person(x,"jun",1670,720,0.8,{t:tt,flip:true,light:ET_MO});}}
  ]);
  et_kick(ctx,S,1);et_where(ctx,S,1-ag_io(t,c.elms-0.3,hr,0.6));
});

/* ---------------------------------------------------------------- 6. Heard */
scene("heard",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),e0=c.breath+0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // not everyone hears yes: Clara's forecast waits its turn
    {at:0,place:"etUni",keys:[[0,960,540,1.0]],draw:(x,tt)=>{const p0=w("clara","Clara's",-0.6);
      et_sheet(x,tt,c.yes+0.1,120,170,840,{title:"Not everyone at the table hears yes"},{light:"day"});
      et_sheet(x,tt,w("clara","forecast",-0.2),1040,170,760,{kick:"Clara's forecast",title:"Waits its turn on the one list",lines:["With a reason, and a date"]},
        {col:LP.amber,light:"day",u:ag_in(tt,w("clara","reason",-0.2),0.5)});
      lp_nameTag(x,1260,560,"clara",{align:"right",a:ag_in(tt,p0+0.3,0.5)});
      lp_person(x,"clara",1440,720,0.8,{t:tt,flip:true,a:ag_in(tt,p0,0.6),light:ET_DAY});}},
    // the July page: an old extract with personal fields nobody needed, left behind
    {at:c.seen-0.3,place:"etUni",later:true,keys:[[c.seen-0.3,960,540,1.0]],draw:(x,tt)=>{const p0=w("seen","staff",-0.6);
      et_page(x,100,150,780,{month:"July 2027",agreed:1,link:1,left:ag_in(tt,w("seen","left behind",-0.3),0.8)});
      lp_nameTag(x,1260,560,ET_STAFFREP,{align:"right",a:ag_in(tt,p0+0.3,0.5)});
      lp_person(x,ET_STAFFREP,1440,720,0.8,{t:tt,flip:true,a:ag_in(tt,p0,0.6),light:ET_DAY});}},
    // every month they see the plan move; how to explain, and how to say no
    {at:c.stay-0.3,place:"etUni",later:true,keys:[[c.stay-0.3,960,540,1.0]],draw:(x,tt)=>{
      et_months(x,140,300,{u:ag_in(tt,w("stay","every month",-0.3),2.6)});
      et_sheet(x,tt,c.ldp+0.1,460,620,1000,{kick:"See · Leading data people",lines:["How to explain, so people can decide","How to say no, and what instead"]},
        {light:"day",u:et_u(tt,[c.ldp+0.2,w("ldp","say no",-0.2)])});}},
    // in 1850: each worry answered, the same picture for everyone
    {at:c.paxton-0.3,place:"etPark",keys:[[c.paxton-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const n0=w("paxton","same picture",-0.4);
      et_hallOpen(x,{lit:0.6,t:tt});et_answers(x,tt,w("paxton","answered",-0.2),null);
      if(tt>=n0)et_news(x,860,730,200,{small:true,a:ag_in(tt,n0,0.5)});}},
    // at the university: the fourteen, each with the same page
    {at:c.uni-0.3,place:"etUni",keys:[[c.uni-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{
      et_grid(x,{title:1,rings:1,leaves:ag_in(tt,w("uni","same page",-0.3),2.2)});}},
    // on Monday; next; the takeaway
    {at:c.monday-0.3,place:"etUni",later:true,keys:[[c.monday-0.3,960,540,1.0]],draw:(x,tt)=>{
      et_sheet(x,tt,c.monday+0.1,240,150,1440,{title:"On Monday",lines:["List everyone your plan touches","Ask each what they want from data, in their words",
        "Decide who speaks to each, and how often","Send everyone the same page every month","When someone shows a real constraint, change the plan, and say why"]},
        {light:"day",u:et_u(tt,[w("monday","list",-0.2),w("monday","ask",-0.2),c.monday2+0.1,w("monday2","send",-0.2),c.monday3+0.1]),out:c.next-0.5});
      et_sheet(x,tt,w("next","Next",-0.1),560,330,800,{kick:"Next · Film 4 of 4",title:"One list, not twenty"},{col:LP.blue,light:"day",out:c.take-0.5});
      et_tag(x,tt,w("take","Know",-0.1),e0,960,420,"Know what each person needs from data",{align:"center",col:LP.ink});
      et_tag(x,tt,w("take","tell",-0.1),e0,960,500,"Tell everyone the same story",{align:"center",col:LP.ink});}}
  ]);
  et_kick(ctx,S,1-ag_in(t,e0,0.8));et_where(ctx,S,(1-ag_io(t,c.paxton-0.3,c.uni-0.3,0.6))*(1-ag_in(t,e0,0.8)));
  et_end(ctx,S,t,e0);
});
ag_cutInto(["map","words","page"]);
