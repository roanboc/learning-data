/* ===== Everyone at the table: London, 1850 and 1851 =====
   The film's own places, people and things for its opening story, in the module's matte, sunlit language (prefix et_). Nothing here is
   a likeness or a copy of a picture of the time: the park, the two halls and the room are drawn from what is known of them, in this
   film's own style, as an architect draws a building's front, flat and calm, with the sun on the right. They wear none of the five
   colours that mean something (the brick is a dull red-brown, the glass a pale grey, the elms an olive green); amber marks the worries
   and green the answers, on the cards over them.
     etPark        Hyde Park in the summer of 1850: a pale sky, the far trees of the park, the lawn and the ride across it, and the three
                   old elms in the middle
     ET_ELMS       where the three elms stand: each trunk's foot, its height, and the width of its crown
     et_brickHall  the building committee's own design, a long hall of brick under a dome, laid over the park like a drawing: o.u (0 to 1:
                   it rises from the ground), o.elms (0 to 1: the elms it would cut down, outlined in amber), o.a
     et_glassHall  Paxton's hall of iron and glass, its three tiers, the elms showing through it: o.u (0 to 1: it goes up from its middle
                   out), o.arch (0 to 1: the middle rises into the arched roof over the elms), o.lit (0 to 1: the opening day's
                   light), o.a
     et_crowd      the opening day's visitors: small marks along the front of the hall, never people drawn close
     etDerby       a board room of 1850, for the railway meeting: limewash over a timber dado
     et_blotter    the sheet of blotting paper, pink, the sketch drawing itself on it in pen: the hall's long front, and its section
     et_parts      the same few parts, again and again: a column, a girder and a pane of glass, and the row of bays they make
     et_news       the newspaper's page of 6 July 1850, with the hall's front printed on it
     et_glasshouse a glasshouse of the kind Paxton built, in pen, for the sheet that says who he was
     ET_PAXTON     Joseph Paxton, bareheaded, in a dark frock coat over a waistcoat, a white collar and a black neckcloth; never a likeness
     et_person     a person of the time, with what closes over the neck (who.over), in the room's light as lp_person draws one */

const ET_K={sky0:[184,202,216],sky1:[216,224,226],sky2:[240,236,224],
  far:[150,162,142],farDk:[128,142,124],farHi:[200,204,180],
  lawn0:[170,174,134],lawn1:[134,142,104],lawnHi:[196,196,150],ride:[220,204,172],rideDk:[188,170,138],
  leaf:[104,118,86],leafDk:[70,84,64],leafHi:[160,166,118],leafSun:[200,198,150],bark:[96,82,70],barkDk:[60,50,46],barkHi:[150,132,112],
  brick:[140,86,70],brickDk:[98,60,52],brickHi:[176,118,96],stone:[218,204,184],stoneDk:[176,160,140],
  glass:[226,232,234],glassDk:[176,188,194],iron:[64,72,84],board:[214,200,174],
  pink:[238,196,196],pinkDk:[214,166,168],pen:[54,50,74],
  news:[240,232,214],newsInk:[44,40,40]};

/* ---------------------------------------------------------------- Hyde Park, 1850 */
const ET_GROUND=720;                                   // where the halls stand, and the elms
const ET_ELMS=[[848,382,176,3],[966,414,196,7],[1080,370,170,11]];   // x of the trunk's foot, height, crown's width, seed
function et_sky(c,hz){let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,rgba(ET_K.sky0,1));g.addColorStop(0.55,rgba(ET_K.sky1,1));g.addColorStop(1,rgba(ET_K.sky2,1));
  c.fillStyle=g;c.fillRect(0,0,W,hz);
  // the sun's warmth, high on the right
  c.save();c.globalCompositeOperation="screen";g=c.createRadialGradient(1800,90,20,1800,90,1200);g.addColorStop(0,"rgba(255,234,204,0.55)");
  g.addColorStop(0.45,"rgba(255,232,200,0.18)");g.addColorStop(1,"rgba(255,232,200,0)");c.fillStyle=g;c.fillRect(0,0,W,hz);c.restore();
  // long soft banks of cloud, lit from above on the right, their undersides a little cool
  const R=ag_rnd(1850);for(const [cx,cy,rx,ry] of [[380,150,380,40],[1210,96,300,30],[1560,230,420,36],[700,290,240,24]]){
    for(let k=0;k<8;k++){const x=cx+(R()-0.5)*rx*1.3,y=cy+(R()-0.5)*ry*0.9,r=ry*(1.1+R()*1.3);c.save();c.translate(x,y);c.scale(2.8,1);
      const q=c.createRadialGradient(r*0.15,-r*0.35,0,0,0,r*2);q.addColorStop(0,"rgba(255,252,246,0.42)");q.addColorStop(0.55,"rgba(250,248,242,0.16)");q.addColorStop(1,"rgba(250,248,242,0)");
      c.fillStyle=q;c.fillRect(-r*2,-r*2,r*4,r*4);
      const u=c.createRadialGradient(0,r*0.5,0,0,r*0.5,r*1.6);u.addColorStop(0,"rgba(170,184,198,0.12)");u.addColorStop(1,"rgba(170,184,198,0)");c.fillStyle=u;c.fillRect(-r*2,-r,r*4,r*3);c.restore();}}}
// the far trees of the park along the horizon: a band of soft crowns, paler and cooler with the distance
function et_farTrees(c,hz){const R=ag_rnd(51);
  for(let pass=0;pass<2;pass++){const base=pass?ET_K.farDk:ET_K.far,top=pass?hz-92:hz-128;
    for(let k=0;k<64;k++){const x=-50+k*33+R()*22,r=30+R()*40,y=top+R()*30+r*0.6;
      const g=c.createRadialGradient(x+r*0.35,y-r*0.45,0,x,y,r*1.15);g.addColorStop(0,rgba(mix(base,ET_K.farHi,0.55),1));g.addColorStop(0.55,rgba(base,1));g.addColorStop(1,rgba(mix(base,ET_K.farDk,0.4),1));
      c.fillStyle=g;c.beginPath();c.ellipse(x,y,r*1.15,r,0,0,TAU);c.fill();}
    c.fillStyle=rgba(mix(base,ET_K.farDk,0.3),1);c.fillRect(-10,top+48,W+20,hz-top-40);}
  // the haze of the distance over them
  const g=c.createLinearGradient(0,hz-150,0,hz);g.addColorStop(0,"rgba(236,236,228,0.42)");g.addColorStop(1,"rgba(236,236,228,0.12)");c.fillStyle=g;c.fillRect(0,hz-160,W,160);}
