/* ===== Today, and where it's going: the film's own pictures (prefixed d7_) =====
   An imagined street in the utility's own region in 2045, at sunrise, built as a modern one might be: homes with solar roofs, batteries
   and heat pumps; no poles or overhead lines, but cables under the street, seen in a cut-away, with power moving in them from home to
   home; a kiosk on the pavement whose transformer's readings drift; a car on charge, and the crew's electric van, which comes before
   the transformer fails. On the wall and on the films' dark glass: the hundred and forty systems from Day one, as a list and
   as application components placed under capabilities; a spreadsheet on paper; the technology beneath (nodes); paper notes from the
   canvases becoming elements of one model; today and the target side by side; gaps, plateaus and the path between them; and a
   decision record. The imagined street is labelled as imagined, and set in the series' own fictional region (the proposal's rule for
   future openings). */

const STR=LAY6[1][1],BUS=LAY6[2][1],APL=LAY6[4][1],TEC=LAY6[5][1],MOT=LAY6[0][1];
// the path from today to a target: ArchiMate's implementation and migration elements (plateaus, gaps), in a soft pink
const MIG=[248,184,226],D7_RED=[232,96,84],D7_SUN=[255,196,120];
// the systems on Day one's list, and more of the same kind: placed under capabilities, they're texture, not something to read
const D7_SYS=["OMS · outages","CIS · customers","SCADA · network control","GIS · network map","AMI head-end · meters","MDM · meter data","Billing","ERP · finance","EAM · assets","DMS · distribution","CRM","Field mobility","Data warehouse","HR · payroll","Spreadsheet · ops roster","Market gateway","Document store","Spreadsheet · tariffs",
  "Fleet portal","Fleet portal 2","Storm tool","Hardship register","Complaints log","Life support register","Connections portal","Design tool","Protection settings","Weather feed","Asset photos","Vegetation app","Load forecast","Settlement","Contracts register","Procurement","Training records","Safety incidents","Website","Contact centre phones","Network model","Planning studies","Hydro scheduling","Wind SCADA","Regulatory reports"];

/* ---------- 2045: an imagined street at sunrise ---------- */
// the sky: night to dawn as sun goes from 0 to 1, with the sun coming up behind the hills; keep draws it in the current transform
function d7_sky(ctx,S,sun,keep){if(!keep)setScreen(ctx,S);const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,rgba(mix([10,16,36],[40,70,120],sun),1));g.addColorStop(0.55,rgba(mix([22,26,52],[230,150,110],sun),1));g.addColorStop(1,rgba(mix([30,28,40],[255,200,140],sun),1));
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);for(let i=0;i<60;i++){ctx.fillStyle="rgba(255,255,255,"+(0.5*(1-sun)*hash(i,700))+")";ctx.fillRect(hash(i,701)*W,hash(i,702)*H*0.5,2,2);}
  const sy=lerp(760,380,ease(sun));glow(ctx,D7_SUNX,sy,260,D7_SUN,0.35*sun);ctx.fillStyle=rgba([255,226,170],0.95*clamp(sun*2,0,1));ctx.beginPath();ctx.arc(D7_SUNX,sy,54,0,TAU);ctx.fill();
  // far hills, with wind turbines on the ridge
  ctx.fillStyle=rgba(mix([18,22,40],[96,80,100],sun),1);ctx.beginPath();ctx.moveTo(0,640);for(let x=0;x<=W;x+=40)ctx.lineTo(x,600+Math.sin(x*0.004)*36+Math.sin(x*0.011)*14);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();}
function d7_turbine(ctx,x,y,s,t,col){ctx.save();ctx.strokeStyle=col;ctx.lineWidth=3*s;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-90*s);ctx.stroke();for(let k=0;k<3;k++){const an=t*0.8+k*TAU/3;ctx.beginPath();ctx.moveTo(x,y-90*s);ctx.lineTo(x+Math.cos(an)*40*s,y-90*s+Math.sin(an)*40*s);ctx.stroke();}ctx.restore();}
// The street, as a modern one might be built: no poles and no overhead lines. Power runs in cables under the street, shown in a
// cut-away below the road: a low-voltage cable along the street, with a service cable up to each home, and a medium-voltage feeder,
// deeper, that comes up into a kiosk on the pavement (a compact substation, whose transformer steps the feeder down for the street).
const D7_GY=742,D7_RY=798,D7_SY=806,D7_TY=868,D7_MY=934,D7_KX=940,D7_SUNX=1180;
// the homes: where each stands, its width and height, its kind (a flat roof with panels or plants, a single pitch whose whole roof is
// solar glass, or a narrow townhouse), and its walls (render, warm grey with timber, or light concrete)
const D7_HOUSES=[{x:175,w:250,h:250,kind:"flat",roof:"pv",tone:0},{x:470,w:230,h:206,kind:"mono",dir:1,tone:1},{x:760,w:200,h:322,kind:"tall",tone:2},
  {x:1120,w:230,h:214,kind:"mono",dir:-1,tone:0},{x:1470,w:260,h:236,kind:"flat",roof:"green",tone:1},{x:1775,w:250,h:208,kind:"mono",dir:1,tone:2}];
// where each home's battery hangs on its wall, and its service cable comes up from the street
const D7_SX=D7_HOUSES.map(h=>h.x-h.w/2+h.w*(h.kind==="flat"?0.8:h.kind==="tall"?0.87:h.dir>0?0.17:0.83));
// power between homes, under the street: down one home's service cable, along the street's cable, and up another's
const D7_PAIRS=[[0,2],[1,4],[5,3],[2,5],[4,0],[3,1],[1,5],[4,2],[0,3],[5,1]];
const D7_TPATH=D7_PAIRS.map(([a,b])=>mk([P(D7_SX[a],D7_SY+2),P(D7_SX[a],D7_TY),P(D7_SX[b],D7_TY),P(D7_SX[b],D7_SY+2)]));
// power from the grid, in the night: along the feeder to the kiosk, and from the kiosk along the street to each home
const D7_GPATH=mk([P(-20,D7_MY),P(D7_KX-26,D7_MY),P(D7_KX-26,D7_SY+2)]);
const D7_LPATH=D7_SX.map(sx=>mk([P(D7_KX+26,D7_SY+2),P(D7_KX+26,D7_TY),P(sx,D7_TY),P(sx,D7_SY+2)]));

