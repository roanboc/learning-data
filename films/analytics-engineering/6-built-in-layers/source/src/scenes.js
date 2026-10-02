/* ===== Built in layers: scenes =====
   Eight chapters, as in ../script.md. The Savoy's kitchen in the 1890s: four stations, one job each, and a pass (the title
   over it); then the project's four layers, one chapter each: staging, intermediate, core, marts; one CTE, one step; how each
   is stored; and the rule written once, the pass, and the hand-off.
   Motion (the series' helpers in shared/src/weeds.js): every shot drifts, things arrive with a spring, and the four columns
   carry across the cuts from staging to the marts (where they fold into a strip), Planning's table opens into its file
   (marts → CTEs), and the columns fold again into the strip at the start of the last chapter.
   Sound: every effect in tools/score.py fires at the same moment, with the same word and offset, as the thing it belongs to here. */

const BL_G7={x0:60,cw:180,gap:10,y0:200,h:440};
// the state the columns carry from one chapter into the next
const BL_C2={lit:[1,0.25,0.25,0.25],chips:[7,0,0,0]},BL_C3={lit:[1,1,0.25,0.25],chips:[7,8,0,0]},BL_C4={lit:[1,1,1,0.25],chips:[7,8,4,0]};

/* ---------- 1. One station, one job ---------- */
scene("brigade",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);
  ctx.save();drift(ctx,t,sc,{z:0.035,y:520});
  // the camera starts close on the first stations and settles back as the brigade is named
  const cam=ease(fin(t,0.4,Math.max(1.6,c("stations")-0.6))),z=lerp(1.14,1,cam);ctx.translate(820,470);ctx.scale(z,z);ctx.translate(-820,-470);
  const st=["sauces","roasts","fish","vegetables"].map(s=>w("stations",s)),on=st.map(s=>fin(t,s-0.15,0.4));
  // the plate: in from the left, a part at each station, then slid to the pass
  const tP=w("ahead","every plate"),tC=w("ahead","checked");let px=-120;st.forEach((s,k)=>{px=lerp(px,BL_ST[k][1]+20,ease(fin(t,s-0.55,0.45)));});px=lerp(px,BL_PASS-30,ease(fin(t,tP-0.2,0.8)));
  const parts=st.reduce((a,s)=>a+fin(t,s+0.1,0.3),0),reach=fin(t,tC-0.3,0.7)*(1-fin(t,tC+2.2,0.8)),rot=ease(fin(t,tC+0.1,1.1))*0.8;
  bl_kitchen(ctx,t,{st,on,ahead:fin(t,w("ahead","prepared")-0.1,0.5)*(1-fin(t,c("bridge"),0.6)),plate:{x:px,parts,rot,card:fin(t,w("bridge","credential"),0.6)},reach,tint:fin(t,w("bridge","four stations"),1.4)});
  ctx.restore();
  // labels stay still, over the drifting room
  setScreen(ctx,S);yearTag(ctx,60,60,"1890s · the Savoy, London",CLAY,fin(t,0.5,0.7));
  arrive(ctx,500,60,t,w("savoy","brigade"),()=>tag(ctx,440,60,"a brigade",PARCH,{size:22}),{dy:12});
  BL_ST.forEach(([nm,x],k)=>{const lx=lerp(820+(x-820)*1.14,x,cam);arrive(ctx,lx,124,t,st[k]-0.15,()=>{tag(ctx,lx,124,nm,mix(PARCH,LAYER4[k][1],fin(t,w("bridge","four stations")+k*0.3,0.5)),{align:"center",size:22});},{dy:14});});
  arrive(ctx,BL_PASS,124,t,w("ahead","pass")-0.1,()=>tag(ctx,BL_PASS,124,"the pass",TRUST,{align:"center",size:22}),{dy:14});
  arrive(ctx,250,786,t,w("ahead","prepared"),()=>withA(ctx,1-fin(t,c("bridge"),0.6),()=>tag(ctx,250,786,"prepared ahead",PARCH,{align:"center",size:20})),{dy:12});
  // the bridge: the pass becomes a thin line with a tick; four stations, one job each
  const pl=fin(t,w("bridge","and a pass")-0.1,0.6);withA(ctx,pl,()=>{ctx.fillStyle="rgba(10,6,4,0.62)";ctx.fillRect(1545,150,360,770);ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(BL_PASS,250);ctx.lineTo(BL_PASS,lerp(250,880,ease(pl)));ctx.stroke();glow(ctx,BL_PASS,560,160,TRUST,0.2);});
  kt_gtick(ctx,BL_PASS,560,30,fin(t,w("bridge","and a pass")+0.4,0.4));
  arrive(ctx,780,860,t,w("bridge","one job each"),()=>tag(ctx,780,860,"four stations · one job each",WEED,{align:"center",size:22}),{dy:14});
  weedsTitle(ctx,S,t,B,"Built in layers","each layer one job; each CTE one step",WEED);
  fadeIn(ctx,S,t);vign(ctx,S);});

