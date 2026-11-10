/* ===== Prototype first: Curitiba, May 1972 =====
   The film's own places and pictures for its opening story, in the module's matte, sunlit language, lit from the right as its rooms are
   (prefix pf_). The street is drawn as an architect draws an elevation: a row of plastered fronts from the turn of the century, two and
   three floors high, the pavement before them and the road in front, seen square on; its people are small scale figures, as on such a
   drawing, with no faces. Nothing here is a likeness of a real person or a copy of a photograph, and nothing is borrowed from the place's
   own ornament: no mosaic in the paving, no flag, no sign.
     pfDusk, pfDay, pfGrey, pfSun   the street, painted once in four lights: Friday's dusk, any day before, Saturday's grey morning, a
                                    sunny weekend after; one room (AG_ROOMS), so the camera glides between them
     pfShop                         one shop's front, close: the shopkeeper stands before it
     pf_road(ctx, o)                the road: o.stone (0 to 1, the stones laid over the asphalt, from the right), o.a
     pf_traffic(ctx, t, o)          cars and a bus filling the road, nose to tail, crawling (o.a, o.n: how many)
     pf_truck(ctx, x, o)            a city crew's truck, its bed loaded with stones (o.y: its lane, 860 by default)
     pf_barrier(ctx, x, o)          a trestle across the road: closed to cars
     pf_lamp(ctx, x, o)             a streetlight: o.kind "old" or "new", o.glow (0 to 1), o.k (0 to 1, it rises in)
     pf_kiosk(ctx, x, o)            a small kiosk on the pavement's edge
     pf_bed(ctx, x, o)              a long, low bed of flowers: o.k (0 to 1, the flowers come up)
     pf_paper(ctx, x0, x1, o)       a long strip of paper on the stones, painted along its length as o.u goes from 0 to 1
     pf_walker(ctx, x, y, s, o)     a small figure walking; pf_child(ctx, x, y, s, o) a child kneeling to paint
     pf_doom(ctx, o)                the widening plan: the fronts it would knock down, outlined in amber, o.u (0 to 1)
     pf_sketch(ctx, x, y, w, o)     a plan on paper: the street in pencil lines, o.a, o.k
     pf_walkers(ctx, t, list, o)    small figures walking, from a list made by pf_folk(seed, n, o)
     pf_print(ctx, x, y, w, a)      the street with its flowers, small, framed on the team's wall
     PF_PEOPLE                      the shopkeeper, dressed for 1972
   Colour keeps the module's meaning: the plan and the mayor's idea in blue, the street people use and what got better in green, the
   harm and the fears in amber; the street itself wears none of the five: its plaster, stone, timber and graphite mean nothing. */

const PF_K={sky0:[150,160,176],sky1:[226,214,200],dusk0:[70,74,98],dusk1:[214,160,128],grey0:[184,188,192],grey1:[214,214,212],
  sun0:[176,196,214],sun1:[238,226,204],asphalt:[92,88,88],asphaltDk:[70,66,68],kerb:[176,170,160],pave:[196,186,172],paveDk:[166,156,144],
  stone:[198,190,176],stoneDk:[150,142,130],glass:[70,70,80],glassLit:[255,214,150],frame:[236,230,218],
  plaster:[[232,220,196],[222,198,156],[214,182,162],[204,198,186],[230,214,172],[218,206,190]],
  leaf:[104,114,86],leafDk:[74,84,62],petal:[[248,244,236],[226,170,160],[244,224,200]],
  paint:[[255,214,150],[196,160,120],[200,150,140],[120,116,124],[226,190,120]],
  cloth:[[64,60,66],[150,124,96],[214,206,190],[120,96,90],[90,98,104],[176,150,120]]};
const PF_S={top:150,base:700,kerb:736,near:900,shopX:[]};

/* ---------------------------------------------------------------- the fronts, painted once */
// the row of fronts along the street, from the left edge to the right, each with its floors, windows, cornice and a shop below
const PF_FRONTS=(()=>{const R=ag_rnd(1972),out=[];let x=-60;let i=0;
  while(x<W+40){const w=230+Math.round(R()*130),fl=R()<0.55?3:2,h=fl===3?470+R()*40:350+R()*40;
    out.push({x,w,h,fl,col:PF_K.plaster[i%PF_K.plaster.length],win:w<280?2:3,shop:true,seed:Math.floor(R()*1e6)});x+=w;i++;}
  return out;})();
