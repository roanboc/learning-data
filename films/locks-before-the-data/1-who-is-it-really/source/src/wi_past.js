/* ===== Who is it, really?: the Warring States, about 2,300 years ago, and a museum in Xi'an today =====
   The opening's own pictures, in the module's Night glass: night skies of dark petrol, flat shapes softly lit, lamplight warm where
   people are, and the module's glass tags over them (cyan who someone is, amber the power to raise troops, green a match, coral an
   order the king never gave, grey a place or a plain fact). All prefixed wi_ / WI.
     places (painted once): the land between a capital and an army on its border (wiRoad); Handan under siege, 257 BC (wiSiege);
     a commander's tent at night (wiTent); a king's rooms at night (wiCourt); a lacquered table under a lamp, for the tally (wiTally);
     a museum's room in Xi'an today, with a lit case (wiMuseum); the road near the camp (wiNear).
     live pieces: the tally, a small bronze tiger cut in two along its back, each half in profile (the king's, the right half, facing
     right; the commander's, the left half, facing left), its rule inlaid in gold, too small to read (decoration); the halves fitting
     together; a letter of bamboo slips; fires and torches; the messenger's light on the road.
     people of the time: a king, a commander in lacquered leather armour, a messenger, Wei's king, Lord Xinling, Jin Bi.
   Dress, from the period's own sources (the script's rigour sheet lists them): long robes crossed at the collar and belted; hair in
   a topknot, under a small black cap for a king or a lord and a cloth for a messenger; armour of small lacquered plates laced in
   rows. No flags, seals, writing or symbols of the kingdoms: the corner names the place and the year. No one is shown hurt. */

const WI={sky0:[5,13,18],sky1:[15,38,44],star:[210,236,236],moon:[226,240,236],ridge:[[17,40,46],[13,32,37],[10,25,29]],
  plain0:[13,31,34],plain1:[7,19,21],road:[46,58,56],roadHi:[70,80,74],earth:[38,46,46],earthHi:[64,70,66],roof:[16,24,28],
  lamp:[255,208,150],lampHi:[255,236,200],fire:[255,164,92],fireHi:[255,226,170],cloth:[58,50,46],clothHi:[96,82,70],wood:[52,36,28],
  bronze:[112,86,54],bronzeHi:[196,156,98],bronzeDk:[38,28,18],patina:[92,108,88],gold:[255,214,120],lacquer:[18,14,16],lacquerRed:[128,40,34]};

/* ---------------------------------------------------------------- the land at night: sky, stars, moon, ridges, a plain, a road */
function wi_sky(c,o){const R=ag_rnd(o.seed||5),hz=o.hz||640;let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(WI.sky0,1));g.addColorStop(1,rgba(WI.sky1,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz+40);
  for(let i=0;i<220;i++){const x=R()*W,y=R()*hz*0.86,r=R()<0.08?1.6+R()*1.2:0.6+R()*1.0,a=0.18+R()*0.55;c.fillStyle=rgba(WI.star,a*(1-y/hz*0.6));c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
  if(o.moon){const [mx,my,mr]=o.moon;let hg=c.createRadialGradient(mx,my,mr,mx,my,mr*9);hg.addColorStop(0,"rgba(190,225,225,0.22)");hg.addColorStop(1,"rgba(190,225,225,0)");
    c.fillStyle=hg;c.fillRect(mx-mr*9,my-mr*9,mr*18,mr*18);c.fillStyle=rgba(WI.moon,1);c.beginPath();c.arc(mx,my,mr,0,TAU);c.fill();
    c.fillStyle="rgba(190,206,204,0.22)";for(const [dx,dy,rr0] of [[-8,-6,7],[9,8,5],[-2,12,4]]){c.beginPath();c.arc(mx+dx,my+dy,rr0,0,TAU);c.fill();}}
  // long thin clouds, lit from below by the moon
  for(const [cx,cy,cw,ch,a] of (o.clouds||[[560,250,520,26,0.5],[1460,300,700,30,0.55],[1100,180,380,18,0.35]])){c.save();c.translate(cx,cy);c.scale(1,ch/cw);
    const cg=c.createRadialGradient(0,0,0,0,0,cw);cg.addColorStop(0,"rgba(9,24,30,"+a+")");cg.addColorStop(0.7,"rgba(9,24,30,"+(a*0.6)+")");cg.addColorStop(1,"rgba(9,24,30,0)");c.fillStyle=cg;c.fillRect(-cw,-cw,2*cw,2*cw);c.restore();
    c.strokeStyle="rgba(150,200,205,0.10)";c.lineWidth=1.4;c.beginPath();c.ellipse(cx,cy+ch*0.55,cw*0.6,ch*0.25,0,0.15*Math.PI,0.85*Math.PI);c.stroke();}}
// a ridge of hills: a soft line of sines from x 0 to W at base, filled down to the bottom
function wi_ridge(c,base,amp,seed,col,o){o=o||{};const R=ag_rnd(seed),k=[R()*6,R()*6,R()*6],f=[0.0021+R()*0.001,0.0053+R()*0.002,0.013+R()*0.004];
  c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=8){const y=base-amp*(0.55*Math.sin(x*f[0]+k[0])+0.3*Math.sin(x*f[1]+k[1])+0.15*Math.sin(x*f[2]+k[2]))-(o.lift?o.lift(x):0);c.lineTo(x,y);}
  c.lineTo(W,H);c.closePath();const g=c.createLinearGradient(0,base-amp,0,base+120);g.addColorStop(0,rgba(ag_lt(col,0.06),1));g.addColorStop(1,rgba(col,1));c.fillStyle=g;c.fill();
  // the moon's light along the ridge's top edge
  c.save();c.clip();c.strokeStyle="rgba(140,200,205,0.10)";c.lineWidth=2;c.beginPath();for(let x=0;x<=W;x+=8){const y=base-amp*(0.55*Math.sin(x*f[0]+k[0])+0.3*Math.sin(x*f[1]+k[1])+0.15*Math.sin(x*f[2]+k[2]))-(o.lift?o.lift(x):0);x?c.lineTo(x,y+1):c.moveTo(x,y+1);}c.stroke();c.restore();}
function wi_plain(c,top){const g=c.createLinearGradient(0,top,0,H);g.addColorStop(0,rgba(WI.plain0,1));g.addColorStop(1,rgba(WI.plain1,1));c.fillStyle=g;c.fillRect(0,top,W,H-top);}
// a road along points P ([x, y, width]), smooth, dusty, pale where the moon falls on it
function wi_road(c,P){const L=[],Rt=[];for(let i=0;i<P.length;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(P.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l,w=P[i][2]/2;
    L.push([P[i][0]+nx*w,P[i][1]+ny*w]);Rt.push([P[i][0]-nx*w,P[i][1]-ny*w]);}
  const pathOf=(S)=>{c.moveTo(S[0][0],S[0][1]);for(let i=1;i<S.length;i++){const m=[(S[i-1][0]+S[i][0])/2,(S[i-1][1]+S[i][1])/2];c.quadraticCurveTo(S[i-1][0],S[i-1][1],m[0],m[1]);}c.lineTo(S[S.length-1][0],S[S.length-1][1]);};
  c.beginPath();pathOf(L);const RR=Rt.slice().reverse();c.lineTo(RR[0][0],RR[0][1]);for(let i=1;i<RR.length;i++){const m=[(RR[i-1][0]+RR[i][0])/2,(RR[i-1][1]+RR[i][1])/2];c.quadraticCurveTo(RR[i-1][0],RR[i-1][1],m[0],m[1]);}c.closePath();
  const g=c.createLinearGradient(0,600,0,H);g.addColorStop(0,rgba(WI.roadHi,0.55));g.addColorStop(1,rgba(WI.road,0.9));c.fillStyle=g;c.fill();
  c.save();c.clip();const R=ag_rnd(77);c.fillStyle="rgba(0,0,0,0.12)";for(let i=0;i<500;i++){const k=Math.floor(R()*(P.length-1)),u=R(),x=lerp(P[k][0],P[k+1][0],u)+(R()-0.5)*P[k][2],y=lerp(P[k][1],P[k+1][1],u)+(R()-0.5)*P[k][2]*0.3;c.fillRect(x,y,2+R()*3,1.2);}c.restore();}
// a point along the road's middle, u from 0 (its start) to 1 (its end), by length
function wi_along(P,u){const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));const d=clamp(u,0,1)*L[L.length-1];
  for(let i=1;i<P.length;i++)if(d<=L[i]){const v=(d-L[i-1])/((L[i]-L[i-1])||1);return[lerp(P[i-1][0],P[i][0],v),lerp(P[i-1][1],P[i][1],v),lerp(P[i-1][2],P[i][2],v)];}
  const e=P[P.length-1];return[e[0],e[1],e[2]];}

