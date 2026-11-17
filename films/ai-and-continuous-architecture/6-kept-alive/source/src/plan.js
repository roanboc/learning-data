/* ===== Kept alive: this film's pictures =====
   Babylon is drawn with the series' components (../../../shared/src/aca.js: the sky, the city, the tower, its people as silhouettes,
   brick and clay), at dusk, from 331 BCE to today; the present with The map before the data's (ea.js: the layers as slabs of glass,
   ArchiMate's glyphs) and the agent from Keeping it true (kt_agent, through aca_agent). Here: what only this film draws, prefixed a6_.
   Made to read on a phone: every word is at least 28 px in the frame, or marked deco:1 as texture. */

// the sides of the utility, as the series colours them: the network in blue, retail in rose, households warm; a copy in grey
const A6_NET=[132,176,255],A6_RET=[255,150,186],A6_HH=[255,214,170],A6_RED=[236,104,92],A6_OK=[132,226,160],A6_DIM=[118,126,146],A6_COPY=[176,178,186];

// The people of this film: Inés, the data architect (as Data architecture draws her), and the metering leads, the one who retires after
// thirty-one years and the one who comes after her
PEOPLE.ines={name:"Inés Duarte",role:"Data architect",side:"Technical",does:"produces",edge:TECH,seed:21,
  skin:[200,150,116],hair:{style:"bob",c:[46,32,28],streak:[112,82,66]},earrings:[236,206,150],
  top:{kind:"sweater",c:[150,84,62],inner:[236,230,220]},bottom:{c:[44,46,58]},shoe:[54,42,36],build:{sh:66,hip:60,h:0.95}};
PEOPLE.nadia={name:"Nadia Karimi",role:"Metering lead",side:"Business",does:"produces",edge:BIZ,seed:31,
  skin:[206,160,128],hair:{style:"bun",c:[184,180,176]},glasses:[90,70,60],earrings:[236,226,214],
  top:{kind:"cardigan",c:[96,110,92],inner:[238,232,222]},bottom:{c:[48,46,54]},shoe:[46,36,32],build:{sh:66,hip:62,h:0.94}};
PEOPLE.kofi={name:"Kofi Boateng",role:"Metering lead",side:"Business",does:"produces",edge:BIZ,seed:32,
  skin:[112,76,54],hair:{style:"cropped",c:[24,20,18]},beard:[30,24,20],
  top:{kind:"shirt",c:[188,150,96],inner:[236,232,226]},bottom:{c:[42,44,54]},shoe:[40,32,30],build:{sh:74,hip:60,h:1.0}};

// a face that changes from one expression to another over a moment, never in one frame: m (0..1) mixes a into b
function a6_expr(a,b,m){if(!(m>0))return a;if(m>=1)return b;const A=EXPR[a],B=EXPR[b],o={},q=Math.round(m*20)/20;
  for(const k of new Set([...Object.keys(A),...Object.keys(B)])){const u=A[k]==null?0:A[k],v=B[k]==null?0:B[k];o[k]=u+(v-u)*q;}
  if(B.happy&&q<1)delete o.happy;const key="__a6_"+a+"_"+b+"_"+q;EXPR[key]=o;return key;}
// the person seen from the left: a mirror of When things go wrong's person(), for someone on the right of the frame facing in
function a6_personR(ctx,id,x,y,s,o){ctx.save();ctx.translate(x,0);ctx.scale(-1,1);ctx.translate(-x,0);person(ctx,id,x,y,s,o);ctx.restore();}

/* ---------- a whole picture that fades as one ---------- */
// A picture that leaves while another comes in is drawn into a reused canvas and laid over at its opacity, so its parts never show
// through each other as it fades. One canvas for each level of nesting, reused frame to frame. Returns what fn returns.
const A6_BUFS=[];let A6_DEPTH=0;
function a6_fade(ctx,a,fn){const ga=ctx.globalAlpha*a;if(ga<=0.002)return null;if(ga>=0.998){ctx.save();const r=fn(ctx);ctx.restore();return r;}const cv=ctx.canvas,d=A6_DEPTH;
  let b=A6_BUFS[d];if(!b||b.width!==cv.width||b.height!==cv.height)b=A6_BUFS[d]=mkCanvas(cv.width,cv.height);const o=b.getContext("2d");
  o.setTransform(1,0,0,1,0,0);o.globalAlpha=1;o.clearRect(0,0,cv.width,cv.height);o.save();o.setTransform(ctx.getTransform());A6_DEPTH++;let r=null;try{r=fn(o);}finally{A6_DEPTH--;}o.restore();
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=ga;ctx.drawImage(b,0,0);ctx.restore();return r;}
// a person, standing, faded in and out as one picture: at the left of the frame, or (o.right) at the right, mirrored to face in
function a6_who(ctx,id,x,a,t,o){o=o||{};if(a<=0.01)return;a6_fade(ctx,a,cx=>{const q={t,pose:"stand",expr:o.expr||"calm"};if(o.right)a6_personR(cx,id,x,1060,0.78,q);else person(cx,id,x,1060,0.78,q);});}
// a person's name, over their head: at the left of the frame or (right) at the right
function a6_name(ctx,s,a,right,o){o=o||{};if(a>0.01)withA(ctx,a,()=>tag(ctx,right?1880-tw(ctx,s,28,700)-26:40,o.y||606,s,o.col||BIZ,{size:28}));}

/* ---------- Babylon's people, in their own time ---------- */
// a leg from the hip, as bab_leg draws one, w0 wide at the hip and w1 at the ankle (trousers are wider); added to the path
function a6_leg(ctx,hx,hy,ang,bend,w0,w1){const kx=hx+Math.sin(ang)*24,ky=hy+Math.cos(ang)*24,sa=ang-bend,fx=kx+Math.sin(sa)*25,fy=ky+Math.cos(sa)*25;bab_limb(ctx,[[hx,hy],[kx,ky],[fx,fy]],w0,w1);
  ctx.moveTo(fx-2.6,fy-3);ctx.quadraticCurveTo(fx+7.4,fy-3.8,fx+10,fy+0.4);ctx.lineTo(fx-2.8,fy+0.8);ctx.closePath();}
// Someone in this film's Babylon, drawn as Babylon's own people are (bab_folk): a silhouette in profile against the evening, lit along
// its edge from the right, feet at (x,y), h pixels tall, facing o.dir (1: right, -1: left), and dressed for their time. o.wear: "chiton",
// a Macedonian's tunic to mid-thigh, with o.cloak hanging behind; "robe", to the ankle, as the townspeople of later centuries wore;
// "work", trousers and a shirt, as archaeologists wear today. o.head: "mane" (Alexander's hair, swept up from the brow, and no beard),
// "helm" (a soldier's crested helmet), "cloth" (a head cloth to the shoulders), "hat" (a wide brim against the sun), or short hair;
// o.beard. In the hands: o.carry, a basket of bricks on the head, steadied with one hand; o.spear, upright; o.rod, a measuring rod. o.walk
// and o.step: walking, at the walk's phase. One path, filled once, so no limb shows through another.
function a6_figure(ctx,x,y,h,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const k=h/100,dir=o.dir||1,ph=o.step||0,col=o.col||[20,15,14],rim=o.rim==null?0.55:o.rim;
  const walk=!!(o.walk||o.carry),sw=walk?Math.sin(ph):0,wear=o.wear||"robe";
  const path=()=>{ctx.beginPath();
    if(wear==="work"){a6_leg(ctx,0,-52,0.42*sw,sw>0?0.32*sw:0.06,12,8);a6_leg(ctx,0,-52,-0.42*sw,sw<0?-0.32*sw:0.06,12,8);
      ctx.moveTo(-6.6,-81);ctx.quadraticCurveTo(-9.4,-66,-8,-46);ctx.lineTo(8.8,-46);ctx.quadraticCurveTo(9.6,-68,6.6,-81);ctx.quadraticCurveTo(0,-84,-6.6,-81);ctx.closePath();}
    else{bab_leg(ctx,0,-50,0.42*sw,sw>0?0.32*sw:0.06);bab_leg(ctx,0,-50,-0.42*sw,sw<0?-0.32*sw:0.06);
      const hem=wear==="chiton"?-34:-6,fl=wear==="chiton"?11:10.5,sh=walk?sw*2.2:0;
      ctx.moveTo(-6,-81);ctx.quadraticCurveTo(-8.5,-66,-6.5,-56);ctx.quadraticCurveTo(-9,-40,-fl+sh,hem);ctx.lineTo(fl+1+sh,hem);ctx.quadraticCurveTo(9,-40,6.5,-56);ctx.quadraticCurveTo(8.5,-68,6,-81);ctx.quadraticCurveTo(0,-84,-6,-81);ctx.closePath();
      if(o.cloak){const fw=Math.sin(t*1.3+ph*0.5)*1.4+(walk?3:0);ctx.moveTo(-3.6,-84);ctx.quadraticCurveTo(-14-fw,-62,-16.5-fw*1.4,-30);ctx.quadraticCurveTo(-9,-26.5,-3,-31);ctx.quadraticCurveTo(-6,-58,4,-82);ctx.closePath();}}
    // the neck and the head, the nose towards where they face
    ctx.moveTo(-2.6,-87);ctx.lineTo(3.6,-87);ctx.lineTo(3.4,-79);ctx.lineTo(-2.8,-79);ctx.closePath();
    ctx.moveTo(7.7,-92.5);ctx.ellipse(1.5,-92.5,6.2,7,0,0,TAU);ctx.moveTo(7.2,-94.4);ctx.lineTo(9,-91.4);ctx.lineTo(7.2,-90.2);ctx.closePath();
    const hd=o.head;
    if(hd==="mane"){ctx.moveTo(6.8,-97.4);ctx.quadraticCurveTo(5.2,-104.2,-1,-101.8);ctx.quadraticCurveTo(-8.8,-99,-8,-88);ctx.quadraticCurveTo(-7.6,-82.2,-3.4,-81.4);ctx.lineTo(-1.6,-88);ctx.quadraticCurveTo(-1,-94,3.2,-95.8);ctx.closePath();}
    else if(hd==="helm"){ctx.moveTo(-5.6,-90);ctx.quadraticCurveTo(-6.6,-101.2,1.5,-101.6);ctx.quadraticCurveTo(8.6,-101.2,8.3,-93);ctx.lineTo(4,-93.4);ctx.lineTo(3.4,-88.6);ctx.lineTo(-5.6,-85.6);ctx.closePath();
      ctx.moveTo(-7.4,-100.6);ctx.quadraticCurveTo(-0.5,-112.5,8.4,-103.4);ctx.quadraticCurveTo(0.5,-106.4,-7.4,-100.6);ctx.closePath();}
    else if(hd==="cloth"){ctx.moveTo(1.5,-101);ctx.quadraticCurveTo(-7,-101.2,-8.8,-92);ctx.quadraticCurveTo(-10.6,-82,-9.6,-73.5);ctx.lineTo(-4,-75.5);ctx.quadraticCurveTo(-3.4,-86,0.2,-90);ctx.lineTo(7.6,-95);ctx.quadraticCurveTo(6.8,-100.4,1.5,-101);ctx.closePath();}
    else if(hd==="hat"){ctx.moveTo(-11.5,-97.6);ctx.lineTo(13.5,-97.6);ctx.lineTo(12.4,-95.6);ctx.lineTo(-10.4,-95.6);ctx.closePath();ctx.moveTo(-5.6,-97.4);ctx.quadraticCurveTo(-5,-105.4,1.5,-105.4);ctx.quadraticCurveTo(8,-105.4,8.4,-97.4);ctx.closePath();}
    else{ctx.moveTo(-4.4,-97.5);ctx.quadraticCurveTo(-7.4,-90,-6.4,-84);ctx.lineTo(-1,-85);ctx.closePath();}
    if(o.beard){ctx.moveTo(1.4,-88.6);ctx.lineTo(7.6,-88.2);ctx.quadraticCurveTo(8.2,-82,6.4,-79);ctx.lineTo(1,-79.4);ctx.closePath();}
    const sx=0,sy=-79;
    if(o.carry){bab_arm(ctx,sx,sy,8,-89,5,-101);bab_arm(ctx,sx,sy,-4*sw-1,-63,-6*sw-1,-49);const top=hd==="cloth"||hd==="hat"?-104:-102;
      ctx.moveTo(-11,top-1);ctx.lineTo(15,top-1);ctx.lineTo(11,top+4);ctx.lineTo(-7,top+4);ctx.closePath();if(o.load==null||o.load>0){ctx.rect(-9,top-7,7,6);ctx.rect(-1,top-8,7,7);ctx.rect(7,top-6.5,6,5.5);}}
    else if(o.spear){bab_arm(ctx,sx,sy,5,-64,13,-71);bab_arm(ctx,sx,sy,-1,-63,-1,-49);ctx.rect(12,-128,2.2,128);ctx.moveTo(10.8,-128);ctx.lineTo(13.1,-137);ctx.lineTo(15.6,-128);ctx.closePath();}
    else if(o.rod){bab_arm(ctx,sx,sy,5,-64,13,-71);bab_arm(ctx,sx,sy,-1,-63,-1,-49);ctx.rect(12,-118,2.4,118);}
    else{const sa=walk?0.36*sw:0.05;bab_arm(ctx,sx,sy,Math.sin(-sa)*17,sy+Math.cos(sa)*17,Math.sin(-sa*1.4)*33+1,sy+Math.cos(sa*1.4)*32);}};
  const draw=(fill,ox,oy)=>{ctx.save();ctx.translate(x+ox,y+oy);ctx.scale(k*dir,k);path();ctx.fillStyle=fill;ctx.fill("nonzero");ctx.restore();};
  withA(ctx,a,()=>{if(rim>0.01)draw(rgba(mix(col,BAB_SUN,0.85),rim),Math.max(1.2,h*0.012),-Math.max(0.4,h*0.004));draw(rgba(col,1),0,0);});}
