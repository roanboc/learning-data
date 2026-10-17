/* ===== Rules with a home: the film's own pictures (prefixed d9_) =====
   Tartu, today, at dawn: the Emajõgi narrowing to its arch bridge, Kaarsild, with the old town behind it and one window lit; the
   population register, and the offices that ask it over X-Road instead of keeping copies; a parent's phone with the Social
   Insurance Board's offer; the catalogue that lists every database with its owner. At the utility, on the wall and on the films'
   dark glass: day one's data rule and the bill of $412.80; the household away in June and its meter's stored readings; the nightly
   script on the wall between the network and retail, writing to a queue nothing reads; the rule in five places; the rule split in
   two, one on each side, joined by what crosses; where each comes from; what it's about; the step it's attached to and what that
   step expects of the data; the rule in a set form, with the checks generated from it; and the concepts, relationships and rules,
   generally an ontology.
   Tartu is drawn in the series' own style, not in the style of Estonian art (PLAYBOOK §2): the places are real, the family is
   illustrative, and the offices' marks are not drawn. */

const MOT=LAY6[0][1],STR=LAY6[1][1],BUS=LAY6[2][1],INF=LAY6[3][1],APL=LAY6[4][1];
// the two sides of the wall, as in Who does it: the network in blue, retail in rose; red, for what fails; green, for a job that ran
const D9_NET=[132,176,255],D9_RET=[255,150,186],D9_RED=[232,96,84],D9_OK=[120,210,130];
// Tartu: the register's glass, pale as frost, and the dawn
const D9_TAR=[196,222,255],D9_DAWN=[255,196,140];
// someone standing at the right of the frame, drawn facing the other way: the "explain" gesture then points at what they explain
function d9_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}
// no-break spaces: words a note should keep on one line
const d9_nb=s=>s.replace(/ /g," ");

/* ---------- Tartu, at dawn ---------- */
// Looking down the Emajõgi from its bank: the river narrows to Kaarsild, the arch bridge students walk over the top of, with the
// old town behind it (Toome Hill's trees and the cathedral's two towers on the left, the town hall's tower at the bridge's end,
// St John's tower beyond). A sketch, not a survey. u (0..1) brings the light up.
const D9_LB=[[-60,1010],[180,880],[380,770],[520,694],[612,646],[668,624]],D9_RB=[[1480,1100],[1418,930],[1352,800],[1292,700],[1248,646],[1222,624]];
function d9_sky(ctx,t,u){const g=ctx.createLinearGradient(0,-200,0,640);g.addColorStop(0,rgba(mix([5,8,22],[26,38,76],u),1));g.addColorStop(0.5,rgba(mix([12,18,40],[78,84,128],u),1));
  g.addColorStop(0.86,rgba(mix([26,28,52],[204,146,124],u),1));g.addColorStop(1,rgba(mix([34,32,54],[246,182,134],u),1));ctx.fillStyle=g;ctx.fillRect(-600,-400,W+1200,1040);
  for(let i=0;i<110;i++){const x=hash(i,901)*W*1.3-W*0.15,y=hash(i,902)*460-120,tw_=0.55+0.45*Math.sin(t*1.3+i*2.1);ctx.fillStyle="rgba(232,238,255,"+(0.7*(1-u)*tw_*hash(i,903))+")";ctx.fillRect(x,y,1.8,1.8);}
  // the sun, still under the far bank: its glow where it will rise, behind the town
  glow(ctx,1090,640,640,D9_DAWN,0.22*u);glow(ctx,1090,630,240,[255,224,186],0.3*u);
  // thin clouds, lit from below
  for(let i=0;i<7;i++){const cx=((hash(i,904)*2200+t*(3+hash(i,905)*4))%2400)-240,cy=200+hash(i,906)*300,cw=260+hash(i,907)*380;ctx.save();ctx.globalAlpha*=0.16+0.18*u;
    const cg=ctx.createLinearGradient(0,cy-14,0,cy+14);cg.addColorStop(0,"rgba(120,110,150,0)");cg.addColorStop(0.6,rgba(mix([60,64,96],[255,190,160],u),1));cg.addColorStop(1,"rgba(120,110,150,0)");
    ctx.fillStyle=cg;ctx.beginPath();ctx.ellipse(cx,cy,cw/2,12+hash(i,908)*10,0,0,TAU);ctx.fill();ctx.restore();}}
// the old town behind the bridge, as silhouettes in two depths, a few windows lit
function d9_city(ctx,t,u){const base=618,far=mix([16,20,38],[86,72,96],u),mid=mix([12,14,28],[56,46,66],u),lit=[255,206,140],skyc=mix([34,36,64],[214,158,140],u);
  // Toome Hill, and on it the cathedral's ruin: the nave's empty pointed arches, with the sky through them, and its two towers
  ctx.fillStyle=rgba(far,1);ctx.beginPath();ctx.moveTo(-200,base);ctx.bezierCurveTo(-40,560,170,500,360,500);ctx.bezierCurveTo(520,500,600,560,720,base);ctx.closePath();ctx.fill();
  ctx.fillRect(184,456,150,56);for(let k=0;k<4;k++){const ox=194+k*34;ctx.fillStyle=rgba(skyc,0.5);ctx.beginPath();ctx.moveTo(ox,512);ctx.lineTo(ox,478);ctx.quadraticCurveTo(ox,466,ox+9,460);ctx.quadraticCurveTo(ox+18,466,ox+18,478);ctx.lineTo(ox+18,512);ctx.closePath();ctx.fill();}
  ctx.fillStyle=rgba(far,1);[[332,44],[388,44]].forEach(([x,w])=>{ctx.fillRect(x,416,w,100);for(let k=0;k<4;k++)ctx.fillRect(x+k*(w/4)+1,408,w/8,10);
    ctx.fillStyle=rgba(mix(far,[0,0,0],0.45),1);[438,474].forEach(wy=>{ctx.beginPath();ctx.moveTo(x+w/2-5,wy+20);ctx.lineTo(x+w/2-5,wy+6);ctx.quadraticCurveTo(x+w/2,wy-2,x+w/2+5,wy+6);ctx.lineTo(x+w/2+5,wy+20);ctx.closePath();ctx.fill();});ctx.fillStyle=rgba(far,1);});
  // the hill's trees, in front of the ruin's feet
  for(let i=0;i<46;i++){const x=-170+i*19,top=i<6?560-i*9:i<30?506-6*Math.sin(i*0.7)-8*hash(i,921):500+(i-30)*7,r=14+hash(i,922)*12;if(x>720)break;ctx.fillStyle=rgba(mix(far,[30,40,20],0.15+0.2*hash(i,920)),1);ctx.beginPath();ctx.arc(x,top+r*0.5+(x>180&&x<440?14:0),r,0,TAU);ctx.fill();}
  // roofs down to the water, in front of the hill
  ctx.fillStyle=rgba(mid,1);for(let i=0;i<40;i++){const x=40+i*48+hash(i,923)*20,w=54+hash(i,924)*40,h=26+hash(i,925)*36;if(x>880&&x<1040)continue;const y=base-h-(x<700?0:4);
    ctx.beginPath();ctx.moveTo(x,base);ctx.lineTo(x,y);if(hash(i,926)<0.6){ctx.lineTo(x+w/2,y-18-hash(i,927)*10);}ctx.lineTo(x+w,y);ctx.lineTo(x+w,base);ctx.closePath();ctx.fill();
    if(hash(i,928)<0.45){const wx=x+8+hash(i,929)*(w-20),wy=y+8+hash(i,930)*(h-18),f=0.6+0.4*Math.sin(t*0.7+i);ctx.fillStyle=rgba(lit,0.55*f*(1-0.5*u));ctx.fillRect(wx,wy,5,7);ctx.fillStyle=rgba(mid,1);}}
  // the town hall, at the end of the bridge, with its tower and spire
  ctx.fillStyle=rgba(mid,1);ctx.fillRect(868,540,184,base-540);ctx.beginPath();ctx.moveTo(860,542);ctx.lineTo(960,512);ctx.lineTo(1060,542);ctx.closePath();ctx.fill();
  ctx.fillRect(947,470,26,60);ctx.beginPath();ctx.moveTo(943,472);ctx.lineTo(960,420);ctx.lineTo(977,472);ctx.closePath();ctx.fill();ctx.fillRect(959,406,2,16);
  for(let k=0;k<7;k++){const f=0.7+0.3*Math.sin(t*0.5+k*1.3);ctx.fillStyle=rgba(lit,(k%3===1?0.7:0.35)*f*(1-0.4*u));ctx.fillRect(884+k*24,568,8,12);}ctx.fillStyle=rgba(lit,0.6*(1-0.3*u));ctx.beginPath();ctx.arc(960,492,5,0,TAU);ctx.fill();
  // St John's tower, beyond the roofs on the right
  ctx.fillStyle=rgba(far,1);ctx.fillRect(1282,450,52,base-450);ctx.beginPath();ctx.moveTo(1276,454);ctx.lineTo(1308,404);ctx.lineTo(1340,454);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(mix(far,[0,0,0],0.4),1);ctx.beginPath();ctx.moveTo(1302,500);ctx.lineTo(1302,480);ctx.quadraticCurveTo(1308,470,1314,480);ctx.lineTo(1314,500);ctx.closePath();ctx.fill();
  // mist on the water, at the far end
  for(let i=0;i<5;i++){const mx=((i*420+t*(6+i*2))%2400)-300,my=606+i*6;ctx.save();ctx.globalAlpha*=0.1+0.08*u;const mg=ctx.createRadialGradient(mx,my,10,mx,my,320);mg.addColorStop(0,"rgba(230,226,240,1)");mg.addColorStop(1,"rgba(230,226,240,0)");
    ctx.fillStyle=mg;ctx.beginPath();ctx.ellipse(mx,my,320,26,0,0,TAU);ctx.fill();ctx.restore();}}
// trees along both banks, smaller towards the bridge, in their autumn colours
function d9_bankTrees(ctx,t,u){const along=(B,k)=>{let L=0;const D=[0];for(let i=1;i<B.length;i++){L+=Math.hypot(B[i][0]-B[i-1][0],B[i][1]-B[i-1][1]);D.push(L);}const d=L*k;let i=1;while(i<B.length-1&&D[i]<d)i++;const f=(d-D[i-1])/((D[i]-D[i-1])||1);return[lerp(B[i-1][0],B[i][0],f),lerp(B[i-1][1],B[i][1],f)];};
  const tree=(x,y,s,i)=>{const sw=Math.sin(t*0.6+i)*2*s,dark=mix([10,12,16],[40,40,36],u);ctx.fillStyle=rgba(dark,1);ctx.fillRect(x-3*s,y-60*s,6*s,60*s);
    for(let k=0;k<6;k++){const cx=x+(hash(i*7+k,981)-0.5)*44*s+sw,cy=y-70*s-hash(i*7+k,982)*50*s,r=(18+hash(i*7+k,983)*14)*s,warm=hash(i*7+k,984);
      ctx.fillStyle=rgba(mix(mix([14,18,20],[60,64,40],u),mix([60,46,20],[214,156,60],u),warm*0.6),1);ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();}};
  // drawn far to near, so the near ones overlap
  for(let k=9;k>=0;k--){const v=k/9,[x,y]=along(D9_LB.slice().reverse(),v*0.85),s=lerp(0.28,1.25,v*v);tree(x-70*s-24,y-6*s,s,k);}
  for(let k=5;k>=0;k--){const v=k/5,[x,y]=along(D9_RB.slice().reverse(),v*0.5),s=lerp(0.28,0.8,v);tree(x+60*s+20,y-6*s,s,20+k);}}
// the river, from the bridge to our bank: the sky in it, ripples, the dawn's column of light
function d9_river(ctx,t,u){ctx.save();ctx.beginPath();ctx.moveTo(D9_LB[0][0],D9_LB[0][1]);D9_LB.forEach(p=>ctx.lineTo(p[0],p[1]));D9_RB.slice().reverse().forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(1480,1100);ctx.lineTo(-60,1100);ctx.closePath();
  const g=ctx.createLinearGradient(0,618,0,1080);g.addColorStop(0,rgba(mix([30,30,54],[196,150,140],u),1));g.addColorStop(0.25,rgba(mix([16,20,40],[84,86,124],u),1));g.addColorStop(1,rgba(mix([5,8,18],[16,24,46],u),1));ctx.fillStyle=g;ctx.fill();ctx.clip();
  // the dawn's light, laid on the water under where the sun will rise
  const cg=ctx.createLinearGradient(0,620,0,1080);cg.addColorStop(0,rgba(D9_DAWN,0.5*u));cg.addColorStop(1,rgba(D9_DAWN,0));ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(1050,620);ctx.lineTo(1130,620);ctx.lineTo(1330,1100);ctx.lineTo(850,1100);ctx.closePath();ctx.fill();
  // ripples: short strokes, closer together towards the bridge, drifting
  for(let i=0;i<150;i++){const v=hash(i,931),y=622+Math.pow(v,1.7)*470,k=(y-616)/464,x0=lerp(700,-60,k),x1=lerp(1222,1480,k),x=x0+((hash(i,932)*(x1-x0)+t*(8+20*k))%(x1-x0)),len=(10+46*k)*(0.5+hash(i,933));
    const warm=Math.abs(x-lerp(1090,1090,k))<lerp(40,240,k)?1:0;ctx.strokeStyle=warm?rgba(mix([255,220,180],D9_DAWN,0.4),(0.18+0.4*u)*(0.4+0.6*k)):rgba([170,186,230],0.06+0.1*k);ctx.lineWidth=0.8+1.6*k;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+len,y+Math.sin(t+i)*0.6);ctx.stroke();}
  ctx.restore();}
