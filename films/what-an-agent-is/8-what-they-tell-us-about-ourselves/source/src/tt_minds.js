/* ===== What they tell us about ourselves: the pictures that carry the ideas =====
   Drawn live, in the frame's coordinates (1920 x 1080), each a function of where it stands, its size and how far it has come (0 to 1).
   Living things (the ear's spiral, the brain, a neuron, the worm, the fly) are warm and matte, drawn with tapering curves, weight and
   light; the copies (the implant's wire, the perceptron, the network, the worm on a screen, the fly's model) are blue lines, so the
   original and the copy are never confused. What it feels like (Rod hearing, Margaret's voice reaching him) is the window's warm light,
   which belongs to no colour that means something. */

const TT_WARM=[255,226,178],TT_TISSUE=[226,184,170],TT_BONE=[232,224,210];
// a tapering line through points [[x, y], ...], from width w0 to w1, filled (part of nothing else: it begins its own path)
function tt_taper(ctx,pts,w0,w1,fill){const n=pts.length;if(n<2)return;const L=[],R=[];
  for(let i=0;i<n;i++){const p=pts[i],q=pts[Math.min(n-1,i+1)],o=pts[Math.max(0,i-1)],dx=q[0]-o[0],dy=q[1]-o[1],d=Math.hypot(dx,dy)||1,w=lerp(w0,w1,i/(n-1))/2;
    L.push([p[0]-dy/d*w,p[1]+dx/d*w]);R.push([p[0]+dy/d*w,p[1]-dx/d*w]);}
  ctx.beginPath();ctx.moveTo(L[0][0],L[0][1]);for(let i=1;i<n;i++)ctx.lineTo(L[i][0],L[i][1]);const e=pts[n-1],a=Math.atan2(e[1]-pts[n-2][1],e[0]-pts[n-2][0]);
  ctx.arc(e[0],e[1],Math.max(0.3,w1/2),a-Math.PI/2,a+Math.PI/2);for(let i=n-1;i>=0;i--)ctx.lineTo(R[i][0],R[i][1]);const s0=pts[0],b=Math.atan2(pts[1][1]-s0[1],pts[1][0]-s0[0]);
  ctx.arc(s0[0],s0[1],w0/2,b+Math.PI/2,b+Math.PI*1.5);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}}
// points along a cubic [x0,y0, x1,y1, x2,y2, x3,y3] from u0 to u1
function tt_bzPts(p,u0,u1,n){const out=[];n=n||16;for(let k=0;k<=n;k++)out.push(ag_bz(p,lerp(u0,u1,k/n)));return out;}
// the window's warm light: a soft glow at (x, y), radius r
function tt_glow(ctx,x,y,r,a,col){if(a<=0)return;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col||TT_WARM,0.55*a));g.addColorStop(0.45,rgba(col||TT_WARM,0.22*a));g.addColorStop(1,rgba(col||TT_WARM,0));
  ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}

/* ---------------------------------------------------------------- the living room's sounds, and the voices */
// soft waves of sound from a source at (x, y) towards dir (radians): three short arcs close together, moving out and fading,
// so they never reach Rod; o.per the beat, o.gap the space between arcs
function tt_rings(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const per=o.per||1.2,gap=o.gap||30,n=3,dir=o.dir||0,sp=o.spread||1.0,col=o.col||[176,132,84],r0=o.r0||22;
  const u=((t/per)%1+1)%1;ctx.save();ctx.lineCap="round";ctx.shadowColor=rgba([255,226,170],0.7);ctx.shadowBlur=8;
  for(let k=0;k<n;k++){const v=k+u,r=r0+v*gap,al=a*clamp(v,0,1)*clamp(n-v,0,1)*(o.k||0.85);if(al<=0.01)continue;
    ctx.strokeStyle=rgba(col,al);ctx.lineWidth=lerp(5,3,v/n);ctx.beginPath();ctx.arc(x,y,r,dir-sp/2,dir+sp/2);ctx.stroke();}ctx.restore();}
// the kettle on the stove, base at (x, y); o.steam 0 to 1
function tt_kettle(ctx,x,y,t,o){o=o||{};ctx.save();ag_floorShadow(ctx,x,y,46,7,0.3);
  ag_soft(ctx,cc=>{cc.moveTo(x-40,y);cc.bezierCurveTo(x-46,y-30,x-34,y-62,x,y-64);cc.bezierCurveTo(x+34,y-62,x+46,y-30,x+40,y);cc.closePath();},[196,196,190],[250,250,246],x+14,y-46,50,"rgba(40,40,40,0.35)",8);
  ctx.strokeStyle="#9C9A94";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+36,y-24);ctx.quadraticCurveTo(x+60,y-40,x+66,y-58);ctx.stroke();
  ctx.strokeStyle="#3E3B36";ctx.lineWidth=8;ctx.beginPath();ctx.arc(x,y-62,30,Math.PI*1.12,Math.PI*1.88);ctx.stroke();
  const st=o.steam||0;if(st>0){for(let i=0;i<4;i++){const u=((t*0.5+i/4)%1),sx=x+66+Math.sin(t*1.7+i)*6+u*20,sy=y-60-u*90;ctx.fillStyle=rgba([250,248,244],st*0.5*(1-u)*Math.min(1,u*4));ctx.beginPath();ctx.ellipse(sx,sy,8+u*14,6+u*10,0,0,TAU);ctx.fill();}}
  ctx.restore();}
// the telephone on its table, base at (x, y); o.ring 0 to 1 shakes it a little
function tt_phone(ctx,x,y,t,o){o=o||{};const rg=o.ring||0,sh=rg*Math.sin(t*46)*0.03*(Math.sin(t*5.3)>0?1:0.2);ctx.save();ctx.translate(x,y);ctx.rotate(sh);ag_floorShadow(ctx,0,0,62,8,0.3);
  ag_soft(ctx,cc=>{cc.moveTo(-58,0);cc.lineTo(-44,-50);cc.lineTo(44,-50);cc.lineTo(58,0);cc.closePath();},[164,150,112],[214,202,166],20,-40,60,"rgba(40,30,20,0.35)",8);
  ctx.fillStyle="#E9E3D2";ctx.beginPath();ctx.arc(0,-24,19,0,TAU);ctx.fill();ctx.fillStyle="rgba(90,80,60,0.5)";for(let i=0;i<10;i++){const a=-Math.PI*0.2+i*0.52;ctx.beginPath();ctx.arc(Math.cos(a)*12,-24+Math.sin(a)*12,2.6,0,TAU);ctx.fill();}
  ag_soft(ctx,cc=>{cc.moveTo(-64,-50);cc.bezierCurveTo(-70,-70,-50,-78,-34,-66);cc.lineTo(34,-66);cc.bezierCurveTo(50,-78,70,-70,64,-50);cc.lineTo(42,-52);cc.lineTo(-42,-52);cc.closePath();},[150,136,100],[206,192,154],10,-70,70,"rgba(40,30,20,0.3)",6);
  ctx.restore();}
// a speech bubble from (x, y) to (x + w, y + h), its tail to (tx, ty); o.fill 0 (an empty outline) to 1 (soft lines of words), o.k springs it
function tt_bubble(ctx,x,y,w,h,tx,ty,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const f=clamp(o.fill||0,0,1),r=Math.min(h/2,28),cx=x+w/2;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,tx,ty,lerp(0.6,1,o.k));
  const bx=clamp(tx,x+r+20,x+w-r-20),side=ty>y+h?1:-1,ey=side>0?y+h:y;
  const path=c=>{c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.arcTo(x+w,y,x+w,y+r,r);c.lineTo(x+w,y+h-r);c.arcTo(x+w,y+h,x+w-r,y+h,r);
    if(side>0){c.lineTo(bx+18,y+h);c.lineTo(tx,ty);c.lineTo(bx-18,y+h);}c.lineTo(x+r,y+h);c.arcTo(x,y+h,x,y+h-r,r);c.lineTo(x,y+r);c.arcTo(x,y,x+r,y,r);c.closePath();};
  ctx.save();ctx.shadowColor=rgba([255,214,150],0.6);ctx.shadowBlur=18;ctx.beginPath();path(ctx);ctx.fillStyle=rgba([255,246,228],0.16+0.8*f);ctx.fill();ctx.restore();
  ctx.beginPath();path(ctx);ctx.strokeStyle=rgba([196,150,92],0.85);ctx.lineWidth=3.5;ctx.stroke();ctx.strokeStyle="rgba(255,250,236,0.8)";ctx.lineWidth=1.5;ctx.stroke();
  if(f>0){ctx.fillStyle=rgba([176,132,84],0.55*f);const rows=Math.max(1,Math.floor((h-24)/22));for(let i=0;i<rows;i++){const lw=(w-56)*(i===rows-1?0.6:1)*Math.min(1,f*1.6-i*0.2);if(lw<=0)continue;rr(ctx,x+28,y+18+i*22+(h-24-rows*22)/2,lw,10,5);ctx.fill();}}
  ctx.restore();}
// a small bracket of light round a mouth at (x, y): reading lips
function tt_lips(ctx,x,y,s,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.shadowColor=rgba(TT_WARM,0.9);ctx.shadowBlur=10;ctx.strokeStyle=rgba([255,236,196],0.95);ctx.lineWidth=3.5;
  for(const k of [-1,1]){ctx.beginPath();ctx.arc(x,y,28*s,k<0?Math.PI*0.72:-Math.PI*0.28,k<0?Math.PI*1.28:Math.PI*0.28);ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- a memory: a soft-edged card */
// draw(c, w, h) paints the memory in its own w x h space; it is shown at (x, y) with soft, feathered edges, a little faded
function tt_memory(ctx,x,y,w,h,key,draw,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const [bc,bx]=ag_buf("mem:"+key,w,h);draw(bx,w,h);
  bx.fillStyle="rgba(250,238,218,0.22)";bx.fillRect(0,0,w,h);
  const mask=ag_kept("memMask:"+w+"x"+h,w,h,(c)=>{const f=Math.min(w,h)*0.09;c.filter="blur("+Math.round(f*0.55)+"px)";c.fillStyle="#000";rr(c,f,f,w-2*f,h-2*f,f);c.fill();c.filter="none";});
  bx.globalCompositeOperation="destination-in";bx.drawImage(mask,0,0);bx.globalCompositeOperation="source-over";
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.85,1,o.k));
  ctx.save();ctx.globalAlpha*=0.5;ctx.shadowColor="rgba(46,38,28,0.35)";ctx.shadowBlur=40;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=12;ctx.drawImage(bc,x,y);ctx.restore();
  ctx.drawImage(bc,x,y);ctx.restore();}
// a hand cupped behind an ear, over a person drawn at (x, y, s): the hand's own shape, painted over the head
function tt_cupEar(ctx,who,x,y,s,flip){const F=ag_fig(who),P=F.P,C=F.C;ctx.save();ctx.translate(x,y);ctx.scale(flip?-s:s,s);ctx.translate(-AG_FIG.anchor[0],-AG_FIG.anchor[1]);
  const sk=P.skin;ag_soft(ctx,cc=>{cc.moveTo(250,512);cc.bezierCurveTo(228,486,214,446,220,404);cc.bezierCurveTo(224,378,240,362,252,366);cc.bezierCurveTo(262,370,258,392,254,410);
      cc.bezierCurveTo(262,388,272,372,282,378);cc.bezierCurveTo(290,384,284,404,276,420);cc.bezierCurveTo(272,446,274,478,282,512);cc.closePath();},
    mix(sk,ag_dk(sk,0.4),0.12),mix(sk,[255,240,228],0.4),262,400,90,C.skinShade,8);
  ctx.strokeStyle=rgba(mix(sk,[70,24,14],0.5),0.35);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(244,404);ctx.quadraticCurveTo(250,430,256,452);ctx.stroke();
  // the sleeve, coming up from below
  ag_soft(ctx,cc=>{cc.moveTo(236,640);cc.bezierCurveTo(236,590,240,540,248,506);cc.lineTo(286,508);cc.bezierCurveTo(292,550,300,600,306,650);cc.closePath();},ag_dk(P.top.c,0.1),ag_lt(P.top.c,0.3),290,540,120,rgba(ag_dk(P.top.c,0.8),0.4),12);
  ctx.restore();}
// the pharmacy of Clark's boyhood, a memory: a man behind the counter cupping his ear, a customer leaning in, a boy at the end, watching
function tt_pharmacy(c,w,h,t,o){o=o||{};let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"#E6DCC6");g.addColorStop(1,"#D7CBB2");c.fillStyle=g;c.fillRect(0,0,w,h);
  // shelves of bottles and jars behind the counter
  const R=ag_rnd(21);for(const sy of [120,214,308]){c.fillStyle="#8E7356";c.fillRect(40,sy,w-80,10);c.fillStyle="rgba(40,30,20,0.18)";c.fillRect(40,sy+10,w-80,6);
    for(let x=56;x<w-70;){const bw=18+R()*22,bh=34+R()*40,col=[[150,108,70],[118,138,112],[226,222,210],[176,150,110],[132,120,140]][(R()*5)|0];
      c.fillStyle=rgba(col,0.92);rr(c,x,sy-bh,bw,bh,5);c.fill();c.fillStyle="rgba(255,255,255,0.3)";c.fillRect(x+4,sy-bh+6,3,bh-12);c.fillStyle="rgba(60,50,40,0.5)";c.fillRect(x+bw*0.25,sy-bh-6,bw*0.5,7);x+=bw+6+R()*8;}}
  const ct=372;   // the counter's top
  // the pharmacist, behind the counter, facing the customer, his hand cupped behind his ear; the boy at the end of the counter
  ag_person(c,TT_PHARM,600,318,0.5,{t,flip:true,covered:true,nod:0.06,gaze:[2,1],pose:"hang"});tt_cupEar(c,TT_PHARM,600,318,0.5,true);
  ag_person(c,TT_BOY,850,396,0.38,{t:t+0.7,flip:true,covered:true,gaze:[-2,0],smile:0.2});
  // the counter
  g=c.createLinearGradient(0,ct,0,h);g.addColorStop(0,"#9A7552");g.addColorStop(1,"#6E5038");c.fillStyle=g;c.fillRect(0,ct,w,h-ct);c.fillStyle="#B48C64";c.fillRect(0,ct-14,w,18);c.fillStyle="rgba(255,240,220,0.25)";c.fillRect(0,ct-14,w,3);
  c.strokeStyle="rgba(40,26,14,0.35)";c.lineWidth=3;for(let x=60;x<w;x+=200)c.strokeRect(x,ct+30,160,h-ct-30);
  // the customer, in front of the counter, leaning in to speak up
  c.save();c.translate(250,560);c.rotate(0.13);c.translate(-250,-560);ag_person(c,TT_CUST,250,330,0.56,{t:t+1.4,covered:true,talk:o.talk==null?0.5:o.talk,gaze:[3,0]});c.restore();}

/* ---------------------------------------------------------------- the inner ear, and the implant
   The cochlea's spiral, seen in a cutaway: a warm tube winding two and a half turns, from its base (bottom left, where sound and the
   implant's wire come in) to its tip, lined with thousands of tiny cells. The implant: a fine blue wire winding in, ten small rings
   along its tip. */
