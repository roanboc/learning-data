/* ===== Deleted means deleted: Kanesh, about 1900 BC =====
   The opening's places, painted once (AG_PLACES), in the module's night: a merchant's room in Kanesh (ddRoom), mud brick warm in the
   light of an oil lamp, a shelf of tablets on the right and the door on the left open to the night; a house in Ashur (ddAshur), its
   tablets in a niche under a small window's moonlight; and the road between them over bare hills (ddRoad). What moves is drawn live:
   the lamp's flame, the tablets, the envelope and the seal's band, the tin, the cloth, the scale and its silver, the caravan, the
   shards. A tablet is a picture made once and kept (dd_tabletPic): clay with rows of small wedge marks drawn as texture, never a real
   sign, and the seal's band is the film's own pattern, copied from no seal. The people of Kanesh are never drawn.
   Every top-level name starts with dd_ or DD_. */

const DD={clay:[178,128,86],clayHi:[226,184,138],clayLo:[98,64,42],env:[190,146,104],
  brick:[150,104,68],mortar:[96,64,42],plaster:[176,132,92],wood:[104,68,42],woodHi:[160,112,70],woodLo:[52,32,20],
  lamp:[255,196,128],flame:[255,214,150],night0:[5,14,18],night1:[14,36,42],hill:[9,24,28],
  tin:[132,138,140],silver:[214,220,224],cloth:[[150,58,48],[176,138,70],[70,86,118],[196,180,150]]};
// the room: the floor's far edge, the door, the lamp's flame, the shelf's four planks, and the table in front
const DD_ROOM={floor:742,door:[128,236,372,742],flame:[958,520],lamp:[930,552],niche:[850,430,1006,566],shelf:{x0:1066,x1:1764,rows:[322,452,582,712]},table:{x0:456,x1:1022,y:788}};
// the tablets on the shelf: [x, plank, size, kind (0 a tablet, 1 in its envelope), lean]; the story's tablet is DD_MINE on plank 1
const DD_SHELF=(()=>{const R=ag_rnd(41),L=[];DD_ROOM.shelf.rows.forEach((y,j)=>{let x=DD_ROOM.shelf.x0+52;while(x<DD_ROOM.shelf.x1-40){const s=0.42+R()*0.12;
  L.push([x,j,s,R()<0.3?1:0,(R()-0.5)*0.08]);x+=60+R()*34;}});return L;})();
const DD_MINE=[1490,452];   // where the story's tablet stands on the shelf

/* ---------------------------------------------------------------- light, shared by the places */
// a light map laid over a painted place: the ambient, a warm pool from the lamp and a cool one from the night, multiplied in
function dd_light(c,lights,amb){const L=mkCanvas(480,270),x=L.getContext("2d");x.fillStyle=rgba(amb,1);x.fillRect(0,0,480,270);x.globalCompositeOperation="lighter";
  for(const [lx,ly,r,col,a] of lights){const g=x.createRadialGradient(lx/4,ly/4,0,lx/4,ly/4,r/4);g.addColorStop(0,rgba(col,a));g.addColorStop(0.45,rgba(col,a*0.5));g.addColorStop(1,rgba(col,0));x.fillStyle=g;x.fillRect(0,0,480,270);}
  c.save();c.globalCompositeOperation="multiply";c.imageSmoothingEnabled=true;c.drawImage(L,0,0,480,270,0,0,W,H);c.restore();}
// grain in a surface: a small canvas of noise, drawn up soft (overlay)
function dd_grain(c,seed,a,x0,y0,w,h){const R=ag_rnd(seed),n=mkCanvas(240,135),x=n.getContext("2d"),d=x.createImageData(240,135);
  for(let i=0;i<d.data.length;i+=4){const v=110+R()*50;d.data[i]=v;d.data[i+1]=v;d.data[i+2]=v;d.data[i+3]=255;}x.putImageData(d,0,0);
  c.save();c.globalAlpha=a;c.globalCompositeOperation="overlay";c.imageSmoothingEnabled=true;c.drawImage(n,0,0,240,135,x0||0,y0||0,w||W,h||H);c.restore();}
// a mud-brick wall over x0..x1, y0..y1: courses of bricks, mortar, a wash of plaster in patches
function dd_bricks(c,x0,y0,x1,y1,seed,o){o=o||{};const R=ag_rnd(seed),bh=o.bh||38;c.save();c.beginPath();c.rect(x0,y0,x1-x0,y1-y0);c.clip();
  c.fillStyle=rgba(mix(DD.mortar,DD.brick,0.45),1);c.fillRect(x0,y0,x1-x0,y1-y0);
  for(let y=y0,row=0;y<y1;y+=bh,row++){let x=x0-(row%2)*56-R()*24;while(x<x1){const w=104+R()*30,v=(R()-0.5)*22,col=DD.brick.map((k,i)=>clamp(k+v+(i===0?R()*6:0),0,255));
      c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(x+3,y+3+R()*2);c.lineTo(x+w-3,y+3+R()*2);c.lineTo(x+w-3-R()*3,y+bh-3);c.lineTo(x+3,y+bh-3-R()*2);c.closePath();c.fill();x+=w;}}
  // mud plaster over most of it, in patches, with a few cracks
  const pc=o.patches==null?40:o.patches;for(let i=0;i<pc;i++){const px=x0+R()*(x1-x0),py=y0+R()*(y1-y0),r=90+R()*240;const g=c.createRadialGradient(px,py,0,px,py,r);
    g.addColorStop(0,rgba(DD.plaster,0.8));g.addColorStop(0.65,rgba(DD.plaster,0.55));g.addColorStop(1,rgba(DD.plaster,0));c.fillStyle=g;c.fillRect(px-r,py-r,2*r,2*r);}
  c.strokeStyle="rgba(70,46,30,0.35)";c.lineWidth=1.4;for(let i=0;i<(o.cracks==null?14:o.cracks);i++){let cx=x0+R()*(x1-x0),cy=y0+R()*(y1-y0);c.beginPath();c.moveTo(cx,cy);
    for(let j=0;j<5;j++){cx+=(R()-0.5)*40;cy+=10+R()*26;c.lineTo(cx,cy);}c.stroke();}
  c.restore();}