/* ---------------------------------------------------------------- buildings of rammed earth and timber, at night */
// a wall of rammed earth from x0 to x1, its foot at base, its top at top; lit faintly by the moon on its face, warm where a lamp is
function wi_wall(c,x0,x1,top,base,o){o=o||{};const g=c.createLinearGradient(0,top,0,base);g.addColorStop(0,rgba(ag_lt(WI.earth,0.1),1));g.addColorStop(1,rgba(ag_dk(WI.earth,0.35),1));
  c.fillStyle=g;c.beginPath();c.moveTo(x0-6,base);c.lineTo(x0,top);c.lineTo(x1,top);c.lineTo(x1+6,base);c.closePath();c.fill();
  // the courses of rammed earth, faint
  c.strokeStyle="rgba(0,0,0,0.16)";c.lineWidth=1;for(let y=top+14;y<base;y+=14){c.beginPath();c.moveTo(x0-(y-top)/(base-top)*6,y);c.lineTo(x1+(y-top)/(base-top)*6,y);c.stroke();}
  c.fillStyle=rgba(ag_lt(WI.earth,0.25),1);c.fillRect(x0,top,x1-x0,3);
  // a low parapet along the top
  c.fillStyle=rgba(ag_dk(WI.earth,0.1),1);c.fillRect(x0,top-10,x1-x0,10);c.fillStyle="rgba(150,200,200,0.10)";c.fillRect(x0,top-10,x1-x0,1.5);}
// a hip roof over a house from x0 to x1 at the eaves' height y, rising h, its eaves reaching out e
function wi_roof(c,x0,x1,y,h,e,col){col=col||WI.roof;c.fillStyle=rgba(col,1);c.beginPath();c.moveTo(x0-e,y);c.quadraticCurveTo((x0+x1)/2,y-h*0.12,x1+e,y);
  c.lineTo(x1-(x1-x0)*0.18,y-h);c.lineTo(x0+(x1-x0)*0.18,y-h);c.closePath();c.fill();
  c.strokeStyle="rgba(150,205,210,0.16)";c.lineWidth=1.6;c.beginPath();c.moveTo(x0+(x1-x0)*0.18,y-h);c.lineTo(x1-(x1-x0)*0.18,y-h);c.stroke();
  c.strokeStyle="rgba(150,205,210,0.08)";c.beginPath();c.moveTo(x0-e,y);c.quadraticCurveTo((x0+x1)/2,y-h*0.12,x1+e,y);c.stroke();}
// a warm window, glowing
function wi_window(c,x,y,w,h,a){a=a==null?1:a;const g=c.createRadialGradient(x+w/2,y+h/2,0,x+w/2,y+h/2,Math.max(w,h)*2.6);g.addColorStop(0,rgba(WI.lamp,0.22*a));g.addColorStop(1,rgba(WI.lamp,0));
  c.fillStyle=g;c.fillRect(x-w*2.6,y-h*2.6,w*6.2,h*6.2);c.fillStyle=rgba(mix(WI.lamp,WI.lampHi,0.3),0.92*a);c.fillRect(x,y,w,h);c.fillStyle="rgba(60,30,10,0.35)";c.fillRect(x+w/2-0.8,y,1.6,h);}
// a city: walls, a gate with a gatehouse, and a palace on a high terrace behind, lamps in its windows
function wi_city(c,o){const {x0,x1,top,base,gate}=o,gw=o.gw||86,k=o.k||1;
  if(o.palace){const p=o.palace;c.fillStyle=rgba(ag_dk(WI.earth,0.2),1);c.beginPath();c.moveTo(p.x0-10*k,top);c.lineTo(p.x0,p.top);c.lineTo(p.x1,p.top);c.lineTo(p.x1+10*k,top);c.closePath();c.fill();
    c.fillStyle="rgba(150,200,200,0.08)";c.fillRect(p.x0,p.top,p.x1-p.x0,2);
    const hx0=p.x0+(p.x1-p.x0)*0.1,hx1=p.x1-(p.x1-p.x0)*0.1,hy=p.top-56*k;c.fillStyle=rgba(WI.wood,1);c.fillRect(hx0,hy,hx1-hx0,56*k);
    for(let i=0;i<5;i++){const wx=lerp(hx0+14*k,hx1-30*k,i/4);wi_window(c,wx,hy+16*k,16*k,26*k,0.9);}
    wi_roof(c,hx0,hx1,hy,48*k,22*k);}
  wi_wall(c,x0,x1,top,base);
  // the gate: an opening, dark, and a gatehouse of timber on the wall over it
  c.fillStyle="rgba(4,10,12,0.95)";c.fillRect(gate-gw/2,base-74*k,gw,74*k);c.fillStyle=rgba(WI.lamp,0.14);c.fillRect(gate-gw/2,base-6,gw,6);
  const gx0=gate-gw*0.95,gx1=gate+gw*0.95,gy=top-46*k;c.fillStyle=rgba(WI.wood,1);c.fillRect(gx0,gy,gx1-gx0,46*k-10);
  wi_window(c,gate-gw*0.55,gy+12*k,14*k,20*k,0.85);wi_window(c,gate+gw*0.55-14*k,gy+12*k,14*k,20*k,0.85);wi_roof(c,gx0,gx1,gy,40*k,18*k);
  // a lamp each side of the gate
  for(const lx of [gate-gw/2-16*k,gate+gw/2+16*k]){const g=c.createRadialGradient(lx,base-60*k,0,lx,base-60*k,70*k);g.addColorStop(0,rgba(WI.lamp,0.32));g.addColorStop(1,rgba(WI.lamp,0));c.fillStyle=g;c.fillRect(lx-70*k,base-130*k,140*k,140*k);
    c.fillStyle=rgba(WI.lampHi,0.95);c.fillRect(lx-3*k,base-66*k,6*k,10*k);}}
// a camp: a palisade of stakes, tents behind it, a glow on the ground where its fires are (the fires themselves are drawn live)
function wi_camp(c,o){const {x0,x1,y,k}=o,R=ag_rnd(o.seed||31);
  for(let i=0;i<(o.tents||7);i++){const tx=lerp(x0+30*k,x1-60*k,i/((o.tents||7)-1))+(R()-0.5)*20*k,ty=y-6*k-R()*12*k,tw=(62+R()*26)*k,th=(36+R()*12)*k;
    c.fillStyle=rgba(ag_dk(WI.cloth,0.25),1);c.beginPath();c.moveTo(tx,ty);c.lineTo(tx+tw*0.5,ty-th);c.lineTo(tx+tw,ty);c.closePath();c.fill();
    c.fillStyle=rgba(ag_dk(WI.cloth,0.45),1);c.beginPath();c.moveTo(tx+tw*0.5,ty-th);c.lineTo(tx+tw*0.85,ty-th*0.92);c.lineTo(tx+tw*1.32,ty-2*k);c.lineTo(tx+tw,ty);c.closePath();c.fill();
    if(R()<0.6){c.fillStyle=rgba(WI.lamp,0.55);c.beginPath();c.moveTo(tx+tw*0.42,ty);c.lineTo(tx+tw*0.5,ty-th*0.45);c.lineTo(tx+tw*0.58,ty);c.closePath();c.fill();}}
  for(const [fx,fy] of o.fires||[]){const g=c.createRadialGradient(fx,fy,0,fx,fy,90*k);g.addColorStop(0,rgba(WI.fire,0.28));g.addColorStop(1,rgba(WI.fire,0));c.save();c.translate(fx,fy);c.scale(1,0.45);c.translate(-fx,-fy);c.fillStyle=g;c.fillRect(fx-90*k,fy-90*k,180*k,180*k);c.restore();}
  c.strokeStyle=rgba(ag_dk(WI.wood,0.2),1);c.lineWidth=3.2*k;c.lineCap="round";for(let x=x0;x<=x1;x+=11*k){const h=(20+R()*6)*k;c.beginPath();c.moveTo(x,y+4*k);c.lineTo(x,y+4*k-h);c.stroke();}
  c.strokeStyle=rgba(ag_dk(WI.wood,0.1),1);c.lineWidth=2*k;c.beginPath();c.moveTo(x0,y-8*k);c.lineTo(x1,y-8*k);c.stroke();}
