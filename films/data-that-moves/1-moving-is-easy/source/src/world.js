/* ===== Moving is easy, agreeing is the work: the university's side of the film =====
   The platform map of the module, composed for this film (the place "map"): the HR system and the finance system on the left, the
   platform in the middle with bronze and the ledger read in place, and who reads on the right (Microsoft Fabric, a partner, an app),
   with the five ways between them; the file that once went to Finance and its columns; the contract at the HR system's interface;
   and the cards the film shows over a veil. Every name starts with mv_ or MV_. The map is drawn in the place's coordinates (under the
   camera); the cards, the people and the kicker are drawn in the frame (mv_scr), so their words keep their size. */

const MV={
  hr:[60,250,380],fin:[60,560,380],             // the systems: x, y, w (110 tall)
  plat:[700,170,520,660],                        // the platform: x, y, w, h
  bronze:[724,262,472,236],                      // bronze, inside it
  tHR:[742,350,436],                             // the HR system's contracts, landed in bronze: x, y, w (104 tall)
  tGL:[724,566,472],                             // Finance's general ledger, a foreign table read in place
  fabric:[1480,200,380],partner:[1480,420,380],app:[1480,640,380]   // who reads it
};
// where each way runs, from one part to the other
const MV_WAYS={
  connector:{a:[440,305],b:[742,402],label:["Managed","connector"],col:MD.flow},
  query:{a:[724,618],b:[440,615],label:["Query in place"],col:MD.flow},
  mirror:{a:[1220,330],b:[1480,255],label:["Mirror"],col:MD.flow},
  share:{a:[1220,475],b:[1480,475],label:["Share"],col:MD.flow},
  api:{a:[1220,640],b:[1480,695],label:["API"],col:MD.flow}
};
const MV_ORDER=["connector","query","mirror","share","api"];

// draw in the frame, whatever the camera is doing
function mv_scr(ctx,S,fn){ctx.save();setScreen(ctx,S);fn();ctx.restore();}
// text on its way somewhere, too small to read for a moment, is decoration on purpose: PH_OFF is the legibility check's hook, as From
// words to data's tools name it
let PH_OFF=0;
function mv_deco(on,fn){if(!on)return fn();PH_OFF++;try{return fn();}finally{PH_OFF--;}}
// how far the map steps back under a veil: quickly, so its words are under half strength before the words over it come up to it
const mv_back=v=>1-0.56*Math.min(1,v*2.5);
// shown from t0 (over d), put away from t1
const mv_io=(t,t0,t1,d)=>ag_in(t,t0,d||0.5)*(t1==null?1:1-ag_in(t,t1,d||0.5));
// a value in (0 to 1) that springs from t0
const mv_k=(t,t0)=>clamp((t-t0)/0.5,0,1.2);

/* ---------------------------------------------------------------- the map, composed for this film
   o.parts: which parts show, each 0 to 1 ({hr, fin, plat, bronze, tHR, tGL, fabric, partner, app}); o.ways: each way's draw-on and
   light ({connector: {u, a, lit, flow}}); o.lit: parts that glow; o.packet: Linh's contract on its way ({kind: "events" or "batch",
   u: 0 to 1, label}); o.contracts: gold contracts at interfaces ({hr: 0 to 1, fabric: 0 to 1}); o.landed (0 to 1, T-26188 in its table);
   o.a: the whole map's opacity (under a veil it is drawn at under half, so its words step back behind the cards on it) */
