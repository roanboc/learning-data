/* ===== Borrowed from the brain: living things =====
   The nerve cell's chapter and the animals', matte and soft-lit from the right like everything in the module, painted full-frame:
     bbTissue    living tissue under a lamp: warm and dark, other cells soft behind (closer, the gap between two cells)
     bbSea       open water, light from the surface at the top right, and the sea floor under it: sand, stones and weed
     bbMeadow    a meadow in summer, a flower in front (and a honeycomb, seen from above, in a round view over it)
     bbReef      a rocky reef
     bbBranch    a branch in a soft green garden
     bbEye       an eye cut in half, drawn on paper as an anatomy book would (and the blind spot's test, a patterned cloth)
   A film keeps every place it paints, a full frame each, so these are few: what is soft or small is drawn live or kept small.
   What lives is drawn live: the cells and their signals, the jellyfish, the sea slug, the bee, the octopus, the finches, the eye's
   light. Every name starts with bb_ or BB_. */

const BB_LIVE=[228,178,140];   // a living nerve cell: warm, lit like a lamp
const BB_INK2=[52,40,34];      // the drawn lines of the living world: a warm ink

/* ---------------------------------------------------------------- along a cell */
// the part of points P between fractions u0 and u1 of its length
function bb_sub(P,u0,u1){let tot=0;const L=[0];for(let i=1;i<P.length;i++){tot+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);L.push(tot);}
  const a=clamp(u0,0,1)*tot,b=clamp(u1,0,1)*tot,out=[];if(b<=a)return out;
  const at=d=>{for(let i=1;i<P.length;i++)if(d<=L[i]){const k=(d-L[i-1])/((L[i]-L[i-1])||1);return[lerp(P[i-1][0],P[i][0],k),lerp(P[i-1][1],P[i][1],k)];}return P[P.length-1].slice();};
  out.push(at(a));for(let i=0;i<P.length;i++)if(L[i]>a&&L[i]<b)out.push(P[i].slice());out.push(at(b));return out;}
// the way from the tip of branch i in to the cell's body, through the branches it grows from
function bb_toBody(cell,i){const out=[];let b=cell.B[i],from=1;while(b){for(const q of bb_sub(b.P,0,from).reverse())out.push(q);if(b.from<0)break;from=b.at;b=cell.B[b.from];}out.push([cell.x,cell.y]);return out;}
// the tips a cell takes its signals in at: its outer branches, spread round it
function bb_tips(cell,n){const outer=cell.B.map((b,i)=>[b,i]).filter(([b])=>!b.kids.length);const step=Math.max(1,Math.floor(outer.length/n));const out=[];for(let k=0;k<outer.length&&out.length<n;k+=step)out.push(outer[k][1]);return out;}
// a signal running along points P at u (0..1): a spark, with a short lit stretch behind it
function bb_run(ctx,P,u,w,o){o=o||{};if(u<=0||u>=1)return;const a=o.a==null?1:o.a;const S=bb_sub(P,Math.max(0,u-(o.tail||0.1)),u);if(S.length>1){ctx.save();ctx.globalAlpha*=a;bb_strand(ctx,S,w*0.3,w,rgba(BB.spark,0.55),1);ctx.restore();}
  const q=bb_along(P,u);bb_spark(ctx,q[0],q[1],o.r||22,a);}
// a cell's pulse: the body flashes, then the pulse runs down its long fibre and out along its end branches; k (0..1) how far it has gone
function bb_pulse(ctx,cell,k,o){o=o||{};if(k<=0||k>=1)return;bb_cellGlow(ctx,cell,(1-ag_in(k,0.05,0.25))*0.9);const u=clamp((k-0.06)/0.94,0,1);if(u<=0)return;
  if(u<0.82)bb_run(ctx,cell.A,u/0.82,o.w||cell.w0*1.6,{r:o.r||24});else cell.ends.forEach(e=>bb_run(ctx,e,(u-0.82)/0.18,o.w||cell.w0,{r:(o.r||24)*0.75,tail:0.35}));}

/* ---------------------------------------------------------------- living tissue under a lamp */
// soft cells far behind, out of focus; painted at half size, as it's soft anyway
function bb_softBack(c,seed,base,n,blur,spots){const w=960,h=540,cv=mkCanvas(w,h),x=cv.getContext("2d");
  const g=x.createRadialGradient(w*0.78,h*0.22,20,w*0.55,h*0.5,w*0.85);g.addColorStop(0,rgba(base[0],1));g.addColorStop(0.55,rgba(base[1],1));g.addColorStop(1,rgba(base[2],1));x.fillStyle=g;x.fillRect(0,0,w,h);
  // the spots drawn sharp on their own canvas, then blurred once onto the ground (a blur on each shape took seconds)
  const sp=mkCanvas(w,h),y=sp.getContext("2d"),R=ag_rnd(seed);
  for(let i=0;i<n;i++){const px=R()*w,py=R()*h,r=8+R()*22,col=mix(spots[0],spots[1],R());y.fillStyle=rgba(col,0.18+R()*0.22);y.beginPath();y.ellipse(px,py,r,r*0.85,R()*3,0,TAU);y.fill();
    for(let k=0;k<3;k++){let a=R()*TAU,qx=px,qy=py;const P=[[qx,qy]];for(let j=0;j<6;j++){a+=(R()-0.5)*0.7;qx+=Math.cos(a)*26;qy+=Math.sin(a)*26;P.push([qx,qy]);}bb_strand(y,bb_smooth(P,3),3.5,1,rgba(col,0.16),1);}}
  x.filter="blur("+blur+"px)";x.drawImage(sp,0,0);x.filter="none";c.drawImage(cv,0,0,W,H);}
AG_PLACES.bbTissue=c=>{bb_softBack(c,77,[[124,86,68],[74,50,44],[36,26,26]],30,7,[[150,100,84],[214,156,120]]);ag_grain(c,0,0,W,H,1.2,29);};

// the nerve cells of the cell's chapter: one big one, its fibre running to the right, and the next cell, where it ends
const BB_N1=bb_cell(2049,{x:560,y:480,r:38,reach:250,dirs:7,depth:3,wig:0.36,spines:true,axon:{ang:0.04,len:700,bend:0.2,ends:3,endLen:66},axW:13});
const BB_N1E=BB_N1.A[BB_N1.A.length-1];
const BB_N2=bb_cell(1891,{x:BB_N1E[0]+250,y:BB_N1E[1]+30,r:32,reach:190,dirs:6,depth:3,wig:0.4,spines:true,axon:{ang:0.3,len:400,bend:0.2,ends:3,endLen:50},axW:11});
const BB_N1TIPS=bb_tips(BB_N1,12).map(i=>bb_toBody(BB_N1,i));
// the cells round it, faint, whose fibres end on its branches
const BB_AROUND=[[200,310,0.6],[300,880,-0.9],[1150,140,2.4],[880,900,-2.2],[120,600,0.1]].map(([x,y,a],i)=>bb_cell(3100+i*7,{x,y,r:20,reach:120,dirs:5,depth:2,wig:0.45,axon:{ang:a,len:260,bend:0.3,ends:3,endLen:40},axW:7}));

/* ---------------------------------------------------------------- the pulse, as a trace: all or nothing */
// a card: the pulse over time; small bumps that stay under the dashed line (not enough arrived: nothing), then pulses, each the same height
function bb_trace(ctx,x,y,w,h,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,o.title||"All or nothing",x+30,y+54,{w:700,size:34});
  const gx=x+30,gw=w-60,base=y+h-36,top=y+96,thr=lerp(base,top,0.42);
  ctx.save();ctx.setLineDash([10,9]);ctx.strokeStyle=rgba(AG.mut,0.55);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx,thr);ctx.lineTo(gx+gw,thr);ctx.stroke();ctx.restore();
  const ev=o.ev||[[0.12,0.22],[0.24,0.3],[0.44,1],[0.64,1],[0.84,1]],v=s=>{let m=0;for(const [c,hh] of ev){const d=(s-c)/(hh>=1?0.011:0.028);m+=hh*Math.exp(-d*d);}return m;};
  ctx.strokeStyle=rgba(BB.ink,0.86);ctx.lineWidth=3.4;ctx.lineJoin="round";ctx.lineCap="round";ctx.beginPath();const n=260,m=Math.ceil(n*clamp(u,0,1));
  for(let i=0;i<=m;i++){const s=i/n,yy=base-(base-top)*v(s);i?ctx.lineTo(gx+gw*s,yy):ctx.moveTo(gx+gw*s,yy);}ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- the gap: one cell's fibre ending by the next, close up
   The fibre comes in from the top left and swells to an end (its knob, full of small sacs of messengers); the next cell's branch comes
   from the bottom right, its surface set with the places the messengers fit. The gap runs between them. All drawn live: when the pulse
   arrives (o.t0), a few sacs open at the gap, their messengers cross it, and where they land the next cell lights (o.glow) or, held back,
   dims (o.dim). o.grow (0..1) makes the connection stronger: a bigger end, more places for the messengers. */
