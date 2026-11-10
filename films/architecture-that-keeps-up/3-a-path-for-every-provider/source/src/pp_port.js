/* ===== A path for every provider: the ports, 1956 and after =====
   The film's own pictures for its opening (prefix pp_), drawn in the module's matte language and lit from the right like its rooms,
   from what is known of the ships and ports of the 1950s, never a likeness of a photograph: a quay seen side on, cut open like the
   module's section of the teaching building, the water on the left, a ship lying along the quay.
     ppNewark      Port Newark, April 1956: the quay, a shed, a shore crane that can lift a box
     ppNoCrane     a port with no crane for boxes: the quay, its sheds, men's cargo nets on the quay
     ppLater       the same quay years later, with a crane of its own
     pp_ship(ctx, x, o)            a ship lying along the quay, its bow to the left: o.kind "tanker" (the Ideal X: a low hull, its
                                   bridge aft, boxes on a deck built over its tanks) or "cellular" (the Gateway City: a rebuilt cargo
                                   ship, its boxes in its holds, two cranes of its own on rails along its deck); o.boxes (how many
                                   boxes show on deck), o.cranes ([{x, reach (0 to 1), fold (0 to 1)}], each crane's place along the
                                   deck, how far its boom reaches out over the quay, and folded down for sea), o.a
     pp_box(ctx, x, y, w, o)       one box, side on: aluminium grey, ribbed, its doors at one end
     pp_shoreCrane(ctx, o)         the shore crane at Newark, its boom over the ship; o.hook (the hook's point)
     pp_gantry(ctx, o)             the port's own crane, years later, on the quay
     pp_net(ctx, x, y, u, o)       a cargo net of sacks and crates swung up from a hold by hand: loose cargo, the old way
   Colour keeps the module's meanings: none of the five here but on the cards (amber the cost, green the savings); the boxes are a
   plain aluminium grey, not the orange of data. Nothing in the port's picture is a brand. */

const PP_K={sky0:[206,214,220],sky1:[244,234,214],sea0:[120,140,150],sea1:[78,98,112],quay:[176,168,156],quayDk:[128,120,112],shed:[188,170,150],
  shedRoof:[118,108,104],hull:[64,66,72],hullHi:[104,106,112],red:[132,72,62],deck:[150,140,128],house:[226,220,208],steel:[96,98,104],steelHi:[150,152,158],
  box:[176,180,184],boxDk:[124,128,134],boxHi:[214,216,218]};
const PP_Q={water:720,quayTop:700,quayX:1420,deck:612};

