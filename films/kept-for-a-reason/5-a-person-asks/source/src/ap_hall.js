/* ===== A person asks: the university, in the module's hall =====
   Four corners of the hall, each painted once with the kit's dp_paintHall, and the hall itself (the kit's "hall"):
     apDesk      Linh's corner: a desk of dark glass across the front, which hides her hands (o.cut)
     apOffice    the privacy office's corner, where Ingrid and Mei stand and the table of keys is kept
     apRepo      the data team's corner: the repository's issue, and dbt's terminal
     apPlatform  the platform: its lineage, the search, the list's tables and their versions
   And what is shown in them, on glass, in the module's colours: cyan an identity (Linh's sign-in, a job's badge, who may read),
   green allowed or done, coral denied or closed, violet hidden personal data (the table of keys, a class on a column, the marts where
   she's only a code), grey what needs no protection. A request's clock is a ring of thirty marks in the glass's own ice light. Tools
   are their pages (pages.js), with their logos and full names; code is the example project's, word for word. */
const AP_ICE=[190,245,245];
AG_PLACES.apDesk=c=>dp_paintHall(c,{seed:41,horizon:700,vx:1320,pools:[[430,980,520,0.13],[1380,820,620,0.06]],after:c=>{
  // the desk: a slab of dark glass with a lit edge, and its frosted front, across the whole front of the corner
  const y=AP_DESK;c.fillStyle="rgb(10,26,30)";c.fillRect(60,y,1280,H-y);const g=c.createLinearGradient(0,y,0,H);g.addColorStop(0,"rgba(120,200,210,0.16)");g.addColorStop(1,"rgba(120,200,210,0.03)");c.fillStyle=g;c.fillRect(60,y,1280,H-y);
  c.fillStyle=rgba(AP_ICE,0.75);c.fillRect(60,y,1280,2.5);c.fillStyle=rgba(AP_ICE,0.25);c.fillRect(60,y,2,H-y);c.fillRect(1338,y,2,H-y);}});
const AP_DESK=838;
AG_PLACES.apOffice=c=>dp_paintHall(c,{seed:43,horizon:700,vx:960,pools:[[330,980,480,0.12],[1520,980,520,0.12]]});
AG_PLACES.apRepo=c=>dp_paintHall(c,{seed:47,horizon:690,vx:1120,pools:[[330,980,480,0.12],[1200,820,700,0.06]]});
AG_PLACES.apPlatform=c=>dp_paintHall(c,{seed:53,horizon:720,vx:960,panes:7,pools:[[960,900,900,0.07]]});

/* ---------------------------------------------------------------- small things */
// a card of glass with a kicker and words written out as they're said (u 0 to 1), wrapped once from the whole text so no line moves
function ap_typed(c,x,y,w,kick,text,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const inner=w-60,size=o.size||30,lh=size+12,lines=ag_wrap(c,text,inner,{w:600,size});
  const h=30+(kick?44:0)+lines.length*lh+24;c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.6,1,o.k));dp_panel(c,x,y,w,h,{col:o.col||"cyan",r:20,glowR:36});
  if(kick)dp_T(c,String(kick).toUpperCase(),x+30,y+52,{w:800,size:28,ls:4,col:o.col||"cyan"});
  let n=Math.round(clamp(u,0,1)*text.length);lines.forEach((l,i)=>{if(n<=0)return;const s=l.slice(0,n);n-=l.length+1;dp_T(c,s,x+30,y+30+(kick?44:0)+size+i*lh,{w:600,size});});
  c.restore();return{x,y,w,h};}
// a ring of n marks: a clock for a request, one mark a day; u draws the marks on, left counts the ones still lit (the rest dim)
function ap_clock(c,cx,cy,r,n,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||u<=0)return;const left=o.left==null?n:o.left;c.save();c.globalAlpha*=a;
  dp_halo(c,cx,cy,r*1.5,AP_ICE,0.08);c.save();c.globalAlpha*=clamp(u*3,0,1);c.strokeStyle=rgba(AP_ICE,0.16);c.lineWidth=2;c.beginPath();c.arc(cx,cy,r,0,TAU);c.stroke();c.restore();for(let i=0;i<n;i++){const q=clamp(u*n-i,0,1);if(q<=0)break;const an=-Math.PI/2+i/n*TAU,on=i>=n-left,len=r*0.16;
    c.save();c.translate(cx+Math.cos(an)*r,cy+Math.sin(an)*r);c.rotate(an);c.globalAlpha*=q;if(on){c.shadowColor=rgba(AP_ICE,0.9);c.shadowBlur=10;}
    c.fillStyle=on?rgba(AP_ICE,1):"rgba(150,190,192,0.32)";rr(c,-len/2,-4,len,8,4);c.fill();c.restore();}
  if(o.label)dp_T(c,o.label,cx,cy+(o.sub?-2:13),{w:800,size:o.size||40,align:"center"});if(o.sub)dp_T(c,o.sub,cx,cy+40,{w:600,size:28,align:"center",col:"mut"});c.restore();}
// a chip on a link: a small panel with words in ink, as a link in the ticket shows its proof; returns its width
function ap_link(c,x,y,text,o){o=o||{};const a=o.a==null?1:o.a,w=dp_tw(c,text,{w:600,size:28})+36;if(a<=0)return w;c.save();c.globalAlpha*=a;
  dp_panel(c,x,y-36,w,50,{col:o.col||"cyan",r:12,glowR:18,glowA:0.6});dp_T(c,text,x+18,y-1,{w:600,size:28,col:o.ink||"ink"});c.restore();return w;}