const BB_SYN=(()=>{const kc=[740,396],kr=250,hc=[1190,736],hr=232,d=[hc[0]-kc[0],hc[1]-kc[1]],L=Math.hypot(d[0],d[1]),u=[d[0]/L,d[1]/L],
    kb=[kc[0]+u[0]*kr,kc[1]+u[1]*kr],hb=[hc[0]-u[0]*hr,hc[1]-u[1]*hr],R=ag_rnd(1953),ves=[];
  for(let i=0;i<18;i++){const a=Math.atan2(u[1],u[0])+(R()-0.5)*2.4,rr0=kr*(0.25+R()*0.55);ves.push([kc[0]+Math.cos(a)*rr0,kc[1]+Math.sin(a)*rr0,16+R()*8]);}
  ves.sort((p,q)=>Math.hypot(p[0]-kb[0],p[1]-kb[1])-Math.hypot(q[0]-kb[0],q[1]-kb[1]));
  const rec=[];const a0=Math.atan2(-u[1],-u[0]);for(let i=0;i<11;i++){const a=a0+(i-5)*0.085;rec.push([hc[0]+Math.cos(a)*hr,hc[1]+Math.sin(a)*hr,a,i%2===1]);}
  return{kc,kr,hc,hr,u,kb,hb,ves,rec,gap:[(kb[0]+hb[0])/2,(kb[1]+hb[1])/2],
    knob:bb_blob(kc[0],kc[1],kr,kr*0.94,0.7,0.05,72),head:bb_blob(hc[0],hc[1],hr,hr*0.95,1.9,0.05,72)};})();
function bb_synapse(ctx,t,o){o=o||{};const S=BB_SYN,grow=o.grow||0,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const col=BB_LIVE,dk=mix(col,[60,30,30],0.4),hi=mix(col,[255,250,244],0.5);
  // the next cell's branch, from the bottom right, and its head by the gap
  ag_soft(ctx,c=>{c.moveTo(2000,1040);c.bezierCurveTo(1700,980,1480,900,S.hc[0]+120,S.hc[1]+150);c.lineTo(S.hc[0]+60,S.hc[1]+220);c.bezierCurveTo(1480,1060,1700,1120,2000,1180);c.closePath();},mix(col,dk,0.25),hi,1500,900,400,rgba(dk,0.5),20,0.5);
  const lit=o.glow||0,dim=o.dim||0;
  ag_soft(ctx,c=>bb_path(c,S.head),mix(mix(col,[255,236,200],0.35*lit),[70,60,70],0.45*dim),hi,S.hc[0]+90,S.hc[1]-80,S.hr*1.5,rgba(dk,0.55),24,0.7);
  ctx.strokeStyle=rgba(mix(dk,[30,16,14],0.3),0.55);ctx.lineWidth=7;ctx.beginPath();bb_path(ctx,S.head);ctx.stroke();
  if(lit>0){ctx.save();ctx.beginPath();bb_path(ctx,S.head);ctx.clip();const g=ctx.createRadialGradient(S.hb[0],S.hb[1],10,S.hb[0],S.hb[1],S.hr*1.6);g.addColorStop(0,rgba(BB.spark,0.75*lit));g.addColorStop(1,rgba(BB.spark,0));ctx.fillStyle=g;ctx.fillRect(S.hc[0]-S.hr*2,S.hc[1]-S.hr*2,S.hr*4,S.hr*4);ctx.restore();}
  // the places the messengers fit, along the head's edge by the gap (more of them as the connection grows)
  const bound=o.bound||0;S.rec.forEach(([x,y,an,extra],i)=>{const k=extra?ag_in(grow,0.2+i*0.04,0.3):1;if(k<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(an+Math.PI/2);ctx.scale(k,k);
    ctx.fillStyle=rgba(mix(dk,[255,236,200],0.6*bound),1);rr(ctx,-11,-8,22,22,6);ctx.fill();ctx.restore();});
  // the fibre from the top left, and its end
  const kg=1+0.1*grow;ctx.save();ag_about(ctx,S.kb[0],S.kb[1],kg);
  ag_soft(ctx,c=>{c.moveTo(-80,250);c.bezierCurveTo(120,236,300,240,S.kc[0]-200,S.kc[1]-110);c.lineTo(S.kc[0]-190,S.kc[1]+110);c.bezierCurveTo(300,450,120,430,-80,430);c.closePath();},mix(col,dk,0.2),hi,260,300,400,rgba(dk,0.5),20,0.5);
  ag_soft(ctx,c=>bb_path(c,S.knob),col,hi,S.kc[0]+110,S.kc[1]-120,S.kr*1.5,rgba(dk,0.55),26,0.75);
  ctx.strokeStyle=rgba(mix(dk,[30,16,14],0.3),0.55);ctx.lineWidth=7;ctx.beginPath();bb_path(ctx,S.knob);ctx.stroke();
  // the small sacs, each holding messengers; the nearest few open at the gap when the pulse arrives
  const t0=o.t0,since=t0==null?-1:t-t0;
  S.ves.forEach(([x,y,r],i)=>{let px=x,py=y,rad=r,open=0;if(i<4&&since>0){const m=ag_sine(clamp(since/0.5,0,1)),to=[S.kb[0]-S.u[0]*20+(i-1.5)*S.u[1]*44,S.kb[1]-S.u[1]*20-(i-1.5)*S.u[0]*44];
      px=lerp(x,to[0],m);py=lerp(y,to[1],m);open=clamp((since-0.45)/0.35,0,1);rad=r*(1-0.6*open);}
    if(rad<=1)return;ctx.fillStyle=rgba(mix(col,[255,246,232],0.55),1-0.7*open);ctx.beginPath();ctx.arc(px,py,rad,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(dk,0.5*(1-open));ctx.lineWidth=2.4;ctx.stroke();ctx.fillStyle=rgba(BB.spark,0.9*(1-open));for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(px+Math.cos(k*1.7+i)*rad*0.45,py+Math.sin(k*1.7+i)*rad*0.45,2.6,0,TAU);ctx.fill();}});
  ctx.restore();
  // the messengers, crossing the gap to the places they fit
  if(since>0.7){const R=ag_rnd(7);for(let i=0;i<28;i++){const d0=R()*0.5,s=clamp((since-0.7-d0)/1.1,0,1),sx=(R()-0.5)*170,ex=(R()-0.5)*190;if(s<=0)continue;
    const A=[S.kb[0]+S.u[1]*sx*0.5-S.u[0]*6,S.kb[1]-S.u[0]*sx*0.5-S.u[1]*6],B=[S.hb[0]+S.u[1]*ex*0.5+S.u[0]*4,S.hb[1]-S.u[0]*ex*0.5+S.u[1]*4],
      e=ag_sine(s),wob=Math.sin(s*9+i)*7*(1-s);const x=lerp(A[0],B[0],e)+S.u[1]*wob,y=lerp(A[1],B[1],e)-S.u[0]*wob;
    const fade=1-ag_in(since,2.6+d0,0.6);if(fade<=0)continue;bb_spark(ctx,x,y,11,fade);}}
  ctx.restore();}
// a small diagram of a connection for a card: the end of one cell above, the next below; kind "excite" lights it, "hold" dims it (k 0..1)
function bb_miniSyn(ctx,x,y,s,kind,k,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const col=BB_LIVE,dk=mix(col,[60,30,30],0.4),hi=mix(col,[255,250,244],0.5);
  ag_soft(ctx,c=>{c.moveTo(-26,-150);c.lineTo(26,-150);c.lineTo(30,-70);c.bezierCurveTo(80,-60,86,-12,50,-4);c.lineTo(-50,-4);c.bezierCurveTo(-86,-12,-80,-60,-30,-70);c.closePath();},col,hi,30,-60,90,rgba(dk,0.5),10,0.7);
  const lit=kind==="excite"?k:0,dim=kind==="hold"?k:0;
  ag_soft(ctx,c=>{c.moveTo(-90,24);c.bezierCurveTo(-60,10,60,10,90,24);c.bezierCurveTo(110,70,80,140,0,150);c.bezierCurveTo(-80,140,-110,70,-90,24);c.closePath();},mix(mix(col,[255,236,200],0.4*lit),[70,62,74],0.55*dim),hi,40,40,120,rgba(dk,0.5),12,0.7);
  if(lit>0)bb_spark(ctx,0,70,90*lit,0.7*lit);
  // messengers in the gap
  for(let i=0;i<6;i++){const ph=((t||0)*0.9+i/6)%1;bb_spark(ctx,-40+i*16,-2+ph*24,6,0.8*Math.sin(Math.PI*ph));}
  ctx.restore();}

/* ---------------------------------------------------------------- portraits, a rabbit, a graph */
// a person in an oval mount, from the chest up, with their name under it (who as ag_person's)
function bb_portrait(ctx,x,y,w,h,who,name,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h+(name?64:0),22,{});const cx=x+w/2,cy=y+h/2,rx=w/2-26,ry=h/2-26;
  ctx.save();ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,TAU);ctx.clip();const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,rgba(o.bg0||[196,190,176],1));g.addColorStop(1,rgba(o.bg1||[228,222,206],1));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  const s=o.s||(ry*2/430);ag_person(ctx,who,cx-12*s,cy+ry*0.42,s,{t,covered:true,flip:o.flip,gaze:o.gaze||[2,0],smile:o.smile==null?0.25:o.smile,nod:o.nod||0});ctx.restore();
  ctx.strokeStyle=rgba(BB.brass,0.9);ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,TAU);ctx.stroke();
  if(name)ag_T(ctx,name,cx,y+h+40,{w:700,size:30,align:"center"});ctx.restore();}