function pf_front(c,f,lit){const R=ag_rnd(f.seed),top=PF_S.base-f.h,col=f.col;
  // the wall, lit from the right: a little darker towards its left edge
  let g=c.createLinearGradient(f.x,0,f.x+f.w,0);g.addColorStop(0,rgba(ag_dk(col,0.08),1));g.addColorStop(1,rgba(ag_lt(col,0.04),1));
  c.fillStyle=g;c.fillRect(f.x,top,f.w,f.h);
  // the cornice and the parapet: a pale band, its shadow under it
  c.fillStyle=rgba(ag_lt(col,0.18),1);c.fillRect(f.x-4,top-16,f.w+8,20);c.fillStyle=rgba(LP.shade,0.22);c.fillRect(f.x,top+4,f.w,8);
  c.fillStyle=rgba(ag_lt(col,0.12),1);c.fillRect(f.x+6,top-34,f.w-12,18);
  // a band between the shop and the floors above
  const shopH=170,fh=(f.h-shopH-30)/(f.fl-1);
  c.fillStyle=rgba(ag_lt(col,0.14),1);c.fillRect(f.x-2,PF_S.base-shopH-14,f.w+4,14);c.fillStyle=rgba(LP.shade,0.18);c.fillRect(f.x,PF_S.base-shopH,f.w,6);
  // the windows of each floor above the shop: tall, with a pale frame, a sill and a shadow on their left
  for(let k=0;k<f.fl-1;k++){const wy=top+30+k*fh+fh*0.2,wh=fh*0.58,ww=Math.min(56,f.w/(f.win*2.2)),gap=(f.w-f.win*ww)/(f.win+1);
    for(let j=0;j<f.win;j++){const wx=f.x+gap+j*(ww+gap);c.fillStyle=rgba(PF_K.frame,1);c.fillRect(wx-6,wy-6,ww+12,wh+12);
      const on=lit&&R()<0.45;c.fillStyle=rgba(on?mix(PF_K.glassLit,PF_K.glass,0.25):PF_K.glass,1);c.fillRect(wx,wy,ww,wh);
      c.fillStyle=rgba(PF_K.frame,1);c.fillRect(wx+ww/2-2,wy,4,wh);c.fillRect(wx,wy+wh*0.38,ww,4);
      c.fillStyle=rgba(LP.shade,0.25);c.fillRect(wx-6,wy-6,6,wh+12);c.fillStyle=rgba(ag_lt(col,0.2),1);c.fillRect(wx-10,wy+wh+6,ww+20,8);}}
  // the shop: a wide window and a door, under a plain pale lintel
  const sy=PF_S.base-shopH+18,sw=f.w*0.62,sx=f.x+f.w*0.08,dx=sx+sw+f.w*0.07,dw=f.w*0.16;
  c.fillStyle=rgba(PF_K.frame,1);c.fillRect(sx-6,sy-6,sw+12,shopH-30);c.fillStyle=rgba(lit?mix(PF_K.glassLit,PF_K.glass,0.35):PF_K.glass,1);c.fillRect(sx,sy,sw,shopH-42);
  c.fillStyle=rgba(LP.shade,0.25);c.fillRect(sx-6,sy-6,6,shopH-30);
  c.fillStyle=rgba(ag_dk(LP.timber,0.25),1);c.fillRect(dx,sy+8,dw,shopH-26);c.fillStyle=rgba(LP.shade,0.25);c.fillRect(dx,sy+8,5,shopH-26);
  PF_S.shopX.push(sx+sw/2);}
function pf_paintFronts(c,lit){for(const f of PF_FRONTS)pf_front(c,f,lit);
  // the joins between fronts: a thin shadow
  c.fillStyle=rgba(LP.shade,0.25);for(const f of PF_FRONTS)c.fillRect(f.x,PF_S.base-f.h-30,3,f.h+30);}
// the pavement, the kerb and the asphalt; the near kerb at the frame's foot
function pf_paintGround(c){let g=c.createLinearGradient(0,PF_S.base,0,PF_S.kerb);g.addColorStop(0,rgba(PF_K.paveDk,1));g.addColorStop(1,rgba(PF_K.pave,1));
  c.fillStyle=g;c.fillRect(0,PF_S.base,W,PF_S.kerb-PF_S.base);c.fillStyle=rgba(PF_K.kerb,1);c.fillRect(0,PF_S.kerb-6,W,8);
  g=c.createLinearGradient(0,PF_S.kerb,0,PF_S.near);g.addColorStop(0,rgba(PF_K.asphaltDk,1));g.addColorStop(1,rgba(PF_K.asphalt,1));c.fillStyle=g;c.fillRect(0,PF_S.kerb+2,W,PF_S.near-PF_S.kerb-2);
  const R=ag_rnd(19);for(let k=0;k<900;k++){c.fillStyle=rgba(R()<0.5?PF_K.asphaltDk:ag_lt(PF_K.asphalt,0.12),0.35);c.fillRect(R()*W,PF_S.kerb+4+R()*(PF_S.near-PF_S.kerb-6),2+R()*3,1+R()*2);}
  c.fillStyle=rgba(PF_K.kerb,1);c.fillRect(0,PF_S.near,W,10);g=c.createLinearGradient(0,PF_S.near+10,0,H);g.addColorStop(0,rgba(PF_K.pave,1));g.addColorStop(1,rgba(PF_K.paveDk,1));
  c.fillStyle=g;c.fillRect(0,PF_S.near+10,W,H-PF_S.near-10);}