// Kaarsild: a deck on piers, and its arch over the top, with hangers; its reflection under it
function d9_bridge(ctx,t,u){const y=626,x0=604,x1=1290,ax0=648,ax1=1246,top=528,col=mix([110,112,136],[244,226,214],u),sh=mix([24,24,40],[96,84,100],u);
  const arch=(k)=>{const x=lerp(ax0,ax1,k);return[x,y-(y-top)*(1-Math.pow(2*k-1,2))];};
  // the reflection first, rippled and faint
  ctx.save();ctx.globalAlpha*=0.32;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=7;ctx.beginPath();for(let i=0;i<=40;i++){const[x,yy]=arch(i/40),ry=2*y+16-yy+Math.sin(i*1.7+t*2)*2;i?ctx.lineTo(x,ry):ctx.moveTo(x,ry);}ctx.stroke();
  ctx.fillStyle=rgba(col,1);ctx.fillRect(x0,y+12,x1-x0,6);ctx.restore();
  // the deck and its edge
  ctx.fillStyle=rgba(sh,1);ctx.fillRect(x0,y,x1-x0,12);ctx.fillStyle=rgba(col,0.9);ctx.fillRect(x0,y-2,x1-x0,4);
  // hangers, then the arch, catching the light along its top
  ctx.strokeStyle=rgba(col,0.7);ctx.lineWidth=2;for(let i=1;i<18;i++){const[x,yy]=arch(i/18);ctx.beginPath();ctx.moveTo(x,yy+6);ctx.lineTo(x,y);ctx.stroke();}
  ctx.strokeStyle=rgba(sh,1);ctx.lineWidth=13;ctx.lineCap="round";ctx.beginPath();for(let i=0;i<=48;i++){const[x,yy]=arch(i/48);i?ctx.lineTo(x,yy):ctx.moveTo(x,yy);}ctx.stroke();
  ctx.strokeStyle=rgba(col,1);ctx.lineWidth=5;ctx.beginPath();for(let i=0;i<=48;i++){const[x,yy]=arch(i/48);i?ctx.lineTo(x,yy-4):ctx.moveTo(x,yy-4);}ctx.stroke();
  // lamps along the deck, warm, and their glow
  for(let i=0;i<9;i++){const x=x0+40+i*(x1-x0-80)/8;glow(ctx,x,y-10,16,[255,214,150],0.5*(1-0.6*u));ctx.fillStyle="rgba(255,226,170,"+(0.9-0.5*u)+")";ctx.fillRect(x-1.5,y-14,3,4);}}
// the banks: the left with its path, lamps and birches; the right under the near building
function d9_banks(ctx,t,u){const gnd=mix([8,10,18],[30,28,40],u),path=mix([30,30,44],[110,96,100],u);
  ctx.fillStyle=rgba(gnd,1);ctx.beginPath();ctx.moveTo(-200,618);ctx.lineTo(700,618);D9_LB.slice().reverse().forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(-200,1100);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(1200,618);ctx.lineTo(2200,618);ctx.lineTo(2200,1100);ctx.lineTo(1480,1100);D9_RB.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.closePath();ctx.fill();
  // the stone edge of the left bank, and its path
  ctx.strokeStyle=rgba(path,1);ctx.lineWidth=3;ctx.beginPath();D9_LB.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]-2):ctx.moveTo(p[0],p[1]-2));ctx.stroke();
  ctx.strokeStyle=rgba(mix(path,[0,0,0],0.3),1);ctx.lineWidth=2;ctx.beginPath();D9_LB.forEach((p,i)=>{const q=[p[0]-80*(p[1]-616)/400,p[1]-20*(p[1]-616)/400];i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]);});ctx.stroke();
  // lamps along the path, smaller towards the bridge
  [[0.15,1],[0.4,0.66],[0.62,0.44],[0.8,0.3]].forEach(([k,s],i)=>{const x=lerp(560,-20,1-k)-60*s,y=lerp(650,1040,s*0.9);ctx.strokeStyle=rgba(mix(gnd,[0,0,0],0.4),1);ctx.lineWidth=5*s;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-230*s);ctx.stroke();
    glow(ctx,x,y-236*s,70*s,[255,206,140],0.55*(1-0.5*u));ctx.fillStyle="rgba(255,230,180,0.95)";ctx.beginPath();ctx.arc(x,y-236*s,7*s,0,TAU);ctx.fill();});}
// a birch, near: a pale trunk with dark marks, tapering branches, the last yellow leaves; it sways a little
function d9_birch(ctx,x,y,s,t,u){ctx.save();ctx.translate(x,y);const sw=Math.sin(t*0.6)*0.012,bark=mix([120,120,130],[226,220,212],u),mark=mix([10,10,16],[40,34,36],u);
  const br=(x0,y0,an,len,w,d,seed)=>{if(d>5||len<14)return;const a2=an+Math.sin(t*0.7+seed)*0.01*d+sw*d,x1=x0+Math.cos(a2)*len,y1=y0+Math.sin(a2)*len,cx=(x0+x1)/2+Math.cos(a2+1.57)*len*0.08,cy=(y0+y1)/2+Math.sin(a2+1.57)*len*0.08;
    ctx.strokeStyle=rgba(d<2?bark:mix(bark,mark,0.5),1);ctx.lineWidth=w;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(cx,cy,x1,y1);ctx.stroke();
    if(d>=3)for(let k=0;k<3;k++){const lx=lerp(x0,x1,0.5+k*0.25),ly=lerp(y0,y1,0.5+k*0.25)+6,on=hash(seed*7+k,941)<0.6;if(!on)continue;ctx.save();ctx.translate(lx,ly);ctx.rotate(hash(seed+k,942)*3+Math.sin(t+seed)*0.2);
      ctx.fillStyle=rgba(mix([150,120,40],[250,204,80],u),0.95);ctx.beginPath();ctx.moveTo(0,-7*s);ctx.quadraticCurveTo(6*s,0,0,7*s);ctx.quadraticCurveTo(-6*s,0,0,-7*s);ctx.fill();ctx.restore();}
    br(x1,y1,a2-0.42-hash(seed,943)*0.2,len*0.72,w*0.62,d+1,seed*2+1);br(x1,y1,a2+0.36+hash(seed,944)*0.2,len*0.66,w*0.6,d+1,seed*2+2);};
  // the trunk, tapering, with its dark marks
  ctx.fillStyle=rgba(bark,1);ctx.beginPath();ctx.moveTo(-16*s,0);ctx.bezierCurveTo(-12*s,-200*s,-8*s,-360*s,-4*s,-520*s);ctx.lineTo(4*s,-520*s);ctx.bezierCurveTo(8*s,-360*s,12*s,-200*s,16*s,0);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(mark,0.85);for(let k=0;k<14;k++){const yy=-20*s-k*36*s,ww=(14-k*0.7)*s;ctx.fillRect(-ww*(0.2+hash(k,945)*0.8),yy,ww*(0.6+hash(k,946)*0.6),3+hash(k,947)*4);}
  br(-2*s,-300*s,-2.2,150*s,7*s,1,1);br(2*s,-380*s,-0.9,140*s,6*s,1,2);br(0,-470*s,-1.8,130*s,5*s,1,3);br(0,-520*s,-1.45,120*s,4*s,2,4);ctx.restore();}
// leaves falling across the foreground
function d9_leaves(ctx,t,a,u){if(a<=0.01)return;withA(ctx,a,()=>{for(let i=0;i<10;i++){const sp=22+hash(i,951)*26,y=((hash(i,952)*1300+t*sp)%1300)-120,x=hash(i,953)*1500+Math.sin(t*0.8+i*2)*60-40,s=0.8+hash(i,954)*0.8;
  ctx.save();ctx.translate(x,y);ctx.rotate(t*(0.6+hash(i,955))+i);ctx.scale(Math.cos(t*1.6+i),1);ctx.fillStyle=rgba(mix([150,110,40],[248,196,70],u),0.9);ctx.beginPath();ctx.moveTo(0,-9*s);ctx.quadraticCurveTo(7*s,0,0,9*s);ctx.quadraticCurveTo(-7*s,0,0,-9*s);ctx.fill();
  ctx.strokeStyle="rgba(120,80,30,0.6)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-8*s);ctx.lineTo(0,8*s);ctx.stroke();ctx.restore();}});}
// the near building on the right bank, its windows dark but one: the family's, warm, the parents holding the baby
const D9_WIN=[1594,466,170,190];
function d9_building(ctx,t,u,o){o=o||{};const wall=mix([10,12,22],[38,34,48],u),edge=mix([30,30,46],[104,94,110],u);ctx.fillStyle=rgba(wall,1);ctx.beginPath();ctx.moveTo(1500,1100);ctx.lineTo(1500,236);ctx.lineTo(2100,190);ctx.lineTo(2100,1100);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(edge,1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(1500,1100);ctx.lineTo(1500,236);ctx.lineTo(2100,190);ctx.stroke();ctx.fillStyle=rgba(edge,0.8);ctx.fillRect(1494,230,14,12);
  // the other windows: dark glass with the sky in it, a frame and a sill; one or two lit, further in
  for(let r=0;r<4;r++)for(let c=0;c<2;c++){const x=1594+c*230,y=270+r*196,isW=r===1&&c===0;if(isW)continue;const gg=ctx.createLinearGradient(0,y,0,y+190);gg.addColorStop(0,rgba(mix([28,34,60],[110,104,140],u),1));gg.addColorStop(1,rgba(mix([8,10,20],[30,32,50],u),1));
    ctx.fillStyle=gg;ctx.fillRect(x,y,170,190);if(hash(r*2+c,961)<0.3){ctx.fillStyle="rgba(255,206,150,0.2)";ctx.fillRect(x+90,y+40,70,140);}
    ctx.strokeStyle=rgba(edge,0.9);ctx.lineWidth=4;ctx.strokeRect(x,y,170,190);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+85,y);ctx.lineTo(x+85,y+70);ctx.moveTo(x,y+70);ctx.lineTo(x+170,y+70);ctx.stroke();ctx.fillStyle=rgba(edge,1);ctx.fillRect(x-8,y+190,186,8);}
  // the family's window: warm light, a curtain, and their shapes against it
  const[wx,wy,ww,wh]=D9_WIN,lt=o.light==null?1:o.light;glow(ctx,wx+ww/2,wy+wh/2,300,[255,196,120],0.32*lt);ctx.save();rr(ctx,wx,wy,ww,wh,4);ctx.clip();
  const g=ctx.createRadialGradient(wx+ww*0.6,wy+wh*0.35,10,wx+ww/2,wy+wh/2,ww);g.addColorStop(0,"rgba(255,226,170,1)");g.addColorStop(1,"rgba(214,140,86,1)");ctx.fillStyle=g;ctx.fillRect(wx,wy,ww,wh);
  ctx.fillStyle="rgba(250,236,214,0.55)";ctx.beginPath();ctx.moveTo(wx,wy);ctx.lineTo(wx+40,wy);ctx.quadraticCurveTo(wx+26,wy+wh*0.6,wx+34,wy+wh);ctx.lineTo(wx,wy+wh);ctx.closePath();ctx.fill();
  d9_family(ctx,wx+ww*0.55,wy+wh,1,t);ctx.restore();ctx.strokeStyle=rgba(edge,1);ctx.lineWidth=5;ctx.strokeRect(wx,wy,ww,wh);ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh*0.31);ctx.moveTo(wx,wy+wh*0.31);ctx.lineTo(wx+ww,wy+wh*0.31);ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle=rgba(edge,1);ctx.fillRect(wx-8,wy+wh,ww+16,8);}
// the parents, against the light: one holding the baby, swaddled, the other leaning in; they breathe
function d9_family(ctx,x,y,s,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const sil="rgba(70,40,34,0.92)",br=Math.sin(t*1.4)*1.2;
  // the one holding the baby, on the right
  ctx.fillStyle=sil;ctx.beginPath();ctx.moveTo(-6,2);ctx.bezierCurveTo(-10,-60,-4,-96+br,18,-104+br);ctx.bezierCurveTo(44,-110+br,60,-92+br,62,-60);ctx.lineTo(66,2);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(28,-128+br,15,18,0.1,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(20,-114+br);ctx.lineTo(36,-114+br);ctx.lineTo(34,-104+br);ctx.lineTo(22,-104+br);ctx.closePath();ctx.fill();
  // the baby in their arms: a pale swaddle, a small head
  ctx.fillStyle="rgba(252,240,226,0.95)";ctx.beginPath();ctx.ellipse(16,-78+br,26,12,-0.25,0,TAU);ctx.fill();ctx.fillStyle="rgba(236,206,180,1)";ctx.beginPath();ctx.arc(-6,-84+br,8,0,TAU);ctx.fill();
  ctx.fillStyle=sil;ctx.beginPath();ctx.moveTo(-14,-70+br);ctx.quadraticCurveTo(14,-58+br,44,-74+br);ctx.lineTo(46,-66+br);ctx.quadraticCurveTo(14,-50+br,-14,-62+br);ctx.closePath();ctx.fill();
  // the other, leaning in from the left
  const lb=Math.sin(t*1.2+1)*1.2;ctx.beginPath();ctx.moveTo(-96,2);ctx.bezierCurveTo(-100,-50,-88,-86+lb,-62,-94+lb);ctx.bezierCurveTo(-40,-98+lb,-26,-80+lb,-24,-52);ctx.lineTo(-20,2);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(-46,-116+lb,14,17,0.35,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(-30,-84+lb);ctx.quadraticCurveTo(-18,-80+lb,-10,-86+lb);ctx.lineTo(-10,-80+lb);ctx.quadraticCurveTo(-20,-72+lb,-32,-76+lb);ctx.closePath();ctx.fill();ctx.restore();}
// the whole view: sky, town, river, bridge, banks, the birch, the near building; o.u, the light; o.dim, darker behind the glass
function d9_tartu(ctx,t,o){o=o||{};const u=o.u==null?0.5:o.u;d9_sky(ctx,t,u);d9_city(ctx,t,u);d9_river(ctx,t,u);d9_bridge(ctx,t,u);d9_banks(ctx,t,u);d9_bankTrees(ctx,t,u);d9_building(ctx,t,u,o);d9_birch(ctx,214,1060,1.15,t,u);d9_leaves(ctx,t,o.leaves==null?1:o.leaves,u);
  if(o.dim>0.01){ctx.fillStyle="rgba(4,6,14,"+clamp(o.dim,0,1)*0.8+")";ctx.fillRect(-600,-400,W+1200,H+800);}}

/* ---------- the register, the offices, X-Road ---------- */
// The population register: glass, pale as frost, with its name and rows of records (texture), one lit (o.row: what it says, o.lit 0..1)
function d9_register(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,D9_TAR,{glow:18+18*(o.hi||0),ea:0.9,fill:"rgba(8,14,30,0.92)"});ctx.fillStyle=rgba(D9_TAR,0.06+0.06*(o.hi||0));rr(ctx,x,y,w,h,22);ctx.fill();
  dbGlyph(ctx,x+46,y+54,D9_TAR,0.9);T(ctx,"population register",x+84,y+64,{w:800,size:32,color:rgba(D9_TAR,1)});
  const rows=Math.floor((h-110)/38);for(let i=0;i<rows;i++){const yy=y+104+i*38;if(o.row&&i===rows-1)continue;ctx.fillStyle=rgba(D9_TAR,0.14);rr(ctx,x+30,yy,w-60,26,8);ctx.fill();
    for(let k=0;k<5;k++){ctx.fillStyle=rgba(D9_TAR,0.28);ctx.fillRect(x+44+k*((w-100)/5),yy+11,(w-100)/5*(0.4+0.4*hash(i*5+k,971)),5);}}
  if(o.row){const yy=y+104+(rows-1)*38,l=o.lit||0;withA(ctx,clamp(l*2,0,1),()=>{glow(ctx,x+w/2,yy+13,w*0.5,D9_DAWN,0.35*pulse_(l));ctx.fillStyle=rgba(mix(D9_TAR,D9_DAWN,0.6),0.22);rr(ctx,x+24,yy-8,w-48,42,10);ctx.fill();
    T(ctx,o.row,x+44,yy+24,{w:700,size:28,color:rgba(mix(INK,D9_DAWN,0.3),1)});});}});}
const pulse_=l=>0.6+0.4*Math.sin(l*Math.PI);
// a public office: a glass card with a building's glyph and its name; o.copy (0..1): the place its own copy would be, empty and crossed
function d9_office(ctx,x,y,w,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=90;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,D9_TAR,{glow:12+14*(o.hi||0),ea:0.8,fill:"rgba(8,14,30,0.93)"});
  d9_bldg(ctx,x+38,y+h/2,1,D9_TAR);const nl=wrapT(ctx,name,0,0,w-92,{size:28,w:700,measure:true}).length;wrapT(ctx,name,x+74,y+h/2+10-(nl-1)*16,w-92,{size:28,w:700,color:rgba(INK,0.96),lh:32});});}
