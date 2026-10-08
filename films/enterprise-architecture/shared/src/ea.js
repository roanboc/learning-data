/* ===== The map before the data: the series' components =====
   A series on enterprise architecture and why it matters for data. It follows Tomás, a new enterprise architect, through his first
   weeks at a publicly owned energy utility, as he builds a map of how it works. Drawn with the films' primitives (glass, T, tag,
   glow, withA, fin), From words to data's (sheet, pencilText, ring, tick_, arrowTo, wrapT) and In the weeds of data crafting's
   motion (spring, arrive, drift, motes). Everything here is shared by the series' films; each film keeps its own pictures.
   Two materials carry the series' idea: Tomás's drafts are paper (canvases and sticky notes on a wall, slightly crooked), and the
   confirmed model is crisp glass in the layers' conventional colours. A note that moves from the wall to the model changes material. */

/* ---------- colours ---------- */
// the series' colour (sea-green, a map's), and the six layers of the map, in the colours architects conventionally give them
const EAC=[150,222,196];
const LAY6=[["motivation",[200,186,255]],["strategy",[245,206,140]],["business",[255,234,130]],["information",[255,186,150]],["application",[140,214,255]],["technology",[160,224,140]]];
// the three questions that hold the layers, and the layers each one covers
const Q3=[["why, and for whom",0,1],["how it works",2,3],["what runs it",4,5]];
// sticky notes: yellow, pink, blue and green paper
const NOTEC=[[255,228,122],[255,176,196],[164,212,255],[188,236,164]];
const INKD=[40,40,48];

/* ---------- titles ---------- */
// a flat diamond: one layer of the map seen from above
function rhomb(ctx,cx,cy,w,h){ctx.beginPath();ctx.moveTo(cx,cy-h/2);ctx.lineTo(cx+w/2,cy);ctx.lineTo(cx,cy+h/2);ctx.lineTo(cx-w/2,cy);ctx.closePath();}
// the series' mark: three layers stacked, drawn from the top as p goes from 0 to 1, in the colours of the three questions
function eaMark(ctx,x,y,s,a,p){if(a<=0.01)return;p=p==null?1:p;withA(ctx,a,()=>{[0,2,4].forEach((li,i)=>{const q=clamp(p*3-i,0,1);if(q<=0)return;const col=LAY6[li][1],cy=y-s*1.1+i*s*0.62+(1-spring(q*1.4))*-s*0.5;
  withA(ctx,clamp(q*2,0,1),()=>{ctx.save();ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=12;rhomb(ctx,x,cy,s*2.6,s*0.95);ctx.fillStyle=rgba(col,0.16);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=s*0.09;ctx.stroke();ctx.restore();});});});}
// the title card, over whatever the chapter is drawing: the series, the film's title, and where it sits in the series
function eaTitle(ctx,S,t,t0,title,sub,col,n){col=col||EAC;const oA=fin(t,t0,0.8),tA=fin(t,t0+0.5,0.8);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{glow(ctx,960,470,480,col,0.08);eaMark(ctx,960,392,30,1,(t-t0-0.5)/1.4);T(ctx,"THE MAP BEFORE THE DATA",960,458,{w:800,size:30,align:"center",color:rgba(col,0.95)});
    T(ctx,title,960,560,{w:800,size:92,align:"center"});if(sub)T(ctx,sub,960,632,{w:600,size:36,align:"center",color:rgba(SOFT,0.95)});
    withA(ctx,fin(t,t0+1.2,0.8),()=>tag(ctx,960,712,n||"enterprise architecture, for data",col,{align:"center",size:28}));});}
