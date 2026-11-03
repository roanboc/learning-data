/* ===== Minds that change: the film's own places and pictures =====
   Drawn in the module's look (films/what-an-agent-is/shared/src: kit.js, room.js, people.js, agent.js, cards.js), with the film's own
   places and helpers here, each named with mc_ or MC_. Matte shapes lit from the right, soft shadows falling left, no outlines and no
   grain; words at least 28 px as seen, and none under the captions (below y 890).
     the riverbank      AG_PLACES.mcDawn, mcNoon, mcDusk: a broad shallow river in the plains, the far bank and its houses of wood and
                        thatch, the near bank's grass, and a large pipal tree (the Rigveda's asvattha) on the left, at three times of
                        day. mc_leaves() stirs the canopy's edge live, mc_smoke() lifts the hearth's smoke, mc_water() moves the river.
     the reciters       MC_TEACHER, MC_BOY1, MC_BOY2: unstitched white cotton, the hair knotted on the right (RV 7.33.1), bare feet;
                        mc_seated() draws one sitting cross-legged on the mat, the lap's cloth over the waist.
     a verse's words    mc_tile(): a pale oak tile with a letter, a b c d as scholars write a verse's words (Staal); a slip is an
                        amber x. mc_rows() lays out the four patterns; mc_threads() joins each word to itself in every row.
     Cambridge, 1920    AG_PLACES.mcCambridge: a college room, a tall window on the right, panelling, a desk.
     Seattle, 1974      AG_PLACES.mcSeattle: a lecture room, a screen at the front, rows of desks seen from behind, a projector.
     the room's things  answer cards, the evidence slot, bubbles, a memory card, papers, the corner tag, the route cards, bars.
   No writing in the reciters' world, which is the point; nothing on screen is in Sanskrit, and nothing is borrowed from Indian art. */

/* ---------------------------------------------------------------- the riverbank, at three times of day */
const MC_SKY={
  dawn:{top:[150,168,194],mid:[210,206,206],low:[246,216,184],sun:[1580,498],sunC:[255,238,206],glow:[255,214,168],water:[[238,216,194],[176,186,194],[150,162,172]],
    grass:[[170,166,118],[124,126,90]],far:[152,158,160],leaf:[[66,96,70],[92,124,82],[160,176,108]],bark:[[150,134,116],[196,184,166]],light:1,warm:0.22},
  noon:{top:[136,174,212],mid:[200,218,230],low:[232,236,232],sun:[1100,-120],sunC:[255,252,240],glow:[255,250,236],water:[[214,226,232],[176,198,212],[156,178,194]],
    grass:[[176,176,116],[128,136,90]],far:[150,166,164],leaf:[[64,100,66],[96,136,80],[170,190,110]],bark:[[150,138,122],[206,196,180]],light:1.08,warm:0.06},
  dusk:{top:[96,98,134],mid:[176,150,160],low:[236,170,128],sun:[300,500],sunC:[255,214,170],glow:[246,170,122],water:[[226,170,138],[150,138,152],[112,112,132]],
    grass:[[140,128,96],[96,94,74]],far:[118,112,124],leaf:[[50,70,58],[72,90,66],[150,128,90]],bark:[[118,104,96],[170,150,130]],light:0.86,warm:0.3}
};
const MC_BANK={far:494,near:772,mat:[470,846,1300,966]};   // the far bank's top, the near bank's edge; the mat's corners (x0, y0, x1, y1)
const MC_TREE={x:300,y:884};                                 // the pipal: its trunk's foot
const mc_treeK=tod=>tod==="dawn"?1:tod==="noon"?1.07:1.12;  // the tree grows broader as the centuries pass
// the crown: great masses of leaves in two tiers, from a seed, so the place and the live leaves at its edge agree. k: the tree's size
function mc_crown(k){const R=ag_rnd(808),x0=MC_TREE.x,y0=MC_TREE.y,ms=[];
  // [x, y, rx, ry] relative to the trunk's foot, back tier first, then the front
  const M=[[-230,-660,250,130,0],[170,-740,290,140,0],[520,-620,230,120,0],[-30,-800,220,100,0],
           [-380,-500,210,120,1],[-90,-560,260,130,1],[290,-560,270,130,1],[640,-500,190,100,1]];
  for(const m of M){const ph=[R()*TAU,R()*TAU,R()*TAU];ms.push({x:x0+m[0]*k,y:y0+m[1]*k,rx:m[2]*k,ry:m[3]*k,ph,l:R(),front:m[4]});}
  const edge=[];for(const m of ms)for(let i=0;i<8;i++){const a=R()<0.7?-Math.PI*0.95+R()*Math.PI*0.9:Math.PI*0.15+R()*Math.PI*0.7,q=mc_blobR(m,a);
    edge.push({x:m.x+Math.cos(a)*m.rx*q*1.02,y:m.y+Math.sin(a)*m.ry*q*1.02,a:Math.PI/2+(R()-0.5)*1.2,s:(0.85+R()*0.4)*k,ph:R()*TAU});}
  return{ms,edge};}
