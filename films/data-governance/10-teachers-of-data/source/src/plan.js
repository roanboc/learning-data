/* ===== Teachers of data: the places and the pictures =====
   The film's one place of its own is a crossing in the centre of Bogotá, in 1995 and again in 2012, painted the way the series paints
   the university and seen through two cameras: wide, from a first-floor window across the avenue, and closer, from the pavement. The
   street is laid out in metres, so a cut from one camera to the other keeps every car and every person where they were. Then the
   university's own pictures, in the series' shared places (rooms.js): the three panels of the crossing that end up on Yusuf's board,
   Mei's submission, Anil's check and its page, the stewards' board and calendar, binder 29, the measures, the wheel and the path for
   new analysts, the binder's last count and the five cards. Every name starts with tt_ or TT_, because every file of the film shares
   one script. */

/* ---------- Bogotá: the street, in metres ---------- */
// X runs along the avenue, to the right; d runs across it, away from us (0 is the near kerb); Y is up. The avenue has four lanes, one
// way, left to right; the cars stop at a line just before the zebra crossing; beyond the far pavement, a side street climbs towards the
// eastern hills, its left pavement in line with the crossing.
const TT_ST={lane:3.5,far:14,back:18,zebra:[-0.5,2.7],stop:[-2,-1.7],left:0.2,right:14.2,road:[2.7,11.7]};
// the two cameras: where each stands (X; its height hc; d0, how far in front of the near kerb), its lens (f) and its horizon (yh)
const TT_CAM={wide:{X:3,hc:5,d0:13.2,f:1530,yh:420},mid:{X:2,hc:2.3,d0:6,f:1800,yh:360}};
// a point of the street on screen, and how many pixels a metre is there
function tt_pr(c,X,d,Y){const k=c.f/(c.d0+d);return[960+(X-c.X)*k,c.yh+(c.hc-(Y||0))*k,k];}
const tt_poly=(c,P)=>P.map(p=>{const q=tt_pr(c,p[0],p[1],p[2]);return[q[0],q[1]];});
// the nearest the ground shows: the depth where it passes 120 px below the frame (anything nearer would land behind the camera)
const tt_dnear=c=>c.f*c.hc/(H+120-c.yh)-c.d0;
// a level piece of the street, X0..X1 by d0..d1 at height Y, cut to what the camera sees; null if it sees none of it
function tt_gq(c,X0,X1,d0,d1,Y){d0=Math.max(d0,tt_dnear(c));if(d1<=d0)return null;const m=1200*(c.d0+d1)/c.f;X0=Math.max(X0,c.X-m);X1=Math.min(X1,c.X+m);
  return X1>X0?tt_poly(c,[[X0,d0,Y||0],[X1,d0,Y||0],[X1,d1,Y||0],[X0,d1,Y||0]]):null;}
// whether a shape on screen reaches into the frame
const tt_seen=P=>P.some(p=>p[0]>-60&&p[0]<W+60&&p[1]>-60&&p[1]<H+60);
// the watercolour's haze of distance: 1 near, paler the further off
const tt_haze=(c,d)=>clamp(1.08-(c.d0+d)/220,0.4,1);
// the side street climbs once it's past the corner buildings
const tt_gy=d=>d>32?(d-32)*0.07:0;
// Bogotá's colours: a high grey sky, the green hills, red brick, plaster in cream and ochre, concrete, dark glass, wet asphalt
const TT={sky:[146,154,170],hill:[62,102,80],hill2:[92,128,94],hillFar:[118,142,130],brick:[176,92,64],brick2:[156,82,62],plaster:[236,220,186],
  ochre:[214,172,108],blueGrey:[176,188,198],cream:[240,232,214],concrete:[194,192,186],glass:[92,106,126],trim:[240,236,226],asphalt:[120,120,128],
  line:[244,242,236],pave:[206,200,188],kerb:[164,162,158],iron:[66,68,78],awning:[[64,110,86],[150,70,54],[58,82,128],[176,140,62]]};

/* the sky: a grey wash, drying unevenly, lifted lighter in soft bands where the cloud thins */
function tt_sky(ctx,c,seed){ctx.fillStyle=rgba(WC_PAPER,1);ctx.fillRect(0,0,W,H);const [t,tx]=wc_buf("ttSky",W,H),hz=c.yh;
  const g=tx.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(TT.sky,0.72));g.addColorStop(0.7,rgba(TT.sky,0.36));g.addColorStop(1,rgba(TT.sky,0.2));
  tx.fillStyle=g;tx.fillRect(0,0,W,hz+60);tx.globalCompositeOperation="destination-in";tx.drawImage(WC.blotch,0,0,W,H);tx.globalCompositeOperation="destination-out";
  const R=wc_rng(seed);for(let i=0;i<8;i++){const x=R()*W,y=30+R()*hz*0.62,s=0.8+R()*1.3;
    for(const [dx,dy,r] of [[-130,6,70],[-40,-8,96],[60,4,84],[150,10,62]]){const cx=x+dx*s,cy=y+dy*s*0.4,rr_=r*s,q=tx.createRadialGradient(cx,cy,rr_*0.2,cx,cy,rr_);
      q.addColorStop(0,"rgba(0,0,0,0.55)");q.addColorStop(1,"rgba(0,0,0,0)");tx.fillStyle=q;tx.fillRect(cx-rr_,cy-rr_*0.5,rr_*2,rr_);}}
  ctx.save();ctx.globalCompositeOperation="multiply";ctx.drawImage(t,0,0);ctx.restore();}

/* the eastern hills, kilometres off: their crest as degrees above the horizon at each bearing (degrees right of the camera's line).
   Monserrate's summit is the high point a little right of the line, with its white church on it */
const TT_RIDGE=[[-48,6.4],[-36,7.2],[-26,8],[-17,8.6],[-9,9.4],[-3,10.2],[1.6,11.2],[3.4,12],[4.4,12.2],[5.6,11.7],[7.6,10.4],[10.4,9.9],[14,10.8],[17.4,11.6],
  [21,10.9],[27,9.4],[35,8.4],[48,7.6]],TT_MONS=4.4;
function tt_ridgeDeg(az,R){R=R||TT_RIDGE;if(az<=R[0][0])return R[0][1];for(let i=1;i<R.length;i++)if(az<=R[i][0]){const u=(az-R[i-1][0])/(R[i][0]-R[i-1][0]);
  // a cosine between the points, then the two neighbours' slopes blended in, so the crest has no corners
  const a=R[Math.max(0,i-2)],b=R[i-1],cc=R[i],d=R[Math.min(R.length-1,i+1)],m0=(cc[1]-a[1])/Math.max(1e-6,cc[0]-a[0]),m1=(d[1]-b[1])/Math.max(1e-6,d[0]-b[0]),h=cc[0]-b[0],u2=u*u,u3=u2*u;
  return(2*u3-3*u2+1)*b[1]+(u3-2*u2+u)*h*m0+(-2*u3+3*u2)*cc[1]+(u3-u2)*h*m1;}return R[R.length-1][1];}
// a crest on screen, from the left edge to the right: deg(az) gives its height; bumps adds the forest's small irregularities
function tt_crest(c,deg,bumps,seed){const n=wc_noise(seed||5),o=[];for(let x=-60;x<=W+60;x+=6){const az=Math.atan((x-960)/c.f)*180/Math.PI,e=deg(az)+(bumps||0)*(n(x/22,seed||5)-0.5+0.5*(n(x/7,9)-0.5));
  o.push([x,c.yh-c.f*Math.tan(e*Math.PI/180)]);}return o;}
const tt_deg=(c,az,e)=>[960+c.f*Math.tan(az*Math.PI/180),c.yh-c.f*Math.tan(e*Math.PI/180)];
function tt_hills(ctx,c){const band=(top,col,depth,seed,o)=>{const pts=top.concat([[W+60,c.yh+30],[-60,c.yh+30]]);wc_wash(ctx,pts,col,Object.assign({depth,kind:"land",line:false,seed},o||{}));return top;};
  // the far crest, the ridge's shoulders, then the nearer slopes, darker with forest
  band(tt_crest(c,az=>tt_ridgeDeg(az),0.16,3),TT.hillFar,0.46,11);
  const ppd=c.f*Math.PI/180;
  band(tt_crest(c,az=>tt_ridgeDeg(az)-1.3-0.9*Math.sin(az/5.5+1)-0.5*Math.sin(az/2.3),0.22,4),TT.hill2,0.52,13);
  const near=tt_crest(c,az=>4.2+1.4*Math.sin(az/6+2)+0.8*Math.sin(az/2.6),0.3,6);band(near,TT.hill,0.58,17);
  // trees on the slopes: small dark crowns, thicker lower down, and pale scars of the paths that cross them
  const R=wc_rng(21);ctx.save();ctx.globalCompositeOperation="multiply";for(let i=0;i<520;i++){const x=R()*W,az=Math.atan((x-960)/c.f)*180/Math.PI,top=tt_ridgeDeg(az)-0.4,e=0.8+R()*(top-0.8),[px,py]=tt_deg(c,az,e),r=(1.2+R()*2.2)*ppd/26;
    ctx.fillStyle=rgba(wc_haze(e<5?TT.hill:TT.hill2,0.5),0.28+R()*0.18);ctx.beginPath();ctx.ellipse(px,py,r*1.2,r,0,0,TAU);ctx.fill();}ctx.restore();
  // the church on Monserrate: a white nave with a dark roof, its tower, and the low white buildings beside it, on the summit
  const [mx,my]=tt_deg(c,TT_MONS,tt_ridgeDeg(TT_MONS)),u=ppd/26.7;
  wc_flat(ctx,wc_rect(mx-16*u,my-7*u,32*u,9*u),wc_lit(TT.hill2,0.3),0.6,"clearing");
  wc_wash(ctx,wc_rect(mx-26*u,my-9*u,12*u,6*u),[246,244,238],{kind:"build",depth:0.62,lw:0.8,seed:3});wc_wash(ctx,wc_rect(mx+13*u,my-8*u,10*u,5*u),[246,244,238],{kind:"build",depth:0.62,lw:0.8,seed:4});
  wc_wash(ctx,wc_rect(mx-10*u,my-14*u,22*u,10*u),[250,248,242],{kind:"build",depth:0.62,lw:0.9,seed:5});
  wc_flat(ctx,[[mx-11*u,my-14*u],[mx+13*u,my-14*u],[mx+9*u,my-18*u],[mx-7*u,my-18*u]],[110,96,96],0.62,"roof");
  wc_wash(ctx,wc_rect(mx-3*u,my-26*u,7*u,13*u),[250,248,242],{kind:"build",depth:0.62,lw:0.9,seed:6});wc_flat(ctx,[[mx-4*u,my-26*u],[mx+5*u,my-26*u],[mx+0.5*u,my-31*u]],[110,96,96],0.62,"cap");
  return near;}

/* the city at the hills' foot, far off: rooftops and a few towers, pale with distance */
function tt_city(ctx,c){const ppd=c.f*Math.PI/180,R=wc_rng(37),row=(base,hmin,hmax,col,depth,seed,towers)=>{const pts=[[-60,c.yh+30]];let x=-60;
    while(x<W+60){const w=(0.5+R()*1.1)*ppd,h=(hmin+R()*(hmax-hmin))*ppd;pts.push([x,base-h],[x+w,base-h]);x+=w;if(towers&&R()<towers){const tw_=(0.4+R()*0.4)*ppd,th=(2+R()*1.8)*ppd;pts.push([x,base-th],[x+tw_,base-th]);x+=tw_;}}
    pts.push([W+60,c.yh+30]);wc_wash(ctx,pts,col,{depth,kind:"skyline",line:false,seed});};
  row(c.yh-0.9*ppd,0.2,0.9,[206,196,180],0.44,41,0.05);row(c.yh-0.2*ppd,0.2,0.7,[196,170,146],0.5,43,0.02);}

