/* ===== Making of · Data for Films: components =====
   The film takes apart a real frame of The Inner Life of Data (ILD, embedded by tools/build.py), so every number it shows is read from that frame. */
const SCENES=[];const cue=(sc,id)=>sc.cues[id];
function scene(id,draw){const n=NARR[id];SCENES.push({id,name:n.name,lead:n.lead,tail:n.tail,vo:n.vo,draw});}
const nextCue=(sc,id)=>{const ks=sc.vo.map(v=>v.id),i=ks.indexOf(id);return i<ks.length-1?sc.cues[ks[i+1]]:sc.voEnd;};
const pulse=(t,t0,d)=>t>t0&&t<t0+(d||2.2)?Math.sin(Math.PI*(t-t0)/(d||2.2)):0;
const R_=[255,96,96],G_=[110,230,140],B_=[100,160,255],AMBER=[255,190,90],VIOLET=[190,140,255];
function vign(ctx,S){setScreen(ctx,S);const v=ctx.createRadialGradient(W/2,H/2,H*0.3,W/2,H/2,W*0.75);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,0.55)");ctx.fillStyle=v;ctx.fillRect(0,0,W,H);}
function bgWorld(ctx,S,cam){setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#070b17");g.addColorStop(1,"#03050b");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  setCam(ctx,S,cam);const x0=cam.x-W/2/cam.z,x1=cam.x+W/2/cam.z,y0=cam.y-H/2/cam.z,y1=cam.y+H/2/cam.z;ctx.strokeStyle="rgba(120,160,230,0.045)";ctx.lineWidth=1/cam.z;
  for(let x=Math.floor(x0/48)*48;x<=x1;x+=48){ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y1);ctx.stroke();}for(let y=Math.floor(y0/48)*48;y<=y1;y+=48){ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();}}
function dark(ctx,S,a){if(a<=0)return;setScreen(ctx,S);ctx.fillStyle="rgba(3,5,11,"+a+")";ctx.fillRect(0,0,W,H);}
const fmtN=n=>Math.round(n).toLocaleString("en-US");