function mv_map(ctx,t,o){o=o||{};const A_=o.a==null?1:o.a;if(A_<=0.004)return;ctx.save();ctx.globalAlpha*=A_;mv_map0(ctx,t,o);ctx.restore();}
function mv_map0(ctx,t,o){const P_=o.parts||{},pa=k=>P_[k]==null?0:P_[k],lit=k=>(o.lit&&o.lit[k])||0;
  const [hx,hy,hw]=MV.hr,[fx,fy,fw]=MV.fin;
  withA(ctx,pa("hr"),()=>md_system(ctx,hx,hy,hw,"hr",{lit:lit("hr")}));
  withA(ctx,pa("fin"),()=>md_system(ctx,fx,fy,fw,"fin",{lit:lit("fin")}));
  if(pa("plat")>0){const [x,y,w,h]=MV.plat;withA(ctx,pa("plat"),()=>md_platform(ctx,x,y,w,h,{uc:true,ucText:"Unity Catalog",lit:lit("plat")}));}
  if(pa("bronze")>0){const [x,y,w,h]=MV.bronze;withA(ctx,pa("bronze"),()=>md_layer(ctx,x,y,w,h,"bronze",{cells:false,lit:lit("bronze")}));}
  if(pa("tHR")>0){const [x,y,w]=MV.tHR;withA(ctx,pa("tHR"),()=>md_table(ctx,x,y,w,{name:"hr_system.contracts",kind:"streaming table",lit:Math.max(lit("tHR"),o.landed||0)}));}
  if(pa("tGL")>0){const [x,y,w]=MV.tGL;withA(ctx,pa("tGL"),()=>md_table(ctx,x,y,w,{name:"finance.general_ledger",kind:"foreign table",ghost:true,lit:lit("tGL")}));}
  const R=[["fabric",{title:"Microsoft Fabric",sub:"Finance's own tools",logo:"fabric",col:MD.dom.finance}],["partner",{title:"A partner",sub:"Outside the university",icon:"share"}],["app",{title:"An app",sub:"Asks when it needs to",icon:"api"}]];
  for(const [k,r] of R)if(pa(k)>0){const [x,y,w]=MV[k];withA(ctx,pa(k),()=>md_reader(ctx,x,y,w,Object.assign({lit:lit(k)},r)));}
  // the ways: each a lane with its icon, and its name under it
  const W_=o.ways||{};for(const k of MV_ORDER){const q=W_[k];if(!q||!(q.a>0))continue;const d=MV_WAYS[k],pts=md_curve(d.a,d.b,{bend:0.55});
    md_way(ctx,k==="connector"?"connector":k,d.a,d.b,t,{pts,u:q.u==null?1:q.u,a:q.a,flow:q.flow!==false,icon:true,iconA:q.icon==null?ag_in(q.u==null?1:q.u,0.6,0.4):q.icon,col:d.col});
    if(q.lit>0){const m=at(mk(pts.map(p=>P(p[0],p[1]))),0.5);glow(ctx,m.x,m.y,90,d.col,0.4*q.lit*q.a);}
    const la=(q.label==null?ag_in(q.u==null?1:q.u,0.7,0.4):q.label)*q.a;if(la>0){const m=at(mk(pts.map(p=>P(p[0],p[1]))),0.5);d.label.forEach((s,i)=>md_T(ctx,s,m.x,m.y+76+i*34,{w:700,size:28,align:"center",col:d.col,a:la}));}}
  // Linh's contract on its way into the platform: one change, or the whole file
  if(o.packet&&o.packet.u>=0&&o.packet.u<=1){const pk=o.packet,d=MV_WAYS.connector,pts=md_curve(d.a,d.b,{bend:0.55}),q=at(mk(pts.map(p=>P(p[0],p[1]))),ag_sine(pk.u)),f=sstep(0,0.08,pk.u)*(1-sstep(0.92,1,pk.u));
    if(pk.kind==="batch"){glow(ctx,q.x,q.y,60,MD.flow,0.5*f);ctx.save();ctx.globalAlpha*=f;md_icon(ctx,"batch",q.x,q.y,52,MD.flow);ctx.restore();}
    else{glow(ctx,q.x,q.y,40,MD.flow,0.8*f);ctx.save();ctx.globalAlpha*=f;rr(ctx,q.x-13,q.y-13,26,26,6);ctx.fillStyle=rgba(mix(MD.flow,[255,255,255],0.55),1);ctx.fill();ctx.restore();}}
  // a contract agreed at an interface: a gold seal where the two meet
  const C_=o.contracts||{};for(const [k,pos] of [["hr",[486,305]],["fabric",[1440,255]]]){const a=C_[k]||0;if(a<=0.004)continue;ctx.save();ctx.globalAlpha*=ag_in(a,0,0.6);
    ag_about(ctx,pos[0],pos[1],lerp(0.6,1,ag_spr(a,0,0.5)));glow(ctx,pos[0],pos[1],70,MD.agreed,0.5);ctx.beginPath();ctx.arc(pos[0],pos[1],30,0,TAU);ctx.fillStyle="rgba(7,12,26,0.97)";ctx.fill();
    ctx.strokeStyle=rgba(MD.agreed,1);ctx.lineWidth=2.6;ctx.stroke();md_icon(ctx,"contract",pos[0],pos[1],34,MD.agreed);ctx.restore();}
}

