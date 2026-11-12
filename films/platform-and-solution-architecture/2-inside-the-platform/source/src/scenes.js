/* ===== Inside the platform: scenes =====
   Ten chapters, as in ../script.md. Japan in the early 1600s: the Tōkaidō and its stations, each with the same parts (an office that
   finds horses and porters, a clerk who writes each one down, inns), a load moved onto fresh horses at each stage; then the one stage
   that was different, Odawara to Mishima over the Hakone mountains, climbed by the same horses and porters, until the shogunate founds
   a station on the mountain in 1618 and the stage becomes two. Then the utility: Ravi Menon draws the data platform by its parts
   before its products, a reference architecture: four along the way the data goes, four across them all, a product under each, and
   nothing under observe; the platform's own records nobody reads, and a bill up by half that nobody can explain; whose part it is,
   as the station on the mountain was the road owner's; the platform watching itself; the data practice on the map; and the station
   again, two and a half centuries on.
   Made to read on a phone (tools/legible.py): text is at least 28 px in the frame, and what's drawn small is texture. Motion: every
   shot drifts slowly and things arrive with a spring; the drawing stays put from chapter to chapter, its camera gliding on
   (CHAPTER_JOINS, at the end), and between rooms the whole picture dissolves. Sound: every effect in tools/score.py fires at the
   same moment as the thing it belongs to here, so keep the two in step. */

/* ---------- shared by the chapters ---------- */
// the eight parts: four along the way the data goes, four across them all, each with what it does
const P2_ALONG=[["bring in","files, tables, streams"],["store","once, in an open format"],["process","clean, join, build"],["serve","reports, apps, systems"]];
const P2_ACROSS=[["catalogue and govern","what it means · who owns it · who may use it"],["secure","who's asking · what they may reach · every request checked"],["orchestrate","what runs · in what order · when"],["observe","does it all run well · what does it cost"]];
// the product under each part (a logo where it has one), and what observe gets in the end
const P2_PROD=[[["Lakeflow Connect","databricks"]],[["Delta Lake",null],["cloud storage",null]],[["Lakeflow pipelines","databricks"],["dbt","dbt"]],[["Databricks SQL","databricks"],["reporting tool",null]],
  [["Unity Catalog","databricks"]],[["identity provider",null],["network",null],["catalogue permissions","databricks"]],[["Lakeflow Jobs","databricks"]],[]];
const P2_OBS=[["system tables","databricks"],["dashboard","databricks"],["budgets","databricks"]];
const P2_SRC=["billing","meters","network map"],P2_OUT=["reports","dashboards","apps","other systems"];
// where the drawing's parts sit: four boxes along the top, the products under them, and four bands across
const P2_BX=i=>120+i*425,P2_BY=226,P2_BW=405,P2_BH=130,P2_CY=[389,445],P2_RY=j=>488+j*86,P2_RX=120,P2_RW=1680,P2_RH=74;
// the utility's domains, as An application or a platform? drew them, and their owners in the business
const P2_DOM=[["network",APPC,"Grace"],["retail",APPC,"head of retail"],["finance",APPC,"head of finance"],["enterprise",[176,196,255],"Ama"]];
const P2_CAPS=["bring in","store","process","serve","govern","secure","orchestrate","observe"];
// the utility's room: dark, quiet, a few motes; and the plain dark a room leaves into, under a title or the end card
function p2_room(ctx,S,t){setScreen(ctx,S);bg2(ctx);motes(ctx,t,{n:40,col:[150,190,255]});}
function p2_base(ctx,S){setScreen(ctx,S);ctx.fillStyle="rgb(3,5,11)";ctx.fillRect(0,0,W,H);}
// a light that travels along a path, with a fading trail: a load, a household, a record
function p2_runner(ctx,pts,u,col,o){o=o||{};if(u<=0)return;const tr=o.trail||0.08,n=12,r=o.r||6;for(let i=n;i>=0;i--){const uu=u-tr*i/n;if(uu<0)continue;const[x,y]=psaAlong(pts,uu);withA(ctx,(1-i/n)*0.7,()=>{ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r*(1-i/n*0.6),0,TAU);ctx.fill();});}
  const[x,y]=psaAlong(pts,Math.min(u,1));glow(ctx,x,y,r*6,col,0.55);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();return[x,y];}
// how far someone has walked by t, who sets off at t0 and stops at t1 (each over half a second, so their feet hold), at v px a second;
// and how much of a stride they're taking (amp, for psaHorse and psaWalker)
function p2_go(t,t0,t1,v){const e=0.5;if(t<=t0)return[0,0];const a=Math.min(t,t1)-t0;let d,amp;
  if(a<e){d=v*a*a/(2*e);amp=a/e;}else{d=v*(e/2+(a-e));amp=1;}
  if(t>t1-e){const b=clamp(t-(t1-e),0,e);d-=v*b*b/(2*e);amp=Math.min(amp,1-b/e);}if(t>=t1)amp=0;return[d,clamp(amp,0,1)];}

/* ---------- the drawing: the platform's parts, and a product under each ---------- */
// a product, as a small pill under the part it does: its logo, if it has one, and its name. o.dash draws an empty slot instead
function p2_chipW(ctx,name,k,sz){return 30+(k?40:0)+(name?tw(ctx,name,sz||28,700):0);}
function p2_chip(ctx,x,y,name,k,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||28,w=o.w||p2_chipW(ctx,name,k,sz),h=46,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;if(a<=0.01)return w;
  withA(ctx,a,()=>{const col=o.col||TECC;if(o.dash){ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.4;ctx.setLineDash([9,7]);rr(ctx,X,y-h/2,w,h,h/2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
      if(o.hi)glow(ctx,X+w/2,y,w*0.6,col,0.16*o.hi);if(name)T(ctx,name,X+w/2,y+sz*0.36,{w:700,size:sz,align:"center",color:rgba(col,1)});return;}
    glass(ctx,X,y-h/2,w,h,h/2,col,{glow:8+12*(o.hi||0),ea:0.7,fill:"rgba(8,16,14,0.94)"});let tx=X+15;
    if(k){logo(ctx,k,X+13,y-15,30);tx+=40;}if(name)T(ctx,name,tx,y+sz*0.36,{w:700,size:sz,color:rgba(INK,0.96)});});return w;}
// one part: a dashed outline while it's only a place, then a box in the technology layer's green
function p2_part(ctx,x,y,w,h,k,hi,col){col=col||TECC;if(k<0.99){ctx.save();ctx.globalAlpha*=1-k;ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=2.2;ctx.setLineDash([10,8]);rr(ctx,x,y,w,h,16);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
  if(k>0.01)withA(ctx,k,()=>{glass(ctx,x,y,w,h,16,col,{glow:10+16*(hi||0),ea:0.8,fill:"rgba(6,14,10,0.95)"});ctx.fillStyle=rgba(col,0.07+0.08*(hi||0));rr(ctx,x,y,w,h,16);ctx.fill();});}
// the products of part i (0 to 3 along, 4 to 7 across) as pills, under its box or at the right of its band; returns where each sits
function p2_prods(ctx,i,L,p,o){o=o||{};const out=[];if(i<4){const cx=P2_BX(i)+P2_BW/2;L.forEach(([n,k],r)=>{const q=clamp(p*L.length-r,0,1);if(q>0.01)p2_chip(ctx,cx,P2_CY[r],n,k,{align:"center",a:q,hi:o.hi});out.push([cx,P2_CY[r]]);});}
  else{const y=P2_RY(i-4)+P2_RH/2,pp=clamp((p-0.3)/0.7,0,1);let x=P2_RX+P2_RW-22;for(let r=L.length-1;r>=0;r--){const[n,k]=L[r],w=p2_chipW(ctx,n,k,28),q=clamp(pp*L.length-r,0,1);if(q>0.01)p2_chip(ctx,x,y,n,k,{align:"right",a:q,hi:o.hi});out.unshift([x-w/2,y]);x-=w+14;}}
  return out;}
// The drawing, every part where it stays from chapter to chapter. o: frame (the header and frame), out (the outlines drawn in),
// name[i] (each part named), sub[i] (what it does), prod[i] (its products), slot (empty slots for products), swap (products
// changing in three slots), miss (the empty slot under observe, lit), nothing (observe's "nothing"), obs (its three pills at last),
// hi[i], dim[i] (a part let fade so something else can speak), src and dst (the sources and the uses), rec (one record through
// the four), refName.
function p2_ref(ctx,t,o){o=o||{};const A=o.a==null?1:o.a;if(A<=0.01)return;withA(ctx,A,()=>{
  const fr=o.frame==null?1:o.frame,nm=o.name||[],sb=o.sub||[],pr=o.prod||[],hi=o.hi||[],sl=o.slot||0,dim=o.dim||[],D=i=>1-(dim[i]||0);
  if(fr>0.01)withA(ctx,fr,()=>{T(ctx,"the data platform",120,112,{f:"mono",w:500,size:28,color:rgba(TECC,1)});ctx.save();ctx.strokeStyle=rgba(TECC,0.3);ctx.lineWidth=1.6;rr(ctx,96,212,1728,624,22);ctx.stroke();ctx.restore();});
  if((o.refName||0)>0.01)withA(ctx,o.refName,()=>T(ctx,"a reference architecture",1800,112,{f:"mono",w:500,size:28,align:"right",color:rgba(SOFT,1)}));
  const sw=o.swap==null?-1:o.swap;
  // four along the way
  for(let i=0;i<4;i++){const q=o.out==null?1:clamp(o.out*8-i,0,1);if(q<=0.01)continue;const x=P2_BX(i),k=clamp(nm[i]||0,0,1);
    withA(ctx,q*D(i),()=>{p2_part(ctx,x,P2_BY,P2_BW,P2_BH,k,hi[i]||0);
      if(k>0.01)withA(ctx,k,()=>T(ctx,P2_ALONG[i][0],x+P2_BW/2,P2_BY+58,{w:800,size:36,align:"center",color:rgba(INK,0.97)}));
      if((sb[i]||0)>0.01)withA(ctx,sb[i],()=>T(ctx,P2_ALONG[i][1],x+P2_BW/2,P2_BY+102,{w:600,size:28,align:"center",color:rgba(SOFT,1)}));
      const p=clamp(pr[i]||0,0,1);if(sl>0.01&&p<0.99)p2_chip(ctx,x+P2_BW/2,P2_CY[0],"",null,{dash:true,w:230,align:"center",a:sl*(1-p)*0.55,col:TECC});
      if(sw>=0&&(i===1||i===2))p2_swap(ctx,x+P2_BW/2,P2_CY[0],sw,i);
      if(p>0.01)p2_prods(ctx,i,P2_PROD[i],p,{hi:hi[i]});});}
  // four across them all
  for(let j=0;j<4;j++){const i=4+j,q=o.out==null?1:clamp(o.out*8-i,0,1);if(q<=0.01)continue;const y=P2_RY(j),k=clamp(nm[i]||0,0,1);
    withA(ctx,q*D(i),()=>{p2_part(ctx,P2_RX,y,P2_RW,P2_RH,k,hi[i]||0);
      if(k>0.01)withA(ctx,k,()=>T(ctx,P2_ACROSS[j][0],P2_RX+30,y+P2_RH/2+11,{w:800,size:32,color:rgba(INK,0.97)}));
      const p=clamp(pr[i]||0,0,1),ob=j===3?Math.max(o.nothing||0,o.obs||0):0,sbA=(sb[i]||0)*(1-clamp(p*4,0,1))*(1-ob);
      if(sbA>0.01)withA(ctx,sbA,()=>T(ctx,P2_ACROSS[j][1],P2_RX+430,y+P2_RH/2+10,{w:600,size:28,color:rgba(SOFT,1)}));
      if(sl>0.01&&p<0.99&&ob<0.99)p2_chip(ctx,P2_RX+P2_RW-22,y+P2_RH/2,"",null,{dash:true,w:230,align:"right",a:sl*(1-Math.max(p,ob))*0.55,col:TECC});
      if(sw>=0&&j===0)p2_swap(ctx,P2_RX+P2_RW-22-115,y+P2_RH/2,sw,5);
      if(j===3&&(o.miss||0)>0.01)p2_chip(ctx,P2_RX+P2_RW-22,y+P2_RH/2,"",null,{dash:true,w:230,align:"right",a:o.miss,col:PSC,hi:o.miss});
      if(p>0.01)p2_prods(ctx,i,P2_PROD[i],p,{hi:hi[i]});
      if(j===3){const nA=(o.nothing||0)*(1-(o.obs||0));if(nA>0.01)p2_chip(ctx,P2_RX+P2_RW-22,y+P2_RH/2,"nothing",null,{dash:true,w:230,align:"right",a:nA,col:PSC,hi:o.nothingHi||0});
        if((o.obs||0)>0.01)p2_prods(ctx,7,P2_OBS,o.obs,{hi:o.obsHi||0});}});}
  // where the data comes from, and where it goes
  if((o.src||0)>0.01)withA(ctx,o.src,()=>{let x=120;P2_SRC.forEach((s_,i)=>{const w=p2_chipW(ctx,s_,null,28),q=clamp(o.src*3-i,0,1);if(q>0.01)p2_chip(ctx,x,174,s_,null,{a:q,col:APPC,hi:(o.srcHi||[])[i]||0});x+=w+12;});
    psaArrow(ctx,322,199,322,224,APPC,0.8,1,{lw:2.4,head:10});});
  if((o.dst||0)>0.01)withA(ctx,o.dst,()=>{const ws=P2_OUT.map(s_=>p2_chipW(ctx,s_,null,28));let x=1800-ws.reduce((a,b)=>a+b,0)-12*(P2_OUT.length-1);
    P2_OUT.forEach((s_,i)=>{const q=clamp(o.dst*4-i,0,1);if(q>0.01)p2_chip(ctx,x,174,s_,null,{a:q,col:APPC});x+=ws[i]+12;});psaArrow(ctx,1597,224,1597,199,APPC,0.8,1,{lw:2.4,head:10});});
  // one record, through all four
  if((o.rec||0)>0.01){const P=[[322,180],[322,344],[747,344],[1172,344],[1597,344],[1597,186],[p2_dstX(ctx,0),174]];p2_runner(ctx,P,o.rec,PSC,{r:7,trail:0.1});}});}
// where the first use's pill sits, for the record to arrive at
function p2_dstX(ctx,i){const ws=P2_OUT.map(s_=>p2_chipW(ctx,s_,null,28));let x=1800-ws.reduce((a,b)=>a+b,0)-12*(P2_OUT.length-1);for(let k=0;k<i;k++)x+=ws[k]+12;return x+ws[i]/2;}
// products change: in a slot, a blank pill (no product named), which leaves as another comes in its place; s from 0 to 1
function p2_swap(ctx,x,y,s,seed){const w1=190+40*hash(seed,1),w2=170+50*hash(seed,2),d=0.06*hash(seed,3),aA=clamp(s/0.1,0,1)*(1-clamp((s-0.42-d)/0.14,0,1)),aB=clamp((s-0.52-d)/0.14,0,1),
    pill=(w,a,dy)=>{if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-w/2,y-23+dy,w,46,23,TECC,{glow:8,ea:0.6,fill:"rgba(8,16,14,0.94)"});
      ctx.fillStyle=rgba(TECC,0.6);rr(ctx,x-w/2+14,y-11+dy,22,22,6);ctx.fill();ctx.fillStyle=rgba(SOFT,0.42);rr(ctx,x-w/2+46,y-5+dy,w-68,10,5);ctx.fill();});};
  pill(w1,aA,(1-aA)*16*(s>0.4?1:-1));pill(w2,aB,-(1-aB)*16);}
