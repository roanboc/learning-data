/* ===== Meaning machines can read: the film's own pictures =====
   Four ways to write meaning down, each with its colour: gold for the glossary, green for the taxonomy, violet for the ontology,
   blue for the semantic layer. They stack like the floors of one building. Genie (the orb and its chip) answers from what it can read.
   The history is drawn warm, on parchment (Linnaeus, Wilkins, Nightingale); the present is the films' dark glass.
   The labs and the scenarios draw with these too (LV, at the end). Film-only helpers start with mm_. */
const MM_GLO=[255,209,102],MM_TAX=[120,225,140],MM_ONT=[186,150,255],MM_SEM=[110,180,255],MM_INK=[176,190,255];
const MM_ASK=[255,166,138],MM_GEN=[228,236,255],MM_SEP="rgba(62,44,28,0.94)",MM_SEP2="rgba(104,78,50,0.9)";
const MM_L=[
 {k:"gloss",n:"Glossary",c:MM_GLO,q:"what does it mean?",s:"words, for people"},
 {k:"tax",n:"Taxonomy",c:MM_TAX,q:"what kind is it?",s:"kinds, in a hierarchy"},
 {k:"onto",n:"Ontology",c:MM_ONT,q:"how does it relate, and what's allowed?",s:"relationships and rules"},
 {k:"sem",n:"Semantic layer",c:MM_SEM,q:"how is it calculated?",s:"each number, defined once"}];
const MM_Q="Which learners are one microcredential away from a graduate certificate?";

/* ---------- the past: organic, warm, alive ----------
   History is drawn like living things and handled paper: flowing curves, strokes that taper, soft light from the upper left,
   and a gentle motion driven by t (branches sway, paper breathes). The systems of today stay crisp glass. */
// a point on a cubic bezier, and its tangent
function mm_bz(p0,p1,p2,p3,u){const v=1-u;return[v*v*v*p0[0]+3*v*v*u*p1[0]+3*v*u*u*p2[0]+u*u*u*p3[0],v*v*v*p0[1]+3*v*v*u*p1[1]+3*v*u*u*p2[1]+u*u*u*p3[1]];}
function mm_bzd(p0,p1,p2,p3,u){const v=1-u;return[3*v*v*(p1[0]-p0[0])+6*v*u*(p2[0]-p1[0])+3*u*u*(p3[0]-p2[0]),3*v*v*(p1[1]-p0[1])+6*v*u*(p2[1]-p1[1])+3*u*u*(p3[1]-p2[1])];}
// a limb: a stroke along a bezier that tapers from w0 to w1, drawn up to p, with a lit side and a shadow side
function mm_limb(ctx,p0,p1,p2,p3,w0,w1,p,col,o){o=o||{};if(p<=0.001)return;const n=Math.max(8,Math.round(26*p)),L=[],R=[],a=o.a==null?1:o.a;
  for(let i=0;i<=n;i++){const u=i/n*p,q=mm_bz(p0,p1,p2,p3,u),d=mm_bzd(p0,p1,p2,p3,u),ln=Math.hypot(d[0],d[1])||1,nx=-d[1]/ln,ny=d[0]/ln,w=lerp(w0,w1,Math.pow(u,0.8))/2;L.push([q[0]+nx*w,q[1]+ny*w]);R.push([q[0]-nx*w,q[1]-ny*w]);}
  withA(ctx,a,()=>{ctx.beginPath();ctx.moveTo(L[0][0],L[0][1]);for(let i=1;i<L.length;i++)ctx.lineTo(L[i][0],L[i][1]);const e=L[L.length-1],f=R[R.length-1];ctx.quadraticCurveTo((e[0]+f[0])/2+(e[0]-L[L.length-2][0]),(e[1]+f[1])/2+(e[1]-L[L.length-2][1]),f[0],f[1]);
    for(let i=R.length-1;i>=0;i--)ctx.lineTo(R[i][0],R[i][1]);ctx.closePath();ctx.fillStyle=rgba(col,1);ctx.fill();
    if(!o.flat){ctx.strokeStyle=rgba(mix(col,[255,236,200],0.45),0.55);ctx.lineWidth=Math.max(0.8,w0*0.12);ctx.lineCap="round";ctx.beginPath();L.forEach((q,i)=>{const r=R[i],x=lerp(q[0],r[0],0.28),y=lerp(q[1],r[1],0.28);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
      ctx.strokeStyle=rgba(mix(col,[0,0,0],0.5),0.5);ctx.beginPath();R.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();}
    if(o.glow>0){ctx.save();ctx.globalCompositeOperation="lighter";ctx.strokeStyle=rgba(o.gcol||[255,200,120],0.55*o.glow);ctx.lineWidth=3;ctx.shadowColor=rgba(o.gcol||[255,200,120],0.9);ctx.shadowBlur=14;ctx.beginPath();for(let i=0;i<=n;i++){const q=mm_bz(p0,p1,p2,p3,i/n*p);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);}ctx.stroke();ctx.restore();}});}
// a leaf, soft, turning gently
function mm_leaf(ctx,x,y,s,an,col,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(an);const g=ctx.createLinearGradient(-s,-s*0.4,s,s*0.4);g.addColorStop(0,rgba(mix(col,[255,255,220],0.3),1));g.addColorStop(1,rgba(mix(col,[0,0,0],0.35),1));
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(s*0.4,-s*0.45,s*1.1,-s*0.35,s*1.4,0);ctx.bezierCurveTo(s*1.1,s*0.35,s*0.4,s*0.45,0,0);ctx.fill();ctx.strokeStyle=rgba(mix(col,[0,0,0],0.45),0.6);ctx.lineWidth=Math.max(0.6,s*0.06);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(s*0.7,-s*0.05,s*1.3,0);ctx.stroke();ctx.restore();});}
// handled paper: soft uneven edges, a curled corner, light from the upper left, and a slow breath (o.t, o.seed)
function mm_parch(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sd=o.seed||0,tt=o.t||0,br=Math.sin(tt*0.9+sd*1.7);
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2+(o.flat?0:br*1.5));ctx.rotate((o.rot||0)+(o.flat?0.0015:0.004)*br);ctx.translate(-w/2,-h/2);
    const j=(k,m)=>(hash(sd*13+k,5)-0.5)*m,bw=Math.min(w,h)*0.03+1.2,cu=o.flat?0:Math.min(26,Math.min(w,h)*0.14)*(0.85+0.15*br);
    const edge=()=>{ctx.beginPath();ctx.moveTo(3,2+j(1,2));ctx.quadraticCurveTo(w*0.5,j(2,bw*2),w-3,2+j(3,2));ctx.quadraticCurveTo(w+j(4,bw*2),h*0.5,w-2,h-cu-2);ctx.quadraticCurveTo(w-cu*0.35,h-cu*0.3,w-cu-2,h-1);
      ctx.quadraticCurveTo(w*0.5,h+j(5,bw*2),3,h-2+j(6,2));ctx.quadraticCurveTo(j(7,bw*2),h*0.5,3,2+j(1,2));ctx.closePath();};
    ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=o.flat?8:24+4*br;ctx.shadowOffsetY=o.flat?2:8+2*br;edge();ctx.fillStyle=o.fill||"#e7dabe";ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,250,236,0.36)");g.addColorStop(0.55,"rgba(255,240,210,0.04)");g.addColorStop(1,"rgba(96,66,34,0.24)");edge();ctx.fillStyle=g;ctx.fill();
    if(!o.flat){const r=ctx.createRadialGradient(w*0.25,h*0.2,4,w*0.25,h*0.2,Math.max(w,h));r.addColorStop(0,"rgba(255,255,240,0.12)");r.addColorStop(1,"rgba(255,255,240,0)");ctx.fillStyle=r;edge();ctx.fill();
      ctx.fillStyle="rgba(196,176,140,0.95)";ctx.beginPath();ctx.moveTo(w-2,h-cu-2);ctx.quadraticCurveTo(w-cu*0.9,h-cu*0.9,w-cu-2,h-1);ctx.quadraticCurveTo(w-cu*0.35,h-cu*0.3,w-2,h-cu-2);ctx.fill();}
    if(o.hi>0){ctx.strokeStyle="rgba(214,150,50,"+(0.95*o.hi)+")";ctx.lineWidth=3.5;ctx.shadowColor="rgba(255,190,90,0.9)";ctx.shadowBlur=16*o.hi;edge();ctx.stroke();ctx.shadowBlur=0;}
    if(o.draw)o.draw(ctx,w,h);ctx.restore();});}
