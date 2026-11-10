/* ===== When someone falls behind: the chapters, shot by shot =====
   Every time comes from the voice: a line's start (sc.cues) or a word in it (wAt), so the pictures stay with the voice if it's recorded
   again; the score (tools/score.py) takes the same words. In one room the camera glides and only what changes fades; a later moment in
   a room (later:true) lets what was there leave first; between rooms a shot dissolves. Sizes in the 1920 x 1080 frame. */

const FB_LAST="Find the cause, clear the way, and give it time.";
// the film's number and title at the top left, from the second chapter on
function fb_kick(ctx,S,a,o){if(a<=0.004)return;setScreen(ctx,S);lp_kicker(ctx,"3","When someone falls behind",Object.assign({a},o||{}));}
// a sheet of words that springs in at t0 (and goes from o.out): lp_textSheet's words and options
function fb_sheet(ctx,t,t0,x,y,w,words,o){o=o||{};const a=ag_in(t,t0,0.35)*(o.out!=null?1-ag_in(t,o.out,0.4):1);if(a<=0.004)return null;
  return lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{a,k:t-t0}));}
// lines that come in one by one, each at its own time: lp_textSheet's u
const fb_u=(t,ts)=>ts.reduce((s,t0)=>s+ag_in(t,t0,0.5),0)/ts.length;
// a tag that comes in at t0 and goes at t1 (null: stays)
function fb_tag(ctx,t,t0,t1,x,y,text,o){const a=ag_io(t,t0,t1==null?1e9:t1,0.4);if(a>0.004)lp_tag(ctx,x,y,text,Object.assign({},o,{a}));}
// a pill that springs in at t0 (and goes at t1)
function fb_pill(ctx,t,t0,t1,x,y,text,o){const a=ag_in(t,t0,0.4)*(t1==null?1:1-ag_in(t,t1,0.4));if(a>0.004)lp_pill(ctx,x,y,text,Object.assign({},o,{a,k:t-t0}));}
// the line's clock: it runs at sp px a second, and from stop it slows to a halt over 1.2 s (and starts again from go)
function fb_clock(tt,sp,stop,go){const run=(a,b)=>Math.max(0,Math.min(tt,b)-a);let c=sp*run(0,stop==null?1e9:stop);
  if(stop!=null&&tt>stop){const u=clamp((tt-stop)/1.2,0,1);c+=sp*1.2*(u-u*u/2);}if(go!=null&&tt>go)c+=sp*(tt-go);return c;}
// the five places on the line where people work, and who stands at each (null: nobody came in)
const FB_SLOTS=[260,600,940,1280,1620];