/* ---------------------------------------------------------------- the port's picture */
function pp_paintPort(c,o){o=o||{};const R=ag_rnd(o.seed||1956),Q=PP_Q;
  // the sky, warm low down; a few soft clouds; the far shore
  let g=c.createLinearGradient(0,0,0,Q.water);g.addColorStop(0,rgba(o.sky0||PP_K.sky0,1));g.addColorStop(1,rgba(o.sky1||PP_K.sky1,1));c.fillStyle=g;c.fillRect(0,0,W,Q.water);
  for(let i=0;i<5;i++){const cx=120+R()*1700,cy=90+R()*200,rw=160+R()*220;g=c.createRadialGradient(cx,cy,0,cx,cy,rw);g.addColorStop(0,"rgba(255,252,246,0.55)");g.addColorStop(1,"rgba(255,252,246,0)");
    c.fillStyle=g;c.beginPath();c.ellipse(cx,cy,rw,rw*0.32,0,0,TAU);c.fill();}
  c.fillStyle=rgba(mix(PP_K.sky1,[120,128,140],0.45),1);c.beginPath();c.moveTo(0,Q.water-46);
  for(let x=0;x<=W;x+=60)c.lineTo(x,Q.water-46-Math.sin(x*0.004+1)*10-R()*8);c.lineTo(W,Q.water);c.lineTo(0,Q.water);c.closePath();c.fill();
  // far-off sheds on the far shore
  c.fillStyle=rgba(mix(PP_K.sky1,[110,112,124],0.6),1);for(let x=40;x<W;x+=140+R()*120){const w=60+R()*90,h=18+R()*26;c.fillRect(x,Q.water-46-h,w,h+10);}
  // the water, down to the frame's foot, a band of light on it
  g=c.createLinearGradient(0,Q.water,0,H);g.addColorStop(0,rgba(PP_K.sea0,1));g.addColorStop(1,rgba(PP_K.sea1,1));c.fillStyle=g;c.fillRect(0,Q.water,W,H-Q.water);
  c.strokeStyle="rgba(240,236,226,0.22)";c.lineWidth=2;for(let i=0;i<40;i++){const x=R()*W,y=Q.water+10+R()*(H-Q.water-20),l=30+R()*90;c.beginPath();c.moveTo(x,y);c.lineTo(x+l,y);c.stroke();}
  // the quay, cut open: its top at quayTop, its stone face going down into the water
  const qx=Q.quayX;g=c.createLinearGradient(0,Q.quayTop,0,H);g.addColorStop(0,rgba(PP_K.quay,1));g.addColorStop(0.08,rgba(mix(PP_K.quay,PP_K.quayDk,0.5),1));g.addColorStop(1,rgba(PP_K.quayDk,1));
  c.fillStyle=g;c.fillRect(qx,Q.quayTop,W-qx,H-Q.quayTop);c.fillStyle="rgba(255,250,240,0.4)";c.fillRect(qx,Q.quayTop,W-qx,3);
  c.strokeStyle="rgba(60,54,50,0.25)";c.lineWidth=2;for(let y=Q.quayTop+40;y<H;y+=46){c.beginPath();c.moveTo(qx,y);c.lineTo(W,y);c.stroke();}
  for(let y=Q.quayTop+40,k=0;y<H;y+=46,k++)for(let x=qx+(k%2?60:0);x<W;x+=120){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+46);c.stroke();}
  c.fillStyle="rgba(40,34,30,0.28)";c.fillRect(qx,Q.water,8,H-Q.water);
  // a shed on the quay, behind where things stand
  const sx=qx+150;c.fillStyle=rgba(PP_K.shed,1);c.fillRect(sx,Q.quayTop-250,360,250);c.fillStyle=rgba(PP_K.shedRoof,1);
  c.beginPath();c.moveTo(sx-16,Q.quayTop-250);c.lineTo(sx+180,Q.quayTop-310);c.lineTo(sx+376,Q.quayTop-250);c.closePath();c.fill();
  c.fillStyle=rgba(mix(PP_K.shed,[60,50,46],0.5),1);c.fillRect(sx+130,Q.quayTop-150,100,150);
  g=c.createLinearGradient(sx,0,sx+360,0);g.addColorStop(0,rgba(LP.shade,0.22));g.addColorStop(1,rgba(LP.sun,0.12));c.fillStyle=g;c.fillRect(sx,Q.quayTop-250,360,250);
  // bollards along the quay's edge
  for(const bx of [qx+40,qx+460]){c.fillStyle=rgba(PP_K.steel,1);rr(c,bx-12,Q.quayTop-24,24,26,6);c.fill();}
  if(o.nets){// cargo stacked on the quay, waiting to be carried: sacks and crates
    for(const [x,n] of [[qx+60,5],[qx+560,4]])for(let i=0;i<n;i++){const cx=x+i*30,cy=Q.quayTop-18-(i%2)*16;c.fillStyle=rgba(i%2?[170,146,112]:[150,128,98],1);rr(c,cx,cy,34,22,8);c.fill();}}
  // the room's light, as in the module's rooms: the shade on the left, the sun's warmth on the right
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.16));g.addColorStop(0.5,rgba(LP.shade,0));g.addColorStop(1,rgba(LP.sun,0.07));c.fillStyle=g;c.fillRect(0,0,W,H);
  g=c.createRadialGradient(W*0.55,H*0.42,H*0.38,W*0.55,H*0.42,W*0.78);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,rgba(LP.shade,0.2));c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.ppNewark=c=>pp_paintPort(c,{seed:1956});
AG_PLACES.ppNoCrane=c=>pp_paintPort(c,{seed:57,nets:true,sky0:[214,214,214],sky1:[238,230,216]});
AG_PLACES.ppLater=c=>pp_paintPort(c,{seed:1968,sky0:[200,212,222],sky1:[246,236,216]});

