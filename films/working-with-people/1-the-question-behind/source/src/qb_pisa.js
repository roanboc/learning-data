/* ===== The question behind the request: Pisa, 1990 to 2001 =====
   The film's own pictures for its opening story (prefix qb_). The module's kit draws the rooms, the people, the sheets and the things in
   them, and is never changed for this film; what is here is this film's alone. Checked against two open primary papers (the script's
   Rigour): Burland, Jamiolkowski and Viggiani, "Leaning Tower of Pisa: behaviour after stabilization operations", International Journal
   of Geoengineering Case Histories 1(3), 2009; and Jamiolkowski's Terzaghi Oration, 2001.
     qbPiazza                          the piazza on a clear day: a pale sky, the hills beyond the city, the old city's roofs, a lawn in a
                                       quiet grey olive (green means done in these films), and the pale stone ring round the tower's foot
     qbCommittee                       a room in 1990 where the committee meets, in the morning
     QB_BASE, QB_PK                    where the tower stands in the piazza (the middle of its foot at ground level), and its size there,
                                       in px a metre
     qb_tower(ctx, x, y, k, lean, o)   the bell tower as built: the tall ground floor's blind arches, six open galleries of columns and
                                       arches, the narrower bell chamber on top, white marble lit from the right; its foot's middle at
                                       (x, y), k px a metre, leaning lean degrees to the right (south: the viewer looks east); o.a.
                                       Painted once, upright, at 24 px a metre, then laid at its lean, so the camera can go close
     qb_shadow(ctx, x, y, k, a)        its shadow on the lawn, falling to the left
     qb_ground(ctx, o)                 the ground under the tower cut open, as an engineer's section: the soft silts and clays, the
                                       foundation, the lead on the north side, the drills under it, the soil drawn out (o: a, lean, lead,
                                       drills, soil, risk, labels)
     qb_axis(ctx, o)                   the tower's lean as a line from its foot to its top, and the target half a degree back (o: a, from,
                                       to, arc)
     qb_footing(ctx, x, y, o)          the test footing, a concrete block with its own drills, turning by a quarter of a degree
     qb_visitors(ctx, t, o)            visitors back on the lawn: people of the module's crowd, looking up at the tower
     qb_note(ctx, x, y, w, o)          the engineer's signed note: how the tower moved yesterday, what to take out today, signed
     qb_print(ctx, x, y, w, o)         the tower in a frame on the team room's wall, at the end
   Colour keeps the module's meaning: amber the danger (the lean, the soft ground under the leaning side), blue the plan (the target, the
   method, the daily note), green what was done; the marble, the lawn, the sky and the city carry none. */