// a fire, live: flames that flicker, its light around it
function wi_fire(ctx,x,y,s,t,a){a=a==null?1:a;if(a<=0)return;const f=0.82+0.18*Math.sin(t*9.3+x)*Math.sin(t*5.1+y);ctx.save();ctx.globalAlpha*=a;ctx.globalCompositeOperation="lighter";
  const g=ctx.createRadialGradient(x,y-6*s,0,x,y-6*s,60*s*f);g.addColorStop(0,rgba(WI.fire,0.5));g.addColorStop(1,rgba(WI.fire,0));ctx.fillStyle=g;ctx.fillRect(x-60*s,y-66*s,120*s,120*s);ctx.restore();
  ctx.save();ctx.globalAlpha*=a;for(let i=0;i<3;i++){const dx=(i-1)*4*s,h=(14+6*Math.sin(t*11+i*2.1+x))*s*f;ctx.fillStyle=rgba(i===1?WI.fireHi:WI.fire,0.95);
    ctx.beginPath();ctx.moveTo(x+dx-5*s,y);ctx.quadraticCurveTo(x+dx-4*s,y-h*0.6,x+dx+Math.sin(t*7+i)*2*s,y-h);ctx.quadraticCurveTo(x+dx+4*s,y-h*0.6,x+dx+5*s,y);ctx.closePath();ctx.fill();}ctx.restore();}
// a torch carried along: a small flame and its glow
function wi_torch(ctx,x,y,s,t,a){a=a==null?1:a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.globalCompositeOperation="lighter";const f=0.85+0.15*Math.sin(t*12+x*0.3);
  const g=ctx.createRadialGradient(x,y,0,x,y,26*s*f);g.addColorStop(0,rgba(WI.fireHi,0.75));g.addColorStop(0.3,rgba(WI.fire,0.35));g.addColorStop(1,rgba(WI.fire,0));ctx.fillStyle=g;ctx.fillRect(x-26*s,y-26*s,52*s,52*s);ctx.restore();}

/* ---------------------------------------------------------------- the places */
// the land between a capital and its border: the capital on the left, the road, an army's camp far off on the right
const WI_ROAD=[[376,702,36],[404,746,44],[500,796,54],[700,828,60],[920,820,56],[1120,786,46],[1290,736,34],[1420,690,24],[1500,664,18],[1556,652,12]];
const WI_CAMPFIRES=[[1500,636],[1612,628],[1724,640],[1810,632]];
AG_PLACES.wiRoad=c=>{wi_sky(c,{seed:5,hz:650,moon:[1652,168,30]});
  wi_ridge(c,560,70,11,WI.ridge[0]);wi_ridge(c,612,46,23,WI.ridge[1]);wi_plain(c,640);wi_ridge(c,680,22,37,WI.ridge[2],{lift:x=>x<760?Math.max(0,40-Math.abs(x-380)*0.06):0});
  wi_city(c,{x0:40,x1:720,top:556,base:704,gate:376,gw:80,palace:{x0:440,x1:670,top:470},k:1});
  wi_road(c,WI_ROAD);
  wi_camp(c,{x0:1440,x1:1880,y:652,k:0.72,tents:8,fires:WI_CAMPFIRES,seed:31});
  // the near ground, darker, a few grasses
  const g=c.createLinearGradient(0,880,0,H);g.addColorStop(0,"rgba(4,12,14,0)");g.addColorStop(1,"rgba(4,12,14,0.6)");c.fillStyle=g;c.fillRect(0,880,W,H-880);
  const R=ag_rnd(91);c.strokeStyle="rgba(120,170,165,0.12)";c.lineWidth=1.4;for(let i=0;i<260;i++){const x=R()*W,y=900+R()*170,h=6+R()*16;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+2,y-h*0.6,x+(R()-0.5)*8,y-h);c.stroke();}};
// Handan, the capital of Zhao, under siege in 257 BC: the city on its plain, the besiegers' fires all round it
const WI_SIEGE_ROAD=[[-40,800,64],[180,782,56],[420,752,44],[600,722,32],[720,700,24]];
const WI_SIEGEFIRES=(()=>{const R=ag_rnd(57),L=[];for(let i=0;i<46;i++){const a=R()*Math.PI*0.94+0.03*Math.PI,r=1+R()*0.35;L.push([1000+Math.cos(a)*520*r*(a<Math.PI/2?1.05:0.95),676+Math.sin(a)*120*r-6]);}
  for(let i=0;i<10;i++)L.push([560+R()*880,640+R()*14]);return L;})();
AG_PLACES.wiSiege=c=>{wi_sky(c,{seed:9,hz:640,moon:[1640,140,26],clouds:[[1300,240,640,26,0.5],[520,300,480,20,0.4]]});
  wi_ridge(c,560,60,13,WI.ridge[0]);wi_ridge(c,610,40,29,WI.ridge[1]);wi_plain(c,630);
  wi_road(c,WI_SIEGE_ROAD);
  wi_city(c,{x0:700,x1:1300,top:560,base:676,gate:1000,gw:70,palace:{x0:860,x1:1120,top:484},k:0.86});
  // smoke from the besiegers' fires, drifting
  const R=ag_rnd(61);for(let i=0;i<14;i++){const x=600+R()*800,y=560+R()*60,r=60+R()*90;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,"rgba(30,46,50,0.22)");g.addColorStop(1,"rgba(30,46,50,0)");c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}
  for(const [fx,fy] of WI_SIEGEFIRES){const g=c.createRadialGradient(fx,fy,0,fx,fy,46);g.addColorStop(0,rgba(WI.fire,0.22));g.addColorStop(1,rgba(WI.fire,0));c.save();c.translate(fx,fy);c.scale(1,0.45);c.translate(-fx,-fy);c.fillStyle=g;c.fillRect(fx-46,fy-46,92,92);c.restore();}
  const g=c.createLinearGradient(0,860,0,H);g.addColorStop(0,"rgba(4,12,14,0)");g.addColorStop(1,"rgba(4,12,14,0.6)");c.fillStyle=g;c.fillRect(0,860,W,H-860);};
// the road near the camp: the messenger's close shot; the palisade and a tent far behind, the fires' glow
AG_PLACES.wiNear=c=>{wi_sky(c,{seed:17,hz:600,moon:[1500,160,40],clouds:[[1300,230,560,24,0.5],[400,180,420,18,0.4]]});
  wi_ridge(c,520,60,41,WI.ridge[0]);wi_plain(c,590);wi_ridge(c,620,24,43,WI.ridge[1]);
  wi_camp(c,{x0:1040,x1:1900,y:640,k:1.25,tents:6,fires:[[1180,626],[1520,622],[1800,630]],seed:47});
  wi_road(c,[[700,1100,520],[820,900,300],[930,760,150],[1010,668,70],[1060,640,40]]);
  const g=c.createLinearGradient(0,800,0,H);g.addColorStop(0,"rgba(4,12,14,0)");g.addColorStop(1,"rgba(4,12,14,0.65)");c.fillStyle=g;c.fillRect(0,800,W,H-800);};