/* ---------------------------------------------------------------- 1. Same people, another way: Fremont, 1982 to 1986 */
scene("nummi",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),hall={light:"day",wall:0},grey={light:"grey",wall:0};
  const gateT=w("close","closes",-0.1),missT=w("cars","missing",-0.2),pullT=w("cord","pull",-0.1),stopT=w("cord","stops",-0.3),sameT=w("hire","same",-0.2);
  // the workers at the line, 1982: one place in five empty (o.empty), each lit by the hall's light; o.a fades them as one
  const crew=(x,tt,o)=>{o=o||{};FB_SLOTS.forEach((sx,i)=>{if(i===2&&o.empty)return;lp_person(x,FB_CREW[i],sx,820,0.62,{t:tt,flip:i>=3,light:o.light||grey});});};
  ag_shots(ctx,S,t,sc.dur,[
    // the works, overcast, 1982, and its gate closing
    {at:0,place:"fbPlant",keys:[[0,980,520,1.08],[c.when+0.4,960,540,1.0]],d:3,draw:(x,tt)=>{
      fb_gate(x,ag_in(tt,gateT,2.2));
      fb_sheet(x,tt,w("when","Fremont",-0.2),150,120,560,{kick:"Fremont, California",title:"1982",sub:"A General Motors car plant"},{light:null,pin:false,out:c.name-0.5});
      fb_tag(x,tt,w("close","thousands",-0.1),c.absent-0.6,960,730,"Thousands of jobs lost",{align:"center",col:LP.amber});
      fb_sheet(x,tt,w("name","worst",-0.3),1180,120,600,{kick:"Its name",title:"One of the worst plants in the country"},{col:LP.amber,light:null,pin:false,out:c.absent-0.6});}},
    // the line, 1982: one place in five empty, the complaints, the cars that leave with parts missing
    {at:c.absent-0.3,place:"fbHall",keys:[[c.absent-0.3,960,540,1.0]],dis:1.4,draw:(x,tt)=>{const ck=fb_clock(tt,70);
      fb_line(x,tt,{clock:ck,miss:[1,4],amiss:ag_in(tt,missT,0.8)});
      crew(x,tt,{empty:1,light:grey});
      // the empty place: an outline where someone should stand
      const ea=ag_in(tt,w("absent","five",-0.2),0.6);if(ea>0.004){x.save();x.globalAlpha*=ea;x.setLineDash([12,10]);x.strokeStyle=rgba(LP.amber,1);x.lineWidth=5;
        x.beginPath();x.ellipse(FB_SLOTS[2],732,44,56,0,0,TAU);x.stroke();x.beginPath();x.moveTo(FB_SLOTS[2]-120,1010);x.bezierCurveTo(FB_SLOTS[2]-110,840,FB_SLOTS[2]+110,840,FB_SLOTS[2]+120,1010);x.stroke();x.restore();}
      fb_tag(x,tt,w("absent","five",0.1),c.blame-0.4,FB_SLOTS[2],400,"One worker in five, not in",{align:"center",col:LP.amber});
      fb_sheet(x,tt,w("absent","complaints",-0.2),1240,110,560,{kick:"Complaints",title:"In the thousands"},{col:LP.amber,light:null,pin:false,out:c.blame-0.4});
      fb_tag(x,tt,missT+0.3,c.blame-0.4,1420,470,"Parts missing, or fitted wrong",{align:"center",col:LP.amber});
      // who said what was wrong, and what it cost
      fb_sheet(x,tt,w("blame","said",-0.2),660,110,600,{kick:"Many said",title:"The problem is the workers"},{light:null,pin:false,out:c.change-0.4});
      fb_sheet(x,tt,w("harm","bought",-0.2),120,110,520,{kick:"For the buyers",title:"Faults to fix"},{col:LP.amber,light:null,pin:false,out:c.change-0.4});
      fb_sheet(x,tt,w("harm","workers",-0.2),1280,110,520,{kick:"For the workers",title:"No job",lines:["And a name that followed them"]},{col:LP.amber,light:null,pin:false,out:c.change-0.4,u:ag_in(tt,w("harm","name",-0.1),0.5)});}},
    // 1984: the same hall, its roof lights clean, reopened as NUMMI, and the same people hired back
    {at:c.reopen-0.3,place:"fbHallLit",later:true,dis:0.8,keys:[[c.reopen-0.3,960,540,1.0]],draw:(x,tt)=>{
      fb_line(x,tt,{clock:0,a:1});
      fb_sheet(x,tt,c.reopen+0.2,560,110,800,{kick:"1984 · NUMMI",title:"General Motors and Toyota, together"},{col:LP.blue,light:null,pin:false,out:c.japan-0.6});
      FB_SLOTS.forEach((sx,i)=>{lp_person(x,FB_CREW[i],sx,820,0.62,{t:tt,flip:i>=3,light:hall,a:ag_in(tt,sameT-0.6+i*0.25,0.8)});});
      fb_pill(x,tt,w("hire","eight",-0.1),c.japan-0.6,960,440,"More than 8 in 10: the same people",{col:LP.green});}},
    // spring 1984: groups of thirty fly to Toyota's plant in Japan, for two weeks
    {at:c.japan-0.3,place:"fbMap",keys:[[c.japan-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const a0=w("japan","fly",-0.2);
      fb_arc(x,ag_in(tt,a0,2.4),{x0:1560,x1:380,y:600,h:300});
      fb_tag(x,tt,a0-0.2,null,1560,660,"Fremont",{align:"center",col:LP.ink});
      fb_tag(x,tt,a0+2.2,null,380,660,"A Toyota plant, Japan",{align:"center",col:LP.ink});
      fb_sheet(x,tt,w("japan","Groups",-0.1),660,110,600,{kick:"Spring 1984",title:"Groups of 30",lines:["Two weeks, working beside the people there"]},{col:LP.blue,light:null,pin:false,u:ag_in(tt,w("japan","work",-0.1),0.5)});}},
    // back in Fremont: small teams, a team leader, the cord any of them can pull, and the line that stops
    {at:c.teams-0.3,place:"fbHallLit",keys:[[c.teams-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{const ck=fb_clock(tt,70,stopT,c.quality-0.6);
      fb_line(x,tt,{clock:ck,at:2,pull:ag_in(tt,pullT,0.4)*(1-ag_in(tt,c.quality-1.0,0.6)),lamp:ag_in(tt,pullT+0.3,0.3)*(1-ag_in(tt,c.quality-1.0,0.6))});
      // the team leader comes over to the place where the cord was pulled
      const lx=lerp(1620,FB_SLOTS[2]+170,ag_sine((tt-pullT-0.4)/1.6));
      FB_SLOTS.forEach((sx,i)=>{if(i>=3)return;lp_person(x,FB_CREW[i],sx,820,0.62,{t:tt,flip:i>=3,light:hall});});
      lp_person(x,FB_PEOPLE.dee,lx,820,0.62,{t:tt,flip:true,light:hall});
      fb_tag(x,tt,w("teams","teams",-0.1),c.cord-0.3,600,440,"Small teams",{align:"center",col:LP.blue});
      fb_tag(x,tt,w("teams","leader",-0.1),c.cord-0.3,1500,440,"A team leader steps in",{align:"center",col:LP.blue});
      fb_tag(x,tt,pullT+0.2,c.quality-0.6,FB_SLOTS[2],150,"Anyone can pull the cord",{align:"center",col:LP.blue});
      fb_tag(x,tt,stopT+0.3,c.quality-0.6,FB_SLOTS[2],440,"Not fixed? The line stops",{align:"center",col:LP.amber});}},
    // within two years: the results
    {at:c.quality-0.3,place:"fbHallLit",later:true,keys:[[c.quality-0.3,960,540,1.0]],draw:(x,tt)=>{const ck=fb_clock(tt,70);
      fb_line(x,tt,{clock:ck});
      fb_sheet(x,tt,c.quality+0.2,120,110,540,{kick:"Within two years",title:"About as few faults as Toyota's in Japan"},{col:LP.green,light:null,pin:false,out:c.right-0.5});
      fb_sheet(x,tt,w("fell","Absence",-0.1),690,110,540,{kick:"Absence and complaints",title:"Fell steeply"},{col:LP.green,light:null,pin:false,out:c.right-0.5});
      fb_sheet(x,tt,w("fell","study",-0.2),1260,110,540,{kick:"One study",title:"The old way: half as many workers again"},{col:LP.green,light:null,pin:false,out:c.right-0.5});}},
    // both were right about what they saw; the same people, in a different system
    {at:c.right-0.3,place:"fbHallLit",later:true,keys:[[c.right-0.3,960,540,1.0]],draw:(x,tt)=>{
      lp_person(x,FB_PEOPLE.boss,520,760,0.75,{t:tt,light:hall});
      lp_person(x,FB_PEOPLE.ray,1400,760,0.75,{t:tt,flip:true,light:hall});
      fb_sheet(x,tt,w("right","Managers",-0.1),220,140,600,{kick:"Managers saw",title:"The absences"},{light:null,pin:false});
      fb_sheet(x,tt,w("right","Workers",-0.1),1100,140,600,{kick:"Workers saw",title:"A line that never stopped, and nobody to help"},{light:null,pin:false});
      fb_pill(x,tt,w("right","Both",-0.1),null,960,520,"Both right about what they saw",{col:LP.ink});
      fb_pill(x,tt,w("same","different",-0.1),null,960,600,"The same people, a different system",{col:LP.green});}},
    // and data work: what surrounds someone, first
    {at:c.data-0.3,place:"lpRoom",keys:[[c.data-0.3,960,540,1.0]],push:0,draw:(x,tt)=>{const ga=1-ag_in(tt,c.breath+0.2,0.8);x.save();x.globalAlpha*=ga;
      fb_desk(x,960,800,{});
      fb_tag(x,tt,w("around","taught",-0.1),null,500,420,"What they were taught",{align:"center",col:LP.ink});
      fb_tag(x,tt,w("around","way",-0.1),null,960,300,"What's in their way",{align:"center",col:LP.ink});
      fb_tag(x,tt,w("around","asked",-0.1),null,1420,420,"What they're asked to do",{align:"center",col:LP.ink});x.restore();}}
  ]);
  lp_title(ctx,S,t,c.breath+0.2,"When someone falls behind","Find the cause before you judge","Leading data people · Ownership and performance");
});
// the crew of 1984, the same people as in 1982, all five places filled
const FB_CREW=[FB_PEOPLE.ray,FB_PEOPLE.lena,FB_PEOPLE.earl,FB_PEOPLE.walt,FB_PEOPLE.rosa];

/* ---------------------------------------------------------------- 2. Behind the team */
scene("behind",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"};
  ag_shots(ctx,S,t,sc.dur,[
    // the reports move off the old warehouse onto the platform, as code, reviewed
    {at:0,place:"lpRoom",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      fb_move(x,tt,{u:ag_in(tt,w("move","moves",-0.1),3.4),rev:ag_in(tt,w("code","reviewed",-0.1),0.6),light:"day"});
      fb_tag(x,tt,w("code","code",-0.1),c.days-0.6,1540,740,"Written as code, reviewed",{align:"center",col:LP.ink});}},
    // the team's days from a request to first use, February to June
    {at:c.days-0.3,place:"lpRoom",later:true,keys:[[c.days-0.3,960,540,1.0]],draw:(x,tt)=>{const d0=w("days","fall",-0.1);
      fb_chart(x,280,140,1360,700,{a:ag_in(tt,c.days,0.4),k:tt-c.days,team:1+4*ag_sine(ag_in(tt,d0,2.6)),tom:0,vals:{0:ag_in(tt,w("days","41",-0.1),0.4),4:ag_in(tt,w("days","24",-0.1),0.4)},light:"day"});}},
    // Tomás, who built most of the old reports
    {at:c.tomas-0.3,place:"lpRoom",later:true,keys:[[c.tomas-0.3,960,540,1.0]],draw:(x,tt)=>{
      fb_sheet(x,tt,w("tomas","Tomás",-0.1),980,150,700,{kick:"Report developer",title:"Tomás Ortega",lines:["Built most of the old reports","Knows every one, and who reads it"]},
        {light:"day",u:fb_u(tt,[w("tomas","built",-0.1),w("tomas","knows",-0.1)])});
      lp_person(x,FB_TOMAS,560,640,1.0,{t:tt,light:dy});}},
    // his weeks: some keep pace, some go back
    {at:c.less-0.3,place:"lpRoom",keys:[[c.less-0.3,960,540,1.0]],draw:(x,tt)=>{
      fb_sheet(x,tt,c.less+0.2,980,150,760,{kick:"Tomás's weeks, April to June",title:"Faster too, but less, and unevenly"},{light:"day"});
      fb_weeks(x,1000,420,{u:ag_in(tt,w("less","unevenly",-0.2),2.0)});
      fb_tag(x,tt,w("less","pace",-0.1),null,1000,560,"Kept pace with the team",{col:LP.green});
      fb_tag(x,tt,w("less","changes",-0.2),null,1000,630,"Went back for changes",{col:LP.amber});
      lp_person(x,FB_TOMAS,560,640,1.0,{t:tt,light:dy});}},
    // Helena, who read the team as a whole first; its shared work, and one person's
    {at:c.helena-0.3,place:"lpRoom",later:true,keys:[[c.helena-0.3,960,540,1.0]],draw:(x,tt)=>{
      fb_sheet(x,tt,w("helena","Helena",-0.1),220,150,700,{kick:"The data manager",title:"Helena Novak",lines:["Read the team as a whole first, in The team comes first"]},
        {light:"day",u:ag_in(tt,w("helena","whole",-0.2),0.5)});
      fb_pill(x,tt,w("shared","shared",-0.1),null,570,560,"The team's shared work: going well",{col:LP.green,icon:"tick"});
      fb_pill(x,tt,w("shared","One",-0.1),null,570,650,"One person's: falling behind it",{col:LP.amber,icon:"wait"});
      fb_tag(x,tt,w("ask","asks",-0.2),null,570,744,"Before she judges, she asks",{align:"center",col:LP.ink});
      lp_person(x,"helena",1420,640,1.0,{t:tt,flip:true,light:dy});}}
  ]);
  setScreen(ctx,S);lp_sceneTag(ctx,"The university, 2027 · imagined",{a:ag_io(t,0.8,c.days-0.4,0.5)});
  fb_kick(ctx,S,ag_in(t,0.6,0.6));
});