/* buildings: a wall in perspective, its windows, its bricks */
// a wall standing on the street from (X0,d0) to (X1,d1), its base at height b0..b1 and its top at height t: a point on it at u metres along and v up
function tt_wall(c,X0,d0,X1,d1,b0,b1){const L=Math.hypot(X1-X0,d1-d0);return(u,v,flat)=>{const k=u/L,X=lerp(X0,X1,k),d=lerp(d0,d1,k),q=tt_pr(c,X,d,(flat?0:lerp(b0||0,b1||0,k))+v);return[q[0],q[1]];};}
const tt_quad=(P,u0,v0,u1,v1)=>[P(u0,v0),P(u1,v0),P(u1,v1),P(u0,v1)];
// a window: dark glass in a pale frame, a sill under it, a lighter pane where the sky reflects; small ones are just the glass
function tt_window(ctx,P,u,v,w,h,depth,o){o=o||{};const g=tt_quad(P,u,v,u+w,v+h),bw=Math.abs(g[1][0]-g[0][0]),bh=Math.abs(g[3][1]-g[0][1]);if(bw<2||bh<2)return;
  if(bw>9){wc_flat(ctx,tt_quad(P,u-0.12,v-0.12,u+w+0.12,v+h+0.1),o.frame||TT.trim,depth,"frame");}
  wc_flat(ctx,g,o.glass||TT.glass,depth,"glass");
  if(bw>14){wc_flat(ctx,tt_quad(P,u+w*0.08,v+h*0.55,u+w*0.46,v+h*0.92),wc_lit(o.glass||TT.glass,0.38),depth,"sky");
    ctx.save();ctx.strokeStyle=rgba(wc_haze(o.frame||TT.trim,depth),0.9);ctx.lineWidth=Math.max(1,bw*0.05);ctx.beginPath();const a=P(u+w/2,v),b=P(u+w/2,v+h);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.restore();
    wc_flat(ctx,tt_quad(P,u-0.2,v-0.22,u+w+0.2,v-0.08),wc_dim(o.frame||TT.trim,0.06),depth,"sill");}}
// courses of brick: pale mortar lines across the wall, and a few darker bricks, clipped to it
function tt_bricks(ctx,P,L,H_,depth,seed){const a=P(0,0),b=P(L,0),c=P(L,H_),d=P(0,H_);const px=Math.hypot(b[0]-a[0],b[1]-a[1])/L;if(px<14)return;
  ctx.save();wc_tr(ctx,[a,b,c,d]);ctx.clip();ctx.lineWidth=Math.max(0.8,px*0.025);ctx.strokeStyle=rgba([238,214,190],0.32*depth);const step=px>40?0.3:0.6;
  for(let v=step;v<H_;v+=step){const p=P(0,v),q=P(L,v);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();}
  const R=wc_rng(seed);ctx.globalCompositeOperation="multiply";for(let i=0;i<L*H_*0.6;i++){const u=R()*L,v=Math.floor(R()*H_/step)*step,p=P(u,v),q=P(u+0.5,v+step*0.8);
    ctx.fillStyle=rgba(TT.brick2,0.12+R()*0.14);ctx.fillRect(Math.min(p[0],q[0]),Math.min(p[1],q[1]),Math.abs(q[0]-p[0]),Math.abs(q[1]-p[1]));}ctx.restore();}
// an awning over a shop: sloping out from the wall over the pavement (out, metres towards us), in one colour with a scalloped edge
function tt_awning(ctx,c,X0,X1,d,y0,y1,out,col,depth){const P=[[X0,d,y0],[X1,d,y0],[X1,d-out,y1],[X0,d-out,y1]];wc_part(ctx,tt_poly(c,P),col,depth,{lw:1.2});
  const n=Math.max(2,Math.round((X1-X0)/0.5)),fr=[];for(let i=0;i<=n;i++){const X=lerp(X0,X1,i/n);fr.push([X,d-out,y1]);fr.push([X+(X1-X0)/n/2,d-out,y1-(i<n?0.22:0)]);}
  const top=tt_poly(c,fr.slice(0,-1)),bot=[tt_pr(c,X1,d-out,y1),tt_pr(c,X0,d-out,y1)].map(q=>[q[0],q[1]]);
  wc_wash(ctx,top.concat([[top[top.length-1][0],bot[0][1]-1]]),wc_dim(col,0.12),{depth,kind:"build",lw:1,seed:Math.round(X0*7)});}
// what shops have on their shelves, in muted colours; a bakery's bread, a shoe shop's shoes, a chemist's white boxes, a café's cups
const TT_GOODS={any:[[214,170,90],[176,90,70],[120,150,110],[226,214,190],[96,122,160],[200,140,120],[150,110,150]],bread:[[214,164,96],[196,134,72],[228,190,124],[176,116,66]],
  shoes:[[92,62,50],[60,58,64],[150,98,64],[176,150,120],[120,40,40]],chemist:[[240,240,236],[226,236,230],[120,170,140],[230,224,210],[180,200,220]],cafe:[[246,244,238],[214,196,170],[150,104,72]]};
// a shop's front, open to the street as the small shops in the centre are: a pale frame, the dim inside, and when it's near enough to see,
// shelves with goods in rows and a counter at the front; o.goods is what it sells, o.shutter half closes it, o.sign hangs a board over it
function tt_shop(ctx,P,u,w,h,depth,seed,o){o=o||{};const R=wc_rng(seed),q=(a,b,c_,d)=>tt_quad(P,a,b,c_,d),a0=P(u,0),a1=P(u+w,0),px=Math.hypot(a1[0]-a0[0],a1[1]-a0[1])/w,G=TT_GOODS[o.goods||"any"];
  wc_flat(ctx,q(u-0.15,0,u+w+0.15,h+0.25),TT.trim,depth,"frame");wc_flat(ctx,q(u,0,u+w,h),[104,92,88],depth,"shop");
  if(px>24){wc_flat(ctx,q(u+0.12,h*0.36,u+w-0.12,h-0.12),[134,118,106],depth,"back");
    for(const v of [h*0.46,h*0.72]){let a=u+0.2;while(a<u+w-0.34){const ww=0.1+R()*0.2,hh=0.1+R()*0.16;wc_flat(ctx,q(a,v,a+ww,v+hh),G[(R()*G.length)|0],depth,"goods");a+=ww+0.03+R()*0.07;}
      wc_flat(ctx,q(u+0.12,v-0.06,u+w-0.12,v),[178,152,122],depth,"shelf");}
    wc_flat(ctx,q(u+0.1,0,u+w*0.64,h*0.32),[136,100,76],depth,"counter");wc_flat(ctx,q(u+0.06,h*0.32,u+w*0.66,h*0.37),[200,174,136],depth,"top");}
  else if(px>6)for(const v of [h*0.48,h*0.74])wc_flat(ctx,q(u+0.15,v,u+w-0.15,v+0.22),G[(R()*G.length)|0],depth,"goods");
  if(o.shutter){wc_flat(ctx,q(u,h*(1-o.shutter),u+w,h),[176,178,182],depth,"shutter");const k=Math.max(3,Math.round(h*o.shutter/0.12));
    ctx.save();ctx.strokeStyle=rgba(wc_haze([120,122,128],depth),0.5);ctx.lineWidth=1;for(let i=1;i<k;i++){const v=h-i*h*o.shutter/k,a=P(u,v),b=P(u+w,v);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}ctx.restore();}
  if(o.sign)tt_sign(ctx,P,u+w/2,h+0.32,Math.min(w*0.78,2.3),0.5,o.sign,depth);}
// a sign board over a shop, centred at u with its foot at v: a board in one colour, and on it a picture of what the shop sells (no words)
function tt_sign(ctx,P,u,v,w,h,sg,depth){const [kind,fg,bg]=sg;wc_wash(ctx,tt_quad(P,u-w/2,v,u+w/2,v+h),bg,{kind:"trim",lw:1,depth,seed:Math.round(u*5)});
  const a=P(u-w/2,v),b=P(u+w/2,v+h),s=Math.min(Math.abs(b[0]-a[0])*0.3,Math.abs(b[1]-a[1])*0.78);if(s<5)return;
  ctx.save();ctx.translate((a[0]+b[0])/2,(a[1]+b[1])/2);ctx.scale(s,s);ctx.fillStyle=ctx.strokeStyle=rgba(wc_haze(fg,depth),0.92);ctx.lineCap=ctx.lineJoin="round";
  TT_ICON[kind](ctx,()=>{ctx.strokeStyle=rgba(wc_haze(bg,depth),1);});ctx.restore();}
// the pictures, in a box 2 wide and 1 tall round the middle of the board; cut() switches the pen to the board's colour, for the details
const TT_ICON={
  loaf:(x,cut)=>{x.beginPath();x.moveTo(-0.95,0.34);x.bezierCurveTo(-1,-0.2,-0.55,-0.5,0,-0.5);x.bezierCurveTo(0.55,-0.5,1,-0.2,0.95,0.34);x.closePath();x.fill();
    cut();x.lineWidth=0.1;for(const k of [-0.45,0,0.45]){x.beginPath();x.moveTo(k-0.12,-0.28);x.lineTo(k+0.1,0.12);x.stroke();}},
  shoe:(x,cut)=>{x.beginPath();x.moveTo(-0.95,0.4);x.lineTo(-0.95,-0.36);x.quadraticCurveTo(-0.6,-0.42,-0.45,-0.1);x.quadraticCurveTo(-0.1,0,0.55,0.02);x.quadraticCurveTo(1,0.08,0.98,0.32);x.lineTo(0.98,0.4);x.closePath();x.fill();
    cut();x.lineWidth=0.07;x.beginPath();x.moveTo(-0.95,0.29);x.lineTo(0.98,0.29);x.stroke();for(const k of [-0.32,-0.14,0.04]){x.beginPath();x.moveTo(k,-0.02);x.lineTo(k+0.1,-0.13);x.stroke();}},
  cross:(x)=>{x.beginPath();x.rect(-0.17,-0.5,0.34,1);x.rect(-0.5,-0.17,1,0.34);x.fill();},
  cup:(x)=>{x.beginPath();x.moveTo(-0.5,-0.14);x.lineTo(0.3,-0.14);x.quadraticCurveTo(0.3,0.34,-0.1,0.37);x.quadraticCurveTo(-0.5,0.34,-0.5,-0.14);x.closePath();x.fill();
    x.lineWidth=0.09;x.beginPath();x.arc(0.35,0.06,0.13,-1.4,1.4);x.stroke();x.beginPath();x.ellipse(-0.1,0.42,0.6,0.07,0,0,TAU);x.fill();
    x.lineWidth=0.06;for(const k of [-0.28,0.02]){x.beginPath();x.moveTo(k,-0.24);x.bezierCurveTo(k-0.1,-0.34,k+0.1,-0.42,k,-0.52);x.stroke();}},
  key:(x)=>{x.lineWidth=0.11;x.beginPath();x.arc(-0.6,0,0.26,0,TAU);x.stroke();x.beginPath();x.moveTo(-0.34,0);x.lineTo(0.85,0);x.moveTo(0.55,0);x.lineTo(0.55,0.24);x.moveTo(0.78,0);x.lineTo(0.78,0.2);x.stroke();},
  book:(x,cut)=>{x.beginPath();x.moveTo(0,-0.3);x.quadraticCurveTo(-0.45,-0.45,-0.9,-0.32);x.lineTo(-0.9,0.4);x.quadraticCurveTo(-0.45,0.28,0,0.42);x.quadraticCurveTo(0.45,0.28,0.9,0.4);x.lineTo(0.9,-0.32);x.quadraticCurveTo(0.45,-0.45,0,-0.3);x.closePath();x.fill();
    cut();x.lineWidth=0.06;x.beginPath();x.moveTo(0,-0.28);x.lineTo(0,0.4);x.stroke();for(const sd of [-1,1])for(const k of [-0.1,0.08]){x.beginPath();x.moveTo(sd*0.2,k);x.lineTo(sd*0.72,k-0.03);x.stroke();}}};
