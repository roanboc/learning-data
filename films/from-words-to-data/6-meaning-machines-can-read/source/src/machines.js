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

/* ---------- the past: parchment, a robin, a form ---------- */
function mm_parch(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=o.flat?8:22;ctx.shadowOffsetY=o.flat?2:7;ctx.fillStyle=o.fill||"#e7dabe";rr(ctx,0,0,w,h,o.r||6);ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,250,235,0.32)");g.addColorStop(1,"rgba(110,80,40,0.2)");ctx.fillStyle=g;rr(ctx,0,0,w,h,o.r||6);ctx.fill();
  if(o.hi>0){ctx.strokeStyle="rgba(214,150,50,"+(0.95*o.hi)+")";ctx.lineWidth=4;ctx.shadowColor="rgba(255,190,90,0.9)";ctx.shadowBlur=16*o.hi;rr(ctx,-3,-3,w+6,h+6,(o.r||6)+3);ctx.stroke();ctx.shadowBlur=0;}
  if(o.draw)o.draw(ctx,w,h);ctx.restore();});}
// the European robin, the bird from What's in a word, drawn warm for the history scenes
function mm_robin(ctx,x,y,s,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ctx.fillStyle="#6b5238";ctx.beginPath();ctx.moveTo(-24,2);ctx.lineTo(-60,-8);ctx.lineTo(-56,14);ctx.closePath();ctx.fill();
  const g=ctx.createLinearGradient(0,-30,0,30);g.addColorStop(0,"#8d6c4a");g.addColorStop(1,"#57412d");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,4,31,24,-0.12,0,TAU);ctx.fill();
  ctx.fillStyle="#7d6044";ctx.beginPath();ctx.arc(24,-18,15,0,TAU);ctx.fill();
  ctx.fillStyle="#e2703a";ctx.beginPath();ctx.ellipse(19,-2,15,17,0.2,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(29,-14,10,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(242,230,206,0.95)";ctx.beginPath();ctx.ellipse(6,19,15,8,0,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(40,28,18,0.7)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-20,-6);ctx.quadraticCurveTo(-2,6,-22,18);ctx.stroke();
  ctx.fillStyle="#2a2018";ctx.beginPath();ctx.moveTo(38,-21);ctx.lineTo(48,-17);ctx.lineTo(38,-14);ctx.fill();ctx.beginPath();ctx.arc(29,-22,2.6,0,TAU);ctx.fill();
  ctx.strokeStyle="#3a2c20";ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,26);ctx.lineTo(-3,44);ctx.moveTo(11,26);ctx.lineTo(13,44);ctx.stroke();ctx.restore();});}
// one of Nightingale's hospital forms: the same columns on every form, filled in by hand
const MM_FCOLS=["disease","admitted","recovered","died","days"];
function mm_form(ctx,x,y,w,h,name,seed,o){o=o||{};mm_parch(ctx,x,y,w,h,{a:o.a,rot:o.rot,draw:(c,W_,H_)=>{
  T(c,name,24,44,{w:800,size:24,color:MM_SEP});T(c,"return for the year",24,70,{f:"mono",w:500,size:14,color:MM_SEP2});
  const cw=(W_-40)/MM_FCOLS.length,hy=112;if(o.band>0){c.fillStyle="rgba(230,160,50,"+(0.38*o.band)+")";c.fillRect(12,hy-24,W_-24,34);}
  MM_FCOLS.forEach((s,i)=>T(c,s,20+i*cw+(i?cw/2:0),hy,{f:"mono",w:500,size:14,align:i?"center":"left",color:MM_SEP}));
  c.strokeStyle="rgba(90,66,40,0.55)";c.lineWidth=1.4;c.beginPath();c.moveTo(16,hy+10);c.lineTo(W_-16,hy+10);c.stroke();
  for(let i=1;i<MM_FCOLS.length;i++){c.beginPath();c.moveTo(20+i*cw,hy-22);c.lineTo(20+i*cw,H_-20);c.strokeStyle="rgba(90,66,40,0.22)";c.stroke();}
  const dz=["fever","cholera","wounds","phthisis","dysentery","measles","typhus"];const rows=Math.floor((H_-hy-30)/34),fill=o.fill==null?1:o.fill;
  for(let r=0;r<rows;r++){if(r>=rows*fill)break;const yy=hy+42+r*34;T(c,dz[(r+seed)%dz.length],20,yy,{w:600,size:16,color:"rgba(52,40,30,0.85)"});
    for(let i=1;i<MM_FCOLS.length;i++)T(c,""+(3+Math.floor(hash(r*7+i,seed)*(i===1?90:i===3?9:40))),20+i*cw+cw/2,yy,{w:600,size:16,align:"center",color:"rgba(52,40,30,0.8)"});}}});}

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
  if(aA>0)withA(ctx,aA,()=>{tag(ctx,500,358,"3 of 4 approved: one away",GOOD,{size:17});});
  return{L,M,C,sch};}