// the platform as An application or a platform? drew it: a slab in technology green, its eight parts along its front, each domain's logic set down
// on it as a block, with its owner. o.eyes: each domain watching its own; o.whole: the dashed outline nobody watches; o.own: owners
function p2_slab(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const X=210,Y=o.y||590;
  psaPlatform(ctx,X,Y,1500,90,{label:"the data platform",caps:P2_CAPS,csize:28,hi:o.hi||0});
  if((o.capHi||0)>0.01){const cw=(1500-45-24)/8,cx=X+12+7*cw;withA(ctx,o.capHi,()=>{ctx.save();ctx.strokeStyle=rgba(o.capCol||PSC,0.95);ctx.lineWidth=2.6;ctx.setLineDash([8,6]);rr(ctx,cx+4,Y+90+6,cw-8,52,10);ctx.stroke();ctx.setLineDash([]);ctx.restore();glow(ctx,cx+cw/2,Y+122,cw*0.7,o.capCol||PSC,0.18);});}
  P2_DOM.forEach(([nm,col,own],i)=>{const bx=X+80+i*340;psaBlock(ctx,bx,Y-140,290,128,nm,{col,t,size:30,owner:own,ownerA:clamp((o.own||0)*4-i*0.6,0,1),drop:o.drop==null?null:clamp(o.drop*4-i*0.5,0,1)});
    if((o.eyes||0)>0.01)withA(ctx,clamp(o.eyes*4-i*0.6,0,1),()=>p2_eye(ctx,bx+145,Y-188,22,APPC));});
  if((o.whole||0)>0.01)withA(ctx,o.whole,()=>{ctx.save();ctx.strokeStyle=rgba(AMBER,0.9);ctx.lineWidth=2.6;ctx.setLineDash([12,9]);rr(ctx,X-30,Y-36,1560,210,26);ctx.stroke();ctx.setLineDash([]);ctx.restore();});});}
// an eye, looking down at what it watches
function p2_eye(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=Math.max(2,s*0.12);ctx.beginPath();ctx.moveTo(x-s*1.4,y);ctx.quadraticCurveTo(x,y-s*1.1,x+s*1.4,y);ctx.quadraticCurveTo(x,y+s*1.1,x-s*1.4,y);ctx.closePath();ctx.stroke();
  ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.arc(x,y+s*0.12,s*0.42,0,TAU);ctx.fill();ctx.restore();}

/* ---------- the road: the stations, and the mountain stage ---------- */
// the dusk road with its pines, for a station and its inn
function p2_road(ctx,S,t,o){o=o||{};psaDusk(ctx,S,{d:o.d==null?1:o.d,y0:760});[[90,0.95,1],[760,1.05,2],[1640,1.1,4],[1860,0.9,5]].forEach(([x,s,k])=>psaPine(ctx,x,762,s,k,{rim:PSC}));}
// an inn: two floors, lit paper screens upstairs behind a rail, the open front below with a cloth over its door, and two lanterns
function p2_inn(ctx,x,y0,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const lit=o.lit==null?1:o.lit;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y0);ctx.scale(s,s);
  if(lit>0.01)glow(ctx,0,-160,300,PSC,0.2*lit);
  ctx.fillStyle="rgba(20,16,18,1)";ctx.fillRect(-230,-140,460,140);ctx.fillRect(-200,-276,400,128);
  const roof=(y,w,dh)=>{ctx.beginPath();ctx.moveTo(-w,y);ctx.quadraticCurveTo(-w*0.55,y-6,-w*0.44,y-dh);ctx.lineTo(w*0.44,y-dh);ctx.quadraticCurveTo(w*0.55,y-6,w,y);ctx.lineTo(w,y+10);ctx.lineTo(-w,y+10);ctx.closePath();ctx.fillStyle="rgba(12,10,14,1)";ctx.fill();
    ctx.strokeStyle=rgba(mix([90,70,60],PSC,0.4*lit),0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-w,y);ctx.quadraticCurveTo(-w*0.55,y-6,-w*0.44,y-dh);ctx.lineTo(w*0.44,y-dh);ctx.quadraticCurveTo(w*0.55,y-6,w,y);ctx.stroke();};
  for(let i=0;i<4;i++){const bx=-184+i*92,g=ctx.createLinearGradient(0,-262,0,-180);g.addColorStop(0,rgba(mix([40,30,28],[255,200,140],lit*0.85),0.95));g.addColorStop(1,rgba(mix([24,18,18],[150,96,64],lit*0.85),0.95));ctx.fillStyle=g;ctx.fillRect(bx,-262,80,82);
    ctx.strokeStyle="rgba(14,10,12,0.85)";ctx.lineWidth=2.4;for(let k=1;k<4;k++){ctx.beginPath();ctx.moveTo(bx+k*20,-262);ctx.lineTo(bx+k*20,-180);ctx.stroke();}ctx.beginPath();ctx.moveTo(bx,-221);ctx.lineTo(bx+80,-221);ctx.stroke();}
  ctx.fillStyle="rgba(14,10,12,1)";ctx.fillRect(-212,-180,424,8);for(let i=0;i<15;i++)ctx.fillRect(-208+i*29.5,-172,5,24);
  roof(-150,272,40);roof(-286,244,52);
  [[-206,-118,180,118,0.8],[-6,-118,196,118,0.95]].forEach(([bx,by,bw,bh,k])=>{const g=ctx.createLinearGradient(0,by,0,by+bh);g.addColorStop(0,rgba(mix([40,30,28],[255,190,120],lit*k),0.95));g.addColorStop(1,rgba(mix([24,18,18],[140,90,60],lit*k),0.95));ctx.fillStyle=g;ctx.fillRect(bx,by,bw,bh);});
  ctx.fillStyle="rgba(34,24,26,1)";for(let i=0;i<3;i++)ctx.fillRect(-2+i*64,-118,60,44);
  [[-222,-128],[222,-128]].forEach(([lx,ly])=>{ctx.fillStyle="rgba(16,12,12,1)";ctx.fillRect(lx-2,ly-26,4,26);if(lit>0.01)glow(ctx,lx,ly+16,40,PSC,0.55*lit);ctx.fillStyle=rgba(mix([80,60,40],[255,214,150],lit),1);rr(ctx,lx-12,ly,24,34,8);ctx.fill();});
  ctx.restore();});}
// a horse's load on its own, as psaHorse packs it (two straw-wrapped bundles and a third across the top), while it's moved from one
// horse to another; drawn where a horse standing at x, y0 at size s would carry it, lifted by dy
function p2_pack(ctx,x,y0,s,dir,dy){ctx.save();ctx.translate(x,y0-dy);ctx.scale(s*(dir||1),s);const col=[16,14,16];
  ctx.fillStyle=rgba(mix(col,[70,52,38],0.28),1);rr(ctx,-52,-192,104,42,14);ctx.fill();rr(ctx,-44,-160,44,58,12);ctx.fill();rr(ctx,8,-160,44,58,12);ctx.fill();
  ctx.strokeStyle=rgba(mix(col,[150,118,84],0.45),0.85);ctx.lineWidth=2.2;[-30,0,30].forEach(xx=>{ctx.beginPath();ctx.moveTo(xx,-192);ctx.lineTo(xx+2,-150);ctx.stroke();});
  ctx.beginPath();ctx.moveTo(-44,-128);ctx.lineTo(52,-128);ctx.stroke();ctx.strokeStyle=rgba(PSC,0.45);ctx.lineWidth=2;rr(ctx,-52,-192,104,42,14);ctx.stroke();ctx.restore();}
// the map, its stations lit one by one; the station on the mountain isn't there yet. Returns the Tōkaidō's points
const P2_I=n=>PSA_TKD.findIndex(s=>s[0]===n);
function p2_map(ctx,v,t,o){o=o||{};const TK=psaMap(ctx,v,t,{lit:o.lit||0,tkd:o.tkd==null?1:o.tkd,st:0,ends:o.ends==null?1:o.ends,namesA:o.namesA,nameSize:o.nameSize});const z=o.z||1,hk=P2_I("Hakone");
  const st=o.st||0;if(st>0.01)TK.forEach(([x,y],i)=>{if(i===0||i===TK.length-1||i===hk)return;const q=clamp(st*1.3-(1-i/TK.length)*0.3,0,1);psaStop(ctx,x,y,{a:q,lit:o.lit_?o.lit_(i):0.2,r:4.4/Math.sqrt(z)});});
  return TK;}
