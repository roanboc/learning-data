/* ===== Proof it held: where the learner columns went =====
   Lineage, drawn as Catalog Explorer's lineage graph lays it out: a card for each table, its columns listed, and a line from each
   column to the columns made from it (Unity Catalog records lineage down to the column, for the queries it can infer it from). Three
   tables, left to right: the registrar's raw learner table, loaded each night (registrar.student_system.learners, its columns as the
   student system names them, and no class: classes start on the tables people read, as Tags that travel sets them); the learner table
   built from it (registrar.core.core_learner_v1); and the study's copy (studies.health_progress.learners). The exam support table
   (registrar.support.exam_support, loaded straight in) sits on its own shelf, which the study isn't given, with the new mobile column
   that nothing was made from. Every name starts with ph_. */

const PH_LN={
  raw:{x:92,y:262,cat:"registrar",name:"student_system.learners",cols:["student_id","given_name","family_name","email","date_of_birth"]},
  core:{x:735,y:262,cat:"registrar",name:"core.core_learner_v1",cols:["student_number","learner_code","full_name","email","date_of_birth"]},
  study:{x:1378,y:262,cat:"studies",name:"health_progress.learners",cols:["learner_code","year_of_birth","course","results"]},
  support:{x:735,y:652,cat:"registrar",name:"support.exam_support",cols:["exam_support","mobile"]}
};
const PH_NW=450,PH_RH=50,PH_TOP=92;
// where a column's row is: its left or right edge, at the row's middle
function ph_colAt(n,col,side){const N=PH_LN[n],i=N.cols.indexOf(col);return[N.x+(side==="r"?PH_NW:0),N.y+PH_TOP+i*PH_RH+PH_RH/2-8];}
function ph_node(ctx,n,o){o=o||{};const N=PH_LN[n],h=PH_TOP+N.cols.length*PH_RH+14,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_panel(ctx,N.x,N.y,PH_NW,h,{col:o.col||"cyan",r:16,behind:o.behind,glowR:24});
  dp_T(ctx,N.cat,N.x+24,N.y+38,{w:600,size:28,col:"mut"});dp_T(ctx,N.name,N.x+24,N.y+76,{w:500,size:28,f:"mono"});
  ctx.fillStyle=rgba(DP.T.mut,0.35);ctx.fillRect(N.x+16,N.y+PH_TOP,PH_NW-32,1.2);
  N.cols.forEach((c,i)=>{const yy=N.y+PH_TOP+i*PH_RH+PH_RH/2+2,hl=o.hl&&o.hl[c];
    if(hl>0){ctx.save();ctx.fillStyle=rgba(dp_f(o.hlCol&&o.hlCol[c]||"cyan"),0.16*hl);rr(ctx,N.x+10,yy-PH_RH/2-6,PH_NW-20,PH_RH-4,10);ctx.fill();ctx.restore();}
    dp_T(ctx,c,N.x+24,yy+8,{w:500,size:28,f:"mono",col:"ink"});});
  ctx.restore();}
// a line of lineage from one column to another, drawn on (p 0 to 1); stop (0 to 1) ends it at a coral bar short of the target
function ph_edge(ctx,a,b,col,p,o){o=o||{};if(!(p>0))return;const c=dp_f(col||"cyan"),mx=(a[0]+b[0])/2,P=[a[0],a[1],mx,a[1],mx,b[1],b[0],b[1]],u=clamp(p,0,1);
  ctx.save();ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.shadowColor=rgba(c,0.8);ctx.shadowBlur=8;ag_bzPath(ctx,P,0,u,48);ctx.stroke();ctx.restore();
  ctx.save();ctx.fillStyle=rgba(mix(c,[255,255,255],0.35),1);ctx.beginPath();ctx.arc(a[0],a[1],5,0,TAU);ctx.fill();
  if(u>=1&&!o.stop){ctx.beginPath();ctx.arc(b[0],b[1],6,0,TAU);ctx.fill();}ctx.restore();
  if(o.stop&&u>=1){const cc=dp_f("coral");ctx.save();ctx.shadowColor=rgba(cc,0.9);ctx.shadowBlur=10;ctx.fillStyle=rgba(cc,1);rr(ctx,b[0]-4,b[1]-22,8,44,3);ctx.fill();ctx.restore();}}