/* ---------- a digital credential, with the parts a standard names ---------- */
const MM_VC=[["issuer","issuer"],["holder","holder"],["claim","claim"],["evidence","evidence"],["status","status"]];
function mm_vc(ctx,x,y,w,o){o=o||{};const rh=o.rh||46,h=70+MM_VC.length*rh+16;withA(ctx,o.a==null?1:o.a,()=>{glass(ctx,x,y,w,h,18,TRUST,{glow:16,ea:0.8,fill:"rgba(7,12,24,0.95)"});
  T(ctx,o.title||"Digital credential",x+24,y+42,{w:800,size:24,color:rgba(TRUST,1)});T(ctx,o.sub||"as a standard describes it",x+w-24,y+42,{w:600,size:15,align:"right",color:rgba(SOFT,1)});
  MM_VC.forEach(([k],i)=>{const yy=y+70+i*rh,on=o.hl?o.hl[k]||0:0;ctx.fillStyle=rgba(TRUST,0.05+0.14*on);rr(ctx,x+16,yy,w-32,rh-8,8);ctx.fill();T(ctx,k,x+30,yy+rh/2+2,{f:"mono",w:500,size:17,color:rgba(TRUST,0.9)});
    const v=o.vals?o.vals[k]:null;if(v)withA(ctx,1,()=>{let xx=x+150;(Array.isArray(v)?v:[v]).forEach(s=>{const col=s.col||INK,txt=s.t||s,w2=tw(ctx,txt,15,700)+20;if(xx+w2>x+w-20)return;glass(ctx,xx,yy+6,w2,rh-20,8,col,{glow:6,ea:0.7,fill:"rgba(7,12,24,0.9)"});T(ctx,txt,xx+10,yy+rh/2+1,{w:700,size:15,color:rgba(col,1)});xx+=w2+8;});});});});return h;}

/* ---------- pictures for the labs and the scenarios (site/assets/meaning-machines-can-read/learn.*.js name them in "vis") ----------
   Each draws on a canvas of w × h, with the lab's state and the page's words (window.FW). */
