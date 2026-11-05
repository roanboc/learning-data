/* ===== Copies that keep the rules: the chapters =====
   Seven chapters. The opening on the hill at Lascaux and on its walls (cp_cave.js), then the hall (cp_pieces.js), where the four
   copies of this autumn are asked for: one room, so the camera never cuts there, and each chapter glides on from the last
   (ag_cutInto); only the closing goes back to the hill. Times come from the voice (wAt), so the pictures follow it if it's recorded
   again. People: Jun Park (chapter 3, then with Mei in chapter 5), Mei Tanaka (chapters 4 and 5), Sam Okafor (chapter 6); Elena Lindgren
   and Anil Kurian are names on cards, as the films before show them, and the hospital's head of education a role. */
DP_PEOPLE.push("jun","mei","sam");
const cp_io=(t,a,b,d)=>ag_in(t,a,d||0.45)*(1-ag_in(t,b==null?1e9:b,d||0.45));
const cp_lin=(t,a,d)=>clamp((t-a)/d,0,1);
// a table of totals: its title (and a line under it), then rows [label, value, colour], lh apart; hi {row: 0 to 1} lights rows
function cp_totals(ctx,x,y,w,title,rows,o){o=o||{};const lh=o.lh||50,top=o.sub?116:78,cols=o.cols||1,per=Math.ceil(rows.length/cols),h=top+per*lh+16,a=o.a==null?1:o.a,bb={x,y,w,h};
  if(a<=0)return bb;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  dp_panel(ctx,x,y,w,h,{col:o.col||"cyan",r:20,behind:o.behind,glowR:36});
  dp_T(ctx,title,x+28,y+50,{w:700,size:30});if(o.sub)dp_T(ctx,o.sub,x+28,y+90,{w:600,size:28,col:o.subCol||"mut"});
  ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(x+22,y+top-8,w-44,1.4);
  const cw=(w-44)/cols;
  rows.forEach((r,i)=>{const col=Math.floor(i/per),j=i%per,rx=x+22+col*cw,by=y+top+j*lh+34,hv=o.hi&&o.hi[i]||0;
    if(hv>0){ctx.save();ctx.globalAlpha*=hv;rr(ctx,rx-6,by-34,cw-8,lh-4,10);ctx.fillStyle=rgba(DP.F.green,0.16);ctx.fill();ctx.strokeStyle=rgba(DP.F.green,0.9);ctx.lineWidth=2;ctx.stroke();ctx.restore();}
    dp_T(ctx,r[0],rx+8,by,{w:600,size:28});dp_T(ctx,r[1],rx+cw-24,by,{w:700,size:28,col:r[2]||"ink",align:"right"});});
  ctx.restore();return bb;}
// a small tag shape, the sign of a governed tag on a column (Tags that travel), its point to the right
function cp_tagMark(ctx,x,y,a){if(a<=0)return;const c=DP.F.cyan;ctx.save();ctx.globalAlpha*=a;ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=8;ctx.beginPath();
  ctx.moveTo(x-18,y-12);ctx.lineTo(x+6,y-12);ctx.lineTo(x+18,y);ctx.lineTo(x+6,y+12);ctx.lineTo(x-18,y+12);ctx.closePath();ctx.fillStyle=rgba(c,1);ctx.fill();
  ctx.shadowBlur=0;ctx.fillStyle=rgba(DP.on,1);ctx.beginPath();ctx.arc(x+4,y,3.4,0,TAU);ctx.fill();ctx.restore();}
// the records behind their glass, painted small and blurred: rows of a table, never readable
function cp_rowsPaint(c){c.fillStyle="rgba(232,236,255,0.9)";for(let r=0;r<9;r++){const y=350+r*38;c.fillRect(812,y,120,12);c.fillRect(952,y,150,12);c.fillRect(1118,y,24,12);}}
// a person who comes and goes, faded whole
function cp_figure(x,who,px,py,s,tt,a,o){withA(x,a,()=>dp_person(x,who,px,py,s,Object.assign({t:tt},o||{})));}
// the learner of Show the least, and a made-up one
const CP_SAMUEL=[["student_number","S-20412","direct"],["name","Samuel Osei","direct"],["date_of_birth","14 May 1987","indirect"],["course","Public health","none"],["results","90 of 120","none"]];
const CP_MADE=[["student_number","S-90017","direct"],["name","Noa Halden","direct"],["date_of_birth","3 March 1999","indirect"],["course","Midwifery","none"],["results","45 of 120","none"]];