/* ---------------------------------------------------------------- the piazza, and the committee's room */
const QB_BASE=[960,724],QB_PK=10.5,QB_LEAN0=5.2,QB_LEAN1=4.7;
const QB_MARBLE=[236,231,219],QB_LAWN=[132,134,108],QB_STONE=[214,204,186];
function qb_paintPiazza(c){const gy=QB_BASE[1];
  // the sky: pale at the horizon, a clear Tuscan blue above, a few thin clouds
  let g=c.createLinearGradient(0,0,0,gy);g.addColorStop(0,"rgb(146,176,204)");g.addColorStop(0.55,"rgb(192,208,220)");g.addColorStop(1,"rgb(236,230,214)");c.fillStyle=g;c.fillRect(0,0,W,gy+4);
  c.save();c.filter="blur(26px)";c.fillStyle="rgba(255,252,246,0.55)";for(const [x,y,rx,ry] of [[300,190,260,30],[1520,140,300,34],[1120,300,220,22],[520,380,180,18]]){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill();}c.restore();
  // the hills beyond the city, hazy
  c.fillStyle="rgb(170,176,184)";c.beginPath();c.moveTo(0,gy-60);
  for(let x=0;x<=W;x+=24){const y=gy-70-40*LP_NZ.fbm(x*0.0016+3,1.7,3)-50*Math.max(0,Math.sin((x-1180)/520))*(x>900?1:0);c.lineTo(x,y);}c.lineTo(W,gy);c.lineTo(0,gy);c.closePath();c.fill();
  g=c.createLinearGradient(0,gy-160,0,gy);g.addColorStop(0,"rgba(236,230,214,0)");g.addColorStop(1,"rgba(236,230,214,0.55)");c.fillStyle=g;c.fillRect(0,gy-160,W,160);
  // the old city beyond the piazza, hazy with distance: plaster in ochre and cream, roofs of red-brown tiles, a few towers far off
  const haze=col=>rgba(mix(col,[226,226,220],0.38),1),R=ag_rnd(91);
  for(const [tx,tw,th] of [[300,26,120],[1290,22,96],[1640,30,70]]){c.fillStyle=haze([206,186,156]);c.fillRect(tx,gy-14-th,tw,th);c.fillStyle=haze([160,100,76]);c.beginPath();c.moveTo(tx-3,gy-14-th);c.lineTo(tx+tw/2,gy-30-th);c.lineTo(tx+tw+3,gy-14-th);c.closePath();c.fill();
    c.fillStyle="rgba(80,70,64,0.3)";c.fillRect(tx+tw*0.3,gy-th+4,tw*0.4,12);}
  let x=-30;while(x<W+30){const w=40+R()*80,h=16+R()*30,top=gy-12-h,wc=[[222,196,156],[214,184,148],[232,216,190],[204,170,136],[226,206,170]][(R()*5)|0];
    c.fillStyle=haze(mix(wc,[40,30,30],0.04*R()));c.fillRect(x,top,w,h+14);
    // a hipped roof of tiles, its ridge short
    const rh=5+R()*6;c.fillStyle=haze([168,98,72]);c.beginPath();c.moveTo(x-3,top+1);c.lineTo(x+w*0.3,top-rh);c.lineTo(x+w*0.7,top-rh);c.lineTo(x+w+3,top+1);c.closePath();c.fill();
    c.fillStyle="rgba(100,84,74,0.25)";for(let wx=x+8;wx<x+w-10;wx+=16+R()*6)c.fillRect(wx,top+7,4,6);
    x+=w-2;}
  // trees of the piazza's edge, in grey olive: stone pines, their canopies flat on bare trunks, and dark cypresses
  const pine=(px,s)=>{c.strokeStyle="rgb(98,86,72)";c.lineWidth=5*s;c.lineCap="round";c.beginPath();c.moveTo(px,gy-6);c.quadraticCurveTo(px+6*s,gy-60*s,px+2*s,gy-104*s);c.stroke();
    for(const [dx,dy,rx,ry,col] of [[0,-112,62,18,[118,122,100]],[-34,-108,34,14,[126,130,108]],[30,-116,40,15,[134,138,114]],[6,-124,36,12,[150,152,128]]]){c.fillStyle=rgba(col,1);c.beginPath();c.ellipse(px+dx*s,gy+dy*s,rx*s,ry*s,0,0,TAU);c.fill();}};
  const cypress=(px,s)=>{c.fillStyle="rgb(96,100,84)";c.beginPath();c.moveTo(px,gy-8);c.quadraticCurveTo(px-14*s,gy-50*s,px,gy-120*s);c.quadraticCurveTo(px+14*s,gy-50*s,px,gy-8);c.closePath();c.fill();
    c.fillStyle="rgba(150,152,128,0.5)";c.beginPath();c.moveTo(px+2*s,gy-20*s);c.quadraticCurveTo(px+10*s,gy-60*s,px+1*s,gy-110*s);c.quadraticCurveTo(px+6*s,gy-60*s,px+2*s,gy-20*s);c.closePath();c.fill();};
  for(const [px,s] of [[150,1.1],[560,0.8],[1520,0.9],[1800,1.15]])pine(px,s);
  for(const [px,s] of [[420,0.9],[452,0.75],[1380,0.8],[1660,1.0]])cypress(px,s);
  // the lawn, mown, in a grey olive that means nothing, a little lighter far off
  g=c.createLinearGradient(0,gy,0,H);g.addColorStop(0,rgba(mix(QB_LAWN,[236,230,214],0.25),1));g.addColorStop(0.3,rgba(QB_LAWN,1));g.addColorStop(1,rgba(mix(QB_LAWN,[40,40,30],0.25),1));c.fillStyle=g;c.fillRect(0,gy,W,H-gy);
  const img=c.getImageData(0,gy,W,H-gy),d=img.data;for(let j=0;j<H-gy;j++)for(let i=0;i<W;i++){const n=(LP_NZ.fbm(i*0.02,j*0.08+i*0.003,3)-0.5)*16+(i%9===0?-1.5:0),q=(j*W+i)*4;d[q]+=n;d[q+1]+=n;d[q+2]+=n*0.8;}c.putImageData(img,0,gy);
  // the pale stone ring round the tower's foot, and a path across the lawn
  c.fillStyle=rgba(QB_STONE,1);c.beginPath();c.ellipse(QB_BASE[0],gy+10,190,26,0,0,TAU);c.fill();
  c.fillStyle=rgba(mix(QB_STONE,[90,80,70],0.25),1);c.beginPath();c.ellipse(QB_BASE[0],gy+6,150,17,0,0,TAU);c.fill();
  g=c.createLinearGradient(0,gy+40,0,gy+70);g.addColorStop(0,rgba(QB_STONE,0.85));g.addColorStop(1,rgba(mix(QB_STONE,QB_LAWN,0.3),0.85));c.fillStyle=g;c.fillRect(0,gy+44,W,22);
  // the light: a soft shade on the left, the sun on the right
  g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(52,44,52,0.16)");g.addColorStop(0.5,"rgba(52,44,52,0)");g.addColorStop(1,"rgba(255,214,150,0.06)");c.fillStyle=g;c.fillRect(0,0,W,H);}
AG_PLACES.qbPiazza=c=>qb_paintPiazza(c);
AG_PLACES.qbCommittee=c=>lp_paintRoom(c,{light:"morning",seed:11,base:[226,214,198]});

/* ---------------------------------------------------------------- the tower
   In metres, as built: about 56 m tall and 15.5 m across; the ground floor 11 m, its fifteen blind arches round it; six open galleries,
   each of thirty columns and arches round it, about 6.2 m a floor; the bell chamber, narrower, 7.3 m. Seen from the west, so its lean
   to the south is to the right; lit from the right, as every place in these films is. */
const QB_TK=24,QB_PLINTH=2.4,QB_TW={R:7.75,ground:11.0,floor:6.15,floors:6,bell:7.3,bellR:4.9,gal:1.5};
function qb_lit(th){return 0.36+0.64*Math.max(0,Math.cos(th-0.6));}
// a cylinder's light across it, as a gradient: radius r (px), its middle at cx; col the marble's colour; dark multiplies it
function qb_cylGrad(c,cx,r,col,dark){const g=c.createLinearGradient(cx-r,0,cx+r,0);
  for(let i=0;i<=24;i++){const u=i/24,th=Math.asin(clamp(u*2-1,-1,1)),L=qb_lit(th)*(dark||1),sh=mix([96,92,100],col,clamp(L,0,1)),hi=L>1?mix(col,[255,252,244],L-1):sh;g.addColorStop(u,rgba(hi,1));}
  return g;}
function qb_towerPaint(c,w,h){const k=QB_TK,T=QB_TW,cx=w/2,base=h-8-QB_PLINTH*k,R=T.R*k,Y=m=>base-m*k,M=QB_MARBLE;
  const X=(r,th)=>cx+r*Math.sin(th);
  const band=(r,m0,m1,dark,col)=>{c.fillStyle=qb_cylGrad(c,cx,r,col||M,dark);c.fillRect(cx-r,Y(m1),2*r,Y(m0)-Y(m1));};
  const courses=(r,m0,m1)=>{c.save();c.strokeStyle="rgba(90,80,70,0.07)";c.lineWidth=1.2;for(let m=m0+0.55;m<m1;m+=0.55){c.beginPath();c.moveTo(cx-r,Y(m));c.lineTo(cx+r,Y(m));c.stroke();}c.restore();};
  const cornice=(r,m,th)=>{const rr2=r+0.32*k;band(rr2,m,m+th,1.06);c.fillStyle="rgba(255,252,244,0.55)";c.fillRect(cx-rr2,Y(m+th),2*rr2,1.6);
    const g=c.createLinearGradient(0,Y(m),0,Y(m)+0.5*k);g.addColorStop(0,"rgba(60,50,46,0.28)");g.addColorStop(1,"rgba(60,50,46,0)");c.fillStyle=g;c.fillRect(cx-r,Y(m),2*r,0.5*k);};
  // columns or arches round a cylinder: the angles of those that face us, from the left edge to the right
  const around=(n,ph)=>{const out=[];for(let j=0;j<n;j++){const th=((ph+j*TAU/n+Math.PI)%TAU)-Math.PI;if(Math.cos(th)>0.02)out.push(th);}return out.sort((a,b)=>a-b);};
  // ---- the plinth, down in the stone ring round the foot, in its shade; then the ground floor: a wall with fifteen blind arches round
  // it on half-columns, a lozenge in each arch
  band(R+0.25*k,-QB_PLINTH,0.35,0.78);c.fillStyle="rgba(255,250,240,0.35)";c.fillRect(cx-R-0.25*k,Y(0.35),2*R+0.5*k,1.4);
  band(R,0.35,T.ground,1.0);courses(R,0,T.ground);
  const g0=around(15,0.21);
  for(let i=0;i<g0.length-1;i++){const a=g0[i],b=g0[i+1],xa=X(R,a),xb=X(R,b),mid=(a+b)/2,cw=(xb-xa),sp=Y(8.6),top=Y(10.1);
    // the arch, a little recessed: its panel a shade darker, its rim light on the right
    c.save();c.beginPath();c.moveTo(xa+cw*0.1,Y(0.6));c.lineTo(xa+cw*0.1,sp);c.ellipse((xa+xb)/2,sp,cw*0.4,sp-top,0,Math.PI,0);c.lineTo(xb-cw*0.1,Y(0.6));c.closePath();
    c.fillStyle=rgba(mix([96,92,100],M,qb_lit(mid)*0.86),1);c.fill();c.strokeStyle="rgba(255,250,240,"+(0.25+0.4*Math.max(0,Math.sin(mid)))+")";c.lineWidth=2;c.stroke();c.restore();
    // the lozenge in the arch's head, in a greyer marble
    const lx=(xa+xb)/2,ly=Y(9.2),lw=cw*0.13,lh=0.55*k;c.fillStyle=rgba(mix([120,118,124],M,0.55*qb_lit(mid)),1);c.beginPath();c.moveTo(lx,ly-lh);c.lineTo(lx+lw,ly);c.lineTo(lx,ly+lh);c.lineTo(lx-lw,ly);c.closePath();c.fill();}
  for(const th of g0){const x=X(R+0.18*k,th),cw=Math.max(2,0.75*k*Math.cos(th));c.fillStyle=rgba(mix([96,92,100],M,qb_lit(th)*1.04),1);c.fillRect(x-cw/2,Y(8.7),cw,Y(0.5)-Y(8.7));
    c.fillStyle="rgba(255,252,244,0.4)";c.fillRect(x-cw/2,Y(8.9),cw,0.25*k);}
  // the patina low down, where the ground's damp reaches
  let g=c.createLinearGradient(0,Y(4),0,Y(0));g.addColorStop(0,"rgba(110,94,74,0)");g.addColorStop(1,"rgba(110,94,74,0.22)");c.fillStyle=g;c.fillRect(cx-R,Y(4),2*R,4*k);
  cornice(R,T.ground,0.45);
  // ---- six open galleries: the inner wall in the gallery's shade, the arcade in front, a cornice over each
  const rin=R-T.gal*k;
  for(let f=0;f<T.floors;f++){const m0=T.ground+0.45+f*T.floor,m1=m0+T.floor-0.45,spring=m0+4.0,apex=m0+4.9;
    // the gallery's floor edge, the inner wall behind the columns in shade (its doors darker), the spandrels over the arches
    band(R,m0,m0+0.32,1.0);band(rin,m0+0.32,m1,0.48);
    for(const th of around(10,0.4+f*0.3)){const x=X(rin,th),dw=0.9*k*Math.cos(th);c.fillStyle="rgba(40,34,36,0.35)";c.fillRect(x-dw/2,Y(m0+2.9),dw,2.6*k);}
    const cols=around(30,0.11+f*0.07);
    c.save();c.beginPath();c.rect(cx-R,Y(m1),2*R,Y(spring-0.2)-Y(m1));
    // the arches' openings cut out of the spandrel band (evenodd)
    for(let i=0;i<cols.length-1;i++){const xa=X(R,cols[i]),xb=X(R,cols[i+1]),mx=(xa+xb)/2,rx=(xb-xa)/2;c.moveTo(xa,Y(spring-0.2));c.lineTo(xa,Y(spring));c.ellipse(mx,Y(spring),rx,(apex-spring)*k,0,Math.PI,0);c.lineTo(xb,Y(spring-0.2));c.closePath();}
    c.clip("evenodd");band(R,spring-0.2,m1,1.0);courses(R,spring,m1);c.restore();
    // the arches' rims: a thin light line on the side the sun reaches
    c.save();c.lineWidth=1.4;for(let i=0;i<cols.length-1;i++){const xa=X(R,cols[i]),xb=X(R,cols[i+1]),mx=(xa+xb)/2,rx=(xb-xa)/2,th=(cols[i]+cols[i+1])/2;
      c.strokeStyle="rgba(255,250,240,"+(0.18+0.4*Math.max(0,Math.cos(th-0.6)))+")";c.beginPath();c.ellipse(mx,Y(spring),Math.max(0.5,rx),(apex-spring)*k,0,Math.PI,0);c.stroke();}c.restore();
    // the columns, each lit as its own face of the cylinder, with a capital and a base
    for(const th of cols){const x=X(R,th),cw=Math.max(1.6,0.42*k*Math.cos(th)),L=qb_lit(th)*1.06;c.fillStyle=rgba(mix([96,92,100],M,clamp(L,0,1)),1);c.fillRect(x-cw/2,Y(spring),cw,Y(m0+0.32)-Y(spring));
      c.fillStyle=rgba(mix([96,92,100],M,clamp(L*1.04,0,1)),1);c.fillRect(x-cw*0.85,Y(spring+0.05),cw*1.7,0.32*k);c.fillRect(x-cw*0.75,Y(m0+0.62),cw*1.5,0.28*k);
      c.fillStyle="rgba(60,50,46,0.18)";c.fillRect(x-cw/2,Y(spring)+0.32*k,cw*0.3,Y(m0+0.62)-Y(spring)-0.32*k);}
    cornice(R,m1,0.45);}
  // ---- the bell chamber: narrower, its arched openings dark, a cornice and a low parapet on top
  const m0=T.ground+0.45+T.floors*T.floor,rb=T.bellR*k,mt=m0+T.bell;
  band(rb,m0,mt,1.0);courses(rb,m0,mt);
  for(const th of around(12,0.25)){const x=X(rb,th),ow=Math.max(1.5,1.25*k*Math.cos(th)),sp=Y(m0+4.6);c.fillStyle="rgba(46,40,44,0.86)";c.beginPath();c.moveTo(x-ow/2,Y(m0+1.2));c.lineTo(x-ow/2,sp);c.ellipse(x,sp,ow/2,0.75*k,0,Math.PI,0);c.lineTo(x+ow/2,Y(m0+1.2));c.closePath();c.fill();
    c.strokeStyle="rgba(255,250,240,"+(0.2+0.4*Math.max(0,Math.cos(th-0.6)))+")";c.lineWidth=1.4;c.stroke();}
  cornice(rb,mt-0.5,0.5);band(rb-0.2*k,mt,mt+0.6,1.0);
  // the terrace round the bell chamber: the last gallery's top, a low parapet
  band(R+0.1*k,m0-0.05,m0+0.5,1.04);
  // the whole tower: a warm light on the right edge, and the faint grey streaks of the marble
  g=c.createLinearGradient(cx-R,0,cx+R,0);g.addColorStop(0.7,"rgba(255,214,150,0)");g.addColorStop(0.95,"rgba(255,214,150,0.08)");c.save();c.globalCompositeOperation="source-atop";c.fillStyle=g;c.fillRect(0,0,w,h);
  const Rn=ag_rnd(17);c.fillStyle="rgba(120,116,122,0.05)";for(let i=0;i<40;i++){const yy=Rn()*h,xx=cx-R+Rn()*2*R;c.beginPath();c.ellipse(xx,yy,20+Rn()*50,2+Rn()*3,0,0,TAU);c.fill();}c.restore();}
function qb_towerPic(){const T=QB_TW,hm=T.ground+0.45+T.floors*T.floor+T.bell+0.6+QB_PLINTH;return ag_kept("qbTower",Math.ceil((T.R+0.6)*2*QB_TK),Math.ceil(hm*QB_TK)+10,(c,w,h)=>qb_towerPaint(c,w,h));}
// the tower at (x, y) (its foot's middle, at ground level), k px a metre, leaning lean degrees to the right
// (its plinth goes down into the stone ring round its foot: the ring's near rim hides it, at ring: [rx, ry] round (x, y + 6))
function qb_tower(ctx,x,y,k,lean,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const tw=qb_towerPic(),s=k/QB_TK,rg=o.ring||[150*k/QB_PK,17*k/QB_PK];ctx.save();ctx.globalAlpha*=a;
  ctx.beginPath();ctx.rect(x-60*k,y-80*k,120*k,80*k+6);ctx.ellipse(x,y+6,rg[0],rg[1],0,0,TAU);ctx.clip("nonzero");
  ctx.translate(x,y);ctx.rotate(lean*Math.PI/180);ctx.imageSmoothingQuality="high";ctx.drawImage(tw,-tw.width*s/2,-(tw.height-8-QB_PLINTH*QB_TK)*s,tw.width*s,tw.height*s);ctx.restore();}
// the top of the tower's axis, for lines and labels: where its top's middle is, at that lean
function qb_top(x,y,k,lean){const T=QB_TW,hm=T.ground+0.45+T.floors*T.floor+T.bell+0.6,r=lean*Math.PI/180;return[x+Math.sin(r)*hm*k,y-Math.cos(r)*hm*k];}
// its shadow on the lawn, to the left
function qb_shadow(ctx,x,y,k,a){if(a<=0)return;ctx.save();ctx.globalAlpha*=a;const g=ctx.createLinearGradient(x,0,x-46*k,0);g.addColorStop(0,"rgba(40,40,30,0.32)");g.addColorStop(1,"rgba(40,40,30,0)");
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x+QB_TW.R*k*0.8,y+8);ctx.lineTo(x-46*k,y+20);ctx.lineTo(x-46*k,y+34);ctx.lineTo(x+QB_TW.R*k*0.6,y+24);ctx.closePath();ctx.filter="blur(6px)";ctx.fill();ctx.restore();}

