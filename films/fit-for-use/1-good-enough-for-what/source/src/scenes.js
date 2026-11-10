/* ===== Good enough for what?: the scenes =====
   Five chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once:
   the film's oak worktable for Mercator's chart (chart.js), and the kit's three, the workroom's wall (bench), its granite seen from
   above (benchTop) and the Great Hall (hall). What moves is drawn live in the shots of ag_shots. In one place the camera glides on
   from shot to shot and only what changes fades; a later moment there is later:true, so what was there leaves before what comes
   next comes in. Between places a shot dissolves, or comes in on a cut (cut:true) where the two would show the same person or words:
   Andrés is never shown beside his student number. The title card ends chapter 1, the end card chapter 5. */

const ge_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// the film's kicker at the top left, in chapters 2 to 5: chalk on the granite, ink on the wall, and none in the Great Hall, where the
// lectern and its people fill the frame, nor on the oak, where Mercator's chart does; it steps aside for a moment where a shot changes
// from one to another, so it never changes colour, or comes and goes, in sight
const GE_KICKSTYLE={bench:"ink",hall:null,ge_table:null};
const ge_kickStyle=s=>s.place in GE_KICKSTYLE?GE_KICKSTYLE[s.place]:"chalk";
function ge_kick(ctx,t,shots,end){let a=ag_in(t,1.0,0.6),i=0;for(let k=1;k<shots.length;k++){if(t>=shots[k].at)i=k;
    if(ge_kickStyle(shots[k])!==ge_kickStyle(shots[k-1]))a=Math.min(a,1-ag_io(t,shots[k].at-0.45,shots[k].at+0.7,0.3));}
  a=Math.min(a,1-ag_in(t,end-0.6,0.4));const st=ge_kickStyle(shots[i]);if(a>0&&st)dq_kicker(ctx,"1","Good enough for what?",{dark:st==="chalk",a});}
// a run of times: when each of several things comes in
const ge_at=(tt,ts,i,d)=>ag_in(tt,ts[i]-0.15,d||0.45);

