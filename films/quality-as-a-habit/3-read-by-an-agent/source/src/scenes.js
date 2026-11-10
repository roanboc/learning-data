/* ===== Read by an agent: the seven chapters =====
   Each chapter is a few shots, cut together with the agent films' ag_shots: in one room the camera glides on from shot to shot, and
   between rooms a shot comes in on a cut. Times inside a chapter come from its cues (when each line starts) and the words of its
   lines (wAt), so the pictures stay with the voice if it's recorded again. Words on screen are on cards, tags, chips and pages, at
   least 28 px as seen, and above the captions. The agent is one ceramic sphere, drawn in one place at a time; its words are violet.
   Colours mean what they mean in every film of the module: green passes, amber holds for a person, red stops, grey wasn't checked;
   brass is what good means (a requirement, a reference), steel a measure taken. */

// made once per chapter, the first time it draws: its cues are known by then
const ra_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a card that springs in at t0 and goes at t1 (or stays): its k and a
const ra_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// letters typed by t, from t0, at cps a second, at most n
const ra_typed=(t,t0,n,cps)=>clamp((t-t0)*(cps||11),0,n);
// the chapter's number and title at the top left, for its first seconds
function ra_kick(ctx,S,t,num,title,t1,o){const a=ag_io(t,0.3,t1||6,0.6);if(a<=0.01)return;setScreen(ctx,S);dq_kicker(ctx,num,title,Object.assign({a},o||{}));}
// the agent: the sphere, its violet light on the wall, and its soft shadow on the bench below it
function ra_agent(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null){const k=lerp(0.5,1,ag_spr(o.k,0,0.6));ctx.translate(x,y);ctx.scale(k,k);ctx.translate(-x,-y);}
  ag_modelLight(ctx,x,y,r,1);ctx.save();ctx.filter="blur(14px)";ctx.fillStyle="rgba(0,0,0,0.32)";ctx.beginPath();ctx.ellipse(x-12,DQ_BENCH.back+34,r*0.95,r*0.2,0,0,TAU);ctx.fill();ctx.restore();
  ag_model(ctx,x,y,r,{t:o.t||0,core:o.core==null?0.7:o.core,think:o.think||0,label:o.label});ctx.restore();}
// a person behind the bench, faded as one picture
function ra_person(ctx,who,x,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;ctx.save();ctx.globalAlpha*=a;
  const h=dq_person(ctx,who,x,o.y||592,s,Object.assign({cut:DQ_BENCH.back},o,{a:undefined}));ctx.restore();return h;}
const RA_TITLE="Read by an agent";
// the writer's page on the monitor: the line with the misspelt word, then the lines that follow
const RA_LINES=["We thank the delegations for their","support, and look forward to working","with the Organization for Security","and Cooperation in Europe."];
const RA_SLIP="We thank the delegatoins for their";
const RA_ZOOM=[846,432,1.26];
// where the graduations team's agent floats over the bench, in every chapter it's in: one place, so it never shows in two
const RA_AG=[1180,520,74];