const TT_SP={turns:2.6,k:0.112,base:Math.PI*0.86};
function tt_spPt(R,th){const r=R*Math.exp(-TT_SP.k*th),a=TT_SP.base+th;return[Math.cos(a)*r,Math.sin(a)*r,r,a];}
// the tube, kept as a picture for a size (and grey for the card)
function tt_spTube(R,grey){const S=Math.ceil(R*2.5);return ag_kept("tt_sp:"+R+":"+(grey?1:0),S,S,c=>{c.translate(S/2,S/2);const n=360,thM=TT_SP.turns*TAU,col=grey?[204,202,198]:TT_TISSUE;
  const pts=[];for(let i=0;i<=n;i++){const th=thM*i/n;pts.push(tt_spPt(R,th));}
  const W=p=>p[2]*0.42,off=(k,wk)=>pts.map(p=>[p[0]+Math.cos(p[3])*W(p)*k,p[1]+Math.sin(p[3])*W(p)*k]),line=pts.map(p=>[p[0],p[1]]);
  // a soft shadow under it, then the tube; light along its outer side (towards the window), shade along its inner side
  c.save();c.shadowColor="rgba(60,40,30,0.34)";c.shadowBlur=R*0.06;c.shadowOffsetX=-R*0.02;c.shadowOffsetY=R*0.035;tt_taper(c,line,W(pts[0]),W(pts[n]),rgba(mix(col,[90,50,40],0.1),1));c.restore();
  c.save();c.beginPath();tt_taper(c,line,W(pts[0]),W(pts[n]));c.clip();
  c.filter="blur("+Math.max(1,Math.round(R*0.012))+"px)";
  tt_taper(c,off(0.26),W(pts[0])*0.34,W(pts[n])*0.34,rgba(mix(col,[255,246,236],0.6),0.7));
  tt_taper(c,off(-0.4),W(pts[0])*0.3,W(pts[n])*0.3,rgba(mix(col,[80,40,30],0.45),0.45));c.filter="none";c.restore();
  // a thin membrane line along the middle, where the cells sit
  c.strokeStyle=rgba(mix(col,[90,50,40],0.3),0.35);c.lineWidth=Math.max(1,R*0.004);c.beginPath();off(-0.02).forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();
  // the base's opening, where things come in
  const b=pts[0];c.fillStyle=rgba(mix(col,[70,40,30],0.35),1);c.beginPath();c.ellipse(b[0],b[1],W(b)*0.46,W(b)*0.2,b[3]+Math.PI/2,0,TAU);c.fill();});}
// the cells along the tube, as thousands of tiny dots: one picture faint, one bright
function tt_spDots(R,bright){const S=Math.ceil(R*2.5);return ag_kept("tt_spd:"+R+":"+(bright?1:0),S,S,c=>{c.translate(S/2,S/2);const thM=TT_SP.turns*TAU,rows=[-0.16,-0.04,0.06,0.15];
  let th=0.05;const col=bright?[255,250,236]:[140,92,80];c.fillStyle=rgba(col,bright?1:0.7);if(bright){c.shadowColor=rgba(TT_WARM,0.9);c.shadowBlur=4;}
  while(th<thM-0.05){const p=tt_spPt(R,th),w=p[2]*0.42,nx=Math.cos(p[3]),ny=Math.sin(p[3]),d=Math.max(0.9,R*0.0055*(p[2]/R*0.6+0.4));
    for(const k of rows){c.beginPath();c.arc(p[0]+nx*w*k,p[1]+ny*w*k,d,0,TAU);c.fill();}th+=Math.max(0.006,R*0.0105/p[2]);}});}
// the spiral at (x, y), size R: o.dots 0 to 1 (faint), o.bright 0 to 1, o.wire 0 to 1 (how far it has wound in), o.rings 0 to 10 (each
// springs into place), o.lit 0 to 10 (each lights), o.grey, o.a; returns the rings' places and the wire's tip
const TT_WIRE={turns:1.35,gap:0.36};
function tt_spiral(ctx,x,y,R,o){o=o||{};const a=o.a==null?1:o.a,res={rings:[],tip:null,base:null};if(a<=0)return res;ctx.save();ctx.globalAlpha*=a;
  const tube=tt_spTube(R,o.grey),S=tube.width;ctx.drawImage(tube,x-S/2,y-S/2);
  if(o.dots>0){ctx.save();ctx.globalAlpha*=o.dots*(1-(o.bright||0));ctx.drawImage(tt_spDots(R,false),x-S/2,y-S/2);ctx.restore();}
  if(o.bright>0){ctx.save();ctx.globalAlpha*=o.bright;ctx.drawImage(tt_spDots(R,true),x-S/2,y-S/2);ctx.restore();}
  const P=th=>{const p=tt_spPt(R,th),w=p[2]*0.42*0.18;return[x+p[0]+Math.cos(p[3])*w,y+p[1]+Math.sin(p[3])*w,p[3]];};
  res.base=P(0);const wu=clamp(o.wire||0,0,1);
  if(wu>0){const thE=TT_WIRE.turns*TAU*wu,n=Math.max(2,Math.ceil(thE/0.06)),pts=[];
    // the lead from outside, to the opening at the base
    const b=P(0),out=[b[0]-R*0.5,b[1]+R*0.44];for(let i=0;i<=12;i++){const u=i/12;pts.push([lerp(out[0],b[0],u)+Math.sin(u*Math.PI)*R*0.06,lerp(out[1],b[1],u)]);}
    for(let i=1;i<=n;i++){const q=P(thE*i/n);pts.push([q[0],q[1]]);}
    ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=rgba(mix(AG.blue,[20,30,40],0.3),0.5);ctx.lineWidth=Math.max(3,R*0.024);ctx.translate(AG.sdx*0.3,2);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore();
    ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=rgba(AG.blue,1);ctx.lineWidth=Math.max(3,R*0.02);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    ctx.strokeStyle="rgba(200,230,245,0.7)";ctx.lineWidth=Math.max(1,R*0.006);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0]-0.8,p[1]-0.8):ctx.moveTo(p[0]-0.8,p[1]-0.8));ctx.stroke();
    res.tip=pts[pts.length-1];
    // ten rings along the tip: each settles into place, then lights
    const thT=TT_WIRE.turns*TAU;for(let i=0;i<10;i++){const th=thT-(9-i)*TT_WIRE.gap;if(th>thE+0.001)continue;const q=P(th),k=clamp((o.rings||0)-i,0,1);res.rings.push([q[0],q[1]]);if(k<=0)continue;
      const kk=ag_spr(k,0,0.55),L=Math.max(10,R*0.064)*lerp(1.8,1,kk),wd=Math.max(4,R*0.022),lit=clamp((o.lit||0)-i,0,1);
      ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(q[2]);ctx.globalAlpha*=clamp(k*2,0,1);
      if(lit>0){ctx.save();ctx.globalCompositeOperation="lighter";const g=ctx.createRadialGradient(0,0,0,0,0,L*1.7);g.addColorStop(0,rgba([170,220,250],0.7*lit));g.addColorStop(1,rgba([170,220,250],0));ctx.fillStyle=g;ctx.fillRect(-L*1.7,-L*1.7,L*3.4,L*3.4);ctx.restore();}
      ctx.fillStyle=rgba(mix(mix(AG.blue,[220,226,230],0.55),[236,250,255],lit),1);rr(ctx,-L/2,-wd/2,L,wd,wd/2);ctx.fill();ctx.strokeStyle=rgba(mix(AG.blue,[20,30,40],0.4),0.7);ctx.lineWidth=1.2;ctx.stroke();ctx.restore();}}
  ctx.restore();return res;}

/* ---------------------------------------------------------------- a calm brain, side view, facing right (o.flip: left)
   A warm matte form: the cerebrum with its folds drawn as tapering lines, the cerebellum under its back, the brainstem. s = 1 is
   about 400 x 320 px. o.glow: warm light inside; o.sweep {u, a}: a fine, fast shimmer sweeping front to back (u 0 to 1 across);
   o.outline: only its outline (and o.centre a bright centre sending lines to every part); o.a. */
const TT_BRAIN={cereb(c){c.moveTo(150,34);c.bezierCurveTo(196,14,204,-58,172,-100);c.bezierCurveTo(140,-142,80,-162,10,-160);c.bezierCurveTo(-72,-160,-150,-130,-186,-70);
    c.bezierCurveTo(-212,-28,-206,22,-178,44);c.bezierCurveTo(-150,62,-104,60,-62,56);c.bezierCurveTo(-14,84,60,96,104,72);c.bezierCurveTo(126,60,128,44,118,38);c.bezierCurveTo(128,32,140,32,150,34);c.closePath();},
  cbl(c){c.moveTo(-182,52);c.bezierCurveTo(-196,80,-170,118,-122,120);c.bezierCurveTo(-84,122,-62,104,-64,80);c.bezierCurveTo(-90,64,-150,58,-182,52);c.closePath();},
  stem(c){c.moveTo(-66,70);c.bezierCurveTo(-58,100,-56,140,-62,176);c.lineTo(-30,176);c.bezierCurveTo(-30,140,-26,104,-14,80);c.closePath();},
  sulci:[[84,-152,74,-110,64,-60,52,-22],[84,-112,110,-104,140,-100,166,-88],[70,-58,100,-50,140,-48,172,-40],[118,-150,126,-138,134,-126,142,-118],[150,-74,160,-70,170,-64,180,-58],[98,-20,112,-12,126,-6,142,2],[122,12,132,14,142,18,152,22],[60,-150,64,-136,60,-124,56,-114],
    [-10,-158,-18,-110,-26,-60,-36,-22],[-28,-100,-60,-96,-100,-90,-132,-78],[-132,-78,-146,-70,-156,-56,-162,-40],[-60,-152,-66,-142,-74,-130,-82,-120],[-100,-142,-106,-132,-112,-120,-118,-110],[-70,-60,-80,-52,-90,-46,-102,-40],
    [-150,-60,-164,-50,-178,-40,-192,-30],[-160,10,-172,6,-184,2,-196,0],[-140,30,-150,34,-160,38,-172,42],[92,54,40,40,-30,20,-110,2],[62,78,10,70,-50,56,-132,40],[18,40,10,48,0,54,-10,62],[-80,30,-86,38,-92,44,-100,50],[150,-112,158,-100,164,-90,170,-80],
    [104,-136,112,-126,116,-114,118,-104],[132,-36,144,-30,156,-26,168,-22],[20,-130,26,-120,28,-108,26,-96],[-44,-130,-50,-118,-52,-104,-50,-92],[-120,-30,-130,-22,-140,-16,-150,-12],[-30,40,-40,46,-50,48,-62,48],[40,20,46,28,48,36,48,44],[-176,-80,-184,-66,-188,-52,-190,-40],[-90,-110,-80,-100,-74,-88,-70,-76],[120,-60,126,-50,128,-38,128,-26]],
  folds:[[[104,40],[40,10],[-50,-8]],[[40,-158],[20,-80],[0,8]],[[78,-150],[62,-90],[36,-24]],[[-6,-158],[-24,-90],[-44,-20]],[[120,-120],[110,-70],[88,-10]],[[160,-60],[130,-30],[120,10]],
    [[-70,-150],[-80,-100],[-110,-60]],[[-140,-110],[-120,-60],[-150,-10]],[[-100,-30],[-60,-20],[-60,30]],[[30,40],[-10,30],[-40,40]],[[70,60],[30,62],[-10,56]],[[-170,0],[-140,20],[-110,30]]]};
// the brain's picture, kept: its folds are short meandering grooves (seeded), the two deep ones drawn on purpose
const TT_BK=1.6;
function tt_brainPic(col){const key=col.join(",");return ag_kept("tt_brain:"+key,760,640,c=>{c.translate(380,300);c.scale(TT_BK,TT_BK);const base=col;
  ag_soft(c,TT_BRAIN.stem,ag_dk(base,0.14),ag_lt(base,0.3),-40,90,60,"rgba(90,50,40,0.3)",8);
  ag_soft(c,TT_BRAIN.cbl,ag_dk(base,0.08),ag_lt(base,0.35),-120,70,80,"rgba(90,50,40,0.3)",10);
  c.save();ag_shape(c,TT_BRAIN.cbl);c.clip();c.strokeStyle=rgba(ag_dk(base,0.4),0.32);c.lineWidth=1.6;for(let i=0;i<9;i++){c.beginPath();c.moveTo(-200,58+i*7.5);c.quadraticCurveTo(-130,72+i*8.5,-60,66+i*7.5);c.stroke();}c.restore();
  c.save();c.shadowColor="rgba(80,46,36,0.3)";c.shadowBlur=20;c.shadowOffsetX=-5;c.shadowOffsetY=10;ag_shape(c,TT_BRAIN.cereb);c.fillStyle=rgba(base,1);c.fill();c.restore();
  ag_soft(c,TT_BRAIN.cereb,base,ag_lt(base,0.45),90,-110,280,"rgba(90,50,40,0.32)",20,0.55);
  c.save();ag_shape(c,TT_BRAIN.cereb);c.clip();const dark=rgba(ag_dk(base,0.34),0.5),lite=rgba(ag_lt(base,0.55),0.5);
  let gi=0;const groove=(q,w0,w1)=>{const raw=tt_bzPts(q,0,1,24);let len=0;for(let i=1;i<raw.length;i++)len+=Math.hypot(raw[i][0]-raw[i-1][0],raw[i][1]-raw[i-1][1]);
    const cyc=len/52,amp=2.6*clamp((len-30)/70,0,1),ph=gi++*1.7;
    const pts=raw.map((p,i)=>{const a=raw[Math.max(0,i-1)],b=raw[Math.min(raw.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,w=Math.sin(i/(raw.length-1)*TAU*cyc+ph)*amp;return[p[0]-dy/d*w,p[1]+dx/d*w];});
    tt_taper(c,pts,w0,w1,dark);c.save();c.translate(1.5,-2);tt_taper(c,pts,w0*0.45,w1*0.45,lite);c.restore();};
  // the deep grooves: the lateral one, and the central one; then the lobes' own folds, as anatomy draws them
  groove([106,36,60,10,0,-4,-58,-14],7,2);groove([38,-158,26,-100,18,-40,6,8],6,1.6);
  for(const q of TT_BRAIN.sulci)groove(q,4.4,1.3);
  c.restore();});}
function tt_brain(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);
  if(o.outline){ctx.lineJoin="round";ctx.strokeStyle=rgba(o.col||AG.ink,0.55);ctx.lineWidth=3/s;ctx.beginPath();TT_BRAIN.cereb(ctx);ctx.stroke();ctx.beginPath();TT_BRAIN.cbl(ctx);ctx.stroke();ctx.beginPath();TT_BRAIN.stem(ctx);ctx.stroke();
    ctx.restore();ctx.restore();return;}
  const pic=tt_brainPic(o.col||[226,198,188]);ctx.drawImage(pic,-380/TT_BK,-300/TT_BK,760/TT_BK,640/TT_BK);
  ctx.save();ag_shape(ctx,TT_BRAIN.cereb);ctx.clip();
  // light from inside
  if(o.glow>0){ctx.globalCompositeOperation="lighter";const g=ctx.createRadialGradient(0,-40,10,0,-40,230);g.addColorStop(0,rgba(TT_WARM,0.42*o.glow));g.addColorStop(1,rgba(TT_WARM,0));ctx.fillStyle=g;ctx.fillRect(-240,-260,480,420);ctx.globalCompositeOperation="source-over";}
  // a fine shimmer sweeping through it, front to back: a soft band of light with fine lines in it
  if(o.sweep&&o.sweep.a>0){const u=o.sweep.u,cx=lerp(240,-250,u),sa=o.sweep.a;ctx.globalCompositeOperation="screen";const g=ctx.createLinearGradient(cx-90,0,cx+90,0);
    g.addColorStop(0,"rgba(255,244,222,0)");g.addColorStop(0.5,rgba([255,240,214],0.8*sa));g.addColorStop(1,"rgba(255,244,222,0)");ctx.fillStyle=g;ctx.fillRect(cx-90,-200,180,320);
    ctx.lineWidth=1.1;for(let i=-5;i<=5;i++){const xx=cx+i*9,al=0.8*sa*(1-Math.abs(i)/6);ctx.strokeStyle=rgba([255,244,224],al);ctx.beginPath();ctx.moveTo(xx,-180);ctx.bezierCurveTo(xx+12,-90,xx-12,0,xx+4,100);ctx.stroke();}ctx.globalCompositeOperation="source-over";}
  ctx.restore();ctx.restore();}
// a bright centre in a brain's outline sending lines to every part at once (u 0 to 1 how far they've gone)
function tt_broadcast(ctx,x,y,s,u,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);const pts=[[150,-60],[110,-130],[30,-150],[-60,-150],[-140,-110],[-180,-40],[-160,30],[-80,40],[0,60],[80,50],[160,10],[-120,-60],[60,-80],[-20,-60]];
  ctx.lineCap="round";for(const p of pts){const q=[lerp(0,p[0],u),lerp(-40,p[1],u)];ctx.strokeStyle=rgba([255,214,140],0.8);ctx.lineWidth=3/s;ctx.beginPath();ctx.moveTo(0,-40);ctx.lineTo(q[0],q[1]);ctx.stroke();
    if(u>0.95){ctx.fillStyle=rgba([255,232,190],1);ctx.beginPath();ctx.arc(p[0],p[1],5/s,0,TAU);ctx.fill();}}
  ctx.restore();tt_glow(ctx,x,y-40*s,70*s,a);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="#FFF6E2";ctx.beginPath();ctx.arc(x,y-40*s,12*s,0,TAU);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the card of why a hearing aid couldn't help, and the pulses of 1966 */
// a sound wave from x0 to x1 at y, amp high, moving with t
function tt_wave(ctx,x0,x1,y,amp,t,col,lw,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.strokeStyle=col;ctx.lineWidth=lw||3;ctx.lineCap="round";ctx.beginPath();
  for(let i=0;i<=60;i++){const u=i/60,xx=lerp(x0,x1,u),e=Math.sin(Math.PI*u);ctx.lineTo(xx,y+Math.sin(u*TAU*3-t*6)*amp*e);}ctx.stroke();ctx.restore();}
// a small hearing aid that sits behind the ear: a curved case and its hook
function tt_aid(ctx,x,y,s,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  ag_soft(ctx,cc=>{cc.moveTo(-14,40);cc.bezierCurveTo(-30,10,-26,-34,0,-46);cc.bezierCurveTo(18,-52,26,-40,20,-26);cc.bezierCurveTo(10,-6,10,22,14,40);cc.bezierCurveTo(8,52,-6,52,-14,40);cc.closePath();},[206,190,170],[246,238,226],10,-30,40,"rgba(60,40,30,0.3)",6);
  ctx.strokeStyle="#B9A890";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(4,-46);ctx.bezierCurveTo(16,-70,44,-66,48,-40);ctx.stroke();ctx.restore();}
// the card: a wave, a hearing aid, a bigger wave, the grey spiral, and a line to the brain that stops short. o.p 0 to 1 reveals it in
// that order; o.pulses 0 to 1: a row of small pulses runs to the brain; o.q 0 to 1, a soft question mark between them. Returns its box.
function tt_aidCard(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a,w=1180,h=300;if(a<=0)return{x,y,w,h};const p=o.p==null?1:o.p;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,24,{});const cy=y+h/2,st=u=>clamp((p-u)/0.18,0,1);
  tt_wave(ctx,x+50,x+210,cy,16,t,rgba([110,96,80],0.85),3,st(0));
  tt_aid(ctx,x+280,cy,1,st(0.15));
  tt_wave(ctx,x+340,x+560,cy,40,t,rgba([110,96,80],0.85),4,st(0.3));
  tt_spiral(ctx,x+680,cy,92,{grey:true,dots:0.5,a:st(0.45)});
  tt_brain(ctx,x+1030,cy+6,0.32,{a:st(0.62),col:[214,206,198]});
  // the line from the spiral towards the brain, stopping short, with a gap
  const lu=st(0.75);if(lu>0){ctx.save();ctx.lineCap="round";ctx.strokeStyle=rgba([150,140,130],0.9);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+790,cy);ctx.lineTo(x+790+lu*70,cy);ctx.stroke();
    ctx.setLineDash([2,12]);ctx.strokeStyle=rgba([150,140,130],0.5*lu);ctx.beginPath();ctx.moveTo(x+872,cy);ctx.lineTo(x+944,cy);ctx.stroke();ctx.restore();}
  // 1966: a row of small electric pulses runs from the spiral towards the brain, and a question mark hangs between them
  const pu=o.pulses||0;if(pu>0){for(let i=0;i<6;i++){const u=((t*0.55+i/6)%1),px=lerp(x+760,x+930,u),al=pu*Math.sin(Math.PI*u);ctx.fillStyle=rgba(AG.blue,al);rr(ctx,px-4,cy-38,8,30,3);ctx.fill();}}
  if(o.q>0)ag_T(ctx,"?",x+905,cy-60,{w:700,size:48,align:"center",col:AG.mut,a:o.q});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- Rod's implant, the lab's lead, and his brain doing the rest */