// a rabbit sitting, seen from the side, facing left: its body round, long ears laid back, a white tail; s its size (1: about 300 px long)
function bb_rabbit(ctx,x,y,s,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const fur=[150,128,108],dk=mix(fur,[40,30,24],0.45),hi=mix(fur,[250,240,226],0.5);
  ag_floorShadow(ctx,10,6,150,16,0.3);
  ag_soft(ctx,c=>{c.moveTo(-60,-150);c.bezierCurveTo(-20,-180,80,-176,130,-120);c.bezierCurveTo(170,-76,170,-10,130,0);c.lineTo(-40,0);c.bezierCurveTo(-90,-20,-100,-110,-60,-150);c.closePath();},fur,hi,60,-150,200,rgba(dk,0.5),18,0.6);
  ag_soft(ctx,c=>c.ellipse(-24,-6,46,12,0,0,TAU),mix(fur,dk,0.3),hi,-10,-12,40,null);
  ag_soft(ctx,c=>c.arc(150,-74,26,0,TAU),[244,240,232],[255,255,255],156,-84,30,"rgba(0,0,0,0.2)",6);
  // the head, the ears laid back over the shoulders
  ag_soft(ctx,c=>{c.moveTo(-150,-120);c.bezierCurveTo(-150,-176,-60,-196,-30,-150);c.bezierCurveTo(-14,-120,-36,-84,-80,-80);c.bezierCurveTo(-118,-80,-150,-90,-150,-120);c.closePath();},fur,hi,-70,-170,110,rgba(dk,0.5),12,0.6);
  for(const [dx,dy,r] of [[0,0,0.18],[16,-6,0.08]])ag_soft(ctx,c=>{c.moveTo(-58+dx,-166+dy);c.bezierCurveTo(-20+dx,-222+dy,60+dx,-226+dy,92+dx,-200+dy);c.bezierCurveTo(70+dx,-184+dy,10+dx,-170+dy,-36+dx,-150+dy);c.closePath();},mix(fur,dk,r),hi,40,-210,80,rgba(dk,0.4),8,0.5);
  ctx.fillStyle="#1d1614";ctx.beginPath();ctx.arc(-96,-136,6.5,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.7)";ctx.beginPath();ctx.arc(-94,-138,2,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(mix(fur,[120,70,70],0.5),1);ctx.beginPath();ctx.arc(-148,-116,4.5,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(250,246,240,0.55)";ctx.lineWidth=1.4;for(const k of [-1,0,1]){ctx.beginPath();ctx.moveTo(-146,-110);ctx.quadraticCurveTo(-176,-110+k*8,-200,-104+k*16);ctx.stroke();}
  ctx.restore();}
// a small graph on a card: a link's strength over time, steady, then, after use (at x share u0), higher and staying high; u draws it on
function bb_graph(ctx,x,y,w,h,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,clamp(o.k,0,1.2)));
  ag_box(ctx,x,y,w,h,22,{});ag_T(ctx,o.title||"Link strength",x+30,y+52,{w:700,size:32});
  const gx=x+40,gw=w-80,base=y+h-56,top=y+92;ctx.strokeStyle=rgba(AG.mut,0.6);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(gx,top);ctx.lineTo(gx,base);ctx.lineTo(gx+gw,base);ctx.stroke();
  const u0=o.u0||0.36,v=s=>s<u0?0.3:0.3+0.45*ag_eo(clamp((s-u0)/0.08,0,1));ctx.strokeStyle=rgba(BB.ink,0.86);ctx.lineWidth=4;ctx.lineJoin="round";ctx.beginPath();
  const n=120,m=Math.ceil(n*clamp(u,0,1));for(let i=0;i<=m;i++){const s=i/n,yy=base-(base-top)*v(s);i?ctx.lineTo(gx+gw*s,yy):ctx.moveTo(gx+gw*s,yy);}ctx.stroke();
  if(u>u0){ctx.fillStyle=rgba(BB.ink,0.85);ag_T(ctx,o.mark||"use",gx+gw*u0,base+38,{w:700,size:28,align:"center",col:AG.mut});ctx.strokeStyle=rgba(AG.mut,0.7);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx+gw*u0,base);ctx.lineTo(gx+gw*u0,base+8);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- under the sea */
function bb_water(c,top,mid,low,seed){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba(top,1));g.addColorStop(0.5,rgba(mid,1));g.addColorStop(1,rgba(low,1));c.fillStyle=g;c.fillRect(0,0,W,H);
  c.save();c.globalCompositeOperation="lighter";for(let k=0;k<7;k++){const x0=1060+k*150,sl=0.5+k*0.04,gr=c.createLinearGradient(x0,0,x0-sl*H,H);gr.addColorStop(0,"rgba(255,250,230,0.09)");gr.addColorStop(1,"rgba(255,250,230,0)");
    c.fillStyle=gr;c.beginPath();c.moveTo(x0-30,0);c.lineTo(x0+50,0);c.lineTo(x0+50-sl*H,H);c.lineTo(x0-150-sl*H,H);c.closePath();c.fill();}c.restore();
  const R=ag_rnd(seed);for(let i=0;i<110;i++){c.fillStyle="rgba(232,242,238,"+(0.08+R()*0.18)+")";c.beginPath();c.arc(R()*W,R()*H,1+R()*2.2,0,TAU);c.fill();}}
// open water over the sea floor: the jellyfish swims in the water, the sea slug lies on the floor (the camera closes on each in turn)
AG_PLACES.bbSea=c=>{bb_water(c,[146,190,192],[72,130,144],[44,88,100],33);
  const g=c.createLinearGradient(0,760,0,H);g.addColorStop(0,rgba([170,162,132],1));g.addColorStop(1,rgba([126,116,92],1));c.fillStyle=g;c.beginPath();c.moveTo(0,H);c.lineTo(0,800);
  for(let x=0;x<=W;x+=24)c.lineTo(x,790-34*AG_NZ.fbm(x*0.002,0.7,3));c.lineTo(W,H);c.closePath();c.fill();
  const hz=c.createLinearGradient(0,700,0,840);hz.addColorStop(0,"rgba(72,130,144,0.5)");hz.addColorStop(1,"rgba(72,130,144,0)");c.fillStyle=hz;c.fillRect(0,700,W,140);
  const R=ag_rnd(17);for(let i=0;i<8;i++){const x=R()*W,y=880+R()*170,r=50+R()*80,B=bb_blob(x,y,r,r*0.55,i*1.3,0.2,24);ag_soft(c,cc=>bb_path(cc,B),[104,106,98],[176,178,166],x+r*0.4,y-r*0.5,r*1.4,"rgba(20,30,30,0.4)",10,0.5);}
  for(let i=0;i<12;i++){const x=R()*W,y=820+R()*120,h=110+R()*200;for(let k=0;k<3;k++){const P=[];for(let j=0;j<=8;j++){const q=j/8;P.push([x+k*14+Math.sin(q*3+i+k)*26*q,y-h*q]);}bb_strand(c,bb_smooth(P,3),16,4,rgba(mix([86,112,70],[140,132,76],R()),0.72),1);}}
  ag_grain(c,0,0,W,H,1.2,35);};
