/* ===== Many agents, and what emerges: much from little (termites, ants, starlings) and the brain =====
   The same matte style as places.js. The places: maMoundIn (inside a mound, where termites build), maAnts (two bridges to food,
   in a laboratory, 1989), maRome (the sky over Rome at dusk) and maNeurons (a field of neurons). What moves is drawn live:
     ma_along(P, u)                  the point and heading at u (0..1) along a path
     ma_termite(ctx, x, y, ang, s, o) a worker termite, o.t for its legs, o.carry a pellet of mud
     ma_pillars(ctx, u, t)           the two pillars rising, pellet on pellet, then leaning in to an arch (u 0..1); ma_builders
                                     the termites at work on them
     ma_ant(ctx, x, y, ang, s, t)    an ant from above; ma_antsLive(ctx, t, share, scent) the ants on the bridges
     ma_flock(ctx, t, o)             a murmuration of starlings; o.mark rings one bird and its seven nearest neighbours
     ma_signals(ctx, t, a)           signals running along the neurons' fibres */

/* ---------------------------------------------------------------- moving along a path */
function ma_along(P,u){let tot=0;const L=[0];for(let i=1;i<P.length;i++){tot+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);L.push(tot);}
  const d=clamp(u,0,1)*tot;for(let i=1;i<P.length;i++)if(d<=L[i]){const k=(d-L[i-1])/((L[i]-L[i-1])||1),a=P[i-1],b=P[i];return [lerp(a[0],b[0],k),lerp(a[1],b[1],k),Math.atan2(b[1]-a[1],b[0]-a[0]),tot];}
  const a=P[P.length-2],b=P[P.length-1];return [b[0],b[1],Math.atan2(b[1]-a[1],b[0]-a[0]),tot];}