// the implant under the skin behind his left ear, over Rod drawn facing left at (x, y, s): a soft outline of the receiver, and the blue
// wire curling inwards to a small spiral; o.a, o.wire 0 to 1 (how far the wire is drawn), o.pulse 0 to 1 (blue pulses along it), o.t
function tt_implant(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const E=tt_ear(x,y,s,true),k=s;ctx.save();ctx.globalAlpha*=a;
  const rc=[E[0]+50*k,E[1]-62*k];
  // the receiver: a soft rounded outline under the skin
  ctx.save();ctx.shadowColor="rgba(255,240,220,0.8)";ctx.shadowBlur=8*k;ctx.strokeStyle=rgba([140,100,88],0.7);ctx.lineWidth=2.6*k;ctx.setLineDash([8*k,5*k]);ctx.beginPath();ctx.ellipse(rc[0],rc[1],30*k,25*k,-0.3,0,TAU);ctx.stroke();ctx.restore();
  ctx.fillStyle=rgba([150,110,96],0.16);ctx.beginPath();ctx.ellipse(rc[0],rc[1],30*k,25*k,-0.3,0,TAU);ctx.fill();ctx.fillStyle=rgba([140,100,88],0.35);ctx.beginPath();ctx.arc(rc[0],rc[1],7*k,0,TAU);ctx.fill();
  // the wire: from the receiver, forward and down past the ear, curling into a small spiral inside
  const w=[rc[0]-14*k,rc[1]+14*k,rc[0]-34*k,E[1]-8*k,E[0]-6*k,E[1]+30*k,E[0]-24*k,E[1]+14*k],sp=[E[0]-24*k,E[1]+14*k],wu=o.wire==null?1:o.wire;
  ctx.lineCap="round";ctx.strokeStyle=rgba(AG.blue,0.95);ctx.lineWidth=3.4*k;ag_bzPath(ctx,w,0,Math.min(1,wu*1.4),30);ctx.stroke();
  const cu=clamp(wu*1.4-1,0,0.4)/0.4;if(cu>0){ctx.beginPath();for(let i=0;i<=40*cu;i++){const th=i/40*TAU*1.7,r=11*k*Math.exp(-0.32*th);ctx.lineTo(sp[0]+Math.cos(th+Math.PI)*r,sp[1]+Math.sin(th+Math.PI)*r);}ctx.stroke();}
  if(o.pulse>0){for(let i=0;i<4;i++){const u=((o.t||0)*0.9+i/4)%1,q=ag_bz(w,u);ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=rgba([150,210,245],0.9*o.pulse*Math.sin(Math.PI*u));ctx.beginPath();ctx.arc(q[0],q[1],4.5*k,0,TAU);ctx.fill();ctx.restore();}}
  ctx.restore();return{receiver:rc,ear:E};}
// the coil worn behind the ear, and its lead down to the processor at (bx, by)
function tt_coil(ctx,x,y,s,bx,by,a){a=a==null?1:a;if(a<=0)return;const E=tt_ear(x,y,s,true),c=[E[0]+40*s,E[1]-50*s];ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle="#2F2C29";ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(c[0]+4*s,c[1]+10*s);ctx.bezierCurveTo(c[0]+40*s,c[1]+160*s,bx-180,by-60,bx,by);ctx.stroke();
  ag_soft(ctx,cc=>{cc.arc(c[0],c[1],15*s,0,TAU);},[64,62,60],[150,146,140],c[0]+5*s,c[1]-6*s,18*s,"rgba(0,0,0,0.4)",4);ctx.fillStyle="#9C978E";ctx.beginPath();ctx.arc(c[0],c[1],4*s,0,TAU);ctx.fill();ctx.restore();return c;}
// his brain doing the rest: warm light branching out from (x, y), richer as u goes from 0 to 1 (seeded, kept)
const TT_BRANCH=(()=>{const R=ag_rnd(77),segs=[];const grow=(x,y,a,len,w,d,t0)=>{const n=6,pts=[[x,y]];let h=a;for(let i=0;i<n;i++){h+=(R()-0.5)*0.36;x+=Math.cos(h)*len/n;y+=Math.sin(h)*len/n;pts.push([x,y]);}
  segs.push({pts,w0:w,w1:w*0.55,t0,t1:t0+0.24,d});if(d<5){const k=d<3?2:(R()<0.55?2:1);for(let j=0;j<k;j++)grow(x,y,h+(j?1:-1)*(0.3+R()*0.35),len*(0.72+R()*0.12),w*0.62,d+1,t0+0.17);}};
  for(let i=0;i<9;i++){const a=i*TAU/9+(R()-0.5)*0.3;grow(0,0,a,80+R()*40,9,0,R()*0.08);}return segs;})();
// drawn behind a head: a warm glow, and warm branches spreading through it (u 0 to 1), soft and calm, never a spark
function tt_branchLight(ctx,x,y,s,u,a){a=a==null?1:a;if(a<=0||u<=0)return;const [bc,bx]=ag_buf("branch",900,900);bx.translate(450,450);bx.scale(s,s);
  bx.lineCap="round";for(const sg of TT_BRANCH){const v=clamp((u*1.1-sg.t0)/(sg.t1-sg.t0),0,1);if(v<=0)continue;const n=sg.pts.length,m=Math.max(2,Math.ceil((n-1)*v)+1);
    const pts=sg.pts.slice(0,m);tt_taper(bx,pts,sg.w0,lerp(sg.w0,sg.w1,v),rgba([255,214,150],0.95-sg.d*0.1));}
  ctx.save();ctx.globalCompositeOperation="screen";const g=ctx.createRadialGradient(x,y,0,x,y,330*s);g.addColorStop(0,rgba(TT_WARM,0.7*a*clamp(u*2,0,1)));g.addColorStop(0.5,rgba(TT_WARM,0.28*a*clamp(u*2,0,1)));g.addColorStop(1,rgba(TT_WARM,0));
  ctx.fillStyle=g;ctx.fillRect(x-330*s,y-330*s,660*s,660*s);ctx.filter="blur(6px)";ctx.globalAlpha*=0.8*a;ctx.drawImage(bc,x-450,y-450);ctx.filter="none";ctx.globalAlpha=0.5*a;ctx.drawImage(bc,x-450,y-450);ctx.restore();}

/* ---------------------------------------------------------------- a pale map of the world, and the implants' lights spreading over it */
const TT_LAND=[[[-168,66],[-162,70],[-140,70],[-120,72],[-95,72],[-80,67],[-62,60],[-56,52],[-66,45],[-70,42],[-76,35],[-80,26],[-82,25],[-84,30],[-90,29],[-97,26],[-97,20],[-90,16],[-84,10],[-80,8],[-78,8],[-86,12],[-92,15],[-105,20],[-110,24],[-115,30],[-118,34],[-124,40],[-124,48],[-130,55],[-140,60],[-152,58],[-160,58],[-166,62]],
  [[-78,8],[-72,12],[-62,10],[-52,4],[-44,-2],[-35,-6],[-38,-14],[-41,-22],[-48,-26],[-54,-34],[-58,-38],[-65,-42],[-66,-50],[-70,-54],[-73,-50],[-73,-40],[-71,-30],[-70,-18],[-76,-12],[-80,-4],[-80,2]],
  [[-10,36],[-9,43],[-2,44],[-4,48],[2,51],[8,54],[6,58],[8,62],[14,66],[20,70],[30,71],[45,68],[60,70],[75,72],[90,76],[110,76],[130,72],[150,70],[170,68],[180,66],[178,62],[162,58],[156,52],[142,54],[140,46],[132,42],[128,36],[122,32],[121,25],[114,22],[108,18],[106,10],[100,8],[100,14],[98,16],[94,18],[90,22],[86,20],[80,14],[78,8],[74,16],[72,22],[66,25],[58,25],[56,22],[52,17],[44,12],[42,16],[36,28],[34,32],[36,36],[28,36],[26,40],[22,38],[20,40],[16,40],[12,44],[8,44],[3,43],[0,40],[-6,36]],
  [[-17,21],[-16,28],[-10,30],[-6,36],[10,37],[20,32],[30,31],[33,31],[34,28],[38,22],[43,12],[51,12],[50,2],[42,-4],[40,-12],[40,-16],[35,-24],[32,-29],[26,-34],[20,-35],[18,-30],[14,-22],[12,-14],[13,-6],[9,-1],[9,4],[5,6],[-4,5],[-8,4],[-13,8],[-17,14]],
  [[114,-22],[114,-30],[116,-35],[124,-34],[130,-32],[136,-35],[140,-38],[146,-39],[150,-37],[153,-30],[153,-25],[146,-19],[142,-11],[136,-12],[132,-11],[128,-15],[122,-18]],
  [[-50,60],[-42,60],[-22,70],[-20,80],[-40,83],[-60,80],[-72,78],[-56,72]],[[-6,50],[2,51],[0,54],[-2,57],[-5,58],[-6,55],[-5,52]],[[130,32],[134,34],[140,36],[142,40],[141,44],[140,42],[138,38],[134,35],[130,34]],
  [[166,-46],[172,-41],[174,-37],[178,-38],[176,-42],[170,-46]],[[95,5],[104,-6],[106,-6],[98,2]],[[109,1],[117,7],[119,1],[116,-4],[110,-3]],[[131,-1],[141,-3],[150,-10],[141,-9],[132,-4]],[[44,-25],[47,-25],[50,-15],[49,-12],[44,-17]]];