// ---- 1 · A Cupertino: around 2000, spell checkers at the UN, the EU and NATO; a gap in a word list; the Cupertino effect; the data story ----
scene("cupertino",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({
    type0:c.when+0.9,spell:wAt(sc,"when","spell"),marks:wAt(sc,"checker","marks"),offers:wAt(sc,"checker","offers"),does:wAt(sc,"checker","one it does",0.5),
    lists:c.lists,hyphen:wAt(sc,"lists","hyphen"),not:wAt(sc,"lists","not"),
    typed:c.typed,typedW:wAt(sc,"typed","typed"),marked:wAt(sc,"typed","marked"),first:wAt(sc,"typed","first"),cup:wAt(sc,"typed","Cupertino"),cal:wAt(sc,"typed","city"),
    took:c.took,tookW:wAt(sc,"took","took"),
    nato:c.nato,report:wAt(sc,"nato","report"),named:wAt(sc,"nato","Cupertino"),guess:wAt(sc,"nato","guess"),
    hundreds:c.hundreds,hund:wAt(sc,"hundreds","hundreds"),sites:wAt(sc,"hundreds","websites"),
    gap:c.gap,conf:wAt(sc,"gap","confident"),gapW:wAt(sc,"gap","gap"),nobody:wAt(sc,"gap","nobody"),change:c.change,
    wrote:c.wrote,mag:wAt(sc,"wrote","magazine"),eff:c.named,effW:wAt(sc,"named","Cupertino effect"),
    warning:c.warning,readW:wAt(sc,"warning","read"),makers:c.makers,added:wAt(sc,"makers","added"),knew:wAt(sc,"makers","knew"),
    benefit:c.benefit,longer:wAt(sc,"benefit","no longer"),readers:wAt(sc,"benefit","readers"),
    data:c.data,read:wAt(sc,"data","empty"),answered:wAt(sc,"data","412"),fixed:c.fixed,said:wAt(sc,"fixed","said"),a38:wAt(sc,"fixed","38"),n374:wAt(sc,"fixed","374"),
    title:c.breath+0.3}));
  ag_shots(ctx,S,t,sc.dur,[
    // the office, about 2000: the camera glides in to the screen as the writer types; the checker marks a slip and offers the word it knows
    {at:0,place:"ra_office",keys:[[0,960,540,1],[c.when+2.2,...RA_ZOOM]],d:3.4,push:0.006,draw:(x,tt)=>{
      const fix=ag_in(tt,P.does+0.25,0.5),n=tt<P.does+0.8?ra_typed(tt,P.type0,24,9):24+ra_typed(tt,P.does+0.9,10,10),m=ra_menuAt(x,RA_SLIP,"delegatoins",0);
      const pa=ag_io(tt,P.offers+0.3,P.does+0.6,0.3),pu=ag_sine((tt-P.offers-0.3)/0.8),from=[1100,640];
      ra_screen(x,{lines:[RA_SLIP],typed:{line:0,n},caret:{line:0,a:ag_in(tt,P.type0-0.4,0.3),t:tt},mark:{line:0,word:"delegatoins",u:(tt-P.marks)/0.5,a:1-fix},
        popup:{line:0,word:"delegatoins",items:["delegations","Ignore"],a:ag_io(tt,P.offers,P.does+0.25,0.25),k:tt-P.offers,hi:ag_in(tt,P.offers+1.0,0.2)},
        swap:{line:0,from:"delegatoins",to:"delegations",u:(tt-P.does-0.25)/0.5},pointer:m?[lerp(from[0],m.first[0],pu),lerp(from[1],m.first[1],pu),pa]:null});
      const ch=ra_pop(tt,P.spell-0.2,P.marks-0.2);dq_chip(x,170,90,"About 2000 · the UN, the EU and NATO",{icon:"calendar",a:ch.a*(1-ag_in(tt,c.when+2.0,0.5))});}},
    // the checker's word list: co-operation, with a hyphen, but not cooperation
    {at:P.lists-0.25,place:"ra_desk",keys:[[0,960,540,1]],push:0.02,cut:true,draw:(x,tt)=>{
      ra_printout(x,200,120,{w:640,words:[{w:"cooking"},{w:"cool"},{w:"co-operate"},{w:"co-operation"},{w:"cooperation",gap:true,fill:0},{w:"co-ordinate"},{w:"cop"},{dots:true},{w:"cupboard"},{w:"Cupertino"}],
        lit:tt>P.hyphen-0.3?[3]:[]});
      const k=ra_pop(tt,P.lists+0.3,null);dq_textCard(x,980,250,620,{kick:"A checker's word list",title:"co-operation, but not cooperation"},{k:k.k,a:k.a});}},
    // the screen again: the writer types Cooperation; the checker marks it, and offers Cupertino first; the writer takes it
    {at:P.typed-0.25,place:"ra_office",keys:[[0,...RA_ZOOM]],push:0.008,cut:true,draw:(x,tt)=>{
      const L=RA_LINES,m=ra_menuAt(x,L[3],"Cooperation",3),took=P.tookW+0.15,sw=(tt-took-0.25)/0.5,n=tt<took+0.8?ra_typed(tt,P.typed-0.2,15,8):15+ra_typed(tt,took+0.9,11,10);
      const pu=ag_sine((tt-P.took+0.5)/0.9),pa=ag_io(tt,P.took-0.6,took+0.6,0.3),from=[1110,640];
      ra_screen(x,{lines:L,typed:{line:3,n},caret:{line:3,a:1,t:tt},mark:{line:3,word:"Cooperation",u:(tt-P.marked)/0.5,a:1-ag_in(tt,took+0.25,0.4)},
        popup:{line:3,word:"Cooperation",items:["Cupertino","Ignore"],a:ag_io(tt,P.first-0.1,took+0.25,0.25),k:tt-P.first+0.1,hi:ag_in(tt,took-0.25,0.2)},
        swap:{line:3,from:"Cooperation",to:"Cupertino",u:sw},pointer:m?[lerp(from[0],m.first[0],pu),lerp(from[1],m.first[1],pu),pa]:null});
      const cp=ra_pop(tt,P.cal-0.1,took);if(m)dq_chip(x,m.x+330,m.y+70,"Cupertino, a city in California",{a:cp.a});}},
    // on the desk: the NATO report of 1999; hundreds on the organisations' websites by 2006; the three things that made it; the
    // translators' magazine, 2000; the fault's name
    {at:P.nato-0.25,place:"ra_desk",keys:[[0,960,540,1]],push:0.02,cut:true,draw:(x,tt)=>{
      const out1=P.hundreds-0.4,ra=ag_in(tt,P.nato-0.25,0.3)*(1-ag_in(tt,out1,0.4));
      if(ra>0){ra_page(x,200,190,1060,640,{line:"Organization for Security and Cupertino in Europe",word:"Cupertino",lit:ag_in(tt,P.named-0.1,0.5),lineAt:5,size:32,angle:-0.015,a:ra});
        const ch=ra_pop(tt,P.report-0.2,out1);dq_chip(x,1390,240,"1999 · a NATO report",{icon:"calendar",a:ch.a});
        const g=ra_pop(tt,P.guess-0.2,out1);dq_textCard(x,1360,520,440,{title:"Readers had to guess"},{icon:"why",k:g.k,a:g.a});}
      const out2=P.gap-0.4,pa=ag_in(tt,P.hundreds,0.3)*(1-ag_in(tt,out2,0.4));
      if(pa>0){ra_screens(x,180,170,{cols:6,rows:4,pw:178,ph:128,n:(tt-P.hundreds)*12,a:pa});
        const ch=ra_pop(tt,P.hundreds+0.2,out2);dq_chip(x,1390,240,"By 2006",{icon:"calendar",a:ch.a});
        const h=ra_pop(tt,P.hund-0.1,out2);dq_textCard(x,1360,330,440,{title:"Hundreds",sub:"on the organisations' websites"},{k:h.k,a:h.a});}
      const out3=P.wrote-0.4,C3=[["A confident machine","It marks, and offers a word",P.conf,null,"chat"],["A gap in what it read","No cooperation in its list",P.gapW,true,"list"],["Nobody reading after it","The word goes out as offered",P.nobody,null,"person"]];
      C3.forEach(([s,sub,t0,dash,ic],i)=>{const p=ra_pop(tt,t0-0.15,out3);dq_textCard(x,150+i*560,370,520,{title:s,sub},{k:p.k,a:p.a,dash:dash||undefined,icon:ic});});
      const ma=ag_in(tt,P.wrote,0.3);if(ma>0){ra_page(x,300,160,820,720,{head:true,cols:2,line:"Cupertino",word:"Cupertino",lit:ag_in(tt,P.mag-0.2,0.5),lineAt:3,size:32,angle:0.02,a:ma,seed:13});
        const ch=ra_pop(tt,P.wrote+0.3,null);dq_chip(x,1250,230,"2000 · the translators' magazine",{icon:"calendar",a:ch.a});
        const e=ra_pop(tt,P.effW-0.4,null);dq_textCard(x,1240,420,560,{kick:"A name for the fault",title:"The Cupertino effect"},{k:e.k,a:e.a});}}},
    // the warning: read what the checker offers before you take it (a person looks before it goes on: amber, hold)
    {at:P.warning-0.25,place:"ra_office",keys:[[0,...RA_ZOOM]],push:0.008,cut:true,draw:(x,tt)=>{
      const m=ra_screen(x,{lines:RA_LINES,mark:{line:3,word:"Cooperation",u:1},popup:{line:3,word:"Cooperation",items:["Cupertino","Ignore"],a:1}});
      if(m)dq_tag(x,m.x+m.w+150,m.y+64,"hold",{to:[m.x+m.w-6,m.y+28],text:"READ IT FIRST",k:tt-P.readW+0.3,a:ag_in(tt,P.readW-0.3,0.2)});}},
    // the makers' fix: cooperation added to the word list, a word the checker knows
    {at:P.makers-0.25,place:"ra_desk",keys:[[0,960,540,1]],push:0.02,cut:true,draw:(x,tt)=>{
      ra_printout(x,200,120,{w:640,words:[{w:"cooking"},{w:"cool"},{w:"co-operate"},{w:"co-operation"},{w:"cooperation",gap:true,fill:ag_in(tt,P.added,0.8),mark:tt>P.knew-0.2?"pass":null},{w:"co-ordinate"},{w:"cop"},{dots:true},{w:"cupboard"},{w:"Cupertino"}],lit:[]});
      const k=ra_pop(tt,P.makers+0.4,null);dq_textCard(x,980,250,620,{kick:"The makers' word lists",title:"cooperation added"},{k:k.k,a:k.a});}},
    // by 2007: cooperation typed, and left as it is
    {at:P.benefit-0.25,place:"ra_office",keys:[[0,...RA_ZOOM]],push:0.008,cut:true,draw:(x,tt)=>{
      ra_screen(x,{lines:RA_LINES,typed:{line:3,n:ra_typed(tt,P.benefit-0.25,26,9)},caret:{line:3,a:1,t:tt},stamp:{line:3,word:"Cooperation",a:ag_in(tt,P.readers-0.3,0.4)}});
      const ch=ra_pop(tt,P.benefit+0.2,null);dq_chip(x,170,90,"By 2007",{icon:"calendar",a:ch.a});}},
    // the university, October 2026: the agent read an empty column and answered 412; once the data said what empty means, 38
    {at:P.data-0.25,place:"bench",keys:[[0,960,540,1]],push:0.02,cut:true,draw:(x,tt)=>{
      const fx=ag_in(tt,P.said,0.5);
      ra_chat(x,110,150,940,520,{q:"Which December graduates haven't confirmed their name?",who:"Malia",qA:1,ans:"graduates",big:fx<0.5?412:38,ansA:ag_in(tt,P.answered-0.4,0.3)*(1-0.9*ag_io(tt,P.said-0.3,P.said+0.3,0.3)),t:tt,
        sub:fx>=0.5?"No confirmation of either kind":null,subA:ag_in(tt,P.a38,0.4)});
      ra_agent(x,RA_AG[0],RA_AG[1],RA_AG[2],{t:tt,core:0.8,think:ag_io(tt,P.read-0.6,P.answered-0.3,0.3),label:"Genie Agent"});
      const ch=ra_pop(tt,P.data,null);dq_chip(x,1180,170,"October 2026 · the university",{icon:"calendar",a:ch.a});
      const n=ra_pop(tt,P.n374-0.3,null);dq_figure(x,1440,420,"374",null,{col:"steel",a:n.a,size:110});if(n.a>0)dq_T(x,"graduates not asked again",1440,490,{w:600,size:30,col:DQ.soft,a:n.a});}}
  ]);
  dq_title(ctx,S,t,P.title,RA_TITLE,"Quality as a habit · Film 3 of 4","Data quality");});