// the lawn, and the ride across it: paler far off, deeper near, the sun on it from the right
function et_lawn(c,hz){let g=c.createLinearGradient(0,hz,0,H);g.addColorStop(0,rgba(ET_K.lawn0,1));g.addColorStop(1,rgba(ET_K.lawn1,1));c.fillStyle=g;c.fillRect(0,hz,W,H-hz);
  const R=ag_rnd(77);for(let k=0;k<26;k++){const x=R()*W,y=hz+20+R()*(H-hz),r=80+R()*160;const q=c.createRadialGradient(x,y,0,x,y,r);
    q.addColorStop(0,rgba(R()<0.5?ET_K.lawnHi:ET_K.lawn1,0.16));q.addColorStop(1,rgba(ET_K.lawn1,0));c.fillStyle=q;c.save();c.translate(x,y);c.scale(3,0.4);c.translate(-x,-y);c.fillRect(x-r,y-r,2*r,2*r);c.restore();}
  // the ride: a band of pale sand, worn at its edges
  const y0=826,y1=868;g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(ET_K.ride,1));g.addColorStop(1,rgba(mix(ET_K.ride,ET_K.rideDk,0.5),1));c.fillStyle=g;
  c.beginPath();c.moveTo(0,y0+4);c.bezierCurveTo(600,y0-4,1300,y0+6,W,y0-2);c.lineTo(W,y1);c.bezierCurveTo(1300,y1+6,600,y1-4,0,y1+2);c.closePath();c.fill();
  c.strokeStyle=rgba(ET_K.rideDk,0.5);c.lineWidth=2;c.beginPath();c.moveTo(0,y0+4);c.bezierCurveTo(600,y0-4,1300,y0+6,W,y0-2);c.stroke();
  // the sun across the lawn from the right
  c.save();c.globalCompositeOperation="soft-light";g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,40,60,0.35)");g.addColorStop(0.6,"rgba(255,240,210,0)");g.addColorStop(1,"rgba(255,236,200,0.45)");
  c.fillStyle=g;c.fillRect(0,hz,W,H-hz);c.restore();}
// an old elm: a tapering trunk, a little flared at its foot, and main limbs rising into a tall crown of leaves in clumps, lit from the
// right; its shadow on the lawn, down and to the left
function et_elm(c,x,h,cw,seed,bare){const R=ag_rnd(seed*131+7),K=ET_K,y=ET_GROUND,tw=h*0.075,top=y-h*0.36;
  if(!bare){const sh=c.createRadialGradient(x-70,y+10,0,x-70,y+10,cw*0.75);sh.addColorStop(0,"rgba(52,56,44,0.32)");sh.addColorStop(1,"rgba(52,56,44,0)");
  c.save();c.translate(x-70,y+10);c.scale(1,0.13);c.translate(-(x-70),-(y+10));c.fillStyle=sh;c.fillRect(x-70-cw,y+10-cw,cw*2,cw*2);c.restore();}
  // the limbs first, so the crown covers most of them: from the trunk's top they fork up and out, tapering
  const limbs=[[-0.42,0.62],[-0.18,0.86],[0.12,0.92],[0.4,0.66],[0.02,0.7]];
  for(const [dx,up] of limbs){const ex=x+dx*cw*0.95,ey=y-h*up;ag_taper(c,[x+dx*tw,top+6],[x+dx*tw*2,top-h*0.1],[ex-dx*cw*0.2,ey+h*0.12],[ex,ey],tw*0.42,tw*0.12,rgba(K.barkDk,1));}
  const trunk=cc=>{cc.moveTo(x-tw*1.25,y+2);cc.bezierCurveTo(x-tw*0.6,y-h*0.03,x-tw*0.52,y-h*0.2,x-tw*0.46,top);cc.lineTo(x+tw*0.46,top);
    cc.bezierCurveTo(x+tw*0.52,y-h*0.2,x+tw*0.62,y-h*0.03,x+tw*1.3,y+2);cc.closePath();};
  ag_soft(c,trunk,K.bark,K.barkHi,x+tw*0.9,y-h*0.22,h*0.3,null);
  c.save();ag_shape(c,trunk);c.clip();let g=c.createLinearGradient(x-tw,0,x+tw,0);g.addColorStop(0,"rgba(40,32,30,0.45)");g.addColorStop(0.55,"rgba(40,32,30,0)");g.addColorStop(1,"rgba(255,236,206,0.25)");
  c.fillStyle=g;c.fillRect(x-tw*1.4,top,tw*2.8,y-top+4);c.strokeStyle="rgba(46,38,34,0.35)";c.lineWidth=1.6;
  for(let k=0;k<5;k++){const bx=x+(k-2)*tw*0.32;c.beginPath();c.moveTo(bx,y);c.bezierCurveTo(bx+2,y-h*0.12,bx-3,y-h*0.24,bx+1,top);c.stroke();}c.restore();
  // the crown: big lobes along a tall, uneven dome, widest about two thirds of the way up, a few small ones breaking its edge; each lobe's
  // edge is broken into small round clumps of leaves, matte: the deepest green underneath and on the left, lit on the top and the right
  const L=[];for(let k=0;k<17;k++){const v=k<14?0.32+0.64*(k/13):0.45+R()*0.45,wd=Math.sin(Math.PI*clamp((v-0.26)/0.8,0,1))*cw*0.5,side=k%2?1:-1;
    L.push({x:x+side*wd*(0.25+R()*0.6)+(R()-0.5)*14,y:y-h*v,r:cw*(0.17+R()*0.09)*(k<14?1:0.62)});}
  L.sort((a,b)=>b.y-a.y);const B=[];
  for(const b of L){const n=Math.max(6,Math.round(b.r/6)),sh=clamp(0.5-(b.x-x)/cw*0.7+(b.y-(y-h*0.62))/h*1.6,0,1);b.col=mix(K.leaf,K.leafDk,sh*0.55);
    B.push({x:b.x,y:b.y,r:b.r*0.78,an:null,b});
    for(let k=0;k<n;k++){const an=k/n*TAU+(R()-0.5)*0.5,rr=b.r*(0.62+0.22*R());B.push({x:b.x+Math.cos(an)*rr,y:b.y+Math.sin(an)*rr*0.86,r:b.r*(0.26+0.12*R()),an,b});}}
  for(const q of B){c.fillStyle=rgba(K.leafDk,1);c.beginPath();c.arc(q.x-2,q.y+3,q.r*1.04,0,TAU);c.fill();}
  for(const q of B){c.fillStyle=rgba(q.b.col,1);c.beginPath();c.arc(q.x+q.r*0.1,q.y-q.r*0.14,q.r*0.84,0,TAU);c.fill();}
  // the light on each clump that faces the sun, high on the right
  for(const q of B){if(q.an==null)continue;const d=Math.cos(q.an-(-0.75));if(d<0.3)continue;c.fillStyle=rgba(mix(q.b.col,K.leafHi,0.6),0.6*d);c.beginPath();c.ellipse(q.x+q.r*0.16,q.y-q.r*0.22,q.r*0.62,q.r*0.5,-0.5,0,TAU);c.fill();}
  for(const q of B){if(q.an==null||q.b.x<x-cw*0.05)continue;const d=Math.cos(q.an-(-0.9));if(d<0.85||q.b.y>y-h*0.6)continue;c.fillStyle=rgba(K.leafSun,0.28);c.beginPath();c.ellipse(q.x+q.r*0.22,q.y-q.r*0.3,q.r*0.4,q.r*0.26,-0.5,0,TAU);c.fill();}
  // small gaps where the sky shows through the crown
  for(let k=0;k<6;k++){const b=L[(R()*L.length)|0];c.fillStyle=rgba(mix(ET_K.sky1,K.leafDk,0.4),0.55);c.beginPath();c.ellipse(b.x+(R()-0.5)*b.r,b.y+(R()-0.2)*b.r*0.5,2.5+R()*3,2+R()*2.4,0,0,TAU);c.fill();}}
function et_paintPark(c){et_sky(c,ET_GROUND);et_farTrees(c,ET_GROUND);et_lawn(c,ET_GROUND);for(const [x,h,cw,sd] of ET_ELMS)et_elm(c,x,h,cw,sd);}
AG_PLACES.etPark=c=>et_paintPark(c);