// a jellyfish: its bell pulsing, a net of nerve cells in it (o.net lights it), tentacles and four frilled arms trailing; s its size
// (1: the bell 440 px across); o.food (0..1) brings a small shrimp into its tentacles and up an arm
function bb_jelly(ctx,x,y,s,t,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);const ph=t*1.9,p=Math.pow(Math.max(0,Math.sin(ph)),2),Rw=220*(1-0.09*p),Rh=150*(1+0.08*p),bob=-p*14;
  ctx.translate(0,bob);
  // tentacles from the margin, and the four frilled arms from the middle
  ctx.lineCap="round";for(let i=0;i<34;i++){const f=i/33,mx=lerp(-Rw*0.96,Rw*0.96,f),my=8+Math.sin(f*Math.PI)*6;ctx.strokeStyle="rgba(236,226,232,"+(0.32+0.2*Math.sin(i))+")";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx,my);
    for(let j=1;j<=12;j++){const k=j/12;ctx.lineTo(mx*(1-0.2*k)+Math.sin(t*1.3+i*0.7+j*0.45)*16*k,my+k*(300+40*Math.sin(i*1.3))-p*20*k);}ctx.stroke();}
  for(let i=0;i<4;i++){const P=[];const sx=(i-1.5)*30;for(let j=0;j<=10;j++){const k=j/10;P.push([sx*(1+k*1.5)+Math.sin(t*1.1+i*1.6+j*0.5)*20*k,30+k*360-p*24*k]);}
    bb_strand(ctx,bb_smooth(P,3),26,6,"rgba(232,214,226,0.55)",1);const Q=P.map(q=>[q[0]+5,q[1]]);ctx.strokeStyle="rgba(250,240,246,0.5)";ctx.lineWidth=1.6;ctx.beginPath();bb_path(ctx,bb_smooth(Q,3),false);ctx.stroke();}
  // the shrimp, caught
  const fd=o.food||0;if(fd>0){const k=ag_sine(clamp(fd*1.4,0,1)),up=ag_sine(clamp(fd*1.4-0.5,0,1)),fx=lerp(320,40,k),fy=lerp(260,300,k)-up*200;ctx.save();ctx.translate(fx,fy);ctx.rotate(-0.4+k*0.6);
    ctx.fillStyle="rgba(196,132,100,0.95)";ctx.beginPath();ctx.ellipse(0,0,16,7,0,0,TAU);ctx.fill();ctx.strokeStyle="rgba(196,132,100,0.9)";ctx.lineWidth=1.5;for(let k2=0;k2<4;k2++){ctx.beginPath();ctx.moveTo(-6+k2*4,4);ctx.lineTo(-10+k2*5,14);ctx.stroke();}ctx.beginPath();ctx.moveTo(14,-2);ctx.quadraticCurveTo(30,-16,42,-12);ctx.stroke();ctx.restore();}
  // the bell: clear, lit from the top right, its margin scalloped
  const bell=c=>{c.moveTo(-Rw,4);c.bezierCurveTo(-Rw,-Rh*1.15,Rw,-Rh*1.15,Rw,4);for(let k=16;k>=0;k--){const xx=lerp(-Rw,Rw,k/16);c.quadraticCurveTo(xx+Rw/16,18,xx,4);}c.closePath();};
  ctx.save();ctx.globalAlpha*=0.62;ag_soft(ctx,bell,[214,224,232],[255,255,255],Rw*0.4,-Rh*0.8,Rw*1.1,"rgba(40,70,90,0.35)",18,0.8);ctx.restore();
  // the four rings inside, and the net of nerve cells
  for(let k=0;k<4;k++){const a=k/4*TAU+0.4;ctx.strokeStyle="rgba(214,170,190,0.6)";ctx.lineWidth=9;ctx.beginPath();ctx.ellipse(Math.cos(a)*Rw*0.26,-Rh*0.34+Math.sin(a)*Rh*0.12,Rw*0.11,Rh*0.09,a,0.4,TAU-0.4);ctx.stroke();}
  const net=o.net||0;if(net>0){ctx.save();ctx.globalAlpha*=net;const R=ag_rnd(600);ctx.strokeStyle=rgba(BB.spark,0.85);ctx.lineWidth=2.2;ctx.shadowColor=rgba(BB.spark,0.9);ctx.shadowBlur=10;
    ctx.beginPath();ctx.ellipse(0,-2,Rw*0.92,10,0,Math.PI,TAU);ctx.stroke();
    const pts=[];for(let i=0;i<30;i++){const a=Math.PI+R()*Math.PI,d=0.25+R()*0.68;pts.push([Math.cos(a)*Rw*d,-2+Math.sin(a)*Rh*d*0.92]);}
    pts.forEach((q,i)=>{const n=pts.map((r,j)=>[Math.hypot(r[0]-q[0],r[1]-q[1]),j]).filter(z=>z[1]!==i).sort((a2,b2)=>a2[0]-b2[0]);for(let k=0;k<2;k++){const r=pts[n[k][1]];ctx.beginPath();ctx.moveTo(q[0],q[1]);ctx.lineTo(r[0],r[1]);ctx.stroke();}});
    ctx.fillStyle=rgba(BB.spark,1);pts.forEach(q=>{ctx.beginPath();ctx.arc(q[0],q[1],3.6,0,TAU);ctx.fill();});
    // a signal running round the net with each pulse
    const run=(ph/TAU)%1;bb_spark(ctx,Math.cos(Math.PI+run*Math.PI)*Rw*0.92,-2+Math.sin(Math.PI+run*Math.PI)*10,18,0.9);ctx.restore();}
  ctx.restore();}

// a sea slug (Aplysia), from the side, facing left: a soft body, two wing-like flaps along its back, two rolled tentacles on its head;
// s its size (1: about 540 px long); its flaps ripple with t
function bb_slug(ctx,x,y,s,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const col=[124,100,74],dk=mix(col,[30,20,14],0.45),hi=mix(col,[240,226,200],0.45),w=Math.sin(t*1.6)*6;
  ag_floorShadow(ctx,10,4,260,20,0.35);
  const body=c=>{c.moveTo(270,0);c.bezierCurveTo(250,-60,170,-120,60,-130);c.bezierCurveTo(-40,-136,-120,-110,-170,-80);c.bezierCurveTo(-210,-60,-250,-56,-266,-30);c.bezierCurveTo(-276,-10,-262,0,-240,0);c.closePath();};
  ag_soft(ctx,body,col,hi,40,-140,280,rgba(dk,0.5),20,0.55);
  // the flaps, rippling
  ag_soft(ctx,c=>{c.moveTo(-60,-120);c.bezierCurveTo(-40,-200+w,40,-226-w,110,-206+w);c.bezierCurveTo(170,-190,210,-160,220,-90);c.bezierCurveTo(160,-120,60,-130,-60,-120);c.closePath();},mix(col,dk,0.2),hi,80,-210,160,rgba(dk,0.5),14,0.5);
  ag_soft(ctx,c=>{c.moveTo(-30,-122);c.bezierCurveTo(0,-176-w,70,-196+w,130,-182-w);c.bezierCurveTo(176,-170,200,-140,204,-100);c.bezierCurveTo(150,-124,60,-130,-30,-122);c.closePath();},mix(col,hi,0.15),hi,100,-190,140,rgba(dk,0.4),10,0.5);
  // the head's rolled tentacles and the flat ones at the front
  for(const [bx,tx,ty] of [[-196,-170,-170],[-176,-136,-176]])bb_strand(ctx,bb_smooth([[bx,-76],[bx+4,-120],[tx,ty]],6),20,8,rgba(mix(col,dk,0.15),1),1);
  ag_soft(ctx,c=>{c.moveTo(-250,-40);c.bezierCurveTo(-300,-60,-330,-40,-320,-14);c.bezierCurveTo(-300,-6,-270,-14,-250,-20);c.closePath();},mix(col,dk,0.1),hi,-300,-50,50,rgba(dk,0.4),8,0.5);
  // pale spots
  const R=ag_rnd(9);ctx.save();ctx.beginPath();body(ctx);ctx.clip();for(let i=0;i<30;i++){ctx.fillStyle="rgba(236,226,206,"+(0.2+R()*0.25)+")";ctx.beginPath();ctx.ellipse(-240+R()*500,-120+R()*110,3+R()*7,2+R()*4,R()*3,0,TAU);ctx.fill();}ctx.restore();
  ctx.fillStyle="#1d1614";ctx.beginPath();ctx.arc(-190,-70,4,0,TAU);ctx.fill();ctx.restore();}
// big nerve cells, as a magnifier shows them: a few large round bodies and their fibres, on a pale ground
function bb_bigCells(ctx,cx,cy,r,u){bb_lens(ctx,cx,cy,r,c=>{const g=c.createRadialGradient(cx+r*0.3,cy-r*0.3,10,cx,cy,r);g.addColorStop(0,"rgb(240,230,206)");g.addColorStop(1,"rgb(206,190,160)");c.fillStyle=g;c.fillRect(cx-r,cy-r,r*2,r*2);
    for(const [dx,dy,rr0,sd] of [[-50,-30,64,1],[70,40,48,2],[-10,90,36,3],[90,-80,30,4]]){const k=ag_in(u,0.1*sd,0.4);if(k<=0)continue;const cl=bb_cell(500+sd,{x:cx+dx,y:cy+dy,r:rr0,reach:rr0*2.4,dirs:5,depth:2,wig:0.4,axon:{ang:sd,len:rr0*4,ends:2,endLen:30},axW:rr0*0.3});
      bb_drawCell(c,cl,{u:k,col:[214,170,110]});}},{rim:16});}

AG_PLACES.bbMeadow=c=>{const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba([196,212,214],1));g.addColorStop(0.42,rgba([214,214,180],1));g.addColorStop(1,rgba([120,138,80],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // a soft meadow far behind: blurred grasses and flowers
  // drawn sharp on a small canvas, then blurred once (a blur on each stroke took seconds)
  const cv=mkCanvas(960,540),x=cv.getContext("2d");const R=ag_rnd(23);
  for(let i=0;i<220;i++){const px=R()*960,py=200+R()*340,h=30+R()*80;x.strokeStyle=rgba(mix([110,140,70],[190,190,110],R()),0.5);x.lineWidth=2;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+(R()-0.5)*20,py-h/2,px+(R()-0.5)*30,py-h);x.stroke();}
  for(let i=0;i<90;i++){const px=R()*960,py=230+R()*300,r=3+R()*7,col=[[226,170,200],[240,236,226],[200,150,210],[240,200,110]][(R()*4)|0];x.fillStyle=rgba(col,0.75);x.beginPath();x.arc(px,py,r,0,TAU);x.fill();}
  const cb=mkCanvas(960,540),xb=cb.getContext("2d");xb.filter="blur(6px)";xb.drawImage(cv,0,0);xb.filter="none";c.drawImage(cb,0,0,W,H);
  // the flower in front, where the bee lands: a stem from the bottom, leaves, a wide head of petals
  bb_strand(c,bb_smooth([[860,1090],[870,900],[880,760],[884,640]],6),22,14,rgba([92,122,64],1),1);
  ag_soft(c,cc=>{cc.moveTo(874,860);cc.bezierCurveTo(780,800,700,820,660,860);cc.bezierCurveTo(740,880,820,880,874,880);cc.closePath();},[104,136,70],[170,196,120],760,820,120,"rgba(20,40,10,0.4)",8,0.5);
  bb_flower(c,890,620,1.25);ag_grain(c,0,0,W,H,1.2,47);};