// the list's rows, as the Catalog Explorer's sample shows them: an empty date is an empty cell, outlined so it shows; how (from chapter 4)
const RA_ROWS=[["S-20311","DEC26-2","2026-10-14","portal"],["S-17790","DEC26-1","","paper"],["S-20457","DEC26-5","2026-10-12","portal"],["S-19032","DEC26-4","",""],["S-20518","DEC26-3","2026-10-19","portal"],["S-18206","DEC26-6","","paper"]];
// the list in its page: o.how adds the new column (0 to 1), o.lit lights the empty dates, o.mark the paper ones
function ra_list(ctx,x,y,w,h,o){o=o||{};return dq_window(ctx,x,y,w,h,{logo:"databricks",product:"Databricks",title:"graduation_list",a:o.a,k:o.k,draw:(c,b)=>{
    const how=o.how||0,cols=[{h:"Student",w:190,f:"mono"},{h:"Ceremony",w:200,f:"mono"},{h:"name_confirmed_on",w:400,f:"mono"}].concat(how>0?[{h:"how",w:150,f:"mono"}]:[]);
    const lit=o.lit>0?RA_ROWS.map((r,i)=>r[2]?-1:i).filter(i=>i>=0):[];
    c.save();dq_rows(c,b.x+10,b.y+6,cols,RA_ROWS.map(r=>[r[0],r[1],r[2]||" "].concat(how>0?[{s:r[3]||" ",col:r[3]==="paper"&&o.paper?"steel":null}]:[])),{rh:52,lit:o.lit>0?lit:null,litCol:o.litCol});c.restore();
    // the empty dates: a dashed outline where nothing is written
    RA_ROWS.forEach((r,i)=>{const ry=b.y+6+52*(i+1);if(!r[2])dq_card(c,b.x+10+390+10,ry+8,170,36,{dash:[8,7],r:5,a:1});if(how>0&&!r[3])dq_card(c,b.x+10+790+10,ry+8,110,36,{dash:[8,7],r:5,a:how});});
    if(how>0&&how<1){c.save();c.globalAlpha*=1-how;c.fillStyle="rgb(252,250,245)";c.fillRect(b.x+10+790,b.y,170,b.h);c.restore();}}});}
// a person's name and role, faded as one
const ra_tag=(ctx,x,y,who,a,o)=>dq_nameTag(ctx,x,y,who,Object.assign({a},o||{}));