// a balcony's iron railing, in pencil, on the wall at height v
function tt_rail(ctx,P,u,w,v,depth){ctx.save();ctx.strokeStyle=rgba(wc_haze(TT.iron,depth),0.85);ctx.lineCap="round";const a=P(u,v+1),b=P(u+w,v+1),px=Math.hypot(b[0]-a[0],b[1]-a[1])/w;
  ctx.lineWidth=Math.max(1,px*0.05);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);const n=Math.round(w/0.14);for(let i=0;i<=n;i++){const p=P(u+w*i/n,v),q=P(u+w*i/n,v+1);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);}ctx.stroke();ctx.restore();
  wc_flat(ctx,tt_quad(P,u-0.1,v-0.18,u+w+0.1,v),[150,146,140],depth,"slab");}

// the side street's buildings, from the far end to the corner, each [d1, d2, height, colour, kind]: the left side's front is on X 0.2,
// the right side's on X 14.2
const TT_ROWL=[[150,176,9,TT.cream,"plaster"],[128,150,7,TT.ochre,"plaster"],[108,128,12,TT.brick,"brick"],[92,108,6.5,TT.cream,"plaster"],[76,92,15,TT.concrete,"concrete"],
  [62,76,9.5,TT.blueGrey,"plaster"],[48,62,12.5,TT.brick2,"brick"],[34,48,7,TT.plaster,"plaster"]];
const TT_ROWR=[[150,176,8,TT.brick,"brick"],[130,150,11,TT.cream,"plaster"],[112,130,6.5,TT.ochre,"plaster"],[94,112,16,TT.concrete,"concrete"],[78,94,9,TT.brick2,"brick"],
  [64,78,7,TT.plaster,"plaster"],[48,64,13,TT.blueGrey,"plaster"],[32,48,9.5,TT.brick,"brick"]];
// one building of the side street: its near end (the part standing above the building in front of it), then the wall along the street,
// with its windows, a shop on the ground floor, a cornice
function tt_rowBlock(ctx,c,side,b,i){const [d1,d2,h,col,kind]=b,X=side<0?TT_ST.left:TT_ST.right,far=side<0?-40:60,g1=tt_gy(d1),g2=tt_gy(d2),top=g1+h,depth=tt_haze(c,(d1+d2)/2);
  wc_part(ctx,tt_poly(c,[[X,d1,g1],[far,d1,g1],[far,d1,top],[X,d1,top]]),wc_dim(col,0.08),depth,{lw:1.1,seed:i*7+1});
  const P=tt_wall(c,X,d1,X,d2,g1,g2),L=d2-d1,Pf=(u,v)=>{const q=tt_pr(c,X,d1+u,g1+v);return[q[0],q[1]];};
  wc_part(ctx,[P(0,0),P(L,0),Pf(L,h),Pf(0,h)],col,depth,{lw:1.2,seed:i*7+3});if(kind==="brick")tt_bricks(ctx,Pf,L,h,depth,i*11+side);
  const floors=Math.floor((h-3.4)/3.1);for(let f=0;f<floors;f++)for(let u=1.2;u<L-1.6;u+=3)tt_window(ctx,Pf,u,4.3+f*3.1,1.1,1.5,depth,{frame:kind==="brick"?TT.trim:wc_lit(col,0.4)});
  for(let u=0.8;u<L-2.6;u+=4.4)tt_shop(ctx,P,u,2.6,2.5,depth,i*13+u|0,{shutter:hash(i,u)<0.3?0.6:0});
  wc_flat(ctx,[Pf(-0.05,h-0.35),Pf(L,h-0.35),Pf(L,h+0.05),Pf(-0.05,h+0.05)],wc_lit(col,0.25),depth,"cornice");}

// the corner buildings, either side of the side street: on the left, red brick, three floors over shops; on the right, ochre plaster, four
// floors with long windows
const TT_CORNER={L:{d:[18,34],h:10.5},R:{d:[18,32],h:12.8}};
function tt_cornerL(ctx,c){const B=TT_CORNER.L,X=TT_ST.left,d0=B.d[0],h=B.h,dep=1;
  // the wall along the side street, nearly edge on
  const Ps=(u,v)=>{const q=tt_pr(c,X,d0+u,v);return[q[0],q[1]];},Ls=B.d[1]-d0;wc_part(ctx,[Ps(0,0),Ps(Ls,0),Ps(Ls,h),Ps(0,h)],wc_dim(TT.brick,0.12),dep,{lw:1.2,seed:5});
  for(let f=0;f<2;f++)for(let u=2;u<Ls-2;u+=3.2)tt_window(ctx,Ps,u,4.4+f*3.4,1.2,1.7,dep);tt_bricks(ctx,Ps,Ls,h,dep,5);
  // the front, on the far pavement: from off the left edge to the corner
  const x0=-40,Pf=(u,v)=>{const q=tt_pr(c,x0+u,d0,v);return[q[0],q[1]];},L=X-x0;
  wc_part(ctx,[Pf(0,0),Pf(L,0),Pf(L,h),Pf(0,h)],TT.brick,dep,{lw:1.4,seed:7});tt_bricks(ctx,Pf,L,h,dep,7);
  // a string course over the shops, a cornice at the top
  wc_flat(ctx,[Pf(0,3.55),Pf(L,3.55),Pf(L,3.85),Pf(0,3.85)],TT.trim,dep,"course");wc_wash(ctx,[Pf(0,h-0.45),Pf(L+0.15,h-0.45),Pf(L+0.15,h+0.1),Pf(0,h+0.1)],TT.trim,{kind:"trim",lw:1.2});
  wc_flat(ctx,[Ps(0,3.55),Ps(Ls,3.55),Ps(Ls,3.85),Ps(0,3.85)],wc_dim(TT.trim,0.08),dep,"course");
  // upper floors: tall windows in white frames, iron balconies on the first floor
  for(let f=0;f<2;f++)for(let u=L-2.3;u>1;u-=2.9){tt_window(ctx,Pf,u,4.5+f*3.3,1.3,1.8,dep);if(f===0&&Math.round((L-u)/2.9)%2===1)tt_rail(ctx,Pf,u-0.25,1.8,4.35,dep);}
  // the shops, from the corner: a bakery under a green awning, a shoe shop with its shutter half down, a chemist, a café under a red one;
  // the shoe shop and the chemist have boards with a picture of what they sell
  [[-3.9,3.2,0,"bread",0],[-9.4,3.4,0.55,"shoes",["shoe",[84,58,46],[240,230,206]]],[-13.6,3.4,0,"chemist",["cross",[40,150,96],[248,246,240]]],[-18.2,3.6,0,"cafe",1]].forEach(([X0,w,sh,g,a],i)=>{
    tt_shop(ctx,Pf,X0-x0,w,2.7,dep,20+i,{shutter:sh,goods:g,sign:Array.isArray(a)?a:null});if(!Array.isArray(a))tt_awning(ctx,c,X0-0.2,X0+w+0.2,d0,3.2,2.55,1.2,TT.awning[a],dep);});
  // a door between the bakery and the shoe shop, to the flats above
  wc_wash(ctx,tt_quad(Pf,-5.3-x0,0,-4.4-x0,2.4),[110,74,56],{kind:"door",lw:1.2});}
function tt_cornerR(ctx,c){const B=TT_CORNER.R,X=TT_ST.right,d0=B.d[0],h=B.h,dep=1,col=TT.ochre;
  const Ps=(u,v)=>{const q=tt_pr(c,X,d0+u,v);return[q[0],q[1]];},Ls=B.d[1]-d0;wc_part(ctx,[Ps(0,0),Ps(Ls,0),Ps(Ls,h),Ps(0,h)],wc_dim(col,0.1),dep,{lw:1.3,seed:9});
  // long windows in bands on each floor, along the side street and on the front
  for(let f=0;f<3;f++){const v=4.3+f*3.1;for(let u=1.2;u<Ls-1.5;u+=2.6)tt_window(ctx,Ps,u,v,2,1.5,dep,{frame:[246,240,228]});wc_flat(ctx,[Ps(0,v-0.5),Ps(Ls,v-0.5),Ps(Ls,v-0.32),Ps(0,v-0.32)],wc_lit(col,0.35),dep,"band");}
  for(let u=1;u<Ls-3;u+=4.6)tt_shop(ctx,Ps,u,3.2,2.7,dep,40+u|0,{shutter:u>6&&u<10?0.4:0});
  const x1=60,Pf=(u,v)=>{const q=tt_pr(c,X+u,d0,v);return[q[0],q[1]];},L=x1-X;
  wc_part(ctx,[Pf(0,0),Pf(L,0),Pf(L,h),Pf(0,h)],col,dep,{lw:1.4,seed:11});
  for(let f=0;f<3;f++){const v=4.3+f*3.1;wc_flat(ctx,[Pf(0,v-0.5),Pf(L,v-0.5),Pf(L,v-0.32),Pf(0,v-0.32)],wc_lit(col,0.35),dep,"band");for(let u=1;u<L-1;u+=2.6)tt_window(ctx,Pf,u,v,2,1.5,dep,{frame:[246,240,228]});}
  wc_wash(ctx,[Pf(-0.2,h-0.4),Pf(L,h-0.4),Pf(L,h+0.3),Pf(-0.2,h+0.3)],wc_lit(col,0.3),{kind:"trim",lw:1.3});
  // a shop under a blue awning, a locksmith with a key on its board, and one shuttered under a gold awning
  [[0.8,3.6,0,2],[5.2,3.8,0,["key",[110,84,30],[240,214,140]]],[9.8,3.4,0.5,3]].forEach(([u,w,sh,a],i)=>{tt_shop(ctx,Pf,u,w,2.7,dep,50+i,{shutter:sh,sign:Array.isArray(a)?a:null});
    if(!Array.isArray(a))tt_awning(ctx,c,X+u-0.2,X+u+w+0.2,d0,3.2,2.6,1.1,TT.awning[a],dep);});}