/* ---------------------------------------------------------------- 1 · A chart for sailors */
scene("chart",(ctx,S,t,sc)=>{const c=sc.cues,T=ge_once(sc,"T",()=>({
    compass:wAt(sc,"bearing","compass"),fixed:wAt(sc,"bearing","one fixed"),
    charts:wAt(sc,"plane","charts of the time"),straight:wAt(sc,"plane","straight line"),ports:wAt(sc,"plane","two ports"),
    steer:wAt(sc,"drift","Steer"),miss:wAt(sc,"landfall","miss"),change:c.change,
    stretched:wAt(sc,"stretch","stretched"),every:wAt(sc,"stretch","every course"),
    rule:wAt(sc,"ruler","rule a line"),angle:wAt(sc,"ruler","read its angle"),steerIt:wAt(sc,"ruler","steer it"),
    wright:c.wright,price:c.price,big:wAt(sc,"greenland","as big as"),fourteen:wAt(sc,"greenland","fourteen"),
    right:wAt(sc,"perfect","Right for"),wrong:wAt(sc,"perfect","wrong for"),
    data:c.data,seated:wAt(sc,"data","seated"),n41:wAt(sc,"still","forty-one"),
    benefit:c.benefit,use:wAt(sc,"benefit","use the list"),answer:wAt(sc,"benefit","answer for it"),build:wAt(sc,"benefit","build it"),
    level:wAt(sc,"levels","its own level")}));
  const shots=[
    // the worktable: Mercator's title and the compass, then the plane chart of the time, its course and the ship; his stretch, the
    // ruler and the course that holds; Wright; the price, Greenland as big as Africa; and the chart's two verdicts
    {at:0,place:"ge_table",keys:[[0,960,540,1.0],[T.compass-0.7,1182,500,1.3],[T.charts-1.2,960,540,1.0],[T.steer-0.4,700,470,1.24],[T.miss-0.7,470,470,1.85],[T.change+0.2,960,540,1.0]],d:1.8,push:0,
     draw:(cx,tt)=>{const gone=1-ag_in(tt,T.rule-0.9,0.6),
        // the title and the compass step aside while the camera is close on the crossing, so no card is cut by the frame's edge
        out=(1-ag_in(tt,T.wright-0.7,0.5))*(1-ag_io(tt,T.steer-0.7,T.change+1.9,0.5));
      // Mercator's chart as he published it; it leaves before the chart of the time comes in, so the two are never seen together
      ge_chart(cx,{a:ag_in(tt,0.1,0.8)*(1-ag_in(tt,T.charts-1.3,0.5)),u:1,ports:0,label:1});
      ge_chart(cx,{a:ag_in(tt,T.charts-0.6,0.6),u:ag_sine(clamp((tt-T.stretched)/2.8,0,1)),ports:ag_in(tt,T.ports-0.4,0.5),lisbonA:1-ag_io(tt,T.miss-0.9,T.change+1.9,0.5),
        line:clamp((tt-T.straight+0.1)/1.3,0,1),lineA:gone,track:ag_sine(clamp((tt-T.steer)/(T.miss-T.steer+0.4),0,1)),trackA:gone,
        gap:clamp((tt-T.miss)/0.9,0,1)*(1-ag_in(tt,T.stretched-0.4,0.4)),label:clamp((tt-T.stretched-1.4)/1.0,0,1),
        ruler:clamp((tt-T.rule+0.3)/1.0,0,1),rulerA:1-ag_in(tt,T.steerIt-0.2,0.6),rightLine:clamp((tt-T.rule-0.2)/1.0,0,1),angle:clamp((tt-T.angle+0.1)/1.4,0,1),
        right:ag_sine(clamp((tt-T.steerIt)/2.6,0,1))});
      dq_textCard(cx,1270,150,580,{kick:"Duisburg, 1569",title:"Gerardus Mercator",sub:"A new world chart, made for sailors"},{a:ag_in(tt,0.3,0.6)*out,k:clamp((tt-0.3)/1.0,0,1),on:"granite"});
      ge_compass(cx,1270,410,580,{a:ag_in(tt,T.compass-0.3,0.5)*out,k:clamp((tt-T.compass+0.3)/1.0,0,1),bearing:clamp((tt-T.fixed+0.2)/1.6,0,1),on:"granite"});
      dq_textCard(cx,1270,150,580,{kick:"1599",title:"Edward Wright",sub:"Worked out the stretch exactly. Most sea charts are still drawn this way."},
        {a:ag_in(tt,T.wright,0.5)*(1-ag_in(tt,T.price-0.6,0.5)),k:clamp((tt-T.wright)/1.0,0,1),on:"granite"});
      const sz=ge_sizes(cx,1270,150,580,{a:ag_in(tt,T.price-0.05,0.5),k:clamp((tt-T.price+0.05)/1.0,0,1),u:clamp((tt-T.fourteen+0.2)/1.8,0,1),
        say:"Africa is 14 times larger",sayA:ag_in(tt,T.fourteen+1.2,0.5),on:"granite"});
      // the chart's two verdicts: right for steering, wrong for comparing countries
      dq_tag(cx,350,650,"pass",{to:[459,482],text:"STEERING",k:clamp((tt-T.right+0.1)/0.9,0,1),on:"granite"});
      dq_tag(cx,1800,738,"stop",{to:[1740,sz.y+sz.h],text:"COMPARING SIZES",flip:true,k:clamp((tt-T.wrong+0.1)/0.9,0,1),on:"granite"});}},
    // the same idea in data: the university's graduation list, right for seating and wrong for names, then written down: each use and
    // its level, agreed with the people who use it
    {at:T.data-0.4,place:"bench",keys:[[0,960,520,1.08]],push:0.02,draw:(cx,tt)=>{const away=1-ag_in(tt,T.benefit-0.4,0.5);
      // everything leaves before the title card comes over the wall
      cx.save();cx.globalAlpha*=1-ag_in(tt,c.breath-0.7,0.5);
      const LB=ge_listCard(cx,610,160,700,{a:ag_in(tt,T.data,0.5),k:clamp((tt-T.data)/1.0,0,1)});
      cx.save();cx.globalAlpha*=away;
      dq_tag(cx,700,420,"pass",{to:[700,LB.y+LB.h],text:"SEATING",k:clamp((tt-T.seated+0.1)/0.9,0,1)});
      dq_tag(cx,1060,470,"stop",{to:[1060,LB.y+LB.h],text:"CERTIFICATES",k:clamp((tt-T.n41+0.1)/0.9,0,1)});
      dq_figure(cx,1100,640,"41","printed again",{col:"stop",size:110,a:ag_in(tt,T.n41+0.4,0.5)});cx.restore();
      // who wrote it down: the people who use it, answer for it and build it
      [["Uses it",T.use,640],["Answers for it",T.answer,960],["Builds it",T.build,1290]].forEach(([s,at,x])=>dq_chip(cx,x,410,s,{icon:"person",align:"center",a:ag_in(tt,at-0.1,0.45)}));
      // and each use's level, in brass
      [["Seating: within 2%",720,520],["Certificates: zero wrong",1200,520],["Programme: no difference",720,610],["Count of awards: exact",1200,610]].forEach(([s,x,y],i)=>{
        const k=clamp((tt-T.level-i*0.3)/1.0,0,1);if(k<=0)return;cx.save();ag_about(cx,x,y,lerp(0.7,1,ag_spr(k,0,0.5)));dq_chip(cx,x,y,s,{col:"brass",align:"center",a:sstep(0,0.3,k)});cx.restore();});
      cx.restore();}}];
  ag_shots(ctx,S,t,sc.dur,shots);
  dq_title(ctx,S,t,c.breath,"Good enough for what?",null,"Film 1 of 4 · Fit for use");});

