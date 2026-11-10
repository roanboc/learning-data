/* ===== One policy for many tables: the scenes =====
   Seven chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once (the
   road and the book in op_road.js, the hall in op_catalog.js); what moves is drawn live in the shots of ag_shots. The opening cuts
   between the road and the book, and from the road into the hall on a shared shape: the guide's card and the policy's card take one
   box (OP_GUIDECARD). In the hall the camera glides and only what changes fades: a chapter that keeps the catalog's pane draws it at the
   join exactly as the chapter before leaves it, and one that begins somewhere new in the hall opens on a later moment (later: true), so
   what was there leaves first. Inside a chapter, a page or a card leaves before the next comes in where it was. People stand with their
   arms down; the firefighter's hand is only on the guidebook. Cards are never over a person. People's time (their breathing) runs on the
   film's clock, so a person who stays across a join breathes on. */

DP_PEOPLE.push([OP_CREW,"lamp"],"mei","sam","jun");

const op_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a card that springs in at t0 and goes at t1 (or stays): its k (scale) and a (opacity)
const op_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// a phase from 0 to 1 over d seconds from t0, eased
const op_ph=(t,t0,d)=>ag_sine(clamp((t-t0)/(d||1),0,1));
const OP_TITLE="One policy for many tables",OP_WARM=[255,214,160],OP_BROWN=[150,60,20];
// kickers that change: each in its own time, the last gone before the next comes in ([text, in, out])
function op_kickers(ctx,t,list){for(const [s,t0,t1] of list){const a=t1==null?ag_in(t,t0,0.5):ag_io(t,t0,t1,0.4);if(a>0.003)dp_kicker(ctx,s,null,{a});}}
// a slip whose right edge is at x
function op_slipR(ctx,x,y,text,col,o){const b=dp_slip(ctx,0,y,text,col,Object.assign({},o,{measure:true}));return dp_slip(ctx,x-b.w,y,text,col,o);}
// a person on the film's clock (sc.start + tt), so their breathing runs on across a join
const op_T=(sc,tt)=>(sc.start||0)+tt;

/* ---------------------------------------------------------------- 1 · A page for each: the road at night, the book, the hall */
// the firefighter at the left, in the work light: arms down, then the guide in the near hand (the thin grey book of the 1970s, which
// turns into the orange one of 1980 on "changed")
function op_crew(x,tt,T,P){const g0=P.guide-0.45,u=op_ph(tt,P.changed,1.0),a=ag_in(tt,P.fire-0.2,0.7);if(a<=0.003)return;
  const book=(c,h)=>{c.save();c.globalAlpha*=clamp((tt-g0)/0.3,0,1);op_heldBook(c,h,u);c.restore();};
  const o=tt<g0?{}:tt<g0+0.45?{pose:"hang",pose2:"hold",mix:op_ph(tt,g0,0.45),hold:book}:{pose:"hold",hold:book};
  withA(x,a,()=>dp_person(x,OP_CREW,470,650,0.92,Object.assign({t:T,light:"lamp",gaze:[3,1]},o)));}
// the road in the 1970s: the stain spreads; the guide's card (a page for each, then the tabs that run out); the cab's papers in the
// light; the spray, the cloud lifting towards the houses, and both gone on "Something had to change"
function op_road70(x,tt,T,P){op_stain(x,op_ph(tt,3.2,9));
  op_spray(x,T,op_ph(tt,P.spray,1.1),1-ag_in(tt,P.change-0.3,0.8));
  op_cloud(x,op_ph(tt,P.poison-0.3,6.5),(1-ag_in(tt,P.change,1.4))*ag_in(tt,P.poison-0.3,0.8));
  const hw=ag_io(tt,P.families-0.2,P.change+0.2,0.6);if(hw>0)for(const [hx,hy] of [[1495,562],[1665,572],[1830,546]])dp_halo(x,hx,hy,120,OP_WARM,0.24*hw);
  const pa=ag_io(tt,P.papers-0.2,P.none-0.4,0.5);if(pa>0)dp_halo(x,1500,640,80,OP_WARM,0.55*pa);
  op_crew(x,tt,T,P);
  const g=op_pop(tt,P.guide+0.1,P.find-0.1);op_oldGuide(x,700,130,{a:g.a,k:g.k});
  const n=op_pop(tt,P.none+1.2,P.wrong-0.4);op_oldGuide(x,700,130,{a:n.a,k:n.k,more:op_ph(tt,P.none+1.4,1.6)});}
// the book in 1980: lines that behave alike run to one guide; the column of numbers; a new line slips in; the page turns to Guide 111;
// then the words go and today's book is a card
const OP_SLIP1754={id:"1754",guide:"137",name:"Chlorosulfonic acid"};
function op_book1(x,tt,P){const sl=Object.assign({p:op_ph(tt,P.oneLine-0.4,1.6)},OP_SLIP1754),off=1-ag_in(tt,P.unknown-0.5,0.4),words=1-ag_in(tt,P.canada-0.9,0.5),lit={};
  const three=["1809","1830","1836"],dim=lerp(1,0.45,ag_in(tt,P.numW,0.5));
  three.forEach((id,i)=>{lit[id]=ag_in(tt,P.alike+i*0.3,0.35)*off*(id==="1830"?1:dim);});lit["1754"]=ag_in(tt,P.its-0.2,0.35)*off;
  op_yellow(x,{lit,slip:sl,a:words});
  // the column of numbers, outlined
  const col=ag_io(tt,P.numW-0.1,P.oneLine-0.6,0.4)*words;if(col>0){x.save();x.globalAlpha*=col;x.strokeStyle=rgba(OP_BROWN,0.9);x.lineWidth=3;rr(x,184,272,110,476,12);x.stroke();x.restore();}
  // the lines of light from each line to its guide's number
  if(words>0){x.save();x.globalAlpha*=words;three.forEach((id,i)=>{const p=op_ph(tt,P.alike+i*0.3+0.15,0.6)*off;if(p>0)dp_link(x,op_rowAt(id,sl),OP_GUIDEAT,OP_BROWN,p,{lw:3*(id==="1830"?1:dim),alpha:id==="1830"?1:dim});});
    const p2=op_ph(tt,P.its,0.6)*off;if(p2>0)dp_link(x,op_rowAt("1754",sl),OP_GUIDEAT,OP_BROWN,p2,{lw:3});x.restore();}
  // the guide's page: Guide 137 comes in as the lines reach it; on "Guide", the page turns to 111
  const u=clamp((tt-(P.g111-0.3))/1.2,0,1);x.save();x.globalAlpha*=words;
  if(u<=0){const ga=ag_in(tt,P.shareW-0.3,0.5);if(ga>0){op_guide(x,"137",{a:ga});const gl=ag_io(tt,P.once-0.2,P.number,0.4);if(gl>0){x.save();x.globalAlpha*=gl*0.5;x.fillStyle="rgba(255,240,210,0.6)";rr(x,1020,334,730,70,10);x.fill();x.restore();}}}
  else if(u<1)op_turn(x,"137","111",u);else{op_guide(x,"111",{});const ev=ag_in(tt,P.every-0.2,0.5);if(ev>0){x.save();x.globalAlpha*=ev*0.45;x.fillStyle="rgba(255,240,210,0.6)";rr(x,1020,420,730,272,12);x.fill();x.restore();}}
  x.restore();
  // today's book as a card, over the book dimmed: the pages are too bright for words of ice to stand out on
  const dk=ag_in(tt,P.canada-0.8,0.6);if(dk>0){x.save();x.globalAlpha*=0.62*dk;x.fillStyle="rgb(8,8,8)";x.fillRect(0,0,W,H);x.restore();}
  // as the book is printed today: its guide numbers and pages
  op_slipR(x,1800,20,"As the book is printed today","grey",{ink:true,behind:"opBook",size:28});
  const c=op_pop(tt,P.canada-0.3,null);dp_card(x,560,330,800,{kick:"Today's book",title:"62 guides · nearly 2,000 numbers",sub:"Canada · United States · Mexico"},{col:OP_WARM,k:c.k,a:c.a,behind:false});}
