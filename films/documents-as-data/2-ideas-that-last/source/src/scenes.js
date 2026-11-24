/* ===== Ideas that last, features you test: the scenes =====
   Five chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The opening stays in one place of
   the 1960s, painted once (the limb workshop of Jaipur's hospital, its feet on the bench), where the camera glides and only what
   changes fades, and comes to the university's night map for its last line and the title card. The three chapters after it stay in
   one room, the map, where the camera holds and only what changes fades; each opens on the one before (ag_cutInto). The last goes
   back to the workshop, then to the map for its end. Words over the workshop are drawn in the frame itself (il_scr), so they stay put
   while the camera moves. */

// the film's name at the top left, and the chapter's case under it
function il_top(ctx,a){md_label(ctx,96,100,"Ideas that last, features you test",{col:MD.soft,a});}
function il_case(ctx,text,a,col){md_tag(ctx,96,166,text,{col:col||MD.soft,a});}
// a person, faded as one picture
function il_who(ctx,who,x,y,s,a,o){if(a<=0.004)return null;let h=null;withA(ctx,a,()=>{h=md_person(ctx,who,x,y,s,o);});return h;}
// a lane of the map's light from a to b, drawn as far as u, with what moves along it
function il_link(ctx,pts,u,t,o){o=o||{};if(u<=0)return;md_lane(ctx,pts,o.col||MD.flow,o.a==null?0.85:o.a,{u,dash:o.dash,t});
  if(u>=1&&o.flow!==false)md_flow(ctx,pts,t,{kind:o.kind||"events",col:o.col||MD.flow,a:o.a==null?1:o.a,every:o.every||1.1,off:o.off||0});}
// a line struck through a card, drawn from its left as u goes from 0 to 1
function il_strike(ctx,x0,y0,x1,y1,u,a){if(u<=0||a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(MD.fail,0.95);ctx.lineWidth=5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,ag_eo(u)),lerp(y0,y1,ag_eo(u)));ctx.stroke();ctx.restore();}
// the loop: a ring of the map's light round (cx, cy), drawn as far as u, and its four steps at the top, right, bottom and left, each lit
// while its line is said (lit: the index, or -1)
const IL_STEPS=["Investigate","Adapt","Implement","Iterate"];
function il_loop(ctx,t,cx,cy,R,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const ring=[];for(let i=0;i<=72;i++){const an=-Math.PI/2+i/72*TAU;ring.push([cx+Math.cos(an)*R,cy+Math.sin(an)*R]);}
  const u=o.u==null?1:o.u;md_lane(ctx,ring,MD.flow,0.8*a,{u,t});if(u>=1)md_flow(ctx,ring,t,{kind:"events",col:MD.flow,a,every:o.every||0.9});
  const P_=[[cx,cy-R],[cx+R,cy],[cx,cy+R],[cx-R,cy]];
  IL_STEPS.forEach((s,i)=>{const q=a*(o.stepA?o.stepA(i):1);if(q<=0)return;const lit=o.lit===i,b=md_tag(ctx,P_[i][0],P_[i][1],s,{align:"center",col:lit?MD.agreed:MD.flow,a:q});
    if(lit)glow(ctx,P_[i][0],P_[i][1],b.w*0.7,MD.agreed,0.25*q);});}
// a small card with an icon and words that wrap to its width, at 30 px; returns its height
function il_idea(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a,lines=md_wrap(ctx,text,w-96,{w:600,size:30}),h=30+lines.length*40;if(a<=0.004)return h;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.7,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:o.edge||null,glow:0.5});
  md_icon(ctx,o.icon||"tick",x+40,y+h/2,30,o.edge||MD.soft);lines.forEach((l,i)=>md_T(ctx,l,x+72,y+50+i*40,{w:600,size:30,col:o.col||MD.ink}));ctx.restore();return h;}

