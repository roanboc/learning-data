/* ===== Start from a question: the film's own pictures (prefixed sq_) =====
   The past: John Snow's map of Soho, 1854, drawn in ink on cream paper by a steel nib in a wooden holder; one short bar per
   death at its address, gathering round the Broad Street pump; the workhouse and the brewery outlined and left empty.
   The present: code and YAML cards from the project (sq_code), the consumers' badges, glossary cards, the slice of the
   model as a blueprint (sq_bp), faces of the owners of meaning (sq_face), the small loop of ten steps, and the sources. */

const SQ_RUN="runs on dbt Core · DuckDB",SQ_CON=[120,215,155],SQ_INK=[46,34,24],SQ_AMB=[255,190,90];

/* ---------- the past: Snow's map ---------- */
// streets as centre lines, in the film's coordinates (the paper spans 160..1760 × 150..910); each is drawn as two inked edges
const SQ_ST=[["BROAD STREET",[560,520],[1320,508],[640,0]],["POLAND ST",[640,290],[655,770],[0,690]],["MARSHALL ST",[780,330],[790,720],null],
  ["CAMBRIDGE ST",[905,330],[903,520],null],["BERWICK ST",[1120,290],[1110,770],[0,690]],["GT MARLBOROUGH ST",[560,330],[1320,318],[1210,0]],
  ["SILVER ST",[560,700],[1320,712],[1220,0]],["WARDOUR ST",[1262,290],[1252,770],null]];
const SQ_PUMP=[905,541];
// the deaths: [street, along (0..1), side (+1 or -1), bars]; gathered round the pump, none at the brewery or the workhouse
const SQ_ADDR=[[0,0.41,1,6],[0,0.468,-1,5],[3,0.7,-1,3],[0,0.395,-1,6],[0,0.51,1,5],[0,0.33,-1,3],[1,0.56,1,1],[0,0.58,1,4],[0,0.305,1,3],
  [4,0.33,-1,2],[0,0.66,1,3],[3,0.45,1,2],[0,0.23,1,2],[0,0.75,-1,2],[2,0.7,1,2],[0,0.82,-1,1],[4,0.62,-1,2],[6,0.45,-1,1],[3,0.25,-1,1],
  [2,0.32,-1,1],[0,0.84,1,1],[6,0.58,-1,1],[4,0.73,1,1],[5,0.45,1,1],[2,0.8,-1,1]];
// each street's band (for leaving the crossings open), its edges as jittered polylines, and the addresses' positions
const SQ_MAP=(()=>{const band=[],strokes=[];SQ_ST.forEach(([nm,a,b],i)=>{const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy,ny=ux,hw=13;
    band.push([[a[0]-ux*20+nx*hw,a[1]-uy*20+ny*hw],[b[0]+ux*20+nx*hw,b[1]+uy*20+ny*hw],[b[0]+ux*20-nx*hw,b[1]+uy*20-ny*hw],[a[0]-ux*20-nx*hw,a[1]-uy*20-ny*hw]]);
    [1,-1].forEach((sd,k)=>{const n=Math.max(2,Math.round(L/18)),pts=[];for(let j=0;j<=n;j++){const u=j/n,jt=(hash(i*40+j,k+3)-0.5)*2.2;pts.push([a[0]+dx*u+nx*(hw*sd+jt),a[1]+dy*u+ny*(hw*sd+jt)]);}
      if(k===1)pts.reverse();let len=0;for(let j=1;j<pts.length;j++)len+=Math.hypot(pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1]);strokes.push({st:i,pts,len});});});
  const total=strokes.reduce((s,q)=>s+q.len,0);
  const addr=SQ_ADDR.map(([si,u,sd,n])=>{const[,a,b]=SQ_ST[si],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy*sd,ny=ux*sd;
    return{x:a[0]+dx*u+nx*15,y:a[1]+dy*u+ny*15,ux,uy,nx,ny,n};});
  return{band,strokes,total,addr};})();
// a line of ink, drawn up to length q along its points, slightly thicker where the nib pressed
function sq_inkLine(ctx,pts,q,w){if(q<=0)return null;let left=q,last=pts[0];ctx.lineCap="round";ctx.lineJoin="round";
  for(let j=1;j<pts.length&&left>0;j++){const p0=pts[j-1],p1=pts[j],d=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]),f=Math.min(1,left/d),x1=lerp(p0[0],p1[0],f),y1=lerp(p0[1],p1[1],f);
    ctx.lineWidth=w*(0.8+0.4*hash(j,17));ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(x1,y1);ctx.stroke();left-=d;last=[x1,y1];}return last;}
// the streets, drawn as the pen goes: q (0..1) along all the strokes; returns where the nib is
function sq_streets(ctx,q){let left=q*SQ_MAP.total,nib=null;ctx.save();ctx.strokeStyle=rgba(SQ_INK,0.88);
  SQ_MAP.strokes.forEach(s=>{if(left<=0)return;ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);SQ_MAP.band.forEach((b,i)=>{if(i===s.st)return;ctx.moveTo(b[0][0],b[0][1]);for(let k=1;k<4;k++)ctx.lineTo(b[k][0],b[k][1]);ctx.closePath();});ctx.clip("evenodd");
    const e=sq_inkLine(ctx,s.pts,Math.min(left,s.len),2.3);ctx.restore();if(left<s.len)nib=e;left-=s.len;});ctx.restore();return nib;}
// street names, in small capitals along each street
function sq_streetNames(ctx,a){withA(ctx,a,()=>SQ_ST.forEach(([nm,p0,p1,at])=>{if(!at)return;const an=Math.atan2(p1[1]-p0[1],p1[0]-p0[0]),vert=Math.abs(an)>0.8;
  const x=vert?lerp(p0[0],p1[0],(at[1]-p0[1])/(p1[1]-p0[1])):at[0],y=vert?at[1]:lerp(p0[1],p1[1],(at[0]-p0[0])/(p1[0]-p0[0]));
  ctx.save();ctx.translate(x,y);ctx.rotate(vert?an-Math.PI:an);ctx.font=font(700,18);ctx.fillStyle=rgba(SQ_INK,0.75);ctx.textAlign="center";if(ctx.letterSpacing!==undefined)ctx.letterSpacing="2px";ctx.fillText(nm,0,6.5);ctx.restore();}));}
