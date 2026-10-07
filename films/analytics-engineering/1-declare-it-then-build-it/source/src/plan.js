/* ===== Declare it, then build it: the film's own pictures (prefixed mt_) =====
   The 1870s blueprint: a small building's plan, printed in sunlight (the paper turns from pale yellow-green to blue, and the
   lines to white), copies for the trades, and an empty site; the ways to transform data; the shapes a model can take; the
   three stages of the series' middle way; and the eight films to come. */

// the plan of a small building, drawn round (x,y) at scale s in colour col; p (0..1) draws it; hl: {wall, thick, beam} callouts
function mt_house(ctx,x,y,s,col,p,o){o=o||{};if(p<=0)return;const hl=o.hl||{},lw=o.lw||1;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,0.95);ctx.fillStyle=rgba(col,0.95);ctx.lineCap="square";
  const q=k=>clamp(p*5-k,0,1),seg=(x0,y0,x1,y1,f)=>{if(f<=0)return;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,f),lerp(y0,y1,f));ctx.stroke();};
  // outer walls, drawn double: a wall one and a half bricks thick
  ctx.lineWidth=2.6*lw;const R=[[-300,-170],[300,-170],[300,170],[-300,170],[-300,-170]];for(let i=0;i<4;i++){seg(R[i][0],R[i][1],R[i+1][0],R[i+1][1],q(i*0.5));}
  const r2=[[-282,-152],[282,-152],[282,152],[-282,152],[-282,-152]];ctx.lineWidth=1.4*lw;for(let i=0;i<4;i++){seg(r2[i][0],r2[i][1],r2[i+1][0],r2[i+1][1],q(0.4+i*0.5));}
  // hatching inside the wall, then an inner wall, a door and two windows
  if(q(2.4)>0){ctx.save();ctx.globalAlpha*=q(2.4)*0.5;ctx.lineWidth=0.8;ctx.beginPath();ctx.rect(-300,-170,600,340);ctx.rect(-282,-152,564,304);ctx.clip("evenodd");for(let k=-700;k<700;k+=14){ctx.beginPath();ctx.moveTo(k,-180);ctx.lineTo(k+360,180);ctx.stroke();}ctx.restore();}
  ctx.lineWidth=2.2*lw;seg(40,-152,40,60,q(2.8));seg(40,110,40,152,q(3));
  if(q(3.2)>0){ctx.lineWidth=1.2*lw;ctx.beginPath();ctx.arc(40,110,50,-Math.PI/2,-Math.PI/2+Math.PI/2*q(3.2),false);ctx.stroke();}
  [[-200,-170],[180,-170]].forEach(([wx,wy])=>{if(q(3.4)<=0)return;ctx.fillStyle=rgba(o.paper||[20,60,130],1);ctx.fillRect(wx-40,wy-2,80,22);ctx.lineWidth=1.2*lw;ctx.strokeRect(wx-40,wy,80,18);seg(wx-40,wy+9,wx+40,wy+9,q(3.4));});
  // the beam over the big room, dashed
  if(q(3.8)>0){ctx.save();ctx.setLineDash([12,8]);ctx.lineWidth=1.6*lw;seg(-282,-10,40,-10,q(3.8));ctx.restore();}
  // a dimension line along the top
  if(q(4.2)>0){ctx.lineWidth=1*lw;seg(-300,-214,300,-214,q(4.2));seg(-300,-224,-300,-204,1);seg(300,-224,300,-204,q(4.2));T(ctx,"30 ft",0,-224,{f:"mono",w:500,size:18,align:"center",color:rgba(col,0.95)});}
  ctx.restore();}
