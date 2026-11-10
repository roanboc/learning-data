/* ===== Modern data basics: the platform map's parts, drawn near =====
   The intro's map (The Inner Life of Data, chapter "The layers together") shows the university's systems on the left, the platform's
   layers in the middle with Databricks under them, and who reads the result on the right. This module works inside that map, so its
   parts are drawn here at the size a film needs, with words of 28 px or more as seen, in the colours the intro gives them.
     md_system(ctx, x, y, w, key, o)  an application, a system of record: key in MD_SYS ("hr", "fin", "sis", "lms") or {n, s, c};
                                      o.sub (the line under its name), o.h (110), o.lit (0 to 1, it glows), o.a; returns its box and
                                      its port, where a lane leaves it ({x, y, w, h, port: [x, y]})
     md_platform(ctx, x, y, w, h, o)  the platform: a large pane with Databricks' mark and name at the top left (o.logos false: the
                                      name only), o.title ("Databricks"), o.sub, o.uc (true: the Unity Catalog bar along its foot,
                                      "Unity Catalog · one place to find and govern it all" or o.ucText), o.lit, o.a; returns its inside
     md_layer(ctx, x, y, w, h, key, o) a layer of the medallion, as the intro's vaults: key "bronze", "silver" or "gold", o.sub (what it
                                      does: "keeps what arrived"), o.lit, o.a, o.cells (false: no cells)
     md_table(ctx, x, y, w, o)        a table, or something like one: o.name (in IBM Plex Mono), o.kind ("table", "streaming table",
                                      "materialized view", "view", "foreign table", "metric view", "volume", or your own words), o.icon
                                      (an md_icon kind; by default the kind's), o.col (its colour: MD.flow), o.ghost (true: drawn dashed,
                                      for what is shown here but lives elsewhere: a foreign table read in place, a mirrored one), o.lit,
                                      o.a, o.k; returns its box and ports {x, y, w, h, l: [x, y], r: [x, y]}
     md_store(ctx, x, y, s, col, o)   a store of data, drawn as the intro's database glyph, s px tall
     md_reader(ctx, x, y, w, o)       who reads it: o.title, o.sub, o.logo (a logo's key: "fabric", "powerbi", "databricks", "dbt"),
                                      o.icon (an md_icon kind when there is no logo), o.col, o.lit, o.a; returns its box and its port (left)
     md_way(ctx, kind, a, b, t, o)    one of the ways data moves, from point a to point b: "connector" (a managed connector: a lane
                                      that brings copies in, with its packets), "events" (each change as it's made), "batch" (a whole
                                      file now and then), "query" (a query in place, federation: a dashed lane, a question out and the
                                      answer back, nothing kept), "mirror" (the catalog shown in another tool: a dashed lane, nothing
                                      copied), "share" (shared with a partner where it lives: a dashed lane), "api" (served on request: a
                                      request out, an answer back); o.col, o.u (how far it's drawn, 0 to 1), o.icon (true: its icon in
                                      the middle, with o.label under it), o.a, o.bend
     md_map(ctx, t, o)                the whole map at once, at the frame's size (z 1): the systems, the platform with its three
                                      layers, and its readers, with the lanes between them; o.a, o.lit (a part's key: "hr", "fin",
                                      "bronze", "fabric", ... it glows), o.dim (keys drawn faint), o.flow (false: no packets), o.parts
                                      (the keys to draw; all by default). MD_MAP holds where each part is, for a film that draws its
                                      own over it or sends the camera there */

const MD_SYS={hr:{n:"HR system",s:"Staff and contracts",c:MD.sys.hr},fin:{n:"Finance system",s:"The general ledger",c:MD.sys.fin},
  sis:{n:"Student system",s:"Students' records",c:MD.sys.sis},lms:{n:"Learning platform",s:"Classes and work",c:MD.sys.lms}};