/* ---------- the embedded film ---------- */
// the moment the film follows: 2:31 of The Inner Life of Data, in Refining with dbt
const T231=151;
// the frame, drawn once at 1920×1080, and its pixels as numbers (RGBA, as the canvas stores them)
const FR={img:null,px:null};
// a film that shares these components can get more ready in PREP_EXTRA (the second Making of film loads its pictures there)
async function PREP_MORE(){if(typeof PREP_EXTRA==="function")await PREP_EXTRA();await ILD.prepAssets();FR.img=mkCanvas(W,H);ILD.renderFrame(FR.img.getContext("2d"),1,T231);FR.px=FR.img.getContext("2d").getImageData(0,0,W,H).data;}
const pix=(x,y)=>{x=clamp(x|0,0,W-1);y=clamp(y|0,0,H-1);const i=(y*W+x)*4,d=FR.px;return d?[d[i],d[i+1],d[i+2]]:[0,0,0];};
// the pixel the camera dives into: on the glowing edge of the second lens, where the light fades into the dark
const FOCUS={x:470,y:540};
// the film itself, at any moment, full screen
function ildAt(ctx,S,t){ctx.save();ILD.renderFrame(ctx,S,t);ctx.restore();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";}
// a small copy of the film at any moment, for a picture in a picture
const MINI=new Map();
function ildMini(t,w){let c=MINI.get(w);if(!c){c=mkCanvas(w,Math.round(w*9/16));MINI.set(w,c);}const x=c.getContext("2d");x.save();ILD.renderFrame(x,w/W,t);x.restore();return c;}

/* ---------- pixels ---------- */
// the frozen frame, magnified z times around the frame pixel (fx,fy), which lands at screen (sx,sy).
// Past about 6×, pixels are drawn as crisp squares; past 14×, a grid; past 60×, each square shows its three numbers.
function pixelView(ctx,S,fx,fy,z,o){o=o||{};const sx=o.sx==null?W/2:o.sx,sy=o.sy==null?H/2:o.sy;setScreen(ctx,S);ctx.fillStyle="#03050b";ctx.fillRect(0,0,W,H);
  if(!FR.img)return;ctx.save();ctx.imageSmoothingEnabled=z<6;ctx.setTransform(S*z,0,0,S*z,S*(sx-fx*z),S*(sy-fy*z));ctx.drawImage(FR.img,0,0);ctx.restore();
  const x0=Math.floor(fx-sx/z)-1,x1=Math.ceil(fx+(W-sx)/z)+1,y0=Math.floor(fy-sy/z)-1,y1=Math.ceil(fy+(H-sy)/z)+1,X=px=>sx+(px-fx)*z,Y=py=>sy+(py-fy)*z;
  const ga=sstep(14,30,z)*(o.grid==null?1:o.grid);if(ga>0&&x1-x0<400){setScreen(ctx,S);ctx.strokeStyle="rgba(0,0,0,"+(0.55*ga)+")";ctx.lineWidth=Math.min(3,z/30);ctx.beginPath();
    for(let x=x0;x<=x1;x++){ctx.moveTo(X(x),0);ctx.lineTo(X(x),H);}for(let y=y0;y<=y1;y++){ctx.moveTo(0,Y(y));ctx.lineTo(W,Y(y));}ctx.stroke();}
  const na=sstep(60,95,z)*(o.nums==null?1:o.nums);if(na>0){setScreen(ctx,S);const fs=Math.min(30,z*0.17);
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const cx=X(x+0.5),cy=Y(y+0.5);if(cx<-z||cx>W+z||cy<-z||cy>H+z)continue;const p=pix(x,y),lum=0.3*p[0]+0.59*p[1]+0.11*p[2],ink=lum>140?"rgba(10,12,20,":"rgba(245,248,255,";
      const foc=x===FOCUS.x&&y===FOCUS.y?1:0,a=na*(o.only?(foc?1:o.others||0):1);if(a<=0.01)continue;
      ["R","G","B"].forEach((k,i)=>T(ctx,p[i]+"",cx,cy+(i-1)*fs*1.2+fs*0.36,{f:"mono",w:500,size:fs,align:"center",color:ink+(a*0.95)+")"}));}}}
// a pixel's three numbers, big, as three bars and values
function rgbCard(ctx,x,y,p,a,o){o=o||{};withA(ctx,a,()=>{glass(ctx,x,y,420,230,18,[200,215,240],{glow:14,ea:0.5,fill:"rgba(7,12,24,0.92)"});
  ctx.fillStyle=rgba(p,1);rr(ctx,x+24,y+24,70,70,10);ctx.fill();ctx.strokeStyle="rgba(255,255,255,0.4)";ctx.lineWidth=1.5;rr(ctx,x+24,y+24,70,70,10);ctx.stroke();
  T(ctx,o.title||"one pixel",x+112,y+54,{w:700,size:24});T(ctx,o.sub||("at "+FOCUS.x+", "+FOCUS.y),x+112,y+84,{w:500,size:18,color:rgba(SOFT,0.95),f:"mono"});
  [["red",R_],["green",G_],["blue",B_]].forEach(([n,c],i)=>{const yy=y+128+i*32,g=o.grow==null?1:clamp(o.grow*3-i,0,1);T(ctx,n,x+24,yy+7,{w:600,size:18,color:rgba(c,1)});
    ctx.fillStyle="rgba(255,255,255,0.08)";rr(ctx,x+100,yy-7,220,14,7);ctx.fill();ctx.fillStyle=rgba(c,0.9);rr(ctx,x+100,yy-7,Math.max(6,220*p[i]/255*g),14,7);ctx.fill();T(ctx,Math.round(p[i]*g)+"",x+390,yy+8,{f:"mono",w:500,size:22,align:"right"});});});}

