/* ===== Why it moves: the film's own pictures (prefixed d3_) =====
   1965: a night map of a grid, its cities lit, going dark from Niagara outwards; the relay that tripped; each utility's own area;
   a rulebook with one seal. Today: three letters, the utility's badge, the motivation layer's cards (lavender paper while they're
   drafts, purple glass once confirmed), a sketch of a valley with a wind farm and a line through it, and a gauge with a question. */

const MOT=LAY6[0][1],MOTP=[220,210,255],MOTD=[96,78,170],LAMP=[255,214,150];

/* ---------- 1965 ---------- */
// cities of the grid, [x, y, the utility whose area it is in]; the first is Niagara Falls. Not a real map: a sketch of one.
const D3_NODES=[[720,470,0],[640,330,0],[540,400,0],[960,250,0],[800,560,1],[930,470,1],[1080,450,1],[1250,480,1],[1300,720,2],[1150,640,2],[960,700,2],[1460,610,3],[1580,480,3],[1500,360,3]];
const D3_EDGES=[[0,1],[0,2],[1,2],[1,3],[0,4],[4,5],[5,6],[6,7],[3,6],[4,10],[10,9],[9,8],[9,7],[7,8],[7,11],[11,12],[12,13],[7,13],[8,11],[5,9]];
const D3_AREA=[[255,190,120],[150,200,255],[190,230,150],[230,170,230]];
// how many lines away from Niagara each city is: the order the dark reaches them
const D3_HOP=(()=>{const h=D3_NODES.map(()=>99);h[0]=0;let q=[0];while(q.length){const n=q.shift();D3_EDGES.forEach(([a,b])=>{const m=a===n?b:b===n?a:-1;if(m>=0&&h[m]>h[n]+1){h[m]=h[n]+1;q.push(m);}});}return h;})();
// the map: off(i) says how dark city i is (0 lit, 1 dark); o.areas (0..1) outlines each utility's area; o.a fades it all
function d3_grid(ctx,t,off,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{
  const ar=o.areas||0;if(ar>0)D3_AREA.forEach((col,k)=>{const P=D3_NODES.filter(n=>n[2]===k);let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;P.forEach(([x,y])=>{x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);});
    withA(ctx,ar,()=>{ctx.save();ctx.setLineDash([10,10]);ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2.4;rr(ctx,x0-56,y0-56,x1-x0+112,y1-y0+112,40);ctx.stroke();ctx.fillStyle=rgba(col,0.05+0.04*Math.sin(t*2+k));ctx.fill();ctx.restore();});});
  D3_EDGES.forEach(([i,j])=>{const v=1-Math.max(off(i),off(j)),[x0,y0]=D3_NODES[i],[x1,y1]=D3_NODES[j];ctx.strokeStyle=rgba(mix([70,66,64],LAMP,v),0.25+0.45*v);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();});
  D3_NODES.forEach(([x,y],i)=>{const v=1-off(i),fl=1+0.06*Math.sin(t*3+i);if(v>0.02)glow(ctx,x,y,70*fl,LAMP,0.32*v);ctx.fillStyle=rgba(mix([58,56,60],[255,236,190],v),1);ctx.beginPath();ctx.arc(x,y,i===0?11:9,0,TAU);ctx.fill();});});}
// the relay at Niagara, in a small circle: its contacts close, then the lever swings open as f goes from 0 to 1
function d3_relay(ctx,x,y,r,f,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-r,y-r,2*r,2*r,r,CLAY,{glow:10,ea:0.7,fill:"rgba(26,16,10,0.94)"});
  const an=lerp(0,-0.75,ease(clamp(f,0,1)));ctx.save();ctx.strokeStyle=rgba(PARCH,0.95);ctx.fillStyle=rgba(PARCH,0.95);ctx.lineWidth=5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x-r*0.7,y+r*0.25);ctx.lineTo(x-r*0.35,y+r*0.25);ctx.stroke();ctx.beginPath();ctx.moveTo(x+r*0.35,y+r*0.25);ctx.lineTo(x+r*0.7,y+r*0.25);ctx.stroke();
  ctx.beginPath();ctx.arc(x-r*0.35,y+r*0.25,6,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(x+r*0.35,y+r*0.25,6,0,TAU);ctx.fill();
  ctx.translate(x-r*0.35,y+r*0.25);ctx.rotate(an);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(r*0.72,0);ctx.stroke();ctx.restore();
  if(f>0.02&&f<0.6)glow(ctx,x+r*0.35,y+r*0.25,40,[255,200,120],0.6*(1-f/0.6));});}