// a wooden beam or plank, lit from above
function dd_plank(c,x,y,w,h,o){o=o||{};const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(DD.woodHi,1));g.addColorStop(0.35,rgba(DD.wood,1));g.addColorStop(1,rgba(DD.woodLo,1));
  c.fillStyle=g;c.fillRect(x,y,w,h);c.fillStyle="rgba(30,18,10,0.35)";for(let i=0;i<3;i++)c.fillRect(x,y+h*(0.3+i*0.22),w,1.2);
  if(o.shadow!==false){const s=c.createLinearGradient(0,y+h,0,y+h+(o.sh||26));s.addColorStop(0,"rgba(20,10,6,0.45)");s.addColorStop(1,"rgba(20,10,6,0)");c.fillStyle=s;c.fillRect(x,y+h,w,o.sh||26);}}
// the night outside: sky, a few stars, bare hills, inside the box
function dd_night(c,x0,y0,x1,y1,seed,o){o=o||{};const R=ag_rnd(seed);c.save();c.beginPath();c.rect(x0,y0,x1-x0,y1-y0);c.clip();
  const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(DD.night0,1));g.addColorStop(0.75,rgba(DD.night1,1));g.addColorStop(1,rgba(mix(DD.night1,[40,70,74],0.3),1));c.fillStyle=g;c.fillRect(x0,y0,x1-x0,y1-y0);
  for(let i=0;i<(o.stars||40);i++){const sx=x0+R()*(x1-x0),sy=y0+R()*(y1-y0)*0.7;c.fillStyle="rgba(200,236,236,"+(0.25+R()*0.5).toFixed(2)+")";c.beginPath();c.arc(sx,sy,0.7+R()*1.2,0,TAU);c.fill();}
  const hz=o.horizon||y0+(y1-y0)*0.72;c.fillStyle=rgba(DD.hill,1);c.beginPath();c.moveTo(x0,y1);
  for(let x=x0;x<=x1+20;x+=20)c.lineTo(x,hz-30*Math.sin(x*0.004+seed)-14*Math.sin(x*0.011+1.3)-6*R());c.lineTo(x1,y1);c.closePath();c.fill();c.restore();}