// where implants were fitted, roughly in the order the lights come on: Melbourne first
const TT_LIGHTS=[[145,-38],[151,-34],[153,-27],[116,-32],[174,-37],[-0.1,51.5],[2,48.8],[13,52],[-74,40.7],[-87,42],[-118,34],[-79,43.6],[9,45.5],[-3.7,40.4],[16,48],[4.9,52.4],[18,59.3],[24,60],[139.7,35.7],[135.5,34.7],[127,37.5],[121.5,31.2],[116.4,39.9],[114,22.3],[103.8,1.3],[77.2,28.6],[72.8,19],[80.2,13],[-46.6,-23.5],[-58.4,-34.6],[-70.6,-33.4],[-99,19.4],[-74,4.6],[28,-26],[31.2,30],[35,32],[51.4,35.7],[46.7,24.7],[55.3,25.2],[37.6,55.8],[30.3,59.9],[21,52.2],[14.4,50.1],[19,47.5],[23.7,37.9],[29,41],[-122.4,37.8],[-122.3,47.6],[-104.9,39.7],[-95.4,29.8],[-80.2,25.8],[-71,42.4],[-77,38.9],[-84.4,33.7],[-93.3,45],[100.5,13.8],[106.8,-6.2],[121,14.6],[-43.2,-22.9],[36.8,-1.3],[3.4,6.5],[-6.8,34],[10.2,36.8],[44.4,33.3]];
function tt_worldMap(ctx,x,y,w,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const h=w*0.42,P=(lo,la)=>[x+(lo+180)/360*w,y+(80-la)/138*h];
  const pic=ag_kept("tt_map:"+w,Math.ceil(w)+40,Math.ceil(h)+40,c=>{c.translate(20-x,20-y);c.save();c.shadowColor="rgba(46,38,28,0.18)";c.shadowBlur=14;c.shadowOffsetX=-4;c.shadowOffsetY=6;
    c.fillStyle="#E9E3D6";for(const L of TT_LAND){c.beginPath();L.forEach((p,i)=>{const q=P(p[0],p[1]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.closePath();c.fill();}c.restore();
    c.strokeStyle="rgba(120,104,86,0.35)";c.lineWidth=1.5;c.lineJoin="round";for(const L of TT_LAND){c.beginPath();L.forEach((p,i)=>{const q=P(p[0],p[1]);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]);});c.closePath();c.stroke();}});
  ctx.save();ctx.globalAlpha*=a;ctx.drawImage(pic,x-20,y-20);
  const n=TT_LIGHTS.length;for(let i=0;i<n;i++){const v=clamp(u*n*1.05-i,0,1);if(v<=0)continue;const q=P(TT_LIGHTS[i][0],TT_LIGHTS[i][1]),k=ag_spr(v,0,0.5);
    tt_glow(ctx,q[0],q[1],22*k,0.9*v);ctx.fillStyle=rgba([255,244,220],v);ctx.beginPath();ctx.arc(q[0],q[1],4*k,0,TAU);ctx.fill();}
  ctx.restore();return P;}

/* ---------------------------------------------------------------- the agent as a rough copy: neurons in its band, pages flowing in */
// over ag_model at (x, y, r): faint neurons glowing in its violet band (a), and tiny pages flowing into it from the left (u, t)
function tt_roughCopy(ctx,x,y,r,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;
  // neurons in the band: small bodies and branches, lit violet-white
  const bw=r*1.3,bh=r*0.32,by=y-r*0.11;ctx.save();rr(ctx,x-bw/2+r*0.05,by-bh/2+2,bw-r*0.1,bh-4,bh/2);ctx.clip();ctx.globalCompositeOperation="lighter";ctx.strokeStyle=rgba([200,192,255],0.55*(o.neurons==null?1:o.neurons));ctx.lineWidth=1.3;
  const R=ag_rnd(5);for(let i=0;i<7;i++){const cx=x-bw/2+bw*(i+0.5)/7+(R()-0.5)*8,cy=by+(R()-0.5)*bh*0.3,ph=t*1.3+i;ctx.fillStyle=rgba([220,214,255],0.5+0.3*Math.sin(ph));ctx.beginPath();ctx.arc(cx,cy,2.2,0,TAU);ctx.fill();
    for(let j=0;j<4;j++){const an=R()*TAU,l=6+R()*9;ctx.beginPath();ctx.moveTo(cx,cy);ctx.quadraticCurveTo(cx+Math.cos(an+0.4)*l*0.6,cy+Math.sin(an+0.4)*l*0.6,cx+Math.cos(an)*l,cy+Math.sin(an)*l);ctx.stroke();}}
  ctx.restore();
  // pages flowing in along a curve from the left (o.from "right": from the right)
  const pu=o.pages||0;if(pu>0){const sd=o.from==='right'?-1:1,p=[x-sd*r*5.2,y-r*1.6,x-sd*r*3.4,y-r*2.2,x-sd*r*2,y-r*0.2,x-sd*r*0.6,y-r*0.1];for(let i=0;i<9;i++){const u=((t*0.32+i/9)%1),q=ag_bz(p,u),al=pu*Math.sin(Math.PI*Math.min(1,u*1.15))*(u<0.9?1:(1-u)*10);
      if(al<=0.01)continue;const sc=lerp(1,0.35,u*u);ctx.save();ctx.translate(q[0],q[1]);ctx.rotate(Math.sin(i*2.1+t)*0.25);ctx.scale(sc,sc);ctx.globalAlpha*=al;ag_box(ctx,-20,-26,40,52,4,{});ctx.fillStyle="rgba(86,92,100,0.45)";for(let l=0;l<4;l++)ctx.fillRect(-12,-16+l*9,l===3?14:24,3);ctx.restore();}}
  ctx.restore();}

/* ---------------------------------------------------------------- the five questions, pinned to the wall */
const TT_Q=[["Do our brains work like this?","jun"],["Could it have an idea of its own?","mei"],["Would a perfect copy of a brain be a mind?","noor"],["Does it feel anything?","sam"],["What makes us human, then?","yusuf"]];
const TT_QTAG=["much still unknown","not for science alone","nobody knows","nobody knows yet","nobody has settled it"];
const TT_QW=316,TT_QY=150,TT_QX=i=>128+i*(TT_QW+34);   // each card's width, where the row hangs, each card's left edge
// a question card at (x, y) (its top left), w wide: its number in a small round badge, the question, a pin at the top; o.k springs it,
// o.lift 0 to 1 (off the wall: a deeper shadow), o.tag the words of the tag that settles under it, o.tagA, o.lit 0 to 1 (its edge glows
// violet: the question being asked); returns its box
function tt_qcard(ctx,i,x,y,o){o=o||{};const a=o.a==null?1:o.a,w=o.w||TT_QW,q=TT_Q[i][0];const lines=ag_wrap(ctx,q,w-56,{w:700,size:32}),h=28+52+3*42+18;const bb={x,y,w,h};if(a<=0)return bb;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y,lerp(0.4,1,o.k));
  const lift=o.lift||0;if(lift>0){ctx.save();ctx.globalAlpha*=0.5*lift;ctx.shadowColor="rgba(46,38,28,0.4)";ctx.shadowBlur=50*lift;ctx.shadowOffsetX=-14*lift;ctx.shadowOffsetY=30*lift;ctx.fillStyle="#EEECE7";rr(ctx,x,y,w,h,22);ctx.fill();ctx.restore();}
  ag_box(ctx,x,y,w,h,22,{edge:o.lit>0?AG.violet:null,edgeA:0.8*(o.lit||0),glow:o.lit>0?AG.violet:null});
  // the badge with its number, then the question
  ctx.fillStyle=rgba(AG.violet,0.12);ctx.beginPath();ctx.arc(x+50,y+52,24,0,TAU);ctx.fill();ag_T(ctx,String(i+1),x+50,y+63,{w:800,size:30,align:"center",col:AG.violet});
  lines.forEach((l,j)=>ag_T(ctx,l,x+28,y+80+42*(j+1)-8,{w:700,size:32}));
  // the pin
  if(o.pin!==false){ctx.save();ctx.shadowColor="rgba(46,38,28,0.35)";ctx.shadowBlur=6;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=3;const g=ctx.createRadialGradient(x+w/2-3,y+10,1,x+w/2,y+14,11);g.addColorStop(0,rgba(AG_OAK.hi,1));g.addColorStop(1,rgba(AG_OAK.dark,1));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x+w/2,y+14,10,0,TAU);ctx.fill();ctx.restore();}
  ctx.restore();
  if(o.tag&&o.tagA>0){const tw=ag_tw(ctx,o.tag,{w:700,size:28})+56;tt_tag(ctx,x+w/2,y+h+44,o.tag,{a:a*o.tagA,k:o.tagK,size:28});}
  return bb;}
// the row on the wall: o.out the card that's off the wall (its index), o.tags [0 to 1 for each], o.k [spring for each], o.a
function tt_qrow(ctx,o){o=o||{};for(let i=0;i<5;i++){if(o.out===i)continue;const k=o.k?o.k[i]:1;if(k<=0)continue;tt_qcard(ctx,i,TT_QX(i),TT_QY,{k,a:o.a,tag:TT_QTAG[i],tagA:o.tags?o.tags[i]:0,tagK:o.tagK?o.tagK[i]:null});}}
// the sign-off under the agent's answer: drafted by the agent, approved by Mei; sg 0 to 1 how far she has signed
function tt_signoff(ctx,x,y,w,sg,a){a=a==null?1:a;if(a<=0)return;ag_box(ctx,x,y,w,150,20,{a,edge:sg>0.9?AG.green:null,edgeA:0.6*clamp((sg-0.9)*10,0,1)});ctx.save();ctx.globalAlpha*=a;
  ag_pen(ctx,x+44,y+48,26,rgba(AG.violet,1));ag_T(ctx,"drafted by the agent",x+72,y+58,{w:600,size:28,col:AG.mut});
  ctx.strokeStyle="rgba(60,50,40,0.14)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+84);ctx.lineTo(x+w-24,y+84);ctx.stroke();
  // her signature, written as a line, then the approval
  const su=clamp(sg/0.7,0,1);if(su>0){ctx.strokeStyle=rgba(AG.ink,0.75);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();for(let i=0;i<=60*su;i++){const u=i/60,xx=x+w-250+u*200,yy=y+112-Math.sin(u*TAU*2.2)*10*Math.sin(Math.PI*u)-u*6;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();}
  const ap=clamp((sg-0.7)/0.3,0,1);if(ap>0){withA(ctx,ap,()=>{ag_tick(ctx,x+44,y+114,24,rgba(AG.green,1),4);ag_T(ctx,"approved · Mei Tanaka",x+72,y+124,{w:700,size:28,col:AG.green});});}
  ctx.restore();}

/* ---------------------------------------------------------------- a neuron, and its copy
   A living neuron: a rounded body, branches thinning to their tips (seeded, kept per seed), an axon. Warm rose, matte; never a meaning
   colour. Its copy, the perceptron: lines coming in, a small dial on each, a sum, a small light that fires, in blue. */
const TT_NEUR={};
function tt_neurGeo(seed){if(TT_NEUR[seed])return TT_NEUR[seed];const R=ag_rnd(seed),segs=[];
  const grow=(x,y,a,len,w,d)=>{const n=5,pts=[[x,y]];let h=a;for(let i=0;i<n;i++){h+=(R()-0.5)*0.4;x+=Math.cos(h)*len/n;y+=Math.sin(h)*len/n;pts.push([x,y]);}segs.push({pts,w0:w,w1:Math.max(1.2,w*0.55),d});
    if(d<3){const k=R()<0.8?2:1;for(let j=0;j<k;j++)grow(x,y,h+(j?1:-1)*(0.35+R()*0.45),len*(0.66+R()*0.14),Math.max(1.2,w*0.6),d+1);}};
  // the dendrites: one reaching up, and five round the body; the axon down and to the right, with small endings
  grow(0,-26,-Math.PI/2,120,12,0);for(let i=0;i<5;i++)grow(0,6,Math.PI*(0.15+i*0.18)+(R()-0.5)*0.2+(i>2?0.1:0),70+R()*30,9,1);
  const ax=[[6,24]];let x=6,y=24,h=Math.PI*0.32;for(let i=0;i<14;i++){h+=(R()-0.5)*0.15;x+=Math.cos(h)*18;y+=Math.sin(h)*18;ax.push([x,y]);}
  const axon={pts:ax,w0:5,w1:3};const ends=[];for(let i=0;i<4;i++){const a=h+(i-1.5)*0.45;const p=[[x,y]];let xx=x,yy=y,hh=a;for(let k=0;k<4;k++){hh+=(R()-0.5)*0.3;xx+=Math.cos(hh)*12;yy+=Math.sin(hh)*12;p.push([xx,yy]);}ends.push({pts:p,w0:2.6,w1:1.2});}
  return TT_NEUR[seed]={segs,axon,ends};}
// at (x, y), size s: o.grow 0 to 1 draws its branches out from the body, o.fire 0 to 1 sends a light down its axon, o.col, o.a
function tt_neuron(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const G=tt_neurGeo(o.seed||3),col=o.col||[204,140,136],gr=o.grow==null?1:o.grow;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.lineCap="round";
  const part=(sg,v,fill)=>{if(v<=0)return;const n=sg.pts.length,m=Math.max(2,Math.ceil((n-1)*v)+1);tt_taper(ctx,sg.pts.slice(0,m),sg.w0,lerp(sg.w0,sg.w1,v),fill);};
  const each=(fn)=>{for(const sg of G.segs)fn(sg,clamp(gr*4-sg.d*0.8,0,1));fn(G.axon,clamp(gr*2.2-0.6,0,1));for(const e of G.ends)fn(e,clamp(gr*2.2-1.5,0,1));};
  // shadow, body colour, then the light along the upper side
  ctx.save();ctx.translate(-5,7);each((sg,v)=>part(sg,v,rgba(AG.shadow,0.12)));ctx.restore();
  each((sg,v)=>part(sg,v,rgba(col,1)));
  ctx.save();ctx.translate(1.2,-1.6);each((sg,v)=>{if(v<=0)return;const n=sg.pts.length,m=Math.max(2,Math.ceil((n-1)*v)+1);tt_taper(ctx,sg.pts.slice(0,m),sg.w0*0.35,sg.w1*0.3,rgba(ag_lt(col,0.5),0.7));});ctx.restore();
  ag_soft(ctx,cc=>{cc.moveTo(0,-34);cc.bezierCurveTo(18,-18,26,10,16,24);cc.bezierCurveTo(6,32,-10,32,-18,22);cc.bezierCurveTo(-26,8,-16,-18,0,-34);cc.closePath();},col,ag_lt(col,0.5),8,-12,30,rgba(ag_dk(col,0.6),0.4),8);
  ctx.fillStyle=rgba(ag_dk(col,0.25),0.7);ctx.beginPath();ctx.arc(1,2,6,0,TAU);ctx.fill();
  if(o.fire>0){const u=o.fire,pts=G.axon.pts,i=Math.min(pts.length-1,Math.floor(u*(pts.length-1))),q=pts[i];ctx.restore();ctx.save();
    const X=x+q[0]*s,Y=y+q[1]*s;tt_glow(ctx,X,Y,34*s,Math.sin(Math.PI*u));ctx.restore();return;}
  ctx.restore();}
// the perceptron: n inputs from the left, a dial on each, a sum, a light; centred on (x, y), size s; o.p 0 to 1 draws it on, o.fire 0 to 1
// lights it, o.needles [radians], o.col (blue by default; violet for the model)
function tt_perceptron(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const n=o.n||5,p=o.p==null?1:o.p,col=o.col||AG.blue,fire=o.fire||0;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.lineCap="round";ctx.lineWidth=3;
  const sx=40,ox=230;for(let i=0;i<n;i++){const yy=(i-(n-1)/2)*56,v=clamp(p*2-i*0.12,0,1);if(v<=0)continue;ctx.strokeStyle=rgba(col,0.9);ctx.beginPath();ctx.moveTo(-220,yy);ctx.lineTo(lerp(-220,sx-30,v),lerp(yy,0,v*v));ctx.stroke();
    // the dial: a small round face with a needle
    const dx=-140,dy=yy+(0-yy)*((dx+220)/(sx-30+220));ctx.fillStyle="#F4F2EE";ctx.beginPath();ctx.arc(dx,dy,15,0,TAU);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.5;ctx.stroke();
    const nd=(o.needles?o.needles[i]:(-0.8+i*0.4));ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+Math.cos(nd-Math.PI/2)*11,dy+Math.sin(nd-Math.PI/2)*11);ctx.stroke();ctx.lineWidth=3;
    ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(-220,yy,6,0,TAU);ctx.fill();}
  const v2=clamp(p*2-0.8,0,1);if(v2>0){ctx.fillStyle="#F4F2EE";ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.beginPath();ctx.arc(sx,0,30,0,TAU);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx-13,0);ctx.lineTo(sx+13,0);ctx.moveTo(sx,-13);ctx.lineTo(sx,13);ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx+30,0);ctx.lineTo(lerp(sx+30,ox-18,clamp(p*2-1,0,1)),0);ctx.stroke();}
  const v3=clamp(p*2-1.6,0,1);if(v3>0){ctx.restore();ctx.save();ctx.globalAlpha*=a*v3;const LX=x+ox*s,LY=y;if(fire>0)tt_glow(ctx,LX,LY,60*s,fire,mix(col,[255,255,255],0.5));
    ctx.fillStyle=rgba(mix([244,242,238],mix(col,[230,240,250],0.4),fire),1);ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3*s;ctx.beginPath();ctx.arc(LX,LY,18*s,0,TAU);ctx.fill();ctx.stroke();}
  ctx.restore();return{light:[x+ox*s,y],sum:[x+sx*s,y]};}