// a box to tick: empty, then ticked (p)
function ap_box(c,x,y,p){c.save();c.strokeStyle=rgba(DP.T.mut,0.9);c.lineWidth=2.4;rr(c,x,y-26,30,30,7);c.stroke();c.restore();if(p>0)dp_tick(c,x+15,y-11,"green",p);}
// a frosted bar standing for a value that may not be read: a row's personal data
function ap_bar(c,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;dp_frost(c,x,y-26,w,34,cc=>{cc.fillStyle="rgba(230,226,255,0.9)";cc.fillRect(x+12,y-16,w*0.7,12);},{col:o.col||"violet",r:8,a});}
// a laptop on the desk, seen from her side and a little in front: the screen faces Linh, a sliver of it lit towards us, and its light falls on her
function ap_laptop(c,x,y,o){o=o||{};const g=o.glow==null?1:o.glow;c.save();
  const lg=c.createRadialGradient(x-20,y-200,10,x-20,y-200,330);lg.addColorStop(0,rgba(DP.F.cyan,0.11*g));lg.addColorStop(1,rgba(DP.F.cyan,0));c.fillStyle=lg;c.fillRect(x-350,y-530,660,530);
  // the base, its keys towards her
  c.fillStyle="rgb(36,54,60)";rr(c,x-130,y-16,290,16,6);c.fill();c.fillStyle=rgba(AP_ICE,0.65);c.fillRect(x-126,y-16,282,2);
  // the lid: its lit screen, then its dark back edge
  c.beginPath();c.moveTo(x+112,y-16);c.lineTo(x+146,y-16);c.lineTo(x+214,y-248);c.lineTo(x+176,y-252);c.closePath();
  const sg=c.createLinearGradient(0,y-250,0,y);sg.addColorStop(0,rgba(AP_ICE,0.75*g+0.1));sg.addColorStop(1,rgba(DP.F.cyan,0.45*g+0.1));c.fillStyle=sg;c.shadowColor=rgba(DP.F.cyan,0.9*g);c.shadowBlur=22;c.fill();c.shadowBlur=0;
  c.beginPath();c.moveTo(x+146,y-16);c.lineTo(x+156,y-16);c.lineTo(x+224,y-246);c.lineTo(x+214,y-248);c.closePath();c.fillStyle="rgb(40,58,64)";c.fill();
  c.restore();}

/* ---------------------------------------------------------------- the request, the ticket and the table of keys */
const AP_REQ={x:470,y:180,w:620};
// the request, logged: its number, when it came, and (due 0 to 1) when it's due
function ap_request(c,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const R=AP_REQ;c.save();c.globalAlpha*=a;
  const b=dp_card(c,R.x,R.y,R.w,{kick:"Privacy request",title:"Request 2026-117",sub:"received Tue 24 Nov 2026"},{col:"cyan",k:o.k});
  if(o.due>0)dp_slip(c,R.x+30,b.y+b.h+20,"due Thu 24 Dec 2026","grey",{ink:true,a:o.due});c.restore();return b;}
// the ticket: GitHub's issue, its five steps; o: rows (0 to 5, typed in), ticks [p, ...], links [a, ...], noone, closed (0 to 1)
const AP_STEPS=["Find every place","The copy, by part","Off the mailing list","Owners check their parts","Answer sent"];
const AP_PROOF=["run #1408 · run as privacy-finder","copy · 1 Dec","history · DELETE · REORG · VACUUM","3 owners · 3 Dec","answer · 7 Dec"];
function ap_issue(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;
  const b=dp_page(c,x,y,w,h,{tool:"github",name:"GitHub",where:"Issues",title:"Request 2026-117 · due 24 Dec",col:"cyan"});
  let px=b.x;px+=dp_pill(c,px,b.y+38,"privacy request","grey",{glow:6})+16;const cl=clamp(o.closed||0,0,1);
  if(cl<1)dp_pill(c,px,b.y+38,"Open","green",{a:1-cl,glow:6});if(cl>0)dp_pill(c,px,b.y+38,"Closed · completed","green",{a:cl,glow:6});
  if(o.noone>0)dp_T(c,"Names no one · the numbers are in the restricted table",b.x,b.y+104,{w:600,size:28,col:"mut",a:o.noone});
  const rows=o.rows==null?5:o.rows;for(let i=0;i<5;i++){const ra=clamp(rows-i,0,1);if(ra<=0)break;const ry=b.y+180+i*76;c.save();c.globalAlpha*=ra;
    ap_box(c,b.x,ry,o.ticks?o.ticks[i]:0);dp_T(c,AP_STEPS[i],b.x+52,ry,{w:600,size:30});const la=o.links?o.links[i]:0;if(la>0)ap_link(c,b.x+440,ry+2,AP_PROOF[i],{a:la});c.restore();}
  c.restore();}