// the road today: the panel on the tank, read through binoculars from upwind; the guide's card says what to do and how far back to keep
// people
function op_roadNow(x,tt,P){op_stain(x,1);op_panel(x,1016,618,1);
  op_wind(x,80,250,op_ph(tt,P.fromUp-0.2,1.0),ag_in(tt,P.fromUp-0.2,0.4));
  op_binoculars(x,560,330,190,op_ph(tt,P.binoc-0.2,0.9),c=>{c.save();c.translate(560,330);c.scale(2.6,2.6);c.translate(-1080,-650);op_panel(c,1016,618,1);c.restore();});
  const g=op_pop(tt,P.what-0.3,null);op_guideCard(x,{a:g.a,k:g.k,p1:ag_in(tt,P.what+0.2,0.5),p2:ag_in(tt,P.far-0.1,0.5)});}
/* the hall: a small table card, its personal line with a slot for its mask (by hand, a violet bar drawn across; by the policy, violet
   frost), the class's pill at its top, and a coral slot where nothing protects it */
function op_tile(ctx,x,y,o){o=o||{};const w=220,h=200,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,x,y,w,h,{col:"cyan",r:18,behind:"opHall",glowR:28});
  ctx.fillStyle=rgba(DP.F.cyan,0.45);ctx.fillRect(x+20,y+80,w-40,2);
  for(const ly of [y+112,y+176]){ctx.fillStyle=rgba([160,196,200],0.4);ctx.fillRect(x+44,ly-4,w-70,8);}
  const ly=y+144,sx=x+44,sw=w-64;ctx.fillStyle=rgba(DP.F.violet,0.95);ctx.beginPath();ctx.arc(x+26,ly,6,0,TAU);ctx.fill();
  const fr=clamp(o.frost||0,0,1),bare=clamp(o.bare||0,0,1);
  if(fr<1){ctx.save();ctx.strokeStyle=rgba(mix(DP.T.mut,DP.F.coral,bare),0.55+0.4*bare);ctx.setLineDash([8,6]);ctx.lineWidth=2+bare;rr(ctx,sx,ly-16,sw,32,8);ctx.stroke();ctx.restore();
    ctx.fillStyle=rgba([210,230,232],0.55);ctx.fillRect(sx+12,ly-4,sw-24,8);}
  const hd=clamp(o.hand||0,0,1);if(hd>0){ctx.fillStyle=rgba(DP.F.violet,0.9);ctx.fillRect(sx+4,ly-9,(sw-8)*ag_eo(hd),18);}
  if(fr>0){ctx.save();ctx.globalAlpha*=fr;dp_frost(ctx,sx,ly-16,sw,32,null,{col:"violet",r:8,behind:"opHall"});
    const g=clamp(o.glow||0,0,1);if(g>0){ctx.fillStyle=rgba([236,228,255],0.55*g);rr(ctx,sx,ly-16,sw,32,8);ctx.fill();}ctx.restore();}
  if(o.pill>0){ctx.save();ctx.globalAlpha*=clamp(o.pill,0,1);ag_about(ctx,x+88,y+40,lerp(1.4,1,ag_eo(clamp(o.pill,0,1))));op_class(ctx,x+20,y+58,"direct");ctx.restore();}
  ctx.restore();}
function op_hall1(x,tt,P){const ho=1-ag_in(tt,P.title-0.3,0.5);if(ho<=0)return;x.save();x.globalAlpha*=ho;op_hall1in(x,tt,P);x.restore();}
function op_hall1in(x,tt,P){const [gx,gy,gw,gh]=OP_GUIDECARD,pa=ag_in(tt,P.policy-0.3,0.6);
  // the policy's card: an empty slot where the guide's card was, until one policy is written in it
  if(pa<1){x.save();x.globalAlpha*=1-pa;x.strokeStyle=rgba(DP.F.cyan,0.75);x.setLineDash([14,10]);x.lineWidth=2.4;rr(x,gx,gy,gw,gh,20);x.stroke();x.restore();}
  dp_panel(x,gx,gy,gw,gh,{col:"cyan",r:20,behind:"opHall",a:pa});
  withA(x,ag_in(tt,P.policy-0.1,0.6),()=>{dp_T(x,"ONE POLICY",gx+40,gy+74,{w:700,size:28,ls:4,col:"cyan"});dp_T(x,"For each class,",gx+40,gy+164,{w:700,size:44});dp_T(x,"written once",gx+40,gy+224,{w:700,size:44});});
  for(let i=0;i<7;i++){const x0=120+i*250,y0=540;let a,dx=0;
    if(i<5)a=ag_in(tt,P.same+0.15+i*0.12,0.5);else{const t0=i===5?P.until-0.2:P.appears-0.3;a=ag_in(tt,t0,0.5);dx=(1-op_ph(tt,t0,1.0))*120;}
    const frost=i<6?ag_in(tt,P.protects,0.5):ag_in(tt,P.appears+0.7,0.5),hand=i<5?op_ph(tt,P.table+i*0.38,0.35)*(1-frost):0;
    const pill=i<6?ag_in(tt,P.tag+0.1*(5-i),0.35):ag_in(tt,P.appears+0.6,0.35),bare=i===5?ag_in(tt,P.nothing,0.4)*(1-frost):0;
    const glow=clamp(1-Math.abs((tt-P.hidden)/0.22-i)/1.2,0,1);
    op_tile(x,x0+dx,y0,{a,hand,frost,pill,bare,glow});}}

scene("page",(ctx,S,t,sc)=>{const c=sc.cues,P=op_once(sc,"P",()=>({
    place:c.place,fire:wAt(sc,"crash","firefighters"),guide:wAt(sc,"page","guide"),find:c.find,exactly:wAt(sc,"find","exactly"),papers:wAt(sc,"cab","papers"),
    none:c.none,wrong:c.wrong,spray:wAt(sc,"wrong","spray"),poison:wAt(sc,"wrong","poison"),families:wAt(sc,"homes","families"),change:c.change,
    y1980:wAt(sc,"book","nineteen-eighty"),changed:wAt(sc,"book","changed"),share:c.share,alike:wAt(sc,"share","alike"),shareW:wAt(sc,"share","share"),once:wAt(sc,"share","once"),
    number:c.number,numW:wAt(sc,"number","number"),oneLine:wAt(sc,"line","one"),its:wAt(sc,"line","guide"),unknown:c.unknown,g111:wAt(sc,"unknown","Guide"),every:wAt(sc,"unknown","every"),
    today:c.today,canada:wAt(sc,"today","Canada"),upwind:c.upwind,binoc:wAt(sc,"upwind","binoculars"),fromUp:wAt(sc,"upwind","upwind"),
    what:wAt(sc,"knows","what"),far:wAt(sc,"knows","far"),same:c.same,table:wAt(sc,"same","table"),nothing:wAt(sc,"same","nothing"),until:wAt(sc,"same","until"),
    policy:wAt(sc,"tag","policy"),tag:wAt(sc,"tag","tag"),protects:wAt(sc,"tag","protects"),appears:wAt(sc,"tag","appears"),hidden:wAt(sc,"lands","hidden"),title:c.breath}));
  const T=tt=>op_T(sc,tt);
  ag_shots(ctx,S,t,sc.dur,[
    // the road at night in the 1970s: the camera glides to the cab on "exactly", and back on "no page at all"
    {at:0,place:"opRoad",keys:[[0,960,540,1.0],[P.exactly-0.4,1387,600,1.8],[P.none-0.6,960,540,1.0]],d:1.8,push:0.01,draw:(x,tt)=>op_road70(x,tt,T(tt),P)},
    // the book, close up, under the same light
    {cut:true,at:P.share-0.15,place:"opBook",keys:[[P.share-0.15,960,540,1.0]],push:0.012,draw:(x,tt)=>op_book1(x,tt,P)},
    // the road today, read from upwind
    {cut:true,at:P.upwind-0.15,place:"opRoad",keys:[[P.upwind-0.15,960,540,1.0]],push:0.012,draw:(x,tt)=>op_roadNow(x,tt,P)},
    // the hall: the policy's card where the guide's card was, and the tables a mask by hand never reaches in time
    {cut:true,at:P.same-0.15,place:"opHall",keys:[[P.same-0.15,960,540,1.0]],push:0.008,draw:(x,tt)=>op_hall1(x,tt,P)}]);
  op_kickers(ctx,t,[["North America · the 1970s",P.place-0.2,P.y1980-0.6],["North America · 1980",P.y1980-0.1,P.canada-0.6],["North America · today",P.canada-0.1,P.same-0.5]]);
  dp_title(ctx,S,t,P.title,OP_TITLE,"Every table, the day it appears","FILM 6 OF 8 · ONLY WHAT YOU MAY SEE");});