// copies of it, multiplying into a lattice: layers of small nodes and the lines between them, blue turning violet (u 0 to 1 how many),
// gathering into the agent's band at (bx, by) as g goes 0 to 1
function tt_lattice(ctx,x,y,w,h,u,g,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0||u<=0)return;const L=Math.max(2,Math.round(lerp(2,14,u))),N=Math.max(2,Math.round(lerp(3,9,u))),bx=o.bx||x,by=o.by||y;
  const col=mix(AG.blue,AG.violet,clamp(u*1.4-0.3,0,1)),P=(i,j)=>{const px=x+(i/(L-1)-0.5)*w,py=y+(j/(N-1)-0.5)*h;return[lerp(px,bx+(i/(L-1)-0.5)*100,ag_sine(g)),lerp(py,by+(j/(N-1)-0.5)*20,ag_sine(g))];};
  ctx.save();ctx.globalAlpha*=a*(1-0.8*g);ctx.strokeStyle=rgba(col,0.16);ctx.lineWidth=1.2;for(let i=0;i<L-1;i++)for(let j=0;j<N;j++)for(let k=0;k<N;k++){if((j+k+i)%2)continue;const A=P(i,j),B=P(i+1,k);ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();}
  ctx.fillStyle=rgba(col,0.85);for(let i=0;i<L;i++)for(let j=0;j<N;j++){const q=P(i,j);ctx.beginPath();ctx.arc(q[0],q[1],lerp(5,2,g),0,TAU);ctx.fill();}ctx.restore();}
// a row of words, each first a soft violet guess, then the word written into it: words at (x, y) 36 px; o.at [the moment each comes],
// t; o.guess how long before its word a guess lights; returns the right edge of the last word shown
function tt_wordRow(ctx,words,x,y,t,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||36,gl=o.guess||0.45;let xx=x;if(a<=0)return x;ctx.save();ctx.globalAlpha*=a;
  words.forEach((w,i)=>{const at=o.at[i],ww=ag_tw(ctx,w,{w:700,size}),gu=ag_io(t,at-gl,at+0.5,0.25),wv=ag_in(t,at,0.3);
    if(gu>0){ctx.save();ctx.globalAlpha*=gu;ctx.shadowColor=rgba(AG.violet,0.6);ctx.shadowBlur=16;ctx.fillStyle=rgba(AG.violet,0.22);rr(ctx,xx-8,y-size*0.86,ww+16,size*1.2,12);ctx.fill();ctx.restore();}
    if(wv>0)ag_T(ctx,w,xx,y,{w:700,size,col:o.col||AG.violet,a:wv});xx+=ww+size*0.36;});ctx.restore();return xx;}
// the agent's ring in miniature round a guess and an error: predict, compare, learn; o.p draws it, o.dotted 0 to 1 turns its way back
// (learn to predict) into a dotted line with a question mark
function tt_miniLoop(ctx,x,y,R,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const p=o.p==null?1:o.p,dt=o.dotted||0;
  ag_ring(ctx,x,y,R,{p:p*(dt>0?lerp(1,0.66,clamp(dt*3,0,1)):1),from:-90,arrows:[-30,90,210].filter(d=>(d+90)/360<p)});
  if(dt>0){ctx.save();ctx.globalAlpha*=clamp(dt*3,0,1);ctx.strokeStyle=rgba(AG_OAK.dark,0.9);ctx.lineWidth=5*R/180;ctx.setLineDash([3,12*R/180]);ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,R,-90*Math.PI/180+TAU*0.665,-90*Math.PI/180+TAU);ctx.stroke();ctx.restore();
    ag_T(ctx,"?",x-R*0.92,y-R*0.62,{w:800,size:52,align:"center",col:AG.amber,a:clamp(dt*2-0.6,0,1)});}
  const st=[["predict",-90],["compare",30],["learn",150]];st.forEach((sx,i)=>{const d=sx[1]*Math.PI/180,v=clamp(p*3-i,0,1);if(v>0)ag_step(ctx,x+Math.cos(d)*R,y+Math.sin(d)*R,sx[0],{a:v,on:o.lit===i?AG.violet:null});});
  // in the middle: a guess (violet) and the error (amber), side by side
  const gv=o.guess==null?1:o.guess;if(gv>0){ctx.save();ctx.globalAlpha*=gv;ctx.shadowColor=rgba(AG.violet,0.5);ctx.shadowBlur=12;ctx.fillStyle=rgba(AG.violet,0.85);ctx.beginPath();ctx.arc(x-22,y,13,0,TAU);ctx.fill();ctx.restore();}
  const ev=o.error==null?1:o.error;if(ev>0){ctx.save();ctx.globalAlpha*=ev;ctx.strokeStyle=rgba(AG.amber,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+14,y-10);ctx.lineTo(x+34,y+10);ctx.moveTo(x+34,y-10);ctx.lineTo(x+14,y+10);ctx.stroke();ctx.restore();}
  ctx.restore();}
// rows of guesses at three levels, each lighting at its own pace: the next word, the sentence, the story
function tt_levels(ctx,x,y,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const rows=[["the next word",1.6,14],["the sentence",0.6,6],["the story",0.22,2]];ctx.save();ctx.globalAlpha*=a;
  rows.forEach((r,i)=>{const v=o.rows?o.rows[i]:1;if(v<=0)return;const yy=y+i*86;ag_T(ctx,r[0],x,yy+10,{w:700,size:30,col:AG.ink,a:v});const n=r[2],x0=x+260,w=560,bw=w/n-10;
    for(let k=0;k<n;k++){const ph=((t*r[1]-k/n)%1+1)%1,lit=Math.pow(Math.max(0,1-ph*n*0.9),1.5);ctx.save();ctx.globalAlpha*=v;ctx.fillStyle=rgba(AG.violet,0.14+0.6*lit);if(lit>0.2){ctx.shadowColor=rgba(AG.violet,0.6);ctx.shadowBlur=12*lit;}rr(ctx,x0+k*(bw+10),yy-14,bw,30,12);ctx.fill();ctx.restore();}});
  ctx.restore();}
// a network's layers, columns of small blue nodes and the lines between them: n layers (5 to 8, fractional as one more comes in)
function tt_layers(ctx,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const L=Math.ceil(n),N=6,gap=58,hh=56;ctx.save();ctx.globalAlpha*=a;
  const P=(i,j)=>[x+i*gap,y+(j-(N-1)/2)*hh];for(let i=0;i<L-1;i++){const v=clamp(n-i-1,0,1);if(v<=0)continue;ctx.strokeStyle=rgba(AG.blue,0.18*v);ctx.lineWidth=1.2;for(let j=0;j<N;j++)for(let k=0;k<N;k++){const A=P(i,j),B=P(i+1,k);ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();}}
  for(let i=0;i<L;i++){const v=clamp(n-i,0,1);if(v<=0)continue;const k=ag_spr(v,0,0.5);for(let j=0;j<N;j++){const q=P(i,j);ctx.fillStyle=rgba(AG.blue,v);ctx.beginPath();ctx.arc(q[0],q[1],9*k,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.45)";ctx.beginPath();ctx.arc(q[0]-2.5,q[1]-2.5,3*k,0,TAU);ctx.fill();}}
  ctx.restore();return{w:(L-1)*gap,h:(N-1)*hh};}

/* ---------------------------------------------------------------- three hands at a table, seen from above, and what they draw
   A hand holding a pencil, its arm coming in from the frame's edge: the grandmother's, the parent's, the child's. The drawing grows on
   one sheet: a house, a tree, a sun with a face no one else would have drawn. */
// a hand from above at (x, y) (the pencil's tip), its arm coming in from angle ang (radians, pointing from the tip back to the arm),
// size s, drawn like the module's hands (one soft shape for the fingers, the thumb, faint creases); o.skin, o.sleeve, o.age (fine lines
// and spots on the back of the hand), o.pencil false for an empty hand, o.a
function tt_handTop(ctx,x,y,ang,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const sk=o.skin||[226,186,156],sl=o.sleeve||[150,140,124],shade=rgba(mix(sk,[60,20,10],0.55),0.36);
  const base=mix(sk,ag_dk(sk,0.4),0.12),hi=mix(sk,[255,240,228],0.42);ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);
  // (local: +x runs back up the pencil towards the arm, the tip at 0, 0; -y is the thumb's side)
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.3)";ctx.shadowBlur=28;ctx.shadowOffsetX=-12;ctx.shadowOffsetY=18;
  ag_soft(ctx,cc=>{cc.moveTo(262,-62);cc.bezierCurveTo(500,-72,700,-80,1000,-86);cc.lineTo(1000,96);cc.bezierCurveTo(700,90,500,80,262,62);cc.bezierCurveTo(248,28,248,-30,262,-62);cc.closePath();},sl,ag_lt(sl,0.28),460,-50,320,rgba(ag_dk(sl,0.6),0.4),18);
  // the hand: the back of it and the fingers curled under, one soft shape, with its shadow on the table
  const body=cc=>{cc.moveTo(250,-48);cc.bezierCurveTo(212,-50,170,-46,128,-38);cc.bezierCurveTo(98,-32,72,-20,62,-2);cc.bezierCurveTo(54,14,62,34,82,44);cc.bezierCurveTo(110,58,150,60,186,54);cc.bezierCurveTo(212,50,232,48,250,48);cc.closePath();};
  ag_soft(ctx,body,base,hi,150,-20,130,shade,12);ctx.restore();
  ctx.strokeStyle=rgba(mix(sk,[70,24,14],0.5),0.3);ctx.lineWidth=2.2;ctx.lineCap="round";for(const k of [[78,8],[86,26],[104,42]]){ctx.beginPath();ctx.moveTo(k[0],k[1]);ctx.quadraticCurveTo(k[0]+16,k[1]-2,k[0]+28,k[1]+4);ctx.stroke();}
  // the pencil, from its point back past the web of the hand
  if(o.pencil!==false){ctx.save();const L=220;ctx.rotate(-0.25);ctx.fillStyle="#4C4A48";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(12,-3);ctx.lineTo(12,3);ctx.closePath();ctx.fill();
    ctx.fillStyle="#E8CFA2";ctx.beginPath();ctx.moveTo(10,-3.4);ctx.lineTo(34,-8);ctx.lineTo(34,8);ctx.lineTo(10,3.4);ctx.closePath();ctx.fill();
    ctx.fillStyle=o.pencilCol||"#C9A13A";ctx.fillRect(34,-8,L,16);ctx.fillStyle="rgba(255,255,255,0.32)";ctx.fillRect(36,-7,L-4,4);ctx.fillStyle="rgba(0,0,0,0.12)";ctx.fillRect(36,3,L-4,4);
    ctx.fillStyle="#B9B4AC";ctx.fillRect(34+L,-8.5,16,17);ctx.fillStyle="#D88A8A";rr(ctx,50+L,-8,14,16,4);ctx.fill();ctx.restore();}
  // the index finger along the pencil, and the thumb beside it
  const pen=o.pencil!==false;
  ag_soft(ctx,cc=>{cc.moveTo(140,-40);cc.bezierCurveTo(110,-40,72,-34,46,-22);cc.bezierCurveTo(34,-16,32,-4,42,-2);cc.bezierCurveTo(70,0,104,-6,136,-12);cc.closePath();},mix(sk,ag_dk(sk,0.4),pen?0.06:0.1),hi,96,-30,60,shade,7);
  ag_soft(ctx,cc=>{cc.moveTo(214,-50);cc.bezierCurveTo(176,-62,128,-64,92,-54);cc.bezierCurveTo(74,-49,70,-38,82,-34);cc.bezierCurveTo(116,-30,166,-30,206,-30);cc.closePath();},mix(sk,ag_dk(sk,0.4),0.04),hi,130,-54,56,shade,6);
  ctx.fillStyle=rgba(ag_lt(sk,0.5),0.55);ctx.beginPath();ctx.ellipse(48,-12,9,6,-0.3,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(88,-44,10,6,-0.15,0,TAU);ctx.fill();
  if(o.age){ctx.strokeStyle=rgba(mix(sk,[80,30,16],0.5),0.22);ctx.lineWidth=1.6;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(150+i*18,-28+i*4);ctx.quadraticCurveTo(160+i*18,0,154+i*18,30);ctx.stroke();}
    ctx.fillStyle=rgba(mix(sk,[130,80,46],0.5),0.3);for(const p of [[160,-14],[186,16],[150,30],[204,-20]]){ctx.beginPath();ctx.arc(p[0],p[1],4,0,TAU);ctx.fill();}}
  ctx.restore();}
// the drawing on the sheet: a house (h 0 to 1), a tree (r), a sun with a face (u), each drawn stroke by stroke; returns where the
// pencil is (null when no stroke is being drawn)
const TT_DRAW=(()=>{const crown=[];for(let i=0;i<=44;i++){const an=Math.PI*0.5+i/44*TAU,rad=74*(1+0.1*Math.sin(an*6));crown.push([40+Math.cos(an)*rad*1.05,-28+Math.sin(an)*rad]);}
  const sun=[];for(let i=0;i<=28;i++){const an=-Math.PI/2+i/28*TAU;sun.push([250+Math.cos(an)*48,-60+Math.sin(an)*48]);}
  return{house:[[[-300,-10],[-300,120],[-180,120],[-180,-10],[-300,-10]],[[-312,-2],[-240,-82],[-168,-2]],[[-226,120],[-226,60],[-198,60],[-198,120]],[[-282,14],[-252,14],[-252,42],[-282,42],[-282,14]]],
    tree:[[[30,120],[34,44]],[[50,120],[46,44]],crown],sun:[sun]};})();
function tt_drawing(ctx,x,y,s,h,r,u){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle="rgba(70,66,62,0.88)";ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";let tip=null;
  const len=pts=>{let L=0;for(let i=1;i<pts.length;i++)L+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);return L;};
  const path=(pts,left)=>{ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);let last=pts[0];for(let i=1;i<pts.length&&left>0;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]),f=Math.min(1,left/d);
      last=[lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f)];ctx.lineTo(last[0],last[1]);left-=d;}ctx.stroke();return last;};
  const strokes=(list,v)=>{if(v<=0)return;const Ls=list.map(len),tot=Ls.reduce((p,q)=>p+q,0);let left=tot*clamp(v,0,1);list.forEach((pts,i)=>{if(left<=0)return;const q=path(pts,left);if(left<Ls[i]&&v<1)tip=q;left-=Ls[i];});};
  strokes(TT_DRAW.house,h);strokes(TT_DRAW.tree,r);strokes(TT_DRAW.sun,clamp(u*2,0,1));
  for(let i=0;i<8;i++){const an=i/8*TAU+0.2,v=clamp((u*2-1-i*0.06)/0.32,0,1);if(v>0){const q=path([[250+Math.cos(an)*62,-60+Math.sin(an)*62],[250+Math.cos(an)*90,-60+Math.sin(an)*90]],28*v);if(v<1)tip=q;}}
  // the face: two eyes and a wide smile, and one eyebrow raised, the child's own idea
  const f=clamp(u*3-2.1,0,1);if(f>0){ctx.fillStyle="rgba(70,66,62,0.88)";ctx.globalAlpha*=f;ctx.beginPath();ctx.arc(234,-70,5,0,TAU);ctx.arc(266,-70,5,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(250,-56,24,0.25,Math.PI-0.25);ctx.stroke();ctx.beginPath();ctx.moveTo(258,-84);ctx.lineTo(276,-90);ctx.stroke();if(f<1)tip=[262,-40];}
  ctx.restore();return tip?[x+tip[0]*s,y+tip[1]*s]:null;}