function md_system(ctx,x,y,w,key,o){o=o||{};const S_=typeof key==="string"?MD_SYS[key]:key,c=S_.c,h=o.h||110,a=o.a==null?1:o.a,lit=o.lit||0,box={x,y,w,h,port:[x+w,y+h/2]};if(a<=0.004)return box;
  ctx.save();ctx.globalAlpha*=a;if(lit>0)glow(ctx,x+w/2,y+h/2,w*0.75,c,0.35*lit);md_card(ctx,x,y,w,h,{edge:c,glow:0.6+0.8*lit,edgeA:0.6+0.4*lit});led(ctx,x+14,y+18,6,h-36,c);
  md_T(ctx,S_.n,x+40,y+(o.sub===false?h/2+11:h/2-6),{w:800,size:32});if(o.sub!==false)md_T(ctx,o.sub||S_.s,x+40,y+h/2+32,{w:500,size:28,col:MD.soft});
  md_icon(ctx,"store",x+w-46,y+h/2,40,c);ctx.restore();return box;}
function md_platform(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,lit=o.lit||0,inner={x:x+24,y:y+96,w:w-48,h:h-96-(o.uc?110:24)};if(a<=0.004)return inner;ctx.save();ctx.globalAlpha*=a;
  md_card(ctx,x,y,w,h,{edge:MD.dbx,glow:0.5+0.8*lit,edgeA:0.55+0.35*lit,r:24,fill:"rgba(9,15,31,0.9)"});let tx=x+30;
  if(o.logos!==false&&typeof LOGO!=="undefined"&&LOGO.databricks){tx+=logo(ctx,"databricks",x+28,y+26,44)+16;}
  md_T(ctx,o.title||"Databricks",tx,y+62,{w:800,size:36});if(o.sub)md_T(ctx,o.sub,tx+md_tw(ctx,o.title||"Databricks",{w:800,size:36})+22,y+62,{w:500,size:28,col:MD.soft});
  if(o.uc){const by=y+h-96;md_card(ctx,x+24,by,w-48,72,{edge:MD.flow,glow:0.5,r:14,fill:"rgba(7,12,26,0.95)"});md_icon(ctx,"table",x+66,by+36,36,MD.flow);
    md_T(ctx,o.ucText||"Unity Catalog · one place to find and govern it all",x+100,by+46,{w:700,size:28});}
  ctx.restore();return inner;}
function md_layer(ctx,x,y,w,h,key,o){o=o||{};const a=o.a==null?1:o.a,c=MD.layer[key]||key,lit=o.lit||0;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  if(lit>0)glow(ctx,x+w/2,y+h/2,Math.max(w,h)*0.7,c,0.3*lit);md_card(ctx,x,y,w,h,{edge:c,glow:0.6+0.8*lit,r:20});led(ctx,x+24,y+14,w-48,4,c);
  const nm=o.name||key[0].toUpperCase()+key.slice(1);md_T(ctx,nm,x+w/2,y+66,{w:800,size:32,align:"center"});
  if(o.cells!==false){const cs=18,gap=8,top=y+96,bot=y+h-(o.sub?36+34*md_wrap(ctx,o.sub,w-28,{w:600,size:28}).length:24),cols=Math.max(1,Math.floor((w-48)/(cs+gap))),rows=Math.max(0,Math.floor((bot-top)/(cs+gap))),ox=x+(w-(cols*(cs+gap)-gap))/2;
    for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){const v=hash(r*37+q,key.length*3+1);ctx.fillStyle=v>0.78?"rgba(150,180,230,0.10)":rgba(c,0.22+0.5*v);rr(ctx,ox+q*(cs+gap),top+r*(cs+gap),cs,cs,4);ctx.fill();}}
  // what the layer does, under its cells, in as many lines as its width needs
  if(o.sub){const ls=md_wrap(ctx,o.sub,w-28,{w:600,size:28});ls.forEach((l,i)=>md_T(ctx,l,x+w/2,y+h-26-(ls.length-1-i)*34,{w:600,size:28,align:"center",col:MD.soft}));}ctx.restore();}