// the table of keys: frosted violet glass, a lock, its name; one row for each of her numbers under the request's number
const AP_KEYS={x:940,y:160,w:600,h:540},AP_NUMS=[["HR","E-4417"],["Student","S-20436"],["Student, archive","S-17142"],["Alumni","A-61207"],["Research","R-3082"],["Learning platform","u-88236"]];
const AP_KROW=i=>AP_KEYS.y+262+i*46;
function ap_keys(c,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const K=AP_KEYS;c.save();c.globalAlpha*=a;
  dp_frost(c,K.x,K.y,K.w,K.h,null,{col:"violet",r:22});dp_lock(c,K.x+52,K.y+58,50,"violet",0);
  dp_T(c,"privacy.request_keys",K.x+100,K.y+66,{w:500,size:30,f:"mono"});dp_pill(c,K.x+100,K.y+124,"restricted","violet",{glow:8});
  dp_T(c,"request",K.x+40,K.y+196,{w:700,size:28,col:"mut"});dp_T(c,"system",K.x+230,K.y+196,{w:700,size:28,col:"mut"});dp_T(c,"key",K.x+400,K.y+196,{w:700,size:28,col:"mut"});
  c.fillStyle=rgba(DP.T.mut,0.35);c.fillRect(K.x+40,K.y+212,K.w-80,1.4);
  for(let i=0;i<6;i++){const ra=(o.rows?o.rows(i):1);if(ra<=0)continue;const ry=AP_KROW(i);c.save();c.globalAlpha*=ra;
    dp_T(c,"2026-117",K.x+40,ry,{w:600,size:28});ap_bar(c,K.x+230,ry,120);ap_bar(c,K.x+400,ry,160);
    const gl=o.glow?o.glow(i):0;if(gl>0)dp_halo(c,K.x+480,ry-10,90,"violet",0.35*gl);c.restore();}
  c.restore();}
// who may read it: three identities, by the lock
const AP_READERS=["privacy office","privacy-finder","privacy-deleter"];
function ap_readers(c,o){o=o||{};AP_READERS.forEach((s,i)=>{const r=o.each?o.each(i):1;if(r>0)dp_slip(c,AP_KEYS.x+AP_KEYS.w+28,AP_KEYS.y+36+i*96,s,"cyan",{a:r,size:28});});}

/* ---------------------------------------------------------------- every place she is */
// the master record, in the registrar's office, and where it comes from
function ap_master(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;return dp_card(c,x,y,370,{kick:"Master record",title:"P-10482",sub:"Linh Nguyen"},{col:"cyan",a});}
// her number in one system, as a chip (cyan, who she is there), going violet as it goes into the table of keys (v 0 to 1)
function ap_num(c,x,y,i,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const s=AP_NUMS[i][0]+" · "+AP_NUMS[i][1],v=clamp(o.v||0,0,1);
  if(v<1)dp_slip(c,x,y,s,"cyan",{a:a*(1-v),size:28});if(v>0)dp_slip(c,x,y,s,"violet",{a:a*v,size:28});}
// dbt's terminal: the example project's command, typed (u 0 to 1), and what it lists
const AP_DBT=["$ dbt ls --resource-type model --select","    source:hr_system+ source:student_system+","    source:alumni_system+ source:research_system+","    source:learning_platform+"];
// the block of models on the lineage: 36 tables, what dbt lists once Deleted means deleted is in (10 Nov 2026). The words say
// "more than 30", which stays true as the example project grows, so the film needn't change when another film adds a model
const AP_MODELS=36,AP_COUNT="More than 30 models";
function ap_term(c,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;const b=dp_page(c,x,y,w,h,{tool:"dbt",name:"dbt",where:"The data project",col:"cyan"});
  const all=AP_DBT.join("\n");let n=Math.round(clamp(o.u||0,0,1)*all.length);AP_DBT.forEach((l,i)=>{if(n<=0)return;dp_T(c,l.slice(0,n),b.x,b.y+40+i*48,{w:500,size:28,f:"mono",col:i?"ink":"cyan"});n-=l.length+1;});
  if(o.res>0){c.save();c.globalAlpha*=o.res;dp_T(c,AP_COUNT,b.x,b.y+300,{w:800,size:48});dp_T(c,"built from those five systems",b.x+dp_tw(c,AP_COUNT,{w:800,size:48})+28,b.y+300,{w:600,size:28,col:"mut"});c.restore();}
  c.restore();}
// the platform's lineage: five systems, the models dbt builds from them, the marts, and (rest 0 to 1) what lineage adds
const AP_SRC=["hr_system","student_system","alumni_system","research_system","learning_platform"];
const AP_MARTS=["mart_wallet__learners","mart_wallet__credentials","mart_planning__near_award","mart_finance__tuition_forgone"];
const AP_REST=[["a notebook's table",1],["a dashboard",2],["another team's job",3]];
const AP_LIN={src:{x:110,y0:330,dy:96},blk:{x:600,y:470},mart:{x:830,y0:360,dy:110},rest:{x:1450,y0:390,dy:120}};
function ap_tableIcon(c,x,y,col,a){c.save();c.globalAlpha*=a==null?1:a;const cc=dp_f(col||"grey");rr(c,x,y-24,30,26,5);c.fillStyle=rgba(mix(cc,[6,20,26],0.6),1);c.fill();c.strokeStyle=rgba(cc,0.9);c.lineWidth=1.8;c.stroke();
  c.fillStyle=rgba(cc,0.9);c.fillRect(x,y-24,30,7);c.restore();}
