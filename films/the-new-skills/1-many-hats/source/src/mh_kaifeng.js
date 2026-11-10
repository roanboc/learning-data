/* ===== Many hats, one picture: Kaifeng, 1015 =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms
   are (prefix mh_). Nothing here is a likeness or a copy of a painting of the time: the halls, the gate, the canal and the clothes are
   drawn from what is known of Song buildings and dress (hall on a stone platform, red-brown columns, bracket sets under grey tiled
   roofs with gently curved eaves and ridge ornaments; officials in a round-collared robe and a black gauze cap with stiff wings;
   workers in a short tunic, the hair under a cloth), in this film's own style.
     mhCourt, mhCourtFire, mhCourtBurned   inside the palace: a gallery, two treasuries, the inner gate, the library, on a paved court;
                                           by day; at night, as the fire spreads; and the next day, burned (one room: AG_ROOMS)
     mhPlan                                the city from above: its walls, the palace, the Bian canal, the wards crowded with roofs
     mhStreet, mhStreetNew                 the main street to the palace gate, cut open like an architect's section: the canal at the
                                           left, the gate at the right, the burned halls beyond it, and, once the work is done, the new
                                           ones (one room)
     mh_street(ctx, t, st)                 what happens in the street: the trench dug, the canal's bank broken, its water let in, rafts
                                           and boats, the rubble tipped in, the street again, carts on it
     mh_route, mh_cart                     a job's route across the plan, drawn out, and the carts on it, load after load
     MH_PEOPLE                             Ding Wei, a digger, a boatman and a carter: dressed for their time, never likenesses
   Colour keeps the module's meaning: the routes' cost in amber, Ding Wei's plan in blue, what's done in green; the city itself wears
   none of the five (its columns a dark red-brown, its water a grey-green). */

const MH_K={sky0:[212,218,220],sky1:[244,234,212],tile:[98,100,106],tileDk:[64,66,72],tileHi:[160,162,166],col:[124,62,52],colHi:[166,94,78],
  wallP:[226,214,194],wallPDk:[190,174,152],plinth:[206,196,178],plinthDk:[164,152,134],lattice:[98,66,48],bracket:[146,104,72],
  earth:[190,168,130],earthDk:[150,128,96],earthHi:[214,198,166],water:[118,146,148],waterHi:[176,198,194],char:[42,36,34],charHi:[92,82,76],
  ash:[132,124,118],flag:[208,198,180],flagDk:[178,166,146],city:[186,180,172],cityDk:[156,150,144],cut:[96,84,76],cutHi:[132,118,106],
  night0:[26,30,48],night1:[66,50,58],glow:[236,124,56],timber:[188,150,104],timberDk:[128,96,62]};

/* ---------------------------------------------------------------- small things */
// a seeded wobble: a smooth number from -1 to 1 along u, the same in every render
const mh_wob=(u,s)=>Math.sin(u*1.7+s*3.1)*0.6+Math.sin(u*3.9+s*1.3)*0.4;
// a soft blob of light or smoke, a radial gradient: no blur filter, so it's cheap to draw every frame
function mh_blob(c,x,y,r,col,a){if(a<=0.004||r<=0)return;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(0.55,rgba(col,a*0.45));g.addColorStop(1,rgba(col,0));
  c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);}
// smoke rising from (x, y): soft blobs drifting up and to the left (the wind is from the right), growing and fading as they rise
function mh_smoke(c,x,y,t,a,o){o=o||{};if(a<=0.004)return;const n=o.n||9,h=o.h||420,sp=o.sp||26,r0=o.r||34,col=o.col||[70,64,64];
  for(let k=0;k<n;k++){const u=((t*sp/h)+k/n)%1,yy=y-u*h,xx=x-u*u*(o.drift||120)+mh_wob(u*4+k,k)*14,rr2=r0*(0.6+1.6*u);
    mh_blob(c,xx,yy,rr2,col,a*0.34*Math.sin(Math.PI*u)*(o.dense||1));}}

/* ---------------------------------------------------------------- a Song hall, in elevation
   mh_hall(c, cx, base, o): a hall on its stone platform, its long side towards us, centred on cx, the platform standing on the ground
   at base. o: w (between the outer columns), bays, colH (the columns' height), plat (the platform's), eave (the roof's reach past the
   outer columns), roofH, ridge (the ridge's length, a part of the eave's), two (a second storey over a short roof of its own), gate
   (the middle bay open, a passage), burned (0 or 1: the fire has taken it: charred stumps and its fallen roof), seed. Light from the
   right: the right side of each thing lighter. */
function mh_hall(c,cx,base,o){const w=o.w,bays=o.bays||3,colH=o.colH||140,plat=o.plat||36,R=ag_rnd(o.seed||7),x0=cx-w/2,x1=cx+w/2,pm=26;
  const ptop=base-plat,top=ptop-colH;
  // the platform: dressed stone, a curb along its top, steps up its middle
  let g=c.createLinearGradient(0,ptop,0,base);g.addColorStop(0,rgba(MH_K.plinth,1));g.addColorStop(1,rgba(MH_K.plinthDk,1));c.fillStyle=g;c.fillRect(x0-pm,ptop,w+2*pm,plat);
  c.fillStyle=rgba(ag_lt(MH_K.plinth,0.3),1);c.fillRect(x0-pm,ptop,w+2*pm,4);c.fillStyle="rgba(60,48,40,0.18)";for(let x=x0-pm+40;x<x1+pm-10;x+=46+R()*20)c.fillRect(x,ptop+6,1.5,plat-6);
  const sw=Math.min(90,w*0.26);g=c.createLinearGradient(0,ptop,0,base);g.addColorStop(0,rgba(ag_lt(MH_K.plinth,0.15),1));g.addColorStop(1,rgba(MH_K.plinth,1));c.fillStyle=g;c.fillRect(cx-sw/2,ptop,sw,plat);
  c.fillStyle="rgba(70,56,46,0.28)";for(let k=1;k<4;k++)c.fillRect(cx-sw/2,ptop+plat*k/4,sw,1.6);
  if(o.burned){mh_hallBurned(c,cx,ptop,top,o,R);return;}
  const two=o.two,h1=two?colH*0.56:colH,bodyTop=ptop-h1;
  mh_body(c,x0,x1,bodyTop,ptop,bays,o.gate,R);
  if(two){// a short roof over the ground floor, a balcony, and the upper storey, narrower
    const ux0=x0+w*0.08,ux1=x1-w*0.08,uTop=bodyTop-24-colH*0.44;
    mh_brackets(c,x0,x1,bodyTop,0.8);mh_roof(c,cx,bodyTop-12,{w:w+60,h:30,ridge:(w*0.84)/(w+60),pent:true});
    c.fillStyle=rgba(MH_K.col,1);c.fillRect(ux0-10,bodyTop-34,ux1-ux0+20,6);c.fillRect(ux0-10,bodyTop-52,ux1-ux0+20,4);c.fillStyle=rgba(ag_dk(MH_K.col,0.2),1);for(let x=ux0-6;x<=ux1+6;x+=16)c.fillRect(x,bodyTop-50,3,16);
    mh_body(c,ux0,ux1,uTop,bodyTop-34,bays,false,R);mh_brackets(c,ux0,ux1,uTop,1);
    mh_roof(c,cx,uTop-20,{w:(ux1-ux0)+2*(o.eave||48),h:o.roofH||110,ridge:o.ridge||0.5});}
  else{mh_brackets(c,x0,x1,bodyTop,1);mh_roof(c,cx,bodyTop-20,{w:w+2*(o.eave||48),h:o.roofH||100,ridge:o.ridge||0.5});}
}
// the walls and columns of one storey, from y0 (the beam's top) to y1 (the floor): lattice doors in the middle bays, plaster at the ends
function mh_body(c,x0,x1,y0,y1,bays,gate,R){const w=x1-x0,bw=w/bays,cw=Math.max(9,Math.min(16,bw*0.1));
  for(let b=0;b<bays;b++){const bx=x0+b*bw,mid=b>0&&b<bays-1||bays<3;
    if(gate&&b===Math.floor(bays/2)){c.fillStyle="rgb(40,32,30)";c.fillRect(bx,y0+14,bw,y1-y0-14);
      // the doors folded back, in shade
      c.fillStyle=rgba(ag_dk(MH_K.col,0.25),1);c.fillRect(bx+2,y0+18,bw*0.14,y1-y0-18);c.fillRect(bx+bw*0.86-2,y0+18,bw*0.14,y1-y0-18);continue;}
    if(mid){c.fillStyle=rgba(MH_K.lattice,1);c.fillRect(bx,y0+14,bw,y1-y0-14);c.strokeStyle="rgba(214,190,160,0.42)";c.lineWidth=1.6;
      for(let x=bx+8;x<bx+bw-4;x+=9){c.beginPath();c.moveTo(x,y0+24);c.lineTo(x,y1-(y1-y0)*0.32);c.stroke();}
      c.fillStyle=rgba(ag_dk(MH_K.lattice,0.2),1);c.fillRect(bx,y1-(y1-y0)*0.3,bw,3);c.fillStyle="rgba(214,190,160,0.25)";c.fillRect(bx,y0+(y1-y0)*0.36,bw,2);}
    else{const g=c.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,rgba(MH_K.wallPDk,1));g.addColorStop(1,rgba(MH_K.wallP,1));c.fillStyle=g;c.fillRect(bx,y0+14,bw,y1-y0-14);
      c.fillStyle=rgba(MH_K.lattice,1);const wx=bx+bw*0.24,ww=bw*0.52,wy=y0+(y1-y0)*0.3;c.fillRect(wx,wy,ww,(y1-y0)*0.3);c.strokeStyle="rgba(214,190,160,0.4)";c.lineWidth=1.4;
      for(let x=wx+6;x<wx+ww-2;x+=8){c.beginPath();c.moveTo(x,wy+3);c.lineTo(x,wy+(y1-y0)*0.3-3);c.stroke();}}}
  for(let b=0;b<=bays;b++){const x=x0+b*bw-cw/2,g=c.createLinearGradient(x,0,x+cw,0);g.addColorStop(0,rgba(ag_dk(MH_K.col,0.25),1));g.addColorStop(0.6,rgba(MH_K.col,1));g.addColorStop(1,rgba(MH_K.colHi,1));
    c.fillStyle=g;c.fillRect(x,y0+8,cw,y1-y0-8);c.fillStyle=rgba(MH_K.plinth,1);c.fillRect(x-3,y1-6,cw+6,6);}
  // the beam over the columns
  let g=c.createLinearGradient(0,y0,0,y0+16);g.addColorStop(0,rgba(MH_K.colHi,1));g.addColorStop(1,rgba(ag_dk(MH_K.col,0.15),1));c.fillStyle=g;c.fillRect(x0-cw,y0,w+2*cw,16);}
