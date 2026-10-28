/* ===== Governed in dbt: the places and the pictures =====
   The places are painted once and kept (data governance's shared/src/finish.js): the data team's room, its poster and its board close
   up, a big screen on a desk, the data team's desk from above for the files on it, Yusuf's desk and his board, Noor's map close up, and
   the Faculty of Health's office. The pictures are the film's own things, drawn with the series' pieces (shared/src/tools.js): Jun's
   pull request and its checks, the files the film opens (each the example project's own lines, or a worked example's), the rule and
   the council's minutes, census day, the site plan of who may build on what, two versions side by side, Tuesday's change and its
   impact report, the reviewers file, the check's pages and its warnings, the agent's review, and the map. Every name starts with gd_
   or GD_. */

// made once per chapter, the first time it draws: its cues are known by then
const gd_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// 0 to 1 as something comes, and back as it goes, each over d seconds
const gd_in=(t,t0,d)=>clamp((t-t0)/(d||0.6),0,1);
// a red question mark, settling with a spring
function gd_redQ(ctx,x,y,s,p){if(p<=0)return;const k=spring(p);ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(p*2,0,1),()=>wc_T(ctx,"?",0,0,{w:800,size:s,align:"center",col:GV.redInk}));ctx.restore();}
// a pencil line under words, drawn on as p goes 0 to 1
function gd_under(ctx,x,y,w,p,col){if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(col||WC_PENCIL,0.9);ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);
  const n=16,e=easeCam(clamp(p,0,1));for(let i=1;i<=n;i++){const u=i/n*e;ctx.lineTo(x+w*u,y+2*Math.sin(u*9));}ctx.stroke();ctx.restore();}
// a pencil arrow along a curve from a to b, bowed by bend (px, up when negative; o.bx bows it sideways), drawn on as p goes 0 to 1
function gd_arrow(ctx,a,b,bend,p,o){o=o||{};if(p<=0)return;const c=[(a[0]+b[0])/2+(o.bx||0),(a[1]+b[1])/2+bend],n=28,m=Math.max(2,Math.round(n*clamp(p,0,1))),pt=u=>{const v=1-u;
    return[v*v*a[0]+2*v*u*c[0]+u*u*b[0],v*v*a[1]+2*v*u*c[1]+u*u*b[1]];};
  ctx.save();ctx.strokeStyle=rgba(o.col||WC_PENCIL,o.a==null?0.9:o.a);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();
  for(let i=0;i<=m;i++){const [x,y]=pt(i/n);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);
  if(p>=1&&o.head!==false){const [x1,y1]=pt(1),[x0,y0]=pt(0.93),an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-16*Math.cos(an-0.5),y1-16*Math.sin(an-0.5));
    ctx.lineTo(x1,y1);ctx.lineTo(x1-16*Math.cos(an+0.5),y1-16*Math.sin(an+0.5));ctx.stroke();}ctx.restore();}
// a gold pin and Yusuf's word, flown from the poster to a line that keeps it (u, 0 to 1), then resting beside it
function gd_flyPin(ctx,from,to,u,word){if(u<=0)return;const e=easeCam(clamp(u,0,1)),x=lerp(from[0],to[0],e),y=lerp(from[1],to[1],e)-Math.sin(e*Math.PI)*60;
  withA(ctx,clamp(u*3,0,1),()=>gv_pin(ctx,x,y,GV.gold,1.6));if(u>0.8)withA(ctx,clamp((u-0.8)*5,0,1),()=>wc_hand(ctx,word,x+26,y+12,{size:32,w:700,col:GV.goldInk}));}

/* ---------- the data team's room ---------- */
// Jun, standing at his desk, his screens to his right; the board across the room shows the series' six cards
const GD_JUN=[1330,905,0.8];
function gd_room(ctx,t,o){o=o||{};gu_boardSmall(ctx,o.lit?1:0);const [x,y,s]=GD_JUN;person(ctx,"jun",x,y,s,Object.assign({pose:"listen",t},o.jun||{}));}
// his line from Off the shelf, beside him: the old words, and, as mix goes 0 to 1, the new
function gd_bubble(ctx,a,k,lines,mix,lines2){if(a<=0.01)return;const tx=1290,ty=520,m=clamp(mix||0,0,1);
  if(!lines2||m<0.5)gv_say(ctx,700,300,lines,tx,ty,{a,k,size:40});
  else gv_say(ctx,700,300,lines2,tx,ty,{a,k:k*(0.94+0.06*spring(m*2-1)),size:40,wash:GV.gold,washA:0.25});}

/* ---------- Jun's pull request ---------- */
// his pull request on a big screen, drawn as a form: what it adds, who reviews it, and its checks. o.state, the pill; o.items, the
// checks (gu_checks); o.msg, what a check said; o.how (0 to 1), the message's link lifting, gold; o.rev and o.appr, its reviewers (gd_reviewers);
// o.tab 1, the files changed instead. Words are 28 px or more at the screen's own size.
const GD_PR={title:"Completions for Planning",sub:"Jun Park wants to merge into main",desc:"The awards conferred this year, by faculty.",
  files:["models/marts/planning/mart_planning__completions.sql","models/marts/planning/_planning__models.yml","governance/4-data-products/completions.yml"],
  more:"and 7 more, written by the project's scripts",ck:["build","governance","products","reviewers","impact"],
  m1:"owner: models/marts/planning/_planning__models.yml: mart_planning__completions has no",m2a:"meta.owner or meta.domain ",m2b:"(how to: docs/how-to/add-an-owner.md)",
  g1:"Governance's rules are met: every owner, glossary term, column class, test and",g2:"description is in place."};
const GD_LB=[150,336,1000,256],GD_RB=[1190,336,580,256],GD_CK=[150,612,1620,240];
function gd_prHead(ctx,o){const [x,y,w,h]=GU_BIG;return gu_page(ctx,x,y,w,h,{bar:"GitHub · pull request",title:o.title||GD_PR.title,titleSize:o.titleSize,
  state:o.state||["Open",GV.green],sub:o.sub||GD_PR.sub,tabs:o.tabs||["Conversation","Files changed · 10","Checks · 5"],tab:o.tab||0});}
// who reviews it: the code owners of the files it changes, asked by themselves as it opens (o.rev, 0 to 1): Planning, gold, for its
// table, and the owners of the product and of governance's files; o.appr (0 to 1), Planning's yes
const GD_REV=[["Planning",1],["Clara Jensen"],["data governance"],["Noor"]];
function gd_reviewers(ctx,o){const [x,y,w,h]=GD_RB,r=clamp(o.rev||0,0,1),ap=clamp(o.appr||0,0,1);gu_box(ctx,x,y,w,h,"Reviewers",{seed:72});
  if(r<0.25)withA(ctx,1-r*4,()=>wc_T(ctx,"none yet",x+30,y+112,{w:600,size:28,col:WC_MUTED}));
  if(r<=0.25)return;let px=x+30,py=y+100;
  GD_REV.forEach(([s,gold],i)=>{const v=clamp((r-0.25)*2.2-i*0.2,0,1),pw=Math.round(tw(ctx,s,28,700)+44);if(px+pw>x+w-24){px=x+30;py+=62;}
    if(v>0.01){const k=0.92+0.08*spring(v);ctx.save();ctx.translate(px+pw/2,py);ctx.scale(k,k);ctx.translate(-px-pw/2,-py);withA(ctx,clamp(v*2,0,1),()=>{
      if(gold)gv_halo(ctx,px-20,py-46,pw+40,92,GV.gold,0.7*(o.glow==null?1:o.glow));
      wc_panel(ctx,px,py-26,pw,52,{kind:"pill",wash:gold?GV.gold:null,washA:0.5,seed:44+i});wc_T(ctx,s,px+22,py+10,{w:700,size:28,col:WC_DARK});});ctx.restore();}
    px+=pw+16;});
  const ly=y+h-34;withA(ctx,clamp(r*2.4-1.2,0,1)*(1-ap),()=>wc_T(ctx,"review requested",x+30,ly,{w:600,size:28,col:WC_MUTED}));
  if(ap>0.01)withA(ctx,ap,()=>{wc_tick(ctx,x+46,ly-10,30,GV.greenInk,ap);wc_T(ctx,"Planning approved",x+76,ly,{w:700,size:28,col:GV.greenInk});});}