/* the ground: the side street climbing away, the pavements and kerbs, the avenue's wet asphalt and its markings */
function tt_ground(ctx,c,o){const yr=o.year||1995,R=wc_rng(yr),dn=tt_dnear(c),gq=(X0,X1,d0,d1,Y,col,seed)=>{const P=tt_gq(c,X0,X1,d0,d1,Y);if(P)wc_wash(ctx,P,col,{kind:"ground",line:false,seed});};
  // the side street: its road and pavements, climbing; the far end meets the houses at its top
  const strip=(X0,X1,col,seed)=>{const pts=[];for(let d=14;d<=180;d+=6)pts.push([X0,d,tt_gy(d)]);for(let d=180;d>=14;d-=6)pts.push([X1,d,tt_gy(d)]);wc_wash(ctx,tt_poly(c,pts),col,{kind:"ground",line:false,seed});};
  strip(TT_ST.road[0],TT_ST.road[1],TT.asphalt,61);strip(TT_ST.left,TT_ST.road[0],TT.pave,63);strip(TT_ST.road[1],TT_ST.right,TT.pave,65);
  // the far pavement along the avenue, either side of the side street; then the avenue
  gq(-90,TT_ST.road[0],TT_ST.far,TT_ST.back,0.15,TT.pave,67);gq(TT_ST.road[1],90,TT_ST.far,TT_ST.back,0.15,TT.pave,69);gq(-90,90,0,TT_ST.far,0,TT.asphalt,71);
  // where the tyres run, the asphalt is darker: soft, broken bands along each lane
  ctx.save();ctx.globalCompositeOperation="multiply";for(let l=0;l<4;l++)for(const off of [0.9,2.6]){const d=l*3.5+off;if(d<dn)continue;const k=tt_pr(c,0,d)[2];
    for(let X=-40;X<50;){const L=3+R()*9,a=tt_pr(c,X,d),b=tt_pr(c,X+L,d);X+=L+1+R()*4;if(b[0]<-40||a[0]>W+40)continue;
      ctx.strokeStyle=rgba([100,100,110],0.04+R()*0.05);ctx.lineWidth=k*0.45;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}}ctx.restore();
  // the markings, white paint: lane lines (none across the stop line and the crossing), the stop line, the zebra's stripes (worn by 2012)
  const marks=q=>{for(let l=1;l<4;l++){const d=l*3.5;for(let X=-60;X<60;X+=8){if(X+3>TT_ST.stop[0]-0.8&&X<TT_ST.zebra[1]+1.4)continue;
      const P=tt_poly(c,[[X,d-0.06,0],[X+3,d-0.06,0],[X+3,d+0.06,0],[X,d+0.06,0]]);if(tt_seen(P))wc_flat(q,P,TT.line,1,"lane");}}
    const S=tt_gq(c,TT_ST.stop[0],TT_ST.stop[1],0.1,TT_ST.far-0.1,0);if(S)wc_flat(q,S,TT.line,1,"stop");
    for(let k=0;k<14;k++){const d=0.25+k;if(d<dn)continue;wc_wash(q,tt_poly(c,[[TT_ST.zebra[0],d,0],[TT_ST.zebra[1],d,0],[TT_ST.zebra[1],d+0.5,0],[TT_ST.zebra[0],d+0.5,0]]),TT.line,{kind:"trim",line:false,seed:80+k});}};
  if(yr<2000)marks(ctx);
  else{const [mc,mx]=wc_buf("ttMarks",W,H);mx.fillStyle=rgba(TT.asphalt,1);mx.fillRect(0,0,W,H);marks(mx);mx.globalCompositeOperation="destination-out";mx.globalAlpha=0.7;mx.drawImage(WC.blotch,-180,-90,W+360,H+180);
    mx.globalAlpha=0.5;mx.drawImage(WC.blotch,200,40,W*0.7,H*0.7);ctx.save();ctx.globalAlpha=0.55;ctx.globalCompositeOperation="lighten";ctx.drawImage(mc,0,0);ctx.restore();}
  tt_wet(ctx,c);
  // kerbs: the far kerb's stone face either side of the side street, the near kerb's
  const kerb=(X0,X1,d)=>{const m=1200*(c.d0+d)/c.f;X0=Math.max(X0,c.X-m);X1=Math.min(X1,c.X+m);if(d>dn)wc_wash(ctx,tt_poly(c,[[X0,d,0],[X1,d,0],[X1,d,0.15],[X0,d,0.15]]),TT.kerb,{kind:"trim",lw:1,seed:Math.round(X0)});};
  kerb(-90,TT_ST.road[0],TT_ST.far);kerb(TT_ST.road[1],90,TT_ST.far);
  // the near pavement, and its kerb
  gq(-90,90,-8,0,0.15,TT.pave,73);kerb(-90,90,0);
  // paving joints on the pavements, faint
  ctx.save();ctx.strokeStyle=rgba(wc_dim(TT.pave,0.25),0.22);ctx.lineWidth=1.2;const ln=(X0,d0,X1,d1)=>{if(Math.min(d0,d1)<dn)return;const a=tt_pr(c,X0,d0,0.15),b=tt_pr(c,X1,d1,0.15);if(Math.max(a[0],b[0])<-20||Math.min(a[0],b[0])>W+20)return;
    ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();};
  for(const [d0,d1] of [[Math.max(-8,dn+0.01),0],[TT_ST.far,TT_ST.back]])if(d1>d0){for(let X=-30;X<40;X+=1.2)if(d0<TT_ST.far||X<TT_ST.road[0]||X>TT_ST.road[1])ln(X,d0,X,d1);
    for(let d=Math.ceil(d0/1.2)*1.2;d<=d1;d+=1.2){if(d0<TT_ST.far)ln(-90,d,90,d);else{ln(-90,d,TT_ST.road[0],d);ln(TT_ST.road[1],d,90,d);}}}ctx.restore();
  // a drain at the kerb and two manhole covers
  for(const [X,d] of [[-5.5,6.2],[7.5,9.6],[5.4,2.2]]){if(d<dn+0.5)continue;const p=tt_pr(c,X,d);wc_wash(ctx,wc_ell(p[0],p[1],0.38*p[2],0.38*p[2]*(c.hc/(c.d0+d))*1.1,20),wc_dim(TT.asphalt,0.25),{kind:"thing",line:false,flat:true});}}
// the wet road gives back what stands across it: each corner building's colour in a band under the far kerb, and streaks running down towards us under the shops, the awnings, the poles and the tree
function tt_wet(ctx,c){const df=TT_ST.far,dl=6,y0=tt_pr(c,0,df)[1],y1=tt_pr(c,0,df-dl)[1];
  const band=(X0,X1,col,a,op)=>{const P=tt_gq(c,X0,X1,df-dl,df,0);if(!P)return;const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));
    ctx.save();ctx.globalCompositeOperation=op||"multiply";ctx.fillStyle=g;wc_tr(ctx,P);ctx.fill();ctx.restore();};
  band(-40,TT_ST.road[0]-0.2,wc_lit(TT.brick,0.25),0.5);band(TT_ST.road[1]+0.2,60,wc_lit(TT.ochre,0.2),0.5);
  const streak=(X,w,col,a,L,op)=>{const p=tt_pr(c,X,df),q=tt_pr(c,X,df-L),ww=w*p[2];if(p[0]<-60||p[0]>W+60)return;const g=ctx.createLinearGradient(0,p[1],0,q[1]);g.addColorStop(0,rgba(col,a));g.addColorStop(1,rgba(col,0));
    ctx.save();ctx.globalCompositeOperation=op||"multiply";ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(p[0]-ww/2,p[1]);ctx.lineTo(p[0]+ww/2,p[1]);ctx.lineTo(q[0]+ww*0.7,q[1]);ctx.lineTo(q[0]-ww*0.7,q[1]);ctx.closePath();ctx.fill();ctx.restore();};
  for(const [X0,w] of [[-3.9,3.2],[-9.4,3.4],[-13.6,3.4],[-18.2,3.6],[15,3.6],[19.4,3.8],[24,3.4]])streak(X0+w/2,w*0.8,[104,92,96],0.3,3.2);
  [[-2.3,3.6,TT.awning[0]],[-16.4,4,TT.awning[1]],[16.8,4,TT.awning[2]],[25.7,3.8,TT.awning[3]]].forEach(([X,w,col])=>streak(X,w*0.8,col,0.32,2.4));
  for(const X of [-8.5,12.6,TT_SIG.X])streak(X,0.18,TT.iron,0.4,4.2);streak(-12.5,1.4,[96,138,90],0.3,3.4);
  // ripples break the reflections into lines
  ctx.save();ctx.globalCompositeOperation="screen";const R=wc_rng(9);for(let i=0;i<40;i++){const d=df-0.3-R()*dl*0.8,X=-30+R()*60,p=tt_pr(c,X,d);if(p[0]<-60||p[0]>W+60)continue;
    ctx.strokeStyle=rgba([140,144,156],0.1+R()*0.1);ctx.lineWidth=Math.max(1,p[2]*0.04);ctx.beginPath();ctx.moveTo(p[0]-p[2]*(1+R()*2),p[1]);ctx.lineTo(p[0]+p[2]*(1+R()*2),p[1]);ctx.stroke();}ctx.restore();}
// the side street's top end: low houses across it at the foot of the hills, pale with distance
function tt_streetEnd(ctx,c){const d=182,g=tt_gy(d),dep=tt_haze(c,d),R=wc_rng(14);let X=-26;
  while(X<40){const w=4+R()*6,h=5+R()*5,col=[TT.cream,TT.ochre,TT.blueGrey,TT.plaster,TT.brick][(R()*5)|0];
    wc_part(ctx,tt_poly(c,[[X,d,g],[X+w,d,g],[X+w,d,g+h],[X,d,g+h]]),col,dep,{lw:0.8,seed:Math.round(X*3+40)});
    for(let u=X+0.8;u<X+w-1;u+=2.2)for(let v=g+1.2;v<g+h-1.4;v+=2.8)wc_flat(ctx,tt_poly(c,[[u,d-0.1,v],[u+0.9,d-0.1,v],[u+0.9,d-0.1,v+1.1],[u,d-0.1,v+1.1]]),TT.glass,dep,"glass");
    X+=w;}}

/* things on the pavements: street lamps, the signal at the crossing, a tree, the wires across the side street */
function tt_lamp(ctx,c,X,d,h){const a=tt_pr(c,X,d,0.15),b=tt_pr(c,X,d,h),e=tt_pr(c,X,d-1.6,h+0.3),w=Math.max(2,0.14*a[2]);
  wc_wash(ctx,[[a[0]-w/2,a[1]],[a[0]+w/2,a[1]],[b[0]+w/3,b[1]],[b[0]-w/3,b[1]]],TT.iron,{kind:"iron",lw:1});
  ctx.save();ctx.strokeStyle=rgba(TT.iron,0.95);ctx.lineWidth=w*0.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.quadraticCurveTo(b[0],e[1]-0.2*e[2],e[0],e[1]);ctx.stroke();ctx.restore();
  wc_wash(ctx,wc_ell(e[0],e[1]+0.1*e[2],0.36*e[2],0.13*e[2],16),[90,92,100],{kind:"iron",lw:1});}
// the traffic signal's pole and its box, on the far kerb, turned a little towards us; its lamps are lit every frame (tt_signal)
const TT_SIG={X:-2.4,d:14.45,y0:3.05,y1:4.05};
function tt_signalPole(ctx,c){const S=TT_SIG,a=tt_pr(c,S.X,S.d,0.15),b=tt_pr(c,S.X,S.d,S.y1+0.15),w=Math.max(2,0.12*a[2]);
  wc_wash(ctx,[[a[0]-w/2,a[1]],[a[0]+w/2,a[1]],[b[0]+w/2,b[1]],[b[0]-w/2,b[1]]],[84,88,92],{kind:"iron",lw:1});
  const [x0,y0]=tt_pr(c,S.X-0.17,S.d,S.y1),[x1,y1]=tt_pr(c,S.X+0.17,S.d,S.y0);wc_wash(ctx,wc_rrPts(x0,y0,x1-x0,y1-y0,(x1-x0)*0.25),[44,46,52],{kind:"iron",lw:1});
  for(let i=0;i<3;i++){const p=tt_pr(c,S.X,S.d-0.02,S.y1-0.17-i*0.33);wc_flat(ctx,wc_ell(p[0],p[1],0.12*p[2],0.12*p[2],16),[70,70,74],1,"lamp");}}
// a lamp of the signal lit: 0 red, 1 amber, 2 green
function tt_signal(ctx,c,lamp,a){if(a<=0.01)return;const S=TT_SIG,p=tt_pr(c,S.X,S.d-0.04,S.y1-0.17-lamp*0.33),col=[[236,70,52],[246,176,40],[70,200,120]][lamp];
  ctx.save();ctx.globalAlpha=a;ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.arc(p[0],p[1],0.115*p[2],0,TAU);ctx.fill();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,p[0],p[1],0.7*p[2],col,0.55);ctx.restore();}
