/* ===== One copy, one platform: the claims app on one platform =====
   What only this film draws of the university, in the module's look (look.js, cards.js, map.js, tools.js), each name with the prefix oc_:
   the old way of claiming (a spreadsheet by email, typed again), the usual design (the app on its own database, a pipeline copying each
   change to an analytics platform, reports on the copy), and the design Noor chose: the claims app on Lakebase, the Postgres database in
   Databricks, one copy of its rows in the lake's open storage, Postgres serving the app and the lakehouse reading the same rows for
   analysis, the readers that read that copy through Unity Catalog, the contracts the lakehouse writes and serves to the app, and the one
   thing that still leaves the platform: the hours to pay, for the payroll system the university buys. Everything is in the map's
   coordinates (1920 x 1080), with words of 28 px or more. A person's pay is never on screen: the claims show hours, never amounts. */

/* ---------------------------------------------------------------- small pictures
   a spreadsheet, drawn small: a sheet with a grid and a green-free header (decoration, its cells too small to read on purpose) */
function oc_sheet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  md_card(ctx,x,y,w,h,{r:12});ctx.strokeStyle="rgba(170,200,245,0.35)";ctx.lineWidth=1.2;const rows=5,cols=4,ch=(h-24)/rows,cw=(w-24)/cols;
  for(let r=1;r<rows;r++){ctx.beginPath();ctx.moveTo(x+12,y+12+r*ch);ctx.lineTo(x+w-12,y+12+r*ch);ctx.stroke();}
  for(let q=1;q<cols;q++){ctx.beginPath();ctx.moveTo(x+12+q*cw,y+12);ctx.lineTo(x+12+q*cw,y+h-12);ctx.stroke();}
  ctx.fillStyle="rgba(170,200,245,0.18)";ctx.fillRect(x+12,y+12,w-24,ch);
  const R=ag_rnd(o.seed||8);ctx.fillStyle="rgba(220,232,250,0.55)";for(let r=1;r<rows;r++)for(let q=0;q<cols;q++)if(R()<0.8)ctx.fillRect(x+20+q*cw,y+12+r*ch+ch*0.38,cw*(0.3+R()*0.5),ch*0.24);
  ctx.restore();}
// an email: an envelope, in the colour of data moving; (x, y) its middle, s its width
function oc_mail(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=s,h=s*0.66,col=o.col||MD.flow;ctx.save();ctx.globalAlpha*=a;glow(ctx,x,y,s*0.9,col,0.35);
  rr(ctx,x-w/2,y-h/2,w,h,5);ctx.fillStyle="rgba(10,18,36,0.96)";ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.6;ctx.stroke();
  ctx.beginPath();ctx.moveTo(x-w/2+4,y-h/2+4);ctx.lineTo(x,y+h*0.08);ctx.lineTo(x+w/2-4,y-h/2+4);ctx.stroke();ctx.restore();}
// a ledger's page, drawn small as a card: what the ledger kept, a line moved from page to page (for the breath into the claims' row)
function oc_pageCard(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=o.h||96;ctx.save();ctx.globalAlpha*=a;
  oc_shadowR(ctx,x+6,y+12,w,h,0.5,10);
  ctx.fillStyle=rgba(OC.paper,1);ctx.fillRect(x,y,w,h);ctx.strokeStyle=rgba(OC.paperEdge,1);ctx.lineWidth=1.5;ctx.strokeRect(x,y,w,h);
  md_T(ctx,o.s||"To page 87",x+28,y+h/2+11,{w:600,size:30,color:rgba(OC.ink,0.95)});md_T(ctx,o.n||"300 guilders",x+w-28,y+h/2+11,{w:700,size:30,align:"right",color:rgba(OC.ink,0.95)});ctx.restore();}

/* ---------------------------------------------------------------- the claims, as the app keeps them
   Linh's claims in the app's table, one row each: the claim ID, the unit, the duty, the hours and where the coordinator's approval stands
   (amber while it waits for a person, green once approved). No amounts: a claim's amount is a person's pay. */
