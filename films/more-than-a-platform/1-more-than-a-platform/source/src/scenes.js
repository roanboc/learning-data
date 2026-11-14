/* ===== More than a platform: the scenes =====
   Eight chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The whole film is on the module's
   map, one room, and the camera never moves: a new moment is a later one (later:true), so what was there leaves before what comes
   in, and a chapter opens on what the one before ends on (ag_cutInto). The route draws itself across two chapters, the foundations
   and the rest, and comes back whole at the end. The title card ends chapter 1, the end card chapter 8. */
const MP_CAM=[[0,960,540,1]];

/* ---------------------------------------------------------------- 1 · Beyond the platform */
// the four things a platform can't do alone, around it: [x, y, w, words]
const MP_PLACES=[[110,200,560,"How the organisation works"],[1250,200,560,"What each word means"],[110,660,560,"Who decides"],[1250,660,560,"Who may see what"]];
scene("beyond",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>({dec:wAt(sc,"basics","decision"),
    at:[wAt(sc,"still","organisation"),wAt(sc,"still","word"),wAt(sc,"still","decides"),wAt(sc,"still","see")]}));
  ag_shots(ctx,S,t,sc.dur,[
    // the introduction's map: systems, the platform's three layers, and who reads the result
    {at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{
      md_label(cx,960,110,"The Inner Life of Data",{align:"center",col:MD.flow,a:ag_in(tt,0.4,0.6)});
      md_map(cx,tt,{a:ag_in(tt,0.2,0.8),lit:tt>T.dec-0.4?"gold":null});
      md_tag(cx,960,880-30,"It works",{align:"center",col:MD.pass,icon:"tick",a:ag_in(tt,c.matters+0.1,0.4)});}},
    // the platform alone, and the four places it leaves empty
    {later:true,at:c.alone-0.2,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const pa=ag_in(tt,c.alone+0.2,0.5);
      const out=1-ag_in(tt,c.breath,0.8);cx.save();cx.globalAlpha*=out;  // the platform and its places leave as the title card comes
      md_textCard(cx,680,446,560,{kick:"The platform",title:"Moves data from a tap to a decision"},{edge:MD.flow,icon:"tick",a:pa,k:tt-c.alone-0.2});
      MP_PLACES.forEach((p,i)=>{const f=ag_in(tt,T.at[i]-0.1,0.45),ea=ag_in(tt,c.still-0.6+i*0.15,0.4),cx_=p[0]+p[2]/2,cy_=p[1]+52,fx=cx_<960?680:1240,fy=cy_<540?470:600;
        cx.save();cx.globalAlpha*=ea;cx.setLineDash([8,10]);cx.strokeStyle=rgba(f>0.5?MD.agreed:MD.dim,0.7);cx.lineWidth=2;cx.beginPath();cx.moveTo(cx_+(cx_<960?p[2]/2-60:-p[2]/2+60),cy_+(cy_<540?52:-52));cx.lineTo(fx,fy);cx.stroke();cx.restore();
        mp_place(cx,p[0],p[1],p[2],p[3],ea,f);});cx.restore();}}],0.6);
  setScreen(ctx,S);md_title(ctx,S,t,c.breath,"More than a platform",null,"AFTER THE INNER LIFE OF DATA");});

