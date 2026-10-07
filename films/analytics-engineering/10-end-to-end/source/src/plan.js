/* ===== End to end: the film's own pictures (prefixed ee_) =====
   The past: York, the fourteenth century. A floor of lime plaster in the masons' loft; a window drawn on it full size, with
   dividers, its lines cut into the plaster; a wooden template cut from the drawing, a block of stone carved to match it, and the
   finished window with light through its glass; the next drawing over the first; a fresh coat of plaster, the old lines faint
   beneath it. Drawn with a dark groove and a lit edge for every cut line, and a little life from time.
   The present: the ten commits along the top (ee_ledger); each step's commit, with the files it added, changed and deleted
   (ee_commit); project files on glass (ee_code), temporary ones dashed; result tables, folders, Finance as a team and a badge,
   CI checks, the lineage from the core to Finance's forecast, and Finance's folders gathering into a project of its own. */

const EE_RUN="runs on dbt Core · DuckDB",EE_FIN=[248,140,196],EE_AMB=[255,190,90],EE_PLN=[255,170,110],EE_WAL=[196,160,255],
  EE_ADD=[120,240,170],EE_DEL=[255,128,118],EE_TMP=[255,206,120],EE_INC=[92,66,46],EE_STONE=[214,200,174];

/* ---------- the past ---------- */
// a floor of lime plaster, seen from above: warm and uneven, with specks, soft patches and a few hairline cracks, in a timber frame
function ee_plaster(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();
  ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=40;ctx.shadowOffsetY=14;const g=ctx.createLinearGradient(x,y,x+w,y+h);
  g.addColorStop(0,"rgb(226,212,186)");g.addColorStop(0.6,"rgb(204,188,160)");g.addColorStop(1,"rgb(176,158,130)");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  for(let i=0;i<60;i++){const px=x+hash(i,301)*w,py=y+hash(i,302)*h,r=20+hash(i,303)*90,gg=ctx.createRadialGradient(px,py,0,px,py,r),d=hash(i,304)>0.5;
    gg.addColorStop(0,d?"rgba(120,96,70,0.08)":"rgba(255,248,232,0.10)");gg.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=gg;ctx.fillRect(px-r,py-r,2*r,2*r);}
  for(let i=0;i<260;i++){ctx.fillStyle=hash(i,305)>0.5?"rgba(90,70,50,0.18)":"rgba(255,250,240,0.25)";ctx.fillRect(x+hash(i,306)*w,y+hash(i,307)*h,1.6,1.6);}
  ctx.strokeStyle="rgba(90,70,52,0.22)";ctx.lineWidth=1;for(let i=0;i<5;i++){let px=x+hash(i,308)*w,py=y+hash(i,309)*h;ctx.beginPath();ctx.moveTo(px,py);
    for(let k=0;k<6;k++){px+=(hash(i*7+k,310)-0.5)*60;py+=(hash(i*7+k,311)-0.2)*40;ctx.lineTo(px,py);}ctx.stroke();}
  ctx.restore();ctx.strokeStyle="rgba(70,48,30,0.92)";ctx.lineWidth=12;ctx.strokeRect(x-6,y-6,w+12,h+12);
  ctx.strokeStyle="rgba(140,100,64,0.5)";ctx.lineWidth=2;ctx.strokeRect(x-11,y-11,w+22,h+22);});}
// a plasterer's trowel: a steel blade and a wooden handle
function ee_trowel(ctx,x,y,a){withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(-0.15);const g=ctx.createLinearGradient(-70,-30,70,30);
  g.addColorStop(0,"rgb(200,204,210)");g.addColorStop(1,"rgb(118,122,130)");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-80,26);ctx.lineTo(60,26);ctx.quadraticCurveTo(90,26,92,0);
  ctx.lineTo(-60,-6);ctx.quadraticCurveTo(-84,-2,-80,26);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(40,40,46,0.8)";ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle="rgb(80,80,88)";ctx.fillRect(-12,-14,6,16);const hg=ctx.createLinearGradient(-24,-70,4,-10);hg.addColorStop(0,"rgb(150,104,62)");hg.addColorStop(1,"rgb(96,62,36)");
  ctx.fillStyle=hg;rr(ctx,-22,-66,24,54,9);ctx.fill();ctx.restore();});}
// a fresh coat of plaster, laid from left to right as p goes 0..1: smoother and paler, with the trowel at its edge
function ee_fresh(ctx,x,y,w,h,p,a,o){o=o||{};if(p<=0||a<=0.01)return;const ex=x+w*clamp(p,0,1);withA(ctx,a,()=>{ctx.save();ctx.beginPath();ctx.rect(x,y,ex-x,h);ctx.clip();
  const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,"rgba(238,228,206,"+(o.cover||0.9)+")");g.addColorStop(1,"rgba(222,208,182,"+(o.cover||0.9)+")");ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  ctx.strokeStyle="rgba(255,252,242,0.16)";ctx.lineWidth=18;for(let i=0;i<9;i++){const yy=y+(i+0.5)*h/9;ctx.beginPath();ctx.moveTo(x,yy);ctx.bezierCurveTo(x+w*0.3,yy-14,x+w*0.6,yy+14,x+w,yy);ctx.stroke();}
  ctx.restore();if(p<1)ee_trowel(ctx,ex+10,y+h*(0.35+0.3*Math.sin(p*9)),1);});}
// a figure's lines, in units (x right, y up): ["l",x0,y0,x1,y1], ["a",cx,cy,r,from,to] or ["c",cx,cy,r], in the order a mason draws them.
// A window of two lights: jambs, the arch (two arcs from the springing line), the mullion, two smaller arches, a circle and its four foils, the sill.
const EE_WIN=[["l",-1,0,-1,2.2],["l",1,0,1,2.2],["a",1,2.2,2,Math.PI,2*Math.PI/3],["a",-1,2.2,2,0,Math.PI/3],["l",0,0,0,2.2],
  ["a",0,2.2,1,Math.PI,2*Math.PI/3],["a",-1,2.2,1,0,Math.PI/3],["a",1,2.2,1,Math.PI,2*Math.PI/3],["a",0,2.2,1,0,Math.PI/3],
  ["c",0,3.42,0.34],["c",0.15,3.42,0.13],["c",-0.15,3.42,0.13],["c",0,3.57,0.13],["c",0,3.27,0.13],["l",-1.3,0,1.3,0]];
// the next drawing, over the first: a rose, its rim, its hub, eight spokes and eight small circles
const EE_ROSE=[["c",0,0,1.5],["c",0,0,0.42]].concat([0,1,2,3,4,5,6,7].map(k=>{const an=k/8*TAU;return["l",Math.cos(an)*0.42,Math.sin(an)*0.42,Math.cos(an)*1.5,Math.sin(an)*1.5];}),
  [0,1,2,3,4,5,6,7].map(k=>{const an=(k+0.5)/8*TAU;return["c",Math.cos(an)*1.02,Math.sin(an)*1.02,0.26];}));
function ee_pts(seg){const k=seg[0];if(k==="l")return[[seg[1],seg[2]],[seg[3],seg[4]]];const n=44,P=[];
  if(k==="a"){const[,cx,cy,r,a0,a1]=seg;for(let i=0;i<=n;i++){const an=lerp(a0,a1,i/n);P.push([cx+Math.cos(an)*r,cy+Math.sin(an)*r]);}}
  else{const[,cx,cy,r]=seg;for(let i=0;i<=n;i++){const an=Math.PI/2+i/n*TAU;P.push([cx+Math.cos(an)*r,cy+Math.sin(an)*r]);}}return P;}