/* ---------- 2. Staging ---------- */
const BL_STGCODE=["renamed as (","    select","        nullif(lower(trim(customer_email)), '') as email,","        …","    from source","),","keyed as (","    select","        {{ business_key('SC', 'email') }} as customer_bk,","        *","    from renamed",")","select","    {{ hash_key(['customer_bk']) }} as customer_key,","    *","from keyed"];
const BL_DRAFT=["with","source as (","    select * from {{ source('short_courses', 'learners') }}","),","renamed as (","    select","        nullif(lower(trim(customer_email)), '') as email,","        trim(customer_name) as customer_name,","        …"];
scene("staging",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03});
  const cD=c("draft"),cF=c("first"),cJ=c("job"),cN=c("nojoin"),outA=1-fin(t,cF-0.4,0.6);
  // the tests are written, and the loop is at step 6: build
  withA(ctx,outA,()=>{arrive(ctx,330,270,t,0.2,()=>withA(ctx,1-fin(t,cD+0.4,0.6),()=>{bl_stepLoop(ctx,330,280,210,140,t,{on:STEPS10.map((s,i)=>i===5?1:0.25)});
      tag(ctx,330,490,"step 6 · build in layers",WEED,{align:"center",size:22});}),{d:1});
    // the tests: grey (not run), red under the agent's first draft
    const tR=w("draft","watches them fail");arrive(ctx,1420,350,t,w("red","tests")-0.2,()=>bl_tests(ctx,1000,140,840,{p:clamp((t-w("red","tests"))/1.4,0,1),red:BL_TESTS.map((s,i)=>fin(t,tR+i*0.12,0.3))}),{dy:30});
    // the agent opens its skill, drafts, runs the tests, then writes the least code; Jun reviews
    arrive(ctx,620,680,t,cD-0.1,()=>bl_code(ctx,80,600,1100,"skills/draft-a-model/SKILL.md",["The contract and the tests say what done looks like. Write them first, then the least SQL that","turns them green, in the right layer."],{edge:KT_AI,p:clamp((t-cD)/1.4,0,1),lit:{0:fin(t,w("draft","least code"),0.5),1:fin(t,w("draft","least code"),0.5)},litCol:KT_AI}),{dy:30});
    const dA=w("draft","first draft");arrive(ctx,500,350,t,dA-0.2,()=>bl_code(ctx,80,140,860,"models/staging/short_courses/stg_short_courses__learners.sql",BL_DRAFT,{edge:SRC3[2][1],p:clamp((t-dA)/2.2,0,0.55)+0.45*clamp((t-w("draft","least code"))/1.8,0,1),hi:pulseAt(t,w("draft","Jun reviews"),1.4)}),{dy:30});
    kt_agent(ctx,1300,690,26,t,{a:fin(t,cD-0.2,0.5),busy:fin(t,dA,0.5),label:"the agent"});
    // Jun stands clear of the three-line caption (its box reaches up to about y 840): his name and role beside him, not under
    arrive(ctx,1640,690,t,w("draft","Jun reviews")-0.2,()=>{person(ctx,"jun",1560,800,0.41,{pose:"stand",expr:"calm",t});roleTag(ctx,1735,690,"jun");},{dy:20,from:0.94});
    kt_gtick(ctx,930,150,20,fin(t,w("draft","every line")+0.2,0.35));});
  // the first station: the four layers as columns; staging fills with seven views
  const colA=fin(t,cF-0.3,0.6),chT=w("first","seven");
  if(colA>0)arrive(ctx,500,390,t,cF-0.3,()=>{
    const hi=[{}];if(t>cN){hi[0][5]=fin(t,w("nojoin","customer"),0.4);hi[0][0]=fin(t,w("nojoin","No joins"),0.3)*(1-fin(t,w("nojoin","no rules"),0.5));}
    bl_cols(ctx,t,{lit:[fin(t,w("first","staging")-0.2,0.5)*0.75+0.25,0.25,0.25,0.25],chips:[7*clamp((t-chT+0.6)/1.6,0,1),0,0,0],hi,count:[fin(t,chT+1.2,0.5),0,0,0],
      say:[{5:["customer",fin(t,w("nojoin","still called a customer"),0.5),SRC3[2][1]]}]});
    // no joins: a dashed line tries to reach from the pink file to the blue one, and fades with a cross
    const nj=w("nojoin","No joins"),[ax,ay,aw,ah]=bl_chipRect(0,5),[bx,by,,bh]=bl_chipRect(0,0),jp=fin(t,nj-0.1,0.7),jo=1-fin(t,nj+1.2,0.6);
    if(jp>0)withA(ctx,jo,()=>{arrowTo(ctx,ax+aw-6,ay+ah/2,bx+aw-6,by+bh/2,BAD,0.9,{p:jp,bend:-0.35,dash:[8,8],head:12});cross_(ctx,ax+aw+40,(ay+by)/2+20,30,BAD,fin(t,nj+0.4,0.3));});
  },{d:1,from:0.94});
  // the layers table, then one pink file, each part lighting as it's named
  const tbA=fin(t,w("first","One model")-0.2,0.5)*(1-fin(t,cJ-0.2,0.5));
  if(tbA>0)arrive(ctx,1425,330,t,w("first","One model")-0.2,()=>withA(ctx,tbA,()=>bl_layersTable(ctx,990,140,870,t,{on:[1,0.3,0.3,0.3]})),{dy:30});
  const L=(s,o)=>fin(t,w("job",s,o),0.4);
  arrive(ctx,1425,430,t,cJ-0.1,()=>bl_code(ctx,990,140,870,"models/staging/short_courses/stg_short_courses__learners.sql",BL_STGCODE,{edge:SRC3[2][1],p:clamp((t-cJ+0.1)/1.6,0,1),
    lit:{2:Math.max(L("renames"),L("trims")),3:L("casts")*(1-L("trims")),8:Math.max(L("readable key"),fin(t,w("nojoin","customer"),0.4)),13:L("hash")},litCol:SRC3[2][1]}),{dy:30});
  [["rename · cast",w("job","renames")],["trim · one case",w("job","trims")],["readable key · key set",w("job","readable key")],["hash",w("job","hash")]].forEach(([s,tt],i)=>arrive(ctx,1000,800,t,tt,()=>withA(ctx,1-fin(t,cN-0.3,0.4),()=>tag(ctx,1000+[0,190,400,680][i],790,s,SRC3[2][1],{size:20})),{dy:12}));
  arrive(ctx,1000,800,t,w("nojoin","No joins"),()=>{tag(ctx,1000,790,"no joins",BAD,{size:20});withA(ctx,fin(t,w("nojoin","no rules"),0.4),()=>tag(ctx,1140,790,"no rules",BAD,{size:20}));withA(ctx,fin(t,w("nojoin","still called"),0.4),()=>tag(ctx,1280,790,"still a customer",SRC3[2][1],{size:20}));},{dy:12});
  ctx.restore();vign(ctx,S);});
// the layers table of docs/conventions.md, trimmed and drawn as the table it is; o.on[i] lights a row
function bl_layersTable(ctx,x,y,w,t,o){o=o||{};const R=[["Staging","One model per source table: rename, cast, add keys qualified by their key set and their hashes. No joins, no rules. …","private","view"],
    ["Intermediate","Steps, not products: match keys, stitch timelines, apply business rules. …","private","view"],["Core","One model per entity and relationship at a declared grain. The enterprise contract, versioned: …","public","table (incremental where it pays)"],
    ["Marts","Built for one consumer. The consumer contract.","protected","table"]],cx=[x+22,x+150,x+575,x+705],cw=[120,410,120,150];
  const rows=R.map(r=>[1,3].map(k=>wrapT(ctx,r[k],0,0,cw[k],{size:18,measure:true})));let h=84+44;rows.forEach(r=>{h+=Math.max(r[0].length,r[1].length)*24+18;});
  glass(ctx,x,y,w,h,14,[170,205,255],{glow:12,ea:0.7,fill:"rgba(6,10,20,0.96)"});ctx.fillStyle=rgba([170,205,255],0.9);rr(ctx,x+18,y+18,11,11,3);ctx.fill();
  T(ctx,"docs/conventions.md",x+38,y+30,{f:"mono",w:500,size:18,color:rgba([170,205,255],1)});T(ctx,BL_RUN,x+38,y+58,{w:600,size:18,color:rgba(SOFT,1)});
  ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+72,w-28,1.2);
  ["Layer","Job","Access","Materialised"].forEach((s,k)=>T(ctx,s,cx[k],y+108,{w:800,size:18,color:rgba(SOFT,1)}));
  let yy=y+128;R.forEach((r,i)=>{const on=o.on?o.on[i]:1,c=LAYER4[i][1],nl=Math.max(rows[i][0].length,rows[i][1].length);withA(ctx,0.35+0.65*on,()=>{if(on>0.6)withA(ctx,on,()=>{ctx.fillStyle=rgba(c,0.12);rr(ctx,x+10,yy,w-20,nl*24+12,8);ctx.fill();});
      T(ctx,r[0],cx[0],yy+24,{w:800,size:18,color:rgba(c,1)});rows[i][0].forEach((l,m)=>T(ctx,l,cx[1],yy+24+m*24,{size:18}));T(ctx,r[2],cx[2],yy+24,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});rows[i][1].forEach((l,m)=>T(ctx,l,cx[3],yy+24+m*24,{f:"mono",w:500,size:18,color:rgba(SOFT,1)}));});
    yy+=nl*24+18;});return h;}