/* ---------------------------------------------------------------- 1 · A foot for bare feet */
// what the foot from abroad couldn't do, each crossed out; what the workshop's foot let people do, each ticked
const IL_CANT=[["Barefoot","shoe"],["Squat","squat"],["Sit on the floor","squat"]];
const IL_CAN=[["Walk barefoot","walked barefoot"],["Squat","squatted"],["Sit cross-legged","sat cross-legged"],["Work in wet fields","wet fields"],["Climb trees","climbed trees"]];
const IL_TRY=[["Walk","walked on it"],["Squat","squatted"],["Sit on the floor","sat on the floor"],["Where does it hurt?","where it hurt"],["Change it","changed it"]];
scene("foot",(ctx,S,t,sc)=>{const c=sc.cues,T=il_once(sc,"T",()=>({
    jaipur:wAt(sc,"place","Jaipur"),hosp:wAt(sc,"place","Sawai Man Singh"),leg:wAt(sc,"place","lost a leg"),
    artificial:wAt(sc,"abroad","an artificial foot"),abroad:wAt(sc,"abroad","from abroad"),
    shoe:wAt(sc,"shoe","in a shoe"),barefoot:wAt(sc,"shoe","barefoot"),water:wAt(sc,"shoe","under water"),
    heavy:wAt(sc,"squat","heavy and stiff"),squat:wAt(sc,"squat","squat"),floor:wAt(sc,"squat","sit on the floor"),
    gave:wAt(sc,"gave","gave it up"),work:wAt(sc,"gave","the work"),
    life:wAt(sc,"change","the life they lived"),
    sethi:wAt(sc,"team","Pramod Karan Sethi"),sharma:wAt(sc,"team","Ram Chandra Sharma"),
    wood:wAt(sc,"made","wood and rubber"),tyre:wAt(sc,"made","cured like a tyre"),fitted:wAt(sc,"made","fitted them"),
    walked:wAt(sc,"tried","walked on it"),squatted:wAt(sc,"tried","squatted"),sat:wAt(sc,"tried","sat on the floor"),hurt:wAt(sc,"tried","where it hurt"),changed:wAt(sc,"tried","changed it"),again:wAt(sc,"tried","tried again"),
    bent:wAt(sc,"foot","looked and bent"),
    cb:wAt(sc,"could","walked barefoot"),csq:wAt(sc,"could","squatted"),ccl:wAt(sc,"could","sat cross-legged"),cwf:wAt(sc,"could","wet fields"),ctr:wAt(sc,"could","climbed trees"),
    hour:wAt(sc,"hour","about an hour"),less:wAt(sc,"hour","far less"),
    y1975:wAt(sc,"free","nineteen seventy-five"),free:wAt(sc,"free","fitted it free"),n700:wAt(sc,"free","seven hundred thousand"),n44:wAt(sc,"free","forty-four"),
    changing:wAt(sc,"kept","kept changing"),plastics:wAt(sc,"kept","plastics"),question:wAt(sc,"kept","the first question"),
    platforms:wAt(sc,"same","Data platforms"),month:wAt(sc,"same","every month"),lasts:wAt(sc,"same","What lasts"),test:wAt(sc,"same","a quick, honest way")}));
  const uni0=T.platforms-0.9,pOut=c.foot-0.4;
  ag_shots(ctx,S,t,sc.dur,[
    // the workshop: the foot from abroad on the bench, and what it couldn't do; then the surgeon and the craftsman, the feet they made and
    // tried, again and again; the bare foot, what it let people do, and how far it went. One room: the camera glides, what changes fades
    {at:0,place:"ilWork",keys:[[0,960,520,1.0],[T.artificial-0.6,1060,560,1.12],[c.team-0.6,960,540,1.0],[c.could-0.6,1000,560,1.06],[c.kept-0.6,960,540,1.0]],d:2.4,push:0.012,draw:(cx,tt)=>{
      // the feet on the bench: the shoe from abroad, then, beside it, the workshop's foot; the shoe goes once the bare foot is made
      const shoeA=ag_in(tt,T.artificial-0.3,0.6)*(1-ag_in(tt,T.bent-0.6,0.8)),bareA=ag_in(tt,T.wood-0.2,0.7);
      const shoeX=980;il_footShoe(cx,shoeX,742,180,{a:shoeA});
      const bareX=lerp(1180,900,ag_sine((tt-T.bent+0.5)/1.4)),flex=0.7*Math.max(ag_io(tt,T.squatted-0.2,T.sat+0.6,0.4),ag_io(tt,T.csq-0.2,T.ccl+0.6,0.4))*Math.max(0.25,Math.abs(Math.sin(tt*1.6)));
      il_footBare(cx,bareX,742,180,{a:bareA,flex,k:il_k(tt,T.wood-0.2),glow:ag_io(tt,T.bent-0.2,c.hour-0.2,0.6)});
      il_scr(cx,S,()=>{const lA=ag_io(tt,0.5,c.change-0.6,0.7);md_label(cx,96,118,"Jaipur, India, the 1960s",{col:MD.soft,a:lA});md_T(cx,"Sawai Man Singh Hospital",96,166,{w:700,size:36,a:lA*ag_in(tt,T.hosp-0.3,0.7)});
        md_tag(cx,96,240,"People who had lost a leg",{col:MD.soft,a:lA*ag_in(tt,T.leg-0.2,0.5)});
        // the foot from abroad: a shoe; barefoot lives, wet fields; heavy and stiff; what it couldn't do; given up
        const fA=ag_io(tt,T.artificial-0.3,c.change-0.6,0.5);md_textCard(cx,1180,150,640,{kick:"An artificial foot",title:"Made to a design from abroad",sub:"Worn in a shoe"},{edge:MD.soft,a:fA,k:il_k(tt,T.artificial-0.3)});
        const cA=ag_io(tt,T.barefoot-0.3,c.change-0.6,0.5);if(cA>0){md_card(cx,1180,400,640,250,{edge:MD.fail,a:cA,glow:0.5});md_T(cx,"WHAT IT COULDN'T DO",1208,452,{w:800,size:28,ls:4,col:MD.fail,a:cA});
          IL_CANT.forEach(([s],i)=>{const at_=[T.barefoot,T.squat,T.floor][i],q=cA*ag_in(tt,at_-0.25,0.4),y=510+i*44;md_T(cx,s,1260,y+10,{w:600,size:30,a:q});il_cross(cx,1228,y,11,ag_in(tt,at_+0.1,0.5),q);});}
        md_tag(cx,96,330,"Fields often under water",{col:MD.flow,a:ag_io(tt,T.water-0.3,c.change-0.6,0.5)});
        md_tag(cx,96,410,"Heavy and stiff",{col:MD.fail,icon:"warn",a:ag_io(tt,T.heavy-0.3,c.change-0.6,0.5)});
        md_pill(cx,640,560,"Given up",{col:MD.fail,icon:"cross",a:ag_io(tt,T.gave-0.3,c.team-0.6,0.5),k:il_k(tt,T.gave-0.3)});
        md_textCard(cx,560,150,800,{title:"A foot for the life they lived",sub:"Not for a shoe"},{edge:MD.agreed,a:ag_io(tt,c.change-0.3,c.team-0.6,0.5),k:il_k(tt,c.change-0.3)});
        // the surgeon and the craftsman, at either side of the bench
        const pA=ag_in(tt,c.team-0.4,0.8)*(1-ag_in(tt,pOut,0.8)),nmA=pA*(1-ag_in(tt,c.tried-0.6,0.5));if(pA>0){withA(cx,pA,()=>il_period(cx,"surgeon",300,590,0.98,{t:tt,gaze:[3,0]}));withA(cx,pA,()=>il_period(cx,"craftsman",1620,590,0.98,{t:tt,gaze:[-3,0],flip:true}));
          md_nameTag(cx,470,400,IL_P.surgeon,{col:MD.agreed,a:nmA*ag_in(tt,T.sethi-0.3,0.5)});md_nameTag(cx,1450,400,IL_P.craftsman,{align:"right",col:MD.agreed,a:nmA*ag_in(tt,T.sharma-0.3,0.5)});}
        // made, fitted; each trial, then changed and tried again
        md_textCard(cx,500,150,480,{kick:"Made in the workshop",title:"Wood and rubber",sub:"Cured like a tyre"},{edge:MD.agreed,a:ag_io(tt,T.wood-0.3,c.tried-0.6,0.5),k:il_k(tt,T.wood-0.3)});
        md_tag(cx,740,420,"Fitted on patients",{align:"center",col:MD.agreed,a:ag_io(tt,T.fitted-0.3,c.tried-0.6,0.5)});
        const tA=ag_io(tt,c.tried-0.3,pOut,0.5);if(tA>0){md_card(cx,500,150,480,420,{a:tA});md_T(cx,"EACH TRIAL",528,202,{w:800,size:28,ls:4,col:MD.soft,a:tA});
          IL_TRY.forEach(([s],i)=>{const at_=[T.walked,T.squatted,T.sat,T.hurt,T.changed][i],q=tA*ag_in(tt,at_-0.25,0.4),y=262+i*62;md_T(cx,s,580,y+10,{w:600,size:30,col:i===3?MD.wait:i===4?MD.agreed:MD.ink,a:q});
            md_icon(cx,i===3?"warn":i===4?"refresh":"tick",546,y,28,i===3?MD.wait:i===4?MD.agreed:MD.pass,{a:q});});
          md_tag(cx,740,630,"Tried again",{align:"center",col:MD.agreed,icon:"refresh",a:tA*ag_in(tt,T.again-0.3,0.5)});}
        // the bare foot, and what people could do on it
        md_textCard(cx,560,150,800,{kick:"By the end of the 1960s",title:"A foot that looked and bent like a bare one"},{edge:MD.pass,icon:"tick",a:ag_io(tt,T.bent-0.3,c.could-0.6,0.5),k:il_k(tt,T.bent-0.3)});
        const kA=ag_io(tt,c.could-0.3,c.hour-0.6,0.5);if(kA>0){md_card(cx,1180,150,640,380,{edge:MD.pass,a:kA,glow:0.5});md_T(cx,"ON IT, PEOPLE COULD",1208,202,{w:800,size:28,ls:4,col:MD.pass,a:kA});
          IL_CAN.forEach(([s],i)=>{const at_=[T.cb,T.csq,T.ccl,T.cwf,T.ctr][i],q=kA*ag_in(tt,at_-0.25,0.4),y=262+i*56;md_icon(cx,"tick",1226,y,28,MD.pass,{a:q});md_T(cx,s,1260,y+10,{w:600,size:30,a:q});});}
        // an hour; far less; from 1975, free; the count
        md_textCard(cx,1180,150,640,{kick:"Made in about an hour",title:"For far less",sub:"than a foot from abroad"},{edge:MD.pass,icon:"clock",a:ag_io(tt,T.hour-0.3,c.free-0.6,0.5),k:il_k(tt,T.hour-0.3)});
        const nA=ag_io(tt,c.free-0.3,c.kept-0.6,0.5);if(nA>0){md_textCard(cx,1180,150,640,{kick:"From 1975",title:"Fitted free, in Jaipur"},{edge:MD.agreed,a:nA,k:il_k(tt,T.y1975-0.3)});
          const n=Math.round(700000*ag_sine((tt-T.n700+0.4)/1.2));md_T(cx,n>0?"More than "+n.toLocaleString("en-US"):"",1208,440,{w:700,size:44,col:MD.pass,a:nA*ag_in(tt,T.n700-0.4,0.4)});
          md_T(cx,"limbs so far",1208,490,{w:600,size:30,col:MD.soft,a:nA*ag_in(tt,T.n700,0.4)});md_tag(cx,1208,560,"India and 44 other countries",{col:MD.flow,a:nA*ag_in(tt,T.n44-0.3,0.5)});}
        // the foot kept changing; the question stayed
        const qA=ag_io(tt,c.kept-0.3,uni0+0.2,0.5);md_tag(cx,1180,200,"New materials, again and again",{col:MD.flow,icon:"refresh",a:qA*ag_in(tt,T.changing-0.3,0.5)});
        md_textCard(cx,1180,290,640,{kick:"The first question",title:"How does this person live?"},{edge:MD.agreed,a:qA*ag_in(tt,T.question-0.3,0.5),k:il_k(tt,T.question-0.3)});});}},
    // today: the university's map, its tools always changing; what lasts, the ideas and a quick, honest test
    {at:uni0,place:"map",dis:0.9,keys:[[0,960,540,1.0]],push:0.015,draw:(cx,tt)=>{
      const ch=["New feature","New name","New limit","New option","New screen","New default"];
      ch.forEach((s,i)=>{const t0=T.month-0.6+i*0.42,q=ag_io(tt,t0,t0+1.5,0.3)*(1-ag_in(tt,T.lasts-0.4,0.4));if(q<=0)return;md_tag(cx,[300,1380,520,1240,360,1500][i],[300,330,720,660,520,520][i],s,{col:MD.soft,a:q});});
      md_pill(cx,960,430,"The ideas",{col:MD.agreed,icon:"person",a:ag_in(tt,T.lasts-0.2,0.5),k:il_k(tt,T.lasts-0.2)});
      md_pill(cx,960,560,"A quick, honest test",{col:MD.flow,icon:"refresh",a:ag_in(tt,T.test-0.2,0.5),k:il_k(tt,T.test-0.2)});}}
  ],0.9);
  md_title(ctx,S,t,c.breath,"Ideas that last, features you test","What the topic taught, and how to keep up","Documents and closing remarks · Modern data basics");});