// a commander's tent at night: cloth walls on poles, a lamp on a stand, a low table, the doorway open to the night on the right
AG_PLACES.wiTent=c=>{const R=ag_rnd(71);
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba(ag_dk(WI.cloth,0.55),1));g.addColorStop(0.62,rgba(ag_dk(WI.cloth,0.25),1));g.addColorStop(1,rgba(ag_dk(WI.cloth,0.6),1));c.fillStyle=g;c.fillRect(0,0,W,H);
  // the cloth's seams and folds, falling from the ridge
  for(let i=0;i<22;i++){const x=i*92+R()*20;const fg=c.createLinearGradient(x-30,0,x+30,0);fg.addColorStop(0,"rgba(0,0,0,0)");fg.addColorStop(0.5,"rgba(0,0,0,0.16)");fg.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=fg;c.fillRect(x-30,60,60,640);}
  c.fillStyle="rgba(0,0,0,0.25)";c.beginPath();c.moveTo(0,0);c.lineTo(W,0);c.lineTo(W,90);c.quadraticCurveTo(960,150,0,90);c.closePath();c.fill();
  // the doorway: the flap tied back, the night outside, a few stars, the camp's fires far off
  c.save();c.beginPath();c.moveTo(1560,700);c.lineTo(1600,250);c.quadraticCurveTo(1720,214,1840,250);c.lineTo(1880,700);c.closePath();c.clip();
  g=c.createLinearGradient(0,240,0,700);g.addColorStop(0,rgba(WI.sky0,1));g.addColorStop(1,rgba(WI.sky1,1));c.fillStyle=g;c.fillRect(1500,200,420,520);
  for(let i=0;i<30;i++){c.fillStyle="rgba(210,236,236,"+(0.2+R()*0.5).toFixed(2)+")";c.beginPath();c.arc(1580+R()*300,250+R()*300,0.7+R()*1.1,0,TAU);c.fill();}
  wi_ridge(c,610,20,53,WI.ridge[1]);c.restore();
  c.fillStyle=rgba(ag_dk(WI.cloth,0.1),1);c.beginPath();c.moveTo(1540,700);c.lineTo(1588,250);c.lineTo(1630,248);c.quadraticCurveTo(1600,420,1610,700);c.closePath();c.fill();
  c.beginPath();c.moveTo(1900,700);c.lineTo(1852,250);c.lineTo(1810,248);c.quadraticCurveTo(1842,420,1830,700);c.closePath();c.fill();
  // the poles
  c.fillStyle=rgba(WI.wood,1);for(const px of [210,1490]){c.fillRect(px-9,80,18,640);c.fillStyle="rgba(255,200,150,0.08)";c.fillRect(px+3,80,4,640);c.fillStyle=rgba(WI.wood,1);}
  // the floor: mats, and the lamp's pool of light
  g=c.createLinearGradient(0,700,0,H);g.addColorStop(0,rgba([40,34,30],1));g.addColorStop(1,rgba([20,16,16],1));c.fillStyle=g;c.fillRect(0,700,W,H-700);
  c.strokeStyle="rgba(0,0,0,0.22)";c.lineWidth=2;for(let j=0;j<7;j++){const y=700+Math.pow(j/7,1.5)*380;c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
  // the lamp on its stand, between the people, and the warm light it throws on the cloth and the floor
  const lx=1010,ly=470;g=c.createRadialGradient(lx,ly,0,lx,ly,760);g.addColorStop(0,rgba(WI.lamp,0.30));g.addColorStop(0.4,rgba(WI.lamp,0.10));g.addColorStop(1,rgba(WI.lamp,0));c.save();c.globalCompositeOperation="lighter";c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
  c.fillStyle=rgba(WI.bronzeDk,1);c.fillRect(lx-5,ly+16,10,250);c.beginPath();c.ellipse(lx,ly+270,40,10,0,0,TAU);c.fill();
  c.fillStyle=rgba(WI.bronze,1);c.beginPath();c.moveTo(lx-34,ly+4);c.quadraticCurveTo(lx,ly+30,lx+34,ly+4);c.closePath();c.fill();
  // halberds in a rack by the far pole, in shadow
  c.strokeStyle=rgba(ag_dk(WI.wood,0.2),1);c.lineWidth=6;for(const hx of [300,330,360]){c.beginPath();c.moveTo(hx,700);c.lineTo(hx+6,180);c.stroke();c.fillStyle="rgba(90,96,96,0.5)";c.beginPath();c.moveTo(hx+6,180);c.lineTo(hx+2,150);c.lineTo(hx+12,180);c.closePath();c.fill();
    c.beginPath();c.moveTo(hx+6,216);c.lineTo(hx+40,206);c.lineTo(hx+8,226);c.closePath();c.fill();}};
// the light of the tent's lamp, drawn live over the place, flickering a little
function wi_lampGlow(ctx,t,x,y,a){a=a==null?1:a;if(a<=0)return;const f=0.92+0.08*Math.sin(t*7.7)*Math.sin(t*3.1+1);ctx.save();ctx.globalAlpha*=a;ctx.globalCompositeOperation="lighter";
  const g=ctx.createRadialGradient(x,y,0,x,y,90*f);g.addColorStop(0,rgba(WI.lampHi,0.85));g.addColorStop(0.25,rgba(WI.lamp,0.4));g.addColorStop(1,rgba(WI.lamp,0));ctx.fillStyle=g;ctx.fillRect(x-90,y-90,180,180);
  ctx.fillStyle=rgba(WI.lampHi,1);ctx.beginPath();ctx.moveTo(x-5,y+2);ctx.quadraticCurveTo(x-4,y-10*f,x+Math.sin(t*6)*1.5,y-20*f);ctx.quadraticCurveTo(x+4,y-10*f,x+5,y+2);ctx.closePath();ctx.fill();ctx.restore();}
// a king's rooms at night: lacquered pillars, a screen, a bed's curtains, a stand where the tally's half is kept, two lamps
AG_PLACES.wiCourt=c=>{const R=ag_rnd(83);
  let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(12,14,18)");g.addColorStop(0.66,"rgb(28,24,26)");g.addColorStop(1,"rgb(14,12,14)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // a folding screen of black lacquer behind, each leaf bordered in red, the lamps' light on its gloss
  for(let i=0;i<6;i++){const x=380+i*190,y=170,w=182,h=540;c.fillStyle=rgba(WI.lacquer,1);c.fillRect(x,y,w,h);c.strokeStyle=rgba(WI.lacquerRed,0.75);c.lineWidth=6;c.strokeRect(x+14,y+14,w-28,h-28);
    const sg=c.createLinearGradient(x,0,x+w,0);sg.addColorStop(0,"rgba(255,220,180,0.02)");sg.addColorStop(0.5,"rgba(255,220,180,0.07)");sg.addColorStop(1,"rgba(255,220,180,0.02)");c.fillStyle=sg;c.fillRect(x,y,w,h);}
  // the bed's curtains on the right, falling in folds
  for(let i=0;i<9;i++){const x=1330+i*36;const fg=c.createLinearGradient(x,0,x+36,0);fg.addColorStop(0,"rgb(52,30,34)");fg.addColorStop(0.5,"rgb(84,50,52)");fg.addColorStop(1,"rgb(46,26,30)");c.fillStyle=fg;c.fillRect(x,120,38,600);}
  // pillars, black lacquer with a red line
  for(const px of [250,1660]){c.fillStyle=rgba(WI.lacquer,1);c.fillRect(px-34,0,68,720);c.fillStyle=rgba(WI.lacquerRed,0.85);c.fillRect(px-34,0,6,720);c.fillStyle="rgba(255,210,160,0.10)";c.fillRect(px+10,0,8,720);}
  c.fillStyle=rgba(WI.lacquer,1);c.fillRect(0,0,W,70);c.fillStyle=rgba(WI.lacquerRed,0.7);c.fillRect(0,66,W,4);
  // the floor of polished boards, the lamps' pools on it
  g=c.createLinearGradient(0,712,0,H);g.addColorStop(0,"rgb(46,34,30)");g.addColorStop(1,"rgb(18,12,12)");c.fillStyle=g;c.fillRect(0,712,W,H-712);
  c.strokeStyle="rgba(0,0,0,0.2)";c.lineWidth=2;for(let i=-10;i<=10;i++){c.beginPath();c.moveTo(960+i*60,712);c.lineTo(960+i*260,H);c.stroke();}
  for(const [lx,ly] of [[470,420],[1450,420]]){g=c.createRadialGradient(lx,ly,0,lx,ly,620);g.addColorStop(0,rgba(WI.lamp,0.26));g.addColorStop(0.45,rgba(WI.lamp,0.08));g.addColorStop(1,rgba(WI.lamp,0));c.save();c.globalCompositeOperation="lighter";c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();
    c.fillStyle=rgba(WI.bronzeDk,1);c.fillRect(lx-5,ly+16,10,290);c.beginPath();c.ellipse(lx,ly+306,42,10,0,0,TAU);c.fill();c.fillStyle=rgba(WI.bronze,1);c.beginPath();c.moveTo(lx-34,ly+4);c.quadraticCurveTo(lx,ly+30,lx+34,ly+4);c.closePath();c.fill();}
  // the stand where the half is kept: a small lacquered box on legs, by the curtains
  c.fillStyle=rgba(WI.lacquer,1);c.fillRect(1120,604,240,30);c.fillStyle=rgba(WI.lacquerRed,0.9);c.fillRect(1120,604,240,4);c.fillStyle=rgba(WI.lacquer,1);c.fillRect(1136,634,14,96);c.fillRect(1330,634,14,96);
  void R;};