/* ---------------------------------------------------------------- 2 · Why this portal */
const MP_ROLES=[["Applications",210],["Data",760],["Enterprise architecture",1310]];
scene("portal",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>({tech:wAt(sc,"tech","technical"),neutral:wAt(sc,"neutral","neutral"),
    model:wAt(sc,"wrong","model"),wq:wAt(sc,"wrong","wrong question"),policy:wAt(sc,"wrong","policy"),code:wAt(sc,"wrong","code"),
    roles:[wAt(sc,"author","applications"),wAt(sc,"author","data"),wAt(sc,"author","enterprise architecture")],yrs:wAt(sc,"author","sixteen"),
    ctx_:wAt(sc,"ld","context"),prac:wAt(sc,"ld","practice"),two:wAt(sc,"eda","Joining"),eda:wAt(sc,"eda","enterprise data architecture")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the two halves courses give, and the gap between them
    {later:true,at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const lo=1-ag_in(tt,c.wrong-0.2,0.5)*0.55;
      md_label(cx,960,130,"Only half",{align:"center",a:ag_in(tt,c.half+0.2,0.5)});
      cx.save();cx.globalAlpha*=lo;mp_codeCard(cx,150,180,620,360,ag_in(tt,T.tech-0.2,0.4),tt-T.tech+0.2);
      md_tag(cx,180,500,"no business · no governance",{col:MD.wait,a:ag_in(tt,T.tech+0.8,0.4)});
      mp_boxCard(cx,1150,180,620,360,ag_in(tt,T.neutral-0.2,0.4),tt-T.neutral+0.2);md_tag(cx,1180,500,"no practice",{col:MD.wait,a:ag_in(tt,T.neutral+0.8,0.4)});
      const ga=ag_in(tt,c.join,0.4);cx.save();cx.globalAlpha*=ga;cx.setLineDash([10,12]);cx.strokeStyle=rgba(MD.dim,0.9);cx.lineWidth=2.4;cx.beginPath();cx.moveTo(800,360);cx.lineTo(1120,360);cx.stroke();cx.restore();
      md_pill(cx,960,360,"You join them",{col:MD.flow,a:ga,k:tt-c.join});cx.restore();
      // what joining them alone can cost: a model right by its tests, and a policy that never reaches the code
      md_textCard(cx,330,610,580,{kick:"Model",title:"All tests passed",sub:"Answers the wrong question"},{edge:MD.fail,icon:"cross",a:ag_in(tt,T.model,0.4),k:tt-T.model});
      const dr=ag_sine((tt-T.policy)/2.6);md_textCard(cx,1010+40*dr,610+10*dr,580,{kick:"Policy",title:"Agreed on paper",sub:"Never reaches the code"},{edge:MD.wait,icon:"doc",a:ag_in(tt,T.policy,0.4)*(1-0.35*dr)});}},
    // sixteen years of joining the pieces, in three kinds of role
    {later:true,at:c.author-0.2,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{
      md_label(cx,960,170,"The author of this portal",{align:"center",a:ag_in(tt,c.author,0.5)});
      const ln=ag_sine((tt-c.author-0.2)/1.4);mp_line(cx,[[260,560],[1660,560]],MD.flow,ag_in(tt,c.author,0.4),ln);
      MP_ROLES.forEach((r,i)=>mp_role(cx,r[1],290,400,r[0],ag_in(tt,T.roles[i]-0.1,0.4),tt-T.roles[i]+0.1));
      md_pill(cx,960,660,"16+ years",{col:MD.agreed,a:ag_in(tt,T.yrs,0.4),k:tt-T.yrs});
      // the pieces come together slowly, one project at a time
      for(let i=0;i<9;i++){const t0=c.slowly+0.2+i*0.32,u=ag_sine((tt-t0)/1.2),x0=200+((i*373)%1500),y0=i%2?780:250,x1=330+i*157,f=ag_in(tt,t0,0.3)*(1-ag_in(tt,c.gather,0.5));
        if(f>0.004){cx.save();cx.globalAlpha*=f;cx.fillStyle=rgba(i%2?MD.flow:MD.agreed,0.95);rr(cx,lerp(x0,x1,u)-10,lerp(y0,560,u)-10,20,20,5);cx.fill();cx.restore();}}
      md_tag(cx,960,790,"No one should need sixteen years",{align:"center",col:MD.soft,a:ag_io(tt,c.nobody+0.3,c.gather+0.2,0.4)});}},
    // one place: Learning Data, the context and the practice, joined
    {later:true,at:c.gather-0.1,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{
      md_label(cx,960,250,"The key lessons, in one place",{align:"center",col:MD.flow,a:ag_in(tt,c.gather+0.1,0.5)});
      md_T(cx,"Learning Data",960,420,{w:800,size:110,align:"center",a:ag_in(tt,c.ld+0.1,0.6)});
      md_T(cx,"data.learn-all.org",960,490,{w:600,size:36,align:"center",col:MD.soft,a:ag_in(tt,c.ld+0.6,0.6)});
      md_textCard(cx,250,580,480,{kick:"The context",title:"How the organisation works"},{edge:MD.flow,a:ag_in(tt,T.ctx_-0.1,0.4),k:tt-T.ctx_+0.1});
      md_textCard(cx,1190,580,480,{kick:"The practice",title:"Down to the code"},{edge:MD.flow,a:ag_in(tt,T.prac-0.1,0.4),k:tt-T.prac+0.1});
      const th=ag_sine((tt-T.two)/1.2);mp_line(cx,[[730,660],[1190,660]],MD.agreed,ag_in(tt,T.two,0.3),th);
      md_label(cx,960,790,"Enterprise data architecture",{align:"center",col:MD.agreed,a:ag_in(tt,T.eda,0.5)});}}],0.6);
  setScreen(ctx,S);});

/* ---------------------------------------------------------------- 3 · The foundations */
// the route, as far as the foundations: the start, enterprise architecture, data governance
function mp_found(cx,tt,T,c,a){const on={start:ag_spr(tt,T.st,0.7),ea:ag_spr(tt,c.ea+0.3,0.7),gov:ag_spr(tt,c.gov+0.3,0.7)},z={};
  for(const id of MP_ORDER)if(on[id]==null){on[id]=0;z[id]=0;}
  const lit={ea:ag_io(tt,c.ea+0.2,c.gov,0.4),gov:ag_in(tt,c.gov+0.2,0.4)};
  mp_route(cx,{a,mainX:ag_keys(tt,[[T.st,MP_ST.start[0]],[c.ea,MP_ST.start[0]],[c.ea+0.7,MP_ST.ea[0]],[c.gov,MP_ST.ea[0]],[c.gov+0.7,MP_ST.gov[0]]]),up:0,dn:0,on,lab:z,lit,
    grp:{found:ag_in(tt,T.found,0.5),build:0,share:0,agents:0,lead:0}});}