function eaEnd(ctx,S,t,t0,title,col,line,n){col=col||EAC;const oA=fin(t,t0,1.0),tA=fin(t,t0+0.6,0.9);if(oA<=0)return;dark(ctx,S,oA*0.97);setScreen(ctx,S);
  withA(ctx,tA,()=>{if(line)T(ctx,line,960,410,{w:700,size:44,align:"center"});eaMark(ctx,960,540,20,0.95,1);T(ctx,title,960,622,{w:800,size:44,align:"center",color:rgba(col,1)});
    T(ctx,"The map before the data"+(n?" · "+n:"")+" · Learning Data",960,680,{w:600,size:28,align:"center",color:rgba(SOFT,0.9)});});}

/* ---------- the map: six layers ---------- */
// one layer: a slab seen slightly from above (a parallelogram), with its name; fill (0..1) says how much of it is known
function slab(ctx,x,y,w,h,name,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const k=o.sk==null?h*0.7:o.sk,fl=o.fill||0,hi=o.hi||0;
  withA(ctx,a,()=>{ctx.save();if(hi>0){ctx.shadowColor=rgba(col,0.7*hi);ctx.shadowBlur=26*hi;}
    ctx.beginPath();ctx.moveTo(x+k,y);ctx.lineTo(x+w+k,y);ctx.lineTo(x+w,y+h);ctx.lineTo(x,y+h);ctx.closePath();ctx.fillStyle="rgba(7,12,24,0.9)";ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle=rgba(col,0.07+0.26*fl+0.08*hi);ctx.fill();ctx.strokeStyle=rgba(col,0.55+0.4*Math.max(fl,hi));ctx.lineWidth=2;ctx.stroke();
    // the slab's front edge, for depth
    ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.lineTo(x+w,y+h+7);ctx.lineTo(x,y+h+7);ctx.closePath();ctx.fillStyle=rgba(mix(col,[0,0,0],0.55),0.8);ctx.fill();ctx.restore();
    if(o.label!==false)T(ctx,name,x+k*0.5+26,y+h/2+(o.size||30)*0.36,{w:800,size:o.size||30,color:rgba(mix(col,INK,0.35),1),deco:o.deco});});}
// the map: six layers from motivation down to technology. o.p draws them from the top; o.fill[i], o.hi[i] per layer; o.br (0..1) the
// three brackets of questions on the left, o.bq[k] each one. Returns each layer's box [x, y, w, h].
function layerStack(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,sh=o.sh||66,gap=o.gap||16,p=o.p==null?1:o.p,R=[];
  LAY6.forEach((L,i)=>R.push([x,y+i*(sh+gap),w,sh]));if(a<=0.01)return R;
  withA(ctx,a,()=>{LAY6.forEach(([nm,col],i)=>{const q=clamp(p*6.5-i*1.0,0,1);if(q<=0)return;const yy=R[i][1]-(1-spring(q*1.4))*40;
      slab(ctx,x,yy,w,sh,nm,col,{a:clamp(q*2.2,0,1),fill:o.fill?o.fill[i]||0:0,hi:o.hi?o.hi[i]||0:0,size:o.size,deco:o.deco});});
    const br=o.br||0;if(br>0)Q3.forEach(([q,i0,i1],k)=>{const v=br*(o.bq?o.bq[k]==null?1:o.bq[k]:1);if(v<=0.01)return;const y0=R[i0][1]+4,y1=R[i1][1]+sh-4,bx=x-28,col=mix(LAY6[i0][1],LAY6[i1][1],0.5);
      withA(ctx,v,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(bx+12,y0);ctx.lineTo(bx,y0);ctx.lineTo(bx,lerp(y0,y1,ease(clamp(v*1.3,0,1))));if(v>0.75){ctx.lineTo(bx+12,y1);}ctx.stroke();ctx.restore();
        T(ctx,q,bx-22,(y0+y1)/2+11,{w:800,size:o.qsize||32,align:"right",color:rgba(col,1)});});});});
  return R;}