// the whole map at once, every part and way in place (the wide shot of the five ways)
const MV_ALL={hr:1,fin:1,plat:1,bronze:1,tHR:1,tGL:1,fabric:1,partner:1,app:1};
const mv_allWays=(a,o)=>{o=o||{};const w={};MV_ORDER.forEach(k=>w[k]={u:1,a:(o[k]==null?a:o[k]),lit:o.lit&&o.lit[k]||0});return w;};

/* ---------------------------------------------------------------- the file that once went to Finance
   A file's columns, as Rohan's team met them each teaching period, a year before the connector, with a continuing appointment's row
   (T-18002, a Head of School's, in data/hr_system/contracts.csv): o.q (0 to 1, the question marks), o.agreed (0 to 1, the contract's
   gold, every column's meaning known), o.k, o.a. 720 wide, in the frame. */
function mv_columns(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=720,cols=[["contract_id","T-18002"],["staff_id","E-1093"],["pay_type","CON?"],["ends_on","?"]],rh=58,h=118+cols.length*rh+24;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));const ag_=o.agreed||0;
  md_card(ctx,x,y,w,h,{edge:ag_>0?MD.agreed:null,edgeA:0.9*ag_+0.1,glow:ag_});md_icon(ctx,"batch",x+46,y+56,40,MD.soft);
  md_T(ctx,"contracts_2025-S2.csv",x+86,y+66,{w:500,size:30,f:"mono"});md_T(ctx,"a file each teaching period",x+86,y+104,{w:500,size:28,col:MD.soft});
  cols.forEach(([c,v],i)=>{const yy=y+118+i*rh,q=o.q||0;ctx.strokeStyle="rgba(170,200,245,0.16)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+28,yy+6);ctx.lineTo(x+w-28,yy+6);ctx.stroke();
    md_T(ctx,c,x+40,yy+44,{w:500,size:28,f:"mono"});const unk=v.endsWith("?");
    if(unk){const qa=q*(1-ag_);md_T(ctx,"what does it mean?",x+w-40,yy+44,{w:700,size:28,align:"right",col:MD.wait,a:qa});
      md_T(ctx,c==="pay_type"?"CON: continuing":"the contract's last day",x+w-40,yy+44,{w:700,size:28,align:"right",col:MD.agreed,a:ag_});}
    else md_T(ctx,v,x+w-40,yy+44,{w:500,size:28,f:"mono",align:"right",col:MD.soft});});
  ctx.restore();}

/* ---------------------------------------------------------------- the module's promise
   The four things that used to take whole teams, each a card: o.n (0 to 4, how many have come in), o.teams (0 to 1, three people
   under each), o.easier (0 to 1, the people go and the card takes the platform's light). In the frame, y to y + 330. */