function ap_lineage(c,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const L=AP_LIN;c.save();c.globalAlpha*=a;
  dp_page(c,50,100,1820,790,{tool:"databricks",name:"Databricks",where:"Catalog · Lineage",col:"cyan"});
  const sy=i=>L.src.y0+i*L.src.dy,my=i=>L.mart.y0+i*L.mart.dy,ry=i=>L.rest.y0+i*L.rest.dy,lit=o.lit||(()=>0);
  // the lines first, under the nodes
  AP_SRC.forEach((s,i)=>dp_link(c,[L.src.x+20+dp_tw(c,s,{w:500,size:28,f:"mono"})+44,sy(i)-10],[L.blk.x-10,L.blk.y],"cyan",o.lines==null?1:o.lines,{lw:1.6,alpha:0.55,dot:false}));
  AP_MARTS.forEach((s,i)=>dp_link(c,[L.blk.x+214,L.blk.y],[L.mart.x-14,my(i)-10],"cyan",o.lines==null?1:o.lines,{lw:1.6,alpha:0.55,dot:false}));
  const rest=i=>typeof o.rest==="function"?o.rest(i):(o.rest||0);
  AP_REST.forEach(([s,m],i)=>dp_link(c,[L.mart.x+40+dp_tw(c,AP_MARTS[m],{w:500,size:28,f:"mono"})+20,my(m)-10],[L.rest.x-14,ry(i)-10],"cyan",rest(i),{lw:1.6,alpha:0.55,dot:false}));
  AP_SRC.forEach((s,i)=>{ap_tableIcon(c,L.src.x,sy(i),"cyan");dp_T(c,s,L.src.x+44,sy(i),{w:500,size:28,f:"mono"});});
  // the models dbt builds, as a block of small tables
  const top=L.blk.y-72-(Math.ceil(AP_MODELS/6)-5)*15;  // the block stays centred on its links, whatever the count
  for(let k=0;k<AP_MODELS;k++){const gx=L.blk.x+(k%6)*36,gy=top+Math.floor(k/6)*30;c.fillStyle=rgba(DP.F.cyan,0.18+0.5*lit(k));rr(c,gx,gy,28,22,4);c.fill();c.strokeStyle=rgba(DP.F.cyan,0.7);c.lineWidth=1.4;c.stroke();}
  dp_T(c,"More than 30",L.blk.x,L.blk.y+124,{w:700,size:28,col:"mut"});dp_T(c,"models",L.blk.x,L.blk.y+160,{w:700,size:28,col:"mut"});  // two lines: one would run into the marts
  AP_MARTS.forEach((s,i)=>{ap_tableIcon(c,L.mart.x,my(i),"cyan");dp_T(c,s,L.mart.x+40,my(i),{w:500,size:28,f:"mono"});});
  AP_REST.forEach(([s,m],i)=>{const q=rest(i);if(q<=0)return;c.save();c.globalAlpha*=q;ap_tableIcon(c,L.rest.x,ry(i),"cyan");dp_T(c,s,L.rest.x+44,ry(i),{w:600,size:28});c.restore();});
  c.restore();}
// the classes on columns, from Know what you hold: two columns that name a person or hold a code for one, and one that doesn't
function ap_classes(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;dp_panel(c,x,y,500,420,{col:"violet",r:20,glowR:36});
  dp_T(c,"TAGS ON COLUMNS",x+30,y+52,{w:800,size:28,ls:4,col:"violet"});
  [["staff_id","personal_data: direct","violet"],["learner_key","personal_data: pseudonymous","violet"],["unit_code","none","grey"]].forEach(([col,cls,k],i)=>{const yy=y+118+i*102,q=o.each?o.each(i):1;if(q<=0)return;
    c.save();c.globalAlpha*=q;dp_T(c,col,x+30,yy,{w:500,size:28,f:"mono"});dp_pill(c,x+30,yy+52,cls,k,{glow:8});c.restore();});c.restore();}
// the search job's badge: its own identity, owned by a person, for a logged request only
function ap_finder(c,x,y,o){o=o||{};dp_badge(c,x,y,560,372,{kind:"Service principal",col:"cyan",title:"privacy-finder",lines:[["owned by Jun Park"],["for a logged request only"]],pic:dp_gearPic,t:o.t,a:o.a});  // the light reads its picture, where no words are, so it never passes over a line of text
  const a=o.a==null?1:o.a;if(o.scan>0&&o.scan<1&&a>0){c.save();c.globalAlpha*=a;dp_scan(c,x+28,y+88,150,176,o.scan,"cyan",12);c.restore();}}
function ap_deleter(c,x,y,o){o=o||{};dp_badge(c,x,y,560,372,{kind:"Service principal",col:"cyan",title:"privacy-deleter",lines:[["owned by Sam Okafor"],["for an approved"],["request only"]],pic:dp_gearPic,t:o.t,a:o.a});}   // its purpose in two lines: on one, it ran 29 px past the badge
// the search, table by table: each table, ticked when her numbers are found, and the marts where she's only a code
const AP_STG=["stg_hr_system__staff","stg_student_system__learners","stg_alumni_system__alumni","stg_research_system__researchers","stg_learning_platform__users"];
function ap_search(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;const rows=AP_STG.concat(AP_MARTS),v=o.violet||0;
  rows.forEach((s,i)=>{const yy=y+i*64,mart=i>=AP_STG.length,ra=o.rows?o.rows(i):1;if(ra<=0)return;c.save();c.globalAlpha*=ra;
    const sw=dp_tw(c,s,{w:500,size:28,f:"mono"});if(mart&&v>0){c.save();c.globalAlpha*=v;dp_panel(c,x-14,yy-42,sw+86,58,{col:"violet",r:14,glowR:22,glowA:0.7});c.restore();}
    ap_tableIcon(c,x,yy,mart&&v>0.5?"violet":"cyan");dp_T(c,s,x+44,yy,{w:500,size:28,f:"mono"});
    const tk=o.tick?o.tick(i):0,cr=o.cross?o.cross(i):0;if(cr>0&&tk<=0)dp_cross(c,x-40,yy-10,"coral",cr);if(tk>0)dp_tick(c,x-40,yy-10,"green",tk);c.restore();});
  if(v>0){const yy=y+rows.length*64+6;dp_pill(c,x-14,yy,"the marts: only as a code","violet",{a:v,glow:8});}
  c.restore();}
