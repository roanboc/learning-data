/* ===== A hundred records: the platform describes the whole list, and the checks written from what it showed =====
   The tools' pages, drawn for the film with the module's dq_window (its bar names the product, with its official logo), never a
   screenshot and never a tour; the platform's own words as its docs give them on 5 November 2026 (Catalog Explorer's Quality tab,
   Data Quality Monitoring's Data profiling, the profile's metrics, Add custom metric), and the example project's own lines.
     hr_catalog(ctx, x, y, w, h, o)   Catalog Explorer, the list's table and its tabs, Quality lit (o.lit 0 to 1)
     hr_cell(ctx, x, y, w, h, o)      a notebook's cell and its results, the + menu open on Data Profile (o.menu 0 to 1)
     hr_monitor(ctx, x, y, w, h, o)   the Data Quality Monitoring dialog: Data profiling, its profile type, Snapshot (o.lit 0 to 1)
     hr_profile(ctx, x, y, w, h, o)   the profile: a row for each column, the metrics coming in one by one (o.cols 0 to 4, o.colA(j)),
                                      family_name's longest lit (o.lit30 0 to 1), the rows read (o.read 0 to 1); hr_profileCell finds a value
     hr_frequent(ctx, x, y, w, o)     family_name's most frequent values, the same name twice (o.lit 0 to 1)
     hr_metric(ctx, x, y, w, h, o)    Add custom metric, filled in for the names exactly 30 characters long (o.fill 0 to 1)
     hr_checksFile(ctx, x, y, w, h, o) the three checks in the example project, as dbt runs them (o.lines 0 to n, o.lit) */
const HR_TABLE="mart_graduations__graduation_list";
function hr_tabs(ctx,x,y,tabs,lit,litA){let xx=x;tabs.forEach((t,i)=>{const tw=dq_tw(ctx,t,{w:700,size:28});if(i===lit&&litA>0){ctx.fillStyle=rgba([196,172,128],0.28*litA);rr(ctx,xx-14,y-36,tw+28,52,8);ctx.fill();
    ctx.fillStyle=rgba(DQ.ink,litA);ctx.fillRect(xx-4,y+14,tw+8,3.5);}dq_T(ctx,t,xx,y,{w:700,size:28,col:i===lit&&litA>0.5?DQ.ink:DQ.soft});xx+=tw+44;});return xx;}
function hr_catalog(ctx,x,y,w,h,o){o=o||{};return dq_window(ctx,x,y,w,h,{logo:"databricks",product:"Databricks",title:"Catalog Explorer",a:o.a,k:o.k,on:o.on,draw:(c,b)=>{
  dq_icon(c,"table",b.x+30,b.y+40,40,DQ.ink);dq_T(c,HR_TABLE,b.x+66,b.y+50,{w:500,size:30,f:"mono"});
  dq_T(c,"main · marts",b.x+66,b.y+92,{w:600,size:28,col:DQ.soft});
  c.fillStyle="rgba(110,90,66,0.22)";c.fillRect(b.x,b.y+170,b.w,1.5);
  hr_tabs(c,b.x+16,b.y+152,["Overview","Sample Data","Details","Lineage","Quality"],4,o.lit||0);
  if(o.body)o.body(c,{x:b.x,y:b.y+190,w:b.w,h:b.h-190});}});}
function hr_cell(ctx,x,y,w,h,o){o=o||{};return dq_window(ctx,x,y,w,h,{logo:"databricks",product:"Databricks",title:"Notebook",a:o.a,k:o.k,on:o.on,draw:(c,b)=>{
  c.fillStyle="rgba(120,100,76,0.08)";rr(c,b.x,b.y,b.w,64,8);c.fill();dq_T(c,"display(graduation_list)",b.x+20,b.y+42,{w:500,size:28,f:"mono"});
  hr_tabs(c,b.x+20,b.y+120,["Table","+"],1,o.menu||0);
  const m=o.menu||0;if(m>0){c.save();c.globalAlpha*=m;dq_card(c,b.x+120,b.y+150,300,140,{r:8});dq_T(c,"Visualization",b.x+146,b.y+200,{w:600,size:28,col:DQ.soft});
    c.fillStyle=rgba([196,172,128],0.3);rr(c,b.x+132,b.y+222,276,52,6);c.fill();dq_T(c,"Data Profile",b.x+146,b.y+258,{w:700,size:28});c.restore();}}});}