/* ---------- 3. Intermediate ---------- */
const BL_FEED=[[0,3,5],[0,3,5],[0,3,5],[0],[0,3,5],[2,4,6],[2,4],[1,2]];
const BL_TL=["matched_keys · student_records · platform_users","course_customers · status_map","student_versions","platform_versions","customer_versions","versions","change_dates","held","stitched","resolved","translated","compared","changed"];
scene("intermediate",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,x:600});
  const cL=c("list"),cW=c("words"),cR=c("recipe"),chT=w("steps","Eight"),pk=[[2,"Match"],[4,"Stitch"],[5,"Gather"],[7,"Apply"]];
  const hi=[{},{}];pk.forEach(([j,s])=>{hi[1][j]=fin(t,w("list",s)-0.1,0.4)*(1-fin(t,cR-0.3,0.6));});
  // the customer's tag lifts off the staging file and lands on the learners step, as a learner
  const tw0=w("words","a customer"),fly=fin(t,tw0,1.2),land=fin(t,tw0+1.1,0.4);
  bl_cols(ctx,t,{lit:[1,fin(t,0.2,0.6)*0.75+0.25,0.25,0.25],chips:[7,8*clamp((t-chT+0.4)/1.8,0,1),0,0],hi,count:[1,fin(t,chT+1.6,0.5),0,0],
    say:[{5:["customer",fly>0?0:1,SRC3[2][1]]},{3:["learner",land,BL_VIO]}]});
  // each step reads from the staging files: short lines in the gap between the columns
  BL_FEED.forEach((src,m)=>{const q=clamp(8*clamp((t-chT+0.4)/1.8,0,1)-m,0,1);if(q<=0)return;const[ix,iy,,ih]=bl_chipRect(1,m);src.forEach(j=>{const[sx,sy,sw,sh]=bl_chipRect(0,j);ctx.strokeStyle=rgba(BL_VIO,0.35*q);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(sx+sw,sy+sh/2);ctx.lineTo(ix,iy+ih/2);ctx.stroke();});});
  if(fly>0&&land<1){const[ax,ay,,ah]=bl_chipRect(0,5),[bx,by,,bh]=bl_chipRect(1,3),e=ease(fly),fx=lerp(ax+24,bx+24,e),fy=lerp(ay+ah/2,by+bh/2,e)-Math.sin(Math.PI*e)*60;
    withA(ctx,1-land,()=>tag(ctx,fx,fy,fly<0.6?"customer":"learner",mix(SRC3[2][1],BL_VIO,fin(fly,0.45,0.3)),{size:18}));}
  // the conventions' line, then four steps picked out, then one model's recipe
  const rOut=1-fin(t,cR-0.3,0.5);
  arrive(ctx,1425,220,t,w("steps","step, not a product")-0.2,()=>withA(ctx,rOut,()=>bl_code(ctx,990,140,870,"docs/conventions.md",["Steps, not products: match keys, stitch timelines, apply","business rules. Translates the source's words into the model's."],{edge:BL_VIO,lit:{0:fin(t,w("steps","step, not a product"),0.5),1:fin(t,cW,0.5)},litCol:BL_VIO})),{dy:30});
  [["int_learner_keys_matched","match keys","Match"],["int_learner_timeline","one timeline","Stitch"],["int_credentials_unioned","three systems, one list","Gather"],["int_credit_towards_award","the credit rule","Apply"]].forEach(([f,lab,s],i)=>{const y=350+i*92;
    arrive(ctx,1200,y,t,w("list",s)-0.2,()=>withA(ctx,rOut,()=>{glass(ctx,990,y-34,870,76,14,BL_VIO,{glow:8+10*hi[1][pk[i][0]],ea:0.6,fill:"rgba(8,10,24,0.95)"});
      T(ctx,f,1014,y-4,{f:"mono",w:500,size:18,color:rgba(BL_VIO,1)});T(ctx,lab,1014,y+26,{w:700,size:20});}),{dy:20});});
  arrive(ctx,1200,756,t,cW,()=>withA(ctx,rOut,()=>tag(ctx,1000,740,"customer → learner",BL_VIO,{size:20})),{dy:12});
  const rp=clamp((t-w("recipe","top to bottom"))/2.8,0,1);
  arrive(ctx,1425,380,t,cR-0.1,()=>bl_code(ctx,990,140,870,"CTE names from models/intermediate/int_learner_timeline.sql",BL_TL,{edge:BL_VIO,lit:Object.fromEntries(BL_TL.map((s,i)=>[i,i<2?0:clamp(rp*11-(i-2),0,1)])),litCol:BL_VIO,dim:{0:0.4,1:0.4}}),{dy:30});
  arrive(ctx,1425,660,t,w("recipe","recipe"),()=>tag(ctx,1425,660,"the recipe: one step per name",BL_VIO,{align:"center",size:20}),{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Core ---------- */
const BL_COREY=["    core:","      +materialized: table","      +schema: core","      +group: credential_model","      +access: public","      +contract:","        enforced: true"];
const BL_AWARD=["with","awards as (","    select * from {{ ref('stg_student_system__awards') }}",")","-- one source and nothing to resolve: no intermediate step needed","select","    award_key,","    award_bk,","    cast(recorded_from as date) as valid_from,","    …","from awards"];
scene("core",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,x:600});
  const cC=c("contract"),cG=c("green"),cA=c("award"),cN=c("noor"),nw=["learner","an award","a credential","credit towards"].map(s=>w("names",s));
  const nodes=nw.reduce((a,s)=>a+fin(t,s-0.2,0.6),0),gW=w("green","green");
  bl_cols(ctx,t,{lit:[1,1,fin(t,0.2,0.6)*0.75+0.25,0.25],chips:[7,8,nodes,0],count:[1,1,fin(t,cC,0.5),0],bp:fin(t,w("names","blueprint")-0.2,0.8)*0.35,
    hi:[{1:fin(t,cA,0.4)*(1-fin(t,cN,0.6))},{},{1:fin(t,w("award","core directly"),0.4)*(1-fin(t,cN+0.5,0.6))}],say:[{},{3:["learner",1,BL_VIO]}]});
  // the award skips intermediate: a line from its staging file, over the steps, straight to the core
  const ap=fin(t,cA+0.2,1.4);if(ap>0){const[sx,sy,sw,sh]=bl_chipRect(0,1),[nx,ny,,nh]=bl_chipRect(2,1),pts=[[sx+sw,sy+sh/2],[277,sy+sh/2],[277,118],[501,118],[501,ny+nh/2],[nx,ny+nh/2]];
    withA(ctx,1-fin(t,cN+0.6,0.6),()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=3;ctx.shadowColor=rgba(TRUST,0.6);ctx.shadowBlur=8;ctx.beginPath();let tot=0;const seg=[];for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(d);tot+=d;}
      let left=ap*tot;ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length&&left>0;i++){const f=Math.min(1,left/seg[i-1]);ctx.lineTo(lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f));left-=seg[i-1];}ctx.stroke();ctx.restore();
      if(ap>=0.98){ctx.fillStyle=rgba(TRUST,1);ctx.beginPath();ctx.moveTo(nx,ny+nh/2);ctx.lineTo(nx-14,ny+nh/2-8);ctx.lineTo(nx-14,ny+nh/2+8);ctx.closePath();ctx.fill();}});}
  // the blueprint, drawn small enough for its labels to stay readable: Learner holds Credential, which counts towards an Award