/* ---------------------------------------------------------------- the committee's hall of brick, under a dome */
// painted once at the frame's size; drawn rising from the ground (o.u), and the elms it would cut down outlined in amber (o.elms)
const ET_DOME={x:960,y:448,rx:262,ry:196};
function et_brickPic(){return ag_kept("etBrick",W,H,c=>{const K=ET_K,top=572,y=ET_GROUND;
  // the long hall: brick walls with two rows of tall arched windows, a stone cornice and plinth; it runs on past both edges
  let g=c.createLinearGradient(0,top,0,y);g.addColorStop(0,rgba(K.brick,1));g.addColorStop(1,rgba(mix(K.brick,K.brickDk,0.35),1));c.fillStyle=g;c.fillRect(0,top,W,y-top);
  c.fillStyle=rgba(K.stone,1);c.fillRect(0,top-14,W,16);c.fillStyle=rgba(K.stoneDk,1);c.fillRect(0,top+2,W,4);c.fillRect(0,y-16,W,16);
  const win=(wx,wy,ww,wh)=>{c.fillStyle=rgba([62,52,54],0.85);c.beginPath();c.moveTo(wx,wy+wh);c.lineTo(wx,wy+ww/2);c.arc(wx+ww/2,wy+ww/2,ww/2,Math.PI,0);c.lineTo(wx+ww,wy+wh);c.closePath();c.fill();
    c.strokeStyle=rgba(K.stone,0.9);c.lineWidth=3;c.beginPath();c.arc(wx+ww/2,wy+ww/2,ww/2+3,Math.PI,0);c.stroke();};
  for(let wx=14;wx<W;wx+=64){win(wx,top+20,26,46);win(wx,top+86,26,46);}
  // the drum and the dome over the middle, the lantern on top
  const D=ET_DOME;g=c.createLinearGradient(D.x-D.rx,0,D.x+D.rx,0);g.addColorStop(0,rgba(K.brickDk,1));g.addColorStop(0.6,rgba(K.brick,1));g.addColorStop(1,rgba(K.brickHi,1));
  c.fillStyle=g;c.fillRect(D.x-D.rx+16,D.y,2*D.rx-32,top-14-D.y);for(let wx=D.x-D.rx+40;wx<D.x+D.rx-60;wx+=56)win(wx,D.y+22,24,52);
  c.fillStyle=rgba(K.stone,1);c.fillRect(D.x-D.rx+6,D.y-10,2*D.rx-12,14);
  g=c.createRadialGradient(D.x+D.rx*0.4,D.y-D.ry*0.7,10,D.x,D.y,D.rx*1.2);g.addColorStop(0,rgba(mix(K.stoneDk,K.brickHi,0.3),1));g.addColorStop(1,rgba(mix(K.brickDk,K.stoneDk,0.25),1));
  c.fillStyle=g;c.beginPath();c.ellipse(D.x,D.y-10,D.rx-8,D.ry,0,Math.PI,0);c.closePath();c.fill();
  c.strokeStyle=rgba(K.brickDk,0.4);c.lineWidth=2;for(let k=-3;k<=3;k++){c.beginPath();c.ellipse(D.x,D.y-10,Math.abs(k)/3.4*(D.rx-8),D.ry,0,Math.PI,0);c.stroke();}
  c.fillStyle=rgba(K.stone,1);c.fillRect(D.x-18,D.y-D.ry-42,36,34);c.beginPath();c.moveTo(D.x-22,D.y-D.ry-42);c.lineTo(D.x,D.y-D.ry-62);c.lineTo(D.x+22,D.y-D.ry-42);c.closePath();c.fill();
  // the sun on it from the right, and its shade on the left
  c.save();c.globalCompositeOperation="source-atop";g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(40,30,34,0.28)");g.addColorStop(0.55,"rgba(40,30,34,0)");g.addColorStop(1,"rgba(255,226,190,0.2)");
  c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();});}
// the three elms alone, painted once with no shadow, for the outline the brick hall draws round them
function et_elmMask(){return ag_kept("etElmMask",W,H,c=>{for(const [x,h,cw,sd] of ET_ELMS)et_elm(c,x,h,cw,sd,true);});}
// the elms where the hall would stand on them: their own outline in col, the inside a faint wash of it; painted once per colour
function et_elmOutline(ctx,col,a){if(a<=0.004)return;const m=et_elmMask(),pic=ag_kept("etElmLine:"+col.join(","),W,H,c=>{
    for(const [dx,dy] of [[-4,0],[4,0],[0,-4],[0,4],[-3,-3],[3,3],[-3,3],[3,-3]])c.drawImage(m,dx,dy);
    c.globalCompositeOperation="destination-out";c.drawImage(m,0,0);c.globalCompositeOperation="source-in";c.fillStyle=rgba(col,1);c.fillRect(0,0,W,H);
    const [wc,wx]=ag_buf("etElmWash",W,H);wx.drawImage(m,0,0);wx.globalCompositeOperation="source-in";wx.fillStyle=rgba(col,0.2);wx.fillRect(0,0,W,H);
    c.globalCompositeOperation="destination-over";c.drawImage(wc,0,0);});
  ctx.save();ctx.globalAlpha*=a;ctx.drawImage(pic,0,0,W,H);ctx.restore();}
function et_brickHall(ctx,o){o=o||{};const a=o.a==null?1:o.a,u=clamp(o.u==null?1:o.u,0,1);if(a<=0.004||u<=0)return;const pic=et_brickPic(),top=ET_DOME.y-ET_DOME.ry-70,lv=ET_GROUND-(ET_GROUND-top)*ag_sine(u);
  ctx.save();ctx.globalAlpha*=a;ctx.beginPath();ctx.rect(-40,lv,W+80,ET_GROUND-lv+2);ctx.clip();ctx.drawImage(pic,0,0,W,H);ctx.restore();
  et_elmOutline(ctx,LP.amber,a*(o.elms||0));}

/* ---------------------------------------------------------------- Paxton's hall of iron and glass
   Three tiers, each set back above the one below, glazed between slender iron columns a bay apart, each tier's top a pale band of
   painted iron with the flat roof of the tier below seen just above it; the elms show through the glass of the middle. The middle,
   over the elms, rises into an arched roof (o.arch), its end a half-circle of glass with ribs from its centre. The flat hall is painted
   once; the arch is drawn live over it. */