// a public building, as a glyph: a pediment on four columns
function d9_bldg(ctx,gx,gy,s,col){ctx.save();ctx.translate(gx,gy);ctx.scale(s,s);ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.2/s;ctx.beginPath();ctx.moveTo(-18,-6);ctx.lineTo(0,-18);ctx.lineTo(18,-6);ctx.closePath();ctx.stroke();
  [-12,-4,4,12].forEach(d=>{ctx.beginPath();ctx.moveTo(d,-3);ctx.lineTo(d,12);ctx.stroke();});ctx.beginPath();ctx.moveTo(-20,16);ctx.lineTo(20,16);ctx.stroke();ctx.restore();}
// another office that asks the register, unnamed: the register has many users
function d9_officeS(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-34,y-34,68,68,34,D9_TAR,{glow:10+14*(o.hi||0),ea:0.7,fill:"rgba(8,14,30,0.93)"});d9_bldg(ctx,x,y+1,0.9,D9_TAR);});}
// points along a cubic curve, for a road
function d9_bez(p0,p1,p2,p3,n){const P=[];for(let i=0;i<=(n||24);i++){const u=i/(n||24),v=1-u;P.push([v*v*v*p0[0]+3*v*v*u*p1[0]+3*v*u*u*p2[0]+u*u*u*p3[0],v*v*v*p0[1]+3*v*v*u*p1[1]+3*v*u*u*p2[1]+u*u*u*p3[1]]);}return P;}
// X-Road, between an office and the register: a road of two lines with a dashed middle, drawn to p; asks go out along it and answers
// come back (o.ask, o.ans: 0..1 along it, or none)
function d9_road(ctx,pts,p,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a;withA(ctx,a,()=>{const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const D=L[L.length-1]*clamp(p,0,1);
  const at_=d=>{let i=1;while(i<L.length-1&&L[i]<d)i++;const f=clamp((d-L[i-1])/((L[i]-L[i-1])||1),0,1);return[lerp(pts[i-1][0],pts[i][0],f),lerp(pts[i-1][1],pts[i][1],f),Math.atan2(pts[i][1]-pts[i-1][1],pts[i][0]-pts[i-1][0])];};
  const path=(off)=>{ctx.beginPath();for(let d=0;d<=D;d+=6){const[x,y,an]=at_(d);const px=x-Math.sin(an)*off,py=y+Math.cos(an)*off;d?ctx.lineTo(px,py):ctx.moveTo(px,py);}};
  ctx.save();ctx.shadowColor=rgba(D9_TAR,0.6);ctx.shadowBlur=10+10*(o.hi||0);ctx.strokeStyle=rgba(D9_TAR,0.75+0.25*(o.hi||0));const hw=7*(o.lw==null?1:o.lw);ctx.lineWidth=2.2;path(-hw);ctx.stroke();path(hw);ctx.stroke();ctx.shadowBlur=0;
  ctx.setLineDash([10,12]);ctx.lineDashOffset=-(o.t||0)*24;ctx.strokeStyle=rgba(D9_TAR,0.4);ctx.lineWidth=1.6;path(0);ctx.stroke();ctx.restore();
  const pk=(u,col,dir)=>{if(u==null||u<0||u>1)return;const[x,y]=at_(L[L.length-1]*u);glow(ctx,x,y,22,col,0.7);ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillStyle=rgba(mix(col,[255,255,255],0.5),1);ctx.fillRect(-6,-6,12,12);ctx.restore();};
  if(p>=1){pk(o.ask,D9_TAR);pk(o.ans,D9_DAWN);}});}
// a catalogue of every database, with the office that owns it: rows of [database, owner], the first legible, the rest texture
function d9_catalogue(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=118+rows.length*46;withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,D9_TAR,{glow:12,ea:0.75,fill:"rgba(8,14,30,0.94)"});
  T(ctx,o.title||"every database, and who owns it",x+28,y+50,{w:800,size:30,color:rgba(D9_TAR,1)});ctx.strokeStyle=rgba(D9_TAR,0.3);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+24,y+72);ctx.lineTo(x+w-24,y+72);ctx.stroke();
  rows.forEach(([db,own],i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q<=0)return;const yy=y+110+i*46,big=i===0;withA(ctx,q,()=>{
    T(ctx,db,x+28,yy,{w:700,size:big?28:20,color:rgba(INK,big?0.96:0.5),deco:big?0:1});T(ctx,own,x+w-28,yy,{w:700,size:big?28:20,align:"right",color:rgba(TRUST,big?1:0.5),deco:big?0:1});});});});return h;}

/* ---------- the parents' phone ---------- */
// A parent's hand holding a phone, close up, in the warm room behind the window: the screen shows the Social Insurance Board's
// email, offering the family benefit (o.paid: the benefit paid, instead). o.tap (0..1) lights the button.
function d9_phone(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-8,y-8,w+16,h+16,24,D9_DAWN,{glow:18,ea:0.7,fill:"rgba(8,12,24,0.95)"});
  ctx.save();rr(ctx,x,y,w,h,18);ctx.clip();ctx.translate(x,y);
  // the room: a lamp's warmth, the window with the dawn in it, out of focus
  let g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,"#3a2a26");g.addColorStop(1,"#1a1214");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);glow(ctx,w*0.12,h*0.26,w*0.55,[255,190,120],0.45);
  g=ctx.createLinearGradient(0,h*0.06,0,h*0.6);g.addColorStop(0,"#3b4d7e");g.addColorStop(1,"#d99b82");ctx.fillStyle=g;rr(ctx,w*0.6,h*0.06,w*0.34,h*0.54,6);ctx.fill();ctx.fillStyle="rgba(30,22,26,0.85)";ctx.fillRect(w*0.765,h*0.06,10,h*0.54);ctx.fillRect(w*0.6,h*0.3,w*0.34,8);
  ctx.fillStyle="rgba(40,34,52,0.7)";ctx.fillRect(w*0.6,h*0.5,w*0.34,h*0.1);
  // the phone, in a hand: palm and fingertips behind it, the thumb in front
  const pw=380,ph=700,px=w*0.5,py=h*0.53+Math.sin(t*1.1)*3;ctx.save();ctx.translate(px,py);ctx.rotate(-0.045+Math.sin(t*0.7)*0.008);
  const skin=[228,186,160],skL=[246,212,190],skD=[176,128,104];
  const skinG=(x0,x1)=>{const gg=ctx.createLinearGradient(x0,0,x1,0);gg.addColorStop(0,rgba(skL,1));gg.addColorStop(1,rgba(skD,1));return gg;};
  ctx.fillStyle=skinG(-pw*0.6,pw*0.6);ctx.beginPath();ctx.moveTo(-pw*0.56,ph*1.1);ctx.bezierCurveTo(-pw*0.6,ph*0.6,-pw*0.52,ph*0.3,-pw*0.36,ph*0.24);ctx.lineTo(pw*0.4,ph*0.26);ctx.bezierCurveTo(pw*0.56,ph*0.32,pw*0.6,ph*0.6,pw*0.54,ph*1.1);ctx.closePath();ctx.fill();
  [[-0.06,0],[0.07,1],[0.2,2],[0.32,3]].forEach(([fy,k])=>{const yy=ph*fy,len=46-k*3;ctx.save();ctx.translate(pw/2-6,yy);ctx.rotate(0.12+k*0.05);ctx.fillStyle=skinG(0,len);ctx.beginPath();ctx.moveTo(-10,-16);ctx.lineTo(len-14,-15);
    ctx.quadraticCurveTo(len+2,-14,len+2,0);ctx.quadraticCurveTo(len+2,14,len-14,15);ctx.lineTo(-10,16);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(skD,0.7);ctx.lineWidth=1.4;ctx.stroke();
    ctx.fillStyle=rgba(mix(skL,[255,236,226],0.4),0.65);ctx.beginPath();ctx.ellipse(len-12,-2,7,9,0,0,TAU);ctx.fill();ctx.restore();});
  ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=24;ctx.shadowOffsetX=6;ctx.shadowOffsetY=10;ctx.fillStyle="#16181d";rr(ctx,-pw/2,-ph/2,pw,ph,52);ctx.fill();ctx.restore();
  ctx.strokeStyle="rgba(255,255,255,0.18)";ctx.lineWidth=2;rr(ctx,-pw/2+2,-ph/2+2,pw-4,ph-4,50);ctx.stroke();
  // the screen
  const sx=-pw/2+14,sy=-ph/2+14,sw_=pw-28,shh=ph-28,L=sx+28,R=sx+sw_-28;ctx.save();rr(ctx,sx,sy,sw_,shh,40);ctx.clip();g=ctx.createLinearGradient(0,sy,0,sy+shh);g.addColorStop(0,"#f7f8fb");g.addColorStop(1,"#e8ebf1");ctx.fillStyle=g;ctx.fillRect(sx,sy,sw_,shh);
  ctx.fillStyle="#16181d";rr(ctx,-46,sy+14,92,26,13);ctx.fill();
  if(!o.paid){T(ctx,"Inbox",L,sy+96,{w:800,size:28,color:"rgba(30,34,44,0.9)"});ctx.fillStyle="rgba(30,34,44,0.12)";ctx.fillRect(sx,sy+118,sw_,2);
    // the sender: a round mark with a building, its name over two lines; then the subject, the text, the button
    ctx.fillStyle="rgba(58,96,156,1)";ctx.beginPath();ctx.arc(L+26,sy+170,26,0,TAU);ctx.fill();ctx.save();ctx.strokeStyle="#fff";ctx.lineWidth=2;const gx=L+26,gy=sy+170;ctx.beginPath();ctx.moveTo(gx-12,gy-3);ctx.lineTo(gx,gy-12);ctx.lineTo(gx+12,gy-3);ctx.closePath();ctx.stroke();
      [-7,0,7].forEach(d=>{ctx.beginPath();ctx.moveTo(gx+d,gy);ctx.lineTo(gx+d,gy+9);ctx.stroke();});ctx.beginPath();ctx.moveTo(gx-13,gy+12);ctx.lineTo(gx+13,gy+12);ctx.stroke();ctx.restore();
    T(ctx,"Social Insurance",L+66,sy+164,{w:800,size:28,color:"rgba(30,34,44,0.95)"});T(ctx,"Board",L+66,sy+198,{w:800,size:28,color:"rgba(30,34,44,0.95)"});
    T(ctx,"A family benefit",L,sy+272,{w:800,size:32,color:"rgba(18,22,32,1)"});T(ctx,"for your child",L,sy+312,{w:800,size:32,color:"rgba(18,22,32,1)"});
    for(let k=0;k<4;k++){ctx.fillStyle="rgba(30,34,44,0.16)";ctx.fillRect(L,sy+350+k*26,(R-L)*(k===3?0.55:0.94-0.06*hash(k,975)),10);}
    const bt=o.tap||0,by=sy+478;ctx.save();if(bt>0.01){ctx.shadowColor="rgba(60,110,200,0.9)";ctx.shadowBlur=26*bt;}ctx.fillStyle=rgba(mix([58,96,156],[74,134,226],bt),1);rr(ctx,L,by,R-L,68,20);ctx.fill();ctx.restore();
    T(ctx,"Accept",(L+R)/2,by+45,{w:800,size:32,align:"center",color:"#fff"});}
  else{ctx.fillStyle="rgba(64,148,94,1)";ctx.beginPath();ctx.arc(0,sy+250,58,0,TAU);ctx.fill();tick_(ctx,0,sy+252,64,[255,255,255],1);
    T(ctx,"Family benefit",0,sy+374,{w:800,size:32,align:"center",color:"rgba(18,22,32,1)"});T(ctx,"paid",0,sy+418,{w:800,size:32,align:"center",color:"rgba(36,120,70,1)"});
    for(let k=0;k<3;k++){ctx.fillStyle="rgba(30,34,44,0.14)";ctx.fillRect(L+20,sy+468+k*26,R-L-40,10);}}
  // a little glare across the glass
  const gl=ctx.createLinearGradient(sx,sy,sx+sw_,sy+shh*0.6);gl.addColorStop(0,"rgba(255,255,255,0.0)");gl.addColorStop(0.5,"rgba(255,255,255,0.10)");gl.addColorStop(0.56,"rgba(255,255,255,0.0)");ctx.fillStyle=gl;ctx.fillRect(sx,sy,sw_,shh);ctx.restore();
  // the thumb, along the left edge, its tip over the glass; and a sleeve at the wrist
  ctx.fillStyle=skinG(-pw*0.7,-pw*0.3);ctx.beginPath();ctx.moveTo(-pw*0.64,ph*0.5);ctx.bezierCurveTo(-pw*0.7,ph*0.32,-pw*0.6,ph*0.16,-pw*0.47,ph*0.07);ctx.bezierCurveTo(-pw*0.42,ph*0.035,-pw*0.35,ph*0.05,-pw*0.36,ph*0.1);
  ctx.bezierCurveTo(-pw*0.37,ph*0.17,-pw*0.42,ph*0.3,-pw*0.4,ph*0.52);ctx.closePath();ctx.fill();ctx.strokeStyle=rgba(skD,0.6);ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle=rgba(mix(skL,[255,240,232],0.45),0.7);ctx.beginPath();ctx.ellipse(-pw*0.405,ph*0.075,10,14,-0.5,0,TAU);ctx.fill();
  ctx.fillStyle="#60708e";ctx.beginPath();ctx.moveTo(-pw*0.66,ph*0.62);ctx.quadraticCurveTo(0,ph*0.56,pw*0.6,ph*0.64);ctx.lineTo(pw*0.64,ph*1.2);ctx.lineTo(-pw*0.7,ph*1.2);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,0.08)";ctx.lineWidth=2;for(let k=0;k<8;k++){ctx.beginPath();ctx.moveTo(-pw*0.6+k*pw*0.15,ph*0.6);ctx.lineTo(-pw*0.62+k*pw*0.15,ph*1.2);ctx.stroke();}
  ctx.restore();ctx.restore();});}