/* ---------------------------------------------------------------- 2 · What the module showed */
// the four series, and what each one showed, line by line
const IL_SERIES=[["Data that moves",[["Agree what each field means","moves"],["As fresh as the business acts","fresh"],["Written once, read by all","once"]]],
  ["Data as software",[["Tested, reviewed, released","software"],["The platform watches; a person decides","watches"]]],
  ["From tables to decisions",[["Answers on demand","tables"],["Each measure defined in the open","tables"],["Every reader reads as itself","readers"]]],
  ["Documents and closing remarks",[["Read it, keep it, or write it as data","docs"]]]];
scene("recap",(ctx,S,t,sc)=>{const c=sc.cues,T=il_once(sc,"T",()=>({
    walk:wAt(sc,"walk","walked"),born:wAt(sc,"walk","where data is born"),reads:wAt(sc,"walk","who reads it"),
    dtm:wAt(sc,"moves","Data that moves"),fresh:wAt(sc,"fresh","How fresh"),acts:wAt(sc,"fresh","acts on it"),day:wAt(sc,"fresh","a day old"),
    das:wAt(sc,"software","Data as software"),ftd:wAt(sc,"tables","From tables to decisions"),open:wAt(sc,"tables","defined in the open"),
    docs:wAt(sc,"docs","Documents and closing remarks"),older:wAt(sc,"older","older than the tools")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    // the platform's map, walked from where data is born to who reads it
    const mA=ag_in(tt,0.1,0.6)*(1-ag_in(tt,c.moves-0.8,0.6));
    md_map(cx,tt,{a:mA,lit:tt<T.born-0.2?null:tt<T.reads-0.2?["hr","fin","sis","lms"]:tt<c.moves-0.8?["fabric","genie","dash","apps"]:null});
    // then the four series, in columns, each lit as it's named, its ideas under it
    const sA=ag_in(tt,c.moves-0.5,0.6);if(sA<=0)return;il_top(cx,sA);il_case(cx,"Modern data basics · four series",sA,MD.ink);
    const at0=[T.dtm,T.das,T.ftd,T.docs];
    IL_SERIES.forEach(([name,ideas],i)=>{const x=72+i*450,q=sA*ag_in(tt,at0[i]-0.4,0.5),on=i<3?ag_in(tt,at0[i]-0.3,0.4)*(1-ag_in(tt,at0[i+1]-0.3,0.4)):ag_in(tt,at0[i]-0.3,0.4);
      md_textCard(cx,x,270,420,{kick:"Series "+(i+1),title:name},{edge:mix(MD.dim,MD.flow,Math.max(on,0.35)),a:q,k:il_k(tt,at0[i]-0.4)});
      let y=470;ideas.forEach(([s,lid],j)=>{const t0=lid==="tables"?(j?T.open:T.ftd):c[lid];const h=il_idea(cx,x,y,420,s,{a:sA*ag_in(tt,t0-0.2+(lid===ideas[0][1]&&j?0.4:0),0.5),edge:MD.flow,icon:"tick",k:il_k(tt,t0-0.2)});y+=h+16;});});
    md_pill(cx,960,836,"Each idea is older than the tools that showed it",{col:MD.agreed,icon:"person",a:ag_in(tt,T.older-0.3,0.5),k:il_k(tt,T.older-0.3)});}}],0.6);});