/* ---------------------------------------------------------------- one box, side on: x, y its top left, w its length */
function pp_box(c,x,y,w,o){o=o||{};const h=o.h||w*0.36,a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;
  c.save();c.shadowColor="rgba(30,26,24,0.3)";c.shadowBlur=8;c.shadowOffsetX=-4;c.shadowOffsetY=4;c.fillStyle=rgba(PP_K.box,1);c.fillRect(x,y,w,h);c.restore();
  let g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,rgba(PP_K.boxHi,0.6));g.addColorStop(0.5,"rgba(255,255,255,0)");g.addColorStop(1,rgba(PP_K.boxDk,0.5));c.fillStyle=g;c.fillRect(x,y,w,h);
  c.strokeStyle=rgba(PP_K.boxDk,0.55);c.lineWidth=Math.max(1,w*0.012);const n=Math.max(4,Math.round(w/14));
  for(let i=1;i<n;i++){const rx=x+w*i/n;c.beginPath();c.moveTo(rx,y+2);c.lineTo(rx,y+h-2);c.stroke();}
  c.strokeStyle=rgba(mix(PP_K.boxDk,[40,40,44],0.4),0.7);c.lineWidth=Math.max(1.5,w*0.018);c.strokeRect(x+1,y+1,w-2,h-2);
  c.fillStyle=rgba(PP_K.boxDk,0.7);c.fillRect(x+w-Math.max(3,w*0.05),y,Math.max(3,w*0.05),h);c.restore();}

/* ---------------------------------------------------------------- a ship along the quay, its bow to the left; x is its stern */
const PP_SHIP={len:1180,deck:PP_Q.deck,water:PP_Q.water};
function pp_ship(c,x,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const L=o.len||PP_SHIP.len,dk=PP_SHIP.deck,wl=PP_SHIP.water,x0=x-L,kind=o.kind||"tanker";
  c.save();c.globalAlpha*=a;
  // the hull: a long low shape, its bow raked forward, its stern rounded; the waterline's red below
  const hull=cc=>{cc.beginPath();cc.moveTo(x0-40,dk-26);cc.lineTo(x-20,dk-10);cc.quadraticCurveTo(x+14,dk,x+6,dk+40);cc.lineTo(x-10,wl+40);cc.lineTo(x0+60,wl+40);cc.quadraticCurveTo(x0+10,wl+30,x0-40,dk-26);cc.closePath();};
  c.save();hull(c);c.clip();let g=c.createLinearGradient(0,dk-30,0,wl+40);g.addColorStop(0,rgba(PP_K.hullHi,1));g.addColorStop(0.35,rgba(PP_K.hull,1));g.addColorStop(1,rgba(mix(PP_K.hull,[20,20,24],0.4),1));
  c.fillStyle=g;c.fillRect(x0-60,dk-40,L+120,wl-dk+90);c.fillStyle=rgba(PP_K.red,1);c.fillRect(x0-60,wl-14,L+120,60);
  g=c.createLinearGradient(x0,0,x,0);g.addColorStop(0,rgba(LP.shade,0.25));g.addColorStop(1,rgba(LP.sun,0.1));c.fillStyle=g;c.fillRect(x0-60,dk-40,L+120,wl-dk+90);c.restore();
  // the water over the hull's foot, so it floats
  if(o.place){const pl=ag_place(o.place);c.drawImage(pl,x0-60,wl+3,L+130,44,x0-60,wl+3,L+130,44);}
  c.strokeStyle="rgba(240,236,226,0.35)";c.lineWidth=2;c.beginPath();c.moveTo(x0-30,wl+2);c.lineTo(x+10,wl+2);c.stroke();
  // the house, aft: white, two decks, a funnel; portholes as a row of dots
  const hx=x-230;c.fillStyle=rgba(PP_K.house,1);c.fillRect(hx,dk-150,190,140);c.fillRect(hx+30,dk-210,140,62);
  c.fillStyle=rgba(mix(PP_K.house,[80,80,90],0.55),1);for(let i=0;i<6;i++){c.beginPath();c.arc(hx+24+i*28,dk-104,5,0,TAU);c.fill();}c.fillRect(hx+42,dk-196,116,14);
  c.fillStyle=rgba(PP_K.steel,1);c.fillRect(hx+80,dk-290,46,82);c.fillStyle=rgba(mix(PP_K.steel,[20,20,24],0.4),1);c.fillRect(hx+80,dk-290,46,12);
  g=c.createLinearGradient(hx,0,hx+190,0);g.addColorStop(0,rgba(LP.shade,0.2));g.addColorStop(1,rgba(LP.sun,0.1));c.fillStyle=g;c.fillRect(hx,dk-210,190,200);
  if(kind==="tanker"){// a deck built over the tanks, its posts, and the boxes on it in a row, one tier
    const d0=x0+40,d1=hx-30,top=dk-46;c.fillStyle=rgba(PP_K.deck,1);c.fillRect(d0,top,d1-d0,10);c.fillStyle=rgba(mix(PP_K.deck,[40,36,34],0.4),1);
    for(let px=d0+20;px<d1;px+=70)c.fillRect(px,top+10,8,36);
    const n=o.boxes==null?9:o.boxes,bw=(d1-d0-20)/9;for(let i=0;i<Math.min(n,9);i++)pp_box(c,d0+10+i*bw,top-bw*0.36,bw-6);}
  else{// the cellular ship: a hold under the deck, boxes stacked two high above it; rails along the deck; its two cranes
    const d0=x0+30,d1=hx-20;c.fillStyle=rgba(PP_K.deck,1);c.fillRect(d0,dk-14,d1-d0,8);
    const bw=(d1-d0-30)/8,n=o.boxes==null?16:o.boxes;for(let i=0;i<Math.min(n,16);i++){const col=i%8,tier=(i/8)|0;pp_box(c,d0+15+col*bw,dk-14-(tier+1)*bw*0.36,bw-6);}
    c.strokeStyle=rgba(PP_K.steelHi,1);c.lineWidth=4;c.beginPath();c.moveTo(d0,dk-12);c.lineTo(d1,dk-12);c.stroke();
    (o.cranes||[]).forEach(k=>pp_deckCrane(c,k.x,dk-12,k,o.t||0));}
  c.restore();}