/* ---------- paper: the wall, canvases and sticky notes ---------- */
// a wall to pin drafts to: dark, warm, with a little texture
function wallBg(ctx,S,t,o){o=o||{};setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#2b2620");g.addColorStop(1,"#15120f");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(let i=0;i<70;i++){const x=hash(i,31)*W,y=hash(i,32)*H,r=60+hash(i,33)*200,gg=ctx.createRadialGradient(x,y,0,x,y,r);gg.addColorStop(0,"rgba(255,240,210,"+(0.012+0.02*hash(i,34))+")");gg.addColorStop(1,"rgba(255,240,210,0)");ctx.fillStyle=gg;ctx.fillRect(x-r,y-r,2*r,2*r);}
  const l=ctx.createRadialGradient(W*0.5,H*0.25,40,W*0.5,H*0.4,W*0.7);l.addColorStop(0,"rgba(255,226,180,"+(o.light==null?0.10:o.light)+")");l.addColorStop(1,"rgba(255,226,180,0)");ctx.fillStyle=l;ctx.fillRect(0,0,W,H);}
// how far a note has been validated: hollow (not started), half (a draft), full (confirmed by its owner); v from 0 to 1 fills it round
function statusDot(ctx,x,y,r,v,col,a){withA(ctx,a==null?1:a,()=>{ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.6,r*0.2);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();
  if(v>0.01){ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,-Math.PI/2,-Math.PI/2+TAU*clamp(v,0,1));ctx.closePath();ctx.fill();}ctx.restore();});}
// a sticky note, centred at (cx,cy): paper by default, glass as o.glass goes to 1 (confirmed, part of the model).
// o.col: its paper; o.edge: its glass colour; o.rot; o.p: how much of the text is written; o.src: a source tag clipped to it; o.st: its status (0..1), or none
function sticky(ctx,cx,cy,w,h,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||NOTEC[0],gl=clamp(o.glass||0,0,1),edge=o.edge||col,sz=o.size||Math.round(h*0.2),rot=(o.rot==null?(hash(text.length,7)-0.5)*0.08:o.rot)*(1-gl);
  withA(ctx,a,()=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);
    if(gl<1)withA(ctx,1-gl,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=16;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(col,1);ctx.fillRect(-w/2,-h/2,w,h);ctx.restore();
      const g=ctx.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,"rgba(0,0,0,0.08)");g.addColorStop(0.18,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(255,255,255,0.10)");ctx.fillStyle=g;ctx.fillRect(-w/2,-h/2,w,h);
      // the corner lifts a little
      ctx.fillStyle="rgba(0,0,0,0.10)";ctx.beginPath();ctx.moveTo(w/2,h/2-16);ctx.lineTo(w/2-16,h/2);ctx.lineTo(w/2,h/2);ctx.closePath();ctx.fill();
      const ls=wrapT(ctx,text,0,0,w-28,{size:sz,w:700,measure:true}),lh=sz*1.18,y0=-((ls.length-1)*lh)/2+sz*0.36;let left=text.length*(o.p==null?1:o.p);
      ls.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;T(ctx,s_,0,y0+i*lh,{w:700,size:sz,align:"center",color:rgba(INKD,0.9),deco:o.deco});});});
    if(gl>0)withA(ctx,gl,()=>{glass(ctx,-w/2,-h/2,w,h,12,edge,{glow:16,ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(edge,0.12);rr(ctx,-w/2,-h/2,w,h,12);ctx.fill();
      const ls=wrapT(ctx,text,0,0,w-28,{size:sz,w:700,measure:true}),lh=sz*1.18,y0=-((ls.length-1)*lh)/2+sz*0.36;ls.forEach((l,i)=>T(ctx,l,0,y0+i*lh,{w:700,size:sz,align:"center",color:rgba(INK,0.96),deco:o.deco}));});
    if(o.st!=null)statusDot(ctx,w/2-15,-h/2+15,9,o.st,mix(INKD,edge,gl),1);
    if(o.src)withA(ctx,o.srcA==null?1:o.srcA,()=>{const ss=o.srcSize||28,tw_=tw(ctx,o.src,ss,700)+26;ctx.save();ctx.translate(-w/2+6,h/2-8);ctx.rotate(0.04);ctx.fillStyle="rgba(238,232,218,0.97)";ctx.shadowColor="rgba(0,0,0,0.4)";ctx.shadowBlur=6;ctx.fillRect(0,0,tw_,ss+16);ctx.shadowBlur=0;
      ctx.fillStyle="rgba(150,150,150,0.9)";ctx.fillRect(5,ss*0.45,6,10);T(ctx,o.src,18,ss+5,{w:700,size:ss,color:"rgba(48,48,56,0.95)"});ctx.restore();});
    ctx.restore();});}