// someone of Babylon, faded in and out as one picture, so the lit edge never shows through the body
function a6_fig(ctx,x,y,h,t,o){o=o||{};const a=o.a==null?1:o.a;a6_fade(ctx,a,c2=>a6_figure(c2,x,y,h,t,{...o,a:1}));}

/* ---------- Babylon at dusk: the city, the ruin and the houses built from it ---------- */
// lamps in the city's windows as the evening comes (a, 0..1): a few of the skyline's houses, lit
function a6_lamps(ctx,hz,a,t){if(a<=0.01)return;BAB_SKY.forEach(([x,w,h],i)=>{if(hash(i,709)>0.22||h<12)return;const fl=0.85+0.15*Math.sin(t*2.1+i*3.7),wx=x+w*(0.3+0.4*hash(i,710)),wy=hz-h*(0.35+0.3*hash(i,711));
  ctx.fillStyle=rgba([255,196,120],0.9*a*fl);ctx.fillRect(wx,wy,3,3.4);glow(ctx,wx+1.5,wy+1.7,9,[255,180,100],0.35*a*fl);});}
// Etemenanki falling into ruin, as Alexander found it: bab_tower's lower stages standing to o.m metres over its mound (o.ruin), the walls
// along their top broken, slopes of fallen brick against their sides (o.rubble, 0..1), and cracks down their faces; o.ghost: the whole
// tower, outlined, as it was to be built again; o.dawn, o.day: the light
function a6_ruin(ctx,cx,by,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const[dw,dy]=bab_light(o),m=clamp(o.m==null?40:o.m,0,BAB_TH),rb=clamp(o.rubble==null?1:o.rubble,0,1);
  const lit=mix(mix([70,48,40],[196,130,92],dw),[214,172,128],dy),shade=mix(mix([22,16,16],[72,44,38],dw),[128,98,76],dy);
  withA(ctx,a,()=>{bab_tower(ctx,cx,by,s,{m,ruin:o.ruin==null?1:o.ruin,dawn:o.dawn,day:o.day,ghost:o.ghost,hi:o.hi});
    if(m<1||rb<=0.01)return;
    // the top that still stands, broken: stubs of wall along it, uneven
    let i=0;while(i<6&&by-bab_stageBox(i,cx,by,s)[1]<m*s-0.5)i++;const[x0,,w0]=bab_stageBox(i,cx,by,s),top=by-m*s;
    ctx.save();ctx.beginPath();ctx.moveTo(x0,top+1);for(let k=0;k<=30;k++){const u=k/30,hh=s*(1.2+6*hash(k,701)*Math.pow(Math.sin(Math.PI*u),0.3))*rb;ctx.lineTo(x0+u*w0,top-hh);ctx.lineTo(x0+Math.min(1,u+0.5/30)*w0,top-hh*0.55);}ctx.lineTo(x0+w0,top+1);ctx.closePath();
    const g=ctx.createLinearGradient(x0,0,x0+w0,0);g.addColorStop(0,rgba(shade,1));g.addColorStop(1,rgba(mix(shade,lit,0.85),1));ctx.fillStyle=g;ctx.fill();ctx.restore();
    // slopes of fallen brick against its sides
    const[bx,,bw]=bab_stageBox(0,cx,by,s),sh0=Math.min(BAB_T[0][1],m)*s;
    [[-1,bx],[1,bx+bw]].forEach(([d,ex],j)=>{ctx.save();ctx.beginPath();ctx.moveTo(ex+d*18*s*rb,by+1);ctx.quadraticCurveTo(ex+d*6*s*rb,by-sh0*0.3*rb,ex-d*2*s,by-sh0*0.72*rb);ctx.lineTo(ex-d*2*s,by+1);ctx.closePath();
      const g2=ctx.createLinearGradient(ex-d*20*s,0,ex+d*20*s,0);g2.addColorStop(0,rgba(d<0?mix(shade,[0,0,0],0.15):mix(shade,lit,0.6),1));g2.addColorStop(1,rgba(d<0?shade:lit,1));ctx.fillStyle=g2;ctx.fill();
      ctx.clip();ctx.fillStyle="rgba(0,0,0,0.24)";for(let k=0;k<30;k++)ctx.fillRect(ex+d*(hash(k,703+j)*16-1)*s,by-hash(k,705+j)*sh0*0.7,s*(0.8+hash(k,707)*1.6),s*0.7);ctx.restore();});
    // cracks down its faces
    ctx.save();ctx.strokeStyle="rgba(0,0,0,0.32)";ctx.lineWidth=Math.max(1,s*0.32);ctx.beginPath();for(let k=0;k<5;k++){let x=bx+bw*(0.14+0.17*k+0.05*hash(k,706)),y=by-sh0+3;ctx.moveTo(x,y);for(let j=0;j<5;j++){x+=(hash(k*5+j,708)-0.5)*s*3;y+=sh0*0.13;ctx.lineTo(x,y);}}ctx.stroke();ctx.restore();});}
// Houses of baked brick nearby, built with the tower's bricks, on the ground at by: each rises course by course as p goes from 0 to 1,
// flat-roofed, with a door and a small window, its lamp lit as the evening comes (o.lamp); o.dawn, o.day
const A6_HOUSES=[[1430,92,58],[1540,74,46],[1628,112,66],[1760,82,52],[1862,98,60],[1980,76,44],[2072,106,58],[2200,88,50]];
function a6_houses(ctx,by,p,t,o){o=o||{};const[dw,dy]=bab_light(o),face=mix(mix([30,18,16],[120,70,50],dw),[176,120,86],dy),lit=mix(face,BAB_SUN,0.22*dw+0.1*dy),lamp=clamp(o.lamp||0,0,1),n=A6_HOUSES.length;
  A6_HOUSES.forEach(([x,w,h],i)=>{const q=clamp(p*(n*0.55+1)-i*0.55,0,1);if(q<=0.01)return;const hh=h*q,y=by-hh;
    const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(mix(face,[0,0,0],0.32),1));g.addColorStop(1,rgba(lit,1));ctx.fillStyle=g;ctx.fillRect(x,y,w,hh+1);
    ctx.strokeStyle="rgba(0,0,0,0.16)";ctx.lineWidth=1;ctx.beginPath();for(let yy=by-4;yy>y;yy-=5){ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);}ctx.stroke();
    if(q>=0.999){ctx.fillStyle=rgba(mix(lit,BAB_SUN,0.3),0.55);ctx.fillRect(x-2,y-3,w+4,3);ctx.fillStyle="rgba(10,6,6,0.85)";ctx.fillRect(x+w*0.16,by-h*0.5,w*0.16,h*0.5);
      const fl=0.88+0.12*Math.sin(t*2.3+i*2.9),wl=mix([30,22,20],[255,196,120],lamp*fl);ctx.fillStyle=rgba(wl,1);ctx.fillRect(x+w*0.56,by-h*0.7,w*0.15,h*0.17);if(lamp>0.01)glow(ctx,x+w*0.635,by-h*0.62,34,[255,186,104],0.32*lamp*fl);}
    else{ctx.fillStyle=rgba(mix(lit,BAB_SUN,0.35),0.85);ctx.fillRect(x,y-3,w,3);}});}