// a soft dab of paint, fading at its edge
function tt_dab(ctx,x,y,r,col,a){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(col,a));g.addColorStop(0.6,rgba(col,a*0.7));g.addColorStop(1,rgba(col,0));ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);}
// a tree on the far pavement: its square of earth, a trunk that forks, and one crown with a soft lobed edge, darker underneath and lit
// on its top left, dabbed with small leaves
function tt_tree(ctx,c,X,d,h){const a=tt_pr(c,X,d,0.15),k=a[2],R=wc_rng(Math.round(X*13+d)),cx=a[0],base=a[1];
  wc_flat(ctx,tt_poly(c,[[X-0.6,d-0.6,0.15],[X+0.6,d-0.6,0.15],[X+0.6,d+0.6,0.15],[X-0.6,d+0.6,0.15]]),[132,110,90],1,"earth");
  const tr=(x0,y0,x1,y1,w0,w1)=>wc_wash(ctx,[[x0-w0,y0],[x0+w0,y0],[x1+w1,y1],[x1-w1,y1]],[112,92,78],{kind:"trunk",lw:1.1});
  tr(cx,base,cx+0.05*k,base-h*0.5*k,0.13*k,0.09*k);tr(cx+0.05*k,base-h*0.48*k,cx-0.55*k,base-h*0.74*k,0.07*k,0.035*k);tr(cx+0.05*k,base-h*0.48*k,cx+0.6*k,base-h*0.78*k,0.07*k,0.035*k);
  const ccx=cx,ccy=base-h*0.72*k,rx=h*0.31*k,ry=h*0.25*k,n=wc_noise(Math.round(X*7)+3),pts=[];
  for(let i=0;i<56;i++){const an=i/56*TAU,r=1+0.1*Math.sin(an*6+X)+0.16*(n(Math.cos(an)*1.6+5,Math.sin(an)*1.6+5)-0.5);pts.push([ccx+Math.cos(an)*rx*r,ccy+Math.sin(an)*ry*r*(Math.sin(an)>0?0.8:1)]);}
  wc_wash(ctx,pts,[112,152,96],{kind:"tree",seed:Math.round(X)});
  ctx.save();wc_tr(ctx,pts);ctx.clip();
  ctx.globalCompositeOperation="multiply";for(let i=0;i<46;i++){const an=R()*TAU,r=Math.sqrt(R()),x=ccx+Math.cos(an)*rx*r,y=ccy+Math.sin(an)*ry*r,lo=(y-ccy)/ry+(x-ccx)/rx*0.5;
    if(lo<0.05)continue;tt_dab(ctx,x,y,(0.3+R()*0.34)*k,[70,110,72],0.3+R()*0.25);}
  ctx.globalCompositeOperation="source-over";for(let i=0;i<34;i++){const an=R()*TAU,r=Math.sqrt(R()),x=ccx+Math.cos(an)*rx*r,y=ccy+Math.sin(an)*ry*r,lo=(y-ccy)/ry+(x-ccx)/rx*0.5;
    if(lo>-0.15)continue;tt_dab(ctx,x,y,(0.24+R()*0.26)*k,[184,210,150],0.3+R()*0.2);}
  // a branch or two showing through the leaves
  ctx.strokeStyle=rgba([104,86,74],0.5);ctx.lineWidth=Math.max(1,0.05*k);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(cx-0.45*k,base-h*0.72*k);ctx.quadraticCurveTo(cx-0.9*k,base-h*0.8*k,cx-1.2*k,base-h*0.86*k);
  ctx.moveTo(cx+0.5*k,base-h*0.76*k);ctx.quadraticCurveTo(cx+0.8*k,base-h*0.86*k,cx+1.1*k,base-h*0.9*k);ctx.stroke();ctx.restore();}
// wires sagging from wall to wall across the side street, in pencil
function tt_wires(ctx,c){ctx.save();ctx.strokeStyle=rgba(WC_PENCIL,0.55);ctx.lineWidth=1.3;ctx.lineCap="round";
  for(const [a,b,sag] of [[[TT_ST.left,19,9.2],[TT_ST.right,21,10.4],1.1],[[TT_ST.left,19.4,8.8],[TT_ST.right,21.4,10],1.2],[[TT_ST.left,40,7],[TT_ST.right,46,8.6],0.9],[[TT_ST.left,66,9.6],[TT_ST.right,70,8],0.8]]){
    const p=tt_pr(c,...a),q=tt_pr(c,...b),m=tt_pr(c,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2-sag);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.quadraticCurveTo(2*m[0]-(p[0]+q[0])/2,2*m[1]-(p[1]+q[1])/2,q[0],q[1]);ctx.stroke();}
  ctx.restore();}

/* ---------- Bogotá: the cars ---------- */
// small cars of the 1990s, from the side, with no makes and no badges: an outline in metres from the back (x) and up (y), going up the
// back, over the roof and down the front (a 1 after a point: the edge from it is glass), the side windows, the wheels and the door seams.
// The avenue runs one way, left to right, so every car shows us its right side; the driver sits on the far side, seen through the glass.
const TT_MODEL={
  box:{L:3.66,w:1.52,h:1.56,r:0.29,wheels:[0.62,3.06],seat:2.0,doors:[1.0,1.68,2.42],
    out:[[0.03,0.26],[0,0.5],[0.02,0.96,1],[0.06,1.44],[0.18,1.53],[2.0,1.54,1],[2.46,1.04],[3.5,0.97],[3.62,0.86],[3.66,0.52],[3.63,0.27]],
    win:[[[0.22,0.98],[0.94,0.98],[0.94,1.42],[0.26,1.42]],[[1.04,0.98],[1.64,0.98],[1.64,1.43],[1.04,1.43]],[[1.72,0.98],[2.36,0.98],[1.98,1.44],[1.72,1.44]]]},
  hatch:{L:3.6,w:1.56,h:1.36,r:0.28,wheels:[0.6,2.95],seat:1.82,doors:[1.12,2.36],
    out:[[0.03,0.3],[0,0.62],[0.08,0.92,1],[0.48,1.33],[1.92,1.36,1],[2.58,0.94],[3.46,0.82],[3.58,0.7],[3.6,0.46],[3.57,0.3]],
    win:[[[0.42,0.96],[1.04,0.96],[1.04,1.27],[0.56,1.3]],[[1.14,0.96],[2.48,0.96],[1.9,1.31],[1.14,1.31]]]},
  sedan:{L:4.06,w:1.63,h:1.4,r:0.29,wheels:[0.78,3.32],seat:2.22,doors:[1.28,2.1,2.94],
    out:[[0.04,0.32],[0,0.62],[0.06,0.9],[0.78,0.95,1],[1.26,1.37],[2.42,1.4,1],[3.02,0.96],[3.94,0.86],[4.04,0.74],[4.06,0.5],[4.03,0.32]],
    win:[[[1.3,0.98],[2.02,0.98],[2.02,1.35],[1.38,1.35]],[[2.1,0.98],[2.96,0.98],[2.4,1.37],[2.1,1.37]]]}};
// the cars' colours, faded the way paint was on a city's cars: cream, red, pale blue, beige, green, grey, a mustard yellow
const TT_PAINT={cream:[234,228,212],red:[178,58,50],blue:[132,162,190],beige:[208,188,148],green:[90,124,98],grey:[110,114,122],mustard:[210,170,72],white:[240,240,236]};
// one car's right side, painted once for its size: the body with its windows cut out, the arches, bumpers, a trim line, the seams and
// handles, its lamps, a mirror; twice the size it's drawn at, so the camera can close in
function tt_carSide(m,col,k){const M=TT_MODEL[m],key="ttCar|"+m+"|"+col.join(",")+"|"+Math.round(k*2);return wc_kept(key,Math.ceil(M.L*k*2+40),Math.ceil(M.h*k*2+40),q=>{
  const K=k*2,X=x=>20+x*K,Y=y=>20+(M.h-y)*K,body=M.out.map(p=>[X(p[0]),Y(p[1])]).concat([[X(M.L-0.05),Y(0.24)],[X(0.05),Y(0.24)]]),wins=M.win.map(w=>w.map(p=>[X(p[0]),Y(p[1])]));
  // the body, then the windows cut through it (the inside is drawn behind, every frame)
  wc_wash(q,body,col,{kind:"build",lw:Math.max(1,K*0.006),seed:m.length*7+col[0]});
  q.save();q.globalCompositeOperation="destination-out";for(const w of wins){wc_tr(q,w);q.fill();}q.restore();
  q.save();q.strokeStyle=rgba([46,46,52],0.8);q.lineWidth=Math.max(1,K*0.022);q.lineJoin="round";for(const w of wins){wc_tr(q,w);q.stroke();}q.restore();
  // the arches over the wheels, the bumpers, a pale trim line along the side
  for(const wx of M.wheels){q.fillStyle=rgba([44,44,50],1);q.beginPath();q.arc(X(wx),Y(M.r),(M.r+0.07)*K,Math.PI,0);q.lineTo(X(wx)+(M.r+0.07)*K,Y(0.18));q.lineTo(X(wx)-(M.r+0.07)*K,Y(0.18));q.closePath();q.fill();}
  q.fillStyle=rgba([70,72,78],0.95);q.fillRect(X(-0.02),Y(0.52),0.4*K,0.2*K);q.fillRect(X(M.L-0.38),Y(0.5),0.42*K,0.2*K);
  q.fillStyle=rgba(wc_lit(col,0.35),0.8);q.fillRect(X(0.4),Y(0.66),(M.L-0.8)*K,Math.max(1,0.03*K));
  // door seams and handles, in pencil
  q.strokeStyle=rgba(wc_dim(col,0.45),0.75);q.lineWidth=Math.max(1,K*0.008);q.beginPath();for(const dx of M.doors){q.moveTo(X(dx),Y(0.3));q.lineTo(X(dx),Y(0.98));}q.stroke();
  q.fillStyle=rgba(wc_dim(col,0.5),0.9);for(let i=0;i<M.doors.length-1;i++)q.fillRect(X(M.doors[i]+0.08),Y(0.86),0.16*K,Math.max(1,0.03*K));
  // the lamps: red at the back, amber and white at the front; a mirror at the front window's front corner
  q.fillStyle="rgba(196,56,46,0.95)";q.fillRect(X(0),Y(0.86),0.09*K,0.2*K);q.fillStyle="rgba(236,170,60,0.95)";q.fillRect(X(M.L-0.1),Y(0.74),0.1*K,0.08*K);
  q.fillStyle="rgba(246,244,232,0.95)";q.fillRect(X(M.L-0.08),Y(0.86),0.08*K,0.1*K);
  const mw=M.win[M.win.length-1][1];q.fillStyle=rgba([50,50,56],0.95);q.beginPath();q.ellipse(X(mw[0]-0.04),Y(1.02),0.07*K,0.05*K,0,0,TAU);q.fill();});}