/* ---------- code ---------- */
// a panel of simplified code: the running line is lit, lines appear as they're reached
function codePanel(ctx,x,y,w,lines,o){o=o||{};const lh=o.lh||44,h=o.h||(lines.length*lh+(o.title?92:44));glass(ctx,x,y,w,h,18,o.edge||CYAN,{glow:16,ea:0.5,fill:"rgba(6,10,20,0.93)"});
  let yy=y+44;if(o.title){T(ctx,o.title,x+26,y+40,{w:700,size:18,color:rgba(o.edge||CYAN,1)});yy=y+88;}
  lines.forEach((l,i)=>{const sh=o.shown==null?1:clamp(o.shown-i,0,1);if(sh<=0)return;const hi=o.hi===i?1:0;
    if(hi){ctx.fillStyle=rgba(o.edge||CYAN,0.14);rr(ctx,x+12,yy-lh*0.68,w-24,lh*0.92,8);ctx.fill();ctx.fillStyle=rgba(o.edge||CYAN,0.9);rr(ctx,x+12,yy-lh*0.68,4,lh*0.92,2);ctx.fill();}
    withA(ctx,sh,()=>{let xx=x+30;(Array.isArray(l)?l:[[l,INK]]).forEach(([s,c])=>{T(ctx,s,xx,yy,{f:"mono",w:500,size:o.size||24,color:rgba(c,hi||o.hi==null?1:0.72)});xx+=tw(ctx,s,o.size||24,500,"mono");});});yy+=lh;});}
// the real source of a function, as the film runs it: wrapped as it is, with no clean-up
function srcLines(src,cols){const out=[];src.split("\n").forEach(line=>{for(let i=0;i<line.length;i+=cols)out.push(line.slice(i,i+cols));});return out;}
function realCode(ctx,x,y,w,h,src,o){o=o||{};const fs=o.size||15,cw=fs*0.6,cols=Math.floor((w-48)/cw),L=srcLines(src,cols),lh=fs*1.45,max=Math.floor((h-86)/lh);
  glass(ctx,x,y,w,h,18,AMBER,{glow:18,ea:0.55,fill:"rgba(8,8,14,0.95)"});T(ctx,o.title||"the real code",x+24,y+38,{w:700,size:18,color:rgba(AMBER,1)});if(o.file)T(ctx,o.file,x+w-24,y+38,{w:500,size:16,align:"right",f:"mono",color:rgba(SOFT,0.9)});
  const shown=o.reveal==null?L.length:Math.floor(L.length*clamp(o.reveal,0,1));
  L.slice(0,Math.min(max,shown)).forEach((l,i)=>T(ctx,l,x+24,y+76+i*lh,{f:"mono",w:500,size:fs,color:"rgba(255,226,190,0.92)"}));
  if(L.length>max){const g=ctx.createLinearGradient(0,y+h-70,0,y+h-14);g.addColorStop(0,"rgba(8,8,14,0)");g.addColorStop(1,"rgba(8,8,14,0.96)");ctx.fillStyle=g;ctx.fillRect(x+4,y+h-70,w-8,56);}}
// the film's own functions, as text: what its browser actually runs
const SRC={gate:gate.toString(),dtile:dtile.toString(),setCam:setCam.toString(),easeCam:"const easeCam="+easeCam.toString()+";",hash:"const hash="+hash.toString()+";",glow:glow.toString()};