// a mass's edge, wandering a little: its radius at angle a, as a share of rx and ry
function mc_blobR(m,a){return 1+0.07*Math.sin(3*a+m.ph[0])+0.05*Math.sin(5*a+m.ph[1])+0.03*Math.sin(9*a+m.ph[2]);}
function mc_blobPath(c,m,g){g=g||1;for(let i=0;i<=48;i++){const a=i/48*TAU,q=mc_blobR(m,a)*g,x=m.x+Math.cos(a)*m.rx*q,y=m.y+Math.sin(a)*m.ry*q;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();}
// a pipal leaf: a heart shape with a long tip, hanging from its stalk at (x, y), length L, turned by a (0: pointing right)
function mc_leafPath(c,x,y,L,a){const ca=Math.cos(a),sa=Math.sin(a),P=(u,v)=>[x+(u*ca-v*sa)*L,y+(u*sa+v*ca)*L];let p=P(0,0);c.moveTo(p[0],p[1]);
  const q=[[[0.05,-0.32],[0.42,-0.42],[0.62,-0.18]],[[0.72,-0.06],[0.82,-0.02],[1.0,0]],[[0.82,0.02],[0.72,0.06],[0.62,0.18]],[[0.42,0.42],[0.05,0.32],[0,0]]];
  for(const b of q){const p1=P(...b[0]),p2=P(...b[1]),p3=P(...b[2]);c.bezierCurveTo(p1[0],p1[1],p2[0],p2[1],p3[0],p3[1]);}c.closePath();}
// the tree: a broad pale-grey trunk, fluted, with roots spreading at its foot and limbs into a wide crown; painted at half size
// where it's soft anyway (the masses and the leaves inside them), at full size where it isn't (the trunk's edge, the crown's outline)
function mc_paintTree(c,S,k){const L=S.leaf,B=S.bark,x0=MC_TREE.x,y0=MC_TREE.y,G=mc_crown(k),sunR=S===MC_SKY.dusk?-1:1,R2=ag_rnd(57);
  // the crown's masses, at half size: each dark beneath and lit where the light falls, then its leaves; the back tier darker
  const tier=f=>{const [cv,x]=ag_buf("mc-crown",Math.ceil(W/2),Math.ceil(H/2));x.scale(0.5,0.5);
    for(const m of G.ms){if(m.front!==f)continue;const lit=(sunR>0?clamp((m.x-x0)/(600*k)+0.55,0.15,1):0.35)*(f?1:0.7),base=ag_dk(mix(L[0],L[1],0.3+0.4*m.l),f?0:0.12);
      x.fillStyle=rgba(base,1);x.beginPath();mc_blobPath(x,m);x.fill();
      x.save();x.beginPath();mc_blobPath(x,m);x.clip();
      let g=x.createRadialGradient(m.x+m.rx*0.45*sunR,m.y-m.ry*0.6,0,m.x+m.rx*0.45*sunR,m.y-m.ry*0.6,m.rx*1.3);g.addColorStop(0,rgba(L[2],0.55*lit));g.addColorStop(1,rgba(L[2],0));x.fillStyle=g;x.fillRect(m.x-m.rx*1.2,m.y-m.ry*1.2,m.rx*2.4,m.ry*2.4);
      g=x.createLinearGradient(0,m.y-m.ry*0.2,0,m.y+m.ry);g.addColorStop(0,"rgba(14,24,16,0)");g.addColorStop(1,"rgba(14,24,16,0.55)");x.fillStyle=g;x.fillRect(m.x-m.rx*1.2,m.y-m.ry*0.2,m.rx*2.4,m.ry*1.4);
      for(let i=0;i<170;i++){const a=R2()*TAU,d=Math.sqrt(R2()),lx=m.x+Math.cos(a)*d*m.rx,ly=m.y+Math.sin(a)*d*m.ry,up=clamp(0.5-(ly-m.y)/m.ry*0.7+(lx-m.x)/m.rx*0.3*sunR,0,1);
        x.beginPath();mc_leafPath(x,lx,ly,(24+R2()*12)*k,Math.PI/2+(R2()-0.5)*1.4);x.fillStyle=rgba(ag_dk(mix(mix(L[0],L[1],0.3+0.6*R2()),L[2],up*lit*0.8*R2()),f?0:0.1),0.85);x.fill();}
      x.restore();}
    c.drawImage(cv,0,0,W,H);
    for(const m of G.ms){if(m.front!==f)continue;for(let i=0;i<56;i++){const a=R2()*TAU,q=mc_blobR(m,a)*(0.95+R2()*0.07),lx=m.x+Math.cos(a)*m.rx*q,ly=m.y+Math.sin(a)*m.ry*q,
        lit=(sunR>0?clamp((lx-x0)/(600*k)+0.4,0,1):0.3)*clamp(0.6-(ly-m.y)/m.ry,0.2,1);
      c.beginPath();mc_leafPath(c,lx,ly,(24+R2()*13)*k,Math.PI/2+(R2()-0.5)*1.5);c.fillStyle=rgba(ag_dk(mix(mix(L[0],L[1],0.5+0.4*R2()),L[2],lit*0.6*R2()),f?0:0.12),0.95);c.fill();}}};
  tier(0);
  // the trunk: broad and pale grey, fluted, with roots spreading at its foot and limbs reaching up into the crown
  const trunk=cc=>{cc.moveTo(x0-150*k,y0+10);cc.bezierCurveTo(x0-90*k,y0-6,x0-70*k,y0-40*k,x0-64*k,y0-120*k);cc.bezierCurveTo(x0-58*k,y0-260*k,x0-110*k,y0-400*k,x0-250*k,y0-520*k);
    cc.lineTo(x0-226*k,y0-546*k);cc.bezierCurveTo(x0-110*k,y0-470*k,x0-46*k,y0-460*k,x0-14*k,y0-540*k);cc.bezierCurveTo(x0+4*k,y0-600*k,x0-30*k,y0-660*k,x0-60*k,y0-700*k);
    cc.lineTo(x0-36*k,y0-712*k);cc.bezierCurveTo(x0+20*k,y0-660*k,x0+50*k,y0-600*k,x0+100*k,y0-540*k);cc.bezierCurveTo(x0+190*k,y0-470*k,x0+340*k,y0-470*k,x0+480*k,y0-540*k);
    cc.lineTo(x0+494*k,y0-516*k);cc.bezierCurveTo(x0+340*k,y0-430*k,x0+160*k,y0-420*k,x0+84*k,y0-330*k);cc.bezierCurveTo(x0+56*k,y0-230*k,x0+62*k,y0-100*k,x0+100*k,y0-36*k);
    cc.bezierCurveTo(x0+130*k,y0-6,x0+170*k,y0+4,x0+200*k,y0+12);cc.closePath();};
  c.save();c.translate(AG.sdx*4,0);ag_floorShadow(c,x0+40,y0+14,300*k,32,0.32);c.restore();
  ag_soft(c,trunk,B[0],B[1],x0+90*k*sunR,y0-380*k,320*k,null);
  c.save();ag_shape(c,trunk);c.clip();
  let g=c.createLinearGradient(x0-80*k,0,x0+90*k,0);g.addColorStop(0,"rgba(30,26,22,"+(sunR>0?0.34:0.08)+")");g.addColorStop(0.6,"rgba(30,26,22,0.04)");g.addColorStop(1,"rgba(255,250,240,"+(sunR>0?0.12:0)+")");c.fillStyle=g;c.fillRect(x0-400*k,y0-800*k,1000*k,820*k);
  g=c.createLinearGradient(0,y0-800*k,0,y0-300*k);g.addColorStop(0,"rgba(20,24,18,0.45)");g.addColorStop(1,"rgba(20,24,18,0)");c.fillStyle=g;c.fillRect(x0-400*k,y0-800*k,1000*k,500*k);
  // the trunk's flutes: long soft folds, as a pipal's trunk is made of stems grown together, fading as they rise
  c.lineCap="round";const R=ag_rnd(31);
  for(let i=0;i<8;i++){const u=-46+i*13+R()*8,top=380+R()*120,fl=(x,y)=>[x0+(u*(1.5-0.7*y/top)+(y>200?-(y-200)*0.12:0))*k,y0-y*k];
    const g2=c.createLinearGradient(0,y0,0,y0-top*k);g2.addColorStop(0,rgba(ag_dk(B[0],0.35),0.3));g2.addColorStop(1,rgba(ag_dk(B[0],0.35),0));c.strokeStyle=g2;c.lineWidth=5;
    c.beginPath();for(let y=0;y<=top;y+=20){const p=fl(y,0);y?c.lineTo(...fl(y)):c.moveTo(...fl(y));}c.stroke();
    const g3=c.createLinearGradient(0,y0,0,y0-top*k);g3.addColorStop(0,rgba(ag_lt(B[1],0.2),0.26));g3.addColorStop(1,rgba(ag_lt(B[1],0.2),0));c.strokeStyle=g3;c.lineWidth=2;
    c.beginPath();for(let y=0;y<=top;y+=20){const p=fl(y);y?c.lineTo(p[0]+6,p[1]):c.moveTo(p[0]+6,p[1]);}c.stroke();}
  c.restore();
  tier(1);
  return G;}
function mc_paintRiver(c,tod){const S=MC_SKY[tod],fb=MC_BANK.far,nb=MC_BANK.near;
  // the sky, warm where the sun is, a few long soft clouds (painted small and scaled up, so they're soft)
  let g=c.createLinearGradient(0,0,0,fb+10);g.addColorStop(0,rgba(S.top,1));g.addColorStop(0.62,rgba(S.mid,1));g.addColorStop(1,rgba(S.low,1));c.fillStyle=g;c.fillRect(0,0,W,fb+12);
  const [sx,sy]=S.sun;g=c.createRadialGradient(sx,sy,10,sx,sy,900);g.addColorStop(0,rgba(S.glow,0.75));g.addColorStop(0.35,rgba(S.glow,0.22));g.addColorStop(1,rgba(S.glow,0));
  c.fillStyle=g;c.fillRect(0,0,W,fb+12);
  const R=ag_rnd(tod.length*97);let [sc,sx2]=ag_buf("mc-soft",240,135);
  for(let i=0;i<10;i++){const y=(50+R()*300)/8,x=R()*240,w=(220+R()*480)/8;sx2.fillStyle=rgba(mix(S.mid,S.glow,0.4+0.5*R()),0.3+0.25*R());sx2.beginPath();sx2.ellipse(x,y,w,1.4+R()*1.6,0,0,TAU);sx2.fill();}
  c.drawImage(sc,0,0,W,H);
  if(sy>0){c.save();c.shadowColor=rgba(S.sunC,0.9);c.shadowBlur=60;c.fillStyle=rgba(S.sunC,0.95);c.beginPath();c.arc(sx,sy,30,0,TAU);c.fill();c.restore();}
  // the far bank: low land, a line of trees in the haze, and a few houses of wood and thatch
  const farY=x=>fb+5*Math.sin(x/170)+3*Math.sin(x/53+1);
  [sc,sx2]=ag_buf("mc-soft",480,270);const R3=ag_rnd(5);sx2.fillStyle=rgba(mix(S.far,S.leaf[0],0.18),1);sx2.beginPath();sx2.moveTo(0,(fb+20)/4);
  for(let x=0;x<=480;x+=2){const X=x*4,tree=Math.abs(X-1300)<140?0:Math.max(0,Math.sin(X/37)+Math.sin(X/91+2)*0.8+Math.sin(X/13)*0.3)*7+(Math.sin(X/230)>0.3?6:0);sx2.lineTo(x,(farY(X)-tree*1.6)/4);}
  sx2.lineTo(480,(fb+20)/4);sx2.closePath();sx2.fill();c.drawImage(sc,0,0,W,H);
  c.fillStyle=rgba(S.far,1);c.beginPath();c.moveTo(0,fb+30);for(let x=0;x<=W;x+=20)c.lineTo(x,farY(x)+4);c.lineTo(W,fb+30);c.closePath();c.fill();
  for(const [hx,hw] of [[1230,38],[1292,48],[1360,34]]){const hy=farY(hx)+5,wall=mix(S.bark[0],[118,96,74],0.6),th=mix(mix([176,156,112],S.far,0.3),S.glow,0.2);
    c.fillStyle=rgba(ag_dk(wall,0.08),1);c.fillRect(hx-hw/2,hy-16,hw,17);c.fillStyle=rgba(ag_dk(wall,0.38),1);c.fillRect(hx-4,hy-11,8,12);
    ag_soft(c,cc=>{cc.moveTo(hx-hw/2-7,hy-14);cc.quadraticCurveTo(hx-hw*0.2,hy-33,hx,hy-38);cc.quadraticCurveTo(hx+hw*0.2,hy-33,hx+hw/2+7,hy-14);cc.closePath();},th,ag_lt(th,0.25),hx+hw*0.3,hy-34,34,null);}
  // the river: the sky in it, the far bank's reflection, long soft ripples, and the sun's path
  g=c.createLinearGradient(0,fb+20,0,nb);g.addColorStop(0,rgba(S.water[0],1));g.addColorStop(0.45,rgba(S.water[1],1));g.addColorStop(1,rgba(S.water[2],1));c.fillStyle=g;c.fillRect(0,fb+20,W,nb-fb);
  g=c.createLinearGradient(0,fb+18,0,fb+64);g.addColorStop(0,rgba(ag_dk(S.far,0.1),0.6));g.addColorStop(1,rgba(S.far,0));c.fillStyle=g;c.fillRect(0,fb+18,W,46);
  const R4=ag_rnd(9);c.lineCap="round";
  for(let i=0;i<150;i++){const u=R4(),y=fb+30+u*u*(nb-fb-40),x=R4()*W,w=(30+R4()*140)*(0.4+u);c.strokeStyle=rgba(i%3?[255,255,255]:ag_dk(S.water[2],0.2),0.07+0.08*R4());
    c.lineWidth=1+u*2.5;c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.stroke();}
  if(sy>0&&sy<fb+40){for(let i=0;i<40;i++){const u=i/40,y=fb+24+u*u*(nb-fb-30),w=(14+70*u)*(0.6+R4()*0.8);c.strokeStyle=rgba(S.sunC,0.5*(1-u)+0.08);c.lineWidth=1.5+u*3;
    c.beginPath();c.moveTo(sx-w/2+(R4()-0.5)*20*u,y);c.lineTo(sx+w/2+(R4()-0.5)*20*u,y);c.stroke();}}
  // the near bank: a soft edge of earth, then grass, lit from the sun's side
  const nearY=x=>nb-8+7*Math.sin(x/140+2)+5*Math.sin(x/47);
  g=c.createLinearGradient(0,nb-20,0,nb+20);g.addColorStop(0,rgba(mix(S.grass[1],[150,128,100],0.5),1));g.addColorStop(1,rgba(mix(S.grass[1],[120,100,80],0.4),1));c.fillStyle=g;
  c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=16)c.lineTo(x,nearY(x));c.lineTo(W,H);c.closePath();c.fill();
  g=c.createLinearGradient(0,nb,0,H);g.addColorStop(0,rgba(S.grass[0],1));g.addColorStop(1,rgba(S.grass[1],1));c.fillStyle=g;
  c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=16)c.lineTo(x,nearY(x)+10+3*Math.sin(x/23));c.lineTo(W,H);c.closePath();c.fill();
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,30,20,"+(0.2-S.warm*0.2)+")");g.addColorStop(0.6,"rgba(30,30,20,0)");g.addColorStop(1,rgba(S.glow,S.warm*0.5));c.fillStyle=g;c.fillRect(0,nb,W,H-nb);
  const R5=ag_rnd(21);
  for(let i=0;i<2600;i++){const x=R5()*W,u=R5(),y=nb+12+u*(H-nb),h=(5+12*u)*(0.6+R5()*0.8),lean=(R5()-0.5)*0.6;
    c.strokeStyle=rgba(i%4?ag_dk(S.grass[1],0.16):ag_lt(S.grass[0],0.3),0.25+0.3*R5());c.lineWidth=1+u*1.4;c.beginPath();c.moveTo(x,y);c.lineTo(x+lean*h,y-h);c.stroke();}
  // the tree's shade on the grass, the tree, then the mat: woven grass, in perspective
  ag_floorShadow(c,520,906,560,64,0.18);
  mc_paintTree(c,S,mc_treeK(tod));
  const [m0,my0,m1,my1]=MC_BANK.mat,mat=cc=>{cc.moveTo(m0+60,my0);cc.lineTo(m1-40,my0);cc.lineTo(m1+30,my1);cc.lineTo(m0-30,my1);cc.closePath();};
  ag_floorShadow(c,(m0+m1)/2-10,my1+6,(m1-m0)*0.56,20,0.22);
  ag_soft(c,mat,mix([204,184,136],S.glow,0.12),[236,222,180],m1-120,my0+20,500,null);
  c.save();ag_shape(c,mat);c.clip();c.strokeStyle="rgba(120,96,60,0.2)";c.lineWidth=2;
  for(let y=my0+8;y<my1;y+=9){c.beginPath();c.moveTo(m0-40,y);c.lineTo(m1+40,y);c.stroke();}
  c.strokeStyle="rgba(255,250,236,0.2)";for(let y=my0+12;y<my1;y+=9){c.beginPath();c.moveTo(m0-40,y);c.lineTo(m1+40,y);c.stroke();}
  g=c.createLinearGradient(m0,0,m1,0);g.addColorStop(0,"rgba(40,30,20,0.16)");g.addColorStop(1,"rgba(40,30,20,0)");c.fillStyle=g;c.fillRect(m0-40,my0,m1-m0+80,my1-my0);c.restore();
  c.strokeStyle="rgba(120,96,60,0.45)";c.lineWidth=3;c.beginPath();mat(c);c.stroke();}
AG_PLACES.mcDawn=c=>mc_paintRiver(c,"dawn");
AG_PLACES.mcNoon=c=>mc_paintRiver(c,"noon");
AG_PLACES.mcDusk=c=>mc_paintRiver(c,"dusk");
// live: leaves at the crown's edge stirring in the breeze; the river's ripples drifting; the hearth's smoke rising
function mc_leaves(ctx,t,tod,a){const S=MC_SKY[tod],k=mc_treeK(tod),G=mc_crown(k),L=S.leaf,sunR=tod==="dusk"?-1:1;if(a!=null&&a<=0)return;ctx.save();if(a!=null)ctx.globalAlpha*=a;
  for(const e of G.edge){const sw=Math.sin(t*1.5+e.ph)*0.28+Math.sin(t*0.6+e.ph*2)*0.14,lt=sunR>0?clamp((e.x-MC_TREE.x)/(600*k)+0.45,0,1):0.25;
    ctx.beginPath();mc_leafPath(ctx,e.x,e.y,27*e.s,e.a+sw);ctx.fillStyle=rgba(mix(L[1],L[2],0.2+0.6*lt),1);ctx.fill();}
  ctx.restore();}
function mc_water(ctx,t,tod,a){const fb=MC_BANK.far,nb=MC_BANK.near,R=ag_rnd(77);if(a!=null&&a<=0)return;ctx.save();if(a!=null)ctx.globalAlpha*=a;ctx.lineCap="round";
  for(let i=0;i<46;i++){const u=R(),y=fb+34+u*u*(nb-fb-60),sp=6+18*u,x=((R()*W+t*sp)%(W+300))-150,w=(40+R()*120)*(0.4+u),f=0.5+0.5*Math.sin(t*0.8+i);
    ctx.strokeStyle=rgba([255,255,255],(0.05+0.09*f)*(0.5+u));ctx.lineWidth=1+u*2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y);ctx.stroke();}
  ctx.restore();}