/* ---------------------------------------------------------------- 2 · A mask for every table */
const OP_LEARNER={name:"core_learner_v1",level:"confidential",rows:[
  {col:"student_number",val:"S-20412",cls:"direct"},{col:"full_name",val:"Samuel Osei",cls:"direct"},{col:"email",val:"samuel.osei@mail.example",cls:"direct"},
  {col:"date_of_birth",val:"1987-05-14",cls:"indirect"},{col:"learner_code",val:"a7772705…",cls:"pseudonymous",mono:true},{col:"course",val:"Public health",cls:"none"}]};
const OP_READERS=["registrar_office","help_desk","health_progress_study","planning_learner_readers"];
// Sam at the right, facing the pane, with his name card; dx slides him (out to the right as the next chapter starts)
function op_sam(x,T,o){o=o||{};const a=o.a==null?1:o.a,dx=o.dx||0;if(a>0.003)withA(x,a,()=>dp_person(x,"sam",1520+dx,660,0.85,{t:T,flip:true,gaze:[3,1]}));
  const n=o.card==null?1:o.card;if(n>0)dp_card(x,1100,170,500,{kick:"Data platform",title:"Sam Okafor"},{col:"cyan",a:n,k:o.k,behind:"opHall"});}
// the readers of core, as Grants by design gives them: their chips in the pane's top row, with green lines down to the shelf
function op_readers(x,tt,t0,a){if(a<=0)return;let w=0;const ws=OP_READERS.map(s=>op_chipW(x,s));w=ws.reduce((s,v)=>s+v,0)+14*(ws.length-1);let cx=1796-w;
  x.save();x.globalAlpha*=a;OP_READERS.forEach((s,i)=>{const ca=ag_in(tt,t0+i*0.15,0.35);if(ca>0){op_chip(x,cx,196,s,"cyan",{a:ca});dp_link(x,[cx+ws[i]/2,246],[cx+ws[i]/2,284],"green",op_ph(tt,t0+i*0.15+0.2,0.4),{lw:2.4});}cx+=ws[i]+14;});x.restore();}

scene("mask",(ctx,S,t,sc)=>{const c=sc.cues,P=op_once(sc,"P",()=>({
    cls:wAt(sc,"day","class"),know:wAt(sc,"day","Know"),least:c.least,whole:wAt(sc,"least","whole"),year:wAt(sc,"least","year"),
    tables:c.tables,catalog:wAt(sc,"tables","catalog"),thirty:wAt(sc,"tables","thirty-eight"),hand:c.hand,byHand:wAt(sc,"hand","masks"),remembers:wAt(sc,"hand","remembers"),
    grants:c.grants,readers:wAt(sc,"grants","readers"),newT:wAt(sc,"grants","new"),first:wAt(sc,"grants","first"),later:wAt(sc,"later","later"),
    every:wAt(sc,"every","everyone"),sam:c.sam,okafor:wAt(sc,"sam","Okafor"),wholeCat:wAt(sc,"sam","whole")}));
  const T=tt=>op_T(sc,tt);
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,later:true,place:"opHall",keys:[[0,960,540,1.0]],push:0.006,draw:(x,tt)=>{
      // Mei, and the learner table she classed: its classes land, then two of its ways
      const out=op_ph(tt,P.tables-0.3,1.4),ma=1-ag_in(tt,P.tables+0.5,0.6);
      if(ma>0.003)withA(x,ma,()=>dp_person(x,"mei",240-520*out,660,0.85,{t:T(tt),gaze:[3,1]}));
      const n=op_pop(tt,0.9,P.tables-0.4);dp_card(x,60,190,460,{kick:"Registrar's office",title:"Mei Tanaka"},{col:"cyan",a:n.a,k:n.k,behind:"opHall"});
      const wa=1-ag_in(tt,P.tables-0.2,0.4),mo=op_ph(tt,P.tables+0.2,1.0),pane=ag_in(tt,P.tables+0.7,0.8);
      if(mo<=0){const k=op_pop(tt,1.0,null);op_table(x,560,150,OP_LEARNER,{w:1000,k:k.k,a:k.a*wa,behind:"opHall",chips:Object.fromEntries(OP_LEARNER.rows.map((r,i)=>[r.col,ag_in(tt,P.cls+i*0.12,0.35)])),
          show:{full_name:ag_in(tt,P.whole,0.5)},vals:tt>P.year+0.3?{date_of_birth:"1987-01-01"}:{},lit:{date_of_birth:ag_io(tt,P.year,P.tables-0.4,0.4)}});
        if(wa<1)dp_panel(x,560,150,1000,434,{col:"cyan",r:20,behind:"opHall",a:1-wa});}
      else{const b=[lerp(560,380,mo),lerp(150,292,mo),lerp(1000,84,mo),lerp(434,56,mo)];dp_panel(x,b[0],b[1],b[2],b[3],{col:"cyan",r:lerp(20,10,mo),behind:"opHall",a:1-ag_in(tt,P.tables+1.0,0.25)});}
      [["Mask it whole","violet",280,P.whole],["Generalise","violet2",388,P.year]].forEach(([s,col,y,t0])=>dp_slip(x,1580,y,s,col,{ink:true,a:ag_io(tt,t0-0.1,P.tables-0.3,0.35),behind:"opHall"}));
      [["Know what you hold",P.know-0.1,P.least-0.4],["Show the least",P.least+0.2,P.tables-0.4],["Grants by design",P.grants+0.1,P.later-0.3]].forEach(([s,t0,t1])=>op_slipR(x,1860,60,s,"cyan",{ink:true,a:ag_io(tt,t0,t1,0.35),behind:"opHall"}));
      // the catalog: 38 tables, 140 columns; masks by hand, one table at a time; the readers of core; a new table, read at once
      if(pane>0){const hand=2.6*clamp(Math.min(tt,P.remembers)-P.byHand,0,99),lift=1-ag_in(tt,P.sam-0.2,0.6),cnt=1-ag_in(tt,P.hand-0.2,0.3),hc=ag_io(tt,P.hand+0.2,P.grants-0.3,0.3);
        const kk=op_ph(tt,P.sam-0.1,1.4),na=ag_in(tt,P.newT-0.1,0.5),nx=(1-op_ph(tt,P.newT-0.1,0.9))*80,rd=ag_io(tt,P.first-0.2,P.sam-0.6,0.4);
        op_pane(x,tt,{k:kk,a:pane,hand,handA:lift,count:"38 tables with personal data · 140 columns to hide",countA:ag_in(tt,P.thirty-0.1,0.5)*cnt,
          lit:{core:ag_io(tt,P.readers+0.6,P.sam-0.6,0.4)},litCol:"green",outline:op_ph(tt,P.wholeCat-0.2,1.2),
          extra:(c,B,k)=>{if(hc>0)withA(c,hc*(1-k),()=>dp_T(c,"Set by hand: "+Math.floor(hand)+" of 140",B.x+B.w-40,B.y+100,{w:600,size:28,col:"coral",align:"right"}));
            const ea=na*(1-ag_in(tt,P.sam-0.3,0.5));if(ea>0){c.save();c.globalAlpha*=ea;op_mini(c,1696+nx,292,{kind:"p",pers:4,first:9999},{marks:1},tt);
              if(rd>0){c.save();c.globalAlpha*=rd;c.strokeStyle=rgba(DP.F.green,0.9);c.shadowColor=rgba(DP.F.green,0.8);c.shadowBlur=14;c.lineWidth=3;rr(c,1690+nx,286,96,68,13);c.stroke();c.restore();}c.restore();}}});
        op_readers(x,tt,P.readers,ag_in(tt,P.grants,0.3)*(1-ag_in(tt,P.sam-0.6,0.4)));
        op_slipR(x,1680,372,"masks: until someone remembers","coral",{ink:true,a:ag_io(tt,P.later-0.1,P.sam-0.6,0.4),behind:"opHall"});
        const pp=op_pop(tt,P.every-0.1,P.sam-0.6);if(pp.a>0){dp_link(x,[1738,350],[1738,470],"coral",op_ph(tt,P.every-0.3,0.4),{lw:2.4,alpha:pp.a});
          op_rowsCard(x,1240,470,560,"Who reads it: everyone on core",["full_name"],[["Ana Lima"],["Tom Reyes"],["Mia Chen"]],{plain:true,col:"coral",cw:[300],a:pp.a,behind:"opHall"});}}
      // Sam comes in at the right as the pane moves aside
      const sa=ag_in(tt,P.sam+0.1,0.6);if(sa>0)op_sam(x,T(tt),{a:sa,dx:(1-op_ph(tt,P.sam+0.1,1.4))*560,card:ag_in(tt,P.okafor+0.2,0.4)});}}]);
  op_kickers(ctx,t,[["Tuesday 13 October 2026",0.7,P.tables-0.4]]);});