/* ---------------------------------------------------------------- inside the mound: a chamber of earth, where workers build */
const MA_IN={floor:840,pil:[[640,0],[1290,1]]};
AG_PLACES.maMoundIn=c=>{const F=MA_IN.floor;let g=c.createRadialGradient(1500,180,60,1100,420,1300);g.addColorStop(0,rgba([196,150,110],1));g.addColorStop(0.45,rgba([150,108,80],1));g.addColorStop(1,rgba([92,64,48],1));
  c.fillStyle=g;c.fillRect(0,0,W,H);ma_overlayTex(c,0,0,W,H,0.55);
  // the chamber's far wall: older pillars and arches, built long ago, softer in the dim
  const R=ag_rnd(7);for(const [x,w,h] of [[180,70,560],[360,60,500],[1560,80,600],[1780,64,520]]){c.fillStyle=rgba([122,86,64],0.75);c.beginPath();c.moveTo(x-w/2,F-20);
    c.bezierCurveTo(x-w*0.44,F-h*0.5,x-w*0.3,F-h*0.9,x-w*0.1,F-h);c.lineTo(x+w*0.12,F-h);c.bezierCurveTo(x+w*0.32,F-h*0.9,x+w*0.44,F-h*0.5,x+w/2,F-20);c.closePath();c.fill();}
  c.strokeStyle=rgba([122,86,64],0.75);c.lineWidth=60;c.lineCap="round";c.beginPath();c.moveTo(180,F-560);c.quadraticCurveTo(270,F-680,360,F-500);c.stroke();
  c.beginPath();c.moveTo(1560,F-600);c.quadraticCurveTo(1670,F-720,1780,F-520);c.stroke();
  // pores and tunnels in the wall: dark mouths, lit on their lower lip
  for(let i=0;i<7;i++){const x=R()*W,y=120+R()*520,r=10+R()*18;if(Math.abs(x-960)<300)continue;c.fillStyle="rgba(50,34,26,0.55)";c.beginPath();c.ellipse(x,y,r*1.3,r,0,0,TAU);c.fill();c.fillStyle="rgba(230,190,150,0.18)";c.beginPath();c.ellipse(x,y+r*0.7,r*1.1,r*0.35,0,0,Math.PI);c.fill();}
  // the floor: packed earth, catching the light, with pellets dropped here and there
  g=c.createLinearGradient(0,F-30,0,H);g.addColorStop(0,rgba([168,124,92],1));g.addColorStop(0.25,rgba([150,110,82],1));g.addColorStop(1,rgba([110,78,58],1));c.fillStyle=g;
  c.beginPath();c.moveTo(0,F-10);for(let x=0;x<=W;x+=40)c.lineTo(x,F-10+Math.sin(x*0.01)*6+AG_NZ.n2(x*0.02,1)*10);c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill();
  ma_overlayTex(c,0,F-20,W,H-F+20,0.4);for(let i=0;i<40;i++){const x=R()*W,y=F+20+R()*(H-F-30),r=6+R()*6;ag_floorShadow(c,x-3,y+r*0.6,r*1.4,r*0.5,0.3);c.fillStyle=rgba(mix([118,86,62],[150,112,84],R()),1);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
    c.fillStyle="rgba(255,236,210,0.2)";c.beginPath();c.arc(x+r*0.3,y-r*0.3,r*0.45,0,TAU);c.fill();}
  // a soft light from a vent, up to the right
  g=c.createRadialGradient(1560,120,10,1560,120,700);g.addColorStop(0,"rgba(255,236,206,0.32)");g.addColorStop(1,"rgba(255,236,206,0)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(960,540,500,960,540,1200);g.addColorStop(0,"rgba(40,26,18,0)");g.addColorStop(1,"rgba(40,26,18,0.35)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// a pellet of mud, lit from the right
function ma_pellet(ctx,x,y,r,col){ctx.fillStyle=rgba(col||[132,96,70],1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,232,204,0.22)";ctx.beginPath();ctx.arc(x+r*0.3,y-r*0.32,r*0.5,0,TAU);ctx.fill();
  ctx.fillStyle="rgba(40,26,18,0.18)";ctx.beginPath();ctx.arc(x-r*0.25,y+r*0.3,r*0.6,0,TAU);ctx.fill();}
/* the pillars, live: u 0..0.62 they rise, row on row of pellets; then their tops lean in and meet in a round arch (u 1). Each is a
   thick column of mud, three pellets across at the foot, two at the top; the newest pellets are darker, still wet. ma_pillarLine(u)
   gives each pillar's centre line from the floor up, and its tops */
const MA_PIL={x:[760,1160],h:500,r:200};
function ma_pillarLine(u){const F=MA_IN.floor,rise=clamp(u/0.62,0,1),lean=sstep(0.62,1,u),out=[];
  for(let s=0;s<2;s++){const x0=MA_PIL.x[s],dir=s?-1:1,hgt=40+rise*(MA_PIL.h-40),pts=[];for(let y=0;y<=hgt;y+=17)pts.push([x0+Math.sin(y*0.05+s*2)*3,F-12-y]);
    if(lean>0){const top=F-12-MA_PIL.h,cx=960,th=lean*Math.PI/2;for(let a=0.08;a<=th;a+=0.085)pts.push([cx-dir*MA_PIL.r*Math.cos(a),top-MA_PIL.r*Math.sin(a)]);}out.push(pts);}
  return out;}
function ma_pillars(ctx,u,t,scent){const P=ma_pillarLine(u),tops=P.map(p=>p[p.length-1]);
  if(scent>0)for(const p of tops){const r=170+Math.sin(t*1.7+p[0])*12,g=ctx.createRadialGradient(p[0],p[1],4,p[0],p[1],r);g.addColorStop(0,rgba(MA_GOLD,0.4*scent));g.addColorStop(1,rgba(MA_GOLD,0));ctx.fillStyle=g;ctx.fillRect(p[0]-r,p[1]-r,r*2,r*2);}
  P.forEach((pts,s)=>{ag_floorShadow(ctx,pts[0][0]-40,MA_IN.floor-4,90,14,0.4);const n=pts.length;
    for(let i=0;i<n;i++){const p=pts[i],q=pts[Math.min(n-1,i+1)],o=pts[Math.max(0,i-1)],dx=q[0]-o[0],dy=q[1]-o[1],d=Math.hypot(dx,dy)||1,nx=-dy/d,ny=dx/d,k=i/(n-1||1),wide=lerp(96,62,Math.min(1,i/30)),
      m=wide>80?3:2,fresh=n-i<=3,wet=fresh?1-ag_in((t*0.6+i*0.37)%1,0,0.5)*0:0;
      for(let j=0;j<m;j++){const off=(j-(m-1)/2)*wide/m,jit=((i*7+j*13)%5-2)*1.2,col=fresh?[110,78,56]:mix([132,96,70],[150,112,84],((i*5+j*3)%7)/7);
        ma_pellet(ctx,p[0]+nx*(off+jit),p[1]+ny*(off+jit),wide/m*0.62+((i+j)%3),col);}}});
  return tops;}
/* a worker termite seen from the side, heading ang (0: right); s 1 is about 70 px long. Pale body, tan head, six legs that step */
function ma_termite(ctx,x,y,ang,s,o){o=o||{};const t=o.t||0,ph=o.ph||0;ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);
  const st=Math.sin(t*14+ph);ctx.strokeStyle=rgba([196,176,150],1);ctx.lineWidth=2.4;ctx.lineCap="round";
  for(let i=0;i<3;i++){const lx=-6+i*9,sw=(i%2?st:-st)*5;ctx.beginPath();ctx.moveTo(lx,2);ctx.lineTo(lx-4+sw,10);ctx.lineTo(lx-8+sw*1.4,16);ctx.stroke();}
  ctx.fillStyle=rgba([234,222,202],1);ctx.beginPath();ctx.ellipse(-24,0,22,12.5,0.04,0,TAU);ctx.fill();   // the abdomen
  ctx.strokeStyle="rgba(150,126,100,0.35)";ctx.lineWidth=1.4;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-36+i*8,-10);ctx.quadraticCurveTo(-34+i*8,0,-36+i*8,10);ctx.stroke();}
  ctx.fillStyle="rgba(255,250,240,0.35)";ctx.beginPath();ctx.ellipse(-20,-5,12,4,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba([222,206,182],1);for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(-2+i*6,0,5,7,0,0,TAU);ctx.fill();}
  ctx.fillStyle=rgba([174,136,98],1);ctx.beginPath();ctx.ellipse(20,-1,10,8.5,0,0,TAU);ctx.fill();ctx.fillStyle="rgba(255,240,220,0.3)";ctx.beginPath();ctx.ellipse(22,-4,5,3,0,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba([92,64,44],1);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(28,2);ctx.quadraticCurveTo(34,4,32,8);ctx.stroke();
  ctx.strokeStyle=rgba([170,140,108],1);ctx.lineWidth=1.6;const aw=Math.sin(t*6+ph)*3;ctx.beginPath();ctx.moveTo(24,-6);ctx.quadraticCurveTo(32,-16+aw,42,-14+aw);ctx.moveTo(22,-7);ctx.quadraticCurveTo(28,-20-aw,36,-22-aw);ctx.stroke();
  if(o.carry)ma_pellet(ctx,36,6,8);ctx.restore();}