// a building's outline in ink, with a few strokes of hatching on its walls: drawn as p goes from 0 to 1
function sq_building(ctx,x,y,w,h,p){if(p<=0)return;const pts=[[x,y],[x+w,y],[x+w,y+h],[x,y+h],[x,y]].map((q,i)=>[q[0]+(hash(i,x)-0.5)*1.5,q[1]+(hash(i,y)-0.5)*1.5]);
  ctx.save();ctx.strokeStyle=rgba(SQ_INK,0.8);sq_inkLine(ctx,pts,p*2*(w+h),1.8);if(p>=1){ctx.lineWidth=1;ctx.strokeStyle=rgba(SQ_INK,0.18);ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();for(let k=-h;k<w;k+=10){ctx.beginPath();ctx.moveTo(x+k,y+h);ctx.lineTo(x+k+h,y);ctx.stroke();}}ctx.restore();}
// one address: its bars, one per death, stacked away from the street; k (0..n) how many are drawn so far
function sq_bars(ctx,ad,k){for(let i=0;i<Math.min(ad.n,Math.ceil(k));i++){const f=clamp(k-i,0,1),cx=ad.x+ad.nx*i*5.6,cy=ad.y+ad.ny*i*5.6,hl=7*f;
  ctx.save();ctx.strokeStyle=rgba([22,16,12],0.92);ctx.lineWidth=3.6;ctx.lineCap="butt";ctx.beginPath();ctx.moveTo(cx-ad.ux*7,cy-ad.uy*7);ctx.lineTo(cx-ad.ux*7+ad.ux*hl*2,cy-ad.uy*7+ad.uy*hl*2);ctx.stroke();ctx.restore();}}
// the pen: a steel nib with its slit, a brass ferrule and a turned wooden holder, lit from the upper left, with its shadow on the paper.
// (x,y) is the nib's point; lift (0..1) raises it off the paper (the shadow parts from it)
function sq_pen(ctx,x,y,lift,t){const L=300,an=-1.05+0.03*Math.sin(t*1.3),ux=Math.cos(an),uy=Math.sin(an),hx=x+lift*30,hy=y-lift*60;
  ctx.save();ctx.translate(x+18+lift*90,y+16+lift*70);ctx.rotate(an);ctx.globalAlpha*=0.22;ctx.fillStyle="rgba(40,24,10,1)";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(L,-9);ctx.lineTo(L,9);ctx.closePath();ctx.fill();ctx.restore();
  ctx.save();ctx.translate(hx,hy);ctx.rotate(an);
  // the holder: a long taper, darker on its shadow side, with a highlight running along it
  const g=ctx.createLinearGradient(0,-10,0,10);g.addColorStop(0,"#c08a58");g.addColorStop(0.35,"#8a5a32");g.addColorStop(1,"#3e2614");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(56,-7);ctx.bezierCurveTo(120,-10,220,-9,L,-6);ctx.quadraticCurveTo(L+8,0,L,6);ctx.bezierCurveTo(220,9,120,10,56,7);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(255,226,180,0.35)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(62,-4.5);ctx.bezierCurveTo(130,-7,220,-6.5,L-6,-4);ctx.stroke();
  // the ferrule
  const f=ctx.createLinearGradient(0,-8,0,8);f.addColorStop(0,"#f2d79a");f.addColorStop(0.4,"#b48a3c");f.addColorStop(1,"#5a4218");ctx.fillStyle=f;ctx.beginPath();ctx.moveTo(34,-6);ctx.lineTo(60,-8);ctx.lineTo(60,8);ctx.lineTo(34,6);ctx.closePath();ctx.fill();
  // the nib: a curved steel blade narrowing to the point, its slit, and the breather hole
  const n=ctx.createLinearGradient(0,-6,0,6);n.addColorStop(0,"#eef2f6");n.addColorStop(0.5,"#8c96a2");n.addColorStop(1,"#3a4048");ctx.fillStyle=n;
  ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(14,-2.5,36,-5.5);ctx.lineTo(36,5.5);ctx.quadraticCurveTo(14,2.5,0,0);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(20,20,24,0.8)";ctx.lineWidth=0.9;ctx.beginPath();ctx.moveTo(1,0);ctx.lineTo(22,0);ctx.stroke();ctx.fillStyle="rgba(20,20,24,0.85)";ctx.beginPath();ctx.arc(23,0,1.6,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(30,22,16,0.9)";ctx.beginPath();ctx.arc(1,0,1.4,0,TAU);ctx.fill();ctx.restore();}
// the whole map at time-driven progress: o.streets (0..1), o.q (the question, 0..1), o.bld (buildings, 0..1), o.bars(k) bars drawn at address k,
// o.pump (0..1), o.names (0..1); returns where the nib is, if it's drawing
function sq_map(ctx,t,o){kt_paper(ctx,160,150,1600,760,t,{col:[238,228,204],seed:5,curl:0.5,age:0.18});
  let nib=sq_streets(ctx,o.streets);sq_streetNames(ctx,o.names);
  // the question, written along the top of the sheet
  if(o.q>0){const s="Where did the dead get their water?",n=typeOn(s,o.q);T(ctx,n,230,250,{w:600,size:30,color:rgba(SQ_INK,0.85)});if(o.q<1)nib=[230+tw(ctx,n,30,600),250];}
  sq_building(ctx,668,384,100,82,o.bld*2);sq_building(ctx,1000,424,90,64,o.bld*2-1);
  if(o.pump>0)withA(ctx,o.pump,()=>{ctx.strokeStyle=rgba(SQ_INK,0.9);ctx.lineWidth=2;ctx.beginPath();ctx.arc(SQ_PUMP[0],SQ_PUMP[1],7,0,TAU);ctx.stroke();ctx.fillStyle=rgba(SQ_INK,0.9);ctx.beginPath();ctx.arc(SQ_PUMP[0],SQ_PUMP[1],2.6,0,TAU);ctx.fill();
    T(ctx,"PUMP",SQ_PUMP[0]+4,SQ_PUMP[1]+34,{w:700,size:18,align:"center",color:rgba(SQ_INK,0.8)});});
  SQ_MAP.addr.forEach((ad,k)=>{const b=o.bars(k);if(b>0){sq_bars(ctx,ad,b);if(b<ad.n)nib=[ad.x+ad.nx*Math.floor(b)*5.6,ad.y+ad.ny*Math.floor(b)*5.6];}});
  return nib;}