// a rulebook, closed, with one seal
function d3_book(ctx,x,y,w,h,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=24;ctx.fillStyle="rgba(96,52,40,1)";rr(ctx,x,y,w,h,10);ctx.fill();ctx.restore();
  ctx.fillStyle="rgba(70,36,28,1)";ctx.fillRect(x,y,26,h);ctx.strokeStyle="rgba(222,170,112,0.7)";ctx.lineWidth=2;rr(ctx,x+40,y+20,w-60,h-40,6);ctx.stroke();
  ctx.fillStyle="rgba(238,232,218,0.95)";ctx.fillRect(x+w-6,y+8,6,h-16);
  [0,1,2].forEach(k=>{ctx.fillStyle="rgba(222,170,112,0.6)";ctx.fillRect(x+80,y+70+k*34,w-140,6);});
  const sx=x+w-90,sy=y+h-90;glow(ctx,sx,sy,70,[220,60,50],0.25);ctx.fillStyle="rgba(176,40,36,1)";ctx.beginPath();for(let i=0;i<=24;i++){const an=i/24*TAU,rr_=46+(i%2?4:0);ctx.lineTo(sx+Math.cos(an)*rr_,sy+Math.sin(an)*rr_);}ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(240,170,150,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,sy,30,0,TAU);ctx.stroke();});}

/* ---------- today ---------- */
// a letter: a sheet of paper with a heading and a few lines; lit[i] (0..1) brings each line up
function d3_letter(ctx,x,y,w,h,head,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot||0});
  ctx.fillStyle=rgba(o.col||[120,110,170],0.9);ctx.fillRect(x+24,y+24,w-48,6);T(ctx,head,x+28,y+78,{w:800,size:30,color:rgba(INKD,0.95)});
  lines.forEach((l,i)=>{const on=o.lit?o.lit[i]||0:1;withA(ctx,0.18+0.82*on,()=>T(ctx,l,x+28,y+138+i*46,{w:600,size:30,color:rgba(INKD,0.9)}));});});}
// the utility, as a badge: a circle with a bolt; o.wob shakes it
function d3_badge(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-r,y-r,2*r,2*r,r,EAC,{glow:16,ea:0.85,fill:"rgba(7,12,24,0.95)"});
  ctx.fillStyle=rgba(EAC,1);ctx.beginPath();ctx.moveTo(x+r*0.12,y-r*0.6);ctx.lineTo(x-r*0.32,y+r*0.08);ctx.lineTo(x-r*0.02,y+r*0.08);ctx.lineTo(x-r*0.14,y+r*0.6);ctx.lineTo(x+r*0.34,y-r*0.1);ctx.lineTo(x+r*0.04,y-r*0.1);ctx.closePath();ctx.fill();
  if(o.label)T(ctx,o.label,x,y+r+44,{w:800,size:30,align:"center",color:rgba(EAC,1)});});}
// an element of the motivation layer: lavender paper while it's a draft, purple glass as o.glass goes to 1. A header names its kind,
// with ArchiMate's glyph for it, large enough to tell the kinds apart (o.kind:false leaves only the glyph, at the left, for small cards;
// o.kindText overrides the name, as in "principle 1"); then a title and an optional second line; o.st its status dot; o.src a source
function d3_card(ctx,cx,cy,w,h,kind,title,line,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const gl=clamp(o.glass||0,0,1),sz=o.size||32,lsz=o.lsize||28,head=o.kind!==false;
  withA(ctx,a,()=>{sticky(ctx,cx,cy,w,h,"",{col:MOTP,edge:MOT,glass:gl,rot:0,st:o.st,src:o.src,srcA:o.srcA});
    if(o.hi)withA(ctx,o.hi,()=>{ctx.save();ctx.strokeStyle=rgba(MOT,0.9);ctx.lineWidth=4;rr(ctx,cx-w/2-6,cy-h/2-6,w+12,h+12,14);ctx.stroke();ctx.restore();});
    const ink=gl>0.5?INK:INKD,gc=gl>0.5?MOT:MOTD,x0=cx-w/2,y0_=cy-h/2;let top=y0_;
    if(head){archGlyph(ctx,kind,x0+46,y0_+36,22,gc);T(ctx,o.kindText||kind,x0+90,y0_+47,{f:"mono",w:600,size:30,color:rgba(gc,1),deco:o.deco});
      ctx.fillStyle=rgba(gc,0.35);ctx.fillRect(x0+16,y0_+70,w-32,1.5);top=y0_+72;}
    else archGlyph(ctx,kind,x0+36,cy,17,gc);
    const tx=head?x0+26:x0+66,tw_=head?w-52:w-(o.st!=null?100:80),ls=wrapT(ctx,title,0,0,tw_,{size:sz,w:800,measure:true}),lh=sz*1.15,tot=ls.length*lh+(line?lsz*1.35:0),mid=(top+cy+h/2)/2,y1=mid-tot/2+sz*0.8;
    ls.forEach((l,i)=>T(ctx,l,tx,y1+i*lh,{w:800,size:sz,color:rgba(ink,0.94),deco:o.deco}));
    if(line)T(ctx,line,tx,y1+ls.length*lh+lsz*0.3,{w:600,size:lsz,color:rgba(ink,0.72),deco:o.deco});});}
