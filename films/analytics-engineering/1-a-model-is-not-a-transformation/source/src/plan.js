/* ===== A model is not a transformation: the film's own pictures (prefixed mt_) =====
   The 1870s blueprint: a small building's plan, printed in sunlight (the paper turns from pale yellow-green to blue, and the
   lines to white), copies for the trades, and an empty site; the ways to transform data; the shapes a model can take; the
   three stages of the series' middle way; and the eight films to come. */

// the plan of a small building, drawn round (x,y) at scale s in colour col; p (0..1) draws it; hl: {wall, thick, beam} callouts
function mt_house(ctx,x,y,s,col,p,o){o=o||{};if(p<=0)return;const hl=o.hl||{},lw=o.lw||1;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(col,0.95);ctx.fillStyle=rgba(col,0.95);ctx.lineCap="square";
  const q=k=>clamp(p*5-k,0,1),seg=(x0,y0,x1,y1,f)=>{if(f<=0)return;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,f),lerp(y0,y1,f));ctx.stroke();};
  // outer walls, drawn double: a wall one and a half bricks thick
  ctx.lineWidth=2.6*lw;const R=[[-300,-170],[300,-170],[300,170],[-300,170],[-300,-170]];for(let i=0;i<4;i++){seg(R[i][0],R[i][1],R[i+1][0],R[i+1][1],q(i*0.5));}
  const r2=[[-282,-152],[282,-152],[282,152],[-282,152],[-282,-152]];ctx.lineWidth=1.4*lw;for(let i=0;i<4;i++){seg(r2[i][0],r2[i][1],r2[i+1][0],r2[i+1][1],q(0.4+i*0.5));}
  // hatching inside the wall, then an inner wall, a door and two windows
  if(q(2.4)>0){ctx.save();ctx.globalAlpha*=q(2.4)*0.5;ctx.lineWidth=0.8;ctx.beginPath();ctx.rect(-300,-170,600,340);ctx.rect(-282,-152,564,304);ctx.clip("evenodd");for(let k=-700;k<700;k+=14){ctx.beginPath();ctx.moveTo(k,-180);ctx.lineTo(k+360,180);ctx.stroke();}ctx.restore();}
  ctx.lineWidth=2.2*lw;seg(40,-152,40,60,q(2.8));seg(40,110,40,152,q(3));
  if(q(3.2)>0){ctx.lineWidth=1.2*lw;ctx.beginPath();ctx.arc(40,110,50,-Math.PI/2,-Math.PI/2+Math.PI/2*q(3.2),false);ctx.stroke();}
  [[-200,-170],[180,-170]].forEach(([wx,wy])=>{if(q(3.4)<=0)return;ctx.fillStyle=rgba(o.paper||[20,60,130],1);ctx.fillRect(wx-40,wy-2,80,22);ctx.lineWidth=1.2*lw;ctx.strokeRect(wx-40,wy,80,18);seg(wx-40,wy+9,wx+40,wy+9,q(3.4));});
  // the beam over the big room, dashed
  if(q(3.8)>0){ctx.save();ctx.setLineDash([12,8]);ctx.lineWidth=1.6*lw;seg(-282,-10,40,-10,q(3.8));ctx.restore();}
  // a dimension line along the top
  if(q(4.2)>0){ctx.lineWidth=1*lw;seg(-300,-214,300,-214,q(4.2));seg(-300,-224,-300,-204,1);seg(300,-224,300,-204,q(4.2));T(ctx,"30 ft",0,-224,{f:"mono",w:500,size:18,align:"center",color:rgba(col,0.95)});}
  ctx.restore();
  // callouts: every wall, how thick, what it carries
  const call=(k,px,py,tx,ty,s_)=>{const a=hl[k]||0;if(a<=0)return;withA(ctx,a,()=>{ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x+px*s,y+py*s);ctx.lineTo(x+tx*s,y+ty*s);ctx.stroke();ctx.beginPath();ctx.arc(x+px*s,y+py*s,4,0,TAU);ctx.fill();
    T(ctx,s_,x+tx*s+(tx>0?8:-8),y+ty*s+6,{w:700,size:20,align:tx>0?"left":"right",color:rgba(col,1)});});};
  call("wall",-300,40,-380,110,"every wall");call("thick",291,-80,380,-120,"1½ bricks thick");call("beam",-120,-10,-380,-60,"a beam: carries the floor above");}