// The mountain stage from the side, east on the right as on the map: Odawara by the sea, the climb, the lake in its hollow with the
// station on its shore, the pass, and down to Mishima. A kilometre is drawn wider over the top, where the station and its lake are,
// than on the plains, and a metre is half a pixel, so the climb is drawn many times steeper than it is.
const P2_KXP=[[0,1700],[13.2,1215],[15.4,1080],[16.6,930],[17.4,880],[20.2,700],[31.4,211]];
function P2_KX(k){for(let i=1;i<P2_KXP.length;i++){const[a,xa]=P2_KXP[i-1],[b,xb]=P2_KXP[i];if(k<=b||i===P2_KXP.length-1)return xa+(xb-xa)*(k-a)/(b-a);}return P2_KXP[0][1];}
const P2_MY=m=>770-m*0.5;
const P2_PROF=[[0,10],[1.5,30],[3,70],[5,150],[7,262],[9,382],[11,500],[12.5,600],[13.5,690],[14.2,762],[14.7,800],[15.05,782],[15.3,744],[15.45,726],[16.55,726],[16.9,734],
  [17.4,762],[18.2,806],[19.0,840],[19.3,846],[19.9,830],[20.6,778],[21.6,700],[23,590],[25,452],[27,318],[29,182],[30.5,82],[31.4,20]].map(([k,m])=>[P2_KX(k),P2_MY(m)]);
// the station on the lake's shore, the two at the mountain's feet, and the lake: its east and west shores, and its level
const P2_HX=P2_KX(16.75),P2_HK=[P2_HX,P2_MY(726)],P2_OD=[P2_KX(0),P2_MY(10)],P2_MI=[P2_KX(31.4),P2_MY(20)],P2_LK=[P2_KX(15.45),P2_KX(16.55),P2_MY(726)];
// the share of the way along the road where it passes x
const P2_U=(()=>{const L=[0];for(let i=1;i<P2_PROF.length;i++)L.push(L[i-1]+Math.hypot(P2_PROF[i][0]-P2_PROF[i-1][0],P2_PROF[i][1]-P2_PROF[i-1][1]));const T_=L[L.length-1];
  return x=>{for(let i=1;i<P2_PROF.length;i++){const[a,b]=[P2_PROF[i-1],P2_PROF[i]];if(x<=a[0]&&x>=b[0]){const f=(a[0]-x)/(a[0]-b[0]||1);return(L[i-1]+f*(L[i]-L[i-1]))/T_;}}return x>P2_PROF[0][0]?0:1;};})();
const P2_UH=P2_U(P2_HX),P2_LEN=(()=>{let L=0;for(let i=1;i<P2_PROF.length;i++)L+=Math.hypot(P2_PROF[i][0]-P2_PROF[i-1][0],P2_PROF[i][1]-P2_PROF[i-1][1]);return L;})();
// the slope of the road at u, as an angle a figure walking it leans by (less than the drawing's, so it reads as a climb, not a fall)
function p2_lean(u){const a=psaAlong(P2_PROF,clamp(u-0.004,0,1)),b=psaAlong(P2_PROF,clamp(u+0.004,0,1));return Math.atan((b[1]-a[1])/((b[0]-a[0])||-0.001))*0.55;}
// one figure on the mountain road at u, leaning with the slope
function p2_onRoad(ctx,u,fn){const[x,y]=psaAlong(P2_PROF,clamp(u,0,1));ctx.save();ctx.translate(x,y+2);ctx.rotate(p2_lean(u));fn(ctx);ctx.restore();}
// a camera that glides between keys [t, x, y, zoom] as focus() does; returns where it is, so words can be laid on the frame beside
// what they name, at their own size; p2_camAt applies it, p2_scr turns a point of the room into the frame
function p2_cam(t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}return[x,y,z];}
function p2_camAt(ctx,c){ctx.translate(960,540);ctx.scale(c[2],c[2]);ctx.translate(-c[0],-c[1]);}
const p2_scr=(c,x,y)=>[960+(x-c[0])*c[2],540+(y-c[1])*c[2]];
// drift() as a camera: a slow push in of z over dur seconds, about the point (fx, fy)
function p2_driftCam(u,dur,z0,fx,fy){const z=1+z0*ease(clamp(u/Math.max(1,dur),0,1));return[fx-(fx-960)/z,fy-(fy-540)/z,z];}
// a range of hills across the frame: a base line, a gentle swell and a few peaks, filled down to the plain
function p2_range(ctx,yb,amp,ph,peaks,col){ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(0,800);for(let x=0;x<=W;x+=12){let y=yb-amp*(0.6+0.4*Math.sin(x*0.0031+ph))*(0.7+0.3*Math.sin(x*0.0083+ph*2.3));
    peaks.forEach(([px,ph_,pw])=>{const d=(x-px)/pw;y-=ph_*Math.exp(-d*d);});ctx.lineTo(x,y);}ctx.lineTo(W,800);ctx.closePath();ctx.fill();}
// a cedar, tall and narrow, its crown in tiers: they stand along the road over the mountain
function p2_cedar(ctx,x,y,h,seed,col,rim){const w=h*(0.24+0.08*hash(seed,1)),n=5;ctx.save();ctx.translate(x,y);ctx.fillStyle=rgba(col,1);ctx.fillRect(-h*0.035,-h*0.18,h*0.07,h*0.2);
  ctx.beginPath();ctx.moveTo(0,-h);for(let i=1;i<=n;i++){const yy=-h+h*0.84*i/n,ww=w*(0.25+0.75*i/n)*(0.85+0.3*hash(seed,10+i));ctx.lineTo(ww,yy);ctx.lineTo(ww*0.5,yy-h*0.03);}
  for(let i=n;i>=1;i--){const yy=-h+h*0.84*i/n,ww=w*(0.25+0.75*i/n)*(0.85+0.3*hash(seed,20+i));ctx.lineTo(-ww*0.5,yy-h*0.03);ctx.lineTo(-ww,yy);}ctx.closePath();ctx.fill();
  if(rim){ctx.strokeStyle=rgba(rim,0.22);ctx.lineWidth=1.2;ctx.stroke();}ctx.restore();}
// where the cedars stand, in kilometres from Odawara: none on the lake's shore or by a station
const P2_CEDARS=[2.2,3.4,4.1,5.6,6.3,7.7,8.8,9.6,10.4,11.6,12.2,13.1,13.8,14.4,14.9,15.15,17.15,17.7,18.0,18.6,19.1,19.6,20.2,21.0,21.9,22.6,23.6,24.4,25.3,26.2,27.4,28.3,29.4];
function p2_mountain(ctx,S,t,o){o=o||{};setScreen(ctx,S);const d=o.d==null?0.9:o.d,night=o.night||0,N=c=>mix(c,[8,10,24],night*0.75),cam=o.cam||[960,540,1],par=k=>[cam[0],cam[1],1+(cam[2]-1)*k];
  const g=ctx.createLinearGradient(0,0,0,800);g.addColorStop(0,rgba(mix(mix([10,14,30],[24,28,58],d),[5,7,18],night),1));g.addColorStop(0.55,rgba(mix(mix([18,20,40],[92,62,80],d),[10,12,28],night),1));g.addColorStop(1,rgba(mix(mix([30,26,38],[214,140,96],d),[20,22,40],night),1));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  // the last of the light in the west, behind Mishima
  if(d*(1-night)>0.01)glow(ctx,240,620,760,[230,150,100],0.22*d*(1-night));
  if(night>0.01)for(let i=0;i<90;i++){const x=hash(i,31)*W,y=hash(i,32)*440,r=0.6+hash(i,33)*1.4;ctx.fillStyle="rgba(230,236,255,"+(0.25+0.5*hash(i,34))*night+")";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}
  // the far mountains, hazy, rising behind the lake; then nearer ranges: the further, the less they move with the camera
  ctx.save();p2_camAt(ctx,par(0.3));p2_range(ctx,470,36,0.4,[[1010,118,100],[870,92,110],[1180,104,120],[1430,66,150],[650,58,130],[390,80,190]],N(mix([56,48,72],[100,80,104],d*0.4)));ctx.restore();
  ctx.save();p2_camAt(ctx,par(0.6));p2_range(ctx,560,34,2.1,[[300,80,170],[640,50,120],[1420,70,150],[1680,40,120]],N(mix([40,35,52],[64,50,66],d*0.3)));ctx.restore();
  ctx.save();p2_camAt(ctx,cam);
  // the mountain itself, lit a little along its top, and the folds of its slopes
  const mg=ctx.createLinearGradient(0,340,0,800);mg.addColorStop(0,rgba(N([36,31,44]),1));mg.addColorStop(1,rgba(N([13,12,16]),1));ctx.fillStyle=mg;
  ctx.beginPath();ctx.moveTo(1750,772);P2_PROF.forEach(([x,y])=>ctx.lineTo(x,y));ctx.lineTo(160,768);ctx.lineTo(0,768);ctx.lineTo(0,H);ctx.lineTo(1750,H);ctx.closePath();ctx.fill();
  ctx.save();ctx.strokeStyle=rgba(N([70,60,78]),0.35);ctx.lineWidth=2.2;[[[P2_KX(14.2),P2_MY(762)],[1300,600],[1380,760]],[[P2_KX(11),P2_MY(500)],[1500,640],[1560,770]],[[P2_KX(19.3),P2_MY(846)],[660,560],[600,760]],
    [[P2_KX(23),P2_MY(590)],[460,660],[420,770]],[[P2_KX(17.4),P2_MY(762)],[860,560],[820,760]]].forEach(([a,c,b])=>{ctx.beginPath();ctx.moveTo(a[0],a[1]+6);ctx.quadraticCurveTo(c[0],c[1],b[0],b[1]);ctx.stroke();});ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(N(mix([120,96,110],[240,170,120],d*0.5)),0.4);ctx.lineWidth=2;ctx.beginPath();P2_PROF.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.restore();
  // the lake in the hollow: the sky's light on its water
  const[xe,xw,ly]=P2_LK;ctx.save();ctx.beginPath();ctx.moveTo(xe+4,ly);ctx.quadraticCurveTo((xe+xw)/2,ly+46,xw-4,ly);ctx.closePath();
  const lg=ctx.createLinearGradient(0,ly,0,ly+24);lg.addColorStop(0,rgba(mix(mix([150,122,150],[210,160,140],d*0.4),[44,54,92],night),1));lg.addColorStop(1,rgba(mix([40,40,66],[12,14,30],night),1));ctx.fillStyle=lg;ctx.fill();ctx.clip();
  ctx.strokeStyle=rgba(mix([255,220,190],[170,190,240],night),0.35);ctx.lineWidth=1.6;for(let i=0;i<5;i++){const yy=ly+4+i*4,x0=lerp(xw,xe,0.15+0.6*hash(i,51)),w_=20+30*hash(i,52);ctx.beginPath();ctx.moveTo(x0,yy);ctx.lineTo(x0+w_,yy);ctx.stroke();}
  if((o.hk||0)>0.01)glow(ctx,P2_HX+20,ly+10,40,PSC,0.35*(o.hkLit==null?1:o.hkLit)*clamp(o.hk,0,1));ctx.restore();
  ctx.save();ctx.strokeStyle=rgba(mix([255,226,200],[180,200,255],night),0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xe+2,ly+0.5);ctx.lineTo(xw-2,ly+0.5);ctx.stroke();ctx.restore();
  // the sea at Odawara
  const sg=ctx.createLinearGradient(0,772,0,H);sg.addColorStop(0,rgba(mix([70,58,80],[18,22,44],night),1));sg.addColorStop(1,rgba([8,10,20],1));ctx.fillStyle=sg;ctx.fillRect(1750,772,W-1750,H-772);
  for(let i=0;i<9;i++){const yy=786+i*14,xx=1770+hash(i,41)*90;ctx.strokeStyle=rgba(mix([220,170,120],[120,140,200],night),0.16*(1-i/9));ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx+30+hash(i,42)*50,yy);ctx.stroke();}
  // cedars along the road
  P2_CEDARS.forEach((k,i)=>{const x=P2_KX(k),m=P2_PROF,yy=psaAlong(m,P2_U(x))[1];p2_cedar(ctx,x+(hash(i,61)-0.5)*8,yy+3,22+20*hash(i,62),i+70,N([16,14,20]),mix(PSC,[150,170,230],night));});
  // the road over it
  if((o.road||0)>0.01)psaPath(ctx,P2_PROF,o.roadP==null?1:o.roadP,{col:PSC,lw:3.2,glow:10,a:0.8*o.road});
  // the two stations at its feet, and the one by the lake
  psaStation(ctx,P2_OD[0]-14,P2_OD[1]+5,0.28,{lit:o.lit==null?1:o.lit});psaStation(ctx,P2_MI[0]+14,P2_MI[1]+5,0.28,{lit:o.lit==null?1:o.lit});
  if((o.hk||0)>0.01)withA(ctx,clamp(o.hk,0,1),()=>{ctx.save();ctx.translate(0,(1-spring(clamp(o.hk,0,1)))*-18);psaStation(ctx,P2_HK[0],P2_HK[1]+5,0.24,{lit:o.hkLit==null?1:o.hkLit});ctx.restore();});
  ctx.restore();}