// the European robin, the bird from What's in a word: one soft body, a breast of orange, breathing and looking about
function mm_robin(ctx,x,y,s,a,t){t=t||0;withA(ctx,a==null?1:a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);const br=1+0.018*Math.sin(t*2.6),tilt=0.08*Math.sin(t*0.9)+0.06*Math.sin(t*2.3),flick=Math.max(0,Math.sin(t*1.7))**6*0.25;
  // tail, tapering, with a flick now and then
  ctx.save();ctx.translate(-20,6);ctx.rotate(-0.42-flick);ctx.beginPath();ctx.moveTo(2,-5);ctx.bezierCurveTo(-10,-6,-24,-9,-38,-10);ctx.bezierCurveTo(-45,-9,-47,-2,-45,3);ctx.bezierCurveTo(-42,6,-38,6,-34,5);ctx.bezierCurveTo(-22,5,-10,5,2,5);ctx.closePath();
  let g=ctx.createLinearGradient(0,-10,0,6);g.addColorStop(0,"#8a6c4e");g.addColorStop(1,"#3a2a1c");ctx.fillStyle=g;ctx.fill();ctx.strokeStyle="rgba(250,230,200,0.22)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-6,-1);ctx.quadraticCurveTo(-24,-3,-42,-3);ctx.moveTo(-8,2);ctx.quadraticCurveTo(-26,2,-40,2);ctx.stroke();ctx.restore();
  // legs, thin and tapered, gripping
  ctx.strokeStyle="#4a3526";ctx.lineCap="round";[[2,-1],[12,1]].forEach(([lx,d])=>{ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(lx,22);ctx.quadraticCurveTo(lx+d*2,34,lx+d,43);ctx.stroke();ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(lx+d-6,45);ctx.quadraticCurveTo(lx+d,41,lx+d+7,45);ctx.stroke();});
  // body, one flowing shape from crown to tail, breathing
  ctx.save();ctx.scale(br,br);ctx.beginPath();ctx.moveTo(-26,2);ctx.bezierCurveTo(-24,-18,-2,-24,12,-26);ctx.bezierCurveTo(22,-40,40,-36,42,-22);ctx.bezierCurveTo(44,-10,36,-2,34,6);ctx.bezierCurveTo(30,22,12,30,-4,28);ctx.bezierCurveTo(-18,26,-28,16,-26,2);ctx.closePath();
  g=ctx.createRadialGradient(8,-24,4,4,0,52);g.addColorStop(0,"#b08a64");g.addColorStop(0.55,"#7a5c40");g.addColorStop(1,"#3f2e20");ctx.fillStyle=g;ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;
  ctx.strokeStyle="rgba(40,26,16,0.55)";ctx.lineWidth=1.8;ctx.stroke();
  // the orange face and breast, soft-edged
  ctx.save();ctx.clip();ctx.beginPath();ctx.moveTo(44,-26);ctx.bezierCurveTo(36,-34,24,-30,22,-20);ctx.bezierCurveTo(20,-6,10,6,6,20);ctx.bezierCurveTo(16,26,30,18,36,4);ctx.bezierCurveTo(42,-6,48,-16,44,-26);ctx.closePath();
  g=ctx.createRadialGradient(30,-12,2,26,-8,30);g.addColorStop(0,"#ff9a56");g.addColorStop(0.7,"#e0662e");g.addColorStop(1,"rgba(200,90,40,0.85)");ctx.fillStyle=g;ctx.fill();
  ctx.fillStyle="rgba(244,232,210,0.85)";ctx.beginPath();ctx.ellipse(4,24,16,8,-0.15,0,TAU);ctx.fill();
  // the wing, folded, with feathers
  ctx.beginPath();ctx.moveTo(-20,-4);ctx.bezierCurveTo(-8,-16,10,-14,14,-2);ctx.bezierCurveTo(12,10,-4,18,-24,14);ctx.bezierCurveTo(-28,8,-26,0,-20,-4);ctx.closePath();g=ctx.createLinearGradient(-20,-14,10,16);g.addColorStop(0,"#8a6a4a");g.addColorStop(1,"#4a3524");ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle="rgba(250,230,200,0.28)";ctx.lineWidth=1.1;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-16+i*6,2+i*3);ctx.quadraticCurveTo(-6+i*6,6+i*3,-20+i*4,12+i*1.5);ctx.stroke();}ctx.restore();
  // head: eye with a glint, and a small beak, tilting
  ctx.save();ctx.translate(30,-22);ctx.rotate(tilt);ctx.fillStyle="#1c140e";ctx.beginPath();ctx.ellipse(2,-2,3.2,3.4,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.85)";ctx.beginPath();ctx.arc(3,-3.2,1,0,TAU);ctx.fill();
  ctx.fillStyle="#2e2218";ctx.beginPath();ctx.moveTo(11,-4);ctx.quadraticCurveTo(18,-2,21,0);ctx.quadraticCurveTo(17,1.5,11,2);ctx.closePath();ctx.fill();ctx.restore();ctx.restore();ctx.restore();});}
// one of Nightingale's hospital forms: the same columns on every form, filled in by hand, on breathing paper
const MM_FCOLS=["disease","admitted","recovered","died","days"];
function mm_form(ctx,x,y,w,h,name,seed,o){o=o||{};mm_parch(ctx,x,y,w,h,{a:o.a,rot:o.rot,t:o.t,seed:seed+3,draw:(c,W_,H_)=>{
  T(c,name,24,44,{w:800,size:24,color:MM_SEP});T(c,"return for the year",24,70,{f:"mono",w:500,size:14,color:MM_SEP2});
  const cw=(W_-40)/MM_FCOLS.length,hy=112;if(o.band>0){c.fillStyle="rgba(230,160,50,"+(0.38*o.band)+")";c.beginPath();c.moveTo(12,hy-24);c.quadraticCurveTo(W_/2,hy-27,W_-12,hy-24);c.lineTo(W_-12,hy+10);c.quadraticCurveTo(W_/2,hy+13,12,hy+10);c.closePath();c.fill();}
  MM_FCOLS.forEach((s,i)=>T(c,s,20+i*cw+(i?cw/2:0),hy,{f:"mono",w:500,size:14,align:i?"center":"left",color:MM_SEP}));
  c.strokeStyle="rgba(90,66,40,0.55)";c.lineWidth=1.4;c.beginPath();c.moveTo(16,hy+10);c.quadraticCurveTo(W_/2,hy+12+hash(seed,2)*3,W_-16,hy+10);c.stroke();
  for(let i=1;i<MM_FCOLS.length;i++){c.beginPath();c.moveTo(20+i*cw,hy-22);c.quadraticCurveTo(20+i*cw+(hash(i,seed)-0.5)*5,(hy+H_)/2,20+i*cw,H_-20);c.strokeStyle="rgba(90,66,40,0.22)";c.stroke();}
  const dz=["fever","cholera","wounds","phthisis","dysentery","measles","typhus"];const rows=Math.floor((H_-hy-30)/34),fill=o.fill==null?1:o.fill;
  for(let r=0;r<rows;r++){if(r>=rows*fill)break;const yy=hy+42+r*34;T(c,dz[(r+seed)%dz.length],20,yy,{w:600,size:16,color:"rgba(52,40,30,0.85)"});
    for(let i=1;i<MM_FCOLS.length;i++)T(c,""+(3+Math.floor(hash(r*7+i,seed)*(i===1?90:i===3?9:40))),20+i*cw+cw/2,yy,{w:600,size:16,align:"center",color:"rgba(52,40,30,0.8)"});}}});}