// a house's wall close up, in the evening, built of the tower's bricks: courses of reused brick, uneven, some chipped, in thick mortar;
// set in it here and there, a brick laid face out, its stamp still on it (the stamp's lines are plain rules, as the series draws them);
// a window with a lamp. o.st (0..1): the stamped bricks lit; o.lamp (0..1); o.dim (0..1)
const A6_STAMPED=[[430,300,150],[1060,400,150],[760,640,156],[1290,520,146],[250,760,140]];
function a6_houseWall(ctx,t,o){o=o||{};const st=clamp(o.st||0,0,1),lamp=clamp(o.lamp==null?1:o.lamp,0,1);
  ctx.fillStyle="rgb(58,48,40)";ctx.fillRect(-200,-200,W+400,H+400);
  // the mortar's grain
  ctx.fillStyle="rgba(0,0,0,0.12)";for(let i=0;i<260;i++)ctx.fillRect(hash(i,712)*W,hash(i,713)*H,2+hash(i,714)*4,2);
  // the courses: bricks of the tower's size, laid on their edges, each a little different from the next
  let y=-30;for(let r=0;y<H+40;r++){const ch=34+hash(r,715)*8;let x=-60-hash(r,716)*120;for(let i=0;x<W+60;i++){const bw=118+hash(r*31+i,717)*70,v=hash(r*17+i,718),dk=hash(r*7+i,719);
      let c=mix(mix(BAB_BRICK,[214,170,120],0.25+0.45*v),[96,64,48],0.35*dk);ctx.fillStyle=rgba(c,1);rr(ctx,x+4,y+4,bw-8,ch-8,4);ctx.fill();
      ctx.fillStyle="rgba(255,236,206,0.12)";ctx.fillRect(x+8,y+6,bw-16,3);ctx.fillStyle="rgba(0,0,0,0.2)";ctx.fillRect(x+8,y+ch-9,bw-16,3);
      if(hash(r*13+i,720)<0.22){ctx.fillStyle="rgb(58,48,40)";const cx_=hash(r+i,721)<0.5?x+4:x+bw-4,cy_=y+4,s=8+hash(r*3+i,722)*14;ctx.beginPath();ctx.moveTo(cx_,cy_);ctx.lineTo(cx_+(cx_<x+bw/2?s:-s),cy_);ctx.lineTo(cx_,cy_+s*0.7);ctx.closePath();ctx.fill();}
      ctx.fillStyle="rgba(0,0,0,0.1)";for(let q=0;q<4;q++)ctx.fillRect(x+10+hash(q+i*5,723+r)*(bw-24),y+8+hash(q+r*3,724+i)*(ch-18),3,2.4);x+=bw;}y+=ch;}
  // the bricks laid face out, with their stamps
  A6_STAMPED.forEach(([x,y,w],i)=>{ctx.fillStyle="rgb(48,40,34)";ctx.fillRect(x-w/2-8,y-w/2-8,w+16,w+16);bab_brick(ctx,x,y,w,{stamp:1,rot:(hash(i,725)-0.5)*0.04});
    if(st>0.01){glow(ctx,x,y,w*1.1,BAB_SUN,0.28*st);ctx.save();ctx.strokeStyle=rgba(mix(BAB_SUN,[255,255,255],0.25),0.9*st);ctx.lineWidth=3.2;ctx.shadowColor=rgba(BAB_SUN,0.9);ctx.shadowBlur=16;rr(ctx,x-w/2-6,y-w/2-6,w+12,w+12,8);ctx.stroke();ctx.restore();}});
  // a window, its wooden frame, a lamp inside
  const wx=1540,wy=240,ww=230,wh=300,fl=0.9+0.1*Math.sin(t*2.6)*Math.sin(t*1.3+1);ctx.fillStyle="rgb(44,34,28)";ctx.fillRect(wx-22,wy-22,ww+44,wh+44);
  const lg=ctx.createRadialGradient(wx+ww*0.5,wy+wh*0.62,8,wx+ww*0.5,wy+wh*0.62,ww*0.9);lg.addColorStop(0,rgba([255,206,140],0.95*lamp*fl));lg.addColorStop(0.4,rgba([210,130,70],0.75*lamp));lg.addColorStop(1,rgba([40,26,20],1));
  ctx.fillStyle="rgb(26,18,16)";ctx.fillRect(wx,wy,ww,wh);ctx.fillStyle=lg;ctx.fillRect(wx,wy,ww,wh);
  ctx.strokeStyle="rgb(70,48,32)";ctx.lineWidth=10;ctx.strokeRect(wx,wy,ww,wh);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(wx+ww/2,wy);ctx.lineTo(wx+ww/2,wy+wh);ctx.moveTo(wx,wy+wh*0.45);ctx.lineTo(wx+ww,wy+wh*0.45);ctx.stroke();
  if(lamp>0.01)glow(ctx,wx+ww/2,wy+wh*0.6,260,[255,170,90],0.22*lamp*fl);
  // the evening light along the wall, from the right, and a darker foot
  const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(12,8,16,0.5)");g.addColorStop(0.62,"rgba(12,8,16,0.08)");g.addColorStop(1,"rgba(255,170,110,0.1)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const d=clamp(o.dim||0,0,1);if(d>0.01){ctx.fillStyle="rgba(6,4,6,"+(0.7*d)+")";ctx.fillRect(0,0,W,H);}}
// Where the tower stood, today: a square trench round a low core of mud brick, water and reeds in it, on the flat plain, seen from its
// southern edge. o.p (0..1): the trench as it's dug by the centuries, the core sinking; o.day, o.dawn: the light; o.fence (0..1): a low
// fence along the near edge; o.hi (0..1): its outline lit. Returns the trench's corners [far left, far right, near right, near left].
function a6_hole(ctx,t,o){o=o||{};const[dw,dy]=bab_light(o),p=clamp(o.p==null?1:o.p,0,1),hz=o.hz||560;
  const FL=[600,640],FR=[1320,640],NR=[1660,820],NL=[260,820],ins=0.17,lerpP=(a,b,u)=>[lerp(a[0],b[0],u),lerp(a[1],b[1],u)];
  const iFL=lerpP(FL,NR,ins),iFR=lerpP(FR,NL,ins),iNR=lerpP(NR,FL,ins),iNL=lerpP(NL,FR,ins);
  const earth=mix(mix([22,17,16],[110,82,62],dw),[168,140,104],dy),dark=mix(earth,[0,0,0],0.55),sky=mix(mix([18,18,34],[150,96,96],dw),[170,186,200],dy);
  // the trench: its far wall in shadow, its near wall lit, water at its foot
  const poly=(pts,fill)=>{ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.fillStyle=fill;ctx.fill();};
  withA(ctx,p,()=>{poly([FL,FR,NR,NL],rgba(mix(dark,earth,0.25),1));
    const wg=ctx.createLinearGradient(0,FL[1],0,NL[1]);wg.addColorStop(0,rgba(mix(sky,[255,255,255],0.15),0.9));wg.addColorStop(1,rgba(mix(sky,[20,26,40],0.55),0.95));
    ctx.save();ctx.beginPath();[FL,FR,NR,NL].forEach((q,i)=>i?ctx.lineTo(q[0]+(q[0]<960?24:-24),q[1]+(q[1]<700?10:-8)):ctx.moveTo(q[0]+24,q[1]+10));ctx.closePath();ctx.fillStyle=wg;ctx.fill();ctx.clip();
    ctx.fillStyle=rgba(mix(sky,[255,255,255],0.4),0.25);for(let i=0;i<30;i++){const yy=FL[1]+hash(i,731)*(NL[1]-FL[1]),xx=300+hash(i,732)*1300+Math.sin(t*0.4+i)*8;ctx.fillRect(xx,yy,40+hash(i,733)*120,1.4);}ctx.restore();
    // the core: a low platform of mud brick, sunk and worn, inside the trench
    const cs=0.8*(1-0.25*p);poly([iFL,iFR,iNR,iNL],rgba(mix(earth,BAB_MUD,0.35),1));
    ctx.fillStyle=rgba(mix(earth,BAB_SUN,0.12*dw+0.1*dy),0.6);ctx.beginPath();ctx.moveTo(iFL[0],iFL[1]);ctx.lineTo(iFR[0],iFR[1]);ctx.lineTo(iFR[0]+6,iFR[1]+8);ctx.lineTo(iFL[0]-6,iFL[1]+8);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgba(0,0,0,0.14)";for(let i=0;i<50;i++){const u=hash(i,734),v=hash(i,735),L=lerpP(iFL,iNL,v),R=lerpP(iFR,iNR,v),q=lerpP(L,R,u);ctx.fillRect(q[0],q[1],6+hash(i,736)*16,2.4);}
    // reeds along the water
    ctx.strokeStyle=rgba(mix(dark,[60,80,46],0.4),1);ctx.lineWidth=1.4;ctx.lineCap="round";ctx.beginPath();for(let i=0;i<120;i++){const u=hash(i,737),side=Math.floor(hash(i,738)*4),A=[FL,FR,NR,NL][side],B=[FR,NR,NL,FL][side],q=lerpP(A,B,u),hh=(8+hash(i,739)*16)*(0.6+(q[1]-600)/300),lw=Math.sin(t*0.8+i)*0.08;
      ctx.moveTo(q[0],q[1]);ctx.quadraticCurveTo(q[0]+1,q[1]-hh*0.6,q[0]+(hash(i,740)-0.5)*hh*0.4+lw*hh,q[1]-hh);}ctx.stroke();
    const hi=clamp(o.hi||0,0,1);if(hi>0.01){ctx.save();ctx.strokeStyle=rgba(ACA,0.85*hi);ctx.lineWidth=3;ctx.shadowColor=rgba(ACA,0.9);ctx.shadowBlur=14;ctx.beginPath();[FL,FR,NR,NL].forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.stroke();ctx.restore();}
    const fe=clamp(o.fence||0,0,1);if(fe>0.01)withA(ctx,fe,()=>{ctx.save();ctx.strokeStyle=rgba(mix(dark,[0,0,0],0.3),1);ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=16;i++){const q=lerpP(NL,NR,i/16);ctx.moveTo(q[0],q[1]+40);ctx.lineTo(q[0],q[1]+6);}
      ctx.stroke();ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(NL[0],NL[1]+14);ctx.lineTo(NR[0],NR[1]+14);ctx.moveTo(NL[0],NL[1]+28);ctx.lineTo(NR[0],NR[1]+28);ctx.stroke();ctx.restore();});});
  return[FL,FR,NR,NL];}
// The plain round the site, with the city's line low on the horizon far off, and the ground in front: o.dawn, o.day, o.hz
function a6_plain(ctx,t,o){o=o||{};const hz=o.hz||560,[dw,dy]=bab_light(o);bab_sky(ctx,t,{dawn:o.dawn,day:o.day,hz,sunX:o.sunX==null?1640:o.sunX,moon:o.moon});
  const far=mix(mix([24,18,20],[96,68,56],dw),[176,150,114],dy),near=mix(mix([12,9,10],[56,40,32],dw),[126,104,78],dy);
  const g=ctx.createLinearGradient(0,hz,0,hz+520);g.addColorStop(0,rgba(far,1));g.addColorStop(1,rgba(near,1));ctx.fillStyle=g;ctx.fillRect(-1600,hz,5100,2400);
  // palms and low houses far off: the town that grew from the tower's bricks
  const sil=mix(mix([18,14,14],[70,50,44],dw),[140,120,98],dy);ctx.fillStyle=rgba(sil,1);for(let i=0;i<34;i++){const x=-600+i*90+hash(i,741)*40,w=34+hash(i,742)*50,h=6+hash(i,743)*16;ctx.fillRect(x,hz-h,w,h+2);}
  for(let i=0;i<10;i++){const x=-500+i*330+hash(i,744)*120;bab_palm(ctx,x,hz+2,50+hash(i,745)*30,t,{col:sil,lean:(hash(i,746)-0.5)*0.3,rim:0.12*dw});}
  const hg=ctx.createLinearGradient(0,hz-30,0,hz+50);hg.addColorStop(0,rgba(BAB_SUN,0));hg.addColorStop(0.5,rgba(mix(BAB_SUN,[255,255,255],0.2),0.08*dw+0.12*dy));hg.addColorStop(1,rgba(BAB_SUN,0));ctx.fillStyle=hg;ctx.fillRect(-1600,hz-30,5100,80);}
// a parchment for what a later writer wrote, Strabo's Greek, in English: a pale sheet, its edges soft, and a source under it; returns
// its height
function a6_parch(ctx,x,y,w,lines,src,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||36,L=[];lines.forEach(s=>wrapT(ctx,s,0,0,w-80,{size:sz,w:700,measure:true}).forEach(l=>L.push(l)));const lh=sz*1.26,h=80+L.length*lh+(src?48:0);if(a<=0.01)return h;
  withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=22;ctx.shadowOffsetY=8;ctx.beginPath();for(let i=0;i<=24;i++)ctx.lineTo(x+i*w/24,y+(hash(i,751)-0.5)*4);for(let i=0;i<=8;i++)ctx.lineTo(x+w+(hash(i,752)-0.5)*4,y+i*h/8);
    for(let i=24;i>=0;i--)ctx.lineTo(x+i*w/24,y+h+(hash(i,753)-0.5)*4);for(let i=8;i>=0;i--)ctx.lineTo(x+(hash(i,754)-0.5)*4,y+i*h/8);ctx.closePath();
    const g=ctx.createLinearGradient(x,y,x+w*0.3,y+h);g.addColorStop(0,"rgb(236,222,190)");g.addColorStop(1,"rgb(206,186,146)");ctx.fillStyle=g;ctx.fill();ctx.restore();
    L.forEach((l,i)=>T(ctx,l,x+40,y+60+i*lh,{w:700,size:sz,color:"rgba(58,42,26,0.96)"}));if(src)T(ctx,src,x+40,y+h-34,{f:"mono",w:500,size:28,color:"rgba(110,80,52,1)"});});return h;}