// marker lines on paper (a canvas drawn by hand): a slightly wobbly stroke, drawn up to p
function marker(ctx,pts,p,o){o=o||{};if(p<=0)return;const segs=[];let L=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);segs.push(d);L+=d;}let left=L*clamp(p,0,1);
  ctx.save();ctx.strokeStyle=o.col||rgba(INKD,0.85);ctx.lineWidth=o.lw||3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length&&left>0;i++){const f=Math.min(1,left/segs[i-1]),wob=(hash(i,o.seed||5)-0.5)*1.6;ctx.lineTo(lerp(pts[i-1][0],pts[i][0],f)+wob,lerp(pts[i-1][1],pts[i][1],f)-wob);left-=segs[i-1];}ctx.stroke();ctx.restore();}
function circlePts(cx,cy,r,n){const P=[];for(let i=0;i<=n;i++){const an=-Math.PI/2+i/n*TAU;P.push([cx+Math.cos(an)*r,cy+Math.sin(an)*r]);}return P;}
// the value proposition canvas, drawn in marker on a sheet: the value map (a square) and the customer profile (a circle)
function vpCanvas(ctx,x,y,w,h,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.01:o.rot});
  const s=Math.min(w*0.36,h*0.62),sx=x+w*0.08,sy=y+(h-s)/2+14,cx=x+w*0.92-s/2,cy=sy+s/2,lab={size:15,w:700,color:"rgba(60,58,62,0.85)"};
  T(ctx,"value proposition canvas",x+22,y+38,{w:800,size:24,color:"rgba(60,58,62,0.9)",deco:1});
  marker(ctx,[[sx,sy],[sx+s,sy],[sx+s,sy+s],[sx,sy+s],[sx,sy]],clamp(p*2,0,1));marker(ctx,[[sx+s/2,sy+s/2],[sx+s/2,sy]],clamp(p*3-1.2,0,1),{lw:2});marker(ctx,[[sx+s/2,sy+s/2],[sx,sy+s]],clamp(p*3-1.3,0,1),{lw:2});marker(ctx,[[sx+s/2,sy+s/2],[sx+s,sy+s]],clamp(p*3-1.4,0,1),{lw:2});
  marker(ctx,circlePts(cx,cy,s/2,40),clamp(p*2-0.4,0,1));marker(ctx,[[cx,cy],[cx,cy-s/2]],clamp(p*3-1.6,0,1),{lw:2});marker(ctx,[[cx,cy],[cx-s*0.43,cy+s*0.25]],clamp(p*3-1.7,0,1),{lw:2});marker(ctx,[[cx,cy],[cx+s*0.43,cy+s*0.25]],clamp(p*3-1.8,0,1),{lw:2});
  withA(ctx,clamp(p*3-2,0,1),()=>{T(ctx,"what we offer",sx+s/2,sy+s+28,{...lab,align:"center",deco:1});T(ctx,"who we serve",cx,sy+s+28,{...lab,align:"center",deco:1});});});}