/* ---------------------------------------------------------------- 3 · A policy for each class */
// the policies Sam writes, as Catalog Explorer lists them: one for each class that's hidden, and one that decides rows
const OP_POLS=[{name:"hide_special",finds:"special",does:"Mask it whole"},{name:"hide_direct",finds:"direct",does:"Mask it whole"},
  {name:"hide_pseudonymous",finds:"pseudonymous",does:"Mask it whole"},{name:"generalise_indirect",finds:"indirect",does:"Generalise"},
  {name:"health_rows_only",on:"registrar.core",finds:"faculty",does:"Filter rows"}];
// six learners on core, by their code and their faculty: the study sees only Health's (HLT)
const OP_CORE=[["a7772705…","HLT"],["3f9c0b12…","BUS"],["c41d7e08…","HLT"],["9b2e6a55…","EIT"],["e07f3d91…","AED"],["b52a19c4…","HLT"]];
// a line of light round a box, drawn on (p 0 to 1)
function op_ring(ctx,x,y,w,h,col,p,a){if(p<=0||a<=0)return;const c=dp_f(col||"cyan"),per=2*(w+h);ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);
  ctx.shadowColor=rgba(c,0.9);ctx.shadowBlur=14;ctx.lineWidth=3;ctx.setLineDash([per*ag_sine(clamp(p,0,1)),per]);rr(ctx,x,y,w,h,12);ctx.stroke();ctx.restore();}

scene("parts",(ctx,S,t,sc)=>{const c=sc.cues,P=op_once(sc,"P",()=>({
    where:c.where,reg:wAt(sc,"where","registrar's"),every:wAt(sc,"where","every"),whom:c.whom,except:wAt(sc,"whom","except"),
    finds:c.finds,direct:wAt(sc,"finds","direct"),tagW:wAt(sc,"finds","tag"),any:wAt(sc,"finds","any"),does:c.does,mask:wAt(sc,"does","mask"),
    before:c.before,each:c.each,cls:["special","direct","pseudonymous","indirect"].map(w=>wAt(sc,"each",w)),
    rows:c.rows,rowsW:wAt(sc,"rows","rows"),faculty:wAt(sc,"rows","Faculty"),shelf:c.shelf,facW:wAt(sc,"shelf","faculty"),tag:wAt(sc,"shelf","tag"),
    needs:c.needs,without:c.without,everyL:wAt(sc,"without","every"),end:sc.dur}));
  const T=tt=>op_T(sc,tt);
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"opHall",keys:[[0,960,540,1.0]],push:0.006,draw:(x,tt)=>{const go=1-ag_in(tt,P.end-1.1,0.5);
      // the catalog's pane as chapter 2 leaves it: its line of light runs round it again on "every shelf", its marks shine on "by its tag",
      // the frost falls on every personal value on "mask it whole", and core lights for the row filter
      op_pane(x,tt,{k:1,marks:1,outline:tt<P.every-0.3?1:op_ph(tt,P.every-0.2,1.2),outlineA:tt<P.every-0.3?1-ag_in(tt,0.4,0.8):ag_io(tt,P.every-0.2,P.whom-0.2,0.4),
        glow:ag_io(tt,P.tagW-0.1,P.does,0.4),masked:ag_in(tt,P.mask,0.6),lit:{core:ag_io(tt,P.faculty-0.2,P.end-1.1,0.5)}});
      // Sam goes back to the platform, out at the right
      op_sam(x,T(tt),{a:1-ag_in(tt,1.5,0.6),dx:op_ph(tt,0.85,1.4)*620,card:1-ag_in(tt,0.2,0.4)});
      // the policy in the SQL editor: its four parts light in turn
      const pa=ag_io(tt,1.6,P.each-0.4,0.45)*go;
      if(pa>0){dp_page(x,680,140,1180,570,{tool:"databricks",name:"Databricks",where:"SQL editor",a:pa,behind:"opHall"});
        withA(x,pa,()=>op_code(x,740,300,OP_SQL,{lit:{1:["cyan",ag_io(tt,P.reg-0.1,P.whom-0.3,0.35)],3:["cyan",ag_io(tt,P.whom-0.1,P.finds-0.3,0.35)],
          4:["cyan",ag_io(tt,P.except-0.1,P.finds-0.3,0.35)],5:["cyan",ag_io(tt,P.any-0.1,P.does-0.3,0.35)],6:["violet",ag_io(tt,P.direct-0.1,P.does-0.3,0.35)],
          7:["violet",ag_io(tt,P.direct-0.1,P.does-0.3,0.35)],2:["violet",ag_io(tt,P.mask-0.1,P.before-0.2,0.35)]}}));}
      dp_slip(x,680,730,"First written in Governed in Unity Catalog","cyan",{ink:true,size:28,a:ag_io(tt,P.before-0.1,P.each-0.4,0.35)*go,behind:"opHall"});
      // the policies, one for each class, as Catalog Explorer lists them; the row filter's own row on "rows"
      const pb=ag_io(tt,P.each+0.2,P.shelf-0.5,0.45)*go;
      if(pb>0){const box=dp_page(x,680,140,1180,560,{tool:"databricks",name:"Databricks",where:"Catalog Explorer · registrar · Policies",a:pb,behind:"opHall"});
        withA(x,pb,()=>op_policies(x,box,OP_POLS.map((r,i)=>Object.assign({},r,{a:ag_in(tt,i<4?P.cls[i]-0.15:P.rowsW-0.1,0.4),lit:i===4?ag_io(tt,P.rowsW,P.shelf-0.7,0.4):0})),{cols:["on","finds","does"]}));}
      // the study's view of a learner table on core: the faculty tag lands on its column, and the rows that aren't Health's fold away
      const ca=ag_io(tt,P.shelf,P.end-1.1,0.45)*go;
      if(ca>0){const fold={};[1,3,4].forEach((i,j)=>{fold[i]=op_ph(tt,P.tag+0.1+j*0.15,0.7);});
        const bx=op_rowsCard(x,680,140,860,"",["learner_code","faculty_code"],OP_CORE,{chip:"health_progress_study",cw:[420,260],mono:[true,true],tagAt:1,tag:ag_in(tt,P.facW,0.4),fold,a:ca,behind:"opHall"});
        // a filter needs its column: the faculty column, outlined
        op_ring(x,1112,196,410,bx.h-66,"cyan",op_ph(tt,P.needs-0.1,1.0),ca);}
      // a table with learners and no faculty column: the filter finds nothing there, so the study would read every row
      const cb=ag_io(tt,P.without-0.4,P.end-1.1,0.45)*go;
      if(cb>0){const w=ag_in(tt,P.everyL-0.1,0.5);
        op_rowsCard(x,680,470,620,"A table with no faculty column",["learner_code","credit_points"],[["a7772705…","90"],["3f9c0b12…","60"],["c41d7e08…","120"],["9b2e6a55…","30"]],
          {plain:true,cw:[340,220],mono:[true,false],a:cb,behind:"opHall",wash:{0:["coral",w],1:["coral",w],2:["coral",w],3:["coral",w]}});
        dp_slip(x,1330,490,"every learner shows","coral",{ink:true,size:28,a:cb*w,behind:"opHall"});}}}]);});