function ee_len(P){let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);return L;}
// cuts a figure's lines into the plaster up to p (0..1 of their whole length): a dark groove with a lit edge below it.
// Returns where the line being drawn has reached, and its segment, for the dividers.
function ee_cut(ctx,segs,cx,cy,s,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01||p<=0)return null;const S=segs.map(ee_pts),L=S.map(ee_len),tot=L.reduce((x,y)=>x+y,0),X=u=>cx+u*s,Y=v=>cy-v*s;
  let left=p*tot,res=null;withA(ctx,a,()=>{S.forEach((P,i)=>{if(left<=0)return;const take=Math.min(left,L[i]);left-=take;const path=[P[0]];let acc=0;
    for(let k=1;k<P.length;k++){const d=Math.hypot(P[k][0]-P[k-1][0],P[k][1]-P[k-1][1]);if(acc+d>=take){const f=d?(take-acc)/d:1;path.push([lerp(P[k-1][0],P[k][0],f),lerp(P[k-1][1],P[k][1],f)]);break;}acc+=d;path.push(P[k]);}
    [[o.light||"rgba(255,248,232,0.6)",1.5,1.3],[o.dark||rgba(EE_INC,0.82),2.6,0]].forEach(([c,lw,off])=>{ctx.strokeStyle=c;ctx.lineWidth=lw*(o.lw||1);ctx.lineCap="round";ctx.lineJoin="round";
      ctx.beginPath();path.forEach(([u,v],k)=>{k?ctx.lineTo(X(u)+off,Y(v)+off):ctx.moveTo(X(u)+off,Y(v)+off);});ctx.stroke();});
    const q=path[path.length-1];res={x:X(q[0]),y:Y(q[1]),seg:segs[i],X,Y,done:take>=L[i]};});});return res;}
// a mason's dividers: two iron legs from a hinge, one point on the centre of an arc, the other drawing it
function ee_dividers(ctx,px,py,qx,qy,a){if(a<=0.01)return;withA(ctx,a,()=>{const d=Math.max(40,Math.hypot(qx-px,qy-py)),mx=(px+qx)/2,my=(py+qy)/2,hx=mx+(qy-py)/d*30,hy=my-Math.max(90,d*0.55);
  ctx.save();ctx.lineCap="round";[[px,py],[qx,qy]].forEach(([ex,ey])=>{ctx.strokeStyle="rgba(30,20,12,0.35)";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(hx+14,hy+22);ctx.lineTo(ex+10,ey+8);ctx.stroke();});
  [[px,py],[qx,qy]].forEach(([ex,ey])=>{const g=ctx.createLinearGradient(hx,hy,ex,ey);g.addColorStop(0,"rgb(120,118,116)");g.addColorStop(1,"rgb(52,50,50)");ctx.strokeStyle=g;ctx.lineWidth=7;
    ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(ex,ey);ctx.stroke();ctx.strokeStyle="rgba(230,226,220,0.45)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(hx-2,hy);ctx.lineTo(ex-2,ey);ctx.stroke();});
  ctx.fillStyle="rgb(96,92,88)";ctx.beginPath();ctx.arc(hx,hy,11,0,TAU);ctx.fill();ctx.strokeStyle="rgba(230,226,220,0.6)";ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle="rgb(150,104,62)";rr(ctx,hx-6,hy-34,12,26,4);ctx.fill();ctx.restore();});}
// a wooden template: a thin board cut to the curve of the arch, its grain along it
function ee_template(ctx,x,y,s,a,rot){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);
  ctx.shadowColor="rgba(0,0,0,0.45)";ctx.shadowBlur=18;ctx.shadowOffsetY=10;const g=ctx.createLinearGradient(-120,-60,120,60);g.addColorStop(0,"rgb(196,150,98)");g.addColorStop(1,"rgb(146,100,60)");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(-120,60);ctx.lineTo(-120,20);ctx.quadraticCurveTo(-40,-70,110,-60);ctx.lineTo(120,-60);ctx.lineTo(120,60);ctx.closePath();ctx.fill();ctx.restore();
  ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);ctx.strokeStyle="rgba(90,58,30,0.35)";ctx.lineWidth=1.4;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(-110,50-i*6);ctx.bezierCurveTo(-40,40-i*9,40,46-i*7,112,30-i*11);ctx.stroke();}
  ctx.strokeStyle="rgba(60,36,18,0.85)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-120,20);ctx.quadraticCurveTo(-40,-70,110,-60);ctx.stroke();ctx.restore();});}
// a block of limestone; the arch's curve carved into its face as p goes 0..1, with chips falling
function ee_stone(ctx,x,y,w,h,p,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=24;ctx.shadowOffsetY=12;
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(mix(EE_STONE,[255,255,255],0.12),1));g.addColorStop(1,rgba(mix(EE_STONE,[60,50,40],0.3),1));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.fillStyle=rgba(mix(EE_STONE,[40,30,20],0.45),1);ctx.beginPath();ctx.moveTo(x+w,y);ctx.lineTo(x+w+26,y-18);ctx.lineTo(x+w+26,y+h-18);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(mix(EE_STONE,[255,255,255],0.25),1);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+26,y-18);ctx.lineTo(x+w+26,y-18);ctx.lineTo(x+w,y);ctx.closePath();ctx.fill();
  if(p>0){ctx.save();ctx.beginPath();ctx.rect(x,y,w*clamp(p,0,1),h);ctx.clip();ctx.fillStyle=rgba(mix(EE_STONE,[50,40,30],0.35),1);ctx.beginPath();ctx.moveTo(x,y+h*0.62);ctx.quadraticCurveTo(x+w*0.36,y-h*0.05,x+w,y+h*0.1);
    ctx.lineTo(x+w,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(255,250,236,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+h*0.62+3);ctx.quadraticCurveTo(x+w*0.36,y-h*0.05+3,x+w,y+h*0.1+3);ctx.stroke();ctx.restore();
    if(p<1)for(let i=0;i<5;i++){const k=(t*1.7+i/5)%1,cx=x+w*p+hash(i,320)*18,cy=y+h*0.4+k*h*0.7;ctx.fillStyle=rgba(EE_STONE,1-k);ctx.fillRect(cx,cy,4,4);}}});}
// the window, finished in stone: coloured glass lit from behind, and the tracery in limestone over it
function ee_window(ctx,cx,cy,s,t,a){if(a<=0.01)return;withA(ctx,a,()=>{const X=u=>cx+u*s,Y=v=>cy-v*s;ctx.save();
  ctx.beginPath();ctx.moveTo(X(-1),Y(0));ctx.lineTo(X(-1),Y(2.2));ee_pts(["a",1,2.2,2,Math.PI,2*Math.PI/3]).forEach(([u,v])=>ctx.lineTo(X(u),Y(v)));ee_pts(["a",-1,2.2,2,Math.PI/3,0]).forEach(([u,v])=>ctx.lineTo(X(u),Y(v)));ctx.lineTo(X(1),Y(0));ctx.closePath();
  ctx.save();ctx.clip();const lg=ctx.createRadialGradient(cx,Y(2.6),10,cx,Y(2),s*3);lg.addColorStop(0,"rgba(255,236,190,1)");lg.addColorStop(1,"rgba(60,90,160,1)");ctx.fillStyle=lg;ctx.fillRect(X(-1.2),Y(4),2.4*s,4.2*s);
  const cols=["rgba(40,80,170,0.55)","rgba(170,40,50,0.5)","rgba(40,130,90,0.45)","rgba(220,170,60,0.45)"];for(let i=0;i<40;i++){const u=-1+((i%5)+0.5)*0.4,v=Math.floor(i/5)*0.5;ctx.fillStyle=cols[(i*7)%4];ctx.fillRect(X(u-0.2),Y(v+0.5),0.4*s,0.5*s);}
  ctx.strokeStyle="rgba(30,26,30,0.6)";ctx.lineWidth=1.5;for(let i=1;i<10;i++){ctx.beginPath();ctx.moveTo(X(-1.2),Y(i*0.42));ctx.lineTo(X(1.2),Y(i*0.42));ctx.stroke();}
  glow(ctx,cx,Y(2.2),s*1.6,[255,226,170],0.25+0.05*Math.sin(t*0.8));ctx.restore();
  const stone=(seg,lw)=>{const P=ee_pts(seg);[[rgba(mix(EE_STONE,[40,30,20],0.4),1),lw+3,2],[rgba(EE_STONE,1),lw,0]].forEach(([c,w_,off])=>{ctx.strokeStyle=c;ctx.lineWidth=w_;ctx.lineCap="round";ctx.beginPath();P.forEach(([u,v],k)=>{k?ctx.lineTo(X(u)+off,Y(v)+off):ctx.moveTo(X(u)+off,Y(v)+off);});ctx.stroke();});};
  EE_WIN.forEach((seg,i)=>stone(seg,i<4?s*0.14:i===14?s*0.2:s*0.08));ctx.restore();});}