// an application never filled in: a form on paper, its fields blank
function d9_form(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?0.02:o.rot,plain:true});ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?0.02:o.rot);ctx.translate(-w/2,-h/2);
  T(ctx,"application",28,56,{w:800,size:30,color:"rgba(60,56,60,0.9)"});T(ctx,"family benefit",28,92,{w:700,size:28,color:"rgba(90,84,86,0.85)"});
  for(let k=0;k<5;k++){const yy=150+k*58;ctx.fillStyle="rgba(60,56,60,0.35)";ctx.fillRect(28,yy-16,90,8);ctx.strokeStyle="rgba(60,56,60,0.35)";ctx.lineWidth=1.5;ctx.strokeRect(134,yy-30,w-162,38);}
  ctx.strokeStyle="rgba(60,56,60,0.4)";ctx.strokeRect(28,h-64,30,30);T(ctx,"sign here",72,h-40,{w:700,size:20,color:"rgba(90,84,86,0.6)",deco:1});ctx.restore();});}
// a line traced through points, drawn up to p, with a bright head while it's drawing
function d9_trace_(ctx,pts,p,col,o){o=o||{};if(p<=0)return;const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const d=L[L.length-1]*clamp(p,0,1);
  ctx.save();ctx.globalAlpha*=o.a==null?1:o.a;ctx.strokeStyle=rgba(col,1);ctx.lineWidth=o.lw||3;ctx.lineCap="round";ctx.lineJoin="round";if(o.dash)ctx.setLineDash(o.dash);ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);let hx=pts[0][0],hy=pts[0][1];
  for(let i=1;i<pts.length;i++){if(L[i]<=d){ctx.lineTo(pts[i][0],pts[i][1]);hx=pts[i][0];hy=pts[i][1];}else{const f=(d-L[i-1])/((L[i]-L[i-1])||1);hx=lerp(pts[i-1][0],pts[i][0],f);hy=lerp(pts[i-1][1],pts[i][1],f);ctx.lineTo(hx,hy);break;}}ctx.stroke();ctx.restore();
  if(p<1&&!o.nohead){glow(ctx,hx,hy,22,col,0.8);ctx.fillStyle=rgba(mix(col,[255,255,255],0.6),1);ctx.beginPath();ctx.arc(hx,hy,4.5,0,TAU);ctx.fill();}}
// a second copy of a register, as an office might start one: a dashed outline with a database and what it would hold
function d9_ghostDb(ctx,x,y,w,h,what){ctx.save();ctx.setLineDash([9,7]);ctx.strokeStyle=rgba(D9_TAR,0.75);ctx.lineWidth=2.4;rr(ctx,x,y,w,h,16);ctx.stroke();ctx.restore();ctx.fillStyle=rgba(D9_TAR,0.06);rr(ctx,x,y,w,h,16);ctx.fill();
  dbGlyph(ctx,x+42,y+h/2+4,D9_TAR,0.8);T(ctx,what,x+76,y+h/2+10,{w:700,size:28,color:rgba(D9_TAR,0.85)});}

/* ---------- the utility: its two businesses, the wall between them, and the rules ---------- */
// the rules, in the business's words: day one's, the two it really is, and the validity rule
const D9_R0="an estimated reading stands only until the next actual reading";
const D9_R21="An estimate is replaced when the actual reading arrives, and the replacement is sent to the retailer.";
const D9_R22="A bill based on a replaced estimate is corrected on the next bill.";
const D9_R20="Every reading is marked actual or estimated.";
const D9_Q="Where does each rule belong?",D9_NEXT="What does a change in strategy mean for the data?";
const D9_A="In the map: written once, at the step where it applies, with an owner and a reason, and its checks generated from it.";
// the network's side tinted blue and retail's rose, with their names (as in Who does it); o.ly: where the names sit
function d9_sides(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{const lg=ctx.createLinearGradient(0,0,960,0);lg.addColorStop(0,rgba(D9_NET,0.0));lg.addColorStop(1,rgba(D9_NET,0.08));ctx.fillStyle=lg;ctx.fillRect(0,0,960,H);
  const rg=ctx.createLinearGradient(960,0,W,0);rg.addColorStop(0,rgba(D9_RET,0.08));rg.addColorStop(1,rgba(D9_RET,0.0));ctx.fillStyle=rg;ctx.fillRect(960,0,960,H);
  const ly=o.ly||96;withA(ctx,o.lab==null?1:o.lab,()=>{T(ctx,"network",480,ly,{w:800,size:40,align:"center",color:rgba(D9_NET,1)});T(ctx,"retail",1440,ly,{w:800,size:40,align:"center",color:rgba(D9_RET,1)});});});}
// the wall between them, drawn down from the top as p goes to 1; o.gate (0..1) opens a gate at o.gy, where what crosses is
// translated; o.hi lights it, o.red flashes it
function d9_wall(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=o.p==null?1:o.p,y0=o.y0||140,y1=y0+((o.y1||900)-y0)*ease(p),red=o.red||0,gate=o.gate||0,gy=o.gy||560;withA(ctx,a,()=>{
  const col=mix([226,232,246],D9_RED,red);ctx.save();ctx.shadowColor=rgba(col,0.7);ctx.shadowBlur=18+20*(red+(o.hi||0));ctx.fillStyle=rgba(col,0.12+0.1*red+0.08*(o.hi||0));
  const gh=gate*150;ctx.fillRect(948,y0,24,Math.max(0,Math.min(y1,gy-gh/2)-y0));if(y1>gy+gh/2)ctx.fillRect(948,gy+gh/2,24,y1-gy-gh/2);ctx.shadowBlur=0;
  ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.5;ctx.beginPath();[948,972].forEach(x=>{ctx.moveTo(x,y0);ctx.lineTo(x,Math.min(y1,gy-gh/2));if(y1>gy+gh/2){ctx.moveTo(x,gy+gh/2);ctx.lineTo(x,y1);}});ctx.stroke();ctx.restore();
  if(gate>0.05)withA(ctx,gate,()=>d9_conv(ctx,960,gy,34,0.5+0.5*Math.sin(t*3),1));});}
// the gate's translator: a small box that takes the network's words in and gives retail's out
function d9_conv(ctx,x,y,s,g,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,s*2.2,[220,230,255],0.25+0.45*g);ctx.save();ctx.translate(x,y);ctx.fillStyle="rgba(10,14,26,0.95)";rr(ctx,-s,-s*0.7,2*s,s*1.4,s*0.25);ctx.fill();
  ctx.strokeStyle="rgba(230,236,255,0.95)";ctx.lineWidth=Math.max(1.5,s*0.12);rr(ctx,-s,-s*0.7,2*s,s*1.4,s*0.25);ctx.stroke();ctx.lineWidth=Math.max(1.2,s*0.1);
  [[-1,D9_NET,3],[1,D9_RET,2]].forEach(([sd,col,n])=>{ctx.strokeStyle=rgba(col,1);ctx.beginPath();for(let i=0;i<=16;i++){const u=i/16,xx=sd*s*(0.12+u*0.72);const yy=Math.sin(u*TAU*n/2*1.5)*s*0.28;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}ctx.stroke();});
  ctx.restore();});}
// a list on paper, with a title and its rows (p writes them in); o.hi (0..1) marks the last row as new, in the network's blue
function d9_list(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const h=92+rows.length*52;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.01:o.rot,plain:true});
  T(ctx,title,x+28,y+52,{w:800,size:30,color:"rgba(52,48,46,0.95)"});rows.forEach((r,i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q<=0)return;const nw=i===rows.length-1&&o.hi?o.hi:0;
    withA(ctx,q,()=>{if(nw>0.01)withA(ctx,nw,()=>{ctx.fillStyle="rgba(132,176,255,0.22)";ctx.fillRect(x+20,y+72+i*52,w-40,46);});
      T(ctx,r,x+52,y+104+i*52,{w:700,size:28,color:nw>0.5?"rgba(36,70,150,0.98)":"rgba(52,48,46,0.9)"});ctx.fillStyle="rgba(52,48,46,0.7)";ctx.beginPath();ctx.arc(x+34,y+94+i*52,4,0,TAU);ctx.fill();});});});return h;}
// an envelope: a reading crossing the wall
function d9_msg(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,40*s,col,0.5);ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle="#f1ead8";rr(ctx,-28,-19,56,38,4);ctx.fill();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.5;rr(ctx,-28,-19,56,38,4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-28,-19);ctx.lineTo(0,4);ctx.lineTo(28,-19);ctx.stroke();ctx.restore();});}
// an owner, named on a gold tag with ArchiMate's actor glyph
function d9_owner(ctx,x,y,name,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const s=(o.pre==null?"owner · ":o.pre)+name,ts=28,w=tw(ctx,s,ts,700)+70,h=48,X=o.align==="center"?x-w/2:x;glass(ctx,X,y-h/2,w,h,h/2,TRUST,{glow:10+12*(o.hi||0),ea:0.85,fill:"rgba(20,16,6,0.92)"});
  archGlyph(ctx,"actor",X+26,y-2,13,TRUST);T(ctx,s,X+48,y+ts*0.36,{w:700,size:ts,color:rgba(TRUST,1)});});}