/* ---------------------------------------------------------------- 4 · A function for each way */
scene("ways",(ctx,S,t,sc)=>{const c=sc.cues,P=op_once(sc,"P",()=>({
    fn:wAt(sc,"small","function"),pol:wAt(sc,"small","policies"),stars:wAt(sc,"whole","stars"),empty:wAt(sc,"whole","empty"),
    digits:wAt(sc,"part","digits"),letter:wAt(sc,"part","letter"),jan:wAt(sc,"general","January"),year:wAt(sc,"general","year"),
    stays:wAt(sc,"type","stays"),fails:wAt(sc,"type","fails"),filter:c.filter,yes:wAt(sc,"filter","yes"),no:wAt(sc,"filter","no"),
    other:c.other,code:c.code,codeW:wAt(sc,"code","code"),key:wAt(sc,"code","key"),left:wAt(sc,"out","left"),grant:wAt(sc,"out","grant"),end:sc.dur}));
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"opHall",keys:[[0,960,540,1.0]],push:0.006,draw:(x,tt)=>{const go=1-ag_in(tt,P.end-1.1,0.5);
      // the pane as chapter 3 leaves it; its policies shelf lights, where the functions are kept; later support is left out of the
      // study's reach, and published holds only totals
      op_pane(x,tt,{k:1,marks:1,masked:1,lit:{policies:ag_io(tt,P.pol-0.2,P.other-0.3,0.4),published:ag_io(tt,P.other+0.5,P.code-0.3,0.4)},
        frostShelf:{support:ag_io(tt,P.left-0.1,P.end-1.1,0.5)}});
      // the four ways that are functions, a card each: its name, and what goes in and what comes out
      const fa=i=>ag_io(tt,P.fn-0.1+i*0.15,P.other-0.3,0.4)*go,fk=i=>clamp(ag_spr(tt,P.fn-0.1+i*0.15,0.8),0,1.2);
      op_fn(x,680,150,570,300,"mask_whole",[["Samuel Osei","***","ink",ag_in(tt,P.stars-0.1,0.4)],["a date","empty","mut",ag_in(tt,P.empty-0.1,0.4)]],{a:fa(0),k:fk(0),behind:"opHall"});
      op_fn(x,1290,150,570,300,"mask_in_part",[["S-20412","S-***12","ink",ag_in(tt,P.digits-0.1,0.4)],["samuel.osei@mail.example","s***@mail.example","ink",ag_in(tt,P.letter-0.1,0.4),true]],{a:fa(1),k:fk(1),behind:"opHall"});
      op_fn(x,680,470,570,300,"generalise",[["1987-05-14","1987-01-01","ink",ag_in(tt,P.jan-0.1,0.4)]],{a:fa(2),k:fk(2),col:"violet2",tick:ag_in(tt,P.stays,0.4),behind:"opHall"});
      withA(x,fa(2)*ag_in(tt,P.year,0.4),()=>dp_T(x,"the year, kept a date",708,672,{w:600,size:28,col:"mut"}));
      op_fn(x,1290,470,570,300,"in_faculty",[["HLT","yes","green",ag_in(tt,P.yes-0.1,0.4)],["BUS","no","coral",ag_in(tt,P.no-0.1,0.4)]],{a:fa(3),k:fk(3),col:"green",behind:"opHall"});
      dp_slip(x,680,790,"*** in a date column · query stopped","coral",{ink:true,size:28,a:ag_io(tt,P.fails-0.1,P.filter-0.3,0.35)*go,behind:"opHall"});
      // the other ways, as Show the least names them
      const wa=i=>ag_io(tt,P.other+0.1+i*0.2,P.end-1.1,0.4)*go,wk=i=>clamp(ag_spr(tt,P.other+0.1+i*0.2,0.8),0,1.2);
      dp_card(x,680,140,380,{title:"Keyed hash",sub:"made at the source"},{col:"violet",a:wa(0),k:wk(0),behind:"opHall"});
      dp_card(x,1080,140,380,{title:"Leave it out",sub:"exam support"},{col:"coral",a:wa(1),k:wk(1),behind:"opHall"});
      dp_card(x,1480,140,380,{title:"Totals",sub:"small counts hidden"},{col:"grey",a:wa(2),k:wk(2),behind:"opHall"});
      // the learner code, made at the source with a key that the registrar's office keeps (never a character of the key)
      withA(x,ag_io(tt,P.codeW-0.2,P.end-1.1,0.4)*go,()=>{dp_T(x,"learner_code",708,318,{w:500,size:28,f:"mono",col:"mut"});dp_T(x,"a7772705…",708,362,{w:500,size:32,f:"mono"});});
      dp_sealed(x,680,394,560,"The registrar's key",{sub:"kept by the registrar's office",a:ag_io(tt,P.key-0.2,P.end-1.1,0.4)*go,behind:"opHall"});
      dp_slip(x,1080,296,"no grant for the study","coral",{ink:true,size:28,a:ag_io(tt,P.grant-0.2,P.end-1.1,0.4)*go,behind:"opHall"});}}]);});