// the search's query, from the example project's analyses/privacy/find_a_person.sql, word for word; hi lights the line of codes
const AP_SQL=["select count(*) as rows_found","from {{ table }} as t","join privacy.request_keys as k","  on k.request = '{{ var(\"request\") }}'"," and t.{{ column }} in (k.key, k.system || '|' || k.key,","     sha2(upper(k.system || '|' || k.key), 256))"];
function ap_query(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=1000,h=AP_SQL.length*44+108;c.save();c.globalAlpha*=a;dp_panel(c,x,y,w,h,{col:"cyan",r:20,glowR:36});
  dp_T(c,"FIND_A_PERSON.SQL",x+30,y+52,{w:800,size:28,ls:4,col:"cyan"});const all=AP_SQL.join("\n");let n=Math.round(clamp(o.u==null?1:o.u,0,1)*all.length);
  AP_SQL.forEach((l,i)=>{if(n<=0)return;const yy=y+104+i*44;if(i>=4&&o.hi>0){c.save();c.globalAlpha*=o.hi;dp_halo(c,x+w/2,yy-10,420,"violet",0.10);c.restore();}
    if(i>=4&&o.hi>0){c.save();c.globalAlpha*=o.hi;c.fillStyle=rgba(DP.F.violet,0.95);rr(c,x+12,yy-28,5,36,2.5);c.fill();c.restore();}
    dp_T(c,l.slice(0,n),x+30,yy,{w:500,size:28,f:"mono"});n-=l.length+1;});c.restore();}
// what the platform keeps of a query: its text, a year, read by admins; the request's number where a person's would be
function ap_qtext(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const w=980;c.save();c.globalAlpha*=a;dp_panel(c,x,y,w,330,{col:"cyan",r:20,glowR:36});
  dp_T(c,"QUERY TEXT",x+30,y+52,{w:800,size:28,ls:4,col:"cyan"});dp_T(c,"kept a year · read by admins",x+250,y+52,{w:600,size:28,col:"mut"});
  dp_T(c,"select count(*) as rows_found",x+30,y+124,{w:500,size:28,f:"mono"});dp_T(c,"from prod_marts.mart_wallet__learners as t",x+30,y+170,{w:500,size:28,f:"mono"});
  dp_T(c,"join privacy.request_keys as k",x+30,y+216,{w:500,size:28,f:"mono"});const pre="  on k.request = ",pw=dp_tw(c,pre,{w:500,size:28,f:"mono"});
  dp_T(c,pre,x+30,y+262,{w:500,size:28,f:"mono"});dp_T(c,"'2026-117'",x+30+pw,y+262,{w:500,size:28,f:"mono",col:"green"});
  const rg=clamp(o.ring||0,0,1);if(rg>0){const rw=dp_tw(c,"'2026-117'",{w:500,size:28,f:"mono"});c.save();c.strokeStyle=rgba(DP.F.green,1);c.shadowColor=rgba(DP.F.green,0.8);c.shadowBlur=10;c.lineWidth=3;
    c.beginPath();c.ellipse(x+30+pw+rw/2,y+252,rw/2+20,30,0,-Math.PI/2,-Math.PI/2+TAU*ag_sine(rg));c.stroke();c.restore();}
  c.restore();return{x,y,w,h:330};}
// outside the platform's glass: what lineage can't see, each searched by its owner
const AP_OUT=[["Payroll","bought"],["Claims app",""],["Mailing tool",""],["Signed contracts",""]];
function ap_outside(c,o){o=o||{};const P=[[120,250],[120,590],[1470,250],[1470,590]];AP_OUT.forEach(([n,s],i)=>{const q=o.each?o.each(i):1;if(q<=0)return;const [x,y]=P[i];c.save();c.globalAlpha*=q;
  dp_wall(c,x,y,330,230,{frosted:true,col:"grey"});dp_T(c,n,x+165,y+100,{w:700,size:32,align:"center"});if(s)dp_T(c,s,x+165,y+146,{w:600,size:28,align:"center",col:"mut"});
  const tk=o.tick?o.tick(i):0;if(tk>0){dp_tick(c,x+165,y+192,"green",tk);}c.restore();});}

/* ---------------------------------------------------------------- what we hold about you */
const AP_COPY=[["Contracts and hours","contract","HR","payroll",["as pay records"]],["Pay records","law","payroll","the tax office",["7 years after each contract,","the last 20 Nov 2033"]],
  ["Degrees and results","public task","student system","—",["kept for good"]],["Research project","public task","research office","its funder",["as its rules require"]]];