/* ---------- the present: cards ---------- */
// a file from the project: its name, a small label saying where it runs, and its lines, typed as p goes from 0 to 1.
// o.lit {line: 0..1} lights whole lines; o.seg [[line, text, a, colour]] lights a phrase; o.clip {line: [from, q, colour]} writes the end
// of a line in another hand; o.lineCol {line: colour}; o.wrap wraps long lines (at that many characters) under a hanging indent;
// o.cols: two columns of lines instead of one (side by side)
function sq_code(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||19,lh=o.lh||31,col=o.edge||[170,205,255],cw=tw(ctx,"M",sz,500,"mono");
  const vis=ls=>{const V=[];ls.forEach((l,i)=>{if(!o.wrap||l.length<=o.wrap){V.push({i,s:l});return;}const ind=" ".repeat(l.match(/^\s*/)[0].length+3);let rest=l,first=true;
      while(rest.length){const lim=first?o.wrap:o.wrap-ind.length;if(rest.length<=lim){V.push({i,s:(first?"":ind)+rest});break;}let cut=rest.lastIndexOf(" ",lim);if(cut<=0)cut=lim;V.push({i,s:(first?"":ind)+rest.slice(0,cut)});rest=rest.slice(cut).replace(/^ /,"");first=false;}});return V;};
  const cols=o.cols?o.cols.map(vis):[vis(lines)],nv=Math.max(...cols.map(c=>c.length)),h=o.h||(76+nv*lh);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,col,{glow:12+10*(o.hi||0),ea:0.65,fill:"rgba(6,10,20,0.95)"});
    ctx.fillStyle=rgba(col,0.9);rr(ctx,x+16,y+17,10,10,3);ctx.fill();T(ctx,name,x+36,y+29,{f:"mono",w:500,size:18,color:rgba(col,1)});
    if(o.label){const lg=o.labelGlow||0,lw=tw(ctx,o.label,18,700);if(lg>0)glow(ctx,x+w-20-lw/2,y+24,lw*0.7,WEED,0.35*lg);T(ctx,o.label,x+w-20,y+29,{w:700,size:18,align:"right",color:rgba(mix(SOFT,WEED,lg),1)});}
    ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+46,w-28,1.2);
    cols.forEach((V,ci)=>{const x0=x+22+ci*(w/2),n=o.p==null?V.length:V.length*o.p;V.forEach((v,j)=>{if(j>=n)return;const yy=y+80+j*lh,q=clamp(n-j,0,1),src=(o.cols?o.cols[ci]:lines)[v.i],cm=/^\s*(--|#|<!--)/.test(src),key=o.cols?ci*100+v.i:v.i,on=o.lit?o.lit[key]||0:0;
      if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.16);rr(ctx,x0-10,yy-lh*0.7,(o.cols?w/2:w)-24,lh*0.95,6);ctx.fill();});
      const c0=o.lineCol&&o.lineCol[v.i]?rgba(o.lineCol[v.i],0.95):cm?rgba(SOFT,0.8):rgba(mix([200,225,255],o.litCol||TRUST,on*0.6),0.95);
      const cl=o.clip&&o.clip[v.i],shown=typeOn(v.s,q);
      if(cl){T(ctx,shown.slice(0,cl[0]),x0,yy,{f:"mono",w:500,size:sz,color:c0});const tail=typeOn(v.s.slice(cl[0]),cl[1]);T(ctx,tail,x0+cw*cl[0],yy,{f:"mono",w:500,size:sz,color:rgba(cl[2],1)});}
      else T(ctx,shown,x0,yy,{f:"mono",w:500,size:sz,color:c0});
      (o.seg||[]).forEach(([li,s,sa,sc])=>{if(li!==key||sa<=0)return;const k=v.s.indexOf(s);if(k<0)return;const sx=x0+cw*k,sw=cw*s.length;
        withA(ctx,sa,()=>{glow(ctx,sx+sw/2,yy-6,sw*0.6,sc,0.25);ctx.fillStyle=rgba(sc,0.18);rr(ctx,sx-4,yy-lh*0.68,sw+8,lh*0.9,6);ctx.fill();T(ctx,s,sx,yy,{f:"mono",w:500,size:sz,color:rgba(sc,1)});});});});});});return h;}

// a consumer's badge: a round seal in the consumers' green, with its icon, its name and the word "consumer"
function sq_badge(ctx,x,y,r,kind,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*2,SQ_CON,0.18+0.2*(o.hi||0));
  ctx.fillStyle="rgba(7,14,18,0.96)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,SQ_CON,1,2.6);ring(ctx,x,y,r-6,SQ_CON,0.35,1.2);
  ctx.save();ctx.translate(x,y);const s=r/40;ctx.scale(s,s);ctx.strokeStyle=rgba(SQ_CON,1);ctx.fillStyle=rgba(SQ_CON,0.9);ctx.lineWidth=2.6;ctx.lineJoin="round";
  if(kind==="planning"){[[-14,6,8],[-2,-2,16],[10,-10,24]].forEach(([bx,by,bh])=>{rr(ctx,bx-4,by-bh/2+8,9,bh,2);ctx.fill();});ctx.beginPath();ctx.moveTo(-20,20);ctx.lineTo(22,20);ctx.stroke();}
  else{rr(ctx,-20,-13,40,28,5);ctx.stroke();ctx.beginPath();ctx.moveTo(-20,-5);ctx.lineTo(20,-5);ctx.stroke();rr(ctx,6,1,16,10,3);ctx.fill();}
  ctx.restore();if(name){T(ctx,name,x,y+r+30,{w:800,size:o.size||22,align:"center"});if(o.sub!==false)T(ctx,o.sub||"consumer",x,y+r+54,{w:600,size:18,align:"center",color:rgba(SOFT,1)});}});}
// a person's face in a round frame, outlined in their side's colour (cyan for technical, gold for business)
function sq_face(ctx,id,x,y,r,a,o){o=o||{};if(a<=0.01)return;const P=PEOPLE[id],k=r/100;withA(ctx,a,()=>{glow(ctx,x,y,r*1.8,P.edge,0.2+0.25*(o.hi||0));
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle="rgba(12,18,30,0.97)";ctx.fill();ctx.clip();person(ctx,id,x,y-0.1*r+505*k,k/P.build.h,{t:o.t||0,expr:o.expr||"calm",glow:0.2});ctx.restore();
  ring(ctx,x,y,r,P.edge,1,2.6);});}