/* ---------- the present: elements, the map, and the map as a tower ---------- */
// a paper clip, for where something came from
function a6_clip(ctx,x,y,col){ctx.save();ctx.strokeStyle=rgba(col,0.85);ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+4,y+10);ctx.lineTo(x+4,y-6);ctx.arc(x-1,y-6,5,0,Math.PI,true);ctx.lineTo(x-6,y+10);ctx.arc(x-2,y+10,4,Math.PI,0,true);ctx.lineTo(x+2,y-2);ctx.stroke();ctx.restore();}
// the series' glyphs, and a data product (a hexagon), a decision (a diamond) and a book (pages, open)
function a6_glyph(ctx,kind,x,y,s,col){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.fillStyle=rgba(col,1);ctx.lineWidth=Math.max(1.4,s*0.1);ctx.lineJoin="round";
  if(kind==="product"){ctx.beginPath();for(let k=0;k<6;k++){const an=Math.PI/6+k*TAU/6;ctx.lineTo(x+Math.cos(an)*s*0.85,y+Math.sin(an)*s*0.85);}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(x,y,s*0.25,0,TAU);ctx.fill();}
  else if(kind==="decision"){ctx.beginPath();ctx.moveTo(x,y-s*0.8);ctx.lineTo(x+s*0.8,y);ctx.lineTo(x,y+s*0.8);ctx.lineTo(x-s*0.8,y);ctx.closePath();ctx.stroke();}
  else if(kind==="book"){ctx.beginPath();ctx.moveTo(x,y-s*0.55);ctx.quadraticCurveTo(x-s*0.5,y-s*0.85,x-s,y-s*0.6);ctx.lineTo(x-s,y+s*0.65);ctx.quadraticCurveTo(x-s*0.5,y+s*0.4,x,y+s*0.7);ctx.quadraticCurveTo(x+s*0.5,y+s*0.4,x+s,y+s*0.65);ctx.lineTo(x+s,y-s*0.6);ctx.quadraticCurveTo(x+s*0.5,y-s*0.85,x,y-s*0.55);ctx.lineTo(x,y+s*0.7);ctx.stroke();}
  else archGlyph(ctx,kind,x,y,s,col);ctx.restore();}
// An element of the map, as ArchiMate draws it: glass in its layer's colour, its kind's glyph on the right, its name. o: a, hi, size;
// ghost (0..1): new, dashed, not on the map yet; amber (0..1): drifted, what it says no longer what's real, in a dashed amber ring;
// own: its owner's name on a gold tag over its top left corner (ownA, 0..1), gone (0..1) greyed, as an owner who has left; dim; deco
function a6_el(ctx,x,y,w,h,name,col,kind,o){o=o||{};const a=(o.a==null?1:o.a)*(1-0.62*clamp(o.dim||0,0,1));if(a<=0.01)return;const sz=o.size||28,gh=clamp(o.ghost||0,0,1),t=o.t||0,hi=o.hi||0,am=clamp(o.amber||0,0,1);
  withA(ctx,a,()=>{const r=kind==="process"||kind==="capability"?Math.min(h/2.6,18):8;
    if(gh<0.999)withA(ctx,1-gh,()=>{glass(ctx,x,y,w,h,r,col,{glow:8+16*hi,ea:0.85,fill:"rgba(7,12,24,0.95)"});ctx.fillStyle=rgba(col,0.12+0.14*hi);rr(ctx,x,y,w,h,r);ctx.fill();});
    if(gh>0.001)withA(ctx,gh,()=>{ctx.save();ctx.fillStyle="rgba(7,12,24,0.86)";rr(ctx,x,y,w,h,r);ctx.fill();ctx.setLineDash([9,8]);ctx.lineDashOffset=-t*8;ctx.strokeStyle=rgba(gh>0.5&&o.ghostCol?o.ghostCol:col,0.9);ctx.lineWidth=2.4;rr(ctx,x,y,w,h,r);ctx.stroke();ctx.restore();});
    if(am>0.01)withA(ctx,am,()=>{ctx.save();ctx.setLineDash([10,8]);ctx.lineDashOffset=-t*10;ctx.strokeStyle=rgba(ACA_WARN,0.95);ctx.lineWidth=3.2;ctx.shadowColor=rgba(ACA_WARN,0.7);ctx.shadowBlur=12;rr(ctx,x-7,y-7,w+14,h+14,r+5);ctx.stroke();ctx.restore();});
    const gs=o.gs||Math.min(14,h*0.2),gx=x+w-gs-12,gy=y+h/2;if(kind)withA(ctx,1-0.4*gh,()=>a6_glyph(ctx,kind,gx,gy,gs,mix(col,INK,0.15)));
    if(name){const tw_=w-gs*2-36,ls=wrapT(ctx,name,0,0,tw_,{size:sz,w:700,measure:true}),lh=sz*1.12,cx=x+(w-gs*2-12)/2+4;
      ls.forEach((l,i)=>T(ctx,l,cx,y+h/2+sz*0.36-(ls.length-1)*lh/2+i*lh,{w:700,size:sz,align:"center",color:rgba(INK,0.96*(1-0.25*gh)),deco:o.deco}));}
    const ow=clamp(o.ownA==null?(o.own?1:0):o.ownA,0,1),gn=clamp(o.gone||0,0,1);
    if(o.own&&ow>0.01)withA(ctx,ow,()=>{const s=o.own,w2=tw(ctx,s,28,800)+64,tx=x+10,ty=y-20,gc=mix(BIZ,A6_DIM,gn);glass(ctx,tx,ty-22,w2,44,22,gc,{glow:8*(1-gn),ea:0.9,fill:"rgba(14,12,6,0.97)"});
      if(gn<0.999)kt_gtick(ctx,tx+22,ty,11,1-gn);if(gn>0.001)withA(ctx,gn,()=>{ctx.save();ctx.strokeStyle=rgba(A6_DIM,1);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(tx+22,ty,11,0,TAU);ctx.stroke();ctx.restore();});
      T(ctx,s,tx+42,ty+10,{w:800,size:28,color:rgba(gc,1),deco:o.deco});});});}
// The map, seen whole: its six layers in glass, and on each a few elements too small to read, each stamped with a gold tick (its
// owner) and a clip (its source). M: where it is ({x, y, w, sh, gap}). o: a, p (it arrives), deco (layer names as texture), stamp
// (0..1); chk (0..1): a check passes over it, element by element; amber (0..1): the elements that drifted, ringed; gone (0..1): their
// owners' ticks greyed; miss (0..1): steps that run but aren't on it, dashed amber, in the business layer; dim (0..1). Returns each
// element's box [x, y, w, h, layer, slot].
const A6_TM={x:560,y:170,w:1060,sh:72,gap:16};
const A6_TEX=[[0,1,3],[0,1,2,3],[0,1,2],[0,1,2,3],[0,1,2,3,4],[0,2,3]];
const A6_DRIFTED=[[2,1],[3,0],[3,2]],A6_GONE=[[1,2],[2,0],[3,3],[4,0],[4,4],[5,2]];
function a6_texMap(ctx,t,M,o){o=o||{};const a=(o.a==null?1:o.a)*(1-0.6*clamp(o.dim||0,0,1)),p=o.p==null?1:o.p;if(a<=0.01)return[];const R=[];
  withA(ctx,a,()=>{const B=layerStack(ctx,M.x,M.y,M.w,{p,sh:M.sh,gap:M.gap,size:30,deco:o.deco});if(p<=0.4)return;const ea=clamp(p*2-0.8,0,1);
    const N=A6_TEX.reduce((s,r)=>s+r.length,0),ck=clamp(o.chk||0,0,1),sp=clamp(o.stamp==null?1:o.stamp,0,1),am=clamp(o.amber||0,0,1),gn=clamp(o.gone||0,0,1);let n=0;
    A6_TEX.forEach((ks,i)=>{const col=LAY6[i][1],yy=B[i][1]+12,hh=M.sh-24;ks.forEach(k=>{const xx=M.x+250+k*152,bwid=136,j=n++,dr=A6_DRIFTED.some(([a_,b_])=>a_===i&&b_===k),go=A6_GONE.some(([a_,b_])=>a_===i&&b_===k);
      R.push([xx,yy,bwid,hh,i,k]);withA(ctx,ea,()=>{ctx.save();ctx.fillStyle=rgba(col,0.09);ctx.strokeStyle=rgba(col,0.42);ctx.lineWidth=1.6;rr(ctx,xx,yy,bwid,hh,7);ctx.fill();ctx.stroke();
        ctx.fillStyle=rgba(col,0.26);ctx.fillRect(xx+30,yy+hh*0.36,56+hash(i*7+k,31)*36,4.5);ctx.fillRect(xx+30,yy+hh*0.62,34+hash(i*7+k,32)*30,4.5);ctx.restore();
        if(sp>0.01)withA(ctx,clamp((sp*(N+2.5)-j)*0.4,0,1),()=>{const g_=go?gn:0;if(g_<0.999)kt_gtick(ctx,xx+15,yy+hh/2,8,1-g_);if(g_>0.001)withA(ctx,g_,()=>{ctx.save();ctx.strokeStyle=rgba(A6_DIM,1);ctx.lineWidth=2;ctx.beginPath();ctx.arc(xx+15,yy+hh/2,8,0,TAU);ctx.stroke();ctx.restore();});
          ctx.save();ctx.translate(xx+bwid-14,yy+hh/2);ctx.scale(0.62,0.62);a6_clip(ctx,0,0,SOFT);ctx.restore();});
        if(dr&&am>0.01){ctx.save();ctx.globalAlpha*=am;ctx.setLineDash([8,6]);ctx.lineDashOffset=-t*8;ctx.strokeStyle=rgba(ACA_WARN,0.95);ctx.lineWidth=2.6;ctx.shadowColor=rgba(ACA_WARN,0.7);ctx.shadowBlur=10;rr(ctx,xx-4,yy-4,bwid+8,hh+8,9);ctx.stroke();ctx.restore();}
        const q=clamp(ck*(N+3)-j,0,1);if(q>0.01){const fl=Math.sin(Math.PI*clamp(q*1.4,0,1));if(fl>0.01){ctx.save();ctx.strokeStyle=rgba(A6_OK,0.9*fl);ctx.lineWidth=2.6;ctx.shadowColor=rgba(A6_OK,0.8);ctx.shadowBlur=12;rr(ctx,xx-3,yy-3,bwid+6,hh+6,9);ctx.stroke();ctx.restore();}
          tick_(ctx,xx+bwid-30,yy+hh/2,18,A6_OK,clamp(q*2-0.6,0,1)*0.95);}});});});
    // steps that run but aren't on the map: dashed amber, in the business layer's empty slots, inside the map
    const ms=clamp(o.miss||0,0,1);if(ms>0.01){const yy=B[2][1]+12,hh=M.sh-24;for(let k=0;k<3;k++){const q=clamp(ms*3-k,0,1);if(q<=0.01)continue;const xx=M.x+250+3*152+k*100;ctx.save();ctx.globalAlpha*=q;ctx.fillStyle="rgba(14,10,6,0.9)";rr(ctx,xx,yy,88,hh,6);ctx.fill();ctx.setLineDash([6,5]);ctx.lineDashOffset=-t*8;ctx.strokeStyle=rgba(ACA_WARN,0.95);ctx.lineWidth=2.2;rr(ctx,xx,yy,88,hh,6);ctx.stroke();ctx.restore();}}});return R;}