const ET_GL={base:ET_GROUND,t1:618,t2:536,t3:458,x0:728,x1:1192,bay:84};
function et_glassTier(c,x0,x1,y0,y1,o){const K=ET_K;o=o||{};const ga=o.ga||0.8,bd=o.board||0;
  // the glass, catching the sky: darker under the band above, paler low down, with the soft light of clouds across it
  let g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(mix(K.glassDk,K.iron,0.2),ga));g.addColorStop(0.35,rgba(mix(K.glassDk,K.glass,0.5),ga));g.addColorStop(1,rgba(mix(K.glass,[255,255,255],0.35),ga));
  c.fillStyle=g;c.fillRect(x0,y0,x1-x0,y1-y0-bd);
  g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0.2,"rgba(255,255,255,0)");g.addColorStop(0.55,"rgba(255,255,255,0.16)");g.addColorStop(0.8,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(x0,y0,x1-x0,y1-y0-bd);
  // the boarded foot of the ground tier, its louvres
  if(bd){g=c.createLinearGradient(0,y1-bd,0,y1);g.addColorStop(0,rgba(K.board,1));g.addColorStop(1,rgba(mix(K.board,K.iron,0.22),1));c.fillStyle=g;c.fillRect(x0,y1-bd,x1-x0,bd);
    c.strokeStyle=rgba(mix(K.board,K.iron,0.45),0.6);c.lineWidth=1.2;for(let y=y1-bd+6;y<y1-2;y+=6){c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();}}
  // the glazing bars, fine, four panes to a bay
  c.strokeStyle=rgba(mix(K.iron,K.glass,0.35),0.42);c.lineWidth=1.1;for(let x=x0;x<=x1;x+=ET_GL.bay/4){c.beginPath();c.moveTo(x,y0+8);c.lineTo(x,y1-bd);c.stroke();}
  // the columns, a bay apart: slender, lit on the side towards the sun
  for(let x=x0;x<=x1+1;x+=ET_GL.bay){c.fillStyle=rgba(mix(K.iron,K.glass,0.18),0.95);c.fillRect(x-1.6,y0,3.2,y1-y0);c.fillStyle="rgba(250,248,240,0.7)";c.fillRect(x+1.2,y0+8,1.1,y1-y0-8-bd);}
  // the band of painted iron along its top, with a fine dark line under it; over it, the flat roof of this tier, just seen
  c.fillStyle=rgba([236,232,220],1);c.fillRect(x0,y0-2,x1-x0,10);c.fillStyle=rgba(mix(K.iron,K.glass,0.3),0.8);c.fillRect(x0,y0+8,x1-x0,1.6);
  if(o.roof){g=c.createLinearGradient(0,y0-2-o.roof,0,y0-2);g.addColorStop(0,rgba([196,202,204],1));g.addColorStop(1,rgba([214,216,214],1));c.fillStyle=g;c.fillRect(x0,y0-2-o.roof,x1-x0,o.roof);}
  g=c.createLinearGradient(0,y0+9,0,y0+26);g.addColorStop(0,"rgba(40,46,58,0.2)");g.addColorStop(1,"rgba(40,46,58,0)");c.fillStyle=g;c.fillRect(x0,y0+9,x1-x0,17);}
function et_glassPic(){return ag_kept("etGlass",W,H,c=>{const G=ET_GL;
  // the tiers, top first, so each lower tier's roof shows in front of the wall of the one above
  et_glassTier(c,-20,W+20,G.t3,G.t2,{ga:0.8});et_glassTier(c,-20,W+20,G.t2,G.t1,{ga:0.8,roof:8});et_glassTier(c,-20,W+20,G.t1,G.base,{ga:0.82,board:26,roof:8});
  // the transept's front over the middle: its glass a little clearer, so the elms inside show, and its sides heavier
  c.save();c.globalCompositeOperation="destination-out";c.fillStyle="rgba(0,0,0,0.3)";c.fillRect(G.x0+3,G.t3+10,G.x1-G.x0-6,G.base-26-G.t3-10);c.restore();
  c.fillStyle=rgba([236,232,220],1);c.fillRect(G.x0-1,G.t3-2,G.x1-G.x0+2,10);for(const x of [G.x0,G.x1]){c.fillStyle=rgba(mix(ET_K.iron,ET_K.glass,0.12),1);c.fillRect(x-3.5,G.t3-2,7,G.base-G.t3+2);}
  // the sun on the glass from the right, a long soft glint across it, and the shade on the left
  c.save();c.globalCompositeOperation="source-atop";let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(50,56,70,0.18)");g.addColorStop(0.5,"rgba(50,56,70,0)");g.addColorStop(1,"rgba(255,240,214,0.3)");
  c.fillStyle=g;c.fillRect(0,0,W,H);g=c.createLinearGradient(1240,G.t3,1620,G.base);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(0.5,"rgba(255,255,255,0.22)");g.addColorStop(1,"rgba(255,255,255,0)");
  c.fillStyle=g;c.fillRect(0,0,W,H);g=c.createLinearGradient(260,G.t3,520,G.base);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(0.5,"rgba(255,255,255,0.12)");g.addColorStop(1,"rgba(255,255,255,0)");
  c.fillStyle=g;c.fillRect(0,0,W,H);c.restore();});}
// the arched end over the middle: a half-circle of glass on the transept's sides, ribs from its centre, two rings, a pale rim; k from 0
// (flat) to 1
function et_arch(ctx,k){const G=ET_GL,cx=(G.x0+G.x1)/2,rx=(G.x1-G.x0)/2+2,ry=rx*0.98*k;if(ry<2)return;const K=ET_K,y=G.t3+2;
  ctx.save();let g=ctx.createLinearGradient(0,y-ry,0,y);g.addColorStop(0,rgba(mix(K.glassDk,K.iron,0.15),0.66));g.addColorStop(1,rgba(mix(K.glass,[255,255,255],0.2),0.56));ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(cx,y,rx,ry,0,Math.PI,0);ctx.closePath();ctx.fill();
  ctx.save();ctx.beginPath();ctx.ellipse(cx,y,rx,ry,0,Math.PI,0);ctx.closePath();ctx.clip();
  ctx.strokeStyle=rgba(mix(K.iron,K.glass,0.25),0.6);ctx.lineWidth=1.8;for(let i=1;i<12;i++){const an=Math.PI+Math.PI*i/12;ctx.beginPath();ctx.moveTo(cx+Math.cos(an)*rx*0.2,y+Math.sin(an)*ry*0.2);ctx.lineTo(cx+Math.cos(an)*rx,y+Math.sin(an)*ry);ctx.stroke();}
  ctx.lineWidth=2.4;for(const f of [0.2,0.6]){ctx.beginPath();ctx.ellipse(cx,y,rx*f,ry*f,0,Math.PI,0);ctx.stroke();}
  g=ctx.createLinearGradient(cx-rx,0,cx+rx,0);g.addColorStop(0,"rgba(50,56,70,0.14)");g.addColorStop(0.55,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(255,240,214,0.28)");ctx.fillStyle=g;ctx.fillRect(cx-rx,y-ry,2*rx,ry);ctx.restore();
  ctx.strokeStyle=rgba([236,232,220],1);ctx.lineWidth=9;ctx.beginPath();ctx.ellipse(cx,y,rx,ry,0,Math.PI,0);ctx.stroke();
  ctx.strokeStyle=rgba(mix(K.iron,K.glass,0.3),0.7);ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(cx,y,rx-5,Math.max(1,ry-5),0,Math.PI,0);ctx.stroke();ctx.restore();}
function et_glassHall(ctx,o){o=o||{};const a=o.a==null?1:o.a,u=clamp(o.u==null?1:o.u,0,1);if(a<=0.004||u<=0)return;const pic=et_glassPic(),half=232+ag_sine(u)*790;
  ctx.save();ctx.globalAlpha*=a;ctx.beginPath();ctx.rect(960-half,0,2*half,H);ctx.clip();ctx.drawImage(pic,0,0,W,H);
  if(o.arch>0)et_arch(ctx,ag_sine(o.arch));
  // the opening day's light: the glass bright in the sun, and flags along the roof
  if(o.lit>0){ctx.save();ctx.globalCompositeOperation="screen";ctx.globalAlpha*=0.35*o.lit;ctx.drawImage(pic,0,0,W,H);ctx.restore();et_flags(ctx,o.t||0,o.lit,o.arch>0.98);}
  ctx.restore();}
// the opening day's flags: small pennants on poles along the roof, and one over the arch, moving a little in the wind; red-brown and
// cream, none of the colours that mean something
function et_flags(ctx,t,a,arch){if(a<=0.004)return;const G=ET_GL,cols=[[164,76,64],[238,230,214]],P=[];
  for(let x=60;x<W;x+=150){if(x>G.x0-40&&x<G.x1+40)continue;P.push([x,G.t3-2,34]);}if(arch)P.push([960,G.t3-227,44]);
  ctx.save();ctx.globalAlpha*=ag_sine(clamp(a,0,1));P.forEach(([px,py,hh],i)=>{const sw=Math.sin(t*2.3+i*1.7)*0.18,len=hh*0.8*(1+sw*0.4);
    ctx.strokeStyle=rgba(mix(ET_K.iron,ET_K.glass,0.2),0.9);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py-hh);ctx.stroke();
    ctx.fillStyle=rgba(cols[i%2],1);ctx.beginPath();ctx.moveTo(px+1,py-hh);ctx.quadraticCurveTo(px+len*0.5,py-hh+2+sw*6,px+len,py-hh+6+sw*5);ctx.quadraticCurveTo(px+len*0.5,py-hh+10+sw*6,px+1,py-hh+13);ctx.closePath();ctx.fill();});
  ctx.restore();}