function gd_pr(ctx,t,o){o=o||{};gd_prHead(ctx,o);
  if(o.tab===1){gd_prFiles(ctx,o);return;}
  const [lx,ly,lw,lh]=GD_LB;gu_box(ctx,lx,ly,lw,lh,null,{seed:71});
  if(o.hiD)gv_tint(ctx,lx+18,ly+52-32,tw(ctx,GD_PR.desc,30,600)+24,44,GV.gold,0.8*o.hiD);if(o.hiF)gv_tint(ctx,lx+18,ly+104-30,gu_mw(ctx,GD_PR.files[0])+24,42,GV.gold,0.8*o.hiF);
  wc_T(ctx,GD_PR.desc,lx+30,ly+52,{w:600,size:30,col:WC_DARK});
  GD_PR.files.forEach((f,i)=>wc_T(ctx,f,lx+30,ly+104+i*42,{w:500,size:28,f:"mono"}));wc_T(ctx,GD_PR.more,lx+30,ly+104+3*42,{w:600,size:28,col:WC_MUTED});
  gd_reviewers(ctx,o);
  const hw=clamp(o.how||0,0,1),msg=o.msg&&hw>0.01?o.msg.map((m,i)=>i===1?Object.assign({},m,{s:GD_PR.m2a}):m):o.msg;
  const [cx,cy,cw,ch]=GD_CK,its=o.items||GD_PR.ck.map(n=>({name:n,st:"wait"})),
    r=gu_checks(ctx,cx,cy,cw,{h:ch,items:its,t,msg,pop:o.pop,msgGap:74,summary:its.some(i=>i.st!=="wait")});if(hw>0.01){const mx=cx+32+gu_mw(ctx,GD_PR.m2a),my=r.my+42,ww=gu_mw(ctx,GD_PR.m2b);
    gv_tint(ctx,mx-8,my-34,ww+16,46,GV.gold,0.9*hw);ctx.save();ctx.translate(0,-5*easeCam(hw));gu_code(ctx,GD_PR.m2b,mx,my,{col:GV.goldInk});
    gd_under(ctx,mx,my+10,ww,hw,GV.goldInk);ctx.restore();}}
// the checks and what they said, at time t: each check's state from the times in T (run, then pass or fail; governance can pass later)
function gd_items(t,T){return GD_PR.ck.map((n,i)=>{const s=T[n]||{};let st="wait";if(s.run!=null&&t>=s.run)st="run";if(s.fail!=null&&t>=s.fail)st="fail";
  if(s.pass!=null&&t>=s.pass)st="pass";return{name:n,st};});}
// the files changed: the new model's first lines, and the governance lines in its YAML, lit as they're named (o.lit, 0 to 1)
function gd_prFiles(ctx,o){const L=o.lit||0;
  gu_file(ctx,150,330,1620,{path:"models/marts/planning/mart_planning__completions.sql",lines:[{s:"credentials as (",add:1},{s:"    select * from {{ ref('core_credential', v=2) }}",add:1}]});
  gu_file(ctx,150,552,1620,{path:"models/marts/planning/_planning__models.yml",lang:"yaml",lines:[{s:"        owner: Planning",add:1,lit:L},{s:"        domain: planning",add:1,lit:L},
    {fold:1},{s:"        config: {meta: {personal_data: none}}",add:1,lit:L}]});}
// the two lines Jun adds, in the model's YAML (typed as typ goes 0 to 1), on a sheet over the pull request's top
const GD_OWN=[{n:131,s:"  - name: mart_planning__completions"},{fold:1},{n:135,s:"    config:"},{n:136,s:"      meta:"},{n:137,s:"        grain: One row per faculty per award type"},
  {n:138,s:"        owner: Planning"},{n:139,s:"        domain: planning"},{n:140,s:"    data_tests:"}];
function gd_ownSheet(ctx,u,typ,lit){if(u<=0.01)return;const e=easeCam(clamp(u,0,1)),y=lerp(-560,84,e),
    lines=GD_OWN.map((L,i)=>i===5||i===6?Object.assign({},L,{p:clamp(typ*2-(i-5),0,1),lit}):L);
  gu_file(ctx,150,y,1000,{path:"models/marts/planning/_planning__models.yml",lang:"yaml",lines,rot:-0.008});}

/* ---------- the rule, and the council's minutes, on Yusuf's desk ---------- */
// the rule, on a card: "owner" underlined as it's said (u), and, as q goes 0 to 1, a red question mark beside it
const GD_RULE=["Every table other teams use","has an owner: someone who","answers for what it means."];
function gd_rule(ctx,o){o=o||{};const x=190,y=250,w=740,h=330;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(-0.02);ctx.translate(-x-w/2,-y-h/2);
  wc_panel(ctx,x,y,w,h,{kind:"card",wash:GV.gold,washA:0.18,seed:81});wc_T(ctx,"Data governance · a rule",x+40,y+62,{w:600,size:28,col:WC_MUTED});
  GD_RULE.forEach((s,i)=>wc_T(ctx,s,x+40,y+142+i*58,{w:700,size:40,col:WC_DARK}));
  const ox=x+40+tw(ctx,"has an ",40,700),ow=tw(ctx,"owner",40,700);gd_under(ctx,ox,y+142+58+12,ow,o.u||0,GV.goldInk);gd_redQ(ctx,x+w-80,y+104,96,o.q||0);ctx.restore();}
// the council's minutes, a sheet a month, June to September: the same action on each, in pencil. o.at[i] (0 to 1) brings sheet i in;
// o.pile (0 to 1) slides them together into one stack
const GD_MIN=[["June 2026","Action:","name the data owners"],["July 2026","name the data owners","carried forward"],["August 2026","name the data owners","carried forward"],
  ["September 2026","name the data owners","carried forward"]],GD_MINP=[[975,110,-0.04],[1430,150,0.03],[995,450,0.02],[1445,490,-0.03]];
function gd_minutes(ctx,o){o=o||{};const pile=easeCam(clamp(o.pile||0,0,1));GD_MIN.forEach(([m,a1,a2],i)=>{const u=(o.at||[])[i]==null?1:o.at[i];if(u<=0.01)return;
  const [px,py,pr]=GD_MINP[i],x=lerp(px,720+i*8,pile),y=lerp(py,300+i*6,pile)+(1-easeCam(clamp(u,0,1)))*-60,r=lerp(pr,-0.03+i*0.012,pile),
    wa=i===GD_MIN.length-1?1:1-clamp(pile*2.5,0,1);
  ctx.save();ctx.translate(x+215,y+150);ctx.rotate(r);ctx.translate(-215,-150);withA(ctx,clamp(u*2,0,1),()=>{ctx.drawImage(gv_sheetPaper(430,300),-20,-20);
    if(wa>0.01)withA(ctx,wa,()=>{wc_T(ctx,"Council · minutes",28,48,{w:600,size:28,col:WC_MUTED});wc_T(ctx,m,28,98,{w:800,size:34,col:WC_DARK});gv_lines(ctx,28,128,370,2,22,0.9);
      wc_hand(ctx,a1,28,206,{size:30,w:700,col:WC_PENCIL});if(a2)wc_hand(ctx,a2,28,248,{size:30,w:700,col:WC_PENCIL});});});ctx.restore();});}
// the check that does it now: a card with its green light, its name and how long it takes
function gd_badge(ctx,x,y,a){if(a<=0.01)return;const k=lerp(1.25,1,spring(clamp(a,0,1)));ctx.save();ctx.translate(x,y);ctx.scale(k,k);withA(ctx,clamp(a*2,0,1),()=>{
  wc_panel(ctx,-200,-48,400,96,{kind:"card",wash:GV.green,washA:0.25,seed:85});gu_light(ctx,-150,0,"pass",0);wc_T(ctx,"governance",-120,10,{w:500,size:30,f:"mono",col:WC_DARK});
  wc_T(ctx,"1 min",170,10,{w:700,size:30,col:GV.greenInk,align:"right"});});ctx.restore();}

/* ---------- census day, on Yusuf's board ---------- */
// what a table with no owner cost, as A product with an owner told it: the census card, Anil's question, and his path from Jun to Noor
// to Planning and back to Jun, an arrow at a time (o.path[i], 0 to 1); o.dim (0 to 1) fades the arrows when something had to change
const GD_PATH=[["Jun Park","analytics engineer"],["Noor Rahman","data architect"],["Planning","asked for it"],["Jun Park","analytics engineer"]],GD_PX=[300,700,1100,1500];
function gd_census(ctx,o){o=o||{};const a=o.a==null?1:o.a,dm=1-0.75*clamp(o.dim||0,0,1);
  withA(ctx,clamp(o.card||0,0,1),()=>{ctx.save();ctx.translate(560,200);ctx.rotate(-0.012);wc_panel(ctx,-290,-90,580,180,{kind:"card",seed:91});gv_pin(ctx,0,-74,GV.red,1.2);
    wc_hand(ctx,"Census day",0,-6,{size:48,w:700,align:"center",col:WC_DARK});ctx.restore();wc_year(ctx,360,250,"31 March 2026 · 7:00",1);});
  withA(ctx,clamp(o.anil||0,0,1),()=>{gu_nameCard(ctx,1150,120,"Anil Kurian","Faculty of Health",1);gv_pin(ctx,1290,132,GV.red,1.1);
    wc_hand(ctx,"next semester's places?",1150,300,{size:34,w:700,col:GV.redInk,p:clamp(o.places||0,0,1)});});
  GD_PATH.forEach(([n,r],i)=>{const u=(o.path||[])[i];if(!(u>0))return;withA(ctx,clamp(u*2,0,1),()=>{gu_nameCard(ctx,GD_PX[i]-150,620,n,r,1);
    gv_pin(ctx,GD_PX[i],632,GV.red,1.1);});});
  for(let i=0;i<3;i++){const p=(o.path||[])[i+1];if(!(p>0))continue;withA(ctx,dm,()=>gd_arrow(ctx,[GD_PX[i]+40,600],[GD_PX[i+1]-60,600],-90,p,{col:GV.redInk}));}}