// callouts on the plan, drawn over everything (frame included): a dot on the plan, a line out past the sheet's edge, and a label
// on its own dark pill, so it reads against anything. (x,y,s) is the plan's centre and scale; ex is the sheet's left and right edges
function mt_callouts(ctx,x,y,s,hl,ex){const C=[["wall",-300,40,"every wall",-1,120],["beam",-120,-10,"a beam: carries the floor above",-1,-10],["thick",291,-80,"1½ bricks thick",1,-110]];
  C.forEach(([k,px,py,lab,side,dy])=>{const a=hl[k]||0;if(a<=0)return;withA(ctx,a,()=>{const x0=x+px*s,y0=y+py*s,x1=side<0?ex[0]-30:ex[1]+30,y1=y+dy*s;
    ctx.strokeStyle=rgba(BPL,0.95);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.fillStyle=rgba(BPL,1);ctx.beginPath();ctx.arc(x0,y0,5,0,TAU);ctx.fill();
    tag(ctx,side<0?x1-tw(ctx,lab,22,700)-26:x1,y1,lab,PARCH,{size:22});});});}

// a sheet in a frame, printed in sunlight: u (0..1) is the exposure, from sensitised yellow-green to blue with white lines
function mt_print(ctx,x,y,w,h,u,t,o){o=o||{};const pap=[mix([214,208,150],BPP,ease(u)),mix([60,70,40],BPL,ease(u))];
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=28;ctx.shadowOffsetY=8;ctx.fillStyle=rgba(pap[0],1);ctx.fillRect(x,y,w,h);ctx.restore();
  if(u>0.5)bpPaper(ctx,x,y,w,h,fin(u,0.5,0.5),{title:o.title,sub:o.sub});
  const hs=Math.min(w/820,h/520);mt_house(ctx,x+w/2,y+h/2+20,hs,pap[1],o.p==null?1:o.p,{paper:pap[0]});
  if(o.frame){ctx.strokeStyle="rgba(90,62,36,0.95)";ctx.lineWidth=18;ctx.strokeRect(x-9,y-9,w+18,h+18);ctx.strokeStyle="rgba(150,110,70,0.6)";ctx.lineWidth=3;ctx.strokeRect(x-17,y-17,w+34,h+34);}
  if(o.hl)mt_callouts(ctx,x+w/2,y+h/2+20,hs,o.hl,[x-20,x+w+20]);}
// a copy handed to a trade: a small blueprint and the trade's tool
function mt_copy(ctx,x,y,w,trade,a,t){if(a<=0.01)return;withA(ctx,a,()=>{const h=w*0.64;mt_print(ctx,x,y,w,h,1,t,{});
  const tx=x+w/2,ty=y+h+56;ctx.save();ctx.translate(tx-70,ty-10);ctx.strokeStyle=rgba(CLAY,1);ctx.fillStyle=rgba(CLAY,0.85);ctx.lineWidth=3;ctx.lineCap="round";
    if(trade==="mason"){ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(18,-20);ctx.lineTo(30,6);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(-26,12);ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(-24,6);ctx.lineTo(30,-6);ctx.lineTo(30,6);ctx.lineTo(-24,14);ctx.closePath();ctx.fill();ctx.fillStyle=rgba([120,80,50],1);rr(ctx,-40,0,18,18,4);ctx.fill();}
    ctx.restore();T(ctx,trade,tx-30,ty+2,{w:700,size:22,color:rgba(PARCH,1)});});}
// an empty site: ground, stakes and a string line, waiting for bricks
function mt_site(ctx,y,t,a){if(a<=0.01)return;withA(ctx,a,()=>{const g=ctx.createLinearGradient(0,y,0,H);g.addColorStop(0,"rgba(90,64,40,0.9)");g.addColorStop(1,"rgba(30,20,12,1)");ctx.fillStyle=g;ctx.fillRect(0,y,W,H-y);
  ctx.strokeStyle="rgba(200,170,120,0.5)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(560,y+60);ctx.lineTo(1360,y+60);ctx.lineTo(1420,y+150);ctx.lineTo(500,y+150);ctx.closePath();ctx.stroke();
  [[560,60],[1360,60],[1420,150],[500,150]].forEach(([sx,sy])=>{ctx.fillStyle="rgba(170,120,70,1)";ctx.fillRect(sx-4,y+sy-34,8,40);});});}