// ---- 2 · 412, with confidence: Malia asks the graduations team's agent; it answers 412 at once; she drafts, then reads it again ----
scene("answer",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({day:c.day,printer:wAt(sc,"weeks","printer"),weeks:c.weeks,asks:c.asks,malia:wAt(sc,"asks","Malia"),agent:wAt(sc,"asks","agent"),
    which:wAt(sc,"asks","which"),reads:wAt(sc,"answers","reads"),n412:wAt(sc,"answers","412"),sure:c.sure,draft:c.draft,drafts:wAt(sc,"draft","drafts"),
    again:c.again,before:wAt(sc,"again","before"),readsA:wAt(sc,"again","reads"),fifth:c.fifth,fifthW:wAt(sc,"fifth","fifth"),march:c.march,m95:wAt(sc,"march","95"),
    fit:c.fit,fitW:wAt(sc,"fit","fit"),mei:c.mei,meiW:wAt(sc,"mei","Mei")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",keys:[[0,960,540,1]],push:0.015,draw:(x,tt)=>{
    // Malia behind the bench, on the right; she moves a little left when Mei comes
    const mx=lerp(1560,1500,ag_sine((tt-P.meiW+0.6)/1.4)),meiX=lerp(2180,1810,ag_sine((tt-P.meiW+0.8)/1.6));
    if(tt>P.meiW-0.8)ra_person(x,"mei",meiX,0.96,{t:tt,flip:true,a:ag_in(tt,P.meiW-0.8,0.5)});
    ra_person(x,"malia",mx,0.98,{t:tt,flip:true,gaze:[tt>P.readsA-0.3&&tt<P.fit+1?-1:2,tt>P.readsA-0.3&&tt<P.fit+1?1:0],talk:ag_io(tt,P.which,P.which+1.6,0.2)*(0.5+0.5*Math.sin(tt*9))});
    ra_tag(x,1250,214,"malia",ag_io(tt,P.malia-0.2,P.n412,0.4));
    ra_tag(x,1590,214,"mei",ag_in(tt,P.meiW,0.4),{role:"Answers for the list"});
    // the day, and the date the list goes to the printer: a requirement, brass
    const d0=ra_pop(tt,P.day-0.2,P.asks-0.4);dq_chip(x,110,210,"Thursday 22 October 2026",{icon:"calendar",a:d0.a});
    const pr=ra_pop(tt,P.weeks+0.3,P.asks-0.4);dq_textCard(x,110,290,820,{kick:"December's ceremonies",title:"The list goes to the printer",sub:"Thursday 12 November, 5 pm"},{edge:"brass",icon:"printer",k:pr.k,a:pr.a});
    // the agent's page: her question, and its answer at once, 412, in violet
    const ca=ag_in(tt,P.asks-0.1,0.4);ra_chat(x,100,130,900,410,{q:"Which December graduates haven't confirmed their name?",qA:ag_in(tt,P.which-0.2,0.3),who:"Malia",
      ans:"graduates",big:412,ansA:ag_in(tt,P.n412-0.2,0.3),t:tt,a:ca*(1-ag_in(tt,P.fifth-0.3,0.4))});
    ra_agent(x,RA_AG[0],RA_AG[1],RA_AG[2],{t:tt,a:ag_in(tt,P.agent-0.3,0.4),k:tt-P.agent+0.3,core:0.8,think:ag_io(tt,P.which,P.n412-0.1,0.3),label:"Genie Agent"});
    // her email to all 412, drafted; then held while she reads the answer again (amber: a person looks before it goes on)
    const em=ra_pop(tt,P.drafts-0.1,P.fifth-0.2),eb=dq_textCard(x,100,570,900,{kick:"Draft · to 412 graduates",title:"Please confirm your name before it's printed"},{icon:"mail",k:em.k,a:em.a});
    if(em.a>0)dq_tag(x,760,eb.y+eb.h+46,"hold",{to:[812,eb.y+eb.h-8],k:tt-P.before+0.2,a:em.a*ag_in(tt,P.before-0.2,0.2),size:28});
    // a fifth of the list, ten days in, against March's 95 in 100 in two weeks: the measure (steel) far outside what she knows (brass)
    const bd=ra_pop(tt,P.fifthW+0.2,null);if(bd.a>0)dq_band(x,100,170,900,{label:"Not confirmed, ten days in",min:0,max:25,ticks:5,fmt:v=>Math.round(v)+"%",lo:0,hi:5,u:ag_in(tt,P.m95-0.3,1.0),hiText:"March: 5 in 100",
      v:19.3,vu:ag_in(tt,P.fifthW+0.4,1.2),vText:"412: a fifth",k:bd.k,a:bd.a});
    const mc=ra_pop(tt,P.march-0.1,null);dq_textCard(x,100,500,900,{kick:"In March",title:"95 in 100 answered within the portal's two weeks"},{edge:"brass",icon:"calendar",k:mc.k,a:mc.a});
    const fc=ra_pop(tt,P.fitW-0.3,null);dq_chip(x,100,720,"Doesn't fit what she knows",{icon:"why",a:fc.a});
  }}]);
  ra_kick(ctx,S,t,"2","412, with confidence",P.day+3.6);});

// ---- 3 · Empty meant two things: 38 not yet, 374 on paper; the description said only a date; the agent can't ask; a Cupertino ----
scene("empty",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({counted:wAt(sc,"counted","counted"),emptyC:wAt(sc,"counted","empty"),two:wAt(sc,"two","two things"),
    yet:c.yet,n374:wAt(sc,"paper","374"),pform:wAt(sc,"paper","paper form"),said:c.said,desc:wAt(sc,"said","description"),nobody:c.nobody,emptyN:wAt(sc,"nobody","empty"),
    desk:c.desk,deskW:wAt(sc,"desk","desk"),reads:c.reads,readsW:wAt(sc,"reads","reads"),cup:c.cupertino,c412:wAt(sc,"cupertino","412"),cupW:wAt(sc,"cupertino","Cupertino"),
    part:c.part,partW:wAt(sc,"part","part"),iso:c.iso,und:wAt(sc,"iso","understandability"),fault:c.fault,faultW:wAt(sc,"fault","fault"),descF:wAt(sc,"fault","description")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the bench: Malia and Mei where chapter 2 left them; the list's empty dates, then what they mean
    {at:0,place:"bench",keys:[[0,960,540,1]],push:0.015,draw:(x,tt)=>{
      ra_person(x,"mei",1810,0.96,{t:tt,flip:true,talk:ag_io(tt,P.two,P.two+5,0.3)*(0.4+0.4*Math.sin(tt*8.3))});
      ra_person(x,"malia",1500,0.98,{t:tt,flip:true});
      ra_tag(x,1590,214,"mei",1-ag_in(tt,2.2,0.5),{role:"Answers for the list"});
      ra_agent(x,RA_AG[0],RA_AG[1],RA_AG[2],{t:tt,core:0.7,think:ag_io(tt,P.readsW-0.2,P.readsW+2.4,0.3),label:"Genie Agent"});
      const out=P.said-0.5,la=ag_in(tt,0.4,0.4)*(1-ag_in(tt,out,0.4));
      if(la>0)ra_list(x,90,110,880,500,{a:la,lit:ag_in(tt,P.emptyC-0.2,0.3)});
      const yc=ra_pop(tt,P.yet-0.1,out),pc=ra_pop(tt,P.n374-0.1,out);
      dq_textCard(x,90,640,420,{title:"38",sub:"haven't confirmed yet"},{icon:"hourglass",k:yc.k,a:yc.a});
      dq_textCard(x,540,640,430,{title:"374",sub:"confirmed on the paper form"},{icon:"form",k:pc.k,a:pc.a});
      // the column's description in Catalog Explorer: a date, and nothing on what empty means
      const da=ag_in(tt,out+0.5,0.4);if(da>0)dq_window(x,90,150,900,420,{logo:"databricks",product:"Databricks",title:"Catalog Explorer",a:da,draw:(cc,b)=>{
        ra_descCard(cc,b.x+10,b.y+8,b.w-20,[{k:"Description",v:"Date the graduate confirmed their name."},{k:"Empty means",dash:true}],{head:"name_confirmed_on",type:"date",rowA:i=>i?ag_in(tt,P.emptyN-0.2,0.4):1});}});
      // the agent reads what's written: a soft violet thread from the page to the sphere
      const ra_=ag_io(tt,P.readsW-0.3,P.cup-0.6,0.4);if(ra_>0){x.save();x.globalAlpha*=ra_;x.setLineDash([3,12]);x.lineCap="round";x.strokeStyle=rgba(RA_VIOLET,0.8);x.lineWidth=4;
        x.beginPath();x.moveTo(990,330);x.quadraticCurveTo(1080,300,RA_AG[0]-RA_AG[2]-8,RA_AG[1]-10);x.lineDashOffset=-tt*30;x.stroke();x.restore();}
      const dk=ra_pop(tt,P.deskW-0.6,P.cup-0.4);dq_textCard(x,1250,96,520,{title:"Mei knows",sub:"The agent can't walk over and ask"},{icon:"person",k:dk.k,a:dk.a});}},
    // on the bench from above: the agent's 412 beside the checker's Cupertino; a description is part of the data; the standard's word; two faults
    {at:P.cup-0.25,place:"benchTop",keys:[[0,960,540,1]],push:0.02,cut:true,draw:(x,tt)=>{
      const o1=P.part-0.4,a1=1-ag_in(tt,o1,0.4);
      if(a1>0){dq_T(x,"A checker, about 2000",300,300,{w:700,size:32,dark:true,a:a1});x.save();x.translate(300,350);x.scale(1.5,1.5);ra_menu(x,0,0,["Cupertino","Ignore"],{a:a1});x.restore();
        const aa=a1*ag_in(tt,P.c412-0.6,0.3);dq_T(x,"An agent, 2026",1000,300,{w:700,size:32,dark:true,a:aa});
        x.save();x.globalAlpha*=aa;dq_card(x,1000,350,620,210,{on:"granite"});x.fillStyle=rgba(RA_VIOLET,0.9);rr(x,1032,380,7,150,3.5);x.fill();
        dq_T(x,"412",1068,490,{w:800,size:110,color:rgba(RA_VIOLET,1)});dq_T(x,"graduates",1068+dq_tw(x,"412",{w:800,size:110})+24,490,{w:600,size:36,color:rgba(RA_VIOLET,1)});x.restore();
        const cw=ra_pop(tt,P.cupW-0.2,o1);dq_chip(x,960,680,"Both confident, and both read a gap",{align:"center",a:cw.a});}
      const pa=ra_pop(tt,P.part+0.15,null);ra_descCard(x,120,150,860,[{k:"Means",v:"The day of the graduate's answer in the portal"},{k:"Empty means",v:"Not confirmed in the portal"},{k:"Owner",v:"Mei Tanaka"}],{head:"name_confirmed_on",type:"date",on:"granite",k:pa.k,a:pa.a});
      if(pa.a>0)dq_label(x,120,120,"Part of the data",{dark:true,a:pa.a});
      const io=ra_pop(tt,P.und-0.6,null);dq_textCard(x,1080,150,700,{kick:"ISO/IEC 25012",title:"Understandability",sub:"Data its users can read and interpret"},{edge:"brass",icon:"lens",on:"granite",k:io.k,a:io.a});
      const f1=ra_pop(tt,P.faultW-0.5,null),f2=ra_pop(tt,P.descF-0.3,null);
      dq_textCard(x,120,640,820,{kick:"A fault in the data",title:"Empty means two things"},{icon:"warn",on:"granite",k:f1.k,a:f1.a});
      dq_textCard(x,980,640,800,{kick:"A fault in the data",title:"A description that doesn't say so"},{icon:"warn",on:"granite",k:f2.k,a:f2.a});}}
  ]);
  ra_kick(ctx,S,t,"3","Empty meant two things",5.4);});