function bl_bpModel(ctx,t,t0,hiT){const X=[1100,1425,1750],y=380,bw=180,bh=72,K=["learner","cred","award"];
  K.forEach((k,i)=>{const q=fin(t,t0-0.2+i*0.3,0.5);bpBox(ctx,X[i]-bw/2,y-bh/2,bw,bh,BPE[k][0],BPE[k][1],1,{a:q,hi:fin(t,hiT[i],0.4)*(1-fin(t,hiT[i]+1.2,0.6)),size:24});});
  [["holds",0],["counts towards",1]].forEach(([lab,i])=>{const q=fin(t,t0+0.6+i*0.4,0.6);if(q<=0)return;const xa=X[i]+bw/2,xb=X[i+1]-bw/2;ctx.save();ctx.strokeStyle=rgba(BPL,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(xa,y);ctx.lineTo(lerp(xa,xb,q),y);ctx.stroke();ctx.restore();
    withA(ctx,fin(q,0.6,0.4),()=>T(ctx,lab,(xa+xb)/2,y-48,{w:600,size:18,align:"center",color:rgba(BPL,0.95)}));});}
  // the blueprint behind them: the same entities, white on blue, until the core's config takes its place
  const bpA=fin(t,w("names","blueprint")-0.3,0.8)*(1-fin(t,cC-0.5,0.5));
  if(bpA>0)arrive(ctx,1425,370,t,w("names","blueprint")-0.3,()=>withA(ctx,bpA,()=>{bpPaper(ctx,990,160,870,420,1,{});bl_bpModel(ctx,t,w("names","learner"),[w("names","learner"),w("names","a credential"),w("names","an award")]);
    T(ctx,"the blueprint",1010,560,{w:700,size:20,color:rgba(BPL,0.95)});}),{dy:30});
  // the core's folder config, then the tests, carried from staging: green in a wave
  const pA=1-fin(t,cA-0.2,0.5);
  arrive(ctx,1425,290,t,cC-0.2,()=>withA(ctx,pA,()=>bl_code(ctx,990,140,870,"dbt_project.yml",BL_COREY,{edge:TRUST,p:clamp((t-cC)/1.2,0,1),lit:{4:fin(t,w("contract","public"),0.4),5:fin(t,w("contract","enforced"),0.4),6:fin(t,w("contract","enforced"),0.4)}})),{dy:30});
  arrive(ctx,1425,680,t,cG-0.4,()=>withA(ctx,pA,()=>bl_tests(ctx,990,470,870,{red:BL_TESTS.map(()=>1),green:BL_TESTS.map((s,i)=>fin(t,gW+i*0.16,0.3))})),{dy:30});
  [["declared grain",w("contract","grain")],["public",w("contract","public")],["contract enforced",w("contract","enforced")]].forEach(([s,tt],i)=>arrive(ctx,560,820,t,tt,()=>withA(ctx,1-fin(t,cA-0.2,0.5),()=>tag(ctx,[60,250,380][i],820,s,TRUST,{size:20})),{dy:12}));
  arrive(ctx,1425,350,t,cA+0.6,()=>withA(ctx,1-fin(t,cN-0.2,0.5)*0.0,()=>bl_code(ctx,990,140,870,"models/core/core_award.sql",BL_AWARD,{edge:TRUST,p:clamp((t-cA-0.6)/1.4,0,1),lit:{4:fin(t,w("award","nothing to resolve"),0.4),2:fin(t,w("award","staging feeds"),0.4)}})),{dy:30});
  arrive(ctx,300,820,t,w("award","one source"),()=>withA(ctx,1-fin(t,cN,0.5),()=>tag(ctx,60,820,"the award: one source, nothing to resolve",TRUST,{size:20})),{dy:12});
  // Noor reviews the core, and approves it
  arrive(ctx,1300,860,t,cN-0.2,()=>{person(ctx,"noor",1300,820,0.46,{pose:"explain",expr:"calm",t});roleTag(ctx,1300,850,"noor");},{dy:20,from:0.94});
  kt_gtick(ctx,700,150,20,fin(t,w("noor","her model"),0.35));
  ctx.restore();vign(ctx,S);});

/* ---------- 5. Marts ---------- */
const BL_WALLET=["  - name: mart_wallet__learners","    description: >","      Who a learner is, what they hold, and how far they are towards the award they're enrolled","      in, as it is now: each entity's version valid today. One wide row, so the app reads a","      learner in one lookup.","    config:","      meta:","        grain: One row per learner, as it is now"];
scene("marts",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,x:960,y:400});
  const cF=c("fact"),cW=c("wide"),cC=c("core"),k=fin(t,w("one","shaped")-0.2,1.3);
  bl_cols(ctx,t,{k,lit:[1,1,1,fin(t,0.2,0.6)*0.75+0.25],chips:[7,8,4,3*clamp((t-w("one","marts")+0.2)/1.0,0,1)],count:[1,1,1,1],say:[{},{3:["learner",1,BL_VIO]}]});
  // the consumers
  // the consumers arrive once the columns have folded out of their way
  const tB=Math.max(w("one","one consumer"),w("one","shaped")+1.0);
  arrive(ctx,150,240,t,tB,()=>bl_badge(ctx,150,240,"Planning",1),{dy:14});
  arrive(ctx,790,470,t,tB+0.3,()=>bl_badge(ctx,790,470,"the wallet",1),{dy:14});
  // Planning's: long and narrow, 73 rows, sorted into faculties
  const tp=clamp((t-cF+0.2)/1.6,0,1);bl_planTable(ctx,140,290,260,570,t,{a:fin(t,cF-0.3,0.4),p:tp,sort:fin(t,w("fact","count by faculty")-0.2,1.2),labels:fin(t,w("fact","count by faculty")+0.6,0.5)});
  arrive(ctx,500,250,t,w("fact","one per learner"),()=>{T(ctx,"One row per learner per award,",330,236,{w:700,size:22});T(ctx,"as at census date",330,266,{w:700,size:22,color:rgba(BL_MART,1)});},{dy:12});
  arrive(ctx,280,896,t,w("fact","seventy-three"),()=>tag(ctx,140,896,"73 rows · 17 columns",BL_MART,{size:20}),{dy:12});
  // the wallet's: one wide row, fourteen columns; a finger taps it once
  const wp=clamp((t-cW+0.1)/1.8,0,1),tap=pulseAt(t,w("wide","one lookup"),0.9);
  bl_wideRow(ctx,960,440,900,t,{a:fin(t,cW-0.2,0.4),p:wp,tap});
  const hx=1400,hy=lerp(560,500,ease(fin(t,w("wide","one lookup")-0.5,0.5)))+tap*-14;withA(ctx,fin(t,w("wide","one lookup")-0.6,0.4)*(1-fin(t,w("wide","one lookup")+1.0,0.4)),()=>bl_hand(ctx,hx,hy+60,1.6,Math.PI,[226,186,150],"point"));
  arrive(ctx,1240,560,t,w("wide","one lookup"),()=>tag(ctx,1240,560,"one lookup",BL_MART,{align:"center",size:20}),{dy:12});
  arrive(ctx,1320,720,t,w("wide","one lookup")+0.8,()=>bl_code(ctx,780,600,1080,"models/marts/wallet/_wallet__models.yml",BL_WALLET,{edge:BL_MART,lh:28,p:clamp((t-w("wide","one lookup")-0.8)/1.4,0,1),lit:{4:fin(t,cC-0.6,0.5),7:fin(t,cC-0.3,0.5)},litCol:BL_MART}),{dy:30});
  // each mart builds on the core; never on another mart
  const nv=w("core","never");const coreX=60+2*452,cb=164;
  [[150,212,1000],[790,442,1180]].forEach(([x0,y0,x1],i)=>{const q=fin(t,w("core","on the core")+i*0.2,0.8);if(q<=0)return;const pts=[[x0,y0],[x0,186],[x1,186],[x1,cb+6]];
    ctx.save();ctx.strokeStyle=rgba(TRUST,0.9);ctx.lineWidth=3;ctx.shadowColor=rgba(TRUST,0.6);ctx.shadowBlur=8;ctx.beginPath();let tot=0,seg=[];for(let k=1;k<4;k++){const d=Math.hypot(pts[k][0]-pts[k-1][0],pts[k][1]-pts[k-1][1]);seg.push(d);tot+=d;}let left=q*tot;ctx.moveTo(x0,y0);
    for(let k=1;k<4&&left>0;k++){const f=Math.min(1,left/seg[k-1]);ctx.lineTo(lerp(pts[k-1][0],pts[k][0],f),lerp(pts[k-1][1],pts[k][1],f));left-=seg[k-1];}ctx.stroke();ctx.restore();
    if(q>0.98){ctx.fillStyle=rgba(TRUST,1);ctx.beginPath();ctx.moveTo(x1,cb);ctx.lineTo(x1-8,cb+14);ctx.lineTo(x1+8,cb+14);ctx.closePath();ctx.fill();}});
  const xa=fin(t,nv-0.1,0.6);if(xa>0){arrowTo(ctx,770,500,420,530,BAD,0.9,{p:xa,dash:[8,8],head:12,bend:0.15});cross_(ctx,600,520,34,BAD,fin(t,nv+0.3,0.3));}
  arrive(ctx,560,580,t,nv+0.3,()=>tag(ctx,470,574,"never on another mart",BAD,{size:18}),{dy:10});
  ctx.restore();vign(ctx,S);});