// a tag of paper tied to a branch: a rank, and a name
function mm_ptag(ctx,x,y,rank,name,a,t,sd,hi){const w=Math.max(150,tw(ctx,name,24,800)+40),h=62;withA(ctx,a,()=>{ctx.strokeStyle="rgba(120,90,60,0.8)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x,y-26);ctx.quadraticCurveTo(x+3*Math.sin(t+sd),y-14,x,y);ctx.stroke();
  mm_parch(ctx,x-w/2,y,w,h,{t,seed:sd,flat:true,hi,draw:(c)=>{T(c,rank,16,24,{f:"mono",w:500,size:14,color:MM_SEP2});T(c,name,16,50,{w:800,size:24,color:MM_SEP});}});});}
/* Linnaeus's hierarchy, as a living tree: the robin's path from the kingdom to its species, and other branches around it.
   Each node: [x, y, parent, width at the base, width at the tip, on the robin's path, label] */
const MM_TREE=[[330,836,-1,34,24,1],[370,650,0,40,17,1,["KINGDOM","Animalia"]],[610,520,1,16,11,1,["CLASS","Aves"]],[860,470,2,11,8,1,["ORDER","Passeriformes"]],[1100,445,3,8,6,1,["GENUS","Erithacus"]],[1330,425,4,6,3,1],
  [210,470,1,13,4,0,["","Mammalia"]],[430,390,1,11,3,0,["","Amphibia"]],[150,610,1,10,3,0,["","Insecta"]],[680,370,2,8,2,0],[740,610,2,7,2,0],[930,360,3,6,2,0],[980,560,3,5,2,0],[1160,530,4,4,1.5,0],[1180,360,4,4,1.5,0]];
function mm_treePos(i,t){const n=MM_TREE[i];let d=0,k=i;while(MM_TREE[k][2]>=0){d++;k=MM_TREE[k][2];}return[n[0]+Math.sin(t*0.7+i*1.3)*1.6*d,n[1]+Math.cos(t*0.6+i)*1.1*d];}
function mm_tree(ctx,t,grow,path,labA){const P=MM_TREE.map((n,i)=>mm_treePos(i,t)),bark=[108,80,54];
  MM_TREE.forEach((n,i)=>{if(n[2]<0)return;const pp=P[n[2]],q=P[i],dx=q[0]-pp[0],dy=q[1]-pp[1],L=Math.hypot(dx,dy),bend=(hash(i,4)-0.5)*0.35;
    const c1=[pp[0]+dx*0.3-dy*bend,pp[1]+dy*0.3+dx*bend],c2=[pp[0]+dx*0.7-dy*bend*0.6,pp[1]+dy*0.7+dx*bend*0.6];let dep=0,k=i;while(MM_TREE[k][2]>=0){dep++;k=MM_TREE[k][2];}
    const g=clamp(grow*6-dep+1,0,1),on=n[5]?(path[dep-1]||0):0;if(g<=0)return;
    mm_limb(ctx,pp,c1,c2,q,n[3],n[4],g,n[5]?bark:mix(bark,[40,30,24],0.35),{glow:on,a:n[5]?1:0.85});
    if(!n[5]&&g>=1){for(let f=0;f<4;f++)mm_leaf(ctx,q[0],q[1],9+hash(i*4+f,3)*6,-1.2+f*0.8+Math.sin(t*1.1+i+f)*0.12,[112,150,82],0.85);}});
  // the ground, and roots that spread into it
  const gr=clamp(grow*6,0,1),b0=P[0];withA(ctx,gr,()=>{const g=ctx.createRadialGradient(b0[0],b0[1]+6,4,b0[0],b0[1]+6,150);g.addColorStop(0,"rgba(0,0,0,0.45)");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(b0[0],b0[1]+6,150,26,0,0,TAU);ctx.fill();});
  [[-70,18],[64,14],[-26,22],[30,24]].forEach(([dx,dy],k)=>mm_limb(ctx,[b0[0]+(k%2?6:-6),b0[1]-14],[b0[0]+dx*0.3,b0[1]-2],[b0[0]+dx*0.7,b0[1]+dy*0.6],[b0[0]+dx,b0[1]+dy],k<2?18:12,1.5,gr,bark,{}));
  return P;}
function mm_treeTags(ctx,t,P,labA,hi){const off={1:[-120,-8],2:[-10,40],3:[40,48],4:[30,40],6:[0,-96],7:[40,-92],8:[-20,-86]};
  MM_TREE.forEach((n,i)=>{if(!n[6])return;const a=labA[i]||0;if(a<=0)return;const o=off[i]||[0,30],x=P[i][0]+o[0],y=P[i][1]+o[1];
    if(n[5])mm_ptag(ctx,x,y,n[6][0],n[6][1],a,t,i,hi&&hi[i]);else withA(ctx,a*0.8,()=>T(ctx,n[6][1],x,y+20,{w:700,size:20,align:"center",color:rgba(PARCH,0.7)}));});}

/* ---------- the stack: four floors of meaning ---------- */
// glossary at the bottom, the semantic layer at the top. o.a, o.hi, o.qa, o.ca: per floor, 0..1 (visible, highlighted, question shown, content shown)
const MM_FL={x:160,w:1600,h:140,y0:650,gap:170};
const mm_fy=(k,g)=>(g||MM_FL).y0-k*(g||MM_FL).gap;
function mm_pill(ctx,x,y,s,col,o){o=o||{};const sz=o.size||18,w=tw(ctx,s,sz,700)+(o.pad||30),h=sz+(o.ph||14);const a=o.a==null?1:o.a;if(a<=0.01)return{x,y,w,h};
  withA(ctx,a,()=>{if(o.hi>0)glow(ctx,x,y,w*0.8,o.hiCol||col,0.4*o.hi);glass(ctx,x-w/2,y-h/2,w,h,o.r==null?h/2:o.r,o.hiCol&&o.hi>0.5?o.hiCol:col,{glow:8+12*(o.hi||0),ea:0.75+0.25*(o.hi||0),fill:o.fill||"rgba(7,12,24,0.95)"});
    if(o.dash){ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=1.6;rr(ctx,x-w/2,y-h/2,w,h,h/2);ctx.stroke();ctx.restore();}
    T(ctx,s,x,y+sz*0.36,{w:700,size:sz,align:"center",color:o.tc||rgba(col,1)});});return{x,y,w,h};}
function mm_glossC(ctx,x,y,h,t,p,hi){const W_=[["credential","a trusted, checkable claim of learning"],["microcredential","a small credential, with its learning assessed"],["stacking","counting credentials towards a bigger one"]];
  W_.forEach(([wd,df],i)=>{const cx=x+i*305,cy=y+16,cw=270,ch=h-32,on=i===1?hi:0;withA(ctx,clamp(p*3-i,0,1),()=>{if(on>0)glow(ctx,cx+cw/2,cy+ch/2,190,MM_GLO,0.35*on);
    glass(ctx,cx,cy,cw,ch,12,MM_GLO,{glow:8+12*on,ea:0.6+0.4*on,fill:"rgba(24,19,8,0.94)"});T(ctx,wd,cx+18,cy+34,{w:800,size:22,color:rgba(MM_GLO,1)});wrapT(ctx,df,cx+18,cy+62,cw-30,{w:600,size:16,lh:20,color:rgba(PARCH,0.85)});});});
  return{x:x+440,top:y+16,bot:y+h-16};}