const MP_EA=[["What it does","does"],["What it needs","needs"],["Which systems serve it","systems"],["How they connect","connect"]];
const MP_GOVX=[["Seen as slow work","clock","slow"],["Weak foundations","warn","weak"],["Technology not ready","warn","ready"]];
const MP_FLOW=[["Glossary","A term"],["Checks","On a column"],["Code","Built from it"]];
scene("found",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>({st:wAt(sc,"route","route"),found:wAt(sc,"first","foundations"),many:wAt(sc,"tools","tools"),fewer:wAt(sc,"tools","far fewer"),
    ea:MP_EA.map(r=>wAt(sc,"how",r[1])),ctxt:wAt(sc,"taught","context"),decides:wAt(sc,"gov","decides"),
    gx:[c.slow+0.3,c.weak+0.3,c.ready+0.3],pol:wAt(sc,"policies","policies"),newer:wAt(sc,"newer","newer way"),gl:wAt(sc,"newer","glossary"),cd:wAt(sc,"newer","code")}));
  ag_shots(ctx,S,t,sc.dur,[
    {later:true,at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{mp_found(cx,tt,T,c,1);
      // many conversations about tools, far fewer about the foundations under them
      const ta=ag_io(tt,T.many-0.2,c.ea-0.1,0.35);[["Which tool?",330,640],["Tool A or tool B?",760,700],["The newest tool",1220,640],["Which platform?",1600,720],["Faster pipelines",560,790],["More dashboards",1380,800]].forEach((w,i)=>
        md_tag(cx,w[1],w[2],w[0],{align:"center",col:MD.soft,a:ta*ag_in(tt,T.many+i*0.12,0.3)}));
      md_tag(cx,960,560,"Foundations",{align:"center",col:MD.agreed,icon:"contract",a:ag_io(tt,T.fewer,c.ea-0.1,0.4)});
      // enterprise architecture: how a business works, in layers
      const ea=ag_io(tt,c.how-0.3,c.taught-0.2,0.4);if(ea>0.004){md_card(cx,560,560,800,300,{edge:MD.flow,glow:0.5,a:ea});md_label(cx,600,612,"Enterprise architecture",{col:MD.flow,a:ea});
        MP_EA.forEach((r,i)=>{const a=ea*ag_in(tt,T.ea[i]-0.1,0.35),y=640+i*52;if(a<=0.004)return;cx.save();cx.globalAlpha*=a;md_card(cx,600+i*18,y,720-i*36,44,{r:10,fill:"rgba(20,32,60,0.96)"});md_T(cx,r[0],960,y+33,{w:700,size:28,align:"center"});cx.restore();});}
      md_textCard(cx,560,600,800,{kick:"In the author's experience",title:"Rarely taught in context",sub:"So people struggle to describe a business"},{edge:MD.wait,icon:"warn",a:ag_io(tt,T.ctxt-0.3,c.gov-0.2,0.4)});
      // data governance: who decides; why it stayed slow; and the newer way, built into the work
      md_textCard(cx,560,600,800,{kick:"Data governance",title:"Who decides what data means, and who may use it"},{edge:MD.agreed,icon:"contract",a:ag_io(tt,T.decides-0.2,c.slow-0.2,0.4)});
      const ga=ag_in(tt,c.slow-0.1,0.4);if(ga>0.004){md_card(cx,150,560,560,300,{edge:MD.wait,glow:0.4,a:ga});md_label(cx,190,612,"A set of policies",{col:MD.wait,a:ga*ag_in(tt,T.pol-0.2,0.4)});
        MP_GOVX.forEach((r,i)=>{const a=ga*ag_in(tt,T.gx[i],0.35);md_icon(cx,r[1],206,672+i*62,32,MD.wait,{a});md_T(cx,r[0],240,682+i*62,{w:700,size:30,a});});}
      const nA=ag_in(tt,T.newer,0.4);MP_FLOW.forEach((f,i)=>{const t0=i===0?T.gl:i===1?(T.gl+T.cd)/2:T.cd,x=820+i*330;
        md_textCard(cx,x,600,280,{kick:f[0],title:f[1]},{edge:MD.agreed,a:nA*ag_in(tt,t0-0.2,0.35),k:tt-t0+0.2});
        if(i)mp_line(cx,[[x-50,660],[x,660]],MD.agreed,nA*ag_in(tt,t0-0.2,0.3),ag_sine((tt-t0+0.2)/0.5));});
      md_pill(cx,1315,820,"Governance as a service",{col:MD.agreed,a:ag_in(tt,T.cd+0.4,0.4),k:tt-T.cd-0.4});}}],0.6);
  setScreen(ctx,S);});

/* ---------------------------------------------------------------- 4 · The rest of the route */
const MP_DEEP=[["bronze","keeps what arrived"],["silver","makes it consistent"],["gold","makes it useful"]];
// a branch line's stations, with their questions: [kick, rows of [station, question]]
const MP_BRANCH={share:["Share and protect",[["Master and reference data","The same student everywhere?"],["Data protection and privacy","Who may see it, for how long?"]]],
  agents:["Agents",[["AI agents in data work","What may an agent do with it?"]]],lead:["Lead",[["Data management","How does it all fit in one plan?"],["Leading data people","For leads, and the people they lead"]]]};