// the opening day's visitors: small dark marks under the glass along the floor of the hall, thickest under the arch, and a few more
// on the lawn at its door; some in the wide skirts and tall hats of 1851. Painted once; drawn before the hall, so the glass is over them
function et_crowdPic(){return ag_kept("etCrowd",W,H,c=>{const R=ag_rnd(1851),cols=[[66,58,62],[92,74,66],[62,66,78],[104,90,80],[80,62,60],[56,56,60]];
  const mark=(x,y,s)=>{const col=cols[(R()*cols.length)|0],skirt=R()<0.45;c.fillStyle=rgba(col,1);c.beginPath();
    if(skirt){c.moveTo(x-2*s,y-13*s);c.lineTo(x+2*s,y-13*s);c.quadraticCurveTo(x+6.5*s,y-4*s,x+6.5*s,y);c.lineTo(x-6.5*s,y);c.quadraticCurveTo(x-6.5*s,y-4*s,x-2*s,y-13*s);}
    else{c.moveTo(x-2.6*s,y-14*s);c.lineTo(x+2.6*s,y-14*s);c.lineTo(x+2.4*s,y);c.lineTo(x-2.4*s,y);}c.closePath();c.fill();
    c.fillStyle=rgba(mix(col,[226,196,176],0.6),1);c.beginPath();c.arc(x,y-16.5*s,2.5*s,0,TAU);c.fill();
    if(!skirt&&R()<0.55){c.fillStyle=rgba([40,36,40],1);c.fillRect(x-2.2*s,y-23*s,4.4*s,4.6*s);}else if(skirt&&R()<0.6){c.fillStyle=rgba(mix(col,[230,220,200],0.4),1);c.beginPath();c.arc(x,y-18*s,3*s,Math.PI,0);c.fill();}};
  for(let k=0;k<260;k++){const mid=R()<0.4,x=mid?ET_GL.x0+10+R()*(ET_GL.x1-ET_GL.x0-20):R()*W,y=ET_GROUND-30+R()*26;mark(x,y,0.9+R()*0.15);}
  for(let k=0;k<18;k++){const x=800+R()*320,y=ET_GROUND+6+R()*26;mark(x,y,1.05);}});}
function et_crowd(ctx,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;ctx.drawImage(et_crowdPic(),0,0,W,H);ctx.restore();}

/* ---------------------------------------------------------------- a board room of 1850 */
function et_paintDerby(c){lp_paintRoom(c,{light:"day",seed:21,base:[226,212,188]});const y0=650,y1=914,K=LP.timber;
  // a timber dado round the room: its rail, then panels with mouldings, lit from the right
  let g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,rgba(mix(K,LP.shade,0.28),1));g.addColorStop(1,rgba(mix(K,LP.shade,0.42),1));c.fillStyle=g;c.fillRect(0,y0,W,y1-y0);
  for(let x=30;x<W;x+=210){c.strokeStyle=rgba(mix(K,LP.shade,0.55),0.7);c.lineWidth=3;c.strokeRect(x,y0+34,170,y1-y0-64);c.strokeStyle="rgba(255,240,220,0.18)";c.lineWidth=1.5;c.strokeRect(x+3,y0+37,170,y1-y0-64);}
  g=c.createLinearGradient(0,y0-12,0,y0+10);g.addColorStop(0,rgba(mix(K,[255,248,236],0.2),1));g.addColorStop(1,rgba(mix(K,LP.shade,0.3),1));c.fillStyle=g;c.fillRect(0,y0-12,W,22);
  c.save();c.globalCompositeOperation="source-atop";g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(LP.shade,0.3));g.addColorStop(0.5,rgba(LP.shade,0));g.addColorStop(1,rgba(LP.sun,0.12));c.fillStyle=g;c.fillRect(0,y0-12,W,y1-y0+12);c.restore();}
AG_PLACES.etDerby=c=>et_paintDerby(c);
const ET_DERBY={light:"day",warm:0.13,shade:0.2,wall:0.16};

/* ---------------------------------------------------------------- the sketch on blotting paper */
// the sketch, in figure units 0 to 1 across the sheet: strokes [[x, y], ...], drawn in order as u goes 0 to 1; the long front of the
// hall in three tiers, the middle no higher than the rest, as he first drew it, and under it the section, three tiers stepping up
function et_sketchStrokes(){const S=[],r=ag_rnd(611),line=(pts)=>{const out=[];for(let i=0;i<pts.length;i++){const p=pts[i];if(i===0){out.push([p[0]+(r()-0.5)*0.004,p[1]+(r()-0.5)*0.006]);continue;}
      const q=pts[i-1],n=Math.max(1,Math.round(Math.hypot(p[0]-q[0],(p[1]-q[1])*0.66)/0.04));for(let k=1;k<=n;k++){const f=k/n,wob=k<n?(r()-0.5)*0.005:0;
        out.push([lerp(q[0],p[0],f)+((p[1]!==q[1])?wob:0),lerp(q[1],p[1],f)+((p[0]!==q[0])?wob*1.4:0)]);}}S.push(out);};
  // the front: ground tier, second, third
  line([[0.06,0.5],[0.94,0.5]]);line([[0.06,0.5],[0.06,0.4],[0.94,0.4],[0.94,0.5]]);line([[0.12,0.4],[0.12,0.32],[0.88,0.32],[0.88,0.4]]);line([[0.2,0.32],[0.2,0.25],[0.8,0.25],[0.8,0.32]]);
  for(let i=1;i<14;i++)line([[0.06+i*0.88/14,0.5],[0.06+i*0.88/14,0.41]]);for(let i=1;i<10;i++)line([[0.12+i*0.76/10,0.4],[0.12+i*0.76/10,0.33]]);
  // the section below: the tiers stepping up to the middle, and the ground
  line([[0.16,0.86],[0.84,0.86]]);line([[0.24,0.86],[0.24,0.76],[0.33,0.76],[0.33,0.68],[0.42,0.68],[0.42,0.6],[0.58,0.6],[0.58,0.68],[0.67,0.68],[0.67,0.76],[0.76,0.76],[0.76,0.86]]);
  line([[0.33,0.86],[0.33,0.76]]);line([[0.42,0.86],[0.42,0.68]]);line([[0.58,0.86],[0.58,0.68]]);line([[0.67,0.86],[0.67,0.76]]);
  return S;}