function pf_paintSky(c,k0,k1,o){o=o||{};let g=c.createLinearGradient(0,0,0,PF_S.base);g.addColorStop(0,rgba(k0,1));g.addColorStop(1,rgba(k1,1));c.fillStyle=g;c.fillRect(0,0,W,PF_S.base);
  if(o.sun){g=c.createRadialGradient(1700,80,20,1700,80,900);g.addColorStop(0,"rgba(255,236,200,0.55)");g.addColorStop(1,"rgba(255,236,200,0)");c.fillStyle=g;c.fillRect(0,0,W,PF_S.base);}
  // far roofs and a tower or two behind the fronts, pale with distance
  const R=ag_rnd(1973);c.fillStyle=rgba(mix(k1,k0,0.35),1);for(let x=-20;x<W;x+=120+R()*90){const h=300+R()*130;c.fillRect(x,PF_S.base-h-40,80+R()*90,h);}}
// the whole street in one light: o.tint (a colour laid over it, for the hour), o.lit (windows lit, at dusk)
function pf_paintStreet(c,o){pf_paintSky(c,o.k0,o.k1,o);pf_paintFronts(c,o.lit);pf_paintGround(c);
  if(o.tint){c.save();c.globalCompositeOperation="multiply";c.fillStyle=rgba(o.tint,1);c.fillRect(0,0,W,H);c.restore();}
  if(o.lit){c.save();c.globalCompositeOperation="screen";for(const x of PF_S.shopX){const g=c.createRadialGradient(x,PF_S.base-70,10,x,PF_S.base-40,220);
    g.addColorStop(0,"rgba(255,200,130,0.35)");g.addColorStop(1,"rgba(255,200,130,0)");c.fillStyle=g;c.fillRect(x-240,PF_S.base-300,480,420);}c.restore();}
  if(o.damp){c.fillStyle="rgba(230,232,236,0.10)";c.fillRect(0,0,W,PF_S.base);}
  // the fronts' soft shadow on the pavement, down and to the left
  c.fillStyle=rgba(LP.shade,o.lit?0.18:0.12);c.fillRect(0,PF_S.base,W,10);}
AG_PLACES.pfDay=c=>{PF_S.shopX.length=0;pf_paintStreet(c,{k0:PF_K.sun0,k1:PF_K.sun1,sun:true});};
AG_PLACES.pfSun=c=>{PF_S.shopX.length=0;pf_paintStreet(c,{k0:PF_K.sun0,k1:PF_K.sun1,sun:true,tint:[255,246,232]});};
AG_PLACES.pfGrey=c=>{PF_S.shopX.length=0;pf_paintStreet(c,{k0:PF_K.grey0,k1:PF_K.grey1,tint:[226,228,232],damp:true});};
AG_PLACES.pfDusk=c=>{PF_S.shopX.length=0;pf_paintStreet(c,{k0:PF_K.dusk0,k1:PF_K.dusk1,lit:true,tint:[176,160,170]});};
AG_ROOMS.pfDay=AG_ROOMS.pfSun=AG_ROOMS.pfGrey=AG_ROOMS.pfDusk="pfStreet";

/* ---------------------------------------------------------------- the road, its stones, and what moves on it */
// the stones, kept once: small, uneven blocks, laid in rows across the road
function pf_stoneTex(){return ag_kept("pfStones",W,PF_S.near-PF_S.kerb,(c,w,h)=>{const R=ag_rnd(1975);c.fillStyle=rgba(PF_K.stoneDk,1);c.fillRect(0,0,w,h);
  for(let y=0;y<h;y+=18){const off=(y/18)%2?9:0;for(let x=-off;x<w;x+=20+R()*6){const sw=16+R()*6,sh=14+R()*3,k=R();
    c.fillStyle=rgba(mix(PF_K.stone,PF_K.stoneDk,k*0.45),1);rr(c,x,y+1,sw,sh,4);c.fill();c.fillStyle=rgba(ag_lt(PF_K.stone,0.2),0.5);c.fillRect(x+sw-5,y+2,3,sh-3);}}});}