// a flower head, seen a little from the side: rings of pink petals round a domed golden centre
function bb_flower(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);for(let ring=0;ring<2;ring++)for(let i=0;i<14;i++){const a=i/14*TAU+ring*0.22,len=ring?120:140;c.save();c.scale(1,0.42);c.rotate(a);
    ag_soft(c,cc=>{cc.moveTo(10,-14);cc.bezierCurveTo(60,-30,len,-22,len+6,0);cc.bezierCurveTo(len,22,60,30,10,14);cc.closePath();},ring?[226,150,186]:[214,132,172],[250,214,232],len*0.6,-20,90,"rgba(90,30,60,0.3)",6,0.6);c.restore();}
  ag_soft(c,cc=>cc.ellipse(0,-10,62,40,0,0,TAU),[176,112,48],[240,196,110],18,-34,70,"rgba(60,30,10,0.45)",10,0.7);
  const R=ag_rnd(4);c.fillStyle="rgba(250,220,140,0.6)";for(let i=0;i<60;i++){const a=R()*TAU,d=Math.sqrt(R());c.beginPath();c.arc(Math.cos(a)*56*d,-10+Math.sin(a)*34*d,2.2,0,TAU);c.fill();}c.restore();}
// a honeybee from the side, facing left: head, furry thorax, banded abdomen, wings (fluttering when o.fly), six legs; s its size (1: 300 px)
function bb_bee(ctx,x,y,s,t,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);if(o.flip)ctx.scale(-1,1);const gold=[204,150,66],brown=[70,48,32],fuzz=[188,140,82];
  // legs, under everything
  ctx.strokeStyle=rgba(brown,1);ctx.lineCap="round";ctx.lineJoin="round";for(const [sx,ex,ey,w] of [[-30,-60,60,5],[0,-6,66,5],[26,70,64,6]]){ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(sx,30);ctx.lineTo((sx+ex)/2+(ex>sx?8:-8),48);ctx.lineTo(ex,ey);ctx.stroke();}
  ag_soft(ctx,c=>c.ellipse(62,56,12,9,0.3,0,TAU),[226,160,60],[250,210,120],66,50,14,null);
  // the abdomen, banded
  const ab=c=>c.ellipse(96,8,96,62,0.22,0,TAU);ag_soft(ctx,ab,gold,[250,214,140],110,-30,120,"rgba(60,30,10,0.45)",14,0.6);
  ctx.save();ag_shape(ctx,ab);ctx.clip();ctx.fillStyle=rgba(brown,0.92);for(let k=0;k<4;k++){ctx.save();ctx.translate(72+k*34,8);ctx.rotate(0.22);ctx.beginPath();ctx.ellipse(0,0,13,70,0,0,TAU);ctx.fill();ctx.restore();}
  const sh=ctx.createLinearGradient(0,-60,0,70);sh.addColorStop(0,"rgba(255,240,210,0.25)");sh.addColorStop(1,"rgba(40,20,10,0.3)");ctx.fillStyle=sh;ctx.fillRect(0,-70,200,140);ctx.restore();
  // the thorax, furry
  ag_soft(ctx,c=>c.arc(-6,-6,58,0,TAU),fuzz,[236,200,150],10,-40,70,"rgba(60,30,10,0.45)",12,0.6);
  const R=ag_rnd(5);ctx.strokeStyle="rgba(240,214,170,0.55)";ctx.lineWidth=1.6;for(let i=0;i<70;i++){const a=R()*TAU,r=50+R()*10;ctx.beginPath();ctx.moveTo(-6+Math.cos(a)*r*0.86,-6+Math.sin(a)*r*0.86);ctx.lineTo(-6+Math.cos(a)*(r+6),-6+Math.sin(a)*(r+6));ctx.stroke();}
  // the head: a big dark eye, the antenna, the mouth
  ag_soft(ctx,c=>c.ellipse(-94,0,40,46,0,0,TAU),[110,76,46],[190,150,100],-80,-20,40,"rgba(30,16,8,0.45)",8,0.6);
  ag_soft(ctx,c=>c.ellipse(-90,-10,22,32,0.1,0,TAU),[40,34,32],[120,110,110],-84,-24,18,null,0,0.7);
  ctx.strokeStyle=rgba(brown,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-112,-36);ctx.lineTo(-138,-92);ctx.lineTo(-176,-74);ctx.stroke();
  ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-118,34);ctx.lineTo(-128,54);ctx.stroke();
  // wings: at rest along the back, or a blur of beating
  const fly=o.fly||0,beat=Math.sin(t*90)*fly;ctx.save();ctx.globalAlpha*=lerp(0.6,0.35,fly);
  for(const [len,wd,ang] of [[150,44,-0.32],[110,32,-0.18]]){ctx.save();ctx.translate(-10,-56);ctx.rotate(ang-0.9*fly+beat*0.5);ctx.fillStyle="rgba(236,240,244,0.9)";ctx.beginPath();ctx.ellipse(len/2,0,len/2,wd/2,0,0,TAU);ctx.fill();
    ctx.strokeStyle="rgba(90,80,70,0.5)";ctx.lineWidth=1.4;ctx.stroke();ctx.beginPath();ctx.moveTo(6,0);ctx.lineTo(len*0.9,-2);ctx.moveTo(len*0.3,-wd*0.3);ctx.lineTo(len*0.7,wd*0.2);ctx.stroke();ctx.restore();}
  ctx.restore();ctx.restore();}
// a sesame seed and a bee's brain, side by side on a card, at the same scale
function bb_seedBrain(ctx,x,y,a,k){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_about(ctx,x+260,y+150,lerp(0.6,1,clamp(k==null?1:k,0,1.2)));ag_box(ctx,x,y,520,300,22,{});
  ctx.save();ctx.translate(x+150,y+130);ctx.rotate(-0.5);ag_soft(ctx,c=>{c.moveTo(0,-70);c.bezierCurveTo(46,-60,52,30,0,74);c.bezierCurveTo(-52,30,-46,-60,0,-70);c.closePath();},[232,214,176],[255,248,230],14,-30,70,"rgba(80,60,30,0.35)",8,0.6);ctx.restore();
  ctx.save();ctx.translate(x+386,y+132);ctx.scale(0.62,0.62);ctx.translate(-385,-128);
  ag_soft(ctx,c=>{c.moveTo(390,130);c.bezierCurveTo(360,80,300,90,300,128);c.bezierCurveTo(300,160,350,170,384,150);c.bezierCurveTo(420,170,470,160,470,128);c.bezierCurveTo(470,90,410,80,390,130);c.closePath();},[222,170,160],[250,222,214],420,96,90,"rgba(90,40,40,0.35)",8,0.6);ctx.restore();
  ag_T(ctx,"A sesame seed",x+150,y+262,{w:700,size:28,align:"center"});ag_T(ctx,"A bee's brain",x+386,y+262,{w:700,size:28,align:"center"});ctx.restore();}

// a honeycomb seen from above, kept small: its wax cells, some capped; the dance is drawn in a round view of it
function bb_combTex(){return ag_kept("bb:comb",760,760,(c,w,h)=>{c.fillStyle=rgba([150,104,40],1);c.fillRect(0,0,w,h);const r=40,hw=r*Math.sqrt(3);
  for(let row=-1;row<h/(r*1.5)+1;row++)for(let col=-1;col<w/hw+1;col++){const cx=col*hw+(row%2?hw/2:0),cy=row*r*1.5,capped=AG_NZ.fbm(cx*0.004,cy*0.004,2)>0.56;
    c.beginPath();for(let k=0;k<6;k++){const a=Math.PI/6+k*Math.PI/3;c.lineTo(cx+Math.cos(a)*r*0.92,cy+Math.sin(a)*r*0.92);}c.closePath();
    const g=c.createRadialGradient(cx+8,cy-10,2,cx,cy,r);if(capped){g.addColorStop(0,"rgb(240,214,150)");g.addColorStop(1,"rgb(206,168,96)");}else{g.addColorStop(0,"rgb(120,74,26)");g.addColorStop(0.7,"rgb(176,120,48)");g.addColorStop(1,"rgb(216,168,92)");}
    c.fillStyle=g;c.fill();c.strokeStyle="rgba(250,226,170,0.5)";c.lineWidth=3;c.stroke();}
  const v=c.createRadialGradient(w*0.62,h*0.3,60,w/2,h/2,w*0.7);v.addColorStop(0,"rgba(255,240,200,0.12)");v.addColorStop(1,"rgba(40,20,0,0.35)");c.fillStyle=v;c.fillRect(0,0,w,h);ag_grain(c,0,0,w,h,1.4,49);});}
// the dance in a round view over the meadow: the comb, the dancer and three bees following it; p the dance's phase (4 a figure of eight)
function bb_combView(ctx,cx,cy,r,p,t,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;bb_lens(ctx,cx,cy,r,c=>{c.drawImage(bb_combTex(),cx-r,cy-r,r*2,r*2);
    const th=-1.05,len=r*0.62;c.save();c.setLineDash([3,12]);c.lineCap="round";c.strokeStyle="rgba(255,244,214,0.65)";c.lineWidth=4;c.beginPath();for(let k=0;k<=120;k++){const q=bb_dance(k/30,cx,cy,len,th);k?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y);}c.stroke();c.restore();
    const d=bb_dance(p,cx,cy,len,th);[[-1.2,0.5],[1.9,0.62],[3.6,0.55]].forEach(([off,dd],i)=>{const q=bb_dance(p-0.35-i*0.12,cx,cy,len,th),bx=q.x+Math.cos(off+t*0.2)*r*0.2*dd,by=q.y+Math.sin(off+t*0.2)*r*0.2*dd;
      bb_beeTop(c,bx,by,0.62,Math.atan2(d.y-by,d.x-bx),{});});
    bb_beeTop(c,d.x,d.y,0.68,d.ang,{wag:d.wag});},{rim:18});ctx.restore();}