/* the builders, live: workers walk in along the floor carrying pellets, climb a pillar's face, leave their pellet at the top and
   climb back down. a 0..1 how many are about */
function ma_builders(ctx,t,u,a){if(a<=0)return;const F=MA_IN.floor,P=ma_pillarLine(u);ctx.save();ctx.globalAlpha*=a;
  for(let i=0;i<10;i++){const s=i%2,pts=P[s],dir=s?1:-1,period=8+(i%3)*1.3,ph=(t/period+i*0.173)%1,x0=pts[0][0];
    const climb=pts.filter((p,k)=>k%3===0).map(p=>[p[0]+dir*6,p[1]]);const path=[[x0+dir*(1180+i*36),F+26+(i%4)*12],[x0+dir*70,F+8]].concat(climb);
    const up=ph<0.66,k=up?ph/0.66:1-(ph-0.66)/0.34,q=ma_along(path,ag_sine(k));ma_termite(ctx,q[0],q[1]-(q[1]>F-10?12:0),q[2]+(up?0:Math.PI),1.25,{t,ph:i,carry:up});}
  ctx.restore();}

/* ---------------------------------------------------------------- a laboratory, 1989: a nest, two bridges to food, seen from above */
const MA_ANT={nest:[290,560,170],food:[1650,560,130],fork:[560,560],join:[1380,560],short:[[560,560],[1380,560]],
  long:[[560,560],[650,186],[1290,186],[1380,560]]};