// a pane of glass: the sky reflected in it, a streak of light, and a warm room behind it while it's dark (lit, 0..1)
function d7_glass(ctx,x,y,w,h,sun,lit,o){o=o||{};const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,rgba(mix([34,44,74],[176,186,206],sun),1));g.addColorStop(1,rgba(mix([18,22,40],[96,112,140],sun),1));
  ctx.fillStyle=g;ctx.fillRect(x,y,w,h);if(lit>0.01){ctx.fillStyle=rgba([255,206,140],0.62*lit);ctx.fillRect(x,y,w,h);}
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.fillStyle="rgba(255,255,255,"+(0.06+0.1*sun)+")";ctx.beginPath();ctx.moveTo(x+w*0.15,y);ctx.lineTo(x+w*0.4,y);ctx.lineTo(x+w*0.1,y+h);ctx.lineTo(x-w*0.15,y+h);ctx.closePath();ctx.fill();ctx.restore();
  ctx.strokeStyle=rgba(mix([18,20,26],[52,56,64],sun),1);ctx.lineWidth=3;ctx.strokeRect(x,y,w,h);if(o.mull){ctx.lineWidth=2;ctx.beginPath();for(let k=1;k<o.mull;k++){ctx.moveTo(x+w*k/o.mull,y);ctx.lineTo(x+w*k/o.mull,y+h);}ctx.stroke();}}
// solar glass, inside path: dark blue cells and a fine grid, a sheen in daylight, and the sunrise crossing it once as a band of light
// (u, 0..1, where the band is; glint, how bright)
function d7_solar(ctx,path,bx,by,bw,bh,u,glint){ctx.save();path();ctx.clip();ctx.fillStyle="#17264a";ctx.fillRect(bx,by,bw,bh);ctx.strokeStyle="rgba(150,180,235,0.35)";ctx.lineWidth=1;
  for(let x=bx;x<bx+bw;x+=14){ctx.beginPath();ctx.moveTo(x,by);ctx.lineTo(x+6,by+bh);ctx.stroke();}for(let y=by;y<by+bh;y+=8){ctx.beginPath();ctx.moveTo(bx,y);ctx.lineTo(bx+bw,y);ctx.stroke();}
  ctx.fillStyle="rgba(255,240,220,"+(0.1*glint)+")";ctx.fillRect(bx,by,bw,bh);
  if(glint>0.01){const gx=bx+(u*1.6-0.3)*bw,g=ctx.createLinearGradient(gx-60,0,gx+60,0);g.addColorStop(0,"rgba(255,230,190,0)");g.addColorStop(0.5,"rgba(255,232,196,"+(0.55*glint)+")");g.addColorStop(1,"rgba(255,230,190,0)");ctx.fillStyle=g;ctx.fillRect(bx,by,bw,bh);}
  ctx.restore();}
// a heat pump's outdoor unit, its fan turning
function d7_heatpump(ctx,x,y,t,sun){ctx.save();ctx.fillStyle=rgba(mix([60,64,72],[222,226,230],sun),1);rr(ctx,x,y,54,42,5);ctx.fill();ctx.strokeStyle=rgba(mix([30,32,40],[150,156,164],sun),1);ctx.lineWidth=1.5;rr(ctx,x,y,54,42,5);ctx.stroke();
  const cx=x+21,cy=y+21;ctx.beginPath();ctx.arc(cx,cy,15,0,TAU);ctx.stroke();ctx.fillStyle=rgba(mix([24,26,32],[90,96,106],sun),1);for(let k=0;k<3;k++){const an=t*4+k*TAU/3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,12,an,an+0.7);ctx.closePath();ctx.fill();}
  ctx.fillRect(x+42,y+8,6,26);ctx.restore();}
// a home battery: a slim unit on the wall, with a light strip that shows its charge, glowing while it trades
function d7_battery(ctx,x,y,level,lit,sun){ctx.save();ctx.fillStyle=rgba(mix([70,74,82],[236,239,242],sun),1);rr(ctx,x-12,y,24,70,6);ctx.fill();ctx.strokeStyle="rgba(20,24,30,0.4)";ctx.lineWidth=1.2;rr(ctx,x-12,y,24,70,6);ctx.stroke();
  ctx.fillStyle="rgba(30,36,44,0.85)";rr(ctx,x-3,y+8,6,54,3);ctx.fill();const lv=clamp(level,0,1);ctx.fillStyle="rgba(130,236,160,0.95)";rr(ctx,x-3,y+8+54*(1-lv),6,54*lv,3);ctx.fill();
  if(lit>0.01)glow(ctx,x,y+35,30,[130,236,160],0.45*lit);ctx.restore();}