// ---- 4 · What empty means, written down: Noor finds the paper form; Jun adds how; the description in Mei's words; 38 ----
scene("written",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({first:c.first,noor:wAt(sc,"noor","Noor"),pform:wAt(sc,"noor","paper form"),how:c.how,jun:wAt(sc,"how","Jun"),
    column:wAt(sc,"how","column"),portal:wAt(sc,"how","portal"),emptyH:wAt(sc,"how","empty"),words:c.words,writes:wAt(sc,"words","writes"),means:c.means,emptyis:c.emptyis,owner:c.owner,
    dbt:c.dbt,uc:wAt(sc,"dbt","Unity Catalog"),agentD:wAt(sc,"dbt","agent"),lists:c.lists,makers:wAt(sc,"lists","makers"),again:c.again,a38:wAt(sc,"again","38"),shows:wAt(sc,"again","shows"),
    writesM:c.writes,check:c.check,pointed:wAt(sc,"check","pointed"),n76:wAt(sc,"check","76"),become:wAt(sc,"check","become")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the bench: Noor finds the paper form in the student system; Jun adds a column that says how each name was confirmed
    {at:0,place:"bench",keys:[[0,960,540,1]],push:0.015,draw:(x,tt)=>{
      ra_person(x,"noor",1800,0.96,{t:tt,flip:true});ra_person(x,"jun",1450,0.98,{t:tt,flip:true});
      ra_tag(x,1590,214,"noor",ag_io(tt,P.noor-0.2,P.how+1.5,0.4));ra_tag(x,1190,214,"jun",ag_io(tt,P.jun-0.2,P.words-0.5,0.4));
      const fi=ra_pop(tt,c.first+0.3,P.noor-0.5);dq_textCard(x,90,170,700,{kick:"First",title:"Fix the data",sub:"Then write down what it means"},{icon:"tools",k:fi.k,a:fi.a});
      const sa=ag_in(tt,P.noor-0.3,0.4)*(1-ag_in(tt,P.how+0.2,0.4));
      if(sa>0)dq_window(x,90,150,900,420,{product:"Student system",title:"Graduation application",a:sa,draw:(cc,b)=>{
        dq_record(cc,b.x+10,b.y+8,b.w-20,{head:"Application",id:"S-17790",rows:[{k:"Ceremony",v:"DEC26-1"},{k:"Form",v:"paper"},{k:"Received",v:"2025-11-18"}]},{lit:tt>P.pform-0.2?1:null,fixed:true});}});
      const la=ag_in(tt,P.how+0.6,0.4);if(la>0)ra_list(x,90,150,1000,500,{a:la,how:ag_in(tt,P.column,0.6),paper:tt>P.portal});}},
    // a later moment: Jun writes the description in Mei's words, row by row, with Mei
    {at:P.words-0.4,place:"bench",keys:[[0,960,540,1]],later:true,dis:0.45,push:0.015,draw:(x,tt)=>{
      ra_person(x,"mei",1800,0.96,{t:tt,flip:true,talk:ag_io(tt,P.means,P.owner+2,0.3)*(0.3+0.3*Math.sin(tt*7.7))});ra_person(x,"jun",1450,0.98,{t:tt,flip:true});
      const R=[{k:"Means",v:"The day of the graduate's answer in the portal, for this ceremony, once accepted"},{k:"Empty means",v:"Not confirmed in the portal: name_confirmed_how says if it was on paper"},{k:"Owner",v:"Mei Tanaka, registrar's office"}],T0=[P.means,P.emptyis,P.owner];
      ra_descCard(x,90,150,1040,R,{head:"name_confirmed_on",type:"date",rowA:i=>ag_in(tt,T0[i]-0.2,0.4)});
      const w=ra_pop(tt,P.words+0.3,null);dq_chip(x,90,110,"In Mei's words, for a reader who can't ask",{icon:"person",a:w.a});}},
    // on the bench from above: dbt writes it into Unity Catalog on every run; and the word list's fix, beside it
    {at:P.dbt-0.25,place:"benchTop",keys:[[0,960,540,1]],push:0.02,cut:true,draw:(x,tt)=>{
      const o1=P.lists-0.4,a1=1-ag_in(tt,o1,0.4);
      if(a1>0){dq_window(x,90,170,800,430,{logo:"dbt",product:"dbt",title:"_graduations__models.yml",on:"granite",a:a1,draw:(cc,b)=>{
          dq_code(cc,b.x+14,b.y+10,["- name: name_confirmed_on","  description: >",[["    The day of the graduate's",DQ.soft]],[["    answer in the portal…",DQ.soft]],"  meta:",[["    owner: Mei Tanaka",DQ.soft]]],{size:28,lh:46});}});
        const ua=ag_in(tt,P.uc-0.4,0.4)*a1;x.save();x.globalAlpha*=ua;x.strokeStyle=rgba(DQ.chalkSoft,0.9);x.lineWidth=4;x.lineCap="round";x.beginPath();x.moveTo(910,385);x.lineTo(1010,385);x.moveTo(992,368);x.lineTo(1010,385);x.lineTo(992,402);x.stroke();
        dq_T(x,"every run",960,350,{w:700,size:28,align:"center",dark:true});x.restore();
        dq_window(x,1030,170,800,430,{logo:"databricks",product:"Databricks",title:"Unity Catalog",on:"granite",a:ua,draw:(cc,b)=>{
          ra_descCard(cc,b.x+10,b.y+8,b.w-20,[{k:"Means",v:"The day of the graduate's answer in the portal…"},{k:"Owner",v:"Mei Tanaka"}],{head:"name_confirmed_on",labW:150});}});
        const rd=ra_pop(tt,P.agentD-0.3,o1);dq_chip(x,1430,680,"Where the agent reads it",{align:"center",a:rd.a,icon:"lens"});}
      const pa=ag_in(tt,P.lists-0.1,0.4);if(pa>0){ra_printout(x,240,140,{w:560,lh:60,words:[{w:"co-operate"},{w:"co-operation"},{w:"cooperation",gap:true,fill:1,mark:"pass"},{w:"co-ordinate"}],a:pa});
        ra_descCard(x,960,170,820,[{k:"Means",v:"The day of the graduate's answer in the portal"},{k:"Empty means",v:"Not confirmed in the portal"},{k:"Owner",v:"Mei Tanaka"}],{head:"name_confirmed_on",on:"granite",k:tt-P.makers+0.6,a:ag_in(tt,P.makers-0.6,0.4)});
        dq_T(x,"What the checker read",240,640,{w:700,size:30,dark:true,a:pa});dq_T(x,"What the agent reads",960,640,{w:700,size:30,dark:true,a:ag_in(tt,P.makers-0.6,0.4)});}}},
    // the bench: asked again, the agent answers 38 and shows what it counted; Malia writes to the 38
    {at:P.again-0.25,place:"bench",keys:[[0,960,540,1]],push:0.015,cut:true,draw:(x,tt)=>{
      ra_person(x,"malia",1560,0.98,{t:tt,flip:true});
      ra_chat(x,100,130,900,440,{q:"Which December graduates haven't confirmed their name?",who:"Malia",ans:"graduates",big:38,ansA:ag_in(tt,P.a38-0.2,0.3),t:tt,
        sub:"Counted: no confirmation in the portal or on paper",subA:ag_in(tt,P.shows,0.4)});
      ra_agent(x,RA_AG[0],RA_AG[1],RA_AG[2],{t:tt,core:0.8,think:ag_io(tt,P.again,P.a38-0.1,0.3),label:"Genie Agent"});
      const em=ra_pop(tt,P.writesM-0.1,null);dq_textCard(x,100,600,900,{kick:"Sent · to 38 graduates",title:"Please confirm your name before it's printed"},{icon:"mail",k:em.k,a:em.a});}},
    // a later moment: Jun's check from Report, fix, tell, pointed at the new column: 76 held names become 7
    {at:P.check-0.4,place:"bench",keys:[[0,960,540,1]],later:true,dis:0.45,push:0.015,draw:(x,tt)=>{
      ra_person(x,"jun",1450,0.98,{t:tt,flip:true});
      const r=ra_pop(tt,P.check+0.3,null);dq_record(x,100,190,900,{head:"Check · Report, fix, tell",rows:[{k:"Holds",v:"a name the old form made, not confirmed"},
        {k:"Reads",was:tt>P.pointed?"name_confirmed_on":null,v:tt>P.pointed?"name_confirmed_how":"name_confirmed_on"},{k:"Held",was:tt>P.become-0.1?"76":null,v:tt>P.become-0.1?"7":"76",mark:"hold"}]},{k:r.k,a:r.a,lit:tt>P.become-0.1?2:null,litCol:"hold"});}}
  ]);
  ra_kick(ctx,S,t,"4","What empty means, written down",4.6);});