/* ---------------------------------------------------------------- 1. A copy to visit: Lascaux, 1948 to 1983 */
scene("cave",(ctx,S,t,sc)=>{const c=sc.cues,A=(id,w,o)=>wAt(sc,id,w,o);
  const tOpen=A("cave","opens"),tWalls=A("cave","walls"),t21=A("cave","twenty-one"),tWarm=A("air","warmth"),tWater=A("air","water"),tCO2=A("air","carbon"),
    tAlgae=A("algae","green algae"),tCrys=A("algae","white crystals"),tCloses=A("closed","closes"),tRebuilt=A("copy","rebuilt"),tPig=A("paint","natural pigments"),
    tL2=A("opens","Lascaux Two"),tTrue=A("opens","true to"),tNone=A("opens","none of it"),tSci=A("rests","scientists"),tHours=A("rests","two hundred"),
    tBuild=A("copies","to build"),tShare=A("copies","to share"),tHome=A("copies","take home"),tHarm=A("copies","harm"),
    tKeeps=A("rules","keeps the protection"),tIsnt=A("rules","isn't made"),tWork=A("rules","the work");
  const sWall=tWalls-0.8,sClose=c.closed-0.6,sPaint=c.paint-0.5,sMil=c.millions-0.5,sRec=c.records-0.3;
  ag_shots(ctx,S,t,sc.dur,[
    // the hill at night, cut away: the cave opens, and its visitors come, each a small warm light
    {at:0,place:"cpHill",keys:[[0,760,600,1.16]],push:0.03,draw:(x,tt)=>{cp_caveLight(x,0.9*ag_in(tt,tOpen-0.3,1.6),{});cp_lamps(x,tt,ag_in(tt,tOpen,1.4),0);}},
    // the painted wall: a thousand a day, their breath, the algae and the crystals, and the paintings dimming
    {at:sWall,place:"cpWall",keys:[[sWall,960,540,1.04]],push:0.035,draw:(x,tt)=>{
      const crowd=ag_in(tt,c.crowd,2),harm=ag_in(tt,tAlgae-0.4,5.2),crust=ag_in(tt,tCrys,2.4),dim=0.6*ag_in(tt,c.lost+0.6,4.5);
      cp_wallLight(x,tt,0.55+0.45*crowd-0.3*ag_in(tt,c.change,2));cp_breath(x,tt,ag_in(tt,c.air,2.2)*(1-0.5*ag_in(tt,c.lost,3)));cp_harm(x,harm,crust);cp_dim(x,dim);
      dp_tag(x,1250,760,"About 21,000 years ago","cyan",{a:cp_io(tt,t21,c.crowd+0.4)});
      dp_card(x,1170,70,620,{kick:"By the late 1950s",title:"More than 1,000 visitors a day"},{a:cp_io(tt,c.crowd+0.2,c.algae-0.4),k:ag_spr(tt,c.crowd+0.2,0.7)});
      for(const [s,tx,ty,t0] of [["Warmth",250,760,tWarm],["Water",560,790,tWater],["Carbon dioxide",840,760,tCO2]])dp_tag(x,tx,ty,s,"grey",{a:cp_io(tt,t0,c.algae+0.6)});
      dp_card(x,1170,70,620,{kick:"1960",title:"Green algae, white crystals"},{col:"coral",a:cp_io(tt,tAlgae-0.2,c.closed-1),k:ag_spr(tt,tAlgae-0.2,0.7)});}},
    // back on the hill: the door shuts, the visitors stop; then the camera glides along the hill to where Lascaux II is built
    {at:sClose,place:"cpHill",keys:[[sClose,520,580,1.5],[c.copy-0.2,1300,560,1.4]],d:2.6,push:0.02,draw:(x,tt)=>{
      cp_caveLight(x,0.9*(1-0.86*ag_in(tt,tCloses+0.4,1.6)),{});cp_lamps(x,tt,1-ag_in(tt,tCloses-0.9,1.2),0);cp_door(x,ag_in(tt,tCloses,1.3));
      cp_copyShell(x,ag_in(tt,tRebuilt-0.2,3.4));
      dp_tag(x,1290,380,"Rebuilt in concrete","cyan",{a:cp_io(tt,tRebuilt+1.6,sPaint+1)});}},
    // Lascaux II's wall: painters copy each animal, stroke by stroke
    {at:sPaint,place:"cpWall2",keys:[[sPaint,960,540,1.04]],push:0.03,draw:(x,tt)=>{cp_wallLight(x,tt,0.8);cp_frieze(x,{p:cp_lin(tt,c.paint+0.2,c.opens+0.6-c.paint)});
      dp_tag(x,250,780,"Natural pigments","grey",{a:cp_io(tt,tPig,c.opens+0.4)});
      dp_card(x,1170,70,620,{kick:"1983",title:"Lascaux II opens"},{a:cp_io(tt,tL2,sMil+1),k:ag_spr(tt,tL2,0.7)});
      dp_tag(x,560,780,"True to the cave","cyan",{a:cp_io(tt,tTrue,sMil+1)});dp_tag(x,1000,780,"None of it is the cave","cyan",{a:cp_io(tt,tNone,sMil+1)});}},
    // the hill again: millions go into the copy; the camera glides to the cave, which rests, a few scientists inside now and then
    {at:sMil,place:"cpHill",keys:[[sMil,960,560,1.0],[c.rests-0.3,540,600,1.45]],d:2.4,push:0.015,draw:(x,tt)=>{
      cp_caveLight(x,0.1+0.12*cp_io(tt,tSci,sRec-0.2,0.8),{});cp_door(x,1);cp_copyShell(x,1);cp_caveLight(x,0.9,{copy:true});cp_lamps(x,tt,1,1);
      const sa=cp_io(tt,tSci,sRec,0.8);if(sa>0){x.save();x.globalCompositeOperation="lighter";for(let i=0;i<3;i++){const px=430+i*130+Math.sin(tt*0.5+i*2)*30,py=660-i*14;
        const g=x.createRadialGradient(px,py,0,px,py,20);g.addColorStop(0,"rgba(255,226,170,"+(0.8*sa).toFixed(3)+")");g.addColorStop(1,"rgba(255,200,120,0)");x.fillStyle=g;x.fillRect(px-20,py-20,40,40);}x.restore();}}},
    // the hall: the learners' records behind frosted glass, and the copies asked of them
    {at:sRec,place:"cpHall",keys:[[sRec,960,540,1.0]],push:0.015,draw:(x,tt)=>{
      const pa=ag_in(tt,c.records,0.8);withA(x,pa,()=>{dp_wall(x,760,300,400,440,{frosted:true,col:"violet",label:"The learners' records"});dp_frost(x,790,330,340,380,cp_rowsPaint,{col:"violet"});});
      const hm=ag_in(tt,tHarm,0.8),kp=ag_in(tt,tKeeps,0.8);
      const C=[["To build with",150,420,[760,470],[150+262,455],tBuild,true],["To share",1330,330,[1160,400],[1330,365],tShare,true],["To take home",1330,600,[1160,640],[1330,635],tHome,false]];
      for(const [s,sx,sy,a0,a1,t0,kept] of C){const a=ag_in(tt,t0,0.5);if(a<=0)continue;dp_link(x,a0,a1,"grey",ag_in(tt,t0,0.6),{dash:[8,10],alpha:0.8,dot:false});
        const ok=kept?kp:0,bad=hm*(1-ok);
        withA(x,a*(1-bad)*(1-ok),()=>dp_slip(x,sx,sy,s,"grey",{ink:true}));withA(x,a*bad,()=>dp_slip(x,sx,sy,s,"coral",{ink:true}));withA(x,a*ok,()=>dp_slip(x,sx,sy,s,"green",{ink:true}));
        const bb=dp_slip(x,sx,sy,s,"grey",{measure:true});
        if(kept){withA(x,ag_in(tt,tKeeps,0.6),()=>dp_lock(x,bb.x+bb.w+40,sy+38,40,"violet",0));dp_tick(x,bb.x+bb.w+96,sy+35,"green",cp_lin(tt,tWork,0.6));}
        else cp_strike(x,bb.x-10,sy+35,bb.x+bb.w+10,sy+35,cp_lin(tt,tIsnt,0.6));}}}
  ]);
  setScreen(ctx,S);cp_day(ctx,t,"Opening story","Lascaux, France, 1948",0.4,c.crowd-0.6);
  dp_card(ctx,1150,80,690,{kick:"1963",title:"Closed to the public",sub:"André Malraux, minister for culture"},{col:"coral",a:cp_io(t,tCloses+0.2,c.copy-0.6),k:ag_spr(t,tCloses+0.2,0.7),behind:"cpHill"});
  dp_card(ctx,1170,80,640,{kick:"Lascaux II, since 1983",title:"About 10 million visitors"},{a:cp_io(t,c.millions+0.2,c.rests+0.2),k:ag_spr(t,c.millions+0.2,0.7),behind:"cpHill"});
  dp_tag(ctx,560,790,"A few scientists, about 200 hours a year","cyan",{a:cp_io(t,tHours-0.4,sRec+0.1),behind:"cpHill"});
  dp_title(ctx,S,t,c.breath,"Copies that keep the rules",null,"FILM 7 OF 8 · ONLY WHAT YOU MAY SEE");});