/* ---------- the present: commits and files ---------- */
const EE_STEPS=["scope","sources","output","promise","tests","build","validate","ship","written once","evolve"];
const EE_SHA=["9731784","8e325c8","ea693b7","d4cf5d1","254da73","f761664","130a72c","4efec1f","43f3f76","39cd815"];
const EE_COUNT=[[6,4,0],[3,2,0],[0,5,0],[3,5,0],[3,6,0],[0,1,0],[1,0,0],[0,0,1],[0,4,0],[0,5,0]];
// the ten commits along the top: done ones solid, with how many files each added, changed and deleted; the current one lit
function ee_ledger(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const cur=o.cur==null?-1:o.cur,x0=96,bw=164,gap=6,y=36,h=70;withA(ctx,a,()=>{
  ctx.strokeStyle=rgba(WEED,0.25);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0+bw/2,y+h/2);ctx.lineTo(x0+9*(bw+gap)+bw/2,y+h/2);ctx.stroke();
  EE_STEPS.forEach((nm,i)=>{const x=x0+i*(bw+gap),isCur=i===cur,done=i<cur||(isCur&&(o.counted||0)>0)||(o.all||0)>0,q=isCur?1:i<cur||(o.all||0)>0?0.9:0.35,col=isCur?WEED:done?mix(WEED,SOFT,0.45):SOFT;
    withA(ctx,q,()=>{if(isCur)glow(ctx,x+bw/2,y+h/2,bw*0.7,WEED,0.2);glass(ctx,x,y,bw,h,12,col,{glow:isCur?14:6,ea:0.75,fill:"rgba(7,12,24,0.95)"});
      T(ctx,(i+1)+"",x+14,y+29,{f:"mono",w:500,size:18,color:rgba(col,1)});T(ctx,nm,x+(i<9?38:46),y+29,{w:700,size:18,color:rgba(done||isCur?INK:SOFT,1)});
      if(done){const k=isCur&&!o.all?(o.counted||0):1;withA(ctx,k,()=>{const[ad,ch,de]=EE_COUNT[i];let cx=x+14;[["+"+ad,EE_ADD,ad],["~"+ch,EE_AMB,ch],["−"+de,EE_DEL,de]].forEach(([s,c,n])=>{if(!n)return;
        T(ctx,s,cx,y+56,{f:"mono",w:500,size:18,color:rgba(c,1)});cx+=tw(ctx,s,18,500,"mono")+12;});});}});});
  // the four phases under their steps: a bracket and a name, lit for the phase of the current step (all of them at the end)
  PHASES4.forEach(([nm,f,l])=>{const xa=x0+f*(bw+gap)+8,xb=x0+l*(bw+gap)+bw-8,on=(cur>=f&&cur<=l)||(o.all||0)>0,col=on?WEED:SOFT;
    ctx.strokeStyle=rgba(col,on?0.85:0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xa,y+h+6);ctx.lineTo(xa,y+h+12);ctx.lineTo(xb,y+h+12);ctx.lineTo(xb,y+h+6);ctx.stroke();
    T(ctx,nm,(xa+xb)/2,y+h+33,{w:800,size:17,align:"center",color:rgba(col,on?1:0.7)});});});}
// one step's commit: its step and short hash, its title, then each file it touched, + added, ~ changed, − deleted, appearing as on[i] goes 0..1.
// rows: [sign, file, folder, flag]; flag "tmp" (temporary), "gen" (generated: a cog) or "". o.hi {i:0..1} lights a row
function ee_commit(ctx,x,y,w,step,title,rows,o){o=o||{};const a=o.a==null?1:o.a,rh=56,h=96+rows.length*rh;if(a<=0.01)return h;withA(ctx,a,()=>{
  glass(ctx,x,y,w,h,16,WEED,{glow:10,ea:0.75,fill:"rgba(6,10,20,0.95)"});
  T(ctx,"step "+(step+1)+" · commit",x+20,y+34,{w:800,size:20,color:rgba(WEED,1)});T(ctx,EE_SHA[step],x+w-20,y+34,{f:"mono",w:500,size:18,align:"right",color:rgba(SOFT,1)});
  T(ctx,title,x+20,y+66,{w:700,size:20});ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+84,w-28,1.2);
  rows.forEach(([sg,file,folder,flag],i)=>{const q=o.on?o.on[i]||0:1;if(q<=0)return;const yy=y+96+i*rh+24,c=sg==="+"?EE_ADD:sg==="~"?EE_AMB:EE_DEL,hi=o.hi?o.hi[i]||0:0;withA(ctx,q,()=>{
    if(hi>0)withA(ctx,hi,()=>{ctx.fillStyle=rgba(c,0.13);rr(ctx,x+10,yy-24,w-20,rh-4,8);ctx.fill();});
    T(ctx,sg,x+22,yy,{f:"mono",w:700,size:22,color:rgba(c,1)});T(ctx,file,x+50,yy,{f:"mono",w:500,size:18,color:sg==="−"?rgba(SOFT,0.85):rgba(INK,0.96)});
    if(folder)T(ctx,folder,x+50,yy+22,{f:"mono",w:500,size:18,color:rgba(SOFT,0.75)});
    if(sg==="−"){const fw=tw(ctx,file,18,500,"mono");ctx.strokeStyle=rgba(EE_DEL,0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x+48,yy-6);ctx.lineTo(x+52+fw,yy-6);ctx.stroke();}
    if(flag==="gen")ee_cog(ctx,x+w-30,yy-6,9,0,SOFT,1,0);
    if(flag==="tmp"){ctx.save();ctx.setLineDash([6,5]);ctx.strokeStyle=rgba(EE_TMP,0.85);ctx.lineWidth=1.8;rr(ctx,x+12,yy-26,w-24,rh-2,8);ctx.stroke();ctx.restore();}});});});return h;}
// a file on glass, as in the films before (wr_code): a name, a label that says where it runs, and lines typed out as p goes 0..1.
// o.wrap wraps long lines; o.lit {i:0..1} lights a line; o.seg [[visual line or -1, text, 0..1, colour]] lights words; o.strike {i:0..1} strikes a line;
// o.tmp: a temporary file, drawn dashed in amber with the label "temporary"; o.gone 0..1: deleted (struck through and fading).
function ee_code(ctx,x,y,w,name,lines,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||19,lh=o.lh||31,col=mix(o.tmp?EE_TMP:o.edge||[170,205,255],EE_AMB,o.amb||0),cw=tw(ctx,"M",sz,500,"mono");
  const V=[];lines.forEach((l,i)=>{if(!o.wrap||l.length<=o.wrap){V.push({i,s:l});return;}const i0=l.match(/^\s*/)[0].length,ind=" ".repeat(i0+2);let rest=l,first=true;
    while(rest.length){const lim=first?o.wrap:o.wrap-ind.length;if(rest.length<=lim){V.push({i,s:(first?"":ind)+rest});break;}let cut=rest.lastIndexOf(" ",lim);if(cut<=0)cut=lim;V.push({i,s:(first?"":ind)+rest.slice(0,cut)});rest=rest.slice(cut).replace(/^ /,"");first=false;}});
  const h=o.h||(76+V.length*lh);if(a<=0.01)return h;const gone=o.gone||0;
  withA(ctx,a*(1-0.65*gone),()=>{glass(ctx,x,y,w,h,14,col,{glow:12+10*(o.hi||0),ea:0.65,fill:"rgba(6,10,20,0.95)"});
    if(o.tmp){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(EE_TMP,0.8);ctx.lineWidth=2;rr(ctx,x-7,y-7,w+14,h+14,18);ctx.stroke();ctx.restore();}
    ctx.fillStyle=rgba(col,0.9);rr(ctx,x+16,y+17,10,10,3);ctx.fill();T(ctx,name,x+36,y+29,{f:"mono",w:500,size:18,color:rgba(col,1)});
    const lab=o.label!==undefined?o.label:o.tmp?"temporary":"";if(lab)T(ctx,lab,x+w-20-(o.cog?34:0),y+29,{w:700,size:18,align:"right",color:rgba(o.tmp?EE_TMP:SOFT,1)});
    if(o.cog)ee_cog(ctx,x+w-26,y+24,11,o.t||0,SOFT,1,o.spin||0);
    ctx.fillStyle="rgba(170,200,245,0.14)";ctx.fillRect(x+14,y+46,w-28,1.2);
    const n=o.p==null?V.length:V.length*o.p;V.forEach((v,j)=>{if(j>=n)return;const yy=y+80+j*lh,q=clamp(n-j,0,1),src=lines[v.i],cm=/^\s*(--|#)/.test(src),on=o.lit?o.lit[v.i]||0:0,st=o.strike?o.strike[v.i]||0:0;
      if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.16);rr(ctx,x+12,yy-lh*0.7,w-24,lh*0.95,6);ctx.fill();});
      withA(ctx,1-0.6*st,()=>T(ctx,typeOn(v.s,q),x+22,yy,{f:"mono",w:500,size:sz,color:o.lineCol&&o.lineCol[v.i]?rgba(o.lineCol[v.i],1):cm?rgba(SOFT,0.85):rgba(mix([200,225,255],o.litCol||TRUST,on*0.6),0.95)}));
      if(st>0){const lw2=tw(ctx,v.s.trim(),sz,500,"mono"),x0=x+22+cw*(v.s.length-v.s.trimStart().length);ctx.strokeStyle=rgba(EE_DEL,0.95);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x0-4,yy-sz*0.32);ctx.lineTo(x0-4+(lw2+8)*ease(st),yy-sz*0.32);ctx.stroke();}
      (o.seg||[]).forEach(([li,s,sa,sc])=>{if((li!==j&&li!==-1)||sa<=0)return;const k=v.s.indexOf(s);if(k<0)return;const sx=x+22+cw*k,sw=cw*s.length;
        withA(ctx,sa,()=>{glow(ctx,sx+sw/2,yy-6,sw*0.6,sc,0.22);ctx.fillStyle=rgba(sc,0.16);rr(ctx,sx-4,yy-lh*0.68,sw+8,lh*0.9,6);ctx.fill();T(ctx,s,sx,yy,{f:"mono",w:500,size:sz,color:rgba(sc,1)});});});});
    if(gone>0){ctx.strokeStyle=rgba(EE_DEL,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+10,y+10);ctx.lineTo(x+10+(w-20)*ease(clamp(gone*1.6,0,1)),y+10+(h-20)*ease(clamp(gone*1.6,0,1)));ctx.stroke();}});
  if(gone>0.3)withA(ctx,a*fin(gone,0.3,0.4),()=>tag(ctx,x+w/2,y+h/2,o.goneTag||"deleted",EE_DEL,{align:"center",size:22}));return h;}