/* ---------------------------------------------------------------- 3 · Why the films stay light */
const IL_SLOW=[["Agree what data means","person"],["Test it","tick"],["Govern it","lock"],["Serve it when the business acts","clock"]];
const IL_FAST=["New feature","New name","New limit","New option","New screen","New default","New price"];
scene("light",(ctx,S,t,sc)=>{const c=sc.cues,T=il_once(sc,"T",()=>({
    fast:wAt(sc,"fast","change fast"),feat:wAt(sc,"fast","new features"),names:wAt(sc,"fast","new names"),limits:wAt(sc,"fast","new limits"),
    button:wAt(sc,"date","every button"),months:wAt(sc,"date","within months"),
    slowly:wAt(sc,"slow","changes slowly"),agree:wAt(sc,"slow","agree what data means"),test:wAt(sc,"slow","test it"),govern:wAt(sc,"slow","govern it"),serve:wAt(sc,"slow","serve it"),
    how:wAt(sc,"source","For the how"),docs:wAt(sc,"source","official documentation"),training:wAt(sc,"source","training"),build:wAt(sc,"source","the people who build it"),
    notOn:wAt(sc,"other","Not on Databricks"),hold:wAt(sc,"other","still hold"),own:wAt(sc,"other","your own platform"),each:wAt(sc,"other","for each one"),name:wAt(sc,"other","another name"),
    isNew:wAt(sc,"need","because it's new"),film:wAt(sc,"need","because a film showed it"),real:wAt(sc,"need","a real need")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    il_top(cx,1);const out1=1-ag_in(tt,c.source-1.0,0.5);il_case(cx,"Why the films stay light",ag_in(tt,0.2,0.6)*out1,MD.ink);
    // what changes fast: tags that come and go, one after another
    const fA=ag_in(tt,T.fast-0.3,0.5)*out1;md_T(cx,"WHAT CHANGES FAST",96,290,{w:800,size:28,ls:4,col:MD.soft,a:fA});
    IL_FAST.forEach((s,i)=>{const t0=T.feat-0.6+i*0.8,u=(tt-t0)/4.4;if(u<=0||u>=1)return;const q=fA*Math.min(1,u*6,(1-u)*6)*(1-ag_in(tt,c.slow+1.0,0.5));md_tag(cx,96+(i%2)*70,lerp(350,820,u),s,{col:MD.soft,a:q});});
    // a film of every button, out of date within months
    md_textCard(cx,560,320,500,{kick:"Every button, filmed",title:"Out of date within months"},{edge:MD.fail,icon:"clock",a:ag_io(tt,T.button-0.3,c.slow+0.4,0.5),k:il_k(tt,T.button-0.3)});
    // what changes slowly: the ideas, which these films stay with
    const sA=ag_in(tt,c.slow-0.3,0.5)*out1;md_T(cx,"WHAT CHANGES SLOWLY",1180,290,{w:800,size:28,ls:4,col:MD.agreed,a:sA});
    let y=330;IL_SLOW.forEach(([s,ic],i)=>{const t0=[T.agree,T.test,T.govern,T.serve][i];y+=il_idea(cx,1180,y,640,s,{a:sA*ag_in(tt,t0-0.3,0.5),edge:MD.agreed,icon:ic,k:il_k(tt,t0-0.3)})+18;});
    md_tag(cx,1180,790,"What these films teach",{col:MD.agreed,a:sA*ag_in(tt,T.slowly,0.5)});
    // for the how, the official documentation and training, from the people who build each tool
    const dA=ag_in(tt,c.source-0.3,0.5)*(1-ag_in(tt,c.other-1.0,0.5));if(dA>0){il_case(cx,"For the how · the official sources",dA,MD.ink);
      md_reader(cx,180,320,720,{title:"Databricks",sub:"Documentation · training",logo:"databricks",a:dA*ag_in(tt,T.docs-0.3,0.5),lit:0.4*ag_io(tt,T.docs,T.build,0.5)});
      md_reader(cx,1020,320,720,{title:"dbt",sub:"Documentation · training",logo:"dbt",a:dA*ag_in(tt,T.docs,0.5),lit:0.4*ag_io(tt,T.docs+0.3,T.build,0.5)});
      md_tag(cx,960,520,"Kept up to date by the people who build it",{align:"center",col:MD.flow,icon:"refresh",a:dA*ag_in(tt,T.build-0.3,0.5)});}
    // another platform? the same ideas, and what it offers for each
    const oA=ag_in(tt,c.other-0.3,0.5)*(1-ag_in(tt,c.need-1.0,0.5));if(oA>0){il_case(cx,"Not on Databricks?",oA,MD.ink);
      let yy=300;IL_SLOW.forEach(([s,ic],i)=>{yy+=il_idea(cx,180,yy,600,s,{a:oA*ag_in(tt,T.hold-0.3+i*0.12,0.4),edge:MD.agreed,icon:ic})+16;});
      md_reader(cx,1160,330,620,{title:"Microsoft Fabric",sub:"Or any other platform",logo:"fabric",a:oA*ag_in(tt,T.own-0.3,0.5)});
      md_reader(cx,1160,470,620,{title:"Your own platform",sub:"What does it offer?",icon:"query",col:MD.flow,a:oA*ag_in(tt,T.own,0.5),lit:0.4*ag_io(tt,T.each-0.2,c.need-0.6,0.5)});
      for(let i=0;i<4;i++){const y0=300+i*96+40;il_link(cx,md_curve([780,y0],[1160,525],{bend:0.5}),ag_sine((tt-T.each+0.2-i*0.1)/0.9),tt,{a:0.7*oA,off:i*0.3,every:1.4});}
      md_tag(cx,1470,660,"Most have an answer, under another name",{align:"center",col:MD.pass,icon:"tick",a:oA*ag_in(tt,T.name-0.4,0.5)});}
    // choose what answers a real need
    const nA=ag_in(tt,c.need-0.3,0.5);if(nA>0){il_case(cx,"How to choose",nA,MD.ink);
      [["Because it's new",T.isNew],["Because a film showed it",T.film]].forEach(([s,a_],i)=>{const b=md_tag(cx,560+i*800,360,s,{align:"center",col:MD.soft,a:nA*ag_in(tt,a_-0.4,0.4)});
        il_strike(cx,b.x+14,b.y+b.h/2,b.x+b.w-14,b.y+b.h/2,ag_in(tt,a_+0.3,0.4),nA);});
      md_pill(cx,960,560,"Because it answers a real need",{col:MD.pass,icon:"tick",a:nA*ag_in(tt,T.real-0.4,0.5),k:il_k(tt,T.real-0.4)});}}}],0.6);});