/* ---------- a pin at each step: the lines that keep them ---------- */
// The learner table's YAML, as the example project writes it: its owner and its domain, then the term it holds, lit as they're named
// (lit: [owner and domain, term], 0 to 1). The sheet comes up from the desk's edge as u goes 0 to 1; returns where its rows are
const GD_LRN=[{n:3,s:"  - name: core_learner"},{fold:1},{n:8,s:"    config:"},{n:9,s:"      meta:"},{n:10,s:"        grain: One row per learner per version"},
  {n:11,s:"        owner: Mei Tanaka, registrar's office"},{n:12,s:"        domain: student"},{n:13,s:"        glossary_term: learner"},{fold:1}];
const GD_LRNX=[110,120,1000];
function gd_learner(ctx,u,lit){if(u<=0.01)return null;const L=lit||[],[x,y,w]=GD_LRNX,e=easeCam(clamp(u,0,1)),b=0.4*(L[2]||0),
    lines=GD_LRN.map((r,i)=>i>=2&&i<=7?Object.assign({},r,{lit:Math.max(b,i===5||i===6?L[0]||0:i===7?L[1]||0:0)}):r);
  return gu_file(ctx,x,lerp(H+60,y,e),w,{path:"models/core/student/_core_student__models.yml",lang:"yaml",lines});}
// three of its columns, each saying whether it identifies a person (lit[k], 0 to 1), with its class's chip beside it from at[k]
const GD_COLS=[{n:44,s:"      - name: learner_key"},{n:49,s:"          meta: {glossary_term: learner, personal_data: pseudonymous}",cls:"pseudonymous"},{fold:1},
  {n:79,s:"      - name: email"},{n:83,s:"          meta: {personal_data: direct}",cls:"direct"},{n:84,s:"      - name: status"},{fold:1},
  {n:91,s:"        config: {meta: {personal_data: none}}",cls:"none"}];
const GD_COLX=[80,150,1720];
function gd_columns(ctx,t,u,lit,at){if(u<=0.01)return null;const [x,y,w]=GD_COLX,e=easeCam(clamp(u,0,1)),yy=lerp(H+60,y,e);let k=0;
  const ks=GD_COLS.map(r=>r.cls?k++:-1),lines=GD_COLS.map((r,i)=>ks[i]>=0?Object.assign({},r,{lit:(lit||[])[ks[i]]||0}):r),R=gu_file(ctx,x,yy,w,{path:"models/core/student/_core_student__models.yml",lang:"yaml",lines});
  GD_COLS.forEach((r,i)=>{if(ks[i]<0||at==null)return;gv_classChipAt(ctx,t,at[ks[i]],R.tx+gu_mw(ctx,r.s)+30,R.rows[i],r.cls);});return R;}
// who owns each test, in dbt_project.yml, and the quality dimension a kind of test names where it's defined (lit, lit2: 0 to 1)
const GD_TST=[{n:105,s:"data_tests:"},{n:106,s:"  credentials:"},{fold:1},{n:119,s:"    core:"},{n:120,s:"      +meta: {owner: \"Mei Tanaka, registrar's office\"}"}],
  GD_BIN=[{n:10,s:"{% test not_null(model, column_name) %}"},{n:11,s:"    {{ config(meta={'dimension': 'completeness'}) }}"}];
function gd_tests(ctx,u,lit,u2,lit2){let R=null;if(u>0.01)R=gu_file(ctx,90,lerp(H+60,80,easeCam(clamp(u,0,1))),1180,{path:"dbt_project.yml",lang:"yaml",
    lines:GD_TST.map((r,i)=>i===4?Object.assign({},r,{lit}):r)});
  if(u2>0.01)gu_file(ctx,800,lerp(H+60,520,easeCam(clamp(u2,0,1))),1040,{path:"tests/generic/builtin.sql",lines:GD_BIN.map((r,i)=>i===1?Object.assign({},r,{lit:lit2}):r),rot:0.008});
  return R;}

/* ---------- who may build on what ---------- */
// the two files that say it: the groups, each with its owner (o.g, 0 to 1, lights them), and each layer's access in dbt_project.yml
// (o.priv, o.pub, o.prot light its lines)
const GD_GRP=[{n:1,s:"groups:"},{n:2,s:"  - name: credential_model"},{fold:1},{n:6,s:"    owner:"},{n:7,s:"      name: Noor, data architect"},{fold:1},
  {n:10,s:"  - name: planning"},{fold:1},{n:12,s:"    owner:"},{n:13,s:"      name: Planning"}];
const GD_ACC=[{n:32,s:"    staging:"},{fold:1},{n:36,s:"      +access: private"},{n:38,s:"    intermediate:"},{fold:1},{n:42,s:"      +access: private"},
  {n:46,s:"    core:"},{fold:1},{n:50,s:"      +access: public"},{n:54,s:"    marts:"},{fold:1},{n:57,s:"      +access: protected"}];
function gd_accessFiles(ctx,o){const g=o.g||0,L=i=>i===2||i===5?o.priv:i===8?o.pub:i===11?o.prot:0;
  gu_file(ctx,100,110,720,{path:"models/_groups.yml",lang:"yaml",lines:GD_GRP.map((r,i)=>[1,4,6,9].includes(i)?Object.assign({},r,{lit:g}):r),rot:-0.008});
  gu_file(ctx,1000,90,800,{path:"dbt_project.yml",lang:"yaml",lines:GD_ACC.map((r,i)=>Object.assign({},r,{lit:L(i)||0})),rot:0.006});}
// The project's folders as a small site plan on the board: the first layers inside a low fence, private to the data team's group; the
// core tables in the open, public; the marts each in a yard of its own, protected. Each part comes as it's named (o.priv, o.pub, o.prot);
// o.try, a sketch in Planning's yard reaching for a private step, stopped at the fence (o.stop, the cross); o.err, dbt's error unrolling;
// o.jun, Jun's new table, and o.refs, its two refs reaching the core, its lines below lighting green (o.sql); o.key, a key coming to read
// the core, and stopping, with o.next its tag
const GD_YD={priv:[250,130,460,430],pub:[760,130,350,430],prot:[1140,130,560,430]};
function gd_fence(ctx,x,y,w,h,p,o){if(p<=0)return;o=o||{};const col=o.col||WC_PENCIL,pts=[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]],L=2*(w+h),d=L*easeCam(clamp(p,0,1));
  ctx.save();ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=o.lw||4;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x,y);let s=0;
  for(let i=1;i<pts.length;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i],l=Math.hypot(bx-ax,by-ay);if(s+l<=d){ctx.lineTo(bx,by);s+=l;}else{const f=(d-s)/l;ctx.lineTo(lerp(ax,bx,f),lerp(ay,by,f));break;}}ctx.stroke();
  // the posts: short strokes every 46 px along the part drawn
  ctx.lineWidth=(o.lw||4)*1.3;s=0;for(let i=1;i<pts.length;i++){const [ax,ay]=pts[i-1],[bx,by]=pts[i],l=Math.hypot(bx-ax,by-ay),n=Math.floor(l/46);
    for(let j=0;j<n;j++){const at=s+j*46;if(at>d)break;const f=j*46/l,px=lerp(ax,bx,f),py=lerp(ay,by,f);ctx.beginPath();ctx.moveTo(px,py-9);ctx.lineTo(px,py+9);ctx.stroke();}s+=l;}
  ctx.restore();}
// a table (or a sketch of one) on the plan: its name in the typeface on a small card, centred at (cx,cy); returns its width
function gd_block(ctx,cx,cy,s,o){o=o||{};const a=o.a==null?1:o.a,hand=!!o.hand,w=Math.round((hand?tw(ctx,s,30,700):gu_mw(ctx,s))+48),h=58;if(a<=0.01)return w;
  const k=0.9+0.1*spring(clamp(a,0,1));ctx.save();ctx.translate(cx,cy);ctx.scale(k,k);withA(ctx,clamp(a*1.6,0,1),()=>{
    wc_panel(ctx,-w/2,-h/2,w,h,{kind:"card",dashed:!!o.dashed,wash:o.wash,washA:o.washA||0.3,seed:s.length+7});
    if(hand)wc_hand(ctx,s,0,10,{size:30,w:700,align:"center",col:o.col||WC_PENCIL});else wc_T(ctx,s,-w/2+24,10,{w:500,size:28,f:"mono",col:o.col||WC_DARK});});ctx.restore();return w;}
// a key, drawn in gold ink, pointing left, its tip at (x,y)
function gd_key(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(GV.goldInk,0.95);ctx.lineWidth=7;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+110,y);ctx.moveTo(x+14,y);ctx.lineTo(x+14,y+20);ctx.moveTo(x+36,y);ctx.lineTo(x+36,y+14);ctx.stroke();
  ctx.beginPath();ctx.arc(x+134,y,24,0,TAU);ctx.stroke();ctx.restore();});}