function mc_smoke(ctx,t,tod,a){const x0=1296,y0=MC_BANK.far-30;if(a!=null&&a<=0)return;ctx.save();if(a!=null)ctx.globalAlpha*=a;
  for(let i=0;i<12;i++){const u=((t*0.05+i/12)%1),y=y0-u*200,x=x0+Math.sin(u*4+t*0.25)*10+u*u*90,r=5+u*28,g=ctx.createRadialGradient(x,y,0,x,y,r);
    g.addColorStop(0,"rgba(238,234,228,"+(0.32*(1-u)*Math.min(1,u*8))+")");g.addColorStop(1,"rgba(238,234,228,0)");ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);}
  ctx.restore();}

/* ---------------------------------------------------------------- the reciters
   Unstitched white cotton: a cloth round the waist (under the lap here) and an upper cloth over the far shoulder, across the chest
   and under the near arm, the near shoulder and both arms bare; the hair long and knotted on the right side of the head, close to the
   skull, as the Rigveda says of the family of poets who made its seventh book (7.33.1: "white-robed", "with hair tied on the right");
   bare feet; no sacred thread, mark or symbol. The teacher is older, with a short grey beard; his two students are younger. They face
   right (east, where the sun rises) unless flipped. Their skin is the colour of their clothes in people.js, so the arms are bare. */
const MC_CLOTH=[240,236,224];
// the upper cloth, painted over the bare torso (top.paint): from the far shoulder across the chest and under the near arm
function mc_drape(c,P){const cl=MC_CLOTH,sk=P.skin;
  c.save();ag_shape(c,AG_F.torso);c.clip();
  // a little modelling on the bare chest: the collarbone's soft shadow, the near side in shade
  c.strokeStyle=rgba(mix(sk,[60,24,14],0.5),0.22);c.lineWidth=3;c.lineCap="round";c.beginPath();c.moveTo(250,622);c.quadraticCurveTo(220,630,176,640);c.stroke();
  const drape=cc=>{cc.moveTo(352,598);cc.bezierCurveTo(372,606,396,614,410,628);cc.bezierCurveTo(430,660,440,700,436,760);cc.lineTo(420,1110);cc.lineTo(100,1110);cc.lineTo(96,900);
    cc.bezierCurveTo(150,872,200,836,246,786);cc.bezierCurveTo(290,738,326,676,352,598);cc.closePath();};
  ag_soft(c,drape,ag_dk(cl,0.03),[255,255,255],400,660,260,rgba(ag_dk(cl,0.62),0.34),26);
  // the cloth's rolled edge across the chest, and its folds, falling from the far shoulder
  c.save();ag_shape(c,drape);c.clip();c.lineCap="round";
  for(const f of [[[344,640],[300,760],[180,880]],[[392,660],[360,800],[300,960]],[[420,760],[400,880],[380,1040]],[[250,880],[300,920],[330,1000]]]){
    c.strokeStyle=rgba(ag_dk(cl,0.5),0.2);c.lineWidth=4;c.beginPath();c.moveTo(f[0][0],f[0][1]);c.quadraticCurveTo(f[1][0],f[1][1],f[2][0],f[2][1]);c.stroke();
    c.strokeStyle="rgba(255,255,255,0.55)";c.lineWidth=2;c.beginPath();c.moveTo(f[0][0]+3,f[0][1]-3);c.quadraticCurveTo(f[1][0]+3,f[1][1]-3,f[2][0]+3,f[2][1]-3);c.stroke();}
  c.restore();
  c.strokeStyle=rgba(ag_dk(cl,0.35),0.5);c.lineWidth=7;c.beginPath();c.moveTo(352,600);c.bezierCurveTo(326,678,290,740,246,788);c.bezierCurveTo(200,838,150,874,96,902);c.stroke();
  c.strokeStyle="rgba(255,255,255,0.8)";c.lineWidth=3;c.beginPath();c.moveTo(356,604);c.bezierCurveTo(330,682,294,744,250,792);c.bezierCurveTo(204,842,154,878,100,906);c.stroke();
  c.restore();}
// the hair, combed back close to the skull and knotted on the right side of the head (the side we see), with the ear over it
function mc_tied(c,P){const C=ag_colours(P),h=P.hair.c;
  ag_soft(c,AG_HAIR.cropped,h,C.hairHi,336,300,110,"rgba(0,0,0,0.5)",18);
  c.save();ag_shape(c,AG_HAIR.cropped);c.clip();c.strokeStyle=rgba(ag_lt(h,0.55),0.2);c.lineWidth=1.8;c.lineCap="round";
  for(const s of [[[384,348],[334,326],[292,334]],[[376,318],[330,300],[290,320]],[[330,296],[300,298],[288,318]],[[226,440],[226,392],[248,352]],[[300,370],[290,356],[280,350]]]){
    c.beginPath();c.moveTo(s[0][0],s[0][1]);c.quadraticCurveTo(s[1][0],s[1][1],s[2][0],s[2][1]);c.stroke();}
  c.restore();
  ag_soft(c,AG_F.ear,mix(P.skin,ag_dk(P.skin,0.4),0.2),P.skin,264,424,32,C.skinShade,10);c.strokeStyle=rgba(mix(P.skin,[90,40,30],0.5),0.6);c.lineWidth=2;ag_shape(c,AG_F.earIn);c.stroke();
  // the knot: a coil sitting on the side of the head above the ear, a soft shadow under it
  c.save();c.shadowColor="rgba(0,0,0,0.35)";c.shadowBlur=8;c.shadowOffsetX=-3;c.shadowOffsetY=5;c.fillStyle=rgba(h,1);c.beginPath();c.ellipse(276,330,33,29,-0.3,0,TAU);c.fill();c.restore();
  ag_soft(c,cc=>cc.ellipse(276,330,33,29,-0.3,0,TAU),h,C.hairHi,290,316,34,"rgba(0,0,0,0.5)",8);
  c.strokeStyle=rgba(ag_lt(h,0.5),0.32);c.lineWidth=2.2;c.lineCap="round";
  c.beginPath();c.ellipse(278,329,21,17,-0.3,-2.6,1.4);c.stroke();c.beginPath();c.ellipse(279,329,10,8,-0.3,-2.2,2.4);c.stroke();}
const mc_reciter=(name,key,skin,hair,beard,breath)=>({name,key,skin,hair:{style:"shaved",c:hair},beard,top:{kind:"bare",c:skin,paint:mc_drape},hat:{paint:mc_tied},breath});
const MC_TEACHER=mc_reciter("the teacher","mc-teacher",[164,114,84],[140,136,132],[156,152,148],0.2);
const MC_BOY1=mc_reciter("the elder student","mc-boy1",[176,124,92],[30,24,24],null,0.3);
const MC_BOY2=mc_reciter("the younger student","mc-boy2",[158,108,80],[26,22,22],null,0.34);
// the lap: legs crossed under the waist cloth, in figure space, over the flat end of the half-figure: low and wide, the knees out
function mc_lapPath(c){c.moveTo(40,1010);c.bezierCurveTo(90,962,200,948,300,950);c.bezierCurveTo(430,950,560,968,628,1004);c.bezierCurveTo(666,1026,664,1074,626,1096);
  c.bezierCurveTo(540,1140,400,1150,290,1146);c.bezierCurveTo(160,1142,50,1124,22,1080);c.bezierCurveTo(10,1056,18,1028,40,1010);c.closePath();}