/* ---------------------------------------------------------------- 2 · Forty-one certificates */
scene("reprint",(ctx,S,t,sc)=>{const c=sc.cues,T=ge_once(sc,"T",()=>({
    six:wAt(sc,"dec","six ceremonies"),grads:wAt(sc,"dec","two thousand"),
    list:c.list,row:["who graduates","which ceremony","which award","the name printed"].map(w=>wAt(sc,"list",w)),
    four:wAt(sc,"printer","four weeks"),after:wAt(sc,"printer","After that"),every:wAt(sc,"passed","every check"),
    reprints:c.reprints,n41:wAt(sc,"reprints","forty-one"),parts:["twenty-six","nine","six graduates"].map(w=>wAt(sc,"reprints",w)),
    dollars:wAt(sc,"cost","a hundred and twenty"),folder:wAt(sc,"cost","empty folder"),seated:wAt(sc,"seats","seated the hall"),within:wAt(sc,"seats","within a few"),
    andres:c.andres,held:c.held,without:wAt(sc,"held","without its accents"),seating:wAt(sc,"seat","For seating"),cert:wAt(sc,"seat","On his certificate")}));
  const shots=[
    // the Great Hall in December: Malia at the lectern, reading the names; six ceremonies, 2,031 graduates
    {at:0,place:"hall",keys:[[0,960,520,1.0],[T.six-0.3,1040,500,1.07]],d:2.2,draw:(cx,tt)=>{
      dq_lectern(cx,960,660,1);dq_person(cx,"malia",930,480,0.9,{t:tt,warm:1,cut:632});
      dq_figure(cx,1300,470,"2,031","graduates",{dark:true,a:ag_in(tt,T.grads-0.2,0.5)});
      dq_chip(cx,1300,600,"Six ceremonies",{icon:"cap",a:ag_in(tt,T.six-0.2,0.45)});dq_chip(cx,1300,680,"9 to 11 December 2025",{icon:"calendar",a:ag_in(tt,T.six+0.3,0.45)});}},
    // the list: one row of it; to the printer four weeks before; every check passed
    {at:T.list-0.4,place:"benchTop",keys:[[0,960,470,1.12]],push:0.02,draw:(cx,tt)=>{
      const R=dq_record(cx,580,150,760,{head:"Graduation list",rows:[{k:"Graduate",v:"S-19530"},{k:"Ceremony",v:"DEC25-3"},{k:"Award",v:"Master of Data Analytics"},{k:"Name printed",v:"Hamid Karimi"}]},
        {on:"granite",a:ag_in(tt,T.list-0.1,0.5),k:clamp((tt-T.list+0.1)/1.0,0,1),rowA:(r,i)=>ge_at(tt,T.row,i)});
      dq_tag(cx,640,610,"brass",{to:[640,R.y+R.h],text:"PRINTER: 13 NOV, 5 PM",icon:"printer",k:clamp((tt-T.four+0.1)/0.9,0,1),on:"granite"});
      dq_tag(cx,1150,640,"pass",{to:[1110,R.y+R.h],text:"EVERY CHECK",k:clamp((tt-T.every+0.1)/0.9,0,1),on:"granite"});}},
    // and still 41 printed again: what was wrong; the cost, an empty folder; and the seating, right
    {later:true,at:T.reprints-0.5,place:"benchTop",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      dq_figure(cx,200,330,"41","certificates printed again",{col:"stop",dark:true,size:130,a:ag_in(tt,T.n41-0.1,0.5)});
      ["26 with a wrong name","9 with a wrong award","6 graduates missing"].forEach((s,i)=>dq_chip(cx,200,480+i*84,s,{col:"stop",icon:"cross",a:ge_at(tt,T.parts,i),on:"granite"}));
      dq_chip(cx,1340,230,"About $120 each, with its courier",{align:"center",a:ag_in(tt,T.dollars-0.2,0.45),on:"granite"});
      ge_folder(cx,1340,470,0.86,{a:ag_in(tt,T.folder-0.3,0.5),k:clamp((tt-T.folder+0.3)/1.0,0,1)});
      const sb=dq_textCard(cx,1090,700,500,{kick:"Seating",title:"Within a few seats"},{a:ag_in(tt,T.seated-0.1,0.5),k:clamp((tt-T.seated+0.1)/1.0,0,1),on:"granite"});
      dq_tag(cx,1660,740,"pass",{to:[sb.x+sb.w,sb.y+50],text:"RIGHT",k:clamp((tt-T.within)/0.9,0,1),on:"granite"});}},
    // Andrés, who will cross the same stage next December
    {at:T.andres-0.4,place:"bench",keys:[[0,920,480,1.15]],push:0.02,draw:(cx,tt)=>{
      ge_person(cx,"andres",780,590,1.0,{t:tt,cut:DQ_BENCH.back},ag_in(tt,T.andres-0.2,0.5));
      dq_nameTag(cx,1080,380,"andres",{role:"Master of Data Analytics, December 2026",a:ag_in(tt,T.andres+0.4,0.5)});}},
    // his record in the student system: his name without its accents; right for a seat, wrong on his certificate. A cut: his number
    // is never shown beside his face
    {cut:true,at:T.held-0.3,place:"benchTop",keys:[[0,960,520,1.0]],push:0.02,draw:(cx,tt)=>{
      const lit=tt>T.without-0.2?[0,1]:[],R=dq_record(cx,560,250,800,{head:"Student system",id:"S-16874",rows:[{k:"Given name",v:"Andres"},{k:"Family name",v:"Penaloza"},{k:"Studying",v:"Master of Data Analytics"}]},
        {on:"granite",lit,litCol:null});
      dq_tag(cx,660,650,"pass",{to:[660,R.y+R.h],text:"SEATING",k:clamp((tt-T.seating+0.1)/0.9,0,1),on:"granite"});
      dq_tag(cx,1030,700,"stop",{to:[1030,R.y+R.h],text:"CERTIFICATE",k:clamp((tt-T.cert+0.1)/0.9,0,1),on:"granite"});}}];
  ag_shots(ctx,S,t,sc.dur,shots);ge_kick(ctx,t,shots,sc.dur);});