// The map as a tower: its six layers in glass, the technology at its foot and the motivation at its top, each tier narrower than the
// one under it, as Etemenanki's stages were; on each tier a few elements too small to read, each with its owner's gold tick. (cx, by):
// the middle of its foot; s: its scale. o: a, p (it rises, tier by tier), amber (0..1, the elements that drifted, ringed), hi (0..1, a
// warm light along its tiers' tops, kept), gone (0..1, owners' ticks greyed). Returns the tiers' boxes, from the foot up.
function a6_mapTower(ctx,cx,by,s,t,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p,B=[];const th=60*s,g=10*s;
  for(let k=0;k<6;k++){const w=(980-k*118)*s;B.push([cx-w/2,by-(k+1)*th-k*g,w,th]);}if(a<=0.01)return B;
  const am=clamp(o.amber||0,0,1),hi=clamp(o.hi||0,0,1),gn=clamp(o.gone||0,0,1);
  withA(ctx,a,()=>{B.forEach(([x,y,w,h],k)=>{const q=clamp(p*6.5-k,0,1);if(q<=0)return;const li=5-k,col=LAY6[li][1],dy=(1-spring(q*1.4))*30*s;
    withA(ctx,clamp(q*2,0,1),()=>{glass(ctx,x,y+dy,w,h,10*s,col,{glow:8+14*hi,ea:0.85,fill:"rgba(7,12,24,0.95)"});ctx.fillStyle=rgba(col,0.1+0.08*hi);rr(ctx,x,y+dy,w,h,10*s);ctx.fill();
      if(hi>0.01){ctx.save();ctx.strokeStyle=rgba(mix(BIZ,col,0.4),0.75*hi);ctx.lineWidth=2.4*s;ctx.shadowColor=rgba(BIZ,0.8);ctx.shadowBlur=12;ctx.beginPath();ctx.moveTo(x+12*s,y+dy+1);ctx.lineTo(x+w-12*s,y+dy+1);ctx.stroke();ctx.restore();}
      const n=Math.max(2,Math.round(w/(150*s)));for(let e=0;e<n;e++){const bw=(w-40*s)/n-14*s,bx=x+20*s+e*(bw+14*s),bh=h-22*s,byy=y+dy+11*s,dr=hash(k*11+e,761)<0.22,go=hash(k*7+e,762)<0.18;
        ctx.save();ctx.fillStyle=rgba(col,0.1);ctx.strokeStyle=rgba(col,0.45);ctx.lineWidth=1.4;rr(ctx,bx,byy,bw,bh,6*s);ctx.fill();ctx.stroke();ctx.fillStyle=rgba(col,0.28);ctx.fillRect(bx+26*s,byy+bh*0.38,bw*0.45,3.5*s);ctx.fillRect(bx+26*s,byy+bh*0.64,bw*0.28,3.5*s);ctx.restore();
        const gq=go?gn:0;if(gq<0.999)kt_gtick(ctx,bx+13*s,byy+bh/2,7*s,1-gq);if(gq>0.001)withA(ctx,gq,()=>{ctx.save();ctx.strokeStyle=rgba(A6_DIM,1);ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(bx+13*s,byy+bh/2,7*s,0,TAU);ctx.stroke();ctx.restore();});
        if(dr&&am>0.01){ctx.save();ctx.globalAlpha*=am;ctx.setLineDash([7,5]);ctx.lineDashOffset=-t*8;ctx.strokeStyle=rgba(ACA_WARN,0.95);ctx.lineWidth=2.4;ctx.shadowColor=rgba(ACA_WARN,0.7);ctx.shadowBlur=10;rr(ctx,bx-3,byy-3,bw+6,bh+6,8*s);ctx.stroke();ctx.restore();}}});});});return B;}
// What the map describes, moving under it: four lanes across the frame, each with its own things moving along it, and its name at the
// left. y: the first lane; o.a; o.on[k] (0..1): each lane, as the voice names it; o.hi[k] (0..1)
const A6_LANES=[["processes",LAY6[2][1]],["words",BIZ],["people",A6_HH],["what agents know",KT_AI]];
function a6_lanes(ctx,t,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{A6_LANES.forEach(([nm,col],k)=>{const q=clamp(o.on?o.on[k]:1,0,1);if(q<=0.01)return;const yy=y+k*58;
    withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(col,0.22);ctx.lineWidth=1.6;ctx.setLineDash([4,10]);ctx.beginPath();ctx.moveTo(420,yy);ctx.lineTo(1880,yy);ctx.stroke();ctx.restore();
      T(ctx,nm,380,yy+10,{w:800,size:28,align:"right",color:rgba(col,1)});
      for(let j=0;j<7;j++){const sp=(k%2?-1:1)*(26+k*7),x=((j*230+hash(j,771+k)*140+t*sp)%1610+1610)%1610+300;if(x<440||x>1860)continue;const f=clamp(Math.min(x-440,1860-x)/60,0,1);
        withA(ctx,f,()=>{if(k===0){glass(ctx,x-30,yy-15,60,30,15,col,{glow:6,ea:0.8,fill:"rgba(7,12,24,0.9)"});ctx.fillStyle=rgba(col,0.5);ctx.fillRect(x-14,yy-2,28,4);}
          else if(k===1){ctx.save();ctx.fillStyle=rgba(col,0.18);rr(ctx,x-34,yy-14,68,28,6);ctx.fill();ctx.fillStyle=rgba(col,0.85);ctx.fillRect(x-24,yy-5,30+hash(j,775)*14,3.5);ctx.fillRect(x-24,yy+3,20,3.5);ctx.restore();}
          else if(k===2)archGlyph(ctx,"actor",x,yy+2,15,col);
          else kt_agent(ctx,x,yy,11,t,{spin:j});});}});});});}

/* ---------- the field: a solar home, a crew, the street's line ---------- */
// a home with solar panels on its roof, drawn as the network draws it: its outline, the panels' glass and the box on its wall that
// turns the panels' power into the street's. o: a; plain: a home without panels; dark (0..1) the street's power off; live (0..1) the
// panels still pushing power out into the line, amber; ok (0..1) checked, a green tick; warn (0..1) connected without the check
function a6_solar(ctx,x,y,s,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const dk=clamp(o.dark||0,0,1),lv=clamp(o.live||0,0,1),wn=clamp(o.warn||0,0,1),ok=clamp(o.ok||0,0,1),col=mix(A6_HH,ACA_WARN,wn);
  withA(ctx,a,()=>{if(wn>0.01)glow(ctx,x,y,100*s,ACA_WARN,0.24*wn);ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=rgba(mix(col,[90,96,110],0.5*dk),1);ctx.lineWidth=3;ctx.lineJoin="round";ctx.shadowColor=rgba(col,0.6*(1-dk));ctx.shadowBlur=10;
    ctx.beginPath();ctx.moveTo(-40,-6);ctx.lineTo(0,-42);ctx.lineTo(40,-6);ctx.moveTo(-30,-14);ctx.lineTo(-30,32);ctx.lineTo(30,32);ctx.lineTo(30,-14);ctx.stroke();ctx.shadowBlur=0;
    // the panels, on the roof's right slope (none, o.plain, on a home without them)
    if(!o.plain){ctx.save();ctx.translate(20,-24);ctx.rotate(0.73);const pc=mix([96,140,220],ACA_WARN,lv*(0.6+0.4*Math.sin(t*5)));ctx.fillStyle=rgba(mix(pc,[20,24,40],0.35),0.95);ctx.fillRect(-20,-8,40,12);ctx.strokeStyle=rgba(mix(pc,[255,255,255],0.3),0.9);ctx.lineWidth=1;ctx.strokeRect(-20,-8,40,12);
    ctx.beginPath();for(let i=1;i<4;i++){ctx.moveTo(-20+i*10,-8);ctx.lineTo(-20+i*10,4);}ctx.moveTo(-20,-2);ctx.lineTo(20,-2);ctx.stroke();ctx.restore();}
    // the box on the wall, the door and a window, lit unless the street is off (or lit amber, if the panels keep it live)
    if(!o.plain){ctx.fillStyle=rgba(mix([200,206,220],ACA_WARN,lv),0.95);ctx.fillRect(18,4,8,12);}ctx.fillStyle=rgba(col,0.9);ctx.fillRect(-8,8,16,24);const wl=mix([255,226,160],[40,44,56],dk*(1-lv));ctx.fillStyle=rgba(wl,0.95);ctx.fillRect(-24,-2,11,11);
    if(dk<0.99||lv>0.01)glow(ctx,-18,4,30,[255,214,150],0.18*Math.max(1-dk,lv));ctx.restore();
    if(lv>0.01)glow(ctx,x+20*s,y-24*s,40*s,ACA_WARN,0.4*lv*(0.7+0.3*Math.sin(t*5)));
    if(ok>0.01)withA(ctx,ok,()=>{const tx=x+38*s,ty=y-46*s;glow(ctx,tx,ty,40,A6_OK,0.35);ctx.save();ctx.fillStyle="rgba(8,26,16,0.96)";ctx.beginPath();ctx.arc(tx,ty,17,0,TAU);ctx.fill();ctx.restore();ring(ctx,tx,ty,17,A6_OK,1,2.4);tick_(ctx,tx,ty,17,A6_OK,1);});});}
// the network's crew: an actor's figure in a hard hat, as When strategy moves draws one
function a6_crew(ctx,x,y,s,col,a){if(a<=0.01)return;withA(ctx,a,()=>{archGlyph(ctx,"actor",x,y,s,col);ctx.save();ctx.fillStyle=rgba(col,0.9);
  ctx.beginPath();ctx.arc(x,y-s*0.62,s*0.36,Math.PI,0);ctx.lineTo(x+s*0.48,y-s*0.6);ctx.lineTo(x-s*0.48,y-s*0.6);ctx.closePath();ctx.fill();ctx.restore();});}
// the street: its line from the pole at x0 to x1 at height y, the pole, and the crew working at its top (o.work, 0..1); o.off (0..1) the
// street switched off, the line grey; o.back (0..1) power pushed back along it from xb towards the pole, amber motes; o.danger (0..1) the
// crew lit amber
function a6_street(ctx,t,x0,x1,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const off=clamp(o.off||0,0,1),bk=clamp(o.back||0,0,1),wk=clamp(o.work||0,0,1),dg=clamp(o.danger||0,0,1);
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(mix(A6_NET,A6_DIM,0.7*off),0.65);ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x1,y);ctx.stroke();
    ctx.fillStyle=rgba(SOFT,0.7);ctx.fillRect(x0-5,y-210,10,250);ctx.fillRect(x0-37,y-200,74,8);ctx.restore();
    if(bk>0.01){const xb=o.xb||x1;for(let j=0;j<6;j++){const u=((t*0.5+j/6)%1),px=lerp(xb,x0+10,u);glow(ctx,px,y,16,ACA_WARN,0.75*bk*Math.sin(Math.PI*u));}
      ctx.save();ctx.strokeStyle=rgba(ACA_WARN,0.5*bk);ctx.lineWidth=4;ctx.shadowColor=rgba(ACA_WARN,0.8);ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(xb,y);ctx.stroke();ctx.restore();}
    if(wk>0.01){withA(ctx,wk,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.75);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0-56,y);ctx.lineTo(x0-22,y-196);ctx.moveTo(x0-32,y);ctx.lineTo(x0-4,y-192);
      for(let r=1;r<8;r++){const u=r/8;ctx.moveTo(lerp(x0-56,x0-22,u),y-196*u);ctx.lineTo(lerp(x0-32,x0-4,u),y-192*u);}ctx.stroke();ctx.restore();});
      if(dg>0.01)glow(ctx,x0-112,y-60,90,ACA_WARN,0.4*dg*(0.75+0.25*Math.sin(t*6)));a6_crew(ctx,x0-112,y-40,46,mix(A6_NET,ACA_WARN,dg),wk);}});}