/* ---------------------------------------------------------------- the places */
AG_PLACES.ddRoom=c=>{const F=DD_ROOM.floor,[dx0,dy0,dx1,dy1]=DD_ROOM.door,S=DD_ROOM.shelf,[nx0,ny0,nx1,ny1]=DD_ROOM.niche;
  dd_bricks(c,0,96,W,F,11,{patches:46});
  // the roof: round poplar beams over reed matting, deep in shadow
  c.fillStyle="rgb(34,24,18)";c.fillRect(0,0,W,110);for(let x=-30;x<W;x+=118){const g=c.createLinearGradient(0,0,0,92);g.addColorStop(0,"rgb(46,32,22)");g.addColorStop(0.6,"rgb(92,64,42)");g.addColorStop(1,"rgb(50,34,24)");
    c.fillStyle=g;c.fillRect(x,0,70,92);c.fillStyle="rgba(12,8,6,0.55)";c.fillRect(x+70,0,48,92);}
  dd_plank(c,0,92,W,20,{sh:46});
  // the door, open to the night: the jambs' depth lit by the night, a wooden lintel
  dd_night(c,dx0,dy0,dx1,dy1,7,{stars:26});
  c.fillStyle="rgb(70,48,34)";c.beginPath();c.moveTo(dx1,dy0);c.lineTo(dx1+26,dy0+20);c.lineTo(dx1+26,F);c.lineTo(dx1,F);c.closePath();c.fill();
  dd_plank(c,dx0-30,dy0-34,dx1-dx0+90,34,{sh:30});
  // the niche in the wall where the lamp stands: a dark recess, its sill lit
  c.fillStyle="rgb(46,30,22)";c.beginPath();c.moveTo(nx0,ny1);c.lineTo(nx0,ny0+40);c.quadraticCurveTo((nx0+nx1)/2,ny0-24,nx1,ny0+40);c.lineTo(nx1,ny1);c.closePath();c.fill();
  let g=c.createLinearGradient(0,ny0,0,ny1);g.addColorStop(0,"rgba(8,4,2,0.6)");g.addColorStop(1,"rgba(8,4,2,0)");c.fillStyle=g;c.fill();dd_plank(c,nx0-14,ny1,nx1-nx0+28,14,{sh:22});
  // the floor: beaten earth, darker towards us
  g=c.createLinearGradient(0,F,0,H);g.addColorStop(0,"rgb(92,64,44)");g.addColorStop(1,"rgb(34,24,20)");c.fillStyle=g;c.fillRect(0,F,W,H-F);
  c.fillStyle="rgba(20,12,8,0.5)";c.fillRect(0,F,W,3);
  // the lamp: a small clay bowl with a pinched spout, on the niche's sill
  const [lx,ly]=DD_ROOM.lamp;c.save();c.fillStyle=rgba(DD.clayLo,1);c.beginPath();c.ellipse(lx,ly+8,40,12,0,0,TAU);c.fill();c.fillStyle=rgba(DD.clay,1);c.beginPath();c.moveTo(lx-40,ly+4);c.quadraticCurveTo(lx-34,ly+20,lx,ly+21);
  c.quadraticCurveTo(lx+22,ly+20,lx+36,ly+8);c.lineTo(lx+32,ly-2);c.quadraticCurveTo(lx,ly-6,lx-40,ly+4);c.fill();c.fillStyle=rgba(DD.clayHi,1);c.beginPath();c.ellipse(lx-6,ly+2,26,6,0,0,TAU);c.fill();
  c.fillStyle="rgb(40,24,14)";c.beginPath();c.ellipse(lx-6,ly+2,19,4,0,0,TAU);c.fill();c.restore();
  // the shelf: two posts and four planks
  for(const px of [S.x0-26,S.x1+4])dd_plank(c,px,196,24,F-196,{shadow:false});
  for(const y of S.rows)dd_plank(c,S.x0-26,y,S.x1-S.x0+56,16,{sh:34});
  // the table in front: a low top of planks on legs
  const T=DD_ROOM.table;c.fillStyle="rgb(36,22,14)";for(const lxx of [T.x0+30,T.x1-50])c.fillRect(lxx,T.y+10,22,H-T.y);
  g=c.createLinearGradient(0,T.y-40,0,T.y);g.addColorStop(0,"rgb(120,82,52)");g.addColorStop(1,"rgb(96,62,38)");c.fillStyle=g;
  c.beginPath();c.moveTo(T.x0+40,T.y-40);c.lineTo(T.x1-30,T.y-40);c.lineTo(T.x1,T.y);c.lineTo(T.x0,T.y);c.closePath();c.fill();dd_plank(c,T.x0,T.y,T.x1-T.x0,18,{sh:40});
  dd_grain(c,5,0.4);
  // the light: the lamp's warm pool, the night's cool light through the door, and the dark between
  const [fx,fy]=DD_ROOM.flame;dd_light(c,[[fx,fy,1700,[230,150,90],0.62],[fx,fy,760,[255,196,130],0.62],[fx,fy,260,[255,220,170],0.5],[250,560,620,[60,120,132],0.55],[250,900,520,[50,100,112],0.32]],[16,20,26]);
  g=c.createRadialGradient(250,640,10,250,640,420);g.addColorStop(0,"rgba(90,150,160,0.08)");g.addColorStop(1,"rgba(90,150,160,0)");c.fillStyle=g;c.fillRect(0,200,700,880);
  // the dark at the top and the edges of the room
  g=c.createLinearGradient(0,0,0,300);g.addColorStop(0,"rgba(4,10,12,0.55)");g.addColorStop(1,"rgba(4,10,12,0)");c.fillStyle=g;c.fillRect(0,0,W,300);
  g=c.createRadialGradient(fx,fy+80,500,fx,fy+80,1400);g.addColorStop(0,"rgba(4,10,12,0)");g.addColorStop(1,"rgba(4,10,12,0.55)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// how much of the lamp's light falls at a point of the room (0 dark, 1 beside the flame): live things are dimmed by it
function dd_lit(x,y){const [fx,fy]=DD_ROOM.flame,d=Math.hypot(x-fx,(y-fy)*1.1);return clamp(1-d/1500,0.18,1)*clamp(1.15-d/1200,0.35,1);}

AG_PLACES.ddAshur=c=>{const F=760;
  // plastered walls, smoother than Kanesh's, a niche with a ledge, a small window high on the right with the moon in it
  dd_bricks(c,0,0,W,F,31,{patches:60});c.fillStyle="rgba(176,140,104,0.35)";c.fillRect(0,0,W,F);
  dd_night(c,1430,190,1590,320,13,{stars:6,horizon:300});c.fillStyle="rgb(210,226,220)";c.beginPath();c.arc(1530,236,22,0,TAU);c.fill();c.fillStyle=rgba(DD.night0,1);c.beginPath();c.arc(1541,229,20,0,TAU);c.fill();
  dd_plank(c,1414,170,192,22,{sh:20});
  // the niche: deep, darker, its ledge
  c.fillStyle="rgb(58,40,30)";c.fillRect(700,330,520,330);let g=c.createLinearGradient(700,330,700,660);g.addColorStop(0,"rgba(10,6,4,0.6)");g.addColorStop(1,"rgba(10,6,4,0.1)");c.fillStyle=g;c.fillRect(700,330,520,330);
  dd_plank(c,686,640,548,24,{sh:30});dd_plank(c,686,306,548,26,{sh:22});
  // a tall storage jar on the floor
  c.fillStyle="rgb(132,92,62)";c.beginPath();c.moveTo(1290,F);c.bezierCurveTo(1250,700,1250,560,1300,520);c.lineTo(1300,490);c.lineTo(1380,490);c.lineTo(1380,520);c.bezierCurveTo(1430,560,1430,700,1390,F);c.closePath();c.fill();
  g=c.createLinearGradient(0,F,0,H);g.addColorStop(0,"rgb(78,56,40)");g.addColorStop(1,"rgb(34,24,20)");c.fillStyle=g;c.fillRect(0,F,W,H-F);
  dd_grain(c,9,0.35);
  // the moonlight through the window, falling across the niche; a little warm light from a lamp out of sight
  dd_light(c,[[1500,300,900,[120,170,190],0.9],[960,520,700,[120,160,180],0.5],[300,700,900,[255,190,120],0.35]],[30,38,46]);
  c.save();c.globalCompositeOperation="lighter";const sg=c.createLinearGradient(1500,260,980,700);sg.addColorStop(0,"rgba(120,180,200,0.14)");sg.addColorStop(1,"rgba(120,180,200,0)");
  c.fillStyle=sg;c.beginPath();c.moveTo(1440,300);c.lineTo(1590,300);c.lineTo(1240,720);c.lineTo(860,720);c.closePath();c.fill();c.restore();};

AG_PLACES.ddRoad=c=>{const R=ag_rnd(3);
  let g=c.createLinearGradient(0,0,0,600);g.addColorStop(0,"rgb(5,13,17)");g.addColorStop(1,"rgb(18,42,48)");c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let i=0;i<140;i++){const x=R()*W,y=R()*520;c.fillStyle="rgba(205,238,238,"+(0.2+R()*0.55).toFixed(2)+")";c.beginPath();c.arc(x,y,0.6+R()*1.3,0,TAU);c.fill();}
  // a crescent moon
  c.fillStyle="rgb(220,232,226)";c.beginPath();c.arc(1500,170,30,0,TAU);c.fill();c.fillStyle="rgb(6,15,19)";c.beginPath();c.arc(1514,160,28,0,TAU);c.fill();
  // the hills, far to near, each darker, with a little haze between
  const layer=(y,a1,a2,col,ph)=>{c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(0,H);for(let x=0;x<=W+20;x+=16)c.lineTo(x,y-a1*Math.sin(x*0.0032+ph)-a2*Math.sin(x*0.0101+ph*2));c.lineTo(W,H);c.closePath();c.fill();
    const hg=c.createLinearGradient(0,y-80,0,y+40);hg.addColorStop(0,"rgba(80,140,150,0)");hg.addColorStop(1,"rgba(80,140,150,0.06)");c.fillStyle=hg;c.fillRect(0,y-80,W,120);};
  layer(560,26,10,[20,46,52],0.4);layer(640,40,16,[14,34,40],1.9);layer(780,60,20,[9,24,28],3.1);
  // the road: from near, below the frame, winding back to Ashur's far lights on the right
  const road=[[-120,1180],[420,860],[760,770],[1180,700],[1460,628],[1612,566]];c.save();
  for(let i=0;i<road.length-1;i++){const [x0,y0]=road[i],[x1,y1]=road[i+1],w0=lerp(220,10,i/(road.length-1)),w1=lerp(220,10,(i+1)/(road.length-1));
    c.fillStyle="rgba(84,96,90,"+(0.55-i*0.06).toFixed(2)+")";c.beginPath();c.moveTo(x0,y0-w0/2);c.lineTo(x1,y1-w1/2);c.lineTo(x1,y1+w1/2);c.lineTo(x0,y0+w0/2);c.closePath();c.fill();}c.restore();
  // Ashur's lights, far off, small and warm
  for(let i=0;i<9;i++){const x=1590+R()*70,y=548+R()*20;c.fillStyle="rgba(255,206,150,"+(0.4+R()*0.4).toFixed(2)+")";c.beginPath();c.arc(x,y,1.2+R()*1.4,0,TAU);c.fill();}
  g=c.createRadialGradient(1620,552,0,1620,552,90);g.addColorStop(0,"rgba(255,200,140,0.18)");g.addColorStop(1,"rgba(255,200,140,0)");c.fillStyle=g;c.fillRect(1500,440,240,240);
  dd_grain(c,17,0.25);};
// the caravan's way along the road, far (u 0) to near (u 1): a point, and the size of a donkey there
const DD_ROAD=[[1600,566,0.16],[1460,630,0.26],[1180,702,0.42],[860,760,0.62],[560,832,0.86]];
function dd_roadAt(u){u=clamp(u,0,1)*(DD_ROAD.length-1);const i=Math.min(DD_ROAD.length-2,Math.floor(u)),f=u-i,a=DD_ROAD[i],b=DD_ROAD[i+1];return[lerp(a[0],b[0],f),lerp(a[1],b[1],f),lerp(a[2],b[2],f)];}

/* ---------------------------------------------------------------- the lamp's flame, live */
function dd_flame(ctx,t,a){a=a==null?1:a;if(a<=0)return;const [fx,fy]=DD_ROOM.flame,f=1+0.06*Math.sin(t*9.1)+0.04*Math.sin(t*14.7+1)+0.03*Math.sin(t*23.3+2),sw=2*Math.sin(t*6.3);
  ctx.save();ctx.globalAlpha*=a;ctx.globalCompositeOperation="lighter";let g=ctx.createRadialGradient(fx,fy,0,fx,fy,150*f);g.addColorStop(0,"rgba(255,190,110,0.26)");g.addColorStop(1,"rgba(255,190,110,0)");
  ctx.fillStyle=g;ctx.fillRect(fx-160,fy-160,320,320);ctx.globalCompositeOperation="source-over";
  g=ctx.createLinearGradient(fx,fy-34*f,fx,fy+4);g.addColorStop(0,"rgba(255,236,190,0.0)");g.addColorStop(0.3,"rgba(255,226,170,0.9)");g.addColorStop(1,"rgba(255,170,80,1)");ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(fx,fy+4);ctx.bezierCurveTo(fx-9,fy-2,fx-6+sw*0.3,fy-18*f,fx+sw,fy-34*f);ctx.bezierCurveTo(fx+6+sw*0.3,fy-18*f,fx+9,fy-2,fx,fy+4);ctx.fill();
  ctx.fillStyle="rgba(255,250,230,0.9)";ctx.beginPath();ctx.ellipse(fx,fy-5,2.6,6*f,0,0,TAU);ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- a tablet, as a picture made once
   kind: "tablet" (clay with rows of wedge marks), "envelope" (a smoother skin of clay round it, the seal's band across it), "receipt"
   (a small tablet in its envelope). light: "lamp" or "moon". The picture is 2.5 times the size it's drawn at s = 1 (120 by 150). */
const DD_PICS={};
function dd_tabletShape(c,w,h){const r=w*0.22;c.beginPath();c.moveTo(r,0);c.quadraticCurveTo(w/2,-h*0.025,w-r,0);c.quadraticCurveTo(w,0,w,r);c.quadraticCurveTo(w+w*0.03,h/2,w,h-r);
  c.quadraticCurveTo(w,h,w-r,h);c.quadraticCurveTo(w/2,h+h*0.025,r,h);c.quadraticCurveTo(0,h,0,h-r);c.quadraticCurveTo(-w*0.03,h/2,0,r);c.quadraticCurveTo(0,0,r,0);c.closePath();}
// the seal's band: the film's own pattern of small standing figures between lines, a zigzag under them
function dd_band(c,x,y,w,h,u,col){const n=Math.floor(w/26);c.save();c.beginPath();c.rect(x,y,w*clamp(u,0,1),h);c.clip();c.strokeStyle=col;c.fillStyle=col;c.lineWidth=2;
  c.beginPath();c.moveTo(x,y+2);c.lineTo(x+w,y+2);c.moveTo(x,y+h-2);c.lineTo(x+w,y+h-2);c.stroke();
  for(let i=0;i<n;i++){const cx=x+13+i*26,k=i%3;c.beginPath();if(k===0){c.arc(cx,y+h*0.32,3.2,0,TAU);c.fill();c.fillRect(cx-1.5,y+h*0.38,3,h*0.36);c.fillRect(cx-6,y+h*0.5,12,2.4);}
    else if(k===1){c.moveTo(cx,y+h*0.2);c.lineTo(cx+6,y+h*0.52);c.lineTo(cx,y+h*0.84);c.lineTo(cx-6,y+h*0.52);c.closePath();c.stroke();}
    else{for(let j=0;j<3;j++){c.beginPath();c.arc(cx,y+h*(0.28+j*0.22),2.2,0,TAU);c.fill();}}}
  c.restore();}
function dd_tabletPic(kind,light){const key=kind+"/"+(light||"lamp");if(DD_PICS[key])return DD_PICS[key];const K=2.5,small=kind==="receipt",w=(small?84:120)*K,h=(small?100:150)*K,P=26,
    c=mkCanvas(Math.ceil(w+2*P),Math.ceil(h+2*P)),x=c.getContext("2d"),moon=light==="moon",base=kind==="tablet"?DD.clay:DD.env;x.translate(P,P);
  // the clay, lit from above and in front, darker at its edges
  x.save();x.shadowColor="rgba(10,6,4,0.55)";x.shadowBlur=18;x.shadowOffsetY=8;dd_tabletShape(x,w,h);x.fillStyle=rgba(base,1);x.fill();x.restore();
  x.save();dd_tabletShape(x,w,h);x.clip();let g=x.createRadialGradient(w*0.42,h*0.3,10,w*0.5,h*0.5,Math.max(w,h)*0.75);g.addColorStop(0,rgba(mix(base,[255,236,200],0.35),1));g.addColorStop(0.6,rgba(base,1));g.addColorStop(1,rgba(DD.clayLo,1));
  x.fillStyle=g;x.fillRect(0,0,w,h);
  const R=ag_rnd(kind.length*7+3);
  if(kind==="tablet"||small){// rows of wedge marks, pressed in: a dark notch with a lit lip under it
    const rows=small?6:11,mx=w*0.1,lh=(h*0.84)/rows;for(let r=0;r<rows;r++){const yy=h*0.09+r*lh+lh*0.6;x.fillStyle="rgba(70,44,28,0.28)";x.fillRect(mx,yy+lh*0.32,w-2*mx,1.4);
      let xx=mx+R()*8;while(xx<w-mx-12){const s=(4+R()*5)*K*0.42,kind2=R();x.fillStyle="rgba(60,36,22,0.8)";x.beginPath();
        if(kind2<0.6){x.moveTo(xx,yy-s);x.lineTo(xx+s*0.9,yy-s*0.55);x.lineTo(xx+s*0.25,yy-s*0.1);x.closePath();x.fill();x.fillRect(xx+s*0.35,yy-s*0.4,1.6,s*1.3);}
        else{x.moveTo(xx,yy-s*0.3);x.lineTo(xx+s,yy-s*0.8);x.lineTo(xx+s*0.7,yy);x.closePath();x.fill();x.fillRect(xx+s*0.5,yy-s*0.45,s*1.4,1.6);}
        x.fillStyle="rgba(250,220,180,0.35)";x.fillRect(xx,yy+1.5,s*0.8,1.2);xx+=s*1.6+R()*6+(R()<0.15?s*2:0);}}}
  if(kind!=="tablet"){// the envelope's band of seal impressions across its middle
    const by=small?h*0.38:h*0.42,bh=small?h*0.22:h*0.17;x.fillStyle="rgba(60,36,22,0.18)";x.fillRect(0,by,w,bh);dd_band(x,0,by,w,bh,1,"rgba(66,40,24,0.75)");
    x.fillStyle="rgba(250,224,184,0.25)";x.fillRect(0,by+bh,w,2);}
  // a few pits and scratches in the clay
  for(let i=0;i<40;i++){x.fillStyle="rgba(70,44,28,"+(0.12+R()*0.2).toFixed(2)+")";x.beginPath();x.arc(R()*w,R()*h,0.8+R()*2,0,TAU);x.fill();}
  if(moon){x.globalCompositeOperation="multiply";x.fillStyle="rgb(120,150,170)";x.fillRect(0,0,w,h);}
  x.restore();x.save();dd_tabletShape(x,w,h);x.strokeStyle=moon?"rgba(150,190,210,0.35)":"rgba(255,226,186,0.35)";x.lineWidth=2.5;x.stroke();x.restore();
  return DD_PICS[key]={c,w,h,P,K};}
/* dd_tablet(ctx, x, y, s, o): a tablet standing with its foot's middle at (x, y). o: kind, light, a, rot, rim (0 to 1, a coral rim: a
   claim made twice), grey (0 to 1: void, its colour gone grey), lift (px up), shadow (0 to 1) */
function dd_tablet(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.003)return;const P=dd_tabletPic(o.kind||"tablet",o.light),w=P.w/P.K*s,h=P.h/P.K*s,lift=o.lift||0;ctx.save();ctx.globalAlpha*=a;
  if(o.shadow!==0){const sh=o.shadow==null?1:o.shadow;ctx.save();ctx.globalAlpha*=sh*clamp(1-lift/220,0.2,1);const g=ctx.createRadialGradient(x,y,0,x,y,w*0.7);g.addColorStop(0,"rgba(16,8,4,0.55)");g.addColorStop(1,"rgba(16,8,4,0)");
    ctx.translate(x,y);ctx.scale(1,0.22);ctx.translate(-x,-y);ctx.fillStyle=g;ctx.fillRect(x-w,y-w,2*w,2*w);ctx.restore();}
  ctx.translate(x,y-lift);if(o.rot)ctx.rotate(o.rot);
  if(o.rim>0){ctx.save();ctx.shadowColor=rgba(DP.F.coral,0.9*o.rim);ctx.shadowBlur=26*s;dd_tabletShape(ctx,0,0,0,0);ctx.translate(-w/2,-h);dd_tabletShape(ctx,w,h);ctx.strokeStyle=rgba(DP.F.coral,o.rim);ctx.lineWidth=4*Math.max(0.6,s);ctx.stroke();ctx.restore();}
  ctx.drawImage(P.c,0,0,P.c.width,P.c.height,-w/2-P.P/P.K*s,-h-P.P/P.K*s,P.c.width/P.K*s,P.c.height/P.K*s);
  if(o.dim>0){ctx.save();ctx.translate(-w/2,-h);dd_tabletShape(ctx,w,h);ctx.fillStyle="rgba(14,10,12,"+clamp(o.dim,0,0.9).toFixed(3)+")";ctx.fill();ctx.restore();}
  if(o.grey>0){ctx.save();ctx.translate(-w/2,-h);dd_tabletShape(ctx,w,h);ctx.clip();ctx.globalAlpha*=o.grey;ctx.globalCompositeOperation="saturation";ctx.fillStyle="rgb(128,128,128)";ctx.fillRect(0,0,w,h);
    ctx.globalCompositeOperation="source-over";ctx.globalAlpha=a*o.grey*0.45;ctx.fillStyle="rgb(30,36,40)";ctx.fillRect(0,0,w,h);ctx.restore();}
  if(o.rim>0){ctx.save();ctx.translate(-w/2,-h);dd_tabletShape(ctx,w,h);ctx.strokeStyle=rgba(mix(DP.F.coral,[255,255,255],0.2),o.rim);ctx.lineWidth=3*Math.max(0.6,s);ctx.stroke();ctx.restore();}
  ctx.restore();}
/* the tablet being written: rows of wedge marks appear left to right as u goes from 0 to 1 (the full tablet's picture, uncovered) */
function dd_writing(ctx,x,y,s,u,o){o=o||{};const blank=dd_tabletPic("blank",o.light),full=dd_tabletPic("tablet",o.light),w=full.w/full.K*s,h=full.h/full.K*s;
  dd_tablet(ctx,x,y,s,Object.assign({},o,{kind:"blank"}));if(u<=0)return;const rows=11,k=clamp(u,0,1)*rows,ri=Math.floor(k),f=k-ri;
  ctx.save();ctx.beginPath();const top=y-h,ry=r=>top+h*0.09+r*(h*0.84/rows);ctx.rect(x-w/2-4,top-4,w+8,ry(ri)-top+4);if(ri<rows)ctx.rect(x-w/2-4,ry(ri),(w+8)*f,h*0.84/rows);ctx.clip();
  dd_tablet(ctx,x,y,s,Object.assign({},o,{kind:"tablet",shadow:0}));ctx.restore();}

/* ---------------------------------------------------------------- the envelope closing, the seal rolling, the shards
   dd_envelope(ctx, x, y, s, u, roll): the envelope's skin of clay folds over the tablet (u 0 to 1), and the seal rolls across it
   (roll 0 to 1), leaving its band */
function dd_envelope(ctx,x,y,s,u,roll,o){o=o||{};const P=dd_tabletPic("envelope",o.light),w=P.w/P.K*s,h=P.h/P.K*s;if(u<1)dd_tablet(ctx,x,y,s,Object.assign({},o,{kind:"tablet"}));
  if(u<=0)return;ctx.save();const top=y-h-6*s,cover=h*ag_eo(u);ctx.beginPath();ctx.rect(x-w/2-20,top,w+40,cover+12);ctx.clip();
  dd_tablet(ctx,x,y,s*1.04,Object.assign({},o,{kind:"skin",shadow:u<1?0:1}));ctx.restore();
  if(roll>0){const by=y-h*0.58,bh=h*0.17,bw=w*1.04;ctx.save();ctx.translate(x-bw/2,by);dd_band(ctx,0,0,bw,bh,ag_sine(roll),"rgba(66,40,24,0.8)");ctx.restore();
    if(roll<1){// the cylinder seal itself, a small dark stone rolling along the band
      const cx=x-bw/2+bw*ag_sine(roll),cy=by+bh/2,r=bh*0.62;ctx.save();ctx.fillStyle="rgb(46,40,44)";rr(ctx,cx-r*0.9,cy-bh*0.95,r*1.8,bh*1.9,r*0.5);ctx.fill();
      ctx.fillStyle="rgba(200,190,200,0.25)";ctx.fillRect(cx-r*0.5,cy-bh*0.9,r*0.3,bh*1.8);ctx.restore();}}}
// a blank tablet picture: clay with no marks, for the writing to come and for the envelope's skin
(function(){const f=dd_tabletPic;dd_tabletPic=function(kind,light){if(kind!=="blank"&&kind!=="skin")return f(kind,light);const key=kind+"/"+(light||"lamp");if(DD_PICS[key])return DD_PICS[key];
  const T=f("tablet",light),c=mkCanvas(T.c.width,T.c.height),x=c.getContext("2d"),w=T.w,h=T.h,P=T.P,base=kind==="skin"?DD.env:DD.clay;x.translate(P,P);
  x.save();x.shadowColor="rgba(10,6,4,0.55)";x.shadowBlur=18;x.shadowOffsetY=8;dd_tabletShape(x,w,h);x.fillStyle=rgba(base,1);x.fill();x.restore();
  x.save();dd_tabletShape(x,w,h);x.clip();const g=x.createRadialGradient(w*0.42,h*0.3,10,w*0.5,h*0.5,Math.max(w,h)*0.75);g.addColorStop(0,rgba(mix(base,[255,236,200],0.35),1));g.addColorStop(0.6,rgba(base,1));g.addColorStop(1,rgba(DD.clayLo,1));
  x.fillStyle=g;x.fillRect(0,0,w,h);const R=ag_rnd(77);for(let i=0;i<50;i++){x.fillStyle="rgba(70,44,28,"+(0.1+R()*0.18).toFixed(2)+")";x.beginPath();x.arc(R()*w,R()*h,0.8+R()*2,0,TAU);x.fill();}
  if(light==="moon"){x.globalCompositeOperation="multiply";x.fillStyle="rgb(120,150,170)";x.fillRect(0,0,w,h);}x.restore();
  return DD_PICS[key]={c,w,h,P,K:T.K};};})();
/* dd_shards(ctx, x, y, s, u): the tablet broken: its picture cut into five pieces that part and fall to y (u 0 to 1), then lie still;
   o.fade (0 to 1) fades them */
const DD_CUTS=[[[0,0],[0.62,0],[0.5,0.38],[0,0.46]],[[0.62,0],[1,0],[1,0.5],[0.5,0.38]],[[0,0.46],[0.5,0.38],[0.44,0.72],[0,0.8]],[[0.5,0.38],[1,0.5],[1,1],[0.62,1],[0.44,0.72]],[[0,0.8],[0.44,0.72],[0.62,1],[0,1]]];
const DD_FALL=[[-0.9,-0.5,-0.7],[0.8,-0.6,0.6],[-1.1,0.1,-0.4],[1.0,0.3,0.9],[-0.2,0.6,0.3]];
function dd_shards(ctx,x,y,s,u,o){o=o||{};const P=dd_tabletPic(o.kind||"tablet",o.light),w=P.w/P.K*s,h=P.h/P.K*s,a=(o.a==null?1:o.a)*(1-(o.fade||0));if(a<=0)return;
  const e=ag_eo(clamp(u,0,1));ctx.save();ctx.globalAlpha*=a;
  DD_CUTS.forEach((poly,i)=>{const [fx,fy,fr]=DD_FALL[i],cx=poly.reduce((q,p)=>q+p[0],0)/poly.length,cy=poly.reduce((q,p)=>q+p[1],0)/poly.length;
    const ox=fx*w*0.5*e,oy=(1-cy)*h*e*0.92+fy*8*e,rot=fr*0.5*e;ctx.save();ctx.translate(x-w/2+cx*w+ox,y-h+cy*h+oy);ctx.rotate(rot);ctx.translate(-(cx*w),-(cy*h));
    ctx.beginPath();poly.forEach((p,j)=>{const px=p[0]*w,py=p[1]*h;j?ctx.lineTo(px,py):ctx.moveTo(px,py);});ctx.closePath();ctx.clip();
    ctx.drawImage(P.c,0,0,P.c.width,P.c.height,-P.P/P.K*s,-P.P/P.K*s,P.c.width/P.K*s,P.c.height/P.K*s);
    if(o.dim>0){ctx.fillStyle="rgba(14,10,12,"+clamp(o.dim,0,0.9).toFixed(3)+")";ctx.fill();}
    ctx.strokeStyle="rgba(60,34,20,0.7)";ctx.lineWidth=2;ctx.stroke();ctx.restore();});ctx.restore();}

/* ---------------------------------------------------------------- what was traded: tin, cloth, silver on a scale */
// a pack of tin: a bundle of cloth tied with cord, two dull bars of tin beside it; k springs it in
function dd_tin(ctx,x,y,s,k){if(k<=0)return;const e=Math.min(1.08,ag_spr(k,0,0.5)),a=clamp(k*3,0,1);ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y-(1-Math.min(1,e))*40);ctx.scale(s,s);
  ctx.fillStyle="rgba(16,8,4,0.45)";ctx.beginPath();ctx.ellipse(0,0,130,16,0,0,TAU);ctx.fill();
  // bars of tin, dull grey, stacked crosswise in three layers
  const bar=(bx,by,w)=>{const g=ctx.createLinearGradient(0,by-24,0,by);g.addColorStop(0,"rgb(128,130,128)");g.addColorStop(0.5,"rgb(92,94,94)");g.addColorStop(1,"rgb(52,54,56)");ctx.fillStyle=g;rr(ctx,bx,by-24,w,24,7);ctx.fill();
    ctx.fillStyle="rgba(255,255,255,0.1)";ctx.fillRect(bx+8,by-21,w-16,3);ctx.strokeStyle="rgba(30,32,34,0.7)";ctx.lineWidth=1.5;rr(ctx,bx,by-24,w,24,7);ctx.stroke();};
  for(let i=0;i<3;i++)bar(-118+i*80,0,74);for(let i=0;i<2;i++)bar(-80+i*82,-24,76);bar(-42,-48,80);
  ctx.restore();}
// rolls of cloth, dyed: three rolls lying on the table; k springs them in
function dd_cloth(ctx,x,y,s,k){if(k<=0)return;const a=clamp(k*3,0,1);ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y-(1-Math.min(1,ag_spr(k,0,0.5)))*40);ctx.scale(s,s);
  ctx.fillStyle="rgba(16,8,4,0.45)";ctx.beginPath();ctx.ellipse(0,0,140,16,0,0,TAU);ctx.fill();
  [[-60,0,0],[40,0,1],[-12,-46,2]].forEach(([cx,cy,i])=>{const col=DD.cloth[i],g=ctx.createLinearGradient(0,cy-46,0,cy);g.addColorStop(0,rgba(mix(col,[255,240,220],0.25),1));g.addColorStop(1,rgba(mix(col,[0,0,0],0.35),1));
    ctx.fillStyle=g;rr(ctx,cx-62,cy-46,124,46,22);ctx.fill();ctx.fillStyle=rgba(mix(col,[0,0,0],0.45),1);ctx.beginPath();ctx.ellipse(cx+58,cy-23,10,22,0,0,TAU);ctx.fill();
    ctx.strokeStyle=rgba(mix(col,[0,0,0],0.5),0.8);ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(cx+58,cy-23,5,12,0,0,TAU);ctx.stroke();});ctx.restore();}