function ee_cog(ctx,x,y,r,t,col,a,spin){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate((spin||0)*t*2.2);ctx.fillStyle=rgba(col,0.95);ctx.beginPath();
  for(let i=0;i<8;i++){const a0=i/8*TAU;ctx.lineTo(Math.cos(a0-0.2)*r,Math.sin(a0-0.2)*r);ctx.lineTo(Math.cos(a0-0.12)*r*1.32,Math.sin(a0-0.12)*r*1.32);ctx.lineTo(Math.cos(a0+0.12)*r*1.32,Math.sin(a0+0.12)*r*1.32);ctx.lineTo(Math.cos(a0+0.2)*r,Math.sin(a0+0.2)*r);}
  ctx.closePath();ctx.fill();ctx.fillStyle="rgba(6,10,20,1)";ctx.beginPath();ctx.arc(0,0,r*0.42,0,TAU);ctx.fill();ctx.restore();});}
// a small table of results: a header and rows in monospace, numbers right-aligned; o.on {i:0..1} shows a row, o.lit {i:0..1} lights it.
// o.empty: the text shown when there are no rows. Returns its size.
function ee_table(ctx,x,y,cols,rows,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||18,cw=tw(ctx,"M",sz,500,"mono"),lh=o.lh||34,
  W_=cols.map((c,j)=>Math.max(c.length,...rows.map(r=>String(r[j]).length),o.min&&o.min[j]||0)*cw+28),w=W_.reduce((s,v)=>s+v,0)+16,h=62+Math.max(rows.length,o.empty?1:0)*lh;
  if(a<=0.01)return{w,h};withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,o.edge||[170,205,255],{glow:10+10*(o.hi||0),ea:0.7,fill:"rgba(6,10,20,0.95)"});
    let cx=x+8;cols.forEach((c,j)=>{const right=o.right?o.right[j]:j>0;T(ctx,c,right?cx+W_[j]-14:cx+14,y+36,{f:"mono",w:500,size:sz,align:right?"right":"left",color:rgba(SOFT,1)});cx+=W_[j];});
    ctx.fillStyle="rgba(170,200,245,0.16)";ctx.fillRect(x+10,y+50,w-20,1.2);
    rows.forEach((r,i)=>{const q=o.on?o.on[i]||0:1;if(q<=0)return;const yy=y+50+lh*(i+0.78),on=o.lit?o.lit[i]||0:0;withA(ctx,q,()=>{
      if(on>0)withA(ctx,on,()=>{ctx.fillStyle=rgba(o.litCol||TRUST,0.16);rr(ctx,x+8,yy-lh*0.7,w-16,lh*0.92,6);ctx.fill();});
      let c2=x+8;r.forEach((v,j)=>{const right=o.right?o.right[j]:j>0,col=o.colCol&&o.colCol[j]?o.colCol[j]:INK;T(ctx,String(v),right?c2+W_[j]-14:c2+14,yy,{f:"mono",w:500,size:sz,align:right?"right":"left",color:rgba(col,0.96)});c2+=W_[j];});});});
    if(o.empty&&!rows.length)T(ctx,o.empty,x+w/2,y+50+lh*0.78,{w:700,size:18,align:"center",color:rgba(o.emptyCol||SOFT,1)});});return{w,h};}
// a folder, named, in its domain's colour; o.dash: a temporary folder, dashed in amber; o.on lights it
function ee_folder(ctx,x,y,name,col,o){o=o||{};const a=o.a==null?1:o.a,w=tw(ctx,name,18,500,"mono")+62;if(a<=0.01)return w;withA(ctx,a,()=>{if(o.on)glow(ctx,x+w/2,y,w*0.55,col,0.25*o.on);
  glass(ctx,x,y-24,w,48,10,col,{glow:6+10*(o.on||0),ea:0.75,fill:"rgba(7,12,24,0.95)"});ctx.fillStyle=rgba(col,0.92);ctx.beginPath();ctx.moveTo(x+14,y-9);ctx.lineTo(x+22,y-9);ctx.lineTo(x+25,y-12);
  ctx.lineTo(x+34,y-12);ctx.lineTo(x+34,y+9);ctx.lineTo(x+14,y+9);ctx.closePath();ctx.fill();
  if(o.dash){ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(EE_TMP,0.9);ctx.lineWidth=2;rr(ctx,x-5,y-29,w+10,58,13);ctx.stroke();ctx.restore();}
  T(ctx,name,x+46,y+7,{f:"mono",w:500,size:18,color:rgba(INK,0.96)});if(o.strike>0){ctx.strokeStyle=rgba(EE_DEL,0.95);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x+42,y);ctx.lineTo(x+42+(w-50)*ease(o.strike),y);ctx.stroke();}});return w;}
// a CI check: a ring, a tick or a cross, its name, and its message
function ee_ci(ctx,x,y,w,name,st,msg,o){o=o||{};const a=o.a==null?1:o.a;const col=st>=1.5?GOOD:st>=0.5?BAD:SOFT,h=msg?68+24*msg.split("\n").length:60;if(a<=0.01)return h;withA(ctx,a,()=>{
  glass(ctx,x,y,w,h,14,col,{glow:8+10*(st>0?1:0),ea:0.7,fill:"rgba(7,12,24,0.95)"});const cx=x+32,cy=y+30;
  if(st>=1.5){ctx.fillStyle="rgba(8,24,16,0.95)";ctx.beginPath();ctx.arc(cx,cy,15,0,TAU);ctx.fill();ring(ctx,cx,cy,15,GOOD,1,2.2);tick_(ctx,cx,cy+1,20,GOOD,1);}
  else if(st>=0.5)kt_rcross(ctx,cx,cy,15,1);else ring(ctx,cx,cy,15,SOFT,0.7,2,[4,4]);
  T(ctx,name,x+62,y+37,{w:700,size:o.size||20});if(msg)msg.split("\n").forEach((m,i)=>T(ctx,m,x+24,y+76+i*24,{f:"mono",w:500,size:o.msize||18,color:rgba(col,1)}));});return h;}