/* the whole graph inside a Databricks page: o.sup (0 to 1) the exam support table's card; o.mobile (0 to 1) lights mobile and its
   "went nowhere"; o.code, o.year the study's two protected columns' lines (the student number's own line stops at the learner table);
   o.stop names and emails stopping short of the study; o.support exam support's line stopping at its shelf; o.nodes (0 to 1) the
   three cards coming in */
function ph_lineage(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  dp_page(ctx,x,y,w,h,{tool:"databricks",name:"Databricks",where:"Catalog Explorer · Lineage",title:"Lineage of the learner columns",behind:o.behind});
  const nd=o.nodes==null?1:o.nodes,na=k=>clamp(nd*3-k,0,1);
  const hl={raw:{},core:{},study:{},support:{}},hc={raw:{},core:{},study:{},support:{}};
  if(o.mobile>0){hl.support.mobile=o.mobile;hc.support.mobile="coral";}
  if(o.code>0){hl.raw.student_id=hl.core.student_number=hl.core.learner_code=hl.study.learner_code=o.code;}
  if(o.year>0){hl.raw.date_of_birth=hl.core.date_of_birth=hl.study.year_of_birth=o.year;}
  if(o.stop>0){for(const c of ["given_name","family_name","email"])hl.raw[c]=o.stop;hl.core.full_name=hl.core.email=o.stop;}
  if(o.support>0){hl.support.exam_support=o.support;hc.support.exam_support="violet";}
  ph_node(ctx,"raw",{a:na(0),hl:hl.raw,hlCol:hc.raw,behind:o.behind});ph_node(ctx,"core",{a:na(1),hl:hl.core,behind:o.behind});ph_node(ctx,"study",{a:na(2),hl:hl.study,behind:o.behind});
  if(o.sup>0)ph_node(ctx,"support",{a:o.sup,col:"violet",hl:hl.support,hlCol:hc.support,behind:o.behind});
  // the lines: the build's (the learner table from the raw table), then the copy's (the study's from the learner table)
  const E=(f,fc,t,tc,col,p,op)=>ph_edge(ctx,ph_colAt(f,fc,"r"),ph_colAt(t,tc,"l"),col,p,op);
  const cd=o.code||0,yr=o.year||0,st=o.stop||0;
  E("raw","student_id","core","student_number","cyan",clamp(cd*2,0,1));E("raw","student_id","core","learner_code","cyan",clamp(cd*2,0,1));
  E("core","learner_code","study","learner_code","cyan",clamp(cd*2-1,0,1));
  if(cd>0.5){const s=ph_colAt("core","student_number","r");ph_edge(ctx,s,[s[0]+64,s[1]],"coral",clamp(cd*2-1,0,1),{stop:true});}
  E("raw","date_of_birth","core","date_of_birth","cyan",clamp(yr*2,0,1));E("core","date_of_birth","study","year_of_birth","cyan",clamp(yr*2-1,0,1));
  E("raw","given_name","core","full_name","cyan",clamp(st*2,0,1));E("raw","family_name","core","full_name","cyan",clamp(st*2,0,1));E("raw","email","core","email","cyan",clamp(st*2,0,1));
  if(st>0.5){for(const c of ["full_name","email"]){const s=ph_colAt("core",c,"r");ph_edge(ctx,s,[s[0]+64,s[1]],"coral",clamp(st*2-1,0,1),{stop:true});}}
  if(o.support>0&&o.sup>0){const s=ph_colAt("support","exam_support","r");ph_edge(ctx,s,[s[0]+64,s[1]],"coral",clamp(o.support*1.6-0.4,0,1),{stop:true});}
  // what the lines say, on small pills by the lines
  const lab=(n,col,t,a)=>{if(!(a>0))return;const N=PH_LN[n],i=N.cols.indexOf(col),yy=N.y+PH_TOP+i*PH_RH+PH_RH/2+2,x0=N.x+24+dp_tw(ctx,col,{w:500,size:28,f:"mono"})+18;
    dp_pill(ctx,x0,yy+9,t,"cyan",{a,size:28,glow:6});};
  lab("core","learner_code","keyed hash",ag_in(cd,0.5,0.3));lab("study","year_of_birth","the year",ag_in(yr,0.8,0.2));
  if(o.mobile>0){const m=ph_colAt("support","mobile","r");dp_tag(ctx,m[0]+28,m[1]-30,"went nowhere","green",{a:ag_in(o.mobile,0.3,0.5),size:28,behind:o.behind});}
  ctx.restore();}