// one home, standing on the street at D7_GY: hs from D7_HOUSES; o.level (its battery's charge), o.lit (trading), o.room (rooms lit)
function d7_house(ctx,hs,i,t,sun,o){o=o||{};const{x,w,h}=hs,x0=x-w/2,x1=x+w/2,yb=D7_GY,yt=yb-h,u=f=>x0+w*f,tall=hs.kind==="tall",mono=hs.kind==="mono",dir=hs.dir||1;
  const base=[[236,230,220],[218,210,198],[204,207,210]][hs.tone],body=mix([38,40,52],base,0.16+0.84*sun),room=k=>(o.room||0)*(hash(i*5+k,740)>0.3?1:0.15);
  // a single pitch rises 60 px across the front, to the right (dir 1) or to the left (dir -1); roofY(f) is its height at f across
  const yl=mono?yt+30*dir:yt,yr=mono?yt-30*dir:yt,roofY=f=>lerp(yl,yr,f);
  ctx.save();
  // the walls, with the side away from the sun in shade, and the sunrise on the rest
  const wall=()=>{ctx.beginPath();ctx.moveTo(x0,yb);ctx.lineTo(x0,yl);ctx.lineTo(x1,yr);ctx.lineTo(x1,yb);ctx.closePath();};
  wall();ctx.fillStyle=rgba(body,1);ctx.fill();ctx.save();wall();ctx.clip();
  ctx.fillStyle="rgba(0,0,0,0.16)";ctx.fillRect(x>D7_SUNX?x1-w*0.12:x0,yt-60,w*0.12,h+60);ctx.fillStyle="rgba(255,176,110,"+(0.1*sun)+")";ctx.fillRect(x0,yt-60,w,h+60);
  // timber cladding: a strip down a townhouse, the low half of a single pitch, or the upper floor beside a flat roof's windows
  if(tall||hs.tone===1){const[f0,f1,ty,th]=tall?[0,0.18,yt,h]:mono?(dir>0?[0,0.5,yt-40,h+40]:[0.5,1,yt-40,h+40]):[0.55,1,yt-40,h*0.5+40],tx=u(f0),tw_=w*(f1-f0);
    ctx.fillStyle=rgba(mix([44,34,28],[176,124,82],0.12+0.88*sun),1);ctx.fillRect(tx,ty,tw_,th);ctx.strokeStyle="rgba(60,36,20,0.35)";ctx.lineWidth=1.2;for(let bx=tx+7;bx<tx+tw_;bx+=8){ctx.beginPath();ctx.moveTo(bx,ty);ctx.lineTo(bx,ty+th);ctx.stroke();}}
  ctx.restore();
  // windows: a flat roof's big ground-floor glazing and a ribbon above; a single pitch's tall glazing on its high side; a townhouse's
  // three floors, with glass balconies and planters above the ground
  let dx;
  if(hs.kind==="flat"){d7_glass(ctx,u(0.05),yb-h*0.44,w*0.4,h*0.44-4,sun,room(0),{mull:2});d7_glass(ctx,u(0.05),yt+h*0.14,w*0.45,h*0.2,sun,room(1),{mull:3});dx=u(0.5);}
  else if(mono){const f0=dir>0?0.56:0.06,gy=roofY(dir>0?f0:f0+0.38)+26;d7_glass(ctx,u(f0),gy,w*0.38,yb-4-gy,sun,room(0),{mull:2});dx=dir>0?u(0.36):u(0.64)-34;}
  else{for(let f=0;f<3;f++){const fy=yb-(f+1)*h/3+16;d7_glass(ctx,u(f?0.26:0.3),fy,w*(f?0.62:0.44),h/3-36,sun,room(f),{mull:2});
    if(f>0){ctx.fillStyle="rgba(190,220,240,"+(0.1+0.08*sun)+")";ctx.fillRect(u(0.2),fy+h/3-58,w*0.74,26);ctx.strokeStyle=rgba(mix([30,32,40],[90,96,106],sun),1);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(u(0.2),fy+h/3-58);ctx.lineTo(u(0.94),fy+h/3-58);ctx.stroke();
      for(let k=0;k<5;k++){ctx.fillStyle=rgba(mix([22,40,30],[90,150,80],0.1+0.9*sun),1);ctx.beginPath();ctx.arc(u(0.3)+k*16,fy+h/3-60+Math.sin(t*1.2+k+f)*1.2,8+3*hash(k+f*7,741),0,TAU);ctx.fill();}}}dx=u(0.06);}
  // the door; the battery on the wall beside it, and the heat pump below the battery (a townhouse has no room for one at the front)
  ctx.fillStyle=rgba(mix([20,22,28],[52,56,64],sun),1);ctx.fillRect(dx,yb-82,34,82);ctx.fillStyle=rgba(mix([60,62,70],[200,200,204],sun),1);ctx.fillRect(dx+26,yb-52,3,22);
  if(!tall)d7_heatpump(ctx,D7_SX[i]-27,yb-42,t+i,sun);
  d7_battery(ctx,D7_SX[i],yb-118,o.level==null?0.6:o.level,o.lit||0,sun);
  // the roof: a single pitch is solar glass from edge to edge; a flat roof has a parapet, and tilted panels (among plants, on a green roof)
  const cap=rgba(mix([22,24,30],[70,74,82],sun),1),band=k=>clamp(sun*1.25-0.1-0.04*k,0,1);
  if(mono){const top=()=>{ctx.beginPath();ctx.moveTo(x0-8,yl+2);ctx.lineTo(x1+8,yr+2);ctx.lineTo(x1+20,yr-16);ctx.lineTo(x0+4,yl-16);ctx.closePath();};
    d7_solar(ctx,top,x0-8,Math.min(yl,yr)-20,w+30,Math.abs(yl-yr)+26,band(i),sun);ctx.strokeStyle=cap;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0-8,yl+2);ctx.lineTo(x1+8,yr+2);ctx.stroke();}
  else{ctx.fillStyle=cap;ctx.fillRect(x0-4,yt-8,w+8,9);
    if(hs.roof==="green")for(let k=0;k<18;k++){ctx.fillStyle=rgba(mix([20,36,28],[96,150,76],0.1+0.9*sun),1);ctx.beginPath();ctx.arc(x0+8+k*(w-16)/17,yt-10+Math.sin(t*1.1+k)*0.8,7+4*hash(k,742),Math.PI,0);ctx.fill();}
    const np=hs.roof==="green"||tall?2:4,px0=hs.roof==="green"?x1-w*0.42:x0+w*0.1;
    for(let k=0;k<np;k++){const px=px0+k*46,side=px<D7_SUNX?1:-1,pan=()=>{ctx.beginPath();ctx.moveTo(px,yt-9);ctx.lineTo(px+40,yt-9);ctx.lineTo(px+40-side*8,yt-32);ctx.lineTo(px-side*8,yt-32);ctx.closePath();};
      d7_solar(ctx,pan,px-10,yt-34,60,28,band(i+k*0.5),sun);ctx.strokeStyle=cap;ctx.lineWidth=1.5;pan();ctx.stroke();ctx.beginPath();ctx.moveTo(px+20,yt-9);ctx.lineTo(px+20-side*4,yt-20);ctx.stroke();}}
  ctx.restore();}