function mc_lap(ctx,P){const cl=MC_CLOTH;ag_soft(ctx,mc_lapPath,ag_dk(cl,0.05),[255,255,255],500,980,340,rgba(ag_dk(cl,0.62),0.36),24);
  ctx.save();ag_shape(ctx,mc_lapPath);ctx.clip();ctx.lineCap="round";
  for(const f of [[[120,1000],[230,1050],[300,1140]],[[330,966],[440,996],[560,1030]],[[600,1012],[560,1060],[470,1100]],[[60,1050],[140,1086],[200,1140]]]){
    ctx.strokeStyle=rgba(ag_dk(cl,0.55),0.2);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(f[0][0],f[0][1]);ctx.quadraticCurveTo(f[1][0],f[1][1],f[2][0],f[2][1]);ctx.stroke();
    ctx.strokeStyle="rgba(255,255,255,0.45)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(f[0][0]+3,f[0][1]-4);ctx.quadraticCurveTo(f[1][0]+3,f[1][1]-4,f[2][0]+3,f[2][1]-4);ctx.stroke();}
  ctx.restore();}
// a bare arm: people.js's arm (ag_arm) ends in a sleeve's cuff at the wrist; the reciters' arms are bare, so the near arm is drawn
// again over it, the same shape a little fuller at the wrist (to cover the cuff), and the hand over that
function mc_bareArm(c,P,spec){const C=ag_colours(P),J=AG_FIG.shoulder.near,j=ag_joints(J,spec),col=P.skin,w=[AG_FIG.w[0],AG_FIG.w[1],AG_FIG.w[2]+10],
    hx=lerp(j.J[0],j.E[0],0.3)+30,hy=lerp(j.J[1],j.E[1],0.3)-20,ah=Math.atan2(j.Wr[1]-j.E[1],j.Wr[0]-j.E[0]),u=[Math.cos(ah),Math.sin(ah)],
    a1=Math.atan2(j.E[1]-j.J[1],j.E[0]-j.J[0]),turn=Math.abs(Math.atan2(Math.sin(ah-a1),Math.cos(ah-a1)));
  if(turn<1.25)ag_soft(c,ag_armPath(j.J,j.E,j.Wr,w),ag_dk(col,0.16),ag_lt(col,0.28),hx,hy,240,rgba(ag_dk(col,0.8),0.42),20);
  else{ag_soft(c,cc=>ag_capsule(cc,j.J,j.E,w[0],w[1]),ag_dk(col,0.16),ag_lt(col,0.28),hx,hy,240,rgba(ag_dk(col,0.8),0.42),20);
    ag_soft(c,cc=>ag_capsule(cc,j.E,j.Wr,w[1]*0.96,w[2]),ag_dk(col,0.1),ag_lt(col,0.3),j.E[0]+u[0]*80+20,j.E[1]+u[1]*80-20,200,rgba(ag_dk(col,0.8),0.42),18);}
  ag_hand(c,[j.Wr[0]+u[0]*6,j.Wr[1]+u[1]*6],ah+(spec[2]==="open"?-0.3:0),spec[2]||"rest",P,C,u[0]>=0?1:-1);}
// how a reciter sits: the near hand resting on the near knee, the far one on the far knee; MC_POSE.teach opens the near hand as he
// speaks, MC_POSE.raise lifts it, palm out, to stop a slip; MC_POSE.empty holds both hands out, open and empty
const MC_POSE={sit:{near:[2,72,"rest"],far:[-6,66,"rest"]},teach:{near:[22,96,"open"],far:[-6,66,"rest"]},raise:{near:[48,140,"open"],far:[-6,66,"rest"]},
  empty:{near:[18,92,"open"],far:[8,84,"open"]}};
// one reciter seated cross-legged: the person (o as ag_person's, o.pose one of MC_POSE or angles), the lap drawn over the waist and
// under the near arm. o.k: a slimmer build (1 for an adult)
function mc_seated(ctx,who,x,y,s,o){o=Object.assign({pose:MC_POSE.sit},o||{});const P=ag_spec(who),k=o.k||1,inLap=o.inLap;
  ctx.save();ctx.translate(x,y);ctx.scale(k,1);ctx.translate(-x,-y);
  ag_floorShadow(ctx,x+(o.flip?-1:1)*70*s,y+540*s,320*s,34*s,0.24);
  const near=(typeof o.pose==="string"?MC_POSE[o.pose]:ag_poseOf(o)).near,hold=o.hold;
  const q=Object.assign({},o,{covered:true,holdBack:(c,h)=>{mc_lap(c,P);if(inLap)inLap(c,h);},hold:(c,h)=>{mc_bareArm(c,P,near);if(hold)hold(c,h);}});
  const hands=ag_person(ctx,who,x,y,s,q);ctx.restore();return hands;}
// where a seated reciter's mouth is, in the frame (for a line of light leaving it)
function mc_mouth(x,y,s,flip){return[x+(flip?-1:1)*(366-AG_FIG.anchor[0])*s,y+(484-AG_FIG.anchor[1])*s];}

/* ---------------------------------------------------------------- a verse's words, and the patterns
   Four words of a verse, written a, b, c and d as scholars write them (Staal): pale oak tiles with a dark letter. A slip is an amber x.
   The four patterns, each with its label at its left: as it's recited (abcd, joined), word by word (a / b / c / d), in pairs
   (ab bc cd) and braided, back and forth (ab ba ab bc cb bc). A thin green thread joins each word to itself in every row. */
const MC_TILE=56;
// a tile centred on (x, y): o.s its size, o.slip 0 to 1 (an amber x), o.grey 0 to 1 (fading from memory), o.lift (px up), o.a, o.k (spring)
function mc_tile(ctx,x,y,ch,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const s=(o.s||1)*(o.k==null?1:lerp(0.4,1,o.k)),h=MC_TILE*s,r=10*s,sl=clamp(o.slip||0,0,1),gr=clamp(o.grey||0,0,1);
  y-=o.lift||0;ctx.save();ctx.globalAlpha*=a;if(o.rot)ag_about(ctx,x,y,1),ctx.translate(x,y),ctx.rotate(o.rot),ctx.translate(-x,-y);
  const base=mix(mix(AG_OAK.base,[236,226,206],0.35),AG.amber,sl*0.85),top=mix(mix(AG_OAK.hi,[250,244,232],0.4),ag_lt(AG.amber,0.35),sl*0.85),gb=mix(base,[206,204,200],gr),gt=mix(top,[226,224,222],gr);
  ctx.save();ctx.shadowColor="rgba(46,38,28,"+(0.26*(1-gr*0.6))+")";ctx.shadowBlur=14*s;ctx.shadowOffsetX=AG.sdx*0.6*s;ctx.shadowOffsetY=7*s;ctx.fillStyle=rgba(gb,1);rr(ctx,x-h/2,y-h/2,h,h,r);ctx.fill();ctx.restore();
  const g=ctx.createLinearGradient(0,y-h/2,0,y+h/2);g.addColorStop(0,rgba(gt,1));g.addColorStop(1,rgba(gb,1));ctx.fillStyle=g;rr(ctx,x-h/2,y-h/2,h,h,r);ctx.fill();
  ctx.strokeStyle=rgba(ag_dk(gb,0.25),0.5);ctx.lineWidth=1.4;ctx.stroke();
  if(o.glow>0){ctx.save();ctx.shadowColor=rgba(AG.green,0.7*o.glow);ctx.shadowBlur=18;ctx.strokeStyle=rgba(AG.green,0.9*o.glow);ctx.lineWidth=3*s;rr(ctx,x-h/2,y-h/2,h,h,r);ctx.stroke();ctx.restore();}
  const ink=mix(mix(AG.ink,[255,255,255],sl),[150,148,146],gr*(1-sl));
  ag_T(ctx,sl>0.5?"x":ch,x,y+12*s,{w:700,size:Math.max(28,34*s),align:"center",color:rgba(ink,1)});
  ctx.restore();}
// the rows: their labels, and each tile's letter and place (x from the row's left, y the row's centre). gap: between tiles in a group
const MC_ROWS=[{label:"as it's recited",groups:["abcd"]},{label:"word by word",groups:["a","b","c","d"],split:1},
  {label:"in pairs",groups:["ab","bc","cd"]},{label:"braided, back and forth",groups:["ab","ba","ab","bc","cb","bc"]}];
function mc_rowTiles(r,cx,y,o){o=o||{};const R=MC_ROWS[r],s=o.s||1,t=MC_TILE*s,inG=4*s,between=(R.split?44:r===3?18:30)*s,out=[];let x=0;
  R.groups.forEach((g,gi)=>{for(let i=0;i<g.length;i++){out.push({ch:g[i],x,y,g:gi,i,r,k:out.length});x+=t+inG;}x+=between-inG;});
  const w=x-(between-inG)-inG;out.forEach(q=>q.x+=cx-w/2+t/2);return out;}
// the patterns: rows centred on cx, opening one at a time (o.open[r] 0 to 1), each label on a pill at its row's left; returns every tile.
// o.slip: the slipped tile, 0 to 1 (row 2's fourth tile: bc said as bx); o.glow 0 to 1 (green when they agree); o.grey (fading)
function mc_rows(ctx,cx,Y,o){o=o||{};const s=o.s||1,dy=(o.dy||104)*s,all=[];const open=o.open||[1,1,1,1];
  for(let r=0;r<4;r++){const y=Y+r*dy,ts=mc_rowTiles(r,cx,y,{s}),op=clamp(open[r],0,1);all.push(ts);if(op<=0)continue;
    const lw=ag_tw(ctx,MC_ROWS[r].label,{w:700,size:30})+56,lx=ts[0].x-MC_TILE*s/2-22*s-lw/2;
    if(o.labelA!==0)ag_pill(ctx,lx,y,MC_ROWS[r].label,{a:op*(o.labelA==null?1:o.labelA)});
    // the recited row is one breath: a soft band of light behind its joined tiles
    if(r===0){const w=ts[3].x-ts[0].x+MC_TILE*s;ctx.save();ctx.globalAlpha*=op;ctx.fillStyle="rgba(255,248,226,0.6)";rr(ctx,ts[0].x-MC_TILE*s/2-8,y-MC_TILE*s/2-8,w*ag_sine(op*1.4)+16,MC_TILE*s+16,16);ctx.fill();ctx.restore();}
    if(r===1)for(let i=1;i<4;i++){ctx.save();ctx.globalAlpha*=op;ctx.strokeStyle=rgba(AG.mut,0.6);ctx.lineWidth=3;ctx.lineCap="round";const mx=(ts[i-1].x+ts[i].x)/2;
      ctx.beginPath();ctx.moveTo(mx+8,y-18);ctx.lineTo(mx-8,y+18);ctx.stroke();ctx.restore();}
    if(o.tiles===false)continue;
    ts.forEach((tl,i)=>{const u=clamp(op*1.6-i/ts.length*0.6,0,1);if(u<=0)return;const slipped=r===2&&i===3?(o.slip||0):0;
      mc_tile(ctx,tl.x,tl.y,tl.ch,{s,a:u,k:ag_spr(u,0,0.35),slip:slipped,glow:(o.glow||0)*(1-slipped),grey:o.grey||0});});}
  return all;}
// the threads: each word joined to itself from row to row (each tile to the nearest of its letter in the row above), drawn under the
// tiles; p 0 to 1 how far down they've run; o.slip breaks the threads through the slipped tile, amber and dashed
function mc_threads(ctx,rows,p,o){o=o||{};if(p<=0)return;const sl=o.slip||0;ctx.save();ctx.lineCap="round";if(o.a!=null)ctx.globalAlpha*=o.a;
  const up=(r,tl)=>{const c=rows[r-1].filter(q=>q.ch===tl.ch);return c.length?c.reduce((m,z)=>Math.abs(z.x-tl.x)<Math.abs(m.x-tl.x)?z:m,c[0]):null;};
  for(let r=1;r<4;r++){const u=clamp(p*3-(r-1),0,1);if(u<=0)break;
    rows[r].forEach((tl,i)=>{const q=up(r,tl);if(!q)return;const bad=sl>0.02&&((r===2&&i===3)||(r===3&&q.r===2&&q.k===3)),half=MC_TILE*(o.s||1)/2,
      y0=q.y+half-6,y1=lerp(y0,tl.y-half+6,u),x1=lerp(q.x,tl.x,u);
      ctx.strokeStyle=bad?rgba(AG.amber,0.95):rgba(AG.green,0.85);ctx.lineWidth=3.2;ctx.setLineDash(bad?[10,9]:[]);
      ctx.beginPath();ctx.moveTo(q.x,y0);ctx.bezierCurveTo(q.x,lerp(y0,y1,0.55),x1,lerp(y0,y1,0.45),x1,y1);ctx.stroke();});}
  ctx.setLineDash([]);ctx.restore();}

/* ---------------------------------------------------------------- light that carries a hymn
   A ribbon of soft light along a curve [x0,y0, x1,y1, x2,y2, x3,y3], drawn from u0 to u1; a hymn rising (mc_rise) as faint ribbons
   that drift up and fade, too many to count */
function mc_ribbon(ctx,p,u0,u1,a,w){if(a<=0||u1<=u0)return;ctx.save();ctx.lineCap="round";ctx.globalCompositeOperation="lighter";
  for(const [lw,al] of [[w*3.2,0.08],[w*1.6,0.16],[w*0.6,0.5]]){ctx.strokeStyle="rgba(255,236,196,"+(al*a)+")";ctx.lineWidth=lw;ag_bzPath(ctx,p,u0,u1);ctx.stroke();}
  const q=ag_bz(p,u1);glow(ctx,q[0],q[1],w*4,[255,240,210],0.5*a);ctx.restore();}
function mc_rise(ctx,t,srcs,a,n){if(a<=0)return;n=n||30;for(let i=0;i<n;i++){const s=srcs[i%srcs.length],ph=hash(i,7),u=((t*0.07+ph)%1),x=s[0]+Math.sin(u*6+i)*30+(hash(i,3)-0.5)*120*u,
    y=s[1]-u*420,len=40+60*hash(i,5),p=[x,y,x+12,y-len*0.3,x-10,y-len*0.7,x+4,y-len];mc_ribbon(ctx,p,0,1,a*Math.sin(u*Math.PI)*0.7,3);}}

/* ---------------------------------------------------------------- tags and corner words
   mc_tag: a pill with words, where the place or the time is said (the riverbank's sky needs a card under its words, the room's
   marble doesn't); mc_corner: the day or the time at the top right of the room, in the kicker's letter-spaced capitals */
function mc_tag(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=ag_tw(ctx,text,{w:700,size:30})+56,cx=o.align==="right"?x-w/2:o.align==="center"?x:x+w/2;
  ctx.save();if(o.k!=null)ag_about(ctx,cx,y,lerp(0.6,1,o.k));ag_pill(ctx,cx,y,text,{a,col:o.col});ctx.restore();return{x:cx-w/2,w};}
function mc_corner(ctx,text,a,o){o=o||{};if(a<=0)return;ag_T(ctx,String(text).toUpperCase(),o.x||1824,o.y||100,{w:700,size:28,ls:3.5,align:"right",col:o.col||AG.violet,a});}

/* ---------------------------------------------------------------- the room's things
   mc_answer: an answer card from the agent, all the same shape and the same type, so each looks as sure as the last: a kicker, the
   answer, and at its foot the evidence slot, grey and empty ("evidence: —") until the answer shows where it came from (o.fill 0 to 1:
   the query, then the rows, in orange, data coming back). o.source: a source it cites (orange, as real as any; o.false 0 to 1 turns it
   amber, struck through; o.srcA its opacity, as it's written in). o.sorry: a line above the answer. o.turn 0 to 1 turns the card over to o.back (another answer's words). */
const MC_ANS_W=520;
function mc_answerW(ctx,o){let w=MC_ANS_W;for(const [t,f] of [[o.title,{w:800,size:40}],[o.source,{w:600,size:28}],[o.sorry,{w:600,size:28}],[o.why,{w:600,size:28}]])if(t)w=Math.max(w,ag_tw(ctx,t,f)+64);return Math.ceil(w);}
function mc_answerH(o){return 28+38+56+(o.sorry?42:0)+(o.source?42:0)+(o.why?42:0)+18+(o.fill>0?170:62)+28;}
function mc_answer(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return{x,y,w:MC_ANS_W,h:0};const tn=clamp(o.turn||0,0,1);
  if(tn>0&&o.back){const sx=Math.abs(Math.cos(tn*Math.PI)),q=tn<0.5?o:Object.assign({},o,o.back,{turn:0,back:null});
    const cw=Math.max(mc_answerW(ctx,o),mc_answerW(ctx,Object.assign({},o,o.back)));ctx.save();ctx.translate(x+cw/2,y);ctx.scale(Math.max(0.02,sx),1);ctx.translate(-(x+cw/2),-y);const r=mc_answer(ctx,x,y,Object.assign({},q,{turn:0,back:null}));ctx.restore();return r;}
  const w=o.w||mc_answerW(ctx,o),h=mc_answerH(o);ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,o.kx||x+w/2,o.ky||y+h/2,lerp(0.55,1,o.k));
  ag_box(ctx,x,y,w,h,22,{edge:o.edge||null,edgeA:o.edgeA,glow:o.glowC||null,glowA:o.glowA});
  let yy=y+28+22;ag_T(ctx,(o.kick||"answer").toUpperCase(),x+30,yy,{w:700,size:28,ls:4,col:AG.violet});
  if(o.sorry){yy+=42;ag_T(ctx,o.sorry,x+30,yy,{w:600,size:28,col:AG.mut});}
  yy+=56;ag_T(ctx,o.title,x+30,yy,{w:800,size:40});
  if(o.source){yy+=42;const f=clamp(o.false||0,0,1),col=mix(AG.orange,AG.amber,f);ag_T(ctx,o.source,x+30,yy,{w:600,size:28,col,a:o.srcA==null?1:o.srcA});
    if(f>0){const tw2=ag_tw(ctx,o.source,{w:600,size:28});ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+28,yy-9);ctx.lineTo(x+30+tw2*ag_sine(f),yy-9);ctx.stroke();}}
  if(o.why){yy+=42;ag_T(ctx,o.why,x+30,yy,{w:600,size:28,col:o.whyCol||AG.green});}
  // the evidence slot
  yy+=18;const sh=o.fill>0?170:62,sy=yy,fl=clamp(o.fill||0,0,1),pulse=o.pulse||0;
  ctx.save();rr(ctx,x+22,sy,w-44,sh,14);ctx.fillStyle=rgba(mix([226,224,220],[244,232,222],fl),1);ctx.fill();
  ctx.strokeStyle=fl>0?rgba(AG.orange,0.75*fl):"rgba(60,50,40,"+(0.16+0.4*pulse)+")";ctx.lineWidth=fl>0?2.4:1.4+2*pulse;ctx.setLineDash(fl>0?[]:[8,7]);ctx.stroke();ctx.setLineDash([]);ctx.restore();
  if(pulse>0){ctx.save();ctx.shadowColor=rgba(AG.amber,0.5*pulse);ctx.shadowBlur=20;ctx.strokeStyle=rgba(AG.amber,0.6*pulse);ctx.lineWidth=2;rr(ctx,x+22,sy,w-44,sh,14);ctx.stroke();ctx.restore();}
  if(fl<=0)ag_T(ctx,"evidence: —",x+46,sy+41,{w:600,size:28,col:AG.mut});
  else{const q=ag_in(fl,0,0.45),r=ag_in(fl,0.45,0.5);
    withA(ctx,q,()=>{ag_T(ctx,"the query",x+46,sy+40,{w:700,size:28,col:AG.orange});for(let i=0;i<3;i++){ctx.fillStyle=rgba(AG.orange,0.28);rr(ctx,x+46,sy+56+i*16,[300,220,260][i]*q,8,4);ctx.fill();}});
    withA(ctx,r,()=>{const tx=x+w-46-150;ag_T(ctx,"the rows",tx,sy+40,{w:700,size:28,col:AG.orange});
      for(let i=0;i<5;i++){ctx.fillStyle=rgba(i%2?[236,226,216]:[228,214,202],1);ctx.fillRect(tx,sy+54+i*20,150*r,18);ctx.fillStyle=rgba(AG.orange,0.3);ctx.fillRect(tx+8,sy+60+i*20,40*r,6);ctx.fillRect(tx+60,sy+60+i*20,70*r,6);}});}
  ctx.restore();return{x,y,w,h};}