// a sheet in a frame, printed in sunlight: u (0..1) is the exposure, from sensitised yellow-green to blue with white lines
function mt_print(ctx,x,y,w,h,u,t,o){o=o||{};const pap=[mix([214,208,150],BPP,ease(u)),mix([60,70,40],BPL,ease(u))];
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=28;ctx.shadowOffsetY=8;ctx.fillStyle=rgba(pap[0],1);ctx.fillRect(x,y,w,h);ctx.restore();
  if(u>0.5)bpPaper(ctx,x,y,w,h,fin(u,0.5,0.5),{title:o.title,sub:o.sub});
  mt_house(ctx,x+w/2,y+h/2+20,Math.min(w/820,h/520),pap[1],o.p==null?1:o.p,{hl:o.hl,paper:pap[0]});
  if(o.frame){ctx.strokeStyle="rgba(90,62,36,0.95)";ctx.lineWidth=18;ctx.strokeRect(x-9,y-9,w+18,h+18);ctx.strokeStyle="rgba(150,110,70,0.6)";ctx.lineWidth=3;ctx.strokeRect(x-17,y-17,w+34,h+34);}}
// a copy handed to a trade: a small blueprint and the trade's tool
function mt_copy(ctx,x,y,w,trade,a,t){if(a<=0.01)return;withA(ctx,a,()=>{const h=w*0.64;mt_print(ctx,x,y,w,h,1,t,{});
  const tx=x+w/2,ty=y+h+56;ctx.save();ctx.translate(tx-70,ty-10);ctx.strokeStyle=rgba(CLAY,1);ctx.fillStyle=rgba(CLAY,0.85);ctx.lineWidth=3;ctx.lineCap="round";
    if(trade==="mason"){ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(18,-20);ctx.lineTo(30,6);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(-10,0);ctx.lineTo(-26,12);ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(-24,6);ctx.lineTo(30,-6);ctx.lineTo(30,6);ctx.lineTo(-24,14);ctx.closePath();ctx.fill();ctx.fillStyle=rgba([120,80,50],1);rr(ctx,-40,0,18,18,4);ctx.fill();}
    ctx.restore();T(ctx,trade,tx-30,ty+2,{w:700,size:22,color:rgba(PARCH,1)});});}
// an empty site: ground, stakes and a string line, waiting for bricks
function mt_site(ctx,y,t,a){if(a<=0.01)return;withA(ctx,a,()=>{const g=ctx.createLinearGradient(0,y,0,H);g.addColorStop(0,"rgba(90,64,40,0.9)");g.addColorStop(1,"rgba(30,20,12,1)");ctx.fillStyle=g;ctx.fillRect(0,y,W,H-y);
  ctx.strokeStyle="rgba(200,170,120,0.5)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(560,y+60);ctx.lineTo(1360,y+60);ctx.lineTo(1420,y+150);ctx.lineTo(500,y+150);ctx.closePath();ctx.stroke();
  [[560,60],[1360,60],[1420,150],[500,150]].forEach(([sx,sy])=>{ctx.fillStyle="rgba(170,120,70,1)";ctx.fillRect(sx-4,y+sy-34,8,40);});});}

// a way to transform data: a card with a small glyph; on (0..1) lights it, dim (0..1) greys it
function mt_tool(ctx,x,y,w,h,name,k,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const on=o.on||0,dim=o.dim||0,col=mix(mix(SOFT,[150,190,255],0.4),o.col||[255,140,90],on);
  withA(ctx,a*(1-0.6*dim),()=>{if(on>0)glow(ctx,x+w/2,y+h/2,w*0.6,o.col||[255,140,90],0.3*on);glass(ctx,x,y,w,h,16,col,{glow:10+14*on,ea:0.7,fill:"rgba(7,12,24,0.94)"});
    const gx=x+46,gy=y+h/2;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.4;
    if(k===0){rr(ctx,gx-20,gy-22,40,44,5);ctx.stroke();for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(gx-12,gy-10+i*10);ctx.lineTo(gx+12,gy-10+i*10);ctx.stroke();}}
    else if(k===1){ctx.beginPath();ctx.ellipse(gx,gy-14,18,7,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(gx-18,gy-14);ctx.lineTo(gx-18,gy+14);ctx.ellipse(gx,gy+14,18,7,0,Math.PI,0,true);ctx.lineTo(gx+18,gy-14);ctx.stroke();}
    else if(k===2){[-16,0,16].forEach((dx,i)=>{ctx.beginPath();ctx.arc(gx+dx,gy+(i===1?-10:8),6,0,TAU);ctx.fill();});ctx.beginPath();ctx.moveTo(gx-16,gy+8);ctx.lineTo(gx,gy-10);ctx.lineTo(gx+16,gy+8);ctx.stroke();}
    else{T(ctx,"{ }",gx,gy+9,{f:"mono",w:500,size:26,align:"center",color:rgba(col,1)});}
    ctx.restore();T(ctx,name,x+84,y+h/2+8,{w:800,size:24,color:rgba(mix(INK,col,on*0.3),1)});});}