const MV_FOUR=[["connector","Moving data"],["refresh","Running a platform"],["eye","Serving data to people and agents"],["doc","Reading documents"]];
function mv_four(ctx,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const w=396,gap=28,x0=(1920-(4*w+3*gap))/2;ctx.save();ctx.globalAlpha*=a;
  MV_FOUR.forEach(([ic,s],i)=>{const k=clamp((o.n||0)-i,0,1);if(k<=0)return;const x=x0+i*(w+gap),e=o.easier||0;ctx.save();ctx.globalAlpha*=ag_in(k,0,0.5);ag_about(ctx,x+w/2,y+100,lerp(0.7,1,ag_spr(k,0,0.5)));
    md_card(ctx,x,y,w,200,{edge:e>0?MD.flow:null,edgeA:0.25+0.65*e,glow:e});md_icon(ctx,ic,x+52,y+62,44,mix(MD.soft,MD.flow,e));
    md_wrap(ctx,s,w-64,{w:800,size:32}).forEach((l,j)=>md_T(ctx,l,x+32,y+128+j*40,{w:800,size:32}));
    // a whole team: three people under the card, who leave as the tools take the work
    const tm=(o.teams||0)*(1-e);if(tm>0)for(let p=0;p<3;p++)md_icon(ctx,"person",x+w/2+(p-1)*64,y+262,46,MD.soft,{a:tm*ag_in(o.teams,p*0.15,0.4)});
    ctx.restore();});ctx.restore();}
// what each film shows: three tags, in a row, centred; o.n (0 to 3)
function mv_threeTags(ctx,y,n){const T3=[["What got easier",MD.flow,"refresh"],["What still needs people to agree",MD.agreed,"contract"],["Where the official docs take you next",MD.soft,"doc"]];
  const ws=T3.map(([s,,ic])=>md_tag(ctx,0,0,s,{a:0,icon:ic}).w),gap=24,tot=ws.reduce((p,q)=>p+q,0)+gap*2;let x=(1920-tot)/2;
  T3.forEach(([s,c,ic],i)=>{const k=clamp(n-i,0,1);if(k>0)md_tag(ctx,x,y,s,{col:c,icon:ic,a:ag_in(k,0,0.5)});x+=ws[i]+gap;});}

// Databricks and dbt, side by side and centred, their names beside their marks, the baseline at y: a (Databricks), b (dbt)
function mv_logos(ctx,y,a,b){const f={w:800,size:34},L=[["databricks","Databricks",a],["dbt","dbt",b]],ws=L.map(([k,n])=>44*(LOGO[k]?LOGO[k].width/LOGO[k].height:1)+16+md_tw(ctx,n,f));
  let x=960-(ws[0]+80+ws[1])/2;L.forEach(([k,n,al],i)=>{if(al>0.004){ctx.save();ctx.globalAlpha*=al;const lw=logo(ctx,k,x,y-34,44);md_T(ctx,n,x+lw+16,y,f);ctx.restore();}x+=ws[i]+80;});}

// Linh's contract, as a card: o.k, o.a
function mv_contractT(ctx,x,y,o){o=o||{};return md_textCard(ctx,x,y,560,{kick:"Contract",title:"T-26188",sub:"HI101 · 20 July to 20 November 2026"},{mono:true,icon:"contract",edge:MD.sys.hr,a:o.a,k:o.k});}

/* ---------------------------------------------------------------- a tool's page, for this film
   Lakeflow Connect's managed connector, as Sam set it up: what it reads, and what it does on its own. o.rows (0 to 2: the source and
   its tables), o.does (0 to 3: what it does), o.k, o.a. 1040 x 560, in the frame. */
function mv_connectorPage(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;
  md_window(ctx,x,y,1040,560,{logo:"databricks",product:"Lakeflow Connect",title:"Managed connector",a,k:o.k,draw:(c,b)=>{
    const R2=[["Source","HR system","store",MD.sys.hr,null],["Tables","staff, contracts","table",MD.flow,"mono"]];
    R2.forEach(([h,v,ic,col,f],i)=>{const k=clamp((o.rows||0)-i,0,1);if(k<=0)return;const yy=b.y+16+i*86;c.save();c.globalAlpha*=ag_in(k,0,0.5);
      md_T(c,h.toUpperCase(),b.x+20,yy+44,{w:800,size:28,ls:3,col:MD.soft});md_icon(c,ic,b.x+250,yy+34,36,col);md_T(c,v,b.x+292,yy+44,{w:f?500:700,size:30,f:f||undefined});c.restore();});
    const D=[["refresh","Reads only what changed"],["refresh","Tries again when a read fails"],["tick","Keeps its place"]];
    D.forEach(([ic,s],i)=>{const k=clamp((o.does||0)-i,0,1);if(k<=0)return;const yy=b.y+214+i*76;c.save();c.globalAlpha*=ag_in(k,0,0.5);md_card(c,b.x+12,yy,b.w-24,62,{edge:MD.flow,edgeA:0.5,glow:0.3,r:14});
      md_icon(c,ic,b.x+52,yy+31,32,MD.flow);md_T(c,s,b.x+92,yy+41,{w:700,size:30});c.restore();});}});}