// the business model canvas: nine blocks, drawn in marker on a sheet
const BMC9=[["key partners",0,0,1,2],["key activities",1,0,1,1],["key resources",1,1,1,1],["value propositions",2,0,1,2],["relationships",3,0,1,1],["channels",3,1,1,1],["customer segments",4,0,1,2],["costs",0,2,2.5,1],["revenue",2.5,2,2.5,1]];
function bmCanvas(ctx,x,y,w,h,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?0.012:o.rot});
  T(ctx,"business model canvas",x+22,y+38,{w:800,size:24,color:"rgba(60,58,62,0.9)",deco:1});const gx=x+20,gy=y+52,cw=(w-40)/5,ch=(h-72)/3;
  BMC9.forEach(([nm,c,r,cs,rs],i)=>{const q=clamp(p*10-i,0,1);if(q<=0)return;const bx=gx+c*cw,by=gy+r*ch,bw=cs*cw,bh=rs*ch;marker(ctx,[[bx,by],[bx+bw,by],[bx+bw,by+bh],[bx,by+bh],[bx,by]],q,{lw:2.4,seed:i+3});
    withA(ctx,q,()=>T(ctx,nm,bx+10,by+22,{w:700,size:13,color:"rgba(60,58,62,0.8)",deco:1}));});});}

/* ---------- glass: the model ---------- */
// an element of the model, in its layer's colour, with a small glyph in the corner for its kind (o.gs: the glyph's size, 13 by default;
// o.deco: its name is texture, as in a map drawn small, and the legibility check skips it)
function archGlyph(ctx,kind,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";ctx.lineCap="round";
  if(kind==="capability"){[[0,2],[1,1],[1,2],[2,0],[2,1],[2,2]].forEach(([i,j])=>ctx.strokeRect(x-s*0.75+i*s*0.5,y-s*0.75+j*s*0.5,s*0.5,s*0.5));}
  else if(kind==="process"){ctx.beginPath();ctx.moveTo(x-s*0.8,y-s*0.25);ctx.lineTo(x+s*0.2,y-s*0.25);ctx.lineTo(x+s*0.2,y-s*0.55);ctx.lineTo(x+s*0.8,y);ctx.lineTo(x+s*0.2,y+s*0.55);ctx.lineTo(x+s*0.2,y+s*0.25);ctx.lineTo(x-s*0.8,y+s*0.25);ctx.closePath();ctx.stroke();}
  else if(kind==="stakeholder"||kind==="role"){ctx.beginPath();ctx.ellipse(x+s*0.5,y,s*0.22,s*0.4,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x+s*0.5,y-s*0.4);ctx.lineTo(x-s*0.5,y-s*0.4);ctx.ellipse(x-s*0.5,y,s*0.22,s*0.4,0,-Math.PI/2,Math.PI/2,true);ctx.lineTo(x+s*0.5,y+s*0.4);ctx.stroke();}
  else if(kind==="goal"){[0.8,0.5,0.18].forEach(r=>{ctx.beginPath();ctx.arc(x,y,s*r,0,TAU);ctx.stroke();});}
  else if(kind==="component"){ctx.strokeRect(x-s*0.45,y-s*0.6,s*1.1,s*1.2);ctx.fillStyle="rgba(7,12,24,1)";[-0.3,0.15].forEach(d=>{ctx.fillRect(x-s*0.7,y+d*s,s*0.5,s*0.25);ctx.strokeRect(x-s*0.7,y+d*s,s*0.5,s*0.25);});}
  else if(kind==="node"){ctx.strokeRect(x-s*0.7,y-s*0.4,s*1.1,s*1.0);ctx.beginPath();ctx.moveTo(x-s*0.7,y-s*0.4);ctx.lineTo(x-s*0.4,y-s*0.7);ctx.lineTo(x+s*0.7,y-s*0.7);ctx.lineTo(x+s*0.4,y-s*0.4);ctx.moveTo(x+s*0.7,y-s*0.7);ctx.lineTo(x+s*0.7,y+s*0.3);ctx.lineTo(x+s*0.4,y+s*0.6);ctx.stroke();}
  else if(kind==="object"){ctx.strokeRect(x-s*0.75,y-s*0.55,s*1.5,s*1.1);ctx.beginPath();ctx.moveTo(x-s*0.75,y-s*0.2);ctx.lineTo(x+s*0.75,y-s*0.2);ctx.stroke();}
  else if(kind==="value"){ctx.beginPath();ctx.ellipse(x,y,s*0.8,s*0.45,0,0,TAU);ctx.stroke();}
  // a value stream, as ArchiMate draws it: a chevron
  else if(kind==="stream"){ctx.beginPath();ctx.moveTo(x-s*0.8,y-s*0.45);ctx.lineTo(x+s*0.35,y-s*0.45);ctx.lineTo(x+s*0.8,y);ctx.lineTo(x+s*0.35,y+s*0.45);ctx.lineTo(x-s*0.8,y+s*0.45);ctx.lineTo(x-s*0.35,y);ctx.closePath();ctx.stroke();}
  // the rest of the motivation layer, as ArchiMate draws it: a driver is a wheel, an assessment a magnifying glass, an outcome a target
  // with an arrow in it, a principle an exclamation mark in a box
  else if(kind==="driver"){ctx.beginPath();ctx.arc(x,y,s*0.55,0,TAU);ctx.stroke();ctx.beginPath();for(let i=0;i<8;i++){const an=i*TAU/8;ctx.moveTo(x+Math.cos(an)*s*0.15,y+Math.sin(an)*s*0.15);ctx.lineTo(x+Math.cos(an)*s*0.8,y+Math.sin(an)*s*0.8);}ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*0.15,0,TAU);ctx.fill();}
  else if(kind==="assessment"){ctx.beginPath();ctx.arc(x+s*0.15,y-s*0.15,s*0.45,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x-s*0.17,y+s*0.17);ctx.lineTo(x-s*0.75,y+s*0.75);ctx.stroke();}
  else if(kind==="outcome"){[0.75,0.45,0.15].forEach(r=>{ctx.beginPath();ctx.arc(x-s*0.1,y+s*0.1,s*r,0,TAU);ctx.stroke();});ctx.beginPath();ctx.moveTo(x-s*0.1,y+s*0.1);ctx.lineTo(x+s*0.8,y-s*0.8);ctx.moveTo(x+s*0.8,y-s*0.8);ctx.lineTo(x+s*0.45,y-s*0.8);ctx.moveTo(x+s*0.8,y-s*0.8);ctx.lineTo(x+s*0.8,y-s*0.45);ctx.stroke();}
  else if(kind==="principle"){ctx.strokeRect(x-s*0.6,y-s*0.7,s*1.2,s*1.4);ctx.beginPath();ctx.moveTo(x,y-s*0.45);ctx.lineTo(x,y+s*0.15);ctx.stroke();ctx.beginPath();ctx.arc(x,y+s*0.42,s*0.08,0,TAU);ctx.fill();}
  ctx.restore();}