/* ---------------------------------------------------------------- 2. Where the rules live: in the catalog, not in the records */
scene("home",(ctx,S,t,sc)=>{const c=sc.cues,A=(id,w,o)=>wAt(sc,id,w,o);
  const tClass=A("classes","a class"),tTags=A("classes","Tags that travel"),tTag=A("classes","a tag"),tHides=A("policy","hides each class"),
    tKeeps=A("inside","keeps them"),tAnil=A("inside","Anil"),tLive=A("catalog","the rules live"),tNot=A("catalog","not in the records"),
    tLeaves=A("leave","leaves the catalog"),tNone=A("leave","none of the rules"),tAgr=A("wrote","An agreement first"),tWhere=A("wrote","where the study"),tMay=A("wrote","what may leave"),tFour=A("four","four copies");
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"cpHall",keys:[[0,960,540,1.0]],push:0.015,draw:(x,tt)=>{
    const cat=cp_io(tt,0.3,c.wrote-0.2,0.6),live=cp_io(tt,tLive,c.leave+0.6,0.6);
    withA(x,cat,()=>{dp_wall(x,60,240,1460,620,{col:"cyan",label:"The catalog"});if(live>0)withA(x,live,()=>dp_wall(x,60,240,1460,620,{col:"cyan"}));});
    // the learner's record, as the registrar keeps it: each column a class, each class a tag
    const rec=CP_SAMUEL.map((r,i)=>({c:r[0],v:r[1],cls:r[2],ca:ag_in(tt,tClass+i*0.18,0.4)}));
    // the record dims while the voice says the rules aren't in it, and comes back when a copy is pulled out of it; the rules' cards stay dim
    const recA=cat*(1-0.45*cp_io(tt,tNot,c.leave,0.6)),dimP=1-0.45*ag_in(tt,tNot,0.6);
    const bb=cp_record(x,90,290,{name:"registrar.core.core_learner_v1",rows:rec,w:690,cw:250,a:recA});
    // each class's tag, just left of its chip
    withA(x,recA,()=>{for(let i=0;i<5;i++){const cls=CP_SAMUEL[i][2];if(cls==="none")continue;
        cp_tagMark(x,bb.x+bb.w-28-(dp_tw(x,cls,{w:700,size:28})+36)-30,bb.y+86+i*58+28,ag_in(tt,tTag+i*0.12,0.4));}
      const hl=cp_io(tt,tHides,c.inside+0.4,0.5);if(hl>0){x.save();x.globalAlpha*=hl;rr(x,bb.x+12,bb.y+86,bb.w-24,58*2,10);x.strokeStyle=rgba(DP.F.violet,0.95);x.lineWidth=2.4;x.shadowColor=rgba(DP.F.violet,0.8);x.shadowBlur=12;x.stroke();x.restore();}});
    const s1=dp_slip(x,90,740,"Know what you hold","cyan",{ink:true,a:cp_io(tt,c.classes,c.policy+0.3)});dp_slip(x,s1.x+s1.w+18,740,"Tags that travel","cyan",{ink:true,a:cp_io(tt,tTags,c.policy+0.3)});
    // one policy, by tag
    dp_card(x,800,290,700,{kick:"One policy, by tag",title:"hide_direct: masks it whole"},{a:cat*ag_in(tt,c.policy,0.5)*dimP,k:ag_spr(tt,c.policy,0.7)});
    dp_slip(x,90,740,"One policy for many tables","cyan",{ink:true,a:cp_io(tt,c.policy+0.9,c.inside+1)});
    // the study's copy, made inside and read through the rules: only what Anil may see; it steps aside when a copy leaves
    const st=[["learner_code","a7772705…","pseudonymous"],["name","***","direct"],["date_of_birth","1987","indirect"],["course","Public health","none"],["results","90 of 120","none"]];
    const sA=cat*ag_in(tt,c.inside+0.4,0.5)*dimP*(1-ag_in(tt,c.leave-0.2,0.5));
    const sb=cp_record(x,800,456,{name:"studies.health_progress.learners",rows:st.map(r=>({c:r[0],v:r[1],cls:r[2],vc:r[1]==="***"?"violet":"ink"})),w:700,cw:236,
      a:sA,k:ag_spr(tt,c.inside+0.4,0.7)});
    withA(x,sA*ag_in(tt,tKeeps,0.4),()=>dp_tick(x,sb.x+sb.w-36,sb.y+42,"green",cp_lin(tt,tKeeps,0.6)));
    dp_tag(x,1060,170,"The rules live here: classes and policies","cyan",{a:cp_io(tt,tLive,c.wrote-0.2)});
    dp_tag(x,90,740,"The records: only their values","grey",{a:cp_io(tt,tNot,c.leave+0.4)});
    // a copy that leaves the catalog: pulled out of the record, it slides out of the catalog; there its chips fall away and nothing guards it
    const u=ag_sine(cp_lin(tt,tLeaves-0.4,2.0)),mx=lerp(760,1530,u),fall=ag_in(tt,tLeaves+1.0,0.8),out=ag_in(tt,tLeaves+1.1,0.8);
    const lv=[["S-20412","direct"],["Samuel Osei","direct"]].map(r=>({c:"",v:r[0],cls:r[1],ca:1-fall}));
    withA(x,cp_io(tt,tLeaves-0.4,c.wrote+0.2,0.4),()=>{
      withA(x,1-out,()=>cp_record(x,mx,470,{name:"a copy",rows:lv,w:360,cw:0}));
      withA(x,out,()=>cp_record(x,mx,470,{name:"a copy",rows:lv.map(r=>Object.assign({},r,{ca:0})),w:360,cw:0,col:"coral"}));});
    dp_tag(x,1530,712,"No class, no policy","coral",{a:cp_io(tt,tNone-0.3,c.wrote+0.2)});
    // An agreement first said where the study may work, and what may leave it
    cp_agree(x,410,280,1100,{kind:"Data sharing agreement 2026-14",sub:"For a study in the Faculty of Health",lw:180,
      lines:[["Where","On the platform, in the study's own space; nothing downloaded"],["May leave","Totals, with any count under 10 hidden"]],
      hi:[tt<tMay-0.2?0:1,tt<tMay-0.2?ag_in(tt,tWhere-0.2,0.4):ag_in(tt,tMay-0.2,0.4)],a:cp_io(tt,c.wrote,c.four,0.5),k:ag_spr(tt,c.wrote,0.7)});
    dp_slip(x,410,540,"An agreement first","cyan",{ink:true,a:cp_io(tt,tAgr,c.four)});
    // four copies, asked for this autumn
    const F=[["Jun Park","A copy, to build with",180,300],["The teaching hospital","A table, to share",980,300],["The teaching hospital","An answer from both sides",180,520],["Elena Lindgren","A download, to take home",980,520]];
    F.forEach(([k,ti,fx,fy],i)=>dp_card(x,fx,fy,760,{kick:k,title:ti},{a:ag_in(tt,tFour+i*0.25,0.5),k:ag_spr(tt,tFour+i*0.25,0.7)}));}}]);
  setScreen(ctx,S);cp_day(ctx,t,"At the university, this autumn","Where the rules live",0.3,c.classes-0.4);});