// a speech bubble from a person: tail to (px, py); o.k springs it in, o.a
function mc_bubble(ctx,x,y,w,text,px,py,o){o=o||{};return ag_textCard(ctx,x,y,w,{title:text},{tail:{side:o.side||"bottom",at:o.at==null?0.15:o.at,px,py},a:o.a,k:o.k,edge:o.edge});}
// a memory: a soft-edged card, no hard edge, rising from a person's head with three small rounds
function mc_memory(ctx,x,y,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const w=ag_tw(ctx,text,{w:700,size:32})+64,h=74,soft=o.soft==null?1:o.soft;
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h,lerp(0.6,1,o.k));
  ctx.save();ctx.shadowColor="rgba(250,248,244,"+(0.95*soft)+")";ctx.shadowBlur=26;ctx.fillStyle="rgba(250,248,244,0.93)";rr(ctx,x,y,w,h,h/2);ctx.fill();ctx.fill();ctx.restore();
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.12)";ctx.shadowBlur=30;ctx.shadowOffsetY=12;ctx.fillStyle="rgba(250,248,244,0.6)";rr(ctx,x,y,w,h,h/2);ctx.fill();ctx.restore();
  if(o.tail)for(let i=0;i<3;i++){const u=(i+1)/4,cx=lerp(x+w*0.2,o.tail[0],u),cy=lerp(y+h,o.tail[1],u);ctx.fillStyle="rgba(250,248,244,0.92)";ctx.save();ctx.shadowColor="rgba(46,38,28,0.14)";ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(cx,cy,12-i*3,0,TAU);ctx.fill();ctx.restore();}
  ctx.save();if(o.blur)ctx.filter="blur("+o.blur+"px)";ag_T(ctx,text,x+32,y+h/2+11,{w:700,size:32,col:AG.ink});ctx.restore();
  ctx.restore();return{x,y,w,h};}
// a paper: a white sheet with a kicker, a title and grey lines; o.rot turns it, o.lines how many lines of grey text
function mc_paper(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=22;ctx.shadowOffsetX=AG.sdx*0.8;ctx.shadowOffsetY=10;ctx.fillStyle="#FBFAF7";ctx.fillRect(0,0,w,h);ctx.restore();
  ctx.fillStyle="#FBFAF7";ctx.fillRect(0,0,w,h);ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.lineWidth=1.2;ctx.strokeRect(0,0,w,h);
  let yy=46;if(o.kick){ag_T(ctx,o.kick.toUpperCase(),28,yy,{w:700,size:28,ls:4,col:o.kickCol||AG.blue});yy+=8;}
  if(o.title){for(const l of ag_wrap(ctx,o.title,w-56,{w:800,size:34})){yy+=42;ag_T(ctx,l,28,yy,{w:800,size:34});}}
  if(o.sub){for(const l of ag_wrap(ctx,o.sub,w-56,{w:600,size:28})){yy+=38;ag_T(ctx,l,28,yy,{w:600,size:28,col:o.subCol||AG.mut});}}
  yy+=26;const R=ag_rnd(o.seed||3),n=o.lines==null?6:o.lines;for(let i=0;i<n&&yy<h-24;i++){ctx.fillStyle="rgba(60,56,52,0.16)";ctx.fillRect(28,yy,(w-56)*(0.55+0.45*R())*(i===n-1?0.6:1),8);yy+=22;}
  if(o.draw)o.draw(ctx,w,h);
  ctx.restore();}
// a speech-free card on the wall or the floor: words on a card, as ag_textCard, with a coloured edge where the colour means something
function mc_card(ctx,x,y,w,words,o){return ag_textCard(ctx,x,y,w,words,o||{});}
// one word the agent writes, at (x, y), taken at T from a small stack of three likely words over its place, the most likely on top
// (violet) and all left-aligned with the word: the stack rises in, the other two fade, and the top one drops into the line, growing
// to the line's size. MC_STK: the top word's height over the line, and the step between the three
const MC_STK={top:150,step:48};
function mc_pick(ctx,x,y,words,t,T,o){o=o||{};const s={w:700,size:28},a=o.a==null?1:o.a;
  const sIn=ag_in(t,T-0.48,0.22);if(sIn<=0||a<=0)return;const rise=1-ag_eo(ag_in(t,T-0.48,0.3)),rest=1-ag_in(t,T-0.14,0.2),e=ag_eo(ag_in(t,T,0.34));
  ctx.save();ctx.globalAlpha*=a;
  if(rest>0)for(let i=words.length-1;i>0;i--){const yy=y-MC_STK.top+i*MC_STK.step+rise*16,pw=ag_tw(ctx,words[i],s)+36;
    withA(ctx,sIn*rest,()=>{ag_box(ctx,x-18,yy-21,pw,42,21,{edgeA:0.3});ag_T(ctx,words[i],x,yy+10,Object.assign({},s,{col:AG.mut,a:0.95-0.15*i}));});}
  const y0=y-MC_STK.top+rise*16,yy=lerp(y0,y-12,e),box=1-ag_in(t,T+0.04,0.26),sz=lerp(28,34,e),pw=ag_tw(ctx,words[0],{w:700,size:sz})+36;
  if(box>0)withA(ctx,sIn*box,()=>ag_box(ctx,x-18,yy-21,pw,42,21,{edge:AG.violet,edgeA:0.9}));
  ag_T(ctx,words[0],x,lerp(y0+10,y,e),{w:700,size:sz,col:o.col||AG.violet,a:sIn});
  ctx.restore();}
// the agent: the sphere in its oak ring, without the steps (this film doesn't follow its loop); o.spin turns the ring's light once
// round (0 to 1) as it answers, the other way round with o.dir -1; o.clear 0 to 1 empties it (a new chat: the band dims and the ring's light goes); o.label
function mc_agent(ctx,x,y,o){o=o||{};const R=o.R||150,r=o.r||74,a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const cl=clamp(o.clear||0,0,1);
  ag_modelLight(ctx,x,y,r,(o.core==null?0.8:o.core)*(1-0.6*cl),o.floor);
  const sp=o.spin;ag_ring(ctx,x,y,R,{p:1,from:-90,arrows:[-30,90,210],pulse:sp>0&&sp<1?{deg:-90+(o.dir||1)*360*ag_sine(sp),a:Math.sin(Math.PI*sp)}:null});
  ag_model(ctx,x,y,r,{t:o.t||0,core:(o.core==null?0.8:o.core)*(1-0.7*cl),think:o.think||0,label:o.label===undefined?"Agent":o.label});
  ctx.restore();}

/* ---------------------------------------------------------------- Cambridge, about 1920
   A college room: plaster above dark oak panelling, a tall window on the right, a bookcase, a desk. Bartlett is a man in his thirties
   in a three-piece suit, not a likeness; the people he asks to retell the tale are a woman and a man of the time. The tale itself is
   never drawn: its page is grey lines under its English title. */