// a car on the avenue: its model and colour, the back of it at X, its lane's centre at d; o.wheel turns the wheels (metres travelled),
// o.brake lights its brake lamps, o.reverse its white reversing lamps, o.driver(ctx, x, y, k) draws the driver in the front window
function tt_car(ctx,c,m,col,X,d,o){o=o||{};const M=TT_MODEL[m],dn=d-M.w/2,df=d+M.w/2,k=c.f/(c.d0+dn);if(c.d0+dn<0.5)return;
  const x0=960+(X-c.X)*k;if(x0>W+80||x0+M.L*k<-80)return;
  // its shadow on the road
  const sc=tt_pr(c,X+M.L/2,d),sy=Math.abs(tt_pr(c,0,dn)[1]-tt_pr(c,0,df)[1])/2+3;ctx.save();ctx.translate(sc[0],sc[1]);ctx.scale(M.L*k*0.56,sy*1.3);const g=ctx.createRadialGradient(0,0,0.2,0,0,1);
  g.addColorStop(0,"rgba(40,40,50,0.4)");g.addColorStop(1,"rgba(40,40,50,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,TAU);ctx.fill();ctx.restore();
  // the sides we see beyond the near one: the roof and bonnet from above, the glass of the windscreen or back window, the back or the front
  const pts=M.out,q=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1],nx=-(b[1]-a[1]),ny=b[0]-a[0],mx=X+(a[0]+b[0])/2,my=(a[1]+b[1])/2;
    if(nx*(c.X-mx)+ny*(c.hc-my)<=0)continue;const P=tt_poly(c,[[X+a[0],dn,a[1]],[X+b[0],dn,b[1]],[X+b[0],df,b[1]],[X+a[0],df,a[1]]]),up=ny/Math.hypot(nx,ny);
    q.push({P,col:a[2]?[150,166,186]:up>0.5?wc_lit(col,0.22):wc_dim(col,0.16),z:Math.hypot(c.X-mx,c.hc-my)});}
  q.sort((a,b)=>b.z-a.z);ctx.save();ctx.lineJoin="round";for(const f of q){wc_tr(ctx,f.P);ctx.fillStyle=rgba(f.col,1);ctx.fill();ctx.strokeStyle=rgba(wc_dim(f.col,0.4),0.55);ctx.lineWidth=1.2;ctx.stroke();}ctx.restore();
  // inside, through the windows: the far windows' light above, the seats, the driver
  const Pw=w=>w.map(p=>[x0+p[0]*k,c.yh+(c.hc-p[1])*k]);ctx.save();ctx.beginPath();for(const w of M.win){const P=Pw(w);ctx.moveTo(P[0][0],P[0][1]);for(const p of P.slice(1))ctx.lineTo(p[0],p[1]);ctx.closePath();}ctx.clip();
  const yb=c.yh+(c.hc-0.98)*k,yt=c.yh+(c.hc-1.44)*k,gi=ctx.createLinearGradient(0,yt,0,yb);gi.addColorStop(0,"rgba(170,180,194,1)");gi.addColorStop(0.45,"rgba(120,124,134,1)");gi.addColorStop(1,"rgba(64,62,68,1)");
  ctx.fillStyle=gi;ctx.fillRect(x0-2,yt-4,M.L*k+4,yb-yt+8);
  ctx.fillStyle="rgba(58,56,62,0.9)";for(const sx of [M.seat-0.62,M.seat+0.02]){ctx.beginPath();ctx.ellipse(x0+(sx+0.22)*k,c.yh+(c.hc-1.12)*k,0.17*k,0.22*k,0.2,0,TAU);ctx.fill();}
  if(o.driver)o.driver(ctx,x0+M.seat*k,c.yh+(c.hc-1.0)*k,c.f/(c.d0+d+0.35));ctx.restore();
  // the near side, then the glass over the windows: a little sky in it, a pale streak
  const sp=tt_carSide(m,col,k);ctx.drawImage(sp,x0-10,c.yh+(c.hc-M.h)*k-10,sp.width/2,sp.height/2);
  ctx.save();for(const w of M.win){const P=Pw(w);wc_tr(ctx,P);ctx.fillStyle="rgba(176,192,212,0.22)";ctx.fill();}ctx.clip();ctx.strokeStyle="rgba(255,255,255,0.28)";ctx.lineWidth=0.16*k;
  ctx.beginPath();for(const u of [0.3,0.62])ctx.moveTo(x0+(M.L*u)*k,yb),ctx.lineTo(x0+(M.L*u+0.4)*k,yt);ctx.stroke();ctx.restore();
  // the wheels: a dark tyre, a pale rim, a hub cap whose marks turn as it rolls
  const rot=(o.wheel||0)/M.r;for(const wx of M.wheels){const cx=x0+wx*k,cy=c.yh+(c.hc-M.r)*k,r=M.r*k;ctx.fillStyle="rgba(36,36,40,1)";ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();
    ctx.fillStyle="rgba(176,178,184,1)";ctx.beginPath();ctx.arc(cx,cy,r*0.6,0,TAU);ctx.fill();ctx.strokeStyle="rgba(110,112,120,0.9)";ctx.lineWidth=Math.max(1,r*0.08);ctx.beginPath();
    for(let i=0;i<4;i++){const a=rot+i*Math.PI/2;ctx.moveTo(cx+Math.cos(a)*r*0.18,cy+Math.sin(a)*r*0.18);ctx.lineTo(cx+Math.cos(a)*r*0.5,cy+Math.sin(a)*r*0.5);}ctx.stroke();
    ctx.fillStyle="rgba(214,216,220,1)";ctx.beginPath();ctx.arc(cx,cy,r*0.16,0,TAU);ctx.fill();}
  // lamps lit: red when braking, white when backing up
  const lamp=(lx,ly,col,a)=>{if(a<=0.01)return;ctx.save();ctx.globalCompositeOperation="screen";wc_glowAt(ctx,x0+lx*k,c.yh+(c.hc-ly)*k,0.42*k,col,0.7*a);ctx.restore();};
  lamp(0.04,0.96,[255,70,50],o.brake||0);lamp(0.04,0.72,[255,250,236],o.reverse||0);}

/* ---------- Bogotá: its people ---------- */
// people of the crossing, all invented: drawn as the series draws people, with the warm umber wash of people of the past behind them.
// People in the street wear jackets and sweaters; the mimes wear black, with white gloves and painted white faces; the officer wears a
// plain uniform and a cap, with no badge
Object.assign(PEOPLE,{
  ttBag:{name:"",role:"",side:"",edge:GV_PAST,seed:61,skin:[214,168,132],hair:{style:"bob",c:[40,30,28],streak:[96,80,72]},earrings:[220,200,150],
    top:{kind:"cardigan",c:[150,92,84],inner:[236,226,210]},bottom:{kind:"skirt",c:[84,78,96]},legs:[196,156,124],shoe:[60,44,40],build:{sh:64,hip:60,h:0.93}},
  ttSuit:{name:"",role:"",side:"",edge:GV_PAST,seed:62,skin:[226,190,160],hair:{style:"side",c:[50,40,36]},glasses:[44,42,50],
    top:{kind:"suit",c:[70,74,88],inner:[236,236,240]},bottom:{c:[66,70,84]},shoe:[30,28,30],build:{sh:74,hip:60,h:1.0}},
  ttStudent:{name:"",role:"",side:"",edge:GV_PAST,seed:63,skin:[196,150,112],hair:{style:"curly",c:[34,28,26]},
    top:{kind:"sweater",c:[92,128,150]},bottom:{c:[70,80,110]},shoe:[230,230,226],build:{sh:68,hip:58,h:0.96}},
  ttFlatCap:{name:"",role:"",side:"",edge:GV_PAST,seed:64,skin:[200,154,118],hair:{style:"cropped",c:[150,146,140]},hat:"ttFlat",hatC:[104,96,88],
    top:{kind:"blazer",c:[124,98,72],inner:[222,216,200]},bottom:{c:[84,78,70]},shoe:[50,40,34],build:{sh:72,hip:62,h:0.97}},
  ttLong:{name:"",role:"",side:"",edge:GV_PAST,seed:65,skin:[232,198,170],hair:{style:"long",c:[70,44,30]},
    top:{kind:"overshirt",c:[118,138,104],inner:[240,236,226]},bottom:{c:[60,64,80]},shoe:[90,60,46],build:{sh:64,hip:60,h:0.94}},
  ttWorker:{name:"",role:"",side:"",edge:GV_PAST,seed:66,skin:[170,120,88],hair:{style:"cropped",c:[28,24,24]},
    top:{kind:"overshirt",c:[176,120,60],inner:[220,220,214]},bottom:{c:[76,84,110]},shoe:[70,52,40],build:{sh:76,hip:62,h:1.0}},
  ttBun:{name:"",role:"",side:"",edge:GV_PAST,seed:67,skin:[188,140,106],hair:{style:"bun",c:[36,28,26]},earrings:[230,210,160],
    top:{kind:"sweater",c:[196,170,120]},bottom:{c:[96,72,64]},shoe:[60,44,40],build:{sh:64,hip:60,h:0.92}},
  ttSpecs:{name:"",role:"",side:"",edge:GV_PAST,seed:68,skin:[210,170,140],hair:{style:"side",c:[30,26,24]},glasses:[60,50,40],
    top:{kind:"shirt",c:[214,222,236]},bottom:{c:[96,90,80]},shoe:[60,44,36],build:{sh:72,hip:60,h:0.99}},
  ttMime1:{name:"",role:"mime",side:"",edge:GV_PAST,seed:71,mime:true,skin:[246,244,238],hair:{style:"cropped",c:[22,20,24]},hat:"ttBowler",hatC:[34,32,38],braces:[180,50,48],
    top:{kind:"sweater",c:[42,42,48]},bottom:{c:[36,36,42]},shoe:[24,22,24],build:{sh:66,hip:58,h:0.95}},
  ttMime2:{name:"",role:"mime",side:"",edge:GV_PAST,seed:72,mime:true,skin:[246,244,238],hair:{style:"bun",c:[24,20,22]},hat:"ttBeret",hatC:[36,34,42],
    top:{kind:"sweater",c:[40,40,46]},bottom:{c:[34,34,40]},shoe:[24,22,24],build:{sh:62,hip:58,h:0.92}},
  ttMime3:{name:"",role:"mime",side:"",edge:GV_PAST,seed:73,mime:true,skin:[246,244,238],hair:{style:"curly",c:[24,20,22]},braces:[46,46,52],
    top:{kind:"shirt",c:[236,234,228]},bottom:{c:[36,36,42]},shoe:[24,22,24],build:{sh:68,hip:58,h:0.97}},
  ttMime4:{name:"",role:"mime",side:"",edge:GV_PAST,seed:74,mime:true,skin:[246,244,238],hair:{style:"side",c:[26,22,24]},hat:"ttBowler",hatC:[30,30,34],
    top:{kind:"sweater",c:[44,44,50]},bottom:{c:[38,38,44]},shoe:[24,22,24],build:{sh:70,hip:60,h:0.99}},
  ttOfficer:{name:"",role:"traffic officer",side:"",edge:GV_PAST,seed:75,skin:[196,150,112],hair:{style:"cropped",c:[26,22,22]},hat:"ttCap",hatC:[88,100,76],
    top:{kind:"blazer",c:[94,106,80],inner:[224,222,204]},bottom:{c:[88,98,76]},shoe:[24,22,24],build:{sh:76,hip:62,h:1.0}},
  ttGrey:{name:"",role:"",side:"",edge:GV_PAST,seed:69,skin:[222,184,150],hair:{style:"bun",c:[176,172,166]},earrings:[200,200,210],
    top:{kind:"cardigan",c:[96,110,130],inner:[234,228,214]},bottom:{kind:"skirt",c:[110,86,74]},legs:[200,164,134],shoe:[60,46,40],build:{sh:64,hip:62,h:0.9}},
  ttCurly:{name:"",role:"",side:"",edge:GV_PAST,seed:70,skin:[150,104,76],hair:{style:"coily",c:[26,22,22]},
    top:{kind:"overshirt",c:[64,70,84],inner:[226,206,150]},bottom:{c:[110,100,86]},shoe:[40,32,30],build:{sh:72,hip:60,h:0.98}},
  ttDrv1:{name:"",role:"driver",side:"",edge:GV_PAST,seed:76,skin:[220,180,146],hair:{style:"side",c:[44,34,30]},top:{kind:"shirt",c:[226,214,190]},bottom:{c:[70,70,80]},shoe:[40,30,26],build:{sh:74,hip:60,h:1.0}},
  ttDrv2:{name:"",role:"driver",side:"",edge:GV_PAST,seed:77,skin:[190,146,110],hair:{style:"cropped",c:[30,26,24]},glasses:[40,40,44],top:{kind:"blazer",c:[60,62,74],inner:[230,230,236]},bottom:{c:[60,62,74]},shoe:[30,28,30],build:{sh:76,hip:62,h:1.0}},
  ttDrv3:{name:"",role:"driver",side:"",edge:GV_PAST,seed:78,skin:[226,188,158],hair:{style:"bob",c:[96,60,40],streak:[150,110,80]},top:{kind:"sweater",c:[140,60,70]},bottom:{c:[60,60,70]},shoe:[40,30,26],build:{sh:64,hip:60,h:0.94}}});