function archEl(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const r=kind==="capability"||kind==="process"||kind==="value"?16:6;
  glass(ctx,x,y,w,h,r,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.94)"});ctx.fillStyle=rgba(col,0.16+0.1*(o.hi||0));rr(ctx,x,y,w,h,r);ctx.fill();
  const gs=o.gs||13;archGlyph(ctx,kind,x+w-gs-11,y+gs+9,gs,col);const sz=o.size||28,ls=wrapT(ctx,name,0,0,w-64,{size:sz,w:700,measure:true});wrapT(ctx,name,x+w/2-8,y+h/2+sz*0.36-(ls.length-1)*sz*0.58,w-64,{size:sz,w:700,align:"center",color:rgba(INK,0.96),lh:sz*1.15,deco:o.deco});});}

/* ---------- small things ---------- */
// a data rule, as the data series draw one: a card with a monospaced kicker
function ruleCard(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const col=o.col||[170,205,255],sz=o.size||32,ls=wrapT(ctx,text,0,0,w-48,{size:sz,w:700,measure:true}),h=84+ls.length*sz*1.25;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:14+12*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.95)"});T(ctx,o.kicker||"data rule",x+24,y+42,{f:"mono",w:500,size:28,color:rgba(col,1)});
    ls.forEach((l,i)=>T(ctx,l,x+24,y+88+i*sz*1.25,{w:700,size:sz}));});return h;}