function hr_monitor(ctx,x,y,w,h,o){o=o||{};return dq_window(ctx,x,y,w,h,{logo:"databricks",product:"Databricks",title:"Data Quality Monitoring",a:o.a,k:o.k,on:o.on,draw:(c,b)=>{
  const L=o.lit||0;c.fillStyle=rgba([196,172,128],0.28*L);rr(c,b.x,b.y+6,b.w,70,8);c.fill();
  dq_T(c,"Data profiling",b.x+24,b.y+52,{w:800,size:30});dq_T(c,"Configure",b.x+b.w-24,b.y+52,{w:700,size:28,align:"right",col:"steel",a:0.4+0.6*L});
  dq_T(c,"Profile type",b.x+24,b.y+132,{w:600,size:28,col:DQ.soft});
  const pa=o.type||0;c.save();c.globalAlpha*=0.35+0.65*pa;c.strokeStyle="rgba(110,90,66,0.5)";c.lineWidth=1.6;rr(c,b.x+24,b.y+150,300,56,8);c.stroke();
  dq_T(c,"Snapshot",b.x+44,b.y+188,{w:700,size:28});c.restore();}});}
// the profile's numbers for December 2025's list, as the platform built it: invented, believable, and matching numbers.md (2,031
// graduates; the longest family name 30 characters)
const HR_PROF={cols:["column_name","num_nulls","distinct_count","min_len","max_len"],cw:[240,200,280,160,150],rows:[["given_name","0","1,512","2","19"],["family_name","0","1,689","2","30"],
  ["award_name","0","58","17","46"],["ceremony_id","0","6","7","7"]]};
// where a value sits in the profile drawn at (x, y): row i (0 is the first column of the list), metric j (0 is column_name)
function hr_profileCell(x,y,i,j){let cx=x+24+8+14;for(let k=0;k<j;k++)cx+=HR_PROF.cw[k];return[cx+18,y+68+18+8+60*(i+1)+30];}
function hr_profile(ctx,x,y,w,h,o){o=o||{};return dq_window(ctx,x,y,w,h,{logo:"databricks",product:"Databricks",title:"Data profiling · "+(o.title||"Profile metrics"),a:o.a,k:o.k,on:o.on,draw:(c,b)=>{
  const cw=HR_PROF.cw,L30=o.lit30||0,cA=j=>j===0?1:clamp(o.colA?o.colA(j):1,0,1),xs=cw.map((_,j)=>b.x+8+cw.slice(0,j).reduce((s_,v)=>s_+v,0));
  // the metrics as the platform names them, the profile table's own columns, in mono; each comes in as the voice names it
  HR_PROF.cols.forEach((hd,j)=>{if(cA(j)>0.004)dq_T(c,hd,xs[j]+14,b.y+8+38,{w:500,size:28,f:"mono",col:DQ.soft,a:cA(j)});});
  dq_rows(c,b.x+8,b.y+8,cw.map(w_=>({h:"",w:w_})),HR_PROF.rows.map((r,i)=>r.map((v,j)=>{if(j===0)return{s:v,f:"mono"};if(cA(j)<0.999)return"";
      const lit=i===1&&j===4&&L30>0;return lit?{s:v,col:L30>0.5?"steel":DQ.ink}:v;})),{rh:60,lit:L30>0?[1]:[],litCol:L30>0.5?"steel":null,rowA:(r,i)=>o.rowA?o.rowA(i):1});
  // a column still coming in: its values faded in over the row lines
  for(let j=1;j<cw.length;j++){const ja=cA(j);if(ja<=0.004||ja>=0.999)continue;HR_PROF.rows.forEach((r,i)=>{const ra=o.rowA?o.rowA(i):1;
    dq_T(c,r[j],xs[j]+14,b.y+8+60*(i+1)+40,{w:600,size:28,a:ja*ra});});}
  if(L30>0){const tw=dq_tw(c,"30",{w:600,size:28}),ex=xs[4]+14+tw/2,ey=b.y+8+60*2+30;c.strokeStyle=rgba(DQ.steel,L30);c.lineWidth=3.5;c.beginPath();c.ellipse(ex,ey,46,26,0,0,TAU);c.stroke();}
  // every row read: a thin bar that fills as it reads, and the voice's words (the list has a row for each certificate, so no count)
  if(o.read!=null&&o.read>0){const ry=b.y+8+60*5+22,rw=b.w-16,u=clamp(o.read,0,1);c.fillStyle="rgba(110,90,66,0.16)";rr(c,b.x+8,ry,rw,8,4);c.fill();
    c.fillStyle=rgba(DQ.steel,0.85);rr(c,b.x+8,ry,Math.max(8,rw*u),8,4);c.fill();
    dq_T(c,"Snapshot · reads every row",b.x+8,ry+52,{w:600,size:28,col:DQ.soft,a:clamp(o.read*4,0,1)});}}});}