// a glossary card: the word "glossary" and a term; on (0..1) lights it gold-white, dim (0..1) fades it back
function sq_term(ctx,x,y,w,h,term,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const on=o.on||0,dim=o.dim||0,col=mix(SOFT,o.col||KIND,on);
  withA(ctx,a*(1-0.65*dim),()=>{if(on>0)glow(ctx,x+w/2,y+h/2,w*0.6,o.col||KIND,0.25*on);glass(ctx,x,y,w,h,14,col,{glow:8+12*on,ea:0.7,fill:"rgba(7,12,24,0.94)"});
    T(ctx,"glossary",x+18,y+30,{w:600,size:18,color:rgba(SOFT,0.9)});T(ctx,term,x+18,y+h-24,{w:800,size:o.size||26,color:rgba(mix(INK,o.col||KIND,on*0.35),1)});});}
// the question as a card: who asks, and the question; o.ul [[phrase, a]] underlines phrases as they're read
const SQ_Q="How many learners are within 15 credit points of a graduate certificate, by faculty, as at census date?";
function sq_qcard(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||34,lines=wrapT(ctx,SQ_Q,0,0,w-60,{w:700,size:sz,measure:true}),lh=sz*1.36,h=70+lines.length*lh;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,SQ_CON,{glow:16,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(ctx,o.label||"a question · Planning",x+30,y+38,{w:700,size:18,color:rgba(SQ_CON,1)});
    let shown=o.p==null?SQ_Q.length:Math.round(SQ_Q.length*o.p),pos=0;lines.forEach((l,i)=>{const yy=y+64+(i+0.75)*lh,n=clamp(shown-pos,0,l.length);T(ctx,l.slice(0,n),x+30,yy,{w:700,size:sz});
      (o.ul||[]).forEach(([s,ua])=>{const k=l.indexOf(s);if(k<0||ua<=0)return;const x0=x+30+tw(ctx,l.slice(0,k),sz,700),sw=tw(ctx,s,sz,700);ctx.save();ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,yy+9);ctx.lineTo(x0+sw*ease(ua),yy+9);ctx.stroke();ctx.restore();});
      pos+=l.length+1;});});return h;}
// where a phrase of the question sits on its card, for the threads that run from it
function sq_qpos(ctx,x,y,w,s,sz){sz=sz||34;const lines=wrapT(ctx,SQ_Q,0,0,w-60,{w:700,size:sz,measure:true}),lh=sz*1.36;for(let i=0;i<lines.length;i++){const k=lines[i].indexOf(s);if(k>=0)return[x+30+tw(ctx,lines[i].slice(0,k),sz,700)+tw(ctx,s,sz,700)/2,y+64+(i+0.75)*lh+12];}return[x+w/2,y+100];}

/* ---------- the slice, as a blueprint ---------- */
// three entities and the relationship that carries rules, round (cx, top) at scale s. o.b: glass (0) to blueprint (1);
// both relationship labels sit on one row: above the line, or above the boxes when "counts towards" doesn't fit between them;
// o.ph: the paper's height; o.p: how much is drawn; o.hi: {learner, cred, award, credit}; o.from {name: [x,y,w,h]} and o.m (0..1)
// bring each box in from somewhere else. Returns each box as [x, y, w, h].
const SQ_ENT={learner:["Learner",KIND],cred:["Credential",TRUST],award:["Award",KIND]};
function sq_bpBoxes(cx,top,s){const w=250*s,h=74*s,y=top+85*s-h/2;return{learner:[cx-420*s-w/2,y,w,h],cred:[cx-w/2,y,w,h],award:[cx+420*s-w/2,y,w,h]};}
function sq_bp(ctx,cx,top,s,o){o=o||{};const a=o.a==null?1:o.a,b=o.b||0,ph=o.ph||250,p=o.p==null?1:o.p,hi=o.hi||{},m=o.m==null?1:o.m,B=sq_bpBoxes(cx,top,s);
  if(o.from)Object.keys(o.from).forEach(k=>{const f=o.from[k],e=ease(m);B[k]=B[k].map((v,i)=>lerp(f[i],v,e));});
  const cw=330*s,ch=52*s,cy=top+(ph-48)*s,C=[cx-cw/2,cy-ch/2,cw,ch];B.credit=C;if(a<=0.01)return B;
  withA(ctx,a,()=>{if(o.paper!==0)bpPaper(ctx,cx-700*s,top,1400*s,ph*s,(o.paper==null?1:o.paper)*b,{});
    const lc=mix(SK,BPL,b),lab=(s_,x,y)=>T(ctx,s_,x,y,{w:600,size:Math.max(18,17*s),align:"center",color:rgba(mix(SOFT,BPL,b),0.95)});
    const lfit=clamp((170*s-8-tw(ctx,"counts towards",Math.max(18,17*s),600))/8,0,1);
    const hl=(k0,k1,txt,q)=>{if(q<=0)return;const A=B[k0],Z=B[k1],x0=A[0]+A[2],x1=Z[0],y0=A[1]+A[3]/2;ctx.save();ctx.strokeStyle=rgba(lc,0.9);ctx.lineWidth=2.4*s;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,q),y0);ctx.stroke();ctx.restore();const ly=lerp(A[1]-8,y0-14*s,lfit);withA(ctx,fin(q,0.6,0.4),()=>lab(txt,(x0+x1)/2,ly));};
    const dl=(k,right,q)=>{if(q<=0)return;const A=B[k],x0=A[0]+A[2]*(right?0.15:0.85),y0=A[1]+A[3],x1=right?C[0]+C[2]:C[0],y1=C[1]+C[3]/2;ctx.save();ctx.strokeStyle=rgba(lc,0.8);ctx.lineWidth=2*s;ctx.setLineDash([8*s,6*s]);ctx.beginPath();ctx.moveTo(x0,y0);
      const qx=lerp(x0,x1,q),qy=lerp(y0,y1,q);ctx.quadraticCurveTo(x0,lerp(y0,qy,0.9),qx,qy);ctx.stroke();ctx.restore();};
    if(!o.noLines){hl("learner","cred","holds",clamp(p*3-1.6,0,1));hl("cred","award","counts towards",clamp(p*3-2,0,1));}
    const cq=o.credit==null?clamp(p*3-2,0,1):o.credit;dl("learner",false,cq);dl("award",true,cq);
    ["learner","cred","award"].forEach((k,i)=>{const q=clamp(p*3-i*0.5,0,1),[x,y,w,h]=B[k];bpBox(ctx,x,y,w,h,SQ_ENT[k][0],SQ_ENT[k][1],b,{a:q*(o.ea&&o.ea[k]!=null?o.ea[k]:1),hi:hi[k]||0,size:Math.max(19,26*s)});});
    if(cq>0)withA(ctx,fin(cq,0.5,0.5),()=>{if(hi.credit)glow(ctx,cx,cy,cw*0.6,TRUST,0.3*hi.credit);ctx.fillStyle=b>0.5?"rgba(20,60,130,0.6)":"rgba(7,12,24,0.94)";rr(ctx,C[0],C[1],cw,ch,ch/2);ctx.fill();
      ctx.strokeStyle=rgba(mix(TRUST,BPL,b),0.95);ctx.lineWidth=2;rr(ctx,C[0],C[1],cw,ch,ch/2);ctx.stroke();T(ctx,"credit towards an award",cx,cy+7*s,{w:700,size:Math.max(18,21*s),align:"center",color:rgba(mix(INK,BPL,b),1)});});});
  return B;}