const MD_KIND_ICON={"table":"table","streaming table":"stream","materialized view":"refresh","view":"view","foreign table":"query","metric view":"agreed","volume":"volume","mirrored table":"mirror"};
function md_table(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||MD.flow,h=o.kind?104:72,lit=o.lit||0,box={x,y,w,h,l:[x,y+h/2],r:[x+w,y+h/2]};if(a<=0.004)return box;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));if(lit>0)glow(ctx,x+w/2,y+h/2,w*0.6,col,0.3*lit);
  md_card(ctx,x,y,w,h,{edge:col,glow:0.5+0.8*lit,dash:o.ghost?[10,9]:false,r:14});const ic=o.icon||MD_KIND_ICON[o.kind]||"table";
  if(ic==="agreed")md_icon(ctx,"contract",x+38,y+h/2,36,col);else md_icon(ctx,ic,x+38,y+h/2,36,col);
  md_T(ctx,o.name||"",x+72,y+(o.kind?46:h/2+10),{w:500,size:28,f:"mono"});if(o.kind)md_T(ctx,o.kind,x+72,y+84,{w:600,size:28,col:o.ghost?col:MD.soft});ctx.restore();return box;}
function md_store(ctx,x,y,s,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=s*0.25;md_icon(ctx,"store",x,y,s*1.2,col,{lw:3.2});ctx.restore();}
function md_reader(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,col=o.col||MD.ink,h=o.h||(o.sub?110:84),lit=o.lit||0,box={x,y,w,h,port:[x,y+h/2]};if(a<=0.004)return box;ctx.save();ctx.globalAlpha*=a;
  if(lit>0)glow(ctx,x+w/2,y+h/2,w*0.7,col,0.3*lit);md_card(ctx,x,y,w,h,{edge:o.col||null,glow:0.5+0.8*lit});let tx=x+26;
  if(o.logo&&typeof LOGO!=="undefined"&&LOGO[o.logo]){tx+=logo(ctx,o.logo,x+24,y+h/2-24,48)+18;}else if(o.icon){md_icon(ctx,o.icon,x+48,y+h/2,40,col);tx=x+88;}
  md_T(ctx,o.title||"",tx,y+(o.sub?h/2-6:h/2+11),{w:800,size:32});if(o.sub)md_T(ctx,o.sub,tx,y+h/2+32,{w:500,size:28,col:MD.soft});ctx.restore();return box;}

/* ---------------------------------------------------------------- the ways data moves */
const MD_WAY={connector:{icon:"connector",flow:"events",dash:false},events:{icon:"event",flow:"events",dash:false},batch:{icon:"batch",flow:"batch",dash:false},
  stream:{icon:"stream",flow:"stream",dash:false},query:{icon:"query",flow:null,dash:true},mirror:{icon:"mirror",flow:null,dash:true},share:{icon:"share",flow:null,dash:true},api:{icon:"api",flow:null,dash:false}};
function md_way(ctx,kind,a,b,t,o){o=o||{};const al=o.a==null?1:o.a;if(al<=0.004)return;const K=MD_WAY[kind]||MD_WAY.connector,col=o.col||MD.flow,pts=o.pts||md_curve(a,b,{bend:o.bend}),u=o.u==null?1:o.u;
  md_lane(ctx,pts,col,al*(K.dash?0.9:0.85),{u,dash:K.dash,t});
  if(u>=1&&o.flow!==false){if(K.flow)md_flow(ctx,pts,t,{kind:K.flow,col,a:al,every:o.every});
    // a query in place and a request: a question goes out and the answer comes back along the same lane; nothing stays
    else if(kind==="query"||kind==="api"){const p=mk(pts.map(q=>P(q[0],q[1])));spawn(t,3.2,2.6,0,(v)=>{const go=v<0.5,q=at(p,go?ease(v*2):1-ease((v-0.5)*2)),f=sstep(0,0.08,v)*(1-sstep(0.92,1,v))*al;
        glow(ctx,q.x,q.y,go?18:30,go?MD.ink:col,0.8*f);if(!go){ctx.save();ctx.globalAlpha*=f;rr(ctx,q.x-12,q.y-9,24,18,4);ctx.fillStyle=rgba(mix(col,[255,255,255],0.4),1);ctx.fill();ctx.restore();}});}}
  if(o.icon){const q=at(mk(pts.map(p=>P(p[0],p[1]))),0.5),ia=o.iconA==null?1:o.iconA;ctx.save();ctx.globalAlpha*=al*ia;
    ctx.beginPath();ctx.arc(q.x,q.y,34,0,TAU);ctx.fillStyle="rgba(7,12,26,0.96)";ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=18;ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.4;ctx.stroke();
    md_icon(ctx,K.icon,q.x,q.y,38,col);if(o.label)md_T(ctx,o.label,q.x,q.y+(o.labelBelow==null?78:o.labelBelow),{w:700,size:28,align:"center",col});ctx.restore();}}