/* ---------------------------------------------------------------- 3 · One list, four uses */
const GE_TEAM=[["malia",280,"Uses the list"],["mei",660,"Answers for it"],["jun",1040,"Builds it"]];
scene("uses",(ctx,S,t,sc)=>{const c=sc.cues,T=ge_once(sc,"T",()=>({
    names:[c.malia,c.mei,c.jun],roles:[wAt(sc,"malia","uses it most"),wAt(sc,"mei","answers for"),wAt(sc,"jun","builds it")],
    ask2:c.ask2,qs:["who uses it","for what","what goes wrong"].map(w=>wAt(sc,"ask2",w)),
    uses:[c.seating,c.certs,c.prog,c.count],levels:[wAt(sc,"seating","Within two percent"),wAt(sc,"certs","Zero wrong"),wAt(sc,"prog","same names"),wAt(sc,"count","exactly")],
    four:c.four,juran:c.juran,fitness:wAt(sc,"juran","fitness for use"),good:wAt(sc,"same","good enough always")}));
  const shots=[
    // January 2026: Malia, Mei and Jun behind the bench; what they asked
    {at:0,place:"bench",keys:[[0,700,470,1.3],[c.ask-0.2,960,540,1.0]],d:2.0,draw:(cx,tt)=>{
      GE_TEAM.forEach(([w,x,role],i)=>{ge_person(cx,w,x,600,0.82,{t:tt+i*1.3,cut:DQ_BENCH.back},ag_in(tt,0.2+i*0.15,0.6));
        dq_nameTag(cx,x+30,252,w,{role,align:"center",a:ag_in(tt,T.names[i]-0.1,0.45)});});
      const qa=ag_in(tt,T.ask2-0.1,0.5);if(qa>0){const L=["Who uses it?","For what?","What goes wrong, for whom?"],x=1225,y=210,w=600;
        cx.save();cx.globalAlpha*=qa;dq_card(cx,x,y,w,330,{});dq_label(cx,x+DQ_PAD,y+58,"They asked");
        L.forEach((s,i)=>dq_T(cx,s,x+DQ_PAD,y+130+i*70,{w:800,size:36,a:ge_at(tt,T.qs,i)}));cx.restore();}}},
    // the four uses, each with what it needs and its level
    {later:true,at:T.uses[0]-0.6,place:"bench",keys:[[0,960,520,1.0]],push:0.02,draw:(cx,tt)=>{
      [[180,200],[1000,200],[180,420],[1000,420]].forEach(([x,y],i)=>ge_useCard(cx,x,y,740,i,{h:140,a:ag_in(tt,T.uses[i]-0.2,0.5),k:clamp((tt-T.uses[i]+0.2)/1.0,0,1),level:clamp((tt-T.levels[i]+0.1)/1.0,0,1)}));
      dq_T(cx,"One list, four uses, four levels",960,720,{w:800,size:36,align:"center",a:ag_in(tt,T.four-0.1,0.5)});}},
    // Juran: quality is fitness for use
    {later:true,at:T.juran-0.6,place:"bench",keys:[[0,960,500,1.0]],push:0.025,draw:(cx,tt)=>{
      ge_quote(cx,410,250,1100,{kick:"Joseph Juran",lines:["Quality is fitness for use."],sub:"Good enough always means good enough for a use.",subA:ag_in(tt,T.good-0.2,0.5),
        a:ag_in(tt,T.juran-0.2,0.5),k:clamp((tt-T.juran+0.2)/1.0,0,1)});}}];
  ag_shots(ctx,S,t,sc.dur,shots);ge_kick(ctx,t,shots,sc.dur);});