/* ---------------------------------------------------------------- 3. Find the cause */
scene("cause",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),dy={light:"day"},lt={light:"late"};
  ag_shots(ctx,S,t,sc.dur,[
    // two old books, and their questions
    {at:0,place:"lpRoom",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      fb_sheet(x,tt,w("mager","Mager",-0.2),160,150,760,{kick:"Robert Mager and Peter Pipe, 1970",title:"Could they do it if they had to?",lines:["No: it's a skill to learn","Yes: something is in the way"]},
        {light:"day",u:fb_u(tt,[w("mager","not",-0.1),w("mager","could",0.4)])});
      fb_sheet(x,tt,w("gilbert","Gilbert",-0.2),1000,150,760,{kick:"Thomas Gilbert, 1978",title:"First, what surrounds the work",lines:["Its information","Its tools","Its rewards","Then the person"]},
        {light:"day",u:fb_u(tt,[w("gilbert","information",-0.1),w("gilbert","tools",-0.1),w("gilbert","rewards",-0.1),w("gilbert","person",-0.2)])});}},
    // his one-to-one: Helena asks what's in his way
    {at:c.wed-0.3,place:"fbOne",keys:[[c.wed-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      lp_person(x,FB_TOMAS,620,690,0.95,{t:tt,cut:812,light:lt});lp_person(x,"helena",1300,690,0.95,{t:tt,flip:true,cut:812,light:lt});
      lp_table(x,520,820,880);
      fb_sheet(x,tt,w("wed","Wednesday",-0.1),640,120,640,{kick:"Wednesday 26 May",title:"Tomás's one-to-one"},{light:"late",out:c.skill-0.5});
      fb_tag(x,tt,w("wed","asks",-0.1),c.skill-0.5,960,430,"What's getting in your way?",{align:"center",col:LP.ink});}},
    // the three causes, a sheet each, and what was cleared for each
    {at:c.skill-0.3,place:"fbOne",later:true,keys:[[c.skill-0.3,960,540,1.0]],draw:(x,tt)=>{
      fb_sheet(x,tt,c.skill+0.1,120,130,540,{kick:"One",title:"Training",lines:["The tools changed; nobody taught them"]},{light:"late",u:ag_in(tt,w("skill","changed",-0.1),0.5)});
      fb_pill(x,tt,w("pair","pairs",-0.1),null,390,530,"Pairing with Jun, twice a week",{col:LP.green,icon:"tick",size:28});
      fb_pill(x,tt,w("pair","protected",-0.2),null,390,610,"Thursday learning time, kept",{col:LP.green,icon:"tick",size:28});
      fb_sheet(x,tt,c.fit+0.1,690,130,540,{kick:"Two",title:"Fit for the role",lines:["His strength: the reports' readers"]},{light:"late",u:ag_in(tt,w("fit","people",-0.1),0.5)});
      fb_pill(x,tt,w("readers","become",-0.1),null,960,530,"Their notes and training: his",{col:LP.green,icon:"tick",size:28});
      fb_sheet(x,tt,c.hard+0.1,1260,130,540,{kick:"Three",title:"A hard time",lines:["At home, from June","Nobody needs to know more"]},{light:"late",u:fb_u(tt,[w("hard","home",-0.1),w("hard","Nobody",-0.1)])});
      fb_pill(x,tt,w("patience","lighter",-0.2),null,1530,580,"Two months, a lighter load",{col:LP.green,icon:"tick",size:28});}},
    // back to NUMMI: the cord brought help, not blame
    {at:c.cord-0.3,place:"fbHallLit",keys:[[c.cord-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{const p0=c.cord+0.3,hall={light:"day",wall:0};
      fb_line(x,tt,{clock:0,at:2,pull:ag_in(tt,p0,0.4),lamp:ag_in(tt,p0+0.3,0.3)});
      FB_SLOTS.forEach((sx,i)=>{if(i>=3)return;lp_person(x,FB_CREW[i],sx,820,0.62,{t:tt,flip:i>=3,light:hall});});
      lp_person(x,FB_PEOPLE.dee,FB_SLOTS[2]+150,820,0.62,{t:tt,flip:true,light:hall});
      fb_pill(x,tt,w("cord","help",-0.1),null,960,420,"Help, not blame",{col:LP.blue});
      fb_tag(x,tt,w("cord","clear",-0.1),null,960,500,"Helena's part: clear what's in the way",{align:"center",col:LP.ink});}},
    // psychological safety
    {at:c.safe-0.3,place:"lpRoom",keys:[[c.safe-0.3,960,540,1.0]],dis:1.0,draw:(x,tt)=>{
      fb_sheet(x,tt,c.safe+0.2,560,180,800,{kick:"Amy Edmondson",title:"Psychological safety",lines:["People say what's wrong when it's safe to"]},{light:"day",u:ag_in(tt,w("safe","people",-0.1),0.5)});}}
  ]);
  fb_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 4. Against the team's own change */
scene("gap",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),lt={light:"late"};
  const f0=w("feb","40",-0.2),t0=w("feb","41",-0.2),j0=w("june","24",-0.2),j1=w("june","35",-0.2);
  ag_shots(ctx,S,t,sc.dur,[
    // not behind her expectations: behind the team
    {at:0,place:"fbOne",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      fb_chart(x,280,150,1360,690,{a:ag_in(tt,0.6,0.5),k:tt-0.6,light:"late",tom:1+4*ag_sine(ag_in(tt,j1-0.6,1.0)),team:1+4*ag_sine(ag_in(tt,j0-0.8,1.0)),
        vals:{0:ag_in(tt,f0,0.4),4:ag_in(tt,j0,0.4)},gapAt:4,gapA:ag_in(tt,j1+0.4,0.5)*(1-ag_in(tt,c.plan-0.8,0.5)),labels:ag_in(tt,f0,0.4)});
      fb_tag(x,tt,w("far","expectations",-0.2),w("far","team",-0.4),960,110,"Not against her expectations",{align:"center",col:LP.mut});
      fb_tag(x,tt,w("far","team",0.1),c.feb-0.3,960,110,"Against the team's own change",{align:"center",col:LP.orange});
      fb_tag(x,tt,j1+0.6,c.faster-0.3,1080,500,"A gap of 11 days",{col:LP.amber});
      fb_tag(x,tt,w("faster","improved",-0.1),c.own-0.3,620,880-140,"He improved: 40 to 35",{col:LP.ink});
      fb_tag(x,tt,w("faster","faster",-0.1),c.own-0.3,1060,880-140,"The team: 41 to 24",{col:LP.orange});
      fb_pill(x,tt,w("own","stays",-0.2),c.plan-0.8,960,110,"Between him and Helena",{col:LP.ink});}},
    // his plan, written by him, read each month
    {at:c.plan-0.3,place:"fbOne",later:true,keys:[[c.plan-0.3,960,540,1.0]],draw:(x,tt)=>{
      fb_sheet(x,tt,w("plan","writes",-0.1),160,120,900,{kick:"Tomás's plan · Written by him",lines:["Write and review reports as code, by September","Release notes and training for the readers, from July","Pair with Jun, Tuesdays and Fridays","What he needs: his Thursdays kept clear"]},
        {col:LP.blue,light:"late",u:fb_u(tt,[w("plan","learn",-0.1),w("plan","when",-0.1),w("plan","needs",-0.1),w("plan","needs",0.4)])});
      fb_pill(x,tt,w("plan","agrees",-0.1),null,610,640,"Agreed with Helena",{col:LP.green,icon:"tick"});
      fb_tag(x,tt,w("month","first",-0.1),null,1180,180,"Read together",{col:LP.blue});
      fb_cal(x,1180,250,{u:ag_in(tt,w("month","Wednesday",-0.2),1.6),light:"late"});
      lp_person(x,FB_TOMAS,1500,700,0.9,{t:tt,flip:true,light:lt});}}
  ]);
  fb_kick(ctx,S,1);
});

