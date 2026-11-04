/* ===== Borrowed from the brain: what people built on the nerve cell =====
   In the module's colours: units and their connections are violet (the model), a choice that's right is plain, one that's wrong
   amber, a check that passes green. What is drawn here:
     bb_mcp(ctx, x, y, o)            1943's unit: inputs, their connections, the unit that adds them, its set level, and its output
     bb_net(ctx, layers, o)          units in layers, each joined to every unit of the next; a signal can pass through them
     bb_lab1959(ctx, t, o)           1959: a dark room, a screen with a bar of light, a cat watching it, and what one cell does
     bb_layers(ctx, x, y, o)         a picture read in layers: edges, then shapes, then what it is
     bb_weights(ctx, x, y, w, h, t, a) a field of weights, too many to count
     bb_oneCell(ctx, x, y, o)        2021: one nerve cell, and the network of layers it took to mimic it
     bb_examples(ctx, x, y, o)       a few examples, or a great many
     bb_plane(ctx, x, y, s, o)       an airliner, seen from below
     bb_chances, bb_wheel, bb_dial   the next word's chances: as bars, as a wheel's slices, and the temperature dial that changes them
     bb_answer(ctx, x, y, w, text, o) an answer, on a card
     bb_dates, bb_pages, bb_test     the 2025 study: three dates, a fact seen once, a test that rewards a guess
     bb_em(ctx, x, y, w, h, o)       an electron microscope's picture of the gap */

const BB_VI=AG.violet,BB_VIL=mix(AG.violet,[255,255,255],0.72);