/* a ship's own crane: a gantry standing over the boxes on rails along the deck (at railY), its boom reaching out to the right, over the
   quay, as far as k.reach says; k.fold folds it down along the deck, for sea; k.hook (0 to 1) lowers the hook, k.load a box on it */
function pp_deckCrane(c,x,railY,k,t){const reach=ag_sine(k.reach||0),fold=ag_sine(k.fold||0),top=railY-250,steel=PP_K.steel;
  c.save();c.fillStyle=rgba(steel,1);
  // its legs, astride the boxes, its wheels on the rail
  for(const lx of [x-70,x+70]){c.fillRect(lx-7,top,14,250);c.beginPath();c.arc(lx,railY+2,9,0,TAU);c.fill();}
  c.fillRect(x-84,top-18,168,22);c.fillStyle=rgba(PP_K.steelHi,1);c.fillRect(x-84,top-18,168,5);
  // the cab
  c.fillStyle=rgba(mix(steel,[20,20,24],0.2),1);c.fillRect(x+30,top+6,40,38);c.fillStyle="rgba(230,236,240,0.7)";c.fillRect(x+36,top+12,28,16);
  // the boom: from the gantry's top, out to the right; folded, it lies along the top
  const bx0=x+84,len=lerp(60,520,reach)*(1-fold*0.7),by=top-8;c.fillStyle=rgba(steel,1);c.fillRect(bx0-10,by-6,len+10,14);
  c.strokeStyle=rgba(steel,1);c.lineWidth=4;c.beginPath();c.moveTo(x,top-18);c.lineTo(x,top-70);c.lineTo(bx0+len,by);c.stroke();
  // the trolley and its hook, out along the boom
  if(len>80){const hx=bx0+len-40,hd=lerp(20,k.drop||300,ag_sine(k.hook||0));c.strokeStyle="rgba(40,40,44,0.9)";c.lineWidth=2.5;c.beginPath();c.moveTo(hx-14,by+8);c.lineTo(hx-14,by+8+hd);c.moveTo(hx+14,by+8);c.lineTo(hx+14,by+8+hd);c.stroke();
    c.fillStyle=rgba(steel,1);c.fillRect(hx-30,by+4+hd,60,8);if(k.load)pp_box(c,hx-62,by+12+hd,124);}
  c.restore();}