const AP_COLS=[["part",0],["why",360],["from",620],["who else",900],["until",1180]];
function ap_copy(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=1800,h=610;c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+w/2,y+h/2,lerp(0.8,1,o.k));
  dp_panel(c,x,y,w,h,{col:"cyan",r:22,glowR:40});dp_T(c,"What we hold about you",x+40,y+70,{w:800,size:44});dp_T(c,"Request 2026-117 · Linh Nguyen",x+40,y+114,{w:600,size:28,col:"mut"});
  AP_COLS.forEach(([s,dx],i)=>{const q=o.head?o.head(i):1;dp_T(c,s,x+40+dx,y+170,{w:700,size:28,col:"cyan",a:q,ls:1});});c.fillStyle=rgba(DP.F.cyan,0.4);c.fillRect(x+40,y+186,w-80,1.6);
  AP_COPY.forEach((r,i)=>{const q=o.rows?o.rows(i):1;if(q<=0)return;const yy=y+236+i*80;c.save();c.globalAlpha*=q;
    dp_T(c,r[0],x+40,yy,{w:700,size:28});dp_pill(c,x+40+AP_COLS[1][1],yy,r[1],"allowed",{glow:8});dp_T(c,r[2],x+40+AP_COLS[2][1],yy,{w:600,size:28});dp_T(c,r[3],x+40+AP_COLS[3][1],yy,{w:600,size:28});
    r[4].forEach((s,j)=>dp_T(c,s,x+40+AP_COLS[4][1],yy+j*36,{w:600,size:28}));if(i<3){c.fillStyle=rgba(DP.T.mut,0.2);c.fillRect(x+40,yy+(r[4].length>1?54:30),w-80,1.2);}c.restore();});
  const oq=o.others||0;if(oq>0){const yy=y+236+4*80+10;c.save();c.globalAlpha*=oq;dp_T(c,"Marks she gave her students",x+40,yy,{w:700,size:28,col:"mut"});
    const sw=dp_tw(c,"Marks she gave her students",{w:700,size:28}),st=ag_sine(clamp((o.strike||0),0,1));c.strokeStyle=rgba(DP.F.coral,1);c.lineWidth=3.5;c.beginPath();c.moveTo(x+36,yy-10);c.lineTo(x+36+(sw+8)*st,yy-10);c.stroke();
    if(o.left>0)dp_pill(c,x+40+AP_COLS[2][1],yy,"about other people: left out","coral",{a:o.left,glow:8});c.restore();}
  c.restore();}
// the owners who check their parts, side by side under the copy: each with what they own, the date and a tick
const AP_OWN=[["Ingrid Holm","HR"],["Mei Tanaka","registrar"],["Research office","her project"]];
function ap_owners(c,x,y,o){o=o||{};AP_OWN.forEach(([n,r],i)=>{const q=o.each?o.each(i):1;if(q<=0)return;const xx=x+i*600;c.save();c.globalAlpha*=q;dp_panel(c,xx,y,560,100,{col:"green",r:18,glowR:28});
  dp_T(c,n,xx+28,y+44,{w:700,size:30});dp_T(c,r+" · 3 Dec",xx+28,y+82,{w:600,size:28,col:"mut"});dp_tick(c,xx+508,y+50,"green",o.tick?o.tick(i):1);c.restore();});}

/* ---------------------------------------------------------------- off the list, and kept off */
// a table of the list on the platform: its name, and rows as grey bars (no one's details shown); hers outlined in cyan, struck (s) and lifted out (out)
function ap_listTable(c,x,y,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=760,h=360;c.save();c.globalAlpha*=a;dp_panel(c,x,y,w,h,{col:"grey",r:20,glowR:30});
  ap_tableIcon(c,x+30,y+60,"grey");dp_T(c,name,x+76,y+60,{w:500,size:28,f:"mono"});
  for(let i=0;i<5;i++){const yy=y+124+i*48,her=i===2;let dy=0,ra=1;if(her){dy=-60*ag_sine(o.out||0);ra=1-ag_in(o.out||0,0.4,0.6);}if(ra<=0)continue;c.save();c.globalAlpha*=ra;c.translate(her?40*ag_sine(o.out||0):0,dy);
    ap_bar(c,x+30,yy,w-60,{col:"violet"});if(her&&o.mark>0){c.save();c.globalAlpha*=o.mark;c.strokeStyle=rgba(DP.F.cyan,1);c.shadowColor=rgba(DP.F.cyan,0.8);c.shadowBlur=10;c.lineWidth=2.6;rr(c,x+24,yy-32,w-48,46,10);c.stroke();c.restore();}
    if(her&&o.strike>0){c.strokeStyle=rgba(DP.F.coral,1);c.lineWidth=4;c.beginPath();c.moveTo(x+30,yy-9);c.lineTo(x+30+(w-60)*ag_sine(o.strike),yy-9);c.stroke();}c.restore();}
  c.restore();}
// the series' person: Linh in the master record, and the wishes kept on her (her yes of 2023, then her no)
function ap_person(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;dp_panel(c,x,y,560,250,{col:"cyan",r:22,glowR:36});
  c.save();rr(c,x+30,y+34,150,180,14);c.fillStyle="rgba(6,26,32,0.9)";c.fill();c.clip();dp_personPic(c,x+105,y+134,"cyan");c.restore();
  dp_T(c,"Linh Nguyen",x+210,y+104,{w:700,size:40});dp_T(c,"P-10482 · the person",x+210,y+152,{w:600,size:28,col:"mut"});c.restore();}
// a wish kept on the person: yes (green) or no (coral), what it's about, when and how it was given
function ap_wish(c,x,y,yes,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return null;const col=yes?"green":"coral",w=560,h=196;c.save();c.globalAlpha*=a;if(o.dy)c.translate(0,o.dy);
  dp_panel(c,x,y,w,h,{col,r:18,glowR:28});dp_pill(c,x+28,y+60,yes?"yes":"no",col,{glow:10});dp_T(c,"news of tutoring work",x+130,y+60,{w:700,size:30});
  dp_T(c,yes?"16 Jan 2023 · application form":"24 Nov 2026 · told the privacy office",x+28,y+112,{w:600,size:28,col:"mut"});if(!yes)dp_T(c,"change it: her settings",x+28,y+156,{w:600,size:28,col:"mut"});
  c.restore();return{x,y,w,h};}