/* ---------------------------------------------------------------- 1943: the unit */
// o: vals (the inputs, 0 or 1), on [per input, 0..1: its signal on its way in], wts (each connection's weight, a number shown on it),
// fill (0..1: how far the total has risen), level (the set level, as a share of the gauge), fire (0..1: the output's signal), u (draw on),
// a, r (the unit's radius), gauge (true or 0..1: show the total and the set level under the unit), wa (0..1: the weights come in)
function bb_mcp(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a,u=o.u==null?1:o.u;if(a<=0||u<=0)return;ctx.save();ctx.globalAlpha*=a;const r=o.r||84,n=(o.vals||[1,1,1]).length;
  const ins=[];for(let i=0;i<n;i++)ins.push([x-380,y+(i-(n-1)/2)*150]);
  ins.forEach((p,i)=>{const k=ag_in(u,i*0.12,0.3);if(k<=0)return;const end=[x-r*Math.cos(0.5*(i-(n-1)/2)),y+r*Math.sin(0.5*(i-(n-1)/2))],wt=o.wts?o.wts[i]:null,wa=o.wa==null?1:o.wa,w=wt==null?5:lerp(5,3+9*Math.abs(wt),wa);
    const P=bb_wire(ctx,[p[0]+38,p[1]],end,{w,u:k,col:mix(BB_VI,[120,116,140],0.3),alpha:0.75,sig:o.on?o.on[i]:null,sr:20});
    if(wt!=null&&k>=1&&wa>0){const q=bb_along(P,0.48);ag_pill(ctx,q[0],q[1]-36,(wt<0?"−":"")+Math.abs(wt).toFixed(1),{size:28,a:wa});}
    ctx.save();ctx.globalAlpha*=k;ag_soft(ctx,c=>c.arc(p[0],p[1],38,0,TAU),[238,236,232],[255,255,255],p[0]+14,p[1]-16,44,"rgba(40,30,60,0.25)",6);
    ctx.strokeStyle=rgba(BB_VI,0.6);ctx.lineWidth=3;ctx.beginPath();ctx.arc(p[0],p[1],38,0,TAU);ctx.stroke();
    if(o.vals)ag_T(ctx,String(o.vals[i]),p[0],p[1]+11,{w:800,size:32,align:"center",col:AG.ink});ctx.restore();});
  const ku=ag_in(u,0.3,0.3);if(ku>0){ctx.save();ctx.globalAlpha*=ku;
    const ox=x+r,P=bb_wire(ctx,[ox,y],[x+330,y],{w:6,col:mix(BB_VI,[120,116,140],0.3),alpha:0.8,sig:o.fire,sr:24});ag_arrowHead(ctx,x+336,y,0,18,rgba(mix(BB_VI,[120,116,140],0.3),0.85));
    bb_unit(ctx,x,y,r,{on:o.fire>0?ag_in(o.fire,0,0.15)*(1-ag_in(o.fire,0.85,0.15)):(o.glow||0)});
    if(o.gauge){ctx.save();ctx.globalAlpha*=(o.gauge===true?1:o.gauge);const gx=x-150,gy=y+r+74,gw=300,f=clamp(o.fill||0,0,1),lv=o.level||0.6;ag_box(ctx,gx-24,gy-40,gw+48,124,18,{});
      ctx.fillStyle="rgba(60,56,70,0.12)";rr(ctx,gx,gy,gw,20,10);ctx.fill();ctx.fillStyle=rgba(BB_VI,0.85);if(f>0){rr(ctx,gx,gy,gw*f,20,10);ctx.fill();}
      ctx.strokeStyle=rgba(AG.ink,0.85);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx+gw*lv,gy-12);ctx.lineTo(gx+gw*lv,gy+32);ctx.stroke();
      ag_T(ctx,"Total",gx,gy-8,{w:700,size:28,col:AG.mut});ag_T(ctx,"set level",gx+gw*lv,gy+68,{w:700,size:28,align:"center"});ctx.restore();}
    ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- units in layers */
// layers: [{x, n, y (the middle), dy (the spacing)}]; o.r, o.u (draws on, layer by layer), o.sig (where a signal is: 0 the first layer,
// 1 the second, ...), o.w(i, j, k) a connection's width (layer i's unit j to the next layer's unit k), o.a, o.alpha (the wires')
function bb_netPos(L){return L.map(l=>{const out=[];for(let j=0;j<l.n;j++)out.push([l.x,l.y+(j-(l.n-1)/2)*l.dy]);return out;});}
function bb_net(ctx,L,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const P=bb_netPos(L),r=o.r||26,u=o.u==null?L.length:o.u*L.length,sig=o.sig;
  for(let i=0;i<P.length-1;i++){const k=clamp(u-i-0.6,0,1);if(k<=0)continue;for(let j=0;j<P[i].length;j++)for(let q=0;q<P[i+1].length;q++){const A=P[i][j],B=P[i+1][q],w=o.w?o.w(i,j,q):2.4;
    ctx.strokeStyle=rgba(mix(BB_VI,[150,146,168],0.45),(o.alpha||0.42)*k);ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(lerp(A[0],B[0],k),lerp(A[1],B[1],k));ctx.stroke();
    if(sig!=null&&sig>i&&sig<i+1&&(j+q)%2===0){const s=sig-i;bb_spark(ctx,lerp(A[0],B[0],s),lerp(A[1],B[1],s),12,0.8*Math.sin(Math.PI*s));}}}
  P.forEach((col,i)=>{const k=clamp(u-i,0,1);if(k<=0)return;col.forEach(p=>{ctx.save();ctx.globalAlpha*=k;const on=sig!=null?Math.max(0,1-Math.abs(sig-i)*2.2):0;bb_unit(ctx,p[0],p[1],r,{on,sigma:r>=24&&o.sigma!==false});ctx.restore();});});
  ctx.restore();return P;}

/* ---------------------------------------------------------------- 1959: a cell that fires for an edge */
// a cat sitting, from the side, facing right, calm: o.look (radians) turns its head a little; s its size (1: about 300 px tall)
function bb_cat(ctx,x,y,s,t,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);const fur=[150,136,120],dk=mix(fur,[30,24,20],0.5),hi=mix(fur,[250,240,226],0.5);
  ag_floorShadow(ctx,0,4,140,14,0.35);
  // the tail, wrapped round the front
  bb_strand(ctx,bb_smooth([[-70,-10],[-40,8],[40,6],[90,-6]],6),26,14,rgba(mix(fur,dk,0.2),1),1);
  ag_soft(ctx,c=>{c.moveTo(-90,0);c.bezierCurveTo(-110,-80,-80,-190,-10,-210);c.bezierCurveTo(50,-224,80,-170,76,-100);c.bezierCurveTo(74,-50,70,-14,60,0);c.closePath();},fur,hi,40,-200,200,rgba(dk,0.5),18,0.6);
  for(const fx of [30,56])ag_soft(ctx,c=>ag_rect(c,fx-14,-80,26,82,12),mix(fur,hi,0.2),hi,fx,-70,30,rgba(dk,0.3),6);
  ctx.save();ctx.translate(30,-212);ctx.rotate(o.look||0);
  ag_soft(ctx,c=>{c.moveTo(-50,0);c.bezierCurveTo(-56,-46,-20,-70,20,-68);c.bezierCurveTo(60,-66,84,-40,80,-6);c.bezierCurveTo(78,24,40,40,6,36);c.bezierCurveTo(-30,32,-48,20,-50,0);c.closePath();},fur,hi,40,-50,90,rgba(dk,0.45),12,0.6);
  for(const [ex,lean] of [[-26,-0.2],[30,0.25]])ag_soft(ctx,c=>{c.moveTo(ex-20,-56);c.lineTo(ex+lean*40,-104);c.lineTo(ex+22,-60);c.closePath();},mix(fur,dk,0.15),hi,ex,-80,30,rgba(dk,0.4),6);
  ctx.fillStyle="rgba(214,190,90,1)";ctx.beginPath();ctx.ellipse(48,-18,10,8,0,0,TAU);ctx.fill();ctx.fillStyle="#141012";ctx.beginPath();ctx.ellipse(50,-18,3,7,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba([200,140,130],1);ctx.beginPath();ctx.moveTo(78,6);ctx.lineTo(70,0);ctx.lineTo(70,12);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(250,246,240,0.6)";ctx.lineWidth=1.4;for(const k of [-1,0,1]){ctx.beginPath();ctx.moveTo(70,14);ctx.quadraticCurveTo(100,12+k*6,124,10+k*14);ctx.stroke();}ctx.restore();
  // tabby stripes on the back
  ctx.strokeStyle=rgba(dk,0.35);ctx.lineWidth=7;ctx.lineCap="round";for(let k=0;k<5;k++){ctx.beginPath();ctx.moveTo(-84+k*12,-150+k*26);ctx.quadraticCurveTo(-60+k*10,-140+k*26,-50+k*8,-120+k*26);ctx.stroke();}
  ctx.restore();}
// the room: dark, a screen on the right with a bar of light at angle ang (radians from upright), a table, the cat watching the screen
function bb_lab1959(ctx,t,o){o=o||{};const g=ctx.createRadialGradient(1400,380,60,1000,540,1300);g.addColorStop(0,"rgb(70,72,80)");g.addColorStop(1,"rgb(26,26,32)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.fillStyle="rgb(46,40,36)";ctx.fillRect(0,720,W,H-720);ctx.fillStyle="rgba(255,255,255,0.05)";ctx.fillRect(0,716,W,6);
  // the screen, and its light on the room
  const sx=1080,sy=150,sw=640,sh=470;ctx.fillStyle="rgb(214,214,206)";ctx.fillRect(sx,sy,sw,sh);const sg=ctx.createRadialGradient(sx+sw/2,sy+sh/2,40,sx+sw/2,sy+sh/2,sw);sg.addColorStop(0,"rgba(255,255,250,0.25)");sg.addColorStop(1,"rgba(0,0,0,0.12)");ctx.fillStyle=sg;ctx.fillRect(sx,sy,sw,sh);
  ctx.strokeStyle="rgb(40,40,44)";ctx.lineWidth=14;ctx.strokeRect(sx-7,sy-7,sw+14,sh+14);
  const ang=o.ang||0,bx=sx+sw/2,by=sy+sh/2;ctx.save();ctx.beginPath();ctx.rect(sx,sy,sw,sh);ctx.clip();ctx.translate(bx,by);ctx.rotate(ang);ctx.fillStyle="rgba(250,248,232,1)";ctx.shadowColor="rgba(255,250,220,0.9)";ctx.shadowBlur=24;ctx.fillRect(-16,-170,32,340);ctx.restore();
  const lg=ctx.createRadialGradient(bx,by,40,bx-400,by+200,1100);lg.addColorStop(0,"rgba(255,250,230,0.16)");lg.addColorStop(1,"rgba(255,250,230,0)");ctx.fillStyle=lg;ctx.fillRect(0,0,W,H);
  // the table and the cat on it
  ctx.fillStyle="rgb(96,74,56)";ctx.fillRect(140,640,640,40);ctx.fillStyle="rgb(70,52,40)";ctx.fillRect(140,680,640,20);ctx.fillRect(180,700,24,200);ctx.fillRect(716,700,24,200);
  bb_cat(ctx,480,640,1.25,t,{look:0.06});ag_grain(ctx,0,0,W,H,1.2,81);}
// what one cell does, as clicks along a line: a click whenever it fires; it fires when the bar is near its own angle (pref)
function bb_spikes(ctx,x,y,w,h,t,angAt,pref,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,22,{});
  ag_T(ctx,o.title||"One cell",x+30,y+52,{w:700,size:32});const base=y+h-40,top=y+86;ctx.strokeStyle=rgba(AG.mut,0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,base);ctx.lineTo(x+w-30,base);ctx.stroke();
  const span=4,dt=0.05;ctx.strokeStyle=rgba(BB.ink,0.9);ctx.lineWidth=3;ctx.lineCap="round";
  for(let k=Math.floor((t-span)/dt);k*dt<=t;k++){const tau=k*dt;if(tau<0)continue;const d=(angAt(tau)-pref),rate=Math.exp(-d*d/0.03);if(hash(k,17)>rate*0.85)continue;
    const px=x+30+(w-60)*(1-(t-tau)/span);ctx.beginPath();ctx.moveTo(px,base);ctx.lineTo(px,top+(base-top)*0.12*hash(k,3));ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- a picture read in layers */
// a small tile with a short bar of light at angle a, as the first layer's cells see edges
function bb_edgeTile(ctx,x,y,s,a,lit){ctx.save();ag_box(ctx,x-s/2,y-s/2,s,s,10,{edge:lit>0?BB_VI:null,edgeA:0.8*lit});ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=rgba(BB.ink,0.85);rr(ctx,-4,-s*0.32,8,s*0.64,4);ctx.fill();ctx.restore();}
// o.show: the parts in view, in order (0: the edges and shapes; 1: the picture coming in and the answer); o.sig (0..3): a signal through them
function bb_layers(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const sig=o.sig==null?-1:o.sig,more=o.more||0;
  const cols=[x-560,x-200,x+170,x+540],E=[0,0.5,1.05,1.57,2.1,2.6],shapes=["corner","curve","ring","stripes"];
  const pos1=E.map((e,i)=>[cols[1],y-250+i*100]),pos2=shapes.map((sh,i)=>[cols[2],y-180+i*120]);
  // links: picture to edges, edges to shapes, shapes to the answer
  const link=(A,B,k,s)=>{if(k<=0)return;ctx.strokeStyle=rgba(mix(BB_VI,[150,146,168],0.4),0.45*k);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(lerp(A[0],B[0],k),lerp(A[1],B[1],k));ctx.stroke();
    if(s>0&&s<1)bb_spark(ctx,lerp(A[0],B[0],s),lerp(A[1],B[1],s),12,0.85*Math.sin(Math.PI*s));};
  const k1=o.u==null?1:o.u;pos1.forEach((p,i)=>pos2.forEach((q,j)=>{if((i+j)%2===0||i===j)link([p[0]+46,p[1]],[q[0]-60,q[1]],k1,sig-1);}));
  if(more>0){pos1.forEach(p=>link([cols[0]+110,y],[p[0]-46,p[1]],more,sig));pos2.forEach(q=>link([q[0]+60,q[1]],[cols[3]-120,y],more,sig-2));}
  ag_T(ctx,"Edges",cols[1],y-320,{w:700,size:30,align:"center",col:AG.mut});ag_T(ctx,"Shapes",cols[2],y-260,{w:700,size:30,align:"center",col:AG.mut});
  pos1.forEach((p,i)=>bb_edgeTile(ctx,p[0],p[1],84,E[i],sig>=0.9&&sig<1.6?1:0));
  pos2.forEach((q,i)=>{const lit=sig>=1.9&&sig<2.6?1:0;ag_box(ctx,q[0]-56,q[1]-48,112,96,14,{edge:lit?BB_VI:null,edgeA:0.8});ctx.save();ctx.translate(q[0],q[1]);ctx.strokeStyle=rgba(BB.ink,0.85);ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();
    if(shapes[i]==="corner"){ctx.moveTo(-26,24);ctx.lineTo(-26,-24);ctx.lineTo(26,-24);}else if(shapes[i]==="curve"){ctx.moveTo(-28,22);ctx.quadraticCurveTo(0,-40,28,22);}else if(shapes[i]==="ring"){ctx.arc(0,0,24,0,TAU);}else{for(let k=-1;k<=1;k++){ctx.moveTo(-28,k*16);ctx.lineTo(28,k*16);}}
    ctx.stroke();ctx.restore();});
  if(more>0){ctx.save();ctx.globalAlpha*=more;
    // the picture coming in: a bee, framed; and what the network says it is
    ag_picture(ctx,cols[0]-110,y-110,220,220,{draw:(c,px,py,pw,ph)=>{c.fillStyle="rgb(214,222,196)";c.fillRect(px,py,pw,ph);bb_flower(c,px+pw*0.55,py+ph*0.78,0.45);bb_bee(c,px+pw*0.5,py+ph*0.46,0.5,0,{});}});
    ag_T(ctx,"A picture",cols[0],y+170,{w:700,size:30,align:"center",col:AG.mut});
    const lit=sig>=2.8?1:0;ag_pill(ctx,cols[3],y,"A bee",{size:34,col:lit?BB_VI:null,a:1});ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- weights, too many to count */
function bb_weights(ctx,x,y,w,h,t,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const nx=44,ny=20;ctx.lineCap="round";
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const px=x+(i+0.5)*w/nx,py=y+(j+0.5)*h/ny,v=Math.sin(i*1.7+j*2.3+t*0.6)*0.5+0.5,an=(hash(i,j)-0.5)*2.4+Math.sin(t*0.4+i*0.3)*0.2,L=6+10*v;
    ctx.strokeStyle=rgba(BB_VI,0.18+0.35*v);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(px-Math.cos(an)*L/2,py-Math.sin(an)*L/2);ctx.lineTo(px+Math.cos(an)*L/2,py+Math.sin(an)*L/2);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- 2021: one cell, and the layers it took to mimic it */
const BB_ONE=bb_cell(2021,{x:0,y:20,r:26,reach:160,dirs:6,depth:3,wig:0.38,spines:true,axon:{ang:Math.PI*0.5,len:150,ends:3,endLen:40},axW:10});
function bb_oneCell(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const t=o.t||0;
  // the living cell, framed on the left
  ag_picture(ctx,x-720,y-230,400,400,{draw:(c,px,py,pw,ph)=>{const g=c.createRadialGradient(px+pw*0.7,py+ph*0.3,20,px+pw/2,py+ph/2,pw);g.addColorStop(0,"rgb(108,76,62)");g.addColorStop(1,"rgb(42,30,28)");c.fillStyle=g;c.fillRect(px,py,pw,ph);
    c.save();c.translate(px+pw/2,py+ph/2-10);bb_drawCell(c,BB_ONE,{u:o.cell==null?1:o.cell,col:BB_LIVE});c.restore();}});
  ag_T(ctx,"One nerve cell",x-520,y+230,{w:700,size:30,align:"center"});
  ag_T(ctx,"=",x-200,y+16,{w:800,size:72,align:"center",col:AG.mut,a:o.eq==null?1:o.eq});
  // the network it took: seven layers
  const L=[];for(let i=0;i<7;i++)L.push({x:x-60+i*110,n:i===0||i===6?3:6,y:y-30,dy:64});
  bb_net(ctx,L,{r:18,u:o.net==null?1:o.net,sig:o.sig,a:1,alpha:0.32,sigma:false});
  ag_T(ctx,"A network of 5 to 8 layers",x+270,y+230,{w:700,size:30,align:"center"});
  ctx.restore();}

/* ---------------------------------------------------------------- a few examples, or a great many */
// a small picture of a bee, as an example: the film's honeybee, drawn once in three poses and kept, on a tile
function bb_beePic(i){const k=i%3;return ag_kept("bb:beeTile"+k,160,160,c=>{c.translate(86,88);c.rotate([-0.28,0.12,0.36][k]);if(k===1)c.scale(-1,1);bb_bee(c,-8,0,0.34,0,{});});}
function bb_beeTile(ctx,x,y,s,i){ag_box(ctx,x-s/2,y-s/2,s,s,s*0.14,{});ctx.drawImage(bb_beePic(i),x-s/2,y-s/2,s,s);}
// a child's card comes in with o.a (springing to size with o.k); its few examples with o.kA; the model's card, and its great many, with o.kB
function bb_examples(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const kA=o.kA==null?1:o.kA,kB=o.kB==null?1:o.kB;
  {ctx.save();if(o.k!=null)ag_about(ctx,x-540,y,lerp(0.6,1,clamp(o.k,0,1.2)));ag_box(ctx,x-860,y-240,640,480,24,{});ag_T(ctx,"A child",x-830,y-182,{w:700,size:36});
    ag_T(ctx,"a few examples",x-830,y-140,{w:500,size:28,col:AG.mut,a:ag_in(kA,0,0.3)});
    for(let i=0;i<3;i++){const k=ag_in(kA,0.2+i*0.2,0.2);if(k>0){ctx.save();ctx.globalAlpha*=k;ag_about(ctx,x-720+i*180,y+10,lerp(0.7,1,ag_eo(k)));bb_beeTile(ctx,x-720+i*180,y+10,140,i);ctx.restore();}}
    ag_pill(ctx,x-540,y+168,"“bee”",{size:34,a:ag_in(kA,0.85,0.15)});ctx.restore();}
  if(kB>0){ctx.save();ctx.globalAlpha*=clamp(kB*2,0,1);ag_box(ctx,x-120,y-240,980,480,24,{edge:BB_VI,edgeA:0.5});ag_T(ctx,"A model",x-90,y-182,{w:700,size:36});ag_T(ctx,"a great many",x-90,y-140,{w:500,size:28,col:AG.mut});
    const n=Math.floor(clamp(kB,0,1)*112);for(let i=0;i<n;i++){const cx=x-60+(i%16)*58,cy=y-90+Math.floor(i/16)*46;bb_beeTile(ctx,cx,cy,40,i);}ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- an airliner, from below */
function bb_plane(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(o.roll||0);ctx.scale(s,s);const col=[214,218,222],dk=[150,156,164],hi=[250,252,252];
  ag_soft(ctx,c=>{c.moveTo(-30,-10);c.lineTo(-250,90);c.lineTo(-250,110);c.lineTo(-20,40);c.lineTo(20,40);c.lineTo(250,110);c.lineTo(250,90);c.lineTo(30,-10);c.closePath();},col,hi,60,0,260,"rgba(40,50,60,0.35)",10,0.6);
  ag_soft(ctx,c=>{c.moveTo(-16,150);c.lineTo(-90,196);c.lineTo(-90,208);c.lineTo(-10,190);c.lineTo(10,190);c.lineTo(90,208);c.lineTo(90,196);c.lineTo(16,150);c.closePath();},col,hi,20,170,80,"rgba(40,50,60,0.3)",6,0.6);
  ag_soft(ctx,c=>c.ellipse(0,40,26,200,0,0,TAU),col,hi,10,-60,160,"rgba(40,50,60,0.35)",10,0.6);
  for(const ex of [-120,120])ag_soft(ctx,c=>c.ellipse(ex,62,14,40,0,0,TAU),dk,hi,ex+4,50,30,null);
  if(o.wing){ctx.save();ctx.globalAlpha*=o.wing;ctx.strokeStyle=rgba(BB_VI,0.9);ctx.lineWidth=6;ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(-30,-10);ctx.lineTo(-250,90);ctx.lineTo(-250,110);ctx.lineTo(-20,40);ctx.moveTo(30,-10);ctx.lineTo(250,90);ctx.lineTo(250,110);ctx.lineTo(20,40);ctx.stroke();ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- the next word's chances */
const BB_NEXT=[["dancing",70],["buzzing",12],["waggling",8],["flying",5],["singing",3]];
// the chances at a temperature T (1 as the model gave them): each raised to the power 1/T, then shared out again
function bb_temper(rows,T){const q=rows.map(r=>Math.pow(r[1]/100,1/Math.max(0.05,T))),s=q.reduce((a,b)=>a+b,0)+Math.pow(0.02,1/Math.max(0.05,T));return rows.map((r,i)=>[r[0],100*q[i]/s]);}
// as bars: each word, its bar, its chances in a hundred; o.tail draws a faint run of many more, every other word it knows; o.pick lights one
function bb_chances(ctx,x,y,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const bw=o.bw||420,u=o.u==null?1:o.u;
  rows.forEach(([w,p],i)=>{const k=ag_in(u,i*0.12,0.3);if(k<=0)return;const yy=y+i*66,pick=o.pick===i,wrong=o.wrong===i;ctx.save();ctx.globalAlpha*=k;
    ag_T(ctx,w,x,yy+11,{w:700,size:32,col:wrong?AG.amber:AG.ink});ctx.fillStyle="rgba(60,56,70,0.1)";rr(ctx,x+190,yy-14,bw,28,14);ctx.fill();
    ctx.fillStyle=rgba(wrong?AG.amber:BB_VI,pick?1:0.55);rr(ctx,x+190,yy-14,Math.max(28,bw*p/100*k),28,14);ctx.fill();
    ag_T(ctx,Math.round(p)+" in 100",x+190+bw+24,yy+11,{w:700,size:30,col:AG.mut});ctx.restore();});
  if(o.tail){ctx.save();ctx.globalAlpha*=o.tail;for(let i=0;i<12;i++){ctx.fillStyle=rgba(BB_VI,0.35);rr(ctx,x+190,y+rows.length*66-20+i*7,4+hash(i,9)*18,4,2);ctx.fill();}
    ag_T(ctx,"and every other word it knows",x+250,y+rows.length*66+28,{w:500,size:28,col:AG.mut});ctx.restore();}
  ctx.restore();}
// as a wheel: a slice for each word, as big as its chances, and a pointer at the top; rot turns it (radians, clockwise); o.pick lights
// the slice under the pointer, o.wrong colours one amber, o.label (the words) on the big slices and beside the small ones
function bb_wheelAt(rows,rot){let acc=0;const tot=rows.reduce((s,r)=>s+r[1],0)+(rows.extra||0),pt=((-rot)%TAU+TAU)%TAU;for(let i=0;i<rows.length;i++){const sp=rows[i][1]/tot*TAU;if(pt>=acc&&pt<acc+sp)return i;acc+=sp;}return -1;}
function bb_wheelTo(rows,i,turns){let acc=0;const tot=rows.reduce((s,r)=>s+r[1],0)+(rows.extra||0);for(let k=0;k<i;k++)acc+=rows[k][1]/tot*TAU;return TAU*turns-(acc+rows[i][1]/tot*TAU*0.5);}
function bb_wheel(ctx,x,y,r,rows,rot,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,clamp(o.k,0,1.2)));
  const tot=rows.reduce((s,r)=>s+r[1],0)+(rows.extra||0);ag_floorShadow(ctx,x-10,y+r+30,r*0.9,22,0.18);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.25)";ctx.shadowBlur=30;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=14;ctx.fillStyle="#EEECE7";ctx.beginPath();ctx.arc(x,y,r+14,0,TAU);ctx.fill();ctx.restore();
  let acc=-Math.PI/2+rot;const pick=o.pick;rows.forEach(([w,p],i)=>{const sp=p/tot*TAU,lit=pick===i,wrong=o.wrong===i;
    ctx.fillStyle=wrong?rgba(mix(AG.amber,[255,255,255],lit?0.2:0.55),1):rgba(mix(BB_VI,[255,255,255],lit?0.12:0.5+0.08*(i%2)),1);ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,acc,acc+sp);ctx.closePath();ctx.fill();
    ctx.strokeStyle="#F4F2EE";ctx.lineWidth=3;ctx.stroke();acc+=sp;});
  if(rows.extra){ctx.fillStyle="rgba(200,198,206,1)";ctx.beginPath();ctx.moveTo(x,y);ctx.arc(x,y,r,acc,acc+rows.extra/tot*TAU);ctx.closePath();ctx.fill();}
  // the hub
  ag_soft(ctx,c=>c.arc(x,y,r*0.12,0,TAU),[230,226,220],[255,255,255],x+6,y-6,r*0.14,"rgba(40,30,20,0.3)",4);
  // words: inside the slices big enough, and the rest beside the wheel
  if(o.labels!==false){acc=-Math.PI/2+rot;rows.forEach(([w,p],i)=>{const sp=p/tot*TAU,mid=acc+sp/2;acc+=sp;if(sp<0.55)return;const lx=x+Math.cos(mid)*r*0.62,ly=y+Math.sin(mid)*r*0.62;
    ag_T(ctx,w,lx,ly+11,{w:800,size:30,align:"center",col:pick===i?AG.white:AG.ink});});}
  // the pointer, at the top
  ctx.fillStyle=AG.arrow;ctx.beginPath();ctx.moveTo(x,y-r+30);ctx.lineTo(x-20,y-r-22);ctx.lineTo(x+20,y-r-22);ctx.closePath();ctx.fill();
  ctx.restore();}
// the temperature dial: a ceramic knob turning from Low (v 0) to High (v 1), with its name under it
function bb_dial(ctx,x,y,r,v,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y,lerp(0.6,1,clamp(o.k,0,1.2)));
  const a0=Math.PI*0.75,span=Math.PI*1.5,an=a0+span*clamp(v,0,1);ctx.strokeStyle="rgba(60,56,50,0.25)";ctx.lineWidth=10;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,r+30,a0,a0+span);ctx.stroke();
  ctx.strokeStyle=rgba(BB_VI,0.8);ctx.beginPath();ctx.arc(x,y,r+30,a0,an);ctx.stroke();
  const sp=AG.sphere,g=ctx.createRadialGradient(x+r*0.34,y-r*0.43,r*0.07,x,y,r*1.05);g.addColorStop(0,sp[0]);g.addColorStop(0.6,sp[1]);g.addColorStop(1,sp[2]);
  ctx.save();ctx.shadowColor=AG.sphereShadow;ctx.shadowBlur=r*0.4;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=r*0.2;ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();
  ctx.strokeStyle=AG.arrow;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.25,y+Math.sin(an)*r*0.25);ctx.lineTo(x+Math.cos(an)*r*0.82,y+Math.sin(an)*r*0.82);ctx.stroke();
  ag_T(ctx,"Low",x+Math.cos(a0)*(r+30)-10,y+Math.sin(a0)*(r+30)+50,{w:700,size:28,align:"center",col:AG.mut});
  ag_T(ctx,"High",x+Math.cos(a0+span)*(r+30)+10,y+Math.sin(a0+span)*(r+30)+50,{w:700,size:28,align:"center",col:AG.mut});
  ag_T(ctx,"Temperature",x,y+r+96,{w:700,size:30,align:"center"});ctx.restore();}
// an answer on a card: the model's words; o.word marks where the chosen word starts (it's drawn in violet), o.wrong (amber edge)
function bb_answer(ctx,x,y,w,text,o){o=o||{};return ag_textCard(ctx,x,y,w,{kick:o.kick===undefined?"The model":o.kick,title:text},{a:o.a,k:o.k,edge:o.wrong?AG.amber:o.edge,kickCol:o.wrong?AG.amber:BB_VI});}

/* ---------------------------------------------------------------- 2025: a fact seen once */
// a page of text with grey lines; o.mark (0..1) highlights one line on it, the one place the fact appears
function bb_page(ctx,x,y,w,h,o){o=o||{};ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);ag_box(ctx,0,0,w,h,10,{});const R=ag_rnd(o.seed||1);
  for(let i=0;i<Math.floor((h-60)/30);i++){const lw=(w-70)*(0.6+0.4*R()),ly=40+i*30;if(o.mark&&i===o.line){ctx.fillStyle=rgba([250,222,120],0.8*o.mark);rr(ctx,26,ly-12,lw+18,26,6);ctx.fill();}
    ctx.fillStyle="rgba(90,86,80,0.35)";rr(ctx,35,ly-4,lw,9,4);ctx.fill();}ctx.restore();}
function bb_pages(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;for(let i=5;i>=0;i--){const k=ag_in(o.u==null?1:o.u,(5-i)*0.1,0.3);if(k<=0)continue;ctx.save();ctx.globalAlpha*=k;
    bb_page(ctx,x+i*34,y-i*26,360,460,{rot:(i-2.5)*0.025,seed:i+3,mark:i===0?o.mark:0,line:6});ctx.restore();}ctx.restore();}
// the test: a question, and how a guess and a blank score
function bb_test(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+430,y+200,lerp(0.6,1,clamp(o.k,0,1.2)));const w=860,h=400;
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,"TEST",x+34,y+56,{w:700,size:28,ls:4,col:AG.mut});ag_T(ctx,"The researcher's birthday?",x+34,y+110,{w:700,size:36});
  const row=(yy,ans,score,k,col)=>{if(k<=0)return;ctx.save();ctx.globalAlpha*=k;ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+34,yy-50);ctx.lineTo(x+w-34,yy-50);ctx.stroke();
    ag_T(ctx,ans,x+34,yy,{w:700,size:34,col:AG.ink});ag_T(ctx,score,x+w-34,yy,{w:700,size:30,align:"right",col:col||AG.mut});ctx.restore();};
  row(y+230,"A guess: 15 June",o.guessScore||"might score",o.g==null?1:o.g,AG.ink);row(y+330,"“I don’t know”","never scores",o.b==null?1:o.b);ctx.restore();}