/* ---------------------------------------------------------------- 3. Made up, for building: Jun's change */
scene("madeup",(ctx,S,t,sc)=>{const c=sc.cues,A=(id,w,o)=>wAt(sc,id,w,o);
  const tRefuses=A("clone","refuses"),tReal=A("exempt","every real name"),tNoCls=A("exempt","no column's class"),tPeople=A("masked","real people"),tAsIs=A("masked","as it is"),
    tNone=A("madeup","none of them"),tSize=A("script","For size"),tCols=A("script","columns"),tFewer=A("unit","fewer than ten"),tGiven=A("unit","if nine"),
    tClone=A("never","clone"),tSample=A("never","sample"),tNever=A("never","never used"),tReal2=A("lascaux","not one is real"),tNoRec=A("runs","no record");
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"cpHall",keys:[[0,960,540,1.0]],push:0.015,draw:(x,tt)=>{
    cp_figure(x,"jun",1640,612,0.95,tt,cp_io(tt,c.jun-0.3,sc.dur-1.6,0.7),{flip:true});
    cp_who(x,1500,240,"Jun Park","Analytics engineer",{align:"right",a:cp_io(tt,c.jun+0.4,c.clone)});
    dp_card(x,100,250,900,{kick:"Jun's change",title:"How the faculty's published totals are counted"},{a:cp_io(tt,c.jun+0.6,c.clone),k:ag_spr(tt,c.jun+0.6,0.7)});
    dp_card(x,100,470,900,{kick:"Jun asks",title:"A copy of the learner table, in development",sub:"registrar.core.core_learner_v1"},{a:cp_io(tt,c.ask+0.3,c.clone),k:ag_spr(tt,c.ask+0.3,0.7)});
    // a clone: refused to anyone the policies cover; made by someone they leave out, every value and no class
    const pa=cp_io(tt,c.clone,c.masked,0.5);if(pa>0){const bx=dp_page(x,90,230,1260,330,{tool:"databricks",name:"Azure Databricks",where:"SQL editor",title:"Clone the learner table",a:pa});
      cp_code(x,bx.x,bx.y+40,["CREATE TABLE dev.core_learner_v1","SHALLOW CLONE registrar.core.core_learner_v1"],{a:pa});
      withA(x,pa,()=>{dp_cross(x,bx.x+20,bx.y+128,"coral",cp_lin(tt,tRefuses,0.6));dp_T(x,"Refused: its policies cover Jun",bx.x+56,bx.y+138,{w:700,size:28,col:"coral",a:ag_in(tt,tRefuses,0.4)});});}
    const ea=cp_io(tt,c.exempt,c.masked,0.5);
    cp_record(x,90,590,{name:"dev.core_learner_v1",rows:CP_SAMUEL.slice(0,3).map(r=>({c:r[0],v:r[1]})),w:760,cw:262,col:"coral",a:ea,k:ag_spr(tt,c.exempt,0.7)});
    dp_tag(x,890,600,"Cloned by someone left out","coral",{a:ea});
    dp_tag(x,890,690,"Every real name","coral",{a:ea*ag_in(tt,tReal,0.4)});dp_tag(x,890,780,"No class: no policy matches","coral",{a:ea*ag_in(tt,tNoCls,0.4)});
    // a masked copy: still about real people, and a column nobody has classed goes through as it is
    const ma=cp_io(tt,c.masked,c.madeup,0.5);
    cp_record(x,90,250,{name:"dev.core_learner_masked",w:900,cw:262,a:ma,k:ag_spr(tt,c.masked,0.7),
      rows:[{c:"student_number",v:"***",vc:"violet",cls:"direct"},{c:"name",v:"***",vc:"violet",cls:"direct"},{c:"date_of_birth",v:"1987",cls:"indirect"},{c:"notes",v:"Extra time: anxiety",vc:"coral"}]});
    dp_tag(x,1010,300,"Still about real people","grey",{a:ma*ag_in(tt,tPeople,0.4)});
    dp_tag(x,420,640,"Not classed yet: shown as it is","coral",{a:ma*ag_in(tt,tAsIs,0.4),to:[640,560],p:cp_lin(tt,tAsIs+0.2,0.5)});
    // made-up learners: true to the real ones, and none of them is anyone
    const da=cp_io(tt,c.madeup,c.script+0.2,0.5);
    cp_record(x,90,250,{name:"dev.core_learner_v1",rows:CP_MADE.map(r=>({c:r[0],v:r[1],cls:r[2]})),w:900,cw:262,col:"green",a:da,k:ag_spr(tt,c.madeup,0.7)});
    dp_tag(x,90,680,"Made up: none of them is anyone","green",{a:da*ag_in(tt,tNone,0.4)});
    // the script that writes them, in the registrar's bundle
    const ga=cp_io(tt,c.script+0.2,c.unit,0.5);if(ga>0){const bx=dp_page(x,90,230,1260,420,{tool:"github",name:"GitHub",where:"uni-example/data-platform",title:"registrar/tests/made_up_learners.py",a:ga});
      cp_code(x,bx.x,bx.y+44,["learners = make_learners(2614)","columns  = like(\"core_learner_v1\")","classes  = like(\"core_learner_v1\")"],
        {a:ga,w:1180,hi:tt<tCols?[0,ag_in(tt,tSize,0.4)]:[1,ag_in(tt,tCols,0.4)]});}
    // dbt's unit test, on rows written for it
    const ua=cp_io(tt,c.unit,c.lascaux,0.5);if(ua>0){const bx=dp_page(x,90,230,1260,420,{tool:"dbt",name:"dbt",where:"unit test",title:"small_counts_hidden",a:ua*(1-0.55*ag_in(tt,c.never,0.6))});
      cp_code(x,bx.x,bx.y+44,["model:  left_after_first_year","given:  9 learners leave Midwifery","expect: Midwifery, fewer than 10"],{a:ua*(1-0.55*ag_in(tt,c.never,0.6)),w:1180,hi:[1,ag_in(tt,tGiven,0.4)]});
      withA(x,ua*(1-0.55*ag_in(tt,c.never,0.6)),()=>{dp_tick(x,bx.x+bx.w-170,bx.y+176,"green",cp_lin(tt,tFewer,0.6));dp_T(x,"Passed",bx.x+bx.w-136,bx.y+186,{w:700,size:28,col:"green",a:ag_in(tt,tFewer+0.3,0.4)});});
      for(const [s,px,t0] of [["dbt clone",120,tClone],["dbt build --sample",440,tSample]]){const w=dp_pill(x,px,738,s,"grey",{a:ua*ag_in(tt,t0,0.4)});
        withA(x,ua,()=>cp_strike(x,px-8,726,px+w+8,726,cp_lin(tt,tNever,0.6)));}}
    // Like Lascaux II
    const la=cp_io(tt,c.lascaux,sc.dur-1.0,0.5);
    cp_thumb(x,120,250,560,315,"cpWall2",{label:"Lascaux II",a:la,draw:(cx)=>{cp_wallLight(cx,tt,0.8);cp_frieze(cx,{p:1});}});
    cp_record(x,740,250,{name:"dev.core_learner_v1",rows:CP_MADE.slice(1,4).map(r=>({c:r[0],v:r[1],cls:r[2]})),w:640,cw:250,col:"green",a:la});
    dp_tag(x,740,560,"Not one is real","green",{a:la*ag_in(tt,tReal2,0.4)});
    dp_card(x,120,670,900,{kick:"Jun's change",title:"Runs on 2,614 made-up learners"},{col:"green",a:cp_io(tt,c.runs+0.2,sc.dur-1.0),k:ag_spr(tt,c.runs+0.2,0.7)});
    dp_tag(x,1060,700,"No record leaves production","green",{a:cp_io(tt,tNoRec,sc.dur-1.0)});}}]);
  setScreen(ctx,S);cp_day(ctx,t,"Monday, 19 October","Made up, for building",0.3,c.jun+0.2);});