// a street tree, drawn as a living thing: a tapering trunk, and leaves in overlapping masses, lit on the side towards the sun, moving
// a little in the wind
const D7_LEAF=[[0,-176,54],[-44,-146,44],[42,-148,46],[-20,-210,42],[26,-214,42],[-56,-182,34],[58,-184,34],[2,-128,38]];
function d7_tree(ctx,x,yb,s,t,sun,seed){ctx.save();ctx.translate(x,yb);ctx.scale(s,s);const sway=Math.sin(t*0.9+seed)*2.2,lt=x<D7_SUNX?1:-1;
  ctx.fillStyle=rgba(mix([22,18,16],[96,72,52],0.12+0.88*sun),1);ctx.beginPath();ctx.moveTo(-8,0);ctx.bezierCurveTo(-6,-50,-5,-90,-2+sway*0.3,-130);ctx.lineTo(3+sway*0.3,-130);ctx.bezierCurveTo(5,-90,6,-50,8,0);ctx.closePath();ctx.fill();
  ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,-96);ctx.quadraticCurveTo(-18,-118,-30+sway*0.5,-136);ctx.moveTo(1,-108);ctx.quadraticCurveTo(18,-128,28+sway*0.5,-146);ctx.stroke();
  const blob=(cx,cy,r,k)=>{ctx.beginPath();for(let j=0;j<=36;j++){const an=j/36*TAU,rr_=r*(1+0.08*Math.sin(an*7+k*3+seed)+0.04*Math.sin(an*3+t*1.3+k));const px=cx+Math.cos(an)*rr_,py=cy+Math.sin(an)*rr_;j?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();};
  D7_LEAF.forEach(([cx,cy,r],k)=>{const sx=sway*(0.6+0.4*(-cy/210));blob(cx+sx-4*lt,cy+5,r,k);ctx.fillStyle=rgba(mix([10,20,18],[40,76,50],0.12+0.88*sun),1);ctx.fill();});
  D7_LEAF.forEach(([cx,cy,r],k)=>{const sx=sway*(0.6+0.4*(-cy/210));blob(cx+sx,cy,r*0.94,k);const g=ctx.createLinearGradient(cx-r*lt,0,cx+r*lt,0);g.addColorStop(0,rgba(mix([16,30,26],[58,104,62],0.12+0.88*sun),1));g.addColorStop(1,rgba(mix([22,40,32],[130,178,92],0.12+0.88*sun),1));ctx.fillStyle=g;ctx.fill();});
  ctx.restore();}
// an LED street light: a slim post, a flat head, and a pool of light that goes out as the sun comes up
function d7_lamp(ctx,x,yb,sun){const on=1-sstep(0.4,0.7,sun);ctx.save();if(on>0.01){const g=ctx.createLinearGradient(0,yb-246,0,yb);g.addColorStop(0,"rgba(255,238,210,"+(0.22*on)+")");g.addColorStop(1,"rgba(255,238,210,0)");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+18,yb-240);ctx.lineTo(x+62,yb-240);ctx.lineTo(x+130,yb+50);ctx.lineTo(x-50,yb+50);ctx.closePath();ctx.fill();}
  ctx.fillStyle=rgba(mix([24,26,32],[96,100,108],sun),1);ctx.fillRect(x-4,yb-250,8,250);ctx.beginPath();ctx.moveTo(x-4,yb-250);ctx.quadraticCurveTo(x,yb-262,x+20,yb-258);ctx.lineTo(x+20,yb-250);ctx.closePath();ctx.fill();rr(ctx,x+14,yb-254,52,10,4);ctx.fill();
  if(on>0.01){ctx.fillStyle="rgba(255,244,222,"+(0.9*on)+")";ctx.fillRect(x+18,yb-245,44,3);glow(ctx,x+40,yb-244,40,[255,236,200],0.5*on);}ctx.restore();}