// a business key: its key set's prefix in the source's colour, then the rest
const SQ_KS={SIS:SRC3[0][1],LMS:SRC3[1][1],SC:SRC3[2][1]};
function sq_key(ctx,x,y,key,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const sz=o.size||20,[pre,...rest]=key.split("|"),r="|"+rest.join("|"),w=tw(ctx,pre+r,sz,500,"mono")+28,X=o.align==="center"?x-w/2:x,col=SQ_KS[pre];
  withA(ctx,a,()=>{glass(ctx,X,y-sz/2-9,w,sz+18,(sz+18)/2,col,{fill:"rgba(7,12,24,0.92)",glow:8,ea:0.8});withA(ctx,1-(o.lift||0),()=>T(ctx,pre,X+14,y+sz*0.36,{f:"mono",w:500,size:sz,color:rgba(col,1)}));
    T(ctx,r,X+14+tw(ctx,pre,sz,500,"mono"),y+sz*0.36,{f:"mono",w:500,size:sz,color:rgba(INK,0.95)});});return w;}

/* ---------- the loop of ten steps, small ---------- */
// the loop from the opening film, small enough to sit in a corner but still readable: ten numbered dots on a dashed ellipse
// (rx × ry round x, y); on[i] lights each station (its dot and number turn the weeds' green and glow), the rest stay dim
function sq_loop(ctx,x,y,rx,ry,t,on,a){if(a<=0.01)return;const r=16;withA(ctx,a,()=>{
  ctx.save();ctx.strokeStyle=rgba(WEED,0.45);ctx.lineWidth=2;ctx.setLineDash([5,8]);ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.stroke();ctx.restore();
  STEPS10.forEach((_,i)=>{const k=on[i]||0,[px,py]=stepPos(i,x,y,rx,ry),rr_=r*(1+0.15*k);withA(ctx,0.4+0.6*k,()=>{if(k>0)glow(ctx,px,py,rr_*2.6,WEED,0.3*k);
    ctx.fillStyle="rgba(7,12,24,0.97)";ctx.beginPath();ctx.arc(px,py,rr_,0,TAU);ctx.fill();ring(ctx,px,py,rr_,mix(SOFT,WEED,k),1,2.2+k);
    T(ctx,(i+1)+"",px,py+6.5,{f:"mono",w:700,size:18,align:"center",color:rgba(mix(SOFT,WEED,k),1)});});});});}

/* ---------- the sources ---------- */
// a source system's stream: its card, and its records rising from below in its colour
function sq_stream(ctx,x,yTop,yBot,k,t,a){if(a<=0.01)return;const col=SRC3[k][1];withA(ctx,a,()=>{const g=ctx.createLinearGradient(0,yTop,0,yBot);g.addColorStop(0,rgba(col,0.14));g.addColorStop(1,rgba(col,0));ctx.fillStyle=g;rr(ctx,x-130,yTop,260,yBot-yTop,18);ctx.fill();
  for(let i=0;i<18;i++){const u=((t*0.18+hash(i,k+60))%1),yy=lerp(yBot,yTop+70,u),xx=x+(hash(i,k+61)-0.5)*200,al=Math.sin(Math.PI*u);ctx.fillStyle=rgba(col,0.55*al);rr(ctx,xx-18,yy-4,36,8,3);ctx.fill();}
  srcCard(ctx,x-160,yTop,320,k,{});});}
// one learner as a source holds her: the name, and the key that source uses. Spaces are drawn as visible dots
function sq_aisha(ctx,x,y,k,key,a){if(a<=0.01)return;const col=SRC3[k][1];withA(ctx,a,()=>{glass(ctx,x-150,y-44,300,96,16,col,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.96)"});
  T(ctx,"Aisha",x,y-8,{w:800,size:24,align:"center"});const shown=key.replace(/ /g,"·"),w=tw(ctx,shown,20,500,"mono");let xx=x-w/2;
  for(const ch of shown){T(ctx,ch,xx,y+30,{f:"mono",w:500,size:20,color:rgba(ch==="·"?SQ_AMB:col,1)});xx+=tw(ctx,ch,20,500,"mono");}});}

/* ---------- the labs' and scenarios' pictures ----------
   Added to the film bundle's LV registry (Keeping it true's true.js defines it; these keys are prefixed sq_ so they never clash).
   Each draws with the film's own components and takes its words from vis in site/assets/start-from-a-question/learn.*.js.
   Words are sized for the real width: a lab's picture lays itself out wide (a stage 560 CSS px or more) or narrow (a phone),
   and every layout keeps its smallest words at about 12 CSS px or more. A scenario's picture is always about 380 to 470 px wide,
   so it has one layout, drawn in a 760 × 405 box. */
function sq_fit(c,w,h,bw,bh){const k=Math.min(w/bw,h/bh);c.translate((w-bw*k)/2,(h-bh*k)/2);c.scale(k,k);}
function sq_fill(s,o){return String(s).replace(/\{(\w+)\}/g,(m,k)=>o[k]!=null?o[k]:m);}
function sq_count(pick,b){return Object.values(pick||{}).filter(x=>x===b).length;}
// the stage's width in CSS pixels (the canvas's own width when it isn't on a page yet)
function sq_cssW(c,w){const cw=c.canvas&&c.canvas.clientWidth;return cw>0?cw:w;}
// a lab's box: wide 1440 × 780, or narrow 720 × 390 on a stage under 560 CSS px. Returns true when narrow
function sq_lab(c,w,h){const n=sq_cssW(c,w)<560;sq_fit(c,w,h,n?720:1440,n?390:780);return n;}
// the largest size from sz down to min at which s fits in maxW
function sq_size(c,s,maxW,sz,min,wt){while(sz>min&&tw(c,s,sz,wt||700)>maxW)sz-=1;return sz;}
// centred lines of text round (cx, cy), wrapped to maxW; returns the lines' height
function sq_lines(c,s,cx,cy,maxW,o){const sz=o.size||28,lh=o.lh||Math.round(sz*1.22),ls=wrapT(c,s,0,0,maxW,{w:o.w||700,size:sz,measure:true}),h=ls.length*lh;
  if(!o.measure)ls.forEach((l,i)=>T(c,l,cx,cy-h/2+lh*(i+0.78),{w:o.w||700,size:sz,align:o.align||"center",color:o.color}));return h;}