const MC_CAM={wall:[226,214,192],panel:[118,86,60],floor:[132,100,72],desk:[110,78,52],hz:700};
function mc_paintCambridge(c){const P=MC_CAM,hz=P.hz;
  let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(ag_dk(P.wall,0.1),1));g.addColorStop(1,rgba(P.wall,1));c.fillStyle=g;c.fillRect(0,0,W,hz);
  // the tall window on the right: its light, its panes, the sky beyond
  const wx=1430,wy=60,ww=330,wh=600;g=c.createLinearGradient(0,wy,0,wy+wh);g.addColorStop(0,"#CFDDE6");g.addColorStop(1,"#EEF0EA");c.fillStyle=g;c.fillRect(wx,wy,ww,wh);
  c.fillStyle="rgba(160,170,160,0.5)";c.beginPath();c.moveTo(wx,wy+wh*0.78);c.bezierCurveTo(wx+ww*0.3,wy+wh*0.7,wx+ww*0.6,wy+wh*0.74,wx+ww,wy+wh*0.68);c.lineTo(wx+ww,wy+wh);c.lineTo(wx,wy+wh);c.closePath();c.fill();
  c.strokeStyle="#F4EFE6";c.lineWidth=10;c.strokeRect(wx,wy,ww,wh);c.lineWidth=6;for(const u of [1/3,2/3]){c.beginPath();c.moveTo(wx+ww*u,wy);c.lineTo(wx+ww*u,wy+wh);c.stroke();}
  for(const u of [0.25,0.5,0.75]){c.beginPath();c.moveTo(wx,wy+wh*u);c.lineTo(wx+ww,wy+wh*u);c.stroke();}
  c.fillStyle="rgba(60,40,24,0.25)";c.fillRect(wx-24,wy+wh,ww+48,18);
  g=c.createRadialGradient(wx+ww/2,wy+wh/2,40,wx+ww/2,wy+wh/2,900);g.addColorStop(0,"rgba(255,250,236,0.35)");g.addColorStop(1,"rgba(255,250,236,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // the panelling: dark oak below the dado rail, in tall panels
  const py=440;g=c.createLinearGradient(0,py,0,hz);g.addColorStop(0,rgba(P.panel,1));g.addColorStop(1,rgba(ag_dk(P.panel,0.2),1));c.fillStyle=g;c.fillRect(0,py,W,hz-py);
  c.fillStyle=rgba(ag_lt(P.panel,0.25),1);c.fillRect(0,py-12,W,14);c.fillStyle=rgba(ag_dk(P.panel,0.35),1);c.fillRect(0,py+2,W,4);
  for(let x=40;x<W;x+=210){ag_soft(c,cc=>ag_rect(cc,x,py+40,170,hz-py-70,6),ag_dk(P.panel,0.06),ag_lt(P.panel,0.18),x+150,py+50,160,"rgba(20,12,6,0.4)",10,0.4);}
  // a bookcase on the left
  const bx=90,by=120,bw=420,bh=py-by;c.fillStyle=rgba(ag_dk(P.panel,0.15),1);c.fillRect(bx-14,by-14,bw+28,bh+14);
  const R=ag_rnd(19);for(let sh=0;sh<3;sh++){const sy=by+sh*(bh/3);c.fillStyle=rgba(ag_dk(P.panel,0.5),1);c.fillRect(bx,sy,bw,bh/3-10);
    let x=bx+6;while(x<bx+bw-20){const w=12+R()*16,h=bh/3-24-R()*26,col=[[120,60,50],[70,80,90],[150,130,90],[90,70,60],[60,70,60]][(R()*5)|0];c.fillStyle=rgba(mix(col,[90,80,70],0.3),1);c.fillRect(x,sy+bh/3-10-h,w,h);
      c.fillStyle="rgba(255,240,210,0.18)";c.fillRect(x+w*0.3,sy+bh/3-10-h+8,2,h-16);x+=w+2;}
    c.fillStyle=rgba(ag_lt(P.panel,0.1),1);c.fillRect(bx-14,sy+bh/3-10,bw+28,10);}
  // the floor: boards in perspective
  g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(ag_dk(P.floor,0.15),1));g.addColorStop(1,rgba(P.floor,1));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  c.strokeStyle="rgba(40,24,12,0.25)";c.lineWidth=1.5;for(let i=-12;i<=12;i++){c.beginPath();c.moveTo(960+i*40,hz);c.lineTo(960+i*230,H);c.stroke();}
  c.fillStyle="rgba(20,12,6,0.35)";c.fillRect(0,hz,W,3);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(30,20,10,0.28)");g.addColorStop(0.5,"rgba(30,20,10,0.04)");g.addColorStop(1,"rgba(255,248,230,0.06)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.mcCambridge=mc_paintCambridge;
// the desk between them: dark oak, its top's front edge at y, from x0 to x1; returns the top's back edge (where people are cut)
function mc_desk1920(ctx,x0,x1,y,o){o=o||{};const d=80,a=o.a==null?1:o.a;if(a<=0)return y-d;ctx.save();ctx.globalAlpha*=a;const P=MC_CAM.desk;
  ag_floorShadow(ctx,(x0+x1)/2-10,y+170,(x1-x0)*0.55,30,0.35);
  let g=ctx.createLinearGradient(0,y-d,0,y);g.addColorStop(0,rgba(ag_lt(P,0.12),1));g.addColorStop(1,rgba(P,1));ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(x0+30,y-d);ctx.lineTo(x1-30,y-d);ctx.lineTo(x1,y);ctx.lineTo(x0,y);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(ag_dk(P,0.25),1);ctx.fillRect(x0,y,x1-x0,26);ctx.fillStyle=rgba(ag_dk(P,0.45),1);ctx.fillRect(x0+20,y+26,30,150);ctx.fillRect(x1-50,y+26,30,150);
  ctx.fillStyle=rgba(ag_dk(P,0.35),1);ctx.fillRect(x0+60,y+26,x1-x0-120,60);ctx.strokeStyle="rgba(255,230,190,0.16)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();
  ctx.restore();return y-d;}
const MC_BARTLETT={name:"the psychologist",key:"mc-bartlett",skin:[232,198,176],hair:{style:"side",c:[96,70,50]},top:{kind:"suit",c:[104,96,84],inner:[238,236,228],tie:[104,58,56]},breath:0.24};
const MC_WOMAN={name:"a woman, 1920",key:"mc-woman",skin:[236,206,186],hair:{style:"bob",c:[70,50,40]},earrings:[200,190,170],top:{kind:"cardigan",c:[124,112,104],inner:[236,232,222]},breath:0.3};
const MC_MAN={name:"a man, 1920",key:"mc-man",skin:[226,190,166],hair:{style:"side",c:[58,44,36]},top:{kind:"suit",c:[78,78,86],inner:[236,236,230],tie:[70,72,96]},breath:0.26};
const MC_MAN2=Object.assign({},MC_MAN,{name:"the same man, later",key:"mc-man2",hair:{style:"side",c:[120,110,100]}});

/* ---------------------------------------------------------------- Seattle, 1974
   A lecture room: a screen at the front, a blackboard, rows of seats seen from behind with an aisle down the middle, a projector on a
   cart throwing its beam over the heads. The students are seen from behind, dressed for 1974; the film on the screen is two plain
   cars meeting at a crossing, nobody in them, nothing broken. */
const MC_SEA={wall:[214,204,180],floor:[120,108,96],board:[64,70,66]};
function mc_paintSeattle(c){const P=MC_SEA;let g=c.createLinearGradient(0,0,0,640);g.addColorStop(0,rgba(ag_dk(P.wall,0.18),1));g.addColorStop(1,rgba(P.wall,1));c.fillStyle=g;c.fillRect(0,0,W,640);
  // acoustic tiles on the ceiling's edge, the blackboard, the screen pulled down over it
  c.fillStyle=rgba(ag_lt(P.wall,0.2),1);c.fillRect(0,0,W,46);c.strokeStyle="rgba(60,50,40,0.12)";for(let x=0;x<W;x+=96){c.beginPath();c.moveTo(x,0);c.lineTo(x,46);c.stroke();}
  ag_soft(c,cc=>ag_rect(cc,330,150,1260,400,6),P.board,ag_lt(P.board,0.15),900,200,600,null);c.fillStyle="rgba(150,130,100,0.8)";c.fillRect(320,548,1280,14);
  ag_soft(c,cc=>ag_rect(cc,560,96,800,450,4),[238,238,232],[255,255,252],960,200,700,"rgba(40,40,40,0.25)",12);c.fillStyle="#3A3A3E";c.fillRect(540,84,840,16);
  // the floor and the seats' backs, rising towards us in rows, the aisle down the middle
  g=c.createLinearGradient(0,600,0,H);g.addColorStop(0,rgba(P.floor,1));g.addColorStop(1,rgba(ag_dk(P.floor,0.25),1));c.fillStyle=g;c.fillRect(0,600,W,H-600);
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(20,16,12,0.3)");g.addColorStop(0.5,"rgba(20,16,12,0.02)");g.addColorStop(1,"rgba(20,16,12,0.3)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.mcSeattle=mc_paintSeattle;
// a row of seats' backs (r 0, the furthest, to 3, the nearest), drawn live over the students sitting in it, the aisle down the middle;
// the room's side shade is drawn again over them (mc_seaShade), as the place has it
const MC_ROWY=r=>640+r*120,MC_ROWK=r=>1+r*0.25;
function mc_seatRow(ctx,r){const y=MC_ROWY(r),k=MC_ROWK(r);for(const side of [-1,1]){const x0=side<0?-40:960+150*k*0.5,x1=side<0?960-150*k*0.5:W+40;
  ag_soft(ctx,cc=>ag_rect(cc,x0,y,x1-x0,40*k,10),[96,78,60],[140,116,90],side<0?x1-200:x1-300,y,400,"rgba(20,12,6,0.35)",8);}}
function mc_seaShade(ctx){const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(20,16,12,0.3)");g.addColorStop(0.5,"rgba(20,16,12,0.02)");g.addColorStop(1,"rgba(20,16,12,0.3)");ctx.fillStyle=g;ctx.fillRect(0,560,W,H-560);}
// the students, row by row from the back: each row's students (seen from behind, MC_STUDENTS), then that row's seat backs in front
// of them; the aisle down the middle is left clear for the projector's cart
const MC_SEATS=[[0,[300,470,640,1280,1450,1620]],[1,[230,430,630,1290,1490,1690]],[2,[150,390,640,1280,1530,1770]],[3,[260,560,1360,1660]]];
function mc_students(ctx,t,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;let n=0;
  for(const [r,xs] of MC_SEATS){const k=MC_ROWK(r),s=0.36+r*0.1,y=MC_ROWY(r)-104*s;ctx.save();ctx.beginPath();ctx.rect(-50,0,W+100,MC_ROWY(r)+30*k);ctx.clip();
    xs.forEach(x=>{mc_back(ctx,x,y,s,MC_STUDENTS[n%MC_STUDENTS.length],t+n*0.7);n++;});ctx.restore();mc_seatRow(ctx,r);}
  mc_seaShade(ctx);ctx.restore();}
// the projector on its cart in the aisle, its two reels turning while the film runs (run 0 to 1), the beam to the screen
function mc_projector(ctx,x,y,t,run){const r=34;
  // the beam: from the lens to the screen, soft and pale, brighter at the lens
  if(run>0){ctx.save();ctx.globalCompositeOperation="lighter";const g=ctx.createLinearGradient(x,y-40,960,300);g.addColorStop(0,"rgba(255,250,230,"+(0.32*run)+")");g.addColorStop(1,"rgba(255,250,230,"+(0.04*run)+")");
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-10,y-46);ctx.lineTo(566,104);ctx.lineTo(1354,104);ctx.lineTo(x+10,y-46);ctx.closePath();ctx.fill();ctx.restore();}
  // the cart: a steel frame on castors; the projector's body; two reels on their arms, turning
  ctx.fillStyle="#4A4A4E";ctx.fillRect(x-70,y+40,140,10);ctx.fillRect(x-62,y+50,8,90);ctx.fillRect(x+54,y+50,8,90);ctx.fillRect(x-70,y+120,140,8);
  ag_soft(ctx,cc=>ag_rect(cc,x-66,y-30,132,70,10),[70,72,76],[120,122,126],x+30,y-20,120,"rgba(0,0,0,0.4)",10);
  ctx.fillStyle="#2A2B2E";ctx.beginPath();ctx.arc(x,y-38,12,0,TAU);ctx.fill();
  for(const [dx,dy] of [[-40,-96],[44,-88]]){ctx.strokeStyle="#55565A";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x+dx*0.4,y-30);ctx.lineTo(x+dx,y+dy);ctx.stroke();
    ctx.save();ctx.translate(x+dx,y+dy);ctx.rotate(t*2.4*run);ctx.fillStyle="#3C3D41";ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.fillStyle="#6A6B70";
    for(let i=0;i<3;i++){ctx.rotate(TAU/3);ctx.beginPath();ctx.arc(r*0.5,0,r*0.22,0,TAU);ctx.fill();}ctx.fillStyle="#8A8B90";ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();ctx.restore();}}