function mp_rows(ctx,key,a,k){if(a<=0.004)return;const g=MP_BRANCH[key],col=MP[key==="lead"?"main":key],w=1180,x=370,h=88+g[1].length*52;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,960,640+h/2,lerp(0.9,1,ag_spr(k,0,0.6)));
  md_card(ctx,x,640,w,h,{edge:col,glow:0.5});md_label(ctx,x+32,690,g[0],{col});g[1].forEach((r,i)=>{md_T(ctx,r[0],x+32,744+i*52,{w:800,size:30});md_T(ctx,r[1],x+w-32,744+i*52,{w:600,size:30,align:"right",col:MD.soft});});ctx.restore();}
function mp_rest(cx,tt,T,c,o){o=o||{};const U=MP_LOOP,X=id=>MP_ST[id][0],on={start:1,ea:1,gov:1},lab={},lit={};
  const b=["model","basics","ae","dq"];b.forEach((id,i)=>{const t0=T.main+0.4+i*0.55;on[id]=ag_spr(tt,t0+0.3,0.7);lab[id]=ag_in(tt,t0+0.4,0.4);lit[id]=0.6*ag_io(tt,c.deeper,c.branch,0.4);});
  on.mdm=ag_spr(tt,T.sh+0.5,0.7);on.prot=ag_spr(tt,T.sh+1.2,0.7);on.agents=ag_spr(tt,T.ag+0.6,0.7);on.dm=ag_spr(tt,T.dm+0.3,0.7);on.lead=ag_spr(tt,T.ld+0.3,0.7);
  for(const id of["mdm","prot","agents","dm","lead"])lab[id]=ag_in(tt,0.1+(id==="mdm"?T.sh+0.6:id==="prot"?T.sh+1.3:id==="agents"?T.ag+0.7:id==="dm"?T.dm+0.4:T.ld+0.4),0.4);
  const mainX=ag_keys(tt,[[T.main,X("gov")],[T.main+2.6,X("dq")],[T.end-0.2,X("dq")],[T.end+0.8,MP_J2[0]],[T.dm,MP_J2[0]],[T.dm+0.6,X("dm")],[T.ld,X("dm")],[T.ld+0.6,X("lead")]]);
  const up=ag_keys(tt,[[c.branch+0.2,0],[c.branch+1.4,U.share.rise],[T.sh+0.1,U.share.rise],[T.sh+0.7,U.share.u.mdm],[T.sh+0.8,U.share.u.mdm],[T.sh+1.4,U.share.u.prot],[T.end-0.2,U.share.u.prot],[T.end+0.8,1]]),
    dn=ag_keys(tt,[[c.branch+0.2,0],[c.branch+1.4,U.agents.rise],[T.ag+0.1,U.agents.rise],[T.ag+0.8,U.agents.u.agents],[T.end-0.2,U.agents.u.agents],[T.end+0.8,1]]);
  mp_route(cx,{mainX,up,dn,on,lab,lit,grp:{found:1,build:ag_in(tt,T.main+0.2,0.5),share:ag_in(tt,T.sh,0.5),agents:ag_in(tt,T.ag,0.5),lead:ag_in(tt,T.dm,0.5)}});
  mp_badge(cx,(MP_ST.ae[0]+MP_ST.dq[0])/2,MP_Y,ag_in(tt,T.main+2.0,0.4),tt-T.main-2.0);}
scene("rest",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>({main:wAt(sc,"main","main line"),layer:wAt(sc,"deeper","each layer"),sh:wAt(sc,"share","shares"),ag:wAt(sc,"agents","AI agents"),
    end:wAt(sc,"whole","ends"),dm:wAt(sc,"whole","data management"),ld:wAt(sc,"lead","leading data people")}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{mp_rest(cx,tt,T,c);
      // the main line's stations go deeper into each of the introduction's layers
      const dA=ag_io(tt,c.deeper,c.branch-0.1,0.4);md_label(cx,1030,620,"Deeper into each layer",{align:"center",col:MD.flow,a:dA});
      MP_DEEP.forEach((l,i)=>md_layer(cx,700+i*230,650,210,210,l[0],{sub:l[1],cells:false,a:dA*ag_in(tt,T.layer+i*0.2,0.35)}));
      mp_rows(cx,"share",ag_io(tt,T.sh+0.4,c.agents-0.1,0.35),tt-T.sh-0.4);mp_rows(cx,"agents",ag_io(tt,T.ag+0.4,c.whole-0.1,0.35),tt-T.ag-0.4);
      mp_rows(cx,"lead",ag_io(tt,T.dm+0.2,sc.dur-0.6,0.35),tt-T.dm-0.2);}}],0.6);
  setScreen(ctx,S);});