function mm_taxC(ctx,x,y,h,t,p,hi){const R=[x+110,y+h/2],C=[["Award",y+30,x+330],["Microcredential",y+70,x+440],["Badge",y+110,x+570]],G=[["Degree",y+24],["Graduate certificate",y+56]];
  const q=k=>clamp(p*4-k,0,1),dk="#08121a";
  const root=mm_pill(ctx,R[0],R[1],"Credential",MM_TAX,{size:18,a:q(0)});
  const kids=C.map(([s,yy,cx],i)=>{const b=mm_pill(ctx,cx,yy,s,MM_TAX,{size:17,a:q(1+i*0.3),hi:i===1?hi:0});if(q(1+i*0.3)>0)isa(ctx,b.x-b.w/2-4,yy,R[0]+root.w/2+6,R[1],fin(q(1+i*0.3),0.3,0.7),MM_TAX,{fill:dk,s:12,lw:1.8});return b;});
  G.forEach(([s,yy],i)=>{const b=mm_pill(ctx,x+760,yy,s,MM_TAX,{size:16,a:q(2.2+i*0.4)});if(q(2.2+i*0.4)>0)isa(ctx,b.x-b.w/2-4,yy,kids[0].x+kids[0].w/2+6,kids[0].y,fin(q(2.2+i*0.4),0.3,0.7),MM_TAX,{fill:dk,s:12,lw:1.8});});
  return{x:x+440,top:y+70-kids[1].h/2,bot:y+70+kids[1].h/2};}
// a labelled arrow between two boxes, cut at their edges; o.p draws it, o.dash for a link that doesn't hold
function mm_link(ctx,A,B,label,col,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p;if(a<=0.01||p<=0)return;const dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy);if(L<1)return;const ux=dx/L,uy=dy/L;
  const cut=b=>Math.min(Math.abs(ux)>1e-6?b.w/2/Math.abs(ux):1e9,Math.abs(uy)>1e-6?b.h/2/Math.abs(uy):1e9)+6;const x0=A.x+ux*cut(A),y0=A.y+uy*cut(A),x1=B.x-ux*cut(B),y1=B.y-uy*cut(B);
  arrowTo(ctx,x0,y0,x1,y1,col,a,{p,dash:o.dash,head:o.head||12,lw:o.lw||2.2,nohead:o.nohead});
  if(label&&p>0.6)withA(ctx,a*fin(p,0.6,0.4),()=>{const mx=(x0+x1)/2,my=(y0+y1)/2,off=o.off==null?16:o.off,nx=-uy,ny=ux,s=o.size||16,lx=mx+nx*off*(ny>0?-1:1),ly=my+ny*off*(ny>0?-1:1);
    const w=tw(ctx,label,s,700,o.f)+14;ctx.fillStyle="rgba(7,12,24,0.9)";rr(ctx,lx-w/2,ly-s*0.8,w,s*1.3,6);ctx.fill();T(ctx,label,lx,ly+s*0.3,{w:700,size:s,align:"center",f:o.f,color:rgba(o.lc||col,1)});});}
function mm_ontoC(ctx,x,y,h,t,p,hi){const q=k=>clamp(p*4-k,0,1),yy=y+46;
  const Ln=mm_pill(ctx,x+100,yy,"Learner",MM_ONT,{size:18,a:q(0),r:10}),Mc=mm_pill(ctx,x+440,yy,"Microcredential",MM_ONT,{size:18,a:q(0.5),r:10,hi}),Gc=mm_pill(ctx,x+770,yy,"Graduate certificate",MM_ONT,{size:17,a:q(1),r:10});
  mm_link(ctx,Ln,Mc,"holds",MM_ONT,{p:q(1.4),off:18,size:15});mm_link(ctx,Mc,Gc,"counts towards",MM_ONT,{p:q(1.9),off:18,size:15});
  withA(ctx,q(2.8),()=>{const s="rule: up to 4 · approved only",w=tw(ctx,s,15,500,"mono")+28;glass(ctx,x+605-w/2,y+86,w,34,10,MM_ONT,{glow:10,ea:0.8,fill:"rgba(22,14,40,0.95)"});T(ctx,s,x+605,y+109,{f:"mono",w:500,size:15,align:"center",color:rgba(MM_ONT,1)});});
  return{x:x+440,top:yy-Mc.h/2,bot:yy+Mc.h/2};}
const MM_METRICS=[["credentials awarded","11,890","count · revoked left out"],["near a certificate","132","3 of 4 approved"],["completion rate","71%","completed ÷ enrolled"]];
function mm_semC(ctx,x,y,h,t,p,hi){MM_METRICS.forEach(([n,v,f],i)=>{const cx=x+i*305,cy=y+16,cw=270,ch=h-32,on=i===1?hi:0;withA(ctx,clamp(p*3-i,0,1),()=>{if(on>0)glow(ctx,cx+cw/2,cy+ch/2,190,MM_SEM,0.35*on);
    glass(ctx,cx,cy,cw,ch,12,MM_SEM,{glow:8+12*on,ea:0.6+0.4*on,fill:"rgba(8,16,32,0.95)"});T(ctx,"Σ",cx+18,cy+32,{w:800,size:22,color:rgba(MM_SEM,1)});T(ctx,n,cx+44,cy+31,{w:700,size:17,color:rgba(MM_SEM,1)});
    T(ctx,v,cx+18,cy+70,{w:800,size:30,color:rgba(INK,1)});T(ctx,f,cx+18,cy+94,{f:"mono",w:500,size:13,color:rgba(SOFT,1)});});});
  return{x:x+440,top:y+16,bot:y+h-16};}
const MM_CONTENT=[mm_glossC,mm_taxC,mm_ontoC,mm_semC];
function mm_stack(ctx,t,o){o=o||{};const g=Object.assign({},MM_FL,o.geo||{}),an=[],arr=(v,d)=>v==null?[d,d,d,d]:v;const A=arr(o.a,1),HI=arr(o.hi,0),QA=arr(o.qa,1),CA=arr(o.ca,1),MH=arr(o.mh,0);
  MM_L.forEach((L,k)=>{const a=A[k];if(a<=0.01){an.push(null);return;}const hi=HI[k],x=g.x,y=mm_fy(k,g),w=g.w,h=g.h,c=L.c,lit=o.lit==null?1:o.lit[k];
    withA(ctx,a,()=>{if(hi>0)glow(ctx,x+w/2,y+h/2,w*0.42,c,0.16*hi);
      ctx.save();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+34,y-24);ctx.lineTo(x+w-34,y-24);ctx.lineTo(x+w,y);ctx.closePath();ctx.fillStyle=rgba(c,(0.05+0.07*hi)*(0.4+0.6*lit));ctx.fill();ctx.strokeStyle=rgba(c,(0.3+0.4*hi)*(0.4+0.6*lit));ctx.lineWidth=1.4;ctx.stroke();ctx.restore();
      glass(ctx,x,y,w,h,14,c,{glow:(10+14*hi)*lit,ea:(0.35+0.2*lit)+0.4*hi,fill:"rgba(7,12,24,0.93)"});
      withA(ctx,lit,()=>{led(ctx,x+18,y+24,5,h-48,c,0.9);if(!o.bare){T(ctx,L.n,x+42,y+60,{w:800,size:o.ns||30,color:rgba(c,1)});if(!o.nosub)T(ctx,L.s,x+42,y+92,{w:600,size:18,color:rgba(SOFT,1)});}
        if(o.inner)o.inner(ctx,k,x,y,w,h);
        else{an.push(MM_CONTENT[k](ctx,x+300,y,h,t,CA[k],MH[k]));
          withA(ctx,QA[k],()=>{ctx.strokeStyle=rgba(c,0.25);ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(x+w-400,y+22);ctx.lineTo(x+w-400,y+h-22);ctx.stroke();
            const ls=wrapT(ctx,L.q,0,0,340,{w:700,size:25,measure:true}),y1=y+h/2-(ls.length-1)*17+9;ls.forEach((l,i)=>T(ctx,l,x+w-372,y1+i*34,{w:700,size:25,color:rgba(c,1)}));});}});});
    if(an.length<=k)an.push(null);});
  return an;}