/* ---------------------------------------------------------------- 5. Give it time */
scene("time",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),ev={light:"evening"};
  ag_shots(ctx,S,t,sc.dur,[
    // the months after June, unevenly; December: the gap closed by about half
    {at:0,place:"fbOne",later:true,keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{const u0=w("uneven","unevenly",-0.2),d0=w("dec","December",-0.2);
      fb_chart(x,280,150,1360,690,{a:ag_in(tt,0.4,0.5),k:tt-0.4,light:"late",team:5+6*ag_sine(ag_in(tt,u0,(d0-u0)+0.6)),tom:5+6*ag_sine(ag_in(tt,u0,(d0-u0)+0.6)),
        hi:{7:ag_io(tt,w("uneven","September",-0.1),c.dec-0.3),8:ag_io(tt,w("uneven","October",-0.1),c.dec-0.3)},vals:{4:1,10:ag_in(tt,w("dec","14",-0.2),0.4)},
        gapAt:10,gapA:ag_in(tt,w("dec","half",-0.3),0.5)});
      fb_tag(x,tt,w("uneven","September",-0.1),c.dec-0.3,1000,250,"September: went well",{col:LP.green});
      fb_tag(x,tt,w("uneven","October",-0.1),c.dec-0.3,1000,320,"October: a report back twice",{col:LP.amber});
      fb_tag(x,tt,w("dec","half",-0.2),null,1000,250,"The gap: 11 days to 6",{col:LP.amber});}},
    // 15 December: honest about where it goes
    {at:c.honest-0.3,place:"fbDecember",keys:[[c.honest-0.3,960,540,1.0]],later:true,draw:(x,tt)=>{
      lp_person(x,FB_TOMAS,620,690,0.95,{t:tt,cut:812,light:ev});lp_person(x,"helena",1300,690,0.95,{t:tt,flip:true,cut:812,light:ev});
      lp_table(x,520,820,880);
      fb_sheet(x,tt,w("honest","Wednesday",-0.1),560,110,800,{kick:"Wednesday 15 December",title:"The plan goes on into 2028",lines:["If a role fits him better, they'll talk about it"]},
        {col:LP.blue,light:"evening",u:ag_in(tt,w("role","role",-0.2),0.5)});
      fb_tag(x,tt,w("role","now",-0.2),c.years-0.4,960,480,"Said now, not later",{align:"center",col:LP.ink});}},
    // months, or years; and private throughout
    {at:c.years-0.3,place:"fbDecember",later:true,keys:[[c.years-0.3,960,540,1.0]],draw:(x,tt)=>{const y0=w("years","months",-0.2),u=ag_sine(ag_in(tt,y0,2.0));
      x.save();x.strokeStyle=rgba(LP.ink,0.8);x.lineWidth=6;x.lineCap="round";x.beginPath();x.moveTo(300,420);x.lineTo(lerp(300,1100,u),420);x.stroke();
      x.setLineDash([14,14]);x.beginPath();x.moveTo(1100,420);x.lineTo(lerp(1100,1620,ag_sine(ag_in(tt,w("years","years",-0.2),1.4))),420);x.stroke();x.restore();
      fb_tag(x,tt,y0,null,300,360,"2027",{col:LP.ink});fb_tag(x,tt,w("years","years",-0.2),null,1100,360,"2028",{col:LP.ink});
      fb_pill(x,tt,w("years","years",0.4),null,960,520,"Months, or years",{col:LP.blue});
      fb_tag(x,tt,w("private","measures",-0.1),null,640,640,"His measures: his own",{align:"center",col:LP.ink});
      fb_tag(x,tt,w("private","reasons",-0.1),null,1280,640,"His reasons: private",{align:"center",col:LP.ink});}}
  ]);
  fb_kick(ctx,S,1,{light:"evening"});
});