function gd_site(ctx,t,o){o=o||{};const P=GD_YD.priv,U=GD_YD.pub,R=GD_YD.prot;
  // the private yard: a low fence, its tag, the first layers' folders and one of their steps
  const pv=o.priv||0;if(pv>0.01){wc_wash(ctx,wc_rect(P[0],P[1],P[2],P[3]),wc_lit([150,170,200],0.55),{kind:"swatch",a:0.55*clamp(pv*2,0,1),seed:131,line:false});
    gd_fence(ctx,P[0],P[1],P[2],P[3],pv);withA(ctx,fin(pv,0.3,0.5),()=>{wc_tag(ctx,P[0]+P[2]/2,P[1]+50,"private · credential_model",{size:28,align:"center"});
      wc_hand(ctx,"staging",P[0]+40,P[1]+140,{size:32,w:700,col:WC_INK});wc_hand(ctx,"intermediate",P[0]+40,P[1]+200,{size:32,w:700,col:WC_INK});
      gd_block(ctx,P[0]+P[2]/2,P[1]+310,"int_credentials_unioned");wc_tag(ctx,P[0]+P[2]/2,P[1]+P[3]+32,"+access: private",{size:28,align:"center",f:"mono"});});}
  // the core, in the open
  const pb=o.pub||0;if(pb>0.01){withA(ctx,clamp(pb*1.5,0,1),()=>{wc_wash(ctx,wc_rect(U[0],U[1],U[2],U[3]),wc_lit(GV.green,0.7),{kind:"swatch",a:0.35,seed:133,line:false});
      wc_tag(ctx,U[0]+U[2]/2,U[1]+50,"public",{size:28,align:"center"});["core_learner","core_credential","core_award"].forEach((s,i)=>gd_block(ctx,U[0]+U[2]/2,U[1]+130+i*90,s,{a:fin(pb,0.2+0.15*i,0.5)}));
      wc_tag(ctx,U[0]+U[2]/2,U[1]+U[3]+32,"+access: public",{size:28,align:"center",f:"mono"});});}
  // the marts: a yard each
  const pr=o.prot||0;if(pr>0.01){withA(ctx,clamp(pr*1.5,0,1),()=>{wc_tag(ctx,R[0]+R[2]/2,R[1]+50,"protected",{size:28,align:"center"});
      [["planning",86,150],["wallet",244,90],["finance",330,90]].forEach(([s,dy,h],i)=>{const v=fin(pr,0.15*i,0.6);if(v<=0)return;const yy=R[1]+dy;
        wc_wash(ctx,wc_rect(R[0]+12,yy,R[2]-24,h-14),wc_lit([214,186,150],0.6),{kind:"swatch",a:0.4*v,seed:140+i,line:false});gd_fence(ctx,R[0]+12,yy,R[2]-24,h-14,v,{lw:3});
        withA(ctx,v,()=>wc_hand(ctx,s,R[0]+36,yy+42,{size:30,w:700,col:WC_INK}));});
      wc_tag(ctx,R[0]+R[2]/2,R[1]+R[3]+32,"+access: protected",{size:28,align:"center",f:"mono"});});}
  // a sketch in Planning's yard, its ref reaching for the private step, and stopped at the fence
  const tr=o.try||0,jn=o.jun||0;if(tr>0.01){withA(ctx,1-jn,()=>{gd_block(ctx,R[0]+R[2]-150,R[1]+176,"a sketch",{hand:1,dashed:1,a:tr});
      gd_arrow(ctx,[R[0]+R[2]-262,R[1]+175],[P[0]+P[2]+14,P[1]+175],0,clamp((tr-0.3)/0.7,0,1),{col:WC_PENCIL,dash:[10,10],head:false});
      wc_cross(ctx,P[0]+P[2]+14,P[1]+175,46,GV.redInk,o.stop||0);});}
  // dbt's error, unrolling under the plan
  const er=o.err||0;if(er>0.01){const x=P[0],y=620,w=R[0]+R[2]-P[0],L=GD_PE;withA(ctx,clamp(er*3,0,1)*(1-jn),()=>{wc_panel(ctx,x,y,w,236,{kind:"card",wash:GV.red,washA:0.18,seed:151});
      L.forEach((s,i)=>{const p=clamp(er*L.length-i,0,1);if(p>0)wc_T(ctx,s.slice(0,Math.ceil(s.length*p)),x+30,y+48+i*42,{w:500,size:28,f:"mono",col:GV.redInk});});});}
  // Jun's new table, reading only public tables: its two refs, and the lines that say them
  if(jn>0.01){gd_block(ctx,R[0]+R[2]/2,R[1]+176,"mart_planning__completions",{a:jn,wash:GV.green,washA:0.2});const rf=o.refs||0;
    gd_arrow(ctx,[R[0]+30,R[1]+164],[U[0]+U[2]-28,U[1]+226],-30,clamp(rf*1.6,0,1),{col:GV.greenInk});
    gd_arrow(ctx,[R[0]+30,R[1]+188],[U[0]+U[2]-62,U[1]+302],40,clamp(rf*1.6-0.5,0,1),{col:GV.greenInk});
    const sq=o.sql||0;gu_file(ctx,P[0],620,R[0]+R[2]-P[0],{path:"models/marts/planning/mart_planning__completions.sql",lh:42,a:clamp(jn*2,0,1)*(1-clamp(o.key||0,0,1)),
      lines:[{n:7,s:"    select * from {{ ref('core_credential', v=2) }}",lit:clamp(sq*2,0,1),litCol:GV.green},{fold:1},{n:13,s:"    select * from {{ ref('core_award') }}",lit:clamp(sq*2-1,0,1),litCol:GV.green}]});}
  // who may read it: a key comes for Jun's table, and stops at the fence
  const ky=o.key||0;if(ky>0.01){const e=easeCam(clamp(ky,0,1)),kx=lerp(2000,R[0]+R[2]+24,e)+Math.sin(clamp((ky-1)*2,0,1)*Math.PI*3)*6;gd_key(ctx,kx,R[1]+176,clamp(ky*3,0,1));
    gu_tagAt(ctx,t,o.nextAt==null?1e9:o.nextAt,null,1380,700,"who may read it: the platform's · next film",{size:28});}}
const GD_PE=["Parsing Error","  Node model.credentials.mart_planning__try_private attempted to","  reference node model.credentials.int_credentials_unioned, which",
  "  is not allowed because the referenced node is private to the","  'credential_model' group."];

/* ---------- a promise the build keeps ---------- */
// the near-award table's contract: its columns and their types (o.cols, o.types light them), and, behind it, the marts' setting that
// enforces it (o.on)
const GD_NEAR=[{n:3,s:"  - name: mart_planning__near_award"},{fold:1},{n:35,s:"    columns:"},{n:36,s:"      - name: learner_award_key"},{n:38,s:"        data_type: string"},{fold:1},
  {n:48,s:"      - name: learner_key"},{n:50,s:"        data_type: string"},{fold:1},{n:86,s:"      - name: faculty_name"},{n:88,s:"        data_type: string"},{fold:1}],
  GD_MART=[{n:54,s:"    marts:"},{fold:1},{n:57,s:"      +access: protected"},{n:58,s:"      +contract:"},{n:59,s:"        enforced: true"}];
function gd_contract(ctx,o){o=o||{};const C=[3,6,9],T_=[4,7,10];
  gu_file(ctx,1180,lerp(H+60,110,easeCam(clamp(o.mart==null?1:o.mart,0,1))),640,{path:"dbt_project.yml",lang:"yaml",lines:GD_MART.map((r,i)=>i>=3?Object.assign({},r,{lit:o.on||0}):r),rot:0.01});
  gu_file(ctx,90,50,1000,{path:"models/marts/planning/_planning__models.yml",lang:"yaml",lines:GD_NEAR.map((r,i)=>C.includes(i)?Object.assign({},r,{lit:o.cols||0}):T_.includes(i)?Object.assign({},r,{lit:o.types||0}):r)});}
// one line of the near-award SQL changed, faculty_name to faculty, typed as o.ch goes 0 to 1; and dbt's answer: the contract failed, and the two rows that don't line up
// (o.err, 0 to 1, unrolls it; o.rows, 0 to 1, lights them); o.stays, a tag: the table isn't replaced
const GD_SQL=[{n:95,s:"    award_type,"},{n:96,s:"    faculty_code,"},{n:97,s:"    faculty_name,"},{n:98,s:"    learner_status,"}],
  GD_CE=["Compilation Error in model mart_planning__near_award (…)","  This model has an enforced contract that failed.","  …",
    "  | column_name  | definition_type | contract_type | mismatch_reason       |","  | ------------ | --------------- | ------------- | --------------------- |",
    "  | faculty      | VARCHAR         |               | missing in contract   |","  | faculty_name |                 | VARCHAR       | missing in definition |"];
function gd_mismatch(ctx,t,o){o=o||{};const ch=clamp(o.ch||0,0,1),tail=" as faculty,",
    lines=GD_SQL.map((r,i)=>i===2&&ch>0?Object.assign({},r,{s:"    faculty_name"+tail.slice(0,Math.max(1,Math.ceil(tail.length*ch))),lit:ch,litCol:GV.red}):r);
  gu_file(ctx,90,40,1000,{path:"models/marts/planning/mart_planning__near_award.sql",lines});
  const er=o.err||0;if(er>0.01){const x=90,y=430,w=1740,h=56+GD_CE.length*44;withA(ctx,clamp(er*3,0,1),()=>{wc_panel(ctx,x,y,w,h,{kind:"card",wash:GV.red,washA:0.16,seed:161});
    GD_CE.forEach((s,i)=>{const p=clamp(er*GD_CE.length-i,0,1);if(p<=0)return;const by=y+56+i*44;if(i>=5)gv_tint(ctx,x+20,by-32,w-40,42,GV.red,0.8*clamp(o.rows||0,0,1));
      wc_T(ctx,s.slice(0,Math.ceil(s.length*p)),x+30,by,{w:500,size:28,f:"mono",col:i>=5||i<2?GV.redInk:WC_INK});});});}
  gu_tagAt(ctx,t,o.staysAt==null?1e9:o.staysAt,null,1370,230,"the table isn't replaced",{size:30});}