// one idea through every floor: a thread from the glossary's word to the semantic layer's metric
function mm_thread(ctx,an,p,t,col){if(p<=0)return;const pts=an.filter(Boolean);for(let i=0;i+1<pts.length;i++){const a=pts[i],b=pts[i+1],q=clamp(p*(pts.length-1)-i,0,1);if(q<=0)continue;
  const y0=a.top-4,y1=b.bot+4;ctx.save();ctx.globalCompositeOperation="lighter";ctx.strokeStyle=rgba(col||[255,255,255],0.85);ctx.lineWidth=3;ctx.shadowColor=rgba(col||[255,255,255],0.9);ctx.shadowBlur=14;
  ctx.beginPath();ctx.moveTo(a.x,y0);ctx.lineTo(a.x,lerp(y0,y1,q));ctx.stroke();ctx.restore();
  const u=(t*0.6+i*0.3)%1;if(q>=1)glow(ctx,a.x,lerp(y0,y1,u),26,col||[255,255,255],0.7);}}

/* ---------- Genie, tables, documents ---------- */
function mm_genie(ctx,x,y,t,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{orb(ctx,x,y,o.r||34,t);chip(ctx,x,y+118,"databricks","Genie",o.sub||"answers in plain words",{align:"center",edge:MM_GEN});});}
// where each column of a sketch3 table sits, measured the same way table() measures it
function mm_cols(ctx,cols,rows){let x=0;return cols.map((c,i)=>{const w=Math.max(tw(ctx,c,16,500,"mono"),...rows.map(r=>tw(ctx,r[i],16,500,"mono")))+30;const o={x,w};x+=w;return o;});}
// the policy document: the rules are there, but in a file no tool reads
function mm_doc(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a,grey=o.grey||0;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=24;ctx.fillStyle=grey>0.5?"#9aa0aa":"#eef0f4";rr(ctx,x,y,w,h,8);ctx.fill();ctx.restore();
  ctx.fillStyle="rgba(150,158,172,"+(0.55*grey)+")";rr(ctx,x,y,w,h,8);ctx.fill();ctx.fillStyle="#d9453a";rr(ctx,x+w-66,y+16,50,24,5);ctx.fill();T(ctx,"PDF",x+w-41,y+34,{w:800,size:14,align:"center",color:"#fff"});
  const ink=grey>0.5?"rgba(60,64,72,0.75)":"rgba(30,34,44,0.95)";T(ctx,o.title||"Stacking policy",x+24,y+40,{w:800,size:22,color:ink});T(ctx,o.sub||"Academic Board · v4",x+24,y+64,{f:"mono",w:500,size:14,color:ink});
  for(let i=0;i<9;i++){const yy=y+96+i*24;if(i===3||i===4)continue;ctx.fillStyle=grey>0.5?"rgba(70,74,84,0.3)":"rgba(40,44,54,0.25)";ctx.fillRect(x+24,yy,(w-48)*(0.6+0.4*hash(i,4)),9);}
  wrapT(ctx,o.rule||"4.2 A graduate certificate accepts up to four approved microcredentials towards its credit.",x+24,y+176,w-48,{w:700,size:17,lh:22,color:ink});
  for(let i=0;i<5;i++){ctx.fillStyle=grey>0.5?"rgba(70,74,84,0.3)":"rgba(40,44,54,0.25)";ctx.fillRect(x+24,y+h-130+i*24,(w-48)*(0.5+0.5*hash(i,9)),9);}});}
function mm_eyeOff(ctx,x,y,s,col,a){withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-s,y);ctx.quadraticCurveTo(x,y-s*0.8,x+s,y);ctx.quadraticCurveTo(x,y+s*0.8,x-s,y);ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*0.28,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.9,y+s*0.7);ctx.lineTo(x+s*0.9,y-s*0.7);ctx.stroke();ctx.restore();});}

/* ---------- the semantic layer's metric, and the tools that ask it ---------- */
const MM_MROWS=[["measure","count of credentials"],["left out","revoked credentials"],["date","awarded on · this academic year"],["grain","one row per credential awarded"]];
function mm_metric(ctx,x,y,w,h,o){o=o||{};const p=o.rows||[1,1,1,1];withA(ctx,o.a==null?1:o.a,()=>{if(o.hi>0)glow(ctx,x+w/2,y+h/2,w*0.7,MM_SEM,0.25*o.hi);glass(ctx,x,y,w,h,20,MM_SEM,{glow:18+10*(o.hi||0),ea:0.85,fill:"rgba(6,14,30,0.95)"});
  T(ctx,"Σ",x+30,y+62,{w:800,size:40,color:rgba(MM_SEM,1)});T(ctx,o.title||"credentials awarded this year",x+80,y+56,{w:800,size:o.ts||30,color:rgba(MM_SEM,1)});T(ctx,"semantic layer · defined once",x+80,y+84,{f:"mono",w:500,size:15,color:rgba(SOFT,1)});
  const rh=o.rh||78;MM_MROWS.forEach(([k,v],i)=>withA(ctx,p[i],()=>{const yy=y+118+i*rh;ctx.fillStyle=rgba(MM_SEM,0.07+0.12*(o.rowHi?o.rowHi[i]||0:0));rr(ctx,x+24,yy,w-48,rh-12,10);ctx.fill();led(ctx,x+36,yy+14,4,rh-40,MM_SEM,0.9);
    T(ctx,k.toUpperCase(),x+56,yy+26,{f:"mono",w:500,size:15,color:rgba(SOFT,1)});T(ctx,v,x+56,yy+54,{w:700,size:o.vs||24,color:rgba(INK,1)});}));
  if(o.num)withA(ctx,o.numA==null?1:o.numA,()=>{T(ctx,"= "+o.num,x+w-30,y+h-26,{w:800,size:34,align:"right",color:rgba(GOOD,1)});});});}
// a small dashboard, a spreadsheet: the tools that each used to write their own version
function mm_dash(ctx,x,y,w,h,num,col,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=18;ctx.fillStyle="#f5f6f8";rr(ctx,x,y,w,h,10);ctx.fill();ctx.restore();
  ctx.fillStyle="#1b3139";rr(ctx,x,y,w,34,10);ctx.fill();ctx.fillRect(x,y+20,w,14);T(ctx,"Dean's dashboard",x+16,y+23,{w:700,size:15,color:"#fff"});
  T(ctx,"credentials awarded",x+18,y+64,{w:700,size:15,color:"#5f7281"});T(ctx,num,x+18,y+112,{w:800,size:40,color:rgba(col,1)});
  [0.5,0.7,0.62,0.85,0.78].forEach((v,i)=>{ctx.fillStyle="rgba(7,122,157,0.75)";const bh=(h-150)*v;ctx.fillRect(x+w-150+i*26,y+h-20-bh,16,bh);});
  if(o.old)withA(ctx,o.oldA==null?1:o.oldA,()=>{T(ctx,o.old,x+18,y+h-22,{f:"mono",w:500,size:15,color:"#c82d4c"});ctx.strokeStyle="#c82d4c";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+14,y+h-27);ctx.lineTo(x+18+tw(ctx,o.old,15,500,"mono")+4,y+h-27);ctx.stroke();});});}
function mm_xls(ctx,x,y,w,h,num,col,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=18;ctx.fillStyle="#ffffff";rr(ctx,x,y,w,h,8);ctx.fill();ctx.restore();
  ctx.fillStyle="#1e7145";rr(ctx,x,y,w,30,8);ctx.fill();ctx.fillRect(x,y+18,w,12);T(ctx,"Planning.xlsx",x+14,y+21,{w:700,size:15,color:"#fff"});
  ctx.strokeStyle="#d8dee4";ctx.lineWidth=1;for(let r=0;r<6;r++){ctx.beginPath();ctx.moveTo(x,y+30+r*28);ctx.lineTo(x+w,y+30+r*28);ctx.stroke();}for(let c=1;c<4;c++){ctx.beginPath();ctx.moveTo(x+c*w/4,y+30);ctx.lineTo(x+c*w/4,y+h);ctx.stroke();}
  T(ctx,"credentials awarded",x+10,y+78,{w:700,size:14,color:"#11171c"});ctx.fillStyle="rgba(30,113,69,0.12)";ctx.fillRect(x+w/2+2,y+60,w/2-4,26);T(ctx,num,x+w-12,y+80,{w:800,size:20,align:"right",color:rgba(col,1)});
  for(let r=0;r<3;r++){ctx.fillStyle="rgba(17,23,28,0.2)";ctx.fillRect(x+10,y+104+r*28,70+hash(r,3)*40,8);ctx.fillRect(x+w/2+30,y+104+r*28,60,8);}
  if(o.old)withA(ctx,o.oldA==null?1:o.oldA,()=>{T(ctx,o.old,x+12,y+h-14,{f:"mono",w:500,size:14,color:"#c82d4c"});ctx.strokeStyle="#c82d4c";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+8,y+h-19);ctx.lineTo(x+12+tw(ctx,o.old,14,500,"mono")+4,y+h-19);ctx.stroke();});});}

