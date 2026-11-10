/* ===== Tags that travel: the scenes =====
   Eight chapters, each timed to its narration: wAt(sc, "line", "word") is the moment a word is said. The places are painted once
   (tt_forest.js, tt_hall.js); what moves is drawn live in the shots of ag_shots. In one room the camera glides and only what changes
   fades; between rooms the film cuts (cut: true), and dissolves only where the whole picture changes (from the forest to the chain).
   Every chapter opens on a cut (ag_cutInto, at the end). People stand behind their desks with their arms down, in their own rooms; in
   the hall, the platform knows them by their identity chips. Cards are never over a person. */

DP_PEOPLE.push("sam","mei","jun");

const TT_TITLE="Tags that travel",TT_SUB="Governed tags, from the owner's file to every table made from it";
const tt_once=(sc,k,fn)=>sc[k]||(sc[k]=fn());
// a card that springs in at t0 and goes at t1 (or stays): its k (scale) and a (opacity)
const tt_pop=(t,t0,t1)=>({k:clamp(ag_spr(t,t0,0.8),0,1.2),a:t1==null?ag_in(t,t0,0.35):ag_io(t,t0,t1,0.35)});
// a phase from 0 to 1 over d seconds from t0, eased
const tt_ph=(t,t0,d)=>ag_sine(clamp((t-t0)/(d||1),0,1));
// a point part u of the way from a to b, eased, lifted by lift px at the middle
function tt_arc(a,b,u,lift){const e=ag_sine(u);return [lerp(a[0],b[0],e),lerp(a[1],b[1],e)-(lift||0)*Math.sin(Math.PI*e)];}
// lineage from row i of table A to row j of table B (A's right edge to B's left edge, at the rows' middles)
const tt_link=(A,i,B,j)=>tt_path([A.x+A.w,tt_rowY(A,i)-12],[B.x,tt_rowY(B,j)-12]);

/* ---------------------------------------------------------------- 1 · From forest to shelf */
// the label on the shop's chair: a plain hang tag of the film's own (no logo), green as what is certified, on a string to the chair
function tt_hangTag(ctx,x,y,to,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;const w=440,h=120,c=DP.F.green;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,clamp(o.k,0,1.2)));
  ctx.save();ctx.strokeStyle=rgba(TT_ICE,0.75);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,y+h/2);ctx.quadraticCurveTo(lerp(x+30,to[0],0.5),Math.max(y+h,to[1])+40,to[0],to[1]);ctx.stroke();ctx.restore();
  if(o.glow>0)dp_halo(ctx,x+w/2,y+h/2,w*0.75,"green",0.4*o.glow);
  const sh=()=>{ctx.beginPath();ctx.moveTo(x+44,y);ctx.lineTo(x+w,y);ctx.lineTo(x+w,y+h);ctx.lineTo(x+44,y+h);ctx.lineTo(x,y+h/2);ctx.closePath();};
  ctx.save();ctx.shadowColor=rgba(c,0.45);ctx.shadowBlur=22;sh();ctx.fillStyle="rgba(4,20,22,0.88)";ctx.fill();ctx.restore();
  ctx.save();sh();ctx.strokeStyle=rgba(mix(c,[255,255,255],0.3),1);ctx.lineWidth=2.4;ctx.stroke();ctx.restore();
  ctx.fillStyle="rgba(4,20,22,1)";ctx.beginPath();ctx.arc(x+30,y+h/2,7,0,TAU);ctx.fill();ctx.strokeStyle=rgba(c,1);ctx.lineWidth=2;ctx.stroke();
  dp_T(ctx,"Certified forest",x+62,y+52,{w:700,size:32,col:"green"});dp_T(ctx,"every company certified",x+62,y+94,{w:600,size:28});ctx.restore();}
// where the claim is on its way along the chain (u 0 to 3, station to station): just over each station's tick
function tt_claimAt(u){const k=clamp(Math.floor(u),0,2),f=ag_sine(clamp(u-k,0,1)),[x0,y0]=TT_ST[k],[x1,y1]=TT_ST[k+1];return [lerp(x0,x1,f),lerp(y0,y1,f)-96-40*Math.sin(Math.PI*f)];}
// the opening's three small panes in the hall: the learner table and two copies made from it
const TT_SRC=[140,330,640],TT_CP1=[1180,180,600],TT_CP2=[1180,560,600];
function tt_opening(x,tt,P){const go=1-ag_in(tt,P.title-0.1,0.7);if(go<=0)return;x.save();x.globalAlpha*=go;
  const hid=tt_ph(tt,P.hidden,0.8),prot=k=>clamp((tt-P.ifdo-k*0.35)/1.6,0,1),LD=150;
  const S=tt_mini(x,...TT_SRC,"Learner table","registrar's office",[{c:"name",v:"Samuel Osei",v2:"***",u:hid,cls:"direct"},{c:"course",v:"Nursing"}],{a:ag_in(tt,P.travels+0.2,0.5)});
  const a0=[TT_SRC[0]+TT_SRC[2],S.ys[0]-12];
  [[TT_CP1,0],[TT_CP2,1]].forEach(([C,k])=>{const ys=tt_mini(x,...C,"A copy",null,[{c:"name"},{c:"course"}],{measure:true}).ys,b=[C[0],ys[0]-12],L=tt_path(a0,b),u=prot(k),done=u>=1;
    tt_lineage(x,L,tt_ph(tt,P.made+k*0.4,1.2),{lit:u>0&&u<1?1:0.2});
    tt_mini(x,...C,"A copy",null,[{c:"name",v:"Samuel Osei",v2:"***",u:tt_ph(tt,P.ifdo+k*0.35+1.5,0.6),cls:done?"direct":null,ck:done?ag_spr(tt,P.ifdo+k*0.35+1.6,0.6):null},{c:"course",v:"Nursing"}],{a:ag_in(tt,P.made+0.6+k*0.4,0.5),lead:LD});
    if(u>0&&u<1)tt_ride(x,L,u,"direct",[C[0]+24,ys[0]],{});
    if(k===0){const r=tt_ph(tt,P.shows,0.9)*(1-ag_in(tt,P.ifdo+1.6,0.5));if(r>0)tt_ring(x,C[0]+170+LD-4,ys[0]-38,178,50,r,{label:"shows on a copy",lx:C[0]+C[2]-28,ly:C[1]+54,lalign:"right"});}});
  x.restore();}