const ET_SKETCH=et_sketchStrokes();
function et_blotter(ctx,x,y,w,h,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const K=ET_K,u=clamp(o.u==null?1:o.u,0,1);ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.3)";ctx.shadowBlur=20;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(K.pink,1);ctx.fillRect(x,y,w,h);ctx.restore();
  // the soft paper: a little mottled, and the old blots of other people's ink, faint and back to front
  const R=ag_rnd(186);for(let k=0;k<14;k++){const bx=x+R()*w,by=y+R()*h,r=20+R()*60,g=ctx.createRadialGradient(bx,by,0,bx,by,r);g.addColorStop(0,rgba(K.pinkDk,0.3));g.addColorStop(1,rgba(K.pinkDk,0));ctx.fillStyle=g;ctx.fillRect(bx-r,by-r,2*r,2*r);}
  ctx.strokeStyle=rgba([120,104,140],0.09);ctx.lineWidth=2;ctx.lineCap="round";for(let k=0;k<9;k++){const bx=x+w*(0.08+R()*0.7),by=y+h*(0.08+R()*0.84),l=60+R()*140;
    ctx.beginPath();ctx.moveTo(bx,by);for(let i=1;i<=10;i++)ctx.lineTo(bx+l*i/10,by+Math.sin(i*1.7+k)*4);ctx.stroke();}
  if(o.pin!==false){const mx=x+w/2,my=y+22;ctx.save();ctx.shadowColor="rgba(40,28,20,0.4)";ctx.shadowBlur=6;ctx.shadowOffsetX=-3;ctx.shadowOffsetY=3;
    ctx.fillStyle=rgba(LP.graphite,1);ctx.beginPath();ctx.arc(mx,my,9,0,TAU);ctx.fill();ctx.restore();ctx.fillStyle="rgba(255,255,255,0.35)";ctx.beginPath();ctx.arc(mx+2.5,my-3,3,0,TAU);ctx.fill();}
  // the sketch, a pen's line drawing itself, stroke by stroke
  const n=ET_SKETCH.length,P=ET_SKETCH.reduce((s,st)=>s+st.length-1,0);let done=u*P;ctx.strokeStyle=rgba(K.pen,0.92);ctx.lineWidth=Math.max(2.4,w*0.0034);ctx.lineJoin="round";
  for(let i=0;i<n&&done>0;i++){const st=ET_SKETCH[i];ctx.beginPath();ctx.moveTo(x+st[0][0]*w,y+st[0][1]*h);
    for(let j=1;j<st.length&&done>0;j++){const f=Math.min(1,done);const p=st[j-1],q=st[j];ctx.lineTo(x+lerp(p[0],q[0],f)*w,y+lerp(p[1],q[1],f)*h);done-=1;}ctx.stroke();}
  ctx.restore();}

/* ---------------------------------------------------------------- the same few parts, again and again */
// a sheet: a column, a girder and a pane on the left, each with its name; on the right a row of bays that they make, coming in one by one
// (o.u), a hall's front that can go up fast, and come down again. o.a, o.k
function et_parts(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=430;if(a<=0.004)return{x,y,w,h};const K=ET_K;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));lp_sheet(ctx,x,y,w,h,{light:o.light});lp_label(ctx,x+44,y+80,"The same few parts");
  const px=x+60,py=y+150;
  // a column
  ctx.fillStyle=rgba(K.iron,1);ctx.fillRect(px+20,py,12,170);ctx.fillRect(px+10,py,32,10);ctx.fillRect(px+10,py+162,32,10);lp_T(ctx,"Column",px+26,py+220,{w:700,size:28,align:"center"});
  // a girder: a beam with its open web
  const gx=px+120;ctx.strokeStyle=rgba(K.iron,1);ctx.lineWidth=5;ctx.strokeRect(gx,py+60,170,40);ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<5;i++){ctx.moveTo(gx+i*34,py+100);ctx.lineTo(gx+i*34+17,py+60);ctx.lineTo(gx+i*34+34,py+100);}ctx.stroke();
  lp_T(ctx,"Girder",gx+85,py+220,{w:700,size:28,align:"center"});
  // a pane of glass
  const qx=gx+230;let g=ctx.createLinearGradient(qx,py,qx+70,py+170);g.addColorStop(0,rgba(K.glassDk,0.9));g.addColorStop(1,rgba(K.glass,0.9));ctx.fillStyle=g;ctx.fillRect(qx,py+10,70,150);
  ctx.strokeStyle=rgba(K.iron,0.8);ctx.lineWidth=3;ctx.strokeRect(qx,py+10,70,150);ctx.strokeStyle="rgba(255,255,255,0.7)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(qx+14,py+40);ctx.lineTo(qx+30,py+24);ctx.stroke();
  lp_T(ctx,"Glass",qx+35,py+220,{w:700,size:28,align:"center"});
  // the bays they make, again and again
  const bx0=qx+150,bw=(x+w-60-bx0)/8,u=clamp(o.u==null?1:o.u,0,1);
  for(let i=0;i<8;i++){const v=ag_eo(clamp(u*8-i,0,1));if(v<=0)continue;const bx=bx0+i*bw;ctx.save();ctx.globalAlpha*=v;ctx.translate(0,(1-v)*-30);
    g=ctx.createLinearGradient(0,py,0,py+170);g.addColorStop(0,rgba(K.glassDk,0.8));g.addColorStop(1,rgba(K.glass,0.8));ctx.fillStyle=g;ctx.fillRect(bx,py+10,bw,160);
    ctx.strokeStyle=rgba(K.iron,0.45);ctx.lineWidth=1.4;for(let k=1;k<4;k++){ctx.beginPath();ctx.moveTo(bx+bw*k/4,py+10);ctx.lineTo(bx+bw*k/4,py+170);ctx.stroke();}
    ctx.fillStyle=rgba(K.iron,1);ctx.fillRect(bx-3,py,6,172);ctx.fillRect(bx,py,bw,8);ctx.restore();}
  if(u>=1){ctx.fillStyle=rgba(K.iron,1);ctx.fillRect(bx0+8*bw-3,py,6,172);}
  if(o.again>0)lp_T(ctx,"Again and again",bx0+4*bw,py+220,{w:700,size:28,align:"center",a:ag_sine(o.again)});
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- the newspaper's page, 6 July 1850 */
// a page of the weekly paper: its name across the top, the date, and the hall's long front printed across it, as an engraving of fine
// lines (no words of the time are quoted); o.a, o.k
function et_engraving(ctx,x,y,w,h){const K=ET_K,ink=a=>rgba(K.newsInk,a);ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();
  ctx.fillStyle=rgba(mix(K.news,[255,255,255],0.35),1);ctx.fillRect(x,y,w,h);const R=ag_rnd(1850);
  // the sky: level lines, close and dark at the top, thinning out towards the horizon
  ctx.lineWidth=1;for(let yy=y+4;yy<y+h*0.5;yy+=4.5){const f=(yy-y)/(h*0.5);ctx.strokeStyle=ink(0.42*(1-f));ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);ctx.stroke();}
  const g0=y+h*0.8,t1=y+h*0.66,t2=y+h*0.55,t3=y+h*0.45,x0=x+w*0.1,x1=x+w*0.9;
  // trees at both ends, their crowns in short strokes
  for(const [cx,cr] of [[x+w*0.05,h*0.2],[x+w*0.95,h*0.22],[x+w*0.015,h*0.14],[x+w*0.99,h*0.15]]){const cy=g0-cr*1.3;ctx.fillStyle=rgba(mix(K.news,K.newsInk,0.18),1);ctx.beginPath();ctx.ellipse(cx,cy,cr*0.75,cr,0,0,TAU);ctx.fill();
    ctx.strokeStyle=ink(0.55);for(let k=0;k<60;k++){const an=R()*TAU,rr=Math.sqrt(R())*cr*0.9,px=cx+Math.cos(an)*rr*0.75,py=cy+Math.sin(an)*rr;ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px+3,py-2,px+6,py);ctx.stroke();}
    ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,g0);ctx.lineTo(cx,cy+cr*0.6);ctx.stroke();ctx.lineWidth=1;}
  // the hall: three tiers, each a band of glass between columns, the band of iron along its top shaded in cross lines
  for(const [ya,yb,ins] of [[t1,g0,0],[t2,t1,w*0.03],[t3,t2,w*0.07]]){const a0=x0+ins,a1=x1-ins;ctx.fillStyle=rgba(mix(K.news,K.newsInk,0.1),1);ctx.fillRect(a0,ya,a1-a0,yb-ya);
    ctx.strokeStyle=ink(0.4);for(let xx=a0;xx<a1;xx+=w/90){ctx.beginPath();ctx.moveTo(xx,ya+4);ctx.lineTo(xx,yb);ctx.stroke();}
    ctx.strokeStyle=ink(0.9);ctx.lineWidth=1.6;for(let xx=a0;xx<=a1+0.5;xx+=w/30){ctx.beginPath();ctx.moveTo(xx,ya);ctx.lineTo(xx,yb);ctx.stroke();}
    ctx.lineWidth=1;ctx.strokeStyle=ink(0.7);for(let xx=a0;xx<a1;xx+=3){ctx.beginPath();ctx.moveTo(xx,ya);ctx.lineTo(xx+3,ya+4);ctx.stroke();}
    ctx.lineWidth=1.8;ctx.strokeStyle=ink(1);ctx.strokeRect(a0,ya,a1-a0,yb-ya);ctx.lineWidth=1;}
  // the ground: level lines, with small figures along the front
  ctx.strokeStyle=ink(0.35);for(let yy=g0+3;yy<y+h;yy+=4){ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);ctx.stroke();}
  ctx.fillStyle=ink(0.85);for(let k=0;k<70;k++){const px=x0+R()*(x1-x0),py=g0+6+R()*(h*0.12);ctx.fillRect(px,py-5,1.6,5);ctx.beginPath();ctx.arc(px+0.8,py-6.5,1.3,0,TAU);ctx.fill();}
  ctx.restore();ctx.strokeStyle=ink(1);ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);}