// two versions of the credentials table, side by side on the board: version 2 (o.v2) and version 1 with its date to go (o.v1, o.date
// lights it, o.ring circles it); two of version 2's readers (o.rd) and their refs, pointing at it
function gd_versions(ctx,t,o){o=o||{};const v2=o.v2||0,v1=o.v1||0,rd=o.rd||0;
  if(v2>0.01){const k=0.92+0.08*spring(clamp(v2,0,1));ctx.save();ctx.translate(580,245);ctx.scale(k,k);ctx.translate(-580,-245);withA(ctx,clamp(v2*2,0,1),()=>{
    wc_panel(ctx,260,120,640,250,{kind:"card",wash:GV.green,washA:0.18,seed:171});gv_pin(ctx,580,138,GV.red,1.1);wc_hand(ctx,"version 2 · latest",300,214,{size:40,w:700,col:WC_DARK});
    wc_T(ctx,"core_credential_v2",300,290,{w:500,size:28,f:"mono",col:WC_INK});});ctx.restore();}
  if(v1>0.01){const k=0.92+0.08*spring(clamp(v1,0,1));ctx.save();ctx.translate(1330,245);ctx.scale(k,k);ctx.translate(-1330,-245);withA(ctx,clamp(v1*2,0,1),()=>{
    wc_panel(ctx,990,120,680,250,{kind:"card",wash:GV.amber,washA:0.14,seed:172});gv_pin(ctx,1330,138,GV.red,1.1);wc_hand(ctx,"version 1 · until 31 March 2027",1030,210,{size:36,w:700,col:WC_DARK});
    wc_T(ctx,"core_credential_v1",1030,268,{w:500,size:28,f:"mono",col:WC_INK});const dl="deprecation_date: 2027-03-31",dw=gu_mw(ctx,dl);
    gv_tint(ctx,1018,300,dw+24,44,GV.gold,0.9*clamp(o.date||0,0,1));gu_code(ctx,dl,1030,332,{lang:"yaml"});
    const rx=1030+gu_mw(ctx,"deprecation_date: ")+gu_mw(ctx,"2027-03-31")/2;wc_ring(ctx,rx,320,gu_mw(ctx,"2027-03-31")/2+12,34,clamp(o.ring||0,0,1),{col:GV.goldInk,seed:13});});ctx.restore();}
  if(rd>0.01)[["mart_wallet__credentials",520],["mart_wallet__learners",650]].forEach(([s,y],i)=>{const v=clamp(rd*2-i*0.5,0,1);if(v<=0)return;
    withA(ctx,v,()=>{wc_panel(ctx,260,y,490,74,{kind:"card",seed:175+i});wc_T(ctx,s,284,y+48,{w:500,size:28,f:"mono",col:WC_DARK});
      wc_T(ctx,"ref('core_credential', v=2)",790,y+48,{w:500,size:28,f:"mono",col:GV.greenInk});});
    gd_arrow(ctx,i?[262,y+30]:[400,y-4],i?[300,382]:[420,382],0,Math.min(clamp((v-0.4)/0.6,0,1),clamp(v2*1.5,0,1)),{col:GV.greenInk,bx:i?-110:0});});}
// exposures: who uses each table, and who answers for each use; three files, one per consumer, each coming in (o.at[i]); o.use lights
// each's name and kind, o.own its owner
const GD_EXP=[["exposures/planning/_planning__exposures.yml",[{n:3,s:"  - name: census_dashboard"},{n:5,s:"    type: dashboard"},{fold:1},{n:10,s:"    owner:"},{n:11,s:"      name: Planning"}],[80,40,-0.012]],
  ["exposures/finance/_finance__exposures.yml",[{n:3,s:"  - name: revenue_forecast"},{n:5,s:"    type: analysis"},{fold:1},{n:12,s:"    owner:"},{n:13,s:"      name: Finance"}],[1060,150,0.01]],
  ["exposures/wallet/_wallet__exposures.yml",[{n:3,s:"  - name: wallet_app"},{n:5,s:"    type: application"},{fold:1},{n:10,s:"    owner:"},{n:11,s:"      name: Wallet app team"}],[560,480,-0.006]]];
function gd_exposures(ctx,o){o=o||{};GD_EXP.forEach(([path,rows,[x,y,r]],i)=>{const u=(o.at||[])[i]||0;if(u<=0.01)return;const e=easeCam(clamp(u,0,1));
  gu_file(ctx,x,y+(1-e)*60,790,{path,lang:"yaml",a:clamp(u*2,0,1),rot:r,lines:rows.map((L,j)=>j<2?Object.assign({},L,{lit:o.use||0}):j===4?Object.assign({},L,{lit:o.own||0}):L)});});}

/* ---------- what this change touches ---------- */
// Tuesday's pull request on the big screen: its title, and the tab that's open (0, the description; 1, the files changed, nf of them)
const GD_TUE={title:"Count microcredentials of 6 credit points or more as awards",sub:"Tuesday · Jun Park wants to merge into main"};
function gd_tues(ctx,tab,nf){gd_prHead(ctx,{title:GD_TUE.title,titleSize:36,sub:GD_TUE.sub,tabs:["Conversation","Files changed · "+nf,"Checks · 5"],tab});}
// the first draft's change, in int_credentials_unioned.sql: a kind of credential becomes "award" from 6 credit points (o.lit)
const GD_REL=[{n:59,s:"        'LMS' as key_set,"},{s:"        case when latest_badges.credit_points > 0 then 'microcredential' …",del:1},{s:"        case",add:1},
  {s:"            when latest_badges.credit_points >= 6 then 'award'",add:1},{s:"            when latest_badges.credit_points > 0 then 'microcredential'",add:1},
  {s:"            else 'badge'",add:1},{s:"        end as credential_kind,",add:1},{n:65,s:"        latest_badges.badge_code as credential_code,"}];
function gd_relabel(ctx,lit){gu_file(ctx,150,330,1620,{path:"models/intermediate/student/int_credentials_unioned.sql",lh:44,lines:GD_REL.map((r,i)=>i===3?Object.assign({},r,{lit}):r)});}
// the second draft: the relabel gone, and a column added to version 2 of the credentials table, its SQL and its YAML; the column lit
// in the glossary's violet (o.lit), its class (o.cls)
function gd_column(ctx,o){o=o||{};const V=GV_MEAN.violet;
  gu_file(ctx,150,330,1620,{path:"models/core/student/core_credential_v2.sql",lh:44,lines:[{s:"    credential_kind = 'award'",add:1},
    {s:"        or (credential_kind = 'microcredential' and credit_points >= …",add:1},{s:"        as counts_as_award,",add:1,lit:o.lit||0,litCol:V}]});
  gu_file(ctx,150,590,1620,{path:"models/core/student/_core_student__models.yml",lang:"yaml",lh:44,a:o.y==null?1:o.y,lines:[{s:"      - name: counts_as_award",add:1,lit:o.lit||0,litCol:V},{fold:1},
    {s:"        data_type: boolean",add:1},{s:"        config: {meta: {personal_data: none}}",add:1,lit:o.cls||0}]});}
// The impact check's report, as the pull request's description shows it: its Markdown rendered, folded to what the film reads. Items:
// {h:1 or 2, s} a heading; {li:s} a bullet (cont: a bullet's next line); {s} a line; {fold:1}; each with p (0 to 1, shown), lit (a
// wash in col), col (its ink). Drawn in a box at (x,y), w wide; returns where it ends
function gd_md(ctx,x,y,w,items,o){o=o||{};let by=y+54;const out=[];items.forEach(it=>{const p=it.p==null?1:clamp(it.p,0,1),sz=it.h===1?36:it.h===2?30:28,lh=it.h===1?56:it.h===2?50:it.fold?36:40;
    if(p>0.01){const tx=x+30+(it.li!=null||it.cont?32:0),s=it.li!=null?it.li:it.s;
      if(it.lit>0.01)gv_tint(ctx,x+16,by-32,w-32,lh-2,it.litCol||GV.gold,0.8*clamp(it.lit,0,1));
      withA(ctx,p,()=>{if(it.fold)wc_T(ctx,"…",x+30,by,{w:500,size:28,f:"mono",col:WC_PENCIL});
        else if(it.h)wc_T(ctx,s,x+30,by,{w:800,size:sz,col:WC_DARK});
        else{if(it.li!=null)wc_T(ctx,"•",x+34,by,{w:800,size:28,col:it.col||WC_INK});gu_md(ctx,s,tx,by,{size:28,col:it.col});}});}
    out.push(by);by+=lh;});return{rows:out,end:by};}