scene("forest",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({
    much:wAt(sc,"cut","much"),campaign:wAt(sc,"boycott","campaign"),tell:c.tell,bare:wAt(sc,"same","cut bare"),cared:wAt(sc,"same","cared"),
    goes:wAt(sc,"harm","goes"),species:wAt(sc,"harm","species"),comms:wAt(sc,"harm","communities"),hundred:wAt(sc,"hectares","hundred"),rio:wAt(sc,"rio","Rio"),fail:wAt(sc,"rio","fail"),toronto:c.toronto,people:wAt(sc,"toronto","hundred"),
    groups:wAt(sc,"toronto","forest and"),traders:wAt(sc,"toronto","timber"),foresters:wAt(sc,"toronto","foresters"),council:c.council,
    auditor:c.auditor,certifies:wAt(sc,"auditor","certifies"),passes:c.passes,buys:wAt(sc,"passes","buys"),saws:wAt(sc,"passes","saws"),
    makes:wAt(sc,"passes","makes"),sells:wAt(sc,"passes","sells"),claim:wAt(sc,"passes","passes the claim"),label:c.label,carries:wAt(sc,"label","carries"),
    mixed:c.mixed,rule:wAt(sc,"mixed","rule"),hect:c.hectares,certs:wAt(sc,"hectares","sixty-eight"),buyer:c.buyer,began:wAt(sc,"buyer","where the wood"),
    travels:c.travels,made:wAt(sc,"travels","into every"),hidden:wAt(sc,"hidden","hidden"),shows:wAt(sc,"hidden","shows"),ifdo:c.protected,title:c.breath}));
  const ch=P.auditor-0.3;
  const i=ag_shots(ctx,S,t,sc.dur,[
    // the forest's edge at night: the camera starts on the forest cared for, comes out to show the slope cut bare beside it and two
    // planks that look the same, eases to the slope, then back to the forest as the council is founded
    {at:0,place:"ttForest",keys:[[0,1250,470,1.32],[P.tell-0.4,960,540,1.0],[P.goes,640,600,1.3],[P.toronto-0.6,1180,470,1.25]],d:2.8,push:0.02,draw:(x,tt)=>{
      const n=tt_pop(tt,P.much,P.tell-0.4);dp_card(x,660,150,600,{kick:"Cut each year",title:"about 80% more than ten years before"},{col:TT_ICE,k:n.k,a:n.a});
      dp_pill(x,690,430,"No tropical wood","coral",{a:ag_io(tt,P.campaign,P.tell-0.4,0.4)});
      // the harm, on the slope cut bare: what is lost, and who
      [["species disappear",P.species],["forest communities hit hard",P.comms]].forEach(([s,t0],k)=>dp_slip(x,150,300+k*92,s,TT_ICE,{ink:true,a:ag_io(tt,t0,P.rio-0.5,0.4)}));
      // two planks, the same; a faint line from each back to where it grew
      const pa=ag_io(tt,P.tell+0.3,P.goes-0.2,0.6),sl=(1-ag_eo(clamp((tt-P.tell-0.3)/0.9,0,1)))*60;
      if(pa>0){tt_plank(x,700,610+sl,240,62,{a:pa});tt_plank(x,980,610+sl,240,62,{a:pa});
        dp_link(x,[790,640],[330,700],TT_ICE,tt_ph(tt,P.bare,1.0),{lw:2,alpha:0.55*pa,dash:[6,8],dot:false});dp_link(x,[1130,640],[1500,620],TT_ICE,tt_ph(tt,P.cared,1.0),{lw:2,alpha:0.55*pa,dash:[6,8],dot:false});
        dp_tag(x,925,500,"?",TT_ICE,{a:pa*ag_in(tt,P.tell+0.8,0.4)});}
      // Rio, 1992: no agreement
      const r=tt_pop(tt,P.rio-0.1,P.toronto-0.8);dp_tag(x,80,280,"Rio de Janeiro · 1992",TT_ICE,{a:r.a});
      const rc=tt_pop(tt,P.fail-0.2,P.toronto-0.8);const b=dp_card(x,80,368,620,{title:"An agreement to stop it"},{col:TT_ICE,k:rc.k,a:rc.a});
      if(rc.a>0){x.save();x.globalAlpha*=rc.a;dp_cross(x,b.x+b.w-48,b.y+b.h/2,"coral",tt_ph(tt,P.fail+0.2,0.6));x.restore();}
      // Toronto, 1993: who met, then the council they founded
      const tr=tt_pop(tt,P.toronto+0.1,P.council-0.3),tb=dp_card(x,440,170,640,{kick:"Toronto · 1993",title:"130 people from 26 countries"},{col:TT_ICE,k:tr.k,a:tr.a});
      [["forest and human-rights groups",P.groups],["timber traders",P.traders],["foresters",P.foresters]].forEach(([s,t0],k)=>dp_slip(x,440,tb.y+tb.h+18+k*84,s,TT_ICE,{ink:true,a:ag_io(tt,t0,P.council-0.3,0.35)}));
      const fc=tt_pop(tt,P.council+0.1,null);dp_card(x,440,170,640,{kick:"Founded",title:"Forest Stewardship Council"},{col:TT_ICE,k:fc.k,a:fc.a});}},
    // the chain: the forest's log pile certified; the claim passed on from company to company, a tick at each; the label on the chair;
    // the bin where wood is mixed by a rule set before; the benefit; and back along the chain from the label to the forest
    {at:ch,dis:1.0,place:"ttChain",keys:[[ch,600,600,1.55],[P.passes+0.8,1000,600,1.45],[P.passes+2.3,1258,600,1.45],[P.label-0.3,1209,560,1.35],[P.mixed-0.2,1250,600,1.45],[P.hect-1.2,960,540,1.0]],d:2.4,push:0.01,draw:(x,tt)=>{
      // the claim on its way, station to station (u 0 to 3), from just after it comes in until "passes the claim": each station's tick
      // lights as the claim lands there
      const u=3*clamp((tt-P.passes-0.5)/(P.claim-P.passes-0.5),0,1),reach=Math.max(ag_in(tt,P.certifies,0.3)*0.999,u>0?u+0.4:0);
      const back=tt_ph(tt,P.began-0.2,2.2);tt_ticks(x,reach,{glow:k=>{const at=1-(k/3);return Math.max(ag_io(tt,P.claim,P.claim+1.2,0.4),back>0?ag_io(back,at-0.05,at+0.15,0.1):0);}});
      const au=tt_pop(tt,P.certifies,P.passes-0.3);dp_card(x,120,360,460,{kick:"Certified",title:"by an independent auditor"},{col:TT_ICE,k:au.k,a:au.a});
      const ca=ag_io(tt,P.passes+0.1,P.label+0.6,0.4);if(ca>0){const [sx,sy]=tt_claimAt(u);dp_slip(x,sx,sy-35,"claim: certified","green",{align:"center",ink:true,a:ca});}
      const lb=tt_pop(tt,P.carries-0.1,null);tt_hangTag(x,1180,300,[1650,700],{k:lb.k,a:lb.a,glow:Math.max(ag_io(tt,P.label+3.2,P.label+4.6,0.4),ag_io(tt,P.began-0.4,P.began+1.0,0.4))});
      const mx=tt_pop(tt,P.rule-0.2,P.hect-0.9);if(mx.a>0)dp_halo(x,TT_BIN[0],TT_BIN[1]-40,160,TT_ICE,0.25*mx.a);
      dp_tag(x,860,330,"mixed · by a rule set in advance",TT_ICE,{a:mx.a,to:[TT_BIN[0],TT_BIN[1]-62],p:tt_ph(tt,P.rule,0.6)});
      const h1=tt_pop(tt,Math.max(P.hect+1.3,P.hundred-0.1),null),h2=tt_pop(tt,Math.max(P.certs-0.1,P.hect+2.2),null);
      dp_card(x,430,150,520,{kick:"Forest certified",title:"171 million hectares"},{col:TT_ICE,k:h1.k,a:h1.a});dp_card(x,990,150,520,{kick:"Along the chain",title:"68,000 certificates"},{col:TT_ICE,k:h2.k,a:h2.a});
      // from the label back to the forest: a line of light along the road
      if(back>0){x.save();x.globalAlpha*=1-ag_in(tt,P.began+2.6,0.6);dp_link(x,[1640,TT_ROAD-38],[300,TT_ROAD-38],"green",back,{lw:3,dot:false});x.restore();}}},
    // a university's data travels too: the learner table, two copies made from it; a name hidden at the source shows on a copy; with
    // the class carried, it's hidden there too
    {cut:true,at:P.travels-0.2,place:"ttHall",keys:[[P.travels-0.2,960,540,1.0],[P.travels,960,540,1.02]],d:8,push:0.01,draw:(x,tt)=>tt_opening(x,tt,P)}]);
  const kA=i===0?ag_in(t,0.3,0.8)*(1-ag_in(t,P.rio-0.6,0.5)):0;if(kA>0)dp_kicker(ctx,"Tropical forests · the early 1990s",null,{a:kA});
  const kB=i===1?ag_in(t,P.hect+0.9,0.6)*(1-ag_in(t,P.buyer+3,0.6)):0;if(kB>0)dp_kicker(ctx,"By the end of 2025",null,{a:kB});
  dp_title(ctx,S,t,P.title,TT_TITLE,TT_SUB,"FILM 5 OF 8 · ONLY WHAT YOU MAY SEE");});