// a sketch of the valley in marker on a sheet: hills with a wind farm on the left, the valley, a substation on the right; p draws the
// new line from the wind farm, through the valley, to the substation. Returns the knot where the ropes are tied.
function d3_valley(ctx,x,y,w,h,t,p){sheet(ctx,x,y,w,h,{rot:-0.004});
  const g=(fx,fy)=>[x+fx*w,y+fy*h];
  marker(ctx,[g(0.02,0.55),g(0.1,0.32),g(0.2,0.28),g(0.3,0.42),g(0.38,0.7),g(0.5,0.86),g(0.62,0.7),g(0.7,0.5),g(0.8,0.42),g(0.9,0.5),g(0.98,0.45)],1,{lw:3});
  // a river in the valley
  marker(ctx,[g(0.42,0.9),g(0.47,0.84),g(0.53,0.88),g(0.58,0.82)],1,{lw:2,col:"rgba(60,110,170,0.8)"});
  // the wind farm
  [[0.1,0.3],[0.16,0.27],[0.22,0.3]].forEach(([fx,fy],k)=>{const[bx,by]=g(fx,fy);marker(ctx,[[bx,by],[bx,by-110]],1,{lw:3});const an=t*1.6+k;ctx.save();ctx.strokeStyle=rgba(INKD,0.85);ctx.lineWidth=3;ctx.lineCap="round";
    for(let i=0;i<3;i++){const b=an+i*TAU/3;ctx.beginPath();ctx.moveTo(bx,by-110);ctx.lineTo(bx+Math.cos(b)*50,by-110+Math.sin(b)*50);ctx.stroke();}ctx.restore();});
  // the substation
  const[sx,sy]=g(0.88,0.48);ctx.save();ctx.strokeStyle=rgba(INKD,0.85);ctx.lineWidth=3;ctx.strokeRect(sx-50,sy-90,100,90);ctx.beginPath();ctx.moveTo(sx-50,sy-90);ctx.lineTo(sx-20,sy-130);ctx.lineTo(sx+20,sy-130);ctx.lineTo(sx+50,sy-90);ctx.stroke();ctx.restore();
  // the new line, dashed, drawn up to p
  const[k0,k1]=g(0.5,0.6),L=[g(0.22,0.12),[k0,k1],[sx,sy-130]];if(p>0){ctx.save();ctx.setLineDash([14,10]);marker(ctx,L,p,{lw:4,col:"rgba(176,40,36,0.9)"});ctx.restore();}
  return[k0,k1];}
// a gauge whose needle can't settle, with a question mark
function d3_gauge(ctx,x,y,r,t,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(MOT,0.9);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,r,Math.PI,TAU);ctx.stroke();
  for(let i=0;i<=6;i++){const an=Math.PI+i/6*Math.PI;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.82,y+Math.sin(an)*r*0.82);ctx.lineTo(x+Math.cos(an)*r,y+Math.sin(an)*r);ctx.stroke();}
  const an=-Math.PI/2+0.9*Math.sin(t*1.7)*Math.sin(t*0.6);ctx.strokeStyle=rgba(INK,0.95);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(an)*r*0.8,y+Math.sin(an)*r*0.8);ctx.stroke();ctx.restore();
  T(ctx,"?",x,y+r*0.62,{w:800,size:44,align:"center",color:rgba(MOT,1)});});}