function et_news(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=w*0.64;if(a<=0.004)return{x,y,w,h};const K=ET_K;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));
  ctx.save();ctx.shadowColor="rgba(52,36,30,0.3)";ctx.shadowBlur=20;ctx.shadowOffsetX=LP.sdx;ctx.shadowOffsetY=12;ctx.fillStyle=rgba(K.news,1);ctx.fillRect(x,y,w,h);ctx.restore();
  if(o.small){ctx.fillStyle=rgba(K.newsInk,0.85);ctx.fillRect(x+w*0.1,y+h*0.07,w*0.8,h*0.07);et_engraving(ctx,x+w*0.07,y+h*0.24,w*0.86,h*0.52);
    ctx.fillStyle=rgba(K.newsInk,0.35);for(let k=0;k<3;k++)ctx.fillRect(x+w*0.07,y+h*(0.82+k*0.05),w*0.86,h*0.02);ctx.restore();return{x,y,w,h};}
  const pin=LP_PAD;lp_T(ctx,"THE ILLUSTRATED LONDON NEWS",x+w/2,y+pin+48,{w:800,size:40,ls:3,align:"center",col:K.newsInk});
  ctx.fillStyle=rgba(K.newsInk,1);ctx.fillRect(x+pin,y+pin+74,w-2*pin,3);lp_T(ctx,"Saturday, 6 July 1850",x+w/2,y+pin+118,{w:700,size:28,align:"center",col:K.newsInk});
  ctx.fillRect(x+pin,y+pin+138,w-2*pin,1.5);et_engraving(ctx,x+pin,y+pin+160,w-2*pin,h-pin*2-190);
  ctx.restore();return{x,y,w,h};}

/* ---------------------------------------------------------------- a glasshouse, in pen */
// the kind Paxton built for the gardens he ran: a long house of glass under a curved roof, its ribs close together, a door in its end
function et_glasshouse(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a,h=w*0.42;if(a<=0.004)return;const u=clamp(o.u==null?1:o.u,0,1);ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=rgba(ET_K.pen,0.9);ctx.lineWidth=3;ctx.lineCap="round";const base=y+h,top=y+h*0.18,cx=x+w/2;
  ctx.beginPath();ctx.moveTo(x,base);ctx.lineTo(x+w*u,base);ctx.stroke();
  ctx.beginPath();ctx.ellipse(cx,base-h*0.3,w*0.5,(h*0.82-h*0.3+h*0.18)*1,0,Math.PI,Math.PI+Math.PI*u);ctx.stroke();
  ctx.lineWidth=1.6;for(let i=1;i<18;i++){const f=i/18;if(f>u)break;const xx=x+w*f,dy=Math.sqrt(Math.max(0,1-Math.pow((xx-cx)/(w*0.5),2)))*(h*0.7);ctx.beginPath();ctx.moveTo(xx,base);ctx.lineTo(xx,base-h*0.3);ctx.lineTo(xx,base-h*0.3-dy);ctx.stroke();}
  if(u>0.6){ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x,base-h*0.3);ctx.lineTo(x+w,base-h*0.3);ctx.stroke();ctx.strokeRect(cx-w*0.04,base-h*0.28,w*0.08,h*0.28);}
  ctx.restore();}

/* ---------------------------------------------------------------- Joseph Paxton
   Bareheaded, his dark hair brushed to the side, short side whiskers; a dark frock coat over a waistcoat of a quiet brown, the shirt's
   white collar standing up from a black neckcloth wound round the neck and tied at the front. The neckcloth closes over the neck, so it
   is a picture of its own (who.over), laid over the person as Borrowed rights lays its stock. Never a likeness. */
// side whiskers: short hair down the cheek in front of the ear, from the temple to below the ear's lobe
function et_whiskers(c,P){const hc=P.hair.c,f=cc=>{cc.moveTo(272,404);cc.bezierCurveTo(269,428,269,452,276,474);cc.bezierCurveTo(280,482,288,482,290,474);
    cc.bezierCurveTo(286,452,285,428,286,406);cc.closePath();};
  c.save();ag_shape(c,f);c.clip();const g=c.createLinearGradient(0,404,0,482);g.addColorStop(0,rgba(hc,1));g.addColorStop(0.7,rgba(hc,0.9));g.addColorStop(1,rgba(hc,0));c.fillStyle=g;c.fillRect(260,400,40,86);
  c.strokeStyle=rgba(ag_lt(hc,0.3),0.35);c.lineWidth=1.4;c.lineCap="round";for(let k=0;k<5;k++){const yy=412+k*12;c.beginPath();c.moveTo(273,yy);c.quadraticCurveTo(279,yy+6,285,yy+9);c.stroke();}c.restore();}
// a black neckcloth wound high round the neck from the collar to a little under the jaw, tied in a small knot at the front; the shirt's
// white collar points standing up from it against the cheek, the shirt's front white below the knot; the waistcoat's buttons down the
// coat's opening. Figure space
const ET_STOCK=cc=>{cc.moveTo(238,524);cc.bezierCurveTo(258,533,278,541,296,546);cc.bezierCurveTo(312,551,328,554,344,556);
  cc.bezierCurveTo(350,572,356,590,362,606);cc.bezierCurveTo(330,620,282,616,248,596);cc.bezierCurveTo(238,588,233,578,232,566);cc.bezierCurveTo(232,552,235,538,238,524);cc.closePath();};