// the bracket sets under the eaves: a row of small stepped blocks along the beam
function mh_brackets(c,x0,x1,y,k){const n=Math.max(3,Math.round((x1-x0)/46));c.fillStyle="rgb(86,62,50)";c.fillRect(x0-14,y-22,x1-x0+28,22);for(let i=0;i<=n;i++){const x=lerp(x0,x1,i/n);
  c.fillStyle=rgba(MH_K.bracket,1);c.fillRect(x-9,y-12,18,12);c.fillRect(x-15,y-20,30,8);c.fillStyle=rgba(ag_lt(MH_K.bracket,0.3),1);c.fillRect(x-15,y-20,30,2);c.fillRect(x-9,y-12,18,2);
  c.fillStyle=rgba(ag_dk(MH_K.bracket,0.35),1);c.fillRect(x-15,y-12,6,2);}
  c.fillStyle=rgba(ag_dk(MH_K.bracket,0.2),1);c.fillRect(x0-14,y-22,x1-x0+28,3);}
// a tiled roof, its eave at ye: o.w the eave's length, o.h the roof's height, o.ridge the ridge's part of it. From each corner the
// roof rises nearly level at first, then more steeply to the ridge's end: the gentle, sagging curve of a Song roof, its corners lifted
// a little; ridge ornaments at each end of a palace's roof (o.plain: none, for a house); o.pent: a short roof against a wall, no ridge
function mh_roof(c,cx,ye,o){const w=o.w,h=o.h,rw=w*(o.ridge||0.56),xa=cx-w/2,xb=cx+w/2,yr=ye-h,lift=Math.min(10,h*0.14),ins=(w-rw)/2;
  const shape=cc=>{cc.moveTo(xa-6,ye-lift);cc.bezierCurveTo(xa+ins*0.5,ye-h*0.06,cx-rw/2-ins*0.16,yr+h*0.36,cx-rw/2,yr);cc.lineTo(cx+rw/2,yr);
    cc.bezierCurveTo(cx+rw/2+ins*0.16,yr+h*0.36,xb-ins*0.5,ye-h*0.06,xb+6,ye-lift);cc.quadraticCurveTo(cx,ye+5,xa-6,ye-lift);cc.closePath();};
  // the eave's soft shadow on what's under it
  c.save();let g=c.createLinearGradient(0,ye,0,ye+30);g.addColorStop(0,"rgba(40,30,30,0.32)");g.addColorStop(1,"rgba(40,30,30,0)");c.fillStyle=g;c.fillRect(xa+ins*0.4,ye,w-ins*0.8,30);c.restore();
  c.save();ag_shape(c,shape);g=c.createLinearGradient(xa,0,xb,0);g.addColorStop(0,rgba(ag_dk(MH_K.tile,0.16),1));g.addColorStop(0.6,rgba(MH_K.tile,1));g.addColorStop(1,rgba(ag_lt(MH_K.tile,0.14),1));c.fillStyle=g;c.fill();
  c.clip();g=c.createLinearGradient(0,yr,0,ye);g.addColorStop(0,"rgba(255,255,255,0.1)");g.addColorStop(1,"rgba(0,0,0,0.14)");c.fillStyle=g;c.fillRect(xa-10,yr-10,w+20,h+20);
  // the rows of tiles, from the ridge down to the eave, fanning out a little towards the corners
  c.lineWidth=1.8;for(let x=xa+6;x<=xb-6;x+=10){const u=(x-cx)/(w/2),d=Math.abs(x-cx),top=d<rw/2?yr:yr+Math.pow((d-rw/2)/ins,0.7)*h*0.9;
    c.strokeStyle="rgba(40,40,46,0.34)";c.beginPath();c.moveTo(x,top);c.lineTo(x+u*6,ye+4);c.stroke();c.strokeStyle="rgba(220,222,226,0.14)";c.beginPath();c.moveTo(x+3,top);c.lineTo(x+3+u*6,ye+4);c.stroke();}
  c.restore();
  // the eave's edge: a band of tile ends, lit on top
  c.strokeStyle=rgba(MH_K.tileDk,1);c.lineWidth=6;c.beginPath();c.moveTo(xa-4,ye-lift+1);c.quadraticCurveTo(cx,ye+7,xb+4,ye-lift+1);c.stroke();
  c.strokeStyle=rgba(MH_K.tileHi,0.85);c.lineWidth=2;c.beginPath();c.moveTo(xa-4,ye-lift-2);c.quadraticCurveTo(cx,ye+4,xb+4,ye-lift-2);c.stroke();
  if(o.pent)return;
  // the ridge
  const rh=o.plain?8:13;c.fillStyle=rgba(MH_K.tileDk,1);c.fillRect(cx-rw/2-4,yr-rh+2,rw+8,rh);c.fillStyle="rgba(200,202,206,0.3)";c.fillRect(cx-rw/2-4,yr-rh+2,rw+8,2);
  if(o.plain)return;
  // an ornament at each end of the ridge: a tall fin rising from it, its tip curling in over the ridge
  const k=clamp(h/90,0.6,1.1);for(const s of [-1,1]){const ex=cx+s*(rw/2+2);c.beginPath();c.moveTo(ex+s*7*k,yr);c.bezierCurveTo(ex+s*12*k,yr-18*k,ex+s*6*k,yr-36*k,ex-s*8*k,yr-42*k);
    c.bezierCurveTo(ex-s*12*k,yr-38*k,ex-s*6*k,yr-32*k,ex-s*3*k,yr-28*k);c.bezierCurveTo(ex-s*6*k,yr-20*k,ex-s*12*k,yr-12*k,ex-s*16*k,yr);c.closePath();
    c.fillStyle=rgba(MH_K.tileDk,1);c.fill();c.strokeStyle="rgba(200,202,206,0.35)";c.lineWidth=1.5;c.beginPath();c.moveTo(ex+s*6*k,yr-4);c.bezierCurveTo(ex+s*10*k,yr-18*k,ex+s*5*k,yr-33*k,ex-s*7*k,yr-40*k);c.stroke();}}