// ---- 5 · The agent proposes, people decide: Genie Code profiles, drafts and proposes three checks; Jun and Mei decide each ----
// a proposal: a card of fixed size with its number, its words and a line under them (sa: that line's alpha), and its tags: each [verdict,
// alpha], amber while it waits for a person, then what people decided, the new one coming in where the old one was
function ra_proposal(ctx,x,y,w,h,n,title,sub,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  dq_card(ctx,x,y,w,h,{edge:o.edge});dq_T(ctx,(o.kick||"Proposed check "+n).toUpperCase(),x+DQ_PAD,y+48,{w:800,size:28,ls:4,col:o.edge?dq_tone(o.edge).word:DQ.soft});
  dq_T(ctx,title,x+DQ_PAD,y+94,{w:700,size:34});if(o.strike>0){ctx.fillStyle=rgba(DQ.ink,0.85);ctx.fillRect(x+DQ_PAD-6,y+82,(dq_tw(ctx,title,{w:700,size:34})+12)*clamp(o.strike,0,1),3.5);}
  if(sub&&o.sa>0)dq_T(ctx,sub,x+DQ_PAD,y+134,{w:500,size:28,col:DQ.soft,a:o.sa});
  if(o.icon)dq_icon(ctx,o.icon,x+w-DQ_PAD-20,y+DQ_PAD+20,42,o.edge?dq_tone(o.edge).word:DQ.ink);
  for(const [v,ta] of o.tags||[])if(ta>0.004)dq_tag(ctx,x+w+44,y+h/2,v,{to:[x+w-6,y+h/2-16],a:ta,k:o.tk,size:28});
  ctx.restore();}