/* ---------------------------------------------------------------- the whole map */
const MD_MAP={
  heads:{sys:[70,176,"Where data is born"],plat:[560,176,"The platform"],read:[1440,176,"Who reads it"]},
  hr:[70,214,410],fin:[70,364,410],sis:[70,514,410],lms:[70,664,410],
  platform:[560,214,820,600],bronze:[594,330,236,300],silver:[852,330,236,300],gold:[1110,330,236,300],
  fabric:[1440,214,420,"Microsoft Fabric","Power BI, Finance","fabric"],genie:[1440,364,420,"Genie","Questions in plain words","databricks"],
  dash:[1440,514,420,"Dashboards","For every pay day","databricks"],apps:[1440,664,420,"Apps and agents","The claims app, others","databricks"]
};
function md_map(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const M_=MD_MAP,has=k=>!o.parts||o.parts.includes(k),dim=k=>o.dim&&o.dim.includes(k)?0.3:1,lit=k=>o.lit===k||(Array.isArray(o.lit)&&o.lit.includes(k))?1:0;
  ctx.save();ctx.globalAlpha*=a;
  for(const [k,[x,y,s]] of Object.entries(M_.heads))if(has("heads"))md_label(ctx,x,y,s,{});
  const ports={};for(const k of["hr","fin","sis","lms"])if(has(k)){const [x,y,w]=M_[k];withA(ctx,dim(k),()=>{ports[k]=md_system(ctx,x,y,w,k,{lit:lit(k)}).port;});}
  if(has("platform")){const [x,y,w,h]=M_.platform;withA(ctx,dim("platform"),()=>md_platform(ctx,x,y,w,h,{uc:true,lit:lit("platform")}));}
  const L=[["bronze","keeps what arrived"],["silver","makes it consistent"],["gold","makes it useful"]];
  for(const [k,sub] of L)if(has(k)){const [x,y,w,h]=M_[k];withA(ctx,dim(k),()=>md_layer(ctx,x,y,w,h,k,{sub,lit:lit(k)}));}
  // lanes: each system into bronze, bronze to silver to gold, gold out to each reader
  const B=M_.bronze,G=M_.gold,flow=o.flow!==false;
  for(const k of["hr","fin","sis","lms"])if(ports[k]&&has("bronze")){const c=MD.sys[k];withA(ctx,dim(k),()=>{const pts=md_curve(ports[k],[B[0],B[1]+B[3]/2],{bend:0.55});md_lane(ctx,pts,c,0.8);if(flow)md_flow(ctx,pts,t,{col:c,off:k.length*0.3,every:1.3});});}
  if(has("silver")&&has("bronze")){const pts=[[B[0]+B[2],B[1]+B[3]/2],[M_.silver[0],B[1]+B[3]/2]];md_lane(ctx,pts,MD.flow,0.8);if(flow)md_flow(ctx,pts,t,{off:0.2,dur:0.6,every:0.9});}
  if(has("gold")&&has("silver")){const S_=M_.silver,pts=[[S_[0]+S_[2],B[1]+B[3]/2],[G[0],B[1]+B[3]/2]];md_lane(ctx,pts,MD.flow,0.8);if(flow)md_flow(ctx,pts,t,{off:0.5,dur:0.6,every:0.9});}
  for(const k of["fabric","genie","dash","apps"])if(has(k)){const [x,y,w,title,sub,lg]=M_[k];withA(ctx,dim(k),()=>{const r=md_reader(ctx,x,y,w,{title,sub,logo:lg,col:k==="fabric"?MD.dom.finance:null,lit:lit(k)});
      // Fabric reads through a mirror: the catalog is shown there and the data read where it lives, so its lane is dashed and carries nothing
      if(has("gold")){const pts=md_curve([G[0]+G[2],G[1]+G[3]/2],r.port,{bend:0.6}),mir=k==="fabric";md_lane(ctx,pts,MD.layer.gold,0.75,{dash:mir,t});if(flow&&!mir)md_flow(ctx,pts,t,{col:MD.layer.gold,off:k.length*0.25,every:1.6});}});}
  ctx.restore();}