// an owner's tick, in gold: a person who owns that part of the business says it's right
function ownerTick(ctx,x,y,r,a){kt_gtick(ctx,x,y,r,a);}

/* ---------- the canvases, labelled, for notes to be pinned into ---------- */
// The value proposition canvas, at a size to work on: the value map (a square: products and services on the left, gain creators
// top right, pain relievers bottom right) and the customer profile (a circle: gains top left, pains bottom left, jobs on the right).
// Returns where each section is, so notes can be placed in it: VPC.where(x,y,w,h)[section] = [cx, cy].
const VPC={secs:["products and services","gain creators","pain relievers","gains","pains","customer jobs"],
  geo(x,y,w,h){const s=Math.min(w*0.38,h*0.74),sx=x+w*0.05,sy=y+(h-s)/2+18,r=s/2,cx=x+w*0.95-r,cy=sy+r;return{s,sx,sy,r,cx,cy};},
  where(x,y,w,h){const g=VPC.geo(x,y,w,h);return{"products and services":[g.sx+g.s*0.25,g.sy+g.s*0.5],"gain creators":[g.sx+g.s*0.75,g.sy+g.s*0.27],"pain relievers":[g.sx+g.s*0.75,g.sy+g.s*0.73],
    "gains":[g.cx-g.r*0.42,g.cy-g.r*0.45],"pains":[g.cx-g.r*0.42,g.cy+g.r*0.45],"customer jobs":[g.cx+g.r*0.48,g.cy]};}};
// p draws it; o.title names it; o.lab (0..1) shows the section names; o.hi[section] lights one
function vpCanvas2(ctx,x,y,w,h,p,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.006:o.rot});const g=VPC.geo(x,y,w,h),hi=o.hi||{};
  T(ctx,o.title||"value proposition canvas",x+26,y+42,{w:800,size:o.titleSize||28,color:"rgba(60,58,62,0.9)",deco:o.titleSize<28||o.titleDeco});
  const glowSec=(k,fn)=>{const v=hi[k]||0;if(v>0)withA(ctx,v,()=>{ctx.save();fn();ctx.fillStyle="rgba(255,200,90,0.22)";ctx.fill();ctx.restore();});};
  glowSec("products and services",()=>{ctx.beginPath();ctx.rect(g.sx,g.sy,g.s/2,g.s);});glowSec("gain creators",()=>{ctx.beginPath();ctx.rect(g.sx+g.s/2,g.sy,g.s/2,g.s/2);});glowSec("pain relievers",()=>{ctx.beginPath();ctx.rect(g.sx+g.s/2,g.sy+g.s/2,g.s/2,g.s/2);});
  glowSec("gains",()=>{ctx.beginPath();ctx.moveTo(g.cx,g.cy);ctx.arc(g.cx,g.cy,g.r,Math.PI,Math.PI*1.5);ctx.closePath();});glowSec("pains",()=>{ctx.beginPath();ctx.moveTo(g.cx,g.cy);ctx.arc(g.cx,g.cy,g.r,Math.PI*0.5,Math.PI);ctx.closePath();});
  glowSec("customer jobs",()=>{ctx.beginPath();ctx.moveTo(g.cx,g.cy);ctx.arc(g.cx,g.cy,g.r,-Math.PI/2,Math.PI/2);ctx.closePath();});
  marker(ctx,[[g.sx,g.sy],[g.sx+g.s,g.sy],[g.sx+g.s,g.sy+g.s],[g.sx,g.sy+g.s],[g.sx,g.sy]],clamp(p*2,0,1));marker(ctx,[[g.sx+g.s/2,g.sy],[g.sx+g.s/2,g.sy+g.s]],clamp(p*3-1.2,0,1),{lw:2});marker(ctx,[[g.sx+g.s/2,g.sy+g.s/2],[g.sx+g.s,g.sy+g.s/2]],clamp(p*3-1.3,0,1),{lw:2});
  marker(ctx,circlePts(g.cx,g.cy,g.r,48),clamp(p*2-0.4,0,1));marker(ctx,[[g.cx,g.cy-g.r],[g.cx,g.cy+g.r]],clamp(p*3-1.6,0,1),{lw:2});marker(ctx,[[g.cx-g.r,g.cy],[g.cx,g.cy]],clamp(p*3-1.7,0,1),{lw:2});
  withA(ctx,clamp(p*3-2,0,1)*(o.lab==null?1:o.lab),()=>{const L={size:16,w:800,color:"rgba(70,66,70,0.75)",deco:1};
    T(ctx,"products & services",g.sx+12,g.sy+26,L);T(ctx,"gain creators",g.sx+g.s/2+12,g.sy+26,L);T(ctx,"pain relievers",g.sx+g.s/2+12,g.sy+g.s/2+26,L);
    T(ctx,"gains",g.cx-g.r*0.62,g.cy-g.r*0.78,L);T(ctx,"pains",g.cx-g.r*0.62,g.cy+g.r*0.86,L);T(ctx,"customer jobs",g.cx+14,g.cy-g.r*0.78,L);
    T(ctx,"value map",g.sx+g.s/2,g.sy+g.s+30,{...L,align:"center"});T(ctx,"customer profile",g.cx,g.sy+g.s+30,{...L,align:"center"});});});}