/* ---------- 6. One CTE, one step ---------- */
const BL_IMP=["learners as (","    select * from {{ ref('core_learner') }}","),","awards as (","    select * from {{ ref('core_award') }}","),","credit as (","    select * from {{ ref('core_credit_towards_award') }}","),"];
const BL_LOG=["-- as it was: each entity's version on the census date","learners_at_census as (","    select * from learners","    where {{ valid_at(census_date()) }}","),","…","measured as (","    select","        *,","        greatest(credit_points_required - credit_points_earned, 0) as credit_points_remaining","    from joined",")"];
const BL_FIN=["select","    {{ hash_key(['learner_bk', 'award_bk']) }} as learner_award_key,","    {{ census_date() }} as census_date,","    learner_key,","    award_key,","    …","    is_enrolled","        and learner_status = 'studying'","        and {{ is_near_award('credit_points_remaining') }}","        as is_near_award","from measured"];
const BL_CONV=["- **Import CTEs** first, one per model or source, each `select * from {{ ref(...) }}`.","- Then **logical CTEs**, one step each, named for what they hold (`learners_at_census`, not `cte2`). …","- A **final select** that lists every column, in the contract's order."];
scene("ctes",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025,x:700});
  const cI=c("import"),cL=c("logical"),cF=c("final"),cR=c("review"),F="models/marts/planning/mart_planning__near_award.sql",MC=[...BL_MART];
  // Planning's table, carried from the marts, closes into its file
  const op=fin(t,0,1.2);withA(ctx,1-op,()=>{bl_planTable(ctx,lerp(140,240,op),290,lerp(260,120,op),lerp(570,200,op),t,{sort:1,labels:1-fin(t,0,0.4)});bl_badge(ctx,150,240,"Planning",1);});
  bl_cols(ctx,t,{k:1,lit:[1,1,1,1],count:[1,1,1,1],a:LAYER4.map(()=>1-fin(t,0.2,0.8))});
  // CTE: the word, and what it stands for
  arrive(ctx,200,130,t,w("open","CTE")-0.2,()=>{T(ctx,"CTE",60,140,{w:800,size:44,color:rgba(BL_MART,1)});T(ctx,"common table expression · a named step",170,138,{w:600,size:24,color:rgba(SOFT,1)});},{dy:12});
  // the file, one section at a time; each folds shut as the next opens
  const fI=fin(t,cL-0.3,0.6),fL=fin(t,cF-0.3,0.6),fF=fin(t,cR-0.2,0.6);
  arrive(ctx,630,380,t,w("open","Open")+0.4,()=>bl_code(ctx,60,200,1150,F,BL_IMP,{edge:MC,sec:"import CTEs",size:19,lh:31,fold:fI,p:clamp((t-w("open","Open")-0.4)/1.6,0,1),lit:{1:fin(t,w("import","one for each"),0.4),4:fin(t,w("import","one for each")+0.2,0.4),7:fin(t,w("import","one for each")+0.4,0.4)},litCol:MC}),{dy:30});
  arrive(ctx,630,510,t,cL-0.3,()=>bl_code(ctx,60,290,1150,F,BL_LOG,{edge:MC,sec:"logical CTEs",size:19,lh:31,fold:fL,p:clamp((t-cL)/1.6,0,1),lit:{1:fin(t,w("logical","learners at census"),0.4),6:fin(t,w("logical","one step each"),0.4)},litCol:MC,
    strike:{1:["cte2",fin(t,w("logical","not CTE two"),0.4)]}}),{dy:30});
  arrive(ctx,630,590,t,cF-0.3,()=>bl_code(ctx,60,380,1150,F,BL_FIN,{edge:MC,sec:"final select",size:19,lh:31,fold:fF,p:clamp((t-cF)/1.6,0,1),lit:{3:fin(t,w("final","every column"),0.4),4:fin(t,w("final","every column")+0.15,0.4),1:fin(t,w("final","contract's order"),0.4),2:fin(t,w("final","contract's order")+0.15,0.4)},litCol:MC}),{dy:30});
  arrive(ctx,630,560,t,cR+0.1,()=>bl_code(ctx,60,470,1150,"docs/conventions.md",BL_CONV,{edge:[170,205,255],p:clamp((t-cR-0.1)/1.4,0,1)}),{dy:30});
  // the outline: the names, read top to bottom; then one column traced back to where it comes from
  const tr=w("review","every column"),T1=fin(t,tr-0.2,0.4),T2=fin(t,tr+0.4,0.4),T3=fin(t,tr+1.0,0.4);
  const P=bl_outlinePos(1290,200);
  arrive(ctx,1550,480,t,w("open","named steps")-0.2,()=>bl_outline(ctx,1290,200,t,{on:[Math.max(0.15,fin(t,cI,0.5)),fin(t,cL,0.5),fin(t,cF,0.5)].map(v=>Math.max(0.15,v)),
    trace:{measured:T1,joined:T2,awards_at_census:T3,credit_at_census:T3},cols:{measured:["credit_points_remaining",T1],awards_at_census:["credit_points_required",T3],credit_at_census:["credit_points_earned",T3]}}),{dy:30});
  if(T2>0){const[mx,my]=P.measured,[jx,jy]=P.joined,[ax,ay]=P.awards_at_census,[cx,cy]=P.credit_at_census;ctx.save();ctx.strokeStyle=rgba(TRUST,0.85);ctx.lineWidth=2.4;
    // one hop: left from the bullet into the gutter, up to the CTE it reads, and right to its bullet, with a small head
    const hop=(y0,y1,gx,q)=>{if(q<=0)return;const xb=mx-4,pts=[[xb,y0],[gx,y0],[gx,y1],[xb,y1]];let tot=0;const sg=[];for(let i=1;i<4;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);sg.push(d);tot+=d;}
      let left=q*tot;ctx.beginPath();ctx.moveTo(xb,y0);for(let i=1;i<4&&left>0;i++){const f=Math.min(1,left/sg[i-1]);ctx.lineTo(lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f));left-=sg[i-1];}ctx.stroke();
      if(q>0.98){ctx.fillStyle=rgba(TRUST,0.9);ctx.beginPath();ctx.moveTo(xb,y1);ctx.lineTo(xb-10,y1-6);ctx.lineTo(xb-10,y1+6);ctx.closePath();ctx.fill();}};
    hop(my-6,jy-6,mx-22,T2);hop(jy-6,ay-6,mx-40,T3);hop(jy-6,cy-6,mx-40,T3);ctx.restore();}
  arrive(ctx,1550,870,t,tr+1.2,()=>tag(ctx,1550,870,"every column, traced back",TRUST,{align:"center",size:20}),{dy:12});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Physical choices ---------- */