/* Microsoft Fabric, with the university's catalog mirrored into it: the HR system's contracts appear, and are read where they live.
   o.n (0 to 3, the tree's rows; 4 to 5, the tag), o.k, o.a. 760 x 400, in the frame. */
function mv_fabricPage(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;
  md_window(ctx,x,y,760,400,{logo:"fabric",product:"Microsoft Fabric",title:"Mirrored catalog",a,k:o.k,edge:MD.dom.finance,draw:(c,b)=>{
    const items=[{name:"university",kind:"catalog"},{name:"hr_system",kind:"schema",depth:1},{name:"contracts",kind:"mirrored table",depth:2}];
    items.forEach((it,i)=>it.a=ag_in(o.n||0,i,0.5));md_tree(c,b.x+18,b.y+10,items,{rh:58});
    const k=clamp((o.n||0)-4,0,1);if(k>0)md_tag(c,b.x+18,b.y+236,"read where it lives · nothing copied",{col:MD.flow,icon:"mirror",a:ag_in(k,0,0.5)});}});}

/* ---------------------------------------------------------------- the contract at the HR system's interface
   A card in the frame, x 96 to 1824, y 150 to 840, its edge in the gold of what people agree on. On the left, its four parts, each
   lit while it's the one being agreed and ticked once it is: o.part (0 to 4; 1.4 is the first agreed, the second coming in). On the
   right, the part being agreed: drawn by mv_contractPart. Its fill is a little more solid than the kit's card, so the map's words don't
   show through so large a card. o.a, o.k. */
const MV_PARTS=["What each field means","Who answers for it","What a deletion means","What's personal"];
function mv_contractCard(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const x=96,y=150,w=1728,h=690;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.8,1,ag_spr(o.k,0,0.5)));md_card(ctx,x,y,w,h,{edge:MD.agreed,glow:0.5,r:22,fill:"rgba(11,19,38,0.985)"});
  md_icon(ctx,"contract",x+56,y+58,42,MD.agreed);md_T(ctx,"The HR system's contract",x+96,y+70,{w:800,size:36});md_T(ctx,"hr_system.contracts",x+w-40,y+70,{w:500,size:30,f:"mono",align:"right",col:MD.soft});
  ctx.strokeStyle="rgba(255,209,102,0.25)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x+32,y+112);ctx.lineTo(x+w-32,y+112);ctx.stroke();ctx.beginPath();ctx.moveTo(x+560,y+136);ctx.lineTo(x+560,y+h-36);ctx.stroke();
  const p=o.part||0;MV_PARTS.forEach((s,i)=>{const yy=y+190+i*118,on=clamp(p-i,0,1),cur=on>0&&p<i+1.5,done=ag_in(p,i+1,0.4);const col=on>0?MD.agreed:MD.dim;
    ctx.save();ctx.globalAlpha*=0.45+0.55*Math.max(on,done);if(cur&&on>0)glow(ctx,x+60,yy-10,70,MD.agreed,0.35*on);
    ctx.beginPath();ctx.arc(x+60,yy-10,22,0,TAU);ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.4;ctx.stroke();
    if(done>0)md_icon(ctx,"tick",x+60,yy-10,26,MD.agreed,{a:done});else md_T(ctx,String(i+1),x+60,yy,{w:800,size:28,align:"center",col});
    md_wrap(ctx,s,440,{w:700,size:30}).forEach((l,j)=>md_T(ctx,l,x+100,yy+j*38,{w:700,size:30,col:on>0?MD.ink:MD.soft}));ctx.restore();});
  if(o.draw){ctx.save();o.draw(ctx,{x:x+600,y:y+140,w:w-640,h:h-170});ctx.restore();}
  ctx.restore();}