// the scale: a post, a beam, two pans on cords; silver bars land on the left pan (n of them, as a number from 0 up, each springing in), stone weights on the right
function dd_scale(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s,s);const n=o.n||0,tilt=clamp((n-2.5)*0.025,-0.06,0.06)*(o.balance?0:1);
  ctx.fillStyle="rgba(16,8,4,0.45)";ctx.beginPath();ctx.ellipse(0,0,150,14,0,0,TAU);ctx.fill();
  ctx.fillStyle="rgb(70,46,30)";ctx.fillRect(-8,-230,16,230);ctx.fillRect(-40,-10,80,10);
  ctx.save();ctx.translate(0,-226);ctx.rotate(-tilt);dd_plank(ctx,-140,-6,280,12,{shadow:false});
  for(const sx of [-1,1]){const px=sx*128,py=Math.cos(0)*0;ctx.save();ctx.translate(px,py);ctx.rotate(tilt);ctx.strokeStyle="rgba(200,170,120,0.8)";ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-44,120);ctx.moveTo(0,0);ctx.lineTo(44,120);ctx.stroke();
    const g=ctx.createLinearGradient(0,116,0,134);g.addColorStop(0,"rgb(150,104,64)");g.addColorStop(1,"rgb(80,52,32)");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,124,56,10,0,0,TAU);ctx.fill();
    if(sx<0){for(let i=0;i<Math.ceil(n);i++){const k=clamp(n-i,0,1),e=Math.min(1,ag_spr(k,0,0.4));if(k<=0)continue;const bx=-30+(i%3)*22,by=114-Math.floor(i/3)*12-(1-e)*40;
        const bg=ctx.createLinearGradient(0,by-12,0,by);bg.addColorStop(0,"rgb(240,244,246)");bg.addColorStop(1,rgba(DD.silver,1));ctx.globalAlpha=clamp(k*3,0,1)*a;ctx.fillStyle=bg;rr(ctx,bx-10,by-12,40,12,4);ctx.fill();ctx.globalAlpha=a;}}
    else{ctx.fillStyle="rgb(60,58,62)";ctx.beginPath();ctx.ellipse(-12,110,18,12,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(16,112,12,8,0,0,TAU);ctx.fill();}
    ctx.restore();}ctx.restore();ctx.restore();}