/* ---------------------------------------------------------------- 2 · Governed tags */
scene("governed",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({named:c.named,read:c.read,sam:c.sam,gov:wAt(sc,"sam","governed"),
    four:c.four,v:["special","direct","pseudonymous","indirect"].map(w=>wAt(sc,"four",w)),none:c.none,notag:wAt(sc,"none","no tag"),
    level:c.level,lfour:wAt(sc,"level","four"),tables:wAt(sc,"level","tables"),faculty:c.faculty,novals:wAt(sc,"faculty","no values"),
    means:c.means,only:wAt(sc,"means","only those values"),set:wAt(sc,"means","set only"),loader:wAt(sc,"loader","loader"),nobody:wAt(sc,"loader","nobody")}));
  const card0=[110,330],card1=[60,600],mv=tt_ph(t,P.read+0.2,2.4),cx=lerp(card0[0],card1[0],mv),cy=lerp(card0[1],card1[1],mv),PG=[60,60];
  ag_shots(ctx,S,t,sc.dur,[
    // Sam's room: first Mei's classes and levels, from the last film; then, as the camera comes out to Sam, the card moves down and
    // Databricks' Governed tags open above it, each value flying up from the card into its tag's row; the tags' permissions take the
    // card's place
    {at:0,place:"ttSam",keys:[[0,640,450,1.5],[P.read+0.2,960,540,1.0]],d:2.4,push:0.012,draw:(x,tt)=>{const [sx,sy,ss]=TT_SAM;
      dp_person(x,"sam",sx,sy,ss,{t:tt,cut:TT_BACK,flip:true,gaze:[3,1]});
      const sn=tt_pop(tt,P.sam+0.2,null);tt_name(x,1290,110,560,"Data platform","Sam Okafor",{k:sn.k,a:sn.a});
      const cd=tt_pop(tt,P.named+0.2,P.means-0.9),A=tt_classAt(x,cx,cy);tt_classCard(x,cx,cy,{k:cd.k,a:cd.a,titleA:1-ag_in(tt,P.v[0]-0.8,0.5)});
      const pg=ag_in(tt,P.gov,0.6);tt_tagsPage(x,PG[0],PG[1],{a:pg,rowA:i=>ag_in(tt,P.gov+0.3+i*0.25,0.5),onlyA:ag_in(tt,P.tables,0.5),noneA:ag_in(tt,P.novals,0.5),
        typeA:ag_in(tt,P.only-0.3,0.4),type:clamp((tt-P.only)/0.9,0,1),no:clamp((tt-P.only-1.2)/0.6,0,1)});
      // the card's chips, each flying into its row as it's named; none stays behind, and goes: on the platform it's no tag at all
      TT_KW_LVL.forEach((l,k)=>{const from=A.levels[k],f=clamp((tt-P.lfour-k*0.3)/0.9,0,1),to=tt_tagSlot(x,PG[0],PG[1],1,k),p=tt_arc(from,to,f,70);tt_level(x,p[0],p[1],l,{a:f>0?1:cd.a});});
      TT_KW_CLS.forEach((cls,k)=>{const from=A.chips[k];if(k<4){const f=clamp((tt-P.v[k]+0.15)/0.9,0,1),to=tt_tagSlot(x,PG[0],PG[1],0,k),p=tt_arc(from,to,f,70);
          if(f>0&&f<1)dp_halo(x,p[0]+40,p[1]-12,70,TT_CLASS[cls],0.3);tt_chip(x,p[0],p[1],cls,{a:f>0?1:cd.a});}
        else{const e=tt_ph(tt,P.notag-0.2,0.6),ga=cd.a*(1-ag_in(tt,P.level-0.6,0.6)),nx=lerp(from[0],A.chips[0][0],tt_ph(tt,P.none-0.2,0.8));
          tt_chip(x,nx,from[1],"noneIce",{a:ga*(1-e)});tt_chip(x,nx,from[1],"empty",{a:ga*e});
          if(e>0)dp_T(x,"no tag",nx+tt_chipW(x,"empty")+24,from[1],{w:600,size:28,col:"mut",a:ga*e});}});
      const pm=tt_pop(tt,P.set-0.1,null);tt_permits(x,card1[0],card1[1],{k:pm.k,a:pm.a,loaderA:ag_in(tt,P.loader-0.2,0.4),loaderK:ag_spr(tt,P.loader-0.2,0.7),byHandA:ag_in(tt,P.nobody,0.5),byHand:clamp((tt-P.nobody-0.3)/0.6,0,1)});}}]);
  dp_kicker(ctx,"Tuesday 13 October 2026",null,{a:ag_in(t,0.3,0.8)*(1-ag_in(t,P.read,0.8))});});

/* ---------------------------------------------------------------- 3 · Found, then confirmed */
const TT_L3={x:640,y:120,w:620,title:"Learner table",slot:300,rows:TT_L.rows},TT_S3={x:1290,y:120,w:570,title:"Support table",slot:300,rows:["exam_support"]};
scene("found",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({scans:c.scans,dc:wAt(sc,"scans","Data"),prop:wAt(sc,"scans","proposes"),finds:c.finds,
    f:[wAt(sc,"finds","name"),wAt(sc,"finds","email"),wAt(sc,"finds","date")],confirms:c.confirms,cf:[wAt(sc,"confirms","direct"),wAt(sc,"confirms","direct and"),wAt(sc,"confirms","indirect")],
    number:wAt(sc,"number","nothing"),support:c.support,stable:wAt(sc,"support","support table"),extra:wAt(sc,"support","extra"),knows:c.knows,special:wAt(sc,"knows","special"),
    proposes:c.proposes,decides:c.decides,adds:wAt(sc,"decides","adds")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the registrar's office: the scan's results; then the learner table, its proposals, Mei's word on each; the support table, where
    // the scan finds nothing and Mei names exam support special; last, the rest of her classes
    {at:0,place:"ttMei",keys:[[0,900,540,1.04],[P.finds-0.4,1040,500,1.08],[P.support-0.2,1150,480,1.1],[P.knows-0.3,960,540,1.0]],d:2.2,push:0.012,draw:(x,tt)=>{const [mx,my,ms]=TT_MEI;
      dp_person(x,"mei",mx,my,ms,{t:tt,cut:TT_BACK,gaze:[3,1]});
      const mn=tt_pop(tt,0.4,P.finds-1.2);tt_name(x,60,110,560,"Registrar's office","Mei Tanaka",{k:mn.k,a:mn.a});
      tt_scanPage(x,640,130,{a:ag_in(tt,P.dc-0.2,0.5)*(1-ag_in(tt,P.finds-0.8,0.5)),rowA:i=>ag_in(tt,P.prop+i*0.35,0.4)});
      const la=ag_in(tt,P.finds-0.2,0.5),dec=k=>tt_ph(tt,P.adds+k*0.18,0.5);
      tt_table(x,TT_L3,{a:la,sub:"registrar's office",hi:i=>i>=2&&i<=4?ag_io(tt,P.proposes,P.decides,0.4)*0.9:0,chip:(i,cx,cy)=>{
        if(i>=2&&i<=4){const k=i-2,pr=ag_in(tt,P.f[k],0.35),cf=tt_ph(tt,P.cf[k]-0.1,0.5);tt_chip(x,cx,cy,"proposed",{a:pr*(1-cf)});
          const cls=["direct","direct","indirect"][k];if(cf>0){tt_chip(x,cx,cy,cls,{a:cf,k:ag_spr(tt,P.cf[k]-0.1,0.6)});dp_tick(x,cx+tt_chipW(x,cls)+32,cy-12,"green",clamp((tt-P.cf[k])/0.6,0,1));}}
        else if(i===0){const nd=ag_in(tt,P.number,0.4)*(1-dec(0));dp_T(x,"no detection",cx,cy,{w:600,size:28,col:"grey",a:nd});if(dec(0)>0)tt_chip(x,cx,cy,"direct",{a:dec(0),k:ag_spr(tt,P.adds,0.6)});}
        else{const cls=i===1?"pseudonymous":"noneIce",d=dec(i<2?1:i-3);if(d>0)tt_chip(x,cx,cy,cls,{a:d,k:ag_spr(tt,P.adds+(i<2?1:i-3)*0.18,0.6)});}}});
      tt_table(x,TT_S3,{a:ag_in(tt,P.stable-0.3,0.5),chip:(i,cx,cy)=>{const sp=tt_ph(tt,P.special-0.1,0.5);dp_T(x,"no detection",cx,cy,{w:600,size:28,col:"grey",a:ag_in(tt,P.extra,0.4)*(1-sp)});
        if(sp>0)tt_chip(x,cx,cy,"special",{a:sp,k:ag_spr(tt,P.special-0.1,0.6),glow:ag_io(tt,P.adds,P.adds+1.4,0.4)});}});}}]);});