/* ---------------------------------------------------------------- 5 · Who is let through */
scene("through",(ctx,S,t,sc)=>{const c=sc.cues,P=op_once(sc,"P",()=>({
    owning:wAt(sc,"owner","owning"),decide:c.decide,office:wAt(sc,"decide","office"),rl:wAt(sc,"loader","registrar-loader"),
    thr:wAt(sc,"loader","through"),stars:wAt(sc,"loader","stars"),help:c.help,helpW:wAt(sc,"help","help"),given:c.given,two:c.two,err:wAt(sc,"two","error"),
    study:c.study,studyW:wAt(sc,"study","study"),agr:wAt(sc,"allows","agreement"),agent:c.agent,compute:c.compute,
    srv:wAt(sc,"compute","serverless"),dbr:wAt(sc,"compute","Databricks"),older:c.older,end:sc.dur}));
  const T=tt=>op_T(sc,tt);
  ag_shots(ctx,S,t,sc.dur,[{at:0,place:"opHall",keys:[[0,960,540,1.0]],push:0.006,draw:(x,tt)=>{const go=1-ag_in(tt,P.end-1.1,0.5);
      // the pane as chapter 4 leaves it goes, and the policies come in where it was, with a column for the groups each lets through
      op_pane(x,tt,{k:1,marks:1,masked:1,a:1-ag_in(tt,0.2,0.4)});
      const pa=ag_in(tt,0.7,0.6)*go;
      if(pa>0){const box=dp_page(x,60,120,1360,720,{tool:"databricks",name:"Databricks",where:"Catalog Explorer · registrar · Policies",a:pa,behind:"opHall"});
        const own=i=>["registrar_owners",ag_in(tt,P.thr-0.1+i*0.12,0.5)],off=i=>["registrar_office",ag_in(tt,P.office-0.1+i*0.12,0.5)];
        // on "two different masks", the help desk is pulled out of hide_direct's list for a moment, and goes back
        const pull=ag_io(tt,P.two-0.1,P.study-0.6,0.45);
        const rows=[{name:"hide_special",through:[["registrar_exam_support",ag_in(tt,P.office+0.4,0.5)],own(0)]},
          {name:"hide_direct",lit:ag_io(tt,P.helpW-0.2,P.study-0.4,0.4),through:[off(0),own(1),["help_desk",ag_in(tt,P.helpW-0.1,0.5),"cyan",false,0,pull*150,1-0.5*pull]]},
          {name:"direct_in_part",h:op_ph(tt,P.given-0.3,0.6),a:ag_in(tt,P.given+0.2,0.4),lit:ag_io(tt,P.given+0.2,P.study-0.4,0.4),to:"help_desk",toA:ag_in(tt,P.given+0.5,0.4)},
          {name:"hide_pseudonymous",lit:ag_io(tt,P.study-0.1,P.agent-0.3,0.4),through:[off(1),own(2),["health_progress_study",ag_in(tt,P.studyW-0.1,0.5)],["planning_learner_readers",ag_in(tt,P.studyW+0.4,0.5)]]},
          {name:"generalise_indirect",through:[off(2),own(3)]},
          {name:"health_rows_only",to:"health_progress_study"}];
        withA(x,pa,()=>{op_policies(x,box,rows,{cols:["through"]});
          dp_slip(x,92,744,"Agreement 2026-14: a code in place of who they are","cyan",{ink:true,size:28,a:ag_io(tt,P.agr-0.2,P.agent-0.3,0.4),behind:"opHall"});});}
      // owning a table isn't enough, nor is an admin account
      dp_card(x,1450,140,410,{kick:"Not enough",title:"Owning a table",sub:"or an admin account"},{col:"coral",a:ag_io(tt,P.owning-0.1,P.decide-0.5,0.4),behind:"opHall"});
      // Mei decides who's on each list
      const mi=op_ph(tt,P.decide-0.2,1.2),mo=op_ph(tt,P.rl-0.9,1.2),ma=ag_in(tt,P.decide-0.2,0.5)*(1-ag_in(tt,P.rl-0.6,0.5));
      if(ma>0.003)withA(x,ma,()=>dp_person(x,"mei",1680+(1-mi)*300+mo*300,690,0.8,{t:T(tt),flip:true,gaze:[3,1]}));
      dp_card(x,1450,160,410,{kick:"Registrar's office",title:"Mei Tanaka"},{col:"cyan",a:ag_io(tt,P.decide+0.3,P.rl-1.0,0.4),behind:"opHall"});
      // the builder, registrar-loader, in registrar_owners: without it, every table it built would hold stars
      const la=ag_io(tt,P.rl-0.2,P.agent-0.4,0.4);
      if(la>0){op_chip(x,1450,160,"registrar-loader","cyan",{gear:true,a:la});dp_slip(x,1450,232,"in registrar_owners","cyan",{ink:true,size:28,a:la,behind:"opHall"});}
      const ga=ag_io(tt,P.stars-0.2,P.help-0.3,0.4);
      if(ga>0)op_rowsCard(x,1450,330,410,"If not let through",["full_name"],[["***"],["***"]],{plain:true,col:"coral",cw:[300],a:ga,behind:"opHall"});
      // two different masks for one reader: an error
      dp_card(x,1450,330,410,{kick:"Error",title:"Two masks",sub:"the query stops"},{col:"coral",a:ag_io(tt,P.err-0.1,P.study-0.4,0.4),behind:"opHall"});
      // an agent is never on a list
      const aa=ag_io(tt,P.agent-0.1,P.compute-0.5,0.4);
      if(aa>0){ag_model(x,1655,330,80,{t:T(tt),a:aa});dp_card(x,1450,460,410,{title:"Never on a list",sub:"its own role's rights"},{col:"cyan",a:aa,behind:"opHall"});
        dp_slip(x,1450,612,"AI agents in data work","cyan",{ink:true,size:28,a:aa,behind:"opHall"});}
      // the compute that applies policies; older compute is refused
      const cp=ag_io(tt,P.compute+0.1,P.end-1.1,0.45);
      if(cp>0){x.save();x.globalAlpha*=cp;dp_panel(x,1450,250,410,380,{col:"cyan",r:20,behind:"opHall",glowR:36});
        dp_T(x,"COMPUTE",1480,300,{w:700,size:28,ls:4,col:"cyan"});
        const s1=ag_in(tt,P.srv-0.1,0.4),s2=ag_in(tt,P.dbr-0.1,0.4),s3=ag_in(tt,P.older-0.1,0.4);
        withA(x,s1,()=>{dp_tick(x,1494,360,"green",s1);dp_T(x,"Serverless",1530,370,{w:600,size:28});});
        withA(x,s2,()=>{dp_tick(x,1494,430,"green",s2);dp_T(x,"Databricks Runtime",1530,440,{w:600,size:28});dp_T(x,"16.4 and above",1530,480,{w:600,size:28});});
        withA(x,s3,()=>{dp_cross(x,1494,560,"coral",s3);dp_T(x,"Older: refused",1530,570,{w:600,size:28,col:"coral"});});x.restore();}}}]);});

/* ---------------------------------------------------------------- 6 · The day a table appears */
const OP_PROGRESS={name:"core_progress_v1",level:"confidential",rows:[{col:"student_number",val:"S-20412",cls:"direct"},{col:"learner_code",val:"a7772705…",cls:"pseudonymous",mono:true},
  {col:"faculty_code",val:"HLT",tag:"faculty"},{col:"year",val:"2026",cls:"none"},{col:"credit_points",val:"90",cls:"none"}]};
// a second new table on core, which comes without its level, and with a column no one has classed
const OP_CONTACT={name:"core_contact_v1",level:"confidential",rows:[{col:"student_number",val:"S-20511",cls:"direct"},{col:"full_name",val:"Lena Brandt",cls:"direct"},
  {col:"email",val:"l.brandt@mail.example",cls:"direct"},{col:"preferred_name",val:"Lena",empty:true},{col:"faculty_code",val:"BUS",tag:"faculty"}]};