// the kiosk: a compact substation on the pavement, the street's transformer inside. Its status light is green, and turns amber as the
// readings drift (o.drift); a door opens (o.door), and the transformer inside is changed for a new one (o.swap)
function d7_kiosk(ctx,t,sun,o){o=o||{};const x=D7_KX,yb=D7_GY+12,w=118,h=150,x0=x-w/2,y0=yb-h,sw=o.swap||0,warn=(o.drift||0)*(1-sw),dr=clamp(o.door||0,0,1);ctx.save();
  const pl=0.75+0.25*Math.sin(t*4);if(warn>0.02)glow(ctx,x,yb-h/2,170,[255,150,70],0.7*warn*pl);
  ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.ellipse(x,yb+2,w*0.62,7,0,0,TAU);ctx.fill();
  const bc=mix(mix([30,38,36],[118,134,126],0.12+0.88*sun),[214,138,78],0.35*warn*pl),dk=rgba(mix(bc,[0,0,0],0.4),1);ctx.fillStyle=rgba(bc,1);ctx.fillRect(x0,y0,w,h);ctx.fillStyle=rgba(mix(bc,[0,0,0],0.3),1);ctx.fillRect(x0-6,y0-10,w+12,12);
  ctx.fillStyle="rgba(0,0,0,0.12)";ctx.fillRect(x0+w*0.82,y0,w*0.18,h);
  // its doors: louvres to let the transformer breathe, and a warning sign on the right one, which is the one that opens
  ctx.strokeStyle=dk;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y0+6);ctx.lineTo(x,yb-6);ctx.stroke();
  const louvres=(a,b)=>{ctx.strokeStyle=dk;ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<5;k++){ctx.moveTo(a,y0+22+k*9);ctx.lineTo(b,y0+22+k*9);}ctx.stroke();};louvres(x0+10,x-8);
  if(dr>0.01){ctx.fillStyle="rgba(8,10,14,0.95)";ctx.fillRect(x+2,y0+4,w/2-6,h-10);
    // the transformer inside: a tank with cooling fins and three bushings on top; amber while it drifts, and the new one, clean
    const tc=mix(mix([70,74,80],[150,156,162],0.2+0.8*sun),[255,170,90],warn*0.6);ctx.fillStyle=rgba(tc,1);rr(ctx,x+10,y0+46,w/2-22,h-62,4);ctx.fill();ctx.strokeStyle="rgba(0,0,0,0.35)";ctx.lineWidth=2;ctx.beginPath();for(let k=1;k<5;k++){ctx.moveTo(x+10+k*(w/2-22)/5,y0+54);ctx.lineTo(x+10+k*(w/2-22)/5,yb-24);}ctx.stroke();
    for(let k=0;k<3;k++){ctx.fillStyle=rgba(mix(tc,[255,255,255],0.3),1);rr(ctx,x+15+k*12,y0+34,6,14,2);ctx.fill();}if(sw>0)glow(ctx,x+w/4,yb-h/2,54,[150,240,190],0.45*sw);
    const dw=(w/2-4)*(1-dr*0.85);ctx.fillStyle=rgba(mix(bc,[255,255,255],0.06),1);ctx.fillRect(x0+w-dw,y0+2,dw,h-6);}
  else{louvres(x+8,x0+w-10);ctx.fillStyle="#f2c230";ctx.beginPath();ctx.moveTo(x+w/4,yb-70);ctx.lineTo(x+w/4+13,yb-48);ctx.lineTo(x+w/4-13,yb-48);ctx.closePath();ctx.fill();
    ctx.strokeStyle="#1d1d22";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+w/4+2,yb-64);ctx.lineTo(x+w/4-3,yb-57);ctx.lineTo(x+w/4+2,yb-57);ctx.lineTo(x+w/4-2,yb-51);ctx.stroke();}
  // while the readings drift: an amber outline round the kiosk, and the status light, amber
  if(warn>0.02)withA(ctx,warn*pl,()=>{ctx.save();ctx.strokeStyle="rgba(255,176,90,0.95)";ctx.lineWidth=4;ctx.shadowColor="rgba(255,150,60,0.9)";ctx.shadowBlur=22;rr(ctx,x0-14,y0-22,w+28,h+28,12);ctx.stroke();ctx.restore();});
  const sc=mix([120,232,150],[255,160,70],warn);ctx.fillStyle=rgba(sc,warn>0.02?0.7+0.3*Math.sin(t*5):1);rr(ctx,x0+10,y0+8,40,8,4);ctx.fill();glow(ctx,x0+30,y0+12,22+20*warn,sc,0.5+0.4*warn);
  ctx.restore();}