// how the list is made, in words, and the one line of the model that holds the rule
function ap_rule(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;const L=["rebuilt each semester","HR's casual contracts of the last two years","only those whose yes is on the person"];
  dp_panel(c,x,y,800,270,{col:"cyan",r:20,glowR:36});dp_T(c,"THE TUTORS' MAILING LIST",x+30,y+52,{w:800,size:28,ls:4,col:"cyan"});
  L.forEach((s,i)=>{const q=o.each?o.each(i):1;if(q>0)dp_T(c,s,x+30,y+112+i*48,{w:600,size:30,a:q});});
  const d=o.dbt||0;if(d>0){c.save();c.globalAlpha*=d;const b=dp_page(c,x,y+300,800,250,{tool:"dbt",name:"dbt",where:"The data project",col:"cyan"});
    dp_T(c,"mart_hr__tutors_mailing_list",b.x,b.y+36,{w:500,size:28,f:"mono",col:"cyan"});dp_T(c,"where wishes.answer = 'yes'",b.x,b.y+92,{w:500,size:30,f:"mono"});c.restore();}
  c.restore();}
// the list table's versions, as panes behind it: her row still in the older ones (violet), until they're cleaned up (gone 0 to 1)
function ap_versions(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;const n=4,op=o.open||0;
  for(let k=n;k>=1;k--){const q=ag_sine(clamp(op*1.4-(n-k)*0.12,0,1))*(1-ag_in(o.gone||0,k*0.12,0.4));if(q<=0)continue;const dx=k*46*q,dy=-k*40*q;c.save();c.globalAlpha*=q*0.85;
    dp_panel(c,x+dx,y+dy,560,300,{col:"grey",r:18,glowR:20,glowA:0.5});for(let i=0;i<4;i++)ap_bar(c,x+dx+26,y+dy+90+i*46,440,{col:"violet",a:0.8});c.restore();}
  dp_panel(c,x,y,560,300,{col:"grey",r:18,glowR:24});ap_tableIcon(c,x+26,y+54,"grey");dp_T(c,"mart_hr__tutors_mailing_list",x+70,y+54,{w:500,size:28,f:"mono"});
  for(let i=0;i<4;i++)ap_bar(c,x+26,y+110+i*46,508,{col:"violet"});c.restore();}
// the table's history, as the platform shows it: the delete, the purge, and the clean-up of old files
const AP_HIST=[["v52","DELETE","25 Nov","privacy-deleter"],["v53","REORG","25 Nov","privacy-deleter"],["v54","VACUUM START","2 Dec",""],["v55","VACUUM END","2 Dec",""]];
function ap_history(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;const b=dp_page(c,x,y,780,360,{tool:"databricks",name:"Databricks",where:"Table history",col:"cyan"});
  dp_T(c,"mart_hr__tutors_mailing_list",b.x,b.y+30,{w:500,size:28,f:"mono",col:"cyan"});
  AP_HIST.forEach((r,i)=>{const q=o.rows?o.rows(i):1;if(q<=0)return;const yy=b.y+90+i*50;c.save();c.globalAlpha*=q;dp_T(c,r[0],b.x,yy,{w:500,size:28,f:"mono",col:"mut"});
    dp_T(c,r[1],b.x+80,yy,{w:500,size:28,f:"mono"});dp_T(c,r[2],b.x+330,yy,{w:600,size:28});if(r[3])dp_T(c,r[3],b.x+460,yy,{w:600,size:28,col:"cyan"});c.restore();});c.restore();}
// the audit log: who read the table of keys, and no one else
function ap_audit(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;const b=dp_page(c,x,y,780,370,{tool:"databricks",name:"Databricks",where:"Audit log",col:"cyan"});
  dp_T(c,"system.access.audit",b.x,b.y+30,{w:500,size:28,f:"mono",col:"cyan"});dp_T(c,"getTable · privacy.request_keys",b.x,b.y+80,{w:500,size:28,f:"mono",col:"mut"});
  AP_READERS.forEach((s,i)=>{const q=o.rows?o.rows(i):1;if(q<=0)return;const yy=b.y+136+i*44;c.save();c.globalAlpha*=q;dp_tick(c,b.x+14,yy-10,"green",1);dp_T(c,s,b.x+50,yy,{w:600,size:28,col:"cyan"});c.restore();});c.restore();}