/* ---------- standards: a shelf of published models, and three definitions ---------- */
const MM_SHELF=[["Finance",[["FIBO","an ontology of finance"],["ISO 20022","payment messages"]]],["Health",[["HL7 FHIR","exchanging records"],["SNOMED CT","clinical terms"],["ICD","diseases"]]],
  ["Insurance",[["ACORD","insurance data"]]],["Retail",[["GS1","product identifiers"]]],["Education",[["CEDS","education data"],["HERM","university models"],["TCSI","student data"]]]];
const MM_REFC=[255,214,160];
function mm_binder(ctx,x,y,w,h,name,sub,col,a,hi){withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);if(hi>0)glow(ctx,w/2,h/2,w,col,0.3*hi);ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=14;ctx.shadowOffsetY=4;
  const g=ctx.createLinearGradient(0,0,w,0);g.addColorStop(0,rgba(mix(col,[30,24,20],0.55),1));g.addColorStop(1,rgba(mix(col,[20,16,14],0.72),1));ctx.fillStyle=g;rr(ctx,0,0,w,h,6);ctx.fill();ctx.restore();ctx.save();ctx.translate(x,y);
  ctx.fillStyle=rgba(col,0.9);ctx.fillRect(0,0,12,h);ctx.strokeStyle=rgba(col,0.85+0.15*(hi||0));ctx.lineWidth=1.6+(hi||0);rr(ctx,0,0,w,h,6);ctx.stroke();
  ctx.fillStyle="rgba(250,244,230,0.92)";rr(ctx,20,28,w-30,64,4);ctx.fill();T(ctx,name,20+(w-30)/2,62,{w:800,size:name.length>7?18:22,align:"center",color:"#231c14"});T(ctx,"STANDARD",20+(w-30)/2,82,{f:"mono",w:500,size:11,align:"center",color:"rgba(60,50,40,0.8)"});
  wrapT(ctx,sub,w/2+6,126,w-30,{w:700,size:16,lh:20,align:"center",color:rgba(mix(col,[255,255,255],0.6),1)});ctx.restore();});}
function mm_shelf(ctx,t,x0,y,o){o=o||{};const bw=o.bw||146,bh=o.bh||196,gap=12,gg=34;let x=x0;const out=[];
  MM_SHELF.forEach(([grp,items],gi)=>{const a=o.ga?o.ga[gi]:1,gx=x;items.forEach(([n,s],i)=>{mm_binder(ctx,x,y+Math.sin(t*0.8+gi+i)*1.2,bw,bh,n,s,gi===4?MM_REFC:[200,190,176],a,o.hi?o.hi[gi]:0);x+=bw+gap;});
    withA(ctx,a,()=>T(ctx,grp,(gx+x-gap)/2,y+bh+42,{w:700,size:20,align:"center",color:rgba(gi===4?MM_REFC:SOFT,1)}));out.push([gx,x-gap]);x+=gg;});
  withA(ctx,o.ga?o.ga[0]:1,()=>{ctx.fillStyle="rgba(120,96,70,0.85)";ctx.fillRect(x0-20,y+bh,x-gg-x0+40-gap,10);ctx.fillStyle="rgba(40,30,22,0.9)";ctx.fillRect(x0-20,y+bh+10,x-gg-x0+40-gap,6);});return out;}
// one official definition of microcredential: shared parts in green, differences in amber
const MM_DEFS=[["Australia","National Microcredentials Framework · 2021",[["certification of assessed learning",0],["at least one hour of learning",1],["smaller than a full award (AQF)",1]]],
  ["European Union","Council Recommendation · 2022",[["record of assessed learning outcomes",0],["after a small volume of learning",1],["owned by the learner, portable",1]]],
  ["UNESCO","Towards a common definition · 2022",[["record of assessed learning achievement",0],["awarded by a trusted provider",1],["has value on its own, and can stack",1]]]];
function mm_def(ctx,x,y,w,h,d,o){o=o||{};withA(ctx,o.a==null?1:o.a,()=>{glass(ctx,x,y,w,h,18,MM_REFC,{glow:14+14*(o.hA==null?0:pulseAt(o.hA,0,1)),ea:0.7,fill:"rgba(12,12,20,0.94)"});withA(ctx,o.hA==null?1:o.hA,()=>{T(ctx,d[0],x+28,y+50,{w:800,size:30,color:rgba(MM_REFC,1)});T(ctx,d[1],x+28,y+80,{w:600,size:16,color:rgba(SOFT,1)});});
  T(ctx,"“microcredential”",x+28,y+128,{w:700,size:20,color:rgba(INK,0.9)});
  d[2].forEach(([s,diff],i)=>withA(ctx,o.p==null?1:clamp(o.p*3-i,0,1),()=>{const yy=y+156+i*(o.rh||84),col=diff?EXT:GOOD,on=diff?(o.diff||0):(o.same||0);
    ctx.fillStyle=rgba(col,0.06+0.16*on);rr(ctx,x+20,yy,w-40,(o.rh||84)-14,12);ctx.fill();ctx.strokeStyle=rgba(col,0.25+0.7*on);ctx.lineWidth=1.6+on;rr(ctx,x+20,yy,w-40,(o.rh||84)-14,12);ctx.stroke();
    wrapT(ctx,s,x+40,yy+30,w-100,{w:700,size:21,lh:26,color:rgba(mix(INK,col,0.5*on),1)});if(!diff&&on>0)tick_(ctx,x+w-46,yy+33,28,GOOD,on);if(diff&&on>0)T(ctx,"≠",x+w-46,yy+42,{w:800,size:30,align:"center",color:rgba(EXT,on)});}));});}

/* ---------- the knowledge graph ---------- */
const MM_KG={learners:[["Aisha K.",410],["Ben O.",540],["Chen W.",670]],micros:[["Data Visualisation",400,1],["SQL for Analysis",490,1],["Data Ethics",580,1],["Python Basics",670,0]],
  holds:[[0,0],[0,1],[0,2],[1,2],[2,1],[2,3],[2,0]]};