/* ---------------------------------------------------------------- 5 · A real project */
scene("project",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>({proj:wAt(sc,"real","real project"),gh:wAt(sc,"real","GitHub"),mach:wAt(sc,"real","your own machine"),dbx:wAt(sc,"real","Databricks"),
    run:wAt(sc,"open","run"),mt:wAt(sc,"more","models"),tests:wAt(sc,"more","tests"),
    band:[wAt(sc,"list","glossary"),wAt(sc,"list","glossary"),wAt(sc,"list","owners"),wAt(sc,"list","architecture map"),wAt(sc,"list","data products"),wAt(sc,"list","contracts"),wAt(sc,"list","decisions")],
    meta:wAt(sc,"meta","business"),show:wAt(sc,"show","dbt"),cap:wAt(sc,"show","same capabilities"),well:wAt(sc,"well","using")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the route's badge opens into the project: its tree, the code first, then the folders most projects leave out
    {later:true,at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const wa=ag_in(tt,T.proj-0.2,0.5);
      md_window(cx,120,130,1020,720,{logo:"github",product:"GitHub",title:"The example project",a:wa,k:tt-T.proj+0.2,draw:(c2,b)=>{
        const rowOf=[0,1,2,3,4,5,6,7,8,9],band=i=>i>=3?ag_in(tt,T.band[i-3]-0.1,0.4):0,lit=i=>i===0?ag_in(tt,T.mt,0.3):i===1?ag_in(tt,T.tests,0.3):i===2?ag_in(tt,c.open,0.4):0;
        mp_tree(c2,b.x+30,b.y+40,56,ag_in(tt,T.proj+0.4,0.5),lit,band);
        // the folders most projects leave out: the business and governance metadata
        const mA=ag_in(tt,T.meta-0.1,0.4),y0=b.y+40+3*56-26,y1=b.y+40+9*56+26;if(mA>0.004){c2.save();c2.globalAlpha*=mA;c2.strokeStyle=rgba(MD.agreed,1);c2.lineWidth=3;c2.lineCap="round";
          c2.beginPath();c2.moveTo(b.x+600,y0);c2.lineTo(b.x+620,y0);c2.lineTo(b.x+620,y1);c2.lineTo(b.x+600,y1);c2.stroke();c2.restore();
          md_T(c2,"Business and",b.x+650,(y0+y1)/2-6,{w:800,size:30,col:MD.agreed,a:mA});md_T(c2,"governance metadata",b.x+650,(y0+y1)/2+34,{w:800,size:30,col:MD.agreed,a:mA});}
        md_tag(c2,b.x+600,b.y+90,"Next to the code",{col:MD.agreed,a:ag_io(tt,c.leave+0.2,T.meta-0.2,0.4)});}});
      // it runs on your own machine, and the same code on Databricks
      md_window(cx,1200,130,600,330,{logo:"dbt",product:"dbt",title:"Your machine",a:ag_in(tt,T.mach-0.2,0.4),k:tt-T.mach+0.2,draw:(c2,b)=>{
        md_T(c2,"$ dbt build",b.x+24,b.y+58,{w:500,size:28,f:"mono",a:ag_in(tt,T.mach+0.2,0.3)});
        md_T(c2,"Completed successfully",b.x+24,b.y+118,{w:500,size:28,f:"mono",col:MD.pass,a:ag_in(tt,T.run,0.4)});
        md_icon(c2,"tick",b.x+b.w-48,b.y+108,36,MD.pass,{a:ag_in(tt,T.run,0.4)});}});
      md_window(cx,1200,500,600,230,{logo:"databricks",product:"Databricks",title:"The same code",a:ag_in(tt,T.dbx-0.1,0.4),k:tt-T.dbx+0.1,draw:(c2,b)=>{
        md_T(c2,"Same models, same tests",b.x+24,b.y+58,{w:600,size:28,a:ag_in(tt,T.dbx+0.4,0.3)});}});
      md_tag(cx,1500,800,"Code you can open, and run",{align:"center",col:MD.flow,a:ag_in(tt,c.open+0.2,0.4)});}},
    // the tool wars, and what matters: the capabilities, used well
    {later:true,at:c.argue-0.2,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const wA=ag_io(tt,c.argue+0.1,T.show-0.1,0.3);
      md_tag(cx,560,420,"This tool!",{align:"center",col:MD.wait,a:wA});md_tag(cx,1360,420,"No, that one!",{align:"center",col:MD.wait,a:wA*ag_in(tt,c.argue+0.6,0.3)});
      md_label(cx,960,240,"Tools show the ideas",{align:"center",a:ag_in(tt,T.show,0.5)});
      [["dbt","dbt",650],["databricks","Databricks",1270]].forEach((l,i)=>md_window(cx,l[2]-170,290,340,90,{logo:l[0],product:l[1],a:ag_in(tt,T.show+i*0.3,0.4)*(1-0.5*ag_in(tt,T.cap,0.6))}));
      [["refresh","Builds and tests"],["store","Runs and stores"],["lock","Governs"]].forEach((b,i)=>mp_cap(cx,330+i*440,440,380,b[0],b[1],ag_in(tt,T.cap+i*0.2,0.4),tt-T.cap-i*0.2));
      md_pill(cx,960,700,"Any tools with these capabilities",{col:MD.flow,a:ag_in(tt,T.cap+0.9,0.4),k:tt-T.cap-0.9});
      md_tag(cx,960,800,"What matters: using them well",{align:"center",col:MD.agreed,icon:"tick",a:ag_in(tt,T.well,0.4)});}}],0.6);
  setScreen(ctx,S);});