/* ---------- 1. The hardest stage ---------- */
// the clerk's book: each horse and porter written down
const P2_BOOK=["THE CLERK'S BOOK","Two horses, to the next station.","Six porters, three loads.","One rider, with the seal."];
// the opening's small drawing: the eight parts as tiles, two rows of four, a product under each but one
function p2_tiles(ctx,t,o){o=o||{};const X=560,Y=[300,470],w=300,h=96;
  for(let i=0;i<8;i++){const r=i<4?0:1,c=i%4,x=X+c*316,y=Y[r],q=clamp((o.p||0)*8-i,0,1);if(q<=0.01)continue;const miss=i===7,fix=miss?o.fix||0:0;
    withA(ctx,q,()=>{p2_part(ctx,x,y,w,h,1,(o.hi||0)*(miss?1:0)+fix*0.6,miss?mix(TECC,PSC,(o.wrong||0)*(1-fix)):TECC);
      const nm=P2_CAPS[i]==="govern"?"catalogue and govern":P2_CAPS[i];wrapT(ctx,nm,x+w/2,y+h/2+11-(nm.length>18?17:0),w-30,{size:30,w:800,align:"center",color:rgba(INK,0.97),lh:34});
      // what's under it: a product, shown by its maker's mark, or nothing
      const pq=clamp((o.prod||0)*8-i,0,1);if(!miss&&pq>0.01)withA(ctx,pq,()=>{const k=i===2?"dbt":"databricks",cx=x+w/2,cy=y+h+40;glass(ctx,cx-30,cy-24,60,48,24,TECC,{glow:8,ea:0.6,fill:"rgba(8,16,14,0.94)"});
        if(i===1||i===5){ctx.fillStyle=rgba(TECC,0.6);rr(ctx,cx-16,cy-4,32,8,4);ctx.fill();}else logo(ctx,k,cx-14,cy-15,30);});
      if(miss){const nA=(o.prod||0)>0.9?(o.wrong||0)*(1-fix):0;if(nA>0.01)p2_chip(ctx,x+w/2,y+h+40,"nothing",null,{dash:true,w:200,align:"center",a:nA,col:PSC});
        if(fix>0.01)withA(ctx,fix,()=>{const cx=x+w/2,cy=y+h+40;glass(ctx,cx-30,cy-24,60,48,24,TECC,{glow:12,ea:0.7,fill:"rgba(8,16,14,0.94)"});logo(ctx,"databricks",cx-14,cy-15,30);});}});}}
scene("road",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tP=c("parts"),tI=c("inns"),tS=c("stage"),tH=c("hakone"),tC=c("climb"),tSa=c("same"),tN=c("need"),tF=c("founded"),tT=c("two"),tR=c("ravi"),tW=c("wrong"),tB=c("better");
  // which room: the map (the road, then the stage over the mountains), the station at dusk, the mountain from the side, then the
  // utility; under the title, the last room leaves whole, so no word of it shows under the title's
  const outA=1-fin(t,B+0.9,0.7),dA0=fin(t,tP-0.7,0.9)*(1-fin(t,tH-0.7,0.9)),pA0=fin(t,tC-0.6,0.9)*(1-fin(t,tR-0.6,0.9)),uA0=fin(t,tR-0.6,0.9);
  const dA=dA0*outA,pA=pA0*outA,uA=uA0*outA,mA=Math.max(0,1-dA0-pA0-uA0)*outA;if(outA<1)p2_base(ctx,S);
  /* the map: the Tōkaidō and its stations, then the stage from Odawara to Mishima */
  psaRooms(ctx,[[mA,ctx=>{psaSea(ctx,S,{dusk:0.2});ctx.save();
    const second=t>tH-1.2,CK=[[0,1000,560,1.0],[tH-0.5,1300,664,4.2]],z=focusZ(t,CK,2.6);focus(ctx,t,CK,2.6);
    const od=P2_I("Odawara"),mi=P2_I("Mishima");
    const TK=p2_map(ctx,PSA_VIEW,t,{z,lit:0.3,tkd:clamp((t-0.6)/2.6,0,1),st:fin(t,w("year","station"),1.8),ends:fin(t,w("year","Edo")-0.3,0.8),namesA:fin(t,w("year","Edo")-0.2,0.8)*(1-fin(t,tH-1.0,0.6)),nameSize:34/z,
      lit_:i=>i===od||i===mi?0.25+0.75*fin(t,w("hakone","Odawara")-0.2+(i===mi?0.6:0),0.6):0.25});
    // the one stage, lit, with no station between its two
    if(second){const[ox,oy]=TK[od],[mx,my]=TK[mi],k=fin(t,w("hakone","Odawara")-0.2,1.2);
      withA(ctx,k,()=>{psaPath(ctx,TK.slice(od,mi+1),clamp((t-w("hakone","Odawara"))/1.6,0,1),{col:[255,244,224],lw:5.6,glow:26});});
      const mx_=(ox+mx)/2,my_=(oy+my)/2;psaName(ctx,"Odawara",ox+24/z,oy+12/z,{a:fin(t,w("hakone","Odawara")-0.1,0.5),size:32/z});psaName(ctx,"Mishima",mx-24/z,my+12/z,{a:fin(t,w("hakone","Mishima")-0.1,0.5),size:32/z,align:"right"});
      withA(ctx,fin(t,w("hakone","Hakone mountains")-0.3,0.6),()=>psaName(ctx,"the Hakone mountains",mx_-130/z,my_-74/z,{size:30/z,align:"center",color:rgba(SOFT,1)}));
      withA(ctx,fin(t,w("hakone","thirty kilometres")-0.2,0.5),()=>tag(ctx,mx_+200/z,my_+96/z,"about 30 km, no station between",PSC,{align:"center",size:30/z}));}
    ctx.restore();
    eaYear(ctx,80,80,"Japan · the early 1600s",CLAY,fin(t,0.5,0.8)*(1-fin(t,tP-0.9,0.5)));
    withA(ctx,fin(t,w("year","every ten")-0.2,0.6)*(1-fin(t,tP-0.9,0.5)),()=>tag(ctx,960,160,"a station about every 10 km",PSC,{align:"center",size:32}));}],
  /* a station at dusk: its office, horses and porters, the clerk's book, an inn; a load moved onto a fresh horse */
  [dA,ctx=>{const u=t-tP+0.7;p2_road(ctx,S,t,{d:1});ctx.save();drift(ctx,u,{dur:20},{z:0.025,y:640});
    p2_inn(ctx,470,762,0.86,{lit:fin(t,tI-0.4,1.0)});psaStation(ctx,1180,762,1.0,{lit:1});
    // pilgrims walking to the inn, and a lord's man at its door
    const vP=psaPace("walker",0.92,0.5),[dP,aP]=p2_go(t,tP-0.7,tS+2.2,vP);[[0,0.1],[-96,0.6]].forEach(([o_,ph])=>psaWalker(ctx,-80+o_+dP,790,0.92,t,{kind:"pilgrim",dir:1,ph,rate:0.5,amp:aP}));
    psaWalker(ctx,700,772,0.86,t,{kind:"spear",dir:-1,still:true,ph:0.2});
    // the station's porters, and a fresh horse waiting
    [[1330,0.2],[1410,0.7]].forEach(([x,ph])=>psaWalker(ctx,x,786,0.96,t,{kind:"porter",dir:-1,still:true,ph}));
    // a load comes in from the last station, and is moved onto the fresh horse, which takes it on
    const vA=psaPace("horse",0.62,1.1),tStop=w("stage","next station")+0.2,[dA_,aA]=p2_go(t,tP-0.7,tStop,vA),xA=2120-dA_;
    const tM=w("stage","moved")-0.1,mv=clamp((t-tM)/0.9,0,1),tGo=w("stage","fresh horses")+0.4,vB=psaPace("horse",0.62,1.1),[dB,aB]=p2_go(t,tGo,tGo+30,vB),xB=1080-dB;
    psaHorse(ctx,xB,792,0.62,t,{dir:-1,ph:0.4,rate:1.1,amp:aB,pack:mv>=1});
    psaWalker(ctx,xA-170,790,0.94,t,{kind:"porter",dir:-1,ph:0.3,rate:vA/(103.6*0.94),amp:aA});psaHorse(ctx,xA,792,0.62,t,{dir:-1,ph:0.1,rate:1.1,amp:aA,pack:mv<=0});
    if(mv>0&&mv<1){const e=ease(mv),px=lerp(xA,xB,e),lift=Math.sin(mv*Math.PI)*80;p2_pack(ctx,px,792,0.62,-1,lift);}
    ctx.restore();
    // the clerk's book, written as each one is found
    arrive(ctx,370,262,t,w("parts","clerk")-0.4,()=>psaPaper(ctx,70,110,600,300,P2_BOOK,{p:clamp((t-w("parts","writes"))/2.6,0,1),size:30,kicker:true,rot:-0.02}),{dy:-16});
    withA(ctx,fin(t,w("parts","office")-0.2,0.5)*(1-fin(t,w("stage","one stage")-0.5,0.4)),()=>tag(ctx,1180,488,"the office: horses and porters",PSC,{align:"center",size:30}));
    withA(ctx,fin(t,tI-0.1,0.5),()=>tag(ctx,470,452,"inns, from lords to pilgrims",PSC,{align:"center",size:30}));
    withA(ctx,fin(t,w("stage","one stage")-0.1,0.5),()=>tag(ctx,1180,488,"one stage, then fresh horses",PSC,{align:"center",size:30}));}],
  /* the mountain from the side: the climb; the same horses and porters all the way; the station founded; two stages */
  [pA,ctx=>{const u=t-tC+0.6,cam=p2_driftCam(u,44,0.02,1000,560);
    const hkA=fin(t,w("founded","Hakone")-0.4,1.0);p2_mountain(ctx,S,t,{d:0.9,road:fin(t,tC-0.4,1.0),roadP:clamp((t-tC+0.4)/2.0,0,1),hk:hkA,hkLit:fin(t,w("founded","run it")-0.6,1.4),cam});
    ctx.save();p2_camAt(ctx,cam);
    psaName(ctx,"Odawara",P2_OD[0]-12,P2_OD[1]-82,{size:32,align:"center",a:fin(t,tC-0.2,0.6)});psaName(ctx,"Mishima",P2_MI[0]+12,P2_MI[1]-82,{size:32,align:"center",a:fin(t,tC,0.6)});
    // more than seven hundred metres: a rule from the sea up to the lake's level, and that level across to the lake
    const mh=fin(t,w("climb","seven hundred")-0.3,0.6);if(mh>0.01)withA(ctx,mh*(1-fin(t,tSa-0.4,0.6)),()=>{const X=1560,yT=P2_LK[2];ctx.save();ctx.strokeStyle=rgba(SOFT,0.85);ctx.lineWidth=2;ctx.setLineDash([6,6]);
      ctx.beginPath();ctx.moveTo(X,P2_MY(0));ctx.lineTo(X,yT);ctx.moveTo(X-30,yT);ctx.lineTo(X+30,yT);ctx.moveTo(X-30,P2_MY(0));ctx.lineTo(X+30,P2_MY(0));ctx.stroke();
      ctx.strokeStyle=rgba(SOFT,0.45);ctx.beginPath();ctx.moveTo(X-30,yT);ctx.lineTo(P2_LK[0]+12,yT);ctx.stroke();ctx.restore();tag(ctx,X,yT-42,"more than 700 m",SOFT,{align:"center",size:30});});
    withA(ctx,fin(t,w("climb","no station")-0.3,0.5)*(1-fin(t,w("same","Everywhere else")-0.5,0.4)),()=>tag(ctx,P2_HX+40,P2_HK[1]-136,"no station on the way",AMBER,{align:"center",size:30}));
    // the same horse and porter, all the way up: they set off as the climb is named, and stop on the last rise before the lake
    const uStop=P2_U(P2_KX(15.0)),tUp=tC+0.2,tTop=tN+1.2,vU=(uStop*P2_LEN)/(tTop-tUp-0.25),[dU,aU]=p2_go(t,tUp,tTop,vU),uU=Math.min(uStop,dU/P2_LEN);
    // once the station is there, they walk down to the lake and in to it; the load is changed to a fresh horse, which takes it on
    const uIn=P2_U(P2_HX+52),tIn=tT-0.4,vI=(uIn-uStop)*P2_LEN/3.0,[dI,aI]=p2_go(t,tIn,tIn+3.5,vI),uC=Math.min(uIn,uU+dI/P2_LEN),aC=Math.max(aU,aI),vC=t<tIn?vU:vI;
    const tM=w("two","changed")-0.1,mv=clamp((t-tM)/1.0,0,1),tGo=w("two","halfway")+0.2,vD=vU,[dD,aD]=p2_go(t,tGo,tGo+40,vD),uF=P2_U(P2_HX-112),uD=uF+dD/P2_LEN;
    p2_onRoad(ctx,uC-0.015,c_=>psaWalker(c_,0,0,0.29,t,{kind:"porter",dir:-1,ph:0.2,rate:vC/(103.6*0.29),amp:aC}));
    p2_onRoad(ctx,uC,c_=>psaHorse(c_,0,0,0.26,t,{dir:-1,ph:0.5,rate:vC/(93*0.26),amp:aC,pack:mv<=0}));
    const fA=fin(t,w("founded","run it")-0.2,0.8);if(fA>0.01)withA(ctx,fA,()=>{p2_onRoad(ctx,uD,c_=>psaHorse(c_,0,0,0.26,t,{dir:-1,ph:0.1,rate:vD/(93*0.26),amp:aD,pack:mv>=1}));
      p2_onRoad(ctx,uD-0.015,c_=>psaWalker(c_,0,0,0.29,t,{kind:"porter",dir:-1,ph:0.6,rate:vD/(103.6*0.29),amp:aD}));});
    if(mv>0&&mv<1){const a_=psaAlong(P2_PROF,uC),b_=psaAlong(P2_PROF,uF),e=ease(mv);p2_pack(ctx,lerp(a_[0],b_[0],e),lerp(a_[1],b_[1],e)+2,0.26,-1,Math.sin(mv*Math.PI)*64);}
    withA(ctx,fin(t,w("same","Everywhere else")-0.2,0.5)*(1-fin(t,tN-0.3,0.5)),()=>tag(ctx,440,250,"elsewhere: fresh horses every 10 km or so",SOFT,{align:"center",size:30}));
    withA(ctx,fin(t,w("same","same horses")-0.2,0.5)*(1-fin(t,tF-0.4,0.5)),()=>tag(ctx,1430,250,"here: the same horses, all 30 km",AMBER,{align:"center",size:30}));
    // the households: fifty from each end, up to the new station, each light going out as it comes in
    const tHh=w("founded","fifty households")-0.4;if(t>tHh&&t<tT+1.0)withA(ctx,1-fin(t,tT,0.8),()=>{const hh=clamp((t-tHh)/4.2,0,1),P2R=P2_PROF.slice().reverse();
      for(let i=0;i<7;i++){const q=clamp(hh*1.4-i*0.06,0,1);if(q<=0||q>=1)continue;withA(ctx,1-clamp((q-0.82)/0.18,0,1),()=>{
        p2_runner(ctx,P2_PROF,q*(P2_UH-0.012),[255,226,180],{r:3.5,trail:0.03});p2_runner(ctx,P2R,q*(1-P2_UH-0.012),[255,226,180],{r:3.5,trail:0.03});});}});
    withA(ctx,fin(t,w("founded","Odawara")-0.3,0.5)*(1-fin(t,tT-0.4,0.5)),()=>tag(ctx,1340,610,"50 households from Odawara",[255,226,180],{align:"center",size:30}));
    withA(ctx,fin(t,w("founded","Mishima")-0.3,0.5)*(1-fin(t,tT-0.4,0.5)),()=>tag(ctx,500,610,"50 from Mishima",[255,226,180],{align:"center",size:30}));
    psaName(ctx,"Hakone",P2_HX,P2_HK[1]-80,{size:32,align:"center",a:hkA});
    // two stages, about fifteen kilometres each
    const br=(x0,x1,y,s_,t0)=>{const k=fin(t,t0,0.6);if(k<=0.01)return;withA(ctx,k,()=>{ctx.save();ctx.strokeStyle=rgba(PSC,0.85);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x0,y+14);ctx.lineTo(x0,y);ctx.lineTo(x1,y);ctx.lineTo(x1,y+14);ctx.stroke();ctx.restore();tag(ctx,(x0+x1)/2,y-34,s_,PSC,{align:"center",size:30});});};
    br(P2_HX+8,P2_OD[0]-20,236,"about 15 km",w("two","fifteen")-0.4);br(P2_MI[0]+20,P2_HX-8,236,"about 15 km",w("two","fifteen")-0.1);
    ctx.restore();
    eaYear(ctx,80,80,"1618",CLAY,fin(t,tF,0.6)*(1-fin(t,tR-0.9,0.5)));}],
  /* the utility: Ravi, and the platform drawn by its parts */
  [uA,ctx=>{const u=t-tR+0.6;p2_room(ctx,S,t);ctx.save();drift(ctx,u,{dur:24},{z:0.02,y:520,x:1100});
    person(ctx,"ravi",250,1030,0.8,{t});
    withA(ctx,fin(t,w("ravi","Ravi")-0.2,0.6),()=>tag(ctx,290,520,"Ravi Menon · platform lead",TECH,{align:"center",size:30}));
    const tw_=w("wrong","nothing watches");p2_tiles(ctx,t,{p:clamp((t-w("ravi","parts")+0.2)/1.6,0,1),prod:clamp((t-w("wrong","something under")+0.2)/1.8,0,1),wrong:fin(t,tw_-0.2,0.5),hi:pulseAt(t,tw_,1.6),fix:fin(t,w("better","part it was missing")-0.4,0.8)});
    withA(ctx,fin(t,w("ravi","before")-0.2,0.5)*(1-fin(t,tW-0.4,0.5)),()=>tag(ctx,1190,210,"the parts first, then the products",TECC,{align:"center",size:30}));
    withA(ctx,fin(t,w("wrong","bill")-0.2,0.5)*(1-fin(t,tB-0.3,0.5)),()=>tag(ctx,1190,210,"its bill: up by half · nobody can say why",AMBER,{align:"center",size:30}));
    withA(ctx,fin(t,w("better","part it was missing")-0.1,0.5),()=>tag(ctx,1190,210,"the part it was missing",PSC,{align:"center",size:30}));
    ctx.restore();}]]);
  vign(ctx,S);
  psaTitle(ctx,S,t,B+0.9,"Inside the platform","the parts every data platform needs","Film 2 of 8 · platform and solution architecture");});