// ArchiMate's requirement: a parallelogram, leaning right
function d9_reqGlyph(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.11);ctx.lineJoin="round";ctx.beginPath();ctx.moveTo(x-s*0.45,y-s*0.5);ctx.lineTo(x+s*0.9,y-s*0.5);ctx.lineTo(x+s*0.45,y+s*0.5);ctx.lineTo(x-s*0.9,y+s*0.5);ctx.closePath();ctx.stroke();ctx.restore();}
// an element of the model, with a requirement's glyph where archEl puts its own
function d9_el(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const own=kind==="requirement";archEl(ctx,x,y,w,h,name,col,own?"none":kind,o);
  if(own){const gs=o.gs||13;withA(ctx,a,()=>d9_reqGlyph(ctx,x+w-gs-13,y+gs+9,gs,col));}}
// A data rule, as the series draws one from here on: dark glass with motivation's purple edge, ArchiMate's requirement glyph, a
// stripe in the colour of the side it belongs to, and its id in a monospaced kicker. o.p writes its words; o.hi lights it; o.ink: its
// words' colour; o.deco: drawn small on purpose. Returns its height.
function d9_rule(ctx,x,y,w,id,text,side,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||30,ls=wrapT(ctx,text,0,0,w-76,{size:sz,w:700,measure:true}),h=86+ls.length*sz*1.25;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,MOT,{glow:14+14*(o.hi||0),ea:0.85,fill:"rgba(9,8,22,0.95)"});
    if(side){ctx.fillStyle=rgba(side,0.95);rr(ctx,x+9,y+14,7,h-28,3.5);ctx.fill();}
    d9_reqGlyph(ctx,x+w-36,y+36,16,MOT);T(ctx,"data rule"+(id?" · "+id:""),x+34,y+46,{f:"mono",w:500,size:28,color:rgba(MOT,1),deco:o.deco});
    let left=text.length*(o.p==null?1:o.p);ls.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;T(ctx,s_,x+34,y+90+i*sz*1.25,{w:700,size:sz,color:o.ink||rgba(INK,0.97),deco:o.deco});});});return h;}
// The rule in a set form: its kicker, then a row for each part, a label in mono and its value. rows: [label, value, colour, kind];
// kind "owner" puts ArchiMate's actor before the value. o.r[i] (0..1) brings in row i; o.hiRow lights one; o.tick: the owner's
// gold tick. Returns its height.
function d9_ruleForm(ctx,x,y,w,id,rows,o){o=o||{};const a=o.a==null?1:o.a,side=o.side||D9_RET,rh=o.rh||100,h=104+rows.length*rh;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,MOT,{glow:14+14*(o.hi||0),ea:0.85,fill:"rgba(9,8,22,0.96)"});ctx.fillStyle=rgba(side,0.95);rr(ctx,x+9,y+16,7,h-32,3.5);ctx.fill();
    d9_reqGlyph(ctx,x+w-40,y+42,18,MOT);T(ctx,"data rule · "+id,x+36,y+60,{f:"mono",w:500,size:32,color:rgba(MOT,1)});
    rows.forEach(([lab,val,col,kind],i)=>{const q=o.r?clamp(o.r[i]||0,0,1):1;if(q<=0.01)return;const ry=y+92+i*rh;withA(ctx,q,()=>{
      if(o.hiRow===i){ctx.save();ctx.fillStyle=rgba(col,0.1);rr(ctx,x+22,ry+6,w-44,rh-10,10);ctx.fill();ctx.restore();}
      ctx.strokeStyle="rgba(200,186,255,0.16)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+30,ry);ctx.lineTo(x+w-24,ry);ctx.stroke();
      T(ctx,lab,x+36,ry+38,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});let vx=x+36;if(kind==="owner"){archGlyph(ctx,"actor",vx+12,ry+70,13,col);vx+=36;}
      T(ctx,val,vx,ry+80,{w:700,size:30,color:rgba(col,1)});});});
    if(o.tick>0.01)kt_gtick(ctx,x+w-46,y+h-46,22,o.tick);});return h;}
// a bill, as day one showed it: o.amount, o.note, o.bad (0..1) flags it wrong; o.stamp: a word stamped across it, o.st (0..1), in
// o.stampCol; o.was: the amount it replaces, struck through as o.wa goes to 1
function d9_bill(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,236,18,[200,210,230],{glow:12+14*(o.hi||0),ea:0.7,fill:"rgba(236,240,246,0.97)"});
  T(ctx,"Your bill",x+26,y+48,{w:800,size:30,color:"rgba(40,44,56,1)"});T(ctx,"$"+(o.amount||"412.80"),x+26,y+116,{w:800,size:52,color:rgba(o.good?[40,130,70]:o.bad?[200,50,50]:[40,44,56],1)});
  if(o.was&&o.wa>0.01)withA(ctx,o.wa,()=>{const ww=tw(ctx,"$"+o.was,34,700),wx=x+w-26-ww;T(ctx,"$"+o.was,wx,y+110,{w:700,size:34,color:"rgba(110,116,128,1)"});ctx.save();ctx.strokeStyle="rgba(200,50,50,0.9)";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(wx-4,y+98);ctx.lineTo(wx-4+(ww+8)*clamp(o.wa*1.5-0.5,0,1),y+98);ctx.stroke();ctx.restore();});
  T(ctx,o.note||"an estimated reading",x+26,y+162,{w:600,size:28,color:"rgba(90,96,110,1)"});if(o.bad)withA(ctx,o.bad,()=>tag(ctx,x+26,y+204,"wrong",BAD,{size:28}));
  if(o.stamp&&o.st>0.01)withA(ctx,clamp(o.st*1.4,0,1),()=>{const k=1+0.5*(1-ease(clamp(o.st,0,1)));ctx.save();ctx.translate(x+w-156,y+202);ctx.rotate(-0.1);ctx.scale(k,k);const sw=tw(ctx,o.stamp,30,800)+36;
    const sc_=o.stampCol||[200,50,50];ctx.strokeStyle=rgba(sc_,0.9);ctx.lineWidth=4;rr(ctx,-sw/2,-28,sw,56,8);ctx.stroke();T(ctx,o.stamp,0,11,{w:800,size:30,align:"center",color:rgba(sc_,0.95)});ctx.restore();});});}

/* ---------- the household behind the bill ---------- */
// June, day by day: what they used (units a day). Away from the 8th to the 28th, three weeks; last June's same days, from which the
// bill estimated them
const D9_USE=[21.4,23.1,20.2,24.6,22.3,21.0,23.8, 1.4,1.1,1.6,1.2,1.3,1.0,1.5,1.2,1.4,1.1,1.3,1.6,1.2,1.0,1.4,1.3,1.1,1.5,1.2,1.3,1.4, 22.6,21.7];
const D9_LAST=[0,0,0,0,0,0,0, 23.2,22.4,24.8,21.9,23.6,25.1,22.7,24.0,23.3,22.1,24.6,23.9,21.8,22.9,24.4,23.1,22.5,24.9,23.7,22.2,23.4, 0,0];
const D9_AWAY=[7,27];
// a house on paper, drawn in marker, with its smart meter on the outside wall: o.lit lights its windows (someone's home); o.sig (0..1)
// the meter's signal, sending readings; o.off (0..1) crosses it out
function d9_house(ctx,cx,cy,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,cx-180,cy-150,360,300,{rot:-0.008,plain:true});
  marker(ctx,[[cx-90,cy-30],[cx-90,cy+80],[cx+90,cy+80],[cx+90,cy-30]],1,{lw:3.4,seed:3});marker(ctx,[[cx-114,cy-24],[cx,cy-112],[cx+114,cy-24]],1,{lw:3.4,seed:4});
  const lit=o.lit==null?1:o.lit;[[cx-70,cy-6],[cx+2,cy-6]].forEach(([wx,wy])=>{ctx.fillStyle="rgba(40,40,48,0.88)";ctx.fillRect(wx,wy,40,32);if(lit>0.01){ctx.fillStyle=rgba([255,206,120],0.9*lit);ctx.fillRect(wx+3,wy+3,34,26);}});
  ctx.fillStyle="rgba(40,40,48,0.88)";ctx.fillRect(cx-14,cy+36,28,44);
  // the meter, and its signal
  const mx=cx+68,my=cy+52,sig=o.sig||0;ctx.save();if(sig>0)glow(ctx,mx,my,40,D9_NET,0.5*sig);ctx.fillStyle=rgba(mix([210,214,220],D9_NET,sig*0.5),1);rr(ctx,mx-10,my-14,20,28,4);ctx.fill();ctx.strokeStyle="rgba(40,40,48,0.9)";ctx.lineWidth=2;rr(ctx,mx-10,my-14,20,28,4);ctx.stroke();ctx.restore();
  [14,24,34].forEach((r,i)=>{const v=sig*(0.35+0.65*(0.5+0.5*Math.sin(t*5-i*1.1)));if(v<=0.02)return;ctx.save();ctx.strokeStyle=rgba(mix(D9_NET,[30,60,140],0.35),v);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.arc(mx,my-24,r,-Math.PI*0.78,-Math.PI*0.22);ctx.stroke();ctx.restore();});
  if(o.off>0.01)cross_(ctx,mx+6,my-48,34,[200,56,48],o.off);
  T(ctx,"the household",cx,cy+128,{w:800,size:30,align:"center",color:rgba(INKD,0.92)});});}
// where a day's bar sits on the June chart: [x of its centre, the baseline]
function d9_juneAt(x,y,w,h,i){return[x+50+i*((w-80)/30),y+h-56];}
// June on paper, as a bar a day. o.p grows the days they were home; o.away (0..1) marks the three weeks away; o.gap (0..1) says no
// readings came; o.est (0..1) raises last June's days, dashed, as the estimate; o.act[i] (0..1) each away day's actual reading
function d9_june(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:0.006,plain:true});
  T(ctx,"June",x+30,y+52,{w:800,size:34,color:"rgba(52,48,46,0.95)"});const k=5.0,bw=13,[,by]=d9_juneAt(x,y,w,h,0),aw=o.away||0;
  ctx.strokeStyle="rgba(52,48,46,0.6)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+30,by);ctx.lineTo(x+w-24,by);ctx.stroke();
  [0,7,14,21,29].forEach(i=>T(ctx,String(i+1),d9_juneAt(x,y,w,h,i)[0],by+26,{w:600,size:20,align:"center",color:"rgba(52,48,46,0.7)",deco:1}));
  // the weeks away, bracketed
  if(aw>0.01)withA(ctx,aw,()=>{const xa=d9_juneAt(x,y,w,h,D9_AWAY[0])[0]-10,xb=d9_juneAt(x,y,w,h,D9_AWAY[1])[0]+10,yb=y+84;ctx.fillStyle="rgba(120,140,190,0.10)";ctx.fillRect(xa,yb,xb-xa,by-yb);
    marker(ctx,[[xa,yb+14],[xa,yb],[lerp(xa,xb,ease(aw)),yb]],1,{lw:2.6,col:"rgba(52,60,110,0.85)",seed:7});if(aw>0.9)marker(ctx,[[xb,yb],[xb,yb+14]],1,{lw:2.6,col:"rgba(52,60,110,0.85)",seed:8});
    d9_case(ctx,(xa+xb)/2-150,yb-26,0.9);T(ctx,"away, three weeks",(xa+xb)/2-118,yb-16,{w:800,size:28,color:"rgba(52,60,110,0.95)"});});
  for(let i=0;i<30;i++){const[bx]=d9_juneAt(x,y,w,h,i),away=i>=D9_AWAY[0]&&i<=D9_AWAY[1];
    if(!away){const q=clamp((o.p||0)*34-i,0,1);if(q>0){const bh=D9_USE[i]*k*ease(q);ctx.fillStyle="rgba(52,48,46,0.82)";ctx.fillRect(bx-bw/2,by-bh,bw,bh);}continue;}
    const e=clamp((o.est||0)*26-(i-D9_AWAY[0]),0,1);if(e>0){const bh=D9_LAST[i]*k*ease(e);ctx.save();ctx.fillStyle="rgba(214,150,60,0.20)";ctx.fillRect(bx-bw/2,by-bh,bw,bh);ctx.setLineDash([5,4]);ctx.strokeStyle="rgba(190,112,26,0.95)";ctx.lineWidth=2;ctx.strokeRect(bx-bw/2,by-bh,bw,bh);ctx.restore();}
    const g=(o.gap||0)*(1-e);if(g>0.01){ctx.save();ctx.setLineDash([3,4]);ctx.strokeStyle=rgba([180,60,50],0.8*g);ctx.lineWidth=2;ctx.strokeRect(bx-bw/2,by-10,bw,10);ctx.restore();}
    const q=o.act?clamp(o.act[i-D9_AWAY[0]]||0,0,1):0;if(q>0){const bh=D9_USE[i]*k*ease(q);glow(ctx,bx,by-bh,12,[60,150,90],0.5*q*(1-q));ctx.fillStyle="rgba(40,120,70,0.95)";ctx.fillRect(bx-bw/2,by-bh,bw,bh);}}
  const mid=(d9_juneAt(x,y,w,h,D9_AWAY[0])[0]+d9_juneAt(x,y,w,h,D9_AWAY[1])[0])/2,lab=(s,c,yy,v)=>{if(v<=0.01)return;withA(ctx,v,()=>{const tw_=tw(ctx,s,28,800)+24;ctx.fillStyle="rgba(244,238,224,0.94)";ctx.fillRect(mid-tw_/2,yy-30,tw_,40);T(ctx,s,mid,yy,{w:800,size:28,align:"center",color:c});});};
  lab("no readings",rgba([180,60,50],1),by-24,(o.gap||0)*(1-(o.est||0)));lab("estimated from last year",rgba([160,92,18],1),by-142,o.estL||0);lab("actual: almost nothing",rgba([40,120,70],1),by-36,o.actL||0);});}