/* ---------- drawing, simplified ---------- */
// the shapes the simplified code draws, on a stage that stands for the canvas
const STG={x:1000,y:150,w:820,h:560};
const SHAPES=[
 {k:"rect",c:[70,130,220],d:(ctx,u)=>{ctx.fillStyle=rgba([70,130,220],0.95);ctx.fillRect(60,60,300*u,180);}},
 {k:"circle",c:AMBER,d:(ctx,u)=>{ctx.fillStyle=rgba(AMBER,0.95);ctx.beginPath();ctx.moveTo(560,150);ctx.arc(560,150,100,-Math.PI/2,-Math.PI/2+TAU*u);ctx.closePath();ctx.fill();}},
 {k:"line",c:C.hot,d:(ctx,u)=>{ctx.strokeStyle=rgba(C.hot,1);ctx.lineWidth=10;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(70,470);ctx.lineTo(70+300*u,470-150*u);ctx.stroke();}},
 {k:"curve",c:VIOLET,d:(ctx,u)=>{const p=bez(P(440,480),P(520,300),P(640,560),P(760,360),40);ctx.strokeStyle=rgba(VIOLET,1);ctx.lineWidth=10;ctx.lineCap="round";poly(ctx,p.slice(0,Math.max(2,Math.round(40*u)+1)));ctx.stroke();}},
 {k:"word",c:INK,d:(ctx,u)=>withA(ctx,u,()=>T(ctx,"silver",440,250,{w:800,size:64}))}];
const SIMPLE=[
 [["fill ",CYAN],["rectangle ",INK],["x 60  y 60  300 × 180",SOFT],["  blue",[110,160,240]]],
 [["fill ",CYAN],["circle ",INK],["x 560  y 150  r 100",SOFT],["  amber",AMBER]],
 [["draw ",CYAN],["line ",INK],["from 70,470 to 370,320",SOFT]],
 [["draw ",CYAN],["curve ",INK],["from 440,480 … 760,360",SOFT]],
 [["write ",CYAN],["\"silver\" ",INK],["x 440  y 250",SOFT]]];
function stage(ctx,prog,o){o=o||{};glass(ctx,STG.x-14,STG.y-14,STG.w+28,STG.h+28,20,[190,210,240],{glow:16,ea:0.4,fill:"rgba(4,7,14,0.96)"});
  T(ctx,"the canvas",STG.x,STG.y-30,{w:700,size:18,color:rgba(SOFT,0.95)});
  ctx.save();ctx.beginPath();ctx.rect(STG.x,STG.y,STG.w,STG.h);ctx.clip();ctx.translate(STG.x,STG.y);SHAPES.forEach((s,i)=>{const u=clamp(prog-i,0,1);if(u>0)s.d(ctx,ease(u));});ctx.restore();}
// rasterising: a coarse grid of pixels over the circle's edge, each coloured by how much of it the shape covers (worked out here with 8×8 samples per pixel)
const RAS=(()=>{const cols=16,rows=10,cx=6.5,cy=11.8,r=10.2,out=[];for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){let n=0;for(let a=0;a<8;a++)for(let b=0;b<8;b++){const x=i+(a+0.5)/8,y=j+(b+0.5)/8;if((x-cx)*(x-cx)+(y-cy)*(y-cy)<r*r)n++;}out.push(n/64);}return{cols,rows,cx,cy,r,cov:out};})();
function rasterGrid(ctx,x,y,cell,o){o=o||{};const R=RAS,bg=[6,10,20],fc=AMBER,a=o.fill==null?1:o.fill;
  for(let j=0;j<R.rows;j++)for(let i=0;i<R.cols;i++){const cv=R.cov[j*R.cols+i],on=o.hard?(cv>=0.5?1:0):cv,c=mix(bg,fc,on*a);ctx.fillStyle=rgba(c,1);ctx.fillRect(x+i*cell,y+j*cell,cell,cell);
    if(o.pct&&cv>0.02&&cv<0.98)withA(ctx,o.pct,()=>T(ctx,Math.round(cv*100)+"%",x+i*cell+cell/2,y+j*cell+cell/2+7,{f:"mono",w:500,size:Math.min(19,cell*0.3),align:"center",color:cv>0.55?"rgba(20,14,6,0.9)":"rgba(240,244,255,0.9)"}));}
  ctx.strokeStyle="rgba(0,0,0,0.6)";ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<=R.cols;i++){ctx.moveTo(x+i*cell,y);ctx.lineTo(x+i*cell,y+R.rows*cell);}for(let j=0;j<=R.rows;j++){ctx.moveTo(x,y+j*cell);ctx.lineTo(x+R.cols*cell,y+j*cell);}ctx.stroke();
  if(o.outline)withA(ctx,o.outline,()=>{ctx.strokeStyle="rgba(255,255,255,0.9)";ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x+R.cx*cell,y+R.cy*cell,R.r*cell,0,TAU);ctx.stroke();});}