/* ---------- 2. Parts before products ---------- */
scene("draw",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p2_room(ctx,S,t);
  const tO=c("open"),tY=c("why");ctx.save();drift(ctx,t,sc,{z:0.01,y:520});
  // Tomás's map: the platform in the technology layer, every domain above it
  const mapA=1-fin(t,w("open","opens")-0.2,0.6);if(mapA>0.01)withA(ctx,mapA,()=>{const hiT=fin(t,w("map","technology layer")-0.2,0.6);
    layerStack(ctx,420,170,1080,{p:clamp(t/1.4,0,1),sh:64,gap:16,size:30,hi:[0,0,0,0,0,hiT],fill:[0,0,0,0,0,0.2*hiT]});
    const pb=fin(t,w("map","data platform")-0.2,0.6);if(pb>0.01)withA(ctx,pb,()=>{glass(ctx,760,578,700,52,14,TECC,{glow:14,ea:0.85,fill:"rgba(6,14,10,0.95)"});T(ctx,"the data platform",1110,614,{w:800,size:30,align:"center",color:rgba(mix(TECC,INK,0.4),1)});});
    const dm=fin(t,w("map","every domain")-0.3,0.6);if(dm>0.01)withA(ctx,dm,()=>{["network","retail","finance","enterprise"].forEach((d,i)=>{const x=830+i*186;T(ctx,d,x,138,{w:700,size:28,align:"center",color:rgba(SOFT,1)});
      ctx.save();ctx.strokeStyle=rgba(APPC,0.5);ctx.lineWidth=1.8;ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(x,152);ctx.lineTo(x,574);ctx.stroke();ctx.setLineDash([]);ctx.restore();});});});
  // Ravi opens it up: the platform's box grows into the drawing's frame, and the eight places for its parts are drawn in it
  const ex=clamp((t-w("open","opens")+0.1)/1.4,0,1),e=easeCam(ex);if(ex>0&&ex<1)withA(ctx,1-0.4*e,()=>{const x=lerp(760,96,e),y=lerp(578,212,e),ww=lerp(700,1728,e),hh=lerp(52,624,e);ctx.save();ctx.strokeStyle=rgba(mix(PSC,TECC,e),0.9);ctx.lineWidth=2.4;rr(ctx,x,y,ww,hh,lerp(14,22,e));ctx.stroke();ctx.restore();});
  const tD=w("open","what it has to do"),tMd=w("open","made of");
  p2_ref(ctx,t,{frame:fin(t,w("open","opens")+1.2,0.6),out:clamp((t-w("open","opens")-1.1)/1.4,0,1),name:Array(8).fill(fin(t,tD-0.2,0.8)*0),hi:Array(8).fill(pulseAt(t,tD,1.6)*0.5+pulseAt(t,w("why","stays"),1.8)*0.6),
    slot:fin(t,tMd-0.2,0.6),refName:fin(t,w("open","reference architecture")-0.2,0.6),swap:t>w("why","Products")-0.3?clamp((t-w("why","Products")+0.3)/2.8,0,1):-1,miss:pulseAt(t,w("why","missing"),2.0)*0.9});
  withA(ctx,fin(t,tD-0.3,0.5)*(1-fin(t,tY-0.3,0.5)),()=>tag(ctx,960,170,"first what it has to do, then what it's made of",TECC,{align:"center",size:30}));
  withA(ctx,fin(t,w("why","Products")-0.3,0.5)*(1-fin(t,w("why","stays")-0.4,0.4)),()=>tag(ctx,960,170,"products change",SOFT,{align:"center",size:30}));
  withA(ctx,fin(t,w("why","stays")-0.3,0.5),()=>tag(ctx,960,170,"what it has to do stays much the same",TECC,{align:"center",size:30}));
  ctx.restore();vign(ctx,S);});