// a student seen from behind: head and shoulders at (x, y) (the nape), s the size; spec {hair: [style, colour], top: colour, collar}
function mc_back(ctx,x,y,s,sp,t){const hc=sp.hair[1],tc=sp.top,st=sp.hair[0],br=Math.sin((t||0)*1.6+x*0.01)*1.5;ctx.save();ctx.translate(x,y+br);ctx.scale(s,s);
  // shoulders and back, in the clothes of the time; a wide collar
  ag_soft(ctx,cc=>{cc.moveTo(-60,10);cc.bezierCurveTo(-150,20,-200,60,-210,140);cc.lineTo(-220,320);cc.lineTo(220,320);cc.lineTo(210,140);cc.bezierCurveTo(200,60,150,20,60,10);cc.closePath();},
    tc,ag_lt(tc,0.25),120,60,220,rgba(ag_dk(tc,0.7),0.4),18);
  if(sp.collar)ag_soft(ctx,cc=>{cc.moveTo(-70,4);cc.lineTo(-120,46);cc.lineTo(-40,40);cc.lineTo(0,20);cc.lineTo(40,40);cc.lineTo(120,46);cc.lineTo(70,4);cc.closePath();},sp.collar,ag_lt(sp.collar,0.3),60,20,90,null);
  ag_soft(ctx,cc=>ag_rect(cc,-38,-40,76,60,20),sp.skin||[226,190,166],sp.skin||[236,206,186],20,-30,60,null);
  // the head from behind, and its hair
  const hair=cc=>{if(st==="long"){cc.moveTo(-70,-150);cc.bezierCurveTo(-80,-210,80,-210,70,-150);cc.bezierCurveTo(86,-80,90,0,70,40);cc.lineTo(-70,40);cc.bezierCurveTo(-90,0,-86,-80,-70,-150);cc.closePath();}
    else if(st==="afro"){cc.arc(0,-120,98,0,TAU);}
    else{cc.moveTo(-72,-130);cc.bezierCurveTo(-78,-200,78,-200,72,-130);cc.bezierCurveTo(76,-90,64,-50,46,-34);cc.lineTo(-46,-34);cc.bezierCurveTo(-64,-50,-76,-90,-72,-130);cc.closePath();}};
  ag_soft(ctx,cc=>cc.ellipse(-74,-100,12,22,0,0,TAU),sp.skin||[226,190,166],sp.skin||[236,206,186],-74,-110,20,null);ag_soft(ctx,cc=>cc.ellipse(74,-100,12,22,0,0,TAU),sp.skin||[226,190,166],sp.skin||[236,206,186],74,-110,20,null);
  ag_soft(ctx,hair,hc,ag_lt(hc,0.3),40,-170,140,rgba(ag_dk(hc,0.6),0.5),16);
  ctx.restore();}
const MC_STUDENTS=[{hair:["long",[92,64,42]],top:[120,92,66],collar:[226,214,190]},{hair:["short",[60,44,34]],top:[228,220,200]},{hair:["afro",[38,28,24]],top:[120,60,64],skin:[120,80,58],collar:[230,224,210]},
  {hair:["long",[196,170,120]],top:[176,150,116]},{hair:["short",[150,110,70]],top:[92,104,120],collar:[222,216,204]},{hair:["long",[30,24,22]],top:[120,120,124],skin:[214,178,140]},
  {hair:["short",[40,30,26]],top:[150,118,84],collar:[234,228,214]},{hair:["long",[120,82,52]],top:[100,84,92]}];
// the film on the screen: a crossing seen from above, two plain cars meeting (u 0 to 1), in the greys of a film of the time
function mc_crash(ctx,x,y,w,h,u){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle="#9C9C98";ctx.fillRect(x,y,w,h);
  ctx.fillStyle="#7E7E7A";ctx.fillRect(x,y+h*0.36,w,h*0.28);ctx.fillRect(x+w*0.42,y,w*0.16,h);ctx.fillStyle="#B8B8B2";for(let i=0;i<8;i++){ctx.fillRect(x+i*w/8+10,y+h*0.495,w/16,4);}
  const car=(cx,cy,ang,col)=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);ctx.fillStyle="rgba(0,0,0,0.25)";rr(ctx,-50,-22,104,48,10);ctx.fill();ctx.fillStyle=col;rr(ctx,-52,-24,104,48,12);ctx.fill();
    ctx.fillStyle="rgba(40,40,44,0.7)";rr(ctx,-14,-18,34,36,6);ctx.fill();ctx.restore();};
  const e=ag_eo(clamp(u,0,1));car(lerp(x-60,x+w*0.5-58,e),y+h*0.56,0,"#4A4A4E");car(x+w*0.5+4,lerp(y-60,y+h*0.5-50,e),Math.PI/2,"#D8D8D4");ctx.restore();}

/* ---------------------------------------------------------------- a memory, rebuilt (chapter 4)
   A head drawn in light, in profile, facing right: a few bright points light inside it (the details that are kept), soft lines sketch
   themselves in between them (the rest, filled with what seems likely: here, the riverbank from the opening), a dark patch where
   nothing is kept (o.gap), filled with a soft shape (o.likely) that comes out as bright as the rest (o.sure). s: 1 is about 420 px tall */
function mc_profile(c){c.moveTo(-40,-200);c.bezierCurveTo(60,-214,140,-170,156,-90);c.bezierCurveTo(162,-60,160,-30,166,-10);c.lineTo(196,40);c.bezierCurveTo(200,50,192,56,180,58);
  c.bezierCurveTo(184,70,180,80,176,84);c.bezierCurveTo(182,92,178,100,172,104);c.bezierCurveTo(176,118,170,132,150,138);c.bezierCurveTo(130,142,110,140,96,150);
  c.lineTo(90,210);c.lineTo(-60,210);c.bezierCurveTo(-56,170,-80,130,-110,100);c.bezierCurveTo(-160,40,-170,-60,-140,-130);c.bezierCurveTo(-120,-176,-90,-196,-40,-200);c.closePath();}
const MC_PTS=[[-120,-40],[40,-80],[-58,-10],[-150,60],[160,62],[40,96]];
function mc_head(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);
  // the head: a faint violet-grey glass, its outline in soft light
  ctx.save();ag_shape(ctx,mc_profile);ctx.fillStyle="rgba(250,248,244,0.42)";ctx.fill();ctx.restore();
  ctx.save();ctx.shadowColor="rgba(255,246,220,0.9)";ctx.shadowBlur=18;ctx.strokeStyle="rgba(150,136,110,0.75)";ctx.lineWidth=4;ag_shape(ctx,mc_profile);ctx.stroke();ctx.restore();
  ctx.save();ag_shape(ctx,mc_profile);ctx.clip();
  const sure=clamp(o.sure||0,0,1),fl=clamp(o.fill||0,0,1),ink=(al)=>"rgba(120,104,80,"+al+")";
  // the rest, filled in: a horizon, a tree, ripples; drawn on by fl, as bright as the points once sure
  const lines=[[[-150,60],[-40,52],[160,62]],[[-60,40],[-58,-10],[-50,-50]],[[-120,-40],[-60,-130],[40,-80]],[[40,-80],[90,-40],[20,-30]],[[-140,92],[-60,86],[40,96]],[[-20,118],[40,114],[120,122]]];
  lines.forEach((l,i)=>{const u=clamp(fl*1.6-i*0.12,0,1);if(u<=0)return;ctx.strokeStyle=ink(0.35+0.4*sure);ctx.lineWidth=5;ctx.lineCap="round";ctx.setLineDash([u*400,1000]);
    ctx.beginPath();ctx.moveTo(l[0][0],l[0][1]);ctx.quadraticCurveTo(l[1][0],l[1][1],l[2][0],l[2][1]);ctx.stroke();});ctx.setLineDash([]);
  // the gap, and what fills it
  const gp=clamp(o.gap||0,0,1),lk=clamp(o.likely||0,0,1);
  if(gp>0){const g=ctx.createRadialGradient(70,10,0,70,10,70);g.addColorStop(0,"rgba(40,36,44,"+(0.55*gp*(1-lk))+")");g.addColorStop(1,"rgba(40,36,44,0)");ctx.fillStyle=g;ctx.fillRect(0,-60,140,140);}
  if(lk>0){ctx.save();ctx.globalAlpha*=lk;ctx.fillStyle="rgba(255,240,206,"+(0.4+0.5*sure)+")";ctx.beginPath();ctx.ellipse(70,10,46*ag_eo(lk),34*ag_eo(lk),0.3,0,TAU);ctx.fill();
    ctx.strokeStyle=ink(0.5+0.3*sure);ctx.lineWidth=5;ctx.stroke();ctx.restore();}
  ctx.restore();
  // the points: the few details that are kept
  const n=o.pts==null?1:o.pts;MC_PTS.forEach((p,i)=>{const u=clamp(n*MC_PTS.length-i,0,1);if(u<=0)return;glow(ctx,p[0],p[1],34,[255,236,190],0.8*u);
    ctx.fillStyle="rgba(255,250,236,"+u+")";ctx.beginPath();ctx.arc(p[0],p[1],7,0,TAU);ctx.fill();});
  ctx.restore();}

/* ---------------------------------------------------------------- checking the work (chapter 5)
   mc_count: a route's number, under its card; mc_rows2: the platform's rows, three pairs lit amber, "counted twice"; mc_nightly: the
   plain check every night; mc_record: what's been checked, on the wall for the whole team; mc_signoff: drafted by the agent, approved
   by a person; mc_screenSearch: Jun's search for the review */
function mc_count(ctx,x,y,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x,y-20,lerp(0.5,1,o.k));
  ag_T(ctx,String(n),x,y,{w:800,size:64,align:"center",col:o.col||AG.ink});ctx.restore();}
function mc_rows2(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const n=10,rh=32,hi=clamp(o.hi||0,0,1),fx=clamp(o.fixed||0,0,1),pairs=[[1,2],[4,5],[7,8]];
  ctx.save();ctx.globalAlpha*=a;ag_box(ctx,x,y,w,n*rh+30,16,{});
  for(let i=0;i<n;i++){const yy=y+15+i*rh,lit=pairs.some(p=>p.includes(i)),u=lit?hi:0,gone=lit&&i===pairs.find(p=>p.includes(i))[1]?fx:0;
    ctx.save();ctx.globalAlpha*=1-gone*0.75;ctx.fillStyle=rgba(mix(i%2?[238,236,232]:[230,228,224],[246,226,196],u),1);ctx.fillRect(x+12,yy,w-24,rh-4);
    ctx.fillStyle=rgba(mix([150,146,140],AG.amber,u),0.55+0.3*u);rr(ctx,x+28,yy+13,90,12,6);ctx.fill();rr(ctx,x+140,yy+13,w-190,12,6);ctx.fill();
    if(gone>0){ctx.strokeStyle=rgba(AG.amber,0.9*gone);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+20,yy+19);ctx.lineTo(x+20+(w-40)*gone,yy+19);ctx.stroke();}ctx.restore();}
  for(const p of pairs){if(hi<=0)continue;const yy=y+15+p[0]*rh;ctx.save();ctx.globalAlpha*=hi;ctx.strokeStyle=rgba(AG.amber,0.9);ctx.lineWidth=3;rr(ctx,x+6,yy-4,w-12,rh*2+4,10);ctx.stroke();ctx.restore();}
  ctx.restore();}
function mc_moon(ctx,x,y,r,t,col){ctx.save();ctx.translate(x,y);ctx.rotate(t);ctx.fillStyle=col;ctx.beginPath();ctx.arc(0,0,r,0.6,TAU-0.6+Math.PI*0.0);ctx.arc(r*0.45,-r*0.1,r*0.78,TAU-0.9,0.9,true);ctx.closePath();ctx.fill();ctx.restore();}
function mc_nightly(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const w=o.w||540,b=ag_textCard(ctx,x,y,w,{kick:"every night",title:"nobody counted twice"},{edge:AG.blue,kickCol:AG.blue,a,k:o.k});
  ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+b.h/2,lerp(0.5,1,o.k));mc_moon(ctx,x+w-56,y+46,16,o.moon||0,rgba(AG.blue,0.85));
  if(o.tick>0)ag_tick(ctx,x+w-54,y+b.h-44,28,rgba(AG.green,o.tick),5);ctx.restore();return b;}
function mc_record(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y,lerp(0.6,1,o.k));
  const lines=["first-years who left · semester 1","Engineering and IT · 131","checked two ways · evidence attached"],h=28+38+lines.length*40+30;
  ag_box(ctx,x,y,w,h,20,{edge:AG.blue,edgeA:0.8});ag_T(ctx,"WHAT WE'VE CHECKED",x+28,y+50,{w:700,size:28,ls:4,col:AG.blue});
  ctx.fillStyle=rgba(AG.blue,0.25);ctx.fillRect(x+28,y+70,w-56,2);
  lines.forEach((l,i)=>{const u=clamp((o.row==null?1:o.row)*3-i,0,1);ag_T(ctx,l,x+28,y+112+i*40,{w:i===1?800:600,size:i===1?32:28,col:i===2?AG.green:AG.ink,a:u});});
  ctx.restore();return{x,y,w,h};}