// schema (the ontology) above, data below; p: how far each part is drawn
function mm_kg(ctx,t,o){o=o||{};const P=o.p||{},q=k=>P[k]==null?1:P[k],aA=o.aisha||0;
  const sch={cred:mm_pill(ctx,960,128,"Credential",MM_ONT,{size:20,r:10,a:q("schema"),fill:"rgba(34,22,60,0.96)"}),learner:mm_pill(ctx,330,250,"Learner",MM_ONT,{size:20,r:10,a:q("schema"),fill:"rgba(34,22,60,0.96)"}),
    micro:mm_pill(ctx,960,250,"Microcredential",MM_ONT,{size:20,r:10,a:q("schema"),fill:"rgba(34,22,60,0.96)"}),cert:mm_pill(ctx,1560,250,"Graduate certificate",MM_ONT,{size:20,r:10,a:q("schema"),fill:"rgba(34,22,60,0.96)"})};
  mm_link(ctx,sch.micro,sch.cred,"is a kind of",MM_ONT,{p:q("schema")*fin(q("schema"),0.3,0.7),a:q("schema"),off:0,size:15});
  mm_link(ctx,sch.learner,sch.micro,"holds",MM_ONT,{p:fin(q("schema"),0.3,0.7),a:q("schema"),size:15});mm_link(ctx,sch.micro,sch.cert,"counts towards · max 4 · approved",MM_ONT,{p:fin(q("schema"),0.4,0.6),a:q("schema"),size:15});
  withA(ctx,q("schema")*0.9,()=>{T(ctx,"ONTOLOGY",120,200,{f:"mono",w:500,size:16,color:rgba(MM_ONT,1)});T(ctx,"DATA",120,420,{f:"mono",w:500,size:16,color:rgba(SOFT,1)});
    ctx.save();ctx.setLineDash([6,10]);ctx.strokeStyle=rgba(MM_ONT,0.3);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(110,330);ctx.lineTo(1810,330);ctx.stroke();ctx.restore();});
  const L=MM_KG.learners.map(([n,y],i)=>mm_pill(ctx,330,y,n,[255,176,140],{size:18,r:10,a:clamp(q("data")*3-i*0.5,0,1),hi:i===0?aA:0,hiCol:GOOD})),
    M=MM_KG.micros.map(([n,y,ok],i)=>mm_pill(ctx,960,y,n,MM_ONT,{size:17,r:10,a:clamp(q("data")*3-0.3-i*0.3,0,1)})),
    C=mm_pill(ctx,1560,540,"Grad Cert in Data Analytics",[150,215,255],{size:18,r:10,a:clamp(q("data")*3-1.2,0,1)});
  const lk=q("links");MM_KG.holds.forEach(([l,m],i)=>mm_link(ctx,L[l],M[m],i===0?"holds":null,[255,176,140],{p:clamp(lk*3-i*0.25,0,1),a:0.85,lw:1.8,head:9,size:14,off:14}));
  MM_KG.micros.forEach(([n,y,ok],i)=>mm_link(ctx,M[i],C,ok?(i===1?"counts towards":null):"not approved",ok?MM_ONT:[150,150,170],{p:clamp(lk*3-1.2-i*0.2,0,1),a:ok?0.9:0.7,dash:ok?null:[6,7],lw:1.8,head:9,size:14,off:14,lc:ok?MM_ONT:[190,190,205]}));
  // dotted "is a" ties: each instance to its kind
  withA(ctx,q("data")*0.5,()=>{ctx.save();ctx.setLineDash([2,6]);ctx.strokeStyle=rgba(MM_ONT,0.45);ctx.lineWidth=1.2;[[330,sch.learner,L[0]],[960,sch.micro,M[0]],[1560,sch.cert,C]].forEach(([x,A,B])=>{ctx.beginPath();ctx.moveTo(x,A.y+A.h/2+4);ctx.lineTo(x,B.y-B.h/2-4);ctx.stroke();});ctx.restore();});
  if(aA>0)withA(ctx,aA,()=>{tag(ctx,330,364,"3 of 4 approved: one away",GOOD,{align:"center",size:17});});
  return{L,M,C,sch};}

/* ---------- a digital credential, with the parts a standard names ---------- */
const MM_VC=[["issuer","issuer"],["holder","holder"],["claim","claim"],["evidence","evidence"],["status","status"]];
function mm_vc(ctx,x,y,w,o){o=o||{};const rh=o.rh||46,h=70+MM_VC.length*rh+16;withA(ctx,o.a==null?1:o.a,()=>{glass(ctx,x,y,w,h,18,TRUST,{glow:16,ea:0.8,fill:"rgba(7,12,24,0.95)"});
  T(ctx,o.title||"Digital credential",x+24,y+42,{w:800,size:24,color:rgba(TRUST,1)});T(ctx,o.sub||"as a standard describes it",x+w-24,y+42,{w:600,size:15,align:"right",color:rgba(SOFT,1)});
  MM_VC.forEach(([k],i)=>{const yy=y+70+i*rh,on=o.hl?o.hl[k]||0:0;ctx.fillStyle=rgba(TRUST,0.05+0.14*on);rr(ctx,x+16,yy,w-32,rh-8,8);ctx.fill();T(ctx,k,x+30,yy+rh/2+2,{f:"mono",w:500,size:17,color:rgba(TRUST,0.9)});
    const v=o.vals?o.vals[k]:null;if(v)withA(ctx,1,()=>{let xx=x+150;(Array.isArray(v)?v:[v]).forEach(s=>{const col=s.col||INK,txt=s.t||s,w2=tw(ctx,txt,15,700)+20;if(xx+w2>x+w-20)return;glass(ctx,xx,yy+6,w2,rh-20,8,col,{glow:6,ea:0.7,fill:"rgba(7,12,24,0.9)"});T(ctx,txt,xx+10,yy+rh/2+1,{w:700,size:15,color:rgba(col,1)});xx+=w2+8;});});});});return h;}

/* ---------- pictures for the labs and the scenarios (site/assets/meaning-machines-can-read/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW). Every word drawn comes from FW
   (FW.vis, or the lab's own words), so Spanish pages show Spanish. Lab pictures are 960 wide and shown at about 45%, so their
   text is 22 px or more; scenario pictures are 600 wide and shown at about 70%, so theirs is 18 px or more. */