/* ---------------------------------------------------------------- 4 · What each use needs */
const GE_ROW=[{k:"Graduate",v:"S-19530"},{k:"Name as printed",v:"Hamid Karimi"},{k:"Award",v:"Master of Data Analytics"},{k:"Conferred on",v:"4 November 2025"},
  {k:"Ceremony",v:"DEC25-3"},{k:"Crosses the stage",v:"Yes"}];
const GE_DIMS=["Complete?","Unique?","Valid?","Consistent?","Accurate?","On time?"];
scene("needs",(ctx,S,t,sc)=>{const c=sc.cues,T=ge_once(sc,"T",()=>({
    critical:wAt(sc,"few","critical data"),seat:[wAt(sc,"seatneeds","each graduate once"),wAt(sc,"seatneeds","their ceremony"),wAt(sc,"seatneeds","whether")],
    cert:[wAt(sc,"certneeds","the name as printed"),wAt(sc,"certneeds","the award"),wAt(sc,"certneeds","the date")],certneeds:c.certneeds,
    ask6:c.ask6,q:["Is it complete","Unique","Valid","Consistent","Accurate","On time"].map(w=>wAt(sc,"ask6",w)),
    six:wAt(sc,"dama","six dimensions"),iso:wAt(sc,"dama","eye-so"),lean:c.lean,mercator:wAt(sc,"lean","Mercator's chart"),
    complete:wAt(sc,"seatdim","complete"),accurate:wAt(sc,"certdim","accurate"),
    agreed:c.agreed,malia:wAt(sc,"agreed","Malia"),planning:wAt(sc,"agreed","Planning"),mei:wAt(sc,"owner","Mei owns"),
    rules:wAt(sc,"films","Rules that run"),too:wAt(sc,"films","Too good")}));
  const shots=[
    // one row of the list, and what each use can't do without: seating's three fields, then a certificate's
    {at:0,place:"benchTop",keys:[[0,960,520,1.0]],push:0.025,draw:(cx,tt)=>{
      const ss=[0,4,5],cs=[1,2,3],sw=ag_in(tt,T.certneeds-0.3,0.4),lit=sw<0.5?ss.filter((r,j)=>tt>T.seat[j]-0.2):cs.filter((r,j)=>tt>T.cert[j]-0.2);
      const R=dq_record(cx,170,170,780,{head:"Graduation list",rows:GE_ROW},{on:"granite",lit,litCol:"brass",a:ag_in(tt,0.3,0.6),k:clamp((tt-0.3)/1.0,0,1)});
      dq_label(cx,1040,250,"Critical data",{dark:true,a:ag_in(tt,T.critical-0.2,0.5)});
      dq_chip(cx,1040,330,"For seating",{icon:"seat",col:"brass",a:ag_in(tt,T.seat[0]-0.3,0.45)*(1-sw),on:"granite"});
      dq_chip(cx,1040,330,"For a certificate",{icon:"certificate",col:"brass",a:ag_in(tt,T.certneeds,0.45),on:"granite"});}},
    // six questions: DAMA's six dimensions; ISO/IEC 25012 names fifteen. Each use leans on its own: seating on complete, a certificate on accurate
    {later:true,at:T.ask6-0.5,place:"benchTop",keys:[[0,960,520,1.0]],push:0.02,draw:(cx,tt)=>{const ln=ag_in(tt,T.complete-0.2,0.5);
      GE_DIMS.forEach((s,i)=>{const x=[480,960,1440][i%3],y=[260,360][Math.floor(i/3)],me=i===0?T.complete:i===4?T.accurate:null,on=me!=null?ag_in(tt,me-0.2,0.5):0;
        cx.save();cx.globalAlpha*=lerp(1,0.45,ln*(1-on));ge_dimChip(cx,x,y,s,on,i===0?"seat":"certificate",{size:34,a:ge_at(tt,T.q,i),on:"granite"});cx.restore();});
      dq_textCard(cx,560,470,800,{kick:"DAMA",title:"Six dimensions of data quality"},{a:ag_in(tt,T.six-0.2,0.5)*(1-ag_in(tt,T.mercator-0.6,0.5)),k:clamp((tt-T.six+0.2)/1.0,0,1),on:"granite"});
      dq_chip(cx,960,700,"ISO/IEC 25012 names fifteen",{align:"center",a:ag_in(tt,T.iso-0.2,0.45)*(1-ag_in(tt,T.mercator-0.6,0.5)),on:"granite"});
      dq_textCard(cx,610,500,700,{kick:"Mercator's chart",title:"Angles over sizes"},{a:ag_in(tt,T.mercator-0.1,0.5),k:clamp((tt-T.mercator+0.1)/1.0,0,1),on:"granite"});}},
    // the four levels, each agreed with the people who use it; Mei owns them; and the two films that say how checks warn and stop
    {later:true,at:T.agreed-0.6,place:"benchTop",keys:[[0,960,520,1.0]],push:0.02,draw:(cx,tt)=>{
      [[180,140],[1000,140],[180,350],[1000,350]].forEach(([x,y],i)=>ge_useCard(cx,x,y,740,i,{a:ag_in(tt,T.agreed-0.3+i*0.12,0.5),who:clamp((tt-(i<3?T.malia:T.planning)+0.1-(i<3?i*0.15:0))/0.8,0,1),on:"granite"}));
      dq_chip(cx,960,610,"Owner: Mei Tanaka, registrar's office",{icon:"person",align:"center",a:ag_in(tt,T.mei-0.2,0.45),on:"granite"});
      dq_textCard(cx,420,680,520,{kick:"See",title:"Rules that run"},{a:ag_in(tt,T.rules-0.2,0.5),k:clamp((tt-T.rules+0.2)/1.0,0,1),on:"granite"});
      dq_textCard(cx,980,680,520,{kick:"See",title:"Too good to be true"},{a:ag_in(tt,T.too-0.2,0.5),k:clamp((tt-T.too+0.2)/1.0,0,1),on:"granite"});}}];
  ag_shots(ctx,S,t,sc.dur,shots);ge_kick(ctx,t,shots,sc.dur);});