/* ---------------------------------------------------------------- three ways to be creative (Boden): three cards */
// combine: two shapes join into a new one; explore: a path winding inside a fenced field; change the rules: the fence itself lifted and
// moved. Each card w x 300 at (x, y); u 0 to 1 plays its picture; v 0 to 1 the agent's violet lines in it (and its glow)
function tt_bodenCard(ctx,kind,x,y,w,u,v,o){o=o||{};const a=o.a==null?1:o.a,h=330;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.5,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:v>0.05?AG.violet:null,edgeA:0.8*v,glow:v>0.05?AG.violet:null});const cx=x+w/2,cy=y+130;ctx.lineCap="round";ctx.lineJoin="round";
  const ink="rgba(70,66,62,0.85)",vio=rgba(AG.violet,0.9*v);
  if(kind==="combine"){const d=lerp(70,26,ag_sine(u));ctx.strokeStyle=ink;ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx-d,cy,52,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+d,cy-56);ctx.lineTo(cx+d+56,cy+44);ctx.lineTo(cx+d-56,cy+44);ctx.closePath();ctx.stroke();
    if(v>0){ctx.strokeStyle=vio;ctx.lineWidth=5;const e=lerp(26,10,v);ctx.beginPath();ctx.arc(cx-e,cy+6,40,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(cx+e+8,cy-40);ctx.lineTo(cx+e+50,cy+36);ctx.lineTo(cx+e-34,cy+36);ctx.closePath();ctx.stroke();}}
  else{const fx=cx-110,fw=220+(kind==="rules"?ag_sine(u)*0:0),fy=cy-80,fh=160,mv=kind==="rules"?ag_sine(u):0;
    // the fence: posts and a rail; in "change the rules" its right side lifts and moves out
    ctx.strokeStyle="rgba(150,116,82,0.95)";ctx.lineWidth=4;const right=fx+fw+mv*70,lift=Math.sin(Math.PI*mv)*-26;
    ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(fx+fw,fy);ctx.moveTo(fx,fy+fh);ctx.lineTo(fx+fw,fy+fh);ctx.moveTo(fx,fy);ctx.lineTo(fx,fy+fh);ctx.stroke();
    if(mv>0){ctx.setLineDash([4,8]);ctx.strokeStyle="rgba(150,116,82,0.5)";ctx.beginPath();ctx.moveTo(fx+fw,fy);ctx.lineTo(right,fy);ctx.moveTo(fx+fw,fy+fh);ctx.lineTo(right,fy+fh);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle="rgba(150,116,82,0.95)";}
    ctx.beginPath();ctx.moveTo(right,fy+lift);ctx.lineTo(right,fy+fh+lift);ctx.stroke();for(let i=0;i<5;i++){ctx.fillStyle="rgba(150,116,82,0.95)";ctx.fillRect(fx-4+i*(fw/4),fy-8,8,16);ctx.fillRect(fx-4+i*(fw/4),fy+fh-8,8,16);}
    for(let i=0;i<3;i++)ctx.fillRect(right-4,fy+i*(fh/2)-8+lift,8,16);
    // a path winding inside it
    const pth=[fx+20,fy+fh-24,fx+80,fy+20,fx+140,fy+fh-10,fx+fw-24,fy+30];ctx.strokeStyle=ink;ctx.lineWidth=3.5;ctx.setLineDash([2,10]);ag_bzPath(ctx,pth,0,kind==="explore"?Math.max(0.15,ag_sine(u)):1,40);ctx.stroke();ctx.setLineDash([]);
    if(kind==="rules"&&mv>0){ctx.strokeStyle=ink;ctx.setLineDash([2,10]);ag_bzPath(ctx,[fx+fw-24,fy+30,fx+fw+10,fy+60,right-20,fy+40,right-26,fy+fh-30],0,mv,20);ctx.stroke();ctx.setLineDash([]);}
    if(v>0&&kind==="explore"){ctx.strokeStyle=vio;ctx.lineWidth=4;ag_bzPath(ctx,[fx+24,fy+30,fx+110,fy+fh-10,fx+120,fy+20,fx+fw-30,fy+fh-24],0,v,40);ctx.stroke();}}
  ag_T(ctx,kind==="combine"?"combine":kind==="explore"?"explore":"change the rules",cx,y+h-36,{w:700,size:32,align:"center"});ctx.restore();}
// a short poem the agent writes, in violet: each word made of a few small pages that fly out of the sphere at o.src and settle into it.
// Its words come one after another from t0 (o.rate seconds apart, a longer rest at each line's end); at (x, y), lines 62 px apart
const TT_POEM=["Morning light on the steps,","a term begins again:","new names in the register,","old trees by the gate."];
function tt_poemAt(t0,o){o=o||{};const rate=o.rate||0.3,out=[];let k=0;TT_POEM.forEach((ln,i)=>{ln.split(" ").forEach(()=>{out.push(t0+k*rate+i*0.45);k++;});});return out;}
function tt_poem(ctx,x,y,t,t0,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const size=o.size||40,src=o.src||[x+900,y],at=tt_poemAt(t0,o),fly=0.6;let k=0;ctx.save();ctx.globalAlpha*=a;
  TT_POEM.forEach((ln,i)=>{let xx=x;const yy=y+i*62;ln.split(" ").forEach(w=>{const tw=at[k],ww=ag_tw(ctx,w,{w:700,size}),cx=xx+ww/2,cy=yy-size*0.32;
    // the pages: four for each word, from the sphere on an arc, shrinking as they come in
    for(let j=0;j<4;j++){const u=clamp((t-(tw-fly)+j*0.05)/fly,0,1);if(u<=0||u>=1)continue;const q=ag_sine(u),px=lerp(src[0],cx+(j-1.5)*ww*0.22,q),py=lerp(src[1],cy,q)-Math.sin(Math.PI*q)*(60+j*18),sc=lerp(0.9,0.45,q);
      ctx.save();ctx.translate(px,py);ctx.rotate((1-q)*(j%2?0.7:-0.5));ctx.scale(sc,sc);ctx.globalAlpha*=Math.min(1,u*5)*(1-Math.max(0,(u-0.8)/0.2));ag_box(ctx,-14,-18,28,36,3,{});
      ctx.fillStyle=rgba(AG.violet,0.6);for(let l=0;l<3;l++)ctx.fillRect(-8,-10+l*8,l===2?9:16,2.5);ctx.restore();}
    const wv=ag_in(t,tw-0.12,0.3);if(wv>0)ag_T(ctx,w,xx,yy,{w:700,size,col:AG.violet,a:wv});xx+=ww+size*0.3;k++;});});
  ctx.restore();}

/* ---------------------------------------------------------------- the worm, its copy and its map */
// a worm a millimetre long, drawn L px long, centred on (x, y), wriggling with t: a translucent body tapering to a sharp tail, the gut
// inside, its 302 neurons as dots (most in a ring near the head) and fine lines; o.blue draws it as the copy, in blue lines only
function tt_wormPts(x,y,L,t,amp){const pts=[];for(let i=0;i<=40;i++){const u=i/40,xx=x-L/2+u*L,w=Math.sin(TAU*(u*1.3-t*0.45))*amp*(0.4+u*0.8);pts.push([xx,y+w]);}return pts;}
function tt_worm(ctx,x,y,L,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const amp=o.amp==null?L*0.045:o.amp,pts=tt_wormPts(x,y,L,t,amp),n=pts.length-1;
  const W=u=>L*0.05*(u<0.08?Math.sqrt(u/0.08)*0.85+0.15:u>0.75?Math.max(0.04,1-(u-0.75)/0.25):1);
  const side=(k)=>pts.map((p,i)=>{const q=pts[Math.min(n,i+1)],r=pts[Math.max(0,i-1)],dx=q[0]-r[0],dy=q[1]-r[1],d=Math.hypot(dx,dy)||1,w=W(i/n)*k;return[p[0]-dy/d*w,p[1]+dx/d*w];});
  const L1=side(1),R1=side(-1),body=c=>{c.moveTo(L1[0][0],L1[0][1]);for(let i=1;i<=n;i++)c.lineTo(L1[i][0],L1[i][1]);for(let i=n;i>=0;i--)c.lineTo(R1[i][0],R1[i][1]);c.closePath();};
  ctx.save();ctx.globalAlpha*=a;
  if(o.blue){ctx.strokeStyle=rgba(AG.blue,0.95);ctx.lineWidth=3;ctx.lineJoin="round";ctx.beginPath();body(ctx);ctx.stroke();ctx.strokeStyle=rgba(AG.blue,0.5);ctx.lineWidth=2;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    ctx.fillStyle=rgba(AG.blue,0.8);for(let i=1;i<14;i++){const u=i<6?0.06+i*0.012:0.15+i*0.055,p=pts[Math.round(u*n)];ctx.beginPath();ctx.arc(p[0],p[1]+(i%2?3:-3),3.2,0,TAU);ctx.fill();}ctx.restore();return;}
  // its shadow on the floor, then the body, see-through
  ctx.save();ctx.translate(-8,14);ctx.filter="blur(6px)";ctx.beginPath();body(ctx);ctx.fillStyle=rgba(AG.shadow,0.22);ctx.fill();ctx.restore();
  ctx.beginPath();body(ctx);ctx.fillStyle="rgba(246,238,222,0.62)";ctx.fill();ctx.strokeStyle="rgba(150,126,100,0.6)";ctx.lineWidth=2;ctx.stroke();
  ctx.save();ctx.beginPath();body(ctx);ctx.clip();ctx.strokeStyle="rgba(255,255,255,0.4)";ctx.lineWidth=L*0.008;ctx.filter="blur(2px)";ctx.beginPath();R1.forEach((p,i)=>{const q=[lerp(p[0],pts[i][0],0.4),lerp(p[1],pts[i][1],0.4)];i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.stroke();ctx.filter="none";
    // the gut, and the pharynx's two bulbs near the head
    ctx.strokeStyle="rgba(190,160,120,0.45)";ctx.lineWidth=L*0.022;ctx.beginPath();pts.slice(Math.round(n*0.12),Math.round(n*0.86)).forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
    for(const u of [0.05,0.1]){const p=pts[Math.round(u*n)];ctx.fillStyle="rgba(196,160,120,0.45)";ctx.beginPath();ctx.ellipse(p[0],p[1],L*0.016,L*0.022,0,0,TAU);ctx.fill();}
    // the neurons: a ring near the head, a cord along the belly, a few at the tail; fine lines between
    const R=ag_rnd(11),dots=[];for(let i=0;i<70;i++){const u=i<34?0.075+R()*0.05:i<60?0.14+R()*0.62:0.82+R()*0.06,p=pts[Math.round(u*n)],off=(R()-0.5)*W(u)*1.2;dots.push([p[0],p[1]+off]);}
    ctx.strokeStyle="rgba(170,110,100,0.28)";ctx.lineWidth=1;for(let i=0;i<dots.length-1;i++){if(i%3===2)continue;ctx.beginPath();ctx.moveTo(dots[i][0],dots[i][1]);ctx.lineTo(dots[i+1][0],dots[i+1][1]);ctx.stroke();}
    ctx.fillStyle="rgba(178,104,96,0.75)";for(const d of dots){ctx.beginPath();ctx.arc(d[0],d[1],Math.max(1.6,L*0.0042),0,TAU);ctx.fill();}
  ctx.restore();ctx.restore();}
// the map of a wiring, flat, in the worm's shape: a ring of nodes near its head and two cords along its body, the lines between them;
// on each of many lines a small blank dial (dials 0 to 1): how strong? when? Centred on (x, y), w by h
const TT_WMAP=(()=>{const N=[],E=[];for(let i=0;i<6;i++){const an=i/6*TAU;N.push([0.1+Math.cos(an)*0.045,Math.sin(an)*0.5]);}
  for(let i=0;i<6;i++)E.push([i,(i+1)%6]);const top=[],bot=[];for(let k=0;k<7;k++){const u=0.24+k*0.11;top.push(N.length);N.push([u,-0.32+(k%2)*0.06]);bot.push(N.length);N.push([u+0.05,0.36-(k%2)*0.06]);}
  E.push([0,top[0]],[2,top[0]],[3,bot[0]],[5,bot[0]]);for(let k=0;k<7;k++){E.push([top[k],bot[k]]);if(k<6){E.push([top[k],top[k+1]],[bot[k],bot[k+1]]);if(k%2===0)E.push([top[k],bot[k+1]]);}}
  return{N,E};})();
function tt_wireMap(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const M=TT_WMAP,P=i=>{const n=M.N[i];return[x+(n[0]-0.5)*w,y+n[1]*h+Math.sin(n[0]*TAU*0.9)*h*0.18];},col=o.col||AG.blue,dr=o.draw==null?1:o.draw;ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=rgba(col,0.75);ctx.lineWidth=3;ctx.lineCap="round";M.E.forEach((e,k)=>{const v=clamp(dr*1.4-k/M.E.length*0.4,0,1);if(v<=0)return;const A=P(e[0]),B=P(e[1]);ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(lerp(A[0],B[0],v),lerp(A[1],B[1],v));ctx.stroke();});
  const d=o.dials||0;if(d>0){M.E.forEach((e,k)=>{if(k%2)return;const v=clamp(d*1.6-k*0.025,0,1);if(v<=0)return;const A=P(e[0]),B=P(e[1]),m=[(A[0]+B[0])/2,(A[1]+B[1])/2],r=16*ag_spr(v,0,0.4);
    ctx.fillStyle="#F6F4F0";ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(m[0],m[1],r,0,TAU);ctx.fill();ctx.stroke();ctx.lineWidth=2;for(let q=0;q<5;q++){const an=Math.PI*(0.8+q*0.35);ctx.beginPath();ctx.moveTo(m[0]+Math.cos(an)*r*0.6,m[1]+Math.sin(an)*r*0.6);ctx.lineTo(m[0]+Math.cos(an)*r*0.84,m[1]+Math.sin(an)*r*0.84);ctx.stroke();}
    ctx.fillStyle=rgba(col,0.35);ctx.beginPath();ctx.arc(m[0],m[1],2.5,0,TAU);ctx.fill();});}
  M.N.forEach((n,i)=>{const v=clamp(dr*2-i/M.N.length,0,1);if(v<=0)return;const q=P(i);ctx.fillStyle=rgba(col,v);ctx.beginPath();ctx.arc(q[0],q[1],9,0,TAU);ctx.fill();ctx.fillStyle=rgba([255,255,255],0.5*v);ctx.beginPath();ctx.arc(q[0]-2.5,q[1]-2.5,3,0,TAU);ctx.fill();});
  ctx.restore();}

/* ---------------------------------------------------------------- a page of notepaper, and words that arrive at a listener */
// a sheet of notepaper (x, y, w, h), its faint rules and margin, a soft shadow; o.rot turns it a little about its centre
function tt_page(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.26)";ctx.shadowBlur=30;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=14;ctx.fillStyle="#F4F0E4";ctx.fillRect(0,0,w,h);ctx.restore();
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"rgba(255,255,255,0.35)");g.addColorStop(1,"rgba(120,100,70,0.08)");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  if(o.rules!==false){ctx.strokeStyle="rgba(110,140,170,0.16)";ctx.lineWidth=2;for(let yy=110;yy<h-30;yy+=52){ctx.beginPath();ctx.moveTo(24,yy);ctx.lineTo(w-24,yy);ctx.stroke();}
  ctx.strokeStyle="rgba(190,110,100,0.2)";ctx.beginPath();ctx.moveTo(110,20);ctx.lineTo(110,h-20);ctx.stroke();}ctx.restore();}