/* ---------------------------------------------------------------- 4. Protected before it leaves: a share with the hospital */
scene("share",(ctx,S,t,sc)=>{const c=sc.cues,A=(id,w,o)=>wAt(sc,id,w,o);
  const tSigned=A("agreement","signed"),tMkt=A("opensharing","The marketplace"),tTravel=A("travel","travel"),tLeft=A("why","left out"),tOwn=A("why","its own platform"),
    tEvery=A("every","every name"),tShow=A("totals","Show the least"),tSmall=A("totals","small counts"),tNoEnd=A("ends","no end date"),tJob=A("ends","a job");
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"cpHall",keys:[[0,960,540,1.0]],push:0.015,draw:(x,tt)=>{
    cp_figure(x,"mei",270,612,0.95,tt,cp_io(tt,c.agreement-0.3,sc.dur-1.6,0.7));
    cp_who(x,80,200,"Mei Tanaka","Registrar's office",{a:cp_io(tt,c.agreement+0.3,c.opensharing)});
    cp_hospital(x,1550,220,{a:ag_in(tt,c.hospital,0.5),k:ag_spr(tt,c.hospital,0.7)});
    dp_card(x,500,250,1020,{kick:"The hospital asks",title:"How many leave after first year, by course?",sub:"To plan its places"},{a:cp_io(tt,c.hospital+0.4,c.agreement),k:ag_spr(tt,c.hospital+0.4,0.7)});
    cp_agree(x,500,226,1020,{kind:"Data sharing agreement 2026-21",sub:"For the teaching hospital",lw:180,
      lines:[["Purpose","To plan placements: how many learners leave after first year, by course, and whether more weeks on the wards help them do better"],["May leave","Totals, with any count under 10 hidden"],["Ends","30 June 2027"],
        ["Signed","Mei Tanaka, for the registrar's office, and the hospital's head of education, 16 November 2026"]],hi:[3,ag_in(tt,tSigned,0.4)],
      a:cp_io(tt,c.agreement+0.4,c.opensharing),k:ag_spr(tt,c.agreement+0.4,0.7)});
    // the share: Databricks to Databricks; what it holds
    const pa=ag_in(tt,c.opensharing,0.5);if(pa>0){const bx=dp_page(x,500,220,1020,370,{tool:"databricks",name:"Azure Databricks",where:"OpenSharing",title:"Share: health_totals_for_hospital",a:pa});
      withA(x,pa,()=>{dp_T(x,"Recipient",bx.x,bx.y+40,{w:700,size:28,col:"mut"});dp_T(x,"teaching_hospital",bx.x+170,bx.y+40,{w:500,size:28,f:"mono"});
        dp_T(x,"Databricks to Databricks",bx.x+bx.w,bx.y+40,{w:600,size:28,col:"mut",align:"right"});
        const ta=ag_in(tt,c.every,0.5);if(ta>0){dp_T(x,"Table",bx.x,bx.y+104,{w:700,size:28,col:"mut",a:ta});const sw=ag_in(tt,c.totals,0.6);
          dp_T(x,"registrar.core.core_learner_v1",bx.x+170,bx.y+104,{w:500,size:28,f:"mono",col:"coral",a:ta*(1-sw)});dp_cross(x,bx.x+bx.w-24,bx.y+94,"coral",cp_lin(tt,tEvery,0.5)*(1-sw));
          dp_T(x,"registrar.published.left_after_first_year",bx.x+170,bx.y+104,{w:500,size:28,f:"mono",a:sw});dp_tick(x,bx.x+bx.w-24,bx.y+94,"green",cp_lin(tt,tSmall,0.6));}});}
    dp_slip(x,1550,560,"The marketplace","cyan",{ink:true,a:cp_io(tt,tMkt,c.travel+1)});
    dp_tag(x,500,640,"The policies don't travel with it","coral",{a:cp_io(tt,tTravel,c.every)});
    dp_tag(x,500,722,"Its owner is left out of them","grey",{a:cp_io(tt,tLeft,c.every)});
    dp_tag(x,500,804,"Read on the hospital's platform","grey",{a:cp_io(tt,tOwn,c.every)});
    dp_tag(x,500,640,"Every name, if the learner table went","coral",{a:cp_io(tt,tEvery,c.totals)});
    // the totals, Show the least's: small counts hidden, and the one that would give them away
    cp_totals(x,500,624,1020,"Left after first year, by course",[["Nursing","38"],["Midwifery","fewer than 10","violet"],["Public health","21"],["Health sciences","hidden","violet"],["Faculty of Health","80"]],
      {cols:2,a:cp_io(tt,c.totals+0.3,c.ends),k:ag_spr(tt,c.totals+0.3,0.7)});
    dp_slip(x,1550,560,"Show the least","cyan",{ink:true,a:cp_io(tt,tShow,c.ends)});
    dp_tag(x,500,640,"A share has no end date","grey",{a:cp_io(tt,tNoEnd,tJob-0.3)});
    dp_card(x,500,624,1020,{kick:"A job, made from agreement 2026-21",title:"Removes the hospital's access on 30 June 2027"},{a:ag_in(tt,tJob+0.1,0.5),k:ag_spr(tt,tJob+0.1,0.7)});}}]);
  setScreen(ctx,S);cp_day(ctx,t,"Monday, 2 November","Protected before it leaves",0.3,c.hospital+2.2);});