/* ---------------------------------------------------------------- 6 · Beyond DAMA */
const MP_BEYOND=[["Enterprise architecture","share",MD.flow,120,300],["AI agents in data work","event",[185,162,255],1380,300],["Leadership","person",MD.agreed,1380,520]];
scene("dama",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>({dama:wAt(sc,"dama","DAMA's wheel"),covers:wAt(sc,"dama","covers"),
    be:[wAt(sc,"further","enterprise architecture"),wAt(sc,"further","AI agents"),wAt(sc,"further","leadership")],
    many:wAt(sc,"many","data people"),little:wAt(sc,"many","enterprise"),ent:wAt(sc,"why","enterprise"),eda:wAt(sc,"means","Enterprise data architecture"),part:wAt(sc,"means","organisation")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the best known map, and what this portal adds to it
    {later:true,at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{
      md_label(cx,960,150,"DAMA-DMBOK",{align:"center",a:ag_in(tt,T.dama,0.4)});
      mp_wheel(cx,960,470,230,(tt-c.mapped-0.3)/2.4,ag_in(tt,c.mapped,0.5),ag_in(tt,T.dama,0.6));
      md_T(cx,"Governance",960,480,{w:800,size:28,align:"center",col:MD.agreed,a:ag_in(tt,T.dama+0.3,0.4)});
      md_tag(cx,960,770,"Covered here",{align:"center",col:MD.pass,icon:"tick",a:ag_io(tt,T.covers,c.further-0.1,0.4)});
      MP_BEYOND.forEach((b,i)=>md_textCard(cx,b[3],b[4],420,{kick:"Added here",title:b[0]},{edge:b[2],icon:b[1],a:ag_in(tt,T.be[i]-0.1,0.4),k:tt-T.be[i]+0.1}));
      md_tag(cx,960,800,"And other frameworks that proved their worth",{align:"center",col:MD.soft,a:ag_in(tt,c.others+0.2,0.4)});}},
    // many paradigms, each looking at itself; the enterprise around them; enterprise data architecture
    {later:true,at:c.paradigms-0.2,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const into=ag_sine((tt-T.ent)/1.6),ol=ag_in(tt,T.little,0.6),wordA=ag_in(tt,T.eda-0.1,0.5);
      // a faint outline of the whole organisation behind them, which brightens once the portal starts from it
      cx.save();cx.globalAlpha*=ol;cx.setLineDash([14,12]);cx.strokeStyle=rgba(into>0.5?MD.agreed:MD.dim,lerp(0.6,0.95,into));cx.lineWidth=lerp(2,3.4,into);rr(cx,140,150,1640,700,60);cx.stroke();cx.restore();
      md_label(cx,190,206,"The enterprise",{col:into>0.5?MD.agreed:MD.soft,a:ol});
      const pts=[[420,330],[760,280],[1180,320],[1540,360],[340,640],[700,700],[1240,690],[1590,640]],mid=[[560,330],[820,300],[1100,300],[1360,330],[560,730],[820,760],[1100,760],[1360,730]];
      pts.forEach((p,i)=>{const a=ag_in(tt,c.paradigms+i*0.15,0.35)*(1-wordA*0.75),x=lerp(p[0],mid[i][0],into),y=lerp(p[1],mid[i][1],into);mp_inward(cx,i%4,x,y,mix(MD.soft,MD.flow,into),a*lerp(1,0.6,ag_in(tt,T.many,0.5)*(1-into)));});
      md_T(cx,"Enterprise data architecture",960,520,{w:800,size:64,align:"center",col:MD.agreed,a:wordA});
      md_T(cx,"Data designed as part of the organisation it serves",960,590,{w:600,size:34,align:"center",a:ag_in(tt,T.part-0.4,0.5)});}}],0.6);
  setScreen(ctx,S);});