scene("proposes",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({asks:c.asks,gc:wAt(sc,"asks","Genie Code"),readA:wAt(sc,"asks","read"),does:c.does,profiles:wAt(sc,"does","profiles"),
    drafts:wAt(sc,"does","drafts"),proposes:wAt(sc,"does","proposes"),draft:c.draft,suggests:wAt(sc,"draft","name suggests"),owner:wAt(sc,"draft","owner"),review:c.review,meiR:wAt(sc,"review","Mei"),
    first:c.first,stop:wAt(sc,"stop","stop"),person:wAt(sc,"stop","person"),three:c.three,doc:wAt(sc,"three","document"),second:c.second,holds:wAt(sc,"second","holds"),
    third:c.third,fail:wAt(sc,"third","fail"),no:c.no,people:wAt(sc,"no","people"),count:c.count,countW:wAt(sc,"count","count"),trusted:wAt(sc,"count","trusted"),decide:c.decide,decideW:wAt(sc,"decide","decide")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"bench",keys:[[0,960,540,1]],push:0.012,draw:(x,tt)=>{
    // Jun, and his own agent, Genie Code; Mei comes when the levels are hers to set
    const meiA=ag_in(tt,P.meiR-0.8,0.5),meiX=lerp(2140,1800,ag_sine((tt-P.meiR+0.8)/1.5));if(meiA>0)ra_person(x,"mei",meiX,0.96,{t:tt,flip:true,a:meiA});
    ra_person(x,"jun",1450,0.98,{t:tt,flip:true,talk:ag_io(tt,P.no,P.no+2.4,0.3)*(0.4+0.4*Math.sin(tt*8.9))});
    ra_tag(x,1590,214,"mei",ag_io(tt,P.meiR,P.first+2,0.4),{role:"Sets the levels"});
    const gA=ag_in(tt,P.gc-0.3,0.4);ra_agent(x,1130,330,62,{t:tt,a:gA,k:tt-P.gc+0.3,core:0.7,think:ag_io(tt,P.readA,P.draft,0.4),label:"Genie Code"});
    // its page: Jun's ask, what it did, and a draft, waiting for a person
    const wa=ag_in(tt,P.asks-0.1,0.4)*(1-ag_in(tt,P.review-0.4,0.4));
    if(wa>0)dq_window(x,80,130,900,620,{logo:"databricks",product:"Databricks",title:"Genie Code",a:wa,draw:(cc,b)=>{
      const qa=ag_in(tt,P.asks+0.2,0.3)*(1-ag_in(tt,P.does-0.2,0.3));if(qa>0){cc.save();cc.globalAlpha*=qa;const q="Read the list and the checks it runs",qw=dq_tw(cc,q,{w:600,size:30})+52,qx=b.x+b.w-qw-10;
        cc.fillStyle="rgba(232,226,212,1)";rr(cc,qx,b.y+20,qw,76,18);cc.fill();dq_T(cc,q,qx+26,b.y+70,{w:600,size:30});dq_T(cc,"Jun",b.x+b.w-10,b.y+134,{w:600,size:28,col:DQ.soft,align:"right"});cc.restore();}
      const L=[["Profiled every column of the list",P.profiles],["Drafted 9 descriptions",P.drafts],["Proposed 3 new checks",P.proposes]];
      L.forEach(([s_,t0],i)=>{const a=ag_in(tt,t0-0.2,0.4);if(a<=0)return;cc.save();cc.globalAlpha*=a;cc.fillStyle=rgba(RA_VIOLET,0.9);rr(cc,b.x+16,b.y+26+i*58,7,40,3.5);cc.fill();
        dq_T(cc,s_,b.x+42,b.y+56+i*58,{w:600,size:30,color:rgba(RA_VIOLET,1)});cc.restore();});
      const da=ag_in(tt,P.draft-0.2,0.4);if(da>0){const db=ra_descCard(cc,b.x+12,b.y+214,b.w-230,[{k:"Means",v:"How the graduate's name was confirmed"},{k:"Empty means",dash:true}],
          {head:"name_confirmed_how",labW:210,a:da,rowA:i=>i?ag_in(tt,P.owner-0.4,0.4):1});
        dq_tag(cc,b.x+b.w-170,b.y+214+db.h/2,"hold",{to:[b.x+b.w-222,b.y+214+db.h/2-16],k:tt-P.draft,a:da,size:28});}}});
    // the three proposals, each held for a person; then what Mei and Jun decided
    const y1=140,y2=330,y3=520,W_=740,H_=160,pr=i=>ra_pop(tt,P.review+0.1+i*0.25,null),k1=pr(0),k2=pr(1),k3=pr(2);
    const st=ag_in(tt,P.stop-0.1,0.4),no=ag_in(tt,P.no-0.1,0.5),cnt=ag_in(tt,P.countW-0.3,0.5);
    ra_proposal(x,80,y1,W_,H_,1,"A name not as its graduate gave it","Finds 3: changed names, waiting for a document",{a:k1.a,k:k1.k,sa:ag_in(tt,P.three,0.4),tags:[["hold",1-st],["stop",st]],tk:1});
    ra_proposal(x,80,y2,W_,H_,2,"The two confirmation columns agree","Holds for Jun if they don't",{a:k2.a,k:k2.k,sa:ag_in(tt,P.holds-0.2,0.4),tags:[["hold",1]],tk:1});
    if(cnt<1)ra_proposal(x,80,y3,W_,H_,3,"Every graduate has confirmed",no>0?"About what people do: not a check":"Would fail every night someone hasn't",{a:k3.a*(1-cnt),k:k3.k,sa:ag_in(tt,P.fail-0.2,0.4),strike:no,tags:[["hold",1-no]],tk:1});
    if(cnt>0)ra_proposal(x,80,y3,W_,H_,3,"38 not confirmed yet","The agent's answer to her question",{kick:"Malia's weekly count",edge:"steel",icon:"count",a:cnt,k:tt-P.countW+0.3,sa:ag_in(tt,P.trusted-0.3,0.4)});
    const dc=ra_pop(tt,P.decideW-0.8,null);dq_chip(x,450,770,"The agent proposes; people decide",{align:"center",a:dc.a,icon:"people"});
  }}]);
  ra_kick(ctx,S,t,"5","The agent proposes, people decide",4.8);});