/* ---------- a data tile, layer by layer ---------- */
// the same steps as the film's tile (tile2 in style2.js), each drawn on its own transparent sheet
const TL5=["card","picture","frame","corners","timestamp"];const LSH=new Map();
function layerSheet(k,cell){const key=k+"|"+cell;let b=LSH.get(key);if(b)return b;const K=2,S2=TCELL*K,P2=TPAD*K,N=S2+2*P2;b=mkCanvas(N,N);const x=b.getContext("2d"),bc=[235,245,255];
  if(k==="card"){rr(x,P2,P2,S2,S2,8*K);x.fillStyle="rgba(8,14,28,0.96)";x.fill();x.fillStyle="rgba(255,255,255,0.035)";for(let yy=0;yy<S2;yy+=4*K)x.fillRect(P2,P2+yy,S2,K);}
  else if(k==="picture"){x.save();rr(x,P2+10*K,P2+10*K,S2-20*K,S2-20*K,6*K);x.clip();x.drawImage(master2(K),(cell%6)*TCELL*K,((cell/6)|0)*TCELL*K,S2,S2,P2,P2,S2,S2);x.restore();}
  else if(k==="frame"){x.strokeStyle=rgba(bc,0.95);x.lineWidth=2*K;rr(x,P2,P2,S2,S2,8*K);x.stroke();}
  else if(k==="corners"){x.lineWidth=3*K;x.strokeStyle=rgba(bc,1);const cl=16*K,o4=5*K;[[P2,P2,1,1],[P2+S2,P2,-1,1],[P2,P2+S2,1,-1],[P2+S2,P2+S2,-1,-1]].forEach(([cx,cy,dx,dy])=>{x.beginPath();x.moveTo(cx-dx*o4,cy+dy*cl);x.lineTo(cx-dx*o4,cy-dy*o4);x.lineTo(cx+dx*cl,cy-dy*o4);x.stroke();});}
  else{const st="23:02 UTC";x.font=font(500,15*K,"mono");const sw=x.measureText(st).width;rr(x,P2+18*K,P2+S2-44*K,sw+16*K,24*K,6*K);x.fillStyle="rgba(4,8,16,0.9)";x.fill();x.fillStyle="rgba(235,244,255,0.95)";x.textBaseline="middle";x.fillText(st,P2+26*K,P2+S2-32*K);}
  LSH.set(key,b);return b;}
// draws the sheets in the given order; ex (0..1) pulls them apart into a stack, with each sheet's outline, like layers in a design tool
function tileStack(ctx,cx,cy,size,order,ex,o){o=o||{};const cell=o.cell==null?14:o.cell,n=order.length,N=(TCELL+2*TPAD)*2,s=size*N/(TCELL*2);
  order.forEach((k,i)=>{const d=(i-(n-1)/2)*ex,x=cx+d*o.dx,y=cy+d*o.dy,a=o.shown==null?1:clamp(o.shown-i,0,1);if(a<=0)return;
    withA(ctx,a,()=>{if(ex>0.02){ctx.save();ctx.strokeStyle="rgba(170,200,255,"+(0.35*ex)+")";ctx.setLineDash([8,8]);ctx.lineWidth=1.5;ctx.strokeRect(x-s/2,y-s/2,s,s);ctx.restore();
        withA(ctx,sstep(0.55,0.95,ex)*(o.names==null?1:o.names),()=>T(ctx,(i+1)+"  "+k,x+s/2+18,y-s/2+24,{w:700,size:20,color:rgba(o.hl===k?AMBER:SOFT,1)}));}
      ctx.drawImage(layerSheet(k,cell),x-s/2,y-s/2,s,s);});});}