// a hall the fire has taken: its platform, a few charred columns, fallen beams, and its roof come down in a heap of broken tile
function mh_hallBurned(c,cx,ptop,top,o,R){const w=o.w,bays=o.bays||3,colH=o.colH||140,x0=cx-w/2,bw=w/bays;
  // soot on the platform's curb
  let g=c.createLinearGradient(0,ptop,0,ptop+14);g.addColorStop(0,"rgba(30,26,26,0.5)");g.addColorStop(1,"rgba(30,26,26,0)");c.fillStyle=g;c.fillRect(x0-26,ptop,w+52,14);
  // what's left of the walls at the foot of the columns
  for(let b=0;b<bays;b++){const bx=x0+b*bw,hh=colH*(0.12+R()*0.18);c.fillStyle=rgba(mix(MH_K.wallPDk,MH_K.char,0.55),1);c.beginPath();c.moveTo(bx,ptop);
    for(let k=0;k<=6;k++)c.lineTo(bx+bw*k/6,ptop-hh*(0.6+0.4*R()));c.lineTo(bx+bw,ptop);c.closePath();c.fill();}
  // charred columns, burned down to stumps of different heights; one or two still standing
  const tall=[Math.floor(R()*(bays+1)),Math.floor(R()*(bays+1))];
  for(let b=0;b<=bays;b++){const x=x0+b*bw-7,hh=tall.includes(b)?colH*(0.82+R()*0.14):colH*(0.22+R()*0.4);
    g=c.createLinearGradient(x,0,x+14,0);g.addColorStop(0,rgba(MH_K.char,1));g.addColorStop(1,rgba(MH_K.charHi,1));c.fillStyle=g;c.beginPath();c.moveTo(x,ptop);c.lineTo(x,ptop-hh+6*R());
    c.lineTo(x+4,ptop-hh-8*R());c.lineTo(x+9,ptop-hh+4*R());c.lineTo(x+14,ptop-hh-6*R());c.lineTo(x+14,ptop);c.closePath();c.fill();}
  // two fallen beams, leaning
  for(let k=0;k<2;k++){const bx=x0+w*(0.2+0.5*R()),len=w*(0.4+0.3*R()),an=(k?-1:1)*(0.25+0.3*R());c.save();c.translate(bx,ptop-colH*0.18);c.rotate(an);
    g=c.createLinearGradient(0,-8,0,8);g.addColorStop(0,rgba(MH_K.charHi,1));g.addColorStop(1,rgba(MH_K.char,1));c.fillStyle=g;c.fillRect(-len/2,-7,len,14);c.restore();}
  // the roof's tiles and timbers in a heap on the platform
  const hw=w*0.62,hh=colH*0.34;c.beginPath();c.moveTo(cx-hw-30,ptop);for(let k=0;k<=14;k++){const u=k/14,x=cx-hw-30+(2*hw+60)*u;c.lineTo(x,ptop-hh*Math.sin(Math.PI*u)*(0.75+0.35*R()));}
  c.closePath();g=c.createLinearGradient(0,ptop-hh,0,ptop);g.addColorStop(0,rgba(MH_K.ash,1));g.addColorStop(1,rgba(mix(MH_K.ash,MH_K.char,0.6),1));c.fillStyle=g;c.fill();
  c.save();c.clip();for(let k=0;k<70;k++){const x=cx-hw-20+R()*(2*hw+40),y=ptop-R()*hh,r=5+R()*9;c.fillStyle=R()<0.35?rgba(MH_K.char,0.8):rgba(R()<0.5?MH_K.tileHi:MH_K.tile,0.75);
    c.beginPath();c.arc(x,y,r,Math.PI*(1+R()*0.4),Math.PI*(1.6+R()*0.4));c.lineTo(x,y);c.closePath();c.fill();}c.restore();}

/* ---------------------------------------------------------------- inside the palace: the court, by day, by night, and burned */
// the halls, left to right: a gallery hall the fire never reached, the two treasuries, the inner gate, the library (two storeys), the
// corner of another hall; each burned in the burned court (all but the first and the last)
const MH_COURT={ground:730,halls:[
  {cx:150,w:380,bays:5,colH:150,plat:40,eave:66,roofH:84,ridge:0.6,seed:3,keep:true},
  {cx:612,w:192,bays:3,colH:124,plat:36,eave:54,roofH:66,ridge:0.52,seed:11},
  {cx:902,w:192,bays:3,colH:124,plat:36,eave:54,roofH:66,ridge:0.52,seed:17},
  {cx:1180,w:250,bays:3,colH:156,plat:56,eave:62,roofH:82,ridge:0.56,gate:true,seed:23},
  {cx:1520,w:290,bays:5,colH:230,plat:48,eave:66,roofH:88,ridge:0.58,two:true,seed:29},
  {cx:1890,w:260,bays:3,colH:150,plat:40,eave:62,roofH:80,ridge:0.56,seed:31,keep:true}]};
function mh_sky(c,y1,night){let g=c.createLinearGradient(0,0,0,y1);if(night){g.addColorStop(0,rgba(MH_K.night0,1));g.addColorStop(1,rgba(MH_K.night1,1));}
  else{g.addColorStop(0,rgba(MH_K.sky0,1));g.addColorStop(1,rgba(MH_K.sky1,1));}c.fillStyle=g;c.fillRect(0,0,W,y1);
  if(!night)for(const [x,y,rx,ry] of [[320,150,300,40],[1180,90,360,34],[1700,200,260,30]]){const q=c.createRadialGradient(x,y,0,x,y,rx);q.addColorStop(0,"rgba(255,252,246,0.55)");q.addColorStop(1,"rgba(255,252,246,0)");
    c.save();c.translate(x,y);c.scale(1,ry/rx);c.translate(-x,-y);c.fillStyle=q;c.fillRect(x-rx,y-rx,2*rx,2*rx);c.restore();}}
// the city beyond, in the haze: rows of low roofs
function mh_city(c,x0,x1,y,o){o=o||{};const R=ag_rnd(o.seed||5),col=o.col||MH_K.city;let x=x0;while(x<x1){const w=70+R()*90,h=18+R()*22,yy=y-R()*12;
  c.fillStyle=rgba(mix(col,[255,255,255],R()*0.1),o.a||1);c.beginPath();c.moveTo(x,yy+h);c.lineTo(x+w*0.12,yy);c.lineTo(x+w*0.88,yy);c.lineTo(x+w,yy+h);c.closePath();c.fill();
  c.fillStyle=rgba(mix(col,[255,255,255],0.25),o.a||1);c.fillRect(x+w*0.1,yy+h,w*0.8,16+R()*10);x+=w*(0.8+R()*0.4);}}
// everything in the court but its sky: the city beyond, the gallery wall, the halls, the paved court
function mh_courtThings(c,burned){const G=MH_COURT.ground;
  mh_city(c,-20,W+20,G-150,{seed:9});
  c.fillStyle=rgba(MH_K.wallP,1);c.fillRect(0,G-120,W,120);c.fillStyle=rgba(MH_K.tile,1);c.fillRect(0,G-132,W,14);c.fillStyle=rgba(MH_K.tileHi,0.8);c.fillRect(0,G-132,W,2.5);
  if(burned)for(const h of MH_COURT.halls)if(!h.keep)mh_blob(c,h.cx,G-110,h.w*0.7,[34,28,28],0.5);
  for(const h of MH_COURT.halls)mh_hall(c,h.cx,G,Object.assign({},h,{burned:burned&&!h.keep?1:0}));
  // the court: big flagstones, the rows wider as they come nearer
  let g=c.createLinearGradient(0,G,0,H);g.addColorStop(0,rgba(MH_K.flag,1));g.addColorStop(1,rgba(MH_K.flagDk,1));c.fillStyle=g;c.fillRect(0,G,W,H-G);
  const R=ag_rnd(41);let y=G,rh=16;c.strokeStyle="rgba(110,96,80,0.3)";c.lineWidth=1.6;
  while(y<H){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();let x=-R()*120;while(x<W){x+=rh*4.5+R()*rh*3;const sl=(x-960)/960*rh*0.8;c.beginPath();c.moveTo(x,y);c.lineTo(x+sl,y+rh);c.stroke();}y+=rh;rh*=1.24;}}
// flames rising behind the halls at the right, and the glow they throw into the smoke: drawn on the night sky, behind everything
function mh_flames(c){for(const [x,y,r,a] of [[1720,620,700,0.8],[1480,640,460,0.6],[1880,480,420,0.7],[1250,660,300,0.35]])mh_blob(c,x,y,r,MH_K.glow,a);
  mh_blob(c,1660,330,560,[110,56,48],0.55);const R=ag_rnd(9);
  for(let k=0;k<18;k++){const x=1240+R()*700,base=640,h=90+R()*190,w=26+R()*30,g=c.createLinearGradient(0,base-h,0,base);
    g.addColorStop(0,"rgba(240,120,60,0)");g.addColorStop(0.45,"rgba(246,150,70,0.75)");g.addColorStop(1,"rgba(255,214,150,0.95)");c.fillStyle=g;
    c.beginPath();c.moveTo(x-w,base);c.bezierCurveTo(x-w*0.9,base-h*0.4,x-w*0.2,base-h*0.6,x+w*0.1*(R()-0.5),base-h);c.bezierCurveTo(x+w*0.4,base-h*0.55,x+w,base-h*0.4,x+w,base);c.closePath();c.fill();}}