// a lacquered table under a lamp, for the tally close up: black lacquer with a red line, silk under the tiger, the lamp off to the left
AG_PLACES.wiTally=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(10,14,18)");g.addColorStop(0.5,"rgb(22,22,24)");g.addColorStop(1,"rgb(8,8,10)");c.fillStyle=g;c.fillRect(0,0,W,H);
  // a hanging behind, dim
  c.fillStyle="rgba(40,30,30,0.6)";c.fillRect(140,0,1640,520);for(let i=0;i<14;i++){const x=140+i*118;const fg=c.createLinearGradient(x,0,x+118,0);fg.addColorStop(0,"rgba(0,0,0,0.18)");fg.addColorStop(0.5,"rgba(255,220,180,0.04)");fg.addColorStop(1,"rgba(0,0,0,0.18)");c.fillStyle=fg;c.fillRect(x,0,118,520);}
  // the table top, in perspective
  c.fillStyle=rgba(WI.lacquer,1);c.beginPath();c.moveTo(-200,1080);c.lineTo(140,560);c.lineTo(1780,560);c.lineTo(2120,1080);c.closePath();c.fill();
  c.strokeStyle=rgba(WI.lacquerRed,0.9);c.lineWidth=5;c.beginPath();c.moveTo(150,575);c.lineTo(1770,575);c.stroke();
  // the lamp's light, off to the left, and its reflection in the lacquer
  g=c.createRadialGradient(300,380,0,300,380,1300);g.addColorStop(0,rgba(WI.lamp,0.30));g.addColorStop(0.35,rgba(WI.lamp,0.10));g.addColorStop(1,rgba(WI.lamp,0));c.save();c.globalCompositeOperation="lighter";c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(760,760,0,760,760,700);g.addColorStop(0,"rgba(255,220,180,0.10)");g.addColorStop(1,"rgba(255,220,180,0)");c.save();c.translate(760,760);c.scale(1.6,0.4);c.translate(-760,-760);c.fillStyle=g;c.fillRect(60,60,1400,1400);c.restore();c.restore();
  // a cloth of silk where the tally lies
  c.fillStyle="rgba(110,92,74,0.55)";c.beginPath();c.moveTo(300,820);c.lineTo(520,640);c.lineTo(1420,640);c.lineTo(1640,820);c.closePath();c.fill();
  c.strokeStyle="rgba(255,230,200,0.10)";c.lineWidth=2;c.beginPath();c.moveTo(520,640);c.lineTo(1420,640);c.stroke();};
// a museum's room in Xi'an today, at night: a dark wall, a glass case on its plinth, lit from above
AG_PLACES.wiMuseum=c=>{let g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,"rgb(8,18,22)");g.addColorStop(0.7,"rgb(14,30,34)");g.addColorStop(1,"rgb(6,14,16)");c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createLinearGradient(0,760,0,H);g.addColorStop(0,"rgb(14,30,32)");g.addColorStop(1,"rgb(6,14,16)");c.fillStyle=g;c.fillRect(0,760,W,H-760);
  c.strokeStyle="rgba(120,200,205,0.05)";c.lineWidth=1;for(let i=-12;i<=12;i++){c.beginPath();c.moveTo(960+i*40,760);c.lineTo(960+i*240,H);c.stroke();}
  // the spotlight from above, and its pool
  c.save();c.globalCompositeOperation="lighter";g=c.createLinearGradient(0,0,0,700);g.addColorStop(0,"rgba(200,240,240,0.10)");g.addColorStop(1,"rgba(200,240,240,0.02)");c.fillStyle=g;
  c.beginPath();c.moveTo(900,0);c.lineTo(1020,0);c.lineTo(1230,700);c.lineTo(690,700);c.closePath();c.fill();c.restore();
  // the plinth
  g=c.createLinearGradient(700,0,1220,0);g.addColorStop(0,"rgb(20,40,44)");g.addColorStop(0.5,"rgb(30,56,60)");g.addColorStop(1,"rgb(16,34,38)");c.fillStyle=g;c.fillRect(700,700,520,380);
  c.fillStyle="rgba(190,245,245,0.20)";c.fillRect(700,700,520,2);
  // the case: glass, its edges catching the light, a sheen across it
  c.fillStyle="rgba(150,220,225,0.05)";c.fillRect(720,330,480,370);
  const sg=c.createLinearGradient(720,330,1200,700);sg.addColorStop(0,"rgba(200,245,245,0.10)");sg.addColorStop(0.35,"rgba(200,245,245,0.02)");sg.addColorStop(0.5,"rgba(200,245,245,0.07)");sg.addColorStop(1,"rgba(200,245,245,0)");c.fillStyle=sg;c.fillRect(720,330,480,370);
  c.fillStyle=rgba(DP.ice,0.55);c.fillRect(720,330,480,2);c.fillRect(720,330,2,370);c.fillRect(1198,330,2,370);c.fillStyle=rgba(DP.ice,0.25);c.fillRect(760,300,480,2);c.fillRect(1238,300,2,370);
  c.strokeStyle=rgba(DP.ice,0.25);c.lineWidth=1.5;c.beginPath();c.moveTo(720,330);c.lineTo(760,300);c.moveTo(1200,330);c.lineTo(1240,300);c.moveTo(1200,700);c.lineTo(1240,670);c.stroke();
  // a small stand inside the case
  c.fillStyle="rgba(200,240,240,0.10)";c.fillRect(860,610,200,8);c.fillRect(950,618,20,82);
  // other cases far off, dim
  for(const [x,w] of [[120,300],[1500,320]]){c.fillStyle="rgba(150,220,225,0.03)";c.fillRect(x,420,w,280);c.fillStyle="rgba(190,245,245,0.10)";c.fillRect(x,420,w,1.5);c.fillStyle="rgb(16,32,36)";c.fillRect(x-10,700,w+20,380);}};

/* ---------------------------------------------------------------- the tally: a small bronze tiger, cut in two along its back
   wi_tiger(ctx, x, y, s, {flip, t, a, seam, seamCol, glow}): one half in profile, as an object of the time: bronze, its tiger's
   stripes cut in it, its rule inlaid in gold along its flank (too small to read: decoration); facing right (the king's, the right
   half) or, flipped, left (the commander's, the left half). (x, y) is the middle of its body; s 1 is 430 px from tail to nose.
   seam (0 to 1) lights the line along its back where it was cut, in seamCol ("gold" while it's whole, "green" once two halves fit). */