scene("appears",(ctx,S,t,sc)=>{const c=sc.cues,P=op_once(sc,"P",()=>({
    built:wAt(sc,"day","built"),classes:c.classes,bring:wAt(sc,"classes","bring"),levelW:wAt(sc,"level","level"),nine:c.nine,maskW:wAt(sc,"nine","mask"),
    first:c.first,helpW:wAt(sc,"first","help"),plan:wAt(sc,"first","Planning"),study:c.study,only:wAt(sc,"study","only"),
    road:c.road,every:wAt(sc,"road","every"),here:c.here,builder:wAt(sc,"here","builder"),owner:wAt(sc,"until","owner"),gives:wAt(sc,"until","gives"),
    tag:c.tag,tagW:wAt(sc,"tag","tag"),checkW:wAt(sc,"check","check"),end:sc.dur}));
  const T=tt=>op_T(sc,tt);
  // Jun's new model, built for the first time: its classes come from its sources, and Mei's level with it; then three readers' views of it
  const hallA=(x,tt)=>{const out=op_ph(tt,P.first-0.6,1.4),ja=ag_in(tt,0.4,0.6)*(1-ag_in(tt,P.first+0.2,0.6));
      if(ja>0.003)withA(x,ja,()=>dp_person(x,"jun",240-520*out,660,0.85,{t:T(tt),gaze:[3,1]}));
      const n=op_pop(tt,0.9,P.first-0.8);dp_card(x,60,190,460,{kick:"Analytics engineer",title:"Jun Park"},{col:"cyan",a:n.a,k:n.k,behind:"opHall"});
      const k=op_pop(tt,P.built-0.2,null),ms=ag_in(tt,P.maskW+0.2,0.6);
      op_table(x,560,150,OP_PROGRESS,{w:1000,k:k.k,a:k.a,behind:"opHall",chips:Object.fromEntries(OP_PROGRESS.rows.map((r,i)=>[r.col,ag_in(tt,P.bring+i*0.15,0.35)])),
        level:ag_in(tt,P.levelW-0.1,0.45),show:{student_number:ms,learner_code:ms}});
      op_slipR(x,1860,60,"Tags that travel","cyan",{ink:true,a:ag_io(tt,P.classes,P.nine-0.3,0.35),behind:"opHall"});
      dp_slip(x,560,560,"level: set by Mei, in the model's code","cyan",{ink:true,size:28,a:ag_io(tt,P.levelW+0.2,P.nine-0.3,0.35),behind:"opHall"});
      dp_slip(x,560,560,"The 39th table · no new mask","cyan",{ink:true,size:28,a:ag_io(tt,P.nine+0.1,P.first-0.4,0.35),behind:"opHall"});
      const vs=[["help_desk",80,["student_number","learner_code"],[["S-***12","***"],["S-***88","***"],["S-***31","***"]],P.helpW],
        ["planning_learner_readers",680,["student_number","learner_code"],[["***","a7772705…"],["***","3f9c0b12…"],["***","c41d7e08…"]],P.plan],
        ["health_progress_study",1280,["learner_code","faculty_code"],[["a7772705…","HLT"],["3f9c0b12…","BUS"],["c41d7e08…","HLT"]],P.study]];
      for(const [who,vx,cols,rows,t0] of vs){const a=ag_in(tt,t0-0.2,0.45);if(a<=0)continue;
        op_rowsCard(x,vx,560,560,"",cols,rows,{chip:who,cw:[260,260],mono:[true,true],a,behind:"opHall",fold:who==="health_progress_study"?{1:op_ph(tt,P.only,0.7)}:null});}};
  // on the road: a load no one can name gets Guide 111, which assumes every danger
  const book=(x,tt)=>{op_yellow(x,{rows:OP_YELLOW_NOW});op_guide(x,"111",{});
    const ev=ag_in(tt,P.every-0.2,0.5);if(ev>0){x.save();x.globalAlpha*=ev*0.45;x.fillStyle="rgba(255,240,210,0.6)";rr(x,1020,420,730,272,12);x.fill();x.restore();}
    op_slipR(x,1800,20,"As the book is printed today","grey",{ink:true,behind:"opBook",size:28});};
  // a table that comes without its level: closed to all but its builder until Mei gives it one; and a column no one has classed
  const hallB=(x,tt)=>{const go=1-ag_in(tt,P.end-1.1,0.5);
      withA(x,go,()=>dp_person(x,"mei",240,660,0.85,{t:T(tt),gaze:[3,1]}));
      const n=op_pop(tt,P.here+0.4,P.end-1.1);dp_card(x,60,190,460,{kick:"Registrar's office",title:"Mei Tanaka"},{col:"cyan",a:n.a*go,k:n.k,behind:"opHall"});
      const k=op_pop(tt,P.here-0.1,null);
      op_table(x,560,150,OP_CONTACT,{w:1000,k:k.k,a:k.a*go,behind:"opHall",level:ag_in(tt,P.owner-0.1,0.45),closed:1-ag_in(tt,P.gives+0.2,0.6),
        show:{student_number:1,full_name:1,email:1},ring:{preferred_name:ag_io(tt,P.tagW-0.2,P.end-1.1,0.5)}});
      const la=ag_io(tt,P.builder-0.2,P.tag-0.4,0.4)*go;
      if(la>0){op_chip(x,560,570,"registrar-loader","cyan",{gear:true,a:la});dp_tick(x,912,595,"green",la);dp_slip(x,970,560,"everyone else: no rows","coral",{ink:true,size:28,a:la,behind:"opHall"});}
      dp_slip(x,560,570,"found by the morning check · Proof it held","cyan",{ink:true,size:28,a:ag_io(tt,P.checkW-0.2,P.end-1.1,0.4)*go,behind:"opHall"});};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,later:true,place:"opHall",keys:[[0,960,540,1.0]],push:0.006,draw:hallA},
    {cut:true,at:P.road-0.2,place:"opBook",keys:[[P.road-0.2,960,540,1.0]],push:0.012,draw:book},
    {cut:true,at:P.here-0.2,place:"opHall",keys:[[P.here-0.2,960,540,1.0]],push:0.006,draw:hallB}]);
  op_kickers(ctx,t,[["Wednesday 21 October 2026 · 09:12",0.7,P.road-0.6]]);});

/* ---------------------------------------------------------------- 7 · Kept as code */
// the pull request's files: the grants already in the registrar's bundle, and the policies beside them
const OP_TREE=[["registrar/resources/catalog.yml",false],["registrar/resources/schemas.yml",false],["registrar/resources/policies.job.yml",true],
  ["registrar/policies/functions.sql",true],["registrar/policies/policies.sql",true],["registrar/policies/studies.sql",true],["registrar/policies/check.sql",true]];