/* ---------------------------------------------------------------- 4 · Once, in the project */
const TT_PRAT=[680,110];
scene("written",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({project:wAt(sc,"project","project"),jun:c.jun,writes:wAt(sc,"jun","writes"),reviews:c.reviews,ok:wAt(sc,"reviews","reviews"),mei:wAt(sc,"reviews","Mei"),told:wAt(sc,"reviews","told"),
    build:c.build,after:wAt(sc,"build","build"),sets:wAt(sc,"build","sets"),last:c.last,fac:wAt(sc,"last","faculty"),lvl:wAt(sc,"last","confidential"),
    none:c.none,old:wAt(sc,"none","old one"),off:wAt(sc,"none","taken off"),change:c.change,next:wAt(sc,"change","next build"),start:c.start,read:wAt(sc,"start","first")}));
  const typed=i=>clamp((t-P.writes-i*0.42)/0.4,0,1);
  ag_shots(ctx,S,t,sc.dur,[
    // the data team: Jun writes each class beside its column, in GitHub; the data team reviews the code, and approves it
    {at:0,place:"ttJun",keys:[[0,960,540,1.0],[0.1,970,540,1.03]],d:10,push:0.01,draw:(x,tt)=>{const [jx,jy,js]=TT_JUN;
      dp_person(x,"jun",jx,jy,js,{t:tt,cut:TT_BACK,gaze:[3,1]});const jn=tt_pop(tt,P.jun,null);tt_name(x,60,110,560,"Analytics engineer","Jun Park",{k:jn.k,a:jn.a});
      tt_prPage(x,...TT_PRAT,{a:ag_in(tt,P.project-0.2,0.5),typed:i=>clamp((tt-P.writes-i*0.42)/0.4,0,1),reviewA:ag_in(tt,P.reviews-0.2,0.4),approved:clamp((tt-P.ok)/0.6,0,1)});}},
    // the registrar's office: the same page, approved by the data team; Mei is told what it touches. Owners never review a pull request
    {cut:true,at:P.mei-0.25,place:"ttMei",keys:[[P.mei-0.25,960,540,1.0],[P.mei,965,540,1.03]],d:6,push:0.01,draw:(x,tt)=>{const [mx,my,ms]=TT_MEI;
      dp_person(x,"mei",mx,my,ms,{t:tt,cut:TT_BACK,gaze:[3,1]});tt_name(x,60,110,560,"Registrar's office","Mei Tanaka");
      tt_prPage(x,...TT_PRAT,{reviewA:1,approved:1,told:clamp((tt-P.told)/0.5,0,1)});}},
    // the hall: dbt builds the learner table, then sets each class, the faculty tag and, last, the level; none is no tag, and an old
    // tag is taken off; a change to the file changes the tag at the next build
    {cut:true,at:P.build-0.2,place:"ttHall",keys:[[P.build-0.2,960,540,1.03],[P.start-0.2,960,540,1.0]],d:2.4,push:0.008,draw:(x,tt)=>{
      const st=[clamp((tt-P.sets)/0.6,0,1),clamp((tt-P.fac)/0.6,0,1),clamp((tt-P.lvl)/0.6,0,1)],run=1-ag_in(tt,P.start-0.4,0.6);
      tt_dbtRun(x,760,130,{a:run,built:clamp((tt-P.after)/0.6,0,1),step:i=>st[i]});
      const fl=ag_io(tt,P.next-0.4,P.next+1.2,0.3);
      tt_table(x,TT_L,{level:"confidential",levelA:ag_in(tt,P.lvl,0.3),levelK:ag_spr(tt,P.lvl,0.6),how:"Directly assigned",howA:ag_in(tt,P.sets+0.4,0.5),chip:(i,cx,cy)=>{
        const cls=TT_LCLS[i];if(i===5){tt_chip(x,cx,cy,"empty",{a:1-ag_in(tt,P.fac,0.3)});tt_level(x,cx,cy,"faculty",{a:ag_in(tt,P.fac,0.3),k:ag_spr(tt,P.fac,0.6)});return;}
        if(cls==="empty"){tt_chip(x,cx,cy,"empty",{glow:0});if(i===7){const o=tt_ph(tt,P.off-0.1,0.8),oa=ag_in(tt,P.old-0.3,0.3)*(1-o);if(oa>0)tt_chip(x,cx+o*120,cy,"indirect",{a:oa});}return;}
        const k=i,s=ag_in(tt,P.sets+k*0.18,0.25);tt_chip(x,cx,cy,"empty",{a:1-s});if(s>0){if(i===3&&fl>0){tt_chip(x,cx,cy,"direct",{a:1-fl});tt_chip(x,cx,cy,"special",{a:fl});}else tt_chip(x,cx,cy,cls,{a:s,k:ag_spr(tt,P.sets+k*0.18,0.6)});}}});
      // the change, and the next build: one line of the file, then back
      const ca=ag_io(tt,P.change-0.2,P.start-0.6,0.4);if(ca>0){x.save();x.globalAlpha*=ca;dp_panel(x,760,650,1100,120,{col:TT_ICE,r:16,glowR:24});
        dp_T(x,"- name: email",790,700,{w:500,size:28,f:"mono",col:"mut"});dp_T(x,"meta: {personal_data: direct}",1110,700,{w:500,size:28,f:"mono",a:1-fl});
        dp_T(x,"meta: {personal_data: special}",1110,700,{w:500,size:28,f:"mono",col:"violet",a:fl});dp_T(x,"the next build",790,746,{w:600,size:28,col:"mut"});x.restore();}
      // where the tags start: the first table people read
      const ws=ag_in(tt,P.read-0.4,0.6);if(ws>0){dp_halo(x,356,470,520,TT_ICE,0.14*ws);dp_slip(x,720,420,"where the tags start",TT_ICE,{ink:true,a:ws});}}}]);});