/* ---------------------------------------------------------------- 4 · Test what's new */
// 200 of September's invoices: which 12 didn't match (most of them poor scans)
const IL_MISS=[7,23,38,51,66,90,104,121,137,152,176,191];
scene("loop",(ctx,S,t,sc)=>{const c=sc.cues,T=il_once(sc,"T",()=>({
    keep:wAt(sc,"loop","keep up"),small:wAt(sc,"loop","small and quick"),inv:wAt(sc,"loop","investigate"),adapt:wAt(sc,"loop","adapt"),impl:wAt(sc,"loop","implement"),iter:wAt(sc,"loop","iterate"),
    seasons:wAt(sc,"shorter","the workshop in Jaipur"),shorter:wAt(sc,"shorter","the sooner you try it"),more:wAt(sc,"shorter","where it hurts"),
    realNeed:wAt(sc,"need","a real need"),notFeat:wAt(sc,"need","not from the feature"),typed:wAt(sc,"need","typed every invoice"),ticket:wAt(sc,"need","in a ticket"),
    docs:wAt(sc,"read","the official docs"),what:wAt(sc,"read","what they do"),cost:wAt(sc,"read","what they cost"),stop:wAt(sc,"read","where they stop"),
    small2:wAt(sc,"adapt","trying it small"),own:wAt(sc,"adapt","your own data"),sandbox:wAt(sc,"adapt","in a sandbox"),set:wAt(sc,"adapt","a set time"),days:wAt(sc,"adapt","two days"),n200:wAt(sc,"adapt","two hundred"),
    compared:wAt(sc,"compare","compared"),typed2:wAt(sc,"compare","Finance had typed"),n188:wAt(sc,"compare","a hundred and eighty-eight"),n12:wAt(sc,"compare","twelve"),scans:wAt(sc,"compare","poor scans"),
    told:wAt(sc,"learned","Two days told"),works:wAt(sc,"learned","where it works"),doesnt:wAt(sc,"learned","where it doesn't"),
    one:wAt(sc,"implement","one use case"),project:wAt(sc,"implement","the data project"),tests:wAt(sc,"implement","its tests"),back:wAt(sc,"implement","a way back"),
    reviewed:wAt(sc,"review","The data team reviewed"),checked:wAt(sc,"review","checked October's results"),closed:wAt(sc,"review","ticket closed"),
    watching:wAt(sc,"iterate","watching what happens"),again:wAt(sc,"iterate","trying again"),month:wAt(sc,"iterate","each month"),person:wAt(sc,"iterate","went to a person"),why:wAt(sc,"iterate","and why"),
    notYes:wAt(sc,"drop","Not every trial"),tried:wAt(sc,"drop","They tried"),centre:wAt(sc,"drop","cost centre"),list:wAt(sc,"list","supplier list"),dropped:wAt(sc,"list","dropped it"),
    no:wAt(sc,"cost","ends in no"),twoDays:wAt(sc,"cost","two days"),year:wAt(sc,"cost","not a year")}));
  // which step is lit: investigate from "need", adapt from "adapt", implement from "implement", iterate from "iterate"
  const lit=t<c.need-0.2?-1:t<c.adapt-0.2?0:t<c.implement-0.2?1:t<c.iterate-0.2?2:3;
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"map",keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
    il_top(cx,1);il_case(cx,"Test what's new · a short loop",ag_in(tt,0.2,0.6),MD.ink);
    // the loop, drawn as it's named, each step lit while its line is said
    const rA=ag_in(tt,T.small-0.4,0.6);il_loop(cx,tt,400,500,210,{a:rA,u:ag_sine((tt-T.small+0.2)/2.2),lit,stepA:i=>ag_in(tt,[T.inv,T.adapt,T.impl,T.iter][i]-0.25,0.4)});
    // a shorter loop learns more in the same time: the workshop in Jaipur again
    const shA=ag_io(tt,c.shorter-0.3,c.need-0.3,0.5);if(shA>0){md_card(cx,960,260,860,360,{a:shA});md_T(cx,"IN THE SAME TIME",988,312,{w:800,size:28,ls:4,col:MD.soft,a:shA});
      [["A long loop",1,MD.soft,T.seasons],["A short loop",3,MD.pass,T.shorter]].forEach(([s,n,col,a_],i)=>{const q=shA*ag_in(tt,a_-0.3,0.5),y=400+i*130;md_T(cx,s,988,y,{w:600,size:30,col,a:q});
        for(let k=0;k<n;k++){const u=ag_sine((tt-a_-k*0.35)/0.9);if(u<=0)continue;cx.save();cx.globalAlpha*=q;cx.strokeStyle=rgba(col,0.9);cx.lineWidth=4;cx.beginPath();cx.arc(1380+k*120+(n===1?120:0),y-10,n===1?100:46,-Math.PI/2,-Math.PI/2+TAU*u);cx.stroke();cx.restore();}});
      md_tag(cx,988,580,"More learned",{col:MD.pass,icon:"tick",a:shA*ag_in(tt,T.more-0.2,0.5)});}
    // the person each step is about, at the right
    // Jun, who runs the loop, at the right
    const junA=ag_in(tt,c.need-0.4,0.7);il_who(cx,"jun",1640,590,0.98,junA,{t:tt,gaze:[-3,0],flip:true});md_nameTag(cx,1520,400,"jun",{align:"right",col:MD.flow,a:junA});
    // investigate: the need first, in Finance's ticket; then the official docs: what they do, what they cost, where they stop
    const iA=ag_io(tt,c.need-0.3,c.adapt-1.0,0.5);
    md_textCard(cx,740,250,560,{kick:"A ticket · Finance",title:"Invoices typed by hand",sub:"Rohan's team asks for a better way"},{edge:MD.wait,icon:"doc",a:iA*ag_in(tt,T.typed-0.5,0.5)*(1-ag_in(tt,c.read-1.0,0.5)),k:il_k(tt,T.typed-0.5)});
    md_tag(cx,740,530,"A real need, not a feature",{col:MD.agreed,icon:"person",a:iA*ag_in(tt,T.realNeed-0.2,0.5)*(1-ag_in(tt,c.read-1.0,0.5))});
    const oA=iA*ag_in(tt,c.read-0.3,0.5);md_textCard(cx,740,250,560,{kick:"Read first",title:"The official docs"},{edge:MD.flow,icon:"doc",a:oA*ag_in(tt,T.docs-0.4,0.5),k:il_k(tt,T.docs-0.4)});
    [["What they do",T.what],["What they cost",T.cost],["Where they stop",T.stop]].forEach(([s,a_],i)=>md_tag(cx,740,470+i*76,s,{col:MD.flow,icon:"tick",a:oA*ag_in(tt,a_-0.2,0.4)}));
    // adapt: small, on our own data, in a sandbox, for two days: 200 of September's invoices, compared with what Finance typed
    const aA=ag_io(tt,c.adapt-0.3,c.implement-1.0,0.5);if(aA>0){md_card(cx,740,220,560,470,{edge:MD.flow,a:aA,glow:0.4});md_T(cx,"A SANDBOX · TWO DAYS",768,272,{w:800,size:28,ls:4,col:MD.flow,a:aA*ag_in(tt,T.sandbox-0.3,0.5)});
      md_T(cx,"200 of September's invoices",768,318,{w:600,size:28,col:MD.soft,a:aA*ag_in(tt,T.n200-0.3,0.5)});
      const cmp=ag_in(tt,T.compared,1.6);for(let k=0;k<200;k++){const i=k%20,j=Math.floor(k/20),q=aA*ag_in(tt,T.n200-0.3+k*0.006,0.25);if(q<=0)continue;const miss=IL_MISS.includes(k),
        u=clamp(cmp*1.3-k/200*0.3,0,1),col=u<=0?MD.dim:mix(MD.dim,miss?MD.wait:MD.pass,u);cx.save();cx.globalAlpha*=q;cx.fillStyle=rgba(col,0.9);rr(cx,772+i*24,348+j*22,18,16,4);cx.fill();cx.restore();}
      md_T(cx,"188 matched",768,610,{w:700,size:32,col:MD.pass,a:aA*ag_in(tt,T.n188-0.2,0.5)});md_T(cx,"12 didn't: most were poor scans",768,650,{w:500,size:28,col:MD.wait,a:aA*ag_in(tt,T.scans-0.4,0.5)});}
    md_tag(cx,740,740,"Where it works, and where it doesn't",{col:MD.pass,icon:"tick",a:ag_io(tt,T.works-0.4,c.implement-1.0,0.5)});
    // implement: one use case, in the data project, with its tests and a way back; reviewed by the data team, checked by Finance, the ticket closed
    const mA=ag_io(tt,c.implement-0.3,c.iterate-1.0,0.5);if(mA>0){md_textCard(cx,740,230,560,{kick:"One use case",title:"In the data project"},{edge:MD.flow,icon:"table",a:mA*ag_in(tt,T.project-0.4,0.5),k:il_k(tt,T.project-0.4)});
      [["Its tests","tick",MD.pass,T.tests],["A way back","refresh",MD.flow,T.back]].forEach(([s,ic,col,a_],i)=>md_tag(cx,740+i*250,440,s,{col,icon:ic,a:mA*ag_in(tt,a_-0.2,0.4)*(1-ag_in(tt,c.review-0.4,0.4))}));
      [["Reviewed by the data team",T.reviewed],["Finance checked October's results",T.checked],["The ticket closed",T.closed]].forEach(([s,a_],i)=>{const q=mA*ag_in(tt,a_-0.3,0.4),ok=ag_in(tt,a_+0.8,0.4);
        md_tag(cx,740,440+i*84,s,{col:mix(MD.wait,MD.pass,ok),icon:ok>0.5?"tick":"clock",a:q});});}
    // iterate: each month, what went to a person, and why; a trial that ended in no, dropped; two days, not a year
    const tA=ag_in(tt,c.iterate-0.3,0.5)*(1-ag_in(tt,c.drop-1.0,0.5));if(tA>0){md_textCard(cx,740,250,560,{kick:"Each month",title:"What went to a person, and why"},{edge:MD.wait,icon:"refresh",a:tA*ag_in(tt,T.month-0.3,0.5),k:il_k(tt,T.month-0.3)});
      [["A field not read",72],["A supplier Finance didn't know",31],["Lines that don't add up",14],["Sent twice",9]].forEach(([s,n],i)=>{const q=tA*ag_in(tt,T.why-0.2+i*0.18,0.4),y=480+i*56;
        md_T(cx,s,740,y,{w:500,size:28,col:MD.soft,a:q});cx.save();cx.globalAlpha*=q;cx.fillStyle=rgba(MD.wait,0.85);rr(cx,1130,y-20,n*2.2,22,6);cx.fill();cx.restore();});}
    const dA=ag_in(tt,c.drop-0.3,0.5)*(1-ag_in(tt,c.cost-1.0,0.5));if(dA>0){const b=md_textCard(cx,740,250,560,{kick:"Tried",title:"The model picks each invoice's cost centre"},{edge:MD.soft,a:dA*ag_in(tt,T.tried-0.4,0.5),k:il_k(tt,T.tried-0.4)});
      md_tag(cx,740,b.y+b.h+60,"The supplier list already gives it",{col:MD.flow,icon:"table",a:dA*ag_in(tt,T.list-0.3,0.5)});
      md_pill(cx,920,b.y+b.h+170,"Dropped",{col:MD.soft,icon:"cross",a:dA*ag_in(tt,T.dropped-0.3,0.5),k:il_k(tt,T.dropped-0.3)});}
    md_pill(cx,1020,420,"Two days, not a year",{col:MD.pass,icon:"clock",a:ag_in(tt,T.twoDays-0.3,0.5),k:il_k(tt,T.twoDays-0.3)});}}],0.6);});