const BL_MATY=["    staging:","      +materialized: view","    …","    intermediate:","      +materialized: view","    …","    core:","      +materialized: table","    …","    marts:","      +materialized: table"];
const BL_INC=["{{","    config(","        materialized='incremental',","        unique_key='credential_key',","        incremental_strategy='merge',","        on_schema_change='append_new_columns',","        liquid_clustered_by=(['learner_key'] if target.type == 'databricks' else none)","    )","}}","…","    {% if is_incremental() %}","    where credentials.loaded_at > (select max(loaded_at) from {{ this }})","    …"];
// core_credential's rows inside the core's stone block: coloured by learner; cl (0..1) gathers them by learner; n how many
function bl_credRows(ctx,t,o){const[x,y,w,h]=bl_colRect(2,0,BL_G7),n=o.n,cl=ease(o.cl||0),rb=o.rebuild==null?1:o.rebuild;const cols=[[110,170,255],[255,176,96],[126,224,180],[214,150,255],[255,128,168]];
  const lab=Array.from({length:n},(_,i)=>Math.floor(hash(i,61)*5)),sorted=lab.map((l,i)=>i).sort((a,b)=>lab[a]-lab[b]||a-b);
  for(let i=0;i<n;i++){const r=sorted.indexOf(i),slot=lerp(i,r,cl),yy=y+h-46-slot*15;if((n-slot)/n>rb+0.02&&rb<1)continue;ctx.fillStyle=rgba(cols[lab[i]],0.85);rr(ctx,x+22,yy,w-44,9,4);ctx.fill();}}
scene("physical",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.03,x:500});
  const cV=c("views"),cT=c("tables"),cI=c("incr"),cK=c("cluster"),tw2=w("incr","Run it twice"),tf=w("cluster","in full");
  const mv=fin(t,w("views","views"),0.6),mt=fin(t,w("tables","tables"),0.6);
  arrive(ctx,430,420,t,0.2,()=>bl_cols(ctx,t,{g:BL_G7,lit:[0.4+0.6*mv,0.4+0.6*mv,0.4+0.6*mt,0.4+0.6*mt],count:[mv,mv,mt,mt],mat:Math.max(mv,mt),chips:[7*(1-mv),8*(1-mv),4*(1-mt),3*(1-mt)],say:[{},{3:["learner",1,BL_VIO]}]}),{d:1,from:0.94});
  arrive(ctx,430,130,t,0.4,()=>T(ctx,"how it's used → how it's stored",60,140,{w:800,size:26}),{dy:12});
  // the agent queries a view, and a few rows show through the glass
  const q=fin(t,w("views","the agent")-0.2,0.5)*(1-fin(t,cI,0.5)),[vx,vy,vw,vh]=bl_colRect(1,0,BL_G7);
  if(q>0){kt_agent(ctx,vx+vw/2,vy+150,22,t,{a:q,busy:1});withA(ctx,q,()=>{for(let i=0;i<4;i++){const rq=fin(t,w("views","query")+0.2+i*0.15,0.3);ctx.fillStyle=rgba(BL_VIO,0.7*rq);rr(ctx,vx+24,vy+220+i*22,vw-48,12,5);ctx.fill();}});}
  arrive(ctx,240,690,t,w("views","nothing stored"),()=>withA(ctx,1-fin(t,cI,0.5),()=>tag(ctx,60,690,"views · nothing stored twice",BL_STG,{size:20})),{dy:12});
  arrive(ctx,620,690,t,w("tables","read them"),()=>withA(ctx,1-fin(t,cI,0.5),()=>tag(ctx,440,690,"tables · read all day",TRUST,{size:20})),{dy:12});
  // core_credential: rows in stone; a new layer merges in on its key; a second run merges nothing; clustered by learner; rebuilt in full
  const[gx,gy,gw]=bl_colRect(2,0,BL_G7),rows=fin(t,cI,0.6),mg=fin(t,w("incr","merges")-0.1,1.4),cl=fin(t,w("cluster","clusters"),1.2),rb=t<tf?1:fin(t,tf+0.2,1.6);
  if(rows>0)withA(ctx,rows,()=>bl_credRows(ctx,t,{n:16+Math.round(4*mg),cl,rebuild:rb}));
  const sl=fin(t,w("incr","merges")-0.6,0.4);if(sl>0&&mg<1)withA(ctx,sl*(1-mg),()=>{const yy=lerp(150,gy+200,ease(mg));for(let i=0;i<4;i++){ctx.fillStyle=rgba(GOOD,0.9);rr(ctx,gx+22,yy+i*12,gw-44,8,4);ctx.fill();}});
  const tw3=fin(t,tw2,0.4)*(1-fin(t,cK,0.5));if(tw3>0)withA(ctx,tw3,()=>{ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(GOOD,0.8);ctx.lineWidth=2;rr(ctx,gx+16,150,gw-32,36,6);ctx.stroke();ctx.restore();});
  arrive(ctx,gx+gw+80,168,t,w("incr","merges nothing"),()=>withA(ctx,1-fin(t,cK,0.5),()=>tag(ctx,gx+gw+8,168,"0 rows to merge",GOOD,{size:18})),{dy:10});
  // the cards
  const yOut=fin(t,cI-0.2,0.5);
  arrive(ctx,1355,330,t,cV-0.2,()=>withA(ctx,1-yOut,()=>bl_code(ctx,850,140,1010,"dbt_project.yml",BL_MATY,{edge:[170,205,255],p:clamp((t-cV)/1.4,0,1),lit:{1:mv,4:mv,7:mt,10:mt}})),{dy:30});
  arrive(ctx,1355,380,t,cI,()=>bl_code(ctx,850,140,1010,"models/core/core_credential_v2.sql",BL_INC,{edge:TRUST,p:clamp((t-cI)/1.6,0,1),
    lit:{2:fin(t,w("incr","incremental"),0.4),3:fin(t,w("incr","credential's key"),0.4),4:fin(t,w("incr","merges"),0.4),10:fin(t,tw2,0.4),11:fin(t,tw2,0.4),6:fin(t,w("cluster","Databricks"),0.4)}}),{dy:30});
  arrive(ctx,1700,650,t,w("cluster","Databricks"),()=>tag(ctx,1860-tw(ctx,"Databricks · dbt Cloud",18,700)-26,650,"Databricks · dbt Cloud",[150,160,180],{size:18}),{dy:10});
  arrive(ctx,1100,700,t,w("cluster","clusters"),()=>tag(ctx,850,650,"clustered by learner",TRUST,{size:18}),{dy:10});
  arrive(ctx,450,760,t,tf-0.3,()=>bl_code(ctx,60,700,790,"terminal, in project/",["dbt build --select core_credential --full-refresh --profiles-dir ."],{edge:GOOD,p:clamp((t-tf+0.2)/1.0,0,1)}),{dy:24});
  ctx.restore();vign(ctx,S);});