/* ---------- 3. Four along the way ---------- */
// what each chapter of the drawing shows when it begins, so each glides on from the one before
const P2_ALL=[1,1,1,1,1,1,1,1];
scene("along",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p2_room(ctx,S,t);
  const tB=c("bring"),tSt=c("store"),tP=c("process"),tSe=c("serve"),tIn=c("inner");ctx.save();drift(ctx,t,sc,{z:0.01,y:520});
  const T4=[w("bring","Bring"),tSt,tP,w("serve","serve")],nm=[0,1,2,3].map(i=>fin(t,T4[i]-0.25,0.6)),sb=[w("bring","files"),w("store","once"),w("process","clean"),w("serve","reports")].map(t0=>fin(t,t0-0.2,0.6));
  const hi=[0,1,2,3].map(i=>pulseAt(t,T4[i]+0.1,1.4));
  p2_ref(ctx,t,{name:nm.concat([0,0,0,0]),sub:sb.concat([0,0,0,0]),hi:hi.concat([0,0,0,0]),slot:1,refName:1,
    src:fin(t,w("bring","billing")-0.3,1.4)*(1-fin(t,tIn+3.4,0.6)),srcHi:[pulseAt(t,w("bring","billing"),1.0),pulseAt(t,w("bring","meters"),1.0),pulseAt(t,w("bring","network map"),1.0)],
    dst:fin(t,w("serve","reports")-0.3,1.6)*(1-fin(t,tIn+3.4,0.6)),rec:t>w("inner","one record")-0.4?clamp((t-w("inner","one record")+0.4)/3.2,0,1)*(1-fin(t,tIn+3.4,0.4)):0});
  withA(ctx,fin(t,w("bring","Four parts")-0.3,0.5)*(1-fin(t,tSt-0.4,0.5)),()=>tag(ctx,960,170,"along the way the data goes",TECC,{align:"center",size:30}));
  withA(ctx,fin(t,w("inner","Inner Life")-0.3,0.5)*(1-fin(t,tIn+3.4,0.5)),()=>tag(ctx,960,866,"one record, through all four: The Inner Life of Data",PSC,{align:"center",size:30}));
  ctx.restore();vign(ctx,S);});

/* ---------- 4. Four across it all ---------- */
scene("across",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p2_room(ctx,S,t);
  const tM=c("more"),tG=c("govern"),tS=c("secure"),tO=c("orch"),tOb=c("observe");ctx.save();drift(ctx,t,sc,{z:0.01,y:520});
  const T4=[w("govern","Catalogue"),w("secure","Secure"),w("orch","Orchestrate"),w("observe","observe")],nm=T4.map(t0=>fin(t,t0-0.25,0.6)),sb=[w("govern","what each"),w("secure","who's asking"),w("orch","what runs"),w("observe","whether")].map(t0=>fin(t,t0-0.2,0.6));
  const out=fin(t,w("more","across")-0.3,0.8);
  p2_ref(ctx,t,{name:[1,1,1,1].concat(nm),sub:[1,1,1,1].concat(sb),hi:[0,0,0,0].concat(T4.map(t0=>pulseAt(t,t0+0.1,1.4))).map((v,i)=>i<4?pulseAt(t,w("more","all of them"),1.6)*0.5:v),slot:1,refName:1});
  // the four across: each reaches under every part along the way
  if(out>0.01)withA(ctx,out*(1-fin(t,tG+1.2,0.6)),()=>{for(let i=0;i<4;i++){const x=P2_BX(i)+P2_BW/2;ctx.save();ctx.strokeStyle=rgba(TECC,0.55);ctx.lineWidth=2;ctx.setLineDash([5,7]);ctx.beginPath();ctx.moveTo(x,P2_BY+P2_BH+8);ctx.lineTo(x,P2_RY(3)+P2_RH);ctx.stroke();ctx.setLineDash([]);ctx.restore();}});
  withA(ctx,fin(t,w("more","across")-0.3,0.5)*(1-fin(t,tG-0.4,0.5)),()=>tag(ctx,960,170,"across them all",TECC,{align:"center",size:30}));
  ctx.restore();vign(ctx,S);});

/* ---------- 5. A product under each ---------- */
scene("products",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p2_room(ctx,S,t);
  const tU=c("under"),tI=c("in"),tP=c("proc"),tG=c("gov"),tS=c("sec"),tO=c("obs");ctx.save();drift(ctx,t,sc,{z:0.01,y:520});
  const T8=[w("in","Lakeflow Connect"),w("in","kept"),w("proc","Lakeflow pipelines"),w("proc","Databricks SQL"),w("gov","Unity Catalog"),w("sec","three"),w("gov","Lakeflow Jobs"),tO];
  const pr=T8.map((t0,i)=>i===7?0:clamp((t-t0+0.2)/(i===5?2.6:i===1||i===2||i===3?1.6:0.8),0,1));
  p2_ref(ctx,t,{name:P2_ALL,sub:P2_ALL,prod:pr,hi:T8.map((t0,i)=>i===7?0:pulseAt(t,t0+0.1,1.4)),slot:1,refName:1,nothing:fin(t,w("obs","nothing")-0.2,0.5),nothingHi:pulseAt(t,w("obs","nothing"),2.0)});
  // most of them Databricks: its mark, at the top
  withA(ctx,fin(t,w("under","Databricks")-0.3,0.5),()=>{const lw=30;glass(ctx,1530,148,270,46,23,TECC,{glow:8,ea:0.6,fill:"rgba(8,16,14,0.94)"});logo(ctx,"databricks",1546,156,lw);T(ctx,"most of them",1586,180,{w:700,size:28,color:rgba(INK,0.96)});});
  withA(ctx,fin(t,w("in","open format")-0.3,0.5)*(1-fin(t,tP-0.3,0.5)),()=>tag(ctx,960,170,"Delta Lake: an open table format",TECC,{align:"center",size:30}));
  withA(ctx,fin(t,w("obs","nothing")-0.2,0.5),()=>tag(ctx,960,170,"under observe: nothing",AMBER,{align:"center",size:30}));
  ctx.restore();vign(ctx,S);});

/* ---------- 6. Nobody watching ---------- */
// the platform's bill, month by month, and each domain's share of it once it can be split
const P2_MON=["Jun","Jul","Aug","Sep","Oct","Nov"],P2_BILL=[[38,30,20,12],[44,34,21,13],[53,42,21,13],[70,47,20,13],[52,39,20,13],[39,30,20,12]];
const P2_SEG=[[110,196,255],[70,132,224],[168,156,248],[190,200,222]];
function p2_bill(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[190,196,212],{glow:10+12*(o.hi||0),ea:0.8,fill:"rgba(6,9,20,0.96)"});
  T(ctx,"the platform's bill",x+28,y+50,{w:800,size:32});T(ctx,"each month",x+28,y+88,{w:600,size:28,color:rgba(SOFT,1)});
  const n=o.n==null?4:o.n,base=y+h-64,sc_=(h-200)/150,bw=58,gap=(w-80-214-6*bw)/5,sp=o.split||0;
  for(let i=0;i<6;i++){const q=clamp(n-i,0,1);if(q<=0.01)continue;const bx=x+40+i*(bw+gap),V=P2_BILL[i],tot=V.reduce((p,v)=>p+v,0),hot=i===3?(o.hot||0)*(1-sp):0;
    withA(ctx,q,()=>{let yy=base;if(sp<0.99){const bh=tot*sc_;ctx.fillStyle=rgba(mix([170,180,200],AMBER,hot),0.32+0.2*hot);rr(ctx,bx,base-bh,bw,bh,6);ctx.fill();ctx.strokeStyle=rgba(mix([170,180,200],AMBER,hot),0.95);ctx.lineWidth=2;rr(ctx,bx,base-bh,bw,bh,6);ctx.stroke();}
      if(sp>0.01)withA(ctx,sp,()=>{V.forEach((v,k)=>{const sh=v*sc_;ctx.fillStyle=rgba(P2_SEG[k],0.62);ctx.fillRect(bx,yy-sh,bw,sh);ctx.strokeStyle="rgba(6,9,20,0.9)";ctx.lineWidth=2;ctx.strokeRect(bx,yy-sh,bw,sh);yy-=sh;});});
      T(ctx,P2_MON[i],bx+bw/2,base+40,{w:700,size:28,align:"center",color:rgba(SOFT,1)});});}
  // the rise, from June to September
  if((o.rise||0)>0.01)withA(ctx,o.rise,()=>{const bx=x+40+3*(bw+gap),tt=150*sc_;T(ctx,"+50%",bx+bw/2,base-tt-18,{w:800,size:32,align:"center",color:rgba(AMBER,1)});});
  // each domain's share: its colour and its name, in the order they're stacked
  if(o.names&&sp>0.01)withA(ctx,clamp(sp*1.6-0.4,0,1),()=>{const lx=x+w-204;for(let k=3;k>=0;k--){const ly=y+190+(3-k)*52;ctx.fillStyle=rgba(P2_SEG[k],0.75);rr(ctx,lx,ly-20,24,24,5);ctx.fill();T(ctx,P2_DOM[k][0],lx+36,ly,{w:700,size:28,color:rgba(mix(P2_SEG[k],INK,0.35),1)});}});});}