// tags in centred rows inside maxW, row by row (rowH apart), shrinking from sz to fit; cols(i) is each tag's colour.
// Returns each tag's centre
function sq_flow(c,items,cx,y,maxW,sz,rowH,cols){const gap=18;sz=Math.min(sz,...items.map(s=>sq_size(c,s,maxW-26,sz,18)));const wd=s=>tw(c,s,sz,700)+26,rows=[[]];let used=0;
  items.forEach((s,i)=>{const ww=wd(s);if(rows[rows.length-1].length&&used+gap+ww>maxW){rows.push([]);used=0;}const r=rows[rows.length-1];used+=(r.length?gap:0)+ww;r.push(i);});
  const at=[];rows.forEach((r,ri)=>{const tot=r.reduce((a,i)=>a+wd(items[i]),0)+gap*(r.length-1);let x=cx-tot/2;r.forEach(i=>{const ww=wd(items[i]);at[i]=[x+ww/2,y+ri*rowH];tag(c,x+ww/2,y+ri*rowH,items[i],cols(i),{align:"center",size:sz});x+=ww+gap;});});return at;}
// a glossary term on a card, in one or two lines, shrinking from sz (never under min) to fit
function sq_tcard(c,x,y,w,h,s,o){const on=o.on||0,dim=o.dim||0,cl=o.col||KIND,col=mix(SOFT,cl,on);let sz=o.size||32;const min=o.min||26;
  while(sz>min&&wrapT(c,s,0,0,w-28,{w:800,size:sz,measure:true}).length>2)sz--;
  withA(c,1-0.62*dim,()=>{if(on>0)glow(c,x+w/2,y+h/2,w*0.6,cl,0.25*on);glass(c,x,y,w,h,14,col,{glow:8+12*on,ea:0.7,fill:"rgba(7,12,24,0.94)"});
    sq_lines(c,s,x+w/2,y+h/2,w-28,{size:sz,w:800,color:rgba(mix(INK,cl,on*0.35),1)});});}
// which glossary terms each starting point lights (indices into vis.terms); null: all of them, and growing
const SQ_LIT={plan:[0,1,2,3],fees:[0,6],curious:[0],dash:null,all:null,near:null};
// each owner slot's options, as people (0 Mei, 1 the learning team, 2 Planning, 3 Noor), in the order learn.*.js lists them,
// and who is right
const SQ_OWN=[[2,3,0,1],[0,1,2,3],[3,2,1,0],[1,0,3,2],[2,0,3,1]],SQ_OWN_OK=[0,1,0,1,0];
function sq_owner(c,who,x,y,r,t){if(who===0)sq_face(c,"mei",x,y,r,1,{t});else if(who===1)sq_face(c,"tom",x,y,r,1,{t});else if(who===3)sq_face(c,"noor",x,y,r,1,{t});else sq_badge(c,x,y,r,"planning",null,{});}
// a candidate beside the credential, row by row: label, then value (a business key drawn as a key); vc colours each value
function sq_rows(c,x,y,w,name,col,rows,o){const n=rows.length,rh=o.rh,hh=o.head;glass(c,x,y,w,hh+n*rh+o.pad,18,col,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.95)"});
  T(c,name,x+26,y+hh*0.62,{w:800,size:sq_size(c,name,w-52,o.name,24,800),color:rgba(col,1)});
  rows.forEach(([lab,val,vc],i)=>{const yy=y+hh+i*rh;c.fillStyle="rgba(170,200,245,0.12)";c.fillRect(x+18,yy,w-36,1.5);
    const lx=x+26,vx=o.stack?x+26:x+Math.max(o.col,48+Math.max(...rows.map(r=>tw(c,r[0],o.lab,600)))),ly=o.stack?yy+o.lab+8:yy+rh/2+o.lab*0.36,vy=o.stack?yy+o.lab+14+o.val:yy+rh/2+o.val*0.36;
    T(c,lab,lx,ly,{w:600,size:o.lab,color:rgba(SOFT,1)});
    if(/^[A-Z]+\|\S+$/.test(val))sq_key(c,vx,vy-o.val*0.36,val,{size:o.val-4});else T(c,val,vx,vy,{w:700,size:sq_size(c,val,w-(vx-x)-22,o.val,22),color:rgba(vc||INK,1)});});}