function mh_paintCourt(c,state){const G=MH_COURT.ground;
  if(state==="fire"){// the court at night: the day's picture in the dark, the night sky and the fire behind the halls, its light on them
    mh_paintCourt(c,"day");c.save();c.globalCompositeOperation="multiply";c.fillStyle="rgb(54,56,86)";c.fillRect(0,0,W,H);c.restore();
    const sky=mkCanvas(W,H),sx=sky.getContext("2d");mh_sky(sx,G,true);mh_flames(sx);
    // only where the sky shows: everything in the court cut out of it
    sx.globalCompositeOperation="destination-out";mh_courtThings(sx,false);c.drawImage(sky,0,0);
    c.save();c.globalCompositeOperation="screen";mh_blob(c,1640,560,760,[170,80,40],0.42);mh_blob(c,1500,G+60,640,[140,64,30],0.3);c.restore();return;}
  mh_sky(c,G,false);mh_courtThings(c,state==="burned");
  // the sun from the right: the left of the frame in a little shade
  const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(60,48,56,0.16)");g.addColorStop(0.5,"rgba(60,48,56,0)");g.addColorStop(1,"rgba(255,226,170,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.mhCourt=c=>mh_paintCourt(c,"day");
AG_PLACES.mhCourtFire=c=>mh_paintCourt(c,"fire");
AG_PLACES.mhCourtBurned=c=>mh_paintCourt(c,"burned");
AG_ROOMS.mhCourtFire="mhCourt";AG_ROOMS.mhCourtBurned="mhCourt";
// the fire spreading, laid over the night court: its glow moving left from the right, a little stronger and weaker, and its smoke
function mh_fire(c,t,u,a){if(a<=0.004)return;c.save();c.globalAlpha*=a;c.globalCompositeOperation="screen";
  const f=0.9+0.06*Math.sin(t*2.3)+0.04*Math.sin(t*3.7+1);for(let k=0;k<4;k++){const x=lerp(1800,1800-k*330,clamp(u*1.4-k*0.25,0,1));mh_blob(c,x,600,360+120*u,MH_K.glow,0.22*f*clamp(u*1.6-k*0.3,0,1));}
  c.restore();c.save();c.globalAlpha*=a;for(const [x,s] of [[1720,0],[1520,1],[1260,2]])mh_smoke(c,x,560,t,clamp(u*1.5-s*0.3,0,1),{n:8,h:520,sp:30,r:46,col:[40,34,40],drift:160});c.restore();}

/* ---------------------------------------------------------------- the city from above */
const MH_PLAN={outer:[[250,96],[1676,84],[1690,906],[240,918]],inner:[[560,226],[1360,222],[1366,704],[552,708]],palace:[[836,292],[1086,292],[1086,432],[836,432]],
  canal:[[-20,646],[250,624],[560,604],[960,584],[1366,562],[1690,542],[1940,520]],gate:[960,432],bridge:[960,584],
  vx:[400,520,700,960,1220,1400,1540],hy:[170,330,470,640,780,860],
  // the three jobs' routes (each above the captions' band): the earth from pits far outside the west wall; the timber from the wharves where the canal comes in; the
  // rubble out to a field beyond the north-east gate
  earth:[[40,812],[250,796],[400,780],[700,780],[700,470],[960,470],[960,436]],
  timber:[[300,622],[300,330],[700,330],[836,330],[836,360]],
  rubble:[[1086,362],[1400,362],[1400,170],[1680,170],[1860,128]]};
function mh_poly(c,P,close){c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));if(close)c.closePath();}
function mh_curve(c,P){c.beginPath();c.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length-1;i++){const m=[(P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2];c.quadraticCurveTo(P[i][0],P[i][1],m[0],m[1]);}
  const L=P[P.length-1];c.lineTo(L[0],L[1]);}
AG_PLACES.mhPlan=c=>{const P=MH_PLAN,R=ag_rnd(1015);
  // fields round the city, in long quiet strips
  c.fillStyle="rgb(216,206,182)";c.fillRect(0,0,W,H);
  for(const [x0,y0,x1,y1,dir] of [[0,0,W,96,0],[0,920,W,H,0],[0,96,244,920,1],[1688,84,W,920,1]]){c.save();c.beginPath();c.rect(x0,y0,x1-x0,y1-y0);c.clip();
    if(dir===0){let y=y0;while(y<y1){const h=22+R()*26;c.fillStyle=rgba(R()<0.5?[206,196,168]:[224,214,190],0.8);c.fillRect(x0,y,x1-x0,h-3);y+=h;}}
    else{let x=x0;while(x<x1){const w=26+R()*30;c.fillStyle=rgba(R()<0.5?[206,196,168]:[224,214,190],0.8);c.fillRect(x,y0,w-3,y1-y0);x+=w;}}c.restore();}
  // the outer city: its ground, its wards crowded with houses along their lanes, its streets
  c.save();mh_poly(c,P.outer,true);c.clip();c.fillStyle="rgb(220,210,190)";c.fillRect(0,0,W,H);
  const xs=[236,...P.vx,1700],ys=[80,...P.hy,930];
  for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++){const bx0=xs[i]+12,bx1=xs[i+1]-12,by0=ys[j]+10,by1=ys[j+1]-10;if(bx1-bx0<20||by1-by0<16)continue;
    c.fillStyle="rgba(204,192,172,0.9)";c.fillRect(bx0,by0,bx1-bx0,by1-by0);
    for(let y=by0+4;y<by1-10;y+=17){let x=bx0+3+R()*6;while(x<bx1-14){const w=12+R()*12;if(R()<0.88){const r=R();c.fillStyle=r<0.45?"rgba(156,150,146,0.72)":r<0.8?"rgba(142,136,134,0.72)":"rgba(176,166,152,0.72)";c.fillRect(x,y,Math.min(w,bx1-x-3),11);
        c.fillStyle="rgba(255,250,240,0.16)";c.fillRect(x,y,Math.min(w,bx1-x-3),4);}x+=w+3+R()*4;}}}
  // the streets: the Imperial Way widest, the others narrower
  c.strokeStyle="rgb(238,230,212)";for(const x of P.vx){c.lineWidth=x===960?26:x===520||x===1400?14:9;c.beginPath();c.moveTo(x,60);c.lineTo(x,940);c.stroke();}
  for(const y of P.hy){c.lineWidth=y===470||y===640?14:9;c.beginPath();c.moveTo(200,y);c.lineTo(1720,y);c.stroke();}
  c.restore();
  // the canal, through the city from the west to the east, its bridge on the Imperial Way
  c.lineCap="round";c.lineJoin="round";c.strokeStyle="rgb(124,148,150)";c.lineWidth=28;mh_curve(c,P.canal);c.stroke();c.strokeStyle="rgba(196,214,210,0.55)";c.lineWidth=6;mh_curve(c,P.canal.map(p=>[p[0],p[1]-6]));c.stroke();
  // the bridge: the Imperial Way carried over the water, its two railings
  c.fillStyle="rgb(232,222,202)";c.fillRect(946,562,28,44);c.fillStyle="rgb(150,128,104)";c.fillRect(942,560,5,48);c.fillRect(973,560,5,48);
  // the walls: the outer city's, the inner city's, the palace's, each a band of rammed earth faced with brick
  for(const [pts,w,col] of [[P.outer,16,[150,128,104]],[P.inner,12,[158,136,112]],[P.palace,10,[150,96,84]]]){c.strokeStyle=rgba(col,1);c.lineWidth=w;mh_poly(c,pts,true);c.stroke();
    c.strokeStyle=rgba(ag_lt(col,0.35),0.8);c.lineWidth=2;mh_poly(c,pts.map(p=>[p[0]+2,p[1]-2]),true);c.stroke();}
  // inside the palace: its halls, seen from above
  c.fillStyle="rgb(226,214,196)";c.fillRect(842,298,238,128);for(const [x,y,w,h] of [[868,312,80,34],[974,312,80,34],[900,362,124,44],[852,374,36,40],[1040,374,36,40]]){c.fillStyle="rgb(110,112,118)";c.fillRect(x,y,w,h);c.fillStyle="rgba(255,255,255,0.18)";c.fillRect(x,y,w,h/2);}
  // the gates in each wall: gaps where the streets pass
  c.fillStyle="rgb(238,230,212)";for(const [x,y,w,h] of [[946,898,28,26],[388,904,24,26],[1666,158,30,24],[230,610,26,26],[1676,528,28,26],[946,700,28,16],[544,456,16,28],[1352,456,18,28],[950,426,20,12],[1080,352,12,20],[830,350,12,20]])c.fillRect(x,y,w,h);
  // trees outside the walls, a quiet grey-olive
  for(let k=0;k<26;k++){const x=R()*W,y=R()*H;if(x>200&&x<1730&&y>60&&y<940)continue;c.fillStyle="rgba(150,148,126,0.9)";c.beginPath();c.arc(x,y,10+R()*10,0,TAU);c.fill();c.fillStyle="rgba(180,178,154,0.6)";c.beginPath();c.arc(x+4,y-4,6+R()*6,0,TAU);c.fill();}
  // a little shade on the left, the light on the right
  const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(60,48,56,0.12)");g.addColorStop(0.5,"rgba(60,48,56,0)");g.addColorStop(1,"rgba(255,226,170,0.07)");c.fillStyle=g;c.fillRect(0,0,W,H);};