// the words of a story arriving at a listener who faces them: a row that starts at x0 at t0 and moves left (o.speed px a second) into
// the head at hx, each word fading as it goes in. Just before each word arrives (o.lead seconds), a soft violet guess lights where it
// will land, the word itself faint inside it, and the word arrives into it. Returns how strongly a guess is lit now (0 to 1)
function tt_listen(ctx,words,x0,hx,y,t,t0,o){o=o||{};const a=o.a==null?1:o.a,size=o.size||36,sp=o.speed||150,lead=o.lead||0.55;let g=0,xx=x0;const off=sp*Math.max(0,t-t0);
  ctx.save();ctx.globalAlpha*=a;for(const w of words){const ww=ag_tw(ctx,w,{w:700,size}),left=xx-off,arrive=t0+(xx-hx)/sp,v=ag_in(t,arrive-lead,0.25)*(1-ag_in(t,arrive+0.05,0.3));g=Math.max(g,v);
    if(v>0.01){ctx.save();ctx.globalAlpha*=v;ctx.shadowColor=rgba(AG.violet,0.6);ctx.shadowBlur=18;ctx.fillStyle=rgba(AG.violet,0.2);rr(ctx,hx-10,y-size*0.86,ww+20,size*1.2,14);ctx.fill();ctx.restore();
      ag_T(ctx,w,hx,y,{w:700,size,col:AG.violet,a:v*0.45*(1-ag_in(t,arrive-0.15,0.2))});}
    if(left<W+40&&left+ww>hx-10){const fade=clamp((left-hx+ww*0.3)/(ww*0.3),0,1)*(1-ag_in(t,arrive+0.05,0.3));if(fade>0)ag_T(ctx,w,left,y,{w:700,size,col:AG.ink,a:fade});}
    xx+=ww+size*0.36;}ctx.restore();return g*a;}
// a guess lighting in a head at (x, y): a soft violet light (v 0 to 1, r its radius)
function tt_headGuess(ctx,x,y,r,v){if(v<=0.01)return;ctx.save();const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(AG.violet,0.24*v));g.addColorStop(0.6,rgba(AG.violet,0.08*v));g.addColorStop(1,rgba(AG.violet,0));
  ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore();}

/* ---------------------------------------------------------------- the fly, its brain's map, and ours
   A fruit fly seen from above: six legs tapering at each joint, veined wings folded back, brick-red eyes. Its brain's map, a dense
   tangle: warm for the real brain, blue for the model built from the map. A human head's outline beside it, for scale in words. */
// a fruit fly at (x, y) facing up, size s (its body about 260 s px long); o.t twitches its legs a little, o.a
function tt_fly(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const t=o.t||0;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.lineCap="round";ctx.lineJoin="round";
  const leg=[60,50,44];ag_floorShadow(ctx,-6,30,150,40,0.22);
  // the legs: three pairs, each three segments thinning to the foot
  const legs=[[[-30,-40],[-80,-80],[-110,-150],[-122,-196]],[[-34,-10],[-100,-14],[-150,24],[-190,30]],[[-30,16],[-86,60],[-118,130],[-140,190]]];
  for(const L of legs)for(const sd of [-1,1]){const tw=Math.sin(t*3+L[0][1]*0.1+sd)*3;const p=L.map((q,i)=>[q[0]*(sd<0?1:-1)+(i>1?tw*sd:0),q[1]+(i>2?tw:0)]);
    for(let i=0;i<3;i++)tt_taper(ctx,[p[i],p[i+1]],lerp(11,4,i/2),lerp(8,2.4,i/2),rgba(leg,1));ctx.fillStyle=rgba(leg,1);for(let i=1;i<3;i++){ctx.beginPath();ctx.arc(p[i][0],p[i][1],lerp(5,2.6,i/2),0,TAU);ctx.fill();}}
  // the abdomen with its dark bands, the thorax with a few bristles, the head with its two big eyes
  const abd=cc=>cc.ellipse(0,74,50,78,0,0,TAU);ag_soft(ctx,abd,[196,154,96],[236,206,150],-14,50,80,"rgba(70,40,20,0.35)",12);
  ctx.save();ag_shape(ctx,abd);ctx.clip();ctx.fillStyle="rgba(78,54,38,0.75)";for(const yy of [62,92,120,146]){ctx.beginPath();ctx.ellipse(0,yy,60,9,0,0,TAU);ctx.fill();}ctx.restore();
  const thx=cc=>cc.ellipse(0,-14,44,48,0,0,TAU);ag_soft(ctx,thx,[176,132,80],[226,190,136],-12,-30,60,"rgba(70,40,20,0.35)",10);
  ctx.strokeStyle="rgba(50,36,26,0.8)";ctx.lineWidth=2;for(const b of [[-20,-40,-30,-58],[20,-40,30,-58],[-12,-20,-18,-40],[12,-20,18,-40],[-24,4,-36,-6],[24,4,36,-6]]){ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(b[2],b[3]);ctx.stroke();}
  const hd=cc=>cc.ellipse(0,-72,42,26,0,0,TAU);ag_soft(ctx,hd,[186,140,86],[226,190,136],-6,-80,40,"rgba(70,40,20,0.35)",8);
  for(const sd of [-1,1]){const ey=cc=>cc.ellipse(sd*30,-74,20,24,sd*0.3,0,TAU);ag_soft(ctx,ey,[166,48,38],[226,110,90],sd*26,-84,22,"rgba(60,10,10,0.4)",6);
    ctx.save();ag_shape(ctx,ey);ctx.clip();ctx.fillStyle="rgba(90,20,16,0.35)";for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){ctx.beginPath();ctx.arc(sd*30+i*6+(j%2)*3,-74+j*6,1.4,0,TAU);ctx.fill();}ctx.restore();
    ctx.strokeStyle="rgba(60,40,30,0.85)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sd*8,-94);ctx.lineTo(sd*14,-110);ctx.quadraticCurveTo(sd*26,-122,sd*34,-118);ctx.stroke();}
  // the wings, folded back in a V over the abdomen: see-through, with their veins
  for(const sd of [-1,1]){ctx.save();ctx.translate(sd*16,-6);ctx.rotate(sd*0.32);const wg=cc=>{cc.moveTo(0,0);cc.bezierCurveTo(sd*40,30,sd*48,150,sd*20,206);cc.bezierCurveTo(sd*4,226,sd*-20,214,sd*-14,170);cc.bezierCurveTo(sd*-10,110,sd*-8,40,0,0);cc.closePath();};
    ctx.beginPath();wg(ctx);ctx.fillStyle="rgba(226,232,236,0.42)";ctx.fill();ctx.strokeStyle="rgba(120,110,100,0.55)";ctx.lineWidth=1.8;ctx.stroke();
    ctx.save();ctx.beginPath();wg(ctx);ctx.clip();const sh=ctx.createLinearGradient(sd*-20,40,sd*40,180);sh.addColorStop(0,"rgba(255,255,255,0.35)");sh.addColorStop(0.5,"rgba(200,220,255,0.12)");sh.addColorStop(1,"rgba(255,230,240,0.2)");ctx.fillStyle=sh;ctx.fillRect(-80,-10,160,240);
      ctx.strokeStyle="rgba(110,96,84,0.5)";ctx.lineWidth=1.4;for(const v of [[4,10,sd*30,120,sd*24,200],[2,14,sd*14,110,sd*8,206],[0,16,sd*-2,100,sd*-8,190],[sd*6,8,sd*36,60,sd*34,150]]){ctx.beginPath();ctx.moveTo(v[0],v[1]);ctx.quadraticCurveTo(v[2],v[3],v[4],v[5]);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(sd*6,120);ctx.lineTo(sd*26,118);ctx.moveTo(sd*2,160);ctx.lineTo(sd*20,156);ctx.stroke();ctx.restore();ctx.restore();}
  ctx.restore();}
// the fly brain's map at (x, y), w wide: a central brain between two optic lobes, filled with a dense tangle of fine lines (kept once per
// colour). o.blue: the model built from the map (blue on pale); o.lit 0 to 1 lights a path of neurons from the taste centre at the
// bottom up into the brain; returns the path's points
const TT_FLYB=(()=>{const R=ag_rnd(41),lines=[],cells=[];const lobes=[[0,0,0.25,0.29],[-0.37,0.02,0.14,0.35],[0.37,0.02,0.14,0.35]];
  const which=(px,py)=>lobes.findIndex(e=>((px-e[0])**2)/(e[2]**2)+((py-e[1])**2)/(e[3]**2)<1);
  // short fine strokes: in the optic lobes they run in columns towards the middle, in the central brain every way, densest at its heart
  for(let i=0;i<1700;i++){let px,py,k;do{px=(R()-0.5)*1.06;py=(R()-0.5)*0.86;k=which(px,py);}while(k<0);const e=lobes[k];let an;
    if(k===0)an=R()*TAU;else an=(R()-0.5)*0.5+(py-e[1])*1.6*Math.sign(px);const l=0.012+R()*(k===0?0.03:0.04);lines.push([px,py,px+Math.cos(an)*l,py+Math.sin(an)*l,px+Math.cos(an+(R()-0.5))*l*2,py+Math.sin(an+(R()-0.5))*l*2,k]);}
  for(let i=0;i<120;i++){const k=i%3,e=lobes[k],an=R()*TAU,r=0.82+R()*0.16;cells.push([e[0]+Math.cos(an)*e[2]*r,e[1]+Math.sin(an)*e[3]*r]);}
  return{lines,cells,lobes,path:[[0,0.3],[0.03,0.2],[-0.02,0.1],[0.04,0.0],[0.0,-0.1],[0.06,-0.18],[0.11,-0.25]]};})();
function tt_flyBrain(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return[];const blue=!!o.blue,h=w*0.86,key="tt_flyb:"+(blue?1:0)+":"+Math.round(w);
  const pic=ag_kept(key,Math.ceil(w*1.12),Math.ceil(h*1.12),c=>{c.translate(w*0.56,h*0.56);const col=blue?AG.blue:[206,104,84];
    // a soft glow (the real brain) or a pale ground (the model), the outline of the three parts, then the strokes and the cells
    c.save();c.filter="blur("+Math.round(w*0.03)+"px)";c.fillStyle=blue?"rgba(206,222,234,0.55)":"rgba(255,196,160,0.45)";for(const e of TT_FLYB.lobes){c.beginPath();c.ellipse(e[0]*w,e[1]*w,e[2]*w*1.05,e[3]*w*1.05,0,0,TAU);c.fill();}c.restore();
    c.strokeStyle=rgba(col,0.3);c.lineWidth=2;for(const e of TT_FLYB.lobes){c.beginPath();c.ellipse(e[0]*w,e[1]*w,e[2]*w,e[3]*w,0,0,TAU);c.stroke();}
    c.lineCap="round";c.lineWidth=Math.max(1,w/520);for(const L of TT_FLYB.lines){c.strokeStyle=rgba(col,(blue?0.4:0.42)+(L[6]===0?0.12:0));c.beginPath();c.moveTo(L[0]*w,L[1]*w);c.quadraticCurveTo(L[2]*w,L[3]*w,L[4]*w,L[5]*w);c.stroke();}
    c.fillStyle=rgba(col,0.7);for(const q of TT_FLYB.cells){c.beginPath();c.arc(q[0]*w,q[1]*w,Math.max(1.6,w/260),0,TAU);c.fill();}});
  ctx.save();ctx.globalAlpha*=a;ctx.drawImage(pic,x-w*0.56,y-h*0.56);
  const P=TT_FLYB.path.map(q=>[x+q[0]*w,y+q[1]*w]),lit=o.lit||0;if(lit>0){const col=blue?[120,190,255]:[255,214,150],n=P.length;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.shadowColor=rgba(col,0.9);ctx.shadowBlur=16;ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);const m=lit*(n-1);
    for(let i=1;i<n;i++){if(i-1>m)break;const f=Math.min(1,m-(i-1));ctx.lineTo(lerp(P[i-1][0],P[i][0],f),lerp(P[i-1][1],P[i][1],f));}ctx.stroke();
    ctx.fillStyle="#FFFFFF";for(let i=0;i<n;i++){if(i>m+0.01)break;ctx.beginPath();ctx.arc(P[i][0],P[i][1],7,0,TAU);ctx.fill();}}
  ctx.restore();return P;}
// a drop of sugar water at (x, y), size r: a glossy bead with its highlight and shadow
function tt_drop(ctx,x,y,r,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_floorShadow(ctx,x-r*0.2,y+r*0.7,r*1.1,r*0.3,0.25);
  const g=ctx.createRadialGradient(x-r*0.3,y-r*0.4,r*0.1,x,y,r*1.1);g.addColorStop(0,"rgba(255,255,255,0.85)");g.addColorStop(0.4,"rgba(236,226,200,0.55)");g.addColorStop(1,"rgba(200,180,140,0.5)");
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,r*1.15,r*0.85,0,0,TAU);ctx.fill();ctx.strokeStyle="rgba(170,150,110,0.6)";ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,0.9)";ctx.beginPath();ctx.ellipse(x-r*0.4,y-r*0.36,r*0.26,r*0.14,-0.5,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(255,252,240,0.95)";for(const q of [[0.2,0.1],[-0.1,0.3],[0.42,-0.1],[0.05,-0.2]]){ctx.save();ctx.translate(x+q[0]*r,y+q[1]*r);ctx.rotate(0.6);ctx.fillRect(-2.5,-2.5,5,5);ctx.restore();}ctx.restore();}
// a human head's outline in profile at (x, y) (its centre), h tall, facing right; inside it a fine field of points (o.fill 0 to 1)
function tt_headOutline(ctx,x,y,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const k=h/600;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(k,k);
  const hp=cc=>{cc.moveTo(-40,300);cc.bezierCurveTo(-40,240,-60,210,-120,170);cc.bezierCurveTo(-200,110,-220,-40,-170,-150);cc.bezierCurveTo(-120,-260,20,-300,120,-250);cc.bezierCurveTo(200,-210,220,-120,206,-60);
    cc.bezierCurveTo(230,-20,250,10,236,24);cc.bezierCurveTo(226,34,214,36,212,50);cc.bezierCurveTo(222,62,214,74,206,80);cc.bezierCurveTo(212,92,206,110,190,120);cc.bezierCurveTo(176,160,120,170,80,170);cc.bezierCurveTo(70,220,80,260,90,300);};
  const f=o.fill||0;if(f>0){const pic=ag_kept("tt_headDots",520,640,c=>{c.translate(260,320);c.beginPath();hp(c);c.closePath();c.clip();const g=c.createRadialGradient(0,-60,20,0,-60,300);g.addColorStop(0,"rgba(255,214,190,0.5)");g.addColorStop(1,"rgba(255,214,190,0.08)");c.fillStyle=g;c.fillRect(-260,-320,520,640);
      const R=ag_rnd(17);for(let i=0;i<4200;i++){const px=(R()-0.5)*480,py=(R()-0.5)*600;c.fillStyle=rgba([204,120,110],0.18+R()*0.4);c.beginPath();c.arc(px,py,0.8+R()*1.3,0,TAU);c.fill();}});
    ctx.save();ctx.globalAlpha*=f;ctx.drawImage(pic,-260,-320);ctx.restore();}
  ctx.strokeStyle=rgba(AG.ink,0.7);ctx.lineWidth=4/k*0.6;ctx.lineCap="round";ctx.beginPath();hp(ctx);ctx.stroke();ctx.restore();}

/* ---------------------------------------------------------------- music that comes through blurred, a rainstorm on a screen, a balance */
// an eighth note at (x, y) (its head), size s, its stem up
function tt_note(ctx,x,y,s,col,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=col;ctx.strokeStyle=col;ctx.lineWidth=3.2;ctx.lineCap="round";
  ctx.save();ctx.rotate(-0.4);ctx.beginPath();ctx.ellipse(0,0,11,8,0,0,TAU);ctx.fill();ctx.restore();ctx.beginPath();ctx.moveTo(9,-3);ctx.lineTo(9,-44);ctx.quadraticCurveTo(14,-30,26,-26);ctx.stroke();ctx.restore();}
// notes from (x0, y0) to (x1, y1), a few at a time; they blur and waver as they near the end (o.blur 0 to 1 how much)
function tt_notes(ctx,x0,y0,x1,y1,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const n=5,bl=o.blur==null?1:o.blur,col=o.col||"rgba(96,82,70,0.85)";
  for(let i=0;i<n;i++){const u=((t*0.22+i/n)%1+1)%1,x=lerp(x0,x1,u),y=lerp(y0,y1,u)+Math.sin(u*TAU*1.5+i)*30,b=bl*ag_ss(0.35,0.95,u),al=a*Math.sin(Math.PI*u);
    ctx.save();if(b>0.02)ctx.filter="blur("+(b*7).toFixed(1)+"px)";const wob=b*Math.sin(t*9+i)*6;tt_note(ctx,x+wob,y,1.1,col,al*(1-0.45*b));ctx.restore();}}