/* ---------------------------------------------------------------- 7 · Learn by doing */
// a question, its three answers of like length: which is right, and which is the near miss
const MP_Q=["Two offices bring two numbers. What comes first?",[["Agree what the word means, then build from it",1],["Fix the code, then agree what the word means",2],["Report both numbers, and let readers choose one",0]]];
const MP_ORDERS=["Agree the word","Write it in the glossary","Build the model","Test it"],MP_MIX=[2,0,3,1];
scene("doing",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>({stops:wAt(sc,"question","stops"),asks:wAt(sc,"question","asks"),close:wAt(sc,"close","close"),almost:wAt(sc,"close","almost right"),
    why:wAt(sc,"close","why"),hands:wAt(sc,"lab","hands"),enrol:wAt(sc,"enrol","Enrol"),event:wAt(sc,"enrol","event"),secs:wAt(sc,"enrol","seconds"),
    call:wAt(sc,"scenario","make the call"),order:wAt(sc,"scenario","order"),sort:wAt(sc,"scenario","sort"),lights:wAt(sc,"goal","lights up"),word:wAt(sc,"search","word"),film:wAt(sc,"search","film")}));
  ag_shots(ctx,S,t,sc.dur,[
    // Pause and think: the film stops and asks; one answer is right, one almost
    {later:true,at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{
      md_label(cx,960,150,"Something to do, not only to watch",{align:"center",a:ag_in(tt,c.do+0.2,0.5)});
      const qa=ag_in(tt,T.stops-0.1,0.4);if(qa>0.004){md_card(cx,300,200,1320,620,{edge:MD.flow,glow:0.5,a:qa});cx.save();cx.globalAlpha*=qa;
        mp_tool(cx,"think",380,272,MD.flow,tt-T.stops+0.1,1);md_label(cx,460,284,"Pause and think",{col:MD.flow});
        md_T(cx,MP_Q[0],350,380,{w:700,size:36,a:ag_in(tt,T.asks,0.4)});
        MP_Q[1].forEach((o,i)=>{const y=440+i*110,a=ag_in(tt,T.asks+0.4+i*0.2,0.35),ok=o[1]===1,near=o[1]===2,okA=ok?ag_in(tt,T.close+0.4,0.4):0,nA=near?ag_in(tt,T.almost,0.4):0,col=ok?MD.pass:near?MD.wait:null;
          cx.save();cx.globalAlpha*=a;md_card(cx,350,y,1220,84,{edge:okA+nA>0.2?col:null,glow:0.5,r:14});md_T(cx,o[0],390,y+53,{w:600,size:30});
          if(okA>0.004)md_pill(cx,1460,y+42,"Right",{col:MD.pass,icon:"tick",size:28,a:okA,k:tt-T.close-0.4});
          if(nA>0.004)md_pill(cx,1430,y+42,"Almost",{col:MD.wait,icon:"warn",size:28,a:nA,k:tt-T.almost});cx.restore();});
        md_T(cx,"The meaning comes first: the film said why.",350,790,{w:600,size:28,col:MD.soft,a:ag_in(tt,T.why,0.4)});cx.restore();}}},
    // a lab: enrol a student, and watch the event reach bronze
    {later:true,at:c.lab-0.2,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const wa=ag_in(tt,c.lab,0.5);
      md_window(cx,180,150,1560,640,{product:"Take it apart",title:"Send data in",edge:MD.flow,a:wa,k:tt-c.lab,draw:(c2,b)=>{
        const sys=md_system(c2,b.x+40,b.y+150,460,"sis",{a:ag_in(tt,T.hands-0.4,0.4),sub:"where data is born"});
        md_layer(c2,b.x+b.w-320,b.y+60,280,400,"bronze",{sub:"keeps what arrived",a:ag_in(tt,T.hands-0.2,0.4)});
        const pts=md_curve(sys.port,[b.x+b.w-320,b.y+260]);md_lane(c2,pts,MD.sys.sis,ag_in(tt,T.hands,0.4)*0.8);
        const t0=T.enrol+0.5,u=(tt-t0)/1.8;if(u>0&&u<1.15){const q=at(mk(pts.map(p=>P(p[0],p[1]))),ease(clamp(u,0,1))),f=1-sstep(1,1.15,u);glow(c2,q.x,q.y,50,MD.sys.sis,0.6*f);c2.save();c2.globalAlpha*=f;rr(c2,q.x-15,q.y-15,30,30,7);c2.fillStyle=rgba(MD.sys.sis,1);c2.fill();c2.restore();}
        const pr=ag_in(tt,t0-0.1,0.12)*(1-ag_in(tt,t0+0.25,0.2));md_pill(c2,b.x+270,b.y+400,"Enrol a student",{col:MD.flow,a:ag_in(tt,T.enrol-0.6,0.4),k:1+pr*0.2});
        md_textCard(c2,b.x+560,b.y+330,380,{kick:"Event to bronze",title:"1.8 s"},{edge:MD.flow,a:ag_in(tt,t0+1.9,0.4),k:tt-t0-1.9});}});}},
    // a scenario: make the call, with its reason; and steps put in order
    {later:true,at:c.scenario-0.2,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{
      const sa=ag_in(tt,T.call-0.2,0.4);if(sa>0.004){md_card(cx,150,170,820,640,{edge:MD.flow,glow:0.5,a:sa});cx.save();cx.globalAlpha*=sa;md_label(cx,190,226,"Make the call",{col:MD.flow});
        md_T(cx,"A nightly file arrives twice.",190,296,{w:700,size:34});md_T(cx,"What lands in bronze?",190,342,{w:700,size:34});
        ["Two copies of every row in it","One copy: the file is read once","No rows until someone checks"].forEach((o,i)=>{const y=380+i*96,pk=i===1?ag_in(tt,T.call+1.2,0.3):0;
          md_card(cx,190,y,740,78,{edge:pk>0.3?MD.pass:null,glow:0.5,r:14});cx.beginPath();cx.arc(228,y+39,12,0,TAU);cx.strokeStyle=rgba(pk>0.3?MD.pass:MD.soft,1);cx.lineWidth=3;cx.stroke();
          if(pk>0.004){cx.beginPath();cx.arc(228,y+39,6,0,TAU);cx.fillStyle=rgba(MD.pass,pk);cx.fill();}md_T(cx,o,260,y+49,{w:600,size:28});});
        md_T(cx,"Why: the loader keeps a checkpoint.",190,710,{w:600,size:28,col:MD.pass,a:ag_in(tt,c.why,0.4)});md_T(cx,"Each file is read only once.",190,750,{w:600,size:28,col:MD.soft,a:ag_in(tt,c.why+0.3,0.4)});cx.restore();}
      const oa=ag_in(tt,T.order-0.2,0.4);if(oa>0.004){md_card(cx,1030,170,740,640,{edge:MD.flow,glow:0.5,a:oa});cx.save();cx.globalAlpha*=oa;md_label(cx,1070,226,"Put it in order",{col:MD.flow});
        const u=ag_sine((tt-T.order-0.8)/1.6);MP_ORDERS.forEach((s,i)=>{const y=lerp(270+MP_MIX[i]*104,270+i*104,u),dx=Math.sign(i-MP_MIX[i])*36*Math.sin(Math.PI*u);md_card(cx,1070+dx,y,660,82,{r:14,edge:u>0.95?MD.pass:null,glow:0.4});
          md_T(cx,String(i+1),1110+dx,y+52,{w:800,size:30,col:MD.flow,a:u});md_T(cx,s,1150+dx,y+52,{w:600,size:30});});
        md_tag(cx,1070,740,"Or sort what belongs where",{col:MD.soft,a:ag_in(tt,T.sort,0.4)});cx.restore();}}},
    // pick a goal, search what the films say; progress stays in the visitor's browser
    {later:true,at:c.goal-0.2,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const nA=ag_in(tt,T.lights,0.35);
      mp_route(cx,{num:{start:1,model:2,ae:3,dq:4},numA:nA,lit:{start:nA,model:nA,ae:nA,dq:nA},done:{start:ag_sine((tt-c.stays-0.3)/1.4)},a:ag_in(tt,c.goal,0.5)});
      mp_tool(cx,"goal",560,740,MD.flow,tt-c.goal,ag_in(tt,c.goal+0.2,0.4));mp_toolName(cx,560,846-12,"Pick a goal",ag_in(tt,c.goal+0.2,0.4));
      mp_tool(cx,"search",960,740,MD.flow,tt-T.word,ag_in(tt,T.word,0.4));mp_toolName(cx,960,846-12,"Search what the films say",ag_in(tt,T.word,0.4));
      {const pa=ag_in(tt,c.stays,0.4);if(pa>0.004){cx.save();cx.globalAlpha*=pa;ag_about(cx,1360,740,lerp(0.6,1,ag_spr(tt-c.stays,0,0.6)));glow(cx,1360,740,96,MD.pass,0.22);cx.beginPath();cx.arc(1360,740,50,0,TAU);cx.strokeStyle=rgba(MD.pass,1);cx.lineWidth=5;cx.stroke();md_icon(cx,"tick",1360,740,52,MD.pass,{lw:4});cx.restore();}}mp_toolName(cx,1360,846-12,"Progress, in your browser",ag_in(tt,c.stays,0.4));}}],0.6);
  setScreen(ctx,S);});