/* ---------------------------------------------------------------- 5 · The class follows */
// the study's workspace, with the copy in it (ch 5's end and ch 7): the copy, Anil's chip, Anil's table and the line between them
const TT_SC={x:170,y:250,w:590,title:"learners",titleMono:true,slot:280,rows:TT_C.rows},TT_SA={x:790,y:340,w:580,title:"first_year_progress",titleMono:true,slot:262,rows:TT_A.rows};
function tt_studies(x,tt,o){o=o||{};tt_room(x,{p:o.room==null?1:o.room,shut:o.shut||0});
  tt_table(x,TT_SC,{level:"confidential",chip:(i,cx,cy)=>tt_chip(x,cx,cy,TT_CCLS[i])});
  if(o.anilA>0){const b=tt_who(x,790,250,"Anil Kurian",{pic:"person",a:o.anilA,k:o.anilK});x.save();x.globalAlpha*=o.anilA;dp_tick(x,b.x+b.w+34,b.y+32,"green",o.may==null?1:o.may);
    dp_T(x,"may read",b.x+b.w+66,b.y+42,{w:600,size:28,col:"green",a:clamp((o.may==null?1:o.may)*1.5-0.5,0,1)});x.restore();}
  const sa=o.tableA==null?1:o.tableA;if(sa>0){const dx=(1-ag_eo(clamp(o.slide==null?1:o.slide,0,1)))*-560;
    const L=tt_link(TT_SC,0,TT_SA,0);if(o.line>0)tt_lineage(x,L,o.line,{lit:o.ride>0&&o.ride<1?1:0.3});
    tt_table(x,TT_SA,{a:sa,x:TT_SA.x+dx,chip:(i,cx,cy)=>{if(i===0&&(o.ride==null||o.ride>=1))tt_chip(x,cx,cy,"pseudonymous",{k:o.rideK});else tt_chip(x,cx,cy,"empty");}});
    if(o.ride>0&&o.ride<1){const q=tt_along(L,ag_sine(o.ride));dp_halo(x,q[0],q[1],24,TT_CLASS.pseudonymous,0.7);x.save();x.fillStyle=rgba(mix(dp_f(TT_CLASS.pseudonymous),[255,255,255],0.4),1);x.beginPath();x.arc(q[0],q[1],6,0,TAU);x.fill();x.restore();}}}
scene("follows",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({prop:wAt(sc,"on","propagation"),fac:wAt(sc,"on","faculty"),lineage:c.lineage,lin:wAt(sc,"lineage","lineage"),
    copy:c.copy,loader:wAt(sc,"copy","loader"),study:wAt(sc,"copy","study's"),health:wAt(sc,"copy","Health's"),arrive:c.arrive,code:wAt(sc,"arrive","learner code"),yob:wAt(sc,"arrive","year of birth"),
    bring:c.bring,nobody:c.nobody,see:c.see,checks:c.checks,chk:wAt(sc,"checks","checks"),conf:wAt(sc,"checks","confidential"),next:c.next,given:wAt(sc,"next","given"),
    anil:c.anil,table:wAt(sc,"anil","table"),carry:wAt(sc,"anil","carry")}));
  const R=[[1,0,P.code],[4,1,P.yob],[6,2,P.bring],[7,3,P.bring+0.3]];
  ag_shots(ctx,S,t,sc.dur,[
    // Sam turns on propagation: for personal_data, its default value special; for faculty; not for level
    {at:0,place:"ttSam",keys:[[0,960,540,1.0],[0.1,955,540,1.03]],d:7,push:0.01,draw:(x,tt)=>{const [sx,sy,ss]=TT_SAM;
      dp_person(x,"sam",sx,sy,ss,{t:tt,cut:TT_BACK,flip:true,gaze:[3,1]});tt_name(x,1290,110,560,"Data platform","Sam Okafor");
      tt_propDialog(x,60,150,{a:ag_in(tt,0.4,0.5),sw:i=>i===0?clamp((tt-P.prop-0.1)/0.5,0,1):i===1?clamp((tt-P.fac)/0.5,0,1):0,defGlow:ag_io(tt,P.prop+0.5,P.prop+2,0.4)});}},
    // the hall: lineage from the learner table; at 15:40 the loader makes the study's copy, and within minutes the classes arrive along
    // the lines, with nobody tagging it; a policy reads only tags; Mei checks them and gives the copy its level
    {cut:true,at:P.lineage-0.2,place:"ttHall",keys:[[P.lineage-0.2,960,540,1.0],[P.lineage,960,540,1.0]],d:2.4,push:0.008,draw:(x,tt)=>{
      tt_table(x,TT_L,{level:"confidential",how:"Directly assigned",chip:(i,cx,cy)=>{if(i===5)tt_level(x,cx,cy,"faculty");else tt_chip(x,cx,cy,TT_LCLS[i]);}});
      const ca=ag_in(tt,P.study-0.2,0.6),cs=(1-ag_eo(clamp((tt-P.study+0.2)/1.0,0,1)))*120;
      // before the copy: lineage drawn towards where it will stand, dashed, the copy a dashed outline
      const gh=ag_in(tt,P.lin-0.2,0.6)*(1-ca);if(gh>0){x.save();x.globalAlpha*=gh;x.setLineDash([10,8]);x.strokeStyle=rgba(TT_ICE,0.6);x.lineWidth=2;rr(x,TT_C.x,TT_C.y,TT_C.w,tt_tableH(TT_C),18);x.stroke();x.restore();}
      R.forEach(([i,j,t0])=>{const L=tt_link(TT_L,i,TT_C,j),u=clamp((tt-t0+0.2)/1.4,0,1);
        tt_lineage(x,L,tt_ph(tt,P.lin-0.2+i*0.1,1.4),{lit:u>0&&u<1?1:ag_io(tt,P.see,P.see+1.8,0.3)*0.5,a:Math.max(gh,ca)*(j<2?1:0.8),dash:ca<0.5?[10,8]:null});});
      const pol=clamp((tt-P.see-0.2)/1.8,0,1),tk=k=>clamp((tt-P.chk-k*0.3)/0.6,0,1);
      tt_table(x,TT_C,{a:ca,x:TT_C.x+cs,level:"confidential",levelA:ag_in(tt,P.conf,0.3),levelK:ag_spr(tt,P.conf,0.6),how:"Propagated",howA:ag_in(tt,P.code+1.3,0.5),chip:(i,cx,cy)=>{
        const r=R.find(q=>q[1]===i),u=clamp((tt-r[2]+0.2)/1.4,0,1),gl=pol>0&&pol<1?ag_io(pol,i*0.22,i*0.22+0.25,0.08):0;
        if(i<2&&u>=1){tt_chip(x,cx,cy,TT_CCLS[i],{k:ag_spr(tt,r[2]+1.2,0.5),glow:gl});dp_tick(x,cx+tt_chipW(x,TT_CCLS[i])+32,cy-12,"green",tk(i));}else tt_chip(x,cx,cy,"empty",{glow:0});}});
      R.slice(0,2).forEach(([i,j,t0])=>{const u=clamp((tt-t0+0.2)/1.4,0,1);if(u>0&&u<1)tt_ride(x,tt_link(TT_L,i,TT_C,j),u,TT_CCLS[j],tt_slot(TT_C,j),{});});
      // the policy that will read the tags: a dashed frame running down the copy's rows
      if(pol>0&&pol<1){const fy=lerp(tt_rowY(TT_C,0)-44,tt_rowY(TT_C,3)-44,ag_sine(pol));x.save();x.globalAlpha*=ag_io(pol,0,0.92,0.08);x.setLineDash([9,7]);x.strokeStyle=rgba(DP.F.violet,0.95);x.lineWidth=2.4;rr(x,TT_C.x+12,fy,TT_C.w-24,56,10);x.stroke();x.restore();}
      tt_note(x,684,786,"a policy reads only tags",{a:ag_io(tt,P.see+0.2,P.checks-0.3,0.4)});
      const lo=tt_pop(tt,P.loader-0.2,P.see-0.3);tt_who(x,684,216,"registrar-loader",{pic:"gear",mono:true,a:lo.a,k:lo.k});
      dp_tag(x,684,140,"2,614 learners · Faculty of Health",TT_ICE,{a:ag_in(tt,P.health,0.5)});
      const me=tt_pop(tt,P.checks,null);tt_who(x,684,786,"Mei Tanaka",{pic:"person",a:me.a,k:me.k});}},
    // the next day: the study's workspace, with the copy in it; Anil may read it; the table he makes carries the same classes
    {cut:true,at:P.next-0.2,place:"ttStudies",keys:[[P.next-0.2,960,540,1.0],[P.next,960,540,1.02]],d:6,push:0.01,draw:(x,tt)=>{const an=tt_pop(tt,P.given+0.4,null);
      tt_studies(x,tt,{room:tt_ph(tt,P.next-0.1,1.4),anilA:an.a,anilK:an.k,may:clamp((tt-P.given-1.0)/0.6,0,1),tableA:ag_in(tt,P.table-0.3,0.4),slide:clamp((tt-P.table+0.3)/1.0,0,1),
        line:tt_ph(tt,P.table+0.4,0.8),ride:clamp((tt-P.carry+0.4)/1.4,0,1),rideK:ag_spr(tt,P.carry+1.0,0.5)});}}]);
  const k5=ag_in(t,P.copy-0.3,0.6)*(1-ag_in(t,P.next-0.4,0.3));if(k5>0)dp_kicker(ctx,"Tuesday 13 October · 15:40",null,{a:k5,x:684,y:98});
  const k6=ag_in(t,P.next,0.6);if(k6>0)dp_kicker(ctx,"Wednesday 14 October",null,{a:k6});});