/* ---------- the field app, the manual and copies ---------- */
// The field app on a crew's tablet: its name at the top, the crew's question, and the assistant's answer as numbered steps, each typed
// in as o.p goes from 0 to 1. o: a, w, h, q (the question), steps, newAt (the step that's new, gold as o.nwA goes to 1), why (a line
// under the steps: the reason), src (a line at its foot: the version it read), srcA (0..1), hi
function a6_tablet(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const w=o.w||700,h=o.h||560,p=clamp(o.p==null?1:o.p,0,1),S=o.steps||[];
  withA(ctx,a,()=>{ctx.save();ctx.shadowColor="rgba(0,0,0,0.6)";ctx.shadowBlur=26;ctx.fillStyle="rgba(16,18,26,0.99)";rr(ctx,x,y,w,h,30);ctx.fill();ctx.restore();ctx.strokeStyle=rgba(A6_NET,0.45+0.4*(o.hi||0));ctx.lineWidth=2.4;rr(ctx,x,y,w,h,30);ctx.stroke();
    ctx.fillStyle="rgba(24,28,40,1)";rr(ctx,x+18,y+18,w-36,h-36,18);ctx.fill();
    // its name, and the assistant's orb
    kt_agent(ctx,x+58,y+62,15,o.t||0,{spin:1});T(ctx,"field app · assistant",x+90,y+72,{f:"mono",w:500,size:28,color:rgba(A6_NET,1)});
    // the crew's question
    if(o.q){const qw=tw(ctx,o.q,30,700)+52;glass(ctx,x+w-qw-40,y+106,qw,54,27,A6_HH,{glow:6,ea:0.8,fill:"rgba(30,26,22,0.95)"});T(ctx,o.q,x+w-qw-14,y+144,{w:700,size:30,color:rgba(A6_HH,1)});}
    // the answer: its steps
    let left=p*S.length;const nwA=clamp(o.nwA==null?1:o.nwA,0,1);S.forEach((s,i)=>{const q=clamp(left-i,0,1);if(q<=0.01)return;const yy=y+214+i*58,nw=i===o.newAt?nwA:0;
      withA(ctx,clamp(q*1.6,0,1),()=>{if(nw>0.01){ctx.save();ctx.fillStyle=rgba(BIZ,0.12*nw);rr(ctx,x+38,yy-34,w-76,50,12);ctx.fill();ctx.strokeStyle=rgba(BIZ,0.8*nw);ctx.lineWidth=2;rr(ctx,x+38,yy-34,w-76,50,12);ctx.stroke();ctx.restore();}
        T(ctx,(i+1)+".",x+56,yy,{w:800,size:30,color:rgba(mix(A6_NET,BIZ,nw),1)});T(ctx,typeOn(s,clamp(q*1.3,0,1)),x+96,yy,{w:700,size:30,color:rgba(INK,0.96)});});});
    if(o.why&&(o.whyA||0)>0.01)withA(ctx,o.whyA,()=>{const ls=wrapT(ctx,o.why,0,0,w-110,{size:28,w:700,measure:true});ls.forEach((l,i)=>T(ctx,l,x+56,y+214+S.length*58+18+i*36,{w:700,size:28,color:rgba(mix(BIZ,INK,0.35),1)}));});
    if(o.src&&(o.srcA||0)>0.01)withA(ctx,o.srcA,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.35);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x+44,y+h-84);ctx.lineTo(x+w-44,y+h-84);ctx.stroke();ctx.restore();
      a6_clip(ctx,x+60,y+h-48,SOFT);T(ctx,o.src,x+84,y+h-38,{w:700,size:28,color:rgba(mix(SOFT,INK,0.3),1)});});});}
// a page of the manual, as the network keeps it: its name, the date it changed, and its steps, numbered; o.newAt: the step that's new
// (gold, lit as o.nw goes to 1); o.glassy: kept where it's read, glass (else paper)
function a6_manual(ctx,x,y,w,title,date,steps,o){o=o||{};const a=o.a==null?1:o.a;const L=steps.map(s=>wrapT(ctx,s,0,0,w-110,{size:30,w:700,measure:true})),h=150+L.reduce((s,l)=>s+l.length*38+16,0);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,A6_NET,{glow:12+12*(o.hi||0),ea:0.85,fill:"rgba(7,11,22,0.97)"});a6_glyph(ctx,"book",x+44,y+48,15,A6_NET);T(ctx,title,x+76,y+58,{w:800,size:30,color:rgba(A6_NET,1)});
    T(ctx,date,x+76,y+98,{f:"mono",w:500,size:28,color:rgba(SOFT,1)});let yy=y+150;
    L.forEach((ls,i)=>{const nw=i===o.newAt,q=nw?clamp(o.nw==null?1:o.nw,0,1):1,hh=ls.length*38;if(q<=0.01){return;}
      withA(ctx,q,()=>{if(nw){ctx.save();ctx.fillStyle=rgba(BIZ,0.12);rr(ctx,x+24,yy-34,w-48,hh+16,12);ctx.fill();ctx.strokeStyle=rgba(BIZ,0.85);ctx.lineWidth=2.2;ctx.shadowColor=rgba(BIZ,0.6);ctx.shadowBlur=10;rr(ctx,x+24,yy-34,w-48,hh+16,12);ctx.stroke();ctx.restore();}
        T(ctx,(i+1)+".",x+44,yy,{w:800,size:30,color:rgba(nw?BIZ:A6_NET,1)});ls.forEach((l,j)=>T(ctx,l,x+84,yy+j*38,{w:700,size:30,color:rgba(INK,0.96)}));});yy+=hh+16;});});return h;}
// a copy, on grey paper: what was pasted, when, and its lines; a "copy" mark at its corner; o.old (0..1): yellowed, out of date
function a6_copy(ctx,x,y,w,title,date,lines,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||28,L=[];lines.forEach(s=>wrapT(ctx,s,0,0,w-80,{size:sz,w:700,measure:true}).forEach(l=>L.push(l)));const h=136+L.length*sz*1.3+10;if(a<=0.01)return h;
  const old=clamp(o.old||0,0,1),pc=mix([206,206,210],[214,200,160],old),ink=[56,54,60];
  withA(ctx,a,()=>{ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(o.rot==null?-0.012:o.rot);ctx.translate(-w/2,-h/2);ctx.shadowColor="rgba(0,0,0,0.55)";ctx.shadowBlur=18;ctx.shadowOffsetY=6;ctx.fillStyle=rgba(pc,0.98);ctx.fillRect(0,0,w,h);ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    ctx.fillStyle="rgba(0,0,0,0.05)";for(let i=0;i<40;i++)ctx.fillRect(hash(i,781)*w,hash(i,782)*h,2,2);
    T(ctx,title,32,52,{w:800,size:30,color:rgba(ink,0.95)});T(ctx,date,32,92,{f:"mono",w:500,size:28,color:rgba(mix(ink,[150,110,60],old),0.95)});
    ctx.fillStyle="rgba(60,52,46,0.25)";ctx.fillRect(28,110,w-56,2);L.forEach((l,i)=>T(ctx,l,32,110+sz*1.3*(i+1),{w:700,size:sz,color:rgba(ink,0.9)}));
    // the copy's mark
    const s="copy",mw=tw(ctx,s,28,800)+30;ctx.save();ctx.translate(w-mw/2-20,36);ctx.rotate(0.08);ctx.strokeStyle=rgba([120,120,132],0.9);ctx.lineWidth=2.4;rr(ctx,-mw/2,-22,mw,44,8);ctx.stroke();T(ctx,s,0,10,{w:800,size:28,align:"center",color:rgba([110,110,122],1)});ctx.restore();ctx.restore();});return h;}

/* ---------- counts, words, checks and owners ---------- */
// a number that counts up to n as p goes to 1, large, with what it counts under it (each line at least 28 px); o: a, size, col
function a6_count(ctx,x,y,n,lines,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const p=clamp(o.p==null?1:o.p,0,1),sz=o.size||96;
  withA(ctx,a,()=>{if((o.hi||0)>0.01)glow(ctx,x,y-sz*0.35,sz*1.6,col,0.22*o.hi);T(ctx,String(Math.round(n*easeCam(p))),x,y,{w:800,size:sz,align:o.align||"center",color:rgba(col,1)});
    lines.forEach((l,i)=>T(ctx,l,x,y+44+i*38,{w:700,size:30,align:o.align||"center",color:rgba(mix(col,INK,0.45),1)}));});}
// an entry of the business glossary: the term, and its definition, with one word in it lit amber, as what it says no longer holds
// (o.word, lit as o.amb goes to 1); o.note: a line under it, in gold, for what the word means now (o.noteA)
function a6_gloss(ctx,x,y,w,term,def,o){o=o||{};const a=o.a==null?1:o.a;const ls=wrapT(ctx,def,0,0,w-64,{size:30,w:700,measure:true}),h=150+ls.length*40+(o.note?56:0);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,BIZ,{glow:12+12*(o.hi||0),ea:0.85,fill:"rgba(12,11,8,0.97)"});a6_glyph(ctx,"book",x+44,y+46,15,BIZ);T(ctx,"glossary",x+76,y+56,{f:"mono",w:500,size:28,color:rgba(BIZ,1)});
    T(ctx,term,x+32,y+110,{w:800,size:36,color:rgba(INK,0.98)});const am=clamp(o.amb||0,0,1);
    ls.forEach((l,i)=>{const yy=y+150+i*40;if(o.word&&am>0.01){const k=l.indexOf(o.word);if(k>=0){const x0=x+32+tw(ctx,l.slice(0,k),30,700),ww=tw(ctx,o.word,30,700);ctx.save();ctx.fillStyle=rgba(ACA_WARN,0.24*am);rr(ctx,x0-6,yy-28,ww+12,38,6);ctx.fill();ctx.strokeStyle=rgba(ACA_WARN,0.9*am);ctx.lineWidth=2.2;rr(ctx,x0-6,yy-28,ww+12,38,6);ctx.stroke();ctx.restore();}}
      T(ctx,l,x+32,yy,{w:700,size:30,color:rgba(INK,0.94)});});
    if(o.note&&(o.noteA||0)>0.01)withA(ctx,o.noteA,()=>T(ctx,o.note,x+32,y+h-30,{w:700,size:28,color:rgba(ACA_WARN,1)}));});return h;}