// a consumer's badge: Planning (bars), the wallet app (a wallet) or Finance (a stack of coins), in its colour
const EE_KIND={planning:EE_PLN,wallet:EE_WAL,finance:EE_FIN};
function ee_badge(ctx,x,y,r,kind,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=EE_KIND[kind];withA(ctx,a,()=>{glow(ctx,x,y,r*2,col,0.16+0.2*(o.hi||0));
  ctx.fillStyle="rgba(7,12,24,0.96)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,col,1,2.4);
  ctx.save();ctx.translate(x,y);const s=r/40;ctx.scale(s,s);ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,0.9);ctx.lineWidth=2.6;ctx.lineJoin="round";
  if(kind==="planning"){[[-14,6,8],[-2,-2,16],[10,-10,24]].forEach(([bx,by,bh])=>{rr(ctx,bx-4,by-bh/2+8,9,bh,2);ctx.fill();});ctx.beginPath();ctx.moveTo(-20,20);ctx.lineTo(22,20);ctx.stroke();}
  else if(kind==="wallet"){rr(ctx,-20,-13,40,28,5);ctx.stroke();ctx.beginPath();ctx.moveTo(-20,-5);ctx.lineTo(20,-5);ctx.stroke();rr(ctx,6,1,16,10,3);ctx.fill();}
  else{[14,4,-6].forEach((cy,i)=>{ctx.fillStyle=i===2?rgba(col,0.95):"rgba(7,12,24,1)";ctx.beginPath();ctx.ellipse(0,cy,18,7,0,0,TAU);ctx.fill();ctx.stroke();});T(ctx,"$",0,-1,{w:800,size:13,align:"center",color:"rgba(7,12,24,1)"});}
  ctx.restore();if(name)T(ctx,name,x,y+r+28,{w:800,size:o.size||20,align:"center",color:rgba(INK,1)});});}
// a consumer as a team: three people, head and shoulders, in its colour, breathing a little (as in An agent on the team)
function ee_team(ctx,x,y,s,col,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  [[-46,6,0.86,1],[46,6,0.86,2],[0,0,1,0]].forEach(([dx,dy,k,i])=>{const b=Math.sin(t*1.6+i*1.3)*1.2,cx=x+dx*s,cy=y+dy*s+b*s,r=24*s*k,skin=[[204,160,128],[120,84,62],[236,200,170]][i];
    ctx.save();const g=ctx.createLinearGradient(cx-50*s*k,cy,cx+50*s*k,cy+80*s*k);g.addColorStop(0,rgba(mix(col,[255,255,255],0.15),1));g.addColorStop(1,rgba(mix(col,[10,14,30],0.55),1));ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(cx-52*s*k,cy+84*s*k);ctx.bezierCurveTo(cx-54*s*k,cy+40*s*k,cx-34*s*k,cy+22*s*k,cx,cy+22*s*k);ctx.bezierCurveTo(cx+34*s*k,cy+22*s*k,cx+54*s*k,cy+40*s*k,cx+52*s*k,cy+84*s*k);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;ctx.stroke();const hg=ctx.createRadialGradient(cx-r*0.35,cy-r*0.4,r*0.2,cx,cy,r*1.1);hg.addColorStop(0,rgba(mix(skin,[255,255,255],0.18),1));hg.addColorStop(1,rgba(mix(skin,[40,24,16],0.35),1));ctx.fillStyle=hg;
    ctx.beginPath();ctx.ellipse(cx,cy,r*0.86,r,0,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle=["rgba(60,36,24,0.95)","rgba(18,14,16,0.95)","rgba(170,130,70,0.95)"][i];ctx.beginPath();ctx.ellipse(cx,cy-r*0.45,r*0.9,r*0.6,0,Math.PI,TAU);ctx.quadraticCurveTo(cx+r*0.6,cy-r*0.6,cx-r*0.2,cy-r*0.55);ctx.closePath();ctx.fill();ctx.restore();});});}
// a person's face in a circle, with a name below (as in Written once)
function ee_face(ctx,id,x,y,r,a,o){o=o||{};if(a<=0.01)return;const P=PEOPLE[id],k=r/100;withA(ctx,a,()=>{glow(ctx,x,y,r*1.8,P.edge,0.18+0.25*(o.hi||0));
  ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle="rgba(12,18,30,0.97)";ctx.fill();ctx.clip();person(ctx,id,x,y-0.1*r+505*k,k/P.build.h,{t:o.t||0,expr:o.expr||"calm",glow:0.2});ctx.restore();
  ring(ctx,x,y,r,P.edge,1,2.4);if(o.name)T(ctx,o.name,x,y+r+26,{w:800,size:19,align:"center"});});}
// a model or table, as a node: its name in monospace on a small glass pill. Returns its width
function ee_node(ctx,x,y,name,col,o){o=o||{};const a=o.a==null?1:o.a,w=tw(ctx,name,18,500,"mono")+40;if(a<=0.01)return w;const dk=o.dark||0,c=mix(col,[70,80,95],dk);withA(ctx,a*(1-0.4*dk),()=>{
  if(o.on>0)glow(ctx,x+w/2,y,w*0.6,col,0.25*o.on);glass(ctx,x,y-24,w,48,12,c,{glow:6+12*(o.on||0),ea:0.7,fill:"rgba(7,12,24,0.96)"});
  if(o.dash){ctx.save();ctx.setLineDash([7,6]);ctx.strokeStyle=rgba(EE_TMP,0.9);ctx.lineWidth=2;rr(ctx,x-5,y-29,w+10,58,14);ctx.stroke();ctx.restore();}
  T(ctx,name,x+20,y+7,{f:"mono",w:500,size:18,color:rgba(mix(INK,SOFT,dk),1)});});return w;}
// a path with light flowing along it, as in Written once
function ee_flow(ctx,pts,t,a,col,o){o=o||{};if(a<=0.01)return;const L=[];let tot=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(d);tot+=d;}
  const at=u=>{let d=u*tot;for(let i=0;i<L.length;i++){if(d<=L[i]){const k=d/L[i];return[lerp(pts[i][0],pts[i+1][0],k),lerp(pts[i][1],pts[i+1][1],k)];}d-=L[i];}return pts[pts.length-1];};
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.55);ctx.lineWidth=2.4;ctx.beginPath();const reach=o.p==null?1:o.p;for(let k=0;k<=40;k++){const[px,py]=at(k/40*reach);k?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();ctx.restore();
    if(reach>=0.98){const[ex,ey]=at(1),[qx,qy]=at(0.97),an=Math.atan2(ey-qy,ex-qx);ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.moveTo(ex,ey);ctx.lineTo(ex-16*Math.cos(an-0.4),ey-16*Math.sin(an-0.4));ctx.lineTo(ex-16*Math.cos(an+0.4),ey-16*Math.sin(an+0.4));ctx.closePath();ctx.fill();}
    const n=o.n||5;for(let i=0;i<n;i++){const u=((t*(o.sp||0.35)+i/n)%1)*reach;const[px,py]=at(u);glow(ctx,px,py,18,col,0.6);ctx.fillStyle=rgba(mix(col,[255,255,255],0.4),0.95);ctx.beginPath();ctx.arc(px,py,4,0,TAU);ctx.fill();}});}
// horizontal bars, one per row [label, value, text], growing as p goes 0..1
function ee_bars(ctx,x,y,w,rows,max,p,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{rows.forEach(([lab,v,txt],i)=>{const yy=y+i*58,q=clamp(p*rows.length-i*0.6,0,1),bw=(w-180)*v/max*ease(q);
  T(ctx,lab,x,yy+8,{f:"mono",w:500,size:20,color:rgba(SOFT,1)});ctx.fillStyle=rgba(col,0.22);rr(ctx,x+70,yy-16,bw,32,8);ctx.fill();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2;rr(ctx,x+70,yy-16,Math.max(bw,1),32,8);ctx.stroke();
  withA(ctx,fin(q,0.6,0.4),()=>T(ctx,txt,x+80+bw,yy+8,{f:"mono",w:500,size:20,color:rgba(INK,1)}));});});}
// a question asked of the project: a card with the asker's badge
function ee_qcard(ctx,x,y,w,kind,line1,line2,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,96,18,EE_KIND[kind],{glow:16,ea:0.85,fill:"rgba(7,12,24,0.96)"});ee_badge(ctx,x+48,y+48,28,kind,null,{});
  T(ctx,line1,x+92,y+42,{w:800,size:24,color:rgba(EE_KIND[kind],1)});T(ctx,line2,x+92,y+74,{w:600,size:19,color:rgba(SOFT,1)});});}