/* ---------------------------------------------------------------- the caravan: donkeys only, small on the road, far to near */
function dd_donkey(ctx,x,y,s,t,pack){ctx.save();ctx.translate(x,y);ctx.scale(-s,s);const st=t*5.2,c="rgb(10,22,26)";ctx.fillStyle=c;ctx.strokeStyle=c;ctx.lineCap="round";
  ctx.lineWidth=7;for(let i=0;i<4;i++){const lx=[-36,-24,28,40][i],ph=st+(i%2?Math.PI:0)+(i>1?0.6:0),sw=Math.sin(ph)*9;ctx.beginPath();ctx.moveTo(lx,-40);ctx.lineTo(lx+sw,0);ctx.stroke();}
  ctx.beginPath();ctx.ellipse(0,-52,52,22,0,0,TAU);ctx.fill();ctx.beginPath();ctx.moveTo(40,-62);ctx.lineTo(62,-92);ctx.lineTo(74,-90);ctx.lineTo(60,-54);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(76,-90,16,10,0.5,0,TAU);ctx.fill();ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(64,-98);ctx.lineTo(58,-124);ctx.moveTo(70,-100);ctx.lineTo(70,-126);ctx.stroke();
  ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-50,-58);ctx.quadraticCurveTo(-64,-40,-58,-26);ctx.stroke();
  if(pack){ctx.fillStyle="rgb(18,34,38)";rr(ctx,-34,-96,64,30,10);ctx.fill();rr(ctx,-38,-80,22,40,8);ctx.fill();rr(ctx,14,-80,22,40,8);ctx.fill();}
  ctx.restore();}