// One check on the map, as a row: its mark and what it checks. The mark changes over a moment, never in a frame: run (0..1) a ring
// turning, pass (0..1) a green tick, hold (0..1) amber. o: a, hi, add (0..1: a gold edge, a check just widened), size, col
function a6_checkRow(ctx,x,y,w,label,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const sz=o.size||28,run=clamp(o.run||0,0,1),ps=clamp(o.pass||0,0,1),hd=clamp(o.hold||0,0,1),hi=o.hi||0,ad=clamp(o.add||0,0,1),t=o.t||0;
  withA(ctx,a,()=>{const h=sz+30;if(hi>0.01||ad>0.01){ctx.save();ctx.fillStyle=rgba(ad>0.01?BIZ:TECH,0.08*Math.max(hi,ad));rr(ctx,x,y-h/2,w,h,h/2);ctx.fill();ctx.restore();}
    if(ad>0.01)withA(ctx,ad,()=>{ctx.save();ctx.strokeStyle=rgba(BIZ,0.9);ctx.lineWidth=2.4;ctx.shadowColor=rgba(BIZ,0.7);ctx.shadowBlur=10;rr(ctx,x,y-h/2,w,h,h/2);ctx.stroke();ctx.restore();});
    const mx=x+34;ctx.save();ctx.strokeStyle=rgba(SOFT,0.45*(1-Math.max(ps,hd)));ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(mx,y,15,0,TAU);ctx.stroke();ctx.restore();
    if(run>0.01){ctx.save();ctx.strokeStyle=rgba(TECH,0.95*run*(1-Math.max(ps,hd)));ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.arc(mx,y,15,t*5,t*5+Math.PI*1.2);ctx.stroke();ctx.restore();}
    if(ps>0.01)withA(ctx,ps*(1-hd),()=>{glow(ctx,mx,y,36,A6_OK,0.3);ctx.save();ctx.fillStyle="rgba(8,26,16,0.96)";ctx.beginPath();ctx.arc(mx,y,15,0,TAU);ctx.fill();ctx.restore();ring(ctx,mx,y,15,A6_OK,1,2.4);tick_(ctx,mx,y,15,A6_OK,1);});
    if(hd>0.01)withA(ctx,hd,()=>{ctx.save();ctx.fillStyle="rgba(30,20,6,0.96)";ctx.beginPath();ctx.arc(mx,y,15,0,TAU);ctx.fill();ctx.restore();ring(ctx,mx,y,15,ACA_WARN,1,2.4);ctx.save();ctx.strokeStyle=rgba(ACA_WARN,1);ctx.lineWidth=2.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(mx,y-8);ctx.lineTo(mx,y+2);ctx.moveTo(mx,y+7);ctx.lineTo(mx,y+8);ctx.stroke();ctx.restore();});
    T(ctx,label,x+68,y+sz*0.36,{w:700,size:sz,color:o.col?rgba(o.col,1):rgba(INK,0.95)});});}
// the checks, on a panel of glass: its kicker, and its rows (each {label, a, run, pass, hold, hi, add}); returns the panel's height
function a6_checks(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,gap=o.gap||66,h=96+rows.length*gap;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,TECH,{glow:14+12*(o.hi||0),ea:0.85,fill:"rgba(6,12,22,0.97)"});T(ctx,o.kicker||"checked on every change",x+34,y+54,{f:"mono",w:500,size:28,color:rgba(TECH,1)});
    rows.forEach((r,i)=>a6_checkRow(ctx,x+20,y+112+i*gap,w-40,r.label,{...r,t:o.t||0}));});return h;}
// the staff directory: who works here and in what job, a row each; a row's o.st[k] (0..1) marks them gone (struck through, grey) or
// moved, with its word ("left", "new job") in amber
function a6_staff(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,gap=58,h=100+rows.length*gap;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,A6_HH,{glow:12+12*(o.hi||0),ea:0.85,fill:"rgba(12,10,8,0.97)"});archGlyph(ctx,"actor",x+42,y+46,14,A6_HH);T(ctx,"staff directory",x+72,y+56,{f:"mono",w:500,size:28,color:rgba(A6_HH,1)});
    rows.forEach(([nm,job,mark],i)=>{const yy=y+118+i*gap,q=clamp(o.st?o.st[i]||0:0,0,1),c=mix(INK,A6_DIM,0.7*q);T(ctx,nm,x+32,yy,{w:800,size:30,color:rgba(c,0.96)});T(ctx,job,x+w*0.48,yy,{w:700,size:28,color:rgba(mix(SOFT,A6_DIM,0.6*q),1)});
      if(q>0.01&&mark){withA(ctx,q,()=>{ctx.save();ctx.strokeStyle=rgba(A6_DIM,0.9);ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x+28,yy-10);ctx.lineTo(x+36+tw(ctx,nm,30,800),yy-10);ctx.stroke();ctx.restore();
        const mw=tw(ctx,mark,28,800)+30;glass(ctx,x+w-mw-24,yy-30,mw,42,21,ACA_WARN,{glow:8,ea:0.85,fill:"rgba(26,18,6,0.95)"});T(ctx,mark,x+w-mw/2-24,yy-1,{w:800,size:28,align:"center",color:rgba(ACA_WARN,1)});});}});});return h;}
// an owner, as the business side marks one: a gold tick and a name; o.ring (0..1): not yet confirmed, an empty ring instead
function a6_owner(ctx,x,y,name,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{const sz=o.size||30,rg=clamp(o.ring||0,0,1);
  if(rg<0.999)kt_gtick(ctx,x,y,sz*0.5,1-rg);if(rg>0.001){ctx.save();ctx.globalAlpha*=rg;ctx.strokeStyle=rgba(BIZ,0.8);ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(x,y,sz*0.5,0,TAU);ctx.stroke();ctx.restore();}
  if((o.hi||0)>0.01)glow(ctx,x,y,sz*2,BIZ,0.4*o.hi);T(ctx,name,x+sz*0.9,y+sz*0.36,{w:800,size:sz,color:rgba(o.col||BIZ,1)});});}
// a mask over what's personal or sensitive: dark hatching across it
function a6_mask(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;
  withA(ctx,a,()=>{ctx.save();rr(ctx,x,y,w,h,8);ctx.fillStyle="rgba(24,26,38,0.97)";ctx.fill();ctx.clip();ctx.strokeStyle="rgba(160,170,196,0.35)";ctx.lineWidth=6;ctx.beginPath();for(let i=-h;i<w;i+=22){ctx.moveTo(x+i,y+h);ctx.lineTo(x+i+h,y);}ctx.stroke();ctx.restore();
    ctx.save();ctx.strokeStyle="rgba(160,170,196,0.85)";ctx.lineWidth=2.4;rr(ctx,x,y,w,h,8);ctx.stroke();ctx.restore();});}
// a speech bubble with one or two lines: its tail down to the left (o.left) or the right; o.col; returns its width
function a6_bubble(ctx,x,y,lines,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||32,col=o.col||A6_HH,w=Math.max(...lines.map(l=>tw(ctx,l,sz,700)))+60,lh=sz*1.25,h=lines.length*lh+28,X=o.align==="center"?x-w/2:o.align==="right"?x-w:x;if(a<=0.01)return w;
  withA(ctx,a,()=>{glass(ctx,X,y-h/2,w,h,24,col,{glow:10+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.96)"});ctx.save();ctx.fillStyle=rgba(col,0.85);const tx=o.left?X+44:X+w-44;
    ctx.beginPath();ctx.moveTo(tx-10,y+h/2-2);ctx.lineTo(tx+(o.left?-18:18),y+h/2+20);ctx.lineTo(tx+10,y+h/2-2);ctx.closePath();ctx.fill();ctx.restore();
    lines.forEach((l,i)=>T(ctx,l,X+30,y-h/2+14+sz*0.95+i*lh,{w:700,size:sz,color:rgba(mix(col,INK,0.45),1)}));});return w;}
// a row of blocks for time: n of them, each w wide, filled as far as p (0..n); o.label under it
function a6_blocks(ctx,x,y,n,w,p,col,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const g=o.gap||8,h=o.h||40;
  withA(ctx,a,()=>{for(let i=0;i<n;i++){const q=clamp(p-i,0,1),bx=x+i*(w+g);ctx.save();ctx.strokeStyle=rgba(col,0.6);ctx.lineWidth=2;rr(ctx,bx,y,w,h,6);ctx.stroke();if(q>0.01){ctx.fillStyle=rgba(col,0.75);rr(ctx,bx,y,w*q,h,6);ctx.fill();}ctx.restore();
      if(o.names&&o.names[i])T(ctx,o.names[i],bx+w/2,y+h/2+10,{w:800,size:28,align:"center",color:q>0.5?"rgba(20,16,10,0.95)":rgba(col,1)});}
    if(o.label)T(ctx,o.label,o.lx==null?x:o.lx,y+h+44,{w:800,size:o.size||30,align:o.align||"left",color:rgba(col,1)});});}
// a loop: an arrow round a circle, for a test that runs again; t turns it slowly
function a6_loop(ctx,x,y,r,t,col,a){if(a<=0.01)return;withA(ctx,a,()=>{const s=t*1.2;ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=4;ctx.lineCap="round";ctx.shadowColor=rgba(col,0.6);ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,r,s,s+Math.PI*1.6);ctx.stroke();
  const e=s+Math.PI*1.6,ex=x+Math.cos(e)*r,ey=y+Math.sin(e)*r,tx=-Math.sin(e),ty=Math.cos(e);ctx.fillStyle=rgba(col,0.95);ctx.beginPath();ctx.moveTo(ex+tx*14,ey+ty*14);ctx.lineTo(ex-ty*10-tx*2,ey+tx*10-ty*2);ctx.lineTo(ex+ty*10-tx*2,ey-tx*10-ty*2);ctx.closePath();ctx.fill();ctx.restore();});}
// a line of light from one thing to another, for what flows between them: dashed, with a few motes running along it
function a6_flow(ctx,x0,y0,x1,y1,t,col,a,o){o=o||{};if(a<=0.01)return;withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(col,o.sa||0.55);ctx.lineWidth=o.lw||2.4;ctx.setLineDash(o.solid?[]:[6,9]);ctx.lineDashOffset=-t*14;
  const mx=(x0+x1)/2+(o.bend||0),my=(y0+y1)/2-(o.lift||0);ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(mx,my,x1,y1);ctx.stroke();ctx.restore();
  if(o.head){const an=Math.atan2(y1-my,x1-mx);ctx.save();ctx.fillStyle=rgba(col,0.9);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1-Math.cos(an-0.45)*16,y1-Math.sin(an-0.45)*16);ctx.lineTo(x1-Math.cos(an+0.45)*16,y1-Math.sin(an+0.45)*16);ctx.closePath();ctx.fill();ctx.restore();}
  if(o.n!==0)for(let j=0;j<(o.n||3);j++){const u=((t*(o.v||0.4)+j/(o.n||3)+(o.ph||0))%1),v=1-u,px=v*v*x0+2*v*u*mx+u*u*x1,py=v*v*y0+2*v*u*my+u*u*y1;glow(ctx,px,py,o.r||14,col,0.6*Math.sin(Math.PI*u));}});}
// a card of glass with a kicker in mono and lines under it, for what the narration names; returns its height
function a6_card(ctx,x,y,w,kicker,lines,col,o){o=o||{};const a=o.a==null?1:o.a,sz=o.size||30,L=[];lines.forEach(s=>wrapT(ctx,s,0,0,w-56,{size:sz,w:700,measure:true}).forEach(l=>L.push(l)));
  const h=Math.max(o.minH||0,(kicker?76:28)+L.length*sz*1.25+18);if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,18,col,{glow:12+14*(o.hi||0),ea:0.85,fill:"rgba(7,11,22,0.97)"});
    if(kicker)T(ctx,kicker,x+28,y+46,{f:"mono",w:500,size:28,color:rgba(col,1)});L.forEach((l,i)=>T(ctx,l,x+28,y+(kicker?76:28)+sz*0.92+i*sz*1.25,{w:700,size:sz,color:rgba(o.ink||INK,0.96)}));});return h;}