// a way to transform data: a card with a small glyph; on (0..1) lights it, dim (0..1) greys it
function mt_tool(ctx,x,y,w,h,name,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const on=o.on||0,dim=o.dim||0,col=mix(mix(SOFT,[150,190,255],0.4),o.col||[255,140,90],on);
  withA(ctx,a*(1-0.6*dim),()=>{if(on>0)glow(ctx,x+w/2,y+h/2,w*0.6,o.col||[255,140,90],0.3*on);glass(ctx,x,y,w,h,16,col,{glow:10+14*on,ea:0.7,fill:"rgba(7,12,24,0.94)"});
    const gx=x+46,gy=y+h/2;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.4;
    if(k===0){rr(ctx,gx-20,gy-22,40,44,5);ctx.stroke();for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(gx-12,gy-10+i*10);ctx.lineTo(gx+12,gy-10+i*10);ctx.stroke();}}
    else if(k===1){ctx.beginPath();ctx.ellipse(gx,gy-14,18,7,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(gx-18,gy-14);ctx.lineTo(gx-18,gy+14);ctx.ellipse(gx,gy+14,18,7,0,Math.PI,0,true);ctx.lineTo(gx+18,gy-14);ctx.stroke();}
    else if(k===2){[-16,0,16].forEach((dx,i)=>{ctx.beginPath();ctx.arc(gx+dx,gy+(i===1?-10:8),6,0,TAU);ctx.fill();});ctx.beginPath();ctx.moveTo(gx-16,gy+8);ctx.lineTo(gx,gy-10);ctx.lineTo(gx+16,gy+8);ctx.stroke();}
    else{T(ctx,"{ }",gx,gy+9,{f:"mono",w:500,size:26,align:"center",color:rgba(col,1)});}
    ctx.restore();T(ctx,name,x+84,y+h/2+8,{w:800,size:24,color:rgba(mix(INK,col,on*0.3),1)});});}

// the shapes a model can take, named once in the series: a normalised core, stars, a data vault, anchors, hooks, wide tables
const MT_SHAPES=[["normalised core","core",[140,200,255]],["stars","star",KT_STAR],["data vault",0,[180,150,255]],["anchors",1,[120,205,240]],["hooks",2,[240,175,115]],["wide tables","wide",[250,190,90]]];
function mt_shape(ctx,k,x,y,s,t){const[,g,col]=MT_SHAPES[k];if(typeof g==="number"||g==="star"){kt_glyph(ctx,g,x,y,s,t);return;}
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  if(g==="core"){const P=[[-60,-30],[0,-30],[60,-30],[-30,24],[30,24]];[[0,1],[1,2],[0,3],[1,4],[3,4],[2,4]].forEach(([i,j])=>kt_ln(ctx,[P[i],P[j]],col,0.55));P.forEach(([px,py])=>kt_box(ctx,px,py,40,24,col));}
  else{ctx.fillStyle="rgba(8,14,28,0.95)";rr(ctx,-86,-18,172,36,6);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2;rr(ctx,-86,-18,172,36,6);ctx.stroke();
    for(let i=1;i<8;i++){ctx.strokeStyle=rgba(col,0.4);ctx.beginPath();ctx.moveTo(-86+i*21.5,-18);ctx.lineTo(-86+i*21.5,18);ctx.stroke();}ctx.fillStyle=rgba(col,0.9);rr(ctx,-86,-18,21.5,36,6);ctx.fill();T(ctx,"one row per learner",0,46,{w:600,size:13,align:"center",color:rgba(SOFT,1)});}
  ctx.restore();}
function mt_shapeCard(ctx,k,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=MT_SHAPES[k][2];withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:12,ea:0.75,fill:"rgba(7,12,24,0.93)"});
  T(ctx,MT_SHAPES[k][0],x+w/2,y+44,{w:800,size:23,align:"center",color:rgba(col,1)});mt_shape(ctx,k,x+w/2,y+140,1.2,t);
  if(o.four)KT_FOUR.forEach((f,j)=>kt_four(ctx,j,x+w/2+(j-1.5)*46,y+h-40,16,o.four[j]||0));});}