/* ---------------------------------------------------------------- 5. A room for both: the clean room */
scene("room",(ctx,S,t,sc)=>{const c=sc.cues,A=(id,w,o)=>wAt(sc,id,w,o);
  const tNeither=A("both","neither"),tNames=A("cleanroom","only their columns"),tShelf=A("view","a shelf"),tMatch=A("code","matches"),tCounts=A("code","counts"),
    tApp=A("approve","she approves"),tHides=A("hides","hides nothing"),tUnder=A("hides","under ten"),tTable=A("runs","one table"),tDays=A("runs","thirty days"),
    t12=A("answer","Twelve weeks"),t47=A("answer","four to seven");
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"cpHall",keys:[[0,960,540,1.0]],push:0.015,draw:(x,tt)=>{
    const lasc=ag_in(tt,c.lascaux,0.7);
    cp_hospital(x,1550,220,{a:1-0.6*lasc});
    dp_card(x,500,250,1020,{kick:"The hospital asks",title:"Do learners who spend more weeks on its wards do better that year?",sub:"Agreement 2026-21 covers it too"},{a:cp_io(tt,0.6,c.cleanroom),k:ag_spr(tt,0.6,0.7)});
    // each side's rows, which neither may hand to the other
    for(const [k,ti,hx,t0] of [["The university","Each learner's results",500,A("both","the university's results")],["The hospital","Weeks on its wards",1030,A("both","the hospital's weeks")]]){
      const a=cp_io(tt,t0,c.cleanroom,0.5);if(a<=0)continue;const bb=dp_card(x,hx,500,490,{kick:k,title:ti},{a,k:ag_spr(tt,t0,0.7)});
      withA(x,a,()=>{dp_frost(x,hx+24,bb.y+bb.h+16,442,110,null,{r:12});dp_lock(x,hx+245,bb.y+bb.h+76,46,"violet",0);});}
    withA(x,cp_io(tt,tNeither,c.cleanroom,0.4),()=>{dp_link(x,[990,705],[1030,705],"coral",1,{dot:false});dp_cross(x,1010,705,"coral",cp_lin(tt,tNeither,0.5));});
    // the clean room: each side sees only the other's columns' names; the approved notebook; who approved it
    const ra=ag_in(tt,c.cleanroom,0.6)*(1-0.8*lasc);if(ra>0){const bx=dp_page(x,500,210,1020,590,{tool:"databricks",name:"Azure Databricks",where:"Clean Rooms · health_placements",a:ra});
      withA(x,ra,()=>{
        cp_cols(x,bx.x,bx.y+6,470,{name:"The university",sub:"health_learner_results",cols:["student_number","course","result"],a:ag_in(tt,c.view,0.5),k:ag_spr(tt,c.view,0.7)});
        cp_cols(x,bx.x+486,bx.y+6,470,{name:"The hospital",sub:"weeks_on_wards",cols:["student_number","ward","weeks"],a:ag_in(tt,c.cleanroom+0.8,0.5)});
        const na=ag_in(tt,c.code,0.5);if(na>0){const ny=bx.y+272;withA(x,na,()=>{dp_panel(x,bx.x,ny,956,200,{col:"cyan",r:18,glowR:28});
          dp_T(x,"NOTEBOOK",bx.x+26,ny+44,{w:800,size:28,ls:4,col:"cyan"});dp_T(x,"weeks_and_progress",bx.x+214,ny+44,{w:500,size:28,f:"mono"});
          cp_code(x,bx.x+26,ny+92,["join the two on student_number","count who passed, by weeks on the wards","hide any count under 10"],
            {w:904,lh:42,hi:tt<tCounts?[0,ag_in(tt,tMatch,0.4)]:tt<c.hides?[1,ag_in(tt,tCounts,0.4)]:[2,ag_in(tt,tUnder,0.4)]});
          dp_pill(x,bx.x+930,ny+44,"Approved, 1 December","green",{align:"right",a:ag_in(tt,tApp,0.5)});});}});}
    dp_tag(x,500,812,"Columns' names only","cyan",{a:cp_io(tt,tNames,c.view)});
    dp_tag(x,500,812,"registrar.rooms: a shelf no one reads","grey",{a:cp_io(tt,tShelf,c.code)});
    dp_tag(x,500,812,"Hides nothing by itself","coral",{a:cp_io(tt,tHides,c.runs)});
    dp_tag(x,500,812,"Run by the hospital, 3 December","cyan",{a:cp_io(tt,c.runs+0.3,c.lascaux)});
    // Jun reads it with Mei; she approves
    const pp=cp_io(tt,c.approve-0.3,c.lascaux-0.2,0.7);cp_figure(x,"jun",345,684,0.79,tt,pp);cp_figure(x,"mei",130,672,0.82,tt,pp);
    // what comes out: one table of totals, to the hospital, kept 30 days
    cp_totals(x,1530,540,350,"Passed, by weeks",[["Under 4","hidden","violet"],["4 to 7","84 in 100"],["8 to 11","89 in 100"],["12 or more","91 in 100"]],
      {lh:46,sub:"Kept 30 days",subCol:tt<tDays?"mut":"cyan",a:ag_in(tt,tTable,0.5)*(1-0.6*lasc),k:ag_spr(tt,tTable,0.7),hi:{3:cp_io(tt,t12,c.lascaux),1:cp_io(tt,t47,c.lascaux)}});
    // like the scientists at Lascaux: what goes in is approved, and the walls never leave
    cp_thumb(x,560,250,720,405,"cpHill",{view:[150,380,880,495],label:"Lascaux",a:cp_io(tt,c.lascaux,sc.dur-0.9,0.6),
      draw:(cx)=>{cp_caveLight(cx,0.3,{});cp_door(cx,1);cx.save();cx.globalCompositeOperation="lighter";for(let i=0;i<3;i++){const px=430+i*130+Math.sin(tt*0.5+i*2)*30,py=660-i*14;
        const g=cx.createRadialGradient(px,py,0,px,py,20);g.addColorStop(0,"rgba(255,226,170,0.8)");g.addColorStop(1,"rgba(255,200,120,0)");cx.fillStyle=g;cx.fillRect(px-20,py-20,40,40);}cx.restore();}});}}]);
  setScreen(ctx,S);cp_day(ctx,t,"From 16 November","A room for both",0.3,c.both-0.2);});