// a suitcase, drawn small: away from home
function d9_case(ctx,x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle="rgba(52,60,110,0.9)";ctx.lineWidth=2.6;rr(ctx,-18,-12,36,26,4);ctx.stroke();ctx.beginPath();ctx.moveTo(-7,-12);ctx.lineTo(-7,-18);ctx.lineTo(7,-18);ctx.lineTo(7,-12);ctx.stroke();ctx.restore();}

/* ---------- the script on the wall ---------- */
// the script's code, as texture
const D9_CODE=["-- re-bill estimates that have an actual","select e.reading_id, e.point, e.day","  from readings e","  join readings a on a.point = e.point","   and a.day = e.day","   and a.kind = 'actual'"," where e.kind = 'estimate'","insert into billing_queue_old"];
// A script in a dark window: its name, a moon (it runs at night), its code; o.scan (0..1) runs down its lines; o.hi lights it; o.stop
// (0..1) the yellow note that says it was a stopgap
function d9_script(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,TECH,{glow:12+16*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.96)"});
  ctx.fillStyle="rgba(120,200,255,0.10)";rr(ctx,x+2,y+2,w-4,54,14);ctx.fill();T(ctx,o.name||"nightly script",x+24,y+38,{f:"mono",w:500,size:28,color:rgba(TECH,1)});d9_moon(ctx,x+w-34,y+29,13,TECH,1);
  const lh=Math.min(26,(h-76)/D9_CODE.length);D9_CODE.forEach((l,i)=>{const yy=y+84+i*lh,sc=o.scan==null?-1:o.scan*D9_CODE.length;if(sc>=0&&Math.abs(sc-i-0.5)<0.9){ctx.fillStyle="rgba(120,200,255,0.16)";ctx.fillRect(x+12,yy-lh+6,w-24,lh);}
    T(ctx,l,x+24,yy,{f:"mono",w:500,size:Math.min(18,lh*0.72),color:rgba(i===0?[150,170,150]:SOFT,0.85),deco:1});});
  if(o.stop>0.01){const q=clamp(o.stop,0,1),k=1+0.14*(1-ease(q));ctx.save();ctx.translate(x+w+14,y-4);ctx.scale(k,k);sticky(ctx,0,0,190,70,"stopgap",{col:NOTEC[0],size:30,rot:0.08,a:q});ctx.restore();}});}
// a moon, for every night
function d9_moon(ctx,x,y,r,col,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.globalCompositeOperation="destination-out";ctx.beginPath();ctx.arc(x+r*0.5,y-r*0.3,r*0.86,0,TAU);ctx.fill();ctx.restore();});}
// meter readings, as rows: [point, day, kind]; o.hi[i] lights a row; o.pairs: [estimate row, actual row] linked by a bracket, o.pp (0..1)
const D9_ROWS=[["point 4417","12 Jun","estimate"],["point 4417","12 Jun","actual"],["point 2093","14 Jun","estimate"],["point 7731","14 Jun","estimate"],["point 7731","14 Jun","actual"]];
function d9_readings(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,rh=56,h=86+D9_ROWS.length*rh;if(a<=0.01)return h;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,D9_NET,{glow:12,ea:0.8,fill:"rgba(6,10,22,0.95)"});
  dbGlyph(ctx,x+36,y+44,D9_NET,0.7);T(ctx,"meter readings",x+64,y+52,{w:800,size:30,color:rgba(D9_NET,1)});
  D9_ROWS.forEach(([pt,day,kind],i)=>{const yy=y+82+i*rh,hi=o.hi?o.hi[i]||0:0;if(hi>0.01){ctx.fillStyle=rgba(kind==="actual"?D9_OK:[255,196,110],0.16*hi);rr(ctx,x+12,yy,w-24,rh-8,8);ctx.fill();}
    T(ctx,pt,x+28,yy+34,{f:"mono",w:500,size:20,color:rgba(SOFT,0.8),deco:1});T(ctx,day,x+178,yy+34,{f:"mono",w:500,size:20,color:rgba(SOFT,0.8),deco:1});
    T(ctx,kind,x+w-28,yy+36,{f:"mono",w:500,size:28,align:"right",color:rgba(kind==="actual"?D9_OK:[255,196,110],1)});});
  (o.pairs||[]).forEach(([e,b],k)=>{const q=o.pp?clamp(o.pp[k]||0,0,1):1;if(q<=0)return;const y0=y+82+e*rh+24,y1=y+82+b*rh+24,bx=x+w+14;ctx.save();ctx.strokeStyle=rgba([255,220,140],0.9);ctx.lineWidth=2.5;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(bx-10,y0);ctx.lineTo(bx,y0);ctx.lineTo(bx,lerp(y0,y1,ease(q)));if(q>0.95)ctx.lineTo(bx-10,y1);ctx.stroke();ctx.restore();});});return h;}
// a queue of bills to be corrected: a tray, its bills stacked, o.n of them; o.dead (0..1) greys it: nothing reads it
function d9_queue(ctx,x,y,w,h,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const dead=o.dead||0,col=mix(D9_RET,[130,130,140],dead*0.7);withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:10+12*(o.hi||0),ea:0.8,fill:"rgba(14,8,14,0.95)"});
  T(ctx,name,x+28,y+50,{w:800,size:30,color:rgba(col,1)});const n=Math.min(14,o.n||0);for(let i=0;i<n;i++){const cx=x+62+(i%7)*24,cy=y+118-Math.floor(i/7)*16-(i%7)*2;ctx.save();ctx.translate(cx,cy);ctx.rotate((hash(i,930)-0.5)*0.2);
    ctx.fillStyle=rgba(mix([236,240,246],[150,150,156],dead*0.6),0.95);ctx.fillRect(-26,-17,52,34);ctx.fillStyle="rgba(200,50,50,0.7)";ctx.fillRect(-20,-9,22,4);ctx.restore();}
  if(o.count)withA(ctx,o.cA==null?1:o.cA,()=>{T(ctx,o.count,x+w-30,y+h-66,{w:800,size:64,align:"right",color:rgba(mix([255,120,110],INK,0.15),1)});T(ctx,o.what||"bills",x+w-30,y+h-20,{w:700,size:28,align:"right",color:rgba(SOFT,1)});});});}

/* ---------- five places, no home ---------- */
// The rule, found written five ways: [kind, title, how it's written there]. The regulator's code says why; the rest each say how.
const D9_DOCS=[["script","nightly script","re-bill when an actual arrives"],["code","the regulator's retail code","A bill must reflect actual readings."],
  ["settings","meter system settings","replace estimates after 2 days"],["notes","billing team's notes","correct it on the next bill"],["sheet","complaints spreadsheet","refund if the customer asks"]];
// one of them, drawn as what it is: a script, a code of practice, a settings screen, a page of notes, a spreadsheet; o.hi lights it
function d9_doc(ctx,kind,x,y,w,h,title,line,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot||0);ctx.translate(-w/2,-h/2);
  const hi=o.hi||0;if(hi>0.01){ctx.save();ctx.shadowColor=rgba(o.hiCol||TRUST,0.9*hi);ctx.shadowBlur=26*hi;ctx.strokeStyle=rgba(o.hiCol||TRUST,0.9*hi);ctx.lineWidth=4;rr(ctx,-7,-7,w+14,h+14,14);ctx.stroke();ctx.restore();}
  const dark=kind==="script"||kind==="settings",ink=dark?rgba(INK,0.96):"rgba(44,42,46,0.95)",tl=wrapT(ctx,title,0,0,w-(kind==="script"?84:kind==="notes"?60:44),{size:28,w:kind==="script"?500:800,f:kind==="script"?"mono":undefined,measure:true}),th=24+tl.length*32;
  if(dark){glass(ctx,0,0,w,h,14,kind==="script"?TECH:APL,{glow:10,ea:0.8,fill:"rgba(6,10,20,0.96)"});ctx.fillStyle="rgba(120,200,255,0.10)";rr(ctx,2,2,w-4,th+6,12);ctx.fill();}
  else{ctx.save();ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=14;ctx.shadowOffsetY=5;ctx.fillStyle=kind==="notes"?"#f3ecd2":kind==="sheet"?"#f4f6f2":"#efe8da";ctx.fillRect(0,0,w,h);ctx.restore();}
  ctx.save();rr(ctx,0,0,w,h,14);ctx.clip();const TT=(col,x0,o2)=>tl.forEach((l,i)=>T(ctx,l,x0,36+i*32,Object.assign({w:800,size:28,color:col},o2||{})));
  if(kind==="script"){TT(rgba(TECH,1),22,{f:"mono",w:500});d9_moon(ctx,w-30,27,11,TECH,1);[0,1,2].forEach(i=>T(ctx,D9_CODE[i+1],22,th+30+i*22,{f:"mono",w:500,size:16,color:rgba(SOFT,0.7),deco:1}));}
  if(kind==="settings"){TT(rgba(APL,1),22);
}
  if(kind==="code"){TT("rgba(70,52,110,1)",22);ctx.strokeStyle="rgba(70,52,110,0.5)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(22,th+4);ctx.lineTo(w-22,th+4);ctx.stroke();
    T(ctx,"§ 21",w-22,th+36,{f:"mono",w:500,size:22,align:"right",color:"rgba(70,52,110,0.8)",deco:1});ctx.strokeStyle="rgba(120,96,180,0.75)";ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(w-40,h-36,20,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(w-40,h-36,13,0,TAU);ctx.stroke();}
  if(kind==="notes"){ctx.strokeStyle="rgba(90,130,190,0.25)";ctx.lineWidth=1;for(let yy=70;yy<h-8;yy+=30){ctx.beginPath();ctx.moveTo(10,yy);ctx.lineTo(w-10,yy);ctx.stroke();}ctx.strokeStyle="rgba(200,70,70,0.4)";ctx.beginPath();ctx.moveTo(30,0);ctx.lineTo(30,h);ctx.stroke();
    TT("rgba(40,60,120,0.95)",42);}
  if(kind==="sheet"){ctx.fillStyle="rgba(60,150,90,0.85)";ctx.fillRect(0,0,w,th+6);TT("#fff",18);ctx.strokeStyle="rgba(60,90,70,0.25)";ctx.lineWidth=1;
    for(let c=1;c<4;c++){ctx.beginPath();ctx.moveTo(c*w/4,th+6);ctx.lineTo(c*w/4,h);ctx.stroke();}for(let yy=th+36;yy<h;yy+=30){ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(w,yy);ctx.stroke();}}
  // how the rule is written there, readable
  const ly=th+(kind==="code"?70:kind==="sheet"?62:kind==="notes"?58:kind==="settings"?48:96),ls=wrapT(ctx,line,0,0,w-(kind==="notes"?64:44),{size:28,w:700,measure:true});
  if(kind==="sheet"){ctx.fillStyle="rgba(255,236,150,0.8)";ctx.fillRect(4,ly-32,w-8,ls.length*32+12);}
  if(kind==="settings"){ctx.fillStyle="rgba(140,214,255,0.10)";rr(ctx,14,ly-36,w-28,ls.length*32+18,8);ctx.fill();const tx=w-62,ty=ly+ls.length*32+30;ctx.fillStyle=rgba(D9_OK,0.9);rr(ctx,tx,ty-14,44,26,13);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(tx+31,ty-1,10,0,TAU);ctx.fill();}
  ls.forEach((l,i)=>T(ctx,l,kind==="notes"?42:22,ly+i*32,{w:700,size:28,color:kind==="notes"?"rgba(30,50,120,0.95)":ink}));
  ctx.restore();ctx.restore();});}
// a dashed place where something should be, empty: with a question mark, or a few words
function d9_slot(ctx,x,y,w,h,col,a,label){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(col,0.8);ctx.lineWidth=2.5;rr(ctx,x,y,w,h,12);ctx.stroke();ctx.restore();
  if(label)T(ctx,label,x+w/2,y+h/2+11,{w:700,size:30,align:"center",color:rgba(col,0.95)});else T(ctx,"?",x+w/2,y+h/2+18,{w:800,size:52,align:"center",color:rgba(col,0.95)});});}
// Tartu's register, small, with roads from the offices that ask it: once only
function d9_regMini(ctx,cx,cy,t,a){if(a<=0.01)return;withA(ctx,a,()=>{const R=[[-150,-90],[150,-90],[-180,40],[180,40]];R.forEach(([dx,dy],i)=>{d9_road(ctx,[[cx+dx,cy+dy],[cx+dx*0.5,cy+dy*0.5],[cx,cy]],1,{t,lw:0.5,ask:((t*0.4+i*0.25)%1)});d9_officeS(ctx,cx+dx,cy+dy,{});});
  glass(ctx,cx-118,cy-40,236,80,16,D9_TAR,{glow:16,ea:0.85,fill:"rgba(8,14,30,0.95)"});dbGlyph(ctx,cx-82,cy+4,D9_TAR,0.7);T(ctx,"one register",cx-54,cy+12,{w:700,size:28,color:rgba(INK,0.96)});});}

/* ---------- where a rule comes from, and what it's about ---------- */
// an influence, as ArchiMate draws it: a dashed line with an open arrowhead, drawn up to p
function d9_infl(ctx,x0,y0,x1,y1,col,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{const q=ease(clamp(p,0,1)),xe=lerp(x0,x1,q),ye=lerp(y0,y1,q);ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.6;ctx.setLineDash([9,7]);
  ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);if(q>0.98){const an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-Math.cos(an-0.45)*16,y1-Math.sin(an-0.45)*16);ctx.lineTo(x1,y1);ctx.lineTo(x1-Math.cos(an+0.45)*16,y1-Math.sin(an+0.45)*16);ctx.stroke();}ctx.restore();});}