// the caravan at u along the road (0 at Ashur, 1 near): four donkeys in a line, each a little behind
function dd_caravan(ctx,u,t,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;for(let i=3;i>=0;i--){const [x,y,s]=dd_roadAt(u-i*0.045);dd_donkey(ctx,x,y,s,t+i*0.3,true);}ctx.restore();}

/* ---------------------------------------------------------------- the stamp that makes a tablet void, and shelves of tablets */
// "Void" as a stamp of solid coral, tilted, landing with a spring (k)
function dd_stamp(ctx,x,y,text,k,o){o=o||{};if(k<=0)return;const e=ag_spr(k,0,0.45),sc=lerp(1.6,1,Math.min(1,e));ctx.save();ctx.translate(x,y);ctx.rotate(o.rot==null?-0.12:o.rot);ctx.scale(sc,sc);
  ctx.globalAlpha*=clamp(k*4,0,1);dp_pill(ctx,0,0,text,"coral",{size:o.size||34,align:"center",glow:22});ctx.restore();}
// the tablets on the room's shelf: each in the lamp's light; rim (0 to 1) rims every one but mine in coral; mine: what to draw at DD_MINE
function dd_shelfTablets(ctx,o){o=o||{};const S=DD_ROOM.shelf;for(const [x,j,s,k,lean] of DD_SHELF){if(Math.abs(x-DD_MINE[0])<46&&j===1)continue;
  dd_tablet(ctx,x,S.rows[j]+2,s,{kind:k?"envelope":"tablet",rot:lean,rim:(o.rim||0)*(0.55+0.45*((x*7+j*13)%10)/10),shadow:0.6,dim:1-dd_lit(x,S.rows[j]-40)});}}