/* ---------------------------------------------------------------- 6. No other way out: Elena's download */
scene("out",(ctx,S,t,sc)=>{const c=sc.cues,A=(id,w,o)=>wAt(sc,id,w,o);
  const tLaptop=A("file","a file on a laptop"),tNoRules=A("file","no rules"),tNothing=A("file","nothing is downloaded"),tGrants=A("switches","Grants by design"),tOff=A("switches","switched off"),
    tDR=A("ways","Downloading results"),tEN=A("ways","exporting notebooks"),tCT=A("ways","copying a table"),tDF=A("ways","downloading a file"),
    tRev=A("code","reviewed change"),tAudit=A("code","audit log"),tNSK=A("network","Network, storage and keys"),tPhoto=A("photo","photo"),tConf=A("photo","confidentiality"),tWhere=A("clean","where it is");
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"cpHall",keys:[[0,960,540,1.0]],push:0.015,draw:(x,tt)=>{
    cp_figure(x,"sam",1650,612,0.95,tt,cp_io(tt,c.switches-0.3,sc.dur-1.6,0.7),{flip:true});
    cp_who(x,1510,240,"Sam Okafor","Data platform",{align:"right",a:cp_io(tt,c.switches+0.4,c.code)});
    const ea=cp_io(tt,c.elena,c.switches,0.5);
    cp_person(x,100,240,"Elena Lindgren","Research assistant, Anil's study",{w:680,a:ea,k:ag_spr(tt,c.elena,0.7)});
    dp_card(x,100,440,680,{kick:"Elena asks",title:"To download the study's table",sub:"To clean it in a spreadsheet"},{a:ea*ag_in(tt,c.elena+1.4,0.5),k:ag_spr(tt,c.elena+1.4,0.7)});
    cp_laptop(x,1110,470,"learners.csv",{a:ea*ag_in(tt,tLaptop,0.5),k:ag_spr(tt,tLaptop,0.7)});
    dp_tag(x,930,560,"Keeps no rules at all","coral",{a:ea*ag_in(tt,tNoRules,0.4)});
    cp_agree(x,100,654,1300,{kind:"Data sharing agreement 2026-14",lw:140,lines:[["Where","On the platform, in the study's own space; nothing downloaded"]],hi:[0,ag_in(tt,tNothing,0.4)],a:ea*ag_in(tt,tNothing-0.3,0.5)});
    // the studies' workspace: every way out switched off
    const sa=cp_io(tt,c.switches+0.2,c.code,0.5);if(sa>0){const bx=dp_page(x,90,210,1140,660,{tool:"databricks",name:"Azure Databricks",where:"Settings › Security",title:"Workspace: studies",a:sa});
      const R=[["Notebook results download",tDR],["SQL results download",tDR+0.3],["Notebook exporting",tEN],["Results table clipboard features",tCT],["Volume files download",tDF],["MLflow run artifact download",tDF+0.4]];
      withA(x,sa,()=>R.forEach(([s,t0],i)=>{const ry=bx.y+18+i*68;dp_switch(x,bx.x,ry,0,{label:s,a:ag_in(tt,c.switches+0.4+i*0.12,0.4)});
        dp_cross(x,bx.x+bx.w-24,ry+20,"coral",cp_lin(tt,t0,0.5));}));
      dp_slip(x,90,124,"Grants by design","cyan",{ink:true,a:sa*ag_in(tt,tGrants,0.4)});dp_pill(x,1200,354,"All off","coral",{align:"right",a:sa*ag_in(tt,tOff,0.4)});}
    // kept as code, changed only by a reviewed change, seen in the audit log
    const ga=cp_io(tt,c.code,c.network,0.5);if(ga>0){const bx=dp_page(x,90,210,1140,470,{tool:"github",name:"GitHub",where:"uni-example/data-platform",title:"platform/workspaces/studies.yml",a:ga});
      cp_code(x,bx.x,bx.y+40,["studies:","  enableResultsDownloading: false","  enableExportNotebook: false","  enableNotebookTableClipboard: false"],{a:ga});
      dp_slip(x,90,712,"A reviewed change","green",{ink:true,a:ga*ag_in(tt,tRev,0.4)});dp_slip(x,450,712,"Shown in the audit log","cyan",{ink:true,a:ga*ag_in(tt,tAudit,0.4)});}
    // and no other door: the network
    const na=cp_io(tt,c.network,c.photo,0.5);
    dp_card(x,100,260,1120,{kick:"Network policy, studies",title:"Reaches only the catalog's storage, and a short list"},{a:na,k:ag_spr(tt,c.network,0.7)});
    dp_slip(x,100,520,"Network, storage and keys","cyan",{ink:true,a:na*ag_in(tt,tNSK,0.4)});
    // a photo of a screen: no switch stops it; her confidentiality agreement covers it
    const ca=cp_io(tt,c.photo,c.clean,0.5);
    cp_phone(x,300,470,{a:ca*ag_in(tt,Math.min(tPhoto,c.photo+0.3),0.4),flash:cp_io(tt,tPhoto+0.3,tPhoto+0.9,0.25)});
    cp_agree(x,520,226,880,{kind:"Confidentiality agreement",sub:"Elena Lindgren",lw:0,lines:[["","I keep what I see to myself"],["","I use it only for the work it's given for"],["","I keep no copy where it isn't allowed"],
      ["","I answer for the data I'm given"],["","I report anything that goes wrong, at once"],["","It holds after I leave"]],hi:[2,ag_in(tt,tConf,0.4)],a:ca*ag_in(tt,tConf-0.6,0.5),k:ag_spr(tt,tConf-0.6,0.7)});
    // so she cleans it where it is
    const la=cp_io(tt,c.clean,c.lascaux,0.5);if(la>0){const bx=dp_page(x,90,230,1140,380,{tool:"databricks",name:"Azure Databricks",where:"Workspace: studies · notebook",title:"Cleaning the study's table",a:la});
      cp_code(x,bx.x,bx.y+40,["learners = spark.table(\"studies.health_progress.learners\")","cleaned  = learners.dropDuplicates([\"learner_code\"])"],{a:la});
      withA(x,la,()=>{dp_tick(x,bx.x+20,bx.y+150,"green",cp_lin(tt,tWhere,0.6));dp_T(x,"Cleaned where it is, in the study's space",bx.x+56,bx.y+160,{w:700,size:28,col:"green",a:ag_in(tt,tWhere,0.4)});});}
    cp_person(x,100,650,"Elena Lindgren","Research assistant, Anil's study",{w:680,a:cp_io(tt,c.clean+0.3,c.lascaux,0.5)});
    // as at Lascaux, nobody takes a piece of the wall home
    cp_thumb(x,300,250,720,405,"cpHill",{view:[60,330,880,495],label:"Lascaux",a:cp_io(tt,c.lascaux,sc.dur-0.9,0.6),draw:(cx)=>{cp_caveLight(cx,0.18,{});cp_door(cx,1);}});}}]);
  setScreen(ctx,S);cp_day(ctx,t,"Tuesday, 10 November","No other way out",0.3,c.elena+1.0);});