scene("code",(ctx,S,t,sc)=>{const c=sc.cues,P=op_once(sc,"P",()=>({
    codeW:wAt(sc,"kept","code"),grants:wAt(sc,"kept","grants"),review:c.review,reviews:wAt(sc,"review","reviews"),told:wAt(sc,"review","told"),
    runs:c.runs,test:wAt(sc,"runs","test"),prod:wAt(sc,"runs","production"),appr:wAt(sc,"runs","approver"),rl:wAt(sc,"runs","registrar-loader"),
    whole:c.whole,replaces:wAt(sc,"whole","replaces"),order:c.order,morning:wAt(sc,"order","morning"),afternoon:wAt(sc,"order","afternoon"),
    road:c.road,once:wAt(sc,"road","once"),line:wAt(sc,"road","line"),here:c.here,tags:wAt(sc,"here","tags"),lands:c.lands,hidden:wAt(sc,"lands","hidden"),
    studyW:wAt(sc,"lands","study"),only:wAt(sc,"lands","only"),take:c.take,next:c.next,fin:c.breath}));
  // the pull request on GitHub, the data team's review, Mei told what it touches (owners never review a pull request), the job that
  // deploys it, and the day it went in
  const hallA=(x,tt)=>{const ga=ag_in(tt,0.6,0.6);
      if(ga>0){dp_page(x,60,120,1080,700,{tool:"github",name:"GitHub",where:"uni-example/data-platform",title:"Policies by tag for the registrar",a:ga,behind:"opHall"});
        withA(x,ga,()=>{const tr=1-ag_in(tt,P.whole-0.2,0.4);
          if(tr>0)withA(x,tr,()=>OP_TREE.forEach(([f,add],i)=>{const a=add?ag_in(tt,P.codeW+0.2+i*0.15,0.4):1;if(a<=0)return;
            withA(x,a,()=>{dp_T(x,(add?"+ ":"")+f,92,330+i*46,{w:500,size:28,f:"mono",col:add?"green":"mut"});
              if(!add){const pa=ag_in(tt,P.grants-0.1+i*0.15,0.4);if(pa>0)withA(x,pa,()=>dp_pill(x,92+dp_tw(x,f,{w:500,size:28,f:"mono"})+24,330+i*46,"grants","grey",{size:28}));}});}));
          // each file replaces its policy whole
          const cd=ag_in(tt,P.whole+0.4,0.5);
          if(cd>0)withA(x,cd,()=>{dp_T(x,"registrar/policies/policies.sql",92,330,{w:500,size:28,f:"mono",col:"mut"});
            op_code(x,120,400,OP_SQL.slice(0,3).concat(["…"]),{lit:{0:["cyan",ag_in(tt,P.replaces,0.4)]}});});
          // the review asked of the data team leaves, then its approval comes in its place; then Mei is told what it touches
          const ap=ag_in(tt,P.reviews-0.1,0.6),rq=ag_in(tt,P.review-0.1,0.4)*(1-clamp(ap/0.45,0,1)),ok=clamp((ap-0.55)/0.45,0,1);
          if(rq>0)dp_T(x,"Review required · data team",92,690,{w:600,size:28,col:"mut",a:rq});
          if(ok>0){dp_tick(x,112,680,"green",ok);withA(x,ok,()=>dp_T(x,"Approved by the data team",148,690,{w:600,size:28,col:"green"}));}
          const tl=ag_in(tt,P.told-0.1,0.4);if(tl>0)withA(x,tl,()=>{const pw=dp_pill(x,92,746,"Told","cyan",{size:28});dp_T(x,"Mei Tanaka · what it touches",112+pw,746,{w:600,size:28});});});}
      const ja=ag_in(tt,P.runs-0.2,0.6);
      if(ja>0){dp_page(x,1170,120,690,520,{tool:"databricks",name:"Databricks",where:"Jobs & Pipelines",a:ja,behind:"opHall"});
        withA(x,ja,()=>{dp_T(x,"registrar_policies",1202,270,{w:500,size:30,f:"mono"});
          const r1=ag_in(tt,P.test-0.1,0.4),r2=ag_in(tt,P.prod-0.1,0.4);
          dp_rows(x,1202,290,[{t:"Run",w:320},{t:"Status",w:200}],[[{t:"test",a:r1},{tick:"green",p:ag_in(tt,P.test+0.3,0.4),a:r1}],[{t:"production",a:r2},{tick:"green",p:ag_in(tt,P.appr+0.4,0.4),a:r2}]]);
          const ra=ag_in(tt,P.rl-0.1,0.4);if(ra>0){withA(x,ra,()=>dp_T(x,"Run as",1202,530,{w:600,size:28,col:"mut"}));op_chip(x,1310,494,"registrar-loader","cyan",{gear:true,a:ra});}
          withA(x,ag_in(tt,P.appr-0.1,0.4),()=>dp_T(x,"release approver: approved",1202,600,{w:600,size:28,col:"green"}));});}
      // the day the policies went in: the rules in the morning, the study's grant in the afternoon
      const ka=ag_in(tt,P.order-0.2,0.5);
      if(ka>0){x.save();x.globalAlpha*=ka;dp_panel(x,1170,662,690,200,{col:"cyan",r:20,behind:"opHall",glowR:30});
        dp_T(x,"WEDNESDAY 14 OCTOBER 2026",1202,708,{w:700,size:28,ls:4,col:"cyan"});
        const m1=ag_in(tt,P.morning-0.1,0.4),m2=ag_in(tt,P.afternoon-0.1,0.4);
        withA(x,m1,()=>{dp_tick(x,1222,762,"green",m1);dp_T(x,"Morning · the policies",1258,772,{w:600,size:28});});
        withA(x,m2,()=>{dp_tick(x,1222,818,"green",m2);dp_T(x,"Afternoon · the study's grant",1258,828,{w:600,size:28});});x.restore();}};
  // on the road: one guide, written once, and a new chemical needs only a line
  const book=(x,tt)=>{const sl={id:"1806",guide:"137",name:"Phosphorus pentachloride",p:op_ph(tt,P.line-0.6,1.6)};
    op_yellow(x,{rows:OP_YELLOW_NOW,slip:sl,lit:{"1806":ag_in(tt,P.line+0.6,0.4)}});op_guide(x,"137",{});
    const gl=ag_io(tt,P.once-0.2,P.line-0.4,0.4);if(gl>0){x.save();x.globalAlpha*=gl*0.5;x.fillStyle="rgba(255,240,210,0.6)";rr(x,1020,334,730,70,10);x.fill();x.restore();}
    const p=op_ph(tt,P.line+0.6,0.6);if(p>0)dp_link(x,op_rowAt("1806",sl,OP_YELLOW_NOW),OP_GUIDEAT,OP_BROWN,p,{lw:3});
    const m=ag_in(tt,P.line+0.9,0.4);if(m>0){x.save();x.globalAlpha*=m;x.strokeStyle=rgba(OP_BROWN,0.9);x.lineWidth=3;rr(x,640,168,150,48,24);x.stroke();op_ink(x,"+ 1 line",662,202,{w:800,size:28});x.restore();}
    op_slipR(x,1800,20,"As the book is printed today","grey",{ink:true,behind:"opBook",size:28});};
  // here: a new table needs only its tags; the take-away, and the next film
  const hallB=(x,tt)=>{const out=1-ag_in(tt,P.take-0.3,0.6),nx=(1-op_ph(tt,P.here,1.0))*80,na=ag_in(tt,P.here,0.5),mk=ag_in(tt,P.tags-0.1,0.4);
      op_pane(x,tt,{k:0,marks:1,masked:1,a:out,sweep:op_ph(tt,P.hidden-0.3,2.2),
        extra:(c2)=>{if(na>0){c2.save();c2.globalAlpha*=na;op_mini(c2,1696+nx,292,{kind:"p",pers:4,first:9999},{marks:mk,masked:mk},tt);c2.restore();}}});
      op_slipR(x,1800,372,"+ its tags","cyan",{ink:true,a:ag_io(tt,P.tags-0.2,P.lands-0.3,0.35)*out,behind:"opHall"});
      const sa=ag_in(tt,P.studyW-0.2,0.45)*out;
      if(sa>0)op_rowsCard(x,1240,470,560,"",["learner_code","faculty_code"],[["a7772705…","HLT"],["3f9c0b12…","BUS"],["c41d7e08…","HLT"],["9b2e6a55…","EIT"]],
        {chip:"health_progress_study",cw:[300,240],mono:[true,true],a:sa,behind:"opHall",fold:{1:op_ph(tt,P.only,0.7),3:op_ph(tt,P.only+0.15,0.7)}});
      const tk=op_pop(tt,P.take+0.1,P.fin-0.4);dp_card(x,260,380,1400,{title:"The policy follows the tag, so new tables are protected the day they appear."},{col:"cyan",a:tk.a,k:tk.k,behind:"opHall"});
      const nk=op_pop(tt,P.next-0.1,P.fin-0.4);dp_card(x,560,600,800,{kick:"Next",title:"Copies that keep the rules"},{col:"cyan",a:nk.a,k:nk.k,behind:"opHall"});};
  ag_shots(ctx,S,t,sc.dur,[
    {at:0,later:true,place:"opHall",keys:[[0,960,540,1.0]],push:0.006,draw:hallA},
    {cut:true,at:P.road-0.2,place:"opBook",keys:[[P.road-0.2,960,540,1.0]],push:0.012,draw:book},
    {cut:true,at:P.here-0.2,place:"opHall",keys:[[P.here-0.2,960,540,1.0]],push:0.006,draw:hallB}]);
  dp_end(ctx,S,t,P.fin,OP_TITLE,"The policy follows the tag.","Film 6 of 8","Only what you may see");
  if(t>P.fin+1.2){setScreen(ctx,S);withA(ctx,ag_in(t,P.fin+1.4,0.8),()=>dp_T(ctx,"Next: Copies that keep the rules",960,790,{w:600,size:28,align:"center",col:"mut"}));}});

ag_cutInto(["mask","parts","ways","through","appears","code"]);