// one of the platform's own tables: a small grid for a table, its name, and what it holds; o.grey once nobody reads it
function p2_table(ctx,x,y,w,name,label,o){o=o||{};const h=66,g=o.grey||0;glass(ctx,x,y,w,h,14,mix(TECC,[120,124,136],g),{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(6,12,12,0.97)"});
  const gx=x+24,gy=y+17;ctx.save();ctx.strokeStyle=rgba(mix(TECC,SOFT,g),0.9);ctx.lineWidth=2;rr(ctx,gx,gy,40,32,4);ctx.stroke();ctx.beginPath();ctx.moveTo(gx,gy+11);ctx.lineTo(gx+40,gy+11);ctx.moveTo(gx,gy+21.5);ctx.lineTo(gx+40,gy+21.5);ctx.moveTo(gx+14,gy+11);ctx.lineTo(gx+14,gy+32);ctx.stroke();ctx.restore();
  T(ctx,name,x+86,y+h/2+10,{f:"mono",w:500,size:28,color:rgba(mix(INK,SOFT,g*0.7),0.95)});T(ctx,label,x+w-24,y+h/2+10,{w:700,size:28,align:"right",color:rgba(mix(SOFT,[120,124,136],g),1)});}
scene("nothing",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p2_room(ctx,S,t);
  const tR=c("records"),tN=c("nobody"),tB=c("bill"),tC=c("cant"),tCh=c("choice");ctx.save();drift(ctx,t,sc,{z:0.01,y:520});
  // the drawing, as the last chapter left it; observe lit, and the platform's own records, which nobody reads
  const ph1=1-fin(t,w("nobody","Each domain")-0.6,0.6),dimK=fin(t,w("records","own records")-0.3,0.8);
  if(ph1>0.01)withA(ctx,ph1,()=>{p2_ref(ctx,t,{name:P2_ALL,sub:P2_ALL,prod:[1,1,1,1,1,1,1,0],slot:1,refName:1,nothing:1,dim:[1,1,1,1,1,1,1,0].map(v=>v*dimK*0.96),hi:[0,0,0,0,0,0,0,dimK*0.6]});
    const ST=[["system.lakeflow.job_run_timeline","every job's runs","runs"],["system.query.history","every query","query"],["system.billing.usage","what each one costs","costs"]],nr=fin(t,w("nobody","Nobody reads")-0.1,0.8);
    ST.forEach(([nm,l,k],i)=>{const t0=w("records",k)-0.3;if(t>t0)arrive(ctx,960,283+i*96,t,t0,()=>p2_table(ctx,300,250+i*96,1320,nm,l,{hi:pulseAt(t,t0+0.2,1.0),grey:nr}),{dy:12});});
    withA(ctx,fin(t,w("nobody","Nobody reads")-0.2,0.5),()=>tag(ctx,960,590,"nobody reads them",AMBER,{align:"center",size:30}));});
  // each domain watches its own; nobody watches the whole
  const ph2=fin(t,w("nobody","Each domain")-0.1,0.6)*(1-fin(t,tB-0.5,0.6));
  if(ph2>0.01)withA(ctx,ph2,()=>{p2_slab(ctx,t,{eyes:fin(t,w("nobody","watches its own")-0.3,1.0),whole:fin(t,w("nobody","nobody watches")-0.1,0.6),capHi:fin(t,w("nobody","the whole")-0.2,0.6)});
    withA(ctx,fin(t,w("nobody","nobody watches")-0.1,0.5),()=>tag(ctx,960,812,"nobody watches the whole",AMBER,{align:"center",size:30}));});
  // finance's ticket, the bill up by half, and the two poor choices
  const ph3=fin(t,tB-0.3,0.6);if(ph3>0.01)withA(ctx,ph3,()=>{
    arrive(ctx,520,300,t,tB-0.2,()=>psaCard(ctx,140,180,760,"ticket · raised by finance",["Why is the platform's bill","up by half since June?"],BIZ,{size:32,foot:"open",footCol:SOFT}),{dy:-12});
    arrive(ctx,1380,420,t,tB,()=>p2_bill(ctx,960,160,840,520,t,{n:clamp((t-tB)/1.4,0,1)*4,hot:fin(t,w("bill","half")-0.2,0.6),rise:fin(t,w("bill","half"),0.5),hi:pulseAt(t,w("bill","half"),1.4)}),{dy:-12});
    withA(ctx,fin(t,w("cant","which jobs")-0.3,0.5),()=>{tag(ctx,520,470,"which jobs?",AMBER,{align:"center",size:30});});withA(ctx,fin(t,w("cant","whose")-0.3,0.5),()=>{tag(ctx,520,540,"whose are they?",AMBER,{align:"center",size:30});});
    const two=[[["pay it"],w("choice","pay it")],[["cut every","domain back"],w("choice","cut every domain")]];two.forEach(([L,t0],i)=>{withA(ctx,fin(t,t0-0.2,0.5),()=>{const x=140+i*390,y=630,cw=370;glass(ctx,x,y,cw,120,16,[200,196,190],{glow:8,ea:0.7,fill:"rgba(10,10,16,0.95)"});
      L.forEach((l,j)=>T(ctx,l,x+cw/2,y+70+(j-(L.length-1)/2)*36,{size:30,w:800,align:"center",color:rgba(INK,0.9)}));
      const k=fin(t,w("choice","whether")-0.1+i*0.15,0.4);if(k>0.01)kt_rcross(ctx,x+cw-22,y+22,16,k);});});
    withA(ctx,fin(t,w("choice","whether it grew")-0.2,0.5),()=>tag(ctx,1380,760,"whether it grew or not",AMBER,{align:"center",size:30}));});
  ctx.restore();vign(ctx,S);});

/* ---------- 7. Whose part it is ---------- */
scene("whose",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);
  const tK=c("kept"),tL=c("like"),tT=c("team"),mA=1-fin(t,tL-0.6,0.9),uA=fin(t,tL-0.6,0.9);
  psaRooms(ctx,[[mA,ctx=>{const cam=p2_cam(t,[[0,960,540,1.0],[0.3,P2_HX+70,410,2.1]],3.4);p2_mountain(ctx,S,t,{d:0.95,road:1,hk:1,cam});ctx.save();p2_camAt(ctx,cam);
    // a traveller's load comes up to it, as every day
    const v=24,[d_,a_]=p2_go(t,0.2,tL,v),u0=Math.min(P2_U(P2_HX+86),P2_U(1240)+d_/P2_LEN);p2_onRoad(ctx,u0,c_=>psaHorse(c_,0,0,0.16,t,{dir:-1,ph:0.3,rate:v/(93*0.16),amp:a_,pack:true}));
    p2_onRoad(ctx,u0-0.009,c_=>psaWalker(c_,0,0,0.18,t,{kind:"porter",dir:-1,ph:0.7,rate:v/(103.6*0.18),amp:a_}));
    ctx.restore();
    // the words at their own size, beside what they name
    const[hx,hy]=p2_scr(cam,P2_HX,P2_HK[1]),[lx,ly]=p2_scr(cam,(P2_LK[0]+P2_LK[1])/2+20,P2_LK[2]);
    psaName(ctx,"Hakone",hx,hy-118,{size:34,align:"center"});
    withA(ctx,fin(t,w("high","highest")-0.2,0.5)*(1-fin(t,tK-0.3,0.5)),()=>tag(ctx,hx+40,hy-200,"the highest station on the road",PSC,{align:"center",size:30}));
    withA(ctx,fin(t,w("high","seven hundred")-0.2,0.5),()=>tag(ctx,hx-70,hy+104,"more than 700 m up",SOFT,{align:"center",size:30}));
    withA(ctx,fin(t,w("high","by the lake")-0.2,0.5),()=>tag(ctx,lx+90,ly+104,"by the lake",SOFT,{align:"center",size:30}));
    withA(ctx,fin(t,w("kept","shogunate")-0.2,0.5),()=>tag(ctx,hx+40,hy-200,"kept by the road's owner, for the whole road",PSC,{align:"center",size:30}));}],
  [uA,ctx=>{p2_room(ctx,S,t);ctx.save();drift(ctx,t-tL+0.6,{dur:16},{z:0.015,y:540});
    // the platform, with every domain's logic on it: observe serves them all, so no one domain should have to build it
    p2_slab(ctx,t,{capHi:fin(t,w("like","every domain")-0.3,0.6),own:fin(t,w("team","business")-0.3,0.8),eyes:0});
    withA(ctx,fin(t,w("like","no one domain")-0.2,0.5)*(1-fin(t,tT-0.3,0.5)),()=>tag(ctx,960,250,"it serves every domain: no one domain should build it",PSC,{align:"center",size:30}));
    withA(ctx,fin(t,w("team","business")-0.2,0.5),()=>tag(ctx,960,250,"each domain's logic: the business",BIZ,{align:"center",size:30}));
    const tP=w("team","platform team");withA(ctx,fin(t,tP-0.3,0.5),()=>{const cw=(1500-45-24)/8,cx=210+12+7*cw+cw/2;tag(ctx,cx-60,800,"health and cost: the platform team",TECH,{align:"center",size:30});});
    ctx.restore();}]]);
  vign(ctx,S);});

/* ---------- 8. The platform watches itself ---------- */
// the platform's own dashboard: its runs by cost, each with its domain's tag, and a budget for each domain
const P2_RUNS=[["meter readings, nightly","network","5 h 40 min",1.0],["reports warehouse","retail","on all night",0.62],["billing load","retail","40 min",0.18],["outage history","network","25 min",0.12],["month-end close","finance","35 min",0.1]];
const P2_BUD=[["network",1.18],["retail",1.04],["finance",0.71],["enterprise",0.66]];
function p2_dash(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const X=120,Y=120,Wd=1680,Hd=624;glass(ctx,X,Y,Wd,Hd,20,TECC,{glow:12,ea:0.8,fill:"rgba(6,12,12,0.96)"});
  logo(ctx,"databricks",X+28,Y+24,30);T(ctx,"the platform's own dashboard",X+70,Y+50,{f:"mono",w:500,size:28,color:rgba(TECC,1)});
  // left: every run, how long it took, what it cost
  const rw=o.rows==null?1:o.rows;T(ctx,"runs, by cost",X+40,Y+112,{w:800,size:30});
  P2_RUNS.forEach(([nm,dm,tm,c_],i)=>{const q=clamp(rw*5-i,0,1);if(q<=0.01)return;const y=Y+170+i*84,h_=(o.rowHi||[])[i]||0;withA(ctx,q*(1-((o.dim||0)*(h_>0.01?0:1))*0.6),()=>{
    if(h_>0.01){ctx.fillStyle=rgba(AMBER,0.12*h_);rr(ctx,X+24,y-34,1000,66,12);ctx.fill();ctx.strokeStyle=rgba(AMBER,0.8*h_);ctx.lineWidth=2;rr(ctx,X+24,y-34,1000,66,12);ctx.stroke();}
    T(ctx,nm,X+44,y+10,{w:700,size:28,color:rgba(INK,0.95)});const tg=(o.tags||0);if(tg>0.01)withA(ctx,clamp(tg*5-i,0,1),()=>p2_chip(ctx,X+400,y,dm,null,{col:APPC,a:1}));
    withA(ctx,o.dur==null?1:o.dur,()=>T(ctx,tm,X+780,y+10,{w:600,size:28,align:"right",color:rgba(SOFT,1)}));const ca=o.costA==null?1:o.costA,bw=200*c_*ca;if(ca>0.01){ctx.fillStyle=rgba(i<2?AMBER:TECC,0.75);rr(ctx,X+810,y-11,Math.max(6,bw),22,6);ctx.fill();}});});
  // right: a budget for each domain, and the alert when one is passed
  const bq=o.bud||0;if(bq>0.01)withA(ctx,bq,()=>{T(ctx,"budgets, by domain",X+1100,Y+112,{w:800,size:30});
    P2_BUD.forEach(([dm,f],i)=>{const y=Y+170+i*84,k=clamp(bq*4-i,0,1);if(k<=0.01)return;withA(ctx,k,()=>{T(ctx,dm,X+1100,y+10,{w:700,size:28,color:rgba(APPC,1)});
      ctx.fillStyle="rgba(255,255,255,0.08)";rr(ctx,X+1290,y-12,300,24,8);ctx.fill();const v=Math.min(f,1.2)*(o.fill==null?1:o.fill);ctx.fillStyle=rgba(f>1?AMBER:TECC,0.8);rr(ctx,X+1290,y-12,300*Math.min(v,1),24,8);ctx.fill();
      if(f>1&&v>1){ctx.fillStyle=rgba(AMBER,0.95);rr(ctx,X+1590,y-12,300*(v-1),24,8);ctx.fill();}ctx.strokeStyle="rgba(255,255,255,0.5)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X+1590,y-20);ctx.lineTo(X+1590,y+20);ctx.stroke();});});
    if((o.alert||0)>0.01)withA(ctx,o.alert,()=>{glass(ctx,X+1100,Y+530,540,66,16,AMBER,{glow:14,ea:0.85,fill:"rgba(20,14,6,0.96)"});T(ctx,"alert: network passed its budget",X+1124,Y+573,{w:700,size:28,color:rgba(AMBER,1)});});});});}
scene("watch",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p2_room(ctx,S,t);
  const tBu=c("build"),tTg=c("tags"),tD=c("dash"),tF=c("found"),tI=c("idle"),tX=c("fix"),tBk=c("back"),tSh=c("share");ctx.save();drift(ctx,t,sc,{z:0.01,y:520});
  // the drawing: observe gets what it was missing, from the platform's own records
  const ph1=1-fin(t,tTg-0.4,0.6);if(ph1>0.01)withA(ctx,ph1,()=>p2_ref(ctx,t,{name:P2_ALL,sub:P2_ALL,prod:[1,1,1,1,1,1,1,0],slot:1,refName:1,nothing:1,obs:clamp((t-w("build","missing part")+0.2)/1.4,0,1),obsHi:pulseAt(t,w("build","own records"),1.6),hi:[0,0,0,0,0,0,0,pulseAt(t,w("build","missing part"),1.6)]}));
  // the dashboard: tags, runs, costs and budgets; then the two things it found
  const ph2=fin(t,tTg-0.3,0.6)*(1-fin(t,tX-0.4,0.6));
  if(ph2>0.01)withA(ctx,ph2,()=>p2_dash(ctx,t,{rows:clamp((t-tTg+0.2)/1.4,0,1),tags:clamp((t-w("tags","tag")+0.2)/1.4,0,1),dur:fin(t,w("dash","how long")-0.3,0.6),costA:fin(t,w("dash","what it cost")-0.3,0.8),bud:clamp((t-w("dash","budget")+0.2)/1.4,0,1),fill:fin(t,w("dash","budget"),1.6),alert:fin(t,w("dash","alert")-0.1,0.5),
    rowHi:[fin(t,w("found","One job")-0.2,0.5),fin(t,tI-0.1,0.5)],dim:fin(t,w("found","One job")-0.2,0.5)}));
  withA(ctx,fin(t,w("tags","splits")-0.3,0.5)*(1-fin(t,tD-0.3,0.5)),()=>tag(ctx,960,806,"every job and warehouse tagged with its domain",APPC,{align:"center",size:30}));
  withA(ctx,fin(t,w("found","three years")-0.3,0.5)*(1-fin(t,tI-0.3,0.5)),()=>tag(ctx,960,806,"three years rebuilt every night, not just the day's new readings",AMBER,{align:"center",size:30}));
  withA(ctx,fin(t,tI,0.5)*(1-fin(t,tX-0.5,0.5)),()=>tag(ctx,960,806,"on all night, for a dashboard nobody opened after six",AMBER,{align:"center",size:30}));
  // the data team's two pull requests, reviewed by the data team
  const ph3=fin(t,tX-0.3,0.6)*(1-fin(t,tBk-0.4,0.6));if(ph3>0.01)withA(ctx,ph3,()=>{
    [["Load only the day's new readings",0],["Stop the warehouse when it's idle",1]].forEach(([s_,i])=>{const t0=w("fix","changes")-0.2+i*0.4;if(t>t0)arrive(ctx,960,300+i*230,t,t0,()=>psaCard(ctx,420,210+i*230,1080,"pull request · data team",[s_],TECH,{size:32,foot:fin(t,w("fix","reviews")-0.1,0.3)>0.5?"reviewed by the data team":"",footTick:fin(t,w("fix","reviews"),0.5),footCol:TECH}),{dy:-10});});});
  // November: the bill back to June's; finance closes its ticket; each domain's share
  const ph4=fin(t,tBk-0.3,0.6);if(ph4>0.01)withA(ctx,ph4,()=>{const sp=fin(t,w("share","own share")-0.3,0.8);
    arrive(ctx,1380,420,t,tBk-0.2,()=>p2_bill(ctx,960,160,840,520,t,{n:4+clamp((t-tBk)/1.6,0,1)*2,split:sp,names:true}),{dy:-12});
    const cl=fin(t,w("back","closes")-0.2,0.5);arrive(ctx,520,300,t,tBk,()=>psaCard(ctx,140,180,760,"ticket · raised by finance",["Why is the platform's bill","up by half since June?"],BIZ,{size:32,foot:cl>0.5?"checked by finance · closed":"open",footCol:cl>0.5?PS_OK:SOFT,footTick:cl>0.5?1:0}),{dy:-12});
    withA(ctx,fin(t,w("back","June's")-0.3,0.5),()=>tag(ctx,520,500,"back to June's",PS_OK,{align:"center",size:30}));
    withA(ctx,sp,()=>tag(ctx,520,580,"each domain's own share, every month",APPC,{align:"center",size:30}));});
  ctx.restore();vign(ctx,S);});

/* ---------- 9. The data practice on the map ---------- */
const P2_SV=["bring in","store","process","serve","catalogue and govern","orchestrate","observe","secure"];
// an association, as ArchiMate draws it: a plain line, drawn out from (x0, y0) as p goes from 0 to 1
function p2_assoc(ctx,x0,y0,x1,y1,col,a,p){if(a<=0.01||p<=0)return;const u=clamp(p,0,1);withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,u),lerp(y0,y1,u));ctx.stroke();ctx.restore();});}
// a work package, as ArchiMate draws it: a rounded box with a circular arrow
function p2_work(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(14,8,16,0.95)"});ctx.fillStyle=rgba(col,0.14);rr(ctx,x,y,w,h,22);ctx.fill();
  const gx=x+w-30,gy=y+26;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(gx,gy,10,-Math.PI*0.2,Math.PI*1.45);ctx.stroke();const ax=gx+10*Math.cos(-Math.PI*0.2),ay=gy+10*Math.sin(-Math.PI*0.2);ctx.beginPath();ctx.moveTo(ax+5,ay-1);ctx.lineTo(ax-4,ay-5);ctx.lineTo(ax-1,ay+5);ctx.closePath();ctx.fill();ctx.restore();
  wrapT(ctx,name,x+w/2-10,y+h/2+10,w-70,{size:o.size||28,w:700,align:"center",color:rgba(INK,0.96),lh:32});});}