const GD_R0=[{h:1,s:"What this change touches"},{fold:1},{h:2,s:"Contracts"},{li:"`mart_planning__completions`: new"},{h:2,s:"Who to ask"},{s:"Planning"}],
  GD_R1=[{h:1,s:"What this change touches"},{fold:1},{h:2,s:"Who uses it"},{li:"`census_dashboard`, owned by Planning"},{li:"`census_report`, owned by Planning"},
    {li:"`draft_submission`, owned by Mei Tanaka, registrar's office"},{li:"`revenue_forecast`, owned by Finance"},{li:"`wallet_app`, owned by Wallet app team"},
    {h:2,s:"Who to ask"},{s:"Finance; Mei Tanaka, registrar's office; Planning; Wallet app team"}],
  GD_R2=[{h:1,s:"What this change touches"},{fold:1},{h:2,s:"Contracts"},{li:"`core_credential v2`: additive: added counts_as_award",col:GV.greenInk,litCol:GV.green},{h:2,s:"Who uses it"},
    {li:"`census_report`, owned by Planning"},{li:"`draft_submission`, owned by Mei Tanaka, registrar's office"},{li:"`wallet_app`, owned by Wallet app team"},
    {h:2,s:"Who to ask"},{s:"Mei Tanaka, registrar's office; Planning; Wallet app team"}],
  GD_R3=[{h:1,s:"What this change touches"},{fold:1},{h:2,s:"Contracts"},{li:"`core_credential v2`: **breaking**: removed counts_as_award, added is_award. Needs a new",col:GV.redInk,litCol:GV.red},
    {cont:1,s:"version, with a deprecation date for this one",col:GV.redInk,litCol:GV.red}];
// a report, its items shown as the times in at[] come (each 0 to 1 from its time); lit[] for a wash on an item
function gd_report(ctx,t,items,at,o){o=o||{};const R=GD_LB[0],y=330;gu_box(ctx,R,y,1620,o.h||460,null,{seed:181});
  return gd_md(ctx,R,y,1620,items.map((it,i)=>Object.assign({},it,{p:at&&at[i]!=null?fin(t,at[i],0.35):1,lit:o.lit&&o.lit[i]!=null?o.lit[i]:it.lit})));}

/* ---------- reviews go to the owners ---------- */
// the reviewers file, generated: its header, and the three lines the film names, each lit as it's said (o.lit[k]); a person's card under
// it for each (o.card[k]), joined to the sheet by a pencil thread
const GD_CO=[{n:1,s:"# Generated by scripts/generate/codeowners.py from the owners in the project's …"},{n:2,s:"# governance/2-owners/owners.yml. Don't edit it: change the metadata, then run …"},{fold:1},
  {n:26,s:"/models/core/student/_core_student__models.yml           mei.tanaka@uni.example …"},{fold:1},
  {n:35,s:"/models/marts/planning/_planning__models.yml             planning@uni.example …"},{fold:1},
  {n:60,s:"/governance/4-data-products/learners_near_an_award.yml   clara.jensen@uni.example"}],
  GD_COP=[["Mei Tanaka","registrar's office",250],["Planning","Planning's tables",850],["Clara Jensen","Planning",1390]];
function gd_codeowners(ctx,o){o=o||{};const L=o.lit||[],R=gu_file(ctx,100,40,1720,{path:"CODEOWNERS",lines:GD_CO.map((r,i)=>i<2?Object.assign({},r,{lit:o.head||0}):
    i===3?Object.assign({},r,{lit:L[0]||0}):i===5?Object.assign({},r,{lit:L[1]||0}):i===7?Object.assign({},r,{lit:L[2]||0}):r)});
  GD_COP.forEach(([n,r,x],k)=>{const u=(o.card||[])[k]||0;if(u<=0.01)return;const ex=R.tx+gu_mw(ctx,"/models/core/student/_core_student__models.yml           ")+180;
    wc_link(ctx,ex,522,x+130,640,WC_PENCIL,{p:clamp(u*1.6,0,1),vertical:true,a:0.8,lw:3});gu_nameCard(ctx,x,640,n,r,clamp((u-0.35)*2,0,1));});}
// a project decision, as a file beside what it's about: who decided, when and why light in turn (o.lit: [who, when, why])
const GD_DEC=[{n:143,s:"  - id: DEC-PRJ-12"},{n:145,s:"    title: Governance's rules run as a check on every pull request"},{fold:1},
  {n:152,s:"    why: A policy that lives only in a document isn't followed. …"},{n:154,s:"    decided_by: Yusuf Demir, data governance lead, with Noor, data architect"},{n:155,s:"    decided_on: 2026-10-20"}];
function gd_decision(ctx,u,lit){if(u<=0.01)return null;const L=lit||[],e=easeCam(clamp(u,0,1));
  return gu_file(ctx,120,lerp(H+60,200,e),1480,{path:"models/_shared/_shared__decisions.yml",lang:"yaml",rot:-0.006,
    lines:GD_DEC.map((r,i)=>i===4?Object.assign({},r,{lit:L[0]||0}):i===5?Object.assign({},r,{lit:L[1]||0}):i===3?Object.assign({},r,{lit:L[2]||0}):r)});}

/* ---------- a check that teaches ---------- */
// part of a line, washed in a colour as it's named (a, 0 to 1): the sub-string sub of line s, drawn at tx on baseline row r's middle
function gd_mark(ctx,tx,cy,s,sub,a,col){if(a<=0.01)return;const i=s.indexOf(sub);if(i<0)return;gv_tint(ctx,tx+gu_mw(ctx,s.slice(0,i))-6,cy-21,gu_mw(ctx,sub)+12,42,col||GV.gold,0.9*clamp(a,0,1));}
// what the check printed for Jun: what to add (o.what), where (o.where), and the page on how (o.link)
const GD_MSG=["owner: models/marts/planning/_planning__models.yml: mart_planning__completions has no","meta.owner or meta.domain (how to: docs/how-to/add-an-owner.md)"];
function gd_message(ctx,o){o=o||{};const R=gu_file(ctx,100,50,1720,{path:"$ python scripts/check/governance.py",lines:GD_MSG.map(s=>({s,col:GV.redInk}))});
  gd_mark(ctx,R.tx,R.rows[0],GD_MSG[0],"models/marts/planning/_planning__models.yml: mart_planning__completions",o.where);
  gd_mark(ctx,R.tx,R.rows[1],GD_MSG[1],"meta.owner or meta.domain",o.what);gd_mark(ctx,R.tx,R.rows[1],GD_MSG[1],"(how to: docs/how-to/add-an-owner.md)",o.link);return R;}
// the page it links, as the project's docs show it: what the check asks, why, how, and who to ask (o.who lights the last); u brings it
const GD_HOW=[{h:1,s:"Add an owner"},{s:"**What the check asks.** Everything other teams read has an owner: each domain, each"},{s:"entity in a conceptual model, and each shared model."},
  {s:"**Why.** When a number is wrong or a meaning changes, someone has to decide. The owner"},{s:"is that person, and changes reach them for review."},{s:"**How.**"},{fold:1},
  {s:"**Who to ask.** Data governance's office hours, Thursdays from 2 to 3 pm, or"},{s:"data.governance@uni.example. If you don't know who owns it, that's the question to bring."}];
function gd_howto(ctx,u,who){if(u<=0.01)return;const e=easeCam(clamp(u,0,1)),y=lerp(H+60,320,e),x=100,w=1720;
  gv_sheet(ctx,x,y,w,520,{rot:0.004});wc_T(ctx,"docs/how-to/add-an-owner.md",x+30,y+54,{w:500,size:28,f:"mono",col:WC_MUTED});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+24,y+76);ctx.lineTo(x+w-24,y+76);ctx.stroke();ctx.restore();
  gd_md(ctx,x,y+70,w,GD_HOW.map((it,i)=>i>=7?Object.assign({},it,{lit:who}):it));}
// a new rule's warning, as the check prints it until its date: what's missing (o.holds lights it), and the day it becomes an error
// (o.date lights it, o.err underlines it in red)
const GD_WARN=["warning: described: … has no description: say what it holds, in a sentence its readers","know (how to: docs/how-to/describe-a-column.md) (an error from 1 December 2026)"];
function gd_warning(ctx,u,o){if(u<=0.01)return;o=o||{};const e=easeCam(clamp(u,0,1)),R=gu_file(ctx,100,lerp(H+60,200,e),1720,{path:"$ python scripts/check/governance.py",
    lines:GD_WARN.map(s=>({s,col:GV.amberInk})),rot:-0.004});
  gd_mark(ctx,R.tx,R.rows[0],GD_WARN[0],"say what it holds",o.holds,GV.amber);const d="(an error from 1 December 2026)";gd_mark(ctx,R.tx,R.rows[1],GD_WARN[1],d,o.date);
  gd_under(ctx,R.tx+gu_mw(ctx,GD_WARN[1].slice(0,GD_WARN[1].indexOf(d))),R.rows[1]+24,gu_mw(ctx,d),o.err||0,GV.redInk);return R;}