const OC_ROWS=[["CL-104190","HI101","marking","3.50","approved"],["CL-104233","HI101","tutorial","1.00","approved"],["CL-104251","HI101","marking","2.00","returned"],["CL-104262","HI101","consultation","1.50","submitted"]];
const OC_COLS=[{h:"claim",w:210,f:"mono"},{h:"unit",w:128},{h:"duty",w:214},{h:"hours",w:152},{h:"status",w:214}];
// the status cell: its word, with a tick once approved, or a clock while it waits
function oc_status(s){return s==="approved"?{s,col:MD.pass,icon:"tick"}:{s,col:MD.wait,icon:"clock"};}
/* the claims table in Lakebase's window, in the frame: o.write (0 to 1) Linh's claim CL-104233 is written, o.ok (0 to 1) her coordinator
   approves it in the same row, o.lit its row glows; o.a, o.k */
function oc_claimsWin(ctx,x,y,o){o=o||{};const w=976,h=440;md_window(ctx,x,y,w,h,{logo:"databricks",product:"Lakebase",title:"claims · Postgres",edge:o.edge||MD.sys.hr,a:o.a,k:o.k,
  draw:(c,b)=>{const wr=o.write==null?1:o.write,ok=o.ok==null?1:o.ok;
    const rows=OC_ROWS.map((r,i)=>{if(i!==1)return r.map((v,j)=>j===4?oc_status(v):v);const st=ok>=0.5?"approved":"submitted";return r.map((v,j)=>j===4?oc_status(st):v);});
    md_rows(c,b.x+8,b.y+6,OC_COLS,rows,{rh:62,lit:o.lit>0?[1]:[],litCol:ok>=0.5?MD.pass:MD.wait,rowA:(r,i)=>i===1?ag_in(wr,0,0.5):1});
    if(wr<1&&wr>0){const cx=b.x+22+lerp(0,880,wr),cy=b.y+6+62*2+31;c.fillStyle=rgba(MD.ink,0.9*(Math.sin(wr*40)>0?1:0.3));c.fillRect(cx,cy-18,3,36);}}});
  return{x,y,w,h};}

/* ---------------------------------------------------------------- the usual design
   OC_USUAL holds where its parts are. oc_usual(ctx, t, o) draws them: the app on its own database, the pipeline, the analytics platform
   with its copy of the claims, the reports on the copy; o.parts (each 0 to 1, coming in): app, pipe, plat, copy, rep; o.cost (0 to 1 each:
   the two platforms, the pipeline, two sets of permissions, the copy behind): what it costs, lit in turn; o.gone (0 to 1 each: pipe,
   plat, sync): what one copy on one platform does without, crossed out and fading; o.a */