// a honeybee from above, heading ang (radians, 0 to the right); o.wag shakes its abdomen side to side, as in the dance
function bb_beeTop(ctx,x,y,s,ang,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);const gold=[204,150,66],brown=[70,48,32];
  ag_floorShadow(ctx,-8,6,70,26,0.3);ctx.save();ctx.rotate(o.wag||0);
  ag_soft(ctx,c=>c.ellipse(-52,0,52,30,0,0,TAU),gold,[250,214,140],-40,-16,50,"rgba(60,30,10,0.4)",8,0.6);ctx.save();ctx.beginPath();ctx.ellipse(-52,0,52,30,0,0,TAU);ctx.clip();ctx.fillStyle=rgba(brown,0.9);for(let k=0;k<4;k++)ctx.fillRect(-92+k*20,-40,9,80);ctx.restore();ctx.restore();
  ag_soft(ctx,c=>c.arc(4,0,26,0,TAU),[188,140,82],[236,200,150],12,-12,30,"rgba(60,30,10,0.4)",6,0.6);
  ag_soft(ctx,c=>c.ellipse(38,0,16,20,0,0,TAU),[90,62,40],[170,130,90],44,-8,16,null);
  ctx.strokeStyle=rgba(brown,1);ctx.lineWidth=2.6;ctx.lineCap="round";for(const k of [-1,1]){ctx.beginPath();ctx.moveTo(50,k*8);ctx.lineTo(70,k*18);ctx.lineTo(84,k*12);ctx.stroke();for(const lx of [-4,8,18]){ctx.beginPath();ctx.moveTo(lx,k*18);ctx.lineTo(lx-6,k*36);ctx.stroke();}}
  ctx.save();ctx.globalAlpha*=0.55;for(const k of [-1,1]){ctx.fillStyle="rgba(236,240,244,0.9)";ctx.beginPath();ctx.ellipse(-30,k*16,44,14,k*0.14,0,TAU);ctx.fill();}ctx.restore();ctx.restore();}
// the waggle dance: where the dancer is at phase p (one full figure of eight every 4), heading, and how much it waggles
function bb_dance(p,cx,cy,len,th){const q=((p%4)+4)%4,ux=Math.cos(th),uy=Math.sin(th),nx=-uy,ny=ux,A=[cx-ux*len/2,cy-uy*len/2],B=[cx+ux*len/2,cy+uy*len/2];
  if(q<1||(q>=2&&q<3)){const k=q%1;return{x:lerp(A[0],B[0],k),y:lerp(A[1],B[1],k),ang:th,wag:Math.sin(k*TAU*6)*0.35};}
  const side=q<2?1:-1,k=q%1,a=Math.PI*k,r=len/2;// a half loop back from B to A, on one side
  const mx=cx+nx*side*r*0.55,my=cy+ny*side*r*0.55,px=mx+ux*Math.cos(a)*r+nx*side*Math.sin(a)*r*0.6,py=my+uy*Math.cos(a)*r+ny*side*Math.sin(a)*r*0.6;
  const h=Math.atan2(uy*-Math.sin(a)+ny*side*Math.cos(a)*0.6,ux*-Math.sin(a)+nx*side*Math.cos(a)*0.6);return{x:px-nx*side*r*0.55,y:py-ny*side*r*0.55,ang:h,wag:0};}

AG_PLACES.bbReef=c=>{bb_water(c,[136,186,196],[70,128,146],[40,84,100],53);
  const R=ag_rnd(29);for(let i=0;i<12;i++){const x=-100+i*190+R()*80,y=700+R()*160,r=140+R()*130;ag_soft(c,cc=>bb_path(cc,bb_blob(x,y,r,r*0.62,i*0.9,0.22,28)),mix([86,90,92],[120,110,96],R()),[170,176,170],x+r*0.4,y-r*0.6,r*1.4,"rgba(10,20,30,0.45)",14,0.5);}
  for(let i=0;i<26;i++){const x=R()*W,y=640+R()*300;c.fillStyle=rgba(mix([190,120,110],[210,180,120],R()),0.7);for(let k=0;k<6;k++){c.beginPath();c.arc(x+(R()-0.5)*40,y+(R()-0.5)*20,4+R()*8,0,TAU);c.fill();}}
  ag_grain(c,0,0,W,H,1.4,55);};
const BB_OCTO=(()=>{const R=ag_rnd(808),arms=[];for(let i=0;i<8;i++){const a0=Math.PI*(0.08+i*0.12)+(R()-0.5)*0.1,len=360+R()*160,curl=(i%2?1:-1)*(0.8+R()*0.8);arms.push({a0,len,curl,ph:R()*TAU});}return arms;})();
// an octopus on a rock: its mantle, the eyes, eight arms with suckers; o.glow lights the nerve cells (two thirds of them in the arms);
// o.reach (0..1) sends its first arm out to the shell, o.taste (0..1) lights that arm's suckers; s its size
function bb_octoArm(A,x,y,s,t,reach){const P=[[0,0]];let a=A.a0,px=0,py=0;const n=14;for(let j=1;j<=n;j++){const k=j/n;a+=A.curl*0.06*Math.pow(k,1.6)*3+Math.sin(t*0.9+A.ph+j*0.5)*0.04;px+=Math.cos(a)*A.len/n;py+=Math.sin(a)*A.len/n*0.62;P.push([px,py]);}
  if(reach){const tip=[520,-40];P.forEach((q,j)=>{const k=Math.pow(j/n,1.5)*reach;q[0]=lerp(q[0],tip[0]*j/n,k);q[1]=lerp(q[1],tip[1]*j/n,k);});}
  return bb_smooth(P,3).map(q=>[x+q[0]*s,y+q[1]*s]);}
function bb_octopus(ctx,x,y,s,t,o){o=o||{};const col=[160,100,88],dk=mix(col,[40,16,14],0.45),hi=mix(col,[250,226,214],0.45),glow=o.glow||0,taste=o.taste||0;
  const arms=BB_OCTO.map((A,i)=>bb_octoArm(A,x,y,s,t,i===0?o.reach||0:0));
  ag_floorShadow(ctx,x,y+30*s,360*s,40*s,0.35);
  arms.forEach((P,i)=>{bb_strand(ctx,P,62*s,6*s,rgba(mix(col,dk,0.25),1),1);ctx.save();ctx.translate(1.5*s,-2*s);ctx.globalAlpha*=0.5;bb_strand(ctx,P,30*s,3*s,rgba(hi,0.7),1);ctx.restore();
    // suckers along its underside
    for(let k=2;k<16;k++){const u=k/17,q=bb_along(P,u),r=(1-u)*11*s+2*s,nx=-Math.sin(q[2]),ny=Math.cos(q[2]);const lit=i===0?taste*ag_in(u,0.5,0.4):0;
      ctx.fillStyle=rgba(mix([236,206,190],BB.spark,lit),0.9);ctx.beginPath();ctx.arc(q[0]+nx*r*1.4,q[1]+ny*r*1.4,r,0,TAU);ctx.fill();if(lit>0)bb_spark(ctx,q[0]+nx*r*1.4,q[1]+ny*r*1.4,r*3,lit*0.8);}});
  // the mantle, rising up behind the head, and the eyes
  ag_soft(ctx,c=>c.ellipse(x+40*s,y-200*s,130*s,160*s,-0.35,0,TAU),col,hi,x+90*s,y-300*s,220*s,rgba(dk,0.5),20,0.6);
  ag_soft(ctx,c=>c.ellipse(x,y-50*s,130*s,80*s,0,0,TAU),col,hi,x+50*s,y-90*s,140*s,rgba(dk,0.5),16,0.6);
  const R=ag_rnd(31);ctx.fillStyle=rgba(hi,0.35);for(let i=0;i<40;i++){const a=R()*TAU,d=Math.sqrt(R());ctx.beginPath();ctx.arc(x+40*s+Math.cos(a)*110*s*d,y-200*s+Math.sin(a)*140*s*d,(2+R()*4)*s,0,TAU);ctx.fill();}
  for(const ex of [-70,70]){ag_soft(ctx,c=>c.ellipse(x+ex*s,y-96*s,30*s,26*s,0,0,TAU),mix(col,hi,0.3),hi,x+ex*s+8*s,y-108*s,30*s,rgba(dk,0.4),6);
    ctx.fillStyle="#201818";ctx.beginPath();ctx.ellipse(x+ex*s,y-94*s,16*s,6*s,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.7)";ctx.beginPath();ctx.arc(x+ex*s+5*s,y-98*s,3*s,0,TAU);ctx.fill();}
  // its nerve cells: a third in the head, two thirds along the arms
  if(glow>0){ctx.save();ctx.globalAlpha*=glow;const G=ag_rnd(99);for(let i=0;i<26;i++)bb_spark(ctx,x+(G()-0.5)*160*s,y-60*s-G()*100*s,10*s,0.5+0.5*Math.sin(t*3+i));
    arms.forEach((P,i)=>{for(let k=0;k<7;k++){const u=0.1+k*0.12;const q=bb_along(P,u);bb_spark(ctx,q[0],q[1],10*s,0.5+0.5*Math.sin(t*3.4+i+k));}});ctx.restore();}}
// a scallop shell on the reef
function bb_shell(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ag_soft(ctx,c=>{c.moveTo(0,40);c.lineTo(-70,-20);c.bezierCurveTo(-60,-70,60,-70,70,-20);c.closePath();},[226,196,170],[255,240,226],20,-40,70,"rgba(80,50,30,0.35)",8,0.6);
  ctx.strokeStyle="rgba(150,110,80,0.5)";ctx.lineWidth=2;for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(0,36);ctx.lineTo(k*20,-52+Math.abs(k)*6);ctx.stroke();}ctx.restore();}