// the ground, in section: the pavement and the road, then soil, and the cables in it. o.grid sets power coming in from the grid; o.trade,
// power moving between homes; o.lab shows the cut-away's label
function d7_ground(ctx,t,sun,o){o=o||{};const tr=o.trade||0,gr=o.grid||0;ctx.save();
  ctx.fillStyle=rgba(mix([40,40,46],[176,172,166],0.15+0.85*sun),1);ctx.fillRect(-40,D7_GY,W+80,12);ctx.fillStyle="rgba(255,255,255,"+(0.08+0.12*sun)+")";ctx.fillRect(-40,D7_GY,W+80,2);
  ctx.fillStyle=rgba(mix([22,23,28],[70,72,80],0.15+0.85*sun),1);ctx.fillRect(-40,D7_GY+12,W+80,D7_SY-D7_GY-12);ctx.fillStyle="rgba(0,0,0,0.25)";ctx.fillRect(-40,D7_GY+12,W+80,3);
  // the cut face: soil, darker as it goes down, under the road's base, with strata and small stones
  const sg=ctx.createLinearGradient(0,D7_SY,0,H);sg.addColorStop(0,"#5c4636");sg.addColorStop(0.4,"#45352a");sg.addColorStop(1,"#241b16");ctx.fillStyle=sg;ctx.fillRect(-40,D7_SY,W+80,H-D7_SY+40);
  ctx.fillStyle="rgba(150,140,128,0.32)";ctx.fillRect(-40,D7_SY,W+80,14);
  ctx.strokeStyle="rgba(255,220,180,0.07)";ctx.lineWidth=2;[900,986,1046].forEach((y,k)=>{ctx.beginPath();for(let x=-40;x<=W+40;x+=30){const yy=y+Math.sin(x*0.006+k*2)*6;x===-40?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.stroke();});
  for(let k=0;k<150;k++){const sx=hash(k,750)*W,sy=D7_SY+18+hash(k,751)*(H-D7_SY-10),r=1.4+3*hash(k,752);ctx.fillStyle="rgba(220,196,170,"+(0.06+0.12*hash(k,753))+")";ctx.beginPath();ctx.ellipse(sx,sy,r*1.3,r,hash(k,754)*3,0,TAU);ctx.fill();}
  ctx.fillStyle="rgba(255,236,210,0.4)";ctx.fillRect(-40,D7_SY,W+80,2);
  ctx.fillStyle="rgba(4,6,12,"+(0.32*(1-sun))+")";ctx.fillRect(-40,D7_SY,W+80,H-D7_SY+40);
  // the cables, each in a duct, the core glowing as power moves in it: the street's cable and the service cables, blue while the grid
  // feeds the street and green once the homes trade; the feeder, blue
  const duct=(pts,wd,core,ca)=>{ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle="#15151a";ctx.lineWidth=wd;ctx.beginPath();pts.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
    ctx.strokeStyle="rgba(120,120,130,0.5)";ctx.lineWidth=wd-5;ctx.stroke();ctx.strokeStyle=rgba(core,ca);ctx.lineWidth=Math.max(2,wd*0.3);ctx.stroke();};
  const lv=mix(mix([110,118,126],[150,200,255],gr),[150,240,170],tr),la=0.55+0.4*Math.max(gr,tr);
  duct([[-40,D7_TY],[W+40,D7_TY]],18,lv,la);D7_SX.forEach(sx=>duct([[sx,D7_SY+2],[sx,D7_TY]],12,lv,la));duct([[D7_KX+26,D7_SY+2],[D7_KX+26,D7_TY]],14,lv,la);
  duct([[-40,D7_MY],[D7_KX-26,D7_MY],[D7_KX-26,D7_SY+2]],22,[150,200,255],0.35+0.5*gr);
  D7_SX.concat([D7_KX+26]).forEach(sx=>{ctx.fillStyle="#2a2a32";ctx.beginPath();ctx.arc(sx,D7_TY,8,0,TAU);ctx.fill();});
  // power moving: in from the grid in the night, then between the homes once the sun is up
  const dot=(L,v,col,a)=>{if(a<=0.01)return;const q=at(L,v);withA(ctx,a*sstep(0,0.06,v)*(1-sstep(0.94,1,v)),()=>{glow(ctx,q.x,q.y,22,col,0.75);ctx.fillStyle=rgba(mix(col,[255,255,255],0.6),1);ctx.beginPath();ctx.arc(q.x,q.y,4.6,0,TAU);ctx.fill();});};
  if(gr>0.01){for(let k=0;k<5;k++)dot(D7_GPATH,(t*0.22+k/5)%1,[150,200,255],gr);D7_LPATH.forEach((L,k)=>dot(L,(t*0.2+hash(k,755))%1,[150,200,255],gr*0.85));}
  if(tr>0.01)D7_TPATH.forEach((L,k)=>{dot(L,(t*0.17+hash(k,756))%1,[150,240,170],tr);dot(L,(t*0.17+hash(k,756)+0.5)%1,[150,240,170],tr*0.7);});
  if(o.lab>0.01)withA(ctx,o.lab,()=>T(ctx,"cables under the street",614,D7_TY+42,{w:700,size:28,align:"center",color:"rgba(255,232,206,0.92)"}));
  ctx.restore();}
// a wheel: tyre, an aero cover, and five spokes turned by an (radians)
function d7_wheel(ctx,wx,wy,r,an,sun){ctx.fillStyle="#121216";ctx.beginPath();ctx.arc(wx,wy,r,0,TAU);ctx.fill();ctx.fillStyle=rgba(mix([60,64,72],[188,194,202],sun),1);ctx.beginPath();ctx.arc(wx,wy,r*0.64,0,TAU);ctx.fill();
  ctx.strokeStyle="rgba(30,30,36,0.55)";ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<5;k++){const a=an+k*TAU/5;ctx.moveTo(wx+Math.cos(a)*r*0.18,wy+Math.sin(a)*r*0.18);ctx.lineTo(wx+Math.cos(a)*r*0.58,wy+Math.sin(a)*r*0.58);}ctx.stroke();}
// an electric car, low and smooth, with light bars and covered wheels; it faces right, its wheels on the road at (x, yb)
function d7_ev(ctx,x,yb,s,t,sun){ctx.save();ctx.translate(x,yb);ctx.scale(s,s);
  ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.ellipse(0,2,132,8,0,0,TAU);ctx.fill();
  const bc=mix([46,52,62],[224,230,236],0.12+0.88*sun);ctx.fillStyle=rgba(bc,1);ctx.beginPath();ctx.moveTo(-128,-14);ctx.bezierCurveTo(-131,-28,-130,-40,-124,-46);ctx.bezierCurveTo(-102,-70,-62,-80,-26,-80);ctx.lineTo(16,-80);
  ctx.bezierCurveTo(46,-80,64,-62,84,-48);ctx.lineTo(118,-40);ctx.bezierCurveTo(130,-37,133,-26,130,-14);ctx.lineTo(-128,-14);ctx.closePath();ctx.fill();
  const sh=ctx.createLinearGradient(0,-80,0,-14);sh.addColorStop(0,"rgba(255,255,255,"+(0.12+0.2*sun)+")");sh.addColorStop(1,"rgba(0,0,0,0.18)");ctx.fillStyle=sh;ctx.fill();
  ctx.fillStyle=rgba(mix([14,16,22],[40,44,54],sun),1);ctx.fillRect(-126,-18,256,7);
  // the glass, tinted, with the sky in it
  const gg=ctx.createLinearGradient(0,-76,0,-46);gg.addColorStop(0,rgba(mix([30,40,66],[120,140,176],sun),1));gg.addColorStop(1,rgba(mix([12,14,22],[40,48,66],sun),1));ctx.fillStyle=gg;ctx.beginPath();ctx.moveTo(-108,-50);ctx.bezierCurveTo(-90,-66,-60,-74,-28,-74);ctx.lineTo(14,-74);ctx.bezierCurveTo(38,-74,54,-62,70,-50);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(bc,1);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-18,-74);ctx.lineTo(-22,-50);ctx.stroke();ctx.strokeStyle="rgba(0,0,0,0.22)";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-24,-46);ctx.lineTo(-30,-16);ctx.moveTo(36,-46);ctx.lineTo(40,-16);ctx.stroke();
  // light bars, front and back
  ctx.fillStyle="rgba(245,248,255,0.95)";ctx.fillRect(112,-38,18,3);glow(ctx,124,-37,16,[230,240,255],0.4);ctx.fillStyle="rgba(255,70,70,0.9)";ctx.fillRect(-130,-40,10,3);glow(ctx,-126,-39,14,[255,80,80],0.35);
  [-80,82].forEach(wx=>d7_wheel(ctx,wx,-22,23,0.4,sun));
  ctx.restore();}