// the series' middle way, in three stages: business keys, every version, a wide row (with a small star where people need one)
function mt_middle(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const q=o.q||[1,1,1],sx=[x+w*0.14,x+w*0.5,x+w*0.86],cy=y+90;withA(ctx,a,()=>{
  for(let i=0;i<2;i++)arrowTo(ctx,sx[i]+120,cy,sx[i+1]-120,cy,WEED,Math.min(q[i],q[i+1]),{p:q[i+1],head:14});
  withA(ctx,q[0],()=>{kt_four(ctx,1,sx[0],cy,44,1);T(ctx,"integrate on business keys",sx[0],cy+100,{w:700,size:22,align:"center"});});
  withA(ctx,q[1],()=>{for(let i=0;i<4;i++){const yy=cy+30-i*20,xx=sx[1]-70+i*10;ctx.fillStyle="rgba(8,14,28,0.95)";rr(ctx,xx,yy-16,140,30,6);ctx.fill();ctx.strokeStyle=rgba([200,160,255],0.5+0.15*i);ctx.lineWidth=2;rr(ctx,xx,yy-16,140,30,6);ctx.stroke();}
    T(ctx,"v4",sx[1]+30,cy-45,{f:"mono",w:500,size:16,align:"center",color:rgba([200,160,255],1)});T(ctx,"keep every version",sx[1],cy+100,{w:700,size:22,align:"center"});});
  withA(ctx,q[2],()=>{mt_shape(ctx,5,sx[2]-20,cy-6,1.1,0);kt_glyph(ctx,"star",sx[2]+120,cy-40,0.5,0);T(ctx,"one wide row per entity",sx[2],cy+100,{w:700,size:22,align:"center"});T(ctx,"stars where people need them",sx[2],cy+130,{w:600,size:18,align:"center",color:rgba(SOFT,1)});});});}

// the eight films to come, with the steps each takes (0-based, on the loop of ten)
const MT_FILMS=[[2,"Start from a question",[0]],[3,"What makes it the same one",[1]],[4,"One row of what, and when",[2]],[5,"Promises and proofs",[3,4]],[6,"Built in layers",[5]],[7,"Who owns what",[9]],[8,"An agent on the team",[6,7]],[9,"Written once",[8]]];
function mt_filmCard(ctx,x,y,n,title,a,on){if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,title,20,700)+84;glass(ctx,x-w/2,y-28,w,56,14,mix(SOFT,WEED,on),{glow:10+10*on,ea:0.7,fill:"rgba(7,12,24,0.95)"});
  T(ctx,n+"",x-w/2+22,y+8,{f:"mono",w:500,size:20,color:rgba(WEED,1)});T(ctx,title,x-w/2+52,y+8,{w:700,size:20});});}

/* ---------- the labs' and scenarios' pictures ----------
   Added to the film bundle's LV registry (Keeping it true's true.js defines it; these keys are prefixed mt_ so they never clash).
   assets/from-words-to-data/learn.js calls each as f(ctx, w, h, state, L): a lab passes its state (sort: {pick, checked}; steps: {step}),
   a scenario passes {q}. Any words come from L.vis (the page's learn.en.js or learn.es.js), so each language draws its own. */