/* ---------------------------------------------------------------- the shore crane at Newark, on the quay: its boom over the ship */
function pp_shoreCrane(c,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const bx=PP_Q.quayX+300,base=PP_Q.quayTop,steel=[84,86,92];c.save();c.globalAlpha*=a;
  c.fillStyle=rgba(steel,1);// a tower on four legs
  c.beginPath();c.moveTo(bx-80,base);c.lineTo(bx-26,base-360);c.lineTo(bx+26,base-360);c.lineTo(bx+80,base);c.lineTo(bx+56,base);c.lineTo(bx+12,base-330);c.lineTo(bx-12,base-330);c.lineTo(bx-56,base);c.closePath();c.fill();
  c.strokeStyle=rgba(steel,1);c.lineWidth=3;for(let y=base-40;y>base-340;y-=56){const w0=lerp(68,22,(base-y)/360);c.beginPath();c.moveTo(bx-w0,y);c.lineTo(bx+w0,y-56);c.moveTo(bx+w0,y);c.lineTo(bx-w0,y-56);c.stroke();}
  c.fillStyle=rgba(mix(steel,[20,20,24],0.2),1);c.fillRect(bx-44,base-410,88,56);c.fillStyle="rgba(230,236,240,0.65)";c.fillRect(bx-34,base-400,30,22);
  // the boom, out over the water and the ship's deck, to the left
  const tip=o.tip||[PP_Q.quayX-420,base-470];c.strokeStyle=rgba(steel,1);c.lineWidth=12;c.lineCap="round";c.beginPath();c.moveTo(bx-30,base-380);c.lineTo(tip[0],tip[1]);c.stroke();
  c.lineWidth=3;c.beginPath();c.moveTo(bx,base-410);c.lineTo(bx,base-470);c.lineTo(tip[0],tip[1]);c.stroke();
  if(o.hook){const [hx,hy]=o.hook;c.strokeStyle="rgba(40,40,44,0.9)";c.lineWidth=2.5;c.beginPath();c.moveTo(tip[0],tip[1]);c.lineTo(hx,hy);c.stroke();
    if(o.load){c.beginPath();c.moveTo(hx,hy);c.lineTo(hx-50,hy+22);c.moveTo(hx,hy);c.lineTo(hx+50,hy+22);c.stroke();pp_box(c,hx-62,hy+22,124);}}
  c.restore();}

/* ---------------------------------------------------------------- the port's own crane, years later: a gantry on the quay, its boom out over the water */
function pp_gantry(c,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const gx=PP_Q.quayX+220,base=PP_Q.quayTop,steel=[96,104,112],u=ag_sine(o.u==null?1:o.u);c.save();c.globalAlpha*=a;
  c.fillStyle=rgba(steel,1);for(const lx of [gx-110,gx+150]){c.fillRect(lx-10,base-420,20,420);}c.fillRect(gx-130,base-440,300,30);
  c.strokeStyle=rgba(steel,1);c.lineWidth=4;c.beginPath();c.moveTo(gx-110,base-200);c.lineTo(gx+150,base-400);c.moveTo(gx+150,base-200);c.lineTo(gx-110,base-400);c.stroke();
  const len=lerp(80,640,u);c.fillRect(gx+170-len-300,base-470,len+300,22);c.lineWidth=3;c.beginPath();c.moveTo(gx+20,base-560);c.lineTo(gx+170-len-300,base-470);c.moveTo(gx+20,base-560);c.lineTo(gx+170,base-450);c.stroke();
  c.fillRect(gx+6,base-570,28,130);c.restore();}

/* ---------------------------------------------------------------- a cargo net of sacks and crates, swung up by hand from the hold: u its height (0 in the hold, 1 at the quay) */
function pp_net(c,x,y,u,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;c.save();c.globalAlpha*=a;const yy=lerp(y,y-140,ag_sine(u));
  c.strokeStyle="rgba(60,52,44,0.8)";c.lineWidth=2;c.beginPath();c.moveTo(x,yy-200);c.lineTo(x,yy-40);c.stroke();
  const items=[[-40,-10,40,26,[160,136,104]],[0,-14,44,30,[146,124,96]],[-20,-38,40,26,[172,150,118]],[22,-40,32,26,[150,120,90]]];
  for(const [dx,dy,w,h,col] of items){c.fillStyle=rgba(col,1);rr(c,x+dx-w/2,yy+dy,w,h,6);c.fill();}
  c.strokeStyle="rgba(80,70,56,0.7)";c.lineWidth=2;c.beginPath();c.moveTo(x,yy-40);c.lineTo(x-64,yy+18);c.moveTo(x,yy-40);c.lineTo(x+56,yy+18);c.moveTo(x-64,yy+18);c.quadraticCurveTo(x,yy+40,x+56,yy+18);c.stroke();
  c.restore();}

/* ---------------------------------------------------------------- Malcom McLean, for lp_person
   A man of the 1950s in a dark grey suit, a white shirt and a plain tie, his hair short and parted; bare-headed, so no hat to keep
   inside the head's picture. Drawn from no photograph. */
const PP_PEOPLE={
  mclean:{name:"Malcom McLean",key:"pp-mclean",skin:[230,190,160],hair:{style:"side",c:[70,56,48]},top:{kind:"suit",c:[78,78,82],inner:[236,236,232],tie:[92,74,64]},breath:0.25}
};