/* ---------- light ---------- */
// two glows: painted one over the other, or added together as light
function glowPair(ctx,cx,cy,r,sep,mode,a){ctx.save();ctx.globalAlpha*=a;const cs=[[70,130,255],[255,110,60]];
  cs.forEach((c,i)=>{const x=cx+(i?1:-1)*sep/2,g=ctx.createRadialGradient(x,cy,0,x,cy,r);g.addColorStop(0,rgba(c,1));g.addColorStop(0.55,rgba(c,0.85));g.addColorStop(1,rgba(c,0));ctx.globalCompositeOperation=mode;ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,cy,r,0,TAU);ctx.fill();});
  ctx.restore();}
// a tile's picture split into its red, green and blue numbers; sh slides red and blue apart, as the raw tiles' glitch does
const CHN=new Map();
function channels(cell){let c=CHN.get(cell);if(c)return c;const S2=TCELL*2,src=mkCanvas(S2,S2),sx=src.getContext("2d");sx.drawImage(master2(2),(cell%6)*TCELL*2,((cell/6)|0)*TCELL*2,S2,S2,0,0,S2,S2);
  const d=sx.getImageData(0,0,S2,S2).data;c=[0,1,2].map(k=>{const b=mkCanvas(S2,S2),bx=b.getContext("2d"),id=bx.createImageData(S2,S2),o=id.data;for(let i=0;i<d.length;i+=4){o[i+k]=d[i+k];o[i+3]=255;}bx.putImageData(id,0,0);return b;});CHN.set(cell,c);return c;}
function splitTile(ctx,x,y,size,sh,cell,spread){const ch=channels(cell);ctx.save();ctx.beginPath();rr(ctx,x-4-(spread||0),y-4,size+8+2*(spread||0),size+8,10);ctx.fillStyle="#000";ctx.fill();ctx.globalCompositeOperation="lighter";
  ch.forEach((b,k)=>{const dx=(k===0?-1:k===2?1:0)*sh+(k-1)*(spread||0);ctx.drawImage(b,x+dx,y,size,size);});ctx.restore();}

/* ---------- a platform to fly over, drawn with the film's own components ---------- */
// the world, in its own units: sources on the left, bronze, the dbt refinery, silver, gold and the business domains on the right
const WX={X0:900,X1:1820,Y:560,V:65,INT:1.1};
function worldBase(ctx,t){
  [["sis",170],["lms",330],["hr",490],["fin",650]].forEach(([k,y],i)=>{sysCard(ctx,-420,y-50,300,100,APP[k].n,APP[k].s,APP[k].c);lane(ctx,[P(-120,y),P(80,y),P(260,WX.Y-60+i*40),P(420,WX.Y-60+i*40)],APP[k].c,0.9);});
  vault(ctx,420,380,300,380,LAYER.bronze,(r,c)=>hash(r*31+c,5)>0.7?null:APP[["sis","lms","hr","fin"][(hash(r*7+c,6)*4)|0]].c,"Bronze","as it arrived");
  beam(ctx,[P(720,WX.Y),P(2050,WX.Y)],[210,225,255],[[40,0.03],[14,0.06]]);
  glass(ctx,1000,392,380,220,22,DBT,{glow:14,ea:0.45,fill:"rgba(30,20,30,0.28)"});glass(ctx,1450,392,300,220,22,DBT,{glow:14,ea:0.45,fill:"rgba(30,20,30,0.28)"});
  [[900,"tests"],[1080,"dedupe"],[1290,"lens"],[1600,"join"]].forEach(([x,k])=>gate(ctx,x,WX.Y,180,[190,225,255],k));
  chip(ctx,1190,330,"dbt","staging models","clean each source",{align:"center",ts:20,ss:16,lh:28});chip(ctx,1600,330,"dbt","intermediate models","joined as the sketch says",{align:"center",ts:20,ss:16,lh:28});
  for(let k=0;k<13;k++){const cx=1016+k*28;ctx.strokeStyle=rgba(GOOD,0.9);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(cx-5,592);ctx.lineTo(cx-1,596);ctx.lineTo(cx+6,587);ctx.stroke();}
  for(let k=0;k<10;k++){const cx=1466+k*28;ctx.strokeStyle=rgba(GOOD,0.9);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(cx-5,592);ctx.lineTo(cx-1,596);ctx.lineTo(cx+6,587);ctx.stroke();}
  vault(ctx,2050,380,300,380,LAYER.silver,(r,c)=>hash(r*13+c,8)>0.2?[214,228,255]:null,"Silver","one consistent picture");
  beam(ctx,[P(2350,WX.Y),P(2500,WX.Y)],LAYER.gold,[[30,0.04],[10,0.1]]);
  vault(ctx,2500,380,300,380,LAYER.gold,(r,c)=>hash(r*11+c,4)>0.3?[DOM.students.c,DOM.teaching.c,DOM.research.c,DOM.finance.c][(hash(r*5+c,2)*4)|0]:null,"Gold","ready for people");
  ["students","teaching","research","finance"].forEach((k,i)=>{const y=190+i*170;lane(ctx,[P(2800,WX.Y),P(2900,WX.Y),P(2960,y+50),P(3040,y+50)],DOM[k].c,0.7);sysCard(ctx,3040,y,300,100,DOM[k].n,"business domain",DOM[k].c);});}