function et_neckcloth(o){return(c,P)=>{const cl=o.cloth,lt=ag_lt(cl,0.32),dk=ag_dk(cl,0.4),sh=o.shirt,sl=ag_lt(sh,0.5),sd=ag_dk(sh,0.4);
  // the waistcoat's buttons
  for(const [x,y] of [[313,736],[316,770],[319,804],[322,838]]){c.fillStyle=rgba(ag_dk(o.btn,0.45),0.55);c.beginPath();c.arc(x+1,y+1.5,5.4,0,TAU);c.fill();
    c.fillStyle=rgba(o.btn,1);c.beginPath();c.arc(x,y,5,0,TAU);c.fill();c.fillStyle="rgba(255,255,255,0.45)";c.beginPath();c.arc(x+1.5,y-1.5,1.7,0,TAU);c.fill();}
  // the shirt's white front in the waistcoat's opening, under the bow
  ag_soft(c,cc=>{cc.moveTo(298,600);cc.bezierCurveTo(320,610,340,610,358,602);cc.bezierCurveTo(354,632,344,662,332,690);cc.bezierCurveTo(318,664,306,632,298,600);cc.closePath();},sh,sl,336,616,60,rgba(sd,0.3),5);
  // the neckcloth: dark silk wound round, a soft sheen along it where the light from the window falls
  ag_soft(c,ET_STOCK,cl,lt,344,566,64,rgba(dk,0.5),10);
  c.save();ag_shape(c,ET_STOCK);c.clip();c.strokeStyle=rgba(lt,0.32);c.lineWidth=4;c.lineCap="round";c.filter="blur(2px)";
  c.beginPath();c.moveTo(262,566);c.bezierCurveTo(290,578,316,586,352,586);c.stroke();c.filter="none";c.restore();
  // a small bow at the front: two short loops and the knot between them
  const loop=(sx)=>cc=>{cc.moveTo(344,598);cc.bezierCurveTo(344+sx*10,586,344+sx*24,588,344+sx*24,598);cc.bezierCurveTo(344+sx*24,608,344+sx*10,610,344,600);cc.closePath();};
  ag_soft(c,loop(-1),cl,lt,334,594,16,rgba(dk,0.6),4);ag_soft(c,loop(1),cl,lt,356,594,16,rgba(dk,0.6),4);
  ag_soft(c,cc=>cc.ellipse(344,599,6,7,0,0,TAU),ag_dk(cl,0.1),lt,346,596,8,null);
  // the collar's white edge over the neckcloth's top, and the near point standing up against the cheek
  c.strokeStyle=rgba(sh,1);c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(240,526);c.bezierCurveTo(258,534,278,542,296,547);c.bezierCurveTo(312,552,328,555,343,557);c.stroke();
  ag_soft(c,cc=>{cc.moveTo(300,548);cc.lineTo(320,522);cc.lineTo(342,558);cc.closePath();},sh,[255,255,255],318,530,30,rgba(sd,0.35),4);};}
const ET_PAXTON={key:"et-paxton",name:"Joseph Paxton",role:"A gardener who built glasshouses",skin:[230,192,162],hair:{style:"side",c:[80,58,44]},
  top:{kind:"suit",c:[44,42,48],inner:[112,84,64]},hat:{paint:et_whiskers},over:et_neckcloth({cloth:[30,28,32],shirt:[242,238,230],btn:[150,122,84]}),overBox:[226,480,372,852],breath:0.25};
// a person, with what closes over their neck laid on them (who.over, painted once in who.overBox), lit as lp_person lights one: drawn
// whole on a canvas of their own, then the window's warmth and the room's shade, then laid on the picture at their opacity
function et_person(ctx,who,x,y,s,o){if(!who.over)return lp_person(ctx,who,x,y,s,o);o=o||{};const a=ctx.globalAlpha*(o.a==null?1:o.a);if(a<0.004)return null;
  const L0=Object.assign({light:"day",warm:0.12,shade:0.2,wall:0.16,wallDx:-90,wallDy:40},o.light||{}),Lt=LP_LIGHT[L0.light]||LP_LIGHT.day;
  const A=AG_FIG.anchor,m=ctx.getTransform(),M=m.translate(x,y).scale(o.flip?-s:s,s).translate(-A[0],-A[1]),cw=ctx.canvas.width,ch=ctx.canvas.height;
  const pt=(fx,fy)=>[M.a*fx+M.c*fy+M.e,M.b*fx+M.d*fy+M.f],k=Math.hypot(M.a,M.b);
  let L=1e9,R=-1e9,T0=1e9,B=-1e9;for(const [fx,fy] of [[-260,120],[820,120],[-260,1160],[820,1160]]){const q=pt(fx,fy);L=Math.min(L,q[0]);R=Math.max(R,q[0]);T0=Math.min(T0,q[1]);B=Math.max(B,q[1]);}
  L=Math.max(0,Math.floor(L));T0=Math.max(0,Math.floor(T0));R=Math.min(cw,Math.ceil(R));B=Math.min(ch,Math.ceil(B));if(R<=L||B<=T0)return null;const w=R-L,h=B-T0;
  const [pc,px]=ag_buf("etPerson",cw,ch);px.setTransform(m);let hands;
  try{hands=ag_person(px,who,x,y,s,Object.assign({},o,{light:undefined,a:undefined}));
    const F=ag_fig(who),Ly=F.over||(F.over=ag_layer(c=>who.over(c,who),who.overBox)),br=Math.sin((o.t||0)*TAU*who.breath)*2.2;
    px.save();px.translate(x,y);px.scale(o.flip?-s:s,s);px.translate(-A[0],-A[1]+br);
    if(o.cut!=null){px.beginPath();px.rect(-4000,-4000,9000,4000+A[1]+(o.cut-y)/s-br);px.clip();}ag_drawLayer(px,Ly);px.restore();}
  finally{px.setTransform(1,0,0,1,0,0);px.globalAlpha=1;}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);
  if(L0.wall>0){const sw=Math.max(2,Math.ceil(w/8)),sh=Math.max(2,Math.ceil(h/8)),[sc,sx]=ag_buf("etWallShadow",sw,sh);sx.filter="blur(2px)";sx.drawImage(pc,L,T0,w,h,0,0,sw,sh);sx.filter="none";
    sx.globalCompositeOperation="source-in";sx.fillStyle=rgba(LP.shade,1);sx.fillRect(0,0,sw,sh);
    const dx=L0.wallDx*k,dy=L0.wallDy*k;ctx.globalAlpha=a*L0.wall*(Lt.a>0?1:0.6);ctx.imageSmoothingQuality="high";ctx.drawImage(sc,0,0,sw,sh,L+dx-w*0.03,T0+dy,w*1.06,h*1.02);}
  px.globalCompositeOperation="source-atop";const g=px.createLinearGradient(L,0,R,0);
  g.addColorStop(0,rgba(LP.shade,L0.shade));g.addColorStop(0.5,rgba(LP.shade,L0.shade*0.25));g.addColorStop(0.62,rgba(Lt.col,0));g.addColorStop(1,rgba(Lt.col,L0.warm*(Lt.a>0?1:0.5)));
  px.fillStyle=g;px.fillRect(L,T0,w,h);px.globalCompositeOperation="source-over";
  ctx.globalAlpha=a;ctx.drawImage(pc,L,T0,w,h,L,T0,w,h);ctx.restore();return hands;}