/* ---------------------------------------------------------------- 6. On Monday */
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,w=(id,word,off)=>wAt(sc,id,word,off),mo={light:"morning"},hall={light:"day",wall:0},e0=c.breath+0.6;
  ag_shots(ctx,S,t,sc.dur,[
    // back at NUMMI: the same people, and what surrounded them
    {at:0,place:"fbHallLit",keys:[[0,960,540,1.0]],push:0,draw:(x,tt)=>{
      fb_line(x,tt,{clock:fb_clock(tt,70)});
      FB_SLOTS.forEach((sx,i)=>{lp_person(x,FB_CREW[i],sx,820,0.62,{t:tt,flip:i>=3,light:hall});});
      fb_pill(x,tt,w("back","people",-0.1),null,960,400,"The same people",{col:LP.ink});
      fb_pill(x,tt,w("back","surrounded",-0.1),null,960,480,"What surrounded them changed",{col:LP.green});}},
    // Helena did the same
    {at:c.helena-0.3,place:"fbMorning",keys:[[c.helena-0.3,960,540,1.0]],dis:1.2,draw:(x,tt)=>{
      fb_pill(x,tt,w("helena","found",-0.1),null,1180,300,"Found the causes",{col:LP.blue});
      fb_pill(x,tt,w("helena","cleared",-0.1),null,1180,400,"Cleared what she could",{col:LP.green,icon:"tick"});
      fb_pill(x,tt,w("helena","gave",-0.1),null,1180,500,"Gave it time",{col:LP.blue});
      lp_person(x,"helena",520,650,1.0,{t:tt,light:mo});}},
    // what to do on Monday
    {at:c.team-0.3,place:"fbMorning",later:true,keys:[[c.team-0.3,960,540,1.0]],draw:(x,tt)=>{const g=1-ag_in(tt,c.take-0.4,0.6);
      if(g>0.004){x.save();x.globalAlpha*=g;
        fb_sheet(x,tt,c.team+0.3,120,120,820,{kick:"One",title:"Read the team's shared work first"},{light:"morning"});
        fb_sheet(x,tt,w("cause","Ask",-0.1),980,120,820,{kick:"Two",title:"Ask, and look for the cause"},{light:"morning"});
        fb_sheet(x,tt,w("clear","Clear",-0.1),120,420,820,{kick:"Three",title:"Clear blockers; measure against the team"},{col:LP.green,light:"morning"});
        fb_sheet(x,tt,w("plan","Let",-0.1),980,420,820,{kick:"Four",title:"Their plan, read monthly, said honestly"},{col:LP.blue,light:"morning"});
        x.restore();}
      fb_tag(x,tt,w("next","Growing",-0.1),c.take-0.4,960,780,"Next: Growing people",{align:"center",col:LP.ink});
      const ta=ag_in(tt,c.take,0.4)*(1-ag_in(tt,e0,0.8));
      if(ta>0.004){for(const [s,wd,px] of [["Find the cause","Find",960-470],["Clear the way","clear",960],["Give it time","give",960+470]])
        {const t0=w("take",wd,-0.1);lp_pill(x,px,470,s,{col:wd==="clear"?LP.green:LP.blue,size:34,a:ta*ag_in(tt,t0,0.4),k:tt-t0});}}}}
  ]);
  lp_end(ctx,S,t,e0,"When someone falls behind",FB_LAST,"Film 3 of 4","Ownership and performance");
  fb_kick(ctx,S,1-ag_in(t,e0,0.8),{light:"morning"});
});
ag_cutInto(["behind","cause","time"]);