Object.assign(LV,{
  // scope it: the starting point on a card, and the glossary terms it lights; with no decision, every term lights and more arrive
  sq_scope:(c,w,h,st,L)=>{const V=L.vis,k=SQ_LIT[st.pick]!==undefined?st.pick:"plan",lit=SQ_LIT[k],grow=!lit,nod=grow||k==="curious";c.save();const nar=sq_lab(c,w,h);
    const W_=nar?720:1440;let qs=nar?28:36;if(nar)while(qs>24&&wrapT(c,V.q[k],0,0,W_-80,{w:700,size:qs,measure:true}).length>3)qs--;const qh=sq_lines(c,V.q[k],0,0,W_-80,{size:qs,measure:true})+(nar?26:36);
    glass(c,12,10,W_-24,qh,18,SQ_CON,{glow:14,ea:0.8,fill:"rgba(7,12,24,0.95)"});sq_lines(c,V.q[k],W_/2,10+qh/2,W_-80,{size:qs});
    const ty=10+qh+(nar?32:42);tag(c,W_/2,ty,nod?V.noDecision:V.decision,nod?EDGE_:GOOD,{align:"center",size:nar?26:30});
    if(!nar){V.terms.forEach((s,i)=>{const x=20+(i%4)*352,y=ty+50+Math.floor(i/4)*134,on=grow||lit.includes(i);sq_tcard(c,x,y,336,118,s,{on:on?1:0,dim:on?0:0.7,col:grow?EDGE_:TRUST,size:34,min:28});});
      if(grow)tag(c,720,746,V.growing,EDGE_,{align:"center",size:30});}
    else{const y0=ty+60;if(grow){const it=V.terms.slice(0,4);sq_flow(c,[...it,sq_fill(V.moreGrow,{n:V.terms.length-4})],360,y0,700,26,54,i=>i<4?EDGE_:SOFT);}
      else{const it=lit.map(i=>V.terms[i]);sq_flow(c,[...it,sq_fill(V.more,{n:V.terms.length-lit.length})],360,y0,700,26,54,i=>i<it.length?TRUST:SOFT);}}
    c.restore();},
  // what's in the slice: the twelve terms, lit when placed in the slice and dimmed when left out, with a count of each
  sq_slice:(c,w,h,st,L)=>{const V=L.vis,p=st.pick&&typeof st.pick==="object"?st.pick:{};c.save();const nar=sq_lab(c,w,h);
    if(!nar){const qh=sq_lines(c,V.q.plan,720,0,1360,{size:32,measure:true});sq_lines(c,V.q.plan,720,14+qh/2,1360,{size:32,color:rgba(SQ_CON,1)});
      V.terms.forEach((s,i)=>{const x=20+(i%4)*352,y=qh+50+Math.floor(i/4)*146;sq_tcard(c,x,y,336,128,s,{on:p[i]==="in"?1:0,dim:p[i]==="out"?0.8:0,col:TRUST,size:34,min:28});});
      tag(c,380,736,V.touches+" · "+sq_count(p,"in")+" "+V.placed,TRUST,{align:"center",size:30});tag(c,1070,736,V.out+" · "+sq_count(p,"out")+" "+V.placed,SOFT,{align:"center",size:30});}
    else{V.terms.forEach((s,i)=>{const x=8+(i%3)*238,y=6+Math.floor(i/3)*82;sq_tcard(c,x,y,228,74,s,{on:p[i]==="in"?1:0,dim:p[i]==="out"?0.8:0,col:TRUST,size:26,min:24});});
      const a=V.touches+" · "+sq_count(p,"in"),b=V.out+" · "+sq_count(p,"out"),sz=Math.min(sq_size(c,a,330,26,22),sq_size(c,b,300,26,22));
      tag(c,190,362,a,TRUST,{align:"center",size:sz});tag(c,545,362,b,SOFT,{align:"center",size:sz});}
    c.restore();},
  // combine or split: the credential beside the candidate (on a phone, the candidate alone), each of its rows green where it
  // matches a credential and red where it doesn't, and the verdict
  sq_kinds:(c,w,h,st,L)=>{const V=L.vis,k=V.cand[st.pick]?st.pick:"micro",cd=V.cand[k],lab=L.labs.find(x=>x.id==="kinds"),res=lab?lab.w.res[k]:[1,1,1,1],ok=res.every(r=>r===1);c.save();const nar=sq_lab(c,w,h);
    const rc=r=>r===1?GOOD:r===0?EDGE_:TRUST;
    if(!nar){const o={rh:122,head:86,pad:10,name:40,lab:28,val:32,stack:true};
      sq_rows(c,20,16,690,V.cred,TRUST,V.rows.map((r,i)=>[r,V.credRow[i]]),o);sq_rows(c,730,16,690,cd[0],ok?TRUST:EDGE_,V.rows.map((r,i)=>[r,cd[i+1],rc(res[i])]),o);
      tag(c,720,700,V.verdict[k],ok?GOOD:EDGE_,{align:"center",size:sq_size(c,V.verdict[k],1300,36,28)});}
    else{sq_rows(c,10,8,700,cd[0],ok?TRUST:EDGE_,V.rows.map((r,i)=>[r,cd[i+1],rc(res[i])]),{rh:60,head:62,pad:6,name:32,lab:24,val:28,col:200});
      tag(c,360,354,V.verdict[k],ok?GOOD:EDGE_,{align:"center",size:sq_size(c,V.verdict[k],650,28,24)});}
    c.restore();},
  // who owns the meaning: each part of the model, with the owner chosen for it, green when it's right and red when not;
  // the learner given to Planning leaves the wallet app's meaning with no one to settle it
  sq_owners:(c,w,h,st,L)=>{const V=L.vis,p=Array.isArray(st.pick)?st.pick:[],plan=p[0]!=null&&SQ_OWN[0][p[0]]===2;c.save();const nar=sq_lab(c,w,h);
    const G=nar?{rh:58,y0:4,bw:452,ts:26,ax:[462,492],fx:514,fr:21,nx:542,nw:176,ns:24}:{rh:150,y0:16,bw:560,ts:34,ax:[592,676],fx:730,fr:48,nx:794,nw:420,ns:32};
    V.ownLines.forEach((s,i)=>{const y=G.y0+i*G.rh,cy=y+(G.rh-12)/2,ch=p[i],who=ch==null?null:SQ_OWN[i][ch],ok=who===SQ_OWN_OK[i],col=ch==null?SOFT:ok?GOOD:EDGE_;
      glass(c,8,y,G.bw,G.rh-12,14,BPL,{glow:8,ea:0.6,fill:"rgba(7,12,24,0.95)"});T(c,s,24,cy+G.ts*0.36,{w:700,size:sq_size(c,s,G.bw-32,G.ts,nar?23:28)});
      arrowTo(c,G.ax[0],cy,G.ax[1],cy,col,ch==null?0.35:0.9,{head:nar?10:14,lw:nar?2.2:2.6,dash:ch==null?[6,8]:null});
      if(ch==null){T(c,"?",G.fx,cy+G.ns*0.5,{w:800,size:G.ns+10,align:"center",color:rgba(SOFT,1)});return;}
      sq_owner(c,who,G.fx,cy,G.fr,0);const nm=V.people[who],ns=sq_size(c,nm,G.nw,G.ns,24);
      if(tw(c,nm,ns,700)<=G.nw)T(c,nm,G.nx,cy+ns*0.36,{w:700,size:ns,color:rgba(col,1)});else sq_lines(c,nm,G.nx,cy,G.nw,{size:ns,align:"left",color:rgba(col,1),lh:ns+2});});
    if(plan){if(!nar){sq_badge(c,1330,250,52,"wallet",null,{});sq_lines(c,V.wallet,1330,350,200,{size:28,w:800});T(c,"?",1330,160,{w:800,size:52,align:"center",color:rgba(EDGE_,1)});
        sq_lines(c,V.unsettled,1330,440,200,{size:28,color:rgba(EDGE_,1)});}
      else{sq_badge(c,40,340,24,"wallet",null,{});const m=V.wallet+" · "+V.unsettled;T(c,m,80,349,{w:700,size:sq_size(c,m,630,26,22),color:rgba(EDGE_,1)});}}
    c.restore();},
  // the scenarios: one layout each, in a 760 × 405 box
  sq_q_all:(c,w,h,st,L)=>{const V=L.vis;c.save();sq_fit(c,w,h,760,405);tag(c,380,26,V.everything,EDGE_,{align:"center",size:28});
    V.terms.forEach((s,i)=>sq_tcard(c,8+(i%3)*252,62+Math.floor(i/3)*85,240,76,s,{on:1,col:EDGE_,size:26,min:24}));c.restore();},
  sq_q_row:(c,w,h,st,L)=>{const V=L.vis;c.save();sq_fit(c,w,h,760,405);
    glass(c,40,10,680,104,18,KIND,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});T(c,V.learner+" =",68,52,{w:800,size:30,color:rgba(KIND,1)});T(c,V.row,68,94,{f:"mono",w:500,size:sq_size(c,V.row,630,26,22,500)});
    SRC3.forEach(([_,col],i)=>{const x=10+i*252,cx=x+116;glass(c,x,178,232,82,16,col,{glow:10,ea:0.75,fill:"rgba(7,12,24,0.94)",a:i?0.6:1});sq_lines(c,V.systems[i],cx,219,210,{size:24});
      arrowTo(c,380,118,cx,172,i?EDGE_:col,i?0.45:0.9,{head:12,lw:2.2,dash:i?[6,8]:null});
      if(i){cross_(c,cx,292,30,EDGE_,1);sq_lines(c,V.missed[i-1],cx,350,226,{size:24,color:rgba(EDGE_,1)});}else tick_(c,cx,294,32,GOOD,1);});c.restore();},
  sq_q_fee:(c,w,h,st,L)=>{const V=L.vis;c.save();sq_fit(c,w,h,760,405);bpPaper(c,14,40,456,320,1,{});
    V.terms.slice(0,4).forEach((s,i)=>bpBox(c,40,62+i*72,404,58,s,i===1?TRUST:KIND,1,{size:sq_size(c,s,370,26,22)}));
    sq_tcard(c,560,120,190,92,V.terms[6],{on:0.7,col:EDGE_,size:30});arrowTo(c,552,166,482,166,EDGE_,0.8,{head:12,lw:2.4,dash:[6,8]});
    T(c,"?",517,140,{w:800,size:40,align:"center",color:rgba(EDGE_,1)});sq_badge(c,655,282,34,"planning",null,{});T(c,V.planning,655,350,{w:800,size:26,align:"center"});c.restore();},
  sq_q_word:(c,w,h,st,L)=>{const V=L.vis;c.save();sq_fit(c,w,h,760,405);
    V.words.forEach((s,i)=>{const col=SRC3[i][1],y=12+i*132;glass(c,10,y,340,112,16,col,{glow:10,ea:0.75,fill:"rgba(7,12,24,0.94)"});T(c,"“"+s+"”",180,y+50,{w:800,size:32,align:"center",color:rgba(col,1)});
      T(c,V.systems[i],180,y+90,{w:600,size:sq_size(c,V.systems[i],316,24,22,600),align:"center",color:rgba(SOFT,1)});arrowTo(c,358,y+56,470,238,col,0.8,{head:12,lw:2.2});});
    bpBox(c,478,196,272,86,V.learner,KIND,0,{size:sq_size(c,V.learner,240,34,26)});sq_face(c,"mei",614,96,56,1,{});c.restore();},
  sq_q_award:(c,w,h,st,L)=>{const V=L.vis;c.save();sq_fit(c,w,h,760,405);
    [[V.glossaryDef,12,SOFT],[V.registrar,418,TRUST]].forEach(([n,x,col])=>{glass(c,x,12,330,124,18,col,{glow:10,ea:0.75,fill:"rgba(7,12,24,0.95)"});T(c,n,x+24,52,{w:600,size:sq_size(c,n,290,24,22,600),color:rgba(SOFT,1)});T(c,V.terms[2],x+24,110,{w:800,size:36,color:rgba(col,1)});});
    T(c,"≠",380,92,{w:800,size:52,align:"center",color:rgba(EDGE_,1)});
    kt_agent(c,190,236,48,0,{});tag(c,190,350,V.agentPicks,EDGE_,{align:"center",size:sq_size(c,V.agentPicks,330,26,22)});
    sq_face(c,"mei",583,230,62,1,{});T(c,"Mei",583,330,{w:800,size:28,align:"center"});T(c,V.registrar,583,368,{w:600,size:24,align:"center",color:rgba(SOFT,1)});c.restore();},
  sq_q_attend:(c,w,h,st,L)=>{const V=L.vis,cd=V.cand.attend;c.save();sq_fit(c,w,h,760,405);
    sq_rows(c,20,10,560,cd[0],SRC3[2][1],[[V.rows[0],cd[1]],[V.rows[3],cd[4],EDGE_]],{rh:62,head:66,pad:8,name:30,lab:24,val:28,col:150});
    T(c,"?",680,120,{w:800,size:64,align:"center",color:rgba(TRUST,1)});tag(c,300,250,"+ "+V.credit5,TRUST,{align:"center",size:28});sq_face(c,"mei",300,340,52,1,{});c.restore();},
  sq_q_split:(c,w,h,st,L)=>{const V=L.vis;c.save();sq_fit(c,w,h,760,405);
    glass(c,12,10,736,152,18,TRUST,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.96)"});T(c,V.cred,36,52,{w:800,size:30,color:rgba(TRUST,1)});
    const at=sq_flow(c,[V.terms[2],V.cand.micro[0],V.cand.badge[0]],380,110,700,28,50,()=>TRUST);
    tag(c,at[1][0],196,V.credit5,TRUST,{align:"center",size:26});
    sq_flow(c,V.reasons,380,258,740,26,52,()=>SOFT);c.restore();},
  sq_q_order:(c,w,h,st,L)=>{const V=L.vis;c.save();sq_fit(c,w,h,760,405);
    const qh=sq_lines(c,V.q.near,0,0,680,{size:30,measure:true})+30;glass(c,30,10,700,qh,18,SQ_CON,{glow:12,ea:0.8,fill:"rgba(7,12,24,0.95)"});sq_lines(c,V.q.near,380,10+qh/2,680,{size:30});
    tag(c,380,qh+46,V.noDecision,EDGE_,{align:"center",size:26});
    // shuffled, in centred rows
    sq_flow(c,[3,0,4,1,2].map(k=>V.order[k]),380,qh+128,740,28,60,()=>WEED);c.restore();}
});