// a rainstorm inside a screen's glass, for ag_screen's draw: a grey sky, slanting rain, rings where it lands (t moves it)
function tt_rain(c,x,y,w,h,t){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();let g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#5E6A74");g.addColorStop(0.6,"#7C8790");g.addColorStop(1,"#5A6268");c.fillStyle=g;c.fillRect(x,y,w,h);
  c.fillStyle="rgba(40,46,52,0.35)";c.fillRect(x,y+h*0.78,w,h*0.22);c.save();c.filter="blur("+Math.round(h*0.05)+"px)";c.fillStyle="rgba(210,218,226,0.12)";for(let i=0;i<5;i++){c.beginPath();c.ellipse(x+w*(0.1+i*0.22),y+h*0.1,w*0.18,h*0.1,0,0,TAU);c.fill();}c.restore();
  const R=ag_rnd(23);c.strokeStyle="rgba(226,234,240,0.55)";c.lineWidth=2;c.lineCap="round";for(let i=0;i<90;i++){const sx=R(),sp=0.7+R()*0.6,ph=R(),u=((t*sp*1.3+ph)%1),px=x+((sx*1.2-0.1)*w+u*h*0.18)%w,py=y+u*h*0.86;
    c.beginPath();c.moveTo(px,py);c.lineTo(px-6,py-26);c.stroke();}
  c.strokeStyle="rgba(226,234,240,0.4)";c.lineWidth=1.5;for(let i=0;i<14;i++){const u=((t*0.9+i/14)%1),px=x+w*((i*0.377)%1),py=y+h*(0.82+((i*0.29)%1)*0.14);c.globalAlpha=1-u;c.beginPath();c.ellipse(px,py,6+u*22,2+u*5,0,0,TAU);c.stroke();}
  c.restore();}
// a balance: an oak beam on a post at (x, y) (the pivot), w wide, tilted (radians); a card hangs by a cord from each end: words
// {title, sub} each, o.cw the cards' width; o.k springs it in; returns the cards' boxes
function tt_balance(ctx,x,y,w,tilt,L,R,o){o=o||{};const a=o.a==null?1:o.a,cw=o.cw||520;if(a<=0)return[];ctx.save();ctx.globalAlpha*=a;
  ag_soft(ctx,cc=>ag_rect(cc,x-10,y,20,o.post||300,6),AG_OAK.dark,AG_OAK.hi,x+4,y+40,80,"rgba(30,20,10,0.3)",6);
  const ends=[-1,1].map(sd=>[x+Math.cos(tilt)*sd*w/2,y+Math.sin(tilt)*sd*w/2]);ctx.save();ctx.translate(x,y);ctx.rotate(tilt);ag_soft(ctx,cc=>ag_rect(cc,-w/2,-10,w,20,10),AG_OAK.base,AG_OAK.hi,0,-6,w*0.4,"rgba(30,20,10,0.3)",6);ctx.restore();
  ctx.fillStyle=rgba(AG_OAK.dark,1);ctx.beginPath();ctx.arc(x,y,13,0,TAU);ctx.fill();const out=[];
  [L,R].forEach((wd,i)=>{if(!wd)return;const e=ends[i],cy=e[1]+70;ctx.strokeStyle="rgba(90,80,70,0.7)";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(e[0],e[1]);ctx.lineTo(e[0],cy);ctx.stroke();
    const k=o.k?o.k[i]:null,ca=o.ca?o.ca[i]:1;out.push(ag_textCard(ctx,e[0]-cw/2,cy,cw,wd,{k,a:ca}));});
  ctx.restore();return out;}

/* ---------------------------------------------------------------- the pictures of feeling: two theories, a test, sleep and waking */
// a net of nodes woven tightly, every node tied to many (integrated information, in plain words: parts that work as one); at (x, y),
// radius r; o.k draws it in, o.t a slow shimmer along its ties
const TT_NET=(()=>{const R=ag_rnd(53),N=[];for(let i=0;i<22;i++){const an=i*2.4,rr=Math.sqrt((i+0.5)/22);N.push([Math.cos(an)*rr,Math.sin(an)*rr*0.86]);}
  const E=[];for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){const d=Math.hypot(N[i][0]-N[j][0],N[i][1]-N[j][1]);if(d<0.62||R()<0.06)E.push([i,j]);}return{N,E};})();
function tt_net(ctx,x,y,r,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const k=o.k==null?1:o.k,t=o.t||0,col=o.col||AG.violet;ctx.save();ctx.globalAlpha*=a;
  const P=i=>[x+TT_NET.N[i][0]*r,y+TT_NET.N[i][1]*r];ctx.lineCap="round";TT_NET.E.forEach((e,j)=>{const v=clamp(k*1.6-j/TT_NET.E.length*0.6,0,1);if(v<=0)return;const A=P(e[0]),B=P(e[1]),sh=0.5+0.5*Math.sin(t*2+j*0.7);
    ctx.strokeStyle=rgba(col,0.18+0.22*sh);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(lerp(A[0],B[0],v),lerp(A[1],B[1],v));ctx.stroke();});
  TT_NET.N.forEach((n,i)=>{const v=clamp(k*2-i/TT_NET.N.length,0,1);if(v<=0)return;const q=P(i),rr=10*ag_spr(v,0,0.5);ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(q[0],q[1],rr,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,255,255,0.5)";ctx.beginPath();ctx.arc(q[0]-3,q[1]-3,rr*0.3,0,TAU);ctx.fill();});
  ctx.restore();}
// the 2025 test: a large sheet of predictions in two columns, one under each theory's picture (drawn small at the top of each column);
// rows of grey lines; marks (0 to 1 how many) come up on both, green where a prediction held and amber where it didn't
const TT_TEST=[[1,0],[0,1],[1,1],[0,0],[1,0]];   // for each row: [held for the first theory, held for the second]
function tt_testSheet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const m=o.marks||0;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,24,{});const cw=w/2;ctx.strokeStyle="rgba(120,116,110,0.25)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+cw,y+30);ctx.lineTo(x+cw,y+h-30);ctx.stroke();
  tt_net(ctx,x+cw*0.5,y+92,62,{});tt_brain(ctx,x+cw*1.5,y+96,0.26,{outline:1});tt_broadcast(ctx,x+cw*1.5,y+96,0.26,1,1);
  const rows=TT_TEST.length,top=y+190,rh=(h-230)/rows;TT_TEST.forEach((r,i)=>{for(let c=0;c<2;c++){const cx=x+c*cw,yy=top+i*rh;ctx.fillStyle="rgba(150,146,140,0.35)";rr(ctx,cx+40,yy,cw-150,14,7);ctx.fill();rr(ctx,cx+40,yy+26,(cw-150)*0.62,14,7);ctx.fill();
      const v=clamp(m*(rows+1)-i-c*0.4,0,1);if(v>0){const mx=cx+cw-66,my=yy+20,col=r[c]?AG.green:AG.amber;ctx.save();ctx.globalAlpha*=v;ag_about(ctx,mx,my,lerp(0.4,1,ag_spr(v,0,0.5)));
        if(r[c])ag_tick(ctx,mx,my,30,rgba(col,1),5);else{ctx.strokeStyle=rgba(col,1);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(mx-12,my-12);ctx.lineTo(mx+12,my+12);ctx.moveTo(mx+12,my-12);ctx.lineTo(mx-12,my+12);ctx.stroke();}ctx.restore();}}});
  ctx.restore();}
// the sky over the brain: day (a sun), then night (a moon), then the dark of deep sleep (sky 0 day, 1 dreaming, 2 deep sleep, between
// them it dissolves); drawn in a soft rounded window (x, y, w, h)
function tt_sky(ctx,x,y,w,h,sky,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,h,28,{});ctx.save();rr(ctx,x+10,y+10,w-20,h-20,20);ctx.clip();
  const day=clamp(1-sky,0,1),dream=clamp(1-Math.abs(sky-1),0,1),deep=clamp(sky-1,0,1);const g=ctx.createLinearGradient(0,y,0,y+h);
  const top=mix(mix([150,196,232],[52,58,96],clamp(sky,0,1)),[18,20,34],deep),bot=mix(mix([226,236,240],[96,98,140],clamp(sky,0,1)),[30,32,48],deep);g.addColorStop(0,rgba(top,1));g.addColorStop(1,rgba(bot,1));ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  const cx=x+w*0.5,cy=y+h*0.48;if(day>0){tt_glow(ctx,cx,cy,90,day,[255,240,190]);ctx.fillStyle=rgba([255,226,140],day);ctx.beginPath();ctx.arc(cx,cy,34,0,TAU);ctx.fill();}
  if(dream>0){ctx.fillStyle=rgba([240,236,220],dream);ctx.beginPath();ctx.arc(cx,cy,32,0,TAU);ctx.fill();ctx.fillStyle=rgba(mix(top,[40,44,80],0.3),dream);ctx.beginPath();ctx.arc(cx+14,cy-8,28,0,TAU);ctx.fill();
    ctx.fillStyle=rgba([240,236,220],0.8*dream);for(const q of [[-0.3,0.3],[0.32,0.22],[-0.18,0.7],[0.26,0.68],[0.4,0.45]]){ctx.beginPath();ctx.arc(x+w*(0.5+q[0]),y+h*q[1],2.4,0,TAU);ctx.fill();}}
  ctx.restore();ctx.restore();}
// three small signs (an eye, an ear, a hand) that slide in from three sides and settle into one frame at (x, y) (its centre): u 0 to 1
function tt_signs(ctx,x,y,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const fw=420,fh=170,k=ag_sine(clamp(u,0,1)),fa=clamp((u-0.7)/0.3,0,1);
  if(fa>0){ctx.save();ctx.globalAlpha*=fa;ctx.strokeStyle=rgba(AG.violet,0.8);ctx.lineWidth=4;rr(ctx,x-fw/2,y-fh/2,fw,fh,26);ctx.stroke();ctx.restore();}
  const S=[[-130,0,-700,0],[0,0,0,-560],[130,0,700,0]],ink=rgba(AG.ink,0.85);S.forEach((p,i)=>{const px=x+lerp(p[2],p[0],k),py=y+lerp(p[3],p[1],k);ctx.save();ctx.translate(px,py);ag_box(ctx,-56,-56,112,112,22,{});
    ctx.strokeStyle=ink;ctx.fillStyle=ink;ctx.lineWidth=4;ctx.lineCap="round";ctx.lineJoin="round";
    if(i===0){ctx.beginPath();ctx.moveTo(-34,0);ctx.quadraticCurveTo(0,-30,34,0);ctx.quadraticCurveTo(0,30,-34,0);ctx.stroke();ctx.beginPath();ctx.arc(0,0,10,0,TAU);ctx.fill();}
    else if(i===1){ctx.beginPath();ctx.moveTo(-14,26);ctx.bezierCurveTo(-16,38,4,40,8,26);ctx.bezierCurveTo(12,14,26,8,26,-10);ctx.bezierCurveTo(26,-32,8,-40,-6,-38);ctx.bezierCurveTo(-24,-36,-30,-20,-28,-8);ctx.stroke();ctx.beginPath();ctx.moveTo(-10,-10);ctx.bezierCurveTo(-8,-24,10,-24,10,-10);ctx.bezierCurveTo(10,0,0,2,0,10);ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(-22,34);ctx.lineTo(-22,-4);ctx.moveTo(-22,-4);ctx.lineTo(-22,-30);ctx.moveTo(-8,-4);ctx.lineTo(-8,-38);ctx.moveTo(6,-4);ctx.lineTo(6,-36);ctx.moveTo(20,0);ctx.lineTo(20,-28);ctx.moveTo(-22,34);ctx.quadraticCurveTo(24,40,26,10);ctx.lineTo(20,-2);ctx.moveTo(-22,6);ctx.quadraticCurveTo(-36,-6,-40,-18);ctx.stroke();}
    ctx.restore();});ctx.restore();}
// a bundle of tiny tubes inside a neuron, drawn as fine lattices (microtubules): n tubes across (x, y, w, h); o.pearl 0 to 1 a pearly
// shimmer moving along them (o.t); o.a
function tt_tubes(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const n=o.n||5,t=o.t||0,pe=o.pearl||0;ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<n;i++){const ty=y+h*(i+0.5)/n,rad=h/n*0.3,tilt=Math.sin(i*2.3)*0.012;ctx.save();ctx.translate(x+w/2,ty);ctx.rotate(tilt);
    ag_soft(ctx,cc=>ag_rect(cc,-w/2,-rad,w,rad*2,rad),[214,208,214],[248,246,250],0,-rad*0.5,w*0.6,"rgba(80,70,90,0.3)",8);
    ctx.save();rr(ctx,-w/2,-rad,w,rad*2,rad);ctx.clip();ctx.fillStyle="rgba(120,110,130,0.4)";const sp=rad*0.34;for(let gx=-w/2;gx<w/2;gx+=sp)for(let k=-4;k<=4;k++){const gy=k*rad*0.22,off=(k%2)*sp/2,sq=Math.sqrt(Math.max(0,1-(gy/rad)**2));ctx.beginPath();ctx.ellipse(gx+off,gy,sp*0.3*sq+0.6,rad*0.08,0,0,TAU);ctx.fill();}
      if(pe>0){const px=((t*0.5+i*0.23)%1)*w*1.4-w*0.7;const g=ctx.createLinearGradient(px-120,0,px+120,0);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(0.5,"rgba(236,240,255,"+(0.75*pe)+")");g.addColorStop(1,"rgba(255,230,250,0)");ctx.fillStyle=g;ctx.fillRect(-w/2,-rad,w,rad*2);}
      ctx.restore();ctx.restore();}
  ctx.restore();}
// a book lying on the oak desk, its plain cover with the title (original design): at (x, y) its centre
function tt_book(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||-0.05);ag_floorShadow(ctx,8,150,260,26,0.3);
  ctx.fillStyle="#E6E0D2";ctx.beginPath();ctx.moveTo(-190,140);ctx.lineTo(214,140);ctx.lineTo(214,-136);ctx.lineTo(200,-150);ctx.lineTo(200,140);ctx.closePath();ctx.fill();ctx.fillStyle="#D8D0BE";ctx.fillRect(-190,140,404,14);
  ctx.strokeStyle="rgba(150,140,120,0.5)";ctx.lineWidth=1;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(-190,140+i*3.5);ctx.lineTo(214,140+i*3.5);ctx.stroke();}
  ag_soft(ctx,cc=>ag_rect(cc,-200,-150,400,290,8),[62,72,96],[96,108,136],-60,-100,320,"rgba(10,10,20,0.35)",10);
  ctx.strokeStyle="rgba(220,214,200,0.55)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(110,-30,64,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(110,-30,40,0.5,TAU-0.3);ctx.stroke();ctx.beginPath();ctx.arc(110,-30,18,1,TAU-0.6);ctx.stroke();
  ag_T(ctx,"I of the Vortex",-170,-60,{w:800,size:40,col:[240,236,226]});ag_T(ctx,"Llinás · 2001",-170,-14,{w:500,size:30,col:[214,210,200]});ctx.restore();}
// a checklist of signs, its rows grey (none ticked): n rows at (x, y), w wide; o.k springs it in; returns its height
function tt_checklist(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,n=o.n||14,rh=30,h=60+n*rh;if(a<=0)return h;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,22,{});for(let i=0;i<n;i++){const yy=y+34+i*rh;ctx.strokeStyle="rgba(140,136,130,0.6)";ctx.lineWidth=2;ctx.strokeRect(x+30,yy,18,18);ctx.fillStyle="rgba(150,146,140,0.32)";rr(ctx,x+64,yy+4,(w-110)*(0.55+0.4*((i*37)%10)/10),11,5);ctx.fill();}
  ctx.restore();return h;}