// the tiles on the beam at world time tw: tile k sets off at k×INT seconds, and moves V units a second
const tileX=(k,tw)=>WX.X0-180+(tw-k*WX.INT)*WX.V;
function tileProps(k){const err=hash(k,51)<0.08,dup=!err&&hash(k,52)<0.12;return{cell:(hash(k,54)*24)|0,app:["sis","lms","hr","fin"][((k%4)+4)%4],err,dup,rot:(hash(k,55)-0.5)*0.7};}
function worldTiles(ctx,tw,o){o=o||{};const k1=Math.floor((tw)/WX.INT)+2,k0=k1-24;const out=[];
  for(let k=k0;k<=k1;k++){const p=tileProps(k),x=tileX(k,tw);if(x<720||x>2050)continue;const q=x<1080?0:(x<1290?1:2),sm=1-sstep(1250,1290,x),y=WX.Y+Math.sin(tw*1.7+k)*10*sm,al=sstep(720,760,x)*(1-sstep(1980,2050,x));
    if(p.err&&x>1080){const d=(x-1080)/WX.V;if(d<0.6)glow(ctx,1080,y,40+60*(1-d/0.6),BAD,1-d/0.6);continue;}
    const sp={cell:p.cell,q,app:p.app,err:p.err};if(p.dup&&x<1120){const m=sstep(1074,1116,x);dtile(ctx,x-38*(1-m),y+14*(1-m),46,p.rot*1.2*sm,sp,al*(1-m));}
    dtile(ctx,x,y,q===2?50:46,p.rot*sm,sp,al);out.push({k,x,y,p});}return out;}

/* ---------- time ---------- */
// a slider under the frame, labelled with the moment it draws
function timeBar(ctx,x,y,w,tv,t0,t1,a,o){o=o||{};withA(ctx,a,()=>{glass(ctx,x-24,y-44,w+48,92,18,CYAN,{glow:12,ea:0.5,fill:"rgba(6,10,20,0.92)"});
  ctx.fillStyle="rgba(255,255,255,0.12)";rr(ctx,x,y-3,w,6,3);ctx.fill();const u=clamp((tv-t0)/(t1-t0),0,1);ctx.fillStyle=rgba(CYAN,0.9);rr(ctx,x,y-3,w*u,6,3);ctx.fill();
  ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(x+w*u,y,11,0,TAU);ctx.fill();glow(ctx,x+w*u,y,40,CYAN,0.6);
  T(ctx,"t = "+tv.toFixed(2)+" s",x,y-16,{f:"mono",w:500,size:20,color:rgba(CYAN,1)});if(o.label)T(ctx,o.label,x+w,y-16,{w:600,size:18,align:"right",color:rgba(SOFT,0.95)});});}