function hr_frequent(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const rows=[["Nguyen","23"],["Smith","19"],["Chen","17"],["NGUYEN","4"],["SMITH","3"]],top=136,h=top+rows.length*56+20;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));dq_card(ctx,x,y,w,h,{on:o.on});
  // the profile's own names: the column, then its metric
  dq_T(ctx,"family_name",x+DQ_PAD,y+52,{w:500,size:28,f:"mono"});dq_T(ctx,"frequent_items",x+DQ_PAD,y+92,{w:500,size:28,f:"mono",col:DQ.soft});
  ctx.fillStyle="rgba(110,90,66,0.3)";ctx.fillRect(x+DQ_PAD,y+top-14,w-2*DQ_PAD,1.6);const L=o.lit||0;
  rows.forEach((r,i)=>{const ry=y+top+i*56,caps=r[0]===r[0].toUpperCase(),twin=L>0&&(r[0].toUpperCase()==="NGUYEN"||r[0].toUpperCase()==="SMITH");
    if(twin){ctx.fillStyle=rgba([196,172,128],0.28*L);rr(ctx,x+12,ry+2,w-24,50,6);ctx.fill();if(caps){ctx.fillStyle=rgba(DQ.steel,L);rr(ctx,x+12,ry+2,6,50,3);ctx.fill();}}
    dq_T(ctx,r[0],x+DQ_PAD+10,ry+38,{w:500,size:30,f:"mono"});dq_T(ctx,r[1],x+w-DQ_PAD,ry+38,{w:600,size:30,align:"right",col:DQ.soft});});
  ctx.restore();return{x,y,w,h};}
// the custom metric as Jun writes it (the example project's analyses/profiling/profile_graduation_list.sql holds the same three)
const HR_METRIC_DEF=["count(distinct case when length(family_name) = 30","  then student_bk end)"];
function hr_metric(ctx,x,y,w,h,o){o=o||{};return dq_window(ctx,x,y,w,h,{logo:"databricks",product:"Databricks",title:"Add custom metric",a:o.a,k:o.k,on:o.on,draw:(c,b)=>{
  const F=o.fill==null?1:o.fill,row=(i,k,v,mono)=>{const ry=b.y+20+i*76,va=clamp(F*5-i,0,1);dq_T(c,k,b.x+20,ry+40,{w:600,size:28,col:DQ.soft});
    c.strokeStyle="rgba(110,90,66,0.4)";c.lineWidth=1.4;rr(c,b.x+250,ry,b.w-270,58,8);c.stroke();if(va>0)dq_T(c,v,b.x+270,ry+40,{w:mono?500:700,size:28,f:mono?"mono":undefined,a:va});};
  row(0,"Name","family_name_at_30",true);row(1,"Type","Aggregate");row(2,"Input columns",":table",true);row(3,"Output type","Long");
  const dy=b.y+20+4*76,da=clamp(F*5-4,0,1);dq_T(c,"Definition",b.x+20,dy+40,{w:600,size:28,col:DQ.soft});c.strokeStyle="rgba(110,90,66,0.4)";c.lineWidth=1.4;rr(c,b.x+250,dy,b.w-270,108,8);c.stroke();
  if(da>0)HR_METRIC_DEF.forEach((l,i)=>dq_T(c,l,b.x+270,dy+40+i*44,{w:500,size:28,f:"mono",a:da}));}});}
// the checks, as the example project writes them (tests/quality/_quality__tests.yml): the shown lines are the file's own
const HR_CHECKS_YML=[[["data_tests:",null]],[["  - name: ",null],["graduation_list_family_name_at_30",null]],[["    config:",null]],
  [["      severity: ",null],["warn","hold"]],[["      meta:",null]],[["        owner: ",null],["\"Mei Tanaka, registrar's office\"",null]]];
const HR_CHECKS_FILES=["graduation_list_family_name_at_30.sql","graduation_list_family_name_in_capitals.sql","graduation_list_accents_all_gone.sql"];
function hr_checksFile(ctx,x,y,w,h,o){o=o||{};return dq_window(ctx,x,y,w,h,{logo:"dbt",product:"dbt",title:"tests/quality/",a:o.a,k:o.k,on:o.on,draw:(c,b)=>{
  const fa=o.files==null?1:o.files;HR_CHECKS_FILES.forEach((f,i)=>{const ap=clamp(fa*3-i,0,1);if(ap<=0)return;dq_icon(c,"form",b.x+24,b.y+34+i*54,30,DQ.soft,{a:ap});dq_T(c,f,b.x+52,b.y+44+i*54,{w:500,size:28,f:"mono",a:ap});});
  c.fillStyle="rgba(110,90,66,0.22)";c.fillRect(b.x,b.y+190,b.w,1.5);dq_T(c,"_quality__tests.yml",b.x+20,b.y+236,{w:700,size:28,col:DQ.soft});
  const n=o.lines==null?HR_CHECKS_YML.length:o.lines;dq_code(c,b.x+20,b.y+258,HR_CHECKS_YML,{lineA:(l,i)=>clamp(n-i,0,1),lit:o.lit,w:b.w-40});}});}