// the rule's days in a line: amber while it warns (o.a), the day it changes (o.date), and red from then, an error (o.err)
function gd_timeline(ctx,o){o=o||{};const a=clamp(o.a||0,0,1);if(a<=0.01)return;const y=650,x0=260,xd=1000,x1=1500,d=clamp(o.date||0,0,1),r=clamp(o.err||0,0,1);
  withA(ctx,clamp(a*2,0,1),()=>{ctx.save();ctx.lineCap="round";ctx.lineWidth=14;ctx.strokeStyle=rgba(GV.amber,0.9);ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(lerp(x0,xd,easeCam(a)),y);ctx.stroke();
    if(r>0.01){ctx.strokeStyle=rgba(GV.red,0.9);ctx.beginPath();ctx.moveTo(xd,y);ctx.lineTo(lerp(xd,x1,easeCam(r)),y);ctx.stroke();}ctx.restore();
    wc_hand(ctx,"a warning",x0,y-34,{size:36,w:700,col:GV.amberInk,p:a});});
  if(d>0.01)withA(ctx,d,()=>{ctx.save();ctx.strokeStyle=rgba(WC_DARK,0.8);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(xd,y-40);ctx.lineTo(xd,y+40);ctx.stroke();ctx.restore();
    wc_tag(ctx,xd,y+86,"1 December 2026",{size:30,align:"center"});});
  if(r>0.01)wc_hand(ctx,"an error",xd+40,y-34,{size:36,w:700,col:GV.redInk,p:r});}
// the warnings, week by week, as a chart in pencil and wash on a sheet pinned to Yusuf's board: each week's bar grows (o.at[i]), and
// when they reach none, a green tick (o.tick)
const GD_WK=[["20 Oct",41],["27 Oct",23],["3 Nov",9],["10 Nov",2],["17 Nov",0]],GD_CH={x:360,y:110,w:1200,h:720,base:700,bw:130,k:9.4};
function gd_barC(i){const C=GD_CH,h=Math.round(41*C.k)+20;return wc_kept("gdBar"+i,C.bw+20,h,q=>wc_wash(q,wc_rect(10,10,C.bw,h-20),GV.amber,{kind:"swatch",a:0.85,seed:191+i}));}
function gd_chart(ctx,t,o){o=o||{};const C=GD_CH;gv_sheet(ctx,C.x,C.y,C.w,C.h,{rot:-0.006});gv_pin(ctx,C.x+C.w/2,C.y+22,GV.red,1.2);
  wc_hand(ctx,"Warnings, week by week",C.x+60,C.y+100,{size:40,w:700,col:WC_DARK});
  ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.8);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(C.x+60,C.base);ctx.lineTo(C.x+C.w-60,C.base);ctx.stroke();ctx.restore();
  GD_WK.forEach(([d,n],i)=>{const cx=C.x+160+i*220,u=clamp((o.at||[])[i]||0,0,1);if(u<=0.01)return;const e=easeCam(u),bh=n*C.k*e;
    if(bh>1){const c=gd_barC(i),full=c.height-20;ctx.save();ctx.beginPath();ctx.rect(cx-C.bw/2-10,C.base-bh,C.bw+20,bh);ctx.clip();ctx.drawImage(c,cx-C.bw/2-10,C.base-full-10);ctx.restore();}
    withA(ctx,clamp(u*2,0,1),()=>{wc_hand(ctx,String(n),cx,C.base-bh-18,{size:40,w:700,align:"center",col:n?GV.amberInk:GV.greenInk});wc_T(ctx,d,cx,C.base+44,{w:600,size:28,align:"center",col:WC_INK});});});
  wc_tick(ctx,C.x+160+4*220,C.base-110,70,GV.greenInk,clamp(o.tick||0,0,1),7);}
// the faculty's office: Anil at his desk, the desk in front of him, kept once
function gd_facDesk(ctx){ctx.drawImage(wc_kept("gdFacDesk",W,H,c=>gv_paintFacultyDesk(c)),0,0);}
// Anil's pull request: a column added to his call list, and the check's message for it, then his line and the check passing
const GD_ANC={title:"School on the call list",sub:"Anil Kurian wants to merge into main"},
  GD_ANM=["columns: models/marts/health/_health__models.yml: mart_health__learner_progress:","school_name has no meta.personal_data: say whether it identifies a person, with",
    "direct, pseudonymous or none (how to: docs/how-to/classify-a-column.md)"];
function gd_anilPR(ctx,t,o){o=o||{};const [x,y,w,h]=GU_BIG;gu_page(ctx,x,y,w,h,{bar:"GitHub · pull request",title:GD_ANC.title,state:["Open",GV.green],sub:GD_ANC.sub,
    tabs:["Conversation","Files changed · 1","Checks · 5"],tab:0});
  const ok=clamp(o.ok||0,0,1),items=GD_PR.ck.map(n=>({name:n,st:n==="governance"?(ok>0.5?"pass":o.fail?"fail":"run"):"pass"})),
    msg=ok>0.5?[{s:GD_PR.g1,col:GV.greenInk},{s:GD_PR.g2,col:GV.greenInk}]:GD_ANM.map((s,i)=>({s,col:GV.redInk,p:clamp((o.msg||0)*3-i,0,1)}));
  const R=gu_checks(ctx,150,330,1620,{h:300,items,t,msg,pop:[0,o.pop||0,0,0,0],msgGap:74});
  if(ok<0.5)gd_mark(ctx,182,R.my+42-10,GD_ANM[1],"school_name has no meta.personal_data",o.lit,GV.red);
  const u=o.sheet||0;if(u>0.01){const e=easeCam(clamp(u,0,1));gu_file(ctx,150,lerp(H+60,654,e),1620,{path:"models/marts/health/_health__models.yml",lang:"yaml",lh:44,rot:0.004,
    lines:[{s:"      - name: school_name"},{s:"        data_type: string"},{s:"        config: {meta: {personal_data: none}}",add:1,p:o.typ||0,lit:o.typ>=1?1:0}]});}}

/* ---------- an agent on every pull request ---------- */
// the skill the team wrote, as a file: the steps lit as they're named (o.lit: [run the checks, read what they can't, draft what's missing])
const GD_SK=[{n:6,s:"# Review a pull request for governance",col:WC_DARK},{fold:1},{n:9,s:"… Most of it is checked by scripts; the rest needs reading. You"},
  {n:10,s:"find, draft and flag. People decide: you never approve, …"},{fold:1},{n:15,s:"1. **Build what changed, and run the checks.**"},{fold:1},{n:28,s:"2. **An owner.** …"},
  {fold:1},{n:40,s:"4. **Classified columns.** …"},{fold:1},{n:49,s:"5. **A test, or a tracking model, for each stated rule.** …"},{fold:1},{n:60,s:"7. **Report.** One comment on the pull request: …"}];
function gd_skill(ctx,t,u,lit){if(u<=0.01)return null;const L=lit||[],e=easeCam(clamp(u,0,1)),y=lerp(H+60,40,e),
    R=gu_file(ctx,120,y,1500,{path:"skills/review-for-governance/SKILL.md",lines:GD_SK.map((r,i)=>i===5?Object.assign({},r,{lit:L[0]||0}):i===2?Object.assign({},r,{lit:L[1]||0}):i===3?Object.assign({},r,{lit:L[2]||0}):
      i===0?Object.assign({},r,{lit:L[3]||0,litCol:wc_lit(GU_CYAN,0.5)}):r)});
  gu_star(ctx,1560,y+46,1.3,t,clamp(u*2,0,1));return R;}
// Anil's first pull request, and the agent's comment on it: a dashed cyan card under its star. o.view: 0, its three findings (o.f[k]
// lights each); 1, the second finding's classes, drafted with counts (o.rows), and who decides each (o.who[k]); 2, the approvals: the
// agent's own line, with no tick, and each person's yes (o.yes[k])
const GD_AP={title:"Faculty of Health call list",sub:"Anil Kurian wants to merge into main"},
  GD_FIND=["1. Nobody answers for it","2. Ten columns don't say whether they identify a person","3. A stated rule has no test"],
  GD_CLS=[["email","direct","7 rows, 6 distinct; 7 look like an email"],["learner_key","pseudonymous","7 rows, 7 distinct; 7 look like a hash"],
    ["award_key","pseudonymous","7 rows, only 2 distinct; … please confirm",1]],
  GD_WHO=["**Who decides:** data governance, for a new owner and the owner register.","**Who decides:** the Faculty of Health, as the mart's owner.",
    "**Who decides:** the Faculty of Health, for the rule; Jun, for the code."],
  GD_YES=[["the Faculty of Health","for the classes and the rule"],["Yusuf Demir, data governance","for the faculty as a new owner"],["Jun Park","for the code"]];
function gd_agentCard(ctx,t,x,y,w,h){wc_panel(ctx,x,y,w,h,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:201});gu_star(ctx,x+44,y+46,1.1,t);
  wc_T(ctx,"Governance review",x+84,y+58,{w:800,size:34,col:WC_DARK});wc_T(ctx,"the agent",x+w-36,y+56,{w:600,size:28,col:GU_CYAN,align:"right"});}