AG_PLACES.bbBranch=c=>{const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba([184,200,170],1));g.addColorStop(1,rgba([120,140,100],1));c.fillStyle=g;c.fillRect(0,0,W,H);
  const cv=mkCanvas(960,540),x=cv.getContext("2d");const R=ag_rnd(61);for(let i=0;i<70;i++){const px=R()*960,py=R()*540,r=20+R()*50;x.fillStyle=rgba(mix([96,128,80],[214,220,180],R()),0.45);x.beginPath();x.arc(px,py,r,0,TAU);x.fill();}
  const cb=mkCanvas(960,540),xb=cb.getContext("2d");xb.filter="blur(10px)";xb.drawImage(cv,0,0);xb.filter="none";c.drawImage(cb,0,0,W,H);const lg=c.createRadialGradient(1600,200,40,1400,300,1200);lg.addColorStop(0,"rgba(255,248,224,0.35)");lg.addColorStop(1,"rgba(255,248,224,0)");c.fillStyle=lg;c.fillRect(0,0,W,H);
  const P=bb_smooth([[-40,700],[400,640],[860,620],[1300,600],[1980,560]],8);bb_strand(c,P,44,26,rgba([96,74,56],1),1);c.save();c.translate(2,-6);bb_strand(c,P,14,8,"rgba(200,170,130,0.45)",1);c.restore();
  bb_strand(c,bb_smooth([[640,628],[700,560],[790,520]],6),14,6,rgba([96,74,56],1),1);bb_strand(c,bb_smooth([[1500,592],[1560,660],[1640,690]],6),12,5,rgba([96,74,56],1),1);
  for(const [lx,ly,a] of [[790,520,-0.6],[1640,690,0.4],[300,650,2.6]]){c.save();c.translate(lx,ly);c.rotate(a);ag_soft(c,cc=>{cc.moveTo(0,0);cc.bezierCurveTo(30,-30,90,-30,120,0);cc.bezierCurveTo(90,30,30,30,0,0);cc.closePath();},[110,140,80],[180,200,130],70,-14,60,"rgba(20,40,10,0.3)",6,0.5);c.restore();}
  ag_grain(c,0,0,W,H,1.2,63);};
// a zebra finch perched, from the side, facing right: o.young draws the young bird (plain grey-brown, a dark beak); o.open (0..1)
// opens the beak to sing; s its size (1: about 230 px from beak to tail)
function bb_finch(ctx,x,y,s,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);const yg=!!o.young,grey=yg?[150,140,130]:[146,146,152],hi=mix(grey,[255,255,255],0.45),dk=mix(grey,[20,20,24],0.45);
  // the tail, then the body
  ag_soft(ctx,c=>{c.moveTo(-60,10);c.lineTo(-160,52);c.lineTo(-150,70);c.lineTo(-50,34);c.closePath();},yg?mix(grey,dk,0.3):[60,58,60],hi,-110,40,60,null);
  if(!yg){ctx.fillStyle="rgba(240,240,236,0.95)";for(let k=0;k<3;k++){ctx.save();ctx.translate(-80-k*26,30+k*10);ctx.rotate(0.38);ctx.fillRect(-4,-9,8,18);ctx.restore();}}
  const body=c=>{c.moveTo(80,-60);c.bezierCurveTo(60,-90,0,-80,-40,-40);c.bezierCurveTo(-70,-10,-60,40,-20,50);c.bezierCurveTo(30,60,80,30,92,-10);c.bezierCurveTo(98,-30,94,-50,80,-60);c.closePath();};
  ag_soft(ctx,body,grey,hi,30,-60,120,rgba(dk,0.45),14,0.6);
  ctx.save();ctx.beginPath();body(ctx);ctx.clip();ctx.fillStyle=rgba(yg?mix(grey,[236,226,210],0.4):[238,232,220],1);ctx.beginPath();ctx.ellipse(30,40,70,40,-0.2,0,TAU);ctx.fill();
  if(!yg){ctx.fillStyle="rgba(168,94,60,1)";ctx.beginPath();ctx.ellipse(-10,10,44,30,-0.3,0,TAU);ctx.fill();ctx.fillStyle="rgba(250,248,240,0.95)";for(let k=0;k<7;k++){ctx.beginPath();ctx.arc(-34+k*10,2+(k%2)*12,3.2,0,TAU);ctx.fill();}
    ctx.strokeStyle="rgba(30,30,34,0.85)";ctx.lineWidth=3;for(let k=0;k<5;k++){ctx.beginPath();ctx.moveTo(70-k*4,-30+k*9);ctx.quadraticCurveTo(84-k*3,-26+k*9,94-k*2,-30+k*9);ctx.stroke();}ctx.fillStyle="rgba(26,26,30,0.95)";ctx.beginPath();ctx.ellipse(76,14,16,8,-0.5,0,TAU);ctx.fill();}
  ctx.restore();
  // the wing, folded
  ag_soft(ctx,c=>{c.moveTo(40,-50);c.bezierCurveTo(0,-56,-50,-30,-70,10);c.bezierCurveTo(-30,10,20,0,46,-20);c.closePath();},mix(grey,dk,yg?0.25:0.15),hi,10,-46,60,rgba(dk,0.4),8,0.5);
  // the head
  ag_soft(ctx,c=>c.arc(86,-74,36,0,TAU),grey,hi,96,-92,44,rgba(dk,0.45),10,0.6);
  if(!yg){ctx.fillStyle="rgba(222,132,78,1)";ctx.beginPath();ctx.ellipse(92,-62,18,13,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(26,26,30,0.95)";ctx.fillRect(98,-80,4,22);ctx.fillStyle="rgba(250,250,246,0.95)";ctx.fillRect(94,-80,4,22);}
  ctx.fillStyle="#141012";ctx.beginPath();ctx.arc(100,-82,5.5,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.8)";ctx.beginPath();ctx.arc(102,-84,1.8,0,TAU);ctx.fill();
  const op=(o.open||0)*0.32,bc=yg?[40,36,36]:[214,84,52];
  ctx.fillStyle=rgba(bc,1);ctx.save();ctx.translate(116,-76);ctx.rotate(-op);ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(34,0);ctx.lineTo(0,2);ctx.closePath();ctx.fill();ctx.restore();
  ctx.save();ctx.translate(116,-72);ctx.rotate(op);ctx.beginPath();ctx.moveTo(0,-2);ctx.lineTo(30,0);ctx.lineTo(0,9);ctx.closePath();ctx.fill();ctx.restore();
  // the feet, gripping the branch
  ctx.strokeStyle=rgba(yg?[150,120,110]:[214,150,120],1);ctx.lineWidth=4;ctx.lineCap="round";for(const fx of [10,34]){ctx.beginPath();ctx.moveTo(fx,46);ctx.lineTo(fx-4,64);ctx.lineTo(fx+14,70);ctx.stroke();}
  ctx.restore();}
// a song leaving a beak: small arcs going out, one a beat; o.wob makes it uneven (a young bird practising), o.a
function bb_song(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();const dir=o.dir||1,w=o.wob||0,a0=dir>0?0:Math.PI;ctx.strokeStyle=rgba(o.col||BB_INK2,0.85);ctx.lineCap="round";
  for(let i=0;i<5;i++){const ph=((t*1.2+i/5)%1),d=20+ph*170,f=1-ph,jit=w*Math.sin(t*7+i*2.3)*0.5;ctx.lineWidth=3.4*f+1;ctx.globalAlpha=a*f*0.9*(o.alpha==null?1:o.alpha);
    ctx.beginPath();ctx.arc(x,y,d*(1+w*0.25*Math.sin(t*5+i)),a0-0.5+jit,a0+0.5+jit*0.6);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- a dim light bulb, and the brain's own light */
function bb_bulb(ctx,x,y,s,k,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  if(k>0){const g=ctx.createRadialGradient(0,0,10,0,0,260);g.addColorStop(0,rgba([255,214,150],0.55*k));g.addColorStop(1,rgba([255,214,150],0));ctx.fillStyle=g;ctx.fillRect(-260,-260,520,520);}
  ag_soft(ctx,c=>ag_rect(c,-34,96,68,74,10),BB.brass,BB.brassHi,20,110,50,"rgba(60,40,10,0.45)",5);ctx.strokeStyle="rgba(90,66,30,0.6)";ctx.lineWidth=3;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-34,110+i*14);ctx.lineTo(34,104+i*14);ctx.stroke();}
  ctx.fillStyle="rgba(40,36,34,1)";rr(ctx,-14,168,28,16,6);ctx.fill();
  const glass=c=>{c.moveTo(-30,98);c.bezierCurveTo(-40,70,-110,30,-110,-40);c.bezierCurveTo(-110,-110,-60,-150,0,-150);c.bezierCurveTo(60,-150,110,-110,110,-40);c.bezierCurveTo(110,30,40,70,30,98);c.closePath();};
  ctx.save();ctx.globalAlpha*=0.5;ag_soft(ctx,glass,mix([226,230,232],[255,226,170],k*0.6),[255,255,255],40,-100,120,"rgba(60,60,70,0.25)",10,0.8);ctx.restore();
  ctx.strokeStyle="rgba(120,110,100,0.8)";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-14,96);ctx.lineTo(-20,-10);ctx.moveTo(14,96);ctx.lineTo(20,-10);ctx.stroke();
  ctx.strokeStyle=rgba(mix([120,90,60],[255,220,150],k),1);ctx.lineWidth=3;ctx.shadowColor=rgba([255,200,120],0.9*k);ctx.shadowBlur=18*k;ctx.beginPath();ctx.moveTo(-20,-10);for(let i=1;i<=8;i++)ctx.lineTo(-20+i*5,-10+(i%2?-14:0));ctx.stroke();
  ctx.restore();}