/* ---------------------------------------------------------------- the 1950s: the gap, seen at last */
// an electron microscope's picture, in greys: one cell's end with its small sacs, the gap, the next cell's edge; kept small
function bb_emTex(){return ag_kept("bb:em",900,520,(c,w,h)=>{c.fillStyle="rgb(150,150,146)";c.fillRect(0,0,w,h);const R=ag_rnd(1955);
  for(let i=0;i<2600;i++){c.fillStyle="rgba("+(R()<0.5?"40,40,40":"230,230,226")+","+(0.04+R()*0.08)+")";c.beginPath();c.arc(R()*w,R()*h,1+R()*5,0,TAU);c.fill();}
  // the end above the gap, its sacs, and the two edges of the gap
  const top=c=>{c.moveTo(0,0);c.lineTo(w,0);c.lineTo(w,190);c.bezierCurveTo(w*0.7,250,w*0.3,250,0,200);c.closePath();};c.save();c.beginPath();top(c);c.fillStyle="rgba(176,176,172,0.8)";c.fill();c.clip();
  for(let i=0;i<46;i++){const x=R()*w,y=40+R()*170,r=10+R()*6;c.strokeStyle="rgba(50,50,50,0.7)";c.lineWidth=3;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();c.fillStyle="rgba(206,206,202,0.6)";c.fill();}c.restore();
  c.strokeStyle="rgba(36,36,36,0.85)";c.lineWidth=8;c.beginPath();c.moveTo(0,204);c.bezierCurveTo(w*0.3,254,w*0.7,254,w,194);c.stroke();
  c.beginPath();c.moveTo(0,238);c.bezierCurveTo(w*0.3,288,w*0.7,288,w,228);c.stroke();
  c.fillStyle="rgba(60,60,60,0.25)";c.beginPath();c.moveTo(0,244);c.bezierCurveTo(w*0.3,294,w*0.7,294,w,234);c.lineTo(w,h);c.lineTo(0,h);c.closePath();c.fill();
  ag_grain(c,0,0,w,h,3,57);});}
function bb_em(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_picture(ctx,x,y,w,h,{frame:"graphite",img:bb_emTex()});
  // the gap's width, marked
  const gx=x+w*0.5,gy=y+h*(252/520),k=o.mark||0;if(k>0){ctx.save();ctx.globalAlpha*=k;ctx.strokeStyle="rgba(255,248,214,0.95)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(gx-60,gy-6);ctx.lineTo(gx+60,gy-6);ctx.moveTo(gx-60,gy+30);ctx.lineTo(gx+60,gy+30);ctx.stroke();
    ag_arrowHead(ctx,gx,gy-6,Math.PI/2,14,"rgba(255,248,214,0.95)");ag_arrowHead(ctx,gx,gy+30,-Math.PI/2,14,"rgba(255,248,214,0.95)");ctx.restore();}
  ctx.restore();}