function mt_fit(c,w,h,bw,bh){const k=Math.min(w/bw,h/bh);c.translate((w-bw*k)/2,(h-bh*k)/2);c.scale(k,k);}
function mt_count(pick,b){return Object.values(pick||{}).filter(x=>x===b).length;}
Object.assign(LV,{
  // blueprint or building work: the blueprint on the left, a code file on the right, each counting what has been placed on it
  mt_bp:(c,w,h,st,L)=>{const V=L.vis;c.save();mt_fit(c,w,h,1920,640);
    bpPaper(c,60,60,860,480,1,{title:V.blueprint});bpModel(c,490,340,0.62,{b:1});
    codeFile(c,1000,60,860,"stg_student_system__learners.sql",["select","    student_id,","    lower(trim(email)) as email","from {{ source('student_system', 'learners') }}"],{edge:LAYER4[0][1],size:26,lh:48});
    tag(c,490,590,V.model+" · "+mt_count(st.pick,"model")+" "+V.placed,BPL,{align:"center",size:30});tag(c,1430,590,V.build+" · "+mt_count(st.pick,"build")+" "+V.placed,[150,190,255],{align:"center",size:30});c.restore();},
  // which files name the model: the project's graph, its core lit once the core has files in it
  mt_graph:(c,w,h,st,L)=>{c.save();mt_fit(c,w,h,1920,640);const n=mt_count(st.pick,"core");lineageGraph(c,100,70,1720,540,0,{core:n>0?1:0.35,dim:0.2});c.restore();},
  // where does it live: three cards, YAML, Markdown and SQL, each counting what has been placed in it
  mt_lives:(c,w,h,st,L)=>{const V=L.vis;c.save();mt_fit(c,w,h,1920,640);
    [[V.yaml,"yaml",TRUST,["meta: {grain: …}","data_tests: [unique]","contract: {enforced: true}"]],[V.md,"md",KIND,["definition: >","```mermaid","- id: DEC-STU-01"]],[V.sql,"sql",[150,176,214],["select …","from {{ ref(…) }}","join … using (…)"]]].forEach(([nm,k,col,ls],i)=>{
      codeFile(c,60+i*620,60,560,nm,ls,{edge:col,size:28,lh:52,h:360});tag(c,340+i*620,520,String(mt_count(st.pick,k))+" "+V.placed,col,{align:"center",size:30});});c.restore();},
  // four phases, ten steps: the steps in a row under their phases, lit up to the current step, with the agent above it
  mt_loop:(c,w,h,st,L)=>{const V=L.vis,k=st.step||0;c.save();mt_fit(c,w,h,1920,640);
    STEPS10.forEach((s,i)=>{const x=110+i*190,on=i<=k,col=on?WEED:SOFT;glow(c,x,300,on?60:0,WEED,0.3);c.fillStyle="rgba(7,12,24,0.96)";c.beginPath();c.arc(x,300,54,0,TAU);c.fill();ring(c,x,300,54,col,1,3);
      T(c,String(i+1),x,318,{w:800,size:44,align:"center",color:rgba(col,1)});wrapT(c,V.steps[i],x,410,170,{w:700,size:24,align:"center",color:rgba(on?INK:SOFT,1)});});
    // the four phases above their steps: a bracket and a name, lit for the phase the current step is in
    PHASES4.forEach(([nm,f,l],j)=>{const x0=110+f*190-62,x1=110+l*190+62,on=k>=f&&k<=l,col=on?WEED:SOFT,s=(V.phases||[])[j]||nm;
      c.strokeStyle=rgba(col,on?0.95:0.6);c.lineWidth=3;c.lineCap="round";c.beginPath();c.moveTo(x0,222);c.lineTo(x0,210);c.lineTo(x1,210);c.lineTo(x1,222);c.stroke();
      T(c,s,(x0+x1)/2,194,{w:800,size:30,align:"center",color:rgba(col,1)});});
    kt_agent(c,110+k*190,112,26,0,{});tag(c,110+k*190,560,V.person,TRUST,{align:"center",size:26});c.restore();},
  // the scenarios
  mt_q_where:(c,w,h,st,L)=>{const V=L.vis;c.save();mt_fit(c,w,h,1200,640);lineageGraph(c,60,190,620,420,0,{core:1,dim:0.5,heads:0.8});
    codeFile(c,720,190,440,"_core_student__models.yml",["meta: {grain: …}","contract: {enforced: true}","data_tests: [unique]"],{edge:TRUST,size:24,lh:46,h:260});
    tag(c,600,70,V.ask,EDGE_,{align:"center",size:30});c.restore();},
  mt_q_keys:(c,w,h,st,L)=>{const V=L.vis;c.save();mt_fit(c,w,h,1200,640);const K=["S-20417","u-88213","aisha.k@mail.example"];
    SRC3.forEach(([n,col],i)=>{glass(c,60,90+i*160,520,110,16,col,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.94)"});T(c,V.keys[i],90,135+i*160,{w:700,size:26});T(c,K[i],90,178+i*160,{f:"mono",w:500,size:26,color:rgba(col,1)});arrowTo(c,600,145+i*160,820,320,col,0.8,{head:16});});
    bpBox(c,840,270,300,100,V.oneLearner,KIND,0,{size:32});c.restore();},
  mt_q_two:(c,w,h,st,L)=>{const V=L.vis;c.save();mt_fit(c,w,h,1200,640);bpBox(c,420,60,360,110,V.core,TRUST,0,{size:30});
    [[V.planning,120,[120,215,155]],[V.wallet,720,[120,215,155]]].forEach(([n,x,col])=>{arrowTo(c,600,180,x+180,400,col,0.8,{head:16});glass(c,x,410,360,120,16,col,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.94)"});wrapT(c,n,x+180,460,320,{w:700,size:26,align:"center"});});c.restore();},
  mt_q_bare:(c,w,h,st,L)=>{c.save();mt_fit(c,w,h,1200,640);codeFile(c,80,80,500,"core_award.sql",["select …","from {{ ref(…) }}"],{edge:TRUST,size:28,lh:52,h:260});
    c.save();c.setLineDash([12,10]);c.strokeStyle=rgba(EDGE_,0.9);c.lineWidth=3;rr(c,640,80,480,260,14);c.stroke();c.restore();T(c,"_core_course__models.yml",880,200,{f:"mono",w:500,size:28,align:"center",color:rgba(EDGE_,1)});T(c,"?",880,270,{w:800,size:60,align:"center",color:rgba(EDGE_,1)});c.restore();},
  mt_q_twice:(c,w,h,st,L)=>{const V=L.vis;c.save();mt_fit(c,w,h,1200,640);[[V.md,KIND],[V.yaml,TRUST],[V.sql,[150,176,214]]].forEach(([n,col],i)=>{codeFile(c,40+i*390,120,360,n,["credential: …"],{edge:col,size:26,lh:48,h:200});
      if(i)cross_(c,220+i*390,420,50,EDGE_,1);else tick_(c,220,420,50,GOOD,1);});c.restore();},
  mt_q_agent:(c,w,h,st,L)=>{const V=L.vis;c.save();mt_fit(c,w,h,1200,640);kt_agent(c,200,300,50,0,{});
    codeFile(c,360,120,440,"_core_student__models.yml",["data_tests:","  - unique:","      config:","        "+V.weakened],{edge:TRUST,size:26,lh:48,lit:{3:1},litCol:EDGE_});
    glass(c,860,220,300,160,20,EDGE_,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,V.gate,1010,290,{w:700,size:26,align:"center"});T(c,V.held,1010,340,{f:"mono",w:500,size:24,align:"center",color:rgba(GOOD,1)});c.restore();},
  mt_q_tools:(c,w,h,st,L)=>{const V=L.vis;c.save();mt_fit(c,w,h,1200,640);bpPaper(c,300,40,600,260,1,{});bpModel(c,600,210,0.4,{b:1});T(c,V.same,600,340,{w:700,size:28,align:"center",color:rgba(BPL,1)});
    V.tools.forEach((n,i)=>mt_tool(c,20+i*295,420,275,80,n,i,{on:i===3?1:0}));c.restore();},
  mt_q_order:(c,w,h,st,L)=>{const V=L.vis;c.save();mt_fit(c,w,h,1200,640);V.steps.slice(0,8).forEach((s,i)=>{const x=80+(i%4)*290,y=140+Math.floor(i/4)*240;
      c.fillStyle="rgba(7,12,24,0.96)";c.beginPath();c.arc(x+40,y,40,0,TAU);c.fill();ring(c,x+40,y,40,WEED,1,3);T(c,String(i+1),x+40,y+14,{w:800,size:36,align:"center",color:rgba(WEED,1)});
      wrapT(c,s,x+40,y+86,240,{w:700,size:26,align:"center"});});c.restore();}
});