// what the people of the crossing do: whistle with two fingers, clap with their hands up (seen over the cars), bow, show the way back with
// open palms, hold an umbrella or a bag
Object.assign(POSE,{
  tt_whistle:{L:[0.12,-0.06],R:[2.67,-1.27],feet:26,shift:2,tilt:-0.04,turn:0.1,gaze:[0,-0.3],look:0},
  tt_lips:{L:[0.12,-0.06],R:[0.1,0.05],feet:26,shift:3,tilt:-0.07,turn:0.14,gaze:[0.2,-0.2],look:0},
  tt_clapA:{L:[2.75,-2.45],R:[2.75,-2.45],feet:26,shift:2,tilt:0.0,turn:0.05,gaze:[0.2,-0.4],look:0},
  tt_clapB:{L:[2.75,-2.9],R:[2.75,-2.9],feet:26,shift:2,tilt:0.0,turn:0.05,gaze:[0.2,-0.4],look:0},
  tt_bow:{L:[0.3,-1.3],R:[0.95,1.45],hand:"open",feet:20,shift:0,tilt:0.12,turn:0,gaze:[0,1],look:1},
  tt_palms:{L:[0.55,1.3],R:[0.5,1.25],hand:"open",both:true,feet:30,shift:-4,tilt:-0.05,turn:-0.25,gaze:[-0.8,0],look:0},
  tt_sweep:{L:[1.3,2.35],R:[0.42,0.95],hand:"open",both:true,feet:32,shift:-6,tilt:-0.08,turn:-0.3,gaze:[-0.9,-0.1],look:0},
  tt_umbrella:{L:[0.12,-0.06],R:[0.3,2.64],feet:24,shift:2,tilt:0.02,turn:0.06,gaze:[0,0],look:0},
  tt_bag:{L:[0.12,-0.08],R:[0.08,0.02],feet:24,shift:-2,tilt:0.03,turn:0.08,gaze:[0,0],look:0},
  tt_nod:{L:[0.13,-0.1],R:[0.09,0.06],feet:25,shift:3,tilt:0.05,turn:0.18,gaze:[0.5,0.2],look:0},
  // "after you": one open hand shows the way back, low; the other on the heart. tt_after2 points back over the car, to behind the line
  tt_after:{L:[0.95,1.05],R:[0.3,-2.36],hand:"open",feet:30,shift:-4,tilt:-0.02,turn:-0.3,gaze:[-0.8,0.3],look:0},
  tt_after2:{L:[1.5,1.95],R:[0.3,-2.36],hand:"open",feet:32,shift:-6,tilt:-0.05,turn:-0.34,gaze:[-0.9,-0.1],look:0},
  // looking to one side: our left (tt_lookL) or right (tt_lookR)
  tt_lookL:{L:[0.13,-0.1],R:[0.09,0.06],feet:25,shift:-2,tilt:-0.03,turn:-0.36,gaze:[-0.9,0.1],look:0},
  tt_lookR:{L:[0.13,-0.1],R:[0.09,0.06],feet:25,shift:2,tilt:0.03,turn:0.36,gaze:[0.9,0.1],look:0}});
// a whistle's mouth, a laugh, a stubborn look
EXPR.ttWhistle={bi:-3,bo:-1,arch:-3,eye:0.9,smile:0,open:0.55,mw:9};
EXPR.ttLaugh={bi:-2,bo:-3.5,arch:-4,eye:0.62,happy:1,smile:1,open:1,mw:26};
EXPR.ttStern={bi:3,bo:-1,arch:0,knit:3,eye:0.85,smile:-0.3,open:0,mw:15};
// the mimes' painted faces: black marks above and below each eye, red lips; the hats the films' townsfolk wear; red braces
const tt_head0=head;
head=function(ctx,P,E,po,t){tt_head0(ctx,P,E,po,t);if(P.mime)tt_mimeFace(ctx,P,E,po);if(P.hat&&P.hat.slice(0,2)==="tt")tt_hat(ctx,P.hat,P.hatC);};
function tt_mimeFace(ctx,P,E,po){const fx=po.turn*7,ly=po.look*3,mw=E.mw/2,my=27+ly*0.5,mx=fx*1.1;ctx.save();ctx.lineCap="round";ctx.strokeStyle="rgba(26,24,30,0.9)";ctx.lineWidth=2.6;
  for(const s of [-1,1]){const ex=s*15+fx,ey=-5+ly;ctx.beginPath();ctx.moveTo(ex,ey-21);ctx.lineTo(ex,ey-12);ctx.moveTo(ex,ey+9);ctx.lineTo(ex,ey+17);ctx.stroke();}
  ctx.strokeStyle="rgba(194,46,52,0.92)";if(E.open>0){ctx.lineWidth=3.4;ctx.beginPath();ctx.moveTo(mx-mw,my);ctx.quadraticCurveTo(mx,my+E.smile*3,mx+mw,my);ctx.quadraticCurveTo(mx,my+E.smile*6+E.open*14,mx-mw,my);ctx.closePath();ctx.stroke();}
  else{ctx.lineWidth=5.6;ctx.beginPath();ctx.moveTo(mx-mw,my-E.smile*1.5);ctx.quadraticCurveTo(mx,my+E.smile*6,mx+mw,my-E.smile*1.5);ctx.stroke();}ctx.restore();}
function tt_hat(ctx,h,c){c=c||[60,60,66];const dk=darken(c,0.45);
  if(h==="ttCap"){ctx.beginPath();ctx.moveTo(-46,-44);ctx.lineTo(-50,-62);ctx.quadraticCurveTo(-60,-86,0,-90);ctx.quadraticCurveTo(60,-86,50,-62);ctx.lineTo(46,-44);ctx.closePath();litFill(ctx,c,-60,-90,60,-44);seam(ctx,c,0.5);
    ctx.fillStyle=rgba(darken(c,0.25),1);ctx.fillRect(-47,-60,94,14);ctx.beginPath();ctx.moveTo(-44,-46);ctx.quadraticCurveTo(0,-26,44,-46);ctx.quadraticCurveTo(0,-38,-44,-46);ctx.closePath();ctx.fillStyle=rgba([30,30,34],1);ctx.fill();}
  if(h==="ttBowler"){ctx.beginPath();ctx.ellipse(0,-50,60,11,0,0,TAU);litFill(ctx,c,-60,-61,60,-39);seam(ctx,c,0.5);ctx.beginPath();ctx.moveTo(-38,-52);ctx.bezierCurveTo(-42,-104,42,-104,38,-52);ctx.quadraticCurveTo(0,-44,-38,-52);ctx.closePath();
    litFill(ctx,c,-42,-104,42,-46);seam(ctx,c,0.5);ctx.fillStyle=rgba(dk,1);ctx.beginPath();ctx.moveTo(-38,-60);ctx.quadraticCurveTo(0,-52,38,-60);ctx.lineTo(38,-52);ctx.quadraticCurveTo(0,-44,-38,-52);ctx.closePath();ctx.fill();}
  if(h==="ttBeret"){ctx.beginPath();ctx.ellipse(10,-62,56,18,-0.16,0,TAU);litFill(ctx,c,-50,-80,66,-44);seam(ctx,c,0.45);ctx.beginPath();ctx.ellipse(12,-80,4,6,0,0,TAU);ctx.fillStyle=rgba(c,1);ctx.fill();}
  if(h==="ttFlat"){ctx.beginPath();ctx.moveTo(-46,-36);ctx.bezierCurveTo(-52,-82,44,-90,50,-50);ctx.lineTo(48,-38);ctx.quadraticCurveTo(0,-50,-46,-36);ctx.closePath();litFill(ctx,c,-52,-88,50,-36);seam(ctx,c,0.45);
    ctx.beginPath();ctx.moveTo(-40,-40);ctx.quadraticCurveTo(0,-26,44,-40);ctx.quadraticCurveTo(0,-34,-40,-40);ctx.closePath();ctx.fillStyle=rgba(dk,1);ctx.fill();}}
const tt_torso0=torso;
torso=function(ctx,P,br,sh){tt_torso0(ctx,P,br,sh);if(!P.braces)return;const y0=-448+br;ctx.save();ctx.strokeStyle=rgba(P.braces,0.95);ctx.lineWidth=7;ctx.lineCap="butt";
  for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(s*30,y0+6);ctx.quadraticCurveTo(s*28+sh*0.2,-350,s*22+sh*0.5,-258);ctx.stroke();}ctx.restore();};
// a pose with both palms open: the left arm drawn as the right one, mirrored
const tt_arm0=arm;
arm=function(ctx,P,s,a,br,po){if(s===-1&&po.both){ctx.save();ctx.scale(-1,1);tt_arm0(ctx,P,1,a,br,po);ctx.restore();return;}return tt_arm0(ctx,P,s,a,br,po);};
// a notebook shut, held in front in both hands
function tt_heldShut(cx,P_,hands){const [l,r]=hands,mx=(l[0]+r[0])/2,my=(l[1]+r[1])/2;cx.save();cx.translate(mx,my+6);cx.rotate(-0.06);cx.fillStyle=rgba(GV_HOLD.teal,1);rr(cx,-60,-48,120,96,8);cx.fill();
  cx.fillStyle=rgba(darken(GV_HOLD.teal,0.3),1);cx.fillRect(-60,-48,14,96);cx.restore();fingers(cx,P_,[[mx-60,my+12],[mx+60,my+8]]);}
// a shopping bag in the hand, hanging
function tt_heldBag(col){return(cx,P_,hands)=>{const h=hands[1];cx.save();cx.translate(h[0],h[1]);cx.strokeStyle=rgba(darken(col,0.3),1);cx.lineWidth=5;cx.beginPath();cx.moveTo(-22,34);cx.quadraticCurveTo(-18,-6,0,-6);cx.quadraticCurveTo(18,-6,22,34);cx.stroke();
  cx.beginPath();cx.moveTo(-40,30);cx.lineTo(40,30);cx.lineTo(46,150);cx.lineTo(-46,150);cx.closePath();litFill(cx,col,-46,30,46,150);seam(cx,col,0.5);
  cx.fillStyle=rgba([214,170,90],1);cx.beginPath();cx.ellipse(-12,30,18,9,0,0,TAU);cx.fill();cx.fillStyle=rgba([120,150,100],1);cx.beginPath();cx.ellipse(14,26,12,12,0,0,TAU);cx.fill();cx.restore();fingers(cx,P_,[h]);};}

// the series' person (its shared people.js), able to do two things more: bow (o.bow, 0 to 1: the body above the hips leans towards us, so
// it looks shorter and the head comes down) and nod (o.pitch, 0 to 1: the head dips). Without them it is the series' person
function tt_person(ctx,id,x,y,s,o){o=o||{};const b=o.bow||0,pt=o.pitch||0;if(b<=0.001&&pt<=0.001)return person(ctx,id,x,y,s,o);
  const P_=PEOPLE[id],po=blendPose(POSE[o.pose||"stand"],POSE[o.pose2],o.mix),E=o.E||EXPR[o.expr||"calm"],t=o.t||0,k=s*P_.build.h,br=Math.sin(t*1.7+P_.seed)*1.4,front=a=>Math.abs(a[1])>Math.PI*0.55;
  if(!WC_RAW&&o.shadow!==false){ctx.save();ctx.translate(x,y);ctx.scale(k,k);const g=ctx.createRadialGradient(0,-4,4,0,-4,110);g.addColorStop(0,rgba([90,80,96],0.22));g.addColorStop(1,rgba([90,80,96],0));
    ctx.fillStyle=g;ell(ctx,0,-4,110,17);ctx.fill();ctx.restore();}
  outlined(ctx,cx=>{if(o.flip)cx.scale(-1,1);legs(cx,P_,po);cx.save();cx.translate(0,-292);cx.scale(1+0.05*b,1-0.3*b);cx.translate(0,292);
    if(!front(po.L))arm(cx,P_,-1,po.L,br,po);if(!front(po.R))arm(cx,P_,1,po.R,br,po);
    limb(cx,[[0,-470+br],[0,-440+br]],30,30,darken(P_.skin,0.12),[-20,-470,20,-440]);torso(cx,P_,br,po.shift);
    cx.save();cx.translate(po.shift*0.2,-452+br);cx.rotate(po.tilt+(o.nod||0));cx.translate(0,-50+po.look*2+9*pt);cx.scale(1,(1-0.1*b-0.08*pt)/(1-0.3*b));head(cx,P_,E,Object.assign({},po,{look:Math.max(po.look,pt)}),t);cx.restore();
    const hands=()=>[handAt(P_,-1,po.L,br),handAt(P_,1,po.R,br)];
    if(front(po.L))arm(cx,P_,-1,po.L,br,po);if(front(po.R))arm(cx,P_,1,po.R,br,po);
    if(o.carry){if(o.flip)cx.scale(-1,1);o.carry(cx,P_,o.flip?hands().map(h=>[-h[0],h[1]]):hands());if(o.flip)cx.scale(-1,1);}cx.restore();},
    x,y,k,P_.edge,[o.wide?-400:-250,P_.hat?-720:-650,o.wide?400:250,10],o.glow);}