// a realisation, as ArchiMate draws it: a dotted line with a hollow triangle at the end it realises, drawn up to p
function d9_real(ctx,x0,y0,x1,y1,col,p,a){if(p<=0||a<=0.01)return;withA(ctx,a,()=>{const q=ease(clamp(p,0,1)),an=Math.atan2(y1-y0,x1-x0),L=Math.hypot(x1-x0,y1-y0),xe=x0+Math.cos(an)*Math.max(0,L*q-18),ye=y0+Math.sin(an)*Math.max(0,L*q-18);
  ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2.6;ctx.setLineDash([3,6]);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);
  if(q>0.98){ctx.fillStyle="rgba(9,8,22,1)";ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-Math.cos(an-0.5)*20,y1-Math.sin(an-0.5)*20);ctx.lineTo(x1-Math.cos(an+0.5)*20,y1-Math.sin(an+0.5)*20);ctx.closePath();ctx.fill();ctx.stroke();}ctx.restore();});}
// a clock, for a service level
function d9_clock(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=Math.max(1.6,s*0.12);ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,s*0.7,0,TAU);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-s*0.42);ctx.moveTo(x,y);ctx.lineTo(x+s*0.32,y+s*0.1);ctx.stroke();ctx.restore();}
// a kind of reason, as a chip: o.kind "driver", "principle" or "clock", in motivation's purple
function d9_why(ctx,cx,cy,label,kind,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const w=tw(ctx,label,30,700)+86,h=58;glass(ctx,cx-w/2,cy-h/2,w,h,h/2,MOT,{glow:10+12*(o.hi||0),ea:0.85,fill:"rgba(12,10,26,0.94)"});
  if(kind==="clock")d9_clock(ctx,cx-w/2+34,cy,22,MOT);else archGlyph(ctx,kind,cx-w/2+34,cy,15,MOT);T(ctx,label,cx-w/2+62,cy+11,{w:700,size:30,color:rgba(mix(MOT,INK,0.4),1)});});}
// a fact, as a statement about concepts: glass, with a mono kicker
function d9_fact(ctx,x,y,w,text,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const ls=wrapT(ctx,text,0,0,w-48,{size:28,w:700,measure:true}),h=70+ls.length*34;withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,[190,200,220],{glow:10+12*(o.hi||0),ea:0.75,fill:"rgba(8,12,24,0.94)"});
  T(ctx,"fact",x+24,y+36,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});ls.forEach((l,i)=>T(ctx,l,x+24,y+76+i*34,{w:700,size:28,color:rgba(INK,0.95)}));});return h;}
// a concept, as a term the business uses: a chip with a small book
function d9_term(ctx,cx,cy,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col=o.col||[214,226,240];withA(ctx,a,()=>{const w=tw(ctx,label,30,800)+82,h=60;glass(ctx,cx-w/2,cy-h/2,w,h,h/2,col,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(10,12,22,0.94)"});
  ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=2;const bx=cx-w/2+32,by=cy;ctx.beginPath();ctx.moveTo(bx,by-11);ctx.quadraticCurveTo(bx-8,by-14,bx-14,by-11);ctx.lineTo(bx-14,by+11);ctx.quadraticCurveTo(bx-8,by+8,bx,by+11);ctx.quadraticCurveTo(bx+8,by+8,bx+14,by+11);ctx.lineTo(bx+14,by-11);ctx.quadraticCurveTo(bx+8,by-14,bx,by-11);ctx.lineTo(bx,by+11);ctx.stroke();ctx.restore();
  T(ctx,label,cx-w/2+58,cy+11,{w:800,size:30,color:rgba(INK,0.97),deco:o.deco});});}
// a word from the industry's model, beside the utility's own: a mono kicker and the term
function d9_ind(ctx,cx,cy,term,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const k="industry model",kw=tw(ctx,k,28,500,"mono"),w=kw+tw(ctx,term,30,800)+64,h=56,col=[176,196,222];glass(ctx,cx-w/2,cy-h/2,w,h,12,col,{glow:8+12*(o.hi||0),ea:0.75,fill:"rgba(10,14,24,0.94)"});
  T(ctx,k,cx-w/2+20,cy+10,{f:"mono",w:500,size:28,color:rgba(col,0.9)});T(ctx,term,cx-w/2+kw+44,cy+11,{w:800,size:30,color:rgba(INK,0.97)});});}
// a data object, as ArchiMate draws it, in the information layer's peach: its name, and o.sub (0..1) a second line
function d9_obj(ctx,x,y,w,h,name,sub,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,8,INF,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(16,10,8,0.95)"});ctx.fillStyle=rgba(INF,0.12+0.1*(o.hi||0));rr(ctx,x,y,w,h,8);ctx.fill();
  archGlyph(ctx,"object",x+w-28,y+24,13,INF);const sv=sub?clamp(o.sv==null?1:o.sv,0,1):0;T(ctx,name,x+28,y+(sv>0.01?52:h/2+11),{w:800,size:32,color:rgba(INK,0.97)});
  if(sv>0.01)withA(ctx,sv,()=>T(ctx,sub,x+28,y+98,{w:700,size:28,color:rgba(mix(INF,INK,0.4),1)}));});}

/* ---------- the step, and what it expects ---------- */
// A stage of a value stream, as ArchiMate draws one: a chevron, in strategy's colour. o.first: flat at the back; o.lx, o.ly: where
// its name sits (default the middle); o.hi lights it.
function d9_chev(ctx,x,y,w,h,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=h*0.32,sz=o.size||34;
  const path=()=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w-n,y);ctx.lineTo(x+w,y+h/2);ctx.lineTo(x+w-n,y+h);ctx.lineTo(x,y+h);if(!o.first)ctx.lineTo(x+n,y+h/2);ctx.closePath();};
  withA(ctx,a,()=>{ctx.save();ctx.shadowColor=rgba(STR,0.6);ctx.shadowBlur=16+16*(o.hi||0);path();ctx.fillStyle="rgba(7,12,24,0.95)";ctx.fill();ctx.restore();
    path();ctx.fillStyle=rgba(STR,0.13+0.1*(o.hi||0));ctx.fill();ctx.strokeStyle=rgba(STR,0.9);ctx.lineWidth=2.4+1.5*(o.hi||0);path();ctx.stroke();
    archGlyph(ctx,"stream",x+(o.first?32:n+24),y+28,12,STR);
    T(ctx,label,o.lx==null?x+(o.first?w/2-n/4:w/2+n/4):o.lx,o.ly==null?y+h/2+sz*0.36:o.ly,{w:800,size:sz,align:"center",color:rgba(INK,0.96),deco:o.deco});});}
// a data rule folded to its id, for when it's there but isn't the subject; returns its width
function d9_rulePill(ctx,cx,cy,id,side,o){o=o||{};const a=o.a==null?1:o.a,s="data rule · "+id,w=tw(ctx,s,28,500,"mono")+100,h=58;if(a<=0.01)return w;withA(ctx,a,()=>{
  glass(ctx,cx-w/2,cy-h/2,w,h,14,MOT,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(9,8,22,0.95)"});ctx.fillStyle=rgba(side,0.95);rr(ctx,cx-w/2+9,cy-h/2+12,6,h-24,3);ctx.fill();
  T(ctx,s,cx-w/2+30,cy+10,{f:"mono",w:500,size:28,color:rgba(MOT,1),deco:o.deco});d9_reqGlyph(ctx,cx+w/2-36,cy,15,MOT);});return w;}
// the step's own steps, as business processes: an estimate, then replaced or explained; p brings them in, left to right
function d9_steps(ctx,x,cy,p,o){o=o||{};if(p<=0.01)return;let X=x;const q=i=>clamp(p*5-i,0,1),pill=(s,a)=>{const w=tw(ctx,s,28,700)+36;withA(ctx,a,()=>{glass(ctx,X,cy-23,w,46,23,BUS,{glow:8+12*(o.hi||0),ea:0.8,fill:"rgba(20,18,6,0.94)"});T(ctx,s,X+18,cy+10,{w:700,size:28,color:rgba(BUS,1)});});X+=w;};
  pill("estimate",q(0));withA(ctx,q(1),()=>{ctx.save();ctx.strokeStyle=rgba(BUS,0.9);ctx.lineWidth=2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(X+10,cy);ctx.lineTo(X+40,cy);ctx.moveTo(X+31,cy-8);ctx.lineTo(X+40,cy);ctx.lineTo(X+31,cy+8);ctx.stroke();ctx.restore();});X+=50;
  pill("replace",q(2));X+=14;withA(ctx,q(3),()=>T(ctx,"or",X,cy+10,{w:600,size:28,color:rgba(SOFT,0.95)}));X+=tw(ctx,"or",28,600)+14;pill("explain",q(4));}
// what a step expects of its data: the dimension and where it comes from in a mono kicker, then what's expected (o.p writes it).
// g: the source's glyph, "clock" (a service level), "process" (its steps) or "requirement" (a rule)
function d9_expect(ctx,x,y,w,h,dim,src,text,g,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,14,INF,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(16,10,8,0.95)"});
  ctx.fillStyle=rgba(INF,0.08+0.08*(o.hi||0));rr(ctx,x,y,w,h,14);ctx.fill();d9_src(ctx,g,x+48,y+h/2,o.gl==null?1:o.gl);
  T(ctx,dim,x+96,y+44,{f:"mono",w:600,size:28,color:rgba(INF,1)});T(ctx,"· "+src,x+96+tw(ctx,dim+" ",28,600,"mono"),y+44,{f:"mono",w:500,size:28,color:rgba(SOFT,0.95)});
  const s=o.p==null?text:text.slice(0,Math.round(text.length*clamp(o.p,0,1)));T(ctx,s,x+96,y+88,{w:700,size:30,color:rgba(INK,0.97)});});}
// a source's glyph: a service level's clock, a process, or a requirement
function d9_src(ctx,g,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{if(g==="clock")d9_clock(ctx,x,y,30,MOT);else if(g==="requirement")d9_reqGlyph(ctx,x,y,22,MOT);else archGlyph(ctx,"process",x,y,26,BUS);});}

/* ---------- written once, checked everywhere ---------- */
// The checks generated from retail's rule, as each tool writes them: [title, lines]. Its id stands out in purple wherever it appears.
const D9_GEN=[["dbt test",["data_tests:","  - rul_022_corrected_on_next_bill:","      config: {severity: error,","               meta: {rule_id: RUL-022}}"]],
  ["data contract · quality rule",["quality:","  - id: RUL-022","    dimension: consistency","    severity: error"]],
  ["shape for linked data",["ex:RUL-022 a sh:NodeShape ;","  sh:targetClass ex:Bill ;","  sh:sparql ex:correctedOnNextBill ;","  sh:severity sh:Violation ."]]];
// a padlock
function d9_lock(ctx,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.6,s*0.15);ctx.beginPath();ctx.arc(x,y-s*0.18,s*0.36,Math.PI,0);ctx.stroke();rr(ctx,x-s*0.55,y-s*0.18,s*1.1,s*0.78,s*0.12);ctx.fill();ctx.restore();}
// a line of code, in mono, with the rule's id in purple
function d9_code(ctx,s,x,y,col){const parts=s.split("RUL-022");let X=x;parts.forEach((p,i)=>{if(p){T(ctx,p,X,y,{f:"mono",w:500,size:28,color:col});X+=tw(ctx,p,28,500,"mono");}
  if(i<parts.length-1){T(ctx,"RUL-022",X,y,{f:"mono",w:700,size:28,color:rgba(MOT,1)});X+=tw(ctx,"RUL-022",28,700,"mono");}});}
// a check generated from a rule, as a card of code: its title, a padlock with "generated", and its lines (o.p types them); o.lock
// (0..1) reddens the padlock, for a hand that tries to edit it
function d9_gen(ctx,x,y,w,h,title,lines,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,TECH,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(6,10,20,0.96)"});
  T(ctx,title,x+30,y+48,{w:800,size:30,color:rgba(mix(TECH,INK,0.45),1)});const lc=mix([150,166,190],D9_RED,o.lock||0),gw=tw(ctx,"generated",28,500,"mono");
  if(o.lock>0.01)glow(ctx,x+w-gw-60,y+40,40,D9_RED,0.6*o.lock);d9_lock(ctx,x+w-gw-60,y+40,24,lc);T(ctx,"generated",x+w-gw-28,y+50,{f:"mono",w:500,size:28,color:rgba(lc,1)});
  let left=lines.join(" ").length*(o.p==null?1:clamp(o.p,0,1));lines.forEach((l,i)=>{const s_=l.slice(0,Math.max(0,Math.min(l.length,Math.round(left))));left-=l.length+1;if(s_)d9_code(ctx,s_,x+30,y+100+i*34,rgba(mix(TECH,INK,0.25),0.95));});});}
// a pencil, its tip at (x, y), lying down and to the right of it
function d9_pencil(ctx,x,y,s,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,y);ctx.rotate(0.72);ctx.scale(s,s);ctx.shadowColor="rgba(0,0,0,0.5)";ctx.shadowBlur=14;ctx.shadowOffsetY=6;
  ctx.fillStyle="#e9c46a";ctx.fillRect(30,-11,124,22);ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.fillStyle="#d4a64a";ctx.fillRect(30,3,124,8);ctx.fillStyle="#f1dcb4";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(30,-11);ctx.lineTo(30,11);ctx.closePath();ctx.fill();
  ctx.fillStyle="#3a3f4a";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(10,-3.7);ctx.lineTo(10,3.7);ctx.closePath();ctx.fill();ctx.fillStyle="#b8c0cc";ctx.fillRect(154,-11,16,22);ctx.fillStyle="#e79aa6";rr(ctx,170,-11,20,22,5);ctx.fill();ctx.restore();});}