// a charge post at the kerb, its ring glowing while it charges, and its cable to the car (to (ex, ey))
function d7_charger(ctx,x,yb,ex,ey,t,sun){ctx.save();ctx.fillStyle=rgba(mix([30,32,38],[84,88,96],sun),1);rr(ctx,x-10,yb-96,20,96,6);ctx.fill();const br=0.6+0.4*Math.sin(t*2.2);ctx.strokeStyle=rgba([130,236,160],br);ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,yb-74,6,0,TAU);ctx.stroke();glow(ctx,x,yb-74,18,[130,236,160],0.4*br);
  ctx.strokeStyle="rgba(20,22,28,0.95)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x+6,yb-58);ctx.quadraticCurveTo((x+ex)/2,yb+18,ex,ey);ctx.stroke();ctx.strokeStyle=rgba([130,236,160],0.5+0.3*br);ctx.lineWidth=1.6;ctx.stroke();ctx.restore();}
// the crew's van: electric, high-roofed and rounded at the front, in the utility's colours, its roof lights flashing softly; it faces
// left, its wheels on the road at (x, yb), and its wheels turn as it moves
function d7_evan(ctx,x,yb,s,t,sun,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.translate(x,yb);ctx.scale(s,s);
  ctx.fillStyle="rgba(0,0,0,0.3)";ctx.beginPath();ctx.ellipse(0,2,150,9,0,0,TAU);ctx.fill();
  const bc=mix([50,54,62],[238,240,242],0.12+0.88*sun);ctx.fillStyle=rgba(bc,1);ctx.beginPath();ctx.moveTo(150,-14);ctx.lineTo(150,-136);ctx.quadraticCurveTo(150,-148,138,-148);ctx.lineTo(-64,-148);ctx.quadraticCurveTo(-78,-148,-86,-136);
  ctx.lineTo(-124,-84);ctx.quadraticCurveTo(-148,-76,-150,-52);ctx.lineTo(-150,-14);ctx.closePath();ctx.fill();const sh=ctx.createLinearGradient(0,-148,0,-14);sh.addColorStop(0,"rgba(255,255,255,"+(0.1+0.15*sun)+")");sh.addColorStop(1,"rgba(0,0,0,0.16)");ctx.fillStyle=sh;ctx.fill();
  ctx.fillStyle=rgba(mix([14,16,22],[44,48,58],sun),1);ctx.fillRect(-148,-20,298,8);
  ctx.fillStyle=rgba(EAC,0.9);ctx.fillRect(-142,-70,288,12);ctx.fillStyle=rgba(mix(EAC,[255,255,255],0.3),0.9);ctx.fillRect(-142,-56,288,3);
  const gg=ctx.createLinearGradient(0,-140,0,-88);gg.addColorStop(0,rgba(mix([30,40,66],[120,140,176],sun),1));gg.addColorStop(1,rgba(mix([12,14,22],[40,48,66],sun),1));ctx.fillStyle=gg;ctx.beginPath();ctx.moveTo(-82,-136);ctx.lineTo(-40,-136);ctx.lineTo(-40,-90);ctx.lineTo(-116,-90);ctx.closePath();ctx.fill();
  ctx.strokeStyle="rgba(0,0,0,0.25)";ctx.lineWidth=1.6;ctx.strokeRect(-10,-136,90,116);ctx.beginPath();ctx.moveTo(-34,-86);ctx.lineTo(-34,-22);ctx.stroke();
  ctx.fillStyle="rgba(245,248,255,0.95)";ctx.fillRect(-150,-60,8,14);glow(ctx,-148,-53,18,[230,240,255],0.4);
  const bl=0.5+0.5*Math.sin(t*6);ctx.fillStyle=rgba(mix([40,40,46],[90,92,100],sun),1);rr(ctx,-40,-158,90,10,4);ctx.fill();[-30,-6,18,40].forEach((lx,k)=>{const on=(k%2?bl:1-bl);ctx.fillStyle=rgba([255,184,80],0.35+0.65*on);ctx.fillRect(lx,-156,10,6);if(on>0.6)glow(ctx,lx+5,-153,16,[255,184,80],0.4*on);});
  [-94,100].forEach(wx=>d7_wheel(ctx,wx,-22,25,x/(25*s),sun));
  ctx.restore();});}