/* ---------------------------------------------------------------- the ground, cut open
   An engineer's section under the tower, in the place's coordinates: down from the lawn, the silts and sands of the top layer, then the
   soft marine clay. The tower's foundation, a ring about 3 m deep, turns with the tower. o: a; lean; risk (0 to 1: the ground under the
   leaning side in amber, the slightest disturbance there could bring it down); lead (0 to 1: the lead on the north side, stacked on its
   concrete ring); drills (0 to 1: the drills slanting in under the north side, in blue, the plan); soil (0 to 1: the soil drawn out,
   small loads coming up the drills); labels (0 to 1). */
const QB_CUT={x0:520,x1:1400};
function qb_ground(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const [bx,gy]=QB_BASE,k=QB_PK,lean=o.lean==null?QB_LEAN0:o.lean,R=QB_TW.R*k,x0=QB_CUT.x0,x1=QB_CUT.x1,yb=890;
  ctx.save();ctx.globalAlpha*=a;
  // the cut face: the top layer of silts and sands, banded, then the soft clay, darker
  ctx.save();ctx.beginPath();ctx.rect(x0,gy,x1-x0,yb-gy);ctx.clip();
  let g=ctx.createLinearGradient(0,gy,0,yb);g.addColorStop(0,"rgb(168,146,116)");g.addColorStop(0.55,"rgb(150,130,104)");g.addColorStop(0.62,"rgb(124,120,114)");g.addColorStop(1,"rgb(104,100,96)");ctx.fillStyle=g;ctx.fillRect(x0,gy,x1-x0,yb-gy);
  ctx.strokeStyle="rgba(80,66,52,0.25)";ctx.lineWidth=2;for(const yy of [gy+22,gy+48,gy+70,gy+96]){ctx.beginPath();ctx.moveTo(x0,yy);for(let xx=x0;xx<=x1;xx+=40)ctx.lineTo(xx,yy+Math.sin(xx*0.01+yy)*3);ctx.stroke();}
  // the leaning side's ground, at risk
  if(o.risk>0){g=ctx.createRadialGradient(bx+R*0.7,gy+20,10,bx+R*0.7,gy+30,190);g.addColorStop(0,rgba(LP.amber,0.55*o.risk));g.addColorStop(1,rgba(LP.amber,0));ctx.fillStyle=g;ctx.fillRect(x0,gy,x1-x0,yb-gy);}
  ctx.restore();
  // the cut's edges: a dark line round it, the lawn's edge on top
  ctx.strokeStyle="rgba(60,50,44,0.7)";ctx.lineWidth=3;ctx.strokeRect(x0,gy,x1-x0,yb-gy);
  // the foundation: a ring 3 m deep under the tower, turned with it
  ctx.save();ctx.translate(bx,gy);ctx.rotate(lean*Math.PI/180);ctx.fillStyle="rgb(206,198,184)";ctx.fillRect(-R-0.6*k,-6,2*R+1.2*k,3*k+6);ctx.strokeStyle="rgba(80,70,62,0.6)";ctx.lineWidth=2;ctx.strokeRect(-R-0.6*k,-6,2*R+1.2*k,3*k+6);
  ctx.fillStyle="rgb(172,164,150)";ctx.fillRect(-R+2.2*k,-6,2*R-4.4*k,3*k+6);ctx.restore();
  // the lead on the north side: a concrete ring round the foot, the ingots stacked on it
  if(o.lead>0){const lx=bx-R-4.4*k,u=ag_eo(o.lead);ctx.fillStyle="rgb(186,180,170)";ctx.fillRect(lx,gy-1.0*k,4.0*k,1.0*k);ctx.strokeStyle="rgba(70,62,56,0.5)";ctx.lineWidth=1.5;ctx.strokeRect(lx,gy-1.0*k,4.0*k,1.0*k);
    for(let row=0;row<5;row++){const ru=clamp(u*5-row,0,1);if(ru<=0)break;ctx.save();ctx.globalAlpha*=ru;for(let i=0;i<3;i++){const ix=lx+0.2*k+i*1.2*k,iy=gy-1.0*k-(row+1)*0.66*k;
      const gg=ctx.createLinearGradient(ix,iy,ix+1.1*k,iy+0.6*k);gg.addColorStop(0,"rgb(124,126,134)");gg.addColorStop(1,"rgb(74,76,84)");ctx.fillStyle=gg;ctx.fillRect(ix,iy,1.1*k,0.6*k);ctx.fillStyle="rgba(255,255,255,0.22)";ctx.fillRect(ix,iy,1.1*k,1.2);}ctx.restore();}}
  // the drills: slanting in from the north, under the north edge of the foundation, never past the line half a radius in
  const holes=[0,1,2,3,4,5].map(i=>({sx:bx-R-12*k+i*0.7*k,sy:gy,ex:bx-R+(0.4+i*0.68)*k,ey:gy+(3.2+i*0.5)*k}));
  if(o.drills>0){ctx.save();ctx.lineCap="round";holes.forEach((hl,i)=>{const u=ag_sine(clamp(o.drills*1.6-i*0.12,0,1));if(u<=0)return;ctx.strokeStyle=rgba(LP.blue,0.92);ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(hl.sx,hl.sy);ctx.lineTo(lerp(hl.sx,hl.ex,u),lerp(hl.sy,hl.ey,u));ctx.stroke();});
    ctx.fillStyle="rgb(120,124,132)";ctx.fillRect(bx-R-12.4*k,gy-1.4*k,3.4*k,1.4*k);ctx.restore();}
  // the soil drawn out: small loads riding up each drill, and the cavity at its end closing
  if(o.soil>0){ctx.save();holes.forEach((hl,i)=>{for(let q=0;q<3;q++){const ph=((o.t||0)*0.35+i*0.17+q/3)%1;if(ph<0.05)continue;const px=lerp(hl.ex,hl.sx,ph),py=lerp(hl.ey,hl.sy,ph);
      ctx.fillStyle=rgba([126,98,70],0.9*o.soil*Math.sin(Math.PI*ph));ctx.beginPath();ctx.arc(px,py-4,4.5,0,TAU);ctx.fill();}
    ctx.fillStyle=rgba([60,48,40],0.35*o.soil);ctx.beginPath();ctx.ellipse(hl.ex,hl.ey,8,5,0.3,0,TAU);ctx.fill();});ctx.restore();}
  ctx.restore();}