function wi_tigerBody(c){c.moveTo(-146,-50);c.bezierCurveTo(-112,-68,-60,-62,-10,-56);c.bezierCurveTo(40,-52,84,-62,112,-74);c.bezierCurveTo(124,-80,134,-92,146,-102);
  c.bezierCurveTo(150,-116,162,-122,170,-112);c.bezierCurveTo(186,-110,204,-100,212,-84);c.bezierCurveTo(220,-74,222,-60,218,-50);c.bezierCurveTo(214,-42,204,-38,194,-37);
  c.bezierCurveTo(196,-30,190,-22,180,-20);c.bezierCurveTo(168,-16,158,-10,154,0);c.bezierCurveTo(156,22,162,44,168,58);c.bezierCurveTo(172,64,182,66,188,70);c.lineTo(130,70);
  c.bezierCurveTo(126,56,120,40,112,28);c.bezierCurveTo(80,36,10,40,-58,30);c.bezierCurveTo(-76,30,-88,36,-96,46);c.bezierCurveTo(-100,54,-100,62,-96,66);c.bezierCurveTo(-92,69,-84,70,-78,70);c.lineTo(-136,70);
  c.bezierCurveTo(-146,54,-152,34,-156,14);c.bezierCurveTo(-160,-8,-160,-34,-146,-50);c.closePath();}
// the far legs, a little behind the near ones
function wi_tigerFar(c){c.moveTo(96,20);c.bezierCurveTo(104,38,112,54,118,64);c.lineTo(150,70);c.lineTo(112,70);c.bezierCurveTo(102,56,92,40,82,26);c.closePath();
  c.moveTo(-104,16);c.bezierCurveTo(-112,34,-114,52,-110,66);c.lineTo(-96,70);c.lineTo(-150,70);c.bezierCurveTo(-142,54,-136,34,-130,14);c.closePath();}
// the rule, inlaid in gold along its flank: eight columns of writing, seen from afar, too small to read (decoration): short strokes of
// uneven length down each column, never letters of any script
function wi_inlay(ctx){const RG=ag_rnd(40);ctx.strokeStyle=rgba(WI.gold,0.72);ctx.lineCap="round";for(let col=0;col<8;col++){const cx=-92+col*16;let y=-42;
  while(y<4){const L=3+RG()*6;ctx.lineWidth=2+RG()*1.4;ctx.beginPath();ctx.moveTo(cx,y);ctx.lineTo(cx,Math.min(4,y+L));ctx.stroke();y+=L+2.6+RG()*2;}}}
const WI_TAIL=[[-150,-42],[-192,-54],[-212,-88],[-222,-112],[-232,-136],[-210,-150],[-200,-130]];
function wi_tiger(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(o.flip?-s:s,s);
  // its shadow on what it lies on
  ctx.save();ctx.translate(0,72);ctx.scale(1,0.12);const sg=ctx.createRadialGradient(0,0,0,0,0,240);sg.addColorStop(0,"rgba(0,0,0,0.45)");sg.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=sg;ctx.fillRect(-260,-260,520,520);ctx.restore();
  const B=WI.bronze,BH=WI.bronzeHi,BD=WI.bronzeDk;
  // the far legs and the tail, darker
  ctx.fillStyle=rgba(ag_dk(B,0.45),1);ctx.beginPath();wi_tigerFar(ctx);ctx.fill();
  ag_taper(ctx,WI_TAIL[0],WI_TAIL[1],WI_TAIL[2],WI_TAIL[3],22,13,rgba(ag_dk(B,0.12),1));
  ctx.save();ctx.lineCap="round";ctx.strokeStyle=rgba(ag_dk(B,0.12),1);ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(...WI_TAIL[3]);ctx.bezierCurveTo(...WI_TAIL[4],...WI_TAIL[5],...WI_TAIL[6]);ctx.stroke();ctx.restore();
  // the body, lit from above and in front, dark under
  ctx.beginPath();wi_tigerBody(ctx);const g=ctx.createLinearGradient(0,-110,0,72);g.addColorStop(0,rgba(BH,1));g.addColorStop(0.35,rgba(B,1));g.addColorStop(1,rgba(BD,1));ctx.fillStyle=g;ctx.fill();
  ctx.save();ctx.clip();
  // patina, here and there, a dull grey green (never the bright green of a check that passes)
  const R=ag_rnd(13);for(let i=0;i<18;i++){const px=-150+R()*340,py=-60+R()*120,pr=10+R()*26;const pg=ctx.createRadialGradient(px,py,0,px,py,pr);pg.addColorStop(0,rgba(WI.patina,0.35));pg.addColorStop(1,rgba(WI.patina,0));ctx.fillStyle=pg;ctx.fillRect(px-pr,py-pr,2*pr,2*pr);}
  // its stripes, cut in the bronze
  ctx.strokeStyle=rgba(ag_dk(BD,0.3),0.7);ctx.lineWidth=4;ctx.lineCap="round";for(const [x0,y0,x1,y1,x2,y2] of [[-126,-56,-118,-30,-128,-6],[-136,-20,-120,0,-130,24],[60,-54,66,-34,58,-16],[96,-66,102,-46,94,-28],[128,-84,142,-74,144,-58],[150,-22,140,-6,150,10]]){
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(x1,y1,x2,y2);ctx.stroke();}
  wi_inlay(ctx);
  // light along its back, shade under
  const lg=ctx.createLinearGradient(0,-112,0,-40);lg.addColorStop(0,"rgba(255,236,190,0.35)");lg.addColorStop(1,"rgba(255,236,190,0)");ctx.fillStyle=lg;ctx.fillRect(-170,-120,400,80);ctx.restore();
  ctx.strokeStyle=rgba(ag_dk(BD,0.4),0.9);ctx.lineWidth=2;ctx.beginPath();wi_tigerBody(ctx);ctx.stroke();
  // the eye and the mouth
  ctx.fillStyle=rgba(ag_dk(BD,0.5),1);ctx.beginPath();ctx.ellipse(188,-84,8,4.6,-0.2,0,TAU);ctx.fill();ctx.fillStyle=rgba(WI.gold,0.9);ctx.beginPath();ctx.ellipse(189,-85,2.8,1.7,-0.2,0,TAU);ctx.fill();
  ctx.strokeStyle=rgba(ag_dk(BD,0.4),0.9);ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(214,-46);ctx.quadraticCurveTo(204,-42,190,-40);ctx.stroke();
  // the seam along its back, where it was cut in two
  const sp=o.seam||0;if(sp>0){const sc=o.seamCol==="green"?DP.F.green:WI.gold;ctx.save();ctx.globalCompositeOperation="lighter";ctx.lineCap="round";ctx.shadowColor=rgba(sc,0.9);ctx.shadowBlur=14/s;
    ctx.strokeStyle=rgba(mix(sc,[255,255,255],0.35),Math.min(1,sp*1.2));ctx.lineWidth=3.2/s+1.2;ctx.beginPath();const P=[[218,-52],[212,-84],[170,-112],[146,-102],[112,-74],[-10,-56],[-112,-66],[-146,-50]];
    const n=Math.max(1,Math.ceil(sp*(P.length-1)));ctx.moveTo(...P[0]);for(let i=1;i<=n;i++){const u=Math.min(1,sp*(P.length-1)-(i-1));ctx.lineTo(lerp(P[i-1][0],P[i][0],u),lerp(P[i-1][1],P[i][1],u));}ctx.stroke();ctx.restore();}
  if(o.glow>0){ctx.save();ctx.globalCompositeOperation="lighter";const gg=ctx.createRadialGradient(20,-20,0,20,-20,320);const gc=o.seamCol==="green"?DP.F.green:WI.gold;gg.addColorStop(0,rgba(gc,0.18*o.glow));gg.addColorStop(1,rgba(gc,0));ctx.fillStyle=gg;ctx.fillRect(-340,-340,680,680);ctx.restore();}
  ctx.restore();}