/* ---------- 8. Metrics once ---------- */
const BL_MAC=["{#- Near an award: more than none left, and no more than the near_award_credit_points var. -#}","{% macro is_near_award(credit_points_remaining) -%}","    ({{ credit_points_remaining }} > 0 and {{ credit_points_remaining }} <= {{ var('near_award_credit_points') }})","{%- endmacro %}","…",
  "{% macro learners_near_graduate_certificate(group_by='faculty_code') -%}","    select","        {{ group_by }},","        count(distinct learner_key) as learners_near_graduate_certificate","    from {{ ref('mart_planning__near_award') }}","    where is_near_award","      and award_type = 'graduate certificate'","    group by {{ group_by }}","{%- endmacro %}"];
const BL_SEM=["  - name: learners_near_graduate_certificate","    label: Learners near a graduate certificate","    …","    type: simple","    type_params:","      measure: learners","    filter: |","      {{ Dimension('learner_award__is_near_award') }} and {{ Dimension('learner_award__award_type') }} = 'graduate certificate'"];
const BL_REC=["| census_date | faculty_name                  | in_the_mart | in_the_census_report | difference |","|  2026-03-31 | Faculty of Arts and Education |           2 |                    2 |          0 |","|  2026-03-31 | Faculty of Business           |           3 |                    3 |          0 |","|  2026-03-31 | Faculty of Engineering and IT |           5 |                    5 |          0 |","|  2026-03-31 | Faculty of Health             |           2 |                    2 |          0 |"];
// a pill in the flow of the rule: mono text in a glass capsule
function bl_pill(ctx,x,y,s,col,a){if(a<=0.01)return 0;const w=tw(ctx,s,20,500,"mono")+40;withA(ctx,a,()=>{glass(ctx,x,y-26,w,52,26,col,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.96)"});T(ctx,s,x+20,y+7,{f:"mono",w:500,size:20,color:rgba(col,1)});});return w;}
scene("once",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");setScreen(ctx,S);bg2(ctx);motes(ctx,t);
  ctx.save();drift(ctx,t,sc,{z:0.025});
  const cC=c("count"),cP=c("pass"),cE=c("each"),cN=c("next"),tM=w("count","the metric");
  // the columns, carried from the last chapter, fold into the strip
  const k=fin(t,0,1.4);withA(ctx,1-fin(t,cP-0.4,0.6),()=>bl_cols(ctx,t,{k,g:BL_G7,lit:[1,1,1,1],count:[1,1,1,1],mat:1-k}));
  // the rule and the count: one macro file; the var it reads, set once
  const aA=1-fin(t,cP-0.4,0.6);
  withA(ctx,aA,()=>{
    arrive(ctx,720,450,t,0.6,()=>bl_code(ctx,60,200,1320,"macros/near_award.sql",BL_MAC,{edge:TRUST,fold:fin(t,tM-0.3,0.6),p:clamp((t-0.8)/2.0,0,1),
      lit:{0:fin(t,w("rule","near an award"),0.4),1:fin(t,w("rule","near an award"),0.4),2:fin(t,w("rule","more than nothing"),0.4),5:fin(t,w("count","one macro")-0.3,0.4),8:fin(t,w("count","one macro"),0.4),10:fin(t,w("count","one macro")+0.2,0.4)}}),{dy:30});
    const vA=fin(t,w("rule","fifteen"),0.4);arrive(ctx,1640,280,t,w("rule","fifteen")-0.3,()=>bl_code(ctx,1420,200,440,"dbt_project.yml",["vars:","  near_award_credit_points: 15"],{edge:TRUST,lit:{1:vA},hi:pulseAt(t,w("rule","fifteen"),1.2)}),{dy:20});
    const ln=fin(t,w("rule","fifteen")+0.3,0.6)*(1-fin(t,tM-0.4,0.4));if(ln>0)withA(ctx,ln,()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.9);ctx.lineWidth=2.4;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(1420,bl_lineY(200,1));ctx.lineTo(lerp(1420,1340,ln),lerp(bl_lineY(200,1),bl_lineY(200,2),ln));ctx.stroke();ctx.restore();});
    // the flow: the rule writes one column; the count and the metric both read it
    const f0=tM+0.3,q=[fin(t,f0,0.4),fin(t,f0+0.3,0.4),fin(t,f0+0.6,0.4),fin(t,f0+0.9,0.4),fin(t,w("count","same column")-0.3,0.4)];
    const wA=bl_pill(ctx,60,400,"is_near_award()",TRUST,q[0]),wB=bl_pill(ctx,400,400,"column · is_near_award",BL_MART,q[1]),wC=bl_pill(ctx,790,400,"learners_near_graduate_certificate()",TRUST,q[2]),wD=bl_pill(ctx,1340,400,"reconcile_planning_with_census_report",GOOD,q[3]),wE=bl_pill(ctx,790,490,"metric · learners_near_graduate_certificate",KIND,q[4]);
    if(q[1]>0)arrowTo(ctx,60+wA+4,400,396,400,TRUST,q[1],{p:q[1],head:10});if(q[2]>0)arrowTo(ctx,400+wB+4,400,786,400,BL_MART,q[2],{p:q[2],head:10});if(q[3]>0)arrowTo(ctx,790+wC+4,400,1336,400,TRUST,q[3],{p:q[3],head:10});
    if(q[4]>0)arrowTo(ctx,400+wB-30,426,786,490,BL_MART,q[4],{p:q[4],bend:-0.15,head:10});
    arrive(ctx,960,700,t,w("count","semantic layer")-0.3,()=>bl_code(ctx,60,536,1800,"models/semantic/_semantic.yml",BL_SEM,{edge:KIND,p:clamp((t-w("count","semantic layer")+0.2)/1.4,0,1),lit:{7:fin(t,w("count","same column"),0.4)},litCol:KIND}),{dy:30});});
  // the pass returns: the reconciliation, faculty by faculty, and the build's line, green
  const pA=fin(t,cP-0.2,0.6)*(1-fin(t,cE-0.8,0.5));
  withA(ctx,pA,()=>{const mg=ctx.createLinearGradient(0,640,0,720);mg.addColorStop(0,"#cfc6b6");mg.addColorStop(1,"#8e8678");ctx.fillStyle=mg;ctx.fillRect(100,650,1720,60);ctx.strokeStyle=rgba(BL_BRASS,0.95);ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(100,650);ctx.lineTo(1820,650);ctx.stroke();
    arrive(ctx,960,330,t,cP,()=>bl_code(ctx,160,200,1600,"dbt show --select reconcile_census_report --profiles-dir .",BL_REC,{edge:GOOD,p:clamp((t-cP)/1.0,0,1),litCol:GOOD,lit:{1:fin(t,w("pass","faculty by faculty"),0.3),2:fin(t,w("pass","faculty by faculty")+0.25,0.3),3:fin(t,w("pass","faculty by faculty")+0.5,0.3),4:fin(t,w("pass","faculty by faculty")+0.75,0.3)}}),{dy:24});
    arrive(ctx,560,530,t,w("pass","Green")-0.2,()=>bl_code(ctx,160,470,800,"dbt build --profiles-dir .",["PASS reconcile_planning_with_census_report"],{edge:GOOD,lit:{0:1},litCol:GOOD}),{dy:20});
    const bt=fin(t,w("pass","twelve, and twelve"),0.8);bl_balance(ctx,1400,500,bt,(1-ease(fin(t,w("pass","and twelve"),0.9)))*0.18,{});
    arrive(ctx,1400,760,t,w("pass","Green"),()=>tag(ctx,1400,760,"12 · 12 · green",GOOD,{align:"center",size:22}),{dy:12});});
  // each layer, one job: the four columns beside the Savoy's four stations
  const eA=fin(t,cE-0.3,0.6)*(1-fin(t,cN-0.2,0.6));
  if(eA>0)withA(ctx,eA,()=>{ctx.save();rr(ctx,60,170,880,480,18);ctx.clip();ctx.translate(60,150);ctx.scale(0.47,0.47);bl_kitchen(ctx,t,{st:[0,0,0,0],on:[1,1,1,1],tint:1,plate:{x:BL_PASS-30,parts:4,card:1}});ctx.restore();
    ctx.strokeStyle=rgba(CLAY,0.7);ctx.lineWidth=2;rr(ctx,60,170,880,480,18);ctx.stroke();
    BL_ST.forEach(([nm,x],k)=>tag(ctx,60+x*0.47,700,nm,mix(PARCH,LAYER4[k][1],0.6),{align:"center",size:20}));
    bl_cols(ctx,t,{g:{x0:990,cw:200,gap:20,y0:170,h:480},lit:[1,1,1,1],count:[1,1,1,1],chips:[7,8,4,3],say:[{},{3:["learner",1,BL_VIO]}]});
    T(ctx,"the Savoy, 1890s",500,140,{w:700,size:22,align:"center",color:rgba(CLAY,1)});T(ctx,"the project",1430,140,{w:700,size:22,align:"center",color:rgba(WEED,1)});
    arrive(ctx,960,800,t,w("each","one step"),()=>tag(ctx,960,800,"each layer, one job · each CTE, one step",WEED,{align:"center",size:22}),{dy:12});});
  // one team, one project; but three own it
  const nA=fin(t,cN-0.2,0.6);
  if(nA>0)withA(ctx,nA,()=>{const nx=[160,430,760,1030];
    arrive(ctx,960,170,t,cN,()=>tag(ctx,700,170,"one team · one project",WEED,{align:"center",size:22}),{dy:12});
    ["learner","award","credential","credit towards award"].forEach((s,i)=>arrive(ctx,nx[i]+120,310,t,cN+0.2+i*0.1,()=>{glass(ctx,nx[i],270,240,80,14,TRUST,{glow:12,ea:0.85,fill:"rgba(26,20,8,0.94)"});T(ctx,s,nx[i]+120,318,{w:800,size:s.length>12?19:22,align:"center",color:rgba(mix(INK,TRUST,0.3),1)});},{dy:16}));
    const mA=fin(t,w("next","registrar")-0.2,0.5),tA=fin(t,w("next","learning team")-0.2,0.5),pA2=fin(t,w("next","Planning wants")-0.2,0.5);
    withA(ctx,mA,()=>{ctx.strokeStyle=rgba(BIZ,0.6);ctx.lineWidth=2;[[280,352],[550,352]].forEach(([x,y])=>{ctx.beginPath();ctx.moveTo(415,520);ctx.lineTo(x,y);ctx.stroke();});});
    arrive(ctx,415,780,t,w("next","registrar")-0.2,()=>{person(ctx,"mei",415,770,0.46,{pose:"stand",expr:"calm",t});T(ctx,"Mei",415,800,{w:800,size:24,align:"center"});T(ctx,"the registrar",415,828,{w:600,size:18,align:"center",color:rgba(SOFT,1)});},{dy:20,from:0.94});
    withA(ctx,tA,()=>{ctx.strokeStyle=rgba(BIZ,0.6);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(880,520);ctx.lineTo(880,412);ctx.stroke();});
    arrive(ctx,880,390,t,w("next","microcredentials")-0.2,()=>tag(ctx,880,390,"microcredentials",TRUST,{align:"center",size:18}),{dy:10});
    arrive(ctx,880,780,t,w("next","learning team")-0.2,()=>{person(ctx,"tom",880,770,0.46,{pose:"stand",expr:"calm",t});T(ctx,"Tom",880,800,{w:800,size:24,align:"center"});T(ctx,"the learning team",880,828,{w:600,size:18,align:"center",color:rgba(SOFT,1)});},{dy:20,from:0.94});
    // Planning lifts its mart towards a project of its own
    const lf=ease(fin(t,w("next","project of its own")-0.4,1.4));bl_frame(ctx,1440,250,400,420,pA2,"a project of its own");
    withA(ctx,pA2,()=>{const bx=lerp(1360,1520,lf),by=lerp(560,400,lf);bl_badge(ctx,bx,by,"Planning",1);glass(ctx,bx-30,by+50,240,56,10,BL_MART,{glow:10,ea:0.8,fill:"rgba(8,14,28,0.95)"});ctx.fillStyle=rgba(BL_MART,0.95);rr(ctx,bx-20,by+67,6,22,3);ctx.fill();T(ctx,"near award",bx-4,by+85,{w:700,size:18});});});
  ctx.restore();weedsEnd(ctx,S,t,B,"Built in layers",WEED,"Each layer one job; each CTE one step; each rule written once.");
  vign(ctx,S);});