const OC_USUAL={app:[70,410,420],pipe:[[490,465],[700,465]],plat:[700,300,700,400],copy:[740,410,620],rep:[1490,410,370]};
function oc_usual(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const p=o.parts||{},cost=o.cost||{},gone=o.gone||{},U=OC_USUAL,ga=k=>1-0.85*ag_sine(gone[k]||0);ctx.save();ctx.globalAlpha*=a;
  const pa=k=>p[k]==null?1:clamp(p[k],0,1);
  // the app, its own database under it
  if(pa("app")>0){const [x,y,w]=U.app;withA(ctx,pa("app"),()=>{md_system(ctx,x,y,w,{n:"Claims app",s:"its own database",c:MD.sys.hr},{lit:cost.perm||0});
    md_tag(ctx,x,y+150,"its permissions",{col:MD.soft,icon:"lock",a:ag_in(cost.perm||0,0,0.5)});});}
  // the analytics platform, with a copy of the claims and its own permissions
  if(pa("plat")>0){const [x,y,w,h]=U.plat;withA(ctx,pa("plat")*ga("plat"),()=>{md_card(ctx,x,y,w,h,{edge:[150,175,215],glow:0.4+0.8*(cost.two||0),edgeA:0.6+0.4*(cost.two||0),r:22});
      md_T(ctx,"Analytics platform",x+30,y+60,{w:800,size:34});md_tag(ctx,x+30,y+h-50,"its own permissions",{col:MD.soft,icon:"lock",a:ag_in(cost.perm||0,0.3,0.5)});
      if(pa("copy")>0){const [cx,cy,cw]=U.copy;md_table(ctx,cx,cy,cw,{name:"claims",kind:"a copy of the app's",a:pa("copy"),lit:cost.behind||0});
        md_tag(ctx,cx+cw-300,cy-46,"a little behind",{col:MD.soft,icon:"clock",a:ag_in(cost.behind||0,0,0.5)});}});
    if(gone.plat>0)md_icon(ctx,"cross",x+w/2,y+h/2,90,MD.soft,{a:ag_in(gone.plat,0,0.3)*(1-ag_in(gone.plat,0.7,0.3))});}
  // the pipeline between them, copying each change
  if(pa("pipe")>0){const [A,B]=U.pipe;withA(ctx,ga("pipe"),()=>md_way(ctx,"events",A,B,t,{u:pa("pipe"),icon:pa("pipe")>=1,label:"a pipeline",labelBelow:82,lit:cost.pipe}));
    if(cost.pipe>0)glow(ctx,(A[0]+B[0])/2,A[1],120,MD.flow,0.25*cost.pipe*ga("pipe"));
    if(gone.pipe>0)md_icon(ctx,"cross",(A[0]+B[0])/2,A[1]-70,64,MD.soft,{a:ag_in(gone.pipe,0,0.3)*(1-ag_in(gone.pipe,0.7,0.3))});}
  // keeping the two copies in step: the copy's clock, crossed out with it
  if(gone.sync>0){const [cx,cy,cw]=U.copy;md_icon(ctx,"cross",cx+cw-170,cy-46,60,MD.soft,{a:ag_in(gone.sync,0,0.3)*(1-ag_in(gone.sync,0.7,0.3))});}
  // the reports, on the copy
  if(pa("rep")>0){const [x,y,w]=U.rep,P0=[U.plat[0]+U.plat[2],U.copy[1]+52];withA(ctx,pa("rep")*ga("plat"),()=>{const r=md_reader(ctx,x,y,w,{title:"Reports",sub:"on the copy",icon:"view"});
      md_way(ctx,"query",P0,r.port,t,{u:pa("rep")});});}
  ctx.restore();}

/* ---------------------------------------------------------------- one copy, on one platform
   OC_ONE holds where its parts are, in the map's coordinates: the claims app and the HR system outside the platform on the left, where
   data is born; inside it, Lakebase (Postgres) and the lakehouse over one copy of the rows, its two tables (the claims, the contracts),
   the three readers of the claims, and Unity Catalog along its foot; outside on the right, the payroll system the university buys.
   oc_one(ctx, t, o) draws them; o.parts (each 0 to 1, coming in): app, plat, lakebase, lakehouse, copy, write (the app's lane to its
   rows), read (the lakehouse reading in place), readers, uc (Unity Catalog lit on the readers' lanes), hr, contracts (the lakehouse
   writing them), serve (served to the app), check (each claim checked against its contract), payroll, tuesday (the hours to pay leaving
   by noon on Tuesday); o.lit: what glows ("claims", "contracts", "lakebase", "lakehouse", "uc", "tuesday", "once"); o.dim (0 to 1) all
   but the hours' lane fade; o.writer (0 to 1 each: claims, contracts) each table's writer named; o.ucText; o.a */
const OC_ONE={app:[50,236,370],hr:[50,610,370],plat:[440,138,1060,742],lakebase:[476,236,456],lakehouse:[1012,236,456],copy:[476,404,560,330],claims:[510,474,492],
  contracts:[510,596,492],readers:[[1078,404,"Payroll","claims still waiting","clock"],[1078,520,"Claims job","the hours to pay","refresh"],[1078,636,"Finance","casual teaching cost","contract"]],readerW:390,payroll:[1536,690,350]};