/* ---------------------------------------------------------------- 5 · Keep the method */
const IL_MOD=[["Data that moves","Moving data"],["Data as software","Running the platform"],["From tables to decisions","Serving it to people and agents"],["Documents and closing remarks","Reading documents"]];
scene("close",(ctx,S,t,sc)=>{const c=sc.cues,T=il_once(sc,"T",()=>({
    gone:wAt(sc,"feet","long gone"),method:wAt(sc,"feet","The method"),places:wAt(sc,"feet","how people live"),still:wAt(sc,"feet","still how"),
    ideas:wAt(sc,"keep","keep the ideas"),features:wAt(sc,"keep","test the features"),small:wAt(sc,"keep","small, soon"),need:wAt(sc,"keep","a real need"),
    moving:wAt(sc,"module","moving data"),running:wAt(sc,"module","running the platform"),serving:wAt(sc,"module","serving it"),reading:wAt(sc,"module","reading documents"),
    whole:wAt(sc,"team","a whole team"),dbx:wAt(sc,"team","Databricks and dbt"),agree:wAt(sc,"team","agreeing what the data means"),
    docs:wAt(sc,"end","the official docs"),inv:wAt(sc,"end","Investigate"),going:wAt(sc,"end","keep going")}));
  const map0=c.keep-1.0;
  ag_shots(ctx,S,t,sc.dur,[
    // the workshop again, the bare foot on the bench: the feet of the 1960s are gone, the method stays
    {at:0,place:"ilWork",keys:[[0,960,520,1.0]],push:0.02,draw:(cx,tt)=>{
      il_footBare(cx,880,742,180,{a:1,flex:0.5*ag_io(tt,T.method,T.still+1.4,0.6)*Math.abs(Math.sin(tt*1.4))});
      il_scr(cx,S,()=>{md_textCard(cx,1180,170,640,{kick:"The rubber feet of the 1960s",title:"Long gone"},{edge:MD.soft,a:ag_in(tt,T.gone-0.4,0.5),k:il_k(tt,T.gone-0.4)});
        md_textCard(cx,1180,380,640,{kick:"The method",title:"Start from how people live",sub:"Try it on them, and change it"},{edge:MD.agreed,icon:"refresh",a:ag_in(tt,T.method-0.3,0.5),k:il_k(tt,T.method-0.3)});});}},
    // keep the ideas, test the features; the module; what's left for people; start from the docs, and the loop
    {at:map0,place:"map",dis:0.9,keys:[[0,960,540,1.0]],push:0.012,draw:(cx,tt)=>{
      il_top(cx,1);const kA=ag_in(tt,map0+0.3,0.5)*(1-ag_in(tt,c.module-0.6,0.5));
      md_pill(cx,960,360,"Keep the ideas",{col:MD.agreed,icon:"person",a:kA*ag_in(tt,T.ideas-0.3,0.5),k:il_k(tt,T.ideas-0.3)});
      md_pill(cx,960,480,"Test the features",{col:MD.flow,icon:"refresh",a:kA*ag_in(tt,T.features-0.3,0.5),k:il_k(tt,T.features-0.3)});
      md_tag(cx,960,600,"Small · soon · on a real need",{align:"center",col:MD.ink,a:kA*ag_in(tt,T.small-0.3,0.5)});
      // the module: four series, each once a whole team's work; the tools do much of it, and people agree what the data means
      const mA=ag_in(tt,c.module-0.4,0.5)*(1-ag_in(tt,c.end-0.7,0.5));il_case(cx,"Modern data basics",mA*ag_in(tt,c.module-0.2,0.5),MD.ink);
      IL_MOD.forEach(([ti,sub],i)=>{const x=200+(i%2)*800,y=220+Math.floor(i/2)*200,at_=[T.moving,T.running,T.serving,T.reading][i],q=mA*ag_in(tt,at_-0.3,0.5);
        md_textCard(cx,x,y,720,{title:ti,sub},{edge:i===3?MD.agreed:MD.flow,a:q,k:il_k(tt,at_-0.3)});
        const many=1-ag_in(tt,T.dbx,0.6);for(let j=0;j<5;j++){const pa=q*ag_in(tt,T.whole-0.3+j*0.08,0.4)*(j===2?1:many);if(pa>0)md_icon(cx,"person",x+650+(j-2)*30,y+40,28,j===2?mix(MD.ink,MD.agreed,ag_in(tt,T.agree-0.3,0.6)):MD.soft,{a:pa});}});
      md_reader(cx,200,650,560,{title:"Databricks",logo:"databricks",a:mA*ag_in(tt,T.dbx-0.3,0.5)});md_reader(cx,1160,650,560,{title:"dbt",logo:"dbt",a:mA*ag_in(tt,T.dbx+0.1,0.5)});
      md_pill(cx,960,810,"Agreeing what the data means",{col:MD.agreed,icon:"person",a:mA*ag_in(tt,T.agree-0.3,0.5),k:il_k(tt,T.agree-0.3)});
      // start from the official docs: the loop, and keep going
      const eA=ag_in(tt,c.end-0.4,0.5)*(1-ag_in(tt,c.breath-0.2,0.8));
      md_textCard(cx,240,420,480,{kick:"Start from",title:"The official docs"},{icon:"doc",edge:MD.flow,a:eA*ag_in(tt,T.docs-0.3,0.5),k:il_k(tt,T.docs-0.3)});
      il_link(cx,[[720,480],[1050,480]],ag_sine((tt-T.docs)/0.7),tt,{a:0.85*eA,flow:false});
      il_loop(cx,tt,1320,480,230,{a:eA,u:ag_sine((tt-T.inv+0.2)/2.4),stepA:i=>ag_in(tt,T.inv-0.2+i*0.35,0.4)});
      md_tag(cx,1320,480,"Keep going",{align:"center",col:MD.agreed,icon:"refresh",a:eA*ag_in(tt,T.going-0.3,0.5)});}}
  ],0.9);
  md_end(ctx,S,t,c.breath,"Ideas that last, features you test","Keep the ideas. Test the features.","Film 2 of 2 · Documents and closing remarks","Modern data basics");});

ag_cutInto(["recap","light","loop"]);