/* ---------------------------------------------------------------- 6 · Two values for one tag */
// a small pane with a table's name and its level, for the join of two levels
function tt_lvlPane(x,px,py,w,name,lvl,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0.003))return;x.save();x.globalAlpha*=a;dp_panel(x,px,py,w,96,{col:TT_ICE,r:18,glowR:30});
  dp_T(x,name,px+28,py+60,{w:700,size:32});if(lvl)tt_level(x,px+w-24,py+60,lvl,{align:"right",a:o.lvlA});else{x.save();x.setLineDash([8,7]);x.strokeStyle=rgba(TT_ICE,0.8);x.lineWidth=2;rr(x,px+w-184,py+24,160,48,12);x.stroke();x.restore();}x.restore();}
scene("conflict",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({never:c.never,suppose:c.suppose,code:wAt(sc,"suppose","code"),student:wAt(sc,"suppose","student"),
    bring:c.bring,direct:wAt(sc,"bring","direct"),file:wAt(sc,"file","file"),ps:wAt(sc,"file","pseudonymous"),two:wAt(sc,"two","two"),conflict:wAt(sc,"two","conflict"),
    special:wAt(sc,"default","special"),advance:wAt(sc,"default","advance"),mixed:c.mixed,wrong:wAt(sc,"wrong","wrong"),passes:wAt(sc,"wrong","passes"),once:c.once,
    owner:wAt(sc,"once","owner"),beside:c.beside,every:wAt(sc,"beside","every"),level:c.level,join:c.join,would:wAt(sc,"join","conflict"),call:c.call}));
  const sup=ag_in(t,P.suppose,0.5)*(1-ag_in(t,P.once,0.6)),slot=tt_slot(TT_C,0),aslot=tt_slot(TT_A,0);
  ag_shots(ctx,S,t,sc.dur,[
    // the hall: suppose the copy made the code from the student number: lineage brings direct, Mei's file says pseudonymous; the two
    // wait at the copy's edge, a conflict; the column takes the value set in advance, special, and passes it on; so the code is made
    // once, at the source, by its owner, and every table after takes it
    {at:0,place:"ttHall",keys:[[0,960,540,1.0]],d:2.6,push:0.006,draw:(x,tt)=>{
      tt_table(x,TT_L,{level:"confidential",how:"Directly assigned",hi:i=>i<2?ag_io(tt,P.beside,P.level-0.6,0.4):0,chip:(i,cx,cy)=>{if(i===5)tt_level(x,cx,cy,"faculty");
        else tt_chip(x,cx,cy,TT_LCLS[i],{glow:i===1?ag_io(tt,P.once+0.3,P.beside+0.4,0.4):0});}});
      const back=ag_in(tt,P.every,0.4),codeRide=clamp((tt-P.every-0.2)/1.4,0,1),aRide=clamp((tt-P.every-1.4)/1.2,0,1);
      // the lines as they are: dim while we suppose; the code's line lit again when every table takes the code
      [[1,0],[4,1],[6,2],[7,3]].forEach(([i,j])=>tt_lineage(x,tt_link(TT_L,i,TT_C,j),1,{lit:i===1?ag_io(tt,P.every-0.2,P.every+2.4,0.4):ag_io(tt,P.never,P.never+1.6,0.4)*0.6,a:i===1?1-sup*0.85:1-sup*0.7}));
      const AL=tt_pathL([TT_C.x,tt_rowY(TT_C,0)-12],[TT_A.x,tt_rowY(TT_A,0)-12]);tt_lineage(x,AL,1,{lit:ag_io(tt,P.passes-0.2,P.passes+1.6,0.3)+(aRide>0&&aRide<1?1:0),a:1-sup*0.4});
      // the copy's code: pseudonymous; empty while we suppose, then special, the value set in advance; empty again until it rides back
      const dRide=clamp((tt-P.direct+1.0)/1.2,0,1),pFly=clamp((tt-P.ps-0.2)/0.9,0,1),def=tt_ph(tt,P.special-0.3,0.8),wr=tt_ph(tt,P.wrong-0.2,0.7)*(1-ag_in(tt,P.once-0.6,0.5));
      const cPs=back>0?(codeRide>=1?1:0):(1-sup)*(tt<P.once?1:0),cSp=def>=1?sup:0;
      tt_table(x,TT_C,{level:"confidential",how:"Propagated",chip:(i,cx,cy)=>{if(i>0){tt_chip(x,cx,cy,TT_CCLS[i]);return;}
        tt_chip(x,cx,cy,"empty",{a:1-Math.max(cPs,cSp)});if(cPs>0)tt_chip(x,cx,cy,"pseudonymous",{a:cPs,k:back>0?ag_spr(tt,P.every+1.4,0.5):null});
        if(cSp>0)tt_chip(x,cx,cy,"special",{a:cSp,k:ag_spr(tt,P.special+0.5,0.6)});}});
      if(sup>0.02){x.save();x.globalAlpha*=sup;const dW=tt_chipW(x,"direct"),pW=tt_chipW(x,"pseudonymous"),pkD=[TT_C.x-20-dW,slot[1]],pkP=[TT_C.x-20-pW,slot[1]+62],dim=1-def;
        const sp=tt_pop(tt,P.suppose,null);dp_card(x,668,96,520,{kick:"Suppose",title:"the copy makes the code",sub:"from the student number"},{col:TT_ICE,k:sp.k,a:sp.a});
        // lineage from the student number brings its class, which waits at the copy's edge
        const SL=tt_path([TT_L.x+TT_L.w,tt_rowY(TT_L,0)-12],[TT_C.x,tt_rowY(TT_C,0)-12]);tt_lineage(x,SL,tt_ph(tt,P.student-0.1,1.0),{dash:[10,8],lit:dRide>0&&dRide<1?1:0.4});
        const out=1-ag_in(tt,P.wrong-0.4,0.5);
        if(dRide>0&&dRide<1)tt_ride(x,SL,dRide,"direct",pkD,{});else if(dRide>=1)tt_chip(x,pkD[0],pkD[1],"direct",{a:dim*out});
        // Mei's file says pseudonymous: it waits beside it
        const mf=tt_pop(tt,P.file-0.2,P.special),fb=dp_slip(x,678,520,"Mei's file says",TT_ICE,{ink:true,a:mf.a}),p0=[fb.x+fb.w+12,fb.y+fb.h/2+12];
        if(pFly<1){const q=tt_arc(p0,pkP,pFly,40);if(mf.a>0)tt_chip(x,q[0],q[1],"pseudonymous",{a:mf.a});}else tt_chip(x,pkP[0],pkP[1],"pseudonymous",{a:dim*out});
        // two values for one tag: a conflict
        const fr=tt_ph(tt,P.two-0.1,0.6)*(1-def),x0=pkP[0]-14,y0=slot[1]-50,x1=TT_C.x-6,y1=slot[1]+62+26;
        if(fr>0){x.save();x.globalAlpha*=fr;x.strokeStyle=rgba(DP.F.coral,1);x.lineWidth=2.6;x.shadowColor=rgba(DP.F.coral,0.8);x.shadowBlur=12;rr(x,x0,y0,x1-x0,y1-y0,18);x.stroke();x.restore();}
        dp_pill(x,x0-14,slot[1]+34,"conflict","coral",{align:"right",a:ag_in(tt,P.conflict-0.2,0.4)*(1-def)});
        // the value set in advance, special, goes in
        const ad=ag_in(tt,P.advance-0.3,0.4)*out,ab=dp_slip(x,700,440,"set in advance",TT_ICE,{ink:true,a:ad}),s0=[ab.x+ab.w+16,ab.y+ab.h/2+12];
        if(def<1&&ad>0){const q=tt_arc(s0,slot,def,60);if(def>0&&def<1)dp_halo(x,q[0]+60,q[1]-12,70,"violet",0.3);tt_chip(x,q[0],q[1],"special",{a:ad});}
        // like the bin of mixed wood: a rule set before anything is mixed
        const mw=tt_pop(tt,P.mixed,P.wrong-0.4);tt_thumb(x,700,540,420,236,"ttChain",{view:[1210,600,340,191],k:mw.k,a:mw.a,label:"mixed · by a rule set in advance"});
        // the wrong thing, passed on
        if(wr>0)tt_ring(x,slot[0]-6,slot[1]-42,tt_chipW(x,"special")+12,60,wr,{});
        x.restore();}
      // the second table: its code from the copy's; while we suppose, empty, then special passed on; then pseudonymous again
      const apass=clamp((tt-P.passes+0.2)/1.2,0,1),aPs=back>0?(aRide>=1?1:0):(1-sup)*(tt<P.once?1:0),aSp=apass>=1?sup:0;
      tt_table(x,TT_A,{chip:(i,cx,cy)=>{if(i>0){tt_chip(x,cx,cy,"empty");return;}tt_chip(x,cx,cy,"empty",{a:1-Math.max(aPs,aSp)});
        if(aPs>0)tt_chip(x,cx,cy,"pseudonymous",{a:aPs,k:back>0?ag_spr(tt,P.every+2.4,0.5):null});if(aSp>0)tt_chip(x,cx,cy,"special",{a:aSp});}});
      if(sup>0.02&&apass>0&&apass<1)tt_ride(x,AL,apass,"special",aslot,{a:sup,left:true});
      if(back>0&&codeRide>0&&codeRide<1)tt_ride(x,tt_link(TT_L,1,TT_C,0),codeRide,"pseudonymous",slot,{});
      if(back>0&&aRide>0&&aRide<1)tt_ride(x,AL,aRide,"pseudonymous",aslot,{left:true});
      // made once, at the source, by its owner; the key the code is made with, kept by the registrar's office, never shown
      const ow=tt_pop(tt,P.owner-0.1,P.level-0.6);tt_who(x,700,640,"Mei Tanaka",{pic:"person",a:ow.a,k:ow.k});
      const ky=tt_pop(tt,P.beside+0.3,P.level-0.6);dp_sealed(x,690,196,520,"The key",{sub:"kept by the registrar's office",a:ky.a});}},
    // a level doesn't travel: a public table and a confidential one joined, and what's made from them would be a conflict; each
    // table's level stays its owner's call
    {at:P.level-0.3,later:true,dis:0.5,place:"ttHall",keys:[[P.level-0.3,960,540,1.0],[P.level,960,540,1.02]],d:8,push:0.008,draw:(x,tt)=>{
      const lv=tt_pop(tt,P.level+0.2,null);dp_card(x,560,130,800,{kick:"Propagation",title:"A level never travels"},{col:TT_ICE,k:lv.k,a:lv.a});
      const j=tt_ph(tt,P.join+0.2,1.2),pa=ag_in(tt,P.level+0.6,0.5);
      const lx=lerp(240,460,j);tt_lvlPane(x,lx,420,540,"Timetable","public",{a:pa});tt_lvlPane(x,lx,560,540,"Learner table","confidential",{a:pa});
      const ma=ag_in(tt,P.join+1.2,0.5),mxx=lerp(1000,1140,tt_ph(tt,P.join+1.2,0.8));
      if(ma>0){dp_link(x,[lx+540,468],[mxx,526],TT_ICE,ma,{lw:2.4,dot:false,alpha:0.8});dp_link(x,[lx+540,608],[mxx,554],TT_ICE,ma,{lw:2.4,dot:false,alpha:0.8});}
      tt_lvlPane(x,mxx,492,600,"Made from both",null,{a:ma});
      const wc=tt_ph(tt,P.would-0.2,0.7);if(wc>0)tt_ring(x,mxx+600-184,516,160,48,wc,{label:"would conflict",lx:mxx+496,ly:636});
      const mc=tt_pop(tt,P.call-0.2,null);tt_who(x,mxx+600-430,710,"Mei Tanaka",{pic:"person",a:mc.a,k:mc.k});
      if(mc.a>0){x.save();x.globalAlpha*=mc.a;dp_T(x,"its owner's call",mxx+600-430,808,{w:600,size:28,col:"mut"});x.restore();}}}]);});