const mm_hex=s=>s.match(/\w\w/g).map(q=>parseInt(q,16));
function mm_numChip(c,x,y,s,n,col){glass(c,x,y,s,s,12,col,{glow:10,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,""+n,x+s/2,y+s/2+s*0.2,{w:800,size:Math.round(s*0.56),align:"center",color:rgba(col,1)});}
const LV={
  // Glossary, taxonomy, ontology or semantic layer? Four floors; each statement's number sits where it was placed
  layers:(c,w,h,st,FW)=>{const lab=FW.labs.find(x=>x.id==="layers"),items=lab.w.items,B=lab.w.buckets,V=FW.vis.layers;
    MM_L.forEach((Lr,k)=>{const x=16,y=h-16-92-k*104,fw=w-32,col=Lr.c,bk=B[k][0],mine=items.map((it,i)=>[it,i]).filter(([it,i])=>st.pick[i]===bk);
      c.save();c.beginPath();c.moveTo(x,y);c.lineTo(x+24,y-12);c.lineTo(x+fw-24,y-12);c.lineTo(x+fw,y);c.closePath();c.fillStyle=rgba(col,0.08);c.fill();c.strokeStyle=rgba(col,0.35);c.lineWidth=1.2;c.stroke();c.restore();
      glass(c,x,y,fw,92,12,col,{glow:10,ea:0.7,fill:"rgba(7,12,24,0.94)"});led(c,x+12,y+16,4,60,col,0.9);
      T(c,B[k][1],x+28,y+40,{w:800,size:26,color:rgba(col,1)});T(c,V.q[k],x+28,y+74,{w:600,size:22,color:rgba(SOFT,1)});
      mine.forEach(([it,i],j)=>{const ok=st.checked?(it.b===bk):null;mm_numChip(c,x+500+j*54,y+23,46,i+1,ok==null?col:ok?GOOD:BAD);});});},
  // Map to the standard: each local term's number, on the part of the credential it was placed on
  standard:(c,w,h,st,FW)=>{const lab=FW.labs.find(x=>x.id==="standard"),items=lab.w.items,B=lab.w.buckets,V=FW.vis.standard;
    glass(c,16,12,w-32,h-24,18,TRUST,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(c,V.title,44,56,{w:800,size:28,color:rgba(TRUST,1)});T(c,V.sub,w-44,56,{w:600,size:22,align:"right",color:rgba(SOFT,1)});
    B.forEach(([bk,name],r)=>{const y=80+r*66,mine=items.map((it,i)=>[it,i]).filter(([it,i])=>st.pick[i]===bk);c.fillStyle=rgba(TRUST,mine.length?0.12:0.05);rr(c,32,y,w-64,56,10);c.fill();
      T(c,name,52,y+37,{f:"mono",w:500,size:24,color:rgba(TRUST,0.95)});mine.forEach(([it,i],j)=>{const ok=st.checked?(it.b===bk):null;mm_numChip(c,300+j*56,y+5,46,i+1,ok==null?INK:ok?GOOD:BAD);});});},
  // Ground the answer: what Genie can read, and the number it gives
  ground:(c,w,h,st,FW)=>{const V=FW.vis.ground,k=st.pick,on={tables:[1,0,0,0],gloss:[1,1,0,0],full:[1,0,1,1]}[k]||[1,0,0,0],cols=[[200,210,230],MM_GLO,MM_ONT,MM_SEM];
    V.sources.forEach((n,i)=>{const y=26+i*100,col=cols[i];withA(c,on[i]?1:0.3,()=>{glass(c,20,y,340,76,14,col,{glow:on[i]?14:0,ea:on[i]?0.9:0.4,fill:"rgba(7,12,24,0.94)"});T(c,n,44,y+47,{w:700,size:26,color:rgba(col,1)});});
      if(on[i])arrowTo(c,370,y+38,510,220,col,0.8,{head:12,lw:2.4});});
    orb(c,560,220,32,1.2);T(c,V.genie,560,300,{w:700,size:24,align:"center",color:rgba(SOFT,1)});
    const ans={tables:["214",BAD],gloss:["171",EXT],full:["132",GOOD]}[k]||["214",BAD];
    glass(c,650,100,290,240,18,ans[1],{glow:18,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,ans[0],795,230,{w:800,size:96,align:"center",color:rgba(ans[1],1)});T(c,V.report,795,300,{w:600,size:22,align:"center",color:rgba(SOFT,1)});},
  // scenarios, 600 × 320
  confident:(c,w,h,st,FW)=>{const V=FW.vis.confident;[[V.genie,"214",V.sub1,BAD,20],[V.reg,"132",V.sub2,GOOD,310]].forEach(([n,v,s,col,x])=>{glass(c,x,40,270,236,18,col,{glow:16,ea:0.85,fill:"rgba(7,12,24,0.95)"});
    T(c,n,x+24,86,{w:700,size:22,color:rgba(SOFT,1)});T(c,v,x+24,184,{w:800,size:80,color:rgba(col,1)});T(c,s,x+24,240,{w:600,size:19,color:rgba(SOFT,1)});});orb(c,258,64,16,1);},
  taxrule:(c,w,h,st,FW)=>{const V=FW.vis.taxrule,r=mm_pill(c,100,150,V.cred,MM_TAX,{size:20});
    const kids=[[V.award,60],[V.micro,150],[V.badge,240]].map(([s,y])=>{const b=mm_pill(c,300,y,s,MM_TAX,{size:20});isa(c,b.x-b.w/2-4,y,r.x+r.w/2+6,r.y,1,MM_TAX,{fill:"#08121a",s:12,lw:2});return b;});
    const b=mm_pill(c,470,290,V.rule,BAD,{size:18,dash:true});isa(c,b.x-40,b.y-b.h/2-2,kids[1].x+40,kids[1].y+kids[1].h/2+4,1,BAD,{fill:"#1a0808",s:12,lw:2});},
  twodash:(c,w,h,st,FW)=>{const V=FW.vis.twodash;[[V.a,V.n1,[110,180,255],20],[V.b,V.n2,BAD,310]].forEach(([n,v,col,x])=>{glass(c,x,40,270,210,16,col,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.95)"});
    T(c,n,x+20,82,{w:700,size:19,color:rgba(SOFT,1)});T(c,v,x+22,168,{w:800,size:58,color:rgba(col,1)});T(c,V.own,x+22,222,{f:"mono",w:500,size:18,color:rgba(SOFT,1)});});tag(c,300,286,V.q,EDGE_,{align:"center",size:20});},
  wholesale:(c,w,h,st,FW)=>{const V=FW.vis.wholesale;glass(c,24,40,170,240,14,MM_REFC,{glow:14,ea:0.85,fill:"rgba(30,22,14,0.95)"});c.fillStyle=rgba(MM_REFC,0.9);c.fillRect(24,40,14,240);wrapT(c,V.std,54,100,130,{w:800,size:24,lh:30,color:rgba(MM_REFC,1)});
    V.rows.forEach(([a,b,ok],i)=>{const y=80+i*78;tag(c,230,y,a,ok?ADOPT:EXT,{size:20});T(c,b,w-24,y+8,{w:800,size:24,align:"right",color:rgba(ok?GOOD:EXT,1)});});},
  threedefs:(c,w,h,st,FW)=>{const V=FW.vis.threedefs;[0,1,2].forEach(i=>{const x=12+i*196;glass(c,x,30,184,260,16,MM_REFC,{glow:12,ea:0.75,fill:"rgba(12,12,20,0.95)"});T(c,V.regions[i],x+92,76,{w:800,size:22,align:"center",color:rgba(MM_REFC,1)});
    c.fillStyle=rgba(GOOD,0.16);rr(c,x+12,100,160,58,10);c.fill();T(c,V.same,x+92,136,{w:700,size:19,align:"center",color:rgba(mix(INK,GOOD,0.4),1)});
    c.fillStyle=rgba(EXT,0.18);rr(c,x+12,172,160,100,10);c.fill();wrapT(c,V.diffs[i],x+24,206,140,{w:700,size:19,lh:24,color:rgba(mix(INK,EXT,0.4),1)});});},
  pdfgloss:(c,w,h,st,FW)=>{const V=FW.vis.pdfgloss;c.save();c.shadowColor="rgba(0,0,0,0.6)";c.shadowBlur=18;c.fillStyle="#eef0f4";rr(c,50,28,240,270,8);c.fill();c.restore();c.fillStyle="#d9453a";rr(c,216,44,58,28,5);c.fill();T(c,"PDF",245,64,{w:800,size:18,align:"center",color:"#fff"});
    T(c,V.title,70,112,{w:800,size:26,color:"#1e222c"});T(c,V.pages,70,142,{w:600,size:18,color:"#4a5160"});for(let i=0;i<5;i++){c.fillStyle="rgba(40,44,54,0.22)";c.fillRect(70,170+i*24,190*(0.6+0.4*hash(i,3)),9);}
    orb(c,450,130,28,1);c.fillStyle="rgba(7,12,24,0.9)";c.beginPath();c.arc(450,238,36,0,TAU);c.fill();mm_eyeOff(c,450,238,24,EDGE_,1);T(c,"?",520,110,{w:800,size:44,color:rgba(EDGE_,1)});},
  noowner:(c,w,h,st,FW)=>{const V=FW.vis.noowner,a=mm_pill(c,170,70,V.cert,MM_ONT,{size:20,r:12}),b=mm_pill(c,440,200,V.micro,MM_ONT,{size:20,r:12});mm_link(c,a,b,V.link,BAD,{size:19,off:30});
    tag(c,40,280,V.owner,BAD,{size:19});tag(c,300,280,V.policy,GOOD,{size:19});},
  steps:(c,w,h,st,FW)=>{const V=FW.vis.steps;glass(c,30,40,380,240,18,MM_SEM,{glow:16,ea:0.85,fill:"rgba(6,14,30,0.95)"});T(c,"Σ",56,96,{w:800,size:40,color:rgba(MM_SEM,1)});wrapT(c,V.title,104,88,290,{w:800,size:22,lh:28,color:rgba(MM_SEM,1)});
    for(let i=0;i<3;i++){c.save();c.setLineDash([6,6]);c.strokeStyle=rgba(MM_SEM,0.5);c.lineWidth=1.6;rr(c,52,150+i*40,336,30,8);c.stroke();c.restore();T(c,"?",220,172+i*40,{w:800,size:20,align:"center",color:rgba(MM_SEM,0.8)});}
    orb(c,520,160,28,1);arrowTo(c,488,160,424,160,MM_GEN,0.7,{head:12,dash:[6,6]});}
};