// the privacy office's table of requests and when each is due: tracked like work; o.ans the answer of 2026-117 (0 to 1), o.early
const AP_REQS=[["2026-112","see","2 Dec","27 Nov",""],["2026-113","see","9 Dec","—","2 days left"],["2026-115","correct","13 Dec","1 Dec",""],["2026-117","see, stop news","24 Dec","—","17 days left"],["2026-118","erase","26 Dec","—","19 days left"]];
function ap_requests(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=1240,h=520;c.save();c.globalAlpha*=a;dp_panel(c,x,y,w,h,{col:"cyan",r:22,glowR:40});
  dp_T(c,"Requests and when they're due",x+36,y+70,{w:800,size:40});const C=[0,190,450,640,850];["request","asks","due","answered","days left"].forEach((s,i)=>dp_T(c,s,x+36+C[i],y+140,{w:700,size:28,col:"cyan"}));
  c.fillStyle=rgba(DP.F.cyan,0.4);c.fillRect(x+36,y+156,w-72,1.6);
  AP_REQS.forEach((r,i)=>{const yy=y+214+i*62,mine=i===3,near=i===1;const ans=mine?(o.ans||0):1;
    if(near&&o.near>0){c.save();c.globalAlpha*=o.near;rr(c,x+20,yy-42,w-40,58,12);c.strokeStyle=rgba(AP_ICE,0.9);c.lineWidth=2.4;c.shadowColor=rgba(AP_ICE,0.8);c.shadowBlur=12;c.stroke();c.restore();}
    if(mine&&o.mine>0){c.save();c.globalAlpha*=o.mine;rr(c,x+20,yy-42,w-40,58,12);c.strokeStyle=rgba(DP.F.cyan,0.9);c.lineWidth=2.4;c.stroke();c.restore();}
    dp_T(c,r[0],x+36,yy,{w:600,size:28});dp_T(c,r[1],x+36+C[1],yy,{w:600,size:28});dp_T(c,r[2],x+36+C[2],yy,{w:600,size:28});
    if(mine){if(ans<1)dp_T(c,"—",x+36+C[3],yy,{w:600,size:28,a:1-ans});if(ans>0)dp_T(c,"7 Dec",x+36+C[3],yy,{w:700,size:28,col:"green",a:ans});}else dp_T(c,r[3],x+36+C[3],yy,{w:600,size:28,col:r[3]==="—"?"mut":"ink"});
    if(mine){if((o.early||0)<1&&r[4])dp_T(c,r[4],x+36+C[4],yy,{w:600,size:28,col:"mut",a:1-(o.early||0)});if(o.early>0)dp_pill(c,x+36+C[4],yy,"17 days early","green",{a:o.early,glow:10});}
    else if(r[4]){if(near)ap_clock(c,x+36+C[4]+18,yy-10,18,30,1,{left:2,a:1});dp_T(c,r[4],x+36+C[4]+(near?50:0),yy,{w:600,size:28,col:near?"ink":"mut"});}});
  c.restore();}
// Linh's answer: the first page of her copy, opened on her phone once she's signed in
function ap_answer(c,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;c.save();c.globalAlpha*=a;if(o.k!=null)ag_about(c,x+330,y+150,lerp(0.7,1,o.k));
  dp_panel(c,x,y,660,300,{col:"cyan",r:22,glowR:36});dp_T(c,"What we hold about you",x+32,y+66,{w:800,size:36});dp_T(c,"Request 2026-117 · answered 7 Dec 2026",x+32,y+112,{w:600,size:28,col:"mut"});
  ["Contracts and hours · contract","Pay records · law","Degrees and results · public task"].forEach((s,i)=>dp_T(c,s,x+32,y+170+i*40,{w:600,size:28}));c.restore();}

/* ---------------------------------------------------------------- the series and the module */
const AP_FILMS=[["A reason to keep it","Keep data for a reason you can say"],["How long, and then what","Every record has an end date, decided before it's needed"],["Forgetting a person","A person can ask. You must be able to answer"],
  ["Deleted means deleted","Deleting is done when the last copy is gone"],["A person asks","A request answered on time, with proof"]];  // each film's end card, word for word
function ap_films(c,o){o=o||{};AP_FILMS.forEach(([t,l],i)=>{const x=150,y=120+i*140,w=1620,q=o.each?o.each(i):1;if(q<=0)return;const lw=o.line?o.line(i):1,me=i===4;c.save();c.globalAlpha*=q;
  dp_panel(c,x,y,w,118,{col:me?"cyan":"grey",r:20,glowR:me?40:24});dp_T(c,"FILM "+(i+1)+" OF 5",x+32,y+48,{w:800,size:28,ls:4,col:me?"cyan":"mut"});dp_T(c,t,x+32,y+94,{w:700,size:34});
  if(lw>0){const n=Math.round(lw*l.length);dp_T(c,l.slice(0,n),x+720,y+74,{w:600,size:30});}
  c.restore();});}
const AP_SERIES=[["Locks before the data","who may come in"],["Only what you may see","what each may see"],["Kept for a reason","how long anything stays"]];
function ap_series(c,o){o=o||{};AP_SERIES.forEach(([t,l],i)=>{const x=150+i*560,y=270,q=o.each?o.each(i):1;if(q<=0)return;c.save();c.globalAlpha*=q;dp_panel(c,x,y,500,300,{col:"cyan",r:22,glowR:36});
  dp_T(c,"SERIES "+(i+1)+" OF 3",x+30,y+58,{w:800,size:28,ls:4,col:"cyan"});dp_T(c,t,x+30,y+120,{w:700,size:36});const lw=o.line?o.line(i):0;if(lw>0)dp_T(c,l,x+30,y+200,{w:600,size:30,col:"mut",a:lw});c.restore();});}
function ap_topics(c,o){o=o||{};const q=o.a==null?1:o.a;if(q<=0)return;c.save();c.globalAlpha*=q;
  dp_panel(c,210,330,700,260,{col:"grey",r:24,glowR:30});dp_T(c,"TOPIC",250,394,{w:800,size:28,ls:4,col:"mut"});dp_T(c,"Data protection and privacy",250,460,{w:700,size:40});dp_T(c,"Three series · 22 films",250,516,{w:600,size:28,col:"mut"});
  const n=o.next||0;dp_panel(c,1010,330,700,260,{col:"cyan",r:24,glowR:30+30*n,glowA:0.5+0.8*n});dp_T(c,"NEXT",1050,394,{w:800,size:28,ls:4,col:"cyan"});dp_T(c,"AI agents in data work",1050,460,{w:700,size:40});
  dp_T(c,"where agents work under the same rules",1050,516,{w:600,size:28,col:"mut",a:0.4+0.6*n});c.restore();}