// the lean as a line from the foot's middle to the top (amber: the lean as it was), and the target half a degree back (blue); an arc
// between them near the top
function qb_axis(ctx,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const [bx,gy]=QB_BASE,k=QB_PK,t0=qb_top(bx,gy,k,o.from==null?QB_LEAN0:o.from),t1=qb_top(bx,gy,k,o.to==null?QB_LEAN1:o.to);
  ctx.save();ctx.globalAlpha*=a;ctx.lineCap="round";ctx.setLineDash([12,10]);ctx.lineWidth=3;
  ctx.strokeStyle=rgba(LP.amber,1);ctx.beginPath();ctx.moveTo(bx,gy);ctx.lineTo(t0[0],t0[1]-40);ctx.stroke();
  if(o.target>0){ctx.globalAlpha*=o.target;ctx.strokeStyle=rgba(LP.blue,1);ctx.beginPath();ctx.moveTo(bx,gy);ctx.lineTo(t1[0],t1[1]-40);ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the test footing: a concrete block on the lawn with its own drills,
   turning a quarter of a degree towards its north (o: a, turn 0 to 1, drills 0 to 1) */
function qb_footing(ctx,x,y,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const k=QB_PK,tilt=-0.25*(o.turn||0)*Math.PI/180*8;ctx.save();ctx.globalAlpha*=a;
  ctx.save();ctx.translate(x,y);ctx.rotate(tilt);const g=ctx.createLinearGradient(-4*k,0,4*k,0);g.addColorStop(0,"rgb(150,146,140)");g.addColorStop(1,"rgb(206,200,190)");ctx.fillStyle=g;ctx.fillRect(-4*k,-2.2*k,8*k,2.2*k);
  ctx.strokeStyle="rgba(70,62,56,0.6)";ctx.lineWidth=2;ctx.strokeRect(-4*k,-2.2*k,8*k,2.2*k);ctx.restore();
  if(o.drills>0){ctx.save();ctx.strokeStyle=rgba(LP.blue,0.9);ctx.lineWidth=4;ctx.lineCap="round";for(let i=0;i<3;i++){const u=ag_sine(clamp(o.drills*1.5-i*0.2,0,1));const sx=x-7*k+i*0.6*k,ex=x-2.6*k+i*0.5*k,ey=y+(2.4+i*0.3)*k;
    ctx.beginPath();ctx.moveTo(sx,y);ctx.lineTo(lerp(sx,ex,u),lerp(y,ey,u));ctx.stroke();}ctx.restore();}
  ctx.restore();}

/* ---------------------------------------------------------------- visitors back on the lawn, looking up at the tower (the module's crowd,
   outdoors: no wall behind them) */
function qb_visitors(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const L={light:"day",wall:0,warm:0.14};
  const P=[[230,800,0.62,false,2,0],[470,836,0.56,false,7,0.3],[1450,836,0.56,true,0,0.6],[1690,800,0.62,true,5,0.9]];
  for(const [x,y,s,fl,ci,d] of P)lp_person(ctx,lp_crowd(ci),x,y,s,{t,flip:fl,gaze:[0.6,-1],a:a*ag_in(t,(o.t0||0)+d,0.6),light:L});}

/* ---------------------------------------------------------------- the engineer's signed note: a day's report and the next day's orders
   (Burland, Jamiolkowski and Viggiani 2009: "a signed document in which the previous day's response was summarized and analysed, the
   objectives of the coming day's soil extraction were set out and instructions given for the locations and volumes"). The note says
   only what such a note held, never numbers of its own. o: a, k (spring), u (its lines, one by one), sign (0 to 1: the signature drawn) */
function qb_note(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return null;
  const words={kick:"Every day, signed",title:"The engineer's note",lines:["Yesterday: how the tower moved","Today: where to draw soil out, and how much"]};
  const bb=lp_textSheet(ctx,x,y,w,words,Object.assign({},o,{col:LP.blue,measure:true})),h=bb.h+64;ctx.save();ctx.globalAlpha*=a;if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  lp_sheet(ctx,x,y,w,h,{col:LP.blue,light:o.light==null?null:o.light,pin:o.pin});lp_textSheet(ctx,x,y,w,words,{col:LP.blue,light:null,pin:false,u:o.u,a:1});
  // the signature: a quick line of ink, drawn on
  const su=ag_sine(o.sign||0);if(su>0){const sx=x+LP_PAD+20,sy=y+h-46;ctx.save();ctx.strokeStyle=rgba(LP.ink,0.85);ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
    for(let i=0;i<=40*su;i++){const u=i/40,px=sx+u*220,py=sy+Math.sin(u*TAU*2.6)*10*(1-u*0.5)-u*6;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();ctx.restore();
    lp_T(ctx,"Signed",x+w-LP_PAD,sy+8,{w:600,size:28,col:LP.mut,align:"right",a:clamp(su*2-1,0,1)});}
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the tower in a frame, on the team room's wall: a print of the piazza */
function qb_print(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*0.75,pic=ag_kept("qbPrint",960,720,(c)=>{const s=0.78;
    c.save();c.translate(480-QB_BASE[0]*s,540-QB_BASE[1]*s);c.scale(s,s);c.drawImage(ag_place("qbPiazza"),0,0);qb_piazza(c,QB_LEAN1);c.restore();});
  ctx.save();ctx.globalAlpha*=a;ctx.save();ctx.shadowColor="rgba(52,36,30,0.32)";ctx.shadowBlur=22;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(LP.timber,1);ctx.fillRect(x-16,y-16,w+32,h+32);ctx.restore();
  ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(x-4,y-4,w+8,h+8);ctx.imageSmoothingQuality="high";ctx.drawImage(pic,(960-w*960/w)/2,0,960,720,x,y,w,h);
  if(o.light!==null)lp_sun(ctx,LP_LIGHT[o.light||"morning"].sun,{a:0.5,col:LP_LIGHT[o.light||"morning"].col,clip:c=>{c.beginPath();c.rect(x-16,y-16,w+32,h+32);c.clip();}});ctx.restore();}