/* ---------------------------------------------------------------- 8 · Start */
const MP_FOUR=[["the organisation",330],["the meaning",750],["the decisions",1170],["the people",1590]];
scene("start",(ctx,S,t,sc)=>{const c=sc.cues,T=mp_once(sc,"T",()=>({four:[wAt(sc,"hard","organisation"),wAt(sc,"hard","meaning"),wAt(sc,"hard","decisions"),wAt(sc,"hard","people")]}));
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"map",keys:MP_CAM,push:0,draw:(cx,tt)=>{const lit={start:ag_io(tt,c.matured,c.hard,0.4)},go=ag_in(tt,c.there,0.3);
      // the platform's station is done; everything else lights, and the next stop is the first of the foundations
      MP_ORDER.slice(1).forEach((id,i)=>{lit[id]=0.7*ag_io(tt,c.hard+0.2+i*0.1,c.there,0.4);});lit.ea=Math.max(lit.ea,go);
      const out=1-ag_in(tt,c.breath,0.8);  // the route leaves as the end card comes
      mp_route(cx,{done:{start:1},lit,a:out});md_tag(cx,300,530,"Start here",{align:"center",col:MD.flow,a:out*ag_in(tt,c.there+0.1,0.3)});
      MP_FOUR.forEach((f,i)=>md_tag(cx,f[1],790,f[0],{align:"center",col:MD.agreed,a:out*ag_in(tt,T.four[i]-0.1,0.35)}));}}],0.6);
  setScreen(ctx,S);md_end(ctx,S,t,c.breath,"More than a platform","The hard part is everything else.","","Start here");});

ag_cutInto(["portal","found","rest","project","dama","doing","start"]);