// something that runs: a job or a system, a gear in a ring and its name; o.col; o.miss (0..1) one the map doesn't show, dashed amber
function a6_job(ctx,x,y,w,name,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const h=o.h||76,ms=clamp(o.miss||0,0,1),col=o.col||LAY6[4][1],t=o.t||0;
  withA(ctx,a,()=>{if(ms<0.999)withA(ctx,1-ms,()=>glass(ctx,x,y,w,h,h/2,col,{glow:10+14*(o.hi||0),ea:0.85,fill:"rgba(7,12,24,0.97)"}));
    if(ms>0.001)withA(ctx,ms,()=>{ctx.save();ctx.fillStyle="rgba(14,10,6,0.95)";rr(ctx,x,y,w,h,h/2);ctx.fill();ctx.setLineDash([10,8]);ctx.lineDashOffset=-t*10;ctx.strokeStyle=rgba(ACA_WARN,0.95);ctx.lineWidth=2.8;ctx.shadowColor=rgba(ACA_WARN,0.7);ctx.shadowBlur=10;rr(ctx,x,y,w,h,h/2);ctx.stroke();ctx.restore();});
    const gx=x+h/2,gy=y+h/2,gc=mix(col,ACA_WARN,ms);ctx.save();ctx.strokeStyle=rgba(gc,1);ctx.lineWidth=2.6;ctx.beginPath();for(let k=0;k<16;k++){const an=k/16*TAU+t*0.6,rr_=k%2?12:17;ctx.lineTo(gx+Math.cos(an)*rr_,gy+Math.sin(an)*rr_);}ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(gx,gy,5,0,TAU);ctx.stroke();ctx.restore();
    T(ctx,name,x+h+4,y+h/2+10,{w:700,size:28,color:rgba(INK,0.96)});});}

/* ---------- a job, not a project ---------- */
// a project and a product, on one line of time each, from the left: the project's bar ends at its date, a flag; the product's goes on,
// a small check on it every so often, as the system changes. o.pj, o.pd (0..1): each drawn; o.end (0..1): the project's end, lit
function a6_lines(ctx,x,y,w,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const pj=clamp(o.pj||0,0,1),pd=clamp(o.pd||0,0,1),en=clamp(o.end||0,0,1);
  withA(ctx,a,()=>{if(pj>0.01){const ex=x+w*0.42;withA(ctx,pj,()=>{T(ctx,"a project",x,y-26,{w:800,size:30,color:rgba(SOFT,1)});ctx.save();ctx.fillStyle=rgba(A6_DIM,0.85);rr(ctx,x,y,lerp(0,ex-x,easeCam(pj)),26,13);ctx.fill();ctx.restore();
      if(pj>0.9){ctx.save();ctx.strokeStyle=rgba(mix(SOFT,ACA_WARN,en),1);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ex,y+40);ctx.lineTo(ex,y-50);ctx.stroke();ctx.fillStyle=rgba(mix(SOFT,ACA_WARN,en),1);ctx.beginPath();ctx.moveTo(ex,y-50);ctx.lineTo(ex+34,y-40);ctx.lineTo(ex,y-30);ctx.closePath();ctx.fill();ctx.restore();
        T(ctx,"it ends",ex+48,y+22,{w:800,size:30,color:rgba(mix(SOFT,ACA_WARN,en),1)});}});}
    if(pd>0.01){const yy=y+150,L=lerp(0,w,easeCam(pd));withA(ctx,pd,()=>{T(ctx,"a product",x,yy-26,{w:800,size:30,color:rgba(A6_OK,1)});ctx.save();const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,rgba(A6_OK,0.85));g.addColorStop(0.92,rgba(A6_OK,0.85));g.addColorStop(1,rgba(A6_OK,0));ctx.fillStyle=g;rr(ctx,x,yy,L,26,13);ctx.fill();ctx.restore();
      for(let k=2;k<9;k++){const cx=x+k*w/9;if(cx>x+L-10)break;tick_(ctx,cx,yy-22,18,A6_OK,0.9);}});}});}
// the capability that keeps the map true, as a card of glass on the map's strategy colour: its name, and its rows, each lit in turn as
// o.r[k] goes to 1: [kicker, value, who]
function a6_cap(ctx,x,y,w,rows,o){o=o||{};const a=o.a==null?1:o.a,col=LAY6[1][1],gap=74,h=136+rows.length*gap;if(a<=0.01)return h;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,22,col,{glow:14+12*(o.hi||0),ea:0.9,fill:"rgba(12,10,6,0.97)"});a6_glyph(ctx,"capability",x+46,y+50,16,col);T(ctx,"capability · on the map",x+80,y+60,{f:"mono",w:500,size:28,color:rgba(col,1)});
    T(ctx,o.title||"Keep the map true",x+34,y+114,{w:800,size:40,color:rgba(INK,0.98)});
    rows.forEach(([k,v],i)=>{const q=clamp(o.r?o.r[i]||0:1,0,1);if(q<=0.01)return;const yy=y+176+i*gap;withA(ctx,q,()=>{if((o.rh&&o.rh[i]||0)>0.01){ctx.save();ctx.fillStyle=rgba(col,0.1*o.rh[i]);rr(ctx,x+18,yy-38,w-36,58,14);ctx.fill();ctx.restore();}
      T(ctx,k,x+34,yy,{f:"mono",w:500,size:28,color:rgba(col,1)});T(ctx,v,x+214,yy,{w:700,size:30,color:rgba(INK,0.96)});});});});return h;}
// the map's rhythm: rows of what's done and when, each with a mark (a ring that turns once as it's named); rows: [when, what, colour]
function a6_rhythm(ctx,x,y,w,rows,t,o){o=o||{};const a=o.a==null?1:o.a,gap=o.gap||92;if(a<=0.01)return;
  withA(ctx,a,()=>{rows.forEach(([when,what,col],i)=>{const q=clamp(o.r?o.r[i]||0:1,0,1);if(q<=0.01)return;const yy=y+i*gap,hi=o.hi?o.hi[i]||0:0;
    withA(ctx,q,()=>{glass(ctx,x,yy-38,w,76,38,col,{glow:8+16*hi,ea:0.85,fill:"rgba(7,11,22,0.96)"});const sp=(o.spin?o.spin[i]||0:0);
      ctx.save();ctx.strokeStyle=rgba(col,0.95);ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.arc(x+40,yy,15,-Math.PI/2,-Math.PI/2+TAU*clamp(0.25+0.75*sp,0,1));ctx.stroke();ctx.restore();
      T(ctx,when,x+76,yy+10,{w:800,size:30,color:rgba(col,1)});T(ctx,what,x+w*0.44,yy+10,{w:700,size:30,color:rgba(INK,0.95)});});});});}
// the monthly read, month by month: a bar for each month's differences, from the first (n0) down; vals; o.p (0..1) draws them in;
// o.fix (0..1): each bar's differences fixed within the month, green from its foot
function a6_bars(ctx,x,y,w,h,vals,names,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.01)return;const n=vals.length,mx=Math.max(...vals),bw=w/n*0.62,p=clamp(o.p==null?1:o.p,0,1),fx=clamp(o.fix||0,0,1);
  withA(ctx,a,()=>{ctx.save();ctx.strokeStyle=rgba(SOFT,0.4);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.stroke();ctx.restore();
    vals.forEach((v,i)=>{const q=clamp(p*(n+1)-i,0,1);if(q<=0.01)return;const bh=h*v/mx*easeCam(q),bx=x+(i+0.5)*w/n-bw/2,col=mix(ACA_WARN,A6_OK,clamp((fx*(n+1)-i),0,1));
      ctx.save();ctx.fillStyle=rgba(col,0.82);rr(ctx,bx,y+h-bh,bw,bh,6);ctx.fill();ctx.restore();
      if(i===0||i===n-1)T(ctx,String(v),bx+bw/2,y+h-bh-14,{w:800,size:36,align:"center",color:rgba(col,1)});
      if(names[i])T(ctx,names[i],bx+bw/2,y+h+40,{w:700,size:28,align:"center",color:rgba(SOFT,1)});});});}

/* ---------- five series, one idea ---------- */
// The topic's five series as a tower of five tiers, the first at its foot, each named; o.p (0..1) raises them; o.on[k] (0..1) lights
// each as the voice reads its line; returns each tier's box. (cx, by): the middle of its foot
const A6_SERIES=[["The map before the data",[255,206,140]],["Business architecture for data",[255,234,130]],["Data architecture",[255,186,150]],["Platform and solution architecture",[140,214,255]],["AI and continuous architecture",ACA]];
function a6_series(ctx,cx,by,t,o){o=o||{};const a=o.a==null?1:o.a,p=o.p==null?1:o.p,B=[],th=78,g=12;
  for(let k=0;k<5;k++){const w=900-k*80;B.push([cx-w/2,by-(k+1)*th-k*g,w,th]);}if(a<=0.01)return B;
  withA(ctx,a,()=>{B.forEach(([x,y,w,h],k)=>{const q=clamp(p*5.5-k,0,1);if(q<=0)return;const[nm,col]=A6_SERIES[k],on=clamp(o.on?o.on[k]||0:0,0,1),dy=(1-spring(q*1.4))*30;
    withA(ctx,clamp(q*2,0,1)*(1-0.35*clamp(o.dim?o.dim[k]||0:0,0,1)),()=>{glass(ctx,x,y+dy,w,h,12,col,{glow:8+20*on,ea:0.85,fill:"rgba(7,11,22,0.96)"});ctx.fillStyle=rgba(col,0.08+0.18*on);rr(ctx,x,y+dy,w,h,12);ctx.fill();
      T(ctx,nm,cx,y+dy+h/2+11,{w:800,size:30,align:"center",color:rgba(mix(INK,col,0.3+0.5*on),1)});});});});return B;}
// a link to a film, as a card: its kicker (what it shows), the film's title, and a glyph: a map of glass (in a tool) or a branch (in
// a repository)
function a6_link(ctx,x,y,w,kicker,title,kind,o){o=o||{};const a=o.a==null?1:o.a,h=150;if(a<=0.01)return h;const col=kind==="repo"?TECH:BIZ;
  withA(ctx,a,()=>{glass(ctx,x,y,w,h,20,col,{glow:12+14*(o.hi||0),ea:0.88,fill:"rgba(7,11,22,0.97)"});
    if(kind==="repo"){ctx.save();ctx.strokeStyle=rgba(col,1);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x+48,y+40);ctx.lineTo(x+48,y+110);ctx.moveTo(x+48,y+92);ctx.quadraticCurveTo(x+48,y+66,x+76,y+60);ctx.stroke();[[48,40],[48,110],[78,58]].forEach(([dx,dy_])=>{ctx.beginPath();ctx.arc(x+dx,y+dy_,7,0,TAU);ctx.fillStyle="rgba(7,11,22,1)";ctx.fill();ctx.stroke();});ctx.restore();}
    else{for(let k=0;k<3;k++){ctx.save();ctx.fillStyle=rgba(LAY6[k*2][1],0.3);ctx.strokeStyle=rgba(LAY6[k*2][1],0.9);ctx.lineWidth=1.6;rr(ctx,x+26,y+36+k*28,56,20,5);ctx.fill();ctx.stroke();ctx.restore();}}
    T(ctx,kicker,x+110,y+56,{f:"mono",w:500,size:28,color:rgba(col,1)});T(ctx,title,x+110,y+108,{w:800,size:34,color:rgba(INK,0.98)});});return h;}