/* ---------- the labs' and scenarios' pictures ----------
   Added to the film bundle's LV registry (Keeping it true's true.js defines it; these keys are prefixed ee_ so they never clash).
   assets/from-words-to-data/learn.js calls each as f(ctx, w, h, state, L): a lab passes its state (sort: {pick, checked};
   steps: {step}; count: {on, total}), a scenario passes {q}. Any words come from L.vis (the page's learn.en.js or learn.es.js);
   paths and code stay as they are in the project. Sized as Written once's: the labs draw on a 960 x 420 board with text from 22 to
   30 px, the scenarios on 600 x 320 with text from 16 to 22 px. Few things, large. */
function ee_fit(c,w,h,bw,bh){const k=Math.min(w/bw,h/bh);c.translate((w-bw*k)/2,(h-bh*k)/2);c.scale(k,k);}
// the largest size, from size down to min, at which s fits maxW
function ee_fs(c,s,maxW,size,wt,f,min){let z=size;const m=min||Math.round(size*0.78);while(z>m&&tw(c,s,z,wt||700,f)>maxW)z-=1;return z;}
// a tag fitted to a width
function ee_ftag(c,x,y,s,col,maxW,size,o){o=o||{};const z=ee_fs(c,s,maxW-26,size,700,undefined,o.min);if(o.align==="right")x-=tw(c,s,z,700)+26;tag(c,x,y,s,col,{size:z,align:o.align==="center"?"center":undefined});}
// a file or a folder as a pill, at any size: o.dir draws a folder, o.dash a temporary file's dashed edge, o.strike a line through it
function ee_lpill(c,x,y,s,col,o){o=o||{};const sz=o.size||22,pad=o.dir?sz*2.2:sz*0.9,h=sz*2.1,on=o.on||0,dk=o.dark||0,cc=mix(col,[70,80,95],dk);
  const w=Math.min(o.maxW||1e4,tw(c,s,sz,500,"mono")+pad+sz*0.9),fz=ee_fs(c,s,w-pad-sz*0.7,sz,500,"mono",Math.round(sz*0.7));
  withA(c,(o.a==null?1:o.a)*(1-0.45*dk),()=>{if(on>0)glow(c,x+w/2,y,w*0.55,col,0.24*on);glass(c,x,y-h/2,w,h,10,cc,{glow:6+10*on,ea:0.75,fill:"rgba(7,12,24,0.96)"});
    if(o.dir){const fx=x+sz*0.6,fy=y-sz*0.42,fw=sz*0.95,fh=sz*0.84;c.fillStyle=rgba(cc,0.92);c.beginPath();c.moveTo(fx,fy+fh*0.2);c.lineTo(fx+fw*0.38,fy+fh*0.2);c.lineTo(fx+fw*0.48,fy);
      c.lineTo(fx+fw,fy);c.lineTo(fx+fw,fy+fh);c.lineTo(fx,fy+fh);c.closePath();c.fill();}
    if(o.dash){c.save();c.setLineDash([7,6]);c.strokeStyle=rgba(EE_TMP,0.9);c.lineWidth=2;rr(c,x-5,y-h/2-5,w+10,h+10,13);c.stroke();c.restore();}
    T(c,s,x+pad,y+fz*0.36,{f:"mono",w:500,size:fz,color:rgba(mix(INK,SOFT,dk),1)});
    if(o.strike>0){c.strokeStyle=rgba(EE_DEL,0.95);c.lineWidth=3;c.beginPath();c.moveTo(x+pad-4,y);c.lineTo(x+pad-4+(w-pad-sz*0.3)*ease(o.strike),y);c.stroke();}});return w;}
// a card of code, top-left at x, y: a title line, then the lines; lit lines get a soft bar
function ee_lcode(c,x,y,w,name,lines,col,o){o=o||{};const sz=o.size||22,lh=sz*1.36,h=o.h||(64+lines.length*lh);
  glass(c,x,y,w,h,14,col,{glow:8,ea:0.7,fill:"rgba(6,10,20,0.96)"});if(o.dash){c.save();c.setLineDash([9,7]);c.strokeStyle=rgba(EE_TMP,0.9);c.lineWidth=2;rr(c,x-6,y-6,w+12,h+12,18);c.stroke();c.restore();}
  T(c,name,x+20,y+36,{f:"mono",w:500,size:ee_fs(c,name,w-40,sz*0.9,500,"mono"),color:rgba(col,1)});c.fillStyle=rgba(col,0.22);c.fillRect(x+16,y+50,w-32,1.5);
  lines.forEach((s,i)=>{const yy=y+56+(i+1)*lh-lh*0.28;if(o.lit&&o.lit.indexOf(i)>=0){c.fillStyle=rgba(o.litCol||TRUST,0.18);rr(c,x+12,yy-sz*0.95,w-24,lh,6);c.fill();}
    T(c,s,x+20,yy,{f:"mono",w:500,size:ee_fs(c,s,w-40,sz,500,"mono",Math.round(sz*0.7)),color:rgba(INK,0.95)});
    if(o.strike){c.strokeStyle=rgba(EE_DEL,0.9);c.lineWidth=2.6;c.beginPath();c.moveTo(x+18,yy-sz*0.32);c.lineTo(x+18+Math.min(w-40,tw(c,s,sz,500,"mono")),yy-sz*0.32);c.stroke();}});return h;}
// the three kinds of domain, and shared, where Finance's work puts each file (the "where does it go?" lab)
const EE_LWHERE=[["app",[110,170,255],"sources/<system>/"],["data",TRUST,"models/core/<domain>/"],["biz",EE_FIN,"models/marts/finance/"],["shared",WEED,"models/_shared/ · docs/"]];
// the life of Q-FIN-01: where it lives at each step of the "follow the question" lab
const EE_LHOMES=[["_finance__requirements.yml",EE_TMP],["_finance__conceptual.yml",BPL],["_finance__decisions.yml",KIND],["_finance__models.yml",TRUST],["mart_finance__tuition_forgone.sql",EE_FIN]];
const EE_LHOME_AT=[-1,0,0,1,2,0,3,4];
// what Finance could take when it moves out (the "ready to move out?" lab): [key, label, colour, folder?]
const EE_LMOVE=[["mart","models/marts/finance/",EE_FIN,1],["exp","exposures/finance/",EE_FIN,1],["ref","seeds/reference/finance/",EE_FIN,1],["expd","seeds/expected/finance/",EE_FIN,1],
  ["test","reconcile_finance_with_tuition_report.sql",TRUST,0],["an","",SOFT,0],["core","models/core/",TRUST,1],["shared","models/_shared/",WEED,1]];