function pf_road(ctx,o){o=o||{};const a=o.a==null?1:o.a,k=clamp(o.stone||0,0,1);if(a<=0.004||k<=0)return;const tex=pf_stoneTex(),x0=W*(1-k);
  ctx.save();ctx.globalAlpha*=a;ctx.beginPath();ctx.rect(x0,PF_S.kerb+2,W-x0,PF_S.near-PF_S.kerb-2);ctx.clip();ctx.drawImage(tex,0,PF_S.kerb+2);
  // the laying edge: a soft line where the stones stop
  if(k<1){const g=ctx.createLinearGradient(x0,0,x0+40,0);g.addColorStop(0,rgba(LP.shade,0.35));g.addColorStop(1,rgba(LP.shade,0));ctx.fillStyle=g;ctx.fillRect(x0,PF_S.kerb+2,40,PF_S.near-PF_S.kerb-2);}
  ctx.restore();}
// a car seen from the side, 1970s, plain: o.col, its front to the right (o.flip: to the left)
function pf_car(ctx,x,y,o){o=o||{};const col=o.col||PF_K.cloth[4],L=o.len||210,flip=o.flip?-1:1;ctx.save();ctx.translate(x,y);ctx.scale(flip,1);
  ctx.fillStyle=rgba(LP.shade,0.22);ctx.beginPath();ctx.ellipse(-8,4,L*0.52,8,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(col,1);rr(ctx,-L/2,-50,L,36,12);ctx.fill();
  ctx.beginPath();ctx.moveTo(-L*0.3,-48);ctx.lineTo(-L*0.2,-80);ctx.lineTo(L*0.18,-80);ctx.lineTo(L*0.3,-48);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(mix([210,218,224],col,0.2),1);ctx.beginPath();ctx.moveTo(-L*0.25,-50);ctx.lineTo(-L*0.17,-74);ctx.lineTo(-L*0.02,-74);ctx.lineTo(-L*0.02,-50);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(L*0.02,-50);ctx.lineTo(L*0.02,-74);ctx.lineTo(L*0.15,-74);ctx.lineTo(L*0.25,-50);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(ag_lt(col,0.25),1);ctx.fillRect(-L/2+8,-46,L-16,4);
  for(const wx of [-L*0.3,L*0.3]){ctx.fillStyle=rgba(LP.graphite,1);ctx.beginPath();ctx.arc(wx,-14,16,0,TAU);ctx.fill();ctx.fillStyle=rgba([150,146,140],1);ctx.beginPath();ctx.arc(wx,-14,6,0,TAU);ctx.fill();}
  ctx.restore();}
function pf_bus(ctx,x,y,o){o=o||{};const L=380,col=o.col||[206,196,170];ctx.save();ctx.translate(x,y);
  ctx.fillStyle=rgba(LP.shade,0.22);ctx.beginPath();ctx.ellipse(-8,4,L*0.52,9,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(col,1);rr(ctx,-L/2,-130,L,116,16);ctx.fill();ctx.fillStyle=rgba(ag_dk(col,0.25),1);ctx.fillRect(-L/2,-40,L,8);
  ctx.fillStyle=rgba(mix([210,218,224],col,0.2),1);for(let k=0;k<6;k++)rr(ctx,-L/2+20+k*58,-116,46,44,6),ctx.fill();
  for(const wx of [-L*0.32,L*0.3]){ctx.fillStyle=rgba(LP.graphite,1);ctx.beginPath();ctx.arc(wx,-14,18,0,TAU);ctx.fill();ctx.fillStyle=rgba([150,146,140],1);ctx.beginPath();ctx.arc(wx,-14,7,0,TAU);ctx.fill();}
  ctx.restore();}
// the road full: cars and a bus nose to tail, crawling to the left, spaced by their lengths, long enough to keep the road full for a
// minute; o.close (a time): the street closes, the cars on it drive off to the left, and those still to come wait out of sight
const PF_JAM=(()=>{const R=ag_rnd(72),out=[];let x=-60,i=0,prev=105;while(x<3200){const bus=i%5===2,half=bus?190:105;if(i)x+=prev+half+24+R()*36;
  out.push([bus?"bus":"car",x,Math.floor(R()*6)]);prev=half;i++;}return out;})();
function pf_traffic(ctx,t,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const v=14,cl=o.close;
  for(const [k,x0,ci] of PF_JAM){let x=x0-v*t;
    if(cl!=null&&t>cl){const xc=x0-v*cl;if(xc>W+240)continue;const d=t-cl;x=xc-v*d-150*d*d;}
    if(x<-260||x>W+260)continue;k==="bus"?pf_bus(ctx,x,850,{}):pf_car(ctx,x,850,{col:PF_K.cloth[ci],flip:true});}
  ctx.restore();}
// a city crew's truck: a cab and a flat bed with stones on it
function pf_truck(ctx,x,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const y=o.y||860,col=[214,206,186];ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);
  ctx.fillStyle=rgba(LP.shade,0.25);ctx.beginPath();ctx.ellipse(-20,4,190,10,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(ag_dk(col,0.1),1);ctx.fillRect(-190,-58,260,30);
  ctx.fillStyle=rgba(PF_K.stone,1);for(let k=0;k<9;k++){ctx.beginPath();ctx.arc(-170+k*26,-64,16,Math.PI,TAU);ctx.fill();}
  ctx.fillStyle=rgba(col,1);rr(ctx,70,-120,110,92,12);ctx.fill();ctx.fillStyle=rgba(mix([210,218,224],col,0.2),1);rr(ctx,96,-108,70,40,6);ctx.fill();
  for(const wx of [-130,10,130]){ctx.fillStyle=rgba(LP.graphite,1);ctx.beginPath();ctx.arc(wx,-16,20,0,TAU);ctx.fill();ctx.fillStyle=rgba([150,146,140],1);ctx.beginPath();ctx.arc(wx,-16,8,0,TAU);ctx.fill();}
  ctx.restore();}
// a trestle across the road, its bar striped in graphite and cream
function pf_barrier(ctx,x,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;
  const y=870;ctx.strokeStyle=rgba(LP.graphite,1);ctx.lineWidth=7;ctx.lineCap="round";
  for(const dx of [-70,70]){ctx.beginPath();ctx.moveTo(x+dx-18,y);ctx.lineTo(x+dx,y-74);ctx.lineTo(x+dx+18,y);ctx.stroke();}
  for(let k=0;k<6;k++){ctx.fillStyle=rgba(k%2?LP.graphite:[240,234,220],1);ctx.fillRect(x-100+k*33.3,y-92,33.4,22);}
  ctx.restore();}

/* ---------------------------------------------------------------- what the weekend brought */
function pf_lamp(ctx,x,o){o=o||{};const a=(o.a==null?1:o.a)*clamp(o.k==null?1:o.k,0,1);if(a<=0.004)return;const base=PF_S.kerb,h=o.kind==="new"?250:230;ctx.save();ctx.globalAlpha*=a;
  if((o.glow||0)>0){const g=ctx.createRadialGradient(x,base-h,4,x,base-h,160);g.addColorStop(0,"rgba(255,226,170,"+(0.6*o.glow)+")");g.addColorStop(1,"rgba(255,226,170,0)");ctx.fillStyle=g;ctx.fillRect(x-170,base-h-170,340,340);}
  ctx.fillStyle=rgba(LP.graphite,1);ctx.fillRect(x-4,base-h,8,h);ctx.fillRect(x-12,base-12,24,12);
  if(o.kind==="new"){ctx.fillStyle=rgba(mix([248,244,232],[255,226,170],o.glow||0),1);ctx.beginPath();ctx.arc(x,base-h-18,22,0,TAU);ctx.fill();ctx.strokeStyle=rgba(LP.graphite,1);ctx.lineWidth=3;ctx.stroke();}
  else{ctx.fillRect(x,base-h,40,5);ctx.fillStyle=rgba(mix([236,230,214],[255,226,170],o.glow||0),1);ctx.beginPath();ctx.moveTo(x+26,base-h+4);ctx.lineTo(x+52,base-h+4);ctx.lineTo(x+46,base-h+22);ctx.lineTo(x+32,base-h+22);ctx.closePath();ctx.fill();}
  ctx.restore();}
function pf_kiosk(ctx,x,o){o=o||{};const a=(o.a==null?1:o.a)*clamp(o.k==null?1:o.k,0,1);if(a<=0.004)return;const base=PF_S.kerb,col=[226,218,200];ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(LP.shade,0.2);ctx.fillRect(x-60,base-6,110,8);
  ctx.fillStyle=rgba(col,1);ctx.fillRect(x-48,base-130,96,124);ctx.fillStyle=rgba(ag_dk(col,0.12),1);ctx.fillRect(x-48,base-130,16,124);
  ctx.fillStyle=rgba(PF_K.glass,1);ctx.fillRect(x-28,base-112,62,46);
  ctx.fillStyle=rgba(LP.graphite,1);ctx.beginPath();ctx.moveTo(x-62,base-130);ctx.lineTo(x,base-170);ctx.lineTo(x+62,base-130);ctx.closePath();ctx.fill();
  ctx.restore();}
// a long, low bed of flowers on the stones; the flowers come up as o.k goes from 0 to 1
function pf_bed(ctx,x,o){o=o||{};const a=o.a==null?1:o.a,k=clamp(o.k==null?1:o.k,0,1);if(a<=0.004||k<=0)return;const y=o.y||812,w=o.w||220,R=ag_rnd(Math.round(x));ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(LP.shade,0.22);ctx.fillRect(x-w/2-6,y+20,w+8,8);ctx.fillStyle=rgba([204,196,182],1);ctx.fillRect(x-w/2,y,w,26);ctx.fillStyle=rgba([176,168,154],1);ctx.fillRect(x-w/2,y,10,26);
  for(let i=0;i<26;i++){const fx=x-w/2+12+R()*(w-24),ph=R(),u=clamp(k*1.4-ph*0.4,0,1);if(u<=0)continue;const fh=(18+R()*22)*u,fy=y-fh;
    ctx.strokeStyle=rgba(PF_K.leafDk,1);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(fx,y+2);ctx.quadraticCurveTo(fx+3,y-fh*0.5,fx,fy);ctx.stroke();
    ctx.fillStyle=rgba(PF_K.leaf,1);ctx.beginPath();ctx.ellipse(fx-6,y-fh*0.45,7,3.5,-0.6,0,TAU);ctx.fill();
    const pc=PF_K.petal[Math.floor(R()*3)];ctx.fillStyle=rgba(pc,1);for(let p=0;p<5;p++){const an=p/5*TAU;ctx.beginPath();ctx.arc(fx+Math.cos(an)*4*u,fy+Math.sin(an)*4*u,3.6*u,0,TAU);ctx.fill();}
    ctx.fillStyle=rgba([236,196,120],1);ctx.beginPath();ctx.arc(fx,fy,2.2*u,0,TAU);ctx.fill();}
  ctx.restore();}
// a long strip of paper laid on the stones; o.u (0 to 1): it's painted along its length, in soft marks
function pf_paper(ctx,x0,x1,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const y=o.y||840,h=34,R=ag_rnd(Math.round(x0+x1));ctx.save();ctx.globalAlpha*=a;
  ctx.fillStyle=rgba(LP.shade,0.18);ctx.fillRect(x0+4,y+4,x1-x0,h);ctx.fillStyle=rgba(LP.paper,1);ctx.fillRect(x0,y,x1-x0,h);
  const n=Math.floor((x1-x0)/26),u=clamp(o.u||0,0,1);for(let i=0;i<n*u;i++){const px=x0+10+i*26+R()*8,c=PF_K.paint[Math.floor(R()*PF_K.paint.length)];
    ctx.fillStyle=rgba(c,0.85);ctx.beginPath();ctx.ellipse(px,y+h/2+(R()-0.5)*10,8+R()*8,5+R()*6,R()*3,0,TAU);ctx.fill();}
  ctx.restore();}
// small figures, as on an architect's drawing: no faces, plain clothes, lit from the right
function pf_walker(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const col=o.col||PF_K.cloth[0],skin=o.skin||[196,150,118],ph=o.ph||0,f=o.flip?-1:1;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*f,s);
  ctx.fillStyle=rgba(LP.shade,0.2);ctx.beginPath();ctx.ellipse(-6,0,22,4,0,0,TAU);ctx.fill();
  const sw=Math.sin(ph)*7;ctx.strokeStyle=rgba(ag_dk(col,0.35),1);ctx.lineWidth=8;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(-3,-46);ctx.lineTo(-3-sw,0);ctx.moveTo(3,-46);ctx.lineTo(3+sw,0);ctx.stroke();
  ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(-11,-50);ctx.bezierCurveTo(-13,-80,-10,-96,0,-98);ctx.bezierCurveTo(10,-96,13,-80,11,-50);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(ag_lt(col,0.18),1);ctx.beginPath();ctx.moveTo(4,-52);ctx.bezierCurveTo(9,-70,10,-88,4,-96);ctx.lineTo(9,-90);ctx.bezierCurveTo(13,-80,12,-64,10,-52);ctx.closePath();ctx.fill();
  ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.arc(0,-108,10,0,TAU);ctx.fill();ctx.fillStyle=rgba(o.hair||[60,48,40],1);ctx.beginPath();ctx.arc(-1,-111,10,Math.PI*1.05,TAU*0.98);ctx.fill();
  ctx.restore();}
function pf_child(ctx,x,y,s,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const col=o.col||PF_K.cloth[2],skin=o.skin||[200,156,122],f=o.flip?-1:1,dip=Math.sin(o.ph||0)*2;
  ctx.save();ctx.globalAlpha*=a;ctx.translate(x,y);ctx.scale(s*f,s);
  ctx.fillStyle=rgba(LP.shade,0.2);ctx.beginPath();ctx.ellipse(-4,2,24,4,0,0,TAU);ctx.fill();
  ctx.fillStyle=rgba(ag_dk(col,0.3),1);rr(ctx,-20,-14,30,14,6);ctx.fill();
  ctx.fillStyle=rgba(col,1);ctx.beginPath();ctx.moveTo(-16,-12);ctx.bezierCurveTo(-18,-36,-6,-52,8,-50+dip);ctx.bezierCurveTo(16,-44,14,-26,6,-12);ctx.closePath();ctx.fill();
  ctx.strokeStyle=rgba(col,1);ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(8,-40+dip);ctx.lineTo(24,-8);ctx.stroke();
  ctx.fillStyle=rgba(skin,1);ctx.beginPath();ctx.arc(16,-58+dip,9,0,TAU);ctx.fill();ctx.fillStyle=rgba(o.hair||[54,42,36],1);ctx.beginPath();ctx.arc(15,-61+dip,9,Math.PI*1.0,TAU*0.97);ctx.fill();
  ctx.restore();}
// a crowd of walkers from a list [{x, v, y, s, c (cloth), k (skin), h (hair)}]: each walks at v px a second (left when v < 0), and
// wraps round off the frame's edges, so nobody appears or vanishes in view; drawn from the farthest (smallest y) to the nearest
const PF_SKIN=[[196,150,118],[150,104,78],[226,186,150],[112,76,56],[210,166,130],[176,128,98]];
function pf_walkers(ctx,t,list,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const L=list.slice().sort((p,q)=>p.y-q.y);
  for(const p of L){const span=W+400,x=((p.x+p.v*t+200)%span+span)%span-200,pa=a*(p.a==null?1:p.a);if(pa<=0.004)continue;
    pf_walker(ctx,x,p.y,p.s,{a:pa,col:PF_K.cloth[p.c%PF_K.cloth.length],skin:PF_SKIN[p.k%PF_SKIN.length],hair:p.h,ph:(p.x*0.01+t)*Math.abs(p.v)*0.12,flip:p.v<0});}}
// a list of n walkers, seeded: on the pavement (o.y0 to o.y1), at o.s, walking at up to o.v
function pf_folk(seed,n,o){const R=ag_rnd(seed),out=[];for(let i=0;i<n;i++){const dir=R()<0.5?-1:1;
  out.push({x:R()*(W+400)-200,v:dir*(o.v*0.5+R()*o.v*0.5),y:o.y0+R()*(o.y1-o.y0),s:o.s*(0.92+R()*0.16),c:Math.floor(R()*6),k:Math.floor(R()*6),h:R()<0.3?[150,120,90]:null});}return out;}
// the widening plan: three fronts it would knock down, outlined in amber
const PF_DOOMED=[3,4,5];
function pf_doom(ctx,o){o=o||{};const u=clamp(o.u||0,0,1);if(u<=0.004)return;ctx.save();ctx.strokeStyle=rgba(LP.amber,1);ctx.lineWidth=6;ctx.setLineDash([22,14]);
  PF_DOOMED.forEach((i,j)=>{const f=PF_FRONTS[i],k=clamp(u*3-j,0,1);if(k<=0)return;ctx.globalAlpha=k;rr(ctx,f.x+8,PF_S.base-f.h-30,f.w-16,f.h+26,10);ctx.stroke();});
  ctx.restore();}
// a plan on paper: a sheet with the street drawn in pencil, its fronts and its road, and nothing of what it would be like to be there
function pf_sketch(ctx,x,y,w,o){o=o||{};const a=o.a==null?1:o.a;if(a<=0.004)return;const h=w*0.6;ctx.save();ctx.globalAlpha*=a;
  if(o.k!=null)ag_about(ctx,x+w/2,y+h/2,lerp(0.6,1,ag_spr(o.k,0,0.5)));lp_sheet(ctx,x,y,w,h,{light:null,pin:false});
  lp_label(ctx,x+36,y+70,"A plan on paper",{col:LP.mut});
  ctx.strokeStyle=rgba(LP.graphite,0.55);ctx.lineWidth=2.5;ctx.lineJoin="round";const gx=x+40,gw=w-80,gy=y+h-70,R=ag_rnd(1970);let fx=gx;
  while(fx<gx+gw-40){const fw=Math.min(gx+gw-fx,70+R()*50),fh=110+R()*90;ctx.strokeRect(fx,gy-fh,fw,fh);
    for(let k=0;k<2;k++)ctx.strokeRect(fx+12+k*(fw/2-6),gy-fh+18,fw/2-24,24);fx+=fw;}
  ctx.beginPath();ctx.moveTo(gx-10,gy+8);ctx.lineTo(gx+gw+10,gy+8);ctx.moveTo(gx-10,gy+44);ctx.lineTo(gx+gw+10,gy+44);ctx.stroke();
  ctx.setLineDash([14,10]);ctx.beginPath();ctx.moveTo(gx-10,gy+26);ctx.lineTo(gx+gw+10,gy+26);ctx.stroke();ctx.restore();}
// the street with its flowers, small, framed on the team's wall
function pf_print(ctx,x,y,w,a){if(a<=0.004)return;ctx.save();ctx.globalAlpha*=a;const h=w*0.56;lp_sheet(ctx,x,y,w,h,{light:"day"});
  ctx.save();ctx.beginPath();ctx.rect(x+22,y+22,w-44,h-44);ctx.clip();ctx.translate(x+22,y+22);const k=(w-44)/W;ctx.scale(k,k);ctx.translate(0,-(PF_S.base-(h-44)/k*0.62));
  ctx.drawImage(ag_place("pfSun"),0,0);pf_road(ctx,{stone:1});for(const bx of [300,820,1340,1780])pf_bed(ctx,bx,{k:1});ctx.restore();ctx.restore();}

/* ---------------------------------------------------------------- one shop's front, close */
AG_PLACES.pfShop=c=>{const col=PF_K.plaster[1];let g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,rgba(ag_dk(col,0.1),1));g.addColorStop(1,rgba(ag_lt(col,0.05),1));
  c.fillStyle=g;c.fillRect(0,0,W,H);
  // the band over the shop, the shop's wide window on the right, the door on the left
  c.fillStyle=rgba(ag_lt(col,0.16),1);c.fillRect(0,96,W,40);c.fillStyle=rgba(LP.shade,0.2);c.fillRect(0,136,W,12);
  c.fillStyle=rgba(PF_K.frame,1);c.fillRect(980,230,860,560);c.fillStyle=rgba(mix(PF_K.glass,[120,124,134],0.3),1);c.fillRect(1000,250,820,520);
  // goods behind the glass: plain shelves and boxes, no words
  c.fillStyle=rgba([176,160,140],0.55);for(let k=0;k<3;k++){c.fillRect(1020,400+k*130,780,10);for(let j=0;j<8;j++)c.fillRect(1040+j*95,350+k*130,60,50);}
  c.fillStyle="rgba(255,255,255,0.08)";c.beginPath();c.moveTo(1000,250);c.lineTo(1300,250);c.lineTo(1000,600);c.closePath();c.fill();
  c.fillStyle=rgba(LP.shade,0.25);c.fillRect(980,230,14,560);
  c.fillStyle=rgba(PF_K.frame,1);c.fillRect(180,220,300,580);c.fillStyle=rgba(ag_dk(LP.timber,0.25),1);c.fillRect(196,236,268,564);
  c.fillStyle=rgba(ag_dk(LP.timber,0.4),1);c.fillRect(214,260,232,240);c.fillRect(214,530,232,240);c.fillStyle=rgba(LP.shade,0.25);c.fillRect(180,220,14,580);
  // the pavement at its foot
  g=c.createLinearGradient(0,800,0,H);g.addColorStop(0,rgba(PF_K.paveDk,1));g.addColorStop(1,rgba(PF_K.pave,1));c.fillStyle=g;c.fillRect(0,800,W,H-800);
  c.fillStyle=rgba(LP.shade,0.15);c.fillRect(0,800,W,10);
  // the afternoon sun across the front, from the right
  g=c.createLinearGradient(W,0,600,0);g.addColorStop(0,"rgba(255,226,180,0.22)");g.addColorStop(1,"rgba(255,226,180,0)");c.fillStyle=g;c.fillRect(0,0,W,800);};

/* ---------------------------------------------------------------- the people of the story */
const PF_PEOPLE={
  shopkeeper:{name:"A shopkeeper",key:"pf-shopkeeper",skin:[214,172,140],hair:{style:"side",c:[52,42,36]},top:{kind:"apron",c:[226,222,212],apron:[150,132,112]},breath:0.27}
};