// a polyline's length, and the point part u of the way along it, with the direction there
function mh_len(P){let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);return L;}
function mh_along(P,u){const L=mh_len(P);let d=clamp(u,0,1)*L;for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);
  if(d<=s||i===P.length-1){const k=s?clamp(d/s,0,1):0;return{x:lerp(P[i-1][0],P[i][0],k),y:lerp(P[i-1][1],P[i][1],k),an:Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0])};}d-=s;}return{x:P[0][0],y:P[0][1],an:0};}
// a route drawn out to part u of its length: a dashed line in its colour (amber: what each job costs), with a soft paper edge under it
function mh_route(c,P,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||u<=0)return;const col=o.col||LP.amber,w=o.w||8,q=mh_part(P,u);
  c.save();c.globalAlpha*=a;c.lineCap="round";c.lineJoin="round";c.strokeStyle="rgba(250,247,240,0.85)";c.lineWidth=w+8;mh_poly(c,q);c.stroke();
  c.setLineDash(o.solid?[]:[22,14]);c.strokeStyle=rgba(col,1);c.lineWidth=w;mh_poly(c,q);c.stroke();c.setLineDash([]);
  // an arrowhead where it has reached
  const e=mh_along(P,u);if(o.head!==false){c.fillStyle=rgba(col,1);c.save();c.translate(e.x,e.y);c.rotate(e.an);c.beginPath();c.moveTo(14,0);c.lineTo(-10,-13);c.lineTo(-10,13);c.closePath();c.fill();c.restore();}
  c.restore();}
// the first part u of a polyline, as a polyline
function mh_part(P,u){const L=mh_len(P);let d=clamp(u,0,1)*L;const out=[P[0]];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);
  if(d<=s){const k=s?d/s:0;out.push([lerp(P[i-1][0],P[i][0],k),lerp(P[i-1][1],P[i][1],k)]);return out;}out.push(P[i]);d-=s;}return out;}
// a cart seen from above, at (x, y), heading an: its load (earth, timber or rubble), its two wheels, the ox in front
function mh_cartTop(c,x,y,an,load,a){if(a<=0.004)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.rotate(an);
  c.fillStyle="rgba(60,44,30,0.25)";c.fillRect(-15,-6,32,16);
  c.fillStyle=rgba(MH_K.timberDk,1);c.fillRect(-16,-10,30,20);c.fillStyle="rgb(40,34,30)";c.fillRect(-6,-13,8,4);c.fillRect(-6,9,8,4);
  const col=load==="earth"?MH_K.earth:load==="timber"?MH_K.timber:[150,146,140];c.fillStyle=rgba(col,1);c.fillRect(-14,-8,26,16);
  if(load==="timber"){c.strokeStyle=rgba(MH_K.timberDk,0.9);c.lineWidth=1.4;for(const yy of [-4,0,4]){c.beginPath();c.moveTo(-14,yy);c.lineTo(12,yy);c.stroke();}}
  if(load==="rubble"){c.fillStyle="rgba(70,66,64,0.9)";for(const [px,py] of [[-8,-3],[2,2],[-2,-5],[6,-2],[-10,3]])c.fillRect(px,py,4,3);}
  c.strokeStyle="rgba(90,70,50,0.9)";c.lineWidth=2;c.beginPath();c.moveTo(14,-4);c.lineTo(24,-2);c.moveTo(14,4);c.lineTo(24,2);c.stroke();
  c.fillStyle="rgb(96,80,66)";c.beginPath();c.ellipse(32,0,10,6.5,0,0,TAU);c.fill();c.beginPath();c.ellipse(43,0,4.5,3.5,0,0,TAU);c.fill();c.restore();}
// carts on a route, load after load: n of them, a period apart, each a part of the way along; they fade in at the start and out at the end
function mh_carts(c,P,t,t0,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004||t<t0)return;const n=o.n||4,per=o.per||5.5,sp=o.sp||0.12;
  for(let k=0;k<n;k++){const u=((t-t0)*sp-k/n)%1;if((t-t0)*sp-k/n<0)continue;const p=mh_along(P,u),fa=sstep(0,0.06,u)*(1-sstep(0.92,1,u));mh_cartTop(c,p.x,p.y,p.an,o.load,a*fa);}}

/* ---------------------------------------------------------------- the main street, cut open: the canal, the street, the palace gate */
const MH_ST={street:700,canal:[0,292],bank:[292,372],trench:[372,1434],deep:866,water:726,gate:[1434,1764],gateTop:372,pass:588};
// earth in section: loess, in layers, with a few stones; painted into a rectangle
function mh_soil(c,x0,y0,x1,y1,seed){const R=ag_rnd(seed||3);let g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(MH_K.earth,1));g.addColorStop(0.55,rgba(mix(MH_K.earth,MH_K.earthDk,0.4),1));g.addColorStop(1,rgba(MH_K.earthDk,1));
  c.fillStyle=g;c.fillRect(x0,y0,x1-x0,y1-y0);c.save();c.beginPath();c.rect(x0,y0,x1-x0,y1-y0);c.clip();
  for(let k=0;k<7;k++){const y=y0+(y1-y0)*(0.12+k*0.13)+R()*8;c.strokeStyle=rgba(k%2?MH_K.earthHi:MH_K.earthDk,0.22);c.lineWidth=2+R()*3;c.beginPath();c.moveTo(x0,y);
    for(let x=x0;x<=x1;x+=60)c.lineTo(x,y+mh_wob(x/200,k)*5);c.stroke();}
  for(let k=0;k<(x1-x0)*(y1-y0)/6000;k++){c.fillStyle=rgba(R()<0.5?MH_K.earthHi:ag_dk(MH_K.earthDk,0.15),0.6);c.beginPath();c.ellipse(x0+R()*(x1-x0),y0+R()*(y1-y0),2+R()*4,1.5+R()*2.5,R()*3,0,TAU);c.fill();}
  c.restore();}
// a row of houses along the street's far side, in elevation: shops open to the street, plastered walls, tiled roofs
function mh_houses(c,x0,x1,base,R){let x=x0;while(x<x1-60){const w=Math.min(x1-x,110+R()*80),h=74+R()*36,top=base-h;
  c.fillStyle=rgba(mix(MH_K.wallP,MH_K.wallPDk,R()*0.6),1);c.fillRect(x,top,w,h);
  // an open front, in shade, with a post or two
  c.fillStyle="rgba(70,56,48,0.85)";c.fillRect(x+w*0.18,top+h*0.32,w*0.64,h*0.68);c.fillStyle=rgba(MH_K.timberDk,1);c.fillRect(x+w*0.18,top+h*0.3,w*0.64,5);c.fillRect(x+w*0.5-3,top+h*0.32,6,h*0.68);
  mh_roof(c,x+w/2,top+4,{w:w+30,h:24+R()*8,ridge:0.66,plain:true});x+=w+6+R()*14;}}
// a willow by the water: a trunk, and long hanging strands in a quiet grey-olive
function mh_willow(c,x,base,s,R){c.fillStyle="rgb(96,82,66)";c.beginPath();c.moveTo(x-7*s,base);c.quadraticCurveTo(x-2*s,base-90*s,x+6*s,base-170*s);c.lineTo(x+14*s,base-168*s);c.quadraticCurveTo(x+8*s,base-90*s,x+8*s,base);c.closePath();c.fill();
  c.strokeStyle="rgba(140,142,112,0.85)";c.lineWidth=3*s;c.lineCap="round";for(let k=0;k<26;k++){const ax=x+(R()-0.4)*150*s,ay=base-(150+R()*60)*s,len=(70+R()*90)*s;
    c.beginPath();c.moveTo(ax,ay);c.quadraticCurveTo(ax-10*s,ay+len*0.5,ax-14*s,ay+len);c.stroke();}
  c.fillStyle="rgba(150,152,120,0.5)";c.beginPath();c.ellipse(x+10*s,base-190*s,80*s,40*s,0,0,TAU);c.fill();}