// ---- 6 · Read it before you act: what spared the 374; read an agent's answer as a new colleague's; ask; the films before ----
scene("before",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({spared:c.spared,n374:wAt(sc,"spared","374"),reading:wAt(sc,"spared","reading"),read:c.read,col:wAt(sc,"read","colleague's"),
    countR:wAt(sc,"read","count"),fitR:wAt(sc,"read","fit"),ask:c.ask,show:wAt(sc,"ask","show"),person:wAt(sc,"ask","person"),films:c.films,ce:wAt(sc,"films","Context engineering"),
    cm:wAt(sc,"films","Context and memory"),step:c.step,descS:wAt(sc,"step","description"),qual:wAt(sc,"step","quality is")}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"benchTop",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{
    // the email to all 412, held while Malia read the answer: it never went
    const o1=P.read-0.4,a1=1-ag_in(tt,o1,0.4),e=ra_pop(tt,0.6,o1);
    if(a1>0){const eb=dq_textCard(x,140,200,880,{kick:"Draft · to 412 graduates",title:"Please confirm your name before it's printed"},{icon:"mail",on:"granite",k:e.k,a:e.a});
      dq_tag(x,1100,eb.y+60,"hold",{to:[eb.x+eb.w-8,eb.y+40],text:"READ FIRST",on:"granite",a:e.a*ag_in(tt,P.reading-0.4,0.3),k:tt-P.reading+0.4});
      const f=ra_pop(tt,P.n374-0.2,o1);dq_figure(x,1100,560,"374",null,{size:110,dark:true,a:f.a});if(f.a>0)dq_T(x,"graduates spared an email they didn't need",1100,630,{w:600,size:32,col:DQ.chalkSoft,a:f.a});}
    // read it as a new colleague's answer; ask it to show its working; ask the person who answers for the data
    const o2=P.films-0.4,Q=[["What did it count?",Math.min(P.countR,P.read+0.7),"lens",120,200],["Does it fit what you know?",P.fitR,"why",1000,200],["Show your working",P.show,"list",120,500],["Ask who answers for the data",P.person,"person",1000,500]];
    const kc=ra_pop(tt,P.read+0.1,o2);if(kc.a>0)dq_label(x,120,150,"Read it as a new colleague's answer",{dark:true,a:kc.a});
    Q.forEach(([s,t0,ic,qx,qy])=>{const p=ra_pop(tt,t0-0.3,o2);dq_textCard(x,qx,qy,800,{title:s},{icon:ic,on:"granite",k:p.k,a:p.a});});
    // the films before this one, and this film's step
    const o3=P.step-0.4,f1=ra_pop(tt,P.ce-0.3,o3),f2=ra_pop(tt,P.cm-0.3,o3);
    dq_textCard(x,120,260,800,{kick:"Agents at work on data",title:"Context engineering",sub:"What an agent reads decides what it writes"},{on:"granite",k:f1.k,a:f1.a});
    dq_textCard(x,1000,260,800,{kick:"Agents at work on data",title:"Context and memory, governed",sub:"How to keep what it reads right"},{on:"granite",k:f2.k,a:f2.a});
    const sp=ra_pop(tt,P.step+0.2,null);ra_descCard(x,300,190,1320,[{k:"Means",v:"The day of the graduate's answer in the portal, for this ceremony, once accepted"},{k:"Empty means",v:"Not confirmed in the portal: name_confirmed_how says if it was on paper"},{k:"Owner",v:"Mei Tanaka, registrar's office"}],
      {head:"name_confirmed_on",type:"date",on:"granite",k:sp.k,a:sp.a});
    const sq=ra_pop(tt,P.qual-0.3,null);dq_chip(x,960,720,"Its quality is the data's quality",{align:"center",a:sq.a});
  }}]);
  ra_kick(ctx,S,t,"6","Read it before you act",4.4,{dark:true});});

// ---- 7 · For a reader who can't ask: Monday's advice, the Cupertino's two halves, and the end ----
scene("monday",(ctx,S,t,sc)=>{const c=sc.cues,P=ra_once(sc,"P",()=>({monday:wAt(sc,"monday","Monday"),table:wAt(sc,"monday","table"),each:c.each,wM:wAt(sc,"each","what it means"),
    wE:wAt(sc,"each","what empty"),unit:wAt(sc,"each","unit"),who:wAt(sc,"each","who answers"),fix:c.fix,fixW:wAt(sc,"fix","fix the data"),let:c.let,agents:wAt(sc,"let","agents"),people:wAt(sc,"let","people"),
    halves:c.halves,complete:wAt(sc,"halves","complete"),readW:wAt(sc,"halves","read what"),take:c.takeaway,end:c.breath+0.2}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"benchTop",keys:[[0,960,540,1]],push:0.02,draw:(x,tt)=>{
    const o1=P.halves-0.4,m=ra_pop(tt,P.monday-0.3,o1);dq_chip(x,120,190,"On Monday",{icon:"calendar",a:m.a});
    const tb=ra_pop(tt,P.table-0.3,o1);dq_textCard(x,120,250,680,{title:"The table your agent reads most"},{icon:"table",on:"granite",k:tb.k,a:tb.a});
    // for each column: what it means, what empty means, its unit, who answers for it
    const ec=ra_pop(tt,P.each-0.2,o1),T0=[P.wM,P.wE,P.unit,P.who];
    ra_descCard(x,840,150,960,[{k:"Means",v:"What the column means"},{k:"Empty means",v:"What it means when it's empty"},{k:"Unit",v:"Its unit or format"},{k:"Owner",v:"Who answers for it"}],
      {head:"each column",on:"granite",k:ec.k,a:ec.a,rowA:i=>ag_in(tt,T0[i]-0.25,0.35)});
    const fx=ra_pop(tt,P.fixW-0.4,o1);dq_textCard(x,120,370,680,{title:"Fix the data, not only the words",sub:"Where empty means two things"},{on:"granite",k:fx.k,a:fx.a});
    const ag=ra_pop(tt,P.agents-0.3,o1),pp=ra_pop(tt,P.people-0.3,o1);
    const ab=dq_textCard(x,120,534,680,{title:"Agents draft and propose"},{on:"granite",k:ag.k,a:ag.a});if(ag.a>0)dq_tag(x,ab.x+ab.w+40,ab.y+ab.h/2,"hold",{to:[ab.x+ab.w-6,ab.y+ab.h/2-14],text:"WAITS",on:"granite",size:28,a:ag.a,k:tt-P.agents+0.3});
    dq_textCard(x,120,654,680,{title:"People review and decide"},{icon:"people",on:"granite",k:pp.k,a:pp.a});
    // the Cupertino's cure, two halves: complete what the machine reads; read what it offers before you take it
    const h1=ra_pop(tt,Math.min(P.complete-0.4,P.halves+0.3),P.take-0.3),h2=ra_pop(tt,P.readW-0.4,P.take-0.3);
    if(h1.a>0){ra_printout(x,200,200,{w:560,lh:60,words:[{w:"co-operate"},{w:"co-operation"},{w:"cooperation",gap:true,fill:1,mark:"pass"},{w:"co-ordinate"}],a:h1.a,k:h1.k});
      dq_T(x,"Complete what the machine reads",200,620,{w:700,size:32,dark:true,a:h1.a});}
    if(h2.a>0){x.save();x.globalAlpha*=h2.a;const mb=ra_menu(x,1060,260,["Cupertino","Ignore"],{k:h2.k});dq_tag(x,mb.x+mb.w+150,mb.y+64,"hold",{to:[mb.x+mb.w-6,mb.y+28],text:"READ IT FIRST",on:"granite",k:tt-P.readW+0.4});
      dq_T(x,"Read what it offers before you take it",1060,620,{w:700,size:32,dark:true});x.restore();}
  }}]);
  ra_kick(ctx,S,t,"7","For a reader who can't ask",4.2,{dark:true});
  dq_end(ctx,S,t,P.end,RA_TITLE,"Describe your data for a reader who can't ask.","Film 3 of 4","Quality as a habit");
  // the last line, where the end card writes it, over its veil: it stays as the veil comes, and the end card's own takes over in place
  const tk=ag_in(t,P.take-0.2,0.4)*(1-ag_in(t,P.end+0.6,0.9));if(tk>0){setScreen(ctx,S);dq_T(ctx,"Describe your data for a reader who can't ask.",960,340,{w:700,size:48,align:"center",dark:true,a:tk});}});

// chapters that open in the room the one before ends in: the camera glides on and only what changes fades; else it's a cut
ag_cutInto(["answer","empty","written","proposes","before","monday"]);