// where each block of the business model canvas is, for bmCanvas(x,y,w,h): BMC_AT(x,y,w,h,i) = [bx, by, bw, bh]
function BMC_AT(x,y,w,h,i){const gx=x+20,gy=y+52,cw=(w-40)/5,ch=(h-72)/3,[,c,r,cs,rs]=BMC9[i];return[gx+c*cw,gy+r*ch,cs*cw,rs*ch];}

/* ---------- legibility: big enough for a phone ---------- */
// The films are drawn at 1920 by 1080. A phone held sideways, full screen, shows that about 850 pixels wide, so the smallest text that
// reads comfortably there is about 28 px in the frame: tools/legible.py checks every piece of text against it. Text marked deco:1
// (a scrolling list of systems, a canvas's printed headings) is texture, not something to read, and the check skips it.
const MINT=28;
// a year and place, in the corner, large enough to read
function eaYear(ctx,x,y,s,col,a){if(a==null)a=1;if(a<=0.01)return;withA(ctx,a,()=>{const c=col||CLAY,w=tw(ctx,s,28,500,"mono")+52;glass(ctx,x,y-30,w,60,30,c,{glow:14,ea:0.8,fill:"rgba(26,16,10,0.9)"});
  ctx.fillStyle=rgba(c,1);ctx.beginPath();ctx.arc(x+24,y,6,0,TAU);ctx.fill();T(ctx,s,x+40,y+10,{f:"mono",w:500,size:28,color:rgba(c,1)});});}
// the camera, moving in on what the narration is about: keys are [time, x, y, zoom], each move eased over d seconds (default 1.4);
// call after the background, before drawing the scene. Combine with drift for the slow push of every shot.
function focus(ctx,t,keys,d){d=d||1.4;let x=keys[0][1],y=keys[0][2],z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;
    x=lerp(x,keys[i][1],u);y=lerp(y,keys[i][2],u);z=lerp(z,keys[i][3],u);}
  ctx.translate(960,540);ctx.scale(z,z);ctx.translate(-x,-y);return z;}
// how far the camera is zoomed in at t, for the same keys: a whole canvas seen from afar is context, and its notes are decoration
function focusZ(t,keys,d){d=d||1.4;let z=keys[0][3];for(let i=1;i<keys.length;i++){const u=easeCam(clamp((t-keys[i][0])/d,0,1));if(u<=0)break;z=lerp(z,keys[i][3],u);}return z;}