// two halves fitting together: the commander's (flipped) turns where it lies, then slides onto the king's, u from 0 (apart, at a and b)
// to 1 (one tiger at b); turning first keeps the two tails from meeting halfway
function wi_fit(ctx,a,b,s,u,o){o=o||{};const m=ag_sine(clamp((u-0.35)/0.65,0,1)),kx=lerp(-1,1,ag_sine(clamp(u/0.4,0,1)));
  const ax=lerp(a[0],b[0],m),ay=lerp(a[1],b[1],m);
  if(u<1){ctx.save();ctx.translate(ax,ay);ctx.scale(kx>=0?Math.max(0.04,kx):Math.min(-0.04,kx),1);wi_tiger(ctx,0,0,s,{t:o.t,a:o.a});ctx.restore();}
  wi_tiger(ctx,b[0],b[1],s,{t:o.t,a:o.a,seam:o.seam,seamCol:o.seamCol,glow:o.glow});
  if(u>=1)return;}

/* ---------------------------------------------------------------- an order on bamboo slips, bound with two cords */
function wi_slips(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0)return;ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.rotate(o.rot||0);ctx.scale(s,s);
  const n=8,w=15,h=150;ctx.save();ctx.shadowColor="rgba(0,0,0,0.4)";ctx.shadowBlur=10;ctx.shadowOffsetY=4;ctx.fillStyle="rgb(120,96,58)";ctx.fillRect(-n*w/2,-h/2,n*w,h);ctx.restore();
  for(let i=0;i<n;i++){const sx=-n*w/2+i*w,g=ctx.createLinearGradient(sx,0,sx+w,0);g.addColorStop(0,"rgb(196,166,108)");g.addColorStop(0.5,"rgb(222,196,140)");g.addColorStop(1,"rgb(170,140,88)");ctx.fillStyle=g;ctx.fillRect(sx+0.6,-h/2,w-1.2,h);
    ctx.fillStyle="rgba(40,26,14,0.7)";for(let k=0;k<9;k++){const ky=-h/2+14+k*14;if((i+k)%3===0)continue;ctx.fillRect(sx+w/2-2.6,ky,5.2,2.2);ctx.fillRect(sx+w/2-0.8,ky-2,1.6,6);}}
  ctx.strokeStyle="rgb(92,54,30)";ctx.lineWidth=3;for(const cy of [-h/2+26,h/2-26]){ctx.beginPath();ctx.moveTo(-n*w/2-3,cy);ctx.lineTo(n*w/2+3,cy);ctx.stroke();}ctx.restore();}

/* ---------------------------------------------------------------- the people of the time
   ag_person specs, each with a key of its own, so each is painted once. Hair in a topknot (wi_knot), under a small black cap for
   a king or a lord (wi_cap), or a cloth for a messenger and the soldiers (wi_cloth); armour of small lacquered plates, laced in rows
   (wi_armour). Everything inside the head's picture (figure x 160 to 440, y 250 to 560). */
// hair combed up from the hairline to a topknot at the crown (the kit paints no hair for these heads: style "shaved")
function wi_hairUp(c,P){const hc=P.hair.c;ag_soft(c,AG_HAIR.cropped,hc,ag_lt(hc,0.32),330,300,110,"rgba(0,0,0,0.45)",16);
  c.save();ag_shape(c,AG_HAIR.cropped);c.clip();c.strokeStyle=rgba(ag_lt(hc,0.5),0.18);c.lineWidth=1.8;c.lineCap="round";
  for(const [x0,y0] of [[384,352],[364,350],[340,354],[318,362],[300,374],[230,440],[220,410],[214,380],[222,350],[236,326]]){c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo((x0+292)/2+(x0<290?-6:8),(y0+284)/2,292,284);c.stroke();}c.restore();
  // the hairline over the brow, soft
  c.strokeStyle=rgba(mix(P.skin,hc,0.4),0.35);c.lineWidth=2.2;c.beginPath();c.moveTo(304,368);c.bezierCurveTo(326,354,356,348,386,350);c.stroke();}
function wi_knot(c,P){wi_hairUp(c,P);const hc=P.hair.c;ag_soft(c,cc=>{cc.ellipse(292,284,30,24,-0.2,0,TAU);},hc,ag_lt(hc,0.3),300,272,30,"rgba(0,0,0,0.4)",8);}
// the robe's collar, crossed right over left as the period wore it: drawn for a person facing right, or (mirrored, for one drawn
// flipped, facing left) from the near side of the neck down under the far arm, so it still crosses right over left once flipped
function wi_robe(mirrored){return(c,P)=>{const band=P.top.band||ag_dk(P.top.c,0.35),inner2=P.top.inner||[232,226,212];c.save();ag_shape(c,AG_F.torso);c.clip();
  ag_soft(c,cc=>{cc.moveTo(236,566);cc.bezierCurveTo(270,600,320,616,358,604);cc.lineTo(350,640);cc.bezierCurveTo(300,650,262,628,236,598);cc.closePath();},inner2,ag_lt(inner2,0.5),320,610,70,null);
  if(!mirrored)ag_soft(c,cc=>{cc.moveTo(362,600);cc.bezierCurveTo(330,690,240,800,120,880);cc.lineTo(120,940);cc.bezierCurveTo(250,850,350,740,396,624);cc.closePath();},band,ag_lt(band,0.3),330,700,160,rgba(ag_dk(band,0.7),0.4),8);
  else ag_soft(c,cc=>{cc.moveTo(232,566);cc.bezierCurveTo(262,660,340,770,436,860);cc.lineTo(436,926);cc.bezierCurveTo(326,820,232,700,200,600);cc.closePath();},band,ag_lt(band,0.3),330,700,160,rgba(ag_dk(band,0.7),0.4),8);
  c.restore();};}
function wi_cap(col,pin){return(c,P)=>{wi_knot(c,P);
  // a small cap over the topknot, its band round the knot's foot, a pin through it, and a cord down past the ear to the chin
  ag_soft(c,cc=>{cc.moveTo(256,300);cc.bezierCurveTo(254,268,270,252,296,252);cc.bezierCurveTo(324,252,338,268,334,298);cc.bezierCurveTo(318,306,276,308,256,300);cc.closePath();},col,ag_lt(col,0.25),306,262,40,"rgba(0,0,0,0.4)",8);
  c.fillStyle=rgba(ag_lt(col,0.18),1);c.beginPath();c.moveTo(254,298);c.bezierCurveTo(276,308,318,306,336,296);c.lineTo(336,304);c.bezierCurveTo(318,314,276,316,254,306);c.closePath();c.fill();
  c.strokeStyle=rgba(pin||[212,190,140],1);c.lineWidth=3.4;c.lineCap="round";c.beginPath();c.moveTo(236,282);c.lineTo(354,274);c.stroke();
  c.strokeStyle=rgba(ag_dk(col,0.1),0.9);c.lineWidth=2.4;c.beginPath();c.moveTo(262,306);c.bezierCurveTo(258,360,268,420,276,470);c.bezierCurveTo(282,500,300,520,322,526);c.stroke();};}
function wi_cloth(col){return(c,P)=>{wi_hairUp(c,P);
  // a cloth wrapped round the topknot at the crown, its ends tucked, and a narrow band of the same cloth along the hairline
  c.strokeStyle=rgba(ag_dk(col,0.05),1);c.lineWidth=9;c.lineCap="round";c.beginPath();c.moveTo(232,346);c.bezierCurveTo(260,318,320,306,384,334);c.stroke();
  c.strokeStyle=rgba(ag_lt(col,0.25),0.5);c.lineWidth=2;c.beginPath();c.moveTo(236,341);c.bezierCurveTo(262,315,320,303,382,329);c.stroke();
  ag_soft(c,cc=>{cc.ellipse(292,280,32,26,-0.25,0,TAU);},col,ag_lt(col,0.3),300,266,32,"rgba(0,0,0,0.4)",8);
  c.strokeStyle=rgba(ag_dk(col,0.35),0.7);c.lineWidth=2;c.beginPath();c.moveTo(266,276);c.quadraticCurveTo(292,266,318,276);c.moveTo(268,290);c.quadraticCurveTo(294,282,318,290);c.stroke();};}