// a small chart of a transformer's readings: a line that wanders, then drifts up towards a dashed limit
function d7_trend(ctx,x,y,w,h,p,t,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,[255,190,120],{glow:12,ea:0.75,fill:"rgba(10,12,22,0.94)"});
  T(ctx,"transformer readings",x+24,y+44,{w:800,size:28,color:rgba([255,214,170],1)});const gx=x+24,gy=y+70,gw=w-48,gh=h-96;
  ctx.save();ctx.setLineDash([8,7]);ctx.strokeStyle="rgba(232,110,96,0.8)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx,gy+gh*0.15);ctx.lineTo(gx+gw,gy+gh*0.15);ctx.stroke();ctx.restore();
  ctx.save();ctx.strokeStyle="rgba(255,200,140,0.95)";ctx.lineWidth=3;ctx.beginPath();const n=60;for(let i=0;i<=n*p;i++){const u=i/n,base=0.75-0.5*sstep(0.5,1,u),yy=gy+gh*(base+0.06*Math.sin(u*31+1)+0.04*Math.sin(u*13));i?ctx.lineTo(gx+u*gw,yy):ctx.moveTo(gx+u*gw,yy);}ctx.stroke();ctx.restore();});}

/* ---------- the wall and the glass: systems, capabilities, technology ---------- */
// the list from Day one, printed: rows of system names scrolling (texture), and a heading
function d7_list(ctx,x,y,w,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.012:o.rot,plain:true});
  T(ctx,"140 systems",x+28,y+54,{w:800,size:34,color:"rgba(52,48,46,0.95)"});ctx.save();ctx.beginPath();ctx.rect(x+10,y+76,w-20,h-90);ctx.clip();
  const sc=t*(o.speed==null?24:o.speed),rh=32;for(let i=0;i<Math.ceil((h-90)/rh)+2;i++){const k=Math.floor(sc/rh)+i,yy=y+104+i*rh-(sc%rh);T(ctx,(k%140+1)+"  "+D7_SYS[k%D7_SYS.length],x+30,yy,{f:"mono",w:500,size:20,color:"rgba(70,66,64,0.85)",deco:1});}ctx.restore();});}
// a spreadsheet on paper: a grid, a few numbers, and who keeps it
function d7_sheet(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?0.014:o.rot,plain:true});
  ctx.save();ctx.strokeStyle="rgba(60,120,80,0.35)";ctx.lineWidth=1.2;for(let i=0;i<=6;i++){ctx.beginPath();ctx.moveTo(x+20,y+70+i*26);ctx.lineTo(x+w-20,y+70+i*26);ctx.stroke();}for(let j=0;j<=4;j++){ctx.beginPath();ctx.moveTo(x+20+j*(w-40)/4,y+70);ctx.lineTo(x+20+j*(w-40)/4,y+226);ctx.stroke();}
  for(let i=0;i<6;i++)for(let j=0;j<4;j++)T(ctx,""+Math.round(20+80*hash(i*4+j,720)),x+30+j*(w-40)/4,y+90+i*26,{f:"mono",w:500,size:16,color:"rgba(60,60,64,0.75)",deco:1});ctx.restore();
  T(ctx,o.title||"spreadsheet",x+24,y+48,{w:800,size:30,color:"rgba(52,48,46,0.95)"});if(o.line)T(ctx,o.line,x+24,y+h-24,{w:700,size:28,color:"rgba(52,48,46,0.9)"});});}
// a dashed slot where a capability should be, with a question mark: a system that serves nothing anyone can name
function d7_slot(ctx,x,y,w,h,a){if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle=rgba(STR,0.7);ctx.lineWidth=2.5;rr(ctx,x,y,w,h,16);ctx.stroke();ctx.restore();T(ctx,"?",x+w/2,y+h/2+18,{w:800,size:52,align:"center",color:rgba(STR,0.95)});});}
// a "new" badge, on an element of the target
function d7_new(ctx,x,y,a){if(a<=0.01)return;withA(ctx,a,()=>{glass(ctx,x-44,y-20,88,40,20,[150,240,170],{glow:10,ea:0.8,fill:"rgba(6,16,12,0.95)"});T(ctx,"new",x,y+10,{w:800,size:28,align:"center",color:"rgba(170,245,190,1)"});});}
// a line from one element to another: serving (an arrow), or a plain line, drawn up to p
function d7_link(ctx,x0,y0,x1,y1,col,p,o){o=o||{};if(p<=0)return;ctx.save();ctx.strokeStyle=rgba(col,o.a==null?0.6:o.a);ctx.lineWidth=o.lw||2.5;if(o.dash)ctx.setLineDash(o.dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(lerp(x0,x1,p),lerp(y0,y1,p));ctx.stroke();ctx.restore();}

/* ---------- why, written down ---------- */
// a decision record on paper: a kicker, a title, and its fields, written in as p goes to 1; o.hi lights it
function d7_adr(ctx,x,y,w,title,rows,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return 0;const h=150+rows.reduce((s,r)=>s+r[2],0);withA(ctx,a,()=>{sheet(ctx,x,y,w,h,{rot:o.rot==null?-0.008:o.rot,plain:true});
  if(o.hi)withA(ctx,o.hi,()=>{ctx.save();ctx.strokeStyle=rgba(TRUST,0.95);ctx.lineWidth=4;ctx.shadowColor=rgba(TRUST,0.8);ctx.shadowBlur=18;rr(ctx,x-8,y-8,w+16,h+16,10);ctx.stroke();ctx.restore();});
  T(ctx,"decision record",x+30,y+48,{f:"mono",w:500,size:28,color:"rgba(150,60,110,0.95)"});T(ctx,title,x+30,y+100,{w:800,size:36,color:"rgba(40,38,40,0.97)"});
  let yy=y+150;rows.forEach(([k,v,hh],i)=>{const q=o.p==null?1:clamp(o.p*rows.length-i,0,1);if(q>0)withA(ctx,q,()=>{T(ctx,k,x+30,yy+30,{w:800,size:28,color:"rgba(110,90,60,0.95)"});wrapT(ctx,v,x+220,yy+30,w-250,{size:28,w:700,color:"rgba(40,38,40,0.92)",lh:34});});yy+=hh;});});return h;}