AG_PLACES.maAnts=c=>{const A=MA_ANT;let g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,rgba([226,224,218],1));g.addColorStop(1,rgba([236,234,228],1));c.fillStyle=g;c.fillRect(0,0,W,H);ma_grain(c,0,0,W,H,1.6,44);
  // the bridges: pale card, a little raised, with their soft shadow to the left
  const bridge=(P,w)=>{const S=ma_smooth(P,10);c.lineCap="round";c.lineJoin="round";c.beginPath();c.moveTo(S[0][0],S[0][1]);for(const p of S)c.lineTo(p[0],p[1]);c.lineWidth=w;c.stroke();};
  c.save();c.strokeStyle="rgba(60,50,40,0.16)";c.translate(-10,10);bridge([[A.nest[0]+150,A.nest[1]],A.fork],58);bridge(A.short,58);bridge(A.long,58);bridge([A.join,[A.food[0]-110,A.food[1]]],58);c.restore();
  c.strokeStyle=rgba([214,208,198],1);bridge([[A.nest[0]+150,A.nest[1]],A.fork],50);bridge(A.short,50);bridge(A.long,50);bridge([A.join,[A.food[0]-110,A.food[1]]],50);
  c.strokeStyle="rgba(255,255,255,0.35)";c.save();c.translate(3,-4);bridge(A.short,10);bridge(A.long,10);c.restore();
  // the nest: a round arena of soil; the food: a dish with a drop of sugar water
  const dish=(x,y,r,fill)=>{ma_shadowOf(c,k=>k.arc(x,y,r,0,TAU),"rgba(60,50,40,0.3)",24,-10,12);c.fillStyle=rgba([226,230,232],1);c.beginPath();c.arc(x,y,r,0,TAU);c.fill();
    c.fillStyle=rgba(fill,1);c.beginPath();c.arc(x,y,r-14,0,TAU);c.fill();c.strokeStyle="rgba(255,255,255,0.6)";c.lineWidth=3;c.beginPath();c.arc(x,y,r-4,-1.2,0.2);c.stroke();};
  dish(A.nest[0],A.nest[1],A.nest[2],[150,118,92]);ma_overlayTex(c,A.nest[0]-156,A.nest[1]-156,312,312,0.5);
  c.save();c.beginPath();c.arc(A.nest[0],A.nest[1],156,0,TAU);c.clip();const R=ag_rnd(3);for(let i=0;i<30;i++){const x=A.nest[0]+(R()-0.5)*280,y=A.nest[1]+(R()-0.5)*280;c.fillStyle=rgba([120,92,70],0.6);c.beginPath();c.arc(x,y,3+R()*5,0,TAU);c.fill();}
  c.fillStyle="rgba(60,40,28,0.7)";c.beginPath();c.ellipse(A.nest[0]+20,A.nest[1]+10,26,18,0,0,TAU);c.fill();c.restore();
  dish(A.food[0],A.food[1],A.food[2],[238,236,230]);g=c.createRadialGradient(A.food[0]+8,A.food[1]-8,4,A.food[0],A.food[1],60);g.addColorStop(0,"rgba(255,255,255,0.9)");g.addColorStop(0.5,"rgba(236,228,206,0.7)");g.addColorStop(1,"rgba(220,210,186,0.6)");
  c.fillStyle=g;c.beginPath();c.ellipse(A.food[0],A.food[1],62,52,0,0,TAU);c.fill();
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,34,28,0.08)");g.addColorStop(1,"rgba(255,248,236,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);};
/* an ant from above, heading ang; s 1 is about 34 px long; legs step with t */
function ma_ant(ctx,x,y,ang,s,t,ph){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);const st=Math.sin(t*16+(ph||0))*3;ctx.strokeStyle="rgba(58,42,34,0.9)";ctx.lineWidth=1.6;ctx.lineCap="round";
  for(let i=-1;i<=1;i++)for(const sd of [-1,1]){const sw=(i===0?-st:st)*sd;ctx.beginPath();ctx.moveTo(i*4,0);ctx.lineTo(i*5+sw,sd*8);ctx.lineTo(i*7+sw,sd*13);ctx.stroke();}
  ctx.fillStyle="rgba(62,44,36,1)";ctx.beginPath();ctx.ellipse(-10,0,8,5.5,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(0,0,5,3,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(9,0,4.5,4,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(12,-2);ctx.quadraticCurveTo(17,-6,20,-5);ctx.moveTo(12,2);ctx.quadraticCurveTo(17,6,20,5);ctx.stroke();ctx.fillStyle="rgba(255,240,220,0.3)";ctx.beginPath();ctx.ellipse(-8,-2,3.5,1.6,0,0,TAU);ctx.fill();ctx.restore();}
/* the ants, live: going out to the food and back, on both bridges at first, then most on the shorter (share: 0.5 even, 0.9 most on
   the short one); scent [short, long] 0..1: the faint gold trail each bridge has built up */
function ma_antsLive(ctx,t,share,scent){const A=MA_ANT,stem=[[A.nest[0]+120,A.nest[1]],A.fork],tail=[A.join,[A.food[0]-96,A.food[1]]];
  if(scent){[[A.short,scent[0]],[A.long,scent[1]]].forEach(([P,k])=>{if(k<=0)return;const S=ma_smooth(P,10);ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(S[0][0],S[0][1]);for(const p of S)ctx.lineTo(p[0],p[1]);
    ctx.strokeStyle=rgba(MA_GOLD,0.35*k);ctx.lineWidth=34;ctx.stroke();ctx.strokeStyle=rgba(MA_GOLD,0.4*k);ctx.lineWidth=12;ctx.stroke();ctx.restore();});}
  const R=ag_rnd(9);for(let i=0;i<44;i++){const r1=((i*0.618)%1),r2=i/44+R()*0.01,r3=i%2?0.7:0.2,onShort=r1<share,P=onShort?A.short:A.long,route=stem.concat(P.slice(1),tail.slice(1));
    const period=onShort?9:13,ph=(t/period+r2)%1,back=r3<0.5,u=back?1-ph:ph,p=ma_along(route,u),off=(R()-0.5)*18,nx=-Math.sin(p[2]),ny=Math.cos(p[2]);
    ma_ant(ctx,p[0]+nx*off,p[1]+ny*off,p[2]+(back?Math.PI:0),1,t,i);}}

/* ---------------------------------------------------------------- the sky over Rome at dusk: domes, towers and stone pines */
AG_PLACES.maRome=c=>{ma_sky(c,[128,146,172],[240,206,170],H,[1500,820,900,0.45],[[202,184,186],0.55]);
  for(const cl of [[400,300,360,22,2],[1300,220,420,26,8]])ma_blob(c,cl[0],cl[1],cl[2],cl[3],cl[4],0.5,"rgba(246,226,214,0.35)");
  const HZ=900,far=[150,140,160],near=[112,104,118];
  // far: low roofs and a dome in the haze
  c.fillStyle=rgba(far,1);c.beginPath();c.moveTo(0,H);c.lineTo(0,HZ-30);for(let x=0;x<=W;x+=60)c.lineTo(x,HZ-30-((x*7)%5)*8-(x%180<60?14:0));c.lineTo(W,H);c.closePath();c.fill();
  c.beginPath();c.ellipse(1460,HZ-60,90,74,0,Math.PI,TAU);c.fill();c.fillRect(1440,HZ-160,40,30);c.beginPath();c.moveTo(1452,HZ-160);c.lineTo(1460,HZ-196);c.lineTo(1468,HZ-160);c.fill();
  // near: rooftops, a dome with its drum and lantern, bell towers with small pyramid roofs, and the umbrella crowns of stone pines
  c.fillStyle=rgba(near,1);c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=40)c.lineTo(x,HZ+10-((x*13)%7)*6-(x%240<80?20:0));c.lineTo(W,H);c.closePath();c.fill();
  c.fillRect(470,HZ-110,180,120);c.beginPath();c.ellipse(560,HZ-110,110,100,0,Math.PI,TAU);c.fill();c.fillRect(538,HZ-236,44,32);c.beginPath();c.moveTo(534,HZ-236);c.lineTo(560,HZ-268);c.lineTo(586,HZ-236);c.fill();
  c.fillStyle="rgba(150,140,156,0.6)";for(let k=0;k<7;k++){c.beginPath();c.ellipse(490+k*23,HZ-104,6,12,0,Math.PI,TAU);c.fill();}c.fillStyle=rgba(near,1);
  for(const [x,h] of [[300,250],[1160,214]]){c.fillRect(x,HZ-h,48,h);c.beginPath();c.moveTo(x-5,HZ-h);c.lineTo(x+24,HZ-h-34);c.lineTo(x+53,HZ-h);c.fill();
    c.fillStyle="rgba(232,196,160,0.35)";for(const yy of [HZ-h+20,HZ-h+70]){c.beginPath();c.moveTo(x+12,yy+26);c.lineTo(x+12,yy+8);c.quadraticCurveTo(x+24,yy-4,x+36,yy+8);c.lineTo(x+36,yy+26);c.fill();}c.fillStyle=rgba(near,1);}
  for(const [x,y,s] of [[110,HZ-40,1],[820,HZ-30,1.2],[990,HZ-14,0.9],[1720,HZ-30,1.1],[1880,HZ-20,0.8]]){c.strokeStyle=rgba(near,1);c.lineWidth=7*s;c.beginPath();c.moveTo(x,y+70);c.quadraticCurveTo(x+6*s,y+20,x,y-16*s);c.stroke();
    ma_blob(c,x,y-26*s,104*s,26*s,x*0.01,0.28,rgba(near,1));ma_blob(c,x+10*s,y-34*s,74*s,16*s,x*0.02,0.3,rgba(ma_shade(near,1.06),1));}
  const RW=ag_rnd(55);for(let i=0;i<26;i++){const x=RW()*W,y=HZ+30+RW()*120;c.fillStyle="rgba(250,214,160,"+(0.3+RW()*0.4).toFixed(2)+")";c.fillRect(x,y,5,7);}
  const g=c.createLinearGradient(0,HZ-260,0,H);g.addColorStop(0,"rgba(240,206,170,0)");g.addColorStop(1,"rgba(80,74,92,0.25)");c.fillStyle=g;c.fillRect(0,HZ-260,W,H-HZ+260);};
/* the murmuration, live: thousands of starlings in one soft body that stretches, turns and folds; nobody leads it. o.n how many,
   o.cx, o.cy where it is, o.mark 0..1 rings one bird and draws lines to its seven nearest neighbours, o.a */
const MA_FLOCK=(()=>{const R=ag_rnd(2006),n=2600,P=[];for(let i=0;i<n;i++){const a=R()*TAU,r=Math.sqrt(R());P.push([Math.cos(a)*r,Math.sin(a)*r*0.6,R()*TAU]);}
  P[0]=[0.04,0.02,0];const d=P.map((p,i)=>[Math.hypot(p[0]-P[0][0],p[1]-P[0][1]),i]).sort((a,b)=>a[0]-b[0]).slice(1,8).map(x=>x[1]);return {P,near:d};})();
function ma_flockPos(p,t,o){const cx=o.cx||960,cy=o.cy||420,sc=o.scale||1,turn=Math.sin(t*0.23)*0.9+t*0.05,sx=430*sc*(1+0.25*Math.sin(t*0.31)),sy=190*sc*(1+0.35*Math.sin(t*0.43+1)),
  fold=0.55*Math.sin(t*0.37+0.6),u=p[0],v=p[1]+fold*u*u-0.18*Math.sin(t*0.5+u*2.4),ca=Math.cos(turn),sa=Math.sin(turn),x=u*sx,y=v*sy;
  return [cx+x*ca-y*sa*0.6+Math.sin(t*0.9+p[2])*3,cy+x*sa*0.4+y*ca+Math.cos(t*1.1+p[2])*3];}
function ma_flock(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;const F=MA_FLOCK,n=Math.min(F.P.length,o.n||F.P.length);ctx.save();ctx.globalAlpha*=a;ctx.fillStyle="rgba(46,42,50,0.85)";
  // waves of darkness pass through the flock as birds bank together: each bird's shade follows a slow wave across it
  const B=[[],[],[],[],[]];for(let i=1;i<n;i++){const p=F.P[i],w=0.5+0.5*Math.sin(p[0]*6.5+p[1]*3.4-t*2.2)*Math.sin(p[0]*2.1-p[1]*5+t*0.9+1);B[Math.min(4,Math.floor(w*5))].push(i);}
  B.forEach((L,k)=>{ctx.fillStyle="rgba(46,42,50,"+(0.42+k*0.13).toFixed(2)+")";ctx.beginPath();for(const i of L){const q=ma_flockPos(F.P[i],t,o),fl=(Math.sin(t*18+F.P[i][2]*7)>0)?1:0.6,s=0.85+k*0.1;ctx.rect(q[0]-1.7*s,q[1]-1.1*fl*s,3.4*s,2.2*fl*s);}ctx.fill();});
  const m=o.mark||0,b=ma_flockPos(F.P[0],t,o);if(m>0){ctx.strokeStyle="rgba(250,246,238,"+(0.85*m)+")";ctx.lineWidth=2;for(const j of F.near){const q=ma_flockPos(F.P[j],t,o);ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();
    ctx.fillStyle="rgba(250,246,238,"+m+")";ctx.beginPath();ctx.arc(q[0],q[1],4,0,TAU);ctx.fill();}
    ctx.strokeStyle="rgba(250,246,238,"+m+")";ctx.lineWidth=3;ctx.beginPath();ctx.arc(b[0],b[1],14,0,TAU);ctx.stroke();}
  ctx.fillStyle="rgba(46,42,50,0.95)";ctx.fillRect(b[0]-2,b[1]-1.5,4.4,3);ctx.restore();return b;}

/* the lens, live: one bird of the flock, magnified in a round lens at (lx, ly), with the birds around it and lines to its seven
   nearest neighbours; a fine line runs from the lens to the bird in the flock. a 0..1 */
function ma_flockLens(ctx,t,o,a){if(a<=0)return;const F=MA_FLOCK,b=ma_flockPos(F.P[0],t,o),lx=o.lx||1500,ly=o.ly||330,R=o.lr||190,far=ma_flockPos(F.P[F.near[6]],t,o),
  k=R*0.62/Math.max(6,Math.hypot(far[0]-b[0],far[1]-b[1])),pop=ag_spr(a,0,0.6);ctx.save();ctx.globalAlpha*=clamp(a*1.4,0,1);
  ctx.strokeStyle="rgba(250,246,238,0.8)";ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(lx-(lx-b[0])*R/Math.hypot(lx-b[0],ly-b[1]),ly-(ly-b[1])*R/Math.hypot(lx-b[0],ly-b[1]));ctx.stroke();ctx.setLineDash([]);
  ctx.translate(lx,ly);ctx.scale(pop,pop);ctx.save();ctx.shadowColor="rgba(40,32,40,0.3)";ctx.shadowBlur=24;ctx.shadowOffsetX=AG.sdx;ctx.shadowOffsetY=8;ctx.fillStyle="rgba(236,226,222,0.97)";ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(250,248,244,1)";ctx.lineWidth=6;ctx.beginPath();ctx.arc(0,0,R,0,TAU);ctx.stroke();ctx.save();ctx.beginPath();ctx.arc(0,0,R-3,0,TAU);ctx.clip();
  const bird=(x,y,ang,dark)=>{ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.fillStyle=dark?"rgba(40,36,44,1)":"rgba(80,74,86,0.55)";ctx.beginPath();ctx.ellipse(0,0,8,3.4,0,0,TAU);ctx.fill();
    ctx.beginPath();ctx.moveTo(-1,0);ctx.lineTo(-6,-10);ctx.lineTo(3,-1);ctx.moveTo(-1,0);ctx.lineTo(-6,10);ctx.lineTo(3,1);ctx.fill();ctx.restore();};
  const head=Math.atan2(ma_flockPos(F.P[0],t+0.1,o)[1]-b[1],ma_flockPos(F.P[0],t+0.1,o)[0]-b[0]);
  for(let i=1;i<F.P.length;i++){const q=ma_flockPos(F.P[i],t,o),x=(q[0]-b[0])*k,y=(q[1]-b[1])*k;if(x*x+y*y>R*R||F.near.includes(i))continue;bird(x,y,head,false);}
  const m=sstep(0.3,1,a);for(const j of F.near){const q=ma_flockPos(F.P[j],t,o),x=(q[0]-b[0])*k,y=(q[1]-b[1])*k;ctx.strokeStyle="rgba(60,56,68,"+(0.7*m)+")";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(x,y);ctx.stroke();bird(x,y,head,true);}
  ctx.strokeStyle="rgba(60,56,68,0.9)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,20,0,TAU);ctx.stroke();bird(0,0,head,true);ctx.restore();ctx.restore();}

/* ---------------------------------------------------------------- neurons: a field of nerve cells, pale on a deep slate, their
   fibres running between them */
const MA_NEU=(()=>{const R=ag_rnd(86),N=[];for(let r=0;r<4;r++)for(let k=0;k<5;k++)N.push([200+k*380+(r%2)*150+(R()-0.5)*160,150+r*250+(R()-0.5)*90,20+R()*10,R()*TAU]);const L=[];
  N.forEach((p,i)=>{const d=N.map((q,j)=>[Math.hypot(q[0]-p[0],q[1]-p[1]),j]).filter(x=>x[1]!==i).sort((a,b)=>a[0]-b[0]);for(let k=0;k<2;k++){const j=d[k][1];if(!L.some(l=>(l[0]===j&&l[1]===i)))L.push([i,j,R()]);}});
  return {N,L};})();
function ma_fibre(i,j,bend){const p=MA_NEU.N[i],q=MA_NEU.N[j],mx=(p[0]+q[0])/2+(q[1]-p[1])*0.25*(bend-0.5),my=(p[1]+q[1])/2-(q[0]-p[0])*0.25*(bend-0.5);return ma_smooth([[p[0],p[1]],[mx,my],[q[0],q[1]]],14);}
AG_PLACES.maNeurons=c=>{let g=c.createRadialGradient(1100,420,100,960,540,1200);g.addColorStop(0,rgba([92,100,118],1));g.addColorStop(1,rgba([52,58,74],1));c.fillStyle=g;c.fillRect(0,0,W,H);ma_grain(c,0,0,W,H,2,61);
  const R=ag_rnd(5);
  // depth: fainter cells far behind
  for(let i=0;i<60;i++){const x=R()*W,y=R()*H,r=6+R()*10;c.fillStyle="rgba(170,184,204,0.08)";c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.strokeStyle="rgba(170,184,204,0.06)";c.lineWidth=2;
    c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+(R()-0.5)*160,y+(R()-0.5)*160,x+(R()-0.5)*260,y+(R()-0.5)*260);c.stroke();}
  // the fibres between cells, then each cell's branches, tapering, then the cell bodies, lit from the right
  c.lineCap="round";for(const [i,j,b] of MA_NEU.L){const S=ma_fibre(i,j,b);c.strokeStyle="rgba(196,206,222,0.32)";c.lineWidth=3.2;c.beginPath();c.moveTo(S[0][0],S[0][1]);for(const p of S)c.lineTo(p[0],p[1]);c.stroke();}
  for(const [x,y,r,a0] of MA_NEU.N){for(let k=0;k<6;k++){let a=a0+k*TAU/6+(R()-0.5)*0.6;const l=r*2.6+R()*r*2.4;let px=x,py=y,w=r*0.42;for(let s=0;s<6;s++){a+=(R()-0.5)*0.35;const nx=px+Math.cos(a)*l/6,ny=py+Math.sin(a)*l/6;
      c.strokeStyle="rgba(204,214,230,0.55)";c.lineWidth=w;c.beginPath();c.moveTo(px,py);c.lineTo(nx,ny);c.stroke();if(s===2){const b=a+(R()<0.5?0.7:-0.7);c.lineWidth=w*0.55;c.beginPath();c.moveTo(nx,ny);c.quadraticCurveTo(nx+Math.cos(b)*l/8,ny+Math.sin(b)*l/8,nx+Math.cos(b+0.2)*l/4,ny+Math.sin(b+0.2)*l/4);c.stroke();}px=nx;py=ny;w*=0.74;}}
    ag_soft(c,k=>{const B=ma_blobPts(x,y,r,r*0.86,a0,0.22,30);k.moveTo(B[0][0],B[0][1]);for(const p of B)k.lineTo(p[0],p[1]);k.closePath();},[196,206,222],[236,240,246],x+r*0.4,y-r*0.4,r*1.2,"rgba(30,36,52,0.35)",8,0.8);
    c.fillStyle="rgba(120,130,150,0.55)";c.beginPath();c.arc(x-r*0.1,y+r*0.05,r*0.32,0,TAU);c.fill();}
  g=c.createRadialGradient(960,540,520,960,540,1150);g.addColorStop(0,"rgba(20,24,36,0)");g.addColorStop(1,"rgba(20,24,36,0.4)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// signals, live: small bright pulses running along the fibres, each cell glowing a moment as one arrives
function ma_signals(ctx,t,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;MA_NEU.L.forEach(([i,j,b],k)=>{const S=ma_fibre(i,j,b),per=2.2+(k%5)*0.5,ph=((t+k*0.61)/per)%1,dirF=k%2===0;
  const idx=Math.floor((dirF?ph:1-ph)*(S.length-1)),p=S[idx];const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],20);g.addColorStop(0,"rgba(255,250,236,0.95)");g.addColorStop(1,"rgba(255,250,236,0)");
  ctx.fillStyle=g;ctx.fillRect(p[0]-20,p[1]-20,40,40);if(ph>0.9){const q=MA_NEU.N[dirF?j:i],gl=(ph-0.9)/0.1;const h=ctx.createRadialGradient(q[0],q[1],0,q[0],q[1],q[2]*2.4);h.addColorStop(0,"rgba(255,250,236,"+(0.5*(1-gl))+")");h.addColorStop(1,"rgba(255,250,236,0)");
    ctx.fillStyle=h;ctx.fillRect(q[0]-q[2]*2.4,q[1]-q[2]*2.4,q[2]*4.8,q[2]*4.8);}});ctx.restore();}