// several poses at once, for someone going from one thing to the next: each [name, weight] blended over the ones before it, from standing.
// Kept under key (one per person) for this frame's drawing
function tt_mix(key,list){let po=POSE.stand;for(const [n,w] of list)if(w>0.001)po=blendPose(po,POSE[n],Math.min(1,w));POSE[key]=po;return key;}
// a person of the crossing standing at (X, d), on the pavement (0.15 m up) or the road; drawn at a size rounded to a step and scaled the
// rest of the way, so someone walking towards us doesn't need a new canvas every frame. o.bob lifts them (metres), o.umbrella opens one
// over them, o.marks draws what they're doing (whistling, clapping) above them; other options go to the series' person
function tt_who(ctx,c,id,X,d,o){o=o||{};if(c.d0+d<0.8)return;const Y=o.Y==null?(d>TT_ST.far-0.1||d<0.1?0.15:0):o.Y,p=tt_pr(c,X,d,Y),s=p[2]*1.7/560;if(p[0]<-300||p[0]>W+300)return;
  const q=Math.max(0.04,Math.round(s/0.016)*0.016),r=s/q,x=p[0],y=p[1]-(o.bob||0)*p[2];ctx.save();ctx.translate(x,y);ctx.scale(r,r);tt_person(ctx,id,0,0,q,o);ctx.restore();
  const k=s*PEOPLE[id].build.h;if(o.umbrella)tt_umbrellaOver(ctx,PEOPLE[id],x,y,k,o.umbrella,o);if(o.marks)o.marks(ctx,x,y,k);}
// an umbrella over someone, from their right hand: a dome of cloth with its ribs, on a dark shaft
function tt_umbrellaOver(ctx,P,x,y,k,col,o){const po=blendPose(POSE[o.pose||"stand"],POSE[o.pose2],o.mix),h=handAt(P,1,po.R,0),hx=x+(o.flip?-h[0]:h[0])*k,hy=y+h[1]*k,tx=x+(o.flip?-30:30)*k,ty=y-700*k;
  ctx.save();ctx.strokeStyle=rgba([44,40,40],0.95);ctx.lineWidth=Math.max(1.2,7*k);ctx.lineCap="round";ctx.beginPath();ctx.moveTo(hx,hy+14*k);ctx.lineTo(tx,ty-26*k);ctx.stroke();ctx.restore();
  const R_=190*k,pts=[];for(let i=0;i<=24;i++){const a=Math.PI+i/24*Math.PI;pts.push([tx+Math.cos(a)*R_,ty+Math.sin(a)*R_*0.5]);}for(let i=8;i>=0;i--){const u=i/8;pts.push([tx-R_+2*R_*u,ty+R_*0.08*Math.sin(u*Math.PI*8)**2]);}
  wc_wash(ctx,pts,col,{kind:"thing",lw:1.2,seed:P.seed});ctx.save();ctx.strokeStyle=rgba(wc_dim(col,0.35),0.6);ctx.lineWidth=Math.max(1,2.4*k);for(const u of [-0.5,0,0.5]){ctx.beginPath();ctx.moveTo(tx,ty-R_*0.5);ctx.quadraticCurveTo(tx+u*R_*0.7,ty-R_*0.42,tx+u*R_,ty);ctx.stroke();}ctx.restore();}
// a whistle: small curved strokes rising from the mouth, in pencil, each fading as it rises (u: 0 to 1 through the whistle)
function tt_whistleMarks(ctx,x,y,k,t,a){if(a<=0.01)return;const q=Math.max(k,0.32),mx=x+8*k,my=y-478*k;ctx.save();ctx.lineCap="round";ctx.lineWidth=Math.max(2.4,6*q);
  for(let i=0;i<3;i++){const u=((t*1.4+i/3)%1),r=(40+u*90)*q;ctx.strokeStyle=rgba(WC_PENCIL,a*0.9*(1-u*0.8));ctx.beginPath();ctx.arc(mx+20*q+u*50*q,my-u*110*q,r,-1.1,-0.2);ctx.stroke();}ctx.restore();}
// a clap: short strokes flying out from the hands as they meet, above the head
function tt_clapMarks(ctx,x,y,k,e,a){if(a<=0.01||e<=0.01)return;const q=Math.max(k,0.32),cx=x,cy=y-600*k;ctx.save();ctx.lineCap="round";ctx.lineWidth=Math.max(2.2,5*q);ctx.strokeStyle=rgba(WC_PENCIL,a*e*0.9);
  for(const an of [-2.4,-1.57,-0.74]){const r0=(50+24*(1-e))*q,r1=r0+50*q;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*r0,cy+Math.sin(an)*r0);ctx.lineTo(cx+Math.cos(an)*r1,cy+Math.sin(an)*r1);ctx.stroke();}ctx.restore();}
// a driver at the wheel, seen through the car's far window: the person drawn with their head under the roof, kd pixels a metre
function tt_driver(id,o){return(ctx,x,y,kd)=>{const s=kd*1.7/560,q=Math.max(0.04,Math.round(s/0.016)*0.016),r=s/q;ctx.save();ctx.translate(x,y+1.42*kd);ctx.scale(r,r);tt_person(ctx,id,0,0,q,Object.assign({shadow:false},o));ctx.restore();};}

/* ---------- Bogotá: moving ---------- */
// a ramp from 0 to 1 that speeds up over the first a of the way and slows down over the last a
const tt_ramp=(u,a)=>u<=0?0:u>=1?1:u<a?u*u/(2*a*(1-a)):u>1-a?1-(1-u)*(1-u)/(2*a*(1-a)):(u-a/2)/(1-a);
// someone walking a path of points (X, d) at v metres a second from t0: where they are, their step's swing and bob, when they arrive,
// and which way they face (people face us; walking mostly sideways, they turn the way they go)
function tt_path(t,t0,pts,v){let L=0;const seg=[];for(let i=1;i<pts.length;i++){const l=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(l);L+=l;}
  const T_=Math.max(0.2,L/v),a=Math.min(0.3,0.35/T_),u=clamp((t-t0)/T_,0,1),s=L*tt_ramp(u,a),moving=u>0&&u<1;let left=s,i=0;while(i<seg.length-1&&left>seg[i]){left-=seg[i];i++;}
  const A=pts[i],B=pts[Math.min(i+1,pts.length-1)],k=seg[i]?clamp(left/seg[i],0,1):0,ph=s/0.7*Math.PI,amp=moving?Math.min(1,Math.min(u,1-u)*T_*2.5):0;
  return{X:lerp(A[0],B[0],k),d:lerp(A[1],B[1],k),moving,swing:Math.sin(ph)*amp,bob:Math.abs(Math.sin(ph))*0.022*amp,end:t0+T_,flip:Math.abs(B[0]-A[0])>Math.abs(B[1]-A[1])*0.7&&B[0]<A[0]};}
// a walker drawn: arms swinging while they move (o.keep: a pose held, an umbrella say, and only the bob)
function tt_walker(ctx,c,id,w,o){o=o||{};const m=w.moving&&!o.keep?{pose2:w.swing>0?"walkA":"walkB",mix:Math.abs(w.swing)}:{};tt_who(ctx,c,id,w.X,w.d,Object.assign({bob:w.bob},o,m,w.moving?{flip:w.flip}:{}));}
// a car along the avenue at t: it rolls up from v metres a second and stops with its back at X1 by t1 (over Ta seconds); then each move
// [t0, t1, X] eases it to X, and [t0, "go"] drives it off. Returns where its back is, how far its wheels have turned, and its lamps
function tt_drive(t,c){const Ta=c.Ta||2.4,D=c.v*Ta/2;let X,vel;
  if(c.pass){X=c.X1+c.v*(t-c.t1);vel=c.v;return{X,wheel:X,brake:0,reverse:0};}
  if(t<c.t1-Ta){X=c.X1-D-c.v*(c.t1-Ta-t);vel=c.v;}else if(t<c.t1){const u=(t-(c.t1-Ta))/Ta;X=c.X1-D*(1-u)*(1-u);vel=2*D*(1-u)/Ta;}else{X=c.X1;vel=0;}
  let go=false;for(const m of c.moves||[]){if(t<m[0])break;if(m[1]==="go"){const dt=t-m[0];X+=1.3*dt*dt;vel=2.6*dt;go=true;break;}const u=clamp((t-m[0])/(m[1]-m[0]),0,1),X0=X;X=lerp(X0,m[2],ease(u));
    vel=u>0&&u<1?(m[2]-X0)/(m[1]-m[0]):0;}
  return{X,wheel:X,brake:!go&&vel>=0&&vel<3.5&&t>c.t1-Ta*0.8?1:0,reverse:vel<-0.05?1:0};}
// the signal's lamp at t, from a list of [time, lamp]: the latest change passed, with a quick fade between
function tt_lampAt(t,L){let i=0;for(let k=1;k<L.length;k++)if(t>=L[k][0])i=k;return{lamp:L[i][1],a:i>0?clamp((t-L[i][0])/0.12,0,1):1};}

// the street's moving things drawn, the furthest first: cars as {m, col, X, d, o} and people as {id, X, d, o, walk, a} (a: how much
// they've faded in, for people who come from far off)
function tt_drawWorld(ctx,c,Wd){ctx.save();if(Wd.lamp)tt_signal(ctx,c,Wd.lamp.lamp,Wd.lamp.a);
  const one=q=>q.walk?tt_walker(ctx,c,q.id,q.walk,q.o):tt_who(ctx,c,q.id,q.X,q.d,q.o);
  const all=Wd.cars.map(k=>({z:k.d+0.4,f:()=>tt_car(ctx,c,k.m,k.col,k.X,k.d,k.o)})).concat(Wd.people.filter(q=>q.a==null||q.a>0.01).map(q=>({z:q.d,f:()=>q.a!=null&&q.a<1?withA(ctx,q.a,()=>one(q)):one(q)})));
  all.sort((a,b)=>b.z-a.z).forEach(a=>a.f());ctx.restore();}

/* the whole street, painted once for each camera and year */
function tt_paintBogota(ctx,c,o){o=o||{};tt_sky(ctx,c,o.year===2012?12:5);tt_city(ctx,c);tt_hills(ctx,c);tt_streetEnd(ctx,c);
  tt_ground(ctx,c,o);
  // the side street's buildings, far end first, then the two on the corners
  TT_ROWL.forEach((b,i)=>tt_rowBlock(ctx,c,-1,b,i));TT_ROWR.forEach((b,i)=>tt_rowBlock(ctx,c,1,b,i+20));
  tt_wires(ctx,c);tt_cornerR(ctx,c);tt_cornerL(ctx,c);
  // the far pavement's things: lamps, a tree, the signal
  tt_lamp(ctx,c,-8.5,14.6,7.4);tt_lamp(ctx,c,12.6,14.6,7.4);tt_tree(ctx,c,-12.5,15.6,7.6);tt_signalPole(ctx,c);}

const WC_PLACES={bogota:c=>tt_paintBogota(c,TT_CAM.wide,{year:1995}),bogotaMid:c=>tt_paintBogota(c,TT_CAM.mid,{year:1995}),bogota12:c=>tt_paintBogota(c,TT_CAM.wide,{year:2012})};