Object.assign(LV,{
  // where does it go? four homes, with how many items are placed in each, and after the check how many are right
  ee_l_where:(c,w,h,st,L)=>{const V=L.vis,P=st.pick||{},lab=L.labs.find(x=>x.vis==="ee_l_where"),B={},items=lab?lab.w.items:[];(lab?lab.w.buckets:[]).forEach(([k,t])=>B[k]=t);c.save();ee_fit(c,w,h,960,420);
    EE_LWHERE.forEach(([k,col,path],i)=>{const x=(i%2)*485,y=Math.floor(i/2)*215;glass(c,x,y,475,205,14,col,{glow:8,ea:0.7,fill:"rgba(7,12,24,0.95)"});
      const ttl=B[k]||k;T(c,ttl,x+22,y+42,{w:800,size:ee_fs(c,ttl,431,26,800,undefined,19),color:rgba(col,1)});ee_lpill(c,x+22,y+94,path,col,{dir:1,size:22,maxW:431});
      const mine=Object.keys(P).filter(j=>P[j]===k),n=mine.length,ok=mine.filter(j=>items[j]&&items[j].b===k).length;
      T(c,String(n),x+22,y+178,{w:800,size:44,color:rgba(INK,1)});T(c,(n===1&&V.placedOne||V.placed),x+30+tw(c,String(n),44,800),y+176,{w:700,size:24,color:rgba(SOFT,1)});
      if(st.checked&&n){const s=ok+" "+(ok===1&&V.rightOne||V.right);ee_ftag(c,x+453,y+168,s,ok===n?GOOD:EE_AMB,200,22,{align:"right"});}});
    c.restore();},
  // how long does it live? three lifetimes: by hand and kept, generated and never edited, and only while the work goes on
  ee_l_lives:(c,w,h,st,L)=>{const V=L.vis,P=st.pick||{},lab=L.labs.find(x=>x.vis==="ee_l_lives"),B={},items=lab?lab.w.items:[];(lab?lab.w.buckets:[]).forEach(([k,t])=>B[k]=t);c.save();ee_fit(c,w,h,960,420);
    [["hand",TRUST,V.handSub],["gen",[170,205,255],V.genSub],["tmp",EE_TMP,V.tmpSub]].forEach(([k,col,sub],i)=>{const x=8+i*322,cw=296;glass(c,x,0,cw,420,16,col,{glow:8,ea:0.75,fill:"rgba(7,12,24,0.95)"});
      if(k==="tmp"){c.save();c.setLineDash([10,8]);c.strokeStyle=rgba(EE_TMP,0.9);c.lineWidth=2.4;rr(c,x-7,-7,cw+14,434,20);c.stroke();c.restore();}
      // the mark: a page written by hand, a cog, or a page that fades
      const mx=x+cw/2,my=86;if(k==="gen")ee_cog(c,mx,my,28,0,[170,205,255],1,0);
      else{withA(c,k==="tmp"?0.75:1,()=>{glass(c,mx-26,my-34,52,68,6,col,{glow:6,ea:0.8,fill:"rgba(7,12,24,0.95)"});c.fillStyle=rgba(col,0.6);[0,1,2,3].forEach(r=>c.fillRect(mx-16,my-20+r*12,r===3?18:32,3));});
        if(k==="tmp"){c.save();c.setLineDash([6,5]);c.strokeStyle=rgba(EE_TMP,0.95);c.lineWidth=2;rr(c,mx-32,my-40,64,80,9);c.stroke();c.restore();}}
      const ttl=B[k]||k;wrapT(c,ttl,mx,166,cw-36,{w:800,size:ee_fs(c,ttl,cw-36,26,800,undefined,20),lh:32,color:rgba(col,1),align:"center"});
      wrapT(c,sub,mx,236,cw-40,{w:600,size:21,lh:26,color:rgba(SOFT,1),align:"center"});
      const mine=Object.keys(P).filter(j=>P[j]===k),n=mine.length,ok=mine.filter(j=>items[j]&&items[j].b===k).length,ns=String(n);
      const nw=tw(c,ns,44,800)+8+tw(c,(n===1&&V.placedOne||V.placed),24,700);T(c,ns,mx-nw/2,350,{w:800,size:44,color:rgba(INK,1)});T(c,(n===1&&V.placedOne||V.placed),mx-nw/2+tw(c,ns,44,800)+8,348,{w:700,size:24,color:rgba(SOFT,1)});
      if(st.checked&&n){const s=ok+" "+(ok===1&&V.rightOne||V.right);ee_ftag(c,mx,388,s,ok===n?GOOD:EE_AMB,cw-20,20,{align:"center"});}});
    c.restore();},
  // follow Q-FIN-01: on the left, the item as it is at this step; on the right, its homes, lit where it lives now
  ee_l_follow:(c,w,h,st,L)=>{const V=L.vis,k=Math.max(0,Math.min(7,st.step||0)),at=EE_LHOME_AT[k];c.save();ee_fit(c,w,h,960,420);
    if(k===0){ee_lcode(c,0,0,460,"profile_credit_across_awards.sql",[],[170,205,255],{h:420});
      T(c,"385",30,170,{w:800,size:64,color:rgba(EE_AMB,1)});wrapT(c,V.across,30,212,400,{w:600,size:22,lh:28,color:rgba(SOFT,1)});
      T(c,"160",30,320,{w:800,size:64,color:rgba(TRUST,1)});wrapT(c,V.enrolled,30,362,400,{w:600,size:22,lh:28,color:rgba(SOFT,1)});}
    else if(k===1||k===5){glass(c,0,40,460,300,16,EE_TMP,{glow:10,ea:0.8,fill:"rgba(7,12,24,0.95)"});c.save();c.setLineDash([10,8]);c.strokeStyle=rgba(EE_TMP,0.9);c.lineWidth=2.4;rr(c,-6,34,472,312,20);c.stroke();c.restore();
      withA(c,k===5?0.45:1,()=>{T(c,"Q-FIN-01",26,92,{f:"mono",w:500,size:26,color:rgba(EE_TMP,1)});wrapT(c,V.qText,26,140,410,{w:700,size:26,lh:34});ee_ftag(c,26,300,V.qOpen,EE_TMP,410,22);});
      if(k===5){c.strokeStyle=rgba(EE_DEL,0.9);c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(20,70);c.lineTo(440,320);c.stroke();ee_ftag(c,230,384,V.deleted,EE_DEL,460,24,{align:"center"});}}
    else if(k===2){ee_badge(c,50,110,38,"finance",null,{});glass(c,104,52,356,236,18,EE_FIN,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.96)"});wrapT(c,V.answer,126,104,312,{w:800,size:26,lh:34});
      T(c,"Finance",50,176,{w:800,size:20,align:"center",color:rgba(EE_FIN,1)});}
    else if(k===3)ee_lcode(c,0,0,460,"_finance__conceptual.yml",["rules:","  - Only in the award the","    learner is enrolled in","    on census day. Credit","    that counts towards","    other awards saves","    nothing there yet."],BPL,{lit:[1,2,3]});
    else if(k===4)ee_lcode(c,0,0,460,"_finance__decisions.yml",["- id: DEC-FIN-02","  title: Tuition is saved in","    the enrolled award only","  decided_by: Finance","  was: Q-FIN-01"],KIND,{lit:[4],litCol:EE_TMP});
    else if(k===6)ee_lcode(c,0,0,460,"_finance__models.yml",["unit_tests:","  - name: recognised_credit_","      saves_tuition_in_the_","      enrolled_award_only"],TRUST,{lit:[1,2,3]});
    else ee_lcode(c,0,0,460,"mart_finance__tuition_forgone.sql",["enrolled as (","    select","        learner_key,","        learner_bk,","        enrolled_award_key as award_key","    from learners_at_census","    where enrolled_award_key is not null",")"],EE_FIN,{lit:[4],size:17});
    // the homes: ticked once reached; the requirements file struck through once the question is deleted
    EE_LHOMES.forEach(([f,col],i)=>{const y=42+i*84,now=i===at,was=EE_LHOME_AT.slice(0,k+1).indexOf(i)>=0,gone=i===0&&k>=5;
      ee_lpill(c,510,y,f,col,{size:22,maxW:400,on:now?1:0,dark:was||now?0:0.7,dash:i===0,strike:gone?1:0,a:gone?0.6:1});
      if(was&&!now&&!gone)kt_gtick(c,936,y,14,1);});
    if(k>=1&&at>=0&&k!==5){const y=42+at*84;arrowTo(c,466,180,504,y,EE_LHOMES[at][1],0.8,{head:12});}
    c.restore();},
  // ready to move out? what's ticked goes into Finance's own project; the rest stays where it is
  ee_l_move:(c,w,h,st,L)=>{const V=L.vis,on=st.on||new Set();c.save();ee_fit(c,w,h,960,420);
    glass(c,500,0,460,420,18,EE_FIN,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(c,V.project,524,40,{w:800,size:ee_fs(c,V.project,410,26,800),color:rgba(EE_FIN,1)});
    T(c,V.refs,524,72,{w:600,size:ee_fs(c,V.refs,410,20,600),color:rgba(SOFT,1)});
    let li=0,ri=0;EE_LMOVE.forEach(([k,lab,col,dir])=>{const s=lab||V.analyses,inn=on.has(k);
      if(inn){ee_lpill(c,524,114+ri*38,s,col,{dir,size:17,maxW:412,on:0.5});ri++;}else{ee_lpill(c,0,26+li*52,s,col,{dir,size:20,maxW:470,dark:0.35});li++;}});
    if(!on.size)wrapT(c,V.empty,730,240,380,{w:600,size:22,lh:28,align:"center",color:rgba(SOFT,1)});
    c.restore();},

  // the scenarios
  ee_q_backlog:(c,w,h,st,L)=>{const V=L.vis;c.save();ee_fit(c,w,h,600,320);
    glass(c,6,14,268,226,16,KIND,{glow:10,ea:0.75,fill:"rgba(7,12,24,0.95)"});T(c,V.backlog,26,52,{w:800,size:ee_fs(c,V.backlog,228,22,800,undefined,15),color:rgba(KIND,1)});
    wrapT(c,V.backlogSub,26,86,228,{w:600,size:18,lh:23,color:rgba(SOFT,1)});["FIN-12","FIN-13","FIN-14"].forEach((s,i)=>{glass(c,26,148+i*28,228,22,6,KIND,{glow:2,ea:0.4,fill:"rgba(10,16,30,0.9)"});T(c,s,36,164+i*28,{f:"mono",w:500,size:14,color:rgba(SOFT,1)});});
    glass(c,326,20,268,214,16,EE_TMP,{glow:10,ea:0.75,fill:"rgba(7,12,24,0.95)"});c.save();c.setLineDash([8,6]);c.strokeStyle=rgba(EE_TMP,0.9);c.lineWidth=2;rr(c,320,14,280,226,20);c.stroke();c.restore();
    T(c,"requirements/",346,58,{f:"mono",w:500,size:20,color:rgba(EE_TMP,1)});wrapT(c,V.open,346,96,228,{w:600,size:18,lh:24,color:rgba(SOFT,1)});
    ee_lpill(c,346,186,"REQ-FIN-01",EE_TMP,{size:16,dash:1});
    arrowTo(c,276,120,322,120,SOFT,0.6,{head:10});kt_rcross(c,299,96,11,0.9);ee_ftag(c,300,276,V.copy,SOFT,560,20,{align:"center"});c.restore();},
  ee_q_rates:(c,w,h,st,L)=>{const V=L.vis;c.save();ee_fit(c,w,h,600,320);
    ee_lcode(c,6,6,330,"tuition_rates.csv",["award_type,rate_year,rate_…","graduate certificate,2025,400,…","master,2025,455,…","graduate certificate,2026,420,…","master,2026,480,…"],EE_FIN,{size:15});
    ee_lpill(c,352,60,"seeds/reference/finance/",EE_FIN,{dir:1,size:15,maxW:242});wrapT(c,V.reference,360,104,234,{w:600,size:17,lh:22,color:rgba(SOFT,1)});
    ee_lpill(c,352,170,"seeds/expected/finance/",EE_FIN,{dir:1,size:15,maxW:242});wrapT(c,V.expected,360,214,234,{w:600,size:17,lh:22,color:rgba(SOFT,1)});
    ee_ftag(c,300,296,V.which,SOFT,560,20,{align:"center"});c.restore();},
  ee_q_done:(c,w,h,st,L)=>{const V=L.vis;c.save();ee_fit(c,w,h,600,320);
    ee_lcode(c,6,6,588,"_finance__requirements.yml",["  - id: REQ-FIN-02","    title: The rows and columns the forecast needs","    status: done"],EE_TMP,{size:17,dash:1,lit:[2],litCol:EE_AMB});
    ee_ci(c,6,196,588,V.ciName,1,"",{size:18});ee_ftag(c,300,296,V.ciFail,BAD,580,16,{align:"center",min:13});c.restore();},
  ee_q_generated:(c,w,h,st,L)=>{const V=L.vis;c.save();ee_fit(c,w,h,600,320);
    ee_lpill(c,6,40,"_finance__conceptual.yml",BPL,{size:15,on:0.6,maxW:250});ee_ftag(c,10,90,V.home,BPL,240,17);arrowTo(c,262,40,326,40,SOFT,0.8,{head:10});
    glass(c,332,10,262,176,14,[170,205,255],{glow:8,ea:0.7,fill:"rgba(7,12,24,0.95)"});ee_cog(c,356,38,11,0,SOFT,1,0);
    T(c,"_finance__definitions.md",376,44,{f:"mono",w:500,size:ee_fs(c,"_finance__definitions.md",204,15,500,"mono"),color:rgba(INK,1)});
    T(c,"{% docs tuition_forgone %}",348,86,{f:"mono",w:500,size:ee_fs(c,"{% docs tuition_forgone %}",232,14,500,"mono"),color:rgba(SOFT,1)});
    c.fillStyle=rgba(EE_AMB,0.25);rr(c,344,98,238,44,6);c.fill();wrapT(c,"**Tuition forgone.** The tuition …",350,116,226,{f:"mono",w:500,size:13,lh:17,color:rgba(EE_AMB,1)});
    ee_ftag(c,344,166,V.edited,EE_AMB,240,15);ee_ci(c,6,210,588,"Doc blocks and key sets match the conceptual model",1,"",{size:17});c.restore();},
  ee_q_answer:(c,w,h,st,L)=>{const V=L.vis;c.save();ee_fit(c,w,h,600,320);
    ee_lcode(c,6,6,588,"_finance__requirements.yml",["  - id: Q-FIN-01","    title: The award recognised credit saves tuition in","    status: answered","    answer: Only the award the learner is enrolled in"],EE_TMP,{size:17,dash:1,lit:[2,3],litCol:EE_AMB});
    ee_badge(c,40,262,26,"finance",null,{});wrapT(c,V.answered,80,256,500,{w:700,size:18,lh:24,color:rgba(EE_FIN,1)});c.restore();},
  ee_q_own:(c,w,h,st,L)=>{const V=L.vis;c.save();ee_fit(c,w,h,600,320);
    glass(c,330,6,264,300,16,EE_FIN,{glow:12,ea:0.85,fill:"rgba(7,12,24,0.95)"});T(c,V.ownProject,350,40,{w:800,size:ee_fs(c,V.ownProject,224,20,800,undefined,14),color:rgba(EE_FIN,1)});
    T(c,"?",462,190,{w:800,size:72,align:"center",color:rgba(EE_FIN,0.5)});
    [["models/marts/finance/",EE_FIN,1],["exposures/finance/",EE_FIN,1],["seeds/…/finance/",EE_FIN,1],["tests/reconciliation/",TRUST,1],["analyses/",SOFT,1],["models/core/",TRUST,1]].forEach(([s,col,dir],i)=>ee_lpill(c,6,28+i*50,s,col,{dir,size:16,maxW:300}));
    c.restore();},
  ee_q_version:(c,w,h,st,L)=>{const V=L.vis;c.save();ee_fit(c,w,h,600,320);
    ee_lpill(c,6,40,"core_credit_towards_award v1",TRUST,{size:16,on:0.5});ee_lpill(c,6,110,"core_credit_towards_award v2",TRUST,{size:16,dash:1});
    ee_ftag(c,14,160,V.newVersion,EE_AMB,330,15);arrowTo(c,300,40,352,40,TRUST,0.85,{head:10});
    ee_lpill(c,356,40,"mart_finance__…",EE_FIN,{size:16,on:0.6});ee_ftag(c,362,90,V.pinned,EE_AMB,230,16);
    ee_badge(c,40,250,26,"finance",null,{});wrapT(c,V.whatNow,80,244,500,{w:700,size:18,lh:24,color:rgba(INK,1)});c.restore();},
  ee_q_next:(c,w,h,st,L)=>{const V=L.vis;c.save();ee_fit(c,w,h,600,320);
    glass(c,6,8,588,96,16,WEED,{glow:14,ea:0.85,fill:"rgba(7,12,24,0.96)"});wrapT(c,V.question,26,48,548,{w:700,size:20,lh:26});
    arrowTo(c,46,110,46,168,WEED,0.8,{head:11});
    [0,1,2,3,4,5].forEach(i=>{const x=46+i*101,y=206,on=i===0;if(on)glow(c,x,y,64,WEED,0.3);c.fillStyle="rgba(7,12,24,0.96)";c.beginPath();c.arc(x,y,28,0,TAU);c.fill();ring(c,x,y,28,on?WEED:SOFT,1,2.5);
      T(c,on?"1":"?",x,y+9,{w:800,size:24,align:"center",color:rgba(on?WEED:SOFT,1)});if(i<5)arrowTo(c,x+32,y,x+68,y,SOFT,0.5,{head:8});});
    T(c,V.order,300,290,{w:700,size:20,align:"center",color:rgba(SOFT,1)});c.restore();}
});