/* ---------------------------------------------------------------- 7 · What doesn't travel */
scene("stays",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({inside:c.inside,file:c.file,notag:wAt(sc,"file","no tag"),off:c.off,sw:wAt(sc,"off","switched"),
    follow:c.follow,tables:wAt(sc,"follow","into tables"),totals:c.totals,counted:wAt(sc,"totals","counted"),nothing:c.nothing,pub:c.public,mei:wAt(sc,"public","Mei"),pl:wAt(sc,"public","public")}));
  ag_shots(ctx,S,t,sc.dur,[
    // the studies' workspace: a file downloaded leaves through the door and its tags fall off at the glass; downloads off, the door
    // frosts shut; inside, tags travel only where lineage can follow; Anil's totals carry no class, and Mei makes them public
    {at:0,place:"ttStudies",keys:[[0,960,540,1.0],[0.1,965,540,1.02]],d:10,push:0.01,draw:(x,tt)=>{const sh=tt_ph(tt,P.sw,0.9);
      tt_studies(x,tt,{shut:sh,anilA:1});
      if(ag_io(tt,P.inside,P.inside+1.6,0.4)>0)dp_halo(x,800,520,820,TT_ICE,0.12*ag_io(tt,P.inside,P.inside+1.6,0.4));
      // the file: from Anil's table, out through the door
      const fu=tt_ph(tt,P.file-0.1,2.4),fx=lerp(900,1520,fu),fy=lerp(470,640,fu),drop=clamp((fx-1420)/100,0,1);
      tt_file(x,fx,fy,"progress.csv",{a:ag_in(tt,P.file-0.3,0.4)*(1-ag_in(tt,P.sw+0.6,0.6)),cls:["pseudonymous"],drop,ring:tt_ph(tt,P.notag,0.7)});
      dp_pill(x,TT_ROOM.door[0]+TT_ROOM.door[2]/2,300,"Downloads · off","coral",{align:"center",a:ag_in(tt,P.sw-0.3,0.5)});
      const fl=tt_pop(tt,P.tables-0.4,null);dp_card(x,170,600,560,{kick:"Tags travel into",title:"tables and views",sub:"made on serverless compute"},{col:TT_ICE,k:fl.k,a:fl.a});
      // the totals: counted from course and results, which carry no class; nothing rides in
      const ta=ag_in(tt,P.counted-0.4,0.5),tb=dp_card(x,790,600,640,{kick:"Left after first year",title:"Nursing 38 · Public health 21",sub:"Faculty of Health 80 · counts under 10 hidden"},{col:TT_ICE,a:ta,k:ag_spr(tt,P.counted-0.4,0.7)});
      if(ta>0)dp_link(x,[1070,TT_SA.y+tt_tableH(TT_SA)],[1070,600],TT_ICE,tt_ph(tt,P.nothing-0.4,0.8),{lw:2.4,alpha:0.7*ta,dot:false});
      tt_level(x,tb.x+tb.w-24,tb.y+56,"public",{align:"right",a:ag_in(tt,P.pl,0.3),k:ag_spr(tt,P.pl,0.6)});
      const me=tt_pop(tt,P.mei-0.1,null);tt_who(x,1610,600,"Mei Tanaka",{pic:"person",a:me.a,k:me.k});}}]);});