function oc_one(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;const p=o.parts||{},O=OC_ONE,pa=k=>p[k]==null?0:clamp(p[k],0,1),lit=k=>o.lit===k||(Array.isArray(o.lit)&&o.lit.includes(k))?1:0,
    dm=1-0.75*clamp(o.dim||0,0,1),wr=o.writer||{},out={};ctx.save();ctx.globalAlpha*=a;
  // the platform, with Unity Catalog along its foot
  if(pa("plat")>0){const [x,y,w,h]=O.plat;withA(ctx,pa("plat")*dm,()=>md_platform(ctx,x,y,w,h,{uc:true,ucText:o.ucText,lit:0}));
    if(lit("uc")>0||pa("uc")>0){const by=y+h-96,u=Math.max(lit("uc"),pa("uc"));withA(ctx,dm,()=>{glow(ctx,x+w/2,by+36,w*0.45,MD.flow,0.18*u);ctx.save();ctx.globalAlpha*=u;
      md_card(ctx,x+24,by,w-48,72,{edge:MD.flow,glow:1.4,r:14,dash:false,fill:"rgba(0,0,0,0)"});ctx.restore();});}}
  // the claims app and the HR system, where the data is born
  if(pa("app")>0){const [x,y,w]=O.app;withA(ctx,pa("app")*dm,()=>{out.app=md_system(ctx,x,y,w,{n:"Claims app",s:"where claims start",c:MD.sys.hr},{lit:lit("app")});});}
  if(pa("hr")>0){const [x,y,w]=O.hr;withA(ctx,pa("hr")*dm,()=>{out.hr=md_system(ctx,x,y,w,"hr",{sub:"staff and contracts",lit:lit("hr")});});}
  // the two engines
  if(pa("lakebase")>0){const [x,y,w]=O.lakebase;withA(ctx,pa("lakebase")*dm,()=>md_reader(ctx,x,y,w,{title:"Lakebase",sub:"Postgres serves the app",icon:"store",col:MD.flow,lit:lit("lakebase")}));}
  if(pa("lakehouse")>0){const [x,y,w]=O.lakehouse;withA(ctx,pa("lakehouse")*dm,()=>md_reader(ctx,x,y,w,{title:"Lakehouse",sub:"reads for analysis",icon:"query",col:MD.flow,lit:lit("lakehouse")}));}
  // one copy: the rows in the lake's open storage, two tables, each with one writer
  if(pa("copy")>0){const [x,y,w,h]=O.copy;withA(ctx,pa("copy")*dm,()=>{if(lit("once")>0)glow(ctx,x+w/2,y+h/2,w*0.7,MD.agreed,0.22*lit("once"));
      md_card(ctx,x,y,w,h,{edge:lit("once")>0?mix(MD.flow,MD.agreed,lit("once")):MD.flow,glow:0.7+0.7*lit("once"),r:18,fill:"rgba(8,14,30,0.9)"});
      md_icon(ctx,"store",x+36,y+40,34,MD.flow);md_label(ctx,x+66,y+50,"One copy",{col:MD.ink});
      const [cx,cy,cw]=O.claims,[kx,ky,kw]=O.contracts;
      out.claims=md_table(ctx,cx,cy,cw,{name:"claims",kind:wr.claims>0?"the app writes it":"rows",lit:lit("claims")});
      if(pa("contracts")>0||wr.contracts>0)withA(ctx,Math.max(pa("contracts"),pa("hr")),()=>{out.contracts=md_table(ctx,kx,ky,kw,{name:"contracts",kind:wr.contracts>0?"the lakehouse writes it":"rows",lit:lit("contracts")});});});}
  const C=O.copy,cr=[C[0]+C[2],C[1]+C[3]/2];
  // the app writes its claims through Postgres: a request out, an answer back; and its rows go down into the copy
  if(pa("write")>0){const [ax,ay,aw]=O.app,[lx,ly,lw]=O.lakebase;withA(ctx,dm,()=>{md_way(ctx,"api",[ax+aw,ay+55],[lx,ly+55],t,{u:pa("write")});
      const pts=md_path([[lx+340,ly+110],[lx+340,O.claims[1]]]);md_lane(ctx,pts,MD.flow,0.85,{u:pa("write")});if(pa("write")>=1)md_flow(ctx,pts,t,{every:1.4,dur:0.9});});}
  // the lakehouse reads the same rows, in place: a dashed lane, a question down and the answer back, nothing kept
  if(pa("read")>0){const [lx,ly,lw]=O.lakehouse;withA(ctx,dm,()=>md_way(ctx,"query",[lx+80,ly+110],[C[0]+C[2]-60,C[1]],t,{u:pa("read"),pts:md_path([[lx+80,ly+110],[lx+80,ly+140],[C[0]+C[2]-60,ly+140],[C[0]+C[2]-60,C[1]]])}));}
  // the readers, each reading that copy through Unity Catalog
  if(pa("readers")>0){O.readers.forEach(([x,y,title,sub,icon],i)=>{const k=clamp(pa("readers")*1.6-i*0.3,0,1);if(k<=0)return;const fin=title==="Finance";
      withA(ctx,ag_in(k,0,0.5)*dm,()=>{const r=md_reader(ctx,x,y,O.readerW,{title,sub,icon,col:fin?MD.dom.finance:MD.flow,lit:lit("reader"+i),h:100});
        const pts=md_path([[cr[0],r.port[1]],[x,r.port[1]]]);md_way(ctx,"query",pts[0],pts[pts.length-1],t,{pts,u:ag_in(k,0.2,0.6)});
        if(pa("uc")>0){const mx=(cr[0]+x)/2;ctx.save();ctx.globalAlpha*=ag_in(pa("uc"),i*0.15,0.4);ctx.beginPath();ctx.arc(mx,r.port[1],18,0,TAU);ctx.fillStyle="rgba(7,12,26,0.96)";ctx.fill();
          ctx.strokeStyle=rgba(MD.flow,0.95);ctx.lineWidth=2;ctx.stroke();md_icon(ctx,"table",mx,r.port[1],20,MD.flow);ctx.restore();}});});}
  // the HR system's contracts, which the lakehouse writes; served to the app, which checks each claim against its contract
  if(pa("contracts")>0&&out.hr){const [kx,ky]=O.contracts;withA(ctx,dm,()=>md_way(ctx,"connector",out.hr.port,[kx,ky+52],t,{u:pa("contracts"),bend:0.5}));}
  if(pa("serve")>0){const [lx,ly]=O.lakebase,[kx,ky]=O.contracts,pts=md_path([[kx,ky+80],[kx-22,ky+80],[kx-22,ly+120],[lx+40,ly+120],[lx+40,ly+110]]);
    withA(ctx,dm,()=>{md_lane(ctx,pts,MD.flow,0.8,{u:pa("serve")});if(pa("serve")>=1)md_flow(ctx,pts,t,{every:1.6,dur:1.2,off:0.4});});}
  if(pa("check")>0&&out.app){const [ax,ay,aw]=O.app;md_pill(ctx,ax+aw/2,ay+164,"within its contract",{col:MD.pass,icon:"tick",size:28,a:ag_in(pa("check"),0,0.4)*dm,k:Math.min(1,ag_spr(pa("check"),0,0.5))});}
  // the payroll system the university buys, off the platform; the hours to pay leave by noon on Tuesday, under a contract with payroll
  if(pa("payroll")>0){const [x,y,w]=O.payroll;withA(ctx,pa("payroll"),()=>{out.payroll=md_system(ctx,x,y,w,{n:"Payroll system",s:"off the platform",c:MD.sys.hr},{lit:lit("tuesday")});});}
  if(pa("tuesday")>0&&out.payroll){const j=O.readers[1],P0=[j[0]+O.readerW,j[1]+50],P1=[O.payroll[0],O.payroll[1]+55],pts=md_curve(P0,P1,{bend:0.5});
    md_lane(ctx,pts,MD.agreed,0.9,{u:pa("tuesday")});if(pa("tuesday")>=1)md_flow(ctx,pts,t,{kind:"batch",col:MD.agreed,every:3.6,dur:2.2,size:0.8});
    const m=pts[Math.floor(pts.length/2)];ctx.save();ctx.globalAlpha*=ag_in(pa("tuesday"),0.5,0.4);ctx.beginPath();ctx.arc(m[0],m[1],26,0,TAU);ctx.fillStyle="rgba(7,12,26,0.96)";ctx.shadowColor=rgba(MD.agreed,0.8);ctx.shadowBlur=16;ctx.fill();
    ctx.shadowBlur=0;ctx.strokeStyle=rgba(MD.agreed,0.95);ctx.lineWidth=2.4;ctx.stroke();md_icon(ctx,"contract",m[0],m[1],28,MD.agreed);ctx.restore();}
  ctx.restore();return out;}