/* ---------------------------------------------------------------- 7. Every copy, kept: the hill, the four copies, the idea */
scene("kept",(ctx,S,t,sc)=>{const c=sc.cues,A=(id,w,o)=>wAt(sc,id,w,o);
  const tJun=A("each","Jun got"),tHosp=A("each","the hospital"),tRoom=A("each","clean room"),tNever=A("each","never made");
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,place:"cpHill",keys:[[0,960,560,1.0]],push:0.03,draw:(x,tt)=>{cp_caveLight(x,0.1,{});cp_door(x,1);cp_copyShell(x,1);cp_caveLight(x,0.9,{copy:true});cp_lamps(x,tt,1,1);}},
    {at:c.four-0.4,place:"cpHall",keys:[[c.four-0.4,960,540,1.0]],push:0.015,draw:(x,tt)=>{const out=1-ag_in(tt,c.idea-0.2,0.6);
      const F=[["Jun Park","Made-up learners",180,300,tJun,1],["The teaching hospital","Its totals, small counts hidden",980,300,tHosp,1],
        ["The teaching hospital","One answer, from a clean room",180,520,tRoom,1],["Elena Lindgren","A download",980,520,tNever,0]];
      F.forEach(([k,ti,fx,fy,t0,ok],i)=>{const a=ag_in(tt,c.four+i*0.25,0.5)*out;const bb=dp_card(x,fx,fy,760,{kick:k,title:ti},{a,k:ag_spr(tt,c.four+i*0.25,0.7),col:ok?"cyan":"cyan"});
        withA(x,a,()=>{if(ok)dp_tick(x,bb.x+bb.w-44,bb.y+44,"green",cp_lin(tt,t0,0.6));else{cp_strike(x,bb.x+24,bb.y+bb.h-40,bb.x+bb.w-24,bb.y+40,cp_lin(tt,t0,0.6));
          dp_pill(x,bb.x+bb.w-30,bb.y+bb.h-28,"Never made","coral",{align:"right",a:ag_in(tt,t0+0.3,0.4)});}});});}}]);
  setScreen(ctx,S);
  dp_end(ctx,S,t,c.breath,"Copies that keep the rules","Every copy keeps the protection, or isn't made.","Film 7 of 8","Only what you may see");
  // the idea, in the end card's own place: drawn over its veil until the end card's line has come in, so it never dims or shows twice
  const tA=ag_in(t,c.breath+0.6,0.9);withA(ctx,ag_in(t,c.idea,0.7)*(1-tA),()=>dp_T(ctx,"Every copy keeps the protection, or isn't made.",960,360,{w:700,size:48,align:"center"}));});

ag_cutInto(["home","madeup","share","room","out"]);