// a curve of position against time, with a dot moving along it
function curvePlot(ctx,x,y,w,h,f,u,c,title){glass(ctx,x,y,w,h,16,c,{glow:10,ea:0.4,fill:"rgba(6,10,20,0.9)"});T(ctx,title,x+20,y+34,{w:700,size:19,color:rgba(c,1)});
  const px=x+30,py=y+h-26,pw=w-60,ph=h-110;ctx.strokeStyle="rgba(255,255,255,0.15)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(px,py-ph);ctx.lineTo(px,py);ctx.lineTo(px+pw,py);ctx.stroke();
  const pts=[];for(let i=0;i<=60;i++)pts.push(P(px+pw*i/60,py-ph*f(i/60)));beam(ctx,pts,c,[[8,0.15],[2.5,0.95]]);const q=P(px+pw*u,py-ph*f(u));glow(ctx,q.x,q.y,30,c,0.8);ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(q.x,q.y,6,0,TAU);ctx.fill();
  T(ctx,"time",px+pw,py+22,{w:500,size:14,align:"right",color:rgba(SOFT,0.8)});T(ctx,"position",px-6,py-ph-8,{w:500,size:14,color:rgba(SOFT,0.8)});}

/* ---------- two ways to play ---------- */
function browserWin(ctx,x,y,w,h,title,o){o=o||{};glass(ctx,x,y,w,h,16,o.edge||[180,200,235],{glow:12,ea:0.4,fill:"rgba(10,14,24,0.95)"});
  if(o.chrome!==false){ctx.fillStyle="rgba(255,255,255,0.06)";rr(ctx,x+2,y+2,w-4,40,14);ctx.fill();[0,1,2].forEach(i=>{ctx.fillStyle=["#ff6a5f","#ffc24a","#48d17a"][i];ctx.beginPath();ctx.arc(x+22+i*20,y+22,6,0,TAU);ctx.fill();});
    ctx.fillStyle="rgba(255,255,255,0.08)";rr(ctx,x+90,y+10,w-110,24,12);ctx.fill();T(ctx,title,x+104,y+28,{w:500,size:15,f:"mono",color:rgba(SOFT,0.95)});}
  else{ctx.save();ctx.strokeStyle="rgba(200,215,240,0.5)";ctx.setLineDash([10,8]);ctx.lineWidth=2;rr(ctx,x+6,y+6,w-12,h-12,12);ctx.stroke();ctx.restore();T(ctx,title,x+24,y+34,{w:600,size:16,f:"mono",color:rgba(SOFT,0.95)});}}
function waveBar(ctx,x,y,w,h,u,c){u=clamp(u,0,1);for(let i=0;i<120;i++){const v=0.25+0.75*Math.abs(Math.sin(i*0.37)*Math.sin(i*0.11+1)),bx=x+i*w/120;ctx.fillStyle=rgba(c,bx<x+w*u?0.95:0.3);rr(ctx,bx,y+h/2-v*h/2,w/120-2,v*h,1.5);ctx.fill();}
  ctx.fillStyle="#fff";ctx.fillRect(x+w*u-1.5,y-8,3,h+16);}
// areas to scale: a square for each size
function sizeSquare(ctx,x,y,side,c,title,sub,a){withA(ctx,a,()=>{ctx.save();ctx.shadowColor=rgba(c,0.6);ctx.shadowBlur=20;ctx.fillStyle=rgba(c,0.22);ctx.fillRect(x,y-side,side,side);ctx.restore();ctx.strokeStyle=rgba(c,0.95);ctx.lineWidth=2;ctx.strokeRect(x,y-side,Math.max(2,side),Math.max(2,side));
  T(ctx,title,x+Math.max(side,4)+16,y-10-(sub?26:0),{w:800,size:30,color:rgba(c,1)});if(sub)T(ctx,sub,x+Math.max(side,4)+16,y-8,{w:500,size:18,color:rgba(SOFT,0.95)});});}