// the shapes a model can take, named once in the series: a normalised core, stars, a data vault, anchors, hooks, wide tables
const MT_SHAPES=[["normalised core","core",[140,200,255]],["stars","star",KT_STAR],["data vault",0,[180,150,255]],["anchors",1,[120,205,240]],["hooks",2,[240,175,115]],["wide tables","wide",[250,190,90]]];
function mt_shape(ctx,k,x,y,s,t){const[,g,col]=MT_SHAPES[k];if(typeof g==="number"||g==="star"){kt_glyph(ctx,g,x,y,s,t);return;}
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  if(g==="core"){const P=[[-60,-30],[0,-30],[60,-30],[-30,24],[30,24]];[[0,1],[1,2],[0,3],[1,4],[3,4],[2,4]].forEach(([i,j])=>kt_ln(ctx,[P[i],P[j]],col,0.55));P.forEach(([px,py])=>kt_box(ctx,px,py,40,24,col));}
  else{ctx.fillStyle="rgba(8,14,28,0.95)";rr(ctx,-86,-18,172,36,6);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2;rr(ctx,-86,-18,172,36,6);ctx.stroke();
    for(let i=1;i<8;i++){ctx.strokeStyle=rgba(col,0.4);ctx.beginPath();ctx.moveTo(-86+i*21.5,-18);ctx.lineTo(-86+i*21.5,18);ctx.stroke();}ctx.fillStyle=rgba(col,0.9);rr(ctx,-86,-18,21.5,36,6);ctx.fill();T(ctx,"one row per learner",0,46,{w:600,size:13,align:"center",color:rgba(SOFT,1)});}
  ctx.restore();}
function mt_shapeCard(ctx,k,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=MT_SHAPES[k][2];withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:12,ea:0.75,fill:"rgba(7,12,24,0.93)"});
  T(ctx,MT_SHAPES[k][0],x+w/2,y+44,{w:800,size:23,align:"center",color:rgba(col,1)});mt_shape(ctx,k,x+w/2,y+140,1.2,t);
  if(o.four)KT_FOUR.forEach((f,j)=>kt_four(ctx,j,x+w/2+(j-1.5)*46,y+h-40,16,o.four[j]||0));});}
// the series' middle way, in three stages: business keys, every version, a wide row (with a small star where people need one)
function mt_middle(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const q=o.q||[1,1,1],sx=[x+w*0.14,x+w*0.5,x+w*0.86],cy=y+90;withA(ctx,a,()=>{
  for(let i=0;i<2;i++)arrowTo(ctx,sx[i]+120,cy,sx[i+1]-120,cy,WEED,Math.min(q[i],q[i+1]),{p:q[i+1],head:14});
  withA(ctx,q[0],()=>{kt_four(ctx,1,sx[0],cy,44,1);T(ctx,"integrate on business keys",sx[0],cy+100,{w:700,size:22,align:"center"});});
  withA(ctx,q[1],()=>{for(let i=0;i<4;i++){const yy=cy+30-i*20,xx=sx[1]-70+i*10;ctx.fillStyle="rgba(8,14,28,0.95)";rr(ctx,xx,yy-16,140,30,6);ctx.fill();ctx.strokeStyle=rgba([200,160,255],0.5+0.15*i);ctx.lineWidth=2;rr(ctx,xx,yy-16,140,30,6);ctx.stroke();}
    T(ctx,"v4",sx[1]+30,cy-45,{f:"mono",w:500,size:16,align:"center",color:rgba([200,160,255],1)});T(ctx,"keep every version",sx[1],cy+100,{w:700,size:22,align:"center"});});
  withA(ctx,q[2],()=>{mt_shape(ctx,5,sx[2]-20,cy-6,1.1,0);kt_glyph(ctx,"star",sx[2]+120,cy-40,0.5,0);T(ctx,"one wide row per entity",sx[2],cy+100,{w:700,size:22,align:"center"});T(ctx,"stars where people need them",sx[2],cy+130,{w:600,size:18,align:"center",color:rgba(SOFT,1)});});});}

// the eight films to come, with the steps each takes (0-based, on the loop of ten)
const MT_FILMS=[[2,"Start from a question",[0]],[3,"What makes it the same one",[1]],[4,"One row of what, and when",[2]],[5,"Promises and proofs",[3,4]],[6,"Built in layers",[5]],[7,"Who owns what",[9]],[8,"An agent on the team",[6,7]],[9,"Written once",[8]]];
function mt_filmCard(ctx,x,y,n,title,a,on){if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,title,20,700)+84;glass(ctx,x-w/2,y-28,w,56,14,mix(SOFT,WEED,on),{glow:10+10*on,ea:0.7,fill:"rgba(7,12,24,0.95)"});
  T(ctx,n+"",x-w/2+22,y+8,{f:"mono",w:500,size:20,color:rgba(WEED,1)});T(ctx,title,x-w/2+52,y+8,{w:700,size:20});});}