function gd_agentPR(ctx,t,o){o=o||{};const [X,Y,Wd,Hd]=GU_BIG;gu_page(ctx,X,Y,Wd,Hd,{bar:"GitHub · pull request",title:GD_AP.title,state:["Open",GV.green],sub:GD_AP.sub,
    tabs:["Conversation","Files changed · 6","Checks · 5"],tab:0});
  const x=150,y=330,w=1620,v=o.view||0;
  if(v===0){gd_agentCard(ctx,t,x,y,w,500);gu_md(ctx,"It's a comment, not an approval: each finding says who decides.",x+40,y+118,{size:28,col:WC_INK});
    GD_FIND.forEach((s,k)=>{const by=y+214+k*84,a=clamp((o.f||[])[k]||0,0,1);if(a>0.01)gv_tint(ctx,x+24,by-40,w-48,58,GV.gold,0.8*a);
      wc_T(ctx,s,x+40,by,{w:800,size:32,col:WC_DARK,a:0.55+0.45*a});wc_T(ctx,"…",x+40,by+34,{w:500,size:28,f:"mono",col:WC_PENCIL});});}
  else if(v===1){gd_agentCard(ctx,t,x,y,w,520);wc_T(ctx,GD_FIND[1],x+40,y+120,{w:800,size:30,col:WC_DARK});
    [["Column",x+40],["Drafted class",x+380],["Evidence",x+780]].forEach(([s,cx])=>wc_T(ctx,s,cx,y+172,{w:700,size:28,col:WC_MUTED}));
    GD_CLS.forEach(([c,cls,ev,unsure],k)=>{const by=y+228+k*56,a=clamp((o.rows||[])[k]||0,0,1);if(a<=0.01)return;withA(ctx,a,()=>{
      wc_T(ctx,c,x+40,by,{w:500,size:28,f:"mono",col:WC_DARK});const cw=gv_classChip(ctx,x+380,by-10,cls);if(unsure)wc_hand(ctx,"not sure",x+380+cw+14,by,{size:28,w:700,col:GV.amberInk});
      wc_T(ctx,ev,x+780,by,{w:600,size:28,col:WC_INK});});});
    GD_WHO.forEach((s,k)=>{const by=y+420+k*40,a=clamp((o.who||[])[k]||0,0,1);if(a<=0.01)return;gv_tint(ctx,x+24,by-30,w-48,40,GV.gold,0.7*a);
      withA(ctx,clamp(a*2,0,1),()=>{wc_T(ctx,String(k+1),x+44,by,{w:700,size:28,col:WC_MUTED});gu_md(ctx,s,x+80,by,{size:28});});});}
  else{gu_box(ctx,x,y,w,520,"Approvals",{seed:205});const ag=clamp(o.ag||0,0,1);
    withA(ctx,ag,()=>{wc_panel(ctx,x+24,y+82,w-48,92,{kind:"card",dashed:true,role:WC_SIDE.tech,seed:206});gu_star(ctx,x+66,y+128,1,t);
      wc_T(ctx,"Governance review",x+104,y+140,{w:800,size:30,col:WC_DARK});wc_T(ctx,"It's a comment, not an approval",x+440,y+140,{w:600,size:28,col:WC_MUTED});
      ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.6);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+w-80,y+128,20,0,TAU);ctx.stroke();ctx.restore();});
    GD_YES.forEach(([n,f],k)=>{const by=y+250+k*86,a=clamp((o.yes||[])[k]||0,0,1);if(a<=0.01)return;withA(ctx,clamp(a*2,0,1),()=>{
      wc_hand(ctx,n,x+50,by,{size:36,w:700,col:GV.goldInk,p:clamp(a*1.4,0,1)});wc_T(ctx,f,x+620,by,{w:600,size:28,col:WC_INK});});
      wc_tick(ctx,x+w-80,by-10,44,GV.greenInk,clamp(a*1.5-0.4,0,1),6);});}}

/* ---------- carried with the code ---------- */
// Jun's speech bubble, as at the start, with its old line struck through (o.strike) before its new words come (o.mix)
function gd_bubbleStrike(ctx,a,k,strike){if(a<=0.01||strike<=0.01)return;const sz=40,lh=52,y=300+sz*0.5+lh*1.74-14,w=tw(ctx,"after I've built it.",sz,700);
  withA(ctx,a,()=>{ctx.save();ctx.translate(1290,520);ctx.scale(k,k);ctx.translate(-1290,-520);ctx.strokeStyle=rgba(GV.redInk,0.85);ctx.lineWidth=5;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(730,y);ctx.lineTo(730+w*easeCam(clamp(strike,0,1)),y-3);ctx.stroke();ctx.restore();});}
// Noor's map, close: a sheet pinned over it for where each piece lives. The dbt project is the home of five things (o.home[i] brings
// each), and their copies flow one way, to the platform and the catalogue (o.flow[j]), each with a drift check (o.drift[j])
const GD_HOME=["owners","column classes","contracts","tests","decisions"],GD_MAPS={x:500,y:250,w:1270,h:600};
function gd_homeMap(ctx,t,o){o=o||{};const S=GD_MAPS,a=clamp(o.a==null?1:o.a,0,1);if(a<=0.01)return;const e=easeCam(a);
  ctx.save();ctx.translate(0,(1-e)*40);withA(ctx,clamp(a*2,0,1),()=>{gv_sheet(ctx,S.x,S.y,S.w,S.h,{rot:-0.006});gv_pin(ctx,S.x+S.w/2,S.y+22,GV.red,1.3);
    gu_filmTag(ctx,S.x+40,S.y+70,"Where each piece lives",1);
    const bx=S.x+40,by=S.y+120;wc_panel(ctx,bx,by,520,450,{kind:"card",role:WC_SIDE.tech,seed:211});const lw=logo(ctx,"dbt",bx+28,by+20,44);wc_T(ctx,"project",bx+40+lw,by+56,{w:800,size:34,col:WC_DARK});
    GD_HOME.forEach((s,i)=>{const u=clamp((o.home||[])[i]||0,0,1);if(u<=0.01)return;const k=0.9+0.1*spring(u),cy=by+120+i*64;ctx.save();ctx.translate(bx+260,cy);ctx.scale(k,k);
      withA(ctx,clamp(u*2,0,1),()=>{wc_panel(ctx,-220,-26,440,52,{kind:"card",wash:GV.gold,washA:0.3,seed:215+i});wc_T(ctx,s,-192,10,{w:700,size:30,col:WC_DARK});});ctx.restore();});
    [["data platform",by+40],["product catalogue",by+270]].forEach(([s,ty],j)=>{const u=clamp((o.flow||[])[j]||0,0,1);if(u<=0.01)return;const tx=S.x+S.w-460;
      withA(ctx,clamp(u*2,0,1),()=>{wc_panel(ctx,tx,ty,420,130,{kind:"card",seed:221+j});wc_T(ctx,s,tx+30,ty+76,{w:800,size:34,col:WC_DARK});});
      gd_arrow(ctx,[bx+526,ty+50],[tx-14,ty+60],-30,clamp(u*1.4-0.2,0,1),{col:GU_CYAN,lw:5});
      const d=clamp((o.drift||[])[j]||0,0,1);if(d>0.01)withA(ctx,d,()=>{wc_tick(ctx,bx+548,ty+108,30,GV.greenInk,d,5);wc_T(ctx,"drift check",bx+574,ty+118,{w:600,size:28,col:WC_INK});});});});
  ctx.restore();}
// the six pins on the poster, each one's words giving way, in turn, to the line that keeps it in the project, in the typeface, where
// the words were (u, 0 to 1)
const GD_PINC=[["glossary_term:"],["personal_data:"],["owner:","contract:"],["data_tests:"],["CODEOWNERS"],["deprecation_date:"]];
function gd_pinCodes(ctx,u){const [x,y,w,h]=GV_PC,k=w/1260;GU_PINS.forEach(([i,lines],j)=>{const v=clamp(u*6-j,0,1),[sx,sy]=gv_loopPos(i,x,y,w,h),
    c=Math.cos(-Math.PI/2+i/10*TAU),top=i===0,al=top?"center":c>0?"left":"right",nx=top?sx:sx+(c>0?1:-1)*(i===1||i===9?100:46)*k,ny=top?sy+80*k:sy+56*k;
  gu_goldPin(ctx,i,x,y,w,h,1,1,lines,null);
  lines.forEach((s,m)=>{const ly=ny+m*38*k,cs=GD_PINC[j][m],cw=gu_mw(ctx,cs),x0=al==="center"?nx-cw/2:al==="right"?nx-cw:nx;
    if(v<0.5)withA(ctx,1-clamp(v*2,0,1),()=>wc_hand(ctx,s,nx,ly,{size:32*k,w:700,align:al,col:GV.goldInk}));
    else withA(ctx,clamp(v*2-1,0,1),()=>{gv_tint(ctx,x0-8,ly-28,cw+16,40,GV.gold,0.55);gu_code(ctx,cs,x0,ly,{col:WC_DARK});});});});}

const WC_PLACES={data:c=>gv_paintData(c,{words:true}),poster:c=>gv_paintPosterClose(c,{words:true}),board:c=>gv_paintBoardClose(c,GV_ROOM.data),
  boardGov:c=>gv_paintBoardClose(c,GV_ROOM.gov),big:c=>gu_paintScreenBig(c,GV_ROOM.data),bigFac:c=>gu_paintScreenBig(c,GV_ROOM.fac),desk:gu_paintFilesDesk,
  deskGov:gv_paintDesk,mapClose:gv_paintMapClose,faculty:gv_paintFaculty};