scene("practice",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o);p2_room(ctx,S,t);
  const tSv=c("services"),tSw=c("software"),tR=c("ref"),tG=c("gap");ctx.save();drift(ctx,t,sc,{z:0.012,y:470});
  const MIG=[248,184,226];
  // Tomás's map: the application layer, each domain's data products in it, and the technology layer under them
  psaBand(ctx,30,160,"application layer",APPC,fin(t,0.2,0.8));psaBand(ctx,210,380,"technology layer",TECC,fin(t,0.5,0.8));
  P2_DOM.forEach(([nm,col],i)=>psaEl(ctx,450+i*350,76,300,86,nm+" data products",col,"component",{a:fin(t,0.7+i*0.15,0.6),size:28}));
  // the eight parts, as the platform's services, serving every domain
  const sx=i=>111+i*214,svA=i=>fin(t,w("services","eight parts")-0.3+i*0.12,0.5),obsHi=pulseAt(t,w("gap","missing"),1.8);
  P2_SV.forEach((s_,i)=>psaEl(ctx,sx(i),270,200,96,s_,TECC,"service",{a:svA(i),size:28,hi:pulseAt(t,w("services","services"),1.4)+(i===6?obsHi:0)}));
  const tServe=w("services","every domain")-0.3;P2_DOM.forEach((d_,i)=>psaRel(ctx,600+i*350,268,600+i*350,166,"serve",TECC,fin(t,tServe,0.4)*0.9,fin(t,tServe+i*0.12,0.6)));
  if(obsHi>0.01)withA(ctx,obsHi,()=>{ctx.save();ctx.strokeStyle=rgba(PSC,0.95);ctx.lineWidth=2.6;ctx.setLineDash([8,6]);rr(ctx,sx(6)-8,262,216,112,56);ctx.stroke();ctx.setLineDash([]);ctx.restore();});
  // the system software under them: Databricks for most; the identity provider and the network for security
  const swA=fin(t,w("software","system software")-0.3,0.6)*(1-fin(t,tR-0.1,0.7)),tDb=w("software","Databricks"),tId=w("software","identity provider");
  if(swA>0.01)withA(ctx,swA,()=>{withA(ctx,fin(t,tDb-0.3,0.5),()=>{psaEl(ctx,111,418,1484,90,"",TECC,"software",{size:30});logo(ctx,"databricks",140,444,40);T(ctx,"Databricks",196,476,{w:800,size:32});T(ctx,"system software",1560,476,{f:"mono",w:500,size:28,align:"right",color:rgba(TECC,1)});
      for(let i=0;i<7;i++)psaRel(ctx,sx(i)+100,418,sx(i)+100,368,"realise",TECC,0.9,fin(t,tDb+i*0.08,0.6));});
    withA(ctx,fin(t,tId-0.3,0.5),()=>{psaEl(ctx,1609,418,200,90,"identity provider",TECC,"software",{size:28});psaEl(ctx,1609,520,200,62,"network",TECC,"node",{size:28});psaRel(ctx,1709,418,1709,368,"realise",TECC,0.9,fin(t,tId,0.6));});});
  // drawn without the software: the reference architecture; any product can change under it
  withA(ctx,fin(t,tR-0.1,0.6),()=>{tag(ctx,1500,240,"the reference architecture: what it does",TECC,{align:"center",size:30});
    withA(ctx,fin(t,w("ref","any product"),0.5),()=>{ctx.save();ctx.strokeStyle=rgba(TECC,0.6);ctx.lineWidth=2.2;ctx.setLineDash([10,8]);rr(ctx,111,418,1698,90,14);ctx.stroke();ctx.setLineDash([]);ctx.restore();T(ctx,"any product, under it",960,474,{w:700,size:28,align:"center",color:rgba(SOFT,1)});});});
  // the gap between the platform today and the one it should be, as ArchiMate draws it (and Today, and where it's going): a gap,
  // associated with the two plateaus by plain lines; then the work that closes it, realising the platform it should be
  const gA=fin(t,tG-0.3,0.6);if(gA>0.01)withA(ctx,gA,()=>{psaBand(ctx,610,270,"implementation and migration",MIG,1);
    archEl(ctx,140,668,500,96,"the platform today",MIG,"plateau",{size:30,a:fin(t,w("gap","today")-0.3,0.5)});archEl(ctx,1280,668,500,96,"the platform it should be",MIG,"plateau",{size:30,a:fin(t,w("gap","should be")-0.3,0.5)});
    const tA=w("gap","drawn")-0.3;archEl(ctx,700,668,520,96,"observe: missing",MIG,"gap",{size:30,gs:13,a:fin(t,tA,0.5),hi:pulseAt(t,tA+0.3,1.4)});
    p2_assoc(ctx,640,716,700,716,MIG,fin(t,tA,0.4),fin(t,tA+0.1,0.5));p2_assoc(ctx,1280,716,1220,716,MIG,fin(t,tA,0.4),fin(t,tA+0.1,0.5));
    p2_work(ctx,700,786,520,76,"build the part that watches",MIG,{a:fin(t,w("gap","work")-0.3,0.5),hi:pulseAt(t,w("gap","closes"),1.4)});
    psaRel(ctx,1222,824,1420,766,"realise",MIG,fin(t,w("gap","closes")-0.2,0.4),fin(t,w("gap","closes"),0.6));});
  ctx.restore();vign(ctx,S);});

/* ---------- 10. A station on the mountain ---------- */
scene("end",(ctx,S,t,sc)=>{const c=id=>cue(sc,id),w=(id,s,o)=>kt_w(sc,id,s,o),B=c("breath");
  const tD=c("data"),tN=c("next"),outA=1-fin(t,B+0.6,0.8),mA=(1-fin(t,tD-0.6,0.9))*outA,pA=fin(t,tD-0.6,0.9)*outA;if(outA<1)p2_base(ctx,S);
  psaRooms(ctx,[[mA,ctx=>{const cam=p2_driftCam(t,sc.dur,0.02,960,560);p2_mountain(ctx,S,t,{d:0.4,night:0.85,road:1,hk:1,lit:1,cam});ctx.save();p2_camAt(ctx,cam);
    // loads on the road, both ways, lights changing at the station on the mountain
    for(let i=0;i<6;i++){const k=(t*0.06+i/6)%1,P=i%2?P2_PROF.slice().reverse():P2_PROF;p2_runner(ctx,P,k,PSC,{r:4,trail:0.04});}
    psaName(ctx,"Hakone",P2_HX,P2_HK[1]-80,{size:32,align:"center"});
    withA(ctx,fin(t,w("station","two and a half")-0.3,0.6),()=>tag(ctx,960,200,"1618 to 1872: two and a half centuries",PSC,{align:"center",size:32}));
    ctx.restore();}],
  [pA,ctx=>{p2_room(ctx,S,t);ctx.save();drift(ctx,t-tD,{dur:12},{z:0.012,y:520});
    // the drawing whole: every part with something under it, and observe watching the rest
    const wt=fin(t,w("data","watches the rest")-0.3,0.8);p2_ref(ctx,t,{name:P2_ALL,sub:P2_ALL,prod:[1,1,1,1,1,1,1,0],slot:1,refName:1,obs:1,hi:[0,0,0,0,0,0,0,wt*0.6]});
    if(wt>0.01)withA(ctx,wt*0.8,()=>{for(let i=0;i<7;i++){const[x,y]=i<4?[P2_BX(i)+P2_BW/2,P2_BY+P2_BH]:[P2_RX+P2_RW*0.62,P2_RY(i-4)+P2_RH];ctx.save();ctx.strokeStyle=rgba(PSC,0.45);ctx.lineWidth=1.8;ctx.setLineDash([3,7]);ctx.beginPath();ctx.moveTo(P2_RX+P2_RW*0.62,P2_RY(3)+10);ctx.lineTo(x,y);ctx.stroke();ctx.setLineDash([]);ctx.restore();}});
    ctx.restore();
    withA(ctx,fin(t,tN-0.1,0.6),()=>tag(ctx,960,866,"Next: One platform, or many",PSC,{align:"center",size:34}));}]]);
  vign(ctx,S);
  psaEnd(ctx,S,t,B+0.6,"Inside the platform","Every part drawn, and one that watches the rest.","film 2 of 8");});

/* where the chapters meet: the drawing stays put, its camera gliding on, from Parts before products to Nobody watching; The
   platform watches itself opens on the drawing again once the platform with its domains has left (From words to data's joins.js) */
const CHAPTER_JOINS={glide:["along","across","products","nothing"],leave:["watch"],bare:(ctx,S,t)=>{p2_room(ctx,S,t);vign(ctx,S);}};