// an officer's long cap: a stiff band of black over the topknot, tilted back, tied under the chin
function wi_longCap(col){return(c,P)=>{wi_knot(c,P);
  const cap=cc=>{cc.moveTo(246,302);cc.bezierCurveTo(238,282,242,262,262,254);cc.lineTo(334,252);cc.bezierCurveTo(352,260,356,282,348,302);cc.bezierCurveTo(320,310,274,310,246,302);cc.closePath();};
  ag_soft(c,cap,col,ag_lt(col,0.3),310,262,50,"rgba(0,0,0,0.4)",8);c.strokeStyle="rgba(190,230,235,0.32)";c.lineWidth=2;ag_shape(c,cap);c.stroke();
  c.fillStyle=rgba(ag_lt(col,0.16),1);c.beginPath();c.moveTo(248,298);c.bezierCurveTo(276,308,318,308,344,298);c.lineTo(344,306);c.bezierCurveTo(318,316,276,316,248,306);c.closePath();c.fill();
  c.strokeStyle=rgba(ag_dk(col,0.1),0.9);c.lineWidth=2.4;c.beginPath();c.moveTo(254,306);c.bezierCurveTo(250,360,262,420,272,470);c.bezierCurveTo(280,500,300,520,322,526);c.stroke();};}
// a general's cap: two stiff lobes over the topknot, tied under the chin
function wi_splitCap(col){return(c,P)=>{wi_knot(c,P);
  const cap=cc=>{cc.moveTo(248,302);cc.bezierCurveTo(240,276,250,254,270,254);cc.bezierCurveTo(284,254,292,264,296,274);cc.bezierCurveTo(300,262,310,252,326,254);
    cc.bezierCurveTo(346,256,352,282,344,302);cc.bezierCurveTo(318,310,274,310,248,302);cc.closePath();};
  ag_soft(c,cap,col,ag_lt(col,0.3),300,262,46,"rgba(0,0,0,0.4)",8);c.strokeStyle="rgba(190,230,235,0.32)";c.lineWidth=2;ag_shape(c,cap);c.stroke();
  c.fillStyle=rgba(ag_lt(col,0.16),1);c.beginPath();c.moveTo(246,300);c.bezierCurveTo(276,310,318,310,346,300);c.lineTo(346,308);c.bezierCurveTo(318,318,276,318,246,308);c.closePath();c.fill();
  c.strokeStyle=rgba(ag_dk(col,0.1),0.9);c.lineWidth=2.4;c.beginPath();c.moveTo(252,308);c.bezierCurveTo(248,360,262,420,272,470);c.bezierCurveTo(280,500,300,520,322,526);c.stroke();};}
// a belt round a short robe
function wi_belt(c,col){c.save();ag_shape(c,AG_F.torso);c.clip();ag_soft(c,cc=>{cc.rect(80,990,380,30);},col,ag_lt(col,0.3),330,1000,120,null);c.restore();}
// lacquered leather armour: small plates in rows, laced, over the robe's chest, under the collar
function wi_armour(col,lace){return(c,P)=>{c.save();ag_shape(c,AG_F.torso);c.clip();const R=ag_rnd(5);
  for(let r=0;r<8;r++){const y=640+r*54;for(let k=0;k<9;k++){const x=96+k*42+(r%2)*21,w=40,h=50;const g=c.createLinearGradient(x,y,x,y+h);g.addColorStop(0,rgba(ag_lt(col,0.18),1));g.addColorStop(1,rgba(ag_dk(col,0.2),1));
    c.fillStyle=g;rr(c,x,y,w,h,6);c.fill();c.strokeStyle=rgba(ag_dk(col,0.5),0.9);c.lineWidth=1.6;c.stroke();
    c.fillStyle=rgba(lace,0.9);c.fillRect(x+w/2-1.5,y+6,3,8);c.fillRect(x+w/2-1.5,y+h-14,3,8);void R;}}
  // a belt
  c.fillStyle=rgba(ag_dk(col,0.35),1);c.fillRect(80,1060,380,30);c.restore();};}
const WI_P={
  king:{key:"wi-king",name:"A king",skin:[222,184,150],hair:{style:"shaved",c:[22,20,22]},beard:[34,28,26],top:{kind:"wi_robe",c:[30,28,32],band:[120,44,38],inner:[220,206,182],paint:wi_robe(false)},hat:{paint:wi_cap([14,12,14],[220,196,140])},breath:0.24},
  commander:{key:"wi-commander",name:"A commander",skin:[206,164,124],hair:{style:"shaved",c:[26,22,22]},beard:[38,30,28],top:{kind:"wi_robe",c:[92,46,40],band:[60,30,26],inner:[214,198,170],paint:(c,P)=>{wi_robe(false)(c,P);wi_armour([58,44,38],[150,120,80])(c,P);}},hat:{paint:wi_longCap([30,30,36])},breath:0.26},
  messenger:{key:"wi-messenger",name:"A messenger",skin:[214,170,128],hair:{style:"shaved",c:[28,24,22]},top:{kind:"wi_robe",c:[104,88,70],band:[70,58,46],inner:[214,200,176],paint:(c,P)=>{wi_robe(false)(c,P);wi_belt(c,[60,46,34]);}},hat:{paint:wi_cloth([88,74,60])},breath:0.32},
  messengerL:{key:"wi-messenger-l",name:"A messenger",skin:[214,170,128],hair:{style:"shaved",c:[28,24,22]},top:{kind:"wi_robe",c:[104,88,70],band:[70,58,46],inner:[214,200,176],paint:(c,P)=>{wi_robe(true)(c,P);wi_belt(c,[60,46,34]);}},hat:{paint:wi_cloth([88,74,60])},breath:0.32},
  weiking:{key:"wi-weiking",name:"Wei's king",skin:[226,190,158],hair:{style:"shaved",c:[120,116,112]},beard:[150,146,142],top:{kind:"wi_robe",c:[44,40,58],band:[150,124,70],inner:[226,214,190],paint:wi_robe(false)},hat:{paint:wi_cap([14,12,14],[226,204,150])},breath:0.22},
  xinling:{key:"wi-xinling",name:"Lord Xinling",skin:[230,196,162],hair:{style:"shaved",c:[20,18,20]},beard:[30,26,24],top:{kind:"wi_robe",c:[54,66,72],band:[30,34,40],inner:[230,222,204],paint:wi_robe(false)},hat:{paint:wi_cap([16,14,16],[200,206,212])},breath:0.29},
  xinlingL:{key:"wi-xinling-l",name:"Lord Xinling",skin:[230,196,162],hair:{style:"shaved",c:[20,18,20]},beard:[30,26,24],top:{kind:"wi_robe",c:[54,66,72],band:[30,34,40],inner:[230,222,204],paint:wi_robe(true)},hat:{paint:wi_cap([16,14,16],[200,206,212])},breath:0.29},
  jinbi:{key:"wi-jinbi",name:"Jin Bi",skin:[200,156,118],hair:{style:"shaved",c:[92,88,84]},beard:[120,116,110],top:{kind:"wi_robe",c:[70,42,38],band:[44,26,24],inner:[214,198,170],paint:(c,P)=>{wi_robe(false)(c,P);wi_armour([46,40,40],[160,130,90])(c,P);}},hat:{paint:wi_splitCap([30,30,36])},breath:0.23}
};
DP_PEOPLE.push([WI_P.king,"lamp"],[WI_P.commander,"lamp"],[WI_P.messenger,"lamp"],[WI_P.messengerL,"lamp"],[WI_P.weiking,"lamp"],[WI_P.xinling,"lamp"],[WI_P.xinlingL,"lamp"],[WI_P.jinbi,"lamp"]);