function mc_signoff(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const h=176,sg=clamp(o.sign||0,0,1);
  ag_box(ctx,x,y,w,h,18,{edge:sg>0.95?AG.green:null,edgeA:0.8});
  ag_T(ctx,"drafted by the agent",x+28,y+48,{w:600,size:28,col:AG.violet});
  ctx.strokeStyle="rgba(60,50,40,0.25)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+28,y+112);ctx.lineTo(x+w-28,y+112);ctx.stroke();
  // the signature: a quick pen line, drawn as she signs
  if(sg>0){ctx.save();ctx.strokeStyle="rgba(40,44,60,0.9)";ctx.lineWidth=3.2;ctx.lineCap="round";ctx.lineJoin="round";ctx.setLineDash([sg*900,2000]);ctx.beginPath();
    const sx=x+40,sy=y+100;ctx.moveTo(sx,sy);ctx.bezierCurveTo(sx+10,sy-40,sx+30,sy-40,sx+26,sy);ctx.bezierCurveTo(sx+24,sy+10,sx+50,sy-26,sx+70,sy-6);ctx.bezierCurveTo(sx+84,sy+6,sx+96,sy-30,sx+120,sy-10);
    ctx.bezierCurveTo(sx+140,sy+6,sx+150,sy-24,sx+176,sy-8);ctx.bezierCurveTo(sx+200,sy+4,sx+220,sy-14,sx+260,sy-12);ctx.stroke();ctx.restore();}
  withA(ctx,ag_in(sg,0.8,0.2),()=>{ag_tick(ctx,x+44,y+146,24,rgba(AG.green,1),4);ag_T(ctx,"approved · Clara Jensen",x+72,y+156,{w:700,size:28,col:AG.green});});
  ctx.restore();return{x,y,w,h};}
function mc_screenSearch(ctx,x,y,w,h,o){o=o||{};const typed=clamp(o.typed||0,0,1),res=clamp(o.res||0,0,1),q="2025 retention review",n=Math.round(q.length*typed);
  ctx.fillStyle="#F6F5F2";ctx.fillRect(x,y,w,h);ag_T(ctx,"LIBRARY",x+24,y+44,{w:700,size:28,ls:4,col:AG.blue});
  ag_box(ctx,x+20,y+64,w-40,60,12,{edge:AG.blue,edgeA:0.5});ag_T(ctx,q.slice(0,n),x+40,y+104,{w:600,size:28});
  if(typed>0&&typed<1&&Math.sin(o.t*12)>0){ctx.fillStyle=rgba(AG.ink,0.8);ctx.fillRect(x+44+ag_tw(ctx,q.slice(0,n),{w:600,size:28}),y+80,3,30);}
  if(res>0)ag_T(ctx,"no results",x+24,y+176,{w:700,size:32,col:AG.amber,a:res});}

/* ---------------------------------------------------------------- the university's room, and what's in it
   The module's lab, its veins quieter where this film puts the agent (in the middle), the answers (under it) and the day (top right). */
AG_PLACES.mcLab=c=>ag_paintLab(c,{quiet:[[960,330,330,280,0.55],[480,90,420,46,0.3],[1700,92,250,44,0.4],[960,640,560,190,0.3],[1680,250,260,160,0.3]]});
// Clara's draft on the wall: "Planning · draft", its title, and a blank for where the two advisers go: dashed and empty, "which
// faculty?" in grey (o.hint), glowing while it's asked (o.glow); o.fill 0 to 1 writes the faculty in, with a green tick; o.a, o.k
const MC_DRAFT={w:400,h:276};
function mc_draft(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const {w,h}=MC_DRAFT,fl=clamp(o.fill||0,0,1),gl=clamp(o.glow||0,0,1);
  ctx.save();if(o.k!=null)ag_about(ctx,o.kx==null?x+w/2:o.kx,o.ky==null?y+h/2:o.ky,lerp(0.3,1,o.k));
  mc_paper(ctx,x,y,w,h,{a,kick:fl>0.5?"Planning":"Planning · draft",title:"Two new advisers",sub:"for first-year students",lines:0,draw(c){
    ag_T(c,"where they go:",28,174,{w:600,size:28,col:AG.mut});
    const bx=24,by=192,bw=w-48,bh=60;c.save();if(gl>0){c.shadowColor=rgba(AG.blue,0.5*gl);c.shadowBlur=18;}c.fillStyle=rgba(mix([246,245,242],[236,242,246],gl),1);rr(c,bx,by,bw,bh,10);c.fill();c.restore();
    c.save();c.setLineDash(fl>0.5?[]:[8,7]);c.strokeStyle=fl>0.5?rgba(AG.green,0.8):rgba(mix([60,50,40],AG.blue,gl),0.4+0.4*gl);c.lineWidth=2;rr(c,bx,by,bw,bh,10);c.stroke();c.restore();
    if(fl<0.5)ag_T(c,"which faculty?",bx+20,by+40,{w:600,size:28,col:AG.mut,a:(o.hint==null?1:o.hint)*(1-fl*2)});
    else{const u=(fl-0.5)*2;ag_T(c,"Engineering and IT",bx+20,by+41,{w:800,size:30,col:AG.ink,a:u});ag_tick(c,bx+bw-30,by+30,26,rgba(AG.green,u),4);}}});
  ctx.restore();}

/* ---------------------------------------------------------------- Bartlett's retellings (chapter 3)
   mc_strip: one line of a retelling, close: grey bars for the words we don't show, and one word we do ("canoe"), struck through in
   amber as it changes, the new word ("boat") written above it in a pen's ink. mc_list: the man's numbered list, years later, two
   lines in amber words. Neither shows the folk tale itself. */
function mc_strip(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const st=clamp(o.strike||0,0,1),nw=clamp(o.boat||0,0,1),h=200;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=22;ctx.shadowOffsetX=AG.sdx*0.8;ctx.shadowOffsetY=10;ctx.fillStyle="#FBF8F0";ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.lineWidth=1.2;ctx.strokeRect(x,y,w,h);
  // a ruled line, the words before as grey bars, "canoe", then more bars
  const by=y+138;ctx.fillStyle="rgba(60,56,52,0.16)";for(const [bx,bw] of [[40,120],[176,70],[262,150]])rr(ctx,x+bx,by-14,bw,14,7),ctx.fill();
  const cw=ag_tw(ctx,"canoe",{w:700,size:44}),cx=x+430;ag_T(ctx,"canoe",cx,by,{w:700,size:44,col:mix(AG.ink,AG.amber,st)});
  for(const [bx,bw] of [[cx-x+cw+24,96],[cx-x+cw+136,140]])if(bx+bw<w-30){ctx.fillStyle="rgba(60,56,52,0.16)";rr(ctx,x+bx,by-14,bw,14,7);ctx.fill();}
  if(st>0){ctx.strokeStyle=rgba(AG.amber,0.95);ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx-6,by-15);ctx.lineTo(cx-6+(cw+12)*ag_sine(st),by-15);ctx.stroke();}
  if(nw>0){ctx.save();ctx.beginPath();ctx.rect(cx-10,y,(cw+40)*ag_sine(nw),by-46-y+8);ctx.clip();ag_T(ctx,"boat",cx+8,by-58,{w:700,size:44,col:[40,52,92]});ctx.restore();
    ctx.strokeStyle="rgba(40,52,92,0.7)";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx+cw/2-14,by-48);ctx.lineTo(cx+cw/2,by-36);ctx.lineTo(cx+cw/2+14,by-48);ctx.stroke();}
  ctx.restore();}
function mc_list(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const n=clamp(o.n==null?1:o.n,0,1),hi=clamp(o.hi||0,0,1),h=470;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ctx.save();ctx.shadowColor="rgba(46,38,28,0.24)";ctx.shadowBlur=22;ctx.shadowOffsetX=AG.sdx*0.8;ctx.shadowOffsetY=10;ctx.fillStyle="#FBF8F0";ctx.fillRect(x,y,w,h);ctx.restore();
  ctx.strokeStyle="rgba(60,50,40,0.12)";ctx.lineWidth=1.2;ctx.strokeRect(x,y,w,h);
  const L=[null,null,"a totem",null,"a pilgrimage",null],B=[230,170,0,250,0,150];
  L.forEach((l,i)=>{const u=clamp(n*L.length-i,0,1);if(u<=0)return;const yy=y+70+i*66;ag_T(ctx,String(i+1),x+36,yy,{w:700,size:32,col:[40,52,92],a:u});
    if(l){if(hi>0){ctx.save();ctx.globalAlpha*=u*hi;ctx.fillStyle=rgba(AG.amber,0.16);rr(ctx,x+70,yy-36,ag_tw(ctx,l,{w:700,size:36})+28,50,12);ctx.fill();ctx.restore();}
      ag_T(ctx,l,x+84,yy,{w:700,size:36,col:mix([40,52,92],AG.amber,hi),a:u});}
    else{ctx.fillStyle="rgba(60,56,52,"+(0.16*u)+")";rr(ctx,x+84,yy-16,B[i]*u,14,7);ctx.fill();}});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- Loftus and Palmer's question (chapter 3)
   mc_qcard: the question one half of the room was asked, its verb picked out (o.col: ink for "hit", amber for "smashed"); o.glow
   lights the verb. mc_bar: the half's guess, a bar as long as the speed. */
function mc_qcard(ctx,x,y,w,lines,o){o=o||{};const a=o.a==null?1:o.a,h=44+lines.length*46+30;if(a<=0.005)return{x,y,w,h};ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  ag_box(ctx,x,y,w,h,20,{edge:o.edge||null,edgeA:0.8});
  lines.forEach((l,i)=>{const yy=y+68+i*46,m=l.match(/^(.*)\{(.+)\}(.*)$/);if(!m){ag_T(ctx,l,x+30,yy,{w:600,size:34});return;}
    let xx=x+30;ag_T(ctx,m[1],xx,yy,{w:600,size:34});xx+=ag_tw(ctx,m[1],{w:600,size:34});const vw=ag_tw(ctx,m[2],{w:800,size:34}),col=o.col||AG.ink;
    if(o.glow>0){ctx.save();ctx.globalAlpha*=o.glow;ctx.shadowColor=rgba(col,0.8);ctx.shadowBlur=24;ctx.fillStyle=rgba(col,0.18);rr(ctx,xx-8,yy-34,vw+16,46,10);ctx.fill();ctx.restore();}
    ag_T(ctx,m[2],xx,yy,{w:800,size:34,col});ctx.fillStyle=rgba(col,0.85);ctx.fillRect(xx,yy+7,vw,3);ag_T(ctx,m[3],xx+vw,yy,{w:600,size:34});});
  ctx.restore();return{x,y,w,h};}
function mc_bar(ctx,x,y,w,label,v,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const u=clamp(o.u==null?1:o.u,0,1),h=88,col=o.col||AG.ink;ctx.save();ctx.globalAlpha*=a;
  ag_box(ctx,x,y,w,h,18,{});ag_T(ctx,label,x+28,y+56,{w:700,size:30,col});const bx=x+28+ag_tw(ctx,label,{w:700,size:30})+22,bw=(w-(bx-x)-150)*v*ag_eo(u);
  ctx.fillStyle=rgba(col,0.35);rr(ctx,bx,y+34,Math.max(1,bw),22,11);ctx.fill();ag_T(ctx,Math.round(lerp(0,o.mph,ag_eo(u)))+" mph",x+w-28,y+56,{w:800,size:30,align:"right",col});
  ctx.restore();}

// a year's record, as a card: o.kickA and o.titleA fade each part, so two cards laid on one another show one's year and the other's
// faculty (a memory joining two years); o.edge, o.a, o.k
function mc_yearCard(ctx,x,y,w,kick,title,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.005)return;const h=136;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,o.k));
  if(o.box!==false)ag_box(ctx,x,y,w,h,20,{edge:o.edge||AG.blue,edgeA:o.edgeA==null?0.7:o.edgeA});
  ag_T(ctx,kick.toUpperCase(),x+30,y+50,{w:700,size:28,ls:4,col:o.kickCol||AG.blue,a:o.kickA==null?1:o.kickA});
  ag_T(ctx,title,x+30,y+102,{w:800,size:38,col:o.titleCol||AG.ink,a:o.titleA==null?1:o.titleA});ctx.restore();return{x,y,w,h};}