function mh_paintStreet(c,rebuilt){const S=MH_ST,R=ag_rnd(77),st=S.street;
  mh_sky(c,st,false);mh_city(c,-20,W+20,st-150,{seed:21});
  // the halls inside the palace, beyond the gate: burned, or new
  c.save();c.beginPath();c.rect(S.gate[1]-30,0,W,st);c.clip();
  for(const h of [{cx:1880,w:240,bays:3,colH:150,plat:40,eave:60,roofH:78,ridge:0.56,seed:61}])mh_hall(c,h.cx,st,Object.assign({},h,{burned:rebuilt?0:1}));c.restore();
  if(!rebuilt){mh_hall(c,1560,st-40,{w:180,bays:3,colH:120,plat:30,seed:67,burned:1});}
  // houses along the street's far side
  mh_houses(c,S.bank[1]+10,S.gate[0]-20,st,R);
  // the canal's far bank and its willows
  mh_willow(c,120,st-6,1.0,R);mh_willow(c,230,st-2,0.8,R);
  // the ground, cut open: the street's packed surface, the loess under it
  mh_soil(c,0,st,W,H,5);c.fillStyle=rgba(mix(MH_K.earthDk,[90,76,66],0.4),1);c.fillRect(0,st,W,12);c.fillStyle="rgba(255,240,210,0.35)";c.fillRect(0,st,W,2);
  // the canal in section: its channel cut into the ground, sloping up to the bank on its right; above its water, the channel's far side
  const [ca,cb]=S.canal,chan=cc=>{cc.moveTo(ca-10,st);cc.lineTo(cb,st);cc.lineTo(cb-70,S.deep);cc.lineTo(ca-10,S.deep);cc.closePath();};
  c.save();ag_shape(c,chan);c.fillStyle=rgba(ag_dk(MH_K.earthDk,0.22),1);c.fill();c.clip();
  let g=c.createLinearGradient(0,S.water,0,S.deep);g.addColorStop(0,rgba(MH_K.water,1));g.addColorStop(1,rgba(ag_dk(MH_K.water,0.35),1));c.fillStyle=g;c.fillRect(ca-10,S.water,cb-ca+10,S.deep-S.water);
  c.fillStyle=rgba(MH_K.waterHi,0.9);c.fillRect(ca-10,S.water,cb-ca,3);c.restore();
  c.strokeStyle="rgba(60,44,32,0.5)";c.lineWidth=2;c.beginPath();c.moveTo(cb,st);c.lineTo(cb-70,S.deep);c.stroke();
  // the bank: a raised lip of earth between the canal and the street
  mh_bank(c,0);
  // the line of the cut along the ground's top
  c.fillStyle="rgba(60,44,32,0.55)";c.fillRect(cb,st-1,W-cb,2.5);
  // the palace gate, cut through its passage: its platform of rammed earth faced with brick, a passage through it under a timber lintel,
  // the gate tower on top
  const [ga,gb]=S.gate,gt=S.gateTop,plat=cc=>{cc.moveTo(ga,st);cc.lineTo(ga+18,gt);cc.lineTo(gb-18,gt);cc.lineTo(gb,st);cc.closePath();};
  c.save();ag_shape(c,plat);g=c.createLinearGradient(ga,0,gb,0);g.addColorStop(0,rgba(MH_K.cut,1));g.addColorStop(1,rgba(MH_K.cutHi,1));c.fillStyle=g;c.fill();c.clip();
  c.strokeStyle="rgba(40,30,26,0.35)";c.lineWidth=1.4;for(let y=gt+12,k=0;y<st;y+=12,k++){c.beginPath();c.moveTo(ga,y);c.lineTo(gb,y);c.stroke();
    for(let x=ga+(k%2)*22;x<gb;x+=44){c.beginPath();c.moveTo(x,y-12);c.lineTo(x,y);c.stroke();}}
  // the passage: dim inside, the day at each end
  g=c.createLinearGradient(ga,0,gb,0);g.addColorStop(0,"rgb(120,104,90)");g.addColorStop(0.18,"rgb(58,48,44)");g.addColorStop(0.82,"rgb(58,48,44)");g.addColorStop(1,"rgb(150,132,112)");
  c.fillStyle=g;c.fillRect(ga-4,S.pass,gb-ga+8,st-S.pass);c.fillStyle=rgba(MH_K.timberDk,1);c.fillRect(ga-4,S.pass-14,gb-ga+8,14);c.fillStyle="rgba(255,236,200,0.25)";c.fillRect(ga-4,S.pass-14,gb-ga+8,2);c.restore();
  c.strokeStyle="rgba(40,30,26,0.6)";c.lineWidth=3;ag_shape(c,plat);c.stroke();
  mh_hall(c,(ga+gb)/2,gt+8,{w:gb-ga-110,bays:5,colH:118,plat:8,eave:70,roofH:78,ridge:0.58,seed:71});
  // the light: shade on the left, the sun on the right
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(60,48,56,0.16)");g.addColorStop(0.5,"rgba(60,48,56,0)");g.addColorStop(1,"rgba(255,226,170,0.08)");c.fillStyle=g;c.fillRect(0,0,W,H);}
// the bank between the canal and the street: a lip of earth above the street; broken through by part br (0 to 1) of the way down to the
// trench's floor, a notch the canal's water runs through
function mh_bank(c,br){const S=MH_ST,[a,b]=S.bank,st=S.street,top=st-20;c.save();
  c.fillStyle=rgba(MH_K.earth,1);c.beginPath();c.moveTo(a-30,st);c.quadraticCurveTo(a-8,top,a+14,top);c.lineTo(b-14,top);c.quadraticCurveTo(b+8,top,b+30,st);c.closePath();c.fill();
  c.strokeStyle="rgba(255,240,210,0.4)";c.lineWidth=2;c.beginPath();c.moveTo(a+12,top+1);c.lineTo(b-12,top+1);c.stroke();
  if(br>0){// the notch: the bank dug away from its top down towards the trench's floor, its sides sloping
    const m=(a+b)/2,hw=18+br*16,cut=top+br*(S.deep-top);c.fillStyle=rgba(ag_dk(MH_K.earthDk,0.32),1);c.beginPath();c.moveTo(m-hw-14,top-1);c.lineTo(m-hw,cut);c.lineTo(b+2,cut);c.lineTo(b+2,top+20);c.lineTo(m+hw+14,top-1);c.closePath();c.fill();}
  c.restore();}
AG_PLACES.mhStreet=c=>mh_paintStreet(c,false);
AG_PLACES.mhStreetNew=c=>mh_paintStreet(c,true);
AG_ROOMS.mhStreetNew="mhStreet";
// the rubble's texture, kept once: broken grey tile, charred timber, ash and earth
function mh_rubbleTex(){return ag_kept("mhRubble",512,256,(c,w,h)=>{const R=ag_rnd(88);c.fillStyle=rgba(mix(MH_K.ash,MH_K.earthDk,0.35),1);c.fillRect(0,0,w,h);
  for(let k=0;k<520;k++){const x=R()*w,y=R()*h,r=3+R()*9,q=R();c.fillStyle=q<0.4?rgba(MH_K.tile,0.95):q<0.6?rgba(MH_K.char,0.9):q<0.8?rgba(MH_K.tileHi,0.9):rgba(MH_K.earthHi,0.8);
    c.save();c.translate(x,y);c.rotate(R()*TAU);c.beginPath();c.moveTo(-r,-r*0.4);c.lineTo(r*0.8,-r*0.6);c.lineTo(r,r*0.3);c.lineTo(-r*0.6,r*0.6);c.closePath();c.fill();c.restore();}});}
/* what happens in the street, drawn over mhStreet or mhStreetNew. st: dig (0 to 1: the trench, dug down to its depth), bank (0 to 1: the
   canal's bank broken), water (0 to 1: how far along the trench the water has come), drain (0 to 1: the water gone), boats (a list of
   {x, kind: "raft" or "boat"}: each one's front, floating), fill (0 to 1: the rubble's level), street (0 to 1: the street laid again
   over it), heaps (0 to 1: the dug earth piled beside the trench), carts ([{x, dir, load}] on the street). */
function mh_street(c,t,st){const S=MH_ST,[ta,tb]=S.trench,top=S.street,dig=st.dig||0,depth=lerp(top,S.deep,dig);
  if(st.bank>0)mh_bank(c,st.bank);
  if(dig>0){// the trench: the earth taken out, its far wall seen inside it, a shadow under its lip
    let g=c.createLinearGradient(0,top,0,depth);g.addColorStop(0,rgba(ag_dk(MH_K.earthDk,0.32),1));g.addColorStop(1,rgba(ag_dk(MH_K.earthDk,0.12),1));c.fillStyle=g;c.fillRect(ta,top,tb-ta,depth-top);
    c.fillStyle="rgba(40,30,24,0.3)";c.fillRect(ta,top,tb-ta,8);c.strokeStyle=rgba(MH_K.earthHi,0.4);c.lineWidth=2;c.beginPath();c.moveTo(ta,depth);c.lineTo(tb,depth);c.stroke();
    // spade marks along its far wall
    c.strokeStyle="rgba(60,44,30,0.14)";c.lineWidth=3;const R=ag_rnd(12);for(let x=ta+30;x<tb-20;x+=70+R()*40){c.beginPath();c.moveTo(x,top+16);c.quadraticCurveTo(x-8,(top+depth)/2,x-4,depth-10);c.stroke();}}
  if(st.heaps>0){// the dug earth in heaps along the trench's near edge, before it's carried into the palace
    c.save();c.globalAlpha*=st.heaps;const R=ag_rnd(5);for(let x=ta+40;x<tb-40;x+=120){const hw=44+R()*18,hh=22+R()*14;c.fillStyle=rgba(MH_K.earth,1);c.beginPath();c.moveTo(x-hw,top+2);
      c.quadraticCurveTo(x,top-hh*2,x+hw,top+2);c.closePath();c.fill();c.fillStyle=rgba(MH_K.earthHi,0.7);c.beginPath();c.moveTo(x-hw*0.2,top-hh*0.85);c.quadraticCurveTo(x+hw*0.3,top-hh*0.9,x+hw*0.7,top-2);c.lineTo(x+hw*0.2,top-2);c.closePath();c.fill();}c.restore();}
  const wa=(st.water||0)*(1-(st.drain||0));
  if(wa>0&&dig>0){// the water: from the breach along the trench as far as it has come, its front a soft slope
    const x0=S.canal[1]-60,xf=lerp(S.bank[1]+10,tb,st.water),wy=S.water;c.save();c.globalAlpha*=1-(st.drain||0);
    let g=c.createLinearGradient(0,wy,0,depth);g.addColorStop(0,rgba(MH_K.water,1));g.addColorStop(1,rgba(ag_dk(MH_K.water,0.35),1));c.fillStyle=g;c.beginPath();c.moveTo(x0,wy);
    c.lineTo(Math.max(x0,xf-30),wy);c.quadraticCurveTo(xf,wy+4,Math.min(tb,xf+10),depth);c.lineTo(x0,depth);c.closePath();c.fill();
    c.fillStyle=rgba(MH_K.waterHi,0.9);c.fillRect(x0,wy,Math.max(0,xf-30-x0),3);
    // soft lines of light moving on it
    c.strokeStyle="rgba(214,230,226,0.35)";c.lineWidth=2;for(let k=0;k<10;k++){const x=x0+60+((k*137+t*24)%Math.max(60,xf-x0-120));c.beginPath();c.moveTo(x,wy+10+k%3*9);c.lineTo(x+36,wy+10+k%3*9);c.stroke();}c.restore();}
  for(const b of st.boats||[])if(b.a!==0)mh_boat(c,b.x,S.water,b.kind,t,b.a==null?1:b.a);
  if(st.fill>0&&dig>0){// the rubble, tipped in and rising from the trench's floor
    const fy=lerp(depth,top,st.fill);c.save();c.beginPath();c.rect(ta,fy,tb-ta,depth-fy+1);c.clip();c.fillStyle=c.createPattern(mh_rubbleTex(),"repeat");c.fillRect(ta,fy,tb-ta,depth-fy+1);
    const g=c.createLinearGradient(0,fy,0,fy+20);g.addColorStop(0,"rgba(255,250,240,0.25)");g.addColorStop(1,"rgba(255,250,240,0)");c.fillStyle=g;c.fillRect(ta,fy,tb-ta,20);c.restore();}
  if(st.street>0){// the street laid again over the filled trench: its packed surface and the earth under it, as it was
    c.save();c.globalAlpha*=st.street;c.fillStyle=rgba(MH_K.earth,1);mh_soilPatch(c,ta,top,tb,depth);c.fillStyle=rgba(mix(MH_K.earthDk,[90,76,66],0.4),1);c.fillRect(ta,top,tb-ta,12);
    c.fillStyle="rgba(255,240,210,0.35)";c.fillRect(ta,top,tb-ta,2);c.restore();}
  for(const k of st.carts||[])mh_oxcart(c,k.x,top,k.dir||1,k.load,t,k.a==null?1:k.a);}
// the ground as it was, over the trench: copied from the street's own place, so it matches and nothing more is painted
function mh_soilPatch(c,x0,y0,x1,y1){c.drawImage(ag_place("mhStreet"),x0,y0,x1-x0,y1-y0+2,x0,y0,x1-x0,y1-y0+2);}
// a raft of logs or a flat boat with stone, floating at wy, its front at x
function mh_boat(c,x,wy,kind,t,a){if(a<=0.004)return;c.save();c.globalAlpha*=a;const bob=Math.sin(t*1.3+x*0.01)*1.5;c.translate(0,bob);
  if(kind==="raft"){const L=280;for(let k=0;k<4;k++){const y=wy-24+k*9,g=c.createLinearGradient(0,y-8,0,y+8);g.addColorStop(0,rgba(ag_lt(MH_K.timber,0.2),1));g.addColorStop(1,rgba(MH_K.timberDk,1));
      c.fillStyle=g;rr(c,x-L+k*6,y-8,L-k*10,16,8);c.fill();c.fillStyle=rgba(ag_lt(MH_K.timber,0.35),1);c.beginPath();c.ellipse(x-k*4-2,y,4.5,7.5,0,0,TAU);c.fill();}
    c.fillStyle="rgb(80,64,48)";for(const u of [0.2,0.55,0.85]){c.fillRect(x-L*u-3,wy-30,6,30);}
    c.fillStyle="rgba(40,50,52,0.25)";c.fillRect(x-L,wy+4,L,6);}
  else{const L=250;c.fillStyle=rgba(MH_K.timberDk,1);c.beginPath();c.moveTo(x-L,wy-18);c.lineTo(x,wy-22);c.quadraticCurveTo(x-6,wy+8,x-30,wy+12);c.lineTo(x-L+24,wy+12);c.quadraticCurveTo(x-L,wy+6,x-L,wy-18);c.closePath();c.fill();
    c.fillStyle=rgba(ag_lt(MH_K.timber,0.15),1);c.fillRect(x-L,wy-22,L,5);
    // a load of dressed stone and bricks
    for(let k=0;k<5;k++){const bx=x-L+30+k*40,bh=18+(k%2)*10;c.fillStyle=rgba(k%2?[190,180,166]:[164,150,136],1);c.fillRect(bx,wy-22-bh,34,bh);c.fillStyle="rgba(255,255,255,0.25)";c.fillRect(bx,wy-22-bh,34,3);}
    c.fillStyle="rgba(40,50,52,0.25)";c.fillRect(x-L+20,wy+12,L-40,5);}
  c.restore();}
// an ox and its cart on the street, seen from the side, at x (the ox's nose), walking dir (1: right), with its load
function mh_oxcart(c,x,y,dir,load,t,a){if(a<=0.004)return;c.save();c.globalAlpha*=a;c.translate(x,y);c.scale(dir,1);const step=Math.sin(t*3.2);
  // the cart: a bed on two big spoked wheels, its shafts to the ox's yoke
  c.fillStyle="rgba(60,44,30,0.2)";c.beginPath();c.ellipse(-150,2,120,6,0,0,TAU);c.fill();
  c.fillStyle=rgba(MH_K.timberDk,1);c.fillRect(-250,-64,160,10);c.fillRect(-96,-60,70,5);
  const lc=load==="timber"?MH_K.timber:load==="rubble"?[150,146,140]:MH_K.earth;c.fillStyle=rgba(lc,1);c.beginPath();c.moveTo(-246,-64);c.quadraticCurveTo(-170,-104,-96,-64);c.closePath();c.fill();
  c.strokeStyle="rgb(70,52,38)";c.lineWidth=5;c.beginPath();c.arc(-170,-30,30,0,TAU);c.stroke();c.lineWidth=3;for(let k=0;k<6;k++){const an=k*Math.PI/3+t*1.1*dir*0;c.beginPath();c.moveTo(-170,-30);c.lineTo(-170+Math.cos(an)*30,-30+Math.sin(an)*30);c.stroke();}
  // the ox: a heavy body, its hump, four legs stepping, its head down a little with short horns, its tail
  const ox=c2=>{c2.moveTo(-86,-62);c2.bezierCurveTo(-90,-96,-60,-104,-30,-98);c2.bezierCurveTo(-10,-94,4,-90,10,-80);c2.bezierCurveTo(22,-78,30,-70,30,-58);
    c2.bezierCurveTo(30,-50,22,-44,12,-46);c2.bezierCurveTo(4,-40,-6,-38,-14,-40);c2.lineTo(-70,-40);c2.bezierCurveTo(-84,-42,-88,-50,-86,-62);c2.closePath();};
  for(const [lx,ph] of [[-74,0],[-60,Math.PI],[-12,Math.PI],[0,0]]){const sw=Math.sin(t*3.2+ph)*6;c.strokeStyle="rgb(84,70,58)";c.lineWidth=8;c.lineCap="round";c.beginPath();c.moveTo(lx,-44);c.lineTo(lx+sw,-2);c.stroke();}
  ag_soft(c,ox,[112,94,78],[164,146,124],0,-96,80,"rgba(40,30,24,0.35)",10);
  c.fillStyle="rgb(70,58,48)";c.beginPath();c.ellipse(26,-52,6,4,0.4,0,TAU);c.fill();c.strokeStyle="rgb(220,208,184)";c.lineWidth=3.5;c.beginPath();c.moveTo(8,-80);c.quadraticCurveTo(10,-94,2,-98);c.stroke();
  c.strokeStyle="rgb(90,74,60)";c.lineWidth=3;c.beginPath();c.moveTo(-86,-80);c.quadraticCurveTo(-98,-64,-96,-46+step*2);c.stroke();
  c.restore();}

/* ---------------------------------------------------------------- the people of Kaifeng, for lp_person
   Ding Wei in an official's round-collared robe, in a deep wine (the robes of the highest ranks were purple; this one keeps clear of
   the agent's violet), and the black gauze cap of an official, its stiff wings short enough to stay inside the head's picture; the
   diggers, boatmen and carters in short hemp tunics, the hair tied up under a cloth. Their hands hold only their tools. */
function mh_futou(c,P){const k=[30,28,30];
  // the wings first, behind the cap: thin, stiff and straight, one each side
  c.fillStyle=rgba(k,1);c.beginPath();c.moveTo(232,326);c.lineTo(166,322);c.quadraticCurveTo(162,326,166,330);c.lineTo(232,336);c.closePath();c.fill();
  c.beginPath();c.moveTo(330,300);c.lineTo(434,292);c.quadraticCurveTo(438,296,434,300);c.lineTo(330,310);c.closePath();c.fill();
  // the cap: low over the brow, rising behind into a rounded crown
  const cap=cc=>{cc.moveTo(212,380);cc.bezierCurveTo(204,330,214,292,240,274);cc.bezierCurveTo(262,258,300,256,318,268);cc.bezierCurveTo(336,280,342,296,346,312);
    cc.bezierCurveTo(372,316,392,334,394,364);cc.bezierCurveTo(360,354,320,352,288,356);cc.bezierCurveTo(254,360,228,370,212,380);cc.closePath();};
  ag_soft(c,cap,[44,40,44],[110,106,112],320,280,120,"rgba(0,0,0,0.5)",12);
  // the gauze's sheen, and the band at the brow
  c.strokeStyle="rgba(150,146,156,0.35)";c.lineWidth=2;c.beginPath();c.moveTo(244,286);c.quadraticCurveTo(280,268,316,276);c.stroke();
  c.strokeStyle="rgba(20,18,20,0.8)";c.lineWidth=5;c.beginPath();c.moveTo(214,376);c.bezierCurveTo(250,362,320,350,392,360);c.stroke();}
// the round collar's inner edge: a thin white band of the robe under it, at the neck
function mh_roundCollar(c,P){c.strokeStyle="rgba(236,230,218,0.9)";c.lineWidth=4;c.beginPath();c.moveTo(236,566);c.bezierCurveTo(262,596,312,606,356,596);c.stroke();
  // the robe's front edge, from the collar down to the near side, where it fastens
  c.strokeStyle=rgba(ag_dk(P.top.c,0.45),0.55);c.lineWidth=3;c.beginPath();c.moveTo(250,604);c.bezierCurveTo(222,628,190,650,160,664);c.stroke();
  c.strokeStyle=rgba(ag_lt(P.top.c,0.25),0.35);c.lineWidth=2;c.beginPath();c.moveTo(252,610);c.bezierCurveTo(224,634,192,656,162,670);c.stroke();}
// a worker's head cloth: dark cloth over the top of the head, the hair tied in a knot under it at the crown, its ends tucked in
function mh_wrap(col){return(c,P)=>{const f=cc=>{cc.moveTo(212,378);cc.bezierCurveTo(204,326,230,290,268,280);cc.bezierCurveTo(300,272,340,276,366,296);cc.bezierCurveTo(386,312,394,338,394,362);
    cc.bezierCurveTo(360,350,320,348,290,352);cc.bezierCurveTo(258,356,232,366,212,378);cc.closePath();};
  ag_soft(c,f,col,ag_lt(col,0.32),340,290,120,rgba(ag_dk(col,0.7),0.45),12);
  // the knot at the crown
  ag_soft(c,cc=>cc.ellipse(276,272,26,18,-0.3,0,TAU),col,ag_lt(col,0.3),286,262,30,rgba(ag_dk(col,0.7),0.4),6);
  c.strokeStyle=rgba(ag_dk(col,0.4),0.6);c.lineWidth=2.4;c.beginPath();c.moveTo(214,372);c.bezierCurveTo(250,356,320,346,392,356);c.stroke();
  c.beginPath();c.moveTo(232,316);c.quadraticCurveTo(290,300,360,312);c.stroke();};}
const MH_PEOPLE={
  ding:{name:"Ding Wei",key:"mh-ding",skin:[228,190,158],hair:{style:"cropped",c:[34,30,30]},top:{kind:"tunic",c:[104,52,66],paint:mh_roundCollar},hat:{paint:mh_futou},breath:0.24},
  digger:{name:"A digger",key:"mh-digger",skin:[208,164,126],hair:{style:"cropped",c:[30,26,24]},top:{kind:"robe",c:[176,158,128]},hat:{paint:mh_wrap([74,66,60])},breath:0.31},
  boatman:{name:"A boatman",key:"mh-boatman",skin:[192,148,110],hair:{style:"cropped",c:[28,24,22]},beard:[92,80,70],top:{kind:"robe",c:[98,92,86]},hat:{paint:mh_wrap([150,138,116])},breath:0.28},
  carter:{name:"A carter",key:"mh-carter",skin:[220,180,144],hair:{style:"cropped",c:[36,30,28]},top:{kind:"robe",c:[118,92,70]},hat:{paint:mh_wrap([128,76,60])},breath:0.27}
};
// what each holds, in figure space at the near hand's grip (the fist, a little past the wrist along the forearm), all passing behind the
// fingers (lp_person's o.holdBack, so the hand closes over them): a spade carried on the near shoulder, its iron blade up behind it; a
// punting pole, leaning forward clear of the face; an ox driver's short whip, its lash hanging in front
const mh_grip=h=>{const [x,y]=h.near,e=h.nearElbow,L=Math.hypot(x-e[0],y-e[1])||1;return[x+(x-e[0])/L*58,y+(y-e[1])/L*58];};
function mh_shaft(c,x0,y0,x1,y1,w,col){c.save();c.lineCap="round";c.strokeStyle=rgba(col,1);c.lineWidth=w;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();
  c.strokeStyle=rgba(ag_lt(col,0.3),0.6);c.lineWidth=w*0.28;c.beginPath();c.moveTo(x0+w*0.25,y0);c.lineTo(x1+w*0.25,y1);c.stroke();c.restore();}
function mh_spade(c,h){const [x,y]=mh_grip(h),sx=140,sy=586,L=Math.hypot(sx-x,sy-y),ux=(sx-x)/L,uy=(sy-y)/L,
    b0=[x-ux*46,y-uy*46],b1=[x+ux*(L+150),y+uy*(L+150)];
  mh_shaft(c,b0[0],b0[1],b1[0],b1[1],15,[124,90,60]);
  // the iron blade on the shaft's far end, flat to us, its edge rounded
  c.save();c.translate(b1[0],b1[1]);c.rotate(Math.atan2(uy,ux));const iron=[84,86,92];
  const bl=cc=>{cc.moveTo(-10,-20);cc.lineTo(28,-22);cc.lineTo(36,-46);cc.bezierCurveTo(70,-50,118,-46,138,-30);cc.bezierCurveTo(148,-14,148,14,138,30);
    cc.bezierCurveTo(118,46,70,50,36,46);cc.lineTo(28,22);cc.lineTo(-10,20);cc.closePath();};
  ag_soft(c,bl,iron,ag_lt(iron,0.35),70,-20,90,"rgba(0,0,0,0.4)",8);
  c.strokeStyle=rgba(ag_lt(iron,0.55),0.7);c.lineWidth=3;c.beginPath();c.moveTo(136,-28);c.bezierCurveTo(146,-12,146,12,136,28);c.stroke();c.restore();}
function mh_pole(c,h){const [x,y]=mh_grip(h),col=[156,144,104],x0=x+180,y0=y-600,x1=x-138,y1=y+460;mh_shaft(c,x0,y0,x1,y1,12,col);
  // the bamboo's joints
  c.save();c.strokeStyle=rgba(ag_dk(col,0.35),0.7);c.lineWidth=2.5;for(let k=1;k<9;k++){const u=k/9,px=lerp(x0,x1,u),py=lerp(y0,y1,u);if(Math.abs(py-y)<40)continue;c.beginPath();c.moveTo(px-7,py+1);c.lineTo(px+7,py-1);c.stroke();}c.restore();}
function mh_whip(c,h){const [x,y]=mh_grip(h),tip=[x+54,y-176];mh_shaft(c,x-12,y+44,tip[0],tip[1],10,[150,126,84]);
  // the lash: a thin cord from the tip, over and down in front
  c.save();c.lineCap="round";c.strokeStyle="rgb(96,78,58)";c.lineWidth=4;c.beginPath();c.moveTo(tip[0],tip[1]);
  c.bezierCurveTo(tip[0]+60,tip[1]-40,tip[0]+104,tip[1]+40,tip[0]+86,tip[1]+150);c.bezierCurveTo(tip[0]+74,tip[1]+220,tip[0]+92,tip[1]+262,tip[0]+108,tip[1]+290);c.stroke();c.restore();}