// part 1: pay_type's three values. o.rows (0 to 3), o.con (0 to 1: CON is continuing, not contract), o.wrong (0 to 1: read wrong)
function mv_partMeaning(ctx,b,o){md_T(ctx,"pay_type",b.x,b.y+40,{w:500,size:34,f:"mono"});md_T(ctx,"the pay type payroll pays a contract under",b.x+200,b.y+40,{w:500,size:28,col:MD.soft});
  const rows=[["CAS","casual"],["FT","fixed-term"],["CON","continuing"]];
  md_rows(ctx,b.x,b.y+70,[{h:"Value",w:200,f:"mono"},{h:"Means",w:520}],rows.map(([v,m])=>[{s:v,f:"mono"},m]),{rowA:(r,i)=>ag_in(o.rows||0,i,0.5),lit:o.con>0.5?[2]:[],litCol:MD.agreed});
  const c=o.con||0;if(c>0){ctx.save();ctx.globalAlpha*=ag_in(c,0,0.5);const yy=b.y+70+54*3+20;md_T(ctx,"not",b.x+760,yy+10,{w:700,size:30,col:MD.fail});
    md_T(ctx,"contract",b.x+830,yy+10,{w:700,size:30,col:MD.fail});const sw=md_tw(ctx,"contract",{w:700,size:30});ctx.strokeStyle=rgba(MD.fail,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(b.x+826,yy);ctx.lineTo(b.x+834+sw,yy);ctx.stroke();ctx.restore();}
  const wr=o.wrong||0;if(wr>0)md_textCard(ctx,b.x,b.y+370,860,{kick:"Read it wrong",title:"Finance counts continuing staff as casual"},{edge:MD.fail,icon:"warn",a:ag_in(wr,0,0.5),k:wr});}
// part 2: who answers for it. o.k
function mv_partOwner(ctx,b,o){const k=o.k||0;if(k<=0)return;ctx.save();ctx.globalAlpha*=ag_in(k,0,0.5);
  md_card(ctx,b.x,b.y+20,620,170,{edge:MD.sys.hr,glow:0.5});md_icon(ctx,"person",b.x+60,b.y+105,48,MD.sys.hr);md_T(ctx,"Ingrid Holm",b.x+110,b.y+96,{w:800,size:40});
  md_T(ctx,"HR · owns the HR system's data",b.x+110,b.y+144,{w:500,size:28,col:MD.soft});
  md_T(ctx,"answers for what every field means, by name",b.x,b.y+250,{w:600,size:30,col:MD.ink,a:ag_in(k,0.6,0.5)});ctx.restore();}
// part 3: what a deletion means. o.cancel (0 to 1), o.arrive (0 to 1), o.never (0 to 1), o.history (0 to 1)
function mv_partDelete(ctx,b,o){const L=(i,ic,col,s,sub,a)=>{if(a<=0.004)return;const yy=b.y+20+i*136;ctx.save();ctx.globalAlpha*=ag_in(a,0,0.5);md_card(ctx,b.x,yy,b.w-20,112,{edge:col,glow:0.4,edgeA:0.7,r:16});
    md_icon(ctx,ic,b.x+52,yy+56,40,col);md_T(ctx,s,b.x+96,sub?yy+50:yy+66,{w:700,size:32});if(sub)md_T(ctx,sub,b.x+96,yy+88,{w:500,size:28,col:MD.soft});ctx.restore();};
  L(0,"cross",MD.dim,"A contract is cancelled: HR deletes it","",o.cancel||0);
  L(1,"tick",MD.pass,"It arrives as a change, with its time","a deletion the platform can read",o.arrive||0);
  L(2,"cross",MD.fail,"Never just a row missing from the next file","",o.never||0);
  L(3,"refresh",MD.flow,"The platform closes it, and keeps its history","_valid_to set, _is_current false",o.history||0);}
// part 4: what's personal. o.marked (0 to 1), o.stays (0 to 1)
function mv_partPersonal(ctx,b,o){const L=(i,s,sub,a)=>{if(a<=0.004)return;const yy=b.y+40+i*190;ctx.save();ctx.globalAlpha*=ag_in(a,0,0.5);md_card(ctx,b.x,yy,b.w-20,150,{edge:MD.personal,glow:0.5,r:16});
    md_icon(ctx,"lock",b.x+58,yy+75,44,MD.personal);md_T(ctx,s,b.x+108,yy+66,{w:700,size:32});md_T(ctx,sub,b.x+108,yy+108,{w:500,size:28,col:MD.personal});ctx.restore();};
  L(0,"Names, birth dates, emails","come across, marked personal",o.marked||0);L(1,"Bank details, rates of pay","never leave HR",o.stays||0);}

/* the contract written down, and Jun's tests: the open standard's file and dbt's test on pay_type. o.n (0 to 2), o.pass (0 to 1),
   o.a, o.k. 1100 x 560, in the frame. */
function mv_testPage(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;
  md_window(ctx,x,y,1100,560,{logo:"dbt",product:"dbt",title:"tests on stg_hr_system__contracts",a,k:o.k,draw:(c,b)=>{
    // the contract they check (examples/hr-system-interface/hr_system.yaml), then the test on pay_type as the project writes it
    // (models/staging/hr_system/_hr_system__models.yml)
    md_tag(c,b.x+10,b.y+34,"the HR system's contract: hr_system.yaml",{col:MD.agreed,icon:"contract",a:ag_in(o.n||0,0,0.5)});
    const Y=["- name: pay_type","  data_tests:","    - accepted_values:","        arguments:","          values: [CAS, FT, CON]"];
    Y.forEach((l,i)=>md_T(c,l,b.x+20,b.y+122+i*44,{w:500,size:30,f:"mono",col:i===4?MD.ink:MD.soft,a:ag_in(o.n||0,1+i*0.15,0.5)}));
    if(o.pass>0)md_pill(c,b.x+b.w-230,b.y+b.h-60,"every row passes",{col:MD.pass,icon:"tick",a:ag_in(o.pass,0,0.4),k:o.pass});}});}

/* ---------------------------------------------------------------- the close
   The module's wheel and the four steps around it: o.p (0 to 1, the wheel draws itself), o.n (0 to 4, the steps), o.docs (0 to 1) */
function mv_wheel(ctx,cx,cy,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;md_mark(ctx,cx,cy,96,o.p||0,1);
  const S4=[["Investigate",-1,-1],["Adapt",1,-1],["Implement",1,1],["Iterate",-1,1]];
  S4.forEach(([s,dx,dy],i)=>{const k=clamp((o.n||0)-i,0,1);if(k<=0)return;md_T(ctx,s,cx+dx*190,cy+dy*96+12,{w:800,size:40,align:dx<0?"right":"left",a:ag_in(k,0,0.5)});});
  if(o.docs>0)md_tag(ctx,cx,cy+230,"starting from the official docs",{col:MD.flow,icon:"doc",align:"center",a:ag_in(o.docs,0,0.5)});ctx.restore();}

// a statement on its own, over a veil, in the frame: two lines, centred; o.c2 the second line's colour
function mv_statement(ctx,S,a,l1,l2,o){o=o||{};if(a<=0.004)return;md_veil(ctx,S,0.72*a);setScreen(ctx,S);ctx.save();ctx.globalAlpha*=a;
  md_T(ctx,l1,960,o.y||470,{w:800,size:o.size||52,align:"center"});if(l2)md_T(ctx,l2,960,(o.y||470)+(o.size||52)*1.45,{w:800,size:o.size||52,align:"center",col:o.c2||MD.agreed,a:o.a2==null?1:o.a2});ctx.restore();}
// the film's kicker, at the top left of the frame
function mv_kicker(ctx,S,a){mv_scr(ctx,S,()=>md_kicker(ctx,"1","Moving is easy, agreeing is the work",{a}));}