const mm_hex=s=>s.match(/\w\w/g).map(q=>parseInt(q,16));
const LV={
  // Glossary, taxonomy, ontology or semantic layer? The four floors, with each statement's number where it was placed
  layers:(c,w,h,st,L)=>{const lab=L.labs.find(x=>x.id==="layers"),items=lab.w.items,B=lab.w.buckets;c.save();c.scale(w/1920,h/840);
    mm_stack(c,1,{geo:{y0:640,x:60,w:1800},bare:true,inner:(ctx,k,x,y,W_,H_)=>{const bk=B[k][0],mine=items.map((it,i)=>[it,i]).filter(([it,i])=>st.pick[i]===bk);
      T(ctx,MM_L[k].n,x+42,y+62,{w:800,size:34,color:rgba(MM_L[k].c,1)});T(ctx,MM_L[k].q,x+42,y+100,{w:600,size:22,color:rgba(SOFT,1)});
      mine.forEach(([it,i],j)=>{const ok=st.checked?(it.b===bk):null,col=ok==null?MM_L[k].c:ok?GOOD:BAD,cx=x+560+j*120;glass(ctx,cx,y+34,96,72,14,col,{glow:12,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(ctx,""+(i+1),cx+48,y+84,{w:800,size:40,align:"center",color:rgba(col,1)});});
      if(!mine.length)T(ctx,"—",x+560,y+86,{w:600,size:34,color:rgba(SOFT,0.5)});}});c.restore();},
  // Map to the standard: the local words, placed on the credential's parts
  standard:(c,w,h,st,L)=>{const lab=L.labs.find(x=>x.id==="standard"),items=lab.w.items,vals={};items.forEach((it,i)=>{const b=st.pick[i];if(!b)return;const ok=st.checked?it.b===b:null;(vals[b]=vals[b]||[]).push({t:it.t,col:ok==null?INK:ok?GOOD:BAD});});
    const hl={};Object.keys(vals).forEach(k=>hl[k]=1);c.save();c.scale(w/960,h/420);mm_vc(c,40,20,880,{vals,hl,rh:62,title:lab.w.cardTitle,sub:lab.w.cardSub});c.restore();},
  // Ground the answer: what Genie can read, and the number it gives
  ground:(c,w,h,st,L)=>{const lab=L.labs.find(x=>x.id==="ground"),k=st.pick,on={tables:[1,0,0,0],gloss:[1,1,0,0],full:[1,0,1,1]}[k]||[1,0,0,0],names=lab.w.sources;c.save();c.scale(w/960,h/420);
    const src=[[names[0],[200,210,230]],[names[1],MM_GLO],[names[2],MM_ONT],[names[3],MM_SEM]];
    src.forEach(([n,col],i)=>{const y=40+i*88,a=on[i]?1:0.28;withA(c,a,()=>{glass(c,40,y,330,66,14,col,{glow:on[i]?14:0,ea:on[i]?0.9:0.4,fill:"rgba(7,12,24,0.94)"});T(c,n,62,y+42,{w:700,size:22,color:rgba(col,1)});});
      if(on[i])arrowTo(c,380,y+33,520,200,col,0.7,{head:10,lw:2,bend:0.05});});
    orb(c,570,200,30,1.2);const ans={tables:["214",BAD],gloss:["171",EXT],full:["132",GOOD]}[k]||["214",BAD];
    glass(c,650,110,280,190,18,ans[1],{glow:18,ea:0.9,fill:"rgba(7,12,24,0.95)"});T(c,"Genie",674,150,{w:700,size:20,color:rgba(SOFT,1)});T(c,ans[0],674,236,{w:800,size:72,color:rgba(ans[1],1)});T(c,lab.w.report,674,280,{w:600,size:16,color:rgba(SOFT,1)});c.restore();},
  // scenarios
  confident:(c,w,h)=>{orb(c,90,120,26,1);numCard(c,170,40,300,"Genie","214","“one away”",BAD);T(c,"registrar's list: 132",320,290,{w:700,size:22,align:"center",color:rgba(GOOD,1)});tag(c,470,40,"no errors",GOOD,{size:15});},
  taxrule:(c,w,h)=>{c.save();c.translate(30,20);const r=mm_pill(c,110,140,"Credential",MM_TAX,{size:18});const kids=[["Award",60],["Microcredential",140],["Badge",220]].map(([s,y])=>{const b=mm_pill(c,320,y,s,MM_TAX,{size:17});isa(c,b.x-b.w/2-4,y,r.x+r.w/2+6,r.y,1,MM_TAX,{fill:"#08121a",s:12,lw:1.8});return b;});
    const b=mm_pill(c,420,270,"Stackable (max 4)?",BAD,{size:16,dash:true});isa(c,b.x-b.w/2+20,b.y-b.h/2-2,kids[1].x,kids[1].y+kids[1].h/2+4,1,BAD,{fill:"#1a0808",s:12,lw:1.8});c.restore();},
  twodash:(c,w,h)=>{mm_dash(c,30,40,260,220,"11,890",[7,122,157],{old:null});mm_xls(c,310,50,260,200,"12,140",[200,45,76]);T(c,"one metric, two versions",300,300,{w:700,size:20,align:"center",color:rgba(EDGE_,1)});},
  wholesale:(c,w,h)=>{mm_binder(c,40,50,150,200,"STANDARD","as published",MM_REFC,1,0.4);[["award","→ adopt"],["issuer","→ adopt"],["graduate certificate","→ ?"]].forEach(([a,b],i)=>{const y=80+i*70;tag(c,230,y,a,i===2?EXT:ADOPT,{size:17});T(c,b,470,y+7,{w:700,size:18,color:rgba(i===2?EXT:SOFT,1)});});},
  threedefs:(c,w,h)=>{MM_DEFS.forEach((d,i)=>{const x=16+i*196;glass(c,x,40,180,240,14,MM_REFC,{glow:10,ea:0.7,fill:"rgba(12,12,20,0.94)"});T(c,d[0].replace("European Union","EU"),x+90,80,{w:800,size:22,align:"center",color:rgba(MM_REFC,1)});
    d[2].forEach(([s,df],j)=>{const col=df?EXT:GOOD;c.fillStyle=rgba(col,0.14);rr(c,x+10,100+j*58,160,48,8);c.fill();wrapT(c,s,x+18,120+j*58,146,{w:700,size:13,lh:16,color:rgba(mix(INK,col,0.3),1)});});});},
  pdfgloss:(c,w,h)=>{mm_doc(c,60,30,240,270,{title:"Glossary",sub:"80 pages · intranet",grey:0,rule:"Approved for stacking: a microcredential the Academic Board has…"});orb(c,440,150,28,1);mm_eyeOff(c,440,240,26,BAD,1);T(c,"?",500,120,{w:800,size:40,color:rgba(BAD,1)});},
  noowner:(c,w,h)=>{c.save();c.translate(-40,-10);const a=mm_pill(c,200,120,"Graduate certificate",MM_ONT,{size:16,r:10}),b=mm_pill(c,470,230,"Microcredential",MM_ONT,{size:16,r:10});mm_link(c,a,b,"accepts max 3",BAD,{size:15,off:22});c.restore();tag(c,70,280,"owner: —",BAD,{size:16});tag(c,300,280,"last change: 2024",SOFT,{size:16});},
  steps:(c,w,h)=>{c.save();c.scale(600/1920,320/1080);c.translate(0,90);mm_stack(c,1,{geo:{y0:720,gap:190,h:150},inner:(ctx,k,x,y)=>{T(ctx,MM_L[k].q,x+620,y+92,{w:700,size:38,color:rgba(MM_L[k].c,1)});}});c.restore();}
};