// a result, round: a tick or a cross, in its colour
function d9_res(ctx,x,y,r,ok,col,a){if(a<=0.01)return;withA(ctx,a,()=>{glow(ctx,x,y,r*2.2,col,0.3);ctx.fillStyle="rgba(8,12,22,0.95)";ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ring(ctx,x,y,r,col,1,2.6);
  if(ok)tick_(ctx,x,y+1,r*1.2,col,1);else cross_(ctx,x,y,r*1.5,col,1);});}
// the sun, for a morning
function d9_sun(ctx,x,y,r,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.arc(x,y,r*0.42,0,TAU);ctx.fill();
  for(let i=0;i<8;i++){const an=i*TAU/8;ctx.beginPath();ctx.moveTo(x+Math.cos(an)*r*0.66,y+Math.sin(an)*r*0.66);ctx.lineTo(x+Math.cos(an)*r,y+Math.sin(an)*r);ctx.stroke();}ctx.restore();}
// a pill with a glyph and a label: kind "mail" (an envelope) or "team" (ArchiMate's actor); returns its width
function d9_pill(ctx,cx,cy,label,col,kind,o){o=o||{};const a=o.a==null?1:o.a,w=tw(ctx,label,30,700)+(kind?86:44),h=58;if(a<=0.01)return w;withA(ctx,a,()=>{glass(ctx,cx-w/2,cy-h/2,w,h,h/2,col,{glow:10+14*(o.hi||0),ea:0.85,fill:"rgba(10,12,22,0.94)"});
  const gx=cx-w/2+36;if(kind==="mail"){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.lineJoin="round";rr(ctx,gx-15,cy-11,30,22,3);ctx.stroke();ctx.beginPath();ctx.moveTo(gx-15,cy-10);ctx.lineTo(gx,cy+2);ctx.lineTo(gx+15,cy-10);ctx.stroke();ctx.restore();}
  else if(kind==="team")archGlyph(ctx,"actor",gx,cy-2,14,col);T(ctx,label,cx-w/2+(kind?64:22),cy+11,{w:700,size:30,color:rgba(col,1)});});return w;}

/* ---------- generally, an ontology ---------- */
// The concepts, as the map holds them: [id, label, x, y]; how they relate: [from, to, label, where the label sits]; the rules about
// them: [id, concept, x, y]. Then one bill, as facts: what was said about it, and the correction nobody said.
const D9_ON=[["cp","connection point",260,330],["rd","reading",820,330],["bl","bill",1360,330],["ac","actual reading",580,590],["es","estimate",1060,590],["nb","next bill",1360,590]];
const D9_OE=[["rd","cp","taken at","above"],["bl","rd","based on","above"],["ac","rd","is a","left"],["es","rd","is a","right"],["es","ac","replaced by","below"],["bl","nb","corrected on","left"]];
const D9_OR=[["RUL-020","rd",820,196],["RUL-021","es",1060,740],["RUL-022","nb",1640,470]];
// a concept's chip: its width, for edges to stop at
function d9_termW(ctx,label){return tw(ctx,label,30,800)+82;}
// a relation between two chips, as an arrow with its name, drawn up to p; o.dash for one nobody said
function d9_rel(ctx,A,B,label,side,p,o){o=o||{};if(p<=0)return;const a=o.a==null?1:o.a,col=o.col||[176,190,220];withA(ctx,a,()=>{const[ax,ay,aw]=A,[bx,by,bw]=B,dx=bx-ax,dy=by-ay,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
  const ex=(w_,u,v)=>{const tx=u===0?1e9:(w_/2+6)/Math.abs(u),ty=v===0?1e9:36/Math.abs(v);return Math.min(tx,ty);},s0=ex(aw,ux,uy),s1=ex(bw,ux,uy),x0=ax+ux*s0,y0=ay+uy*s0,x1=bx-ux*s1,y1=by-uy*s1,q=ease(clamp(p,0,1)),xe=lerp(x0,x1,q),ye=lerp(y0,y1,q);
  ctx.save();ctx.strokeStyle=rgba(col,0.9);ctx.lineWidth=2.6;ctx.lineCap="round";if(o.dash)ctx.setLineDash([10,8]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(xe,ye);ctx.stroke();ctx.setLineDash([]);
  if(q>0.98){const an=Math.atan2(y1-y0,x1-x0);ctx.beginPath();ctx.moveTo(x1-Math.cos(an-0.42)*16,y1-Math.sin(an-0.42)*16);ctx.lineTo(x1,y1);ctx.lineTo(x1-Math.cos(an+0.42)*16,y1-Math.sin(an+0.42)*16);ctx.stroke();}ctx.restore();
  const mx=(x0+x1)/2,my=(y0+y1)/2,la=clamp((p-0.5)*2,0,1);if(la>0)withA(ctx,la,()=>{const P={above:[mx,my-18,"center"],below:[mx,my+42,"center"],left:[mx-18,my+10,"right"],right:[mx+18,my+10,"left"]}[side];
    T(ctx,label,P[0],P[1],{w:700,size:28,align:P[2],color:rgba(mix(col,INK,0.35),1),deco:o.deco});});});}
// a fact about one thing: a chip in the information domain's peach, for an instance rather than a concept
function d9_inst(ctx,cx,cy,label,o){o=o||{};const a=o.a==null?1:o.a,w=tw(ctx,label,30,800)+56,h=60;if(a<=0.01)return w;withA(ctx,a,()=>{glass(ctx,cx-w/2,cy-h/2,w,h,12,INF,{glow:10+14*(o.hi||0),ea:0.85,fill:"rgba(16,10,8,0.95)"});
  ctx.fillStyle=rgba(INF,0.1+0.1*(o.hi||0));rr(ctx,cx-w/2,cy-h/2,w,h,12);ctx.fill();T(ctx,label,cx,cy+11,{w:800,size:30,align:"center",color:rgba(INK,0.97)});});return w;}
// a verdict: who's asked, the question, and the answer, with its mark ("?" unknown, or a cross)
function d9_verdict(ctx,x,y,w,h,who,q,ans,col,kind,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,16,col,{glow:12+16*(o.hi||0),ea:0.85,fill:"rgba(8,10,20,0.95)"});
  T(ctx,who,x+30,y+46,{f:"mono",w:600,size:28,color:rgba(col,1)});T(ctx,q,x+30,y+96,{w:700,size:30,color:rgba(INK,0.9)});
  const v=o.v==null?1:o.v;if(v>0.01)withA(ctx,v,()=>{const mx=x+w-60,my=y+h/2;if(kind==="?"){ctx.fillStyle="rgba(8,12,22,0.95)";ctx.beginPath();ctx.arc(mx,my,30,0,TAU);ctx.fill();ring(ctx,mx,my,30,col,1,2.6);T(ctx,"?",mx,my+12,{w:800,size:34,align:"center",color:rgba(col,1)});}
    else d9_res(ctx,mx,my,30,false,col,1);T(ctx,ans,mx-50,y+96,{w:800,size:34,align:"right",color:rgba(col,1)});});});}
// one of the map's views, as a row: its glyph, its name and what it holds; on the right, a small picture of it (texture, drawn small on
// purpose), except the ontology's, which is the graph itself, shrunk into place
function d9_view(ctx,x,y,w,h,title,sub,g,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const col={book:[214,226,240],object:INF,graph:[176,196,222],tick:TECH}[g];withA(ctx,a,()=>{
  glass(ctx,x,y,w,h,16,col,{glow:10+14*(o.hi||0),ea:0.8,fill:"rgba(8,11,20,0.95)"});const gx=x+52,gy=y+h/2;ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.lineJoin="round";
  if(g==="book"){ctx.beginPath();ctx.moveTo(gx,gy-16);ctx.quadraticCurveTo(gx-11,gy-20,gx-20,gy-16);ctx.lineTo(gx-20,gy+16);ctx.quadraticCurveTo(gx-11,gy+12,gx,gy+16);ctx.quadraticCurveTo(gx+11,gy+12,gx+20,gy+16);ctx.lineTo(gx+20,gy-16);ctx.quadraticCurveTo(gx+11,gy-20,gx,gy-16);ctx.lineTo(gx,gy+16);ctx.stroke();}
  else if(g==="object")archGlyph(ctx,"object",gx,gy,22,col);
  else if(g==="graph"){[[-16,-12],[16,-14],[0,14]].forEach(([dx,dy])=>{ctx.beginPath();ctx.arc(gx+dx,gy+dy,6,0,TAU);ctx.fill();});ctx.beginPath();ctx.moveTo(gx-16,gy-12);ctx.lineTo(gx+16,gy-14);ctx.lineTo(gx,gy+14);ctx.closePath();ctx.stroke();}
  else{ctx.beginPath();ctx.arc(gx,gy,18,0,TAU);ctx.stroke();ctx.restore();tick_(ctx,gx,gy+1,22,col,1);ctx.save();}
  ctx.restore();T(ctx,title,x+96,y+56,{w:800,size:34,color:rgba(INK,0.97)});T(ctx,sub,x+96,y+100,{w:600,size:28,color:rgba(mix(col,INK,0.3),0.95)});
  // the small picture
  const px=x+w-330,py=y+16,pw=300,ph=h-32;ctx.save();ctx.strokeStyle=rgba(col,0.35);ctx.lineWidth=1.5;rr(ctx,px,py,pw,ph,10);ctx.stroke();ctx.restore();
  if(g==="book")[["reading",0],["estimate",1],["bill",2]].forEach(([s_,i])=>{const yy=py+28+i*32;T(ctx,s_,px+20,yy,{w:800,size:16,color:rgba(INK,0.85),deco:1});ctx.fillStyle=rgba(col,0.35);ctx.fillRect(px+120,yy-6,150-i*24,4);});
  else if(g==="object")[[px+24,py+18],[px+164,py+36]].forEach(([bx,by],i)=>{ctx.strokeStyle=rgba(INF,0.8);ctx.lineWidth=1.6;ctx.strokeRect(bx,by,112,58);ctx.beginPath();ctx.moveTo(bx,by+18);ctx.lineTo(bx+112,by+18);ctx.stroke();T(ctx,i?"bill":"meter reading",bx+8,by+14,{w:700,size:12,color:rgba(INK,0.85),deco:1});});
  else if(g==="tick")[0,1,2].forEach(i=>{const yy=py+24+i*32;tick_(ctx,px+28,yy,16,i===2?D9_RED:D9_OK,1);ctx.fillStyle=rgba(col,0.35);ctx.fillRect(px+50,yy-2,200-i*30,4);});});}

/* ---------- back in Tartu ---------- */
// the 1,900 bills, found and corrected: the count as it rises (n), and a row of ticks
function d9_count(ctx,x,y,w,n,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,160,18,D9_OK,{glow:12+14*(o.hi||0),ea:0.8,fill:"rgba(8,16,12,0.95)"});
  T(ctx,Math.round(n).toLocaleString("en-US"),x+30,y+82,{w:800,size:64,color:rgba(D9_OK,1)});T(ctx,"bills found and corrected",x+30,y+128,{w:700,size:28,color:rgba(mix(D9_OK,INK,0.4),1)});
  const tk=o.tk||0;for(let i=0;i<5;i++){const q=clamp(tk*5-i,0,1);if(q>0)tick_(ctx,x+w-150+i*28,y+52,22,D9_OK,q);}});}
// Tartu, today, on a card: the register with the offices that ask it, the benefit paid and nobody asked twice. The small drawing is
// texture; the words are full size
function d9_tartuCard(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,D9_TAR,{glow:12+14*(o.hi||0),ea:0.8,fill:"rgba(8,14,30,0.95)"});
  const cx=x+110,cy=y+h/2+6,R=[[-70,-48],[70,-48],[-80,40],[80,40]];R.forEach(([dx,dy],i)=>{d9_road(ctx,[[cx+dx,cy+dy],[cx+dx*0.5,cy+dy*0.5],[cx,cy]],1,{t,lw:0.4,ask:((t*0.4+i*0.25)%1)});ctx.fillStyle="rgba(10,16,32,1)";ctx.beginPath();ctx.arc(cx+dx,cy+dy,13,0,TAU);ctx.fill();ring(ctx,cx+dx,cy+dy,13,D9_TAR,1,2);});
  glass(ctx,cx-34,cy-22,68,44,8,D9_TAR,{glow:10,ea:0.9,fill:"rgba(10,18,36,1)"});ctx.fillStyle=rgba(D9_TAR,0.6);for(let i=0;i<3;i++)ctx.fillRect(cx-22,cy-10+i*9,44,3);
  const tx=x+236;T(ctx,"Tartu · today",tx,y+52,{f:"mono",w:600,size:28,color:rgba(D9_TAR,1)});
  withA(ctx,o.paid||0,()=>{tick_(ctx,tx+14,y+98,24,D9_OK,1);T(ctx,"benefit paid",tx+40,y+108,{w:800,size:30,color:rgba(D9_OK,1)});});
  withA(ctx,o.once||0,()=>T(ctx,"nobody asked twice",tx,y+156,{w:700,size:30,color:rgba(D9_DAWN,1)}));});}