/* ---------------------------------------------------------------- 8 · Every link in the chain */
scene("chain",(ctx,S,t,sc)=>{const c=sc.cues,P=tt_once(sc,"P",()=>({once:c.once,named:wAt(sc,"once","once"),carries:c.carries,two:wAt(sc,"carries","where two"),next:c.next,reads:wAt(sc,"next","reads"),fin:c.tag-0.15}));
  ag_shots(ctx,S,t,sc.dur,[
    // the chain, from the shop's chair back to the forest, each tick lit as the camera passes it; the label goes as the camera leaves
    // the shop, before the frame's edge reaches it
    {at:0,place:"ttChain",keys:[[0,1258,600,1.45],[0.6,662,600,1.45]],d:6.4,push:0,draw:(x,tt)=>{const cam=lerp(1258,662,easeCam(clamp((tt-0.6)/6.4,0,1)));
      tt_ticks(x,4,{glow:k=>{const sx=TT_ST[k][0],d=Math.abs(cam-sx+120);return clamp(1-d/220,0,1);}});tt_hangTag(x,1180,300,[1650,700],{glow:ag_io(tt,0.3,2.2,0.5),a:1-ag_in(tt,2.4,0.8)});}},
    // the hall: each class named once at the source; carried into every table made from it; where two meet, a value set in advance;
    // and next, one policy will read the tags wherever they land
    {cut:true,at:P.once-0.2,place:"ttHall",keys:[[P.once-0.2,960,540,1.0],[P.once,960,540,1.02]],d:8,push:0.008,draw:(x,tt)=>{const go=1-ag_in(tt,P.fin-0.1,0.9);if(go<=0)return;x.save();x.globalAlpha*=go;
      const gl=0.6*ag_io(tt,P.named-0.2,P.named+1.2,0.4),run=k=>clamp((tt-P.carries-0.3-k*0.25)/1.4,0,1),fr=k=>clamp((tt-P.reads+0.2-k*0.06)/0.6,0,1);
      const frame=(cx,cy,cls,k)=>{const p=fr(k);if(p<=0)return;const w=tt_chipW(x,cls)+20;x.save();x.globalAlpha*=p*(1-ag_in(tt,P.fin-0.3,0.4));x.setLineDash([8,6]);x.strokeStyle=rgba(DP.F.violet,0.95);x.lineWidth=2;rr(x,cx-10,cy-46,w,68,14);x.stroke();x.restore();};
      tt_table(x,TT_L,{level:"confidential",how:"Directly assigned",chip:(i,cx,cy)=>{if(i===5){tt_level(x,cx,cy,"faculty");return;}const cls=TT_LCLS[i];tt_chip(x,cx,cy,cls,{glow:cls!=="empty"?gl:0});if(cls!=="empty")frame(cx,cy,cls,i);}});
      [[1,0],[4,1],[6,2],[7,3]].forEach(([i,j],k)=>{const L=tt_link(TT_L,i,TT_C,j),u=run(k);tt_lineage(x,L,1,{lit:u>0&&u<1?1:0.2});if(u>0&&u<1){const q=tt_along(L,u);dp_halo(x,q[0],q[1],40,TT_ICE,0.6);}});
      const AL=tt_pathL([TT_C.x,tt_rowY(TT_C,0)-12],[TT_A.x,tt_rowY(TT_A,0)-12]),au=clamp((tt-P.carries-1.4)/1.2,0,1);tt_lineage(x,AL,1,{lit:au>0&&au<1?1:0.2});
      tt_table(x,TT_C,{level:"confidential",how:"Propagated",chip:(i,cx,cy)=>{const cls=TT_CCLS[i];tt_chip(x,cx,cy,cls,{glow:cls!=="empty"?ag_io(tt,P.carries+1.5+i*0.25,P.carries+2.6,0.3):0});if(cls!=="empty")frame(cx,cy,cls,8+i);}});
      tt_table(x,TT_A,{chip:(i,cx,cy)=>{const cls=TT_ACLS[i];tt_chip(x,cx,cy,cls,{glow:cls!=="empty"?ag_io(tt,P.carries+2.6,P.carries+3.6,0.3):0});if(cls!=="empty")frame(cx,cy,cls,12);}});
      // where two meet: the value set in advance
      const tw=tt_pop(tt,P.two-0.2,P.reads-0.4);dp_slip(x,700,140,"where two meet: set in advance",TT_ICE,{ink:true,a:tw.a});if(tw.a>0)tt_chip(x,700,264,"special",{a:tw.a,k:tw.k});
      const nx=tt_pop(tt,P.reads-0.1,null);dp_slip(x,700,140,"next: one policy reads the tags",DP.F.violet,{ink:true,a:nx.a*(1-ag_in(tt,P.fin-0.3,0.4))});x.restore();}}]);
  dp_end(ctx,S,t,P.fin,TT_TITLE,"Tag once at the source; the tag follows the data.","Film 5 of 8","Only what you may see");
  if(t>P.fin)dp_T(ctx,"Next: One policy for many tables",960,790,{w:600,size:28,align:"center",col:"mut",a:ag_in(t,P.fin+1.4,0.8)});});

ag_cutInto(["governed","found","written","follows","conflict","stays","chain"]);