/* ---------------------------------------------------------------- 5 · Written beside the data */
// the list's model file in dbt (models/marts/graduations/_graduations__models.yml): the certificates' rule in its meta.quality, then three
// of the columns a use can't do without; its checks and the dimension a built-in check records; its columns on Databricks
const GE_RULE=["quality:","  - name: certificates_exactly_right","    use: certificates","    dimension: accuracy","    description: >",
  "      For the certificates: each name exactly as the graduate…","    level: Zero wrong","    agreed_with: \"Malia Fonoti, graduations office\"",
  "    business_impact: >","      A certificate printed again, about 120 dollars…"];
const GE_COLS=["- name: award_name","  data_type: string","  config:","    meta: {critical_for: [certificates, ceremony_programme]}","- name: conferred_on","  data_type: date",
  "  config:","    meta: {critical_for: [certificates, awards_return]}","- name: ceremony_id","  data_type: string","  config:","    meta: {critical_for: [seating_plan, ceremony_programme]}"];
const GE_DBT=["- name: name_as_printed","  data_tests:","    - not_null:","        config:","          meta: {owner: \"Mei Tanaka, registrar's office\"}","  config:",
  "    meta: {personal_data: direct, critical_for: [certificates, ceremony_programme]}"];
const GE_SQL=["{% test not_null(model, column_name) %}","    {{ config(meta={'dimension': 'completeness'}) }}"];
const GE_UC=[["graduation_bk",1],["student_bk",1],["given_name",0],["family_name",0],["name_as_printed",1],["award_code",1],["award_name",1]];
scene("written",(ctx,S,t,sc)=>{const c=sc.cues,T=ge_once(sc,"T",()=>({
    dc:wAt(sc,"contract","the file"),qr:wAt(sc,"rule","quality rule"),dim:wAt(sc,"rule","its dimension"),lvl:wAt(sc,"rule","its level"),
    agr:wAt(sc,"rule","who agreed"),cost:wAt(sc,"rule","what a failure"),critical:c.critical,marked:wAt(sc,"critical","marked"),
    dbt:c.dbt,dimension:wAt(sc,"dbt","its dimension"),owner:wAt(sc,"dbt","its owner"),tag:c.tag,governed:wAt(sc,"tag","governed tag"),finds:wAt(sc,"tag","whoever finds"),
    gov:c.gov,governance:wAt(sc,"gov","governance"),tools:wAt(sc,"gov","your tools"),back:c.back,title:wAt(sc,"back","in its title"),sailors:wAt(sc,"back","for the use"),
    list:c.list,four:wAt(sc,"list","four uses"),next:c.next,take:c.take}));
  const shots=[
    // the list's model file: the certificates' rule, written in words; then the columns each use can't do without
    {at:0,place:"bench",keys:[[0,960,500,1.0]],push:0.02,draw:(cx,tt)=>{const sw=ag_in(tt,T.critical-0.5,0.45),inn=ag_in(tt,T.critical,0.5);
      dq_window(cx,230,140,1460,660,{logo:"dbt",product:"dbt",title:"models/marts/graduations/_graduations__models.yml",a:ag_in(tt,T.dc-0.3,0.5),k:clamp((tt-T.dc+0.3)/1.0,0,1),draw:(c2,b)=>{
        const lit=[[3,T.dim],[6,T.lvl],[7,T.agr],[8,T.cost],[9,T.cost]].filter(([i,at])=>tt>at-0.15).map(([i])=>i);
        dq_code(c2,b.x+12,b.y+6,GE_RULE,{lit,w:b.w-24,a:1-sw});
        dq_code(c2,b.x+12,b.y+6,GE_COLS,{lit:tt>T.marked-0.2?[3,7,11]:[],w:b.w-24,a:inn});}});}},
    // dbt: the list's checks name their owner, and every built-in check its dimension
    {later:true,at:T.dbt-0.5,place:"bench",keys:[[0,960,500,1.0]],push:0.02,draw:(cx,tt)=>{
      dq_window(cx,230,140,1460,660,{logo:"dbt",product:"dbt",title:"models/marts/graduations/_graduations__models.yml",draw:(c2,b)=>{
        dq_code(c2,b.x+12,b.y+6,GE_DBT,{lit:tt>T.owner-0.15?[4]:[],w:b.w-24});
        const y2=b.y+6+GE_DBT.length*44+26;c2.fillStyle="rgba(110,90,66,0.25)";c2.fillRect(b.x,y2-10,b.w,1.6);
        dq_T(c2,"tests/generic/builtin.sql",b.x+12,y2+34,{w:600,size:28,col:DQ.soft});
        dq_code(c2,b.x+12,y2+52,GE_SQL,{lit:tt>T.dimension-0.15?[1]:[],w:b.w-24});}});}},
    // Databricks: in Catalog Explorer, each column a use can't do without carries the governed tag critical_data
    {later:true,at:T.tag-0.5,place:"bench",keys:[[0,960,500,1.0]],push:0.02,draw:(cx,tt)=>{
      dq_window(cx,230,140,1460,660,{logo:"databricks",product:"Databricks",title:"Catalog Explorer",draw:(c2,b)=>{
        dq_T(c2,"mart_graduations__graduation_list",b.x+12,b.y+40,{w:500,size:30,f:"mono"});
        const ta=ag_in(tt,T.governed-0.2,0.5),y0=b.y+70,rows=GE_UC.map(([n,crit])=>[{s:n,f:"mono"},"string",""]);
        dq_rows(c2,b.x+12,y0,[{h:"Column",w:560},{h:"Type",w:260},{h:"Tags",w:500}],rows,{rh:58,lit:tt>T.finds-0.2?GE_UC.map((r,i)=>r[1]?i:-1).filter(i=>i>=0):[],litCol:"brass"});
        GE_UC.forEach(([n,crit],i)=>{if(!crit||ta<=0)return;const x=b.x+12+820+14,cy=y0+58*(i+1)+29,w=dq_tw(c2,"critical_data",{w:500,size:28,f:"mono"})+70;
          c2.save();c2.globalAlpha*=ag_in(tt,T.governed-0.2+i*0.08,0.4);rr(c2,x,cy-21,w,42,21);c2.fillStyle="rgba(120,100,76,0.1)";c2.fill();c2.strokeStyle="rgba(110,90,66,0.55)";c2.lineWidth=1.6;c2.stroke();
          dq_icon(c2,"tag",x+24,cy,26,DQ.soft);dq_T(c2,"critical_data",x+46,cy+10,{w:500,size:28,f:"mono"});c2.restore();});}});}},
    // if quality keeps failing: governance first, then the tools
    {later:true,at:T.gov-0.5,place:"bench",keys:[[0,960,500,1.0]],push:0.02,draw:(cx,tt)=>{
      dq_textCard(cx,290,280,640,{kick:"First",title:"Your governance",sub:"Who owns the data, and who decides"},{icon:"people",a:ag_in(tt,T.governance-0.2,0.5),k:clamp((tt-T.governance+0.2)/1.0,0,1)});
      dq_textCard(cx,990,280,640,{kick:"Then",title:"Your tools",sub:"What builds the data, and checks it"},{icon:"tools",a:ag_in(tt,T.tools-0.2,0.5),k:clamp((tt-T.tools+0.2)/1.0,0,1)});}},
    // Mercator's chart again, its title: for the use of sailors
    {at:T.back-0.5,place:"ge_table",keys:[[0,960,540,1.0]],push:0.02,draw:(cx,tt)=>{
      ge_chart(cx,{u:1,ports:1,label:1,labelA:1-ag_in(tt,T.title-0.6,0.5),rightLine:1,right:1});
      dq_textCard(cx,1290,300,560,{kick:"Its title, 1569",title:"Ad usum navigantium",sub:"For the use of sailors"},{edge:"brass",a:ag_in(tt,T.title-0.1,0.5),k:clamp((tt-T.title+0.1)/1.0,0,1),on:"granite"});}},
    // the graduation list, now saying what it's for; and the next film
    {at:T.list-0.5,place:"bench",keys:[[0,960,500,1.0]],push:0.02,draw:(cx,tt)=>{
      ge_listCard(cx,660,130,600,{kick:"January 2026"});
      [[180,330],[1000,330],[180,520],[1000,520]].forEach(([x,y],i)=>ge_useCard(cx,x,y,740,i,{h:140,a:ag_in(tt,T.four-0.3+i*0.15,0.5)}));}},
    {later:true,at:T.next-0.4,place:"bench",keys:[[0,960,500,1.0]],push:0.02,draw:(cx,tt)=>{
      dq_textCard(cx,560,330,800,{kick:"Next",title:"A hundred records",sub:"Film 2 of 4 · Fit for use"},{a:ag_in(tt,T.next,0.5)*(1-ag_in(tt,T.take-1.1,0.5)),k:clamp((tt-T.next)/1.0,0,1),icon:"lens"});}}];
  ag_shots(ctx,S,t,sc.dur,shots);ge_kick(ctx,t,shots,T.take-0.5);
  dq_end(ctx,S,t,T.take-0.5,"Good enough for what?","Ask what it's for before you ask if it's good.","Film 1 of 4","Fit for use");});