// the brain at work: points of light that come and go over it, and a few links lit between them
function bb_brainLights(ctx,t,a){if(a<=0)return;const B=BB_BRAIN;ctx.save();ctx.globalAlpha*=a;ctx.beginPath();bb_brainPath(ctx,B.cx,B.cy,B.s);ctx.clip();const R=ag_rnd(86),P=[];
  for(let i=0;i<70;i++)P.push([B.cx+(R()-0.5)*640*B.s,B.cy+(R()-0.62)*420*B.s,R()*TAU,0.6+R()*1.4]);
  ctx.strokeStyle=rgba(BB.spark,0.35);ctx.lineWidth=1.6;P.forEach((p,i)=>{const q=P[(i*7+3)%P.length],k=0.5+0.5*Math.sin(t*p[3]+p[2]);if(k<0.6)return;ctx.globalAlpha=a*(k-0.6)*2;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();});
  ctx.globalAlpha=a;P.forEach(p=>{const k=0.5+0.5*Math.sin(t*p[3]+p[2]);bb_spark(ctx,p[0],p[1],10+8*k,0.3+0.6*k);});ctx.restore();}

/* ---------------------------------------------------------------- the eye, cut in half, and its blind spot
   On paper, as an anatomy book draws it: light comes in from the left through the clear front and the lens, and lands on the lining at
   the back, the layer of cells that catch it; at the back, a little below the middle, the nerve leaves for the brain, and there the
   lining has a hole: the blind spot. */
const BB_EYEA={cx:860,cy:470,r:300,lens:[600,470],nerve:0.28};   // the nerve leaves at this angle below the back's middle
AG_PLACES.bbEye=c=>{bb_bareSheet(c);const E=BB_EYEA,cx=E.cx,cy=E.cy,r=E.r,na=E.nerve;
  // the nerve, leaving at the back for the brain, off the right edge
  const nx=cx+Math.cos(na)*r,ny=cy+Math.sin(na)*r;ag_soft(c,cc=>{cc.moveTo(nx-10,ny-46);cc.bezierCurveTo(nx+160,ny-60,nx+300,ny-20,1620,ny+40);cc.lineTo(1620,ny+130);cc.bezierCurveTo(nx+300,ny+80,nx+160,ny+56,nx-10,ny+46);cc.closePath();},[226,208,168],[250,240,214],nx+200,ny-40,260,"rgba(90,70,40,0.35)",10,0.6);
  c.strokeStyle="rgba(150,126,90,0.45)";c.lineWidth=2;for(let k=-3;k<=3;k++){c.beginPath();c.moveTo(nx,ny+k*12);c.bezierCurveTo(nx+160,ny-4+k*14,nx+300,ny+30+k*14,1620,ny+86+k*14);c.stroke();}
  // the white wall of the eye, and the clear bulge at the front
  ag_soft(c,cc=>cc.arc(cx,cy,r,0,TAU),[244,240,232],[255,255,255],cx+120,cy-160,r*1.3,"rgba(80,70,60,0.3)",16,0.6);
  ag_soft(c,cc=>{cc.moveTo(cx-r*0.86,cy-r*0.5);cc.bezierCurveTo(cx-r*1.22,cy-r*0.3,cx-r*1.22,cy+r*0.3,cx-r*0.86,cy+r*0.5);cc.closePath();},[226,236,240],[255,255,255],cx-r*1.05,cy-r*0.2,120,"rgba(60,80,90,0.2)",8,0.7);
  // inside: the dark layer, then the lining of cells that catch light, except where the nerve leaves
  const ring=(rad,col,w,a0,a1)=>{c.strokeStyle=rgba(col,1);c.lineWidth=w;c.beginPath();c.arc(cx,cy,rad,a0,a1);c.stroke();};
  ring(r-14,[150,84,70],12,-2.36,2.36);
  ring(r-30,[226,150,124],18,-2.3,na-0.07);ring(r-30,[226,150,124],18,na+0.07,2.3);
  c.fillStyle="rgba(250,246,240,0.92)";c.beginPath();c.arc(cx,cy,r-40,0,TAU);c.fill();
  // the iris and the lens
  for(const k of [-1,1])ag_soft(c,cc=>ag_rect(cc,E.lens[0]-28,cy+k*80-(k<0?60:0),18,60,6),[120,86,60],[180,140,100],E.lens[0]-20,cy+k*90,40,null);
  ag_soft(c,cc=>cc.ellipse(E.lens[0],E.lens[1],40,96,0,0,TAU),[214,226,232],[255,255,255],E.lens[0]+10,E.lens[1]-40,70,"rgba(60,80,100,0.3)",8,0.7);
  ag_grain(c,0,0,W,H,1,71);};
function bb_bareSheet(c){const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba(mix(BB.walnut,[20,12,6],0.15),1));g.addColorStop(1,rgba(mix(BB.walnut,[255,230,200],0.08),1));c.fillStyle=g;c.fillRect(0,0,W,H);
  ag_grain(c,0,0,W,H,2,7);bb_paper(c,40,40,1840,1000);
  const lg=c.createRadialGradient(1800,60,40,1500,200,1500);lg.addColorStop(0,"rgba(255,244,220,0.3)");lg.addColorStop(1,"rgba(255,244,220,0)");c.fillStyle=lg;c.fillRect(0,0,W,H);}
// light from a thing on the left, through the lens, onto the lining at the back; o.u draws it on; o.blind lights the ray that lands
// where the nerve leaves, which nothing catches
function bb_eyeLight(ctx,t,o){o=o||{};const E=BB_EYEA,u=o.u||0;if(u<=0)return;const L=E.lens,back=a=>[E.cx+Math.cos(a)*(E.r-30),E.cy+Math.sin(a)*(E.r-30)];
  const src=[[180,380],[180,560]],to=[back(-0.06),back(0.06)];ctx.save();ctx.lineCap="round";
  src.forEach((s0,i)=>{for(const dy of [-60,0,60]){const mid=[L[0],L[1]+dy],P=[s0,mid,to[1-i]];const len=bb_smooth(P,1);ctx.strokeStyle=rgba([226,170,60],0.7);ctx.lineWidth=3;ctx.beginPath();const S=bb_sub(len,0,u);if(S.length>1){bb_path(ctx,S,false);ctx.stroke();}}});
  if(u>=1)to.forEach(q=>bb_spark(ctx,q[0],q[1],20,0.8));
  const bl=o.blind||0;if(bl>0){const q=back(E.nerve),P=[[180,700],[L[0],L[1]+30],q],S=bb_sub(P,0,bl);ctx.strokeStyle=rgba([226,170,60],0.7);ctx.lineWidth=3;if(S.length>1){ctx.beginPath();bb_path(ctx,S,false);ctx.stroke();}
    if(bl>=1){ctx.strokeStyle=rgba(BB.ink,0.75);ctx.lineWidth=4;ctx.setLineDash([8,8]);ctx.beginPath();ctx.arc(q[0],q[1],30,0,TAU);ctx.stroke();ctx.setLineDash([]);}}
  ctx.restore();}
// a small candle flame on the left, the thing the eye looks at
function bb_flame(ctx,x,y,s,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ag_soft(ctx,c=>ag_rect(c,-18,0,36,120,6),[240,232,214],[255,255,255],10,10,40,"rgba(80,70,50,0.3)",6);
  const f=1+0.06*Math.sin(t*9)+0.04*Math.sin(t*13.7);ctx.save();ctx.scale(1,f);const g=ctx.createRadialGradient(0,-30,2,0,-24,40);g.addColorStop(0,"rgba(255,250,220,1)");g.addColorStop(0.5,"rgba(250,200,100,0.9)");g.addColorStop(1,"rgba(230,140,60,0)");
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,-74);ctx.bezierCurveTo(22,-40,20,-8,0,-2);ctx.bezierCurveTo(-20,-8,-22,-40,0,-74);ctx.fill();ctx.restore();ctx.restore();}

// a patterned cloth: stripes and a band across, and a hole where the blind spot falls; o.fill (0..1) fills the hole from round it
function bb_cloth(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(46,34,20,0.3)";ctx.shadowBlur=22;ctx.shadowOffsetX=-6;ctx.shadowOffsetY=10;ctx.fillStyle="rgb(238,228,206)";ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const sw=46;for(let i=0;i*sw<w+sw;i++)if(i%2){ctx.fillStyle="rgba(120,74,58,0.86)";ctx.fillRect(x+i*sw,y,sw,h);}
  ctx.fillStyle="rgba(46,60,72,0.9)";ctx.fillRect(x,y+h/2-30,w,60);ag_grain(ctx,x,y,w,h,1.5,73);
  const f=o.fill||0,hx=x+w/2+sw/2,hy=y+h/2,hr=o.r||90;if(f<1){ctx.fillStyle="rgba(30,28,28,0.95)";ctx.beginPath();ctx.arc(hx,hy,hr*(1-ag_sine(f)),0,TAU);ctx.fill();}
  ctx.restore();ctx.restore();}
